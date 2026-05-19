import * as sys from './sys.js';

/**
 * ParserTest
 */
export class ParserTest extends XmlTest {
  static type$: sys.Type
  testNs(): void;
  testNsAttr(): void;
  testCdata(): void;
  testNestedDefaultNs(): void;
  testPi(): void;
  static make(...args: unknown[]): ParserTest;
  testElem(): void;
  testXmlAttr(): void;
  testDocType(): void;
  testMixed(): void;
  verifyParse(xml: string, expected: XDoc): XDoc;
  testAttr(): void;
}

/**
 * ParserErrTest verifies docs not well formed
 */
export class ParserErrTest extends XmlTest {
  static type$: sys.Type
  testNs(): void;
  verifyXErr(xml: string, line: number, col: number): void;
  testBadStarts(): void;
  verifyXIncompleteErr(xml: string): void;
  static make(...args: unknown[]): ParserErrTest;
  testElems(): void;
  testAttrs(): void;
}

/**
 * Models a XML Namespace uri.  It also defines a prefix to use
 * to qualify element and attribute names.  XNs instances are
 * passed to the constructor of {@link XElem | XElem} and {@link XAttr | XAttr}.
 * You can define the namespace attribute via {@link XAttr.makeNs | XAttr.makeNs}.
 */
export class XNs extends sys.Obj {
  static type$: sys.Type
  /**
   * The prefix used to quality element and attribute names with
   * this namespace's uri.  If this is the default namespace
   * prefix is "".
   */
  prefix(): string;
  /**
   * The uri which defines a universally unique namespace.
   */
  uri(): sys.Uri;
  /**
   * Return the uri as the string representation.
   */
  toStr(): string;
  /**
   * Return if this a default namespace which has a prefix of "".
   */
  isDefault(): boolean;
  /**
   * Two namespaces are equal if they have the same uri.
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Construct an XML namespace with the specified prefix and
   * Uri. Pass "" for prefix if this is the default XML
   * namespace.
   */
  static make(prefix: string, uri: sys.Uri, ...args: unknown[]): XNs;
  /**
   * Return the uri's hash code.
   */
  hash(): number;
}

/**
 * Incomplete document exception indicates that the end of
 * stream was reached before the end of the document was
 * parsed.
 */
export class XIncompleteErr extends XErr {
  static type$: sys.Type
  /**
   * Construct with optional message, line number, and root
   * cause.
   */
  static make(message?: string | null, line?: number, col?: number, cause?: sys.Err | null, ...args: unknown[]): XIncompleteErr;
}

/**
 * XText represents the character data inside an element.
 */
export class XText extends XNode {
  static type$: sys.Type
  /**
   * Character data for this text node.  If this text is to be
   * written as a CDATA section, then this value must not contain
   * the "]]>" substring.
   */
  val(): string;
  val(it: string): void;
  /**
   * If true then this text node was read/will be written as a
   * CDATA section.  If set to true, then {@link val | val} must
   * not contain the "]]>" substring.
   */
  cdata(): boolean;
  cdata(it: boolean): void;
  /**
   * Return the string value (truncated if it is long).
   */
  toStr(): string;
  /**
   * Return the {@link XNodeType.text | XNodeType.text}.
   */
  nodeType(): XNodeType;
  /**
   * Make a copy of this text node.
   */
  copy(): this;
  /**
   * Construct a text node with the specified value.
   */
  static make(val: string, ...args: unknown[]): XText;
  /**
   * Write this node to the output stream.  If this node is set
   * to be written as a CDATA section and the {@link val | val}
   * string contains the "]]>" substring then throw IOErr.
   */
  write(out: sys.OutStream): void;
}

/**
 * Pull parsing testing
 */
export class PullTest extends XmlTest {
  static type$: sys.Type
  static empty(): sys.List<XElem>;
  static text(): XNodeType;
  parser(): XParser | null;
  parser(it: XParser | null): void;
  static end(): XNodeType;
  static start(): XNodeType;
  static pi(): XNodeType;
  testPi(): void;
  init(src: string): void;
  testMixed(): void;
  testAttrs(): void;
  testNs(): void;
  testSkipAndMem(): void;
  dump(): void;
  static make(...args: unknown[]): PullTest;
  testElems(): void;
  verifyNext(t: XNodeType | null, depth: number, stack: sys.List<XElem>, cur?: XNode | null): void;
  testDoc(): void;
}

