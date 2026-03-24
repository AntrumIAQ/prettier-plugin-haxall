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
import * as axon from './axon.js'
import * as def from './def.js'
import * as folio from './folio.js'
import * as obs from './obs.js'
import * as hx from './hx.js'
import * as xml from './xml.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class XmlFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XmlFuncs.type$; }

  static xmlRead(handle) {
    const this$ = this;
    return sys.ObjUtil.coerce(hx.HxContext.curHx().rt().io().read(handle, (in$) => {
      return xml.XParser.make(in$).parseDoc().root();
    }), xml.XElem.type$);
  }

  static xmlName(node) {
    if (sys.ObjUtil.is(node, xml.XElem.type$)) {
      return sys.ObjUtil.coerce(node, xml.XElem.type$).name();
    }
    ;
    if (sys.ObjUtil.is(node, xml.XAttr.type$)) {
      return sys.ObjUtil.coerce(node, xml.XAttr.type$).name();
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("Not XElem or XAttr: ", sys.ObjUtil.typeof(node)));
  }

  static xmlQname(node) {
    if (sys.ObjUtil.is(node, xml.XElem.type$)) {
      return sys.ObjUtil.coerce(node, xml.XElem.type$).qname();
    }
    ;
    if (sys.ObjUtil.is(node, xml.XAttr.type$)) {
      return sys.ObjUtil.coerce(node, xml.XAttr.type$).qname();
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("Not XElem or XAttr: ", sys.ObjUtil.typeof(node)));
  }

  static xmlPrefix(node) {
    if (sys.ObjUtil.is(node, xml.XElem.type$)) {
      return sys.ObjUtil.coerce(node, xml.XElem.type$).prefix();
    }
    ;
    if (sys.ObjUtil.is(node, xml.XAttr.type$)) {
      return sys.ObjUtil.coerce(node, xml.XAttr.type$).prefix();
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("Not XElem or XAttr: ", sys.ObjUtil.typeof(node)));
  }

  static xmlNs(node) {
    if (sys.ObjUtil.is(node, xml.XElem.type$)) {
      return ((this$) => { let $_u0=sys.ObjUtil.coerce(node, xml.XElem.type$).ns(); return ($_u0==null) ? null : $_u0.uri(); })(this);
    }
    ;
    if (sys.ObjUtil.is(node, xml.XAttr.type$)) {
      return ((this$) => { let $_u1=sys.ObjUtil.coerce(node, xml.XAttr.type$).ns(); return ($_u1==null) ? null : $_u1.uri(); })(this);
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("Not XElem or XAttr: ", sys.ObjUtil.typeof(node)));
  }

  static xmlVal(node) {
    if (node == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.is(node, xml.XAttr.type$)) {
      return sys.ObjUtil.coerce(node, xml.XAttr.type$).val();
    }
    ;
    if (sys.ObjUtil.is(node, xml.XElem.type$)) {
      return ((this$) => { let $_u2=sys.ObjUtil.coerce(node, xml.XElem.type$).text(); return ($_u2==null) ? null : $_u2.val(); })(this);
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("Not XElem or XAttr: ", sys.ObjUtil.typeof(node)));
  }

  static xmlAttr(elem,name,checked) {
    if (checked === undefined) checked = true;
    return elem.attr(name, checked);
  }

  static xmlAttrs(elem) {
    return elem.attrs();
  }

  static xmlElem(elem,name,checked) {
    if (checked === undefined) checked = true;
    return elem.elem(name, checked);
  }

  static xmlElems(elem) {
    return elem.elems();
  }

  static make() {
    const $self = new XmlFuncs();
    XmlFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class XmlLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XmlLib.type$; }

  static make() {
    const $self = new XmlLib();
    XmlLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    return;
  }

}

