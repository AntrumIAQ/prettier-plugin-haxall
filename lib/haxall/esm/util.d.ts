import * as sys from './sys.js';
import * as concurrent from './concurrent.js';

export class FileLocTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): FileLocTest;
  test(): void;
  verifyCmd(a: FileLoc, b: FileLoc, expected: number): void;
  verifyLoc(loc: FileLoc, file: string, line: number, col: number): void;
}

/**
 * Optimized fixed size array of 1, 2, 4, or 8 byte unboxed
 * integers. The array values default to zero.
 */
export class IntArray extends sys.Obj {
  static type$: sys.Type
  /**
   * Create a unsigned 16-bit, 2-byte integer array (0 to
   * 65_535).
   */
  static makeU2(size: number): IntArray;
  /**
   * Create a unsigned 8-bit, 1-byte integer array (0 to 255).
   */
  static makeU1(size: number): IntArray;
  /**
   * Set the integer at the given index. Negative indices are *not*
   * supported.
   */
  set(index: number, val: number): void;
  /**
   * Create a signed 16-bit, 2-byte integer array (-32_768 to
   * 32_767).
   */
  static makeS2(size: number): IntArray;
  /**
   * Create a unsigned 32-bit, 4-byte integer array (0 to
   * 4_294_967_295).
   */
  static makeU4(size: number): IntArray;
  /**
   * Create a signed 8-bit, 1-byte integer array (-128 to 127).
   */
  static makeS1(size: number): IntArray;
  /**
   * Create a signed 32-bit, 4-byte integer array (-2_147_483_648
   * to 2_147_483_647).
   */
  static makeS4(size: number): IntArray;
  /**
   * Sort the integers in this array.  If range is null then the
   * entire array is sorted, otherwise just the specified range.
   * Return this.
   */
  sort(range?: sys.Range | null): this;
  /**
   * Fill this array with the given integer value.  If range is
   * null then the entire array is filled, otherwise just the
   * specified range. Return this.
   */
  fill(val: number, range?: sys.Range | null): this;
  /**
   * Copy the integers from `that` array into this array and return
   * this.  The `thatRange` parameter may be used to specify a
   * specific range of integers from the `that` parameter (negative
   * indices *are* allowed) to copy.  If `thatRange` is null then the
   * entire range of `that` is copied.  Or `thisOffset` specifies the
   * starting index of this index to copy the first integer. 
   * Raise an exception if this array is not properly sized or is
   * not of the same signed/byte count as the `that` array.
   */
  copyFrom(that: IntArray, thatRange?: sys.Range | null, thisOffset?: number): this;
  /**
   * Get number of integers in the array
   */
  size(): number;
  /**
   * Get the integer at the given index. Negative indices are *not*
   * supported.
   */
  get(index: number): number;
  /**
   * Create a signed 64-bit, 8-byte integer array.
   */
  static makeS8(size: number): IntArray;
}

/**
 * Exception with a file location
 */
export class FileLocErr extends sys.Err {
  static type$: sys.Type
  /**
   * File location
   */
  loc(): FileLoc;
  /**
   * Return "loc: msg"
   */
  toStr(): string;
  /**
   * Constructor with message, location, and optional cause
   */
  static make(msg: string, loc: FileLoc, cause?: sys.Err | null, ...args: unknown[]): FileLocErr;
}

/**
 * Facet for annotating an {@link AbstractMain | AbstractMain}
 * argument field.
 */
export class Arg extends sys.Obj implements sys.Facet {
  static type$: sys.Type
  /**
   * Usage help, should be a single short line summary
   */
  help(): string;
  __help(it: string): void;
  static make(f?: ((arg0: Arg) => void) | null, ...args: unknown[]): Arg;
}

/**
 * Optimized fixed size array of booleans packed into words of
 * 32-bits.  The array values default to false.
 */
