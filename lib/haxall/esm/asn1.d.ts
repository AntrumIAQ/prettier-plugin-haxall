import * as sys from './sys.js';
import * as math from './math.js';

export class BerReaderTest extends BerTest {
  static type$: sys.Type
  testReadInteger(): void;
  testReadSequenceType(): void;
  testReadOctetString(): void;
  testReadGenTime(): void;
  testReadOid(): void;
  testReadBooleanType(): void;
  testReadBitString(): void;
  testReadBitStringType(): void;
  testReadUtcTimeType(): void;
  testReadIntegerType(): void;
  testReadBoolean(): void;
  testReadUtcTime(): void;
  testReadOctetStringType(): void;
  testReadLen(): void;
  testReadNullType(): void;
  static make(...args: unknown[]): BerReaderTest;
  testStrings(): void;
  testReadOidType(): void;
  testReadGenTimeType(): void;
}

/**
 * Base class for ASN.1 collection types.
 */
export class AsnColl extends AsnObj {
  static type$: sys.Type
  /**
   * Get the raw {@link AsnObj | AsnObj} values in the collection
   */
  vals(): sys.List<AsnObj>;
  /**
   * Get an item value from the collection.
   * - If key is a {@link sys.Str | sys::Str} then get the named
   *   item.
   * - If key is an {@link sys.Int | sys::Int}, then get the item at
   *   that zero-based index.
   */
  get(key: sys.JsObj): AsnObj | null;
  /**
   * Get a {@link AsnCollBuilder | collection builder}
   */
  static builder(): AsnCollBuilder;
  /**
   * Is this a `SET`
   */
  isSet(): boolean;
  /**
   * Is this a `SEQUENCE`
   */
  isSeq(): boolean;
  /**
   * Is the collection empty
   */
  isEmpty(): boolean;
  /**
   * Get the number of items in the collection
   */
  size(): number;
}

/**
 * A tagged ASN.1 value
 */
export class AsnObj extends sys.Obj {
  static type$: sys.Type
  /**
   * The value for this object.
   */
  val(): sys.JsObj | null;
  /**
   * The tags for this object.
   */
  tags(): sys.List<AsnTag>;
  /**
   * Get this object as an {@link AsnColl | AsnColl}
   */
  coll(): AsnColl;
  /**
   * Get the value as a {@link sys.Bool | sys::Bool}
   */
  bool(): boolean;
  /**
   * Get this object as an {@link AsnOid | AsnOid}
   */
  oid(): AsnOid;
  /**
   * Is this object's universal tag a `Boolean`
   */
  isBool(): boolean;
  /**
   * Is this object's universal tag an `Integer`
   */
  isInt(): boolean;
  /**
   * Get the univ tag for this object
   */
  univTag(): AsnTag;
  /**
   * Get the single effective tag for this object. Throws an
   * error if there are multiple effective tags
   */
  tag(): AsnTag;
  /**
   * Get this object as an {@link AsnSeq | AsnSeq}
   */
  seq(): AsnSeq;
  toStr(): string;
  /**
   * Get the value as an {@link sys.Int | sys::Int}. If the value
   * is a {@link math.BigInt | math::BigInt} you may lose both
   * precision and sign. Use {@link bigInt | bigInt} to get the
   * value explicitly as a {@link math.BigInt | math::BigInt}.
   */
  int(): number;
  /**
   * Push a tag to the front of the tag chain for this value.
   * Returns a new instance of this object with the current
   * value.
   * ```
   * AsnObj.int(123).tag(AsnTag.implicit(TagClass.context, 0))
   *   => [0] IMPLICIT [UNIVERSAL 2]
   * AsnObj.int(123).tag(AsnTag.explicit(TagClass.app, 1))
   *   => [APPLICATION 1] EXPLICIT [UNIVERSAL 2]
   * ```
   */
  push(tag: AsnTag): AsnObj;
  /**
   * Get the value as a {@link sys.Str | sys::Str}
   */
  str(): string;
  /**
   * Get any of the  binary values as a {@link sys.Buf | sys::Buf}.
   * The Buf will be a safe copy that can be modified. Throws {@link AsnErr | AsnErr}
   * if the value is not a binary value.
   */
  buf(): sys.Buf;
  /**
   * Apply rules for `EXPLICIT` and `IMPLICIT` tags to obtain the set
   * of effective tags for encoding this object.
   */
  effectiveTags(): sys.List<AsnTag>;
  /**
   * Is this an ASN.1 `Null` value
   */
  isNull(): boolean;
  equals(obj: sys.JsObj | null): boolean;
  /**
   * Is this object's universal tag an `Octet String`
   */
  isOcts(): boolean;
  /**
   * Get the value as a {@link math.BigInt | math::BigInt}.
   */
  bigInt(): math.BigInt;
  /**
   * Is this object's universal tag an `Object Identifier`
   */
  isOid(): boolean;
  /**
   * Is this a primitive type?
   */
  isPrimitive(): boolean;
  hash(): number;
  /**
   * Get the value as a {@link sys.DateTime | sys::DateTime}
   * timestamp
   */
  ts(): sys.DateTime;
}