class XmlTest extends hx.HxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XmlTest.type$; }

  test() {
    const this$ = this;
    this.addLib("xml");
    let $xml = "<foo/>";
    this.verifyXml($xml, "xmlName", "foo");
    this.verifyXml($xml, "xmlPrefix", null);
    this.verifyXml($xml, "xmlVal", null);
    this.verifyXml($xml, "xmlAttrs", sys.List.make(xml.XAttr.type$));
    this.verifyXml($xml, "xmlElems", sys.List.make(xml.XElem.type$));
    this.verifyXml($xml, "xmlAttr(\"x\", false)", null);
    this.verifyErr(axon.EvalErr.type$, (it) => {
      this$.verifyXml("<foo/>", "xmlAttr(\"x\")", null);
      return;
    });
    ($xml = "<doc xmlns='http://def/' xmlns:q='http://q/'>\n  <a x='x-val' q:y='y-val'/>\n  <q:b>some text</q:b>\n</doc>");
    this.verifyXml($xml, "xmlElems.map(xmlName)", sys.List.make(sys.Obj.type$.toNullable(), ["a", "b"]));
    this.verifyXml($xml, "xmlElem(\"a\").xmlName", "a");
    this.verifyXml($xml, "xmlElem(\"a\").xmlQname", "a");
    this.verifyXml($xml, "xmlElem(\"a\").xmlPrefix", "");
    this.verifyXml($xml, "xmlElem(\"a\").xmlNs", sys.Uri.fromStr("http://def/"));
    this.verifyXml($xml, "xmlElem(\"a\").xmlVal", null);
    this.verifyXml($xml, "xmlElem(\"b\").xmlName", "b");
    this.verifyXml($xml, "xmlElem(\"b\").xmlQname", "q:b");
    this.verifyXml($xml, "xmlElem(\"b\").xmlPrefix", "q");
    this.verifyXml($xml, "xmlElem(\"b\").xmlNs", sys.Uri.fromStr("http://q/"));
    this.verifyXml($xml, "xmlElem(\"b\").xmlVal", "some text");
    this.verifyXml($xml, "xmlElem(\"a\").xmlAttrs.map(xmlName)", sys.List.make(sys.Obj.type$.toNullable(), ["x", "y"]));
    this.verifyXml($xml, "xmlElem(\"a\").xmlAttr(\"x\").xmlName", "x");
    this.verifyXml($xml, "xmlElem(\"a\").xmlAttr(\"x\").xmlQname", "x");
    this.verifyXml($xml, "xmlElem(\"a\").xmlAttr(\"x\").xmlPrefix", null);
    this.verifyXml($xml, "xmlElem(\"a\").xmlAttr(\"x\").xmlNs", null);
    this.verifyXml($xml, "xmlElem(\"a\").xmlAttr(\"x\").xmlVal", "x-val");
    this.verifyXml($xml, "xmlElem(\"a\").xmlAttr(\"y\").xmlName", "y");
    this.verifyXml($xml, "xmlElem(\"a\").xmlAttr(\"y\").xmlQname", "q:y");
    this.verifyXml($xml, "xmlElem(\"a\").xmlAttr(\"y\").xmlPrefix", "q");
    this.verifyXml($xml, "xmlElem(\"a\").xmlAttr(\"y\").xmlNs", sys.Uri.fromStr("http://q/"));
    this.verifyXml($xml, "xmlElem(\"a\").xmlAttr(\"y\").xmlVal", "y-val");
    return;
  }

  verifyXml($xml,expr,expected) {
    let actual = this.eval(sys.Str.plus(sys.Str.plus(sys.Str.plus("xmlRead(", sys.Str.toCode($xml)), ")."), expr));
    this.verifyEq(expected, actual);
    return;
  }

  static make() {
    const $self = new XmlTest();
    XmlTest.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxTest.make$($self);
    return;
  }

}

const p = sys.Pod.add$('hxXml');
const xp = sys.Param.noParams$();
let m;
XmlFuncs.type$ = p.at$('XmlFuncs','sys::Obj',[],{},8194,XmlFuncs);
XmlLib.type$ = p.at$('XmlLib','hx::HxLib',[],{},8194,XmlLib);
XmlTest.type$ = p.at$('XmlTest','hx::HxTest',[],{},8192,XmlTest);
XmlFuncs.type$.am$('xmlRead',40962,'xml::XElem',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('xmlName',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('node','sys::Obj',false)]),{'axon::Axon':""}).am$('xmlQname',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('node','sys::Obj',false)]),{'axon::Axon':""}).am$('xmlPrefix',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('node','sys::Obj',false)]),{'axon::Axon':""}).am$('xmlNs',40962,'sys::Uri?',sys.List.make(sys.Param.type$,[new sys.Param('node','sys::Obj',false)]),{'axon::Axon':""}).am$('xmlVal',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('node','sys::Obj?',false)]),{'axon::Axon':""}).am$('xmlAttr',40962,'xml::XAttr?',sys.List.make(sys.Param.type$,[new sys.Param('elem','xml::XElem',false),new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('xmlAttrs',40962,'xml::XAttr[]',sys.List.make(sys.Param.type$,[new sys.Param('elem','xml::XElem',false)]),{'axon::Axon':""}).am$('xmlElem',40962,'xml::XElem?',sys.List.make(sys.Param.type$,[new sys.Param('elem','xml::XElem',false),new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('xmlElems',40962,'xml::XElem[]',sys.List.make(sys.Param.type$,[new sys.Param('elem','xml::XElem',false)]),{'axon::Axon':""}).am$('make',139268,'sys::Void',xp,{});
XmlLib.type$.am$('make',139268,'sys::Void',xp,{});
XmlTest.type$.am$('test',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('verifyXml',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('xml','sys::Str',false),new sys.Param('expr','sys::Str',false),new sys.Param('expected','sys::Obj?',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxXml");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;xml 1.0;axon 3.1.11;haystack 3.1.11;hx 3.1.11");
m.set("pod.summary", "XML function library");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:27-05:00 New_York");
m.set("build.tsKey", "241210143127");
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
  XmlFuncs,
  XmlLib,
  XmlTest,
};
