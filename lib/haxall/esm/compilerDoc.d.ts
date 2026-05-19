import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as fandoc from './fandoc.js';
import * as syntax from './syntax.js';
import * as util from './util.js';
import * as web from './web.js';

/**
 * DocErrHandler is responsible for handling errors encountered
 * during doc compilation including broken links and fandoc
 * format errors.
 */
export class DocErrHandler extends sys.Obj {
  static type$: sys.Type
  /**
   * Accumulated list of errors reported
   */
  errs(): sys.List<DocErr>;
  errs(it: sys.List<DocErr>): void;
  /**
   * Handle a documentation error.  Default implementation logs
   * it to stdout and stores it in {@link errs | errs}.
   */
  onErr(err: DocErr): void;
  static make(...args: unknown[]): DocErrHandler;
}

/**
 * Doc is the base class for document types.  All Docs are
 * organized under a {@link DocSpace | DocSpace} for  a two
 * level namespace of "spaceName/docName".
 * 
 * Subclasses include:
 * - {@link DocPodIndex | DocPodIndex}: pod index
 * - {@link DocType | DocType}: type API
 * - {@link DocChapter | DocChapter}: chapter in manual
 * - {@link DocRes | DocRes}: resource file
 * - {@link DocSrc | DocSrc}: source file
 */
export class Doc extends sys.Obj {
  static type$: sys.Type
  /**
   * Return docName by default
   */
  toStr(): string;
  /**
   * Get the default {@link DocRenderer | DocRenderer} type to use
   * for renderering this document.
   */
  renderer(): sys.Type;
  /**
   * Get a chapter heading for this document by its anchor id
   */
  heading(id: string, checked?: boolean): DocHeading | null;
  /**
   * Callback to handle a search engine crawl over this document.
   * Call one of the `addX` methods on the crawler for each chunk
   * of text in the document to be indexed.
   */
  onCrawl(crawler: DocCrawler): void;
  /**
   * Default title for the document
   */
  title(): string;
  /**
   * Convenience to check if this is  top-level index document.
   * Top index often requires a bit of special handling since it
   * lives a level above the standard two level namespace.
   */
  isTopIndex(): boolean;
  /**
   * Space which contains this document
   */
  space(): DocSpace;
  /**
   * Name which uniquely identifies this document under its
   * space.
   */
  docName(): string;
  /**
   * Return if this is the index document of the space.
   */
  isSpaceIndex(): boolean;
  /**
   * String to use for this document in the breadcrumb. By
   * default this is the {@link docName | docName}.
   */
  breadcrumb(): string;
  /**
   * Should links to this document be formatted as code
   * identifier
   */
  isCode(): boolean;
  static make(...args: unknown[]): Doc;
}

/**
 * DocLink models a link between two documents.
 * 
 * The following link formats are built-in:
 * ```
 * Format             Display     Links To
 * ------             -------     --------
 * pod::index         pod         absolute link to pod index
 * pod::pod-doc       pod         absolute link to pod doc chapter
 * pod::Type          Type        absolute link to type qname
 * pod::Types.slot    Type.slot   absolute link to slot qname
 * pod::Chapter       Chapter     absolute link to book chapter
 * pod::Chapter#frag  Chapter     absolute link to book chapter anchor
 * Type               Type        pod relative link to type
 * Type.slot          Type.slot   pod relative link to slot
 * slot               slot        type relative link to slot
 * Chapter            Chapter     pod relative link to book chapter
 * Chapter#frag       Chapter     pod relative link to chapter anchor
 * #frag              heading     chapter relative link to anchor
 * ```
 */
export class DocLink extends sys.Obj {
  static type$: sys.Type
  /**
   * Optional fragment in the link document
   */
  frag(): string | null;
  /**
   * Target document
   */
  target(): Doc;
  /**
   * Display text for the anchor
   */
  dis(): string;
  /**
   * Document we are linking from
   */
  from(): Doc;
  /**
   * If link resolves to an absolute URI
   */
  absUri(): sys.Uri | null;
  /**
   * Debug string representation
   */
  toStr(): string;
  /**
   * Construct an absolute link such as "https://foo/"
   */
  static makeAbsUri(from$: Doc, uri: sys.Uri, dis: string, ...args: unknown[]): DocLink;
  /**
   * Construct with from doc, dis text, target document, and
   * optional fragment identifier
   */
  static make(from$: Doc, target: Doc, dis?: string, frag?: string | null, ...args: unknown[]): DocLink;
}

/**
 * DocSlot models the documentation of a {@link sys.Slot | sys::Slot}.
 */
