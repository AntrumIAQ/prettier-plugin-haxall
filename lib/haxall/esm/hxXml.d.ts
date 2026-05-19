import * as sys from './sys.js';
import * as xml from './xml.js';
import * as axon from './axon.js';
import * as haystack from './haystack.js';
import * as hx from './hx.js';

/**
 * XML function library
 */
export class XmlLib extends hx.HxLib {
  static type$: sys.Type
  static make(...args: unknown[]): XmlLib;
}

/**
 * XML Axon functions
 */
export class XmlFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Get the unqualified local name of an element or attribute:
   * ```
   * <foo>    >>  "foo"
   * <x:foo>  >>  "foo"
   * ```
   */
  static xmlName(node: sys.JsObj): string;
  /**
   * Get list of all an elements attributes.
   * 
   * Example:
   * ```
   * attrs: xmlRead("<x a='' b=''/>").xmlAttrs
   * attrs.map(xmlName)  >>  ["a", "b"]
   * ```
   */
  static xmlAttrs(elem: xml.XElem): sys.List<xml.XAttr>;
  /**
   * Get the namespace prefix of an element or attribute. If node
   * is an element in the default namespace then return "".  If
   * no namespace is specified return null.
   * 
   * Examples:
   * ```
   * <foo>               >>  null
   * <x:foo>             >>  "x"
   * <foo xmlns='...'/>  >>  ""
   * ```
   */
  static xmlPrefix(node: sys.JsObj): string | null;
  /**
   * Parse an XML document from an I/O handle and return root
   * element.
   * 
   * Examples:
   * ```
   * xmlRead("<foo/>")
   * xmlRead(`io/test.xml`)
   * ```
   */
  static xmlRead(handle: sys.JsObj | null): xml.XElem;
  /**
   * Get the qualified local name of an element or attribute
   * which includes both its prefix and unqualified name:
   * ```
   * <foo>    >>  "foo"
   * <x:foo>  >>  "x:foo"
   * ```
   */
  static xmlQname(node: sys.JsObj): string;
  /**
   * Get the namespace URI of an element or attribute. If no
   * namespace was specified return null.
   * 
   * Example:
   * ```
   * xmlRead("<foo xmlns='bar'/>").xmlNs  >>  `bar`
   * ```
   */
  static xmlNs(node: sys.JsObj): sys.Uri | null;
  /**
   * Get the children elements. If this element contains text or
   * PI nodes, then they are excluded in the result.
   * 
   * Example:
   * ```
   * elems: xmlRead("<d><a/><b/></d>").xmlElems
   * elems.map(xmlName)  >>  ["a", "b"]
   * ```
   */
  static xmlElems(elem: xml.XElem): sys.List<xml.XElem>;
  /**
   * Get an attribute from an element by its non-qualified local
   * name. If the attribute is not found and checked is false
   * then return null otherwise throw XErr.
   * 
   * Examples:
   * ```
   * xmlRead("<x a='v'/>").xmlAttr("a").xmlVal   >>  "v"
   * xmlRead("<x/>").xmlAttr("a", false).xmlVal  >>  null
   * ```
   */
  static xmlAttr(elem: xml.XElem, name: string, checked?: boolean): xml.XAttr | null;
  /**
   * Find an element by its non-qualified local name. If there
   * are multiple child elements with the name, then the first
   * one is returned. If the element is not found and checked is
   * false then return null otherwise throw XErr.
   * 
   * Example:
   * ```
   * xmlRead("<d><a/></d>").xmlElem("a")
   * ```
   */
  static xmlElem(elem: xml.XElem, name: string, checked?: boolean): xml.XElem | null;
  /**
   * If node is an attribute, then return its value string. If
   * node is an element return its first text child node,
   * otherwise null.  If node is null, then return null.
   * 
   * Examples:
   * ```
   * xmlRead("<x/>").xmlVal                      >>  null
   * xmlRead("<x>hi</x>").xmlVal                 >>  "hi"
   * xmlRead("<x a='v'/>").xmlAttr("a").xmlVal   >>  "v"
   * xmlRead("<x/>").xmlAttr("a", false).xmlVal  >>  null
   * ```
   */
  static xmlVal(node: sys.JsObj | null): string | null;
  static make(...args: unknown[]): XmlFuncs;
}

/**
 * XML test suite
 */
export class XmlTest extends hx.HxTest {
  static type$: sys.Type
  test(): void;
  verifyXml($xml: string, expr: string, expected: sys.JsObj | null): void;
  static make(...args: unknown[]): XmlTest;
}

