import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as xeto from './xeto.js';
import * as haystack from './haystack.js';

/**
 * Top level function in the namespace
 */
export class TopFn extends Fn {
  static type$: sys.Type
  /**
   * Is this function tagged as superuser-only
   */
  isSu(): boolean;
  /**
   * Is this function tagged as admin-only
   */
  isAdmin(): boolean;
  /**
   * Func def metadata
   */
  meta(): haystack.Dict;
  /**
   * Return if this function has been deprecated
   */
  isDeprecated(): boolean;
  /**
   * Is this a lazy function that accepts un-evaluated arguments
   */
  isLazy(): boolean;
  /**
   * Return only name
   */
  toStr(): string;
  /**
   * Return true
   */
  isTop(): boolean;
  static make(loc: Loc, name: string, meta: haystack.Dict, params: sys.List<FnParam>, body?: Expr, ...args: unknown[]): TopFn;
}

/**
 * Expr is the base class for Axon AST nodes.  All expressions
 * are immutable classes safe to share between threads once
 * parsed.
 */
export class Expr extends sys.Obj {
  static type$: sys.Type
  /**
   * Encode the AST into a tree of dicts.  See [parseAst()](parseAst()).
   */
  encode(): haystack.Dict;
  /**
   * Location of this expression in source code or `Loc.unknown`.
   */
  loc(): Loc;
  static make(...args: unknown[]): Expr;
  /**
   * Print to string
   */
  toStr(): string;
  /**
   * Evaluate this expression.
   */
  eval(cx: AxonContext): sys.JsObj | null;
}

/**
 * System library
 */