export class DocSlot extends sys.Obj {
  static type$: sys.Type
  /**
   * Source code location of this slot
   */
  loc(): DocLoc;
  /**
   * Type which defines the slot
   */
  parent(): DocTypeRef;
  /**
   * Return true if annotated as NoDoc
   */
  isNoDoc(): boolean;
  /**
   * Flags mask - see {@link DocFlags | DocFlags}
   */
  flags(): number;
  /**
   * Facets defined on this slot
   */
  facets(): sys.List<DocFacet>;
  /**
   * Qualified name formatted as "sys::Str.replace".
   */
  qname(): string;
  /**
   * Simple name of the slot such as "equals".
   */
  name(): string;
  /**
   * Fandoc documentation string
   */
  doc(): DocFandoc;
  /**
   * Return if given facet is defined on slot
   */
  hasFacet(qname: string): boolean;
  /**
   * Is this a DocField
   */
  isField(): boolean;
  /**
   * Display name is Type.name
   */
  dis(): string;
  /**
   * Is this a DocMethod
   */
  isMethod(): boolean;
  /**
   * Return given facet
   */
  facet(qname: string, checked?: boolean): DocFacet | null;
}

/**
 * DocMethod models the documentation of a {@link sys.Method | sys::Method}.
 */
export class DocMethod extends DocSlot {
  static type$: sys.Type
  /**
   * Parameters of the method
   */
  params(): sys.List<DocParam>;
  /**
   * Return type of the method
   */
  returns(): DocTypeRef;
  /**
   * Return false
   */
  isField(): boolean;
  /**
   * Return true
   */
  isMethod(): boolean;
}

export class DocTypeRefTest extends sys.Test {
  static type$: sys.Type
  verifyBasic(t: DocTypeRef, pod: string, name: string, nullable: boolean): void;
  static make(...args: unknown[]): DocTypeRefTest;
  test(): void;
}

/**
 * DocHeader models a heading in a table of contents for
 * pod/chapter.
 */
export class DocHeading extends sys.Obj {
  static type$: sys.Type
  /**
   * Heading level, chapter top-level sections start at level 2
   */
  level(): number;
  __level(it: number): void;
  /**
   * Display title for the heading
   */
  title(): string;
  __title(it: string): void;
  /**
   * Anchor id for heading or null if not available
   */
  anchorId(): string | null;
  __anchorId(it: string | null): void;
  /**
   * Children headings
   */
  children(): sys.List<DocHeading>;
}

/**
 * Renders the index of a pod's documents
 */
export class DocTopIndexRenderer extends DocRenderer {
  static type$: sys.Type
  /**
   * Pod index to render
   */
  index(): DocTopIndex;
  /**
   * Write the content for a top index.  Default organizes pods
   * into manuals and APIs.
   */
  writeContent(): void;
  static make(env: DocEnv, out: web.WebOutStream, doc: DocTopIndex, ...args: unknown[]): DocTopIndexRenderer;
  /**
   * Write manuals table of pod name/links along with shortcut
   * chapter links.
   */
  writeManuals(pods: sys.List<DocPod>): void;
  /**
   * Write API table of pod name/link and summaries.
   */
  writeApis(pods: sys.List<DocPod>): void;
}

/**
 * DocRes models a resource file within a pod.
 */
export class DocRes extends Doc {
  static type$: sys.Type
  /**
   * Pod which contains the resource
   */
  pod(): DocPod;
  /**
   * Uri of the resource file inside the pod
   */
  uri(): sys.Uri;
  /**
   * Throw UnsupportedErr
   */
  renderer(): sys.Type;
  /**
   * Title is the filename
   */
  title(): string;
  /**
   * The space for this doc is {@link pod | pod}
   */
  space(): DocSpace;
  /**
   * Document name under space is filename
   */
  docName(): string;
}

/**
 * UnknownDocErr is raised when resolving a non-existent
 * document.
 */
export class UnknownDocErr extends sys.Err {
  static type$: sys.Type
  /**
   * Constructor
   */
  static make(msg: string, cause?: sys.Err | null, ...args: unknown[]): UnknownDocErr;
}

/**
 * DocCrawler provides an interface to implement by search
 * engine crawlers when crawling a specific document via {@link Doc.onCrawl | Doc.onCrawl}.
 */
export abstract class DocCrawler extends sys.Obj {
  static type$: sys.Type
  /**
   * Add plain, unformatted text to the index for current doc
   */
  addText(str: string): void;
  /**
   * Add fandoc formatted text to the index for current doc
   */
  addFandoc($fandoc: DocFandoc): void;
  /**
   * Add a search keyword with a curated title, summary formatted
   * as fandoc, and an optional fragment anchor within the
   * document. This is used to index API keywords like types,
   * slot name, qnames, etc.  The summary is used only for hit
   * higlighting and should be added to the index itself
   * separately.
   */
  addKeyword(keyword: string, title: string, summary: DocFandoc, anchor: string | null): void;
}

/**
 * DocLoc models a filename / linenumber
 */
export class DocLoc extends sys.Obj {
  static type$: sys.Type
  /**
   * Line number or zero if unknown
   */
  line(): number;
  static unknown(): DocLoc;
  /**
   * Filename location
   */
  file(): string;
  /**
   * Return string representation
   */
  toStr(): string;
  /**
   * Construct with file and line number (zero if unknown)
   */
  static make(file: string, line: number, ...args: unknown[]): DocLoc;
}

