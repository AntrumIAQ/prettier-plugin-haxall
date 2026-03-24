import * as sys from './sys.js';

/**
 * IRI
 */
export class Iri extends sys.Obj {
  static type$: sys.Type
  toStr(): string;
  compare(obj: sys.JsObj): number;
  /**
   * Get the IRI namespace
   */
  ns(): string;
  /**
   * Is this a blank node?
   */
  isBlankNode(): boolean;
  /**
   * Get the {@link Iri | Iri} as a [Uri](Uri). Note, because of [Uri](Uri)
   * normalization it is possible that two *un-equal* {@link Iri | Iri}s
   * will yield equivalent [Uri](Uri)s
   */
  uri(): sys.Uri;
  /**
   * If the current {@link ns | ns} contains a prefix in the given
   * map, then return a new {@link Iri | Iri} that uses the
   * prefix. Otherwise, return this.
   */
  prefixIri(prefixMap: sys.Map<string, string>): Iri;
  /**
   * If the current {@link ns | ns} prefix is mapped in the given
   * map, then return a new {@link Iri | Iri} that is the
   * expansion of the prefix. Otherwise, return this.
   */
  fullIri(prefixMap: sys.Map<string, string>): Iri;
  equals(obj: sys.JsObj | null): boolean;
  /**
   * Get the IRI local name
   */
  name(): string;
  static makeNs(ns: string, name: string, ...args: unknown[]): Iri;
  /**
   * Create an Iri for a blank node. You may provide a label, or
   * one will be automatically generated using [Uuid](Uuid). RDF
   * writers *may* choose to omit the label during serialization if
   * it is parseable as a [Uuid](Uuid).
   * 
   * Two blank nodes with the same label are considered equal.
   * 
   * Note: Technically, an IRI is *not* a blank node; they are two
   * distinct types of resources. But we put a restriction on our
   * IRI implementation such that all IRIs with ns `_:` are blank
   * nodes.
   */
  static bnode(label?: string): Iri;
  static make(iri: string, ...args: unknown[]): Iri;
  /**
   * Make an {@link Iri | Iri} from a [Uri](Uri). You should **never**
   * use this constructor if the `uri` is intended to represent a
   * prefixed IRI because a [Uri](Uri) will normalize its scheme.
   * Becaues of this normalization, the following is true:
   * ```
   * // because `phIoT::elec`.toStr == "phiot:elec"
   * Iri(`phIoT:elec`) != Iri("phIoT:elec")
   * Iri(`phIoT:elec`) == Iri("phiot:elec")
   * ```
   * 
   * You have been warned.
   */
  static makeUri(uri: sys.Uri, ...args: unknown[]): Iri;
  hash(): number;
}

export class StmtTest extends sys.Test {
  static type$: sys.Type
  nsMap(): sys.Map<string, string>;
  nsMap(it: sys.Map<string, string>): void;
  testEquality(): void;
  static make(...args: unknown[]): StmtTest;
  testNormalize(): void;
}

export class IriTest extends sys.Test {
  static type$: sys.Type
  nsMap(): sys.Map<string, string>;
  nsMap(it: sys.Map<string, string>): void;
  testBlankNode(): void;
  testEquality(): void;
  static make(...args: unknown[]): IriTest;
  testPrefixIri(): void;
  testFullIri(): void;
}

/**
 * An [OutStream](OutStream) for writing RDF statements.
 */
export class RdfOutStream extends sys.OutStream {
  static type$: sys.Type
  /**
   * Associate a prefix with a namespace. If the prefix is
   * already mapped to a different namespace, then throw [ArgErr](ArgErr).
   * 
   * If an RDF export format doesn't support namesapce prefixes,
   * this is a no-op. The behavior of the RDF out stream is
   * undefined if you call this method of you have called {@link writeStmt | writeStmt},
   * so you should set all your namespace prefixes prior to
   * writing statements.
   * 
   * Return this.
   * ```
   * out.setNs("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
   * ```
   */
  setNs(prefix: string, namespace: string): this;
  /**
   * There is no guarantee that any (or all) bytes are written to
   * the output stream until this method is called. Therefore,
   * when you are finished writing all RDF statements, you **must**
   * call this method to allow the implementation a chance to
   * finish any pending writes.
   * 
   * This method should only be invoked once when you are done
   * writing all statements. The behavior is undefined if you
   * invoke this method multiple times.
   * 
   * Closing this output stream will always call finish first.
   */
  finish(): this;
  /**
   * Construct by wrapping the given output stream.
   */
  static make(out: sys.OutStream, ...args: unknown[]): RdfOutStream;
  close(): boolean;
  /**
   * Write the given RDF statement.
   * 
   * All writers should handle mapping the following Fantom types
   * to well-defined RDF data types without requiring a type for `typeOrLocale`
   * parameter.
   * - [Str](Str) => `xsd::string`
   * - [Uri](Uri) => `xsd::anyURI`
   * - [Num](Num) => `xsd::integer` | `xsd::decimal` | `xsd::double`
   * - [Bool](Bool) => `xsd::boolean`
   * - [Date](Date) => `xsd::date`
   * - [Time](Time) => `xsd::time`
   * - [DateTime](DateTime) => `xsd::dateTime`
   * - [Buf](Buf) => `xsd::hexBinary`
   * 
   * A non-null `typeOrLocale` parameter is used as follows:
   * - An {@link Iri | Iri} indicates the data type of the `object`
   *   parameter. In this case the `object` will **always** be encoded as
   *   a string.
   * - A [Locale](Locale) indicates the language the `object` is in.
   *   In this case the `object` *should* be a string.
   * 
   * Not all export formats can make use of the information in `typeOrLocale`
   * parameter, but you should always provide it if available.
   * 
   * Return this.
   */
  writeStmt(subject: Iri, predicate: Iri, object: sys.JsObj, typeOrLocale?: sys.JsObj | null): this;
}