export class BoolArray extends sys.Obj {
  static type$: sys.Type
  /**
   * Set the boolean at the given index. Negative indices are *not*
   * supported.
   */
  set(index: number, val: boolean): void;
  /**
   * Set entire array to false
   */
  clear(): this;
  /**
   * Iterate each index set to true
   */
  eachTrue(f: ((arg0: number) => void)): void;
  /**
   * Fill this array with the given boolean value.  If range is
   * null then the entire array is filled, otherwise just the
   * specified range. Return this.
   */
  fill(val: boolean, range?: sys.Range | null): this;
  /**
   * Copy the booleans from `that` array into this array and return
   * this.
   */
  copyFrom(that: BoolArray): this;
  /**
   * Get number of booleans in the array
   */
  size(): number;
  /**
   * Get the boolean at the given index. Negative indices are *not*
   * supported.
   */
  get(index: number): boolean;
  /**
   * Set the value at given index and return the previous value.
   */
  getAndSet(index: number, val: boolean): boolean;
  /**
   * Create a array of given size
   */
  static make(size: number, ...args: unknown[]): BoolArray;
}

/**
 * FileLoc is a location within a text file or source string.
 * It includes an optional one-base line number and column
 * number. This class provides a standardized API for text
 * based tools which need to report the line/column numbers of
 * errors.
 */
export class FileLoc extends sys.Obj {
  static type$: sys.Type
  /**
   * One based line column number or zero if unknown
   */
  col(): number;
  /**
   * Constant for tool input location
   */
  static inputs(): FileLoc;
  /**
   * One based line number or zero if unknown
   */
  line(): number;
  /**
   * Constant for an unknown location
   */
  static unknown(): FileLoc;
  /**
   * Constant for synthetic location
   */
  static synthetic(): FileLoc;
  /**
   * Filename location
   */
  file(): string;
  /**
   * Return string representation as "file", "file(line)", or
   * "file(line,col)". This is the standard format used by the
   * Fantom compiler.
   */
  toStr(): string;
  /**
   * Comparison operator
   */
  compare(that: sys.JsObj): number;
  /**
   * Constructor for file
   */
  static makeFile(file: sys.File, line?: number, col?: number, ...args: unknown[]): FileLoc;
  /**
   * Is this the unknown location
   */
  isUnknown(): boolean;
  /**
   * Equality operator
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Constructor for filename string
   */
  static make(file: string, line?: number, col?: number, ...args: unknown[]): FileLoc;
  /**
   * Hash code
   */
  hash(): number;
}

/**
 * PathEnv is a simple implementation of a Fantom environment
 * which uses a search path to resolve files.
 */
export class PathEnv extends sys.Env {
  static type$: sys.Type
  /**
   * Get the environment variables as a case insensitive,
   * immutable map of Str name/value pairs.  The environment map
   * is initialized from the following sources from lowest
   * priority to highest priority:
   * 1. shell environment variables
   * 2. Java system properties (Java VM only obviously)
   * 3. props in "fan.props" prefixed with "env."
   */
  vars(): sys.Map<string, string>;
  /**
   * Search path of directories in priority order.  The last item
   * in the path is always the {@link sys.Env.homeDir | sys::Env.homeDir}
   */
  path(): sys.List<sys.File>;
  /**
   * Search {@link path | path} for all "lib/fan/*.pod" files.
   */
  findAllPodNames(): sys.List<string>;
  /**
   * Search {@link path | path} for given file.
   */
  findFile(uri: sys.Uri, checked?: boolean): sys.File | null;
  /**
   * Search {@link path | path} for all versions of given file.
   */
  findAllFiles(uri: sys.Uri): sys.List<sys.File>;
  /**
   * Working directory is always first item in {@link path | path}.
   */
  workDir(): sys.File;
  /**
   * Constructor initializes the search path using the `FAN_ENV_PATH`
   * environment variable (see {@link sys.Env.vars | sys::Env.vars}).
   */
  static make(...args: unknown[]): PathEnv;
  /**
   * Temp directory is always under {@link workDir | workDir}.
   */
  tempDir(): sys.File;
}

