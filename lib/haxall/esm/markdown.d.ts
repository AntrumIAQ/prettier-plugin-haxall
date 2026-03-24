import * as sys from './sys.js';

/**
 * Builder for customizing the behavior of the common mark
 * parser
 */
export class ParserBuilder extends sys.Obj {
  static type$: sys.Type
  /**
   * Add a factory for a custom inline content parser, for
   * extending inline parsing or overriding built-in parsing.
   * 
   * Note that parsers are triggered based on a special character
   * as specified by {@link InlineContentParserFactory.triggerChars | InlineContentParserFactory.triggerChars}.
   * It is possible to register multiple parsers for the same
   * character, or even for some built-in special character such
   * as ```. The custom parsers are tried first in the order in
   * which they are registered, and then the built-in ones.
   */
  customInlineContentParserFactory(factory: InlineContentParserFactory): this;
  /**
   * Add a custom block parser factory.
   * 
   * Note that custom factories are applied *before* the built-in
   * factories. This is so that extensions can change how some
   * syntax is parsed that would otherwise be handled by built-in
   * factories.
   */
  customBlockParserFactory(factory: BlockParserFactory): this;
  /**
   * Describe the list of markdown features the parser will
   * recognize and parse.
   * 
   * By default, we will recognize and parse the following set of
   * "block" elements:
   * - {@link Heading | Heading} (`#`)
   * - {@link HtmlBlock | HtmlBlock} (`<html></html>`)
   * - {@link ThematicBreak | ThematicBreak} (Horizontal Rule) (`---`)
   * - {@link FencedCode | FencedCode} (`````)
   * - {@link IndentedCode | IndentedCode}
   * - {@link BlockQuote | BlockQuote} (`>`)
   * - {@link ListBlock | ListBlock} (Ordered/Unordered List) (`1. /
   *   *`)
   * 
   * To parse only a subset of the features listed above, pass a
   * lsit of each feature's associated {@link Block | Block} type.
   * 
   * Example: to parse only headings and lists:
   * ```
   * Parser.builder.withEnabledBlockTypes([Heading#, ListBlock#])
   * ```
   */
  withEnabledBlockTypes(enabledBlockTypes: sys.List<sys.Type>): this;
  customDelimiterProcessor(delimiterProcessor: DelimiterProcessor): this;
  postProcessorFactory(factory: (() => PostProcessor)): this;
  /**
   * Add a custom link marker for link processing. A link marker
   * is a character like `!` which, if it appears before the `[` of a
   * link, changes the meaning of the link.
   * 
   * If a link marker followed by a valid link is parsed, the {@link LinkInfo | LinkInfo}
   * that is passed to the {@link LinkProcessor | LinkProcessor}
   * will have its {@link LinkInfo.marker | LinkInfo.marker} set.
   * A link processor should check the {@link Text.literal | Text.literal}
   * and then do any processing, and will probably want to use {@link LinkResult.includeMarker | LinkResult.includeMarker}.
   */
  linkMarker(marker: number): this;
  /**
   * Configure the given extensions on this parser.
   */
  extensions(exts: sys.List<MarkdownExt>): this;
  /**
   * Add a custom link/image processor for inline parsing.
   * 
   * Multiple link processors can be added, and will be tried in
   * the order in which they were added. If no processor applies,
   * the normal behavior applies. That means these can override
   * built-in link parsing.
   */
  linkProcessor(linkProcessor: LinkProcessor): this;
  /**
   * Get the configured {@link Parser | Parser}
   */
  build(): Parser;
}

/**
 * Base class for all CommonMark AST nodes.
 * 
 * The CommonMark AST is a tree of nodes where each node can
 * have any number of children and one parent - except the root
 * node which has no parent.
 */
export class Node extends sys.Obj {
  static type$: sys.Type
  next(): Node | null;
  next(it: Node | null): void;
  prev(): Node | null;
  prev(it: Node | null): void;
  sourceSpans(): sys.List<SourceSpan> | null;
  sourceSpans(it: sys.List<SourceSpan> | null): void;
  firstChild(): Node | null;
  firstChild(it: Node | null): void;
  lastChild(): Node | null;
  lastChild(it: Node | null): void;
  /**
   * The parent node or null if this is the root of the AST
   */
  parent(): Node | null;
  /**
   * Replace the current source spans with the provided list
   */
  setSourceSpans(sourceSpans: sys.List<SourceSpan>): void;
  /**
   * Get nodes between start (exclusive) and end (exclusive)
   */
  static eachBetween(start: Node, end: Node, f: ((arg0: Node) => void)): void;
  /**
   * Inserts the sibling node after this node
   */
  insertAfter(sibling: Node): void;
  /**
   * Inserts the sibiling node before this node
   */
  insertBefore(sibling: Node): void;
  /**
   * Get all the children of the given parent node
   */
  static children(parent: Node): sys.List<Node>;
  /**
   * Recursively try to find a node with the given type within
   * the children of the specified node. Throw if node could not
   * be found
   */
  static find(parent: Node, nodeType: sys.Type): Node;
  static make(...args: unknown[]): Node;
  toStr(): string;
  /**
   * Insert the child node as the last child node of this node.
   */
  appendChild(child: Node): this;
  /**
   * Recursively try to find a node with the given type within
   * the children of the specified node.
   */
  static tryFind(parent: Node, nodeType: sys.Type): Node | null;
  /**
   * Completely detach this node from the AST
   */
  unlink(): void;
  /**
   * Add a source span to the end of the list. If it is null,
   * this is a no-op
   */
  addSourceSpan(sourceSpan: SourceSpan | null): void;
  /**
   * Walk the AST using the given visitor. By default, we use
   * reflection to call `visitor.visit${this.typeof.name}`
   */
  walk(visitor: Visitor): void;
}

/**
 * Document is the root node of the AST
 */
export class Document extends Block {
  static type$: sys.Type
  static make(...args: unknown[]): Document;
}

/**
 * Renders nodes to Markdown (CommonMark syntax).
 */
export class MarkdownRenderer extends sys.Obj implements Renderer {
  static type$: sys.Type
  renderTo(out: sys.OutStream, node: Node): void;
  /**
   * Obtain a builder for configuring the renderer
   */
  static builder(): MarkdownRendererBuilder;
  /**
   * Get a renderer with all the default configuration
   */
  static make(...args: unknown[]): MarkdownRenderer;
  render(node: Node): string;
}

/**
 * Extension for adding attributes to image nodes.
 */
export class ImgAttrsExt extends sys.Obj implements MarkdownExt {
  static type$: sys.Type
  extendHtml(builder: HtmlRendererBuilder): void;
  extendParser(builder: ParserBuilder): void;
  extendMarkdown(builder: MarkdownRendererBuilder): void;
  static make(...args: unknown[]): ImgAttrsExt;
}

/**
 * ParsedInline
 */
export class ParsedInline extends sys.Obj {
  static type$: sys.Type
  node(): Node;
  node(it: Node): void;
  pos(): Position;
  static none(...args: unknown[]): ParsedInline;
  static of(node: Node, pos: Position, ...args: unknown[]): ParsedInline;
}

/**
 * InlineParserState
 */
export abstract class InlineParserState extends sys.Obj {
  static type$: sys.Type
  /**
   * Return a scanner for the input for the current position (on
   * the trigger character that the inline parser was added for).
   * 
   * Note that this always returns the same instance, if you want
   * to backtrack you need to use {@link Scanner.pos | Scanner.pos}
   * and {@link Scanner.setPos | Scanner.setPos}.
   */
  scanner(): Scanner | null;
}

export class TableMarkdownRendererTest extends sys.Test {
  static type$: sys.Type
  testInsideBlockQuote(): void;
  testEscaped(): void;
  static make(...args: unknown[]): TableMarkdownRendererTest;
  testEscaping(): void;
  testHeadNoBody(): void;
  testBodyHasFewerColumns(): void;
  testAlignment(): void;
  testMultipleTables(): void;
}

export class ParserTest extends sys.Test {
  static type$: sys.Type
  testIndentation(): void;
  static make(...args: unknown[]): ParserTest;
  testEnabledBlockTypesThrowsWhenGivenUnknownType(): void;
  testCustomBlockFactory(): void;
  testEnabledBlockTypes(): void;
}

export class HtmlInlineParserTest extends CoreRenderingTest {
  static type$: sys.Type
  testDeclaration(): void;
  testCdata(): void;
  testComment(): void;
  static make(...args: unknown[]): HtmlInlineParserTest;
}