/**
 * DocField models the documentation of a {@link sys.Field | sys::Field}.
 */
export class DocField extends DocSlot {
  static type$: sys.Type
  /**
   * Type of the field
   */
  type(): DocTypeRef;
  /**
   * Expression used to initialize the field
   */
  init(): string | null;
  /**
   * Flags for setting method if different from overall field
   * level flags, otherwise null.
   */
  setterFlags(): number | null;
  /**
   * Return true
   */
  isField(): boolean;
  /**
   * Return false
   */
  isMethod(): boolean;
}

/**
 * DocType models the documentation of a {@link sys.Type | sys::Type}.
 */
export class DocType extends Doc {
  static type$: sys.Type
  /**
   * Source code location of this type definition
   */
  loc(): DocLoc;
  /**
   * Pod which defines this type
   */
  pod(): DocPod;
  /**
   * Return true if annotated as NoDoc
   */
  isNoDoc(): boolean;
  /**
   * Flags mask - see {@link DocFlags | DocFlags}
   */
  flags(): number;
  /**
   * Facets defined on this type
   */
  facets(): sys.List<DocFacet>;
  /**
   * Representation of this type definition as a reference
   */
  ref(): DocTypeRef;
  /**
   * Mixins directly implemented by this type
   */
  mixins(): sys.List<DocTypeRef>;
  /**
   * Is this a subclass of `sys::Err`
   */
  isErr(): boolean;
  /**
   * List of the public, documented slots in this type (sorted).
   */
  slots(): sys.List<DocSlot>;
  /**
   * Fandoc documentation string
   */
  doc(): DocFandoc;
  /**
   * Base class inheritance chain where direct subclass is first
   * and `sys::Obj` is last.  If this type is a mixin or this is `sys::Obj`
   * itself then this is an empty list.
   */
  base(): sys.List<DocTypeRef>;
  /**
   * Return if given facet is defined on type
   */
  hasFacet(qname: string): boolean;
  /**
   * Default renderer is {@link DocTypeRenderer | DocTypeRenderer}
   */
  renderer(): sys.Type;
  /**
   * Get slot by name.  If not found return null or raise
   * UknownSlotErr
   */
  slot(name: string, checked?: boolean): DocSlot | null;
  /**
   * Title of the document is the qualified name
   */
  title(): string;
  /**
   * The space for this doc is {@link pod | pod}
   */
  space(): DocSpace;
  /**
   * The document name under space is {@link name | name}
   */
  docName(): string;
  /**
   * Return true
   */
  isCode(): boolean;
  /**
   * Qualified name formatted as "pod::name".
   */
  qname(): string;
  /**
   * Is an facet type
   */
  isFacet(): boolean;
  /**
   * return qname
   */
  toStr(): string;
  /**
   * Index the type summary and all slot docs
   */
  onCrawl(crawler: DocCrawler): void;
  /**
   * Is an enum type
   */
  isEnum(): boolean;
  /**
   * Is an mixin type
   */
  isMixin(): boolean;
  /**
   * Simple name of the type such as "Str".
   */
  name(): string;
  /**
   * Return given facet
   */
  facet(qname: string, checked?: boolean): DocFacet | null;
}

/**
 * DocPod models the documentation of a {@link sys.Pod | sys::Pod}.
 */
