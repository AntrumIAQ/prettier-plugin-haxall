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
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class MReflection extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#entityTypesRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return MReflection.type$; }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #subject = null;

  subject() { return this.#subject; }

  __subject(it) { if (it === undefined) return this.#subject; else this.#subject = it; }

  #defs = null;

  defs() { return this.#defs; }

  __defs(it) { if (it === undefined) return this.#defs; else this.#defs = it; }

  #entityTypesRef = null;

  // private field reflection only
  __entityTypesRef(it) { if (it === undefined) return this.#entityTypesRef; else this.#entityTypesRef = it; }

  static reflect(ns,subject) {
    const this$ = this;
    let defs = sys.List.make(haystack.Def.type$);
    ns.lazy().conjuncts().each((def) => {
      if (MReflection.matchConjunct(subject, def)) {
        defs.add(def);
      }
      ;
      return;
    });
    subject.each((v,n) => {
      let def = ns.def(n, false);
      if (def != null) {
        defs.add(sys.ObjUtil.coerce(def, haystack.Def.type$));
      }
      ;
      return;
    });
    return MReflection.make(ns, subject, defs);
  }

  static matchConjunct(subject,conjunct) {
    let symbol = conjunct.symbol();
    for (let i = 0; sys.ObjUtil.compareLT(i, symbol.size()); i = sys.Int.increment(i)) {
      if (subject.missing(symbol.part(i))) {
        return false;
      }
      ;
    }
    ;
    return true;
  }

  static make(ns,subject,defs) {
    const $self = new MReflection();
    MReflection.make$($self,ns,subject,defs);
    return $self;
  }

  static make$($self,ns,subject,defs) {
    ;
    $self.#ns = ns;
    $self.#subject = subject;
    $self.#defs = sys.ObjUtil.coerce(((this$) => { let $_u0 = defs.sort(); if ($_u0 == null) return null; return sys.ObjUtil.toImmutable(defs.sort()); })($self), sys.Type.find("haystack::Def[]"));
    return;
  }

  def(symbol,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let def = this.#defs.find((x) => {
      return sys.ObjUtil.equals(x.symbol().toStr(), symbol);
    });
    if (def != null) {
      return def;
    }
    ;
    if (checked) {
      throw haystack.UnknownDefErr.make(symbol);
    }
    ;
    return null;
  }

  fits(base) {
    const this$ = this;
    return this.#defs.any((x) => {
      return this$.#ns.fits(x, base);
    });
  }

  entityTypes() {
    let x = this.#entityTypesRef.val();
    if (x == null) {
      this.#entityTypesRef.val((x = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.computeEntityTypes()), sys.Type.find("haystack::Def[]"))));
    }
    ;
    return sys.ObjUtil.coerce(x, sys.Type.find("haystack::Def[]"));
  }

  computeEntityTypes() {
    const this$ = this;
    let acc = this.#defs.findAll((def) => {
      return this$.#ns.fitsEntity(def);
    });
    if (sys.ObjUtil.compareLE(acc.size(), 1)) {
      return acc;
    }
    ;
    (acc = acc.exclude((a) => {
      return acc.any((b) => {
        return (a !== b && this$.#ns.fits(b, a));
      });
    }));
    return acc;
  }

  toGrid() {
    return haystack.Etc.makeDictsGrid(null, this.#defs);
  }

}