/**
 * ConsoleTest isn't an actual test, just a program to run to
 * see results
 */
export class ConsoleTest extends sys.Test {
  static type$: sys.Type
  static main(): void;
  static make(...args: unknown[]): ConsoleTest;
}

/**
 * CsvOutStream is used to write delimiter-separated values as
 * specified by RFC 4180.  Format details:
 * - rows are delimited by a newline
 * - cells are separated by {@link delimiter | delimiter} char
 * - cells containing the delimiter, `"` double quote, or newline
 *   are quoted; quotes are escaped as `""`
 * 
 * Also see {@link CsvInStream | CsvInStream}.
 */
export class CsvOutStream extends sys.OutStream {
  static type$: sys.Type
  /**
   * Delimiter character; defaults to comma.
   */
  delimiter(): number;
  delimiter(it: number): void;
  /**
   * Write a single cell.  If {@link isQuoteRequired | isQuoteRequired}
   * returns true, then quote it.
   */
  writeCell(cell: string): this;
  /**
   * Write the row of cells with the configured delimiter. Also
   * see {@link writeCell | writeCell}.
   */
  writeRow(row: sys.List<string>): this;
  /**
   * Return if the given cell string contains:
   * - the configured delimiter
   * - double quote `"` char
   * - leading/trailing whitespace
   * - newlines
   */
  isQuoteRequired(cell: string): boolean;
  /**
   * Wrap the underlying output stream.
   */
  static make(out: sys.OutStream, ...args: unknown[]): CsvOutStream;
}

/**
 * Facet for annotating an {@link AbstractMain | AbstractMain}
 * option field.
 */
export class Opt extends sys.Obj implements sys.Facet {
  static type$: sys.Type
  /**
   * Aliases for the option
   */
  aliases(): sys.List<string>;
  __aliases(it: sys.List<string>): void;
  /**
   * Usage help, should be a single short line summary
   */
  help(): string;
  __help(it: string): void;
  static make(f?: ((arg0: Opt) => void) | null, ...args: unknown[]): Opt;
}

/**
 * Random provides different implementation of random number
 * generators with more flexibility than the methods available
 * in sys.  Also see {@link sys.Int.random | sys::Int.random}, {@link sys.Float.random | sys::Float.random},
 * {@link sys.Range.random | sys::Range.random}, and {@link sys.List.random | sys::List.random}.
 */
export class Random extends sys.Obj {
  static type$: sys.Type
  /**
   * Generate 64-bit integer within the given range. If range is
   * null, assume full range of 64-bit integers
   */
  next(r?: sys.Range | null): number;
  /**
   * Generate 64-bit floating point number between 0.0f and 1.0f.
   */
  nextFloat(): number;
  /**
   * Construct a cryptographically strong random number
   * generator.
   */
  static makeSecure(): Random;
  /**
   * Generate random boolean.
   */
  nextBool(): boolean;
  /**
   * Generate a randomized number of bytes.
   */
  nextBuf(size: number): sys.Buf;
  /**
   * Construct a repeatable, seeded random number generator.
   */
  static makeSeeded(seed?: number): Random;
}

export class JsonTest extends sys.Test {
  static type$: sys.Type
  testRaw(): void;
  verifyBasics(s: string, expected: sys.JsObj | null): void;
  verifyWrite(obj: sys.JsObj | null, expected: string): void;
  verifyRoundtrip(obj: sys.JsObj | null): void;
  testBasics(): void;
  testWrite(): void;
  static make(...args: unknown[]): JsonTest;
  testEscapes(): void;
  testUnprintable(): void;
}

/**
 * JsonInStream reads objects from Javascript Object Notation
 * (JSON).
 * 
 * See [pod doc](pod-doc#json) for details.
 */