/**
 * Code
 */
export class Code extends Node {
  static type$: sys.Type
  literal(): string;
  static make(literal: string, ...args: unknown[]): Code;
}

export class ImgAttrsExtTest extends RenderingTest {
  static type$: sys.Type
  testMismatchingDelimitersAreIgnored(): void;
  testStyleWithNoValueIsIgnored(): void;
  testImageAltTextWithHardLineBreak(): void;
  static make(...args: unknown[]): ImgAttrsExtTest;
  testTextNodesAreUnchanged(): void;
  testImageAltTextWithSoftLineBreak(): void;
  testBaseCase(): void;
  testUnsupportedStyleNamesAreLeftUnchanged(): void;
  testImageAltTextWithSpaces(): void;
  testImageAltTextWithEntities(): void;
  testDoubleDelimiters(): void;
}

/**
 * Parse input text into a tree of nodes.
 * 
 * The parser is thread-safe meaning the same parser can be
 * shared by multiple actors.
 */
export class Parser extends sys.Obj {
  static type$: sys.Type
  /**
   * Parse the contents of the input stream into a tree of nodes.
   * ```
   * doc := Parser().parse("Hello *Markdown*!")
   * 
   * ```
   */
  parseStream(in$: sys.InStream): Node;
  /**
   * Convenience for `parseStream(text.in)`
   */
  parse(text: string): Node;
  /**
   * Obtain a builder for configuring the parser
   */
  static builder(): ParserBuilder;
  /**
   * Get a parser with all the default configuration
   */
  static make(...args: unknown[]): Parser;
}

/**
 * Parser for a type of inline content. Registered via a {@link InlineContentParserFactory | InlineContentParserFactory}
 * and created by its {@link InlineContentParserFactory.create | InlineContentParserFactory.create}
 * method. The lifetime of this is tied to each inline content
 * snippet that is parsed, as a new instance is created for
 * each.
 */
export abstract class InlineContentParser extends sys.Obj {
  static type$: sys.Type
  /**
   * Try to parse inline content starting from the current
   * position. Note that the character at the current position is
   * one of {@link InlineContentParserFactory.triggerChars | InlineContentParserFactory.triggerChars}
   * of the factory that created this parser.
   * 
   * For a given inline content snippet that is being parsed,
   * this method can be called multiple times: each time a
   * trigger character is encountered.
   * 
   * Return the result of parsing; can indicate that this parser
   * is not interested, or that parsing was successful.
   */
  tryParse(inlineParserState: InlineParserState): ParsedInline | null;
}

/**
 * Open block parser that was last matched during the continue
 * phase. This is different from the currently active block
 * parser, as an unmatched block is only closed when a new
 * block is started.
 */
export class MatchedBlockParser extends sys.Obj {
  static type$: sys.Type
  matchedBlockParser(): BlockParser;
  matchedBlockParser(it: BlockParser): void;
  paragraphLines(): SourceLines;
  static make(matchedBlockParser: BlockParser, ...args: unknown[]): MatchedBlockParser;
}

/**
 * HTML inline
 */
export class HtmlInline extends Node {
  static type$: sys.Type
  literal(): string | null;
  literal(it: string | null): void;
  static make(literal?: string | null, ...args: unknown[]): HtmlInline;
}

/**
 * Base class for {@link Link | Link} and {@link Image | Image}
 * nodes
 */
export class LinkNode extends Node {
  static type$: sys.Type
  /**
   * Link URL destination
   */
  destination(): string;
  destination(it: string): void;
  /**
   * Optional link title
   */
  title(): string | null;
  title(it: string | null): void;
  static make(destination: string, title?: string | null, ...args: unknown[]): LinkNode;
}

/**
 * A link with a destination and an optional title; the link
 * text is in child nodes
 * 
 * Example for an inline link in a CommonMark document
 * ```
 * [link](/uri "title")
 * 
 * ```
 * 
 * Note that the text in the link can contain inline
 * formatting, so it could also contain an image or emphasis,
 * etc.
 */
export class Link extends LinkNode {
  static type$: sys.Type
  static make(destination: string, title?: string | null, ...args: unknown[]): Link;
}

/**
 * A line or portion of a line from the markdown source text
 */
export class SourceLine extends sys.Obj {
  static type$: sys.Type
  /**
   * The source span if the parser was configured to include it
   */
  sourceSpan(): SourceSpan | null;
  /**
   * The line content
   */
  content(): string;
  toStr(): string;
  /**
   * Get a new source line that is a substring of this one. The
   * beginIndex is inclusive, and the endIndex is exclusive.
   */
  substring(beginIndex: number, endIndex: number): SourceLine;
  static make(content: string, sourceSpan?: SourceSpan | null, ...args: unknown[]): SourceLine;
}

export class ThematicBreakParserTest extends sys.Test {
  static type$: sys.Type
  parser(): Parser | null;
  parser(it: Parser | null): void;
  testLiteral(): void;
  static make(...args: unknown[]): ThematicBreakParserTest;
  setup(): void;
}

/**
 * Head part of a {@link Table | Table} containing {@link TableRow | TableRow}s
 */
export class TableHead extends CustomNode {
  static type$: sys.Type
  static make(...args: unknown[]): TableHead;
}

export class CharsTest extends sys.Test {
  static type$: sys.Type
  testIsBlank(): void;
  static make(...args: unknown[]): CharsTest;
  testSkipBackwards(): void;
  testSkipSpaceTabBackwards(): void;
}

export class MarkdownSpecTest extends CommonMarkSpecTest {
  static type$: sys.Type
  static make(...args: unknown[]): MarkdownSpecTest;
}

/**
 * A renderer for a set of node types
 */
export abstract class NodeRenderer extends sys.Obj {
  static type$: sys.Type
  /**
   * Called after the root node is rendered, to do any final
   * processing at the end
   */
  afterRoot(rootNode: Node): void;
  /**
   * Called before the root node is rendered, to do any initial
   * processing at the start
   */
  beforeRoot(rootNode: Node): void;
  /**
   * Get the {@link Node | Node} types that this renderer handles.
   */
  nodeTypes(): sys.List<sys.Type>;
  /**
   * Render the specified node
   */
  render(node: Node): void;
}

/**
 * Indented code block
 */
export class IndentedCode extends Block {
  static type$: sys.Type
  /**
   * Indented code literal
   */
  literal(): string | null;
  literal(it: string | null): void;
  static make(literal?: string | null, ...args: unknown[]): IndentedCode;
}

export class TablesExtTest extends RenderingTest {
  static type$: sys.Type
  testAlignLeft(): void;
  testBodyCanNotHaveMoreColumnsThanHead(): void;
  testBackslashAtEnd(): void;
  testBodyWithFewerColumnsThanHeadresultsInEmptyCells(): void;
  testMustHaveHeaderAndSeparator(): void;
  testOneColumnOneHeadNoBody(): void;
  testSeparatorMustNotContainInvalidChars(): void;
  testOneHeadOneBody(): void;
  testInsideBlockQuote(): void;
  testPadding(): void;
  testSeparatorNeedsPipes(): void;
  testInlineElements(): void;
  testGfmSpec(): void;
  testEscapedPipe(): void;
  testSeparatorMustBeOneOrMore(): void;
  testSeparatorMustNotHaveLessPartsThanHead(): void;
  testTableWithLazyContinuationLine(): void;
  testAlignRight(): void;
  testOneHeadNoBody(): void;
  testPipesOnOutside(): void;
  testAlignCenter(): void;
  testPipesOnOutsideWhitespaceAfterHeader(): void;
  testAlignLeftWithSpaces(): void;
  testOneColumnOneHeadOneBody(): void;
  testPaddingWithCodeBlockIndentation(): void;
  testAttrProviderIsApplied(): void;
  testHeaderMustBeOneLine(): void;
  testEscapedOther(): void;
  testSeparatorCanHaveLeadingSpaceThenPipe(): void;
  testAlignCenterSecond(): void;
  static make(...args: unknown[]): TablesExtTest;
  testAlignmentMarkerMustBeNextToDashs(): void;
  testDanglingPipe(): void;
  testSeparatorCanNotHaveAdjacentPipes(): void;
  testPipesOnOutsideZeroLengthHeaders(): void;
  testSpaceBeforeSeparator(): void;
  testEscapedBackslash(): void;
}

export class HeadingParserTest extends CoreRenderingTest {
  static type$: sys.Type
  testAtxHeadingTrailing(): void;
  testAtxHeadingStart(): void;
  static make(...args: unknown[]): HeadingParserTest;
  testSetextHeadingMarkers(): void;
}