export class DocPod extends DocSpace {
  static type$: sys.Type
  /**
   * If this is a manual like docLang, return list of chapters.
   */
  chapters(): sys.List<DocChapter>;
  __chapters(it: sys.List<DocChapter>): void;
  /**
   * Resource files in pod which are used to support the
   * documentation such as images used by the fandoc chapters.
   * Resources can only be located in doc/ sub-directory.
   */
  resList(): sys.List<DocRes>;
  __resList(it: sys.List<DocRes>): void;
  /**
   * File the pod was loaded from
   */
  file(): sys.File;
  __file(it: sys.File): void;
  /**
   * If this pod has an associated pod.fandoc chapter
   */
  podDoc(): DocChapter | null;
  __podDoc(it: DocChapter | null): void;
  /**
   * Summary string for the pod
   */
  summary(): string;
  __summary(it: string): void;
  /**
   * List of the public, documented types in this pod.
   */
  types(): sys.List<DocType>;
  __types(it: sys.List<DocType>): void;
  /**
   * Document which models the index page for this pod
   */
  index(): DocPodIndex;
  __index(it: DocPodIndex): void;
  /**
   * Version number for this pod.
   */
  version(): sys.Version;
  __version(it: sys.Version): void;
  /**
   * Source files in pod which should be included in
   * documentation.
   */
  srcList(): sys.List<DocSrc>;
  __srcList(it: sys.List<DocSrc>): void;
  /**
   * Get the meta name/value pairs for this pod. See [docLang](https://fantom.org/doc/docLang/Pods#meta).
   */
  meta(): sys.Map<string, string>;
  __meta(it: sys.Map<string, string>): void;
  /**
   * Simple name of the pod such as "sys".
   */
  name(): string;
  __name(it: string): void;
  /**
   * Find a chapter by name.  If the chapter doesn't exist and
   * checked is false then return null, otherwise throw Err.
   */
  chapter(chapterName: string, checked?: boolean): DocChapter | null;
  eachDoc(f: ((arg0: Doc) => void)): void;
  /**
   * Find a type by name.  If the type doesn't exist and checked
   * is false then return null, otherwise throw UnknownTypeErr.
   */
  type(typeName: string, checked?: boolean): DocType | null;
  /**
   * Get all types (public, internal, nodoc, etc)
   */
  allTypes(): sys.List<DocType>;
  /**
   * Space name is same as {@link name | name}
   */
  spaceName(): string;
  /**
   * Load from a zip file using the given DocEnv as the  gerror
   * handler
   */
  static load(env: DocEnv | null, file: sys.File): DocPod;
  /**
   * Always return {@link name | name}.
   */
  toStr(): string;
  /**
   * Return resource for filename, or if not available return
   * null/raise exception.  This filenames is always relative to
   * doc/ sub-directory.
   */
  res(filename: string, checked?: boolean): DocRes | null;
  /**
   * Return source code for filename, or if not available return
   * null/raise exception.
   */
  src(filename: string, checked?: boolean): DocSrc | null;
  /**
   * A *manual* pod is a pod with two or more fandoc chapters and
   * no types.
   */
  isManual(): boolean;
  /**
   * Load from a zip file with given error handler
   */
  static loadFile(file: sys.File, onErr: ((arg0: DocErr) => void)): DocPod;
  /**
   * Find the document with the given name.  If not found raise
   * UnknownDocErr or return null based on checked flag. The
   * document namespace of a pod is:
   * - "index": the DocPodIndex
   * - "{type name}": DocType
   * - "{chapter name}": DocChapter
   * - "{filename}": DocRes
   * - "src-{filename}": DocSrc
   */
  doc(name: string, checked?: boolean): Doc | null;
  /**
   * Get the build timestamp or null if not available
   */
  ts(): sys.DateTime | null;
}

/**
 * DocTypeRef models a type reference in a type or slot
 * signature.
 */
export class DocTypeRef extends sys.Obj {
  static type$: sys.Type
  /**
   * Return {@link signature | signature}
   */
  toStr(): string;
  /**
   * Pod name of the type.  For parameterized types this is
   * always pod name of generic class itself.
   */
  pod(): string;
  /**
   * Is this a parameterized generic type such as `Str[]`
   */
  isParameterized(): boolean;
  /**
   * Return the formal signature of this type.  In the case of
   * non-parameterized types the signature is the same as qname.
   */
  signature(): string;
  /**
   * Get nice display name for type which excludes pod name even
   * in parameterized types.
   */
  dis(): string;
  /**
   * Constructor from signature string
   */
  static fromStr(sig: string, checked?: boolean, ...args: unknown[]): DocTypeRef;
  /**
   * Is this one of the generic variable types such as `sys::V`
   */
  isGenericVar(): boolean;
  /**
   * Qualified name formatted as "pod::name".  For parameterized
   * types this is always the type of the generic class itself.
   */
  qname(): string;
  /**
   * Is this a nullable type such as `Str?`
   */
  isNullable(): boolean;
  /**
   * Simple name of the type such as "Str".  For parameterized
   * types this is always name of generic class itself.
   */
  name(): string;
  static make(...args: unknown[]): DocTypeRef;
}

/**
 * DocParam models the documentation of a {@link sys.Param | sys::Param}
 */
export class DocParam extends sys.Obj {
  static type$: sys.Type
  /**
   * Default expression if defined
   */
  def(): string | null;
  /**
   * Type of the parameter
   */
  type(): DocTypeRef;
  /**
   * Name of the parameter
   */
  name(): string;
  toStr(): string;
}

/**
 * DocErr models errors and their locations during doc
 * compilation.
 */
export class DocErr extends sys.Err {
  static type$: sys.Type
  /**
   * Location of the error
   */
  loc(): DocLoc;
  /**
   * Constructor with message, location, and optional cause
   */
  static make(msg: string, loc: DocLoc, cause?: sys.Err | null, ...args: unknown[]): DocErr;
}

/**
 * DocRenderer is base class for rendering a Doc. See {@link writeDoc | writeDoc}
 * for rendering pipeline.
 */
