import * as sys from './sys.js';

/**
 * SyntaxLine models one parsed line of code
 */
export class SyntaxLine extends sys.Obj {
  static type$: sys.Type
  /**
   * One based line number
   */
  num(): number;
  /**
   * Iterate each segment span of text in the line
   */
  eachSegment(f: ((arg0: SyntaxType, arg1: string) => void)): void;
}

/**
 * SyntaxType models a syntax specific segment type such
 * keyword or comment
 */
export class SyntaxType extends sys.Enum {
  static type$: sys.Type
  /**
   * List of SyntaxType values indexed by ordinal
   */
  static vals(): sys.List<SyntaxType>;
  /**
   * String literal
   */
  static literal(): SyntaxType;
  /**
   * Bracket such as `{`, `}`, `(`, `)`, `[`, or `]`
   */
  static bracket(): SyntaxType;
  /**
   * Comment section either to end of line or multi-line block
   */
  static comment(): SyntaxType;
  /**
   * Normal text
   */
  static text(): SyntaxType;
  /**
   * Language specific keyword
   */
  static keyword(): SyntaxType;
  /**
   * Return the SyntaxType instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): SyntaxType;
}

/**
 * Syntax rules for a string or character literal
 */
export class SyntaxStr extends sys.Obj {
  static type$: sys.Type
  /**
   * Token which delimits the end of the string, or if null, then
   * {@link delimiter | delimiter} is assumed to be both the start
   * and end of the string.
   */
  delimiterEnd(): string | null;
  /**
   * Can this string literal span multiple lines
   */
  multiLine(): boolean;
  /**
   * Token which delimits the start and end of the string. If the
   * end delimiter is different, then also set the {@link delimiterEnd | delimiterEnd}
   * field.
   */
  delimiter(): string;
  /**
   * Escape character placed before ending delimiter to indicate
   * the delimiter is part of the string, not the end.  The
   * escape character is also assumed to escape itself.
   */
  escape(): number;
  static make(...args: unknown[]): SyntaxStr;
}

export class SyntaxTest extends sys.Test {
  static type$: sys.Type
  static b(): SyntaxType;
  static c(): SyntaxType;
  static k(): SyntaxType;
  static s(): SyntaxType;
  static t(): SyntaxType;
  testMultilineNested2(): void;
  testMultiline1(): void;
  testComments(): void;
  verifySyntax(ext: string, src: string, expected: sys.List<sys.List<sys.JsObj>>): void;
  static make(...args: unknown[]): SyntaxTest;
  testKeywords(): void;
  testMultiLineStr(): void;
  testStrs(): void;
  lineToStr(styling: sys.List<sys.JsObj>): string;
  testMultilineNested1(): void;
  testMultilineUnnested(): void;
  testMixedBlocks(): void;
}

/**
 * HtmlSyntaxWriter outputs a SyntaxDoc to HTML
 */
export class HtmlSyntaxWriter extends sys.Obj {
  static type$: sys.Type
  /**
   * Write the lines of the document as HTML elements.  This
   * method does not generate HTML head/body tags.
   */
  writeLines(doc: SyntaxDoc): this;
  /**
   * Write an entire HTML file with proper head, body types using
   * default CSS
   */
  writeDoc(doc: SyntaxDoc): this;
  /**
   * Write a single syntax line as styled HTML
   */
  writeLine(line: SyntaxLine): this;
  static make(out?: sys.OutStream, ...args: unknown[]): HtmlSyntaxWriter;
  /**
   * Close underlying output stream
   */
  close(): boolean;
}

/**
 * SyntaxDoc models a full document as a series of SyntaxLines.
 */
export class SyntaxDoc extends sys.Obj {
  static type$: sys.Type
  /**
   * Rules used to parse this document.
   */
  rules(): SyntaxRules;
  rules(it: SyntaxRules): void;
  /**
   * Parse an input stream into a document using given rules. The
   * input stream is guaranteed to be closed.
   */
  static parse(rules: SyntaxRules, in$: sys.InStream): SyntaxDoc;
  /**
   * Iterate each line of the document.
   */
  eachLine(f: ((arg0: SyntaxLine) => void)): void;
}

/**
 * SyntaxRules defines the syntax rules used to parse a
 * specific programming language.
 */
export class SyntaxRules extends sys.Obj {
  static type$: sys.Type
  /**
   * Start tokens for single line comments to end of line (list
   * of strings).
   */
  comments(): sys.List<string> | null;
  __comments(it: sys.List<string> | null): void;
  /**
   * List of the keywords.
   */
  keywords(): sys.List<string> | null;
  __keywords(it: sys.List<string> | null): void;
  /**
   * Can block comments be nested (default is false).
   */
  blockCommentsNest(): boolean;
  __blockCommentsNest(it: boolean): void;
  /**
   * Bracket characters defaults to "()[]{}".
   */
  brackets(): string;
  __brackets(it: string): void;
  /**
   * String and character literal styles
   */
  strs(): sys.List<SyntaxStr> | null;
  __strs(it: sys.List<SyntaxStr> | null): void;
  /**
   * Start token for multi-line block comments
   */
  blockCommentStart(): string | null;
  __blockCommentStart(it: string | null): void;
  /**
   * End token for multi-line block comments
   */
  blockCommentEnd(): string | null;
  __blockCommentEnd(it: string | null): void;
  /**
   * Load syntax rules for given file.  If the file has already
   * been parse then pass the first line to avoid re-reading the
   * file to check the "#!" shebang.  First we attempt to map the
   * file extension to rules.  If that fails, then we check the
   * first line to see if defines a "#!" shebang.  Return null if
   * no rules can be determined.
   */
  static loadForFile(file: sys.File, firstLine?: string | null): SyntaxRules | null;
  /**
   * Load syntax rules for given file extension using
   * "etc/syntax/ext.props". If no rules defined for extension
   * return null.
   */
  static loadForExt(ext: string): SyntaxRules | null;
  /**
   * Default constructor with it-block
   */
  static make(f?: ((arg0: SyntaxRules) => void) | null, ...args: unknown[]): SyntaxRules;
}