/**
 * Models an RDF statment.
 */
export class Stmt extends sys.Obj {
  static type$: sys.Type
  /**
   * The predicate of the statement
   */
  pred(): Iri;
  /**
   * The object of the statement
   */
  obj(): sys.JsObj;
  /**
   * The subject of the statement
   */
  subj(): Iri;
  hash(): number;
  toStr(): string;
  compare(obj: sys.JsObj): number;
  /**
   * Get a new statement where all IRIs are prefixed based on the
   * given `prefixMap`
   */
  prefix(prefixMap: sys.Map<string, string>): Stmt;
  /**
   * Get a new statement where all IRIs that have a prefix in the
   * `prefixMap` are fully expanded.
   */
  normalize(prefixMap: sys.Map<string, string>): Stmt;
  equals(obj: sys.JsObj | null): boolean;
  static make(subject: Iri, predicate: Iri, object: sys.JsObj, ...args: unknown[]): Stmt;
}

/**
 * Writes RDF in [Turtle](https://www.w3.org/TR/turtle/) format
 */
export class TurtleOutStream extends RdfOutStream {
  static type$: sys.Type
  /**
   * Return true if the given string is a legal label name for a
   * blank node.
   * 
   * The characters in the label are built upon PN_CHARS_BASE,
   * liberalized as follows
   * - The characters `_` and digits may appear anywhere in a blank
   *   node label.
   * - The character `.` may appear anywhere except the first or last
   *   character.
   * - The characters `-`, U+00B7, U+0300 to U+036F and U+203F to
   *   U+2040 are permitted anywhere except the first character.
   * ```
   * PN_CHARS_BASE ::= [A-Z] | [a-z] | [#x00C0-#x00D6] | [#x00D8-#x00F6]
   * | [#x00F8-#x02FF] | [#x0370-#x037D] | [#x037F-#x1FFF] | [#x200C-#x200D]
   * | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF]
   * | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
   * 
   * ```
   * 
   * See [https://www.w3.org/TR/turtle/#BNodes](https://www.w3.org/TR/turtle/#BNodes)
   */
  static isLabelName(name: string): boolean;
  finish(): this;
  /**
   * Validate the blank node and return it if it is valid;
   * otherwise raise [ArgErr](ArgErr).
   */
  static validateBlankNode(iri: Iri): Iri;
  static make(out: sys.OutStream, ...args: unknown[]): TurtleOutStream;
  writeStmt(subject: Iri, predicate: Iri, object: sys.JsObj, typeOrLocale?: sys.JsObj | null): this;
}

/**
 * Writes RDF in [JSON-LD](https://w3c.github.io/json-ld-syntax/)
 * format
 */
export class JsonLdOutStream extends RdfOutStream {
  static type$: sys.Type
  finish(): this;
  static make(out: sys.OutStream, ...args: unknown[]): JsonLdOutStream;
  writeStmt(subject: Iri, predicate: Iri, object: sys.JsObj, typeOrLocale?: sys.JsObj | null): this;
}

export class TurtleOutStreamTest extends sys.Test {
  static type$: sys.Type
  b(): sys.Buf;
  b(it: sys.Buf): void;
  testPrefixedStmt(): void;
  testExpandedStmt(): void;
  testSameSubjWithDifferentPreds(): void;
  testSameSubjPredWithDifferentObjects(): void;
  static make(...args: unknown[]): TurtleOutStreamTest;
  testCustomDataType(): void;
  testBlankNodes(): void;
  testDifferentSubjects(): void;
  testPrefixCaseSensitivity(): void;
  testPrefixes(): void;
  writer(buf?: sys.Buf): TurtleOutStream;
}

export class JsonLdOutStreamTest extends sys.Test {
  static type$: sys.Type
  b(): sys.Buf;
  b(it: sys.Buf): void;
  testPrefixedStmt(): void;
  out(buf?: sys.Buf): JsonLdOutStream;
  testSameSubjWithDifferentPreds(): void;
  testSameSubjPredWithDifferentObjects(): void;
  static make(...args: unknown[]): JsonLdOutStreamTest;
  testCustomDataType(): void;
  testBlankNodes(): void;
  testDifferentSubjects(): void;
  testPrefixCaseSensitivity(): void;
  testPrefixes(): void;
}