export class DocRenderer extends sys.Obj {
  static type$: sys.Type
  /**
   * Subclass hook to render document specific content. See {@link writeDoc | writeDoc}
   * for rendering pipeline.
   */
  writeContent(): void;
  /**
   * Convenience for `writeLink(linkTo(target, dis, frag))`
   */
  writeLinkTo(target: Doc, dis?: string | null, frag?: string | null): void;
  /**
   * HTML output stream
   */
  out(): web.WebOutStream;
  /**
   * Write an `<a>` element for the given link from this renderer
   * document to another document.  See {@link DocEnv.linkUri | DocEnv.linkUri}.
   */
  writeLink(link: DocLink): void;
  /**
   * Create a DocLink from this renderer doc to the target
   * document.
   */
  linkTo(target: Doc, dis?: string | null, frag?: string | null): DocLink;
  /**
   * Theme to use for rendering chrome and navigation. This field
   * is initialized from {@link DocEnv.theme | DocEnv.theme}.
   */
  theme(): DocTheme;
  /**
   * All subclasses must implement ctor with env, out, doc
   * params.
   */
  static make(env: DocEnv, out: web.WebOutStream, doc: Doc, ...args: unknown[]): DocRenderer;
  /**
   * Render the {@link doc | doc}.  This method delegates to:
   * 1. {@link DocTheme.writeStart | DocTheme.writeStart}
   * 2. {@link DocTheme.writeBreadcrumb | DocTheme.writeBreadcrumb}
   * 3. {@link writeContent | writeContent}
   * 4. {@link DocTheme.writeEnd | DocTheme.writeEnd}
   */
  writeDoc(): void;
  /**
   * Environment with access to model, theme, linking, etc
   */
  env(): DocEnv;
  /**
   * Hook used to map a fandoc link to a doc link
   */
  resolveFandocLink(elem: fandoc.Link, checked?: boolean): DocLink | null;
  /**
   * Write the given fandoc string as HTML.  This method
   * delegates to {@link DocEnv.link | DocEnv.link} and {@link DocEnv.linkUri | DocEnv.linkUri}
   * to resolve links from the current document.
   */
  writeFandoc(doc: DocFandoc): void;
  /**
   * Document to be renderered
   */
  doc(): Doc;
}

/**
 * DocChapter models a fandoc "chapter" in a manual like
 * docLang
 */
export class DocChapter extends Doc {
  static type$: sys.Type
  /**
   * Location for chapter file
   */
  loc(): DocLoc;
  /**
   * Pod which defines this chapter such as "docLang"
   */
  pod(): DocPod;
  /**
   * Qualified name as "pod::name"
   */
  qname(): string;
  /**
   * Fandoc heating metadata
   */
  meta(): sys.Map<string, string>;
  /**
   * Simple name of the chapter such as "Overview" or "pod-doc"
   */
  name(): string;
  /**
   * Chapter contents as Fandoc string
   */
  doc(): DocFandoc;
  /**
   * Top-level chapter headings
   */
  headings(): sys.List<DocHeading>;
  /**
   * Next chapter in TOC order or null if last
   */
  next(): DocChapter | null;
  /**
   * Default renderer is {@link DocChapterRenderer | DocChapterRenderer}
   */
  renderer(): sys.Type;
  /**
   * Chapter number (one-based)
   */
  num(): number;
  /**
   * Previous chapter in TOC order or null if first
   */
  prev(): DocChapter | null;
  /**
   * Title is `meta.title`, or qualified name if not specified.
   */
  title(): string;
  /**
   * The space for this doc is {@link pod | pod}
   */
  space(): DocSpace;
  /**
   * Document name under space is same as {@link name | name}
   */
  docName(): string;
  /**
   * Summary for TOC
   */
  summary(): string;
  /**
   * Return qname
   */
  toStr(): string;
  /**
   * Get a chapter heading by its anchor id or raise
   * NameErr/return null.
   */
  heading(id: string, checked?: boolean): DocHeading | null;
  /**
   * Index the chapter name and body
   */
  onCrawl(crawler: DocCrawler): void;
  /**
   * Return if this chapter is the special "pod-doc" file
   */
  isPodDoc(): boolean;
  /**
   * Use title for breadcrumb
   */
  breadcrumb(): string;
}

/**
 * Renders DocSrc documents.
 * ```
 * <div class='src'>
 *  {SyntaxHtmlWriter.writeLines}
 * </div>
 * ```
 */
export class DocSrcRenderer extends DocRenderer {
  static type$: sys.Type
  /**
   * Source document to renderer
   */
  src(): DocSrc;
  writeContent(): void;
  static make(env: DocEnv, out: web.WebOutStream, doc: DocSrc, ...args: unknown[]): DocSrcRenderer;
}

/**
 * DocSpace manages a namespace of documents.  All
 * documentation is organized into a two level namespace of
 * "spaceName/docName".
 */