/**
 * LinkResult
 */
export class LinkResult extends sys.Obj {
  static type$: sys.Type
  /**
   * If a {@link LinkInfo.marker | LinkInfo.marker} is present,
   * include it in processing (i.e. treat it the same way as the
   * brackets).
   */
  includeMarker(): boolean;
  includeMarker(it: boolean): void;
  node(): Node;
  node(it: Node): void;
  pos(): Position;
  wrap(): boolean;
  replace(): boolean;
  /**
   * Link not handled by processor
   */
  static none(...args: unknown[]): LinkResult;
  /**
   * Wrap the link text in a node. This is the normal behavior
   * for links, e.g. for this:
   * ```
   * [my *text*](destination)
   * 
   * ```
   * 
   * The text is `my *text*`, a text node and emphasis. The text is
   * wrapped in a link node, which means the text is added as
   * child nodes to it.
   * 
   * `node`: the node to which the link text nodes will be added as
   * child nodes `pos`: the position to continue parsing from
   */
  static wrapTextIn(node: Node, pos: Position, ...args: unknown[]): LinkResult;
  /**
   * Replace the link with a node, e.g. for this:
   * ```
   * [^foo]
   * 
   * ```
   * 
   * The processor could decide to create a footnote reference
   * node instead which replaces the link.
   * 
   * `node`: the node to replace the link with `pos`: the position to
   * continue parsing from
   */
  static replaceWith(node: Node, pos: Position, ...args: unknown[]): LinkResult;
}

export class EscTest extends sys.Test {
  static type$: sys.Type
  testUnescapeStr(): void;
  static make(...args: unknown[]): EscTest;
  testEscapeHtml(): void;
}

/**
 * Thematic break block
 */
export class ThematicBreak extends Block {
  static type$: sys.Type
  /**
   * source literal that represents this break, if available
   */
  literal(): string | null;
  literal(it: string | null): void;
  static make(literal?: string | null, ...args: unknown[]): ThematicBreak;
}

/**
 * Pathological input cases (from commonmark.js)
 */
export class PathologicalTest extends CoreRenderingTest {
  static type$: sys.Type
  testHugeHorizontalRule(): void;
  testLinkClosersWithNoOpeners(): void;
  static make(...args: unknown[]): PathologicalTest;
  testEmphasisClosersWithNoOpeners(): void;
  testMismatchedOpenersAndClosers(): void;
  testNestedStrongEmphasis(): void;
  testBackslashInLink(): void;
  testUnclosedInlineLinks(): void;
  testNestedBrackets(): void;
  testEmphasisOpenersWithNoClosers(): void;
  testLinkOpenersWithNoCloser(): void;
  testNestedBlockQuotes(): void;
}

/**
 * A mixin to decide how links/images are handled
 * 
 * When inline parsing is run, each parsed link/image is passed
 * to the processor. This includes links like these:
 * ```
 * [text](destination)
 * [text]
 * [text][]
 * [text][label]
 * 
 * ```
 * 
 * And images
 * ```
 * ![text](destination)
 * ![text]
 * ![text][]
 * ![text][label]
 * 
 * ```
 * 
 * See {@link LinkInfo | LinkInfo} for accessing various parts
 * of the parsed link/image
 * 
 * The processor can then inspect the link/image and decide
 * what to do with it by returning the appropriate {@link LinkResult | LinkResult}.
 * If it returns null, the next registered processor is tried.
 * If none of them apply, the link is handled as it normally
 * would.
 */
export abstract class LinkProcessor extends sys.Obj {
  static type$: sys.Type
  /**
   * `info`: information about the parsed link/image `scanner`: the
   * scanner at the current position aftger the parsed link/image
   * `cx`: context for inline parsing
   * 
   * Return what to do with the link/image, e.g. do nothing (try
   * next processor), wrap the text in a node, or replace the
   * link/image with a node.
   */
  process(info: LinkInfo, scanner: Scanner, cx: InlineParserContext): LinkResult | null;
}

/**
 * ImgAttrs
 */
export class ImgAttrs extends CustomNode implements Delimited {
  static type$: sys.Type
  closingDelim(): string;
  openingDelim(): string;
  attrs(): sys.Map<string, string>;
  static make(attrs: sys.Map<string, string>, ...args: unknown[]): ImgAttrs;
}

/**
 * InlineParserContext
 */
export class InlineParserContext extends sys.Obj {
  static type$: sys.Type
  customLinkMarkers(): sys.List<number>;
  factories(): sys.List<InlineContentParserFactory>;
  customDelimiterProcessors(): sys.List<DelimiterProcessor>;
  customLinkProcessors(): sys.List<LinkProcessor>;
  /**
   * Lookup a definition of a type for a given label.
   * 
   * Note that the label does not need to be normalized;
   * implementations are responsible for doing this normalization
   * before lookup.
   */
  def(type: sys.Type, label: string): Block | null;
}

/**
 * HTML writer for markdown rendering
 */
export class HtmlWriter extends sys.Obj {
  static type$: sys.Type
  /**
   * write a newline character if the last character written
   * wasn't a newline
   */
  line(): this;
  /**
   * Write the raw string
   */
  raw(s: string): this;
  /**
   * Write the escaped text
   */
  text(text: string): this;
  /**
   * Write a tag with the given name ("foo" - opening tag, "/foo"
   * - closing tag) with the given attributes. If empty is true
   * an empty tag is written (e.g. <img />)
   */
  tag(name: string, attrs?: sys.Map<string, string | null> | null, empty?: boolean): this;
  static make(out: sys.OutStream, ...args: unknown[]): HtmlWriter;
}

export class LinkReferenceDefinitionNodeTest extends sys.Test {
  static type$: sys.Type
  testMultipleDefinitionsWithSameLabel(): void;
  static make(...args: unknown[]): LinkReferenceDefinitionNodeTest;
  testDefinitionWithParagraph(): void;
  testDefinitionWithoutParagraph(): void;
  testDefinitionLabelCaseIsPreserved(): void;
  testDefinitionInListItem2(): void;
  testDefinitionOfReplacedBlock(): void;
  testDefinitionInListItem(): void;
  testMultipleDefinitions(): void;
}

/**
 * Body part of a {@link Table | Table} containing {@link TableRow | TableRow}s
 */
export class TableBody extends CustomNode {
  static type$: sys.Type
  static make(...args: unknown[]): TableBody;
}

/**
 * Parser for inline content (text, links, emphasized text,
 * etc.)
 */
export abstract class InlineParser extends sys.Obj {
  static type$: sys.Type
  /**
   * Parse the lines as inline and append resulting nodes to node
   * (as children)
   */
  parse(lines: SourceLines, node: Node): void;
}

/**
 * PostProcessors are run as the last step of parsing and
 * provide an opportunity to inspect/modify the parsed AST
 * before rendering.
 */
export abstract class PostProcessor extends sys.Obj {
  static type$: sys.Type
  /**
   * Post-process this node and return the result (which may be a
   * modified node).
   */
  process(node: Node): Node;
}

/**
 * Custom Block
 */
export class CustomBlock extends Block {
  static type$: sys.Type
  static make(...args: unknown[]): CustomBlock;
}

/**
 * Abstract base class for list blocks
 */
export class ListBlock extends Block {
  static type$: sys.Type
  /**
   * Whether this list is tight or loose
   * 
   * spec: A list is loose if any of its constituent list items
   * are separated by blank lines, or if any of its constituent
   * list items directly contain two block-level elements with a
   * blank line between them. Otherwise, a list is tight. (The
   * difference in HTML output is that paragraphs in a loose list
   * are wrapped in <p> tags, while paragraphs in a tight list
   * are not.)
   */
  tight(): boolean;
  tight(it: boolean): void;
  static make(...args: unknown[]): ListBlock;
}

/**
 * Block quote block
 */
export class BlockQuote extends Block {
  static type$: sys.Type
  static make(...args: unknown[]): BlockQuote;
}

/**
 * References a snippet of text from the source input.
 * 
 * It has a starting positiont (line and column index) and a
 * length of how many characters it spans.
 */
export class SourceSpan extends sys.Obj {
  static type$: sys.Type
  /**
   * 0-based index of line in source
   */
  lineIndex(): number;
  /**
   * Length of the span in characters
   */
  len(): number;
  /**
   * 0-based index of column (i.e. character on line) in source
   */
  columnIndex(): number;
  toStr(): string;
  equals(obj: sys.JsObj | null): boolean;
  static make(lineIndex: number, columnIndex: number, len: number, ...args: unknown[]): SourceSpan;
  hash(): number;
}

