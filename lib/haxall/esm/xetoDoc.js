// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as markdown from './markdown.js'
import * as util from './util.js'
import * as web from './web.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
import * as xetoEnv from './xetoEnv.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class DocSpec extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocSpec.type$; }

  static make() {
    const $self = new DocSpec();
    DocSpec.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DocPage {
  constructor() {
    const this$ = this;
  }

  typeof() { return DocPage.type$; }

  static decode(obj) {
    let pageType = DocPageType.fromStr(sys.ObjUtil.coerce(obj.getChecked("page"), sys.Str.type$));
    let $_u0 = pageType;
    if (sys.ObjUtil.equals($_u0, DocPageType.lib())) {
      return DocLib.doDecode(obj);
    }
    else if (sys.ObjUtil.equals($_u0, DocPageType.type())) {
      return DocType.doDecode(obj);
    }
    else if (sys.ObjUtil.equals($_u0, DocPageType.global())) {
      return DocGlobal.doDecode(obj);
    }
    else if (sys.ObjUtil.equals($_u0, DocPageType.instance())) {
      return DocInstance.doDecode(obj);
    }
    else if (sys.ObjUtil.equals($_u0, DocPageType.chapter())) {
      return DocChapter.doDecode(obj);
    }
    else {
      throw sys.Err.make(sys.Str.plus("Unknown page type: ", pageType));
    }
    ;
  }

  dump(out) {
    if (out === undefined) out = sys.Env.cur().out();
    out.print(util.JsonOutStream.prettyPrintToStr(this.encode()));
    return;
  }

}

class DocSpecPage extends DocSpec {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return DocSpecPage.type$; }

  dump() { return DocPage.prototype.dump.apply(this, arguments); }

  #qname = null;

  qname() { return this.#qname; }

  __qname(it) { if (it === undefined) return this.#qname; else this.#qname = it; }

  #doc = null;

  doc() { return this.#doc; }

  __doc(it) { if (it === undefined) return this.#doc; else this.#doc = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #libName$Store = undefined;

  // private field reflection only
  __libName$Store(it) { if (it === undefined) return this.#libName$Store; else this.#libName$Store = it; }

  #name$Store = undefined;

  // private field reflection only
  __name$Store(it) { if (it === undefined) return this.#name$Store; else this.#name$Store = it; }

  static make(qname,doc,meta) {
    const $self = new DocSpecPage();
    DocSpecPage.make$($self,qname,doc,meta);
    return $self;
  }

  static make$($self,qname,doc,meta) {
    DocSpec.make$($self);
    ;
    $self.#qname = qname;
    $self.#doc = doc;
    $self.#meta = meta;
    return;
  }

  libName() {
    if (this.#libName$Store === undefined) {
      this.#libName$Store = this.libName$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#libName$Store, sys.Str.type$);
  }

  name() {
    if (this.#name$Store === undefined) {
      this.#name$Store = this.name$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#name$Store, sys.Str.type$);
  }

  lib() {
    return DocLibRef.make(this.libName());
  }

  encode() {
    let obj = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    obj.ordered(true);
    obj.set("page", this.pageType().name());
    obj.set("qname", this.#qname);
    obj.set("doc", this.#doc.encode());
    obj.addNotNull("meta", this.#meta.encode());
    return obj;
  }

  libName$Once() {
    return sys.ObjUtil.coerce(xetoEnv.XetoUtil.qnameToLib(this.#qname), sys.Str.type$);
  }

  name$Once() {
    return sys.ObjUtil.coerce(xetoEnv.XetoUtil.qnameToName(this.#qname), sys.Str.type$);
  }

}

class DocType extends DocSpecPage {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocType.type$; }

  #base = null;

  base() { return this.#base; }

  __base(it) { if (it === undefined) return this.#base; else this.#base = it; }

  #supertypes = null;

  supertypes() { return this.#supertypes; }

  __supertypes(it) { if (it === undefined) return this.#supertypes; else this.#supertypes = it; }

  #subtypes = null;

  subtypes() { return this.#subtypes; }

  __subtypes(it) { if (it === undefined) return this.#subtypes; else this.#subtypes = it; }

  #slots = null;

  slots() { return this.#slots; }

  __slots(it) { if (it === undefined) return this.#slots; else this.#slots = it; }

  static make(qname,doc,meta,base,supertypes,subtypes,slots) {
    const $self = new DocType();
    DocType.make$($self,qname,doc,meta,base,supertypes,subtypes,slots);
    return $self;
  }

  static make$($self,qname,doc,meta,base,supertypes,subtypes,slots) {
    DocSpecPage.make$($self, qname, doc, meta);
    $self.#base = base;
    $self.#supertypes = supertypes;
    $self.#subtypes = subtypes;
    $self.#slots = sys.ObjUtil.coerce(((this$) => { let $_u1 = slots; if ($_u1 == null) return null; return sys.ObjUtil.toImmutable(slots); })($self), sys.Type.find("[sys::Str:xetoDoc::DocSlot]"));
    return;
  }

  pageType() {
    return DocPageType.type();
  }

  uri() {
    return DocUtil.typeToUri(this.qname());
  }

  encode() {
    let obj = DocSpecPage.prototype.encode.call(this);
    obj.addNotNull("base", ((this$) => { let $_u2 = this$.#base; if ($_u2 == null) return null; return this$.#base.encode(); })(this));
    obj.addNotNull("supertypes", this.#supertypes.encode());
    obj.addNotNull("subtypes", this.#subtypes.encode());
    obj.addNotNull("slots", DocSlot.encodeMap(this.#slots));
    return obj;
  }

  static doDecode(obj) {
    let qname = obj.getChecked("qname");
    let doc = DocMarkdown.decode(obj.get("doc"));
    let meta = DocDict.decode(sys.ObjUtil.coerce(obj.get("meta"), sys.Type.find("[sys::Str:sys::Obj]?")));
    let base = DocTypeRef.decode(obj.get("base"));
    let supertypes = DocTypeGraph.decode(sys.ObjUtil.coerce(obj.get("supertypes"), sys.Type.find("[sys::Str:sys::Obj]?")));
    let subtypes = DocTypeGraph.decode(sys.ObjUtil.coerce(obj.get("subtypes"), sys.Type.find("[sys::Str:sys::Obj]?")));
    let slots = DocSlot.decodeMap(sys.ObjUtil.coerce(obj.get("slots"), sys.Type.find("[sys::Str:sys::Obj]?")));
    return DocType.make(sys.ObjUtil.coerce(qname, sys.Str.type$), doc, sys.ObjUtil.coerce(meta, DocDict.type$), base, supertypes, subtypes, slots);
  }

}

class DocGlobal extends DocSpecPage {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocGlobal.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  static make(qname,doc,meta,type) {
    const $self = new DocGlobal();
    DocGlobal.make$($self,qname,doc,meta,type);
    return $self;
  }

  static make$($self,qname,doc,meta,type) {
    DocSpecPage.make$($self, qname, doc, meta);
    $self.#type = type;
    return;
  }

  pageType() {
    return DocPageType.global();
  }

  uri() {
    return DocUtil.globalToUri(this.qname());
  }

  encode() {
    let obj = DocSpecPage.prototype.encode.call(this);
    obj.set("type", this.#type.encode());
    return obj;
  }

  static doDecode(obj) {
    let qname = obj.getChecked("qname");
    let doc = DocMarkdown.decode(obj.get("doc"));
    let meta = DocDict.decode(sys.ObjUtil.coerce(obj.get("meta"), sys.Type.find("[sys::Str:sys::Obj]?")));
    let type = DocTypeRef.decode(obj.getChecked("type"));
    return DocGlobal.make(sys.ObjUtil.coerce(qname, sys.Str.type$), doc, sys.ObjUtil.coerce(meta, DocDict.type$), sys.ObjUtil.coerce(type, DocTypeRef.type$));
  }

}

class DocSlot extends DocSpec {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocSlot.type$; }

  static #empty = undefined;

  static empty() {
    if (DocSlot.#empty === undefined) {
      DocSlot.static$init();
      if (DocSlot.#empty === undefined) DocSlot.#empty = null;
    }
    return DocSlot.#empty;
  }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #doc = null;

  doc() { return this.#doc; }

  __doc(it) { if (it === undefined) return this.#doc; else this.#doc = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #parent = null;

  parent() { return this.#parent; }

  __parent(it) { if (it === undefined) return this.#parent; else this.#parent = it; }

  #base = null;

  base() { return this.#base; }

  __base(it) { if (it === undefined) return this.#base; else this.#base = it; }

  #slots = null;

  slots() { return this.#slots; }

  __slots(it) { if (it === undefined) return this.#slots; else this.#slots = it; }

  static make(name,doc,meta,type,parent,base,slots) {
    const $self = new DocSlot();
    DocSlot.make$($self,name,doc,meta,type,parent,base,slots);
    return $self;
  }

  static make$($self,name,doc,meta,type,parent,base,slots) {
    DocSpec.make$($self);
    $self.#name = name;
    $self.#doc = doc;
    $self.#meta = meta;
    $self.#type = type;
    $self.#parent = parent;
    $self.#base = base;
    $self.#slots = sys.ObjUtil.coerce(((this$) => { let $_u3 = slots; if ($_u3 == null) return null; return sys.ObjUtil.toImmutable(slots); })($self), sys.Type.find("[sys::Str:xetoDoc::DocSlot]"));
    return;
  }

  encode() {
    let obj = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    obj.ordered(true);
    obj.set("doc", this.#doc.encode());
    obj.set("type", this.#type.encode());
    obj.addNotNull("parent", ((this$) => { let $_u4 = this$.#parent; if ($_u4 == null) return null; return this$.#parent.encode(); })(this));
    obj.addNotNull("base", ((this$) => { let $_u5 = this$.#base; if ($_u5 == null) return null; return this$.#base.encode(); })(this));
    obj.addNotNull("meta", this.#meta.encode());
    obj.addNotNull("slots", DocSlot.encodeMap(this.#slots));
    return obj;
  }

  static encodeMap(map) {
    const this$ = this;
    if (map.isEmpty()) {
      return null;
    }
    ;
    return map.map((x) => {
      return x.encode();
    }, sys.Obj.type$.toNullable());
  }

  static decode(name,obj) {
    let doc = DocMarkdown.decode(obj.get("doc"));
    let type = DocTypeRef.decode(obj.getChecked("type"));
    let parent = DocTypeRef.decode(obj.get("parent"));
    let base = DocLink.decode(sys.ObjUtil.coerce(obj.get("base"), sys.Type.find("[sys::Str:sys::Obj]?")));
    let meta = DocDict.decode(sys.ObjUtil.coerce(obj.get("meta"), sys.Type.find("[sys::Str:sys::Obj]?")));
    let slots = DocSlot.decodeMap(sys.ObjUtil.coerce(obj.get("slots"), sys.Type.find("[sys::Str:sys::Obj]?")));
    return DocSlot.make(name, doc, sys.ObjUtil.coerce(meta, DocDict.type$), sys.ObjUtil.coerce(type, DocTypeRef.type$), parent, base, slots);
  }

  static decodeMap(obj) {
    const this$ = this;
    if ((obj == null || obj.isEmpty())) {
      return DocSlot.empty();
    }
    ;
    return sys.ObjUtil.coerce(obj.map((x,n) => {
      return DocSlot.decode(n, sys.ObjUtil.coerce(x, sys.Type.find("[sys::Str:sys::Obj]")));
    }, sys.Obj.type$.toNullable()), sys.Type.find("[sys::Str:xetoDoc::DocSlot]"));
  }

  static static$init() {
    DocSlot.#empty = sys.ObjUtil.coerce(((this$) => { let $_u6 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoDoc::DocSlot")); if ($_u6 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoDoc::DocSlot"))); })(this), sys.Type.find("[sys::Str:xetoDoc::DocSlot]"));
    return;
  }

}

class DocLink extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocLink.type$; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  static make(uri,dis) {
    const $self = new DocLink();
    DocLink.make$($self,uri,dis);
    return $self;
  }

  static make$($self,uri,dis) {
    $self.#uri = uri;
    $self.#dis = dis;
    return;
  }

  encode() {
    let obj = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    obj.ordered(true);
    obj.set("uri", this.#uri.toStr());
    obj.set("dis", this.#dis);
    return obj;
  }

  static decode(obj) {
    if (obj == null) {
      return null;
    }
    ;
    let uri = sys.Uri.fromStr(sys.ObjUtil.coerce(obj.getChecked("uri"), sys.Str.type$));
    let dis = obj.getChecked("dis");
    return DocLink.make(sys.ObjUtil.coerce(uri, sys.Uri.type$), sys.ObjUtil.coerce(dis, sys.Str.type$));
  }

}

class DocTypeRef extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocTypeRef.type$; }

  static dict() {
    return sys.ObjUtil.coerce(DocSimpleTypeRef.predefined().getChecked("sys::Dict"), DocTypeRef.type$);
  }

  static list() {
    return sys.ObjUtil.coerce(DocSimpleTypeRef.predefined().getChecked("sys::List"), DocTypeRef.type$);
  }

  name() {
    return sys.ObjUtil.coerce(xetoEnv.XetoUtil.qnameToName(this.qname()), sys.Str.type$);
  }

  isOf() {
    return false;
  }

  of() {
    return null;
  }

  isCompound() {
    return false;
  }

  compoundSymbol() {
    return null;
  }

  ofs() {
    return null;
  }

  static decode(obj) {
    if (obj == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.is(obj, sys.Str.type$)) {
      let sig = sys.ObjUtil.toStr(obj);
      if (sys.Str.endsWith(sig, "?")) {
        return DocSimpleTypeRef.make(sys.Str.getRange(sig, sys.Range.make(0, -2)), true);
      }
      ;
      return DocSimpleTypeRef.make(sig, false);
    }
    ;
    let map = sys.ObjUtil.coerce(obj, sys.Type.find("[sys::Str:sys::Obj]"));
    let isMaybe = map.get("maybe") != null;
    let of$ = map.get("of");
    if (of$ != null) {
      return DocOfTypeRef.make(sys.ObjUtil.coerce(DocTypeRef.decode(map.getChecked("base")), DocTypeRef.type$), sys.ObjUtil.coerce(DocTypeRef.decode(of$), DocTypeRef.type$));
    }
    ;
    let ofs = map.get("and");
    if (ofs != null) {
      return DocAndTypeRef.make(DocTypeRef.decodeList(sys.ObjUtil.coerce(ofs, sys.Type.find("sys::Obj[]"))), isMaybe);
    }
    ;
    (ofs = map.get("or"));
    if (ofs != null) {
      return DocOrTypeRef.make(DocTypeRef.decodeList(sys.ObjUtil.coerce(ofs, sys.Type.find("sys::Obj[]"))), isMaybe);
    }
    ;
    throw sys.Err.make(sys.Str.plus("Cannot decode: ", obj));
  }

  static decodeList(list) {
    const this$ = this;
    return sys.ObjUtil.coerce(list.map((x) => {
      return sys.ObjUtil.coerce(DocTypeRef.decode(x), DocTypeRef.type$);
    }, DocTypeRef.type$), sys.Type.find("xetoDoc::DocTypeRef[]"));
  }

  static make() {
    const $self = new DocTypeRef();
    DocTypeRef.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DocSimpleTypeRef extends DocTypeRef {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocSimpleTypeRef.type$; }

  static #predefined = undefined;

  static predefined() {
    if (DocSimpleTypeRef.#predefined === undefined) {
      DocSimpleTypeRef.static$init();
      if (DocSimpleTypeRef.#predefined === undefined) DocSimpleTypeRef.#predefined = null;
    }
    return DocSimpleTypeRef.#predefined;
  }

  #qname = null;

  qname() { return this.#qname; }

  __qname(it) { if (it === undefined) return this.#qname; else this.#qname = it; }

  #isMaybe = false;

  isMaybe() { return this.#isMaybe; }

  __isMaybe(it) { if (it === undefined) return this.#isMaybe; else this.#isMaybe = it; }

  static make(qname,isMaybe) {
    if (isMaybe === undefined) isMaybe = false;
    if (!isMaybe) {
      let p = DocSimpleTypeRef.predefined().get(qname);
      if (p != null) {
        return p;
      }
      ;
    }
    ;
    return DocSimpleTypeRef.doMake(qname, isMaybe);
  }

  static doMake(qname,isMaybe) {
    const $self = new DocSimpleTypeRef();
    DocSimpleTypeRef.doMake$($self,qname,isMaybe);
    return $self;
  }

  static doMake$($self,qname,isMaybe) {
    DocTypeRef.make$($self);
    $self.#qname = qname;
    $self.#isMaybe = isMaybe;
    return;
  }

  uri() {
    return DocUtil.typeToUri(this.#qname);
  }

  encode() {
    if (this.#isMaybe) {
      return sys.Str.plus(sys.Str.plus("", this.#qname), "?");
    }
    ;
    return this.#qname;
  }

  toStr() {
    return sys.ObjUtil.coerce(this.encode(), sys.Str.type$);
  }

  static static$init() {
    const this$ = this;
    if (true) {
      let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoDoc::DocSimpleTypeRef"));
      let add = (qname) => {
        acc.set(qname, DocSimpleTypeRef.doMake(qname, false));
        return;
      };
      sys.Func.call(add, "sys::Dict");
      sys.Func.call(add, "sys::Enum");
      sys.Func.call(add, "sys::Func");
      sys.Func.call(add, "sys::Marker");
      sys.Func.call(add, "sys::Number");
      sys.Func.call(add, "sys::List");
      sys.Func.call(add, "sys::Str");
      DocSimpleTypeRef.#predefined = sys.ObjUtil.coerce(((this$) => { let $_u7 = acc; if ($_u7 == null) return null; return sys.ObjUtil.toImmutable(acc); })(this), sys.Type.find("[sys::Str:xetoDoc::DocSimpleTypeRef]"));
    }
    ;
    return;
  }

}

class DocOfTypeRef extends DocTypeRef {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocOfTypeRef.type$; }

  #base = null;

  base() { return this.#base; }

  __base(it) { if (it === undefined) return this.#base; else this.#base = it; }

  #of = null;

  of() { return this.#of; }

  __of(it) { if (it === undefined) return this.#of; else this.#of = it; }

  static make(base,of$) {
    const $self = new DocOfTypeRef();
    DocOfTypeRef.make$($self,base,of$);
    return $self;
  }

  static make$($self,base,of$) {
    DocTypeRef.make$($self);
    $self.#base = base;
    $self.#of = of$;
    return;
  }

  uri() {
    return this.#base.uri();
  }

  qname() {
    return this.#base.qname();
  }

  isMaybe() {
    return this.#base.isMaybe();
  }

  isOf() {
    return true;
  }

  encode() {
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    acc.ordered(true);
    acc.set("base", this.#base.encode());
    acc.set("of", this.#of.encode());
    return acc;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#base), " <of:"), this.#of), ">");
  }

}

class DocCompoundTypeRef extends DocTypeRef {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocCompoundTypeRef.type$; }

  #ofs = null;

  ofs() { return this.#ofs; }

  __ofs(it) { if (it === undefined) return this.#ofs; else this.#ofs = it; }

  #isMaybe = false;

  isMaybe() { return this.#isMaybe; }

  __isMaybe(it) { if (it === undefined) return this.#isMaybe; else this.#isMaybe = it; }

  static make(ofs,isMaybe) {
    const $self = new DocCompoundTypeRef();
    DocCompoundTypeRef.make$($self,ofs,isMaybe);
    return $self;
  }

  static make$($self,ofs,isMaybe) {
    DocTypeRef.make$($self);
    $self.#ofs = sys.ObjUtil.coerce(((this$) => { let $_u8 = ofs; if ($_u8 == null) return null; return sys.ObjUtil.toImmutable(ofs); })($self), sys.Type.find("xetoDoc::DocTypeRef[]?"));
    $self.#isMaybe = isMaybe;
    return;
  }

  uri() {
    return DocUtil.typeToUri(this.qname());
  }

  isCompound() {
    return true;
  }

  encode() {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    acc.ordered(true);
    if (this.#isMaybe) {
      acc.set("maybe", sys.ObjUtil.coerce(true, sys.Obj.type$));
    }
    ;
    acc.set(this.encodeTag(), this.#ofs.map((x) => {
      return x.encode();
    }, sys.Obj.type$.toNullable()));
    return acc;
  }

  toStr() {
    return this.#ofs.join(sys.Str.plus(sys.Str.plus(" ", this.compoundSymbol()), " "));
  }

}

class DocAndTypeRef extends DocCompoundTypeRef {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocAndTypeRef.type$; }

  static make(ofs,isMaybe) {
    const $self = new DocAndTypeRef();
    DocAndTypeRef.make$($self,ofs,isMaybe);
    return $self;
  }

  static make$($self,ofs,isMaybe) {
    DocCompoundTypeRef.make$($self, ofs, isMaybe);
    return;
  }

  qname() {
    return "sys::And";
  }

  compoundSymbol() {
    return "&";
  }

  encodeTag() {
    return "and";
  }

}

class DocOrTypeRef extends DocCompoundTypeRef {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocOrTypeRef.type$; }

  static make(ofs,isMaybe) {
    const $self = new DocOrTypeRef();
    DocOrTypeRef.make$($self,ofs,isMaybe);
    return $self;
  }

  static make$($self,ofs,isMaybe) {
    DocCompoundTypeRef.make$($self, ofs, isMaybe);
    return;
  }

  qname() {
    return "sys::Or";
  }

  compoundSymbol() {
    return "|";
  }

  encodeTag() {
    return "or";
  }

}

class DocChapter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return DocChapter.type$; }

  dump() { return DocPage.prototype.dump.apply(this, arguments); }

  #qname = null;

  qname() { return this.#qname; }

  __qname(it) { if (it === undefined) return this.#qname; else this.#qname = it; }

  #doc = null;

  doc() { return this.#doc; }

  __doc(it) { if (it === undefined) return this.#doc; else this.#doc = it; }

  #libName$Store = undefined;

  // private field reflection only
  __libName$Store(it) { if (it === undefined) return this.#libName$Store; else this.#libName$Store = it; }

  #name$Store = undefined;

  // private field reflection only
  __name$Store(it) { if (it === undefined) return this.#name$Store; else this.#name$Store = it; }

  static make(qname,doc) {
    const $self = new DocChapter();
    DocChapter.make$($self,qname,doc);
    return $self;
  }

  static make$($self,qname,doc) {
    ;
    $self.#qname = qname;
    $self.#doc = doc;
    return;
  }

  uri() {
    return DocUtil.chapterToUri(this.#qname);
  }

  libName() {
    if (this.#libName$Store === undefined) {
      this.#libName$Store = this.libName$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#libName$Store, sys.Str.type$);
  }

  name() {
    if (this.#name$Store === undefined) {
      this.#name$Store = this.name$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#name$Store, sys.Str.type$);
  }

  pageType() {
    return DocPageType.chapter();
  }

  lib() {
    return DocLibRef.make(this.libName());
  }

  encode() {
    let obj = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    obj.ordered(true);
    obj.set("page", this.pageType().name());
    obj.set("qname", this.#qname);
    obj.set("doc", this.#doc.encode());
    return obj;
  }

  static doDecode(obj) {
    let qname = obj.getChecked("qname");
    let doc = DocMarkdown.decode(obj.getChecked("doc"));
    return DocChapter.make(sys.ObjUtil.coerce(qname, sys.Str.type$), doc);
  }

  libName$Once() {
    return sys.ObjUtil.coerce(xetoEnv.XetoUtil.qnameToLib(this.#qname), sys.Str.type$);
  }

  name$Once() {
    return sys.ObjUtil.coerce(xetoEnv.XetoUtil.qnameToName(this.#qname), sys.Str.type$);
  }

}

class DocPageType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocPageType.type$; }

  static lib() { return DocPageType.vals().get(0); }

  static type() { return DocPageType.vals().get(1); }

  static global() { return DocPageType.vals().get(2); }

  static instance() { return DocPageType.vals().get(3); }

  static chapter() { return DocPageType.vals().get(4); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new DocPageType();
    DocPageType.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(DocPageType.type$, DocPageType.vals(), name$, checked);
  }

  static vals() {
    if (DocPageType.#vals == null) {
      DocPageType.#vals = sys.List.make(DocPageType.type$, [
        DocPageType.make(0, "lib", ),
        DocPageType.make(1, "type", ),
        DocPageType.make(2, "global", ),
        DocPageType.make(3, "instance", ),
        DocPageType.make(4, "chapter", ),
      ]).toImmutable();
    }
    return DocPageType.#vals;
  }

  static static$init() {
    const $_u9 = DocPageType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class DocTypeGraph extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocTypeGraph.type$; }

  static #empty = undefined;

  static empty() {
    if (DocTypeGraph.#empty === undefined) {
      DocTypeGraph.static$init();
      if (DocTypeGraph.#empty === undefined) DocTypeGraph.#empty = null;
    }
    return DocTypeGraph.#empty;
  }

  #types = null;

  types() { return this.#types; }

  __types(it) { if (it === undefined) return this.#types; else this.#types = it; }

  #edges = null;

  edges() { return this.#edges; }

  __edges(it) { if (it === undefined) return this.#edges; else this.#edges = it; }

  static make(types,edges) {
    const $self = new DocTypeGraph();
    DocTypeGraph.make$($self,types,edges);
    return $self;
  }

  static make$($self,types,edges) {
    $self.#types = sys.ObjUtil.coerce(((this$) => { let $_u10 = types; if ($_u10 == null) return null; return sys.ObjUtil.toImmutable(types); })($self), sys.Type.find("xetoDoc::DocTypeRef[]"));
    $self.#edges = sys.ObjUtil.coerce(((this$) => { let $_u11 = edges; if ($_u11 == null) return null; return sys.ObjUtil.toImmutable(edges); })($self), sys.Type.find("xetoDoc::DocTypeGraphEdge[]?"));
    return;
  }

  encode() {
    const this$ = this;
    if (this.#types.isEmpty()) {
      return null;
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    acc.ordered(true);
    acc.set("types", this.#types.map((x) => {
      return x.encode();
    }, sys.Obj.type$.toNullable()));
    acc.addNotNull("edges", DocTypeGraphEdge.encodeList(this.#edges));
    return acc;
  }

  static decode(obj) {
    const this$ = this;
    if (obj == null) {
      return DocTypeGraph.empty();
    }
    ;
    let types = sys.ObjUtil.coerce(obj.getChecked("types"), sys.Type.find("sys::List")).map((x) => {
      return DocTypeRef.decode(x);
    }, sys.Obj.type$.toNullable());
    let edges = DocTypeGraphEdge.decodeList(sys.ObjUtil.coerce(obj.get("edges"), sys.Type.find("sys::Str[]?")));
    return DocTypeGraph.make(sys.ObjUtil.coerce(types, sys.Type.find("xetoDoc::DocTypeRef[]")), edges);
  }

  static static$init() {
    DocTypeGraph.#empty = DocTypeGraph.make(sys.List.make(DocTypeRef.type$), null);
    return;
  }

}

class DocTypeGraphEdge extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocTypeGraphEdge.type$; }

  static #obj = undefined;

  static obj() {
    if (DocTypeGraphEdge.#obj === undefined) {
      DocTypeGraphEdge.static$init();
      if (DocTypeGraphEdge.#obj === undefined) DocTypeGraphEdge.#obj = null;
    }
    return DocTypeGraphEdge.#obj;
  }

  #mode = null;

  mode() { return this.#mode; }

  __mode(it) { if (it === undefined) return this.#mode; else this.#mode = it; }

  #types = null;

  types() { return this.#types; }

  __types(it) { if (it === undefined) return this.#types; else this.#types = it; }

  static make(mode,types) {
    const $self = new DocTypeGraphEdge();
    DocTypeGraphEdge.make$($self,mode,types);
    return $self;
  }

  static make$($self,mode,types) {
    $self.#mode = mode;
    $self.#types = sys.ObjUtil.coerce(((this$) => { let $_u12 = types; if ($_u12 == null) return null; return sys.ObjUtil.toImmutable(types); })($self), sys.Type.find("sys::Int[]"));
    return;
  }

  toStr() {
    return this.encode();
  }

  static encodeList(list) {
    const this$ = this;
    if (list == null) {
      return null;
    }
    ;
    return sys.ObjUtil.coerce(list.map((x) => {
      return x.encode();
    }, sys.Obj.type$.toNullable()), sys.Type.find("sys::Str[]?"));
  }

  encode() {
    const this$ = this;
    let s = sys.StrBuf.make();
    s.capacity(sys.Int.plus(sys.Str.size(this.#mode.name()), sys.Int.mult(2, this.#types.size())));
    s.add(this.#mode);
    this.#types.each((index) => {
      s.addChar(32).add(sys.ObjUtil.coerce(index, sys.Obj.type$.toNullable()));
      return;
    });
    return s.toStr();
  }

  static decodeList(list) {
    const this$ = this;
    if (list == null) {
      return null;
    }
    ;
    return sys.ObjUtil.coerce(list.map((x) => {
      return DocTypeGraphEdge.decode(x);
    }, sys.Obj.type$.toNullable()), sys.Type.find("xetoDoc::DocTypeGraphEdge[]?"));
  }

  static decode(s) {
    const this$ = this;
    try {
      let toks = sys.Str.split(s);
      let mode = DocTypeGraphEdgeMode.fromStr(toks.get(0));
      let types = toks.getRange(sys.Range.make(1, -1)).map((tok) => {
        return sys.ObjUtil.coerce(sys.Str.toInt(tok), sys.Obj.type$.toNullable());
      }, sys.Obj.type$.toNullable());
      return DocTypeGraphEdge.make(sys.ObjUtil.coerce(mode, DocTypeGraphEdgeMode.type$), sys.ObjUtil.coerce(types, sys.Type.find("sys::Int[]")));
    }
    catch ($_u13) {
      $_u13 = sys.Err.make($_u13);
      if ($_u13 instanceof sys.Err) {
        let e = $_u13;
        ;
        throw sys.ParseErr.make(sys.Str.plus("DocTypeGraphEdge: ", s));
      }
      else {
        throw $_u13;
      }
    }
    ;
  }

  static static$init() {
    DocTypeGraphEdge.#obj = DocTypeGraphEdge.make(DocTypeGraphEdgeMode.obj(), sys.List.make(sys.Int.type$));
    return;
  }

}

class DocTypeGraphEdgeMode extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocTypeGraphEdgeMode.type$; }

  static obj() { return DocTypeGraphEdgeMode.vals().get(0); }

  static base() { return DocTypeGraphEdgeMode.vals().get(1); }

  static and() { return DocTypeGraphEdgeMode.vals().get(2); }

  static or() { return DocTypeGraphEdgeMode.vals().get(3); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new DocTypeGraphEdgeMode();
    DocTypeGraphEdgeMode.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(DocTypeGraphEdgeMode.type$, DocTypeGraphEdgeMode.vals(), name$, checked);
  }

  static vals() {
    if (DocTypeGraphEdgeMode.#vals == null) {
      DocTypeGraphEdgeMode.#vals = sys.List.make(DocTypeGraphEdgeMode.type$, [
        DocTypeGraphEdgeMode.make(0, "obj", ),
        DocTypeGraphEdgeMode.make(1, "base", ),
        DocTypeGraphEdgeMode.make(2, "and", ),
        DocTypeGraphEdgeMode.make(3, "or", ),
      ]).toImmutable();
    }
    return DocTypeGraphEdgeMode.#vals;
  }

  static static$init() {
    const $_u14 = DocTypeGraphEdgeMode.vals();
    if (true) {
    }
    ;
    return;
  }

}

class DocUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocUtil.type$; }

  static #libIcon = undefined;

  static libIcon() {
    if (DocUtil.#libIcon === undefined) {
      DocUtil.static$init();
      if (DocUtil.#libIcon === undefined) DocUtil.#libIcon = null;
    }
    return DocUtil.#libIcon;
  }

  static #typeIcon = undefined;

  static typeIcon() {
    if (DocUtil.#typeIcon === undefined) {
      DocUtil.static$init();
      if (DocUtil.#typeIcon === undefined) DocUtil.#typeIcon = null;
    }
    return DocUtil.#typeIcon;
  }

  static #globalIcon = undefined;

  static globalIcon() {
    if (DocUtil.#globalIcon === undefined) {
      DocUtil.static$init();
      if (DocUtil.#globalIcon === undefined) DocUtil.#globalIcon = null;
    }
    return DocUtil.#globalIcon;
  }

  static #instanceIcon = undefined;

  static instanceIcon() {
    if (DocUtil.#instanceIcon === undefined) {
      DocUtil.static$init();
      if (DocUtil.#instanceIcon === undefined) DocUtil.#instanceIcon = null;
    }
    return DocUtil.#instanceIcon;
  }

  static #chapterIcon = undefined;

  static chapterIcon() {
    if (DocUtil.#chapterIcon === undefined) {
      DocUtil.static$init();
      if (DocUtil.#chapterIcon === undefined) DocUtil.#chapterIcon = null;
    }
    return DocUtil.#chapterIcon;
  }

  static libToUri(libName) {
    return sys.Str.toUri(sys.Str.plus(sys.Str.plus("/", libName), "/index"));
  }

  static specToUri(spec) {
    return ((this$) => { if (spec.isGlobal()) return DocUtil.globalToUri(spec.qname()); return DocUtil.typeToUri(spec.qname()); })(this);
  }

  static typeToUri(qname) {
    return DocUtil.qnameToUri(qname, false);
  }

  static globalToUri(qname) {
    return DocUtil.qnameToUri(qname, true);
  }

  static instanceToUri(qname) {
    return DocUtil.qnameToUri(qname, false);
  }

  static chapterToUri(qname) {
    return DocUtil.qnameToUri(qname, false);
  }

  static qnameToUri(qname,isGlobal) {
    let colons = ((this$) => { let $_u16 = sys.Str.index(qname, "::"); if ($_u16 != null) return $_u16; throw sys.Err.make(sys.Str.plus("Not qname: ", qname)); })(this);
    let s = sys.StrBuf.make(sys.Int.plus(sys.Str.size(qname), 3));
    return sys.Str.toUri(s.addChar(47).addRange(qname, sys.Range.make(0, sys.ObjUtil.coerce(colons, sys.Int.type$), true)).addChar(47).add(((this$) => { if (isGlobal) return "_"; return ""; })(this)).addRange(qname, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colons, sys.Int.type$), 2), -1)).toStr());
  }

  static make() {
    const $self = new DocUtil();
    DocUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    DocUtil.#libIcon = sys.ObjUtil.coerce(haystack.Ref.fromStr("ion.icons::package"), haystack.Ref.type$);
    DocUtil.#typeIcon = sys.ObjUtil.coerce(haystack.Ref.fromStr("ion.icons::aperture"), haystack.Ref.type$);
    DocUtil.#globalIcon = sys.ObjUtil.coerce(haystack.Ref.fromStr("ion.icons::tag"), haystack.Ref.type$);
    DocUtil.#instanceIcon = sys.ObjUtil.coerce(haystack.Ref.fromStr("ion.icons::at-sign"), haystack.Ref.type$);
    DocUtil.#chapterIcon = sys.ObjUtil.coerce(haystack.Ref.fromStr("ion.icons::sticky-note"), haystack.Ref.type$);
    return;
  }

}

class DocLib extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocLib.type$; }

  dump() { return DocPage.prototype.dump.apply(this, arguments); }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #doc = null;

  doc() { return this.#doc; }

  __doc(it) { if (it === undefined) return this.#doc; else this.#doc = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #depends = null;

  depends() { return this.#depends; }

  __depends(it) { if (it === undefined) return this.#depends; else this.#depends = it; }

  #types = null;

  types() { return this.#types; }

  __types(it) { if (it === undefined) return this.#types; else this.#types = it; }

  #globals = null;

  globals() { return this.#globals; }

  __globals(it) { if (it === undefined) return this.#globals; else this.#globals = it; }

  #instances = null;

  instances() { return this.#instances; }

  __instances(it) { if (it === undefined) return this.#instances; else this.#instances = it; }

  #chapters = null;

  chapters() { return this.#chapters; }

  __chapters(it) { if (it === undefined) return this.#chapters; else this.#chapters = it; }

  static make(f) {
    const $self = new DocLib();
    DocLib.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    sys.Func.call(f, $self);
    return;
  }

  uri() {
    return DocUtil.libToUri(this.#name);
  }

  pageType() {
    return DocPageType.lib();
  }

  lib() {
    return DocLibRef.make(this.#name);
  }

  encode() {
    let obj = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    obj.ordered(true);
    obj.set("page", this.pageType().name());
    obj.set("name", this.#name);
    obj.set("doc", this.#doc.encode());
    obj.set("depends", DocLibDepend.encodeList(this.#depends));
    obj.set("meta", sys.ObjUtil.coerce(this.#meta.encode(), sys.Obj.type$));
    obj.addNotNull("types", DocSummary.encodeList(this.#types));
    obj.addNotNull("globals", DocSummary.encodeList(this.#globals));
    obj.addNotNull("instances", DocSummary.encodeList(this.#instances));
    obj.addNotNull("chapters", DocSummary.encodeList(this.#chapters));
    return obj;
  }

  static doDecode(obj) {
    const this$ = this;
    return DocLib.make((it) => {
      it.#name = sys.ObjUtil.coerce(obj.getChecked("name"), sys.Str.type$);
      it.#doc = DocMarkdown.decode(obj.get("doc"));
      it.#depends = sys.ObjUtil.coerce(((this$) => { let $_u18 = DocLibDepend.decodeList(sys.ObjUtil.coerce(obj.get("depends"), sys.Type.find("sys::Obj[]?"))); if ($_u18 == null) return null; return sys.ObjUtil.toImmutable(DocLibDepend.decodeList(sys.ObjUtil.coerce(obj.get("depends"), sys.Type.find("sys::Obj[]?")))); })(this$), sys.Type.find("xetoDoc::DocLibDepend[]"));
      it.#meta = sys.ObjUtil.coerce(DocDict.decode(sys.ObjUtil.coerce(obj.get("meta"), sys.Type.find("[sys::Str:sys::Obj]?"))), DocDict.type$);
      it.#types = sys.ObjUtil.coerce(((this$) => { let $_u19 = DocSummary.decodeList(sys.ObjUtil.coerce(obj.get("types"), sys.Type.find("sys::Obj[]?"))); if ($_u19 == null) return null; return sys.ObjUtil.toImmutable(DocSummary.decodeList(sys.ObjUtil.coerce(obj.get("types"), sys.Type.find("sys::Obj[]?")))); })(this$), sys.Type.find("xetoDoc::DocSummary[]"));
      it.#globals = sys.ObjUtil.coerce(((this$) => { let $_u20 = DocSummary.decodeList(sys.ObjUtil.coerce(obj.get("globals"), sys.Type.find("sys::Obj[]?"))); if ($_u20 == null) return null; return sys.ObjUtil.toImmutable(DocSummary.decodeList(sys.ObjUtil.coerce(obj.get("globals"), sys.Type.find("sys::Obj[]?")))); })(this$), sys.Type.find("xetoDoc::DocSummary[]"));
      it.#instances = sys.ObjUtil.coerce(((this$) => { let $_u21 = DocSummary.decodeList(sys.ObjUtil.coerce(obj.get("instances"), sys.Type.find("sys::Obj[]?"))); if ($_u21 == null) return null; return sys.ObjUtil.toImmutable(DocSummary.decodeList(sys.ObjUtil.coerce(obj.get("instances"), sys.Type.find("sys::Obj[]?")))); })(this$), sys.Type.find("xetoDoc::DocSummary[]"));
      it.#chapters = sys.ObjUtil.coerce(((this$) => { let $_u22 = DocSummary.decodeList(sys.ObjUtil.coerce(obj.get("chapters"), sys.Type.find("sys::Obj[]?"))); if ($_u22 == null) return null; return sys.ObjUtil.toImmutable(DocSummary.decodeList(sys.ObjUtil.coerce(obj.get("chapters"), sys.Type.find("sys::Obj[]?")))); })(this$), sys.Type.find("xetoDoc::DocSummary[]"));
      return;
    });
  }

}

class DocLibDepend extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocLibDepend.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #versions = null;

  versions() { return this.#versions; }

  __versions(it) { if (it === undefined) return this.#versions; else this.#versions = it; }

  static make(lib,versions) {
    const $self = new DocLibDepend();
    DocLibDepend.make$($self,lib,versions);
    return $self;
  }

  static make$($self,lib,versions) {
    $self.#lib = lib;
    $self.#versions = versions;
    return;
  }

  static encodeList(list) {
    const this$ = this;
    return list.map((x) => {
      return x.encode();
    }, sys.Obj.type$.toNullable());
  }

  encode() {
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    acc.ordered(true);
    acc.set("lib", this.#lib.encode());
    acc.set("versions", sys.ObjUtil.toStr(this.#versions));
    return acc;
  }

  static decodeList(list) {
    const this$ = this;
    if (list == null) {
      return sys.ObjUtil.coerce(DocLibDepend.type$.emptyList(), sys.Type.find("xetoDoc::DocLibDepend[]"));
    }
    ;
    return sys.ObjUtil.coerce(list.map((x) => {
      return DocLibDepend.decode(sys.ObjUtil.coerce(x, sys.Type.find("[sys::Str:sys::Obj]")));
    }, sys.Obj.type$.toNullable()), sys.Type.find("xetoDoc::DocLibDepend[]"));
  }

  static decode(obj) {
    let lib = DocLibRef.decode(sys.ObjUtil.coerce(obj.getChecked("lib"), sys.Str.type$));
    let versions = xeto.LibDependVersions.fromStr(sys.ObjUtil.coerce(obj.getChecked("versions"), sys.Str.type$));
    return DocLibDepend.make(lib, sys.ObjUtil.coerce(versions, xeto.LibDependVersions.type$));
  }

}

class DocLibRef extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocLibRef.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  static make(name) {
    const $self = new DocLibRef();
    DocLibRef.make$($self,name);
    return $self;
  }

  static make$($self,name) {
    $self.#name = name;
    return;
  }

  uri() {
    return DocUtil.libToUri(this.#name);
  }

  encode() {
    return this.#name;
  }

  static decode(s) {
    return DocLibRef.make(s);
  }

}

class DocVal extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocVal.type$; }

  isScalar() {
    return false;
  }

  asScalar() {
    throw sys.Err.make(sys.Str.plus("Not scalar: ", sys.ObjUtil.typeof(this)));
  }

  isList() {
    return false;
  }

  asList() {
    throw sys.Err.make(sys.Str.plus("Not list: ", sys.ObjUtil.typeof(this)));
  }

  isDict() {
    return false;
  }

  asDict() {
    throw sys.Err.make(sys.Str.plus("Not dict: ", sys.ObjUtil.typeof(this)));
  }

  encodeVal() {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    acc.ordered(true);
    acc.set("type", this.type().encode());
    if (this.isScalar()) {
      acc.set("scalar", this.asScalar().scalar());
    }
    else {
      if (this.isDict()) {
        acc.set("dict", this.asDict().dict().map((v) => {
          return v.encodeVal();
        }, sys.Obj.type$.toNullable()));
      }
      else {
        acc.set("list", this.asList().list().map((v) => {
          return v.encodeVal();
        }, sys.Obj.type$.toNullable()));
      }
      ;
    }
    ;
    return acc;
  }

  static decodeVal(obj) {
    const this$ = this;
    let type = DocTypeRef.decode(obj.getChecked("type"));
    let scalar = obj.get("scalar");
    if (scalar != null) {
      return DocScalar.make(sys.ObjUtil.coerce(type, DocTypeRef.type$), sys.ObjUtil.coerce(scalar, sys.Str.type$));
    }
    ;
    let list = sys.ObjUtil.as(obj.get("list"), sys.Type.find("sys::Obj[]"));
    if (list != null) {
      return DocList.make(sys.ObjUtil.coerce(type, DocTypeRef.type$), sys.ObjUtil.coerce(list.map((x) => {
        return DocVal.decodeVal(sys.ObjUtil.coerce(x, sys.Type.find("[sys::Str:sys::Obj]")));
      }, sys.Obj.type$.toNullable()), sys.Type.find("xetoDoc::DocVal[]")));
    }
    ;
    let dict = sys.ObjUtil.coerce(obj.getChecked("dict"), sys.Type.find("[sys::Str:sys::Obj]"));
    return sys.ObjUtil.coerce(DocDict.make(sys.ObjUtil.coerce(type, DocTypeRef.type$), sys.ObjUtil.coerce(dict.map((v,n) => {
      return DocVal.decodeVal(sys.ObjUtil.coerce(v, sys.Type.find("[sys::Str:sys::Obj]")));
    }, sys.Obj.type$.toNullable()), sys.Type.find("[sys::Str:xetoDoc::DocVal]"))), DocVal.type$);
  }

  static make() {
    const $self = new DocVal();
    DocVal.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DocDict extends DocVal {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocDict.type$; }

  static #empty = undefined;

  static empty() {
    if (DocDict.#empty === undefined) {
      DocDict.static$init();
      if (DocDict.#empty === undefined) DocDict.#empty = null;
    }
    return DocDict.#empty;
  }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #dict = null;

  dict() { return this.#dict; }

  __dict(it) { if (it === undefined) return this.#dict; else this.#dict = it; }

  static make(type,dict) {
    if (dict.isEmpty()) {
      return DocDict.empty();
    }
    ;
    return DocDict.doMake(type, dict);
  }

  static doMake(type,dict) {
    const $self = new DocDict();
    DocDict.doMake$($self,type,dict);
    return $self;
  }

  static doMake$($self,type,dict) {
    DocVal.make$($self);
    $self.#type = type;
    $self.#dict = sys.ObjUtil.coerce(((this$) => { let $_u23 = dict; if ($_u23 == null) return null; return sys.ObjUtil.toImmutable(dict); })($self), sys.Type.find("[sys::Str:xetoDoc::DocVal]"));
    return;
  }

  isDict() {
    return true;
  }

  asDict() {
    return this;
  }

  get(name) {
    return this.#dict.get(name);
  }

  encode() {
    if (this.#dict.isEmpty()) {
      return null;
    }
    ;
    return sys.ObjUtil.coerce(this.encodeVal(), sys.Type.find("[sys::Str:sys::Obj]?"));
  }

  static decode(obj) {
    if (obj == null) {
      return DocDict.empty();
    }
    ;
    return sys.ObjUtil.coerce(DocVal.decodeVal(sys.ObjUtil.coerce(obj, sys.Type.find("[sys::Str:sys::Obj]"))), DocDict.type$.toNullable());
  }

  static static$init() {
    DocDict.#empty = DocDict.doMake(DocTypeRef.dict(), sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoDoc::DocVal")));
    return;
  }

}

class DocInstance extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return DocInstance.type$; }

  dump() { return DocPage.prototype.dump.apply(this, arguments); }

  #qname = null;

  qname() { return this.#qname; }

  __qname(it) { if (it === undefined) return this.#qname; else this.#qname = it; }

  #instance = null;

  instance() { return this.#instance; }

  __instance(it) { if (it === undefined) return this.#instance; else this.#instance = it; }

  #libName$Store = undefined;

  // private field reflection only
  __libName$Store(it) { if (it === undefined) return this.#libName$Store; else this.#libName$Store = it; }

  #name$Store = undefined;

  // private field reflection only
  __name$Store(it) { if (it === undefined) return this.#name$Store; else this.#name$Store = it; }

  static make(qname,instance) {
    const $self = new DocInstance();
    DocInstance.make$($self,qname,instance);
    return $self;
  }

  static make$($self,qname,instance) {
    ;
    $self.#qname = qname;
    $self.#instance = instance;
    return;
  }

  uri() {
    return DocUtil.instanceToUri(this.#qname);
  }

  libName() {
    if (this.#libName$Store === undefined) {
      this.#libName$Store = this.libName$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#libName$Store, sys.Str.type$);
  }

  name() {
    if (this.#name$Store === undefined) {
      this.#name$Store = this.name$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#name$Store, sys.Str.type$);
  }

  pageType() {
    return DocPageType.instance();
  }

  lib() {
    return DocLibRef.make(this.libName());
  }

  encode() {
    let obj = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    obj.ordered(true);
    obj.set("page", this.pageType().name());
    obj.set("qname", this.#qname);
    obj.set("instance", sys.ObjUtil.coerce(this.#instance.encode(), sys.Obj.type$));
    return obj;
  }

  static doDecode(obj) {
    let qname = obj.getChecked("qname");
    let instance = DocDict.decode(sys.ObjUtil.coerce(obj.getChecked("instance"), sys.Type.find("[sys::Str:sys::Obj]?")));
    return DocInstance.make(sys.ObjUtil.coerce(qname, sys.Str.type$), sys.ObjUtil.coerce(instance, DocDict.type$));
  }

  libName$Once() {
    return sys.ObjUtil.coerce(xetoEnv.XetoUtil.qnameToLib(this.#qname), sys.Str.type$);
  }

  name$Once() {
    return sys.ObjUtil.coerce(xetoEnv.XetoUtil.qnameToName(this.#qname), sys.Str.type$);
  }

}

class DocScalar extends DocVal {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocScalar.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #scalar = null;

  scalar() { return this.#scalar; }

  __scalar(it) { if (it === undefined) return this.#scalar; else this.#scalar = it; }

  static make(type,scalar) {
    const $self = new DocScalar();
    DocScalar.make$($self,type,scalar);
    return $self;
  }

  static make$($self,type,scalar) {
    DocVal.make$($self);
    $self.#type = type;
    $self.#scalar = scalar;
    return;
  }

  isScalar() {
    return true;
  }

  asScalar() {
    return this;
  }

}

class DocList extends DocVal {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocList.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #list = null;

  list() { return this.#list; }

  __list(it) { if (it === undefined) return this.#list; else this.#list = it; }

  static make(type,list) {
    const $self = new DocList();
    DocList.make$($self,type,list);
    return $self;
  }

  static make$($self,type,list) {
    DocVal.make$($self);
    $self.#type = type;
    $self.#list = sys.ObjUtil.coerce(((this$) => { let $_u24 = list; if ($_u24 == null) return null; return sys.ObjUtil.toImmutable(list); })($self), sys.Type.find("xetoDoc::DocVal[]"));
    return;
  }

  isList() {
    return true;
  }

  asList() {
    return this;
  }

}

class DocMarkdown extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocMarkdown.type$; }

  static #empty = undefined;

  static empty() {
    if (DocMarkdown.#empty === undefined) {
      DocMarkdown.static$init();
      if (DocMarkdown.#empty === undefined) DocMarkdown.#empty = null;
    }
    return DocMarkdown.#empty;
  }

  #text = null;

  text() { return this.#text; }

  __text(it) { if (it === undefined) return this.#text; else this.#text = it; }

  static make(text) {
    const $self = new DocMarkdown();
    DocMarkdown.make$($self,text);
    return $self;
  }

  static make$($self,text) {
    $self.#text = text;
    return;
  }

  toStr() {
    return this.#text;
  }

  encode() {
    return this.#text;
  }

  static decode(obj) {
    if (obj == null) {
      return DocMarkdown.empty();
    }
    ;
    return DocMarkdown.make(sys.ObjUtil.toStr(obj));
  }

  html() {
    let doc = markdown.Parser.builder().build().parse(this.#text);
    return markdown.HtmlRenderer.builder().build().render(doc);
  }

  static static$init() {
    DocMarkdown.#empty = DocMarkdown.make("");
    return;
  }

}

class DocSummary extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocSummary.type$; }

  #link = null;

  link() { return this.#link; }

  __link(it) { if (it === undefined) return this.#link; else this.#link = it; }

  #text = null;

  text() { return this.#text; }

  __text(it) { if (it === undefined) return this.#text; else this.#text = it; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  static make(link,text,type) {
    const $self = new DocSummary();
    DocSummary.make$($self,link,text,type);
    return $self;
  }

  static make$($self,link,text,type) {
    if (type === undefined) type = null;
    $self.#link = link;
    $self.#text = text;
    $self.#type = type;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#link.dis()), ": "), this.#text);
  }

  static encodeList(list) {
    const this$ = this;
    if (list.isEmpty()) {
      return null;
    }
    ;
    return list.map((x) => {
      return x.encode();
    }, sys.Type.find("[sys::Str:sys::Obj]"));
  }

  encode() {
    let obj = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    obj.ordered(true);
    obj.set("link", this.#link.encode());
    obj.set("text", this.#text.encode());
    obj.addNotNull("type", ((this$) => { let $_u25 = this$.#type; if ($_u25 == null) return null; return this$.#type.encode(); })(this));
    return obj;
  }

  static decodeList(list) {
    const this$ = this;
    if ((list == null || list.isEmpty())) {
      return sys.ObjUtil.coerce(DocSummary.type$.emptyList(), sys.Type.find("xetoDoc::DocSummary[]"));
    }
    ;
    return sys.ObjUtil.coerce(list.map((x) => {
      return DocSummary.decode(sys.ObjUtil.coerce(x, sys.Type.find("[sys::Str:sys::Obj]")));
    }, DocSummary.type$), sys.Type.find("xetoDoc::DocSummary[]"));
  }

  static decode(obj) {
    let link = DocLink.decode(sys.ObjUtil.coerce(obj.getChecked("link"), sys.Type.find("[sys::Str:sys::Obj]?")));
    let text = DocMarkdown.decode(obj.getChecked("text"));
    let type = DocTypeRef.decode(obj.get("type"));
    return DocSummary.make(sys.ObjUtil.coerce(link, DocLink.type$), text, type);
  }

}

class DocCompiler extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#log = sys.ObjUtil.coerce(xetoEnv.XetoLog.makeOutStream(), xetoEnv.XetoLog.type$);
    this.#errs = sys.List.make(xetoEnv.XetoCompilerErr.type$);
    this.#files = sys.List.make(sys.File.type$);
    this.#autoNames = sys.List.make(sys.Str.type$);
    return;
  }

  typeof() { return DocCompiler.type$; }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #libs = null;

  libs() { return this.#libs; }

  __libs(it) { if (it === undefined) return this.#libs; else this.#libs = it; }

  #outDir = null;

  outDir() { return this.#outDir; }

  __outDir(it) { if (it === undefined) return this.#outDir; else this.#outDir = it; }

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

  #errs = null;

  errs(it) {
    if (it === undefined) {
      return this.#errs;
    }
    else {
      this.#errs = it;
      return;
    }
  }

  #duration = null;

  duration(it) {
    if (it === undefined) {
      return this.#duration;
    }
    else {
      this.#duration = it;
      return;
    }
  }

  #pages = null;

  pages(it) {
    if (it === undefined) {
      return this.#pages;
    }
    else {
      this.#pages = it;
      return;
    }
  }

  #files = null;

  files(it) {
    if (it === undefined) {
      return this.#files;
    }
    else {
      this.#files = it;
      return;
    }
  }

  #autoNames = null;

  // private field reflection only
  __autoNames(it) { if (it === undefined) return this.#autoNames; else this.#autoNames = it; }

  static runCompiler(ns,outDir) {
    const this$ = this;
    let c = DocCompiler.make((it) => {
      it.#ns = ns;
      it.#libs = sys.ObjUtil.coerce(((this$) => { let $_u26 = ns.libs(); if ($_u26 == null) return null; return sys.ObjUtil.toImmutable(ns.libs()); })(this$), sys.Type.find("xeto::Lib[]"));
      it.#outDir = outDir;
      return;
    });
    c.compile();
    return;
  }

  static make(f) {
    const $self = new DocCompiler();
    DocCompiler.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ;
    sys.Func.call(f, $self);
    return;
  }

  applyOpts(opts) {
    if (opts == null) {
      return;
    }
    ;
    let log = xetoEnv.XetoUtil.optLog(opts, "log");
    if (log != null) {
      this.#log = xetoEnv.XetoCallbackLog.make(sys.ObjUtil.coerce(log, sys.Type.find("|xeto::XetoLogRec->sys::Void|")));
    }
    ;
    return;
  }

  compile() {
    this.run(sys.List.make(Step.type$, [StubPages.make(), GenSummaries.make(), GenPages.make(), WriteJson.make()]));
    return this;
  }

  run(steps) {
    const this$ = this;
    try {
      let t1 = sys.Duration.now();
      steps.each((step) => {
        step.compiler(this$);
        step.run();
        return;
      });
      let t2 = sys.Duration.now();
      this.#duration = t2.minus(t1);
      return this;
    }
    catch ($_u27) {
      $_u27 = sys.Err.make($_u27);
      if ($_u27 instanceof xetoEnv.XetoCompilerErr) {
        let e = $_u27;
        ;
        throw e;
      }
      else if ($_u27 instanceof sys.Err) {
        let e = $_u27;
        ;
        throw this.err("Internal compiler error", util.FileLoc.unknown(), e);
      }
      else {
        throw $_u27;
      }
    }
    ;
  }

  info(msg) {
    this.#log.info(msg);
    return;
  }

  warn(msg,loc,cause) {
    if (cause === undefined) cause = null;
    this.#log.warn(msg, loc, cause);
    return;
  }

  err(msg,loc,cause) {
    if (cause === undefined) cause = null;
    let err = xetoEnv.XetoCompilerErr.make(msg, loc, cause);
    this.#errs.add(err);
    this.#log.err(msg, loc, cause);
    return err;
  }

  err2(msg,loc1,loc2,cause) {
    if (cause === undefined) cause = null;
    let err = xetoEnv.XetoCompilerErr.make(msg, loc1, cause);
    this.#errs.add(err);
    this.#log.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", msg), " ["), loc2), "]"), loc1, cause);
    return err;
  }

  page(def) {
    return sys.ObjUtil.coerce(this.#pages.getChecked(DocCompiler.key(def)), PageEntry.type$);
  }

  static key(def) {
    if (sys.ObjUtil.is(def, xeto.Spec.type$)) {
      return sys.ObjUtil.coerce(def, xeto.Spec.type$).qname();
    }
    ;
    if (sys.ObjUtil.is(def, xeto.Lib.type$)) {
      return sys.ObjUtil.coerce(def, xeto.Lib.type$).name();
    }
    ;
    if (sys.ObjUtil.is(def, xeto.Dict.type$)) {
      return sys.ObjUtil.coerce(def, xeto.Dict.type$)._id().id();
    }
    ;
    throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot derive key: ", def), " ["), sys.ObjUtil.typeof(def)), "]"));
  }

  autoName(i) {
    if (sys.ObjUtil.compareLT(i, this.#autoNames.size())) {
      return this.#autoNames.get(i);
    }
    ;
    if (sys.ObjUtil.compareNE(i, this.#autoNames.size())) {
      throw sys.Err.make(sys.Int.toStr(i));
    }
    ;
    let s = sys.Int.toStr(i);
    let n = sys.StrBuf.make(sys.Int.plus(1, sys.Str.size(s))).addChar(95).add(s).toStr();
    this.#autoNames.add(n);
    return n;
  }

}

class Step extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Step.type$; }

  #compiler = null;

  compiler(it) {
    if (it === undefined) {
      return this.#compiler;
    }
    else {
      this.#compiler = it;
      return;
    }
  }

  ns() {
    return this.#compiler.ns();
  }

  info(msg) {
    this.#compiler.info(msg);
    return;
  }

  err(msg,loc,err) {
    if (err === undefined) err = null;
    return this.#compiler.err(msg, loc, err);
  }

  err2(msg,loc1,loc2,err) {
    if (err === undefined) err = null;
    return this.#compiler.err2(msg, loc1, loc2, err);
  }

  bombIfErr() {
    if (!this.#compiler.errs().isEmpty()) {
      throw sys.ObjUtil.coerce(this.#compiler.errs().first(), sys.Err.type$);
    }
    ;
    return;
  }

  eachPage(f) {
    this.#compiler.pages().each(f);
    return;
  }

  typesToDoc(lib) {
    const this$ = this;
    return lib.types().findAll((t) => {
      return !xetoEnv.XetoUtil.isAutoName(t.name());
    });
  }

  chapters(lib) {
    const this$ = this;
    let acc = sys.List.make(PageEntry.type$);
    this.#compiler.pages().each((page) => {
      if ((sys.ObjUtil.equals(page.pageType(), DocPageType.chapter()) && sys.ObjUtil.equals(page.lib(), lib))) {
        acc.add(page);
      }
      ;
      return;
    });
    return acc;
  }

  chapterSummaries(lib) {
    const this$ = this;
    return sys.ObjUtil.coerce(this.chapters(lib).map((x) => {
      return x.summary();
    }, DocSummary.type$), sys.Type.find("xetoDoc::DocSummary[]"));
  }

  page(x) {
    return this.#compiler.page(x);
  }

  summary(x) {
    return this.page(x).summary();
  }

  summaries(list) {
    const this$ = this;
    return sys.ObjUtil.coerce(list.map((x) => {
      return this$.summary(x);
    }, DocSummary.type$), sys.Type.find("xetoDoc::DocSummary[]"));
  }

  genTypeRef(x) {
    if (x == null) {
      return null;
    }
    ;
    if (x.isCompound()) {
      if (x.isAnd()) {
        return DocAndTypeRef.make(this.genTypeRefOfs(sys.ObjUtil.coerce(x, xeto.Spec.type$)), x.isMaybe());
      }
      ;
      if (x.isOr()) {
        return DocOrTypeRef.make(this.genTypeRefOfs(sys.ObjUtil.coerce(x, xeto.Spec.type$)), x.isMaybe());
      }
      ;
    }
    ;
    let baseType = ((this$) => { if (xetoEnv.XetoUtil.isAutoName(x.name())) return x.base(); return x.type(); })(this);
    let base = DocSimpleTypeRef.make(baseType.qname(), x.isMaybe());
    let of$ = x.of(false);
    if (of$ != null) {
      return DocOfTypeRef.make(sys.ObjUtil.coerce(base, DocTypeRef.type$), sys.ObjUtil.coerce(this.genTypeRef(of$), DocTypeRef.type$));
    }
    ;
    return base;
  }

  genTypeRefOfs(x) {
    const this$ = this;
    return sys.ObjUtil.coerce(x.ofs().map((of$) => {
      return sys.ObjUtil.coerce(this$.genTypeRef(of$), DocTypeRef.type$);
    }, DocTypeRef.type$), sys.Type.find("xetoDoc::DocTypeRef[]"));
  }

  static make() {
    const $self = new Step();
    Step.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class WriteJson extends Step {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WriteJson.type$; }

  run() {
    const this$ = this;
    this.eachPage((entry) => {
      this$.writePage(entry);
      return;
    });
    return;
  }

  writePage(entry) {
    let obj = entry.page().encode();
    let json = util.JsonOutStream.prettyPrintToStr(obj);
    if (this.compiler().outDir() == null) {
      this.writeToMem(entry, json);
    }
    else {
      this.writeToFile(entry, json);
    }
    ;
    return;
  }

  writeToMem(entry,json) {
    let file = sys.ObjUtil.coerce(sys.Buf.make(sys.Str.size(json)).print(json), sys.Buf.type$.toNullable()).toFile(sys.Str.toUri(entry.uriJson().name()));
    this.compiler().files().add(file);
    return;
  }

  writeToFile(entry,json) {
    let file = this.compiler().outDir().plus(entry.uriJson().relTo(sys.Uri.fromStr("/")));
    file.out().print(json).close();
    return;
  }

  static make() {
    const $self = new WriteJson();
    WriteJson.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    return;
  }

}

class GenSummaries extends Step {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GenSummaries.type$; }

  run() {
    const this$ = this;
    this.eachPage((entry) => {
      entry.summaryRef(this$.genSummary(entry));
      return;
    });
    return;
  }

  genSummary(entry) {
    let link = entry.link();
    let text = this.parse(((this$) => { let $_u29 = sys.ObjUtil.as(entry.meta().get("doc"), sys.Str.type$); if ($_u29 != null) return $_u29; return ""; })(this));
    return DocSummary.make(link, text, entry.summaryType());
  }

  parse(doc) {
    if ((doc == null || sys.ObjUtil.equals(doc, ""))) {
      return DocMarkdown.empty();
    }
    ;
    return DocMarkdown.make(GenSummaries.parseFirstSentence(sys.ObjUtil.toStr(doc)));
  }

  static parseFirstSentence(t) {
    if (sys.Str.isEmpty(t)) {
      return "";
    }
    ;
    let semicolon = sys.Str.index(t, ";");
    if (semicolon != null) {
      (t = sys.Str.getRange(t, sys.Range.make(0, sys.ObjUtil.coerce(semicolon, sys.Int.type$), true)));
    }
    ;
    let colon = sys.Str.index(t, ":");
    while ((colon != null && sys.ObjUtil.compareLT(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1), sys.Str.size(t)) && !sys.Int.isSpace(sys.Str.get(t, sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1))))) {
      (colon = sys.Str.index(t, ":", sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1)));
    }
    ;
    if (colon != null) {
      (t = sys.Str.getRange(t, sys.Range.make(0, sys.ObjUtil.coerce(colon, sys.Int.type$), true)));
    }
    ;
    let period = sys.Str.index(t, ".");
    while ((period != null && sys.ObjUtil.compareLT(sys.Int.plus(sys.ObjUtil.coerce(period, sys.Int.type$), 1), sys.Str.size(t)) && !sys.Int.isSpace(sys.Str.get(t, sys.Int.plus(sys.ObjUtil.coerce(period, sys.Int.type$), 1))))) {
      (period = sys.Str.index(t, ".", sys.Int.plus(sys.ObjUtil.coerce(period, sys.Int.type$), 1)));
    }
    ;
    if (period != null) {
      (t = sys.Str.getRange(t, sys.Range.make(0, sys.ObjUtil.coerce(period, sys.Int.type$), true)));
    }
    ;
    return t;
  }

  static make() {
    const $self = new GenSummaries();
    GenSummaries.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    return;
  }

}

class PageEntry extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PageEntry.type$; }

  #key = null;

  key() { return this.#key; }

  __key(it) { if (it === undefined) return this.#key; else this.#key = it; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  #pageType = null;

  pageType() { return this.#pageType; }

  __pageType(it) { if (it === undefined) return this.#pageType; else this.#pageType = it; }

  #link = null;

  link() { return this.#link; }

  __link(it) { if (it === undefined) return this.#link; else this.#link = it; }

  #summaryType = null;

  summaryType(it) {
    if (it === undefined) {
      return this.#summaryType;
    }
    else {
      this.#summaryType = it;
      return;
    }
  }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #def = null;

  def() { return this.#def; }

  __def(it) { if (it === undefined) return this.#def; else this.#def = it; }

  #summaryRef = null;

  summaryRef(it) {
    if (it === undefined) {
      return this.#summaryRef;
    }
    else {
      this.#summaryRef = it;
      return;
    }
  }

  #pageRef = null;

  pageRef(it) {
    if (it === undefined) {
      return this.#pageRef;
    }
    else {
      this.#pageRef = it;
      return;
    }
  }

  #mdIndex = null;

  mdIndex(it) {
    if (it === undefined) {
      return this.#mdIndex;
    }
    else {
      this.#mdIndex = it;
      return;
    }
  }

  static makeLib(x) {
    const $self = new PageEntry();
    PageEntry.makeLib$($self,x);
    return $self;
  }

  static makeLib$($self,x) {
    $self.#key = DocCompiler.key(x);
    $self.#def = ((this$) => { let $_u30 = x; if ($_u30 == null) return null; return sys.ObjUtil.toImmutable(x); })($self);
    $self.#uri = DocUtil.libToUri(x.name());
    $self.#lib = x;
    $self.#dis = x.name();
    $self.#pageType = DocPageType.lib();
    $self.#meta = sys.ObjUtil.coerce(x.meta(), haystack.Dict.type$);
    $self.#link = DocLink.make($self.#uri, $self.#dis);
    return;
  }

  static makeSpec(x,pageType) {
    const $self = new PageEntry();
    PageEntry.makeSpec$($self,x,pageType);
    return $self;
  }

  static makeSpec$($self,x,pageType) {
    $self.#key = DocCompiler.key(x);
    $self.#def = ((this$) => { let $_u31 = x; if ($_u31 == null) return null; return sys.ObjUtil.toImmutable(x); })($self);
    $self.#uri = DocUtil.specToUri(x);
    $self.#lib = x.lib();
    $self.#dis = x.name();
    $self.#pageType = pageType;
    $self.#meta = sys.ObjUtil.coerce(x.meta(), haystack.Dict.type$);
    $self.#link = DocLink.make($self.#uri, $self.#dis);
    return;
  }

  static makeInstance(lib,x) {
    const $self = new PageEntry();
    PageEntry.makeInstance$($self,lib,x);
    return $self;
  }

  static makeInstance$($self,lib,x) {
    let qname = x.id().id();
    let libName = xetoEnv.XetoUtil.qnameToLib(qname);
    let name = xetoEnv.XetoUtil.qnameToName(qname);
    $self.#key = DocCompiler.key(x);
    $self.#def = ((this$) => { let $_u32 = x; if ($_u32 == null) return null; return sys.ObjUtil.toImmutable(x); })($self);
    $self.#uri = DocUtil.instanceToUri(qname);
    $self.#lib = lib;
    $self.#dis = sys.ObjUtil.coerce(name, sys.Str.type$);
    $self.#pageType = DocPageType.instance();
    $self.#meta = x;
    $self.#link = DocLink.make($self.#uri, $self.#dis);
    return;
  }

  static makeChapter(lib,file,$markdown) {
    const $self = new PageEntry();
    PageEntry.makeChapter$($self,lib,file,$markdown);
    return $self;
  }

  static makeChapter$($self,lib,file,$markdown) {
    let name = file.basename();
    let qname = sys.Str.plus(sys.Str.plus(lib.name(), "::"), name);
    $self.#key = qname;
    $self.#lib = lib;
    $self.#def = ((this$) => { let $_u33 = $markdown; if ($_u33 == null) return null; return sys.ObjUtil.toImmutable($markdown); })($self);
    $self.#uri = DocUtil.chapterToUri(qname);
    $self.#dis = name;
    $self.#pageType = DocPageType.chapter();
    $self.#meta = haystack.Etc.dict0();
    $self.#link = DocLink.make($self.#uri, $self.#dis);
    return;
  }

  uriJson() {
    return sys.Str.toUri(sys.Str.plus(sys.Str.plus("", this.#uri), ".json"));
  }

  summary() {
    return sys.ObjUtil.coerce(((this$) => { let $_u34 = this$.#summaryRef; if ($_u34 != null) return $_u34; throw xetoEnv.NotReadyErr.make(this$.#dis); })(this), DocSummary.type$);
  }

  page() {
    return sys.ObjUtil.coerce(((this$) => { let $_u35 = this$.#pageRef; if ($_u35 != null) return $_u35; throw xetoEnv.NotReadyErr.make(this$.#dis); })(this), DocPage.type$);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#uri.toCode()), " "), this.#dis), " ["), this.#pageType), "]");
  }

}

class StubPages extends Step {
  constructor() {
    super();
    const this$ = this;
    this.#byKey = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoDoc::PageEntry"));
    this.#byUri = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Uri"), sys.Type.find("xetoDoc::PageEntry"));
    return;
  }

  typeof() { return StubPages.type$; }

  #byKey = null;

  byKey(it) {
    if (it === undefined) {
      return this.#byKey;
    }
    else {
      this.#byKey = it;
      return;
    }
  }

  #byUri = null;

  byUri(it) {
    if (it === undefined) {
      return this.#byUri;
    }
    else {
      this.#byUri = it;
      return;
    }
  }

  run() {
    const this$ = this;
    this.compiler().libs().each((lib) => {
      this$.stubLib(lib);
      return;
    });
    this.compiler().pages(this.#byKey);
    return;
  }

  stubLib(lib) {
    const this$ = this;
    let libDoc = PageEntry.makeLib(lib);
    this.add(libDoc);
    this.typesToDoc(lib).each((x) => {
      this$.add(PageEntry.makeSpec(x, DocPageType.type()));
      return;
    });
    lib.globals().each((x) => {
      let entry = PageEntry.makeSpec(x, DocPageType.global());
      entry.summaryType(this$.genTypeRef(x.type()));
      this$.add(entry);
      return;
    });
    lib.instances().each((x) => {
      this$.add(PageEntry.makeInstance(lib, sys.ObjUtil.coerce(x, haystack.Dict.type$)));
      return;
    });
    if (lib.hasMarkdown()) {
      lib.files().list().each((uri) => {
        if (sys.ObjUtil.equals(uri.ext(), "md")) {
          let $markdown = lib.files().readStr(uri);
          if (sys.ObjUtil.equals(uri.name(), "index.md")) {
            libDoc.mdIndex($markdown);
          }
          else {
            this$.add(PageEntry.makeChapter(lib, uri, $markdown));
          }
          ;
        }
        ;
        return;
      });
    }
    ;
    return;
  }

  add(entry) {
    this.#byKey.add(entry.key(), entry);
    this.#byUri.add(entry.uri(), entry);
    return;
  }

  static make() {
    const $self = new StubPages();
    StubPages.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    ;
    return;
  }

}

class GenPages extends Step {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GenPages.type$; }

  run() {
    const this$ = this;
    this.eachPage((entry) => {
      entry.pageRef(this$.genPage(entry));
      return;
    });
    return;
  }

  genPage(entry) {
    let $_u36 = entry.pageType();
    if (sys.ObjUtil.equals($_u36, DocPageType.lib())) {
      return this.genLib(entry, sys.ObjUtil.coerce(entry.def(), xeto.Lib.type$));
    }
    else if (sys.ObjUtil.equals($_u36, DocPageType.type())) {
      return this.genType(entry, sys.ObjUtil.coerce(entry.def(), xeto.Spec.type$));
    }
    else if (sys.ObjUtil.equals($_u36, DocPageType.global())) {
      return this.genGlobal(entry, sys.ObjUtil.coerce(entry.def(), xeto.Spec.type$));
    }
    else if (sys.ObjUtil.equals($_u36, DocPageType.instance())) {
      return this.genInstance(entry, sys.ObjUtil.coerce(entry.def(), haystack.Dict.type$));
    }
    else if (sys.ObjUtil.equals($_u36, DocPageType.chapter())) {
      return this.genChapter(entry, sys.ObjUtil.coerce(entry.def(), sys.Str.type$));
    }
    else {
      throw sys.Err.make(entry.pageType().name());
    }
    ;
  }

  genLib(entry,x) {
    const this$ = this;
    return DocLib.make((it) => {
      it.__name(x.name());
      it.__doc(this$.genDoc(x.meta().get("doc")));
      it.__meta(this$.genDict(sys.ObjUtil.coerce(x.meta(), haystack.Dict.type$)));
      it.__depends(sys.ObjUtil.coerce(((this$) => { let $_u37 = this$.genDepends(x); if ($_u37 == null) return null; return sys.ObjUtil.toImmutable(this$.genDepends(x)); })(this$), sys.Type.find("xetoDoc::DocLibDepend[]")));
      it.__types(sys.ObjUtil.coerce(((this$) => { let $_u38 = this$.summaries(this$.typesToDoc(x)); if ($_u38 == null) return null; return sys.ObjUtil.toImmutable(this$.summaries(this$.typesToDoc(x))); })(this$), sys.Type.find("xetoDoc::DocSummary[]")));
      it.__globals(sys.ObjUtil.coerce(((this$) => { let $_u39 = this$.summaries(x.globals()); if ($_u39 == null) return null; return sys.ObjUtil.toImmutable(this$.summaries(x.globals())); })(this$), sys.Type.find("xetoDoc::DocSummary[]")));
      it.__instances(sys.ObjUtil.coerce(((this$) => { let $_u40 = this$.summaries(x.instances()); if ($_u40 == null) return null; return sys.ObjUtil.toImmutable(this$.summaries(x.instances())); })(this$), sys.Type.find("xetoDoc::DocSummary[]")));
      it.__chapters(sys.ObjUtil.coerce(((this$) => { let $_u41 = this$.chapterSummaries(x); if ($_u41 == null) return null; return sys.ObjUtil.toImmutable(this$.chapterSummaries(x)); })(this$), sys.Type.find("xetoDoc::DocSummary[]")));
      return;
    });
  }

  genDepends(lib) {
    const this$ = this;
    return sys.ObjUtil.coerce(lib.depends().map((x) => {
      return DocLibDepend.make(DocLibRef.make(x.name()), x.versions());
    }, sys.Obj.type$.toNullable()), sys.Type.find("xetoDoc::DocLibDepend[]"));
  }

  genType(entry,x) {
    let doc = this.genSpecDoc(x);
    let meta = this.genDict(sys.ObjUtil.coerce(x.meta(), haystack.Dict.type$));
    let base = ((this$) => { if (x.isCompound()) return this$.genTypeRef(x); return this$.genTypeRef(x.base()); })(this);
    let slots = this.genSlots(x);
    let supertypes = this.genSupertypes(x);
    let subtypes = this.genSubtypes(x);
    return DocType.make(x.qname(), doc, meta, base, supertypes, subtypes, slots);
  }

  genSupertypes(x) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int"));
    acc.ordered(true);
    this.doGenSupertypes(acc, x);
    let types = acc.keys().map((qname) => {
      return sys.ObjUtil.coerce(DocSimpleTypeRef.make(qname), DocTypeRef.type$);
    }, DocTypeRef.type$);
    let edges = sys.List.make(DocTypeGraphEdge.type$);
    acc.each((index,qname) => {
      edges.add(this$.toSupertypeEdge(acc, sys.ObjUtil.coerce(this$.ns().spec(qname), xeto.Spec.type$)));
      return;
    });
    return DocTypeGraph.make(sys.ObjUtil.coerce(types, sys.Type.find("xetoDoc::DocTypeRef[]")), edges);
  }

  toSupertypeEdge(qnameToIndex,spec) {
    const this$ = this;
    if (spec.base() == null) {
      return DocTypeGraphEdge.obj();
    }
    ;
    if (!spec.isCompound()) {
      let index = qnameToIndex.getChecked(spec.base().qname());
      return DocTypeGraphEdge.make(DocTypeGraphEdgeMode.base(), sys.List.make(sys.Int.type$.toNullable(), [sys.ObjUtil.coerce(index, sys.Obj.type$.toNullable())]));
    }
    ;
    let mode = ((this$) => { if (spec.isOr()) return DocTypeGraphEdgeMode.or(); return DocTypeGraphEdgeMode.and(); })(this);
    let indexes = spec.ofs().map((x) => {
      return sys.ObjUtil.coerce(qnameToIndex.getChecked(x.qname()), sys.Int.type$);
    }, sys.Int.type$);
    return DocTypeGraphEdge.make(mode, sys.ObjUtil.coerce(indexes, sys.Type.find("sys::Int[]")));
  }

  doGenSupertypes(acc,x) {
    const this$ = this;
    if ((x == null || acc.get(x.qname()) != null)) {
      return;
    }
    ;
    acc.set(x.qname(), sys.ObjUtil.coerce(acc.size(), sys.Obj.type$.toNullable()));
    if (!x.isCompound()) {
      this.doGenSupertypes(acc, x.base());
    }
    else {
      x.ofs().each((sup) => {
        this$.doGenSupertypes(acc, sup);
        return;
      });
    }
    ;
    return;
  }

  genSubtypes(x) {
    const this$ = this;
    let acc = this.typesToDoc(x.lib()).findAll((t) => {
      if (t.isCompound()) {
        return t.ofs().any((it) => {
          return it === x;
        });
      }
      else {
        return t.base() === x;
      }
      ;
    });
    if (acc.isEmpty()) {
      return DocTypeGraph.empty();
    }
    ;
    let types = acc.map((s) => {
      return DocSimpleTypeRef.make(s.qname());
    }, sys.Obj.type$.toNullable());
    return DocTypeGraph.make(sys.ObjUtil.coerce(types, sys.Type.find("xetoDoc::DocTypeRef[]")), null);
  }

  genGlobal(entry,x) {
    let doc = this.genSpecDoc(x);
    let meta = this.genDict(sys.ObjUtil.coerce(x.meta(), haystack.Dict.type$));
    let type = this.genTypeRef(x.type());
    return DocGlobal.make(x.qname(), doc, meta, sys.ObjUtil.coerce(type, DocTypeRef.type$));
  }

  genInstance(entry,x) {
    let qname = x.id().id();
    let instance = this.genDict(x);
    return DocInstance.make(qname, instance);
  }

  genSlots(spec) {
    const this$ = this;
    let effective = (spec.isType() || spec.isQuery());
    let slots = ((this$) => { if (effective) return spec.slots(); return spec.slotsOwn(); })(this);
    if (slots.isEmpty()) {
      return DocSlot.empty();
    }
    ;
    let autoNameCount = 0;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoDoc::DocSlot"));
    acc.ordered(true);
    slots.each((slot) => {
      let d = this$.genSlot(spec, slot);
      let name = slot.name();
      if (xetoEnv.XetoUtil.isAutoName(name)) {
        (name = this$.compiler().autoName(((this$) => { let $_u45 = autoNameCount;autoNameCount = sys.Int.increment(autoNameCount); return $_u45; })(this$)));
      }
      ;
      acc.add(name, d);
      return;
    });
    return acc;
  }

  genSlot(parentType,slot) {
    let doc = this.genSpecDoc(slot);
    let meta = this.genDict(sys.ObjUtil.coerce(slot.metaOwn(), haystack.Dict.type$));
    let typeRef = this.genTypeRef(slot);
    let parent = ((this$) => { if (slot.parent() === parentType) return null; return DocSimpleTypeRef.make(slot.parent().qname()); })(this);
    let base = this.genSlotBase(slot);
    let slots = this.genSlots(slot);
    return DocSlot.make(slot.name(), doc, meta, sys.ObjUtil.coerce(typeRef, DocTypeRef.type$), parent, base, slots);
  }

  genSlotBase(slot) {
    let base = slot.base();
    if ((base == null || !base.isGlobal())) {
      return null;
    }
    ;
    let dis = base.qname();
    let uri = DocUtil.specToUri(sys.ObjUtil.coerce(base, xeto.Spec.type$));
    return DocLink.make(uri, dis);
  }

  genChapter(entry,$markdown) {
    return DocChapter.make(entry.key(), this.genDoc($markdown));
  }

  genDict(d) {
    const this$ = this;
    let spec = sys.ObjUtil.as(d.get("spec"), xeto.Ref.type$);
    let type = ((this$) => { if (spec == null) return DocTypeRef.dict(); return DocSimpleTypeRef.make(sys.Str.toStr(spec.id())); })(this);
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    d.each((v,n) => {
      if (sys.ObjUtil.equals(n, "doc")) {
        return;
      }
      ;
      acc.set(n, this$.genVal(v));
      return;
    });
    return sys.ObjUtil.coerce(DocDict.make(sys.ObjUtil.coerce(type, DocTypeRef.type$), sys.ObjUtil.coerce(acc, sys.Type.find("[sys::Str:xetoDoc::DocVal]"))), DocDict.type$);
  }

  genVal(x) {
    if (sys.ObjUtil.is(x, haystack.Dict.type$)) {
      return this.genDict(sys.ObjUtil.coerce(x, haystack.Dict.type$));
    }
    ;
    if (sys.ObjUtil.is(x, sys.Type.find("sys::List"))) {
      return this.genList(sys.ObjUtil.coerce(x, sys.Type.find("sys::Obj[]")));
    }
    ;
    return this.genScalar(x);
  }

  genList(x) {
    const this$ = this;
    return DocList.make(DocTypeRef.list(), sys.ObjUtil.coerce(x.map((item) => {
      return this$.genVal(item);
    }, sys.Obj.type$.toNullable()), sys.Type.find("xetoDoc::DocVal[]")));
  }

  genScalar(x) {
    let type = DocSimpleTypeRef.make(this.ns().specOf(x).qname());
    return DocScalar.make(sys.ObjUtil.coerce(type, DocTypeRef.type$), sys.ObjUtil.toStr(x));
  }

  genSpecDoc(x) {
    return this.genDoc(x.meta().get("doc"));
  }

  genDoc(doc) {
    let str = ((this$) => { let $_u48 = sys.ObjUtil.as(doc, sys.Str.type$); if ($_u48 != null) return $_u48; return ""; })(this);
    if (sys.Str.isEmpty(str)) {
      return DocMarkdown.empty();
    }
    ;
    return DocMarkdown.make(sys.ObjUtil.coerce(str, sys.Str.type$));
  }

  static make() {
    const $self = new GenPages();
    GenPages.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    return;
  }

}

const p = sys.Pod.add$('xetoDoc');
const xp = sys.Param.noParams$();
let m;
DocSpec.type$ = p.at$('DocSpec','sys::Obj',[],{'sys::Js':""},8195,DocSpec);
DocPage.type$ = p.am$('DocPage','sys::Obj',[],{'sys::Js':""},8451,DocPage);
DocSpecPage.type$ = p.at$('DocSpecPage','xetoDoc::DocSpec',['xetoDoc::DocPage'],{'sys::Js':""},8195,DocSpecPage);
DocType.type$ = p.at$('DocType','xetoDoc::DocSpecPage',[],{'sys::Js':""},8194,DocType);
DocGlobal.type$ = p.at$('DocGlobal','xetoDoc::DocSpecPage',[],{'sys::Js':""},8194,DocGlobal);
DocSlot.type$ = p.at$('DocSlot','xetoDoc::DocSpec',[],{'sys::Js':""},8194,DocSlot);
DocLink.type$ = p.at$('DocLink','sys::Obj',[],{'sys::Js':""},8194,DocLink);
DocTypeRef.type$ = p.at$('DocTypeRef','sys::Obj',[],{'sys::Js':""},8195,DocTypeRef);
DocSimpleTypeRef.type$ = p.at$('DocSimpleTypeRef','xetoDoc::DocTypeRef',[],{'sys::Js':""},8194,DocSimpleTypeRef);
DocOfTypeRef.type$ = p.at$('DocOfTypeRef','xetoDoc::DocTypeRef',[],{'sys::Js':""},8194,DocOfTypeRef);
DocCompoundTypeRef.type$ = p.at$('DocCompoundTypeRef','xetoDoc::DocTypeRef',[],{'sys::Js':""},8195,DocCompoundTypeRef);
DocAndTypeRef.type$ = p.at$('DocAndTypeRef','xetoDoc::DocCompoundTypeRef',[],{'sys::Js':""},8194,DocAndTypeRef);
DocOrTypeRef.type$ = p.at$('DocOrTypeRef','xetoDoc::DocCompoundTypeRef',[],{'sys::Js':""},8194,DocOrTypeRef);
DocChapter.type$ = p.at$('DocChapter','sys::Obj',['xetoDoc::DocPage'],{'sys::Js':""},8194,DocChapter);
DocPageType.type$ = p.at$('DocPageType','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,DocPageType);
DocTypeGraph.type$ = p.at$('DocTypeGraph','sys::Obj',[],{'sys::Js':""},8194,DocTypeGraph);
DocTypeGraphEdge.type$ = p.at$('DocTypeGraphEdge','sys::Obj',[],{'sys::Js':""},8194,DocTypeGraphEdge);
DocTypeGraphEdgeMode.type$ = p.at$('DocTypeGraphEdgeMode','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,DocTypeGraphEdgeMode);
DocUtil.type$ = p.at$('DocUtil','sys::Obj',[],{'sys::Js':""},8194,DocUtil);
DocLib.type$ = p.at$('DocLib','sys::Obj',['xetoDoc::DocPage'],{'sys::Js':""},8194,DocLib);
DocLibDepend.type$ = p.at$('DocLibDepend','sys::Obj',[],{'sys::Js':""},8194,DocLibDepend);
DocLibRef.type$ = p.at$('DocLibRef','sys::Obj',[],{'sys::Js':""},8194,DocLibRef);
DocVal.type$ = p.at$('DocVal','sys::Obj',[],{'sys::Js':""},8195,DocVal);
DocDict.type$ = p.at$('DocDict','xetoDoc::DocVal',[],{'sys::Js':""},8194,DocDict);
DocInstance.type$ = p.at$('DocInstance','sys::Obj',['xetoDoc::DocPage'],{'sys::Js':""},8194,DocInstance);
DocScalar.type$ = p.at$('DocScalar','xetoDoc::DocVal',[],{'sys::Js':""},8194,DocScalar);
DocList.type$ = p.at$('DocList','xetoDoc::DocVal',[],{'sys::Js':""},8194,DocList);
DocMarkdown.type$ = p.at$('DocMarkdown','sys::Obj',[],{'sys::Js':""},8194,DocMarkdown);
DocSummary.type$ = p.at$('DocSummary','sys::Obj',[],{'sys::Js':""},8194,DocSummary);
DocCompiler.type$ = p.at$('DocCompiler','sys::Obj',[],{},8192,DocCompiler);
Step.type$ = p.at$('Step','sys::Obj',[],{},129,Step);
WriteJson.type$ = p.at$('WriteJson','xetoDoc::Step',[],{},128,WriteJson);
GenSummaries.type$ = p.at$('GenSummaries','xetoDoc::Step',[],{},128,GenSummaries);
PageEntry.type$ = p.at$('PageEntry','sys::Obj',[],{},8192,PageEntry);
StubPages.type$ = p.at$('StubPages','xetoDoc::Step',[],{},128,StubPages);
GenPages.type$ = p.at$('GenPages','xetoDoc::Step',[],{},128,GenPages);
DocSpec.type$.am$('name',270337,'sys::Str',xp,{}).am$('doc',270337,'xetoDoc::DocMarkdown',xp,{}).am$('meta',270337,'xetoDoc::DocDict',xp,{}).am$('make',139268,'sys::Void',xp,{});
DocPage.type$.am$('uri',270337,'sys::Uri',xp,{}).am$('lib',270337,'xetoDoc::DocLibRef?',xp,{}).am$('pageType',270337,'xetoDoc::DocPageType',xp,{}).am$('encode',270337,'[sys::Str:sys::Obj]',xp,{}).am$('decode',40962,'xetoDoc::DocPage',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj]',false)]),{}).am$('dump',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{});
DocSpecPage.type$.af$('qname',73730,'sys::Str',{}).af$('doc',336898,'xetoDoc::DocMarkdown',{}).af$('meta',336898,'xetoDoc::DocDict',{}).af$('libName$Store',722944,'sys::Obj?',{}).af$('name$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('doc','xetoDoc::DocMarkdown',false),new sys.Param('meta','xetoDoc::DocDict',false)]),{}).am$('libName',532480,'sys::Str',xp,{}).am$('name',795648,'sys::Str',xp,{}).am$('lib',271360,'xetoDoc::DocLibRef?',xp,{}).am$('encode',271360,'[sys::Str:sys::Obj]',xp,{}).am$('libName$Once',133120,'sys::Str',xp,{}).am$('name$Once',133120,'sys::Str',xp,{});
DocType.type$.af$('base',73730,'xetoDoc::DocTypeRef?',{}).af$('supertypes',73730,'xetoDoc::DocTypeGraph',{}).af$('subtypes',73730,'xetoDoc::DocTypeGraph',{}).af$('slots',73730,'[sys::Str:xetoDoc::DocSlot]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('doc','xetoDoc::DocMarkdown',false),new sys.Param('meta','xetoDoc::DocDict',false),new sys.Param('base','xetoDoc::DocTypeRef?',false),new sys.Param('supertypes','xetoDoc::DocTypeGraph',false),new sys.Param('subtypes','xetoDoc::DocTypeGraph',false),new sys.Param('slots','[sys::Str:xetoDoc::DocSlot]',false)]),{}).am$('pageType',271360,'xetoDoc::DocPageType',xp,{}).am$('uri',271360,'sys::Uri',xp,{}).am$('encode',271360,'[sys::Str:sys::Obj]',xp,{}).am$('doDecode',40962,'xetoDoc::DocType',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj]',false)]),{});
DocGlobal.type$.af$('type',73730,'xetoDoc::DocTypeRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('doc','xetoDoc::DocMarkdown',false),new sys.Param('meta','xetoDoc::DocDict',false),new sys.Param('type','xetoDoc::DocTypeRef',false)]),{}).am$('pageType',271360,'xetoDoc::DocPageType',xp,{}).am$('uri',271360,'sys::Uri',xp,{}).am$('encode',271360,'[sys::Str:sys::Obj]',xp,{}).am$('doDecode',40962,'xetoDoc::DocGlobal',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj]',false)]),{});
DocSlot.type$.af$('empty',106498,'[sys::Str:xetoDoc::DocSlot]',{}).af$('name',336898,'sys::Str',{}).af$('doc',336898,'xetoDoc::DocMarkdown',{}).af$('meta',336898,'xetoDoc::DocDict',{}).af$('type',73730,'xetoDoc::DocTypeRef',{}).af$('parent',73730,'xetoDoc::DocTypeRef?',{}).af$('base',73730,'xetoDoc::DocLink?',{}).af$('slots',73730,'[sys::Str:xetoDoc::DocSlot]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('doc','xetoDoc::DocMarkdown',false),new sys.Param('meta','xetoDoc::DocDict',false),new sys.Param('type','xetoDoc::DocTypeRef',false),new sys.Param('parent','xetoDoc::DocTypeRef?',false),new sys.Param('base','xetoDoc::DocLink?',false),new sys.Param('slots','[sys::Str:xetoDoc::DocSlot]',false)]),{}).am$('encode',8192,'[sys::Str:sys::Obj]',xp,{}).am$('encodeMap',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:xetoDoc::DocSlot]',false)]),{}).am$('decode',40962,'xetoDoc::DocSlot',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('obj','[sys::Str:sys::Obj]',false)]),{}).am$('decodeMap',40962,'[sys::Str:xetoDoc::DocSlot]',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj]?',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DocLink.type$.af$('uri',73730,'sys::Uri',{}).af$('dis',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('dis','sys::Str',false)]),{}).am$('encode',8192,'[sys::Str:sys::Obj]',xp,{}).am$('decode',40962,'xetoDoc::DocLink?',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj]?',false)]),{});
DocTypeRef.type$.am$('dict',40962,'xetoDoc::DocTypeRef',xp,{}).am$('list',40962,'xetoDoc::DocTypeRef',xp,{}).am$('qname',270337,'sys::Str',xp,{}).am$('name',8192,'sys::Str',xp,{}).am$('uri',270337,'sys::Uri',xp,{}).am$('isMaybe',270337,'sys::Bool',xp,{}).am$('isOf',270336,'sys::Bool',xp,{}).am$('of',270336,'xetoDoc::DocTypeRef?',xp,{}).am$('isCompound',270336,'sys::Bool',xp,{}).am$('compoundSymbol',270336,'sys::Str?',xp,{}).am$('ofs',270336,'xetoDoc::DocTypeRef[]?',xp,{}).am$('encode',270337,'sys::Obj',xp,{}).am$('decode',40962,'xetoDoc::DocTypeRef?',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('decodeList',40962,'xetoDoc::DocTypeRef[]',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Obj[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DocSimpleTypeRef.type$.af$('predefined',106498,'[sys::Str:xetoDoc::DocSimpleTypeRef]',{}).af$('qname',336898,'sys::Str',{}).af$('isMaybe',336898,'sys::Bool',{}).am$('make',40966,'xetoDoc::DocSimpleTypeRef?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('isMaybe','sys::Bool',true)]),{}).am$('doMake',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('isMaybe','sys::Bool',false)]),{}).am$('uri',271360,'sys::Uri',xp,{}).am$('encode',271360,'sys::Obj',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
DocOfTypeRef.type$.af$('base',73730,'xetoDoc::DocTypeRef',{}).af$('of',336898,'xetoDoc::DocTypeRef?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('base','xetoDoc::DocTypeRef',false),new sys.Param('of','xetoDoc::DocTypeRef',false)]),{}).am$('uri',271360,'sys::Uri',xp,{}).am$('qname',271360,'sys::Str',xp,{}).am$('isMaybe',271360,'sys::Bool',xp,{}).am$('isOf',271360,'sys::Bool',xp,{}).am$('encode',9216,'[sys::Str:sys::Obj]',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
DocCompoundTypeRef.type$.af$('ofs',336898,'xetoDoc::DocTypeRef[]?',{}).af$('isMaybe',336898,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ofs','xetoDoc::DocTypeRef[]',false),new sys.Param('isMaybe','sys::Bool',false)]),{}).am$('uri',271360,'sys::Uri',xp,{}).am$('isCompound',271360,'sys::Bool',xp,{}).am$('encode',9216,'[sys::Str:sys::Obj]',xp,{}).am$('encodeTag',270337,'sys::Str',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
DocAndTypeRef.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ofs','xetoDoc::DocTypeRef[]',false),new sys.Param('isMaybe','sys::Bool',false)]),{}).am$('qname',271360,'sys::Str',xp,{}).am$('compoundSymbol',271360,'sys::Str?',xp,{}).am$('encodeTag',271360,'sys::Str',xp,{});
DocOrTypeRef.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ofs','xetoDoc::DocTypeRef[]',false),new sys.Param('isMaybe','sys::Bool',false)]),{}).am$('qname',271360,'sys::Str',xp,{}).am$('compoundSymbol',271360,'sys::Str?',xp,{}).am$('encodeTag',271360,'sys::Str',xp,{});
DocChapter.type$.af$('qname',73730,'sys::Str',{}).af$('doc',73730,'xetoDoc::DocMarkdown',{}).af$('libName$Store',722944,'sys::Obj?',{}).af$('name$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('doc','xetoDoc::DocMarkdown',false)]),{}).am$('uri',271360,'sys::Uri',xp,{}).am$('libName',532480,'sys::Str',xp,{}).am$('name',532480,'sys::Str',xp,{}).am$('pageType',271360,'xetoDoc::DocPageType',xp,{}).am$('lib',271360,'xetoDoc::DocLibRef?',xp,{}).am$('encode',271360,'[sys::Str:sys::Obj]',xp,{}).am$('doDecode',40962,'xetoDoc::DocChapter',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj]',false)]),{}).am$('libName$Once',133120,'sys::Str',xp,{}).am$('name$Once',133120,'sys::Str',xp,{});
DocPageType.type$.af$('lib',106506,'xetoDoc::DocPageType',{}).af$('type',106506,'xetoDoc::DocPageType',{}).af$('global',106506,'xetoDoc::DocPageType',{}).af$('instance',106506,'xetoDoc::DocPageType',{}).af$('chapter',106506,'xetoDoc::DocPageType',{}).af$('vals',106498,'xetoDoc::DocPageType[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'xetoDoc::DocPageType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DocTypeGraph.type$.af$('empty',106498,'xetoDoc::DocTypeGraph',{}).af$('types',73730,'xetoDoc::DocTypeRef[]',{}).af$('edges',73730,'xetoDoc::DocTypeGraphEdge[]?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('types','xetoDoc::DocTypeRef[]',false),new sys.Param('edges','xetoDoc::DocTypeGraphEdge[]?',false)]),{}).am$('encode',8192,'[sys::Str:sys::Obj]?',xp,{}).am$('decode',40962,'xetoDoc::DocTypeGraph',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj]?',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DocTypeGraphEdge.type$.af$('obj',106498,'xetoDoc::DocTypeGraphEdge',{}).af$('mode',73730,'xetoDoc::DocTypeGraphEdgeMode',{}).af$('types',73730,'sys::Int[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mode','xetoDoc::DocTypeGraphEdgeMode',false),new sys.Param('types','sys::Int[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('encodeList',40962,'sys::Str[]?',sys.List.make(sys.Param.type$,[new sys.Param('list','xetoDoc::DocTypeGraphEdge[]?',false)]),{}).am$('encode',8192,'sys::Str',xp,{}).am$('decodeList',40962,'xetoDoc::DocTypeGraphEdge[]?',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Str[]?',false)]),{}).am$('decode',40962,'xetoDoc::DocTypeGraphEdge',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DocTypeGraphEdgeMode.type$.af$('obj',106506,'xetoDoc::DocTypeGraphEdgeMode',{}).af$('base',106506,'xetoDoc::DocTypeGraphEdgeMode',{}).af$('and',106506,'xetoDoc::DocTypeGraphEdgeMode',{}).af$('or',106506,'xetoDoc::DocTypeGraphEdgeMode',{}).af$('vals',106498,'xetoDoc::DocTypeGraphEdgeMode[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'xetoDoc::DocTypeGraphEdgeMode?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DocUtil.type$.af$('libIcon',106498,'haystack::Ref',{}).af$('typeIcon',106498,'haystack::Ref',{}).af$('globalIcon',106498,'haystack::Ref',{}).af$('instanceIcon',106498,'haystack::Ref',{}).af$('chapterIcon',106498,'haystack::Ref',{}).am$('libToUri',40962,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('libName','sys::Str',false)]),{}).am$('specToUri',40962,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('typeToUri',40962,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false)]),{}).am$('globalToUri',40962,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false)]),{}).am$('instanceToUri',40962,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false)]),{}).am$('chapterToUri',40962,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false)]),{}).am$('qnameToUri',34818,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('isGlobal','sys::Bool',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
DocLib.type$.af$('name',73730,'sys::Str',{}).af$('doc',73730,'xetoDoc::DocMarkdown',{}).af$('meta',73730,'xetoDoc::DocDict',{}).af$('depends',73730,'xetoDoc::DocLibDepend[]',{}).af$('types',73730,'xetoDoc::DocSummary[]',{}).af$('globals',73730,'xetoDoc::DocSummary[]',{}).af$('instances',73730,'xetoDoc::DocSummary[]',{}).af$('chapters',73730,'xetoDoc::DocSummary[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('uri',271360,'sys::Uri',xp,{}).am$('pageType',271360,'xetoDoc::DocPageType',xp,{}).am$('lib',271360,'xetoDoc::DocLibRef?',xp,{}).am$('encode',271360,'[sys::Str:sys::Obj]',xp,{}).am$('doDecode',40962,'xetoDoc::DocLib',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj]',false)]),{});
DocLibDepend.type$.af$('lib',73730,'xetoDoc::DocLibRef',{}).af$('versions',73730,'xeto::LibDependVersions',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xetoDoc::DocLibRef',false),new sys.Param('versions','xeto::LibDependVersions',false)]),{}).am$('encodeList',40962,'sys::Obj[]',sys.List.make(sys.Param.type$,[new sys.Param('list','xetoDoc::DocLibDepend[]',false)]),{}).am$('encode',8192,'[sys::Str:sys::Obj]',xp,{}).am$('decodeList',40962,'xetoDoc::DocLibDepend[]',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Obj[]?',false)]),{}).am$('decode',40962,'xetoDoc::DocLibDepend',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj]',false)]),{});
DocLibRef.type$.af$('name',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('uri',8192,'sys::Uri',xp,{}).am$('encode',8192,'sys::Obj',xp,{}).am$('decode',40962,'xetoDoc::DocLibRef',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{});
DocVal.type$.am$('isScalar',270336,'sys::Bool',xp,{}).am$('asScalar',270336,'xetoDoc::DocScalar',xp,{}).am$('isList',270336,'sys::Bool',xp,{}).am$('asList',270336,'xetoDoc::DocList',xp,{}).am$('isDict',270336,'sys::Bool',xp,{}).am$('asDict',270336,'xetoDoc::DocDict',xp,{}).am$('type',270337,'xetoDoc::DocTypeRef',xp,{}).am$('encodeVal',8192,'sys::Obj?',xp,{}).am$('decodeVal',40962,'xetoDoc::DocVal',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DocDict.type$.af$('empty',106498,'xetoDoc::DocDict',{}).af$('type',336898,'xetoDoc::DocTypeRef',{}).af$('dict',73730,'[sys::Str:xetoDoc::DocVal]',{}).am$('make',40966,'xetoDoc::DocDict?',sys.List.make(sys.Param.type$,[new sys.Param('type','xetoDoc::DocTypeRef',false),new sys.Param('dict','[sys::Str:xetoDoc::DocVal]',false)]),{}).am$('doMake',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','xetoDoc::DocTypeRef',false),new sys.Param('dict','[sys::Str:xetoDoc::DocVal]',false)]),{}).am$('isDict',271360,'sys::Bool',xp,{}).am$('asDict',271360,'xetoDoc::DocDict',xp,{}).am$('get',8192,'xetoDoc::DocVal?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('encode',8192,'[sys::Str:sys::Obj]?',xp,{}).am$('decode',40962,'xetoDoc::DocDict?',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj]?',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DocInstance.type$.af$('qname',73730,'sys::Str',{}).af$('instance',73730,'xetoDoc::DocDict',{}).af$('libName$Store',722944,'sys::Obj?',{}).af$('name$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('instance','xetoDoc::DocDict',false)]),{}).am$('uri',271360,'sys::Uri',xp,{}).am$('libName',532480,'sys::Str',xp,{}).am$('name',532480,'sys::Str',xp,{}).am$('pageType',271360,'xetoDoc::DocPageType',xp,{}).am$('lib',271360,'xetoDoc::DocLibRef?',xp,{}).am$('encode',271360,'[sys::Str:sys::Obj]',xp,{}).am$('doDecode',40962,'xetoDoc::DocInstance',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj]',false)]),{}).am$('libName$Once',133120,'sys::Str',xp,{}).am$('name$Once',133120,'sys::Str',xp,{});
DocScalar.type$.af$('type',336898,'xetoDoc::DocTypeRef',{}).af$('scalar',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','xetoDoc::DocTypeRef',false),new sys.Param('scalar','sys::Str',false)]),{}).am$('isScalar',271360,'sys::Bool',xp,{}).am$('asScalar',271360,'xetoDoc::DocScalar',xp,{});
DocList.type$.af$('type',336898,'xetoDoc::DocTypeRef',{}).af$('list',73730,'xetoDoc::DocVal[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','xetoDoc::DocTypeRef',false),new sys.Param('list','xetoDoc::DocVal[]',false)]),{}).am$('isList',271360,'sys::Bool',xp,{}).am$('asList',271360,'xetoDoc::DocList',xp,{});
DocMarkdown.type$.af$('empty',106498,'xetoDoc::DocMarkdown',{}).af$('text',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('text','sys::Str',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('encode',8192,'sys::Obj',xp,{}).am$('decode',40962,'xetoDoc::DocMarkdown',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('html',8192,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
DocSummary.type$.af$('link',73730,'xetoDoc::DocLink',{}).af$('text',73730,'xetoDoc::DocMarkdown',{}).af$('type',73730,'xetoDoc::DocTypeRef?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('link','xetoDoc::DocLink',false),new sys.Param('text','xetoDoc::DocMarkdown',false),new sys.Param('type','xetoDoc::DocTypeRef?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('encodeList',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('list','xetoDoc::DocSummary[]',false)]),{}).am$('encode',8192,'[sys::Str:sys::Obj]',xp,{}).am$('decodeList',40962,'xetoDoc::DocSummary[]',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Obj[]?',false)]),{}).am$('decode',40962,'xetoDoc::DocSummary',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj]',false)]),{});
DocCompiler.type$.af$('ns',73730,'xeto::LibNamespace',{}).af$('libs',73730,'xeto::Lib[]',{}).af$('outDir',73730,'sys::File?',{}).af$('log',73728,'xetoEnv::XetoLog',{}).af$('errs',73728,'xetoEnv::XetoCompilerErr[]',{}).af$('duration',73728,'sys::Duration?',{}).af$('pages',73728,'[sys::Str:xetoDoc::PageEntry]?',{}).af$('files',73728,'sys::File[]',{}).af$('autoNames',67584,'sys::Str[]',{}).am$('runCompiler',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('outDir','sys::File',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('applyOpts',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('opts','xeto::Dict?',false)]),{}).am$('compile',8192,'sys::This',xp,{}).am$('run',128,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('steps','xetoDoc::Step[]',false)]),{}).am$('info',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('warn',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('err',8192,'xetoEnv::XetoCompilerErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('err2',8192,'xetoEnv::XetoCompilerErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc1','util::FileLoc',false),new sys.Param('loc2','util::FileLoc',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('page',8192,'xetoDoc::PageEntry',sys.List.make(sys.Param.type$,[new sys.Param('def','sys::Obj',false)]),{}).am$('key',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('def','sys::Obj',false)]),{}).am$('autoName',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{});
Step.type$.af$('compiler',73728,'xetoDoc::DocCompiler?',{}).am$('run',270337,'sys::Void',xp,{}).am$('ns',8192,'xeto::LibNamespace',xp,{}).am$('info',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('err',8192,'xetoEnv::XetoCompilerErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('err','sys::Err?',true)]),{}).am$('err2',8192,'xetoEnv::XetoCompilerErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc1','util::FileLoc',false),new sys.Param('loc2','util::FileLoc',false),new sys.Param('err','sys::Err?',true)]),{}).am$('bombIfErr',8192,'sys::Void',xp,{}).am$('eachPage',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoDoc::PageEntry->sys::Void|',false)]),{}).am$('typesToDoc',8192,'xeto::Spec[]',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('chapters',8192,'xetoDoc::PageEntry[]',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('chapterSummaries',8192,'xetoDoc::DocSummary[]',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('page',8192,'xetoDoc::PageEntry',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj',false)]),{}).am$('summary',8192,'xetoDoc::DocSummary',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj',false)]),{}).am$('summaries',8192,'xetoDoc::DocSummary[]',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Obj[]',false)]),{}).am$('genTypeRef',8192,'xetoDoc::DocTypeRef?',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Spec?',false)]),{}).am$('genTypeRefOfs',8192,'xetoDoc::DocTypeRef[]',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Spec',false)]),{}).am$('make',139268,'sys::Void',xp,{});
WriteJson.type$.am$('run',271360,'sys::Void',xp,{}).am$('writePage',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('entry','xetoDoc::PageEntry',false)]),{}).am$('writeToMem',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('entry','xetoDoc::PageEntry',false),new sys.Param('json','sys::Str',false)]),{}).am$('writeToFile',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('entry','xetoDoc::PageEntry',false),new sys.Param('json','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
GenSummaries.type$.am$('run',271360,'sys::Void',xp,{}).am$('genSummary',2048,'xetoDoc::DocSummary',sys.List.make(sys.Param.type$,[new sys.Param('entry','xetoDoc::PageEntry',false)]),{}).am$('parse',8192,'xetoDoc::DocMarkdown',sys.List.make(sys.Param.type$,[new sys.Param('doc','sys::Obj?',false)]),{}).am$('parseFirstSentence',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
PageEntry.type$.af$('key',73730,'sys::Str',{}).af$('uri',73730,'sys::Uri',{}).af$('lib',73730,'xeto::Lib',{}).af$('dis',73730,'sys::Str',{}).af$('pageType',73730,'xetoDoc::DocPageType',{}).af$('link',73730,'xetoDoc::DocLink',{}).af$('summaryType',73728,'xetoDoc::DocTypeRef?',{}).af$('meta',73730,'haystack::Dict',{}).af$('def',73730,'sys::Obj',{}).af$('summaryRef',65664,'xetoDoc::DocSummary?',{}).af$('pageRef',65664,'xetoDoc::DocPage?',{}).af$('mdIndex',73728,'sys::Str?',{}).am$('makeLib',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Lib',false)]),{}).am$('makeSpec',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Spec',false),new sys.Param('pageType','xetoDoc::DocPageType',false)]),{}).am$('makeInstance',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false),new sys.Param('x','haystack::Dict',false)]),{}).am$('makeChapter',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false),new sys.Param('file','sys::Uri',false),new sys.Param('markdown','sys::Str',false)]),{}).am$('uriJson',8192,'sys::Uri',xp,{}).am$('summary',8192,'xetoDoc::DocSummary',xp,{}).am$('page',8192,'xetoDoc::DocPage',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
StubPages.type$.af$('byKey',73728,'[sys::Str:xetoDoc::PageEntry]',{}).af$('byUri',73728,'[sys::Uri:xetoDoc::PageEntry]',{}).am$('run',271360,'sys::Void',xp,{}).am$('stubLib',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('add',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('entry','xetoDoc::PageEntry',false)]),{}).am$('make',139268,'sys::Void',xp,{});
GenPages.type$.am$('run',271360,'sys::Void',xp,{}).am$('genPage',8192,'xetoDoc::DocPage',sys.List.make(sys.Param.type$,[new sys.Param('entry','xetoDoc::PageEntry',false)]),{}).am$('genLib',8192,'xetoDoc::DocLib',sys.List.make(sys.Param.type$,[new sys.Param('entry','xetoDoc::PageEntry',false),new sys.Param('x','xeto::Lib',false)]),{}).am$('genDepends',8192,'xetoDoc::DocLibDepend[]',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('genType',8192,'xetoDoc::DocType',sys.List.make(sys.Param.type$,[new sys.Param('entry','xetoDoc::PageEntry',false),new sys.Param('x','xeto::Spec',false)]),{}).am$('genSupertypes',8192,'xetoDoc::DocTypeGraph',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Spec',false)]),{}).am$('toSupertypeEdge',8192,'xetoDoc::DocTypeGraphEdge',sys.List.make(sys.Param.type$,[new sys.Param('qnameToIndex','[sys::Str:sys::Int]',false),new sys.Param('spec','xeto::Spec',false)]),{}).am$('doGenSupertypes',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Int]',false),new sys.Param('x','xeto::Spec?',false)]),{}).am$('genSubtypes',8192,'xetoDoc::DocTypeGraph',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Spec',false)]),{}).am$('genGlobal',8192,'xetoDoc::DocGlobal',sys.List.make(sys.Param.type$,[new sys.Param('entry','xetoDoc::PageEntry',false),new sys.Param('x','xeto::Spec',false)]),{}).am$('genInstance',8192,'xetoDoc::DocInstance',sys.List.make(sys.Param.type$,[new sys.Param('entry','xetoDoc::PageEntry',false),new sys.Param('x','haystack::Dict',false)]),{}).am$('genSlots',8192,'[sys::Str:xetoDoc::DocSlot]',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('genSlot',8192,'xetoDoc::DocSlot',sys.List.make(sys.Param.type$,[new sys.Param('parentType','xeto::Spec',false),new sys.Param('slot','xeto::Spec',false)]),{}).am$('genSlotBase',8192,'xetoDoc::DocLink?',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false)]),{}).am$('genChapter',8192,'xetoDoc::DocChapter',sys.List.make(sys.Param.type$,[new sys.Param('entry','xetoDoc::PageEntry',false),new sys.Param('markdown','sys::Str',false)]),{}).am$('genDict',8192,'xetoDoc::DocDict',sys.List.make(sys.Param.type$,[new sys.Param('d','haystack::Dict',false)]),{}).am$('genVal',8192,'xetoDoc::DocVal',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj',false)]),{}).am$('genList',8192,'xetoDoc::DocList',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj[]',false)]),{}).am$('genScalar',8192,'xetoDoc::DocScalar',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj',false)]),{}).am$('genSpecDoc',8192,'xetoDoc::DocMarkdown',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Spec',false)]),{}).am$('genDoc',8192,'xetoDoc::DocMarkdown',sys.List.make(sys.Param.type$,[new sys.Param('doc','sys::Obj?',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "xetoDoc");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;util 1.0;markdown 1.0;web 1.0;xeto 3.1.11;xetoEnv 3.1.11;haystack 3.1.11");
m.set("pod.summary", "Xeto documentation compiler");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:29-05:00 New_York");
m.set("build.tsKey", "241210143129");
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
  DocSpec,
  DocPage,
  DocSpecPage,
  DocType,
  DocGlobal,
  DocSlot,
  DocLink,
  DocTypeRef,
  DocSimpleTypeRef,
  DocOfTypeRef,
  DocCompoundTypeRef,
  DocAndTypeRef,
  DocOrTypeRef,
  DocChapter,
  DocPageType,
  DocTypeGraph,
  DocTypeGraphEdge,
  DocTypeGraphEdgeMode,
  DocUtil,
  DocLib,
  DocLibDepend,
  DocLibRef,
  DocVal,
  DocDict,
  DocInstance,
  DocScalar,
  DocList,
  DocMarkdown,
  DocSummary,
  DocCompiler,
  PageEntry,
};