/**
 * Models an ASN.1 `SEQUENCE`
 */
export class AsnSeq extends AsnColl {
  static type$: sys.Type
}

/**
 * Models an ASN.1 `SET`
 */
export class AsnSet extends AsnColl {
  static type$: sys.Type
}

/**
 * A general ASN.1 error
 */
export class AsnErr extends sys.Err {
  static type$: sys.Type
  static make(msg?: string, cause?: sys.Err | null, ...args: unknown[]): AsnErr;
}

/**
 * {@link AsnColl | AsnColl} builder.
 */
export class AsnCollBuilder extends sys.Obj {
  static type$: sys.Type
  /**
   * Convenience to add an {@link AsnItem | AsnItem} with the
   * given value and name
   */
  add(val: AsnObj, name?: string | null): this;
  /**
   * Add an {@link AsnItem | AsnItem} to the collection
   */
  item(item: AsnItem): this;
  /**
   * Build an ASN.1 set
   */
  toSet(tag?: AsnTag | null): AsnColl;
  /**
   * Build an ASN.1 sequence
   */
  toSeq(tag?: AsnTag | null): AsnColl;
  static make(...args: unknown[]): AsnCollBuilder;
}

/**
 * BerWriter encodes ASN.1 objects using the Basic Encoding
 * Rules.
 */
export class BerWriter extends sys.Obj {
  static type$: sys.Type
  static make(out: sys.OutStream, ...args: unknown[]): BerWriter;
  close(): boolean;
  write(obj: AsnObj): this;
  static toBuf(obj: AsnObj, buf?: sys.Buf): sys.Buf;
}

/**
 * BerReader decodes ASN.1 objects using the Basic Encoding
 * Rules
 */
export class BerReader extends sys.Obj {
  static type$: sys.Type
  static make(in$: sys.InStream, ...args: unknown[]): BerReader;
  close(): boolean;
  readObj(spec?: AsnObj | null): AsnObj;
}

/**
 * Models an ASN.1 `OBJECT IDENTIFIER` type.
 */
export class AsnOid extends AsnObj {
  static type$: sys.Type
  /**
   * Oid is ordered by comparing its sub-identifier parts
   * numerically.
   */
  compare(that: sys.JsObj): number;
  /**
   * Get a new Oid based on the specified range. This Oid is
   * guaranteed to be in the universal tag class (i.e. - the tag
   * is not preservered).
   * 
   * Throw IndexErr if the range is illegal.
   */
  getRange(range: sys.Range): AsnOid;
  /**
   * Convenience to get a Str where the sub-identifiers are
   * joined with a `.`
   * ```
   * Asn.oid("1.2.3").oidStr == "1.2.3"
   * ```
   */
  oidStr(): string;
  valStr(): string;
  /**
   * Convenience to get the value as a list of its `Int`
   * identifiers.
   */
  ids(): sys.List<number>;
}

/**
 * The tag class for an {@link AsnTag | AsnTag}
 */
export class AsnTagClass extends sys.Enum {
  static type$: sys.Type
  /**
   * List of AsnTagClass values indexed by ordinal
   */
  static vals(): sys.List<AsnTagClass>;
  static context(): AsnTagClass;
  static priv(): AsnTagClass;
  mask(): number;
  static app(): AsnTagClass;
  static univ(): AsnTagClass;
  /**
   * Is this the `CONTEXT` class
   */
  isContext(): boolean;
  /**
   * Is this  the `PRIVATE` class
   */
  isPriv(): boolean;
  /**
   * Is this the `APPLICATION` class
   */
  isApp(): boolean;
  /**
   * Return the AsnTagClass instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): AsnTagClass;
  /**
   * Is this the `UNIVERSAL` class
   */
  isUniv(): boolean;
}