export class JsonInStream extends sys.InStream {
  static type$: sys.Type
  /**
   * Read a JSON object from this stream and return one of the
   * follow types:
   * - null
   * - Bool
   * - Int
   * - Float
   * - Str
   * - Str:Obj?
   * - Obj?[]
   * 
   * See {@link sys.Str.in | Str.in} to read from an in-memory
   * string.
   */
  readJson(): sys.JsObj | null;
  /**
   * Construct by wrapping given input stream.
   */
  static make(in$: sys.InStream, ...args: unknown[]): JsonInStream;
}

export class RandomTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): RandomTest;
  test(): void;
  verifyRandom(r: Random): void;
}

/**
 * TestRunner executes {@link sys.Test | sys::Test} classes and
 * reports success/failure.
 */
export class TestRunner extends sys.Obj {
  static type$: sys.Type
  /**
   * Output stream for built-in reporting
   */
  out(): sys.OutStream;
  out(it: sys.OutStream): void;
  /**
   * Should tests be run in verbose mode
   */
  isVerbose(): boolean;
  isVerbose(it: boolean): void;
  /**
   * Report summary of tests
   */
  reportSummary(): void;
  /**
   * Run all test methods on a given type
   */
  runType(type: sys.Type): this;
  /**
   * Run with given command line arguments
   */
  static main(args: sys.List<string>): number;
  /**
   * Print usage
   */
  printUsage(): void;
  /**
   * Run target from an argument string
   */
  runTarget(target: string): this;
  /**
   * Callback to invoke setup
   */
  onSetup(test: sys.Test): void;
  /**
   * Run all tests in given pod
   */
  runPod(pod: sys.Pod): this;
  static make(...args: unknown[]): TestRunner;
  /**
   * Print version
   */
  printVersion(): void;
  /**
   * Report the start of a test method
   */
  reportStart(type: sys.Type, method: sys.Method): void;
  /**
   * Report the success and number of verifies
   */
  reportSuccess(type: sys.Type, method: sys.Method, verifies: number): void;
  /**
   * Callback to invoke teardown
   */
  onTeardown(test: sys.Test): void;
  /**
   * Run list of targets from an argument string
   */
  runTargets(targets: sys.List<string>): this;
  /**
   * Run test method
   */
  runMethod(type: sys.Type, method: sys.Method): this;
  /**
   * Run on every installed pod
   */
  runAll(): this;
  /**
   * Report the failure and exception raised
   */
  reportFailure(type: sys.Type, method: sys.Method, err: sys.Err): void;
}

/**
 * AbstractMain provides conveniences for writing the main
 * routine of an app. Command line arguments are configured as
 * fields with the {@link Arg | Arg} facet:
 * ```
 * @Arg { help = "source file to process" }
 * File? src
 * ```
 * 
 * Arguments are ordered by the field declaration order.  The
 * last argument may be declared as a list to handle a variable
 * numbers of arguments.
 * 
 * Command line options are configured as fields with the {@link Opt | Opt}
 * facet :
 * ```
 * @Opt { help = "http port"; aliases=["p"] }
 * Int port := 8080
 * ```
 * 
 * Bool fields should always default to false and are
 * considered flag options.  All other arg and opt fields must
 * be a Str, File, or have a type which supports a `fromStr`
 * method.
 * 
 * Option fields may include the "Opt" suffix, and arguments
 * the "Arg" suffix.  These suffixes can be used when a field
 * conflicts with an existing slot name.
 * 
 * AbstractMain will automatically implement {@link usage | usage}
 * and {@link parseArgs | parseArgs} based on the fields which
 * are declared as options and arguments.  In general
 * subclasses only need to override {@link run | run}. If
 * writing a daemon main, then you'll probably want to
 * configure your services then call {@link runServices | runServices}.
 * 
 * See [example](examples::util-main).
 */
