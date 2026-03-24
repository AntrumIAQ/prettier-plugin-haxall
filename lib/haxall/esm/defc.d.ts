import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as fandoc from './fandoc.js';
import * as compilerDoc from './compilerDoc.js';
import * as web from './web.js';
import * as util from './util.js';
import * as xeto from './xeto.js';
import * as haystack from './haystack.js';
import * as def from './def.js';

/**
 * CDef extension
 */
export class CDefX extends sys.Obj {
  static type$: sys.Type
  /**
   * Meta from defx
   */
  declared(): haystack.Dict;
  /**
   * File location of source definition
   */
  loc(): CLoc;
  /**
   * Symbol key
   */
  symbol(): CSymbol;
  /**
   * Parent lib
   */
  lib(): CLib;
  lib(it: CLib): void;
  /**
   * Normalized meta computed in Resolve, Normalize
   */
  meta(): sys.Map<string, CPair> | null;
  meta(it: sys.Map<string, CPair> | null): void;
}

/**
 * CDefParts manages sub-parts of compound defs
 */
export class CDefParts extends sys.Obj {
  static type$: sys.Type
  /**
   * Associated CDef
   */
  def(): CDef;
  def(it: CDef): void;
  /**
   * As conjunct
   */
  conjunct(): CConjunctParts;
  /**
   * Constructor
   */
  static make($def: CDef, ...args: unknown[]): CDefParts;
  /**
   * As feature key
   */
  key(): CKeyParts;
}

/**
 * Theme overrides
 */
export class DefDocTheme extends compilerDoc.DocTheme {
  static type$: sys.Type
  writeBreadcrumb(r: compilerDoc.DocRenderer): void;
  writeEnd(r: compilerDoc.DocRenderer): void;
  writeStart(r: compilerDoc.DocRenderer): void;
  static make(...args: unknown[]): DefDocTheme;
}

/**
 * DocLib is the documentation space for a CLib
 */
export class DocLib extends compilerDoc.DocSpace {
  static type$: sys.Type
  def(): haystack.Lib;
  __def(it: haystack.Lib): void;
  docFull(): CFandoc;
  __docFull(it: CFandoc): void;
  defs(): sys.List<DocDef>;
  __defs(it: sys.List<DocDef>): void;
  docSummary(): CFandoc;
  __docSummary(it: CFandoc): void;
  index(): DocLibIndex;
  __index(it: DocLibIndex): void;
  name(): string;
  __name(it: string): void;
  manualRef(): concurrent.AtomicRef;
  __manualRef(it: concurrent.AtomicRef): void;
  eachDoc(f: ((arg0: compilerDoc.Doc) => void)): void;
  manual(): DocLibManual | null;
  spaceName(): string;
  breadcrumb(): string;
  doc(docName: string, checked?: boolean): compilerDoc.Doc | null;
}

/**
 * DocAppendixIndex
 */
export class DocAppendixIndex extends DocAppendix {
  static type$: sys.Type
  summary(): string;
  renderer(): sys.Type;
  title(): string;
  docName(): string;
  isSpaceIndex(): boolean;
  static make(...args: unknown[]): DocAppendixIndex;
  group(): string;
}

/**
 * ManualInput
 */
export class ManualInput extends CompilerInput {
  static type$: sys.Type
  pod(): sys.Pod;
  toStr(): string;
  inputType(): CompilerInputType;
  static make(p: sys.Pod, ...args: unknown[]): ManualInput;
}

/**
 * CompilerInput defines one lib or manual to scan
 */
export class CompilerInput extends sys.Obj {
  static type$: sys.Type
  /**
   * Convenience for `makePod(Pod.find(podName))`
   */
  static makePodName(podName: string, checked?: boolean, ...args: unknown[]): CompilerInput;
  /**
   * Utility to parse each Dict+CLoc within a trio file
   */
  static parseEachDict(c: DefCompiler | null, file: sys.File, f: ((arg0: haystack.Dict, arg1: CLoc) => void)): void;
  /**
   * Parse lib.trio and return Dict or CompilerErr
   */
  static parseLibMetaFile(c: DefCompiler, file: sys.File): sys.JsObj;
  /**
   * Scan a directory to find all directories containing lib.trio
   */
  static scanDir(dir: sys.File): sys.List<CompilerInput>;
  /**
   * Construct input for a pod with lib/*.trio files
   */
  static makePod(pod: sys.Pod, ...args: unknown[]): CompilerInput;
  /**
   * Type of input
   */
  inputType(): CompilerInputType;
  static make(...args: unknown[]): CompilerInput;
  /**
   * Constructor for a directory containing a lib.trio file
   */
  static makeDir(dir: sys.File, ...args: unknown[]): CompilerInput;
}

/**
 * DefDocRenderer is base class for defc renderers
 */