export class DocSpace extends sys.Obj {
  static type$: sys.Type
  /**
   * Return spaceName by default
   */
  toStr(): string;
  /**
   * Iterate all the documents in this space.
   */
  eachDoc(f: ((arg0: Doc) => void)): void;
  /**
   * Get the name of this space which is unique with the
   * environment.
   */
  spaceName(): string;
  /**
   * String to use for this space in the breadcrumb. By default
   * this is the {@link spaceName | spaceName}.
   */
  breadcrumb(): string;
  /**
   * Lookup the document in this space.  If not found raise {@link UnknownDocErr | UnknownDocErr}
   * or return null based on checked flag.
   */
  doc(docName: string, checked?: boolean): Doc | null;
  static make(...args: unknown[]): DocSpace;
}

/**
 * Renders DocType documents
 * 
 * ### Overview
 * ```
 * <h1>
 *  <span>{type.flags}</span> {type.qname}
 * </h1>
 * <pre>...</pre>                 // inhertiance
 * <p class='facets'>...</p>      // facet list (if available)
 * <p class='src'><a>...</a></p>  // source link (if available)
 * ...                            // type fandoc
 * <ul>...</ul>                   // emum list (if available)
 * ```
 * 
 * ### Slots
 * ```
 * <dl>
 *  <dt id='{slot.name}'>{slot.name}</dt>
 *  <dd>
 *   <p class='sig'><code>...</code></p>  // slot signature
 *   <p class='src'><a>...</a></p>        // source link (if available)
 *   ...                                  // slot fandoc
 *  </dd>
 * </dl>
 * ```
 * 
 * ### Table of Contents
 * ```
 * <h3>Source</h3>
 * <ul><li><a>...</a></li></ul>     // if source link
 * <ul><li>Not available</li></ul>  // if no source link
 * 
 * <h3>Slots</h3>
 * <ul>
 *  <li><a href='#{slot.name}'>{slot.name}</a></li>
 * </ul>
 * ```
 */
export class DocTypeRenderer extends DocRenderer {
  static type$: sys.Type
  /**
   * Type to renderer
   */
  type(): DocType;
  /**
   * Render the HTML for the type overview (base, mixins, type
   * doc)
   */
  writeTypeOverview(): void;
  writeContent(): void;
  /**
   * Render type inheritance.
   */
  writeTypeInheritance(): void;
  /**
   * Render the HTML for all the given slot
   */
  writeSlot(slot: DocSlot): void;
  /**
   * Render the table of contents for this type.
   */
  writeToc(): void;
  /**
   * Write the given type ref as a hyperlink
   */
  writeTypeRef(ref: DocTypeRef, full?: boolean): void;
  /**
   * Constructor with env, out params.
   */
  static make(env: DocEnv, out: web.WebOutStream, doc: DocType, ...args: unknown[]): DocTypeRenderer;
  /**
   * Map filename/line number to a source file link
   */
  toSrcLink(loc: DocLoc, dis: string): DocLink | null;
  /**
   * Render HTML for slot signature.
   */
  writeSlotSig(slot: DocSlot): void;
  /**
   * Write the given facet.
   */
  writeFacet(f: DocFacet): void;
  /**
   * Write source code link as <p> if source is available.
   */
  writeSrcLink(loc: DocLoc, dis?: string): void;
  /**
   * Render the HTML for all the slot definitions
   */
  writeSlots(): void;
}

/**
 * Renders the index of a pod's documents.
 * 
 * ### Index
 * ```
 * <h1><span>pod</span>{pod.qname}</h1>
 * <p>{pod.summary}</p>
 * 
 * <h2>{section.name}</h2>
 * <table>
 *  <tr>
 *   <td>{type.name}</td>
 *   <td>{type.summary}</td>
 *  </tr>
 * </table>
 * ```
 * 
 * ### Table of
 * Contents
 * ```
 * <ul>
 *  <li><a>...</a></li>
 *  <li><a>...</a>
 *   <ul>...</ul>
 *  </li>
 * </ul>
 * ```
 */
export class DocPodIndexRenderer extends DocRenderer {
  static type$: sys.Type
  /**
   * Pod index to render
   */
  index(): DocPodIndex;
  /**
   * Write out pod-doc table of contents.
   */
  writePodDocToc(headings: sys.List<DocHeading>): void;
  /**
   * Write the content for a pod index.  This delegates to {@link writeContentApi | writeContentApi}
   * or {@link writeContentManual | writeContentManual}
   */
  writeContent(): void;
  /**
   * Write the content for a manual pod
   */
  writeContentManual(): void;
  static make(env: DocEnv, out: web.WebOutStream, doc: DocPodIndex, ...args: unknown[]): DocPodIndexRenderer;
  /**
   * Render the pod's index of types.
   */
  writeTypes(): void;
  /**
   * Write the content for an API (non-manual) pod
   */
  writeContentApi(): void;
}

/**
 * Wrapper for Fandoc string for a chapter, type, or slot
 */