/**
 * Renders a tree of nodes
 */
export abstract class Renderer extends sys.Obj {
  static type$: sys.Type
  renderTo(out: sys.OutStream, node: Node): void;
  render(node: Node): string;
}

/**
 * Scanner is a utility class for parsing lines
 */
export class Scanner extends sys.Obj {
  static type$: sys.Type
  /**
   * Advance the scanner to the next character
   */
  next(): void;
  /**
   * Check if the specified char is next and advance the
   * position.
   * 
   * `ch`: the char to check (including newline chars)
   * 
   * Return true if matched and position was advanced; false
   * otherwise
   */
  nextCh(ch: number): boolean;
  static makeSourceLines(sourceLines: SourceLines, ...args: unknown[]): Scanner;
  /**
   * For cases where the caller appends the result to a StrBuf,
   * we could offer another method to avoid some unnecessary
   * copying.
   */
  source(begin: Position, end: Position): SourceLines;
  /**
   * Peek at the next code point
   */
  peekCodePoint(): number;
  /**
   * Consume characters until the given function returns true, or
   * the end-of-line is reached. Return the number of characters
   * skipped, or -1 if we reach the end.
   */
  findMatch(f: ((arg0: number) => boolean)): number;
  /**
   * Set the current position for the scanner
   */
  setPos(pos: Position): void;
  /**
   * Get the current position (current line, index into that
   * line)
   */
  pos(): Position;
  /**
   * Scan until we find the given `ch`. Return the number of
   * characters skipped, or -1 if we hit the end of the line.
   */
  find(ch: number): number;
  static make(lines: sys.List<SourceLine>, lineIndex?: number, index?: number, ...args: unknown[]): Scanner;
  static makeLine(line: SourceLine, ...args: unknown[]): Scanner;
  /**
   * Peek at the previous codepoint
   */
  peekPrevCodePoint(): number;
  /**
   * Consume characters while the given function returns `true` and
   * return the number of characters consumed.
   */
  match(f: ((arg0: number) => boolean)): number;
  /**
   * Check if we have the specified content on the line and
   * advance the position. Note that if you want to match newline
   * characters, use {@link nextCh | nextCh}.
   * 
   * `content`: the text content to match on a single line
   * (excluding newline)
   * 
   * Return true if matched and position was advanced; false
   * otherwise
   */
  nextStr(content: string): boolean;
  /**
   * Are there more characters to consume
   */
  hasNext(): boolean;
  /**
   * Peek at the next character without consuming it
   */
  peek(): number;
  /**
   * Consume as many `ch` in a row as possible and return the
   * number consumed.
   */
  matchMultiple(ch: number): number;
  /**
   * Consume whitespace and return the number of whitespace
   * characters consumed
   * 
   * Whitespace is defined as space, \t, \n, \u000B, \f, and \r
   */
  whitespace(): number;
}

export class SpecialInputTest extends CoreRenderingTest {
  static type$: sys.Type
  testUnicodePunctuation(): void;
  testDeeplyIndentedList(): void;
  testLinkReferenceBackslash(): void;
  testNullCharacterShouldBeReplaces(): void;
  testLineWithOnlySpacesAfterListBullet(): void;
  testLinkLabelLen(): void;
  testLooseListInBlockQuote(): void;
  testListWIthTwoSpacesForFirstBullet(): void;
  testNullCharacterEntityShouldBeReplaced(): void;
  testCrLfAsLineSeparatorShouldBeParsed(): void;
  testRenderEvenRegexpProducesStackoverflow(): void;
  testLinkLabelWithBracket(): void;
  testHtmlBlockInterruptingList(): void;
  testTrailingTabs(): void;
  testIndentedCodeBlockWithMixedTabsAndSpaces(): void;
  static make(...args: unknown[]): SpecialInputTest;
  testEmphasisMultipleOf3Rule(): void;
  testListInBlockQuote(): void;
  testOrderedListMarkerOnly(): void;
  testEmpty(): void;
  testCrLfAtEndShouldBeParsed(): void;
  testColumnIsInTabOnPreviousLine(): void;
  testLinkDestinationEscaping(): void;
}

/**
 * A set of lines ({@link SourceLine | SourceLine}) from the
 * input source.
 */
export class SourceLines extends sys.Obj {
  static type$: sys.Type
  lines(): sys.List<SourceLine>;
  lines(it: sys.List<SourceLine>): void;
  sourceSpans(): sys.List<SourceSpan>;
  isEmpty(): boolean;
  content(): string;
  static empty(...args: unknown[]): SourceLines;
  addLine(line: SourceLine): void;
  static makeOne(line: SourceLine, ...args: unknown[]): SourceLines;
  static make(lines: sys.List<SourceLine>, ...args: unknown[]): SourceLines;
}

/**
 * Context for rendering nodes to HTML
 */
export class HtmlContext extends sys.Obj {
  static type$: sys.Type
  writer(): HtmlWriter;
  writer(it: HtmlWriter): void;
  percentEncodeUrls(): boolean;
  urlSanitizer(): UrlSanitizer;
  escapeHtml(): boolean;
  encodeUrl(url: string): string;
  render(node: Node): void;
  sanitizeUrls(): boolean;
  omitSingleParagraphP(): boolean;
  extendAttrs(node: Node, tagName: string, attrs?: sys.Map<string, string | null>): sys.Map<string, string | null>;
  softbreak(): string;
}

/**
 * Table cell of a {@link TableRow | TableRow} containing inline
 * nodes
 */
export class TableCell extends CustomNode {
  static type$: sys.Type
  /**
   * The cell width (the number of dash and colon characters in
   * the delimiter row of the table for this column)
   */
  width(): number;
  width(it: number): void;
  /**
   * Is the cell a header or not
   */
  header(): boolean;
  header(it: boolean): void;
  /**
   * The cell alignment
   */
  alignment(): Alignment;
  alignment(it: Alignment): void;
  static makeFields(header: boolean, alignment: Alignment, width: number, ...args: unknown[]): TableCell;
  static make(...args: unknown[]): TableCell;
}

/**
 * Ordered list block
 */
export class OrderedList extends ListBlock {
  static type$: sys.Type
  /**
   * The start number used in the marker, e.g. `1`, if available,
   * or null otherwise
   */
  startNumber(): number | null;
  startNumber(it: number | null): void;
  /**
   * The delimiter used in the marker, e.g. `.` or `)`, if available,
   * or null otherwise
   */
  markerDelim(): string | null;
  markerDelim(it: string | null): void;
  static make(startNumber: number | null, markerDelim: string | null, ...args: unknown[]): OrderedList;
}

export class HtmlRendererTest extends sys.Test {
  static type$: sys.Type
  testOrderedListStartZero(): void;
  testRawUrlsShouldNotFilterDangerousProtocols(): void;
  testCharacterReferencesWithoutSemicolonsShouldNotBeParsedShouldBeEscaped(): void;
  testAttributeEscaping(): void;
  testImageAltTextWithSoftLineBreak(): void;
  testSanitizeUrlsShouldFilterDangerousProtocols(): void;
  testHtmlAllowingShouldNotEscapeBlockHtml(): void;
  testImageAltTextWithEntities(): void;
  testSanitzieUrlsShouldAllowSafeProtocols(): void;
  testAltTextWithHardLineBreak(): void;
  testTextEscaping(): void;
  testCanRenderContentsOfSingleParagraph(): void;
  testSanitizedUrlsShouldSetRelNoFollow(): void;
  static make(...args: unknown[]): HtmlRendererTest;
  testPercentEncodeUrlDisabled(): void;
  testOmitSingleParagraphP(): void;
  testHtmlEscapingShouldEscapeHtmlBlocks(): void;
  testHtmlAllowingShouldNotEscapeInlineHtml(): void;
  testPercentEncodeUrl(): void;
  testHtmlEscapingShouldEscapeInlineHtml(): void;
}

export class DelimiterProcessorTest extends CoreRenderingTest {
  static type$: sys.Type
  static make(...args: unknown[]): DelimiterProcessorTest;
}

/**
 * Hard line break
 */
export class HardLineBreak extends Node {
  static type$: sys.Type
  static make(...args: unknown[]): HardLineBreak;
}

/**
 * Resulting object for continuing parsing of a block.
 */
