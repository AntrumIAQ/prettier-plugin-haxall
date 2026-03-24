import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as util from './util.js';
import * as inet from './inet.js';
import * as xeto from './xeto.js';
import * as web from './web.js';

/**
 * DownErr indicates a communications or networking problem
 */
export class DownErr extends sys.Err {
  static type$: sys.Type
  /**
   * Construct with message and optional cause
   */
  static make(msg: string, cause?: sys.Err | null, ...args: unknown[]): DownErr;
}

/**
 * Read Haystack data in [Zinc](https://fantom.org/doc/docHaystack/Zinc)
 * format.
 */
export class ZincReader extends sys.Obj implements GridReader {
  static type$: sys.Type
  /**
   * Read a value and auto close stream
   */
  readVal(close?: boolean): sys.JsObj | null;
  /**
   * Wrap input stream
   */
  static make(in$: sys.InStream, ...args: unknown[]): ZincReader;
  /**
   * Close the underlying stream.
   */
  close(): boolean;
  /**
   * Convenience for {@link readVal | readVal} as Grid
   */
  readGrid(): Grid;
}

/**
 * GridBuilder is used to build up an immutable {@link Grid | Grid}.
 * To use first define your cols via {@link addCol | addCol} and
 * then add the rows via {@link addRow | addRow}:
 * ```
 * gb := GridBuilder()
 * gb.addCol("a").addCol("b")
 * gb.addRow(["a-0", "b-0"])
 * gb.addRow(["a-1", "b-1"])
 * grid := gb.toGrid
 * ```
 */
export class GridBuilder extends sys.Obj {
  static type$: sys.Type
  /**
   * Number of rows added to the grid
   */
  numRows(): number;
  /**
   * Set the grid meta (overwrites any current meta) The meta
   * parameter can be any {@link Etc.makeDict | Etc.makeDict}
   * value.
   */
  setMeta(meta: sys.JsObj | null): this;
  /**
   * Add list of cells as a new row to the grid. The cell list
   * size must match the number of columns.
   */
  addRow(cells: sys.List<sys.JsObj | null>): this;
  /**
   * Construct to finalized grid
   */
  toGrid(): Grid;
  static make(...args: unknown[]): GridBuilder;
  /**
   * Add dict as a new row to the grid.  All the dict tags must
   * have been defined as columns.
   */
  addDictRow(row: Dict | null): this;
  /**
   * Add all the rows of given grid as rows to our grid
   */
  addGridRows(grid: Grid): this;
  /**
   * Add column to the grid. The meta parameter can be any {@link Etc.makeDict | Etc.makeDict}
   * value.
   */
  addCol(name: string, meta?: sys.JsObj | null): this;
  /**
   * Number of columns added to the grid
   */
  numCols(): number;
  /**
   * Add list of column names to the grid.
   */
  addColNames(names: sys.List<string>): this;
  /**
   * Convience for adding a list of {@link addDictRow | addDictRow}.
   */
  addDictRows(rows: sys.List<Dict | null>): this;
}

/**
 * Ref is used to model a record identifier and optional
 * display string.
 */
export class Ref extends xeto.Ref {
  static type$: sys.Type
  /**
   * Null ref is "@null"
   */
  static nullRef(): Ref;
  /**
   * Default is {@link nullRef | nullRef}
   */
  static defVal(): Ref;
  /**
   * Return display value of target if available, otherwise {@link id | id}
   */
  dis(): string;
  /**
   * Identifier which does **not** include the leading `@`
   */
  id(): string;
  /**
   * String format is {@link id | id} which does **not** include the
   * leading `@`.  Use {@link toCode | toCode} to include leading `@`.
   */
  toStr(): string;
  /**
   * Is the given character a valid id char:
   * - `A` - `Z`
   * - `a` - `z`
   * - `0` - `9`
   * - `_ : - . ~`
   */
  static isIdChar(char: number): boolean;
  /**
   * Return "@id"
   */
  toCode(): string;
  /**
   * Make with simple id
   */
  static fromStr(id: string, checked?: boolean, ...args: unknown[]): Ref;
  /**
   * Construct with Ref id string and optional display string.
   */
  static makeWithDis(ref: Ref, dis?: string | null, ...args: unknown[]): Ref;
  /**
   * Hash {@link id | id}
   */
  hash(): number;
  /**
   * Take an arbitrary string and convert into a safe Ref
   * identifier.
   */
  static toId(n: string): string;
  /**
   * Generate a unique Ref.
   */
  static gen(): Ref;
  /**
   * Return if the string is a valid Ref identifier.  See {@link isIdChar | isIdChar}
   */
  static isId(n: string): boolean;
  /**
   * Construct with id string and optional display string.
   */
  static make(id: string, dis: string | null, ...args: unknown[]): Ref;
  /**
   * Equality is based on {@link id | id} only (not dis).
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Null ref has id value of "null"?
   */
  isNull(): boolean;
}

/**
 * FaultErr indicates a software or configuration problem
 */
export class FaultErr extends sys.Err {
  static type$: sys.Type
  /**
   * Construct with message and optional cause
   */
  static make(msg: string, cause?: sys.Err | null, ...args: unknown[]): FaultErr;
}

/**
 * Marker is the singleton which indicates a marker tag with no
 * value.
 */
export class Marker extends sys.Obj {
  static type$: sys.Type
  /**
   * Singleton value
   */
  static val(): Marker;
  /**
   * Return "marker"
   */
  toStr(): string;
  /**
   * If true return Marker.val else null
   */
  static fromBool(b: boolean): Marker | null;
  /**
   * Always return {@link val | val}
   */
  static fromStr(s: string, ...args: unknown[]): Marker;
}

/**
 * Number represents a numeric value and an optional Unit.
 */
export class Number extends sys.Obj {
  static type$: sys.Type
  /**
   * Constant for 0 with no unit
   */
  static zero(): Number;
  /**
   * Constant for not-a-number
   */
  static nan(): Number;
  /**
   * Constant for 10 with no unit
   */
  static ten(): Number;
  /**
   * Constant for positive infinity
   */
  static posInf(): Number;
  /**
   * Default value is zero with no unit
   */
  static defVal(): Number;
  /**
   * Constant for -1 with no unit
   */
  static negOne(): Number;
  /**
   * Constant for negative infinity
   */
  static negInf(): Number;
  /**
   * Constant for 1 with no unit
   */
  static one(): Number;
  /**
   * Construct from scalar integer and optional unit.
   */
  static makeInt(val: number, unit?: sys.Unit | null, ...args: unknown[]): Number;
  /**
   * Multiple this and b.  Shortcut is a*b. The resulting unit is
   * derived from the product of this and b. Throw {@link UnitErr | UnitErr}
   * if a*b does not match a unit in the unit database.
   */
  mult(b: Number): Number;
  /**
   * Return remainder of this divided by b.  Shortcut is a%b. The
   * unit of b must be null.
   */
  mod(b: Number): Number;
  /**
   * Get the ASCII upper case version of this number as a Unicode
   * point.
   */
  upper(): Number;
  /**
   * Is the floating value NaN.
   */
  isNaN(): boolean;
  /**
   * Divide this by b.  Shortcut is a/b. The resulting unit is
   * derived from the quotient of this and b. Throw {@link UnitErr | UnitErr}
   * if a/b does not match a unit in the unit database.
   */
  div(b: Number): Number;
  /**
   * Return if this number if pos/neg infinity or NaN
   */
  isSpecial(): boolean;
  /**
   * Construct from scalar Int, Float, or Decimal and optional
   * unit.
   */
  static makeNum(val: number, unit?: sys.Unit | null): Number;
  /**
   * Is this number a whole integer without a fractional part
   */
  isInt(): boolean;
  /**
   * Clamp this number between the min and max.  If its less than
   * min then return min, if its greater than max return max,
   * otherwise return this number itself.  The min and max must
   * have matching units or be unitless. The result is always in
   * the same unit as this instance.
   */
  clamp(min: Number, max: Number): Number;
  /**
   * String representation
   */
  toStr(): string;
  /**
   * Does this number have a time unit which can be converted to
   * a Fantom Duration instance.
   */
  isDuration(): boolean;
  /**
   * Trio/zinc code representation, same as {@link toStr | toStr}
   */
  toCode(): string;
  /**
   * Get the ASCII lower case version of this number as a Unicode
   * point.
   */
  lower(): Number;
  /**
   * Add this with b.  Shortcut is a+b. Throw {@link UnitErr | UnitErr}
   * is this and b have incompatible units.
   */
  plus(b: Number): Number;
  /**
   * Get unit associated with this number or null.
   */
  unit(): sys.Unit | null;
  /**
   * Parse from a string according to zinc syntax
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Number;
  /**
   * Construct from a duration, standardize unit is hours If unit
   * is null, then a best attempt is made based on magnitude.
   */
  static makeDuration(dur: sys.Duration, unit?: sys.Unit | null, ...args: unknown[]): Number;
  /**
   * Get this number as a Fantom Duration instance
   */
  toDuration(checked?: boolean): sys.Duration | null;
  /**
   * Hash is based on val
   */
  hash(): number;
  /**
   * Subtract b from this.  Shortcut is a-b. The b.unit must
   * match this.unit.
   */
  minus(b: Number): Number;
  /**
   * Compare is based on val. Throw {@link UnitErr | UnitErr} is
   * this and b have incompatible units.
   */
  compare(that: sys.JsObj): number;
  /**
   * Increment this number.  Shortcut is ++a.
   */
  increment(): Number;
  /**
   * Return min value.  Units are **not** checked for this
   * comparison.
   */
  min(that: Number): Number;
  /**
   * Construct from scalar value and optional unit.
   */
  static make(val: number, unit?: sys.Unit | null, ...args: unknown[]): Number;
  /**
   * Is this a negative number
   */
  isNegative(): boolean;
  /**
   * Get the scalar value as an Int
   */
  toInt(): number;
  /**
   * Format the number using given pattern which is an superset
   * of {@link sys.Float.toLocale | sys::Float.toLocale}:
   * ```
   * #        optional digit
   * 0        required digit
   * .        decimal point
   * ,        grouping separator (only last one before decimal matters)
   * U        position of unit (default to suffix)
   * pos;neg  separate negative format (must specify U position)
   * ```
   * 
   * When using the `pos;neg` pattern, the "U" position must be
   * specified in both pos and neg patterns, otherwise the unit
   * is omitted. Note that the negative pattern always uses
   * mimics the positive pattern for the actual digit formatting
   * (#, 0, decimal, and grouping).
   * 
   * The special "B" pattern is used to format bytes; see {@link sys.Int.toLocale | sys::Int.toLocale}.
   * 
   * If pattern is null, the following rules are used:
   * 1. If {@link isDuration | isDuration} true, then return best fit
   *   unit is selected
   * 2. If unit is non-null attempt to lookup a unit specific
   *   default pattern with the locale key
   *   "haystack::number.{unit.name}".
   * 3. If {@link isInt | isInt} true, then return {@link sys.Int.toLocale | sys::Int.toLocale}
   *   using sys locale default
   * 4. Return {@link sys.Float.toLocale | sys::Float.toLocale} using
   *   sys locale default
   * 
   * Examples:
   * ```
   * Number   Pattern        Result    Notes
   * ------   -------        -------   ------
   * 12.34    "#.####"       12.34     Optional fractional digits
   * 12.34    "#.0000"       12.3400   Required fractional digits
   * 12.34$   null           $12.34    Haystack locale default
   * 12$      "U 0.00"       $ 12.00   Explicit unit placement
   * -12$     "U0.##;(U#)"   ($12)     Alternative negative format
   * 45%      "+0.0U;-0.0U"  +45%      Use leading positive sign
   * ```
   */
  toLocale(pattern?: string | null): string;
  /**
   * Return max value.  Units are **not** checked for this
   * comparison.
   */
  max(that: Number): Number;
  /**
   * Get the scalar value as an Float
   */
  toFloat(): number;
  /**
   * Return absolute value of this number.
   */
  abs(): Number;
  /**
   * Negate this number.  Shortcut is -a.
   */
  negate(): Number;
  /**
   * Decrement this number.  Shortcut is --a.
   */
  decrement(): Number;
  /**
   * Equality is based on val and unit.  NaN is equal to itself
   * (like Float.compare, but unlike Float.equals)
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Return if this number is approximately equal to that - see {@link sys.Float.approx | sys::Float.approx}
   */
  approx(that: Number, tolerance?: number | null): boolean;
}