export class AbstractMain extends sys.Obj {
  static type$: sys.Type
  /**
   * Print usage help.
   */
  helpOpt(): boolean;
  helpOpt(it: boolean): void;
  /**
   * Parse the command line and set this instances fields. Return
   * false if not all of the arguments were passed.
   */
  parseArgs(toks: sys.List<string>): boolean;
  /**
   * Log for this application; defaults to {@link appName | appName}.
   */
  log(): sys.Log;
  /**
   * Print usage of arguments and options. Return non-zero.
   */
  usage(out?: sys.OutStream): number;
  /**
   * Run the application.  This method is called after the
   * command line has been parsed.  See {@link runServices | runServices}
   * to launch a deamon application.  Return status code, zero
   * for success.
   */
  run(): number;
  /**
   * Main performs the following tasks:
   * 1. Calls {@link parseArgs | parseArgs} to parse command line
   * 2. If args were incomplete or -help was specified then dump
   *   usage and return 1
   * 3. Call {@link run | run} and return 0
   * 4. If an exception is raised log it and return 1
   */
  main(args?: sys.List<string>): number;
  /**
   * Home directory for the application.  For a script this
   * defaults to directory of the script.  For pods the default
   * is "{Env.cur.workDir}/etc/{pod}".
   */
  homeDir(): sys.File;
  /**
   * Run the set of services:
   * 1. call install on each service
   * 2. call start on each service
   * 3. put main thread to sleep.
   * 4. on shutodwn call stop on each service
   * 5. then call uninstall on each service
   */
  runServices(services: sys.List<sys.Service>): number;
  static make(...args: unknown[]): AbstractMain;
  /**
   * Get all the fields annotated with the {@link Opt | @Opt}
   * facet.
   */
  optFields(): sys.List<sys.Field>;
  /**
   * Get the application name.  If this is a script it is the
   * name of the script file.  For a precompiled class called
   * "Main" this is the pod name, otherwise it is the type name.
   */
  appName(): string;
  /**
   * Get all the fields annotated with the {@link Arg | @Arg}
   * facet.
   */
  argFields(): sys.List<sys.Field>;
  /**
   * Print a map of key/value pairs to output with values
   * justified. Values that are lists are indented and separated
   * by newlines. Options:
   * - `out`: OutStream to print to (default is Env.cur.out)
   * - `indent`: Str spaces (default is "")
   */
  static printProps(props: sys.Map<string, sys.JsObj>, opts?: sys.Map<string, sys.JsObj> | null): void;
  /**
   * Get map of the standard runtime props including:
   * - java version info if JVM
   * - node version if running in NodeJS
   * - fan version Map vals are Strs or Lists to indent. Also see {@link printProps | printProps}
   */
  static runtimeProps(acc?: sys.Map<string, sys.JsObj> | null): sys.Map<string, sys.JsObj>;
}

/**
 * FileLogger appends Str log entries to a file.  You can add a
 * FileLogger as a Log handler:
 * ```
 * sysLogger := FileLogger
 * {
 *   dir = scriptDir
 *   filename = "sys-{YYMM}.log"
 * }
 * Log.addHandler |rec| { sysLogger.writeLogRec(rec) }
 * ```
 * 
 * See {@link filename | filename} for specifying a datetime
 * pattern for your log files.
 */
export class FileLogger extends concurrent.ActorPool {
  static type$: sys.Type
  /**
   * Directory used to store log file(s).
   */
  dir(): sys.File;
  __dir(it: sys.File): void;
  /**
   * Callback called each time the file logger opens an existing
   * or new log file.  Callback should write any header
   * information to the given output stream.  The callback will
   * occur on the logger's actor, so take care not incur
   * additional actor messaging.
   */
  onOpen(): ((arg0: sys.OutStream) => void) | null;
  __onOpen(it: ((arg0: sys.OutStream) => void) | null): void;
  /**
   * Log filename pattern.  The name may contain a pattern
   * between `{}` using the pattern format of {@link sys.DateTime.toLocale | sys::DateTime.toLocale}.
   * For example to maintain a log file per month, use a filename
   * such as "mylog-{YYYY-MM}.log".
   */
  filename(): string;
  __filename(it: string): void;
  /**
   * Append string log message to file.
   */
  writeLogRec(rec: sys.LogRec): void;
  /**
   * Constructor must set {@link dir | dir} and {@link filename | filename}
   */
  static make(f?: ((arg0: FileLogger) => void) | null, ...args: unknown[]): FileLogger;
  /**
   * Append string log message to file.
   */
  writeStr(msg: string): void;
}

