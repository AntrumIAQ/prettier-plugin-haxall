import * as sys from './sys.js';
import * as util from './util.js';

/**
 * A set of non-exhaustive tests to ensure basic functionality.
 */
export class BasicYamlTest extends sys.Test {
  static type$: sys.Type
  /**
   * Tests anchors/aliases & self-nested nodes
   */
  testAnchors(): void;
  /**
   * Tests literal block scalars
   */
  testLiteral(): void;
  /**
   * Tests flow-plain text and folding
   */
  testPlain(): void;
  /**
   * Tests folded block scalars
   */
  testFolded(): void;
  /**
   * Tests --- and ... with non-empty documents
   */
  testDocSeparators(): void;
  decEnc(obj: sys.JsObj | null): sys.JsObj | null;
  /**
   * Tests single-quoted strings
   */
  testSingleQuoted(): void;
  static make(...args: unknown[]): BasicYamlTest;
  /**
   * Tests a full-length example from the spec
   */
  testFull(): void;
  /**
   * Tests directives and completely empty documents
   */
  testDirectives(): void;
  /**
   * Tests flow sequences
   */
  testFlowSeq(): void;
  verifyLoc(obj: YamlObj, line: number, col: number): void;
  /**
   * Tests flow mappings
   */
  testFlowMap(): void;
  /**
   * Tests double-quoted strings
   */
  testDoubleQuoted(): void;
  /**
   * Tests block sequences
   */
  testBlockSeq(): void;
  testEncode(): void;
  /**
   * Tests block maps
   */
  testBlockMap(): void;
}

/**
 * A YamlObj whose content always has the type `Str`. For
 * example, each item on the list below is a scalar:
 * ```
 * - This is a plain scalar
 * - "This is a string"
 * - !!int 5
 * 
 * ```
 */
export class YamlScalar extends YamlObj {
  static type$: sys.Type
  /**
   * Content value as a string
   */
  val(): string;
  /**
   * Creates a YamlScalar with the string `val` as content, found
   * at location `loc`, with `tag` as its tag.
   */
  static make(val: string, tag?: string, loc?: util.FileLoc, ...args: unknown[]): YamlScalar;
}

/**
 * A test suite for the YamlTokenizer class.
 */
export class YamlTokenTest extends sys.Test {
  static type$: sys.Type
  fc(): number;
  fc(it: number): void;
  testEat(): void;
  static make(...args: unknown[]): YamlTokenTest;
  testSpecial(): void;
  testPeek(): void;
}

/**
 * Converts YAML text into a hierarchy of {@link YamlObj | YamlObjs},
 * which can in turn be converted into native Fantom objects.
 * 
 * See the [pod documentation](yaml::pod-doc) for more
 * information.
 */
export class YamlReader extends sys.Obj {
  static type$: sys.Type
  /**
   * Creates a new YamlReader that reads YAML content from the
   * given file.
   */
  static makeFile(file: sys.File, ...args: unknown[]): YamlReader;
  /**
   * Parses the input stream as YAML content, returning each
   * document as its own YamlObj within a larger YamlList.
   */
  parse(): YamlList;
  /**
   * Creates a new YamlReader that reads YAML content from the
   * given InStream, optionally tracking file location data.
   */
  static make(in$: sys.InStream, loc?: util.FileLoc, ...args: unknown[]): YamlReader;
}

/**
 * The base class for objects that represent nodes in a YAML
 * hierarchy. The key information for each node is its tag and
 * content.
 * 
 * See the [pod documentation](yaml::pod-doc) for more
 * information.
 */