export class AsnObjTest extends sys.Test {
  static type$: sys.Type
  testUtcTime(): void;
  testGenTime(): void;
  testBoolean(): void;
  testInteger(): void;
  testBitString(): void;
  testNull(): void;
  testOidCompare(): void;
  static make(...args: unknown[]): AsnObjTest;
  testOidGetRange(): void;
  testVisibleStr(): void;
  testIA5Str(): void;
  testOctetString(): void;
  testOid(): void;
  testPrintableStr(): void;
  testUtf8Str(): void;
  testSequence(): void;
}

/**
 * Utility to build an {@link AsnObj | AsnObj}
 */
export class AsnObjBuilder extends sys.Obj {
  static type$: sys.Type
  /**
   * Build an ASN.1 `Boolean` value
   */
  bool(val: boolean): AsnObj;
  /**
   * Build an ASN.1 `Utf8String` value.
   */
  utf8(val: string): AsnObj;
  /**
   * Build an ASN.1 `Object Identifier` value (OID). The `val` may
   * be:
   * 1. an `Int[]` where each element of the list is a part of the
   *   oid.
   * 2. a `Str` where each part of the oid is separated by `.`.
   * ```
   * Asn.oid([1,2,3])
   * Asn.oid("1.2.3")
   * ```
   */
  oid(val: sys.JsObj): AsnOid;
  /**
   * Build an ASN.1 `GeneralizedTime` value.
   */
  genTime(ts: sys.DateTime): AsnObj;
  /**
   * Build an ASN.1 `Null` value
   */
  asnNull(): AsnObj;
  /**
   * Build an ASN.1 `Octet String` value. The `val` may be:
   * - a `Str` - it will be converted to a Buf as `((Str)val).toBuf`
   * - a `Buf` containing the raw octets
   */
  octets(val: sys.JsObj): AsnObj;
  /**
   * Add a tag to the object builder. Tags should be added in
   * ther order they are specified in an ASN.1 type declaration.
   * If the `tag` is `null`, then this is a no-op.
   * 
   * Whenever a concrete {@link AsnObj | AsnObj} is built, the
   * builder will clear all tags.
   * ```
   * // [0] [1 APPLICATION] Boolean
   * obj := AsnObjBuilder()
   *    .tag(AsnTag.context(0).implicit)
   *    .tag(AsnTag.app(1).implicit)
   *    .bool(true)
   * ```
   */
  tag(tag: AsnTag | null): this;
  static make(...args: unknown[]): AsnObjBuilder;
  /**
   * Build an ASN.1 `SEQUENCE` value The `items` parameter may be:
   * - An `AsnItem[]` of raw items to add to the collection
   * - An `AsnObj[]`
   * - A `Str:AsnObj` - if the order of the sequence is important,
   *   you should ensure the map is ordered.
   */
  seq(items: sys.JsObj): AsnSeq;
  /**
   * Create an ASN.1 `SET` value The `items` parameter may be any of
   * the values accepted by {@link seq | seq}.
   */
  set(items: sys.JsObj): AsnSet;
  /**
   * Build an ASN.1 `UTCTime` value
   */
  utc(ts: sys.DateTime): AsnObj;
  /**
   * Build an ASN.1 `Bit String` value. The bits in the bit string
   * are numbered from left to right. For example, bits `0-7` are
   * in the first byte of the bits buffer.
   */
  bits(bits: sys.Buf): AsnObj;
  /**
   * Build an ASN.1 `Integer` value. The `val` may be either an {@link sys.Int | sys::Int}
   * or a {@link math.BigInt | math::BigInt}, but is always
   * normalized to {@link math.BigInt | math::BigInt}.
   */
  int(val: sys.JsObj): AsnObj;
  /**
   * Build one of the ASN.1 string types. The `univ` parameter must
   * be one of:
   * - {@link AsnTag.univUtf8 | AsnTag.univUtf8}
   * - {@link AsnTag.univPrintStr | AsnTag.univPrintStr}
   * - {@link AsnTag.univIa5Str | AsnTag.univIa5Str}
   * - {@link AsnTag.univVisStr | AsnTag.univVisStr}
   * 
   * See {@link utf8 | utf8} to easily create UTF-8 strings.
   */
  str(val: string, univ: AsnTag): AsnObj;
  /**
   * Build an ASN.1 `Enumerated` value.
   */
  asnEnum(val: number): AsnObj;
}