export class DefDocRenderer extends compilerDoc.DocRenderer {
  static type$: sys.Type
  /**
   * Navigation menu/sidebar data
   */
  navData(): DocNavData;
  navData(it: DocNavData): void;
  /**
   * Return out as CDocOutStream
   */
  out(): DocOutStream;
  /**
   * Write flatten list of chapter links as section
   */
  writeChapterTocSection(name: string, target: compilerDoc.Doc | null): void;
  /**
   * Write standard title header of a def
   */
  writeDefHeader(name: string, title: string, subtitle: string | null, doc: CFandoc): void;
  /**
   * Write children prototypes section
   */
  writeProtosSection(protos: sys.List<DocProto>): void;
  /**
   * Build the navigation menu/sidebar data
   */
  buildNavData(): void;
  /**
   * Constructor
   */
  static make(env: DefDocEnv, out: DocOutStream, doc: compilerDoc.Doc, ...args: unknown[]): DefDocRenderer;
  onFandocErr(e: sys.Err, loc: compilerDoc.DocLoc): void;
  /**
   * Write the sidebar as a comment
   */
  writeNavData(): void;
  /**
   * Customize to insert defc-main div around body
   */
  writeDoc(): void;
  /**
   * Write a list of defs
   */
  writeListSection(name: string, defs: sys.List<DocDef>, justName?: boolean): void;
  /**
   * Write the chapter links (container element not written)
   */
  writeChapterTocLinks(target: compilerDoc.Doc): void;
  /**
   * Return env as DefDocEnv
   */
  env(): DefDocEnv;
  onFandocImage(elem: fandoc.Image, loc: compilerDoc.DocLoc): void;
  /**
   * Write tag name/value pairs
   */
  writeMetaSection(meta: haystack.Def): void;
  /**
   * Customize secondary navigation below the breadcrumb
   */
  writePrevNext(): void;
}

/**
 * DefPodIndexRenderer
 */
export class DefPodIndexRenderer extends DefDocRenderer {
  static type$: sys.Type
  writeContent(): void;
  buildNavData(): void;
  static make(env: compilerDoc.DocEnv, out: DocOutStream, doc: compilerDoc.DocPodIndex, ...args: unknown[]): DefPodIndexRenderer;
}

/**
 * DocProtoIndex
 */
export class DocProtoIndex extends compilerDoc.Doc {
  static type$: sys.Type
  space(): DocProtoSpace;
  renderer(): sys.Type;
  title(): string;
  docName(): string;
  isSpaceIndex(): boolean;
  static make(space: DocProtoSpace, ...args: unknown[]): DocProtoIndex;
}

/**
 * CDefFlags
 */
export class CDefFlags extends sys.Obj {
  static type$: sys.Type
  static flagsToStr(flags: number): string;
  static compute($def: CDef): number;
  static make(...args: unknown[]): CDefFlags;
}

/**
 * Documentation markdown/fandoc text
 */
export class CFandoc extends compilerDoc.DocFandoc {
  static type$: sys.Type
  static none(): CFandoc;
  toStr(): string;
  summary(): string;
  isEmpty(): boolean;
  toSummary(): CFandoc;
  static make(loc: CLoc, text: string, ...args: unknown[]): CFandoc;
  static wrap(d: compilerDoc.DocFandoc, ...args: unknown[]): CFandoc;
}

/**
 * DocOutStream extends WebOutStream with doc specific
 * section/props
 */
export class DocOutStream extends web.WebOutStream {
  static type$: sys.Type
  trackToNavData(): boolean;
  trackToNavData(it: boolean): void;
  docFull($def: DocDef): this;
  linkDef(target: haystack.Def, dis?: string): this;
  propVal(val: sys.JsObj | null): this;
  defSection(title: string, id?: string): this;
  props(): this;
  propDef($def: DocDef, dis?: string, indentation?: number): this;
  propName(name: sys.JsObj): this;
  propTitle(title: string): this;
  linkTo(link: compilerDoc.DocLink): this;
  prop(name: sys.JsObj, val: sys.JsObj | null): this;
  propPod(pod: compilerDoc.DocPod): this;
  propProto(proto: DocProto): this;
  defSectionEnd(): this;
  docToLink(target: compilerDoc.Doc, dis?: string): compilerDoc.DocLink;
  propsEnd(): this;
  propQuick(path: string, summary: string, dis?: string | null): this;
  docSummary($def: DocDef): this;
  propLib(lib: DocLib, frag?: string | null): this;
  indent(indentation: number): this;
  link(target: compilerDoc.Doc, dis?: string): this;
  static make(out: sys.OutStream, resFiles: sys.Map<string, DocResFile>, ...args: unknown[]): DocOutStream;
  fandoc(doc: compilerDoc.DocFandoc): this;
}

/**
 * CPair
 */
export class CPair extends sys.Obj {
  static type$: sys.Type
  val(): sys.JsObj;
  val(it: sys.JsObj): void;
  name(): string;
  tag(): CDef | null;
  tag(it: CDef | null): void;
  toStr(): string;
  isAccumulate(): boolean;
  tagOrName(): sys.JsObj;
  isInherited(): boolean;
  accumulate(that: CPair): CPair;
  static make(name: string, tag: CDef | null, val: sys.JsObj, ...args: unknown[]): CPair;
}

/**
 * CDefRef is a reference to a def which may be a parameterized
 * generic used in a compose
 */
export class CDefRef extends sys.Obj {
  static type$: sys.Type
  /**
   * File location of usage site
   */
  loc(): CLoc;
  /**
   * Symbol key
   */
  symbol(): CSymbol;
  /**
   * Return symbol
   */
  toStr(): string;
  /**
   * Resolved definition
   */
  deref(): CDef;
}

/**
 * DocProto represents a documentation page for a single
 * prototype
 */
