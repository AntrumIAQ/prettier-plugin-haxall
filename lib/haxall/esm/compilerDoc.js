// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as fandoc from './fandoc.js'
import * as inet from './inet.js'
import * as syntax from './syntax.js'
import * as util from './util.js'
import * as web from './web.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class DocCrawler {
  constructor() {
    const this$ = this;
  }

  typeof() { return DocCrawler.type$; }

}

class DocEnv extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocEnv.type$; }

  theme() {
    return DocTheme.make();
  }

  topIndex() {
    return DocTopIndex.make();
  }

  doc(spaceName,docName,checked) {
    if (checked === undefined) checked = true;
    let doc = ((this$) => { let $_u0 = this$.space(spaceName, false); if ($_u0 == null) return null; return this$.space(spaceName, false).doc(docName, false); })(this);
    if (doc != null) {
      return doc;
    }
    ;
    if (checked) {
      throw UnknownDocErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", spaceName), "::"), docName));
    }
    ;
    return null;
  }

  render(out,doc) {
    let r = sys.ObjUtil.coerce(doc.renderer().make(sys.List.make(sys.Obj.type$, [this, out, doc])), DocRenderer.type$);
    r.writeDoc();
    return;
  }

  linkUri(link) {
    if (link.absUri() != null) {
      return sys.ObjUtil.coerce(link.absUri(), sys.Uri.type$);
    }
    ;
    let s = sys.StrBuf.make();
    if (link.from().isTopIndex()) {
      if (!link.target().isTopIndex()) {
        s.add(link.target().space().spaceName()).add("/");
      }
      ;
    }
    else {
      if (link.target().isTopIndex()) {
        s.add("../");
      }
      else {
        if (link.from().space() !== link.target().space()) {
          s.add("../").add(link.target().space().spaceName()).add("/");
        }
        ;
      }
      ;
    }
    ;
    let docName = link.target().docName();
    if (sys.ObjUtil.equals(docName, "pod-doc")) {
      (docName = "index");
    }
    ;
    s.add(docName);
    let ext = this.linkUriExt();
    if (ext != null) {
      s.add(ext);
    }
    ;
    if (link.frag() != null) {
      s.add("#").add(link.frag());
    }
    ;
    return sys.Str.toUri(s.toStr());
  }

  linkUriExt() {
    return ".html";
  }

  link(from$,link,checked) {
    if (checked === undefined) checked = true;
    let colons = sys.Str.index(link, "::");
    let space = sys.ObjUtil.as(from$.space(), DocSpace.type$);
    let docName = link;
    if (colons != null) {
      let spaceName = sys.Str.getRange(link, sys.Range.make(0, sys.ObjUtil.coerce(colons, sys.Int.type$), true));
      (docName = sys.Str.getRange(link, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colons, sys.Int.type$), 2), -1)));
      (space = this.space(spaceName, checked));
      if (space == null) {
        return null;
      }
      ;
    }
    ;
    let dot = sys.Str.index(docName, ".");
    if (dot != null) {
      let typeName = sys.Str.getRange(docName, sys.Range.make(0, sys.ObjUtil.coerce(dot, sys.Int.type$), true));
      let slotName = sys.Str.getRange(docName, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(dot, sys.Int.type$), 1), -1));
      let type = sys.ObjUtil.as(space.doc(typeName, false), DocType.type$);
      if (type != null) {
        let slot = type.slot(slotName);
        if (slot != null) {
          return DocLink.make(from$, sys.ObjUtil.coerce(type, Doc.type$), sys.Str.plus(sys.Str.plus(sys.Str.plus("", typeName), "."), slotName), slotName);
        }
        ;
      }
      ;
    }
    ;
    if (sys.ObjUtil.is(from$, DocType.type$)) {
      let slot = sys.ObjUtil.coerce(from$, DocType.type$).slot(docName, false);
      if (slot != null) {
        return DocLink.make(from$, from$, docName, docName);
      }
      ;
    }
    ;
    let pound = sys.Str.index(docName, "#");
    if (pound != null) {
      let chapterName = sys.Str.getRange(docName, sys.Range.make(0, sys.ObjUtil.coerce(pound, sys.Int.type$), true));
      let headingName = sys.Str.getRange(docName, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(pound, sys.Int.type$), 1), -1));
      let doc = ((this$) => { if (sys.Str.isEmpty(chapterName)) return from$; return space.doc(chapterName, false); })(this);
      if (doc != null) {
        let heading = doc.heading(headingName, false);
        if (heading != null) {
          return DocLink.make(from$, sys.ObjUtil.coerce(doc, Doc.type$), doc.title(), headingName);
        }
        ;
      }
      ;
    }
    ;
    let doc = space.doc(docName, false);
    if (doc != null) {
      if (sys.ObjUtil.is(doc, DocType.type$)) {
        return DocLink.make(from$, sys.ObjUtil.coerce(doc, Doc.type$), doc.docName());
      }
      ;
      return DocLink.make(from$, sys.ObjUtil.coerce(doc, Doc.type$), doc.title());
    }
    ;
    if (checked) {
      throw sys.Err.make(sys.Str.plus("Broken link: ", link));
    }
    ;
    return null;
  }

  linkCheck(link,loc) {
    let type = sys.ObjUtil.as(link.target(), DocType.type$);
    if (type != null) {
      if (type.isNoDoc()) {
        this.errReport(DocErr.make(sys.Str.plus("Link to NoDoc type ", type.qname()), loc));
      }
      else {
        if (link.frag() != null) {
          let slot = type.slot(sys.ObjUtil.coerce(link.frag(), sys.Str.type$), false);
          if ((slot != null && slot.isNoDoc())) {
            this.errReport(DocErr.make(sys.Str.plus("Link to NoDoc slot ", slot.qname()), loc));
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

  initFandocHtmlWriter(out) {
    return fandoc.HtmlDocWriter.make(out);
  }

  err(msg,loc,cause) {
    if (cause === undefined) cause = null;
    return this.errReport(DocErr.make(msg, loc, cause));
  }

  errReport(err) {
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus("", err.loc()), ": "), err.msg()));
    if (err.cause() != null) {
      err.cause().trace();
    }
    ;
    return err;
  }

  static make() {
    const $self = new DocEnv();
    DocEnv.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DocLink extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocLink.type$; }

  #from = null;

  from() { return this.#from; }

  __from(it) { if (it === undefined) return this.#from; else this.#from = it; }

  #target = null;

  target() { return this.#target; }

  __target(it) { if (it === undefined) return this.#target; else this.#target = it; }

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  #frag = null;

  frag() { return this.#frag; }

  __frag(it) { if (it === undefined) return this.#frag; else this.#frag = it; }

  #absUri = null;

  absUri() { return this.#absUri; }

  __absUri(it) { if (it === undefined) return this.#absUri; else this.#absUri = it; }

  static make(from$,target,dis,frag) {
    const $self = new DocLink();
    DocLink.make$($self,from$,target,dis,frag);
    return $self;
  }

  static make$($self,from$,target,dis,frag) {
    if (dis === undefined) dis = target.docName();
    if (frag === undefined) frag = null;
    $self.#from = from$;
    $self.#target = target;
    $self.#dis = dis;
    $self.#frag = frag;
    return;
  }

  static makeAbsUri(from$,uri,dis) {
    const $self = new DocLink();
    DocLink.makeAbsUri$($self,from$,uri,dis);
    return $self;
  }

  static makeAbsUri$($self,from$,uri,dis) {
    $self.#from = from$;
    $self.#target = from$;
    $self.#absUri = uri;
    $self.#dis = dis;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[", this.#dis), "] "), this.#from.docName()), " -> "), this.#target.docName()), ((this$) => { if (this$.#frag == null) return ""; return sys.Str.plus("#", this$.#frag); })(this));
  }

}

class DocErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocErr.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  static make(msg,loc,cause) {
    const $self = new DocErr();
    DocErr.make$($self,msg,loc,cause);
    return $self;
  }

  static make$($self,msg,loc,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    $self.#loc = loc;
    return;
  }

}

class UnknownDocErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownDocErr.type$; }

  static make(msg,cause) {
    const $self = new UnknownDocErr();
    UnknownDocErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class DocErrHandler extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#errs = sys.List.make(DocErr.type$);
    return;
  }

  typeof() { return DocErrHandler.type$; }

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

  onErr(err) {
    this.#errs.add(err);
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus("", err.loc()), ": "), err.msg()));
    if (err.cause() != null) {
      err.cause().trace();
    }
    ;
    return;
  }

  static make() {
    const $self = new DocErrHandler();
    DocErrHandler.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class DocTheme extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocTheme.type$; }

  writeStart(r) {
    let out = r.out();
    out.docType();
    out.html();
    sys.ObjUtil.coerce(out.head().title().esc(r.doc().title()).titleEnd().printLine("<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>"), web.WebOutStream.type$).includeCss(((this$) => { if (r.doc().isTopIndex()) return sys.Uri.fromStr("style.css"); return sys.Uri.fromStr("../style.css"); })(this)).headEnd();
    out.body();
    return;
  }

  writeBreadcrumb(r) {
    let out = r.out();
    let doc = r.doc();
    let ext = ((this$) => { let $_u4 = r.env().linkUriExt(); if ($_u4 != null) return $_u4; return ""; })(this);
    out.div("class='breadcrumb'").ul();
    if (doc.isTopIndex()) {
      out.li().a(sys.Str.toUri(sys.Str.plus("index", ext))).w("Doc Index").aEnd().liEnd();
    }
    else {
      out.li().a(sys.Str.toUri(sys.Str.plus("../index", ext))).w("Doc Index").aEnd().liEnd();
      out.li().a(sys.Str.toUri(sys.Str.plus("index", ext))).w(r.doc().space().breadcrumb()).aEnd().liEnd();
      if (doc.isSpaceIndex()) {
      }
      else {
        if (sys.ObjUtil.is(doc, DocSrc.type$)) {
          let src = sys.ObjUtil.coerce(doc, DocSrc.type$);
          let type = src.pod().type(src.uri().basename(), false);
          if (type != null) {
            out.li().a(sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus("", type.docName()), ""), ext))).w(type.breadcrumb()).aEnd().liEnd();
          }
          ;
          out.li().a(sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus("", doc.docName()), ""), ext))).w(src.breadcrumb()).aEnd().liEnd();
        }
        else {
          out.li().a(sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus("", doc.docName()), ""), ext))).w(r.doc().breadcrumb()).aEnd().liEnd();
        }
        ;
      }
      ;
    }
    ;
    out.ulEnd().divEnd();
    return;
  }

  writeEnd(r) {
    let out = r.out();
    out.bodyEnd();
    out.htmlEnd();
    return;
  }

  static make() {
    const $self = new DocTheme();
    DocTheme.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DocSlot extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocSlot.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #parent = null;

  parent() { return this.#parent; }

  __parent(it) { if (it === undefined) return this.#parent; else this.#parent = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #qname = null;

  qname() { return this.#qname; }

  __qname(it) { if (it === undefined) return this.#qname; else this.#qname = it; }

  #flags = 0;

  flags() { return this.#flags; }

  __flags(it) { if (it === undefined) return this.#flags; else this.#flags = it; }

  #doc = null;

  doc() { return this.#doc; }

  __doc(it) { if (it === undefined) return this.#doc; else this.#doc = it; }

  #facets = null;

  facets() { return this.#facets; }

  __facets(it) { if (it === undefined) return this.#facets; else this.#facets = it; }

  #isNoDoc = false;

  isNoDoc() { return this.#isNoDoc; }

  __isNoDoc(it) { if (it === undefined) return this.#isNoDoc; else this.#isNoDoc = it; }

  static make(attrs,parent,name) {
    const $self = new DocSlot();
    DocSlot.make$($self,attrs,parent,name);
    return $self;
  }

  static make$($self,attrs,parent,name) {
    $self.#loc = attrs.loc();
    $self.#parent = parent;
    $self.#name = name;
    $self.#qname = sys.Str.plus(sys.Str.plus(parent.qname(), "."), name);
    $self.#flags = attrs.flags();
    $self.#doc = sys.ObjUtil.coerce(attrs.doc(), DocFandoc.type$);
    $self.#facets = sys.ObjUtil.coerce(((this$) => { let $_u5 = attrs.facets(); if ($_u5 == null) return null; return sys.ObjUtil.toImmutable(attrs.facets()); })($self), sys.Type.find("compilerDoc::DocFacet[]"));
    $self.#isNoDoc = $self.hasFacet("sys::NoDoc");
    return;
  }

  dis() {
    return sys.Str.plus(sys.Str.plus(this.#parent.name(), "."), this.#name);
  }

  facet(qname,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let f = this.#facets.find((f) => {
      return sys.ObjUtil.equals(f.type().qname(), qname);
    });
    if (f != null) {
      return f;
    }
    ;
    if (checked) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Missing facet @", qname), " on "), this.#qname));
    }
    ;
    return null;
  }

  hasFacet(qname) {
    const this$ = this;
    return this.#facets.any((f) => {
      return sys.ObjUtil.equals(f.type().qname(), qname);
    });
  }

}

class DocField extends DocSlot {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocField.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #init = null;

  init() { return this.#init; }

  __init(it) { if (it === undefined) return this.#init; else this.#init = it; }

  #setterFlags = null;

  setterFlags() { return this.#setterFlags; }

  __setterFlags(it) { if (it === undefined) return this.#setterFlags; else this.#setterFlags = it; }

  static make(attrs,parent,name,type,init) {
    const $self = new DocField();
    DocField.make$($self,attrs,parent,name,type,init);
    return $self;
  }

  static make$($self,attrs,parent,name,type,init) {
    DocSlot.make$($self, attrs, parent, name);
    $self.#type = type;
    $self.#init = init;
    $self.#setterFlags = attrs.setterFlags();
    return;
  }

  isField() {
    return true;
  }

  isMethod() {
    return false;
  }

}

class DocMethod extends DocSlot {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocMethod.type$; }

  #returns = null;

  returns() { return this.#returns; }

  __returns(it) { if (it === undefined) return this.#returns; else this.#returns = it; }

  #params = null;

  params() { return this.#params; }

  __params(it) { if (it === undefined) return this.#params; else this.#params = it; }

  static make(attrs,parent,name,returns,params) {
    const $self = new DocMethod();
    DocMethod.make$($self,attrs,parent,name,returns,params);
    return $self;
  }

  static make$($self,attrs,parent,name,returns,params) {
    DocSlot.make$($self, attrs, parent, name);
    $self.#returns = returns;
    $self.#params = sys.ObjUtil.coerce(((this$) => { let $_u6 = params; if ($_u6 == null) return null; return sys.ObjUtil.toImmutable(params); })($self), sys.Type.find("compilerDoc::DocParam[]"));
    return;
  }

  isField() {
    return false;
  }

  isMethod() {
    return true;
  }

}

class DocParam extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocParam.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #def = null;

  def() { return this.#def; }

  __def(it) { if (it === undefined) return this.#def; else this.#def = it; }

  static make(type,name,def) {
    const $self = new DocParam();
    DocParam.make$($self,type,name,def);
    return $self;
  }

  static make$($self,type,name,def) {
    $self.#type = type;
    $self.#name = name;
    $self.#def = def;
    return;
  }

  toStr() {
    let s = sys.StrBuf.make().add(this.#type).addChar(32).add(this.#name);
    if (this.#def != null) {
      s.add(" := ").add(this.#def);
    }
    ;
    return s.toStr();
  }

}

class DocFlags extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocFlags.type$; }

  static #Abstract = undefined;

  static Abstract() {
    if (DocFlags.#Abstract === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Abstract === undefined) DocFlags.#Abstract = 0;
    }
    return DocFlags.#Abstract;
  }

  static #Const = undefined;

  static Const() {
    if (DocFlags.#Const === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Const === undefined) DocFlags.#Const = 0;
    }
    return DocFlags.#Const;
  }

  static #Ctor = undefined;

  static Ctor() {
    if (DocFlags.#Ctor === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Ctor === undefined) DocFlags.#Ctor = 0;
    }
    return DocFlags.#Ctor;
  }

  static #Enum = undefined;

  static Enum() {
    if (DocFlags.#Enum === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Enum === undefined) DocFlags.#Enum = 0;
    }
    return DocFlags.#Enum;
  }

  static #Facet = undefined;

  static Facet() {
    if (DocFlags.#Facet === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Facet === undefined) DocFlags.#Facet = 0;
    }
    return DocFlags.#Facet;
  }

  static #Final = undefined;

  static Final() {
    if (DocFlags.#Final === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Final === undefined) DocFlags.#Final = 0;
    }
    return DocFlags.#Final;
  }

  static #Getter = undefined;

  static Getter() {
    if (DocFlags.#Getter === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Getter === undefined) DocFlags.#Getter = 0;
    }
    return DocFlags.#Getter;
  }

  static #Internal = undefined;

  static Internal() {
    if (DocFlags.#Internal === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Internal === undefined) DocFlags.#Internal = 0;
    }
    return DocFlags.#Internal;
  }

  static #Mixin = undefined;

  static Mixin() {
    if (DocFlags.#Mixin === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Mixin === undefined) DocFlags.#Mixin = 0;
    }
    return DocFlags.#Mixin;
  }

  static #Native = undefined;

  static Native() {
    if (DocFlags.#Native === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Native === undefined) DocFlags.#Native = 0;
    }
    return DocFlags.#Native;
  }

  static #Override = undefined;

  static Override() {
    if (DocFlags.#Override === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Override === undefined) DocFlags.#Override = 0;
    }
    return DocFlags.#Override;
  }

  static #Private = undefined;

  static Private() {
    if (DocFlags.#Private === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Private === undefined) DocFlags.#Private = 0;
    }
    return DocFlags.#Private;
  }

  static #Protected = undefined;

  static Protected() {
    if (DocFlags.#Protected === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Protected === undefined) DocFlags.#Protected = 0;
    }
    return DocFlags.#Protected;
  }

  static #Public = undefined;

  static Public() {
    if (DocFlags.#Public === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Public === undefined) DocFlags.#Public = 0;
    }
    return DocFlags.#Public;
  }

  static #Setter = undefined;

  static Setter() {
    if (DocFlags.#Setter === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Setter === undefined) DocFlags.#Setter = 0;
    }
    return DocFlags.#Setter;
  }

  static #Static = undefined;

  static Static() {
    if (DocFlags.#Static === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Static === undefined) DocFlags.#Static = 0;
    }
    return DocFlags.#Static;
  }

  static #Storage = undefined;

  static Storage() {
    if (DocFlags.#Storage === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Storage === undefined) DocFlags.#Storage = 0;
    }
    return DocFlags.#Storage;
  }

  static #Synthetic = undefined;

  static Synthetic() {
    if (DocFlags.#Synthetic === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Synthetic === undefined) DocFlags.#Synthetic = 0;
    }
    return DocFlags.#Synthetic;
  }

  static #Virtual = undefined;

  static Virtual() {
    if (DocFlags.#Virtual === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Virtual === undefined) DocFlags.#Virtual = 0;
    }
    return DocFlags.#Virtual;
  }

  static #Once = undefined;

  static Once() {
    if (DocFlags.#Once === undefined) {
      DocFlags.static$init();
      if (DocFlags.#Once === undefined) DocFlags.#Once = 0;
    }
    return DocFlags.#Once;
  }

  static #toNameMap = undefined;

  static toNameMap() {
    if (DocFlags.#toNameMap === undefined) {
      DocFlags.static$init();
      if (DocFlags.#toNameMap === undefined) DocFlags.#toNameMap = null;
    }
    return DocFlags.#toNameMap;
  }

  static #fromNameMap = undefined;

  static fromNameMap() {
    if (DocFlags.#fromNameMap === undefined) {
      DocFlags.static$init();
      if (DocFlags.#fromNameMap === undefined) DocFlags.#fromNameMap = null;
    }
    return DocFlags.#fromNameMap;
  }

  static isAbstract(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Abstract()), 0);
  }

  static isConst(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Const()), 0);
  }

  static isCtor(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Ctor()), 0);
  }

  static isEnum(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Enum()), 0);
  }

  static isFacet(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Facet()), 0);
  }

  static isFinal(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Final()), 0);
  }

  static isGetter(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Getter()), 0);
  }

  static isInternal(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Internal()), 0);
  }

  static isMixin(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Mixin()), 0);
  }

  static isNative(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Native()), 0);
  }

  static isOverride(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Override()), 0);
  }

  static isPrivate(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Private()), 0);
  }

  static isProtected(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Protected()), 0);
  }

  static isPublic(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Public()), 0);
  }

  static isSetter(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Setter()), 0);
  }

  static isStatic(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Static()), 0);
  }

  static isStorage(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Storage()), 0);
  }

  static isSynthetic(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Synthetic()), 0);
  }

  static isVirtual(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Virtual()), 0);
  }

  static isOnce(flags) {
    return sys.ObjUtil.compareNE(sys.Int.and(flags, DocFlags.Once()), 0);
  }

  static fromName(name) {
    return sys.ObjUtil.coerce(((this$) => { let $_u7 = DocFlags.fromNameMap().get(name); if ($_u7 != null) return $_u7; throw sys.Err.make(sys.Str.plus(sys.Str.plus("Invalid flag '", name), "'")); })(this), sys.Int.type$);
  }

  static fromNames(names) {
    const this$ = this;
    let flags = 0;
    sys.Str.split(names).each((name) => {
      (flags = sys.Int.or(flags, DocFlags.fromName(name)));
      return;
    });
    return flags;
  }

  static toTypeDis(f) {
    let s = sys.StrBuf.make();
    if (DocFlags.isInternal(f)) {
      s.join("internal");
    }
    ;
    if ((DocFlags.isAbstract(f) && !DocFlags.isMixin(f))) {
      s.join("abstract");
    }
    ;
    if (DocFlags.isEnum(f)) {
      s.join("enum");
    }
    else {
      if (DocFlags.isFacet(f)) {
        s.join("facet");
      }
      else {
        if (DocFlags.isConst(f)) {
          s.join("const");
        }
        ;
      }
      ;
    }
    ;
    if (DocFlags.isMixin(f)) {
      s.join("mixin");
    }
    else {
      s.join("class");
    }
    ;
    return s.toStr();
  }

  static toSlotDis(f) {
    let s = sys.StrBuf.make();
    if (DocFlags.isInternal(f)) {
      s.join("internal");
    }
    else {
      if (DocFlags.isProtected(f)) {
        s.join("protected");
      }
      else {
        if (DocFlags.isPrivate(f)) {
          s.join("private");
        }
        ;
      }
      ;
    }
    ;
    if (DocFlags.isAbstract(f)) {
      s.join("abstract");
    }
    else {
      if (DocFlags.isVirtual(f)) {
        s.join("virtual");
      }
      ;
    }
    ;
    if (DocFlags.isCtor(f)) {
      s.join("new");
    }
    ;
    if (DocFlags.isConst(f)) {
      s.join("const");
    }
    ;
    if (DocFlags.isStatic(f)) {
      s.join("static");
    }
    ;
    if (DocFlags.isOverride(f)) {
      s.join("override");
    }
    ;
    if (DocFlags.isFinal(f)) {
      s.join("final");
    }
    ;
    return s.toStr();
  }

  static toNames(flags) {
    let s = sys.StrBuf.make();
    for (let b = 1; sys.ObjUtil.compareLE(b, DocFlags.Virtual()); (b = sys.Int.shiftl(b, 1))) {
      if (sys.ObjUtil.compareNE(sys.Int.and(flags, b), 0)) {
        s.join(DocFlags.toNameMap().get(sys.ObjUtil.coerce(b, sys.Obj.type$.toNullable())));
      }
      ;
    }
    ;
    return s.toStr();
  }

  static make() {
    const $self = new DocFlags();
    DocFlags.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    const this$ = this;
    DocFlags.#Abstract = 1;
    DocFlags.#Const = 2;
    DocFlags.#Ctor = 4;
    DocFlags.#Enum = 8;
    DocFlags.#Facet = 16;
    DocFlags.#Final = 32;
    DocFlags.#Getter = 64;
    DocFlags.#Internal = 128;
    DocFlags.#Mixin = 256;
    DocFlags.#Native = 512;
    DocFlags.#Override = 1024;
    DocFlags.#Private = 2048;
    DocFlags.#Protected = 4096;
    DocFlags.#Public = 8192;
    DocFlags.#Setter = 16384;
    DocFlags.#Static = 32768;
    DocFlags.#Storage = 65536;
    DocFlags.#Synthetic = 131072;
    DocFlags.#Virtual = 262144;
    DocFlags.#Once = 524288;
    if (true) {
      let toNameMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("sys::Str"));
      let fromNameMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int"));
      DocFlags.type$.fields().each((f) => {
        if ((f.isStatic() && f.isConst() && sys.ObjUtil.equals(f.type(), sys.Int.type$))) {
          let name = sys.Str.lower(f.name());
          let code = sys.ObjUtil.as(f.get(null), sys.Int.type$);
          if (sys.ObjUtil.equals(name, "ctor")) {
            (name = "new");
          }
          ;
          toNameMap.set(sys.ObjUtil.coerce(sys.ObjUtil.coerce(code, sys.Int.type$), sys.Obj.type$.toNullable()), name);
          fromNameMap.set(name, sys.ObjUtil.coerce(sys.ObjUtil.coerce(code, sys.Int.type$), sys.Obj.type$.toNullable()));
        }
        ;
        return;
      });
      DocFlags.#toNameMap = sys.ObjUtil.coerce(((this$) => { let $_u8 = toNameMap; if ($_u8 == null) return null; return sys.ObjUtil.toImmutable(toNameMap); })(this), sys.Type.find("[sys::Int:sys::Str]"));
      DocFlags.#fromNameMap = sys.ObjUtil.coerce(((this$) => { let $_u9 = fromNameMap; if ($_u9 == null) return null; return sys.ObjUtil.toImmutable(fromNameMap); })(this), sys.Type.find("[sys::Str:sys::Int]"));
    }
    ;
    return;
  }

}