export class AsnTagTest extends sys.Test {
  static type$: sys.Type
  testEquality(): void;
  static make(...args: unknown[]): AsnTagTest;
  /**
   * Page 244 (12.1.4) Dubuisson - ASN.1 Communication between
   * Heterogeneous Systems
   */
  testEffectiveTags(): void;
}

/**
 * Asn provides utilities for creating {@link AsnObj | AsnObj}.
 */
export class Asn extends sys.Obj {
  static type$: sys.Type
  /**
   * Singleton for universal `Null`
   */
  static Null(): AsnObj;
  /**
   * Convenience to create a universal `Boolean`
   */
  static bool(val: boolean): AsnObj;
  /**
   * Convenience to create a universal `Utf8String`
   */
  static utf8(val: string): AsnObj;
  /**
   * Create an ASN.1 `Object Identifier` value (OID).
   * 
   * See {@link AsnObjBuilder.oid | AsnObjBuilder.oid}
   */
  static oid(val: sys.JsObj): AsnOid;
  /**
   * Convenience to create a universal GeneralizedTime
   */
  static genTime(ts: sys.DateTime): AsnObj;
  /**
   * Convenience to create a universal `Octet String`
   * 
   * See {@link AsnObjBuilder.octets | AsnObjBuilder.octets}
   */
  static octets(val: sys.JsObj): AsnObj;
  /**
   * Create an {@link AsnObjBuilder | object builder} and add the
   * given tag if it is not null.
   */
  static tag(tag: AsnTag | null): AsnObjBuilder;
  static make(...args: unknown[]): Asn;
  /**
   * Convenience to create a universal `SEQUENCE`
   * 
   * See {@link AsnObjBuilder.seq | AsnObjBuilder.seq}
   */
  static seq(items: sys.JsObj): AsnSeq;
  /**
   * Convenience to create a universal `SET`
   * 
   * The `items` parameter may be any of the values accepted by {@link seq | seq}.
   */
  static set(items: sys.JsObj): AsnSet;
  /**
   * Convenience to create a universal `UTCTime`
   */
  static utc(ts: sys.DateTime): AsnObj;
  /**
   * Convenience to create a universal `Bit String`
   * 
   * See {@link AsnObjBuilder.bits | AsnObjBuilder.bits}
   */
  static bits(bits: sys.Buf): AsnObj;
  /**
   * Convenience to create a universal `Integer`.
   * 
   * See {@link AsnObjBuilder.int | AsnObjBuilder.int}
   */
  static int(val: sys.JsObj): AsnObj;
  /**
   * Convenience to create one of the ASN.1 string types.
   * 
   * See {@link AsnObjBuilder.str | AsnObjBuilder.str}
   * 
   * See {@link utf8 | utf8} to easily create UTF-8 strings.
   */
  static str(val: string, univ: AsnTag): AsnObj;
  /**
   * Convenience to create a universal `Enumerated` value
   */
  static asnEnum(val: number): AsnObj;
}

/**
 * The tag mode for a {@link AsnTag | AsnTag}
 */
