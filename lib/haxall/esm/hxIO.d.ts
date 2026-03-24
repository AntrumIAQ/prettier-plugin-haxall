import * as sys from './sys.js';
import * as util from './util.js';
import * as web from './web.js';
import * as axon from './axon.js';
import * as folio from './folio.js';
import * as ftp from './ftp.js';
import * as haystack from './haystack.js';
import * as def from './def.js';
import * as hx from './hx.js';
import * as hxUtil from './hxUtil.js';

/**
 * DirItem
 */
export class DirItem extends sys.Obj {
  static type$: sys.Type
  mod(): sys.DateTime | null;
  mime(): sys.MimeType | null;
  uri(): sys.Uri;
  size(): number | null;
  name(): string;
  isDir(): boolean;
  static makeFile(uri: sys.Uri, file: sys.File, ...args: unknown[]): DirItem;
  static make(uri: sys.Uri, name: string, mime: sys.MimeType | null, isDir: boolean, size: number | null, mod: sys.DateTime | null, ...args: unknown[]): DirItem;
}

/**
 * I/O library functions
 */
export class IOFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Delete a file or a directory as mapped by the given I/O
   * handle. If a directory is specified, then it is recursively
   * deleted.  If the I/O handle does map to a file system then
   * raise exception.  If the file does not exist then no action
   * is taken.
   */
  static ioDelete(handle: sys.JsObj | null): sys.JsObj | null;
  /**
   * Write a string to an I/O handle.
   */
  static ioWriteStr(str: string, handle: sys.JsObj | null): sys.JsObj | null;
  /**
   * Read a JSON file into memory. This function can used to read
   * any arbitrary JSON nested object/array structure which can
   * be accessed as Axon dicts/lists.  The default decoding
   * assumes Haystack 4 JSON format (Hayson).  Also see {@link ioReadJsonGrid | ioReadJsonGrid}
   * if reading a Haystack formatted grid.
   * 
   * Object keys which are not valid tag names will decode
   * correctly and can be used in-process.  But they will not
   * serialize correctly over the HTTP API.  You can use the `safeNames`
   * option to force object keys to be safe tag names (but you
   * will lose the original key names).
   * 
   * The following options are supported:
   * - v3: decode the JSON as Haystack 3
   * - v4: explicitly request Haystack 4 decoding (default)
   * - safeNames: convert object keys to safe tag names
   */
  static ioReadJson(handle: sys.JsObj | null, opts?: haystack.Dict | null): sys.JsObj | null;
  /**
   * Return a I/O handle which may be used to read from a zip
   * entry within a zip file.  The `handle` parameter must be an
   * I/O handle which references a zip file in the file system.
   * The `path` parameter must be a Uri which identifies the path
   * of the entry within the zip file.  See {@link ioZipDir | ioZipDir}
   * to read the listing of paths within a zip.
   * 
   * Example:
   * ```
   * // read CSV file from within a zip
   * ioZipEntry(`io/batch.zip`, `/zone-temp.csv`).ioReadCsv
   * ```
   */
  static ioZipEntry(handle: sys.JsObj | null, path: sys.Uri): sys.JsObj | null;
  /**
   * Convert a handle to append mode.  Writes will append to the
   * end of the file instead of rewriting the file.  Raises
   * UnsupportedErr if the handle doesn't support append mode.
   * 
   * Example:
   * ```
   * ioWriteStr("append a line\n", ioAppend(`io/foo.txt`))
   * ```
   */
  static ioAppend(handle: sys.JsObj | null): sys.JsObj | null;
  /**
   * Write an Axon data structure to HTML. The `val` must be an
   * Axon type that can be converted to a Grid.
   */
  static ioWriteHtml(val: sys.JsObj | null, handle: sys.JsObj | null, opts?: haystack.Dict): sys.JsObj | null;
  /**
   * Get information about a file handle and return a Dict with
   * the same tags as [ioDir()](ioDir()).
   * 
   * If the I/O handle does not map to a file in the virtual file
   * system then throw an exception.
   * ```
   * ioInfo(`io/`)            // read file info for the project's io/ directory
   * ioInfo(`io/sites.trio`)  // read file info for the io/sites.trio file
   * ```
   */
  static ioInfo(handle: sys.JsObj | null): haystack.Dict;
  /**
   * Write an Axon data structure to JSON. By default, Haystack 4
   * (Hayson) encoding is used. The `val` may be:
   * - One of the SkySpark types that can be mapped to JSON. See [docHaystack::Json](https://fantom.org/doc/docHaystack/Json)
   *   for type mapping.
   * 
   * The following options are supported:
   * - noEscapeUnicode: do not escape characters over 0x7F
   * - v3: Encode JSON using Haystack 3 encoding
   * - v4: Explicitly encode with Haystack 4 encoding (default)
   */
  static ioWriteJson(val: sys.JsObj | null, handle: sys.JsObj | null, opts?: haystack.Dict | null): sys.JsObj | null;
  /**
   * Read a stream of dicts from a comma separated value file. 
   * This function uses the same options and semantics as {@link ioReadCsv | ioReadCsv}
   * except it streams the rows as dicts instead of reading to an
   * in-memory grid. See [docHaxall::Streams#ioStreamCsv](https://fantom.org/doc/docHaxall/Streams#ioStreamCsv).
   */
  static ioStreamCsv(handle: sys.JsObj | null, opts?: haystack.Dict | null): sys.JsObj | null;
  /**
   * Read an I/O handle into memory as a list of string lines.
   * Lines are processed according to {@link sys.InStream.readLine | sys::InStream.readLine}
   * semanatics.
   * 
   * By default the maximum line size read is 4kb of Unicode
   * characters (not bytes).  This limit may be overridden using
   * the option key "limit".
   * 
   * Examples:
   * ```
   * ioReadLines(`io/file.txt`)
   * ioReadLines(`io/file.txt`, {limit: 10_000})
   * ```
   */
  static ioReadLines(handle: sys.JsObj | null, opts?: haystack.Dict | null): sys.List<string>;
  /**
   * Generate randomized series of bytes which can be used as an
   * input I/O handle.
   */
  static ioRandom(size: haystack.Number): sys.JsObj;
  /**
   * Encode an I/O handle into hexidecimal string.
   */
  static ioToHex(handle: sys.JsObj | null): string;
  /**
   * Return an I/O handle to decode from a base64 string. Also
   * see [ioToBase64()](ioToBase64()) and {@link sys.Buf.fromBase64 | sys::Buf.fromBase64}
   * 
   * Example:
   * ```
   * // decode base64 to a string
   * ioFromBase64("c2t5c3Bhcms").ioReadStr
   * ```
   */
  static ioFromBase64(s: string): sys.JsObj | null;
  /**
   * Generate a cycle reduancy check code as a Number. See {@link sys.Buf.crc | sys::Buf.crc}
   * for available algorithms.
   * 
   * Example:
   * ```
   * ioCrc("foo", "CRC-32").toHex
   * ```
   */
  static ioCrc(handle: sys.JsObj | null, algorithm: string): haystack.Number;
  /**
   * Apply a skipping operation to an input I/O handle.  The
   * following options are available (in order of processing):
   * - bom: skip byte order mark
   * - bytes: number of bytes to skip (must be binary input stream)
   * - chars: number of chars to skip (must be text input stream)
   * - lines: number of lines to skip
   * 
   * Skipping a BOM will automatically set the appropiate
   * charset. If no BOM is detected, then this call is safely
   * ignored by pushing those bytes back into the input stream. 
   * The following byte order marks are supported:
   * - UTF-16 Big Endian: 0xFE_FF
   * - UTF-16 Little Endian: 0xFF_FE
   * - UTF-8: 0xEF_BB_BF
   * 
   * Examples:
   * ```
   * // skip leading 4 lines in a CSV file
   * ioSkip(`io/foo.csv`, {lines:4}).ioReadCsv
   * 
   * // skip byte order mark
   * ioSkip(`io/foo.csv`, {bom}).ioReadCsv
   * ```
   */
  static ioSkip(handle: sys.JsObj | null, opts: haystack.Dict): sys.JsObj | null;
  /**
   * Generate a one-way hash of the given I/O handle. See {@link sys.Buf.toDigest | sys::Buf.toDigest}
   * for available algorithms.
   * 
   * Example:
   * ```
   * ioDigest("foo", "SHA-1").ioToBase64
   * ```
   */
  static ioDigest(handle: sys.JsObj | null, algorithm: string): sys.JsObj | null;
  /**
   * Create a directory or empty file with the given I/O handle.
   * If creating a file that already exists, it is overwritten as
   * empty.
   * 
   * Examples:
   * ```
   * ioCreate(`io/new-dir/`)        // create new empty directory
   * ioCreate(`io/new-file.txt`)    // create new empty file
   * ```
   */
  static ioCreate(handle: sys.JsObj | null): sys.JsObj | null;
  /**
   * Configure an I/O handle to use the specified charset.  The
   * handle is any supported [I/O handle](doc#handles) and the
   * charset is a string name supported by the JVM installation. 
   * Standard charset names:
   * - "UTF-8" 8-bit Unicode Transformation Format
   * - "UTF-16BE": 16 bit Big Endian Unicode Transformation Format
   * - "UTF-16LE" 16 bit Little Endian Unicode Transformation
   *   Format
   * - "ISO-8859-1": Latin-1 code block
   * - "US-ASCII": 7-bit ASCII
   * 
   * Examples:
   * ```
   * // write text file in UTF-16BE
   * ioWriteStr(str, ioCharset(`io/foo.txt`, "UTF-16BE"))
   * 
   * // read CSV file in ISO-8859-1
   * ioCharset(`io/foo.csv`, "ISO-8859-1").ioReadCsv
   * ```
   */
  static ioCharset(handle: sys.JsObj | null, charset: string): sys.JsObj | null;
  /**
   * Generate an HMAC message authentication as specified by RFC
   * 2104. See {@link sys.Buf.hmac | sys::Buf.hmac}.
   * 
   * Example:
   * ```
   * ioHmac("foo", "SHA-1", "secret").ioToBase64
   * ```
   */
  static ioHmac(handle: sys.JsObj | null, algorithm: string, key: sys.JsObj | null): sys.JsObj | null;
  /**
   * Read a stream of lines.  Lines are processed according to {@link sys.InStream.eachLine | sys::InStream.eachLine}.
   * See [docHaxall::Streams#ioStreamLines](https://fantom.org/doc/docHaxall/Streams#ioStreamLines).
   */
  static ioStreamLines(handle: sys.JsObj | null): sys.JsObj;
  /**
   * Export a view to the given file handle - see [docFresco::Export](https://fantom.org/doc/docFresco/Export).
   * 
   * Note: this feature is available in SkySpark only
   */
  static ioExport(req: haystack.Dict, handle: sys.JsObj | null): sys.JsObj;
  /**
   * Generate a password based cryptographic key. See {@link sys.Buf.pbk | sys::Buf.pbk}.
   * 
   * Example:
   * ```
   * ioPbk("PBKDF2WithHmacSHA1", "secret", ioRandom(64), 1000, 20).ioToBase64
   * ```
   */
  static ioPbk(algorithm: string, password: string, salt: sys.JsObj | null, iterations: haystack.Number, keyLen: haystack.Number): sys.JsObj | null;
  /**
   * Write an Axon data structure to RDF [JSON-LD](https://fantom.org/doc/docHaystack/Rdf)
   * format. The `val` must be an Axon type that can be converted
   * to a Grid.
   */
  static ioWriteJsonLd(val: sys.JsObj | null, handle: sys.JsObj | null): sys.JsObj | null;
  /**
   * Wrap an I/O handle to GZIP compress/uncompress.
   * 
   * Example:
   * ```
   * // generate GZIP CSV file
   * readAll(site).ioWriteCsv(ioGzip(`io/sites.gz`))
   * 
   * // read GZIP CSV file
   * ioGzip(`io/sites.gz`).ioReadCsv
   * ```
   */
  static ioGzip(handle: sys.JsObj | null): sys.JsObj | null;
  /**
   * Read a zip file's entry listing, return a grid with cols:
   * - `path`: path of entry inside zip as Uri
   * - `size`: size of file in bytes or null
   * - `mod`:  modified timestamp or null if unknown
   * 
   * The handle must reference a zip file in the file system. Use
   * {@link ioZipEntry | ioZipEntry} to perform a read operation
   * on one of the entries in the zip file.
   * 
   * Example:
   * ```
   * ioZipDir(`io/batch.zip`)
   * ```
   */
  static ioZipDir(handle: sys.JsObj | null): haystack.Grid;
  /**
   * Render data to a PDF file.  The grid meta "view" tag
   * determines the visualization:
   * - `table`: render grid as [table](https://fantom.org/doc/docFresco/Tables)
   *   (default)
   * - `chart`: render grid as [chart](https://fantom.org/doc/docFresco/Charts)
   * - `fandoc`: render string as [fandoc](fandoc::pod-doc#overview)
   * - `text`: render as plaintext
   * 
   * Options:
   * - [pageSize](pageSize): determines the PDF page size
   * 
   * Examples:
   * ```
   * // render as chart with default page size
   * read(power).hisRead(yesterday).ioWritePdf(`io/portrait.pdf`)
   * 
   * // render as chart with landscape page size of 11" x 8.5"
   * read(power).hisRead(yesterday).ioWritePdf(`io/landscape.pdf`, {pageSize:"11in,8.5in"})
   * 
   * // render table as single auto-fit page
   * readAll(site).ioWritePdf(`io/sites.pdf`, {pageSize:"auto"})
   * ```
   * 
   * Note: this feature is available in SkySpark only
   */
  static ioWritePdf(val: sys.JsObj | null, handle: sys.JsObj | null, opts?: haystack.Dict): sys.JsObj | null;
  /**
   * Read a [Trio](https://fantom.org/doc/docHaystack/Trio) file
   * into memory as a list of Dicts.
   */
  static ioReadTrio(handle: sys.JsObj | null): sys.List<haystack.Dict>;
  /**
   * Copy a file or directory to the new specified location. If
   * this file represents a directory, then it recursively copies
   * the entire directory tree.  Both handles must reference a
   * local file or directory on the file system.
   * 
   * If during the copy, an existing file of the same name is
   * found, then the "overwrite" option should be to marker or `true`
   * to overwrite or `false` to skip.  Or if overwrite is not
   * defined then an IOErr is raised.
   * 
   * Examples:
   * ```
   * ioCopy(`io/dir/`, `io/dir-copy/`)
   * ioCopy(`io/file.txt`, `io/file-copy.txt`)
   * ioCopy(`io/file.txt`, `io/file-copy.txt`, {overwrite})
   * ioCopy(`io/file.txt`, `io/file-copy.txt`, {overwrite:false})
   * ```
   */
  static ioCopy(from$: sys.JsObj | null, to: sys.JsObj | null, opts?: haystack.Dict): sys.JsObj | null;
  /**
   * Read a [Zinc](https://fantom.org/doc/docHaystack/Zinc) file
   * into memory as a Haystack data type.
   */
  static ioReadZinc(handle: sys.JsObj | null): haystack.Grid;
  /**
   * Iterate the rows of a CSV file (comma separated values) and
   * callback the given function with two parameters: Str[] cells
   * of current row and zero based Number line number.
   * 
   * The following options are supported:
   * - delimiter: separator char as string, default is ","
   * 
   * Also {@link ioReadCsv | ioReadCsv}, {@link ioWriteCsv | ioWriteCsv},
   * and [docHaystack::Csv](https://fantom.org/doc/docHaystack/Csv).
   */
  static ioEachCsv(handle: sys.JsObj | null, opts: haystack.Dict | null, fn: axon.Fn): sys.JsObj | null;
  /**
   * Read a Xeto data file into memory as a Haystack data type.
   * See {@link xeto.LibNamespace.compileData | xeto::LibNamespace.compileData}
   * for details and options.
   */
  static ioReadXeto(handle: sys.JsObj | null, opts?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Write dicts to a [Trio](https://fantom.org/doc/docHaystack/Trio)
   * file. The `val` may be can be any format accepted by [toRecList](toRecList).
   * 
   * Following options are supported
   * - noSort: marker to prevent tags from being sorted by name
   */
  static ioWriteTrio(val: sys.JsObj | null, handle: sys.JsObj | null, opts?: haystack.Dict | null): sys.JsObj | null;
  /**
   * Write a Grid to the [Zinc](https://fantom.org/doc/docHaystack/Zinc)
   * format.
   */
  static ioWriteZinc(val: sys.JsObj | null, handle: sys.JsObj | null): sys.JsObj | null;
  /**
   * Read a CSV (comma separated values) file into memory as a
   * Grid. CSV format is implemented as specified by RFC 4180:
   * - rows are delimited by a newline
   * - cells are separated by `delimiter` char
   * - cells containing the delimiter, `"` double quote, or newline
   *   are quoted; quotes are escaped as `""`
   * - empty cells are normalized into null
   * 
   * The following options are supported:
   * - delimiter: separator char as string, default is ","
   * - noHeader: if present then don't treat first row as col
   *   names, instead use "v0", "v1", etc
   * 
   * Also see {@link ioStreamCsv | ioStreamCsv}, {@link ioEachCsv | ioEachCsv},
   * {@link ioWriteCsv | ioWriteCsv}, and [docHaystack::Csv](https://fantom.org/doc/docHaystack/Csv).
   */
  static ioReadCsv(handle: sys.JsObj | null, opts?: haystack.Dict | null): haystack.Grid;
  /**
   * For each line of the given source stream call the given
   * function with two parameters: Str line and zero based Number
   * line number. Lines are processed according to {@link sys.InStream.eachLine | sys::InStream.eachLine}.
   */
  static ioEachLine(handle: sys.JsObj | null, fn: axon.Fn): sys.JsObj | null;
  /**
   * Render data to an SVG file.  Pass `size` option to specify the
   * SVG `viewBox`, `width`, and `height` attribtues (defaults to
   * "1000,800").  The visualization is determined by the grid
   * meta "view" tag - see [ioWritePdf()](ioWritePdf()) for
   * specifics.
   * 
   * Examples:
   * ```
   * read(power).hisRead(yesterday).ioWriteSvg(`io/example.svg`)
   * 
   * read(power).hisRead(yesterday).ioWriteSvg(`io/example.svg`, {size:"600,400"})
   * ```
   * 
   * Note: this feature is available in SkySpark only
   */
  static ioWriteSvg(val: sys.JsObj | null, handle: sys.JsObj | null, opts?: haystack.Dict): sys.JsObj | null;
  static make(...args: unknown[]): IOFuncs;
  /**
   * Encode an I/O handle into a base64 string.  The default
   * behavior is to encode using RFC 2045 (see {@link sys.Buf.toBase64 | sys::Buf.toBase64}).
   * Use the `{uri}` option to encode a URI-safe URI via RFC 4648
   * (see {@link sys.Buf.toBase64Uri | sys::Buf.toBase64Uri}).
   * Also see {@link ioFromBase64 | ioFromBase64}.
   * 
   * Example:
   * ```
   * // encode string to base64
   * ioToBase64("myusername:mysecret")
   * 
   * // encode string to base64 without padding using URI safe chars
   * ioToBase64("myusername:mysecret", {uri})
   * ```
   */
  static ioToBase64(handle: sys.JsObj | null, opts?: haystack.Dict | null): string;
  /**
   * Write an Excel XLS file, where `val` may be:
   * - Grid - writted a a single worksheet
   * - Grid[] - each grid is exported as a separate worksheet
   * 
   * By default each worksheet is named "Sheet1", "Sheet2", etc. 
   * Use a `title` tag in Grid.meta to give the worksheets a
   * specific name.
   * 
   * Example:
   * ```
   * readAll(site).ioWriteExcel(`io/sites.xls`)
   * ```
   */
  static ioWriteExcel(val: sys.JsObj | null, handle: sys.JsObj | null): sys.JsObj | null;
  /**
   * Read a JSON file formatted as a standardized Haystack grid
   * into memory. See {@link ioReadJson | ioReadJson} to read
   * arbitrary JSON structured data.
   */
  static ioReadJsonGrid(handle: sys.JsObj | null, opts?: haystack.Dict | null): haystack.Grid;
  /**
   * Read an I/O handle into memory as a string. Newlines are
   * always normalized into "\n" characters.
   */
  static ioReadStr(handle: sys.JsObj | null): string;
  /**
   * Write value to a Xeto text format file. See {@link xeto.LibNamespace.writeData | xeto::LibNamespace.writeData}
   * for details and options.
   */
  static ioWriteXeto(val: sys.JsObj | null, handle: sys.JsObj | null, opts?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Write a grid to an [XML](https://fantom.org/doc/docHaxall/Xml)
   * file.
   */
  static ioWriteXml(val: sys.JsObj | null, handle: sys.JsObj | null): sys.JsObj | null;
  /**
   * Write an Axon data structure to RDF [Turtle](https://fantom.org/doc/docHaystack/Rdf)
   * format. The `val` must be an Axon type that can be converted
   * to a Grid.
   */
  static ioWriteTurtle(val: sys.JsObj | null, handle: sys.JsObj | null): sys.JsObj | null;
  /**
   * Move or rename a file or directory.  Both handles must
   * reference a local file or directory on the file system.  If
   * the target file already exists then raise an IOErr.
   */
  static ioMove(from$: sys.JsObj | null, to: sys.JsObj | null): sys.JsObj | null;
  /**
   * Write a list of string lines separated with "\n" character.
   */
  static ioWriteLines(lines: sys.List<string>, handle: sys.JsObj | null): sys.JsObj | null;
  /**
   * Write a grid to a [CSV](https://fantom.org/doc/docHaystack/Csv)
   * (comma separated values) file.
   * 
   * CSV format is implemented as specified by RFC 4180:
   * - rows are delimited by a newline
   * - cells are separated by `delimiter` char
   * - cells containing the delimiter, `"` double quote, or newline
   *   are quoted; quotes are escaped as `""`
   * 
   * The following options are supported:
   * - delimiter: separator char as string, default is ","
   * - newline: newline string, default is "\n" (use "\r\n" for
   *   CRLF)
   * - noHeader: Set this option to prevent the column names from
   *   being written as a header row.
   * - stripUnits: write all numbers without a unit
   * 
   * Also {@link ioReadCsv | ioReadCsv}, {@link ioEachCsv | ioEachCsv},
   * and [docHaystack::Csv](https://fantom.org/doc/docHaystack/Csv).
   */
  static ioWriteCsv(val: sys.JsObj | null, handle: sys.JsObj | null, opts?: haystack.Dict | null): sys.JsObj | null;
  /**
   * Read a directory listing, return a grid with cols:
   * - `uri`: Uri for handle to read/write the file
   * - `name`: filename string
   * - `mimeType`: file mime type or null if unknown
   * - `dir`:  marker if file is a sub-directory or null
   * - `size`: size of file in bytes or null
   * - `mod`:  modified timestamp or null if unknown
   * 
   * If the I/O handle does not map to a file in the virtual file
   * system then throw an exception.
   * ```
   * ioDir(`io/`)             // read files in project's io/ directory
   * ioDir(`fan://haystack`)  // read files in pod
   * ```
   */
  static ioDir(handle: sys.JsObj | null): haystack.Grid;
}

/**
 * IOHandle is the standard handle used to open an input/output
 * stream.
 */
export class IOHandle extends sys.Obj {
  static type$: sys.Type
  /**
   * Process input stream and guarnatee closed. Return result of
   * function f.
   */
  withIn(f: ((arg0: sys.InStream) => sys.JsObj | null)): sys.JsObj | null;
  /**
   * Return directory of this handle for ioDir
   */
  dir(): sys.List<DirItem>;
  /**
   * Delete the file or directory specified for this handle
   */
  delete(): void;
  /**
   * Open handle as an output stream.
   */
  out(): sys.OutStream;
  /**
   * Convert this handle to an append mode handle.
   */
  toAppend(): IOHandle;
  /**
   * Create an empty file or directory for this handle.
   */
  create(): void;
  static make(...args: unknown[]): IOHandle;
  /**
   * Get file information about the current handle or throw an
   * Err if not a file
   */
  info(): DirItem;
  /**
   * Open handle as an input stream.
   */
  in(): sys.InStream;
  /**
   * Read entire input stream into memory as buffer
   */
  inToBuf(): sys.Buf;
  /**
   * Process input stream and guarnatee closed. Return null.
   */
  withOut(f: ((arg0: sys.OutStream) => void)): sys.JsObj | null;
  /**
   * Get this handle as a file or throw ArgErr if not a file
   */
  toFile(func: string): sys.File;
  /**
   * Constructor from arbitrary object:
   * - sys::Str
   * - sys::Uri like "io/..."
   * - sys::Dict
   * - sys::Buf
   */
  static fromObj(rt: hx.HxRuntime, h: sys.JsObj | null): IOHandle;
}

/**
 * IOTest
 */
export class IOTest extends hx.HxTest {
  static type$: sys.Type
  testBufHandle(): void;
  test(): void;
  verifyEvalErrMsg($axon: string, msg: string): void;
  verifySkipBom(bytes: sys.List<number>, charset: sys.Charset): void;
  static make(...args: unknown[]): IOTest;
  verifyCharset(charset: string): void;
}

/**
 * I/O function library
 */
export class IOLib extends hx.HxLib implements hx.HxIOService {
  static type$: sys.Type
  write(handle: sys.JsObj | null, f: ((arg0: sys.OutStream) => void)): sys.JsObj | null;
  static make(...args: unknown[]): IOLib;
  read(handle: sys.JsObj | null, f: ((arg0: sys.InStream) => sys.JsObj | null)): sys.JsObj | null;
  services(): sys.List<hx.HxService>;
}

/**
 * IOUtil is used to map an object to a File for use in email
 * attachments, etc
 */
export class IOUtil extends sys.Obj {
  static type$: sys.Type
  /**
   * Convert I/O handle to a file
   */
  static toFile(cx: hx.HxContext, obj: sys.JsObj, debugAction: string): sys.File;
  static make(...args: unknown[]): IOUtil;
}

