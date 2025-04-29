// cjs require begin

// Modifications: preserve file positions






import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as util from './util.js'
import * as web from './web.js'
import * as xeto from './xeto.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class Etc extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Etc.type$; }

  static #emptyTags = undefined;

  static emptyTags() {
    if (Etc.#emptyTags === undefined) {
      Etc.static$init();
      if (Etc.#emptyTags === undefined) Etc.#emptyTags = null;
    }
    return Etc.#emptyTags;
  }

  static #dictIterateNulls = undefined;

  static dictIterateNulls() {
    if (Etc.#dictIterateNulls === undefined) {
      Etc.static$init();
      if (Etc.#dictIterateNulls === undefined) Etc.#dictIterateNulls = false;
    }
    return Etc.#dictIterateNulls;
  }

  static #list0 = undefined;

  static list0() {
    if (Etc.#list0 === undefined) {
      Etc.static$init();
      if (Etc.#list0 === undefined) Etc.#list0 = null;
    }
    return Etc.#list0;
  }

  static #toBase64 = undefined;

  static toBase64() {
    if (Etc.#toBase64 === undefined) {
      Etc.static$init();
      if (Etc.#toBase64 === undefined) Etc.#toBase64 = null;
    }
    return Etc.#toBase64;
  }

  static #fromBase64 = undefined;

  static fromBase64() {
    if (Etc.#fromBase64 === undefined) {
      Etc.static$init();
      if (Etc.#fromBase64 === undefined) Etc.#fromBase64 = null;
    }
    return Etc.#fromBase64;
  }

  static #emptyGridRef = undefined;

  static emptyGridRef() {
    if (Etc.#emptyGridRef === undefined) {
      Etc.static$init();
      if (Etc.#emptyGridRef === undefined) Etc.#emptyGridRef = null;
    }
    return Etc.#emptyGridRef;
  }

  static #tsKeyFormat = undefined;

  static tsKeyFormat() {
    if (Etc.#tsKeyFormat === undefined) {
      Etc.static$init();
      if (Etc.#tsKeyFormat === undefined) Etc.#tsKeyFormat = null;
    }
    return Etc.#tsKeyFormat;
  }

  static #cxActorLocalsKey = undefined;

  static cxActorLocalsKey() {
    if (Etc.#cxActorLocalsKey === undefined) {
      Etc.static$init();
      if (Etc.#cxActorLocalsKey === undefined) Etc.#cxActorLocalsKey = null;
    }
    return Etc.#cxActorLocalsKey;
  }

  static emptyDict() {
    return EmptyDict.val();
  }

  static makeDict(val) {
    const this$ = this;
    if (val == null) {
      return Etc.emptyDict();
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::Map"))) {
      return Etc.mapToDict(sys.ObjUtil.coerce(val, sys.Type.find("[sys::Str:sys::Obj?]")));
    }
    ;
    if (sys.ObjUtil.is(val, Dict.type$)) {
      return sys.ObjUtil.coerce(val, Dict.type$);
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      let tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
      sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).each(sys.ObjUtil.coerce((key) => {
        tags.set(key, Marker.val());
        return;
      }, sys.Type.find("|sys::V,sys::Int->sys::Void|")));
      return Etc.makeDict(tags);
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("Cannot create dict from ", sys.ObjUtil.typeof(val)));
  }

  static mapToDict(map) {
    const this$ = this;
    if (map.isEmpty()) {
      return Etc.emptyDict();
    }
    ;
    if ((sys.ObjUtil.compareGT(map.size(), 6) || Etc.dictIterateNulls())) {
      return MapDict.make(map);
    }
    ;
    let i = 0;
    let n0 = null;
    let n1 = null;
    let n2 = null;
    let n3 = null;
    let n4 = null;
    let n5 = null;
    let v0 = null;
    let v1 = null;
    let v2 = null;
    let v3 = null;
    let v4 = null;
    let v5 = null;
    map.each((v, n) => {
      if (v == null) {
        return;
      }
      ;
      let $_u0 = ((this$) => { let $_u1 = i; i = sys.Int.increment(i); return $_u1; })(this$);
      if (sys.ObjUtil.equals($_u0, 0)) {
        (n0 = n);
        (v0 = v);
      }
      else if (sys.ObjUtil.equals($_u0, 1)) {
        (n1 = n);
        (v1 = v);
      }
      else if (sys.ObjUtil.equals($_u0, 2)) {
        (n2 = n);
        (v2 = v);
      }
      else if (sys.ObjUtil.equals($_u0, 3)) {
        (n3 = n);
        (v3 = v);
      }
      else if (sys.ObjUtil.equals($_u0, 4)) {
        (n4 = n);
        (v4 = v);
      }
      else if (sys.ObjUtil.equals($_u0, 5)) {
        (n5 = n);
        (v5 = v);
      }
      else {
        throw sys.Err.make();
      }
      ;
      return;
    });
    let $_u2 = i;
    if (sys.ObjUtil.equals($_u2, 0)) {
      return Etc.emptyDict();
    }
    else if (sys.ObjUtil.equals($_u2, 1)) {
      return Dict1.make1(sys.ObjUtil.coerce(n0, sys.Str.type$), sys.ObjUtil.coerce(v0, sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u2, 2)) {
      return Dict2.make2(sys.ObjUtil.coerce(n0, sys.Str.type$), sys.ObjUtil.coerce(v0, sys.Obj.type$), sys.ObjUtil.coerce(n1, sys.Str.type$), sys.ObjUtil.coerce(v1, sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u2, 3)) {
      return Dict3.make3(sys.ObjUtil.coerce(n0, sys.Str.type$), sys.ObjUtil.coerce(v0, sys.Obj.type$), sys.ObjUtil.coerce(n1, sys.Str.type$), sys.ObjUtil.coerce(v1, sys.Obj.type$), sys.ObjUtil.coerce(n2, sys.Str.type$), sys.ObjUtil.coerce(v2, sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u2, 4)) {
      return Dict4.make4(sys.ObjUtil.coerce(n0, sys.Str.type$), sys.ObjUtil.coerce(v0, sys.Obj.type$), sys.ObjUtil.coerce(n1, sys.Str.type$), sys.ObjUtil.coerce(v1, sys.Obj.type$), sys.ObjUtil.coerce(n2, sys.Str.type$), sys.ObjUtil.coerce(v2, sys.Obj.type$), sys.ObjUtil.coerce(n3, sys.Str.type$), sys.ObjUtil.coerce(v3, sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u2, 5)) {
      return Dict5.make5(sys.ObjUtil.coerce(n0, sys.Str.type$), sys.ObjUtil.coerce(v0, sys.Obj.type$), sys.ObjUtil.coerce(n1, sys.Str.type$), sys.ObjUtil.coerce(v1, sys.Obj.type$), sys.ObjUtil.coerce(n2, sys.Str.type$), sys.ObjUtil.coerce(v2, sys.Obj.type$), sys.ObjUtil.coerce(n3, sys.Str.type$), sys.ObjUtil.coerce(v3, sys.Obj.type$), sys.ObjUtil.coerce(n4, sys.Str.type$), sys.ObjUtil.coerce(v4, sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u2, 6)) {
      return Dict6.make6(sys.ObjUtil.coerce(n0, sys.Str.type$), sys.ObjUtil.coerce(v0, sys.Obj.type$), sys.ObjUtil.coerce(n1, sys.Str.type$), sys.ObjUtil.coerce(v1, sys.Obj.type$), sys.ObjUtil.coerce(n2, sys.Str.type$), sys.ObjUtil.coerce(v2, sys.Obj.type$), sys.ObjUtil.coerce(n3, sys.Str.type$), sys.ObjUtil.coerce(v3, sys.Obj.type$), sys.ObjUtil.coerce(n4, sys.Str.type$), sys.ObjUtil.coerce(v4, sys.Obj.type$), sys.ObjUtil.coerce(n5, sys.Str.type$), sys.ObjUtil.coerce(v5, sys.Obj.type$));
    }
    else {
      throw sys.Err.make();
    }
    ;
  }

  static makeDict1(n, v) {
    if (v == null) {
      return Etc.emptyDict();
    }
    ;
    return Dict1.make1(n, sys.ObjUtil.coerce(v, sys.Obj.type$));
  }

  static makeDict2(n0, v0, n1, v1) {
    if (v0 == null) {
      return Etc.makeDict1(n1, v1);
    }
    ;
    if (v1 == null) {
      return Etc.makeDict1(n0, v0);
    }
    ;
    return Dict2.make2(n0, sys.ObjUtil.coerce(v0, sys.Obj.type$), n1, sys.ObjUtil.coerce(v1, sys.Obj.type$));
  }

  static makeDict3(n0, v0, n1, v1, n2, v2) {
    if (v0 == null) {
      return Etc.makeDict2(n1, v1, n2, v2);
    }
    ;
    if (v1 == null) {
      return Etc.makeDict2(n0, v0, n2, v2);
    }
    ;
    if (v2 == null) {
      return Etc.makeDict2(n0, v0, n1, v1);
    }
    ;
    return Dict3.make3(n0, sys.ObjUtil.coerce(v0, sys.Obj.type$), n1, sys.ObjUtil.coerce(v1, sys.Obj.type$), n2, sys.ObjUtil.coerce(v2, sys.Obj.type$));
  }

  static makeDict4(n0, v0, n1, v1, n2, v2, n3, v3) {
    if (v0 == null) {
      return Etc.makeDict3(n1, v1, n2, v2, n3, v3);
    }
    ;
    if (v1 == null) {
      return Etc.makeDict3(n0, v0, n2, v2, n3, v3);
    }
    ;
    if (v2 == null) {
      return Etc.makeDict3(n0, v0, n1, v1, n3, v3);
    }
    ;
    if (v3 == null) {
      return Etc.makeDict3(n0, v0, n1, v1, n2, v2);
    }
    ;
    return Dict4.make4(n0, sys.ObjUtil.coerce(v0, sys.Obj.type$), n1, sys.ObjUtil.coerce(v1, sys.Obj.type$), n2, sys.ObjUtil.coerce(v2, sys.Obj.type$), n3, sys.ObjUtil.coerce(v3, sys.Obj.type$));
  }

  static makeDict5(n0, v0, n1, v1, n2, v2, n3, v3, n4, v4) {
    if (v0 == null) {
      return Etc.makeDict4(n1, v1, n2, v2, n3, v3, n4, v4);
    }
    ;
    if (v1 == null) {
      return Etc.makeDict4(n0, v0, n2, v2, n3, v3, n4, v4);
    }
    ;
    if (v2 == null) {
      return Etc.makeDict4(n0, v0, n1, v1, n3, v3, n4, v4);
    }
    ;
    if (v3 == null) {
      return Etc.makeDict4(n0, v0, n1, v1, n2, v2, n4, v4);
    }
    ;
    if (v4 == null) {
      return Etc.makeDict4(n0, v0, n1, v1, n2, v2, n3, v3);
    }
    ;
    return Dict5.make5(n0, sys.ObjUtil.coerce(v0, sys.Obj.type$), n1, sys.ObjUtil.coerce(v1, sys.Obj.type$), n2, sys.ObjUtil.coerce(v2, sys.Obj.type$), n3, sys.ObjUtil.coerce(v3, sys.Obj.type$), n4, sys.ObjUtil.coerce(v4, sys.Obj.type$));
  }

  static makeDict6(n0, v0, n1, v1, n2, v2, n3, v3, n4, v4, n5, v5) {
    if (v0 == null) {
      return Etc.makeDict5(n1, v1, n2, v2, n3, v3, n4, v4, n5, v5);
    }
    ;
    if (v1 == null) {
      return Etc.makeDict5(n0, v0, n2, v2, n3, v3, n4, v4, n5, v5);
    }
    ;
    if (v2 == null) {
      return Etc.makeDict5(n0, v0, n1, v1, n3, v3, n4, v4, n5, v5);
    }
    ;
    if (v3 == null) {
      return Etc.makeDict5(n0, v0, n1, v1, n2, v2, n4, v4, n5, v5);
    }
    ;
    if (v4 == null) {
      return Etc.makeDict5(n0, v0, n1, v1, n2, v2, n3, v3, n5, v5);
    }
    ;
    if (v5 == null) {
      return Etc.makeDict5(n0, v0, n1, v1, n2, v2, n3, v3, n4, v4);
    }
    ;
    return Dict6.make6(n0, sys.ObjUtil.coerce(v0, sys.Obj.type$), n1, sys.ObjUtil.coerce(v1, sys.Obj.type$), n2, sys.ObjUtil.coerce(v2, sys.Obj.type$), n3, sys.ObjUtil.coerce(v3, sys.Obj.type$), n4, sys.ObjUtil.coerce(v4, sys.Obj.type$), n5, sys.ObjUtil.coerce(v5, sys.Obj.type$));
  }

  static dict0() {
    return EmptyDict.val();
  }

  static dict1(n, v) {
    return Dict1.make1(n, v);
  }

  static dict2(n0, v0, n1, v1) {
    return Dict2.make2(n0, v0, n1, v1);
  }

  static dict3(n0, v0, n1, v1, n2, v2) {
    return Dict3.make3(n0, v0, n1, v1, n2, v2);
  }

  static dict4(n0, v0, n1, v1, n2, v2, n3, v3) {
    return Dict4.make4(n0, v0, n1, v1, n2, v2, n3, v3);
  }

  static dict5(n0, v0, n1, v1, n2, v2, n3, v3, n4, v4) {
    return Dict5.make5(n0, v0, n1, v1, n2, v2, n3, v3, n4, v4);
  }

  static dict6(n0, v0, n1, v1, n2, v2, n3, v3, n4, v4, n5, v5) {
    return Dict6.make6(n0, v0, n1, v1, n2, v2, n3, v3, n4, v4, n5, v5);
  }

  static dictFromMap(map) {
    const this$ = this;
    if (map.isEmpty()) {
      return Etc.dict0();
    }
    ;
    if (sys.ObjUtil.compareGT(map.size(), 6)) {
      return NotNullMapDict.make(map);
    }
    ;
    let i = 0;
    let n0 = null;
    let n1 = null;
    let n2 = null;
    let n3 = null;
    let n4 = null;
    let n5 = null;
    let v0 = null;
    let v1 = null;
    let v2 = null;
    let v3 = null;
    let v4 = null;
    let v5 = null;
    map.each((v, n) => {
      let $_u3 = ((this$) => { let $_u4 = i; i = sys.Int.increment(i); return $_u4; })(this$);
      if (sys.ObjUtil.equals($_u3, 0)) {
        (n0 = n);
        (v0 = v);
      }
      else if (sys.ObjUtil.equals($_u3, 1)) {
        (n1 = n);
        (v1 = v);
      }
      else if (sys.ObjUtil.equals($_u3, 2)) {
        (n2 = n);
        (v2 = v);
      }
      else if (sys.ObjUtil.equals($_u3, 3)) {
        (n3 = n);
        (v3 = v);
      }
      else if (sys.ObjUtil.equals($_u3, 4)) {
        (n4 = n);
        (v4 = v);
      }
      else if (sys.ObjUtil.equals($_u3, 5)) {
        (n5 = n);
        (v5 = v);
      }
      else {
        throw sys.Err.make();
      }
      ;
      return;
    });
    let $_u5 = i;
    if (sys.ObjUtil.equals($_u5, 0)) {
      return Etc.emptyDict();
    }
    else if (sys.ObjUtil.equals($_u5, 1)) {
      return Dict1.make1(sys.ObjUtil.coerce(n0, sys.Str.type$), sys.ObjUtil.coerce(v0, sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u5, 2)) {
      return Dict2.make2(sys.ObjUtil.coerce(n0, sys.Str.type$), sys.ObjUtil.coerce(v0, sys.Obj.type$), sys.ObjUtil.coerce(n1, sys.Str.type$), sys.ObjUtil.coerce(v1, sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u5, 3)) {
      return Dict3.make3(sys.ObjUtil.coerce(n0, sys.Str.type$), sys.ObjUtil.coerce(v0, sys.Obj.type$), sys.ObjUtil.coerce(n1, sys.Str.type$), sys.ObjUtil.coerce(v1, sys.Obj.type$), sys.ObjUtil.coerce(n2, sys.Str.type$), sys.ObjUtil.coerce(v2, sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u5, 4)) {
      return Dict4.make4(sys.ObjUtil.coerce(n0, sys.Str.type$), sys.ObjUtil.coerce(v0, sys.Obj.type$), sys.ObjUtil.coerce(n1, sys.Str.type$), sys.ObjUtil.coerce(v1, sys.Obj.type$), sys.ObjUtil.coerce(n2, sys.Str.type$), sys.ObjUtil.coerce(v2, sys.Obj.type$), sys.ObjUtil.coerce(n3, sys.Str.type$), sys.ObjUtil.coerce(v3, sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u5, 5)) {
      return Dict5.make5(sys.ObjUtil.coerce(n0, sys.Str.type$), sys.ObjUtil.coerce(v0, sys.Obj.type$), sys.ObjUtil.coerce(n1, sys.Str.type$), sys.ObjUtil.coerce(v1, sys.Obj.type$), sys.ObjUtil.coerce(n2, sys.Str.type$), sys.ObjUtil.coerce(v2, sys.Obj.type$), sys.ObjUtil.coerce(n3, sys.Str.type$), sys.ObjUtil.coerce(v3, sys.Obj.type$), sys.ObjUtil.coerce(n4, sys.Str.type$), sys.ObjUtil.coerce(v4, sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u5, 6)) {
      return Dict6.make6(sys.ObjUtil.coerce(n0, sys.Str.type$), sys.ObjUtil.coerce(v0, sys.Obj.type$), sys.ObjUtil.coerce(n1, sys.Str.type$), sys.ObjUtil.coerce(v1, sys.Obj.type$), sys.ObjUtil.coerce(n2, sys.Str.type$), sys.ObjUtil.coerce(v2, sys.Obj.type$), sys.ObjUtil.coerce(n3, sys.Str.type$), sys.ObjUtil.coerce(v3, sys.Obj.type$), sys.ObjUtil.coerce(n4, sys.Str.type$), sys.ObjUtil.coerce(v4, sys.Obj.type$), sys.ObjUtil.coerce(n5, sys.Str.type$), sys.ObjUtil.coerce(v5, sys.Obj.type$));
    }
    else {
      throw sys.Err.make();
    }
    ;
  }

  static link(fromRef, fromSlot) {
    return Etc.linkWrap(Etc.dict3("fromRef", fromRef, "fromSlot", fromSlot, "spec", MLink.specRef()));
  }

  static linkWrap(wrap) {
    if (sys.ObjUtil.is(wrap, xeto.Link.type$)) {
      return sys.ObjUtil.coerce(wrap, xeto.Link.type$);
    }
    ;
    if (wrap.get("spec") == null) {
      (wrap = Etc.dictSet(wrap, "spec", MLink.specRef()));
    }
    ;
    return MLink.make(wrap);
  }

  static links(val) {
    const this$ = this;
    if (val == null) {
      return MLinks.empty();
    }
    ;
    if (sys.ObjUtil.is(val, xeto.Links.type$)) {
      return sys.ObjUtil.coerce(val, xeto.Links.type$);
    }
    ;
    let wrap = sys.ObjUtil.coerce(val, Dict.type$);
    if (wrap.isEmpty()) {
      return MLinks.empty();
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    wrap.each((v, n) => {
      if (sys.ObjUtil.is(v, Dict.type$)) {
        acc.set(n, Etc.linkWrap(sys.ObjUtil.coerce(v, Dict.type$)));
      }
      else {
        if (sys.ObjUtil.is(v, sys.Type.find("sys::List"))) {
          acc.set(n, sys.ObjUtil.coerce(v, sys.Type.find("sys::List")).map((x) => {
            return Etc.linkWrap(sys.ObjUtil.coerce(x, Dict.type$));
          }, xeto.Link.type$));
        }
        else {
          if (sys.ObjUtil.compareNE(n, "spec")) {
            throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid tag for links: ", n), " = "), v), " ["), sys.ObjUtil.typeof(v)), "]"));
          }
          ;
        }
        ;
      }
      ;
      return;
    });
    acc.set("spec", MLinks.specRef());
    return MLinks.make(Etc.dictFromMap(acc));
  }

  static makeDicts(maps) {
    const this$ = this;
    return sys.ObjUtil.coerce(maps.map((map) => {
      return Etc.makeDict(map);
    }, Dict.type$), sys.Type.find("haystack::Dict[]"));
  }

  static dictNames(d) {
    const this$ = this;
    let names = sys.List.make(sys.Str.type$);
    Etc.dictEach(d, (v, n) => {
      names.add(n);
      return;
    });
    return names;
  }

  static dictsNames(dicts) {
    const this$ = this;
    let map = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"));
    let hasId = false;
    let hasDef = false;
    let hasName = false;
    let hasMod = false;
    dicts.each((dict) => {
      if (dict == null) {
        return;
      }
      ;
      Etc.dictEach(sys.ObjUtil.coerce(dict, Dict.type$), (v, n) => {
        if (sys.ObjUtil.equals(n, "id")) {
          (hasId = true);
          return;
        }
        ;
        if (sys.ObjUtil.equals(n, "def")) {
          (hasDef = true);
          return;
        }
        ;
        if (sys.ObjUtil.equals(n, "name")) {
          (hasName = true);
          return;
        }
        ;
        if (sys.ObjUtil.equals(n, "mod")) {
          (hasMod = true);
          return;
        }
        ;
        map.set(n, n);
        return;
      });
      return;
    });
    let list = map.vals().sort();
    if (hasName) {
      list.insert(0, "name");
    }
    ;
    if (hasDef) {
      list.insert(0, "def");
    }
    ;
    if (hasId) {
      list.insert(0, "id");
    }
    ;
    if (hasMod) {
      list.add("mod");
    }
    ;
    return list;
  }

  static dictVals(d) {
    const this$ = this;
    let vals = sys.List.make(sys.Obj.type$);
    d.each((v, n) => {
      vals.add(v);
      return;
    });
    return vals;
  }

  static dictToMap(d) {
    const this$ = this;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    if (d != null) {
      Etc.dictEach(sys.ObjUtil.coerce(d, Dict.type$), (v, n) => {
        map.set(n, v);
        return;
      });
    }
    ;
    return map;
  }

  static dictEach(d, f) {
    if (Etc.dictIterateNulls()) {
      if (sys.ObjUtil.is(d, Row.type$)) {
        return Etc.rowEach(sys.ObjUtil.coerce(d, Row.type$), f, false);
      }
      ;
      if (sys.ObjUtil.is(d, MapDict.type$)) {
        return sys.ObjUtil.coerce(d, MapDict.type$).tags().each(f);
      }
      ;
    }
    ;
    d.each(f);
    return;
  }

  static dictEachWhile(d, f) {
    if (Etc.dictIterateNulls()) {
      if (sys.ObjUtil.is(d, Row.type$)) {
        return Etc.rowEach(sys.ObjUtil.coerce(d, Row.type$), f, true);
      }
      ;
      if (sys.ObjUtil.is(d, MapDict.type$)) {
        return sys.ObjUtil.coerce(d, MapDict.type$).tags().eachWhile(f);
      }
      ;
    }
    ;
    return d.eachWhile(f);
  }

  static rowEach(r, f, isWhile) {
    const this$ = this;
    return r.grid().cols().eachWhile((col) => {
      let x = sys.Func.call(f, r.val(col), col.name());
      return ((this$) => { if (isWhile) return x; return null; })(this$);
    });
  }

  static dictFind(d, f) {
    const this$ = this;
    return Etc.dictEachWhile(d, (v, n) => {
      return ((this$) => { if (sys.Func.call(f, v, n)) return v; return null; })(this$);
    });
  }

  static dictFindAll(d, f) {
    const this$ = this;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    Etc.dictEach(d, (v, n) => {
      if (sys.Func.call(f, v, n)) {
        map.set(n, v);
      }
      ;
      return;
    });
    return Etc.makeDict(map);
  }

  static dictMap(d, f) {
    const this$ = this;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    Etc.dictEach(d, (v, n) => {
      map.set(n, sys.Func.call(f, v, n));
      return;
    });
    return Etc.makeDict(map);
  }

  static dictAny(d, f) {
    const this$ = this;
    let r = false;
    Etc.dictEach(d, (v, n) => {
      if (!r) {
        (r = sys.Func.call(f, v, n));
      }
      ;
      return;
    });
    return r;
  }

  static dictAll(d, f) {
    const this$ = this;
    let r = true;
    Etc.dictEach(d, (v, n) => {
      if (r) {
        (r = sys.Func.call(f, v, n));
      }
      ;
      return;
    });
    return r;
  }

  static dictMerge(a, b) {
    const this$ = this;
    if (b == null) {
      return a;
    }
    ;
    if (sys.ObjUtil.is(b, Dict.type$)) {
      let bd = sys.ObjUtil.coerce(b, Dict.type$);
      if (a.isEmpty()) {
        return Etc.dictRemoveAllWithVal(bd, Remove.val());
      }
      ;
      if (bd.isEmpty()) {
        return a;
      }
      ;
      let tags = Etc.dictToMap(a);
      Etc.dictEach(bd, (v, n) => {
        if (v === Remove.val()) {
          tags.remove(n);
        }
        else {
          tags.set(n, v);
        }
        ;
        return;
      });
      return Etc.makeDict(tags);
    }
    else {
      let bm = sys.ObjUtil.coerce(b, sys.Type.find("[sys::Str:sys::Obj?]"));
      if (bm.isEmpty()) {
        return a;
      }
      ;
      let tags = Etc.dictToMap(a);
      bm.each((v, n) => {
        if (v === Remove.val()) {
          tags.remove(n);
        }
        else {
          tags.set(n, v);
        }
        ;
        return;
      });
      return Etc.makeDict(tags);
    }
    ;
  }

  static dictRemoveAllWithVal(d, val) {
    const this$ = this;
    if (d.isEmpty()) {
      return d;
    }
    ;
    let map = null;
    Etc.dictEach(d, (v, n) => {
      if (sys.ObjUtil.compareNE(v, val)) {
        return;
      }
      ;
      if (map == null) {
        (map = Etc.dictToMap(d));
      }
      ;
      map.remove(n);
      return;
    });
    if (map == null) {
      return d;
    }
    ;
    return Etc.makeDict(map);
  }

  static dictRemoveNulls(d) {
    return Etc.dictRemoveAllWithVal(d, null);
  }

  static dictSet(d, name, val) {
    const this$ = this;
    if (((d == null || d.isEmpty()) && !Etc.dictIterateNulls())) {
      return Etc.makeDict1(name, val);
    }
    ;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    if (d != null) {
      if (sys.ObjUtil.is(d, Row.type$)) {
        map.ordered(true);
      }
      ;
      Etc.dictEach(sys.ObjUtil.coerce(d, Dict.type$), (v, n) => {
        map.set(n, v);
        return;
      });
    }
    ;
    map.set(name, val);
    return Etc.makeDict(map);
  }

  static dictRemove(d, name) {
    const this$ = this;
    if (d.missing(name)) {
      return d;
    }
    ;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    Etc.dictEach(d, (v, n) => {
      map.set(n, v);
      return;
    });
    map.remove(name);
    return Etc.makeDict(map);
  }

  static dictRemoveAll(d, names) {
    const this$ = this;
    if (names.isEmpty()) {
      return d;
    }
    ;
    if (sys.ObjUtil.equals(names.size(), 1)) {
      return Etc.dictRemove(d, names.get(0));
    }
    ;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    Etc.dictEach(d, (v, n) => {
      map.set(n, v);
      return;
    });
    names.each((n) => {
      map.remove(n);
      return;
    });
    return Etc.makeDict(map);
  }

  static dictRename(d, oldName, newName) {
    const this$ = this;
    let val = d.get(oldName);
    if (val == null) {
      return d;
    }
    ;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    Etc.dictEach(d, (v, n) => {
      map.set(n, v);
      return;
    });
    map.remove(oldName);
    map.set(newName, val);
    return Etc.makeDict(map);
  }

  static dictHashKey(d) {
    return DictHashKey.make(d);
  }

  static dictEq(a, b) {
    const this$ = this;
    let x = a.eachWhile((v, n) => {
      return ((this$) => { if (Etc.eq(b.get(n), v)) return null; return "ne"; })(this$);
    });
    if (x != null) {
      return false;
    }
    ;
    (x = b.eachWhile((v, n) => {
      return ((this$) => { if (a.has(n)) return null; return "ne"; })(this$);
    }));
    if (x != null) {
      return false;
    }
    ;
    return true;
  }

  static dictDump(d, out) {
    if (out === undefined) out = sys.Env.cur().out();
    const this$ = this;
    let keys = Etc.dictNames(d).sort();
    keys.each((n) => {
      let v = d.get(n);
      out.print("  ").print(n);
      if (v !== Marker.val()) {
        out.print(": ").print(Etc.valToDis(v));
      }
      ;
      out.printLine();
      return;
    });
    out.flush();
    return;
  }

  static dictToStr(d) {
    const this$ = this;
    let s = sys.StrBuf.make();
    s.add("{");
    Etc.dictEach(d, (v, n) => {
      if (sys.ObjUtil.compareGT(s.size(), 1)) {
        s.add(", ");
      }
      ;
      s.add(n);
      if (v === Marker.val()) {
        return;
      }
      ;
      s.addChar(58);
      if (sys.ObjUtil.is(v, Ref.type$)) {
        s.addChar(64);
      }
      ;
      s.add(v);
      return;
    });
    return s.add("}").toStr();
  }

  static dictGetDuration(d, name, def, remove) {
    if (def === undefined) def = (def = null);
    if (remove === undefined) remove = def;
    let val = d.get(name);
    if (val === Remove.val()) {
      return remove;
    }
    ;
    let num = sys.ObjUtil.as(val, Number.type$);
    if (num != null) {
      return num.toDuration();
    }
    ;
    return def;
  }

  static dictGetInt(d, name, def, remove) {
    if (def === undefined) def = (def = null);
    if (remove === undefined) remove = def;
    let val = d.get(name);
    if (val === Remove.val()) {
      return remove;
    }
    ;
    let num = sys.ObjUtil.as(val, Number.type$);
    if (num != null) {
      return sys.ObjUtil.coerce(num.toInt(), sys.Int.type$.toNullable());
    }
    ;
    return def;
  }

  static toHaystack(val, opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    if (val == null) {
      return null;
    }
    ;
    let kind = Kind.fromVal(val, false);
    if (kind != null) {
      if (kind.isDict()) {
        return Etc.dictToHaystack(sys.ObjUtil.coerce(val, Dict.type$), opts);
      }
      ;
      if (kind.isList()) {
        return sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).map((x) => {
          return Etc.toHaystack(x, opts);
        }, sys.Obj.type$.toNullable());
      }
      ;
      if (kind.isGrid()) {
        throw sys.UnsupportedErr.make("Cannot use toHaystack with grid");
      }
      ;
      return val;
    }
    ;
    if ((opts != null && opts.has("checked"))) {
      throw NotHaystackErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid haystack type: ", val), " ["), sys.ObjUtil.typeof(val)), "]"));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Num.type$)) {
      return Number.make(sys.Num.toFloat(sys.ObjUtil.coerce(val, sys.Num.type$)));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Duration.type$)) {
      return Number.makeDuration(sys.ObjUtil.coerce(val, sys.Duration.type$), null);
    }
    ;
    return sys.ObjUtil.toStr(val);
  }

  static dictToHaystack(dict, opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    return sys.ObjUtil.coerce(dict.map((x) => {
      return sys.ObjUtil.coerce(Etc.toHaystack(x, opts), sys.Obj.type$);
    }, sys.Obj.type$), Dict.type$);
  }

  static eq(a, b) {
    if ((sys.ObjUtil.is(a, sys.Type.find("sys::List")) && sys.ObjUtil.is(b, sys.Type.find("sys::List")))) {
      return Etc.listEq(sys.ObjUtil.coerce(a, sys.Type.find("sys::Obj?[]")), sys.ObjUtil.coerce(b, sys.Type.find("sys::Obj?[]")));
    }
    ;
    if ((sys.ObjUtil.is(a, Dict.type$) && sys.ObjUtil.is(b, Dict.type$))) {
      return Etc.dictEq(sys.ObjUtil.coerce(a, Dict.type$), sys.ObjUtil.coerce(b, Dict.type$));
    }
    ;
    if ((sys.ObjUtil.is(a, Grid.type$) && sys.ObjUtil.is(b, Grid.type$))) {
      return Etc.gridEq(sys.ObjUtil.coerce(a, Grid.type$), sys.ObjUtil.coerce(b, Grid.type$));
    }
    ;
    return sys.ObjUtil.equals(a, b);
  }

  static listEq(a, b) {
    const this$ = this;
    if (sys.ObjUtil.compareNE(a.size(), b.size())) {
      return false;
    }
    ;
    return a.all((av, i) => {
      return Etc.eq(av, b.get(i));
    });
  }

  static gridEq(a, b) {
    if (!Etc.dictEq(a.meta(), b.meta())) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareNE(a.cols().size(), b.cols().size())) {
      return false;
    }
    ;
    for (let i = 0; sys.ObjUtil.compareLT(i, a.cols().size()); i = sys.Int.increment(i)) {
      let ac = a.cols().get(i);
      let bc = b.cols().get(i);
      if (sys.ObjUtil.compareNE(ac.name(), bc.name())) {
        return false;
      }
      ;
      if (!Etc.dictEq(ac.meta(), bc.meta())) {
        return false;
      }
      ;
    }
    ;
    if (sys.ObjUtil.compareNE(a.size(), b.size())) {
      return false;
    }
    ;
    for (let ri = 0; sys.ObjUtil.compareLT(ri, a.size()); ri = sys.Int.increment(ri)) {
      let ar = a.get(ri);
      let br = b.get(ri);
      for (let ci = 0; sys.ObjUtil.compareLT(ci, a.cols().size()); ci = sys.Int.increment(ci)) {
        if (!Etc.eq(ar.val(a.cols().get(ci)), br.val(b.cols().get(ci)))) {
          return false;
        }
        ;
      }
      ;
    }
    ;
    return true;
  }

  static dictToDis(dict, def) {
    if (def === undefined) def = "";
    let d = null;
    (d = dict.get("dis", null));
    if (d != null) {
      return sys.ObjUtil.toStr(d);
    }
    ;
    (d = dict.get("disMacro", null));
    if (d != null) {
      return Etc.macro(sys.ObjUtil.toStr(d), dict);
    }
    ;
    (d = dict.get("disKey", null));
    if (d != null) {
      return Etc.disKey(sys.ObjUtil.coerce(d, sys.Str.type$));
    }
    ;
    (d = dict.get("name", null));
    if (d != null) {
      return sys.ObjUtil.toStr(d);
    }
    ;
    (d = dict.get("def", null));
    if (d != null) {
      return sys.ObjUtil.toStr(d);
    }
    ;
    (d = dict.get("tag", null));
    if (d != null) {
      return sys.ObjUtil.toStr(d);
    }
    ;
    let id = sys.ObjUtil.as(dict.get("id", null), Ref.type$);
    if (id != null) {
      return id.dis();
    }
    ;
    return def;
  }

  static relDis(parent, child) {
    let p = sys.Str.split(parent);
    let c = sys.Str.split(child);
    let m = sys.Int.min(p.size(), c.size());
    let i = 0;
    while ((sys.ObjUtil.compareLT(i, m) && sys.ObjUtil.equals(p.get(i), c.get(i)))) {
      i = sys.Int.increment(i);
    }
    ;
    if ((sys.ObjUtil.equals(i, 0) || sys.ObjUtil.compareGE(i, c.size()))) {
      return child;
    }
    ;
    let dis = c.getRange(sys.Range.make(i, -1)).join(" ");
    if ((sys.ObjUtil.compareGT(sys.Str.size(dis), 2) && Etc.relDisStrip(sys.Str.get(dis, 0)))) {
      (dis = sys.Str.trim(sys.Str.getRange(dis, sys.Range.make(1, -1))));
    }
    ;
    return dis;
  }

  static relDisStrip(c) {
    return (sys.ObjUtil.equals(c, 58) || sys.ObjUtil.equals(c, 45) || sys.ObjUtil.equals(c, 8226));
  }

  static compareDis(a, b) {
    if (sys.Str.isEmpty(a)) {
      return ((this$) => { if (sys.Str.isEmpty(b)) return 0; return -1; })(this);
    }
    ;
    if (sys.Str.isEmpty(b)) {
      return 1;
    }
    ;
    let a0 = sys.Int.lower(sys.Str.get(a, 0));
    let b0 = sys.Int.lower(sys.Str.get(b, 0));
    if (sys.ObjUtil.compareNE(a0, b0)) {
      return sys.ObjUtil.compare(a0, b0);
    }
    ;
    if ((!sys.Int.isDigit(sys.Str.get(a, -1)) || !sys.Int.isDigit(sys.Str.get(b, -1)))) {
      return sys.Str.localeCompare(a, b);
    }
    ;
    let adi = sys.Str.size(a);
    while ((sys.ObjUtil.compareGT(adi, 0) && sys.Int.isDigit(sys.Str.get(a, sys.Int.minus(adi, 1))))) {
      adi = sys.Int.decrement(adi);
    }
    ;
    let bdi = sys.Str.size(b);
    while ((sys.ObjUtil.compareGT(bdi, 0) && sys.Int.isDigit(sys.Str.get(b, sys.Int.minus(bdi, 1))))) {
      bdi = sys.Int.decrement(bdi);
    }
    ;
    if (sys.ObjUtil.compareNE(adi, bdi)) {
      return sys.Str.localeCompare(a, b);
    }
    ;
    let mini = sys.Int.min(adi, bdi);
    for (let i = 0; sys.ObjUtil.compareLT(i, mini); i = sys.Int.increment(i)) {
      if (sys.ObjUtil.compareNE(sys.Int.lower(sys.Str.get(a, i)), sys.Int.lower(sys.Str.get(b, i)))) {
        return sys.ObjUtil.compare(sys.Int.lower(sys.Str.get(a, i)), sys.Int.lower(sys.Str.get(b, i)));
      }
      ;
    }
    ;
    if (sys.ObjUtil.compareNE(adi, bdi)) {
      return sys.ObjUtil.compare(adi, bdi);
    }
    ;
    let anum = sys.Str.toInt(sys.Str.getRange(a, sys.Range.make(adi, -1)), 10, false);
    let bnum = sys.Str.toInt(sys.Str.getRange(b, sys.Range.make(bdi, -1)), 10, false);
    return sys.ObjUtil.compare(anum, bnum);
  }

  static sortDictsByDis(dicts) {
    const this$ = this;
    return sys.ObjUtil.coerce(Etc.sortDis(dicts, sys.ObjUtil.coerce((dict) => {
      return sys.ObjUtil.coerce(Etc.dictToDis(dict), sys.Str.type$);
    }, sys.Type.find("|sys::Obj->sys::Str|?"))), sys.Type.find("haystack::Dict[]"));
  }

  static sortDis(list, getDis) {
    if (getDis === undefined) getDis = null;
    const this$ = this;
    try {
      if (getDis == null) {
        list.sort((a, b) => {
          return Etc.compareDis(sys.ObjUtil.coerce(a, sys.Str.type$), sys.ObjUtil.coerce(b, sys.Str.type$));
        });
      }
      else {
        list.sort((a, b) => {
          return Etc.compareDis(sys.Func.call(getDis, a), sys.Func.call(getDis, b));
        });
      }
      ;
    }
    catch ($_u11) {
      if (getDis == null) {
        list.sort();
      }
      else {
        list.sort((a, b) => {
          return sys.ObjUtil.compare(sys.Func.call(getDis, a), sys.Func.call(getDis, b));
        });
      }
      ;
    }
    ;
    return list;
  }

  static sortCompare(a, b) {
    if ((a == null && b == null)) {
      return 0;
    }
    ;
    if (a == null) {
      return -1;
    }
    ;
    if (b == null) {
      return 1;
    }
    ;
    (a = Etc.sortCompareNorm(a));
    (b = Etc.sortCompareNorm(b));
    if ((sys.ObjUtil.is(a, sys.Str.type$) || sys.ObjUtil.is(b, sys.Str.type$) || sys.ObjUtil.compareNE(sys.ObjUtil.typeof(a), sys.ObjUtil.typeof(b)))) {
      return sys.Str.localeCompare(sys.ObjUtil.toStr(a), sys.ObjUtil.toStr(b));
    }
    else {
      return sys.ObjUtil.compare(a, b);
    }
    ;
  }

  static sortCompareNorm(val) {
    if (sys.ObjUtil.is(val, Ref.type$)) {
      return sys.ObjUtil.coerce(val, Ref.type$).dis();
    }
    ;
    if (sys.ObjUtil.is(val, Number.type$)) {
      let n = sys.ObjUtil.coerce(val, Number.type$);
      if (n.isDuration()) {
        return sys.ObjUtil.coerce(sys.Float.div(sys.Num.toFloat(sys.ObjUtil.coerce(n.toDuration().ticks(), sys.Num.type$)), sys.Float.make(3.6E12)), sys.Obj.type$.toNullable());
      }
      ;
      return sys.ObjUtil.coerce(n.toFloat(), sys.Obj.type$.toNullable());
    }
    ;
    return val;
  }

  static macro(pattern, scope) {
    try {
      return Macro.make(pattern, scope).apply();
    }
    catch ($_u12) {
      $_u12 = sys.Err.make($_u12);
      if ($_u12 instanceof sys.Err) {
        let e = $_u12;
        ;
        return pattern;
      }
      else {
        throw $_u12;
      }
    }
    ;
  }

  static macroVars(pattern) {
    try {
      return Macro.make(pattern, Etc.emptyDict()).vars();
    }
    catch ($_u13) {
      $_u13 = sys.Err.make($_u13);
      if ($_u13 instanceof sys.Err) {
        let e = $_u13;
        ;
        return sys.ObjUtil.coerce(sys.Str.type$.emptyList(), sys.Type.find("sys::Str[]"));
      }
      else {
        throw $_u13;
      }
    }
    ;
  }

  static disKey(key) {
    try {
      let colons = sys.Str.index(key, "::");
      return sys.ObjUtil.coerce(sys.Pod.find(sys.Str.getRange(key, sys.Range.make(0, sys.ObjUtil.coerce(colons, sys.Int.type$), true))).locale(sys.Str.getRange(key, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colons, sys.Int.type$), 2), -1)), key), sys.Str.type$);
    }
    catch ($_u14) {
      $_u14 = sys.Err.make($_u14);
      if ($_u14 instanceof sys.Err) {
        let e = $_u14;
        ;
        return key;
      }
      else {
        throw $_u14;
      }
    }
    ;
  }

  static valToDis(val, meta, clip) {
    if (meta === undefined) meta = null;
    if (clip === undefined) clip = true;
    if (val == null) {
      return "";
    }
    ;
    let kind = Kind.fromVal(val, false);
    let str = ((this$) => { if ((kind == null || kind === Kind.str())) return sys.ObjUtil.toStr(val); return kind.valToDis(sys.ObjUtil.coerce(val, sys.Obj.type$), sys.ObjUtil.coerce(((this$) => { let $_u16 = meta; if ($_u16 != null) return $_u16; return Etc.emptyDict(); })(this$), Dict.type$)); })(this);
    if ((clip && sys.ObjUtil.compareGT(sys.Str.size(str), 55) && kind !== Kind.ref())) {
      (str = sys.Str.plus(sys.Str.getRange(str, sys.Range.make(0, 55)), "..."));
    }
    ;
    return str;
  }

  static tsToDis(ts, now) {
    if (now === undefined) now = sys.DateTime.now();
    if (ts == null) {
      return "";
    }
    ;
    let age = now.minusDateTime(sys.ObjUtil.coerce(ts, sys.DateTime.type$));
    if (sys.ObjUtil.compareLT(age, sys.Duration.fromStr("0ns"))) {
      return ts.toLocale();
    }
    ;
    let isToday = (sys.ObjUtil.equals(ts.day(), now.day()) && ts.month() === now.month() && sys.ObjUtil.equals(ts.year(), now.year()));
    if (isToday) {
      if (sys.ObjUtil.compareLT(age, sys.Duration.fromStr("1min"))) {
        return sys.Str.plus("", Etc.type$.pod().locale("justNow"));
      }
      ;
      return ts.time().toLocale();
    }
    ;
    if (sys.ObjUtil.compareGT(age, sys.Duration.fromStr("5day"))) {
      if (sys.ObjUtil.equals(ts.year(), now.year())) {
        return ts.toLocale("WWW D MMM");
      }
      else {
        return ts.toLocale("D MMM YYYY");
      }
      ;
    }
    ;
    let days = now.date().minusDate(ts.date()).toDay();
    if (sys.ObjUtil.equals(days, 1)) {
      return sys.Str.plus(sys.Str.plus(sys.Str.plus("", Etc.type$.pod().locale("yesterday")), " "), ts.time().toLocale());
    }
    else {
      return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", ts.weekday().toLocale()), " ("), sys.ObjUtil.coerce(days, sys.Obj.type$.toNullable())), " "), Etc.type$.pod().locale("daysAgo")), ")");
    }
    ;
  }

  static isKindName(n) {
    const this$ = this;
    if ((sys.Str.isEmpty(n) || !sys.Int.isUpper(sys.Str.get(n, 0)))) {
      return false;
    }
    ;
    return sys.Str.all(n, (c) => {
      return (sys.Int.isAlphaNum(c) || sys.ObjUtil.equals(c, 95));
    });
  }

  static isTagName(n) {
    const this$ = this;
    if (sys.Str.isEmpty(n)) {
      return false;
    }
    ;
    let first = sys.Str.get(n, 0);
    if (!sys.Int.isLower(first)) {
      if ((sys.ObjUtil.compareNE(first, 95) || sys.ObjUtil.equals(sys.Str.size(n), 1))) {
        return false;
      }
      ;
      let second = sys.Str.get(n, 1);
      if (sys.ObjUtil.equals(second, 95)) {
        if ((sys.ObjUtil.compareLT(sys.Str.size(n), 4) || sys.ObjUtil.compareNE(sys.Int.mod(sys.Str.size(n), 2), 0))) {
          return false;
        }
        ;
        return sys.Str.all(n, (c, i) => {
          return (sys.ObjUtil.compareLT(i, 2) || sys.Int.isDigit(c, 16));
        });
      }
      ;
    }
    ;
    return sys.Str.all(n, (c) => {
      return (sys.Int.isAlphaNum(c) || sys.ObjUtil.equals(c, 95));
    });
  }

  static isEscapedTagName(n) {
    return (sys.ObjUtil.compareGT(sys.Str.size(n), 3) && sys.ObjUtil.equals(sys.Str.get(n, 0), 95) && sys.ObjUtil.equals(sys.Str.get(n, 1), 95));
  }

  static escapeTagName(n) {
    return sys.Str.plus("__", sys.Str.toBuf(n).toHex());
  }

  static unescapeTagName(n) {
    if ((sys.ObjUtil.compareLT(sys.Str.size(n), 4) || sys.ObjUtil.compareNE(sys.Str.get(n, 0), 95) || sys.ObjUtil.compareNE(sys.Str.get(n, 1), 95))) {
      throw sys.ArgErr.make(sys.Str.plus("Not escaped tag name: ", n));
    }
    ;
    return sys.Buf.fromHex(sys.Str.getRange(n, sys.Range.make(2, -1))).readAllStr();
  }

  static toTagName(n) {
    const this$ = this;
    if (Etc.isTagName(n)) {
      return n;
    }
    ;
    if (sys.Str.isEmpty(n)) {
      throw sys.ArgErr.make("string is empty");
    }
    ;
    if ((sys.ObjUtil.compareGE(sys.Str.size(n), 2) && sys.Int.isUpper(sys.Str.get(n, 0)) && sys.Int.isUpper(sys.Str.get(n, 1)))) {
      let x = sys.StrBuf.make();
      let capsPrefix = true;
      for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(n)); i = sys.Int.increment(i)) {
        let ch = sys.Str.get(n, i);
        if ((capsPrefix && sys.Int.isUpper(ch))) {
          x.addChar(sys.Int.lower(ch));
        }
        else {
          (capsPrefix = false);
          x.addChar(ch);
        }
        ;
      }
      ;
      (n = x.toStr());
    }
    ;
    (n = sys.Str.fromDisplayName(n));
    let buf = sys.StrBuf.make();
    sys.Str.each(n, (ch, i) => {
      if ((sys.Int.isAlphaNum(ch) || sys.ObjUtil.equals(ch, 95))) {
        if (buf.isEmpty()) {
          if ((sys.Int.isDigit(ch) || (sys.ObjUtil.equals(ch, 95) && (sys.ObjUtil.equals(sys.Str.size(n), 1) || !sys.Int.isAlphaNum(sys.Str.get(n, 1)))))) {
            buf.addChar(118).addChar(ch);
          }
          else {
            if (sys.Int.isUpper(ch)) {
              buf.addChar(sys.Int.lower(ch));
            }
            else {
              buf.addChar(ch);
            }
            ;
          }
          ;
        }
        else {
          buf.addChar(ch);
        }
        ;
      }
      else {
        if ((sys.ObjUtil.equals(ch, 46) || sys.ObjUtil.equals(ch, 45) || sys.ObjUtil.equals(ch, 47))) {
          if (buf.isEmpty()) {
            buf.addChar(118);
          }
          ;
          if (sys.ObjUtil.compareLT(i, sys.Int.minus(sys.Str.size(n), 1))) {
            buf.addChar(95);
          }
          ;
        }
        ;
      }
      ;
      return;
    });
    if (buf.isEmpty()) {
      return "v";
    }
    ;
    return buf.toStr();
  }

  static tagToLocale(name) {
    let pod = sys.Pod.find("ui", false);
    if (pod != null) {
      return sys.ObjUtil.coerce(pod.locale(name, name), sys.Str.type$);
    }
    ;
    return name;
  }

  static nameStartsWith(prefix, name) {
    if (sys.ObjUtil.equals(prefix, name)) {
      return true;
    }
    ;
    return (sys.Str.startsWith(name, prefix) && sys.Int.isUpper(sys.Str.get(name, sys.Str.size(prefix))));
  }

  static isFileName(name) {
    const this$ = this;
    if (sys.Str.isEmpty(name)) {
      return false;
    }
    ;
    if ((sys.ObjUtil.equals(sys.Str.get(name, 0), 32) || sys.ObjUtil.equals(sys.Str.get(name, -1), 32))) {
      return false;
    }
    ;
    return sys.Str.all(name, (ch) => {
      return Etc.isFileNameChar(ch);
    });
  }

  static toFileName(n) {
    const this$ = this;
    let s = sys.StrBuf.make();
    (n = sys.Str.trim(n));
    sys.Str.each(n, (ch) => {
      s.addChar(((this$) => { if (Etc.isFileNameChar(ch)) return ch; return 45; })(this$));
      return;
    });
    if (s.isEmpty()) {
      s.add("x");
    }
    ;
    return s.toStr();
  }

  static isSafeRelDir(uri) {
    let str = sys.ObjUtil.toStr(uri);
    if (sys.Str.contains(str, "..")) {
      return false;
    }
    ;
    if (sys.Str.startsWith(str, "/")) {
      return false;
    }
    ;
    return true;
  }

  static isFileNameChar(ch) {
    return (sys.Int.isAlphaNum(ch) || sys.ObjUtil.equals(ch, 32) || sys.ObjUtil.equals(ch, 45) || sys.ObjUtil.equals(ch, 46) || sys.ObjUtil.equals(ch, 95) || sys.ObjUtil.equals(ch, 126));
  }

  static toAxon(val) {
    if (val == null) {
      return "null";
    }
    ;
    let kind = Kind.fromVal(val, false);
    if (kind != null) {
      return kind.valToAxon(sys.ObjUtil.coerce(val, sys.Obj.type$));
    }
    ;
    if (sys.ObjUtil.is(val, DateSpan.type$)) {
      return sys.ObjUtil.coerce(val, DateSpan.type$).toCode();
    }
    ;
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("xstr(", sys.Str.toCode(sys.ObjUtil.typeof(val).name())), ", "), sys.Str.toCode(sys.ObjUtil.toStr(val))), ")");
  }

  static discretePeriods(str, f) {
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(str)); i = sys.Int.plus(i, 4)) {
      let time = sys.Int.plus(sys.Int.shiftl(Etc.fromBase64().get(sys.Str.get(str, sys.Int.plus(i, 0))), 6), Etc.fromBase64().get(sys.Str.get(str, sys.Int.plus(i, 1))));
      let dur = sys.Int.plus(sys.Int.shiftl(Etc.fromBase64().get(sys.Str.get(str, sys.Int.plus(i, 2))), 6), Etc.fromBase64().get(sys.Str.get(str, sys.Int.plus(i, 3))));
      sys.Func.call(f, sys.ObjUtil.coerce(time, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(dur, sys.Obj.type$.toNullable()));
    }
    ;
    return;
  }

  static discretePeriodsDis(rec, start, periods, max) {
    if (max === undefined) max = 5;
    const this$ = this;
    let enums = null;
    if ((rec.has("enum") && sys.ObjUtil.equals(rec.get("kind"), "Str"))) {
      try {
        (enums = sys.Str.split(sys.ObjUtil.toStr(rec.trap("enum", sys.List.make(sys.Obj.type$.toNullable(), []))), sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())));
      }
      catch ($_u18) {
        $_u18 = sys.Err.make($_u18);
        if ($_u18 instanceof sys.Err) {
          let e = $_u18;
          ;
        }
        else {
          throw $_u18;
        }
      }
      ;
    }
    ;
    let interval = sys.Duration.fromStr("1min");
    try {
      if (rec.has("discreteInterval")) {
        (interval = sys.ObjUtil.coerce(sys.ObjUtil.coerce(rec.trap("discreteInterval", sys.List.make(sys.Obj.type$.toNullable(), [])), Number.type$).toDuration(), sys.Duration.type$));
      }
      ;
    }
    catch ($_u19) {
      $_u19 = sys.Err.make($_u19);
      if ($_u19 instanceof sys.Err) {
        let e = $_u19;
        ;
        e.trace();
      }
      else {
        throw $_u19;
      }
    }
    ;
    let s = sys.StrBuf.make();
    let count = 0;
    Etc.discretePeriods(periods, (t, d) => {
      let ts = start.plus(interval.mult(t));
      if (sys.ObjUtil.compareLT(count, max)) {
        if (sys.ObjUtil.compareGT(count, 0)) {
          s.add(", ");
        }
        ;
        let val = ((this$) => { if (enums == null) return Etc.periodDurToDis(interval.mult(d)); return ((this$) => { let $_u21 = enums.getSafe(d); if ($_u21 != null) return $_u21; return sys.Int.toStr(d); })(this$); })(this$);
        s.add(ts.time().toLocale()).addChar(32).add(val);
      }
      else {
        if (sys.ObjUtil.equals(count, max)) {
          s.add(" ...");
        }
        ;
      }
      ;
      ((this$) => { let $_u22 = count; count = sys.Int.increment(count); return $_u22; })(this$);
      return;
    });
    return s.toStr();
  }

  static periodDurToDis(d) {
    let min = d.toMin();
    if ((sys.ObjUtil.equals(sys.Int.mod(min, 60), 0) && sys.ObjUtil.compareGT(min, 0))) {
      return sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Int.div(min, 60), sys.Obj.type$.toNullable())), "hr");
    }
    ;
    return sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(min, sys.Obj.type$.toNullable())), "min");
  }

  static emptyGrid() {
    let g = Etc.emptyGridRef().val();
    if (g == null) {
      Etc.emptyGridRef().val((g = GridBuilder.make().addCol("empty").toGrid()));
    }
    ;
    return sys.ObjUtil.coerce(g, Grid.type$);
  }

  static gridToStrVal(grid, def) {
    if (def === undefined) def = "";
    let row = ((this$) => { let $_u23 = grid; if ($_u23 == null) return null; return grid.first(); })(this);
    if (row == null) {
      return def;
    }
    ;
    let col = grid.cols().first();
    return ((this$) => { let $_u24 = sys.ObjUtil.as(row.val(sys.ObjUtil.coerce(col, Col.type$)), sys.Str.type$); if ($_u24 != null) return $_u24; return def; })(this);
  }

  static makeEmptyGrid(meta) {
    if (meta === undefined) meta = null;
    let m = Etc.makeDict(meta);
    if (m.isEmpty()) {
      return Etc.emptyGrid();
    }
    ;
    return GridBuilder.make().setMeta(m).addCol("empty").toGrid();
  }

  static makeErrGrid(e, meta) {
    if (meta === undefined) meta = null;
    let tags = Etc.toErrMeta(e);
    (tags = Etc.dictMerge(tags, meta));
    return Etc.makeEmptyGrid(tags);
  }

  static toErrMeta(e) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral(["err", "dis", "errTrace", "errType"], [Marker.val(), e.toStr(), Etc.toErrTrace(e), sys.ObjUtil.typeof(e).qname()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    let field = sys.ObjUtil.typeof(e).field("tags", false);
    if (field != null) {
      let tags = sys.ObjUtil.as(field.get(e), Dict.type$);
      if (tags != null) {
        tags.each((v, n) => {
          if (acc.get(n) == null) {
            acc.set(n, v);
          }
          ;
          return;
        });
      }
      ;
    }
    ;
    return Etc.makeDict(acc);
  }

  static toErrTrace(e) {
    let trace = e.traceToStr();
    let axonTrace = Etc.toAuxTrace(e, "axonTrace");
    let remoteTrace = Etc.toAuxTrace(e, "remoteTrace");
    if ((axonTrace != null || remoteTrace != null)) {
      let s = sys.StrBuf.make();
      s.add(sys.Str.plus("", e.toStr())).add("\n");
      if (axonTrace != null) {
        s.add("=== Axon Trace ===\n").add(axonTrace).add("\n");
      }
      ;
      if (remoteTrace != null) {
        s.add("=== Remote Trace ===\n").add(remoteTrace).add("\n");
      }
      ;
      s.add("=== Fantom Trace ===\n").add(trace);
      (trace = s.toStr());
    }
    ;
    return trace;
  }

  static toAuxTrace(e, fieldName) {
    while (e != null) {
      let field = sys.ObjUtil.typeof(e).field(fieldName, false);
      if (field != null) {
        let s = sys.ObjUtil.as(field.get(e), sys.Str.type$);
        if ((s == null || sys.Str.isEmpty(s))) {
          return null;
        }
        ;
        return s;
      }
      ;
      (e = e.cause());
    }
    ;
    return null;
  }

  static makeMapGrid(meta, row) {
    return Etc.makeDictGrid(meta, Etc.makeDict(row));
  }

  static makeMapsGrid(meta, rows) {
    return Etc.makeDictsGrid(meta, Etc.makeDicts(rows));
  }

  static makeDictGrid(meta, row) {
    const this$ = this;
    if (row.isEmpty()) {
      return Etc.makeEmptyGrid(meta);
    }
    ;
    let gb = GridBuilder.make();
    gb.setMeta(meta);
    let cells = sys.List.make(sys.Obj.type$.toNullable());
    if (row.has("id")) {
      gb.addCol("id");
      cells.add(row.get("id"));
    }
    ;
    Etc.dictEach(row, (v, n) => {
      if ((sys.ObjUtil.equals(n, "id") || sys.ObjUtil.equals(n, "mod"))) {
        return;
      }
      ;
      gb.addCol(n);
      cells.add(v);
      return;
    });
    if (row.has("mod")) {
      gb.addCol("mod");
      cells.add(row.get("mod"));
    }
    ;
    gb.addRow(cells);
    return gb.toGrid();
  }

  static makeDictsGrid(meta, rows) {
    const this$ = this;
    if (rows.isEmpty()) {
      return Etc.makeEmptyGrid(meta);
    }
    ;
    if ((sys.ObjUtil.equals(rows.size(), 1) && rows.get(0) != null)) {
      return Etc.makeDictGrid(meta, sys.ObjUtil.coerce(rows.first(), Dict.type$));
    }
    ;
    let colNames = Etc.dictsNames(rows);
    if (colNames.isEmpty()) {
      return Etc.makeEmptyGrid(meta);
    }
    ;
    let gb = GridBuilder.make();
    gb.setMeta(meta);
    colNames.each((colName) => {
      gb.addCol(colName);
      return;
    });
    gb.addDictRows(rows);
    return gb.toGrid();
  }

  static makeListGrid(meta, colName, colMeta, rows) {
    const this$ = this;
    let gb = GridBuilder.make();
    gb.setMeta(meta);
    gb.addCol(colName, colMeta);
    rows.each((row) => {
      gb.addRow1(row);
      return;
    });
    return gb.toGrid();
  }

  static makeListsGrid(meta, colNames, colMetas, rows) {
    const this$ = this;
    let gb = GridBuilder.make();
    gb.setMeta(meta);
    colNames.each((colName, i) => {
      gb.addCol(colName, ((this$) => { let $_u25 = colMetas; if ($_u25 == null) return null; return colMetas.get(i); })(this$));
      return;
    });
    rows.each((row) => {
      gb.addRow(row);
      return;
    });
    return gb.toGrid();
  }

  static gridFlatten(grids) {
    const this$ = this;
    if (grids.isEmpty()) {
      return Etc.emptyGrid();
    }
    ;
    if (sys.ObjUtil.equals(grids.size(), 1)) {
      return grids.get(0);
    }
    ;
    let meta = Etc.emptyDict();
    let cols = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Dict")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:haystack::Dict]"));
    grids.each((g) => {
      (meta = Etc.dictMerge(g.meta(), meta));
      g.cols().each((c) => {
        cols.set(c.name(), Etc.dictMerge(c.meta(), cols.get(c.name())));
        return;
      });
      return;
    });
    let gb = GridBuilder.make();
    gb.setMeta(meta);
    cols.each((colMeta, colName) => {
      gb.addCol(colName, colMeta);
      return;
    });
    grids.each((g) => {
      g.each((row) => {
        gb.addDictRow(row);
        return;
      });
      return;
    });
    return gb.toGrid();
  }

  static toId(val) {
    if (sys.ObjUtil.is(val, Ref.type$)) {
      return sys.ObjUtil.coerce(val, Ref.type$);
    }
    ;
    if (sys.ObjUtil.is(val, Dict.type$)) {
      return sys.ObjUtil.coerce(val, Dict.type$).id();
    }
    ;
    if (sys.ObjUtil.is(val, Grid.type$)) {
      return sys.ObjUtil.coerce(((this$) => { let $_u26 = ((this$) => { let $_u27 = sys.ObjUtil.coerce(val, Grid.type$).first(); if ($_u27 == null) return null; return sys.ObjUtil.coerce(val, Grid.type$).first().id(); })(this$); if ($_u26 != null) return $_u26; throw CoerceErr.make("Grid is empty"); })(this), Ref.type$);
    }
    ;
    throw CoerceErr.make(sys.Str.plus("Cannot coerce to id: ", ((this$) => { let $_u28 = val; if ($_u28 == null) return null; return sys.ObjUtil.typeof(val); })(this)));
  }

  static toIds(val) {
    const this$ = this;
    if (sys.ObjUtil.is(val, Ref.type$)) {
      return sys.List.make(Ref.type$, [sys.ObjUtil.coerce(val, Ref.type$)]);
    }
    ;
    if (sys.ObjUtil.is(val, Dict.type$)) {
      return sys.List.make(Ref.type$, [sys.ObjUtil.coerce(val, Dict.type$).id()]);
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      let list = sys.ObjUtil.coerce(val, sys.Type.find("sys::List"));
      if (list.isEmpty()) {
        return sys.List.make(Ref.type$);
      }
      ;
      if (list.of().fits(Ref.type$)) {
        return sys.ObjUtil.coerce(list, sys.Type.find("haystack::Ref[]"));
      }
      ;
      if (list.all((x) => {
        return sys.ObjUtil.is(x, Ref.type$);
      })) {
        return sys.List.make(Ref.type$).addAll(sys.ObjUtil.coerce(list, sys.Type.find("haystack::Ref[]")));
      }
      ;
      if (list.all((x) => {
        return sys.ObjUtil.is(x, Dict.type$);
      })) {
        return sys.ObjUtil.coerce(list.map(sys.ObjUtil.coerce((d) => {
          return d.id();
        }, sys.Type.find("|sys::V,sys::Int->sys::Obj?|"))), sys.Type.find("haystack::Ref[]"));
      }
      ;
    }
    ;
    if (sys.ObjUtil.is(val, Grid.type$)) {
      let grid = sys.ObjUtil.coerce(val, Grid.type$);
      if (grid.isEmpty()) {
        return sys.List.make(Ref.type$);
      }
      ;
      if (grid.meta().has("navFilter")) {
        return sys.ObjUtil.coerce(sys.Slot.findMethod("legacy::NavFuncs.toNavFilterRecIdList").call(grid), sys.Type.find("haystack::Ref[]"));
      }
      ;
      let ids = sys.List.make(Ref.type$);
      let idCol = grid.col("id");
      grid.each((row) => {
        let id = ((this$) => { let $_u29 = sys.ObjUtil.as(row.val(sys.ObjUtil.coerce(idCol, Col.type$)), Ref.type$); if ($_u29 != null) return $_u29; throw CoerceErr.make("Row missing id tag"); })(this$);
        ids.add(sys.ObjUtil.coerce(id, Ref.type$));
        return;
      });
      return ids;
    }
    ;
    throw CoerceErr.make(sys.Str.plus("Cannot convert to ids: ", ((this$) => { let $_u30 = val; if ($_u30 == null) return null; return sys.ObjUtil.typeof(val); })(this)));
  }

  static toRec(val, cx) {
    if (cx === undefined) cx = null;
    if (sys.ObjUtil.is(val, Dict.type$)) {
      return sys.ObjUtil.coerce(val, Dict.type$);
    }
    ;
    if (sys.ObjUtil.is(val, Grid.type$)) {
      return sys.ObjUtil.coerce(((this$) => { let $_u31 = sys.ObjUtil.coerce(val, Grid.type$).first(); if ($_u31 != null) return $_u31; throw CoerceErr.make("Grid is empty"); })(this), Dict.type$);
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return Etc.toRec(((this$) => { let $_u32 = sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).first(); if ($_u32 != null) return $_u32; throw CoerceErr.make("List is empty"); })(this));
    }
    ;
    if (sys.ObjUtil.is(val, Ref.type$)) {
      return Etc.refToRec(sys.ObjUtil.coerce(val, Ref.type$), cx);
    }
    ;
    throw CoerceErr.make(sys.Str.plus("Cannot coerce toRec: ", ((this$) => { let $_u33 = val; if ($_u33 == null) return null; return sys.ObjUtil.typeof(val); })(this)));
  }

  static toRecs(val, cx) {
    if (cx === undefined) cx = null;
    const this$ = this;
    if (val == null) {
      return sys.List.make(Dict.type$);
    }
    ;
    if (sys.ObjUtil.is(val, Dict.type$)) {
      return sys.List.make(Dict.type$, [sys.ObjUtil.coerce(val, Dict.type$)]);
    }
    ;
    if (sys.ObjUtil.is(val, Ref.type$)) {
      return sys.List.make(Dict.type$, [Etc.refToRec(sys.ObjUtil.coerce(val, Ref.type$), cx)]);
    }
    ;
    if (sys.ObjUtil.is(val, Grid.type$)) {
      let grid = sys.ObjUtil.coerce(val, Grid.type$);
      if (grid.meta().has("navFilter")) {
        return sys.ObjUtil.coerce(sys.Slot.findMethod("legacy::NavFuncs.toNavFilterRecList").call(grid), sys.Type.find("haystack::Dict[]"));
      }
      ;
      return grid.toRows();
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      let list = sys.ObjUtil.coerce(val, sys.Type.find("sys::List"));
      if (list.isEmpty()) {
        return sys.List.make(Dict.type$);
      }
      ;
      if (list.of().fits(Dict.type$)) {
        return sys.ObjUtil.coerce(list, sys.Type.find("haystack::Dict[]"));
      }
      ;
      if (list.all((x) => {
        return sys.ObjUtil.is(x, Dict.type$);
      })) {
        return sys.List.make(Dict.type$).addAll(sys.ObjUtil.coerce(list, sys.Type.find("haystack::Dict[]")));
      }
      ;
      if (list.all((x) => {
        return sys.ObjUtil.is(x, Ref.type$);
      })) {
        return Etc.refsToRecs(sys.ObjUtil.coerce(list, sys.Type.find("haystack::Ref[]")), cx);
      }
      ;
      throw CoerceErr.make(sys.Str.plus("Cannot convert toRecs: List of ", ((this$) => { let $_u34 = list.first(); if ($_u34 == null) return null; return sys.ObjUtil.typeof(list.first()); })(this)));
    }
    ;
    throw CoerceErr.make(sys.Str.plus("Cannot coerce toRecs: ", ((this$) => { let $_u35 = val; if ($_u35 == null) return null; return sys.ObjUtil.typeof(val); })(this)));
  }

  static refToRec(id, cx) {
    (cx = Etc.curContext(cx));
    return sys.ObjUtil.coerce(((this$) => { let $_u36 = cx.deref(id); if ($_u36 != null) return $_u36; throw UnknownRecErr.make(sys.Str.plus("Cannot read id: ", id.toCode())); })(this), Dict.type$);
  }

  static refsToRecs(ids, cx) {
    const this$ = this;
    (cx = Etc.curContext(cx));
    return sys.ObjUtil.coerce(ids.map((id) => {
      return sys.ObjUtil.coerce(((this$) => { let $_u37 = cx.deref(id); if ($_u37 != null) return $_u37; throw UnknownRecErr.make(sys.Str.plus("Cannot read id: ", id.toCode())); })(this$), Dict.type$);
    }, Dict.type$), sys.Type.find("haystack::Dict[]"));
  }

  static toGrid(val, meta) {
    if (meta === undefined) meta = null;
    const this$ = this;
    if (sys.ObjUtil.is(val, Grid.type$)) {
      return sys.ObjUtil.coerce(val, Grid.type$);
    }
    ;
    if (sys.ObjUtil.is(val, Row.type$)) {
      let grid = sys.ObjUtil.coerce(val, Row.type$).grid();
      try {
        if (sys.ObjUtil.equals(grid.size(), 1)) {
          return grid;
        }
        ;
      }
      catch ($_u38) {
      }
      ;
    }
    ;
    if (sys.ObjUtil.is(val, Dict.type$)) {
      return Etc.makeDictGrid(meta, sys.ObjUtil.coerce(val, Dict.type$));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      let list = sys.ObjUtil.coerce(val, sys.Type.find("sys::List"));
      if (list.all((it) => {
        return sys.ObjUtil.is(it, Dict.type$);
      })) {
        return Etc.makeDictsGrid(meta, sys.ObjUtil.coerce(val, sys.Type.find("haystack::Dict?[]")));
      }
      ;
      let gb = GridBuilder.make().addCol("val");
      list.each((v) => {
        gb.addRow1(Etc.toCell(v));
        return;
      });
      return gb.toGrid();
    }
    ;
    return GridBuilder.make().setMeta(meta).addCol("val").addRow1(Etc.toCell(val)).toGrid();
  }

  static toCell(val) {
    if (sys.ObjUtil.is(val, Grid.type$)) {
      return sys.ObjUtil.coerce(val, Grid.type$).toConst();
    }
    ;
    if (val == null) {
      return null;
    }
    ;
    if (Kind.fromVal(val, false) != null) {
      return val;
    }
    ;
    return XStr.encode(sys.ObjUtil.coerce(val, sys.Obj.type$));
  }

  static toDateSpan(val, cx) {
    if (cx === undefined) cx = null;
    if (sys.ObjUtil.is(val, HaystackFunc.type$)) {
      (val = sys.ObjUtil.coerce(val, HaystackFunc.type$).haystackCall(Etc.curContext(cx), sys.Obj.type$.emptyList()));
    }
    ;
    if (sys.ObjUtil.is(val, DateSpan.type$)) {
      return sys.ObjUtil.coerce(val, DateSpan.type$);
    }
    ;
    if (sys.ObjUtil.is(val, sys.Date.type$)) {
      return DateSpan.make(sys.ObjUtil.coerce(val, sys.Date.type$), DateSpan.day());
    }
    ;
    if (sys.ObjUtil.is(val, Span.type$)) {
      return sys.ObjUtil.coerce(val, Span.type$).toDateSpan();
    }
    ;
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      return sys.ObjUtil.coerce(DateSpan.fromStr(sys.ObjUtil.coerce(val, sys.Str.type$)), DateSpan.type$);
    }
    ;
    if (sys.ObjUtil.is(val, ObjRange.type$)) {
      let or = sys.ObjUtil.coerce(val, ObjRange.type$);
      let s = or.start();
      let e = or.end();
      if (sys.ObjUtil.is(s, sys.Date.type$)) {
        return DateSpan.make(sys.ObjUtil.coerce(s, sys.Date.type$), sys.ObjUtil.coerce(e, sys.Obj.type$));
      }
      ;
      if ((sys.ObjUtil.is(s, sys.DateTime.type$) && sys.ObjUtil.is(e, sys.DateTime.type$))) {
        let st = sys.ObjUtil.coerce(s, sys.DateTime.type$);
        let sd = st.date();
        let et = sys.ObjUtil.coerce(e, sys.DateTime.type$);
        let ed = et.date();
        if (et.isMidnight()) {
          (ed = ed.minus(sys.Duration.fromStr("1day")));
        }
        ;
        return DateSpan.make(sd, ed);
      }
      ;
    }
    ;
    if (sys.ObjUtil.is(val, Number.type$)) {
      let year = sys.ObjUtil.coerce(val, Number.type$).toInt();
      if ((sys.ObjUtil.compareLT(1900, year) && sys.ObjUtil.compareLT(year, 2100))) {
        return DateSpan.makeYear(year);
      }
      ;
    }
    ;
    throw CoerceErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot coerce toDateSpan: ", val), " ["), ((this$) => { let $_u39 = val; if ($_u39 == null) return null; return sys.ObjUtil.typeof(val); })(this)), "]"));
  }

  static toSpan(val, tz, cx) {
    if (tz === undefined) tz = null;
    if (cx === undefined) cx = null;
    if (sys.ObjUtil.is(val, Span.type$)) {
      let span = sys.ObjUtil.coerce(val, Span.type$);
      if ((tz != null && span.alignsToDates())) {
        return span.toDateSpan().toSpan(sys.ObjUtil.coerce(tz, sys.TimeZone.type$));
      }
      ;
      return span;
    }
    ;
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      return sys.ObjUtil.coerce(Span.fromStr(sys.ObjUtil.coerce(val, sys.Str.type$), sys.ObjUtil.coerce(((this$) => { let $_u40 = tz; if ($_u40 != null) return $_u40; return sys.TimeZone.cur(); })(this), sys.TimeZone.type$)), Span.type$);
    }
    ;
    if (sys.ObjUtil.is(val, ObjRange.type$)) {
      let r = sys.ObjUtil.coerce(val, ObjRange.type$);
      let s = sys.ObjUtil.as(r.start(), sys.DateTime.type$);
      let e = sys.ObjUtil.as(r.end(), sys.DateTime.type$);
      if ((s != null || e != null)) {
        if ((s == null && sys.ObjUtil.is(r.start(), sys.Date.type$))) {
          (s = sys.ObjUtil.coerce(r.start(), sys.Date.type$).midnight(e.tz()));
        }
        ;
        if ((e == null && sys.ObjUtil.is(r.end(), sys.Date.type$))) {
          (e = sys.ObjUtil.coerce(r.end(), sys.Date.type$).plus(sys.Duration.fromStr("1day")).midnight(s.tz()));
        }
        ;
        if ((s != null && e != null)) {
          return Etc.toSpan(Span.makeAbs(sys.ObjUtil.coerce(s, sys.DateTime.type$), sys.ObjUtil.coerce(e, sys.DateTime.type$)), tz);
        }
        ;
      }
      ;
    }
    ;
    if (sys.ObjUtil.is(val, sys.DateTime.type$)) {
      let ts = sys.ObjUtil.coerce(val, sys.DateTime.type$);
      return sys.ObjUtil.coerce(Span.makeAbs(ts, ts), Span.type$);
    }
    ;
    return Etc.toDateSpan(val, cx).toSpan(sys.ObjUtil.coerce(((this$) => { let $_u41 = tz; if ($_u41 != null) return $_u41; return sys.TimeZone.cur(); })(this), sys.TimeZone.type$));
  }

  static curContext(cx) {
    if (cx == null) {
      (cx = sys.ObjUtil.as(concurrent.Actor.locals().get(Etc.cxActorLocalsKey()), HaystackContext.type$));
    }
    ;
    if (cx == null) {
      throw sys.Err.make("No context available");
    }
    ;
    return sys.ObjUtil.coerce(cx, HaystackContext.type$);
  }

  static debugDur(dur) {
    if ((dur == null || sys.ObjUtil.equals(dur, 0))) {
      return "never";
    }
    ;
    let d = ((this$) => { let $_u42 = sys.ObjUtil.as(dur, sys.Duration.type$); if ($_u42 != null) return $_u42; return sys.Duration.make(sys.ObjUtil.coerce(dur, sys.Int.type$)); })(this);
    let now = sys.Duration.now();
    if (sys.ObjUtil.compareLT(now, d)) {
      return d.minus(sys.Duration.now()).toLocale();
    }
    ;
    let ago = now.minus(sys.ObjUtil.coerce(d, sys.Duration.type$));
    if (sys.ObjUtil.compareLT(ago, sys.Duration.fromStr("3hr"))) {
      return sys.Str.plus(sys.Str.plus("", ago.toLocale()), " ago");
    }
    ;
    let ts = sys.DateTime.now().minus(ago).toLocale("hh:mm:ss DD-MMM-YYYY zzz");
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", ago.toLocale()), " ago ["), ts), "]");
  }

  static debugErr(err, flags) {
    if (flags === undefined) flags = "x<>";
    if (err == null) {
      return "null";
    }
    ;
    return Etc.indent(Etc.toErrTrace(sys.ObjUtil.coerce(err, sys.Err.type$)), 2, flags);
  }

  static indent(str, indent, flags) {
    if (indent === undefined) indent = 2;
    if (flags === undefined) flags = ">";
    const this$ = this;
    let s = sys.StrBuf.make();
    if (sys.Str.contains(flags, "<")) {
      s.add("\n");
    }
    ;
    sys.Str.splitLines(str).each((line) => {
      if ((sys.Str.isEmpty(line) && sys.Str.contains(flags, "x"))) {
        return;
      }
      ;
      s.add(sys.Str.spaces(indent)).add(line).addChar(10);
      return;
    });
    if ((!sys.Str.contains(flags, ">") && sys.ObjUtil.compareGT(s.size(), 0))) {
      s.remove(-1);
    }
    ;
    return s.toStr();
  }

  static addArg(b, name, arg) {
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
    catch ($_u43) {
      $_u43 = sys.Err.make($_u43);
      if ($_u43 instanceof sys.Err) {
        let e = $_u43;
        ;
        b.add(e.toStr());
      }
      else {
        throw $_u43;
      }
    }
    ;
    return;
  }

  static toCliArgsMap(args) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    args.each((s, i) => {
      if ((!sys.Str.startsWith(s, "-") || sys.ObjUtil.compareLT(sys.Str.size(s), 2))) {
        return;
      }
      ;
      let name = sys.Str.getRange(s, sys.Range.make(1, -1));
      let val = "true";
      if ((sys.ObjUtil.compareLT(sys.Int.plus(i, 1), args.size()) && !sys.Str.startsWith(args.get(sys.Int.plus(i, 1)), "-"))) {
        (val = args.get(sys.Int.plus(i, 1)));
      }
      ;
      acc.set(name, val);
      return;
    });
    return acc;
  }

  static formatMultiLine(str, lineLength) {
    if (lineLength === undefined) lineLength = 60;
    let lines = sys.List.make(sys.Str.type$);
    while (!sys.Str.isEmpty(str)) {
      let x = sys.Int.min(lineLength, sys.Str.size(str));
      lines.add(sys.Str.getRange(str, sys.Range.make(0, x, true)));
      (str = sys.Str.getRange(str, sys.Range.make(x, -1)));
    }
    ;
    return lines;
  }

  static make() {
    const $self = new Etc();
    Etc.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    const this$ = this;
    Etc.#emptyTags = sys.ObjUtil.coerce(((this$) => { let $_u44 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")); if ($_u44 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))); })(this), sys.Type.find("[sys::Str:sys::Obj?]"));
    Etc.#dictIterateNulls = false;
    if (true) {
      try {
        Etc.#dictIterateNulls = sys.ObjUtil.equals(Etc.type$.pod().config("dictIterateNulls"), "true");
        if (Etc.#dictIterateNulls) {
          sys.ObjUtil.echo("~~");
          sys.ObjUtil.echo("~~ Haystack dict iterate null turned on!!!");
          sys.ObjUtil.echo("~~");
        }
        ;
      }
      catch ($_u45) {
        $_u45 = sys.Err.make($_u45);
        if ($_u45 instanceof sys.Err) {
          let e = $_u45;
          ;
          e.trace();
        }
        else {
          throw $_u45;
        }
      }
      ;
    }
    ;
    Etc.#list0 = sys.ObjUtil.coerce(((this$) => { let $_u46 = sys.List.make(sys.Obj.type$.toNullable()); if ($_u46 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Obj.type$.toNullable())); })(this), sys.Type.find("sys::Obj?[]"));
    Etc.#toBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    if (true) {
      let list = sys.List.make(sys.Int.type$).fill(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), 128);
      sys.Str.each(Etc.#toBase64, (ch, i) => {
        list.set(ch, sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
        return;
      });
      Etc.#fromBase64 = sys.ObjUtil.coerce(((this$) => { let $_u47 = list; if ($_u47 == null) return null; return sys.ObjUtil.toImmutable(list); })(this), sys.Type.find("sys::Int[]"));
    }
    ;
    Etc.#emptyGridRef = concurrent.AtomicRef.make(null);
    Etc.#tsKeyFormat = "YYMMDDhhmmss";
    Etc.#cxActorLocalsKey = "cx";
    return;
  }

}

class GridWriter {
  constructor() {
    const this$ = this;
  }

  typeof() { return GridWriter.type$; }

}

class TrioWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TrioWriter.type$; }

  static #quotedKeyword = undefined;

  static quotedKeyword() {
    if (TrioWriter.#quotedKeyword === undefined) {
      TrioWriter.static$init();
      if (TrioWriter.#quotedKeyword === undefined) TrioWriter.#quotedKeyword = null;
    }
    return TrioWriter.#quotedKeyword;
  }

  static #quoteChars = undefined;

  static quoteChars() {
    if (TrioWriter.#quoteChars === undefined) {
      TrioWriter.static$init();
      if (TrioWriter.#quoteChars === undefined) TrioWriter.#quoteChars = null;
    }
    return TrioWriter.#quoteChars;
  }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  #needSep = false;

  // private field reflection only
  __needSep(it) { if (it === undefined) return this.#needSep; else this.#needSep = it; }

  #noSort = false;

  // private field reflection only
  __noSort(it) { if (it === undefined) return this.#noSort; else this.#noSort = it; }

  static make(out, opts) {
    const $self = new TrioWriter();
    TrioWriter.make$($self, out, opts);
    return $self;
  }

  static make$($self, out, opts) {
    if (opts === undefined) opts = null;
    $self.#out = out;
    if (opts != null) {
      $self.#noSort = opts.has("noSort");
    }
    ;
    return;
  }

  static dictToStr(val) {
    let buf = sys.StrBuf.make();
    TrioWriter.make(buf.out()).writeDict(val);
    return buf.toStr();
  }

  static gridToStr(grid) {
    let buf = sys.StrBuf.make();
    TrioWriter.make(buf.out()).writeGrid(grid);
    return buf.toStr();
  }

  writeGrid(grid) {
    const this$ = this;
    grid.each((row) => {
      this$.writeDict(row);
      return;
    });
    return this;
  }

  writeDict(dict) {
    const this$ = this;
    if (this.#needSep) {
      this.#out.printLine("---");
    }
    else {
      this.#needSep = true;
    }
    ;
    let names = Etc.dictNames(dict);
    if (!this.#noSort) {
      names.sort();
      names.moveTo("dis", 0);
      names.moveTo("name", 0);
      names.moveTo("id", 0);
      names.moveTo("src", -1);
    }
    ;
    names.each((n) => {
      let v = dict.get(n);
      if (v == null) {
        return;
      }
      ;
      if (v === Marker.val()) {
        this$.#out.printLine(n);
        return;
      }
      ;
      (v = this$.normVal(sys.ObjUtil.coerce(v, sys.Obj.type$)));
      this$.#out.print(n).writeChar(58);
      let kind = Kind.fromVal(v, false);
      if (kind == null) {
        this$.#out.printLine(XStr.encode(sys.ObjUtil.coerce(v, sys.Obj.type$)).toStr());
        return;
      }
      ;
      if (kind !== Kind.str()) {
        if (kind.isCollection()) {
          this$.writeCollection(sys.ObjUtil.coerce(v, sys.Obj.type$));
        }
        else {
          if (sys.ObjUtil.equals(kind, Kind.bool())) {
            this$.#out.printLine(v);
          }
          else {
            this$.#out.printLine(kind.valToZinc(sys.ObjUtil.coerce(v, sys.Obj.type$)));
          }
          ;
        }
        ;
        return;
      }
      ;
      let str = sys.ObjUtil.coerce(v, sys.Str.type$);
      if (!sys.Str.contains(str, "\n")) {
        if (TrioWriter.useQuotes(str)) {
          this$.#out.printLine(sys.Str.toCode(str));
        }
        else {
          this$.#out.printLine(str);
        }
        ;
      }
      else {
        this$.#out.printLine();
        sys.Str.splitLines(str).each((line) => {
          this$.#out.print("  ").printLine(line);
          return;
        });
      }
      ;
      return;
    });
    this.#out.flush();
    return this;
  }

  writeCollection(val) {
    if (this.requiresNestedZinc(val)) {
      return this.writeNestedZinc(val);
    }
    ;
    let zinc = ZincWriter.make(this.#out);
    zinc.writeVal(val);
    this.#out.printLine();
    return;
  }

  requiresNestedZinc(val) {
    const this$ = this;
    if (sys.ObjUtil.is(val, Grid.type$)) {
      return true;
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).any((v) => {
        return this$.requiresNestedZinc(v);
      });
    }
    ;
    if (sys.ObjUtil.is(val, Dict.type$)) {
      let r = sys.ObjUtil.coerce(val, Dict.type$).eachWhile((v) => {
        return ((this$) => { if (this$.requiresNestedZinc(v)) return "req"; return null; })(this$);
      });
      return r != null;
    }
    ;
    return false;
  }

  writeNestedZinc(val) {
    const this$ = this;
    let s = sys.StrBuf.make();
    let zinc = ZincWriter.make(s.out());
    if (sys.ObjUtil.is(val, Grid.type$)) {
      zinc.writeGrid(sys.ObjUtil.coerce(val, Grid.type$));
    }
    else {
      zinc.writeVal(val);
    }
    ;
    this.#out.printLine("Zinc:");
    sys.Str.splitLines(s.toStr()).each((line, i) => {
      this$.#out.print("  ").printLine(line);
      return;
    });
    return;
  }

  writeRec(dict) {
    return this.writeDict(dict);
  }

  writeAllRecs(dicts) {
    return this.writeAllDicts(dicts);
  }

  static useQuotes(s) {
    if (sys.Str.isEmpty(s)) {
      return true;
    }
    ;
    if (sys.ObjUtil.compareGT(sys.Str.get(s, 0), 127)) {
      return false;
    }
    ;
    if (!sys.Int.isAlpha(sys.Str.get(s, 0))) {
      return true;
    }
    ;
    if (TrioWriter.quotedKeyword().get(s) != null) {
      return true;
    }
    ;
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(s)); i = sys.Int.increment(i)) {
      if (!TrioWriter.requireQuoteChar(sys.Str.get(s, i))) {
        return true;
      }
      ;
    }
    ;
    return false;
  }

  static requireQuoteChar(ch) {
    if (sys.ObjUtil.compareGT(ch, 127)) {
      return false;
    }
    ;
    return TrioWriter.quoteChars().get(ch);
  }

  writeAllDicts(dicts) {
    const this$ = this;
    dicts.each((dict) => {
      this$.writeDict(dict);
      return;
    });
    return this;
  }

  sync() {
    this.#out.sync();
    return this;
  }

  close() {
    return this.#out.close();
  }

  normVal(val) {
    return val;
  }

  static static$init() {
    TrioWriter.#quotedKeyword = sys.ObjUtil.coerce(((this$) => { let $_u49 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")).addList(sys.List.make(sys.Str.type$, ["true", "false", "T", "F", "INF", "NA", "NaN", "R", "Zinc"])); if ($_u49 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")).addList(sys.List.make(sys.Str.type$, ["true", "false", "T", "F", "INF", "NA", "NaN", "R", "Zinc"]))); })(this), sys.Type.find("[sys::Str:sys::Str]"));
    if (true) {
      let acc = sys.List.make(sys.Bool.type$);
      acc.fill(sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), 127);
      for (let i = 97; sys.ObjUtil.compareLE(i, 122); i = sys.Int.increment(i)) {
        acc.set(i, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      }
      ;
      for (let i = 65; sys.ObjUtil.compareLE(i, 90); i = sys.Int.increment(i)) {
        acc.set(i, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      }
      ;
      for (let i = 48; sys.ObjUtil.compareLE(i, 57); i = sys.Int.increment(i)) {
        acc.set(i, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      }
      ;
      acc.set(32, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      acc.set(45, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      acc.set(95, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      TrioWriter.#quoteChars = sys.ObjUtil.coerce(((this$) => { let $_u50 = acc; if ($_u50 == null) return null; return sys.ObjUtil.toImmutable(acc); })(this), sys.Type.find("sys::Bool[]"));
    }
    ;
    return;
  }

}

class Dict {
  constructor() {
    const this$ = this;
  }

  typeof() { return Dict.type$; }

  map(f) {
    const this$ = this;
    f.__returns = ((arg) => { let r = arg; if (r == null || r == sys.Void.type$ || !(r instanceof sys.Type)) r = null; return r; })(arguments[arguments.length - 1]);
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    this.each((v, n) => {
      acc.set(n, sys.Func.call(f, v, n));
      return;
    });
    return Etc.dictFromMap(acc);
  }

  id() {
    return sys.ObjUtil.coerce(((this$) => { let $_u51 = this$.get("id", null); if ($_u51 != null) return $_u51; throw UnknownNameErr.make("id"); })(this), Ref.type$);
  }

  _id() {
    return sys.ObjUtil.coerce(((this$) => { let $_u52 = this$.get("id", null); if ($_u52 != null) return $_u52; throw UnknownNameErr.make("id"); })(this), xeto.Ref.type$);
  }

  dis(name, def) {
    if (name === undefined) name = null;
    if (def === undefined) def = "";
    if (name == null) {
      return Etc.dictToDis(this, def);
    }
    ;
    let val = this.get(sys.ObjUtil.coerce(name, sys.Str.type$));
    if (val == null) {
      return def;
    }
    ;
    return Kind.fromType(sys.ObjUtil.typeof(val)).valToDis(sys.ObjUtil.coerce(val, sys.Obj.type$));
  }

  toStr() {
    return Etc.dictToStr(this);
  }

}

class Bin extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Bin.type$; }

  #mime = null;

  mime() { return this.#mime; }

  __mime(it) { if (it === undefined) return this.#mime; else this.#mime = it; }

  static #predefined = undefined;

  static predefined() {
    if (Bin.#predefined === undefined) {
      Bin.static$init();
      if (Bin.#predefined === undefined) Bin.#predefined = null;
    }
    return Bin.#predefined;
  }

  static #defVal = undefined;

  static defVal() {
    if (Bin.#defVal === undefined) {
      Bin.static$init();
      if (Bin.#defVal === undefined) Bin.#defVal = null;
    }
    return Bin.#defVal;
  }

  static make(mime) {
    let p = Bin.predefined().get(mime);
    if (p != null) {
      return p;
    }
    ;
    if (sys.Str.contains(mime, ")")) {
      throw sys.ArgErr.make(sys.Str.plus("Bin MimeType cannot contain ')': ", mime));
    }
    ;
    return Bin.makeImpl(sys.ObjUtil.coerce(sys.MimeType.fromStr(mime), sys.MimeType.type$));
  }

  static makeImpl(mime) {
    const $self = new Bin();
    Bin.makeImpl$($self, mime);
    return $self;
  }

  static makeImpl$($self, mime) {
    $self.#mime = mime;
    return;
  }

  hash() {
    return this.#mime.hash();
  }

  equals(that) {
    let x = sys.ObjUtil.as(that, Bin.type$);
    if (x == null) {
      return false;
    }
    ;
    return sys.ObjUtil.equals(this.#mime, x.#mime);
  }

  toStr() {
    return this.#mime.toStr();
  }

  static static$init() {
    const this$ = this;
    if (true) {
      let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Bin"));
      try {
        let mimes = sys.List.make(sys.Str.type$, ["text/plain", "text/plain; charset=utf-8", "text/html", "text/html; charset=utf-8", "image/jpeg", "image/png", "image/gif", "application/pdf"]);
        mimes.each((mime) => {
          map.set(mime, Bin.makeImpl(sys.ObjUtil.coerce(sys.MimeType.fromStr(mime), sys.MimeType.type$)));
          return;
        });
      }
      catch ($_u53) {
        $_u53 = sys.Err.make($_u53);
        if ($_u53 instanceof sys.Err) {
          let e = $_u53;
          ;
          e.trace();
        }
        else {
          throw $_u53;
        }
      }
      ;
      Bin.#predefined = sys.ObjUtil.coerce(((this$) => { let $_u54 = map; if ($_u54 == null) return null; return sys.ObjUtil.toImmutable(map); })(this), sys.Type.find("[sys::Str:haystack::Bin]"));
    }
    ;
    Bin.#defVal = sys.ObjUtil.coerce(Bin.make("text/plain; charset=utf-8"), Bin.type$);
    return;
  }

}

class HaystackTokenizer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#line = 1;
    this.#factory = HaystackFactory.make();
    return;
  }

  typeof() { return HaystackTokenizer.type$; }

  #tok = null;

  tok(it) {
    if (it === undefined) {
      return this.#tok;
    }
    else {
      this.#tok = it;
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

  #line = 0;

  line(it) {
    if (it === undefined) {
      return this.#line;
    }
    else {
      this.#line = it;
      return;
    }
  }

  #keepComments = false;

  keepComments(it) {
    if (it === undefined) {
      return this.#keepComments;
    }
    else {
      this.#keepComments = it;
      return;
    }
  }

  #keywords = null;

  keywords(it) {
    if (it === undefined) {
      return this.#keywords;
    }
    else {
      this.#keywords = it;
      return;
    }
  }

  #factory = null;

  factory(it) {
    if (it === undefined) {
      return this.#factory;
    }
    else {
      this.#factory = it;
      return;
    }
  }

  #strictUnit = false;

  strictUnit(it) {
    if (it === undefined) {
      return this.#strictUnit;
    }
    else {
      this.#strictUnit = it;
      return;
    }
  }

  #in = null;

  // private field reflection only
  __in(it) { if (it === undefined) return this.#in; else this.#in = it; }

  #cur = 0;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #peek = 0;

  // private field reflection only
  __peek(it) { if (it === undefined) return this.#peek; else this.#peek = it; }

  static make(in$) {
    const $self = new HaystackTokenizer();
    HaystackTokenizer.make$($self, in$);
    return $self;
  }

  static make$($self, in$) {
    ;
    $self.#in = in$;
    $self.#tok = HaystackToken.eof();
    $self.consume();
    $self.consume();
    return;
  }

  next() {
    this.#val = null;
    let startLine = this.#line;
    while (true) {
      if ((sys.ObjUtil.equals(this.#cur, 32) || sys.ObjUtil.equals(this.#cur, 9) || sys.ObjUtil.equals(this.#cur, 160))) {
        this.consume();
        continue;
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 47)) {
        if ((sys.ObjUtil.equals(this.#peek, 47) && this.#keepComments)) {
          return ((this$) => { let $_u55 = this$.parseComment(); this$.#tok = $_u55; return $_u55; })(this);
        }
        ;
        if (sys.ObjUtil.equals(this.#peek, 47)) {
          this.skipCommentSL();
          continue;
        }
        ;
        if (sys.ObjUtil.equals(this.#peek, 42)) {
          this.skipCommentML();
          continue;
        }
        ;
      }
      ;
      break;
    }
    ;
    if ((sys.ObjUtil.equals(this.#cur, 10) || sys.ObjUtil.equals(this.#cur, 13))) {
      if ((sys.ObjUtil.equals(this.#cur, 13) && sys.ObjUtil.equals(this.#peek, 10))) {
        this.consume();
      }
      ;
      this.consume();
      ((this$) => { let $_u56 = this$.#line; this$.#line = sys.Int.increment(this$.#line); return $_u56; })(this);
      return ((this$) => { let $_u57 = HaystackToken.nl(); this$.#tok = $_u57; return $_u57; })(this);
    }
    ;
    if ((sys.Int.isAlpha(this.#cur) || (sys.ObjUtil.equals(this.#cur, 95) && (sys.Int.isAlphaNum(this.#peek) || sys.ObjUtil.equals(this.#peek, 95))))) {
      return ((this$) => { let $_u58 = this$.id(); this$.#tok = $_u58; return $_u58; })(this);
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, 34)) {
      return ((this$) => { let $_u59 = this$.str(); this$.#tok = $_u59; return $_u59; })(this);
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, 64)) {
      return ((this$) => { let $_u60 = this$.ref(); this$.#tok = $_u60; return $_u60; })(this);
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, 94)) {
      return ((this$) => { let $_u61 = this$.symbol(); this$.#tok = $_u61; return $_u61; })(this);
    }
    ;
    if (sys.Int.isDigit(this.#cur)) {
      return ((this$) => { let $_u62 = this$.num(); this$.#tok = $_u62; return $_u62; })(this);
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, 96)) {
      return ((this$) => { let $_u63 = this$.uri(); this$.#tok = $_u63; return $_u63; })(this);
    }
    ;
    if ((sys.ObjUtil.equals(this.#cur, 45) && sys.Int.isDigit(this.#peek))) {
      return ((this$) => { let $_u64 = this$.num(); this$.#tok = $_u64; return $_u64; })(this);
    }
    ;
    return ((this$) => { let $_u65 = this$.operator(); this$.#tok = $_u65; return $_u65; })(this);
  }

  close() {
    return this.#in.close();
  }

  id() {
    let s = sys.StrBuf.make();
    while ((sys.Int.isAlphaNum(this.#cur) || sys.ObjUtil.equals(this.#cur, 95))) {
      s.addChar(this.#cur);
      this.consume();
    }
    ;
    let id = this.#factory.makeId(s.toStr());
    if ((this.#keywords != null && this.#keywords.get(id) != null)) {
      this.#val = this.#keywords.get(id);
      return HaystackToken.keyword();
    }
    ;
    this.#val = id;
    return HaystackToken.id();
  }

  num() {
    let isHex = (sys.ObjUtil.equals(this.#cur, 48) && sys.ObjUtil.equals(this.#peek, 120));
    if (isHex) {
      this.consume();
      this.consume();
      let s = sys.StrBuf.make();
      while (true) {
        if (sys.Int.isDigit(this.#cur, 16)) {
          s.addChar(this.#cur);
          this.consume();
          continue;
        }
        ;
        if (sys.ObjUtil.equals(this.#cur, 95)) {
          this.consume();
          continue;
        }
        ;
        break;
      }
      ;
      this.#val = this.#factory.makeNumber(sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.fromStr(s.toStr(), 16), sys.Num.type$)), null);
      return HaystackToken.num();
    }
    ;
    let s = sys.StrBuf.make().addChar(this.#cur);
    this.consume();
    let colons = 0;
    let dashes = 0;
    let unitIndex = 0;
    let exp = false;
    while (true) {
      if (!sys.Int.isDigit(this.#cur)) {
        if ((exp && (sys.ObjUtil.equals(this.#cur, 43) || sys.ObjUtil.equals(this.#cur, 45)))) {
        }
        else {
          if (sys.ObjUtil.equals(this.#cur, 45)) {
            ((this$) => { let $_u66 = dashes; dashes = sys.Int.increment(dashes); return $_u66; })(this);
          }
          else {
            if ((sys.ObjUtil.equals(this.#cur, 58) && sys.Int.isDigit(this.#peek))) {
              ((this$) => { let $_u67 = colons; colons = sys.Int.increment(colons); return $_u67; })(this);
            }
            else {
              if (((exp || sys.ObjUtil.compareGE(colons, 1)) && sys.ObjUtil.equals(this.#cur, 43))) {
              }
              else {
                if (sys.ObjUtil.equals(this.#cur, 46)) {
                  if (!sys.Int.isDigit(this.#peek)) {
                    break;
                  }
                  ;
                }
                else {
                  if (((sys.ObjUtil.equals(this.#cur, 101) || sys.ObjUtil.equals(this.#cur, 69)) && (sys.ObjUtil.equals(this.#peek, 45) || sys.ObjUtil.equals(this.#peek, 43) || sys.Int.isDigit(this.#peek)))) {
                    (exp = true);
                  }
                  else {
                    if ((sys.Int.isAlpha(this.#cur) || sys.ObjUtil.equals(this.#cur, 37) || sys.ObjUtil.equals(this.#cur, 36) || sys.ObjUtil.equals(this.#cur, 47) || sys.ObjUtil.compareGT(this.#cur, 128))) {
                      if (sys.ObjUtil.equals(unitIndex, 0)) {
                        (unitIndex = s.size());
                      }
                      ;
                    }
                    else {
                      if (sys.ObjUtil.equals(this.#cur, 95)) {
                        if ((sys.ObjUtil.equals(unitIndex, 0) && sys.Int.isDigit(this.#peek))) {
                          this.consume();
                          continue;
                        }
                        else {
                          if (sys.ObjUtil.equals(unitIndex, 0)) {
                            (unitIndex = s.size());
                          }
                          ;
                        }
                        ;
                      }
                      else {
                        break;
                      }
                      ;
                    }
                    ;
                  }
                  ;
                }
                ;
              }
              ;
            }
            ;
          }
          ;
        }
        ;
      }
      ;
      s.addChar(this.#cur);
      this.consume();
    }
    ;
    if ((sys.ObjUtil.equals(dashes, 2) && sys.ObjUtil.equals(colons, 0))) {
      this.#val = this.#factory.makeDate(s.toStr());
      if (this.#val == null) {
        throw this.err(sys.Str.plus(sys.Str.plus("Invalid Date literal '", s), "'"));
      }
      ;
      return HaystackToken.date();
    }
    ;
    if ((sys.ObjUtil.equals(dashes, 0) && sys.ObjUtil.compareGE(colons, 1))) {
      if (sys.ObjUtil.equals(s.get(1), 58)) {
        s.insert(0, "0");
      }
      ;
      if (sys.ObjUtil.equals(colons, 1)) {
        s.add(":00");
      }
      ;
      this.#val = this.#factory.makeTime(s.toStr());
      if (this.#val == null) {
        throw this.err(sys.Str.plus(sys.Str.plus("Invalid Time literal '", s), "'"));
      }
      ;
      return HaystackToken.time();
    }
    ;
    if (sys.ObjUtil.compareGE(dashes, 2)) {
      if ((sys.ObjUtil.compareNE(this.#cur, 32) || !sys.Int.isUpper(this.#peek))) {
        if (sys.ObjUtil.equals(s.get(-1), 90)) {
          s.add(" UTC");
        }
        else {
          throw this.err("Expecting timezone");
        }
        ;
      }
      else {
        this.consume();
        s.addChar(32);
        while ((sys.Int.isAlphaNum(this.#cur) || sys.ObjUtil.equals(this.#cur, 95) || sys.ObjUtil.equals(this.#cur, 45) || sys.ObjUtil.equals(this.#cur, 43))) {
          s.addChar(this.#cur);
          this.consume();
        }
        ;
      }
      ;
      this.#val = this.#factory.makeDateTime(s.toStr());
      if (this.#val == null) {
        throw this.err(sys.Str.plus(sys.Str.plus("Invalid DateTime literal '", s), "'"));
      }
      ;
      return HaystackToken.dateTime();
    }
    ;
    let str = s.toStr();
    if (sys.ObjUtil.equals(unitIndex, 0)) {
      let float = sys.Float.fromStr(str, false);
      if (float == null) {
        throw this.err(sys.Str.plus(sys.Str.plus("Invalid Number literal '", str), "'"));
      }
      ;
      this.#val = Number.make(sys.ObjUtil.coerce(float, sys.Float.type$), null);
    }
    else {
      let floatStr = sys.Str.getRange(str, sys.Range.make(0, unitIndex, true));
      let unitStr = sys.Str.getRange(str, sys.Range.make(unitIndex, -1));
      let float = sys.Float.fromStr(floatStr, false);
      if (float == null) {
        throw this.err(sys.Str.plus(sys.Str.plus("Invalid Number literal '", floatStr), "'"));
      }
      ;
      let unit = Number.loadUnit(unitStr, false);
      if (unit == null) {
        throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid unit name '", unitStr), "' ["), sys.Str.toCode(unitStr, sys.ObjUtil.coerce(34, sys.Int.type$.toNullable()), true)), "]"));
      }
      ;
      if ((this.#strictUnit && sys.ObjUtil.compareNE(unitStr, unit.symbol()))) {
        throw this.err(sys.Str.plus(sys.Str.plus("Must use normalized unit key '", unit.symbol()), "'"));
      }
      ;
      this.#val = this.#factory.makeNumber(sys.ObjUtil.coerce(float, sys.Float.type$), unit);
    }
    ;
    return HaystackToken.num();
  }

  str() {
    this.consume();
    let isTriple = (sys.ObjUtil.equals(this.#cur, 34) && sys.ObjUtil.equals(this.#peek, 34));
    if (isTriple) {
      this.consume();
      this.consume();
    }
    ;
    let s = sys.StrBuf.make();
    while (true) {
      let ch = this.#cur;
      if (sys.ObjUtil.equals(ch, 34)) {
        this.consume();
        if (isTriple) {
          if ((sys.ObjUtil.compareNE(this.#cur, 34) || sys.ObjUtil.compareNE(this.#peek, 34))) {
            s.addChar(34);
            continue;
          }
          ;
          this.consume();
          this.consume();
        }
        ;
        break;
      }
      ;
      if (sys.ObjUtil.equals(ch, 0)) {
        throw this.err("Unexpected end of str");
      }
      ;
      if (sys.ObjUtil.equals(ch, 92)) {
        s.addChar(this.escape());
        continue;
      }
      ;
      this.consume();
      s.addChar(ch);
    }
    ;
    this.#val = this.#factory.makeStr(s.toStr());
    return HaystackToken.str();
  }

  ref() {
    this.consume();
    let s = sys.StrBuf.make();
    while (true) {
      let ch = this.#cur;
      if (Ref.isIdChar(ch)) {
        this.consume();
        s.addChar(ch);
      }
      else {
        break;
      }
      ;
    }
    ;
    if (s.isEmpty()) {
      throw this.err("Invalid empty Ref");
    }
    ;
    this.#val = this.#factory.makeRef(s.toStr(), null);
    return HaystackToken.ref();
  }

  symbol() {
    this.consume();
    let s = sys.StrBuf.make();
    while (true) {
      let ch = this.#cur;
      if (Ref.isIdChar(ch)) {
        this.consume();
        s.addChar(ch);
      }
      else {
        break;
      }
      ;
    }
    ;
    if (s.isEmpty()) {
      throw this.err("Invalid empty Symbol");
    }
    ;
    this.#val = this.#factory.makeSymbol(s.toStr());
    return HaystackToken.symbol();
  }

  uri() {
    this.consume();
    let s = sys.StrBuf.make();
    while (true) {
      let ch = this.#cur;
      if (sys.ObjUtil.equals(ch, 96)) {
        this.consume();
        break;
      }
      ;
      if ((sys.ObjUtil.equals(ch, 0) || sys.ObjUtil.equals(ch, 10))) {
        throw this.err("Unexpected end of uri");
      }
      ;
      if (sys.ObjUtil.equals(ch, 92)) {
        let $_u68 = this.#peek;
        if (sys.ObjUtil.equals($_u68, 58) || sys.ObjUtil.equals($_u68, 47) || sys.ObjUtil.equals($_u68, 63) || sys.ObjUtil.equals($_u68, 35) || sys.ObjUtil.equals($_u68, 91) || sys.ObjUtil.equals($_u68, 93) || sys.ObjUtil.equals($_u68, 64) || sys.ObjUtil.equals($_u68, 92) || sys.ObjUtil.equals($_u68, 38) || sys.ObjUtil.equals($_u68, 61) || sys.ObjUtil.equals($_u68, 59)) {
          s.addChar(ch);
          s.addChar(this.#peek);
          this.consume();
          this.consume();
        }
        else {
          s.addChar(this.escape());
        }
        ;
      }
      else {
        this.consume();
        s.addChar(ch);
      }
      ;
    }
    ;
    this.#val = this.#factory.makeUri(s.toStr());
    return HaystackToken.uri();
  }

  escape() {
    this.consume();
    let $_u69 = this.#cur;
    if (sys.ObjUtil.equals($_u69, 98)) {
      this.consume();
      return 8;
    }
    else if (sys.ObjUtil.equals($_u69, 102)) {
      this.consume();
      return 12;
    }
    else if (sys.ObjUtil.equals($_u69, 110)) {
      this.consume();
      return 10;
    }
    else if (sys.ObjUtil.equals($_u69, 114)) {
      this.consume();
      return 13;
    }
    else if (sys.ObjUtil.equals($_u69, 116)) {
      this.consume();
      return 9;
    }
    else if (sys.ObjUtil.equals($_u69, 34)) {
      this.consume();
      return 34;
    }
    else if (sys.ObjUtil.equals($_u69, 36)) {
      this.consume();
      return 36;
    }
    else if (sys.ObjUtil.equals($_u69, 39)) {
      this.consume();
      return 39;
    }
    else if (sys.ObjUtil.equals($_u69, 96)) {
      this.consume();
      return 96;
    }
    else if (sys.ObjUtil.equals($_u69, 92)) {
      this.consume();
      return 92;
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, 117)) {
      this.consume();
      let n3 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      let n2 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      let n1 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      let n0 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      if ((n3 == null || n2 == null || n1 == null || n0 == null)) {
        throw this.err("Invalid hex value for \\uxxxx");
      }
      ;
      return sys.Int.or(sys.Int.or(sys.Int.or(sys.Int.shiftl(sys.ObjUtil.coerce(n3, sys.Int.type$), 12), sys.Int.shiftl(sys.ObjUtil.coerce(n2, sys.Int.type$), 8)), sys.Int.shiftl(sys.ObjUtil.coerce(n1, sys.Int.type$), 4)), sys.ObjUtil.coerce(n0, sys.Int.type$));
    }
    ;
    throw this.err("Invalid escape sequence");
  }

  operator() {
    let c = this.#cur;
    this.consume();
    let $_u70 = c;
    if (sys.ObjUtil.equals($_u70, 44)) {
      return HaystackToken.comma();
    }
    else if (sys.ObjUtil.equals($_u70, 58)) {
      if (sys.ObjUtil.equals(this.#cur, 58)) {
        this.consume();
        return HaystackToken.colon2();
      }
      ;
      return HaystackToken.colon();
    }
    else if (sys.ObjUtil.equals($_u70, 59)) {
      return HaystackToken.semicolon();
    }
    else if (sys.ObjUtil.equals($_u70, 91)) {
      return HaystackToken.lbracket();
    }
    else if (sys.ObjUtil.equals($_u70, 93)) {
      return HaystackToken.rbracket();
    }
    else if (sys.ObjUtil.equals($_u70, 123)) {
      return HaystackToken.lbrace();
    }
    else if (sys.ObjUtil.equals($_u70, 125)) {
      return HaystackToken.rbrace();
    }
    else if (sys.ObjUtil.equals($_u70, 40)) {
      return HaystackToken.lparen();
    }
    else if (sys.ObjUtil.equals($_u70, 41)) {
      return HaystackToken.rparen();
    }
    else if (sys.ObjUtil.equals($_u70, 60)) {
      if (sys.ObjUtil.equals(this.#cur, 60)) {
        this.consume();
        return HaystackToken.lt2();
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 61)) {
        this.consume();
        return HaystackToken.ltEq();
      }
      ;
      return HaystackToken.lt();
    }
    else if (sys.ObjUtil.equals($_u70, 62)) {
      if (sys.ObjUtil.equals(this.#cur, 62)) {
        this.consume();
        return HaystackToken.gt2();
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 61)) {
        this.consume();
        return HaystackToken.gtEq();
      }
      ;
      return HaystackToken.gt();
    }
    else if (sys.ObjUtil.equals($_u70, 45)) {
      if (sys.ObjUtil.equals(this.#cur, 62)) {
        this.consume();
        return HaystackToken.arrow();
      }
      ;
      return HaystackToken.minus();
    }
    else if (sys.ObjUtil.equals($_u70, 61)) {
      if (sys.ObjUtil.equals(this.#cur, 61)) {
        this.consume();
        return HaystackToken.eq();
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 62)) {
        this.consume();
        return HaystackToken.fnArrow();
      }
      ;
      return HaystackToken.assign();
    }
    else if (sys.ObjUtil.equals($_u70, 33)) {
      if (sys.ObjUtil.equals(this.#cur, 61)) {
        this.consume();
        return HaystackToken.notEq();
      }
      ;
      return HaystackToken.bang();
    }
    else if (sys.ObjUtil.equals($_u70, 47)) {
      return HaystackToken.slash();
    }
    else if (sys.ObjUtil.equals($_u70, 46)) {
      return HaystackToken.dot();
    }
    else if (sys.ObjUtil.equals($_u70, 63)) {
      return HaystackToken.question();
    }
    else if (sys.ObjUtil.equals($_u70, 38)) {
      return HaystackToken.amp();
    }
    else if (sys.ObjUtil.equals($_u70, 124)) {
      return HaystackToken.pipe();
    }
    else if (sys.ObjUtil.equals($_u70, 0)) {
      return HaystackToken.eof();
    }
    ;
    if (sys.ObjUtil.equals(c, 0)) {
      return HaystackToken.eof();
    }
    ;
    throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unexpected symbol: ", sys.Str.toCode(sys.Int.toChar(c), sys.ObjUtil.coerce(39, sys.Int.type$.toNullable()))), " (0x"), sys.Int.toHex(c)), ")"));
  }

  parseComment() {
    let s = sys.StrBuf.make();
    this.consume();
    this.consume();
    if (sys.ObjUtil.equals(this.#cur, 32)) {
      this.consume();
    }
    ;
    while (true) {
      if ((sys.ObjUtil.equals(this.#cur, 10) || sys.ObjUtil.equals(this.#cur, 0))) {
        break;
      }
      ;
      s.addChar(this.#cur);
      this.consume();
    }
    ;
    this.#val = s.toStr();
    return HaystackToken.comment();
  }

  skipCommentSL() {
    this.consume();
    this.consume();
    while (true) {
      if ((sys.ObjUtil.equals(this.#cur, 10) || sys.ObjUtil.equals(this.#cur, 0))) {
        break;
      }
      ;
      this.consume();
    }
    ;
    return;
  }

  skipCommentML() {
    this.consume();
    this.consume();
    let depth = 1;
    while (true) {
      if ((sys.ObjUtil.equals(this.#cur, 42) && sys.ObjUtil.equals(this.#peek, 47))) {
        this.consume();
        this.consume();
        ((this$) => { let $_u71 = depth; depth = sys.Int.decrement(depth); return $_u71; })(this);
        if (sys.ObjUtil.compareLE(depth, 0)) {
          break;
        }
        ;
      }
      ;
      if ((sys.ObjUtil.equals(this.#cur, 47) && sys.ObjUtil.equals(this.#peek, 42))) {
        this.consume();
        this.consume();
        ((this$) => { let $_u72 = depth; depth = sys.Int.increment(depth); return $_u72; })(this);
        continue;
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 10)) {
        this.#line = sys.Int.increment(this.#line);
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 0)) {
        break;
      }
      ;
      this.consume();
    }
    ;
    return;
  }

  err(msg) {
    this.#val = msg;
    return sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", msg), " [line "), sys.ObjUtil.coerce(this.#line, sys.Obj.type$.toNullable())), "]"));
  }

  consume() {
    this.#cur = this.#peek;
    this.#peek = sys.ObjUtil.coerce(((this$) => { let $_u73 = this$.#in.readChar(); if ($_u73 != null) return $_u73; return sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()); })(this), sys.Int.type$);
    return;
  }

}

class HaystackParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HaystackParser.type$; }

  #input = null;

  input() { return this.#input; }

  __input(it) { if (it === undefined) return this.#input; else this.#input = it; }

  #tokenizer = null;

  tokenizer(it) {
    if (it === undefined) {
      return this.#tokenizer;
    }
    else {
      this.#tokenizer = it;
      return;
    }
  }

  #cur = null;

  cur(it) {
    if (it === undefined) {
      return this.#cur;
    }
    else {
      this.#cur = it;
      return;
    }
  }

  #curVal = null;

  curVal(it) {
    if (it === undefined) {
      return this.#curVal;
    }
    else {
      this.#curVal = it;
      return;
    }
  }

  #peek = null;

  peek(it) {
    if (it === undefined) {
      return this.#peek;
    }
    else {
      this.#peek = it;
      return;
    }
  }

  #peekVal = null;

  peekVal(it) {
    if (it === undefined) {
      return this.#peekVal;
    }
    else {
      this.#peekVal = it;
      return;
    }
  }

  static make(s) {
    const $self = new HaystackParser();
    HaystackParser.make$($self, s);
    return $self;
  }

  static make$($self, s) {
    $self.#input = s;
    $self.#tokenizer = HaystackTokenizer.make(sys.Str.in(s));
    $self.#cur = ((this$) => { let $_u74 = HaystackToken.eof(); this$.#peek = $_u74; return $_u74; })($self);
    $self.consume();
    $self.consume();
    return;
  }

  isKeyword(n) {
    return (this.#cur === HaystackToken.id() && sys.ObjUtil.equals(this.#curVal, n));
  }

  verify(expected) {
    if (sys.ObjUtil.compareNE(this.#cur, expected)) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expected ", expected), " not "), this.curToStr()));
    }
    ;
    return;
  }

  curToStr() {
    return ((this$) => { if (this$.#curVal != null) return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.#cur), " "), sys.Str.toCode(sys.ObjUtil.toStr(this$.#curVal))); return this$.#cur.toStr(); })(this);
  }

  consume(expected) {
    if (expected === undefined) expected = null;
    if (expected != null) {
      this.verify(sys.ObjUtil.coerce(expected, HaystackToken.type$));
    }
    ;
    this.#cur = this.#peek;
    this.#curVal = this.#peekVal;
    this.#peek = this.#tokenizer.next();
    this.#peekVal = this.#tokenizer.val();
    return;
  }

  err(msg) {
    throw sys.ParseErr.make(msg);
  }

}

class HaystackFactory extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HaystackFactory.type$; }

  makeId(s) {
    return s;
  }

  makeStr(s) {
    return s;
  }

  makeUri(s) {
    return sys.ObjUtil.coerce(sys.Uri.fromStr(s), sys.Uri.type$);
  }

  makeRef(s, dis) {
    return Ref.makeImpl(s, dis);
  }

  makeSymbol(s) {
    return sys.ObjUtil.coerce(Symbol.fromStr(s), Symbol.type$);
  }

  makeTime(s) {
    return sys.Time.fromStr(s, false);
  }

  makeDate(s) {
    return sys.Date.fromStr(s, false);
  }

  makeDateTime(s) {
    return sys.DateTime.fromStr(s, false);
  }

  makeNumber(f, unit) {
    return Number.make(f, unit);
  }

  static make() {
    const $self = new HaystackFactory();
    HaystackFactory.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class FreeFormParser extends HaystackParser {
  constructor() {
    super();
    const this$ = this;
    this.#acc = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Obj:sys::Obj?]")), sys.Type.find("[sys::Str:sys::Obj?]"));
    return;
  }

  typeof() { return FreeFormParser.type$; }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #acc = null;

  // private field reflection only
  __acc(it) { if (it === undefined) return this.#acc; else this.#acc = it; }

  static make(ns, s) {
    const $self = new FreeFormParser();
    FreeFormParser.make$($self, ns, s);
    return $self;
  }

  static make$($self, ns, s) {
    HaystackParser.make$($self, s);
    ;
    $self.#ns = ns;
    return;
  }

  parse() {
    return this.postProcess(this.parseRaw());
  }

  parseRaw() {
    try {
      while (sys.ObjUtil.compareNE(this.cur(), HaystackToken.eof())) {
        this.tag();
      }
      ;
      return this.#acc;
    }
    catch ($_u76) {
      $_u76 = sys.Err.make($_u76);
      if ($_u76 instanceof sys.Err) {
        let e = $_u76;
        ;
      }
      else {
        throw $_u76;
      }
    }
    ;
    let colon = sys.Str.index(this.input(), ":");
    if (colon == null) {
      return this.#acc.set(this.input(), Marker.val());
    }
    ;
    let name = sys.Str.trim(sys.Str.getRange(this.input(), sys.Range.make(0, sys.ObjUtil.coerce(colon, sys.Int.type$), true)));
    let val = sys.Str.trim(sys.Str.getRange(this.input(), sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1), -1)));
    return this.#acc.set(name, val);
  }

  tag() {
    this.verify(HaystackToken.id());
    let name = this.curVal();
    this.consume();
    let val = Marker.val();
    if (sys.ObjUtil.equals(this.cur(), HaystackToken.colon())) {
      this.consume();
      (val = this.curToVal());
      this.consume();
    }
    ;
    if (sys.ObjUtil.equals(this.cur(), HaystackToken.comma())) {
      this.consume();
    }
    ;
    this.#acc.set(sys.ObjUtil.coerce(name, sys.Str.type$), val);
    return;
  }

  curToVal() {
    if (this.cur().literal()) {
      return sys.ObjUtil.coerce(this.curVal(), sys.Obj.type$);
    }
    ;
    if (sys.ObjUtil.equals(this.cur(), HaystackToken.id())) {
      let $_u77 = this.curVal();
      if (sys.ObjUtil.equals($_u77, "true")) {
        return sys.ObjUtil.coerce(true, sys.Obj.type$);
      }
      else if (sys.ObjUtil.equals($_u77, "false")) {
        return sys.ObjUtil.coerce(false, sys.Obj.type$);
      }
      else if (sys.ObjUtil.equals($_u77, "NA")) {
        return NA.val();
      }
      else {
        return sys.ObjUtil.coerce(this.curVal(), sys.Obj.type$);
      }
      ;
    }
    ;
    throw this.err(sys.Str.plus("Not value: ", this.cur()));
  }

  postProcess(acc) {
    const this$ = this;
    return Etc.makeDict(acc.map((v, n) => {
      return this$.norm(n, v);
    }, sys.Obj.type$.toNullable()));
  }

  norm(name, val) {
    let tag = this.#ns.def(name, false);
    if ((tag != null && sys.ObjUtil.equals(val, Marker.val()))) {
      return this.#ns.defToKind(sys.ObjUtil.coerce(tag, Def.type$)).defVal();
    }
    else {
      return val;
    }
    ;
  }

}

class HaystackToken extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HaystackToken.type$; }

  static id() { return HaystackToken.vals().get(0); }

  static keyword() { return HaystackToken.vals().get(1); }

  static num() { return HaystackToken.vals().get(2); }

  static str() { return HaystackToken.vals().get(3); }

  static ref() { return HaystackToken.vals().get(4); }

  static symbol() { return HaystackToken.vals().get(5); }

  static uri() { return HaystackToken.vals().get(6); }

  static date() { return HaystackToken.vals().get(7); }

  static time() { return HaystackToken.vals().get(8); }

  static dateTime() { return HaystackToken.vals().get(9); }

  static dot() { return HaystackToken.vals().get(10); }

  static colon() { return HaystackToken.vals().get(11); }

  static colon2() { return HaystackToken.vals().get(12); }

  static comma() { return HaystackToken.vals().get(13); }

  static semicolon() { return HaystackToken.vals().get(14); }

  static minus() { return HaystackToken.vals().get(15); }

  static eq() { return HaystackToken.vals().get(16); }

  static notEq() { return HaystackToken.vals().get(17); }

  static lt() { return HaystackToken.vals().get(18); }

  static lt2() { return HaystackToken.vals().get(19); }

  static ltEq() { return HaystackToken.vals().get(20); }

  static gt() { return HaystackToken.vals().get(21); }

  static gt2() { return HaystackToken.vals().get(22); }

  static gtEq() { return HaystackToken.vals().get(23); }

  static lbrace() { return HaystackToken.vals().get(24); }

  static rbrace() { return HaystackToken.vals().get(25); }

  static lparen() { return HaystackToken.vals().get(26); }

  static rparen() { return HaystackToken.vals().get(27); }

  static lbracket() { return HaystackToken.vals().get(28); }

  static rbracket() { return HaystackToken.vals().get(29); }

  static arrow() { return HaystackToken.vals().get(30); }

  static fnArrow() { return HaystackToken.vals().get(31); }

  static slash() { return HaystackToken.vals().get(32); }

  static assign() { return HaystackToken.vals().get(33); }

  static bang() { return HaystackToken.vals().get(34); }

  static question() { return HaystackToken.vals().get(35); }

  static amp() { return HaystackToken.vals().get(36); }

  static pipe() { return HaystackToken.vals().get(37); }

  static nl() { return HaystackToken.vals().get(38); }

  static comment() { return HaystackToken.vals().get(39); }

  static eof() { return HaystackToken.vals().get(40); }

  static #vals = undefined;

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  #literal = false;

  literal() { return this.#literal; }

  __literal(it) { if (it === undefined) return this.#literal; else this.#literal = it; }

  static make($ordinal, $name, dis, literal) {
    const $self = new HaystackToken();
    HaystackToken.make$($self, $ordinal, $name, dis, literal);
    return $self;
  }

  static make$($self, $ordinal, $name, dis, literal) {
    if (literal === undefined) literal = false;
    sys.Enum.make$($self, $ordinal, $name);
    $self.#dis = dis;
    $self.#literal = literal;
    return;
  }

  toStr() {
    return this.#dis;
  }

  static fromStr(name$, checked = true) {
    return sys.Enum.doFromStr(HaystackToken.type$, HaystackToken.vals(), name$, checked);
  }

  static vals() {
    if (HaystackToken.#vals == null) {
      HaystackToken.#vals = sys.List.make(HaystackToken.type$, [
        HaystackToken.make(0, "id", "identifier"),
        HaystackToken.make(1, "keyword", "keyword"),
        HaystackToken.make(2, "num", "Number", true),
        HaystackToken.make(3, "str", "Str", true),
        HaystackToken.make(4, "ref", "Ref", true),
        HaystackToken.make(5, "symbol", "Symbol", true),
        HaystackToken.make(6, "uri", "Uri", true),
        HaystackToken.make(7, "date", "Date", true),
        HaystackToken.make(8, "time", "Time", true),
        HaystackToken.make(9, "dateTime", "DateTime", true),
        HaystackToken.make(10, "dot", "."),
        HaystackToken.make(11, "colon", ":"),
        HaystackToken.make(12, "colon2", "::"),
        HaystackToken.make(13, "comma", ","),
        HaystackToken.make(14, "semicolon", ";"),
        HaystackToken.make(15, "minus", "-"),
        HaystackToken.make(16, "eq", "=="),
        HaystackToken.make(17, "notEq", "!="),
        HaystackToken.make(18, "lt", "<"),
        HaystackToken.make(19, "lt2", "<<"),
        HaystackToken.make(20, "ltEq", "<="),
        HaystackToken.make(21, "gt", ">"),
        HaystackToken.make(22, "gt2", ">>"),
        HaystackToken.make(23, "gtEq", ">="),
        HaystackToken.make(24, "lbrace", "{"),
        HaystackToken.make(25, "rbrace", "}"),
        HaystackToken.make(26, "lparen", "("),
        HaystackToken.make(27, "rparen", ")"),
        HaystackToken.make(28, "lbracket", "["),
        HaystackToken.make(29, "rbracket", "]"),
        HaystackToken.make(30, "arrow", "->"),
        HaystackToken.make(31, "fnArrow", "=>"),
        HaystackToken.make(32, "slash", "/"),
        HaystackToken.make(33, "assign", "="),
        HaystackToken.make(34, "bang", "!"),
        HaystackToken.make(35, "question", "?"),
        HaystackToken.make(36, "amp", "&"),
        HaystackToken.make(37, "pipe", "|"),
        HaystackToken.make(38, "nl", "newline"),
        HaystackToken.make(39, "comment", "comment"),
        HaystackToken.make(40, "eof", "eof"),
      ]).toImmutable();
    }
    return HaystackToken.#vals;
  }

  static static$init() {
    const $_u78 = HaystackToken.vals();
    if (true) {
    }
    ;
    return;
  }

}

class Filter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Filter.type$; }

  static has(path) {
    return FilterHas.make(FilterPath.fromObj(path));
  }

  static missing(path) {
    return FilterMissing.make(FilterPath.fromObj(path));
  }

  static eq(path, val) {
    return FilterEq.make(FilterPath.fromObj(path), val);
  }

  static ne(path, val) {
    return FilterNe.make(FilterPath.fromObj(path), val);
  }

  static lt(path, val) {
    return FilterLt.make(FilterPath.fromObj(path), val);
  }

  static le(path, val) {
    return FilterLe.make(FilterPath.fromObj(path), val);
  }

  static gt(path, val) {
    return FilterGt.make(FilterPath.fromObj(path), val);
  }

  static ge(path, val) {
    return FilterGe.make(FilterPath.fromObj(path), val);
  }

  and(that) {
    const this$ = this;
    return Filter.logic(this, FilterType.and(), that, (a, b) => {
      return FilterAnd.make(a, b);
    });
  }

  or(that) {
    const this$ = this;
    return Filter.logic(this, FilterType.or(), that, (a, b) => {
      return FilterOr.make(a, b);
    });
  }

  static isSpec(spec) {
    return FilterIsSpec.make(spec);
  }

  static isSymbol(symbol) {
    return FilterIsSymbol.make(symbol);
  }

  static logic(a, op, b, f) {
    if ((a.type() !== op && b.type() !== op)) {
      if (sys.ObjUtil.compareGT(a, b)) {
        let temp = a;
        (a = b);
        (b = temp);
      }
      ;
      return sys.Func.call(f, a, b);
    }
    ;
    let parts = sys.List.make(Filter.type$);
    Filter.logicFind(parts, op, a);
    Filter.logicFind(parts, op, b);
    parts.sort();
    let q = parts.get(0);
    for (let i = 1; sys.ObjUtil.compareLT(i, parts.size()); i = sys.Int.increment(i)) {
      (q = sys.Func.call(f, q, parts.get(i)));
    }
    ;
    return q;
  }

  static logicFind(parts, op, x) {
    if (x.type() !== op) {
      parts.add(x);
      return;
    }
    ;
    Filter.logicFind(parts, op, sys.ObjUtil.coerce(x.argA(), Filter.type$));
    Filter.logicFind(parts, op, sys.ObjUtil.coerce(x.argB(), Filter.type$));
    return;
  }

  static search(pattern) {
    try {
      if (sys.Str.startsWith(pattern, "re:")) {
        return RegexSearchFilter.make(pattern);
      }
      ;
      if (sys.Str.startsWith(pattern, "f:")) {
        return FilterSearchFilter.make(pattern);
      }
      ;
    }
    catch ($_u79) {
      $_u79 = sys.Err.make($_u79);
      if ($_u79 instanceof sys.Err) {
        let e = $_u79;
        ;
      }
      else {
        throw $_u79;
      }
    }
    ;
    return GlobSearchFilter.make(pattern);
  }

  static searchFromOpts(opts) {
    let pattern = sys.Str.trim(((this$) => { let $_u80 = sys.ObjUtil.as(((this$) => { let $_u81 = opts; if ($_u81 == null) return null; return opts.get("search"); })(this$), sys.Str.type$); if ($_u80 != null) return $_u80; return ""; })(this));
    if (sys.Str.isEmpty(pattern)) {
      return null;
    }
    ;
    return Filter.search(pattern);
  }

  static fromStr(s, checked) {
    if (checked === undefined) checked = true;
    try {
      return FilterParser.make(s).parse();
    }
    catch ($_u82) {
      $_u82 = sys.Err.make($_u82);
      if ($_u82 instanceof sys.ParseErr) {
        let e = $_u82;
        ;
        if (checked) {
          throw e;
        }
        ;
        return null;
      }
      else if ($_u82 instanceof sys.Err) {
        let e = $_u82;
        ;
        if (checked) {
          throw sys.ParseErr.make(s, e);
        }
        ;
        return null;
      }
      else {
        throw $_u82;
      }
    }
    ;
  }

  include(r, pather) {
    return this.doMatches(r, sys.ObjUtil.coerce(((this$) => { if (pather == null) return HaystackContext.nil(); return PatherContext.make(sys.ObjUtil.coerce(pather, sys.Type.find("|haystack::Ref->haystack::Dict?|"))); })(this), HaystackContext.type$));
  }

  matches(r, cx) {
    if (cx === undefined) cx = null;
    return this.doMatches(r, sys.ObjUtil.coerce(((this$) => { let $_u84 = cx; if ($_u84 != null) return $_u84; return HaystackContext.nil(); })(this), HaystackContext.type$));
  }

  argA() {
    return null;
  }

  argB() {
    return null;
  }

  isCompound() {
    return false;
  }

  equals(that) {
    return (sys.ObjUtil.is(that, Filter.type$) && sys.ObjUtil.equals(this.toStr(), sys.ObjUtil.toStr(that)));
  }

  hash() {
    return sys.Str.hash(this.toStr());
  }

  compare(that) {
    let x = sys.ObjUtil.coerce(that, Filter.type$);
    let cmp = sys.ObjUtil.compare(this.type(), x.type());
    if (sys.ObjUtil.compareNE(cmp, 0)) {
      return cmp;
    }
    ;
    (cmp = sys.ObjUtil.compare(this.argA(), x.argA()));
    if (sys.ObjUtil.compareNE(cmp, 0)) {
      return cmp;
    }
    ;
    return sys.ObjUtil.compare(this.argB(), x.argB());
  }

  static make() {
    const $self = new Filter();
    Filter.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class FilterType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterType.type$; }

  static has() { return FilterType.vals().get(0); }

  static missing() { return FilterType.vals().get(1); }

  static eq() { return FilterType.vals().get(2); }

  static ne() { return FilterType.vals().get(3); }

  static gt() { return FilterType.vals().get(4); }

  static ge() { return FilterType.vals().get(5); }

  static lt() { return FilterType.vals().get(6); }

  static le() { return FilterType.vals().get(7); }

  static and() { return FilterType.vals().get(8); }

  static or() { return FilterType.vals().get(9); }

  static isSymbol() { return FilterType.vals().get(10); }

  static isSpec() { return FilterType.vals().get(11); }

  static search() { return FilterType.vals().get(12); }

  static #vals = undefined;

  static make($ordinal, $name) {
    const $self = new FilterType();
    FilterType.make$($self, $ordinal, $name);
    return $self;
  }

  static make$($self, $ordinal, $name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked = true) {
    return sys.Enum.doFromStr(FilterType.type$, FilterType.vals(), name$, checked);
  }

  static vals() {
    if (FilterType.#vals == null) {
      FilterType.#vals = sys.List.make(FilterType.type$, [
        FilterType.make(0, "has",),
        FilterType.make(1, "missing",),
        FilterType.make(2, "eq",),
        FilterType.make(3, "ne",),
        FilterType.make(4, "gt",),
        FilterType.make(5, "ge",),
        FilterType.make(6, "lt",),
        FilterType.make(7, "le",),
        FilterType.make(8, "and",),
        FilterType.make(9, "or",),
        FilterType.make(10, "isSymbol",),
        FilterType.make(11, "isSpec",),
        FilterType.make(12, "search",),
      ]).toImmutable();
    }
    return FilterType.#vals;
  }

  static static$init() {
    const $_u85 = FilterType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class SimpleFilter extends Filter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SimpleFilter.type$; }

  #path = null;

  path() { return this.#path; }

  __path(it) { if (it === undefined) return this.#path; else this.#path = it; }

  static make(p) {
    const $self = new SimpleFilter();
    SimpleFilter.make$($self, p);
    return $self;
  }

  static make$($self, p) {
    Filter.make$($self);
    $self.#path = p;
    return;
  }

  eachTag(f) {
    sys.Func.call(f, this.#path.get(0));
    return;
  }

  eachVal(f) {
    return;
  }

  argA() {
    return this.#path;
  }

  doMatches(r, cx) {
    return this.matchesAt(r.get(this.#path.get(0)), 0, cx);
  }

  matchesAt(val, level, cx) {
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      let list = sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]"));
      for (let i = 0; sys.ObjUtil.compareLT(i, list.size()); i = sys.Int.increment(i)) {
        let ref = sys.ObjUtil.as(list.get(i), Ref.type$);
        if ((ref != null && this.matchesAt(ref, level, cx))) {
          return true;
        }
        ;
      }
      ;
    }
    ;
    if (sys.ObjUtil.compareLT(sys.Int.plus(level, 1), this.#path.size())) {
      if (sys.ObjUtil.is(val, Ref.type$)) {
        (val = cx.deref(sys.ObjUtil.coerce(val, Ref.type$)));
      }
      ;
      let dict = sys.ObjUtil.as(val, Dict.type$);
      if (dict != null) {
        return this.matchesAt(dict.get(this.#path.get(sys.Int.plus(level, 1))), sys.Int.plus(level, 1), cx);
      }
      ;
      if (sys.ObjUtil.is(val, sys.DateTime.type$)) {
        let $_u86 = this.#path.get(sys.Int.plus(level, 1));
        if (sys.ObjUtil.equals($_u86, "date")) {
          return this.matchesAt(sys.ObjUtil.coerce(val, sys.DateTime.type$).date(), sys.Int.plus(level, 1), cx);
        }
        else if (sys.ObjUtil.equals($_u86, "time")) {
          return this.matchesAt(sys.ObjUtil.coerce(val, sys.DateTime.type$).time(), sys.Int.plus(level, 1), cx);
        }
        else if (sys.ObjUtil.equals($_u86, "tz")) {
          return this.matchesAt(sys.ObjUtil.coerce(val, sys.DateTime.type$).tz().name(), sys.Int.plus(level, 1), cx);
        }
        ;
      }
      ;
      (val = null);
    }
    ;
    return this.doMatchesVal(val);
  }

}

class FilterHas extends SimpleFilter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterHas.type$; }

  static make(p) {
    const $self = new FilterHas();
    FilterHas.make$($self, p);
    return $self;
  }

  static make$($self, p) {
    SimpleFilter.make$($self, p);
    return;
  }

  doMatchesVal(v) {
    return v != null;
  }

  pattern() {
    return this.toStr();
  }

  type() {
    return FilterType.has();
  }

  toStr() {
    return this.path().toStr();
  }

}

class FilterMissing extends SimpleFilter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterMissing.type$; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  static make(p) {
    const $self = new FilterMissing();
    FilterMissing.make$($self, p);
    return $self;
  }

  static make$($self, p) {
    SimpleFilter.make$($self, p);
    $self.#toStr = sys.Str.plus("not ", p);
    return;
  }

  doMatchesVal(v) {
    return v == null;
  }

  pattern() {
    return this.#toStr;
  }

  type() {
    return FilterType.missing();
  }

}

class FilterEq extends SimpleFilter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterEq.type$; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  #val = null;

  // private field reflection only
  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make(p, v) {
    const $self = new FilterEq();
    FilterEq.make$($self, p, v);
    return $self;
  }

  static make$($self, p, v) {
    SimpleFilter.make$($self, p);
    $self.#val = ((this$) => { let $_u87 = v; if ($_u87 == null) return null; return sys.ObjUtil.toImmutable(v); })($self);
    $self.#toStr = sys.Str.plus(sys.Str.plus(sys.Str.plus("", p), " == "), Kind.fromVal(v).valToStr(v));
    return;
  }

  doMatchesVal(v) {
    return sys.ObjUtil.equals(v, this.#val);
  }

  eachVal(f) {
    sys.Func.call(f, this.#val, this.path());
    return;
  }

  pattern() {
    return sys.Str.plus(sys.Str.plus("", this.path()), " == ?");
  }

  type() {
    return FilterType.eq();
  }

  argB() {
    return this.#val;
  }

}

class FilterNe extends SimpleFilter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterNe.type$; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  #val = null;

  // private field reflection only
  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make(p, v) {
    const $self = new FilterNe();
    FilterNe.make$($self, p, v);
    return $self;
  }

  static make$($self, p, v) {
    SimpleFilter.make$($self, p);
    $self.#val = ((this$) => { let $_u88 = v; if ($_u88 == null) return null; return sys.ObjUtil.toImmutable(v); })($self);
    $self.#toStr = sys.Str.plus(sys.Str.plus(sys.Str.plus("", p), " != "), Kind.fromVal(v).valToStr(v));
    return;
  }

  doMatchesVal(v) {
    return (v != null && sys.ObjUtil.compareNE(v, this.#val));
  }

  eachVal(f) {
    sys.Func.call(f, this.#val, this.path());
    return;
  }

  pattern() {
    return sys.Str.plus(sys.Str.plus("", this.path()), " != ?");
  }

  type() {
    return FilterType.ne();
  }

  argB() {
    return this.#val;
  }

}

class FilterCmp extends SimpleFilter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterCmp.type$; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  #valType = null;

  valType() { return this.#valType; }

  __valType(it) { if (it === undefined) return this.#valType; else this.#valType = it; }

  #isNumber = false;

  isNumber() { return this.#isNumber; }

  __isNumber(it) { if (it === undefined) return this.#isNumber; else this.#isNumber = it; }

  static make(p, v) {
    const $self = new FilterCmp();
    FilterCmp.make$($self, p, v);
    return $self;
  }

  static make$($self, p, v) {
    SimpleFilter.make$($self, p);
    $self.#val = ((this$) => { let $_u89 = v; if ($_u89 == null) return null; return sys.ObjUtil.toImmutable(v); })($self);
    $self.#valType = sys.ObjUtil.typeof(v);
    $self.#isNumber = $self.#valType === Number.type$;
    $self.#toStr = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", p), " "), $self.op()), " "), Kind.fromVal(v).valToStr(v));
    return;
  }

  doMatchesVal(v) {
    if ((v == null || sys.ObjUtil.typeof(v) !== this.#valType)) {
      return false;
    }
    ;
    if (this.#isNumber) {
      return this.cmpNumber(sys.ObjUtil.coerce(v, Number.type$), sys.ObjUtil.coerce(this.#val, Number.type$));
    }
    ;
    return this.cmp(sys.ObjUtil.coerce(v, sys.Obj.type$), this.#val);
  }

  eachVal(f) {
    sys.Func.call(f, this.#val, this.path());
    return;
  }

  pattern() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.path()), " "), this.op()), " ?");
  }

  cmpNumber(a, b) {
    if (a.unit() !== b.unit()) {
      return false;
    }
    ;
    return this.cmp(sys.ObjUtil.coerce(a.toFloat(), sys.Obj.type$), sys.ObjUtil.coerce(b.toFloat(), sys.Obj.type$));
  }

  argB() {
    return this.#val;
  }

}

class FilterLt extends FilterCmp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterLt.type$; }

  static make(p, v) {
    const $self = new FilterLt();
    FilterLt.make$($self, p, v);
    return $self;
  }

  static make$($self, p, v) {
    FilterCmp.make$($self, p, v);
    return;
  }

  op() {
    return "<";
  }

  cmp(x, val) {
    return sys.ObjUtil.compareLT(x, val);
  }

  type() {
    return FilterType.lt();
  }

}

class FilterLe extends FilterCmp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterLe.type$; }

  static make(p, v) {
    const $self = new FilterLe();
    FilterLe.make$($self, p, v);
    return $self;
  }

  static make$($self, p, v) {
    FilterCmp.make$($self, p, v);
    return;
  }

  op() {
    return "<=";
  }

  cmp(x, val) {
    return sys.ObjUtil.compareLE(x, val);
  }

  type() {
    return FilterType.le();
  }

}

class FilterGt extends FilterCmp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterGt.type$; }

  static make(p, v) {
    const $self = new FilterGt();
    FilterGt.make$($self, p, v);
    return $self;
  }

  static make$($self, p, v) {
    FilterCmp.make$($self, p, v);
    return;
  }

  op() {
    return ">";
  }

  cmp(x, val) {
    return sys.ObjUtil.compareGT(x, val);
  }

  type() {
    return FilterType.gt();
  }

}

class FilterGe extends FilterCmp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterGe.type$; }

  static make(p, v) {
    const $self = new FilterGe();
    FilterGe.make$($self, p, v);
    return $self;
  }

  static make$($self, p, v) {
    FilterCmp.make$($self, p, v);
    return;
  }

  op() {
    return ">=";
  }

  cmp(x, val) {
    return sys.ObjUtil.compareGE(x, val);
  }

  type() {
    return FilterType.ge();
  }

}

class FilterAnd extends Filter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterAnd.type$; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  #a = null;

  // private field reflection only
  __a(it) { if (it === undefined) return this.#a; else this.#a = it; }

  #b = null;

  // private field reflection only
  __b(it) { if (it === undefined) return this.#b; else this.#b = it; }

  static make(a, b) {
    const $self = new FilterAnd();
    FilterAnd.make$($self, a, b);
    return $self;
  }

  static make$($self, a, b) {
    Filter.make$($self);
    $self.#a = a;
    $self.#b = b;
    $self.#toStr = sys.Str.plus(sys.Str.plus(((this$) => { if ((a.isCompound() && a.type() !== FilterType.and())) return sys.Str.plus(sys.Str.plus("(", a), ")"); return a.toStr(); })($self), " and "), ((this$) => { if ((b.isCompound() && b.type() !== FilterType.and())) return sys.Str.plus(sys.Str.plus("(", b), ")"); return b.toStr(); })($self));
    return;
  }

  doMatches(r, cx) {
    return (this.#a.doMatches(r, cx) && this.#b.doMatches(r, cx));
  }

  eachVal(f) {
    this.#a.eachVal(f);
    this.#b.eachVal(f);
    return;
  }

  eachTag(f) {
    this.#a.eachTag(f);
    this.#b.eachTag(f);
    return;
  }

  pattern() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("(", this.#a.pattern()), ") and ("), this.#b.pattern()), ")");
  }

  type() {
    return FilterType.and();
  }

  argA() {
    return this.#a;
  }

  argB() {
    return this.#b;
  }

  isCompound() {
    return true;
  }

}

class FilterOr extends Filter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterOr.type$; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  #a = null;

  // private field reflection only
  __a(it) { if (it === undefined) return this.#a; else this.#a = it; }

  #b = null;

  // private field reflection only
  __b(it) { if (it === undefined) return this.#b; else this.#b = it; }

  static make(a, b) {
    const $self = new FilterOr();
    FilterOr.make$($self, a, b);
    return $self;
  }

  static make$($self, a, b) {
    Filter.make$($self);
    $self.#a = a;
    $self.#b = b;
    $self.#toStr = sys.Str.plus(sys.Str.plus(((this$) => { if ((a.isCompound() && a.type() !== FilterType.or())) return sys.Str.plus(sys.Str.plus("(", a), ")"); return a.toStr(); })($self), " or "), ((this$) => { if ((b.isCompound() && b.type() !== FilterType.or())) return sys.Str.plus(sys.Str.plus("(", b), ")"); return b.toStr(); })($self));
    return;
  }

  doMatches(r, cx) {
    return (this.#a.doMatches(r, cx) || this.#b.doMatches(r, cx));
  }

  pattern() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("(", this.#a.pattern()), ") or ("), this.#b.pattern()), ")");
  }

  eachVal(f) {
    this.#a.eachVal(f);
    this.#b.eachVal(f);
    return;
  }

  eachTag(f) {
    this.#a.eachTag(f);
    this.#b.eachTag(f);
    return;
  }

  type() {
    return FilterType.or();
  }

  argA() {
    return this.#a;
  }

  argB() {
    return this.#b;
  }

  isCompound() {
    return true;
  }

}

class FilterIsSymbol extends Filter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterIsSymbol.type$; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  #symbol = null;

  // private field reflection only
  __symbol(it) { if (it === undefined) return this.#symbol; else this.#symbol = it; }

  static make(symbol) {
    const $self = new FilterIsSymbol();
    FilterIsSymbol.make$($self, symbol);
    return $self;
  }

  static make$($self, symbol) {
    Filter.make$($self);
    $self.#symbol = symbol;
    $self.#toStr = symbol.toCode();
    return;
  }

  doMatches(r, cx) {
    return cx.inference().isA(r, this.#symbol);
  }

  pattern() {
    return this.#symbol.toCode();
  }

  eachVal(f) {
    return;
  }

  eachTag(f) {
    return;
  }

  type() {
    return FilterType.isSymbol();
  }

  argA() {
    return this.#symbol;
  }

}

class FilterIsSpec extends Filter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterIsSpec.type$; }

  #spec = null;

  // private field reflection only
  __spec(it) { if (it === undefined) return this.#spec; else this.#spec = it; }

  static make(spec) {
    const $self = new FilterIsSpec();
    FilterIsSpec.make$($self, spec);
    return $self;
  }

  static make$($self, spec) {
    Filter.make$($self);
    $self.#spec = spec;
    return;
  }

  doMatches(r, cx) {
    return cx.xetoIsSpec(this.#spec, r);
  }

  pattern() {
    return this.#spec;
  }

  eachVal(f) {
    return;
  }

  eachTag(f) {
    return;
  }

  type() {
    return FilterType.isSpec();
  }

  argA() {
    return this.#spec;
  }

  toStr() {
    return this.#spec;
  }

}

class FilterPath extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterPath.type$; }

  static fromObj(obj) {
    return sys.ObjUtil.coerce(((this$) => { let $_u94 = sys.ObjUtil.as(obj, FilterPath.type$); if ($_u94 != null) return $_u94; return FilterPath.fromStr(sys.ObjUtil.coerce(obj, sys.Str.type$), true); })(this), FilterPath.type$);
  }

  static fromStr(path, checked) {
    if (checked === undefined) checked = true;
    try {
      let dash = sys.Str.index(path, "-", 0);
      if (dash == null) {
        return FilterPath1.make(path);
      }
      ;
      let s = 0;
      let acc = sys.List.make(sys.Str.type$);
      while (true) {
        let n = sys.Str.getRange(path, sys.Range.make(s, sys.ObjUtil.coerce(dash, sys.Int.type$), true));
        if (sys.Str.isEmpty(n)) {
          throw sys.Err.make();
        }
        ;
        acc.add(n);
        if (sys.ObjUtil.compareNE(sys.Str.get(path, sys.Int.plus(sys.ObjUtil.coerce(dash, sys.Int.type$), 1)), 62)) {
          throw sys.Err.make();
        }
        ;
        (s = sys.Int.plus(sys.ObjUtil.coerce(dash, sys.Int.type$), 2));
        (dash = sys.Str.index(path, "-", s));
        if (dash == null) {
          (n = sys.Str.getRange(path, sys.Range.make(s, -1)));
          if (sys.Str.isEmpty(n)) {
            throw sys.Err.make();
          }
          ;
          acc.add(n);
          break;
        }
        ;
      }
      ;
      return FilterPathN.make(acc);
    }
    catch ($_u95) {
      $_u95 = sys.Err.make($_u95);
      if ($_u95 instanceof sys.Err) {
        let e = $_u95;
        ;
        if (checked) {
          throw sys.ParseErr.make(sys.Str.plus("Path: ", path));
        }
        ;
        return null;
      }
      else {
        throw $_u95;
      }
    }
    ;
  }

  static makeName(name) {
    return FilterPath1.make(name);
  }

  static makeNames(names) {
    return ((this$) => { if (sys.ObjUtil.equals(names.size(), 1)) return FilterPath1.make(sys.ObjUtil.coerce(names.first(), sys.Str.type$)); return FilterPathN.make(names); })(this);
  }

  hash() {
    return sys.Str.hash(this.toStr());
  }

  equals(that) {
    return (sys.ObjUtil.is(that, FilterPath.type$) && sys.ObjUtil.equals(this.toStr(), sys.ObjUtil.toStr(that)));
  }

  static make() {
    const $self = new FilterPath();
    FilterPath.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class FilterPath1 extends FilterPath {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterPath1.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  static make(n) {
    const $self = new FilterPath1();
    FilterPath1.make$($self, n);
    return $self;
  }

  static make$($self, n) {
    FilterPath.make$($self);
    $self.#name = n;
    return;
  }

  size() {
    return 1;
  }

  get(i) {
    if (sys.ObjUtil.equals(i, 0)) {
      return this.#name;
    }
    ;
    throw sys.IndexErr.make(sys.Int.toStr(i));
  }

  toStr() {
    return this.#name;
  }

  contains(n) {
    return sys.ObjUtil.equals(this.#name, n);
  }

}

class FilterPathN extends FilterPath {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterPathN.type$; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  #names = null;

  names() { return this.#names; }

  __names(it) { if (it === undefined) return this.#names; else this.#names = it; }

  static make(n) {
    const $self = new FilterPathN();
    FilterPathN.make$($self, n);
    return $self;
  }

  static make$($self, n) {
    FilterPath.make$($self);
    $self.#names = sys.ObjUtil.coerce(((this$) => { let $_u97 = n; if ($_u97 == null) return null; return sys.ObjUtil.toImmutable(n); })($self), sys.Type.find("sys::Str[]"));
    $self.#toStr = n.join("->");
    return;
  }

  size() {
    return this.#names.size();
  }

  get(i) {
    return this.#names.get(i);
  }

  contains(n) {
    return this.#names.contains(n);
  }

}

class FilterInference {
  constructor() {
    const this$ = this;
  }

  typeof() { return FilterInference.type$; }

  static #nilRef = undefined;

  static nilRef() {
    if (FilterInference.#nilRef === undefined) {
      FilterInference.static$init();
      if (FilterInference.#nilRef === undefined) FilterInference.#nilRef = null;
    }
    return FilterInference.#nilRef;
  }

  static nil() {
    return FilterInference.nilRef();
  }

  static static$init() {
    FilterInference.#nilRef = NilFilterInference.make();
    return;
  }

}

class NilFilterInference extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NilFilterInference.type$; }

  isA(rec, symbol) {
    return symbol.hasTerm(rec);
  }

  static make() {
    const $self = new NilFilterInference();
    NilFilterInference.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class FilterParser extends HaystackParser {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterParser.type$; }

  static make(s) {
    const $self = new FilterParser();
    FilterParser.make$($self, s);
    return $self;
  }

  static make$($self, s) {
    HaystackParser.make$($self, s);
    return;
  }

  parse() {
    let f = this.condOr();
    this.verify(HaystackToken.eof());
    return f;
  }

  condOr() {
    let lhs = this.condAnd();
    if (!this.isKeyword("or")) {
      return lhs;
    }
    ;
    this.consume();
    return lhs.or(this.condOr());
  }

  condAnd() {
    let lhs = this.term();
    if (!this.isKeyword("and")) {
      return lhs;
    }
    ;
    this.consume();
    return lhs.and(this.condAnd());
  }

  term() {
    if (this.cur() === HaystackToken.lparen()) {
      this.consume();
      let f = this.condOr();
      this.consume(HaystackToken.rparen());
      return f;
    }
    ;
    if ((this.isKeyword("not") && this.peek() === HaystackToken.id())) {
      this.consume();
      return FilterMissing.make(this.path());
    }
    ;
    if (this.cur() === HaystackToken.symbol()) {
      let val = this.curVal();
      this.consume();
      return FilterIsSymbol.make(sys.ObjUtil.coerce(val, Symbol.type$));
    }
    ;
    if (this.cur() === HaystackToken.id()) {
      if (sys.Int.isUpper(sys.Str.get(sys.ObjUtil.toStr(this.curVal()), 0))) {
        return FilterIsSpec.make(this.consumeId());
      }
      ;
      if (this.peek() === HaystackToken.colon2()) {
        return FilterIsSpec.make(this.specQName());
      }
      ;
      if (this.peek() === HaystackToken.dot()) {
        return FilterIsSpec.make(this.specQName());
      }
      ;
    }
    ;
    let p = this.path();
    let $_u98 = this.cur();
    if (sys.ObjUtil.equals($_u98, HaystackToken.eq())) {
      this.consume();
      return FilterEq.make(p, sys.ObjUtil.coerce(this.val(), sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u98, HaystackToken.notEq())) {
      this.consume();
      return FilterNe.make(p, sys.ObjUtil.coerce(this.val(), sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u98, HaystackToken.lt())) {
      this.consume();
      return FilterLt.make(p, sys.ObjUtil.coerce(this.val(), sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u98, HaystackToken.ltEq())) {
      this.consume();
      return FilterLe.make(p, sys.ObjUtil.coerce(this.val(), sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u98, HaystackToken.gt())) {
      this.consume();
      return FilterGt.make(p, sys.ObjUtil.coerce(this.val(), sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u98, HaystackToken.gtEq())) {
      this.consume();
      return FilterGe.make(p, sys.ObjUtil.coerce(this.val(), sys.Obj.type$));
    }
    ;
    return FilterHas.make(p);
  }

  path() {
    let id = this.pathName();
    if (this.cur() !== HaystackToken.arrow()) {
      return FilterPath1.make(id);
    }
    ;
    let segments = sys.List.make(sys.Str.type$, [id]);
    while (this.cur() === HaystackToken.arrow()) {
      this.consume();
      segments.add(this.pathName());
    }
    ;
    return FilterPathN.make(segments);
  }

  pathName() {
    if (this.cur() !== HaystackToken.id()) {
      throw this.err(sys.Str.plus("Expecting tag name, not ", this.curToStr()));
    }
    ;
    let id = this.curVal();
    this.consume();
    return sys.ObjUtil.coerce(id, sys.Str.type$);
  }

  val() {
    if (this.cur().literal()) {
      let val = this.curVal();
      this.consume();
      return val;
    }
    ;
    if (this.cur() === HaystackToken.id()) {
      if (sys.ObjUtil.equals(this.curVal(), "true")) {
        this.consume();
        return sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable());
      }
      ;
      if (sys.ObjUtil.equals(this.curVal(), "false")) {
        this.consume();
        return sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable());
      }
      ;
    }
    ;
    throw this.err(sys.Str.plus("Expecting value literal, not ", this.curToStr()));
  }

  specQName() {
    let s = sys.StrBuf.make();
    s.add(this.consumeId());
    while (this.cur() === HaystackToken.dot()) {
      this.consume();
      s.addChar(46).add(this.consumeId());
    }
    ;
    if (this.cur() !== HaystackToken.colon2()) {
      throw this.err(sys.Str.plus("Expecting spec qname ::, not ", this.curToStr()));
    }
    ;
    this.consume();
    if ((this.cur() !== HaystackToken.id() || !sys.Int.isUpper(sys.Str.get(sys.ObjUtil.toStr(this.curVal()), 0)))) {
      throw this.err(sys.Str.plus("Expecting spec capitalized name, not ", this.curToStr()));
    }
    ;
    s.add("::").add(this.consumeId());
    return s.toStr();
  }

  consumeId() {
    if (this.cur() !== HaystackToken.id()) {
      throw this.err(sys.Str.plus("Expecting identifier, not ", this.curToStr()));
    }
    ;
    let id = this.curVal();
    this.consume();
    return sys.ObjUtil.coerce(id, sys.Str.type$);
  }

}

class SearchFilter extends Filter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SearchFilter.type$; }

  #pattern = null;

  pattern() { return this.#pattern; }

  __pattern(it) { if (it === undefined) return this.#pattern; else this.#pattern = it; }

  static make(pattern) {
    const $self = new SearchFilter();
    SearchFilter.make$($self, pattern);
    return $self;
  }

  static make$($self, pattern) {
    Filter.make$($self);
    $self.#pattern = pattern;
    return;
  }

  doMatches(r, cx) {
    if (this.includeVal(sys.ObjUtil.coerce(r.dis(), sys.Str.type$))) {
      return true;
    }
    ;
    let id = sys.ObjUtil.as(r.get("id"), Ref.type$);
    if ((id != null && sys.ObjUtil.compareGE(sys.Str.size(this.#pattern), 8) && this.includeVal(id.id()))) {
      return true;
    }
    ;
    if (this.checkTag(r, "name")) {
      return true;
    }
    ;
    if (this.checkTag(r, "def")) {
      return true;
    }
    ;
    if (this.checkTag(r, "view")) {
      return true;
    }
    ;
    if (this.checkTag(r, "app")) {
      return true;
    }
    ;
    return false;
  }

  checkTag(r, name) {
    let val = r.get(name);
    return (val != null && this.includeVal(sys.ObjUtil.toStr(val)));
  }

  includeVal(dis) {
    return false;
  }

  eachTag(f) {
    return;
  }

  eachVal(f) {
    return;
  }

  type() {
    return FilterType.search();
  }

  toStr() {
    return this.#pattern;
  }

}

class GlobSearchFilter extends SearchFilter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GlobSearchFilter.type$; }

  #regex = null;

  regex() { return this.#regex; }

  __regex(it) { if (it === undefined) return this.#regex; else this.#regex = it; }

  static make(pattern) {
    const $self = new GlobSearchFilter();
    GlobSearchFilter.make$($self, pattern);
    return $self;
  }

  static make$($self, pattern) {
    SearchFilter.make$($self, pattern);
    $self.#regex = sys.Regex.glob(sys.Str.plus(sys.Str.plus("*", sys.Str.lower(pattern)), "*"));
    return;
  }

  includeVal(s) {
    return this.#regex.matches(sys.Str.lower(s));
  }

}

class RegexSearchFilter extends SearchFilter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RegexSearchFilter.type$; }

  #regex = null;

  regex() { return this.#regex; }

  __regex(it) { if (it === undefined) return this.#regex; else this.#regex = it; }

  static make(pattern) {
    const $self = new RegexSearchFilter();
    RegexSearchFilter.make$($self, pattern);
    return $self;
  }

  static make$($self, pattern) {
    SearchFilter.make$($self, pattern);
    $self.#regex = sys.ObjUtil.coerce(sys.Regex.fromStr(sys.Str.getRange(pattern, sys.Range.make(3, -1))), sys.Regex.type$);
    return;
  }

  includeVal(s) {
    return this.#regex.matches(s);
  }

}

class FilterSearchFilter extends SearchFilter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterSearchFilter.type$; }

  #filter = null;

  filter() { return this.#filter; }

  __filter(it) { if (it === undefined) return this.#filter; else this.#filter = it; }

  static make(pattern) {
    const $self = new FilterSearchFilter();
    FilterSearchFilter.make$($self, pattern);
    return $self;
  }

  static make$($self, pattern) {
    SearchFilter.make$($self, pattern);
    $self.#filter = sys.ObjUtil.coerce(Filter.fromStr(sys.Str.getRange(pattern, sys.Range.make(2, -1))), Filter.type$);
    return;
  }

  doMatches(r, cx) {
    return this.#filter.matches(r, cx);
  }

}

class NumberFormat extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#posPrefix = "";
    this.#posSuffix = "U";
    this.#negPrefix = "-";
    this.#negSuffix = "U";
    return;
  }

  typeof() { return NumberFormat.type$; }

  static #predefined = undefined;

  static predefined() {
    if (NumberFormat.#predefined === undefined) {
      NumberFormat.static$init();
      if (NumberFormat.#predefined === undefined) NumberFormat.#predefined = null;
    }
    return NumberFormat.#predefined;
  }

  static #empty = undefined;

  static empty() {
    if (NumberFormat.#empty === undefined) {
      NumberFormat.static$init();
      if (NumberFormat.#empty === undefined) NumberFormat.#empty = null;
    }
    return NumberFormat.#empty;
  }

  #srcPattern = null;

  // private field reflection only
  __srcPattern(it) { if (it === undefined) return this.#srcPattern; else this.#srcPattern = it; }

  #floatPattern = null;

  // private field reflection only
  __floatPattern(it) { if (it === undefined) return this.#floatPattern; else this.#floatPattern = it; }

  #isBytes = false;

  // private field reflection only
  __isBytes(it) { if (it === undefined) return this.#isBytes; else this.#isBytes = it; }

  #posPrefix = null;

  // private field reflection only
  __posPrefix(it) { if (it === undefined) return this.#posPrefix; else this.#posPrefix = it; }

  #posSuffix = null;

  // private field reflection only
  __posSuffix(it) { if (it === undefined) return this.#posSuffix; else this.#posSuffix = it; }

  #negPrefix = null;

  // private field reflection only
  __negPrefix(it) { if (it === undefined) return this.#negPrefix; else this.#negPrefix = it; }

  #negSuffix = null;

  // private field reflection only
  __negSuffix(it) { if (it === undefined) return this.#negSuffix; else this.#negSuffix = it; }

  static make(s) {
    if (s == null) {
      return NumberFormat.empty();
    }
    ;
    let cached = NumberFormat.predefined().get(sys.ObjUtil.coerce(s, sys.Str.type$));
    if (cached != null) {
      return cached;
    }
    ;
    return NumberFormat.makePattern(sys.ObjUtil.coerce(s, sys.Str.type$));
  }

  static makeEmpty() {
    const $self = new NumberFormat();
    NumberFormat.makeEmpty$($self);
    return $self;
  }

  static makeEmpty$($self) {
    ;
    return;
  }

  static makePattern(srcPattern) {
    const $self = new NumberFormat();
    NumberFormat.makePattern$($self, srcPattern);
    return $self;
  }

  static makePattern$($self, srcPattern) {
    ;
    $self.#srcPattern = srcPattern;
    $self.#floatPattern = NumberFormat.toFloatPattern(srcPattern);
    $self.#isBytes = sys.ObjUtil.equals(srcPattern, "B");
    let semicolon = sys.Str.index(srcPattern, ";");
    if (semicolon == null) {
      $self.#posPrefix = NumberFormat.toPrefix(srcPattern);
      $self.#posSuffix = NumberFormat.toSuffix(srcPattern);
      if ((!sys.Str.contains($self.#posPrefix, "U") && !sys.Str.contains($self.#posSuffix, "U"))) {
        $self.#posSuffix = sys.Str.plus($self.#posSuffix, "U");
      }
      ;
      $self.#negPrefix = sys.Str.plus("-", $self.#posPrefix);
      $self.#negSuffix = $self.#posSuffix;
    }
    else {
      let posPattern = sys.Str.trim(sys.Str.getRange(srcPattern, sys.Range.make(0, sys.ObjUtil.coerce(semicolon, sys.Int.type$), true)));
      let negPattern = sys.Str.trim(sys.Str.getRange(srcPattern, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(semicolon, sys.Int.type$), 1), -1)));
      $self.#posPrefix = NumberFormat.toPrefix(posPattern);
      $self.#posSuffix = NumberFormat.toSuffix(posPattern);
      $self.#negPrefix = NumberFormat.toPrefix(negPattern);
      $self.#negSuffix = NumberFormat.toSuffix(negPattern);
    }
    ;
    return;
  }

  static toFloatPattern(s) {
    let a = 0;
    while ((sys.ObjUtil.compareLT(a, sys.Str.size(s)) && !NumberFormat.isPatternChar(sys.Str.get(s, a)))) {
      ((this$) => { let $_u99 = a; a = sys.Int.increment(a); return $_u99; })(this);
    }
    ;
    let b = a;
    while ((sys.ObjUtil.compareLT(b, sys.Str.size(s)) && NumberFormat.isPatternChar(sys.Str.get(s, b)))) {
      ((this$) => { let $_u100 = b; b = sys.Int.increment(b); return $_u100; })(this);
    }
    ;
    return sys.Str.getRange(s, sys.Range.make(a, b, true));
  }

  static toPrefix(s) {
    let c = 0;
    while ((sys.ObjUtil.compareLT(c, sys.Str.size(s)) && !NumberFormat.isPatternChar(sys.Str.get(s, c)))) {
      ((this$) => { let $_u101 = c; c = sys.Int.increment(c); return $_u101; })(this);
    }
    ;
    return sys.Str.getRange(s, sys.Range.make(0, c, true));
  }

  static toSuffix(s) {
    let c = sys.Int.minus(sys.Str.size(s), 1);
    while ((sys.ObjUtil.compareGE(c, 0) && !NumberFormat.isPatternChar(sys.Str.get(s, c)))) {
      ((this$) => { let $_u102 = c; c = sys.Int.decrement(c); return $_u102; })(this);
    }
    ;
    return sys.Str.getRange(s, sys.Range.make(sys.Int.plus(c, 1), -1));
  }

  static isPatternChar(ch) {
    return (sys.ObjUtil.equals(ch, 35) || sys.ObjUtil.equals(ch, 48) || sys.ObjUtil.equals(ch, 46) || sys.ObjUtil.equals(ch, 44));
  }

  format(num) {
    if (num.isSpecial()) {
      return this.formatSpecial(num.toFloat());
    }
    ;
    if ((this.#floatPattern == null && this.isDuration(num))) {
      return this.formatDuration(sys.ObjUtil.coerce(num.toDuration(), sys.Duration.type$));
    }
    ;
    if (this.#isBytes) {
      return sys.Int.toLocale(num.toInt(), "B");
    }
    ;
    let float = num.toFloat();
    let neg = sys.ObjUtil.compareLT(float, sys.Float.make(0.0));
    if (neg) {
      (float = sys.Float.negate(float));
    }
    ;
    let unit = num.unit();
    let pattern = this.#floatPattern;
    if ((unit != null && pattern == null)) {
      (pattern = sys.ObjUtil.typeof(this).pod().locale(sys.Str.plus("number.", unit.name()), null));
      if (pattern != null) {
        return NumberFormat.make(pattern).format(num);
      }
      ;
    }
    ;
    let str = ((this$) => { if (num.isInt()) return sys.Int.toLocale(sys.Num.toInt(sys.ObjUtil.coerce(float, sys.Num.type$)), pattern); return sys.Float.toLocale(float, pattern); })(this);
    let buf = sys.StrBuf.make(sys.Int.plus(sys.Str.size(str), 8));
    this.add(buf, ((this$) => { if (neg) return this$.#negPrefix; return this$.#posPrefix; })(this), unit);
    buf.add(str);
    this.add(buf, ((this$) => { if (neg) return this$.#negSuffix; return this$.#posSuffix; })(this), unit);
    return buf.toStr();
  }

  formatSpecial(f) {
    if (sys.Float.isNaN(f)) {
      return sys.Str.plus("", sys.Pod.find("sys").locale("numNaN"));
    }
    ;
    if (sys.ObjUtil.equals(f, sys.Float.posInf())) {
      return sys.Str.plus("", sys.Pod.find("sys").locale("numPosInf"));
    }
    ;
    if (sys.ObjUtil.equals(f, sys.Float.negInf())) {
      return sys.Str.plus("", sys.Pod.find("sys").locale("numNegInf"));
    }
    ;
    return sys.Float.toStr(f);
  }

  isDuration(num) {
    let unit = num.unit();
    if (unit == null) {
      return false;
    }
    ;
    return (unit === Number.hr() || unit === Number.mins() || unit === Number.sec() || unit === Number.ms() || unit === Number.ns());
  }

  formatDuration(dur) {
    let abs = dur.abs();
    let ticks = sys.Num.toFloat(sys.ObjUtil.coerce(dur.ticks(), sys.Num.type$));
    let pattern = "0.##";
    if (sys.ObjUtil.equals(dur, sys.Duration.fromStr("0ns"))) {
      return "0";
    }
    ;
    if (sys.ObjUtil.compareLT(abs, sys.Duration.fromStr("1ms"))) {
      return dur.toLocale();
    }
    ;
    if (sys.ObjUtil.compareLT(abs, sys.Duration.fromStr("1sec"))) {
      return sys.Str.plus(sys.Float.toLocale(sys.Float.div(ticks, sys.Float.make(1000000.0)), pattern), sys.Str.plus("", sys.Pod.find("sys").locale("msAbbr")));
    }
    ;
    if (sys.ObjUtil.compareLT(abs, sys.Duration.fromStr("1min"))) {
      return sys.Str.plus(sys.Float.toLocale(sys.Float.div(ticks, sys.Float.make(1.0E9)), pattern), sys.Str.plus("", sys.Pod.find("sys").locale("secAbbr")));
    }
    ;
    if (sys.ObjUtil.compareLT(abs, sys.Duration.fromStr("1hr"))) {
      return sys.Str.plus(sys.Float.toLocale(sys.Float.div(ticks, sys.Float.make(6.0E10)), pattern), sys.Str.plus("", sys.Pod.find("sys").locale("minAbbr")));
    }
    ;
    if (sys.ObjUtil.compareLT(abs, sys.Duration.fromStr("1day"))) {
      return sys.Str.plus(sys.Float.toLocale(sys.Float.div(ticks, sys.Float.make(3.6E12)), pattern), sys.Str.plus("", sys.Pod.find("sys").locale("hourAbbr")));
    }
    ;
    return sys.Str.plus(sys.Float.toLocale(sys.Float.div(ticks, sys.Float.make(8.64E13)), pattern), sys.Str.plus("", sys.Pod.find("sys").locale("dayAbbr")));
  }

  add(buf, pattern, unit) {
    const this$ = this;
    sys.Str.each(pattern, (ch) => {
      if (sys.ObjUtil.equals(ch, 85)) {
        if (unit != null) {
          let symbol = unit.symbol();
          if (sys.ObjUtil.equals(sys.Str.get(symbol, 0), 95)) {
            (symbol = sys.Str.getRange(symbol, sys.Range.make(1, -1)));
          }
          ;
          buf.add(symbol);
        }
        ;
      }
      else {
        buf.addChar(ch);
      }
      ;
      return;
    });
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("NumberFormat(", this.#srcPattern), ")");
  }

  static static$init() {
    const this$ = this;
    NumberFormat.#empty = NumberFormat.makeEmpty();
    if (true) {
      let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::NumberFormat"));
      sys.List.make(sys.Str.type$, ["U#,###.00", "U#,###.00;(U#)", "#,##0"]).each((p) => {
        acc.set(p, NumberFormat.makePattern(p));
        return;
      });
      NumberFormat.#predefined = sys.ObjUtil.coerce(((this$) => { let $_u106 = acc; if ($_u106 == null) return null; return sys.ObjUtil.toImmutable(acc); })(this), sys.Type.find("[sys::Str:haystack::NumberFormat]"));
    }
    ;
    return;
  }

}

class Col extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Col.type$; }

  dis() {
    return sys.ObjUtil.coerce(this.meta().dis(null, this.name()), sys.Str.type$);
  }

  equals(that) {
    return this === that;
  }

  compare(x) {
    return sys.ObjUtil.compare(this.name(), sys.ObjUtil.coerce(x, Col.type$).name());
  }

  toStr() {
    return this.name();
  }

  static make() {
    const $self = new Col();
    Col.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class Namespace {
  constructor() {
    const this$ = this;
  }

  typeof() { return Namespace.type$; }

}

class Remove extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Remove.type$; }

  static #val = undefined;

  static val() {
    if (Remove.#val === undefined) {
      Remove.static$init();
      if (Remove.#val === undefined) Remove.#val = null;
    }
    return Remove.#val;
  }

  static make() {
    const $self = new Remove();
    Remove.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  toStr() {
    return "remove";
  }

  static static$init() {
    Remove.#val = Remove.make();
    return;
  }

}

class HisItem extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HisItem.type$; }

  toStr() { return Dict.prototype.toStr.apply(this, arguments); }

  dis() { return Dict.prototype.dis.apply(this, arguments); }

  id() { return Dict.prototype.id.apply(this, arguments); }

  _id() { return Dict.prototype._id.apply(this, arguments); }

  #ts = null;

  ts() { return this.#ts; }

  __ts(it) { if (it === undefined) return this.#ts; else this.#ts = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static #magic = undefined;

  static magic() {
    if (HisItem.#magic === undefined) {
      HisItem.static$init();
      if (HisItem.#magic === undefined) HisItem.#magic = 0;
    }
    return HisItem.#magic;
  }

  static #version = undefined;

  static version() {
    if (HisItem.#version === undefined) {
      HisItem.static$init();
      if (HisItem.#version === undefined) HisItem.#version = 0;
    }
    return HisItem.#version;
  }

  static #ctrlTs8 = undefined;

  static ctrlTs8() {
    if (HisItem.#ctrlTs8 === undefined) {
      HisItem.static$init();
      if (HisItem.#ctrlTs8 === undefined) HisItem.#ctrlTs8 = 0;
    }
    return HisItem.#ctrlTs8;
  }

  static #ctrlTs4Prev = undefined;

  static ctrlTs4Prev() {
    if (HisItem.#ctrlTs4Prev === undefined) {
      HisItem.static$init();
      if (HisItem.#ctrlTs4Prev === undefined) HisItem.#ctrlTs4Prev = 0;
    }
    return HisItem.#ctrlTs4Prev;
  }

  static #ctrlPrev = undefined;

  static ctrlPrev() {
    if (HisItem.#ctrlPrev === undefined) {
      HisItem.static$init();
      if (HisItem.#ctrlPrev === undefined) HisItem.#ctrlPrev = 0;
    }
    return HisItem.#ctrlPrev;
  }

  static #ctrlFalse = undefined;

  static ctrlFalse() {
    if (HisItem.#ctrlFalse === undefined) {
      HisItem.static$init();
      if (HisItem.#ctrlFalse === undefined) HisItem.#ctrlFalse = 0;
    }
    return HisItem.#ctrlFalse;
  }

  static #ctrlTrue = undefined;

  static ctrlTrue() {
    if (HisItem.#ctrlTrue === undefined) {
      HisItem.static$init();
      if (HisItem.#ctrlTrue === undefined) HisItem.#ctrlTrue = 0;
    }
    return HisItem.#ctrlTrue;
  }

  static #ctrlNA = undefined;

  static ctrlNA() {
    if (HisItem.#ctrlNA === undefined) {
      HisItem.static$init();
      if (HisItem.#ctrlNA === undefined) HisItem.#ctrlNA = 0;
    }
    return HisItem.#ctrlNA;
  }

  static #ctrlF8 = undefined;

  static ctrlF8() {
    if (HisItem.#ctrlF8 === undefined) {
      HisItem.static$init();
      if (HisItem.#ctrlF8 === undefined) HisItem.#ctrlF8 = 0;
    }
    return HisItem.#ctrlF8;
  }

  static #ctrlStr = undefined;

  static ctrlStr() {
    if (HisItem.#ctrlStr === undefined) {
      HisItem.static$init();
      if (HisItem.#ctrlStr === undefined) HisItem.#ctrlStr = 0;
    }
    return HisItem.#ctrlStr;
  }

  static #ctrlStrPrev = undefined;

  static ctrlStrPrev() {
    if (HisItem.#ctrlStrPrev === undefined) {
      HisItem.static$init();
      if (HisItem.#ctrlStrPrev === undefined) HisItem.#ctrlStrPrev = 0;
    }
    return HisItem.#ctrlStrPrev;
  }

  static make(ts, val) {
    const $self = new HisItem();
    HisItem.make$($self, ts, val);
    return $self;
  }

  static make$($self, ts, val) {
    $self.#ts = ts;
    $self.#val = ((this$) => { let $_u107 = val; if ($_u107 == null) return null; return sys.ObjUtil.toImmutable(val); })($self);
    return;
  }

  equals(that) {
    let x = sys.ObjUtil.as(that, HisItem.type$);
    if (x == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#ts, x.#ts) && sys.ObjUtil.equals(this.#val, x.#val));
  }

  hash() {
    return sys.Int.xor(this.#ts.hash(), sys.ObjUtil.coerce(((this$) => { let $_u108 = ((this$) => { let $_u109 = this$.#val; if ($_u109 == null) return null; return sys.ObjUtil.hash(this$.#val); })(this$); if ($_u108 != null) return $_u108; return sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()); })(this), sys.Int.type$));
  }

  compare(that) {
    return sys.ObjUtil.compare(this.#ts, sys.ObjUtil.coerce(that, HisItem.type$).#ts);
  }

  isEmpty() {
    return false;
  }

  get(name, def) {
    if (def === undefined) def = null;
    if (sys.ObjUtil.equals(name, "ts")) {
      return this.#ts;
    }
    ;
    if (sys.ObjUtil.equals(name, "val")) {
      return this.#val;
    }
    ;
    return def;
  }

  has(name) {
    return (sys.ObjUtil.equals(name, "ts") || sys.ObjUtil.equals(name, "val"));
  }

  missing(name) {
    return !this.has(name);
  }

  trap(name, args) {
    if (args === undefined) args = null;
    let v = this.get(name);
    if (v != null) {
      return v;
    }
    ;
    throw UnknownNameErr.make(name);
  }

  each(f) {
    sys.Func.call(f, this.#ts, "ts");
    if (this.#val != null) {
      sys.Func.call(f, sys.ObjUtil.coerce(this.#val, sys.Obj.type$), "val");
    }
    ;
    return;
  }

  eachWhile(f) {
    let r = sys.Func.call(f, this.#ts, "ts");
    if (r != null) {
      return r;
    }
    ;
    if (this.#val != null) {
      return sys.Func.call(f, sys.ObjUtil.coerce(this.#val, sys.Obj.type$), "val");
    }
    ;
    return null;
  }

  map(f) {
    f.__returns = ((arg) => { let r = arg; if (r == null || r == sys.Void.type$ || !(r instanceof sys.Type)) r = null; return r; })(arguments[arguments.length - 1]);
    return HisItem.make(sys.ObjUtil.coerce(sys.Func.call(f, this.#ts, "ts"), sys.DateTime.type$), sys.Func.call(f, sys.ObjUtil.coerce(this.#val, sys.Obj.type$), "val"));
  }

  mapVal(f) {
    return HisItem.make(this.#ts, sys.Func.call(f, this.#val));
  }

  static encode(out, items) {
    const this$ = this;
    let strMap = null;
    let tsPrev = 0;
    let valPrev = null;
    let float = sys.Float.make(0.0);
    let int = 0;
    let str = "";
    out.writeI2(HisItem.magic());
    out.writeI2(HisItem.version());
    out.writeI4(items.size());
    items.each((item) => {
      let ts = sys.Int.div(item.#ts.ticks(), 1000000);
      let diff = sys.Int.minus(ts, tsPrev);
      let ts8 = sys.ObjUtil.compareGT(diff, 2147483647);
      let ctrl = ((this$) => { if (ts8) return HisItem.ctrlTs8(); return HisItem.ctrlTs4Prev(); })(this$);
      let val = item.#val;
      if (sys.ObjUtil.compareNE(val, valPrev)) {
        if (sys.ObjUtil.is(val, Number.type$)) {
          let num = sys.ObjUtil.coerce(val, Number.type$);
          (ctrl = sys.Int.or(ctrl, HisItem.ctrlF8()));
          (float = num.toFloat());
        }
        else {
          if (sys.ObjUtil.is(val, sys.Bool.type$)) {
            let bool = sys.ObjUtil.coerce(val, sys.Bool.type$);
            (ctrl = sys.Int.or(ctrl, ((this$) => { if (bool) return HisItem.ctrlTrue(); return HisItem.ctrlFalse(); })(this$)));
          }
          else {
            if (val === NA.val()) {
              (ctrl = sys.Int.or(ctrl, HisItem.ctrlNA()));
            }
            else {
              (str = sys.ObjUtil.toStr(val));
              if (strMap == null) {
                (strMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")));
              }
              ;
              let prevIndex = strMap.get(str);
              if (prevIndex == null) {
                (ctrl = sys.Int.or(ctrl, HisItem.ctrlStr()));
                strMap.set(str, sys.ObjUtil.coerce(strMap.size(), sys.Obj.type$.toNullable()));
              }
              else {
                (ctrl = sys.Int.or(ctrl, HisItem.ctrlStrPrev()));
                (int = sys.ObjUtil.coerce(prevIndex, sys.Int.type$));
              }
              ;
            }
            ;
          }
          ;
        }
        ;
      }
      ;
      out.write(ctrl);
      if (ts8) {
        out.writeI8(ts);
      }
      else {
        out.writeI4(diff);
      }
      ;
      let $_u112 = sys.Int.and(ctrl, 15);
      if (sys.ObjUtil.equals($_u112, HisItem.ctrlF8())) {
        out.writeF8(float);
      }
      else if (sys.ObjUtil.equals($_u112, HisItem.ctrlStr())) {
        out.writeUtf(str);
      }
      else if (sys.ObjUtil.equals($_u112, HisItem.ctrlStrPrev())) {
        out.writeI4(int);
      }
      ;
      (tsPrev = ts);
      (valPrev = val);
      return;
    });
    return;
  }

  static decode(in$, tz, unit) {
    if (unit === undefined) unit = null;
    if (sys.ObjUtil.compareNE(in$.readU2(), HisItem.magic())) {
      throw sys.IOErr.make("Invalid magic");
    }
    ;
    if (sys.ObjUtil.compareNE(in$.readU2(), HisItem.version())) {
      throw sys.IOErr.make("Invalid version");
    }
    ;
    let size = in$.readU4();
    let acc = sys.List.make(HisItem.type$);
    acc.capacity(size);
    let millis = 0;
    let prev = null;
    let strMap = null;
    for (let i = 0; sys.ObjUtil.compareLT(i, size); i = sys.Int.increment(i)) {
      let ctrl = in$.read();
      let $_u113 = sys.Int.and(sys.ObjUtil.coerce(ctrl, sys.Int.type$), 240);
      if (sys.ObjUtil.equals($_u113, HisItem.ctrlTs8())) {
        (millis = in$.readS8());
      }
      else if (sys.ObjUtil.equals($_u113, HisItem.ctrlTs4Prev())) {
        (millis = sys.Int.plus(millis, in$.readU4()));
      }
      else {
        throw sys.IOErr.make(sys.Str.plus("ts ctrl 0x", sys.Int.toHex(sys.ObjUtil.coerce(ctrl, sys.Int.type$))));
      }
      ;
      let ts = sys.DateTime.makeTicks(sys.Int.mult(millis, 1000000), tz);
      let val = null;
      let $_u114 = sys.Int.and(sys.ObjUtil.coerce(ctrl, sys.Int.type$), 15);
      if (sys.ObjUtil.equals($_u114, HisItem.ctrlPrev())) {
        (val = prev);
      }
      else if (sys.ObjUtil.equals($_u114, HisItem.ctrlFalse())) {
        (val = sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      }
      else if (sys.ObjUtil.equals($_u114, HisItem.ctrlTrue())) {
        (val = sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      }
      else if (sys.ObjUtil.equals($_u114, HisItem.ctrlNA())) {
        (val = NA.val());
      }
      else if (sys.ObjUtil.equals($_u114, HisItem.ctrlF8())) {
        (val = Number.make(in$.readF8(), unit));
      }
      else if (sys.ObjUtil.equals($_u114, HisItem.ctrlStr())) {
        (val = in$.readUtf());
        if (strMap == null) {
          (strMap = sys.List.make(sys.Str.type$));
        }
        ;
        strMap.add(sys.ObjUtil.coerce(val, sys.Str.type$));
      }
      else if (sys.ObjUtil.equals($_u114, HisItem.ctrlStrPrev())) {
        (val = strMap.get(in$.readU4()));
      }
      else {
        throw sys.IOErr.make(sys.Str.plus("val ctrl 0x", sys.Int.toHex(sys.ObjUtil.coerce(ctrl, sys.Int.type$))));
      }
      ;
      acc.add(HisItem.make(ts, val));
      (prev = val);
    }
    ;
    return acc;
  }

  static static$init() {
    HisItem.#magic = 25192;
    HisItem.#version = 1;
    HisItem.#ctrlTs8 = 16;
    HisItem.#ctrlTs4Prev = 32;
    HisItem.#ctrlPrev = 0;
    HisItem.#ctrlFalse = 1;
    HisItem.#ctrlTrue = 2;
    HisItem.#ctrlNA = 3;
    HisItem.#ctrlF8 = 4;
    HisItem.#ctrlStr = 5;
    HisItem.#ctrlStrPrev = 6;
    return;
  }

}

class ZincWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#ver = 3;
    return;
  }

  typeof() { return ZincWriter.type$; }

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

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  static gridToStr(grid) {
    let buf = sys.StrBuf.make();
    ZincWriter.make(buf.out()).writeGrid(grid);
    return buf.toStr();
  }

  static valToStr(val) {
    let buf = sys.StrBuf.make();
    ZincWriter.make(buf.out()).writeVal(val);
    return buf.toStr();
  }

  static tagsToStr(tags) {
    const this$ = this;
    let buf = sys.StrBuf.make();
    let func = (val, name) => {
      if (!buf.isEmpty()) {
        buf.addChar(32);
      }
      ;
      buf.add(name);
      try {
        if (val !== Marker.val()) {
          buf.addChar(58).add(ZincWriter.valToStr(val));
        }
        ;
      }
      catch ($_u115) {
        $_u115 = sys.Err.make($_u115);
        if ($_u115 instanceof sys.Err) {
          let e = $_u115;
          ;
          throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot write tag ", name), "; "), e.msg()));
        }
        else {
          throw $_u115;
        }
      }
      ;
      return;
    };
    if (sys.ObjUtil.is(tags, Dict.type$)) {
      sys.ObjUtil.coerce(tags, Dict.type$).each(func);
    }
    else {
      sys.ObjUtil.coerce(tags, sys.Type.find("sys::Map")).each(sys.ObjUtil.coerce(func, sys.Type.find("|sys::V,sys::K->sys::Void|")));
    }
    ;
    return buf.toStr();
  }

  static make(out) {
    const $self = new ZincWriter();
    ZincWriter.make$($self, out);
    return $self;
  }

  static make$($self, out) {
    ;
    $self.#out = out;
    return;
  }

  writeVal(val) {
    if (val == null) {
      return this.#out.print("N");
    }
    ;
    if (sys.ObjUtil.is(val, Grid.type$)) {
      return this.writeNestedGrid(sys.ObjUtil.coerce(val, Grid.type$));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return this.writeList(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]")));
    }
    ;
    if (sys.ObjUtil.is(val, Dict.type$)) {
      return this.writeDict(sys.ObjUtil.coerce(val, Dict.type$));
    }
    ;
    this.writeScalar(sys.ObjUtil.coerce(val, sys.Obj.type$));
    return;
  }

  writeGrid(grid) {
    const this$ = this;
    this.#out.print("ver:\"").print(sys.ObjUtil.coerce(this.#ver, sys.Obj.type$.toNullable())).print(".0\"");
    this.writeMeta(true, grid.meta());
    this.#out.writeChar(10);
    if (grid.cols().isEmpty()) {
      this.#out.print("noCols\n");
    }
    else {
      grid.cols().each((col, i) => {
        if (sys.ObjUtil.compareGT(i, 0)) {
          this$.#out.writeChar(44);
        }
        ;
        this$.writeCol(col);
        return;
      });
      this.#out.writeChar(10);
    }
    ;
    grid.each((row) => {
      this$.writeRow(row);
      return;
    });
    this.#out.writeChar(10);
    return this;
  }

  writeGrids(grids) {
    const this$ = this;
    grids.each((grid) => {
      this$.writeGrid(grid);
      return;
    });
    return this;
  }

  flush() {
    this.#out.flush();
    return this;
  }

  close() {
    this.#out.close();
    return this;
  }

  writeCol(col) {
    this.#out.print(col.name());
    this.writeMeta(true, col.meta());
    return;
  }

  writeRow(row) {
    const this$ = this;
    row.grid().cols().each((col, i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        this$.#out.writeChar(44);
      }
      ;
      let val = row.val(col);
      try {
        if (val == null) {
          if ((sys.ObjUtil.equals(i, 0) && sys.ObjUtil.equals(row.grid().cols().size(), 1))) {
            this$.#out.writeChar(78);
          }
          ;
        }
        else {
          this$.writeVal(val);
        }
        ;
      }
      catch ($_u116) {
        $_u116 = sys.Err.make($_u116);
        if ($_u116 instanceof sys.Err) {
          let e = $_u116;
          ;
          throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot write col '", col.name()), "' = '"), val), "'; "), e.msg()));
        }
        else {
          throw $_u116;
        }
      }
      ;
      return;
    });
    this.#out.writeChar(10);
    return;
  }

  writeMeta(leadingSpace, m) {
    const this$ = this;
    m.each((v, k) => {
      if (leadingSpace) {
        this$.#out.print(" ");
      }
      else {
        (leadingSpace = true);
      }
      ;
      this$.#out.print(k);
      try {
        if (sys.ObjUtil.compareNE(v, Marker.val())) {
          this$.#out.print(":");
          this$.writeVal(v);
        }
        ;
      }
      catch ($_u117) {
        $_u117 = sys.Err.make($_u117);
        if ($_u117 instanceof sys.Err) {
          let e = $_u117;
          ;
          throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot write meta ", k), ": "), v), e);
        }
        else {
          throw $_u117;
        }
      }
      ;
      return;
    });
    return;
  }

  writeNestedGrid(grid) {
    this.#out.writeChar(60).writeChar(60).writeChar(10);
    this.writeGrid(grid);
    this.#out.writeChar(62).writeChar(62);
    return;
  }

  writeList(list) {
    const this$ = this;
    this.#out.writeChar(91);
    list.each((val, i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        this$.#out.writeChar(44);
      }
      ;
      this$.writeVal(val);
      return;
    });
    this.#out.writeChar(93);
    return;
  }

  writeDict(dict) {
    this.#out.writeChar(123);
    this.writeMeta(false, dict);
    this.#out.writeChar(125);
    return;
  }

  writeScalar(val) {
    let kind = Kind.fromVal(val, false);
    if (kind != null) {
      this.#out.print(kind.valToZinc(val));
    }
    else {
      this.#out.print(XStr.encode(val).toStr());
    }
    ;
    return;
  }

}

class JsonWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JsonWriter.type$; }

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

  #opts = null;

  opts() {
    return this.#opts;
  }

  static valToStr(val) {
    let buf = sys.StrBuf.make();
    JsonWriter.make(buf.out()).writeVal(val);
    return buf.toStr();
  }

  static make(out, opts) {
    const $self = new JsonWriter();
    JsonWriter.make$($self, out, opts);
    return $self;
  }

  static make$($self, out, opts) {
    if (opts === undefined) opts = null;
    $self.#out = util.JsonOutStream.make(out);
    $self.#opts = sys.ObjUtil.coerce(((this$) => { let $_u118 = opts; if ($_u118 != null) return $_u118; return Etc.emptyDict(); })($self), Dict.type$);
    return;
  }

  flush() {
    this.#out.flush();
    return this;
  }

  close() {
    return this.#out.close();
  }

  writeVal(val) {
    if (JsonParser.isV3(this.#opts)) {
      JsonV3Writer.make(this.#out).writeVal(val);
    }
    else {
      HaysonWriter.make(this.#out).writeVal(val);
    }
    ;
    return this;
  }

  writeGrid(grid) {
    return this.writeVal(grid);
  }

}

class HaysonWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HaysonWriter.type$; }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  static #gmt = undefined;

  static gmt() {
    if (HaysonWriter.#gmt === undefined) {
      HaysonWriter.static$init();
      if (HaysonWriter.#gmt === undefined) HaysonWriter.#gmt = null;
    }
    return HaysonWriter.#gmt;
  }

  static make(out) {
    const $self = new HaysonWriter();
    HaysonWriter.make$($self, out);
    return $self;
  }

  static make$($self, out) {
    $self.#out = out;
    return;
  }

  writeVal(val) {
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return this.writeList(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]")));
    }
    ;
    if (sys.ObjUtil.is(val, Dict.type$)) {
      return this.writeDict(sys.ObjUtil.coerce(val, Dict.type$));
    }
    ;
    if (sys.ObjUtil.is(val, Grid.type$)) {
      return sys.ObjUtil.coerce(this.writeGrid(sys.ObjUtil.coerce(val, Grid.type$)), HaysonWriter.type$);
    }
    ;
    this.writeScalar(val);
    return this;
  }

  writeGrid(grid) {
    const this$ = this;
    this.#out.print("{\n");
    this.#out.printLine("\"_kind\": \"grid\",");
    this.#out.print("\"meta\": {\"ver\":\"3.0\"");
    this.writeDictTags(grid.meta(), false);
    this.#out.print("},\n");
    this.#out.printLine("\"cols\": [");
    let firstCol = true;
    grid.cols().each((col, i) => {
      if (firstCol) {
        (firstCol = false);
      }
      else {
        this$.#out.print(",\n");
      }
      ;
      this$.#out.print("{");
      sys.ObjUtil.coerce(this$.#out.print("\"name\":"), util.JsonOutStream.type$).print(sys.Str.toCode(col.name()));
      if (!col.meta().isEmpty()) {
        this$.#out.print(",");
        this$.#out.print("\"meta\":");
        this$.writeDict(col.meta());
      }
      ;
      this$.#out.print("}");
      return;
    });
    this.#out.print("\n],\n");
    this.#out.printLine("\"rows\":[");
    let firstRow = true;
    grid.each((row) => {
      if (firstRow) {
        (firstRow = false);
      }
      else {
        this$.#out.print(",\n");
      }
      ;
      this$.writeDict(row);
      return;
    });
    this.#out.print("\n]\n");
    sys.ObjUtil.coerce(this.#out.print("}\n"), util.JsonOutStream.type$).flush();
    return this;
  }

  writeDict(dict) {
    this.#out.print("{");
    this.writeDictTags(dict, true);
    this.#out.print("}");
    return this;
  }

  writeList(list) {
    const this$ = this;
    this.#out.print("[");
    let first = true;
    list.each((val) => {
      if (first) {
        (first = false);
      }
      else {
        this$.#out.print(", ");
      }
      ;
      this$.writeVal(val);
      return;
    });
    this.#out.print("]");
    return this;
  }

  writeDictTags(dict, first) {
    const this$ = this;
    dict.each((val, name) => {
      if (first) {
        (first = false);
      }
      else {
        this$.#out.print(", ");
      }
      ;
      sys.ObjUtil.coerce(this$.#out.print(sys.Str.toCode(name)), util.JsonOutStream.type$).print(":");
      this$.writeVal(val);
      return;
    });
    return;
  }

  writeScalar(val) {
    if (val == null) {
      this.#out.writeJson(null);
    }
    else {
      if (sys.ObjUtil.is(val, sys.Str.type$)) {
        this.#out.writeJson(val);
      }
      else {
        if (sys.ObjUtil.is(val, sys.Bool.type$)) {
          this.#out.writeJson(val);
        }
        else {
          if (sys.ObjUtil.is(val, sys.Num.type$)) {
            this.#out.writeJson(val);
          }
          else {
            if (sys.ObjUtil.is(val, Number.type$)) {
              this.writeNumber(sys.ObjUtil.coerce(val, Number.type$));
            }
            else {
              if (sys.ObjUtil.is(val, Ref.type$)) {
                this.writeRef(sys.ObjUtil.coerce(val, Ref.type$));
              }
              else {
                if (sys.ObjUtil.is(val, sys.Date.type$)) {
                  this.writeDate(sys.ObjUtil.coerce(val, sys.Date.type$));
                }
                else {
                  if (sys.ObjUtil.is(val, sys.Time.type$)) {
                    this.writeTime(sys.ObjUtil.coerce(val, sys.Time.type$));
                  }
                  else {
                    if (sys.ObjUtil.is(val, sys.DateTime.type$)) {
                      this.writeDateTime(sys.ObjUtil.coerce(val, sys.DateTime.type$));
                    }
                    else {
                      if (sys.ObjUtil.is(val, sys.Uri.type$)) {
                        this.writeUri(sys.ObjUtil.coerce(val, sys.Uri.type$));
                      }
                      else {
                        if (sys.ObjUtil.is(val, Symbol.type$)) {
                          this.writeSymbol(sys.ObjUtil.coerce(val, Symbol.type$));
                        }
                        else {
                          if (sys.ObjUtil.is(val, Coord.type$)) {
                            this.writeCoord(sys.ObjUtil.coerce(val, Coord.type$));
                          }
                          else {
                            if (sys.ObjUtil.is(val, XStr.type$)) {
                              this.writeXStr(sys.ObjUtil.coerce(val, XStr.type$));
                            }
                            else {
                              if (val === Marker.val()) {
                                this.#out.print("{\"_kind\":\"marker\"}");
                              }
                              else {
                                if (val === Remove.val()) {
                                  this.#out.print("{\"_kind\":\"remove\"}");
                                }
                                else {
                                  if (val === NA.val()) {
                                    this.#out.print("{\"_kind\":\"na\"}");
                                  }
                                  else {
                                    if (sys.ObjUtil.is(val, Span.type$)) {
                                      this.writeScalar(XStr.encode(sys.ObjUtil.coerce(val, sys.Obj.type$)));
                                    }
                                    else {
                                      if (sys.ObjUtil.is(val, Bin.type$)) {
                                        this.writeScalar(XStr.encode(sys.ObjUtil.coerce(val, sys.Obj.type$)));
                                      }
                                      else {
                                        throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unrecognized scalar: ", val), " ("), ((this$) => { let $_u119 = val; if ($_u119 == null) return null; return sys.ObjUtil.typeof(val); })(this)), ")"));
                                      }
                                      ;
                                    }
                                    ;
                                  }
                                  ;
                                }
                                ;
                              }
                              ;
                            }
                            ;
                          }
                          ;
                        }
                        ;
                      }
                      ;
                    }
                    ;
                  }
                  ;
                }
                ;
              }
              ;
            }
            ;
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

  writeNumber(val) {
    let num = ((this$) => { if (val.isInt()) return sys.ObjUtil.coerce(val.toInt(), sys.Num.type$); return sys.ObjUtil.coerce(val.toFloat(), sys.Num.type$); })(this);
    let unit = val.unit();
    if (val.isSpecial()) {
      let f = val.toFloat();
      let v = "NaN";
      if (sys.ObjUtil.equals(f, sys.Float.posInf())) {
        (v = "INF");
      }
      else {
        if (sys.ObjUtil.equals(f, sys.Float.negInf())) {
          (v = "-INF");
        }
        ;
      }
      ;
      this.writeKind("number", sys.Map.__fromLiteral(["val"], [v], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    }
    else {
      if (unit == null) {
        this.#out.writeJson(num);
      }
      else {
        this.writeKind("number", sys.Map.__fromLiteral(["val", "unit"], [num, unit.toStr()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
      }
      ;
    }
    ;
    return;
  }

  writeRef(ref) {
    if (ref.disVal() != null) {
      this.writeKind("ref", sys.Map.__fromLiteral(["val", "dis"], [ref.id(), ref.dis()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    }
    else {
      this.writeKind("ref", sys.Map.__fromLiteral(["val"], [ref.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    }
    ;
    return;
  }

  writeDate(date) {
    this.writeKind("date", sys.Map.__fromLiteral(["val"], [date.toStr()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    return;
  }

  writeTime(time) {
    this.writeKind("time", sys.Map.__fromLiteral(["val"], [time.toStr()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    return;
  }

  writeDateTime(ts) {
    let attrs = sys.Map.__fromLiteral(["val"], [ts.toIso()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    if (sys.ObjUtil.compareNE(ts.tz(), HaysonWriter.gmt())) {
      attrs.set("tz", ts.tz().toStr());
    }
    ;
    this.writeKind("dateTime", attrs);
    return;
  }

  writeUri(uri) {
    this.writeKind("uri", sys.Map.__fromLiteral(["val"], [uri.toStr()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    return;
  }

  writeSymbol(s) {
    this.writeKind("symbol", sys.Map.__fromLiteral(["val"], [s.toStr()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    return;
  }

  writeCoord(c) {
    this.writeKind("coord", sys.Map.__fromLiteral(["lat", "lng"], [sys.ObjUtil.coerce(c.lat(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(c.lng(), sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Float")));
    return;
  }

  writeXStr(x) {
    this.writeKind("xstr", sys.Map.__fromLiteral(["type", "val"], [x.type(), x.val()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    return;
  }

  writeKind(kind, attrs) {
    sys.ObjUtil.coerce(this.#out.print("{\"_kind\":"), util.JsonOutStream.type$).writeJson(kind);
    this.writeDictTags(Etc.makeDict(attrs), false);
    this.#out.print("}");
    return;
  }

  static static$init() {
    HaysonWriter.#gmt = sys.ObjUtil.coerce(sys.TimeZone.fromStr("GMT"), sys.TimeZone.type$);
    return;
  }

}

class JsonV3Writer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JsonV3Writer.type$; }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  static make(out) {
    const $self = new JsonV3Writer();
    JsonV3Writer.make$($self, out);
    return $self;
  }

  static make$($self, out) {
    $self.#out = out;
    return;
  }

  writeVal(val) {
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return this.writeList(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]")));
    }
    ;
    if (sys.ObjUtil.is(val, Dict.type$)) {
      return this.writeDict(sys.ObjUtil.coerce(val, Dict.type$));
    }
    ;
    if (sys.ObjUtil.is(val, Grid.type$)) {
      return sys.ObjUtil.coerce(this.writeGrid(sys.ObjUtil.coerce(val, Grid.type$)), JsonV3Writer.type$);
    }
    ;
    this.writeScalar(val);
    return this;
  }

  writeGrid(grid) {
    const this$ = this;
    this.#out.print("{\n");
    this.#out.print("\"meta\": {\"ver\":\"3.0\"");
    this.writeDictTags(grid.meta(), false);
    this.#out.print("},\n");
    sys.ObjUtil.coerce(this.#out.print("\"cols\":["), util.JsonOutStream.type$).print("\n");
    let firstCol = true;
    grid.cols().each((col, i) => {
      if (firstCol) {
        (firstCol = false);
      }
      else {
        this$.#out.print(",\n");
      }
      ;
      sys.ObjUtil.coerce(this$.#out.print("{\"name\":"), util.JsonOutStream.type$).print(sys.Str.toCode(col.name()));
      this$.writeDictTags(col.meta(), false);
      this$.#out.print("}");
      return;
    });
    this.#out.print("\n],\n");
    sys.ObjUtil.coerce(this.#out.print("\"rows\":["), util.JsonOutStream.type$).print("\n");
    let firstRow = true;
    grid.each((row) => {
      if (firstRow) {
        (firstRow = false);
      }
      else {
        this$.#out.print(",\n");
      }
      ;
      this$.writeDict(row);
      return;
    });
    this.#out.print("\n]\n");
    this.#out.print("}\n");
    this.#out.flush();
    return this;
  }

  writeDict(dict) {
    this.#out.print("{");
    this.writeDictTags(dict, true);
    this.#out.print("}");
    return this;
  }

  writeList(list) {
    const this$ = this;
    this.#out.print("[");
    let first = true;
    list.each((val) => {
      if (first) {
        (first = false);
      }
      else {
        this$.#out.print(", ");
      }
      ;
      this$.writeVal(val);
      return;
    });
    this.#out.print("]");
    return this;
  }

  writeDictTags(dict, first) {
    const this$ = this;
    dict.each((val, name) => {
      if (first) {
        (first = false);
      }
      else {
        this$.#out.print(", ");
      }
      ;
      sys.ObjUtil.coerce(this$.#out.print(sys.Str.toCode(name)), util.JsonOutStream.type$).print(":");
      this$.writeVal(val);
      return;
    });
    return;
  }

  writeScalar(val) {
    if (val == null) {
      this.#out.writeJson(null);
    }
    else {
      if (sys.ObjUtil.is(val, sys.Bool.type$)) {
        this.#out.writeJson(val);
      }
      else {
        this.#out.writeJson(Kind.fromVal(val).valToJson(sys.ObjUtil.coerce(val, sys.Obj.type$)));
      }
      ;
    }
    ;
    return;
  }

}

class Def {
  constructor() {
    const this$ = this;
  }

  typeof() { return Def.type$; }

  toStr() { return Dict.prototype.toStr.apply(this, arguments); }

  dis() { return Dict.prototype.dis.apply(this, arguments); }

  id() { return Dict.prototype.id.apply(this, arguments); }

  _id() { return Dict.prototype._id.apply(this, arguments); }

  map() { return Dict.prototype.map.apply(this, arguments); }

}

class Lib {
  constructor() {
    const this$ = this;
  }

  typeof() { return Lib.type$; }

  toStr() { return Dict.prototype.toStr.apply(this, arguments); }

  dis() { return Dict.prototype.dis.apply(this, arguments); }

  id() { return Dict.prototype.id.apply(this, arguments); }

  _id() { return Dict.prototype._id.apply(this, arguments); }

  map() { return Dict.prototype.map.apply(this, arguments); }

}

class UnknownNameErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownNameErr.type$; }

  static make(msg, cause) {
    const $self = new UnknownNameErr();
    UnknownNameErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.ObjUtil.coerce(msg, sys.Str.type$), cause);
    return;
  }

}

class UnknownDefErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownDefErr.type$; }

  static make(msg, cause) {
    const $self = new UnknownDefErr();
    UnknownDefErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class UnknownSpecErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownSpecErr.type$; }

  static make(msg, cause) {
    const $self = new UnknownSpecErr();
    UnknownSpecErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class UnknownFeatureErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownFeatureErr.type$; }

  static make(msg, cause) {
    const $self = new UnknownFeatureErr();
    UnknownFeatureErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class UnknownFiletypeErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownFiletypeErr.type$; }

  static make(msg, cause) {
    const $self = new UnknownFiletypeErr();
    UnknownFiletypeErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class UnknownLibErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownLibErr.type$; }

  static make(msg, cause) {
    const $self = new UnknownLibErr();
    UnknownLibErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class UnknownRecErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownRecErr.type$; }

  static make(msg, cause) {
    const $self = new UnknownRecErr();
    UnknownRecErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.ObjUtil.coerce(msg, sys.Str.type$), cause);
    return;
  }

}

class UnknownKindErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownKindErr.type$; }

  static make(msg, cause) {
    const $self = new UnknownKindErr();
    UnknownKindErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class UnknownTagErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownTagErr.type$; }

  static make(msg, cause) {
    const $self = new UnknownTagErr();
    UnknownTagErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class UnknownFuncErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownFuncErr.type$; }

  static make(msg, cause) {
    const $self = new UnknownFuncErr();
    UnknownFuncErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class UnknownCompErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownCompErr.type$; }

  static make(msg, cause) {
    const $self = new UnknownCompErr();
    UnknownCompErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class UnknownCellErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownCellErr.type$; }

  static make(msg, cause) {
    const $self = new UnknownCellErr();
    UnknownCellErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class NotHaystackErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NotHaystackErr.type$; }

  static make(msg, cause) {
    const $self = new NotHaystackErr();
    NotHaystackErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class UnitErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnitErr.type$; }

  static make(msg, cause) {
    const $self = new UnitErr();
    UnitErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.ObjUtil.coerce(msg, sys.Str.type$), cause);
    return;
  }

}

class DependErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DependErr.type$; }

  static make(msg, cause) {
    const $self = new DependErr();
    DependErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.ObjUtil.coerce(msg, sys.Str.type$), cause);
    return;
  }

}

class CallErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CallErr.type$; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #remoteTrace = null;

  remoteTrace() { return this.#remoteTrace; }

  __remoteTrace(it) { if (it === undefined) return this.#remoteTrace; else this.#remoteTrace = it; }

  static make(errGrid) {
    const $self = new CallErr();
    CallErr.make$($self, errGrid);
    return $self;
  }

  static make$($self, errGrid) {
    sys.Err.make$($self, sys.ObjUtil.coerce(errGrid.meta().dis(), sys.Str.type$));
    $self.#meta = errGrid.meta();
    $self.#remoteTrace = sys.ObjUtil.as(errGrid.meta().get("errTrace"), sys.Str.type$);
    return;
  }

  static makeMeta(meta) {
    const $self = new CallErr();
    CallErr.makeMeta$($self, meta);
    return $self;
  }

  static makeMeta$($self, meta) {
    sys.Err.make$($self, sys.ObjUtil.coerce(meta.dis(), sys.Str.type$));
    $self.#meta = meta;
    $self.#remoteTrace = sys.ObjUtil.as(meta.get("errTrace"), sys.Str.type$);
    return;
  }

}

class DisabledErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DisabledErr.type$; }

  static make(msg, cause) {
    const $self = new DisabledErr();
    DisabledErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.ObjUtil.coerce(msg, sys.Str.type$), cause);
    return;
  }

}

class FaultErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FaultErr.type$; }

  static make(msg, cause) {
    const $self = new FaultErr();
    FaultErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class DownErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DownErr.type$; }

  static make(msg, cause) {
    const $self = new DownErr();
    DownErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class CoerceErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CoerceErr.type$; }

  static make(msg, cause) {
    const $self = new CoerceErr();
    CoerceErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class PermissionErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PermissionErr.type$; }

  static make(msg, cause) {
    const $self = new PermissionErr();
    PermissionErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class ValidateErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ValidateErr.type$; }

  static make(msg, cause) {
    const $self = new ValidateErr();
    ValidateErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class InvalidNameErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InvalidNameErr.type$; }

  static make(msg, cause) {
    const $self = new InvalidNameErr();
    InvalidNameErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (msg === undefined) msg = "";
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class InvalidChangeErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InvalidChangeErr.type$; }

  static make(msg, cause) {
    const $self = new InvalidChangeErr();
    InvalidChangeErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (msg === undefined) msg = "";
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class DuplicateNameErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DuplicateNameErr.type$; }

  static make(msg, cause) {
    const $self = new DuplicateNameErr();
    DuplicateNameErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (msg === undefined) msg = "";
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class AlreadyParentedErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AlreadyParentedErr.type$; }

  static make(msg, cause) {
    const $self = new AlreadyParentedErr();
    AlreadyParentedErr.make$($self, msg, cause);
    return $self;
  }

  static make$($self, msg, cause) {
    if (msg === undefined) msg = "";
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class GridReader {
  constructor() {
    const this$ = this;
  }

  typeof() { return GridReader.type$; }

}

class Row extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Row.type$; }

  toStr() { return Dict.prototype.toStr.apply(this, arguments); }

  id() { return Dict.prototype.id.apply(this, arguments); }

  _id() { return Dict.prototype._id.apply(this, arguments); }

  map() { return Dict.prototype.map.apply(this, arguments); }

  dis(name, def) {
    if (name === undefined) name = null;
    if (def === undefined) def = "";
    if (name == null) {
      return Etc.dictToDis(this, def);
    }
    ;
    let col = this.grid().col(sys.ObjUtil.coerce(name, sys.Str.type$), false);
    if (col == null) {
      return def;
    }
    ;
    let val = this.val(sys.ObjUtil.coerce(col, Col.type$));
    if (val == null) {
      return def;
    }
    ;
    let kind = Kind.fromType(sys.ObjUtil.typeof(val), false);
    if (kind != null) {
      return kind.valToDis(sys.ObjUtil.coerce(val, sys.Obj.type$), col.meta());
    }
    ;
    if (sys.ObjUtil.is(val, Grid.type$)) {
      return "<<Nested Grid>>";
    }
    ;
    return sys.ObjUtil.toStr(val);
  }

  isEmpty() {
    return false;
  }

  get(name, def) {
    if (def === undefined) def = null;
    let col = this.grid().col(name, false);
    if (col == null) {
      return def;
    }
    ;
    return ((this$) => { let $_u121 = this$.val(sys.ObjUtil.coerce(col, Col.type$)); if ($_u121 != null) return $_u121; return def; })(this);
  }

  trap(name, args) {
    if (args === undefined) args = null;
    let v = this.val(sys.ObjUtil.coerce(this.grid().col(name), Col.type$));
    if (v != null) {
      return v;
    }
    ;
    throw UnknownNameErr.make(name);
  }

  has(name) {
    return this.get(name) != null;
  }

  missing(name) {
    return this.get(name) == null;
  }

  each(f) {
    const this$ = this;
    this.grid().cols().each((col) => {
      let val = this$.val(col);
      if (val != null) {
        sys.Func.call(f, sys.ObjUtil.coerce(val, sys.Obj.type$), col.name());
      }
      ;
      return;
    });
    return;
  }

  eachWhile(f) {
    const this$ = this;
    return this.grid().cols().eachWhile((col) => {
      let val = this$.val(col);
      if (val == null) {
        return null;
      }
      ;
      return sys.Func.call(f, sys.ObjUtil.coerce(val, sys.Obj.type$), col.name());
    });
  }

  cells() {
    return null;
  }

  static make() {
    const $self = new Row();
    Row.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class Macro extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#resBuf = sys.StrBuf.make();
    this.#exprBuf = sys.StrBuf.make();
    return;
  }

  typeof() { return Macro.type$; }

  static #norm = undefined;

  static norm() {
    if (Macro.#norm === undefined) {
      Macro.static$init();
      if (Macro.#norm === undefined) Macro.#norm = 0;
    }
    return Macro.#norm;
  }

  static #exprSimple = undefined;

  static exprSimple() {
    if (Macro.#exprSimple === undefined) {
      Macro.static$init();
      if (Macro.#exprSimple === undefined) Macro.#exprSimple = 0;
    }
    return Macro.#exprSimple;
  }

  static #exprBraces = undefined;

  static exprBraces() {
    if (Macro.#exprBraces === undefined) {
      Macro.static$init();
      if (Macro.#exprBraces === undefined) Macro.#exprBraces = 0;
    }
    return Macro.#exprBraces;
  }

  static #exprLocale = undefined;

  static exprLocale() {
    if (Macro.#exprLocale === undefined) {
      Macro.static$init();
      if (Macro.#exprLocale === undefined) Macro.#exprLocale = 0;
    }
    return Macro.#exprLocale;
  }

  static #simpleEndChars = undefined;

  static simpleEndChars() {
    if (Macro.#simpleEndChars === undefined) {
      Macro.static$init();
      if (Macro.#simpleEndChars === undefined) Macro.#simpleEndChars = null;
    }
    return Macro.#simpleEndChars;
  }

  #pattern = null;

  pattern() { return this.#pattern; }

  __pattern(it) { if (it === undefined) return this.#pattern; else this.#pattern = it; }

  #scope = null;

  scope() { return this.#scope; }

  __scope(it) { if (it === undefined) return this.#scope; else this.#scope = it; }

  #mode = 0;

  mode(it) {
    if (it === undefined) {
      return this.#mode;
    }
    else {
      this.#mode = it;
      return;
    }
  }

  #resBuf = null;

  resBuf(it) {
    if (it === undefined) {
      return this.#resBuf;
    }
    else {
      this.#resBuf = it;
      return;
    }
  }

  #exprBuf = null;

  exprBuf(it) {
    if (it === undefined) {
      return this.#exprBuf;
    }
    else {
      this.#exprBuf = it;
      return;
    }
  }

  #varNames = null;

  varNames(it) {
    if (it === undefined) {
      return this.#varNames;
    }
    else {
      this.#varNames = it;
      return;
    }
  }

  static make(pattern, scope) {
    const $self = new Macro();
    Macro.make$($self, pattern, scope);
    return $self;
  }

  static make$($self, pattern, scope) {
    if (scope === undefined) scope = Etc.dict0();
    ;
    $self.#pattern = pattern;
    $self.#scope = scope;
    return;
  }

  vars() {
    this.#varNames = sys.List.make(sys.Str.type$);
    this.apply();
    return this.#varNames.unique();
  }

  apply(resolve) {
    if (resolve === undefined) resolve = null;
    this.#resBuf.clear();
    let size = sys.Str.size(this.#pattern);
    for (let i = 0; sys.ObjUtil.compareLT(i, size); i = sys.Int.increment(i)) {
      let c = sys.Str.get(this.#pattern, i);
      if (sys.ObjUtil.compareNE(this.#mode, Macro.norm())) {
        if (this.isEndOfExpr(c)) {
          this.#resBuf.add(this.eval(this.#exprBuf.toStr(), resolve));
          let doContinue = sys.ObjUtil.compareNE(this.#mode, Macro.exprSimple());
          this.#mode = Macro.norm();
          if (doContinue) {
            continue;
          }
          ;
        }
        else {
          this.#exprBuf.addChar(c);
          continue;
        }
        ;
      }
      ;
      if (sys.ObjUtil.equals(c, 36)) {
        let next = ((this$) => { if (sys.ObjUtil.compareLT(sys.Int.plus(i, 1), size)) return sys.Str.get(this$.#pattern, sys.Int.plus(i, 1)); return 63; })(this);
        if (sys.ObjUtil.equals(next, 123)) {
          this.#mode = Macro.exprBraces();
          i = sys.Int.increment(i);
        }
        else {
          if (sys.ObjUtil.equals(next, 60)) {
            this.#mode = Macro.exprLocale();
            i = sys.Int.increment(i);
          }
          else {
            this.#mode = Macro.exprSimple();
          }
          ;
        }
        ;
        this.#exprBuf.clear();
        continue;
      }
      ;
      this.#resBuf.addChar(c);
    }
    ;
    if (sys.ObjUtil.compareNE(this.#mode, Macro.norm())) {
      let expr = this.#exprBuf.toStr();
      if (sys.ObjUtil.equals(this.#mode, Macro.exprSimple())) {
        this.#resBuf.add(this.eval(expr, resolve));
      }
      else {
        if (sys.ObjUtil.equals(this.#mode, Macro.exprLocale())) {
          this.#resBuf.add("\$<").add(expr);
        }
        else {
          this.#resBuf.add("\${").add(expr);
        }
        ;
      }
      ;
    }
    ;
    return this.#resBuf.toStr();
  }

  eval(expr, resolve) {
    try {
      if (sys.ObjUtil.equals(this.#mode, Macro.exprLocale())) {
        let colons = sys.Str.index(expr, "::");
        return sys.ObjUtil.coerce(((this$) => { let $_u123 = sys.Pod.find(sys.Str.getRange(expr, sys.Range.make(0, sys.ObjUtil.coerce(colons, sys.Int.type$), true))).locale(sys.Str.getRange(expr, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colons, sys.Int.type$), 2), -1)), null); if ($_u123 != null) return $_u123; throw sys.Err.make(); })(this), sys.Str.type$);
      }
      ;
      if ((this.#varNames != null && !sys.Str.isEmpty(expr))) {
        this.#varNames.add(expr);
      }
      ;
      let val = ((this$) => { if (resolve == null) return this$.#scope.get(expr); return sys.Func.call(resolve, expr); })(this);
      if (sys.ObjUtil.is(val, Ref.type$)) {
        return this.refToDis(sys.ObjUtil.coerce(val, Ref.type$));
      }
      ;
      return sys.ObjUtil.toStr(val);
    }
    catch ($_u125) {
      $_u125 = sys.Err.make($_u125);
      if ($_u125 instanceof sys.Err) {
        let e = $_u125;
        ;
        if (sys.ObjUtil.equals(this.#mode, Macro.exprSimple())) {
          return sys.Str.plus("\$", expr);
        }
        ;
        if (sys.ObjUtil.equals(this.#mode, Macro.exprLocale())) {
          return sys.Str.plus(sys.Str.plus("\$<", expr), ">");
        }
        ;
        return sys.Str.plus(sys.Str.plus("\${", expr), "}");
      }
      else {
        throw $_u125;
      }
    }
    ;
  }

  isEndOfExpr(ch) {
    if (sys.ObjUtil.equals(this.#mode, Macro.exprBraces())) {
      return sys.ObjUtil.equals(ch, 125);
    }
    ;
    if (sys.ObjUtil.equals(this.#mode, Macro.exprLocale())) {
      return sys.ObjUtil.equals(ch, 62);
    }
    ;
    return !(sys.ObjUtil.compareLT(ch, Macro.simpleEndChars().size()) && Macro.simpleEndChars().get(ch));
  }

  refToDis(ref) {
    return ref.dis();
  }

  static static$init() {
    Macro.#norm = 0;
    Macro.#exprSimple = 1;
    Macro.#exprBraces = 2;
    Macro.#exprLocale = 3;
    if (true) {
      let map = sys.List.make(sys.Bool.type$);
      map.fill(sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), 128);
      for (let i = 97; sys.ObjUtil.compareLE(i, 122); i = sys.Int.increment(i)) {
        map.set(i, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      }
      ;
      for (let i = 65; sys.ObjUtil.compareLE(i, 90); i = sys.Int.increment(i)) {
        map.set(i, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      }
      ;
      for (let i = 48; sys.ObjUtil.compareLE(i, 57); i = sys.Int.increment(i)) {
        map.set(i, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      }
      ;
      map.set(95, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      Macro.#simpleEndChars = sys.ObjUtil.coerce(((this$) => { let $_u126 = map; if ($_u126 == null) return null; return sys.ObjUtil.toImmutable(map); })(this), sys.Type.find("sys::Bool[]"));
    }
    ;
    return;
  }

}

class Client extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Client.type$; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  static #debugCounter = undefined;

  static debugCounter() {
    if (Client.#debugCounter === undefined) {
      Client.static$init();
      if (Client.#debugCounter === undefined) Client.#debugCounter = null;
    }
    return Client.#debugCounter;
  }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #auth = null;

  auth() {
    return this.#auth;
  }

  static open(uri, username, password, opts) {
    if (opts === undefined) opts = null;
    if ((sys.ObjUtil.compareNE(uri.scheme(), "http") && sys.ObjUtil.compareNE(uri.scheme(), "https"))) {
      throw sys.ArgErr.make(sys.Str.plus("Only http/https: URIs supported: ", uri));
    }
    ;
    (uri = uri.plusSlash());
    let log = ((this$) => { let $_u127 = sys.ObjUtil.as(((this$) => { let $_u128 = opts; if ($_u128 == null) return null; return opts.get("log"); })(this$), sys.Log.type$); if ($_u127 != null) return $_u127; return sys.Log.get("client"); })(this);
    let socketConfig = sys.ObjUtil.as(((this$) => { let $_u129 = opts; if ($_u129 == null) return null; return opts.get("socketConfig"); })(this), inet.SocketConfig.type$);
    if (socketConfig == null) {
      let timeout = ((this$) => { let $_u130 = sys.ObjUtil.as(((this$) => { let $_u131 = opts; if ($_u131 == null) return null; return opts.get("timeout", ((this$) => { let $_u132 = opts; if ($_u132 == null) return null; return opts.get("receiveTimeout"); })(this$)); })(this$), sys.Duration.type$); if ($_u130 != null) return $_u130; return sys.Duration.fromStr("1min"); })(this);
      (socketConfig = inet.SocketConfig.cur().setTimeouts(timeout));
    }
    ;
    let auth = sys.Slot.findMethod("auth::AuthClientContext.open").call(uri.plus(sys.Uri.fromStr("about")), username, password, log, socketConfig);
    return Client.make(uri, sys.ObjUtil.coerce(log, sys.Log.type$), sys.ObjUtil.coerce(auth, HaystackClientAuth.type$));
  }

  static make(uri, log, auth) {
    const $self = new Client();
    Client.make$($self, uri, log, auth);
    return $self;
  }

  static make$($self, uri, log, auth) {
    $self.#uri = uri;
    $self.#log = log;
    $self.#auth = auth;
    return;
  }

  toStr() {
    return this.#uri.toStr();
  }

  close() {
    this.call("close", Etc.emptyGrid());
    return;
  }

  about() {
    return sys.ObjUtil.coerce(this.call("about", Etc.emptyGrid()).first(), Dict.type$);
  }

  readById(id, checked) {
    if (checked === undefined) checked = true;
    let req = Etc.makeListGrid(null, "id", null, sys.List.make(sys.Obj.type$, [id]));
    let res = this.call("read", req);
    if ((!res.isEmpty() && res.first().has("id"))) {
      return res.first();
    }
    ;
    if (checked) {
      throw UnknownRecErr.make(sys.ObjUtil.toStr(id));
    }
    ;
    return null;
  }

  readByIds(ids, checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let req = Etc.makeListGrid(null, "id", null, ids);
    let res = this.call("read", req);
    if (checked) {
      res.each((r, i) => {
        if (r.missing("id")) {
          throw UnknownRecErr.make(sys.ObjUtil.toStr(ids.get(i)));
        }
        ;
        return;
      });
    }
    ;
    return res;
  }

  read(filter, checked) {
    if (checked === undefined) checked = true;
    let req = Etc.makeListsGrid(null, sys.List.make(sys.Str.type$, ["filter", "limit"]), null, sys.List.make(sys.Type.find("sys::Obj[]"), [sys.List.make(sys.Obj.type$, [filter, Number.one()])]));
    let res = this.call("read", req);
    if (!res.isEmpty()) {
      return res.first();
    }
    ;
    if (checked) {
      throw UnknownRecErr.make(filter);
    }
    ;
    return null;
  }

  readAll(filter) {
    let req = Etc.makeListGrid(null, "filter", null, sys.List.make(sys.Str.type$, [filter]));
    return this.call("read", req);
  }

  eval(expr) {
    return this.call("eval", Etc.makeListGrid(null, "expr", null, sys.List.make(sys.Str.type$, [expr])));
  }

  evalAll(req, checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let reqGrid = sys.ObjUtil.as(req, Grid.type$);
    if (reqGrid == null) {
      if (!sys.ObjUtil.is(req, sys.Type.find("sys::List"))) {
        throw sys.ArgErr.make("Expected Grid or Str[]");
      }
      ;
      (reqGrid = Etc.makeListGrid(null, "expr", null, sys.ObjUtil.coerce(req, sys.Type.find("sys::Obj?[]"))));
    }
    ;
    let reqStr = this.gridToStr(sys.ObjUtil.coerce(reqGrid, Grid.type$));
    let resStr = this.doCall("evalAll", reqStr);
    let res = ZincReader.make(sys.Str.in(resStr)).readGrids();
    if (checked) {
      res.each((g) => {
        if (g.isErr()) {
          throw CallErr.make(g);
        }
        ;
        return;
      });
    }
    ;
    return res;
  }

  commit(req) {
    if (req.meta().missing("commit")) {
      throw sys.ArgErr.make("Must specified grid.meta commit tag");
    }
    ;
    return this.call("commit", req);
  }

  call(op, req, checked) {
    if (req === undefined) req = null;
    if (checked === undefined) checked = true;
    if (req == null) {
      (req = Etc.makeEmptyGrid());
    }
    ;
    let reqStr = this.gridToStr(sys.ObjUtil.coerce(req, Grid.type$));
    let resStr = this.doCall(op, reqStr);
    let res = ZincReader.make(sys.Str.in(resStr)).readGrid();
    if ((checked && res.isErr())) {
      throw CallErr.make(res);
    }
    ;
    return res;
  }

  doCall(op, req) {
    let body = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print(req), sys.Buf.type$.toNullable()).flip(), sys.Buf.type$.toNullable());
    let c = this.toWebClient(sys.Str.toUri(op));
    c.reqMethod("POST");
    c.reqHeaders().set("Content-Type", "text/zinc; charset=utf-8");
    c.reqHeaders().set("Content-Length", sys.Int.toStr(body.size()));
    let debugCount = Client.debugReq(this.#log, c, req);
    c.writeReq();
    c.reqOut().writeBuf(sys.ObjUtil.coerce(body, sys.Buf.type$)).close();
    c.readRes();
    if (sys.ObjUtil.equals(c.resCode(), 100)) {
      c.readRes();
    }
    ;
    let resOK = sys.ObjUtil.equals(c.resCode(), 200);
    let res = ((this$) => { if (resOK) return c.resIn().readAllStr(); return null; })(this);
    c.close();
    if (!resOK) {
      throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Bad HTTP response ", sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable())), " "), c.resPhrase()));
    }
    ;
    Client.debugRes(this.#log, debugCount, c, res);
    return sys.ObjUtil.coerce(res, sys.Str.type$);
  }

  toWebClient(path) {
    return this.#auth.prepare(web.WebClient.make(this.#uri.plus(path)));
  }

  static debugReq(log, c, req) {
    const this$ = this;
    if ((log == null || !log.isDebug())) {
      return 0;
    }
    ;
    let count = Client.debugCounter().getAndIncrement();
    let s = sys.StrBuf.make();
    s.add(sys.Str.plus(sys.Str.plus("> [", sys.ObjUtil.coerce(count, sys.Obj.type$.toNullable())), "]\n"));
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", c.reqMethod()), " "), c.reqUri()), "\n"));
    c.reqHeaders().each((v, n) => {
      s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", n), ": "), v), "\n"));
      return;
    });
    if (req != null) {
      s.add(sys.Str.trimEnd(req)).add("\n");
    }
    ;
    log.debug(s.toStr());
    return count;
  }

  static debugRes(log, count, c, res) {
    const this$ = this;
    if ((log == null || !log.isDebug())) {
      return;
    }
    ;
    let s = sys.StrBuf.make();
    s.add(sys.Str.plus(sys.Str.plus("< [", sys.ObjUtil.coerce(count, sys.Obj.type$.toNullable())), "]\n"));
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable())), " "), c.resPhrase()), "\n"));
    c.resHeaders().each((v, n) => {
      s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", n), ": "), v), "\n"));
      return;
    });
    if (res != null) {
      s.add(sys.Str.trimEnd(res)).add("\n");
    }
    ;
    log.debug(s.toStr());
    return;
  }

  gridToStr(grid) {
    let buf = sys.StrBuf.make();
    let out = ZincWriter.make(buf.out());
    out.ver(2);
    sys.ObjUtil.coerce(out.writeGrid(grid), ZincWriter.type$).flush();
    return buf.toStr();
  }

  static main(args) {
    const this$ = this;
    if (sys.ObjUtil.compareLT(args.size(), 3)) {
      sys.ObjUtil.echo("usage: <uri> <user> <pass>");
      return 1;
    }
    ;
    let uri = sys.Str.toUri(args.get(0)).plusSlash();
    let user = args.get(1);
    let pass = args.get(2);
    let isToken = args.any((arg) => {
      return sys.ObjUtil.equals(arg, "-token");
    });
    let log = sys.Log.get("haystackClient");
    if (isToken) {
      try {
        let c = Client.open(uri, user, pass, sys.Map.__fromLiteral(["log"], [log], sys.Type.find("sys::Str"), sys.Type.find("sys::Log")));
        let a = c.about();
        let token = ((this$) => { let $_u134 = c.toWebClient(sys.Uri.fromStr("about")).reqHeaders().get("Authorization"); if ($_u134 != null) return $_u134; return "err"; })(this);
        sys.ObjUtil.echo(token);
        return 0;
      }
      catch ($_u135) {
        $_u135 = sys.Err.make($_u135);
        if ($_u135 instanceof sys.Err) {
          let e = $_u135;
          ;
          sys.ObjUtil.echo(e);
          return 3;
        }
        else {
          throw $_u135;
        }
      }
      ;
    }
    else {
      log.level(sys.LogLevel.debug());
      let c = Client.open(uri, user, pass, sys.Map.__fromLiteral(["log"], [log], sys.Type.find("sys::Str"), sys.Type.find("sys::Log")));
      let a = c.about();
      sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("\nPing successful: ", c.#uri), "\n"));
      a.each((v, k) => {
        sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus("", k), ": "), v));
        return;
      });
      sys.ObjUtil.echo();
      return 0;
    }
    ;
  }

  static static$init() {
    Client.#debugCounter = concurrent.AtomicInt.make();
    return;
  }

}

class HaystackClientAuth {
  constructor() {
    const this$ = this;
  }

  typeof() { return HaystackClientAuth.type$; }

}

class Define {
  constructor() {
    const this$ = this;
  }

  typeof() { return Define.type$; }

}

class Marker extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Marker.type$; }

  static #val = undefined;

  static val() {
    if (Marker.#val === undefined) {
      Marker.static$init();
      if (Marker.#val === undefined) Marker.#val = null;
    }
    return Marker.#val;
  }

  static fromStr(s) {
    return Marker.val();
  }

  static make() {
    const $self = new Marker();
    Marker.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  toStr() {
    return "marker";
  }

  toLocale() {
    return "\u2713";
  }

  static fromBool(b) {
    return ((this$) => { if (b) return Marker.val(); return null; })(this);
  }

  static static$init() {
    Marker.#val = Marker.make();
    return;
  }

}

class ObjRange extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObjRange.type$; }

  #start = null;

  start() { return this.#start; }

  __start(it) { if (it === undefined) return this.#start; else this.#start = it; }

  #end = null;

  end() { return this.#end; }

  __end(it) { if (it === undefined) return this.#end; else this.#end = it; }

  static make(start, end) {
    const $self = new ObjRange();
    ObjRange.make$($self, start, end);
    return $self;
  }

  static make$($self, start, end) {
    $self.#start = ((this$) => { let $_u137 = start; if ($_u137 == null) return null; return sys.ObjUtil.toImmutable(start); })($self);
    $self.#end = ((this$) => { let $_u138 = end; if ($_u138 == null) return null; return sys.ObjUtil.toImmutable(end); })($self);
    return;
  }

  hash() {
    return sys.Str.hash(this.toStr());
  }

  equals(that) {
    let x = sys.ObjUtil.as(that, ObjRange.type$);
    if (x == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#start, x.#start) && sys.ObjUtil.equals(this.#end, x.#end));
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#start), ".."), this.#end);
  }

  contains(val) {
    return (sys.ObjUtil.compareLE(this.#start, val) && sys.ObjUtil.compareLE(val, this.#end));
  }

  static fromIntRange(r) {
    if (!r.inclusive()) {
      throw sys.ArgErr.make(sys.Str.plus("Not inclusive: ", r));
    }
    ;
    return ObjRange.make(Number.makeInt(r.start()), Number.makeInt(r.end()));
  }

  toIntRange() {
    try {
      let s = this.#start;
      let si = ((this$) => { if (sys.ObjUtil.is(s, Number.type$)) return sys.ObjUtil.coerce(s, Number.type$).toInt(); return sys.ObjUtil.coerce(s, sys.Int.type$); })(this);
      let e = this.#end;
      let ei = ((this$) => { if (sys.ObjUtil.is(e, Number.type$)) return sys.ObjUtil.coerce(e, Number.type$).toInt(); return sys.ObjUtil.coerce(e, sys.Int.type$); })(this);
      return sys.Range.makeInclusive(si, ei);
    }
    catch ($_u141) {
      $_u141 = sys.Err.make($_u141);
      if ($_u141 instanceof sys.CastErr) {
        let e = $_u141;
        ;
        throw sys.CastErr.make(sys.Str.plus("Cannot convert to int range: ", this));
      }
      else {
        throw $_u141;
      }
    }
    ;
  }

}

class JsonReader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JsonReader.type$; }

  #in = null;

  // private field reflection only
  __in(it) { if (it === undefined) return this.#in; else this.#in = it; }

  #opts = null;

  opts() {
    return this.#opts;
  }

  static make(in$, opts) {
    const $self = new JsonReader();
    JsonReader.make$($self, in$, opts);
    return $self;
  }

  static make$($self, in$, opts) {
    if (opts === undefined) opts = null;
    $self.#in = util.JsonInStream.make(in$);
    $self.#opts = sys.ObjUtil.coerce(((this$) => { let $_u142 = opts; if ($_u142 != null) return $_u142; return Etc.emptyDict(); })($self), Dict.type$);
    return;
  }

  readVal(close) {
    if (close === undefined) close = true;
    try {
      if (JsonParser.isV3(this.#opts)) {
        return JsonV3Parser.make(this.#opts).parseVal(this.#in.readJson());
      }
      ;
      return HaysonParser.make(this.#opts).parseVal(this.#in.readJson());
    }
    finally {
      if (close) {
        this.#in.close();
      }
      ;
    }
    ;
  }

  readGrid() {
    return sys.ObjUtil.coerce(this.readVal(), Grid.type$);
  }

}

class JsonParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JsonParser.type$; }

  #opts = null;

  opts() {
    return this.#opts;
  }

  static isV3(opts) {
    return opts.has("v3");
  }

  static make(opts) {
    const $self = new JsonParser();
    JsonParser.make$($self, opts);
    return $self;
  }

  static make$($self, opts) {
    $self.#opts = opts;
    return;
  }

  notHaystack() {
    return this.#opts.has("notHaystack");
  }

  safeNames() {
    return this.#opts.has("safeNames");
  }

  safeVals() {
    return this.#opts.has("safeVals");
  }

}

class HaysonParser extends JsonParser {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HaysonParser.type$; }

  static make(opts) {
    const $self = new HaysonParser();
    HaysonParser.make$($self, opts);
    return $self;
  }

  static make$($self, opts) {
    JsonParser.make$($self, opts);
    return;
  }

  parseVal(json) {
    if (json == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.is(json, sys.Str.type$)) {
      return json;
    }
    ;
    if (sys.ObjUtil.is(json, sys.Type.find("sys::Map"))) {
      return this.parseMap(sys.ObjUtil.coerce(json, sys.Type.find("[sys::Str:sys::Obj?]")));
    }
    ;
    if (sys.ObjUtil.is(json, sys.Float.type$)) {
      return Number.make(sys.ObjUtil.coerce(json, sys.Float.type$));
    }
    ;
    if (sys.ObjUtil.is(json, sys.Int.type$)) {
      return Number.makeInt(sys.ObjUtil.coerce(json, sys.Int.type$));
    }
    ;
    if (sys.ObjUtil.is(json, sys.Bool.type$)) {
      return json;
    }
    ;
    if (sys.ObjUtil.is(json, sys.Type.find("sys::List"))) {
      return this.parseList(sys.ObjUtil.coerce(json, sys.Type.find("sys::Obj?[]")));
    }
    ;
    throw sys.Err.make(sys.Str.plus("Unsupported JSON type: ", sys.ObjUtil.typeof(json).name()));
  }

  parseMap(json) {
    let kind = json.remove("_kind");
    if ((kind == null || sys.ObjUtil.equals(kind, "dict"))) {
      return this.parseDict(json);
    }
    ;
    if (sys.ObjUtil.equals(kind, "grid")) {
      return this.parseGrid(json);
    }
    ;
    if (sys.ObjUtil.equals(kind, "number")) {
      return this.parseNumber(json);
    }
    ;
    if (sys.ObjUtil.equals(kind, "marker")) {
      return Marker.val();
    }
    ;
    if (sys.ObjUtil.equals(kind, "ref")) {
      return Ref.make(sys.ObjUtil.coerce(json.get("val"), sys.Str.type$), sys.ObjUtil.coerce(json.get("dis"), sys.Str.type$.toNullable()));
    }
    ;
    if (sys.ObjUtil.equals(kind, "date")) {
      return sys.Date.fromStr(sys.ObjUtil.coerce(json.get("val"), sys.Str.type$));
    }
    ;
    if (sys.ObjUtil.equals(kind, "time")) {
      return sys.Time.fromStr(sys.ObjUtil.coerce(json.get("val"), sys.Str.type$));
    }
    ;
    if (sys.ObjUtil.equals(kind, "dateTime")) {
      return this.parseDateTime(json);
    }
    ;
    if (sys.ObjUtil.equals(kind, "uri")) {
      return sys.Uri.fromStr(sys.ObjUtil.coerce(json.get("val"), sys.Str.type$));
    }
    ;
    if (sys.ObjUtil.equals(kind, "symbol")) {
      return Symbol.fromStr(sys.ObjUtil.coerce(json.get("val"), sys.Str.type$));
    }
    ;
    if (sys.ObjUtil.equals(kind, "coord")) {
      return Coord.make(sys.ObjUtil.coerce(json.get("lat"), sys.Float.type$), sys.ObjUtil.coerce(json.get("lng"), sys.Float.type$));
    }
    ;
    if (sys.ObjUtil.equals(kind, "remove")) {
      return Remove.val();
    }
    ;
    if (sys.ObjUtil.equals(kind, "na")) {
      return NA.val();
    }
    ;
    if (sys.ObjUtil.equals(kind, "xstr")) {
      return XStr.decode(sys.ObjUtil.coerce(json.get("type"), sys.Str.type$), sys.ObjUtil.coerce(json.get("val"), sys.Str.type$));
    }
    ;
    throw sys.ParseErr.make(sys.Str.plus("", json));
  }

  parseGrid(json) {
    let gb = GridBuilder.make();
    this.parseGridMeta(gb, json);
    this.parseGridCols(gb, json);
    this.parseGridRows(gb, json);
    return gb.toGrid();
  }

  parseGridMeta(gb, json) {
    let obj = json.get("meta");
    if (obj == null) {
      throw sys.ParseErr.make("JSON root missing 'meta' field");
    }
    ;
    if (!sys.ObjUtil.is(obj, sys.Type.find("sys::Map"))) {
      throw sys.ParseErr.make(sys.Str.plus("JSON 'meta' must be Object map, not ", sys.ObjUtil.typeof(obj).name()));
    }
    ;
    let map = sys.ObjUtil.coerce(obj, sys.Type.find("[sys::Str:sys::Obj?]"));
    let ver = map.get("ver");
    if ((sys.ObjUtil.compareNE(ver, "2.0") && sys.ObjUtil.compareNE(ver, "3.0"))) {
      throw sys.ParseErr.make(sys.Str.plus("Unsupported JSON 'meta.ver': ", ver));
    }
    ;
    map.remove("ver");
    gb.setMeta(this.parseDict(map));
    return;
  }

  parseGridCols(gb, json) {
    const this$ = this;
    let colsObj = json.get("cols");
    if (colsObj == null) {
      return;
    }
    ;
    if (!sys.ObjUtil.is(colsObj, sys.Type.find("sys::List"))) {
      throw sys.ParseErr.make(sys.Str.plus("JSON 'cols' must be Array, not ", sys.ObjUtil.typeof(colsObj).name()));
    }
    ;
    let colsList = sys.ObjUtil.coerce(colsObj, sys.Type.find("sys::Obj?[]"));
    colsList.each((colObj, i) => {
      if (!sys.ObjUtil.is(colObj, sys.Type.find("sys::Map"))) {
        throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("JSON col ", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), " must be Object map, not "), sys.ObjUtil.typeof(colObj).name()));
      }
      ;
      let colMap = sys.ObjUtil.coerce(colObj, sys.Type.find("[sys::Str:sys::Obj?]"));
      let name = colMap.get("name");
      if (name == null) {
        throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("JSON col ", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), " missing 'name' field: "), colMap));
      }
      ;
      let metaObj = colMap.get("meta");
      if (metaObj == null) {
        return gb.addCol(sys.ObjUtil.coerce(name, sys.Str.type$));
      }
      ;
      if (!sys.ObjUtil.is(metaObj, sys.Type.find("sys::Map"))) {
        throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("JSON col ", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), " meta must be Object map, not "), sys.ObjUtil.typeof(metaObj).name()));
      }
      ;
      let metaMap = sys.ObjUtil.coerce(metaObj, sys.Type.find("[sys::Str:sys::Obj?]"));
      gb.addCol(sys.ObjUtil.coerce(name, sys.Str.type$), this$.parseDict(metaMap));
      return;
    });
    return;
  }

  parseGridRows(gb, json) {
    const this$ = this;
    let rowsObj = json.get("rows");
    if (rowsObj == null) {
      return;
    }
    ;
    if (!sys.ObjUtil.is(rowsObj, sys.Type.find("sys::List"))) {
      throw sys.ParseErr.make(sys.Str.plus("JSON 'rows' must be Array, not ", sys.ObjUtil.typeof(rowsObj).name()));
    }
    ;
    let rowsList = sys.ObjUtil.coerce(rowsObj, sys.Type.find("sys::Obj?[]"));
    rowsList.each((rowObj, i) => {
      if (!sys.ObjUtil.is(rowObj, sys.Type.find("sys::Map"))) {
        throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("JSON row ", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), " must be Object map, not "), sys.ObjUtil.typeof(rowObj).name()));
      }
      ;
      let rowMap = sys.ObjUtil.coerce(rowObj, sys.Type.find("[sys::Str:sys::Obj?]"));
      let cells = sys.List.make(sys.Obj.type$.toNullable());
      cells.size(gb.numCols());
      rowMap.each((v, n) => {
        cells.set(gb.colNameToIndex(n), this$.parseVal(v));
        return;
      });
      gb.addRow(cells);
      return;
    });
    return;
  }

  parseDict(json) {
    const this$ = this;
    if (json.isEmpty()) {
      return Etc.emptyDict();
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    json.each((v, n) => {
      if (v == null) {
        return;
      }
      ;
      if (this$.safeNames()) {
        (n = Etc.toTagName(n));
      }
      ;
      acc.set(n, this$.parseVal(v));
      return;
    });
    return Etc.makeDict(acc);
  }

  parseList(json) {
    const this$ = this;
    return Kind.toInferredList(json.map((x) => {
      return this$.parseVal(x);
    }, sys.Obj.type$.toNullable()));
  }

  parseNumber(json) {
    let val = json.get("val");
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      (val = sys.ObjUtil.coerce(sys.Str.toFloat(sys.ObjUtil.coerce(val, sys.Str.type$)), sys.Obj.type$.toNullable()));
    }
    else {
      (val = sys.ObjUtil.coerce(sys.Num.toFloat(sys.ObjUtil.coerce(val, sys.Num.type$)), sys.Obj.type$.toNullable()));
    }
    ;
    let unit = sys.ObjUtil.as(json.get("unit"), sys.Str.type$);
    if (unit != null) {
      (unit = Number.loadUnit(sys.ObjUtil.coerce(unit, sys.Str.type$)));
    }
    ;
    return Number.make(sys.ObjUtil.coerce(val, sys.Float.type$), sys.ObjUtil.coerce(unit, sys.Unit.type$.toNullable()));
  }

  parseDateTime(json) {
    let tz = HaysonWriter.gmt();
    if (json.containsKey("tz")) {
      (tz = sys.ObjUtil.coerce(sys.TimeZone.fromStr(sys.ObjUtil.coerce(json.get("tz"), sys.Str.type$)), sys.TimeZone.type$));
    }
    ;
    return sys.DateTime.fromIso(sys.ObjUtil.coerce(json.get("val"), sys.Str.type$)).toTimeZone(tz);
  }

}

class JsonV3Parser extends JsonParser {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JsonV3Parser.type$; }

  static make(opts) {
    const $self = new JsonV3Parser();
    JsonV3Parser.make$($self, opts);
    return $self;
  }

  static make$($self, opts) {
    JsonParser.make$($self, opts);
    return;
  }

  parseVal(json) {
    if (json == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.is(json, sys.Str.type$)) {
      return this.parseStr(sys.ObjUtil.coerce(json, sys.Str.type$));
    }
    ;
    if (sys.ObjUtil.is(json, sys.Type.find("sys::Map"))) {
      return this.parseMap(sys.ObjUtil.coerce(json, sys.Type.find("[sys::Str:sys::Obj?]")));
    }
    ;
    if (sys.ObjUtil.is(json, sys.Float.type$)) {
      return Number.make(sys.ObjUtil.coerce(json, sys.Float.type$));
    }
    ;
    if (sys.ObjUtil.is(json, sys.Int.type$)) {
      return Number.makeInt(sys.ObjUtil.coerce(json, sys.Int.type$));
    }
    ;
    if (sys.ObjUtil.is(json, sys.Bool.type$)) {
      return json;
    }
    ;
    if (sys.ObjUtil.is(json, sys.Type.find("sys::List"))) {
      return this.parseList(sys.ObjUtil.coerce(json, sys.Type.find("sys::Obj?[]")));
    }
    ;
    throw sys.Err.make(sys.Str.plus("Unsupported JSON type: ", sys.ObjUtil.typeof(json).name()));
  }

  parseMap(json) {
    if ((json.get("meta") != null && json.get("cols") != null && json.get("rows") != null)) {
      return this.parseGrid(json);
    }
    else {
      return this.parseDict(json);
    }
    ;
  }

  parseGrid(json) {
    let gb = GridBuilder.make();
    this.parseGridMeta(gb, json);
    this.parseGridCols(gb, json);
    this.parseGridRows(gb, json);
    return gb.toGrid();
  }

  parseGridMeta(gb, json) {
    let obj = json.get("meta");
    if (obj == null) {
      throw sys.Err.make("JSON root missing 'meta' field");
    }
    ;
    if (!sys.ObjUtil.is(obj, sys.Type.find("sys::Map"))) {
      throw sys.Err.make(sys.Str.plus("JSON 'meta' must be Object map, not ", sys.ObjUtil.typeof(obj).name()));
    }
    ;
    let map = sys.ObjUtil.coerce(obj, sys.Type.find("[sys::Str:sys::Obj?]"));
    let ver = map.get("ver");
    if ((sys.ObjUtil.compareNE(ver, "2.0") && sys.ObjUtil.compareNE(ver, "3.0"))) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("Unsupported JSON 'meta.ver': ", ver), " != 3.0"));
    }
    ;
    map.remove("ver");
    gb.setMeta(this.parseDict(map));
    return;
  }

  parseGridCols(gb, json) {
    const this$ = this;
    let colsObj = json.get("cols");
    if (colsObj == null) {
      throw sys.Err.make("JSON root missing 'cols' field");
    }
    ;
    if (!sys.ObjUtil.is(colsObj, sys.Type.find("sys::List"))) {
      throw sys.Err.make(sys.Str.plus("JSON 'cols' must be Array, not ", sys.ObjUtil.typeof(colsObj).name()));
    }
    ;
    let colsList = sys.ObjUtil.coerce(colsObj, sys.Type.find("sys::Obj?[]"));
    colsList.each((colObj) => {
      if (!sys.ObjUtil.is(colObj, sys.Type.find("sys::Map"))) {
        throw sys.Err.make(sys.Str.plus("JSON col must be Object map, not ", sys.ObjUtil.typeof(colObj).name()));
      }
      ;
      let colMap = sys.ObjUtil.coerce(colObj, sys.Type.find("[sys::Str:sys::Obj?]"));
      let name = sys.ObjUtil.as(colMap.get("name"), sys.Str.type$);
      if (name == null) {
        throw sys.Err.make("JSON col missing 'name' field");
      }
      ;
      colMap.remove("name");
      let meta = this$.parseDict(colMap);
      gb.addCol(sys.ObjUtil.coerce(name, sys.Str.type$), meta);
      return;
    });
    return;
  }

  parseGridRows(gb, json) {
    const this$ = this;
    let rowsObj = json.get("rows");
    if (rowsObj == null) {
      throw sys.Err.make("JSON root missing 'rows' field");
    }
    ;
    if (!sys.ObjUtil.is(rowsObj, sys.Type.find("sys::List"))) {
      throw sys.Err.make(sys.Str.plus("JSON 'rows' must be Array, not ", sys.ObjUtil.typeof(rowsObj).name()));
    }
    ;
    let rowsList = sys.ObjUtil.coerce(rowsObj, sys.Type.find("sys::Obj?[]"));
    rowsList.each((rowObj) => {
      if (!sys.ObjUtil.is(rowObj, sys.Type.find("sys::Map"))) {
        throw sys.Err.make(sys.Str.plus("JSON row must be Object map, not ", sys.ObjUtil.typeof(rowObj).name()));
      }
      ;
      let rowMap = sys.ObjUtil.coerce(rowObj, sys.Type.find("[sys::Str:sys::Obj?]"));
      let cells = sys.List.make(sys.Obj.type$.toNullable());
      cells.size(gb.numCols());
      rowMap.each((v, n) => {
        cells.set(gb.colNameToIndex(n), this$.parseVal(v));
        return;
      });
      gb.addRow(cells);
      return;
    });
    return;
  }

  parseDict(json) {
    const this$ = this;
    if (json.isEmpty()) {
      return Etc.emptyDict();
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    json.each((v, n) => {
      if (v == null) {
        return;
      }
      ;
      if (this$.safeNames()) {
        (n = Etc.toTagName(n));
      }
      ;
      acc.set(n, this$.parseVal(v));
      return;
    });
    return Etc.makeDict(acc);
  }

  parseList(json) {
    const this$ = this;
    return Kind.toInferredList(json.map((x) => {
      return this$.parseVal(x);
    }, sys.Obj.type$.toNullable()));
  }

  parseStr(s) {
    if ((sys.ObjUtil.compareLT(sys.Str.size(s), 2) || sys.ObjUtil.compareNE(sys.Str.get(s, 1), 58) || this.notHaystack())) {
      return s;
    }
    ;
    try {
      let $_u143 = sys.Str.get(s, 0);
      if (sys.ObjUtil.equals($_u143, 109)) {
        return this.parseSingleton(s, Marker.val());
      }
      else if (sys.ObjUtil.equals($_u143, 45)) {
        return this.parseSingleton(s, Remove.val());
      }
      else if (sys.ObjUtil.equals($_u143, 122)) {
        return this.parseSingleton(s, NA.val());
      }
      else if (sys.ObjUtil.equals($_u143, 110)) {
        return this.parseNumber(s);
      }
      else if (sys.ObjUtil.equals($_u143, 114)) {
        return this.parseRef(s);
      }
      else if (sys.ObjUtil.equals($_u143, 121)) {
        return Symbol.fromStr(sys.Str.getRange(s, sys.Range.make(2, -1)));
      }
      else if (sys.ObjUtil.equals($_u143, 100)) {
        return sys.Date.fromStr(sys.Str.getRange(s, sys.Range.make(2, -1)));
      }
      else if (sys.ObjUtil.equals($_u143, 104)) {
        return this.parseTime(sys.Str.getRange(s, sys.Range.make(2, -1)));
      }
      else if (sys.ObjUtil.equals($_u143, 116)) {
        return JsonV3Parser.parseDateTime(sys.Str.getRange(s, sys.Range.make(2, -1)));
      }
      else if (sys.ObjUtil.equals($_u143, 115)) {
        return sys.Str.getRange(s, sys.Range.make(2, -1));
      }
      else if (sys.ObjUtil.equals($_u143, 117)) {
        return sys.Uri.fromStr(sys.Str.getRange(s, sys.Range.make(2, -1)));
      }
      else if (sys.ObjUtil.equals($_u143, 98)) {
        return Bin.make(sys.Str.getRange(s, sys.Range.make(2, -1)));
      }
      else if (sys.ObjUtil.equals($_u143, 99)) {
        return Coord.fromStr(sys.Str.plus(sys.Str.plus("C(", sys.Str.getRange(s, sys.Range.make(2, -1))), ")"));
      }
      else if (sys.ObjUtil.equals($_u143, 120)) {
        let c = ((this$) => { let $_u144 = sys.Str.index(s, ":", 3); if ($_u144 != null) return $_u144; throw sys.Err.make(sys.Str.plus("Invalid XStr: ", s)); })(this);
        return XStr.decode(sys.Str.getRange(s, sys.Range.make(2, sys.ObjUtil.coerce(c, sys.Int.type$), true)), sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(c, sys.Int.type$), 1), -1)));
      }
      else {
        throw sys.Err.make(sys.Str.plus("Unsupported type code: ", s));
      }
      ;
    }
    catch ($_u145) {
      $_u145 = sys.Err.make($_u145);
      if ($_u145 instanceof sys.Err) {
        let e = $_u145;
        ;
        if (this.safeVals()) {
          return s;
        }
        ;
        throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid Haystack string: ", s), " ["), e), "]"));
      }
      else {
        throw $_u145;
      }
    }
    ;
  }

  parseSingleton(s, val) {
    if (sys.ObjUtil.compareNE(sys.Str.size(s), 2)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid ", sys.ObjUtil.typeof(val).name()), ": "), s));
    }
    ;
    return val;
  }

  parseNumber(s) {
    let space = sys.Str.index(s, " ");
    if (space == null) {
      return Number.make(this.parseFloat(sys.Str.getRange(s, sys.Range.make(2, -1))));
    }
    ;
    return Number.make(this.parseFloat(sys.Str.getRange(s, sys.Range.make(2, sys.ObjUtil.coerce(space, sys.Int.type$), true))), Number.loadUnit(sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(space, sys.Int.type$), 1), -1))));
  }

  parseFloat(s) {
    if (sys.Str.contains(s, "_")) {
      (s = sys.Str.replace(s, "_", ""));
    }
    ;
    if (sys.Str.startsWith(s, "0x")) {
      return sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.fromStr(sys.Str.getRange(s, sys.Range.make(2, -1)), 16), sys.Num.type$));
    }
    ;
    return sys.ObjUtil.coerce(sys.Str.toFloat(s), sys.Float.type$);
  }

  parseTime(s) {
    if (sys.ObjUtil.equals(sys.Str.get(s, 1), 58)) {
      (s = sys.Str.plus("0", s));
    }
    ;
    if (sys.ObjUtil.equals(sys.Str.size(s), 5)) {
      (s = sys.Str.plus(s, ":00"));
    }
    ;
    return sys.ObjUtil.coerce(sys.Time.fromStr(s), sys.Time.type$);
  }

  static parseDateTime(s) {
    if ((sys.Str.endsWith(s, "Z") && sys.Str.index(s, " ") == null)) {
      s = sys.Str.plus(s, " UTC");
    }
    ;
    return sys.ObjUtil.coerce(sys.DateTime.fromStr(s), sys.DateTime.type$);
  }

  parseRef(s) {
    let space = sys.Str.index(s, " ");
    if (space == null) {
      return sys.ObjUtil.coerce(Ref.make(sys.Str.getRange(s, sys.Range.make(2, -1)), null), Ref.type$);
    }
    ;
    return sys.ObjUtil.coerce(Ref.make(sys.Str.getRange(s, sys.Range.make(2, sys.ObjUtil.coerce(space, sys.Int.type$), true)), sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(space, sys.Int.type$), 1), -1))), Ref.type$);
  }

}

class ZincReader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#isTop = true;
    this.#ver = 3;
    return;
  }

  typeof() { return ZincReader.type$; }

  #tokenizer = null;

  // private field reflection only
  __tokenizer(it) { if (it === undefined) return this.#tokenizer; else this.#tokenizer = it; }

  #isTop = false;

  // private field reflection only
  __isTop(it) { if (it === undefined) return this.#isTop; else this.#isTop = it; }

  #ver = 0;

  // private field reflection only
  __ver(it) { if (it === undefined) return this.#ver; else this.#ver = it; }

  #cur = null;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #curVal = null;

  // private field reflection only
  __curVal(it) { if (it === undefined) return this.#curVal; else this.#curVal = it; }

  #curLine = 0;

  // private field reflection only
  __curLine(it) { if (it === undefined) return this.#curLine; else this.#curLine = it; }

  #peek = null;

  // private field reflection only
  __peek(it) { if (it === undefined) return this.#peek; else this.#peek = it; }

  #peekVal = null;

  // private field reflection only
  __peekVal(it) { if (it === undefined) return this.#peekVal; else this.#peekVal = it; }

  #peekLine = 0;

  // private field reflection only
  __peekLine(it) { if (it === undefined) return this.#peekLine; else this.#peekLine = it; }

  static make(in$) {
    const $self = new ZincReader();
    ZincReader.make$($self, in$);
    return $self;
  }

  static make$($self, in$) {
    ;
    $self.#tokenizer = HaystackTokenizer.make(in$);
    $self.#cur = ((this$) => { let $_u146 = HaystackToken.eof(); this$.#peek = $_u146; return $_u146; })($self);
    $self.consume();
    $self.consume();
    return;
  }

  static makeTokenizer(tokenizer) {
    const $self = new ZincReader();
    ZincReader.makeTokenizer$($self, tokenizer);
    return $self;
  }

  static makeTokenizer$($self, tokenizer) {
    ;
    $self.#tokenizer = tokenizer;
    $self.#cur = ((this$) => { let $_u147 = HaystackToken.eof(); this$.#peek = $_u147; return $_u147; })($self);
    $self.consume();
    $self.consume();
    return;
  }

  close() {
    return this.#tokenizer.close();
  }

  readVal(close) {
    if (close === undefined) close = true;
    try {
      let val = null;
      if ((this.#cur === HaystackToken.id() && sys.ObjUtil.equals(this.#curVal, "ver"))) {
        (val = this.parseGrid());
      }
      else {
        (val = this.parseVal());
      }
      ;
      this.verify(HaystackToken.eof());
      return val;
    }
    finally {
      if (close) {
        this.close();
      }
      ;
    }
    ;
  }

  readGrid() {
    return sys.ObjUtil.coerce(this.readVal(true), Grid.type$);
  }

  readGrids() {
    let acc = sys.List.make(Grid.type$);
    while (this.#cur === HaystackToken.id()) {
      acc.add(sys.ObjUtil.coerce(this.parseGrid(), Grid.type$));
    }
    ;
    return acc;
  }

  readTags() {
    return sys.ObjUtil.coerce(this.parseDict(true), Dict.type$);
  }

  parseVal() {
    if (this.#cur === HaystackToken.id()) {
      let id = sys.ObjUtil.coerce(this.#curVal, sys.Str.type$);
      this.consume();
      if (this.#cur === HaystackToken.lparen()) {
        if (this.#peek === HaystackToken.num()) {
          return this.parseCoord(id);
        }
        else {
          return this.parseXStr(id);
        }
        ;
      }
      ;
      let $_u148 = id;
      if (sys.ObjUtil.equals($_u148, "T")) {
        return sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable());
      }
      else if (sys.ObjUtil.equals($_u148, "F")) {
        return sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable());
      }
      else if (sys.ObjUtil.equals($_u148, "N")) {
        return null;
      }
      else if (sys.ObjUtil.equals($_u148, "M")) {
        return Marker.val();
      }
      else if (sys.ObjUtil.equals($_u148, "NA")) {
        return NA.val();
      }
      else if (sys.ObjUtil.equals($_u148, "R")) {
        return Remove.val();
      }
      else if (sys.ObjUtil.equals($_u148, "NaN")) {
        return Number.nan();
      }
      else if (sys.ObjUtil.equals($_u148, "INF")) {
        return Number.posInf();
      }
      ;
      throw this.err(sys.Str.plus("Unexpected identifier ", sys.Str.toCode(id)));
    }
    ;
    if (this.#cur.literal()) {
      return this.parseLiteral();
    }
    ;
    if ((this.#cur === HaystackToken.minus() && sys.ObjUtil.equals(this.#peekVal, "INF"))) {
      this.consume();
      this.consume();
      return Number.negInf();
    }
    ;
    if (this.#cur === HaystackToken.lbracket()) {
      return this.parseList();
    }
    ;
    if (this.#cur === HaystackToken.lbrace()) {
      return this.parseDict(true);
    }
    ;
    if (this.#cur === HaystackToken.lt2()) {
      return this.parseGrid();
    }
    ;
    throw this.err(sys.Str.plus("Unexpected token: ", this.curToStr()));
  }

  parseLiteral() {
    let val = this.#curVal;
    if ((this.#cur === HaystackToken.ref() && this.#peek === HaystackToken.str())) {
      (val = this.#tokenizer.factory().makeRef(sys.ObjUtil.coerce(val, Ref.type$).id(), sys.ObjUtil.coerce(this.#peekVal, sys.Str.type$.toNullable())));
      this.consume();
    }
    ;
    this.consume();
    return val;
  }

  parseCoord(id) {
    if (sys.ObjUtil.compareNE(id, "C")) {
      throw this.err(sys.Str.plus("Expecting 'C' for coord, not ", sys.Str.toCode(id)));
    }
    ;
    this.consume(HaystackToken.lparen());
    let lat = this.consumeNum();
    this.consume(HaystackToken.comma());
    let lng = this.consumeNum();
    this.consume(HaystackToken.rparen());
    return Coord.make(lat.toFloat(), lng.toFloat());
  }

  parseXStr(id) {
    if (!sys.Int.isUpper(sys.Str.get(id, 0))) {
      throw this.err(sys.Str.plus("Invalid XStr type ", sys.Str.toCode(id)));
    }
    ;
    this.consume(HaystackToken.lparen());
    if ((sys.ObjUtil.compareLT(this.#ver, 3) && sys.ObjUtil.equals(id, "Bin"))) {
      return this.parseBinObsolete();
    }
    ;
    let val = this.consumeStr();
    this.consume(HaystackToken.rparen());
    return XStr.decode(id, val);
  }

  parseBinObsolete() {
    let s = sys.StrBuf.make();
    while ((this.#cur !== HaystackToken.rparen() && this.#cur !== HaystackToken.eof())) {
      s.add(((this$) => { let $_u149 = this$.#curVal; if ($_u149 != null) return $_u149; return this$.#cur.dis(); })(this));
      this.consume();
    }
    ;
    this.consume(HaystackToken.rparen());
    return sys.ObjUtil.coerce(Bin.make(s.toStr()), Bin.type$);
  }

  parseList() {
    let acc = sys.List.make(sys.Obj.type$.toNullable());
    this.consume(HaystackToken.lbracket());
    while ((this.#cur !== HaystackToken.rbracket() && this.#cur !== HaystackToken.eof())) {
      let val = this.parseVal();
      acc.add(val);
      if (this.#cur !== HaystackToken.comma()) {
        break;
      }
      ;
      this.consume();
    }
    ;
    this.consume(HaystackToken.rbracket());
    return Kind.toInferredList(acc);
  }

  parseDict(allowComma) {
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    if (allowComma) {
      acc.ordered(true);
    }
    ;
    let braces = this.#cur === HaystackToken.lbrace();
    if (braces) {
      this.consume(HaystackToken.lbrace());
    }
    ;
    while (this.#cur === HaystackToken.id()) {
      let id = sys.ObjUtil.coerce(this.#curVal, sys.Str.type$);
      if ((!sys.Int.isLower(sys.Str.get(id, 0)) && sys.ObjUtil.compareNE(sys.Str.get(id, 0), 95))) {
        throw this.err(sys.Str.plus("Invalid dict tag name: ", sys.Str.toCode(id)));
      }
      ;
      this.consume();
      let val = Marker.val();
      if (this.#cur === HaystackToken.colon()) {
        this.consume();
        (val = this.parseVal());
      }
      ;
      acc.set(id, val);
      if ((allowComma && sys.ObjUtil.equals(this.#cur, HaystackToken.comma()))) {
        this.consume();
      }
      ;
    }
    ;
    if (braces) {
      this.consume(HaystackToken.rbrace());
    }
    ;
    return Etc.makeDict(acc);
  }

  parseGrid() {
    let nested = this.#cur === HaystackToken.lt2();
    if (nested) {
      this.consume(HaystackToken.lt2());
      if (this.#cur === HaystackToken.nl()) {
        this.consume(HaystackToken.nl());
      }
      ;
    }
    ;
    if ((this.#cur !== HaystackToken.id() || sys.ObjUtil.compareNE(this.#curVal, "ver"))) {
      throw this.err(sys.Str.plus("Expecting grid 'ver' identifier, not ", this.curToStr()));
    }
    ;
    this.consume();
    this.consume(HaystackToken.colon());
    this.#ver = this.checkVersion(this.consumeStr());
    let gb = GridBuilder.make();
    if (this.#cur === HaystackToken.id()) {
      gb.setMeta(this.parseDict(false));
    }
    ;
    this.consume(HaystackToken.nl());
    while (this.#cur === HaystackToken.id()) {
      let name = this.consumeTagName();
      let meta = Etc.emptyDict();
      if (this.#cur === HaystackToken.id()) {
        (meta = sys.ObjUtil.coerce(this.parseDict(false), Dict.type$));
      }
      ;
      gb.addCol(name, meta);
      if (this.#cur !== HaystackToken.comma()) {
        break;
      }
      ;
      this.consume(HaystackToken.comma());
    }
    ;
    let numCols = gb.numCols();
    if (sys.ObjUtil.equals(numCols, 0)) {
      throw this.err("No columns defined");
    }
    ;
    this.consume(HaystackToken.nl());
    while (true) {
      if (this.#cur === HaystackToken.nl()) {
        break;
      }
      ;
      if (this.#cur === HaystackToken.eof()) {
        break;
      }
      ;
      if ((nested && this.#cur === HaystackToken.gt2())) {
        break;
      }
      ;
      let cells = sys.List.make(sys.Obj.type$.toNullable());
      cells.capacity(numCols);
      for (let i = 0; sys.ObjUtil.compareLT(i, numCols); i = sys.Int.increment(i)) {
        if ((this.#cur === HaystackToken.comma() || this.#cur === HaystackToken.nl() || sys.ObjUtil.equals(this.#cur, HaystackToken.eof()))) {
          cells.add(null);
        }
        else {
          cells.add(this.parseVal());
        }
        ;
        if (sys.ObjUtil.compareLT(sys.Int.plus(i, 1), numCols)) {
          this.consume(HaystackToken.comma());
        }
        ;
      }
      ;
      gb.addRow(cells);
      if ((nested && this.#cur === HaystackToken.gt2())) {
        break;
      }
      ;
      if (this.#cur === HaystackToken.eof()) {
        break;
      }
      ;
      this.consume(HaystackToken.nl());
    }
    ;
    if (this.#cur === HaystackToken.nl()) {
      this.consume();
    }
    ;
    if (nested) {
      this.consume(HaystackToken.gt2());
    }
    ;
    return gb.toGrid();
  }

  checkVersion(s) {
    if (sys.ObjUtil.equals(s, "3.0")) {
      return 3;
    }
    ;
    if (sys.ObjUtil.equals(s, "2.0")) {
      return 2;
    }
    ;
    throw this.err(sys.Str.plus("Unsupported version ", sys.Str.toCode(s)));
  }

  consumeTagName() {
    this.verify(HaystackToken.id());
    let id = sys.ObjUtil.coerce(this.#curVal, sys.Str.type$);
    if ((!sys.Int.isLower(sys.Str.get(id, 0)) && sys.ObjUtil.compareNE(sys.Str.get(id, 0), 95))) {
      throw this.err(sys.Str.plus("Invalid dict tag name: ", sys.Str.toCode(id)));
    }
    ;
    this.consume();
    return id;
  }

  consumeNum() {
    let val = this.#curVal;
    this.consume(HaystackToken.num());
    return sys.ObjUtil.coerce(val, Number.type$);
  }

  consumeStr() {
    let val = this.#curVal;
    this.consume(HaystackToken.str());
    return sys.ObjUtil.coerce(val, sys.Str.type$);
  }

  verify(expected) {
    if (sys.ObjUtil.compareNE(this.#cur, expected)) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expected ", expected), " not "), this.curToStr()));
    }
    ;
    return;
  }

  curToStr() {
    return ((this$) => { if (this$.#curVal != null) return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.#cur), " "), sys.Str.toCode(sys.ObjUtil.toStr(this$.#curVal))); return this$.#cur.toStr(); })(this);
  }

  consume(expected) {
    if (expected === undefined) expected = null;
    if (expected != null) {
      this.verify(sys.ObjUtil.coerce(expected, HaystackToken.type$));
    }
    ;
    this.#cur = this.#peek;
    this.#curVal = this.#peekVal;
    this.#curLine = this.#peekLine;
    this.#peek = this.#tokenizer.next();
    this.#peekVal = this.#tokenizer.val();
    this.#peekLine = this.#tokenizer.line();
    return;
  }

  err(msg) {
    return sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", msg), " [line "), sys.ObjUtil.coerce(this.#curLine, sys.Obj.type$.toNullable())), "]"));
  }

}

class TrioReader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#srcLineNum = 0;
    this.#factory = HaystackFactory.make();
    return;
  }

  typeof() { return TrioReader.type$; }

  #recLineNum = 0;

  recLineNum() {
    return this.#recLineNum;
  }

  #recFilePos = 0;

  recFilePos() {
    return this.#recFilePos;
  }

  #filePos = 0;

  filePos() {
    return this.#filePos;
  }

  #srcLineNum = 0;

  srcLineNum() {
    return this.#srcLineNum;
  }

  #srcFilePos = 0;

  srcFilePos() {
    return this.#srcFilePos;
  }

  #factory = null;

  factory(it) {
    if (it === undefined) {
      return this.#factory;
    }
    else {
      this.#factory = it;
      return;
    }
  }

  #in = null;

  // private field reflection only
  __in(it) { if (it === undefined) return this.#in; else this.#in = it; }

  #lineNum = 0;

  // private field reflection only
  __lineNum(it) { if (it === undefined) return this.#lineNum; else this.#lineNum = it; }

  #pushback = null;

  // private field reflection only
  __pushback(it) { if (it === undefined) return this.#pushback; else this.#pushback = it; }

  #name = null;

  // private field reflection only
  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #val = null;

  // private field reflection only
  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make(in$) {
    const $self = new TrioReader();
    TrioReader.make$($self, in$);
    return $self;
  }

  static make$($self, in$) {
    ;
    $self.#in = in$;
    return;
  }

  readGrid() {
    return Etc.makeDictsGrid(null, this.readAllDicts());
  }

  readAllDicts() {
    const this$ = this;
    let acc = sys.List.make(Dict.type$);
    this.eachDict((rec) => {
      acc.add(rec);
      return;
    });
    return acc;
  }

  eachDict(f) {
    try {
      while (true) {
        let rec = this.readDict(false);
        if (rec == null) {
          break;
        }
        ;
        sys.Func.call(f, sys.ObjUtil.coerce(rec, Dict.type$));
      }
      ;
    }
    finally {
      this.#in.close();
    }
    ;
    return;
  }

  readDict(checked) {
    if (checked === undefined) checked = true;
    let tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    tags.ordered(true);
    let r = this.readTag();
    while (sys.ObjUtil.equals(r, 0)) {
      (r = this.readTag());
    }
    ;
    if (sys.ObjUtil.equals(r, -1)) {
      if (checked) {
        throw sys.Err.make("Expected dict not end of stream");
      }
      ;
      return null;
    }
    ;
    this.#recLineNum = this.#lineNum;
    this.#recFilePos = this.#filePos;
    tags.set(sys.ObjUtil.coerce(this.#name, sys.Str.type$), sys.ObjUtil.coerce(this.#val, sys.Obj.type$));
    while (true) {
      (r = this.readTag());
      if (sys.ObjUtil.compareNE(r, 1)) {
        break;
      }
      ;
      if (tags.get(sys.ObjUtil.coerce(this.#name, sys.Str.type$)) != null) {
        throw this.err(sys.Str.plus("Duplicate tag: ", this.#name));
      }
      ;
      tags.set(sys.ObjUtil.coerce(this.#name, sys.Str.type$), sys.ObjUtil.coerce(this.#val, sys.Obj.type$));
    }
    ;
    if (tags.isEmpty()) {
      if (checked) {
        throw sys.Err.make("Expected dict not end of stream");
      }
      ;
      return null;
    }
    ;
    return Etc.makeDict(tags);
  }

  readAllRecs() {
    return this.readAllDicts();
  }

  readRec() {
    return this.readDict(false);
  }

  eachRec(f) {
    this.eachDict(f);
    return;
  }

  readTag() {
    let line = this.readLine();
    while (true) {
      if (line == null) {
        return -1;
      }
      ;
      if (sys.Str.startsWith(line, "-")) {
        return 0;
      }
      ;
      if ((sys.Str.isEmpty(line) || sys.Str.startsWith(line, "//") || (sys.Int.isSpace(sys.Str.get(line, 0)) && sys.Str.isEmpty(sys.Str.trim(line))))) {
        (line = this.readLine());
        continue;
      }
      ;
      break;
    }
    ;
    let lineNum = this.#lineNum;
    let colon = sys.Str.index(line, ":");
    this.#name = line;
    this.#val = Marker.val();
    if (colon != null) {
      this.#name = sys.Str.trim(sys.Str.getRange(line, sys.Range.make(0, sys.ObjUtil.coerce(colon, sys.Int.type$), true)));
      let valStr = sys.Str.trim(sys.Str.getRange(line, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1), -1)));
      try {
        if (sys.Str.isEmpty(valStr)) {
          if (sys.ObjUtil.equals(this.#name, "src")) {
            this.#srcLineNum = sys.Int.plus(lineNum, 1);
            this.#srcFilePos = this.#filePos;
          }
          ;
          this.#val = this.readIndentedText();
        }
        else {
          if (sys.ObjUtil.equals(this.#name, "src")) {
            this.#srcLineNum = lineNum;
            this.#srcFilePos = this.#filePos - valStr.length;
          }
          ;
          this.#val = this.parseScalar(valStr);
        }
        ;
      }
      catch ($_u151) {
        $_u151 = sys.Err.make($_u151);
        if ($_u151 instanceof sys.Err) {
          let e = $_u151;
          ;
          throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid tag value for ", sys.Str.toCode(this.#name)), ": "), valStr), lineNum, e);
        }
        else {
          throw $_u151;
        }
      }
      ;
    }
    ;
    if (!Etc.isTagName(sys.ObjUtil.coerce(this.#name, sys.Str.type$))) {
      throw this.err(sys.Str.plus("Invalid name: ", this.#name), lineNum);
    }
    ;
    this.#name = this.#factory.makeId(sys.ObjUtil.coerce(this.#name, sys.Str.type$));
    return 1;
  }

  parseScalar(s) {
    let ch = sys.Str.get(s, 0);
    if ((sys.Int.isDigit(ch) || sys.ObjUtil.equals(ch, 45))) {
      if ((sys.ObjUtil.equals(sys.Str.size(s), 17) && sys.ObjUtil.equals(sys.Str.get(s, 8), 45))) {
        throw sys.Err.make(sys.Str.plus("Unsupported Ref format: ", s));
      }
      ;
      if ((sys.ObjUtil.equals(sys.Str.size(s), 10) && sys.ObjUtil.equals(sys.Str.get(s, 4), 45))) {
        return sys.ObjUtil.coerce(((this$) => { let $_u152 = this$.#factory.makeDate(s); if ($_u152 != null) return $_u152; return s; })(this), sys.Obj.type$);
      }
      ;
      if ((sys.ObjUtil.compareGT(sys.Str.size(s), 20) && sys.ObjUtil.equals(sys.Str.get(s, 4), 45))) {
        if (sys.Str.endsWith(s, "Z")) {
          return sys.ObjUtil.coerce(((this$) => { let $_u153 = this$.#factory.makeDateTime(sys.Str.plus(sys.Str.plus("", s), " UTC")); if ($_u153 != null) return $_u153; return s; })(this), sys.Obj.type$);
        }
        else {
          return sys.ObjUtil.coerce(((this$) => { let $_u154 = this$.#factory.makeDateTime(s); if ($_u154 != null) return $_u154; return s; })(this), sys.Obj.type$);
        }
        ;
      }
      ;
      if ((sys.ObjUtil.compareGT(sys.Str.size(s), 3) && (sys.ObjUtil.equals(sys.Str.get(s, 1), 58) || sys.ObjUtil.equals(sys.Str.get(s, 2), 58)))) {
        if (sys.ObjUtil.equals(sys.Str.get(s, 1), 58)) {
          (s = sys.Str.plus("0", s));
        }
        ;
        if (sys.ObjUtil.equals(sys.Str.size(s), 5)) {
          (s = sys.Str.plus(sys.Str.plus("", s), ":00"));
        }
        ;
        return sys.ObjUtil.coerce(((this$) => { let $_u155 = this$.#factory.makeTime(s); if ($_u155 != null) return $_u155; return s; })(this), sys.Obj.type$);
      }
      ;
      if (!sys.Str.contains(s, " ")) {
        return sys.ObjUtil.coerce(this.readAsZinc(s), sys.Obj.type$);
      }
      ;
    }
    else {
      if ((sys.ObjUtil.equals(ch, 34) || sys.ObjUtil.equals(ch, 96))) {
        if (sys.ObjUtil.compareNE(sys.Str.get(s, -1), sys.Str.get(s, 0))) {
          throw this.err(sys.Str.plus("Invalid quoted literal: ", s));
        }
        ;
        return sys.ObjUtil.coerce(this.readAsZinc(s), sys.Obj.type$);
      }
      else {
        if ((sys.ObjUtil.equals(ch, 64) || sys.ObjUtil.equals(ch, 94))) {
          return sys.ObjUtil.coerce(this.readAsZinc(s), sys.Obj.type$);
        }
        else {
          if ((sys.ObjUtil.equals(ch, 123) || sys.ObjUtil.equals(sys.Str.get(s, -1), 41))) {
            return sys.ObjUtil.coerce(this.readAsZinc(s), sys.Obj.type$);
          }
          else {
            if (sys.ObjUtil.equals(ch, 91)) {
              if (sys.ObjUtil.equals(s, "[")) {
                return this.readIndentedList();
              }
              else {
                return sys.ObjUtil.coerce(this.readAsZinc(s), sys.Obj.type$);
              }
              ;
            }
            else {
              if (sys.ObjUtil.equals(s, "true")) {
                return sys.ObjUtil.coerce(true, sys.Obj.type$);
              }
              ;
              if (sys.ObjUtil.equals(s, "false")) {
                return sys.ObjUtil.coerce(false, sys.Obj.type$);
              }
              ;
              if (sys.ObjUtil.equals(s, "T")) {
                return sys.ObjUtil.coerce(true, sys.Obj.type$);
              }
              ;
              if (sys.ObjUtil.equals(s, "F")) {
                return sys.ObjUtil.coerce(false, sys.Obj.type$);
              }
              ;
              if (sys.ObjUtil.equals(s, "NA")) {
                return NA.val();
              }
              ;
              if (sys.ObjUtil.equals(s, "NaN")) {
                return Number.nan();
              }
              ;
              if (sys.ObjUtil.equals(s, "INF")) {
                return Number.posInf();
              }
              ;
              if (sys.ObjUtil.equals(s, "R")) {
                return Remove.val();
              }
              ;
              if (sys.ObjUtil.equals(s, "Zinc:")) {
                return sys.ObjUtil.coerce(this.readAsZinc(this.readIndentedText()), sys.Obj.type$);
              }
              ;
              if (sys.ObjUtil.equals(s, "Trio:")) {
                return sys.ObjUtil.coerce(this.readAsTrio(this.readIndentedText()), sys.Obj.type$);
              }
              ;
              if (sys.Str.endsWith(s, ":")) {
                throw sys.Err.make(sys.Str.plus("Unsupported indention format: ", s));
              }
              ;
            }
            ;
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    return s;
  }

  readAsZinc(s) {
    let tokenizer = HaystackTokenizer.make(sys.Str.in(s));
    tokenizer.factory(this.#factory);
    return ZincReader.makeTokenizer(tokenizer).readVal();
  }

  readAsTrio(s) {
    let r = TrioReader.make(sys.Str.in(s));
    r.#factory = this.#factory;
    return r.readDict();
  }

  readIndentedText() {
    const this$ = this;
    let minIndent = sys.Int.maxVal();
    let lines = sys.List.make(sys.Str.type$);
    while (true) {
      let line = this.readLine();
      if (line == null) {
        break;
      }
      ;
      if ((sys.ObjUtil.compareGT(sys.Str.size(line), 1) && !sys.Int.isSpace(sys.Str.get(line, 0)))) {
        this.#pushback = line;
        break;
      }
      ;
      lines.add(sys.Str.trimEnd(line));
      for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(line)); i = sys.Int.increment(i)) {
        if (!sys.Int.isSpace(sys.Str.get(line, i))) {
          if (sys.ObjUtil.compareLT(i, minIndent)) {
            (minIndent = i);
          }
          ;
          break;
        }
        ;
      }
      ;
    }
    ;
    let s = sys.StrBuf.make();
    lines.each((line, i) => {
      let strip = ((this$) => { if (sys.ObjUtil.compareLE(sys.Str.size(line), minIndent)) return ""; return sys.Str.getRange(line, sys.Range.make(minIndent, -1)); })(this$);
      s.join(strip, "\n");
      return;
    });
    return s.toStr();
  }

  readIndentedList() {
    const this$ = this;
    let lines = sys.Str.in(this.readIndentedText()).readAllLines();
    (lines = lines.findAll((line) => {
      return !sys.Str.startsWith(sys.Str.trim(line), "//");
    }));
    let s = sys.StrBuf.make().add("[");
    lines.each((line) => {
      s.add(line).addChar(32);
      return;
    });
    return sys.ObjUtil.coerce(ZincReader.make(sys.Str.in(s.toStr())).readVal(), sys.Obj.type$);
  }

  readLine() {
    if (this.#pushback != null) {
      let s = this.#pushback;
      this.#pushback = null;
      return s;
    }
    ;
    this.#lineNum = sys.Int.increment(this.#lineNum);
    let line = this.#in.readLine(null);
    if (line !== null) this.#filePos += line.length + 1
    return line
  }

  err(msg, lineNum, cause) {
    if (lineNum === undefined) lineNum = this.#lineNum;
    if (cause === undefined) cause = null;
    return sys.ParseErr.make(sys.Str.plus(msg, sys.Str.plus(sys.Str.plus(" [Line ", sys.ObjUtil.coerce(lineNum, sys.Obj.type$.toNullable())), "]")), cause);
  }

}

class Ref extends xeto.Ref {
  constructor() {
    super();
    const this$ = this;
    this.#disValRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return Ref.type$; }

  #idRef = null;

  // private field reflection only
  __idRef(it) { if (it === undefined) return this.#idRef; else this.#idRef = it; }

  #disVal = null;

  disVal(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.#disValRef.val(), sys.Str.type$.toNullable());
    }
    else {
      this.#disValRef.val(it);
      return;
    }
  }

  #disValRef = null;

  // private field reflection only
  __disValRef(it) { if (it === undefined) return this.#disValRef; else this.#disValRef = it; }

  #segs = null;

  segs() { return this.#segs; }

  __segs(it) { if (it === undefined) return this.#segs; else this.#segs = it; }

  static #idChars = undefined;

  static idChars() {
    if (Ref.#idChars === undefined) {
      Ref.static$init();
      if (Ref.#idChars === undefined) Ref.#idChars = null;
    }
    return Ref.#idChars;
  }

  static #nullRef = undefined;

  static nullRef() {
    if (Ref.#nullRef === undefined) {
      Ref.static$init();
      if (Ref.#nullRef === undefined) Ref.#nullRef = null;
    }
    return Ref.#nullRef;
  }

  static #defVal = undefined;

  static defVal() {
    if (Ref.#defVal === undefined) {
      Ref.static$init();
      if (Ref.#defVal === undefined) Ref.#defVal = null;
    }
    return Ref.#defVal;
  }

  static fromStr(id, checked) {
    if (checked === undefined) checked = true;
    try {
      return Ref.make(id, null);
    }
    catch ($_u157) {
      $_u157 = sys.Err.make($_u157);
      if ($_u157 instanceof sys.ParseErr) {
        let e = $_u157;
        ;
        if (checked) {
          throw e;
        }
        ;
        return null;
      }
      else {
        throw $_u157;
      }
    }
    ;
  }

  static make(id, dis) {
    let err = Ref.isIdErr(id);
    if (err != null) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid Ref id (", err), "): "), id));
    }
    ;
    return Ref.makeImpl(id, dis);
  }

  static makeWithDis(ref, dis) {
    if (dis === undefined) dis = null;
    if ((dis == null && ref.disVal() == null)) {
      return ref;
    }
    ;
    return Ref.makeImpl(ref.id(), dis);
  }

  static gen() {
    let time = sys.Int.and(sys.Int.div(sys.DateTime.nowTicks(), 1000000000), 4294967295);
    let rand = sys.Int.and(sys.Int.random(), 4294967295);
    let str = Ref.handleToStr(time, rand);
    return Ref.makeSegs(str, null, sys.List.make(RefSeg.type$, [RefSeg.make("", str)]));
  }

  static makeHandle(handle) {
    let time = sys.Int.and(sys.Int.shiftr(handle, 32), 4294967295);
    let rand = sys.Int.and(handle, 4294967295);
    let str = Ref.handleToStr(time, rand);
    return Ref.makeSegs(str, null, sys.List.make(RefSeg.type$, [RefSeg.make("", str)]));
  }

  static handleToStr(time, rand) {
    return sys.StrBuf.make(20).add(sys.Int.toHex(time, sys.ObjUtil.coerce(8, sys.Int.type$.toNullable()))).addChar(45).add(sys.Int.toHex(rand, sys.ObjUtil.coerce(8, sys.Int.type$.toNullable()))).toStr();
  }

  static makeImpl(id, dis) {
    const $self = new Ref();
    Ref.makeImpl$($self, id, dis);
    return $self;
  }

  static makeImpl$($self, id, dis) {
    xeto.Ref.make$($self);
    ;
    $self.#idRef = id;
    $self.#segs = sys.ObjUtil.coerce(((this$) => { let $_u158 = RefSeg.parse(id); if ($_u158 == null) return null; return sys.ObjUtil.toImmutable(RefSeg.parse(id)); })($self), sys.Type.find("haystack::RefSeg[]"));
    $self.disVal(dis);
    return;
  }

  static makeSegs(id, dis, segs) {
    const $self = new Ref();
    Ref.makeSegs$($self, id, dis, segs);
    return $self;
  }

  static makeSegs$($self, id, dis, segs) {
    xeto.Ref.make$($self);
    ;
    $self.#idRef = id;
    $self.#segs = sys.ObjUtil.coerce(((this$) => { let $_u159 = segs; if ($_u159 == null) return null; return sys.ObjUtil.toImmutable(segs); })($self), sys.Type.find("haystack::RefSeg[]"));
    $self.disVal(dis);
    return;
  }

  id() {
    return this.#idRef;
  }

  handle() {
    try {
      if ((sys.ObjUtil.equals(sys.Str.size(this.id()), 17) && sys.ObjUtil.equals(sys.Str.get(this.id(), 8), 45))) {
        let time = sys.Str.toInt(sys.Str.getRange(this.id(), sys.Range.make(0, 7)), 16);
        let rand = sys.Str.toInt(sys.Str.getRange(this.id(), sys.Range.make(9, 16)), 16);
        return sys.Int.or(sys.Int.shiftl(sys.Int.and(sys.ObjUtil.coerce(time, sys.Int.type$), 4294967295), 32), sys.Int.and(sys.ObjUtil.coerce(rand, sys.Int.type$), 4294967295));
      }
      ;
    }
    catch ($_u160) {
      $_u160 = sys.Err.make($_u160);
      if ($_u160 instanceof sys.Err) {
        let e = $_u160;
        ;
      }
      else {
        throw $_u160;
      }
    }
    ;
    if (this.isNull()) {
      return 0;
    }
    ;
    throw sys.UnsupportedErr.make(sys.Str.plus("Not handle Ref: ", this.id()));
  }

  hash() {
    return sys.Str.hash(this.id());
  }

  equals(that) {
    let x = sys.ObjUtil.as(that, Ref.type$);
    if (x == null) {
      return false;
    }
    ;
    return sys.ObjUtil.equals(this.id(), x.id());
  }

  dis() {
    return sys.ObjUtil.coerce(((this$) => { let $_u161 = this$.disVal(); if ($_u161 != null) return $_u161; return this$.#idRef; })(this), sys.Str.type$);
  }

  toStr() {
    return this.id();
  }

  toCode() {
    return sys.StrBuf.make(sys.Int.plus(sys.Str.size(this.id()), 1)).addChar(64).add(this.id()).toStr();
  }

  static fromCode(s) {
    if (!sys.Str.startsWith(s, "@")) {
      throw sys.ParseErr.make(sys.Str.plus("Missing leading @: ", s));
    }
    ;
    return sys.ObjUtil.coerce(Ref.fromStr(sys.Str.getRange(s, sys.Range.make(1, -1))), Ref.type$);
  }

  static toCodeList(refs) {
    const this$ = this;
    let s = sys.StrBuf.make(sys.Int.mult(refs.size(), 20)).addChar(91);
    refs.each((ref, i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        s.addChar(44);
      }
      ;
      s.addChar(64).add(ref.id());
      return;
    });
    return s.addChar(93).toStr();
  }

  static listToStr(ids) {
    const this$ = this;
    if (sys.ObjUtil.equals(ids.size(), 0)) {
      return "";
    }
    ;
    if (sys.ObjUtil.equals(ids.size(), 1)) {
      return ids.first().toCode();
    }
    ;
    let s = sys.StrBuf.make();
    s.capacity(sys.Int.mult(ids.size(), 20));
    ids.each((id) => {
      if (!s.isEmpty()) {
        s.addChar(44);
      }
      ;
      s.addChar(64).add(id);
      return;
    });
    return s.toStr();
  }

  static listFromStr(s) {
    const this$ = this;
    if (sys.Str.isEmpty(s)) {
      return sys.ObjUtil.coerce(Ref.type$.emptyList(), sys.Type.find("haystack::Ref[]"));
    }
    ;
    return sys.ObjUtil.coerce(sys.Str.split(s, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())).map((tok) => {
      if (sys.Str.startsWith(tok, "@")) {
        (tok = sys.Str.getRange(tok, sys.Range.make(1, -1)));
      }
      ;
      return sys.ObjUtil.coerce(Ref.make(tok, null), Ref.type$);
    }, Ref.type$), sys.Type.find("haystack::Ref[]"));
  }

  noDis() {
    if (this.disVal() == null) {
      return this;
    }
    ;
    return sys.ObjUtil.coerce(Ref.make(this.id(), null), Ref.type$);
  }

  isNull() {
    return sys.ObjUtil.equals(this.id(), "null");
  }

  static isIdErr(n) {
    if (sys.Str.isEmpty(n)) {
      return "empty string";
    }
    ;
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(n)); i = sys.Int.increment(i)) {
      if (!Ref.isIdChar(sys.Str.get(n, i))) {
        return sys.Str.plus("invalid char ", sys.Str.toCode(sys.Int.toChar(sys.Str.get(n, i)), sys.ObjUtil.coerce(39, sys.Int.type$.toNullable()), true));
      }
      ;
    }
    ;
    return null;
  }

  static isId(n) {
    return Ref.isIdErr(n) == null;
  }

  static toId(n) {
    const this$ = this;
    if (sys.Str.isEmpty(n)) {
      throw sys.ArgErr.make("string is empty");
    }
    ;
    let buf = sys.StrBuf.make();
    sys.Str.each(n, (ch) => {
      if (Ref.isIdChar(ch)) {
        buf.addChar(ch);
      }
      ;
      return;
    });
    if (buf.isEmpty()) {
      throw sys.ArgErr.make("no valid id chars");
    }
    ;
    return buf.toStr();
  }

  static isIdChar(char) {
    if (sys.ObjUtil.compareLT(char, 127)) {
      return Ref.idChars().get(char);
    }
    ;
    return false;
  }

  toZinc() {
    if (this.disVal() == null) {
      return this.toCode();
    }
    ;
    return sys.StrBuf.make(sys.Int.plus(sys.Int.plus(sys.Int.plus(1, sys.Str.size(this.id())), 8), sys.Str.size(this.disVal()))).addChar(64).add(this.id()).addChar(32).add(sys.Str.toCode(this.disVal())).toStr();
  }

  toJson() {
    let s = sys.StrBuf.make(sys.Int.plus(sys.Int.plus(sys.Int.plus(2, sys.Str.size(this.id())), 8), sys.ObjUtil.coerce(((this$) => { let $_u162 = ((this$) => { let $_u163 = this$.disVal(); if ($_u163 == null) return null; return sys.Str.size(this$.disVal()); })(this$); if ($_u162 != null) return $_u162; return sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()); })(this), sys.Int.type$)));
    s.addChar(114).addChar(58).add(this.id());
    if (this.disVal() != null) {
      s.addChar(32).add(this.disVal());
    }
    ;
    return s.toStr();
  }

  isRel() {
    return (sys.ObjUtil.equals(this.#segs.size(), 1) && sys.ObjUtil.equals(this.#segs.first().scheme(), "") && !this.isNull());
  }

  toRel(prefix) {
    if (prefix == null) {
      return this;
    }
    ;
    if (sys.ObjUtil.compareLE(sys.Str.size(this.id()), sys.Str.size(prefix))) {
      return this;
    }
    ;
    if (sys.ObjUtil.compareNE(sys.Str.get(this.id(), sys.Int.minus(sys.Str.size(prefix), 1)), sys.Str.get(prefix, -1))) {
      return this;
    }
    ;
    if (!sys.Str.startsWith(this.id(), sys.ObjUtil.coerce(prefix, sys.Str.type$))) {
      return this;
    }
    ;
    return Ref.makeImpl(sys.Str.getRange(this.id(), sys.Range.make(sys.Str.size(prefix), -1)), this.disVal());
  }

  toAbs(prefix) {
    if (!Ref.isId(prefix)) {
      throw sys.ArgErr.make(sys.Str.plus("Invalid Ref prefix: ", prefix));
    }
    ;
    if (sys.ObjUtil.compareNE(sys.Str.get(prefix, -1), 58)) {
      throw sys.ArgErr.make(sys.Str.plus("Prefix must end with colon: ", prefix));
    }
    ;
    return Ref.makeImpl(sys.Str.plus(prefix, this.id()), this.disVal());
  }

  isProjRec() {
    return (sys.ObjUtil.equals(this.#segs.size(), 2) && sys.ObjUtil.equals(this.#segs.get(0).scheme(), RefSchemes.proj()) && sys.ObjUtil.equals(this.#segs.get(1).scheme(), RefSchemes.rec()));
  }

  toProjRel() {
    if (!this.isProjRec()) {
      return this;
    }
    ;
    let body = this.#segs.get(1).body();
    return Ref.makeSegs(body, this.disVal(), sys.List.make(RefSeg.type$, [RefSeg.make("", body)]));
  }

  static main() {
    sys.ObjUtil.echo(Ref.gen());
    return;
  }

  static static$init() {
    if (true) {
      let map = sys.List.make(sys.Bool.type$);
      map.fill(sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), 127);
      for (let i = 97; sys.ObjUtil.compareLE(i, 122); i = sys.Int.increment(i)) {
        map.set(i, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      }
      ;
      for (let i = 65; sys.ObjUtil.compareLE(i, 90); i = sys.Int.increment(i)) {
        map.set(i, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      }
      ;
      for (let i = 48; sys.ObjUtil.compareLE(i, 57); i = sys.Int.increment(i)) {
        map.set(i, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      }
      ;
      map.set(95, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      map.set(58, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      map.set(45, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      map.set(46, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      map.set(126, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      Ref.#idChars = sys.ObjUtil.coerce(((this$) => { let $_u164 = map; if ($_u164 == null) return null; return sys.ObjUtil.toImmutable(map); })(this), sys.Type.find("sys::Bool[]"));
    }
    ;
    Ref.#nullRef = sys.ObjUtil.coerce(Ref.fromStr("null"), Ref.type$);
    Ref.#defVal = Ref.#nullRef;
    return;
  }

}

class RefDir extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RefDir.type$; }

  static na() { return RefDir.vals().get(0); }

  static from() { return RefDir.vals().get(1); }

  static to() { return RefDir.vals().get(2); }

  static #vals = undefined;

  #code = null;

  code() { return this.#code; }

  __code(it) { if (it === undefined) return this.#code; else this.#code = it; }

  #symbol = null;

  symbol() { return this.#symbol; }

  __symbol(it) { if (it === undefined) return this.#symbol; else this.#symbol = it; }

  static make($ordinal, $name, code, symbol) {
    const $self = new RefDir();
    RefDir.make$($self, $ordinal, $name, code, symbol);
    return $self;
  }

  static make$($self, $ordinal, $name, code, symbol) {
    sys.Enum.make$($self, $ordinal, $name);
    $self.#code = code;
    $self.#symbol = symbol;
    return;
  }

  static fromStr(name$, checked = true) {
    return sys.Enum.doFromStr(RefDir.type$, RefDir.vals(), name$, checked);
  }

  static vals() {
    if (RefDir.#vals == null) {
      RefDir.#vals = sys.List.make(RefDir.type$, [
        RefDir.make(0, "na", "na", "na"),
        RefDir.make(1, "from", "<<", "\u00ab"),
        RefDir.make(2, "to", ">>", "\u00bb "),
      ]).toImmutable();
    }
    return RefDir.#vals;
  }

  static static$init() {
    const $_u165 = RefDir.vals();
    if (true) {
    }
    ;
    return;
  }

}

class RefSeg extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RefSeg.type$; }

  #scheme = null;

  scheme() { return this.#scheme; }

  __scheme(it) { if (it === undefined) return this.#scheme; else this.#scheme = it; }

  #body = null;

  body() { return this.#body; }

  __body(it) { if (it === undefined) return this.#body; else this.#body = it; }

  static parse(id) {
    let colon = sys.Str.index(id, ":");
    if (colon == null) {
      return sys.List.make(RefSeg.type$, [RefSeg.make("", id)]);
    }
    ;
    let toks = sys.Str.split(id, sys.ObjUtil.coerce(58, sys.Int.type$.toNullable()));
    let segs = sys.List.make(RefSeg.type$);
    let half = sys.Int.div(toks.size(), 2);
    segs.capacity(half);
    for (let i = 0; sys.ObjUtil.compareLT(i, half); i = sys.Int.increment(i)) {
      segs.add(RefSeg.make(toks.get(sys.Int.mult(i, 2)), toks.get(sys.Int.plus(sys.Int.mult(i, 2), 1))));
    }
    ;
    if (sys.Int.isOdd(toks.size())) {
      segs.add(RefSeg.make("", sys.ObjUtil.coerce(toks.last(), sys.Str.type$)));
    }
    ;
    return segs;
  }

  static make(scheme, body) {
    const $self = new RefSeg();
    RefSeg.make$($self, scheme, body);
    return $self;
  }

  static make$($self, scheme, body) {
    $self.#scheme = scheme;
    $self.#body = body;
    return;
  }

  hash() {
    return sys.Int.xor(sys.Str.hash(this.#scheme), sys.Str.hash(this.#body));
  }

  equals(that) {
    let x = sys.ObjUtil.as(that, RefSeg.type$);
    if (x == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#scheme, x.#scheme) && sys.ObjUtil.equals(this.#body, x.#body));
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#scheme), ":"), this.#body);
  }

}

class RefSchemes extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RefSchemes.type$; }

  static #proj = undefined;

  static proj() {
    if (RefSchemes.#proj === undefined) {
      RefSchemes.static$init();
      if (RefSchemes.#proj === undefined) RefSchemes.#proj = null;
    }
    return RefSchemes.#proj;
  }

  static #host = undefined;

  static host() {
    if (RefSchemes.#host === undefined) {
      RefSchemes.static$init();
      if (RefSchemes.#host === undefined) RefSchemes.#host = null;
    }
    return RefSchemes.#host;
  }

  static #user = undefined;

  static user() {
    if (RefSchemes.#user === undefined) {
      RefSchemes.static$init();
      if (RefSchemes.#user === undefined) RefSchemes.#user = null;
    }
    return RefSchemes.#user;
  }

  static #rec = undefined;

  static rec() {
    if (RefSchemes.#rec === undefined) {
      RefSchemes.static$init();
      if (RefSchemes.#rec === undefined) RefSchemes.#rec = null;
    }
    return RefSchemes.#rec;
  }

  static #node = undefined;

  static node() {
    if (RefSchemes.#node === undefined) {
      RefSchemes.static$init();
      if (RefSchemes.#node === undefined) RefSchemes.#node = null;
    }
    return RefSchemes.#node;
  }

  static #lic = undefined;

  static lic() {
    if (RefSchemes.#lic === undefined) {
      RefSchemes.static$init();
      if (RefSchemes.#lic === undefined) RefSchemes.#lic = null;
    }
    return RefSchemes.#lic;
  }

  static #replica = undefined;

  static replica() {
    if (RefSchemes.#replica === undefined) {
      RefSchemes.static$init();
      if (RefSchemes.#replica === undefined) RefSchemes.#replica = null;
    }
    return RefSchemes.#replica;
  }

  static #subnet = undefined;

  static subnet() {
    if (RefSchemes.#subnet === undefined) {
      RefSchemes.static$init();
      if (RefSchemes.#subnet === undefined) RefSchemes.#subnet = null;
    }
    return RefSchemes.#subnet;
  }

  static make() {
    const $self = new RefSchemes();
    RefSchemes.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    RefSchemes.#proj = "p";
    RefSchemes.#host = "h";
    RefSchemes.#user = "u";
    RefSchemes.#rec = "r";
    RefSchemes.#node = "n";
    RefSchemes.#lic = "lic";
    RefSchemes.#replica = "replica";
    RefSchemes.#subnet = "subnet";
    return;
  }

}

class GridBuilder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#gridRef = concurrent.AtomicRef.make();
    this.#meta = Etc.emptyDict();
    this.#cols = sys.List.make(GbCol.type$);
    this.#rows = sys.List.make(GbRow.type$);
    return;
  }

  typeof() { return GridBuilder.type$; }

  #capacity = 0;

  capacity(it) {
    if (it === undefined) {
      return this.#rows.capacity();
    }
    else {
      this.#rows.capacity(it);
      return;
    }
  }

  #gridRef = null;

  // private field reflection only
  __gridRef(it) { if (it === undefined) return this.#gridRef; else this.#gridRef = it; }

  #meta = null;

  // private field reflection only
  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #cols = null;

  // private field reflection only
  __cols(it) { if (it === undefined) return this.#cols; else this.#cols = it; }

  #colsByName = null;

  // private field reflection only
  __colsByName(it) { if (it === undefined) return this.#colsByName; else this.#colsByName = it; }

  #rows = null;

  // private field reflection only
  __rows(it) { if (it === undefined) return this.#rows; else this.#rows = it; }

  #copyGrid = null;

  // private field reflection only
  __copyGrid(it) { if (it === undefined) return this.#copyGrid; else this.#copyGrid = it; }

  setMeta(meta) {
    this.#meta = Etc.makeDict(meta);
    return this;
  }

  numCols() {
    return this.#cols.size();
  }

  numRows() {
    return this.#rows.size();
  }

  hasCol(name) {
    if (this.#colsByName == null) {
      this.finishCols();
    }
    ;
    return this.#colsByName.containsKey(name);
  }

  colNameToIndex(name) {
    if (this.#colsByName == null) {
      this.finishCols();
    }
    ;
    let col = this.#colsByName.get(name);
    if (col == null) {
      throw UnknownNameErr.make(sys.Str.plus("Col not defined: ", name));
    }
    ;
    return col.index();
  }

  addCol(name, meta) {
    if (meta === undefined) meta = null;
    if (this.#colsByName != null) {
      throw sys.Err.make("Cannot add cols after adding rows");
    }
    ;
    if (!Etc.isTagName(name)) {
      throw sys.ArgErr.make(sys.Str.plus("Invalid col name: ", name));
    }
    ;
    this.#cols.add(GbCol.make(this.#cols.size(), name, Etc.makeDict(meta)));
    return this;
  }

  addColNames(names) {
    const this$ = this;
    names.each((n) => {
      this$.addCol(n);
      return;
    });
    return this;
  }

  addRow(cells) {
    if (this.#colsByName == null) {
      this.finishCols();
    }
    ;
    if (sys.ObjUtil.compareNE(cells.size(), this.#cols.size())) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Num cells ", sys.ObjUtil.coerce(cells.size(), sys.Obj.type$.toNullable())), " != Num cols "), sys.ObjUtil.coerce(this.#cols.size(), sys.Obj.type$.toNullable())));
    }
    ;
    this.#rows.add(GbRow.make(this.#gridRef, cells));
    return this;
  }

  addRow1(cell) {
    if (this.#colsByName == null) {
      this.finishCols();
    }
    ;
    if (sys.ObjUtil.compareNE(this.#cols.size(), 1)) {
      throw sys.ArgErr.make(sys.Str.plus("Num cells 1 != Num cols ", sys.ObjUtil.coerce(this.#cols.size(), sys.Obj.type$.toNullable())));
    }
    ;
    this.#rows.add(GbRow.make(this.#gridRef, sys.List.make(sys.Obj.type$.toNullable(), [cell])));
    return this;
  }

  addRow2(a, b) {
    if (this.#colsByName == null) {
      this.finishCols();
    }
    ;
    if (sys.ObjUtil.compareNE(this.#cols.size(), 2)) {
      throw sys.ArgErr.make(sys.Str.plus("Num cells 2 != Num cols ", sys.ObjUtil.coerce(this.#cols.size(), sys.Obj.type$.toNullable())));
    }
    ;
    this.#rows.add(GbRow.make(this.#gridRef, sys.List.make(sys.Obj.type$.toNullable(), [a, b])));
    return this;
  }

  addRow3(a, b, c) {
    if (this.#colsByName == null) {
      this.finishCols();
    }
    ;
    if (sys.ObjUtil.compareNE(this.#cols.size(), 3)) {
      throw sys.ArgErr.make(sys.Str.plus("Num cells 3 != Num cols ", sys.ObjUtil.coerce(this.#cols.size(), sys.Obj.type$.toNullable())));
    }
    ;
    this.#rows.add(GbRow.make(this.#gridRef, sys.List.make(sys.Obj.type$.toNullable(), [a, b, c])));
    return this;
  }

  addRow4(a, b, c, d) {
    if (this.#colsByName == null) {
      this.finishCols();
    }
    ;
    if (sys.ObjUtil.compareNE(this.#cols.size(), 4)) {
      throw sys.ArgErr.make(sys.Str.plus("Num cells 4 != Num cols ", sys.ObjUtil.coerce(this.#cols.size(), sys.Obj.type$.toNullable())));
    }
    ;
    this.#rows.add(GbRow.make(this.#gridRef, sys.List.make(sys.Obj.type$.toNullable(), [a, b, c, d])));
    return this;
  }

  addDictRows(rows) {
    const this$ = this;
    rows.each((row) => {
      this$.addDictRow(row);
      return;
    });
    return this;
  }

  addGridRows(grid) {
    const this$ = this;
    grid.each((row) => {
      this$.addDictRow(row);
      return;
    });
    return this;
  }

  addDictRow(row) {
    const this$ = this;
    if (this.#colsByName == null) {
      this.finishCols();
    }
    ;
    if (row == null) {
      this.#rows.add(GbRow.make(this.#gridRef, sys.ObjUtil.coerce(sys.ObjUtil.with(sys.List.make(sys.Obj.type$.toNullable()), (it) => {
        it.size(this$.#cols.size());
        return;
      }), sys.Type.find("sys::Obj?[]"))));
      return this;
    }
    ;
    if (sys.ObjUtil.is(row, GbRow.type$)) {
      let gbRow = sys.ObjUtil.coerce(row, GbRow.type$);
      if (sys.ObjUtil.equals(gbRow.grid(), this.#copyGrid)) {
        this.#rows.add(GbRow.make(this.#gridRef, sys.ObjUtil.coerce(gbRow.cells(), sys.Type.find("sys::Obj?[]"))));
        return this;
      }
      ;
    }
    ;
    let cells = sys.List.make(sys.Obj.type$.toNullable());
    cells.size(this.#cols.size());
    row.each((v, n) => {
      let col = this$.#colsByName.get(n);
      if (col != null) {
        cells.set(col.index(), v);
      }
      ;
      return;
    });
    this.#rows.add(GbRow.make(this.#gridRef, cells));
    return this;
  }

  addGridsAsZincRows(grids) {
    const this$ = this;
    let more = grids.any((g) => {
      return g.meta().has("more");
    });
    this.setMeta(((this$) => { if (more) return sys.Map.__fromLiteral(["more"], [Marker.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker")); return null; })(this));
    this.addCol("grid");
    grids.each((g) => {
      if (g != null) {
        this$.addRow1(ZincWriter.gridToStr(sys.ObjUtil.coerce(g, Grid.type$)));
      }
      ;
      return;
    });
    return this;
  }

  addHisItemRows(pts) {
    const this$ = this;
    if (this.#colsByName == null) {
      this.finishCols();
    }
    ;
    if (sys.ObjUtil.compareNE(this.#cols.first().name(), "ts")) {
      throw sys.ArgErr.make("First col not ts");
    }
    ;
    if (sys.ObjUtil.compareNE(this.numCols(), sys.Int.plus(1, pts.size()))) {
      throw sys.ArgErr.make("Incorrect num cols");
    }
    ;
    if (pts.isEmpty()) {
      return this;
    }
    ;
    if (sys.ObjUtil.equals(pts.size(), 1)) {
      let pt = pts.first();
      this.#rows.capacity(pt.size());
      pt.each((item) => {
        this$.addRow2(item.ts(), item.val());
        return;
      });
      return this;
    }
    ;
    let rowsByTs = sys.Map.__fromLiteral([], [], sys.Type.find("sys::DateTime"), sys.Type.find("sys::Obj?[]"));
    pts.each((pt, i) => {
      let valIndex = sys.Int.plus(1, i);
      pt.each((item) => {
        let row = rowsByTs.get(item.ts());
        if (row == null) {
          (row = sys.List.make(sys.Obj.type$.toNullable()));
          row.size(this$.numCols());
          row.set(0, item.ts());
          rowsByTs.set(item.ts(), sys.ObjUtil.coerce(row, sys.Type.find("sys::Obj?[]")));
        }
        ;
        row.set(valIndex, item.val());
        return;
      });
      return;
    });
    let rows = rowsByTs.vals();
    rows.sort((a, b) => {
      return sys.ObjUtil.compare(a.get(0), b.get(0));
    });
    rows.each((row) => {
      this$.addRow(row);
      return;
    });
    return this;
  }

  copyMetaAndCols(src) {
    this.#meta = src.meta();
    return this.copyCols(src);
  }

  copyCols(src) {
    const this$ = this;
    if (sys.ObjUtil.is(src, GbGrid.type$)) {
      let x = sys.ObjUtil.coerce(src, GbGrid.type$);
      this.#copyGrid = x;
      this.#cols = sys.ObjUtil.coerce(x.cols(), sys.Type.find("haystack::GbCol[]"));
      this.#colsByName = x.colsByName();
    }
    else {
      src.cols().each((c) => {
        this$.addCol(c.name(), c.meta());
        return;
      });
    }
    ;
    return this;
  }

  sortCol(colName) {
    const this$ = this;
    if (this.#colsByName == null) {
      this.finishCols();
    }
    ;
    let c = ((this$) => { let $_u167 = this$.#colsByName.get(colName); if ($_u167 != null) return $_u167; throw sys.Err.make(sys.Str.plus("Column not found: ", colName)); })(this);
    this.#rows.sort((a, b) => {
      return sys.ObjUtil.compare(a.cells().get(c.index()), b.cells().get(c.index()));
    });
    return this;
  }

  sortrCol(colName) {
    const this$ = this;
    if (this.#colsByName == null) {
      this.finishCols();
    }
    ;
    let c = ((this$) => { let $_u168 = this$.#colsByName.get(colName); if ($_u168 != null) return $_u168; throw sys.Err.make(sys.Str.plus("Column not found: ", colName)); })(this);
    this.#rows.sortr((a, b) => {
      return sys.ObjUtil.compare(a.cells().get(c.index()), b.cells().get(c.index()));
    });
    return this;
  }

  sortDis(colName) {
    if (colName === undefined) colName = "id";
    const this$ = this;
    if (this.#colsByName == null) {
      this.finishCols();
    }
    ;
    let c = ((this$) => { let $_u169 = this$.#colsByName.get(colName); if ($_u169 != null) return $_u169; throw sys.Err.make(sys.Str.plus("Column not found: ", colName)); })(this);
    try {
      this.#rows.sort((a, b) => {
        return Etc.compareDis(GridBuilder.cellToDis(a, sys.ObjUtil.coerce(c, GbCol.type$)), GridBuilder.cellToDis(b, sys.ObjUtil.coerce(c, GbCol.type$)));
      });
    }
    catch ($_u170) {
      this.#rows.sort((a, b) => {
        return sys.ObjUtil.compare(GridBuilder.cellToDis(a, sys.ObjUtil.coerce(c, GbCol.type$)), GridBuilder.cellToDis(b, sys.ObjUtil.coerce(c, GbCol.type$)));
      });
    }
    ;
    return this;
  }

  static cellToDis(row, col) {
    let val = row.cells().get(col.index());
    return sys.ObjUtil.coerce(((this$) => { let $_u171 = ((this$) => { let $_u172 = sys.ObjUtil.as(val, Ref.type$); if ($_u172 == null) return null; return sys.ObjUtil.as(val, Ref.type$).dis(); })(this$); if ($_u171 != null) return $_u171; return sys.ObjUtil.toStr(val); })(this), sys.Str.type$);
  }

  reverseRows() {
    this.#rows.reverse();
    return this;
  }

  toGrid() {
    if (this.#colsByName == null) {
      this.finishCols();
    }
    ;
    let grid = GbGrid.make(this.#meta, this.#cols, sys.ObjUtil.coerce(this.#colsByName, sys.Type.find("[sys::Str:haystack::GbCol]")), this.#rows);
    this.#gridRef.val(grid);
    return grid;
  }

  finishCols() {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::GbCol"));
    this.#cols.each((col) => {
      if (acc.get(col.name()) != null) {
        throw sys.Err.make(sys.Str.plus("Duplicate col name: ", col.name()));
      }
      ;
      acc.set(col.name(), col);
      return;
    });
    this.#colsByName = acc;
    return;
  }

  setColMeta(colName, meta) {
    const this$ = this;
    let c = this.#cols.find((c) => {
      return sys.ObjUtil.equals(c.name(), colName);
    });
    if (c == null) {
      throw sys.Err.make(sys.Str.plus("Column not found: ", colName));
    }
    ;
    (c = GbCol.make(c.index(), colName, meta));
    if (this.#cols.isRO()) {
      this.#cols = this.#cols.rw();
    }
    ;
    this.#cols.set(c.index(), sys.ObjUtil.coerce(c, GbCol.type$));
    if (this.#colsByName != null) {
      if (this.#colsByName.isRO()) {
        this.#colsByName = this.#colsByName.rw();
      }
      ;
      this.#colsByName.set(colName, sys.ObjUtil.coerce(c, GbCol.type$));
    }
    ;
    return;
  }

  static normColNames(colNames) {
    const this$ = this;
    (colNames = colNames.dup());
    let dups = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    colNames.each((colName, i) => {
      (colName = sys.Str.trim(colName));
      if (sys.Str.isEmpty(colName)) {
        (colName = "blank");
      }
      ;
      let n = Etc.toTagName(colName);
      if (dups.get(n) != null) {
        let j = 1;
        while (dups.get(sys.Str.plus(sys.Str.plus(sys.Str.plus("", n), "_"), sys.ObjUtil.coerce(j, sys.Obj.type$.toNullable()))) != null) {
          ((this$) => { let $_u173 = j; j = sys.Int.increment(j); return $_u173; })(this$);
        }
        ;
        (n = sys.Str.plus(sys.Str.plus(sys.Str.plus("", n), "_"), sys.ObjUtil.coerce(j, sys.Obj.type$.toNullable())));
      }
      ;
      colNames.set(i, n);
      dups.set(n, n);
      return;
    });
    return colNames;
  }

  static make() {
    const $self = new GridBuilder();
    GridBuilder.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class Grid {
  constructor() {
    const this$ = this;
  }

  typeof() { return Grid.type$; }

  colNames() {
    const this$ = this;
    return sys.ObjUtil.coerce(this.cols().map((col) => {
      return col.name();
    }, sys.Str.type$), sys.Type.find("sys::Str[]"));
  }

  colDisNames() {
    const this$ = this;
    return sys.ObjUtil.coerce(this.cols().map((col) => {
      return col.dis();
    }, sys.Str.type$), sys.Type.find("sys::Str[]"));
  }

  has(name) {
    return this.col(name, false) != null;
  }

  missing(name) {
    return this.col(name, false) == null;
  }

  isEmpty() {
    return sys.ObjUtil.equals(this.size(), 0);
  }

  isErr() {
    return this.meta().has("err");
  }

  isIncomplete() {
    return (this.meta().has("incomplete") || this.meta().has("more"));
  }

  incomplete(checked) {
    if (checked === undefined) checked = true;
    let val = this.meta().get("incomplete");
    if ((val == null && this.meta().has("more"))) {
      (val = Etc.emptyDict());
      if (this.meta().has("limit")) {
        (val = Etc.makeDict1("dis", sys.Str.plus("Limit exceeded: ", this.meta().get("limit"))));
      }
      ;
    }
    ;
    if (val == null) {
      if (checked) {
        throw UnknownNameErr.make("incomplete");
      }
      ;
      return null;
    }
    ;
    return ((this$) => { let $_u174 = sys.ObjUtil.as(val, Dict.type$); if ($_u174 != null) return $_u174; return Etc.emptyDict(); })(this);
  }

  isHisGrid() {
    return (sys.ObjUtil.compareGE(this.cols().size(), 2) && sys.ObjUtil.equals(this.cols().get(0).name(), "ts") && sys.ObjUtil.is(this.meta().get("hisStart"), sys.DateTime.type$) && sys.ObjUtil.is(this.meta().get("hisEnd"), sys.DateTime.type$));
  }

  last() {
    return ((this$) => { if (this$.isEmpty()) return null; return this$.get(-1); })(this);
  }

  toConst() {
    return this;
  }

  any(f) {
    const this$ = this;
    let r = this.eachWhile((item, i) => {
      return ((this$) => { if (sys.Func.call(f, item, sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()))) return "hit"; return null; })(this$);
    });
    return ((this$) => { if (r != null) return true; return false; })(this);
  }

  all(f) {
    const this$ = this;
    let r = this.eachWhile((item, i) => {
      return ((this$) => { if (sys.Func.call(f, item, sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()))) return null; return "miss"; })(this$);
    });
    return ((this$) => { if (r == null) return true; return false; })(this);
  }

  sort(f) {
    if (this.isEmpty()) {
      return this;
    }
    ;
    let gb = GridBuilder.make().copyMetaAndCols(this);
    let rows = this.toRows().dup().sort(f);
    return gb.addDictRows(rows).toGrid();
  }

  sortr(f) {
    if (this.isEmpty()) {
      return this;
    }
    ;
    let gb = GridBuilder.make().copyMetaAndCols(this);
    let rows = this.toRows().dup().sortr(f);
    return gb.addDictRows(rows).toGrid();
  }

  sortCol(col) {
    const this$ = this;
    if (this.isEmpty()) {
      return this;
    }
    ;
    let c = this.toCol(col, false);
    if (c == null) {
      return this;
    }
    ;
    return this.sort((a, b) => {
      return Etc.sortCompare(a.val(sys.ObjUtil.coerce(c, Col.type$)), b.val(sys.ObjUtil.coerce(c, Col.type$)));
    });
  }

  sortColr(col) {
    const this$ = this;
    if (this.isEmpty()) {
      return this;
    }
    ;
    let c = this.toCol(col, false);
    if (c == null) {
      return this;
    }
    ;
    return this.sortr((a, b) => {
      return Etc.sortCompare(a.val(sys.ObjUtil.coerce(c, Col.type$)), b.val(sys.ObjUtil.coerce(c, Col.type$)));
    });
  }

  sortDis() {
    const this$ = this;
    try {
      return this.sort((a, b) => {
        return Etc.compareDis(sys.ObjUtil.coerce(a.dis(), sys.Str.type$), sys.ObjUtil.coerce(b.dis(), sys.Str.type$));
      });
    }
    catch ($_u180) {
      $_u180 = sys.Err.make($_u180);
      if ($_u180 instanceof sys.Err) {
        let e = $_u180;
        ;
        return this.sort((a, b) => {
          return sys.ObjUtil.compare(a.dis(), b.dis());
        });
      }
      else {
        throw $_u180;
      }
    }
    ;
  }

  ids() {
    return sys.ObjUtil.coerce(this.colToList("id", Ref.type$), sys.Type.find("haystack::Ref[]"));
  }

  colToList(col, listOf) {
    if (listOf === undefined) listOf = sys.Obj.type$.toNullable();
    const this$ = this;
    let c = this.toCol(col);
    let capacity = 16;
    try {
      (capacity = this.size());
    }
    catch ($_u181) {
      $_u181 = sys.Err.make($_u181);
      if ($_u181 instanceof sys.Err) {
        let e = $_u181;
        ;
      }
      else {
        throw $_u181;
      }
    }
    ;
    let acc = sys.ObjUtil.coerce(sys.List.make(listOf, capacity), sys.Type.find("sys::Obj?[]"));
    this.each((row) => {
      acc.add(row.val(sys.ObjUtil.coerce(c, Col.type$)));
      return;
    });
    return acc;
  }

  find(f) {
    const this$ = this;
    return sys.ObjUtil.coerce(this.eachWhile((row, i) => {
      return ((this$) => { if (sys.Func.call(f, row, sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()))) return row; return null; })(this$);
    }), Row.type$.toNullable());
  }

  findIndex(f) {
    const this$ = this;
    return sys.ObjUtil.coerce(this.eachWhile((row, i) => {
      return sys.ObjUtil.coerce(((this$) => { if (sys.Func.call(f, row, sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()))) return sys.ObjUtil.coerce(i, sys.Int.type$.toNullable()); return null; })(this$), sys.Obj.type$.toNullable());
    }), sys.Int.type$.toNullable());
  }

  findAll(f) {
    let gb = GridBuilder.make().copyMetaAndCols(this);
    let rows = this.toRows().findAll(f);
    return gb.addDictRows(rows).toGrid();
  }

  filter(filter, cx) {
    if (cx === undefined) cx = null;
    const this$ = this;
    return this.findAll((row) => {
      return filter.matches(row, cx);
    });
  }

  getRange(r) {
    let gb = GridBuilder.make().copyMetaAndCols(this);
    let rows = this.toRows().getRange(r);
    return gb.addDictRows(rows).toGrid();
  }

  map(f) {
    const this$ = this;
    f.__returns = ((arg) => { let r = arg; if (r == null || r == sys.Void.type$ || !(r instanceof sys.Type)) r = null; return r; })(arguments[arguments.length - 1]);
    let newRows = sys.List.make(Dict.type$);
    let colNames = sys.List.make(sys.Str.type$);
    let colNamesMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    let numRows = 0;
    this.each((row, i) => {
      ((this$) => { let $_u184 = numRows; numRows = sys.Int.increment(numRows); return $_u184; })(this$);
      let newVal = sys.Func.call(f, row, sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
      if (newVal == null) {
        return;
      }
      ;
      let newRow = sys.ObjUtil.as(newVal, Dict.type$);
      if (newRow == null) {
        throw sys.Err.make(sys.Str.plus("Grid.map expects Dict, not ", sys.ObjUtil.typeof(newVal).name()));
      }
      ;
      newRows.add(sys.ObjUtil.coerce(newRow, Dict.type$));
      Etc.dictEach(sys.ObjUtil.coerce(newRow, Dict.type$), (v, n) => {
        if (colNamesMap.get(n) == null) {
          colNames.add(n);
          colNamesMap.set(n, n);
        }
        ;
        return;
      });
      return;
    });
    if (sys.ObjUtil.equals(numRows, 0)) {
      return this;
    }
    ;
    let gb = GridBuilder.make().setMeta(this.meta());
    colNames.each((n) => {
      let old = this$.col(n, false);
      gb.addCol(n, ((this$) => { let $_u185 = old; if ($_u185 == null) return null; return old.meta(); })(this$));
      return;
    });
    return gb.addDictRows(newRows).toGrid();
  }

  flatMap(f) {
    const this$ = this;
    f.__returns = ((arg) => { let r = arg; if (r == null || r == sys.Void.type$ || !(r instanceof sys.Type)) r = null; return r; })(arguments[arguments.length - 1]);
    let newRows = sys.List.make(Dict.type$);
    let colNames = sys.List.make(sys.Str.type$);
    let colNamesMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    let numRows = 0;
    this.each((row, i) => {
      ((this$) => { let $_u186 = numRows; numRows = sys.Int.increment(numRows); return $_u186; })(this$);
      let mapVals = sys.Func.call(f, row, sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
      if (mapVals == null) {
        return;
      }
      ;
      let mapRows = sys.ObjUtil.as(mapVals, sys.Type.find("sys::List"));
      if (mapRows == null) {
        throw sys.Err.make(sys.Str.plus("Grid.flatMap expects Dict[], not ", sys.ObjUtil.typeof(mapVals).name()));
      }
      ;
      mapRows.each((mapVal, j) => {
        if (mapVal == null) {
          return;
        }
        ;
        let mapRow = sys.ObjUtil.as(mapVal, Dict.type$);
        if (mapRow == null) {
          throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Grid.flatMap expects Dict[] (item ", sys.ObjUtil.coerce(j, sys.Obj.type$.toNullable())), ": "), sys.ObjUtil.typeof(mapVal).name()), ")"));
        }
        ;
        newRows.add(sys.ObjUtil.coerce(mapRow, Dict.type$));
        mapRow.each((v, n) => {
          if (colNamesMap.get(n) == null) {
            colNames.add(n);
            colNamesMap.set(n, n);
          }
          ;
          return;
        });
        return;
      });
      return;
    });
    if (sys.ObjUtil.equals(numRows, 0)) {
      return this;
    }
    ;
    let gb = GridBuilder.make().setMeta(this.meta());
    colNames.each((n) => {
      let old = this$.col(n, false);
      gb.addCol(n, ((this$) => { let $_u187 = old; if ($_u187 == null) return null; return old.meta(); })(this$));
      return;
    });
    return gb.addDictRows(newRows).toGrid();
  }

  mapToList(f) {
    const this$ = this;
    f.__returns = ((arg) => { let r = arg; if (r == null || r == sys.Void.type$ || !(r instanceof sys.Type)) r = null; return r; })(arguments[arguments.length - 1]);
    let list = sys.ObjUtil.coerce(sys.List.make(sys.Func.returns(f), this.size()), sys.Type.find("sys::Obj?[]"));
    this.each((row, i) => {
      list.add(sys.Func.call(f, row, sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())));
      return;
    });
    return list;
  }

  replace(from$, to) {
    const this$ = this;
    let cols = this.cols();
    let gb = GridBuilder.make().copyMetaAndCols(this);
    try {
      gb.capacity(this.size());
    }
    catch ($_u188) {
      $_u188 = sys.Err.make($_u188);
      if ($_u188 instanceof sys.Err) {
        let e = $_u188;
        ;
      }
      else {
        throw $_u188;
      }
    }
    ;
    this.each((row) => {
      let cells = sys.List.make(sys.Obj.type$.toNullable());
      cells.capacity(cols.size());
      cols.each((col) => {
        let val = row.val(col);
        if (sys.ObjUtil.equals(val, from$)) {
          (val = to);
        }
        ;
        cells.add(val);
        return;
      });
      gb.addRow(cells);
      return;
    });
    return gb.toGrid();
  }

  commit(diffs) {
    const this$ = this;
    if (sys.ObjUtil.compareNE(diffs.size(), this.size())) {
      throw sys.ArgErr.make("diff.size doesn't match");
    }
    ;
    let i = 0;
    return this.map((old) => {
      let diff = diffs.get(((this$) => { let $_u189 = i; i = sys.Int.increment(i); return $_u189; })(this$));
      let x = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
      x.ordered(true);
      old.each((v, n) => {
        x.set(n, v);
        return;
      });
      diff.each((v, n) => {
        if (sys.ObjUtil.equals(v, Remove.val())) {
          x.remove(n);
        }
        else {
          x.set(n, v);
        }
        ;
        return;
      });
      return Etc.makeDict(x);
    }, sys.Obj.type$.toNullable());
  }

  join(that, joinCol) {
    const this$ = this;
    let a = this;
    let aJoinCol = a.toCol(joinCol);
    let b = that;
    let bJoinCol = b.toCol(joinCol);
    let cols = sys.List.make(Col.type$);
    a.cols().each((c) => {
      let meta = c.meta();
      if (c === aJoinCol) {
        (meta = Etc.dictMerge(meta, bJoinCol.meta()));
      }
      ;
      cols.add(GbCol.make(-1, c.name(), meta));
      return;
    });
    b.cols().each((c) => {
      if (c === bJoinCol) {
        return;
      }
      ;
      let n = c.name();
      if (a.has(n)) {
        throw sys.Err.make(sys.Str.plus("Join column name conflict ", n));
      }
      ;
      cols.add(GbCol.make(-1, c.name(), c.meta()));
      return;
    });
    let bRows = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("haystack::Row")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Obj:haystack::Row]"));
    b.each((r) => {
      bRows.add(sys.ObjUtil.coerce(r.val(sys.ObjUtil.coerce(bJoinCol, Col.type$)), sys.Obj.type$), r);
      return;
    });
    let gb = GridBuilder.make().setMeta(Etc.dictMerge(a.meta(), b.meta()));
    cols.each((c) => {
      gb.addCol(c.name(), c.meta());
      return;
    });
    a.each((r) => {
      let cells = sys.List.make(sys.Obj.type$.toNullable());
      a.cols().each((c) => {
        cells.add(r.val(c));
        return;
      });
      let bRow = bRows.remove(sys.ObjUtil.coerce(r.val(sys.ObjUtil.coerce(aJoinCol, Col.type$)), sys.Obj.type$));
      b.cols().each((c) => {
        if (c === bJoinCol) {
          return;
        }
        ;
        if (bRow == null) {
          cells.add(null);
        }
        else {
          cells.add(bRow.val(c));
        }
        ;
        return;
      });
      gb.addRow(cells);
      return;
    });
    bRows.each((r) => {
      let cells = sys.List.make(sys.Obj.type$.toNullable());
      a.cols().each((c) => {
        if (c === aJoinCol) {
          cells.add(r.val(sys.ObjUtil.coerce(bJoinCol, Col.type$)));
        }
        else {
          cells.add(null);
        }
        ;
        return;
      });
      b.cols().each((c) => {
        if (c !== bJoinCol) {
          cells.add(r.val(c));
        }
        ;
        return;
      });
      gb.addRow(cells);
      return;
    });
    return gb.toGrid();
  }

  setMeta(meta) {
    let gb = GridBuilder.make().copyCols(this);
    gb.setMeta(Etc.makeDict(meta));
    return gb.addGridRows(this).toGrid();
  }

  addMeta(meta) {
    let gb = GridBuilder.make().copyCols(this);
    gb.setMeta(Etc.dictMerge(this.meta(), meta));
    return gb.addGridRows(this).toGrid();
  }

  addCol(name, meta, f) {
    const this$ = this;
    let gb = GridBuilder.make().setMeta(this.meta());
    this.cols().each((c) => {
      gb.addCol(c.name(), c.meta());
      return;
    });
    gb.addCol(name, meta);
    this.each((r, i) => {
      let cells = sys.List.make(sys.Obj.type$.toNullable());
      cells.capacity(gb.numCols());
      this$.cols().each((c) => {
        cells.add(r.val(c));
        return;
      });
      cells.add(sys.Func.call(f, r, sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())));
      gb.addRow(cells);
      return;
    });
    return gb.toGrid();
  }

  addCols(x) {
    const this$ = this;
    let a = this;
    let aCols = a.cols();
    let b = x;
    let bCols = b.cols();
    let newCols = GridBuilder.normColNames(a.colNames().dup().addAll(b.colNames()));
    let newRows = sys.List.make(sys.Type.find("sys::Obj?[]"));
    try {
      newRows.capacity(a.size());
    }
    catch ($_u190) {
      $_u190 = sys.Err.make($_u190);
      if ($_u190 instanceof sys.Err) {
        let e = $_u190;
        ;
      }
      else {
        throw $_u190;
      }
    }
    ;
    a.each((aRow, i) => {
      let newRow = sys.List.make(sys.Obj.type$.toNullable());
      newRow.size(newCols.size());
      aCols.each((c, j) => {
        newRow.set(j, aRow.val(c));
        return;
      });
      newRows.add(newRow);
      return;
    });
    b.each((bRow, i) => {
      let newRow = newRows.getSafe(i);
      if (newRow == null) {
        return;
      }
      ;
      bCols.each((c, j) => {
        newRow.set(sys.Int.plus(aCols.size(), j), bRow.val(c));
        return;
      });
      return;
    });
    let gb = GridBuilder.make().setMeta(a.meta());
    gb.capacity(newRows.size());
    aCols.each((c, j) => {
      gb.addCol(c.name(), c.meta());
      return;
    });
    bCols.each((c, j) => {
      gb.addCol(newCols.get(sys.Int.plus(aCols.size(), j)), c.meta());
      return;
    });
    newRows.each((row) => {
      gb.addRow(row);
      return;
    });
    return gb.toGrid();
  }

  renameCol(oldCol, newName) {
    const this$ = this;
    let x = this.toCol(oldCol);
    let gb = GridBuilder.make().setMeta(this.meta());
    let cols = this.cols();
    cols.each((c) => {
      if (c !== x) {
        gb.addCol(c.name(), c.meta());
      }
      else {
        gb.addCol(newName, c.meta());
      }
      ;
      return;
    });
    this.each((r, i) => {
      let cells = sys.List.make(sys.Obj.type$.toNullable());
      cells.capacity(gb.numCols());
      cols.each((c) => {
        cells.add(r.val(c));
        return;
      });
      gb.addRow(cells);
      return;
    });
    return gb.toGrid();
  }

  renameCols(oldToNew) {
    const this$ = this;
    if (oldToNew.isEmpty()) {
      return this;
    }
    ;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    oldToNew.each((n, o) => {
      let c = this$.toCol(o, false);
      if (c != null) {
        map.set(c.name(), n);
      }
      ;
      return;
    });
    let gb = GridBuilder.make().setMeta(this.meta());
    let cols = this.cols();
    cols.each((c) => {
      let newName = ((this$) => { let $_u191 = map.get(c.name()); if ($_u191 != null) return $_u191; return c.name(); })(this$);
      gb.addCol(sys.ObjUtil.coerce(newName, sys.Str.type$), c.meta());
      return;
    });
    this.each((r, i) => {
      let cells = sys.List.make(sys.Obj.type$.toNullable());
      cells.capacity(gb.numCols());
      cols.each((c) => {
        cells.add(r.val(c));
        return;
      });
      gb.addRow(cells);
      return;
    });
    return gb.toGrid();
  }

  reorderCols(cols) {
    const this$ = this;
    let gb = GridBuilder.make().setMeta(this.meta());
    let newOrder = sys.List.make(Col.type$);
    newOrder.capacity(cols.size());
    cols.each((col) => {
      let c = this$.toCol(col, false);
      if (c == null) {
        return;
      }
      ;
      newOrder.add(sys.ObjUtil.coerce(c, Col.type$));
      gb.addCol(c.name(), c.meta());
      return;
    });
    this.each((r, i) => {
      let cells = sys.List.make(sys.Obj.type$.toNullable());
      cells.capacity(gb.numCols());
      newOrder.each((c) => {
        cells.add(r.val(c));
        return;
      });
      gb.addRow(cells);
      return;
    });
    return gb.toGrid();
  }

  setColMeta(col, meta) {
    let c = this.toCol(col, false);
    if (c == null) {
      return this;
    }
    ;
    let gb = GridBuilder.make().copyMetaAndCols(this);
    gb.setColMeta(c.name(), Etc.makeDict(meta));
    return gb.addGridRows(this).toGrid();
  }

  addColMeta(col, meta) {
    let c = this.toCol(col, false);
    if (c == null) {
      return this;
    }
    ;
    let gb = GridBuilder.make().copyMetaAndCols(this);
    gb.setColMeta(c.name(), Etc.dictMerge(c.meta(), meta));
    return gb.addGridRows(this).toGrid();
  }

  removeCol(col) {
    const this$ = this;
    let x = this.toCol(col, false);
    if (x == null) {
      return this;
    }
    ;
    let gb = GridBuilder.make().setMeta(this.meta());
    let cols = this.cols();
    cols.each((c) => {
      if (c !== x) {
        gb.addCol(c.name(), c.meta());
      }
      ;
      return;
    });
    this.each((r, i) => {
      let cells = sys.List.make(sys.Obj.type$.toNullable());
      cells.capacity(gb.numCols());
      cols.each((c) => {
        if (c !== x) {
          cells.add(r.val(c));
        }
        ;
        return;
      });
      gb.addRow(cells);
      return;
    });
    return gb.toGrid();
  }

  keepCols(toKeep) {
    const this$ = this;
    let toKeepNames = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Col"));
    toKeep.each((x) => {
      let c = this$.toCol(x, false);
      if (c != null) {
        toKeepNames.set(c.name(), sys.ObjUtil.coerce(c, Col.type$));
      }
      ;
      return;
    });
    let toRemove = sys.List.make(Col.type$);
    this.cols().each((c) => {
      if (toKeepNames.get(c.name()) == null) {
        toRemove.add(c);
      }
      ;
      return;
    });
    return this.removeCols(toRemove);
  }

  removeCols(toRemove) {
    const this$ = this;
    if (toRemove.isEmpty()) {
      return this;
    }
    ;
    let x = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Col"));
    toRemove.each((col) => {
      let c = this$.toCol(col, false);
      if (c != null) {
        x.set(c.name(), sys.ObjUtil.coerce(c, Col.type$));
      }
      ;
      return;
    });
    if (x.isEmpty()) {
      return this;
    }
    ;
    let gb = GridBuilder.make().setMeta(this.meta());
    let cols = this.cols();
    cols.each((c) => {
      if (!x.containsKey(c.name())) {
        gb.addCol(c.name(), c.meta());
      }
      ;
      return;
    });
    this.each((r, i) => {
      let cells = sys.List.make(sys.Obj.type$.toNullable());
      cells.capacity(gb.numCols());
      cols.each((c) => {
        if (!x.containsKey(c.name())) {
          cells.add(r.val(c));
        }
        ;
        return;
      });
      gb.addRow(cells);
      return;
    });
    return gb.toGrid();
  }

  colsToLocale() {
    const this$ = this;
    let gb = GridBuilder.make().setMeta(this.meta());
    this.cols().each((c) => {
      let meta = c.meta();
      if (meta.missing("dis")) {
        (meta = Etc.dictSet(meta, "dis", Etc.tagToLocale(c.name())));
      }
      ;
      gb.addCol(c.name(), meta);
      return;
    });
    return gb.addGridRows(this).toGrid();
  }

  unique(keyCols) {
    const this$ = this;
    let cols = this.toCols(keyCols);
    let seen = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Str"));
    return this.findAll((row) => {
      let key = sys.List.make(sys.Obj.type$.toNullable());
      key.capacity(cols.size());
      cols.each((col) => {
        key.add(row.get(col.name()));
        return;
      });
      (key = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(key), sys.Type.find("sys::Obj?[]")));
      if (seen.get(key) != null) {
        return false;
      }
      ;
      seen.set(key, "seen");
      return true;
    });
  }

  transpose() {
    const this$ = this;
    let srcKeyCol = this.cols().first();
    let srcTransposedDis = sys.ObjUtil.as(srcKeyCol.meta().get("transposedDis"), sys.Str.type$);
    let gb = GridBuilder.make();
    gb.setMeta(this.meta());
    if (srcTransposedDis == null) {
      gb.addCol("dis", sys.Map.__fromLiteral(["transposedDis"], [srcKeyCol.dis()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    }
    else {
      gb.addCol("dis", sys.Map.__fromLiteral(["dis"], [srcTransposedDis], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?")));
    }
    ;
    this.each((row, i) => {
      let name = sys.Str.plus("v", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
      let dis = row.dis(srcKeyCol.name(), name);
      gb.addCol(name, sys.Map.__fromLiteral(["dis"], [dis], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?")));
      return;
    });
    this.cols().each((col, i) => {
      if (sys.ObjUtil.equals(i, 0)) {
        return;
      }
      ;
      let row = sys.List.make(sys.Obj.type$.toNullable());
      row.capacity(gb.numCols());
      row.add(col.dis());
      this$.each((srcRow) => {
        row.add(srcRow.val(col));
        return;
      });
      gb.addRow(row);
      return;
    });
    return gb.toGrid();
  }

  toCols(cols) {
    const this$ = this;
    return sys.ObjUtil.coerce(cols.map((x) => {
      return this$.toCol(x);
    }, sys.Obj.type$.toNullable()), sys.Type.find("haystack::Col[]"));
  }

  toCol(c, checked) {
    if (checked === undefined) checked = true;
    if (sys.ObjUtil.is(c, sys.Str.type$)) {
      return this.col(sys.ObjUtil.coerce(c, sys.Str.type$), checked);
    }
    ;
    if (sys.ObjUtil.is(c, Col.type$)) {
      return this.col(sys.ObjUtil.coerce(c, Col.type$).name(), checked);
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Expected Col or Str col name, not '", sys.ObjUtil.typeof(c)), "'"));
  }

  dump(out, opts) {
    if (out === undefined) out = sys.Env.cur().out();
    if (opts === undefined) opts = null;
    const this$ = this;
    Grid.dumpMeta(out, "Grid:", this.meta());
    this.cols().each((col) => {
      Grid.dumpMeta(out, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", col.name()), " \""), col.dis()), "\":"), col.meta());
      return;
    });
    let lines = sys.List.make(sys.Str.type$).fill("", sys.Int.plus(2, this.size()));
    this.cols().each((c) => {
      Grid.dumpAddCol(this$, c, lines);
      return;
    });
    if ((opts == null || sys.ObjUtil.compareNE(opts.get("noClip"), true))) {
      (lines = sys.ObjUtil.coerce(lines.map((line) => {
        return ((this$) => { if (sys.ObjUtil.compareLE(sys.Str.size(line), 125)) return line; return sys.Str.plus(sys.Str.getRange(line, sys.Range.make(0, 125)), "..."); })(this$);
      }, sys.Obj.type$.toNullable()), sys.Type.find("sys::Str[]")));
    }
    ;
    lines.each((line) => {
      out.printLine(line);
      return;
    });
    return;
  }

  static dumpMeta(out, title, meta) {
    const this$ = this;
    if (meta.isEmpty()) {
      return;
    }
    ;
    out.printLine(title);
    Etc.dictNames(meta).sort().each((n) => {
      out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(" ", n), ": "), meta.get(n)));
      return;
    });
    return;
  }

  static dumpAddCol(g, c, lines) {
    const this$ = this;
    let dips = sys.List.make(sys.Str.type$);
    g.each((r) => {
      dips.add(Grid.toDis(r, c));
      return;
    });
    let width = sys.Str.size(c.name());
    dips.each((d) => {
      (width = sys.Int.max(width, sys.Str.size(d)));
      return;
    });
    let sep = ((this$) => { if (sys.Str.isEmpty(lines.first())) return ""; return "  "; })(this);
    let i = 0;
    ((this$) => { let $_u196 = lines; let $_u197 = i; let $_u194 = sys.Str.plus(lines.get(i), sys.Str.plus(sep, sys.Str.padr(c.name(), width))); $_u196.set($_u197, $_u194); return $_u194; })(this);
    ((this$) => { let $_u198 = i; i = sys.Int.increment(i); return $_u198; })(this);
    ((this$) => { let $_u201 = lines; let $_u202 = i; let $_u199 = sys.Str.plus(lines.get(i), sys.Str.plus(sep, sys.Str.replace(sys.Str.spaces(width), " ", "-"))); $_u201.set($_u202, $_u199); return $_u199; })(this);
    ((this$) => { let $_u203 = i; i = sys.Int.increment(i); return $_u203; })(this);
    dips.each((d) => {
      ((this$) => { let $_u206 = lines; let $_u207 = i; let $_u204 = sys.Str.plus(lines.get(i), sys.Str.plus(sep, sys.Str.padr(d, width))); $_u206.set($_u207, $_u204); return $_u204; })(this$);
      ((this$) => { let $_u208 = i; i = sys.Int.increment(i); return $_u208; })(this$);
      return;
    });
    return;
  }

  static toDis(r, c) {
    let val = r.val(c);
    if (val === Marker.val()) {
      return "M";
    }
    ;
    if (val === Remove.val()) {
      return "R";
    }
    ;
    if ((sys.ObjUtil.is(val, sys.DateTime.type$) && c.meta().get("format") == null)) {
      return sys.ObjUtil.coerce(val, sys.DateTime.type$).toLocale("DD-MMM-YY hh:mm");
    }
    ;
    let s = r.dis(c.name());
    return sys.ObjUtil.coerce(s, sys.Str.type$);
  }

}

class GbGrid extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GbGrid.type$; }

  addColMeta() { return Grid.prototype.addColMeta.apply(this, arguments); }

  colNames() { return Grid.prototype.colNames.apply(this, arguments); }

  colToList() { return Grid.prototype.colToList.apply(this, arguments); }

  replace() { return Grid.prototype.replace.apply(this, arguments); }

  commit() { return Grid.prototype.commit.apply(this, arguments); }

  toConst() { return Grid.prototype.toConst.apply(this, arguments); }

  findAll() { return Grid.prototype.findAll.apply(this, arguments); }

  keepCols() { return Grid.prototype.keepCols.apply(this, arguments); }

  colsToLocale() { return Grid.prototype.colsToLocale.apply(this, arguments); }

  renameCol() { return Grid.prototype.renameCol.apply(this, arguments); }

  incomplete() { return Grid.prototype.incomplete.apply(this, arguments); }

  toCol() { return Grid.prototype.toCol.apply(this, arguments); }

  find() { return Grid.prototype.find.apply(this, arguments); }

  getRange() { return Grid.prototype.getRange.apply(this, arguments); }

  has() { return Grid.prototype.has.apply(this, arguments); }

  join() { return Grid.prototype.join.apply(this, arguments); }

  sortr() { return Grid.prototype.sortr.apply(this, arguments); }

  isIncomplete() { return Grid.prototype.isIncomplete.apply(this, arguments); }

  all() { return Grid.prototype.all.apply(this, arguments); }

  toCols() { return Grid.prototype.toCols.apply(this, arguments); }

  last() { return Grid.prototype.last.apply(this, arguments); }

  setColMeta() { return Grid.prototype.setColMeta.apply(this, arguments); }

  isErr() { return Grid.prototype.isErr.apply(this, arguments); }

  addCol() { return Grid.prototype.addCol.apply(this, arguments); }

  sort() { return Grid.prototype.sort.apply(this, arguments); }

  flatMap() { return Grid.prototype.flatMap.apply(this, arguments); }

  renameCols() { return Grid.prototype.renameCols.apply(this, arguments); }

  removeCol() { return Grid.prototype.removeCol.apply(this, arguments); }

  sortColr() { return Grid.prototype.sortColr.apply(this, arguments); }

  addCols() { return Grid.prototype.addCols.apply(this, arguments); }

  unique() { return Grid.prototype.unique.apply(this, arguments); }

  ids() { return Grid.prototype.ids.apply(this, arguments); }

  addMeta() { return Grid.prototype.addMeta.apply(this, arguments); }

  sortDis() { return Grid.prototype.sortDis.apply(this, arguments); }

  setMeta() { return Grid.prototype.setMeta.apply(this, arguments); }

  sortCol() { return Grid.prototype.sortCol.apply(this, arguments); }

  missing() { return Grid.prototype.missing.apply(this, arguments); }

  dump() { return Grid.prototype.dump.apply(this, arguments); }

  map() { return Grid.prototype.map.apply(this, arguments); }

  removeCols() { return Grid.prototype.removeCols.apply(this, arguments); }

  colDisNames() { return Grid.prototype.colDisNames.apply(this, arguments); }

  isEmpty() { return Grid.prototype.isEmpty.apply(this, arguments); }

  any() { return Grid.prototype.any.apply(this, arguments); }

  findIndex() { return Grid.prototype.findIndex.apply(this, arguments); }

  filter() { return Grid.prototype.filter.apply(this, arguments); }

  isHisGrid() { return Grid.prototype.isHisGrid.apply(this, arguments); }

  mapToList() { return Grid.prototype.mapToList.apply(this, arguments); }

  transpose() { return Grid.prototype.transpose.apply(this, arguments); }

  reorderCols() { return Grid.prototype.reorderCols.apply(this, arguments); }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #cols = null;

  cols() { return this.#cols; }

  __cols(it) { if (it === undefined) return this.#cols; else this.#cols = it; }

  #colsByName = null;

  colsByName() { return this.#colsByName; }

  __colsByName(it) { if (it === undefined) return this.#colsByName; else this.#colsByName = it; }

  #rows = null;

  rows() { return this.#rows; }

  __rows(it) { if (it === undefined) return this.#rows; else this.#rows = it; }

  static make(meta, cols, colsByName, rows) {
    const $self = new GbGrid();
    GbGrid.make$($self, meta, cols, colsByName, rows);
    return $self;
  }

  static make$($self, meta, cols, colsByName, rows) {
    $self.#meta = meta;
    $self.#cols = sys.ObjUtil.coerce(((this$) => { let $_u209 = cols; if ($_u209 == null) return null; return sys.ObjUtil.toImmutable(cols); })($self), sys.Type.find("haystack::Col[]"));
    $self.#colsByName = sys.ObjUtil.coerce(((this$) => { let $_u210 = colsByName; if ($_u210 == null) return null; return sys.ObjUtil.toImmutable(colsByName); })($self), sys.Type.find("[sys::Str:haystack::GbCol]"));
    $self.#rows = sys.ObjUtil.coerce(((this$) => { let $_u211 = rows; if ($_u211 == null) return null; return sys.ObjUtil.toImmutable(rows); })($self), sys.Type.find("haystack::GbRow[]"));
    return;
  }

  col(name, checked) {
    if (checked === undefined) checked = true;
    let col = this.#colsByName.get(name);
    if ((col != null || !checked)) {
      return col;
    }
    ;
    throw UnknownNameErr.make(name);
  }

  each(f) {
    this.#rows.each(f);
    return;
  }

  eachWhile(f) {
    return this.#rows.eachWhile(f);
  }

  size() {
    return this.#rows.size();
  }

  get(index) {
    return this.#rows.get(index);
  }

  getSafe(index) {
    return this.#rows.getSafe(index);
  }

  first() {
    return this.#rows.first();
  }

  toRows() {
    return this.#rows;
  }

}

class GbCol extends Col {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GbCol.type$; }

  #index = 0;

  index() { return this.#index; }

  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  static make(i, n, m) {
    const $self = new GbCol();
    GbCol.make$($self, i, n, m);
    return $self;
  }

  static make$($self, i, n, m) {
    Col.make$($self);
    $self.#index = i;
    $self.#name = n;
    $self.#meta = m;
    return;
  }

}

class GbRow extends Row {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GbRow.type$; }

  #gridRef = null;

  gridRef() { return this.#gridRef; }

  __gridRef(it) { if (it === undefined) return this.#gridRef; else this.#gridRef = it; }

  #cells = null;

  cells() { return this.#cells; }

  __cells(it) { if (it === undefined) return this.#cells; else this.#cells = it; }

  static make(r, c) {
    const $self = new GbRow();
    GbRow.make$($self, r, c);
    return $self;
  }

  static make$($self, r, c) {
    Row.make$($self);
    $self.#gridRef = r;
    $self.#cells = sys.ObjUtil.coerce(((this$) => { let $_u212 = c; if ($_u212 == null) return null; return sys.ObjUtil.toImmutable(c); })($self), sys.Type.find("sys::Obj?[]?"));
    return;
  }

  grid() {
    return sys.ObjUtil.coerce(this.#gridRef.val(), Grid.type$);
  }

  val(col) {
    return this.#cells.get(sys.ObjUtil.coerce(col, GbCol.type$).index());
  }

}

class Filetype {
  constructor() {
    const this$ = this;
  }

  typeof() { return Filetype.type$; }

  toStr() { return Dict.prototype.toStr.apply(this, arguments); }

  dis() { return Dict.prototype.dis.apply(this, arguments); }

  id() { return Dict.prototype.id.apply(this, arguments); }

  _id() { return Dict.prototype._id.apply(this, arguments); }

  map() { return Dict.prototype.map.apply(this, arguments); }

  isText() {
    return (sys.ObjUtil.equals(this.mimeType().mediaType(), "text") || sys.Str.endsWith(this.mimeType().subType(), "json"));
  }

  hasWriter() {
    return this.has("writer");
  }

  hasReader() {
    return this.has("reader");
  }

  writerType() {
    if (this.has("writer")) {
      return sys.Type.find(sys.ObjUtil.coerce(sys.ObjUtil.trap(this, "writer", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$));
    }
    ;
    let $_u213 = this.name();
    if (sys.ObjUtil.equals($_u213, "zinc")) {
      return ZincWriter.type$;
    }
    else if (sys.ObjUtil.equals($_u213, "trio")) {
      return TrioWriter.type$;
    }
    else if (sys.ObjUtil.equals($_u213, "json")) {
      return JsonWriter.type$;
    }
    else if (sys.ObjUtil.equals($_u213, "turtle")) {
      return sys.Type.find("def::TurtleWriter");
    }
    else if (sys.ObjUtil.equals($_u213, "jsonld")) {
      return sys.Type.find("def::JsonLdWriter");
    }
    else if (sys.ObjUtil.equals($_u213, "csv")) {
      return CsvWriter.type$;
    }
    ;
    return null;
  }

  readerType() {
    return ((this$) => { if (this$.has("reader")) return sys.Type.find(sys.ObjUtil.coerce(sys.ObjUtil.trap(this$, "reader", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$)); return null; })(this);
  }

  writer(out, opts) {
    if (opts === undefined) opts = null;
    let type = ((this$) => { let $_u215 = this$.writerType(); if ($_u215 != null) return $_u215; throw sys.Err.make(sys.Str.plus("No writer defined for filetype ", this$.name())); })(this);
    let ctor = type.method("make");
    if (sys.ObjUtil.equals(ctor.params().size(), 1)) {
      return sys.ObjUtil.coerce(ctor.call(out), GridWriter.type$);
    }
    ;
    if (sys.ObjUtil.equals(ctor.params().size(), 2)) {
      return sys.ObjUtil.coerce(ctor.call(out, ((this$) => { let $_u216 = opts; if ($_u216 != null) return $_u216; return Etc.emptyDict(); })(this)), GridWriter.type$);
    }
    ;
    throw sys.Err.make(sys.Str.plus("Invalid GridWriter.make signature: ", ctor));
  }

  reader(in$, opts) {
    if (opts === undefined) opts = null;
    let type = ((this$) => { let $_u217 = this$.readerType(); if ($_u217 != null) return $_u217; throw sys.Err.make(sys.Str.plus("No reader defined for filetype ", this$.name())); })(this);
    let ctor = type.method("make");
    if (sys.ObjUtil.equals(ctor.params().size(), 1)) {
      return sys.ObjUtil.coerce(ctor.call(in$), GridReader.type$);
    }
    ;
    if (sys.ObjUtil.equals(ctor.params().size(), 2)) {
      return sys.ObjUtil.coerce(ctor.call(in$, ((this$) => { let $_u218 = opts; if ($_u218 != null) return $_u218; return Etc.emptyDict(); })(this)), GridReader.type$);
    }
    ;
    throw sys.Err.make(sys.Str.plus("Invalid GridReader.make signature: ", ctor));
  }

  ioOpts(ns, mime, arg, settings) {
    if (sys.ObjUtil.equals(this.name(), "json")) {
      let v3 = false;
      if (sys.ObjUtil.equals(((this$) => { let $_u219 = settings.get("jsonVersion"); if ($_u219 == null) return null; return sys.ObjUtil.toStr(settings.get("jsonVersion")); })(this), "3")) {
        (v3 = true);
      }
      ;
      if (arg.has("v3")) {
        (v3 = true);
      }
      ;
      if (arg.has("v4")) {
        (v3 = false);
      }
      ;
      if (mime != null) {
        let mimeVersion = mime.params().get("version");
        if (sys.ObjUtil.equals(mimeVersion, "3")) {
          (v3 = true);
        }
        ;
        if (sys.ObjUtil.equals(mimeVersion, "4")) {
          (v3 = false);
        }
        ;
      }
      ;
      if (v3) {
        return Etc.dictMerge(arg, Etc.makeDict2("ns", ns, "v3", Marker.val()));
      }
      ;
    }
    ;
    return Etc.dictSet(arg, "ns", ns);
  }

  fileExt() {
    return sys.ObjUtil.coerce(this.get("fileExt", this.name()), sys.Str.type$);
  }

  icon() {
    return sys.ObjUtil.coerce(this.get("icon", "question"), sys.Str.type$);
  }

  isView() {
    return (sys.ObjUtil.equals(this.name(), "pdf") || sys.ObjUtil.equals(this.name(), "svg") || sys.ObjUtil.equals(this.name(), "html"));
  }

}

class Symbol extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Symbol.type$; }

  #str = null;

  str() { return this.#str; }

  __str(it) { if (it === undefined) return this.#str; else this.#str = it; }

  static fits(type) {
    return (type === TagSymbol.type$ || type === ConjunctSymbol.type$ || type === KeySymbol.type$);
  }

  static fromStr(s, checked) {
    if (checked === undefined) checked = true;
    if (checked) {
      return Symbol.parse(s);
    }
    ;
    try {
      return Symbol.parse(s);
    }
    catch ($_u220) {
      $_u220 = sys.Err.make($_u220);
      if ($_u220 instanceof sys.Err) {
        let e = $_u220;
        ;
        return null;
      }
      else {
        throw $_u220;
      }
    }
    ;
  }

  static parse(s) {
    if (sys.Str.isEmpty(s)) {
      throw sys.ParseErr.make("empty str");
    }
    ;
    if (!sys.Int.isLower(sys.Str.get(s, 0))) {
      throw sys.ParseErr.make(sys.Str.plus("invalid start char: ", s));
    }
    ;
    let colon = -1;
    let dot = -1;
    let dash = -1;
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(s)); i = sys.Int.increment(i)) {
      let c = sys.Str.get(s, i);
      if (sys.ObjUtil.equals(c, 58)) {
        if (sys.ObjUtil.compareGE(colon, 0)) {
          throw sys.ParseErr.make(sys.Str.plus("too many colons: ", s));
        }
        ;
        (colon = i);
      }
      else {
        if (sys.ObjUtil.equals(c, 46)) {
          if (sys.ObjUtil.compareGE(dot, 0)) {
            throw sys.ParseErr.make(sys.Str.plus("too many dots: ", s));
          }
          ;
          (dot = i);
        }
        else {
          if (sys.ObjUtil.equals(c, 45)) {
            (dash = i);
          }
          else {
            if (!Symbol.isTagChar(c)) {
              throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("invalid char ", sys.Str.toCode(sys.Int.toChar(c), sys.ObjUtil.coerce(39, sys.Int.type$.toNullable()))), ": "), s));
            }
            ;
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    if (sys.ObjUtil.compareGT(dot, 0)) {
      throw sys.ParseErr.make(sys.Str.plus("compose symbols deprecated: ", s));
    }
    ;
    if (sys.ObjUtil.compareGT(colon, 0)) {
      return KeySymbol.make(s, Symbol.substr(s, sys.Range.make(0, colon, true)), Symbol.substr(s, sys.Range.make(sys.Int.plus(colon, 1), -1)));
    }
    ;
    if (sys.ObjUtil.compareGT(dash, 0)) {
      return ConjunctSymbol.make(s, sys.Str.split(s, sys.ObjUtil.coerce(45, sys.Int.type$.toNullable())));
    }
    ;
    return TagSymbol.make(s);
  }

  static substr(str, r) {
    let sub = sys.Str.getRange(str, r);
    if ((!sys.Int.isLower(sys.Str.get(sub, 0)) || !Symbol.isTagChar(sys.Str.get(sub, -1)))) {
      throw sys.ParseErr.make(sys.Str.plus("invalid name part: ", str));
    }
    ;
    return sys.Str.getRange(str, r);
  }

  static isTagChar(c) {
    return (sys.Int.isAlphaNum(c) || sys.ObjUtil.equals(c, 95));
  }

  static make(str) {
    const $self = new Symbol();
    Symbol.make$($self, str);
    return $self;
  }

  static make$($self, str) {
    $self.#str = str;
    return;
  }

  hash() {
    return sys.Str.hash(this.#str);
  }

  equals(that) {
    return (sys.ObjUtil.is(that, Symbol.type$) && sys.ObjUtil.equals(this.toStr(), sys.ObjUtil.toStr(that)));
  }

  toStr() {
    return this.#str;
  }

  toCode() {
    return sys.StrBuf.make(sys.Int.plus(1, sys.Str.size(this.#str))).addChar(94).add(this.#str).toStr();
  }

  static toList(val) {
    if (val == null) {
      return sys.ObjUtil.coerce(Symbol.type$.emptyList(), sys.Type.find("haystack::Symbol[]"));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(val, sys.Type.find("haystack::Symbol[]"));
    }
    ;
    if (sys.ObjUtil.is(val, Symbol.type$)) {
      return sys.List.make(Symbol.type$, [sys.ObjUtil.coerce(val, Symbol.type$)]);
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("Cannot convert to Symbol[]: ", sys.ObjUtil.typeof(val)));
  }

}

class SymbolType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SymbolType.type$; }

  static tag() { return SymbolType.vals().get(0); }

  static conjunct() { return SymbolType.vals().get(1); }

  static key() { return SymbolType.vals().get(2); }

  static #vals = undefined;

  isTag() {
    return this === SymbolType.tag();
  }

  isConjunct() {
    return this === SymbolType.conjunct();
  }

  isTerm() {
    return (this.isTag() || this.isConjunct());
  }

  isKey() {
    return this === SymbolType.key();
  }

  static make($ordinal, $name) {
    const $self = new SymbolType();
    SymbolType.make$($self, $ordinal, $name);
    return $self;
  }

  static make$($self, $ordinal, $name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked = true) {
    return sys.Enum.doFromStr(SymbolType.type$, SymbolType.vals(), name$, checked);
  }

  static vals() {
    if (SymbolType.#vals == null) {
      SymbolType.#vals = sys.List.make(SymbolType.type$, [
        SymbolType.make(0, "tag",),
        SymbolType.make(1, "conjunct",),
        SymbolType.make(2, "key",),
      ]).toImmutable();
    }
    return SymbolType.#vals;
  }

  static static$init() {
    const $_u221 = SymbolType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class TagSymbol extends Symbol {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TagSymbol.type$; }

  static make(str) {
    const $self = new TagSymbol();
    TagSymbol.make$($self, str);
    return $self;
  }

  static make$($self, str) {
    Symbol.make$($self, str);
    return;
  }

  type() {
    return SymbolType.tag();
  }

  name() {
    return this.str();
  }

  size() {
    return 0;
  }

  part(i) {
    throw sys.UnsupportedErr.make(this.toStr());
  }

  eachPart(f) {
    return;
  }

  hasTermName(name) {
    return sys.ObjUtil.equals(this.name(), name);
  }

  hasTerm(dict) {
    return dict.has(this.name());
  }

}

class ConjunctSymbol extends Symbol {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConjunctSymbol.type$; }

  #parts = null;

  parts() { return this.#parts; }

  __parts(it) { if (it === undefined) return this.#parts; else this.#parts = it; }

  static make(str, parts) {
    const $self = new ConjunctSymbol();
    ConjunctSymbol.make$($self, str, parts);
    return $self;
  }

  static make$($self, str, parts) {
    Symbol.make$($self, str);
    for (let i = 0; sys.ObjUtil.compareLT(i, parts.size()); i = sys.Int.increment(i)) {
      let part = parts.get(i);
      if (sys.Str.isEmpty(part)) {
        throw sys.ParseErr.make(sys.Str.plus("empty conjunct name: ", str));
      }
      ;
      if (!sys.Int.isLower(sys.Str.get(part, 0))) {
        throw sys.ParseErr.make(sys.Str.plus("invalid conjunct name: ", str));
      }
      ;
    }
    ;
    $self.#parts = sys.ObjUtil.coerce(((this$) => { let $_u222 = parts; if ($_u222 == null) return null; return sys.ObjUtil.toImmutable(parts); })($self), sys.Type.find("sys::Str[]"));
    return;
  }

  type() {
    return SymbolType.conjunct();
  }

  name() {
    return this.str();
  }

  size() {
    return this.#parts.size();
  }

  part(i) {
    return this.#parts.get(i);
  }

  eachPart(f) {
    this.#parts.each(f);
    return;
  }

  hasTermName(name) {
    return this.#parts.contains(name);
  }

  hasTerm(dict) {
    const this$ = this;
    return this.#parts.all((p) => {
      return dict.has(p);
    });
  }

}

class KeySymbol extends Symbol {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return KeySymbol.type$; }

  #feature = null;

  feature() { return this.#feature; }

  __feature(it) { if (it === undefined) return this.#feature; else this.#feature = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  static make(str, feature, name) {
    const $self = new KeySymbol();
    KeySymbol.make$($self, str, feature, name);
    return $self;
  }

  static make$($self, str, feature, name) {
    Symbol.make$($self, str);
    $self.#feature = feature;
    $self.#name = name;
    return;
  }

  type() {
    return SymbolType.key();
  }

  size() {
    return 2;
  }

  part(i) {
    if (sys.ObjUtil.equals(i, 0)) {
      return this.#feature;
    }
    ;
    if (sys.ObjUtil.equals(i, 1)) {
      return this.#name;
    }
    ;
    throw sys.IndexErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("part(", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), "): "), this));
  }

  eachPart(f) {
    sys.Func.call(f, this.#feature);
    sys.Func.call(f, this.#name);
    return;
  }

  hasTermName(name) {
    return false;
  }

  hasTerm(dict) {
    return false;
  }

}

class NA extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NA.type$; }

  static #val = undefined;

  static val() {
    if (NA.#val === undefined) {
      NA.static$init();
      if (NA.#val === undefined) NA.#val = null;
    }
    return NA.#val;
  }

  static fromStr(s) {
    return NA.val();
  }

  static make() {
    const $self = new NA();
    NA.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  toStr() {
    return "NA";
  }

  static static$init() {
    NA.#val = NA.make();
    return;
  }

}

class Feature {
  constructor() {
    const this$ = this;
  }

  typeof() { return Feature.type$; }

}

class WebOpUtil {
  constructor() {
    const this$ = this;
  }

  typeof() { return WebOpUtil.type$; }

  static #mimeZinc = undefined;

  static mimeZinc() {
    if (WebOpUtil.#mimeZinc === undefined) {
      WebOpUtil.static$init();
      if (WebOpUtil.#mimeZinc === undefined) WebOpUtil.#mimeZinc = null;
    }
    return WebOpUtil.#mimeZinc;
  }

  toFiletype(mime) {
    return this.ns().filetype(mime.noParams().toStr(), false);
  }

  ioOpts(filetype, mime) {
    return filetype.ioOpts(this.ns(), mime, Etc.emptyDict(), Etc.emptyDict());
  }

  doReadReq(req, res) {
    if (req.isGet()) {
      return this.doReadReqGet(req, res);
    }
    ;
    if (req.isPost()) {
      return this.doReadReqPost(req, res);
    }
    ;
    res.sendErr(501, sys.Str.plus("", sys.Str.upper(req.method())));
    return null;
  }

  doReadReqGet(req, res) {
    const this$ = this;
    let tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    req.uri().query().each((valStr, key) => {
      let val = null;
      try {
        (val = ZincReader.make(sys.Str.in(valStr)).readVal());
      }
      catch ($_u223) {
        (val = valStr);
      }
      ;
      tags.set(key, sys.ObjUtil.coerce(val, sys.Obj.type$));
      return;
    });
    return Etc.makeMapGrid(null, tags);
  }

  doReadReqPost(req, res) {
    let mime = sys.MimeType.fromStr(sys.ObjUtil.coerce(((this$) => { let $_u224 = req.headers().get("Content-Type"); if ($_u224 != null) return $_u224; return ""; })(this), sys.Str.type$), false);
    if (mime == null) {
      res.sendErr(415, "Content-Type not specified");
      return null;
    }
    ;
    let filetype = this.toFiletype(sys.ObjUtil.coerce(mime, sys.MimeType.type$));
    if (filetype == null) {
      res.sendErr(415, sys.Str.plus("Unsupported Content-Type: ", mime));
      return null;
    }
    ;
    let reqStr = req.in().readAllStr();
    let err = null;
    try {
      return filetype.reader(sys.Str.in(reqStr), this.ioOpts(sys.ObjUtil.coerce(filetype, Filetype.type$), sys.ObjUtil.coerce(mime, sys.MimeType.type$))).readGrid();
    }
    catch ($_u225) {
      $_u225 = sys.Err.make($_u225);
      if ($_u225 instanceof sys.Err) {
        let e = $_u225;
        ;
        (err = e);
      }
      else {
        throw $_u225;
      }
    }
    ;
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("ERROR: Invalid ", mime), " format for request:\n"), err), "\n"), reqStr));
    res.sendErr(400, sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot parse ", mime), " request: "), err));
    return null;
  }

  doWriteRes(req, res, result) {
    let mime = this.acceptMimeType(req);
    if (mime == null) {
      return res.sendErr(406, "Invalid Accept header");
    }
    ;
    let filetype = this.toFiletype(sys.ObjUtil.coerce(mime, sys.MimeType.type$));
    if (filetype == null) {
      return res.sendErr(406, sys.Str.plus("Unsupported Accept type: ", mime));
    }
    ;
    let gzip = WebOpUtil.acceptGzip(req);
    res.statusCode(200);
    res.headers().set("Content-Type", mime.toStr());
    res.headers().set("Cache-Control", "no-cache, no-store");
    if (gzip) {
      res.headers().set("Content-Encoding", "gzip");
    }
    ;
    let out = res.out();
    if (gzip) {
      (out = sys.Zip.gzipOutStream(out));
    }
    ;
    let writer = filetype.writer(out, this.ioOpts(sys.ObjUtil.coerce(filetype, Filetype.type$), sys.ObjUtil.coerce(mime, sys.MimeType.type$)));
    writer.writeGrid(result);
    out.close();
    return;
  }

  static acceptGzip(req) {
    return sys.Str.contains(((this$) => { let $_u226 = req.headers().get("Accept-Encoding"); if ($_u226 != null) return $_u226; return ""; })(this), "gzip");
  }

  acceptMimeType(req) {
    let queryFiletype = ((this$) => { let $_u227 = req.uri().query().get("filetype"); if ($_u227 != null) return $_u227; return req.uri().query().get("format"); })(this);
    if (queryFiletype != null) {
      return this.ns().filetype(sys.ObjUtil.coerce(queryFiletype, sys.Str.type$)).mimeType();
    }
    ;
    let accept = req.headers().get("Accept");
    if ((accept == null || sys.Str.contains(accept, "*/*"))) {
      return WebOpUtil.mimeZinc();
    }
    ;
    let toks = sys.Str.split(accept, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
    let mime = sys.MimeType.fromStr(sys.ObjUtil.coerce(toks.first(), sys.Str.type$), false);
    if (mime == null) {
      return null;
    }
    ;
    return mime;
  }

  static static$init() {
    WebOpUtil.#mimeZinc = sys.ObjUtil.coerce(sys.MimeType.fromStr("text/zinc; charset=utf-8"), sys.MimeType.type$);
    return;
  }

}

class TypedDict extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TypedDict.type$; }

  toStr() { return Dict.prototype.toStr.apply(this, arguments); }

  dis() { return Dict.prototype.dis.apply(this, arguments); }

  id() { return Dict.prototype.id.apply(this, arguments); }

  _id() { return Dict.prototype._id.apply(this, arguments); }

  map() { return Dict.prototype.map.apply(this, arguments); }

  #metaRef = null;

  // private field reflection only
  __metaRef(it) { if (it === undefined) return this.#metaRef; else this.#metaRef = it; }

  static create(type, meta, onErr) {
    if (onErr === undefined) onErr = null;
    const this$ = this;
    let sets = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Field"), sys.Type.find("sys::Obj?"));
    type.fields().each((field) => {
      if (!field.hasFacet(TypedTag.type$)) {
        return;
      }
      ;
      let val = meta.get(field.name());
      if (val == null) {
        return;
      }
      ;
      if ((sys.ObjUtil.equals(field.type(), sys.Int.type$) && sys.ObjUtil.is(val, Number.type$))) {
        (val = sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, Number.type$).toInt(), sys.Obj.type$.toNullable()));
      }
      else {
        if ((sys.ObjUtil.equals(field.type(), sys.Duration.type$) && sys.ObjUtil.is(val, Number.type$))) {
          (val = ((this$) => { let $_u228 = sys.ObjUtil.coerce(val, Number.type$).toDuration(false); if ($_u228 != null) return $_u228; return val; })(this$));
        }
        else {
          if ((sys.ObjUtil.equals(field.type(), sys.Bool.type$) && val === Marker.val())) {
            (val = sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
          }
          ;
        }
        ;
      }
      ;
      if (sys.ObjUtil.typeof(val).fits(field.type().toNonNullable())) {
        sets.set(field, val);
      }
      else {
        if (onErr != null) {
          sys.Func.call(onErr, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid val ", sys.Str.toCode(field.qname())), ": "), field.type()), " != "), sys.ObjUtil.typeof(val)));
        }
        ;
      }
      ;
      return;
    });
    return sys.ObjUtil.coerce(type.make(sys.List.make(sys.Obj.type$, [meta, sys.Field.makeSetFunc(sets)])), TypedDict.type$);
  }

  static make(meta) {
    const $self = new TypedDict();
    TypedDict.make$($self, meta);
    return $self;
  }

  static make$($self, meta) {
    $self.#metaRef = meta;
    return;
  }

  meta() {
    return this.#metaRef;
  }

  get(n, def) {
    if (def === undefined) def = null;
    return this.meta().get(n, def);
  }

  isEmpty() {
    return this.meta().isEmpty();
  }

  has(n) {
    return this.meta().has(n);
  }

  missing(n) {
    return this.meta().missing(n);
  }

  each(f) {
    this.meta().each(f);
    return;
  }

  eachWhile(f) {
    return this.meta().eachWhile(f);
  }

  trap(n, a) {
    if (a === undefined) a = null;
    return this.meta().trap(n, a);
  }

}

class TypedTag extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#meta = "";
    return;
  }

  typeof() { return TypedTag.type$; }

  #restart = false;

  restart() { return this.#restart; }

  __restart(it) { if (it === undefined) return this.#restart; else this.#restart = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  decode(f) {
    const this$ = this;
    if (this.#restart) {
      sys.Func.call(f, "restart", Marker.val());
    }
    ;
    if (!sys.Str.isEmpty(this.#meta)) {
      TrioReader.make(sys.Str.in(this.#meta)).readDict().each((v, n) => {
        sys.Func.call(f, n, v);
        return;
      });
    }
    ;
    return;
  }

  static make(f) {
    const $self = new TypedTag();
    TypedTag.make$($self, f);
    return $self;
  }

  static make$($self, f) {
    if (f === undefined) f = null;
    ;
    ((this$) => { let $_u229 = f; if ($_u229 == null) return null; return sys.Func.call(f, this$); })($self);
    return;
  }

}

class Span extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Span.type$; }

  #mode = null;

  mode() { return this.#mode; }

  __mode(it) { if (it === undefined) return this.#mode; else this.#mode = it; }

  #start = null;

  start() { return this.#start; }

  __start(it) { if (it === undefined) return this.#start; else this.#start = it; }

  #end = null;

  end() { return this.#end; }

  __end(it) { if (it === undefined) return this.#end; else this.#end = it; }

  #alignsToDates = false;

  alignsToDates() { return this.#alignsToDates; }

  __alignsToDates(it) { if (it === undefined) return this.#alignsToDates; else this.#alignsToDates = it; }

  static fromStr(str, tz, checked) {
    if (tz === undefined) tz = sys.TimeZone.cur();
    if (checked === undefined) checked = true;
    try {
      let rel = SpanMode.fromStr(str, false);
      if ((rel != null && rel.isRel())) {
        return Span.makeRel(sys.ObjUtil.coerce(rel, SpanMode.type$), tz);
      }
      ;
      let toks = sys.Str.split(str, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
      if (sys.ObjUtil.equals(toks.size(), 1)) {
        let d = sys.Date.fromStr(toks.get(0));
        return Span.makeDates(SpanMode.abs(), sys.ObjUtil.coerce(d, sys.Date.type$), d.plus(sys.Duration.fromStr("1day")), tz);
      }
      ;
      if (sys.ObjUtil.compareNE(toks.size(), 2)) {
        throw sys.Err.make();
      }
      ;
      return Span.makeDateTimes(SpanMode.abs(), Span.parseDateTime(toks.get(0), tz), Span.parseDateTime(toks.get(1), tz));
    }
    catch ($_u230) {
      $_u230 = sys.Err.make($_u230);
      if ($_u230 instanceof sys.Err) {
        let e = $_u230;
        ;
      }
      else {
        throw $_u230;
      }
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(str);
    }
    ;
    return null;
  }

  static parseDateTime(s, tz) {
    if (sys.ObjUtil.equals(sys.Str.size(s), 10)) {
      return sys.Date.fromStr(s).midnight(tz);
    }
    ;
    if (sys.Str.contains(s, " ")) {
      return sys.ObjUtil.coerce(sys.DateTime.fromStr(s), sys.DateTime.type$);
    }
    ;
    return sys.ObjUtil.coerce(sys.DateTime.fromLocale(s, "YYYY-MM-DD'T'hh:mm:ss.FFF", tz), sys.DateTime.type$);
  }

  static makeAbs(start, end) {
    if (start.tz() !== end.tz()) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Mismatched tz: ", start.tz()), " != "), end.tz()));
    }
    ;
    if (sys.ObjUtil.compareGT(start, end)) {
      throw sys.ArgErr.make("start > end");
    }
    ;
    return Span.makeDateTimes(SpanMode.abs(), start, end);
  }

  static makeDate(date, tz) {
    if (tz === undefined) tz = sys.TimeZone.cur();
    return Span.makeDateTimes(SpanMode.abs(), date.midnight(tz), date.plus(sys.Duration.fromStr("1day")).midnight(tz));
  }

  static makeRel(mode, tz) {
    if (tz === undefined) tz = sys.TimeZone.cur();
    return Span.doMakeRel(mode, sys.DateTime.now().toTimeZone(tz));
  }

  static today(tz) {
    if (tz === undefined) tz = sys.TimeZone.cur();
    return sys.ObjUtil.coerce(Span.makeRel(SpanMode.today(), tz), Span.type$);
  }

  static defVal() {
    return Span.today(sys.TimeZone.cur());
  }

  static doMakeRel(mode, now) {
    if (mode.isAbs()) {
      throw sys.ArgErr.make(sys.Str.plus("Mode not relative: ", mode));
    }
    ;
    let today = now.date();
    let tz = now.tz();
    let $_u231 = mode;
    if (sys.ObjUtil.equals($_u231, SpanMode.today())) {
      return Span.makeDates(mode, today, today.plus(sys.Duration.fromStr("1day")), tz);
    }
    else if (sys.ObjUtil.equals($_u231, SpanMode.yesterday())) {
      return Span.makeDates(mode, today.minus(sys.Duration.fromStr("1day")), today, tz);
    }
    else if (sys.ObjUtil.equals($_u231, SpanMode.thisWeek())) {
      let sow = sys.Weekday.localeStartOfWeek();
      let start = today;
      while (start.weekday() !== sow) {
        (start = start.minus(sys.Duration.fromStr("1day")));
      }
      ;
      return Span.makeDates(mode, start, start.plus(sys.Duration.fromStr("7day")), tz);
    }
    else if (sys.ObjUtil.equals($_u231, SpanMode.lastWeek())) {
      let sow = sys.Weekday.localeStartOfWeek();
      let start = today;
      while (start.weekday() !== sow) {
        (start = start.minus(sys.Duration.fromStr("1day")));
      }
      ;
      (start = start.minus(sys.Duration.fromStr("7day")));
      return Span.makeDates(mode, start, start.plus(sys.Duration.fromStr("7day")), tz);
    }
    else if (sys.ObjUtil.equals($_u231, SpanMode.pastWeek())) {
      return Span.makeDates(mode, today.minus(sys.Duration.fromStr("7day")), today, tz);
    }
    else if (sys.ObjUtil.equals($_u231, SpanMode.thisMonth())) {
      let first = today.firstOfMonth();
      return Span.makeDates(mode, first, first.lastOfMonth().plus(sys.Duration.fromStr("1day")), tz);
    }
    else if (sys.ObjUtil.equals($_u231, SpanMode.lastMonth())) {
      let first = today.firstOfMonth().minus(sys.Duration.fromStr("1day")).firstOfMonth();
      return Span.makeDates(mode, first, first.lastOfMonth().plus(sys.Duration.fromStr("1day")), tz);
    }
    else if (sys.ObjUtil.equals($_u231, SpanMode.pastMonth())) {
      return Span.makeDates(mode, today.minus(sys.Duration.fromStr("28day")), today, tz);
    }
    else if (sys.ObjUtil.equals($_u231, SpanMode.thisQuarter())) {
      return Span.makeDates(mode, Span.toQuarterStart(today), Span.toQuarterEnd(today), tz);
    }
    else if (sys.ObjUtil.equals($_u231, SpanMode.lastQuarter())) {
      let lastQuarter = Span.toQuarterStart(today).minus(sys.Duration.fromStr("1day"));
      return Span.makeDates(mode, Span.toQuarterStart(lastQuarter), Span.toQuarterEnd(lastQuarter), tz);
    }
    else if (sys.ObjUtil.equals($_u231, SpanMode.pastQuarter())) {
      return Span.makeDates(mode, today.minus(sys.Duration.fromStr("90day")), today, tz);
    }
    else if (sys.ObjUtil.equals($_u231, SpanMode.thisYear())) {
      return Span.makeDates(mode, sys.ObjUtil.coerce(sys.Date.make(today.year(), sys.Month.jan(), 1), sys.Date.type$), sys.ObjUtil.coerce(sys.Date.make(sys.Int.plus(today.year(), 1), sys.Month.jan(), 1), sys.Date.type$), tz);
    }
    else if (sys.ObjUtil.equals($_u231, SpanMode.lastYear())) {
      return Span.makeDates(mode, sys.ObjUtil.coerce(sys.Date.make(sys.Int.minus(today.year(), 1), sys.Month.jan(), 1), sys.Date.type$), sys.ObjUtil.coerce(sys.Date.make(today.year(), sys.Month.jan(), 1), sys.Date.type$), tz);
    }
    else if (sys.ObjUtil.equals($_u231, SpanMode.pastYear())) {
      return Span.makeDates(mode, today.minus(sys.Duration.fromStr("365day")), today, tz);
    }
    else {
      throw sys.Err.make(sys.Str.plus("TODO: ", mode));
    }
    ;
  }

  static toQuarterStart(d) {
    let $_u232 = sys.Int.div(d.month().ordinal(), 3);
    if (sys.ObjUtil.equals($_u232, 0)) {
      return sys.ObjUtil.coerce(sys.Date.make(d.year(), sys.Month.jan(), 1), sys.Date.type$);
    }
    else if (sys.ObjUtil.equals($_u232, 1)) {
      return sys.ObjUtil.coerce(sys.Date.make(d.year(), sys.Month.apr(), 1), sys.Date.type$);
    }
    else if (sys.ObjUtil.equals($_u232, 2)) {
      return sys.ObjUtil.coerce(sys.Date.make(d.year(), sys.Month.jul(), 1), sys.Date.type$);
    }
    else if (sys.ObjUtil.equals($_u232, 3)) {
      return sys.ObjUtil.coerce(sys.Date.make(d.year(), sys.Month.oct(), 1), sys.Date.type$);
    }
    else {
      throw sys.Err.make(d.toStr());
    }
    ;
  }

  static toQuarterEnd(d) {
    let $_u233 = sys.Int.div(d.month().ordinal(), 3);
    if (sys.ObjUtil.equals($_u233, 0)) {
      return sys.ObjUtil.coerce(sys.Date.make(d.year(), sys.Month.apr(), 1), sys.Date.type$);
    }
    else if (sys.ObjUtil.equals($_u233, 1)) {
      return sys.ObjUtil.coerce(sys.Date.make(d.year(), sys.Month.jul(), 1), sys.Date.type$);
    }
    else if (sys.ObjUtil.equals($_u233, 2)) {
      return sys.ObjUtil.coerce(sys.Date.make(d.year(), sys.Month.oct(), 1), sys.Date.type$);
    }
    else if (sys.ObjUtil.equals($_u233, 3)) {
      return sys.ObjUtil.coerce(sys.Date.make(sys.Int.plus(d.year(), 1), sys.Month.jan(), 1), sys.Date.type$);
    }
    else {
      throw sys.Err.make(d.toStr());
    }
    ;
  }

  static makeDates(mode, start, end, tz) {
    const $self = new Span();
    Span.makeDates$($self, mode, start, end, tz);
    return $self;
  }

  static makeDates$($self, mode, start, end, tz) {
    $self.#mode = mode;
    $self.#start = start.midnight(tz);
    $self.#end = end.midnight(tz);
    $self.#alignsToDates = true;
    return;
  }

  static makeDateTimes(mode, start, end) {
    const $self = new Span();
    Span.makeDateTimes$($self, mode, start, end);
    return $self;
  }

  static makeDateTimes$($self, mode, start, end) {
    $self.#mode = mode;
    $self.#start = start;
    $self.#end = end;
    $self.#alignsToDates = (sys.ObjUtil.equals(start.time(), sys.Time.defVal()) && sys.ObjUtil.equals(end.time(), sys.Time.defVal()));
    return;
  }

  tz() {
    return this.#start.tz();
  }

  hash() {
    return ((this$) => { if (this$.#mode.isRel()) return sys.ObjUtil.hash(this$.#mode); return sys.Int.xor(this$.#start.hash(), this$.#end.hash()); })(this);
  }

  equals(obj) {
    let that = sys.ObjUtil.as(obj, Span.type$);
    if (that == null) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareNE(this.#mode, that.#mode)) {
      return false;
    }
    ;
    if (this.#mode.isRel()) {
      return true;
    }
    ;
    return (sys.ObjUtil.equals(this.#start, that.#start) && sys.ObjUtil.equals(this.#end, that.#end));
  }

  toStr() {
    if (this.#mode.isRel()) {
      return this.#mode.name();
    }
    ;
    if (this.#alignsToDates) {
      if (this.alignsToDay()) {
        return this.#start.date().toStr();
      }
      ;
      return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#start.date()), ","), this.#end.date());
    }
    ;
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#start), ","), this.#end);
  }

  toLocale() {
    return this.dis();
  }

  dis() {
    try {
      if (!this.#alignsToDates) {
        return sys.Str.plus(sys.Str.plus(this.#start.toLocale(sys.Str.plus("", Span.type$.pod().locale("span.dateTime"))), ".."), this.#end.toLocale(sys.Str.plus("", Span.type$.pod().locale("span.dateTime"))));
      }
      ;
      if (this.#mode.isRel()) {
        return this.#mode.dis();
      }
      ;
      if (this.alignsToDay()) {
        return this.#start.toLocale(sys.Str.plus("", Span.type$.pod().locale("span.date")));
      }
      ;
      if (this.alignsToWeek()) {
        return sys.Str.plus(sys.Str.plus(sys.Str.plus("", Span.type$.pod().locale("weekOf")), " "), this.#start.toLocale(sys.Str.plus("", Span.type$.pod().locale("span.date"))));
      }
      ;
      if (this.alignsToMonth()) {
        return this.#start.toLocale(sys.Str.plus("", Span.type$.pod().locale("span.month")));
      }
      ;
      if (this.alignsToQuarter()) {
        return sys.Str.plus(sys.Str.plus(sys.ObjUtil.typeof(this).pod().locale(sys.Str.plus("quarter", sys.ObjUtil.coerce(this.quarter(), sys.Obj.type$.toNullable()))), " "), this.#start.toLocale(sys.Str.plus("", Span.type$.pod().locale("span.year"))));
      }
      ;
      if (this.alignsToYear()) {
        return this.#start.toLocale(sys.Str.plus("", Span.type$.pod().locale("span.year")));
      }
      ;
      return sys.Str.plus(sys.Str.plus(this.#start.date().toLocale(sys.Str.plus("", Span.type$.pod().locale("span.date"))), ".."), this.#end.date().minus(sys.Duration.fromStr("1day")).toLocale(sys.Str.plus("", Span.type$.pod().locale("span.date"))));
    }
    catch ($_u235) {
      $_u235 = sys.Err.make($_u235);
      if ($_u235 instanceof sys.Err) {
        let e = $_u235;
        ;
        return this.toStr();
      }
      else {
        throw $_u235;
      }
    }
    ;
  }

  toTimeZone(tz) {
    if (this.tz() === tz) {
      return this;
    }
    ;
    return sys.ObjUtil.coerce(Span.makeAbs(this.#start.toTimeZone(tz), this.#end.toTimeZone(tz)), Span.type$);
  }

  toDateSpan() {
    if (!this.#alignsToDates) {
      return DateSpan.make(this.#start.date(), this.#end.date());
    }
    ;
    if (this.alignsToDay()) {
      return DateSpan.make(this.#start.date(), DateSpan.day());
    }
    ;
    if (this.alignsToWeek()) {
      return DateSpan.make(this.#start.date(), DateSpan.week());
    }
    ;
    if (this.alignsToMonth()) {
      return DateSpan.make(this.#start.date(), DateSpan.month());
    }
    ;
    if (this.alignsToYear()) {
      return DateSpan.make(this.#start.date(), DateSpan.year());
    }
    ;
    return DateSpan.make(this.#start.date(), this.#end.date().minus(sys.Duration.fromStr("1day")));
  }

  eachDay(func) {
    this.toDateSpan().eachDay(func);
    return;
  }

  contains(ts) {
    return (sys.ObjUtil.compareLE(this.#start, ts) && sys.ObjUtil.compareLT(ts, this.#end));
  }

  fresh() {
    return sys.ObjUtil.coerce(((this$) => { if (this$.#mode.isAbs()) return this$; return Span.makeRel(this$.#mode, this$.tz()); })(this), Span.type$);
  }

  toCode() {
    return sys.Str.plus(sys.Str.plus("toSpan(", sys.Str.toCode(this.toStr())), ")");
  }

  numDays() {
    return this.#end.date().minusDate(this.#start.date()).toDay();
  }

  quarter() {
    return sys.Int.plus(1, sys.Int.div(this.#start.month().ordinal(), 3));
  }

  alignsToDay() {
    return (this.#alignsToDates && sys.ObjUtil.equals(this.numDays(), 1));
  }

  alignsToWeek() {
    return (this.#alignsToDates && sys.ObjUtil.equals(this.#start.date().weekday(), sys.Weekday.localeStartOfWeek()) && sys.ObjUtil.equals(this.numDays(), 7));
  }

  alignsToMonth() {
    if (!this.#alignsToDates) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(this.#start.month(), sys.Month.dec())) {
      if (sys.ObjUtil.compareNE(sys.Int.plus(this.#start.year(), 1), this.#end.year())) {
        return false;
      }
      ;
      if (sys.ObjUtil.compareNE(this.#end.month(), sys.Month.jan())) {
        return false;
      }
      ;
    }
    else {
      if (sys.ObjUtil.compareNE(this.#start.year(), this.#end.year())) {
        return false;
      }
      ;
      if (sys.ObjUtil.compareNE(sys.Int.plus(this.#start.month().ordinal(), 1), this.#end.month().ordinal())) {
        return false;
      }
      ;
    }
    ;
    return (sys.ObjUtil.equals(this.#start.day(), 1) && sys.ObjUtil.equals(this.#end.day(), 1));
  }

  alignsToQuarter() {
    if (!this.#alignsToDates) {
      return false;
    }
    ;
    if ((sys.ObjUtil.compareNE(this.#start.day(), 1) || sys.ObjUtil.compareNE(this.#end.day(), 1))) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareNE(sys.Int.mod(this.#start.month().ordinal(), 3), 0)) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(this.#start.month(), sys.Month.oct())) {
      if (sys.ObjUtil.compareNE(sys.Int.plus(this.#start.year(), 1), this.#end.year())) {
        return false;
      }
      ;
      return sys.ObjUtil.equals(this.#end.month(), sys.Month.jan());
    }
    else {
      if (sys.ObjUtil.compareNE(this.#start.year(), this.#end.year())) {
        return false;
      }
      ;
      return sys.ObjUtil.equals(sys.Int.plus(this.#start.month().ordinal(), 3), this.#end.month().ordinal());
    }
    ;
  }

  alignsToYear() {
    if (!this.#alignsToDates) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareNE(sys.Int.plus(this.#start.year(), 1), this.#end.year())) {
      return false;
    }
    ;
    if ((sys.ObjUtil.compareNE(this.#start.day(), 1) || sys.ObjUtil.compareNE(this.#end.day(), 1))) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#start.month(), sys.Month.jan()) && sys.ObjUtil.equals(this.#end.month(), sys.Month.jan()));
  }

  prev() {
    let $_u237 = this.#mode;
    if (sys.ObjUtil.equals($_u237, SpanMode.today())) {
      return sys.ObjUtil.coerce(Span.makeRel(SpanMode.yesterday(), this.tz()), Span.type$);
    }
    else if (sys.ObjUtil.equals($_u237, SpanMode.thisWeek())) {
      return sys.ObjUtil.coerce(Span.makeRel(SpanMode.lastWeek(), this.tz()), Span.type$);
    }
    else if (sys.ObjUtil.equals($_u237, SpanMode.thisMonth())) {
      return sys.ObjUtil.coerce(Span.makeRel(SpanMode.lastMonth(), this.tz()), Span.type$);
    }
    else if (sys.ObjUtil.equals($_u237, SpanMode.thisQuarter())) {
      return sys.ObjUtil.coerce(Span.makeRel(SpanMode.lastQuarter(), this.tz()), Span.type$);
    }
    else if (sys.ObjUtil.equals($_u237, SpanMode.thisYear())) {
      return sys.ObjUtil.coerce(Span.makeRel(SpanMode.lastYear(), this.tz()), Span.type$);
    }
    ;
    let abs = SpanMode.abs();
    if (this.alignsToDay()) {
      return Span.makeDates(abs, this.#start.date().minus(sys.Duration.fromStr("1day")), this.#end.date().minus(sys.Duration.fromStr("1day")), this.tz());
    }
    ;
    if (this.alignsToWeek()) {
      return Span.makeDates(abs, this.#start.date().minus(sys.Duration.fromStr("7day")), this.#end.date().minus(sys.Duration.fromStr("7day")), this.tz());
    }
    ;
    if (this.alignsToMonth()) {
      let monthEnd = this.#start;
      let monthStart = monthEnd.date().minus(sys.Duration.fromStr("1day")).firstOfMonth().midnight(this.tz());
      return Span.makeDateTimes(abs, monthStart, monthEnd);
    }
    ;
    if (this.alignsToQuarter()) {
      let qEnd = this.#start.date();
      let qStart = ((this$) => { if (sys.ObjUtil.equals(qEnd.month(), sys.Month.jan())) return sys.Date.make(sys.Int.minus(qEnd.year(), 1), sys.Month.oct(), 1); return sys.Date.make(qEnd.year(), sys.Month.vals().get(sys.Int.minus(qEnd.month().ordinal(), 3)), 1); })(this);
      return Span.makeDates(abs, sys.ObjUtil.coerce(qStart, sys.Date.type$), qEnd, this.tz());
    }
    ;
    if (this.alignsToYear()) {
      let y = this.#start.year();
      return Span.makeDates(abs, sys.ObjUtil.coerce(sys.Date.make(sys.Int.minus(y, 1), sys.Month.jan(), 1), sys.Date.type$), sys.ObjUtil.coerce(sys.Date.make(y, sys.Month.jan(), 1), sys.Date.type$), this.tz());
    }
    ;
    if (this.#alignsToDates) {
      let diffDays = sys.Duration.fromStr("1day").mult(this.numDays());
      return Span.makeDates(abs, this.#start.date().minus(diffDays), this.#end.date().minus(diffDays), this.tz());
    }
    ;
    let diffTicks = this.#end.minusDateTime(this.#start);
    return Span.makeDateTimes(abs, this.#start.minus(diffTicks), this.#end.minus(diffTicks));
  }

  next() {
    let $_u239 = this.#mode;
    if (sys.ObjUtil.equals($_u239, SpanMode.yesterday())) {
      return sys.ObjUtil.coerce(Span.makeRel(SpanMode.today(), this.tz()), Span.type$);
    }
    else if (sys.ObjUtil.equals($_u239, SpanMode.lastWeek())) {
      return sys.ObjUtil.coerce(Span.makeRel(SpanMode.thisWeek(), this.tz()), Span.type$);
    }
    else if (sys.ObjUtil.equals($_u239, SpanMode.lastMonth())) {
      return sys.ObjUtil.coerce(Span.makeRel(SpanMode.thisMonth(), this.tz()), Span.type$);
    }
    else if (sys.ObjUtil.equals($_u239, SpanMode.lastQuarter())) {
      return sys.ObjUtil.coerce(Span.makeRel(SpanMode.thisQuarter(), this.tz()), Span.type$);
    }
    else if (sys.ObjUtil.equals($_u239, SpanMode.lastYear())) {
      return sys.ObjUtil.coerce(Span.makeRel(SpanMode.thisYear(), this.tz()), Span.type$);
    }
    ;
    let abs = SpanMode.abs();
    if (this.alignsToDay()) {
      return Span.makeDates(abs, this.#start.date().plus(sys.Duration.fromStr("1day")), this.#end.date().plus(sys.Duration.fromStr("1day")), this.tz());
    }
    ;
    if (this.alignsToWeek()) {
      return Span.makeDates(abs, this.#start.date().plus(sys.Duration.fromStr("7day")), this.#end.date().plus(sys.Duration.fromStr("7day")), this.tz());
    }
    ;
    if (this.alignsToMonth()) {
      let monthStart = this.#end;
      let monthEnd = monthStart.date().lastOfMonth().plus(sys.Duration.fromStr("1day")).midnight(this.tz());
      return Span.makeDateTimes(abs, monthStart, monthEnd);
    }
    ;
    if (this.alignsToQuarter()) {
      let qStart = this.#end.date();
      let qEnd = ((this$) => { if (sys.ObjUtil.equals(qStart.month(), sys.Month.oct())) return sys.Date.make(sys.Int.plus(qStart.year(), 1), sys.Month.jan(), 1); return sys.Date.make(qStart.year(), sys.Month.vals().get(sys.Int.plus(qStart.month().ordinal(), 3)), 1); })(this);
      return Span.makeDates(abs, qStart, sys.ObjUtil.coerce(qEnd, sys.Date.type$), this.tz());
    }
    ;
    if (this.alignsToYear()) {
      let y = this.#start.year();
      return Span.makeDates(abs, sys.ObjUtil.coerce(sys.Date.make(sys.Int.plus(y, 1), sys.Month.jan(), 1), sys.Date.type$), sys.ObjUtil.coerce(sys.Date.make(sys.Int.plus(y, 2), sys.Month.jan(), 1), sys.Date.type$), this.tz());
    }
    ;
    if (this.#alignsToDates) {
      let diffDays = sys.Duration.fromStr("1day").mult(this.numDays());
      return Span.makeDates(abs, this.#start.date().plus(diffDays), this.#end.date().plus(diffDays), this.tz());
    }
    ;
    let diffTicks = this.#end.minusDateTime(this.#start);
    return Span.makeDateTimes(abs, this.#start.plus(diffTicks), this.#end.plus(diffTicks));
  }

}

class SpanMode extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SpanMode.type$; }

  static abs() { return SpanMode.vals().get(0); }

  static today() { return SpanMode.vals().get(1); }

  static yesterday() { return SpanMode.vals().get(2); }

  static thisWeek() { return SpanMode.vals().get(3); }

  static lastWeek() { return SpanMode.vals().get(4); }

  static pastWeek() { return SpanMode.vals().get(5); }

  static thisMonth() { return SpanMode.vals().get(6); }

  static lastMonth() { return SpanMode.vals().get(7); }

  static pastMonth() { return SpanMode.vals().get(8); }

  static thisQuarter() { return SpanMode.vals().get(9); }

  static lastQuarter() { return SpanMode.vals().get(10); }

  static pastQuarter() { return SpanMode.vals().get(11); }

  static thisYear() { return SpanMode.vals().get(12); }

  static lastYear() { return SpanMode.vals().get(13); }

  static pastYear() { return SpanMode.vals().get(14); }

  static #vals = undefined;

  isAbs() {
    return sys.ObjUtil.equals(this, SpanMode.abs());
  }

  isRel() {
    return sys.ObjUtil.compareNE(this, SpanMode.abs());
  }

  dis() {
    return sys.ObjUtil.coerce(sys.ObjUtil.typeof(this).pod().locale(this.name()), sys.Str.type$);
  }

  static make($ordinal, $name) {
    const $self = new SpanMode();
    SpanMode.make$($self, $ordinal, $name);
    return $self;
  }

  static make$($self, $ordinal, $name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked = true) {
    return sys.Enum.doFromStr(SpanMode.type$, SpanMode.vals(), name$, checked);
  }

  static vals() {
    if (SpanMode.#vals == null) {
      SpanMode.#vals = sys.List.make(SpanMode.type$, [
        SpanMode.make(0, "abs",),
        SpanMode.make(1, "today",),
        SpanMode.make(2, "yesterday",),
        SpanMode.make(3, "thisWeek",),
        SpanMode.make(4, "lastWeek",),
        SpanMode.make(5, "pastWeek",),
        SpanMode.make(6, "thisMonth",),
        SpanMode.make(7, "lastMonth",),
        SpanMode.make(8, "pastMonth",),
        SpanMode.make(9, "thisQuarter",),
        SpanMode.make(10, "lastQuarter",),
        SpanMode.make(11, "pastQuarter",),
        SpanMode.make(12, "thisYear",),
        SpanMode.make(13, "lastYear",),
        SpanMode.make(14, "pastYear",),
      ]).toImmutable();
    }
    return SpanMode.#vals;
  }

  static static$init() {
    const $_u241 = SpanMode.vals();
    if (true) {
    }
    ;
    return;
  }

}

class Number extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Number.type$; }

  static #defVal = undefined;

  static defVal() {
    if (Number.#defVal === undefined) {
      Number.static$init();
      if (Number.#defVal === undefined) Number.#defVal = null;
    }
    return Number.#defVal;
  }

  static #negOne = undefined;

  static negOne() {
    if (Number.#negOne === undefined) {
      Number.static$init();
      if (Number.#negOne === undefined) Number.#negOne = null;
    }
    return Number.#negOne;
  }

  static #zero = undefined;

  static zero() {
    if (Number.#zero === undefined) {
      Number.static$init();
      if (Number.#zero === undefined) Number.#zero = null;
    }
    return Number.#zero;
  }

  static #one = undefined;

  static one() {
    if (Number.#one === undefined) {
      Number.static$init();
      if (Number.#one === undefined) Number.#one = null;
    }
    return Number.#one;
  }

  static #ten = undefined;

  static ten() {
    if (Number.#ten === undefined) {
      Number.static$init();
      if (Number.#ten === undefined) Number.#ten = null;
    }
    return Number.#ten;
  }

  static #nan = undefined;

  static nan() {
    if (Number.#nan === undefined) {
      Number.static$init();
      if (Number.#nan === undefined) Number.#nan = null;
    }
    return Number.#nan;
  }

  static #posInf = undefined;

  static posInf() {
    if (Number.#posInf === undefined) {
      Number.static$init();
      if (Number.#posInf === undefined) Number.#posInf = null;
    }
    return Number.#posInf;
  }

  static #negInf = undefined;

  static negInf() {
    if (Number.#negInf === undefined) {
      Number.static$init();
      if (Number.#negInf === undefined) Number.#negInf = null;
    }
    return Number.#negInf;
  }

  static #intCache = undefined;

  static intCache() {
    if (Number.#intCache === undefined) {
      Number.static$init();
      if (Number.#intCache === undefined) Number.#intCache = null;
    }
    return Number.#intCache;
  }

  static #F = undefined;

  static F() {
    if (Number.#F === undefined) {
      Number.static$init();
      if (Number.#F === undefined) Number.#F = null;
    }
    return Number.#F;
  }

  static #C = undefined;

  static C() {
    if (Number.#C === undefined) {
      Number.static$init();
      if (Number.#C === undefined) Number.#C = null;
    }
    return Number.#C;
  }

  static #Fdeg = undefined;

  static Fdeg() {
    if (Number.#Fdeg === undefined) {
      Number.static$init();
      if (Number.#Fdeg === undefined) Number.#Fdeg = null;
    }
    return Number.#Fdeg;
  }

  static #Cdeg = undefined;

  static Cdeg() {
    if (Number.#Cdeg === undefined) {
      Number.static$init();
      if (Number.#Cdeg === undefined) Number.#Cdeg = null;
    }
    return Number.#Cdeg;
  }

  static #FdegDay = undefined;

  static FdegDay() {
    if (Number.#FdegDay === undefined) {
      Number.static$init();
      if (Number.#FdegDay === undefined) Number.#FdegDay = null;
    }
    return Number.#FdegDay;
  }

  static #CdegDay = undefined;

  static CdegDay() {
    if (Number.#CdegDay === undefined) {
      Number.static$init();
      if (Number.#CdegDay === undefined) Number.#CdegDay = null;
    }
    return Number.#CdegDay;
  }

  static #ns = undefined;

  static ns() {
    if (Number.#ns === undefined) {
      Number.static$init();
      if (Number.#ns === undefined) Number.#ns = null;
    }
    return Number.#ns;
  }

  static #us = undefined;

  static us() {
    if (Number.#us === undefined) {
      Number.static$init();
      if (Number.#us === undefined) Number.#us = null;
    }
    return Number.#us;
  }

  static #ms = undefined;

  static ms() {
    if (Number.#ms === undefined) {
      Number.static$init();
      if (Number.#ms === undefined) Number.#ms = null;
    }
    return Number.#ms;
  }

  static #sec = undefined;

  static sec() {
    if (Number.#sec === undefined) {
      Number.static$init();
      if (Number.#sec === undefined) Number.#sec = null;
    }
    return Number.#sec;
  }

  static #mins = undefined;

  static mins() {
    if (Number.#mins === undefined) {
      Number.static$init();
      if (Number.#mins === undefined) Number.#mins = null;
    }
    return Number.#mins;
  }

  static #hr = undefined;

  static hr() {
    if (Number.#hr === undefined) {
      Number.static$init();
      if (Number.#hr === undefined) Number.#hr = null;
    }
    return Number.#hr;
  }

  static #day = undefined;

  static day() {
    if (Number.#day === undefined) {
      Number.static$init();
      if (Number.#day === undefined) Number.#day = null;
    }
    return Number.#day;
  }

  static #week = undefined;

  static week() {
    if (Number.#week === undefined) {
      Number.static$init();
      if (Number.#week === undefined) Number.#week = null;
    }
    return Number.#week;
  }

  static #mo = undefined;

  static mo() {
    if (Number.#mo === undefined) {
      Number.static$init();
      if (Number.#mo === undefined) Number.#mo = null;
    }
    return Number.#mo;
  }

  static #year = undefined;

  static year() {
    if (Number.#year === undefined) {
      Number.static$init();
      if (Number.#year === undefined) Number.#year = null;
    }
    return Number.#year;
  }

  static #percent = undefined;

  static percent() {
    if (Number.#percent === undefined) {
      Number.static$init();
      if (Number.#percent === undefined) Number.#percent = null;
    }
    return Number.#percent;
  }

  static #dollar = undefined;

  static dollar() {
    if (Number.#dollar === undefined) {
      Number.static$init();
      if (Number.#dollar === undefined) Number.#dollar = null;
    }
    return Number.#dollar;
  }

  static #byte = undefined;

  static byte() {
    if (Number.#byte === undefined) {
      Number.static$init();
      if (Number.#byte === undefined) Number.#byte = null;
    }
    return Number.#byte;
  }

  #float = sys.Float.make(0);

  // private field reflection only
  __float(it) { if (it === undefined) return this.#float; else this.#float = it; }

  #unitRef = null;

  // private field reflection only
  __unitRef(it) { if (it === undefined) return this.#unitRef; else this.#unitRef = it; }

  static fromStr(s, checked) {
    if (checked === undefined) checked = true;
    return Number.parse(s, false, checked);
  }

  static fromStrStrictUnit(s, checked) {
    if (checked === undefined) checked = true;
    return Number.parse(s, true, checked);
  }

  static parse(s, strictUnit, checked) {
    let msg = "Invalid format";
    let c = sys.Str.getSafe(s, 0);
    if ((sys.Int.isDigit(c) || (sys.ObjUtil.equals(c, 45) && sys.Int.isDigit(sys.Str.getSafe(s, 1))))) {
      try {
        let tokenizer = HaystackTokenizer.make(sys.Str.in(s));
        tokenizer.strictUnit(strictUnit);
        tokenizer.next();
        let val = tokenizer.val();
        if (tokenizer.next() !== HaystackToken.eof()) {
          throw sys.Err.make("Extra tokens");
        }
        ;
        if (sys.Int.isSpace(sys.Str.get(s, -1))) {
          throw sys.Err.make("Extra trailing space");
        }
        ;
        if (sys.ObjUtil.is(val, Number.type$)) {
          return sys.ObjUtil.coerce(val, Number.type$.toNullable());
        }
        ;
      }
      catch ($_u242) {
        $_u242 = sys.Err.make($_u242);
        if ($_u242 instanceof sys.Err) {
          let e = $_u242;
          ;
          (msg = e.msg());
        }
        else {
          throw $_u242;
        }
      }
      ;
    }
    else {
      if (sys.ObjUtil.equals(s, "INF")) {
        return Number.posInf();
      }
      ;
      if (sys.ObjUtil.equals(s, "-INF")) {
        return Number.negInf();
      }
      ;
      if (sys.ObjUtil.equals(s, "NaN")) {
        return Number.nan();
      }
      ;
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Number ", sys.Str.toCode(s)), " ("), msg), ")"));
    }
    ;
    return null;
  }

  static make(val, unit) {
    const $self = new Number();
    Number.make$($self, val, unit);
    return $self;
  }

  static make$($self, val, unit) {
    if (unit === undefined) unit = null;
    $self.#float = val;
    $self.#unitRef = unit;
    return;
  }

  static makeInt(val, unit) {
    if (unit === undefined) unit = null;
    if ((sys.ObjUtil.compareGE(val, 0) && sys.ObjUtil.compareLT(val, Number.intCache().size()) && unit == null)) {
      return Number.intCache().get(val);
    }
    ;
    return Number.make(sys.Num.toFloat(sys.ObjUtil.coerce(val, sys.Num.type$)), unit);
  }

  static makeNum(val, unit) {
    if (unit === undefined) unit = null;
    return Number.make(sys.Num.toFloat(val), unit);
  }

  static makeDuration(dur, unit) {
    const $self = new Number();
    Number.makeDuration$($self, dur, unit);
    return $self;
  }

  static makeDuration$($self, dur, unit) {
    if (unit === undefined) unit = Number.hr();
    if (unit == null) {
      if (sys.ObjUtil.compareLT(dur, sys.Duration.fromStr("1sec"))) {
        (unit = Number.ms());
      }
      else {
        if (sys.ObjUtil.compareLT(dur, sys.Duration.fromStr("1min"))) {
          (unit = Number.sec());
        }
        else {
          if (sys.ObjUtil.compareLT(dur, sys.Duration.fromStr("1hr"))) {
            (unit = Number.mins());
          }
          else {
            if (sys.ObjUtil.compareLT(dur, sys.Duration.fromStr("1day"))) {
              (unit = Number.hr());
            }
            else {
              (unit = Number.day());
            }
            ;
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    $self.#float = sys.Float.div(sys.Float.div(sys.Num.toFloat(sys.ObjUtil.coerce(dur.ticks(), sys.Num.type$)), sys.Float.make(1.0E9)), unit.scale());
    $self.#unitRef = unit;
    return;
  }

  toFloat() {
    return this.#float;
  }

  isInt() {
    return (sys.ObjUtil.equals(this.#float, sys.Float.floor(this.#float)) && sys.ObjUtil.compareLE(sys.Float.make(-1.0E12), this.#float) && sys.ObjUtil.compareLE(this.#float, sys.Float.make(1.0E12)));
  }

  toInt() {
    return sys.Num.toInt(sys.ObjUtil.coerce(this.#float, sys.Num.type$));
  }

  unit() {
    return this.#unitRef;
  }

  isDuration() {
    return this.toDurationMult() != null;
  }

  toDuration(checked) {
    if (checked === undefined) checked = true;
    let mult = this.toDurationMult();
    if (mult != null) {
      return sys.Duration.make(sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.mult(this.#float, sys.Num.toFloat(sys.ObjUtil.coerce(mult.ticks(), sys.Num.type$))), sys.Num.type$)));
    }
    ;
    if (checked) {
      throw UnitErr.make(sys.Str.plus("Not duration unit: ", this));
    }
    ;
    return null;
  }

  toDurationMult() {
    if (this.unit() === Number.hr()) {
      return sys.Duration.fromStr("1hr");
    }
    ;
    if (this.unit() === Number.mins()) {
      return sys.Duration.fromStr("1min");
    }
    ;
    if (this.unit() === Number.sec()) {
      return sys.Duration.fromStr("1sec");
    }
    ;
    if (this.unit() === Number.day()) {
      return sys.Duration.fromStr("1day");
    }
    ;
    if (this.unit() === Number.mo()) {
      return sys.Duration.fromStr("30day");
    }
    ;
    if (this.unit() === Number.week()) {
      return sys.Duration.fromStr("7day");
    }
    ;
    if (this.unit() === Number.year()) {
      return sys.Duration.fromStr("365day");
    }
    ;
    if (this.unit() === Number.ms()) {
      return sys.Duration.fromStr("1ms");
    }
    ;
    if (this.unit() === Number.us()) {
      return sys.Duration.fromStr("1000ns");
    }
    ;
    if (this.unit() === Number.ns()) {
      return sys.Duration.fromStr("1ns");
    }
    ;
    return null;
  }

  toBytes(checked) {
    if (checked === undefined) checked = true;
    let mult = -1;
    let $_u243 = ((this$) => { let $_u244 = this$.unit(); if ($_u244 == null) return null; return this$.unit().name(); })(this);
    if (sys.ObjUtil.equals($_u243, "byte")) {
      (mult = 1);
    }
    else if (sys.ObjUtil.equals($_u243, "kilobyte")) {
      (mult = 1024);
    }
    else if (sys.ObjUtil.equals($_u243, "megabyte")) {
      (mult = 1048576);
    }
    else if (sys.ObjUtil.equals($_u243, "gigabyte")) {
      (mult = 1073741824);
    }
    else if (sys.ObjUtil.equals($_u243, "terabyte")) {
      (mult = 1099511627776);
    }
    ;
    if (sys.ObjUtil.compareGE(mult, 1)) {
      return sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.mult(this.#float, sys.Num.toFloat(sys.ObjUtil.coerce(mult, sys.Num.type$))), sys.Num.type$)), sys.Int.type$.toNullable());
    }
    ;
    if (checked) {
      throw UnitErr.make(sys.Str.plus("Not bytes unit: ", this));
    }
    ;
    return null;
  }

  hash() {
    return sys.Float.hash(this.#float);
  }

  equals(that) {
    let x = sys.ObjUtil.as(that, Number.type$);
    if (x == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(sys.ObjUtil.compare(this.#float, sys.ObjUtil.coerce(x.#float, sys.Obj.type$)), 0) && this.unit() === x.unit());
  }

  compare(that) {
    let x = sys.ObjUtil.coerce(that, Number.type$);
    if ((this.unit() !== x.unit() && this.unit() != null && x.unit() != null)) {
      if ((this.isDuration() && x.isDuration())) {
        return sys.ObjUtil.compare(this.toDuration(), x.toDuration());
      }
      ;
      throw UnitErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.unit()), " <=> "), x.unit()));
    }
    ;
    return sys.ObjUtil.compare(this.#float, x.#float);
  }

  approx(that, tolerance) {
    if (tolerance === undefined) tolerance = null;
    if (this.unit() !== that.unit()) {
      return false;
    }
    ;
    return sys.Float.approx(this.#float, that.#float, tolerance);
  }

  isNegative() {
    return sys.ObjUtil.compareLT(this.#float, sys.Float.make(0.0));
  }

  isNaN() {
    return sys.Float.isNaN(this.#float);
  }

  isSpecial() {
    return (sys.ObjUtil.equals(this.#float, sys.Float.posInf()) || sys.ObjUtil.equals(this.#float, sys.Float.negInf()) || sys.Float.isNaN(this.#float));
  }

  toStr() {
    let s = ((this$) => { if (this$.isInt()) return sys.Int.toStr(this$.toInt()); return sys.Float.toStr(this$.#float); })(this);
    if ((this.unit() != null && !this.isSpecial())) {
      s = sys.Str.plus(s, this.unit().symbol());
    }
    ;
    return s;
  }

  toJson() {
    let s = sys.StrBuf.make(32);
    s.addChar(110).addChar(58);
    if (this.isInt()) {
      s.add(sys.Int.toStr(this.toInt()));
    }
    else {
      s.add(sys.Float.toStr(this.#float));
    }
    ;
    if ((this.unit() != null && !this.isSpecial())) {
      s.addChar(32).add(this.unit().symbol());
    }
    ;
    return s.toStr();
  }

  toCode() {
    return this.toStr();
  }

  negate() {
    return Number.make(sys.Float.negate(this.#float), this.unit());
  }

  increment() {
    return Number.make(sys.Float.plus(this.#float, sys.Float.make(1.0)), this.unit());
  }

  decrement() {
    return Number.make(sys.Float.minus(this.#float, sys.Float.make(1.0)), this.unit());
  }

  plus(b) {
    return Number.make(sys.Float.plus(this.#float, b.#float), Number.plusUnit(this.unit(), b.unit()));
  }

  static plusUnit(a, b) {
    if (b == null) {
      return a;
    }
    ;
    if (a == null) {
      return b;
    }
    ;
    if (a === b) {
      return a;
    }
    ;
    if (((a === Number.F() && b === Number.Fdeg()) || (a === Number.Fdeg() && b === Number.F()))) {
      return Number.F();
    }
    ;
    if (((a === Number.C() && b === Number.Cdeg()) || (a === Number.Cdeg() && b === Number.C()))) {
      return Number.C();
    }
    ;
    throw UnitErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", a), " + "), b));
  }

  minus(b) {
    return Number.make(sys.Float.minus(this.#float, b.#float), Number.minusUnit(this.unit(), b.unit()));
  }

  static minusUnit(a, b) {
    if (b == null) {
      return a;
    }
    ;
    if (a == null) {
      return b;
    }
    ;
    if ((a === Number.F() && b === Number.F())) {
      return Number.Fdeg();
    }
    ;
    if ((a === Number.C() && b === Number.C())) {
      return Number.Cdeg();
    }
    ;
    if ((a === Number.F() && b === Number.Fdeg())) {
      return Number.F();
    }
    ;
    if ((a === Number.C() && b === Number.Cdeg())) {
      return Number.C();
    }
    ;
    if (a === b) {
      return a;
    }
    ;
    throw UnitErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", a), " - "), b));
  }

  mult(b) {
    return Number.make(sys.Float.mult(this.#float, b.#float), Number.multUnit(this.unit(), b.unit()));
  }

  static multUnit(a, b) {
    if (b == null) {
      return a;
    }
    ;
    if (a == null) {
      return b;
    }
    ;
    try {
      return a.mult(sys.ObjUtil.coerce(b, sys.Unit.type$));
    }
    catch ($_u246) {
      return Number.defineUnit(sys.ObjUtil.coerce(a, sys.Unit.type$), 95, sys.ObjUtil.coerce(b, sys.Unit.type$));
    }
    ;
  }

  div(b) {
    return Number.make(sys.Float.div(this.#float, b.#float), Number.divUnit(this.unit(), b.unit()));
  }

  static divUnit(a, b) {
    if (b == null) {
      return a;
    }
    ;
    if (a == null) {
      return b;
    }
    ;
    try {
      return a.div(sys.ObjUtil.coerce(b, sys.Unit.type$));
    }
    catch ($_u247) {
      return Number.defineUnit(sys.ObjUtil.coerce(a, sys.Unit.type$), 47, sys.ObjUtil.coerce(b, sys.Unit.type$));
    }
    ;
  }

  mod(b) {
    if (b.unit() != null) {
      throw UnitErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.unit()), " % "), b));
    }
    ;
    return Number.make(sys.Float.mod(this.#float, b.#float), this.unit());
  }

  static defineUnit(a, symbol, b) {
    let s = sys.StrBuf.make();
    let aStr = a.toStr();
    if (sys.Str.startsWith(aStr, "_")) {
      s.add(aStr);
    }
    else {
      s.addChar(95).add(aStr);
    }
    ;
    s.addChar(symbol);
    let bStr = b.toStr();
    if (sys.Str.startsWith(bStr, "_")) {
      (bStr = sys.Str.getRange(bStr, sys.Range.make(1, -1)));
    }
    ;
    s.add(bStr);
    let str = s.toStr();
    let unit = sys.Unit.fromStr(str, false);
    if (unit == null) {
      (unit = sys.Unit.define(str));
    }
    ;
    return sys.ObjUtil.coerce(unit, sys.Unit.type$);
  }

  static loadUnit(str, checked) {
    if (checked === undefined) checked = false;
    let unit = sys.Unit.fromStr(str, false);
    if (unit != null) {
      return unit;
    }
    ;
    if ((!sys.Str.isEmpty(str) && sys.ObjUtil.equals(sys.Str.get(str, 0), 95))) {
      try {
        return sys.Unit.define(str);
      }
      catch ($_u248) {
        $_u248 = sys.Err.make($_u248);
        if ($_u248 instanceof sys.Err) {
          let e = $_u248;
          ;
          return sys.Unit.fromStr(str, checked);
        }
        else {
          throw $_u248;
        }
      }
      ;
    }
    ;
    if (checked) {
      throw sys.Err.make(sys.Str.plus("Unit not defined: ", sys.Str.toCode(str)));
    }
    ;
    return null;
  }

  abs() {
    return ((this$) => { if (sys.ObjUtil.compareGE(this$.#float, sys.Float.make(0.0))) return this$; return Number.make(sys.Float.negate(this$.#float), this$.unit()); })(this);
  }

  min(that) {
    return ((this$) => { if (sys.ObjUtil.compareLE(sys.ObjUtil.compare(this$.#float, that.#float), 0)) return this$; return that; })(this);
  }

  max(that) {
    return ((this$) => { if (sys.ObjUtil.compareGE(sys.ObjUtil.compare(this$.#float, that.#float), 0)) return this$; return that; })(this);
  }

  clamp(min, max) {
    if (((this.unit() !== min.unit() && min.unit() != null) || (this.unit() !== max.unit() && max.unit() != null))) {
      throw UnitErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("clamp(", this), ", "), min), ", "), max), ")"));
    }
    ;
    if (sys.ObjUtil.compareLT(sys.ObjUtil.compare(this.#float, min.#float), 0)) {
      if (this.unit() === min.unit()) {
        return min;
      }
      ;
      return Number.make(min.#float, this.unit());
    }
    ;
    if (sys.ObjUtil.compareGT(sys.ObjUtil.compare(this.#float, max.#float), 0)) {
      if (this.unit() === max.unit()) {
        return max;
      }
      ;
      return Number.make(max.#float, this.unit());
    }
    ;
    return this;
  }

  upper() {
    let int = this.toInt();
    let up = sys.Int.upper(int);
    if (sys.ObjUtil.equals(int, up)) {
      return this;
    }
    ;
    return sys.ObjUtil.coerce(Number.makeInt(up, this.unit()), Number.type$);
  }

  lower() {
    let int = this.toInt();
    let lo = sys.Int.lower(int);
    if (sys.ObjUtil.equals(int, lo)) {
      return this;
    }
    ;
    return sys.ObjUtil.coerce(Number.makeInt(lo, this.unit()), Number.type$);
  }

  toLocale(pattern) {
    if (pattern === undefined) pattern = null;
    return NumberFormat.make(pattern).format(this);
  }

  static constUnit(name) {
    return sys.ObjUtil.coerce(((this$) => { let $_u252 = sys.Unit.fromStr(name, false); if ($_u252 != null) return $_u252; return sys.Unit.define(name); })(this), sys.Unit.type$);
  }

  static static$init() {
    Number.#defVal = Number.make(sys.Float.make(0.0));
    Number.#negOne = Number.make(sys.Float.make(-1.0));
    Number.#zero = Number.make(sys.Float.make(0.0));
    Number.#one = Number.make(sys.Float.make(1.0));
    Number.#ten = Number.make(sys.Float.make(10.0));
    Number.#nan = Number.make(sys.Float.nan());
    Number.#posInf = Number.make(sys.Float.posInf());
    Number.#negInf = Number.make(sys.Float.negInf());
    if (true) {
      let cache = sys.List.make(Number.type$);
      let cacheSize = ((this$) => { if (sys.ObjUtil.equals(sys.Env.cur().runtime(), "js")) return 5; return 200; })(this);
      cache.capacity(cacheSize);
      for (let i = 0; sys.ObjUtil.compareLT(i, cacheSize); i = sys.Int.increment(i)) {
        cache.add(Number.make(sys.Num.toFloat(sys.ObjUtil.coerce(i, sys.Num.type$)), null));
      }
      ;
      Number.#intCache = sys.ObjUtil.coerce(((this$) => { let $_u254 = cache; if ($_u254 == null) return null; return sys.ObjUtil.toImmutable(cache); })(this), sys.Type.find("haystack::Number[]"));
    }
    ;
    Number.#F = Number.constUnit("fahrenheit");
    Number.#C = Number.constUnit("celsius");
    Number.#Fdeg = Number.constUnit("fahrenheit_degrees");
    Number.#Cdeg = Number.constUnit("celsius_degrees");
    Number.#FdegDay = Number.constUnit("degree_days_fahrenheit");
    Number.#CdegDay = Number.constUnit("degree_days_celsius");
    Number.#ns = Number.constUnit("ns");
    Number.#us = Number.constUnit("\u00b5s");
    Number.#ms = Number.constUnit("ms");
    Number.#sec = Number.constUnit("s");
    Number.#mins = Number.constUnit("min");
    Number.#hr = Number.constUnit("h");
    Number.#day = Number.constUnit("day");
    Number.#week = Number.constUnit("wk");
    Number.#mo = Number.constUnit("mo");
    Number.#year = Number.constUnit("year");
    Number.#percent = Number.constUnit("%");
    Number.#dollar = Number.constUnit("\$");
    Number.#byte = Number.constUnit("byte");
    return;
  }

}

class BrioCtrl {
  constructor() {
    const this$ = this;
  }

  typeof() { return BrioCtrl.type$; }

  static #ctrlNull = undefined;

  static ctrlNull() {
    if (BrioCtrl.#ctrlNull === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlNull === undefined) BrioCtrl.#ctrlNull = 0;
    }
    return BrioCtrl.#ctrlNull;
  }

  static #ctrlMarker = undefined;

  static ctrlMarker() {
    if (BrioCtrl.#ctrlMarker === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlMarker === undefined) BrioCtrl.#ctrlMarker = 0;
    }
    return BrioCtrl.#ctrlMarker;
  }

  static #ctrlNA = undefined;

  static ctrlNA() {
    if (BrioCtrl.#ctrlNA === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlNA === undefined) BrioCtrl.#ctrlNA = 0;
    }
    return BrioCtrl.#ctrlNA;
  }

  static #ctrlRemove = undefined;

  static ctrlRemove() {
    if (BrioCtrl.#ctrlRemove === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlRemove === undefined) BrioCtrl.#ctrlRemove = 0;
    }
    return BrioCtrl.#ctrlRemove;
  }

  static #ctrlFalse = undefined;

  static ctrlFalse() {
    if (BrioCtrl.#ctrlFalse === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlFalse === undefined) BrioCtrl.#ctrlFalse = 0;
    }
    return BrioCtrl.#ctrlFalse;
  }

  static #ctrlTrue = undefined;

  static ctrlTrue() {
    if (BrioCtrl.#ctrlTrue === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlTrue === undefined) BrioCtrl.#ctrlTrue = 0;
    }
    return BrioCtrl.#ctrlTrue;
  }

  static #ctrlNumberI2 = undefined;

  static ctrlNumberI2() {
    if (BrioCtrl.#ctrlNumberI2 === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlNumberI2 === undefined) BrioCtrl.#ctrlNumberI2 = 0;
    }
    return BrioCtrl.#ctrlNumberI2;
  }

  static #ctrlNumberI4 = undefined;

  static ctrlNumberI4() {
    if (BrioCtrl.#ctrlNumberI4 === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlNumberI4 === undefined) BrioCtrl.#ctrlNumberI4 = 0;
    }
    return BrioCtrl.#ctrlNumberI4;
  }

  static #ctrlNumberF8 = undefined;

  static ctrlNumberF8() {
    if (BrioCtrl.#ctrlNumberF8 === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlNumberF8 === undefined) BrioCtrl.#ctrlNumberF8 = 0;
    }
    return BrioCtrl.#ctrlNumberF8;
  }

  static #ctrlStr = undefined;

  static ctrlStr() {
    if (BrioCtrl.#ctrlStr === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlStr === undefined) BrioCtrl.#ctrlStr = 0;
    }
    return BrioCtrl.#ctrlStr;
  }

  static #ctrlRefStr = undefined;

  static ctrlRefStr() {
    if (BrioCtrl.#ctrlRefStr === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlRefStr === undefined) BrioCtrl.#ctrlRefStr = 0;
    }
    return BrioCtrl.#ctrlRefStr;
  }

  static #ctrlRefI8 = undefined;

  static ctrlRefI8() {
    if (BrioCtrl.#ctrlRefI8 === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlRefI8 === undefined) BrioCtrl.#ctrlRefI8 = 0;
    }
    return BrioCtrl.#ctrlRefI8;
  }

  static #ctrlUri = undefined;

  static ctrlUri() {
    if (BrioCtrl.#ctrlUri === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlUri === undefined) BrioCtrl.#ctrlUri = 0;
    }
    return BrioCtrl.#ctrlUri;
  }

  static #ctrlDate = undefined;

  static ctrlDate() {
    if (BrioCtrl.#ctrlDate === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlDate === undefined) BrioCtrl.#ctrlDate = 0;
    }
    return BrioCtrl.#ctrlDate;
  }

  static #ctrlTime = undefined;

  static ctrlTime() {
    if (BrioCtrl.#ctrlTime === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlTime === undefined) BrioCtrl.#ctrlTime = 0;
    }
    return BrioCtrl.#ctrlTime;
  }

  static #ctrlDateTimeI4 = undefined;

  static ctrlDateTimeI4() {
    if (BrioCtrl.#ctrlDateTimeI4 === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlDateTimeI4 === undefined) BrioCtrl.#ctrlDateTimeI4 = 0;
    }
    return BrioCtrl.#ctrlDateTimeI4;
  }

  static #ctrlDateTimeI8 = undefined;

  static ctrlDateTimeI8() {
    if (BrioCtrl.#ctrlDateTimeI8 === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlDateTimeI8 === undefined) BrioCtrl.#ctrlDateTimeI8 = 0;
    }
    return BrioCtrl.#ctrlDateTimeI8;
  }

  static #ctrlCoord = undefined;

  static ctrlCoord() {
    if (BrioCtrl.#ctrlCoord === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlCoord === undefined) BrioCtrl.#ctrlCoord = 0;
    }
    return BrioCtrl.#ctrlCoord;
  }

  static #ctrlXStr = undefined;

  static ctrlXStr() {
    if (BrioCtrl.#ctrlXStr === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlXStr === undefined) BrioCtrl.#ctrlXStr = 0;
    }
    return BrioCtrl.#ctrlXStr;
  }

  static #ctrlBuf = undefined;

  static ctrlBuf() {
    if (BrioCtrl.#ctrlBuf === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlBuf === undefined) BrioCtrl.#ctrlBuf = 0;
    }
    return BrioCtrl.#ctrlBuf;
  }

  static #ctrlDictEmpty = undefined;

  static ctrlDictEmpty() {
    if (BrioCtrl.#ctrlDictEmpty === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlDictEmpty === undefined) BrioCtrl.#ctrlDictEmpty = 0;
    }
    return BrioCtrl.#ctrlDictEmpty;
  }

  static #ctrlDict = undefined;

  static ctrlDict() {
    if (BrioCtrl.#ctrlDict === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlDict === undefined) BrioCtrl.#ctrlDict = 0;
    }
    return BrioCtrl.#ctrlDict;
  }

  static #ctrlListEmpty = undefined;

  static ctrlListEmpty() {
    if (BrioCtrl.#ctrlListEmpty === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlListEmpty === undefined) BrioCtrl.#ctrlListEmpty = 0;
    }
    return BrioCtrl.#ctrlListEmpty;
  }

  static #ctrlList = undefined;

  static ctrlList() {
    if (BrioCtrl.#ctrlList === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlList === undefined) BrioCtrl.#ctrlList = 0;
    }
    return BrioCtrl.#ctrlList;
  }

  static #ctrlGrid = undefined;

  static ctrlGrid() {
    if (BrioCtrl.#ctrlGrid === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlGrid === undefined) BrioCtrl.#ctrlGrid = 0;
    }
    return BrioCtrl.#ctrlGrid;
  }

  static #ctrlSymbol = undefined;

  static ctrlSymbol() {
    if (BrioCtrl.#ctrlSymbol === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlSymbol === undefined) BrioCtrl.#ctrlSymbol = 0;
    }
    return BrioCtrl.#ctrlSymbol;
  }

  static #ctrlDateTimeF8 = undefined;

  static ctrlDateTimeF8() {
    if (BrioCtrl.#ctrlDateTimeF8 === undefined) {
      BrioCtrl.static$init();
      if (BrioCtrl.#ctrlDateTimeF8 === undefined) BrioCtrl.#ctrlDateTimeF8 = 0;
    }
    return BrioCtrl.#ctrlDateTimeF8;
  }

  static static$init() {
    BrioCtrl.#ctrlNull = 0;
    BrioCtrl.#ctrlMarker = 1;
    BrioCtrl.#ctrlNA = 2;
    BrioCtrl.#ctrlRemove = 3;
    BrioCtrl.#ctrlFalse = 4;
    BrioCtrl.#ctrlTrue = 5;
    BrioCtrl.#ctrlNumberI2 = 6;
    BrioCtrl.#ctrlNumberI4 = 7;
    BrioCtrl.#ctrlNumberF8 = 8;
    BrioCtrl.#ctrlStr = 9;
    BrioCtrl.#ctrlRefStr = 10;
    BrioCtrl.#ctrlRefI8 = 11;
    BrioCtrl.#ctrlUri = 12;
    BrioCtrl.#ctrlDate = 13;
    BrioCtrl.#ctrlTime = 14;
    BrioCtrl.#ctrlDateTimeI4 = 15;
    BrioCtrl.#ctrlDateTimeI8 = 16;
    BrioCtrl.#ctrlCoord = 17;
    BrioCtrl.#ctrlXStr = 18;
    BrioCtrl.#ctrlBuf = 19;
    BrioCtrl.#ctrlDictEmpty = 20;
    BrioCtrl.#ctrlDict = 21;
    BrioCtrl.#ctrlListEmpty = 22;
    BrioCtrl.#ctrlList = 23;
    BrioCtrl.#ctrlGrid = 24;
    BrioCtrl.#ctrlSymbol = 25;
    BrioCtrl.#ctrlDateTimeF8 = 32;
    return;
  }

}

class BrioWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#encodeRefDis = true;
    return;
  }

  typeof() { return BrioWriter.type$; }

  static ctrlDateTimeF8() { return BrioCtrl.ctrlDateTimeF8(); }

  static ctrlDict() { return BrioCtrl.ctrlDict(); }

  static ctrlMarker() { return BrioCtrl.ctrlMarker(); }

  static ctrlNumberI2() { return BrioCtrl.ctrlNumberI2(); }

  static ctrlDictEmpty() { return BrioCtrl.ctrlDictEmpty(); }

  static ctrlNumberI4() { return BrioCtrl.ctrlNumberI4(); }

  static ctrlTrue() { return BrioCtrl.ctrlTrue(); }

  static ctrlTime() { return BrioCtrl.ctrlTime(); }

  static ctrlGrid() { return BrioCtrl.ctrlGrid(); }

  static ctrlNull() { return BrioCtrl.ctrlNull(); }

  static ctrlRefStr() { return BrioCtrl.ctrlRefStr(); }

  static ctrlNumberF8() { return BrioCtrl.ctrlNumberF8(); }

  static ctrlNA() { return BrioCtrl.ctrlNA(); }

  static ctrlFalse() { return BrioCtrl.ctrlFalse(); }

  static ctrlDateTimeI4() { return BrioCtrl.ctrlDateTimeI4(); }

  static ctrlListEmpty() { return BrioCtrl.ctrlListEmpty(); }

  static ctrlList() { return BrioCtrl.ctrlList(); }

  static ctrlSymbol() { return BrioCtrl.ctrlSymbol(); }

  static ctrlXStr() { return BrioCtrl.ctrlXStr(); }

  static ctrlDateTimeI8() { return BrioCtrl.ctrlDateTimeI8(); }

  static ctrlRemove() { return BrioCtrl.ctrlRemove(); }

  static ctrlUri() { return BrioCtrl.ctrlUri(); }

  static ctrlRefI8() { return BrioCtrl.ctrlRefI8(); }

  static ctrlStr() { return BrioCtrl.ctrlStr(); }

  static ctrlDate() { return BrioCtrl.ctrlDate(); }

  static ctrlBuf() { return BrioCtrl.ctrlBuf(); }

  static ctrlCoord() { return BrioCtrl.ctrlCoord(); }

  static #js = undefined;

  static js() {
    if (BrioWriter.#js === undefined) {
      BrioWriter.static$init();
      if (BrioWriter.#js === undefined) BrioWriter.#js = false;
    }
    return BrioWriter.#js;
  }

  #encodeRefToRel = null;

  encodeRefToRel(it) {
    if (it === undefined) {
      return this.#encodeRefToRel;
    }
    else {
      this.#encodeRefToRel = it;
      return;
    }
  }

  #encodeRefDis = false;

  encodeRefDis(it) {
    if (it === undefined) {
      return this.#encodeRefDis;
    }
    else {
      this.#encodeRefDis = it;
      return;
    }
  }

  #maxStrCode = 0;

  maxStrCode(it) {
    if (it === undefined) {
      return this.#maxStrCode;
    }
    else {
      this.#maxStrCode = it;
      return;
    }
  }

  #encodeUnknownAsStr = false;

  encodeUnknownAsStr(it) {
    if (it === undefined) {
      return this.#encodeUnknownAsStr;
    }
    else {
      this.#encodeUnknownAsStr = it;
      return;
    }
  }

  #cp = null;

  // private field reflection only
  __cp(it) { if (it === undefined) return this.#cp; else this.#cp = it; }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  static valToBuf(val) {
    let buf = sys.Buf.make();
    BrioWriter.make(buf.out()).writeVal(val);
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$);
  }

  static make(out) {
    const $self = new BrioWriter();
    BrioWriter.make$($self, out);
    return $self;
  }

  static make$($self, out) {
    ;
    $self.#out = out;
    $self.#cp = BrioConsts.cur();
    $self.#maxStrCode = $self.#cp.maxSafeCode();
    return;
  }

  close() {
    return this.#out.close();
  }

  writeVal(val) {
    if (val == null) {
      return this.writeNull();
    }
    ;
    if (val === Marker.val()) {
      return this.writeMarker();
    }
    ;
    if (val === NA.val()) {
      return this.writeNA();
    }
    ;
    if (val === Remove.val()) {
      return this.writeRemove();
    }
    ;
    let type = sys.ObjUtil.typeof(val);
    if (type === sys.Bool.type$) {
      return this.writeBool(sys.ObjUtil.coerce(val, sys.Bool.type$));
    }
    ;
    if (type === Number.type$) {
      return this.writeNumber(sys.ObjUtil.coerce(val, Number.type$));
    }
    ;
    if (type === sys.Str.type$) {
      return this.writeStr(sys.ObjUtil.coerce(val, sys.Str.type$));
    }
    ;
    if (type === Ref.type$) {
      return this.writeRef(sys.ObjUtil.coerce(val, Ref.type$));
    }
    ;
    if (type === sys.DateTime.type$) {
      return this.writeDateTime(sys.ObjUtil.coerce(val, sys.DateTime.type$));
    }
    ;
    if (Symbol.fits(type)) {
      return this.writeSymbol(sys.ObjUtil.coerce(val, Symbol.type$));
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
    if (type === Coord.type$) {
      return this.writeCoord(sys.ObjUtil.coerce(val, Coord.type$));
    }
    ;
    if (type === XStr.type$) {
      return this.writeXStr(sys.ObjUtil.coerce(val, XStr.type$));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Buf.type$)) {
      return this.writeBuf(sys.ObjUtil.coerce(val, sys.Buf.type$));
    }
    ;
    if (sys.ObjUtil.is(val, Dict.type$)) {
      return this.writeDict(sys.ObjUtil.coerce(val, Dict.type$));
    }
    ;
    if (sys.ObjUtil.is(val, Grid.type$)) {
      return sys.ObjUtil.coerce(this.writeGrid(sys.ObjUtil.coerce(val, Grid.type$)), BrioWriter.type$);
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return this.writeList(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]")));
    }
    ;
    if (sys.ObjUtil.is(val, BrioPreEncoded.type$)) {
      return this.writePreEncoded(sys.ObjUtil.coerce(val, BrioPreEncoded.type$));
    }
    ;
    if (this.#encodeUnknownAsStr) {
      return this.writeStr(sys.ObjUtil.toStr(val));
    }
    ;
    return this.writeXStr(sys.ObjUtil.coerce(XStr.encode(sys.ObjUtil.coerce(val, sys.Obj.type$)), XStr.type$));
  }

  writeNull() {
    this.#out.write(BrioCtrl.ctrlNull());
    return this;
  }

  writeMarker() {
    this.#out.write(BrioCtrl.ctrlMarker());
    return this;
  }

  writeNA() {
    this.#out.write(BrioCtrl.ctrlNA());
    return this;
  }

  writeRemove() {
    this.#out.write(BrioCtrl.ctrlRemove());
    return this;
  }

  writeBool(val) {
    this.#out.write(((this$) => { if (val) return BrioCtrl.ctrlTrue(); return BrioCtrl.ctrlFalse(); })(this));
    return this;
  }

  writeNumber(val) {
    let unit = ((this$) => { let $_u256 = ((this$) => { let $_u257 = val.unit(); if ($_u257 == null) return null; return val.unit().symbol(); })(this$); if ($_u256 != null) return $_u256; return ""; })(this);
    if (val.isInt()) {
      let i = val.toInt();
      if ((sys.ObjUtil.compareLE(-32767, i) && sys.ObjUtil.compareLE(i, 32767))) {
        this.#out.write(BrioCtrl.ctrlNumberI2());
        this.#out.writeI2(i);
        this.encodeStr(sys.ObjUtil.coerce(unit, sys.Str.type$));
        return this;
      }
      ;
      if ((sys.ObjUtil.compareLE(-2147483648, i) && sys.ObjUtil.compareLE(i, 2147483647))) {
        this.#out.write(BrioCtrl.ctrlNumberI4());
        this.#out.writeI4(i);
        this.encodeStr(sys.ObjUtil.coerce(unit, sys.Str.type$));
        return this;
      }
      ;
    }
    ;
    this.#out.write(BrioCtrl.ctrlNumberF8());
    this.#out.writeF8(val.toFloat());
    this.encodeStr(sys.ObjUtil.coerce(unit, sys.Str.type$));
    return this;
  }

  writeStr(val) {
    this.#out.write(BrioCtrl.ctrlStr());
    this.encodeStr(val);
    return this;
  }

  writeUri(val) {
    this.#out.write(BrioCtrl.ctrlUri());
    this.encodeStr(val.toStr());
    return this;
  }

  writeRef(val) {
    (val = val.toRel(this.#encodeRefToRel));
    return this.writeRefId(val).writeRefDis(val);
  }

  writeRefId(val) {
    let i8 = this.refToI8(val);
    if (sys.ObjUtil.compareGE(i8, 0)) {
      this.#out.write(BrioCtrl.ctrlRefI8());
      this.#out.writeI8(i8);
      return this;
    }
    ;
    this.#out.write(BrioCtrl.ctrlRefStr());
    this.encodeStr(val.id());
    return this;
  }

  refToI8(val) {
    try {
      let id = val.id();
      if ((sys.ObjUtil.compareNE(sys.Str.size(id), 17) || sys.ObjUtil.compareNE(sys.Str.get(id, 8), 45) || BrioWriter.js())) {
        return -1;
      }
      ;
      let i8 = 0;
      for (let i = 0; sys.ObjUtil.compareLT(i, 17); i = sys.Int.increment(i)) {
        if (sys.ObjUtil.equals(i, 8)) {
          continue;
        }
        ;
        (i8 = sys.Int.or(sys.Int.shiftl(i8, 4), sys.ObjUtil.coerce(sys.Int.fromDigit(sys.Str.get(id, i), 16), sys.Int.type$)));
      }
      ;
      return i8;
    }
    catch ($_u258) {
      $_u258 = sys.Err.make($_u258);
      if ($_u258 instanceof sys.Err) {
        let e = $_u258;
        ;
        return -1;
      }
      else {
        throw $_u258;
      }
    }
    ;
  }

  writeRefDis(val) {
    let dis = val.disVal();
    if ((dis == null || !this.#encodeRefDis)) {
      (dis = "");
    }
    ;
    this.encodeStrChars(sys.ObjUtil.coerce(dis, sys.Str.type$));
    return this;
  }

  writeSymbol(val) {
    this.#out.write(BrioCtrl.ctrlSymbol());
    this.encodeStr(val.toStr());
    return this;
  }

  writeDate(val) {
    this.#out.write(BrioCtrl.ctrlDate());
    this.#out.writeI2(val.year()).write(sys.Int.plus(val.month().ordinal(), 1)).write(val.day());
    return this;
  }

  writeTime(val) {
    this.#out.write(BrioCtrl.ctrlTime());
    this.#out.writeI4(sys.Int.div(val.toDuration().ticks(), 1000000));
    return this;
  }

  writeDateTime(val) {
    let ticks = val.ticks();
    if (sys.ObjUtil.equals(sys.Int.mod(ticks, 1000000000), 0)) {
      this.#out.write(BrioCtrl.ctrlDateTimeI4());
      this.#out.writeI4(sys.Int.div(val.ticks(), 1000000000));
      this.encodeStr(val.tz().name());
    }
    else {
      if (BrioWriter.js()) {
        this.#out.write(BrioCtrl.ctrlDateTimeF8());
        this.#out.writeF8(sys.Num.toFloat(sys.ObjUtil.coerce(val.ticks(), sys.Num.type$)));
        this.encodeStr(val.tz().name());
      }
      else {
        this.#out.write(BrioCtrl.ctrlDateTimeI8());
        this.#out.writeI8(val.ticks());
        this.encodeStr(val.tz().name());
      }
      ;
    }
    ;
    return this;
  }

  writeCoord(val) {
    this.#out.write(BrioCtrl.ctrlCoord());
    this.#out.writeI4(val.packLat());
    this.#out.writeI4(val.packLng());
    return this;
  }

  writeXStr(val) {
    this.#out.write(BrioCtrl.ctrlXStr());
    this.encodeStr(val.type());
    this.encodeStr(val.val());
    return this;
  }

  writeBuf(buf) {
    this.#out.write(BrioCtrl.ctrlBuf());
    this.encodeVarInt(buf.size());
    this.#out.writeBuf(buf);
    return this;
  }

  writeDict(dict) {
    const this$ = this;
    if (dict.isEmpty()) {
      this.#out.write(BrioCtrl.ctrlDictEmpty());
      return this;
    }
    ;
    this.#out.write(BrioCtrl.ctrlDict());
    this.#out.write(123);
    let count = 0;
    dict.each((val, name) => {
      ((this$) => { let $_u259 = count; count = sys.Int.increment(count); return $_u259; })(this$);
      return;
    });
    this.encodeVarInt(count);
    dict.each((val, name) => {
      this$.encodeStr(name);
      this$.writeVal(val);
      return;
    });
    this.#out.write(125);
    return this;
  }

  writeList(list) {
    const this$ = this;
    if (list.isEmpty()) {
      this.#out.write(BrioCtrl.ctrlListEmpty());
      return this;
    }
    ;
    this.#out.write(BrioCtrl.ctrlList());
    this.#out.write(91);
    this.encodeVarInt(list.size());
    list.each((val) => {
      this$.writeVal(val);
      return;
    });
    this.#out.write(93);
    return this;
  }

  writeGrid(grid) {
    const this$ = this;
    this.#out.write(BrioCtrl.ctrlGrid());
    this.#out.write(60);
    let cols = grid.cols();
    this.encodeVarInt(cols.size());
    this.encodeVarInt(grid.size());
    this.writeDict(grid.meta());
    cols.each((col) => {
      this$.encodeStr(col.name());
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
    this.#out.write(62);
    return this;
  }

  writePreEncoded(x) {
    this.#out.writeBuf(x.buf().seek(0));
    return this;
  }

  encodeStr(val) {
    let code = this.#cp.encode(val, this.#maxStrCode);
    if (code != null) {
      this.encodeVarInt(sys.ObjUtil.coerce(code, sys.Int.type$));
    }
    else {
      this.encodeVarInt(-1);
      this.encodeStrChars(val);
    }
    ;
    return;
  }

  encodeStrChars(val) {
    this.encodeVarInt(sys.Str.size(val));
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(val)); i = sys.Int.increment(i)) {
      this.#out.writeChar(sys.Str.get(val, i));
    }
    ;
    return;
  }

  encodeVarInt(val) {
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

  static static$init() {
    BrioWriter.#js = sys.ObjUtil.equals(sys.Env.cur().runtime(), "js");
    return;
  }

}

class DateSpan extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DateSpan.type$; }

  #start = null;

  start() { return this.#start; }

  __start(it) { if (it === undefined) return this.#start; else this.#start = it; }

  #end = null;

  end() { return this.#end; }

  __end(it) { if (it === undefined) return this.#end; else this.#end = it; }

  #period = null;

  period() { return this.#period; }

  __period(it) { if (it === undefined) return this.#period; else this.#period = it; }

  #numDays = 0;

  numDays() { return this.#numDays; }

  __numDays(it) { if (it === undefined) return this.#numDays; else this.#numDays = it; }

  static #factories = undefined;

  static factories() {
    if (DateSpan.#factories === undefined) {
      DateSpan.static$init();
      if (DateSpan.#factories === undefined) DateSpan.#factories = null;
    }
    return DateSpan.#factories;
  }

  static #day = undefined;

  static day() {
    if (DateSpan.#day === undefined) {
      DateSpan.static$init();
      if (DateSpan.#day === undefined) DateSpan.#day = null;
    }
    return DateSpan.#day;
  }

  static #week = undefined;

  static week() {
    if (DateSpan.#week === undefined) {
      DateSpan.static$init();
      if (DateSpan.#week === undefined) DateSpan.#week = null;
    }
    return DateSpan.#week;
  }

  static #month = undefined;

  static month() {
    if (DateSpan.#month === undefined) {
      DateSpan.static$init();
      if (DateSpan.#month === undefined) DateSpan.#month = null;
    }
    return DateSpan.#month;
  }

  static #quarter = undefined;

  static quarter() {
    if (DateSpan.#quarter === undefined) {
      DateSpan.static$init();
      if (DateSpan.#quarter === undefined) DateSpan.#quarter = null;
    }
    return DateSpan.#quarter;
  }

  static #year = undefined;

  static year() {
    if (DateSpan.#year === undefined) {
      DateSpan.static$init();
      if (DateSpan.#year === undefined) DateSpan.#year = null;
    }
    return DateSpan.#year;
  }

  static #range = undefined;

  static range() {
    if (DateSpan.#range === undefined) {
      DateSpan.static$init();
      if (DateSpan.#range === undefined) DateSpan.#range = null;
    }
    return DateSpan.#range;
  }

  static makeWeek(start) {
    return DateSpan.make(start, DateSpan.week());
  }

  static makeMonth(year, month) {
    return DateSpan.make(sys.ObjUtil.coerce(sys.Date.make(year, month, 1), sys.Date.type$), DateSpan.month());
  }

  static makeYear(year) {
    return DateSpan.make(sys.ObjUtil.coerce(sys.Date.make(year, sys.Month.jan(), 1), sys.Date.type$), DateSpan.year());
  }

  static today() {
    return DateSpan.make(sys.Date.today(), DateSpan.day());
  }

  static yesterday() {
    return DateSpan.make(sys.Date.today().minus(sys.Duration.fromStr("1day")), DateSpan.day());
  }

  static thisWeek() {
    return DateSpan.make(sys.Date.today(), DateSpan.week());
  }

  static thisMonth() {
    return DateSpan.make(sys.Date.today(), DateSpan.month());
  }

  static thisQuarter() {
    return DateSpan.make(sys.Date.today(), DateSpan.quarter());
  }

  static thisYear() {
    return DateSpan.make(sys.Date.today(), DateSpan.year());
  }

  static pastWeek() {
    let today = sys.Date.today();
    return DateSpan.make(today.minus(sys.Duration.fromStr("7day")), today);
  }

  static pastMonth() {
    let today = sys.Date.today();
    return DateSpan.make(today.minus(sys.Duration.fromStr("30day")), today);
  }

  static pastYear() {
    let today = sys.Date.today();
    let year = sys.Int.minus(today.year(), 1);
    let mon = today.month();
    let day = sys.Int.min(today.day(), mon.numDays(year));
    return DateSpan.make(sys.ObjUtil.coerce(sys.Date.make(year, mon, day), sys.Date.type$), today);
  }

  static lastWeek() {
    return DateSpan.make(sys.Date.today().minus(sys.Duration.fromStr("7day")), DateSpan.week());
  }

  static lastMonth() {
    return DateSpan.make(sys.Date.today().firstOfMonth().minus(sys.Duration.fromStr("1day")), DateSpan.month());
  }

  static lastQuarter() {
    let today = sys.Date.today();
    let q = sys.Int.minus(sys.Int.div(today.month().ordinal(), 3), 1);
    let start = ((this$) => { if (sys.ObjUtil.compareLT(q, 0)) return sys.Date.make(sys.Int.minus(today.year(), 1), sys.Month.oct(), 1); return sys.Date.make(today.year(), sys.Month.vals().get(sys.Int.mult(q, 3)), 1); })(this);
    return DateSpan.make(sys.ObjUtil.coerce(start, sys.Date.type$), DateSpan.quarter());
  }

  static lastYear() {
    return DateSpan.make(sys.ObjUtil.coerce(sys.Date.make(sys.Int.minus(sys.Date.today().year(), 1), sys.Month.jan(), 1), sys.Date.type$), DateSpan.year());
  }

  static make(start, endOrPer) {
    const $self = new DateSpan();
    DateSpan.make$($self, start, endOrPer);
    return $self;
  }

  static make$($self, start, endOrPer) {
    if (start === undefined) start = sys.Date.today();
    if (endOrPer === undefined) endOrPer = DateSpan.day();
    if (sys.ObjUtil.is(endOrPer, sys.Date.type$)) {
      $self.#start = start;
      $self.#end = sys.ObjUtil.coerce(endOrPer, sys.Date.type$);
      $self.#period = DateSpan.range();
      $self.#numDays = sys.Int.plus($self.#end.minusDate($self.#start).toDay(), 1);
    }
    else {
      if (sys.ObjUtil.is(endOrPer, sys.Str.type$)) {
        let $_u261 = endOrPer;
        if (sys.ObjUtil.equals($_u261, DateSpan.day())) {
          $self.#start = start;
          $self.#end = start;
          $self.#period = DateSpan.day();
          $self.#numDays = 1;
        }
        else if (sys.ObjUtil.equals($_u261, DateSpan.week())) {
          let sow = sys.Weekday.localeStartOfWeek();
          while (start.weekday() !== sow) {
            (start = start.minus(sys.Duration.fromStr("1day")));
          }
          ;
          $self.#start = start;
          $self.#end = start.plus(sys.Duration.fromStr("6day"));
          $self.#period = DateSpan.week();
          $self.#numDays = 7;
        }
        else if (sys.ObjUtil.equals($_u261, DateSpan.month())) {
          $self.#start = start.firstOfMonth();
          $self.#end = start.lastOfMonth();
          $self.#period = DateSpan.month();
          $self.#numDays = start.month().numDays(start.year());
        }
        else if (sys.ObjUtil.equals($_u261, DateSpan.quarter())) {
          $self.#start = DateSpan.toQuarterStart(start.year(), start.month());
          $self.#end = DateSpan.toQuarterEnd(start.year(), start.month());
          $self.#period = DateSpan.quarter();
          $self.#numDays = DateSpan.toQuarterNumDays(start.year(), start.month());
        }
        else if (sys.ObjUtil.equals($_u261, DateSpan.year())) {
          $self.#start = sys.ObjUtil.coerce(sys.Date.make(start.year(), sys.Month.jan(), 1), sys.Date.type$);
          $self.#end = sys.ObjUtil.coerce(sys.Date.make(start.year(), sys.Month.dec(), 31), sys.Date.type$);
          $self.#period = DateSpan.year();
          $self.#numDays = ((this$) => { if (sys.DateTime.isLeapYear(start.year())) return 366; return 365; })($self);
        }
        else {
          throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Invalid period '", endOrPer), "'"));
        }
        ;
      }
      else {
        if ((sys.ObjUtil.is(endOrPer, sys.Duration.type$) || sys.ObjUtil.is(endOrPer, Number.type$))) {
          let num = sys.ObjUtil.as(endOrPer, Number.type$);
          if (num != null) {
            if (sys.ObjUtil.compareNE(num.unit(), Number.day())) {
              throw sys.ArgErr.make(sys.Str.plus("DateSpan period unit must be day, not ", num.unit()));
            }
            ;
            (endOrPer = sys.ObjUtil.coerce(num.toDuration(), sys.Obj.type$));
          }
          ;
          $self.#start = start;
          $self.#end = start.plus(sys.ObjUtil.coerce(endOrPer, sys.Duration.type$).minus(sys.Duration.fromStr("1day")));
          $self.#period = DateSpan.range();
          $self.#numDays = sys.Int.plus($self.#end.minusDate($self.#start).toDay(), 1);
        }
        else {
          throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("endOrPer must be Date, Str, Duration [", sys.ObjUtil.typeof(endOrPer)), "]"));
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  static toQuarterStart(y, m) {
    let $_u263 = sys.Int.div(m.ordinal(), 3);
    if (sys.ObjUtil.equals($_u263, 0)) {
      return sys.ObjUtil.coerce(sys.Date.make(y, sys.Month.jan(), 1), sys.Date.type$);
    }
    else if (sys.ObjUtil.equals($_u263, 1)) {
      return sys.ObjUtil.coerce(sys.Date.make(y, sys.Month.apr(), 1), sys.Date.type$);
    }
    else if (sys.ObjUtil.equals($_u263, 2)) {
      return sys.ObjUtil.coerce(sys.Date.make(y, sys.Month.jul(), 1), sys.Date.type$);
    }
    else if (sys.ObjUtil.equals($_u263, 3)) {
      return sys.ObjUtil.coerce(sys.Date.make(y, sys.Month.oct(), 1), sys.Date.type$);
    }
    else {
      throw sys.Err.make(m.name());
    }
    ;
  }

  static toQuarterEnd(y, m) {
    let $_u264 = sys.Int.div(m.ordinal(), 3);
    if (sys.ObjUtil.equals($_u264, 0)) {
      return sys.ObjUtil.coerce(sys.Date.make(y, sys.Month.mar(), 31), sys.Date.type$);
    }
    else if (sys.ObjUtil.equals($_u264, 1)) {
      return sys.ObjUtil.coerce(sys.Date.make(y, sys.Month.jun(), 30), sys.Date.type$);
    }
    else if (sys.ObjUtil.equals($_u264, 2)) {
      return sys.ObjUtil.coerce(sys.Date.make(y, sys.Month.sep(), 30), sys.Date.type$);
    }
    else if (sys.ObjUtil.equals($_u264, 3)) {
      return sys.ObjUtil.coerce(sys.Date.make(y, sys.Month.dec(), 31), sys.Date.type$);
    }
    else {
      throw sys.Err.make(m.name());
    }
    ;
  }

  static toQuarterNumDays(y, m) {
    let $_u265 = sys.Int.div(m.ordinal(), 3);
    if (sys.ObjUtil.equals($_u265, 0)) {
      return sys.Int.plus(sys.Int.plus(31, ((this$) => { if (sys.DateTime.isLeapYear(y)) return 29; return 28; })(this)), 31);
    }
    else if (sys.ObjUtil.equals($_u265, 1)) {
      return 91;
    }
    else if (sys.ObjUtil.equals($_u265, 2)) {
      return 92;
    }
    else if (sys.ObjUtil.equals($_u265, 3)) {
      return 92;
    }
    else {
      throw sys.Err.make(m.name());
    }
    ;
  }

  hash() {
    return sys.Int.xor(sys.Int.xor(this.#start.hash(), sys.Int.shiftl(this.#end.hash(), 7)), sys.Int.shiftl(sys.Str.hash(this.#period), 14));
  }

  equals(obj) {
    let that = sys.ObjUtil.as(obj, DateSpan.type$);
    if (that == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#start, that.#start) && sys.ObjUtil.equals(this.#end, that.#end) && sys.ObjUtil.equals(this.#period, that.#period));
  }

  toSpan(tz) {
    return sys.ObjUtil.coerce(Span.makeAbs(this.#start.midnight(tz), this.#end.plus(sys.Duration.fromStr("1day")).midnight(tz)), Span.type$);
  }

  contains(val) {
    return (sys.ObjUtil.compareLE(this.#start, val) && sys.ObjUtil.compareLE(val, this.#end));
  }

  plus(d) {
    return DateSpan.make(this.#start.plus(d), this.#end.plus(d));
  }

  minus(d) {
    return DateSpan.make(this.#start.minus(d), this.#end.minus(d));
  }

  toDateList() {
    const this$ = this;
    let acc = sys.List.make(sys.Date.type$);
    this.eachDay((d) => {
      acc.add(d);
      return;
    });
    return acc;
  }

  eachDay(func) {
    let date = this.#start;
    let index = 0;
    while (sys.ObjUtil.compareLE(date, this.#end)) {
      sys.Func.call(func, date, sys.ObjUtil.coerce(index, sys.Obj.type$.toNullable()));
      (date = date.plus(sys.Duration.fromStr("1day")));
      ((this$) => { let $_u267 = index; index = sys.Int.increment(index); return $_u267; })(this);
    }
    ;
    return;
  }

  eachMonth(f) {
    let curMonth = null;
    let d = this.#start;
    while (sys.ObjUtil.compareLE(d, this.#end)) {
      if (sys.ObjUtil.compareNE(d.month(), curMonth)) {
        (curMonth = d.month());
        sys.Func.call(f, DateSpan.makeMonth(d.year(), d.month()));
      }
      ;
      d = d.plus(sys.Duration.fromStr("1day"));
    }
    ;
    return;
  }

  prev() {
    let $_u268 = this.#period;
    if (sys.ObjUtil.equals($_u268, DateSpan.day())) {
      return DateSpan.make(this.#start.minus(sys.Duration.fromStr("1day")));
    }
    else if (sys.ObjUtil.equals($_u268, DateSpan.week())) {
      return DateSpan.makeWeek(this.#start.minus(sys.Duration.fromStr("7day")));
    }
    else if (sys.ObjUtil.equals($_u268, DateSpan.month())) {
      let y = this.#start.year();
      let m = this.#start.month().decrement();
      if (sys.ObjUtil.equals(m, sys.Month.dec())) {
        ((this$) => { let $_u269 = y; y = sys.Int.decrement(y); return $_u269; })(this);
      }
      ;
      return DateSpan.makeMonth(y, m);
    }
    else if (sys.ObjUtil.equals($_u268, DateSpan.quarter())) {
      return ((this$) => { if (sys.ObjUtil.equals(this$.#start.month(), sys.Month.jan())) return DateSpan.make(sys.ObjUtil.coerce(sys.Date.make(sys.Int.minus(this$.#start.year(), 1), sys.Month.oct(), 1), sys.Date.type$), "quarter"); return DateSpan.make(sys.ObjUtil.coerce(sys.Date.make(this$.#start.year(), sys.Month.vals().get(sys.Int.minus(this$.#start.month().ordinal(), 3)), 1), sys.Date.type$), "quarter"); })(this);
    }
    else if (sys.ObjUtil.equals($_u268, DateSpan.year())) {
      return DateSpan.makeYear(sys.Int.minus(this.#start.year(), 1));
    }
    else {
      return DateSpan.make(this.#start.minus(sys.Duration.fromStr("1day")), this.#end.minus(sys.Duration.fromStr("1day")));
    }
    ;
  }

  next() {
    let $_u271 = this.#period;
    if (sys.ObjUtil.equals($_u271, DateSpan.day())) {
      return DateSpan.make(this.#start.plus(sys.Duration.fromStr("1day")));
    }
    else if (sys.ObjUtil.equals($_u271, DateSpan.week())) {
      return DateSpan.makeWeek(this.#start.plus(sys.Duration.fromStr("7day")));
    }
    else if (sys.ObjUtil.equals($_u271, DateSpan.month())) {
      let y = this.#start.year();
      let m = this.#start.month().increment();
      if (sys.ObjUtil.equals(m, sys.Month.jan())) {
        ((this$) => { let $_u272 = y; y = sys.Int.increment(y); return $_u272; })(this);
      }
      ;
      return DateSpan.makeMonth(y, m);
    }
    else if (sys.ObjUtil.equals($_u271, DateSpan.quarter())) {
      return ((this$) => { if (sys.ObjUtil.equals(this$.#start.month(), sys.Month.oct())) return DateSpan.make(sys.ObjUtil.coerce(sys.Date.make(sys.Int.plus(this$.#start.year(), 1), sys.Month.jan(), 1), sys.Date.type$), "quarter"); return DateSpan.make(sys.ObjUtil.coerce(sys.Date.make(this$.#start.year(), sys.Month.vals().get(sys.Int.plus(this$.#start.month().ordinal(), 3)), 1), sys.Date.type$), "quarter"); })(this);
    }
    else if (sys.ObjUtil.equals($_u271, DateSpan.year())) {
      return DateSpan.makeYear(sys.Int.plus(this.#start.year(), 1));
    }
    else {
      return DateSpan.make(this.#start.plus(sys.Duration.fromStr("1day")), this.#end.plus(sys.Duration.fromStr("1day")));
    }
    ;
  }

  toLocale() {
    return this.dis();
  }

  dis(explicit) {
    if (explicit === undefined) explicit = false;
    let $_u274 = this.#period;
    if (sys.ObjUtil.equals($_u274, DateSpan.day())) {
      if (!explicit) {
        if (this.#start.isToday()) {
          return sys.Str.plus("", DateSpan.type$.pod().locale("today"));
        }
        ;
        if (this.#start.isYesterday()) {
          return sys.Str.plus("", DateSpan.type$.pod().locale("yesterday"));
        }
        ;
      }
      ;
      return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#start.weekday().localeAbbr()), " "), this.#start.toLocale());
    }
    else if (sys.ObjUtil.equals($_u274, DateSpan.week())) {
      return sys.Str.plus(sys.Str.plus(sys.Str.plus("", DateSpan.type$.pod().locale("weekOf")), " "), this.#start.toLocale());
    }
    else if (sys.ObjUtil.equals($_u274, DateSpan.month())) {
      return this.#start.toLocale("MMM-YYYY");
    }
    else if (sys.ObjUtil.equals($_u274, DateSpan.year())) {
      return this.#start.toLocale("YYYY");
    }
    else {
      return sys.Str.plus(sys.Str.plus(this.#start.toLocale("D-MMM-YY"), ".."), this.#end.toLocale("D-MMM-YY"));
    }
    ;
  }

  toCode() {
    let $_u275 = this.#period;
    if (sys.ObjUtil.equals($_u275, DateSpan.day())) {
      return this.#start.toLocale("YYYY-MM-DD");
    }
    else if (sys.ObjUtil.equals($_u275, DateSpan.month())) {
      return this.#start.toLocale("YYYY-MM");
    }
    else if (sys.ObjUtil.equals($_u275, DateSpan.year())) {
      return this.#start.toLocale("YYYY");
    }
    else {
      return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#start.toStr()), ".."), this.#end.toStr());
    }
    ;
  }

  toStr() {
    let endOrPer = ((this$) => { if (sys.ObjUtil.equals(this$.#period, "range")) return this$.#end.toStr(); return this$.#period; })(this);
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#start), ","), endOrPer);
  }

  static fromStr(s, checked) {
    if (checked === undefined) checked = true;
    try {
      let factory = DateSpan.factories().get(s);
      if (factory != null) {
        return sys.ObjUtil.coerce(DateSpan.type$.method(sys.ObjUtil.coerce(factory, sys.Str.type$)).call(), DateSpan.type$.toNullable());
      }
      ;
      let parts = sys.Str.split(s, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
      let start = sys.Date.fromStr(parts.get(0));
      let endOrPer = ((this$) => { let $_u277 = sys.Date.fromStr(parts.get(1), false); if ($_u277 != null) return $_u277; return parts.get(1); })(this);
      return DateSpan.make(sys.ObjUtil.coerce(start, sys.Date.type$), sys.ObjUtil.coerce(endOrPer, sys.Obj.type$));
    }
    catch ($_u278) {
      $_u278 = sys.Err.make($_u278);
      if ($_u278 instanceof sys.Err) {
        let err = $_u278;
        ;
        if (!checked) {
          return null;
        }
        ;
        throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid DateSpan format '", s), "'"), err);
      }
      else {
        throw $_u278;
      }
    }
    ;
  }

  isDay() {
    return sys.ObjUtil.equals(this.#period, DateSpan.day());
  }

  isWeek() {
    return sys.ObjUtil.equals(this.#period, DateSpan.week());
  }

  isMonth() {
    return sys.ObjUtil.equals(this.#period, DateSpan.month());
  }

  isQuarter() {
    return sys.ObjUtil.equals(this.#period, DateSpan.quarter());
  }

  isYear() {
    return sys.ObjUtil.equals(this.#period, DateSpan.year());
  }

  isRange() {
    return sys.ObjUtil.equals(this.#period, DateSpan.range());
  }

  static static$init() {
    DateSpan.#factories = sys.ObjUtil.coerce(((this$) => { let $_u279 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")).setList(sys.List.make(sys.Str.type$, ["today", "yesterday", "thisWeek", "lastWeek", "pastWeek", "thisMonth", "lastMonth", "pastMonth", "thisYear", "lastYear", "pastYear"])); if ($_u279 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")).setList(sys.List.make(sys.Str.type$, ["today", "yesterday", "thisWeek", "lastWeek", "pastWeek", "thisMonth", "lastMonth", "pastMonth", "thisYear", "lastYear", "pastYear"]))); })(this), sys.Type.find("[sys::Str:sys::Str]"));
    DateSpan.#day = "day";
    DateSpan.#week = "week";
    DateSpan.#month = "month";
    DateSpan.#quarter = "quarter";
    DateSpan.#year = "year";
    DateSpan.#range = "range";
    return;
  }

}

class Kind extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#listOfRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return Kind.type$; }

  static #obj = undefined;

  static obj() {
    if (Kind.#obj === undefined) {
      Kind.static$init();
      if (Kind.#obj === undefined) Kind.#obj = null;
    }
    return Kind.#obj;
  }

  static #bin = undefined;

  static bin() {
    if (Kind.#bin === undefined) {
      Kind.static$init();
      if (Kind.#bin === undefined) Kind.#bin = null;
    }
    return Kind.#bin;
  }

  static #bool = undefined;

  static bool() {
    if (Kind.#bool === undefined) {
      Kind.static$init();
      if (Kind.#bool === undefined) Kind.#bool = null;
    }
    return Kind.#bool;
  }

  static #coord = undefined;

  static coord() {
    if (Kind.#coord === undefined) {
      Kind.static$init();
      if (Kind.#coord === undefined) Kind.#coord = null;
    }
    return Kind.#coord;
  }

  static #date = undefined;

  static date() {
    if (Kind.#date === undefined) {
      Kind.static$init();
      if (Kind.#date === undefined) Kind.#date = null;
    }
    return Kind.#date;
  }

  static #dateTime = undefined;

  static dateTime() {
    if (Kind.#dateTime === undefined) {
      Kind.static$init();
      if (Kind.#dateTime === undefined) Kind.#dateTime = null;
    }
    return Kind.#dateTime;
  }

  static #dict = undefined;

  static dict() {
    if (Kind.#dict === undefined) {
      Kind.static$init();
      if (Kind.#dict === undefined) Kind.#dict = null;
    }
    return Kind.#dict;
  }

  static #grid = undefined;

  static grid() {
    if (Kind.#grid === undefined) {
      Kind.static$init();
      if (Kind.#grid === undefined) Kind.#grid = null;
    }
    return Kind.#grid;
  }

  static #list = undefined;

  static list() {
    if (Kind.#list === undefined) {
      Kind.static$init();
      if (Kind.#list === undefined) Kind.#list = null;
    }
    return Kind.#list;
  }

  static #marker = undefined;

  static marker() {
    if (Kind.#marker === undefined) {
      Kind.static$init();
      if (Kind.#marker === undefined) Kind.#marker = null;
    }
    return Kind.#marker;
  }

  static #na = undefined;

  static na() {
    if (Kind.#na === undefined) {
      Kind.static$init();
      if (Kind.#na === undefined) Kind.#na = null;
    }
    return Kind.#na;
  }

  static #number = undefined;

  static number() {
    if (Kind.#number === undefined) {
      Kind.static$init();
      if (Kind.#number === undefined) Kind.#number = null;
    }
    return Kind.#number;
  }

  static #ref = undefined;

  static ref() {
    if (Kind.#ref === undefined) {
      Kind.static$init();
      if (Kind.#ref === undefined) Kind.#ref = null;
    }
    return Kind.#ref;
  }

  static #remove = undefined;

  static remove() {
    if (Kind.#remove === undefined) {
      Kind.static$init();
      if (Kind.#remove === undefined) Kind.#remove = null;
    }
    return Kind.#remove;
  }

  static #span = undefined;

  static span() {
    if (Kind.#span === undefined) {
      Kind.static$init();
      if (Kind.#span === undefined) Kind.#span = null;
    }
    return Kind.#span;
  }

  static #str = undefined;

  static str() {
    if (Kind.#str === undefined) {
      Kind.static$init();
      if (Kind.#str === undefined) Kind.#str = null;
    }
    return Kind.#str;
  }

  static #symbol = undefined;

  static symbol() {
    if (Kind.#symbol === undefined) {
      Kind.static$init();
      if (Kind.#symbol === undefined) Kind.#symbol = null;
    }
    return Kind.#symbol;
  }

  static #time = undefined;

  static time() {
    if (Kind.#time === undefined) {
      Kind.static$init();
      if (Kind.#time === undefined) Kind.#time = null;
    }
    return Kind.#time;
  }

  static #uri = undefined;

  static uri() {
    if (Kind.#uri === undefined) {
      Kind.static$init();
      if (Kind.#uri === undefined) Kind.#uri = null;
    }
    return Kind.#uri;
  }

  static #xstr = undefined;

  static xstr() {
    if (Kind.#xstr === undefined) {
      Kind.static$init();
      if (Kind.#xstr === undefined) Kind.#xstr = null;
    }
    return Kind.#xstr;
  }

  static #listing = undefined;

  static listing() {
    if (Kind.#listing === undefined) {
      Kind.static$init();
      if (Kind.#listing === undefined) Kind.#listing = null;
    }
    return Kind.#listing;
  }

  static #fromStrMap = undefined;

  static fromStrMap() {
    if (Kind.#fromStrMap === undefined) {
      Kind.static$init();
      if (Kind.#fromStrMap === undefined) Kind.#fromStrMap = null;
    }
    return Kind.#fromStrMap;
  }

  static #fromDefMap = undefined;

  static fromDefMap() {
    if (Kind.#fromDefMap === undefined) {
      Kind.static$init();
      if (Kind.#fromDefMap === undefined) Kind.#fromDefMap = null;
    }
    return Kind.#fromDefMap;
  }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #defSymbol = null;

  defSymbol() { return this.#defSymbol; }

  __defSymbol(it) { if (it === undefined) return this.#defSymbol; else this.#defSymbol = it; }

  #signature = null;

  signature() { return this.#signature; }

  __signature(it) { if (it === undefined) return this.#signature; else this.#signature = it; }

  #listOfRef = null;

  // private field reflection only
  __listOfRef(it) { if (it === undefined) return this.#listOfRef; else this.#listOfRef = it; }

  static make(name, type, signature) {
    const $self = new Kind();
    Kind.make$($self, name, type, signature);
    return $self;
  }

  static make$($self, name, type, signature) {
    if (signature === undefined) signature = name;
    ;
    $self.#name = name;
    $self.#type = type;
    $self.#signature = signature;
    $self.#defSymbol = sys.ObjUtil.coerce(Symbol.parse(sys.Str.decapitalize(name)), Symbol.type$);
    return;
  }

  static fromType(type, checked) {
    if (checked === undefined) checked = true;
    if (type != null) {
      (type = type.toNonNullable());
      let kind = Kind.fromFixedType(sys.ObjUtil.coerce(type, sys.Type.type$));
      if (kind != null) {
        return kind;
      }
      ;
      if (type.fits(sys.Type.find("sys::List"))) {
        return Kind.fromListTypeOf(type.params().get("V"));
      }
      ;
      if (type.fits(Dict.type$)) {
        return Kind.dict();
      }
      ;
      if (type.fits(Grid.type$)) {
        return Kind.grid();
      }
      ;
    }
    ;
    if (checked) {
      throw sys.Err.make(sys.Str.plus("Not Haystack type: ", type));
    }
    ;
    return null;
  }

  static fromVal(val, checked) {
    if (checked === undefined) checked = true;
    if (val != null) {
      let kind = Kind.fromFixedType(sys.ObjUtil.typeof(val));
      if (kind != null) {
        return kind;
      }
      ;
      if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
        return Kind.fromListTypeOf(sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).of());
      }
      ;
      if (sys.ObjUtil.is(val, Dict.type$)) {
        return Kind.dict();
      }
      ;
      if (sys.ObjUtil.is(val, Grid.type$)) {
        return Kind.grid();
      }
      ;
    }
    ;
    if (checked) {
      throw NotHaystackErr.make(sys.Str.plus("", ((this$) => { let $_u280 = val; if ($_u280 == null) return null; return sys.ObjUtil.typeof(val); })(this)));
    }
    ;
    return null;
  }

  static fromFixedType(type) {
    if (type === Number.type$) {
      return Kind.number();
    }
    ;
    if (type === Marker.type$) {
      return Kind.marker();
    }
    ;
    if (type === sys.Str.type$) {
      return Kind.str();
    }
    ;
    if (type === Ref.type$) {
      return Kind.ref();
    }
    ;
    if (type === sys.DateTime.type$) {
      return Kind.dateTime();
    }
    ;
    if (Symbol.fits(type)) {
      return Kind.symbol();
    }
    ;
    if (type === sys.Bool.type$) {
      return Kind.bool();
    }
    ;
    if (type === NA.type$) {
      return Kind.na();
    }
    ;
    if (type === Coord.type$) {
      return Kind.coord();
    }
    ;
    if (type === sys.Uri.type$) {
      return Kind.uri();
    }
    ;
    if (type === Span.type$) {
      return Kind.span();
    }
    ;
    if (type === sys.Date.type$) {
      return Kind.date();
    }
    ;
    if (type === sys.Time.type$) {
      return Kind.time();
    }
    ;
    if (type === Bin.type$) {
      return Kind.bin();
    }
    ;
    if (type === Remove.type$) {
      return Kind.remove();
    }
    ;
    if (type === XStr.type$) {
      return Kind.xstr();
    }
    ;
    return null;
  }

  static fromListTypeOf(t) {
    if (t == null) {
      return Kind.obj().toListOf();
    }
    ;
    let of$ = ((this$) => { let $_u281 = Kind.fromType(t.toNonNullable(), false); if ($_u281 != null) return $_u281; return Kind.obj(); })(this);
    return of$.toListOf();
  }

  static toInferredList(acc) {
    if (acc.isEmpty()) {
      return sys.Obj.type$.toNullable().emptyList();
    }
    ;
    let best = null;
    let nulls = false;
    let sysPod = sys.Str.type$.pod();
    for (let i = 0; sys.ObjUtil.compareLT(i, acc.size()); i = sys.Int.increment(i)) {
      let val = acc.get(i);
      if (val == null) {
        (nulls = true);
        continue;
      }
      ;
      let type = sys.ObjUtil.typeof(val);
      if (type.pod() !== sysPod) {
        if (sys.ObjUtil.is(val, Dict.type$)) {
          (type = Dict.type$);
        }
        else {
          if (sys.ObjUtil.is(val, Grid.type$)) {
            (type = Grid.type$);
          }
          else {
            if (sys.ObjUtil.is(val, Symbol.type$)) {
              (type = Symbol.type$);
            }
            ;
          }
          ;
        }
        ;
      }
      ;
      if (best == null) {
        (best = type);
      }
      else {
        if (best !== type) {
          (best = null);
          break;
        }
        ;
      }
      ;
    }
    ;
    if (best == null) {
      return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc), sys.Type.find("sys::Obj?[]"));
    }
    ;
    if (nulls) {
      (best = best.toNullable());
    }
    ;
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.List.make(sys.ObjUtil.coerce(best, sys.Type.type$), acc.size()).addAll(acc)), sys.Type.find("sys::List"));
  }

  static fromDefName(name, checked) {
    if (checked === undefined) checked = true;
    let kind = Kind.fromDefMap().get(name);
    if (kind != null) {
      return kind;
    }
    ;
    if (checked) {
      throw UnknownKindErr.make(name);
    }
    ;
    return null;
  }

  static fromStr(signature, checked) {
    if (checked === undefined) checked = true;
    let r = Kind.fromStrMap().get(signature);
    if (r != null) {
      return r;
    }
    ;
    if ((sys.ObjUtil.compareGT(sys.Str.size(signature), 3) && sys.Str.endsWith(signature, "[]"))) {
      return ((this$) => { let $_u282 = Kind.fromStr(sys.Str.getRange(signature, sys.Range.make(0, -3)), checked); if ($_u282 == null) return null; return Kind.fromStr(sys.Str.getRange(signature, sys.Range.make(0, -3)), checked).toListOf(); })(this);
    }
    ;
    if ((sys.ObjUtil.compareGT(sys.Str.size(signature), 4) && sys.ObjUtil.equals(sys.Str.get(signature, -1), 62))) {
      try {
        let open = sys.Str.index(signature, "<");
        let base = Kind.fromStr(sys.Str.getRange(signature, sys.Range.make(0, sys.ObjUtil.coerce(open, sys.Int.type$), true)));
        let tag = sys.Str.getRange(signature, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(open, sys.Int.type$), 1), -2));
        if (sys.Str.isEmpty(tag)) {
          throw sys.Err.make();
        }
        ;
        return base.toTagOf(tag);
      }
      catch ($_u283) {
        $_u283 = sys.Err.make($_u283);
        if ($_u283 instanceof sys.Err) {
          let e = $_u283;
          ;
        }
        else {
          throw $_u283;
        }
      }
      ;
    }
    ;
    if (checked) {
      throw UnknownKindErr.make(signature);
    }
    ;
    return null;
  }

  of() {
    return null;
  }

  tag() {
    return null;
  }

  paramName() {
    return this.tag();
  }

  hash() {
    return sys.Str.hash(this.#signature);
  }

  equals(that) {
    return (sys.ObjUtil.is(that, Kind.type$) && sys.ObjUtil.equals(this.#signature, sys.ObjUtil.coerce(that, Kind.type$).#signature));
  }

  toStr() {
    return this.#signature;
  }

  isNumber() {
    return false;
  }

  isRef() {
    return false;
  }

  isDict() {
    return false;
  }

  toListOf() {
    let list = sys.ObjUtil.as(this.#listOfRef.val(), Kind.type$);
    if (list == null) {
      this.#listOfRef.val((list = ListKind.make(this)));
    }
    ;
    return sys.ObjUtil.coerce(list, Kind.type$);
  }

  isScalar() {
    return !this.isCollection();
  }

  isSingleton() {
    return false;
  }

  isXStr() {
    return false;
  }

  isCollection() {
    return false;
  }

  isList() {
    return false;
  }

  isListOf(of$) {
    return false;
  }

  isListOfRef() {
    return this.isListOf(Kind.ref());
  }

  isGrid() {
    return false;
  }

  toTagOf(tag) {
    throw sys.UnsupportedErr.make(this.#signature);
  }

  defVal() {
    return this.#type.make();
  }

  icon() {
    return this.#defSymbol.name();
  }

  canStore() {
    return true;
  }

  valToStr(val) {
    return sys.ObjUtil.toStr(val);
  }

  valToZinc(val) {
    return this.valToStr(val);
  }

  valToJson(val) {
    return sys.Str.toCode(sys.ObjUtil.toStr(val));
  }

  valToAxon(val) {
    return this.valToStr(val);
  }

  valToDis(val, meta) {
    if (meta === undefined) meta = Etc.emptyDict();
    return sys.ObjUtil.toStr(val);
  }

  static static$init() {
    const this$ = this;
    Kind.#obj = ObjKind.make();
    Kind.#bin = BinKind.make();
    Kind.#bool = BoolKind.make();
    Kind.#coord = CoordKind.make();
    Kind.#date = DateKind.make();
    Kind.#dateTime = DateTimeKind.make();
    Kind.#dict = DictKind.make();
    Kind.#grid = GridKind.make();
    Kind.#list = ListKind.make(Kind.#obj);
    Kind.#marker = MarkerKind.make();
    Kind.#na = NAKind.make();
    Kind.#number = NumberKind.make();
    Kind.#ref = RefKind.make();
    Kind.#remove = RemoveKind.make();
    Kind.#span = SpanKind.make();
    Kind.#str = StrKind.make();
    Kind.#symbol = SymbolKind.make();
    Kind.#time = TimeKind.make();
    Kind.#uri = UriKind.make();
    Kind.#xstr = XStrKind.make();
    if (true) {
      let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Kind"));
      let defs = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Kind"));
      Kind.type$.fields().each((f) => {
        if ((f.isStatic() && sys.ObjUtil.equals(f.type(), Kind.type$))) {
          let kind = sys.ObjUtil.coerce(f.get(), Kind.type$);
          map.set(kind.#name, kind);
          defs.set(sys.Str.decapitalize(kind.#name), kind);
        }
        ;
        return;
      });
      Kind.#fromStrMap = sys.ObjUtil.coerce(((this$) => { let $_u284 = map; if ($_u284 == null) return null; return sys.ObjUtil.toImmutable(map); })(this), sys.Type.find("[sys::Str:haystack::Kind]"));
      Kind.#fromDefMap = sys.ObjUtil.coerce(((this$) => { let $_u285 = defs; if ($_u285 == null) return null; return sys.ObjUtil.toImmutable(defs); })(this), sys.Type.find("[sys::Str:haystack::Kind]"));
      Kind.#listing = sys.ObjUtil.coerce(((this$) => { let $_u286 = map.vals().sort(); if ($_u286 == null) return null; return sys.ObjUtil.toImmutable(map.vals().sort()); })(this), sys.Type.find("haystack::Kind[]"));
    }
    ;
    return;
  }

}

class ObjKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObjKind.type$; }

  static make() {
    const $self = new ObjKind();
    ObjKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Obj", sys.Obj.type$);
    return;
  }

  defVal() {
    return "";
  }

  toListOf() {
    return Kind.list();
  }

}

class MarkerKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MarkerKind.type$; }

  static make() {
    const $self = new MarkerKind();
    MarkerKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Marker", Marker.type$);
    return;
  }

  isSingleton() {
    return true;
  }

  valToZinc(val) {
    return "M";
  }

  valToJson(val) {
    return "m:";
  }

  valToDis(val, meta) {
    if (meta === undefined) meta = Etc.emptyDict();
    return "\u2713";
  }

  valToAxon(val) {
    return "marker()";
  }

  defVal() {
    return Marker.val();
  }

}

class NAKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NAKind.type$; }

  static make() {
    const $self = new NAKind();
    NAKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "NA", NA.type$);
    return;
  }

  isSingleton() {
    return true;
  }

  valToZinc(val) {
    return "NA";
  }

  valToJson(val) {
    return "z:";
  }

  valToDis(val, meta) {
    if (meta === undefined) meta = Etc.emptyDict();
    return "NA";
  }

  valToAxon(val) {
    return "na()";
  }

  defVal() {
    return NA.val();
  }

  canStore() {
    return false;
  }

}

class RemoveKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RemoveKind.type$; }

  static make() {
    const $self = new RemoveKind();
    RemoveKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Remove", Remove.type$);
    return;
  }

  isSingleton() {
    return true;
  }

  valToZinc(val) {
    return "R";
  }

  valToJson(val) {
    return "-:";
  }

  valToDis(val, meta) {
    if (meta === undefined) meta = Etc.emptyDict();
    return "\u2716";
  }

  valToAxon(val) {
    return "removeMarker()";
  }

  defVal() {
    return Remove.val();
  }

}

class BoolKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BoolKind.type$; }

  static make() {
    const $self = new BoolKind();
    BoolKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Bool", sys.Bool.type$);
    return;
  }

  valToZinc(val) {
    return ((this$) => { if (sys.ObjUtil.coerce(val, sys.Bool.type$)) return "T"; return "F"; })(this);
  }

  valToJson(val) {
    throw sys.UnsupportedErr.make();
  }

  valToDis(val, meta) {
    if (meta === undefined) meta = Etc.emptyDict();
    let bool = sys.ObjUtil.coerce(val, sys.Bool.type$);
    let enum$ = sys.ObjUtil.as(meta.get("enum"), sys.Str.type$);
    if (enum$ != null) {
      let toks = sys.Str.split(enum$, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
      if (sys.ObjUtil.equals(toks.size(), 2)) {
        return ((this$) => { if (bool) return toks.get(1); return toks.get(0); })(this);
      }
      ;
    }
    ;
    return sys.Bool.toStr(bool);
  }

}

class NumberKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NumberKind.type$; }

  static make() {
    const $self = new NumberKind();
    NumberKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Number", Number.type$);
    return;
  }

  isNumber() {
    return true;
  }

  valToDis(val, meta) {
    if (meta === undefined) meta = Etc.emptyDict();
    return sys.ObjUtil.coerce(val, Number.type$).toLocale(sys.ObjUtil.coerce(meta.get("format"), sys.Str.type$.toNullable()));
  }

  valToJson(val) {
    return sys.ObjUtil.coerce(val, Number.type$).toJson();
  }

  valToAxon(val) {
    let f = sys.ObjUtil.coerce(val, Number.type$).toFloat();
    if (sys.Float.isNaN(f)) {
      return "nan()";
    }
    ;
    if (sys.ObjUtil.equals(f, sys.Float.posInf())) {
      return "posInf()";
    }
    ;
    if (sys.ObjUtil.equals(f, sys.Float.negInf())) {
      return "negInf()";
    }
    ;
    return sys.ObjUtil.toStr(val);
  }

}

class RefKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RefKind.type$; }

  #tag = null;

  tag() { return this.#tag; }

  __tag(it) { if (it === undefined) return this.#tag; else this.#tag = it; }

  static make() {
    const $self = new RefKind();
    RefKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Ref", Ref.type$);
    return;
  }

  static makeTag(tag) {
    const $self = new RefKind();
    RefKind.makeTag$($self, tag);
    return $self;
  }

  static makeTag$($self, tag) {
    Kind.make$($self, "Ref", Ref.type$, sys.Str.plus(sys.Str.plus("Ref<", tag), ">"));
    $self.#tag = tag;
    return;
  }

  toTagOf(tag) {
    return RefKind.makeTag(tag);
  }

  isRef() {
    return true;
  }

  valToStr(val) {
    return sys.ObjUtil.coerce(val, Ref.type$).toCode();
  }

  valToDis(val, meta) {
    if (meta === undefined) meta = Etc.emptyDict();
    return sys.ObjUtil.coerce(val, Ref.type$).dis();
  }

  valToZinc(val) {
    return sys.ObjUtil.coerce(val, Ref.type$).toZinc();
  }

  valToJson(val) {
    return sys.ObjUtil.coerce(val, Ref.type$).toJson();
  }

  valToAxon(val) {
    return sys.ObjUtil.coerce(val, Ref.type$).toCode();
  }

}

class SymbolKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SymbolKind.type$; }

  static make() {
    const $self = new SymbolKind();
    SymbolKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Symbol", Symbol.type$);
    return;
  }

  defVal() {
    return sys.ObjUtil.coerce(Symbol.fromStr("marker"), sys.Obj.type$);
  }

  valToStr(val) {
    return sys.ObjUtil.coerce(val, Symbol.type$).toCode();
  }

  valToZinc(val) {
    return sys.ObjUtil.coerce(val, Symbol.type$).toCode();
  }

  valToJson(val) {
    return sys.Str.plus("y:", val);
  }

  valToAxon(val) {
    return sys.ObjUtil.coerce(val, Symbol.type$).toCode();
  }

}

class StrKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StrKind.type$; }

  static make() {
    const $self = new StrKind();
    StrKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Str", sys.Str.type$);
    return;
  }

  valToStr(val) {
    return sys.Str.toCode(sys.ObjUtil.coerce(val, sys.Str.type$));
  }

  valToDis(val, meta) {
    if (meta === undefined) meta = Etc.emptyDict();
    let s = sys.ObjUtil.coerce(val, sys.Str.type$);
    if (sys.ObjUtil.compareLT(sys.Str.size(s), 62)) {
      return s;
    }
    ;
    return sys.Str.plus(sys.Str.getRange(s, sys.Range.make(0, 60)), "...");
  }

  valToAxon(val) {
    return sys.Str.toCode(sys.ObjUtil.coerce(val, sys.Str.type$));
  }

  valToJson(val) {
    return sys.ObjUtil.coerce(((this$) => { if (sys.Str.contains(sys.ObjUtil.coerce(val, sys.Str.type$), ":")) return sys.Str.plus("s:", val); return val; })(this), sys.Str.type$);
  }

}

class UriKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UriKind.type$; }

  static make() {
    const $self = new UriKind();
    UriKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Uri", sys.Uri.type$);
    return;
  }

  valToStr(val) {
    return sys.ObjUtil.coerce(val, sys.Uri.type$).toCode();
  }

  valToJson(val) {
    return sys.Str.plus("u:", val);
  }

  valToAxon(val) {
    return sys.ObjUtil.coerce(val, sys.Uri.type$).toCode();
  }

  valToDis(val, meta) {
    if (meta === undefined) meta = Etc.emptyDict();
    let format = sys.ObjUtil.as(meta.get("format"), sys.Str.type$);
    if (format != null) {
      return sys.ObjUtil.coerce(format, sys.Str.type$);
    }
    ;
    return sys.ObjUtil.toStr(val);
  }

}

class DateTimeKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DateTimeKind.type$; }

  static make() {
    const $self = new DateTimeKind();
    DateTimeKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "DateTime", sys.DateTime.type$);
    return;
  }

  valToStr(val) {
    let dt = sys.ObjUtil.coerce(val, sys.DateTime.type$);
    if (dt.tz() === sys.TimeZone.utc()) {
      return dt.toIso();
    }
    else {
      return dt.toStr();
    }
    ;
  }

  valToDis(val, meta) {
    if (meta === undefined) meta = Etc.emptyDict();
    return sys.ObjUtil.coerce(val, sys.DateTime.type$).toLocale(sys.ObjUtil.coerce(meta.get("format"), sys.Str.type$.toNullable()));
  }

  valToJson(val) {
    return sys.Str.plus("t:", val);
  }

  valToAxon(val) {
    return sys.Str.plus(sys.Str.plus("parseDateTime(", sys.Str.toCode(sys.ObjUtil.toStr(val))), ")");
  }

}

class DateKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DateKind.type$; }

  static make() {
    const $self = new DateKind();
    DateKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Date", sys.Date.type$);
    return;
  }

  defVal() {
    return sys.Date.today();
  }

  valToDis(val, meta) {
    if (meta === undefined) meta = Etc.emptyDict();
    return sys.ObjUtil.coerce(val, sys.Date.type$).toLocale(sys.ObjUtil.coerce(meta.get("format"), sys.Str.type$.toNullable()));
  }

  valToJson(val) {
    return sys.Str.plus("d:", val);
  }

}

class TimeKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TimeKind.type$; }

  static make() {
    const $self = new TimeKind();
    TimeKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Time", sys.Time.type$);
    return;
  }

  valToDis(val, meta) {
    if (meta === undefined) meta = Etc.emptyDict();
    return sys.ObjUtil.coerce(val, sys.Time.type$).toLocale(sys.ObjUtil.coerce(meta.get("format"), sys.Str.type$.toNullable()));
  }

  valToJson(val) {
    return sys.Str.plus("h:", val);
  }

}

class CoordKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CoordKind.type$; }

  static make() {
    const $self = new CoordKind();
    CoordKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Coord", Coord.type$);
    return;
  }

  valToJson(val) {
    return sys.Str.plus("c:", sys.ObjUtil.coerce(val, Coord.type$).toLatLgnStr());
  }

  valToAxon(val) {
    return sys.Str.plus(sys.Str.plus("coord(", sys.ObjUtil.coerce(val, Coord.type$).toLatLgnStr()), ")");
  }

}

class XStrKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XStrKind.type$; }

  static make() {
    const $self = new XStrKind();
    XStrKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "XStr", XStr.type$);
    return;
  }

  isXStr() {
    return true;
  }

  valToJson(val) {
    let x = sys.ObjUtil.coerce(val, XStr.type$);
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("x:", x.type()), ":"), x.val());
  }

  valToAxon(val) {
    let x = sys.ObjUtil.coerce(val, XStr.type$);
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("xstr(", sys.Str.toCode(x.type())), ", "), sys.Str.toCode(x.val())), ")");
  }

}

class BinKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BinKind.type$; }

  static make() {
    const $self = new BinKind();
    BinKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Bin", Bin.type$);
    return;
  }

  isXStr() {
    return true;
  }

  valToZinc(val) {
    return sys.Str.plus(sys.Str.plus("Bin(", sys.Str.toCode(sys.ObjUtil.coerce(val, Bin.type$).mime().toStr())), ")");
  }

  valToJson(val) {
    return sys.Str.plus("b:", sys.ObjUtil.coerce(val, Bin.type$).mime().toStr());
  }

  valToAxon(val) {
    return sys.Str.plus(sys.Str.plus("xstr(\"Bin\",", sys.Str.toCode(sys.ObjUtil.coerce(val, Bin.type$).mime().toStr())), ")");
  }

}

class SpanKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SpanKind.type$; }

  static make() {
    const $self = new SpanKind();
    SpanKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Span", Span.type$);
    return;
  }

  isXStr() {
    return true;
  }

  valToZinc(val) {
    return sys.Str.plus(sys.Str.plus("Span(", sys.Str.toCode(sys.ObjUtil.toStr(val))), ")");
  }

  valToJson(val) {
    return sys.Str.plus("x:Span:", val);
  }

  valToAxon(val) {
    return sys.ObjUtil.coerce(val, Span.type$).toCode();
  }

  valToDis(val, meta) {
    if (meta === undefined) meta = Etc.emptyDict();
    return sys.ObjUtil.coerce(val, Span.type$).dis();
  }

}

class ListKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ListKind.type$; }

  #of = null;

  of() { return this.#of; }

  __of(it) { if (it === undefined) return this.#of; else this.#of = it; }

  static make(of$) {
    const $self = new ListKind();
    ListKind.make$($self, of$);
    return $self;
  }

  static make$($self, of$) {
    Kind.make$($self, "List", sys.Type.find("sys::List"), sys.Str.plus(of$.signature(), "[]"));
    $self.#of = of$;
    return;
  }

  isCollection() {
    return true;
  }

  isList() {
    return true;
  }

  isListOf(of$) {
    if (this.#of == null) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareNE(of$.name(), this.#of.name())) {
      return false;
    }
    ;
    if ((of$.tag() != null && sys.ObjUtil.compareNE(of$.tag(), this.#of.tag()))) {
      return false;
    }
    ;
    return true;
  }

  defVal() {
    return sys.List.make(sys.Obj.type$.toNullable());
  }

  valToAxon(v) {
    const this$ = this;
    return sys.Str.plus(sys.Str.plus("[", sys.ObjUtil.coerce(v, sys.Type.find("sys::List")).join(", ", (x) => {
      return sys.ObjUtil.coerce(Etc.toAxon(x), sys.Str.type$);
    })), "]");
  }

  valToZinc(v) {
    const this$ = this;
    return sys.Str.plus(sys.Str.plus("[", sys.ObjUtil.coerce(v, sys.Type.find("sys::List")).join(", ", (x) => {
      return ZincWriter.valToStr(x);
    })), "]");
  }

  valToDis(val, meta) {
    if (meta === undefined) meta = Etc.emptyDict();
    let list = sys.ObjUtil.coerce(val, sys.Type.find("sys::List"));
    if (list.isEmpty()) {
      return "";
    }
    ;
    if (sys.ObjUtil.equals(list.size(), 1)) {
      return this.itemToDis(list.get(0), meta);
    }
    ;
    let s = sys.StrBuf.make();
    for (let i = 0; sys.ObjUtil.compareLT(i, list.size()); i = sys.Int.increment(i)) {
      let x = this.itemToDis(list.get(i), meta);
      if (sys.ObjUtil.compareLT(sys.Int.plus(s.size(), sys.Str.size(x)), 250)) {
        s.join(x, ", ");
      }
      else {
        s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(" (", sys.ObjUtil.coerce(sys.Int.minus(list.size(), i), sys.Obj.type$.toNullable())), " "), ListKind.type$.pod().locale("more")), ")"));
        break;
      }
      ;
    }
    ;
    return s.toStr();
  }

  itemToDis(item, meta) {
    if (item == null) {
      return "";
    }
    ;
    let kind = ((this$) => { let $_u290 = this$.#of; if ($_u290 != null) return $_u290; return Kind.fromVal(item, false); })(this);
    if (kind != null) {
      return kind.valToDis(sys.ObjUtil.coerce(item, sys.Obj.type$), meta);
    }
    ;
    return sys.ObjUtil.toStr(item);
  }

}

class DictKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DictKind.type$; }

  #tag = null;

  tag() { return this.#tag; }

  __tag(it) { if (it === undefined) return this.#tag; else this.#tag = it; }

  static make() {
    const $self = new DictKind();
    DictKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Dict", Dict.type$);
    return;
  }

  static makeTag(tag) {
    const $self = new DictKind();
    DictKind.makeTag$($self, tag);
    return $self;
  }

  static makeTag$($self, tag) {
    Kind.make$($self, "Dict", Dict.type$, sys.Str.plus(sys.Str.plus("Dict<", tag), ">"));
    $self.#tag = tag;
    return;
  }

  toTagOf(tag) {
    return DictKind.makeTag(tag);
  }

  isCollection() {
    return true;
  }

  isDict() {
    return true;
  }

  defVal() {
    return Etc.emptyDict();
  }

  valToAxon(val) {
    const this$ = this;
    let s = sys.StrBuf.make().add("{");
    sys.ObjUtil.coerce(val, Dict.type$).each((v, n) => {
      if (sys.ObjUtil.compareGT(s.size(), 1)) {
        s.add(", ");
      }
      ;
      s.add(((this$) => { if (Etc.isTagName(n)) return n; return sys.Str.toCode(n); })(this$));
      if (sys.ObjUtil.compareNE(v, Marker.val())) {
        s.add(":").add(Etc.toAxon(v));
      }
      ;
      return;
    });
    return s.add("}").toStr();
  }

}

class GridKind extends Kind {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GridKind.type$; }

  #tag = null;

  tag() { return this.#tag; }

  __tag(it) { if (it === undefined) return this.#tag; else this.#tag = it; }

  static make() {
    const $self = new GridKind();
    GridKind.make$($self);
    return $self;
  }

  static make$($self) {
    Kind.make$($self, "Grid", Grid.type$);
    return;
  }

  static makeTag(tag) {
    const $self = new GridKind();
    GridKind.makeTag$($self, tag);
    return $self;
  }

  static makeTag$($self, tag) {
    Kind.make$($self, "Grid", Grid.type$, sys.Str.plus(sys.Str.plus("Grid<", tag), ">"));
    $self.#tag = tag;
    return;
  }

  toTagOf(tag) {
    return GridKind.makeTag(tag);
  }

  isCollection() {
    return true;
  }

  isGrid() {
    return true;
  }

  defVal() {
    return Etc.makeEmptyGrid();
  }

  valToDis(val, meta) {
    if (meta === undefined) meta = Etc.emptyDict();
    return "<<Nested Grid>>";
  }

  valToAxon(val) {
    throw sys.UnsupportedErr.make("Cannot format grid to Axon");
  }

}

class CsvWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#delimiter = 44;
    this.#newline = "\n";
    this.#showHeader = true;
    this.#stripUnits = false;
    return;
  }

  typeof() { return CsvWriter.type$; }

  #delimiter = 0;

  delimiter(it) {
    if (it === undefined) {
      return this.#delimiter;
    }
    else {
      this.#delimiter = it;
      return;
    }
  }

  #newline = null;

  newline(it) {
    if (it === undefined) {
      return this.#newline;
    }
    else {
      this.#newline = it;
      return;
    }
  }

  #showHeader = false;

  showHeader(it) {
    if (it === undefined) {
      return this.#showHeader;
    }
    else {
      this.#showHeader = it;
      return;
    }
  }

  #stripUnits = false;

  stripUnits(it) {
    if (it === undefined) {
      return this.#stripUnits;
    }
    else {
      this.#stripUnits = it;
      return;
    }
  }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  static make(out, opts) {
    const $self = new CsvWriter();
    CsvWriter.make$($self, out, opts);
    return $self;
  }

  static make$($self, out, opts) {
    if (opts === undefined) opts = null;
    ;
    $self.#out = util.CsvOutStream.make(out);
    if (opts != null) {
      $self.#delimiter = $self.toDelimiter(sys.ObjUtil.coerce(opts, Dict.type$));
      $self.#showHeader = $self.toShowHeader(sys.ObjUtil.coerce(opts, Dict.type$));
      $self.#stripUnits = $self.toStripUnits(sys.ObjUtil.coerce(opts, Dict.type$));
    }
    ;
    return;
  }

  toDelimiter(opts) {
    let x = sys.ObjUtil.as(opts.get("delimiter"), sys.Str.type$);
    if ((x != null && !sys.Str.isEmpty(x))) {
      return sys.Str.get(x, 0);
    }
    ;
    return this.#delimiter;
  }

  toShowHeader(opts) {
    let x = opts.get("showHeader");
    if (x != null) {
      if ((sys.ObjUtil.equals(x, true) || sys.ObjUtil.equals(x, "true"))) {
        return true;
      }
      ;
      if ((sys.ObjUtil.equals(x, false) || sys.ObjUtil.equals(x, "false"))) {
        return false;
      }
      ;
    }
    ;
    return this.#showHeader;
  }

  toStripUnits(opts) {
    let x = opts.get("stripUnits");
    if (x != null) {
      if ((sys.ObjUtil.equals(x, true) || sys.ObjUtil.equals(x, "true"))) {
        return true;
      }
      ;
      if ((sys.ObjUtil.equals(x, false) || sys.ObjUtil.equals(x, "false"))) {
        return false;
      }
      ;
    }
    ;
    return this.#stripUnits;
  }

  static gridToStr(grid) {
    let buf = sys.StrBuf.make();
    CsvWriter.make(buf.out()).writeGrid(grid);
    return buf.toStr();
  }

  flush() {
    this.#out.flush();
    return this;
  }

  close() {
    return this.#out.close();
  }

  writeGrid(grid) {
    const this$ = this;
    let cols = grid.cols();
    if (this.#showHeader) {
      cols.each((col, i) => {
        if (sys.ObjUtil.compareGT(i, 0)) {
          this$.#out.writeChar(this$.#delimiter);
        }
        ;
        this$.#out.writeCell(col.dis());
        return;
      });
      this.#out.print(this.#newline);
    }
    ;
    grid.each((row) => {
      cols.each((col, i) => {
        if (sys.ObjUtil.compareGT(i, 0)) {
          this$.#out.writeChar(this$.#delimiter);
        }
        ;
        this$.writeScalarCell(row, col);
        return;
      });
      this$.#out.print(this$.#newline);
      return;
    });
    this.#out.flush();
    return this;
  }

  writeScalarCell(row, col) {
    let val = row.val(col);
    if (val == null) {
      sys.ObjUtil.coerce(this.#out.writeChar(34), util.CsvOutStream.type$).writeChar(34);
      return;
    }
    ;
    if (val === Marker.val()) {
      this.#out.writeChar(10003);
      return;
    }
    ;
    if (sys.ObjUtil.is(val, Number.type$)) {
      if (this.#stripUnits) {
        (val = Number.make(sys.ObjUtil.coerce(val, Number.type$).toFloat(), null));
      }
      ;
    }
    else {
      if (sys.ObjUtil.is(val, Ref.type$)) {
        let ref = sys.ObjUtil.coerce(val, Ref.type$);
        if (ref.disVal() == null) {
          this.#out.writeCell(sys.Str.plus("@", ref.id()));
        }
        else {
          this.#out.writeCell(sys.Str.plus(sys.Str.plus(sys.Str.plus("@", ref.id()), " "), ref.disVal()));
        }
        ;
        return;
      }
      ;
    }
    ;
    this.#out.writeCell(sys.ObjUtil.toStr(val));
    return;
  }

}

class XStr extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XStr.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static #defVal = undefined;

  static defVal() {
    if (XStr.#defVal === undefined) {
      XStr.static$init();
      if (XStr.#defVal === undefined) XStr.#defVal = null;
    }
    return XStr.#defVal;
  }

  static decode(type, val) {
    if (sys.ObjUtil.equals(type, "Bin")) {
      return sys.ObjUtil.coerce(Bin.make(val), sys.Obj.type$);
    }
    ;
    if (sys.ObjUtil.equals(type, "Span")) {
      return sys.ObjUtil.coerce(Span.fromStr(val), sys.Obj.type$);
    }
    ;
    return XStr.make(type, val);
  }

  static encode(val) {
    return XStr.makeImpl(sys.ObjUtil.typeof(val).name(), sys.ObjUtil.toStr(val));
  }

  static make(type, val) {
    const $self = new XStr();
    XStr.make$($self, type, val);
    return $self;
  }

  static make$($self, type, val) {
    if (!XStr.isValidType(type)) {
      throw sys.ArgErr.make(sys.Str.plus("Invalid type name: ", type));
    }
    ;
    $self.#type = type;
    $self.#val = val;
    return;
  }

  static makeImpl(type, val) {
    const $self = new XStr();
    XStr.makeImpl$($self, type, val);
    return $self;
  }

  static makeImpl$($self, type, val) {
    $self.#type = type;
    $self.#val = val;
    return;
  }

  static isValidType(t) {
    const this$ = this;
    if ((sys.Str.isEmpty(t) || !sys.Int.isUpper(sys.Str.get(t, 0)))) {
      return false;
    }
    ;
    return sys.Str.all(t, (c) => {
      return (sys.Int.isAlphaNum(c) || sys.ObjUtil.equals(c, 95));
    });
  }

  hash() {
    return sys.Int.xor(sys.Str.hash(this.#type), sys.Str.hash(this.#val));
  }

  equals(obj) {
    let that = sys.ObjUtil.as(obj, XStr.type$);
    if (that == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#type, that.#type) && sys.ObjUtil.equals(this.#val, that.#val));
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#type), "("), sys.Str.toCode(this.#val)), ")");
  }

  static static$init() {
    XStr.#defVal = XStr.makeImpl("Nil", "");
    return;
  }

}

class Reflection {
  constructor() {
    const this$ = this;
  }

  typeof() { return Reflection.type$; }

}

class Coord extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Coord.type$; }

  static #defVal = undefined;

  static defVal() {
    if (Coord.#defVal === undefined) {
      Coord.static$init();
      if (Coord.#defVal === undefined) Coord.#defVal = null;
    }
    return Coord.#defVal;
  }

  #ulat = 0;

  ulat() { return this.#ulat; }

  __ulat(it) { if (it === undefined) return this.#ulat; else this.#ulat = it; }

  #ulng = 0;

  ulng() { return this.#ulng; }

  __ulng(it) { if (it === undefined) return this.#ulng; else this.#ulng = it; }

  static fromStr(s, checked) {
    if (checked === undefined) checked = true;
    try {
      if ((!sys.Str.startsWith(s, "C(") || !sys.Str.endsWith(s, ")"))) {
        throw sys.Err.make();
      }
      ;
      let comma = sys.Str.index(s, ",", 3);
      return Coord.make(sys.ObjUtil.coerce(sys.Str.toFloat(sys.Str.getRange(s, sys.Range.make(2, sys.ObjUtil.coerce(comma, sys.Int.type$), true))), sys.Float.type$), sys.ObjUtil.coerce(sys.Str.toFloat(sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(comma, sys.Int.type$), 1), -1, true))), sys.Float.type$));
    }
    catch ($_u292) {
      $_u292 = sys.Err.make($_u292);
      if ($_u292 instanceof sys.Err) {
        let e = $_u292;
        ;
      }
      else {
        throw $_u292;
      }
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(sys.Str.plus("Coor: ", s));
    }
    ;
    return null;
  }

  static make(lat, lng) {
    const $self = new Coord();
    Coord.make$($self, lat, lng);
    return $self;
  }

  static make$($self, lat, lng) {
    $self.#ulat = sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.mult(lat, sys.Float.make(1000000.0)), sys.Num.type$));
    $self.#ulng = sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.mult(lng, sys.Float.make(1000000.0)), sys.Num.type$));
    if ((sys.ObjUtil.compareLT($self.#ulat, -90000000) || sys.ObjUtil.compareGT($self.#ulat, 90000000))) {
      throw sys.ArgErr.make("Invalid lat > +/- 90");
    }
    ;
    if ((sys.ObjUtil.compareLT($self.#ulng, -180000000) || sys.ObjUtil.compareGT($self.#ulng, 180000000))) {
      throw sys.ArgErr.make("Invalid lng > +/- 180");
    }
    ;
    return;
  }

  static makeu(ulat, ulng) {
    return Coord.makeuImpl(ulat, ulng);
  }

  static makeuImpl(ulat, ulng) {
    const $self = new Coord();
    Coord.makeuImpl$($self, ulat, ulng);
    return $self;
  }

  static makeuImpl$($self, ulat, ulng) {
    $self.#ulat = ulat;
    $self.#ulng = ulng;
    if ((sys.ObjUtil.compareLT(ulat, -90000000) || sys.ObjUtil.compareGT(ulat, 90000000))) {
      throw sys.ArgErr.make("Invalid lat > +/- 90");
    }
    ;
    if ((sys.ObjUtil.compareLT(ulng, -180000000) || sys.ObjUtil.compareGT(ulng, 180000000))) {
      throw sys.ArgErr.make("Invalid lng > +/- 180");
    }
    ;
    return;
  }

  lat() {
    return sys.Float.div(sys.Num.toFloat(sys.ObjUtil.coerce(this.#ulat, sys.Num.type$)), sys.Float.make(1000000.0));
  }

  lng() {
    return sys.Float.div(sys.Num.toFloat(sys.ObjUtil.coerce(this.#ulng, sys.Num.type$)), sys.Float.make(1000000.0));
  }

  hash() {
    return this.pack();
  }

  equals(that) {
    let x = sys.ObjUtil.as(that, Coord.type$);
    if (x == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#ulat, x.#ulat) && sys.ObjUtil.equals(this.#ulng, x.#ulng));
  }

  toStr() {
    let s = sys.StrBuf.make();
    s.add("C(");
    this.uToStr(s, this.#ulat);
    s.addChar(44);
    this.uToStr(s, this.#ulng);
    s.add(")");
    return s.toStr();
  }

  toLatLgnStr() {
    let s = sys.StrBuf.make();
    this.uToStr(s, this.#ulat);
    s.addChar(44);
    this.uToStr(s, this.#ulng);
    return s.toStr();
  }

  uToStr(s, ud) {
    const this$ = this;
    if (sys.ObjUtil.compareLT(ud, 0)) {
      s.addChar(45);
      (ud = sys.Int.negate(ud));
    }
    ;
    if (sys.ObjUtil.compareLT(ud, 1000000)) {
      sys.Locale.fromStr("en-US").use((it) => {
        s.add(sys.Float.toLocale(sys.Float.div(sys.Num.toFloat(sys.ObjUtil.coerce(ud, sys.Num.type$)), sys.Float.make(1000000.0)), "0.0#####"));
        return;
      });
      return;
    }
    ;
    let x = sys.Int.toStr(ud);
    let dot = sys.Int.minus(sys.Str.size(x), 6);
    let end = sys.Str.size(x);
    while ((sys.ObjUtil.compareGT(end, sys.Int.plus(dot, 1)) && sys.ObjUtil.equals(sys.Str.get(x, sys.Int.minus(end, 1)), 48))) {
      end = sys.Int.decrement(end);
    }
    ;
    for (let i = 0; sys.ObjUtil.compareLT(i, dot); i = sys.Int.increment(i)) {
      s.addChar(sys.Str.get(x, i));
    }
    ;
    s.addChar(46);
    for (let i = dot; sys.ObjUtil.compareLT(i, end); i = sys.Int.increment(i)) {
      s.addChar(sys.Str.get(x, i));
    }
    ;
    return;
  }

  pack() {
    return sys.Int.or(sys.Int.shiftl(sys.Int.and(sys.Int.plus(this.#ulat, 90000000), 268435455), 32), sys.Int.and(sys.Int.plus(this.#ulng, 180000000), 4294967295));
  }

  packLat() {
    return sys.Int.and(sys.Int.plus(this.#ulat, 90000000), 268435455);
  }

  packLng() {
    return sys.Int.and(sys.Int.plus(this.#ulng, 180000000), 4294967295);
  }

  static unpackI4(lat, lng) {
    return Coord.makeu(sys.Int.minus(lat, 90000000), sys.Int.minus(lng, 180000000));
  }

  static unpack(bits) {
    return Coord.makeu(sys.Int.minus(sys.Int.and(sys.Int.shiftr(bits, 32), 268435455), 90000000), sys.Int.minus(sys.Int.and(bits, 4294967295), 180000000));
  }

  dist(c2) {
    let c1 = this;
    let r = 6371;
    let dLat = sys.Float.sin(sys.Float.div(sys.Float.toRadians(sys.Float.minus(c2.lat(), c1.lat())), sys.Float.make(2.0)));
    let dLng = sys.Float.sin(sys.Float.div(sys.Float.toRadians(sys.Float.minus(c2.lng(), c1.lng())), sys.Float.make(2.0)));
    let lat1 = sys.Float.cos(sys.Float.toRadians(c1.lat()));
    let lat2 = sys.Float.cos(sys.Float.toRadians(c2.lat()));
    let a = sys.Float.plus(sys.Float.mult(dLat, dLat), sys.Float.mult(sys.Float.mult(sys.Float.mult(dLng, dLng), lat1), lat2));
    let c = sys.Float.mult(sys.Float.make(2.0), sys.Float.atan2(sys.Float.sqrt(a), sys.Float.sqrt(sys.Float.minus(sys.Float.make(1.0), a))));
    let d = sys.Int.multFloat(r, c);
    return sys.Float.mult(d, sys.Float.make(1000.0));
  }

  static static$init() {
    Coord.#defVal = Coord.makeuImpl(0, 0);
    return;
  }

}

class CsvReader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CsvReader.type$; }

  #in = null;

  // private field reflection only
  __in(it) { if (it === undefined) return this.#in; else this.#in = it; }

  static make(in$) {
    const $self = new CsvReader();
    CsvReader.make$($self, in$);
    return $self;
  }

  static make$($self, in$) {
    $self.#in = util.CsvInStream.make(in$);
    return;
  }

  readGrid() {
    const this$ = this;
    let rows = this.#in.readAllRows();
    if (rows.isEmpty()) {
      return Etc.makeEmptyGrid();
    }
    ;
    let origNames = rows.removeAt(0);
    let colNames = GridBuilder.normColNames(origNames);
    while ((!rows.isEmpty() && rows.last().isEmpty())) {
      rows.removeAt(-1);
    }
    ;
    let gb = GridBuilder.make();
    colNames.each((n, i) => {
      gb.addCol(n, Etc.makeDict1("orig", origNames.get(i)));
      return;
    });
    rows.each((row, i) => {
      gb.addRow(row);
      return;
    });
    return gb.toGrid();
  }

}

class BrioPreEncoded extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BrioPreEncoded.type$; }

  #buf = null;

  buf(it) {
    if (it === undefined) {
      return this.#buf;
    }
    else {
      this.#buf = it;
      return;
    }
  }

  static make(buf) {
    const $self = new BrioPreEncoded();
    BrioPreEncoded.make$($self, buf);
    return $self;
  }

  static make$($self, buf) {
    $self.#buf = buf;
    return;
  }

}

class BrioConsts extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#maxSafeCode = 945;
    return;
  }

  typeof() { return BrioConsts.type$; }

  static #curRef = undefined;

  static curRef() {
    if (BrioConsts.#curRef === undefined) {
      BrioConsts.static$init();
      if (BrioConsts.#curRef === undefined) BrioConsts.#curRef = null;
    }
    return BrioConsts.#curRef;
  }

  static #mimeType = undefined;

  static mimeType() {
    if (BrioConsts.#mimeType === undefined) {
      BrioConsts.static$init();
      if (BrioConsts.#mimeType === undefined) BrioConsts.#mimeType = null;
    }
    return BrioConsts.#mimeType;
  }

  #version = null;

  version() { return this.#version; }

  __version(it) { if (it === undefined) return this.#version; else this.#version = it; }

  #byVal = null;

  byVal() { return this.#byVal; }

  __byVal(it) { if (it === undefined) return this.#byVal; else this.#byVal = it; }

  #byCode = null;

  byCode() { return this.#byCode; }

  __byCode(it) { if (it === undefined) return this.#byCode; else this.#byCode = it; }

  #maxSafeCode = 0;

  maxSafeCode() { return this.#maxSafeCode; }

  __maxSafeCode(it) { if (it === undefined) return this.#maxSafeCode; else this.#maxSafeCode = it; }

  static cur() {
    return sys.ObjUtil.coerce(BrioConsts.curRef().val(), BrioConsts.type$);
  }

  static loadJava(f) {
    const this$ = this;
    let version = null;
    let byCode = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.List.make(sys.Str.type$), (it) => {
      it.capacity(1000);
      return;
    }), sys.Type.find("sys::Str[]"));
    let byVal = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int"));
    byCode.add("");
    byVal.add("", sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    f.eachLine((line) => {
      if (version == null) {
        if (sys.Str.startsWith(line, "brio-const:")) {
          throw sys.IOErr.make(line);
        }
        ;
        (version = sys.Version.fromStr(sys.Str.getRange(line, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sys.Str.index(line, ":"), sys.Int.type$), 1), -1))));
        return;
      }
      ;
      (line = sys.Str.trim(line));
      if ((sys.Str.isEmpty(line) || sys.Str.startsWith(line, "//"))) {
        return;
      }
      ;
      try {
        let sp = sys.Str.index(line, " ");
        let code = sys.Str.toInt(sys.Str.getRange(line, sys.Range.make(0, sys.ObjUtil.coerce(sp, sys.Int.type$), true)));
        let val = sys.Str.getRange(line, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sp, sys.Int.type$), 1), -1));
        if (sys.ObjUtil.compareNE(byCode.size(), code)) {
          throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(code, sys.Obj.type$.toNullable())), " != "), sys.ObjUtil.coerce(byCode.size(), sys.Obj.type$.toNullable())));
        }
        ;
        byCode.add(val);
        byVal.add(val, sys.ObjUtil.coerce(sys.ObjUtil.coerce(code, sys.Int.type$), sys.Obj.type$.toNullable()));
      }
      catch ($_u293) {
        $_u293 = sys.Err.make($_u293);
        if ($_u293 instanceof sys.Err) {
          let e = $_u293;
          ;
          throw sys.IOErr.make(sys.Str.plus("Invalid line: ", line), e);
        }
        else {
          throw $_u293;
        }
      }
      ;
      return;
    });
    return BrioConsts.make((it) => {
      it.#version = sys.ObjUtil.coerce(version, sys.Version.type$);
      it.#byCode = sys.ObjUtil.coerce(((this$) => { let $_u294 = byCode; if ($_u294 == null) return null; return sys.ObjUtil.toImmutable(byCode); })(this$), sys.Type.find("sys::Str[]"));
      it.#byVal = sys.ObjUtil.coerce(((this$) => { let $_u295 = byVal; if ($_u295 == null) return null; return sys.ObjUtil.toImmutable(byVal); })(this$), sys.Type.find("[sys::Str:sys::Int]"));
      return;
    });
  }

  static loadJs() {
    const this$ = this;
    let version = sys.Version.fromStr(BrioConstsFile.version());
    let byCode = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.List.make(sys.Str.type$), (it) => {
      it.capacity(1000);
      return;
    }), sys.Type.find("sys::Str[]"));
    let byVal = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int"));
    byCode.add("");
    byVal.add("", sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    let names = BrioConstsFile.file();
    sys.Str.split(names, sys.ObjUtil.coerce(124, sys.Int.type$.toNullable())).each((name) => {
      let code = byCode.size();
      byCode.add(name);
      byVal.set(name, sys.ObjUtil.coerce(code, sys.Obj.type$.toNullable()));
      return;
    });
    return BrioConsts.make((it) => {
      it.#version = sys.ObjUtil.coerce(version, sys.Version.type$);
      it.#byCode = sys.ObjUtil.coerce(((this$) => { let $_u296 = byCode; if ($_u296 == null) return null; return sys.ObjUtil.toImmutable(byCode); })(this$), sys.Type.find("sys::Str[]"));
      it.#byVal = sys.ObjUtil.coerce(((this$) => { let $_u297 = byVal; if ($_u297 == null) return null; return sys.ObjUtil.toImmutable(byVal); })(this$), sys.Type.find("[sys::Str:sys::Int]"));
      return;
    });
  }

  static make(f) {
    const $self = new BrioConsts();
    BrioConsts.make$($self, f);
    return $self;
  }

  static make$($self, f) {
    ;
    sys.Func.call(f, $self);
    return;
  }

  encode(val, maxStrCode) {
    let code = this.#byVal.get(val);
    if ((code != null && sys.ObjUtil.compareLE(code, maxStrCode))) {
      return code;
    }
    ;
    return null;
  }

  encodeX(val) {
    return this.#byVal.get(val);
  }

  decode(code) {
    return sys.ObjUtil.coerce(((this$) => { let $_u298 = this$.#byCode.getSafe(code); if ($_u298 != null) return $_u298; throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Missing const code ", sys.ObjUtil.coerce(code, sys.Obj.type$.toNullable())), " ["), this$.#version), "]")); })(this), sys.Str.type$);
  }

  intern(val) {
    let code = this.#byVal.get(val);
    if (code == null) {
      return val;
    }
    ;
    return this.decode(sys.ObjUtil.coerce(code, sys.Int.type$));
  }

  static static$init() {
    BrioConsts.#curRef = concurrent.AtomicRef.make(null);
    BrioConsts.#mimeType = sys.ObjUtil.coerce(sys.MimeType.fromStr("application/x-brio"), sys.MimeType.type$);
    if (true) {
      try {
        if (sys.ObjUtil.compareNE(sys.Env.cur().runtime(), "js")) {
          BrioConsts.#curRef.val(BrioConsts.loadJava(sys.ObjUtil.coerce(BrioConsts.type$.pod().file(sys.Uri.fromStr("/res/brio-consts.txt")), sys.File.type$)));
        }
        else {
          BrioConsts.#curRef.val(BrioConsts.loadJs());
        }
        ;
      }
      catch ($_u299) {
        $_u299 = sys.Err.make($_u299);
        if ($_u299 instanceof sys.Err) {
          let e = $_u299;
          ;
          e.trace();
        }
        else {
          throw $_u299;
        }
      }
      ;
    }
    ;
    return;
  }

}

class BrioConstsFile extends sys.Obj {
  constructor() { super(); }
  typeof() { return BrioConstsFile.type$; }
  static version() { return "2.1.13"; }
  static file() { return "Obj|Bin|Bool|Coord|Date|DateTime|Dict|Grid|List|Marker|NA|Number|Ref|Remove|Span|Str|Time|Uri|XStr|Obj[]|Str[]|Ref[]|Dict[]|UTC|Rel|New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Honolulu|Halifax|Winnipeg|Toronto|Montreal|Regina|Vancouver|Mexico_City|Hong_Kong|Shanghai|Seoul|Singapore|Tokyo|Kolkata|Dubai|Jerusalem|Sydney|Melbourne|Amsterdam|Berlin|Brussels|Copenhagen|Dublin|Istanbul|Lisbon|London|Madrid|Moscow|Paris|Stockholm|Vienna|Zurich|unknown|ok|down|fault|disabled|stale|remoteFault|remoteDown|remoteDisabled|remoteUnknown|pending|syncing|unbound|$siteRef|$equipRef|text/plain|text/javascript|text/html|text/trio|text/zinc|text/plain;|text/javascript;|text/html;|text/trio;|text/zinc;|image/gif|image/jpeg|image/png|image/svg|application/json|application/octet-stream|application/pdf|application/x-dicts|application/x-his|absorption|actions|ahu|ahuRef|air|airCooled|alarm|analytics|app|appFormOn|area|axAnnotated|axId|axSlotPath|axType|bacnetConn|bacnetConnRef|bacnetCur|bacnetHis|bacnetWrite|bacnetWriteLevel|blowdown|boiler|boilerPlant|boilerPlantRef|building|buildingRef|bypass|calendar|calendarRef|campusRef|centrifugal|chartOn|chilled|chilledBeamZone|chilledWaterCool|chilledWaterPlant|chiller|chillerWaterPlantRef|circuit|closedLoop|cmd|co|co2|coldDeck|color|condensate|condenser|conn|connCur|connErr|connHis|connRef|connState|connStatus|connTuning|connTuningRef|connWrite|connection|constantVolume|consumption|cool|coolOnly|cooling|coolingCapacity|coolingTower|cost|cov|crc|created|cur|curCalibration|curConvert|curErr|curKpi|curSpark|curStatus|curVal|current|damper|date|delta|demand|device|device1Ref|device2Ref|directZone|dis|disMacro|discharge|domestic|dualDuct|ductArea|dur|dxCool|effective|efficiency|elec|elecHeat|elecMeterLoad|elecMeterRef|elecPanel|elecPanelOf|elecReheat|email|enable|energy|entering|enum|equip|equipRef|evaporator|exhaust|ext|faceBypass|fan|fanPowered|fcu|filter|finAsset|finDependencies|finFile|finIcon|finProject|finResource|finRuntime|finScreenshot|finThumb|finUri|finVersion|floor|floorRef|flow|folderPath|formOn|freezeStat|freq|func|gas|gasHeat|gasMeterLoad|geoAddr|geoCity|geoCoord|geoCountry|geoCounty|geoPostalCode|geoState|geoStreet|graphicOn|haystackConnRef|haystackCur|haystackHis|haystackWrite|haystackWriteLevel|haytackConn|heat|heatExchanger|heatPump|heatWheel|heating|help|helpDoc|his|hisCollectCov|hisCollectInterval|hisConvert|hisEnd|hisEndVal|hisErr|hisFunc|hisId|hisInterpolate|hisInterval|hisKpi|hisMode|hisRef|hisSize|hisSpark|hisStart|hisStatus|hisTotalized|hot|hotDeck|hotWaterHeat|hotWaterReheat|humidifier|humidity|hvac|id|imageRef|index|isolation|kind|kpi|kpiFunc|kpiOn|kpiRef|leaving|license|licenseRef|lightLevel|lighting|lights|lightsGroup|load|maint|maintRef|makeup|max|maxVal|meter|min|minVal|mixed|mod|multiZone|name|navName|network|networkRef|neutralDeck|nextTime|nextVal|note|noteRef|num|number|obixConn|obixConnRef|obixCur|obixHis|obixWrite|occ|occupancyIndicator|occupied|openLoop|order|orderItem|orderItemRef|orderRef|org|orgRef|outside|parallel|part|partRef|perimeterHeat|periods|pf|phase|point|pointRef|power|precision|pressure|pressureDependent|pressureIndependent|primaryFunction|primaryLoop|protocol|pump|reciprocal|refrig|region|regionRef|reheat|reheating|return|rooftop|rule|ruleFunc|ruleOn|ruleRef|run|sampled|schedulable|schedule|scheduleRef|screw|secondaryLoop|sensor|series|singleDuct|site|siteMeter|sitePanel|sitePoint|siteRef|sp|space|spaceRef|spark|speed|src|stage|standby|steam|steamHeat|steamMeterLoad|subPanelOf|submeterOf|summary|sunrise|supply|temp|ticket|ticketStatus|times|tripleDuct|ts|tz|unit|unocc|uri|user|userRef|username|uv|v0|v1|v2|v3|v4|v5|v7|v8|v9|val|valve|variableVolume|vav|vavMode|vavZone|version|vfd|volt|volume|water|waterCooled|waterMeterLoad|weather|weatherCond|weatherPoint|weatherRef|wetBulb|writable|writeConvert|writeErr|writeLevel|writeStatus|writeVal|yearBuilt|zone|zoneRef|$|%|%/s|%RH|%obsc/ft|%obsc/m|/h|/min|/s|A|A/m|A/m²|AED|AUD|Am²|BTU|BTU/h|BTU/lb|C|CAD|COP|DCIE|EER|F|Fr|GB|GJ|GW|H|Hz|J|J/g|J/h|J/kg|J/kg_dry|J/kg°K|J/m²|J/°K|Js|K|K/h|K/min|K/s|L|L/h|L/min|L/s|MB|MBTU/ft²|MHz|MJ|MJ/ft²|MJ/h|MJ/kg_dry|MJ/m²|MJ/°K|MMBTU|MMBTU/h|MV|MVAR|MVARh|MVAh|MW|MWh|MWh/ft²|MWh/m²|MΩ|N|N/m|NIS|Nm|Ns|PB|PUE|Pa|S|S/m|T|TB|TWD|V|V/K|V/m|VA|VAR|VARh|VAh|W|W/cfm|W/ft²|W/ft²_irr|W/m°K|W/m²|W/m²K|W/m²_irr|W/m³/s|Wb|Wh|Wh/ft²|Wh/m²|acre|atm|bar|btu/lb_dry|byte|cal|cal/g|cd|cd/m²|cfh|cfm|cfs|cm|cmHg|cmH₂O|cm²|cm³|cph|cpm|cs|dBmV|dBµV|day|db|deg|degPh|ds|fl_oz|fnu|ft|ft/min|ft/s|ftcd|ftlbs/sec|ft²|ft³|ft³_gas|g|g/kg|g/min|g/m²|g/s|gH₂O/kgAir|gal|gal/min|galUK|galUK/min|h|hL|hL/s|hPa|hft³|hp|hph|in|inHg|inH₂O|in²|in³|kB|kBTU|kBTU/ft²|kBTU/h|kBTU/h/ft²|kHz|kJ|kJ/h|kJ/kg|kJ/kg_dry|kJ/°K|kL|kPa|kV|kVA|kVAR|kVARh|kVAh|kW|kW/ft²|kW/gal/min|kW/kcfm|kW/m²|kW/ton|kWh|kWh/ft²|kWh/m²|kcfm|kg|kg/h|kg/min|kg/m²|kg/m³|kg/s|kgal|klb|klb/h|km|km/h|km/s|km²|knot|kr|kΩ|lb|lb/h|lb/min|lb/s|lbf|lm|lx|m|m/h|m/min|m/s|m/s²|mA|mL|mL/s|mV|mVA|mW|mbar|mg|mile|mile²|mm|mm/min|mm/s|mmHg|mm²|mm³|mo|mph|ms|m²|m²/N|m³|m³/h|m³/min|m³/s|m³_gas|mΩ|ns|ntu|oz|pH|ppb|ppm|ppu|psi|psi/°F|pt|px|qt|rad|rad/s|rad/s²|rpm|s|sr|t|therm|therm/h|ton|ton/h|tonref|tonrefh|wk|yd|yd²|yd³|yr|£|¥|°C|°C/h|°C/min|°F|°F/h|°F/min|°daysC|°daysF|µg/m³|µm|µs|ΔK|Δ°C|Δ°F|руб|₩|€|₹|Ω|Ωm|元|accept-charset|accept-encoding|accept-language|all|auto|aux|avg|baseline|cache-control|call|cells|children|clear|cloudy|clusterSessionKey|clusterUsername|code|cols|content|content-encoding|content-length|content-type|cookie|dates|days|define|delete|doc|equipAccessFilter|equips|etag|eval|expires|expr|extra|firstName|flurries|fold|get|group|groupBy|gzip|hasChildren|head|headers|hidden|hisRollup|hisRollupDis|hisRollupInterval|host|http|https|ice|icon|ids|interval|keep-alive|key|kpiRule|last-modified|lastName|list|manifest|map|mapToHis|method|mode|msg|msgId|msgType|names|op|options|opts|origin|partlyCloudy|pattern|phrase|pipe|pointAccessFilter|points|post|pragma|priority|projAccessFilter|projs|put|query|rain|read|readAll|readById|readByIds|referer|rollup|rows|ruleAccessFilter|ruleType|rules|scheme|sel|select|selectable|server|showers|siteAccessFilter|sites|snow|span|sparkRule|status|sum|targetRef|targets|text|thunderstorms|timeout|transfer-encoding|type|user-agent|userAdmin|userAuthScheme|view|viz|accept|appName|base|batch|bootId|bootTime|charge|chargeType|describe|disKey|dispatch|err|errTrace|errType|executeStatus|executeTime|find|findAll|fingerprint|flatMap|folioVersion|hash|hisPageSize|hostId|hostModel|inRange|level|licProduct|locale|masterVer|maxCount|maxDataSize|node|nodeId|nonce|numBlobs|periodUnion|ping|poll|proj|pubKey|push|range|rangeStrategy|ranges|replicaVer|req|res|route|routeStatus|salt|scheduleVal|scram|send|shape|SHA-256|sig|skyarc-ui-session-key|spec|specVer|stash|steps|target|tariff|tariffHis|tariffRef|trace|traces|uiMeta|usageOn|useReplica|userAuth|userRole|ver|admin|arc|audit|by|clusterAttestKey|comment|def|defx|file|input|is|item|items|of|parts|person|skyarc::UiDef|skyarc::User|su|tagOn|unknown,clear,partlyCloudy,cloudy,showers,rain,thunderstorms,ice,flurries,snow|userProto|userProtoName|userProtoRef|airRef|arcBreakdown|arcBug|arcDamage|arcElectrical|arcEnhancement|arcHvac|arcInspection|arcMaintenance|arcOn|arcPlumbing|arcPriority|arcSafety|arcSupport|arcWish|assignedTo|cancelled|critical|dueDate|elecRef|high|low|medium|new|old|open|resolved|ticketState|viewLink|weatherStation|weatherStationRef|workorder|workorderState"; }
}

class HaystackContext {
  constructor() {
    const this$ = this;
  }

  typeof() { return HaystackContext.type$; }

  static #nilRef = undefined;

  static nilRef() {
    if (HaystackContext.#nilRef === undefined) {
      HaystackContext.static$init();
      if (HaystackContext.#nilRef === undefined) HaystackContext.#nilRef = null;
    }
    return HaystackContext.#nilRef;
  }

  static nil() {
    return HaystackContext.nilRef();
  }

  xetoIsSpec(spec, rec) {
    return false;
  }

  xetoReadById(id) {
    return this.deref(sys.ObjUtil.coerce(id, Ref.type$));
  }

  xetoReadAllEachWhile(filter, f) {
    return null;
  }

  static static$init() {
    HaystackContext.#nilRef = NilContext.make();
    return;
  }

}

class NilContext extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NilContext.type$; }

  xetoReadById() { return HaystackContext.prototype.xetoReadById.apply(this, arguments); }

  xetoReadAllEachWhile() { return HaystackContext.prototype.xetoReadAllEachWhile.apply(this, arguments); }

  xetoIsSpec() { return HaystackContext.prototype.xetoIsSpec.apply(this, arguments); }

  deref(id) {
    return null;
  }

  inference() {
    return FilterInference.nil();
  }

  toDict() {
    return Etc.emptyDict();
  }

  static make() {
    const $self = new NilContext();
    NilContext.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class PatherContext extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PatherContext.type$; }

  xetoReadById() { return HaystackContext.prototype.xetoReadById.apply(this, arguments); }

  xetoReadAllEachWhile() { return HaystackContext.prototype.xetoReadAllEachWhile.apply(this, arguments); }

  xetoIsSpec() { return HaystackContext.prototype.xetoIsSpec.apply(this, arguments); }

  #pather = null;

  // private field reflection only
  __pather(it) { if (it === undefined) return this.#pather; else this.#pather = it; }

  static make(pather) {
    const $self = new PatherContext();
    PatherContext.make$($self, pather);
    return $self;
  }

  static make$($self, pather) {
    $self.#pather = pather;
    return;
  }

  deref(id) {
    return sys.Func.call(this.#pather, id);
  }

  inference() {
    return FilterInference.nil();
  }

  toDict() {
    return Etc.emptyDict();
  }

}

class HaystackFunc {
  constructor() {
    const this$ = this;
  }

  typeof() { return HaystackFunc.type$; }

}

class EmptyDict extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EmptyDict.type$; }

  toStr() { return Dict.prototype.toStr.apply(this, arguments); }

  dis() { return Dict.prototype.dis.apply(this, arguments); }

  id() { return Dict.prototype.id.apply(this, arguments); }

  _id() { return Dict.prototype._id.apply(this, arguments); }

  static #val = undefined;

  static val() {
    if (EmptyDict.#val === undefined) {
      EmptyDict.static$init();
      if (EmptyDict.#val === undefined) EmptyDict.#val = null;
    }
    return EmptyDict.#val;
  }

  isEmpty() {
    return true;
  }

  get(key, def) {
    if (def === undefined) def = null;
    return def;
  }

  has(name) {
    return false;
  }

  missing(name) {
    return true;
  }

  each(f) {
    return;
  }

  eachWhile(f) {
    return null;
  }

  map(f) {
    f.__returns = ((arg) => { let r = arg; if (r == null || r == sys.Void.type$ || !(r instanceof sys.Type)) r = null; return r; })(arguments[arguments.length - 1]);
    return this;
  }

  trap(n, a) {
    if (a === undefined) a = null;
    throw UnknownNameErr.make(n);
  }

  static make() {
    const $self = new EmptyDict();
    EmptyDict.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    EmptyDict.#val = EmptyDict.make();
    return;
  }

}

class MapDict extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MapDict.type$; }

  toStr() { return Dict.prototype.toStr.apply(this, arguments); }

  dis() { return Dict.prototype.dis.apply(this, arguments); }

  id() { return Dict.prototype.id.apply(this, arguments); }

  _id() { return Dict.prototype._id.apply(this, arguments); }

  map() { return Dict.prototype.map.apply(this, arguments); }

  #tags = null;

  tags() { return this.#tags; }

  __tags(it) { if (it === undefined) return this.#tags; else this.#tags = it; }

  static make(tags) {
    const $self = new MapDict();
    MapDict.make$($self, tags);
    return $self;
  }

  static make$($self, tags) {
    $self.#tags = sys.ObjUtil.coerce(((this$) => { let $_u300 = tags; if ($_u300 == null) return null; return sys.ObjUtil.toImmutable(tags); })($self), sys.Type.find("[sys::Str:sys::Obj?]"));
    return;
  }

  isEmpty() {
    return this.#tags.isEmpty();
  }

  get(n, def) {
    if (def === undefined) def = null;
    return this.#tags.get(n, def);
  }

  has(n) {
    return this.#tags.get(n, null) != null;
  }

  missing(n) {
    return this.#tags.get(n, null) == null;
  }

  each(f) {
    const this$ = this;
    this.#tags.each((v, n) => {
      if (v != null) {
        sys.Func.call(f, sys.ObjUtil.coerce(v, sys.Obj.type$), n);
      }
      ;
      return;
    });
    return;
  }

  eachWhile(f) {
    const this$ = this;
    return this.#tags.eachWhile((v, n) => {
      return ((this$) => { if (v == null) return null; return sys.Func.call(f, sys.ObjUtil.coerce(v, sys.Obj.type$), n); })(this$);
    });
  }

  trap(n, a) {
    if (a === undefined) a = null;
    let v = this.#tags.get(n);
    if (v != null) {
      return v;
    }
    ;
    throw UnknownNameErr.make(n);
  }

}

class NotNullMapDict extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NotNullMapDict.type$; }

  toStr() { return Dict.prototype.toStr.apply(this, arguments); }

  dis() { return Dict.prototype.dis.apply(this, arguments); }

  id() { return Dict.prototype.id.apply(this, arguments); }

  _id() { return Dict.prototype._id.apply(this, arguments); }

  map() { return Dict.prototype.map.apply(this, arguments); }

  #tags = null;

  tags() { return this.#tags; }

  __tags(it) { if (it === undefined) return this.#tags; else this.#tags = it; }

  static make(tags) {
    const $self = new NotNullMapDict();
    NotNullMapDict.make$($self, tags);
    return $self;
  }

  static make$($self, tags) {
    $self.#tags = sys.ObjUtil.coerce(((this$) => { let $_u302 = tags; if ($_u302 == null) return null; return sys.ObjUtil.toImmutable(tags); })($self), sys.Type.find("[sys::Str:sys::Obj]"));
    return;
  }

  isEmpty() {
    return this.#tags.isEmpty();
  }

  get(n, def) {
    if (def === undefined) def = null;
    return this.#tags.get(n, def);
  }

  has(n) {
    return this.#tags.get(n, null) != null;
  }

  missing(n) {
    return this.#tags.get(n, null) == null;
  }

  each(f) {
    this.#tags.each(f);
    return;
  }

  eachWhile(f) {
    return this.#tags.eachWhile(f);
  }

  trap(n, a) {
    if (a === undefined) a = null;
    let v = this.#tags.get(n);
    if (v != null) {
      return v;
    }
    ;
    throw UnknownNameErr.make(n);
  }

}

class DictX extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DictX.type$; }

  toStr() { return Dict.prototype.toStr.apply(this, arguments); }

  dis() { return Dict.prototype.dis.apply(this, arguments); }

  id() { return Dict.prototype.id.apply(this, arguments); }

  _id() { return Dict.prototype._id.apply(this, arguments); }

  map() { return Dict.prototype.map.apply(this, arguments); }

  isEmpty() {
    return false;
  }

  has(name) {
    return this.get(name, null) != null;
  }

  missing(name) {
    return this.get(name, null) == null;
  }

  trap(name, args) {
    if (args === undefined) args = null;
    let val = this.get(name, null);
    if (val != null) {
      return val;
    }
    ;
    throw UnknownNameErr.make(name);
  }

  static make() {
    const $self = new DictX();
    DictX.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class Dict1 extends DictX {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Dict1.type$; }

  #n0 = null;

  n0() { return this.#n0; }

  __n0(it) { if (it === undefined) return this.#n0; else this.#n0 = it; }

  #v0 = null;

  v0() { return this.#v0; }

  __v0(it) { if (it === undefined) return this.#v0; else this.#v0 = it; }

  static make1(n0, v0) {
    const $self = new Dict1();
    Dict1.make1$($self, n0, v0);
    return $self;
  }

  static make1$($self, n0, v0) {
    DictX.make$($self);
    $self.#n0 = n0;
    $self.#v0 = ((this$) => { let $_u303 = v0; if ($_u303 == null) return null; return sys.ObjUtil.toImmutable(v0); })($self);
    return;
  }

  get(name, def) {
    if (def === undefined) def = null;
    if (sys.ObjUtil.equals(name, this.#n0)) {
      return this.#v0;
    }
    ;
    return def;
  }

  each(f) {
    sys.Func.call(f, this.#v0, this.#n0);
    return;
  }

  eachWhile(f) {
    let r = null;
    (r = sys.Func.call(f, this.#v0, this.#n0));
    if (r != null) {
      return r;
    }
    ;
    return null;
  }

  map(f) {
    f.__returns = ((arg) => { let r = arg; if (r == null || r == sys.Void.type$ || !(r instanceof sys.Type)) r = null; return r; })(arguments[arguments.length - 1]);
    return Dict1.make1(this.#n0, sys.Func.call(f, this.#v0, this.#n0));
  }

}

class Dict2 extends DictX {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Dict2.type$; }

  #n0 = null;

  n0() { return this.#n0; }

  __n0(it) { if (it === undefined) return this.#n0; else this.#n0 = it; }

  #n1 = null;

  n1() { return this.#n1; }

  __n1(it) { if (it === undefined) return this.#n1; else this.#n1 = it; }

  #v0 = null;

  v0() { return this.#v0; }

  __v0(it) { if (it === undefined) return this.#v0; else this.#v0 = it; }

  #v1 = null;

  v1() { return this.#v1; }

  __v1(it) { if (it === undefined) return this.#v1; else this.#v1 = it; }

  static make2(n0, v0, n1, v1) {
    const $self = new Dict2();
    Dict2.make2$($self, n0, v0, n1, v1);
    return $self;
  }

  static make2$($self, n0, v0, n1, v1) {
    DictX.make$($self);
    $self.#n0 = n0;
    $self.#v0 = ((this$) => { let $_u304 = v0; if ($_u304 == null) return null; return sys.ObjUtil.toImmutable(v0); })($self);
    $self.#n1 = n1;
    $self.#v1 = ((this$) => { let $_u305 = v1; if ($_u305 == null) return null; return sys.ObjUtil.toImmutable(v1); })($self);
    return;
  }

  get(name, def) {
    if (def === undefined) def = null;
    if (sys.ObjUtil.equals(name, this.#n0)) {
      return this.#v0;
    }
    ;
    if (sys.ObjUtil.equals(name, this.#n1)) {
      return this.#v1;
    }
    ;
    return def;
  }

  each(f) {
    sys.Func.call(f, this.#v0, this.#n0);
    sys.Func.call(f, this.#v1, this.#n1);
    return;
  }

  eachWhile(f) {
    let r = null;
    (r = sys.Func.call(f, this.#v0, this.#n0));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#v1, this.#n1));
    if (r != null) {
      return r;
    }
    ;
    return null;
  }

  map(f) {
    f.__returns = ((arg) => { let r = arg; if (r == null || r == sys.Void.type$ || !(r instanceof sys.Type)) r = null; return r; })(arguments[arguments.length - 1]);
    return Dict2.make2(this.#n0, sys.Func.call(f, this.#v0, this.#n0), this.#n1, sys.Func.call(f, this.#v1, this.#n1));
  }

}

class Dict3 extends DictX {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Dict3.type$; }

  #n0 = null;

  n0() { return this.#n0; }

  __n0(it) { if (it === undefined) return this.#n0; else this.#n0 = it; }

  #n1 = null;

  n1() { return this.#n1; }

  __n1(it) { if (it === undefined) return this.#n1; else this.#n1 = it; }

  #n2 = null;

  n2() { return this.#n2; }

  __n2(it) { if (it === undefined) return this.#n2; else this.#n2 = it; }

  #v0 = null;

  v0() { return this.#v0; }

  __v0(it) { if (it === undefined) return this.#v0; else this.#v0 = it; }

  #v1 = null;

  v1() { return this.#v1; }

  __v1(it) { if (it === undefined) return this.#v1; else this.#v1 = it; }

  #v2 = null;

  v2() { return this.#v2; }

  __v2(it) { if (it === undefined) return this.#v2; else this.#v2 = it; }

  static make3(n0, v0, n1, v1, n2, v2) {
    const $self = new Dict3();
    Dict3.make3$($self, n0, v0, n1, v1, n2, v2);
    return $self;
  }

  static make3$($self, n0, v0, n1, v1, n2, v2) {
    DictX.make$($self);
    $self.#n0 = n0;
    $self.#v0 = ((this$) => { let $_u306 = v0; if ($_u306 == null) return null; return sys.ObjUtil.toImmutable(v0); })($self);
    $self.#n1 = n1;
    $self.#v1 = ((this$) => { let $_u307 = v1; if ($_u307 == null) return null; return sys.ObjUtil.toImmutable(v1); })($self);
    $self.#n2 = n2;
    $self.#v2 = ((this$) => { let $_u308 = v2; if ($_u308 == null) return null; return sys.ObjUtil.toImmutable(v2); })($self);
    return;
  }

  get(name, def) {
    if (def === undefined) def = null;
    if (sys.ObjUtil.equals(name, this.#n0)) {
      return this.#v0;
    }
    ;
    if (sys.ObjUtil.equals(name, this.#n1)) {
      return this.#v1;
    }
    ;
    if (sys.ObjUtil.equals(name, this.#n2)) {
      return this.#v2;
    }
    ;
    return def;
  }

  each(f) {
    sys.Func.call(f, this.#v0, this.#n0);
    sys.Func.call(f, this.#v1, this.#n1);
    sys.Func.call(f, this.#v2, this.#n2);
    return;
  }

  eachWhile(f) {
    let r = null;
    (r = sys.Func.call(f, this.#v0, this.#n0));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#v1, this.#n1));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#v2, this.#n2));
    if (r != null) {
      return r;
    }
    ;
    return null;
  }

  map(f) {
    f.__returns = ((arg) => { let r = arg; if (r == null || r == sys.Void.type$ || !(r instanceof sys.Type)) r = null; return r; })(arguments[arguments.length - 1]);
    return Dict3.make3(this.#n0, sys.Func.call(f, this.#v0, this.#n0), this.#n1, sys.Func.call(f, this.#v1, this.#n1), this.#n2, sys.Func.call(f, this.#v2, this.#n2));
  }

}

class Dict4 extends DictX {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Dict4.type$; }

  #n0 = null;

  n0() { return this.#n0; }

  __n0(it) { if (it === undefined) return this.#n0; else this.#n0 = it; }

  #n1 = null;

  n1() { return this.#n1; }

  __n1(it) { if (it === undefined) return this.#n1; else this.#n1 = it; }

  #n2 = null;

  n2() { return this.#n2; }

  __n2(it) { if (it === undefined) return this.#n2; else this.#n2 = it; }

  #n3 = null;

  n3() { return this.#n3; }

  __n3(it) { if (it === undefined) return this.#n3; else this.#n3 = it; }

  #v0 = null;

  v0() { return this.#v0; }

  __v0(it) { if (it === undefined) return this.#v0; else this.#v0 = it; }

  #v1 = null;

  v1() { return this.#v1; }

  __v1(it) { if (it === undefined) return this.#v1; else this.#v1 = it; }

  #v2 = null;

  v2() { return this.#v2; }

  __v2(it) { if (it === undefined) return this.#v2; else this.#v2 = it; }

  #v3 = null;

  v3() { return this.#v3; }

  __v3(it) { if (it === undefined) return this.#v3; else this.#v3 = it; }

  static make4(n0, v0, n1, v1, n2, v2, n3, v3) {
    const $self = new Dict4();
    Dict4.make4$($self, n0, v0, n1, v1, n2, v2, n3, v3);
    return $self;
  }

  static make4$($self, n0, v0, n1, v1, n2, v2, n3, v3) {
    DictX.make$($self);
    $self.#n0 = n0;
    $self.#v0 = ((this$) => { let $_u309 = v0; if ($_u309 == null) return null; return sys.ObjUtil.toImmutable(v0); })($self);
    $self.#n1 = n1;
    $self.#v1 = ((this$) => { let $_u310 = v1; if ($_u310 == null) return null; return sys.ObjUtil.toImmutable(v1); })($self);
    $self.#n2 = n2;
    $self.#v2 = ((this$) => { let $_u311 = v2; if ($_u311 == null) return null; return sys.ObjUtil.toImmutable(v2); })($self);
    $self.#n3 = n3;
    $self.#v3 = ((this$) => { let $_u312 = v3; if ($_u312 == null) return null; return sys.ObjUtil.toImmutable(v3); })($self);
    return;
  }

  get(name, def) {
    if (def === undefined) def = null;
    if (sys.ObjUtil.equals(name, this.#n0)) {
      return this.#v0;
    }
    ;
    if (sys.ObjUtil.equals(name, this.#n1)) {
      return this.#v1;
    }
    ;
    if (sys.ObjUtil.equals(name, this.#n2)) {
      return this.#v2;
    }
    ;
    if (sys.ObjUtil.equals(name, this.#n3)) {
      return this.#v3;
    }
    ;
    return def;
  }

  each(f) {
    sys.Func.call(f, this.#v0, this.#n0);
    sys.Func.call(f, this.#v1, this.#n1);
    sys.Func.call(f, this.#v2, this.#n2);
    sys.Func.call(f, this.#v3, this.#n3);
    return;
  }

  eachWhile(f) {
    let r = null;
    (r = sys.Func.call(f, this.#v0, this.#n0));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#v1, this.#n1));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#v2, this.#n2));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#v3, this.#n3));
    if (r != null) {
      return r;
    }
    ;
    return null;
  }

  map(f) {
    f.__returns = ((arg) => { let r = arg; if (r == null || r == sys.Void.type$ || !(r instanceof sys.Type)) r = null; return r; })(arguments[arguments.length - 1]);
    return Dict4.make4(this.#n0, sys.Func.call(f, this.#v0, this.#n0), this.#n1, sys.Func.call(f, this.#v1, this.#n1), this.#n2, sys.Func.call(f, this.#v2, this.#n2), this.#n3, sys.Func.call(f, this.#v3, this.#n3));
  }

}

class Dict5 extends DictX {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Dict5.type$; }

  #n0 = null;

  n0() { return this.#n0; }

  __n0(it) { if (it === undefined) return this.#n0; else this.#n0 = it; }

  #n1 = null;

  n1() { return this.#n1; }

  __n1(it) { if (it === undefined) return this.#n1; else this.#n1 = it; }

  #n2 = null;

  n2() { return this.#n2; }

  __n2(it) { if (it === undefined) return this.#n2; else this.#n2 = it; }

  #n3 = null;

  n3() { return this.#n3; }

  __n3(it) { if (it === undefined) return this.#n3; else this.#n3 = it; }

  #n4 = null;

  n4() { return this.#n4; }

  __n4(it) { if (it === undefined) return this.#n4; else this.#n4 = it; }

  #v0 = null;

  v0() { return this.#v0; }

  __v0(it) { if (it === undefined) return this.#v0; else this.#v0 = it; }

  #v1 = null;

  v1() { return this.#v1; }

  __v1(it) { if (it === undefined) return this.#v1; else this.#v1 = it; }

  #v2 = null;

  v2() { return this.#v2; }

  __v2(it) { if (it === undefined) return this.#v2; else this.#v2 = it; }

  #v3 = null;

  v3() { return this.#v3; }

  __v3(it) { if (it === undefined) return this.#v3; else this.#v3 = it; }

  #v4 = null;

  v4() { return this.#v4; }

  __v4(it) { if (it === undefined) return this.#v4; else this.#v4 = it; }

  static make5(n0, v0, n1, v1, n2, v2, n3, v3, n4, v4) {
    const $self = new Dict5();
    Dict5.make5$($self, n0, v0, n1, v1, n2, v2, n3, v3, n4, v4);
    return $self;
  }

  static make5$($self, n0, v0, n1, v1, n2, v2, n3, v3, n4, v4) {
    DictX.make$($self);
    $self.#n0 = n0;
    $self.#v0 = ((this$) => { let $_u313 = v0; if ($_u313 == null) return null; return sys.ObjUtil.toImmutable(v0); })($self);
    $self.#n1 = n1;
    $self.#v1 = ((this$) => { let $_u314 = v1; if ($_u314 == null) return null; return sys.ObjUtil.toImmutable(v1); })($self);
    $self.#n2 = n2;
    $self.#v2 = ((this$) => { let $_u315 = v2; if ($_u315 == null) return null; return sys.ObjUtil.toImmutable(v2); })($self);
    $self.#n3 = n3;
    $self.#v3 = ((this$) => { let $_u316 = v3; if ($_u316 == null) return null; return sys.ObjUtil.toImmutable(v3); })($self);
    $self.#n4 = n4;
    $self.#v4 = ((this$) => { let $_u317 = v4; if ($_u317 == null) return null; return sys.ObjUtil.toImmutable(v4); })($self);
    return;
  }

  get(name, def) {
    if (def === undefined) def = null;
    if (sys.ObjUtil.equals(name, this.#n0)) {
      return this.#v0;
    }
    ;
    if (sys.ObjUtil.equals(name, this.#n1)) {
      return this.#v1;
    }
    ;
    if (sys.ObjUtil.equals(name, this.#n2)) {
      return this.#v2;
    }
    ;
    if (sys.ObjUtil.equals(name, this.#n3)) {
      return this.#v3;
    }
    ;
    if (sys.ObjUtil.equals(name, this.#n4)) {
      return this.#v4;
    }
    ;
    return def;
  }

  each(f) {
    sys.Func.call(f, this.#v0, this.#n0);
    sys.Func.call(f, this.#v1, this.#n1);
    sys.Func.call(f, this.#v2, this.#n2);
    sys.Func.call(f, this.#v3, this.#n3);
    sys.Func.call(f, this.#v4, this.#n4);
    return;
  }

  eachWhile(f) {
    let r = null;
    (r = sys.Func.call(f, this.#v0, this.#n0));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#v1, this.#n1));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#v2, this.#n2));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#v3, this.#n3));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#v4, this.#n4));
    if (r != null) {
      return r;
    }
    ;
    return null;
  }

  map(f) {
    f.__returns = ((arg) => { let r = arg; if (r == null || r == sys.Void.type$ || !(r instanceof sys.Type)) r = null; return r; })(arguments[arguments.length - 1]);
    return Dict5.make5(this.#n0, sys.Func.call(f, this.#v0, this.#n0), this.#n1, sys.Func.call(f, this.#v1, this.#n1), this.#n2, sys.Func.call(f, this.#v2, this.#n2), this.#n3, sys.Func.call(f, this.#v3, this.#n3), this.#n4, sys.Func.call(f, this.#v4, this.#n4));
  }

}

class Dict6 extends DictX {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Dict6.type$; }

  #n0 = null;

  n0() { return this.#n0; }

  __n0(it) { if (it === undefined) return this.#n0; else this.#n0 = it; }

  #n1 = null;

  n1() { return this.#n1; }

  __n1(it) { if (it === undefined) return this.#n1; else this.#n1 = it; }

  #n2 = null;

  n2() { return this.#n2; }

  __n2(it) { if (it === undefined) return this.#n2; else this.#n2 = it; }

  #n3 = null;

  n3() { return this.#n3; }

  __n3(it) { if (it === undefined) return this.#n3; else this.#n3 = it; }

  #n4 = null;

  n4() { return this.#n4; }

  __n4(it) { if (it === undefined) return this.#n4; else this.#n4 = it; }

  #n5 = null;

  n5() { return this.#n5; }

  __n5(it) { if (it === undefined) return this.#n5; else this.#n5 = it; }

  #v0 = null;

  v0() { return this.#v0; }

  __v0(it) { if (it === undefined) return this.#v0; else this.#v0 = it; }

  #v1 = null;

  v1() { return this.#v1; }

  __v1(it) { if (it === undefined) return this.#v1; else this.#v1 = it; }

  #v2 = null;

  v2() { return this.#v2; }

  __v2(it) { if (it === undefined) return this.#v2; else this.#v2 = it; }

  #v3 = null;

  v3() { return this.#v3; }

  __v3(it) { if (it === undefined) return this.#v3; else this.#v3 = it; }

  #v4 = null;

  v4() { return this.#v4; }

  __v4(it) { if (it === undefined) return this.#v4; else this.#v4 = it; }

  #v5 = null;

  v5() { return this.#v5; }

  __v5(it) { if (it === undefined) return this.#v5; else this.#v5 = it; }

  static make6(n0, v0, n1, v1, n2, v2, n3, v3, n4, v4, n5, v5) {
    const $self = new Dict6();
    Dict6.make6$($self, n0, v0, n1, v1, n2, v2, n3, v3, n4, v4, n5, v5);
    return $self;
  }

  static make6$($self, n0, v0, n1, v1, n2, v2, n3, v3, n4, v4, n5, v5) {
    DictX.make$($self);
    $self.#n0 = n0;
    $self.#v0 = ((this$) => { let $_u318 = v0; if ($_u318 == null) return null; return sys.ObjUtil.toImmutable(v0); })($self);
    $self.#n1 = n1;
    $self.#v1 = ((this$) => { let $_u319 = v1; if ($_u319 == null) return null; return sys.ObjUtil.toImmutable(v1); })($self);
    $self.#n2 = n2;
    $self.#v2 = ((this$) => { let $_u320 = v2; if ($_u320 == null) return null; return sys.ObjUtil.toImmutable(v2); })($self);
    $self.#n3 = n3;
    $self.#v3 = ((this$) => { let $_u321 = v3; if ($_u321 == null) return null; return sys.ObjUtil.toImmutable(v3); })($self);
    $self.#n4 = n4;
    $self.#v4 = ((this$) => { let $_u322 = v4; if ($_u322 == null) return null; return sys.ObjUtil.toImmutable(v4); })($self);
    $self.#n5 = n5;
    $self.#v5 = ((this$) => { let $_u323 = v5; if ($_u323 == null) return null; return sys.ObjUtil.toImmutable(v5); })($self);
    return;
  }

  get(name, def) {
    if (def === undefined) def = null;
    if (sys.ObjUtil.equals(name, this.#n0)) {
      return this.#v0;
    }
    ;
    if (sys.ObjUtil.equals(name, this.#n1)) {
      return this.#v1;
    }
    ;
    if (sys.ObjUtil.equals(name, this.#n2)) {
      return this.#v2;
    }
    ;
    if (sys.ObjUtil.equals(name, this.#n3)) {
      return this.#v3;
    }
    ;
    if (sys.ObjUtil.equals(name, this.#n4)) {
      return this.#v4;
    }
    ;
    if (sys.ObjUtil.equals(name, this.#n5)) {
      return this.#v5;
    }
    ;
    return def;
  }

  each(f) {
    sys.Func.call(f, this.#v0, this.#n0);
    sys.Func.call(f, this.#v1, this.#n1);
    sys.Func.call(f, this.#v2, this.#n2);
    sys.Func.call(f, this.#v3, this.#n3);
    sys.Func.call(f, this.#v4, this.#n4);
    sys.Func.call(f, this.#v5, this.#n5);
    return;
  }

  eachWhile(f) {
    let r = null;
    (r = sys.Func.call(f, this.#v0, this.#n0));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#v1, this.#n1));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#v2, this.#n2));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#v3, this.#n3));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#v4, this.#n4));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#v5, this.#n5));
    if (r != null) {
      return r;
    }
    ;
    return null;
  }

  map(f) {
    f.__returns = ((arg) => { let r = arg; if (r == null || r == sys.Void.type$ || !(r instanceof sys.Type)) r = null; return r; })(arguments[arguments.length - 1]);
    return Dict6.make6(this.#n0, sys.Func.call(f, this.#v0, this.#n0), this.#n1, sys.Func.call(f, this.#v1, this.#n1), this.#n2, sys.Func.call(f, this.#v2, this.#n2), this.#n3, sys.Func.call(f, this.#v3, this.#n3), this.#n4, sys.Func.call(f, this.#v4, this.#n4), this.#n5, sys.Func.call(f, this.#v5, this.#n5));
  }

}

class WrapDict extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WrapDict.type$; }

  toStr() { return Dict.prototype.toStr.apply(this, arguments); }

  dis() { return Dict.prototype.dis.apply(this, arguments); }

  id() { return Dict.prototype.id.apply(this, arguments); }

  _id() { return Dict.prototype._id.apply(this, arguments); }

  map() { return Dict.prototype.map.apply(this, arguments); }

  #wrapped = null;

  wrapped() { return this.#wrapped; }

  __wrapped(it) { if (it === undefined) return this.#wrapped; else this.#wrapped = it; }

  static make(wrapped) {
    const $self = new WrapDict();
    WrapDict.make$($self, wrapped);
    return $self;
  }

  static make$($self, wrapped) {
    $self.#wrapped = $self.normalize(wrapped);
    return;
  }

  get(n, def) {
    if (def === undefined) def = null;
    return this.#wrapped.get(n, def);
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

  each(f) {
    this.#wrapped.each(f);
    return;
  }

  eachWhile(f) {
    return this.#wrapped.eachWhile(f);
  }

  trap(n, a) {
    if (a === undefined) a = null;
    return this.#wrapped.trap(n, a);
  }

  normalize(d) {
    return d;
  }

}

class ReflectDict extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ReflectDict.type$; }

  toStr() { return Dict.prototype.toStr.apply(this, arguments); }

  dis() { return Dict.prototype.dis.apply(this, arguments); }

  id() { return Dict.prototype.id.apply(this, arguments); }

  _id() { return Dict.prototype._id.apply(this, arguments); }

  map() { return Dict.prototype.map.apply(this, arguments); }

  isEmpty() {
    return false;
  }

  has(n) {
    return this.get(n, null) != null;
  }

  missing(n) {
    return this.get(n, null) == null;
  }

  get(n, def) {
    if (def === undefined) def = null;
    let field = sys.ObjUtil.typeof(this).field(n, false);
    if ((field != null && !field.isStatic())) {
      return ((this$) => { let $_u324 = field.get(this$); if ($_u324 != null) return $_u324; return def; })(this);
    }
    ;
    return def;
  }

  each(f) {
    const this$ = this;
    sys.ObjUtil.typeof(this).fields().each((field) => {
      if (field.isStatic()) {
        return;
      }
      ;
      let val = field.get(this$);
      if (val == null) {
        return;
      }
      ;
      sys.Func.call(f, sys.ObjUtil.coerce(val, sys.Obj.type$), field.name());
      return;
    });
    return;
  }

  eachWhile(f) {
    const this$ = this;
    return sys.ObjUtil.typeof(this).fields().eachWhile((field) => {
      if (field.isStatic()) {
        return null;
      }
      ;
      let val = field.get(this$);
      if (val == null) {
        return null;
      }
      ;
      return sys.Func.call(f, sys.ObjUtil.coerce(val, sys.Obj.type$), field.name());
    });
  }

  trap(n, args) {
    if (args === undefined) args = null;
    let v = this.get(n, null);
    if (v != null) {
      return v;
    }
    ;
    throw UnknownNameErr.make(n);
  }

  static make() {
    const $self = new ReflectDict();
    ReflectDict.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class MLink extends WrapDict {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MLink.type$; }

  #fromRef = null;

  fromRef() { return this.#fromRef; }

  __fromRef(it) { if (it === undefined) return this.#fromRef; else this.#fromRef = it; }

  #fromSlot = null;

  fromSlot() { return this.#fromSlot; }

  __fromSlot(it) { if (it === undefined) return this.#fromSlot; else this.#fromSlot = it; }

  static #specRef$Store = undefined;

  static specRef$Store(it) { if (it === undefined) return MLink.#specRef$Store; else MLink.#specRef$Store = it; }

  static specRef() {
    if (MLink.specRef$Store() === undefined) {
      MLink.specRef$Store(MLink.specRef$Once());
    }
    ;
    return sys.ObjUtil.coerce(MLink.specRef$Store(), Ref.type$);
  }

  static make(wrapped) {
    const $self = new MLink();
    MLink.make$($self, wrapped);
    return $self;
  }

  static make$($self, wrapped) {
    WrapDict.make$($self, wrapped);
    $self.#fromRef = sys.ObjUtil.coerce(((this$) => { let $_u325 = sys.ObjUtil.as(wrapped.get("fromRef"), Ref.type$); if ($_u325 != null) return $_u325; return Ref.nullRef(); })($self), Ref.type$);
    $self.#fromSlot = sys.ObjUtil.coerce(((this$) => { let $_u326 = sys.ObjUtil.as(wrapped.get("fromSlot"), sys.Str.type$); if ($_u326 != null) return $_u326; return "-"; })($self), sys.Str.type$);
    return;
  }

  map(f) {
    f.__returns = ((arg) => { let r = arg; if (r == null || r == sys.Void.type$ || !(r instanceof sys.Type)) r = null; return r; })(arguments[arguments.length - 1]);
    return MLink.make(sys.ObjUtil.coerce(this.wrapped().map(f), Dict.type$));
  }

  static specRef$Once() {
    return sys.ObjUtil.coerce(Ref.fromStr("sys.comp::Link"), Ref.type$);
  }

  static static$init() {
    return;
  }

}

class MLinks extends WrapDict {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MLinks.type$; }

  static #specRef$Store = undefined;

  static specRef$Store(it) { if (it === undefined) return MLinks.#specRef$Store; else MLinks.#specRef$Store = it; }

  static #empty$Store = undefined;

  static empty$Store(it) { if (it === undefined) return MLinks.#empty$Store; else MLinks.#empty$Store = it; }

  static specRef() {
    if (MLinks.specRef$Store() === undefined) {
      MLinks.specRef$Store(MLinks.specRef$Once());
    }
    ;
    return sys.ObjUtil.coerce(MLinks.specRef$Store(), Ref.type$);
  }

  static empty() {
    if (MLinks.empty$Store() === undefined) {
      MLinks.empty$Store(MLinks.empty$Once());
    }
    ;
    return sys.ObjUtil.coerce(MLinks.empty$Store(), MLinks.type$);
  }

  static make(wrapped) {
    const $self = new MLinks();
    MLinks.make$($self, wrapped);
    return $self;
  }

  static make$($self, wrapped) {
    WrapDict.make$($self, wrapped);
    return;
  }

  map(f) {
    f.__returns = ((arg) => { let r = arg; if (r == null || r == sys.Void.type$ || !(r instanceof sys.Type)) r = null; return r; })(arguments[arguments.length - 1]);
    return MLinks.make(sys.ObjUtil.coerce(this.wrapped().map(f), Dict.type$));
  }

  isLinked(toSlot) {
    return this.has(toSlot);
  }

  eachLink(f) {
    const this$ = this;
    this.each((v, n) => {
      if (sys.ObjUtil.is(v, xeto.Link.type$)) {
        sys.Func.call(f, n, sys.ObjUtil.coerce(v, xeto.Link.type$));
      }
      else {
        if (sys.ObjUtil.is(v, sys.Type.find("sys::List"))) {
          sys.ObjUtil.coerce(v, sys.Type.find("sys::List")).each((x) => {
            if (sys.ObjUtil.is(x, xeto.Link.type$)) {
              sys.Func.call(f, n, sys.ObjUtil.coerce(x, xeto.Link.type$));
            }
            ;
            return;
          });
        }
        ;
      }
      ;
      return;
    });
    return;
  }

  listOn(toSlot) {
    let v = this.get(toSlot);
    if (sys.ObjUtil.is(v, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(v, sys.Type.find("xeto::Link[]"));
    }
    ;
    if (sys.ObjUtil.is(v, xeto.Link.type$)) {
      return sys.List.make(xeto.Link.type$, [sys.ObjUtil.coerce(v, xeto.Link.type$)]);
    }
    ;
    return sys.ObjUtil.coerce(xeto.Link.type$.emptyList(), sys.Type.find("xeto::Link[]"));
  }

  add(toSlot, newLink) {
    const this$ = this;
    let acc = Etc.dictToMap(this);
    let old = acc.get(toSlot);
    if (old == null) {
      acc.set(toSlot, newLink);
    }
    else {
      if (sys.ObjUtil.is(old, xeto.Link.type$)) {
        let oldLink = sys.ObjUtil.coerce(old, xeto.Link.type$);
        if (MLinks.eq(oldLink, newLink)) {
          return this;
        }
        ;
        acc.set(toSlot, sys.List.make(xeto.Link.type$, [oldLink, newLink]));
      }
      else {
        let oldList = sys.ObjUtil.coerce(old, sys.Type.find("sys::List"));
        let dup = oldList.find((x) => {
          return MLinks.eq(sys.ObjUtil.coerce(x, xeto.Link.type$), newLink);
        });
        if (dup != null) {
          return this;
        }
        ;
        acc.set(toSlot, oldList.dup().add(newLink));
      }
      ;
    }
    ;
    return MLinks.make(Etc.dictFromMap(acc));
  }

  remove(toSlot, link) {
    const this$ = this;
    let acc = Etc.dictToMap(this);
    let old = acc.get(toSlot);
    if (old == null) {
      return this;
    }
    ;
    if (sys.ObjUtil.is(old, xeto.Link.type$)) {
      if (!MLinks.eq(sys.ObjUtil.coerce(old, xeto.Link.type$), link)) {
        return this;
      }
      ;
      acc.remove(toSlot);
    }
    else {
      let oldList = sys.ObjUtil.coerce(old, sys.Type.find("sys::List"));
      let idx = oldList.findIndex((x) => {
        return MLinks.eq(sys.ObjUtil.coerce(x, xeto.Link.type$), link);
      });
      if (idx == null) {
        return this;
      }
      ;
      let newList = oldList.dup();
      newList.removeAt(sys.ObjUtil.coerce(idx, sys.Int.type$));
      if (newList.isEmpty()) {
        acc.remove(toSlot);
      }
      else {
        acc.set(toSlot, newList);
      }
      ;
    }
    ;
    if ((sys.ObjUtil.equals(acc.size(), 1) && acc.get("spec") != null)) {
      return MLinks.empty();
    }
    ;
    return MLinks.make(Etc.dictFromMap(acc));
  }

  static eq(a, b) {
    return (sys.ObjUtil.equals(a.fromRef(), b.fromRef()) && sys.ObjUtil.equals(a.fromSlot(), b.fromSlot()));
  }

  static specRef$Once() {
    return sys.ObjUtil.coerce(Ref.fromStr("sys.comp::Links"), Ref.type$);
  }

  static empty$Once() {
    return MLinks.make(Etc.dict1("spec", MLinks.specRef()));
  }

  static static$init() {
    return;
  }

}

class DictHashKey extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DictHashKey.type$; }

  #dict = null;

  dict() { return this.#dict; }

  __dict(it) { if (it === undefined) return this.#dict; else this.#dict = it; }

  #size = 0;

  size() { return this.#size; }

  __size(it) { if (it === undefined) return this.#size; else this.#size = it; }

  #nameHash = 0;

  nameHash() { return this.#nameHash; }

  __nameHash(it) { if (it === undefined) return this.#nameHash; else this.#nameHash = it; }

  #valHash = 0;

  valHash() { return this.#valHash; }

  __valHash(it) { if (it === undefined) return this.#valHash; else this.#valHash = it; }

  #hash = 0;

  hash() { return this.#hash; }

  __hash(it) { if (it === undefined) return this.#hash; else this.#hash = it; }

  static make(dict) {
    const $self = new DictHashKey();
    DictHashKey.make$($self, dict);
    return $self;
  }

  static make$($self, dict) {
    const this$ = $self;
    let hash = 17;
    let size = 0;
    let nameHash = 0;
    let valHash = 0;
    dict.each((v, n) => {
      if ((sys.ObjUtil.is(v, Dict.type$) || sys.ObjUtil.is(v, Grid.type$) || sys.ObjUtil.is(v, sys.Type.find("sys::List")))) {
        return;
      }
      ;
      let nh = sys.Str.hash(n);
      nameHash = sys.Int.plus(nameHash, nh);
      let vh = sys.ObjUtil.hash(v);
      valHash = sys.Int.plus(valHash, vh);
      hash = sys.Int.plus(hash, sys.Int.plus(nh, vh));
      ((this$) => { let $_u327 = size; size = sys.Int.increment(size); return $_u327; })(this$);
      return;
    });
    $self.#dict = dict;
    $self.#nameHash = nameHash;
    $self.#valHash = valHash;
    $self.#hash = hash;
    $self.#size = size;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("DictHashKey {", this.#dict), "}");
  }

  equals(that) {
    const this$ = this;
    let x = sys.ObjUtil.as(that, DictHashKey.type$);
    if (x == null) {
      return false;
    }
    ;
    if ((sys.ObjUtil.compareNE(this.#size, x.#size) || sys.ObjUtil.compareNE(this.#nameHash, x.#nameHash) || sys.ObjUtil.compareNE(this.#valHash, x.#valHash))) {
      return false;
    }
    ;
    let v = this.#dict.eachWhile((v, n) => {
      if ((sys.ObjUtil.is(v, Dict.type$) || sys.ObjUtil.is(v, Grid.type$) || sys.ObjUtil.is(v, sys.Type.find("sys::List")))) {
        return null;
      }
      ;
      if (sys.ObjUtil.compareNE(x.#dict.get(n), v)) {
        return sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable());
      }
      ;
      return null;
    });
    if (v != null) {
      return false;
    }
    ;
    return true;
  }

}

class HaystackTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HaystackTest.type$; }

  static #m = undefined;

  static m() {
    if (HaystackTest.#m === undefined) {
      HaystackTest.static$init();
      if (HaystackTest.#m === undefined) HaystackTest.#m = null;
    }
    return HaystackTest.#m;
  }

  static #nsDefaultRef = undefined;

  static nsDefaultRef() {
    if (HaystackTest.#nsDefaultRef === undefined) {
      HaystackTest.static$init();
      if (HaystackTest.#nsDefaultRef === undefined) HaystackTest.#nsDefaultRef = null;
    }
    return HaystackTest.#nsDefaultRef;
  }

  static n(val, unit) {
    if (unit === undefined) unit = null;
    if (val == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.is(unit, sys.Str.type$)) {
      (unit = Number.loadUnit(sys.ObjUtil.coerce(unit, sys.Str.type$)));
    }
    ;
    return Number.make(sys.Num.toFloat(val), sys.ObjUtil.coerce(unit, sys.Unit.type$.toNullable()));
  }

  ns() {
    let ns = sys.ObjUtil.as(HaystackTest.nsDefaultRef().val(), Namespace.type$);
    if (ns == null) {
      try {
        (ns = sys.ObjUtil.coerce(sys.ObjUtil.trap(sys.Type.find("skyarcd::ProjTest").method("sysBoot").callOn(null, sys.List.make(HaystackTest.type$.toNullable(), [this, null])), "ns", sys.List.make(sys.Obj.type$.toNullable(), [])), Namespace.type$.toNullable()));
      }
      catch ($_u328) {
        $_u328 = sys.Err.make($_u328);
        if ($_u328 instanceof sys.Err) {
          let e = $_u328;
          ;
        }
        else {
          throw $_u328;
        }
      }
      ;
      try {
        if (ns == null) {
          let oldcx = concurrent.Actor.locals().get(Etc.cxActorLocalsKey());
          concurrent.Actor.locals().remove(Etc.cxActorLocalsKey());
          (ns = sys.ObjUtil.coerce(sys.ObjUtil.trap(sys.Type.find("hxd::HxdTestSpi").method("boot").callOn(null, sys.List.make(HaystackTest.type$, [this])), "ns", sys.List.make(sys.Obj.type$.toNullable(), [])), Namespace.type$.toNullable()));
          concurrent.Actor.locals().addNotNull(Etc.cxActorLocalsKey(), oldcx);
        }
        ;
      }
      catch ($_u329) {
        $_u329 = sys.Err.make($_u329);
        if ($_u329 instanceof sys.Err) {
          let e = $_u329;
          ;
        }
        else {
          throw $_u329;
        }
      }
      ;
      if (ns == null) {
        (ns = sys.ObjUtil.coerce(sys.ObjUtil.trap(sys.Type.find("defc::DefCompiler").make(), "compileNamespace", sys.List.make(sys.Obj.type$.toNullable(), [])), Namespace.type$.toNullable()));
      }
      ;
      HaystackTest.nsDefaultRef().val(ns);
    }
    ;
    return sys.ObjUtil.coerce(ns, Namespace.type$);
  }

  verifyDictEq(a, b, msg) {
    if (msg === undefined) msg = null;
    const this$ = this;
    if (!sys.ObjUtil.is(b, Dict.type$)) {
      (b = Etc.makeDict(b));
    }
    ;
    let bd = sys.ObjUtil.coerce(b, Dict.type$);
    let bnames = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    bd.each((v, n) => {
      bnames.set(n, n);
      return;
    });
    a.each((v, n) => {
      try {
        let nmsg = ((this$) => { if (msg == null) return n; return sys.Str.plus(sys.Str.plus(sys.Str.plus("", msg), " -> "), n); })(this$);
        this$.verifyValEq(v, bd.get(n), nmsg);
      }
      catch ($_u331) {
        $_u331 = sys.Err.make($_u331);
        if ($_u331 instanceof sys.TestErr) {
          let e = $_u331;
          ;
          sys.ObjUtil.echo(sys.Str.plus("TAG FAILED: ", n));
          throw e;
        }
        else {
          throw $_u331;
        }
      }
      ;
      bnames.remove(n);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(bnames.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), bnames.keys().toStr());
    this.verifyEq(Etc.dictHashKey(a), Etc.dictHashKey(sys.ObjUtil.coerce(b, Dict.type$)));
    return;
  }

  verifyDictsEq(a, b, ordered) {
    if (ordered === undefined) ordered = true;
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(a.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()));
    if (!ordered) {
      (b = b.map((it) => {
        return ((this$) => { if (sys.ObjUtil.is(it, Dict.type$)) return it; return Etc.makeDict(it); })(this$);
      }, sys.Obj.type$.toNullable()));
      (a = a.dup().sort((x, y) => {
        return sys.ObjUtil.compare(((this$) => { let $_u333 = x; if ($_u333 == null) return null; return x.trap("id", sys.List.make(sys.Obj.type$.toNullable(), [])); })(this$), ((this$) => { let $_u334 = y; if ($_u334 == null) return null; return y.trap("id", sys.List.make(sys.Obj.type$.toNullable(), [])); })(this$));
      }));
      (b = b.dup().sort((x, y) => {
        return sys.ObjUtil.compare(((this$) => { let $_u335 = x; if ($_u335 == null) return null; return sys.ObjUtil.trap(x, "id", sys.List.make(sys.Obj.type$.toNullable(), [])); })(this$), ((this$) => { let $_u336 = y; if ($_u336 == null) return null; return sys.ObjUtil.trap(y, "id", sys.List.make(sys.Obj.type$.toNullable(), [])); })(this$));
      }));
    }
    ;
    this.verifyEq(sys.ObjUtil.coerce(a.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()));
    a.each((ar, i) => {
      let br = b.get(i);
      if (ar == null) {
        this$.verifyEq(ar, br);
      }
      else {
        this$.verifyDictEq(sys.ObjUtil.coerce(ar, Dict.type$), sys.ObjUtil.coerce(br, sys.Obj.type$));
      }
      ;
      return;
    });
    return;
  }

  verifyGridIsEmpty(g) {
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(g.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(g.isEmpty(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(g.first(), null);
    let rows = sys.List.make(Dict.type$);
    g.each((row) => {
      rows.add(row);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(rows.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    return;
  }

  verifyGridEq(a, b) {
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(a.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()));
    this.verifyEq(Etc.dictToMap(a.meta()), Etc.dictToMap(b.meta()));
    this.verifyEq(sys.ObjUtil.coerce(a.cols().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.cols().size(), sys.Obj.type$.toNullable()));
    a.cols().each((ac, i) => {
      this$.verifyEq(sys.ObjUtil.coerce(a.has(ac.name()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), ac.name());
      this$.verifyEq(sys.ObjUtil.coerce(a.missing(ac.name()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), ac.name());
      this$.verifyColEq(ac, b.cols().get(i));
      return;
    });
    let arows = sys.List.make(Row.type$);
    a.each((r) => {
      arows.add(r);
      return;
    });
    let brows = sys.List.make(Row.type$);
    b.each((r) => {
      brows.add(r);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(arows.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(brows.size(), sys.Obj.type$.toNullable()));
    arows.each((ar, i) => {
      let br = brows.get(i);
      this$.verifySame(a, ar.grid());
      this$.verifySame(b, br.grid());
      try {
        this$.verifyRowEq(ar, br);
      }
      catch ($_u337) {
        $_u337 = sys.Err.make($_u337);
        if ($_u337 instanceof sys.TestErr) {
          let e = $_u337;
          ;
          sys.ObjUtil.echo(sys.Str.plus("ROW FAILED: ", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())));
          throw e;
        }
        else {
          throw $_u337;
        }
      }
      ;
      return;
    });
    return;
  }

  verifyColEq(a, b) {
    this.verifyEq(a.name(), b.name());
    this.verifyEq(a.dis(), b.dis());
    this.verifyDictEq(a.meta(), b.meta());
    return;
  }

  verifyRowEq(a, b) {
    const this$ = this;
    this.verifyDictEq(a, b);
    a.grid().cols().each((ac, i) => {
      try {
        let bc = b.grid().cols().get(i);
        this$.verifyValEq(a.val(ac), b.val(bc));
      }
      catch ($_u338) {
        $_u338 = sys.Err.make($_u338);
        if ($_u338 instanceof sys.TestErr) {
          let e = $_u338;
          ;
          sys.ObjUtil.echo(sys.Str.plus("COL FAILED: ", ac.name()));
          throw e;
        }
        else {
          throw $_u338;
        }
      }
      ;
      return;
    });
    return;
  }

  verifyValEq(a, b, msg) {
    if (msg === undefined) msg = null;
    if ((sys.ObjUtil.is(a, Ref.type$) && sys.ObjUtil.is(b, Ref.type$))) {
      return this.verifyRefEq(sys.ObjUtil.coerce(a, Ref.type$), sys.ObjUtil.coerce(b, Ref.type$), msg);
    }
    ;
    if ((sys.ObjUtil.is(a, sys.Type.find("sys::List")) && sys.ObjUtil.is(b, sys.Type.find("sys::List")))) {
      return this.verifyListEq(sys.ObjUtil.coerce(a, sys.Type.find("sys::List")), sys.ObjUtil.coerce(b, sys.Type.find("sys::List")), msg);
    }
    ;
    if ((sys.ObjUtil.is(a, Dict.type$) && sys.ObjUtil.is(b, Dict.type$))) {
      return this.verifyDictEq(sys.ObjUtil.coerce(a, Dict.type$), sys.ObjUtil.coerce(b, sys.Obj.type$), msg);
    }
    ;
    if ((sys.ObjUtil.is(a, Grid.type$) && sys.ObjUtil.is(b, Grid.type$))) {
      return this.verifyGridEq(sys.ObjUtil.coerce(a, Grid.type$), sys.ObjUtil.coerce(b, Grid.type$));
    }
    ;
    if ((sys.ObjUtil.is(a, sys.Buf.type$) && sys.ObjUtil.is(b, sys.Buf.type$))) {
      return this.verifyBufEq(sys.ObjUtil.coerce(a, sys.Buf.type$), sys.ObjUtil.coerce(b, sys.Buf.type$), msg);
    }
    ;
    this.verifyEq(a, b, msg);
    return;
  }

  verifyRefEq(a, b, msg) {
    if (msg === undefined) msg = null;
    this.verifyEq(a.id(), b.id(), msg);
    this.verifyEq(a.dis(), b.dis(), msg);
    return;
  }

  verifyListEq(a, b, msg) {
    if (msg === undefined) msg = null;
    const this$ = this;
    this.verifyEq(sys.ObjUtil.typeof(a), sys.ObjUtil.typeof(b), msg);
    this.verifyEq(sys.ObjUtil.coerce(a.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()), msg);
    a.each((v, i) => {
      this$.verifyValEq(v, b.get(i), msg);
      return;
    });
    return;
  }

  verifyBufEq(a, b, msg) {
    if (msg === undefined) msg = null;
    this.verifyEq(a.toHex(), b.toHex(), msg);
    return;
  }

  verifyRecIds(grid, ids) {
    const this$ = this;
    let gridIds = sys.List.make(Ref.type$.toNullable());
    grid.each((row) => {
      gridIds.add(row.id());
      return;
    });
    if (sys.ObjUtil.compareNE(sys.ObjUtil.typeof(ids), sys.Type.find("haystack::Ref?[]"))) {
      (ids = sys.List.make(Ref.type$.toNullable()).addAll(ids));
    }
    ;
    this.verifyEq(gridIds.sort(), ids.sort());
    return;
  }

  verifyNumApprox(a, b, tolerance) {
    if (tolerance === undefined) tolerance = null;
    let bn = ((this$) => { let $_u339 = sys.ObjUtil.as(b, Number.type$); if ($_u339 != null) return $_u339; return Number.make(sys.ObjUtil.coerce(b, sys.Float.type$)); })(this);
    if (((a == null && b != null) || (a != null && b == null))) {
      this.fail(sys.Str.plus(sys.Str.plus(sys.Str.plus("", a), " != "), b));
    }
    ;
    if (!sys.Float.approx(a.toFloat(), bn.toFloat(), tolerance)) {
      this.fail(sys.Str.plus(sys.Str.plus(sys.Str.plus("", a), " ~= "), b));
    }
    ;
    this.verify(true);
    return;
  }

  static make() {
    const $self = new HaystackTest();
    HaystackTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

  static static$init() {
    HaystackTest.#m = Marker.val();
    HaystackTest.#nsDefaultRef = concurrent.AtomicRef.make();
    return;
  }

}

class BrioReader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BrioReader.type$; }

  static ctrlDateTimeF8() { return BrioCtrl.ctrlDateTimeF8(); }

  static ctrlDict() { return BrioCtrl.ctrlDict(); }

  static ctrlMarker() { return BrioCtrl.ctrlMarker(); }

  static ctrlNumberI2() { return BrioCtrl.ctrlNumberI2(); }

  static ctrlDictEmpty() { return BrioCtrl.ctrlDictEmpty(); }

  static ctrlNumberI4() { return BrioCtrl.ctrlNumberI4(); }

  static ctrlTrue() { return BrioCtrl.ctrlTrue(); }

  static ctrlTime() { return BrioCtrl.ctrlTime(); }

  static ctrlGrid() { return BrioCtrl.ctrlGrid(); }

  static ctrlNull() { return BrioCtrl.ctrlNull(); }

  static ctrlRefStr() { return BrioCtrl.ctrlRefStr(); }

  static ctrlNumberF8() { return BrioCtrl.ctrlNumberF8(); }

  static ctrlNA() { return BrioCtrl.ctrlNA(); }

  static ctrlFalse() { return BrioCtrl.ctrlFalse(); }

  static ctrlDateTimeI4() { return BrioCtrl.ctrlDateTimeI4(); }

  static ctrlListEmpty() { return BrioCtrl.ctrlListEmpty(); }

  static ctrlList() { return BrioCtrl.ctrlList(); }

  static ctrlSymbol() { return BrioCtrl.ctrlSymbol(); }

  static ctrlXStr() { return BrioCtrl.ctrlXStr(); }

  static ctrlDateTimeI8() { return BrioCtrl.ctrlDateTimeI8(); }

  static ctrlRemove() { return BrioCtrl.ctrlRemove(); }

  static ctrlUri() { return BrioCtrl.ctrlUri(); }

  static ctrlRefI8() { return BrioCtrl.ctrlRefI8(); }

  static ctrlStr() { return BrioCtrl.ctrlStr(); }

  static ctrlDate() { return BrioCtrl.ctrlDate(); }

  static ctrlBuf() { return BrioCtrl.ctrlBuf(); }

  static ctrlCoord() { return BrioCtrl.ctrlCoord(); }

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

  #cp = null;

  // private field reflection only
  __cp(it) { if (it === undefined) return this.#cp; else this.#cp = it; }

  #internStrs = null;

  // private field reflection only
  __internStrs(it) { if (it === undefined) return this.#internStrs; else this.#internStrs = it; }

  #internRefs = null;

  // private field reflection only
  __internRefs(it) { if (it === undefined) return this.#internRefs; else this.#internRefs = it; }

  #internSymbols = null;

  // private field reflection only
  __internSymbols(it) { if (it === undefined) return this.#internSymbols; else this.#internSymbols = it; }

  #internDates = null;

  // private field reflection only
  __internDates(it) { if (it === undefined) return this.#internDates; else this.#internDates = it; }

  static make(in$) {
    const $self = new BrioReader();
    BrioReader.make$($self, in$);
    return $self;
  }

  static make$($self, in$) {
    $self.#in = in$;
    $self.#cp = BrioConsts.cur();
    return;
  }

  readGrid() {
    return sys.ObjUtil.coerce(this.readVal(), Grid.type$);
  }

  close() {
    return this.#in.close();
  }

  avail() {
    return this.#in.avail();
  }

  readDict() {
    return sys.ObjUtil.coerce(this.readVal(), Dict.type$);
  }

  readVal() {
    let ctrl = this.#in.readU1();
    let $_u340 = ctrl;
    if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlNull())) {
      return null;
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlMarker())) {
      return Marker.val();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlNA())) {
      return NA.val();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlRemove())) {
      return Remove.val();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlFalse())) {
      return sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable());
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlTrue())) {
      return sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable());
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlNumberI2())) {
      return this.consumeNumberI2();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlNumberI4())) {
      return this.consumeNumberI4();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlNumberF8())) {
      return this.consumeNumberF8();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlStr())) {
      return this.consumeStr();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlRefStr())) {
      return this.consumeRefStr();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlRefI8())) {
      return this.consumeRefI8();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlUri())) {
      return this.consumeUri();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlDate())) {
      return this.consumeDate();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlTime())) {
      return this.consumeTime();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlDateTimeI4())) {
      return this.consumeDateTimeI4();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlDateTimeI8())) {
      return this.consumeDateTimeI8();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlCoord())) {
      return this.consumeCoord();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlXStr())) {
      return this.consumeXStr();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlBuf())) {
      return this.consumeBuf();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlDictEmpty())) {
      return Etc.emptyDict();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlDict())) {
      return this.consumeDict();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlListEmpty())) {
      return sys.Obj.type$.toNullable().emptyList();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlList())) {
      return this.consumeList();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlGrid())) {
      return this.consumeGrid();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlSymbol())) {
      return this.consumeSymbol();
    }
    else if (sys.ObjUtil.equals($_u340, BrioCtrl.ctrlDateTimeF8())) {
      return this.consumeDateTimeF8();
    }
    else {
      throw sys.IOErr.make(sys.Str.plus("obj ctrl 0x", sys.Int.toHex(ctrl)));
    }
    ;
  }

  consumeNumberI2() {
    return sys.ObjUtil.coerce(Number.makeInt(this.#in.readS2(), this.consumeUnit()), Number.type$);
  }

  consumeNumberI4() {
    return sys.ObjUtil.coerce(Number.makeInt(this.#in.readS4(), this.consumeUnit()), Number.type$);
  }

  consumeNumberF8() {
    return Number.make(this.#in.readF8(), this.consumeUnit());
  }

  consumeUnit() {
    let s = this.decodeStr(false);
    if (sys.Str.isEmpty(s)) {
      return null;
    }
    ;
    return Number.loadUnit(s);
  }

  consumeStr() {
    return this.internStr(this.decodeStr(true));
  }

  consumeRefStr() {
    return this.internRef(this.decodeStr(false), this.decodeStrChars(false));
  }

  consumeRefI8() {
    return this.internRef(Ref.makeHandle(this.#in.readS8()).id(), this.decodeStrChars(false));
  }

  consumeSymbol() {
    return this.internSymbol(this.decodeStr(false));
  }

  consumeUri() {
    return sys.ObjUtil.coerce(sys.Uri.fromStr(this.decodeStr(false)), sys.Uri.type$);
  }

  consumeDate() {
    return this.internDate(sys.ObjUtil.coerce(sys.Date.make(this.#in.readU2(), sys.Month.vals().get(sys.Int.minus(sys.ObjUtil.coerce(this.#in.read(), sys.Int.type$), 1)), sys.ObjUtil.coerce(this.#in.read(), sys.Int.type$)), sys.Date.type$));
  }

  consumeTime() {
    return sys.Time.fromDuration(sys.ObjUtil.coerce(sys.Duration.make(sys.Int.mult(this.#in.readU4(), 1000000)), sys.Duration.type$));
  }

  consumeDateTimeI4() {
    return sys.DateTime.makeTicks(sys.Int.mult(this.#in.readS4(), 1000000000), this.consumeTimeZone());
  }

  consumeDateTimeI8() {
    return sys.DateTime.makeTicks(this.#in.readS8(), this.consumeTimeZone());
  }

  consumeDateTimeF8() {
    return sys.DateTime.makeTicks(sys.Num.toInt(sys.ObjUtil.coerce(this.#in.readF8(), sys.Num.type$)), this.consumeTimeZone());
  }

  consumeTimeZone() {
    return sys.ObjUtil.coerce(sys.TimeZone.fromStr(this.decodeStr(false)), sys.TimeZone.type$);
  }

  consumeCoord() {
    let lat = this.#in.readU4();
    let lng = this.#in.readU4();
    return Coord.unpackI4(lat, lng);
  }

  consumeXStr() {
    let type = this.decodeStr(true);
    let val = this.decodeStr(true);
    return XStr.decode(type, val);
  }

  consumeBuf() {
    let size = this.decodeVarInt();
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.#in.readBufFully(null, size)), sys.Buf.type$);
  }

  consumeList() {
    this.verifyByte(91);
    let size = this.decodeVarInt();
    let acc = sys.List.make(sys.Obj.type$.toNullable());
    acc.capacity(size);
    for (let i = 0; sys.ObjUtil.compareLT(i, size); i = sys.Int.increment(i)) {
      let val = this.readVal();
      acc.add(val);
    }
    ;
    this.verifyByte(93);
    return sys.ObjUtil.coerce(Kind.toInferredList(acc), sys.Type.find("sys::Obj?[]"));
  }

  consumeDict() {
    this.verifyByte(123);
    let count = this.decodeVarInt();
    let $_u341 = count;
    if (sys.ObjUtil.equals($_u341, 1)) {
      return this.consumeDict1();
    }
    else if (sys.ObjUtil.equals($_u341, 2)) {
      return this.consumeDict2();
    }
    else if (sys.ObjUtil.equals($_u341, 3)) {
      return this.consumeDict3();
    }
    else if (sys.ObjUtil.equals($_u341, 4)) {
      return this.consumeDict4();
    }
    else if (sys.ObjUtil.equals($_u341, 5)) {
      return this.consumeDict5();
    }
    else if (sys.ObjUtil.equals($_u341, 6)) {
      return this.consumeDict6();
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    for (let i = 0; sys.ObjUtil.compareLT(i, count); i = sys.Int.increment(i)) {
      let tag = this.decodeStr(true);
      let val = this.readVal();
      acc.set(tag, sys.ObjUtil.coerce(val, sys.Obj.type$));
    }
    ;
    this.verifyByte(125);
    return Etc.makeDict(acc);
  }

  consumeDict1() {
    let n0 = this.decodeStr(true);
    let v0 = this.readVal();
    this.verifyByte(125);
    return Etc.dict1(n0, sys.ObjUtil.coerce(v0, sys.Obj.type$));
  }

  consumeDict2() {
    let n0 = this.decodeStr(true);
    let v0 = this.readVal();
    let n1 = this.decodeStr(true);
    let v1 = this.readVal();
    this.verifyByte(125);
    return Etc.dict2(n0, sys.ObjUtil.coerce(v0, sys.Obj.type$), n1, sys.ObjUtil.coerce(v1, sys.Obj.type$));
  }

  consumeDict3() {
    let n0 = this.decodeStr(true);
    let v0 = this.readVal();
    let n1 = this.decodeStr(true);
    let v1 = this.readVal();
    let n2 = this.decodeStr(true);
    let v2 = this.readVal();
    this.verifyByte(125);
    return Etc.dict3(n0, sys.ObjUtil.coerce(v0, sys.Obj.type$), n1, sys.ObjUtil.coerce(v1, sys.Obj.type$), n2, sys.ObjUtil.coerce(v2, sys.Obj.type$));
  }

  consumeDict4() {
    let n0 = this.decodeStr(true);
    let v0 = this.readVal();
    let n1 = this.decodeStr(true);
    let v1 = this.readVal();
    let n2 = this.decodeStr(true);
    let v2 = this.readVal();
    let n3 = this.decodeStr(true);
    let v3 = this.readVal();
    this.verifyByte(125);
    return Etc.dict4(n0, sys.ObjUtil.coerce(v0, sys.Obj.type$), n1, sys.ObjUtil.coerce(v1, sys.Obj.type$), n2, sys.ObjUtil.coerce(v2, sys.Obj.type$), n3, sys.ObjUtil.coerce(v3, sys.Obj.type$));
  }

  consumeDict5() {
    let n0 = this.decodeStr(true);
    let v0 = this.readVal();
    let n1 = this.decodeStr(true);
    let v1 = this.readVal();
    let n2 = this.decodeStr(true);
    let v2 = this.readVal();
    let n3 = this.decodeStr(true);
    let v3 = this.readVal();
    let n4 = this.decodeStr(true);
    let v4 = this.readVal();
    this.verifyByte(125);
    return Etc.dict5(n0, sys.ObjUtil.coerce(v0, sys.Obj.type$), n1, sys.ObjUtil.coerce(v1, sys.Obj.type$), n2, sys.ObjUtil.coerce(v2, sys.Obj.type$), n3, sys.ObjUtil.coerce(v3, sys.Obj.type$), n4, sys.ObjUtil.coerce(v4, sys.Obj.type$));
  }

  consumeDict6() {
    let n0 = this.decodeStr(true);
    let v0 = this.readVal();
    let n1 = this.decodeStr(true);
    let v1 = this.readVal();
    let n2 = this.decodeStr(true);
    let v2 = this.readVal();
    let n3 = this.decodeStr(true);
    let v3 = this.readVal();
    let n4 = this.decodeStr(true);
    let v4 = this.readVal();
    let n5 = this.decodeStr(true);
    let v5 = this.readVal();
    this.verifyByte(125);
    return Etc.dict6(n0, sys.ObjUtil.coerce(v0, sys.Obj.type$), n1, sys.ObjUtil.coerce(v1, sys.Obj.type$), n2, sys.ObjUtil.coerce(v2, sys.Obj.type$), n3, sys.ObjUtil.coerce(v3, sys.Obj.type$), n4, sys.ObjUtil.coerce(v4, sys.Obj.type$), n5, sys.ObjUtil.coerce(v5, sys.Obj.type$));
  }

  consumeGrid() {
    this.verifyByte(60);
    let numCols = this.decodeVarInt();
    let numRows = this.decodeVarInt();
    let gb = GridBuilder.make();
    gb.capacity(numRows);
    gb.setMeta(this.readDict());
    for (let c = 0; sys.ObjUtil.compareLT(c, numCols); c = sys.Int.increment(c)) {
      gb.addCol(this.decodeStr(true), this.readDict());
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
    this.verifyByte(62);
    return gb.toGrid();
  }

  decodeStr(intern) {
    let code = this.decodeVarInt();
    if (sys.ObjUtil.compareGE(code, 0)) {
      return this.#cp.decode(code);
    }
    ;
    return this.decodeStrChars(intern);
  }

  decodeStrChars(intern) {
    let size = this.decodeVarInt();
    let s = sys.StrBuf.make();
    s.capacity(size);
    for (let i = 0; sys.ObjUtil.compareLT(i, size); i = sys.Int.increment(i)) {
      s.addChar(sys.ObjUtil.coerce(this.#in.readChar(), sys.Int.type$));
    }
    ;
    let str = s.toStr();
    if (intern) {
      (str = this.internStr(str));
    }
    ;
    return str;
  }

  decodeVarInt() {
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

  internStr(v) {
    if (this.#internStrs == null) {
      this.#internStrs = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    }
    ;
    let intern = this.#internStrs.get(v);
    if (intern == null) {
      this.#internStrs.set(v, sys.ObjUtil.coerce((intern = v), sys.Str.type$));
    }
    ;
    return sys.ObjUtil.coerce(intern, sys.Str.type$);
  }

  internRef(id, dis) {
    if (sys.Str.isEmpty(dis)) {
      (dis = null);
    }
    ;
    let v = Ref.makeImpl(id, dis);
    if (this.#internRefs == null) {
      this.#internRefs = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("haystack::Ref"));
    }
    ;
    let intern = this.#internRefs.get(v);
    if (intern == null) {
      this.#internRefs.set(v, sys.ObjUtil.coerce((intern = v), Ref.type$));
    }
    ;
    return sys.ObjUtil.coerce(intern, Ref.type$);
  }

  internSymbol(v) {
    if (this.#internSymbols == null) {
      this.#internSymbols = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Symbol"));
    }
    ;
    let intern = this.#internSymbols.get(v);
    if (intern == null) {
      this.#internSymbols.set(v, sys.ObjUtil.coerce((intern = Symbol.parse(v)), Symbol.type$));
    }
    ;
    return sys.ObjUtil.coerce(intern, Symbol.type$);
  }

  internDate(v) {
    if (this.#internDates == null) {
      this.#internDates = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Date"), sys.Type.find("sys::Date"));
    }
    ;
    let intern = this.#internDates.get(v);
    if (intern == null) {
      this.#internDates.set(v, sys.ObjUtil.coerce((intern = v), sys.Date.type$));
    }
    ;
    return sys.ObjUtil.coerce(intern, sys.Date.type$);
  }

  verifyByte(b) {
    let x = this.#in.readU1();
    if (sys.ObjUtil.compareNE(x, b)) {
      throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unexpected byte: 0x", sys.Int.toHex(x)), " '"), sys.Int.toChar(x)), "' != 0x"), sys.Int.toHex(b)), " '"), sys.Int.toChar(b)), "'"));
    }
    ;
    return;
  }

}

const p = sys.Pod.add$('haystack');
const xp = sys.Param.noParams$();
let m;
Etc.type$ = p.at$('Etc', 'sys::Obj', [], { 'sys::Js': "" }, 8194, Etc);
GridWriter.type$ = p.am$('GridWriter', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8449, GridWriter);
TrioWriter.type$ = p.at$('TrioWriter', 'sys::Obj', ['haystack::GridWriter'], { 'sys::Js': "" }, 8192, TrioWriter);
Dict.type$ = p.am$('Dict', 'sys::Obj', ['xeto::Dict'], { 'sys::Js': "" }, 8451, Dict);
Bin.type$ = p.at$('Bin', 'sys::Obj', [], { 'sys::Js': "" }, 8226, Bin);
HaystackTokenizer.type$ = p.at$('HaystackTokenizer', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8192, HaystackTokenizer);
HaystackParser.type$ = p.at$('HaystackParser', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8193, HaystackParser);
HaystackFactory.type$ = p.at$('HaystackFactory', 'sys::Obj', [], { 'sys::Js': "", 'sys::NoDoc': "" }, 8192, HaystackFactory);
FreeFormParser.type$ = p.at$('FreeFormParser', 'haystack::HaystackParser', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8192, FreeFormParser);
HaystackToken.type$ = p.at$('HaystackToken', 'sys::Enum', [], { 'sys::NoDoc': "", 'sys::Js': "", 'sys::Serializable': "sys::Serializable{simple=true;}" }, 8234, HaystackToken);
Filter.type$ = p.at$('Filter', 'sys::Obj', [], { 'sys::Js': "" }, 8195, Filter);
FilterType.type$ = p.at$('FilterType', 'sys::Enum', [], { 'sys::Js': "", 'sys::NoDoc': "", 'sys::Serializable': "sys::Serializable{simple=true;}" }, 8234, FilterType);
SimpleFilter.type$ = p.at$('SimpleFilter', 'haystack::Filter', [], { 'sys::Js': "" }, 131, SimpleFilter);
FilterHas.type$ = p.at$('FilterHas', 'haystack::SimpleFilter', [], { 'sys::Js': "" }, 162, FilterHas);
FilterMissing.type$ = p.at$('FilterMissing', 'haystack::SimpleFilter', [], { 'sys::Js': "" }, 162, FilterMissing);
FilterEq.type$ = p.at$('FilterEq', 'haystack::SimpleFilter', [], { 'sys::Js': "" }, 162, FilterEq);
FilterNe.type$ = p.at$('FilterNe', 'haystack::SimpleFilter', [], { 'sys::Js': "" }, 162, FilterNe);
FilterCmp.type$ = p.at$('FilterCmp', 'haystack::SimpleFilter', [], { 'sys::Js': "" }, 131, FilterCmp);
FilterLt.type$ = p.at$('FilterLt', 'haystack::FilterCmp', [], { 'sys::Js': "" }, 162, FilterLt);
FilterLe.type$ = p.at$('FilterLe', 'haystack::FilterCmp', [], { 'sys::Js': "" }, 162, FilterLe);
FilterGt.type$ = p.at$('FilterGt', 'haystack::FilterCmp', [], { 'sys::Js': "" }, 162, FilterGt);
FilterGe.type$ = p.at$('FilterGe', 'haystack::FilterCmp', [], { 'sys::Js': "" }, 162, FilterGe);
FilterAnd.type$ = p.at$('FilterAnd', 'haystack::Filter', [], { 'sys::Js': "" }, 162, FilterAnd);
FilterOr.type$ = p.at$('FilterOr', 'haystack::Filter', [], { 'sys::Js': "" }, 162, FilterOr);
FilterIsSymbol.type$ = p.at$('FilterIsSymbol', 'haystack::Filter', [], { 'sys::Js': "" }, 162, FilterIsSymbol);
FilterIsSpec.type$ = p.at$('FilterIsSpec', 'haystack::Filter', [], { 'sys::Js': "" }, 162, FilterIsSpec);
FilterPath.type$ = p.at$('FilterPath', 'sys::Obj', [], { 'sys::Js': "", 'sys::NoDoc': "" }, 8195, FilterPath);
FilterPath1.type$ = p.at$('FilterPath1', 'haystack::FilterPath', [], { 'sys::Js': "" }, 162, FilterPath1);
FilterPathN.type$ = p.at$('FilterPathN', 'haystack::FilterPath', [], { 'sys::Js': "" }, 162, FilterPathN);
FilterInference.type$ = p.am$('FilterInference', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8449, FilterInference);
NilFilterInference.type$ = p.at$('NilFilterInference', 'sys::Obj', ['haystack::FilterInference'], { 'sys::NoDoc': "", 'sys::Js': "" }, 130, NilFilterInference);
FilterParser.type$ = p.at$('FilterParser', 'haystack::HaystackParser', [], { 'sys::Js': "" }, 128, FilterParser);
SearchFilter.type$ = p.at$('SearchFilter', 'haystack::Filter', [], { 'sys::Js': "" }, 131, SearchFilter);
GlobSearchFilter.type$ = p.at$('GlobSearchFilter', 'haystack::SearchFilter', [], { 'sys::Js': "" }, 130, GlobSearchFilter);
RegexSearchFilter.type$ = p.at$('RegexSearchFilter', 'haystack::SearchFilter', [], { 'sys::Js': "" }, 130, RegexSearchFilter);
FilterSearchFilter.type$ = p.at$('FilterSearchFilter', 'haystack::SearchFilter', [], { 'sys::Js': "" }, 130, FilterSearchFilter);
NumberFormat.type$ = p.at$('NumberFormat', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8194, NumberFormat);
Col.type$ = p.at$('Col', 'sys::Obj', [], { 'sys::Js': "" }, 8195, Col);
Namespace.type$ = p.am$('Namespace', 'sys::Obj', [], { 'sys::Js': "" }, 8451, Namespace);
Remove.type$ = p.at$('Remove', 'sys::Obj', [], { 'sys::Js': "" }, 8226, Remove);
HisItem.type$ = p.at$('HisItem', 'sys::Obj', ['haystack::Dict'], { 'sys::Js': "" }, 8226, HisItem);
ZincWriter.type$ = p.at$('ZincWriter', 'sys::Obj', ['haystack::GridWriter'], { 'sys::Js': "" }, 8192, ZincWriter);
JsonWriter.type$ = p.at$('JsonWriter', 'sys::Obj', ['haystack::GridWriter'], { 'sys::Js': "" }, 8192, JsonWriter);
HaysonWriter.type$ = p.at$('HaysonWriter', 'sys::Obj', ['haystack::GridWriter'], { 'sys::Js': "" }, 128, HaysonWriter);
JsonV3Writer.type$ = p.at$('JsonV3Writer', 'sys::Obj', ['haystack::GridWriter'], { 'sys::Js': "" }, 128, JsonV3Writer);
Def.type$ = p.am$('Def', 'sys::Obj', ['haystack::Dict'], { 'sys::Js': "" }, 8451, Def);
Lib.type$ = p.am$('Lib', 'sys::Obj', ['haystack::Def'], { 'sys::NoDoc': "", 'sys::Js': "" }, 8451, Lib);
UnknownNameErr.type$ = p.at$('UnknownNameErr', 'sys::Err', [], { 'sys::Js': "" }, 8194, UnknownNameErr);
UnknownDefErr.type$ = p.at$('UnknownDefErr', 'sys::Err', [], { 'sys::Js': "", 'sys::NoDoc': "" }, 8194, UnknownDefErr);
UnknownSpecErr.type$ = p.at$('UnknownSpecErr', 'sys::Err', [], { 'sys::Js': "", 'sys::NoDoc': "" }, 8194, UnknownSpecErr);
UnknownFeatureErr.type$ = p.at$('UnknownFeatureErr', 'sys::Err', [], { 'sys::Js': "", 'sys::NoDoc': "" }, 8194, UnknownFeatureErr);
UnknownFiletypeErr.type$ = p.at$('UnknownFiletypeErr', 'sys::Err', [], { 'sys::Js': "", 'sys::NoDoc': "" }, 8194, UnknownFiletypeErr);
UnknownLibErr.type$ = p.at$('UnknownLibErr', 'sys::Err', [], { 'sys::Js': "", 'sys::NoDoc': "" }, 8194, UnknownLibErr);
UnknownRecErr.type$ = p.at$('UnknownRecErr', 'sys::Err', [], { 'sys::Js': "" }, 8194, UnknownRecErr);
UnknownKindErr.type$ = p.at$('UnknownKindErr', 'sys::Err', [], { 'sys::Js': "", 'sys::NoDoc': "" }, 8194, UnknownKindErr);
UnknownTagErr.type$ = p.at$('UnknownTagErr', 'sys::Err', [], { 'sys::Js': "", 'sys::NoDoc': "" }, 8194, UnknownTagErr);
UnknownFuncErr.type$ = p.at$('UnknownFuncErr', 'sys::Err', [], { 'sys::Js': "", 'sys::NoDoc': "" }, 8194, UnknownFuncErr);
UnknownCompErr.type$ = p.at$('UnknownCompErr', 'sys::Err', [], { 'sys::Js': "", 'sys::NoDoc': "" }, 8194, UnknownCompErr);
UnknownCellErr.type$ = p.at$('UnknownCellErr', 'sys::Err', [], { 'sys::Js': "", 'sys::NoDoc': "" }, 8194, UnknownCellErr);
NotHaystackErr.type$ = p.at$('NotHaystackErr', 'sys::Err', [], { 'sys::Js': "", 'sys::NoDoc': "" }, 8194, NotHaystackErr);
UnitErr.type$ = p.at$('UnitErr', 'sys::Err', [], { 'sys::Js': "" }, 8194, UnitErr);
DependErr.type$ = p.at$('DependErr', 'sys::Err', [], { 'sys::Js': "" }, 8194, DependErr);
CallErr.type$ = p.at$('CallErr', 'sys::Err', [], { 'sys::Js': "" }, 8194, CallErr);
DisabledErr.type$ = p.at$('DisabledErr', 'sys::Err', [], {}, 8194, DisabledErr);
FaultErr.type$ = p.at$('FaultErr', 'sys::Err', [], { 'sys::Js': "" }, 8194, FaultErr);
DownErr.type$ = p.at$('DownErr', 'sys::Err', [], { 'sys::Js': "" }, 8194, DownErr);
CoerceErr.type$ = p.at$('CoerceErr', 'sys::Err', [], { 'sys::Js': "", 'sys::NoDoc': "" }, 8194, CoerceErr);
PermissionErr.type$ = p.at$('PermissionErr', 'sys::Err', [], { 'sys::NoDoc': "" }, 8194, PermissionErr);
ValidateErr.type$ = p.at$('ValidateErr', 'sys::Err', [], { 'sys::Js': "" }, 8194, ValidateErr);
InvalidNameErr.type$ = p.at$('InvalidNameErr', 'sys::Err', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8194, InvalidNameErr);
InvalidChangeErr.type$ = p.at$('InvalidChangeErr', 'sys::Err', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8194, InvalidChangeErr);
DuplicateNameErr.type$ = p.at$('DuplicateNameErr', 'sys::Err', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8194, DuplicateNameErr);
AlreadyParentedErr.type$ = p.at$('AlreadyParentedErr', 'sys::Err', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8194, AlreadyParentedErr);
GridReader.type$ = p.am$('GridReader', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8449, GridReader);
Row.type$ = p.at$('Row', 'sys::Obj', ['haystack::Dict'], { 'sys::Js': "" }, 8195, Row);
Macro.type$ = p.at$('Macro', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8192, Macro);
Client.type$ = p.at$('Client', 'sys::Obj', [], {}, 8192, Client);
HaystackClientAuth.type$ = p.am$('HaystackClientAuth', 'sys::Obj', [], { 'sys::NoDoc': "" }, 8449, HaystackClientAuth);
Define.type$ = p.am$('Define', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8451, Define);
Marker.type$ = p.at$('Marker', 'sys::Obj', [], { 'sys::Js': "", 'sys::Serializable': "sys::Serializable{simple=true;}" }, 8226, Marker);
ObjRange.type$ = p.at$('ObjRange', 'sys::Obj', [], { 'sys::Js': "", 'sys::NoDoc': "" }, 8226, ObjRange);
JsonReader.type$ = p.at$('JsonReader', 'sys::Obj', ['haystack::GridReader'], { 'sys::Js': "" }, 8192, JsonReader);
JsonParser.type$ = p.at$('JsonParser', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8193, JsonParser);
HaysonParser.type$ = p.at$('HaysonParser', 'haystack::JsonParser', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8192, HaysonParser);
JsonV3Parser.type$ = p.at$('JsonV3Parser', 'haystack::JsonParser', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8192, JsonV3Parser);
ZincReader.type$ = p.at$('ZincReader', 'sys::Obj', ['haystack::GridReader'], { 'sys::Js': "" }, 8192, ZincReader);
TrioReader.type$ = p.at$('TrioReader', 'sys::Obj', ['haystack::GridReader'], { 'sys::Js': "" }, 8192, TrioReader);
Ref.type$ = p.at$('Ref', 'xeto::Ref', [], { 'sys::Js': "", 'sys::Serializable': "sys::Serializable{simple=true;}" }, 8226, Ref);
RefDir.type$ = p.at$('RefDir', 'sys::Enum', [], { 'sys::NoDoc': "", 'sys::Js': "", 'sys::Serializable': "sys::Serializable{simple=true;}" }, 8234, RefDir);
RefSeg.type$ = p.at$('RefSeg', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8194, RefSeg);
RefSchemes.type$ = p.at$('RefSchemes', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8194, RefSchemes);
GridBuilder.type$ = p.at$('GridBuilder', 'sys::Obj', [], { 'sys::Js': "" }, 8192, GridBuilder);
Grid.type$ = p.am$('Grid', 'sys::Obj', [], { 'sys::Js': "" }, 8451, Grid);
GbGrid.type$ = p.at$('GbGrid', 'sys::Obj', ['haystack::Grid'], { 'sys::Js': "" }, 130, GbGrid);
GbCol.type$ = p.at$('GbCol', 'haystack::Col', [], { 'sys::Js': "" }, 130, GbCol);
GbRow.type$ = p.at$('GbRow', 'haystack::Row', [], { 'sys::Js': "" }, 130, GbRow);
Filetype.type$ = p.am$('Filetype', 'sys::Obj', ['haystack::Def'], { 'sys::NoDoc': "", 'sys::Js': "" }, 8451, Filetype);
Symbol.type$ = p.at$('Symbol', 'sys::Obj', [], { 'sys::Js': "" }, 8195, Symbol);
SymbolType.type$ = p.at$('SymbolType', 'sys::Enum', [], { 'sys::NoDoc': "", 'sys::Js': "", 'sys::Serializable': "sys::Serializable{simple=true;}" }, 8234, SymbolType);
TagSymbol.type$ = p.at$('TagSymbol', 'haystack::Symbol', [], { 'sys::Js': "" }, 130, TagSymbol);
ConjunctSymbol.type$ = p.at$('ConjunctSymbol', 'haystack::Symbol', [], { 'sys::Js': "" }, 130, ConjunctSymbol);
KeySymbol.type$ = p.at$('KeySymbol', 'haystack::Symbol', [], { 'sys::Js': "" }, 130, KeySymbol);
NA.type$ = p.at$('NA', 'sys::Obj', [], { 'sys::Js': "", 'sys::Serializable': "sys::Serializable{simple=true;}" }, 8226, NA);
Feature.type$ = p.am$('Feature', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8451, Feature);
WebOpUtil.type$ = p.am$('WebOpUtil', 'sys::Obj', [], { 'sys::NoDoc': "" }, 8451, WebOpUtil);
TypedDict.type$ = p.at$('TypedDict', 'sys::Obj', ['haystack::Dict'], { 'sys::Js': "" }, 8194, TypedDict);
TypedTag.type$ = p.at$('TypedTag', 'sys::Obj', ['sys::Facet', 'haystack::Define'], { 'sys::Js': "", 'sys::Serializable': "" }, 8242, TypedTag);
Span.type$ = p.at$('Span', 'sys::Obj', [], { 'sys::Js': "" }, 8226, Span);
SpanMode.type$ = p.at$('SpanMode', 'sys::Enum', [], { 'sys::Js': "", 'sys::Serializable': "sys::Serializable{simple=true;}" }, 8234, SpanMode);
Number.type$ = p.at$('Number', 'sys::Obj', [], { 'sys::Js': "", 'sys::Serializable': "sys::Serializable{simple=true;}" }, 8226, Number);
BrioCtrl.type$ = p.am$('BrioCtrl', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8449, BrioCtrl);
BrioWriter.type$ = p.at$('BrioWriter', 'sys::Obj', ['haystack::GridWriter', 'haystack::BrioCtrl'], { 'sys::NoDoc': "", 'sys::Js': "" }, 8192, BrioWriter);
DateSpan.type$ = p.at$('DateSpan', 'sys::Obj', [], { 'sys::Js': "", 'sys::Serializable': "sys::Serializable{simple=true;}" }, 8226, DateSpan);
Kind.type$ = p.at$('Kind', 'sys::Obj', [], { 'sys::Js': "" }, 8195, Kind);
ObjKind.type$ = p.at$('ObjKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, ObjKind);
MarkerKind.type$ = p.at$('MarkerKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, MarkerKind);
NAKind.type$ = p.at$('NAKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, NAKind);
RemoveKind.type$ = p.at$('RemoveKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, RemoveKind);
BoolKind.type$ = p.at$('BoolKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, BoolKind);
NumberKind.type$ = p.at$('NumberKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, NumberKind);
RefKind.type$ = p.at$('RefKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, RefKind);
SymbolKind.type$ = p.at$('SymbolKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, SymbolKind);
StrKind.type$ = p.at$('StrKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, StrKind);
UriKind.type$ = p.at$('UriKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, UriKind);
DateTimeKind.type$ = p.at$('DateTimeKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, DateTimeKind);
DateKind.type$ = p.at$('DateKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, DateKind);
TimeKind.type$ = p.at$('TimeKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, TimeKind);
CoordKind.type$ = p.at$('CoordKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, CoordKind);
XStrKind.type$ = p.at$('XStrKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, XStrKind);
BinKind.type$ = p.at$('BinKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, BinKind);
SpanKind.type$ = p.at$('SpanKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, SpanKind);
ListKind.type$ = p.at$('ListKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, ListKind);
DictKind.type$ = p.at$('DictKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, DictKind);
GridKind.type$ = p.at$('GridKind', 'haystack::Kind', [], { 'sys::Js': "" }, 162, GridKind);
CsvWriter.type$ = p.at$('CsvWriter', 'sys::Obj', ['haystack::GridWriter'], { 'sys::Js': "" }, 8192, CsvWriter);
XStr.type$ = p.at$('XStr', 'sys::Obj', [], { 'sys::Js': "" }, 8226, XStr);
Reflection.type$ = p.am$('Reflection', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8451, Reflection);
Coord.type$ = p.at$('Coord', 'sys::Obj', [], { 'sys::Js': "", 'sys::Serializable': "sys::Serializable{simple=true;}" }, 8226, Coord);
CsvReader.type$ = p.at$('CsvReader', 'sys::Obj', ['haystack::GridReader'], { 'sys::Js': "" }, 8192, CsvReader);
BrioPreEncoded.type$ = p.at$('BrioPreEncoded', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8192, BrioPreEncoded);
BrioConsts.type$ = p.at$('BrioConsts', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8194, BrioConsts);
BrioConstsFile.type$ = p.at$('BrioConstsFile', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8704, BrioConstsFile);
HaystackContext.type$ = p.am$('HaystackContext', 'sys::Obj', ['xeto::XetoContext'], { 'sys::Js': "" }, 8449, HaystackContext);
NilContext.type$ = p.at$('NilContext', 'sys::Obj', ['haystack::HaystackContext'], { 'sys::Js': "" }, 130, NilContext);
PatherContext.type$ = p.at$('PatherContext', 'sys::Obj', ['haystack::HaystackContext'], { 'sys::NoDoc': "", 'sys::Js': "" }, 8192, PatherContext);
HaystackFunc.type$ = p.am$('HaystackFunc', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8449, HaystackFunc);
EmptyDict.type$ = p.at$('EmptyDict', 'sys::Obj', ['haystack::Dict'], { 'sys::Js': "" }, 130, EmptyDict);
MapDict.type$ = p.at$('MapDict', 'sys::Obj', ['haystack::Dict'], { 'sys::Js': "" }, 130, MapDict);
NotNullMapDict.type$ = p.at$('NotNullMapDict', 'sys::Obj', ['haystack::Dict'], { 'sys::Js': "" }, 130, NotNullMapDict);
DictX.type$ = p.at$('DictX', 'sys::Obj', ['haystack::Dict'], { 'sys::Js': "" }, 131, DictX);
Dict1.type$ = p.at$('Dict1', 'haystack::DictX', [], { 'sys::Js': "" }, 130, Dict1);
Dict2.type$ = p.at$('Dict2', 'haystack::DictX', [], { 'sys::Js': "" }, 130, Dict2);
Dict3.type$ = p.at$('Dict3', 'haystack::DictX', [], { 'sys::Js': "" }, 130, Dict3);
Dict4.type$ = p.at$('Dict4', 'haystack::DictX', [], { 'sys::Js': "" }, 130, Dict4);
Dict5.type$ = p.at$('Dict5', 'haystack::DictX', [], { 'sys::Js': "" }, 130, Dict5);
Dict6.type$ = p.at$('Dict6', 'haystack::DictX', [], { 'sys::Js': "" }, 130, Dict6);
WrapDict.type$ = p.at$('WrapDict', 'sys::Obj', ['haystack::Dict'], { 'sys::NoDoc': "", 'sys::Js': "" }, 8195, WrapDict);
ReflectDict.type$ = p.at$('ReflectDict', 'sys::Obj', ['haystack::Dict'], { 'sys::NoDoc': "", 'sys::Js': "" }, 8195, ReflectDict);
MLink.type$ = p.at$('MLink', 'haystack::WrapDict', ['xeto::Link'], { 'sys::Js': "" }, 130, MLink);
MLinks.type$ = p.at$('MLinks', 'haystack::WrapDict', ['xeto::Links'], { 'sys::Js': "" }, 130, MLinks);
DictHashKey.type$ = p.at$('DictHashKey', 'sys::Obj', [], { 'sys::NoDoc': "", 'sys::Js': "" }, 8194, DictHashKey);
HaystackTest.type$ = p.at$('HaystackTest', 'sys::Test', [], { 'sys::Js': "" }, 8193, HaystackTest);
BrioReader.type$ = p.at$('BrioReader', 'sys::Obj', ['haystack::GridReader', 'haystack::BrioCtrl'], { 'sys::NoDoc': "", 'sys::Js': "" }, 8192, BrioReader);
Etc.type$.af$('emptyTags', 106498, '[sys::Str:sys::Obj?]', { 'sys::NoDoc': "" }).af$('dictIterateNulls', 106498, 'sys::Bool', { 'sys::NoDoc': "" }).af$('list0', 106498, 'sys::Obj?[]', { 'sys::NoDoc': "" }).af$('toBase64', 106498, 'sys::Str', { 'sys::NoDoc': "" }).af$('fromBase64', 106498, 'sys::Int[]', { 'sys::NoDoc': "" }).af$('emptyGridRef', 100354, 'concurrent::AtomicRef', {}).af$('tsKeyFormat', 106498, 'sys::Str', { 'sys::NoDoc': "" }).af$('cxActorLocalsKey', 106498, 'sys::Str', { 'sys::NoDoc': "" }).am$('emptyDict', 40962, 'haystack::Dict', xp, {}).am$('makeDict', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {}).am$('mapToDict', 34818, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('map', '[sys::Str:sys::Obj?]', false)]), {}).am$('makeDict1', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false), new sys.Param('v', 'sys::Obj?', false)]), {}).am$('makeDict2', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj?', false), new sys.Param('n1', 'sys::Str', false), new sys.Param('v1', 'sys::Obj?', false)]), {}).am$('makeDict3', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj?', false), new sys.Param('n1', 'sys::Str', false), new sys.Param('v1', 'sys::Obj?', false), new sys.Param('n2', 'sys::Str', false), new sys.Param('v2', 'sys::Obj?', false)]), {}).am$('makeDict4', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj?', false), new sys.Param('n1', 'sys::Str', false), new sys.Param('v1', 'sys::Obj?', false), new sys.Param('n2', 'sys::Str', false), new sys.Param('v2', 'sys::Obj?', false), new sys.Param('n3', 'sys::Str', false), new sys.Param('v3', 'sys::Obj?', false)]), {}).am$('makeDict5', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj?', false), new sys.Param('n1', 'sys::Str', false), new sys.Param('v1', 'sys::Obj?', false), new sys.Param('n2', 'sys::Str', false), new sys.Param('v2', 'sys::Obj?', false), new sys.Param('n3', 'sys::Str', false), new sys.Param('v3', 'sys::Obj?', false), new sys.Param('n4', 'sys::Str', false), new sys.Param('v4', 'sys::Obj?', false)]), {}).am$('makeDict6', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj?', false), new sys.Param('n1', 'sys::Str', false), new sys.Param('v1', 'sys::Obj?', false), new sys.Param('n2', 'sys::Str', false), new sys.Param('v2', 'sys::Obj?', false), new sys.Param('n3', 'sys::Str', false), new sys.Param('v3', 'sys::Obj?', false), new sys.Param('n4', 'sys::Str', false), new sys.Param('v4', 'sys::Obj?', false), new sys.Param('n5', 'sys::Str', false), new sys.Param('v5', 'sys::Obj?', false)]), {}).am$('dict0', 40962, 'haystack::Dict', xp, {}).am$('dict1', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false), new sys.Param('v', 'sys::Obj', false)]), {}).am$('dict2', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj', false), new sys.Param('n1', 'sys::Str', false), new sys.Param('v1', 'sys::Obj', false)]), {}).am$('dict3', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj', false), new sys.Param('n1', 'sys::Str', false), new sys.Param('v1', 'sys::Obj', false), new sys.Param('n2', 'sys::Str', false), new sys.Param('v2', 'sys::Obj', false)]), {}).am$('dict4', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj', false), new sys.Param('n1', 'sys::Str', false), new sys.Param('v1', 'sys::Obj', false), new sys.Param('n2', 'sys::Str', false), new sys.Param('v2', 'sys::Obj', false), new sys.Param('n3', 'sys::Str', false), new sys.Param('v3', 'sys::Obj', false)]), {}).am$('dict5', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj', false), new sys.Param('n1', 'sys::Str', false), new sys.Param('v1', 'sys::Obj', false), new sys.Param('n2', 'sys::Str', false), new sys.Param('v2', 'sys::Obj', false), new sys.Param('n3', 'sys::Str', false), new sys.Param('v3', 'sys::Obj', false), new sys.Param('n4', 'sys::Str', false), new sys.Param('v4', 'sys::Obj', false)]), {}).am$('dict6', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj', false), new sys.Param('n1', 'sys::Str', false), new sys.Param('v1', 'sys::Obj', false), new sys.Param('n2', 'sys::Str', false), new sys.Param('v2', 'sys::Obj', false), new sys.Param('n3', 'sys::Str', false), new sys.Param('v3', 'sys::Obj', false), new sys.Param('n4', 'sys::Str', false), new sys.Param('v4', 'sys::Obj', false), new sys.Param('n5', 'sys::Str', false), new sys.Param('v5', 'sys::Obj', false)]), {}).am$('dictFromMap', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('map', '[sys::Str:sys::Obj]', false)]), { 'sys::NoDoc': "" }).am$('link', 40962, 'xeto::Link', sys.List.make(sys.Param.type$, [new sys.Param('fromRef', 'haystack::Ref', false), new sys.Param('fromSlot', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('linkWrap', 40962, 'xeto::Link', sys.List.make(sys.Param.type$, [new sys.Param('wrap', 'haystack::Dict', false)]), { 'sys::NoDoc': "" }).am$('links', 40962, 'xeto::Links', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), { 'sys::NoDoc': "" }).am$('makeDicts', 40962, 'haystack::Dict[]', sys.List.make(sys.Param.type$, [new sys.Param('maps', 'sys::Obj?[]', false)]), {}).am$('dictNames', 40962, 'sys::Str[]', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false)]), {}).am$('dictsNames', 40962, 'sys::Str[]', sys.List.make(sys.Param.type$, [new sys.Param('dicts', 'haystack::Dict?[]', false)]), {}).am$('dictVals', 40962, 'sys::Obj[]', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false)]), {}).am$('dictToMap', 40962, '[sys::Str:sys::Obj?]', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict?', false)]), {}).am$('dictEach', 40962, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false), new sys.Param('f', '|sys::Obj?,sys::Str->sys::Void|', false)]), { 'sys::NoDoc': "" }).am$('dictEachWhile', 40962, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false), new sys.Param('f', '|sys::Obj?,sys::Str->sys::Obj?|', false)]), { 'sys::NoDoc': "" }).am$('rowEach', 34818, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('r', 'haystack::Row', false), new sys.Param('f', '|sys::Obj?,sys::Str->sys::Obj?|', false), new sys.Param('isWhile', 'sys::Bool', false)]), {}).am$('dictFind', 40962, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false), new sys.Param('f', '|sys::Obj?,sys::Str->sys::Bool|', false)]), { 'sys::NoDoc': "" }).am$('dictFindAll', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false), new sys.Param('f', '|sys::Obj?,sys::Str->sys::Bool|', false)]), {}).am$('dictMap', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false), new sys.Param('f', '|sys::Obj?,sys::Str->sys::Obj?|', false)]), {}).am$('dictAny', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false), new sys.Param('f', '|sys::Obj?,sys::Str->sys::Bool|', false)]), {}).am$('dictAll', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false), new sys.Param('f', '|sys::Obj?,sys::Str->sys::Bool|', false)]), {}).am$('dictMerge', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('a', 'haystack::Dict', false), new sys.Param('b', 'sys::Obj?', false)]), {}).am$('dictRemoveAllWithVal', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false), new sys.Param('val', 'sys::Obj?', false)]), { 'sys::NoDoc': "" }).am$('dictRemoveNulls', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false)]), { 'sys::NoDoc': "" }).am$('dictSet', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict?', false), new sys.Param('name', 'sys::Str', false), new sys.Param('val', 'sys::Obj?', false)]), {}).am$('dictRemove', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false), new sys.Param('name', 'sys::Str', false)]), {}).am$('dictRemoveAll', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false), new sys.Param('names', 'sys::Str[]', false)]), {}).am$('dictRename', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false), new sys.Param('oldName', 'sys::Str', false), new sys.Param('newName', 'sys::Str', false)]), {}).am$('dictHashKey', 40962, 'sys::Obj', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false)]), {}).am$('dictEq', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('a', 'haystack::Dict', false), new sys.Param('b', 'haystack::Dict', false)]), {}).am$('dictDump', 40962, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false), new sys.Param('out', 'sys::OutStream', true)]), { 'sys::NoDoc': "" }).am$('dictToStr', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false)]), { 'sys::NoDoc': "" }).am$('dictGetDuration', 40962, 'sys::Duration?', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false), new sys.Param('name', 'sys::Str', false), new sys.Param('def', 'sys::Duration?', true), new sys.Param('remove', 'sys::Duration?', true)]), { 'sys::NoDoc': "" }).am$('dictGetInt', 40962, 'sys::Int?', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false), new sys.Param('name', 'sys::Str', false), new sys.Param('def', 'sys::Int?', true), new sys.Param('remove', 'sys::Int?', true)]), { 'sys::NoDoc': "" }).am$('toHaystack', 40962, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false), new sys.Param('opts', 'haystack::Dict?', true)]), {}).am$('dictToHaystack', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('dict', 'haystack::Dict', false), new sys.Param('opts', 'haystack::Dict?', true)]), {}).am$('eq', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('a', 'sys::Obj?', false), new sys.Param('b', 'sys::Obj?', false)]), { 'sys::NoDoc': "" }).am$('listEq', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('a', 'sys::Obj?[]', false), new sys.Param('b', 'sys::Obj?[]', false)]), { 'sys::NoDoc': "" }).am$('gridEq', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('a', 'haystack::Grid', false), new sys.Param('b', 'haystack::Grid', false)]), { 'sys::NoDoc': "" }).am$('dictToDis', 40962, 'sys::Str?', sys.List.make(sys.Param.type$, [new sys.Param('dict', 'haystack::Dict', false), new sys.Param('def', 'sys::Str?', true)]), {}).am$('relDis', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('parent', 'sys::Str', false), new sys.Param('child', 'sys::Str', false)]), {}).am$('relDisStrip', 34818, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('c', 'sys::Int', false)]), {}).am$('compareDis', 40962, 'sys::Int', sys.List.make(sys.Param.type$, [new sys.Param('a', 'sys::Str', false), new sys.Param('b', 'sys::Str', false)]), {}).am$('sortDictsByDis', 40962, 'haystack::Dict[]', sys.List.make(sys.Param.type$, [new sys.Param('dicts', 'haystack::Dict[]', false)]), { 'sys::NoDoc': "" }).am$('sortDis', 40962, 'sys::Obj[]', sys.List.make(sys.Param.type$, [new sys.Param('list', 'sys::Obj[]', false), new sys.Param('getDis', '|sys::Obj->sys::Str|?', true)]), { 'sys::NoDoc': "" }).am$('sortCompare', 40962, 'sys::Int', sys.List.make(sys.Param.type$, [new sys.Param('a', 'sys::Obj?', false), new sys.Param('b', 'sys::Obj?', false)]), { 'sys::NoDoc': "" }).am$('sortCompareNorm', 34818, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {}).am$('macro', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('pattern', 'sys::Str', false), new sys.Param('scope', 'haystack::Dict', false)]), {}).am$('macroVars', 40962, 'sys::Str[]', sys.List.make(sys.Param.type$, [new sys.Param('pattern', 'sys::Str', false)]), {}).am$('disKey', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('key', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('valToDis', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false), new sys.Param('meta', 'haystack::Dict?', true), new sys.Param('clip', 'sys::Bool', true)]), { 'sys::NoDoc': "" }).am$('tsToDis', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('ts', 'sys::DateTime?', false), new sys.Param('now', 'sys::DateTime', true)]), { 'sys::NoDoc': "" }).am$('isKindName', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('isTagName', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('isEscapedTagName', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('escapeTagName', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('unescapeTagName', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('toTagName', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('tagToLocale', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('nameStartsWith', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('prefix', 'sys::Str', false), new sys.Param('name', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('isFileName', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('toFileName', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('isSafeRelDir', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('uri', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('isFileNameChar', 34818, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('ch', 'sys::Int', false)]), {}).am$('toAxon', 40962, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), { 'sys::NoDoc': "" }).am$('discretePeriods', 40962, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('str', 'sys::Str', false), new sys.Param('f', '|sys::Int,sys::Int->sys::Void|', false)]), {}).am$('discretePeriodsDis', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('rec', 'haystack::Dict', false), new sys.Param('start', 'sys::DateTime', false), new sys.Param('periods', 'sys::Str', false), new sys.Param('max', 'sys::Int', true)]), { 'sys::NoDoc': "" }).am$('periodDurToDis', 34818, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('d', 'sys::Duration', false)]), {}).am$('emptyGrid', 40962, 'haystack::Grid', xp, { 'sys::NoDoc': "" }).am$('gridToStrVal', 40962, 'sys::Str?', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid?', false), new sys.Param('def', 'sys::Str?', true)]), { 'sys::NoDoc': "" }).am$('makeEmptyGrid', 40962, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('meta', 'sys::Obj?', true)]), {}).am$('makeErrGrid', 40962, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('e', 'sys::Err', false), new sys.Param('meta', 'sys::Obj?', true)]), {}).am$('toErrMeta', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('e', 'sys::Err', false)]), {}).am$('toErrTrace', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('e', 'sys::Err', false)]), { 'sys::NoDoc': "" }).am$('toAuxTrace', 34818, 'sys::Str?', sys.List.make(sys.Param.type$, [new sys.Param('e', 'sys::Err?', false), new sys.Param('fieldName', 'sys::Str', false)]), {}).am$('makeMapGrid', 40962, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('meta', 'sys::Obj?', false), new sys.Param('row', '[sys::Str:sys::Obj?]', false)]), {}).am$('makeMapsGrid', 40962, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('meta', 'sys::Obj?', false), new sys.Param('rows', '[sys::Str:sys::Obj?][]', false)]), {}).am$('makeDictGrid', 40962, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('meta', 'sys::Obj?', false), new sys.Param('row', 'haystack::Dict', false)]), {}).am$('makeDictsGrid', 40962, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('meta', 'sys::Obj?', false), new sys.Param('rows', 'haystack::Dict?[]', false)]), {}).am$('makeListGrid', 40962, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('meta', 'sys::Obj?', false), new sys.Param('colName', 'sys::Str', false), new sys.Param('colMeta', 'sys::Obj?', false), new sys.Param('rows', 'sys::Obj?[]', false)]), {}).am$('makeListsGrid', 40962, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('meta', 'sys::Obj?', false), new sys.Param('colNames', 'sys::Str[]', false), new sys.Param('colMetas', 'sys::Obj?[]?', false), new sys.Param('rows', 'sys::Obj?[][]', false)]), {}).am$('gridFlatten', 40962, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('grids', 'haystack::Grid[]', false)]), {}).am$('toId', 40962, 'haystack::Ref', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {}).am$('toIds', 40962, 'haystack::Ref[]', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {}).am$('toRec', 40962, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false), new sys.Param('cx', 'haystack::HaystackContext?', true)]), {}).am$('toRecs', 40962, 'haystack::Dict[]', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false), new sys.Param('cx', 'haystack::HaystackContext?', true)]), {}).am$('refToRec', 34818, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('id', 'haystack::Ref', false), new sys.Param('cx', 'haystack::HaystackContext?', false)]), {}).am$('refsToRecs', 34818, 'haystack::Dict[]', sys.List.make(sys.Param.type$, [new sys.Param('ids', 'haystack::Ref[]', false), new sys.Param('cx', 'haystack::HaystackContext?', false)]), {}).am$('toGrid', 40962, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false), new sys.Param('meta', 'haystack::Dict?', true)]), {}).am$('toCell', 40962, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), { 'sys::NoDoc': "" }).am$('toDateSpan', 40962, 'haystack::DateSpan', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false), new sys.Param('cx', 'haystack::HaystackContext?', true)]), {}).am$('toSpan', 40962, 'haystack::Span', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false), new sys.Param('tz', 'sys::TimeZone?', true), new sys.Param('cx', 'haystack::HaystackContext?', true)]), {}).am$('curContext', 34818, 'haystack::HaystackContext', sys.List.make(sys.Param.type$, [new sys.Param('cx', 'haystack::HaystackContext?', false)]), {}).am$('debugDur', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('dur', 'sys::Obj?', false)]), { 'sys::NoDoc': "" }).am$('debugErr', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('err', 'sys::Err?', false), new sys.Param('flags', 'sys::Str', true)]), { 'sys::NoDoc': "" }).am$('indent', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('str', 'sys::Str', false), new sys.Param('indent', 'sys::Int', true), new sys.Param('flags', 'sys::Str', true)]), { 'sys::NoDoc': "" }).am$('addArg', 40962, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('b', 'sys::StrBuf', false), new sys.Param('name', 'sys::Str', false), new sys.Param('arg', 'sys::Obj?', false)]), {}).am$('toCliArgsMap', 40962, '[sys::Str:sys::Str]', sys.List.make(sys.Param.type$, [new sys.Param('args', 'sys::Str[]', false)]), { 'sys::NoDoc': "" }).am$('formatMultiLine', 40962, 'sys::Str[]', sys.List.make(sys.Param.type$, [new sys.Param('str', 'sys::Str', false), new sys.Param('lineLength', 'sys::Int', true)]), { 'sys::NoDoc': "" }).am$('make', 139268, 'sys::Void', xp, {}).am$('static$init', 165890, 'sys::Void', xp, {});
GridWriter.type$.am$('writeGrid', 270337, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid', false)]), {});
TrioWriter.type$.af$('quotedKeyword', 100354, '[sys::Str:sys::Str]', {}).af$('quoteChars', 100354, 'sys::Bool[]', {}).af$('out', 67584, 'sys::OutStream', {}).af$('needSep', 67584, 'sys::Bool', {}).af$('noSort', 67584, 'sys::Bool', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('out', 'sys::OutStream', false), new sys.Param('opts', 'haystack::Dict?', true)]), {}).am$('dictToStr', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'haystack::Dict', false)]), { 'sys::NoDoc': "" }).am$('gridToStr', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid', false)]), { 'sys::NoDoc': "" }).am$('writeGrid', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid', false)]), {}).am$('writeDict', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('dict', 'haystack::Dict', false)]), {}).am$('writeCollection', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('requiresNestedZinc', 2048, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {}).am$('writeNestedZinc', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('writeRec', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('dict', 'haystack::Dict', false)]), { 'sys::NoDoc': "", 'sys::Deprecated': "sys::Deprecated{msg=\"Use writeDict\";}" }).am$('writeAllRecs', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('dicts', 'haystack::Dict[]', false)]), { 'sys::NoDoc': "", 'sys::Deprecated': "sys::Deprecated{msg=\"Use writeAllDicts\";}" }).am$('useQuotes', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('requireQuoteChar', 34818, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('ch', 'sys::Int', false)]), {}).am$('writeAllDicts', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('dicts', 'haystack::Dict[]', false)]), {}).am$('sync', 8192, 'sys::This', xp, { 'sys::NoDoc': "" }).am$('close', 8192, 'sys::Bool', xp, {}).am$('normVal', 270336, 'sys::Obj', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('static$init', 165890, 'sys::Void', xp, {});
Dict.type$.am$('isEmpty', 271361, 'sys::Bool', xp, {}).am$('get', 271361, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('def', 'sys::Obj?', true)]), { 'sys::Operator': "" }).am$('has', 271361, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('missing', 271361, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('each', 271361, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), {}).am$('eachWhile', 271361, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj?|', false)]), {}).am$('trap', 271361, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('args', 'sys::Obj?[]?', true)]), {}).am$('map', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj|', false)]), {}).am$('id', 270336, 'haystack::Ref', xp, {}).am$('_id', 271360, 'xeto::Ref', xp, {}).am$('dis', 270336, 'sys::Str?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str?', true), new sys.Param('def', 'sys::Str?', true)]), {}).am$('toStr', 271360, 'sys::Str', xp, {});
Bin.type$.af$('mime', 73730, 'sys::MimeType', {}).af$('predefined', 100354, '[sys::Str:haystack::Bin]', {}).af$('defVal', 106498, 'haystack::Bin', {}).am$('make', 40966, 'haystack::Bin?', sys.List.make(sys.Param.type$, [new sys.Param('mime', 'sys::Str', false)]), {}).am$('makeImpl', 2052, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('mime', 'sys::MimeType', false)]), {}).am$('hash', 271360, 'sys::Int', xp, {}).am$('equals', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj?', false)]), {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('static$init', 165890, 'sys::Void', xp, {});
HaystackTokenizer.type$.af$('tok', 73728, 'haystack::HaystackToken', {}).af$('val', 73728, 'sys::Obj?', {}).af$('line', 73728, 'sys::Int', {}).af$('keepComments', 73728, 'sys::Bool', {}).af$('keywords', 73728, '[sys::Str:sys::Obj]?', {}).af$('factory', 73728, 'haystack::HaystackFactory', { 'sys::NoDoc': "" }).af$('strictUnit', 73728, 'sys::Bool', { 'sys::NoDoc': "" }).af$('in', 67584, 'sys::InStream', {}).af$('cur', 67584, 'sys::Int', {}).af$('peek', 67584, 'sys::Int', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('in', 'sys::InStream', false)]), {}).am$('next', 8192, 'haystack::HaystackToken', xp, {}).am$('close', 8192, 'sys::Bool', xp, {}).am$('id', 2048, 'haystack::HaystackToken', xp, {}).am$('num', 2048, 'haystack::HaystackToken', xp, {}).am$('str', 2048, 'haystack::HaystackToken', xp, {}).am$('ref', 2048, 'haystack::HaystackToken', xp, {}).am$('symbol', 2048, 'haystack::HaystackToken', xp, {}).am$('uri', 2048, 'haystack::HaystackToken', xp, {}).am$('escape', 2048, 'sys::Int', xp, {}).am$('operator', 2048, 'haystack::HaystackToken', xp, {}).am$('parseComment', 2048, 'haystack::HaystackToken', xp, {}).am$('skipCommentSL', 2048, 'sys::Void', xp, {}).am$('skipCommentML', 2048, 'sys::Void', xp, {}).am$('err', 8192, 'sys::ParseErr', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false)]), {}).am$('consume', 2048, 'sys::Void', xp, {});
HaystackParser.type$.af$('input', 73730, 'sys::Str', {}).af$('tokenizer', 73728, 'haystack::HaystackTokenizer', {}).af$('cur', 73728, 'haystack::HaystackToken', {}).af$('curVal', 73728, 'sys::Obj?', {}).af$('peek', 73728, 'haystack::HaystackToken', {}).af$('peekVal', 73728, 'sys::Obj?', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('isKeyword', 8192, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('verify', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('expected', 'haystack::HaystackToken', false)]), {}).am$('curToStr', 8192, 'sys::Str', xp, {}).am$('consume', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('expected', 'haystack::HaystackToken?', true)]), {}).am$('err', 8192, 'sys::ParseErr', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false)]), {});
HaystackFactory.type$.am$('makeId', 270336, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('makeStr', 270336, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('makeUri', 270336, 'sys::Uri', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('makeRef', 270336, 'haystack::Ref', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false), new sys.Param('dis', 'sys::Str?', false)]), {}).am$('makeSymbol', 270336, 'haystack::Symbol', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('makeTime', 270336, 'sys::Time?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('makeDate', 270336, 'sys::Date?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('makeDateTime', 270336, 'sys::DateTime?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('makeNumber', 270336, 'haystack::Number', sys.List.make(sys.Param.type$, [new sys.Param('f', 'sys::Float', false), new sys.Param('unit', 'sys::Unit?', false)]), {}).am$('make', 139268, 'sys::Void', xp, {});
FreeFormParser.type$.af$('ns', 73730, 'haystack::Namespace', {}).af$('acc', 67584, '[sys::Str:sys::Obj?]', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('ns', 'haystack::Namespace', false), new sys.Param('s', 'sys::Str', false)]), {}).am$('parse', 8192, 'haystack::Dict', xp, {}).am$('parseRaw', 2048, '[sys::Str:sys::Obj?]', xp, {}).am$('tag', 2048, 'sys::Void', xp, {}).am$('curToVal', 2048, 'sys::Obj', xp, {}).am$('postProcess', 2048, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('acc', '[sys::Str:sys::Obj?]', false)]), {}).am$('norm', 2048, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('val', 'sys::Obj?', false)]), {});
HaystackToken.type$.af$('id', 106506, 'haystack::HaystackToken', {}).af$('keyword', 106506, 'haystack::HaystackToken', {}).af$('num', 106506, 'haystack::HaystackToken', {}).af$('str', 106506, 'haystack::HaystackToken', {}).af$('ref', 106506, 'haystack::HaystackToken', {}).af$('symbol', 106506, 'haystack::HaystackToken', {}).af$('uri', 106506, 'haystack::HaystackToken', {}).af$('date', 106506, 'haystack::HaystackToken', {}).af$('time', 106506, 'haystack::HaystackToken', {}).af$('dateTime', 106506, 'haystack::HaystackToken', {}).af$('dot', 106506, 'haystack::HaystackToken', {}).af$('colon', 106506, 'haystack::HaystackToken', {}).af$('colon2', 106506, 'haystack::HaystackToken', {}).af$('comma', 106506, 'haystack::HaystackToken', {}).af$('semicolon', 106506, 'haystack::HaystackToken', {}).af$('minus', 106506, 'haystack::HaystackToken', {}).af$('eq', 106506, 'haystack::HaystackToken', {}).af$('notEq', 106506, 'haystack::HaystackToken', {}).af$('lt', 106506, 'haystack::HaystackToken', {}).af$('lt2', 106506, 'haystack::HaystackToken', {}).af$('ltEq', 106506, 'haystack::HaystackToken', {}).af$('gt', 106506, 'haystack::HaystackToken', {}).af$('gt2', 106506, 'haystack::HaystackToken', {}).af$('gtEq', 106506, 'haystack::HaystackToken', {}).af$('lbrace', 106506, 'haystack::HaystackToken', {}).af$('rbrace', 106506, 'haystack::HaystackToken', {}).af$('lparen', 106506, 'haystack::HaystackToken', {}).af$('rparen', 106506, 'haystack::HaystackToken', {}).af$('lbracket', 106506, 'haystack::HaystackToken', {}).af$('rbracket', 106506, 'haystack::HaystackToken', {}).af$('arrow', 106506, 'haystack::HaystackToken', {}).af$('fnArrow', 106506, 'haystack::HaystackToken', {}).af$('slash', 106506, 'haystack::HaystackToken', {}).af$('assign', 106506, 'haystack::HaystackToken', {}).af$('bang', 106506, 'haystack::HaystackToken', {}).af$('question', 106506, 'haystack::HaystackToken', {}).af$('amp', 106506, 'haystack::HaystackToken', {}).af$('pipe', 106506, 'haystack::HaystackToken', {}).af$('nl', 106506, 'haystack::HaystackToken', {}).af$('comment', 106506, 'haystack::HaystackToken', {}).af$('eof', 106506, 'haystack::HaystackToken', {}).af$('vals', 106498, 'haystack::HaystackToken[]', {}).af$('dis', 73730, 'sys::Str', {}).af$('literal', 73730, 'sys::Bool', {}).am$('make', 2052, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('$ordinal', 'sys::Int', false), new sys.Param('$name', 'sys::Str', false), new sys.Param('dis', 'sys::Str', false), new sys.Param('literal', 'sys::Bool', true)]), {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('fromStr', 40966, 'haystack::HaystackToken?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('static$init', 165890, 'sys::Void', xp, {});
Filter.type$.am$('has', 40962, 'haystack::Filter', sys.List.make(sys.Param.type$, [new sys.Param('path', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('missing', 40962, 'haystack::Filter', sys.List.make(sys.Param.type$, [new sys.Param('path', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('eq', 40962, 'haystack::Filter', sys.List.make(sys.Param.type$, [new sys.Param('path', 'sys::Obj', false), new sys.Param('val', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('ne', 40962, 'haystack::Filter', sys.List.make(sys.Param.type$, [new sys.Param('path', 'sys::Obj', false), new sys.Param('val', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('lt', 40962, 'haystack::Filter', sys.List.make(sys.Param.type$, [new sys.Param('path', 'sys::Obj', false), new sys.Param('val', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('le', 40962, 'haystack::Filter', sys.List.make(sys.Param.type$, [new sys.Param('path', 'sys::Obj', false), new sys.Param('val', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('gt', 40962, 'haystack::Filter', sys.List.make(sys.Param.type$, [new sys.Param('path', 'sys::Obj', false), new sys.Param('val', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('ge', 40962, 'haystack::Filter', sys.List.make(sys.Param.type$, [new sys.Param('path', 'sys::Obj', false), new sys.Param('val', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('and', 8192, 'haystack::Filter', sys.List.make(sys.Param.type$, [new sys.Param('that', 'haystack::Filter', false)]), { 'sys::NoDoc': "" }).am$('or', 8192, 'haystack::Filter', sys.List.make(sys.Param.type$, [new sys.Param('that', 'haystack::Filter', false)]), { 'sys::NoDoc': "" }).am$('isSpec', 40962, 'haystack::Filter', sys.List.make(sys.Param.type$, [new sys.Param('spec', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('isSymbol', 40962, 'haystack::Filter', sys.List.make(sys.Param.type$, [new sys.Param('symbol', 'haystack::Symbol', false)]), { 'sys::NoDoc': "" }).am$('logic', 34818, 'haystack::Filter', sys.List.make(sys.Param.type$, [new sys.Param('a', 'haystack::Filter', false), new sys.Param('op', 'haystack::FilterType', false), new sys.Param('b', 'haystack::Filter', false), new sys.Param('f', '|haystack::Filter,haystack::Filter->haystack::Filter|', false)]), {}).am$('logicFind', 34818, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('parts', 'haystack::Filter[]', false), new sys.Param('op', 'haystack::FilterType', false), new sys.Param('x', 'haystack::Filter', false)]), {}).am$('search', 40962, 'haystack::Filter', sys.List.make(sys.Param.type$, [new sys.Param('pattern', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('searchFromOpts', 40962, 'haystack::Filter?', sys.List.make(sys.Param.type$, [new sys.Param('opts', 'haystack::Dict?', false)]), { 'sys::NoDoc': "" }).am$('fromStr', 40966, 'haystack::Filter?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('include', 8192, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('r', 'haystack::Dict', false), new sys.Param('pather', '|haystack::Ref->haystack::Dict?|?', false)]), { 'sys::Deprecated': "sys::Deprecated{msg=\"Use matches\";}" }).am$('matches', 8192, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('r', 'haystack::Dict', false), new sys.Param('cx', 'haystack::HaystackContext?', true)]), {}).am$('doMatches', 262273, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('r', 'haystack::Dict', false), new sys.Param('cx', 'haystack::HaystackContext', false)]), { 'sys::NoDoc': "" }).am$('pattern', 270337, 'sys::Str', xp, { 'sys::NoDoc': "" }).am$('eachTag', 270337, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Str->sys::Void|', false)]), { 'sys::NoDoc': "" }).am$('eachVal', 270337, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj?,haystack::FilterPath->sys::Void|', false)]), { 'sys::NoDoc': "" }).am$('type', 270337, 'haystack::FilterType', xp, { 'sys::NoDoc': "" }).am$('argA', 270336, 'sys::Obj?', xp, { 'sys::NoDoc': "" }).am$('argB', 270336, 'sys::Obj?', xp, { 'sys::NoDoc': "" }).am$('isCompound', 270336, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('equals', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj?', false)]), {}).am$('hash', 271360, 'sys::Int', xp, {}).am$('compare', 271360, 'sys::Int', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('toStr', 271361, 'sys::Str', xp, {}).am$('make', 139268, 'sys::Void', xp, {});
FilterType.type$.af$('has', 106506, 'haystack::FilterType', {}).af$('missing', 106506, 'haystack::FilterType', {}).af$('eq', 106506, 'haystack::FilterType', {}).af$('ne', 106506, 'haystack::FilterType', {}).af$('gt', 106506, 'haystack::FilterType', {}).af$('ge', 106506, 'haystack::FilterType', {}).af$('lt', 106506, 'haystack::FilterType', {}).af$('le', 106506, 'haystack::FilterType', {}).af$('and', 106506, 'haystack::FilterType', {}).af$('or', 106506, 'haystack::FilterType', {}).af$('isSymbol', 106506, 'haystack::FilterType', {}).af$('isSpec', 106506, 'haystack::FilterType', {}).af$('search', 106506, 'haystack::FilterType', {}).af$('vals', 106498, 'haystack::FilterType[]', {}).am$('make', 133124, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('$ordinal', 'sys::Int', false), new sys.Param('$name', 'sys::Str', false)]), {}).am$('fromStr', 40966, 'haystack::FilterType?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('static$init', 165890, 'sys::Void', xp, {});
SimpleFilter.type$.af$('path', 73730, 'haystack::FilterPath', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('p', 'haystack::FilterPath', false)]), {}).am$('eachTag', 9216, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Str->sys::Void|', false)]), {}).am$('eachVal', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj?,haystack::FilterPath->sys::Void|', false)]), {}).am$('argA', 9216, 'sys::Obj?', xp, {}).am$('doMatches', 9216, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('r', 'haystack::Dict', false), new sys.Param('cx', 'haystack::HaystackContext', false)]), {}).am$('matchesAt', 2048, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false), new sys.Param('level', 'sys::Int', false), new sys.Param('cx', 'haystack::HaystackContext', false)]), {}).am$('doMatchesVal', 270337, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {});
FilterHas.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('p', 'haystack::FilterPath', false)]), {}).am$('doMatchesVal', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('v', 'sys::Obj?', false)]), {}).am$('pattern', 271360, 'sys::Str', xp, {}).am$('type', 271360, 'haystack::FilterType', xp, {}).am$('toStr', 271360, 'sys::Str', xp, {});
FilterMissing.type$.af$('toStr', 336898, 'sys::Str', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('p', 'haystack::FilterPath', false)]), {}).am$('doMatchesVal', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('v', 'sys::Obj?', false)]), {}).am$('pattern', 271360, 'sys::Str', xp, {}).am$('type', 271360, 'haystack::FilterType', xp, {});
FilterEq.type$.af$('toStr', 336898, 'sys::Str', {}).af$('val', 67586, 'sys::Obj', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('p', 'haystack::FilterPath', false), new sys.Param('v', 'sys::Obj', false)]), {}).am$('doMatchesVal', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('v', 'sys::Obj?', false)]), {}).am$('eachVal', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj?,haystack::FilterPath->sys::Void|', false)]), {}).am$('pattern', 271360, 'sys::Str', xp, {}).am$('type', 271360, 'haystack::FilterType', xp, {}).am$('argB', 271360, 'sys::Obj?', xp, {});
FilterNe.type$.af$('toStr', 336898, 'sys::Str', {}).af$('val', 67586, 'sys::Obj', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('p', 'haystack::FilterPath', false), new sys.Param('v', 'sys::Obj', false)]), {}).am$('doMatchesVal', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('v', 'sys::Obj?', false)]), {}).am$('eachVal', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj?,haystack::FilterPath->sys::Void|', false)]), {}).am$('pattern', 271360, 'sys::Str', xp, {}).am$('type', 271360, 'haystack::FilterType', xp, {}).am$('argB', 271360, 'sys::Obj?', xp, {});
FilterCmp.type$.af$('toStr', 336898, 'sys::Str', {}).af$('val', 73730, 'sys::Obj', {}).af$('valType', 73730, 'sys::Type', {}).af$('isNumber', 73730, 'sys::Bool', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('p', 'haystack::FilterPath', false), new sys.Param('v', 'sys::Obj', false)]), {}).am$('doMatchesVal', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('v', 'sys::Obj?', false)]), {}).am$('eachVal', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj?,haystack::FilterPath->sys::Void|', false)]), {}).am$('pattern', 271360, 'sys::Str', xp, {}).am$('op', 270337, 'sys::Str', xp, {}).am$('cmp', 270337, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('x', 'sys::Obj', false), new sys.Param('val', 'sys::Obj', false)]), {}).am$('cmpNumber', 8192, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('a', 'haystack::Number', false), new sys.Param('b', 'haystack::Number', false)]), {}).am$('argB', 9216, 'sys::Obj?', xp, {});
FilterLt.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('p', 'haystack::FilterPath', false), new sys.Param('v', 'sys::Obj', false)]), {}).am$('op', 271360, 'sys::Str', xp, {}).am$('cmp', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('x', 'sys::Obj', false), new sys.Param('val', 'sys::Obj', false)]), {}).am$('type', 271360, 'haystack::FilterType', xp, {});
FilterLe.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('p', 'haystack::FilterPath', false), new sys.Param('v', 'sys::Obj', false)]), {}).am$('op', 271360, 'sys::Str', xp, {}).am$('cmp', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('x', 'sys::Obj', false), new sys.Param('val', 'sys::Obj', false)]), {}).am$('type', 271360, 'haystack::FilterType', xp, {});
FilterGt.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('p', 'haystack::FilterPath', false), new sys.Param('v', 'sys::Obj', false)]), {}).am$('op', 271360, 'sys::Str', xp, {}).am$('cmp', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('x', 'sys::Obj', false), new sys.Param('val', 'sys::Obj', false)]), {}).am$('type', 271360, 'haystack::FilterType', xp, {});
FilterGe.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('p', 'haystack::FilterPath', false), new sys.Param('v', 'sys::Obj', false)]), {}).am$('op', 271360, 'sys::Str', xp, {}).am$('cmp', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('x', 'sys::Obj', false), new sys.Param('val', 'sys::Obj', false)]), {}).am$('type', 271360, 'haystack::FilterType', xp, {});
FilterAnd.type$.af$('toStr', 336898, 'sys::Str', {}).af$('a', 67586, 'haystack::Filter', {}).af$('b', 67586, 'haystack::Filter', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('a', 'haystack::Filter', false), new sys.Param('b', 'haystack::Filter', false)]), {}).am$('doMatches', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('r', 'haystack::Dict', false), new sys.Param('cx', 'haystack::HaystackContext', false)]), {}).am$('eachVal', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj?,haystack::FilterPath->sys::Void|', false)]), {}).am$('eachTag', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Str->sys::Void|', false)]), {}).am$('pattern', 271360, 'sys::Str', xp, {}).am$('type', 271360, 'haystack::FilterType', xp, {}).am$('argA', 271360, 'sys::Obj?', xp, {}).am$('argB', 271360, 'sys::Obj?', xp, {}).am$('isCompound', 271360, 'sys::Bool', xp, {});
FilterOr.type$.af$('toStr', 336898, 'sys::Str', {}).af$('a', 67586, 'haystack::Filter', {}).af$('b', 67586, 'haystack::Filter', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('a', 'haystack::Filter', false), new sys.Param('b', 'haystack::Filter', false)]), {}).am$('doMatches', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('r', 'haystack::Dict', false), new sys.Param('cx', 'haystack::HaystackContext', false)]), {}).am$('pattern', 271360, 'sys::Str', xp, {}).am$('eachVal', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj?,haystack::FilterPath->sys::Void|', false)]), {}).am$('eachTag', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Str->sys::Void|', false)]), {}).am$('type', 271360, 'haystack::FilterType', xp, {}).am$('argA', 271360, 'sys::Obj?', xp, {}).am$('argB', 271360, 'sys::Obj?', xp, {}).am$('isCompound', 271360, 'sys::Bool', xp, {});
FilterIsSymbol.type$.af$('toStr', 336898, 'sys::Str', {}).af$('symbol', 67586, 'haystack::Symbol', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('symbol', 'haystack::Symbol', false)]), {}).am$('doMatches', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('r', 'haystack::Dict', false), new sys.Param('cx', 'haystack::HaystackContext', false)]), {}).am$('pattern', 271360, 'sys::Str', xp, {}).am$('eachVal', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj?,haystack::FilterPath->sys::Void|', false)]), {}).am$('eachTag', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Str->sys::Void|', false)]), {}).am$('type', 271360, 'haystack::FilterType', xp, {}).am$('argA', 271360, 'sys::Obj?', xp, {});
FilterIsSpec.type$.af$('spec', 67586, 'sys::Str', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('spec', 'sys::Str', false)]), {}).am$('doMatches', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('r', 'haystack::Dict', false), new sys.Param('cx', 'haystack::HaystackContext', false)]), {}).am$('pattern', 271360, 'sys::Str', xp, {}).am$('eachVal', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj?,haystack::FilterPath->sys::Void|', false)]), {}).am$('eachTag', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Str->sys::Void|', false)]), {}).am$('type', 271360, 'haystack::FilterType', xp, {}).am$('argA', 271360, 'sys::Obj?', xp, {}).am$('toStr', 271360, 'sys::Str', xp, {});
FilterPath.type$.am$('fromObj', 40962, 'haystack::FilterPath', sys.List.make(sys.Param.type$, [new sys.Param('obj', 'sys::Obj', false)]), {}).am$('fromStr', 40966, 'haystack::FilterPath?', sys.List.make(sys.Param.type$, [new sys.Param('path', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('makeName', 40962, 'haystack::FilterPath', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('makeNames', 40962, 'haystack::FilterPath', sys.List.make(sys.Param.type$, [new sys.Param('names', 'sys::Str[]', false)]), {}).am$('size', 270337, 'sys::Int', xp, {}).am$('get', 270337, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('i', 'sys::Int', false)]), { 'sys::Operator': "" }).am$('hash', 271360, 'sys::Int', xp, {}).am$('equals', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj?', false)]), {}).am$('contains', 270337, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('toStr', 271361, 'sys::Str', xp, {}).am$('make', 139268, 'sys::Void', xp, {});
FilterPath1.type$.af$('name', 73730, 'sys::Str', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('size', 271360, 'sys::Int', xp, {}).am$('get', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('i', 'sys::Int', false)]), {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('contains', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {});
FilterPathN.type$.af$('toStr', 336898, 'sys::Str', {}).af$('names', 73730, 'sys::Str[]', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str[]', false)]), {}).am$('size', 271360, 'sys::Int', xp, {}).am$('get', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('i', 'sys::Int', false)]), {}).am$('contains', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {});
FilterInference.type$.af$('nilRef', 100354, 'haystack::NilFilterInference', {}).am$('nil', 40962, 'haystack::FilterInference', xp, { 'sys::NoDoc': "" }).am$('isA', 270337, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('rec', 'haystack::Dict', false), new sys.Param('symbol', 'haystack::Symbol', false)]), { 'sys::NoDoc': "" }).am$('static$init', 165890, 'sys::Void', xp, {});
NilFilterInference.type$.am$('isA', 9216, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('rec', 'haystack::Dict', false), new sys.Param('symbol', 'haystack::Symbol', false)]), {}).am$('make', 139268, 'sys::Void', xp, {});
FilterParser.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('parse', 8192, 'haystack::Filter', xp, {}).am$('condOr', 2048, 'haystack::Filter', xp, {}).am$('condAnd', 2048, 'haystack::Filter', xp, {}).am$('term', 2048, 'haystack::Filter', xp, {}).am$('path', 2048, 'haystack::FilterPath', xp, {}).am$('pathName', 2048, 'sys::Str', xp, {}).am$('val', 2048, 'sys::Obj?', xp, {}).am$('specQName', 2048, 'sys::Str', xp, {}).am$('consumeId', 2048, 'sys::Str', xp, {});
SearchFilter.type$.af$('pattern', 336898, 'sys::Str', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('pattern', 'sys::Str', false)]), {}).am$('doMatches', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('r', 'haystack::Dict', false), new sys.Param('cx', 'haystack::HaystackContext', false)]), {}).am$('checkTag', 2048, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('r', 'haystack::Dict', false), new sys.Param('name', 'sys::Str', false)]), {}).am$('includeVal', 270336, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('dis', 'sys::Str', false)]), {}).am$('eachTag', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Str->sys::Void|', false)]), {}).am$('eachVal', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj?,haystack::FilterPath->sys::Void|', false)]), {}).am$('type', 271360, 'haystack::FilterType', xp, {}).am$('toStr', 271360, 'sys::Str', xp, {});
GlobSearchFilter.type$.af$('regex', 73730, 'sys::Regex', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('pattern', 'sys::Str', false)]), {}).am$('includeVal', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {});
RegexSearchFilter.type$.af$('regex', 73730, 'sys::Regex', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('pattern', 'sys::Str', false)]), {}).am$('includeVal', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {});
FilterSearchFilter.type$.af$('filter', 73730, 'haystack::Filter', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('pattern', 'sys::Str', false)]), {}).am$('doMatches', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('r', 'haystack::Dict', false), new sys.Param('cx', 'haystack::HaystackContext', false)]), {});
NumberFormat.type$.af$('predefined', 100354, '[sys::Str:haystack::NumberFormat]', {}).af$('empty', 100354, 'haystack::NumberFormat', {}).af$('srcPattern', 67586, 'sys::Str?', {}).af$('floatPattern', 67586, 'sys::Str?', {}).af$('isBytes', 67586, 'sys::Bool', {}).af$('posPrefix', 67586, 'sys::Str', {}).af$('posSuffix', 67586, 'sys::Str', {}).af$('negPrefix', 67586, 'sys::Str', {}).af$('negSuffix', 67586, 'sys::Str', {}).am$('make', 40966, 'haystack::NumberFormat?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str?', false)]), {}).am$('makeEmpty', 2052, 'sys::Void', xp, {}).am$('makePattern', 2052, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('srcPattern', 'sys::Str', false)]), {}).am$('toFloatPattern', 34818, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('toPrefix', 34818, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('toSuffix', 34818, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('isPatternChar', 34818, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('ch', 'sys::Int', false)]), {}).am$('format', 8192, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('num', 'haystack::Number', false)]), {}).am$('formatSpecial', 2048, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('f', 'sys::Float', false)]), {}).am$('isDuration', 2048, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('num', 'haystack::Number', false)]), {}).am$('formatDuration', 2048, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('dur', 'sys::Duration', false)]), {}).am$('add', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('buf', 'sys::StrBuf', false), new sys.Param('pattern', 'sys::Str', false), new sys.Param('unit', 'sys::Unit?', false)]), {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('static$init', 165890, 'sys::Void', xp, {});
Col.type$.am$('name', 270337, 'sys::Str', xp, {}).am$('meta', 270337, 'haystack::Dict', xp, {}).am$('dis', 8192, 'sys::Str', xp, {}).am$('equals', 9216, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj?', false)]), {}).am$('compare', 9216, 'sys::Int', sys.List.make(sys.Param.type$, [new sys.Param('x', 'sys::Obj', false)]), {}).am$('toStr', 9216, 'sys::Str', xp, {}).am$('make', 139268, 'sys::Void', xp, {});
Namespace.type$.am$('ts', 270337, 'sys::DateTime', xp, { 'sys::NoDoc': "" }).am$('tsKey', 270337, 'sys::Str', xp, { 'sys::NoDoc': "" }).am$('xeto', 270337, 'xeto::LibNamespace', xp, { 'sys::NoDoc': "" }).am$('def', 270337, 'haystack::Def?', sys.List.make(sys.Param.type$, [new sys.Param('symbol', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('defs', 270337, 'haystack::Def[]', xp, { 'sys::NoDoc': "" }).am$('eachDef', 270337, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Def->sys::Void|', false)]), { 'sys::NoDoc': "" }).am$('eachWhileDef', 270337, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Def->sys::Obj?|', false)]), { 'sys::NoDoc': "" }).am$('findDefs', 270337, 'haystack::Def[]', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Def->sys::Bool|', false)]), { 'sys::NoDoc': "" }).am$('hasDefs', 270337, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Def->sys::Bool|', false)]), { 'sys::NoDoc': "" }).am$('features', 270337, 'haystack::Feature[]', xp, { 'sys::NoDoc': "" }).am$('feature', 270337, 'haystack::Feature?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), { 'sys::NoDoc': "" }).am$('isFeature', 270337, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('def', 'haystack::Def', false)]), { 'sys::NoDoc': "" }).am$('libsList', 270337, 'haystack::Lib[]', xp, { 'sys::NoDoc': "" }).am$('lib', 270337, 'haystack::Lib?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), { 'sys::NoDoc': "" }).am$('filetypes', 270337, 'haystack::Filetype[]', xp, { 'sys::NoDoc': "" }).am$('filetype', 270337, 'haystack::Filetype?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), { 'sys::NoDoc': "" }).am$('fits', 270337, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('def', 'haystack::Def', false), new sys.Param('base', 'haystack::Def', false)]), { 'sys::NoDoc': "" }).am$('fitsMarker', 270337, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('def', 'haystack::Def', false)]), { 'sys::NoDoc': "" }).am$('fitsVal', 270337, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('def', 'haystack::Def', false)]), { 'sys::NoDoc': "" }).am$('fitsChoice', 270337, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('def', 'haystack::Def', false)]), { 'sys::NoDoc': "" }).am$('fitsEntity', 270337, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('def', 'haystack::Def', false)]), { 'sys::NoDoc': "" }).am$('defToKind', 270337, 'haystack::Kind', sys.List.make(sys.Param.type$, [new sys.Param('def', 'haystack::Def', false)]), { 'sys::NoDoc': "" }).am$('declared', 270337, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('def', 'haystack::Def', false), new sys.Param('name', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('supertypes', 270337, 'haystack::Def[]', sys.List.make(sys.Param.type$, [new sys.Param('def', 'haystack::Def', false)]), { 'sys::NoDoc': "" }).am$('subtypes', 270337, 'haystack::Def[]', sys.List.make(sys.Param.type$, [new sys.Param('def', 'haystack::Def', false)]), { 'sys::NoDoc': "" }).am$('hasSubtypes', 270337, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('def', 'haystack::Def', false)]), { 'sys::NoDoc': "" }).am$('inheritance', 270337, 'haystack::Def[]', sys.List.make(sys.Param.type$, [new sys.Param('def', 'haystack::Def', false)]), { 'sys::NoDoc': "" }).am$('inheritanceDepth', 270337, 'sys::Int', sys.List.make(sys.Param.type$, [new sys.Param('def', 'haystack::Def', false)]), { 'sys::NoDoc': "" }).am$('associations', 270337, 'haystack::Def[]', sys.List.make(sys.Param.type$, [new sys.Param('parent', 'haystack::Def', false), new sys.Param('association', 'haystack::Def', false)]), { 'sys::NoDoc': "" }).am$('tags', 270337, 'haystack::Def[]', sys.List.make(sys.Param.type$, [new sys.Param('parent', 'haystack::Def', false)]), { 'sys::NoDoc': "" }).am$('kindDef', 270337, 'haystack::Def?', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false), new sys.Param('checked', 'sys::Bool', true)]), { 'sys::NoDoc': "" }).am$('implement', 270337, 'haystack::Def[]', sys.List.make(sys.Param.type$, [new sys.Param('def', 'haystack::Def', false)]), { 'sys::NoDoc': "" }).am$('reflect', 270337, 'haystack::Reflection', sys.List.make(sys.Param.type$, [new sys.Param('subject', 'haystack::Dict', false)]), { 'sys::NoDoc': "" }).am$('proto', 270337, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('parent', 'haystack::Dict', false), new sys.Param('proto', 'haystack::Dict', false)]), { 'sys::NoDoc': "" }).am$('protos', 270337, 'haystack::Dict[]', sys.List.make(sys.Param.type$, [new sys.Param('parent', 'haystack::Dict', false)]), { 'sys::NoDoc': "" }).am$('misc', 270337, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), { 'sys::NoDoc': "" }).am$('eachMisc', 270337, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), { 'sys::NoDoc': "" }).am$('toGrid', 270337, 'haystack::Grid', xp, { 'sys::NoDoc': "" }).am$('symbolToUri', 270337, 'sys::Uri', sys.List.make(sys.Param.type$, [new sys.Param('symbol', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('dump', 270337, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('out', 'sys::OutStream', true)]), { 'sys::NoDoc': "" });
Remove.type$.af$('val', 106498, 'haystack::Remove', {}).am$('make', 2052, 'sys::Void', xp, {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('static$init', 165890, 'sys::Void', xp, {});
HisItem.type$.af$('ts', 73730, 'sys::DateTime', {}).af$('val', 73730, 'sys::Obj?', {}).af$('magic', 100354, 'sys::Int', {}).af$('version', 100354, 'sys::Int', {}).af$('ctrlTs8', 100354, 'sys::Int', {}).af$('ctrlTs4Prev', 100354, 'sys::Int', {}).af$('ctrlPrev', 100354, 'sys::Int', {}).af$('ctrlFalse', 100354, 'sys::Int', {}).af$('ctrlTrue', 100354, 'sys::Int', {}).af$('ctrlNA', 100354, 'sys::Int', {}).af$('ctrlF8', 100354, 'sys::Int', {}).af$('ctrlStr', 100354, 'sys::Int', {}).af$('ctrlStrPrev', 100354, 'sys::Int', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('ts', 'sys::DateTime', false), new sys.Param('val', 'sys::Obj?', false)]), {}).am$('equals', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj?', false)]), {}).am$('hash', 271360, 'sys::Int', xp, {}).am$('compare', 271360, 'sys::Int', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj', false)]), {}).am$('isEmpty', 271360, 'sys::Bool', xp, {}).am$('get', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('def', 'sys::Obj?', true)]), { 'sys::Operator': "" }).am$('has', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('missing', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('trap', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('args', 'sys::Obj?[]?', true)]), {}).am$('each', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), {}).am$('eachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj?|', false)]), {}).am$('map', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj|', false)]), {}).am$('mapVal', 8192, 'haystack::HisItem', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj?->sys::Obj?|', false)]), { 'sys::NoDoc': "" }).am$('encode', 40962, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('out', 'sys::OutStream', false), new sys.Param('items', 'haystack::HisItem[]', false)]), { 'sys::NoDoc': "" }).am$('decode', 40962, 'haystack::HisItem[]', sys.List.make(sys.Param.type$, [new sys.Param('in', 'sys::InStream', false), new sys.Param('tz', 'sys::TimeZone', false), new sys.Param('unit', 'sys::Unit?', true)]), { 'sys::NoDoc': "" }).am$('static$init', 165890, 'sys::Void', xp, {});
ZincWriter.type$.af$('ver', 73728, 'sys::Int', { 'sys::NoDoc': "" }).af$('out', 67584, 'sys::OutStream', {}).am$('gridToStr', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid', false)]), {}).am$('valToStr', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {}).am$('tagsToStr', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('tags', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('out', 'sys::OutStream', false)]), {}).am$('writeVal', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {}).am$('writeGrid', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid', false)]), {}).am$('writeGrids', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('grids', 'haystack::Grid[]', false)]), { 'sys::NoDoc': "" }).am$('flush', 8192, 'sys::This', xp, {}).am$('close', 8192, 'sys::This', xp, {}).am$('writeCol', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('col', 'haystack::Col', false)]), {}).am$('writeRow', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('row', 'haystack::Row', false)]), {}).am$('writeMeta', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('leadingSpace', 'sys::Bool', false), new sys.Param('m', 'haystack::Dict', false)]), {}).am$('writeNestedGrid', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid', false)]), {}).am$('writeList', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('list', 'sys::Obj?[]', false)]), {}).am$('writeDict', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('dict', 'haystack::Dict', false)]), {}).am$('writeScalar', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {});
JsonWriter.type$.af$('out', 73728, 'util::JsonOutStream', { 'sys::NoDoc': "" }).af$('opts', 73728, 'haystack::Dict', {}).am$('valToStr', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('out', 'sys::OutStream', false), new sys.Param('opts', 'haystack::Dict?', true)]), {}).am$('flush', 8192, 'sys::This', xp, {}).am$('close', 8192, 'sys::Bool', xp, {}).am$('writeVal', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {}).am$('writeGrid', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid', false)]), {});
HaysonWriter.type$.af$('out', 67584, 'util::JsonOutStream', {}).af$('gmt', 98434, 'sys::TimeZone', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('out', 'util::JsonOutStream', false)]), {}).am$('writeVal', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {}).am$('writeGrid', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid', false)]), {}).am$('writeDict', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('dict', 'haystack::Dict', false)]), {}).am$('writeList', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('list', 'sys::Obj?[]', false)]), {}).am$('writeDictTags', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('dict', 'haystack::Dict', false), new sys.Param('first', 'sys::Bool', false)]), {}).am$('writeScalar', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {}).am$('writeNumber', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('val', 'haystack::Number', false)]), {}).am$('writeRef', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('ref', 'haystack::Ref', false)]), {}).am$('writeDate', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('date', 'sys::Date', false)]), {}).am$('writeTime', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('time', 'sys::Time', false)]), {}).am$('writeDateTime', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('ts', 'sys::DateTime', false)]), {}).am$('writeUri', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('uri', 'sys::Uri', false)]), {}).am$('writeSymbol', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('s', 'haystack::Symbol', false)]), {}).am$('writeCoord', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('c', 'haystack::Coord', false)]), {}).am$('writeXStr', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('x', 'haystack::XStr', false)]), {}).am$('writeKind', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('kind', 'sys::Str', false), new sys.Param('attrs', 'sys::Map', false)]), {}).am$('static$init', 165890, 'sys::Void', xp, {});
JsonV3Writer.type$.af$('out', 67584, 'util::JsonOutStream', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('out', 'util::JsonOutStream', false)]), {}).am$('writeVal', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {}).am$('writeGrid', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid', false)]), {}).am$('writeDict', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('dict', 'haystack::Dict', false)]), {}).am$('writeList', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('list', 'sys::Obj?[]', false)]), {}).am$('writeDictTags', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('dict', 'haystack::Dict', false), new sys.Param('first', 'sys::Bool', false)]), {}).am$('writeScalar', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {});
Def.type$.am$('symbol', 270337, 'haystack::Symbol', xp, {}).am$('name', 270337, 'sys::Str', xp, {}).am$('lib', 270337, 'haystack::Lib', xp, { 'sys::NoDoc': "" });
Lib.type$.am$('index', 270337, 'sys::Int', xp, { 'sys::NoDoc': "" }).am$('baseUri', 270337, 'sys::Uri', xp, { 'sys::NoDoc': "" }).am$('version', 270337, 'sys::Version', xp, { 'sys::NoDoc': "" }).am$('depends', 270337, 'haystack::Symbol[]', xp, { 'sys::NoDoc': "" });
UnknownNameErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str?', false), new sys.Param('cause', 'sys::Err?', true)]), {});
UnknownDefErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
UnknownSpecErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
UnknownFeatureErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
UnknownFiletypeErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
UnknownLibErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
UnknownRecErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str?', false), new sys.Param('cause', 'sys::Err?', true)]), {});
UnknownKindErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
UnknownTagErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
UnknownFuncErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
UnknownCompErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
UnknownCellErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
NotHaystackErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
UnitErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str?', false), new sys.Param('cause', 'sys::Err?', true)]), {});
DependErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str?', false), new sys.Param('cause', 'sys::Err?', true)]), {});
CallErr.type$.af$('meta', 73730, 'haystack::Dict', {}).af$('remoteTrace', 73730, 'sys::Str?', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('errGrid', 'haystack::Grid', false)]), { 'sys::NoDoc': "" }).am$('makeMeta', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('meta', 'haystack::Dict', false)]), { 'sys::NoDoc': "" });
DisabledErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str?', false), new sys.Param('cause', 'sys::Err?', true)]), {});
FaultErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
DownErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
CoerceErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
PermissionErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
ValidateErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('cause', 'sys::Err?', true)]), {});
InvalidNameErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', true), new sys.Param('cause', 'sys::Err?', true)]), {});
InvalidChangeErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', true), new sys.Param('cause', 'sys::Err?', true)]), {});
DuplicateNameErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', true), new sys.Param('cause', 'sys::Err?', true)]), {});
AlreadyParentedErr.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', true), new sys.Param('cause', 'sys::Err?', true)]), {});
GridReader.type$.am$('readGrid', 270337, 'haystack::Grid', xp, {});
Row.type$.am$('grid', 270337, 'haystack::Grid', xp, {}).am$('val', 270337, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('col', 'haystack::Col', false)]), {}).am$('dis', 271360, 'sys::Str?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str?', true), new sys.Param('def', 'sys::Str?', true)]), {}).am$('isEmpty', 271360, 'sys::Bool', xp, {}).am$('get', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('def', 'sys::Obj?', true)]), { 'sys::Operator': "" }).am$('trap', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('args', 'sys::Obj?[]?', true)]), {}).am$('has', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('missing', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('each', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), {}).am$('eachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj?|', false)]), {}).am$('cells', 270336, 'sys::Obj?[]?', xp, { 'sys::NoDoc': "" }).am$('make', 139268, 'sys::Void', xp, {});
Macro.type$.af$('norm', 106498, 'sys::Int', {}).af$('exprSimple', 106498, 'sys::Int', {}).af$('exprBraces', 106498, 'sys::Int', {}).af$('exprLocale', 106498, 'sys::Int', {}).af$('simpleEndChars', 106498, 'sys::Bool[]', {}).af$('pattern', 73730, 'sys::Str', {}).af$('scope', 73730, 'haystack::Dict', {}).af$('mode', 73728, 'sys::Int', {}).af$('resBuf', 73728, 'sys::StrBuf', {}).af$('exprBuf', 73728, 'sys::StrBuf', {}).af$('varNames', 73728, 'sys::Str[]?', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('pattern', 'sys::Str', false), new sys.Param('scope', 'haystack::Dict', true)]), {}).am$('vars', 8192, 'sys::Str[]', xp, {}).am$('apply', 8192, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('resolve', '|sys::Str->sys::Str|?', true)]), {}).am$('eval', 2048, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('expr', 'sys::Str', false), new sys.Param('resolve', '|sys::Str->sys::Str|?', false)]), {}).am$('isEndOfExpr', 2048, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('ch', 'sys::Int', false)]), {}).am$('refToDis', 270336, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('ref', 'haystack::Ref', false)]), {}).am$('static$init', 165890, 'sys::Void', xp, {});
Client.type$.af$('uri', 73730, 'sys::Uri', {}).af$('debugCounter', 106498, 'concurrent::AtomicInt', { 'sys::NoDoc': "" }).af$('log', 73730, 'sys::Log', { 'sys::NoDoc': "" }).af$('auth', 73728, 'haystack::HaystackClientAuth', { 'sys::NoDoc': "" }).am$('open', 40962, 'haystack::Client', sys.List.make(sys.Param.type$, [new sys.Param('uri', 'sys::Uri', false), new sys.Param('username', 'sys::Str', false), new sys.Param('password', 'sys::Str', false), new sys.Param('opts', '[sys::Str:sys::Obj]?', true)]), {}).am$('make', 2052, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('uri', 'sys::Uri', false), new sys.Param('log', 'sys::Log', false), new sys.Param('auth', 'haystack::HaystackClientAuth', false)]), {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('close', 8192, 'sys::Void', xp, {}).am$('about', 8192, 'haystack::Dict', xp, {}).am$('readById', 8192, 'haystack::Dict?', sys.List.make(sys.Param.type$, [new sys.Param('id', 'sys::Obj', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('readByIds', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('ids', 'sys::Obj[]', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('read', 8192, 'haystack::Dict?', sys.List.make(sys.Param.type$, [new sys.Param('filter', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('readAll', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('filter', 'sys::Str', false)]), {}).am$('eval', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('expr', 'sys::Str', false)]), {}).am$('evalAll', 8192, 'haystack::Grid[]', sys.List.make(sys.Param.type$, [new sys.Param('req', 'sys::Obj', false), new sys.Param('checked', 'sys::Bool', true)]), { 'sys::Deprecated': "", 'sys::NoDoc': "" }).am$('commit', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('req', 'haystack::Grid', false)]), {}).am$('call', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('op', 'sys::Str', false), new sys.Param('req', 'haystack::Grid?', true), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('doCall', 2048, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('op', 'sys::Str', false), new sys.Param('req', 'sys::Str', false)]), {}).am$('toWebClient', 8192, 'web::WebClient', sys.List.make(sys.Param.type$, [new sys.Param('path', 'sys::Uri', false)]), { 'sys::NoDoc': "" }).am$('debugReq', 40962, 'sys::Int', sys.List.make(sys.Param.type$, [new sys.Param('log', 'sys::Log?', false), new sys.Param('c', 'web::WebClient', false), new sys.Param('req', 'sys::Str?', false)]), { 'sys::NoDoc': "" }).am$('debugRes', 40962, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('log', 'sys::Log?', false), new sys.Param('count', 'sys::Int', false), new sys.Param('c', 'web::WebClient', false), new sys.Param('res', 'sys::Str?', false)]), { 'sys::NoDoc': "" }).am$('gridToStr', 2048, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid', false)]), {}).am$('main', 40962, 'sys::Int', sys.List.make(sys.Param.type$, [new sys.Param('args', 'sys::Str[]', false)]), { 'sys::NoDoc': "" }).am$('static$init', 165890, 'sys::Void', xp, {});
HaystackClientAuth.type$.am$('prepare', 270337, 'web::WebClient', sys.List.make(sys.Param.type$, [new sys.Param('client', 'web::WebClient', false)]), {});
Define.type$.am$('decode', 270337, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Str,sys::Obj->sys::Void|', false)]), { 'sys::NoDoc': "" });
Marker.type$.af$('val', 106498, 'haystack::Marker', {}).am$('fromStr', 40966, 'haystack::Marker?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('make', 2052, 'sys::Void', xp, {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('toLocale', 8192, 'sys::Str', xp, { 'sys::NoDoc': "" }).am$('fromBool', 40962, 'haystack::Marker?', sys.List.make(sys.Param.type$, [new sys.Param('b', 'sys::Bool', false)]), {}).am$('static$init', 165890, 'sys::Void', xp, {});
ObjRange.type$.af$('start', 73730, 'sys::Obj?', {}).af$('end', 73730, 'sys::Obj?', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('start', 'sys::Obj?', false), new sys.Param('end', 'sys::Obj?', false)]), {}).am$('hash', 271360, 'sys::Int', xp, {}).am$('equals', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj?', false)]), {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('contains', 8192, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {}).am$('fromIntRange', 40962, 'haystack::ObjRange', sys.List.make(sys.Param.type$, [new sys.Param('r', 'sys::Range', false)]), {}).am$('toIntRange', 8192, 'sys::Range', xp, {});
JsonReader.type$.af$('in', 67584, 'util::JsonInStream', {}).af$('opts', 73728, 'haystack::Dict', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('in', 'sys::InStream', false), new sys.Param('opts', 'haystack::Dict?', true)]), {}).am$('readVal', 8192, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('close', 'sys::Bool', true)]), {}).am$('readGrid', 271360, 'haystack::Grid', xp, {});
JsonParser.type$.af$('opts', 73728, 'haystack::Dict', {}).am$('isV3', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('opts', 'haystack::Dict', false)]), {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('opts', 'haystack::Dict', false)]), {}).am$('notHaystack', 8192, 'sys::Bool', xp, {}).am$('safeNames', 8192, 'sys::Bool', xp, {}).am$('safeVals', 8192, 'sys::Bool', xp, {});
HaysonParser.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('opts', 'haystack::Dict', false)]), {}).am$('parseVal', 8192, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('json', 'sys::Obj?', false)]), {}).am$('parseMap', 2048, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('json', '[sys::Str:sys::Obj?]', false)]), {}).am$('parseGrid', 2048, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('json', '[sys::Str:sys::Obj?]', false)]), {}).am$('parseGridMeta', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('gb', 'haystack::GridBuilder', false), new sys.Param('json', '[sys::Str:sys::Obj?]', false)]), {}).am$('parseGridCols', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('gb', 'haystack::GridBuilder', false), new sys.Param('json', '[sys::Str:sys::Obj?]', false)]), {}).am$('parseGridRows', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('gb', 'haystack::GridBuilder', false), new sys.Param('json', '[sys::Str:sys::Obj?]', false)]), {}).am$('parseDict', 2048, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('json', '[sys::Str:sys::Obj?]', false)]), {}).am$('parseList', 2048, 'sys::List', sys.List.make(sys.Param.type$, [new sys.Param('json', 'sys::Obj?[]', false)]), {}).am$('parseNumber', 2048, 'haystack::Number', sys.List.make(sys.Param.type$, [new sys.Param('json', '[sys::Str:sys::Obj?]', false)]), {}).am$('parseDateTime', 2048, 'sys::DateTime', sys.List.make(sys.Param.type$, [new sys.Param('json', '[sys::Str:sys::Obj?]', false)]), {});
JsonV3Parser.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('opts', 'haystack::Dict', false)]), {}).am$('parseVal', 8192, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('json', 'sys::Obj?', false)]), {}).am$('parseMap', 2048, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('json', '[sys::Str:sys::Obj?]', false)]), {}).am$('parseGrid', 2048, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('json', '[sys::Str:sys::Obj?]', false)]), {}).am$('parseGridMeta', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('gb', 'haystack::GridBuilder', false), new sys.Param('json', '[sys::Str:sys::Obj?]', false)]), {}).am$('parseGridCols', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('gb', 'haystack::GridBuilder', false), new sys.Param('json', '[sys::Str:sys::Obj?]', false)]), {}).am$('parseGridRows', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('gb', 'haystack::GridBuilder', false), new sys.Param('json', '[sys::Str:sys::Obj?]', false)]), {}).am$('parseDict', 2048, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('json', '[sys::Str:sys::Obj?]', false)]), {}).am$('parseList', 2048, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('json', 'sys::Obj?[]', false)]), {}).am$('parseStr', 2048, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('parseSingleton', 2048, 'sys::Obj', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false), new sys.Param('val', 'sys::Obj', false)]), {}).am$('parseNumber', 2048, 'haystack::Number', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('parseFloat', 2048, 'sys::Float', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('parseTime', 2048, 'sys::Time', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('parseDateTime', 34818, 'sys::DateTime', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('parseRef', 2048, 'haystack::Ref', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {});
ZincReader.type$.af$('tokenizer', 67584, 'haystack::HaystackTokenizer', {}).af$('isTop', 67584, 'sys::Bool', {}).af$('ver', 67584, 'sys::Int', {}).af$('cur', 67584, 'haystack::HaystackToken', {}).af$('curVal', 67584, 'sys::Obj?', {}).af$('curLine', 67584, 'sys::Int', {}).af$('peek', 67584, 'haystack::HaystackToken', {}).af$('peekVal', 67584, 'sys::Obj?', {}).af$('peekLine', 67584, 'sys::Int', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('in', 'sys::InStream', false)]), {}).am$('makeTokenizer', 132, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('tokenizer', 'haystack::HaystackTokenizer', false)]), { 'sys::NoDoc': "" }).am$('close', 8192, 'sys::Bool', xp, {}).am$('readVal', 8192, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('close', 'sys::Bool', true)]), {}).am$('readGrid', 271360, 'haystack::Grid', xp, {}).am$('readGrids', 8192, 'haystack::Grid[]', xp, { 'sys::NoDoc': "" }).am$('readTags', 8192, 'haystack::Dict', xp, { 'sys::NoDoc': "" }).am$('parseVal', 2048, 'sys::Obj?', xp, {}).am$('parseLiteral', 2048, 'sys::Obj?', xp, {}).am$('parseCoord', 2048, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('id', 'sys::Str', false)]), {}).am$('parseXStr', 2048, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('id', 'sys::Str', false)]), {}).am$('parseBinObsolete', 2048, 'haystack::Bin', xp, {}).am$('parseList', 2048, 'sys::Obj?', xp, {}).am$('parseDict', 2048, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('allowComma', 'sys::Bool', false)]), {}).am$('parseGrid', 2048, 'sys::Obj?', xp, {}).am$('checkVersion', 2048, 'sys::Int', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('consumeTagName', 2048, 'sys::Str', xp, {}).am$('consumeNum', 2048, 'haystack::Number', xp, {}).am$('consumeStr', 2048, 'sys::Str', xp, {}).am$('verify', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('expected', 'haystack::HaystackToken', false)]), {}).am$('curToStr', 2048, 'sys::Str', xp, {}).am$('consume', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('expected', 'haystack::HaystackToken?', true)]), {}).am$('err', 2048, 'sys::ParseErr', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false)]), {});
TrioReader.type$.af$('recLineNum', 73728, 'sys::Int', { 'sys::NoDoc': "" }).af$('srcLineNum', 73728, 'sys::Int', { 'sys::NoDoc': "" }).af$('factory', 73728, 'haystack::HaystackFactory', { 'sys::NoDoc': "" }).af$('in', 67584, 'sys::InStream', {}).af$('lineNum', 67584, 'sys::Int', {}).af$('pushback', 67584, 'sys::Str?', {}).af$('name', 67584, 'sys::Str?', {}).af$('val', 67584, 'sys::Obj?', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('in', 'sys::InStream', false)]), {}).am$('readGrid', 271360, 'haystack::Grid', xp, {}).am$('readAllDicts', 8192, 'haystack::Dict[]', xp, {}).am$('eachDict', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Dict->sys::Void|', false)]), {}).am$('readDict', 8192, 'haystack::Dict?', sys.List.make(sys.Param.type$, [new sys.Param('checked', 'sys::Bool', true)]), {}).am$('readAllRecs', 8192, 'haystack::Dict[]', xp, { 'sys::NoDoc': "", 'sys::Deprecated': "sys::Deprecated{msg=\"Use readAllDicts\";}" }).am$('readRec', 8192, 'haystack::Dict?', xp, { 'sys::NoDoc': "", 'sys::Deprecated': "sys::Deprecated{msg=\"Use readDict\";}" }).am$('eachRec', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Dict->sys::Void|', false)]), { 'sys::NoDoc': "", 'sys::Deprecated': "sys::Deprecated{msg=\"Use eachDict\";}" }).am$('readTag', 2048, 'sys::Int', xp, {}).am$('parseScalar', 2048, 'sys::Obj', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('readAsZinc', 2048, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('readAsTrio', 2048, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('readIndentedText', 2048, 'sys::Str', xp, {}).am$('readIndentedList', 2048, 'sys::Obj', xp, {}).am$('readLine', 2048, 'sys::Str?', xp, {}).am$('err', 2048, 'sys::ParseErr', sys.List.make(sys.Param.type$, [new sys.Param('msg', 'sys::Str', false), new sys.Param('lineNum', 'sys::Int', true), new sys.Param('cause', 'sys::Err?', true)]), {});
Ref.type$.af$('idRef', 67586, 'sys::Str', {}).af$('disVal', 8192, 'sys::Str?', { 'sys::NoDoc': "" }).af$('disValRef', 67586, 'concurrent::AtomicRef', {}).af$('segs', 73730, 'haystack::RefSeg[]', { 'sys::NoDoc': "" }).af$('idChars', 100354, 'sys::Bool[]', {}).af$('nullRef', 106498, 'haystack::Ref', {}).af$('defVal', 106498, 'haystack::Ref', {}).am$('fromStr', 40966, 'haystack::Ref?', sys.List.make(sys.Param.type$, [new sys.Param('id', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('make', 40966, 'haystack::Ref?', sys.List.make(sys.Param.type$, [new sys.Param('id', 'sys::Str', false), new sys.Param('dis', 'sys::Str?', false)]), {}).am$('makeWithDis', 40966, 'haystack::Ref?', sys.List.make(sys.Param.type$, [new sys.Param('ref', 'haystack::Ref', false), new sys.Param('dis', 'sys::Str?', true)]), {}).am$('gen', 40962, 'haystack::Ref', xp, {}).am$('makeHandle', 40966, 'haystack::Ref?', sys.List.make(sys.Param.type$, [new sys.Param('handle', 'sys::Int', false)]), { 'sys::NoDoc': "" }).am$('handleToStr', 34818, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('time', 'sys::Int', false), new sys.Param('rand', 'sys::Int', false)]), {}).am$('makeImpl', 4100, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('id', 'sys::Str', false), new sys.Param('dis', 'sys::Str?', false)]), { 'sys::NoDoc': "" }).am$('makeSegs', 2052, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('id', 'sys::Str', false), new sys.Param('dis', 'sys::Str?', false), new sys.Param('segs', 'haystack::RefSeg[]', false)]), { 'sys::NoDoc': "" }).am$('id', 271360, 'sys::Str', xp, {}).am$('handle', 8192, 'sys::Int', xp, { 'sys::NoDoc': "" }).am$('hash', 271360, 'sys::Int', xp, {}).am$('equals', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj?', false)]), {}).am$('dis', 271360, 'sys::Str', xp, {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('toCode', 8192, 'sys::Str', xp, {}).am$('fromCode', 40962, 'haystack::Ref', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('toCodeList', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('refs', 'haystack::Ref[]', false)]), { 'sys::NoDoc': "" }).am$('listToStr', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('ids', 'haystack::Ref[]', false)]), { 'sys::NoDoc': "" }).am$('listFromStr', 40962, 'haystack::Ref[]', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('noDis', 8192, 'haystack::Ref', xp, { 'sys::NoDoc': "" }).am$('isNull', 8192, 'sys::Bool', xp, {}).am$('isIdErr', 32898, 'sys::Str?', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('isId', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('toId', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('isIdChar', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('char', 'sys::Int', false)]), {}).am$('toZinc', 8192, 'sys::Str', xp, { 'sys::NoDoc': "" }).am$('toJson', 8192, 'sys::Str', xp, { 'sys::NoDoc': "" }).am$('isRel', 8192, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('toRel', 8192, 'haystack::Ref', sys.List.make(sys.Param.type$, [new sys.Param('prefix', 'sys::Str?', false)]), { 'sys::NoDoc': "" }).am$('toAbs', 8192, 'haystack::Ref', sys.List.make(sys.Param.type$, [new sys.Param('prefix', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('isProjRec', 8192, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('toProjRel', 8192, 'haystack::Ref', xp, { 'sys::NoDoc': "" }).am$('main', 40962, 'sys::Void', xp, { 'sys::NoDoc': "" }).am$('static$init', 165890, 'sys::Void', xp, {});
RefDir.type$.af$('na', 106506, 'haystack::RefDir', {}).af$('from', 106506, 'haystack::RefDir', {}).af$('to', 106506, 'haystack::RefDir', {}).af$('vals', 106498, 'haystack::RefDir[]', {}).af$('code', 73730, 'sys::Str', {}).af$('symbol', 73730, 'sys::Str', {}).am$('make', 2052, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('$ordinal', 'sys::Int', false), new sys.Param('$name', 'sys::Str', false), new sys.Param('code', 'sys::Str', false), new sys.Param('symbol', 'sys::Str', false)]), {}).am$('fromStr', 40966, 'haystack::RefDir?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('static$init', 165890, 'sys::Void', xp, {});
RefSeg.type$.af$('scheme', 73730, 'sys::Str', {}).af$('body', 73730, 'sys::Str', {}).am$('parse', 32898, 'haystack::RefSeg[]', sys.List.make(sys.Param.type$, [new sys.Param('id', 'sys::Str', false)]), {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('scheme', 'sys::Str', false), new sys.Param('body', 'sys::Str', false)]), {}).am$('hash', 271360, 'sys::Int', xp, {}).am$('equals', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj?', false)]), {}).am$('toStr', 271360, 'sys::Str', xp, {});
RefSchemes.type$.af$('proj', 106498, 'sys::Str', {}).af$('host', 106498, 'sys::Str', {}).af$('user', 106498, 'sys::Str', {}).af$('rec', 106498, 'sys::Str', {}).af$('node', 106498, 'sys::Str', {}).af$('lic', 106498, 'sys::Str', {}).af$('replica', 106498, 'sys::Str', {}).af$('subnet', 106498, 'sys::Str', {}).am$('make', 139268, 'sys::Void', xp, {}).am$('static$init', 165890, 'sys::Void', xp, {});
GridBuilder.type$.af$('capacity', 8192, 'sys::Int', { 'sys::NoDoc': "" }).af$('gridRef', 67584, 'concurrent::AtomicRef', {}).af$('meta', 67584, 'haystack::Dict', {}).af$('cols', 67584, 'haystack::GbCol[]', {}).af$('colsByName', 67584, '[sys::Str:haystack::GbCol]?', {}).af$('rows', 67584, 'haystack::GbRow[]', {}).af$('copyGrid', 67584, 'haystack::GbGrid?', {}).am$('setMeta', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('meta', 'sys::Obj?', false)]), {}).am$('numCols', 8192, 'sys::Int', xp, {}).am$('numRows', 8192, 'sys::Int', xp, {}).am$('hasCol', 8192, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('colNameToIndex', 8192, 'sys::Int', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('addCol', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('meta', 'sys::Obj?', true)]), {}).am$('addColNames', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('names', 'sys::Str[]', false)]), {}).am$('addRow', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('cells', 'sys::Obj?[]', false)]), {}).am$('addRow1', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('cell', 'sys::Obj?', false)]), { 'sys::NoDoc': "" }).am$('addRow2', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('a', 'sys::Obj?', false), new sys.Param('b', 'sys::Obj?', false)]), { 'sys::NoDoc': "" }).am$('addRow3', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('a', 'sys::Obj?', false), new sys.Param('b', 'sys::Obj?', false), new sys.Param('c', 'sys::Obj?', false)]), { 'sys::NoDoc': "" }).am$('addRow4', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('a', 'sys::Obj?', false), new sys.Param('b', 'sys::Obj?', false), new sys.Param('c', 'sys::Obj?', false), new sys.Param('d', 'sys::Obj?', false)]), { 'sys::NoDoc': "" }).am$('addDictRows', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('rows', 'haystack::Dict?[]', false)]), {}).am$('addGridRows', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid', false)]), {}).am$('addDictRow', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('row', 'haystack::Dict?', false)]), {}).am$('addGridsAsZincRows', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('grids', 'haystack::Grid?[]', false)]), { 'sys::NoDoc': "" }).am$('addHisItemRows', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('pts', 'haystack::HisItem[][]', false)]), { 'sys::NoDoc': "" }).am$('copyMetaAndCols', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('src', 'haystack::Grid', false)]), { 'sys::NoDoc': "" }).am$('copyCols', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('src', 'haystack::Grid', false)]), { 'sys::NoDoc': "" }).am$('sortCol', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('colName', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('sortrCol', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('colName', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('sortDis', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('colName', 'sys::Str', true)]), { 'sys::NoDoc': "" }).am$('cellToDis', 34818, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('row', 'haystack::GbRow', false), new sys.Param('col', 'haystack::GbCol', false)]), {}).am$('reverseRows', 8192, 'sys::This', xp, { 'sys::NoDoc': "" }).am$('toGrid', 8192, 'haystack::Grid', xp, {}).am$('finishCols', 2048, 'sys::Void', xp, {}).am$('setColMeta', 128, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('colName', 'sys::Str', false), new sys.Param('meta', 'haystack::Dict', false)]), {}).am$('normColNames', 40962, 'sys::Str[]', sys.List.make(sys.Param.type$, [new sys.Param('colNames', 'sys::Str[]', false)]), { 'sys::NoDoc': "" }).am$('make', 139268, 'sys::Void', xp, {});
Grid.type$.am$('cols', 270337, 'haystack::Col[]', xp, {}).am$('col', 270337, 'haystack::Col?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('colNames', 8192, 'sys::Str[]', xp, {}).am$('colDisNames', 8192, 'sys::Str[]', xp, {}).am$('has', 8192, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('missing', 8192, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('each', 270337, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Row,sys::Int->sys::Void|', false)]), {}).am$('eachWhile', 270337, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Row,sys::Int->sys::Obj?|', false)]), {}).am$('isEmpty', 8192, 'sys::Bool', xp, {}).am$('isErr', 8192, 'sys::Bool', xp, {}).am$('isIncomplete', 8192, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('incomplete', 8192, 'haystack::Dict?', sys.List.make(sys.Param.type$, [new sys.Param('checked', 'sys::Bool', true)]), { 'sys::NoDoc': "" }).am$('isHisGrid', 8192, 'sys::Bool', xp, {}).am$('size', 270337, 'sys::Int', xp, {}).am$('first', 270337, 'haystack::Row?', xp, {}).am$('last', 270336, 'haystack::Row?', xp, {}).am$('get', 270337, 'haystack::Row', sys.List.make(sys.Param.type$, [new sys.Param('index', 'sys::Int', false)]), { 'sys::Operator': "" }).am$('getSafe', 270337, 'haystack::Row?', sys.List.make(sys.Param.type$, [new sys.Param('index', 'sys::Int', false)]), {}).am$('meta', 270337, 'haystack::Dict', xp, {}).am$('toConst', 270336, 'haystack::Grid', xp, { 'sys::NoDoc': "" }).am$('any', 8192, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Row,sys::Int->sys::Bool|', false)]), {}).am$('all', 8192, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Row,sys::Int->sys::Bool|', false)]), {}).am$('sort', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Row,haystack::Row->sys::Int|', false)]), {}).am$('sortr', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Row,haystack::Row->sys::Int|', false)]), {}).am$('sortCol', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('col', 'sys::Obj', false)]), {}).am$('sortColr', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('col', 'sys::Obj', false)]), {}).am$('sortDis', 8192, 'haystack::Grid', xp, {}).am$('ids', 8192, 'haystack::Ref[]', xp, { 'sys::NoDoc': "" }).am$('colToList', 8192, 'sys::Obj?[]', sys.List.make(sys.Param.type$, [new sys.Param('col', 'sys::Obj', false), new sys.Param('listOf', 'sys::Type', true)]), {}).am$('find', 8192, 'haystack::Row?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Row,sys::Int->sys::Bool|', false)]), {}).am$('findIndex', 8192, 'sys::Int?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Row,sys::Int->sys::Bool|', false)]), {}).am$('findAll', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Row,sys::Int->sys::Bool|', false)]), {}).am$('filter', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('filter', 'haystack::Filter', false), new sys.Param('cx', 'haystack::HaystackContext?', true)]), {}).am$('getRange', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('r', 'sys::Range', false)]), { 'sys::Operator': "" }).am$('map', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Row,sys::Int->sys::Obj?|', false)]), {}).am$('flatMap', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Row,sys::Int->sys::Obj?|', false)]), {}).am$('mapToList', 8192, 'sys::Obj?[]', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Row,sys::Int->sys::Obj?|', false)]), {}).am$('replace', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('from', 'sys::Obj?', false), new sys.Param('to', 'sys::Obj?', false)]), {}).am$('commit', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('diffs', 'haystack::Grid', false)]), {}).am$('join', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('that', 'haystack::Grid', false), new sys.Param('joinCol', 'sys::Obj', false)]), {}).am$('setMeta', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('meta', 'sys::Obj?', false)]), {}).am$('addMeta', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('meta', 'sys::Obj?', false)]), {}).am$('addCol', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('meta', 'sys::Obj?', false), new sys.Param('f', '|haystack::Row,sys::Int->sys::Obj?|', false)]), {}).am$('addCols', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('x', 'haystack::Grid', false)]), {}).am$('renameCol', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('oldCol', 'sys::Obj', false), new sys.Param('newName', 'sys::Str', false)]), {}).am$('renameCols', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('oldToNew', '[sys::Obj:sys::Str]', false)]), {}).am$('reorderCols', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('cols', 'sys::Obj[]', false)]), {}).am$('setColMeta', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('col', 'sys::Obj', false), new sys.Param('meta', 'sys::Obj?', false)]), {}).am$('addColMeta', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('col', 'sys::Obj', false), new sys.Param('meta', 'sys::Obj?', false)]), {}).am$('removeCol', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('col', 'sys::Obj', false)]), {}).am$('keepCols', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('toKeep', 'sys::Obj[]', false)]), {}).am$('removeCols', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('toRemove', 'sys::Obj[]', false)]), {}).am$('colsToLocale', 8192, 'haystack::Grid', xp, {}).am$('unique', 8192, 'haystack::Grid', sys.List.make(sys.Param.type$, [new sys.Param('keyCols', 'sys::Obj[]', false)]), {}).am$('transpose', 270336, 'haystack::Grid', xp, { 'sys::NoDoc': "" }).am$('toCols', 128, 'haystack::Col[]', sys.List.make(sys.Param.type$, [new sys.Param('cols', 'sys::Obj[]', false)]), {}).am$('toCol', 128, 'haystack::Col?', sys.List.make(sys.Param.type$, [new sys.Param('c', 'sys::Obj', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('toRows', 270337, 'haystack::Row[]', xp, { 'sys::NoDoc': "" }).am$('dump', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('out', 'sys::OutStream', true), new sys.Param('opts', '[sys::Str:sys::Obj]?', true)]), { 'sys::NoDoc': "" }).am$('dumpMeta', 34818, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('out', 'sys::OutStream', false), new sys.Param('title', 'sys::Str', false), new sys.Param('meta', 'haystack::Dict', false)]), {}).am$('dumpAddCol', 34818, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('g', 'haystack::Grid', false), new sys.Param('c', 'haystack::Col', false), new sys.Param('lines', 'sys::Str[]', false)]), {}).am$('toDis', 34818, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('r', 'haystack::Row', false), new sys.Param('c', 'haystack::Col', false)]), {});
GbGrid.type$.af$('meta', 336898, 'haystack::Dict', {}).af$('cols', 336898, 'haystack::Col[]', {}).af$('colsByName', 73730, '[sys::Str:haystack::GbCol]', {}).af$('rows', 73730, 'haystack::GbRow[]', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('meta', 'haystack::Dict', false), new sys.Param('cols', 'haystack::GbCol[]', false), new sys.Param('colsByName', '[sys::Str:haystack::GbCol]', false), new sys.Param('rows', 'haystack::GbRow[]', false)]), {}).am$('col', 271360, 'haystack::Col?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('each', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Row,sys::Int->sys::Void|', false)]), {}).am$('eachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Row,sys::Int->sys::Obj?|', false)]), {}).am$('size', 271360, 'sys::Int', xp, {}).am$('get', 271360, 'haystack::Row', sys.List.make(sys.Param.type$, [new sys.Param('index', 'sys::Int', false)]), {}).am$('getSafe', 271360, 'haystack::Row?', sys.List.make(sys.Param.type$, [new sys.Param('index', 'sys::Int', false)]), {}).am$('first', 271360, 'haystack::Row?', xp, {}).am$('toRows', 271360, 'haystack::Row[]', xp, {});
GbCol.type$.af$('index', 73730, 'sys::Int', {}).af$('name', 336898, 'sys::Str', {}).af$('meta', 336898, 'haystack::Dict', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('i', 'sys::Int', false), new sys.Param('n', 'sys::Str', false), new sys.Param('m', 'haystack::Dict', false)]), {});
GbRow.type$.af$('gridRef', 73730, 'concurrent::AtomicRef', {}).af$('cells', 336898, 'sys::Obj?[]?', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('r', 'concurrent::AtomicRef', false), new sys.Param('c', 'sys::Obj?[]', false)]), {}).am$('grid', 271360, 'haystack::Grid', xp, {}).am$('val', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('col', 'haystack::Col', false)]), {});
Filetype.type$.am$('mimeType', 270337, 'sys::MimeType', xp, {}).am$('isText', 8192, 'sys::Bool', xp, {}).am$('hasWriter', 8192, 'sys::Bool', xp, {}).am$('hasReader', 8192, 'sys::Bool', xp, {}).am$('writerType', 8192, 'sys::Type?', xp, {}).am$('readerType', 8192, 'sys::Type?', xp, {}).am$('writer', 8192, 'haystack::GridWriter', sys.List.make(sys.Param.type$, [new sys.Param('out', 'sys::OutStream', false), new sys.Param('opts', 'haystack::Dict?', true)]), {}).am$('reader', 8192, 'haystack::GridReader', sys.List.make(sys.Param.type$, [new sys.Param('in', 'sys::InStream', false), new sys.Param('opts', 'haystack::Dict?', true)]), {}).am$('ioOpts', 8192, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('ns', 'haystack::Namespace', false), new sys.Param('mime', 'sys::MimeType?', false), new sys.Param('arg', 'haystack::Dict', false), new sys.Param('settings', 'haystack::Dict', false)]), {}).am$('fileExt', 8192, 'sys::Str', xp, {}).am$('icon', 8192, 'sys::Str', xp, {}).am$('isView', 8192, 'sys::Bool', xp, {});
Symbol.type$.af$('str', 65666, 'sys::Str', {}).am$('fits', 32898, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('type', 'sys::Type', false)]), {}).am$('fromStr', 40966, 'haystack::Symbol?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('parse', 32902, 'haystack::Symbol?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('substr', 34818, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('str', 'sys::Str', false), new sys.Param('r', 'sys::Range', false)]), {}).am$('isTagChar', 34818, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('c', 'sys::Int', false)]), {}).am$('make', 132, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('str', 'sys::Str', false)]), {}).am$('name', 270337, 'sys::Str', xp, {}).am$('type', 270337, 'haystack::SymbolType', xp, { 'sys::NoDoc': "" }).am$('size', 270337, 'sys::Int', xp, { 'sys::NoDoc': "" }).am$('part', 270337, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('index', 'sys::Int', false)]), { 'sys::NoDoc': "" }).am$('eachPart', 270337, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Str->sys::Void|', false)]), { 'sys::NoDoc': "" }).am$('hasTermName', 270337, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('hasTerm', 270337, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('dict', 'haystack::Dict', false)]), { 'sys::NoDoc': "" }).am$('hash', 271360, 'sys::Int', xp, {}).am$('equals', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj?', false)]), {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('toCode', 8192, 'sys::Str', xp, {}).am$('toList', 40962, 'haystack::Symbol[]', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), { 'sys::NoDoc': "" });
SymbolType.type$.af$('tag', 106506, 'haystack::SymbolType', {}).af$('conjunct', 106506, 'haystack::SymbolType', {}).af$('key', 106506, 'haystack::SymbolType', {}).af$('vals', 106498, 'haystack::SymbolType[]', {}).am$('isTag', 8192, 'sys::Bool', xp, {}).am$('isConjunct', 8192, 'sys::Bool', xp, {}).am$('isTerm', 8192, 'sys::Bool', xp, {}).am$('isKey', 8192, 'sys::Bool', xp, {}).am$('make', 133124, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('$ordinal', 'sys::Int', false), new sys.Param('$name', 'sys::Str', false)]), {}).am$('fromStr', 40966, 'haystack::SymbolType?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('static$init', 165890, 'sys::Void', xp, {});
TagSymbol.type$.am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('str', 'sys::Str', false)]), {}).am$('type', 271360, 'haystack::SymbolType', xp, {}).am$('name', 271360, 'sys::Str', xp, {}).am$('size', 271360, 'sys::Int', xp, {}).am$('part', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('i', 'sys::Int', false)]), {}).am$('eachPart', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Str->sys::Void|', false)]), {}).am$('hasTermName', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('hasTerm', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('dict', 'haystack::Dict', false)]), {});
ConjunctSymbol.type$.af$('parts', 73730, 'sys::Str[]', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('str', 'sys::Str', false), new sys.Param('parts', 'sys::Str[]', false)]), {}).am$('type', 271360, 'haystack::SymbolType', xp, {}).am$('name', 271360, 'sys::Str', xp, {}).am$('size', 271360, 'sys::Int', xp, {}).am$('part', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('i', 'sys::Int', false)]), {}).am$('eachPart', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Str->sys::Void|', false)]), {}).am$('hasTermName', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('hasTerm', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('dict', 'haystack::Dict', false)]), {});
KeySymbol.type$.af$('feature', 73730, 'sys::Str', {}).af$('name', 336898, 'sys::Str', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('str', 'sys::Str', false), new sys.Param('feature', 'sys::Str', false), new sys.Param('name', 'sys::Str', false)]), {}).am$('type', 271360, 'haystack::SymbolType', xp, {}).am$('size', 271360, 'sys::Int', xp, {}).am$('part', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('i', 'sys::Int', false)]), {}).am$('eachPart', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Str->sys::Void|', false)]), {}).am$('hasTermName', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('hasTerm', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('dict', 'haystack::Dict', false)]), {});
NA.type$.af$('val', 106498, 'haystack::NA', {}).am$('fromStr', 40966, 'haystack::NA?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false)]), {}).am$('make', 2052, 'sys::Void', xp, {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('static$init', 165890, 'sys::Void', xp, {});
Feature.type$.am$('name', 270337, 'sys::Str', xp, {}).am$('self', 270337, 'haystack::Def', xp, {}).am$('def', 270337, 'haystack::Def?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('defs', 270337, 'haystack::Def[]', xp, { 'sys::NoDoc': "" }).am$('eachDef', 270337, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Def->sys::Void|', false)]), { 'sys::NoDoc': "" }).am$('findDefs', 270337, 'haystack::Def[]', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::Def->sys::Bool|', false)]), { 'sys::NoDoc': "" }).am$('toGrid', 270337, 'haystack::Grid', xp, { 'sys::NoDoc': "" });
WebOpUtil.type$.af$('mimeZinc', 100354, 'sys::MimeType', {}).am$('ns', 270337, 'haystack::Namespace', xp, {}).am$('toFiletype', 270336, 'haystack::Filetype?', sys.List.make(sys.Param.type$, [new sys.Param('mime', 'sys::MimeType', false)]), {}).am$('ioOpts', 270336, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('filetype', 'haystack::Filetype', false), new sys.Param('mime', 'sys::MimeType', false)]), {}).am$('doReadReq', 8192, 'haystack::Grid?', sys.List.make(sys.Param.type$, [new sys.Param('req', 'web::WebReq', false), new sys.Param('res', 'web::WebRes', false)]), {}).am$('doReadReqGet', 2048, 'haystack::Grid?', sys.List.make(sys.Param.type$, [new sys.Param('req', 'web::WebReq', false), new sys.Param('res', 'web::WebRes', false)]), {}).am$('doReadReqPost', 2048, 'haystack::Grid?', sys.List.make(sys.Param.type$, [new sys.Param('req', 'web::WebReq', false), new sys.Param('res', 'web::WebRes', false)]), {}).am$('doWriteRes', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('req', 'web::WebReq', false), new sys.Param('res', 'web::WebRes', false), new sys.Param('result', 'haystack::Grid', false)]), {}).am$('acceptGzip', 40962, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('req', 'web::WebReq', false)]), {}).am$('acceptMimeType', 2048, 'sys::MimeType?', sys.List.make(sys.Param.type$, [new sys.Param('req', 'web::WebReq', false)]), {}).am$('static$init', 165890, 'sys::Void', xp, {});
TypedDict.type$.af$('metaRef', 67586, 'haystack::Dict', {}).am$('create', 40962, 'haystack::TypedDict', sys.List.make(sys.Param.type$, [new sys.Param('type', 'sys::Type', false), new sys.Param('meta', 'haystack::Dict', false), new sys.Param('onErr', '|sys::Str->sys::Void|?', true)]), {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('meta', 'haystack::Dict', false)]), {}).am$('meta', 8192, 'haystack::Dict', xp, {}).am$('get', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false), new sys.Param('def', 'sys::Obj?', true)]), { 'sys::Operator': "" }).am$('isEmpty', 271360, 'sys::Bool', xp, {}).am$('has', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('missing', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('each', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), {}).am$('eachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj?|', false)]), {}).am$('trap', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false), new sys.Param('a', 'sys::Obj?[]?', true)]), {});
TypedTag.type$.af$('restart', 73730, 'sys::Bool', { 'sys::NoDoc': "" }).af$('meta', 73730, 'sys::Str', {}).am$('decode', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Str,sys::Obj->sys::Void|', false)]), { 'sys::NoDoc': "" }).am$('make', 139268, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::TypedTag->sys::Void|?', true)]), {});
Span.type$.af$('mode', 73730, 'haystack::SpanMode', {}).af$('start', 73730, 'sys::DateTime', {}).af$('end', 73730, 'sys::DateTime', {}).af$('alignsToDates', 73730, 'sys::Bool', { 'sys::NoDoc': "" }).am$('fromStr', 40966, 'haystack::Span?', sys.List.make(sys.Param.type$, [new sys.Param('str', 'sys::Str', false), new sys.Param('tz', 'sys::TimeZone', true), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('parseDateTime', 34818, 'sys::DateTime', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false), new sys.Param('tz', 'sys::TimeZone', false)]), {}).am$('makeAbs', 40966, 'haystack::Span?', sys.List.make(sys.Param.type$, [new sys.Param('start', 'sys::DateTime', false), new sys.Param('end', 'sys::DateTime', false)]), {}).am$('makeDate', 40966, 'haystack::Span?', sys.List.make(sys.Param.type$, [new sys.Param('date', 'sys::Date', false), new sys.Param('tz', 'sys::TimeZone', true)]), {}).am$('makeRel', 40966, 'haystack::Span?', sys.List.make(sys.Param.type$, [new sys.Param('mode', 'haystack::SpanMode', false), new sys.Param('tz', 'sys::TimeZone', true)]), {}).am$('today', 40962, 'haystack::Span', sys.List.make(sys.Param.type$, [new sys.Param('tz', 'sys::TimeZone', true)]), {}).am$('defVal', 40962, 'haystack::Span', xp, { 'sys::NoDoc': "" }).am$('doMakeRel', 40966, 'haystack::Span?', sys.List.make(sys.Param.type$, [new sys.Param('mode', 'haystack::SpanMode', false), new sys.Param('now', 'sys::DateTime', false)]), { 'sys::NoDoc': "" }).am$('toQuarterStart', 34818, 'sys::Date', sys.List.make(sys.Param.type$, [new sys.Param('d', 'sys::Date', false)]), {}).am$('toQuarterEnd', 34818, 'sys::Date', sys.List.make(sys.Param.type$, [new sys.Param('d', 'sys::Date', false)]), {}).am$('makeDates', 2052, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('mode', 'haystack::SpanMode', false), new sys.Param('start', 'sys::Date', false), new sys.Param('end', 'sys::Date', false), new sys.Param('tz', 'sys::TimeZone', false)]), {}).am$('makeDateTimes', 2052, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('mode', 'haystack::SpanMode', false), new sys.Param('start', 'sys::DateTime', false), new sys.Param('end', 'sys::DateTime', false)]), {}).am$('tz', 8192, 'sys::TimeZone', xp, {}).am$('hash', 271360, 'sys::Int', xp, {}).am$('equals', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('obj', 'sys::Obj?', false)]), {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('toLocale', 8192, 'sys::Str', xp, { 'sys::NoDoc': "" }).am$('dis', 8192, 'sys::Str', xp, {}).am$('toTimeZone', 8192, 'haystack::Span', sys.List.make(sys.Param.type$, [new sys.Param('tz', 'sys::TimeZone', false)]), {}).am$('toDateSpan', 8192, 'haystack::DateSpan', xp, {}).am$('eachDay', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('func', '|sys::Date,sys::Int->sys::Void|', false)]), { 'sys::NoDoc': "" }).am$('contains', 8192, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('ts', 'sys::DateTime', false)]), { 'sys::NoDoc': "" }).am$('fresh', 8192, 'sys::This', xp, { 'sys::NoDoc': "" }).am$('toCode', 8192, 'sys::Str', xp, {}).am$('numDays', 8192, 'sys::Int', xp, { 'sys::NoDoc': "" }).am$('quarter', 8192, 'sys::Int', xp, { 'sys::NoDoc': "" }).am$('alignsToDay', 8192, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('alignsToWeek', 8192, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('alignsToMonth', 8192, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('alignsToQuarter', 8192, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('alignsToYear', 8192, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('prev', 8192, 'haystack::Span', xp, { 'sys::NoDoc': "" }).am$('next', 8192, 'haystack::Span', xp, { 'sys::NoDoc': "" });
SpanMode.type$.af$('abs', 106506, 'haystack::SpanMode', {}).af$('today', 106506, 'haystack::SpanMode', {}).af$('yesterday', 106506, 'haystack::SpanMode', {}).af$('thisWeek', 106506, 'haystack::SpanMode', {}).af$('lastWeek', 106506, 'haystack::SpanMode', {}).af$('pastWeek', 106506, 'haystack::SpanMode', {}).af$('thisMonth', 106506, 'haystack::SpanMode', {}).af$('lastMonth', 106506, 'haystack::SpanMode', {}).af$('pastMonth', 106506, 'haystack::SpanMode', {}).af$('thisQuarter', 106506, 'haystack::SpanMode', {}).af$('lastQuarter', 106506, 'haystack::SpanMode', {}).af$('pastQuarter', 106506, 'haystack::SpanMode', {}).af$('thisYear', 106506, 'haystack::SpanMode', {}).af$('lastYear', 106506, 'haystack::SpanMode', {}).af$('pastYear', 106506, 'haystack::SpanMode', {}).af$('vals', 106498, 'haystack::SpanMode[]', {}).am$('isAbs', 8192, 'sys::Bool', xp, {}).am$('isRel', 8192, 'sys::Bool', xp, {}).am$('dis', 8192, 'sys::Str', xp, {}).am$('make', 133124, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('$ordinal', 'sys::Int', false), new sys.Param('$name', 'sys::Str', false)]), {}).am$('fromStr', 40966, 'haystack::SpanMode?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('static$init', 165890, 'sys::Void', xp, {});
Number.type$.af$('defVal', 106498, 'haystack::Number', {}).af$('negOne', 106498, 'haystack::Number', {}).af$('zero', 106498, 'haystack::Number', {}).af$('one', 106498, 'haystack::Number', {}).af$('ten', 106498, 'haystack::Number', {}).af$('nan', 106498, 'haystack::Number', {}).af$('posInf', 106498, 'haystack::Number', {}).af$('negInf', 106498, 'haystack::Number', {}).af$('intCache', 100354, 'haystack::Number[]', {}).af$('F', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('C', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('Fdeg', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('Cdeg', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('FdegDay', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('CdegDay', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('ns', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('us', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('ms', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('sec', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('mins', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('hr', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('day', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('week', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('mo', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('year', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('percent', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('dollar', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('byte', 106498, 'sys::Unit', { 'sys::NoDoc': "" }).af$('float', 67586, 'sys::Float', {}).af$('unitRef', 67586, 'sys::Unit?', {}).am$('fromStr', 40966, 'haystack::Number?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('fromStrStrictUnit', 40962, 'haystack::Number?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), { 'sys::NoDoc': "" }).am$('parse', 34818, 'haystack::Number?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false), new sys.Param('strictUnit', 'sys::Bool', false), new sys.Param('checked', 'sys::Bool', false)]), {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Float', false), new sys.Param('unit', 'sys::Unit?', true)]), {}).am$('makeInt', 40966, 'haystack::Number?', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Int', false), new sys.Param('unit', 'sys::Unit?', true)]), {}).am$('makeNum', 40962, 'haystack::Number', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Num', false), new sys.Param('unit', 'sys::Unit?', true)]), {}).am$('makeDuration', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('dur', 'sys::Duration', false), new sys.Param('unit', 'sys::Unit?', true)]), {}).am$('toFloat', 8192, 'sys::Float', xp, {}).am$('isInt', 8192, 'sys::Bool', xp, {}).am$('toInt', 8192, 'sys::Int', xp, {}).am$('unit', 8192, 'sys::Unit?', xp, {}).am$('isDuration', 8192, 'sys::Bool', xp, {}).am$('toDuration', 8192, 'sys::Duration?', sys.List.make(sys.Param.type$, [new sys.Param('checked', 'sys::Bool', true)]), {}).am$('toDurationMult', 2048, 'sys::Duration?', xp, {}).am$('toBytes', 8192, 'sys::Int?', sys.List.make(sys.Param.type$, [new sys.Param('checked', 'sys::Bool', true)]), { 'sys::NoDoc': "" }).am$('hash', 271360, 'sys::Int', xp, {}).am$('equals', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj?', false)]), {}).am$('compare', 271360, 'sys::Int', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj', false)]), {}).am$('approx', 8192, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('that', 'haystack::Number', false), new sys.Param('tolerance', 'sys::Float?', true)]), {}).am$('isNegative', 8192, 'sys::Bool', xp, {}).am$('isNaN', 8192, 'sys::Bool', xp, {}).am$('isSpecial', 8192, 'sys::Bool', xp, {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('toJson', 128, 'sys::Str', xp, {}).am$('toCode', 8192, 'sys::Str', xp, {}).am$('negate', 8192, 'haystack::Number', xp, { 'sys::Operator': "" }).am$('increment', 8192, 'haystack::Number', xp, { 'sys::Operator': "" }).am$('decrement', 8192, 'haystack::Number', xp, { 'sys::Operator': "" }).am$('plus', 8192, 'haystack::Number', sys.List.make(sys.Param.type$, [new sys.Param('b', 'haystack::Number', false)]), { 'sys::Operator': "" }).am$('plusUnit', 40962, 'sys::Unit?', sys.List.make(sys.Param.type$, [new sys.Param('a', 'sys::Unit?', false), new sys.Param('b', 'sys::Unit?', false)]), { 'sys::NoDoc': "" }).am$('minus', 8192, 'haystack::Number', sys.List.make(sys.Param.type$, [new sys.Param('b', 'haystack::Number', false)]), { 'sys::Operator': "" }).am$('minusUnit', 40962, 'sys::Unit?', sys.List.make(sys.Param.type$, [new sys.Param('a', 'sys::Unit?', false), new sys.Param('b', 'sys::Unit?', false)]), { 'sys::NoDoc': "" }).am$('mult', 8192, 'haystack::Number', sys.List.make(sys.Param.type$, [new sys.Param('b', 'haystack::Number', false)]), { 'sys::Operator': "" }).am$('multUnit', 40962, 'sys::Unit?', sys.List.make(sys.Param.type$, [new sys.Param('a', 'sys::Unit?', false), new sys.Param('b', 'sys::Unit?', false)]), { 'sys::NoDoc': "" }).am$('div', 8192, 'haystack::Number', sys.List.make(sys.Param.type$, [new sys.Param('b', 'haystack::Number', false)]), { 'sys::Operator': "" }).am$('divUnit', 40962, 'sys::Unit?', sys.List.make(sys.Param.type$, [new sys.Param('a', 'sys::Unit?', false), new sys.Param('b', 'sys::Unit?', false)]), { 'sys::NoDoc': "" }).am$('mod', 8192, 'haystack::Number', sys.List.make(sys.Param.type$, [new sys.Param('b', 'haystack::Number', false)]), { 'sys::Operator': "" }).am$('defineUnit', 34818, 'sys::Unit', sys.List.make(sys.Param.type$, [new sys.Param('a', 'sys::Unit', false), new sys.Param('symbol', 'sys::Int', false), new sys.Param('b', 'sys::Unit', false)]), {}).am$('loadUnit', 40962, 'sys::Unit?', sys.List.make(sys.Param.type$, [new sys.Param('str', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), { 'sys::NoDoc': "" }).am$('abs', 8192, 'haystack::Number', xp, {}).am$('min', 8192, 'haystack::Number', sys.List.make(sys.Param.type$, [new sys.Param('that', 'haystack::Number', false)]), {}).am$('max', 8192, 'haystack::Number', sys.List.make(sys.Param.type$, [new sys.Param('that', 'haystack::Number', false)]), {}).am$('clamp', 8192, 'haystack::Number', sys.List.make(sys.Param.type$, [new sys.Param('min', 'haystack::Number', false), new sys.Param('max', 'haystack::Number', false)]), {}).am$('upper', 8192, 'haystack::Number', xp, {}).am$('lower', 8192, 'haystack::Number', xp, {}).am$('toLocale', 8192, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('pattern', 'sys::Str?', true)]), {}).am$('constUnit', 34818, 'sys::Unit', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('static$init', 165890, 'sys::Void', xp, {});
BrioCtrl.type$.af$('ctrlNull', 106498, 'sys::Int', {}).af$('ctrlMarker', 106498, 'sys::Int', {}).af$('ctrlNA', 106498, 'sys::Int', {}).af$('ctrlRemove', 106498, 'sys::Int', {}).af$('ctrlFalse', 106498, 'sys::Int', {}).af$('ctrlTrue', 106498, 'sys::Int', {}).af$('ctrlNumberI2', 106498, 'sys::Int', {}).af$('ctrlNumberI4', 106498, 'sys::Int', {}).af$('ctrlNumberF8', 106498, 'sys::Int', {}).af$('ctrlStr', 106498, 'sys::Int', {}).af$('ctrlRefStr', 106498, 'sys::Int', {}).af$('ctrlRefI8', 106498, 'sys::Int', {}).af$('ctrlUri', 106498, 'sys::Int', {}).af$('ctrlDate', 106498, 'sys::Int', {}).af$('ctrlTime', 106498, 'sys::Int', {}).af$('ctrlDateTimeI4', 106498, 'sys::Int', {}).af$('ctrlDateTimeI8', 106498, 'sys::Int', {}).af$('ctrlCoord', 106498, 'sys::Int', {}).af$('ctrlXStr', 106498, 'sys::Int', {}).af$('ctrlBuf', 106498, 'sys::Int', {}).af$('ctrlDictEmpty', 106498, 'sys::Int', {}).af$('ctrlDict', 106498, 'sys::Int', {}).af$('ctrlListEmpty', 106498, 'sys::Int', {}).af$('ctrlList', 106498, 'sys::Int', {}).af$('ctrlGrid', 106498, 'sys::Int', {}).af$('ctrlSymbol', 106498, 'sys::Int', {}).af$('ctrlDateTimeF8', 106498, 'sys::Int', {}).am$('static$init', 165890, 'sys::Void', xp, {});
BrioWriter.type$.af$('js', 106498, 'sys::Bool', { 'sys::NoDoc': "" }).af$('encodeRefToRel', 73728, 'sys::Str?', { 'sys::NoDoc': "" }).af$('encodeRefDis', 73728, 'sys::Bool', { 'sys::NoDoc': "" }).af$('maxStrCode', 73728, 'sys::Int', { 'sys::NoDoc': "" }).af$('encodeUnknownAsStr', 73728, 'sys::Bool', { 'sys::NoDoc': "" }).af$('cp', 67586, 'haystack::BrioConsts', {}).af$('out', 67584, 'sys::OutStream', {}).am$('valToBuf', 40962, 'sys::Buf', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('out', 'sys::OutStream', false)]), {}).am$('close', 8192, 'sys::Bool', xp, {}).am$('writeVal', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false)]), {}).am$('writeNull', 2048, 'sys::This', xp, {}).am$('writeMarker', 2048, 'sys::This', xp, {}).am$('writeNA', 2048, 'sys::This', xp, {}).am$('writeRemove', 2048, 'sys::This', xp, {}).am$('writeBool', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Bool', false)]), {}).am$('writeNumber', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'haystack::Number', false)]), {}).am$('writeStr', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Str', false)]), {}).am$('writeUri', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Uri', false)]), {}).am$('writeRef', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'haystack::Ref', false)]), {}).am$('writeRefId', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'haystack::Ref', false)]), {}).am$('refToI8', 2048, 'sys::Int', sys.List.make(sys.Param.type$, [new sys.Param('val', 'haystack::Ref', false)]), {}).am$('writeRefDis', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'haystack::Ref', false)]), {}).am$('writeSymbol', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'haystack::Symbol', false)]), {}).am$('writeDate', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Date', false)]), {}).am$('writeTime', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Time', false)]), {}).am$('writeDateTime', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::DateTime', false)]), {}).am$('writeCoord', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'haystack::Coord', false)]), {}).am$('writeXStr', 2048, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('val', 'haystack::XStr', false)]), {}).am$('writeBuf', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('buf', 'sys::Buf', false)]), {}).am$('writeDict', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('dict', 'haystack::Dict', false)]), {}).am$('writeList', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('list', 'sys::Obj?[]', false)]), {}).am$('writeGrid', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid', false)]), {}).am$('writePreEncoded', 8192, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('x', 'haystack::BrioPreEncoded', false)]), {}).am$('encodeStr', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Str', false)]), {}).am$('encodeStrChars', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Str', false)]), {}).am$('encodeVarInt', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Int', false)]), {}).am$('static$init', 165890, 'sys::Void', xp, {});
DateSpan.type$.af$('start', 73730, 'sys::Date', {}).af$('end', 73730, 'sys::Date', {}).af$('period', 73730, 'sys::Str', {}).af$('numDays', 73730, 'sys::Int', {}).af$('factories', 100354, '[sys::Str:sys::Str]', {}).af$('day', 106498, 'sys::Str', {}).af$('week', 106498, 'sys::Str', {}).af$('month', 106498, 'sys::Str', {}).af$('quarter', 106498, 'sys::Str', {}).af$('year', 106498, 'sys::Str', {}).af$('range', 106498, 'sys::Str', {}).am$('makeWeek', 40962, 'haystack::DateSpan', sys.List.make(sys.Param.type$, [new sys.Param('start', 'sys::Date', false)]), {}).am$('makeMonth', 40962, 'haystack::DateSpan', sys.List.make(sys.Param.type$, [new sys.Param('year', 'sys::Int', false), new sys.Param('month', 'sys::Month', false)]), {}).am$('makeYear', 40962, 'haystack::DateSpan', sys.List.make(sys.Param.type$, [new sys.Param('year', 'sys::Int', false)]), {}).am$('today', 40962, 'haystack::DateSpan', xp, {}).am$('yesterday', 40962, 'haystack::DateSpan', xp, {}).am$('thisWeek', 40962, 'haystack::DateSpan', xp, {}).am$('thisMonth', 40962, 'haystack::DateSpan', xp, {}).am$('thisQuarter', 40962, 'haystack::DateSpan', xp, {}).am$('thisYear', 40962, 'haystack::DateSpan', xp, {}).am$('pastWeek', 40962, 'haystack::DateSpan', xp, {}).am$('pastMonth', 40962, 'haystack::DateSpan', xp, {}).am$('pastYear', 40962, 'haystack::DateSpan', xp, {}).am$('lastWeek', 40962, 'haystack::DateSpan', xp, {}).am$('lastMonth', 40962, 'haystack::DateSpan', xp, {}).am$('lastQuarter', 40962, 'haystack::DateSpan', xp, {}).am$('lastYear', 40962, 'haystack::DateSpan', xp, {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('start', 'sys::Date', true), new sys.Param('endOrPer', 'sys::Obj', true)]), {}).am$('toQuarterStart', 34818, 'sys::Date', sys.List.make(sys.Param.type$, [new sys.Param('y', 'sys::Int', false), new sys.Param('m', 'sys::Month', false)]), {}).am$('toQuarterEnd', 34818, 'sys::Date', sys.List.make(sys.Param.type$, [new sys.Param('y', 'sys::Int', false), new sys.Param('m', 'sys::Month', false)]), {}).am$('toQuarterNumDays', 34818, 'sys::Int', sys.List.make(sys.Param.type$, [new sys.Param('y', 'sys::Int', false), new sys.Param('m', 'sys::Month', false)]), {}).am$('hash', 271360, 'sys::Int', xp, {}).am$('equals', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('obj', 'sys::Obj?', false)]), {}).am$('toSpan', 8192, 'haystack::Span', sys.List.make(sys.Param.type$, [new sys.Param('tz', 'sys::TimeZone', false)]), {}).am$('contains', 8192, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Date?', false)]), {}).am$('plus', 8192, 'haystack::DateSpan', sys.List.make(sys.Param.type$, [new sys.Param('d', 'sys::Duration', false)]), { 'sys::Operator': "" }).am$('minus', 8192, 'haystack::DateSpan', sys.List.make(sys.Param.type$, [new sys.Param('d', 'sys::Duration', false)]), { 'sys::Operator': "" }).am$('toDateList', 8192, 'sys::Date[]', xp, { 'sys::NoDoc': "" }).am$('eachDay', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('func', '|sys::Date,sys::Int->sys::Void|', false)]), {}).am$('eachMonth', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|haystack::DateSpan->sys::Void|', false)]), {}).am$('prev', 8192, 'haystack::DateSpan', xp, {}).am$('next', 8192, 'haystack::DateSpan', xp, {}).am$('toLocale', 8192, 'sys::Str', xp, { 'sys::NoDoc': "" }).am$('dis', 8192, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('explicit', 'sys::Bool', true)]), {}).am$('toCode', 8192, 'sys::Str', xp, {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('fromStr', 40966, 'haystack::DateSpan?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('isDay', 8192, 'sys::Bool', xp, {}).am$('isWeek', 8192, 'sys::Bool', xp, {}).am$('isMonth', 8192, 'sys::Bool', xp, {}).am$('isQuarter', 8192, 'sys::Bool', xp, {}).am$('isYear', 8192, 'sys::Bool', xp, {}).am$('isRange', 8192, 'sys::Bool', xp, {}).am$('static$init', 165890, 'sys::Void', xp, {});
Kind.type$.af$('obj', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('bin', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('bool', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('coord', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('date', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('dateTime', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('dict', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('grid', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('list', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('marker', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('na', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('number', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('ref', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('remove', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('span', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('str', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('symbol', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('time', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('uri', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('xstr', 106498, 'haystack::Kind', { 'sys::NoDoc': "" }).af$('listing', 106498, 'haystack::Kind[]', { 'sys::NoDoc': "" }).af$('fromStrMap', 100354, '[sys::Str:haystack::Kind]', {}).af$('fromDefMap', 100354, '[sys::Str:haystack::Kind]', {}).af$('name', 73730, 'sys::Str', {}).af$('type', 73730, 'sys::Type', {}).af$('defSymbol', 73730, 'haystack::Symbol', { 'sys::NoDoc': "" }).af$('signature', 73730, 'sys::Str', { 'sys::NoDoc': "" }).af$('listOfRef', 67586, 'concurrent::AtomicRef', {}).am$('make', 132, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('type', 'sys::Type', false), new sys.Param('signature', 'sys::Str', true)]), {}).am$('fromType', 40962, 'haystack::Kind?', sys.List.make(sys.Param.type$, [new sys.Param('type', 'sys::Type?', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('fromVal', 40962, 'haystack::Kind?', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj?', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('fromFixedType', 34818, 'haystack::Kind?', sys.List.make(sys.Param.type$, [new sys.Param('type', 'sys::Type', false)]), {}).am$('fromListTypeOf', 34818, 'haystack::Kind', sys.List.make(sys.Param.type$, [new sys.Param('t', 'sys::Type?', false)]), {}).am$('toInferredList', 40962, 'sys::List', sys.List.make(sys.Param.type$, [new sys.Param('acc', 'sys::Obj?[]', false)]), { 'sys::NoDoc': "" }).am$('fromDefName', 40962, 'haystack::Kind?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('fromStr', 40966, 'haystack::Kind?', sys.List.make(sys.Param.type$, [new sys.Param('signature', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('of', 270336, 'haystack::Kind?', xp, { 'sys::NoDoc': "" }).am$('tag', 270336, 'sys::Str?', xp, { 'sys::NoDoc': "" }).am$('paramName', 8192, 'sys::Str?', xp, { 'sys::NoDoc': "" }).am$('hash', 271360, 'sys::Int', xp, {}).am$('equals', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj?', false)]), {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('isNumber', 270336, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('isRef', 270336, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('isDict', 270336, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('toListOf', 270336, 'haystack::Kind', xp, { 'sys::NoDoc': "" }).am$('isScalar', 8192, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('isSingleton', 270336, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('isXStr', 270336, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('isCollection', 270336, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('isList', 270336, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('isListOf', 270336, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('of', 'haystack::Kind', false)]), { 'sys::NoDoc': "" }).am$('isListOfRef', 270336, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('isGrid', 270336, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('toTagOf', 270336, 'haystack::Kind', sys.List.make(sys.Param.type$, [new sys.Param('tag', 'sys::Str', false)]), { 'sys::NoDoc': "" }).am$('defVal', 270336, 'sys::Obj', xp, { 'sys::NoDoc': "" }).am$('icon', 8192, 'sys::Str', xp, { 'sys::NoDoc': "" }).am$('canStore', 270336, 'sys::Bool', xp, { 'sys::NoDoc': "" }).am$('valToStr', 270336, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('valToZinc', 270336, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('valToJson', 270336, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('valToAxon', 270336, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('valToDis', 270336, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false), new sys.Param('meta', 'haystack::Dict', true)]), { 'sys::NoDoc': "" }).am$('static$init', 165890, 'sys::Void', xp, {});
ObjKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('defVal', 271360, 'sys::Obj', xp, {}).am$('toListOf', 271360, 'haystack::Kind', xp, {});
MarkerKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('isSingleton', 271360, 'sys::Bool', xp, {}).am$('valToZinc', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToDis', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false), new sys.Param('meta', 'haystack::Dict', true)]), {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('defVal', 271360, 'sys::Obj', xp, {});
NAKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('isSingleton', 271360, 'sys::Bool', xp, {}).am$('valToZinc', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToDis', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false), new sys.Param('meta', 'haystack::Dict', true)]), {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('defVal', 271360, 'sys::Obj', xp, {}).am$('canStore', 271360, 'sys::Bool', xp, {});
RemoveKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('isSingleton', 271360, 'sys::Bool', xp, {}).am$('valToZinc', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToDis', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false), new sys.Param('meta', 'haystack::Dict', true)]), {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('defVal', 271360, 'sys::Obj', xp, {});
BoolKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('valToZinc', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToDis', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false), new sys.Param('meta', 'haystack::Dict', true)]), {});
NumberKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('isNumber', 271360, 'sys::Bool', xp, {}).am$('valToDis', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false), new sys.Param('meta', 'haystack::Dict', true)]), {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {});
RefKind.type$.af$('tag', 336898, 'sys::Str?', {}).am$('make', 8196, 'sys::Void', xp, {}).am$('makeTag', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('tag', 'sys::Str?', false)]), {}).am$('toTagOf', 271360, 'haystack::Kind', sys.List.make(sys.Param.type$, [new sys.Param('tag', 'sys::Str', false)]), {}).am$('isRef', 271360, 'sys::Bool', xp, {}).am$('valToStr', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToDis', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false), new sys.Param('meta', 'haystack::Dict', true)]), {}).am$('valToZinc', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {});
SymbolKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('defVal', 271360, 'sys::Obj', xp, {}).am$('valToStr', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToZinc', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {});
StrKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('valToStr', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToDis', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false), new sys.Param('meta', 'haystack::Dict', true)]), {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {});
UriKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('valToStr', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToDis', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false), new sys.Param('meta', 'haystack::Dict', true)]), {});
DateTimeKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('valToStr', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToDis', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false), new sys.Param('meta', 'haystack::Dict', true)]), {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {});
DateKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('defVal', 271360, 'sys::Obj', xp, {}).am$('valToDis', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false), new sys.Param('meta', 'haystack::Dict', true)]), {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {});
TimeKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('valToDis', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false), new sys.Param('meta', 'haystack::Dict', true)]), {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {});
CoordKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {});
XStrKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('isXStr', 271360, 'sys::Bool', xp, {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {});
BinKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('isXStr', 271360, 'sys::Bool', xp, {}).am$('valToZinc', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {});
SpanKind.type$.am$('make', 8196, 'sys::Void', xp, {}).am$('isXStr', 271360, 'sys::Bool', xp, {}).am$('valToZinc', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToJson', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('valToDis', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false), new sys.Param('meta', 'haystack::Dict', true)]), {});
ListKind.type$.af$('of', 336898, 'haystack::Kind?', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('of', 'haystack::Kind', false)]), {}).am$('isCollection', 271360, 'sys::Bool', xp, {}).am$('isList', 271360, 'sys::Bool', xp, {}).am$('isListOf', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('of', 'haystack::Kind', false)]), {}).am$('defVal', 271360, 'sys::Obj', xp, {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('v', 'sys::Obj', false)]), {}).am$('valToZinc', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('v', 'sys::Obj', false)]), {}).am$('valToDis', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false), new sys.Param('meta', 'haystack::Dict', true)]), {}).am$('itemToDis', 2048, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('item', 'sys::Obj?', false), new sys.Param('meta', 'haystack::Dict', false)]), {});
DictKind.type$.af$('tag', 336898, 'sys::Str?', {}).am$('make', 8196, 'sys::Void', xp, {}).am$('makeTag', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('tag', 'sys::Str?', false)]), {}).am$('toTagOf', 271360, 'haystack::Kind', sys.List.make(sys.Param.type$, [new sys.Param('tag', 'sys::Str', false)]), {}).am$('isCollection', 271360, 'sys::Bool', xp, {}).am$('isDict', 271360, 'sys::Bool', xp, {}).am$('defVal', 271360, 'sys::Obj', xp, {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {});
GridKind.type$.af$('tag', 336898, 'sys::Str?', {}).am$('make', 8196, 'sys::Void', xp, {}).am$('makeTag', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('tag', 'sys::Str?', false)]), {}).am$('toTagOf', 271360, 'haystack::Kind', sys.List.make(sys.Param.type$, [new sys.Param('tag', 'sys::Str', false)]), {}).am$('isCollection', 271360, 'sys::Bool', xp, {}).am$('isGrid', 271360, 'sys::Bool', xp, {}).am$('defVal', 271360, 'sys::Obj', xp, {}).am$('valToDis', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false), new sys.Param('meta', 'haystack::Dict', true)]), {}).am$('valToAxon', 271360, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {});
CsvWriter.type$.af$('delimiter', 73728, 'sys::Int', {}).af$('newline', 73728, 'sys::Str', {}).af$('showHeader', 73728, 'sys::Bool', {}).af$('stripUnits', 73728, 'sys::Bool', {}).af$('out', 67584, 'util::CsvOutStream', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('out', 'sys::OutStream', false), new sys.Param('opts', 'haystack::Dict?', true)]), {}).am$('toDelimiter', 2048, 'sys::Int', sys.List.make(sys.Param.type$, [new sys.Param('opts', 'haystack::Dict', false)]), {}).am$('toShowHeader', 2048, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('opts', 'haystack::Dict', false)]), {}).am$('toStripUnits', 2048, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('opts', 'haystack::Dict', false)]), {}).am$('gridToStr', 40962, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid', false)]), { 'sys::NoDoc': "" }).am$('flush', 8192, 'sys::This', xp, {}).am$('close', 8192, 'sys::Bool', xp, {}).am$('writeGrid', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid', false)]), {}).am$('writeScalarCell', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('row', 'haystack::Row', false), new sys.Param('col', 'haystack::Col', false)]), {});
XStr.type$.af$('type', 73730, 'sys::Str', {}).af$('val', 73730, 'sys::Str', {}).af$('defVal', 106498, 'haystack::XStr', { 'sys::NoDoc': "" }).am$('decode', 40962, 'sys::Obj', sys.List.make(sys.Param.type$, [new sys.Param('type', 'sys::Str', false), new sys.Param('val', 'sys::Str', false)]), {}).am$('encode', 32902, 'haystack::XStr?', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Obj', false)]), {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('type', 'sys::Str', false), new sys.Param('val', 'sys::Str', false)]), {}).am$('makeImpl', 132, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('type', 'sys::Str', false), new sys.Param('val', 'sys::Str', false)]), {}).am$('isValidType', 34818, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('t', 'sys::Str', false)]), {}).am$('hash', 271360, 'sys::Int', xp, {}).am$('equals', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('obj', 'sys::Obj?', false)]), {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('static$init', 165890, 'sys::Void', xp, {});
Reflection.type$.am$('subject', 270337, 'haystack::Dict', xp, {}).am$('defs', 270337, 'haystack::Def[]', xp, {}).am$('def', 270337, 'haystack::Def?', sys.List.make(sys.Param.type$, [new sys.Param('symbol', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('fits', 270337, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('base', 'haystack::Def', false)]), {}).am$('entityTypes', 270337, 'haystack::Def[]', xp, {}).am$('toGrid', 270337, 'haystack::Grid', xp, {});
Coord.type$.af$('defVal', 106498, 'haystack::Coord', {}).af$('ulat', 73730, 'sys::Int', { 'sys::NoDoc': "" }).af$('ulng', 73730, 'sys::Int', { 'sys::NoDoc': "" }).am$('fromStr', 40966, 'haystack::Coord?', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::Str', false), new sys.Param('checked', 'sys::Bool', true)]), {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('lat', 'sys::Float', false), new sys.Param('lng', 'sys::Float', false)]), {}).am$('makeu', 40962, 'haystack::Coord', sys.List.make(sys.Param.type$, [new sys.Param('ulat', 'sys::Int', false), new sys.Param('ulng', 'sys::Int', false)]), { 'sys::NoDoc': "" }).am$('makeuImpl', 2052, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('ulat', 'sys::Int', false), new sys.Param('ulng', 'sys::Int', false)]), {}).am$('lat', 8192, 'sys::Float', xp, {}).am$('lng', 8192, 'sys::Float', xp, {}).am$('hash', 271360, 'sys::Int', xp, {}).am$('equals', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj?', false)]), {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('toLatLgnStr', 8192, 'sys::Str', xp, { 'sys::NoDoc': "" }).am$('uToStr', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('s', 'sys::StrBuf', false), new sys.Param('ud', 'sys::Int', false)]), {}).am$('pack', 8192, 'sys::Int', xp, { 'sys::NoDoc': "" }).am$('packLat', 8192, 'sys::Int', xp, { 'sys::NoDoc': "" }).am$('packLng', 8192, 'sys::Int', xp, { 'sys::NoDoc': "" }).am$('unpackI4', 40962, 'haystack::Coord', sys.List.make(sys.Param.type$, [new sys.Param('lat', 'sys::Int', false), new sys.Param('lng', 'sys::Int', false)]), { 'sys::NoDoc': "" }).am$('unpack', 40962, 'haystack::Coord', sys.List.make(sys.Param.type$, [new sys.Param('bits', 'sys::Int', false)]), { 'sys::NoDoc': "" }).am$('dist', 8192, 'sys::Float', sys.List.make(sys.Param.type$, [new sys.Param('c2', 'haystack::Coord', false)]), {}).am$('static$init', 165890, 'sys::Void', xp, {});
CsvReader.type$.af$('in', 67584, 'util::CsvInStream', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('in', 'sys::InStream', false)]), {}).am$('readGrid', 271360, 'haystack::Grid', xp, {});
BrioPreEncoded.type$.af$('buf', 73728, 'sys::Buf', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('buf', 'sys::Buf', false)]), {});
BrioConsts.type$.af$('curRef', 100354, 'concurrent::AtomicRef', {}).af$('mimeType', 106498, 'sys::MimeType', {}).af$('version', 73730, 'sys::Version', {}).af$('byVal', 73730, '[sys::Str:sys::Int]', {}).af$('byCode', 73730, 'sys::Str[]', {}).af$('maxSafeCode', 73730, 'sys::Int', {}).am$('cur', 40962, 'haystack::BrioConsts', xp, {}).am$('loadJava', 34818, 'haystack::BrioConsts', sys.List.make(sys.Param.type$, [new sys.Param('f', 'sys::File', false)]), {}).am$('loadJs', 34818, 'haystack::BrioConsts', xp, {}).am$('make', 2052, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::This->sys::Void|', false)]), {}).am$('encode', 8192, 'sys::Int?', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Str', false), new sys.Param('maxStrCode', 'sys::Int', false)]), {}).am$('encodeX', 8192, 'sys::Int?', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Str', false)]), {}).am$('decode', 8192, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('code', 'sys::Int', false)]), {}).am$('intern', 8192, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Str', false)]), {}).am$('static$init', 165890, 'sys::Void', xp, {});
BrioConstsFile.type$.am$('version', 40962, 'sys::Str', xp, {}).am$('file', 40962, 'sys::Str', xp, {}).am$('make', 139268, 'sys::Void', xp, {});
HaystackContext.type$.af$('nilRef', 100354, 'haystack::NilContext', {}).am$('nil', 40962, 'haystack::HaystackContext', xp, { 'sys::NoDoc': "" }).am$('xetoIsSpec', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('spec', 'sys::Str', false), new sys.Param('rec', 'xeto::Dict', false)]), { 'sys::NoDoc': "" }).am$('xetoReadById', 271360, 'xeto::Dict?', sys.List.make(sys.Param.type$, [new sys.Param('id', 'sys::Obj', false)]), { 'sys::NoDoc': "" }).am$('xetoReadAllEachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('filter', 'sys::Str', false), new sys.Param('f', '|xeto::Dict->sys::Obj?|', false)]), { 'sys::NoDoc': "" }).am$('deref', 270337, 'haystack::Dict?', sys.List.make(sys.Param.type$, [new sys.Param('id', 'haystack::Ref', false)]), { 'sys::NoDoc': "" }).am$('inference', 270337, 'haystack::FilterInference', xp, { 'sys::NoDoc': "" }).am$('toDict', 270337, 'haystack::Dict', xp, { 'sys::NoDoc': "" }).am$('static$init', 165890, 'sys::Void', xp, {});
NilContext.type$.am$('deref', 271360, 'haystack::Dict?', sys.List.make(sys.Param.type$, [new sys.Param('id', 'haystack::Ref', false)]), {}).am$('inference', 271360, 'haystack::FilterInference', xp, {}).am$('toDict', 271360, 'haystack::Dict', xp, {}).am$('make', 139268, 'sys::Void', xp, {});
PatherContext.type$.af$('pather', 67584, '|haystack::Ref->haystack::Dict?|', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('pather', '|haystack::Ref->haystack::Dict?|', false)]), {}).am$('deref', 271360, 'haystack::Dict?', sys.List.make(sys.Param.type$, [new sys.Param('id', 'haystack::Ref', false)]), {}).am$('inference', 271360, 'haystack::FilterInference', xp, {}).am$('toDict', 271360, 'haystack::Dict', xp, {});
HaystackFunc.type$.am$('haystackCall', 270337, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('cx', 'haystack::HaystackContext', false), new sys.Param('args', 'sys::Obj?[]', false)]), {});
EmptyDict.type$.af$('val', 106498, 'haystack::EmptyDict', {}).am$('isEmpty', 271360, 'sys::Bool', xp, {}).am$('get', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('key', 'sys::Str', false), new sys.Param('def', 'sys::Obj?', true)]), {}).am$('has', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('missing', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('each', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), {}).am$('eachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj?|', false)]), {}).am$('map', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj|', false)]), {}).am$('trap', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false), new sys.Param('a', 'sys::Obj?[]?', true)]), {}).am$('make', 139268, 'sys::Void', xp, {}).am$('static$init', 165890, 'sys::Void', xp, {});
MapDict.type$.af$('tags', 73730, '[sys::Str:sys::Obj?]', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('tags', '[sys::Str:sys::Obj?]', false)]), {}).am$('isEmpty', 271360, 'sys::Bool', xp, {}).am$('get', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false), new sys.Param('def', 'sys::Obj?', true)]), {}).am$('has', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('missing', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('each', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), {}).am$('eachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj?|', false)]), {}).am$('trap', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false), new sys.Param('a', 'sys::Obj?[]?', true)]), {});
NotNullMapDict.type$.af$('tags', 73730, '[sys::Str:sys::Obj]', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('tags', '[sys::Str:sys::Obj]', false)]), {}).am$('isEmpty', 271360, 'sys::Bool', xp, {}).am$('get', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false), new sys.Param('def', 'sys::Obj?', true)]), {}).am$('has', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('missing', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('each', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), {}).am$('eachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj?|', false)]), {}).am$('trap', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false), new sys.Param('a', 'sys::Obj?[]?', true)]), {});
DictX.type$.am$('isEmpty', 9216, 'sys::Bool', xp, {}).am$('has', 9216, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('missing', 9216, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false)]), {}).am$('trap', 9216, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('args', 'sys::Obj?[]?', true)]), {}).am$('make', 139268, 'sys::Void', xp, {});
Dict1.type$.af$('n0', 73730, 'sys::Str', {}).af$('v0', 73730, 'sys::Obj', {}).am$('make1', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj', false)]), {}).am$('get', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('def', 'sys::Obj?', true)]), {}).am$('each', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), {}).am$('eachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj?|', false)]), {}).am$('map', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj|', false)]), {});
Dict2.type$.af$('n0', 73730, 'sys::Str', {}).af$('n1', 73730, 'sys::Str', {}).af$('v0', 73730, 'sys::Obj', {}).af$('v1', 73730, 'sys::Obj', {}).am$('make2', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj', false), new sys.Param('n1', 'sys::Str', false), new sys.Param('v1', 'sys::Obj', false)]), {}).am$('get', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('def', 'sys::Obj?', true)]), {}).am$('each', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), {}).am$('eachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj?|', false)]), {}).am$('map', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj|', false)]), {});
Dict3.type$.af$('n0', 73730, 'sys::Str', {}).af$('n1', 73730, 'sys::Str', {}).af$('n2', 73730, 'sys::Str', {}).af$('v0', 73730, 'sys::Obj', {}).af$('v1', 73730, 'sys::Obj', {}).af$('v2', 73730, 'sys::Obj', {}).am$('make3', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj', false), new sys.Param('n1', 'sys::Str', false), new sys.Param('v1', 'sys::Obj', false), new sys.Param('n2', 'sys::Str', false), new sys.Param('v2', 'sys::Obj', false)]), {}).am$('get', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('def', 'sys::Obj?', true)]), {}).am$('each', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), {}).am$('eachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj?|', false)]), {}).am$('map', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj|', false)]), {});
Dict4.type$.af$('n0', 73730, 'sys::Str', {}).af$('n1', 73730, 'sys::Str', {}).af$('n2', 73730, 'sys::Str', {}).af$('n3', 73730, 'sys::Str', {}).af$('v0', 73730, 'sys::Obj', {}).af$('v1', 73730, 'sys::Obj', {}).af$('v2', 73730, 'sys::Obj', {}).af$('v3', 73730, 'sys::Obj', {}).am$('make4', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj', false), new sys.Param('n1', 'sys::Str', false), new sys.Param('v1', 'sys::Obj', false), new sys.Param('n2', 'sys::Str', false), new sys.Param('v2', 'sys::Obj', false), new sys.Param('n3', 'sys::Str', false), new sys.Param('v3', 'sys::Obj', false)]), {}).am$('get', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('def', 'sys::Obj?', true)]), {}).am$('each', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), {}).am$('eachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj?|', false)]), {}).am$('map', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj|', false)]), {});
Dict5.type$.af$('n0', 73730, 'sys::Str', {}).af$('n1', 73730, 'sys::Str', {}).af$('n2', 73730, 'sys::Str', {}).af$('n3', 73730, 'sys::Str', {}).af$('n4', 73730, 'sys::Str', {}).af$('v0', 73730, 'sys::Obj', {}).af$('v1', 73730, 'sys::Obj', {}).af$('v2', 73730, 'sys::Obj', {}).af$('v3', 73730, 'sys::Obj', {}).af$('v4', 73730, 'sys::Obj', {}).am$('make5', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj', false), new sys.Param('n1', 'sys::Str', false), new sys.Param('v1', 'sys::Obj', false), new sys.Param('n2', 'sys::Str', false), new sys.Param('v2', 'sys::Obj', false), new sys.Param('n3', 'sys::Str', false), new sys.Param('v3', 'sys::Obj', false), new sys.Param('n4', 'sys::Str', false), new sys.Param('v4', 'sys::Obj', false)]), {}).am$('get', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('def', 'sys::Obj?', true)]), {}).am$('each', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), {}).am$('eachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj?|', false)]), {}).am$('map', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj|', false)]), {});
Dict6.type$.af$('n0', 73730, 'sys::Str', {}).af$('n1', 73730, 'sys::Str', {}).af$('n2', 73730, 'sys::Str', {}).af$('n3', 73730, 'sys::Str', {}).af$('n4', 73730, 'sys::Str', {}).af$('n5', 73730, 'sys::Str', {}).af$('v0', 73730, 'sys::Obj', {}).af$('v1', 73730, 'sys::Obj', {}).af$('v2', 73730, 'sys::Obj', {}).af$('v3', 73730, 'sys::Obj', {}).af$('v4', 73730, 'sys::Obj', {}).af$('v5', 73730, 'sys::Obj', {}).am$('make6', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('n0', 'sys::Str', false), new sys.Param('v0', 'sys::Obj', false), new sys.Param('n1', 'sys::Str', false), new sys.Param('v1', 'sys::Obj', false), new sys.Param('n2', 'sys::Str', false), new sys.Param('v2', 'sys::Obj', false), new sys.Param('n3', 'sys::Str', false), new sys.Param('v3', 'sys::Obj', false), new sys.Param('n4', 'sys::Str', false), new sys.Param('v4', 'sys::Obj', false), new sys.Param('n5', 'sys::Str', false), new sys.Param('v5', 'sys::Obj', false)]), {}).am$('get', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('name', 'sys::Str', false), new sys.Param('def', 'sys::Obj?', true)]), {}).am$('each', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), {}).am$('eachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj?|', false)]), {}).am$('map', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj|', false)]), {});
WrapDict.type$.af$('wrapped', 73730, 'haystack::Dict', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('wrapped', 'haystack::Dict', false)]), {}).am$('get', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false), new sys.Param('def', 'sys::Obj?', true)]), { 'sys::Operator': "" }).am$('isEmpty', 271360, 'sys::Bool', xp, {}).am$('has', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('missing', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('each', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), {}).am$('eachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj?|', false)]), {}).am$('trap', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false), new sys.Param('a', 'sys::Obj?[]?', true)]), {}).am$('normalize', 270336, 'haystack::Dict', sys.List.make(sys.Param.type$, [new sys.Param('d', 'haystack::Dict', false)]), {});
ReflectDict.type$.am$('isEmpty', 271360, 'sys::Bool', xp, {}).am$('has', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('missing', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false)]), {}).am$('get', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false), new sys.Param('def', 'sys::Obj?', true)]), {}).am$('each', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Void|', false)]), {}).am$('eachWhile', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj?|', false)]), {}).am$('trap', 271360, 'sys::Obj?', sys.List.make(sys.Param.type$, [new sys.Param('n', 'sys::Str', false), new sys.Param('args', 'sys::Obj?[]?', true)]), {}).am$('make', 139268, 'sys::Void', xp, {});
MLink.type$.af$('fromRef', 336898, 'haystack::Ref', {}).af$('fromSlot', 336898, 'sys::Str', {}).af$('specRef$Store', 755712, 'sys::Obj?', {}).am$('specRef', 565250, 'haystack::Ref', xp, {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('wrapped', 'haystack::Dict', false)]), {}).am$('map', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj|', false)]), {}).am$('specRef$Once', 165890, 'haystack::Ref', xp, {}).am$('static$init', 165890, 'sys::Void', xp, {});
MLinks.type$.af$('specRef$Store', 755712, 'sys::Obj?', {}).af$('empty$Store', 755712, 'sys::Obj?', {}).am$('specRef', 565250, 'haystack::Ref', xp, {}).am$('empty', 565250, 'haystack::MLinks', xp, {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('wrapped', 'haystack::Dict', false)]), {}).am$('map', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Obj,sys::Str->sys::Obj|', false)]), {}).am$('isLinked', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('toSlot', 'sys::Str', false)]), {}).am$('eachLink', 271360, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('f', '|sys::Str,xeto::Link->sys::Void|', false)]), {}).am$('listOn', 271360, 'xeto::Link[]', sys.List.make(sys.Param.type$, [new sys.Param('toSlot', 'sys::Str', false)]), {}).am$('add', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('toSlot', 'sys::Str', false), new sys.Param('newLink', 'xeto::Link', false)]), {}).am$('remove', 271360, 'sys::This', sys.List.make(sys.Param.type$, [new sys.Param('toSlot', 'sys::Str', false), new sys.Param('link', 'xeto::Link', false)]), {}).am$('eq', 34818, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('a', 'xeto::Link', false), new sys.Param('b', 'xeto::Link', false)]), {}).am$('specRef$Once', 165890, 'haystack::Ref', xp, {}).am$('empty$Once', 165890, 'haystack::MLinks', xp, {}).am$('static$init', 165890, 'sys::Void', xp, {});
DictHashKey.type$.af$('dict', 73730, 'haystack::Dict', {}).af$('size', 73730, 'sys::Int', {}).af$('nameHash', 73730, 'sys::Int', {}).af$('valHash', 73730, 'sys::Int', {}).af$('hash', 336898, 'sys::Int', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('dict', 'haystack::Dict', false)]), {}).am$('toStr', 271360, 'sys::Str', xp, {}).am$('equals', 271360, 'sys::Bool', sys.List.make(sys.Param.type$, [new sys.Param('that', 'sys::Obj?', false)]), {});
HaystackTest.type$.af$('m', 106498, 'haystack::Marker', {}).af$('nsDefaultRef', 100354, 'concurrent::AtomicRef', {}).am$('n', 40962, 'haystack::Number?', sys.List.make(sys.Param.type$, [new sys.Param('val', 'sys::Num?', false), new sys.Param('unit', 'sys::Obj?', true)]), {}).am$('ns', 270336, 'haystack::Namespace', xp, { 'sys::NoDoc': "" }).am$('verifyDictEq', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('a', 'haystack::Dict', false), new sys.Param('b', 'sys::Obj', false), new sys.Param('msg', 'sys::Str?', true)]), {}).am$('verifyDictsEq', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('a', 'haystack::Dict?[]', false), new sys.Param('b', 'sys::Obj?[]', false), new sys.Param('ordered', 'sys::Bool', true)]), { 'sys::NoDoc': "" }).am$('verifyGridIsEmpty', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('g', 'haystack::Grid', false)]), {}).am$('verifyGridEq', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('a', 'haystack::Grid', false), new sys.Param('b', 'haystack::Grid', false)]), {}).am$('verifyColEq', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('a', 'haystack::Col', false), new sys.Param('b', 'haystack::Col', false)]), { 'sys::NoDoc': "" }).am$('verifyRowEq', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('a', 'haystack::Row', false), new sys.Param('b', 'haystack::Row', false)]), { 'sys::NoDoc': "" }).am$('verifyValEq', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('a', 'sys::Obj?', false), new sys.Param('b', 'sys::Obj?', false), new sys.Param('msg', 'sys::Str?', true)]), {}).am$('verifyRefEq', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('a', 'haystack::Ref', false), new sys.Param('b', 'haystack::Ref', false), new sys.Param('msg', 'sys::Str?', true)]), {}).am$('verifyListEq', 270336, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('a', 'sys::List', false), new sys.Param('b', 'sys::List', false), new sys.Param('msg', 'sys::Str?', true)]), {}).am$('verifyBufEq', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('a', 'sys::Buf', false), new sys.Param('b', 'sys::Buf', false), new sys.Param('msg', 'sys::Str?', true)]), { 'sys::NoDoc': "" }).am$('verifyRecIds', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('grid', 'haystack::Grid', false), new sys.Param('ids', 'haystack::Ref[]', false)]), { 'sys::NoDoc': "" }).am$('verifyNumApprox', 8192, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('a', 'haystack::Number?', false), new sys.Param('b', 'sys::Obj?', false), new sys.Param('tolerance', 'sys::Float?', true)]), { 'sys::NoDoc': "" }).am$('make', 139268, 'sys::Void', xp, {}).am$('static$init', 165890, 'sys::Void', xp, {});
BrioReader.type$.af$('in', 73728, 'sys::InStream', {}).af$('cp', 67586, 'haystack::BrioConsts', {}).af$('internStrs', 67584, '[sys::Str:sys::Str]?', {}).af$('internRefs', 67584, '[haystack::Ref:haystack::Ref]?', {}).af$('internSymbols', 67584, '[sys::Str:haystack::Symbol]?', {}).af$('internDates', 67584, '[sys::Date:sys::Date]?', {}).am$('make', 8196, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('in', 'sys::InStream', false)]), {}).am$('readGrid', 271360, 'haystack::Grid', xp, {}).am$('close', 8192, 'sys::Bool', xp, {}).am$('avail', 8192, 'sys::Int', xp, {}).am$('readDict', 8192, 'haystack::Dict', xp, {}).am$('readVal', 8192, 'sys::Obj?', xp, {}).am$('consumeNumberI2', 2048, 'haystack::Number', xp, {}).am$('consumeNumberI4', 2048, 'haystack::Number', xp, {}).am$('consumeNumberF8', 2048, 'haystack::Number', xp, {}).am$('consumeUnit', 2048, 'sys::Unit?', xp, {}).am$('consumeStr', 2048, 'sys::Str', xp, {}).am$('consumeRefStr', 2048, 'haystack::Ref', xp, {}).am$('consumeRefI8', 2048, 'haystack::Ref', xp, {}).am$('consumeSymbol', 2048, 'haystack::Symbol', xp, {}).am$('consumeUri', 2048, 'sys::Uri', xp, {}).am$('consumeDate', 2048, 'sys::Date', xp, {}).am$('consumeTime', 2048, 'sys::Time', xp, {}).am$('consumeDateTimeI4', 2048, 'sys::DateTime', xp, {}).am$('consumeDateTimeI8', 2048, 'sys::DateTime', xp, {}).am$('consumeDateTimeF8', 2048, 'sys::DateTime', xp, {}).am$('consumeTimeZone', 2048, 'sys::TimeZone', xp, {}).am$('consumeCoord', 2048, 'haystack::Coord', xp, {}).am$('consumeXStr', 2048, 'sys::Obj', xp, {}).am$('consumeBuf', 2048, 'sys::Buf', xp, {}).am$('consumeList', 2048, 'sys::Obj?[]', xp, {}).am$('consumeDict', 2048, 'haystack::Dict', xp, {}).am$('consumeDict1', 2048, 'haystack::Dict', xp, {}).am$('consumeDict2', 2048, 'haystack::Dict', xp, {}).am$('consumeDict3', 2048, 'haystack::Dict', xp, {}).am$('consumeDict4', 2048, 'haystack::Dict', xp, {}).am$('consumeDict5', 2048, 'haystack::Dict', xp, {}).am$('consumeDict6', 2048, 'haystack::Dict', xp, {}).am$('consumeGrid', 2048, 'haystack::Grid', xp, {}).am$('decodeStr', 8192, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('intern', 'sys::Bool', false)]), {}).am$('decodeStrChars', 8192, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('intern', 'sys::Bool', false)]), {}).am$('decodeVarInt', 8192, 'sys::Int', xp, {}).am$('internStr', 270336, 'sys::Str', sys.List.make(sys.Param.type$, [new sys.Param('v', 'sys::Str', false)]), {}).am$('internRef', 270336, 'haystack::Ref', sys.List.make(sys.Param.type$, [new sys.Param('id', 'sys::Str', false), new sys.Param('dis', 'sys::Str?', false)]), {}).am$('internSymbol', 270336, 'haystack::Symbol', sys.List.make(sys.Param.type$, [new sys.Param('v', 'sys::Str', false)]), {}).am$('internDate', 270336, 'sys::Date', sys.List.make(sys.Param.type$, [new sys.Param('v', 'sys::Date', false)]), {}).am$('verifyByte', 2048, 'sys::Void', sys.List.make(sys.Param.type$, [new sys.Param('b', 'sys::Int', false)]), {});

m = sys.Map.make(sys.Str.type$, sys.Str.type$);
m.set("pod.name", "haystack");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;util 1.0;inet 1.0;xeto 3.1.11;web 1.0");
m.set("pod.summary", "Haystack model and client API");
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
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/haxall/haxall");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "true");
p.__meta(m);

m = sys.Map.make(sys.Str.type$, sys.Str.type$);
m.set("more", "more");
m.set("lastMonth", "Last Month");
m.set("lastQuarter", "Last Quarter");
m.set("lastWeek", "Last Week");
m.set("lastYear", "Last Year");
m.set("quarter1", "Q1");
m.set("quarter2", "Q2");
m.set("quarter3", "Q3");
m.set("quarter4", "Q4");
m.set("pastMonth", "Past Month");
m.set("pastQuarter", "Past Quarter");
m.set("pastWeek", "Past Week");
m.set("pastYear", "Past Year");
m.set("thisMonth", "This Month");
m.set("thisQuarter", "This Quarter");
m.set("thisWeek", "This Week");
m.set("thisYear", "This Year");
m.set("span.dateTime", "D-MMM-YYYY k:mmaa");
m.set("span.date", "D-MMM-YYYY");
m.set("span.month", "MMM-YYYY");
m.set("span.year", "YYYY");
m.set("today", "Today");
m.set("weekOf", "Week of");
m.set("yesterday", "Yesterday");
m.set("justNow", "Just now");
m.set("daysAgo", "days ago");
m.set("number.byte", "B");
m.set("number.us_dollar", "U#,##0.00");
m.set("number.euro", "#,##0.00U");
m.set("number.pound_sterling", "U#,##0.00");
m.set("number.japanese_yen", "#,##0");
m.set("number.south_korean_won", "#,##0");
sys.Env.cur().__props("haystack:locale/en.props", m);



// cjs exports begin
export {
  Etc,
  GridWriter,
  TrioWriter,
  Dict,
  Bin,
  HaystackTokenizer,
  HaystackParser,
  HaystackFactory,
  FreeFormParser,
  HaystackToken,
  Filter,
  FilterType,
  FilterPath,
  FilterInference,
  NumberFormat,
  Col,
  Namespace,
  Remove,
  HisItem,
  ZincWriter,
  JsonWriter,
  Def,
  Lib,
  UnknownNameErr,
  UnknownDefErr,
  UnknownSpecErr,
  UnknownFeatureErr,
  UnknownFiletypeErr,
  UnknownLibErr,
  UnknownRecErr,
  UnknownKindErr,
  UnknownTagErr,
  UnknownFuncErr,
  UnknownCompErr,
  UnknownCellErr,
  NotHaystackErr,
  UnitErr,
  DependErr,
  CallErr,
  DisabledErr,
  FaultErr,
  DownErr,
  CoerceErr,
  PermissionErr,
  ValidateErr,
  InvalidNameErr,
  InvalidChangeErr,
  DuplicateNameErr,
  AlreadyParentedErr,
  GridReader,
  Row,
  Macro,
  Client,
  HaystackClientAuth,
  Define,
  Marker,
  ObjRange,
  JsonReader,
  JsonParser,
  HaysonParser,
  JsonV3Parser,
  ZincReader,
  TrioReader,
  Ref,
  RefDir,
  RefSeg,
  RefSchemes,
  GridBuilder,
  Grid,
  Filetype,
  Symbol,
  SymbolType,
  NA,
  Feature,
  WebOpUtil,
  TypedDict,
  TypedTag,
  Span,
  SpanMode,
  Number,
  BrioCtrl,
  BrioWriter,
  DateSpan,
  Kind,
  CsvWriter,
  XStr,
  Reflection,
  Coord,
  CsvReader,
  BrioPreEncoded,
  BrioConsts,
  BrioConstsFile,
  HaystackContext,
  PatherContext,
  HaystackFunc,
  WrapDict,
  ReflectDict,
  DictHashKey,
  HaystackTest,
  BrioReader,
};