/**
 * JsonOutStream writes objects in Javascript Object Notation
 * (JSON).
 * 
 * See [pod doc](pod-doc#json) for details.
 */
export class JsonOutStream extends sys.OutStream {
  static type$: sys.Type
  /**
   * Flag to escape characters over 0x7f using `\uXXXX`
   */
  escapeUnicode(): boolean;
  escapeUnicode(it: boolean): void;
  /**
   * Write JSON in pretty-printed format. This format produces
   * more readable JSON at the expense of larger output size.
   */
  prettyPrint(): boolean;
  prettyPrint(it: boolean): void;
  /**
   * Convenience for {@link writeJson | writeJson} to an in-memory
   * string.
   */
  static writeJsonToStr(obj: sys.JsObj | null): string;
  /**
   * Write the given object as JSON to this stream. The obj must
   * be one of the follow:
   * - null
   * - Bool
   * - Num
   * - Str
   * - Str:Obj?
   * - Obj?[]
   * - [simple](https://fantom.org/doc/docLang/Serialization#simple)
   *   (written as JSON string)
   * - [serializable](https://fantom.org/doc/docLang/Serialization#serializable)
   *   (written as JSON object)
   */
  writeJson(obj: sys.JsObj | null): this;
  /**
   * Construct by wrapping given output stream.
   */
  static make(out: sys.OutStream, ...args: unknown[]): JsonOutStream;
  /**
   * Convenience for pretty-printing JSON to an in-memory string.
   */
  static prettyPrintToStr(obj: sys.JsObj | null): string;
}

/**
 * CsvTest
 */
export class CsvTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): CsvTest;
  test(): void;
  verifyCsv(src: string, expected: sys.List<sys.List<string>>, f: ((arg0: CsvInStream) => void)): void;
}

/**
 * LockFile is used to acquire an exclusive lock to prevent two
 * different processes from using same files
 */
export class LockFile extends sys.Obj {
  static type$: sys.Type
  /**
   * Backing file we use to lock/acquire
   */
  file(): sys.File;
  /**
   * Release the lock if we are holding one
   */
  unlock(): this;
  /**
   * Acquire the lock or raise CannotAcquireLockFileErr
   */
  lock(): this;
  /**
   * Construct with given file
   */
  static make(file: sys.File, ...args: unknown[]): LockFile;
}

/**
 * Macro provides a way to replace macro expressions within a
 * pattern using a pluggable implementation for the macro
 * resolution. See {@link apply | apply} for macro syntax.
 */
export class Macro extends sys.Obj {
  static type$: sys.Type
  /**
   * The unresolved macro pattern
   */
  pattern(): string;
  /**
   * The {@link pattern | pattern} text is scanned for keys
   * delimited by `{{` and `}}`. The text between the delimiters is
   * the key. The supplied callback is invoked to resolve the key
   * and the macro is replaced with that value in the text.
   * Returns the resulting Str after the macro has been applied.
   * Throws {@link sys.ParseErr | sys::ParseErr} if the pattern
   * contains invalid macros.
   * ```
   * Macro("{{hello}} {{world}}!").apply { it.upper } => HELLO WORLD!
   * Macro("{{notTerminated").apply { it.upper } => ParseErr
   * ```
   * 
   * No lexical restriction is placed on the macro keys. The
   * callback is entirely reponsible for validating keys. For
   * example, all the following are perfectly acceptable keys as
   * far as parsing the macro goes:
   * - `{{}}`      - empty key
   * - `{{  }}`    - all white space
   * - `{{ foo }}` - leading and trailing white space
   */
  apply(resolve: ((arg0: string) => string)): string;
  /**
   * Get a list of all the macro keys in the order they appear in
   * the macro {@link pattern | pattern}. Duplicates are not
   * removed.
   * ```
   * Macro("{{hello}} {{world}}! Good-bye {{world}}").keys
   *    => ["hello", "world", "world"]
   * ```
   */
  keys(): sys.List<string>;
  /**
   * Create a macro for the given pattern.
   */
  static make(pattern: string, ...args: unknown[]): Macro;
}