export class BlockContinue extends sys.Obj {
  static type$: sys.Type
  newIndex(): number;
  newColumn(): number;
  finalize(): boolean;
  static atColumn(newColumn: number, ...args: unknown[]): BlockContinue;
  static finished(...args: unknown[]): BlockContinue;
  static none(...args: unknown[]): BlockContinue;
  static atIndex(newIndex: number, ...args: unknown[]): BlockContinue;
}

/**
 * Mixin for parser/renderer extensions.
 * 
 * Markdown extensions encapsulate all the modifications to the
 * parser/renderer to support a given markdown "feature" (e.g.
 * tables, strikethrough, etc.). The are registered using the
 * methods on the various builders.
 */
export abstract class MarkdownExt extends sys.Obj {
  static type$: sys.Type
  /**
   * Callback to extend the HTML renderer. Default implementation
   * does nothing.
   */
  extendHtml(builder: HtmlRendererBuilder): void;
  /**
   * Callback to extend the parser. Default implementation does
   * nothing.
   */
  extendParser(builder: ParserBuilder): void;
  /**
   * Callback to extend the Markdown renderer. Default
   * implementation does nothing.
   */
  extendMarkdown(builder: MarkdownRendererBuilder): void;
}

/**
 * A parsed link/image. There are different types of links.
 * 
 * Inline links:
 * ```
 * [text](destination)
 * [text](destination "title")
 * ```
 * 
 * Reference links, which have different subtypes. Full:
 * ```
 * [text][label]
 * ```
 * 
 * Collapsed (label is ""):
 * ```
 * [text][]
 * ```
 * 
 * Shorcut (label is null):
 * ```
 * [text]
 * ```
 * 
 * Images use the same syntax as links but with a `!` marker
 * front, e.g. `![text](destination)`.
 */
export abstract class LinkInfo extends sys.Obj {
  static type$: sys.Type
  /**
   * The destination if available, e.g. in `[foo](destination)`, or
   * null
   */
  destination(): string | null;
  /**
   * The label, or null for inline links or for shortcut links
   * (in which case {@link text | text} should be used as the
   * label).
   */
  label(): string | null;
  /**
   * The title if available, e.g. in `[foo](destination "title")`,
   * or null
   */
  title(): string | null;
  /**
   * The text node of the opening bracket `[`
   */
  openingBracket(): Text;
  /**
   * The marker if present, or null. A marker is e.g. `!` for an
   * image, or a customer marker.
   */
  marker(): Text | null;
  /**
   * The position after the closing text bracket, e.g:
   * ```
   * [foo][bar]
   *      ^
   * 
   * ```
   */
  afterTextBracket(): Position;
  /**
   * The text between the first brackets, e.g. `foo` in `[foo][bar]`
   */
  text(): string;
}

/**
 * HTML block
 */
export class HtmlBlock extends Block {
  static type$: sys.Type
  literal(): string | null;
  literal(it: string | null): void;
  static make(literal?: string | null, ...args: unknown[]): HtmlBlock;
}

/**
 * Parser factory for a block node for determining when a block
 * starts.
 */
export class BlockParserFactory extends sys.Obj {
  static type$: sys.Type
  tryStart(state: ParserState, matchedBlockParser: MatchedBlockParser): BlockStart | null;
  static make(...args: unknown[]): BlockParserFactory;
}

/**
 * Paragraph
 */
export class Paragraph extends Block {
  static type$: sys.Type
  static make(...args: unknown[]): Paragraph;
}

/**
 * Context for rendering nodes to Markdown
 */
export class MarkdownContext extends sys.Obj {
  static type$: sys.Type
  writer(): MarkdownWriter;
  writer(it: MarkdownWriter): void;
  specialChars(): sys.List<number>;
  render(node: Node): void;
}

/**
 * List item
 */
export class ListItem extends Block {
  static type$: sys.Type
  /**
   * The indent of the marker such as `-` or `1.` in columns (spaces
   * or tab stop of 4) if available, or null otherwise.
   * - `- Foo`    (marker indent: 0)
   * - ` - Foo`   (marker indent: 1)
   * - `  1. Foo` (marker indent: 2)
   */
  markerIndent(): number | null;
  markerIndent(it: number | null): void;
  /**
   * The indent of the content in columns (spaces or tab stop of
   * 4) if available or null otherwise. The content indent is
   * counted from the beginning of the line and includes the
   * marker on the first line
   * - `- Foo`     (content indent: 2)
   * - ` - Foo`    (content indent: 3)
   * - `  1. Foo`  (content indent: 5)
   * 
   * Note that subsequent lines in the same list item need to be
   * indented by at least the content indent to be counted as
   * part of the list item.
   */
  contentIndent(): number | null;
  contentIndent(it: number | null): void;
  static make(markerIndent: number | null, contentIndent: number | null, ...args: unknown[]): ListItem;
}

/**
 * A factory for extending inline content parsing.
 */
export abstract class InlineContentParserFactory extends sys.Obj {
  static type$: sys.Type
  /**
   * An inline content parser needs to have a special "trigger"
   * character which activates it. When this character is
   * encountered during inline parsing, {@link InlineContentParser.tryParse | InlineContentParser.tryParse}
   * is called wit hthe current parser state. It can also
   * register for more than one trigger character
   */
  triggerChars(): sys.List<number>;
  /**
   * Create an {@link InlineContentParser | InlineContentParser}
   * that will do the parsing. Create is called once per text
   * snippet of inline content inside block structures, and then
   * called each time a trigger character is encountered.
   */
  create(): InlineContentParser;
}

/**
 * Image node
 */
export class Image extends LinkNode {
  static type$: sys.Type
  static make(destination: string, title?: string | null, ...args: unknown[]): Image;
}

/**
 * A block parser is able to parse a specific block node.
 */
export class BlockParser extends sys.Obj {
  static type$: sys.Type
  /**
   * Return true if the this block may contain the child block;
   * false otherwise (default)
   */
  canContain(childBlock: Block): boolean;
  /**
   * Return true if the block that is parsed is a container (i.e.
   * contains other blocks), or false (default) if it's a leaf.
   */
  isContainer(): boolean;
  /**
   * Callback to parse inline content
   */
  parseInlines(inlineParser: InlineParser): void;
  /**
   * Default implementation does nothing with the source line
   */
  addLine(line: SourceLine): void;
  /**
   * Add a source span of the currently parsed block. The default
   * implementation adds it to the block. Unless you have some
   * complicated parsing where you need to check source
   * positions, you don't need to override this.
   */
  addSourceSpan(sourceSpan: SourceSpan): void;
  /**
   * Return true if the block can have lazy continuation lines.
   * 
   * Lazy continuation lines are lines that were rejected by this
   * {@link tryContinue | tryContinue} but didn't match any other
   * block parser either.
   * 
   * If true is returned here, those lines will get added via {@link addLine | addLine}.
   * For false (default), the block is closed instead.
   */
  canHaveLazyContinuationLines(): boolean;
  /**
   * Do any processing when the block is closed
   */
  closeBlock(): void;
  /**
   * Get the parsed block
   */
  block(): Block;
  /**
   * Attempt to continue parsing the block from the given state
   */
  tryContinue(state: ParserState): BlockContinue | null;
  /**
   * Return the definitions parsed by this parser. The
   * definitions returned here can later be accessed during
   * inline parsing.
   */
  definitions(): sys.List<DefinitionMap>;
  static make(...args: unknown[]): BlockParser;
}