/**
 * DomTest tests the tree model data structures
 */
export class DomTest extends sys.Test {
  static type$: sys.Type
  testNsAttr(): void;
  testChildren(): void;
  testNsIdentity(): void;
  static make(...args: unknown[]): DomTest;
  testDoc(): void;
  testAttrs(): void;
  testNsElem(): void;
}

/**
 * WriteTest
 */
export class WriteTest extends XmlTest {
  static type$: sys.Type
  testNs(): void;
  testWrites(): void;
  verifyWrite(xml: XNode, expected: string, testRoundtrip?: boolean): void;
  testCdata(): void;
  static make(...args: unknown[]): WriteTest;
  testDoc(): void;
  testEsc(): void;
}

/**
 * XML processing instruction node.
 */
export class XPi extends XNode {
  static type$: sys.Type
  /**
   * String value of processing instruction.  This value must not
   * contain the "?>".
   */
  val(): string;
  val(it: string): void;
  /**
   * Target name for the processing instruction.  It must be a
   * valid XML name production.
   */
  target(): string;
  target(it: string): void;
  /**
   * Return string representation of this processing instruction.
   */
  toStr(): string;
  /**
   * Return the {@link XNodeType.pi | XNodeType.pi}.
   */
  nodeType(): XNodeType;
  /**
   * Construct a processing instruction with specified target and
   * val.
   */
  static make(target: string, val: string, ...args: unknown[]): XPi;
  /**
   * Write this node to the output stream.
   */
  write(out: sys.OutStream): void;
}

/**
 * Enumerates the type of {@link XNode | XNode} and current node
 * of {@link XParser | XParser}.
 */