export class YamlObj extends sys.Obj {
  static type$: sys.Type
  /**
   * The node's content value. {@link YamlScalar | YamlScalars}
   * always have content of type `Str`, {@link YamlList | YamlLists}
   * with content type `YamlObj[]`, and {@link YamlMap | YamlMaps}
   * with `YamlObj:YamlObj`.
   */
  val(): sys.JsObj;
  /**
   * Returns `write` written into a string.
   */
  toStr(): string;
  /**
   * The text location from which this node was parsed.
   */
  loc(): util.FileLoc;
  /**
   * Convenience for {@link YamlSchema.decode | schema.decode}.
   */
  decode(schema?: YamlSchema): sys.JsObj | null;
  /**
   * Two YamlObjs are equal if they have the same type, same tag,
   * and same content.
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * The node's tag. Either a specific tag (e.g. `tag:yaml.org,2002:str`)
   * or the non-specific tag `?`.
   */
  tag(): string;
  /**
   * Transforms the YAML object back into a string, using block
   * style where applicable. The result ends with `\n` and may span
   * multiple lines.
   */
  write(out?: sys.OutStream): void;
  /**
   * Hash is based on tag and content
   */
  hash(): number;
}

/**
 * A YamlObj whose content always has the type `YamlObj[]`. For
 * example, each item on the list below is itself a list:
 * ```
 * - - a
 *   - b
 *   - c
 * - [a, b, c]
 * 
 * ```
 */
export class YamlList extends YamlObj {
  static type$: sys.Type
  /**
   * Creates a YamlList with the list `val` as content, found at
   * location `loc`, with `tag` as its tag.
   */
  static make(val: sys.List<YamlObj>, tag?: string, loc?: util.FileLoc, ...args: unknown[]): YamlList;
  /**
   * Content value as a list
   */
  val(): sys.List<YamlObj>;
  /**
   * Iterate the list items
   */
  each(f: ((arg0: YamlObj) => void)): void;
}

/**
 * Runs the comprehensive YAML tests from
 * https://github.com/yaml/yaml-test-suite/.
 */
export class YamlTestSuite extends sys.Test {
  static type$: sys.Type
  /**
   * Run all tests in the suite
   */
  testRunSuite(): void;
  static make(...args: unknown[]): YamlTestSuite;
  /**
   * Run a single test of interest for debugging purposes
   */
  runOne(): void;
}

/**
 * A YamlObj whose content always has the type `YamlObj:YamlObj`.
 * For example, each item on the list below is a map:
 * ```
 * - foo: bar
 *   a: b
 * - {foo: bar, a: b}
 * 
 * ```
 */
export class YamlMap extends YamlObj {
  static type$: sys.Type
  /**
   * Content value as a map
   */
  val(): sys.Map<YamlObj, YamlObj>;
  /**
   * Creates a YamlMap with the map `val` as content, found at
   * location `loc`, with `tag` as its tag.
   */
  static make(val: sys.Map<YamlObj, YamlObj>, tag?: string, loc?: util.FileLoc, ...args: unknown[]): YamlMap;
}

/**
 * A class used to convert parsed YamlObjs to native Fantom
 * objects, and vice versa.
 * 
 * Different schemas can recognize different tags; for example,
 * the failsafe schema only recognizes the str, seq, and map
 * tags and ignores all the rest (thus only generating Strs,
 * Lists, and Maps), while the JSON schema also recognizes
 * integers, booleans, etc.
 * 
 * See the [pod documentation](yaml::pod-doc#schemas) for more
 * information, especially about the specifics of each built-in
 * schema.
 */
export class YamlSchema extends sys.Obj {
  static type$: sys.Type
  /**
   * A basic YamlSchema that only generates maps, lists, and
   * strings.
   */
  static failsafe(): YamlSchema;
  /**
   * The default YamlSchema.
   */
  static core(): YamlSchema;
  /**
   * A YamlSchema that can parse all JSON tokens and errors when
   * a plain token is not JSON-compliant.
   */
  static json(): YamlSchema;
  /**
   * Transforms the native Fantom object into a YamlObj hierarchy
   * that preserves as much information as possible. The object
   * must be [serializable](https://fantom.org/doc/docLang/Serialization#serializable)
   * or [simple](https://fantom.org/doc/docLang/Serialization#simple).
   * YamlObjs are encoded as themselves; no further processing is
   * done.
   */
  encode(obj: sys.JsObj | null): YamlObj;
  /**
   * Recursively transforms the YAML object into a native Fantom
   * object using this tag resolution schema.
   */
  decode(node: YamlObj): sys.JsObj | null;
  static make(...args: unknown[]): YamlSchema;
}