/**
 * CsvInStream is used to read delimiter-separated values as
 * specified by RFC 4180.  Format details:
 * - rows are delimited by a newline
 * - cells are separated by {@link delimiter | delimiter} char
 * - cells may be quoted with `"` character
 * - quoted cells may contain the delimiter
 * - quoted cells may contain newlines (always normalized to
 *   "\n")
 * - quoted cells must escape `"` with `""`
 * - the {@link trim | trim} flag trims leading/trailing
 *   whitespace from non-quoted cells (note that RFC 4180
 *   specifies that whitespace is significant)
 * 
 * Also see {@link CsvOutStream | CsvOutStream}.
 */
export class CsvInStream extends sys.InStream {
  static type$: sys.Type
  /**
   * Configures whether unqualified whitespace around a cell is
   * automatically trimmed.  If a field is enclosed by quotes
   * then it is never trimmed.
   */
  trim(): boolean;
  trim(it: boolean): void;
  /**
   * Delimiter character; defaults to comma.
   */
  delimiter(): number;
  delimiter(it: number): void;
  /**
   * Read the next line as a row of delimiter-separated strings. 
   * Return null if at end of stream.
   */
  readRow(): sys.List<string> | null;
  /**
   * Read the entire table of rows into memory. The input stream
   * is guaranteed to be closed upon completion.
   */
  readAllRows(): sys.List<sys.List<string>>;
  /**
   * Wrap the underlying input stream.
   */
  static make(in$: sys.InStream, ...args: unknown[]): CsvInStream;
  /**
   * Iterate through all the lines parsing each one into
   * delimited-separated strings and calling the given callback
   * functions.  The input stream is guaranteed to be closed upon
   * completion.
   */
  eachRow(f: ((arg0: sys.List<string>) => void)): void;
}

export class FloatArrayTest extends sys.Test {
  static type$: sys.Type
  testCopyFrom(): void;
  verifySort(a: FloatArray): void;
  static make(...args: unknown[]): FloatArrayTest;
  verifyStore(a: FloatArray, f4: boolean, val: number): void;
  testS8(): void;
  testS4(): void;
  testFill(): void;
  verifyMake(a: FloatArray, size: number): void;
  verifyStores(a: FloatArray, f4: boolean): void;
  testSort(): void;
  verifyFloats(a: FloatArray, list: string): void;
}

export class IntArrayTest extends sys.Test {
  static type$: sys.Type
  testCopyFrom(): void;
  verifyInts(a: IntArray, list: string): void;
  verifySort(a: IntArray): void;
  static make(...args: unknown[]): IntArrayTest;
  verifyStore(a: IntArray, val: number, expected?: number): void;
  testS8(): void;
  testS4(): void;
  testS2(): void;
  testU4(): void;
  testS1(): void;
  testFill(): void;
  verifyMake(a: IntArray, size: number): void;
  testSort(): void;
  testU2(): void;
  testU1(): void;
}

export class BoolArrayTest extends sys.Test {
  static type$: sys.Type
  testRandom(): void;
  verifyBitCombo(size: number, indices: sys.List<number>): void;
  testBitsCombo(): void;
  static make(...args: unknown[]): BoolArrayTest;
  testBits(): void;
  verifyBits(index: number): void;
}

/**
 * Console provides utilities to interact with the terminal
 * console. For Java this API is designed to use [jline](https://fantom.org/doc/docTools/Setup#jline)
 * if installed.  In browser JavaScript environments this APIs
 * uses the JS debugging window.
 */