export class DocProto extends compilerDoc.Doc {
  static type$: sys.Type
  implements(): sys.List<DocDef>;
  __implements(it: sys.List<DocDef>): void;
  dis(): string;
  __dis(it: string): void;
  docName(): string;
  __docName(it: string): void;
  renderer(): sys.Type;
  title(): string;
  space(): DocProtoSpace;
  children(): sys.List<DocProto>;
  isSimple(): boolean;
}

export class DocAppendixIndexRenderer extends DefDocRenderer {
  static type$: sys.Type
  writeContent(): void;
  static doWriteContent(out: DocOutStream, space: DocAppendixSpace): void;
  static make(env: DefDocEnv, out: DocOutStream, doc: DocAppendixIndex, ...args: unknown[]): DocAppendixIndexRenderer;
}

/**
 * Base class for DefCompiler steps
 */
export class DefCompilerStep extends sys.Obj {
  static type$: sys.Type
  compiler(): DefCompiler;
  compiler(it: DefCompiler): void;
  err2(msg: string, loc1: CLoc, loc2: CLoc, err?: sys.Err | null): CompilerErr;
  err(msg: string, loc: CLoc, err?: sys.Err | null): CompilerErr;
  ns(): haystack.Namespace;
  index(): CIndex;
  run(): void;
  addDef(loc: CLoc, lib: CLib, symbol: CSymbol, dict: haystack.Dict): CDef | null;
  etc(): CIndexEtc;
  eachLib(f: ((arg0: CLib) => void)): void;
  eachDef(f: ((arg0: CDef) => void)): void;
  docEnv(): DefDocEnv;
  static make(compiler: DefCompiler, ...args: unknown[]): DefCompilerStep;
  parseSymbol(tagName: string, val: sys.JsObj | null, loc: CLoc): CSymbol | null;
  info(msg: string): void;
}

/**
 * DocFile
 */
export class DocFile extends sys.Obj {
  static type$: sys.Type
  title(): string;
  uri(): sys.Uri;
  content(): sys.Buf;
  static make(uri: sys.Uri, title: string, content: sys.Buf, ...args: unknown[]): DocFile;
}

/**
 * DocTaxonomyAppendix
 */
export class DocTaxonomyAppendix extends DocAppendix {
  static type$: sys.Type
  def(): DocDef;
  renderer(): sys.Type;
  docName(): string;
  static make($def: DocDef, ...args: unknown[]): DocTaxonomyAppendix;
  group(): string;
  summary(): sys.JsObj;
}

/**
 * CIndexEtc
 */
export class CIndexEtc extends sys.Obj {
  static type$: sys.Type
  lib(): CDef;
  isDef(): CDef;
  space(): CDef;
  ref(): CDef;
  val(): CDef;
  version(): CDef;
  enum(): CDef;
  tags(): CDef;
  marker(): CDef;
  association(): CDef;
  phenomenon(): CDef;
  point(): CDef;
  feature(): CDef;
  relationship(): CDef;
  static make(index: CIndex, ...args: unknown[]): CIndexEtc;
  process(): CDef;
  quantity(): CDef;
  equip(): CDef;
  baseUri(): CDef;
  choice(): CDef;
  entity(): CDef;
}

/**
 * DocNavData encodes triples of level+uri+display for
 * navigation. It is used to encode the breadcrumb and a
 * navigation menu for each page.  We encode it into a simple
 * plaintext comment for external application use.
 */
export class DocNavData extends sys.Obj {
  static type$: sys.Type
  /**
   * Add link relative to current document
   */
  add(uri: sys.Uri, title: string, level?: number): this;
  /**
   * Encode items to plain text
   */
  encode(): string;
  /**
   * Is the sidebar tree empty
   */
  isEmpty(): boolean;
  static make(...args: unknown[]): DocNavData;
}

/**
 * DefChapterRenderer
 */
export class DefChapterRenderer extends DefDocRenderer {
  static type$: sys.Type
  writeContent(): void;
  buildNavData(): void;
  static make(env: compilerDoc.DocEnv, out: DocOutStream, doc: compilerDoc.DocChapter, ...args: unknown[]): DefChapterRenderer;
  writePrevNext(): void;
}

export class DocProtoRenderer extends DefDocRenderer {
  static type$: sys.Type
  writeContent(): void;
  static make(env: DefDocEnv, out: DocOutStream, doc: DocProto, ...args: unknown[]): DocProtoRenderer;
}

/**
 * DefCompiler
 */