export class Alignment extends sys.Enum {
  static type$: sys.Type
  static unspecified(): Alignment;
  /**
   * List of Alignment values indexed by ordinal
   */
  static vals(): sys.List<Alignment>;
  static center(): Alignment;
  static right(): Alignment;
  static left(): Alignment;
  /**
   * Return the Alignment instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): Alignment;
}

export class NodeTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): NodeTest;
  test(): void;
}

/**
 * Emphasis
 */
export class Emphasis extends Node implements Delimited {
  static type$: sys.Type
  delimiter(): string;
  closingDelim(): string;
  openingDelim(): string;
  static make(delimiter: string, ...args: unknown[]): Emphasis;
}

/**
 * Resulting object for starting parsing of a block. See {@link BlockParserFactory | BlockParserFactory}.
 */
export class BlockStart extends sys.Obj {
  static type$: sys.Type
  isReplaceActiveBlockParser(): boolean;
  isReplaceActiveBlockParser(it: boolean): void;
  newIndex(): number;
  newIndex(it: number): void;
  newColumn(): number;
  newColumn(it: number): void;
  blockParsers(): sys.List<BlockParser>;
  blockParsers(it: sys.List<BlockParser>): void;
  atColumn(newColumn: number): this;
  replaceActiveBlockParser(): this;
  static none(...args: unknown[]): BlockStart;
  static of(blockParsers: sys.List<BlockParser>, ...args: unknown[]): BlockStart;
  atIndex(newIndex: number): this;
}

export class HtmlCoreSpecTest extends CommonMarkSpecTest {
  static type$: sys.Type
  static make(...args: unknown[]): HtmlCoreSpecTest;
}

/**
 * A position in the {@link Scanner | Scanner} consists of its
 * line index (i.e. line number) and its index within the line
 */
export class Position extends sys.Obj {
  static type$: sys.Type
  lineIndex(): number;
  index(): number;
  toStr(): string;
  static make(lineIndex: number, index: number, ...args: unknown[]): Position;
}

export class XetodocExtTest extends RenderingTest {
  static type$: sys.Type
  testTicks(): void;
  testBacktickLinks(): void;
  static make(...args: unknown[]): XetodocExtTest;
}

/**
 * Strong emphasis
 */
export class StrongEmphasis extends Node implements Delimited {
  static type$: sys.Type
  delimiter(): string;
  closingDelim(): string;
  openingDelim(): string;
  static make(delimiter: string, ...args: unknown[]): StrongEmphasis;
}

/**
 * Table row of a {@link TableHead | TableHead} or {@link TableBody | TableBody}
 * containing {@link TableCell | TableCell}s
 */
export class TableRow extends CustomNode {
  static type$: sys.Type
  static make(...args: unknown[]): TableRow;
}

/**
 * Builder for configuring a {@link MarkdownRenderer | MarkdownRenderer}
 */
export class MarkdownRendererBuilder extends sys.Obj {
  static type$: sys.Type
  /**
   * Register additional special characters that must be escaped
   * in normal text
   */
  withSpecialChars(special: sys.List<number>): this;
  /**
   * Enable the given extensions on this renderer.
   */
  extensions(exts: sys.List<MarkdownExt>): this;
  /**
   * Build the configured {@link MarkdownRenderer | MarkdownRenderer}.
   */
  build(): MarkdownRenderer;
  /**
   * Add a factory for a node renderer. This allows to override
   * the rendering of node types or define rendering for custom
   * node types.
   */
  nodeRendererFactory(factory: ((arg0: MarkdownContext) => NodeRenderer)): this;
}

/**
 * Heading block
 */
export class Heading extends Block {
  static type$: sys.Type
  /**
   * The heading "level"
   */
  level(): number;
  static make(level?: number, ...args: unknown[]): Heading;
}

/**
 * Node visitor
 */
export abstract class Visitor extends sys.Obj {
  static type$: sys.Type
  visitBulletList(node: BulletList): void;
  visitCustomNode(node: CustomNode): void;
  visitFencedCode(node: FencedCode): void;
  visitThematicBreak(node: ThematicBreak): void;
  visitLinkReferenceDefinition(node: LinkReferenceDefinition): void;
  visitHeading(node: Heading): void;
  visitDocument(node: Document): void;
  visitStrongEmphasis(node: StrongEmphasis): void;
  visitText(node: Text): void;
  visitListItem(node: ListItem): void;
  visitOrderedList(node: OrderedList): void;
  visitCode(node: Code): void;
  visitHtmlBlock(node: HtmlBlock): void;
  visitHardLineBreak(node: HardLineBreak): void;
  visitParagraph(node: Paragraph): void;
  visitCustomBlock(node: CustomBlock): void;
  visitLink(node: Link): void;
  visitBlockQuote(node: BlockQuote): void;
  visitIndentedCode(node: IndentedCode): void;
  visitSoftLineBreak(node: SoftLineBreak): void;
  visitEmphasis(node: Emphasis): void;
  visitImage(node: Image): void;
  visitHtmlInline(node: HtmlInline): void;
}

export class ListBlockParserTest extends sys.Test {
  static type$: sys.Type
  parser(): Parser | null;
  parser(it: Parser | null): void;
  testBulletListIndents(): void;
  static make(...args: unknown[]): ListBlockParserTest;
  testOrderedListIndents(): void;
  setup(): void;
}

/**
 * Extension point for adding/changing attributes on HTML tags
 * for a node.
 */
export abstract class AttrProvider extends sys.Obj {
  static type$: sys.Type
  /**
   * Set the attributes for an HTML tag of the specified node by
   * modyfing the provided map.
   * 
   * This allows to change or even remove default attributes.
   * 
   * The attribute key and values will be escaped (preserving
   * character entities), so don't escape them here, otherwise
   * they will be double-escaped.
   * 
   * This method may be called multiple times for the same node,
   * if the node is rendered using multiple nested tags (e.g.
   * code blocks)
   */
  setAttrs(node: Node, tagName: string, attrs: sys.Map<string, string | null>): void;
}

export class DelimitedTest extends sys.Test {
  static type$: sys.Type
  testEmphasis(): void;
  static make(...args: unknown[]): DelimitedTest;
}

/**
 * A node that uses delimiters in the source form, e.g. `*bold*`
 */
export abstract class Delimited extends sys.Obj {
  static type$: sys.Type
  /**
   * Return the closing (ending) delimiter, e.g. `*`
   */
  closingDelim(): string;
  /**
   * Return the opening (beginning) delimiter, e.g. `*`
   */
  openingDelim(): string;
}

/**
 * A map that can be used to store and lookup reference
 * definitions by a label. The labels are case-insensitive and
 * normalized, the same way as for LinkReferenceDefinition
 * nodes.
 */
export class DefinitionMap extends sys.Obj {
  static type$: sys.Type
  /**
   * The type of definition stored in this map
   */
  of(): sys.Type;
  addAll(that: DefinitionMap): void;
  get(label: string, def?: Block | null): Block | null;
  static make(of$: sys.Type, ...args: unknown[]): DefinitionMap;
  /**
   * Store a new definition unless one is already in the map. If
   * there is no definition for the label yet, return null.
   * Otherwise return the existing definition
   * 
   * The label is normalized by the definition map before
   * storing.
   */
  putIfAbsent(label: string, def: Block): Block | null;
}

/**
 * A list of source spans that can be added to. Takes care of
 * merging adjacent source spans
 */
export class SourceSpans extends sys.Obj {
  static type$: sys.Type
  sourceSpans(): sys.List<SourceSpan>;
  sourceSpans(it: sys.List<SourceSpan>): void;
  static empty(...args: unknown[]): SourceSpans;
  static priv_make(...args: unknown[]): SourceSpans;
  addAllFrom(nodes: sys.List<Node>): void;
  addAll(other: sys.List<SourceSpan>): void;
}

export class ScannerTest extends sys.Test {
  static type$: sys.Type
  testCodePoints(): void;
  testNext(): void;
  testWhitespace(): void;
  static make(...args: unknown[]): ScannerTest;
  testTextBetween(): void;
  testMultipleLines(): void;
  testNextStr(): void;
}

/**
 * Table block containing a {@link TableHead | TableHead} and
 * optionally a {@link TableBody | TableBody}
 */
export class Table extends CustomBlock {
  static type$: sys.Type
  static make(...args: unknown[]): Table;
}

/**
 * Delimiter (emphasis, strong emphasis, or custom emphasis)
 */
export class Delimiter extends sys.Obj {
  static type$: sys.Type
  /**
   * can close emphasis, see spec.
   */
  canClose(): boolean;
  next(): Delimiter | null;
  next(it: Delimiter | null): void;
  prev(): Delimiter | null;
  prev(it: Delimiter | null): void;
  /**
   * The number of characters originally in this delimiter run;
   * at the start of processing, this is the same as {@link size | size}
   */
  origSize(): number;
  /**
   * can open emphasis, see spec.
   */
  canOpen(): boolean;
  delimChar(): number;
  chars(): sys.List<Text>;
  chars(it: sys.List<Text>): void;
  toStr(): string;
  /**
   * Get the opening delimiter nodes for the specified number of
   * delimiters.
   * 
   * For example, for a delimiter run `***`, calling this with 1
   * would return the last `*`.  Calling it with 2 would return the
   * second last `*` and last `*`.
   */
  openers(len: number): sys.List<Text>;
  /**
   * Return the innermost closing delimiter, e.g. for `***` this is
   * the first `*`
   */
  closer(): Text;
  /**
   * The number of characters in this delimiter run (that are
   * left for processing)
   */
  size(): number;
  /**
   * Return the innermost opening delimiter, e.g. for `***` this is
   * the last `*`
   */
  opener(): Text;
  static make(chars: sys.List<Text>, delimChar: number, canOpen: boolean, canClose: boolean, prev: Delimiter | null, ...args: unknown[]): Delimiter;
  /**
   * Get the closing delimiter nodes for the specified number of
   * delimiters.
   * 
   * For example, for a delimiter run `***`, calling this with 1
   * would return the first `*`, calling it with 2 would return the
   * first `*` and the second `*`.
   */
  closers(len: number): sys.List<Text>;
}

/**
 * Sanitizes uris for img and a elements by whitelisting
 * protocols. This is intended to prevent XSS payloads like
 * ```
 * [Click this totally safe url](javascript:document.xss=true;)
 * ```
 * 
 * Implementation based on
 * https://github.com/OWASP/java-html-sanitizer/blob/f07e44b034a45d94d6fd010279073c38b6933072/src/main/java/org/owasp/html/FilterUrlByProtocolAttributePolicy.java
 */
export abstract class UrlSanitizer extends sys.Obj {
  static type$: sys.Type
  /**
   * Sanitize a url for use in the src attribute of a Image
   */
  sanitizeImage(url: string): string;
  /**
   * Sanitize a url for use in the href attribute of a Link
   */
  sanitizeLink(url: string): string;
}

/**
 * Text
 */
export class Text extends Node {
  static type$: sys.Type
  literal(): string;
  literal(it: string): void;
  static make(literal: string, ...args: unknown[]): Text;
}

/**
 * Runs all the tests from the common mark specification
 * 
 * The spec.json was generated from the [commonmark-spec](https://github.com/commonmark/commonmark-spec)
 * repo using this command:
 * ```
 * python test/spec_tests.py --dump-tests > spec.json
 * 
 * ```
 * 
 * The commonmark-java implementation actually does a simple
 * parsing of the spec.md file to extract the examples, but we
 * can't do that because of fantom unicode issues. Also, it
 * would require a bit more code to do that and this prcoess is
 * not so bad.
 */
export class CommonMarkSpecTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): CommonMarkSpecTest;
  test(): void;
}