export class Console extends sys.Obj {
  static type$: sys.Type
  /**
   * Get the default console for the virtual machine
   */
  static cur(): Console;
  /**
   * Prompt the user to enter a password string from standard
   * input with echo disabled.  Return null if end of stream has
   * been reached.
   */
  promptPassword(msg?: string): string | null;
  static make(...args: unknown[]): Console;
  /**
   * Print tabular data to the console:
   * - List of list is two dimensional data where first row is
   *   header names
   * - List of items with an each method will create column per key
   * - List of items without each will map to a column of "val"
   * - Anything else will be table of one cell table
   */
  table(obj: sys.JsObj | null): this;
  /**
   * Number of lines that fit vertically in console or null if
   * unknown
   */
  height(): number | null;
  /**
   * Print a message to the console at the informational level
   */
  info(msg: sys.JsObj | null, err?: sys.Err | null): this;
  /**
   * Enter an indented group level in the console.  The JS debug
   * window can specify the group to default in a collapsed state
   * (this flag is ignored in a standard terminal).
   */
  group(msg: sys.JsObj | null, collapsed?: boolean): this;
  /**
   * Print a message to the console at the debug level
   */
  debug(msg: sys.JsObj | null, err?: sys.Err | null): this;
  /**
   * Print a message to the console at the error level
   */
  err(msg: sys.JsObj | null, err?: sys.Err | null): this;
  /**
   * Clear the console of all text if supported
   */
  clear(): this;
  /**
   * Print a message to the console at the warning level
   */
  warn(msg: sys.JsObj | null, err?: sys.Err | null): this;
  /**
   * Exit an indented, collapsable group level
   */
  groupEnd(): this;
  /**
   * Number of chars that fit horizontally in console or null if
   * unknown
   */
  width(): number | null;
  /**
   * Construct a console that wraps an output stream. The
   * returned console instance is **not** thread safe.
   */
  static wrap(out: sys.OutStream): Console;
  /**
   * Prompt the user to enter a string from standard input.
   * Return null if end of stream has been reached.
   */
  prompt(msg?: string): string | null;
}

export class MacroTest extends sys.Test {
  static type$: sys.Type
  testKeys(): void;
  testUnterminated(): void;
  static make(...args: unknown[]): MacroTest;
  testNoMacros(): void;
  testEmpty(): void;
  testResolve(): void;
}

/**
 * Optimized fixed size array of 4 or 8 byte unboxed floats.
 * The array values default to zero.
 */
export class FloatArray extends sys.Obj {
  static type$: sys.Type
  /**
   * Set the float at the given index. Negative indices are *not*
   * supported.
   */
  set(index: number, val: number): void;
  /**
   * Create a 64-bit float array.
   */
  static makeF8(size: number): FloatArray;
  /**
   * Sort the floats in this array.  If range is null then the
   * entire array is sorted, otherwise just the specified range.
   * Return this.
   */
  sort(range?: sys.Range | null): this;
  /**
   * Fill this array with the given float value.  If range is
   * null then the entire array is filled, otherwise just the
   * specified range. Return this.
   */
  fill(val: number, range?: sys.Range | null): this;
  /**
   * Copy the floats from `that` array into this array and return
   * this.  The `thatRange` parameter may be used to specify a
   * specific range of floats from the `that` parameter (negative
   * indices *are* allowed) to copy.  If `thatRange` is null then the
   * entire range of `that` is copied.  Or `thisOffset` specifies the
   * starting index of this index to copy the first float.  Raise
   * an exception if this array is not properly sized or is not
   * of the same signed/byte count as the `that` array.
   */
  copyFrom(that: FloatArray, thatRange?: sys.Range | null, thisOffset?: number): this;
  /**
   * Get number of floats in the array
   */
  size(): number;
  /**
   * Create a 32-bit float array.
   */
  static makeF4(size: number): FloatArray;
  /**
   * Get the float at the given index. Negative indices are *not*
   * supported.
   */
  get(index: number): number;
}