export class XNodeType extends sys.Enum {
  static type$: sys.Type
  /**
   * Element node type returned by {@link XElem.nodeType | XElem.nodeType}
   */
  static elem(): XNodeType;
  /**
   * List of XNodeType values indexed by ordinal
   */
  static vals(): sys.List<XNodeType>;
  /**
   * End of element used by XParser when pull parsing.
   */
  static elemEnd(): XNodeType;
  /**
   * Start of element used by XParser when pull parsing.
   */
  static elemStart(): XNodeType;
  /**
   * Document node type by {@link XDoc.nodeType | XDoc.nodeType}
   */
  static doc(): XNodeType;
  /**
   * Processing instruction node type returned by {@link XPi.nodeType | XPi.nodeType}
   */
  static pi(): XNodeType;
  /**
   * Text node type returned by {@link XText.nodeType | XText.nodeType}
   */
  static text(): XNodeType;
  /**
   * Return the XNodeType instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): XNodeType;
}

/**
 * XNode is the base class for {@link XElem | XElem} and {@link XText | XText}.
 */
export class XNode extends sys.Obj {
  static type$: sys.Type
  /**
   * Get the parent of this node or null if unmounted.
   */
  parent(): XNode | null;
  parent(it: XNode | null): void;
  /**
   * Return the node type enum.  Note that XElem always returns `elem`,
   * but that during pull parsing XParser will return `elemStart`
   * and `elemEnd`.
   */
  nodeType(): XNodeType;
  /**
   * Conveniece to {@link write | write} to an in-memory string.
   */
  writeToStr(): string;
  /**
   * Get the root document node or null if this node is not
   * mounted under a XDoc instance.
   */
  doc(): XDoc | null;
  /**
   * Write this node to the output stream.
   */
  write(out: sys.OutStream): void;
  static make(...args: unknown[]): XNode;
}

/**
 * XML document type declaration (but not the whole DTD).
 */
export class XDocType extends sys.Obj {
  static type$: sys.Type
  /**
   * System ID of an external DTD or null.
   */
  systemId(): sys.Uri | null;
  systemId(it: sys.Uri | null): void;
  /**
   * Element name of of the  document.
   */
  rootElem(): string;
  rootElem(it: string): void;
  /**
   * Public ID of an external DTD or null.
   */
  publicId(): string | null;
  publicId(it: string | null): void;
  /**
   * Return string representation of this processing instruction.
   */
  toStr(): string;
  static make(...args: unknown[]): XDocType;
}

/**
 * XAttr models an XML attribute in an element.  Attributes are
 * immutable and may be shared across multiple XElem parents.
 */
export class XAttr extends sys.Obj {
  static type$: sys.Type
  /**
   * Value of the attribute.
   */
  val(): string;
  /**
   * The XML namespace which qualified this attribute's name. If
   * the attribute name is unqualified return null.
   */
  ns(): XNs | null;
  /**
   * Unqualified local name of the attribute.  If an XML
   * namespace prefix was specified, then this is everything
   * after the colon:
   * ```
   * foo='val'   =>  foo
   * x:foo='val' =>  foo
   * ```
   * 
   * Note that attributes which start with "xml:" and "xmlns:"
   * are not treated as a namespace:
   * ```
   * xml:lang='en' => xml:lang
   * XML:lang='en' => xml:lang
   * ```
   */
  name(): string;
  /**
   * Return this attribute name/value pair as string.
   */
  toStr(): string;
  /**
   * If this attribute is qualified by an XML namespace then
   * return the namespace's prefix.  Otherwise return null. Note
   * an attribute can never be qualified by the default
   * namespace.
   */
  prefix(): string | null;
  /**
   * If this element is qualified by an XML namespace then return
   * the namespace's uri.  Otherwise return null.
   */
  uri(): sys.Uri | null;
  /**
   * Qualified name of the attribute.  This is the full name
   * including the XML namespace prefix:
   * ```
   * foo='val'   =>  foo
   * x:foo='val' =>  x:foo
   * ```
   */
  qname(): string;
  /**
   * Construct an attribute which defines a namespace with
   * "xmlns:<prefix>" name and uri value.  If prefix is "" then
   * construct the default namespace attribute named "xmlns".
   */
  static makeNs(ns: XNs, ...args: unknown[]): XAttr;
  /**
   * Construct an element with unqualified local name, value, and
   * optional XML namespace.  The XNs instance should be defined
   * as an attribute on an ancestor element.  Throw ArgErr if an
   * attempt is made to qualify the attribute by the default
   * namespace with prefix of "".
   */
  static make(name: string, val: string, ns?: XNs | null, ...args: unknown[]): XAttr;
  /**
   * Write this attribute to the output stream.
   */
  write(out: sys.OutStream): void;
}

/**
 * XParser is a simple, lightweight XML parser.  It may be used
 * as a pull parser by iterating through the element and text
 * sections of an XML stream or it may be used to read an
 * entire XML tree into memory as XElems.
 */
export class XParser extends sys.Obj {
  static type$: sys.Type
  /**
   * Current one based column number.
   */
  col(): number;
  col(it: number): void;
  /**
   * Get the current node type constant which is always the
   * result of the last call to {@link next | next}.  Node type
   * will be:
   * - {@link XNodeType.elemStart | XNodeType.elemStart}
   * - {@link XNodeType.elemEnd | XNodeType.elemEnd}
   * - {@link XNodeType.text | XNodeType.text}
   * - {@link XNodeType.pi | XNodeType.pi}
   * - null indicates end of stream
   */
  nodeType(): XNodeType | null;
  nodeType(it: XNodeType | null): void;
  /**
   * Get the root document node.
   */
  doc(): XDoc;
  doc(it: XDoc): void;
  /**
   * Current one based line number.
   */
  line(): number;
  line(it: number): void;
  /**
   * Get the depth of the current element with the document. A
   * depth of zero indicates the root element.  A depth of -1
   * indicates a position before or after the root element.
   */
  depth(): number;
  depth(it: number): void;
  /**
   * If the current type is `text` the XText instance used to store
   * the character data.  After a call to {@link next | next} this
   * XText instance is no longer valid and will be reused for
   * further processing.  If the current type is not `text` then
   * return null.
   */
  text(): XText | null;
  /**
   * Get the current element if {@link nodeType | nodeType} is `elemStart`
   * or `elemEnd`.  If {@link nodeType | nodeType} is `text` or `pi`
   * then this is the parent element.  After `elemEnd` this XElem
   * instance is no longer valid and will be reused for further
   * processing.  If depth is -1 return null.
   */
  elem(): XElem | null;
  /**
   * Advance the parser to the next node and return the node
   * type. Return the current node type:
   * - {@link XNodeType.elemStart | XNodeType.elemStart}
   * - {@link XNodeType.elemEnd | XNodeType.elemEnd}
   * - {@link XNodeType.text | XNodeType.text}
   * - {@link XNodeType.pi | XNodeType.pi}
   * - null indicates end of stream Also see {@link nodeType | nodeType}.
   */
  next(): XNodeType | null;
  /**
   * Parse the entire document into memory as a tree of XElems
   * and optionally close the underlying input stream.
   */
  parseDoc(close?: boolean): XDoc;
  /**
   * Skip parses all the content until reaching the end tag of
   * the specified depth.  When this method returns, the next
   * call to {@link next | next} will return the node immediately
   * following the end tag.
   */
  skip(toDepth?: number): void;
  /**
   * Parse the current element entirely into memory as a tree of
   * XElems and optionally close the underlying input stream.
   */
  parseElem(close?: boolean): XElem;
  /**
   * Get the element at the specified depth.  Depth must be
   * between 0 and {@link depth | depth} inclusively.  Calling `elemAt(0)`
   * will return the root element and `elemAt(depth)` returns the
   * current element. If depth is invalid IndexErr is thrown.
   */
  elemAt(depth: number): XElem;
  /**
   * Construct input stream to read.
   */
  static make(in$: sys.InStream, ...args: unknown[]): XParser;
  /**
   * Close the underlying input stream.  Return true if the
   * stream was closed successfully or false if the stream was
   * closed abnormally.
   */
  close(): boolean;
  /**
   * if the current node type is `pi` return the XPi instance
   * otherwise return null.
   */
  pi(): XPi | null;
}

/**
 * XML exception.
 */
export class XErr extends sys.Err {
  static type$: sys.Type
  /**
   * Column number of XML error or zero if unknown.
   */
  col(): number;
  /**
   * Line number of XML error or zero if unknown.
   */
  line(): number;
  /**
   * String representation.
   */
  toStr(): string;
  /**
   * Construct with optional message, line number, and root
   * cause.
   */
  static make(message?: string | null, line?: number, col?: number, cause?: sys.Err | null, ...args: unknown[]): XErr;
}

/**
 * XML document encapsulates the root element and document
 * type.
 */
export class XDoc extends XNode {
  static type$: sys.Type
  /**
   * Root element.
   */
  root(): XElem;
  root(it: XElem): void;
  /**
   * Document type declaration or null if undefined.
   */
  docType(): XDocType | null;
  docType(it: XDocType | null): void;
  /**
   * Get any processing instructions declared before the root
   * element.  Processing instructions after the root are not
   * supported.
   */
  pis(): sys.List<XNode>;
  /**
   * Construct with optional root elem.
   */
  static make(root?: XElem | null, ...args: unknown[]): XDoc;
  /**
   * Write this node to the output stream.
   */
  write(out: sys.OutStream): void;
  /**
   * Return string representation.
   */
  toStr(): string;
  /**
   * Add a node to the document.  If the node is an XElem then it
   * is defined as the {@link root | root} element, otherwise the
   * child must be a {@link XPi | XPi}.  Return this.
   */
  add(child: sys.JsObj): this;
  /**
   * Return the {@link XNodeType.doc | XNodeType.doc}.
   */
  nodeType(): XNodeType;
  /**
   * Remove the processing instruction by reference.
   */
  removePi(pi: XPi): XPi | null;
}

/**
 * Models an XML element: its name, attributes, and children
 * nodes.
 */
export class XElem extends XNode {
  static type$: sys.Type
  /**
   * The XML namespace which qualified this element's name. If
   * the element name is unqualified return null.
   */
  ns(): XNs | null;
  ns(it: XNs | null): void;
  /**
   * Line number of XML element in source file or zero if
   * unknown.
   */
  line(): number;
  line(it: number): void;
  /**
   * Unqualified local name of the element.  If an XML namespace
   * prefix was specified, then this is everything after the
   * colon:
   * ```
   * <foo>    =>  foo
   * <x:foo>  =>  foo
   * ```
   */
  name(): string;
  name(it: string): void;
  /**
   * Remove the attribute at the specified index into {@link attrs | attrs}.
   * Return the removed attribute.
   */
  removeAttrAt(index: number): XAttr;
  /**
   * Get the children elements.  If this element contains text or
   * PI nodes, then they are excluded in the result.
   */
  elems(): sys.List<XElem>;
  /**
   * If this element is qualified by an XML namespace then return
   * the namespace's prefix.  Otherwise return null.  If the
   * namespace is the default namespace then prefix is "".
   */
  prefix(): string | null;
  /**
   * Iterate each attribute in the {@link attrs | attrs} list.
   */
  eachAttr(f: ((arg0: XAttr, arg1: number) => void)): void;
  /**
   * Remove the child element, text, or PI from this element. The
   * child is matched by reference, so you must pass in the same
   * XNode contained by this element.  Return the removed node or
   * null if no match.
   */
  remove(child: XNode): XNode | null;
  /**
   * Get this element's children elements, text, and PIs as a
   * readonly list.
   */
  children(): sys.List<XNode>;
  /**
   * Qualified name of the element.  This is the full name
   * including the XML namespace prefix:
   * ```
   * <foo>    =>  foo
   * <x:foo>  =>  x:foo
   * ```
   */
  qname(): string;
  /**
   * Get an attribute value by its non-qualified local name. If
   * the attribute is not found and checked is false then return
   * null otherwise throw XErr.
   */
  get(name: string, checked?: boolean): string | null;
  /**
   * Return this element's child text node.  If this element
   * contains multiple text nodes then return the first one.  If
   * this element does not contain a text node return null.
   */
  text(): XText | null;
  /**
   * Make a shallow copy of this element.
   */
  copy(): this;
  /**
   * Get an attribute by its non-qualified local name.  If the
   * attribute is not found and checked is false then return null
   * otherwise throw XErr.
   */
  attr(name: string, checked?: boolean): XAttr | null;
  /**
   * Construct an element with unqualified local name and
   * optional XML namespace.  The XNs instance should be defined
   * as an attribute on this or an ancestor element (see {@link XAttr.makeNs | XAttr.makeNs}).
   */
  static make(name: string, ns?: XNs | null, ...args: unknown[]): XElem;
  /**
   * Write this node to the output stream.
   */
  write(out: sys.OutStream): void;
  /**
   * String representation is as a start tag.
   */
  toStr(): string;
  /**
   * If child is a XAttr then add an attribute.  Otherwise it
   * must be a XElem, XText, or XPi and is added a child node. 
   * If the child node is already parented, then throw ArgErr. 
   * Return this.
   */
  add(child: sys.JsObj): this;
  /**
   * Find an element by its non-qualified local name.  If there
   * are multiple child elements with the name, then the first
   * one is returned.  If the element is not found and checked is
   * false then return null otherwise throw XErr.
   */
  elem(name: string, checked?: boolean): XElem | null;
  /**
   * Remove the attribute from this element.  The attribute is
   * matched by reference, so you must pass in the same XAttr
   * contained by this element.  Return the removed attribute or
   * null if no match.
   */
  removeAttr(attr: XAttr): XAttr | null;
  /**
   * Return the {@link XNodeType.elem | XNodeType.elem}.  Note
   * that during pull parsing XParser will return `elemStart` and `elemEnd`.
   */
  nodeType(): XNodeType;
  /**
   * If this element is qualified by an XML namespace then return
   * the namespace's uri.  Otherwise return null.
   */
  uri(): sys.Uri | null;
  /**
   * Iterate each child element, text, and PI node in the {@link children | children}
   * list.
   */
  each(f: ((arg0: XNode, arg1: number) => void)): void;
  /**
   * Get this element's attributes as a readonly list.
   */
  attrs(): sys.List<XAttr>;
  /**
   * Add an attribute to this element.  Return this. This method
   * is a convenience for:
   * ```
   * add(XAttr(name, val, ns))
   * ```
   */
  addAttr(name: string, val: string, ns?: XNs | null): this;
  /**
   * Remove the child element, text, or PI at the specified index
   * into {@link children | children}.  Return the removed node.
   */
  removeAt(index: number): XNode;
  /**
   * Remove all the attributes.  Return this.
   */
  clearAttrs(): this;
}