/**
 * Custom delimiter processor for additional delimiters besides
 * `_` and `*`.
 * 
 * Note that implementations of this need to be thread-safe,
 * the same instance may be used by multiple parsers.
 */
export abstract class DelimiterProcessor extends sys.Obj {
  static type$: sys.Type
  /**
   * Process the delimiter runs.
   * 
   * The processor can examine the runs and the nodes and decide
   * if it wants to process or not. If not, it should not change
   * any nodes and return 0. If yes, it should do the processing
   * (wrapping nodes, etc.) and then return how many delimiters
   * were used.
   * 
   * Note that removal (unlinking) of the used delimiter {@link Text | Text}
   * nodes is done by the caller.
   * 
   * Returns how many delimiters were used; must not be greater
   * than the length of either opener or closer
   */
  process(openingRun: Delimiter, closingRun: Delimiter): number;
  /**
   * The character that marks the ending of a delimited node,
   * must not clas with any built-in special characters. Note
   * that for a symmetric delimiter such as `*`, this is the same
   * as the opening.
   */
  closingChar(): number;
  /**
   * The character that marks the beginning of a delimited node,
   * must not clash with any built-in special characters.
   */
  openingChar(): number;
  /**
   * Minimum number of delimiter characters that are needed to
   * activate this. Must be at least 1.
   */
  minLen(): number;
}

export class FencedCodeParserTest extends CoreRenderingTest {
  static type$: sys.Type
  testClosingCanHaveSpacesAfter(): void;
  testBacktickInfo(): void;
  test151(): void;
  static make(...args: unknown[]): FencedCodeParserTest;
  testClosingCanNotHavNonSpaces(): void;
  testBacktickInfoDoesntAllowBacktick(): void;
  testBacktickAndTildeCantBeMixed(): void;
}

/**
 * Block parsing state.
 */
export abstract class ParserState extends sys.Obj {
  static type$: sys.Type
  /**
   * Get the index of the next non-space character starting from {@link index | index}
   * (may be the same) (0-based)
   */
  nextNonSpaceIndex(): number;
  /**
   * Get the deepest open block parser
   */
  activeBlockParser(): BlockParser;
  /**
   * Get the indentation in columns (either by spaces or tab stop
   * of 4), starting from {@link column | column}.
   */
  indent(): number;
  /**
   * The current source line being parsed (full line)
   */
  line(): SourceLine | null;
  /**
   * The colum is the position within the line after tab
   * characters have been processed as 4-space tab stops. If the
   * line doesn't contain any tabs, it's the same as the {@link index | index}.
   * If the line starts with a tab, followed by text, then the
   * column for the first character of the text is 4 (the index
   * is 1)
   * 
   * Returns the current column within the line (0-based)
   */
  column(): number;
  /**
   * The current index within the line (0-based)
   */
  index(): number;
  /**
   * Return true if the current line is blank starting from the {@link index | index}
   */
  isBlank(): boolean;
}

/**
 * Enum for configuring whether to include SourceSpans or not
 * while parsing.
 */