/**
 * Read Haystack data in [JSON](https://fantom.org/doc/docHaystack/Json)
 * format.
 */
export class JsonReader extends sys.Obj implements GridReader {
  static type$: sys.Type
  opts(): Dict;
  opts(it: Dict): void;
  /**
   * Read a value and auto close stream
   */
  readVal(close?: boolean): sys.JsObj | null;
  /**
   * Convenience for {@link readVal | readVal} as Grid
   */
  readGrid(): Grid;
  /**
   * Wrap input stream. By default, the reader decodes JSON in
   * the Haystack 4 (Hayson) format. Use the `v3` option to decode
   * JSON in the Haystack 3 format.
   * 
   * The following opts are supported:
   * - `v3` (Marker): read JSON encoded in the Haystack 3 format
   * ```
   * g := JsonReader(in).readGrid
   * 
   * val := JsonReader(in, Etc.makeDict(["v3":Marker.val])).readVal
   * ```
   */
  static make(in$: sys.InStream, opts?: Dict | null, ...args: unknown[]): JsonReader;
}

/**
 * Write Haystack data in [CSV](https://fantom.org/doc/docHaystack/Csv)
 * format.
 */
export class CsvWriter extends sys.Obj implements GridWriter {
  static type$: sys.Type
  /**
   * Strip units from all numbers
   */
  stripUnits(): boolean;
  stripUnits(it: boolean): void;
  /**
   * Newline string; defaults to "\n"
   */
  newline(): string;
  newline(it: string): void;
  /**
   * Delimiter character; defaults to comma.
   */
  delimiter(): number;
  delimiter(it: number): void;
  /**
   * Include the column names as a header row
   */
  showHeader(): boolean;
  showHeader(it: boolean): void;
  /**
   * Flush the underlying output stream and return this
   */
  flush(): this;
  /**
   * Wrap output stream
   */
  static make(out: sys.OutStream, opts?: Dict | null, ...args: unknown[]): CsvWriter;
  /**
   * Close the underlying output stream
   */
  close(): boolean;
  /**
   * Write grid as CSV and return this
   */
  writeGrid(grid: Grid): this;
}

/**
 * Bin is a tag value for a binary file stored on disk rather
 * than in the in-memory record database.  The Bin instance
 * itself stores the MIME type.
 */
export class Bin extends sys.Obj {
  static type$: sys.Type
  /**
   * MimeType of the bin file.
   */
  mime(): sys.MimeType;
  /**
   * Bin for "text/plain; charset=utf-8".
   */
  static defVal(): Bin;
  toStr(): string;
  equals(that: sys.JsObj | null): boolean;
  /**
   * Construct with mime type string.
   */
  static make(mime: string, ...args: unknown[]): Bin;
  hash(): number;
}

/**
 * HaystackContext defines an environment of defs and data
 */
export abstract class HaystackContext extends sys.Obj implements xeto.XetoContext {
  static type$: sys.Type
}

/**
 * Remove is the singleton which indicates a remove operation.
 */
export class Remove extends sys.Obj {
  static type$: sys.Type
  /**
   * Singleton value
   */
  static val(): Remove;
  /**
   * Return "remove"
   */
  toStr(): string;
}

/**
 * Geographic coordinate as latitude and longitute in decimal
 * degrees.
 */
export class Coord extends sys.Obj {
  static type$: sys.Type
  /**
   * Default value is "C(0.0,0.0)"
   */
  static defVal(): Coord;
  /**
   * Compute great-circle distance two coordinates using
   * haversine forumula.
   */
  dist(c2: Coord): number;
  /**
   * Construct from floating point decimal degrees
   */
  static make(lat: number, lng: number, ...args: unknown[]): Coord;
  /**
   * Latitude in decimal degrees
   */
  lat(): number;
  /**
   * Represented as  "C(lat,lng)"
   */
  toStr(): string;
  /**
   * Longtitude in decimal degrees
   */
  lng(): number;
  /**
   * Decode from string formatted as "C(lat,lng)"
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Coord;
  /**
   * Equality is based on lat/lng
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Hash is based on lat/lng
   */
  hash(): number;
}

/**
 * DisabledErr indicates access of a disabled resource.
 */
export class DisabledErr extends sys.Err {
  static type$: sys.Type
  static make(msg: string | null, cause?: sys.Err | null, ...args: unknown[]): DisabledErr;
}

/**
 * Read Haystack data in [Trio](https://fantom.org/doc/docHaystack/Trio)
 * format.
 */
export class TrioReader extends sys.Obj implements GridReader {
  static type$: sys.Type
  /**
   * Iterate through the entire stream reading dicts. The stream
   * is guaranteed to be closed when done.
   */
  eachDict(f: ((arg0: Dict) => void)): void;
  /**
   * Wrap input stream
   */
  static make(in$: sys.InStream, ...args: unknown[]): TrioReader;
  /**
   * Read next dict from the stream.  If end of stream is
   * detected then reutrn null or raise exception based on
   * checked flag.
   */
  readDict(checked?: boolean): Dict | null;
  /**
   * Return recs as simple grid (no grid or column level meta)
   */
  readGrid(): Grid;
  /**
   * Read all dicts from the stream and close it.
   */
  readAllDicts(): sys.List<Dict>;
}

/**
 * Column of a Grid
 */
export class Col extends sys.Obj {
  static type$: sys.Type
  /**
   * String representation is name
   */
  toStr(): string;
  /**
   * Compare based on name
   */
  compare(x: sys.JsObj): number;
  /**
   * Display name for columm which is `meta.dis(null, name)`
   */
  dis(): string;
  /**
   * Meta-data for column
   */
  meta(): Dict;
  /**
   * Equality is based on reference
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Programatic name identifier for columm
   */
  name(): string;
  static make(...args: unknown[]): Col;
}

/**
 * Facet to annotate a {@link TypedDict | TypedDict} field.
 */
export class TypedTag extends sys.Obj implements sys.Facet, Define {
  static type$: sys.Type
  /**
   * Meta data for the def encoded as a Trio string
   */
  meta(): string;
  __meta(it: string): void;
  static make(f?: ((arg0: TypedTag) => void) | null, ...args: unknown[]): TypedTag;
}

/**
 * Etc is the utility methods for Haystack.
 */