export class DocFandoc extends sys.Obj {
  static type$: sys.Type
  /**
   * Location of fandoc in source file
   */
  loc(): DocLoc;
  /**
   * Plain text fandoc string
   */
  text(): string;
  /**
   * Return the first sentence of fandoc
   */
  firstSentence(): DocFandoc;
  /**
   * Construct from {@link loc | loc} and {@link text | text}
   */
  static make(loc: DocLoc, text: string, ...args: unknown[]): DocFandoc;
}

/**
 * DocTopIndex models the top-level index
 */
export class DocTopIndex extends Doc {
  static type$: sys.Type
  /**
   * Default renderer {@link DocTopIndexRenderer | DocTopIndexRenderer}
   */
  renderer(): sys.Type;
  __renderer(it: sys.Type): void;
  /**
   * Default is "Doc Index"
   */
  title(): string;
  __title(it: string): void;
  /**
   * Spaces to index
   */
  spaces(): sys.List<DocSpace>;
  __spaces(it: sys.List<DocSpace>): void;
  /**
   * Debug string
   */
  toStr(): string;
  /**
   * Return true
   */
  isTopIndex(): boolean;
  /**
   * Throw UnsupportedErr
   */
  space(): DocSpace;
  /**
   * Throw UnsupportedErr
   */
  docName(): string;
  /**
   * Get the spaces which as instances of DocPod
   */
  pods(): sys.List<DocPod>;
  /**
   * It-block constructor
   */
  static make(f?: ((arg0: DocTopIndex) => void) | null, ...args: unknown[]): DocTopIndex;
}

/**
 * DocPodIndex represents the index document of a DocPod.
 */
export class DocPodIndex extends Doc {
  static type$: sys.Type
  /**
   * Parent pod
   */
  pod(): DocPod;
  /**
   * If this a API pod, this is the Str/DocType where the string
   * indicates groupings such as "Classes", "Mixins", etc.  If
   * this is a manual return the list of Str/DocChapter where Str
   * indicates index grouping headers.
   */
  toc(): sys.List<sys.JsObj>;
  /**
   * Default renderer is {@link DocPodIndexRenderer | DocPodIndexRenderer}
   */
  renderer(): sys.Type;
  /**
   * Index the type summary and all slot docs
   */
  onCrawl(crawler: DocCrawler): void;
  /**
   * Title is pod name
   */
  title(): string;
  /**
   * The space for this doc is {@link pod | pod}
   */
  space(): DocSpace;
  /**
   * The document name under space is "index"
   */
  docName(): string;
  /**
   * Return true
   */
  isSpaceIndex(): boolean;
}

/**
 * Renders DocChapter documents
 * 
 * ### Chapter
 * ```
 * <h1>
 *  <span>{chapter.num}<span> {chapter.title}
 * </h1>
 * ... // chapter fandoc
 * ```
 * 
 * ### Chapter Nav
 * ```
 * <ul class='chapter-nav'>
 *  <li class='prev'><a>{prev.title}</a></li>  // if available
 *  <li class='next'><a>{next.title}</a></li>  // if available
 * </ul>
 * ```
 * 
 * ### Table of
 * Contents
 * ```
 * <h3><a>{pod.name}</a></h3>
 * <h4><a>{part.name}</a></h4>  // if available
 * <ol>
 *  <li><a>{chapter.title}</a></li>
 *  <li><a>{chapter.title}</a>
 *   <ol>
 *    <li><a>{heading.name}</a></li>
 *   </ol>
 *  </li>
 * </ol>
 * ```
 */
export class DocChapterRenderer extends DocRenderer {
  static type$: sys.Type
  /**
   * Chapter document to renderer
   */
  chapter(): DocChapter;
  /**
   * Write chapter body.
   */
  writeBody(): void;
  writeContent(): void;
  /**
   * Write out chapter table of contents for pod.
   */
  writeToc(): void;
  static make(env: DocEnv, out: web.WebOutStream, doc: DocChapter, ...args: unknown[]): DocChapterRenderer;
  /**
   * Write chapter prev/next navigation.
   */
  writeNav(): void;
}

/**
 * DocFacet models the documentation of a {@link sys.Facet | sys::Facet}
 * on a type or slot.
 */
export class DocFacet extends sys.Obj {
  static type$: sys.Type
  /**
   * Type of the facet definition
   */
  type(): DocTypeRef;
  /**
   * Map of name:expr pairs for field definitions
   */
  fields(): sys.Map<string, string>;
  toStr(): string;
}

/**
 * DocEnv is the centralized glue class for managing
 * documentation modeling and rendering:
 * - hooks for lookup and loading of spaces/pods
 * - hooks for theming HTML chrome and navigation
 * - hooks for renderering HTML pages
 * - hooks for hyperlink resolution
 */