export class CoreLib extends sys.Obj {
  static type$: sys.Type
  /**
   * Return a string of the given value's type.  No guarantee is
   * made for the string's format.  Applications must **not** assume
   * any specific format, this function is for human consumption
   * only.
   */
  static debugType(val: sys.JsObj | null): string;
  /**
   * Given a DateTime or Date, return the week number of the
   * year.  The result is a number between 1 and 53 using the
   * given start of week weekday as number 0-6 (defaults start of
   * week for current locale).
   */
  static weekOfYear(val: sys.JsObj, startOfWeek?: haystack.Number | null): haystack.Number;
  /**
   * Parse Axon source code into an abstract syntax tree modeled
   * as a tree of dicts.  Each node has a `type` tag which
   * specified the node type. Common AST shapes:
   * ```
   * 123    =>  {type:"literal", val:123}
   * a      =>  {type:"var", name:"a"}
   * not a  =>  {type:"not", operand:{type:"var", name:"a"}}
   * a + b  =>  {type:"add", lhs:{type:"var", name:"a"}, rhs:{type:"var", name:"b"}}
   * ```
   * 
   * NOTE: the keys and structure of the AST is subject to change over
   * time.
   */
  static parseAst(src: string): haystack.Dict;
  /**
   * Lookup a def by its symbol name (Str or Symbol).  If not
   * found return null or raise UnknownDefErr based on checked
   * flag. The result is returned as the definition's normalized
   * dict representation.
   */
  static def(symbol: sys.JsObj, checked?: boolean): haystack.Def | null;
  /**
   * Get year as integer such as 2010 from date or datetime
   */
  static year(d: sys.JsObj): sys.JsObj | null;
  /**
   * Convert an obj to its string representation
   */
  static _toStr(val: sys.JsObj | null): sys.JsObj | null;
  /**
   * Get the remove value singleton {@link haystack.Remove.val | haystack::Remove.val}
   */
  static removeMarker(): haystack.Remove;
  /**
   * Convert a char number or str to ASCII upper case. Also see [lower()](lower())
   * and [capitalize()](capitalize()).
   * 
   * Examples:
   * ```
   * upper("cat")      >> "CAT"
   * upper("Cat")      >> "CAT"
   * upper(97).toChar  >> "A"
   * ```
   */
  static upper(val: sys.JsObj): sys.JsObj | null;
  /**
   * Get weekday as integer from 0 to 6 of Date or DateTime. Zero
   * indicates Sunday and 6 indicates Saturday
   */
  static weekday(t: sys.JsObj): haystack.Number;
  /**
   * Pad string to the right.  If size is less than width, then
   * add the given char to the left to acheive the specified
   * with.
   * 
   * Examples:
   * ```
   * "xyz".padr(2, ".")  >>  "xyz"
   * "xyz".padr(5, "-")  >>  "xyz--"
   * ```
   */
  static padr(val: string, width: haystack.Number, char?: string): string;
  /**
   * Find all the items in a list, dict, or grid by applying the
   * given filter function.  Also see {@link find | find}.
   * 
   * If working with a list, the filter should be a function that
   * takes `(val)` or `(val, index)`.  It should return true to keep
   * the item.
   * 
   * If working with a dict, the filter should be a function that
   * takes `(val)` or `(val, name)`.  It should return the true to
   * keep the name/value pair.
   * 
   * If working with a grid, the filter function takes `(row)` or `(row,
   * index)` and returns true to keep the row.  The resulting grid
   * shares the original's grid meta and columns.
   * 
   * If working with a stream, the filter takes `(val)` and returns
   * true to match.  See [docHaxall::Streams#findAll](https://fantom.org/doc/docHaxall/Streams#findAll).
   * 
   * Examples:
   * ```
   * // find all the strings longer than 3 chars
   * ["ape", "bat", "charlie", "dingo"].findAll(x => x.size > 3)
   * 
   * // find even numbers
   * [0, 1, 2, 3, 4].findAll(isEven)
   * 
   * // find all the sites greater than 10,000ft from grid
   * readAll(site).findAll(s => s->area > 10_000ft²)
   * ```
   */
  static findAll(val: sys.JsObj, fn: Fn): sys.JsObj | null;
  /**
   * Pad string to the left.  If size is less than width, then
   * add the given char to the left to achieve the specified
   * width.
   * 
   * Examples:
   * ```
   * "3".padl(3, "0")    >>  "003"
   * "123".padl(2, "0")  >>  "123"
   * ```
   */
  static padl(val: string, width: haystack.Number, char?: string): string;
  /**
   * Does the given Date or DateTime fall on Mon, Tue, Wed, Thu,
   * or Fri
   */
  static isWeekday(t: sys.JsObj): sys.JsObj | null;
  /**
   * Given a DateTime in a specific timezone, return the number
   * of hours in the day.  Dates which transition to DST will be
   * 23 hours and days which transition back to standard time
   * will be 25 hours.
   */
  static hoursInDay(dt: sys.DateTime): haystack.Number;
  /**
   * Trim whitespace from the beginning and end of the string. 
   * For the purposes of this function, whitespace is defined as
   * any character equal to or less than the 0x20 space character
   * (including ` `, `\r`, `\n`, and `\t`).
   * 
   * Examples:
   * ```
   * " abc ".trim   >>  "abc"
   * "abc".trim     >>  "abc"
   * ```
   */
  static trim(val: string): string;
  /**
   * Is number an ASCII uppercase alphabetic char: A-Z
   * 
   * Examples:
   * ```
   * isUpper("A".get(0))  >>  true
   * isUpper("a".get(0))  >>  false
   * isUpper("5".get(0))  >>  false
   * ```
   */
  static isUpper(num: haystack.Number): boolean;
  /**
   * Merge two Dicts together and return a new Dict.  Any tags in
   * `b` are added to `a`.  If `b` defines a tag already in `a`, then it
   * is overwritten by `b`.  If a tag in `b` is mapped to `Remove.val`,
   * then that tag is removed from the result.
   */
  static merge(a: sys.JsObj | null, b: sys.JsObj | null): sys.JsObj | null;
  /**
   * DateSpan for 3 month quarter previous to this quarter
   */
  static lastQuarter(): haystack.DateSpan;
  /**
   * Evalate an Axon string expression to a function.  Typically
   * the expression is just a function name, but it can be any
   * expression that evaluates to a function.  Raise an exception
   * if the expression does not evaluate to a function. Note this
   * call does evalute the given expression in the runtime, so it
   * must be used with caution - never use it with a string from
   * a non-trusted origin.
   * 
   * Examples:
   * ```
   * evalToFunc("now").call
   * evalToFunc("(x, y)=>x+y").call([3, 4])
   * (evalToFunc("(x, y)=>x+y"))(3, 4)
   * evalToFunc("""replace(_, "x", "_")""").call(["xyz"])
   * ```
   */
  static evalToFunc(expr: string): Fn;
  /**
   * Convert the following objects into a {@link haystack.DateSpan | haystack::DateSpan}:
   * - `Func`: function which evaluates to date range
   * - `DateSpan`: return itself
   * - `Date`: one day range
   * - `Span`: return {@link haystack.Span.toDateSpan | haystack::Span.toDateSpan}
   * - `Str`: evaluates to {@link haystack.DateSpan.fromStr | haystack::DateSpan.fromStr}
   * - `Date..Date`: starting and ending date (inclusive)
   * - `Date..Number`: starting date and num of days (day unit
   *   required)
   * - `DateTime..DateTime`: use starting/ending dates; if end is
   *   midnight, then use previous date
   * - `Number`: convert as year
   * - null: use projMeta dateSpanDefault or default to today
   *   (deprecated)
   * 
   * Examples:
   * ```
   * toDateSpan(2010-07-01..2010-07-03)  >>  01-Jul-2010..03-Jul-2010
   * toDateSpan(2010-07-01..60day)       >>  01-Jul-2010..29-Aug-2010
   * toDateSpan(2010-07)                 >>  01-Jul-2010..31-Jul-2010
   * toDateSpan(2010)                    >>  01-Jan-2010..31-Dec-2010
   * toDateSpan(pastWeek) // on 9 Aug    >>  02-Aug-2010..09-Aug-2010
   * ```
   */
  static toDateSpan(x: sys.JsObj | null): haystack.DateSpan;
  /**
   * Reverse sort a list or grid.  This function works just like {@link sort | sort}
   * except sorts in reverse.
   */
  static sortr(val: sys.JsObj, sorter?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Get the path segments of a Uri as a list of Strs.
   */
  static uriPath(val: sys.Uri): sys.JsObj | null;
  /**
   * Return if an object is a Uri type
   */
  static isUri(val: sys.JsObj | null): boolean;
  /**
   * Convert a number to its string representation in the given
   * radix (base). If width is non-null, then leading zeroes are
   * prepended to ensure the specified width.
   * 
   * Example:
   * ```
   * 6.toRadix(2) => "110"
   * 255.toRadix(16, 4) => "00ff"
   * ```
   */
  static toRadix(val: haystack.Number, radix: haystack.Number, width?: haystack.Number | null): sys.JsObj | null;
  /**
   * Iterate the days of a span.  The `dates` argument may be any
   * object converted into a date range by {@link toDateSpan | toDateSpan}.
   * The given function is called with a `Date` argument for each
   * iterated day.
   * 
   * Example:
   * ```
   * f: day => echo(day)
   * eachDay(2010-07-01..2010-07-03, f) >> iterate Jul 1st, 2nd, 3rd
   * eachDay(2010-07, f)                >> iterate each day of July 2010
   * eachDay(pastWeek, f)               >> iterate last 7 days
   * ```
   */
  static eachDay(dates: sys.JsObj, fn: Fn): sys.JsObj | null;
  /**
   * Is number an ASCII alpha char: isUpper||isLower
   * 
   * Examples:
   * ```
   * isAlpha("A".get(0))  >>  true
   * isAlpha("a".get(0))  >>  true
   * isAlpha("8".get(0))  >>  false
   * isAlpha(" ".get(0))  >>  false
   * isAlpha("Ã".get(0))  >>  false
   * ```
   */
  static isAlpha(num: haystack.Number): boolean;
  /**
   * Return if regular expression matches entire region of `s`. See
   * [AxonUsage](https://fantom.org/doc/docHaxall/AxonUsage#regex).
   * 
   * Examples:
   * ```
   * reMatches(r"\d+", "x123y")  >>  false
   * reMatches(r"\d+", "123")    >>  true
   * ```
   */
  static reMatches(regex: sys.JsObj, s: string): boolean;
  /**
   * Add a column to a grid by mapping each row to a new cell
   * value. The `col` parameter may be a simple String name or may
   * be a dictionary which must have a "name" tag (any other tags
   * become column meta-data).  The mapping function takes `(row)`
   * and returns the new cell values for the column.
   * 
   * Examples:
   * ```
   * // add new column named areaMeter
   * readAll(site).addCol("areaMeters") s => s->area.to(1m²)
   * 
   * // add new column named areaMeter with dis meta
   * readAll(site).addCol({name:"areaMeters", dis:"Area Meters"}) s => s->area.to(1m²)
   * ```
   */
  static addCol(grid: haystack.Grid, col: sys.JsObj | null, fn: Fn): haystack.Grid;
  /**
   * Concatenate a list of items into a string.
   * 
   * Examples:
   * ```
   * [1, 2, 3].concat       >>  "123"
   * [1, 2, 3].concat(",")  >>  "1,2,3"
   * ```
   */
  static concat(list: sys.List, sep?: string): string;
  /**
   * Get the number of days in a given month.  The month
   * parameter may be:
   * - Date: returns number of days in given month (uses
   *   month/year, ignores day)
   * - Number 1-12: returns days in month for current year
   * - null: returns day in current month
   * 
   * Examples:
   * ```
   * numDaysInMonth()            >>>  days in current month
   * numDaysInMonth(1)           >>>  31day (days in January)
   * numDaysInMonth(6)           >>>  30day (days in June)
   * numDaysInMonth(2)           >>>  28day or 29day (days for Feb this year)
   * numDaysInMonth(2012-02-13)  >>>  29day (days in Feb for leap year)
   * ```
   */
  static numDaysInMonth(month?: sys.JsObj | null): haystack.Number;
  /**
   * Parse a Str into a Ref.  If the string is not a valid Ref
   * identifier then raise ParseErr or return null based on
   * checked flag.  If the string has a leading "@", then it is
   * stripped off before parsing.
   * 
   * Examples:
   * ```
   * parseRef("abc-123")
   * parseRef("@abc-123")
   * ```
   */
  static parseRef(val: string, dis?: sys.JsObj | null, checked?: boolean): haystack.Ref | null;
  /**
   * Iterate the items of a collection:
   * - Grid: iterate the rows as (row, index)
   * - List: iterate the items as (value, index)
   * - Dict: iterate the name/value pairs (value, name)
   * - Str: iterate the characters as numbers (char, index)
   * - Range: iterate the integer range (integer)
   * - Stream: iterate items as (val); see [docHaxall::Streams#each](https://fantom.org/doc/docHaxall/Streams#each)
   */
  static each(val: sys.JsObj, fn: Fn): sys.JsObj | null;
  /**
   * Return this string with the first character converted to
   * uppercase.  The case conversion is for ASCII only. Also see [decapitalize()](decapitalize())
   * and [upper()](upper()).
   * 
   * Examples:
   * ```
   * capitalize("apple")  >>  "Apple"
   * ```
   */
  static capitalize(val: string): string;
  /**
   * List tag definitions in the context namespace as Def[].
   */
  static tags(): sys.List<haystack.Def>;
  /**
   * Return a new grid with multiple columns renamed. Mapping
   * must be a dict of old to new names.  Old column names not
   * found are ignored.
   * 
   * Example:
   * ```
   * readAll(site).renameCols({dis:"title", geoAddr:"subtitle"})
   * ```
   */
  static renameCols(grid: haystack.Grid, mapping: haystack.Dict): haystack.Grid;
  /**
   * Fold a list or stream into a single value using given
   * folding function. The folding function signature must be `(val,
   * acc)` where val is the items being folded, and acc is an
   * accumulator used to maintain state between iterations. 
   * Lifecycle of a fold:
   * 1. Call `fn(foldStart, null)`, return initial accumulator state
   * 2. Call `fn(item, acc)` for every item, return new accumulator
   *   state
   * 3. Call `fn(foldEnd, acc)` return final result
   * 
   * See [docHaxall::Streams#fold](https://fantom.org/doc/docHaxall/Streams#fold)
   * for streaming details.
   * 
   * The fold will short-circuit and halt immediately if the
   * folding function returns [na()](na()) for the accumulator
   * state. The result of the fold is [na()](na()) in this case. 
   * A folding function should document its behavior when a
   * collection contains [na()](na()).
   * 
   * Built-in folding functions include:
   * - [count()](count())
   * - [sum()](sum())
   * - [avg()](avg())
   * - [min()](min())
   * - [max()](max())
   * - [mean()](mean())
   * - [median()](median())
   * - [rootMeanSquareErr()](rootMeanSquareErr())
   * - [meanBiasErr()](meanBiasErr())
   * - [standardDeviation()](standardDeviation())
   * 
   * Examples:
   * ```
   * [1, 2, 3, 4].fold(max)  // fold list into its max value
   * [1, 2, 3, 4].fold(avg)  // fold list into its average value
   * [1, 2, na(), 3].fold(sum) // => na()
   * ```
   * 
   * Example of writing your own custom fold function that used
   * start/end values and has support for na():
   * ```
   * average: (val, acc) => do
   *   if (val == foldStart()) return {sum:0, count:0}
   *   if (val == foldEnd()) return acc->sum / acc->count
   *   if (val == na()) return na()
   *   return {sum: acc->sum + val, count: acc->count + 1}
   * end
   * ```
   * 
   * Also see [reduce()](reduce()) which is easier to use if doing
   * your own simple rollup computation.
   */
  static fold(val: sys.JsObj | null, fn: Fn): sys.JsObj | null;
  /**
   * Return if `val` contains `x`:
   * - if `val` is Str, then `x` is substring.
   * - if `val` is List, then `x` is item to search.
   * - if `val` is Range, then is `x` inside the range inclusively
   * - if `val` is DateSpan, then is `x` a date in the span
   */
  static contains(val: sys.JsObj, x: sys.JsObj | null): boolean;
  /**
   * Return a new grid with the given column removed. If the
   * column doesn't exist, then return given grid. Also see [docHaxall::Streams#removeCol](https://fantom.org/doc/docHaxall/Streams#removeCol).
   */
  static removeCol(grid: sys.JsObj, col: sys.JsObj): sys.JsObj;
  /**
   * Get the current top-level function's tags.
   */
  static curFunc(): haystack.Dict;
  /**
   * Return if an object is a grid type
   */
  static isGrid(val: sys.JsObj | null): boolean;
  /**
   * Return number of items in str, list, or grid
   */
  static size(val: sys.JsObj | null): haystack.Number;
  /**
   * Get the meta-data from a grid or col as a dict.
   * 
   * Examples:
   * ```
   * read(temp).hisRead(today).meta             // grid meta
   * read(temp).hisRead(today).col("ts").meta   // column meta
   * ```
   */
  static meta(val: sys.JsObj | null): haystack.Dict;
  /**
   * Convert a number to a hexadecimal string.
   */
  static toHex(val: haystack.Number): sys.JsObj | null;
  /**
   * Return the unique items in a collection.  If val is a List
   * then return {@link sys.List.unique | sys::List.unique}.  If
   * val is a Grid then return {@link haystack.Grid.unique | haystack::Grid.unique}
   * where key must be a column name or list of column names.
   * 
   * Examples:
   * ```
   * [1, 1, 2, 2].unique                 >> [1, 2]
   * grid.unique("geoState")             >> unique states
   * grid.unique(["geoCity", geoState"]) >> city,state combos
   * ```
   */
  static unique(val: sys.JsObj, key?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Longitude of a Coord as a Number
   */
  static coordLng(coord: haystack.Coord): haystack.Number;
  /**
   * Return if Str ends with the specified Str.
   * 
   * Examples:
   * ```
   * "hi there".endsWith("there")   >>  true
   * "hi there".endsWith("hi")      >>  false
   * ```
   */
  static endsWith(val: string, sub: string): boolean;
  /**
   * Return if an object is a span
   */
  static isSpan(val: sys.JsObj | null): boolean;
  /**
   * Number of whole days in a span
   */
  static numDays(span: sys.JsObj | null): haystack.Number;
  /**
   * Return if the query portion of the a URI after question mark
   */
  static uriQueryStr(val: sys.Uri): string | null;
  /**
   * Fold multiple values into their numeric sum. Return null if
   * no values.
   */
  static sum(val: sys.JsObj | null, acc: sys.JsObj | null): sys.JsObj | null;
  /**
   * Add an additional Dict row to the end of a grid.
   * 
   * Example:
   * ```
   * readAll(site).addRow({dis:"New Row"})
   * ```
   */
  static addRow(grid: haystack.Grid, newRow: haystack.Dict): haystack.Grid;
  /**
   * Return this string with the first character converted to
   * lowercase.  The case conversion is for ASCII only. Also see [capitalize()](capitalize())
   * and [lower()](lower()).
   * 
   * Examples:
   * ```
   * decapitalize("Apple") >> "apple"
   * ```
   */
  static decapitalize(val: string): string;
  /**
   * Convert the following objects into a {@link haystack.Span | haystack::Span}:
   * - `Span`: return itself
   * - `Span+tz`: update timezone using same dates only if aligned to
   *   midnight
   * - `Str`: return {@link haystack.Span.fromStr | haystack::Span.fromStr}
   *   using current timezone
   * - `Str+tz`: return {@link haystack.Span.fromStr | haystack::Span.fromStr}
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
  static toSpan(x: sys.JsObj | null, tz?: string | null): haystack.Span;
  /**
   * Given an arbitrary object, translate it to a Grid via {@link haystack.Etc.toGrid | haystack::Etc.toGrid}:
   * - if grid just return it
   * - if row in grid of size, return row.grid
   * - if scalar return 1x1 grid
   * - if dict return grid where dict is only
   * - if list of dict return grid where each dict is row
   * - if list of non-dicts, return one col grid with rows for each
   *   item
   * 
   * Example:
   * ```
   * // create simple grid with dis,age cols and 3 rows:
   * [{dis:"Bob", age:30},
   *  {dis:"Ann", age:40},
   *  {dis:"Dan", age:50}].toGrid
   * ```
   */
  static toGrid(val: sys.JsObj | null, meta?: haystack.Dict | null): haystack.Grid;
  /**
   * Compare two numbers and return the smaller one.  This
   * function may also be used with {@link fold | fold} to return
   * the smallest number (or null if no values).  Note number
   * units are **not** checked nor considered for this comparison.
   * 
   * Examples:
   * ```
   * min(7, 4)            >>  4
   * [7, 2, 4].fold(min)  >>  2
   * ```
   */
  static min(val: sys.JsObj | null, acc: sys.JsObj | null): sys.JsObj | null;
  /**
   * Convert grid rows into a dict of name/val pairs.  The
   * name/value pairs are derived from each row using the given
   * functions.  The functions take `(row, index)`
   * 
   * Example:
   * ```
   * // create dict of sites with dis:area pairs
   * readAll(site).gridRowsToDict(s=>s.dis.toTagName, s=>s->area)
   * ```
   */
  static gridRowsToDict(grid: haystack.Grid, rowToKey: Fn, rowToVal: Fn): haystack.Dict;
  /**
   * Return if an integer is an odd number.
   */
  static isOdd(val: haystack.Number): sys.JsObj | null;
  /**
   * Return if an object is a Date type
   */
  static isDate(val: sys.JsObj | null): boolean;
  /**
   * Convert a scalar, list, or dict value to its Axon code
   * representation. Examples:
   * ```
   * toAxonCode(123)        =>   "123"
   * toAxonCode([1, 2, 3])  =>   "[1, 2, 3]"
   * toAxonCode({x:123})    =>   "{x:123}"
   * ```
   */
  static toAxonCode(val: sys.JsObj | null): sys.JsObj | null;
  /**
   * The fold end marker value
   */
  static foldEnd(): sys.JsObj | null;
  /**
   * Convert a unicode char number into a single char string
   * 
   * Examples:
   * ```
   * toChar(65)   >>  "A"
   * ```
   */
  static toChar(num: haystack.Number): string;
  /**
   * Set a collection item and return a new collection.
   * - List: set item by index key
   * - Dict: set item by key name
   */
  static set(val: sys.JsObj | null, key: sys.JsObj | null, item: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return if a timestamp is contained within a Date range.
   * Range may be any value supported by {@link toDateSpan | toDateSpan}.
   * Timestamp may be either a Date or a DateTime.  Also see {@link contains | contains}.
   * 
   * Examples:
   * ```
   * ts.occurred(thisWeek)
   * ts.occurred(pastMonth())
   * ts.occurred(2010-01-01..2010-01-15)
   * ```
   */
  static occurred(ts: sys.JsObj | null, range: sys.JsObj | null): sys.JsObj | null;
  /**
   * Parse a Str into a standardized unit name.  If the val is
   * not a valid unit name from the standard database then return
   * null or raise exception based on checked flag.
   * 
   * Examples:
   * ```
   * parseUnit("%")
   * parseUnit("percent")
   * ```
   */
  static parseUnit(val: string, checked?: boolean): string | null;
  /**
   * Write the str represenation of `x` to stdout and return `x`.
   */
  static _echo(x: sys.JsObj | null): sys.JsObj | null;
  /**
   * Reflectively call a function with the given arguments.  The
   * func may be a Str name or an expression that evaluates to a
   * function. Args is a positional list for each argument. 
   * Examples:
   * ```
   * call("today")
   * call("replace", ["hi there", "hi", "hello"])
   * call("parseDate", ["2021-03-15"])
   * call("parseDate", ["15-Mar-21", "DD-MMM-YY"])
   * call(parseDate, ["15-Mar-21", "DD-MMM-YY"])
   * call(parseDate(_, "DD-MMM-YY"), ["15-Mar-21"])
   * ```
   */
  static call(func: sys.JsObj, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Return current locale's start of weekday.  Weekday is
   * returned as integer from 0 (Sunday) to 6 (Saturday).
   */
  static startOfWeek(): haystack.Number;
  /**
   * Return absolute value of a number, if null return null
   */
  static abs(val: haystack.Number | null): sys.JsObj | null;
  /**
   * Add all the items to the end of a list and return a new
   * list.
   */
  static addAll(val: sys.JsObj | null, items: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return if an object is null
   */
  static isNull(val: sys.JsObj | null): boolean;
  /**
   * Convert a number to the given unit.  If the units are not of
   * the same dimension then an exception is raised.  The target
   * unit can be a string or a Number.  If target unit is a
   * Number, then the scalar value is ignored, but by convention
   * should be 1.  Also see [as()](as()) function to set a unit
   * without conversion.
   * 
   * Examples:
   * ```
   * 10kWh.to(1BTU)
   * 10kWh.to("BTU")
   * 75°F.to(1°C)
   * to(75°F, 1°C)
   * ```
   */
  static to(val: haystack.Number | null, unit: sys.JsObj | null): haystack.Number | null;
  /**
   * Find the given item in a list, and move it to the given
   * index.  All the other items are shifted accordingly. 
   * Negative indexes may used to access an index from the end of
   * the list.  If the item is not found then this is a no op. 
   * Return new list.
   * 
   * Examples:
   * ```
   * [10, 11, 12].moveTo(11, 0)  >>  [11, 10, 12]
   * [10, 11, 12].moveTo(11, -1) >>  [10, 12, 11]
   * ```
   */
  static moveTo(list: sys.List<sys.JsObj>, item: sys.JsObj | null, toIndex: haystack.Number): sys.List<sys.JsObj>;
  /**
   * Construct decoded {@link haystack.XStr | haystack::XStr}
   * instance
   */
  static xstr(type: string, val: string): sys.JsObj;
  /**
   * Get timezone as city name string in tzinfo database from
   * datetime. If the datetime is null then return the
   * environment default timezone.
   */
  static tz(dt?: sys.DateTime | null): sys.JsObj | null;
  /**
   * Get a column as a list of the cell values ordered by row.
   * Also see [rowToList()](rowToList()).
   * 
   * Example:
   * ```
   * readAll(site).colToList("dis")
   * ```
   */
  static colToList(grid: haystack.Grid, col: sys.JsObj): sys.List<sys.JsObj | null>;
  /**
   * DateSpan for this week as `sun..sat` (uses locale start of
   * week)
   */
  static thisWeek(): haystack.DateSpan;
  /**
   * Given an optional value return true if the SI metric system
   * should be used.  Return false if the United States customary
   * unit system should be used.  The following rules are used:
   * - if val is a dict with [geoCountry](geoCountry) return return
   *   false if "US"
   * - if number or rec with {@link unit | unit} and unit is known
   *   to be a US customary unit return false (right now we only
   *   check for °F and Δ°F)
   * - fallback to locale of hosting server, see {@link sys.Locale | sys::Locale}
   * 
   * Examples:
   * ```
   * isMetric({geoCountry:"US"})  >>  false
   * isMetric({geoCountry:"FR"})  >>  true
   * isMetric(75°F)               >>  false
   * isMetric({unit:"Δ°C"})       >>  true
   * isMetric()                   >>  fallback to server locale
   * ```
   */
  static isMetric(val?: sys.JsObj | null): boolean;
  /**
   * Parse a Str into a Bool, legal formats are "true" or "false.
   * If invalid format and checked is false return null,
   * otherwise throw ParseErr.
   * 
   * Examples:
   * ```
   * parseBool("true")
   * parseBool("bad", false)
   * ```
   */
  static parseBool(val: string, checked?: boolean): boolean | null;
  /**
   * Return the last match of `x` in `val` searching backward,
   * starting at the specified offset index.  A negative offset
   * may be used to access from the end of string.  Return null
   * if no occurences are found:
   * - if `val` is Str, then `x` is substring.
   * - if `val` is List, then `x` is item to search.
   */
  static indexr(val: sys.JsObj, x: sys.JsObj, offset?: haystack.Number): sys.JsObj | null;
  /**
   * DateSpan for month previous to this month `1..28-31`
   */
  static lastMonth(): haystack.DateSpan;
  /**
   * Return if `val` is the Number representation of not-a-number
   */
  static isNaN(val: sys.JsObj | null): boolean;
  /**
   * Parse a search string into a {@link haystack.Filter | Filter}
   * instance. The resulting filter can then be used with [read()](read()),
   * [readAll()](readAll()), [filter()](filter()), or [filterToFunc()](filterToFunc()).
   * 
   * The search string is one of the following free patterns:
   * - `*<glob>*` case insensitive glob with ? and * wildcards
   *   (default)
   * - `re:<regex>` regular expression
   * - `f:<filter>` haystack filter
   * 
   * See [docFresco::Nav#searching](https://fantom.org/doc/docFresco/Nav#searching)
   * for additional details on search syntax.
   * 
   * Examples:
   * ```
   * readAll(parseSearch("RTU-1"))
   * readAll(point).filter(parseSearch("RTU* Fan"))
   * ```
   */
  static parseSearch(val: string): haystack.Filter;
  /**
   * Is number is whitespace char: space \t \n \r \f
   * 
   * Examples:
   * ```
   * isSpace("x".get(0))   >>  false
   * isSpace(" ".get(0))   >>  true
   * isSpace("\n".get(0))  >>  true
   * ```
   */
  static isSpace(num: haystack.Number): boolean;
  /**
   * Return a new grid with keeps the given columns, but removes
   * all the others.  Columns can be Str names or Col instances.
   * Also see [docHaxall::Streams#keepCols](https://fantom.org/doc/docHaxall/Streams#keepCols).
   * 
   * Example:
   * ```
   * readAll(site).keepCols(["id", "area"])
   * ```
   */
  static keepCols(grid: sys.JsObj, cols: sys.List<sys.JsObj>): sys.JsObj;
  /**
   * Localize column display names.  For each col which does not
   * have an explicit dislay name, add a `dis` tag based on the
   * column name. Also see {@link haystack.Grid.colsToLocale | haystack::Grid.colsToLocale}
   * and [docSkySpark::Localization#tags](https://fantom.org/doc/docSkySpark/Localization#tags).
   */
  static colsToLocale(grid: haystack.Grid): haystack.Grid;
  /**
   * Get display string for dict or the given tag.  If `name` is
   * null, then return display text for the entire dict using {@link haystack.Etc.dictToDis | haystack::Etc.dictToDis}.
   * If `name` is non-null then format the tag value using its
   * appropiate `toLocale` method. Also see {@link haystack.Dict.dis | haystack::Dict.dis}.
   */
  static dis(dict: haystack.Dict | null, name?: string | null, def?: string | null): string;
  /**
   * Return if an object is not null
   */
  static isNonNull(val: sys.JsObj | null): boolean;
  /**
   * The fold start marker value
   */
  static foldStart(): sys.JsObj | null;
  /**
   * Return if an object is a boolean type
   */
  static isBool(val: sys.JsObj | null): boolean;
  /**
   * Return if the two numbers have the same unit.  If either of
   * the numbers if null return false.
   */
  static unitsEq(a: haystack.Number | null, b: haystack.Number | null): boolean;
  /**
   * If val is a Grid return if it has the given column name. If
   * val is a Dict return if the given name is mapped to a
   * non-null value.
   */
  static has(val: sys.JsObj | null, name: string): sys.JsObj | null;
  /**
   * Parse a Str into a Time.  If the string cannot be parsed
   * into a valid Time and checked is false then return null,
   * otherwise throw ParseErr. See {@link sys.Time.toLocale | sys::Time.toLocale}
   * for pattern.
   * 
   * Examples:
   * ```
   * parseTime("14:30", "h:mm")
   * parseTime("2:30pm", "k:mma")
   * parseTime("2:30:00pm", "k:mm:ssa")
   * ```
   */
  static parseTime(val: string, pattern?: string, checked?: boolean): sys.Time | null;
  /**
   * Get the host Uri as a string or null
   */
  static uriHost(val: sys.Uri): string | null;
  /**
   * Add item to the end of a list and return a new list.
   */
  static add(val: sys.JsObj | null, item: sys.JsObj | null): sys.JsObj | null;
  /**
   * Get the last item from an ordered collection or return null
   * if the collection is empty:
   * - list: item at index -1
   * - grid: item at index -1
   * - stream: last item; see [docHaxall::Streams#last](https://fantom.org/doc/docHaxall/Streams#last)
   */
  static last(val: sys.JsObj | null): sys.JsObj | null;
  /**
   * Fold multiple values into their total count Return zero if
   * no values.
   */
  static count(val: sys.JsObj, acc: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return if an object is a function type
   */
  static isFunc(val: sys.JsObj | null): boolean;
  /**
   * Given a grid return the types used in each column as a grid
   * with the following:
   * - `name`: string name of the column
   * - `kind`: all the different value kinds in the column separated
   *   by "|"
   * - `count`: total number of rows with column with a non-null
   *   value Also see [readAllTagNames](readAllTagNames).
   * 
   * Example:
   * ```
   * readAll(site).gridColKinds
   * ```
   */
  static gridColKinds(grid: haystack.Grid): haystack.Grid;
  /**
   * Join a list of grids into a single grid.  See {@link join | join}.
   */
  static joinAll(grids: sys.List<haystack.Grid>, joinColName: string): haystack.Grid;
  /**
   * DateSpan for week previous to this week `sun..sat` (uses
   * locale start of week)
   */
  static lastWeek(): haystack.DateSpan;
  /**
   * Map each item in a list or grid to zero or more new items as
   * a flattened result.
   * 
   * If mapping a list, the mapping should be a function that
   * takes `(val)` or `(val, index)`.  It should return the a list of
   * zero or more new values. See {@link sys.List.flatMap | sys::List.flatMap}.
   * 
   * If mapping a grid, the mapping function takes `(row)` or `(row,index)`
   * and returns a list of zero or more new Dict rows. See {@link haystack.Grid.flatMap | haystack::Grid.flatMap}.
   * 
   * If mapping a stream, the mapping functions takes `(val)`. See [docHaxall::Streams#flatMap](https://fantom.org/doc/docHaxall/Streams#flatMap).
   * 
   * Examples:
   * ```
   * [1, 2, 3].flatMap(v => [v, v+10])   >>  [1, 11, 2, 12, 3, 13]
   * ```
   */
  static flatMap(val: sys.JsObj, fn: Fn): sys.JsObj | null;
  /**
   * Evaluate an Axon string expression.  The evaluation happens
   * in a new scope and does not have access to the current scope
   * of local variables. Also see [call()](call()) and [toAxonCode()](toAxonCode()).
   * 
   * Examples:
   * ```
   * eval("2 + 2")
   * eval("now()")
   * ```
   */
  static eval(expr: string): sys.JsObj | null;
  /**
   * Get month as integer between 1 to 12 from date or datetime
   */
  static month(d: sys.JsObj): sys.JsObj | null;
  /**
   * Find the first match of regular expression in `s` or return
   * null if no matches. See [AxonUsage](https://fantom.org/doc/docHaxall/AxonUsage#regex).
   * 
   * Examples:
   * ```
   * reFind(r"\d+", "x123y")  >>  "123"
   * reFind(r"\d+", "xyz")    >>  null
   * ```
   */
  static reFind(regex: sys.JsObj, s: string): string | null;
  /**
   * Add grid b as a new set of columns to grid a.  If b contains
   * duplicate column names, then they are given auto-generated
   * unique names.  If b contains fewer rows then a, then the
   * missing cells are filled with null.
   * 
   * Examples:
   * ```
   * [{a:0, b:2}, {a:1, b:3}].toGrid.addCols({c:4}.toGrid)
   * readAll(rtu).addCols(readAll(meter))
   * ```
   */
  static addCols(a: haystack.Grid, b: haystack.Grid): haystack.Grid;
  /**
   * If val is a Col, get the column name.
   * 
   * Example:
   * ```
   * // get name of first column
   * readAll(site).cols.first.name
   * ```
   */
  static name(val: sys.JsObj | null): string;
  /**
   * Is number a digit in the specified radix.  A decimal radix
   * of ten returns true for 0-9.  A radix of 16 also returns
   * true for a-f and A-F.
   * 
   * Examples:
   * ```
   * isDigit("5".get(0))      >>  true
   * isDigit("A".get(0))      >>  false
   * isDigit("A".get(0), 16)  >>  true
   * ```
   */
  static isDigit(num: haystack.Number, radix?: haystack.Number): boolean;
  /**
   * Iterate the months of a span.  The `dates` argument may be any
   * object converted into a date range by {@link toDateSpan | toDateSpan}.
   * The given function is called with a `DateSpan` argument for
   * each interated month.
   * 
   * Examples:
   * ```
   * // iterate each month in 2010, and echo data range
   * eachMonth(2010) d => echo(d)
   * 
   * // call f once for current method
   * eachMonth(today(), f)
   * ```
   */
  static eachMonth(dates: sys.JsObj, fn: Fn): sys.JsObj | null;
  /**
   * List the lib definitions in the context namespace as Def[].
   */
  static libs(): sys.List<haystack.Def>;
  /**
   * Given a ref return {@link haystack.Ref.dis | haystack::Ref.dis}
   */
  static refDis(ref: haystack.Ref): string;
  /**
   * Return if an object is a Time type
   */
  static isTime(val: sys.JsObj | null): boolean;
  /**
   * DateSpan for this year `Jan-1..Dec-31`
   */
  static thisYear(): haystack.DateSpan;
  /**
   * Return if an integer is an even number.
   */
  static isEven(val: haystack.Number): sys.JsObj | null;
  /**
   * Parse a Str into a number with an option unit.  If invalid
   * format and checked is false return null, otherwise throw
   * ParseErr. Also see {@link parseInt | parseInt} and {@link parseFloat | parseFloat}
   * to parse basic integers and floating point numbers without a
   * unit.
   * 
   * Examples:
   * ```
   * parseNumber("123")
   * parseNumber("123kW")
   * parseNumber("123.567").format("#.000")
   * ```
   */
  static parseNumber(val: string, checked?: boolean): haystack.Number | null;
  /**
   * Given arbitrary string, convert to a safe tag name - see {@link haystack.Etc.toTagName | haystack::Etc.toTagName}
   */
  static toTagName(n: string): string;
  /**
   * Remove an item from a collection and return a new
   * collection.
   * - List: key is index to remove at
   * - Dict: key is tag name
   */
  static remove(val: sys.JsObj | null, key: sys.JsObj | null): sys.JsObj | null;
  /**
   * Parse a filter string into a {@link haystack.Filter | Filter}
   * instance. The resulting filter can then be used with [read()](read()),
   * [readAll()](readAll()), [filter()](filter()), or [filterToFunc()](filterToFunc()).
   * 
   * Example:
   * ```
   * str: "point and kw"
   * readAll(parseFilter(str))
   * ```
   */
  static parseFilter(val: string, checked?: boolean): sys.JsObj | null;
  /**
   * Create a new stream for the cell values of the given column.
   * See [docHaxall::Streams#streamCol](https://fantom.org/doc/docHaxall/Streams#streamCol).
   */
  static streamCol(grid: haystack.Grid, col: sys.JsObj): sys.JsObj;
  /**
   * Return yesterday's Date according to context's time zone
   */
  static yesterday(): sys.Date;
  /**
   * Set the unit of a number.  Unlike [to()](to()) function, no
   * conversion of the scalar of the number is performed.  The
   * target unit can be a unit string or a number in which case
   * the scalar value of the unit parameter is ignored (by
   * convention should be 1).
   * 
   * Examples:
   * ```
   * 75°F.as(1°C)
   * 75°F.as("°C")
   * ```
   */
  static _as(val: haystack.Number | null, unit: sys.JsObj | null): haystack.Number | null;
  /**
   * Return component definition.  The result is a grid where
   * each row corresponds to a cell and its associated meta data.
   * The grid meta is the function level meta data.
   * 
   * Example:
   * ```
   * compDef("compName")
   * ```
   */
  static compDef(name: sys.JsObj, checked?: boolean): haystack.Grid | null;
  /**
   * Fold multiple values into their standard average or
   * arithmetic mean.  This function is the same as [math::mean](mean).
   * Null values are ignored.  Return null if no values.
   * 
   * Example:
   * ```
   * [7, 2, 3].fold(avg)  >>  4
   * ```
   */
  static avg(val: sys.JsObj | null, acc: sys.JsObj | null): sys.JsObj | null;
  /**
   * Given a DateTime return Number of milliseconds since Unix
   * epoch. The epic is defined as 1-Jan-1970 UTC.  Also see {@link fromJavaMillis | fromJavaMillis}.
   */
  static toJavaMillis(dt: sys.DateTime): haystack.Number;
  /**
   * Return if the fragment identifier portion of the a URI after
   * hash symbol
   */
  static uriFrag(val: sys.Uri): string | null;
  /**
   * Return current DateTime according to context's time zone.
   * This function will use a cached version which is only
   * accurate to within 250ms (see {@link sys.DateTime.now | sys::DateTime.now}
   * for details). Also see [nowTicks()](nowTicks()) and [nowUtc()](nowUtc()).
   */
  static now(): sys.DateTime;
  /**
   * If val is a Grid return if it does not have given column
   * name. If val is a Dict, return if the given name is not
   * mapped to a non-null value.
   */
  static missing(val: sys.JsObj | null, name: string): sys.JsObj | null;
  /**
   * End value of a DateSpan, Span, or a range.
   */
  static end(val: sys.JsObj | null): sys.JsObj | null;
  /**
   * Get the columns from a grid as a list.
   * 
   * Example:
   * ```
   * // get name of first column
   * readAll(site).cols.first.name
   * ```
   */
  static cols(grid: haystack.Grid): sys.List<haystack.Col>;
  /**
   * Return a new grid with all the given columns removed.
   * Columns can be Str names or Col instances. Also see [docHaxall::Streams#removeCols](https://fantom.org/doc/docHaxall/Streams#removeCols).
   */
  static removeCols(grid: sys.JsObj, cols: sys.List<sys.JsObj>): sys.JsObj;
  /**
   * Return if two values are equivalent.  Unlike the standard `==`
   * operator this function will compare the contents of
   * collection values such as lists, dicts, and grids.  For
   * non-collection values, the result is the same as the `==`
   * operator.  This function does not work with lazy grids such
   * as hisRead result.
   */
  static _equals(a: sys.JsObj | null, b: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return current DateTime in UTC.  This function will use a 
   * cached version which is only accurate to within 250ms (see {@link sys.DateTime.nowUtc | sys::DateTime.nowUtc}
   * for details).  Also see [now()](now()) and [nowTicks()](nowTicks()).
   */
  static nowUtc(): sys.DateTime;
  /**
   * Return if a collection is empty: str, list, dict, or grid
   */
  static isEmpty(val: sys.JsObj | null): sys.JsObj | null;
  /**
   * Start value of a DateSpan, Span or a range.
   */
  static start(val: sys.JsObj | null): sys.JsObj | null;
  /**
   * Parse a Str into a integer number using the specified radix.
   * If invalid format and checked is false return null,
   * otherwise throw ParseErr. This string value *cannot* include a
   * unit (see parseNumber).
   * 
   * Examples:
   * ```
   * parseInt("123")
   * parseInt("afe8", 16)
   * parseInt("10010", 2)
   * ```
   */
  static parseInt(val: string, radix?: haystack.Number, checked?: boolean): haystack.Number | null;
  /**
   * Find a top-level function by name or by reference and return
   * its tags. If not found throw exception or return null based
   * on checked flag.
   * 
   * Example:
   * ```
   * func("readAll")
   * func(readAll)
   * ```
   */
  static func(name: sys.JsObj, checked?: boolean): haystack.Dict | null;
  /**
   * Return if an object is a ref type
   */
  static isRef(val: sys.JsObj | null): boolean;
  /**
   * DateSpan for year previous to this year `Jan-1..Dec-31`
   */
  static lastYear(): haystack.DateSpan;
  /**
   * Is number an ASCII lowercase alphabetic char: a-z
   * 
   * Examples:
   * ```
   * isUpper("a".get(0))  >>  true
   * isUpper("A".get(0))  >>  false
   * isUpper("5".get(0))  >>  false
   * ```
   */
  static isLower(num: haystack.Number): boolean;
  /**
   * Fold the values of the given column into a single value. The
   * folding function uses the same semantics as {@link fold | fold}.
   * 
   * Example:
   * ```
   * readAll(site).foldCol("area", sum)
   * ```
   */
  static foldCol(grid: haystack.Grid, colName: string, fn: Fn): sys.JsObj | null;
  /**
   * If val is a DateTime: get time portion of the timestamp. If
   * val is a Number: construct a time instance from hour,
   * minutes, secs (truncated to nearest second).
   * 
   * Examples:
   * ```
   * now().time      // current time
   * time(20, 45)    // same as 20:45
   * ```
   */
  static time(val: sys.JsObj, minutes?: haystack.Number | null, secs?: haystack.Number): sys.JsObj | null;
  /**
   * Evaluate an expression within a specific locale.  This
   * enables formatting and parsing of localized text using a
   * locale other than the default for the current context.
   * 
   * Examples:
   * ```
   * // format Date in German
   * localeUse("de", today().format)
   * 
   * // parse Date in German
   * localeUse("de", parseDate("01 Mär 2021", "DD MMM YYYY"))
   * ```
   */
  static localeUse(locale: Expr, expr: Expr): sys.JsObj | null;
  /**
   * Get the basename (last name in path without extension) of a
   * Uri as a string.
   */
  static uriBasename(val: sys.Uri): string | null;
  /**
   * Get the column names a list of strings.
   * 
   * Example:
   * ```
   * readAll(site).colNames
   * ```
   */
  static colNames(grid: haystack.Grid): sys.List<string>;
  /**
   * Given a DateTime or Date, return the day of the year.  The
   * result is a number between 1 and 365 (or 1 to 366 if a leap
   * year).
   */
  static dayOfYear(val: sys.JsObj): haystack.Number;
  /**
   * Get the URI extension of a Uri as a string or null.
   */
  static uriExt(val: sys.Uri): string | null;
  /**
   * List term definitions (tags and conjuncts) in the context
   * namespace as Def[].
   */
  static terms(): sys.List<haystack.Def>;
  /**
   * Return the Number representation of not-a-number
   */
  static nan(): haystack.Number;
  /**
   * Join two grids by column name.  Current implementation
   * requires:
   * - grids cannot have conflicting col names (other than join
   *   col)
   * - each row in both grids must have a unique value for join col
   * - grid level meta is merged
   * - join column meta is merged
   */
  static join(a: haystack.Grid, b: haystack.Grid, joinColName: string): haystack.Grid;
  /**
   * DateSpan for this month as `1st..28-31`
   */
  static thisMonth(): haystack.DateSpan;
  /**
   * Clamp the number val between the min and max.  If its less
   * than min then return min, if its greater than max return
   * max, otherwise return val itself.  The min and max must have
   * matching units or be unitless. The result is always in the
   * same unit as val.
   * 
   * Examples:
   * ```
   * 14.clamp(10, 20)     >>   14    // is between 10 and 20
   * 3.clamp(10, 20)      >>   10    // clamps to min 10
   * 73.clamp(10, 20)     >>   20    // clamps to max 20
   * 45°F.clamp(60, 80)   >>   60°F  // min/max can be unitless
   * ```
   */
  static clamp(val: haystack.Number, min: haystack.Number, max: haystack.Number): haystack.Number;
  /**
   * Trim whitespace only from the beginning of the string. See {@link trim | trim}
   * for definition of whitespace.
   * 
   * Examples:
   * ```
   * " abc ".trimStart  >>  "abc "
   * "abc".trimStart    >>  "abc"
   * ```
   */
  static trimStart(val: string): string;
  /**
   * Reduce a collection to a single value with the given reducer
   * function.  The given function is called with each item in
   * the collection along with a current *accumulation* value.  The
   * accumation value is initialized to `init` for the first item,
   * and for every subsequent item it is the result of the
   * previous item.  Return the final accumulation value.  Also
   * see {@link fold | fold} which is preferred if doing standard
   * rollup such as sum or average.
   * 
   * If working with a list, the function takes `(acc, val, index)`
   * and returns accumulation value
   * 
   * If working with a grid, the function takes `(acc, row, index)`
   * and returns accumulation value
   * 
   * If working with a stream, then function takes `(acc, val)` and
   * returns accumulation value  See [docHaxall::Streams#reduce](https://fantom.org/doc/docHaxall/Streams#reduce).
   * 
   * Examples:
   * ```
   * [2, 5, 3].reduce(0, (acc, val)=>acc+val)  >> 10
   * [2, 5, 3].reduce(1, (acc, val)=>acc*val)  >> 30
   * ```
   */
  static reduce(val: sys.JsObj, init: sys.JsObj | null, fn: Fn): sys.JsObj | null;
  /**
   * List all definitions in the context namespace as Def[].
   */
  static defs(): sys.List<haystack.Def>;
  /**
   * Convert grid columns into a dict of name/val pairs.  The
   * name/val paris are derived from each column using the given
   * functions.  The functions take `(col, index)`
   * 
   * Example:
   * ```
   * // create dict of column name to column dis
   * read(temp).hisRead(today).gridColsToDict(c=>c.name, c=>c.meta.dis)
   * ```
   */
  static gridColsToDict(grid: haystack.Grid, colToKey: Fn, colToVal: Fn): haystack.Dict;
  /**
   * Return if the URI path ends in a slash.
   */
  static uriIsDir(val: sys.Uri): boolean;
  /**
   * Return a new grid with column meta-data replaced by given
   * meta dict. If column not found, then return given grid. Also
   * see {@link addColMeta | addColMeta} and [docHaxall::Streams#setColMeta](https://fantom.org/doc/docHaxall/Streams#setColMeta).
   */
  static setColMeta(grid: sys.JsObj, name: string, meta: haystack.Dict): sys.JsObj;
  /**
   * Return if an object is a number type with a {@link haystack.Number.isDuration | time unit}
   */
  static isDuration(val: sys.JsObj | null): boolean;
  /**
   * Convert a char number or str to ASCII lower case. Also see [upper()](upper())
   * and [decapitalize()](decapitalize()).
   * 
   * Examples:
   * ```
   * lower("CAT")      >>  "cat"
   * lower("Cat")      >>  "cat"
   * lower(65).toChar  >>  "a"
   * ```
   */
  static lower(val: sys.JsObj): sys.JsObj | null;
  /**
   * Return the first match of `x` in `val` searching forward,
   * starting at the specified offset index.  A negative offset
   * may be used to access from the end of string.  Return null
   * if no occurences are found:
   * - if `val` is Str, then `x` is substring.
   * - if `val` is List, then `x` is item to search.
   */
  static index(val: sys.JsObj, x: sys.JsObj, offset?: haystack.Number): sys.JsObj | null;
  /**
   * Compute the great-circle distance between two Coords. The
   * result is a distance in meters using the haversine forumula.
   */
  static coordDist(c1: haystack.Coord, c2: haystack.Coord): haystack.Number;
  /**
   * Adding trailing slash to the URI.  See {@link sys.Uri.plusSlash | sys::Uri.plusSlash}
   */
  static uriPlusSlash(val: sys.Uri): sys.Uri;
  /**
   * Return current time as nanosecond ticks since 1 Jan 2000
   * UTC. Note that the 64-bit floating point representations of
   * nanosecond ticks will lose accuracy below the microsecond. 
   * Also see [now()](now()).
   */
  static nowTicks(): haystack.Number;
  /**
   * Insert a list of items at the given index and return a new
   * list.
   */
  static insertAll(val: sys.JsObj | null, index: haystack.Number, items: sys.JsObj | null): sys.JsObj | null;
  /**
   * Construct a DateTime from a date, time, and timezone name.
   * If timezone is null, use system default.
   */
  static dateTime(d: sys.Date, t: sys.Time, tz?: string | null): sys.JsObj | null;
  /**
   * Parse a Str into a Float.  Representations for infinity and
   * not-a-number are "-INF", "INF", "NaN".  If invalid format
   * and checked is false return null, otherwise throw ParseErr.
   * This string value *cannot* include a unit (see parseNumber).
   * 
   * Examples:
   * ```
   * parseFloat("123.456").format("0.000")
   * parseFloat("NaN")
   * parseFloat("INF")
   * ```
   */
  static parseFloat(val: string, checked?: boolean): haystack.Number | null;
  /**
   * Sort a grid by row display name - see {@link haystack.Grid.sortDis | haystack::Grid.sortDis}
   * 
   * Examples:
   * ```
   * // read all sites and sort by display name
   * readAll(site).sortDis
   * ```
   */
  static sortDis(val: haystack.Grid): sys.JsObj | null;
  /**
   * Parse a Str into a DateTime.  If the string cannot be parsed
   * into a valid DateTime and checked is false then return null,
   * otherwise throw ParseErr. See {@link sys.DateTime.toLocale | sys::DateTime.toLocale}
   * for pattern:
   * ```
   * YY     Two digit year             07
   * YYYY   Four digit year            2007
   * M      One/two digit month        6, 11
   * MM     Two digit month            06, 11
   * MMM    Three letter abbr month    Jun, Nov
   * MMMM   Full month                 June, November
   * D      One/two digit day          5, 28
   * DD     Two digit day              05, 28
   * DDD    Day with suffix            1st, 2nd, 3rd, 24th
   * WWW    Three letter abbr weekday  Tue
   * WWWW   Full weekday               Tuesday
   * V      One/two digit week of year 1,52
   * VV     Two digit week of year     01,52
   * VVV    Week of year with suffix   1st,52nd
   * h      One digit 24 hour (0-23)   3, 22
   * hh     Two digit 24 hour (0-23)   03, 22
   * k      One digit 12 hour (1-12)   3, 11
   * kk     Two digit 12 hour (1-12)   03, 11
   * m      One digit minutes (0-59)   4, 45
   * mm     Two digit minutes (0-59)   04, 45
   * s      One digit seconds (0-59)   4, 45
   * ss     Two digit seconds (0-59)   04, 45
   * SS     Optional seconds (only if non-zero)
   * f*     Fractional secs trailing zeros
   * F*     Fractional secs no trailing zeros
   * a      Lower case a/p for am/pm   a, p
   * aa     Lower case am/pm           am, pm
   * A      Upper case A/P for am/pm   A, P
   * AA     Upper case AM/PM           AM, PM
   * z      Time zone offset           Z, +03:00 (ISO 8601, XML Schema)
   * zzz    Time zone abbr             EST, EDT
   * zzzz   Time zone name             New_York
   * 'xyz'  Literal characters
   * ''     Single quote literal
   * ```
   * 
   * Examples:
   * ```
   * parseDateTime("2023-02-07 14:30", "YYYY-MM-DD hh:mm")
   * parseDateTime("2023-02-07 14:30", "YYYY-MM-DD hh:mm", "Paris")
   * parseDateTime("7/2/23 2:30pm", "D/M/YY k:mma")
   * parseDateTime("2023-02-07T14:30:00", "YYYY-MM-DD'T'hh:mm:ss")
   * ```
   */
  static parseDateTime(val: string, pattern?: string, tz?: string, checked?: boolean): sys.DateTime | null;
  /**
   * Get the list of values used by a given dict
   */
  static vals(dict: haystack.Dict): sys.JsObj | null;
  /**
   * Return the Number representation negative infinity
   */
  static negInf(): haystack.Number;
  /**
   * Skip the given number of items in a stream. See [docHaxall::Streams#skip](https://fantom.org/doc/docHaxall/Streams#skip).
   */
  static skip(stream: sys.JsObj | null, count: haystack.Number): sys.JsObj;
  /**
   * Convert a DateTime or Span to another timezone:
   * ```
   * now().toTimeZone("Chicago")
   * now().toTimeZone("UTC")
   * ```
   */
  static toTimeZone(val: sys.JsObj, tz: string): sys.JsObj | null;
  /**
   * Does the given Date or DateTime fall on Sat or Sun
   */
  static isWeekend(t: sys.JsObj): sys.JsObj | null;
  /**
   * List conjunct definitions in the context namespace as Def[].
   */
  static conjuncts(): sys.List<haystack.Def>;
  /**
   * Return if an object is a list type
   */
  static isList(val: sys.JsObj | null): boolean;
  /**
   * Construct a Coord from two Numbers in decimal degrees
   */
  static coord(lat: haystack.Number, lng: haystack.Number): haystack.Coord;
  /**
   * Return the percent encoded string for this Uri according to
   * RFC 3986. Each section of the Uri is UTF-8 encoded into
   * octects and then percent encoded according to its valid
   * character set. Spaces in the query section are encoded as `+`.
   * 
   * Examples:
   * ```
   * `foo bar`.uriEncode  >>  "foo%20bar"
   * ```
   */
  static uriEncode(val: sys.Uri): string;
  /**
   * Create new stream from given collection:
   * - Grid: stream the rows
   * - List: stream the items
   * - Range: stream inclusive range of integers See [docHaxall::Streams#stream](https://fantom.org/doc/docHaxall/Streams#stream).
   */
  static stream(val: sys.JsObj | null): sys.JsObj;
  /**
   * Get an item from a collection:
   * - str(num): get character at index as int (same semantics as
   *   Fantom)
   * - str(range): get string slice (same semantics as Fantom)
   * - list(num): get item at given index (same semantics as
   *   Fantom)
   * - list(range): get list slice at given index (same semantics
   *   as Fantom)
   * - dict(key): get item with given key or return null
   * - grid(num): get row at given index
   * - grid(range): {@link haystack.Grid.getRange | haystack::Grid.getRange}
   * 
   * The get function maybe be accessed using the `[]` shortcut
   * operator:
   * ```
   * list[3]  >>  list.get(3)
   * ```
   * 
   * See [docHaxall::AxonLang#getAndTrap](https://fantom.org/doc/docHaxall/AxonLang#getAndTrap).
   */
  static get(val: sys.JsObj | null, key: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return a list of the substrings captured by matching the
   * given regular operation against `s`.  Return null if no
   * matches.  The first item in the list is the entire match,
   * and each additional item is matched to `()` arguments in the
   * regex pattern. See [AxonUsage](https://fantom.org/doc/docHaxall/AxonUsage#regex).
   * 
   * Examples:
   * ```
   * re: r"(RTU|AHU)-(\d+)"
   * reGroups(re, "AHU")    >> null
   * reGroups(re, "AHU-7")  >> ["AHU-7", "AHU", "7"]
   * ```
   */
  static reGroups(regex: sys.JsObj, s: string): sys.JsObj | null;
  /**
   * Return if an object is a str type
   */
  static isStr(val: sys.JsObj | null): boolean;
  /**
   * Map list, dict, or grid by applying the given mapping
   * function.
   * 
   * If mapping a list, the mapping should be a function that
   * takes `(val)` or `(val, index)`.  It should return the new value
   * for that index.
   * 
   * If mapping a dict, the mapping should be a function that
   * takes `(val)` or `(val, name)`.  It should return the new value
   * for that name.
   * 
   * If mapping a grid, the mapping function takes `(row)` or `(row,index)`
   * and returns a new dictionary to use for the row.  The
   * resulting grid shares the original's grid level meta. 
   * Columns left intact share the old meta-data, new columns
   * have no meta-data.  If the mapping function returns null,
   * then that row is removed from the resulting grid (not
   * mapped).
   * 
   * If mapping a range, then the mapping function takes `(integer)`,
   * and returns a list for each mapped integer inte the range.
   * 
   * If mapping a stream, the mapping functions takes `(val)`. See [docHaxall::Streams#map](https://fantom.org/doc/docHaxall/Streams#map).
   * 
   * Examples:
   * ```
   * // create list adding ten to each number
   * [1, 2, 3].map(v => v+10)   >>   [11, 12, 13]
   * 
   * // create new list that turns strings into uppercase
   * ["ape", "bee", "cat"].map(upper)    // ["APE, "BEE", "CAT"]
   * 
   * // create dict adding ten to each value
   * {a:1, b:2, c:3}.map(v => v+10)   >>   {a:11, b:12, c:13}
   * 
   * // create grid with just dis, area column
   * readAll(site).map(s => {dis:s->dis, area:s->area})
   * ```
   */
  static map(val: sys.JsObj, fn: Fn): sys.JsObj | null;
  /**
   * Get the localized string for the given tag name or qualified
   * name. If the key is formatted as "pod::name" then route to {@link sys.Env.locale | sys::Env.locale},
   * otherwise to {@link haystack.Etc.tagToLocale | haystack::Etc.tagToLocale}.
   */
  static toLocale(key: string): string;
  /**
   * Compare two numbers and return the larger one.  This
   * function may also be used with {@link fold | fold} to return
   * the largest number (or null if no values).  Note number
   * units are **not** checked nor considered for the comparison.
   * 
   * Examples:
   * ```
   * max(7, 4)            >>  7
   * [7, 2, 4].fold(max)  >>  7
   * ```
   */
  static max(val: sys.JsObj | null, acc: sys.JsObj | null): sys.JsObj | null;
  /**
   * Given an absolute ref, return its project name.  If the ref
   * is not formatted as "p:proj:r:xxx", then raise an exception
   * or return null based on the checked flag:
   * 
   * Examples:
   * ```
   * refProjName(@p:demo:r:xxx)   >>  "demo"
   * refProjName(@r:xxx)          >>  raises exception
   * refProjName(@r:xxx, false)   >>  null
   * ```
   */
  static refProjName(ref: haystack.Ref, checked?: boolean): string | null;
  /**
   * Return if a year is a leap year. Year must be four digit
   * Number such as 2020.
   */
  static isLeapYear(year: haystack.Number): boolean;
  /**
   * Apply a [filter](https://fantom.org/doc/docHaystack/Filters)
   * expression to a collection of dicts.  The collection value
   * may be any of the following:
   * - Grid: returns new grid with filtered rows
   * - Dict[]: returns list of filtered dicts (nulls are filtered
   *   out)
   * - Col[]: returns list of columns filtered by their meta
   * - Stream: filters stream of Dicts - see [docHaxall::Streams#filter](https://fantom.org/doc/docHaxall/Streams#filter)
   * 
   * The filter parameter may one fo the following:
   * - Axon expression which maps to a filter
   * - Filter from [parseFilter()](parseFilter())
   * - Filter from [parseSearch()](parseSearch())
   * 
   * Examples:
   * ```
   * // apply to a list of dicts
   * [{v:1}, {v:2}, {v:3}, {v:4}].filter(v >= 3)
   * 
   * // apply to a grid and return new grid with matching rows
   * readAll(equip).filter(meter)
   * 
   * // apply to a list of columns
   * read(ahu).toPoints.hisRead(yesterday).cols.filter(kind=="Bool")
   * 
   * // apply to a stream of dicts
   * readAllStream(equip).filter(siteMeter and elec and meter).collect
   * 
   * // apply search filter
   * readAll(equip).filter(parseSearch("RTU-1"))
   * ```
   */
  static filter(val: Expr, filterExpr: Expr): sys.JsObj;
  /**
   * Get the scheme of a Uri as a string or null
   */
  static uriScheme(val: sys.Uri): string | null;
  /**
   * Get the list of names used by a given dict
   */
  static names(dict: haystack.Dict): sys.JsObj | null;
  /**
   * Parse a string into a Uri instance.  If the string cannot be
   * parsed into a valid Uri and checked is false then return
   * null, otherwise throw ParseErr.  This function converts an
   * URI from *standard form*. Use {@link uriDecode | uriDecode} to
   * convert a string from *escaped form*.  See {@link sys.Uri | sys::Uri}
   * for a detailed discussion on standard and escaped forms.
   * 
   * Examples:
   * ```
   * "foo bar".parseUri     >>  `foo bar`
   * "foo%20bar".uriDecode  >>  `foo bar`
   * ```
   */
  static parseUri(val: string, checked?: boolean): sys.Uri | null;
  /**
   * Return if an object is a DateTime type
   */
  static isDateTime(val: sys.JsObj | null): boolean;
  /**
   * Get a relative display name.  If the child display name
   * starts with the parent, then we can strip that as the common
   * suffix.  Parent and child must be either a Dict or a Str.
   */
  static relDis(parent: sys.JsObj, child: sys.JsObj): string;
  /**
   * Iterate the items of a collection until the given function
   * returns non-null.  Once non-null is returned, then break the
   * iteration and return the resulting object.  Return null if
   * the function returns null for every item.
   * - Grid: iterate the rows as (row, index)
   * - List: iterate the items as (val, index)
   * - Dict: iterate the name/value pairs (val, name)
   * - Str: iterate the characters as numbers (char, index)
   * - Range: iterate the integer range (integer)
   * - Stream: iterate items as (val); see [docHaxall::Streams#eachWhile](https://fantom.org/doc/docHaxall/Streams#eachWhile)
   */
  static eachWhile(val: sys.JsObj, fn: Fn): sys.JsObj | null;
  /**
   * Function for the `->` operator.  If the given value is a dict,
   * then get a value by name, or throw UnknownNameErr if name
   * not mapped. If the value is a Ref, then perform a checked `readById`,
   * then perform the name lookup.
   * 
   * The trap function maybe be accessed using the `->` shortcut
   * operator:
   * ```
   * dict->foo  >>>  dict.trap("foo")
   * ```
   * 
   * See [docHaxall::AxonLang#getAndTrap](https://fantom.org/doc/docHaxall/AxonLang#getAndTrap).
   */
  static _trap(val: sys.JsObj | null, name: string): sys.JsObj | null;
  /**
   * Get the first item from an ordered collection or return null
   * if the collection is empty:
   * - list: item at index 0
   * - grid: first frow
   * - stream: first item; see [docHaxall::Streams#first](https://fantom.org/doc/docHaxall/Streams#first)
   */
  static first(val: sys.JsObj | null): sys.JsObj | null;
  /**
   * If val is a DateTime: get date portion of the timestamp. If
   * val is a Number: construct a date instance from year, month,
   * day
   * 
   * Examples:
   * ```
   * now().date         // same as today()
   * date(2010, 12, 1)  // same as 2010-12-01
   * ```
   */
  static date(val: sys.JsObj, month?: haystack.Number | null, day?: haystack.Number | null): sys.JsObj | null;
  /**
   * Get a column by its name.  If not resolved then return null
   * or throw UnknownNameErr based on checked flag.
   * 
   * Example:
   * ```
   * // get meta data for given columm
   * read(temp).hisRead(today).col("ts").meta
   * ```
   */
  static col(grid: haystack.Grid, name: string, checked?: boolean): haystack.Col | null;
  /**
   * Return a new grid with additional column meta-data. If
   * column not found, then return given grid. Column meta is
   * added using {@link merge | merge} conventions.  Also see {@link setColMeta | setColMeta}
   * and [docHaxall::Streams#addColMeta](https://fantom.org/doc/docHaxall/Streams#addColMeta).
   */
  static addColMeta(grid: sys.JsObj, name: string, meta: haystack.Dict): sys.JsObj;
  /**
   * Get the first day of given date's month. Also see [lastOfMonth()](lastOfMonth()).
   * 
   * Example:
   * ```
   * 2009-10-28.firstOfMonth  >>  2009-10-01
   * ```
   */
  static firstOfMonth(date: sys.Date): sys.Date;
  /**
   * Get an item from a str, list, or grid safely when an index
   * is out of bounds:
   * - str(num): get a character at index or null if index invalid
   * - str(range): get safe slice or "" if entire range invalid
   * - list(num): get item at given index or null is index invalid
   * - list(range): get list slice with safe index
   * - grid(num): get row at given index or null if index invalid
   * - grid(range): {@link haystack.Grid.getRange | haystack::Grid.getRange}
   *   with safe range
   */
  static getSafe(val: sys.JsObj | null, key: sys.JsObj | null): sys.JsObj | null;
  /**
   * String replace of all occurrences of `from` with `to`. All three
   * parameters must be strings.
   * 
   * Examples:
   * ```
   * "hello".replace("hell", "t")  >>  "to"
   * "aababa".replace("ab", "-")   >>  "a--a"
   * ```
   */
  static replace(val: string, from$: string, to: string): string;
  /**
   * Get a grid row as a list of cells.  Sparse cells are
   * included as null. Also see [colToList()](colToList()).
   * 
   * Example:
   * ```
   * readAll(equip).first.rowToList
   * ```
   */
  static rowToList(row: haystack.Row): sys.List<sys.JsObj | null>;
  /**
   * If val is a list return it, otherwise return `[val]`.
   */
  static toList(val: sys.JsObj | null): sys.List<sys.JsObj | null>;
  /**
   * Trim whitespace only from the end of the string. See {@link trim | trim}
   * for definition of whitespace.
   * 
   * Examples:
   * ```
   * " abc ".trimEnd  >>  " abc"
   * "abc".trimEnd    >>  "abc"
   * ```
   */
  static trimEnd(val: string): string;
  /**
   * Get seconds of the time as integer between 0 to 59 from time
   * or datetime
   */
  static second(t: sys.JsObj): sys.JsObj | null;
  /**
   * Flatten a list to a single level.  If given a list of grids,
   * then flatten rows to a single grid.  Also see {@link sys.List.flatten | sys::List.flatten}
   * and {@link haystack.Etc.gridFlatten | haystack::Etc.gridFlatten}.
   * 
   * Examples:
   * ```
   * // flatten a list of numbers
   * [1, [2, 3], [4, [5, 6]]].flatten  >>  [1, 2, 3, 4, 5, 6]
   * 
   * // flatten a list of grids
   * ["Carytown", "Gaithersburg"].map(n=>readAll(siteRef->dis==n)).flatten
   * ```
   */
  static flatten(list: sys.List): sys.JsObj;
  /**
   * Return a new grid with the given column renamed.
   * 
   * Example:
   * ```
   * readAll(site).renameCol("dis", "title")
   * ```
   */
  static renameCol(grid: haystack.Grid, oldName: string, newName: string): haystack.Grid;
  /**
   * Add an list of rows to the end of a grid. The newRows may be
   * expressed as list of Dict or a Grid.
   * 
   * Example:
   * ```
   * readAll(site).addRows(readAll(equip))
   * ```
   */
  static addRows(grid: haystack.Grid, newRows: sys.JsObj): haystack.Grid;
  /**
   * Split a string by the given separator and trim whitespace.
   * If `sep` is null then split by any whitespace char; otherwise
   * it must be exactly one char long.  See {@link sys.Str.split | sys::Str.split}
   * for detailed behavior.
   * 
   * Options:
   * - noTrim: disable auto-trim of whitespace from start and end
   *   of tokens
   * 
   * Examples:
   * ```
   * "a b c".split                   >>  ["a", "b", "c"]
   * "a,b,c".split(",")              >>  ["a", "b", "c"]
   * "a, b, c".split(",")            >>  ["a", "b", "c"]
   * "a, b, c".split(",", {noTrim})  >>  ["a", " b", " c"]
   * ```
   */
  static split(val: string, sep?: string | null, opts?: haystack.Dict | null): sys.JsObj | null;
  /**
   * DateSpan for this 3 month quarter
   */
  static thisQuarter(): haystack.DateSpan;
  /**
   * Find the first matching item in a list or grid by applying
   * the given filter function.  If no match is found return
   * null.
   * 
   * If working with a list, the filter should be a function that
   * takes `(val)` or `(val, index)`.  It should return true to match
   * and return the item.
   * 
   * If working with a dict, the filter should be a function that
   * takes `(val)` or `(val, name)`.  It should return true to match
   * and return the item.
   * 
   * If working with a grid, the filter function takes `(row)` or `(row,
   * index)` and returns true to match and return the row.
   * 
   * If working with a stream, the filter takes `(val)` and returns
   * true to match.  See [docHaxall::Streams#find](https://fantom.org/doc/docHaxall/Streams#find).
   * 
   * Examples:
   * ```
   * // find first string longer than 3 chars
   * ["ape", "bat", "charlie", "dingo"].find(x => x.size > 3)
   * 
   * // find first odd number
   * [10, 4, 3, 7].find(isOdd)
   * ```
   */
  static find(val: sys.JsObj, fn: Fn): sys.JsObj | null;
  /**
   * Return if an object is a number type
   */
  static isNumber(val: sys.JsObj | null): boolean;
  /**
   * Truncate stream after given limit is reached. See [docHaxall::Streams#limit](https://fantom.org/doc/docHaxall/Streams#limit).
   */
  static limit(stream: sys.JsObj | null, limit: haystack.Number): sys.JsObj;
  /**
   * DateSpan for last 30days `today-30days..today`
   */
  static pastMonth(): haystack.DateSpan;
  /**
   * Return the Number representation positive infinity
   */
  static posInf(): haystack.Number;
  /**
   * Get day of month as integer between 1 to 31 from date or
   * datetime.
   */
  static day(d: sys.JsObj): sys.JsObj | null;
  /**
   * Return if all the items in a list, dict, or grid match the
   * given test function.  If the collection is empty, then
   * return true.
   * 
   * If working with a list, the function takes `(val)` or `(val,
   * index)` and returns true or false.
   * 
   * If working with a dict, the function takes `(val)` or `(val,
   * name)` and returns true or false.
   * 
   * If working with a grid, the function takes `(row)` or `(row,
   * index)` and returns true or false.
   * 
   * If working with a string, the function takes `(char)` or `(char,
   * index)` and returns true or false.
   * 
   * If working with a stream, then function takes `(val)` and
   * returns true or false.  See [docHaxall::Streams#all](https://fantom.org/doc/docHaxall/Streams#all).
   * 
   * Examples:
   * ```
   * [1, 3, 5].all v => v.isOdd  >>  true
   * [1, 3, 6].all(isOdd)        >>  false
   * ```
   */
  static all(val: sys.JsObj, fn: Fn): sys.JsObj | null;
  /**
   * Return if the given string is legal tag name - see {@link haystack.Etc.isTagName | haystack::Etc.isTagName}
   */
  static isTagName(n: string): boolean;
  /**
   * Return if an object is a dict type
   */
  static isDict(val: sys.JsObj | null): boolean;
  /**
   * Is number an ASCII alpha-numeric char: isAlpha||isDigit
   * 
   * Examples:
   * ```
   * isAlphaNum("A".get(0))  >>  true
   * isAlphaNum("a".get(0))  >>  true
   * isAlphaNum("8".get(0))  >>  true
   * isAlphaNum(" ".get(0))  >>  false
   * isAlphaNum("Ã".get(0))  >>  false
   * ```
   */
  static isAlphaNum(num: haystack.Number): boolean;
  /**
   * Get the port of a Uri as a Number or null
   */
  static uriPort(val: sys.Uri): haystack.Number | null;
  /**
   * Format an object using the current locale and specified
   * format pattern.  Formatting patterns follow Fantom toLocale
   * conventions:
   * - {@link sys.Bool.toLocale | sys::Bool.toLocale}
   * - {@link haystack.Number.toLocale | haystack::Number.toLocale}
   * - {@link sys.Date.toLocale | sys::Date.toLocale}
   * - {@link sys.Time.toLocale | sys::Time.toLocale}
   * - {@link sys.DateTime.toLocale | sys::DateTime.toLocale} If `toLocale`
   *   method is found, then return `val.toStr`
   * 
   * Examples:
   * ```
   * 123.456kW.format                 >>  123kW
   * 123.456kW.format("#.0")          >>  123.5kW
   * today().format("D-MMM-YYYY")     >>  8-Feb-2023
   * today().format("DDD MMMM YYYY")  >>  8th February 2023
   * now().format("D-MMM hh:mm")      >>  08-Feb 14:50
   * now().format("DD/MM/YY k:mmaa")  >>  08/02/23 2:50pm
   * ```
   */
  static format(val: sys.JsObj | null, pattern?: string | null): string;
  /**
   * Sort a list or grid.
   * 
   * If sorting a list, the sorter should be a function that
   * takes two list items and returns -1, 0, or 1 (typicaly done
   * with the `<=>` operator.  If no sorter is passed, then the
   * list is sorted by its natural ordering.
   * 
   * If sorting a grid, the sorter can be a column name or a
   * function.  If a function, it should take two rows and return
   * -1, 0, or 1.
   * 
   * Examples:
   * ```
   * // sort string list
   * ["bear", "cat", "apple"].sort
   * 
   * // sort string list by string size
   * ["bear", "cat", "apple"].sort((a,b) => a.size <=> b.size)
   * 
   * // sort sites by area
   * readAll(site).sort((a, b) => a->area <=> b->area)
   * ```
   */
  static sort(val: sys.JsObj, sorter?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Latitude of a Coord as a Number
   */
  static coordLat(coord: haystack.Coord): haystack.Number;
  /**
   * DateSpan for last 7 days as `today-7days..today`
   */
  static pastWeek(): haystack.DateSpan;
  /**
   * Get the path a Uri as a string.
   */
  static uriPathStr(val: sys.Uri): string | null;
  /**
   * Given a number return its unit string or null. If the val is
   * null, then return null.
   */
  static unit(val: haystack.Number | null): string | null;
  /**
   * Get NA not-available singleton {@link haystack.NA.val | haystack::NA.val}
   */
  static na(): haystack.NA;
  /**
   * Parse a Str into a Date.  If the string cannot be parsed
   * into a valid Date and checked is false then return null,
   * otherwise throw ParseErr. See {@link sys.Date.toLocale | sys::Date.toLocale}
   * for pattern.
   * 
   * Examples:
   * ```
   * parseDate("7-Feb-23", "D-MMM-YY")
   * parseDate("07/02/23", "DD/MM/YY")
   * parseDate("7 february 2023", "D MMMM YYYY")
   * parseDate("230207", "YYMMDD")
   * ```
   */
  static parseDate(val: string, pattern?: string, checked?: boolean): sys.Date | null;
  /**
   * Get the marker value singleton {@link haystack.Marker.val | haystack::Marker.val}
   */
  static marker(): haystack.Marker;
  /**
   * Parse an ASCII percent encoded string into a Uri according
   * to RFC 3986. All %HH escape sequences are translated into
   * octects, and then the octect sequence is UTF-8 decoded into
   * a Str. The `+` character in the query section is unescaped
   * into a space. If checked if true then throw ParseErr if the
   * string is a malformed URI or if not encoded correctly,
   * otherwise return null.  Use {@link parseUri | parseUri} to
   * parse from standard form.  See {@link sys.Uri | sys::Uri} for
   * a detailed discussion on standard and encoded forms.
   * 
   * Examples:
   * ```
   * "foo bar".parseUri     >>  `foo bar`
   * "foo%20bar".uriDecode  >>  `foo bar`
   * ```
   */
  static uriDecode(val: string, checked?: boolean): sys.Uri;
  /**
   * Return if given string is an Axon keyword
   */
  static isKeyword(val: string): boolean;
  /**
   * Get the name Str of a Uri (last item in path).
   */
  static uriName(val: sys.Uri): string | null;
  /**
   * Replace every grid cell with the given `from` value with the `to`
   * value. The resulting grid has the same grid and col meta. 
   * Replacement comparison is by via equality via `==` operator,
   * so it will only replace scalar values or null.
   * 
   * Example:
   * ```
   * grid.gridReplace(null, 0)   // replace all null cells with zero
   * grid.gridReplace(na(), 0)   // replace all NA cells with zero
   * ```
   */
  static gridReplace(grid: haystack.Grid, from$: sys.JsObj | null, to: sys.JsObj | null): haystack.Grid;
  /**
   * Collect stream into a in-memory list or grid. See [docHaxall::Streams#collect](https://fantom.org/doc/docHaxall/Streams#collect).
   */
  static collect(stream: sys.JsObj | null, to?: Fn | null): sys.JsObj;
  /**
   * Return new grid with additional grid level meta-data tags.
   * Tags are added using {@link merge | merge} conventions.  Also
   * see {@link setMeta | setMeta} and [docHaxall::Streams#addMeta](https://fantom.org/doc/docHaxall/Streams#addMeta).
   * 
   * Example:
   * ```
   * read(temp).hisRead(today).addMeta({view:"table"})
   * ```
   */
  static addMeta(grid: sys.JsObj, meta: haystack.Dict): sys.JsObj;
  /**
   * Return if a DateTime is in daylight saving time.  For the
   * given DateTime and its specific timezone, return true if the
   * time is in daylight savings time or false if standard time.
   */
  static dst(dt: sys.DateTime): boolean;
  /**
   * Insert an item into a list at the given index and return a
   * new list.
   */
  static insert(val: sys.JsObj | null, index: haystack.Number, item: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return new grid with grid level meta-data replaced by given
   * meta Dict.  Also see {@link addMeta | addMeta} and [docHaxall::Streams#setMeta](https://fantom.org/doc/docHaxall/Streams#setMeta).
   * 
   * Example:
   * ```
   * read(temp).hisRead(today).setMeta({view:"table"})
   * ```
   */
  static setMeta(grid: sys.JsObj, meta: haystack.Dict): sys.JsObj;
  /**
   * Call the specified function the given number of times
   * passing the counter.
   */
  static times(times: haystack.Number, fn: Fn): sys.JsObj | null;
  /**
   * Get the last day of the date's month. Also see [firstOfMonth()](firstOfMonth()).
   * 
   * Example:
   * ```
   * 2009-10-28.lastOfMonth  >>  2009-10-31
   * ```
   */
  static lastOfMonth(date: sys.Date): sys.Date;
  /**
   * Get hour of day as integer between 0 to 23 from time or
   * datetime
   */
  static hour(t: sys.JsObj): sys.JsObj | null;
  /**
   * Return today's Date according to context's time zone
   */
  static today(): sys.Date;
  /**
   * Find all matches of the regular expression in `s`. Returns an
   * empty list of there are no matches.
   * 
   * Examples:
   * ```
   * reFindAll(r"-?\d+\.?\d*", "foo, 123, bar, 456.78, -9, baz")
   *   >> ["123", "456.78", "-9"]
   * reFindAll(r"\d+", "foo, bar, baz")
   *   >> [,]
   * ```
   */
  static reFindAll(regex: sys.JsObj, s: string): sys.List<string>;
  static make(...args: unknown[]): CoreLib;
  /**
   * Given a grid of records, assign new ids and swizzle all
   * internal ref tags.  Each row of the grid must have an `id`
   * tag.  A new id is generated for each row, and any Ref tags
   * which used one of the old ids is replaced with the new id. 
   * This function is handy for copying graphs of recs such as
   * site/equip/point trees.
   */
  static swizzleRefs(grid: haystack.Grid): haystack.Grid;
  /**
   * DateSpan for this past `today-365days..today`
   */
  static pastYear(): haystack.DateSpan;
  /**
   * Fold a set of columns in each row into a new folded column
   * and return a new grid.  The columns to fold are selected by
   * the `colSelector` function and removed from the result.  The
   * selector may be a list of string names or a function which
   * takes a Col and returns true to select it.  The folding
   * function uses same semantics as {@link fold | fold}.
   * 
   * Example:
   * ```
   * // consider grid 'g' with the following structure:
   * a    b    c
   * ---  ---  ---
   * 1    10   100
   * 2    20   200
   * 
   * // foldCols, add b and c together to create new bc column
   * g.foldCols(["b", "c"], "bc", sum)
   * 
   * // yields this grid:
   * a    bc
   * ---  ---
   * 1    110
   * 2    220
   * 
   * // we could also replace list of col names with a function
   * colSel: col => col.name == "b" or col.name == "c"
   * g.foldCols(colSel, "bc", sum)
   * ```
   */
  static foldCols(grid: haystack.Grid, colSelector: sys.JsObj, newColName: string, fn: Fn): haystack.Grid;
  /**
   * Return if any the items in a list, dict, or grid match the
   * given test function.  If the collection is empty, then
   * return false.
   * 
   * If working with a list, the function takes `(val)` or `(val,
   * index)` and returns true or false.
   * 
   * If working with a dict, the function takes `(val)` or `(val,
   * name)` and returns true or false.
   * 
   * If working with a grid, the function takes `(row)` or `(row,
   * index)` and returns true or false.
   * 
   * If working with a string, the function takes `(char)` or `(char,
   * index)` and returns true or false.
   * 
   * If working with a stream, then function takes `(val)` and
   * returns true or false.  See [docHaxall::Streams#any](https://fantom.org/doc/docHaxall/Streams#any).
   * 
   * Examples:
   * ```
   * [1, 3, 5].any v => v.isOdd  >>  true
   * [2, 4, 6].any(isOdd)        >>  false
   * ```
   */
  static any(val: sys.JsObj, fn: Fn): sys.JsObj | null;
  /**
   * Fold multiple values to compute the difference between the
   * max and min value. Return null if no values.
   * 
   * Example:
   * ```
   * [7, 2, 3].fold(spread)  >>  5
   * ```
   */
  static spread(val: sys.JsObj | null, acc: sys.JsObj | null): sys.JsObj | null;
  /**
   * Get minutes of the time as integer between 0 to 59 from time
   * or datetime
   */
  static minute(t: sys.JsObj): sys.JsObj | null;
  /**
   * Return if an object is a grid that conforms to the {@link haystack.Grid.isHisGrid | history
   * grid shape}
   */
  static isHisGrid(val: sys.JsObj | null): boolean;
  /**
   * Convert a [filter](https://fantom.org/doc/docHaystack/Filters)
   * expression to a function which maybe used with {@link findAll | findAll}
   * or {@link find | find}.  The returned function accepts one
   * Dict parameter and returns true/false if the Dict is matched
   * by the filter.  Also see [filter()](filter()) and [parseFilter()](parseFilter()).
   * 
   * Examples:
   * ```
   * // filter for dicts with 'equip' tag
   * list.findAll(filterToFunc(equip))
   * 
   * // filter rows with an 'area' tag over 10,000
   * grid.findAll(filterToFunc(area > 10_000))
   * ```
   */
  static filterToFunc(filterExpr: Expr): Fn;
  /**
   * Generate a new unique Ref identifier
   */
  static refGen(): haystack.Ref;
  /**
   * Perform a matrix transpose on the grid.  The cells of the
   * first column because the display names for the new columns.
   * Columns 1..n become the new rows.
   * 
   * Example:
   * ```
   * readAll(site).transpose
   * ```
   */
  static transpose(grid: haystack.Grid): haystack.Grid;
  /**
   * Find all the top-levels functions in the current project
   * which match the given filter. If the filter is omitted then
   * return all the functions declared in the current project.
   * The function tags are returned.
   * 
   * Examples:
   * ```
   * funcs()              // all functions
   * funcs(sparkRule)     // match filter
   * ```
   */
  static funcs(filterExpr?: Expr): haystack.Grid;
  /**
   * Return a new grid with the columns reordered.  The given
   * list of names represents the new order and must contain the
   * same current column names.  Any columns not specified are
   * removed.  Also see {@link colNames | colNames}, {@link moveTo | moveTo},
   * and [docHaxall::Streams#reorderCols](https://fantom.org/doc/docHaxall/Streams#reorderCols).
   * 
   * Example:
   * ```
   * // move name to first col, and foo to last col
   * cols: grid.colNames.moveTo("name", 0).moveTo("foo", -1)
   * return grid.reorderCols(cols)
   * ```
   */
  static reorderCols(grid: sys.JsObj, colNames: sys.List<string>): sys.JsObj;
  /**
   * Parse a Str into a Symbol.  If the string is not a valid
   * Symbol identifier then raise ParseErr or return null based
   * on checked flag. The string must *not* include a leading "^".
   * 
   * Examples:
   * ```
   * parseSymbol("func:now")
   * ```
   */
  static parseSymbol(val: string, checked?: boolean): haystack.Symbol | null;
  /**
   * Given Number of milliseconds since Unix epoch return a
   * DateTime. The epic is defined as 1-Jan-1970 UTC.  If
   * timezone is null, use system default.  Also see {@link toJavaMillis | toJavaMillis}.
   */
  static fromJavaMillis(millis: haystack.Number, tz?: string | null): sys.DateTime;
  /**
   * Return if Str starts with the specified Str.
   * 
   * Examples:
   * ```
   * "hi there".startsWith("hi")   >>  true
   * "hi there".startsWith("foo")  >>  false
   * ```
   */
  static startsWith(val: string, sub: string): boolean;
}

/**
 * Facet applied to methods which should be exposed as Axon
 * functions.
 */
export class Axon extends sys.Obj implements sys.Facet, haystack.Define {
  static type$: sys.Type
  /**
   * Mark a function as superuser only.
   */
  su(): boolean;
  __su(it: boolean): void;
  /**
   * Marks a function as admin-only.  Any functions that modify
   * the database or perform ad hoc I/O should set this field to
   * true.  Functions with side effects should clearly document
   * what side effects are.
   */
  admin(): boolean;
  __admin(it: boolean): void;
  /**
   * Meta data for the function encoded as a Trio string
   */
  meta(): sys.JsObj | null;
  __meta(it: sys.JsObj | null): void;
  static make(f?: ((arg0: Axon) => void) | null, ...args: unknown[]): Axon;
}

/**
 * SyntaxErr is thrown during parse phase.
 */
export class SyntaxErr extends AxonErr {
  static type$: sys.Type
  static make(msg: string | null, loc: Loc, cause?: sys.Err | null, ...args: unknown[]): SyntaxErr;
}

/**
 * AxonContext manages the environment of an Axon evaluation
 */
export class AxonContext extends sys.Obj implements haystack.HaystackContext {
  static type$: sys.Type
  /**
   * Xeto namespace
   */
  xeto(): xeto.LibNamespace;
  /**
   * Evaluate expression to a function expression
   */
  evalToFunc(src: string): Fn;
  /**
   * Evaluate an Axon expression within this context. Convenience
   * for `evalExpr(parse(src, loc))`
   */
  eval(src: string, loc?: Loc): sys.JsObj | null;
  /**
   * Evaluate an expression
   */
  evalExpr(expr: Expr): sys.JsObj | null;
  /**
   * Definition namespace
   */
  ns(): haystack.Namespace;
  /**
   * Parse Axon expression
   */
  parse(src: string, loc?: Loc): Expr;
  /**
   * Lookup and call a function with the given arguments.  The
   * arguments must be fully evaluated values such as Numbers,
   * Dicts, Grids, etc.
   */
  call(funcName: string, args: sys.List<sys.JsObj | null>): sys.JsObj | null;
  /**
   * Stash allows you to stash objects on the Context object
   * during an Axon evaluation.  You should scope your string
   * keys with your pod name to avoid naming collisions.
   */
  stash(): sys.Map<string, sys.JsObj | null>;
}

/**
 * AxonErr is the base class of {@link SyntaxErr | SyntaxErr}
 * and {@link EvalErr | EvalErr}.
 */
export class AxonErr extends sys.Err {
  static type$: sys.Type
  loc(): Loc;
  toStr(): string;
  static make(msg: string | null, loc: Loc, cause?: sys.Err | null, ...args: unknown[]): AxonErr;
}

/**
 * Fn is a function definition
 */
export class Fn extends Expr implements haystack.HaystackFunc {
  static type$: sys.Type
  /**
   * Top-level name or debug name if closure
   */
  name(): string;
  /**
   * Return this
   */
  eval(cx: AxonContext): sys.JsObj | null;
  meta(): haystack.Dict;
  isTop(): boolean;
  /**
   * Invoke this function with the given arguments. Note: the `args`
   * parameter must be mutable and may be modified
   */
  call(cx: AxonContext, args: sys.List<sys.JsObj | null>): sys.JsObj | null;
  walk(f: ((arg0: string, arg1: sys.JsObj | null) => void)): void;
  /**
   * Call the function
   */
  haystackCall(cx: haystack.HaystackContext, args: sys.List<sys.JsObj | null>): sys.JsObj | null;
}

/**
 * AbstractComp is base class for Fantom components. See [docHaxall::Comps#fantom](https://fantom.org/doc/docHaxall/Comps#fantom).
 */
export class AbstractComp extends sys.Obj implements Comp {
  static type$: sys.Type
  /**
   * Debug string
   */
  toStr(): string;
  /**
   * Set a cell value by name or raise error if not a valid cell
   */
  set(name: string, val: sys.JsObj | null): this;
  /**
   * Get the definition
   */
  def(): CompDef;
  /**
   * Get a cell value by its cell definition
   */
  getCell(cd: CellDef): sys.JsObj | null;
  /**
   * Set a cell value by its cell definition
   */
  setCell(cd: CellDef, val: sys.JsObj | null): this;
  /**
   * Reflect the given type
   */
  static reflect(type: sys.Type, meta: haystack.Dict): CompDef;
  /**
   * Recompute the component's cells
   */
  recompute(cx: AxonContext): this;
  /**
   * Get a cell value by name or raise error if not a valid cell
   */
  get(name: string): sys.JsObj | null;
  /**
   * All components must implement single arg constructor
   */
  static make(init: sys.JsObj, ...args: unknown[]): AbstractComp;
}

/**
 * Comp is an instance of CompDef. See [docHaxall::Comps](https://fantom.org/doc/docHaxall/Comps).
 */
export abstract class Comp extends sys.Obj {
  static type$: sys.Type
  /**
   * Set a cell value by name or raise error if not a valid cell
   */
  set(name: string, val: sys.JsObj | null): this;
  /**
   * Definition of the component
   */
  def(): CompDef;
  /**
   * Get a cell value by its cell definition
   */
  getCell(cd: CellDef): sys.JsObj | null;
  /**
   * Set a cell value by its cell definition
   */
  setCell(cd: CellDef, val: sys.JsObj | null): this;
  /**
   * Recompute cells
   */
  recompute(cx: AxonContext): this;
  /**
   * Get a cell value by name or raise error if not a valid cell
   */
  get(name: string): sys.JsObj | null;
}

/**
 * Source code location.
 */
export class Loc extends sys.Obj {
  static type$: sys.Type
  /**
   * Line number (one based)
   */
  line(): number;
  /**
   * Unknown location
   */
  static unknown(): Loc;
  /**
   * Generic eval location
   */
  static eval(): Loc;
  /**
   * File or func record name
   */
  file(): string;
  /**
   * Location string
   */
  toStr(): string;
  /**
   * Is this the unknown location
   */
  isUnknown(): boolean;
  /**
   * Constructor
   */
  static make(file: string, line?: number, ...args: unknown[]): Loc;
}

/**
 * CompDef data flow component definition
 */
export class CompDef extends TopFn {
  static type$: sys.Type
  /**
   * Lookup a cell by name or raise UnknownCellErr
   */
  cell(name: string, checked?: boolean): CellDef | null;
  /**
   * Create instance of this component definition
   */
  instantiate(): Comp;
  /**
   * List data cells for component
   */
  cells(): sys.List<CellDef>;
}

/**
 * CellDef data flow component cell and its metadata
 */
export abstract class CellDef extends sys.Obj implements haystack.Dict {
  static type$: sys.Type
  /**
   * Parent component def
   */
  parent(): CompDef;
  /**
   * Cell name
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
   * null, then return display text for the entire dict using [Etc.dictToDis](Etc.dictToDis).
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
   * Get the value mapped by the given name.  If it is not mapped
   * to a non-null value, then throw an UnknownNameErr.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Temp shim until we break backward compatibility
   */
  _id(): xeto.Ref;
  /**
   * Return true if the given name is mapped to a non-null value.
   */
  has(name: string): boolean;
  /**
   * Get the `id` tag as a Ref or raise CastErr/UnknownNameErr
   */
  id(): haystack.Ref;
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
 * Cell facet to apply to AbstractComp slots
 */
export class Cell extends sys.Obj implements sys.Facet, haystack.Define {
  static type$: sys.Type
  /**
   * Meta data for the cell encoded as a Trio string
   */
  meta(): sys.JsObj | null;
  __meta(it: sys.JsObj | null): void;
  static make(f?: ((arg0: Cell) => void) | null, ...args: unknown[]): Cell;
}

/**
 * EvalErr is thrown during the evaluation phase.
 */
export class EvalErr extends AxonErr {
  static type$: sys.Type
  /**
   * Axon trace of call stack and scope variables
   */
  axonTrace(): string;
  static make(msg: string | null, cx: AxonContext, loc: Loc, cause?: sys.Err | null, ...args: unknown[]): EvalErr;
}