export class DefCompiler extends sys.Obj {
  static type$: sys.Type
  /**
   * Default input libraries
   */
  inputs(): sys.List<CompilerInput>;
  inputs(it: sys.List<CompilerInput>): void;
  /**
   * Include data specs in output documentation
   */
  includeSpecs(): boolean;
  includeSpecs(it: boolean): void;
  /**
   * Callback used to filter which defs are included in the docs.
   * If a lib def itself returns false then all of its defs are
   * excluded too.  The default implementation only checks for
   * the `nodoc` marker. If you override the default implmentation,
   * then your custom callback must check for `nodoc` too.
   */
  includeInDocs(): ((arg0: CDef) => boolean);
  includeInDocs(it: ((arg0: CDef) => boolean)): void;
  /**
   * Error and warning logging
   */
  log(): sys.Log;
  log(it: sys.Log): void;
  ns(): haystack.Namespace | null;
  ns(it: haystack.Namespace | null): void;
  /**
   * Output directory for compiler/documentation results
   */
  outDir(): sys.File | null;
  outDir(it: sys.File | null): void;
  /**
   * Factory to use for building Namespace and Features
   */
  factory(): def.DefFactory;
  factory(it: def.DefFactory): void;
  /**
   * Callback for each document file generated.  If left as null
   * it will output a file to the `outDir` using the ".html" file
   * extension.  If non-null then no file extension is applied
   * and only the body content is generated
   */
  onDocFile(): ((arg0: DocFile) => void) | null;
  onDocFile(it: ((arg0: DocFile) => void) | null): void;
  docEnv(): DefDocEnv | null;
  docEnv(it: DefDocEnv | null): void;
  /**
   * Factory to create DefDocEnv if generating documentation
   */
  docEnvFactory(): ((arg0: DefDocEnvInit) => DefDocEnv) | null;
  docEnvFactory(it: ((arg0: DefDocEnvInit) => DefDocEnv) | null): void;
  /**
   * Run the pipeline with the given steps
   */
  run(steps: sys.List<DefCompilerStep>): this;
  /**
   * Compile all the formats and docs
   */
  compileAll(): this;
  /**
   * Log info message
   */
  info(msg: string): void;
  /**
   * Compile into dist zip file
   */
  compileDist(): this;
  /**
   * Initialize output directory
   */
  initOutDir(): sys.File;
  /**
   * Callback to undefine specific defs during compilation
   */
  undefine($def: haystack.Dict): boolean;
  /**
   * Log err message
   */
  warn(msg: string, loc: CLoc, cause?: sys.Err | null): void;
  /**
   * Log err message with two locations of duplicate identifiers
   */
  err2(msg: string, loc1: CLoc, loc2: CLoc, cause?: sys.Err | null): CompilerErr;
  /**
   * Compile into DefDocEnv model (but don't generate HTML files)
   */
  compileDocEnv(): DefDocEnv;
  /**
   * Compile into one or more formats from command line Main
   */
  compileMain(formats: sys.List<string>, protos: boolean): this;
  /**
   * Compile into HTML documentation under outDir
   */
  compileDocs(): this;
  /**
   * Compile to a Namespace instance
   */
  compileNamespace(): haystack.Namespace;
  /**
   * Constructor
   */
  static make(...args: unknown[]): DefCompiler;
  /**
   * Log err message
   */
  err(msg: string, loc: CLoc, cause?: sys.Err | null): CompilerErr;
  /**
   * Common frontend steps
   */
  frontend(): sys.List<DefCompilerStep>;
  /**
   * Compile pods to an index
   */
  compileIndex(): CIndex;
}

/**
 * Index of all definitions
 */
export class CIndex extends sys.Obj {
  static type$: sys.Type
  /**
   * Quick access to various defs
   */
  etc(): CIndexEtc;
  etc(it: CIndexEtc): void;
  /**
   * All defs sorted by symbol name
   */
  defs(): sys.List<CDef>;
  defs(it: sys.List<CDef>): void;
  /**
   * All defs by name (collisions removed)
   */
  defsMap(): sys.Map<string, CDef>;
  defsMap(it: sys.Map<string, CDef>): void;
  /**
   * Libs sorted by name
   */
  libs(): sys.List<CLib>;
  libs(it: sys.List<CLib>): void;
  /**
   * Return set of markers to implement usage of this term
   */
  implements($def: CDef): sys.List<CDef> | null;
  /**
   * If def is an association return list of defs which use it as
   * as tag
   */
  associationOn($def: CDef): sys.List<CDef>;
  /**
   * Lookup def by symbol
   */
  def(symbol: string, checked?: boolean): CDef | null;
  ns(): haystack.Namespace;
  /**
   * Return all subtypes
   */
  subtypes($def: CDef): sys.List<CDef>;
  hasProtos(): boolean;
  /**
   * Features sorted by name
   */
  features(): sys.List<CDef>;
  protos(): sys.List<CProto>;
  nsMap(list: sys.List<haystack.Def>): sys.List<CDef>;
}

/**
 * SymbolTest
 */
export class SymbolTest extends sys.Test {
  static type$: sys.Type
  verifyKey(symbol: CSymbol, str: string, parts: sys.List<CSymbol>): void;
  verifyName(symbol: CSymbol, str: string): void;
  verifySymbol(symbol: CSymbol, type: haystack.SymbolType, str: string, parts: sys.List<CSymbol>): void;
  static make(...args: unknown[]): SymbolTest;
  test(): void;
  verifySymbolErr(s: string): void;
  parse(s: string): CSymbol;
  verifyConjunct(symbol: CSymbol, str: string, parts: sys.List<CSymbol>): void;
}

/**
 * DefDocEnv is the defc implementatin of DocEnv
 */