export class Etc extends sys.Obj {
  static type$: sys.Type
  /**
   * Apply the given map function to each name/value pair to
   * construct a new Dict.  NOTE: use Dict.map now
   */
  static dictMap(d: Dict, f: ((arg0: sys.JsObj | null, arg1: string) => sys.JsObj | null)): Dict;
  /**
   * Remove a name/val pair from an exisiting dict, or if the
   * name isn't found then return original dict.
   */
  static dictRemove(d: Dict, name: string): Dict;
  /**
   * Convenience for {@link makeDictsGrid | makeDictsGrid}
   */
  static makeMapsGrid(meta: sys.JsObj | null, rows: sys.List<sys.Map<string, sys.JsObj | null>>): Grid;
  /**
   * Construct a grid for a list of rows, where each row is a
   * list of cells.  The meta and colMetas parameters can be any {@link makeDict | makeDict}
   * value.
   */
  static makeListsGrid(meta: sys.JsObj | null, colNames: sys.List<string>, colMetas: sys.List<sys.JsObj | null> | null, rows: sys.List<sys.List<sys.JsObj | null>>): Grid;
  /**
   * Make a Dict with four name/value pairs. Backward
   * compatibility only for nullable values, use {@link dict4 | dict4}
   * now.
   */
  static makeDict4(n0: string, v0: sys.JsObj | null, n1: string, v1: sys.JsObj | null, n2: string, v2: sys.JsObj | null, n3: string, v3: sys.JsObj | null): Dict;
  /**
   * Make a Dict with five name/value pairs. Backward
   * compatibility only for nullable values, use {@link dict5 | dict5}
   * now.
   */
  static makeDict5(n0: string, v0: sys.JsObj | null, n1: string, v1: sys.JsObj | null, n2: string, v2: sys.JsObj | null, n3: string, v3: sys.JsObj | null, n4: string, v4: sys.JsObj | null): Dict;
  /**
   * Set a name/val pair in an existing dict or d is null then
   * create a new dict with given name/val pair.
   */
  static dictSet(d: Dict | null, name: string, val: sys.JsObj | null): Dict;
  /**
   * Make a Dict with six name/value pairs. Backward
   * compatibility only for nullable values, use {@link dict6 | dict6}
   * now.
   */
  static makeDict6(n0: string, v0: sys.JsObj | null, n1: string, v1: sys.JsObj | null, n2: string, v2: sys.JsObj | null, n3: string, v3: sys.JsObj | null, n4: string, v4: sys.JsObj | null, n5: string, v5: sys.JsObj | null): Dict;
  /**
   * Coerce a value to one of the Haystack types.  Recursively
   * coerce dicts and lists.  This method does not support grids.
   * Options:
   * - checked: marker to throw err for non-haystack values; coerce
   *   otherwise
   */
  static toHaystack(val: sys.JsObj | null, opts?: Dict | null): sys.JsObj | null;
  /**
   * Given a list of dictionaries, find all the common names
   * used.  Return the names in standard sorted order.  Any null
   * dicts are skipped.
   */
  static dictsNames(dicts: sys.List<Dict | null>): sys.List<string>;
  /**
   * Construct a grid with one column for a list.  The meta and
   * colMeta parameters can be any {@link makeDict | makeDict}
   * value.
   */
  static makeListGrid(meta: sys.JsObj | null, colName: string, colMeta: sys.JsObj | null, rows: sys.List<sys.JsObj | null>): Grid;
  /**
   * Make a Dict with one name/value pair. Backward compatibility
   * only for nullable values, use {@link dict1 | dict1} now.
   */
  static makeDict1(n: string, v: sys.JsObj | null): Dict;
  /**
   * Make a Dict with two name/value pairs. Backward
   * compatibility only for nullable values, use {@link dict2 | dict2}
   * now.
   */
  static makeDict2(n0: string, v0: sys.JsObj | null, n1: string, v1: sys.JsObj | null): Dict;
  /**
   * Make a Dict with three name/value pairs. Backward
   * compatibility only for nullable values, use {@link dict3 | dict3}
   * now.
   */
  static makeDict3(n0: string, v0: sys.JsObj | null, n1: string, v1: sys.JsObj | null, n2: string, v2: sys.JsObj | null): Dict;
  /**
   * Return if the given string is a legal kind name:
   * - first char must be ASCII upper case letter: `a` - `z`
   * - rest of chars must be ASCII letter or digit: `a` - `z`, `A` - `Z`, `0`
   *   - `9`, or `_`
   */
  static isKindName(n: string): boolean;
  /**
   * Given a dict, attempt to find the best display string:
   * 1. `dis` tag
   * 2. `disMacro` tag returns {@link macro | macro} using dict as
   *   scope
   * 3. `disKey` maps to qname locale key
   * 4. `name` tag
   * 5. `tag` tag
   * 6. `id` tag
   * 7. default
   */
  static dictToDis(dict: Dict, def?: string | null): string | null;
  /**
   * Construct an object which wraps a dict and is suitable to
   * use for a hash key in a {@link sys.Map | sys::Map}.  The key
   * provides implementations of {@link sys.Obj.hash | sys::Obj.hash}
   * and {@link sys.Obj.equals | sys::Obj.equals} based on the the
   * name/value pairs in the dict.  Hash keys do not support
   * Dicts which contain anything but scalar values (nested
   * lists, dicts, and grids are silently ignored for
   * hash/equality purposes).
   */
  static dictHashKey(d: Dict): sys.JsObj;
  /**
   * Coerce an object to a DateSpan:
   * - `Func`: function which evaluates to date range (must be run in
   *   a context)
   * - `DateSpan`: return itself
   * - `Date`: one day range
   * - `Span`: return {@link Span.toDateSpan | haystack::Span.toDateSpan}
   * - `Str`: evaluates to {@link DateSpan.fromStr | haystack::DateSpan.fromStr}
   * - `Date..Date`: starting and ending date (inclusive)
   * - `Date..Number`: starting date and num of days (day unit
   *   required)
   * - `DateTime..DateTime`: use starting/ending dates; if end is
   *   midnight, then use previous date
   * - `Number`: convert as year
   */
  static toDateSpan(val: sys.JsObj | null, cx?: HaystackContext | null): DateSpan;
  /**
   * Convert a Dict to a read/write map.  This method is
   * expensive, when possible you should instead use {@link Dict.each | Dict.each}.
   */
  static dictToMap(d: Dict | null): sys.Map<string, sys.JsObj | null>;
  /**
   * Iterate a [discrete period](discretePeriods()) string
   * formatted in base64. Call the iterator function for each
   * period where `time` is offset in minutes from base timestamp
   * and `dur` is duration of period in minutes (assuming a
   * minutely interval).  This method may also be used [discreteEnumPeriods()](discreteEnumPeriods())
   * in which case the `dur` parameter will be the enum ordinal.
   */
  static discretePeriods(str: string, f: ((arg0: number, arg1: number) => void)): void;
  /**
   * Convenience for {@link makeDictGrid | makeDictGrid}
   */
  static makeMapGrid(meta: sys.JsObj | null, row: sys.Map<string, sys.JsObj | null>): Grid;
  /**
   * Rename given name if its defined in the dict, otherwise
   * return original.
   */
  static dictRename(d: Dict, oldName: string, newName: string): Dict;
  /**
   * Coerce an object to a {@link Span | Span} with optional
   * timezone:
   * - `Span`: return itself
   * - `Span+tz`: update timezone using same dates only if aligned to
   *   midnight
   * - `Str`: return {@link Span.fromStr | haystack::Span.fromStr}
   *   using current timezone
   * - `Str+tz`: return {@link Span.fromStr | haystack::Span.fromStr}
   *   using given timezone
   * - `DateTime..DateTime`: range of two DateTimes
   * - `Date..DateTime`: start day for date until the end timestamp
   * - `DateTime..Date`: start timestamp to end of day for end date
   * - `DateTime`: span of a single timestamp
   * - `DateSpan`: anything accepted by {@link toDateSpan | toDateSpan}
   *   in current timezone
   * - `DateSpan+tz`: anything accepted by {@link toDateSpan | toDateSpan}
   *   using given timezone
   */
  static toSpan(val: sys.JsObj | null, tz?: sys.TimeZone | null, cx?: HaystackContext | null): Span;
  /**
   * Coerce a value to a Grid:
   * - if grid just return it
   * - if row in grid of size, return row.grid
   * - if scalar return 1x1 grid
   * - if dict return grid where dict is only
   * - if list of dict return grid where each dict is row
   * - if list of non-dicts, return one col grid with rows for each
   *   item
   * - if non-zinc type return grid with cols val, type
   */
  static toGrid(val: sys.JsObj | null, meta?: Dict | null): Grid;
  /**
   * Flatten a list of grids into a single grid.  Each grid's
   * rows are appended to a single grid in the order passed.  The
   * resulting grid columns will be the intersection of all the
   * individual grid columns. Grid meta and column merged
   * together.
   */
  static gridFlatten(grids: sys.List<Grid>): Grid;
  /**
   * Return the list of variable tag names used in the given {@link macro | macro}
   * pattern.  This includes "$tag" and "${tag}" variables, but
   * does not include "$<pod::key>" localization keys.
   */
  static macroVars(pattern: string): sys.List<string>;
  /**
   * Add/set all the name/value pairs in a with those defined in
   * b.  If b defines a remove value then that name/value is
   * removed from a.  The b parameter may be any value accepted
   * by {@link makeDict | makeDict}
   */
  static dictMerge(a: Dict, b: sys.JsObj | null): Dict;
  /**
   * Get a relative display name.  If the child display name
   * starts with the parent, then we can strip that as the common
   * suffix.
   */
  static relDis(parent: string, child: string): string;
  /**
   * Coerce a value to a record Dict:
   * - Row or Dict returns itself
   * - Grid returns first row (must have at least one row)
   * - List returns first item (must have at least one item which
   *   is Ref or Dict)
   * - Ref will make a call to read database (must be run in a
   *   context)
   */
  static toRec(val: sys.JsObj | null, cx?: HaystackContext | null): Dict;
  /**
   * Construct a grid for a Dict row. The meta parameter can be
   * any {@link makeDict | makeDict} value.
   */
  static makeDictGrid(meta: sys.JsObj | null, row: Dict): Grid;
  /**
   * Empty dict singleton
   */
  static dict0(): Dict;
  /**
   * Create a Dict with one name/value pair
   */
  static dict1(n: string, v: sys.JsObj): Dict;
  /**
   * Unescape tag name from "__{utf-8 hex}" format
   */
  static unescapeTagName(n: string): string;
  /**
   * Create a Dict with four name/value pairs
   */
  static dict4(n0: string, v0: sys.JsObj, n1: string, v1: sys.JsObj, n2: string, v2: sys.JsObj, n3: string, v3: sys.JsObj): Dict;
  /**
   * Create a Dict with five name/value pairs
   */
  static dict5(n0: string, v0: sys.JsObj, n1: string, v1: sys.JsObj, n2: string, v2: sys.JsObj, n3: string, v3: sys.JsObj, n4: string, v4: sys.JsObj): Dict;
  /**
   * Create a Dict with two name/value pairs
   */
  static dict2(n0: string, v0: sys.JsObj, n1: string, v1: sys.JsObj): Dict;
  /**
   * Create a Dict with three name/value pairs
   */
  static dict3(n0: string, v0: sys.JsObj, n1: string, v1: sys.JsObj, n2: string, v2: sys.JsObj): Dict;
  /**
   * Return if any of the tag name/value pairs match the given
   * function.
   */
  static dictAny(d: Dict, f: ((arg0: sys.JsObj | null, arg1: string) => boolean)): boolean;
  /**
   * Get all the non-null values mapped by a dictionary.
   */
  static dictVals(d: Dict): sys.List<sys.JsObj>;
  /**
   * Construct an empty grid with just the given grid level
   * meta-data. The meta parameter can be any {@link makeDict | makeDict}
   * value.
   */
  static makeEmptyGrid(meta?: sys.JsObj | null): Grid;
  /**
   * Return if two dicts are equal with same name/value pairs.
   * Value are compared via the {@link sys.Obj.equals | sys::Obj.equals}
   * method.  Ordering of the dict tags is not considered.
   */
  static dictEq(a: Dict, b: Dict): boolean;
  /**
   * Return if the given string is a legal tag name:
   * - first char must be ASCII lower case letter or underbar: `a` - `z`
   *   or `_`
   * - rest of chars must be ASCII letter,digit, or underbar: `a` - `z`,
   *   `A` - `Z`, `0` - `9`, or `_`
   * - if first char is underbar, then it must have a at least one
   *   additional alpha-num character
   * - or if first two chars are underbar, then must be followed by
   *   a hexdecimal characters for a UTF-8 encoded string
   */
  static isTagName(n: string): boolean;
  /**
   * Make a Dict instance where `val` is one of the following:
   * - Dict: return `val`
   * - null: return {@link emptyDict | emptyDict}
   * - Str:Obj?: wrap map as Dict
   * - Str[]: dictionary of key/Marker value pairs
   */
  static makeDict(val: sys.JsObj | null): Dict;
  /**
   * Map an exception to its standard tags:
   * - `dis`: error display string
   * - `err`: marker
   * - `errTrace`: Str stack dump
   * - `axonTrace`: Axon stack dump (if applicable)
   * - `errType`: exception type qname
   */
  static toErrMeta(e: sys.Err): Dict;
  /**
   * Coerce a value to a list of Ref identifiers:
   * - Ref returns itself as list of one
   * - Ref[] returns itself
   * - Dict return `id` tag
   * - Dict[] return `id` tags
   * - Grid return `id` column
   */
  static toIds(val: sys.JsObj | null): sys.List<Ref>;
  /**
   * Construct a grid for a list of Dict rows.  The meta
   * parameter can be any {@link makeDict | makeDict} value.  Any
   * null dicts result in an empty row of all nulls.  If no
   * non-null rows, then return {@link makeEmptyGrid | makeEmptyGrid}.
   */
  static makeDictsGrid(meta: sys.JsObj | null, rows: sys.List<Dict | null>): Grid;
  /**
   * Get a read/write list of the dict's name keys.
   */
  static dictNames(d: Dict): sys.List<string>;
  /**
   * Return a new Dict containing the name/value pairs for which
   * f returns true. If f returns false for every pair, then
   * return an empty Dict.
   */
  static dictFindAll(d: Dict, f: ((arg0: sys.JsObj | null, arg1: string) => boolean)): Dict;
  /**
   * Coerce a value to a Ref identifier:
   * - Ref returns itself
   * - Row or Dict, return `id` tag
   * - Grid return first row id
   */
  static toId(val: sys.JsObj | null): Ref;
  static addArg(b: sys.StrBuf, name: string, arg: sys.JsObj | null): void;
  /**
   * Given two display strings, return 1, 0, or -1 if a is less
   * than, equal to, or greater than b.  The comparison is case
   * insensitive and takes into account trailing digits so that a
   * dis str such as "Foo-10" is greater than "Foo-2".
   */
  static compareDis(a: string, b: string): number;
  /**
   * Get the localized string for the given tag name for the
   * current locale. See [docSkySpark::Localization#tags](https://fantom.org/doc/docSkySpark/Localization#tags).
   */
  static tagToLocale(name: string): string;
  /**
   * Remove all names from the given dict. Ignore any name not
   * defined as a tag.
   */
  static dictRemoveAll(d: Dict, names: sys.List<string>): Dict;
  /**
   * Coerce a value to a list of record Dicts:
   * - null return empty list
   * - Ref or Ref[] will read database (must be run in a context)
   * - Row or Row[] returns itself
   * - Dict or Dict[] returns itself
   * - Grid is mapped to list of rows
   */
  static toRecs(val: sys.JsObj | null, cx?: HaystackContext | null): sys.List<Dict>;
  /**
   * Take an arbitrary string and convert into a safe tag name.
   * Do not assume any specific conversion algorithm as it might
   * change in the future.  The empty string is not supported.
   */
  static toTagName(n: string): string;
  /**
   * Return if all of the tag name/value pairs match the given
   * function.
   */
  static dictAll(d: Dict, f: ((arg0: sys.JsObj | null, arg1: string) => boolean)): boolean;
  /**
   * Coerce dict to Haystack types, see {@link toHaystack | toHaystack}.
   */
  static dictToHaystack(dict: Dict, opts?: Dict | null): Dict;
  /**
   * Make a list of Dict instances using {@link makeDict | makeDict}.
   */
  static makeDicts(maps: sys.List<sys.JsObj | null>): sys.List<Dict>;
  /**
   * Return if tag name starts with "__" as escaped name
   */
  static isEscapedTagName(n: string): boolean;
  static make(...args: unknown[]): Etc;
  /**
   * Construct a grid for an error response.
   */
  static makeErrGrid(e: sys.Err, meta?: sys.JsObj | null): Grid;
  /**
   * Process macro pattern with given scope of variable
   * name/value pairs. The pattern is a Unicode string with
   * embedded expressions:
   * - `$tag`: resolve tag name from scope, variable name ends with
   *   first non-tag character, see {@link isTagName | Etc.isTagName}
   * - `${tag}`: resolve tag name from scope
   * - `$<pod::key>`: localization key
   * 
   * Any variables which cannot be resolved in the scope are
   * returned as-is (such `$name`) in the result string.
   * 
   * If a tag resolves to Ref, then we use Ref.dis for string.
   */
  static macro(pattern: string, scope: Dict): string;
  /**
   * Escape tag name into "__{utf-8 hex}" format
   */
  static escapeTagName(n: string): string;
  /**
   * Create a Dict with six name/value pairs
   */
  static dict6(n0: string, v0: sys.JsObj, n1: string, v1: sys.JsObj, n2: string, v2: sys.JsObj, n3: string, v3: sys.JsObj, n4: string, v4: sys.JsObj, n5: string, v5: sys.JsObj): Dict;
  /**
   * Get the emtpy Dict instance.
   */
  static emptyDict(): Dict;
}

