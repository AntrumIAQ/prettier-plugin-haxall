// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class Stmt extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Stmt.type$; }

  #subj = null;

  subj() { return this.#subj; }

  __subj(it) { if (it === undefined) return this.#subj; else this.#subj = it; }

  #pred = null;

  pred() { return this.#pred; }

  __pred(it) { if (it === undefined) return this.#pred; else this.#pred = it; }

  #obj = null;

  obj() { return this.#obj; }

  __obj(it) { if (it === undefined) return this.#obj; else this.#obj = it; }

  #hash = 0;

  hash() { return this.#hash; }

  __hash(it) { if (it === undefined) return this.#hash; else this.#hash = it; }

  static make(subject,predicate,object) {
    const $self = new Stmt();
    Stmt.make$($self,subject,predicate,object);
    return $self;
  }

  static make$($self,subject,predicate,object) {
    $self.#subj = subject;
    $self.#pred = predicate;
    $self.#obj = ((this$) => { let $_u0 = object; if ($_u0 == null) return null; return sys.ObjUtil.toImmutable(object); })($self);
    $self.#hash = Stmt.hashCombine(Stmt.hashCombine(Stmt.hashObj($self.#subj), Stmt.hashObj($self.#pred)), Stmt.hashObj($self.#obj));
    return;
  }

  static hashObj(x) {
    return sys.ObjUtil.coerce(((this$) => { let $_u1 = ((this$) => { let $_u2 = x; if ($_u2 == null) return null; return sys.ObjUtil.hash(x); })(this$); if ($_u1 != null) return $_u1; return sys.ObjUtil.coerce(23, sys.Int.type$.toNullable()); })(this), sys.Int.type$);
  }

  static hashCombine(h1,h2) {
    return sys.Int.xor(sys.Int.plus(sys.Int.shiftl(h1, 5), h1), h2);
  }

  normalize(prefixMap) {
    return Stmt.make(this.#subj.fullIri(prefixMap), this.#pred.fullIri(prefixMap), sys.ObjUtil.coerce(((this$) => { let $_u3 = ((this$) => { let $_u4 = sys.ObjUtil.as(this$.#obj, Iri.type$); if ($_u4 == null) return null; return sys.ObjUtil.as(this$.#obj, Iri.type$).fullIri(prefixMap); })(this$); if ($_u3 != null) return $_u3; return this$.#obj; })(this), sys.Obj.type$));
  }

  prefix(prefixMap) {
    return Stmt.make(this.#subj.prefixIri(prefixMap), this.#pred.prefixIri(prefixMap), sys.ObjUtil.coerce(((this$) => { let $_u5 = ((this$) => { let $_u6 = sys.ObjUtil.as(this$.#obj, Iri.type$); if ($_u6 == null) return null; return sys.ObjUtil.as(this$.#obj, Iri.type$).prefixIri(prefixMap); })(this$); if ($_u5 != null) return $_u5; return this$.#obj; })(this), sys.Obj.type$));
  }

  compare(obj) {
    let that = sys.ObjUtil.as(obj, Stmt.type$);
    if (that == null) {
      return sys.ObjUtil.compare(sys.Obj.prototype, sys.ObjUtil.coerce(that, sys.Obj.type$));
    }
    ;
    let cmp = sys.ObjUtil.compare(this.#subj, that.#subj);
    if (sys.ObjUtil.compareNE(cmp, 0)) {
      return cmp;
    }
    ;
    (cmp = sys.ObjUtil.compare(this.#pred, that.#pred));
    if (sys.ObjUtil.compareNE(cmp, 0)) {
      return cmp;
    }
    ;
    return sys.ObjUtil.compare(this.#obj, that.#obj);
  }

  equals(obj) {
    if (this === obj) {
      return true;
    }
    ;
    let that = sys.ObjUtil.as(obj, Stmt.type$);
    if (that == null) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareNE(this.#subj, that.#subj)) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareNE(this.#pred, that.#pred)) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareNE(this.#obj, that.#obj)) {
      return false;
    }
    ;
    return true;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("(", this.#subj), ", "), this.#pred), ", "), this.#obj), ")");
  }

}

class Iri extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Iri.type$; }

  #iri = null;

  // private field reflection only
  __iri(it) { if (it === undefined) return this.#iri; else this.#iri = it; }

  #nameIdx = 0;

  // private field reflection only
  __nameIdx(it) { if (it === undefined) return this.#nameIdx; else this.#nameIdx = it; }

  static bnode(label) {
    if (label === undefined) label = sys.Uuid.make().toStr();
    return Iri.make(sys.Str.plus("_:", label));
  }

  static makeNs(ns,name) {
    const $self = new Iri();
    Iri.makeNs$($self,ns,name);
    return $self;
  }

  static makeNs$($self,ns,name) {
    Iri.make$($self, sys.Str.plus(sys.Str.plus(sys.Str.plus("", ns), ""), name));
    return;
  }

  static makeUri(uri) {
    const $self = new Iri();
    Iri.makeUri$($self,uri);
    return $self;
  }

  static makeUri$($self,uri) {
    Iri.make$($self, uri.toStr());
    return;
  }

  static make(iri) {
    const $self = new Iri();
    Iri.make$($self,iri);
    return $self;
  }

  static make$($self,iri) {
    if (!sys.Str.containsChar(iri, 58)) {
      throw sys.ArgErr.make(sys.Str.plus("Not a valid IRI: ", iri));
    }
    ;
    $self.#iri = iri;
    $self.#nameIdx = Iri.toNameIdx(iri);
    return;
  }

  static toNameIdx(iri) {
    let idx = sys.Str.index(iri, "#");
    if (idx == null) {
      (idx = sys.Str.indexr(iri, "/"));
    }
    ;
    if (idx == null) {
      (idx = sys.Str.indexr(iri, ":"));
    }
    ;
    if (idx == null) {
      throw sys.ArgErr.make(sys.Str.plus("No namespace separator found in IRI: ", iri));
    }
    ;
    return sys.Int.plus(sys.ObjUtil.coerce(idx, sys.Int.type$), 1);
  }

  ns() {
    return sys.Str.getRange(this.#iri, sys.Range.make(0, this.#nameIdx, true));
  }

  name() {
    return sys.Str.getRange(this.#iri, sys.Range.make(this.#nameIdx, -1));
  }

  uri() {
    return sys.Str.toUri(this.#iri);
  }

  isBlankNode() {
    return sys.ObjUtil.equals(this.ns(), "_:");
  }

  prefixIri(prefixMap) {
    const this$ = this;
    if (this.isBlankNode()) {
      return this;
    }
    ;
    return sys.ObjUtil.coerce(((this$) => { let $_u7 = prefixMap.eachWhile((namespace,prefix) => {
      return ((this$) => { if (sys.ObjUtil.equals(this$.ns(), namespace)) return Iri.makeNs(sys.Str.plus(sys.Str.plus("", prefix), ":"), this$.name()); return null; })(this$);
    }); if ($_u7 != null) return $_u7; return this$; })(this), Iri.type$);
  }

  fullIri(prefixMap) {
    if (this.isBlankNode()) {
      return this;
    }
    ;
    let myPrefix = sys.Str.getRange(this.ns(), sys.Range.make(0, -1, true));
    let expanded = prefixMap.get(myPrefix);
    if (expanded == null) {
      return this;
    }
    ;
    return Iri.makeNs(sys.ObjUtil.coerce(expanded, sys.Str.type$), this.name());
  }

  compare(obj) {
    let that = sys.ObjUtil.as(obj, Iri.type$);
    if (that == null) {
      return sys.ObjUtil.compare(sys.Obj.prototype, sys.ObjUtil.coerce(that, sys.Obj.type$));
    }
    ;
    return sys.ObjUtil.compare(this.uri(), that.uri());
  }

  hash() {
    return sys.Str.hash(this.#iri);
  }

  equals(obj) {
    if (this === obj) {
      return true;
    }
    ;
    let that = sys.ObjUtil.as(obj, Iri.type$);
    if (that == null) {
      return false;
    }
    ;
    return sys.ObjUtil.equals(this.#iri, that.#iri);
  }

  toStr() {
    return this.#iri;
  }

}

class RdfOutStream extends sys.OutStream {
  constructor() {
    super();
    const this$ = this;
    this.#nsMap = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Obj:sys::Obj?]")), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

  typeof() { return RdfOutStream.type$; }

  #nsMap = null;

  nsMap() {
    return this.#nsMap;
  }

  static make(out) {
    const $self = new RdfOutStream();
    RdfOutStream.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    sys.OutStream.make$($self, out);
    ;
    $self.setNs("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#").setNs("rdfs", "http://www.w3.org/2000/01/rdf-schema#").setNs("xsd", Xsd.ns());
    return;
  }

  setNs(prefix,namespace) {
    let cur = this.#nsMap.get(prefix);
    if (cur == null) {
      this.#nsMap.set(prefix, namespace);
      this.onSetNs(prefix, namespace);
    }
    else {
      if (sys.ObjUtil.compareNE(cur, namespace)) {
        throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot map ", prefix), " to "), namespace), ". Already mapped to: "), cur));
      }
      ;
    }
    ;
    return this;
  }

  onSetNs(prefix,namespace) {
    return this;
  }

  finish() {
    return this;
  }

  close() {
    this.finish();
    return sys.OutStream.prototype.close.call(this);
  }

  writeRdfStr(str) {
    const this$ = this;
    this.writeChar(34);
    sys.Str.each(str, (char) => {
      if (sys.ObjUtil.compareLE(char, 127)) {
        let $_u9 = char;
        if (sys.ObjUtil.equals($_u9, 8)) {
          sys.ObjUtil.coerce(this$.writeChar(92), RdfOutStream.type$).writeChar(98);
        }
        else if (sys.ObjUtil.equals($_u9, 12)) {
          sys.ObjUtil.coerce(this$.writeChar(92), RdfOutStream.type$).writeChar(102);
        }
        else if (sys.ObjUtil.equals($_u9, 10)) {
          sys.ObjUtil.coerce(this$.writeChar(92), RdfOutStream.type$).writeChar(110);
        }
        else if (sys.ObjUtil.equals($_u9, 13)) {
          sys.ObjUtil.coerce(this$.writeChar(92), RdfOutStream.type$).writeChar(114);
        }
        else if (sys.ObjUtil.equals($_u9, 9)) {
          sys.ObjUtil.coerce(this$.writeChar(92), RdfOutStream.type$).writeChar(116);
        }
        else if (sys.ObjUtil.equals($_u9, 92)) {
          sys.ObjUtil.coerce(this$.writeChar(92), RdfOutStream.type$).writeChar(92);
        }
        else if (sys.ObjUtil.equals($_u9, 34)) {
          sys.ObjUtil.coerce(this$.writeChar(92), RdfOutStream.type$).writeChar(34);
        }
        else {
          this$.writeChar(char);
        }
        ;
      }
      else {
        sys.ObjUtil.coerce(sys.ObjUtil.coerce(this$.writeChar(92), RdfOutStream.type$).writeChar(117), RdfOutStream.type$).print(sys.Int.toHex(char, sys.ObjUtil.coerce(4, sys.Int.type$.toNullable())));
      }
      ;
      return;
    });
    return sys.ObjUtil.coerce(this.writeChar(34), RdfOutStream.type$);
  }

  nl() {
    return sys.ObjUtil.coerce(this.writeChar(10), RdfOutStream.type$);
  }

  tab(num,spaces) {
    if (num === undefined) num = 1;
    if (spaces === undefined) spaces = 4;
    const this$ = this;
    sys.Int.times(sys.Int.mult(num, spaces), (it) => {
      this$.writeChar(32);
      return;
    });
    return this;
  }

}

class Xsd {
  constructor() {
    const this$ = this;
  }

  typeof() { return Xsd.type$; }

  static #ns = undefined;

  static ns() {
    if (Xsd.#ns === undefined) {
      Xsd.static$init();
      if (Xsd.#ns === undefined) Xsd.#ns = null;
    }
    return Xsd.#ns;
  }

  static #string = undefined;

  static string() {
    if (Xsd.#string === undefined) {
      Xsd.static$init();
      if (Xsd.#string === undefined) Xsd.#string = null;
    }
    return Xsd.#string;
  }

  static #float = undefined;

  static float() {
    if (Xsd.#float === undefined) {
      Xsd.static$init();
      if (Xsd.#float === undefined) Xsd.#float = null;
    }
    return Xsd.#float;
  }

  static #double = undefined;

  static double() {
    if (Xsd.#double === undefined) {
      Xsd.static$init();
      if (Xsd.#double === undefined) Xsd.#double = null;
    }
    return Xsd.#double;
  }

  static #boolean = undefined;

  static boolean() {
    if (Xsd.#boolean === undefined) {
      Xsd.static$init();
      if (Xsd.#boolean === undefined) Xsd.#boolean = null;
    }
    return Xsd.#boolean;
  }

  static #anyURI = undefined;

  static anyURI() {
    if (Xsd.#anyURI === undefined) {
      Xsd.static$init();
      if (Xsd.#anyURI === undefined) Xsd.#anyURI = null;
    }
    return Xsd.#anyURI;
  }

  static #hexBinary = undefined;

  static hexBinary() {
    if (Xsd.#hexBinary === undefined) {
      Xsd.static$init();
      if (Xsd.#hexBinary === undefined) Xsd.#hexBinary = null;
    }
    return Xsd.#hexBinary;
  }

  static #date = undefined;

  static date() {
    if (Xsd.#date === undefined) {
      Xsd.static$init();
      if (Xsd.#date === undefined) Xsd.#date = null;
    }
    return Xsd.#date;
  }

  static #time = undefined;

  static time() {
    if (Xsd.#time === undefined) {
      Xsd.static$init();
      if (Xsd.#time === undefined) Xsd.#time = null;
    }
    return Xsd.#time;
  }

  static #dateTime = undefined;

  static dateTime() {
    if (Xsd.#dateTime === undefined) {
      Xsd.static$init();
      if (Xsd.#dateTime === undefined) Xsd.#dateTime = null;
    }
    return Xsd.#dateTime;
  }

  static encode(obj) {
    let $_u10 = sys.ObjUtil.typeof(obj);
    if (sys.ObjUtil.equals($_u10, sys.Buf.type$)) {
      return sys.ObjUtil.as(obj, sys.Buf.type$).toHex();
    }
    else if (sys.ObjUtil.equals($_u10, sys.Date.type$)) {
      return sys.ObjUtil.toStr(obj);
    }
    else if (sys.ObjUtil.equals($_u10, sys.Time.type$)) {
      return sys.ObjUtil.toStr(obj);
    }
    else if (sys.ObjUtil.equals($_u10, sys.DateTime.type$)) {
      return sys.ObjUtil.as(obj, sys.DateTime.type$).toIso();
    }
    else if (sys.ObjUtil.equals($_u10, sys.Uri.type$)) {
      return sys.ObjUtil.toStr(obj);
    }
    else {
      return sys.ObjUtil.toStr(obj);
    }
    ;
  }

  static static$init() {
    Xsd.#ns = "http://www.w3.org/2001/XMLSchema#";
    Xsd.#string = Iri.make(sys.Str.plus(sys.Str.plus("", Xsd.#ns), "string"));
    Xsd.#float = Iri.make(sys.Str.plus(sys.Str.plus("", Xsd.#ns), "float"));
    Xsd.#double = Iri.make(sys.Str.plus(sys.Str.plus("", Xsd.#ns), "double"));
    Xsd.#boolean = Iri.make(sys.Str.plus(sys.Str.plus("", Xsd.#ns), "boolean"));
    Xsd.#anyURI = Iri.make(sys.Str.plus(sys.Str.plus("", Xsd.#ns), "anyURI"));
    Xsd.#hexBinary = Iri.make(sys.Str.plus(sys.Str.plus("", Xsd.#ns), "hexBinary"));
    Xsd.#date = Iri.make(sys.Str.plus(sys.Str.plus("", Xsd.#ns), "date"));
    Xsd.#time = Iri.make(sys.Str.plus(sys.Str.plus("", Xsd.#ns), "time"));
    Xsd.#dateTime = Iri.make(sys.Str.plus(sys.Str.plus("", Xsd.#ns), "dateTime"));
    return;
  }

}

class TurtleOutStream extends RdfOutStream {
  constructor() {
    super();
    const this$ = this;
    this.#prevSubj = null;
    this.#prevPred = null;
    return;
  }

  typeof() { return TurtleOutStream.type$; }

  static #xsdNs = undefined;

  static xsdNs() {
    if (TurtleOutStream.#xsdNs === undefined) {
      TurtleOutStream.static$init();
      if (TurtleOutStream.#xsdNs === undefined) TurtleOutStream.#xsdNs = null;
    }
    return TurtleOutStream.#xsdNs;
  }

  static #rdfType = undefined;

  static rdfType() {
    if (TurtleOutStream.#rdfType === undefined) {
      TurtleOutStream.static$init();
      if (TurtleOutStream.#rdfType === undefined) TurtleOutStream.#rdfType = null;
    }
    return TurtleOutStream.#rdfType;
  }

  #prevSubj = null;

  // private field reflection only
  __prevSubj(it) { if (it === undefined) return this.#prevSubj; else this.#prevSubj = it; }

  #prevPred = null;

  // private field reflection only
  __prevPred(it) { if (it === undefined) return this.#prevPred; else this.#prevPred = it; }

  static make(out) {
    const $self = new TurtleOutStream();
    TurtleOutStream.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    RdfOutStream.make$($self, out);
    ;
    return;
  }

  finish() {
    if (this.#prevSubj != null) {
      sys.ObjUtil.coerce(this.writeChars(" ."), TurtleOutStream.type$).nl();
    }
    ;
    this.#prevSubj = null;
    this.#prevPred = null;
    return sys.ObjUtil.coerce(this.flush(), TurtleOutStream.type$);
  }

  onSetNs(prefix,namespace) {
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.finish(), TurtleOutStream.type$).writeChars(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("@prefix ", prefix), ": <"), namespace), "> .")), TurtleOutStream.type$).nl(), TurtleOutStream.type$);
  }

  writeStmt(subject,predicate,object,typeOrLocale) {
    if (typeOrLocale === undefined) typeOrLocale = null;
    (subject = subject.fullIri(this.nsMap()));
    (predicate = predicate.fullIri(this.nsMap()));
    if (sys.ObjUtil.is(object, Iri.type$)) {
      (object = sys.ObjUtil.as(object, Iri.type$).fullIri(this.nsMap()));
    }
    ;
    let newSubj = sys.ObjUtil.compareNE(this.#prevSubj, subject);
    let newPred = true;
    if (newSubj) {
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.finish(), TurtleOutStream.type$).nl(), TurtleOutStream.type$).writePreOrIri(subject).writeChar(32), TurtleOutStream.type$).writePredIri(predicate).writeChar(32);
    }
    else {
      (newPred = sys.ObjUtil.compareNE(this.#prevPred, predicate));
      if (newPred) {
        sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.writeChars(" ;"), TurtleOutStream.type$).nl(), TurtleOutStream.type$).tab(), TurtleOutStream.type$).writePredIri(predicate).writeChar(32);
      }
      else {
        sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.writeChar(44), TurtleOutStream.type$).nl(), TurtleOutStream.type$).tab(2);
      }
      ;
    }
    ;
    this.writeObject(object, typeOrLocale);
    this.#prevSubj = subject;
    this.#prevPred = predicate;
    return this;
  }

  writePredIri(normIri) {
    return ((this$) => { if (sys.ObjUtil.equals(TurtleOutStream.rdfType(), normIri)) return sys.ObjUtil.coerce(this$.writeChar(97), TurtleOutStream.type$); return this$.writePreOrIri(normIri); })(this);
  }

  writePreOrIri(normIri) {
    let preOrIri = normIri.prefixIri(this.nsMap());
    if (normIri.isBlankNode()) {
      this.writeChars(TurtleOutStream.validateBlankNode(normIri).toStr());
    }
    else {
      if (sys.ObjUtil.equals(preOrIri, normIri)) {
        sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.writeChar(60), TurtleOutStream.type$).writeChars(preOrIri.toStr()), TurtleOutStream.type$).writeChar(62);
      }
      else {
        this.writeChars(preOrIri.toStr());
      }
      ;
    }
    ;
    return this;
  }

  writeObject(object,typeOrLocale) {
    let $_u12 = sys.ObjUtil.typeof(object);
    if (sys.ObjUtil.equals($_u12, Iri.type$)) {
      return this.writePreOrIri(sys.ObjUtil.coerce(object, Iri.type$));
    }
    else if (sys.ObjUtil.equals($_u12, sys.Str.type$)) {
      this.writeStr(sys.ObjUtil.coerce(object, sys.Str.type$), sys.ObjUtil.as(typeOrLocale, sys.Locale.type$));
    }
    else if (sys.ObjUtil.equals($_u12, sys.Bool.type$) || sys.ObjUtil.equals($_u12, sys.Int.type$) || sys.ObjUtil.equals($_u12, sys.Float.type$) || sys.ObjUtil.equals($_u12, sys.Decimal.type$)) {
      return sys.ObjUtil.coerce(this.writeChars(sys.ObjUtil.toStr(object)), TurtleOutStream.type$);
    }
    else if (sys.ObjUtil.equals($_u12, sys.Buf.type$)) {
      return this.writeXsd(object, Xsd.hexBinary());
    }
    else if (sys.ObjUtil.equals($_u12, sys.Date.type$)) {
      return this.writeXsd(object, Xsd.date());
    }
    else if (sys.ObjUtil.equals($_u12, sys.Time.type$)) {
      return this.writeXsd(object, Xsd.time());
    }
    else if (sys.ObjUtil.equals($_u12, sys.DateTime.type$)) {
      return this.writeXsd(object, Xsd.dateTime());
    }
    else if (sys.ObjUtil.equals($_u12, sys.Uri.type$)) {
      return this.writeXsd(object, Xsd.anyURI());
    }
    else {
      this.writeStr(sys.ObjUtil.toStr(object));
    }
    ;
    if (sys.ObjUtil.is(typeOrLocale, Iri.type$)) {
      let type = sys.ObjUtil.as(typeOrLocale, Iri.type$).fullIri(this.nsMap());
      sys.ObjUtil.coerce(this.writeChars("^^"), TurtleOutStream.type$).writePreOrIri(type);
    }
    ;
    return this;
  }

  writeStr(str,locale) {
    if (locale === undefined) locale = null;
    this.writeRdfStr(str);
    if (locale != null) {
      this.writeChars(locale.toStr());
    }
    ;
    return this;
  }

  writeXsd(object,type) {
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.writeChar(34), TurtleOutStream.type$).writeChars(Xsd.encode(object)), TurtleOutStream.type$).writeChar(34), TurtleOutStream.type$).writeType(type);
  }

  writeType(typeIri) {
    return sys.ObjUtil.coerce(this.writeChars("^^"), TurtleOutStream.type$).writePreOrIri(typeIri);
  }

  static isLabelName(name) {
    const this$ = this;
    if (sys.Str.isEmpty(name)) {
      return false;
    }
    ;
    let c1 = sys.Str.get(name, 0);
    let cn = sys.Str.get(name, -1);
    if ((sys.ObjUtil.equals(c1, 46) || sys.ObjUtil.equals(cn, 46))) {
      return false;
    }
    ;
    if ((sys.ObjUtil.equals(c1, 46) || sys.ObjUtil.equals(c1, 183) || (sys.ObjUtil.compareLE(768, c1) && sys.ObjUtil.compareLE(c1, 879)) || (sys.ObjUtil.compareLE(8255, c1) && sys.ObjUtil.compareLE(c1, 8256)))) {
      return false;
    }
    ;
    return sys.Str.all(name, (ch) => {
      return (sys.Int.isAlphaNum(ch) || sys.ObjUtil.equals(ch, 95) || sys.ObjUtil.equals(ch, 46) || sys.ObjUtil.equals(ch, 45));
    });
    return true;
  }

  static validateBlankNode(iri) {
    if (!iri.isBlankNode()) {
      throw sys.ArgErr.make(sys.Str.plus("Not a blank node: ", iri));
    }
    ;
    if (!TurtleOutStream.isLabelName(iri.name())) {
      throw sys.ArgErr.make(sys.Str.plus("Invalid label name for blank node: ", iri));
    }
    ;
    return iri;
  }

  static static$init() {
    TurtleOutStream.#xsdNs = Iri.make("http://www.w3.org/2001/XMLSchema#");
    TurtleOutStream.#rdfType = Iri.make("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
    return;
  }

}

class JsonLdOutStream extends RdfOutStream {
  constructor() {
    super();
    const this$ = this;
    this.#graph = sys.List.make(sys.Type.find("[sys::Str:sys::Obj]"));
    this.#wroteContext = false;
    this.#curSubj = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Obj:sys::Obj?]")), sys.Type.find("[sys::Str:sys::Obj]"));
    this.#firstSubj = true;
    return;
  }

  typeof() { return JsonLdOutStream.type$; }

  #graph = null;

  // private field reflection only
  __graph(it) { if (it === undefined) return this.#graph; else this.#graph = it; }

  #wroteContext = false;

  // private field reflection only
  __wroteContext(it) { if (it === undefined) return this.#wroteContext; else this.#wroteContext = it; }

  #curSubj = null;

  // private field reflection only
  __curSubj(it) { if (it === undefined) return this.#curSubj; else this.#curSubj = it; }

  #firstSubj = false;

  // private field reflection only
  __firstSubj(it) { if (it === undefined) return this.#firstSubj; else this.#firstSubj = it; }

  static make(out) {
    const $self = new JsonLdOutStream();
    JsonLdOutStream.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    RdfOutStream.make$($self, out);
    ;
    sys.ObjUtil.coerce($self.writeChar(123), JsonLdOutStream.type$).nl();
    return;
  }

  finishContext() {
    if (this.#wroteContext) {
      return this;
    }
    ;
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.writeChars(sys.Str.toCode(JsonLD.context())), JsonLdOutStream.type$).writeChar(58), JsonLdOutStream.type$).writeMap(this.nsMap());
    sys.ObjUtil.coerce(this.writeChar(44), JsonLdOutStream.type$).nl();
    sys.ObjUtil.coerce(this.writeChars(sys.Str.toCode(JsonLD.graph())), JsonLdOutStream.type$).writeChars(":[");
    this.#wroteContext = true;
    return this;
  }

  finishSubj() {
    if (!this.#curSubj.isEmpty()) {
      if (!this.#firstSubj) {
        sys.ObjUtil.coerce(this.writeChar(44), JsonLdOutStream.type$).nl();
      }
      else {
        this.#firstSubj = false;
      }
      ;
      this.writeMap(this.#curSubj);
      this.#curSubj = this.newMap();
    }
    ;
    return this;
  }

  finish() {
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.finishContext().finishSubj().writeChars("]}"), JsonLdOutStream.type$).flush(), JsonLdOutStream.type$);
  }

  onSetNs(prefix,namespace) {
    if (this.#wroteContext) {
      throw sys.Err.make("Cannot set namespace: statements have already been written");
    }
    ;
    return this;
  }

  writeStmt(subject,predicate,object,typeOrLocale) {
    if (typeOrLocale === undefined) typeOrLocale = null;
    this.finishContext();
    (subject = subject.prefixIri(this.nsMap()));
    (predicate = predicate.prefixIri(this.nsMap()));
    if (sys.ObjUtil.is(object, Iri.type$)) {
      (object = sys.ObjUtil.as(object, Iri.type$).prefixIri(this.nsMap()));
    }
    ;
    let subjId = subject.toStr();
    let newSubj = sys.ObjUtil.compareNE(this.#curSubj.get(JsonLD.id()), subjId);
    if (newSubj) {
      this.finishSubj();
      this.#curSubj.set(JsonLD.id(), subjId);
    }
    ;
    let predKey = predicate.toStr();
    let predVal = this.#curSubj.get(predKey);
    let obj = this.encObj(object, typeOrLocale);
    if (predVal == null) {
      this.#curSubj.set(predKey, obj);
    }
    else {
      if (sys.ObjUtil.is(predVal, sys.Type.find("sys::List"))) {
        sys.ObjUtil.as(predVal, sys.Type.find("sys::List")).add(obj);
      }
      else {
        this.#curSubj.set(predKey, sys.List.make(sys.Obj.type$, [sys.ObjUtil.coerce(predVal, sys.Obj.type$), obj]));
      }
      ;
    }
    ;
    return this;
  }

  writeSubj(subj) {
    this.#curSubj.set(JsonLD.id(), subj.toStr());
    return this;
  }

  writeVal(val) {
    if (sys.ObjUtil.is(val, sys.Type.find("sys::Map"))) {
      return this.writeMap(sys.ObjUtil.coerce(val, sys.Type.find("[sys::Str:sys::Obj]")));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return this.writeList(sys.ObjUtil.coerce(val, sys.Type.find("sys::List")));
    }
    ;
    return this.writeScalar(val);
  }

  writeMap(m) {
    const this$ = this;
    if (m.isEmpty()) {
      return sys.ObjUtil.coerce(this.writeChars("{}"), JsonLdOutStream.type$);
    }
    ;
    this.writeChar(123);
    let first = true;
    m.each((val,key) => {
      if (!first) {
        this$.writeChar(44);
      }
      else {
        (first = false);
      }
      ;
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(this$.writeChars(sys.Str.toCode(key)), JsonLdOutStream.type$).writeChar(58), JsonLdOutStream.type$).writeVal(val);
      return;
    });
    return sys.ObjUtil.coerce(this.writeChar(125), JsonLdOutStream.type$);
  }

  writeList(arr) {
    const this$ = this;
    this.writeChar(91);
    arr.each((val,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        this$.writeChar(44);
      }
      ;
      this$.writeVal(sys.ObjUtil.coerce(val, sys.Obj.type$));
      return;
    });
    return sys.ObjUtil.coerce(this.writeChar(93), JsonLdOutStream.type$);
  }

  writeScalar(val) {
    let $_u13 = sys.ObjUtil.typeof(val);
    if (sys.ObjUtil.equals($_u13, sys.Bool.type$) || sys.ObjUtil.equals($_u13, sys.Int.type$) || sys.ObjUtil.equals($_u13, sys.Float.type$) || sys.ObjUtil.equals($_u13, sys.Decimal.type$)) {
      return sys.ObjUtil.coerce(this.writeChars(sys.ObjUtil.toStr(val)), JsonLdOutStream.type$);
    }
    else {
      return sys.ObjUtil.coerce(this.writeRdfStr(sys.ObjUtil.toStr(val)), JsonLdOutStream.type$);
    }
    ;
  }

  encObj(object,typeOrLocale) {
    let $_u14 = sys.ObjUtil.typeof(object);
    if (sys.ObjUtil.equals($_u14, Iri.type$)) {
      return this.newMap().set(JsonLD.id(), sys.ObjUtil.toStr(object));
    }
    else if (sys.ObjUtil.equals($_u14, sys.Bool.type$) || sys.ObjUtil.equals($_u14, sys.Int.type$) || sys.ObjUtil.equals($_u14, sys.Float.type$) || sys.ObjUtil.equals($_u14, sys.Decimal.type$)) {
      return object;
    }
    else if (sys.ObjUtil.equals($_u14, sys.Buf.type$)) {
      return this.typedVal(object, Xsd.hexBinary());
    }
    else if (sys.ObjUtil.equals($_u14, sys.Date.type$)) {
      return this.typedVal(object, Xsd.date());
    }
    else if (sys.ObjUtil.equals($_u14, sys.Time.type$)) {
      return this.typedVal(object, Xsd.time());
    }
    else if (sys.ObjUtil.equals($_u14, sys.DateTime.type$)) {
      return this.typedVal(object, Xsd.dateTime());
    }
    else if (sys.ObjUtil.equals($_u14, sys.Uri.type$)) {
      return this.typedVal(object, Xsd.anyURI());
    }
    ;
    let locale = sys.ObjUtil.as(typeOrLocale, sys.Locale.type$);
    if (locale != null) {
      return this.newMap().set(JsonLD.value(), sys.ObjUtil.toStr(object)).set(JsonLD.lang(), locale.toStr());
    }
    else {
      if (sys.ObjUtil.is(typeOrLocale, Iri.type$)) {
        return this.typedVal(object, sys.ObjUtil.coerce(typeOrLocale, Iri.type$));
      }
      else {
        return sys.ObjUtil.toStr(object);
      }
      ;
    }
    ;
  }

  typedVal(val,type) {
    return this.newMap().set(JsonLD.value(), Xsd.encode(val)).set(JsonLD.type(), type.toStr());
  }

  newMap() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj]"));
  }

}

class JsonLD extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JsonLD.type$; }

  static #context = undefined;

  static context() {
    if (JsonLD.#context === undefined) {
      JsonLD.static$init();
      if (JsonLD.#context === undefined) JsonLD.#context = null;
    }
    return JsonLD.#context;
  }

  static #graph = undefined;

  static graph() {
    if (JsonLD.#graph === undefined) {
      JsonLD.static$init();
      if (JsonLD.#graph === undefined) JsonLD.#graph = null;
    }
    return JsonLD.#graph;
  }

  static #id = undefined;

  static id() {
    if (JsonLD.#id === undefined) {
      JsonLD.static$init();
      if (JsonLD.#id === undefined) JsonLD.#id = null;
    }
    return JsonLD.#id;
  }

  static #lang = undefined;

  static lang() {
    if (JsonLD.#lang === undefined) {
      JsonLD.static$init();
      if (JsonLD.#lang === undefined) JsonLD.#lang = null;
    }
    return JsonLD.#lang;
  }

  static #type = undefined;

  static type() {
    if (JsonLD.#type === undefined) {
      JsonLD.static$init();
      if (JsonLD.#type === undefined) JsonLD.#type = null;
    }
    return JsonLD.#type;
  }

  static #value = undefined;

  static value() {
    if (JsonLD.#value === undefined) {
      JsonLD.static$init();
      if (JsonLD.#value === undefined) JsonLD.#value = null;
    }
    return JsonLD.#value;
  }

  static make() {
    const $self = new JsonLD();
    JsonLD.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    JsonLD.#context = "@context";
    JsonLD.#graph = "@graph";
    JsonLD.#id = "@id";
    JsonLD.#lang = "@language";
    JsonLD.#type = "@type";
    JsonLD.#value = "@value";
    return;
  }

}

class StmtTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
    this.#nsMap = sys.Map.__fromLiteral(["phIoT"], ["http://project-haystack.org/phIoT#"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    return;
  }

  typeof() { return StmtTest.type$; }

  #nsMap = null;

  nsMap(it) {
    if (it === undefined) {
      return this.#nsMap;
    }
    else {
      this.#nsMap = it;
      return;
    }
  }

  testEquality() {
    let s1 = Iri.make("http://ph#foo");
    let s2 = Iri.make("http://ph#bar");
    let p1 = Iri.make("http://ph#is");
    this.verifyEq(Stmt.make(s1, p1, s1), Stmt.make(s1, p1, s1));
    this.verifyEq(Stmt.make(s1, p1, "foo"), Stmt.make(s1, p1, "foo"));
    return;
  }

  testNormalize() {
    let preStmt = Stmt.make(Iri.make("phIoT:subj"), Iri.make("phIoT:pred"), Iri.make("phIoT:obj"));
    let ns = this.#nsMap.get("phIoT");
    let normStmt = Stmt.make(Iri.make(sys.Str.plus(sys.Str.plus("", ns), "subj")), Iri.make(sys.Str.plus(sys.Str.plus("", ns), "pred")), Iri.make(sys.Str.plus(sys.Str.plus("", ns), "obj")));
    this.verifyNotEq(preStmt, normStmt);
    this.verifyEq(preStmt.normalize(this.#nsMap), normStmt);
    this.verifyEq(normStmt.prefix(this.#nsMap), preStmt);
    return;
  }

  static make() {
    const $self = new StmtTest();
    StmtTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    ;
    return;
  }

}

class IriTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
    this.#nsMap = sys.Map.__fromLiteral(["phIoT"], ["http://project-haystack.org/phIoT#"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    return;
  }

  typeof() { return IriTest.type$; }

  #nsMap = null;

  nsMap(it) {
    if (it === undefined) {
      return this.#nsMap;
    }
    else {
      this.#nsMap = it;
      return;
    }
  }

  testEquality() {
    let i1 = Iri.make("http://project-haystack.org/ph#foo");
    let i2 = Iri.makeNs("http://project-haystack.org/ph#", "foo");
    this.verifyEq(i1, i1);
    this.verifyEq(i1, i2);
    this.verifyNotEq(i1, Iri.makeNs("http:/project-haystack.org/ph#", "Foo"));
    (i1 = Iri.make("phIot:foo"));
    (i2 = Iri.makeNs("phIot:", "foo"));
    this.verifyEq(i1, i2);
    this.verifyNotEq(i1, Iri.makeNs("phiot:", "foo"));
    return;
  }

  testFullIri() {
    let i1 = Iri.make("phIoT:foo");
    let i2 = Iri.make("http://project-haystack.org/phIoT#foo");
    this.verifyNotEq(i1, i2);
    this.verifyEq(i2, i1.fullIri(this.#nsMap));
    this.verifyEq(i2, i2.fullIri(this.#nsMap));
    return;
  }

  testPrefixIri() {
    let i1 = Iri.make("phIoT:foo");
    let i2 = Iri.make("http://project-haystack.org/phIoT#foo");
    this.verifyNotEq(i1, i2);
    this.verifyEq(i1, i2.prefixIri(this.#nsMap));
    this.verifyEq(i1, i1.prefixIri(this.#nsMap));
    return;
  }

  testBlankNode() {
    let b1 = Iri.bnode();
    this.verify(b1.isBlankNode());
    let b2 = Iri.bnode();
    this.verifyNotEq(b1, b2);
    this.verifyEq(Iri.bnode("foo"), Iri.bnode("foo"));
    return;
  }

  static make() {
    const $self = new IriTest();
    IriTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    ;
    return;
  }

}

class TurtleOutStreamTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
    this.#b = sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$);
    return;
  }

  typeof() { return TurtleOutStreamTest.type$; }

  static #tab = undefined;

  static tab() {
    if (TurtleOutStreamTest.#tab === undefined) {
      TurtleOutStreamTest.static$init();
      if (TurtleOutStreamTest.#tab === undefined) TurtleOutStreamTest.#tab = null;
    }
    return TurtleOutStreamTest.#tab;
  }

  static #tab2 = undefined;

  static tab2() {
    if (TurtleOutStreamTest.#tab2 === undefined) {
      TurtleOutStreamTest.static$init();
      if (TurtleOutStreamTest.#tab2 === undefined) TurtleOutStreamTest.#tab2 = null;
    }
    return TurtleOutStreamTest.#tab2;
  }

  #b = null;

  b(it) {
    if (it === undefined) {
      return this.#b;
    }
    else {
      this.#b = it;
      return;
    }
  }

  writer(buf) {
    if (buf === undefined) buf = this.#b;
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(TurtleOutStream.make(buf.clear().out()).setNs("t", "http://skyfoundry.com/rdf/test#"), TurtleOutStream.type$).setNs("phIoT", "http://project-haystack.org/phIoT#"), TurtleOutStream.type$);
  }

  testPrefixes() {
    this.writer().finish();
    this.verifyTurtle("");
    return;
  }

  testPrefixCaseSensitivity() {
    sys.ObjUtil.coerce(this.writer().writeStmt(Iri.make("phIoT:area"), Iri.make("phiot:foo"), sys.ObjUtil.coerce(1, sys.Obj.type$)), TurtleOutStream.type$).finish();
    this.verifyTurtle("phIoT:area <phiot:foo> 1 .");
    return;
  }

  testPrefixedStmt() {
    sys.ObjUtil.coerce(this.writer().writeStmt(Iri.make("t:foo"), Iri.make("rdf:type"), Iri.make("t:Foo")), TurtleOutStream.type$).finish();
    this.verifyTurtle("t:foo a t:Foo .");
    return;
  }

  testExpandedStmt() {
    sys.ObjUtil.coerce(this.writer().writeStmt(Iri.make("x:foo"), Iri.make("x:type"), Iri.make("x:Foo")), TurtleOutStream.type$).finish();
    this.verifyTurtle("<x:foo> <x:type> <x:Foo> .");
    return;
  }

  testDifferentSubjects() {
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.writer().writeStmt(Iri.make("t:foo"), Iri.make("rdf:type"), Iri.make("t:Foo")), TurtleOutStream.type$).writeStmt(Iri.make("t:foo1"), Iri.make("rdf:type"), Iri.make("t:Foo")), TurtleOutStream.type$).finish();
    this.verifyTurtle("t:foo a t:Foo .\n\nt:foo1 a t:Foo .");
    return;
  }

  testSameSubjWithDifferentPreds() {
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.writer().writeStmt(Iri.make("t:foo"), Iri.make("rdf:type"), Iri.make("t:Foo")), TurtleOutStream.type$).writeStmt(Iri.make("t:foo"), Iri.make("t:name"), "Matthew"), TurtleOutStream.type$).writeStmt(Iri.make("t:foo"), Iri.make("t:email"), "matthew@skyfoundry.com"), TurtleOutStream.type$).finish();
    this.verifyTurtle(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("t:foo a t:Foo ;\n", TurtleOutStreamTest.tab()), "t:name \"Matthew\" ;\n"), TurtleOutStreamTest.tab()), "t:email \"matthew@skyfoundry.com\" ."));
    return;
  }

  testSameSubjPredWithDifferentObjects() {
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.writer().writeStmt(Iri.make("t:foo"), Iri.make("rdf:type"), Iri.make("t:Obj")), TurtleOutStream.type$).writeStmt(Iri.make("t:foo"), Iri.make("rdf:type"), Iri.make("t:BaseFoo")), TurtleOutStream.type$).writeStmt(Iri.make("t:foo"), Iri.make("rdf:type"), Iri.make("t:Foo")), TurtleOutStream.type$).finish();
    this.verifyTurtle(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("t:foo a t:Obj,\n", TurtleOutStreamTest.tab2()), "t:BaseFoo,\n"), TurtleOutStreamTest.tab2()), "t:Foo ."));
    return;
  }

  testCustomDataType() {
    sys.ObjUtil.coerce(this.writer().writeStmt(Iri.make("t:foo"), Iri.make("t:type"), sys.Str.type$, Iri.make("https://fantom.org/types#sys::Type")), TurtleOutStream.type$).finish();
    this.verifyTurtle("t:foo t:type \"sys::Str\"^^<https://fantom.org/types#sys::Type> .");
    return;
  }

  testBlankNodes() {
    sys.ObjUtil.coerce(this.writer().writeStmt(Iri.bnode("123-456"), Iri.make("phIoT:siteRef"), Iri.bnode("abc-123")), TurtleOutStream.type$).finish();
    this.verifyTurtle("_:123-456 phIoT:siteRef _:abc-123 .");
    return;
  }

  verifyTurtle(expected,ttl) {
    if (ttl === undefined) ttl = this.#b.flip().readAllStr();
    if (!sys.Str.isEmpty(expected)) {
      (expected = sys.Str.plus(sys.Str.plus("\n", expected), "\n"));
    }
    ;
    (expected = sys.Str.plus("@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n@prefix t: <http://skyfoundry.com/rdf/test#> .\n@prefix phIoT: <http://project-haystack.org/phIoT#> .\n", expected));
    try {
      this.verifyEq(expected, ttl);
    }
    catch ($_u15) {
      $_u15 = sys.Err.make($_u15);
      if ($_u15 instanceof sys.Err) {
        let e = $_u15;
        ;
        sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expected:\n", expected), "\n---\nActual:\n"), ttl), "\n---\n"));
        throw e;
      }
      else {
        throw $_u15;
      }
    }
    ;
    return;
  }

  static make() {
    const $self = new TurtleOutStreamTest();
    TurtleOutStreamTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    ;
    return;
  }

  static static$init() {
    TurtleOutStreamTest.#tab = "    ";
    TurtleOutStreamTest.#tab2 = sys.Str.plus(sys.Str.plus(sys.Str.plus("", TurtleOutStreamTest.#tab), ""), TurtleOutStreamTest.#tab);
    return;
  }

}

class JsonLdOutStreamTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
    this.#b = sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$);
    return;
  }

  typeof() { return JsonLdOutStreamTest.type$; }

  static #tab = undefined;

  static tab() {
    if (JsonLdOutStreamTest.#tab === undefined) {
      JsonLdOutStreamTest.static$init();
      if (JsonLdOutStreamTest.#tab === undefined) JsonLdOutStreamTest.#tab = null;
    }
    return JsonLdOutStreamTest.#tab;
  }

  static #tab2 = undefined;

  static tab2() {
    if (JsonLdOutStreamTest.#tab2 === undefined) {
      JsonLdOutStreamTest.static$init();
      if (JsonLdOutStreamTest.#tab2 === undefined) JsonLdOutStreamTest.#tab2 = null;
    }
    return JsonLdOutStreamTest.#tab2;
  }

  #b = null;

  b(it) {
    if (it === undefined) {
      return this.#b;
    }
    else {
      this.#b = it;
      return;
    }
  }

  out(buf) {
    if (buf === undefined) buf = this.#b;
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(JsonLdOutStream.make(buf.clear().out()).setNs("t", "http://skyfoundry.com/rdf/test#"), JsonLdOutStream.type$).setNs("phIoT", "http://project-haystack.org/phIoT#"), JsonLdOutStream.type$);
  }

  m() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj]"));
  }

  testPrefixes() {
    this.out().finish();
    this.verifyJson("");
    return;
  }

  testPrefixCaseSensitivity() {
    sys.ObjUtil.coerce(this.out().writeStmt(Iri.make("phIoT:area"), Iri.make("phiot:foo"), sys.ObjUtil.coerce(1, sys.Obj.type$)), JsonLdOutStream.type$).finish();
    this.verifyJson("{\"@id\":\"phIoT:area\",\"phiot:foo\":1}");
    return;
  }

  testBlankNodes() {
    sys.ObjUtil.coerce(this.out().writeStmt(Iri.bnode("123-456"), Iri.make("phIoT:siteRef"), Iri.bnode("abc-123")), JsonLdOutStream.type$).finish();
    this.verifyJson("{\"@id\":\"_:123-456\",\"phIoT:siteRef\":{\"@id\":\"_:abc-123\"}}");
    return;
  }

  testPrefixedStmt() {
    sys.ObjUtil.coerce(this.out().writeStmt(Iri.make("t:foo"), Iri.make("rdf:type"), Iri.make("t:Foo")), JsonLdOutStream.type$).finish();
    this.verifyJson("{\"@id\":\"t:foo\",\"rdf:type\":{\"@id\":\"t:Foo\"}}");
    return;
  }

  testDifferentSubjects() {
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.out().writeStmt(Iri.make("t:foo"), Iri.make("rdf:type"), Iri.make("t:Foo")), JsonLdOutStream.type$).writeStmt(Iri.make("t:foo1"), Iri.make("rdf:type"), Iri.make("t:Foo")), JsonLdOutStream.type$).finish();
    this.verifyJson("{\"@id\":\"t:foo\",\"rdf:type\":{\"@id\":\"t:Foo\"}},\n{\"@id\":\"t:foo1\",\"rdf:type\":{\"@id\":\"t:Foo\"}}");
    return;
  }

  testSameSubjWithDifferentPreds() {
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.out().writeStmt(Iri.make("t:foo"), Iri.make("rdf:type"), Iri.make("t:Foo")), JsonLdOutStream.type$).writeStmt(Iri.make("t:foo"), Iri.make("t:name"), "Matthew"), JsonLdOutStream.type$).writeStmt(Iri.make("t:foo"), Iri.make("t:email"), "matthew@skyfoundry.com"), JsonLdOutStream.type$).finish();
    this.verifyJson("{\"@id\":\"t:foo\",\"rdf:type\":{\"@id\":\"t:Foo\"},\"t:name\":\"Matthew\",\"t:email\":\"matthew@skyfoundry.com\"}");
    return;
  }

  testSameSubjPredWithDifferentObjects() {
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.out().writeStmt(Iri.make("t:foo"), Iri.make("rdf:type"), Iri.make("t:Obj")), JsonLdOutStream.type$).writeStmt(Iri.make("t:foo"), Iri.make("rdf:type"), Iri.make("t:BaseFoo")), JsonLdOutStream.type$).writeStmt(Iri.make("t:foo"), Iri.make("rdf:type"), Iri.make("t:Foo")), JsonLdOutStream.type$).finish();
    this.verifyJson("{\"@id\":\"t:foo\",\"rdf:type\":[{\"@id\":\"t:Obj\"},{\"@id\":\"t:BaseFoo\"},{\"@id\":\"t:Foo\"}]}");
    return;
  }

  testCustomDataType() {
    sys.ObjUtil.coerce(this.out().writeStmt(Iri.make("t:foo"), Iri.make("t:type"), sys.Str.type$, Iri.make("https://fantom.org/types#sys::Type")), JsonLdOutStream.type$).finish();
    this.verifyJson("{\"@id\":\"t:foo\",\"t:type\":{\"@value\":\"sys::Str\",\"@type\":\"https://fantom.org/types#sys::Type\"}}");
    return;
  }

  verifyJson(graph,json) {
    if (json === undefined) json = this.#b.flip().readAllStr();
    let expected = sys.Str.plus(sys.Str.plus("{\n\"@context\":{\"rdf\":\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\",\"rdfs\":\"http://www.w3.org/2000/01/rdf-schema#\",\"xsd\":\"http://www.w3.org/2001/XMLSchema#\",\"t\":\"http://skyfoundry.com/rdf/test#\",\"phIoT\":\"http://project-haystack.org/phIoT#\"},\n\"@graph\":[", graph), "]}");
    try {
      this.verifyEq(expected, json);
    }
    catch ($_u16) {
      $_u16 = sys.Err.make($_u16);
      if ($_u16 instanceof sys.Err) {
        let e = $_u16;
        ;
        sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expected:\n", expected), "\n---\nActual:\n"), json), "\n---\n"));
        throw e;
      }
      else {
        throw $_u16;
      }
    }
    ;
    return;
  }

  static make() {
    const $self = new JsonLdOutStreamTest();
    JsonLdOutStreamTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    ;
    return;
  }

  static static$init() {
    JsonLdOutStreamTest.#tab = "    ";
    JsonLdOutStreamTest.#tab2 = sys.Str.plus(sys.Str.plus(sys.Str.plus("", JsonLdOutStreamTest.#tab), ""), JsonLdOutStreamTest.#tab);
    return;
  }

}

const p = sys.Pod.add$('rdf');
const xp = sys.Param.noParams$();
let m;
Stmt.type$ = p.at$('Stmt','sys::Obj',[],{'sys::Js':""},8194,Stmt);
Iri.type$ = p.at$('Iri','sys::Obj',[],{'sys::Js':""},8226,Iri);
RdfOutStream.type$ = p.at$('RdfOutStream','sys::OutStream',[],{'sys::Js':""},8193,RdfOutStream);
Xsd.type$ = p.am$('Xsd','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8449,Xsd);
TurtleOutStream.type$ = p.at$('TurtleOutStream','rdf::RdfOutStream',[],{'sys::Js':""},8192,TurtleOutStream);
JsonLdOutStream.type$ = p.at$('JsonLdOutStream','rdf::RdfOutStream',[],{'sys::Js':""},8192,JsonLdOutStream);
JsonLD.type$ = p.at$('JsonLD','sys::Obj',[],{'sys::Js':""},129,JsonLD);
StmtTest.type$ = p.at$('StmtTest','sys::Test',[],{'sys::Js':""},8192,StmtTest);
IriTest.type$ = p.at$('IriTest','sys::Test',[],{'sys::Js':""},8192,IriTest);
TurtleOutStreamTest.type$ = p.at$('TurtleOutStreamTest','sys::Test',[],{'sys::Js':""},8192,TurtleOutStreamTest);
JsonLdOutStreamTest.type$ = p.at$('JsonLdOutStreamTest','sys::Test',[],{'sys::Js':""},8192,JsonLdOutStreamTest);
Stmt.type$.af$('subj',73730,'rdf::Iri',{}).af$('pred',73730,'rdf::Iri',{}).af$('obj',73730,'sys::Obj',{}).af$('hash',336898,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('subject','rdf::Iri',false),new sys.Param('predicate','rdf::Iri',false),new sys.Param('object','sys::Obj',false)]),{}).am$('hashObj',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj?',false)]),{}).am$('hashCombine',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('h1','sys::Int',false),new sys.Param('h2','sys::Int',false)]),{}).am$('normalize',8192,'rdf::Stmt',sys.List.make(sys.Param.type$,[new sys.Param('prefixMap','[sys::Str:sys::Str]',false)]),{}).am$('prefix',8192,'rdf::Stmt',sys.List.make(sys.Param.type$,[new sys.Param('prefixMap','[sys::Str:sys::Str]',false)]),{}).am$('compare',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
Iri.type$.af$('iri',67586,'sys::Str',{}).af$('nameIdx',67586,'sys::Int',{}).am$('bnode',40962,'rdf::Iri',sys.List.make(sys.Param.type$,[new sys.Param('label','sys::Str',true)]),{}).am$('makeNs',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','sys::Str',false),new sys.Param('name','sys::Str',false)]),{}).am$('makeUri',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('iri','sys::Str',false)]),{}).am$('toNameIdx',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('iri','sys::Str',false)]),{}).am$('ns',8192,'sys::Str',xp,{}).am$('name',8192,'sys::Str',xp,{}).am$('uri',8192,'sys::Uri',xp,{}).am$('isBlankNode',8192,'sys::Bool',xp,{}).am$('prefixIri',8192,'rdf::Iri',sys.List.make(sys.Param.type$,[new sys.Param('prefixMap','[sys::Str:sys::Str]',false)]),{}).am$('fullIri',8192,'rdf::Iri',sys.List.make(sys.Param.type$,[new sys.Param('prefixMap','[sys::Str:sys::Str]',false)]),{}).am$('compare',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
RdfOutStream.type$.af$('nsMap',69632,'[sys::Str:sys::Str]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('setNs',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('prefix','sys::Str',false),new sys.Param('namespace','sys::Str',false)]),{}).am$('onSetNs',266240,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('prefix','sys::Str',false),new sys.Param('namespace','sys::Str',false)]),{}).am$('finish',270336,'sys::This',xp,{}).am$('close',271360,'sys::Bool',xp,{}).am$('writeStmt',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('subject','rdf::Iri',false),new sys.Param('predicate','rdf::Iri',false),new sys.Param('object','sys::Obj',false),new sys.Param('typeOrLocale','sys::Obj?',true)]),{}).am$('writeRdfStr',4096,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('nl',4096,'sys::This',xp,{}).am$('tab',4096,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('num','sys::Int',true),new sys.Param('spaces','sys::Int',true)]),{});
Xsd.type$.af$('ns',106498,'sys::Str',{}).af$('string',106498,'rdf::Iri',{}).af$('float',106498,'rdf::Iri',{}).af$('double',106498,'rdf::Iri',{}).af$('boolean',106498,'rdf::Iri',{}).af$('anyURI',106498,'rdf::Iri',{}).af$('hexBinary',106498,'rdf::Iri',{}).af$('date',106498,'rdf::Iri',{}).af$('time',106498,'rdf::Iri',{}).af$('dateTime',106498,'rdf::Iri',{}).am$('encode',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
TurtleOutStream.type$.af$('xsdNs',100354,'rdf::Iri',{}).af$('rdfType',100354,'rdf::Iri',{}).af$('prevSubj',67584,'rdf::Iri?',{}).af$('prevPred',67584,'rdf::Iri?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('finish',271360,'sys::This',xp,{}).am$('onSetNs',267264,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('prefix','sys::Str',false),new sys.Param('namespace','sys::Str',false)]),{}).am$('writeStmt',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('subject','rdf::Iri',false),new sys.Param('predicate','rdf::Iri',false),new sys.Param('object','sys::Obj',false),new sys.Param('typeOrLocale','sys::Obj?',true)]),{}).am$('writePredIri',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('normIri','rdf::Iri',false)]),{}).am$('writePreOrIri',128,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('normIri','rdf::Iri',false)]),{}).am$('writeObject',128,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('object','sys::Obj',false),new sys.Param('typeOrLocale','sys::Obj?',false)]),{}).am$('writeStr',128,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('locale','sys::Locale?',true)]),{}).am$('writeXsd',128,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('object','sys::Obj',false),new sys.Param('type','rdf::Iri',false)]),{}).am$('writeType',128,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('typeIri','rdf::Iri',false)]),{}).am$('isLabelName',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('validateBlankNode',40962,'rdf::Iri',sys.List.make(sys.Param.type$,[new sys.Param('iri','rdf::Iri',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
JsonLdOutStream.type$.af$('graph',67584,'[sys::Str:sys::Obj][]',{}).af$('wroteContext',67584,'sys::Bool',{}).af$('curSubj',67584,'[sys::Str:sys::Obj]',{}).af$('firstSubj',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('finishContext',2048,'sys::This',xp,{}).am$('finishSubj',2048,'sys::This',xp,{}).am$('finish',271360,'sys::This',xp,{}).am$('onSetNs',267264,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('prefix','sys::Str',false),new sys.Param('namespace','sys::Str',false)]),{}).am$('writeStmt',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('subject','rdf::Iri',false),new sys.Param('predicate','rdf::Iri',false),new sys.Param('object','sys::Obj',false),new sys.Param('typeOrLocale','sys::Obj?',true)]),{}).am$('writeSubj',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('subj','rdf::Iri',false)]),{}).am$('writeVal',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('writeMap',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('m','[sys::Str:sys::Obj]',false)]),{}).am$('writeList',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('arr','sys::List',false)]),{}).am$('writeScalar',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('encObj',2048,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('object','sys::Obj',false),new sys.Param('typeOrLocale','sys::Obj?',false)]),{}).am$('typedVal',2048,'sys::Map',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('type','rdf::Iri',false)]),{}).am$('newMap',2048,'[sys::Str:sys::Obj]',xp,{});
JsonLD.type$.af$('context',106498,'sys::Str',{}).af$('graph',106498,'sys::Str',{}).af$('id',106498,'sys::Str',{}).af$('lang',106498,'sys::Str',{}).af$('type',106498,'sys::Str',{}).af$('value',106498,'sys::Str',{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
StmtTest.type$.af$('nsMap',73728,'[sys::Str:sys::Str]',{}).am$('testEquality',8192,'sys::Void',xp,{}).am$('testNormalize',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
IriTest.type$.af$('nsMap',73728,'[sys::Str:sys::Str]',{}).am$('testEquality',8192,'sys::Void',xp,{}).am$('testFullIri',8192,'sys::Void',xp,{}).am$('testPrefixIri',8192,'sys::Void',xp,{}).am$('testBlankNode',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
TurtleOutStreamTest.type$.af$('tab',100354,'sys::Str',{}).af$('tab2',100354,'sys::Str',{}).af$('b',73728,'sys::Buf',{}).am$('writer',8192,'rdf::TurtleOutStream',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',true)]),{}).am$('testPrefixes',8192,'sys::Void',xp,{}).am$('testPrefixCaseSensitivity',8192,'sys::Void',xp,{}).am$('testPrefixedStmt',8192,'sys::Void',xp,{}).am$('testExpandedStmt',8192,'sys::Void',xp,{}).am$('testDifferentSubjects',8192,'sys::Void',xp,{}).am$('testSameSubjWithDifferentPreds',8192,'sys::Void',xp,{}).am$('testSameSubjPredWithDifferentObjects',8192,'sys::Void',xp,{}).am$('testCustomDataType',8192,'sys::Void',xp,{}).am$('testBlankNodes',8192,'sys::Void',xp,{}).am$('verifyTurtle',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expected','sys::Str',false),new sys.Param('ttl','sys::Str',true)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
JsonLdOutStreamTest.type$.af$('tab',100354,'sys::Str',{}).af$('tab2',100354,'sys::Str',{}).af$('b',73728,'sys::Buf',{}).am$('out',8192,'rdf::JsonLdOutStream',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',true)]),{}).am$('m',2048,'[sys::Str:sys::Obj]',xp,{}).am$('testPrefixes',8192,'sys::Void',xp,{}).am$('testPrefixCaseSensitivity',8192,'sys::Void',xp,{}).am$('testBlankNodes',8192,'sys::Void',xp,{}).am$('testPrefixedStmt',8192,'sys::Void',xp,{}).am$('testDifferentSubjects',8192,'sys::Void',xp,{}).am$('testSameSubjWithDifferentPreds',8192,'sys::Void',xp,{}).am$('testSameSubjPredWithDifferentObjects',8192,'sys::Void',xp,{}).am$('testCustomDataType',8192,'sys::Void',xp,{}).am$('verifyJson',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('graph','sys::Str',false),new sys.Param('json','sys::Str',true)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "rdf");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0");
m.set("pod.summary", "Resource Description Framework (RDF)");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:24-05:00 New_York");
m.set("build.tsKey", "241210143124");
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
  Stmt,
  Iri,
  RdfOutStream,
  Xsd,
  TurtleOutStream,
  JsonLdOutStream,
  StmtTest,
  IriTest,
  TurtleOutStreamTest,
  JsonLdOutStreamTest,
};