export class DefDocEnv extends compilerDoc.DocEnv {
  static type$: sys.Type
  libsMap(): sys.Map<string, DocLib>;
  /**
   * Lib spaces
   */
  libs(): sys.List<DocLib>;
  /**
   * Underlying namespace of defs
   */
  ns(): haystack.Namespace;
  spacesMap(): sys.Map<string, compilerDoc.DocSpace>;
  defsMap(): sys.Map<string, DocDef>;
  /**
   * Timestamp when docs generated
   */
  ts(): sys.DateTime;
  /**
   * Lookup a library by name
   */
  lib(name: string, checked?: boolean): DocLib | null;
  /**
   * Lookup a def document by name
   */
  def(symbol: string, checked?: boolean): DocDef | null;
  /**
   * Resolve Def to its DocDef, return null if def is
   * undocumented
   */
  resolve(d: haystack.Def): DocDef | null;
  /**
   * Resolve a section title/id to an explanation
   */
  linkSectionTitle(from$: compilerDoc.Doc, title: string): sys.Uri | null;
  /**
   * Iterate only top-level chapter toc links
   */
  walkChapterTocTopOnly(from$: compilerDoc.Doc, target: compilerDoc.Doc, f: ((arg0: compilerDoc.DocHeading, arg1: sys.Uri) => void)): void;
  /**
   * Lookup a space by name
   */
  space(name: string, checked?: boolean): compilerDoc.DocSpace | null;
  /**
   * Return all subtypes
   */
  subtypes($def: DocDef): sys.List<DocDef>;
  /**
   * Filename to use the CSS include
   */
  cssFilename(): string;
  /**
   * Direct or indirect subtypes organized into indent tree
   */
  subtypeTree($def: DocDef): DocDefTree;
  /**
   * Find all the def docs that match given predicate
   */
  findDefs(f: ((arg0: DocDef) => boolean)): sys.List<DocDef>;
  /**
   * Return all supertypes
   */
  supertypes($def: DocDef): sys.List<DocDef>;
  /**
   * Hook to use our own HtmlDocWriter subclass
   */
  initFandocHtmlWriter(out: sys.OutStream): fandoc.HtmlDocWriter;
  /**
   * List all tags marked as `docSection` such as tags, quantities.
   */
  associations(parent: DocDef, association: DocDef): sys.List<DocDef>;
  /**
   * Return if the given def tag should be shown in the meta data
   */
  includeTagInMetaSection(base: haystack.Def, tag: DocDef): boolean;
  /**
   * Hook to customize the renderer for the given document
   */
  renderer(doc: compilerDoc.Doc): sys.Type;
  /**
   * List all all associations to generate a documentation
   * section. These are marked with `docAssociation` such as tags,
   * quantities.
   */
  docAssociations(): sys.List<DocDef>;
  /**
   * Footer for documentation pages to indicate version/timestamp
   */
  footer(): string;
  /**
   * Extended link shortcuts
   * - [equip](equip) => lib-phIoT/equip
   * - [tz](tz)    => lib-ph/tz  (tags trump funcs)
   * - [tz()](tz())  => lib-core/func~tz  (force func to trump tags)
   */
  link(from$: compilerDoc.Doc, link: string, checked?: boolean): compilerDoc.DocLink | null;
  /**
   * Resolve Def list to list of DocDef, silently ignore
   * undocumented defs
   */
  resolveList(list: sys.List<haystack.Def>, sort: boolean): sys.List<DocDef>;
  /**
   * Lookup manual space by name
   */
  manual(name: string, checked?: boolean): compilerDoc.DocPod | null;
  /**
   * Supertypes organized into indent tree
   */
  supertypeTree($def: DocDef): DocDefTree;
  /**
   * Top index with our custom index renderer
   */
  topIndex(): compilerDoc.DocTopIndex;
  /**
   * Check embedded image link in a document.  If it maps to a
   * resource file we should include, then return the file. 
   * Otherwise raise warning exception.
   */
  imageLink(from$: compilerDoc.Doc, link: string, loc: compilerDoc.DocLoc): DocResFile | null;
  /**
   * Theme
   */
  theme(): compilerDoc.DocTheme;
  /**
   * Generate full html envelope or only content div
   */
  genFullHtml(): boolean;
  /**
   * Constructor
   */
  static make(init: DefDocEnvInit, ...args: unknown[]): DefDocEnv;
  /**
   * Rendering in this framework requires DocOutStream
   */
  render(out: web.WebOutStream, doc: compilerDoc.Doc): void;
  /**
   * Iterate chapter toc links
   */
  walkChapterToc(from$: compilerDoc.Doc, target: compilerDoc.Doc, f: ((arg0: compilerDoc.DocHeading, arg1: sys.Uri) => void)): void;
  /**
   * Documentation web site title
   */
  siteDis(): string;
}