export class AsnTagMode extends sys.Enum {
  static type$: sys.Type
  static implicit(): AsnTagMode;
  /**
   * List of AsnTagMode values indexed by ordinal
   */
  static vals(): sys.List<AsnTagMode>;
  static explicit(): AsnTagMode;
  /**
   * Return the AsnTagMode instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): AsnTagMode;
}

/**
 * ASN.1 Tag
 */
export class AsnTag extends sys.Obj {
  static type$: sys.Type
  static univEnum(): AsnTag;
  static univUtcTime(): AsnTag;
  static univOid(): AsnTag;
  static univNull(): AsnTag;
  static univGenTime(): AsnTag;
  static univBits(): AsnTag;
  static univIa5Str(): AsnTag;
  /**
   * The {@link AsnTagMode | tag mode}
   */
  mode(): AsnTagMode;
  static univSet(): AsnTag;
  static univOcts(): AsnTag;
  static univGraphStr(): AsnTag;
  static univSeq(): AsnTag;
  /**
   * The tag id
   */
  id(): number;
  static univPrintStr(): AsnTag;
  static univInt(): AsnTag;
  static univVisStr(): AsnTag;
  /**
   * The {@link AsnTagClass | tag class}
   */
  cls(): AsnTagClass;
  static univReal(): AsnTag;
  static univBool(): AsnTag;
  static univUtf8(): AsnTag;
  /**
   * Get a {@link AsnTagBuilder | builder} for a context tag with
   * the given id
   */
  static context(id: number): AsnTagBuilder;
  /**
   * Get a {@link AsnTagBuilder | builder} for a private tag with
   * the given id
   */
  static priv(id: number): AsnTagBuilder;
  static make(cls: AsnTagClass, id: number, mode: AsnTagMode, ...args: unknown[]): AsnTag;
  /**
   * Get a {@link AsnTagBuilder | builder} for an application tag
   * with the given id
   */
  static app(id: number): AsnTagBuilder;
  strictEquals(obj: sys.JsObj | null): boolean;
  toStr(): string;
  /**
   * Get a {@link AsnTagBuilder | builder} for a universal tag
   * with the given id.
   */
  static univ(id: number): AsnTagBuilder;
  /**
   * Tag equality is based only the {@link AsnTagClass | class}
   * and `id`. The {@link AsnTagMode | mode} is ignored for eqality
   * purposes.
   */
  equals(obj: sys.JsObj | null): boolean;
  hash(): number;
}

/**
 * An item in an ASN.1 collection. An item has a value, and an
 * optional name associated with that value. When comparing
 * items, only the values are compared; the name is ignored.
 */
export class AsnItem extends sys.Obj {
  static type$: sys.Type
  val(): AsnObj;
  name(): string | null;
  equals(obj: sys.JsObj | null): boolean;
  static make(val: AsnObj, name?: string | null, ...args: unknown[]): AsnItem;
  hash(): number;
}

/**
 * Utility to build an {@link AsnTag | AsnTag}.
 * 
 * See:
 * - {@link AsnTag.univ | AsnTag.univ}
 * - {@link AsnTag.context | AsnTag.context}
 * - {@link AsnTag.app | AsnTag.app}
 * - {@link AsnTag.priv | AsnTag.priv}
 */
export class AsnTagBuilder extends sys.Obj {
  static type$: sys.Type
  /**
   * Set the tag class to application
   */
  app(): this;
  /**
   * Build the tag with implicit mode
   */
  implicit(): AsnTag;
  /**
   * Set the tag class to universal
   */
  univ(): this;
  /**
   * Build the tag with explicit mode
   */
  explicit(): AsnTag;
  /**
   * Set the tag class to context
   */
  context(): this;
  /**
   * Set the tag class to private
   */
  priv(): this;
  /**
   * Set the tag identifier
   */
  id(id: number): this;
  /**
   * Create an unconfigured builder
   */
  static make(...args: unknown[]): AsnTagBuilder;
}

export class BerWriterTest extends BerTest {
  static type$: sys.Type
  testGenTime(): void;
  testNegativeLengthFails(): void;
  testBitStringEncoding(): void;
  testUnivUtcTimeTag(): void;
  testUnivOctetStringTag(): void;
  testOctetStringEncoding(): void;
  testUnivSequenceTag(): void;
  testUnivGenTimeTag(): void;
  testUnivBooleanTag(): void;
  testNullEncoding(): void;
  testUnivNullTag(): void;
  testSequenceEncoding(): void;
  testLength(): void;
  testUnivBitStringTag(): void;
  testUtcTime(): void;
  testOidEncoding(): void;
  testUnivIntegerTag(): void;
  static make(...args: unknown[]): BerWriterTest;
  testBooleanEncoding(): void;
  testStrings(): void;
  testUnivOidTag(): void;
  testIntegerEncoding(): void;
  testBadOids(): void;
  testUnivStringTags(): void;
}