class Doc extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Doc.type$; }

  breadcrumb() {
    return this.docName();
  }

  isCode() {
    return false;
  }

  isTopIndex() {
    return false;
  }

  isSpaceIndex() {
    return false;
  }

  onCrawl(crawler) {
    return;
  }

  heading(id,checked) {
    if (checked === undefined) checked = true;
    if (checked) {
      throw sys.NameErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unknown header anchor id ", this.space().spaceName()), "::"), this.docName()), "#"), id));
    }
    ;
    return null;
  }

  toStr() {
    return this.docName();
  }

  static make() {
    const $self = new Doc();
    Doc.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DocType extends Doc {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocType.type$; }

  #pod = null;

  pod() { return this.#pod; }

  __pod(it) { if (it === undefined) return this.#pod; else this.#pod = it; }

  #ref = null;

  ref() { return this.#ref; }

  __ref(it) { if (it === undefined) return this.#ref; else this.#ref = it; }

  #isNoDoc = false;

  isNoDoc() { return this.#isNoDoc; }

  __isNoDoc(it) { if (it === undefined) return this.#isNoDoc; else this.#isNoDoc = it; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #flags = 0;

  flags() { return this.#flags; }

  __flags(it) { if (it === undefined) return this.#flags; else this.#flags = it; }

  #facets = null;

  facets() { return this.#facets; }

  __facets(it) { if (it === undefined) return this.#facets; else this.#facets = it; }

  #doc = null;

  doc() { return this.#doc; }

  __doc(it) { if (it === undefined) return this.#doc; else this.#doc = it; }

  #base = null;

  base() { return this.#base; }

  __base(it) { if (it === undefined) return this.#base; else this.#base = it; }

  #mixins = null;

  mixins() { return this.#mixins; }

  __mixins(it) { if (it === undefined) return this.#mixins; else this.#mixins = it; }

  #isErr = false;

  isErr() { return this.#isErr; }

  __isErr(it) { if (it === undefined) return this.#isErr; else this.#isErr = it; }

  #slots = null;

  slots() { return this.#slots; }

  __slots(it) { if (it === undefined) return this.#slots; else this.#slots = it; }

  #declared = null;

  declared() { return this.#declared; }

  __declared(it) { if (it === undefined) return this.#declared; else this.#declared = it; }

  #slotMap = null;

  // private field reflection only
  __slotMap(it) { if (it === undefined) return this.#slotMap; else this.#slotMap = it; }

  static make(pod,attrs,ref,list,slotMap) {
    const $self = new DocType();
    DocType.make$($self,pod,attrs,ref,list,slotMap);
    return $self;
  }

  static make$($self,pod,attrs,ref,list,slotMap) {
    const this$ = $self;
    Doc.make$($self);
    $self.#pod = pod;
    $self.#ref = ref;
    $self.#loc = attrs.loc();
    $self.#flags = attrs.flags();
    $self.#facets = sys.ObjUtil.coerce(((this$) => { let $_u10 = attrs.facets(); if ($_u10 == null) return null; return sys.ObjUtil.toImmutable(attrs.facets()); })($self), sys.Type.find("compilerDoc::DocFacet[]"));
    $self.#doc = sys.ObjUtil.coerce(attrs.doc(), DocFandoc.type$);
    $self.#base = sys.ObjUtil.coerce(((this$) => { let $_u11 = attrs.base(); if ($_u11 == null) return null; return sys.ObjUtil.toImmutable(attrs.base()); })($self), sys.Type.find("compilerDoc::DocTypeRef[]"));
    $self.#mixins = sys.ObjUtil.coerce(((this$) => { let $_u12 = attrs.mixins(); if ($_u12 == null) return null; return sys.ObjUtil.toImmutable(attrs.mixins()); })($self), sys.Type.find("compilerDoc::DocTypeRef[]"));
    $self.#slotMap = sys.ObjUtil.coerce(((this$) => { let $_u13 = slotMap; if ($_u13 == null) return null; return sys.ObjUtil.toImmutable(slotMap); })($self), sys.Type.find("[sys::Str:compilerDoc::DocSlot]"));
    $self.#isErr = $self.#base.find((it) => {
      return sys.ObjUtil.equals(it.qname(), "sys::Err");
    }) != null;
    $self.#isNoDoc = $self.hasFacet("sys::NoDoc");
    (list = list.exclude((s) => {
      return (s.isNoDoc() || DocFlags.isInternal(s.flags()) || DocFlags.isPrivate(s.flags()) || DocFlags.isSynthetic(s.flags()));
    }));
    $self.#declared = sys.ObjUtil.coerce(((this$) => { let $_u14 = list; if ($_u14 == null) return null; return sys.ObjUtil.toImmutable(list); })($self), sys.Type.find("compilerDoc::DocSlot[]"));
    $self.#slots = sys.ObjUtil.coerce(((this$) => { let $_u15 = list.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    }); if ($_u15 == null) return null; return sys.ObjUtil.toImmutable(list.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    })); })($self), sys.Type.find("compilerDoc::DocSlot[]"));
    return;
  }

  name() {
    return this.#ref.name();
  }

  qname() {
    return this.#ref.qname();
  }

  space() {
    return this.#pod;
  }

  docName() {
    return this.name();
  }

  title() {
    return this.qname();
  }

  renderer() {
    return DocTypeRenderer.type$;
  }

  isCode() {
    return true;
  }

  facet(qname,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let f = this.#facets.find((f) => {
      return sys.ObjUtil.equals(f.type().qname(), qname);
    });
    if (f != null) {
      return f;
    }
    ;
    if (checked) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Missing facet @", qname), " on "), this.qname()));
    }
    ;
    return null;
  }

  hasFacet(qname) {
    const this$ = this;
    return this.#facets.any((f) => {
      return sys.ObjUtil.equals(f.type().qname(), qname);
    });
  }

  slot(name,checked) {
    if (checked === undefined) checked = true;
    let slot = this.#slotMap.get(name);
    if (slot != null) {
      return slot;
    }
    ;
    if (checked) {
      throw sys.UnknownSlotErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.qname()), "::"), name));
    }
    ;
    return null;
  }

  toStr() {
    return this.qname();
  }

  isEnum() {
    return DocFlags.isEnum(this.#flags);
  }

  isMixin() {
    return DocFlags.isMixin(this.#flags);
  }

  isFacet() {
    return DocFlags.isFacet(this.#flags);
  }

  onCrawl(crawler) {
    const this$ = this;
    let typeSummary = this.crawlTypeSummary();
    crawler.addKeyword(this.name(), this.qname(), typeSummary, null);
    crawler.addKeyword(this.qname(), this.qname(), typeSummary, null);
    crawler.addFandoc(this.#doc);
    this.#slots.each((slot) => {
      let slotSummary = this$.crawlSlotSummary(slot);
      let scopedName = sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.name()), "."), slot.name());
      crawler.addKeyword(slot.name(), slot.qname(), slotSummary, slot.name());
      crawler.addKeyword(slot.qname(), slot.qname(), slotSummary, slot.name());
      crawler.addKeyword(scopedName, slot.qname(), slotSummary, slot.name());
      crawler.addFandoc(slot.doc());
      return;
    });
    return;
  }

  crawlTypeSummary() {
    let s = this.#doc.firstSentenceStrBuf();
    return DocFandoc.make(this.#loc, s.toStr());
  }

  crawlSlotSummary(slot) {
    const this$ = this;
    let s = sys.StrBuf.make().add("> '");
    if (sys.ObjUtil.is(slot, DocField.type$)) {
      let f = sys.ObjUtil.coerce(slot, DocField.type$);
      s.add(f.type().dis()).add(" ").add(slot.name());
    }
    else {
      let m = sys.ObjUtil.coerce(slot, DocMethod.type$);
      s.add(m.returns().dis()).add(" ").add(slot.name());
      s.add("(");
      m.params().each((p,i) => {
        if (sys.ObjUtil.compareGT(i, 0)) {
          s.add(", ");
        }
        ;
        s.add(p.type().dis()).add(" ").add(p.name());
        return;
      });
      s.add(")");
    }
    ;
    s.add("'\n\n").add(this.#doc.firstSentenceStrBuf());
    return DocFandoc.make(this.#loc, s.toStr());
  }

}

class DocFacet extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocFacet.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #fields = null;

  fields() { return this.#fields; }

  __fields(it) { if (it === undefined) return this.#fields; else this.#fields = it; }

  static #noFields = undefined;

  static noFields() {
    if (DocFacet.#noFields === undefined) {
      DocFacet.static$init();
      if (DocFacet.#noFields === undefined) DocFacet.#noFields = null;
    }
    return DocFacet.#noFields;
  }

  static make(type,fields) {
    const $self = new DocFacet();
    DocFacet.make$($self,type,fields);
    return $self;
  }

  static make$($self,type,fields) {
    $self.#type = type;
    $self.#fields = sys.ObjUtil.coerce(((this$) => { let $_u16 = fields; if ($_u16 == null) return null; return sys.ObjUtil.toImmutable(fields); })($self), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

  toStr() {
    const this$ = this;
    let s = sys.StrBuf.make();
    s.add("@").add(this.#type);
    if (!this.#fields.isEmpty()) {
      s.add(" {");
      this.#fields.each((v,n) => {
        s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(" ", n), "="), v), ";"));
        return;
      });
      s.add(" }");
    }
    ;
    return s.toStr();
  }

  static static$init() {
    DocFacet.#noFields = sys.ObjUtil.coerce(((this$) => { let $_u17 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u17 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

}

class DocTypeRef extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocTypeRef.type$; }

  static fromStr(sig,checked) {
    if (checked === undefined) checked = true;
    try {
      return DocTypeRefParser.make(sig).parseTop();
    }
    catch ($_u18) {
      $_u18 = sys.Err.make($_u18);
      if ($_u18 instanceof sys.Err) {
        let e = $_u18;
        ;
        if (!checked) {
          return null;
        }
        ;
        if (sys.ObjUtil.is(e, sys.ParseErr.type$)) {
          throw e;
        }
        else {
          throw sys.ParseErr.make(sig, e);
        }
        ;
      }
      else {
        throw $_u18;
      }
    }
    ;
  }

  toStr() {
    return this.signature();
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

class BasicTypeRef extends DocTypeRef {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BasicTypeRef.type$; }

  #pod = null;

  pod() { return this.#pod; }

  __pod(it) { if (it === undefined) return this.#pod; else this.#pod = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #qname = null;

  qname() { return this.#qname; }

  __qname(it) { if (it === undefined) return this.#qname; else this.#qname = it; }

  static make(qname,colons) {
    const $self = new BasicTypeRef();
    BasicTypeRef.make$($self,qname,colons);
    return $self;
  }

  static make$($self,qname,colons) {
    DocTypeRef.make$($self);
    $self.#pod = sys.Str.getRange(qname, sys.Range.make(0, colons, true));
    $self.#name = sys.Str.getRange(qname, sys.Range.make(sys.Int.plus(colons, 2), -1));
    $self.#qname = qname;
    return;
  }

  signature() {
    return this.#qname;
  }

  dis() {
    return this.#name;
  }

  isNullable() {
    return false;
  }

  isParameterized() {
    return false;
  }

  isGenericVar() {
    return (sys.ObjUtil.equals(sys.Str.size(this.#name), 1) && sys.ObjUtil.equals(this.#pod, "sys"));
  }

  v() {
    return null;
  }

  k() {
    return null;
  }

  funcParams() {
    return null;
  }

  funcReturn() {
    return null;
  }

}

class NullableTypeRef extends DocTypeRef {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NullableTypeRef.type$; }

  #base = null;

  base() { return this.#base; }

  __base(it) { if (it === undefined) return this.#base; else this.#base = it; }

  static make(base) {
    const $self = new NullableTypeRef();
    NullableTypeRef.make$($self,base);
    return $self;
  }

  static make$($self,base) {
    DocTypeRef.make$($self);
    $self.#base = base;
    return;
  }

  pod() {
    return this.#base.pod();
  }

  name() {
    return this.#base.name();
  }

  qname() {
    return this.#base.qname();
  }

  signature() {
    return sys.Str.plus(sys.Str.plus("", this.#base), "?");
  }

  dis() {
    return sys.Str.plus(sys.Str.plus("", this.#base.dis()), "?");
  }

  isNullable() {
    return true;
  }

  isParameterized() {
    return this.#base.isParameterized();
  }

  isGenericVar() {
    return this.#base.isGenericVar();
  }

  v() {
    return this.#base.v();
  }

  k() {
    return this.#base.k();
  }

  funcParams() {
    return this.#base.funcParams();
  }

  funcReturn() {
    return this.#base.funcReturn();
  }

}

class ListTypeRef extends DocTypeRef {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ListTypeRef.type$; }

  #v = null;

  v() { return this.#v; }

  __v(it) { if (it === undefined) return this.#v; else this.#v = it; }

  static make(v) {
    const $self = new ListTypeRef();
    ListTypeRef.make$($self,v);
    return $self;
  }

  static make$($self,v) {
    DocTypeRef.make$($self);
    $self.#v = v;
    return;
  }

  pod() {
    return "sys";
  }

  name() {
    return "List";
  }

  qname() {
    return "sys::List";
  }

  signature() {
    return sys.Str.plus(sys.Str.plus("", this.#v), "[]");
  }

  dis() {
    return sys.Str.plus(sys.Str.plus("", this.#v.dis()), "[]");
  }

  isNullable() {
    return false;
  }

  isParameterized() {
    return true;
  }

  isGenericVar() {
    return false;
  }

  k() {
    return null;
  }

  funcParams() {
    return null;
  }

  funcReturn() {
    return null;
  }

}

class MapTypeRef extends DocTypeRef {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MapTypeRef.type$; }

  #k = null;

  k() { return this.#k; }

  __k(it) { if (it === undefined) return this.#k; else this.#k = it; }

  #v = null;

  v() { return this.#v; }

  __v(it) { if (it === undefined) return this.#v; else this.#v = it; }

  static make(k,v) {
    const $self = new MapTypeRef();
    MapTypeRef.make$($self,k,v);
    return $self;
  }

  static make$($self,k,v) {
    DocTypeRef.make$($self);
    $self.#k = k;
    $self.#v = v;
    return;
  }

  pod() {
    return "sys";
  }

  name() {
    return "Map";
  }

  qname() {
    return "sys::Map";
  }

  signature() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[", this.#k), ":"), this.#v), "]");
  }

  dis() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[", this.#k.dis()), ":"), this.#v.dis()), "]");
  }

  isNullable() {
    return false;
  }

  isParameterized() {
    return true;
  }

  isGenericVar() {
    return false;
  }

  funcParams() {
    return null;
  }

  funcReturn() {
    return null;
  }

}

class FuncTypeRef extends DocTypeRef {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FuncTypeRef.type$; }

  #funcParams = null;

  funcParams() { return this.#funcParams; }

  __funcParams(it) { if (it === undefined) return this.#funcParams; else this.#funcParams = it; }

  #funcReturn = null;

  funcReturn() { return this.#funcReturn; }

  __funcReturn(it) { if (it === undefined) return this.#funcReturn; else this.#funcReturn = it; }

  static make(p,r) {
    const $self = new FuncTypeRef();
    FuncTypeRef.make$($self,p,r);
    return $self;
  }

  static make$($self,p,r) {
    DocTypeRef.make$($self);
    $self.#funcParams = sys.ObjUtil.coerce(((this$) => { let $_u19 = p; if ($_u19 == null) return null; return sys.ObjUtil.toImmutable(p); })($self), sys.Type.find("compilerDoc::DocTypeRef[]?"));
    $self.#funcReturn = r;
    return;
  }

  pod() {
    return "sys";
  }

  name() {
    return "Func";
  }

  qname() {
    return "sys::Func";
  }

  signature() {
    const this$ = this;
    let s = sys.StrBuf.make();
    s.add("|");
    this.#funcParams.each((p,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        s.add(",");
      }
      ;
      s.add(p.signature());
      return;
    });
    s.add("->");
    s.add(this.#funcReturn);
    s.add("|");
    return s.toStr();
  }

  dis() {
    const this$ = this;
    let s = sys.StrBuf.make();
    s.add("|");
    this.#funcParams.each((p,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        s.add(",");
      }
      ;
      s.add(p.dis());
      return;
    });
    s.add("->");
    s.add(this.#funcReturn.dis());
    s.add("|");
    return s.toStr();
  }

  isNullable() {
    return false;
  }

  isParameterized() {
    return true;
  }

  isGenericVar() {
    return false;
  }

  v() {
    return null;
  }

  k() {
    return null;
  }

}

class DocTypeRefParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocTypeRefParser.type$; }

  #sig = null;

  // private field reflection only
  __sig(it) { if (it === undefined) return this.#sig; else this.#sig = it; }

  #len = 0;

  // private field reflection only
  __len(it) { if (it === undefined) return this.#len; else this.#len = it; }

  #pos = 0;

  // private field reflection only
  __pos(it) { if (it === undefined) return this.#pos; else this.#pos = it; }

  #cur = 0;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #peek = 0;

  // private field reflection only
  __peek(it) { if (it === undefined) return this.#peek; else this.#peek = it; }

  static make(sig) {
    const $self = new DocTypeRefParser();
    DocTypeRefParser.make$($self,sig);
    return $self;
  }

  static make$($self,sig) {
    $self.#sig = sig;
    $self.#len = sys.Str.size(sig);
    $self.#pos = 0;
    $self.#cur = sys.Str.get(sig, $self.#pos);
    $self.#peek = sys.Str.get(sig, sys.Int.plus($self.#pos, 1));
    return;
  }

  parseTop() {
    let t = this.parseAny();
    if (sys.ObjUtil.compareNE(this.#cur, 0)) {
      throw this.err();
    }
    ;
    return t;
  }

  parseAny() {
    let t = null;
    if (sys.ObjUtil.equals(this.#cur, 124)) {
      (t = this.parseFunc());
    }
    else {
      if (sys.ObjUtil.equals(this.#cur, 91)) {
        let ffi = true;
        for (let i = sys.Int.plus(this.#pos, 1); sys.ObjUtil.compareLT(i, this.#len); i = sys.Int.increment(i)) {
          let ch = sys.Str.get(this.#sig, i);
          if (DocTypeRefParser.isIdChar(ch)) {
            continue;
          }
          ;
          (ffi = sys.ObjUtil.equals(ch, 93));
          break;
        }
        ;
        if (ffi) {
          (t = this.parseBasic());
        }
        else {
          (t = this.parseMap());
        }
        ;
      }
      else {
        (t = this.parseBasic());
      }
      ;
    }
    ;
    while ((sys.ObjUtil.equals(this.#cur, 63) || sys.ObjUtil.equals(this.#cur, 91))) {
      if (sys.ObjUtil.equals(this.#cur, 63)) {
        this.consume(sys.ObjUtil.coerce(63, sys.Int.type$.toNullable()));
        (t = NullableTypeRef.make(sys.ObjUtil.coerce(t, DocTypeRef.type$)));
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 91)) {
        this.consume(sys.ObjUtil.coerce(91, sys.Int.type$.toNullable()));
        this.consume(sys.ObjUtil.coerce(93, sys.Int.type$.toNullable()));
        (t = ListTypeRef.make(sys.ObjUtil.coerce(t, DocTypeRef.type$)));
      }
      ;
    }
    ;
    return sys.ObjUtil.coerce(t, DocTypeRef.type$);
  }

  parseMap() {
    this.consume(sys.ObjUtil.coerce(91, sys.Int.type$.toNullable()));
    let key = this.parseAny();
    this.consume(sys.ObjUtil.coerce(58, sys.Int.type$.toNullable()));
    let val = this.parseAny();
    this.consume(sys.ObjUtil.coerce(93, sys.Int.type$.toNullable()));
    return MapTypeRef.make(key, val);
  }

  parseFunc() {
    this.consume(sys.ObjUtil.coerce(124, sys.Int.type$.toNullable()));
    let params = sys.List.make(DocTypeRef.type$);
    if (sys.ObjUtil.compareNE(this.#cur, 45)) {
      while (true) {
        params.add(this.parseAny());
        if (sys.ObjUtil.equals(this.#cur, 45)) {
          break;
        }
        ;
        this.consume(sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
      }
      ;
    }
    ;
    this.consume(sys.ObjUtil.coerce(45, sys.Int.type$.toNullable()));
    this.consume(sys.ObjUtil.coerce(62, sys.Int.type$.toNullable()));
    let ret = this.parseAny();
    this.consume(sys.ObjUtil.coerce(124, sys.Int.type$.toNullable()));
    return FuncTypeRef.make(params, ret);
  }

  parseBasic() {
    let start = this.#pos;
    while ((sys.ObjUtil.compareNE(this.#cur, 58) || sys.ObjUtil.compareNE(this.#peek, 58))) {
      this.consume();
    }
    ;
    let colons = sys.Int.minus(this.#pos, start);
    this.consume(sys.ObjUtil.coerce(58, sys.Int.type$.toNullable()));
    this.consume(sys.ObjUtil.coerce(58, sys.Int.type$.toNullable()));
    while (sys.ObjUtil.equals(this.#cur, 91)) {
      this.consume();
    }
    ;
    while (DocTypeRefParser.isIdChar(this.#cur)) {
      this.consume();
    }
    ;
    return BasicTypeRef.make(sys.Str.getRange(this.#sig, sys.Range.make(start, this.#pos, true)), colons);
  }

  consume(expected) {
    if (expected === undefined) expected = null;
    if (((expected != null && sys.ObjUtil.compareNE(this.#cur, expected)) || sys.ObjUtil.equals(this.#cur, 0))) {
      throw this.err();
    }
    ;
    this.#cur = this.#peek;
    ((this$) => { let $_u20 = this$.#pos;this$.#pos = sys.Int.increment(this$.#pos); return $_u20; })(this);
    this.#peek = ((this$) => { if (sys.ObjUtil.compareLT(sys.Int.plus(this$.#pos, 1), this$.#len)) return sys.Str.get(this$.#sig, sys.Int.plus(this$.#pos, 1)); return 0; })(this);
    return;
  }

  static isIdChar(ch) {
    return (sys.Int.isAlphaNum(ch) || sys.ObjUtil.equals(ch, 95));
  }

  err() {
    return sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid type signature '", this.#sig), "'"));
  }

}

class DocChapter extends Doc {
  constructor() {
    super();
    const this$ = this;
    this.#numRef = concurrent.AtomicInt.make();
    this.#summaryRef = concurrent.AtomicRef.make("");
    this.#prevRef = concurrent.AtomicRef.make(null);
    this.#nextRef = concurrent.AtomicRef.make(null);
    return;
  }

  typeof() { return DocChapter.type$; }

  #pod = null;

  pod() { return this.#pod; }

  __pod(it) { if (it === undefined) return this.#pod; else this.#pod = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #qname = null;

  qname() { return this.#qname; }

  __qname(it) { if (it === undefined) return this.#qname; else this.#qname = it; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #doc = null;

  doc() { return this.#doc; }

  __doc(it) { if (it === undefined) return this.#doc; else this.#doc = it; }

  #headings = null;

  headings() { return this.#headings; }

  __headings(it) { if (it === undefined) return this.#headings; else this.#headings = it; }

  #numRef = null;

  numRef() { return this.#numRef; }

  __numRef(it) { if (it === undefined) return this.#numRef; else this.#numRef = it; }

  #summaryRef = null;

  summaryRef() { return this.#summaryRef; }

  __summaryRef(it) { if (it === undefined) return this.#summaryRef; else this.#summaryRef = it; }

  #prevRef = null;

  prevRef() { return this.#prevRef; }

  __prevRef(it) { if (it === undefined) return this.#prevRef; else this.#prevRef = it; }

  #nextRef = null;

  nextRef() { return this.#nextRef; }

  __nextRef(it) { if (it === undefined) return this.#nextRef; else this.#nextRef = it; }

  #headingMap = null;

  // private field reflection only
  __headingMap(it) { if (it === undefined) return this.#headingMap; else this.#headingMap = it; }

  static make(loader,f) {
    const $self = new DocChapter();
    DocChapter.make$($self,loader,f);
    return $self;
  }

  static make$($self,loader,f) {
    Doc.make$($self);
    ;
    $self.#pod = loader.pod();
    $self.#name = ((this$) => { if (sys.ObjUtil.equals(f.name(), "pod.fandoc")) return "pod-doc"; return f.basename(); })($self);
    $self.#loc = DocLoc.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", $self.#pod), "::"), f.name()), 1);
    $self.#doc = DocFandoc.make($self.#loc, f.in().readAllStr());
    $self.#qname = sys.Str.plus(sys.Str.plus(sys.Str.plus("", $self.#pod.name()), "::"), $self.#name);
    let headingTop = sys.List.make(DocHeading.type$);
    let headingMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("compilerDoc::DocHeading"));
    let meta = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    try {
      let parser = fandoc.FandocParser.make();
      parser.silent(true);
      let fandocDoc = parser.parse(f.name(), sys.Str.in($self.#doc.text()));
      (meta = fandocDoc.meta());
      let fandocHeadings = fandocDoc.findHeadings();
      $self.buildHeadingsTree(loader, fandocHeadings, headingTop, headingMap);
    }
    catch ($_u23) {
      $_u23 = sys.Err.make($_u23);
      if ($_u23 instanceof sys.Err) {
        let e = $_u23;
        ;
        loader.err("Cannot parse fandoc chapter", $self.#loc, e);
      }
      else {
        throw $_u23;
      }
    }
    ;
    $self.#headings = sys.ObjUtil.coerce(((this$) => { let $_u24 = headingTop; if ($_u24 == null) return null; return sys.ObjUtil.toImmutable(headingTop); })($self), sys.Type.find("compilerDoc::DocHeading[]"));
    $self.#headingMap = sys.ObjUtil.coerce(((this$) => { let $_u25 = headingMap; if ($_u25 == null) return null; return sys.ObjUtil.toImmutable(headingMap); })($self), sys.Type.find("[sys::Str:compilerDoc::DocHeading]"));
    $self.#meta = sys.ObjUtil.coerce(((this$) => { let $_u26 = meta; if ($_u26 == null) return null; return sys.ObjUtil.toImmutable(meta); })($self), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

  buildHeadingsTree(loader,$fandoc,top,map) {
    const this$ = this;
    if ($fandoc.isEmpty()) {
      return;
    }
    ;
    let headings = sys.List.make(DocHeading.type$);
    let children = sys.Map.__fromLiteral([], [], sys.Type.find("compilerDoc::DocHeading"), sys.Type.find("compilerDoc::DocHeading[]"));
    $fandoc.each((d) => {
      let id = d.anchorId();
      let h = DocHeading.make((it) => {
        it.__level(d.level());
        it.__title(d.title());
        it.__anchorId(id);
        return;
      });
      if (id == null) {
        loader.err(sys.Str.plus("Heading missing anchor id: ", h.title()), this$.#loc);
      }
      else {
        if (map.get(sys.ObjUtil.coerce(id, sys.Str.type$)) != null) {
          loader.err(sys.Str.plus("Heading duplicate anchor id: ", id), this$.#loc);
        }
        else {
          map.set(sys.ObjUtil.coerce(id, sys.Str.type$), h);
        }
        ;
      }
      ;
      headings.add(h);
      children.set(h, sys.List.make(DocHeading.type$));
      return;
    });
    let stack = sys.List.make(DocHeading.type$);
    headings.each((h) => {
      while ((stack.peek() != null && sys.ObjUtil.compareGE(stack.peek().level(), h.level()))) {
        stack.pop();
      }
      ;
      if (stack.isEmpty()) {
        if ((sys.ObjUtil.compareNE(h.level(), 2) && sys.ObjUtil.compareNE(this$.#pod.name(), "fandoc"))) {
          loader.err(sys.Str.plus("Expected top-level heading to be level 2: ", h.title()), this$.#loc);
        }
        ;
        top.add(h);
      }
      else {
        if (sys.ObjUtil.compareNE(sys.Int.plus(stack.peek().level(), 1), h.level())) {
          loader.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expected heading to be level ", sys.ObjUtil.coerce(sys.Int.plus(stack.peek().level(), 1), sys.Obj.type$.toNullable())), ": "), h.title()), this$.#loc);
        }
        ;
        children.get(sys.ObjUtil.coerce(stack.peek(), DocHeading.type$)).add(h);
      }
      ;
      stack.add(h);
      return;
    });
    children.each((kids,h) => {
      h.childrenRef().val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(kids), sys.Type.find("compilerDoc::DocHeading[]")));
      return;
    });
    return;
  }

  docName() {
    return this.#name;
  }

  space() {
    return this.#pod;
  }

  title() {
    return sys.ObjUtil.coerce(((this$) => { let $_u27 = this$.#meta.get("title"); if ($_u27 != null) return $_u27; return this$.#qname; })(this), sys.Str.type$);
  }

  breadcrumb() {
    return this.title();
  }

  renderer() {
    return DocChapterRenderer.type$;
  }

  isPodDoc() {
    return sys.ObjUtil.equals(this.#name, "pod-doc");
  }

  num() {
    return this.#numRef.val();
  }

  summary() {
    return sys.ObjUtil.coerce(this.#summaryRef.val(), sys.Str.type$);
  }

  prev() {
    return sys.ObjUtil.coerce(this.#prevRef.val(), DocChapter.type$.toNullable());
  }

  next() {
    return sys.ObjUtil.coerce(this.#nextRef.val(), DocChapter.type$.toNullable());
  }

  heading(id,checked) {
    if (checked === undefined) checked = true;
    let h = this.#headingMap.get(id);
    if (h != null) {
      return h;
    }
    ;
    return Doc.prototype.heading.call(this, id, checked);
  }

  toStr() {
    return this.#qname;
  }

  onCrawl(crawler) {
    let summary = DocFandoc.make(this.#loc, this.summary());
    crawler.addKeyword(this.#name, this.title(), summary, null);
    crawler.addKeyword(this.#qname, this.title(), summary, null);
    crawler.addFandoc(this.#doc);
    return;
  }

}

class DocHeading extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#childrenRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return DocHeading.type$; }

  #level = 0;

  level() { return this.#level; }

  __level(it) { if (it === undefined) return this.#level; else this.#level = it; }

  #title = null;

  title() { return this.#title; }

  __title(it) { if (it === undefined) return this.#title; else this.#title = it; }

  #anchorId = null;

  anchorId() { return this.#anchorId; }

  __anchorId(it) { if (it === undefined) return this.#anchorId; else this.#anchorId = it; }

  #childrenRef = null;

  childrenRef() { return this.#childrenRef; }

  __childrenRef(it) { if (it === undefined) return this.#childrenRef; else this.#childrenRef = it; }

  static make(f) {
    const $self = new DocHeading();
    DocHeading.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ;
    sys.Func.call(f, $self);
    return;
  }

  children() {
    return sys.ObjUtil.coerce(this.#childrenRef.val(), sys.Type.find("compilerDoc::DocHeading[]"));
  }

}

class DocTopIndex extends Doc {
  constructor() {
    super();
    const this$ = this;
    this.#spaces = sys.ObjUtil.coerce(((this$) => { let $_u28 = sys.List.make(DocSpace.type$); if ($_u28 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(DocSpace.type$)); })(this), sys.Type.find("compilerDoc::DocSpace[]"));
    this.#title = "Doc Index";
    this.#renderer = DocTopIndexRenderer.type$;
    return;
  }

  typeof() { return DocTopIndex.type$; }

  #spaces = null;

  spaces() { return this.#spaces; }

  __spaces(it) { if (it === undefined) return this.#spaces; else this.#spaces = it; }

  #title = null;

  title() { return this.#title; }

  __title(it) { if (it === undefined) return this.#title; else this.#title = it; }

  #renderer = null;

  renderer() { return this.#renderer; }

  __renderer(it) { if (it === undefined) return this.#renderer; else this.#renderer = it; }

  static make(f) {
    const $self = new DocTopIndex();
    DocTopIndex.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    Doc.make$($self);
    ;
    if (f != null) {
      sys.Func.call(f, $self);
    }
    ;
    return;
  }

  pods() {
    return sys.ObjUtil.coerce(this.#spaces.findType(DocPod.type$), sys.Type.find("compilerDoc::DocPod[]"));
  }

  space() {
    throw sys.UnsupportedErr.make();
  }

  docName() {
    return "index";
  }

  isTopIndex() {
    return true;
  }

  toStr() {
    return sys.ObjUtil.typeof(this).name();
  }

}

class DocRes extends Doc {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocRes.type$; }

  #pod = null;

  pod() { return this.#pod; }

  __pod(it) { if (it === undefined) return this.#pod; else this.#pod = it; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  static make(pod,uri) {
    const $self = new DocRes();
    DocRes.make$($self,pod,uri);
    return $self;
  }

  static make$($self,pod,uri) {
    Doc.make$($self);
    $self.#pod = pod;
    $self.#uri = uri;
    return;
  }

  space() {
    return this.#pod;
  }

  docName() {
    return this.#uri.name();
  }

  title() {
    return this.#uri.name();
  }

  renderer() {
    throw sys.UnsupportedErr.make();
  }

}

class DocSrc extends Doc {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocSrc.type$; }

  #pod = null;

  pod() { return this.#pod; }

  __pod(it) { if (it === undefined) return this.#pod; else this.#pod = it; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  static make(pod,uri) {
    const $self = new DocSrc();
    DocSrc.make$($self,pod,uri);
    return $self;
  }

  static make$($self,pod,uri) {
    Doc.make$($self);
    $self.#pod = pod;
    $self.#uri = uri;
    return;
  }

  space() {
    return this.#pod;
  }

  docName() {
    return sys.Str.plus("src-", this.#uri.name());
  }

  title() {
    return this.#uri.name();
  }

  breadcrumb() {
    return this.#uri.name();
  }

  renderer() {
    return DocSrcRenderer.type$;
  }

}

class DocLoc extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocLoc.type$; }

  static #unknown = undefined;

  static unknown() {
    if (DocLoc.#unknown === undefined) {
      DocLoc.static$init();
      if (DocLoc.#unknown === undefined) DocLoc.#unknown = null;
    }
    return DocLoc.#unknown;
  }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #line = 0;

  line() { return this.#line; }

  __line(it) { if (it === undefined) return this.#line; else this.#line = it; }

  static make(file,line) {
    const $self = new DocLoc();
    DocLoc.make$($self,file,line);
    return $self;
  }

  static make$($self,file,line) {
    $self.#file = file;
    $self.#line = line;
    return;
  }

  toStr() {
    if (sys.ObjUtil.compareLE(this.#line, 0)) {
      return this.#file;
    }
    ;
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#file), " [Line "), sys.ObjUtil.coerce(this.#line, sys.Obj.type$.toNullable())), "]");
  }

  static static$init() {
    DocLoc.#unknown = DocLoc.make("Unknown", 0);
    return;
  }

}

class DocFandoc extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocFandoc.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #text = null;

  text() { return this.#text; }

  __text(it) { if (it === undefined) return this.#text; else this.#text = it; }

  static make(loc,text) {
    const $self = new DocFandoc();
    DocFandoc.make$($self,loc,text);
    return $self;
  }

  static make$($self,loc,text) {
    $self.#loc = loc;
    $self.#text = text;
    return;
  }

  firstSentence() {
    return DocFandoc.make(this.#loc, this.firstSentenceStrBuf().toStr());
  }

  firstSentenceStrBuf() {
    let buf = sys.StrBuf.make();
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(this.#text)); ((this$) => { let $_u29 = i;i = sys.Int.increment(i); return $_u29; })(this)) {
      let ch = sys.Str.get(this.#text, i);
      let peek = ((this$) => { if (sys.ObjUtil.compareLT(i, sys.Int.minus(sys.Str.size(this$.#text), 1))) return sys.Str.get(this$.#text, sys.Int.plus(i, 1)); return -1; })(this);
      if ((sys.ObjUtil.equals(ch, 46) && (sys.ObjUtil.equals(peek, 32) || sys.ObjUtil.equals(peek, 10)))) {
        buf.addChar(ch);
        break;
      }
      else {
        if (sys.ObjUtil.equals(ch, 10)) {
          if ((sys.ObjUtil.equals(peek, -1) || sys.ObjUtil.equals(peek, 32) || sys.ObjUtil.equals(peek, 10))) {
            break;
          }
          else {
            buf.addChar(32);
          }
          ;
        }
        else {
          buf.addChar(ch);
        }
        ;
      }
      ;
    }
    ;
    if ((sys.ObjUtil.compareGT(buf.size(), 1) && sys.ObjUtil.equals(buf.get(-1), 58))) {
      buf.remove(-1);
    }
    ;
    return buf;
  }

}

class DocSpace extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocSpace.type$; }

  breadcrumb() {
    return this.spaceName();
  }

  toStr() {
    return this.spaceName();
  }

  static make() {
    const $self = new DocSpace();
    DocSpace.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DocPod extends DocSpace {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocPod.type$; }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #version = null;

  version() { return this.#version; }

  __version(it) { if (it === undefined) return this.#version; else this.#version = it; }

  #summary = null;

  summary() { return this.#summary; }

  __summary(it) { if (it === undefined) return this.#summary; else this.#summary = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #index = null;

  index() { return this.#index; }

  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  #types = null;

  types() { return this.#types; }

  __types(it) { if (it === undefined) return this.#types; else this.#types = it; }

  #typeMap = null;

  // private field reflection only
  __typeMap(it) { if (it === undefined) return this.#typeMap; else this.#typeMap = it; }

  #podDoc = null;

  podDoc() { return this.#podDoc; }

  __podDoc(it) { if (it === undefined) return this.#podDoc; else this.#podDoc = it; }

  #chapters = null;

  chapters() { return this.#chapters; }

  __chapters(it) { if (it === undefined) return this.#chapters; else this.#chapters = it; }

  #chapterMap = null;

  // private field reflection only
  __chapterMap(it) { if (it === undefined) return this.#chapterMap; else this.#chapterMap = it; }

  #resList = null;

  resList() { return this.#resList; }

  __resList(it) { if (it === undefined) return this.#resList; else this.#resList = it; }

  #resMap = null;

  // private field reflection only
  __resMap(it) { if (it === undefined) return this.#resMap; else this.#resMap = it; }

  #srcList = null;

  srcList() { return this.#srcList; }

  __srcList(it) { if (it === undefined) return this.#srcList; else this.#srcList = it; }

  #srcMap = null;

  // private field reflection only
  __srcMap(it) { if (it === undefined) return this.#srcMap; else this.#srcMap = it; }

  static load(env,file) {
    const this$ = this;
    return DocPod.loadFile(file, (err) => {
      if (env == null) {
        sys.ObjUtil.echo(sys.Str.plus("ERROR: ", err));
      }
      else {
        env.errReport(err);
      }
      ;
      return;
    });
  }

  static loadFile(file,onErr) {
    return DocPod.make(file, onErr);
  }

  static make(file,onErr) {
    const $self = new DocPod();
    DocPod.make$($self,file,onErr);
    return $self;
  }

  static make$($self,file,onErr) {
    DocSpace.make$($self);
    $self.#file = file;
    let loader = DocPodLoader.make(file, $self, onErr);
    let zip = sys.Zip.open(file);
    try {
      loader.loadMeta(zip);
      $self.#name = sys.ObjUtil.coerce(loader.name(), sys.Str.type$);
      $self.#version = sys.ObjUtil.coerce(loader.version(), sys.Version.type$);
      $self.#summary = sys.ObjUtil.coerce(loader.summary(), sys.Str.type$);
      $self.#meta = sys.ObjUtil.coerce(((this$) => { let $_u31 = sys.ObjUtil.coerce(loader.meta(), sys.Type.find("[sys::Str:sys::Str]")); if ($_u31 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(loader.meta(), sys.Type.find("[sys::Str:sys::Str]"))); })($self), sys.Type.find("[sys::Str:sys::Str]"));
      loader.loadContent(zip);
      $self.#index = sys.ObjUtil.coerce(loader.index(), DocPodIndex.type$);
      $self.#types = sys.ObjUtil.coerce(((this$) => { let $_u32 = sys.ObjUtil.coerce(loader.typeList(), sys.Type.find("compilerDoc::DocType[]")); if ($_u32 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(loader.typeList(), sys.Type.find("compilerDoc::DocType[]"))); })($self), sys.Type.find("compilerDoc::DocType[]"));
      $self.#typeMap = sys.ObjUtil.coerce(((this$) => { let $_u33 = sys.ObjUtil.coerce(loader.typeMap(), sys.Type.find("[sys::Str:compilerDoc::DocType]")); if ($_u33 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(loader.typeMap(), sys.Type.find("[sys::Str:compilerDoc::DocType]"))); })($self), sys.Type.find("[sys::Str:compilerDoc::DocType]"));
      $self.#podDoc = loader.podDoc();
      $self.#chapters = sys.ObjUtil.coerce(((this$) => { let $_u34 = sys.ObjUtil.coerce(loader.chapterList(), sys.Type.find("compilerDoc::DocChapter[]")); if ($_u34 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(loader.chapterList(), sys.Type.find("compilerDoc::DocChapter[]"))); })($self), sys.Type.find("compilerDoc::DocChapter[]"));
      $self.#chapterMap = sys.ObjUtil.coerce(((this$) => { let $_u35 = sys.ObjUtil.coerce(loader.chapterMap(), sys.Type.find("[sys::Str:compilerDoc::DocChapter]")); if ($_u35 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(loader.chapterMap(), sys.Type.find("[sys::Str:compilerDoc::DocChapter]"))); })($self), sys.Type.find("[sys::Str:compilerDoc::DocChapter]"));
      $self.#resList = sys.ObjUtil.coerce(((this$) => { let $_u36 = sys.ObjUtil.coerce(loader.resList(), sys.Type.find("compilerDoc::DocRes[]")); if ($_u36 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(loader.resList(), sys.Type.find("compilerDoc::DocRes[]"))); })($self), sys.Type.find("compilerDoc::DocRes[]"));
      $self.#resMap = sys.ObjUtil.coerce(((this$) => { let $_u37 = sys.ObjUtil.coerce(loader.resMap(), sys.Type.find("[sys::Str:compilerDoc::DocRes]")); if ($_u37 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(loader.resMap(), sys.Type.find("[sys::Str:compilerDoc::DocRes]"))); })($self), sys.Type.find("[sys::Str:compilerDoc::DocRes]"));
      $self.#srcList = sys.ObjUtil.coerce(((this$) => { let $_u38 = sys.ObjUtil.coerce(loader.srcList(), sys.Type.find("compilerDoc::DocSrc[]")); if ($_u38 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(loader.srcList(), sys.Type.find("compilerDoc::DocSrc[]"))); })($self), sys.Type.find("compilerDoc::DocSrc[]"));
      $self.#srcMap = sys.ObjUtil.coerce(((this$) => { let $_u39 = sys.ObjUtil.coerce(loader.srcMap(), sys.Type.find("[sys::Str:compilerDoc::DocSrc]")); if ($_u39 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(loader.srcMap(), sys.Type.find("[sys::Str:compilerDoc::DocSrc]"))); })($self), sys.Type.find("[sys::Str:compilerDoc::DocSrc]"));
    }
    finally {
      zip.close();
    }
    ;
    return;
  }

  toStr() {
    return this.#name;
  }

  allTypes() {
    return this.#typeMap.vals();
  }

  ts() {
    return sys.DateTime.fromStr(sys.ObjUtil.coerce(((this$) => { let $_u40 = ((this$) => { let $_u41 = this$.#meta.get("build.ts"); if ($_u41 != null) return $_u41; return this$.#meta.get("build.time"); })(this$); if ($_u40 != null) return $_u40; return ""; })(this), sys.Str.type$), false);
  }

  type(typeName,checked) {
    if (checked === undefined) checked = true;
    let t = this.#typeMap.get(typeName);
    if (t != null) {
      return t;
    }
    ;
    if (checked) {
      throw sys.UnknownTypeErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#name), "::"), typeName));
    }
    ;
    return null;
  }

  isManual() {
    return (this.#types.isEmpty() && sys.ObjUtil.compareGE(this.#chapters.size(), 2));
  }

  chapter(chapterName,checked) {
    if (checked === undefined) checked = true;
    let c = this.#chapterMap.get(chapterName);
    if (c != null) {
      return c;
    }
    ;
    if (checked) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unknown chapter: ", this.#name), "::"), chapterName));
    }
    ;
    return null;
  }

  res(filename,checked) {
    if (checked === undefined) checked = true;
    let uri = this.#resMap.get(filename);
    if (uri != null) {
      return uri;
    }
    ;
    if (checked) {
      throw UnknownDocErr.make(sys.Str.plus("resource file: ", filename));
    }
    ;
    return null;
  }

  src(filename,checked) {
    if (checked === undefined) checked = true;
    let uri = this.#srcMap.get(filename);
    if (uri != null) {
      return uri;
    }
    ;
    if (checked) {
      throw UnknownDocErr.make(sys.Str.plus("source file: ", filename));
    }
    ;
    return null;
  }

  spaceName() {
    return this.#name;
  }

  doc(name,checked) {
    if (checked === undefined) checked = true;
    if (sys.ObjUtil.equals(name, "index")) {
      return this.#index;
    }
    ;
    let type = this.type(name, false);
    if (type != null) {
      return type;
    }
    ;
    let chapter = this.chapter(name, false);
    if (chapter != null) {
      return chapter;
    }
    ;
    if (sys.Str.startsWith(name, "src-")) {
      let src = this.src(sys.Str.getRange(name, sys.Range.make(4, -1)), false);
      if (src != null) {
        return src;
      }
      ;
    }
    ;
    let res = this.res(name, false);
    if (res != null) {
      return res;
    }
    ;
    if (checked) {
      throw UnknownDocErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#name), "::"), name));
    }
    ;
    return null;
  }

  eachDoc(f) {
    sys.Func.call(f, this.#index);
    this.#types.each(f);
    this.#chapters.each(f);
    this.#srcList.each(f);
    this.#resList.each(f);
    return;
  }

}

class DocPodIndex extends Doc {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocPodIndex.type$; }

  #pod = null;

  pod() { return this.#pod; }

  __pod(it) { if (it === undefined) return this.#pod; else this.#pod = it; }

  #toc = null;

  toc() { return this.#toc; }

  __toc(it) { if (it === undefined) return this.#toc; else this.#toc = it; }

  static make(pod,toc) {
    const $self = new DocPodIndex();
    DocPodIndex.make$($self,pod,toc);
    return $self;
  }

  static make$($self,pod,toc) {
    Doc.make$($self);
    $self.#pod = pod;
    $self.#toc = sys.ObjUtil.coerce(((this$) => { let $_u42 = toc; if ($_u42 == null) return null; return sys.ObjUtil.toImmutable(toc); })($self), sys.Type.find("sys::Obj[]"));
    return;
  }

  space() {
    return this.#pod;
  }

  docName() {
    return "index";
  }

  title() {
    return this.#pod.name();
  }

  isSpaceIndex() {
    return true;
  }

  renderer() {
    return DocPodIndexRenderer.type$;
  }

  onCrawl(crawler) {
    crawler.addKeyword(this.#pod.name(), this.#pod.name(), DocFandoc.make(DocLoc.make(this.#pod.name(), 0), this.#pod.summary()), null);
    return;
  }

}

class DocPodLoader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocPodLoader.type$; }

  #file = null;

  file(it) {
    if (it === undefined) {
      return this.#file;
    }
    else {
      this.#file = it;
      return;
    }
  }

  #pod = null;

  pod(it) {
    if (it === undefined) {
      return this.#pod;
    }
    else {
      this.#pod = it;
      return;
    }
  }

  #onErr = null;

  onErr(it) {
    if (it === undefined) {
      return this.#onErr;
    }
    else {
      this.#onErr = it;
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

  #summary = null;

  summary(it) {
    if (it === undefined) {
      return this.#summary;
    }
    else {
      this.#summary = it;
      return;
    }
  }

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

  #typeList = null;

  typeList(it) {
    if (it === undefined) {
      return this.#typeList;
    }
    else {
      this.#typeList = it;
      return;
    }
  }

  #typeMap = null;

  typeMap(it) {
    if (it === undefined) {
      return this.#typeMap;
    }
    else {
      this.#typeMap = it;
      return;
    }
  }

  #chapterList = null;

  chapterList(it) {
    if (it === undefined) {
      return this.#chapterList;
    }
    else {
      this.#chapterList = it;
      return;
    }
  }

  #chapterMap = null;

  chapterMap(it) {
    if (it === undefined) {
      return this.#chapterMap;
    }
    else {
      this.#chapterMap = it;
      return;
    }
  }

  #podDoc = null;

  podDoc(it) {
    if (it === undefined) {
      return this.#podDoc;
    }
    else {
      this.#podDoc = it;
      return;
    }
  }

  #resList = null;

  resList(it) {
    if (it === undefined) {
      return this.#resList;
    }
    else {
      this.#resList = it;
      return;
    }
  }

  #resMap = null;

  resMap(it) {
    if (it === undefined) {
      return this.#resMap;
    }
    else {
      this.#resMap = it;
      return;
    }
  }

  #srcList = null;

  srcList(it) {
    if (it === undefined) {
      return this.#srcList;
    }
    else {
      this.#srcList = it;
      return;
    }
  }

  #srcMap = null;

  srcMap(it) {
    if (it === undefined) {
      return this.#srcMap;
    }
    else {
      this.#srcMap = it;
      return;
    }
  }

  #toc = null;

  toc(it) {
    if (it === undefined) {
      return this.#toc;
    }
    else {
      this.#toc = it;
      return;
    }
  }

  #index = null;

  index(it) {
    if (it === undefined) {
      return this.#index;
    }
    else {
      this.#index = it;
      return;
    }
  }

  static make(file,pod,onErr) {
    const $self = new DocPodLoader();
    DocPodLoader.make$($self,file,pod,onErr);
    return $self;
  }

  static make$($self,file,pod,onErr) {
    $self.#file = file;
    $self.#pod = pod;
    $self.#onErr = onErr;
    return;
  }

  loadMeta(zip) {
    let metaFile = ((this$) => { let $_u43 = zip.contents().get(sys.Uri.fromStr("/meta.props")); if ($_u43 != null) return $_u43; throw sys.Err.make(sys.Str.plus("Pod missing meta.props: ", this$.#file)); })(this);
    this.#meta = metaFile.readProps();
    this.#name = this.getMeta("pod.name");
    this.#summary = this.getMeta("pod.summary");
    this.#version = sys.Version.fromStr(this.getMeta("pod.version"));
    return;
  }

  getMeta(n) {
    return sys.ObjUtil.coerce(((this$) => { let $_u44 = this$.#meta.get(n); if ($_u44 != null) return $_u44; throw sys.Err.make(sys.Str.plus(sys.Str.plus("Missing '", n), "' in meta.props")); })(this), sys.Str.type$);
  }

  loadContent(zip) {
    const this$ = this;
    let types = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("compilerDoc::DocType"));
    let chapters = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("compilerDoc::DocChapter"));
    let indexFog = null;
    let resources = sys.List.make(sys.Uri.type$);
    let sources = sys.List.make(sys.Uri.type$);
    zip.contents().each((f) => {
      try {
        if (sys.ObjUtil.equals(f.path().get(0), "src")) {
          if (sys.ObjUtil.equals(f.path().size(), 2)) {
            sources.add(f.uri());
          }
          ;
          return;
        }
        ;
        if (sys.ObjUtil.compareNE(f.path().get(0), "doc")) {
          return;
        }
        ;
        if (sys.ObjUtil.equals(f.ext(), "apidoc")) {
          let type = ApiDocParser.make(this$.#pod, f.in()).parseType();
          types.set(type.name(), type);
          return;
        }
        ;
        if (sys.ObjUtil.equals(f.ext(), "fandoc")) {
          let chapter = DocChapter.make(this$, f);
          chapters.set(chapter.name(), chapter);
          return;
        }
        ;
        if (sys.ObjUtil.equals(f.name(), "index.fog")) {
          (indexFog = f.readObj());
          return;
        }
        ;
        resources.add(f.uri());
      }
      catch ($_u45) {
        $_u45 = sys.Err.make($_u45);
        if ($_u45 instanceof sys.Err) {
          let e = $_u45;
          ;
          this$.err("Cannot parse", DocLoc.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.#name), "::"), f), 0), e);
        }
        else {
          throw $_u45;
        }
      }
      ;
      return;
    });
    this.finishTypes(types);
    this.finishChapters(chapters, sys.ObjUtil.coerce(indexFog, sys.Type.find("sys::Obj[]?")));
    this.finishResources(resources);
    this.finishSources(sources);
    this.finishIndex();
    return;
  }

  finishTypes(map) {
    const this$ = this;
    let list = map.vals().sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    (list = list.exclude((t) => {
      return (t.isNoDoc() || DocFlags.isInternal(t.flags()) || DocFlags.isSynthetic(t.flags()));
    }));
    let toc = sys.List.make(sys.Obj.type$);
    let mixins = sys.List.make(DocType.type$);
    let classes = sys.List.make(DocType.type$);
    let enums = sys.List.make(DocType.type$);
    let facets = sys.List.make(DocType.type$);
    let errs = sys.List.make(DocType.type$);
    list.each((t) => {
      if (t.isEnum()) {
        enums.add(t);
      }
      else {
        if (t.isFacet()) {
          facets.add(t);
        }
        else {
          if (t.isMixin()) {
            mixins.add(t);
          }
          else {
            if (t.isErr()) {
              errs.add(t);
            }
            else {
              classes.add(t);
            }
            ;
          }
          ;
        }
        ;
      }
      ;
      return;
    });
    if (sys.ObjUtil.compareGT(mixins.size(), 0)) {
      toc.add("Mixins").addAll(mixins);
    }
    ;
    if (sys.ObjUtil.compareGT(classes.size(), 0)) {
      toc.add("Classes").addAll(classes);
    }
    ;
    if (sys.ObjUtil.compareGT(enums.size(), 0)) {
      toc.add("Enums").addAll(enums);
    }
    ;
    if (sys.ObjUtil.compareGT(facets.size(), 0)) {
      toc.add("Facets").addAll(facets);
    }
    ;
    if (sys.ObjUtil.compareGT(errs.size(), 0)) {
      toc.add("Errs").addAll(errs);
    }
    ;
    this.#typeMap = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(map), sys.Type.find("[sys::Str:compilerDoc::DocType]"));
    this.#typeList = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(list), sys.Type.find("compilerDoc::DocType[]"));
    this.#toc = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(toc), sys.Type.find("sys::Obj[]"));
    return;
  }

  finishChapters(map,indexFog) {
    const this$ = this;
    let list = map.vals().sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    if ((!this.#typeList.isEmpty() || sys.ObjUtil.compareLE(list.size(), 1))) {
      this.#podDoc = list.find((x) => {
        return x.isPodDoc();
      });
      this.#chapterList = sys.ObjUtil.coerce(((this$) => { if (this$.#podDoc == null) return DocChapter.type$.emptyList(); return sys.List.make(DocChapter.type$, [sys.ObjUtil.coerce(this$.#podDoc, DocChapter.type$)]); })(this), sys.Type.find("compilerDoc::DocChapter[]?"));
      this.#chapterMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("compilerDoc::DocChapter")).setList(sys.ObjUtil.coerce(this.#chapterList, sys.Type.find("compilerDoc::DocChapter[]")), (x) => {
        return x.name();
      });
      return;
    }
    ;
    if (indexFog == null) {
      if (!map.isEmpty()) {
        this.err(sys.Str.plus(sys.Str.plus("Manual missing '", this.#name), "::index.fog'"), DocLoc.make(sys.ObjUtil.coerce(this.#name, sys.Str.type$), 0));
      }
      ;
      (indexFog = sys.List.make(sys.Obj.type$.toNullable()));
      list.each((c) => {
        indexFog.add(sys.List.make(sys.Obj.type$, [sys.Str.toUri(c.name()), ""]));
        return;
      });
    }
    ;
    let toc = sys.List.make(sys.Obj.type$);
    let indexLoc = DocLoc.make(sys.Str.plus(sys.Str.plus("", this.#name), "::index.fog"), 0);
    let indexMap = map.dup();
    indexFog.each((item) => {
      if (sys.ObjUtil.is(item, sys.Str.type$)) {
        toc.add(item);
        return;
      }
      ;
      let uri = null;
      let summary = null;
      try {
        (uri = sys.ObjUtil.coerce(sys.ObjUtil.coerce(item, sys.Type.find("sys::List")).get(0), sys.Uri.type$.toNullable()));
        (summary = sys.ObjUtil.coerce(sys.ObjUtil.coerce(item, sys.Type.find("sys::List")).get(1), sys.Str.type$.toNullable()));
      }
      catch ($_u47) {
        this$.err(sys.Str.plus("Invalid item: ", item), indexLoc);
        return;
      }
      ;
      let c = indexMap.remove(uri.toStr());
      if (c == null) {
        this$.err(sys.Str.plus("Unknown chapter: ", uri), indexLoc);
        return;
      }
      ;
      toc.add(sys.ObjUtil.coerce(c, sys.Obj.type$));
      c.summaryRef().val(summary);
      return;
    });
    indexMap.each((c) => {
      this$.err(sys.Str.plus("Chapter not in index: ", c.name()), indexLoc);
      return;
    });
    (list = sys.ObjUtil.coerce(toc.findType(DocChapter.type$), sys.Type.find("compilerDoc::DocChapter[]")));
    list.each((c,i) => {
      c.numRef().val(sys.Int.plus(i, 1));
      if (sys.ObjUtil.compareGT(i, 0)) {
        c.prevRef().val(list.get(sys.Int.minus(i, 1)));
      }
      ;
      c.nextRef().val(list.getSafe(sys.Int.plus(i, 1)));
      return;
    });
    this.#chapterMap = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(map), sys.Type.find("[sys::Str:compilerDoc::DocChapter]"));
    this.#chapterList = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(list), sys.Type.find("compilerDoc::DocChapter[]"));
    this.#toc = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(toc), sys.Type.find("sys::Obj[]"));
    return;
  }

  finishResources(uris) {
    const this$ = this;
    let list = sys.ObjUtil.coerce(uris.sort().map((uri) => {
      return DocRes.make(this$.#pod, uri);
    }, DocRes.type$), sys.Type.find("compilerDoc::DocRes[]"));
    this.#resList = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(list), sys.Type.find("compilerDoc::DocRes[]"));
    this.#resMap = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("compilerDoc::DocRes")).addList(list, (res) => {
      return res.uri().name();
    })), sys.Type.find("[sys::Str:compilerDoc::DocRes]"));
    return;
  }

  finishSources(uris) {
    const this$ = this;
    let list = sys.ObjUtil.coerce(uris.sort().map((uri) => {
      return DocSrc.make(this$.#pod, uri);
    }, DocSrc.type$), sys.Type.find("compilerDoc::DocSrc[]"));
    this.#srcList = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(list), sys.Type.find("compilerDoc::DocSrc[]"));
    this.#srcMap = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("compilerDoc::DocSrc")).addList(list, (src) => {
      return src.uri().name();
    })), sys.Type.find("[sys::Str:compilerDoc::DocSrc]"));
    return;
  }

  finishIndex() {
    this.#index = DocPodIndex.make(this.#pod, sys.ObjUtil.coerce(this.#toc, sys.Type.find("sys::Obj[]")));
    return;
  }

  err(msg,loc,cause) {
    if (cause === undefined) cause = null;
    sys.Func.call(this.#onErr, DocErr.make(msg, loc, cause));
    return;
  }

}

class DocRenderer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocRenderer.type$; }

  #envRef = null;

  // private field reflection only
  __envRef(it) { if (it === undefined) return this.#envRef; else this.#envRef = it; }

  #outRef = null;

  // private field reflection only
  __outRef(it) { if (it === undefined) return this.#outRef; else this.#outRef = it; }

  #docRef = null;

  // private field reflection only
  __docRef(it) { if (it === undefined) return this.#docRef; else this.#docRef = it; }

  static make(env,out,doc) {
    const $self = new DocRenderer();
    DocRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    $self.#envRef = env;
    $self.#outRef = out;
    $self.#docRef = doc;
    return;
  }

  env() {
    return this.#envRef;
  }

  out() {
    return this.#outRef;
  }

  doc() {
    return this.#docRef;
  }

  theme() {
    return this.env().theme();
  }

  writeDoc() {
    this.theme().writeStart(this);
    this.theme().writeBreadcrumb(this);
    this.writeContent();
    this.theme().writeEnd(this);
    return;
  }

  writeLink(link) {
    this.out().a(this.env().linkUri(link)).esc(link.dis()).aEnd();
    return;
  }

  writeLinkTo(target,dis,frag) {
    if (dis === undefined) dis = null;
    if (frag === undefined) frag = null;
    if (dis == null) {
      (dis = ((this$) => { if (sys.ObjUtil.is(target, DocChapter.type$)) return target.title(); return target.docName(); })(this));
    }
    ;
    this.writeLink(this.linkTo(target, dis, frag));
    return;
  }

  linkTo(target,dis,frag) {
    if (dis === undefined) dis = null;
    if (frag === undefined) frag = null;
    if (dis == null) {
      (dis = ((this$) => { if (sys.ObjUtil.is(target, DocChapter.type$)) return target.title(); return target.docName(); })(this));
    }
    ;
    return DocLink.make(this.doc(), target, sys.ObjUtil.coerce(dis, sys.Str.type$), frag);
  }

  writeFandoc(doc) {
    const this$ = this;
    let docLoc = doc.loc();
    let parser = fandoc.FandocParser.make();
    parser.silent(true);
    let root = parser.parse(docLoc.file(), sys.Str.in(doc.text()));
    if (parser.errs().isEmpty()) {
      let writer = this.env().initFandocHtmlWriter(this.out());
      writer.onLink((elem) => {
        this$.onFandocLink(elem, this$.toFandocElemLoc(docLoc, elem.line()));
        return;
      });
      writer.onImage((elem) => {
        this$.onFandocImage(elem, this$.toFandocElemLoc(docLoc, elem.line()));
        return;
      });
      root.children().each((child) => {
        child.write(writer);
        return;
      });
    }
    else {
      parser.errs().each((err) => {
        this$.env().err(err.msg(), this$.toFandocElemLoc(docLoc, err.line()));
        return;
      });
      this.out().pre().w(doc.text()).preEnd();
    }
    ;
    return;
  }

  toFandocElemLoc(docLoc,line) {
    return DocLoc.make(docLoc.file(), sys.Int.minus(sys.Int.plus(docLoc.line(), line), 1));
  }

  onFandocLink(elem,loc) {
    let orig = elem.uri();
    if ((sys.Str.startsWith(orig, "http:/") || sys.Str.startsWith(orig, "https:/") || sys.Str.startsWith(orig, "ftp:/"))) {
      return;
    }
    ;
    try {
      let link = this.resolveFandocLink(elem, true);
      elem.uri(this.env().linkUri(sys.ObjUtil.coerce(link, DocLink.type$)).encode());
      elem.isCode(link.target().isCode());
      this.env().linkCheck(sys.ObjUtil.coerce(link, DocLink.type$), loc);
      if ((sys.ObjUtil.is(elem.children().first(), fandoc.DocText.type$) && sys.ObjUtil.equals(sys.ObjUtil.toStr(elem.children().first()), orig))) {
        sys.ObjUtil.coerce(elem.removeAll(), fandoc.Link.type$).add(fandoc.DocText.make(link.dis()));
      }
      ;
    }
    catch ($_u50) {
      $_u50 = sys.Err.make($_u50);
      if ($_u50 instanceof sys.Err) {
        let e = $_u50;
        ;
        if (sys.Str.startsWith(elem.uri(), "examples::")) {
          elem.uri(sys.Str.plus("https://fantom.org/doc/", sys.Str.replace(elem.uri(), "::", "/")));
        }
        else {
          this.onFandocErr(e, loc);
        }
        ;
      }
      else {
        throw $_u50;
      }
    }
    ;
    return;
  }

  onFandocImage(elem,loc) {
    return;
  }

  resolveFandocLink(elem,checked) {
    if (checked === undefined) checked = true;
    return this.env().link(this.doc(), elem.uri(), true);
  }

  onFandocErr(e,loc) {
    this.env().err(e.toStr(), loc);
    return;
  }

}

class DocSrcRenderer extends DocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocSrcRenderer.type$; }

  #src = null;

  src() { return this.#src; }

  __src(it) { if (it === undefined) return this.#src; else this.#src = it; }

  static make(env,out,doc) {
    const $self = new DocSrcRenderer();
    DocSrcRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DocRenderer.make$($self, env, out, doc);
    $self.#src = doc;
    return;
  }

  writeContent() {
    let rules = ((this$) => { let $_u51 = syntax.SyntaxRules.loadForExt(sys.ObjUtil.coerce(((this$) => { let $_u52 = this$.#src.uri().ext(); if ($_u52 != null) return $_u52; return "?"; })(this$), sys.Str.type$)); if ($_u51 != null) return $_u51; return syntax.SyntaxRules.make(); })(this);
    let syntaxDoc = null;
    let zip = sys.Zip.open(this.#src.pod().file());
    try {
      (syntaxDoc = syntax.SyntaxDoc.parse(sys.ObjUtil.coerce(rules, syntax.SyntaxRules.type$), zip.contents().get(this.#src.uri()).in()));
    }
    finally {
      zip.close();
    }
    ;
    this.out().div("class='src'");
    syntax.HtmlSyntaxWriter.make(this.out()).writeLines(sys.ObjUtil.coerce(syntaxDoc, syntax.SyntaxDoc.type$));
    this.out().divEnd();
    return;
  }

}

class DocTypeRenderer extends DocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocTypeRenderer.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  static make(env,out,doc) {
    const $self = new DocTypeRenderer();
    DocTypeRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DocRenderer.make$($self, env, out, doc);
    $self.#type = doc;
    return;
  }

  writeContent() {
    this.out().div("class='mainSidebar'");
    this.out().div("class='main type'");
    this.writeTypeOverview();
    this.writeSlots();
    this.out().divEnd();
    this.out().div("class='sidebar'");
    this.writeToc();
    this.out().divEnd();
    this.out().divEnd();
    return;
  }

  writeTypeOverview() {
    const this$ = this;
    this.out().h1().span().w(DocFlags.toTypeDis(this.#type.flags())).spanEnd().w(sys.Str.plus(" ", this.#type.qname())).h1End();
    this.writeTypeInheritance();
    if (sys.ObjUtil.compareGT(this.#type.facets().size(), 0)) {
      this.out().p("class='facets'");
      this.#type.facets().each((f) => {
        this$.writeFacet(f);
        this$.out().br();
        return;
      });
      this.out().pEnd();
    }
    ;
    this.writeSrcLink(this.#type.doc().loc());
    this.writeFandoc(this.#type.doc());
    if (DocFlags.isEnum(this.#type.flags())) {
      this.out().ul();
      this.#type.declared().each((s) => {
        if (DocFlags.isEnum(s.flags())) {
          this$.out().li().a(sys.Str.toUri(sys.Str.plus("#", s.name()))).esc(s.name()).aEnd().liEnd();
        }
        ;
        return;
      });
      this.out().ulEnd();
    }
    ;
    return;
  }

  writeTypeInheritance() {
    const this$ = this;
    this.out().pre();
    let indent = 0;
    this.#type.base().eachr((ref) => {
      if (sys.ObjUtil.compareGT(indent, 0)) {
        this$.out().w(sys.Str.plus("\n", sys.Str.spaces(sys.Int.mult(indent, 2))));
      }
      ;
      this$.writeTypeRef(ref, true);
      ((this$) => { let $_u53 = indent;indent = sys.Int.increment(indent); return $_u53; })(this$);
      return;
    });
    if (sys.ObjUtil.compareGT(this.#type.base().size(), 0)) {
      this.out().w(sys.Str.plus("\n", sys.Str.spaces(sys.Int.mult(indent, 2))));
    }
    ;
    this.out().w(sys.Str.plus("", this.#type.qname()));
    this.#type.mixins().each((ref,i) => {
      this$.out().w(((this$) => { if (sys.ObjUtil.equals(i, 0)) return " : "; return ", "; })(this$));
      this$.writeTypeRef(ref, true);
      return;
    });
    this.out().preEnd();
    return;
  }

  writeSlots() {
    const this$ = this;
    this.out().dl();
    this.#type.slots().each((slot) => {
      this$.writeSlot(slot);
      return;
    });
    this.out().dlEnd();
    return;
  }

  writeSlot(slot) {
    this.out().dt(sys.Str.plus(sys.Str.plus("id='", slot.name()), "'")).w(sys.Str.plus("", slot.name())).dtEnd();
    this.out().dd();
    this.writeSlotSig(slot);
    this.writeSrcLink(slot.doc().loc());
    this.writeFandoc(slot.doc());
    this.out().ddEnd();
    return;
  }

  writeSlotSig(slot) {
    const this$ = this;
    this.out().p("class='sig'").code();
    slot.facets().each((f) => {
      this$.writeFacet(f);
      this$.out().br();
      return;
    });
    this.writeSlotSigText(slot);
    this.out().codeEnd().pEnd();
    return;
  }

  writeSlotSigText(slot) {
    const this$ = this;
    if (sys.ObjUtil.is(slot, DocField.type$)) {
      let field = sys.ObjUtil.coerce(slot, DocField.type$);
      this.out().w(DocFlags.toSlotDis(field.flags())).w(" ");
      this.writeTypeRef(field.type());
      this.out().w(" ").w(field.name());
      if (field.init() != null) {
        this.out().w(" := ").w(sys.Str.toXml(field.init()));
      }
      ;
      if (field.setterFlags() != null) {
        this.out().w(" { ").w(DocFlags.toSlotDis(sys.ObjUtil.coerce(field.setterFlags(), sys.Int.type$))).w(" set }");
      }
      ;
    }
    else {
      let method = sys.ObjUtil.coerce(slot, DocMethod.type$);
      if (DocFlags.isCtor(method.flags())) {
        if (DocFlags.isStatic(method.flags())) {
          this.out().w("static ");
        }
        ;
        this.out().w("new");
      }
      else {
        this.out().w(DocFlags.toSlotDis(method.flags())).w(" ");
        this.writeTypeRef(method.returns());
      }
      ;
      this.out().w(sys.Str.plus(sys.Str.plus(" ", method.name()), "("));
      method.params().each((param,i) => {
        if (sys.ObjUtil.compareGT(i, 0)) {
          this$.out().w(", ");
        }
        ;
        this$.writeTypeRef(param.type());
        this$.out().w(sys.Str.plus(" ", param.name()));
        if (param.def() != null) {
          this$.out().w(sys.Str.plus(" := ", sys.Str.toXml(param.def())));
        }
        ;
        return;
      });
      this.out().w(")");
    }
    ;
    return;
  }

  writeToc() {
    const this$ = this;
    this.out().h3().w("Source").h3End();
    this.out().ul().li();
    let srcLink = this.toSrcLink(this.#type.doc().loc(), "View Source");
    if (srcLink == null) {
      this.out().w("Not available");
    }
    else {
      this.writeLink(sys.ObjUtil.coerce(srcLink, DocLink.type$));
    }
    ;
    this.out().liEnd().ulEnd();
    this.out().h3().w("Slots").h3End();
    this.out().ul();
    this.#type.slots().each((slot) => {
      this$.out().li().a(sys.Str.toUri(sys.Str.plus("#", slot.name()))).w(slot.name()).aEnd().liEnd();
      return;
    });
    this.out().ulEnd();
    return;
  }

  writeTypeRef(ref,full) {
    if (full === undefined) full = false;
    const this$ = this;
    if (ref.isParameterized()) {
      if (sys.ObjUtil.equals(ref.qname(), "sys::List")) {
        this.writeTypeRef(sys.ObjUtil.coerce(ref.v(), DocTypeRef.type$));
        this.out().w("[]");
      }
      else {
        if (sys.ObjUtil.equals(ref.qname(), "sys::Map")) {
          if (ref.isNullable()) {
            this.out().w("[");
          }
          ;
          this.writeTypeRef(sys.ObjUtil.coerce(ref.k(), DocTypeRef.type$));
          this.out().w(":");
          this.writeTypeRef(sys.ObjUtil.coerce(ref.v(), DocTypeRef.type$));
          if (ref.isNullable()) {
            this.out().w("]");
          }
          ;
        }
        else {
          if (sys.ObjUtil.equals(ref.qname(), "sys::Func")) {
            let isVoid = sys.ObjUtil.equals(ref.funcReturn().qname(), "sys::Void");
            this.out().w("|");
            ref.funcParams().each((p,i) => {
              if (sys.ObjUtil.compareGT(i, 0)) {
                this$.out().w(",");
              }
              ;
              this$.writeTypeRef(p);
              return;
            });
            if ((!isVoid || ref.funcParams().isEmpty())) {
              this.out().w("->");
              this.writeTypeRef(sys.ObjUtil.coerce(ref.funcReturn(), DocTypeRef.type$));
            }
            ;
            this.out().w("|");
          }
          else {
            throw sys.Err.make(sys.Str.plus("Unsupported parameterized type: ", ref));
          }
          ;
        }
        ;
      }
      ;
      if (ref.isNullable()) {
        this.out().w("?");
      }
      ;
    }
    else {
      if (ref.isGenericVar()) {
        this.out().w(((this$) => { if (full) return ref.qname(); return ref.name(); })(this)).w(((this$) => { if (ref.isNullable()) return "?"; return ""; })(this));
      }
      else {
        let uri = sys.StrBuf.make();
        if (sys.ObjUtil.compareNE(ref.pod(), this.#type.pod().name())) {
          uri.add("../").add(ref.pod()).add("/");
        }
        ;
        uri.add(ref.name());
        let uriExt = this.env().linkUriExt();
        if (uriExt != null) {
          uri.add(uriExt);
        }
        ;
        this.out().a(sys.Str.toUri(uri.toStr())).w(((this$) => { if (full) return ref.qname(); return ref.name(); })(this)).w(((this$) => { if (ref.isNullable()) return "?"; return ""; })(this)).aEnd();
      }
      ;
    }
    ;
    return;
  }

  writeFacet(f) {
    this.out().code("class='sig'");
    this.writeFacetText(f);
    this.out().codeEnd();
    return;
  }

  writeFacetText(f) {
    const this$ = this;
    this.out().w("@");
    this.writeTypeRef(f.type());
    if (sys.ObjUtil.compareGT(f.fields().size(), 0)) {
      let s = f.fields().join("; ", (v,n) => {
        return sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.Str.toXml(n)), "="), sys.Str.toXml(v));
      });
      this.out().w(sys.Str.plus(sys.Str.plus(" { ", s), " }"));
    }
    ;
    return;
  }

  toSrcLink(loc,dis) {
    let src = this.#type.pod().src(loc.file(), false);
    if (src == null) {
      return null;
    }
    ;
    let frag = ((this$) => { if (sys.ObjUtil.compareGT(loc.line(), 20)) return sys.Str.plus("line", sys.ObjUtil.coerce(loc.line(), sys.Obj.type$.toNullable())); return null; })(this);
    return DocLink.make(this.doc(), sys.ObjUtil.coerce(src, Doc.type$), dis, frag);
  }

  writeSrcLink(loc,dis) {
    if (dis === undefined) dis = "Source";
    let link = this.toSrcLink(loc, dis);
    if (link == null) {
      return;
    }
    ;
    this.out().p("class='src'");
    this.writeLink(sys.ObjUtil.coerce(link, DocLink.type$));
    this.out().pEnd();
    return;
  }

}

class DocPodIndexRenderer extends DocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocPodIndexRenderer.type$; }

  #index = null;

  index() { return this.#index; }

  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  static make(env,out,doc) {
    const $self = new DocPodIndexRenderer();
    DocPodIndexRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DocRenderer.make$($self, env, out, doc);
    $self.#index = doc;
    return;
  }

  writeContent() {
    if (this.#index.pod().isManual()) {
      this.writeContentManual();
    }
    else {
      this.writeContentApi();
    }
    ;
    return;
  }

  writeContentApi() {
    const this$ = this;
    let pod = this.#index.pod();
    this.out().div("class='mainSidebar'");
    this.out().div("class='main type'");
    this.writeTypes();
    this.out().divEnd();
    this.out().div("class='sidebar'");
    this.out().h3().w("All Types").h3End();
    this.out().ul();
    pod.types().each((t) => {
      this$.out().li();
      this$.writeLinkTo(t);
      this$.out().liEnd();
      return;
    });
    this.out().ulEnd();
    this.out().divEnd();
    this.out().divEnd();
    if (pod.podDoc() != null) {
      this.out().div("class='mainSidebar'");
      this.out().div("class='main pod-doc' id='pod-doc'");
      DocChapterRenderer.make(this.env(), this.out(), sys.ObjUtil.coerce(pod.podDoc(), DocChapter.type$)).writeBody();
      this.out().divEnd();
      this.out().div("class='sidebar'");
      this.out().h3().w("Contents").h3End();
      this.writePodDocToc(pod.podDoc().headings());
      this.out().divEnd();
      this.out().divEnd();
    }
    ;
    return;
  }

  writeTypes() {
    const this$ = this;
    let pod = this.#index.pod();
    this.out().h1().span().w("pod").spanEnd().w(sys.Str.plus(" ", pod.name())).h1End();
    this.out().p().esc(pod.summary()).pEnd();
    pod.index().toc().each((item,i) => {
      if (sys.ObjUtil.is(item, sys.Str.type$)) {
        if (sys.ObjUtil.compareGT(i, 0)) {
          this$.out().tableEnd();
        }
        ;
        this$.out().h2().w(item).h2End();
        this$.out().table();
      }
      else {
        let type = sys.ObjUtil.as(item, DocType.type$);
        this$.out().tr();
        this$.out().td();
        this$.writeLinkTo(sys.ObjUtil.coerce(type, Doc.type$));
        this$.out().tdEnd();
        this$.out().td();
        this$.writeFandoc(type.doc().firstSentence());
        this$.out().tdEnd();
        this$.out().trEnd();
      }
      ;
      return;
    });
    this.out().tableEnd();
    return;
  }

  writePodDocToc(headings) {
    const this$ = this;
    this.out().ul();
    headings.each((h) => {
      this$.out().li().a(sys.Str.toUri(sys.Str.plus("#", h.anchorId()))).esc(h.title()).aEnd();
      if (!h.children().isEmpty()) {
        this$.writePodDocToc(h.children());
      }
      ;
      this$.out().liEnd();
      return;
    });
    this.out().ulEnd();
    return;
  }

  writeContentManual() {
    const this$ = this;
    let pod = this.#index.pod();
    this.out().h1().w(pod.name()).h1End();
    this.out().p().esc(pod.summary()).pEnd();
    this.out().div("class='toc'");
    let open = false;
    pod.index().toc().each((item) => {
      if (sys.ObjUtil.is(item, sys.Str.type$)) {
        if (open) {
          this$.out().olEnd();
        }
        ;
        (open = false);
        this$.out().h2().esc(item).h2End();
      }
      else {
        if (!open) {
          this$.out().ol();
        }
        ;
        (open = true);
        let c = sys.ObjUtil.as(item, DocChapter.type$);
        this$.out().li(sys.Str.plus(sys.Str.plus("value='", sys.ObjUtil.coerce(c.num(), sys.Obj.type$.toNullable())), "'"));
        this$.writeLinkTo(sys.ObjUtil.coerce(c, Doc.type$));
        this$.out().p().esc(c.summary()).pEnd();
        this$.out().p();
        c.headings().each((h,i) => {
          if (sys.ObjUtil.compareGT(i, 0)) {
            this$.out().w(", ");
          }
          ;
          this$.writeLinkTo(sys.ObjUtil.coerce(c, Doc.type$), h.title(), h.anchorId());
          return;
        });
        this$.out().pEnd().liEnd();
      }
      ;
      return;
    });
    if (open) {
      this.out().olEnd();
    }
    ;
    this.out().divEnd();
    return;
  }

}

class DocTopIndexRenderer extends DocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocTopIndexRenderer.type$; }

  #index = null;

  index() { return this.#index; }

  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  static make(env,out,doc) {
    const $self = new DocTopIndexRenderer();
    DocTopIndexRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DocRenderer.make$($self, env, out, doc);
    $self.#index = doc;
    return;
  }

  writeContent() {
    const this$ = this;
    this.out().div("class='index'");
    this.out().div("class='manuals'");
    this.out().h2().w("Manuals").h2End();
    this.writeManuals(this.#index.pods().findAll((p) => {
      return p.isManual();
    }));
    this.out().divEnd();
    this.out().div("class='apis'");
    this.out().h2().w("APIs").h2End();
    this.writeApis(this.#index.pods().findAll((p) => {
      return !p.isManual();
    }));
    this.out().divEnd();
    this.out().divEnd();
    return;
  }

  writeManuals(pods) {
    const this$ = this;
    this.out().table();
    let index = sys.ObjUtil.coerce(this.doc(), DocTopIndex.type$);
    pods.each((pod) => {
      this$.out().tr();
      this$.out().td();
      this$.writeLinkTo(pod.index(), pod.name());
      this$.out().tdEnd();
      this$.out().td().w(pod.summary());
      this$.out().div();
      pod.chapters().each((ch,i) => {
        if (sys.ObjUtil.compareGT(i, 0)) {
          this$.out().w(" &ndash; ");
        }
        ;
        this$.writeLinkTo(ch);
        return;
      });
      this$.out().divEnd();
      this$.out().tdEnd();
      this$.out().trEnd();
      return;
    });
    this.out().tableEnd();
    return;
  }

  writeApis(pods) {
    const this$ = this;
    this.out().table();
    let index = sys.ObjUtil.coerce(this.doc(), DocTopIndex.type$);
    let sorted = pods.dup().sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    sorted.each((pod) => {
      this$.out().tr();
      this$.out().td();
      this$.writeLinkTo(pod.index(), pod.name());
      this$.out().tdEnd();
      this$.out().td().w(pod.summary()).tdEnd();
      this$.out().trEnd();
      return;
    });
    this.out().tableEnd();
    return;
  }

}

class DocChapterRenderer extends DocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocChapterRenderer.type$; }

  #chapter = null;

  chapter() { return this.#chapter; }

  __chapter(it) { if (it === undefined) return this.#chapter; else this.#chapter = it; }

  static make(env,out,doc) {
    const $self = new DocChapterRenderer();
    DocChapterRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DocRenderer.make$($self, env, out, doc);
    $self.#chapter = doc;
    return;
  }

  writeContent() {
    this.out().div("class='mainSidebar'");
    this.out().div("class='main chapter'");
    this.writeNav();
    this.out().h1().span().w(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this.#chapter.num(), sys.Obj.type$.toNullable())), ".")).spanEnd().w(" ").esc(this.#chapter.title()).h1End();
    this.writeBody();
    this.writeNav();
    this.out().divEnd();
    this.out().div("class='sidebar'");
    this.writeToc();
    this.out().divEnd();
    this.out().divEnd();
    return;
  }

  writeBody() {
    this.writeFandoc(this.#chapter.doc());
    return;
  }

  writeNav() {
    let cur = this.#chapter;
    this.out().ul("class='chapter-nav'");
    if (cur.prev() != null) {
      this.out().li("class='prev'");
      this.writeLinkTo(sys.ObjUtil.coerce(cur.prev(), Doc.type$), sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(cur.prev().num(), sys.Obj.type$.toNullable())), ". "), cur.prev().title()));
      this.out().liEnd();
    }
    ;
    if (cur.next() != null) {
      this.out().li("class='next'");
      this.writeLinkTo(sys.ObjUtil.coerce(cur.next(), Doc.type$), sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(cur.next().num(), sys.Obj.type$.toNullable())), ". "), cur.next().title()));
      this.out().liEnd();
    }
    ;
    this.out().ulEnd();
    return;
  }

  writeToc() {
    const this$ = this;
    this.out().h3();
    this.writeLinkTo(this.#chapter.pod().index(), this.#chapter.pod().name());
    this.out().h3End();
    let cur = this.#chapter;
    let map = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("compilerDoc::DocChapter[]")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:compilerDoc::DocChapter[]]"));
    let last = "";
    this.#chapter.pod().index().toc().each((item) => {
      if (sys.ObjUtil.is(item, sys.Str.type$)) {
        (last = sys.ObjUtil.coerce(item, sys.Str.type$));
      }
      else {
        let list = ((this$) => { let $_u60 = map.get(last); if ($_u60 != null) return $_u60; return sys.List.make(DocChapter.type$); })(this$);
        list.add(sys.ObjUtil.coerce(item, DocChapter.type$));
        map.set(last, sys.ObjUtil.coerce(list, sys.Type.find("compilerDoc::DocChapter[]")));
      }
      ;
      return;
    });
    map.each((chapters,part) => {
      if (!sys.Str.isEmpty(part)) {
        if (chapters.contains(cur)) {
          this$.out().h4().esc(part).h4End();
        }
        else {
          this$.out().h4();
          this$.writeLinkTo(sys.ObjUtil.coerce(chapters.first(), Doc.type$), part);
          this$.out().h4End();
          return;
        }
        ;
      }
      ;
      this$.out().ol();
      chapters.each((c) => {
        this$.out().li(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("value='", sys.ObjUtil.coerce(c.num(), sys.Obj.type$.toNullable())), "' style='counter-reset:chapter "), sys.ObjUtil.coerce(c.num(), sys.Obj.type$.toNullable())), ";'"));
        this$.writeLinkTo(c);
        if (sys.ObjUtil.equals(c, cur)) {
          this$.out().ol();
          c.headings().each((h) => {
            this$.out().li();
            this$.writeLinkTo(c, h.title(), h.anchorId());
            this$.out().liEnd();
            if (sys.ObjUtil.compareGT(h.children().size(), 0)) {
              this$.out().ol();
              h.children().each((sh) => {
                this$.out().li();
                this$.writeLinkTo(c, sh.title(), sh.anchorId());
                this$.out().liEnd();
                return;
              });
              this$.out().olEnd();
            }
            ;
            return;
          });
          this$.out().olEnd();
        }
        ;
        this$.out().liEnd();
        return;
      });
      this$.out().olEnd();
      return;
    });
    return;
  }

}

class DefaultDocEnv extends DocEnv {
  constructor() {
    super();
    const this$ = this;
    this.#actor = DefaultDocEnvActor.make(this);
    return;
  }

  typeof() { return DefaultDocEnv.type$; }

  #actor = null;

  // private field reflection only
  __actor(it) { if (it === undefined) return this.#actor; else this.#actor = it; }

  space(name,checked) {
    if (checked === undefined) checked = true;
    let space = sys.ObjUtil.as(this.#actor.send(name).get(sys.Duration.fromStr("10sec")), DocSpace.type$);
    if (space != null) {
      return space;
    }
    ;
    if (checked) {
      throw UnknownDocErr.make(sys.Str.plus("space: ", name));
    }
    ;
    return null;
  }

  loadSpace(env,name) {
    let file = sys.Env.cur().findPodFile(name);
    if (file == null) {
      return null;
    }
    ;
    return DocPod.load(env, sys.ObjUtil.coerce(file, sys.File.type$));
  }

  static make() {
    const $self = new DefaultDocEnv();
    DefaultDocEnv.make$($self);
    return $self;
  }

  static make$($self) {
    DocEnv.make$($self);
    ;
    return;
  }

}

class DefaultDocEnvActor extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DefaultDocEnvActor.type$; }

  #env = null;

  env() { return this.#env; }

  __env(it) { if (it === undefined) return this.#env; else this.#env = it; }

  static make(env) {
    const $self = new DefaultDocEnvActor();
    DefaultDocEnvActor.make$($self,env);
    return $self;
  }

  static make$($self,env) {
    concurrent.Actor.make$($self, concurrent.ActorPool.make());
    $self.#env = env;
    return;
  }

  receive(msg) {
    let spaces = sys.ObjUtil.as(concurrent.Actor.locals().get("spaces"), sys.Type.find("[sys::Str:compilerDoc::DocSpace?]"));
    if (spaces == null) {
      concurrent.Actor.locals().set("spaces", (spaces = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("compilerDoc::DocSpace?"))));
    }
    ;
    let name = sys.ObjUtil.coerce(msg, sys.Str.type$);
    if (spaces.containsKey(name)) {
      return spaces.get(name);
    }
    ;
    let space = this.#env.loadSpace(this.#env, name);
    spaces.set(name, space);
    return space;
  }

}

class ApiDocParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#cur = "";
    this.#typeLoc = DocLoc.unknown();
    return;
  }

  typeof() { return ApiDocParser.type$; }

  #in = null;

  // private field reflection only
  __in(it) { if (it === undefined) return this.#in; else this.#in = it; }

  #pod = null;

  // private field reflection only
  __pod(it) { if (it === undefined) return this.#pod; else this.#pod = it; }

  #cur = null;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #typeLoc = null;

  // private field reflection only
  __typeLoc(it) { if (it === undefined) return this.#typeLoc; else this.#typeLoc = it; }

  #typeRef = null;

  // private field reflection only
  __typeRef(it) { if (it === undefined) return this.#typeRef; else this.#typeRef = it; }

  #eof = false;

  // private field reflection only
  __eof(it) { if (it === undefined) return this.#eof; else this.#eof = it; }

  static make(pod,in$) {
    const $self = new ApiDocParser();
    ApiDocParser.make$($self,pod,in$);
    return $self;
  }

  static make$($self,pod,in$) {
    ;
    $self.#pod = pod;
    $self.#in = in$;
    $self.consumeLine();
    return;
  }

  parseType(close) {
    if (close === undefined) close = true;
    try {
      if (!sys.Str.startsWith(this.#cur, "== ")) {
        throw sys.Err.make("Expected == <name>");
      }
      ;
      let name = sys.Str.getRange(this.#cur, sys.Range.make(3, -1));
      this.consumeLine();
      let attrs = this.parseAttrs();
      this.#typeRef = DocTypeRef.fromStr(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#pod.name()), "::"), name));
      this.#typeLoc = attrs.loc();
      let list = sys.List.make(DocSlot.type$);
      let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("compilerDoc::DocSlot"));
      while (true) {
        let slot = this.parseSlot();
        if (slot == null) {
          break;
        }
        ;
        list.add(sys.ObjUtil.coerce(slot, DocSlot.type$));
        map.set(slot.name(), sys.ObjUtil.coerce(slot, DocSlot.type$));
      }
      ;
      return DocType.make(this.#pod, attrs, sys.ObjUtil.coerce(this.#typeRef, DocTypeRef.type$), list, map);
    }
    finally {
      if (close) {
        this.#in.close();
      }
      ;
    }
    ;
  }

  parseSlot() {
    if (sys.Str.isEmpty(this.#cur)) {
      return null;
    }
    ;
    if (!sys.Str.startsWith(this.#cur, "-- ")) {
      throw sys.Err.make("Expected -- <name>");
    }
    ;
    if (sys.ObjUtil.equals(sys.Str.get(this.#cur, -1), 40)) {
      return this.parseMethod();
    }
    else {
      return this.parseField();
    }
    ;
  }

  parseField() {
    let sp = sys.Str.index(this.#cur, " ", 4);
    let initi = sys.Str.index(this.#cur, ":=", sys.Int.plus(sys.ObjUtil.coerce(sp, sys.Int.type$), 1));
    let name = sys.Str.getRange(this.#cur, sys.Range.make(3, sys.ObjUtil.coerce(sp, sys.Int.type$), true));
    let type = sys.Str.getRange(this.#cur, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sp, sys.Int.type$), 1), sys.ObjUtil.coerce(((this$) => { let $_u61 = initi; if ($_u61 != null) return $_u61; return sys.ObjUtil.coerce(sys.Str.size(this$.#cur), sys.Int.type$.toNullable()); })(this), sys.Int.type$), true));
    let init = ((this$) => { if (initi == null) return null; return sys.Str.getRange(this$.#cur, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(initi, sys.Int.type$), 2), -1)); })(this);
    this.consumeLine();
    let attrs = this.parseAttrs();
    return DocField.make(attrs, sys.ObjUtil.coerce(this.#typeRef, DocTypeRef.type$), name, sys.ObjUtil.coerce(DocTypeRef.fromStr(type), DocTypeRef.type$), init);
  }

  parseMethod() {
    let name = sys.Str.getRange(this.#cur, sys.Range.make(3, -2));
    this.consumeLine();
    let params = sys.List.make(DocParam.type$);
    while (sys.ObjUtil.compareNE(sys.Str.get(this.#cur, 0), 41)) {
      let sp = sys.Str.index(this.#cur, " ");
      let defi = sys.Str.index(this.#cur, ":=", sys.Int.plus(sys.ObjUtil.coerce(sp, sys.Int.type$), 1));
      let pname = sys.Str.getRange(this.#cur, sys.Range.make(0, sys.ObjUtil.coerce(sp, sys.Int.type$), true));
      let type = sys.Str.getRange(this.#cur, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sp, sys.Int.type$), 1), sys.ObjUtil.coerce(((this$) => { let $_u63 = defi; if ($_u63 != null) return $_u63; return sys.ObjUtil.coerce(sys.Str.size(this$.#cur), sys.Int.type$.toNullable()); })(this), sys.Int.type$), true));
      let def = ((this$) => { if (defi == null) return null; return sys.Str.getRange(this$.#cur, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(defi, sys.Int.type$), 2), -1)); })(this);
      params.add(DocParam.make(sys.ObjUtil.coerce(DocTypeRef.fromStr(type), DocTypeRef.type$), pname, def));
      this.consumeLine();
    }
    ;
    let returns = DocTypeRef.fromStr(sys.Str.getRange(this.#cur, sys.Range.make(2, -1)));
    this.consumeLine();
    let attrs = this.parseAttrs();
    attrs.flags(sys.Int.and(attrs.flags(), sys.Int.not(DocFlags.Const())));
    return DocMethod.make(attrs, sys.ObjUtil.coerce(this.#typeRef, DocTypeRef.type$), name, sys.ObjUtil.coerce(returns, DocTypeRef.type$), params);
  }

  parseAttrs() {
    let attrs = DocAttrs.make();
    this.parseMeta(attrs);
    this.parseFacets(attrs);
    this.parseDoc(attrs);
    return attrs;
  }

  parseMeta(attrs) {
    while ((!sys.Str.isEmpty(this.#cur) && sys.Int.isAlpha(sys.Str.get(this.#cur, 0)))) {
      let eq = sys.Str.index(this.#cur, "=");
      let name = sys.Str.getRange(this.#cur, sys.Range.make(0, sys.ObjUtil.coerce(eq, sys.Int.type$), true));
      let val = sys.Str.getRange(this.#cur, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(eq, sys.Int.type$), 1), -1));
      let $_u65 = name;
      if (sys.ObjUtil.equals($_u65, "loc")) {
        this.parseLoc(attrs, val);
      }
      else if (sys.ObjUtil.equals($_u65, "flags")) {
        attrs.flags(DocFlags.fromNames(val));
      }
      else if (sys.ObjUtil.equals($_u65, "base")) {
        attrs.base(this.parseTypeList(val));
      }
      else if (sys.ObjUtil.equals($_u65, "mixins")) {
        attrs.mixins(this.parseTypeList(val));
      }
      else if (sys.ObjUtil.equals($_u65, "set")) {
        attrs.setterFlags(sys.ObjUtil.coerce(DocFlags.fromNames(val), sys.Int.type$.toNullable()));
      }
      ;
      this.consumeLine();
    }
    ;
    return;
  }

  parseLoc(attrs,val) {
    let colon = sys.Str.index(val, ":");
    let slash = sys.Str.indexr(val, "/");
    let file = ((this$) => { if (sys.ObjUtil.equals(colon, 0)) return this$.#typeLoc.file(); return sys.Str.getRange(val, sys.Range.make(0, sys.ObjUtil.coerce(colon, sys.Int.type$), true)); })(this);
    let line = sys.Str.toInt(sys.Str.getRange(val, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1), sys.ObjUtil.coerce(((this$) => { let $_u67 = slash; if ($_u67 != null) return $_u67; return sys.ObjUtil.coerce(sys.Str.size(val), sys.Int.type$.toNullable()); })(this), sys.Int.type$), true)));
    let docLine = ((this$) => { if (slash != null) return sys.Str.toInt(sys.Str.getRange(val, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(slash, sys.Int.type$), 1), -1))); return line; })(this);
    attrs.loc(DocLoc.make(file, sys.ObjUtil.coerce(line, sys.Int.type$)));
    attrs.docLoc(DocLoc.make(file, sys.ObjUtil.coerce(docLine, sys.Int.type$)));
    return;
  }

  parseTypeList(val) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.Str.split(val).map((tok) => {
      return sys.ObjUtil.coerce(DocTypeRef.fromStr(tok), DocTypeRef.type$);
    }, DocTypeRef.type$), sys.Type.find("compilerDoc::DocTypeRef[]"));
  }

  parseFacets(attrs) {
    let facet = this.parseFacet();
    if (facet == null) {
      return;
    }
    ;
    let acc = sys.List.make(DocFacet.type$.toNullable(), [facet]);
    while ((facet = this.parseFacet()) != null) {
      acc.add(facet);
    }
    ;
    attrs.facets(acc);
    return;
  }

  parseFacet() {
    if (!sys.Str.startsWith(this.#cur, "@")) {
      return null;
    }
    ;
    let complex = sys.ObjUtil.equals(sys.Str.get(this.#cur, -1), 123);
    let type = DocTypeRef.fromStr(sys.Str.getRange(this.#cur, sys.Range.make(1, ((this$) => { if (complex) return -2; return -1; })(this))));
    let fields = DocFacet.noFields();
    this.consumeLine();
    if (complex) {
      (fields = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
      fields.ordered(true);
      while (sys.ObjUtil.compareNE(this.#cur, "}")) {
        let eq = sys.Str.index(this.#cur, "=");
        let name = sys.Str.getRange(this.#cur, sys.Range.make(0, sys.ObjUtil.coerce(eq, sys.Int.type$), true));
        let val = sys.Str.getRange(this.#cur, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(eq, sys.Int.type$), 1), -1));
        fields.set(name, val);
        this.consumeLine();
      }
      ;
      this.consumeLine();
    }
    ;
    return DocFacet.make(sys.ObjUtil.coerce(type, DocTypeRef.type$), fields);
  }

  parseDoc(attrs) {
    if (!sys.Str.isEmpty(this.#cur)) {
      throw sys.Err.make("expecting empty line");
    }
    ;
    this.consumeLine();
    let s = sys.StrBuf.make(256);
    while ((!this.#eof && !sys.Str.startsWith(this.#cur, "-- "))) {
      s.add(this.#cur).addChar(10);
      this.consumeLine();
    }
    ;
    attrs.doc(DocFandoc.make(attrs.docLoc(), s.toStr()));
    return;
  }

  consumeLine() {
    let next = this.#in.readLine();
    if (next != null) {
      this.#cur = sys.ObjUtil.coerce(next, sys.Str.type$);
    }
    else {
      this.#cur = "";
      this.#eof = true;
    }
    ;
    return;
  }

}

class DocAttrs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#loc = DocLoc.unknown();
    this.#docLoc = DocLoc.unknown();
    this.#base = sys.ObjUtil.coerce(DocTypeRef.type$.emptyList(), sys.Type.find("compilerDoc::DocTypeRef[]"));
    this.#mixins = sys.ObjUtil.coerce(DocTypeRef.type$.emptyList(), sys.Type.find("compilerDoc::DocTypeRef[]"));
    this.#facets = sys.ObjUtil.coerce(DocFacet.type$.emptyList(), sys.Type.find("compilerDoc::DocFacet[]"));
    return;
  }

  typeof() { return DocAttrs.type$; }

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

  #loc = null;

  loc(it) {
    if (it === undefined) {
      return this.#loc;
    }
    else {
      this.#loc = it;
      return;
    }
  }

  #docLoc = null;

  docLoc(it) {
    if (it === undefined) {
      return this.#docLoc;
    }
    else {
      this.#docLoc = it;
      return;
    }
  }

  #setterFlags = null;

  setterFlags(it) {
    if (it === undefined) {
      return this.#setterFlags;
    }
    else {
      this.#setterFlags = it;
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

  #mixins = null;

  mixins(it) {
    if (it === undefined) {
      return this.#mixins;
    }
    else {
      this.#mixins = it;
      return;
    }
  }

  #facets = null;

  facets(it) {
    if (it === undefined) {
      return this.#facets;
    }
    else {
      this.#facets = it;
      return;
    }
  }

  #doc = null;

  doc(it) {
    if (it === undefined) {
      return this.#doc;
    }
    else {
      this.#doc = it;
      return;
    }
  }

  static make() {
    const $self = new DocAttrs();
    DocAttrs.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class Main extends util.AbstractMain {
  constructor() {
    super();
    const this$ = this;
    this.#pods = sys.List.make(sys.Str.type$);
    this.#outDir = sys.Env.cur().workDir().plus(sys.Uri.fromStr("doc/"));
    this.#env = DefaultDocEnv.make();
    this.#spaces = sys.List.make(DocSpace.type$);
    return;
  }

  typeof() { return Main.type$; }

  #all = false;

  all(it) {
    if (it === undefined) {
      return this.#all;
    }
    else {
      this.#all = it;
      return;
    }
  }

  #allCore = false;

  allCore(it) {
    if (it === undefined) {
      return this.#allCore;
    }
    else {
      this.#allCore = it;
      return;
    }
  }

  #pods = null;

  pods(it) {
    if (it === undefined) {
      return this.#pods;
    }
    else {
      this.#pods = it;
      return;
    }
  }

  #clean = false;

  clean(it) {
    if (it === undefined) {
      return this.#clean;
    }
    else {
      this.#clean = it;
      return;
    }
  }

  #outDir = null;

  outDir(it) {
    if (it === undefined) {
      return this.#outDir;
    }
    else {
      this.#outDir = it;
      return;
    }
  }

  #env = null;

  env(it) {
    if (it === undefined) {
      return this.#env;
    }
    else {
      this.#env = it;
      return;
    }
  }

  #spaces = null;

  spaces(it) {
    if (it === undefined) {
      return this.#spaces;
    }
    else {
      this.#spaces = it;
      return;
    }
  }

  run() {
    const this$ = this;
    if (!this.#outDir.isDir()) {
      this.#outDir = this.#outDir.uri().plusSlash().toFile();
    }
    ;
    if (this.#clean) {
      sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("Delete [", this.#outDir), "]"));
      this.#outDir.delete();
    }
    ;
    this.#spaces = sys.List.make(DocSpace.type$);
    let isAll = (this.#all || this.#allCore);
    let podNames = ((this$) => { if (isAll) return sys.Env.cur().findAllPodNames(); return this$.#pods; })(this);
    podNames.each((podName) => {
      let pod = sys.ObjUtil.coerce(this$.#env.space(podName), DocPod.type$);
      if (isAll) {
        if (sys.ObjUtil.equals(pod.meta().get("pod.docApi"), "false")) {
          return;
        }
        ;
      }
      ;
      if (this$.#allCore) {
        if (!sys.Str.startsWith(((this$) => { let $_u71 = pod.meta().get("proj.name"); if ($_u71 != null) return $_u71; return ""; })(this$), "Fantom ")) {
          return;
        }
        ;
      }
      ;
      this$.#spaces.add(pod);
      return;
    });
    if (isAll) {
      this.#spaces.sort();
      this.#spaces.moveTo(this.#spaces.find((p) => {
        return sys.ObjUtil.equals(p.spaceName(), "docIntro");
      }), 0);
      this.#spaces.moveTo(this.#spaces.find((p) => {
        return sys.ObjUtil.equals(p.spaceName(), "docLang");
      }), 1);
    }
    ;
    if (isAll) {
      this.writeTopIndex(this.#env, DocTopIndex.make((it) => {
        it.__spaces(sys.ObjUtil.coerce(((this$) => { let $_u72 = this$.#spaces; if ($_u72 == null) return null; return sys.ObjUtil.toImmutable(this$.#spaces); })(this$), sys.Type.find("compilerDoc::DocSpace[]")));
        return;
      }));
    }
    ;
    this.#spaces.each((space) => {
      this$.writeSpace(this$.#env, space);
      return;
    });
    return 0;
  }

  writeTopIndex(env,doc) {
    sys.ObjUtil.echo("Writing top-level index and css ...");
    let file = this.#outDir.plus(sys.Uri.fromStr("index.html"));
    let out = web.WebOutStream.make(file.out());
    env.render(out, doc);
    out.close();
    Main.type$.pod().file(sys.Uri.fromStr("/res/style.css")).copyInto(this.#outDir, sys.Map.__fromLiteral(["overwrite"], [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")));
    return;
  }

  writeSpace(env,space) {
    const this$ = this;
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("Writing '", space.spaceName()), "' ..."));
    let spaceDir = this.#outDir.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", space.spaceName()), "/")));
    space.eachDoc((doc) => {
      if (sys.ObjUtil.equals(doc.docName(), "pod-doc")) {
        return;
      }
      ;
      if (sys.ObjUtil.is(doc, DocRes.type$)) {
        this$.writeRes(env, spaceDir, sys.ObjUtil.coerce(doc, DocRes.type$));
      }
      else {
        this$.writeDoc(env, spaceDir, doc);
      }
      ;
      return;
    });
    return;
  }

  writeRes(env,dir,res) {
    let zip = sys.Zip.open(res.pod().file());
    try {
      zip.contents().get(res.uri()).copyInto(dir, sys.Map.__fromLiteral(["overwrite"], [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")));
    }
    finally {
      zip.close();
    }
    ;
    return;
  }

  writeDoc(env,dir,doc) {
    let file = dir.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", doc.docName()), ".html")));
    let out = web.WebOutStream.make(file.out());
    env.render(out, doc);
    out.close();
    return;
  }

  static make() {
    const $self = new Main();
    Main.make$($self);
    return $self;
  }

  static make$($self) {
    util.AbstractMain.make$($self);
    ;
    return;
  }

}

class DocTypeRefTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocTypeRefTest.type$; }

  test() {
    const this$ = this;
    let t = DocTypeRef.fromStr("foo::Bar");
    this.verifyBasic(sys.ObjUtil.coerce(t, DocTypeRef.type$), "foo", "Bar", false);
    (t = DocTypeRef.fromStr("foo::Bar?"));
    this.verifyBasic(sys.ObjUtil.coerce(t, DocTypeRef.type$), "foo", "Bar", true);
    (t = DocTypeRef.fromStr("foo::Bar[]"));
    this.verifyEq(t.pod(), "sys");
    this.verifyEq(t.name(), "List");
    this.verifyEq(t.qname(), "sys::List");
    this.verifyEq(t.signature(), "foo::Bar[]");
    this.verifyEq(sys.ObjUtil.coerce(t.isNullable(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyBasic(sys.ObjUtil.coerce(t.v(), DocTypeRef.type$), "foo", "Bar", false);
    (t = DocTypeRef.fromStr("foo::Bar?[]"));
    this.verifyEq(t.pod(), "sys");
    this.verifyEq(t.name(), "List");
    this.verifyEq(t.qname(), "sys::List");
    this.verifyEq(t.signature(), "foo::Bar?[]");
    this.verifyEq(sys.ObjUtil.coerce(t.isNullable(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyBasic(sys.ObjUtil.coerce(t.v(), DocTypeRef.type$), "foo", "Bar", true);
    (t = DocTypeRef.fromStr("foo::Bar[]?"));
    this.verifyEq(t.pod(), "sys");
    this.verifyEq(t.name(), "List");
    this.verifyEq(t.qname(), "sys::List");
    this.verifyEq(t.signature(), "foo::Bar[]?");
    this.verifyEq(sys.ObjUtil.coerce(t.isNullable(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyBasic(sys.ObjUtil.coerce(t.v(), DocTypeRef.type$), "foo", "Bar", false);
    (t = DocTypeRef.fromStr("[sys::Str:foo::Bar]"));
    this.verifyEq(t.pod(), "sys");
    this.verifyEq(t.name(), "Map");
    this.verifyEq(t.qname(), "sys::Map");
    this.verifyEq(t.signature(), "[sys::Str:foo::Bar]");
    this.verifyEq(sys.ObjUtil.coerce(t.isNullable(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyBasic(sys.ObjUtil.coerce(t.k(), DocTypeRef.type$), "sys", "Str", false);
    this.verifyBasic(sys.ObjUtil.coerce(t.v(), DocTypeRef.type$), "foo", "Bar", false);
    (t = DocTypeRef.fromStr("[sys::Str:foo::Bar?]?"));
    this.verifyEq(t.pod(), "sys");
    this.verifyEq(t.name(), "Map");
    this.verifyEq(t.qname(), "sys::Map");
    this.verifyEq(t.signature(), "[sys::Str:foo::Bar?]?");
    this.verifyEq(sys.ObjUtil.coerce(t.isNullable(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyBasic(sys.ObjUtil.coerce(t.k(), DocTypeRef.type$), "sys", "Str", false);
    this.verifyBasic(sys.ObjUtil.coerce(t.v(), DocTypeRef.type$), "foo", "Bar", true);
    (t = DocTypeRef.fromStr("|->foo::Bar|"));
    this.verifyEq(t.pod(), "sys");
    this.verifyEq(t.name(), "Func");
    this.verifyEq(t.qname(), "sys::Func");
    this.verifyEq(t.signature(), "|->foo::Bar|");
    this.verifyEq(sys.ObjUtil.coerce(t.isNullable(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(t.funcParams().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyBasic(sys.ObjUtil.coerce(t.funcReturn(), DocTypeRef.type$), "foo", "Bar", false);
    (t = DocTypeRef.fromStr("|sys::Int->foo::Bar?|?"));
    this.verifyEq(t.pod(), "sys");
    this.verifyEq(t.name(), "Func");
    this.verifyEq(t.qname(), "sys::Func");
    this.verifyEq(t.signature(), "|sys::Int->foo::Bar?|?");
    this.verifyEq(sys.ObjUtil.coerce(t.isNullable(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(t.funcParams().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyBasic(t.funcParams().get(0), "sys", "Int", false);
    this.verifyBasic(sys.ObjUtil.coerce(t.funcReturn(), DocTypeRef.type$), "foo", "Bar", true);
    (t = DocTypeRef.fromStr("|sys::Int?[],sys::Str->sys::Void|"));
    this.verifyEq(t.pod(), "sys");
    this.verifyEq(t.name(), "Func");
    this.verifyEq(t.qname(), "sys::Func");
    this.verifyEq(t.signature(), "|sys::Int?[],sys::Str->sys::Void|");
    this.verifyEq(sys.ObjUtil.coerce(t.isNullable(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(t.funcParams().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(t.funcParams().get(0).qname(), "sys::List");
    this.verifyBasic(sys.ObjUtil.coerce(t.funcParams().get(0).v(), DocTypeRef.type$), "sys", "Int", true);
    this.verifyBasic(t.funcParams().get(1), "sys", "Str", false);
    this.verifyBasic(sys.ObjUtil.coerce(t.funcReturn(), DocTypeRef.type$), "sys", "Void", false);
    (t = DocTypeRef.fromStr("[sys::Str:foo::Bar?[]][]?"));
    this.verifyEq(t.qname(), "sys::List");
    this.verifyEq(t.signature(), "[sys::Str:foo::Bar?[]][]?");
    this.verifyEq(sys.ObjUtil.coerce(t.isNullable(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    (t = t.v());
    this.verifyEq(t.qname(), "sys::Map");
    this.verifyEq(t.signature(), "[sys::Str:foo::Bar?[]]");
    (t = t.v());
    this.verifyEq(t.qname(), "sys::List");
    this.verifyBasic(sys.ObjUtil.coerce(t.v(), DocTypeRef.type$), "foo", "Bar", true);
    (t = DocTypeRef.fromStr("sys::Str[][]?[]"));
    this.verifyEq(t.qname(), "sys::List");
    (t = t.v());
    this.verifyEq(t.signature(), "sys::Str[][]?");
    this.verifyEq(sys.ObjUtil.coerce(t.isNullable(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    (t = t.v());
    this.verifyEq(t.signature(), "sys::Str[]");
    this.verifyEq(sys.ObjUtil.coerce(t.isNullable(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    (t = t.v());
    this.verifyEq(t.signature(), "sys::Str");
    this.verifyEq(DocTypeRef.fromStr("foo", false), null);
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = DocTypeRef.fromStr("foo");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = DocTypeRef.fromStr("foo", true);
      return;
    });
    return;
  }

  verifyBasic(t,pod,name,nullable) {
    this.verifyEq(t.pod(), pod);
    this.verifyEq(t.name(), name);
    this.verifyEq(t.qname(), sys.Str.plus(sys.Str.plus(sys.Str.plus("", pod), "::"), name));
    this.verifyEq(t.signature(), ((this$) => { if (nullable) return sys.Str.plus(sys.Str.plus("", t.qname()), "?"); return t.qname(); })(this));
    this.verifyEq(sys.ObjUtil.coerce(t.isNullable(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(nullable, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(t.isParameterized(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    return;
  }

  static make() {
    const $self = new DocTypeRefTest();
    DocTypeRefTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

const p = sys.Pod.add$('compilerDoc');
const xp = sys.Param.noParams$();
let m;
DocCrawler.type$ = p.am$('DocCrawler','sys::Obj',[],{},8449,DocCrawler);
DocEnv.type$ = p.at$('DocEnv','sys::Obj',[],{},8195,DocEnv);
DocLink.type$ = p.at$('DocLink','sys::Obj',[],{},8194,DocLink);
DocErr.type$ = p.at$('DocErr','sys::Err',[],{},8194,DocErr);
UnknownDocErr.type$ = p.at$('UnknownDocErr','sys::Err',[],{},8194,UnknownDocErr);
DocErrHandler.type$ = p.at$('DocErrHandler','sys::Obj',[],{},8192,DocErrHandler);
DocTheme.type$ = p.at$('DocTheme','sys::Obj',[],{},8194,DocTheme);
DocSlot.type$ = p.at$('DocSlot','sys::Obj',[],{},8195,DocSlot);
DocField.type$ = p.at$('DocField','compilerDoc::DocSlot',[],{},8194,DocField);
DocMethod.type$ = p.at$('DocMethod','compilerDoc::DocSlot',[],{},8194,DocMethod);
DocParam.type$ = p.at$('DocParam','sys::Obj',[],{},8194,DocParam);
DocFlags.type$ = p.at$('DocFlags','sys::Obj',[],{},8226,DocFlags);
Doc.type$ = p.at$('Doc','sys::Obj',[],{},8195,Doc);
DocType.type$ = p.at$('DocType','compilerDoc::Doc',[],{},8194,DocType);
DocFacet.type$ = p.at$('DocFacet','sys::Obj',[],{},8194,DocFacet);
DocTypeRef.type$ = p.at$('DocTypeRef','sys::Obj',[],{},8195,DocTypeRef);
BasicTypeRef.type$ = p.at$('BasicTypeRef','compilerDoc::DocTypeRef',[],{},130,BasicTypeRef);
NullableTypeRef.type$ = p.at$('NullableTypeRef','compilerDoc::DocTypeRef',[],{},130,NullableTypeRef);
ListTypeRef.type$ = p.at$('ListTypeRef','compilerDoc::DocTypeRef',[],{},130,ListTypeRef);
MapTypeRef.type$ = p.at$('MapTypeRef','compilerDoc::DocTypeRef',[],{},130,MapTypeRef);
FuncTypeRef.type$ = p.at$('FuncTypeRef','compilerDoc::DocTypeRef',[],{},130,FuncTypeRef);
DocTypeRefParser.type$ = p.at$('DocTypeRefParser','sys::Obj',[],{},128,DocTypeRefParser);
DocChapter.type$ = p.at$('DocChapter','compilerDoc::Doc',[],{},8194,DocChapter);
DocHeading.type$ = p.at$('DocHeading','sys::Obj',[],{},8194,DocHeading);
DocTopIndex.type$ = p.at$('DocTopIndex','compilerDoc::Doc',[],{},8194,DocTopIndex);
DocRes.type$ = p.at$('DocRes','compilerDoc::Doc',[],{},8194,DocRes);
DocSrc.type$ = p.at$('DocSrc','compilerDoc::Doc',[],{},8194,DocSrc);
DocLoc.type$ = p.at$('DocLoc','sys::Obj',[],{},8194,DocLoc);
DocFandoc.type$ = p.at$('DocFandoc','sys::Obj',[],{},8194,DocFandoc);
DocSpace.type$ = p.at$('DocSpace','sys::Obj',[],{},8195,DocSpace);
DocPod.type$ = p.at$('DocPod','compilerDoc::DocSpace',[],{},8194,DocPod);
DocPodIndex.type$ = p.at$('DocPodIndex','compilerDoc::Doc',[],{},8194,DocPodIndex);
DocPodLoader.type$ = p.at$('DocPodLoader','sys::Obj',[],{},128,DocPodLoader);
DocRenderer.type$ = p.at$('DocRenderer','sys::Obj',[],{},8193,DocRenderer);
DocSrcRenderer.type$ = p.at$('DocSrcRenderer','compilerDoc::DocRenderer',[],{},8192,DocSrcRenderer);
DocTypeRenderer.type$ = p.at$('DocTypeRenderer','compilerDoc::DocRenderer',[],{},8192,DocTypeRenderer);
DocPodIndexRenderer.type$ = p.at$('DocPodIndexRenderer','compilerDoc::DocRenderer',[],{},8192,DocPodIndexRenderer);
DocTopIndexRenderer.type$ = p.at$('DocTopIndexRenderer','compilerDoc::DocRenderer',[],{},8192,DocTopIndexRenderer);
DocChapterRenderer.type$ = p.at$('DocChapterRenderer','compilerDoc::DocRenderer',[],{},8192,DocChapterRenderer);
DefaultDocEnv.type$ = p.at$('DefaultDocEnv','compilerDoc::DocEnv',[],{'sys::NoDoc':""},8194,DefaultDocEnv);
DefaultDocEnvActor.type$ = p.at$('DefaultDocEnvActor','concurrent::Actor',[],{},130,DefaultDocEnvActor);
ApiDocParser.type$ = p.at$('ApiDocParser','sys::Obj',[],{},128,ApiDocParser);
DocAttrs.type$ = p.at$('DocAttrs','sys::Obj',[],{},128,DocAttrs);
Main.type$ = p.at$('Main','util::AbstractMain',[],{'sys::NoDoc':""},8192,Main);
DocTypeRefTest.type$ = p.at$('DocTypeRefTest','sys::Test',[],{},8192,DocTypeRefTest);
DocCrawler.type$.am$('addText',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('addFandoc',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('fandoc','compilerDoc::DocFandoc',false)]),{}).am$('addKeyword',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('keyword','sys::Str',false),new sys.Param('title','sys::Str',false),new sys.Param('summary','compilerDoc::DocFandoc',false),new sys.Param('anchor','sys::Str?',false)]),{});
DocEnv.type$.am$('theme',270336,'compilerDoc::DocTheme',xp,{}).am$('topIndex',270336,'compilerDoc::DocTopIndex',xp,{}).am$('space',270337,'compilerDoc::DocSpace?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('doc',270336,'compilerDoc::Doc?',sys.List.make(sys.Param.type$,[new sys.Param('spaceName','sys::Str',false),new sys.Param('docName','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('render',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','web::WebOutStream',false),new sys.Param('doc','compilerDoc::Doc',false)]),{}).am$('linkUri',270336,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('link','compilerDoc::DocLink',false)]),{}).am$('linkUriExt',270336,'sys::Str?',xp,{}).am$('link',270336,'compilerDoc::DocLink?',sys.List.make(sys.Param.type$,[new sys.Param('from','compilerDoc::Doc',false),new sys.Param('link','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('linkCheck',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('link','compilerDoc::DocLink',false),new sys.Param('loc','compilerDoc::DocLoc',false)]),{}).am$('initFandocHtmlWriter',270336,'fandoc::HtmlDocWriter',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{'sys::NoDoc':""}).am$('err',8192,'compilerDoc::DocErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','compilerDoc::DocLoc',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('errReport',270336,'compilerDoc::DocErr',sys.List.make(sys.Param.type$,[new sys.Param('err','compilerDoc::DocErr',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DocLink.type$.af$('from',73730,'compilerDoc::Doc',{}).af$('target',73730,'compilerDoc::Doc',{}).af$('dis',73730,'sys::Str',{}).af$('frag',73730,'sys::Str?',{}).af$('absUri',73730,'sys::Uri?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('from','compilerDoc::Doc',false),new sys.Param('target','compilerDoc::Doc',false),new sys.Param('dis','sys::Str',true),new sys.Param('frag','sys::Str?',true)]),{}).am$('makeAbsUri',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('from','compilerDoc::Doc',false),new sys.Param('uri','sys::Uri',false),new sys.Param('dis','sys::Str',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
DocErr.type$.af$('loc',73730,'compilerDoc::DocLoc',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','compilerDoc::DocLoc',false),new sys.Param('cause','sys::Err?',true)]),{});
UnknownDocErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
DocErrHandler.type$.af$('errs',73728,'compilerDoc::DocErr[]',{}).am$('onErr',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','compilerDoc::DocErr',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DocTheme.type$.am$('writeStart',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','compilerDoc::DocRenderer',false)]),{}).am$('writeBreadcrumb',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','compilerDoc::DocRenderer',false)]),{}).am$('writeEnd',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','compilerDoc::DocRenderer',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DocSlot.type$.af$('loc',73730,'compilerDoc::DocLoc',{}).af$('parent',73730,'compilerDoc::DocTypeRef',{}).af$('name',73730,'sys::Str',{}).af$('qname',73730,'sys::Str',{}).af$('flags',73730,'sys::Int',{}).af$('doc',73730,'compilerDoc::DocFandoc',{}).af$('facets',73730,'compilerDoc::DocFacet[]',{}).af$('isNoDoc',73730,'sys::Bool',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('attrs','compilerDoc::DocAttrs',false),new sys.Param('parent','compilerDoc::DocTypeRef',false),new sys.Param('name','sys::Str',false)]),{}).am$('isField',270337,'sys::Bool',xp,{}).am$('isMethod',270337,'sys::Bool',xp,{}).am$('dis',8192,'sys::Str',xp,{}).am$('facet',8192,'compilerDoc::DocFacet?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('hasFacet',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false)]),{});
DocField.type$.af$('type',73730,'compilerDoc::DocTypeRef',{}).af$('init',73730,'sys::Str?',{}).af$('setterFlags',73730,'sys::Int?',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('attrs','compilerDoc::DocAttrs',false),new sys.Param('parent','compilerDoc::DocTypeRef',false),new sys.Param('name','sys::Str',false),new sys.Param('type','compilerDoc::DocTypeRef',false),new sys.Param('init','sys::Str?',false)]),{}).am$('isField',271360,'sys::Bool',xp,{}).am$('isMethod',271360,'sys::Bool',xp,{});
DocMethod.type$.af$('returns',73730,'compilerDoc::DocTypeRef',{}).af$('params',73730,'compilerDoc::DocParam[]',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('attrs','compilerDoc::DocAttrs',false),new sys.Param('parent','compilerDoc::DocTypeRef',false),new sys.Param('name','sys::Str',false),new sys.Param('returns','compilerDoc::DocTypeRef',false),new sys.Param('params','compilerDoc::DocParam[]',false)]),{}).am$('isField',271360,'sys::Bool',xp,{}).am$('isMethod',271360,'sys::Bool',xp,{});
DocParam.type$.af$('type',73730,'compilerDoc::DocTypeRef',{}).af$('name',73730,'sys::Str',{}).af$('def',73730,'sys::Str?',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','compilerDoc::DocTypeRef',false),new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Str?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
DocFlags.type$.af$('Abstract',106498,'sys::Int',{}).af$('Const',106498,'sys::Int',{}).af$('Ctor',106498,'sys::Int',{}).af$('Enum',106498,'sys::Int',{}).af$('Facet',106498,'sys::Int',{}).af$('Final',106498,'sys::Int',{}).af$('Getter',106498,'sys::Int',{}).af$('Internal',106498,'sys::Int',{}).af$('Mixin',106498,'sys::Int',{}).af$('Native',106498,'sys::Int',{}).af$('Override',106498,'sys::Int',{}).af$('Private',106498,'sys::Int',{}).af$('Protected',106498,'sys::Int',{}).af$('Public',106498,'sys::Int',{}).af$('Setter',106498,'sys::Int',{}).af$('Static',106498,'sys::Int',{}).af$('Storage',106498,'sys::Int',{}).af$('Synthetic',106498,'sys::Int',{}).af$('Virtual',106498,'sys::Int',{}).af$('Once',106498,'sys::Int',{}).af$('toNameMap',100354,'[sys::Int:sys::Str]',{}).af$('fromNameMap',100354,'[sys::Str:sys::Int]',{}).am$('isAbstract',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isConst',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isCtor',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isEnum',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isFacet',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isFinal',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isGetter',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isInternal',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isMixin',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isNative',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isOverride',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isPrivate',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isProtected',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isPublic',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isSetter',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isStatic',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isStorage',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isSynthetic',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isVirtual',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('isOnce',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('fromName',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('fromNames',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('names','sys::Str',false)]),{}).am$('toTypeDis',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::Int',false)]),{}).am$('toSlotDis',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::Int',false)]),{}).am$('toNames',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
Doc.type$.am$('space',270337,'compilerDoc::DocSpace',xp,{}).am$('docName',270337,'sys::Str',xp,{}).am$('title',270337,'sys::Str',xp,{}).am$('breadcrumb',270336,'sys::Str',xp,{}).am$('renderer',270337,'sys::Type',xp,{}).am$('isCode',270336,'sys::Bool',xp,{}).am$('isTopIndex',270336,'sys::Bool',xp,{}).am$('isSpaceIndex',270336,'sys::Bool',xp,{}).am$('onCrawl',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('crawler','compilerDoc::DocCrawler',false)]),{}).am$('heading',270336,'compilerDoc::DocHeading?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
DocType.type$.af$('pod',73730,'compilerDoc::DocPod',{}).af$('ref',73730,'compilerDoc::DocTypeRef',{}).af$('isNoDoc',73730,'sys::Bool',{}).af$('loc',73730,'compilerDoc::DocLoc',{}).af$('flags',73730,'sys::Int',{}).af$('facets',73730,'compilerDoc::DocFacet[]',{}).af$('doc',73730,'compilerDoc::DocFandoc',{}).af$('base',73730,'compilerDoc::DocTypeRef[]',{}).af$('mixins',73730,'compilerDoc::DocTypeRef[]',{}).af$('isErr',73730,'sys::Bool',{}).af$('slots',73730,'compilerDoc::DocSlot[]',{}).af$('declared',73730,'compilerDoc::DocSlot[]',{'sys::NoDoc':""}).af$('slotMap',67586,'[sys::Str:compilerDoc::DocSlot]',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pod','compilerDoc::DocPod',false),new sys.Param('attrs','compilerDoc::DocAttrs',false),new sys.Param('ref','compilerDoc::DocTypeRef',false),new sys.Param('list','compilerDoc::DocSlot[]',false),new sys.Param('slotMap','[sys::Str:compilerDoc::DocSlot]',false)]),{}).am$('name',8192,'sys::Str',xp,{}).am$('qname',8192,'sys::Str',xp,{}).am$('space',271360,'compilerDoc::DocSpace',xp,{}).am$('docName',271360,'sys::Str',xp,{}).am$('title',271360,'sys::Str',xp,{}).am$('renderer',271360,'sys::Type',xp,{}).am$('isCode',271360,'sys::Bool',xp,{}).am$('facet',8192,'compilerDoc::DocFacet?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('hasFacet',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false)]),{}).am$('slot',8192,'compilerDoc::DocSlot?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('isEnum',8192,'sys::Bool',xp,{}).am$('isMixin',8192,'sys::Bool',xp,{}).am$('isFacet',8192,'sys::Bool',xp,{}).am$('onCrawl',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('crawler','compilerDoc::DocCrawler',false)]),{}).am$('crawlTypeSummary',2048,'compilerDoc::DocFandoc',xp,{}).am$('crawlSlotSummary',2048,'compilerDoc::DocFandoc',sys.List.make(sys.Param.type$,[new sys.Param('slot','compilerDoc::DocSlot',false)]),{});
DocFacet.type$.af$('type',73730,'compilerDoc::DocTypeRef',{}).af$('fields',73730,'[sys::Str:sys::Str]',{}).af$('noFields',98434,'[sys::Str:sys::Str]',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','compilerDoc::DocTypeRef',false),new sys.Param('fields','[sys::Str:sys::Str]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
DocTypeRef.type$.am$('fromStr',40966,'compilerDoc::DocTypeRef?',sys.List.make(sys.Param.type$,[new sys.Param('sig','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('pod',270337,'sys::Str',xp,{}).am$('name',270337,'sys::Str',xp,{}).am$('qname',270337,'sys::Str',xp,{}).am$('signature',270337,'sys::Str',xp,{}).am$('dis',270337,'sys::Str',xp,{}).am$('isNullable',270337,'sys::Bool',xp,{}).am$('isGenericVar',270337,'sys::Bool',xp,{}).am$('isParameterized',270337,'sys::Bool',xp,{}).am$('v',270337,'compilerDoc::DocTypeRef?',xp,{'sys::NoDoc':""}).am$('k',270337,'compilerDoc::DocTypeRef?',xp,{'sys::NoDoc':""}).am$('funcParams',270337,'compilerDoc::DocTypeRef[]?',xp,{'sys::NoDoc':""}).am$('funcReturn',270337,'compilerDoc::DocTypeRef?',xp,{'sys::NoDoc':""}).am$('toStr',9216,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
BasicTypeRef.type$.af$('pod',336898,'sys::Str',{}).af$('name',336898,'sys::Str',{}).af$('qname',336898,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('colons','sys::Int',false)]),{}).am$('signature',271360,'sys::Str',xp,{}).am$('dis',271360,'sys::Str',xp,{}).am$('isNullable',271360,'sys::Bool',xp,{}).am$('isParameterized',271360,'sys::Bool',xp,{}).am$('isGenericVar',271360,'sys::Bool',xp,{}).am$('v',271360,'compilerDoc::DocTypeRef?',xp,{}).am$('k',271360,'compilerDoc::DocTypeRef?',xp,{}).am$('funcParams',271360,'compilerDoc::DocTypeRef[]?',xp,{}).am$('funcReturn',271360,'compilerDoc::DocTypeRef?',xp,{});
NullableTypeRef.type$.af$('base',73730,'compilerDoc::DocTypeRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('base','compilerDoc::DocTypeRef',false)]),{}).am$('pod',271360,'sys::Str',xp,{}).am$('name',271360,'sys::Str',xp,{}).am$('qname',271360,'sys::Str',xp,{}).am$('signature',271360,'sys::Str',xp,{}).am$('dis',271360,'sys::Str',xp,{}).am$('isNullable',271360,'sys::Bool',xp,{}).am$('isParameterized',271360,'sys::Bool',xp,{}).am$('isGenericVar',271360,'sys::Bool',xp,{}).am$('v',271360,'compilerDoc::DocTypeRef?',xp,{}).am$('k',271360,'compilerDoc::DocTypeRef?',xp,{}).am$('funcParams',271360,'compilerDoc::DocTypeRef[]?',xp,{}).am$('funcReturn',271360,'compilerDoc::DocTypeRef?',xp,{});
ListTypeRef.type$.af$('v',336898,'compilerDoc::DocTypeRef?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','compilerDoc::DocTypeRef',false)]),{}).am$('pod',271360,'sys::Str',xp,{}).am$('name',271360,'sys::Str',xp,{}).am$('qname',271360,'sys::Str',xp,{}).am$('signature',271360,'sys::Str',xp,{}).am$('dis',271360,'sys::Str',xp,{}).am$('isNullable',271360,'sys::Bool',xp,{}).am$('isParameterized',271360,'sys::Bool',xp,{}).am$('isGenericVar',271360,'sys::Bool',xp,{}).am$('k',271360,'compilerDoc::DocTypeRef?',xp,{}).am$('funcParams',271360,'compilerDoc::DocTypeRef[]?',xp,{}).am$('funcReturn',271360,'compilerDoc::DocTypeRef?',xp,{});
MapTypeRef.type$.af$('k',336898,'compilerDoc::DocTypeRef?',{}).af$('v',336898,'compilerDoc::DocTypeRef?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('k','compilerDoc::DocTypeRef',false),new sys.Param('v','compilerDoc::DocTypeRef',false)]),{}).am$('pod',271360,'sys::Str',xp,{}).am$('name',271360,'sys::Str',xp,{}).am$('qname',271360,'sys::Str',xp,{}).am$('signature',271360,'sys::Str',xp,{}).am$('dis',271360,'sys::Str',xp,{}).am$('isNullable',271360,'sys::Bool',xp,{}).am$('isParameterized',271360,'sys::Bool',xp,{}).am$('isGenericVar',271360,'sys::Bool',xp,{}).am$('funcParams',271360,'compilerDoc::DocTypeRef[]?',xp,{}).am$('funcReturn',271360,'compilerDoc::DocTypeRef?',xp,{});
FuncTypeRef.type$.af$('funcParams',336898,'compilerDoc::DocTypeRef[]?',{}).af$('funcReturn',336898,'compilerDoc::DocTypeRef?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','compilerDoc::DocTypeRef[]',false),new sys.Param('r','compilerDoc::DocTypeRef',false)]),{}).am$('pod',271360,'sys::Str',xp,{}).am$('name',271360,'sys::Str',xp,{}).am$('qname',271360,'sys::Str',xp,{}).am$('signature',271360,'sys::Str',xp,{}).am$('dis',271360,'sys::Str',xp,{}).am$('isNullable',271360,'sys::Bool',xp,{}).am$('isParameterized',271360,'sys::Bool',xp,{}).am$('isGenericVar',271360,'sys::Bool',xp,{}).am$('v',271360,'compilerDoc::DocTypeRef?',xp,{}).am$('k',271360,'compilerDoc::DocTypeRef?',xp,{});
DocTypeRefParser.type$.af$('sig',67584,'sys::Str',{}).af$('len',67584,'sys::Int',{}).af$('pos',67584,'sys::Int',{}).af$('cur',67584,'sys::Int',{}).af$('peek',67584,'sys::Int',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sig','sys::Str',false)]),{}).am$('parseTop',128,'compilerDoc::DocTypeRef',xp,{}).am$('parseAny',2048,'compilerDoc::DocTypeRef',xp,{}).am$('parseMap',2048,'compilerDoc::DocTypeRef',xp,{}).am$('parseFunc',2048,'compilerDoc::DocTypeRef',xp,{}).am$('parseBasic',2048,'compilerDoc::DocTypeRef',xp,{}).am$('consume',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expected','sys::Int?',true)]),{}).am$('isIdChar',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ch','sys::Int',false)]),{}).am$('err',2048,'sys::ParseErr',xp,{});
DocChapter.type$.af$('pod',73730,'compilerDoc::DocPod',{}).af$('name',73730,'sys::Str',{}).af$('qname',73730,'sys::Str',{}).af$('loc',73730,'compilerDoc::DocLoc',{}).af$('meta',73730,'[sys::Str:sys::Str]',{}).af$('doc',73730,'compilerDoc::DocFandoc',{}).af$('headings',73730,'compilerDoc::DocHeading[]',{}).af$('numRef',65666,'concurrent::AtomicInt',{}).af$('summaryRef',65666,'concurrent::AtomicRef',{}).af$('prevRef',65666,'concurrent::AtomicRef',{}).af$('nextRef',65666,'concurrent::AtomicRef',{}).af$('headingMap',67586,'[sys::Str:compilerDoc::DocHeading]',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loader','compilerDoc::DocPodLoader',false),new sys.Param('f','sys::File',false)]),{}).am$('buildHeadingsTree',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loader','compilerDoc::DocPodLoader',false),new sys.Param('fandoc','fandoc::Heading[]',false),new sys.Param('top','compilerDoc::DocHeading[]',false),new sys.Param('map','[sys::Str:compilerDoc::DocHeading]',false)]),{}).am$('docName',271360,'sys::Str',xp,{}).am$('space',271360,'compilerDoc::DocSpace',xp,{}).am$('title',271360,'sys::Str',xp,{}).am$('breadcrumb',271360,'sys::Str',xp,{}).am$('renderer',271360,'sys::Type',xp,{}).am$('isPodDoc',8192,'sys::Bool',xp,{}).am$('num',8192,'sys::Int',xp,{}).am$('summary',8192,'sys::Str',xp,{}).am$('prev',8192,'compilerDoc::DocChapter?',xp,{}).am$('next',8192,'compilerDoc::DocChapter?',xp,{}).am$('heading',271360,'compilerDoc::DocHeading?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('onCrawl',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('crawler','compilerDoc::DocCrawler',false)]),{});
DocHeading.type$.af$('level',73730,'sys::Int',{}).af$('title',73730,'sys::Str',{}).af$('anchorId',73730,'sys::Str?',{}).af$('childrenRef',65666,'concurrent::AtomicRef',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('children',8192,'compilerDoc::DocHeading[]',xp,{});
DocTopIndex.type$.af$('spaces',73730,'compilerDoc::DocSpace[]',{}).af$('title',336898,'sys::Str',{}).af$('renderer',336898,'sys::Type',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('pods',8192,'compilerDoc::DocPod[]',xp,{}).am$('space',271360,'compilerDoc::DocSpace',xp,{}).am$('docName',271360,'sys::Str',xp,{}).am$('isTopIndex',271360,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
DocRes.type$.af$('pod',73730,'compilerDoc::DocPod',{}).af$('uri',73730,'sys::Uri',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pod','compilerDoc::DocPod',false),new sys.Param('uri','sys::Uri',false)]),{}).am$('space',271360,'compilerDoc::DocSpace',xp,{}).am$('docName',271360,'sys::Str',xp,{}).am$('title',271360,'sys::Str',xp,{}).am$('renderer',271360,'sys::Type',xp,{});
DocSrc.type$.af$('pod',73730,'compilerDoc::DocPod',{}).af$('uri',73730,'sys::Uri',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pod','compilerDoc::DocPod',false),new sys.Param('uri','sys::Uri',false)]),{}).am$('space',271360,'compilerDoc::DocSpace',xp,{}).am$('docName',271360,'sys::Str',xp,{}).am$('title',271360,'sys::Str',xp,{}).am$('breadcrumb',271360,'sys::Str',xp,{}).am$('renderer',271360,'sys::Type',xp,{});
DocLoc.type$.af$('unknown',106498,'compilerDoc::DocLoc',{}).af$('file',73730,'sys::Str',{}).af$('line',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::Str',false),new sys.Param('line','sys::Int',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
DocFandoc.type$.af$('loc',73730,'compilerDoc::DocLoc',{}).af$('text',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','compilerDoc::DocLoc',false),new sys.Param('text','sys::Str',false)]),{}).am$('firstSentence',8192,'compilerDoc::DocFandoc',xp,{}).am$('firstSentenceStrBuf',8192,'sys::StrBuf',xp,{'sys::NoDoc':""});
DocSpace.type$.am$('spaceName',270337,'sys::Str',xp,{}).am$('breadcrumb',270336,'sys::Str',xp,{}).am$('doc',270337,'compilerDoc::Doc?',sys.List.make(sys.Param.type$,[new sys.Param('docName','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('eachDoc',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|compilerDoc::Doc->sys::Void|',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
DocPod.type$.af$('file',73730,'sys::File',{}).af$('name',73730,'sys::Str',{}).af$('version',73730,'sys::Version',{}).af$('summary',73730,'sys::Str',{}).af$('meta',73730,'[sys::Str:sys::Str]',{}).af$('index',73730,'compilerDoc::DocPodIndex',{}).af$('types',73730,'compilerDoc::DocType[]',{}).af$('typeMap',67586,'[sys::Str:compilerDoc::DocType]',{}).af$('podDoc',73730,'compilerDoc::DocChapter?',{}).af$('chapters',73730,'compilerDoc::DocChapter[]',{}).af$('chapterMap',67586,'[sys::Str:compilerDoc::DocChapter]',{}).af$('resList',73730,'compilerDoc::DocRes[]',{}).af$('resMap',67586,'[sys::Str:compilerDoc::DocRes]',{}).af$('srcList',73730,'compilerDoc::DocSrc[]',{}).af$('srcMap',67586,'[sys::Str:compilerDoc::DocSrc]',{}).am$('load',40962,'compilerDoc::DocPod',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv?',false),new sys.Param('file','sys::File',false)]),{}).am$('loadFile',40962,'compilerDoc::DocPod',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('onErr','|compilerDoc::DocErr->sys::Void|',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('onErr','|compilerDoc::DocErr->sys::Void|',false)]),{'sys::NoDoc':""}).am$('toStr',271360,'sys::Str',xp,{}).am$('allTypes',8192,'compilerDoc::DocType[]',xp,{}).am$('ts',8192,'sys::DateTime?',xp,{}).am$('type',8192,'compilerDoc::DocType?',sys.List.make(sys.Param.type$,[new sys.Param('typeName','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('isManual',8192,'sys::Bool',xp,{}).am$('chapter',8192,'compilerDoc::DocChapter?',sys.List.make(sys.Param.type$,[new sys.Param('chapterName','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('res',8192,'compilerDoc::DocRes?',sys.List.make(sys.Param.type$,[new sys.Param('filename','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('src',8192,'compilerDoc::DocSrc?',sys.List.make(sys.Param.type$,[new sys.Param('filename','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('spaceName',271360,'sys::Str',xp,{}).am$('doc',271360,'compilerDoc::Doc?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('eachDoc',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|compilerDoc::Doc->sys::Void|',false)]),{});
DocPodIndex.type$.af$('pod',73730,'compilerDoc::DocPod',{}).af$('toc',73730,'sys::Obj[]',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pod','compilerDoc::DocPod',false),new sys.Param('toc','sys::Obj[]',false)]),{}).am$('space',271360,'compilerDoc::DocSpace',xp,{}).am$('docName',271360,'sys::Str',xp,{}).am$('title',271360,'sys::Str',xp,{}).am$('isSpaceIndex',271360,'sys::Bool',xp,{}).am$('renderer',271360,'sys::Type',xp,{}).am$('onCrawl',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('crawler','compilerDoc::DocCrawler',false)]),{});
DocPodLoader.type$.af$('file',73728,'sys::File',{}).af$('pod',73728,'compilerDoc::DocPod',{}).af$('onErr',73728,'|compilerDoc::DocErr->sys::Void|',{}).af$('meta',73728,'[sys::Str:sys::Str]?',{}).af$('name',73728,'sys::Str?',{}).af$('summary',73728,'sys::Str?',{}).af$('version',73728,'sys::Version?',{}).af$('typeList',73728,'compilerDoc::DocType[]?',{}).af$('typeMap',73728,'[sys::Str:compilerDoc::DocType]?',{}).af$('chapterList',73728,'compilerDoc::DocChapter[]?',{}).af$('chapterMap',73728,'[sys::Str:compilerDoc::DocChapter]?',{}).af$('podDoc',73728,'compilerDoc::DocChapter?',{}).af$('resList',73728,'compilerDoc::DocRes[]?',{}).af$('resMap',73728,'[sys::Str:compilerDoc::DocRes]?',{}).af$('srcList',73728,'compilerDoc::DocSrc[]?',{}).af$('srcMap',73728,'[sys::Str:compilerDoc::DocSrc]?',{}).af$('toc',73728,'sys::Obj[]?',{}).af$('index',73728,'compilerDoc::DocPodIndex?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('pod','compilerDoc::DocPod',false),new sys.Param('onErr','|compilerDoc::DocErr->sys::Void|',false)]),{}).am$('loadMeta',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('zip','sys::Zip',false)]),{}).am$('getMeta',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('loadContent',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('zip','sys::Zip',false)]),{}).am$('finishTypes',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:compilerDoc::DocType]',false)]),{}).am$('finishChapters',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:compilerDoc::DocChapter]',false),new sys.Param('indexFog','sys::Obj[]?',false)]),{}).am$('finishResources',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uris','sys::Uri[]',false)]),{}).am$('finishSources',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uris','sys::Uri[]',false)]),{}).am$('finishIndex',2048,'sys::Void',xp,{}).am$('err',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','compilerDoc::DocLoc',false),new sys.Param('cause','sys::Err?',true)]),{});
DocRenderer.type$.af$('envRef',67584,'compilerDoc::DocEnv',{}).af$('outRef',67584,'web::WebOutStream',{}).af$('docRef',67584,'compilerDoc::Doc',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('out','web::WebOutStream',false),new sys.Param('doc','compilerDoc::Doc',false)]),{}).am$('env',270336,'compilerDoc::DocEnv',xp,{}).am$('out',270336,'web::WebOutStream',xp,{}).am$('doc',270336,'compilerDoc::Doc',xp,{}).am$('theme',270336,'compilerDoc::DocTheme',xp,{}).am$('writeDoc',270336,'sys::Void',xp,{}).am$('writeContent',270337,'sys::Void',xp,{}).am$('writeLink',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('link','compilerDoc::DocLink',false)]),{}).am$('writeLinkTo',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('target','compilerDoc::Doc',false),new sys.Param('dis','sys::Str?',true),new sys.Param('frag','sys::Str?',true)]),{}).am$('linkTo',8192,'compilerDoc::DocLink',sys.List.make(sys.Param.type$,[new sys.Param('target','compilerDoc::Doc',false),new sys.Param('dis','sys::Str?',true),new sys.Param('frag','sys::Str?',true)]),{}).am$('writeFandoc',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','compilerDoc::DocFandoc',false)]),{}).am$('toFandocElemLoc',2048,'compilerDoc::DocLoc',sys.List.make(sys.Param.type$,[new sys.Param('docLoc','compilerDoc::DocLoc',false),new sys.Param('line','sys::Int',false)]),{}).am$('onFandocLink',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::Link',false),new sys.Param('loc','compilerDoc::DocLoc',false)]),{'sys::NoDoc':""}).am$('onFandocImage',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::Image',false),new sys.Param('loc','compilerDoc::DocLoc',false)]),{'sys::NoDoc':""}).am$('resolveFandocLink',270336,'compilerDoc::DocLink?',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::Link',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('onFandocErr',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','sys::Err',false),new sys.Param('loc','compilerDoc::DocLoc',false)]),{'sys::NoDoc':""});
DocSrcRenderer.type$.af$('src',73730,'compilerDoc::DocSrc',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('out','web::WebOutStream',false),new sys.Param('doc','compilerDoc::DocSrc',false)]),{}).am$('writeContent',271360,'sys::Void',xp,{});
DocTypeRenderer.type$.af$('type',73730,'compilerDoc::DocType',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('out','web::WebOutStream',false),new sys.Param('doc','compilerDoc::DocType',false)]),{}).am$('writeContent',271360,'sys::Void',xp,{}).am$('writeTypeOverview',270336,'sys::Void',xp,{}).am$('writeTypeInheritance',270336,'sys::Void',xp,{}).am$('writeSlots',270336,'sys::Void',xp,{}).am$('writeSlot',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slot','compilerDoc::DocSlot',false)]),{}).am$('writeSlotSig',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slot','compilerDoc::DocSlot',false)]),{}).am$('writeSlotSigText',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slot','compilerDoc::DocSlot',false)]),{'sys::NoDoc':""}).am$('writeToc',270336,'sys::Void',xp,{}).am$('writeTypeRef',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ref','compilerDoc::DocTypeRef',false),new sys.Param('full','sys::Bool',true)]),{}).am$('writeFacet',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','compilerDoc::DocFacet',false)]),{}).am$('writeFacetText',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','compilerDoc::DocFacet',false)]),{'sys::NoDoc':""}).am$('toSrcLink',8192,'compilerDoc::DocLink?',sys.List.make(sys.Param.type$,[new sys.Param('loc','compilerDoc::DocLoc',false),new sys.Param('dis','sys::Str',false)]),{}).am$('writeSrcLink',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','compilerDoc::DocLoc',false),new sys.Param('dis','sys::Str',true)]),{});
DocPodIndexRenderer.type$.af$('index',73730,'compilerDoc::DocPodIndex',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('out','web::WebOutStream',false),new sys.Param('doc','compilerDoc::DocPodIndex',false)]),{}).am$('writeContent',271360,'sys::Void',xp,{}).am$('writeContentApi',270336,'sys::Void',xp,{}).am$('writeTypes',270336,'sys::Void',xp,{}).am$('writePodDocToc',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('headings','compilerDoc::DocHeading[]',false)]),{}).am$('writeContentManual',270336,'sys::Void',xp,{});
DocTopIndexRenderer.type$.af$('index',73730,'compilerDoc::DocTopIndex',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('out','web::WebOutStream',false),new sys.Param('doc','compilerDoc::DocTopIndex',false)]),{}).am$('writeContent',271360,'sys::Void',xp,{}).am$('writeManuals',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pods','compilerDoc::DocPod[]',false)]),{}).am$('writeApis',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pods','compilerDoc::DocPod[]',false)]),{});
DocChapterRenderer.type$.af$('chapter',73730,'compilerDoc::DocChapter',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('out','web::WebOutStream',false),new sys.Param('doc','compilerDoc::DocChapter',false)]),{}).am$('writeContent',271360,'sys::Void',xp,{}).am$('writeBody',270336,'sys::Void',xp,{}).am$('writeNav',270336,'sys::Void',xp,{}).am$('writeToc',270336,'sys::Void',xp,{});
DefaultDocEnv.type$.af$('actor',67586,'concurrent::Actor',{}).am$('space',271360,'compilerDoc::DocSpace?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('loadSpace',4096,'compilerDoc::DocSpace?',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('name','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DefaultDocEnvActor.type$.af$('env',73730,'compilerDoc::DefaultDocEnv',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DefaultDocEnv',false)]),{}).am$('receive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{});
ApiDocParser.type$.af$('in',67584,'sys::InStream',{}).af$('pod',67586,'compilerDoc::DocPod',{}).af$('cur',67584,'sys::Str',{}).af$('typeLoc',67584,'compilerDoc::DocLoc',{}).af$('typeRef',67584,'compilerDoc::DocTypeRef?',{}).af$('eof',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pod','compilerDoc::DocPod',false),new sys.Param('in','sys::InStream',false)]),{}).am$('parseType',8192,'compilerDoc::DocType',sys.List.make(sys.Param.type$,[new sys.Param('close','sys::Bool',true)]),{}).am$('parseSlot',2048,'compilerDoc::DocSlot?',xp,{}).am$('parseField',2048,'compilerDoc::DocField',xp,{}).am$('parseMethod',2048,'compilerDoc::DocMethod',xp,{}).am$('parseAttrs',2048,'compilerDoc::DocAttrs',xp,{}).am$('parseMeta',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('attrs','compilerDoc::DocAttrs',false)]),{}).am$('parseLoc',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('attrs','compilerDoc::DocAttrs',false),new sys.Param('val','sys::Str',false)]),{}).am$('parseTypeList',2048,'compilerDoc::DocTypeRef[]',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{}).am$('parseFacets',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('attrs','compilerDoc::DocAttrs',false)]),{}).am$('parseFacet',2048,'compilerDoc::DocFacet?',xp,{}).am$('parseDoc',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('attrs','compilerDoc::DocAttrs',false)]),{}).am$('consumeLine',2048,'sys::Void',xp,{});
DocAttrs.type$.af$('flags',73728,'sys::Int',{}).af$('loc',73728,'compilerDoc::DocLoc',{}).af$('docLoc',73728,'compilerDoc::DocLoc',{}).af$('setterFlags',73728,'sys::Int?',{}).af$('base',73728,'compilerDoc::DocTypeRef[]',{}).af$('mixins',73728,'compilerDoc::DocTypeRef[]',{}).af$('facets',73728,'compilerDoc::DocFacet[]',{}).af$('doc',73728,'compilerDoc::DocFandoc?',{}).am$('make',139268,'sys::Void',xp,{});
Main.type$.af$('all',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Generate docs for every installed pods\";}"}).af$('allCore',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Generation docs for Fantom core pods\";}"}).af$('pods',73728,'sys::Str[]',{'util::Arg':"util::Arg{help=\"Name of pods to compile (does not update index)\";}"}).af$('clean',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Delete outDir\";}"}).af$('outDir',73728,'sys::File',{'util::Opt':"util::Opt{help=\"Output dir for doc files\";}"}).af$('env',73728,'compilerDoc::DocEnv',{}).af$('spaces',73728,'compilerDoc::DocSpace[]',{}).am$('run',271360,'sys::Int',xp,{}).am$('writeTopIndex',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('doc','compilerDoc::DocTopIndex',false)]),{}).am$('writeSpace',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('space','compilerDoc::DocSpace',false)]),{}).am$('writeRes',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('dir','sys::File',false),new sys.Param('res','compilerDoc::DocRes',false)]),{}).am$('writeDoc',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('dir','sys::File',false),new sys.Param('doc','compilerDoc::Doc',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DocTypeRefTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('verifyBasic',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('t','compilerDoc::DocTypeRef',false),new sys.Param('pod','sys::Str',false),new sys.Param('name','sys::Str',false),new sys.Param('nullable','sys::Bool',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "compilerDoc");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;concurrent 1.0;fandoc 1.0;syntax 1.0;util 1.0;web 1.0");
m.set("pod.summary", "Compiler to model and generate API docs");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:22-05:00 New_York");
m.set("build.tsKey", "241210143122");
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
  DocCrawler,
  DocEnv,
  DocLink,
  DocErr,
  UnknownDocErr,
  DocErrHandler,
  DocTheme,
  DocSlot,
  DocField,
  DocMethod,
  DocParam,
  DocFlags,
  Doc,
  DocType,
  DocFacet,
  DocTypeRef,
  DocChapter,
  DocHeading,
  DocTopIndex,
  DocRes,
  DocSrc,
  DocLoc,
  DocFandoc,
  DocSpace,
  DocPod,
  DocPodIndex,
  DocRenderer,
  DocSrcRenderer,
  DocTypeRenderer,
  DocPodIndexRenderer,
  DocTopIndexRenderer,
  DocChapterRenderer,
  DefaultDocEnv,
  Main,
  DocTypeRefTest,
};