export class CompilerInputType extends sys.Enum {
  static type$: sys.Type
  static lib(): CompilerInputType;
  /**
   * List of CompilerInputType values indexed by ordinal
   */
  static vals(): sys.List<CompilerInputType>;
  static manual(): CompilerInputType;
  /**
   * Return the CompilerInputType instance for the specified
   * name.  If not a valid name and checked is false return null,
   * otherwise throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): CompilerInputType;
}

export class DocProtoIndexRenderer extends DefDocRenderer {
  static type$: sys.Type
  writeContent(): void;
  static make(env: DefDocEnv, out: DocOutStream, doc: DocProtoIndex, ...args: unknown[]): DocProtoIndexRenderer;
}

/**
 * CDef
 */
export class CDef extends sys.Obj {
  static type$: sys.Type
  /**
   * Symbol key
   */
  symbol(): CSymbol;
  /**
   * Parent lib
   */
  lib(): CLib;
  lib(it: CLib): void;
  /**
   * Flattened list of all defs which fit this instance including
   * this (Taxonify)
   */
  inheritance(): sys.List<CDef> | null;
  inheritance(it: sys.List<CDef> | null): void;
  /**
   * Children prototypes
   */
  children(): sys.List<CProto> | null;
  children(it: sys.List<CProto> | null): void;
  /**
   * Declared only supertypes (Taxonify)
   */
  supertypes(): sys.List<CDef> | null;
  supertypes(it: sys.List<CDef> | null): void;
  /**
   * Normalized meta computed in Resolve, Normalize
   */
  meta(): sys.Map<string, CPair> | null;
  meta(it: sys.Map<string, CPair> | null): void;
  /**
   * Resolved defs for each part in the symbol computed in
   * Resolve
   */
  parts(): CDefParts | null;
  parts(it: CDefParts | null): void;
  /**
   * If run thru GenDocEnv
   */
  doc(): DocDef | null;
  doc(it: DocDef | null): void;
  /**
   * File location of source definition
   */
  loc(): CLoc;
  /**
   * To pass thru DefBuilder via BDef
   */
  aux(): sys.JsObj | null;
  aux(it: sys.JsObj | null): void;
  /**
   * Bit mask of key inheritance types (Taxonify)
   */
  flags(): number;
  flags(it: number): void;
  /**
   * Documentation computed in Normalize
   */
  fandoc(): CFandoc;
  fandoc(it: CFandoc): void;
  /**
   * Declared meta from source
   */
  declared(): haystack.Dict;
  /**
   * Once a def is put in fault its skipped from further
   * processing
   */
  fault(): boolean;
  fault(it: boolean): void;
  isRelationship(): boolean;
  /**
   * Is this the library def itself
   */
  isLib(): boolean;
  /**
   * Is nodoc flag configured
   */
  isNoDoc(): boolean;
  /**
   * Symbol type (which infers def type)
   */
  type(): haystack.SymbolType;
  /**
   * Return symbol name
   */
  dis(): string;
  /**
   * Does this def have the given tag
   */
  has(name: string): boolean;
  /**
   * Return symbol name
   */
  toStr(): string;
  /**
   * Actual def from namespace
   */
  actual(ns: haystack.Namespace): haystack.Def;
  /**
   * Is feature key
   */
  isKey(): boolean;
  /**
   * Return if this def is a fit/subtype of that
   */
  fits(that: CDef): boolean;
  /**
   * Simple name
   */
  name(): string;
  isMarker(): boolean;
  /**
   * Sort by symbol name
   */
  compare(that: sys.JsObj): number;
  isAssociation(): boolean;
  isList(): boolean;
  /**
   * Get meta CPair value
   */
  get(name: string): sys.JsObj | null;
  /**
   * Compose def parts
   */
  conjunct(): CConjunctParts;
  /**
   * Key def parts
   */
  key(): CKeyParts;
  isChoice(): boolean;
  /**
   * Set meta CPair
   */
  set(tag: CDef, val: sys.JsObj): void;
  isEntity(): boolean;
  isVal(): boolean;
  isRef(): boolean;
  isFeature(): boolean;
}

/**
 * LibInput defines one library to scan and compile
 */
export class LibInput extends CompilerInput {
  static type$: sys.Type
  /**
   * Return location to use for library itself
   */
  loc(): CLoc;
  /**
   * Adapt a dict without a `def` tag to its proper def declaration
   */
  adapt(c: DefCompiler, dict: haystack.Dict, loc: CLoc): haystack.Dict | null;
  /**
   * Scan the lib def meta and return Dict or CompilerErr. See
   * parseLibMetaFile utility.
   */
  scanMeta(c: DefCompiler): sys.JsObj;
  /**
   * Reflection inputs
   */
  scanReflects(c: DefCompiler): sys.List<ReflectInput>;
  /**
   * Return trio files to scan
   */
  scanFiles(c: DefCompiler): sys.List<sys.File>;
  /**
   * Lib type
   */
  inputType(): CompilerInputType;
  /**
   * Additional def inputs which are not in files or reflection
   */
  scanExtra(c: DefCompiler): sys.List<haystack.Dict>;
  static make(...args: unknown[]): LibInput;
}

/**
 * DocProtoSpace is the space for all the DocProtos
 */
export class DocProtoSpace extends compilerDoc.DocSpace {
  static type$: sys.Type
  index(): DocProtoIndex;
  protos(): sys.List<DocProto>;
  eachDoc(f: ((arg0: compilerDoc.Doc) => void)): void;
  spaceName(): string;
  doc(docName: string, checked?: boolean): compilerDoc.Doc | null;
  static make(protos: sys.List<DocProto>, ...args: unknown[]): DocProtoSpace;
}

/**
 * CSymbol
 */
export class CSymbol extends sys.Obj {
  static type$: sys.Type
  /**
   * Haystack value we wrap
   */
  val(): haystack.Symbol;
  /**
   * Parts based on type:
   * - tag: `[,]`
   * - conjunct: `[foo, bar]`
   * - compose: `[parent, child]`
   * - key: `[feature, name]`
   */
  parts(): sys.List<CSymbol>;
  toStr(): string;
  /**
   * Symbol type
   */
  type(): haystack.SymbolType;
  equals(that: sys.JsObj | null): boolean;
  /**
   * Simple name
   */
  name(): string;
  hash(): number;
}

/**
 * Lib Manual
 */
export class DocLibManual extends compilerDoc.Doc {
  static type$: sys.Type
  chapter(): compilerDoc.DocChapter;
  lib(): DocLib;
  renderer(): sys.Type;
  heading(id: string, checked?: boolean): compilerDoc.DocHeading | null;
  title(): string;
  space(): compilerDoc.DocSpace;
  docName(): string;
  static make(lib: DocLib, chapter: compilerDoc.DocChapter, ...args: unknown[]): DocLibManual;
}

export class DocListAppendixRenderer extends DefDocRenderer {
  static type$: sys.Type
  writeContent(): void;
  static make(env: DefDocEnv, out: DocOutStream, doc: DocListAppendix, ...args: unknown[]): DocListAppendixRenderer;
}

/**
 * CConjunctParts
 */
export class CConjunctParts extends CDefParts {
  static type$: sys.Type
  tags(): sys.List<CDef>;
  tags(it: sys.List<CDef>): void;
  conjunct(): CConjunctParts;
  static make($def: CDef, tags: sys.List<CDef>, ...args: unknown[]): CConjunctParts;
}

/**
 * Lib Index Doc
 */
export class DocLibIndex extends DocDef {
  static type$: sys.Type
  renderer(): sys.Type;
  title(): string;
  docName(): string;
  static make(lib: DocLib, ...args: unknown[]): DocLibIndex;
  isSpaceIndex(): boolean;
}

/**
 * CLib
 */
export class CLib extends CDef {
  static type$: sys.Type
  defs(): sys.Map<CSymbol, CDef>;
  defs(it: sys.Map<CSymbol, CDef>): void;
  depends(): sys.List<CSymbol>;
  depends(it: sys.List<CSymbol>): void;
  input(): LibInput;
  defXs(): sys.List<CDefX>;
  defXs(it: sys.List<CDefX>): void;
  /**
   * Return simple name
   */
  dis(): string;
}

/**
 * Reflect input is used to generate defs from Fantom
 * reflection of types, methods, and fields.  Callbacks will
 * pass null for slot if working at the type level.
 */
export class ReflectInput extends sys.Obj {
  static type$: sys.Type
  /**
   * Method facet type to reflect or null to skip methods
   */
  methodFacet(): sys.Type | null;
  /**
   * Callback to add additional meta
   */
  addMeta(symbol: haystack.Symbol, acc: sys.Map<string, sys.JsObj>): void;
  /**
   * Field facet type to reflect or null to skip fields
   */
  fieldFacet(): sys.Type | null;
  /**
   * Map to type/slot def symbol
   */
  toSymbol(slot: sys.Slot | null): haystack.Symbol;
  /**
   * Callback after a type/slot has been mapped to def
   */
  onDef(slot: sys.Slot | null, $def: CDef): void;
  /**
   * Type to reflect
   */
  type(): sys.Type;
  /**
   * Type facet to reflect or null to skip reflection at type
   * level
   */
  typeFacet(): sys.Type | null;
  static make(...args: unknown[]): ReflectInput;
}

/**
 * DocDefTree
 */
export class DocDefTree extends sys.Obj {
  static type$: sys.Type
  parent(): DocDefTree | null;
  parent(it: DocDefTree | null): void;
  def(): DocDef;
  def(it: DocDef): void;
  add($def: DocDef): DocDefTree;
  compare(that: sys.JsObj): number;
  invert(): DocDefTree;
  isEmpty(): boolean;
  doEach(indent: number, f: ((arg0: number, arg1: DocDef) => void)): void;
  each(f: ((arg0: number, arg1: DocDef) => void)): void;
  static make(parent: DocDefTree | null, $def: DocDef, ...args: unknown[]): DocDefTree;
}

export class DocAppendixSpace extends compilerDoc.DocSpace {
  static type$: sys.Type
  docs(): sys.List<DocAppendix>;
  eachDoc(f: ((arg0: compilerDoc.Doc) => void)): void;
  spaceName(): string;
  doc(docName: string, checked?: boolean): compilerDoc.Doc | null;
  static make(docs: sys.List<DocAppendix>, ...args: unknown[]): DocAppendixSpace;
}

export class DefTopIndexRenderer extends DefDocRenderer {
  static type$: sys.Type
  writeContent(): void;
  static make(env: compilerDoc.DocEnv, out: DocOutStream, doc: compilerDoc.DocTopIndex, ...args: unknown[]): DefTopIndexRenderer;
}

/**
 * CProto models a prototype instance from a definition's
 * children tags
 */
export class CProto extends sys.Obj {
  static type$: sys.Type
  /**
   * Definitions implemented by this prototype
   */
  implements(): sys.List<CDef>;
  implements(it: sys.List<CDef>): void;
  /**
   * Location if not derived during auto-generation
   */
  loc(): CLoc | null;
  loc(it: CLoc | null): void;
  /**
   * Unique hash key without regard to tag ordering
   */
  hashKey(): string;
  /**
   * Display string for prototype tags
   */
  dis(): string;
  /**
   * Encoded name for documentation file
   */
  docName(): string;
  /**
   * Children of the prototype based on implemented defs (set
   * after make)
   */
  children(): sys.List<CProto> | null;
  children(it: sys.List<CProto> | null): void;
  /**
   * Prototype tags from Namespace.proto
   */
  dict(): haystack.Dict;
  /**
   * If run thru GenDocEnv
   */
  doc(): DocProto | null;
  doc(it: DocProto | null): void;
  /**
   * String representation
   */
  toStr(): string;
  static toHashKey(d: haystack.Dict): string;
}

/**
 * DocDef represents a documentation page for a single
 * definition
 */
export class DocDef extends compilerDoc.Doc {
  static type$: sys.Type
  rendererRef(): concurrent.AtomicRef;
  loc(): CLoc;
  lib(): DocLib;
  def(): haystack.Def;
  docFull(): CFandoc;
  subtitleRef(): concurrent.AtomicRef;
  docSummary(): CFandoc;
  symbol(): haystack.Symbol;
  renderer(): sys.Type;
  compare(that: sys.JsObj): number;
  type(): haystack.SymbolType;
  title(): string;
  space(): compilerDoc.DocSpace;
  dis(): string;
  docName(): string;
  children(): sys.List<DocProto>;
  isCode(): boolean;
  missing(name: string): boolean;
  has(name: string): boolean;
  toStr(): string;
  breadcrumb(): string;
  subtitle(): string | null;
  name(): string;
}

/**
 * DefDocEnvInit
 */
export class DefDocEnvInit extends sys.Obj {
  static type$: sys.Type
  ns(): haystack.Namespace;
  ns(it: haystack.Namespace): void;
  defsMap(): sys.Map<string, DocDef>;
  defsMap(it: sys.Map<string, DocDef>): void;
  spacesMap(): sys.Map<string, compilerDoc.DocSpace>;
  spacesMap(it: sys.Map<string, compilerDoc.DocSpace>): void;
  static make(f: ((arg0: DefDocEnvInit) => void), ...args: unknown[]): DefDocEnvInit;
}

/**
 * Compilation unit (typically a pod)
 */
export class CUnit extends sys.Obj {
  static type$: sys.Type
  name(): string;
  files(): sys.List<sys.File>;
  files(it: sys.List<sys.File>): void;
  includes(): sys.List<CUnit>;
  static make(name: string, ...args: unknown[]): CUnit;
}

/**
 * DocListAppendix
 */
export class DocListAppendix extends DocAppendix {
  static type$: sys.Type
  renderer(): sys.Type;
  static make(...args: unknown[]): DocListAppendix;
  group(): string;
  include(d: DocDef): boolean;
  collect(env: DefDocEnv): sys.List<DocDef>;
}

/**
 * DocResFile
 */
export class DocResFile extends sys.Obj {
  static type$: sys.Type
  spaceName(): string;
  docName(): string;
  file(): sys.File;
  qname(): string;
  toStr(): string;
  static make(spaceName: string, docName: string, file: sys.File, ...args: unknown[]): DocResFile;
}

/**
 * StdDocDefRenderer
 */
export class StdDocDefRenderer extends DefDocRenderer {
  static type$: sys.Type
  writeContent(): void;
  static make(env: compilerDoc.DocEnv, out: web.WebOutStream, doc: DocDef, ...args: unknown[]): StdDocDefRenderer;
  writeTreeSection(name: string, tree: DocDefTree): void;
  writeConjunct(): void;
  writeUsageSection(): void;
  writeEnumSection(): void;
  doc(): DocDef;
  writeAssociationSections(): void;
}

/**
 * DocAppendix (base class for documents)
 */
export class DocAppendix extends compilerDoc.Doc {
  static type$: sys.Type
  title(): string;
  space(): DocAppendixSpace;
  static make(...args: unknown[]): DocAppendix;
  group(): string;
  summary(): sys.JsObj;
}

export class DocTaxonomyAppendixRenderer extends DefDocRenderer {
  static type$: sys.Type
  writeContent(): void;
  static make(env: DefDocEnv, out: DocOutStream, doc: DocTaxonomyAppendix, ...args: unknown[]): DocTaxonomyAppendixRenderer;
}

/**
 * CKeyParts
 */
export class CKeyParts extends CDefParts {
  static type$: sys.Type
  feature(): CDef;
  feature(it: CDef): void;
  static make($def: CDef, feature: CDef, ...args: unknown[]): CKeyParts;
  key(): CKeyParts;
}

/**
 * Source code location
 */
export class CLoc extends compilerDoc.DocLoc {
  static type$: sys.Type
  /**
   * Compiler inputs
   */
  static inputs(): CLoc;
  /**
   * None or unknown location
   */
  static none(): CLoc;
  /**
   * Constructor for file
   */
  static makeFile(file: sys.File, ...args: unknown[]): CLoc;
  /**
   * Make file util::FileLoc
   */
  static makeFileLoc(loc: util.FileLoc, ...args: unknown[]): CLoc;
  /**
   * Constructor
   */
  static make(file: string, line?: number, ...args: unknown[]): CLoc;
}

/**
 * Main routine
 */
export class Main extends util.AbstractMain {
  static type$: sys.Type
  inputs(): sys.List<string> | null;
  inputs(it: sys.List<string> | null): void;
  outDir(): sys.File;
  outDir(it: sys.File): void;
  output(): string;
  output(it: string): void;
  specs(): boolean;
  specs(it: boolean): void;
  protos(): boolean;
  protos(it: boolean): void;
  version(): boolean;
  version(it: boolean): void;
  usage(out?: sys.OutStream): number;
  run(): number;
  static make(...args: unknown[]): Main;
}

