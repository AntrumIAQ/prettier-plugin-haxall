import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as util from './util.js';
import * as markdown from './markdown.js';
import * as web from './web.js';
import * as xeto from './xeto.js';
import * as xetoEnv from './xetoEnv.js';
import * as haystack from './haystack.js';

/**
 * DocPage enumerated type
 */
export class DocPageType extends sys.Enum {
  static type$: sys.Type
  static chapter(): DocPageType;
  static instance(): DocPageType;
  static lib(): DocPageType;
  /**
   * List of DocPageType values indexed by ordinal
   */
  static vals(): sys.List<DocPageType>;
  static global(): DocPageType;
  static type(): DocPageType;
  /**
   * Return the DocPageType instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): DocPageType;
}

/**
 * DocMarkdown is a block of text formatted in markdown.
 */
export class DocMarkdown extends sys.Obj {
  static type$: sys.Type
  /**
   * Empty string
   */
  static empty(): DocMarkdown;
  /**
   * Raw markdown text
   */
  text(): string;
  /**
   * Debug string
   */
  toStr(): string;
  /**
   * Encode to JSON as string literal
   */
  encode(): sys.JsObj;
  /**
   * Decode from JSON string literal
   */
  static decode(obj: sys.JsObj | null): DocMarkdown;
  /**
   * Return this text as HTML
   */
  html(): string;
  /**
   * Constructor
   */
  static make(text: string, ...args: unknown[]): DocMarkdown;
}

/**
 * DocTypeGraphEdgeMode
 */
export class DocTypeGraphEdgeMode extends sys.Enum {
  static type$: sys.Type
  static or(): DocTypeGraphEdgeMode;
  /**
   * List of DocTypeGraphEdgeMode values indexed by ordinal
   */
  static vals(): sys.List<DocTypeGraphEdgeMode>;
  static obj(): DocTypeGraphEdgeMode;
  static and(): DocTypeGraphEdgeMode;
  static base(): DocTypeGraphEdgeMode;
  /**
   * Return the DocTypeGraphEdgeMode instance for the specified
   * name.  If not a valid name and checked is false return null,
   * otherwise throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): DocTypeGraphEdgeMode;
}

/**
 * DocChapter is a page of a markdown document
 */
export class DocChapter extends sys.Obj implements DocPage {
  static type$: sys.Type
  /**
   * Qualified name of this chapter
   */
  qname(): string;
  /**
   * Markdown
   */
  doc(): DocMarkdown;
  /**
   * Encode to a JSON object tree
   */
  encode(): sys.Map<string, sys.JsObj>;
  /**
   * Library for this page
   */
  lib(): DocLibRef | null;
  /**
   * Decode from a JSON object tree
   */
  static doDecode(obj: sys.Map<string, sys.JsObj>): DocChapter;
  /**
   * Page type
   */
  pageType(): DocPageType;
  /**
   * Constructor
   */
  static make(qname: string, doc: DocMarkdown, ...args: unknown[]): DocChapter;
  /**
   * Library name for this instance
   */
  libName(): string;
  /**
   * URI relative to base dir to page
   */
  uri(): sys.Uri;
  /**
   * Simple name of this instance
   */
  name(): string;
  /**
   * Dump to JSON
   */
  dump(out?: sys.OutStream): void;
}

/**
 * Documentation utilities
 */
export class DocUtil extends sys.Obj {
  static type$: sys.Type
  static chapterIcon(): haystack.Ref;
  static libIcon(): haystack.Ref;
  static instanceIcon(): haystack.Ref;
  static globalIcon(): haystack.Ref;
  static typeIcon(): haystack.Ref;
  /**
   * Convert type spec qualilfied name to its normalized URI
   */
  static typeToUri(qname: string): sys.Uri;
  /**
   * Convert instance qualified name to its normalized URI
   */
  static instanceToUri(qname: string): sys.Uri;
  /**
   * Convert spec name to its normalized URI
   */
  static specToUri(spec: xeto.Spec): sys.Uri;
  /**
   * Convert global spec qualilfied name to its normalized URI
   */
  static globalToUri(qname: string): sys.Uri;
  /**
   * Lib name to the library index page
   */
  static libToUri(libName: string): sys.Uri;
  /**
   * Convert chaoter qualified name to its normalized URI
   */
  static chapterToUri(qname: string): sys.Uri;
  static make(...args: unknown[]): DocUtil;
}

/**
 * DocSlot is the documentation for a type slot
 */
export class DocSlot extends DocSpec {
  static type$: sys.Type
  /**
   * Declared parent type if inherited, null if declared in
   * containing type
   */
  parent(): DocTypeRef | null;
  /**
   * Type for this slot
   */
  type(): DocTypeRef;
  /**
   * Empty map of slots
   */
  static empty(): sys.Map<string, DocSlot>;
  /**
   * Child slots on this type
   */
  slots(): sys.Map<string, DocSlot>;
  /**
   * Declared own meta
   */
  meta(): DocDict;
  /**
   * Simple name of this instance
   */
  name(): string;
  /**
   * Documentation for this slot
   */
  doc(): DocMarkdown;
  /**
   * Link to base used when this slot base is from global slot
   */
  base(): DocLink | null;
  /**
   * Encode to a JSON object tree
   */
  encode(): sys.Map<string, sys.JsObj>;
  /**
   * Decode map keyed by name
   */
  static encodeMap(map: sys.Map<string, DocSlot>): sys.JsObj | null;
  /**
   * Decode from a JSON object tree
   */
  static decode(name: string, obj: sys.Map<string, sys.JsObj>): DocSlot;
  /**
   * Decode map keyed by name
   */
  static decodeMap(obj: sys.Map<string, sys.JsObj> | null): sys.Map<string, DocSlot>;
  /**
   * Constructor
   */
  static make(name: string, doc: DocMarkdown, meta: DocDict, type: DocTypeRef, parent: DocTypeRef | null, base: DocLink | null, slots: sys.Map<string, DocSlot>, ...args: unknown[]): DocSlot;
}

/**
 * DocLink is a hyperlink
 */
export class DocLink extends sys.Obj {
  static type$: sys.Type
  /**
   * URI relative to base dir to page
   */
  uri(): sys.Uri;
  /**
   * Display text for link
   */
  dis(): string;
  /**
   * Encode to a JSON object tree
   */
  encode(): sys.Map<string, sys.JsObj>;
  /**
   * Decode from JSON object tree
   */
  static decode(obj: sys.Map<string, sys.JsObj> | null): DocLink | null;
  /**
   * Constructor
   */
  static make(uri: sys.Uri, dis: string, ...args: unknown[]): DocLink;
}

/**
 * DocSpecPage
 */
export class DocSpecPage extends DocSpec implements DocPage {
  static type$: sys.Type
  /**
   * Qualified name of this spec
   */
  qname(): string;
  /**
   * Effective meta data
   */
  meta(): DocDict;
  /**
   * Documentation text
   */
  doc(): DocMarkdown;
  /**
   * Encode to a JSON object tree
   */
  encode(): sys.Map<string, sys.JsObj>;
  /**
   * Library for this page
   */
  lib(): DocLibRef | null;
  /**
   * Constructor
   */
  static make(qname: string, doc: DocMarkdown, meta: DocDict, ...args: unknown[]): DocSpecPage;
  /**
   * Library name for this instance
   */
  libName(): string;
  /**
   * Simple name of this instance
   */
  name(): string;
  /**
   * URI relative to base dir for page
   */
  uri(): sys.Uri;
  /**
   * Enumerated type of this node
   */
  pageType(): DocPageType;
  /**
   * Dump to JSON
   */
  dump(out?: sys.OutStream): void;
}

/**
 * DocLib is the documentation page for a Xeto library
 */
export class DocLib extends sys.Obj implements DocPage {
  static type$: sys.Type
  /**
   * Instances defined in this library
   */
  instances(): sys.List<DocSummary>;
  __instances(it: sys.List<DocSummary>): void;
  /**
   * Chapters defined in this library
   */
  chapters(): sys.List<DocSummary>;
  __chapters(it: sys.List<DocSummary>): void;
  /**
   * Top-level global specs defined in this library
   */
  globals(): sys.List<DocSummary>;
  __globals(it: sys.List<DocSummary>): void;
  /**
   * Top-level type specs defined in this library
   */
  types(): sys.List<DocSummary>;
  __types(it: sys.List<DocSummary>): void;
  /**
   * Dependencies
   */
  depends(): sys.List<DocLibDepend>;
  __depends(it: sys.List<DocLibDepend>): void;
  /**
   * Metadata
   */
  meta(): DocDict;
  __meta(it: DocDict): void;
  /**
   * Dotted name for library
   */
  name(): string;
  __name(it: string): void;
  /**
   * Summary documentation for library
   */
  doc(): DocMarkdown;
  __doc(it: DocMarkdown): void;
  /**
   * Encode to a JSON object tree
   */
  encode(): sys.Map<string, sys.JsObj>;
  /**
   * Library for this page (or null if top-level indexing)
   */
  lib(): DocLibRef | null;
  /**
   * Decode from a JSON object tree
   */
  static doDecode(obj: sys.Map<string, sys.JsObj>): DocLib;
  /**
   * Page type
   */
  pageType(): DocPageType;
  /**
   * Constructor
   */
  static make(f: ((arg0: DocLib) => void), ...args: unknown[]): DocLib;
  /**
   * URI relative to base dir to page
   */
  uri(): sys.Uri;
  /**
   * Dump to JSON
   */
  dump(out?: sys.OutStream): void;
}

/**
 * DocOfTypeRef
 */
export class DocOfTypeRef extends DocTypeRef {
  static type$: sys.Type
  of(): DocTypeRef | null;
  base(): DocTypeRef;
  encode(): sys.Map<string, sys.JsObj>;
  isMaybe(): boolean;
  isOf(): boolean;
  qname(): string;
  static make(base: DocTypeRef, of$: DocTypeRef, ...args: unknown[]): DocOfTypeRef;
  toStr(): string;
  uri(): sys.Uri;
}

/**
 * DocTypeGraph models supertype/subtype inheritance graph of a
 * type
 */
export class DocTypeGraph extends sys.Obj {
  static type$: sys.Type
  /**
   * List of all types in the inheritance graph
   */
  types(): sys.List<DocTypeRef>;
  /**
   * This is a list of edges for each type aligned by list index
   * Used only for supertypes, not subtypes
   */
  edges(): sys.List<DocTypeGraphEdge> | null;
  /**
   * Empty list of types
   */
  static empty(): DocTypeGraph;
  /**
   * Encode to a JSON object tree
   */
  encode(): sys.Map<string, sys.JsObj> | null;
  /**
   * Decode from JSON object tree
   */
  static decode(obj: sys.Map<string, sys.JsObj> | null): DocTypeGraph;
  /**
   * Constructor
   */
  static make(types: sys.List<DocTypeRef>, edges: sys.List<DocTypeGraphEdge> | null, ...args: unknown[]): DocTypeGraph;
}

/**
 * DocSummary is a hyperlink to a node with a formatted summary
 * sentence.
 */
export class DocSummary extends sys.Obj {
  static type$: sys.Type
  /**
   * Title and hyperlink
   */
  link(): DocLink;
  /**
   * Optional type ref used for some summaries (such as globals)s
   */
  type(): DocTypeRef | null;
  /**
   * Formatted summary text
   */
  text(): DocMarkdown;
  /**
   * Debug string
   */
  toStr(): string;
  /**
   * Encode to a JSON object tree
   */
  encode(): sys.Map<string, sys.JsObj>;
  /**
   * Decode from JSON object tree
   */
  static decode(obj: sys.Map<string, sys.JsObj>): DocSummary;
  /**
   * Encode a list or null if empty
   */
  static encodeList(list: sys.List<DocSummary>): sys.JsObj | null;
  /**
   * Decode a list or empty if null
   */
  static decodeList(list: sys.List<sys.JsObj> | null): sys.List<DocSummary>;
  /**
   * Constructor
   */
  static make(link: DocLink, text: DocMarkdown, type?: DocTypeRef | null, ...args: unknown[]): DocSummary;
}

/**
 * DocInstance is the documentation for an instance in a lib
 */
export class DocInstance extends sys.Obj implements DocPage {
  static type$: sys.Type
  /**
   * Instance dictionary
   */
  instance(): DocDict;
  /**
   * Qualified name of this instance
   */
  qname(): string;
  /**
   * Encode to a JSON object tree
   */
  encode(): sys.Map<string, sys.JsObj>;
  /**
   * Library for this page
   */
  lib(): DocLibRef | null;
  /**
   * Decode from a JSON object tree
   */
  static doDecode(obj: sys.Map<string, sys.JsObj>): DocInstance;
  /**
   * Page type
   */
  pageType(): DocPageType;
  /**
   * Constructor
   */
  static make(qname: string, instance: DocDict, ...args: unknown[]): DocInstance;
  /**
   * Library name for this instance
   */
  libName(): string;
  /**
   * URI relative to base dir to page
   */
  uri(): sys.Uri;
  /**
   * Simple name of this instance
   */
  name(): string;
  /**
   * Dump to JSON
   */
  dump(out?: sys.OutStream): void;
}

/**
 * PageEntry is the working data for a DocPage
 */
export class PageEntry extends sys.Obj {
  static type$: sys.Type
  /**
   * If page is under a lib
   */
  lib(): xeto.Lib;
  /**
   * Definition as Lib, Spec, Dict instance, or chapter markdown
   * Str
   */
  def(): sys.JsObj;
  /**
   * Link to this page
   */
  link(): DocLink;
  /**
   * Display name for this page
   */
  dis(): string;
  /**
   * Page type
   */
  pageType(): DocPageType;
  /**
   * Unique key for mapping libs, specs, instancs
   */
  key(): string;
  /**
   * This is the index.md file for lib pages
   */
  mdIndex(): string | null;
  mdIndex(it: string | null): void;
  /**
   * If we want to add type into lib summary (globals)
   */
  summaryType(): DocTypeRef | null;
  summaryType(it: DocTypeRef | null): void;
  /**
   * URI relative to base dir to page
   */
  uri(): sys.Uri;
  /**
   * Meta for the page (lib meta, spec meta, instance itself)
   */
  meta(): haystack.Dict;
  /**
   * Constructor for instance
   */
  static makeInstance(lib: xeto.Lib, x: haystack.Dict, ...args: unknown[]): PageEntry;
  /**
   * Constructor for chapter
   */
  static makeChapter(lib: xeto.Lib, file: sys.Uri, $markdown: string, ...args: unknown[]): PageEntry;
  /**
   * Constructor for lib
   */
  static makeLib(x: xeto.Lib, ...args: unknown[]): PageEntry;
  /**
   * URI relative to base dir to page with ".json" extension
   */
  uriJson(): sys.Uri;
  /**
   * Constructor for type/global
   */
  static makeSpec(x: xeto.Spec, pageType: DocPageType, ...args: unknown[]): PageEntry;
  /**
   * Get the summary
   */
  summary(): DocSummary;
  /**
   * Debug string
   */
  toStr(): string;
  /**
   * Get the page
   */
  page(): DocPage;
}

/**
 * DocSimpleTypeRef links to one type spec with no
 * parameterization
 */
export class DocSimpleTypeRef extends DocTypeRef {
  static type$: sys.Type
  /**
   * Is this maybe type
   */
  isMaybe(): boolean;
  static predefined(): sys.Map<string, DocSimpleTypeRef>;
  /**
   * Qualified name of the type
   */
  qname(): string;
  /**
   * Encode to a JSON object tree
   */
  encode(): sys.JsObj;
  /**
   * Constructor with interning
   */
  static make(qname: string, isMaybe?: boolean, ...args: unknown[]): DocSimpleTypeRef;
  /**
   * String
   */
  toStr(): string;
  /**
   * URI to this type
   */
  uri(): sys.Uri;
}

/**
 * DocVal models values stored in meta and instances
 */
export class DocVal extends sys.Obj {
  static type$: sys.Type
  /**
   * Return if this is a dict value
   */
  isDict(): boolean;
  /**
   * Decode from a JSON object tree
   */
  static decodeVal(obj: sys.Map<string, sys.JsObj>): DocVal;
  /**
   * Type of this value
   */
  type(): DocTypeRef;
  /**
   * Return if this is a list value
   */
  isList(): boolean;
  /**
   * Get this value as a DocList or raise exeption if not list
   */
  asList(): DocList;
  /**
   * Encode to a JSON object tree
   */
  encodeVal(): sys.JsObj | null;
  /**
   * Get this value as a DocDict or raise exeption if not dict
   */
  asDict(): DocDict;
  /**
   * Return if this is a scalar value
   */
  isScalar(): boolean;
  static make(...args: unknown[]): DocVal;
  /**
   * Get this value as a DocSclar or raise exeption if not scalar
   */
  asScalar(): DocScalar;
}

/**
 * DocScalar
 */
export class DocScalar extends DocVal {
  static type$: sys.Type
  /**
   * Type of this value
   */
  type(): DocTypeRef;
  /**
   * String encoding of the scalar
   */
  scalar(): string;
  /**
   * Cosntructor
   */
  static make(type: DocTypeRef, scalar: string, ...args: unknown[]): DocScalar;
  /**
   * Return true
   */
  isScalar(): boolean;
  /**
   * Return this
   */
  asScalar(): DocScalar;
}

/**
 * DocTypeGraphEdge
 */
export class DocTypeGraphEdge extends sys.Obj {
  static type$: sys.Type
  /**
   * Type index or index this edge references
   */
  types(): sys.List<number>;
  /**
   * Type of edge in the graph
   */
  mode(): DocTypeGraphEdgeMode;
  /**
   * Edge for sys::Obj
   */
  static obj(): DocTypeGraphEdge;
  /**
   * Encode
   */
  toStr(): string;
  /**
   * Encode to string
   */
  encode(): string;
  /**
   * Decode from string
   */
  static decode(s: string): DocTypeGraphEdge;
  /**
   * Encode list of edges
   */
  static encodeList(list: sys.List<DocTypeGraphEdge> | null): sys.List<string> | null;
  /**
   * Encode list of edges
   */
  static decodeList(list: sys.List<string> | null): sys.List<DocTypeGraphEdge> | null;
  /**
   * Constructor
   */
  static make(mode: DocTypeGraphEdgeMode, types: sys.List<number>, ...args: unknown[]): DocTypeGraphEdge;
}

/**
 * DocLibDepend
 */
export class DocLibDepend extends sys.Obj {
  static type$: sys.Type
  /**
   * Library
   */
  lib(): DocLibRef;
  /**
   * Dependency version requirements
   */
  versions(): xeto.LibDependVersions;
  /**
   * Encode to a JSON object tree
   */
  encode(): sys.Map<string, sys.JsObj>;
  /**
   * Decode from JSON object tree
   */
  static decode(obj: sys.Map<string, sys.JsObj>): DocLibDepend;
  /**
   * Decode list
   */
  static encodeList(list: sys.List<DocLibDepend>): sys.List<sys.JsObj>;
  /**
   * Decode list
   */
  static decodeList(list: sys.List<sys.JsObj> | null): sys.List<DocLibDepend>;
  /**
   * Constructor
   */
  static make(lib: DocLibRef, versions: xeto.LibDependVersions, ...args: unknown[]): DocLibDepend;
}

/**
 * DocDict encodes meta and instances
 */
export class DocDict extends DocVal {
  static type$: sys.Type
  /**
   * Dict type
   */
  type(): DocTypeRef;
  /**
   * Empty doc dict
   */
  static empty(): DocDict;
  /**
   * Dict value
   */
  dict(): sys.Map<string, DocVal>;
  /**
   * Encode to a JSON object tree or null if empty
   */
  encode(): sys.Map<string, sys.JsObj> | null;
  /**
   * Encode to top-level dict or null if empty
   */
  static decode(obj: sys.Map<string, sys.JsObj> | null): DocDict | null;
  /**
   * Convenience for `dict.get`
   */
  get(name: string): DocVal | null;
  /**
   * Constructor
   */
  static make(type: DocTypeRef, dict: sys.Map<string, DocVal>, ...args: unknown[]): DocDict;
  /**
   * Return true
   */
  isDict(): boolean;
  /**
   * Return this
   */
  asDict(): DocDict;
}

/**
 * DocOrTypeRef
 */
export class DocOrTypeRef extends DocCompoundTypeRef {
  static type$: sys.Type
  encodeTag(): string;
  qname(): string;
  static make(ofs: sys.List<DocTypeRef>, isMaybe: boolean, ...args: unknown[]): DocOrTypeRef;
  compoundSymbol(): string | null;
}

/**
 * DocType is the documentation for a Xeto top-level type
 */
export class DocType extends DocSpecPage {
  static type$: sys.Type
  /**
   * Subtypes in this library
   */
  subtypes(): DocTypeGraph;
  /**
   * Supertype inheritance graph
   */
  supertypes(): DocTypeGraph;
  /**
   * Child slots on this type
   */
  slots(): sys.Map<string, DocSlot>;
  /**
   * Super type or null if this is `sys::Obj`
   */
  base(): DocTypeRef | null;
  /**
   * Encode to a JSON object tree
   */
  encode(): sys.Map<string, sys.JsObj>;
  /**
   * Decode from a JSON object tree
   */
  static doDecode(obj: sys.Map<string, sys.JsObj>): DocType;
  /**
   * Page type
   */
  pageType(): DocPageType;
  /**
   * Constructor
   */
  static make(qname: string, doc: DocMarkdown, meta: DocDict, base: DocTypeRef | null, supertypes: DocTypeGraph, subtypes: DocTypeGraph, slots: sys.Map<string, DocSlot>, ...args: unknown[]): DocType;
  /**
   * URI relative to base dir to page
   */
  uri(): sys.Uri;
}

/**
 * DocSpec is the base class documentation all specs: types,
 * globals, and slots
 */
export class DocSpec extends sys.Obj {
  static type$: sys.Type
  /**
   * Effective metadata
   */
  meta(): DocDict;
  /**
   * Simple name of this instance
   */
  name(): string;
  /**
   * Documentation text
   */
  doc(): DocMarkdown;
  static make(...args: unknown[]): DocSpec;
}

/**
 * DocTypeRef models the signature of a type
 */
export class DocTypeRef extends sys.Obj {
  static type$: sys.Type
  /**
   * Encode to a JSON object tree
   */
  encode(): sys.JsObj;
  /**
   * Return if this is a Maybe type
   */
  isMaybe(): boolean;
  /**
   * Return if this is an And/Or type
   */
  isCompound(): boolean;
  /**
   * Decode from a JSON object tree
   */
  static decode(obj: sys.JsObj | null): DocTypeRef | null;
  /**
   * Return if is a parameterized type with `of`
   */
  isOf(): boolean;
  /**
   * Return qualified name (if compound "sys::And" or "sys::Or")
   */
  qname(): string;
  /**
   * Return of the `of` parameterized type
   */
  of(): DocTypeRef | null;
  static dict(): DocTypeRef;
  /**
   * Decode list of refs
   */
  static decodeList(list: sys.List<sys.JsObj>): sys.List<DocTypeRef>;
  static make(...args: unknown[]): DocTypeRef;
  static list(): DocTypeRef;
  /**
   * URI to this core type
   */
  uri(): sys.Uri;
  /**
   * Return null, "&" or "|"
   */
  compoundSymbol(): string | null;
  /**
   * Return simple name
   */
  name(): string;
  /**
   * Compound types or null if not applicable
   */
  ofs(): sys.List<DocTypeRef> | null;
}

/**
 * DocPage is base class for documentation pages: libs, specs,
 * instances
 */
export abstract class DocPage extends sys.Obj {
  static type$: sys.Type
  /**
   * Encode to a JSON object tree
   */
  encode(): sys.Map<string, sys.JsObj>;
  /**
   * Library for this page (or null if top-level indexing)
   */
  lib(): DocLibRef | null;
  /**
   * Decode from JSON object tree
   */
  static decode(obj: sys.Map<string, sys.JsObj>): DocPage;
  /**
   * URI relative to base dir for page
   */
  uri(): sys.Uri;
  /**
   * Enumerated type of this node
   */
  pageType(): DocPageType;
  /**
   * Dump to JSON
   */
  dump(out?: sys.OutStream): void;
}

/**
 * DocCompoundTypeRef
 */
export class DocCompoundTypeRef extends DocTypeRef {
  static type$: sys.Type
  /**
   * Return if this is a Maybe type
   */
  isMaybe(): boolean;
  /**
   * Compound types
   */
  ofs(): sys.List<DocTypeRef> | null;
  /**
   * Encode
   */
  encode(): sys.Map<string, sys.JsObj>;
  /**
   * Return "and" or "or"
   */
  encodeTag(): string;
  /**
   * Return true
   */
  isCompound(): boolean;
  /**
   * Constructor
   */
  static make(ofs: sys.List<DocTypeRef>, isMaybe: boolean, ...args: unknown[]): DocCompoundTypeRef;
  /**
   * String
   */
  toStr(): string;
  /**
   * Return sys::And or sys::Or
   */
  uri(): sys.Uri;
}

/**
 * DocLibRef
 */
export class DocLibRef extends sys.Obj {
  static type$: sys.Type
  /**
   * Library dotted name
   */
  name(): string;
  /**
   * Encode to a JSON object tree
   */
  encode(): sys.JsObj;
  /**
   * Decode from JSON object tree
   */
  static decode(s: string): DocLibRef;
  /**
   * URI to this libraries index page
   */
  uri(): sys.Uri;
  /**
   * Constructor
   */
  static make(name: string, ...args: unknown[]): DocLibRef;
}

/**
 * Xeto documentation compiler
 */
export class DocCompiler extends sys.Obj {
  static type$: sys.Type
  errs(): sys.List<xetoEnv.XetoCompilerErr>;
  errs(it: sys.List<xetoEnv.XetoCompilerErr>): void;
  /**
   * Namespace to generate
   */
  ns(): xeto.LibNamespace;
  __ns(it: xeto.LibNamespace): void;
  /**
   * Logging
   */
  log(): xetoEnv.XetoLog;
  log(it: xetoEnv.XetoLog): void;
  /**
   * Output directory or if null then output to in-mem files
   * field
   */
  outDir(): sys.File | null;
  __outDir(it: sys.File | null): void;
  duration(): sys.Duration | null;
  duration(it: sys.Duration | null): void;
  pages(): sys.Map<string, PageEntry> | null;
  pages(it: sys.Map<string, PageEntry> | null): void;
  files(): sys.List<sys.File>;
  files(it: sys.List<sys.File>): void;
  /**
   * Libs to generate
   */
  libs(): sys.List<xeto.Lib>;
  __libs(it: sys.List<xeto.Lib>): void;
  /**
   * Log err message with two locations of duplicate identifiers
   */
  err2(msg: string, loc1: util.FileLoc, loc2: util.FileLoc, cause?: sys.Err | null): xetoEnv.XetoCompilerErr;
  /**
   * Compile input directory to library
   */
  compile(): this;
  /**
   * It-block Constructor
   */
  static make(f: ((arg0: DocCompiler) => void), ...args: unknown[]): DocCompiler;
  /**
   * Get page entry key for lib, spec, instance
   */
  static key(def: sys.JsObj): string;
  /**
   * Log info message
   */
  info(msg: string): void;
  /**
   * Static utility which can be easily used for reflection
   */
  static runCompiler(ns: xeto.LibNamespace, outDir: sys.File): void;
  /**
   * Log err message
   */
  err(msg: string, loc: util.FileLoc, cause?: sys.Err | null): xetoEnv.XetoCompilerErr;
  /**
   * Generate an auto name of "_0", "_1", etc
   */
  autoName(i: number): string;
  /**
   * Apply options
   */
  applyOpts(opts: xeto.Dict | null): void;
  /**
   * Log warning message
   */
  warn(msg: string, loc: util.FileLoc, cause?: sys.Err | null): void;
  /**
   * Lookup page entry for lib, spec, instance
   */
  page(def: sys.JsObj): PageEntry;
}

/**
 * DocGlobal is the documentation for a Xeto top-level global
 */
export class DocGlobal extends DocSpecPage {
  static type$: sys.Type
  /**
   * Type of this global
   */
  type(): DocTypeRef;
  /**
   * Encode to a JSON object tree
   */
  encode(): sys.Map<string, sys.JsObj>;
  /**
   * Decode from a JSON object tree
   */
  static doDecode(obj: sys.Map<string, sys.JsObj>): DocGlobal;
  /**
   * URI relative to base dir to page
   */
  uri(): sys.Uri;
  /**
   * Page type
   */
  pageType(): DocPageType;
  /**
   * Constructor
   */
  static make(qname: string, doc: DocMarkdown, meta: DocDict, type: DocTypeRef, ...args: unknown[]): DocGlobal;
}

/**
 * DocAndTypeRef
 */
export class DocAndTypeRef extends DocCompoundTypeRef {
  static type$: sys.Type
  encodeTag(): string;
  qname(): string;
  static make(ofs: sys.List<DocTypeRef>, isMaybe: boolean, ...args: unknown[]): DocAndTypeRef;
  compoundSymbol(): string | null;
}

/**
 * DocList
 */
export class DocList extends DocVal {
  static type$: sys.Type
  /**
   * Type of this value
   */
  type(): DocTypeRef;
  /**
   * Lsit of values
   */
  list(): sys.List<DocVal>;
  /**
   * Return true
   */
  isList(): boolean;
  /**
   * Return this
   */
  asList(): DocList;
  /**
   * Cosntructor
   */
  static make(type: DocTypeRef, list: sys.List<DocVal>, ...args: unknown[]): DocList;
}