class DefBuilder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#factory = DefFactory.make();
    this.#xetoGetter = DefXetoGetter.make();
    this.#defs = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Def"));
    this.#libs = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("def::BLib"));
    this.#features = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("def::MFeature"));
    this.#filetypes = sys.List.make(haystack.Filetype.type$);
    this.#filetypesMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Filetype"));
    this.#nsRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return DefBuilder.type$; }

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

  #xetoGetter = null;

  xetoGetter(it) {
    if (it === undefined) {
      return this.#xetoGetter;
    }
    else {
      this.#xetoGetter = it;
      return;
    }
  }

  #defs = null;

  // private field reflection only
  __defs(it) { if (it === undefined) return this.#defs; else this.#defs = it; }

  #libs = null;

  // private field reflection only
  __libs(it) { if (it === undefined) return this.#libs; else this.#libs = it; }

  #features = null;

  // private field reflection only
  __features(it) { if (it === undefined) return this.#features; else this.#features = it; }

  #filetypes = null;

  // private field reflection only
  __filetypes(it) { if (it === undefined) return this.#filetypes; else this.#filetypes = it; }

  #filetypesMap = null;

  // private field reflection only
  __filetypesMap(it) { if (it === undefined) return this.#filetypesMap; else this.#filetypesMap = it; }

  #nsRef = null;

  // private field reflection only
  __nsRef(it) { if (it === undefined) return this.#nsRef; else this.#nsRef = it; }

  addDef(meta,aux) {
    if (aux === undefined) aux = null;
    let lib = this.toLib(meta);
    let def = this.toDef(lib, meta, aux);
    this.#defs.add(def.symbol().toStr(), def);
    return;
  }

  toLib(meta) {
    let libName = sys.ObjUtil.toStr(meta.trap("lib", sys.List.make(sys.Obj.type$.toNullable(), [])));
    let lib = this.#libs.get(libName);
    if (lib == null) {
      this.#libs.set(libName, sys.ObjUtil.coerce((lib = BLib.make(libName)), BLib.type$));
    }
    ;
    return sys.ObjUtil.coerce(lib, BLib.type$);
  }

  toDef(lib,meta,aux) {
    let symbol = sys.ObjUtil.coerce(meta.trap("def", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Symbol.type$);
    let b = BDef.make(symbol, lib.ref(), meta, aux);
    if (symbol.type().isKey()) {
      return this.toKey(b);
    }
    ;
    return this.toFallback(b);
  }

  toKey(b) {
    let feature = this.toFeature(b.symbol().part(0));
    let def = feature.createDef(b);
    if (feature.isFiletype()) {
      this.addFiletype(sys.ObjUtil.coerce(def, MFiletype.type$));
    }
    ;
    return sys.ObjUtil.coerce(def, MDef.type$);
  }

  addFiletype(def) {
    let name = def.name();
    this.#filetypes.add(def);
    this.#filetypesMap.add(name, def);
    this.#filetypesMap.add(def.mimeType().toStr(), def);
    this.#filetypesMap.add(sys.Str.plus("application/vnd.haystack+", name), def);
    return;
  }

  toFeature(name) {
    let feature = this.#features.get(name);
    if (feature == null) {
      this.#features.set(name, sys.ObjUtil.coerce((feature = this.#factory.createFeature(BFeature.make(name, this.#nsRef))), MFeature.type$));
    }
    ;
    return sys.ObjUtil.coerce(feature, MFeature.type$);
  }

  toFallback(b) {
    return MDef.make(b);
  }

  build() {
    const this$ = this;
    let libsMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Lib"));
    let libsList = sys.List.make(haystack.Lib.type$);
    this.#libs.each((blib) => {
      let mlib = sys.ObjUtil.coerce(this$.#defs.getChecked(blib.symbol()), MLib.type$);
      blib.ref().val(mlib);
      libsList.add(mlib);
      libsMap.set(mlib.name(), mlib);
      return;
    });
    libsList.sort();
    libsList.each(sys.ObjUtil.coerce((lib,i) => {
      lib.indexRef().val(i);
      return;
    }, sys.Type.find("|haystack::Lib,sys::Int->sys::Void|")));
    let b = BNamespace.make();
    b.xetoGetter(this.#xetoGetter);
    b.ref(this.#nsRef);
    b.defsMap(this.#defs);
    b.features(this.#features.vals().sort());
    b.featuresMap(this.#features);
    b.libs(libsList);
    b.libsMap(libsMap);
    b.filetypes(this.#filetypes.sort());
    b.filetypesMap(this.#filetypesMap);
    return this.#factory.createNamespace(b);
  }

  static make() {
    const $self = new DefBuilder();
    DefBuilder.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class BNamespace extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BNamespace.type$; }

  #ref = null;

  ref(it) {
    if (it === undefined) {
      return this.#ref;
    }
    else {
      this.#ref = it;
      return;
    }
  }

  #defsMap = null;

  defsMap(it) {
    if (it === undefined) {
      return this.#defsMap;
    }
    else {
      this.#defsMap = it;
      return;
    }
  }

  #features = null;

  features(it) {
    if (it === undefined) {
      return this.#features;
    }
    else {
      this.#features = it;
      return;
    }
  }

  #featuresMap = null;

  featuresMap(it) {
    if (it === undefined) {
      return this.#featuresMap;
    }
    else {
      this.#featuresMap = it;
      return;
    }
  }

  #libs = null;

  libs(it) {
    if (it === undefined) {
      return this.#libs;
    }
    else {
      this.#libs = it;
      return;
    }
  }

  #libsMap = null;

  libsMap(it) {
    if (it === undefined) {
      return this.#libsMap;
    }
    else {
      this.#libsMap = it;
      return;
    }
  }

  #filetypes = null;

  filetypes(it) {
    if (it === undefined) {
      return this.#filetypes;
    }
    else {
      this.#filetypes = it;
      return;
    }
  }

  #filetypesMap = null;

  filetypesMap(it) {
    if (it === undefined) {
      return this.#filetypesMap;
    }
    else {
      this.#filetypesMap = it;
      return;
    }
  }

  #xetoGetter = null;

  xetoGetter(it) {
    if (it === undefined) {
      return this.#xetoGetter;
    }
    else {
      this.#xetoGetter = it;
      return;
    }
  }

  static make() {
    const $self = new BNamespace();
    BNamespace.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class BLib extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#defs = sys.List.make(MDef.type$);
    return;
  }

  typeof() { return BLib.type$; }

  #symbol = null;

  symbol() { return this.#symbol; }

  __symbol(it) { if (it === undefined) return this.#symbol; else this.#symbol = it; }

  #ref = null;

  ref() { return this.#ref; }

  __ref(it) { if (it === undefined) return this.#ref; else this.#ref = it; }

  #defs = null;

  defs(it) {
    if (it === undefined) {
      return this.#defs;
    }
    else {
      this.#defs = it;
      return;
    }
  }

  static make(symbol) {
    const $self = new BLib();
    BLib.make$($self,symbol);
    return $self;
  }

  static make$($self,symbol) {
    ;
    $self.#symbol = symbol;
    $self.#ref = concurrent.AtomicRef.make();
    return;
  }

}

class BDef extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BDef.type$; }

  #symbol = null;

  symbol() { return this.#symbol; }

  __symbol(it) { if (it === undefined) return this.#symbol; else this.#symbol = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #libRef = null;

  libRef() { return this.#libRef; }

  __libRef(it) { if (it === undefined) return this.#libRef; else this.#libRef = it; }

  #aux = null;

  aux() { return this.#aux; }

  __aux(it) { if (it === undefined) return this.#aux; else this.#aux = it; }

  static make(symbol,libRef,meta,aux) {
    const $self = new BDef();
    BDef.make$($self,symbol,libRef,meta,aux);
    return $self;
  }

  static make$($self,symbol,libRef,meta,aux) {
    if (aux === undefined) aux = null;
    $self.#symbol = symbol;
    $self.#libRef = libRef;
    $self.#meta = meta;
    $self.#aux = ((this$) => { let $_u1 = aux; if ($_u1 == null) return null; return sys.ObjUtil.toImmutable(aux); })($self);
    return;
  }

}

class BFeature extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BFeature.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #nsRef = null;

  nsRef(it) {
    if (it === undefined) {
      return this.#nsRef;
    }
    else {
      this.#nsRef = it;
      return;
    }
  }

  static make(name,nsRef) {
    const $self = new BFeature();
    BFeature.make$($self,name,nsRef);
    return $self;
  }

  static make$($self,name,nsRef) {
    $self.#name = name;
    $self.#nsRef = nsRef;
    return;
  }

}

class MDef extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#inheritanceRef = concurrent.AtomicRef.make(null);
    return;
  }

  typeof() { return MDef.type$; }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  id() { return haystack.Dict.prototype.id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  #symbol = null;

  symbol() { return this.#symbol; }

  __symbol(it) { if (it === undefined) return this.#symbol; else this.#symbol = it; }

  #libRef = null;

  libRef() { return this.#libRef; }

  __libRef(it) { if (it === undefined) return this.#libRef; else this.#libRef = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #inheritanceRef = null;

  inheritanceRef() { return this.#inheritanceRef; }

  __inheritanceRef(it) { if (it === undefined) return this.#inheritanceRef; else this.#inheritanceRef = it; }

  static make(b) {
    const $self = new MDef();
    MDef.make$($self,b);
    return $self;
  }

  static make$($self,b) {
    ;
    $self.#symbol = b.symbol();
    $self.#libRef = b.libRef();
    $self.#meta = b.meta();
    return;
  }

  name() {
    return this.#symbol.name();
  }

  lib() {
    return sys.ObjUtil.coerce(this.#libRef.val(), haystack.Lib.type$);
  }

  toStr() {
    return this.#symbol.toStr();
  }

  equals(that) {
    return this === that;
  }

  get(n,def) {
    if (def === undefined) def = null;
    return this.#meta.get(n, def);
  }

  isEmpty() {
    return false;
  }

  has(n) {
    return this.#meta.has(n);
  }

  missing(n) {
    return this.#meta.missing(n);
  }

  each(f) {
    this.#meta.each(f);
    return;
  }

  eachWhile(f) {
    return this.#meta.eachWhile(f);
  }

  trap(n,a) {
    if (a === undefined) a = null;
    return this.#meta.trap(n, a);
  }

}

class MFiletype extends MDef {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MFiletype.type$; }

  isView() { return haystack.Filetype.prototype.isView.apply(this, arguments); }

  reader() { return haystack.Filetype.prototype.reader.apply(this, arguments); }

  hasReader() { return haystack.Filetype.prototype.hasReader.apply(this, arguments); }

  ioOpts() { return haystack.Filetype.prototype.ioOpts.apply(this, arguments); }

  icon() { return haystack.Filetype.prototype.icon.apply(this, arguments); }

  fileExt() { return haystack.Filetype.prototype.fileExt.apply(this, arguments); }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  hasWriter() { return haystack.Filetype.prototype.hasWriter.apply(this, arguments); }

  id() { return haystack.Dict.prototype.id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  isText() { return haystack.Filetype.prototype.isText.apply(this, arguments); }

  writerType() { return haystack.Filetype.prototype.writerType.apply(this, arguments); }

  readerType() { return haystack.Filetype.prototype.readerType.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  writer() { return haystack.Filetype.prototype.writer.apply(this, arguments); }

  #mimeType = null;

  mimeType() { return this.#mimeType; }

  __mimeType(it) { if (it === undefined) return this.#mimeType; else this.#mimeType = it; }

  static make(b) {
    const $self = new MFiletype();
    MFiletype.make$($self,b);
    return $self;
  }

  static make$($self,b) {
    MDef.make$($self, b);
    $self.#mimeType = sys.ObjUtil.coerce(sys.MimeType.fromStr(sys.ObjUtil.coerce($self.meta().trap("mime", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$)), sys.MimeType.type$);
    return;
  }

}

class MFeature extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#listCapacity = concurrent.AtomicInt.make(32);
    return;
  }

  typeof() { return MFeature.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #prefix = null;

  prefix() { return this.#prefix; }

  __prefix(it) { if (it === undefined) return this.#prefix; else this.#prefix = it; }

  #nsRef = null;

  // private field reflection only
  __nsRef(it) { if (it === undefined) return this.#nsRef; else this.#nsRef = it; }

  #listCapacity = null;

  // private field reflection only
  __listCapacity(it) { if (it === undefined) return this.#listCapacity; else this.#listCapacity = it; }

  static make(b) {
    const $self = new MFeature();
    MFeature.make$($self,b);
    return $self;
  }

  static make$($self,b) {
    ;
    $self.#name = b.name();
    $self.#prefix = sys.Str.plus($self.#name, ":");
    $self.#nsRef = b.nsRef();
    return;
  }

  overlay(overlayNsRef) {
    return sys.ObjUtil.coerce(sys.ObjUtil.typeof(this).make(sys.List.make(BFeature.type$, [BFeature.make(this.#name, overlayNsRef)])), MFeature.type$);
  }

  ns() {
    return sys.ObjUtil.coerce(this.#nsRef.val(), haystack.Namespace.type$);
  }

  self() {
    return sys.ObjUtil.coerce(this.ns().def(this.#name), haystack.Def.type$);
  }

  def(name,checked) {
    if (checked === undefined) checked = true;
    let def = this.ns().def(this.nameToSymbol(name), false);
    if (def != null) {
      return def;
    }
    ;
    if (checked) {
      throw this.createUnknownErr(name);
    }
    ;
    return null;
  }

  defs() {
    const this$ = this;
    let acc = this.allocList(this.#listCapacity.val());
    this.eachDef((def) => {
      acc.add(def);
      return;
    });
    this.#listCapacity.val(acc.size());
    return acc;
  }

  eachDef(f) {
    const this$ = this;
    this.ns().eachDef((def) => {
      if ((def.symbol().type().isKey() && sys.Str.startsWith(def.symbol().toStr(), this$.#prefix))) {
        sys.Func.call(f, def);
      }
      ;
      return;
    });
    return;
  }

  findDefs(f) {
    const this$ = this;
    let acc = this.allocList(32);
    this.eachDef((def) => {
      if (sys.Func.call(f, def)) {
        acc.add(def);
      }
      ;
      return;
    });
    return acc;
  }

  toGrid() {
    return haystack.Etc.makeDictsGrid(null, this.defs().sort());
  }

  isFiletype() {
    return false;
  }

  defType() {
    return haystack.Def.type$;
  }

  createDef(b) {
    return MDef.make(b);
  }

  createUnknownErr(name) {
    return haystack.UnknownDefErr.make(name);
  }

  allocList(capacity) {
    return sys.ObjUtil.coerce(sys.List.make(this.defType(), capacity), sys.Type.find("haystack::Def[]"));
  }

  nameToSymbol(name) {
    return sys.StrBuf.make(sys.Int.plus(sys.Str.size(this.#prefix), sys.Str.size(name))).add(this.#prefix).add(name).toStr();
  }

}

class MFiletypeFeature extends MFeature {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MFiletypeFeature.type$; }

  static make(b) {
    const $self = new MFiletypeFeature();
    MFiletypeFeature.make$($self,b);
    return $self;
  }

  static make$($self,b) {
    MFeature.make$($self, b);
    return;
  }

  isFiletype() {
    return true;
  }

  defType() {
    return haystack.Filetype.type$;
  }

  createDef(b) {
    return MFiletype.make(b);
  }

  createUnknownErr(name) {
    return haystack.UnknownFiletypeErr.make(name);
  }

}

class MLazy extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#conjunctsRef = concurrent.AtomicRef.make();
    this.#containedByRefsRef = concurrent.AtomicRef.make();
    this.#hasSubtypesCache = concurrent.ConcurrentMap.make();
    this.#associationsCache = concurrent.ConcurrentMap.make();
    this.#choicesCache = concurrent.ConcurrentMap.make();
    return;
  }

  typeof() { return MLazy.type$; }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #conjunctsRef = null;

  // private field reflection only
  __conjunctsRef(it) { if (it === undefined) return this.#conjunctsRef; else this.#conjunctsRef = it; }

  #containedByRefsRef = null;

  // private field reflection only
  __containedByRefsRef(it) { if (it === undefined) return this.#containedByRefsRef; else this.#containedByRefsRef = it; }

  #hasSubtypesCache = null;

  // private field reflection only
  __hasSubtypesCache(it) { if (it === undefined) return this.#hasSubtypesCache; else this.#hasSubtypesCache = it; }

  #associationsCache = null;

  // private field reflection only
  __associationsCache(it) { if (it === undefined) return this.#associationsCache; else this.#associationsCache = it; }

  #choicesCache = null;

  // private field reflection only
  __choicesCache(it) { if (it === undefined) return this.#choicesCache; else this.#choicesCache = it; }

  static make(ns) {
    const $self = new MLazy();
    MLazy.make$($self,ns);
    return $self;
  }

  static make$($self,ns) {
    ;
    $self.#ns = ns;
    return;
  }

  conjuncts() {
    let x = this.#conjunctsRef.val();
    if (x == null) {
      this.#conjunctsRef.val((x = this.initConjuncts()));
    }
    ;
    return sys.ObjUtil.coerce(x, sys.Type.find("haystack::Def[]"));
  }

  initConjuncts() {
    const this$ = this;
    let acc = this.#ns.findDefs((def) => {
      return def.symbol().type().isConjunct();
    });
    acc.sortr((a,b) => {
      return sys.ObjUtil.compare(a.symbol().size(), b.symbol().size());
    });
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc), sys.Type.find("haystack::Def[]"));
  }

  hasSubtypes(def) {
    let key = def.symbol().toStr();
    let r = this.#hasSubtypesCache.get(key);
    if (r == null) {
      this.#hasSubtypesCache.set(key, sys.ObjUtil.coerce((r = sys.ObjUtil.coerce(this.doHasSubtypes(def), sys.Obj.type$.toNullable())), sys.Obj.type$));
    }
    ;
    return sys.ObjUtil.coerce(r, sys.Bool.type$);
  }

  doHasSubtypes(def) {
    const this$ = this;
    return this.#ns.hasDefs((x) => {
      return this$.#ns.matchSubtype(def, x);
    });
  }

  associations(parent,assoc) {
    let key = sys.Str.plus(sys.Str.plus(sys.Str.plus("", parent.symbol()), "|"), assoc.symbol());
    let r = this.#associationsCache.get(key);
    if (r == null) {
      this.#associationsCache.set(key, sys.ObjUtil.coerce((r = this.doAssociations(parent, assoc)), sys.Obj.type$));
    }
    ;
    return sys.ObjUtil.coerce(r, sys.Type.find("haystack::Def[]"));
  }

  doAssociations(parent,assoc) {
    const this$ = this;
    if (assoc.missing("computedFromReciprocal")) {
      return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(DefUtil.resolveList(this.#ns, parent.get(assoc.name()))), sys.Type.find("haystack::Def[]"));
    }
    ;
    let reciprocalOf = sys.ObjUtil.as(assoc.get("reciprocalOf"), haystack.Symbol.type$);
    if (reciprocalOf == null) {
      throw sys.ArgErr.make("Computed association missing reciprocalOf");
    }
    ;
    let r = this.#ns.def(reciprocalOf.toStr());
    let matches = this.#ns.findDefs((d) => {
      let rv = this$.#ns.declared(d, r.name());
      if (rv == null) {
        return false;
      }
      ;
      return DefUtil.resolveList(this$.#ns, rv).any((x) => {
        return this$.#ns.fits(parent, x);
      });
    });
    if (matches.isEmpty()) {
      return sys.ObjUtil.coerce(haystack.Def.type$.emptyList(), sys.Type.find("haystack::Def[]"));
    }
    ;
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(matches), sys.Type.find("haystack::Def[]"));
  }

  containedByRefs() {
    let x = this.#containedByRefsRef.val();
    if (x == null) {
      this.#containedByRefsRef.val((x = this.initContainedByRefs()));
    }
    ;
    return sys.ObjUtil.coerce(x, sys.Type.find("haystack::Def[]"));
  }

  initContainedByRefs() {
    const this$ = this;
    let acc = this.#ns.findDefs((def) => {
      return (def.has("containedBy") && this$.#ns.fits(def, this$.#ns.quick().ref()));
    });
    acc.sort((a,b) => {
      return sys.ObjUtil.compare(a.symbol().toStr(), b.symbol().toStr());
    });
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc), sys.Type.find("haystack::Def[]"));
  }

}

class DefUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DefUtil.type$; }

  static #emptyEnum = undefined;

  static emptyEnum() {
    if (DefUtil.#emptyEnum === undefined) {
      DefUtil.static$init();
      if (DefUtil.#emptyEnum === undefined) DefUtil.#emptyEnum = null;
    }
    return DefUtil.#emptyEnum;
  }

  static parseEnumNames(enum$) {
    if (enum$ == null) {
      return sys.ObjUtil.coerce(sys.Str.type$.emptyList(), sys.Type.find("sys::Str[]"));
    }
    ;
    if ((sys.ObjUtil.is(enum$, sys.Str.type$) && !sys.Str.startsWith(sys.ObjUtil.toStr(enum$), "-"))) {
      return DefUtil.parseEnumSplitNames(sys.ObjUtil.coerce(enum$, sys.Str.type$));
    }
    ;
    return DefUtil.parseEnum(enum$).keys();
  }

  static parseEnum(enum$) {
    if (enum$ == null) {
      return DefUtil.emptyEnum();
    }
    ;
    if (sys.ObjUtil.is(enum$, haystack.Dict.type$)) {
      return DefUtil.parseEnumDict(sys.ObjUtil.coerce(enum$, haystack.Dict.type$));
    }
    ;
    if (sys.ObjUtil.is(enum$, sys.Type.find("sys::List"))) {
      return DefUtil.parseEnumList(sys.ObjUtil.coerce(enum$, sys.Type.find("sys::Str[]")));
    }
    ;
    if (sys.ObjUtil.is(enum$, haystack.Ref.type$)) {
      let $_u2 = sys.ObjUtil.toStr(enum$);
      if (sys.ObjUtil.equals($_u2, "ph::WeatherCondEnum")) {
        return DefUtil.parseEnum("unknown,clear,partlyCloudy,cloudy,showers,rain,thunderstorms,ice,flurries,snow");
      }
      else if (sys.ObjUtil.equals($_u2, "ph::WeatherDaytimeEnum")) {
        return DefUtil.parseEnum("nighttime,daytime");
      }
      else if (sys.ObjUtil.equals($_u2, "ph.points::RunEnum")) {
        return DefUtil.parseEnum("off,on");
      }
      else if (sys.ObjUtil.equals($_u2, "ph.points::OccupiedEnum")) {
        return DefUtil.parseEnum("unoccupied occupied");
      }
      ;
      sys.ObjUtil.echo(sys.Str.plus("WARN: xeto enum refs not supported yet: ", enum$));
      return DefUtil.emptyEnum();
    }
    ;
    let enumStr = sys.Str.trimStart(sys.ObjUtil.toStr(enum$));
    if (sys.Str.startsWith(enumStr, "-")) {
      return DefUtil.parseEnumFandoc(enumStr);
    }
    ;
    return DefUtil.parseEnumSplit(enumStr);
  }

  static parseEnumDict(dict) {
    const this$ = this;
    if (dict.isEmpty()) {
      return DefUtil.emptyEnum();
    }
    ;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Dict")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:haystack::Dict]"));
    dict.each((meta,key) => {
      acc.add(key, haystack.Etc.dictSet(sys.ObjUtil.coerce(meta, haystack.Dict.type$.toNullable()), "name", key));
      return;
    });
    return acc;
  }

  static parseEnumList(list) {
    const this$ = this;
    if (list.isEmpty()) {
      return DefUtil.emptyEnum();
    }
    ;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Dict")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:haystack::Dict]"));
    list.each((key) => {
      acc.add(key, haystack.Etc.makeDict1("name", key));
      return;
    });
    return acc;
  }

  static parseEnumFandoc(enum$) {
    const this$ = this;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Dict")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:haystack::Dict]"));
    let key = "";
    let doc = "";
    sys.Str.splitLines(enum$).each((line) => {
      (line = sys.Str.trim(line));
      if (sys.Str.isEmpty(line)) {
        return;
      }
      ;
      if (sys.Str.startsWith(line, "-")) {
        let colon = ((this$) => { let $_u3 = sys.Str.index(line, ":"); if ($_u3 != null) return $_u3; throw sys.Err.make(sys.Str.plus("Expecting '-key: doc', not: ", line)); })(this$);
        (key = sys.Str.trim(sys.Str.getRange(line, sys.Range.make(1, sys.ObjUtil.coerce(colon, sys.Int.type$), true))));
        (doc = sys.Str.trim(sys.Str.getRange(line, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1), -1))));
      }
      else {
        (doc = sys.Str.plus(sys.Str.plus(doc, "\n"), line));
      }
      ;
      acc.set(key, haystack.Etc.makeDict2("name", key, "doc", doc));
      return;
    });
    return acc;
  }

  static parseEnumSplit(enum$) {
    const this$ = this;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Dict")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:haystack::Dict]"));
    let keys = sys.Str.splitLines(enum$);
    if (sys.ObjUtil.equals(keys.size(), 1)) {
      (keys = sys.Str.split(enum$, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())));
    }
    ;
    keys.each((key) => {
      acc.add(key, haystack.Etc.makeDict1("name", key));
      return;
    });
    return acc;
  }

  static parseEnumSplitNames(enum$) {
    let keys = sys.Str.splitLines(enum$);
    if (sys.ObjUtil.equals(keys.size(), 1)) {
      (keys = sys.Str.split(enum$, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())));
    }
    ;
    return keys;
  }

  static eachTag(ns,term,f) {
    const this$ = this;
    if (term.symbol().type().isConjunct()) {
      term.symbol().eachPart((name) => {
        let tag = ns.def(name, false);
        if (tag != null) {
          sys.Func.call(f, sys.ObjUtil.coerce(tag, haystack.Def.type$));
        }
        ;
        return;
      });
    }
    else {
      sys.Func.call(f, term);
    }
    ;
    return;
  }

  static implement(ns,def) {
    const this$ = this;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Def")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:haystack::Def]"));
    DefUtil.eachTag(ns, def, (tag) => {
      acc.set(tag.name(), tag);
      return;
    });
    ns.inheritance(def).each((supertype) => {
      if (supertype.has("mandatory")) {
        DefUtil.eachTag(ns, supertype, (tag) => {
          acc.set(tag.name(), tag);
          return;
        });
      }
      ;
      return;
    });
    return acc.vals();
  }

  static union(reflects) {
    const this$ = this;
    if (reflects.isEmpty()) {
      return sys.ObjUtil.coerce(haystack.Def.type$.emptyList(), sys.Type.find("haystack::Def[]"));
    }
    ;
    if (sys.ObjUtil.equals(reflects.size(), 1)) {
      return reflects.get(0).defs();
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Symbol"), sys.Type.find("haystack::Def"));
    reflects.each((reflect) => {
      reflect.defs().each((def) => {
        acc.set(def.symbol(), def);
        return;
      });
      return;
    });
    return acc.vals();
  }

  static intersection(reflects) {
    const this$ = this;
    if (reflects.isEmpty()) {
      return sys.ObjUtil.coerce(haystack.Def.type$.emptyList(), sys.Type.find("haystack::Def[]"));
    }
    ;
    if (sys.ObjUtil.equals(reflects.size(), 1)) {
      return reflects.get(0).defs();
    }
    ;
    return reflects.get(0).defs().findAll((def) => {
      return reflects.all((r) => {
        return r.def(def.symbol().toStr(), false) != null;
      });
    });
  }

  static accumulate(a,b) {
    const this$ = this;
    let acc = sys.List.make(DefAccItem.type$);
    if (sys.ObjUtil.is(a, sys.Type.find("sys::List"))) {
      sys.ObjUtil.coerce(a, sys.Type.find("sys::List")).each((x) => {
        DefUtil.doAccumulate(acc, sys.ObjUtil.coerce(x, sys.Obj.type$));
        return;
      });
    }
    else {
      DefUtil.doAccumulate(acc, a);
    }
    ;
    if (sys.ObjUtil.is(b, sys.Type.find("sys::List"))) {
      sys.ObjUtil.coerce(b, sys.Type.find("sys::List")).each((x) => {
        DefUtil.doAccumulate(acc, sys.ObjUtil.coerce(x, sys.Obj.type$));
        return;
      });
    }
    else {
      DefUtil.doAccumulate(acc, b);
    }
    ;
    return acc.sort().map((x) => {
      return x.val();
    }, sys.Obj.type$.toNullable());
  }

  static doAccumulate(acc,val) {
    let item = DefAccItem.make(val);
    if (!acc.contains(item)) {
      acc.add(item);
    }
    ;
    return;
  }

  static isPassword(def) {
    const this$ = this;
    if (sys.ObjUtil.equals(def.symbol().name(), "password")) {
      return true;
    }
    ;
    let supers = sys.ObjUtil.as(def.get("is"), sys.Type.find("sys::List"));
    return (supers != null && supers.any((s) => {
      return sys.ObjUtil.equals(sys.ObjUtil.toStr(s), "password");
    }));
  }

  static expandMarkersToConjuncts(ns,markers) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    markers.each((m) => {
      acc.set(m.name(), haystack.Marker.val());
      return;
    });
    let dict = haystack.Etc.makeDict(acc);
    let matches = ns.lazy().conjuncts().findAll((c) => {
      return c.symbol().hasTerm(dict);
    });
    if (matches.isEmpty()) {
      return markers;
    }
    ;
    return matches.addAll(markers);
  }

  static termsToTags(terms) {
    const this$ = this;
    if (terms.isEmpty()) {
      return sys.ObjUtil.coerce(sys.Str.type$.emptyList(), sys.Type.find("sys::Str[]"));
    }
    ;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"));
    terms.each((term) => {
      if (term.symbol().type().isTag()) {
        acc.set(term.name(), term.name());
      }
      else {
        term.symbol().eachPart((tag) => {
          acc.set(tag, tag);
          return;
        });
      }
      ;
      return;
    });
    return acc.vals();
  }

  static findBaseDefs(ns,defs) {
    const this$ = this;
    let bySymbol = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Def")).setList(defs, (it) => {
      return it.symbol().toStr();
    });
    return defs.exclude((def) => {
      return ns.inheritance(def).any((x) => {
        return (x !== def && bySymbol.get(x.symbol().toStr()) != null);
      });
    });
  }

  static resolve(ns,val) {
    if (val == null) {
      return null;
    }
    ;
    return ns.def(sys.ObjUtil.toStr(val), false);
  }

  static resolveList(ns,val) {
    const this$ = this;
    if (val == null) {
      return sys.ObjUtil.coerce(haystack.Def.type$.emptyList(), sys.Type.find("haystack::Def[]"));
    }
    ;
    let acc = sys.List.make(haystack.Def.type$);
    if (!sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      (val = sys.List.make(sys.Obj.type$.toNullable(), [val]));
    }
    ;
    sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).each((item) => {
      let def = ns.def(sys.ObjUtil.toStr(item), false);
      if (def != null) {
        acc.add(sys.ObjUtil.coerce(def, haystack.Def.type$));
      }
      ;
      return;
    });
    return acc;
  }

  static make() {
    const $self = new DefUtil();
    DefUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    DefUtil.#emptyEnum = sys.ObjUtil.coerce(((this$) => { let $_u4 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Dict")); if ($_u4 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Dict"))); })(this), sys.Type.find("[sys::Str:haystack::Dict]"));
    return;
  }

}

class DefAccItem extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DefAccItem.type$; }

  #key = null;

  key(it) {
    if (it === undefined) {
      return this.#key;
    }
    else {
      this.#key = it;
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

  static make(val) {
    const $self = new DefAccItem();
    DefAccItem.make$($self,val);
    return $self;
  }

  static make$($self,val) {
    $self.#key = ((this$) => { if (sys.ObjUtil.is(val, haystack.Dict.type$)) return haystack.ZincWriter.valToStr(val); return val; })($self);
    $self.#val = val;
    return;
  }

  equals(that) {
    return sys.ObjUtil.equals(this.#key, sys.ObjUtil.coerce(that, DefAccItem.type$).#key);
  }

  compare(that) {
    return sys.ObjUtil.compare(this.#key, sys.ObjUtil.coerce(that, DefAccItem.type$).#key);
  }

}

class MFilterInference extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#cache = sys.List.make(MFilterInferenceSymbol.type$);
    return;
  }

  typeof() { return MFilterInference.type$; }

  #ns = null;

  // private field reflection only
  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #cur = null;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #cache = null;

  // private field reflection only
  __cache(it) { if (it === undefined) return this.#cache; else this.#cache = it; }

  static make(ns) {
    const $self = new MFilterInference();
    MFilterInference.make$($self,ns);
    return $self;
  }

  static make$($self,ns) {
    ;
    $self.#ns = ns;
    return;
  }

  isA(subject,symbol) {
    const this$ = this;
    if (sys.ObjUtil.equals(((this$) => { let $_u6=this$.#cur; return ($_u6==null) ? null : $_u6.symbol(); })(this), symbol)) {
      return this.#cur.matches(subject);
    }
    ;
    this.#cur = this.#cache.find((x) => {
      return sys.ObjUtil.equals(x.symbol(), symbol);
    });
    if (this.#cur == null) {
      this.#cur = MFilterInferenceSymbol.make(this.#ns, symbol);
      this.#cache.add(sys.ObjUtil.coerce(this.#cur, MFilterInferenceSymbol.type$));
    }
    ;
    return this.#cur.matches(subject);
  }

}

class MFilterInferenceSymbol extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MFilterInferenceSymbol.type$; }

  #symbol = null;

  symbol() { return this.#symbol; }

  __symbol(it) { if (it === undefined) return this.#symbol; else this.#symbol = it; }

  #descendants = null;

  // private field reflection only
  __descendants(it) { if (it === undefined) return this.#descendants; else this.#descendants = it; }

  static make(ns,symbol) {
    const $self = new MFilterInferenceSymbol();
    MFilterInferenceSymbol.make$($self,ns,symbol);
    return $self;
  }

  static make$($self,ns,symbol) {
    $self.#symbol = symbol;
    $self.#descendants = MFilterInferenceSymbol.findDescendants(ns, symbol);
    return;
  }

  static findDescendants(ns,symbol) {
    let def = ns.def(symbol.toStr(), false);
    if (def == null) {
      return sys.List.make(haystack.Symbol.type$, [symbol]);
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Symbol"));
    MFilterInferenceSymbol.doFindDescendants(acc, ns, sys.ObjUtil.coerce(def, haystack.Def.type$));
    return acc.vals();
  }

  static doFindDescendants(acc,ns,def) {
    const this$ = this;
    let key = def.symbol().toStr();
    if (acc.containsKey(key)) {
      return;
    }
    ;
    acc.set(key, def.symbol());
    ns.subtypes(def).each((kid) => {
      MFilterInferenceSymbol.doFindDescendants(acc, ns, kid);
      return;
    });
    return;
  }

  matches(subject) {
    const this$ = this;
    return this.#descendants.any((symbol) => {
      return symbol.hasTerm(subject);
    });
  }

}

class DefFactory extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DefFactory.type$; }

  createNamespace(b) {
    return MBuiltNamespace.make(b);
  }

  createFeature(b) {
    let $_u7 = b.name();
    if (sys.ObjUtil.equals($_u7, "lib")) {
      return MLibFeature.make(b);
    }
    else if (sys.ObjUtil.equals($_u7, "filetype")) {
      return MFiletypeFeature.make(b);
    }
    else {
      return MFeature.make(b);
    }
    ;
  }

  static make() {
    const $self = new DefFactory();
    DefFactory.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class MLib extends MDef {
  constructor() {
    super();
    const this$ = this;
    this.#indexRef = concurrent.AtomicInt.make();
    return;
  }

  typeof() { return MLib.type$; }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  id() { return haystack.Dict.prototype.id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  #indexRef = null;

  indexRef() { return this.#indexRef; }

  __indexRef(it) { if (it === undefined) return this.#indexRef; else this.#indexRef = it; }

  #baseUri = null;

  baseUri() { return this.#baseUri; }

  __baseUri(it) { if (it === undefined) return this.#baseUri; else this.#baseUri = it; }

  #version = null;

  version() { return this.#version; }

  __version(it) { if (it === undefined) return this.#version; else this.#version = it; }

  #depends = null;

  depends() { return this.#depends; }

  __depends(it) { if (it === undefined) return this.#depends; else this.#depends = it; }

  static make(b) {
    const $self = new MLib();
    MLib.make$($self,b);
    return $self;
  }

  static make$($self,b) {
    MDef.make$($self, b);
    ;
    $self.#baseUri = sys.ObjUtil.coerce($self.meta().trap("baseUri", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Uri.type$).plusSlash();
    $self.#version = sys.ObjUtil.coerce(sys.Version.fromStr(sys.ObjUtil.coerce($self.meta().trap("version", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$)), sys.Version.type$);
    $self.#depends = sys.ObjUtil.coerce(((this$) => { let $_u8 = sys.ObjUtil.coerce(((this$) => { if (this$.meta().has("depends")) return sys.List.make(haystack.Symbol.type$).addAll(sys.ObjUtil.coerce(this$.meta().get("depends"), sys.Type.find("haystack::Symbol[]"))); return haystack.Symbol.type$.emptyList(); })(this$), sys.Type.find("haystack::Symbol[]")); if ($_u8 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(((this$) => { if (this$.meta().has("depends")) return sys.List.make(haystack.Symbol.type$).addAll(sys.ObjUtil.coerce(this$.meta().get("depends"), sys.Type.find("haystack::Symbol[]"))); return haystack.Symbol.type$.emptyList(); })(this$), sys.Type.find("haystack::Symbol[]"))); })($self), sys.Type.find("haystack::Symbol[]"));
    return;
  }

  index() {
    return this.#indexRef.val();
  }

}

class MOverlayLib extends MLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MOverlayLib.type$; }

  #defs = null;

  defs() { return this.#defs; }

  __defs(it) { if (it === undefined) return this.#defs; else this.#defs = it; }

  #defsMap = null;

  // private field reflection only
  __defsMap(it) { if (it === undefined) return this.#defsMap; else this.#defsMap = it; }

  static make(b) {
    const $self = new MOverlayLib();
    MOverlayLib.make$($self,b);
    return $self;
  }

  static make$($self,b) {
    MLib.make$($self, BDef.make(b.symbol(), b.libRef(), b.meta()));
    b.libRef().val($self);
    b.defs().add($self);
    b.defsMap().add($self.symbol().toStr(), $self);
    $self.#defs = sys.ObjUtil.coerce(((this$) => { let $_u11 = b.defs(); if ($_u11 == null) return null; return sys.ObjUtil.toImmutable(b.defs()); })($self), sys.Type.find("haystack::Def[]"));
    $self.#defsMap = sys.ObjUtil.coerce(((this$) => { let $_u12 = b.defsMap(); if ($_u12 == null) return null; return sys.ObjUtil.toImmutable(b.defsMap()); })($self), sys.Type.find("[sys::Str:haystack::Def]"));
    return;
  }

  def(symbol,checked) {
    if (checked === undefined) checked = true;
    let def = this.#defsMap.get(symbol);
    if (def != null) {
      return def;
    }
    ;
    if (checked) {
      throw haystack.UnknownDefErr.make(sys.Str.toStr(symbol));
    }
    ;
    return null;
  }

  hasDef(symbol) {
    return this.#defsMap.get(symbol) != null;
  }

  eachDef(f) {
    this.#defsMap.each(f);
    return;
  }

}

class BOverlayLib extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#libRef = concurrent.AtomicRef.make();
    this.#defs = sys.List.make(haystack.Def.type$);
    this.#defsMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Def"));
    return;
  }

  typeof() { return BOverlayLib.type$; }

  #base = null;

  base() { return this.#base; }

  __base(it) { if (it === undefined) return this.#base; else this.#base = it; }

  #symbol = null;

  symbol() { return this.#symbol; }

  __symbol(it) { if (it === undefined) return this.#symbol; else this.#symbol = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #libRef = null;

  libRef() { return this.#libRef; }

  __libRef(it) { if (it === undefined) return this.#libRef; else this.#libRef = it; }

  #defs = null;

  defs(it) {
    if (it === undefined) {
      return this.#defs;
    }
    else {
      this.#defs = it;
      return;
    }
  }

  #defsMap = null;

  defsMap(it) {
    if (it === undefined) {
      return this.#defsMap;
    }
    else {
      this.#defsMap = it;
      return;
    }
  }

  static make(base,meta) {
    const $self = new BOverlayLib();
    BOverlayLib.make$($self,base,meta);
    return $self;
  }

  static make$($self,base,meta) {
    ;
    let symbol = sys.ObjUtil.coerce(meta.trap("def", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Symbol.type$);
    if ((!symbol.type().isKey() || sys.ObjUtil.compareNE(symbol.part(0), "lib"))) {
      throw sys.ArgErr.make(symbol.toStr());
    }
    ;
    $self.#base = base;
    $self.#symbol = symbol;
    $self.#meta = meta;
    return;
  }

  isDup(symbol) {
    return this.#defsMap.get(symbol) != null;
  }

  addDef(meta) {
    let def = this.toDef(meta);
    this.#defsMap.add(def.symbol().toStr(), def);
    this.#defs.add(def);
    return;
  }

  toDef(meta) {
    (meta = this.inherit(meta));
    let symbol = sys.ObjUtil.coerce(meta.trap("def", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Symbol.type$);
    let b = BDef.make(symbol, this.#libRef, meta);
    if (symbol.type().isKey()) {
      return this.toKey(b);
    }
    ;
    return this.toFallback(b);
  }

  inherit(meta) {
    const this$ = this;
    let supertypes = haystack.Symbol.toList(meta.get("is"));
    if (supertypes.isEmpty()) {
      return meta;
    }
    ;
    let acc = haystack.Etc.dictToMap(meta);
    supertypes.each((supertype) => {
      this$.inheritFrom(acc, this$.#base.def(supertype.toStr(), false));
      return;
    });
    return haystack.Etc.makeDict(acc);
  }

  inheritFrom(acc,supertype) {
    const this$ = this;
    if (supertype == null) {
      return;
    }
    ;
    supertype.each((v,n) => {
      let tag = this$.#base.def(n, false);
      if (tag == null) {
        return;
      }
      ;
      let cur = acc.get(n);
      if (cur == null) {
        if (tag.missing("noInherit")) {
          acc.set(n, v);
        }
        ;
      }
      else {
        if (tag.has("accumulate")) {
          acc.set(n, DefUtil.accumulate(sys.ObjUtil.coerce(cur, sys.Obj.type$), v));
        }
        ;
      }
      ;
      return;
    });
    return;
  }

  toKey(b) {
    let feature = this.toFeature(b.symbol().part(0));
    let def = feature.createDef(b);
    return sys.ObjUtil.coerce(def, MDef.type$);
  }

  toFeature(name) {
    return sys.ObjUtil.coerce(this.#base.feature(name), MFeature.type$);
  }

  toFallback(b) {
    return MDef.make(b);
  }

}

class MNamespace extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#ts = sys.DateTime.now(null);
    this.#tsKey = this.#ts.toLocale(haystack.Etc.tsKeyFormat());
    this.#lazy = MLazy.make(this);
    return;
  }

  typeof() { return MNamespace.type$; }

  #ts = null;

  ts() { return this.#ts; }

  __ts(it) { if (it === undefined) return this.#ts; else this.#ts = it; }

  #tsKey = null;

  tsKey() { return this.#tsKey; }

  __tsKey(it) { if (it === undefined) return this.#tsKey; else this.#tsKey = it; }

  #lazy = null;

  lazy() { return this.#lazy; }

  __lazy(it) { if (it === undefined) return this.#lazy; else this.#lazy = it; }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(this).name()), " ["), this.#tsKey), "]");
  }

  xeto() {
    return this.xetoGetter().get();
  }

  findDefs(f) {
    const this$ = this;
    let acc = sys.List.make(haystack.Def.type$);
    this.eachDef((def) => {
      if (sys.Func.call(f, def)) {
        acc.add(def);
      }
      ;
      return;
    });
    return acc;
  }

  hasDefs(f) {
    const this$ = this;
    return this.eachWhileDef((def) => {
      return ((this$) => { if (sys.Func.call(f, def)) return "break"; return null; })(this$);
    }) != null;
  }

  isFeature(def) {
    return this.feature(def.name(), false) != null;
  }

  fitsMarker(def) {
    return this.fits(def, this.quick().marker());
  }

  fitsVal(def) {
    return this.fits(def, this.quick().val());
  }

  fitsChoice(def) {
    return this.fits(def, this.quick().choice());
  }

  fitsEntity(def) {
    return this.fits(def, this.quick().entity());
  }

  fits(def,parent) {
    return this.inheritance(def).containsSame(parent);
  }

  defToKind(def) {
    let defs = this.inheritance(def);
    for (let i = 0; sys.ObjUtil.compareLT(i, defs.size()); i = sys.Int.increment(i)) {
      let kind = haystack.Kind.fromDefName(defs.get(i).name(), false);
      if (kind != null) {
        return sys.ObjUtil.coerce(kind, haystack.Kind.type$);
      }
      ;
    }
    ;
    return haystack.Kind.obj();
  }

  declared(def,name) {
    const this$ = this;
    let val = def.get(name);
    if (val == null) {
      return null;
    }
    ;
    let inherited = this.supertypes(def).any((s) => {
      return sys.ObjUtil.equals(s.get(name), val);
    });
    if (inherited) {
      return null;
    }
    ;
    return val;
  }

  supertypes(def) {
    return this.resolveList(def.get("is"));
  }

  subtypes(def) {
    const this$ = this;
    return this.findDefs((x) => {
      return this$.matchSubtype(def, x);
    });
  }

  hasSubtypes(def) {
    return this.#lazy.hasSubtypes(def);
  }

  matchSubtype(def,x) {
    const this$ = this;
    if (def === x) {
      return false;
    }
    ;
    if (x.symbol().type().isKey()) {
      return false;
    }
    ;
    let isSymbols = sys.ObjUtil.as(x.get("is"), sys.Type.find("sys::List"));
    if (isSymbols == null) {
      return false;
    }
    ;
    return isSymbols.any((it) => {
      return sys.ObjUtil.equals(it, def.symbol());
    });
  }

  inheritance(def) {
    let mdef = sys.ObjUtil.coerce(def, MDef.type$);
    let cached = mdef.inheritanceRef().val();
    if (cached != null) {
      return sys.ObjUtil.coerce(cached, sys.Type.find("haystack::Def[]"));
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Def"));
    acc.ordered(true);
    this.doInheritance(acc, def);
    mdef.inheritanceRef().val((cached = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc.vals()), sys.Type.find("haystack::Def[]"))));
    return sys.ObjUtil.coerce(cached, sys.Type.find("haystack::Def[]"));
  }

  inheritanceDepth(def) {
    let n = 0;
    let p = def;
    while (true) {
      (p = this.supertypes(sys.ObjUtil.coerce(p, haystack.Def.type$)).first());
      if (p == null) {
        break;
      }
      ;
      ((this$) => { let $_u14 = n;n = sys.Int.increment(n); return $_u14; })(this);
    }
    ;
    return n;
  }

  doInheritance(acc,def) {
    const this$ = this;
    let key = def.symbol().toStr();
    if (acc.get(key) != null) {
      return;
    }
    ;
    if (def.symbol().type().isTerm()) {
      acc.set(key, def);
    }
    ;
    this.supertypes(def).each((superkind) => {
      this$.doInheritance(acc, superkind);
      return;
    });
    return;
  }

  tags(parent) {
    return this.associations(parent, this.quick().tags());
  }

  associations(parent,assoc) {
    return this.#lazy.associations(parent, assoc);
  }

  kindDef(val,checked) {
    if (checked === undefined) checked = true;
    if (val != null) {
      let kind = this.quick().fromFixedType(sys.ObjUtil.typeof(val));
      if (kind != null) {
        return kind;
      }
      ;
      if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
        return this.quick().dict();
      }
      ;
      if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
        return this.quick().list();
      }
      ;
      if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
        return this.quick().grid();
      }
      ;
    }
    ;
    if (checked) {
      throw haystack.NotHaystackErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", val), " ["), ((this$) => { let $_u15 = val; if ($_u15 == null) return null; return sys.ObjUtil.typeof(val); })(this)), "]"));
    }
    ;
    return null;
  }

  implement(def) {
    return DefUtil.implement(this, def);
  }

  reflect(subject) {
    return MReflection.reflect(this, subject);
  }

  proto(parent,proto) {
    return sys.ObjUtil.coerce(MPrototyper.make(this, parent).generate(proto).first(), haystack.Dict.type$);
  }

  protos(parent) {
    return MPrototyper.make(this, parent).generate(null);
  }

  misc(name,checked) {
    if (checked === undefined) checked = true;
    if (checked) {
      throw haystack.UnknownNameErr.make(name);
    }
    ;
    return null;
  }

  eachMisc(f) {
    return;
  }

  symbolToUri(symbol) {
    let def = this.def(symbol, false);
    if (def == null) {
      return sys.Str.toUri(sys.Str.plus("http://localhost/def/dummy#", symbol));
    }
    ;
    let base = def.lib().baseUri().toStr();
    let ver = def.lib().version().toStr();
    let size = sys.Int.plus(sys.Int.plus(sys.Int.plus(sys.Int.plus(sys.Str.size(base), 1), sys.Str.size(ver)), 1), sys.Str.size(symbol));
    return sys.Str.toUri(sys.StrBuf.make(size).add(base).add(ver).addChar(35).add(symbol).toStr());
  }

  toGrid() {
    return haystack.Etc.makeDictsGrid(null, this.defs().sort());
  }

  dump(out) {
    if (out === undefined) out = sys.Env.cur().out();
    const this$ = this;
    out.printLine(sys.Str.plus(sys.Str.plus("--- ", this.toStr()), " ---"));
    this.defs().each((def) => {
      out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("", def), " is:"), def.get("is")));
      return;
    });
    out.flush();
    return;
  }

  resolveList(symbols) {
    const this$ = this;
    if (symbols == null) {
      return sys.ObjUtil.coerce(haystack.Def.type$.emptyList(), sys.Type.find("haystack::Def[]"));
    }
    ;
    if (sys.ObjUtil.is(symbols, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(symbols, sys.Type.find("sys::List")).map((symbol) => {
        return this$.resolve(sys.ObjUtil.coerce(symbol, haystack.Symbol.type$));
      }, haystack.Def.type$), sys.Type.find("haystack::Def[]"));
    }
    else {
      return sys.List.make(haystack.Def.type$, [this.resolve(sys.ObjUtil.coerce(symbols, haystack.Symbol.type$))]);
    }
    ;
  }

  resolve(symbol) {
    return sys.ObjUtil.coerce(this.def(symbol.toStr()), haystack.Def.type$);
  }

  isSkySpark() {
    return false;
  }

  static make() {
    const $self = new MNamespace();
    MNamespace.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class MOverlayNamespace extends MNamespace {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MOverlayNamespace.type$; }

  #base = null;

  base() { return this.#base; }

  __base(it) { if (it === undefined) return this.#base; else this.#base = it; }

  #olib = null;

  olib() { return this.#olib; }

  __olib(it) { if (it === undefined) return this.#olib; else this.#olib = it; }

  #enabled = null;

  // private field reflection only
  __enabled(it) { if (it === undefined) return this.#enabled; else this.#enabled = it; }

  #xetoGetter = null;

  xetoGetter() { return this.#xetoGetter; }

  __xetoGetter(it) { if (it === undefined) return this.#xetoGetter; else this.#xetoGetter = it; }

  #features = null;

  features() { return this.#features; }

  __features(it) { if (it === undefined) return this.#features; else this.#features = it; }

  #libsList = null;

  libsList() { return this.#libsList; }

  __libsList(it) { if (it === undefined) return this.#libsList; else this.#libsList = it; }

  #libsMap = null;

  libsMap() { return this.#libsMap; }

  __libsMap(it) { if (it === undefined) return this.#libsMap; else this.#libsMap = it; }

  #featuresMap = null;

  featuresMap() { return this.#featuresMap; }

  __featuresMap(it) { if (it === undefined) return this.#featuresMap; else this.#featuresMap = it; }

  static make(base,olib,xetoGetter,enabled) {
    const $self = new MOverlayNamespace();
    MOverlayNamespace.make$($self,base,olib,xetoGetter,enabled);
    return $self;
  }

  static make$($self,base,olib,xetoGetter,enabled) {
    const this$ = $self;
    MNamespace.make$($self);
    let ref = concurrent.AtomicRef.make($self);
    $self.#base = sys.ObjUtil.coerce(base, MBuiltNamespace.type$);
    $self.#olib = olib;
    $self.#xetoGetter = xetoGetter;
    $self.#enabled = sys.ObjUtil.coerce(((this$) => { let $_u16 = sys.ObjUtil.coerce(base.libsList().map((lib) => {
      return sys.Func.call(enabled, lib);
    }, sys.Bool.type$), sys.Type.find("sys::Bool[]")); if ($_u16 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(base.libsList().map((lib) => {
      return sys.Func.call(enabled, lib);
    }, sys.Bool.type$), sys.Type.find("sys::Bool[]"))); })($self), sys.Type.find("sys::Bool[]"));
    $self.#libsList = sys.ObjUtil.coerce(((this$) => { let $_u17 = MOverlayNamespace.toLibsList(base, this$.#enabled, olib); if ($_u17 == null) return null; return sys.ObjUtil.toImmutable(MOverlayNamespace.toLibsList(base, this$.#enabled, olib)); })($self), sys.Type.find("haystack::Lib[]"));
    $self.#libsMap = sys.ObjUtil.coerce(((this$) => { let $_u18 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Lib")).addList(this$.#libsList, (it) => {
      return it.name();
    }); if ($_u18 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Lib")).addList(this$.#libsList, (it) => {
      return it.name();
    })); })($self), sys.Type.find("[sys::Str:haystack::Lib]"));
    $self.#features = sys.ObjUtil.coerce(((this$) => { let $_u19 = sys.ObjUtil.coerce(base.features().map(sys.ObjUtil.coerce((f) => {
      return f.overlay(ref);
    }, sys.Type.find("|haystack::Feature,sys::Int->sys::Obj?|"))), sys.Type.find("haystack::Feature[]")); if ($_u19 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(base.features().map(sys.ObjUtil.coerce((f) => {
      return f.overlay(ref);
    }, sys.Type.find("|haystack::Feature,sys::Int->sys::Obj?|"))), sys.Type.find("haystack::Feature[]"))); })($self), sys.Type.find("haystack::Feature[]"));
    $self.#featuresMap = sys.ObjUtil.coerce(((this$) => { let $_u20 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Feature")).addList(this$.#features, (it) => {
      return it.name();
    }); if ($_u20 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Feature")).addList(this$.#features, (it) => {
      return it.name();
    })); })($self), sys.Type.find("[sys::Str:haystack::Feature]"));
    return;
  }

  static toLibsList(base,enabled,olib) {
    const this$ = this;
    let acc = base.libsList().findAll((lib) => {
      return enabled.get(lib.index());
    });
    if (olib != null) {
      acc.add(sys.ObjUtil.coerce(olib, haystack.Lib.type$));
    }
    ;
    return acc;
  }

  isEnabled(lib) {
    return this.#enabled.get(lib.index());
  }

  quick() {
    return this.#base.quick();
  }

  def(symbol,checked) {
    if (checked === undefined) checked = true;
    if (this.#olib != null) {
      let odef = this.#olib.def(symbol, false);
      if (odef != null) {
        return odef;
      }
      ;
    }
    ;
    let def = this.#base.def(symbol, false);
    if ((def != null && this.isEnabled(def.lib()))) {
      return def;
    }
    ;
    if (checked) {
      throw haystack.UnknownDefErr.make(sys.Str.toStr(symbol));
    }
    ;
    return null;
  }

  defs() {
    const this$ = this;
    let capacity = this.#base.defsMap().size();
    if (this.#olib != null) {
      capacity = sys.Int.plus(capacity, this.#olib.defs().size());
    }
    ;
    let acc = sys.List.make(haystack.Def.type$);
    acc.capacity(capacity);
    this.eachDef((def) => {
      acc.add(def);
      return;
    });
    return acc;
  }

  eachDef(f) {
    const this$ = this;
    if (this.#olib != null) {
      this.#olib.defs().each(f);
    }
    ;
    this.#base.eachDef((def) => {
      if ((this$.#olib != null && this$.#olib.hasDef(def.symbol().toStr()))) {
        return;
      }
      ;
      if (this$.isEnabled(def.lib())) {
        sys.Func.call(f, def);
      }
      ;
      return;
    });
    return;
  }

  eachWhileDef(f) {
    const this$ = this;
    if (this.#olib != null) {
      let r = this.#olib.defs().eachWhile(f);
      if (r != null) {
        return r;
      }
      ;
    }
    ;
    return this.#base.eachWhileDef((def) => {
      if ((this$.#olib != null && this$.#olib.hasDef(def.symbol().toStr()))) {
        return null;
      }
      ;
      if (this$.isEnabled(def.lib())) {
        return sys.Func.call(f, def);
      }
      ;
      return null;
    });
  }

  feature(name,checked) {
    if (checked === undefined) checked = true;
    let f = this.#featuresMap.get(name);
    if (f != null) {
      return f;
    }
    ;
    if (checked) {
      throw haystack.UnknownFeatureErr.make(name);
    }
    ;
    return null;
  }

  lib(name,checked) {
    if (checked === undefined) checked = true;
    let f = this.#libsMap.get(name);
    if (f != null) {
      return f;
    }
    ;
    if (checked) {
      throw haystack.UnknownLibErr.make(name);
    }
    ;
    return null;
  }

  filetypes() {
    return this.#base.filetypes();
  }

  filetype(name,checked) {
    if (checked === undefined) checked = true;
    return this.#base.filetype(name, checked);
  }

}

class MPrototyper extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#processed = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj"));
    this.#results = sys.List.make(haystack.Dict.type$);
    return;
  }

  typeof() { return MPrototyper.type$; }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #parent = null;

  parent() { return this.#parent; }

  __parent(it) { if (it === undefined) return this.#parent; else this.#parent = it; }

  #parentReflect = null;

  parentReflect() { return this.#parentReflect; }

  __parentReflect(it) { if (it === undefined) return this.#parentReflect; else this.#parentReflect = it; }

  #flattenTagNames = null;

  // private field reflection only
  __flattenTagNames(it) { if (it === undefined) return this.#flattenTagNames; else this.#flattenTagNames = it; }

  #refTags = null;

  // private field reflection only
  __refTags(it) { if (it === undefined) return this.#refTags; else this.#refTags = it; }

  #processed = null;

  // private field reflection only
  __processed(it) { if (it === undefined) return this.#processed; else this.#processed = it; }

  #results = null;

  // private field reflection only
  __results(it) { if (it === undefined) return this.#results; else this.#results = it; }

  static make(ns,parent) {
    const $self = new MPrototyper();
    MPrototyper.make$($self,ns,parent);
    return $self;
  }

  static make$($self,ns,parent) {
    ;
    $self.#ns = ns;
    $self.#parent = parent;
    $self.#parentReflect = ns.reflect(parent);
    return;
  }

  generate(proto) {
    this.computeFlattenTags();
    this.computeRefTags();
    this.process(proto);
    return this.#results;
  }

  computeFlattenTags() {
    const this$ = this;
    let flattenTerms = sys.List.make(haystack.Def.type$);
    this.#parentReflect.defs().each((implemented) => {
      let cf = implemented.get("childrenFlatten");
      if (cf == null) {
        return;
      }
      ;
      DefUtil.resolveList(this$.#ns, cf).each((toFlatten) => {
        flattenTerms.addNotNull(this$.applyFlattenTag(this$.#parentReflect, toFlatten));
        return;
      });
      return;
    });
    this.#flattenTagNames = DefUtil.termsToTags(flattenTerms);
    return;
  }

  applyFlattenTag(parentReflect,toFlatten) {
    const this$ = this;
    if (!toFlatten.symbol().type().isTag()) {
      throw sys.Err.make(sys.Str.plus("Invalid childrenFlatten tag: ", toFlatten));
    }
    ;
    return parentReflect.defs().find((parentTerm) => {
      return this$.#ns.fits(parentTerm, toFlatten);
    });
  }

  computeRefTags() {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Ref"));
    let parentId = sys.ObjUtil.as(this.#parent.get("id"), haystack.Ref.type$);
    this.#ns.lazy().containedByRefs().each((refDef) => {
      let refName = refDef.name();
      let val = sys.ObjUtil.as(this$.#parent.get(refName), haystack.Ref.type$);
      if (val != null) {
        acc.set(refName, sys.ObjUtil.coerce(val, haystack.Ref.type$));
      }
      ;
      if (parentId != null) {
        let of$ = DefUtil.resolve(this$.#ns, refDef.get("containedBy"));
        if ((of$ != null && of$.symbol().hasTerm(this$.#parent))) {
          acc.set(refName, sys.ObjUtil.coerce(parentId, haystack.Ref.type$));
        }
        ;
      }
      ;
      return;
    });
    this.#refTags = acc;
    return;
  }

  process(proto) {
    if (proto != null) {
      this.processDict(sys.ObjUtil.coerce(proto, haystack.Dict.type$));
    }
    else {
      this.processReflect();
    }
    ;
    return;
  }

  processReflect() {
    const this$ = this;
    if (this.#parent.has("point")) {
      return;
    }
    ;
    this.#parentReflect.defs().each((def) => {
      let children = sys.ObjUtil.as(def.get("children"), sys.Type.find("sys::List"));
      if (children != null) {
        this$.processList(sys.ObjUtil.coerce(children, sys.Type.find("sys::Obj?[]")));
      }
      ;
      return;
    });
    return;
  }

  processList(children) {
    const this$ = this;
    children.each((x) => {
      if (!sys.ObjUtil.is(x, haystack.Dict.type$)) {
        return;
      }
      ;
      this$.processDict(sys.ObjUtil.coerce(x, haystack.Dict.type$));
      return;
    });
    return;
  }

  processDict(declared) {
    const this$ = this;
    let key = haystack.Etc.dictHashKey(declared);
    if (this.#processed.get(key) != null) {
      return;
    }
    ;
    this.#processed.set(key, key);
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj]"));
    this.#flattenTagNames.each((tagName) => {
      acc.set(tagName, haystack.Marker.val());
      return;
    });
    declared.each((v,n) => {
      acc.set(n, v);
      return;
    });
    this.addDis(acc);
    this.#refTags.each((v,n) => {
      acc.set(n, v);
      return;
    });
    this.#results.add(haystack.Etc.makeDict(acc));
    return;
  }

  addDis(acc) {
    const this$ = this;
    if (!this.#ns.isSkySpark()) {
      return;
    }
    ;
    if (acc.get("site") != null) {
      return;
    }
    ;
    let s = sys.StrBuf.make();
    let tag = "dis";
    acc.each((v,n) => {
      if (sys.ObjUtil.compareNE(v, haystack.Marker.val())) {
        return;
      }
      ;
      if ((sys.ObjUtil.equals(n, "space") || sys.ObjUtil.equals(n, "equip") || sys.ObjUtil.equals(n, "point"))) {
        (tag = "navName");
      }
      else {
        s.join(sys.Str.capitalize(n), "-");
      }
      ;
      return;
    });
    if ((s.isEmpty() || acc.get(tag) != null)) {
      return;
    }
    ;
    acc.set(tag, s.toStr());
    return;
  }

}

class XetoGetter {
  constructor() {
    const this$ = this;
  }

  typeof() { return XetoGetter.type$; }

}

class DefXetoGetter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DefXetoGetter.type$; }

  get() {
    return xeto.LibNamespace.system();
  }

  static make() {
    const $self = new DefXetoGetter();
    DefXetoGetter.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class UnsupportedXetoGetter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnsupportedXetoGetter.type$; }

  get() {
    throw sys.UnsupportedErr.make();
  }

  static make() {
    const $self = new UnsupportedXetoGetter();
    UnsupportedXetoGetter.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class MQuick extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MQuick.type$; }

  #ph = null;

  ph() { return this.#ph; }

  __ph(it) { if (it === undefined) return this.#ph; else this.#ph = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  #marker = null;

  marker() { return this.#marker; }

  __marker(it) { if (it === undefined) return this.#marker; else this.#marker = it; }

  #na = null;

  na() { return this.#na; }

  __na(it) { if (it === undefined) return this.#na; else this.#na = it; }

  #remove = null;

  remove() { return this.#remove; }

  __remove(it) { if (it === undefined) return this.#remove; else this.#remove = it; }

  #bool = null;

  bool() { return this.#bool; }

  __bool(it) { if (it === undefined) return this.#bool; else this.#bool = it; }

  #number = null;

  number() { return this.#number; }

  __number(it) { if (it === undefined) return this.#number; else this.#number = it; }

  #str = null;

  str() { return this.#str; }

  __str(it) { if (it === undefined) return this.#str; else this.#str = it; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #ref = null;

  ref() { return this.#ref; }

  __ref(it) { if (it === undefined) return this.#ref; else this.#ref = it; }

  #date = null;

  date() { return this.#date; }

  __date(it) { if (it === undefined) return this.#date; else this.#date = it; }

  #time = null;

  time() { return this.#time; }

  __time(it) { if (it === undefined) return this.#time; else this.#time = it; }

  #dateTime = null;

  dateTime() { return this.#dateTime; }

  __dateTime(it) { if (it === undefined) return this.#dateTime; else this.#dateTime = it; }

  #coord = null;

  coord() { return this.#coord; }

  __coord(it) { if (it === undefined) return this.#coord; else this.#coord = it; }

  #xstr = null;

  xstr() { return this.#xstr; }

  __xstr(it) { if (it === undefined) return this.#xstr; else this.#xstr = it; }

  #list = null;

  list() { return this.#list; }

  __list(it) { if (it === undefined) return this.#list; else this.#list = it; }

  #grid = null;

  grid() { return this.#grid; }

  __grid(it) { if (it === undefined) return this.#grid; else this.#grid = it; }

  #dict = null;

  dict() { return this.#dict; }

  __dict(it) { if (it === undefined) return this.#dict; else this.#dict = it; }

  #def = null;

  def() { return this.#def; }

  __def(it) { if (it === undefined) return this.#def; else this.#def = it; }

  #entity = null;

  entity() { return this.#entity; }

  __entity(it) { if (it === undefined) return this.#entity; else this.#entity = it; }

  #tags = null;

  tags() { return this.#tags; }

  __tags(it) { if (it === undefined) return this.#tags; else this.#tags = it; }

  #choice = null;

  choice() { return this.#choice; }

  __choice(it) { if (it === undefined) return this.#choice; else this.#choice = it; }

  static make(ns) {
    const $self = new MQuick();
    MQuick.make$($self,ns);
    return $self;
  }

  static make$($self,ns) {
    $self.#ph = sys.ObjUtil.coerce(ns.def("lib:ph"), haystack.Lib.type$);
    $self.#val = sys.ObjUtil.coerce(ns.def("val"), haystack.Def.type$);
    $self.#marker = sys.ObjUtil.coerce(ns.def("marker"), haystack.Def.type$);
    $self.#na = sys.ObjUtil.coerce(ns.def("na"), haystack.Def.type$);
    $self.#remove = sys.ObjUtil.coerce(ns.def("remove"), haystack.Def.type$);
    $self.#bool = sys.ObjUtil.coerce(ns.def("bool"), haystack.Def.type$);
    $self.#number = sys.ObjUtil.coerce(ns.def("number"), haystack.Def.type$);
    $self.#str = sys.ObjUtil.coerce(ns.def("str"), haystack.Def.type$);
    $self.#uri = sys.ObjUtil.coerce(ns.def("uri"), haystack.Def.type$);
    $self.#ref = sys.ObjUtil.coerce(ns.def("ref"), haystack.Def.type$);
    $self.#date = sys.ObjUtil.coerce(ns.def("date"), haystack.Def.type$);
    $self.#time = sys.ObjUtil.coerce(ns.def("time"), haystack.Def.type$);
    $self.#dateTime = sys.ObjUtil.coerce(ns.def("dateTime"), haystack.Def.type$);
    $self.#coord = sys.ObjUtil.coerce(ns.def("coord"), haystack.Def.type$);
    $self.#xstr = sys.ObjUtil.coerce(ns.def("xstr"), haystack.Def.type$);
    $self.#list = sys.ObjUtil.coerce(ns.def("list"), haystack.Def.type$);
    $self.#grid = sys.ObjUtil.coerce(ns.def("grid"), haystack.Def.type$);
    $self.#dict = sys.ObjUtil.coerce(ns.def("dict"), haystack.Def.type$);
    $self.#def = sys.ObjUtil.coerce(ns.def("def"), haystack.Def.type$);
    $self.#entity = sys.ObjUtil.coerce(ns.def("entity"), haystack.Def.type$);
    $self.#tags = sys.ObjUtil.coerce(ns.def("tags"), haystack.Def.type$);
    $self.#choice = sys.ObjUtil.coerce(ns.def("choice"), haystack.Def.type$);
    return;
  }

  fromFixedType(type) {
    if (type === haystack.Number.type$) {
      return this.#number;
    }
    ;
    if (type === haystack.Marker.type$) {
      return this.#marker;
    }
    ;
    if (type === sys.Str.type$) {
      return this.#str;
    }
    ;
    if (type === haystack.Ref.type$) {
      return this.#ref;
    }
    ;
    if (type === sys.DateTime.type$) {
      return this.#dateTime;
    }
    ;
    if (type === sys.Bool.type$) {
      return this.#bool;
    }
    ;
    if (type === haystack.NA.type$) {
      return this.#na;
    }
    ;
    if (type === haystack.Coord.type$) {
      return this.#coord;
    }
    ;
    if (type === sys.Uri.type$) {
      return this.#uri;
    }
    ;
    if (type === sys.Date.type$) {
      return this.#date;
    }
    ;
    if (type === sys.Time.type$) {
      return this.#time;
    }
    ;
    if (type === haystack.XStr.type$) {
      return this.#xstr;
    }
    ;
    if (type === haystack.Remove.type$) {
      return this.#remove;
    }
    ;
    return null;
  }

}

class MLibFeature extends MFeature {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MLibFeature.type$; }

  static make(b) {
    const $self = new MLibFeature();
    MLibFeature.make$($self,b);
    return $self;
  }

  static make$($self,b) {
    MFeature.make$($self, b);
    return;
  }

  defType() {
    return haystack.Lib.type$;
  }

  createDef(b) {
    return MLib.make(b);
  }

  createUnknownErr(name) {
    return haystack.UnknownLibErr.make(name);
  }

}

class MBuiltNamespace extends MNamespace {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MBuiltNamespace.type$; }

  #quick = null;

  quick() { return this.#quick; }

  __quick(it) { if (it === undefined) return this.#quick; else this.#quick = it; }

  #xetoGetter = null;

  xetoGetter() { return this.#xetoGetter; }

  __xetoGetter(it) { if (it === undefined) return this.#xetoGetter; else this.#xetoGetter = it; }

  #features = null;

  features() { return this.#features; }

  __features(it) { if (it === undefined) return this.#features; else this.#features = it; }

  #libsList = null;

  libsList() { return this.#libsList; }

  __libsList(it) { if (it === undefined) return this.#libsList; else this.#libsList = it; }

  #filetypes = null;

  filetypes() { return this.#filetypes; }

  __filetypes(it) { if (it === undefined) return this.#filetypes; else this.#filetypes = it; }

  #defsMap = null;

  defsMap() { return this.#defsMap; }

  __defsMap(it) { if (it === undefined) return this.#defsMap; else this.#defsMap = it; }

  #featuresMap = null;

  featuresMap() { return this.#featuresMap; }

  __featuresMap(it) { if (it === undefined) return this.#featuresMap; else this.#featuresMap = it; }

  #libsMap = null;

  libsMap() { return this.#libsMap; }

  __libsMap(it) { if (it === undefined) return this.#libsMap; else this.#libsMap = it; }

  #filetypesMap = null;

  filetypesMap() { return this.#filetypesMap; }

  __filetypesMap(it) { if (it === undefined) return this.#filetypesMap; else this.#filetypesMap = it; }

  static make(b) {
    const $self = new MBuiltNamespace();
    MBuiltNamespace.make$($self,b);
    return $self;
  }

  static make$($self,b) {
    MNamespace.make$($self);
    b.ref().val($self);
    $self.#xetoGetter = sys.ObjUtil.coerce(b.xetoGetter(), XetoGetter.type$);
    $self.#defsMap = sys.ObjUtil.coerce(((this$) => { let $_u21 = sys.ObjUtil.coerce(b.defsMap(), sys.Type.find("[sys::Str:haystack::Def]")); if ($_u21 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(b.defsMap(), sys.Type.find("[sys::Str:haystack::Def]"))); })($self), sys.Type.find("[sys::Str:haystack::Def]"));
    $self.#features = sys.ObjUtil.coerce(((this$) => { let $_u22 = sys.ObjUtil.coerce(b.features(), sys.Type.find("haystack::Feature[]")); if ($_u22 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(b.features(), sys.Type.find("haystack::Feature[]"))); })($self), sys.Type.find("haystack::Feature[]"));
    $self.#featuresMap = sys.ObjUtil.coerce(((this$) => { let $_u23 = sys.ObjUtil.coerce(b.featuresMap(), sys.Type.find("[sys::Str:haystack::Feature]")); if ($_u23 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(b.featuresMap(), sys.Type.find("[sys::Str:haystack::Feature]"))); })($self), sys.Type.find("[sys::Str:haystack::Feature]"));
    $self.#libsList = sys.ObjUtil.coerce(((this$) => { let $_u24 = sys.ObjUtil.coerce(b.libs(), sys.Type.find("haystack::Lib[]")); if ($_u24 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(b.libs(), sys.Type.find("haystack::Lib[]"))); })($self), sys.Type.find("haystack::Lib[]"));
    $self.#libsMap = sys.ObjUtil.coerce(((this$) => { let $_u25 = sys.ObjUtil.coerce(b.libsMap(), sys.Type.find("[sys::Str:haystack::Lib]")); if ($_u25 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(b.libsMap(), sys.Type.find("[sys::Str:haystack::Lib]"))); })($self), sys.Type.find("[sys::Str:haystack::Lib]"));
    $self.#filetypes = sys.ObjUtil.coerce(((this$) => { let $_u26 = sys.ObjUtil.coerce(b.filetypes(), sys.Type.find("haystack::Filetype[]")); if ($_u26 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(b.filetypes(), sys.Type.find("haystack::Filetype[]"))); })($self), sys.Type.find("haystack::Filetype[]"));
    $self.#filetypesMap = sys.ObjUtil.coerce(((this$) => { let $_u27 = sys.ObjUtil.coerce(b.filetypesMap(), sys.Type.find("[sys::Str:haystack::Filetype]")); if ($_u27 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(b.filetypesMap(), sys.Type.find("[sys::Str:haystack::Filetype]"))); })($self), sys.Type.find("[sys::Str:haystack::Filetype]"));
    $self.#quick = MQuick.make($self);
    return;
  }

  def(symbol,checked) {
    if (checked === undefined) checked = true;
    let def = this.#defsMap.get(symbol);
    if (def != null) {
      return def;
    }
    ;
    if (checked) {
      throw haystack.UnknownDefErr.make(sys.Str.toStr(symbol));
    }
    ;
    return null;
  }

  defs() {
    return this.#defsMap.vals();
  }

  eachDef(f) {
    this.#defsMap.each(f);
    return;
  }

  eachWhileDef(f) {
    return this.#defsMap.eachWhile(f);
  }

  feature(name,checked) {
    if (checked === undefined) checked = true;
    let f = this.#featuresMap.get(name);
    if (f != null) {
      return f;
    }
    ;
    if (checked) {
      throw haystack.UnknownFeatureErr.make(name);
    }
    ;
    return null;
  }

  lib(name,checked) {
    if (checked === undefined) checked = true;
    let f = this.#libsMap.get(name);
    if (f != null) {
      return f;
    }
    ;
    if (checked) {
      throw haystack.UnknownLibErr.make(name);
    }
    ;
    return null;
  }

  filetype(name,checked) {
    if (checked === undefined) checked = true;
    let f = this.#filetypesMap.get(name);
    if (f != null) {
      return f;
    }
    ;
    if (checked) {
      throw haystack.UnknownFiletypeErr.make(name);
    }
    ;
    return null;
  }

}

class RdfWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#libs = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Lib"));
    this.#refBaseUri = null;
    this.#nestedDicts = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Obj:sys::Obj?]")), sys.Type.find("[rdf::Iri:haystack::Dict]"));
    return;
  }

  typeof() { return RdfWriter.type$; }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  #ns = null;

  // private field reflection only
  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #libs = null;

  libs(it) {
    if (it === undefined) {
      return this.#libs;
    }
    else {
      this.#libs = it;
      return;
    }
  }

  #refBaseUri = null;

  // private field reflection only
  __refBaseUri(it) { if (it === undefined) return this.#refBaseUri; else this.#refBaseUri = it; }

  #nestedDicts = null;

  // private field reflection only
  __nestedDicts(it) { if (it === undefined) return this.#nestedDicts; else this.#nestedDicts = it; }

  static #owlClass = undefined;

  static owlClass() {
    if (RdfWriter.#owlClass === undefined) {
      RdfWriter.static$init();
      if (RdfWriter.#owlClass === undefined) RdfWriter.#owlClass = null;
    }
    return RdfWriter.#owlClass;
  }

  static #owlDatatypeProp = undefined;

  static owlDatatypeProp() {
    if (RdfWriter.#owlDatatypeProp === undefined) {
      RdfWriter.static$init();
      if (RdfWriter.#owlDatatypeProp === undefined) RdfWriter.#owlDatatypeProp = null;
    }
    return RdfWriter.#owlDatatypeProp;
  }

  static #owlObjectProp = undefined;

  static owlObjectProp() {
    if (RdfWriter.#owlObjectProp === undefined) {
      RdfWriter.static$init();
      if (RdfWriter.#owlObjectProp === undefined) RdfWriter.#owlObjectProp = null;
    }
    return RdfWriter.#owlObjectProp;
  }

  static #rdfType = undefined;

  static rdfType() {
    if (RdfWriter.#rdfType === undefined) {
      RdfWriter.static$init();
      if (RdfWriter.#rdfType === undefined) RdfWriter.#rdfType = null;
    }
    return RdfWriter.#rdfType;
  }

  static #rdfsSubClassOf = undefined;

  static rdfsSubClassOf() {
    if (RdfWriter.#rdfsSubClassOf === undefined) {
      RdfWriter.static$init();
      if (RdfWriter.#rdfsSubClassOf === undefined) RdfWriter.#rdfsSubClassOf = null;
    }
    return RdfWriter.#rdfsSubClassOf;
  }

  static #rdfsSubPropertyOf = undefined;

  static rdfsSubPropertyOf() {
    if (RdfWriter.#rdfsSubPropertyOf === undefined) {
      RdfWriter.static$init();
      if (RdfWriter.#rdfsSubPropertyOf === undefined) RdfWriter.#rdfsSubPropertyOf = null;
    }
    return RdfWriter.#rdfsSubPropertyOf;
  }

  static #rdfsDatatype = undefined;

  static rdfsDatatype() {
    if (RdfWriter.#rdfsDatatype === undefined) {
      RdfWriter.static$init();
      if (RdfWriter.#rdfsDatatype === undefined) RdfWriter.#rdfsDatatype = null;
    }
    return RdfWriter.#rdfsDatatype;
  }

  static #rdfsLiteral = undefined;

  static rdfsLiteral() {
    if (RdfWriter.#rdfsLiteral === undefined) {
      RdfWriter.static$init();
      if (RdfWriter.#rdfsLiteral === undefined) RdfWriter.#rdfsLiteral = null;
    }
    return RdfWriter.#rdfsLiteral;
  }

  static #rdfsDomain = undefined;

  static rdfsDomain() {
    if (RdfWriter.#rdfsDomain === undefined) {
      RdfWriter.static$init();
      if (RdfWriter.#rdfsDomain === undefined) RdfWriter.#rdfsDomain = null;
    }
    return RdfWriter.#rdfsDomain;
  }

  static #rdfsRange = undefined;

  static rdfsRange() {
    if (RdfWriter.#rdfsRange === undefined) {
      RdfWriter.static$init();
      if (RdfWriter.#rdfsRange === undefined) RdfWriter.#rdfsRange = null;
    }
    return RdfWriter.#rdfsRange;
  }

  static #rdfsLabel = undefined;

  static rdfsLabel() {
    if (RdfWriter.#rdfsLabel === undefined) {
      RdfWriter.static$init();
      if (RdfWriter.#rdfsLabel === undefined) RdfWriter.#rdfsLabel = null;
    }
    return RdfWriter.#rdfsLabel;
  }

  #binIri$Store = undefined;

  // private field reflection only
  __binIri$Store(it) { if (it === undefined) return this.#binIri$Store; else this.#binIri$Store = it; }

  #coordIri$Store = undefined;

  // private field reflection only
  __coordIri$Store(it) { if (it === undefined) return this.#coordIri$Store; else this.#coordIri$Store = it; }

  #markerIri$Store = undefined;

  // private field reflection only
  __markerIri$Store(it) { if (it === undefined) return this.#markerIri$Store; else this.#markerIri$Store = it; }

  #naIri$Store = undefined;

  // private field reflection only
  __naIri$Store(it) { if (it === undefined) return this.#naIri$Store; else this.#naIri$Store = it; }

  #numberIri$Store = undefined;

  // private field reflection only
  __numberIri$Store(it) { if (it === undefined) return this.#numberIri$Store; else this.#numberIri$Store = it; }

  #refIri$Store = undefined;

  // private field reflection only
  __refIri$Store(it) { if (it === undefined) return this.#refIri$Store; else this.#refIri$Store = it; }

  #xstrIri$Store = undefined;

  // private field reflection only
  __xstrIri$Store(it) { if (it === undefined) return this.#xstrIri$Store; else this.#xstrIri$Store = it; }

  #dictIri$Store = undefined;

  // private field reflection only
  __dictIri$Store(it) { if (it === undefined) return this.#dictIri$Store; else this.#dictIri$Store = it; }

  #gridIri$Store = undefined;

  // private field reflection only
  __gridIri$Store(it) { if (it === undefined) return this.#gridIri$Store; else this.#gridIri$Store = it; }

  static make(out,opts) {
    const $self = new RdfWriter();
    RdfWriter.make$($self,out,opts);
    return $self;
  }

  static make$($self,out,opts) {
    if (opts === undefined) opts = null;
    ;
    if (opts == null) {
      (opts = haystack.Etc.emptyDict());
    }
    ;
    $self.#out = out;
    $self.#ns = sys.ObjUtil.coerce(((this$) => { let $_u28 = sys.ObjUtil.as(opts.get("ns"), haystack.Namespace.type$); if ($_u28 != null) return $_u28; throw sys.ArgErr.make("Opts must include ns"); })($self), haystack.Namespace.type$);
    out.setNs("owl", "http://www.w3.org/2002/07/owl#");
    return;
  }

  binIri() {
    if (this.#binIri$Store === undefined) {
      this.#binIri$Store = this.binIri$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#binIri$Store, rdf.Iri.type$);
  }

  coordIri() {
    if (this.#coordIri$Store === undefined) {
      this.#coordIri$Store = this.coordIri$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#coordIri$Store, rdf.Iri.type$);
  }

  markerIri() {
    if (this.#markerIri$Store === undefined) {
      this.#markerIri$Store = this.markerIri$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#markerIri$Store, rdf.Iri.type$);
  }

  naIri() {
    if (this.#naIri$Store === undefined) {
      this.#naIri$Store = this.naIri$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#naIri$Store, rdf.Iri.type$);
  }

  numberIri() {
    if (this.#numberIri$Store === undefined) {
      this.#numberIri$Store = this.numberIri$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#numberIri$Store, rdf.Iri.type$);
  }

  refIri() {
    if (this.#refIri$Store === undefined) {
      this.#refIri$Store = this.refIri$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#refIri$Store, rdf.Iri.type$);
  }

  xstrIri() {
    if (this.#xstrIri$Store === undefined) {
      this.#xstrIri$Store = this.xstrIri$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#xstrIri$Store, rdf.Iri.type$);
  }

  dictIri() {
    if (this.#dictIri$Store === undefined) {
      this.#dictIri$Store = this.dictIri$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#dictIri$Store, rdf.Iri.type$);
  }

  gridIri() {
    if (this.#gridIri$Store === undefined) {
      this.#gridIri$Store = this.gridIri$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#gridIri$Store, rdf.Iri.type$);
  }

  writeGrid(grid) {
    const this$ = this;
    this.inspectSymbols(grid);
    this.writePrefixes(grid);
    this.writeSyntheticStmts();
    grid.each((row) => {
      this$.writeOntology(row);
      this$.writeDict(row);
      this$.writeNested();
      return;
    });
    this.#out.finish();
    return this;
  }

  writePrefixes(grid) {
    const this$ = this;
    this.#libs.each((lib) => {
      let iri = this$.symbolIri(lib.symbol());
      this$.#out.setNs(lib.name(), iri.ns());
      return;
    });
    this.#refBaseUri = ((this$) => { let $_u29 = grid.meta().get("refBaseUri"); if ($_u29 == null) return null; return sys.ObjUtil.toStr(grid.meta().get("refBaseUri")); })(this);
    if (this.#refBaseUri != null) {
      this.#out.setNs("ref", sys.ObjUtil.coerce(this.#refBaseUri, sys.Str.type$));
    }
    ;
    return;
  }

  writeSyntheticStmts() {
    let hasTag = rdf.Iri.make("ph:hasTag");
    this.#out.writeStmt(hasTag, RdfWriter.rdfType(), RdfWriter.owlObjectProp());
    this.#out.writeStmt(hasTag, RdfWriter.rdfsRange(), this.markerIri());
    return;
  }

  writeNested() {
    while (!this.#nestedDicts.isEmpty()) {
      let subject = this.#nestedDicts.keys().first();
      let dict = this.#nestedDicts.remove(sys.ObjUtil.coerce(subject, rdf.Iri.type$));
      this.writeInstOntology(sys.ObjUtil.coerce(dict, haystack.Dict.type$), subject);
      this.writeDict(sys.ObjUtil.coerce(dict, haystack.Dict.type$), subject);
    }
    ;
    return;
  }

  writeOntology(dict) {
    let symbol = sys.ObjUtil.as(dict.get("def"), haystack.Symbol.type$);
    if (symbol != null) {
      this.writeDefOntology(sys.ObjUtil.coerce(symbol, haystack.Symbol.type$), dict);
    }
    else {
      this.writeInstOntology(dict);
    }
    ;
    return;
  }

  writeDefOntology(symbol,dict) {
    const this$ = this;
    let def = this.#ns.def(symbol.toStr());
    let choice = this.#ns.def("choice");
    let subj = this.toSubject(dict);
    if (this.#ns.fitsMarker(sys.ObjUtil.coerce(def, haystack.Def.type$))) {
      this.#out.writeStmt(subj, RdfWriter.rdfType(), RdfWriter.owlClass());
      this.#ns.supertypes(sys.ObjUtil.coerce(def, haystack.Def.type$)).each((superDef) => {
        this$.writeStmt(subj, RdfWriter.rdfsSubClassOf(), superDef.symbol());
        return;
      });
    }
    else {
      if (this.#ns.fits(sys.ObjUtil.coerce(def, haystack.Def.type$), sys.ObjUtil.coerce(choice, haystack.Def.type$))) {
        if (sys.ObjUtil.equals(def, choice)) {
          return;
        }
        ;
        let of$ = sys.ObjUtil.as(def.get("of"), haystack.Symbol.type$);
        if (of$ == null) {
          return;
        }
        ;
        this.#out.writeStmt(subj, RdfWriter.rdfType(), RdfWriter.owlObjectProp());
        this.writeStmt(subj, RdfWriter.rdfsRange(), sys.ObjUtil.coerce(of$, sys.Obj.type$));
      }
      else {
        if (this.#ns.fitsVal(sys.ObjUtil.coerce(def, haystack.Def.type$))) {
          if (sys.ObjUtil.equals(def, this.#ns.def("val"))) {
            return;
          }
          ;
          if (this.isScalar(sys.ObjUtil.coerce(def, haystack.Def.type$))) {
            this.#out.writeStmt(subj, RdfWriter.rdfType(), RdfWriter.owlDatatypeProp());
            this.#out.writeStmt(subj, RdfWriter.rdfsSubClassOf(), RdfWriter.toDatatype(sys.ObjUtil.coerce(def, haystack.Def.type$)));
          }
          else {
            let symbolType = def.symbol().type();
            let propType = ((this$) => { if (this$.isRef(sys.ObjUtil.coerce(def, haystack.Def.type$))) return RdfWriter.owlObjectProp(); return RdfWriter.owlDatatypeProp(); })(this);
            this.#out.writeStmt(subj, RdfWriter.rdfType(), propType);
            DefUtil.resolveList(this.#ns, def.get("tagOn")).each((entityDef) => {
              this$.writeStmt(subj, RdfWriter.rdfsDomain(), entityDef.symbol());
              return;
            });
            this.writeStmt(subj, RdfWriter.rdfsRange(), this.toRange(sys.ObjUtil.coerce(def, haystack.Def.type$)));
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

  isScalar(def) {
    return this.#ns.supertypes(def).contains(sys.ObjUtil.coerce(this.#ns.def("scalar"), haystack.Def.type$));
  }

  isRef(def) {
    return this.#ns.fits(def, sys.ObjUtil.coerce(this.#ns.def("ref"), haystack.Def.type$));
  }

  toRange(def) {
    const this$ = this;
    if (this.isRef(def)) {
      return sys.ObjUtil.coerce(((this$) => { let $_u31 = def.get("of"); if ($_u31 != null) return $_u31; return this$.#ns.def("entity").symbol(); })(this), haystack.Symbol.type$);
    }
    ;
    let inheritance = this.#ns.inheritance(def);
    let kind = inheritance.find((it) => {
      return this$.isScalar(it);
    });
    if (kind == null) {
      (kind = inheritance.find((it) => {
        return this$.#ns.supertypes(it).contains(sys.ObjUtil.coerce(this$.#ns.def("val"), haystack.Def.type$));
      }));
    }
    ;
    if (kind == null) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot determine range for ", def), ". Inheritance: "), inheritance));
    }
    ;
    return kind.symbol();
  }

  static toDatatype(def) {
    let $_u32 = def.name();
    if (sys.ObjUtil.equals($_u32, "bool")) {
      return rdf.Xsd.boolean();
    }
    else if (sys.ObjUtil.equals($_u32, "curVal")) {
      return RdfWriter.rdfsLiteral();
    }
    else if (sys.ObjUtil.equals($_u32, "date")) {
      return rdf.Xsd.date();
    }
    else if (sys.ObjUtil.equals($_u32, "dateTime")) {
      return rdf.Xsd.dateTime();
    }
    else if (sys.ObjUtil.equals($_u32, "number")) {
      return rdf.Xsd.double();
    }
    else if (sys.ObjUtil.equals($_u32, "ref")) {
      return rdf.Xsd.anyURI();
    }
    else if (sys.ObjUtil.equals($_u32, "symbol")) {
      return rdf.Xsd.anyURI();
    }
    else if (sys.ObjUtil.equals($_u32, "time")) {
      return rdf.Xsd.time();
    }
    else if (sys.ObjUtil.equals($_u32, "uri")) {
      return rdf.Xsd.anyURI();
    }
    else if (sys.ObjUtil.equals($_u32, "writeVal")) {
      return RdfWriter.rdfsLiteral();
    }
    else {
      return rdf.Xsd.string();
    }
    ;
  }

  writeInstOntology(dict,subject) {
    if (subject === undefined) subject = null;
    const this$ = this;
    let subj = ((this$) => { let $_u33 = subject; if ($_u33 != null) return $_u33; return this$.toSubject(dict); })(this);
    let types = this.#ns.reflect(dict).entityTypes();
    types.each((def) => {
      this$.writeStmt(sys.ObjUtil.coerce(subj, rdf.Iri.type$), RdfWriter.rdfType(), def.symbol());
      return;
    });
    dict.each((val,tagName) => {
      if (val !== haystack.Marker.val()) {
        return;
      }
      ;
      let typeDef = this$.#ns.def(tagName, false);
      if (typeDef == null) {
        return;
      }
      ;
      this$.writeStmt(sys.ObjUtil.coerce(subj, rdf.Iri.type$), rdf.Iri.make("ph:hasTag"), typeDef.symbol());
      return;
    });
    return;
  }

  writeDict(dict,subject) {
    if (subject === undefined) subject = null;
    const this$ = this;
    let subj = ((this$) => { let $_u34 = subject; if ($_u34 != null) return $_u34; return this$.toSubject(dict); })(this);
    let isInst = subj.isBlankNode();
    this.writeStmt(sys.ObjUtil.coerce(subj, rdf.Iri.type$), RdfWriter.rdfsLabel(), sys.ObjUtil.coerce(dict.dis(), sys.Obj.type$));
    dict.each((val,tagName) => {
      if ((isInst && val === haystack.Marker.val())) {
        return;
      }
      ;
      if (RdfWriter.isIdTag(tagName)) {
        return;
      }
      ;
      let pred = this$.toPredicate(tagName);
      if (pred == null) {
        return;
      }
      ;
      this$.writeStmt(sys.ObjUtil.coerce(subj, rdf.Iri.type$), sys.ObjUtil.coerce(pred, rdf.Iri.type$), val);
      return;
    });
    return;
  }

  static isIdTag(tagName) {
    return (sys.ObjUtil.equals("id", tagName) || sys.ObjUtil.equals("def", tagName));
  }

  toSubject(dict) {
    let id = sys.ObjUtil.as(dict.get("id"), haystack.Ref.type$);
    if (id != null) {
      return this.refToIri(sys.ObjUtil.coerce(id, haystack.Ref.type$));
    }
    ;
    let symbol = sys.ObjUtil.as(dict.get("def"), haystack.Symbol.type$);
    if (symbol != null) {
      return this.symbolIri(sys.ObjUtil.coerce(symbol, haystack.Symbol.type$));
    }
    ;
    return rdf.Iri.bnode();
  }

  toPredicate(tagName) {
    let def = this.#ns.def(tagName, false);
    if (def == null) {
      return rdf.Iri.bnode(tagName);
    }
    ;
    if (sys.ObjUtil.equals(def, this.#ns.def("doc"))) {
      return rdf.Iri.make("rdfs:comment");
    }
    ;
    return this.symbolIri(def.symbol());
  }

  writeStmt(subj,pred,val) {
    const this$ = this;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      sys.ObjUtil.as(val, sys.Type.find("sys::List")).each((elem) => {
        this$.writeStmt(subj, pred, sys.ObjUtil.coerce(elem, sys.Obj.type$));
        return;
      });
      return;
    }
    ;
    let kind = haystack.Kind.fromVal(val, false);
    let object = val;
    let type = null;
    if (haystack.Kind.marker() === kind) {
      (object = this.markerIri());
    }
    else {
      if (haystack.Kind.number() === kind) {
        let num = sys.ObjUtil.as(val, haystack.Number.type$);
        (object = ((this$) => { if (num.isInt()) return sys.ObjUtil.coerce(num.toInt(), sys.Num.type$); return sys.ObjUtil.coerce(num.toFloat(), sys.Num.type$); })(this));
      }
      else {
        if (haystack.Kind.ref() === kind) {
          (object = this.refToIri(sys.ObjUtil.coerce(object, haystack.Ref.type$)));
        }
        else {
          if (haystack.Kind.symbol() === kind) {
            (object = this.symbolIri(sys.ObjUtil.coerce(val, haystack.Symbol.type$)));
          }
          else {
            if (haystack.Kind.coord() === kind) {
              (type = this.coordIri());
            }
            else {
              if (haystack.Kind.na() === kind) {
                (object = this.naIri());
              }
              else {
                if (haystack.Kind.bin() === kind) {
                  (type = this.binIri());
                }
                else {
                  if (haystack.Kind.xstr() === kind) {
                    (type = this.xstrIri());
                  }
                  else {
                    if (haystack.Kind.dict() === kind) {
                      let dict = sys.ObjUtil.coerce(val, haystack.Dict.type$);
                      let dictSubj = this.toSubject(dict);
                      this.#nestedDicts.set(dictSubj, dict);
                      return this.writeStmt(subj, pred, dictSubj);
                    }
                    else {
                      if (haystack.Kind.grid() === kind) {
                        let x = haystack.XStr.make("ZincGrid", haystack.ZincWriter.gridToStr(sys.ObjUtil.coerce(val, haystack.Grid.type$)));
                        return this.writeStmt(subj, pred, x);
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
    this.#out.writeStmt(subj, pred, object, type);
    return;
  }

  inspectSymbols(grid) {
    const this$ = this;
    this.mapDef("val");
    grid.cols().each((col) => {
      this$.mapDef(col.name());
      return;
    });
    grid.each((row) => {
      row.each((val,tag) => {
        this$.mapVal(val);
        return;
      });
      return;
    });
    return;
  }

  mapDef(symbol) {
    let def = this.#ns.def(symbol, false);
    if (def == null) {
      return;
    }
    ;
    this.#libs.set(def.lib().name(), def.lib());
    return;
  }

  mapVal(val) {
    const this$ = this;
    if (sys.ObjUtil.is(val, haystack.Symbol.type$)) {
      this.mapDef(sys.ObjUtil.toStr(val));
    }
    else {
      if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
        sys.ObjUtil.as(val, sys.Type.find("sys::List")).each((elem) => {
          this$.mapVal(elem);
          return;
        });
      }
      ;
    }
    ;
    return;
  }

  symbolIri(symbol) {
    return rdf.Iri.makeUri(this.#ns.symbolToUri(symbol.toStr()));
  }

  refToIri(ref) {
    let id = ref.toProjRel().id();
    return ((this$) => { if (this$.#refBaseUri == null) return rdf.Iri.bnode(id); return rdf.Iri.makeNs(sys.ObjUtil.coerce(this$.#refBaseUri, sys.Str.type$), id); })(this);
  }

  binIri$Once() {
    return rdf.Iri.makeUri(this.#ns.symbolToUri("bin"));
  }

  coordIri$Once() {
    return rdf.Iri.makeUri(this.#ns.symbolToUri("coord"));
  }

  markerIri$Once() {
    return rdf.Iri.makeUri(this.#ns.symbolToUri("marker"));
  }

  naIri$Once() {
    return rdf.Iri.makeUri(this.#ns.symbolToUri("na"));
  }

  numberIri$Once() {
    return rdf.Iri.makeUri(this.#ns.symbolToUri("number"));
  }

  refIri$Once() {
    return rdf.Iri.makeUri(this.#ns.symbolToUri("ref"));
  }

  xstrIri$Once() {
    return rdf.Iri.makeUri(this.#ns.symbolToUri("xstr"));
  }

  dictIri$Once() {
    return rdf.Iri.makeUri(this.#ns.symbolToUri("dict"));
  }

  gridIri$Once() {
    return rdf.Iri.makeUri(this.#ns.symbolToUri("grid"));
  }

  static static$init() {
    RdfWriter.#owlClass = rdf.Iri.make("owl:Class");
    RdfWriter.#owlDatatypeProp = rdf.Iri.make("owl:DatatypeProperty");
    RdfWriter.#owlObjectProp = rdf.Iri.make("owl:ObjectProperty");
    RdfWriter.#rdfType = rdf.Iri.make("rdf:type");
    RdfWriter.#rdfsSubClassOf = rdf.Iri.make("rdfs:subClassOf");
    RdfWriter.#rdfsSubPropertyOf = rdf.Iri.make("rdfs:subPropertyOf");
    RdfWriter.#rdfsDatatype = rdf.Iri.make("rdfs:Datatype");
    RdfWriter.#rdfsLiteral = rdf.Iri.make("rdfs:Literal");
    RdfWriter.#rdfsDomain = rdf.Iri.make("rdfs:domain");
    RdfWriter.#rdfsRange = rdf.Iri.make("rdfs:range");
    RdfWriter.#rdfsLabel = rdf.Iri.make("rdfs:label");
    return;
  }

}

class TurtleWriter extends RdfWriter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TurtleWriter.type$; }

  static make(out,opts) {
    const $self = new TurtleWriter();
    TurtleWriter.make$($self,out,opts);
    return $self;
  }

  static make$($self,out,opts) {
    if (opts === undefined) opts = null;
    RdfWriter.make$($self, rdf.TurtleOutStream.make(out), opts);
    return;
  }

}

class JsonLdWriter extends RdfWriter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JsonLdWriter.type$; }

  static make(out,opts) {
    const $self = new JsonLdWriter();
    JsonLdWriter.make$($self,out,opts);
    return $self;
  }

  static make$($self,out,opts) {
    if (opts === undefined) opts = null;
    RdfWriter.make$($self, rdf.JsonLdOutStream.make(out), opts);
    return;
  }

}

const p = sys.Pod.add$('def');
const xp = sys.Param.noParams$();
let m;
MReflection.type$ = p.at$('MReflection','sys::Obj',['haystack::Reflection'],{'sys::NoDoc':"",'sys::Js':""},130,MReflection);
DefBuilder.type$ = p.at$('DefBuilder','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8192,DefBuilder);
BNamespace.type$ = p.at$('BNamespace','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8192,BNamespace);
BLib.type$ = p.at$('BLib','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},128,BLib);
BDef.type$ = p.at$('BDef','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8192,BDef);
BFeature.type$ = p.at$('BFeature','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8192,BFeature);
MDef.type$ = p.at$('MDef','sys::Obj',['haystack::Def'],{'sys::NoDoc':"",'sys::Js':""},8194,MDef);
MFiletype.type$ = p.at$('MFiletype','def::MDef',['haystack::Filetype'],{'sys::Js':""},130,MFiletype);
MFeature.type$ = p.at$('MFeature','sys::Obj',['haystack::Feature'],{'sys::NoDoc':"",'sys::Js':""},8194,MFeature);
MFiletypeFeature.type$ = p.at$('MFiletypeFeature','def::MFeature',[],{'sys::Js':""},130,MFiletypeFeature);
MLazy.type$ = p.at$('MLazy','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8194,MLazy);
DefUtil.type$ = p.at$('DefUtil','sys::Obj',[],{'sys::Js':""},8192,DefUtil);
DefAccItem.type$ = p.at$('DefAccItem','sys::Obj',[],{'sys::Js':""},128,DefAccItem);
MFilterInference.type$ = p.at$('MFilterInference','sys::Obj',['haystack::FilterInference'],{'sys::NoDoc':"",'sys::Js':""},8192,MFilterInference);
MFilterInferenceSymbol.type$ = p.at$('MFilterInferenceSymbol','sys::Obj',[],{'sys::Js':""},128,MFilterInferenceSymbol);
DefFactory.type$ = p.at$('DefFactory','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8194,DefFactory);
MLib.type$ = p.at$('MLib','def::MDef',['haystack::Lib'],{'sys::NoDoc':"",'sys::Js':""},8194,MLib);
MOverlayLib.type$ = p.at$('MOverlayLib','def::MLib',[],{'sys::NoDoc':"",'sys::Js':""},8194,MOverlayLib);
BOverlayLib.type$ = p.at$('BOverlayLib','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8192,BOverlayLib);
MNamespace.type$ = p.at$('MNamespace','sys::Obj',['haystack::Namespace'],{'sys::NoDoc':"",'sys::Js':""},8195,MNamespace);
MOverlayNamespace.type$ = p.at$('MOverlayNamespace','def::MNamespace',[],{'sys::NoDoc':"",'sys::Js':""},8194,MOverlayNamespace);
MPrototyper.type$ = p.at$('MPrototyper','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},128,MPrototyper);
XetoGetter.type$ = p.am$('XetoGetter','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8451,XetoGetter);
DefXetoGetter.type$ = p.at$('DefXetoGetter','sys::Obj',['def::XetoGetter'],{'sys::NoDoc':"",'sys::Js':""},8194,DefXetoGetter);
UnsupportedXetoGetter.type$ = p.at$('UnsupportedXetoGetter','sys::Obj',['def::XetoGetter'],{'sys::NoDoc':"",'sys::Js':""},8194,UnsupportedXetoGetter);
MQuick.type$ = p.at$('MQuick','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8194,MQuick);
MLibFeature.type$ = p.at$('MLibFeature','def::MFeature',[],{'sys::Js':""},130,MLibFeature);
MBuiltNamespace.type$ = p.at$('MBuiltNamespace','def::MNamespace',[],{'sys::NoDoc':"",'sys::Js':""},8194,MBuiltNamespace);
RdfWriter.type$ = p.at$('RdfWriter','sys::Obj',['haystack::GridWriter'],{'sys::NoDoc':"",'sys::Js':""},8193,RdfWriter);
TurtleWriter.type$ = p.at$('TurtleWriter','def::RdfWriter',[],{'sys::NoDoc':"",'sys::Js':""},8192,TurtleWriter);
JsonLdWriter.type$ = p.at$('JsonLdWriter','def::RdfWriter',[],{'sys::NoDoc':"",'sys::Js':""},8192,JsonLdWriter);
MReflection.type$.af$('ns',73730,'def::MNamespace',{}).af$('subject',336898,'haystack::Dict',{}).af$('defs',336898,'haystack::Def[]',{}).af$('entityTypesRef',67586,'concurrent::AtomicRef',{}).am$('reflect',40962,'def::MReflection',sys.List.make(sys.Param.type$,[new sys.Param('ns','def::MNamespace',false),new sys.Param('subject','haystack::Dict',false)]),{}).am$('matchConjunct',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('subject','haystack::Dict',false),new sys.Param('conjunct','haystack::Def',false)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','def::MNamespace',false),new sys.Param('subject','haystack::Dict',false),new sys.Param('defs','haystack::Def[]',false)]),{}).am$('def',271360,'haystack::Def?',sys.List.make(sys.Param.type$,[new sys.Param('symbol','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('fits',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('base','haystack::Def',false)]),{}).am$('entityTypes',271360,'haystack::Def[]',xp,{}).am$('computeEntityTypes',2048,'haystack::Def[]',xp,{}).am$('toGrid',271360,'haystack::Grid',xp,{});
DefBuilder.type$.af$('factory',73728,'def::DefFactory',{}).af$('xetoGetter',73728,'def::XetoGetter',{}).af$('defs',67584,'[sys::Str:haystack::Def]',{}).af$('libs',67584,'[sys::Str:def::BLib]',{}).af$('features',67584,'[sys::Str:def::MFeature]',{}).af$('filetypes',67584,'haystack::Filetype[]',{}).af$('filetypesMap',67584,'[sys::Str:haystack::Filetype]',{}).af$('nsRef',67584,'concurrent::AtomicRef',{}).am$('addDef',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('meta','haystack::Dict',false),new sys.Param('aux','sys::Obj?',true)]),{}).am$('toLib',2048,'def::BLib',sys.List.make(sys.Param.type$,[new sys.Param('meta','haystack::Dict',false)]),{}).am$('toDef',2048,'def::MDef',sys.List.make(sys.Param.type$,[new sys.Param('lib','def::BLib',false),new sys.Param('meta','haystack::Dict',false),new sys.Param('aux','sys::Obj?',false)]),{}).am$('toKey',2048,'def::MDef',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BDef',false)]),{}).am$('addFiletype',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','def::MFiletype',false)]),{}).am$('toFeature',2048,'def::MFeature',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('toFallback',2048,'def::MDef',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BDef',false)]),{}).am$('build',8192,'haystack::Namespace',xp,{}).am$('make',139268,'sys::Void',xp,{});
BNamespace.type$.af$('ref',73728,'concurrent::AtomicRef?',{}).af$('defsMap',73728,'[sys::Str:haystack::Def]?',{}).af$('features',73728,'haystack::Feature[]?',{}).af$('featuresMap',73728,'[sys::Str:haystack::Feature]?',{}).af$('libs',73728,'haystack::Lib[]?',{}).af$('libsMap',73728,'[sys::Str:haystack::Lib]?',{}).af$('filetypes',73728,'haystack::Filetype[]?',{}).af$('filetypesMap',73728,'[sys::Str:haystack::Filetype]?',{}).af$('xetoGetter',73728,'def::XetoGetter?',{}).am$('make',139268,'sys::Void',xp,{});
BLib.type$.af$('symbol',65666,'sys::Str',{}).af$('ref',65666,'concurrent::AtomicRef',{}).af$('defs',65664,'def::MDef[]',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('symbol','sys::Str',false)]),{});
BDef.type$.af$('symbol',73730,'haystack::Symbol',{}).af$('meta',73730,'haystack::Dict',{}).af$('libRef',73730,'concurrent::AtomicRef',{}).af$('aux',73730,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('symbol','haystack::Symbol',false),new sys.Param('libRef','concurrent::AtomicRef',false),new sys.Param('meta','haystack::Dict',false),new sys.Param('aux','sys::Obj?',true)]),{});
BFeature.type$.af$('name',73730,'sys::Str',{}).af$('nsRef',65664,'concurrent::AtomicRef',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('nsRef','concurrent::AtomicRef',false)]),{});
MDef.type$.af$('symbol',336898,'haystack::Symbol',{}).af$('libRef',65666,'concurrent::AtomicRef',{}).af$('meta',73730,'haystack::Dict',{}).af$('inheritanceRef',73730,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BDef',false)]),{}).am$('name',271360,'sys::Str',xp,{}).am$('lib',271360,'haystack::Lib',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('equals',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('has',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('missing',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('a','sys::Obj?[]?',true)]),{});
MFiletype.type$.af$('mimeType',336898,'sys::MimeType',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BDef',false)]),{});
MFeature.type$.af$('name',336898,'sys::Str',{}).af$('prefix',73730,'sys::Str',{}).af$('nsRef',67586,'concurrent::AtomicRef',{}).af$('listCapacity',67586,'concurrent::AtomicInt',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BFeature',false)]),{}).am$('overlay',128,'def::MFeature',sys.List.make(sys.Param.type$,[new sys.Param('overlayNsRef','concurrent::AtomicRef',false)]),{}).am$('ns',8192,'haystack::Namespace',xp,{}).am$('self',271360,'haystack::Def',xp,{}).am$('def',271360,'haystack::Def?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('defs',271360,'haystack::Def[]',xp,{}).am$('eachDef',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Def->sys::Void|',false)]),{}).am$('findDefs',271360,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Def->sys::Bool|',false)]),{}).am$('toGrid',9216,'haystack::Grid',xp,{}).am$('isFiletype',270336,'sys::Bool',xp,{}).am$('defType',270336,'sys::Type',xp,{}).am$('createDef',270336,'haystack::Def',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BDef',false)]),{}).am$('createUnknownErr',270336,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('allocList',2048,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('capacity','sys::Int',false)]),{}).am$('nameToSymbol',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{});
MFiletypeFeature.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BFeature',false)]),{}).am$('isFiletype',271360,'sys::Bool',xp,{}).am$('defType',271360,'sys::Type',xp,{}).am$('createDef',271360,'def::MDef',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BDef',false)]),{}).am$('createUnknownErr',271360,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{});
MLazy.type$.af$('ns',73730,'def::MNamespace',{}).af$('conjunctsRef',67586,'concurrent::AtomicRef',{}).af$('containedByRefsRef',67586,'concurrent::AtomicRef',{}).af$('hasSubtypesCache',67586,'concurrent::ConcurrentMap',{}).af$('associationsCache',67586,'concurrent::ConcurrentMap',{}).af$('choicesCache',67586,'concurrent::ConcurrentMap',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','def::MNamespace',false)]),{}).am$('conjuncts',8192,'haystack::Def[]',xp,{}).am$('initConjuncts',2048,'haystack::Def[]',xp,{}).am$('hasSubtypes',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('doHasSubtypes',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('associations',8192,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('parent','haystack::Def',false),new sys.Param('assoc','haystack::Def',false)]),{}).am$('doAssociations',2048,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('parent','haystack::Def',false),new sys.Param('assoc','haystack::Def',false)]),{}).am$('containedByRefs',8192,'haystack::Def[]',xp,{}).am$('initContainedByRefs',2048,'haystack::Def[]',xp,{});
DefUtil.type$.af$('emptyEnum',100354,'[sys::Str:haystack::Dict]',{}).am$('parseEnumNames',40962,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('enum','sys::Obj?',false)]),{}).am$('parseEnum',40962,'[sys::Str:haystack::Dict]',sys.List.make(sys.Param.type$,[new sys.Param('enum','sys::Obj?',false)]),{}).am$('parseEnumDict',34818,'[sys::Str:haystack::Dict]',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false)]),{}).am$('parseEnumList',34818,'[sys::Str:haystack::Dict]',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Str[]',false)]),{}).am$('parseEnumFandoc',34818,'[sys::Str:haystack::Dict]',sys.List.make(sys.Param.type$,[new sys.Param('enum','sys::Str',false)]),{}).am$('parseEnumSplit',34818,'[sys::Str:haystack::Dict]',sys.List.make(sys.Param.type$,[new sys.Param('enum','sys::Str',false)]),{}).am$('parseEnumSplitNames',34818,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('enum','sys::Str',false)]),{}).am$('eachTag',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','haystack::Namespace',false),new sys.Param('term','haystack::Def',false),new sys.Param('f','|haystack::Def->sys::Void|',false)]),{}).am$('implement',40962,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('ns','haystack::Namespace',false),new sys.Param('def','haystack::Def',false)]),{}).am$('union',40962,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('reflects','haystack::Reflection[]',false)]),{}).am$('intersection',40962,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('reflects','haystack::Reflection[]',false)]),{}).am$('accumulate',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj',false),new sys.Param('b','sys::Obj',false)]),{}).am$('doAccumulate',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','def::DefAccItem[]',false),new sys.Param('val','sys::Obj',false)]),{}).am$('isPassword',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('expandMarkersToConjuncts',40962,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('ns','def::MNamespace',false),new sys.Param('markers','haystack::Def[]',false)]),{}).am$('termsToTags',40962,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('terms','haystack::Def[]',false)]),{}).am$('findBaseDefs',40962,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('ns','haystack::Namespace',false),new sys.Param('defs','haystack::Def[]',false)]),{}).am$('resolve',40962,'haystack::Def?',sys.List.make(sys.Param.type$,[new sys.Param('ns','haystack::Namespace',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('resolveList',40962,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('ns','haystack::Namespace',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
DefAccItem.type$.af$('key',73728,'sys::Obj',{}).af$('val',73728,'sys::Obj',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('compare',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj',false)]),{});
MFilterInference.type$.af$('ns',67586,'haystack::Namespace',{}).af$('cur',67584,'def::MFilterInferenceSymbol?',{}).af$('cache',67584,'def::MFilterInferenceSymbol[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','haystack::Namespace',false)]),{}).am$('isA',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('subject','haystack::Dict',false),new sys.Param('symbol','haystack::Symbol',false)]),{});
MFilterInferenceSymbol.type$.af$('symbol',73730,'haystack::Symbol',{}).af$('descendants',67584,'haystack::Symbol[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','haystack::Namespace',false),new sys.Param('symbol','haystack::Symbol',false)]),{}).am$('findDescendants',34818,'haystack::Symbol[]',sys.List.make(sys.Param.type$,[new sys.Param('ns','haystack::Namespace',false),new sys.Param('symbol','haystack::Symbol',false)]),{}).am$('doFindDescendants',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:haystack::Symbol]',false),new sys.Param('ns','haystack::Namespace',false),new sys.Param('def','haystack::Def',false)]),{}).am$('matches',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('subject','haystack::Dict',false)]),{});
DefFactory.type$.am$('createNamespace',270336,'def::MNamespace',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BNamespace',false)]),{}).am$('createFeature',270336,'def::MFeature',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BFeature',false)]),{}).am$('make',139268,'sys::Void',xp,{});
MLib.type$.af$('indexRef',65666,'concurrent::AtomicInt',{}).af$('baseUri',336898,'sys::Uri',{}).af$('version',336898,'sys::Version',{}).af$('depends',336898,'haystack::Symbol[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BDef',false)]),{}).am$('index',271360,'sys::Int',xp,{});
MOverlayLib.type$.af$('defs',73730,'haystack::Def[]',{}).af$('defsMap',67586,'[sys::Str:haystack::Def]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BOverlayLib',false)]),{}).am$('def',8192,'haystack::Def?',sys.List.make(sys.Param.type$,[new sys.Param('symbol','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('hasDef',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('symbol','sys::Str',false)]),{}).am$('eachDef',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Def->sys::Void|',false)]),{});
BOverlayLib.type$.af$('base',65666,'haystack::Namespace',{}).af$('symbol',65666,'haystack::Symbol',{}).af$('meta',65666,'haystack::Dict',{}).af$('libRef',65666,'concurrent::AtomicRef',{}).af$('defs',65664,'haystack::Def[]',{}).af$('defsMap',65664,'[sys::Str:haystack::Def]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('base','haystack::Namespace',false),new sys.Param('meta','haystack::Dict',false)]),{}).am$('isDup',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('symbol','sys::Str',false)]),{}).am$('addDef',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('meta','haystack::Dict',false)]),{}).am$('toDef',2048,'def::MDef',sys.List.make(sys.Param.type$,[new sys.Param('meta','haystack::Dict',false)]),{}).am$('inherit',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('meta','haystack::Dict',false)]),{}).am$('inheritFrom',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Obj?]',false),new sys.Param('supertype','haystack::Def?',false)]),{}).am$('toKey',2048,'def::MDef',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BDef',false)]),{}).am$('toFeature',2048,'def::MFeature',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('toFallback',2048,'def::MDef',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BDef',false)]),{});
MNamespace.type$.af$('ts',336898,'sys::DateTime',{}).af$('tsKey',336898,'sys::Str',{}).af$('lazy',73730,'def::MLazy',{}).am$('toStr',9216,'sys::Str',xp,{}).am$('xeto',9216,'xeto::LibNamespace',xp,{}).am$('xetoGetter',270337,'def::XetoGetter',xp,{}).am$('findDefs',9216,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Def->sys::Bool|',false)]),{}).am$('hasDefs',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Def->sys::Bool|',false)]),{}).am$('quick',270337,'def::MQuick',xp,{}).am$('isFeature',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('fitsMarker',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('fitsVal',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('fitsChoice',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('fitsEntity',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('fits',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false),new sys.Param('parent','haystack::Def',false)]),{}).am$('defToKind',9216,'haystack::Kind',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('declared',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false),new sys.Param('name','sys::Str',false)]),{}).am$('supertypes',271360,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('subtypes',271360,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('hasSubtypes',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('matchSubtype',128,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false),new sys.Param('x','haystack::Def',false)]),{}).am$('inheritance',271360,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('inheritanceDepth',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('doInheritance',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:haystack::Def]',false),new sys.Param('def','haystack::Def',false)]),{}).am$('tags',271360,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('parent','haystack::Def',false)]),{}).am$('associations',271360,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('parent','haystack::Def',false),new sys.Param('assoc','haystack::Def',false)]),{}).am$('kindDef',9216,'haystack::Def?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('implement',9216,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('reflect',9216,'haystack::Reflection',sys.List.make(sys.Param.type$,[new sys.Param('subject','haystack::Dict',false)]),{}).am$('proto',9216,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('parent','haystack::Dict',false),new sys.Param('proto','haystack::Dict',false)]),{}).am$('protos',9216,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('parent','haystack::Dict',false)]),{}).am$('misc',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('eachMisc',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('symbolToUri',9216,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('symbol','sys::Str',false)]),{}).am$('toGrid',9216,'haystack::Grid',xp,{}).am$('dump',9216,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('resolveList',2048,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('symbols','sys::Obj?',false)]),{}).am$('resolve',2048,'haystack::Def',sys.List.make(sys.Param.type$,[new sys.Param('symbol','haystack::Symbol',false)]),{}).am$('isSkySpark',270336,'sys::Bool',xp,{}).am$('make',139268,'sys::Void',xp,{});
MOverlayNamespace.type$.af$('base',65666,'def::MBuiltNamespace',{}).af$('olib',65666,'def::MOverlayLib?',{}).af$('enabled',67586,'sys::Bool[]',{}).af$('xetoGetter',336898,'def::XetoGetter',{}).af$('features',336898,'haystack::Feature[]',{}).af$('libsList',336898,'haystack::Lib[]',{}).af$('libsMap',65666,'[sys::Str:haystack::Lib]',{}).af$('featuresMap',65666,'[sys::Str:haystack::Feature]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('base','haystack::Namespace',false),new sys.Param('olib','def::MOverlayLib?',false),new sys.Param('xetoGetter','def::XetoGetter',false),new sys.Param('enabled','|haystack::Lib->sys::Bool|',false)]),{}).am$('toLibsList',34818,'haystack::Lib[]',sys.List.make(sys.Param.type$,[new sys.Param('base','haystack::Namespace',false),new sys.Param('enabled','sys::Bool[]',false),new sys.Param('olib','def::MOverlayLib?',false)]),{}).am$('isEnabled',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('lib','haystack::Lib',false)]),{}).am$('quick',271360,'def::MQuick',xp,{}).am$('def',271360,'haystack::Def?',sys.List.make(sys.Param.type$,[new sys.Param('symbol','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('defs',271360,'haystack::Def[]',xp,{}).am$('eachDef',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Def->sys::Void|',false)]),{}).am$('eachWhileDef',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Def->sys::Obj?|',false)]),{}).am$('feature',271360,'haystack::Feature?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('lib',271360,'haystack::Lib?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('filetypes',271360,'haystack::Filetype[]',xp,{}).am$('filetype',271360,'haystack::Filetype?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
MPrototyper.type$.af$('ns',73730,'def::MNamespace',{}).af$('parent',73730,'haystack::Dict',{}).af$('parentReflect',73730,'haystack::Reflection',{}).af$('flattenTagNames',67584,'sys::Str[]?',{}).af$('refTags',67584,'[sys::Str:haystack::Ref]?',{}).af$('processed',67584,'[sys::Obj:sys::Obj]',{}).af$('results',67584,'haystack::Dict[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','def::MNamespace',false),new sys.Param('parent','haystack::Dict',false)]),{}).am$('generate',8192,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('proto','haystack::Dict?',false)]),{}).am$('computeFlattenTags',2048,'sys::Void',xp,{}).am$('applyFlattenTag',2048,'haystack::Def?',sys.List.make(sys.Param.type$,[new sys.Param('parentReflect','haystack::Reflection',false),new sys.Param('toFlatten','haystack::Def',false)]),{}).am$('computeRefTags',2048,'sys::Void',xp,{}).am$('process',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('proto','haystack::Dict?',false)]),{}).am$('processReflect',2048,'sys::Void',xp,{}).am$('processList',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('children','sys::Obj?[]',false)]),{}).am$('processDict',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('declared','haystack::Dict',false)]),{}).am$('addDis',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Obj]',false)]),{});
XetoGetter.type$.am$('get',270337,'xeto::LibNamespace',xp,{});
DefXetoGetter.type$.am$('get',271360,'xeto::LibNamespace',xp,{}).am$('make',139268,'sys::Void',xp,{});
UnsupportedXetoGetter.type$.am$('get',271360,'xeto::LibNamespace',xp,{}).am$('make',139268,'sys::Void',xp,{});
MQuick.type$.af$('ph',73730,'haystack::Lib',{}).af$('val',73730,'haystack::Def',{}).af$('marker',73730,'haystack::Def',{}).af$('na',73730,'haystack::Def',{}).af$('remove',73730,'haystack::Def',{}).af$('bool',73730,'haystack::Def',{}).af$('number',73730,'haystack::Def',{}).af$('str',73730,'haystack::Def',{}).af$('uri',73730,'haystack::Def',{}).af$('ref',73730,'haystack::Def',{}).af$('date',73730,'haystack::Def',{}).af$('time',73730,'haystack::Def',{}).af$('dateTime',73730,'haystack::Def',{}).af$('coord',73730,'haystack::Def',{}).af$('xstr',73730,'haystack::Def',{}).af$('list',73730,'haystack::Def',{}).af$('grid',73730,'haystack::Def',{}).af$('dict',73730,'haystack::Def',{}).af$('def',73730,'haystack::Def',{}).af$('entity',73730,'haystack::Def',{}).af$('tags',73730,'haystack::Def',{}).af$('choice',73730,'haystack::Def',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','def::MNamespace',false)]),{}).am$('fromFixedType',8192,'haystack::Def?',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{});
MLibFeature.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BFeature',false)]),{}).am$('defType',271360,'sys::Type',xp,{}).am$('createDef',271360,'def::MDef',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BDef',false)]),{}).am$('createUnknownErr',271360,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{});
MBuiltNamespace.type$.af$('quick',336898,'def::MQuick',{}).af$('xetoGetter',336898,'def::XetoGetter',{}).af$('features',336898,'haystack::Feature[]',{}).af$('libsList',336898,'haystack::Lib[]',{}).af$('filetypes',336898,'haystack::Filetype[]',{}).af$('defsMap',65666,'[sys::Str:haystack::Def]',{}).af$('featuresMap',65666,'[sys::Str:haystack::Feature]',{}).af$('libsMap',65666,'[sys::Str:haystack::Lib]',{}).af$('filetypesMap',65666,'[sys::Str:haystack::Filetype]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BNamespace',false)]),{}).am$('def',271360,'haystack::Def?',sys.List.make(sys.Param.type$,[new sys.Param('symbol','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('defs',271360,'haystack::Def[]',xp,{}).am$('eachDef',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Def->sys::Void|',false)]),{}).am$('eachWhileDef',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Def->sys::Obj?|',false)]),{}).am$('feature',271360,'haystack::Feature?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('lib',271360,'haystack::Lib?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('filetype',271360,'haystack::Filetype?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
RdfWriter.type$.af$('out',67584,'rdf::RdfOutStream',{}).af$('ns',67584,'haystack::Namespace',{}).af$('libs',69632,'[sys::Str:haystack::Lib]',{}).af$('refBaseUri',67584,'sys::Str?',{}).af$('nestedDicts',67584,'[rdf::Iri:haystack::Dict]',{}).af$('owlClass',100354,'rdf::Iri',{}).af$('owlDatatypeProp',100354,'rdf::Iri',{}).af$('owlObjectProp',100354,'rdf::Iri',{}).af$('rdfType',100354,'rdf::Iri',{}).af$('rdfsSubClassOf',100354,'rdf::Iri',{}).af$('rdfsSubPropertyOf',100354,'rdf::Iri',{}).af$('rdfsDatatype',100354,'rdf::Iri',{}).af$('rdfsLiteral',100354,'rdf::Iri',{}).af$('rdfsDomain',100354,'rdf::Iri',{}).af$('rdfsRange',100354,'rdf::Iri',{}).af$('rdfsLabel',100354,'rdf::Iri',{}).af$('binIri$Store',722944,'sys::Obj?',{}).af$('coordIri$Store',722944,'sys::Obj?',{}).af$('markerIri$Store',722944,'sys::Obj?',{}).af$('naIri$Store',722944,'sys::Obj?',{}).af$('numberIri$Store',722944,'sys::Obj?',{}).af$('refIri$Store',722944,'sys::Obj?',{}).af$('xstrIri$Store',722944,'sys::Obj?',{}).af$('dictIri$Store',722944,'sys::Obj?',{}).af$('gridIri$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','rdf::RdfOutStream',false),new sys.Param('opts','haystack::Dict?',true)]),{}).am$('binIri',532480,'rdf::Iri',xp,{}).am$('coordIri',532480,'rdf::Iri',xp,{}).am$('markerIri',532480,'rdf::Iri',xp,{}).am$('naIri',532480,'rdf::Iri',xp,{}).am$('numberIri',532480,'rdf::Iri',xp,{}).am$('refIri',532480,'rdf::Iri',xp,{}).am$('xstrIri',532480,'rdf::Iri',xp,{}).am$('dictIri',532480,'rdf::Iri',xp,{}).am$('gridIri',532480,'rdf::Iri',xp,{}).am$('writeGrid',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('writePrefixes',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('writeSyntheticStmts',2048,'sys::Void',xp,{}).am$('writeNested',2048,'sys::Void',xp,{}).am$('writeOntology',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false)]),{}).am$('writeDefOntology',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('symbol','haystack::Symbol',false),new sys.Param('dict','haystack::Dict',false)]),{}).am$('isScalar',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('isRef',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('toRange',2048,'haystack::Symbol',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('toDatatype',34818,'rdf::Iri',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('writeInstOntology',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false),new sys.Param('subject','rdf::Iri?',true)]),{}).am$('writeDict',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false),new sys.Param('subject','rdf::Iri?',true)]),{}).am$('isIdTag',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('tagName','sys::Str',false)]),{}).am$('toSubject',2048,'rdf::Iri',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false)]),{}).am$('toPredicate',2048,'rdf::Iri?',sys.List.make(sys.Param.type$,[new sys.Param('tagName','sys::Str',false)]),{}).am$('writeStmt',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('subj','rdf::Iri',false),new sys.Param('pred','rdf::Iri',false),new sys.Param('val','sys::Obj',false)]),{}).am$('inspectSymbols',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('mapDef',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('symbol','sys::Str',false)]),{}).am$('mapVal',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('symbolIri',2048,'rdf::Iri',sys.List.make(sys.Param.type$,[new sys.Param('symbol','haystack::Symbol',false)]),{}).am$('refToIri',2048,'rdf::Iri',sys.List.make(sys.Param.type$,[new sys.Param('ref','haystack::Ref',false)]),{}).am$('binIri$Once',133120,'rdf::Iri',xp,{}).am$('coordIri$Once',133120,'rdf::Iri',xp,{}).am$('markerIri$Once',133120,'rdf::Iri',xp,{}).am$('naIri$Once',133120,'rdf::Iri',xp,{}).am$('numberIri$Once',133120,'rdf::Iri',xp,{}).am$('refIri$Once',133120,'rdf::Iri',xp,{}).am$('xstrIri$Once',133120,'rdf::Iri',xp,{}).am$('dictIri$Once',133120,'rdf::Iri',xp,{}).am$('gridIri$Once',133120,'rdf::Iri',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
TurtleWriter.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('opts','haystack::Dict?',true)]),{});
JsonLdWriter.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('opts','haystack::Dict?',true)]),{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "def");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;web 1.0;rdf 3.1.11;xeto 3.1.11;haystack 3.1.11");
m.set("pod.summary", "Haystack def namespace implementation");
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
  DefBuilder,
  BNamespace,
  BDef,
  BFeature,
  MDef,
  MFeature,
  MLazy,
  DefUtil,
  MFilterInference,
  DefFactory,
  MLib,
  MOverlayLib,
  BOverlayLib,
  MNamespace,
  MOverlayNamespace,
  XetoGetter,
  DefXetoGetter,
  UnsupportedXetoGetter,
  MQuick,
  MBuiltNamespace,
  RdfWriter,
  TurtleWriter,
  JsonLdWriter,
};