/**
 * Write Haystack data in [Trio](https://fantom.org/doc/docHaystack/Trio)
 * format.
 * 
 * Options:
 * - noSort: do not sort tag names
 */
export class TrioWriter extends sys.Obj implements GridWriter {
  static type$: sys.Type
  /**
   * Write separator and record.  Return this.
   */
  writeDict(dict: Dict): this;
  /**
   * Wrap output stream
   */
  static make(out: sys.OutStream, opts?: Dict | null, ...args: unknown[]): TrioWriter;
  /**
   * Close the underlying output stream
   */
  close(): boolean;
  /**
   * Write the grid rows (no support for meta)
   */
  writeGrid(grid: Grid): this;
  /**
   * Write the list of dicts.  Return this.
   */
  writeAllDicts(dicts: sys.List<Dict>): this;
}

/**
 * Read Haystack data in [CSV](https://fantom.org/doc/docHaystack/Csv)
 * format.
 */
export class CsvReader extends sys.Obj implements GridReader {
  static type$: sys.Type
  /**
   * Return CSV file as a grid.  Invalid column names are
   * automatically converted in safe names, but the original name
   * may be retreived from the col meta via the "orig" tag.
   */
  readGrid(): Grid;
  /**
   * Wrap input stream
   */
  static make(in$: sys.InStream, ...args: unknown[]): CsvReader;
}

/**
 * UnknownKindErr when a Kind cannot be resolved or parsed
 */
export class UnknownRecErr extends sys.Err {
  static type$: sys.Type
  /**
   * Construct with message and optional cause.
   */
  static make(msg: string | null, cause?: sys.Err | null, ...args: unknown[]): UnknownRecErr;
}

/**
 * NA is the singleton which indicates not available.
 */
export class NA extends sys.Obj {
  static type$: sys.Type
  /**
   * Singleton value
   */
  static val(): NA;
  /**
   * Return "NA"
   */
  toStr(): string;
  /**
   * Always return {@link val | val}
   */
  static fromStr(s: string, ...args: unknown[]): NA;
}

/**
 * TypedDict wraps a dict that maps tags to statically typed
 * fields. To use this API:
 * 1. Create subclass of TypedDict
 * 2. Annotate const instance fields with {@link TypedTag | @TypedTag}
 * 3. Create constructor with Dict and it-block callback
 * 4. Optionally create convenience factory that calls {@link create | create}
 * 
 * The following coercions are supported:
 * - Int field from Number tag
 * - Duration field from Number tag
 * - Bool field from Marker tag
 * 
 * Example:
 * ```
 * const class ExampleRec : TypedDict
 * {
 *   static new wrap(Dict d, |Str|? onErr := null) { create(ExampleRec#, d, onErr) }
 * 
 *   new make(Dict d, |This| f) : super(d) { f(this) }
 * 
 *   @TypedTag const Int limit := 99
 * 
 *   @TypedTag const Duration timeout := 3sec
 * }
 * ```
 */