export class DocEnv extends sys.Obj {
  static type$: sys.Type
  /**
   * Return the file extension (including the dot) to suffix all
   * link URIs.  Default returns ".html"
   */
  linkUriExt(): string | null;
  err(msg: string, loc: DocLoc, cause?: sys.Err | null): DocErr;
  errReport(err: DocErr): DocErr;
  /**
   * Resolve the link relative to the given from document. See {@link DocLink | DocLink}
   * for the built-in formats.
   */
  link(from$: Doc, link: string, checked?: boolean): DocLink | null;
  /**
   * Get the document which represents top level index.
   */
  topIndex(): DocTopIndex;
  /**
   * Lookup a space by its space name.  If not found then return
   * null or raise UnknownDocErr.  This method is called
   * frequently during document rendering and linking so caching
   * is expected.
   */
  space(name: string, checked?: boolean): DocSpace | null;
  /**
   * Hook to perform extra DocLink checking such as links to
   * NoDocs
   */
  linkCheck(link: DocLink, loc: DocLoc): void;
  /**
   * Lookup a document by is spaceName and docName within that
   * space.  If not found then return null or raise
   * UnknownDocErr. Default implementation delegates to {@link space | space}
   * and {@link DocSpace.doc | DocSpace.doc}.
   */
  doc(spaceName: string, docName: string, checked?: boolean): Doc | null;
  /**
   * Theme is responsible for the common chrome, styling, and
   * navigation during rendering
   */
  theme(): DocTheme;
  /**
   * Render the given document to the specified output stream.
   * Default implementation uses {@link Doc.renderer | Doc.renderer}.
   */
  render(out: web.WebOutStream, doc: Doc): void;
  static make(...args: unknown[]): DocEnv;
  /**
   * Return URI used to link the from doc to the target doc. Also
   * see {@link linkUriExt | linkUriExt}.
   */
  linkUri(link: DocLink): sys.Uri;
}

/**
 * DocFlags models the flags used to annotate types and slots
 */
export class DocFlags extends sys.Obj {
  static type$: sys.Type
  static Enum(): number;
  static Once(): number;
  static Internal(): number;
  static Mixin(): number;
  static Native(): number;
  static Ctor(): number;
  static Private(): number;
  static Override(): number;
  static Facet(): number;
  static Protected(): number;
  static Const(): number;
  static Public(): number;
  static Storage(): number;
  static Static(): number;
  static Synthetic(): number;
  static Getter(): number;
  static Final(): number;
  static Abstract(): number;
  static Virtual(): number;
  static Setter(): number;
  static isSynthetic(flags: number): boolean;
  static isNative(flags: number): boolean;
  static fromName(name: string): number;
  static isFacet(flags: number): boolean;
  static isInternal(flags: number): boolean;
  static toNames(flags: number): string;
  static isVirtual(flags: number): boolean;
  static isStatic(flags: number): boolean;
  static isPrivate(flags: number): boolean;
  static isStorage(flags: number): boolean;
  static toSlotDis(f: number): string;
  static isProtected(flags: number): boolean;
  static isConst(flags: number): boolean;
  static isOverride(flags: number): boolean;
  static isPublic(flags: number): boolean;
  static isFinal(flags: number): boolean;
  static make(...args: unknown[]): DocFlags;
  static isGetter(flags: number): boolean;
  static isEnum(flags: number): boolean;
  static fromNames(names: string): number;
  static isAbstract(flags: number): boolean;
  static isMixin(flags: number): boolean;
  static isOnce(flags: number): boolean;
  static isSetter(flags: number): boolean;
  /**
   * Type flags to display including final `class` or `mixin`
   */
  static toTypeDis(f: number): string;
  static isCtor(flags: number): boolean;
}

/**
 * DocTheme is responsible for providing the common chrome,
 * styling, and breadcrumb across different DocRenderers.  The
 * theme used by renderers is defined by {@link DocEnv.theme | DocEnv.theme}.
 */
export class DocTheme extends sys.Obj {
  static type$: sys.Type
  /**
   * Write navigation breadcrumbs for given renderer
   */
  writeBreadcrumb(r: DocRenderer): void;
  /**
   * Write closing HTML for page.  This should generate the
   * common footer and close the body and html tags.
   */
  writeEnd(r: DocRenderer): void;
  /**
   * Write opening HTML for page.  This should generate the doc
   * type, html, head, and opening body tags.  Any common header
   * should always be generated here.
   */
  writeStart(r: DocRenderer): void;
  static make(...args: unknown[]): DocTheme;
}

/**
 * DocSrc models a page of source code for display.
 */
export class DocSrc extends Doc {
  static type$: sys.Type
  /**
   * Pod which contains the source file
   */
  pod(): DocPod;
  /**
   * Uri of the source file inside the pod
   */
  uri(): sys.Uri;
  /**
   * Default renderer is {@link DocSrcRenderer | DocSrcRenderer}
   */
  renderer(): sys.Type;
  /**
   * Title is the filename
   */
  title(): string;
  /**
   * The space for this doc is {@link pod | pod}
   */
  space(): DocSpace;
  /**
   * Document name under space is "src-{filename}"
   */
  docName(): string;
  /**
   * Breadcrumb name is the filename
   */
  breadcrumb(): string;
}