export class IncludeSourceSpans extends sys.Enum {
  static type$: sys.Type
  /**
   * List of IncludeSourceSpans values indexed by ordinal
   */
  static vals(): sys.List<IncludeSourceSpans>;
  /**
   * Include source spans on Block nodes
   */
  static blocks(): IncludeSourceSpans;
  /**
   * Include source spans on block nodes and inline nodes
   */
  static blocks_and_inlines(): IncludeSourceSpans;
  /**
   * Do not include source spans
   */
  static none(): IncludeSourceSpans;
  /**
   * Return the IncludeSourceSpans instance for the specified
   * name.  If not a valid name and checked is false return null,
   * otherwise throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): IncludeSourceSpans;
}

/**
 * Builder for configuring an {@link HtmlRenderer | HtmlRenderer}.
 */
export class HtmlRendererBuilder extends sys.Obj {
  static type$: sys.Type
  /**
   * Add a factory for instantiating a node renderer (done when
   * rendering). This allows to override the rendering of node
   * types or define rendering for custom node types.
   * 
   * If multiple node renderers for the same node type are
   * created, the one from the factory that was added first
   * "wins". (This is how rendering for core node types can be
   * overriden; the default rendering comes last).
   */
  nodeRendererFactory(factory: ((arg0: HtmlContext) => NodeRenderer)): this;
  /**
   * Whether {@link Image | Image} src and {@link Link | Link} href
   * should be sanitized, defaults to `false`.
   */
  withSanitizeUrls(val?: boolean): this;
  /**
   * Whether {@link HtmlInline | HtmlInline} and {@link HtmlBlock | HtmlBlock}
   * should be escaped, defaults to `false`.
   * 
   * Note that {@link HtmlInline | HtmlInline} is only a tag
   * itself, not the text between an opening tag and closing tag.
   * So markup in the text will be parsed as normal and is not
   * affected by this option.
   */
  withEscapeHtml(val?: boolean): this;
  /**
   * The HTML to use for rendering a softbreak, default to `\n`
   * (meaning the rendered result doesn't have a line break).
   * 
   * Set it to `<br>` or `<br />` to make the hard breaks.
   * 
   * Set it to ` ` (space) to ingore line wrapping in the source.
   */
  withSoftBreak(s: string): this;
  /**
   * Add a factory for an attribute provider for adding/changing
   * HTML attributes to the rendered tags.
   */
  attrProviderFactory(factory: ((arg0: HtmlContext) => AttrProvider)): this;
  /**
   * Configure the given extensions on this this renderer
   */
  extensions(exts: sys.List<MarkdownExt>): this;
  /**
   * Whether documents that only contain a single paragraph
   * shoudl be rendered without the `<p>` tag. Set to `true` to
   * render without the tag; the default of `false` always renders
   * the tag.
   */
  withOmitSingleParagraphP(val?: boolean): this;
  /**
   * Get the configured {@link HtmlRenderer | HtmlRenderer}
   */
  build(): HtmlRenderer;
  /**
   * Whether URLs of link or images should be percent-encoded,
   * defaults to `false`.
   * 
   * If enabled, the following is done:
   * - Existing percent-encoded parts are preserved (e.g. "%20" is
   *   kept as "%20")
   * - Reserved characters such as "/" are preserved, except for
   *   "[" and "]" (see encodeURL in JS).
   * - Other characters such as umlauts are percent-encoded
   */
  withPercentEncodeUrls(val?: boolean): this;
}

/**
 * Writer for Markdown (CommonMark) text.
 */
export class MarkdownWriter extends sys.Obj {
  static type$: sys.Type
  /**
   * Wheter we're at the line start (not counting any prefixes),
   * i.e. after a {@link line | line} or {@link block | block}.
   */
  atLineStart(): boolean;
  atLineStart(it: boolean): void;
  /**
   * The last character that was written
   */
  lastChar(): number;
  lastChar(it: number): void;
  /**
   * Remove the last prefix from the top of the stack
   */
  popPrefix(): void;
  /**
   * Write a newline (line terminator).
   */
  line(): void;
  /**
   * Remove the last "tight" setting from the top of the stack
   */
  popTight(): void;
  /**
   * Escape the characters matching the supplied matcher, in all
   * text (text and raw). This might be usefult to extensions
   * that add another layer of syntax, e.g. the tables extension
   * that uses `|` to separate cells and needs all `|` characters to
   * be escaped (even in code spans)
   */
  pushRawEscape(rawEscape: ((arg0: number) => boolean)): void;
  /**
   * Enqueue a block separator to be written before the next text
   * is written. Block separators are not written straight away
   * because if there are no more blocks to write, we don't want
   * a separator (at the end of the document)
   */
  block(): void;
  /**
   * Write the supplied string with escaping
   */
  text(s: string, escape?: ((arg0: number) => boolean) | null): void;
  static make(out: sys.OutStream, ...args: unknown[]): MarkdownWriter;
  /**
   * Push a prefix onto the top of the stack. All prefixes are
   * written at the beginning of each line, until the prefix is
   * popped again.
   */
  pushPrefix(prefix: string): void;
  /**
   * Write the supplied string or character (raw/unescaped except
   * if {@link pushRawEscape | pushRawEscape} was used).
   */
  raw(obj: sys.JsObj): void;
  /**
   * Change whether blocks are tight or loose. Loose is the
   * default where blocks are separated by a blank line. Tight is
   * where blocks are not separated by a blank line. Tight blocks
   * are used in lists, if there are no blank lines within the
   * list.
   * 
   * Note that changing this does not affect block separators
   * that have already been enqueued with {@link block | block},
   * only future ones.
   */
  pushTight(tight: boolean): void;
  /**
   * Write a prefix
   */
  writePrefix(prefix: string): void;
  /**
   * Remove the last raw escape from the top of the stack
   */
  popRawEscape(): void;
}

/**
 * A link reference definition
 * ```
 * [foo]: /url "title"
 * 
 * ```
 * 
 * They can be referenced anywhere else in the document to
 * produce a link using `[foo]`. The definitions themselves are
 * usually not rendered in the final output.
 */
export class LinkReferenceDefinition extends Block {
  static type$: sys.Type
  destination(): string;
  title(): string | null;
  label(): string;
  static make(label: string, destination: string, title: string | null, ...args: unknown[]): LinkReferenceDefinition;
}

/**
 * Extension for GFM tables using "|" pipes. (GitHub Flavored
 * Markdown).
 * 
 * See [Tables (extension) in GitHub Flavored Markdown Spec](https://github.github.com/gfm/#tables-extension)
 */
export class TablesExt extends sys.Obj implements MarkdownExt {
  static type$: sys.Type
  extendHtml(builder: HtmlRendererBuilder): void;
  extendParser(builder: ParserBuilder): void;
  extendMarkdown(builder: MarkdownRendererBuilder): void;
  static make(...args: unknown[]): TablesExt;
}

/**
 * A block node.
 * 
 * We can think of a document as a sequence of blocks -
 * structural elements like paragraphs, block quotations,
 * lists, headings, rules, and code blocks. Some blocks contain
 * other blocks; others contain inline content (text, images,
 * code spans, etc.).
 */
export class Block extends Node {
  static type$: sys.Type
  parent(): Block | null;
  static make(...args: unknown[]): Block;
}

/**
 * Renders a tree of nodes to HTML
 */
export class HtmlRenderer extends sys.Obj implements Renderer {
  static type$: sys.Type
  renderTo(out: sys.OutStream, node: Node): void;
  /**
   * Obtain a builder for configuring the renderer
   */
  static builder(): HtmlRendererBuilder;
  /**
   * Get a renderer with all the default configuration
   */
  static make(...args: unknown[]): HtmlRenderer;
  render(node: Node): string;
}

/**
 * Custom node
 */
export class CustomNode extends Node {
  static type$: sys.Type
  static make(...args: unknown[]): CustomNode;
}

export class LinkReferenceDefinitionParserTest extends sys.Test {
  static type$: sys.Type
  testTitleMultiline2(): void;
  testStartNoLabel(): void;
  testTitleMultiline4(): void;
  testTitleMultiline3(): void;
  testLabel(): void;
  testLabelMultiline(): void;
  testLabelInvalid(): void;
  testLabelStartsWithNewLine(): void;
  static make(...args: unknown[]): LinkReferenceDefinitionParserTest;
  testDestinationInvalid(): void;
  testEmptyLabel(): void;
  testDestination(): void;
  testLabelColon(): void;
  testTitle(): void;
  testTitleMultiline(): void;
  testTitleStartWhitespace(): void;
  testTitleInvalid(): void;
  setup(): void;
  testStartLabel(): void;
}

/**
 * Bullet list block
 */
export class BulletList extends ListBlock {
  static type$: sys.Type
  /**
   * The bullet list marker that was used, e.g. `-`, `*`, or `+`, if
   * available, or null otherwise.
   */
  marker(): string | null;
  marker(it: string | null): void;
  static make(marker?: string | null, ...args: unknown[]): BulletList;
}

/**
 * Fenced code block
 */
export class FencedCode extends Block {
  static type$: sys.Type
  /**
   * The fence character that was used, e.g. ```, or `~`, if
   * available, or null otherwise
   */
  fenceChar(): string | null;
  fenceChar(it: string | null): void;
  fenceIndent(): number;
  fenceIndent(it: number): void;
  /**
   * The length of the opening fence (how many of the {@link fenceChar | fenceChar}
   * were used to start the code block) if available, or null
   * otherwise
   */
  openingFenceLen(): number | null;
  openingFenceLen(it: number | null): void;
  literal(): string | null;
  literal(it: string | null): void;
  /**
   * The length of the closing fence (how many of the {@link fenceChar | fenceChar}
   * were used to end the code block) if available, or null
   * otherwise
   */
  closingFenceLen(): number | null;
  closingFenceLen(it: number | null): void;
  /**
   * Optional info string (see spec), e.g. `fantom` in ````fantom`
   */
  info(): string | null;
  info(it: string | null): void;
  static make(fenceChar?: string | null, ...args: unknown[]): FencedCode;
}

export class SourceLineTest extends sys.Test {
  static type$: sys.Type
  testSubstring(): void;
  static make(...args: unknown[]): SourceLineTest;
}

export class MarkdownRendererTest extends sys.Test {
  static type$: sys.Type
  testStrongEmphasis(): void;
  testTabs(): void;
  testCodeSpans(): void;
  testImages(): void;
  testOrderedListItemsFromAst(): void;
  testIndentedCodeBlocks(): void;
  testBulletListItemsFromAst(): void;
  testHtmlInline(): void;
  testParagraphs(): void;
  testHtmlBlocks(): void;
  testSoftBreak(): void;
  testThematicBreaks(): void;
  testEmphasis(): void;
  testFencedCodeBlocksFromAst(): void;
  static make(...args: unknown[]): MarkdownRendererTest;
  testLinks(): void;
  testBlockQuotes(): void;
  testEscaping(): void;
  testFencedCodeBlocks(): void;
  testHardBreak(): void;
  testOrderedListItems(): void;
  testBulletListItems(): void;
  testHeadings(): void;
}

export class ListTightLooseTest extends CoreRenderingTest {
  static type$: sys.Type
  testLooseNested2(): void;
  testOuter(): void;
  testLooseNested(): void;
  testLooseBlankLineAfterCodeBlock(): void;
  static make(...args: unknown[]): ListTightLooseTest;
  testTight(): void;
  testTightListWithCodeBlock2(): void;
  testTightListWithCodeBlock(): void;
  testTightWithBlankLineAfter(): void;
  testLooseListItem(): void;
  testLoose(): void;
  testLooseEmptyListItem(): void;
}

/**
 * Soft line break
 */
export class SoftLineBreak extends Node {
  static type$: sys.Type
  static make(...args: unknown[]): SoftLineBreak;
}