export class TypedDict extends sys.Obj implements Dict {
  static type$: sys.Type
  /**
   * Return if wrapped dict is empty
   */
  isEmpty(): boolean;
  /**
   * Iterate the wrapped dict tags
   */
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  /**
   * Wrapped dict for this instance
   */
  meta(): Dict;
  /**
   * Get a tag from wrapped dict
   */
  get(n: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return if wrapped dict is missing given tag
   */
  missing(n: string): boolean;
  /**
   * Factory to create for given type and dict to wrap.  Invalid
   * tag values are logged to the given callback if provided.
   */
  static create(type: sys.Type, meta: Dict, onErr?: ((arg0: string) => void) | null): TypedDict;
  /**
   * Return if wrapped dict has given tag
   */
  has(n: string): boolean;
  /**
   * Trap on the wrapped dict
   */
  trap(n: string, a?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Sub constructor.
   */
  static make(meta: Dict, ...args: unknown[]): TypedDict;
  /**
   * Iterate the wrapped dict tags until callback returns
   * non-null
   */
  eachWhile(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
  /**
   * Return string for debugging only
   */
  toStr(): string;
  /**
   * Get display string for dict or the given tag.  If `name` is
   * null, then return display text for the entire dict using {@link Etc.dictToDis | Etc.dictToDis}.
   * If `name` is non-null then format the tag value using its
   * appropiate `toLocale` method.  If `name` is not defined by this
   * dict, then return `def`.
   */
  dis(name?: string | null, def?: string | null): string | null;
  /**
   * Get the `id` tag as a Ref or raise CastErr/UnknownNameErr
   */
  id(): Ref;
  /**
   * Temp shim until we break backward compatibility
   */
  _id(): xeto.Ref;
  /**
   * Create a new instance of this dict with the same names, but
   * apply the specified closure to generate new values.
   */
  map(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj)): this;
}

/**
 * Row of a Grid.  Row also implements the Dict mixin to expose
 * all of the columns as name/value pairs.
 */
export class Row extends sys.Obj implements Dict {
  static type$: sys.Type
  /**
   * Scalar value for the cell
   */
  val(col: Col): sys.JsObj | null;
  /**
   * Always returns false.
   */
  isEmpty(): boolean;
  /**
   * Iterate through all the columns.
   */
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  /**
   * Get display string for dict or the given tag.  The Row
   * implementation follows all the same rules as {@link Dict.dis | Dict.dis}
   * with following enhancements:
   * 
   * If the column meta defines a "format" pattern, then it is
   * used to format the value via the appropiate `toLocale` method.
   */
  dis(name?: string | null, def?: string | null): string | null;
  /**
   * Parent  grid
   */
  grid(): Grid;
  /**
   * Get the column {@link val | val} by name.  If column name
   * doesn't exist or if the column value is null, then return `def`.
   */
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return true if the given name is not mapped to a non-null
   * column {@link val | val}.
   */
  missing(name: string): boolean;
  /**
   * Get the column {@link val | val} by name.  If column name
   * doesn't exist or if the column value is null, then throw
   * UnknownNameErr.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Return true if the given name is mapped to a non-null column
   * {@link val | val}.
   */
  has(name: string): boolean;
  /**
   * Iterate through all the columns  until function returns
   * null, then break iteration and return the result.
   */
  eachWhile(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
  static make(...args: unknown[]): Row;
  /**
   * Return string for debugging only
   */
  toStr(): string;
  /**
   * Get the `id` tag as a Ref or raise CastErr/UnknownNameErr
   */
  id(): Ref;
  /**
   * Temp shim until we break backward compatibility
   */
  _id(): xeto.Ref;
  /**
   * Create a new instance of this dict with the same names, but
   * apply the specified closure to generate new values.
   */
  map(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj)): this;
}

/**
 * Symbol is a name to a def in the meta-model namespace
 */
export class Symbol extends sys.Obj {
  static type$: sys.Type
  /**
   * String representation
   */
  toStr(): string;
  /**
   * Code representation with leading "^" caret.
   */
  toCode(): string;
  /**
   * Construct from string
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Symbol;
  /**
   * Equality is based on string representation
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Simple name
   */
  name(): string;
  /**
   * Hash code is based on string representation
   */
  hash(): number;
}

/**
 * CallErr is raised when a server returns an error grid from a
 * client call to a REST operation.
 */
export class CallErr extends sys.Err {
  static type$: sys.Type
  /**
   * Remote stack trace if available
   */
  remoteTrace(): string | null;
  /**
   * Grid.meta from the error grid response
   */
  meta(): Dict;
}

/**
 * Write Haystack data in [Zinc](https://fantom.org/doc/docHaystack/Zinc)
 * format.
 */
export class ZincWriter extends sys.Obj implements GridWriter {
  static type$: sys.Type
  /**
   * Flush underlying stream
   */
  flush(): this;
  /**
   * Wrap given output strea
   */
  static make(out: sys.OutStream, ...args: unknown[]): ZincWriter;
  /**
   * Close underlying stream
   */
  close(): this;
  /**
   * Write a grid to stream
   */
  writeGrid(grid: Grid): this;
  /**
   * Format a grid to a zinc string in memory.
   */
  static gridToStr(grid: Grid): string;
  /**
   * Get a value as a zinc string.
   */
  static valToStr(val: sys.JsObj | null): string;
  /**
   * Write a zinc value
   */
  writeVal(val: sys.JsObj | null): void;
}

/**
 * SpanMode enumerates relative or absolute span modes
 */
export class SpanMode extends sys.Enum {
  static type$: sys.Type
  static thisYear(): SpanMode;
  /**
   * List of SpanMode values indexed by ordinal
   */
  static vals(): sys.List<SpanMode>;
  static thisWeek(): SpanMode;
  static lastMonth(): SpanMode;
  static pastQuarter(): SpanMode;
  static yesterday(): SpanMode;
  static thisQuarter(): SpanMode;
  static today(): SpanMode;
  static lastQuarter(): SpanMode;
  static thisMonth(): SpanMode;
  static pastMonth(): SpanMode;
  static pastYear(): SpanMode;
  static lastWeek(): SpanMode;
  static pastWeek(): SpanMode;
  static abs(): SpanMode;
  static lastYear(): SpanMode;
  /**
   * Display name for relative period
   */
  dis(): string;
  /**
   * Is this an absolute mode
   */
  isAbs(): boolean;
  /**
   * Is this a relative mode
   */
  isRel(): boolean;
  /**
   * Return the SpanMode instance for the specified name.  If not
   * a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): SpanMode;
}

/**
 * DependErr indicates a missing dependency
 */
export class DependErr extends sys.Err {
  static type$: sys.Type
  /**
   * Construct with message and optional cause.
   */
  static make(msg: string | null, cause?: sys.Err | null, ...args: unknown[]): DependErr;
}

/**
 * DateSpan models a span of time between two dates.
 */
export class DateSpan extends sys.Obj {
  static type$: sys.Type
  /**
   * Constant for a month period.
   */
  static year(): string;
  /**
   * Constant for a day period.
   */
  static day(): string;
  /**
   * The period: {@link day | day}, {@link week | week}, {@link month | month},
   * {@link quarter | quarter}, {@link year | year}, or {@link range | range}.
   */
  period(): string;
  /**
   * Constant for a month period.
   */
  static month(): string;
  /**
   * Constant for a week period.
   */
  static week(): string;
  /**
   * Get number of days in this span.
   */
  numDays(): number;
  /**
   * Constant for an arbitrary period.
   */
  static range(): string;
  /**
   * Inclusive end date for this span.
   */
  end(): sys.Date;
  /**
   * Start date for this span.
   */
  start(): sys.Date;
  /**
   * Constant for a quarter period.
   */
  static quarter(): string;
  /**
   * Return the previous DateSpan based on the period:
   * - day:   previous day
   * - week:  previous week
   * - month: previous month
   * - quarter:  previous quarter
   * - year:  previous year
   * - range: roll start/end back one day
   */
  prev(): DateSpan;
  /**
   * Construct for this week as `sun..sat` (uses locale start of
   * week)
   */
  static thisWeek(): DateSpan;
  /**
   * Construct for month previous to this month `1..28-31`
   */
  static lastMonth(): DateSpan;
  /**
   * Return display name for this span.  If `explicit` is true,
   * display actual dates, as opposed to `Today` or `Yesterday`.
   */
  dis(explicit?: boolean): string;
  /**
   * Convenience for period == DateSpan.week
   */
  isWeek(): boolean;
  /**
   * DateSpan for this 3 month quarter
   */
  static thisQuarter(): DateSpan;
  /**
   * DateSpan for 3 month quarter previous to this quarter
   */
  static lastQuarter(): DateSpan;
  /**
   * Construct for this month as `1..28-31`
   */
  static thisMonth(): DateSpan;
  /**
   * Construct for last 30days `today-30days..today`
   */
  static pastMonth(): DateSpan;
  /**
   * Str representation is "<start>,<end|period>".
   */
  toStr(): string;
  /**
   * Iterate each day in this DateSpan.
   */
  eachDay(func: ((arg0: sys.Date, arg1: number) => void)): void;
  /**
   * Return axon representation for this span.
   */
  toCode(): string;
  /**
   * Convenience for `make(Date(year, Month.jan, 1),
   * DateSpan.year)`.
   */
  static makeYear(year: number): DateSpan;
  /**
   * Convenience for period == DateSpan.year
   */
  isYear(): boolean;
  /**
   * Construct for week previous to this week `sun..sat` (uses
   * locale start of week)
   */
  static lastWeek(): DateSpan;
  /**
   * Shift start and end by the given number of days.
   */
  plus(d: sys.Duration): DateSpan;
  /**
   * Construct for last 7 days as `today-7days..today`
   */
  static pastWeek(): DateSpan;
  /**
   * Does this span inclusively contain the given Date
   * inclusively
   */
  contains(val: sys.Date | null): boolean;
  /**
   * Construct DateSpan from Str.  This method supports parsing
   * from the following formats:
   * - "<start>,<period>"
   * - "<start>,<end>"
   * - "today", "yesterday"
   * - "thisWeek", "thisMonth", "thisYear"
   * - "pastWeek", "pastMonth", "pastYear"
   * - "lastWeek", "lastMonth", "lastYear"
   * 
   * Where <start> and <end> are YYYY-MM-DD date formats and
   * period is "day", "week", "month", or "year".
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): DateSpan;
  /**
   * Iterate each month in this date range as a range of first to
   * last day in each month.
   */
  eachMonth(f: ((arg0: DateSpan) => void)): void;
  /**
   * Hash is based on start/end/period.
   */
  hash(): number;
  /**
   * Construct for this year `Jan-1..Dec-31`
   */
  static thisYear(): DateSpan;
  /**
   * Return the next DateSpan based on the period:
   * - day:   next day
   * - week:  next week
   * - month: next month
   * - year:  next year
   * - range: roll start/end forward one day
   */
  next(): DateSpan;
  /**
   * Shift start and end by the given number of days.
   */
  minus(d: sys.Duration): DateSpan;
  /**
   * Convenience for `make(Date(year, month, 1), DateSpan.month)`.
   */
  static makeMonth(year: number, month: sys.Month): DateSpan;
  /**
   * Convenience for `make(Date.today-1day)`.
   */
  static yesterday(): DateSpan;
  /**
   * Convert this instance to a Span instance
   */
  toSpan(tz: sys.TimeZone): Span;
  /**
   * Convenience for `make(Date.today)`.
   */
  static today(): DateSpan;
  /**
   * Construct a new DateSpan using a start date and period, or
   * an explicit start date and end date. If a period of `week`, `month`,
   * `quarter`, or `year` is used, then the start date will be
   * adjusted, if necessary, to the first of week, first of
   * month, first of quarter, or first of year, respectively.  If
   * a date is passed as end, then the period is implicitly `range`.
   */
  static make(start?: sys.Date, endOrPer?: sys.JsObj, ...args: unknown[]): DateSpan;
  /**
   * Construct for this past `today-365days..today`
   */
  static pastYear(): DateSpan;
  /**
   * Convenience for period == DateSpan.quarter
   */
  isQuarter(): boolean;
  /**
   * Convenience for `make(start, DateSpan.week)`.
   */
  static makeWeek(start: sys.Date): DateSpan;
  /**
   * Convenience for period == DateSpan.month
   */
  isMonth(): boolean;
  /**
   * Convenience for period == DateSpan.day
   */
  isDay(): boolean;
  /**
   * Convenience for period == DateSpan.range
   */
  isRange(): boolean;
  /**
   * Construct for year previous to this year `Jan-1..Dec-31`
   */
  static lastYear(): DateSpan;
  /**
   * Objects are equal if start, end, and period match.
   */
  equals(obj: sys.JsObj | null): boolean;
}

/**
 * XStr is an extended string which is a type name and value
 * encoded as a string.  It is used as a generic value when an
 * XStr is decoded without any predefind Fantom type.
 */
export class XStr extends sys.Obj {
  static type$: sys.Type
  /**
   * String value
   */
  val(): string;
  /**
   * Type name
   */
  type(): string;
  toStr(): string;
  /**
   * Decode into its appropiate Fantom type or fallback to
   * generic XStr
   */
  static decode(type: string, val: string): sys.JsObj;
  /**
   * Equality is base on type and val
   */
  equals(obj: sys.JsObj | null): boolean;
  /**
   * Construct for type name and string value
   */
  static make(type: string, val: string, ...args: unknown[]): XStr;
  /**
   * Hash is composed of type and val
   */
  hash(): number;
}

/**
 * ValidateErr when a validation fails.  The msg should be
 * localized for display to users.
 */
export class ValidateErr extends sys.Err {
  static type$: sys.Type
  static make(msg: string, cause?: sys.Err | null, ...args: unknown[]): ValidateErr;
}

/**
 * HaystackTest provides convenience methods for testing common
 * Haystack data structures.
 */
export class HaystackTest extends sys.Test {
  static type$: sys.Type
  /**
   * Convenience for {@link Marker.val | Marker.val}
   */
  static m(): Marker;
  /**
   * Verify two Refs are equal for both id and dis
   */
  verifyRefEq(a: Ref, b: Ref, msg?: string | null): void;
  /**
   * Verify contents of two lists using {@link verifyValEq | verifyValEq}
   */
  verifyListEq(a: sys.List, b: sys.List, msg?: string | null): void;
  /**
   * Verify that given grid is empty (has no rows)
   */
  verifyGridIsEmpty(g: Grid): void;
  static make(...args: unknown[]): HaystackTest;
  /**
   * Verify that two grids are equal (meta, cols, and rows)
   */
  verifyGridEq(a: Grid, b: Grid): void;
  /**
   * Verify two Haystack values are equal.  This method provides
   * additional checking for types which don't support equal
   * including:
   * - Ref.dis
   * - Dict
   * - Grid
   */
  verifyValEq(a: sys.JsObj | null, b: sys.JsObj | null, msg?: string | null): void;
  /**
   * Convenience for constructing a {@link Number | haystack::Number}
   * where unit may be either a Str name or a Unit instance.
   */
  static n(val: number | null, unit?: sys.JsObj | null): Number | null;
  /**
   * Verify two Dictts have same name/val pairs
   */
  verifyDictEq(a: Dict, b: sys.JsObj, msg?: string | null): void;
}

/**
 * Filter models a declarative predicate for selecting dicts.
 * See [docHaystack::Filters](https://fantom.org/doc/docHaystack/Filters)
 * for details.
 */
export class Filter extends sys.Obj {
  static type$: sys.Type
  static make(...args: unknown[]): Filter;
  /**
   * Return the normalized string of the filter
   */
  toStr(): string;
  /**
   * Deprecated - use {@link matches | matches}
   */
  include(r: Dict, pather: ((arg0: Ref) => Dict | null) | null): boolean;
  /**
   * Return if the specified record matches this filter. Pass a
   * context object to enable def aware features and to path
   * through refs via the `->` operator.
   */
  matches(r: Dict, cx?: HaystackContext | null): boolean;
  /**
   * Parse a query from string - see [docHaystack::Filters](https://fantom.org/doc/docHaystack/Filters)
   * for format. If the query cannot be parsed then return null
   * or throw ParseErr with location of error.
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Filter;
  /**
   * Equality is based on the normalized string.
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Hash is based on `toStr`.
   */
  hash(): number;
}

/**
 * UnitErr indicates an operation between two incompatible
 * units
 */
export class UnitErr extends sys.Err {
  static type$: sys.Type
  /**
   * Construct with message and optional cause.
   */
  static make(msg: string | null, cause?: sys.Err | null, ...args: unknown[]): UnitErr;
}

/**
 * Namespace models a symbolic namespace of defs
 */
export abstract class Namespace extends sys.Obj {
  static type$: sys.Type
  /**
   * Resolve def by its symbol string key
   */
  def(symbol: string, checked?: boolean): Def | null;
}

/**
 * Two dimensional tabular data structure composed of Cols and
 * Rows. Grids may be created by factory methods on {@link Etc | Etc}
 * or using {@link GridBuilder | GridBuilder}. See [docHaystack](https://fantom.org/doc/docHaystack/Kinds#grid).
 */
export abstract class Grid extends sys.Obj {
  static type$: sys.Type
  /**
   * Get a column by its name.  If not resolved then return null
   * or throw UnknownNameErr based on checked flag.
   */
  col(name: string, checked?: boolean): Col | null;
  /**
   * Return a new grid with additional column meta-data. The new
   * tags are merged according to {@link Etc.dictMerge | Etc.dictMerge}.
   * The `col` parameter may be either a {@link Col | Col} or column
   * name. The meta may be any value accepted by {@link Etc.makeDict | Etc.makeDict}.
   * If column is not found then return this. Also see {@link setColMeta | setColMeta}.
   */
  addColMeta(col: sys.JsObj, meta: sys.JsObj | null): Grid;
  /**
   * Convenience for {@link cols | cols} mapped to {@link Col.name | Col.name}.
   * The resulting list is safe for mutating.
   */
  colNames(): sys.List<string>;
  /**
   * Get a row by its index number or if index is out of bounds
   * then return null.  Throw UnsupportedErr is the grid doesn't
   * support indexed based row access.
   */
  getSafe(index: number): Row | null;
  /**
   * Get a column as a list of the cell values ordered by row.
   */
  colToList(col: sys.JsObj, listOf?: sys.Type): sys.List<sys.JsObj | null>;
  /**
   * Replace every cell with the given `from` value with the `to`
   * value. The resulting grid has the same grid and col meta. 
   * Replacement comparison is by via Fantom equality via `==`
   * operator, so it will only replace scalar values or null.
   */
  replace(from$: sys.JsObj | null, to: sys.JsObj | null): Grid;
  /**
   * Return a new Grid which is the result of applying the given
   * diffs to this grid.  The diffs must have the same number of
   * rows as this grid. Any cells in the diffs with a Remove.val
   * are removed from this grid, otherwise they are
   * updated/added.
   */
  commit(diffs: Grid): Grid;
  /**
   * Return a new grid which finds matching the rows in this
   * grid.  The has the same meta and column definitions. Also
   * see {@link find | find} and {@link filter | filter}.
   */
  findAll(f: ((arg0: Row, arg1: number) => boolean)): Grid;
  /**
   * Return a new grid with all the columns removed except the
   * given columns.  The `toKeep` columns can be {@link Col | Col}
   * instances or column names.  Columns not found are silently
   * ignored.
   */
  keepCols(toKeep: sys.List<sys.JsObj>): Grid;
  /**
   * Return a new Grid wich each col name mapped to its localized
   * tag name if the col does not already have a display string.
   * See {@link Etc.tagToLocale | Etc.tagToLocale} and [docSkySpark::Localization#tags](https://fantom.org/doc/docSkySpark/Localization#tags).
   */
  colsToLocale(): Grid;
  /**
   * Return a new grid with the given column renamed. The `oldCol`
   * parameter may be a {@link Col | Col} or col name.
   */
  renameCol(oldCol: sys.JsObj, newName: string): Grid;
  /**
   * Find one matching row or return null if no matches. Also see
   * {@link findIndex | findIndex} and {@link findAll | findAll}.
   */
  find(f: ((arg0: Row, arg1: number) => boolean)): Row | null;
  /**
   * Return a new grid which is a slice of the rows in this grid.
   * Negative indexes may be used to access from the end of the
   * grid.  The has the same meta and column definitions.
   */
  getRange(r: sys.Range): Grid;
  /**
   * Return if this grid contains the given column name.
   */
  has(name: string): boolean;
  /**
   * Join two grids by column name.  The `joinCol` parameter may be
   * a {@link Col | Col} or col name.  Current implementation
   * requires:
   * - grids cannot have conflicting col names (other than join
   *   col)
   * - each row in both grids must have a unique value for join col
   * - grid level meta is merged
   * - join column meta is merged
   */
  join(that: Grid, joinCol: sys.JsObj): Grid;
  /**
   * Return a new Grid which is a copy of this grid with the rows
   * reverse sorted by the given comparator function.
   */
  sortr(f: ((arg0: Row, arg1: Row) => number)): Grid;
  /**
   * Return true if the function returns true for all of the rows
   * in the grid.  If the grid is empty, return false.
   */
  all(f: ((arg0: Row, arg1: number) => boolean)): boolean;
  /**
   * Get the last row or return null if grid is empty. Throw
   * UnsupportedErr is the grid doesn't support indexed based row
   * access.
   */
  last(): Row | null;
  /**
   * Return new grid with column meta-data replaced by given
   * meta. The `col` parameter may be either a {@link Col | Col} or
   * column name. The meta may be any value accepted by {@link Etc.makeDict | Etc.makeDict}
   * If column is not found then return this.  Also see {@link addColMeta | addColMeta}.
   */
  setColMeta(col: sys.JsObj, meta: sys.JsObj | null): Grid;
  /**
   * Return if this is an error grid - meta has "err" tag.
   */
  isErr(): boolean;
  /**
   * Return a new grid with an additional column.  The cells of
   * the column are created by calling the mapping function for
   * each row. The meta may be any value accepted by {@link Etc.makeDict | Etc.makeDict}
   */
  addCol(name: string, meta: sys.JsObj | null, f: ((arg0: Row, arg1: number) => sys.JsObj | null)): Grid;
  /**
   * Return a new Grid which is a copy of this grid with the rows
   * sorted by the given comparator function.
   */
  sort(f: ((arg0: Row, arg1: Row) => number)): Grid;
  /**
   * Iterate the rows
   */
  each(f: ((arg0: Row, arg1: number) => void)): void;
  /**
   * Return a new grid which maps each of the rows to zero or
   * more new Dicts. The grid meta and existing column meta are
   * maintained.  New columns have empty meta.
   */
  flatMap(f: ((arg0: Row, arg1: number) => sys.JsObj | null)): Grid;
  /**
   * Return a new grid with multiple columns renamed.  The given
   * map is keyed old column names and maps to new column names. 
   * Any column names not found are ignored.
   */
  renameCols(oldToNew: sys.Map<sys.JsObj, string>): Grid;
  /**
   * Return a new grid with the given column removed. The `col`
   * parameter may be either a {@link Col | Col} or column name.
   * If column doesn't exist return this grid.
   */
  removeCol(col: sys.JsObj): Grid;
  /**
   * Get the number of rows in the grid.  Throw UnsupportedErr if
   * the grid doesn't support a size.
   */
  size(): number;
  /**
   * Meta-data for entire grid
   */
  meta(): Dict;
  /**
   * Sort the given column in reverse.  See {@link sortCol | sortCol}
   */
  sortColr(col: sys.JsObj): Grid;
  /**
   * Return a new grid by adding the given grid as a new set of
   * columns to this grid.  If the given grid contains duplicate
   * column names, then they are given auto-generated unique
   * names.  If the given grid contains fewer rows then this
   * grid, then the missing cells are filled with null.
   */
  addCols(x: Grid): Grid;
  /**
   * Return a new grid with only rows that define a unique key by
   * the given key columns.  If multiple rows have the same key
   * cells, then the first row is returned and subsequent rows
   * are removed.  The `keyCols` can be {@link Col | Col} instances
   * or column names.
   */
  unique(keyCols: sys.List<sys.JsObj>): Grid;
  /**
   * Return a new grid with additional grid level meta-data. The
   * new tags are merged according to {@link Etc.dictMerge | Etc.dictMerge}.
   * The meta may be any value accepted by {@link Etc.makeDict | Etc.makeDict}
   * Also see {@link setMeta | setMeta}.
   */
  addMeta(meta: sys.JsObj | null): Grid;
  /**
   * Sort using {@link Etc.compareDis | Etc.compareDis} and {@link Dict.dis | Dict.dis}.
   */
  sortDis(): Grid;
  /**
   * Return a new grid with grid level meta-data replaced by
   * given meta.  The meta may be any value accepted by {@link Etc.makeDict | Etc.makeDict}.
   * Also see {@link addMeta | addMeta}.
   */
  setMeta(meta: sys.JsObj | null): Grid;
  /**
   * Convenience for {@link sort | sort} which sorts the given
   * column. The `col` parameter can be a {@link Col | Col} or a str
   * name.  The sorting algorithm used is the same one used by
   * the table UI based on the localized display string.  If
   * column is not found then return this.
   */
  sortCol(col: sys.JsObj): Grid;
  /**
   * Get a row by its index number.  Throw UnsupportedErr is the
   * grid doesn't support indexed based row access.
   */
  get(index: number): Row;
  /**
   * Return if this grid does not contains the given column name.
   */
  missing(name: string): boolean;
  /**
   * Columns
   */
  cols(): sys.List<Col>;
  /**
   * Return a new grid which maps the rows to new Dict.  The grid
   * meta and existing column meta are maintained.  New columns
   * have empty meta.  If the mapping function returns null, then
   * the row is removed.
   */
  map(f: ((arg0: Row, arg1: number) => sys.JsObj | null)): Grid;
  /**
   * Return a new grid with all the given columns removed. The `toRemove`
   * columns can be {@link Col | Col} instances or column names.
   * Columns not found are silently ignored.
   */
  removeCols(toRemove: sys.List<sys.JsObj>): Grid;
  /**
   * Convenience for {@link cols | cols} mapped to {@link Col.dis | Col.dis}.
   * The resulting list is safe for mutating.
   */
  colDisNames(): sys.List<string>;
  /**
   * Convenience for {@link size | size} equal to zero.
   */
  isEmpty(): boolean;
  /**
   * Return true if the function returns true for any of the rows
   * in the grid.  If the grid is empty, return false.
   */
  any(f: ((arg0: Row, arg1: number) => boolean)): boolean;
  /**
   * Find one matching row index or return null if no matches.
   * Also see {@link find | find}.
   */
  findIndex(f: ((arg0: Row, arg1: number) => boolean)): number | null;
  /**
   * Return a new grid which finds matching rows based on the
   * given filter.  Also see {@link findAll | findAll}.
   */
  filter(filter: Filter, cx?: HaystackContext | null): Grid;
  /**
   * Return if this grid conforms to the [history grid shape](lib-his::doc#hisGrid):
   * - has at least two columns
   * - first column is named "ts"
   * - has meta hisStart and hisEnd DateTime values
   * 
   * This method does **not** check timezones or the ts cells.
   */
  isHisGrid(): boolean;
  /**
   * Map each row to a list of values.
   */
  mapToList(f: ((arg0: Row, arg1: number) => sys.JsObj | null)): sys.List<sys.JsObj | null>;
  /**
   * Return a new grid with the columns reordered.  The given
   * list of names represents the new order and must contain the
   * same current {@link Col | Col} instances or column names. Any
   * column names not found are ignored.
   */
  reorderCols(cols: sys.List<sys.JsObj>): Grid;
  /**
   * Iterate every row until the function returns non-null.  If
   * function returns non-null, then break the iteration and
   * return the resulting object.  Return null if the function
   * returns null for every item
   */
  eachWhile(f: ((arg0: Row, arg1: number) => sys.JsObj | null)): sys.JsObj | null;
  /**
   * Get the first row or return null if grid is empty.
   */
  first(): Row | null;
}

/**
 * Span models a range of time using an inclusive starting
 * timestamp and exclusive ending timestamp.
 */
export class Span extends sys.Obj {
  static type$: sys.Type
  /**
   * Absolute or relative mode
   */
  mode(): SpanMode;
  /**
   * Exclusive ending timestamp
   */
  end(): sys.DateTime;
  /**
   * Inclusive starting timestamp
   */
  start(): sys.DateTime;
  /**
   * Make an absolute span for two date times which must be
   * defined in the `Rel` timezone
   */
  static makeAbs(start: sys.DateTime, end: sys.DateTime, ...args: unknown[]): Span;
  /**
   * Timezone for this span
   */
  tz(): sys.TimeZone;
  /**
   * Convert to timezone using {@link sys.DateTime.toTimeZone | sys::DateTime.toTimeZone}
   * on both start, end
   */
  toTimeZone(tz: sys.TimeZone): Span;
  /**
   * Display string for current locale
   */
  dis(): string;
  /**
   * Convenience for `Span(SpanMode.today)`
   */
  static today(tz?: sys.TimeZone): Span;
  /**
   * Convert this span to a DateSpan attempting to use aligned
   * dates
   */
  toDateSpan(): DateSpan;
  /**
   * Make an absolute span for the given date
   */
  static makeDate(date: sys.Date, tz?: sys.TimeZone, ...args: unknown[]): Span;
  /**
   * Encode to string, see {@link fromStr | fromStr}
   */
  toStr(): string;
  /**
   * Return axon representation for this span.
   */
  toCode(): string;
  /**
   * Make a relative span for given mode using current time and
   * current locale for starting weekday
   */
  static makeRel(mode: SpanMode, tz?: sys.TimeZone, ...args: unknown[]): Span;
  /**
   * Decode from string format:
   * - relative {@link SpanMode | SpanMode} mode name
   * - absolute single date: `YYYY-MM-DD`
   * - absolute date span: `YYYY-MM-DD,YYYY-MM-DD`
   * - absolute date time span: `YYYY-MM-DDThh:mm:ss.FFF
   *   zzzz,YYYY-MM-DDThh:mm:ss.FFF zzzz`
   */
  static fromStr(str: string, tz?: sys.TimeZone, checked?: boolean, ...args: unknown[]): Span;
  /**
   * Equality is based on mode only for relative, start/end for
   * abs
   */
  equals(obj: sys.JsObj | null): boolean;
  /**
   * Hash code is based on mode only for relative, start/end for
   * abs
   */
  hash(): number;
}

/**
 * Kind provides a type signature for a Haystack data value
 */
export class Kind extends sys.Obj {
  static type$: sys.Type
  /**
   * Fantom type for the kind
   */
  type(): sys.Type;
  /**
   * Name of kind: Bool, Number, List, etc
   */
  name(): string;
  /**
   * Lookup Kind for a Fantom object
   */
  static fromVal(val: sys.JsObj | null, checked?: boolean): Kind | null;
  /**
   * Lookup Kind from its lower case def name
   */
  static fromDefName(name: string, checked?: boolean): Kind | null;
  /**
   * Return signature
   */
  toStr(): string;
  /**
   * Parse a signature to its Kind representation.  If it cannot
   * be parsed to a known kind, then return null or raise an
   * exception.
   */
  static fromStr(signature: string, checked?: boolean, ...args: unknown[]): Kind;
  /**
   * Hash is based signature
   */
  hash(): number;
  /**
   * Lookup Kind for a Fantom type
   */
  static fromType(type: sys.Type | null, checked?: boolean): Kind | null;
  /**
   * Equality is based signature
   */
  equals(that: sys.JsObj | null): boolean;
}

/**
 * Client manages a network connection to a haystack server.
 */
export class Client extends sys.Obj {
  static type$: sys.Type
  /**
   * URI of endpoint such as "http://host/api/myProj/". This URI
   * always ends in a trailing slash.
   */
  uri(): sys.Uri;
  /**
   * Call "about" operation to query server summary info. Also
   * see [HTTP API](https://fantom.org/doc/docHaystack/Ops#about).
   */
  about(): Dict;
  /**
   * Commit a set of diffs.  The req parameter must be a grid
   * with a "commit" tag in the grid.meta.  The rows are the
   * items to commit.  Return result as Grid or or raise {@link CallErr | haystack::CallErr}
   * if server returns error grid.
   * 
   * Also see [HTTP API](https://fantom.org/doc/docSkySpark/Ops#commit).
   * 
   * Examples:
   * ```
   * // add new record
   * tags := ["site":Marker.val, "dis":"Example Site"])
   * toCommit := Etc.makeDictGrid(["commit":"add"], tags)
   * client.commit(toCommit)
   * 
   * // update dis tag
   * changes := ["id": orig->id, "mod":orig->mod, "dis": "New dis"]
   * toCommit := Etc.makeDictGrid(["commit":"update"], changes)
   * client.commit(toCommit)
   * ```
   */
  commit(req: Grid): Grid;
  /**
   * Call "read" operation to read a record by its identifier. 
   * If the record is not found then return null or raise
   * UnknownRecException based on checked flag.  Raise {@link CallErr | haystack::CallErr}
   * if server returns error grid. Also see [HTTP API](https://fantom.org/doc/docHaystack/Ops#read).
   */
  readById(id: sys.JsObj, checked?: boolean): Dict | null;
  /**
   * Call "read" operation to read a record all recs which match
   * the given filter.  Raise {@link CallErr | haystack::CallErr}
   * if server returns error grid. Also see [HTTP API](https://fantom.org/doc/docHaystack/Ops#read).
   */
  readAll(filter: string): Grid;
  /**
   * Close the session by sending the `close` op.
   */
  close(): void;
  /**
   * Return uri.toStr
   */
  toStr(): string;
  /**
   * Call "read" operation to read a list of records by their
   * identifiers. Return a grid where each row of the grid maps
   * to the respective id list (indexes line up).  If checked is
   * true and any one of the ids cannot be resolved then raise
   * UnknownRecErr for first id not resolved.  If checked is
   * false, then each id not found has a row where every cell is
   * null.  Raise {@link CallErr | haystack::CallErr} if server
   * returns error grid.  Also see [HTTP API](https://fantom.org/doc/docHaystack/Ops#read).
   */
  readByIds(ids: sys.List<sys.JsObj>, checked?: boolean): Grid;
  /**
   * Call "read" operation to read a record that matches the
   * given filter. If there is more than one record, then it is
   * undefined which one is returned.  If there are no matches
   * then return null or raise UnknownRecException based on
   * checked flag.  Raise {@link CallErr | haystack::CallErr} if
   * server returns error grid.  Also see [HTTP API](https://fantom.org/doc/docHaystack/Ops#read).
   */
  read(filter: string, checked?: boolean): Dict | null;
  /**
   * Call the given REST operation with its request grid and
   * return the response grid.  If req is null, then an empty
   * grid used for request.  If the checked flag is true and
   * server returns an error grid, then raise {@link CallErr | haystack::CallErr},
   * otherwise return the grid itself.
   */
  call(op: string, req?: Grid | null, checked?: boolean): Grid;
  /**
   * Evaluate an Axon expression and return results as Grid.
   * Raise {@link CallErr | haystack::CallErr} if server returns
   * error grid. Also see [HTTP API](https://fantom.org/doc/docSkySpark/Ops#eval).
   */
  eval(expr: string): Grid;
  /**
   * Open with URI of project such as "http://host/api/myProj/".
   * Throw IOErr for network/connection error or `AuthErr` if
   * credentials are not authenticated.
   */
  static open(uri: sys.Uri, username: string, password: string, opts?: sys.Map<string, sys.JsObj> | null): Client;
}

/**
 * HisItem is a timestamp/value pair.
 */
export class HisItem extends sys.Obj implements Dict {
  static type$: sys.Type
  /**
   * Value at the timestamp.
   */
  val(): sys.JsObj | null;
  /**
   * Timestamp of the history record.
   */
  ts(): sys.DateTime;
  /**
   * Ordering is based on timestamp.
   */
  compare(that: sys.JsObj): number;
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  missing(name: string): boolean;
  has(name: string): boolean;
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Construct timestamp/value pair.
   */
  static make(ts: sys.DateTime, val: sys.JsObj | null, ...args: unknown[]): HisItem;
  map(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj)): this;
  isEmpty(): boolean;
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  /**
   * Equality is based on timestamp and value.
   */
  equals(that: sys.JsObj | null): boolean;
  eachWhile(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
  /**
   * Hash code is based on timestamp and value.
   */
  hash(): number;
  /**
   * Return string for debugging only
   */
  toStr(): string;
  /**
   * Get display string for dict or the given tag.  If `name` is
   * null, then return display text for the entire dict using {@link Etc.dictToDis | Etc.dictToDis}.
   * If `name` is non-null then format the tag value using its
   * appropiate `toLocale` method.  If `name` is not defined by this
   * dict, then return `def`.
   */
  dis(name?: string | null, def?: string | null): string | null;
  /**
   * Get the `id` tag as a Ref or raise CastErr/UnknownNameErr
   */
  id(): Ref;
  /**
   * Temp shim until we break backward compatibility
   */
  _id(): xeto.Ref;
}

/**
 * Def models a definition dictionary
 */
export abstract class Def extends sys.Obj implements Dict {
  static type$: sys.Type
  /**
   * Symbolic identifier for this definition
   */
  symbol(): Symbol;
  /**
   * Return simple name of definition
   */
  name(): string;
  /**
   * Return string for debugging only
   */
  toStr(): string;
  /**
   * Return if the there are no name/value pairs
   */
  isEmpty(): boolean;
  /**
   * Iterate through the name/value pairs
   */
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  /**
   * Get display string for dict or the given tag.  If `name` is
   * null, then return display text for the entire dict using {@link Etc.dictToDis | Etc.dictToDis}.
   * If `name` is non-null then format the tag value using its
   * appropiate `toLocale` method.  If `name` is not defined by this
   * dict, then return `def`.
   */
  dis(name?: string | null, def?: string | null): string | null;
  /**
   * Get the value for the given name or `def` if name not mapped
   */
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return true if the given name is not mapped to a non-null
   * value.
   */
  missing(name: string): boolean;
  /**
   * Return true if the given name is mapped to a non-null value.
   */
  has(name: string): boolean;
  /**
   * Get the value mapped by the given name.  If it is not mapped
   * to a non-null value, then throw an UnknownNameErr.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Get the `id` tag as a Ref or raise CastErr/UnknownNameErr
   */
  id(): Ref;
  /**
   * Temp shim until we break backward compatibility
   */
  _id(): xeto.Ref;
  /**
   * Iterate through the name/value pairs until the given
   * function returns non-null, then break the iteration and
   * return resulting object.  Return null if function returns
   * null for every name/value pair.
   */
  eachWhile(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
  /**
   * Create a new instance of this dict with the same names, but
   * apply the specified closure to generate new values.
   */
  map(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj)): this;
}

/**
 * UnknownNameErr is thrown when {@link Dict.trap | Dict.trap}
 * or {@link Grid.col | Grid.col} fails to resolve a name.
 */
export class UnknownNameErr extends sys.Err {
  static type$: sys.Type
  /**
   * Construct with message and optional cause.
   */
  static make(msg: string | null, cause?: sys.Err | null, ...args: unknown[]): UnknownNameErr;
}

/**
 * Write Haystack data in [JSON](https://fantom.org/doc/docHaystack/Json)
 * format.
 */
export class JsonWriter extends sys.Obj implements GridWriter {
  static type$: sys.Type
  opts(): Dict;
  opts(it: Dict): void;
  /**
   * Write the grid and return this
   */
  writeGrid(grid: Grid): this;
  /**
   * Get a value as a JSON string.
   */
  static valToStr(val: sys.JsObj | null): string;
  /**
   * Write any haystack value
   */
  writeVal(val: sys.JsObj | null): this;
  /**
   * Flush the underlying output stream and return this
   */
  flush(): this;
  /**
   * Wrap output stream. By default, the writer encodes JSON in
   * the Haystack 4 (Hayson) format. Use the `v3` option to encode
   * JSON in the Haystack 3 format.
   * 
   * The following opts are supported:
   * - `v3` (Marker): write JSON in the Haystack 3 format
   * ```
   * JsonWriter(out).writeVal(Etc.makeDict(["ts": DateTime.now])).close
   * 
   * JsonWriter(out, Etc.makeDict(["v3":Marker.val])).writeGrid(grid).close
   * ```
   */
  static make(out: sys.OutStream, opts?: Dict | null, ...args: unknown[]): JsonWriter;
  /**
   * Close the underlying output stream
   */
  close(): boolean;
}

/**
 * Dict is a map of name/value pairs.  It is used to model grid
 * rows, grid meta-data, and name/value object literals.  Dict
 * is characterized by:
 * - names must match {@link Etc.isTagName | Etc.isTagName} rules
 * - values should be one valid Haystack kinds
 * - get `[]` access returns null if name not found
 * - trap `->` access throws exception if name not found
 * 
 * Also see {@link Etc.emptyDict | Etc.emptyDict}, {@link Etc.makeDict | Etc.makeDict}.
 */
export abstract class Dict extends sys.Obj implements xeto.Dict {
  static type$: sys.Type
  /**
   * Return string for debugging only
   */
  toStr(): string;
  /**
   * Return if the there are no name/value pairs
   */
  isEmpty(): boolean;
  /**
   * Iterate through the name/value pairs
   */
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  /**
   * Get display string for dict or the given tag.  If `name` is
   * null, then return display text for the entire dict using {@link Etc.dictToDis | Etc.dictToDis}.
   * If `name` is non-null then format the tag value using its
   * appropiate `toLocale` method.  If `name` is not defined by this
   * dict, then return `def`.
   */
  dis(name?: string | null, def?: string | null): string | null;
  /**
   * Get the value for the given name or `def` if name not mapped
   */
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return true if the given name is not mapped to a non-null
   * value.
   */
  missing(name: string): boolean;
  /**
   * Return true if the given name is mapped to a non-null value.
   */
  has(name: string): boolean;
  /**
   * Get the value mapped by the given name.  If it is not mapped
   * to a non-null value, then throw an UnknownNameErr.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Get the `id` tag as a Ref or raise CastErr/UnknownNameErr
   */
  id(): Ref;
  /**
   * Temp shim until we break backward compatibility
   */
  _id(): xeto.Ref;
  /**
   * Iterate through the name/value pairs until the given
   * function returns non-null, then break the iteration and
   * return resulting object.  Return null if function returns
   * null for every name/value pair.
   */
  eachWhile(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
  /**
   * Create a new instance of this dict with the same names, but
   * apply the specified closure to generate new values.
   */
  map(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj)): this;
}

