import * as sys from './sys.js';

/**
 * OrderedListStyle
 */
export class OrderedListStyle extends sys.Enum {
  static type$: sys.Type
  static upperRoman(): OrderedListStyle;
  static lowerAlpha(): OrderedListStyle;
  /**
   * List of OrderedListStyle values indexed by ordinal
   */
  static vals(): sys.List<OrderedListStyle>;
  static number(): OrderedListStyle;
  static upperAlpha(): OrderedListStyle;
  static lowerRoman(): OrderedListStyle;
  htmlType(): string;
  static fromFirstChar(ch: number): OrderedListStyle;
  /**
   * Return the OrderedListStyle instance for the specified name.
   * If not a valid name and checked is false return null,
   * otherwise throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): OrderedListStyle;
}

/**
 * Pre models a pre-formated code block.
 */
export class Pre extends DocElem {
  static type$: sys.Type
  id(): DocNodeId;
  static make(...args: unknown[]): Pre;
  htmlName(): string;
  isInline(): boolean;
}

/**
 * Image is a reference to an image file
 */
export class Image extends DocElem {
  static type$: sys.Type
  line(): number;
  line(it: number): void;
  alt(): string;
  alt(it: string): void;
  uri(): string;
  uri(it: string): void;
  size(): string | null;
  size(it: string | null): void;
  id(): DocNodeId;
  static make(uri: string, alt: string, ...args: unknown[]): Image;
  htmlName(): string;
  isInline(): boolean;
}

/**
 * Strong is bold text
 */
export class Strong extends DocElem {
  static type$: sys.Type
  id(): DocNodeId;
  static make(...args: unknown[]): Strong;
  htmlName(): string;
  isInline(): boolean;
}

/**
 * DocNode is the base class for nodes in a fandoc model. There
 * are two type of nodes:  DocElem and DocText.
 * 
 * See [pod doc](pod-doc#api) for usage.
 */
export class DocNode extends sys.Obj {
  static type$: sys.Type
  /**
   * Get the {@link DocElem | DocElem} that contains this node.
   * Return `null` if not parented.
   */
  parent(): DocElem | null;
  parent(it: DocElem | null): void;
  /**
   * Is this a block element versus an inline element.
   */
  isBlock(): boolean;
  /**
   * Return `true` if this node is the last child in its parent.
   */
  isLast(): boolean;
  /**
   * Get the path from the root of the DOM to this node.
   */
  path(): sys.List<DocNode>;
  /**
   * Return `true` if this node is the first child in its parent.
   */
  isFirst(): boolean;
  /**
   * Get the index of this node in its parent's children. Return `null`
   * if not parented.
   */
  pos(): number | null;
  /**
   * Is this an inline versus a block node.
   */
  isInline(): boolean;
  /**
   * Get node id for node type.
   */
  id(): DocNodeId;
  /**
   * Debug dump to output stream.
   */
  dump(out?: sys.OutStream): void;
  /**
   * Write this node to the specified DocWriter.
   */
  write(out: DocWriter): void;
  static make(...args: unknown[]): DocNode;
  /**
   * Get all the DocText children as a string
   */
  toText(): string;
}

/**
 * Doc models the top level node of a fandoc document.
 */
export class Doc extends DocElem {
  static type$: sys.Type
  meta(): sys.Map<string, string>;
  meta(it: sys.Map<string, string>): void;
  /**
   * Recursively walk th document to build an order list of the
   * multi-level headings which can serve as a "table of
   * contents" for the document.
   */
  findHeadings(): sys.List<Heading>;
  id(): DocNodeId;
  write(out: DocWriter): void;
  static make(...args: unknown[]): Doc;
  htmlName(): string;
  isInline(): boolean;
}

/**
 * UnorderedList models a bullet list
 */
export class UnorderedList extends DocElem {
  static type$: sys.Type
  id(): DocNodeId;
  static make(...args: unknown[]): UnorderedList;
  htmlName(): string;
  isInline(): boolean;
}

/**
 * PathTest
 */
export class PathTest extends sys.Test {
  static type$: sys.Type
  testCode(): void;
  testPre(): void;
  testHeading(): void;
  testPositions(): void;
  verifyPath(str: string, childIndices: sys.List<number>, expected: sys.List<DocNodeId>): Doc;
  testEmphasis(): void;
  static make(...args: unknown[]): PathTest;
  testLinks(): void;
  testBlockQuotes(): void;
  testImages(): void;
  parse(str: string): Doc;
  testPara(): void;
  testInsert(): void;
}

/**
 * Emphasis is italic text
 */
export class Emphasis extends DocElem {
  static type$: sys.Type
  id(): DocNodeId;
  static make(...args: unknown[]): Emphasis;
  htmlName(): string;
  isInline(): boolean;
}

/**
 * FandocErr
 */
export class FandocErr extends sys.Err {
  static type$: sys.Type
  line(): number;
  file(): string;
  toStr(): string;
  static make(msg: string, file: string, line: number, cause?: sys.Err | null, ...args: unknown[]): FandocErr;
}

/**
 * FandocParser translate fandoc text into an in-memory
 * representation of the document.
 * 
 * See [pod doc](pod-doc#api) for usage.
 */
export class FandocParser extends sys.Obj {
  static type$: sys.Type
  /**
   * List of errors detected
   */
  errs(): sys.List<FandocErr>;
  errs(it: sys.List<FandocErr>): void;
  /**
   * If true, then leading lines starting with `**` are parsed as
   * header
   */
  parseHeader(): boolean;
  parseHeader(it: boolean): void;
  /**
   * If not silent, then errors are dumped to stdout
   */
  silent(): boolean;
  silent(it: boolean): void;
  static main(args?: sys.List<string>): void;
  /**
   * Parse a string into its in-memory document tree structure.
   */
  parseStr(plaintext: string): Doc;
  static make(...args: unknown[]): FandocParser;
  /**
   * Parse the document from the specified in stream into an
   * in-memory tree structure.  If close is true, the stream is
   * guaranteed to be closed.
   */
  parse(filename: string, in$: sys.InStream, close?: boolean): Doc;
}

/**
 * Para models a paragraph of text.
 */
export class Para extends DocElem {
  static type$: sys.Type
  admonition(): string | null;
  admonition(it: string | null): void;
  id(): DocNodeId;
  static make(...args: unknown[]): Para;
  htmlName(): string;
  isInline(): boolean;
}

/**
 * Hr models a horizontal rule.
 */
export class Hr extends DocElem {
  static type$: sys.Type
  id(): DocNodeId;
  static make(...args: unknown[]): Hr;
  htmlName(): string;
  isInline(): boolean;
}

/**
 * Code is inline code
 */
export class Code extends DocElem {
  static type$: sys.Type
  id(): DocNodeId;
  static make(...args: unknown[]): Code;
  htmlName(): string;
  isInline(): boolean;
}

/**
 * FandocTest
 */
export class FandocTest extends sys.Test {
  static type$: sys.Type
  testCode(): void;
  testImage(): void;
  testPre(): void;
  testHr(): void;
  testMeta(): void;
  verifyDoc(str: string, expected: sys.List<sys.JsObj>): Doc;
  testUL(): void;
  verifyErrs(str: string, expected: sys.List<sys.JsObj>, errs: sys.List<sys.JsObj>): void;
  testPara(): void;
  testToB26(): void;
  testAnchorIds(): void;
  testEmphasisErr(): void;
  testEmphasis(): void;
  testPreExplicit(): void;
  testOL(): void;
  testToRoman(): void;
  static make(...args: unknown[]): FandocTest;
  testLinks(): void;
  testBlockQuotes(): void;
  verifyDocNode(actual: DocElem, expected: sys.List<sys.JsObj>): void;
  testErrs(): void;
  testHeadings(): void;
}

/**
 * BlockQuote models a block of quoted text.
 */
export class BlockQuote extends DocElem {
  static type$: sys.Type
  id(): DocNodeId;
  static make(...args: unknown[]): BlockQuote;
  htmlName(): string;
  isInline(): boolean;
}

export class MarkdownTest extends sys.Test {
  static type$: sys.Type
  fandocCheatsheet(): string;
  fandocCheatsheet(it: string): void;
  markdownCheatsheet(): string;
  markdownCheatsheet(it: string): void;
  testFandoc(): void;
  static make(...args: unknown[]): MarkdownTest;
  testMarkdown(): void;
}

/**
 * HtmlDocWriter outputs a fandoc model to XHTML
 * 
 * See [pod doc](pod-doc#api) for usage.
 */
export class HtmlDocWriter extends sys.Obj implements DocWriter {
  static type$: sys.Type
  /**
   * Callback to perform link resolution and checking for every
   * Link element
   */
  onLink(): ((arg0: Link) => void) | null;
  onLink(it: ((arg0: Link) => void) | null): void;
  out(): sys.OutStream;
  out(it: sys.OutStream): void;
  /**
   * Callback to perform image link resolution and checking
   */
  onImage(): ((arg0: Image) => void) | null;
  onImage(it: ((arg0: Image) => void) | null): void;
  docStart(doc: Doc): void;
  docEnd(doc: Doc): void;
  elemEnd(elem: DocElem): void;
  elemStart(elem: DocElem): void;
  docHead(doc: Doc): void;
  text(text: DocText): void;
  static make(out?: sys.OutStream, ...args: unknown[]): HtmlDocWriter;
}

/**
 * Link is a hyperlink.
 */
export class Link extends DocElem {
  static type$: sys.Type
  line(): number;
  line(it: number): void;
  isCode(): boolean;
  isCode(it: boolean): void;
  uri(): string;
  uri(it: string): void;
  id(): DocNodeId;
  /**
   * Is the text of the link the same as the URI string
   */
  isTextUri(): boolean;
  static make(uri: string, ...args: unknown[]): Link;
  htmlName(): string;
  isInline(): boolean;
  /**
   * Change the text to display for the link
   */
  setText(text: string): void;
}

/**
 * Heading
 */
export class Heading extends DocElem {
  static type$: sys.Type
  level(): number;
  title(): string;
  id(): DocNodeId;
  static make(level: number, ...args: unknown[]): Heading;
  htmlName(): string;
  isInline(): boolean;
}

/**
 * DocText segment.
 * 
 * See [pod doc](pod-doc#api) for usage.
 */
export class DocText extends DocNode {
  static type$: sys.Type
  str(): string;
  str(it: string): void;
  toStr(): string;
  isInline(): boolean;
  id(): DocNodeId;
  static make(str: string, ...args: unknown[]): DocText;
  write(out: DocWriter): void;
  toText(): string;
}

/**
 * DocNodeId
 */
export class DocNodeId extends sys.Enum {
  static type$: sys.Type
  static strong(): DocNodeId;
  static code(): DocNodeId;
  static blockQuote(): DocNodeId;
  /**
   * List of DocNodeId values indexed by ordinal
   */
  static vals(): sys.List<DocNodeId>;
  static link(): DocNodeId;
  static hr(): DocNodeId;
  static para(): DocNodeId;
  static emphasis(): DocNodeId;
  static text(): DocNodeId;
  static orderedList(): DocNodeId;
  static unorderedList(): DocNodeId;
  static listItem(): DocNodeId;
  static image(): DocNodeId;
  static pre(): DocNodeId;
  static heading(): DocNodeId;
  static doc(): DocNodeId;
  /**
   * Return the DocNodeId instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): DocNodeId;
}

/**
 * OrderedList models a numbered list
 */
export class OrderedList extends DocElem {
  static type$: sys.Type
  style(): OrderedListStyle;
  style(it: OrderedListStyle): void;
  id(): DocNodeId;
  static make(style: OrderedListStyle, ...args: unknown[]): OrderedList;
  htmlName(): string;
  isInline(): boolean;
}

/**
 * DocElem is a container node which models a branch of the doc
 * tree.
 * 
 * See [pod doc](pod-doc#api) for usage.
 */
export class DocElem extends DocNode {
  static type$: sys.Type
  anchorId(): string | null;
  anchorId(it: string | null): void;
  /**
   * Insert a child node at the specified index. A negative index
   * may be used to access an index from the end of the list. If
   * adding a text node it is automatically merged with
   * surrounding text nodes (if applicable). If the node is
   * already parented throws ArgErr.
   */
  insert(index: number, node: DocNode): this;
  /**
   * Remove a child node. If this element is not the child's
   * current parent throw ArgErr. Return this.
   */
  remove(node: DocNode): this;
  /**
   * Covariant override to narrow path to list of {@link DocElem | DocElem}.
   */
  path(): sys.List<DocElem>;
  /**
   * Remove all child nodes. Return this.
   */
  removeAll(): this;
  /**
   * Get a readonly list of this elements's children.
   */
  children(): sys.List<DocNode>;
  /**
   * Write this element and its children to the specified
   * DocWriter.
   */
  write(out: DocWriter): void;
  static make(...args: unknown[]): DocElem;
  /**
   * Add a child to this node.  If adding a text node it is
   * automatically merged with the trailing text node (if
   * applicable).  If the node is arlready parented thorw ArgErr.
   * Return this.
   */
  add(node: DocNode): this;
  /**
   * Write this element's children to the specified DocWriter.
   */
  writeChildren(out: DocWriter): void;
  /**
   * Iterate the children nodes
   */
  eachChild(f: ((arg0: DocNode) => void)): void;
  /**
   * Get the HTML element name to use for this element.
   */
  htmlName(): string;
  /**
   * Convenicence to call {@link add | add} for each node in the
   * given list.
   */
  addAll(nodes: sys.List<DocNode>): this;
  addChild(node: DocNode): this;
  /**
   * Get all the DocText children as a string
   */
  toText(): string;
}

/**
 * MarkdownDocWriter outputs a fandoc model to [Markdown](http://daringfireball.net/projects/markdown/)
 */
export class MarkdownDocWriter extends sys.Obj implements DocWriter {
  static type$: sys.Type
  /**
   * Callback to perform link resolution and checking for every
   * Link element
   */
  onLink(): ((arg0: Link) => void) | null;
  onLink(it: ((arg0: Link) => void) | null): void;
  /**
   * Callback to perform image link resolution and checking
   */
  onImage(): ((arg0: Image) => void) | null;
  onImage(it: ((arg0: Image) => void) | null): void;
  docStart(doc: Doc): void;
  static main(args?: sys.List<string>): void;
  elemStart(elem: DocElem): void;
  text(text: DocText): void;
  static make(out?: sys.OutStream, ...args: unknown[]): MarkdownDocWriter;
  docEnd(doc: Doc): void;
  elemEnd(elem: DocElem): void;
}

/**
 * DocWriter is used to output a fandoc model using a series of
 * callbacks.
 * 
 * See [pod doc](pod-doc#api) for usage.
 */
export abstract class DocWriter extends sys.Obj {
  static type$: sys.Type
  /**
   * Enter a document.
   */
  docStart(doc: Doc): void;
  /**
   * Exit a document.
   */
  docEnd(doc: Doc): void;
  /**
   * Exit an element.
   */
  elemEnd(elem: DocElem): void;
  /**
   * Enter an element.
   */
  elemStart(elem: DocElem): void;
  /**
   * Write text node.
   */
  text(text: DocText): void;
}

/**
 * FandocDocWriter outputs a fandoc model to plain text fandoc
 * format
 */
export class FandocDocWriter extends sys.Obj implements DocWriter {
  static type$: sys.Type
  /**
   * Callback to perform link resolution and checking for every
   * Link element
   */
  onLink(): ((arg0: Link) => void) | null;
  onLink(it: ((arg0: Link) => void) | null): void;
  /**
   * Callback to perform image link resolution and checking
   */
  onImage(): ((arg0: Image) => void) | null;
  onImage(it: ((arg0: Image) => void) | null): void;
  docStart(doc: Doc): void;
  docEnd(doc: Doc): void;
  elemEnd(elem: DocElem): void;
  elemStart(elem: DocElem): void;
  text(text: DocText): void;
  static make(out: sys.OutStream, ...args: unknown[]): FandocDocWriter;
}

/**
 * ListItem is an item in an OrderedList and UnorderedList.
 */
export class ListItem extends DocElem {
  static type$: sys.Type
  id(): DocNodeId;
  static make(...args: unknown[]): ListItem;
  htmlName(): string;
  isInline(): boolean;
}

