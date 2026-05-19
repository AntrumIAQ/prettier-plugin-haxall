import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as inet from './inet.js';

/**
 * WebMod defines a web modules which is plugged into a web
 * server's URI namespace to service web requests.
 * 
 * See [pod doc](pod-doc#webmod).
 */
export class WebMod extends sys.Obj implements Weblet {
  static type$: sys.Type
  /**
   * Initialization callback when web server is started.
   */
  onStart(): void;
  static make(...args: unknown[]): WebMod;
  /**
   * Cleanup callback when web server is stoppped.
   */
  onStop(): void;
  /**
   * The WebRes instance for this current web request.  Raise an
   * exception if the current actor thread is not serving a web
   * request.
   */
  res(): WebRes;
  /**
   * Convenience method to respond to a POST request. Default
   * implementation returns a 501 Not implemented error.
   */
  onPost(): void;
  /**
   * Convenience method to respond to a HEAD request. Default
   * implementation returns a 501 Not implemented error.
   */
  onHead(): void;
  /**
   * Convenience method to respond to a DELETE request. Default
   * implementation returns a 501 Not implemented error.
   */
  onDelete(): void;
  /**
   * Convenience method to respond to a OPTIONS request. Default
   * implementation returns a 501 Not implemented error.
   */
  onOptions(): void;
  /**
   * Convenience method to respond to a GET request. Default
   * implementation returns a 501 Not implemented error.
   */
  onGet(): void;
  /**
   * Convenience method to respond to a TRACE request. Default
   * implementation returns a 501 Not implemented error.
   */
  onTrace(): void;
  /**
   * The WebReq instance for this current web request.  Raise an
   * exception if the current actor thread is not serving a web
   * request.
   */
  req(): WebReq;
  /**
   * Service a web request. The default implementation routes to {@link onGet | onGet},
   * {@link onPost | onPost}, etc based on the request's method.
   */
  onService(): void;
  /**
   * Convenience method to respond to a PUT request. Default
   * implementation returns a 501 Not implemented error.
   */
  onPut(): void;
}

/**
 * Cookie models an HTTP cookie used to pass data between the
 * server and user agent as defined by [RFC 6265](http://tools.ietf.org/html/rfc6265).
 * 
 * See {@link WebReq.cookies | WebReq.cookies} and {@link WebRes.cookies | WebRes.cookies}.
 */
export class Cookie extends sys.Obj {
  static type$: sys.Type
  /**
   * Value string of the cookie.
   */
  val(): string;
  __val(it: string): void;
  /**
   * If true, then the client only sends this cookie using a
   * secure protocol such as HTTPS.  Defaults to false.
   */
  secure(): boolean;
  __secure(it: boolean): void;
  /**
   * Specifies the subset of URLs to which the cookie applies. If
   * set to "/" (the default), then the cookie applies to all
   * paths.  If the path is null, it as assumed to be the same
   * path as the document being described by the header which
   * contains the cookie.
   */
  path(): string | null;
  __path(it: string | null): void;
  /**
   * Defines the lifetime of the cookie, after the the max-age
   * elapses the client should discard the cookie.  The duration
   * is floored to seconds (fractional seconds are truncated). If
   * maxAge is null (the default) then the  cookie persists until
   * the client is shutdown.  If zero is specified, the cookie is
   * discarded immediately.  Note that many browsers still don't
   * recognize max-age, so setting max-age also always includes
   * an expires attribute.
   */
  maxAge(): sys.Duration | null;
  __maxAge(it: sys.Duration | null): void;
  /**
   * Specifies the domain for which the cookie is valid. An
   * explicit domain must always start with a dot.  If null (the
   * default) then the cookie only applies to the server which
   * set it.
   */
  domain(): string | null;
  __domain(it: string | null): void;
  /**
   * If this value is non-null, then we add the SameSite
   * attribute to the cookie. Valid values are
   * - `lax`
   * - `strict` By default we set the attribute to `strict`
   */
  sameSite(): string | null;
  __sameSite(it: string | null): void;
  /**
   * Name of the cookie.
   */
  name(): string;
  __name(it: string): void;
  /**
   * If true, then the cookie is not available to JavaScript.
   * Defaults to true.
   */
  httpOnly(): boolean;
  __httpOnly(it: boolean): void;
  /**
   * Return the cookie formatted as an Set-Cookie HTTP header.
   */
  toStr(): string;
  /**
   * Parse a HTTP cookie header name/value pair. The parsing of
   * the name-value pair is done according to the algorithm
   * outlined in [§ 5.2](http://tools.ietf.org/html/rfc6265#section-5.2)
   * of the RFC.
   * 
   * Throw ParseErr or return null if not formatted correctly.
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Cookie;
  /**
   * Construct with name and value.  The name must be a valid
   * HTTP token and must not start with "$" (see {@link WebUtil.isToken | WebUtil.isToken}).
   * The value string must be an ASCII string within the
   * inclusive range of 0x20 and 0x7e (see {@link WebUtil.toQuotedStr | WebUtil.toQuotedStr})
   * with the exception of the semicolon.
   * 
   * Fantom cookies will use quoted string values, however some
   * browsers such as IE won't parse a quoted string with
   * semicolons correctly, so we make semicolons illegal.  If you
   * have a value which might include non-ASCII characters or
   * semicolons, then consider encoding using something like
   * Base64:
   * ```
   * // write response
   * res.cookies.add(Cookie("baz", val.toBuf.toBase64))
   * 
   * // read from request
   * val := Buf.fromBase64(req.cookies.get("baz", "")).readAllStr
   * ```
   */
  static make(name: string, val: string, f?: ((arg0: Cookie) => void) | null, ...args: unknown[]): Cookie;
}

/**
 * FileWeblet is used to service an HTTP request on a {@link sys.File | sys::File}.
 * It handles all the dirty details for cache control,
 * compression, modification time, ETags, etc.
 * 
 * Default implementation uses gzip encoding if gzip is
 * supported by the client and the file's MIME type has a
 * "text" media type.
 * 
 * Current implementation supports ETags and Modification time
 * for cache validation.  It does not specify any cache control
 * directives.
 */
export class FileWeblet extends sys.Obj implements Weblet {
  static type$: sys.Type
  /**
   * Extra response headers to add for all 3xx and 2xx responses
   */
  extraResHeaders(): sys.Map<string, string> | null;
  extraResHeaders(it: sys.Map<string, string> | null): void;
  /**
   * The file being serviced by this FileWeblet.
   */
  file(): sys.File;
  /**
   * Checks if the file being served is under the given
   * directory. If it is not, a 404 response is immediately sent,
   * short-circuiting any further attempts to serve the file.
   * ```
   * FileWeblet(file).checkUnderDir(dir).onService
   * ```
   */
  checkUnderDir(dir: sys.File): this;
  /**
   * Get the modified time of the file floored to 1 second which
   * is the most precise that HTTP can deal with.
   */
  modified(): sys.DateTime;
  /**
   * Constructor with file to service.
   */
  static make(file: sys.File, ...args: unknown[]): FileWeblet;
  /**
   * Handle GET request for the file.
   */
  onGet(): void;
  /**
   * Compute the ETag for the file being serviced which uniquely
   * identifies the file version.  The default implementation is
   * a hash of the modified time and the file size.  The result
   * of this method must conform to the ETag syntax and be
   * wrapped in quotes.
   */
  etag(): string;
  onService(): void;
  /**
   * The WebRes instance for this current web request.  Raise an
   * exception if the current actor thread is not serving a web
   * request.
   */
  res(): WebRes;
  /**
   * Convenience method to respond to a POST request. Default
   * implementation returns a 501 Not implemented error.
   */
  onPost(): void;
  /**
   * Convenience method to respond to a HEAD request. Default
   * implementation returns a 501 Not implemented error.
   */
  onHead(): void;
  /**
   * Convenience method to respond to a DELETE request. Default
   * implementation returns a 501 Not implemented error.
   */
  onDelete(): void;
  /**
   * Convenience method to respond to a OPTIONS request. Default
   * implementation returns a 501 Not implemented error.
   */
  onOptions(): void;
  /**
   * Convenience method to respond to a TRACE request. Default
   * implementation returns a 501 Not implemented error.
   */
  onTrace(): void;
  /**
   * The WebReq instance for this current web request.  Raise an
   * exception if the current actor thread is not serving a web
   * request.
   */
  req(): WebReq;
  /**
   * Convenience method to respond to a PUT request. Default
   * implementation returns a 501 Not implemented error.
   */
  onPut(): void;
}

/**
 * Weblet services a web request.
 * 
 * See [pod doc](pod-doc#weblet).
 */
export abstract class Weblet extends sys.Obj {
  static type$: sys.Type
  /**
   * The WebRes instance for this current web request.  Raise an
   * exception if the current actor thread is not serving a web
   * request.
   */
  res(): WebRes;
  /**
   * Convenience method to respond to a POST request. Default
   * implementation returns a 501 Not implemented error.
   */
  onPost(): void;
  /**
   * Convenience method to respond to a HEAD request. Default
   * implementation returns a 501 Not implemented error.
   */
  onHead(): void;
  /**
   * Convenience method to respond to a DELETE request. Default
   * implementation returns a 501 Not implemented error.
   */
  onDelete(): void;
  /**
   * Convenience method to respond to a OPTIONS request. Default
   * implementation returns a 501 Not implemented error.
   */
  onOptions(): void;
  /**
   * Convenience method to respond to a GET request. Default
   * implementation returns a 501 Not implemented error.
   */
  onGet(): void;
  /**
   * Convenience method to respond to a TRACE request. Default
   * implementation returns a 501 Not implemented error.
   */
  onTrace(): void;
  /**
   * The WebReq instance for this current web request.  Raise an
   * exception if the current actor thread is not serving a web
   * request.
   */
  req(): WebReq;
  /**
   * Service a web request. The default implementation routes to {@link onGet | onGet},
   * {@link onPost | onPost}, etc based on the request's method.
   */
  onService(): void;
  /**
   * Convenience method to respond to a PUT request. Default
   * implementation returns a 501 Not implemented error.
   */
  onPut(): void;
}

/**
 * WebUtil encapsulates several useful utility web methods.
 * Also see {@link sys.MimeType | sys::MimeType} and its utility
 * methods.
 */
export class WebUtil extends sys.Obj {
  static type$: sys.Type
  /**
   * Return if given char unicode point is allowable within the
   * HTTP token production.  See {@link isToken | isToken}.
   */
  static isTokenChar(c: number): boolean;
  /**
   * Wrap the given output stream to write a fixed number of
   * bytes. Once `fixed` bytes have been written, attempting to
   * further bytes will throw IOErr.  Closing the wrapper stream
   * does not close the underlying stream.
   */
  static makeFixedOutStream(out: sys.OutStream, fixed: number): sys.OutStream;
  /**
   * Parse a list of comma separated tokens.  Any leading or
   * trailing whitespace is trimmed from the list of tokens.
   */
  static parseList(s: string): sys.List<string>;
  /**
   * Decode a HTTP quoted string according to RFC 2616 Section
   * 2.2. The given string must be wrapped in quotes.  See {@link toQuotedStr | toQuotedStr}.
   */
  static fromQuotedStr(s: string): string;
  /**
   * Wrap the given input stream to read a fixed number of bytes.
   * Once `fixed` bytes have been read from the underlying input
   * stream, the wrapped stream will return end-of-stream. 
   * Closing the wrapper stream does not close the underlying
   * stream.
   */
  static makeFixedInStream(in$: sys.InStream, fixed: number): sys.InStream;
  /**
   * Return if the specified string is a valid HTTP token
   * production which is any ASCII character which is not a
   * control char or a separator.  The separators characters are:
   * ```
   * "(" | ")" | "<" | ">" | "@" |
   * "," | ";" | ":" | "\" | <"> |
   * "/" | "[" | "]" | "?" | "=" |
   * "{" | "}" | SP | HT
   * ```
   */
  static isToken(s: string): boolean;
  /**
   * Parse a series of HTTP headers according to RFC 2616 section
   * 4.2.  The final CRLF which terminates headers is consumed
   * with the stream positioned immediately following.  The
   * headers are returned as a {@link sys.Map.caseInsensitive | case insensitive}
   * map. Throw ParseErr if headers are malformed.
   */
  static parseHeaders(in$: sys.InStream): sys.Map<string, string>;
  static make(...args: unknown[]): WebUtil;
  /**
   * Return the specified string as a HTTP quoted string
   * according to RFC 2616 Section 2.2.  The result is wrapped in
   * quotes.  Throw ArgErr if any character is outside of the
   * ASCII range of 0x20 to 0x7e.  The quote char itself is
   * backslash escaped. See {@link fromQuotedStr | fromQuotedStr}.
   */
  static toQuotedStr(s: string): string;
  /**
   * Wrap the given input stream to read bytes using a HTTP
   * chunked transfer encoding.  The wrapped streams provides a
   * contiguous stream of bytes until the last chunk is read.
   * Closing the wrapper stream does not close the underlying
   * stream.
   */
  static makeChunkedInStream(in$: sys.InStream): sys.InStream;
  /**
   * Parse a multipart/form-data input stream.  For each part in
   * the stream call the given callback function with the part's
   * headers and an input stream used to read the part's body. 
   * Each callback must completely drain the input stream to
   * prepare for the next part.  Also see {@link WebReq.parseMultiPartForm | WebReq.parseMultiPartForm}.
   */
  static parseMultiPart(in$: sys.InStream, boundary: string, cb: ((arg0: sys.Map<string, string>, arg1: sys.InStream) => void)): void;
  /**
   * Given an HTTP header that uses q values, return a map of
   * name/q-value pairs.  This map has a def value of 0.
   * 
   * Example:
   * ```
   * compress,gzip              =>  ["compress":1f, "gzip":1f]
   * compress;q=0.5,gzip;q=0.0  =>  ["compress":0.5f, "gzip":0.0f]
   * ```
   */
  static parseQVals(s: string): sys.Map<string, number>;
  /**
   * Given a set of headers, wrap the specified output stream to
   * write the content body:
   * 1. If Content-Length then {@link makeFixedOutStream | makeFixedOutStream}
   * 2. If Content-Type then set Transfer-Encoding header to chunked
   *   and return {@link makeChunkedOutStream | makeChunkedOutStream}
   * 3. Assume no content and return null
   * 
   * If a stream is returned, then it is automatically configured
   * with the correct content encoding based on the Content-Type.
   */
  static makeContentOutStream(headers: sys.Map<string, string>, out: sys.OutStream): sys.OutStream | null;
  /**
   * Given a set of HTTP headers map Content-Type to its charset
   * or default to UTF-8.
   */
  static headersToCharset(headers: sys.Map<string, string>): sys.Charset;
  /**
   * Generate the method invocation code used to boostrap into
   * JavaScript from a webpage.  This *must* be called inside the `<head>`
   * tag for the page.  The main method will be invoked using the
   * `onLoad` DOM event.
   * 
   * The `main` argument can be either a type or method.  If no
   * method is specified, `main` is used.  If the method is not
   * static, a new instance of type is created:
   * ```
   * "foo::Instance"     =>  Instance().main()
   * "foo::Instance.bar" =>  Instance().bar()
   * "foo::Static"       =>  Static.main()
   * "foo::Static.bar"   =>  Static.bar()
   * ```
   * 
   * If `env` is specified, then vars will be added to and
   * available from {@link sys.Env.vars | sys::Env.vars} on
   * client-side.
   */
  static jsMain(out: sys.OutStream, main: string, env?: sys.Map<string, string> | null): void;
  /**
   * Given a set of headers, wrap the specified input stream to
   * read the content body:
   * 1. If Content-Encoding is `gzip` then wrap via {@link sys.Zip.gzipInStream | sys::Zip.gzipInStream}
   * 2. If Content-Length then {@link makeFixedInStream | makeFixedInStream}
   * 3. If Transfer-Encoding is chunked then {@link makeChunkedInStream | makeChunkedInStream}
   * 4. If Content-Type assume non-pipelined connection and return `in`
   *   directly
   * 
   * If a stream is returned, then it is automatically configured
   * with the correct content encoding based on the Content-Type.
   */
  static makeContentInStream(headers: sys.Map<string, string>, in$: sys.InStream): sys.InStream;
  /**
   * Wrap the given output stream to write bytes using a HTTP
   * chunked transfer encoding.  Closing the wrapper stream
   * terminates the chunking, but does not close the underlying
   * stream.
   */
  static makeChunkedOutStream(out: sys.OutStream): sys.OutStream;
}

/**
 * WebSession provides a name/value map associated with a
 * specific browser "connection" to the web server.  Any values
 * stored in a WebSession must be both immutable and
 * serializable.  Get the current WebSession via {@link WebReq.session | WebReq.session}.
 * 
 * See [pod doc](pod-doc#sessions).
 */
export class WebSession extends sys.Obj {
  static type$: sys.Type
  /**
   * Return {@link id | id}.
   */
  toStr(): string;
  /**
   * Set a session value which must be immutable and
   * serializable.
   */
  set(name: string, val: sys.JsObj | null): void;
  /**
   * Delete this web session which clears both the user agent
   * cookie and the server side session instance. This method
   * must be called before the WebRes is committed otherwise the
   * server side instance is cleared, but the user agent cookie
   * will remain uncleared.
   */
  delete(): void;
  /**
   * Iterate the key/value pairs
   */
  each(f: ((arg0: sys.JsObj | null, arg1: string) => void)): void;
  /**
   * Remove a session key
   */
  remove(name: string): void;
  /**
   * Get session value or return def if not defined.
   */
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Get the unique id used to identify this session.
   */
  id(): string;
  /**
   * Application name/value pairs which are persisted between
   * HTTP requests.  The values stored in this map must be
   * serializable.
   */
  map(): sys.Map<string, sys.JsObj | null>;
  static make(...args: unknown[]): WebSession;
}

/**
 * UtilTest
 */
export class UtilTest extends sys.Test {
  static type$: sys.Type
  testToQuotedStr(): void;
  static main(args: sys.List<string>): void;
  testParseList(): void;
  testParseMultiPart(): void;
  static make(...args: unknown[]): UtilTest;
  testIsToken(): void;
  testMultiPart1023(): void;
  testChunkOutStream(): void;
  testParseQVals(): void;
  verifyQuotedStr(s: string, expected: string): void;
  testFixedOutStream(): void;
  testChunkInStream(): void;
  testParseHeaders(): void;
}

/**
 * CookieTest
 */
export class CookieTest extends sys.Test {
  static type$: sys.Type
  testSession(): void;
  static make(...args: unknown[]): CookieTest;
  test(): void;
  verifyCookie(a: Cookie, b: Cookie): void;
}

/**
 * WebOutStreamTest
 */
export class WebOutStreamTest extends sys.Test {
  static type$: sys.Type
  testXml(): void;
  verifyEsc(input: sys.JsObj | null, match: string): void;
  static make(...args: unknown[]): WebOutStreamTest;
  testGeneral(): void;
  testEsc(): void;
  testHtml(): void;
  verifyOut(bufOrStrBuf: sys.JsObj, match: string | null): void;
}

/**
 * The `WebClient` class is used to manage client side HTTP
 * requests and responses.  The basic lifecycle of WebClient:
 * 1. configure request fields such as `reqUri`, `reqMethod`, and `reqHeaders`
 * 2. send request headers via `writeReq`
 * 3. optionally write request body via `reqOut`
 * 4. read response status and headers via `readRes`
 * 5. process response fields such as `resCode` and `resHeaders`
 * 6. optionally read response body via `resIn`
 * 
 * Using the low level methods `writeReq` and `readRes` enables
 * HTTP pipelining (multiple requests and responses on the same
 * TCP socket connection).  There are also a series of
 * convenience methods which make common cases easier.
 * 
 * See [pod doc](pod-doc#webClient) and [examples](examples::web-client).
 */
export class WebClient extends sys.Obj {
  static type$: sys.Type
  /**
   * The HTTP method for the request.  Defaults to "GET".
   */
  reqMethod(): string;
  reqMethod(it: string): void;
  /**
   * HTTP version returned by response.
   */
  resVersion(): sys.Version;
  resVersion(it: sys.Version): void;
  /**
   * When set to true a 3xx response with a Location header will
   * automatically update the {@link reqUri | reqUri} field and
   * retry the request using the alternate URI.  Redirects are
   * not followed if the request has a content body.
   */
  followRedirects(): boolean;
  followRedirects(it: boolean): void;
  /**
   * HTTP version to use for request must be 1.0 or 1.1. Default
   * is 1.1.
   */
  reqVersion(): sys.Version;
  reqVersion(it: sys.Version): void;
  /**
   * The absolute URI of request.
   */
  reqUri(): sys.Uri;
  reqUri(it: sys.Uri): void;
  /**
   * The HTTP headers to use for the next request.  This map uses
   * case insensitive keys.  The "Host" header is implicitly
   * defined by `reqUri` and must not be defined in this map.
   */
  reqHeaders(): sys.Map<string, string>;
  reqHeaders(it: sys.Map<string, string>): void;
  /**
   * If non-null, then all requests are routed through this proxy
   * address (host and port).  Default is configured in
   * "etc/web/config.props" with the key "proxy".  Proxy
   * exceptions can be configured with the "proxy.exceptions"
   * config key as comma separated list of Regex globs.
   */
  proxy(): sys.Uri | null;
  proxy(it: sys.Uri | null): void;
  /**
   * HTTP headers returned by response.
   */
  resHeaders(): sys.Map<string, string>;
  resHeaders(it: sys.Map<string, string>): void;
  /**
   * Cookies to pass for "Cookie" request header.  If set to an
   * empty list then the "Cookie" request header is removed. 
   * After a request has been completed if the "Set-Cookie"
   * response header specified one or more cookies then this
   * field is automatically updated with the server specified
   * cookies.
   */
  cookies(): sys.List<Cookie>;
  cookies(it: sys.List<Cookie>): void;
  /**
   * The {@link inet.SocketConfig | inet::SocketConfig} to use for
   * creating sockets
   */
  socketConfig(): inet.SocketConfig;
  socketConfig(it: inet.SocketConfig): void;
  /**
   * HTTP status reason phrase returned by response.
   */
  resPhrase(): string;
  resPhrase(it: string): void;
  /**
   * HTTP status code returned by response.
   */
  resCode(): number;
  resCode(it: number): void;
  /**
   * Input stream to read response content.  The input stream
   * will correctly handle end of stream when the content has
   * been fully read.  If the "Content-Length" header was
   * specified the end of stream is based on the fixed number of
   * bytes.  If the "Transfer-Encoding" header defines a chunked
   * encoding, then chunks are automatically handled.  If the
   * response has no content body, then throw IOErr.
   * 
   * The response input stream is automatically configured with
   * the correct character encoding if one is specified in the
   * "Content-Type" response header.
   * 
   * Also see convenience methods: {@link resStr | resStr} and {@link resBuf | resBuf}.
   */
  resIn(): sys.InStream;
  /**
   * Authenticate request using HTTP Basic with given username
   * and password.
   */
  authBasic(username: string, password: string): this;
  /**
   * Get a response header.  If not found and checked is false
   * then return true, otherwise throw Err.
   */
  resHeader(key: string, checked?: boolean): string | null;
  /**
   * Get the output stream used to write the request body.  This
   * stream is only available if the request headers included a
   * "Content-Type" header.  If an explicit "Content-Length" was
   * specified then this is a fixed length output stream,
   * otherwise the request is automatically configured to use a
   * chunked transfer encoding.  This stream should be closed
   * once the content has been fully written.
   */
  reqOut(): sys.OutStream;
  /**
   * Convenience for `writeForm("POST", form).readRes`
   */
  postForm(form: sys.Map<string, string>): this;
  /**
   * Convenience for `writeBuf("POST", content).readRes`
   */
  postBuf(buf: sys.Buf): this;
  /**
   * Make a request with the given HTTP method to the URI using
   * UTF-8 encoding of given string.  If Content-Type is not
   * already set, then set it to "text/plain; charset=utf-8". 
   * This method does not support the ["Expect" header](pod-doc#expectContinue)
   * (it writes full string before reading response). Should
   * primarily be used for "POST" and "PATCH" requests.
   */
  writeStr(method: string, content: string): this;
  /**
   * Convenience for `writeFile("POST", file).readRes`
   */
  postFile(file: sys.File): this;
  /**
   * Make a GET request and return the response content as an
   * in-memory byte buffer.  The web client is automatically
   * closed. Throw IOErr is response is not 200.
   */
  getBuf(): sys.Buf;
  /**
   * Return the entire response back as an in-memory string.
   * Convenience for `resIn.readAllStr`.
   */
  resStr(): string;
  /**
   * Make a GET request and return the input stream to the
   * response or throw IOErr if response is not 200.  It is the
   * caller's responsibility to close this web client.
   */
  getIn(): sys.InStream;
  /**
   * Return if this web client is currently connected to the
   * remote host.
   */
  isConnected(): boolean;
  /**
   * Write the request line and request headers.  Once this
   * method completes the request body may be written via {@link reqOut | reqOut},
   * or the response may be immediately read via {@link readRes | readRes}.
   * Throw IOErr if there is a network or protocol error.  Return
   * this.
   */
  writeReq(): this;
  /**
   * Read the response status line and response headers.  This
   * method may be called after the request has been written via {@link writeReq | writeReq}
   * and {@link reqOut | reqOut}.  Once this method completes the
   * response status and headers are available.  If there is a
   * response body, it is available for reading via {@link resIn | resIn}.
   * Throw IOErr if there is a network or protocol error.  Return
   * this.
   */
  readRes(): this;
  /**
   * Construct with optional request URI.
   */
  static make(reqUri?: sys.Uri | null, ...args: unknown[]): WebClient;
  /**
   * Write a file using the given HTTP method to the URI.  If
   * Content-Type header is not already set, then it is set from
   * the file extension's MIME type. This method does not support
   * the ["Expect" header](pod-doc#expectContinue) (it writes full
   * file before reading response). Should primarily be used for
   * "POST" and "PATCH" requests.
   */
  writeFile(method: string, file: sys.File): this;
  /**
   * Close the HTTP request and the underlying socket.  Return
   * this.
   */
  close(): this;
  /**
   * Convenience for `writeStr("POST", content).readRes`
   */
  postStr(content: string): this;
  /**
   * Write a binary buffer using the given HTTP method to the
   * URI.  If Content-Type header is not already set, then it is
   * set as ""application/octet-stream". This method does not
   * support the ["Expect" header](pod-doc#expectContinue)
   */
  writeBuf(method: string, content: sys.Buf): this;
  /**
   * Make a request with the given HTTP method to the URI with
   * the given form data. Set the Content-Type to
   * application/x-www-form-urlencoded. This method does not
   * support the ["Expect" header](pod-doc#expectContinue) (it
   * writes all form data before reading response). Should
   * primarily be used for POST and PATCH requests.
   */
  writeForm(method: string, form: sys.Map<string, string>): this;
  socketOptions(): inet.SocketOptions;
  /**
   * Make a GET request and return the response content as an
   * in-memory string.  The web client is automatically closed.
   * Throw IOErr is response is not 200.
   */
  getStr(): string;
  /**
   * Return the entire response back as an in-memory byte buffer.
   * Convenience for `resIn.readAllBuf`.
   */
  resBuf(): sys.Buf;
}

/**
 * WebOutStream provides methods for generating XML and XHTML
 * content.
 */
export class WebOutStream extends sys.OutStream {
  static type$: sys.Type
  /**
   * Start a <select> tag.
   */
  select(attrs?: string | null): this;
  /**
   * Write out a complete <hr/> tag.
   */
  hr(attrs?: string | null): this;
  /**
   * Convenience for input("type='text'" + attrs).
   */
  textField(attrs?: string | null): this;
  /**
   * Convenience for input("type='password'" + attrs).
   */
  password(attrs?: string | null): this;
  /**
   * Customize how the JavaScript runtime environment is
   * initialized. This method *must* be called inside the `<head>`
   * tag, and also before `sys.js` is loaded in order to take
   * effect.
   * 
   * Note this method is not necessary if no customization is
   * needed. The JS runtime will automatically initialize using
   * default values.
   * 
   * The following variables are supported:
   * - `timezone`: set the default TimeZone for JsVM
   * - `locale`: set the default Locale for the JsVM. Note you must
   *   manually provide the locale config.props files. See {@link FilePack.toLocaleJsFile | FilePack.toLocaleJsFile}.
   * - `main`: an optional method to invoke after the page has been
   *   loaded. The `main` argument can be either a type or method. 
   *   If no method is specified, `main` is used. If the method is
   *   not static, a new instance of type is created:
   * ```
   * "foo::Instance"     =>  Instance().main()
   * "foo::Instance.bar" =>  Instance().bar()
   * "foo::Static"       =>  Static.main()
   * "foo::Static.bar"   =>  Static.bar()
   * ```
   */
  initJs(env: sys.Map<string, string>): this;
  /**
   * End a <aside> tag.
   */
  asideEnd(): this;
  /**
   * End a <h5> tag.
   */
  h5End(): this;
  /**
   * Start a <nav> tag.
   */
  nav(attrs?: string | null): this;
  /**
   * End a <span> tag.
   */
  spanEnd(): this;
  /**
   * Write a complete <link> tag for an external CSS stylesheet.
   * If this URI has already been included in this WebOutStream
   * instance, then this method does nothing.
   */
  includeCss(href: sys.Uri): this;
  /**
   * End a <div> tag.
   */
  divEnd(): this;
  /**
   * Start a <script> tag.
   */
  script(attrs?: string | null): this;
  /**
   * End a <footer> tag.
   */
  footerEnd(): this;
  /**
   * Write a complete <input> tag.
   */
  input(attrs?: string | null): this;
  /**
   * End a <b> tag.
   */
  bEnd(): this;
  /**
   * Start a <style> tag.
   */
  style(attrs?: string | null): this;
  /**
   * End a <li> tag.
   */
  liEnd(): this;
  /**
   * End a <header> tag.
   */
  headerEnd(): this;
  /**
   * Write out a complete <br/> tag.
   */
  br(): this;
  /**
   * End a <textarea> tag.
   */
  textAreaEnd(): this;
  /**
   * Write a complete <link> tag for a RSS feed resource.
   */
  rss(href: sys.Uri, attrs?: string | null): this;
  /**
   * End a <th> tag.
   */
  thEnd(): this;
  /**
   * End a <section> tag.
   */
  sectionEnd(): this;
  /**
   * Convenience for input("type='checkbox'" + attrs)
   */
  checkbox(attrs?: string | null): this;
  /**
   * Start a <table> tag.
   */
  table(attrs?: string | null): this;
  /**
   * End a <h2> tag.
   */
  h2End(): this;
  /**
   * Start a <a> tag.
   */
  a(href: sys.Uri, attrs?: string | null): this;
  /**
   * Start a <b> tag.
   */
  b(attrs?: string | null): this;
  /**
   * Write the XHTML Strict DOCTYPE.
   */
  docType(): this;
  /**
   * End a <ul> tag.
   */
  ulEnd(): this;
  /**
   * Start a <i> tag.
   */
  i(attrs?: string | null): this;
  /**
   * Start a <p> tag.
   */
  p(attrs?: string | null): this;
  /**
   * Start a <tfoot> tag.
   */
  tfoot(attrs?: string | null): this;
  /**
   * Start a <td> tag.
   */
  td(attrs?: string | null): this;
  /**
   * End a <label> tag.
   */
  labelEnd(): this;
  /**
   * Write the HTML5 DOCTYPE.
   */
  docType5(): this;
  /**
   * Start a <th> tag.
   */
  th(attrs?: string | null): this;
  /**
   * Write `obj.toStr` to the stream as valid XML text.  The
   * special control characters amp, lt, apos and quot are always
   * escaped.  The gt char is escaped only if it is the first
   * char or if preceeded by the `]` char.  Also see {@link sys.Str.toXml | sys::Str.toXml}.
   * If obj is null, then "null" is written.
   */
  esc(obj: sys.JsObj | null): this;
  /**
   * Convenience for writeChars(obj.toStr).
   */
  w(obj: sys.JsObj | null): this;
  /**
   * End a <p> tag.
   */
  pEnd(): this;
  /**
   * Write a complete <link> tag for an Atom feed resource.
   */
  atom(href: sys.Uri, attrs?: string | null): this;
  /**
   * Start a <li> tag.
   */
  li(attrs?: string | null): this;
  /**
   * Start a <tr> tag.
   */
  tr(attrs?: string | null): this;
  /**
   * End a <style> tag.
   */
  styleEnd(): this;
  /**
   * Start a <span> tag.
   */
  span(attrs?: string | null): this;
  /**
   * Start a <textarea> tag.
   */
  textArea(attrs?: string | null): this;
  /**
   * End a <dl> tag.
   */
  dlEnd(): this;
  /**
   * Start a <dd> tag.
   */
  dd(attrs?: string | null): this;
  /**
   * End a <h1> tag.
   */
  h1End(): this;
  /**
   * End a <i> tag.
   */
  iEnd(): this;
  /**
   * Start a <tbody> tag.
   */
  tbody(attrs?: string | null): this;
  /**
   * End a <thead> tag.
   */
  theadEnd(): this;
  /**
   * Start a <dl> tag.
   */
  dl(attrs?: string | null): this;
  /**
   * End a <select> tag.
   */
  selectEnd(): this;
  /**
   * Start a <main> tag.
   */
  main(attrs?: string | null): this;
  /**
   * Start a <section> tag.
   */
  section(attrs?: string | null): this;
  /**
   * Start a <body> tag.
   */
  body(attrs?: string | null): this;
  /**
   * End a <code> tag.
   */
  codeEnd(): this;
  /**
   * End a <table> tag.
   */
  tableEnd(): this;
  /**
   * Convenience for input("type='radio'" + attrs)
   */
  radio(attrs?: string | null): this;
  /**
   * Start a <div> tag.
   */
  div(attrs?: string | null): this;
  /**
   * Start a <dt> tag.
   */
  dt(attrs?: string | null): this;
  /**
   * Convenience for writeChars(Str.spaces(numSpaces)).
   */
  tab(numSpaces?: number): this;
  /**
   * End a <dd> tag.
   */
  ddEnd(): this;
  /**
   * End a <a> tag.
   */
  aEnd(): this;
  /**
   * Start a <ul> tag.
   */
  ul(attrs?: string | null): this;
  /**
   * Write an end tag.
   */
  tagEnd(elemName: string): this;
  /**
   * Start a <html> tag.
   */
  html(): this;
  /**
   * Write a start tag. Use attrs to fully specify the attributes
   * manually. Use empty to optionally close this element without
   * using an end tag.
   */
  tag(elemName: string, attrs?: string | null, empty?: boolean): this;
  /**
   * End a <html> tag.
   */
  htmlEnd(): this;
  /**
   * End a <body> tag.
   */
  bodyEnd(): this;
  /**
   * End a <dt> tag.
   */
  dtEnd(): this;
  /**
   * Start a <pre> tag.
   */
  pre(attrs?: string | null): this;
  /**
   * Start a <em> tag.
   */
  em(attrs?: string | null): this;
  /**
   * End a <tbody> tag.
   */
  tbodyEnd(): this;
  /**
   * End a <pre> tag.
   */
  preEnd(): this;
  /**
   * Start a <article> tag.
   */
  article(attrs?: string | null): this;
  /**
   * Start a <aside> tag.
   */
  aside(attrs?: string | null): this;
  /**
   * Start a <header> tag.
   */
  header(attrs?: string | null): this;
  /**
   * End a <head> tag.
   */
  headEnd(): this;
  /**
   * End a <h4> tag.
   */
  h4End(): this;
  /**
   * Convenience for writeChar(`\n`).
   */
  nl(): this;
  /**
   * Start a <option> tag.
   */
  option(attrs?: string | null): this;
  /**
   * End a <h3> tag.
   */
  h3End(): this;
  /**
   * Write a complete <img> tag.
   */
  img(src: sys.Uri, attrs?: string | null): this;
  /**
   * Start a <code> tag.
   */
  code(attrs?: string | null): this;
  /**
   * Convenience for input("type='hidden'" + attrs).
   */
  hidden(attrs?: string | null): this;
  /**
   * Convenience for input("type='submit'" + attrs).
   */
  submit(attrs?: string | null): this;
  /**
   * Start a <footer> tag.
   */
  footer(attrs?: string | null): this;
  /**
   * Start a <thead> tag.
   */
  thead(attrs?: string | null): this;
  /**
   * Start a <h1> tag.
   */
  h1(attrs?: string | null): this;
  /**
   * Start a <h2> tag.
   */
  h2(attrs?: string | null): this;
  /**
   * Start a <h3> tag.
   */
  h3(attrs?: string | null): this;
  /**
   * Write a complete <title> tag.
   */
  title(attrs?: string | null): this;
  /**
   * Start a <h4> tag.
   */
  h4(attrs?: string | null): this;
  /**
   * Start a <h5> tag.
   */
  h5(attrs?: string | null): this;
  /**
   * Start a <h6> tag.
   */
  h6(attrs?: string | null): this;
  /**
   * Start a <head> tag.
   */
  head(): this;
  /**
   * Convenience for input("type='button'" + attrs).
   */
  button(attrs?: string | null): this;
  /**
   * End a <article> tag.
   */
  articleEnd(): this;
  /**
   * End a <em> tag.
   */
  emEnd(): this;
  /**
   * Write a complete <script> tag for an external JavaScript
   * file. If this URI has already been included in this
   * WebOutStream instance, then this method does nothing.
   */
  includeJs(href?: sys.Uri | null): this;
  /**
   * Write a complete <link> tag for a favicon.  You must
   * specifiy the MIME type for your icon in the `attrs` argument:
   * ```
   * out.favIcon(`/fav.png`, "type='image/png'")
   * ```
   */
  favIcon(href: sys.Uri, attrs?: string | null): this;
  /**
   * End a <option> tag.
   */
  optionEnd(): this;
  /**
   * End a <td> tag.
   */
  tdEnd(): this;
  /**
   * Construct a WebOutStream that wraps the given OutStream.
   */
  static make(out: sys.OutStream, ...args: unknown[]): WebOutStream;
  /**
   * Start a <ol> tag.
   */
  ol(attrs?: string | null): this;
  /**
   * End a <tfoot> tag.
   */
  tfootEnd(): this;
  /**
   * End a <form> tag.
   */
  formEnd(): this;
  /**
   * End a <title> tag.
   */
  titleEnd(): this;
  /**
   * End a <tr> tag.
   */
  trEnd(): this;
  /**
   * End a <main> tag.
   */
  mainEnd(): this;
  /**
   * Start a <label> tag.
   */
  label(attrs?: string | null): this;
  /**
   * Write out a prolog statement using the streams current
   * charset encoding.
   */
  prolog(): this;
  /**
   * End a <ol> tag.
   */
  olEnd(): this;
  /**
   * Start a <form> tag.
   */
  form(attrs?: string | null): this;
  /**
   * End a <script> tag.
   */
  scriptEnd(): this;
  /**
   * End a <nav> tag.
   */
  navEnd(): this;
  /**
   * End a <h6> tag.
   */
  h6End(): this;
}

/**
 * FilePack is an in-memory cache of multiple text files to
 * service static resources via HTTP.  It takes one or more
 * text files and creates one compound file.  The result is
 * stored in RAM using GZIP compression.  Or you can use the {@link pack | pack}
 * utility method to store the result to your own
 * files/buffers.
 * 
 * The {@link onGet | onGet} method is used to service GET
 * requests for the bundle. The Content-Type header is set
 * based on file extension of files bundled. It also implictly
 * supports ETag/Last-Modified for 304 optimization.
 * 
 * The core factory is the {@link makeFiles | makeFiles}
 * constructor.  A suite of utility methods is provided for
 * standard bundling of Fantom JavaScrit and CSS files.
 */
export class FilePack extends sys.Obj implements Weblet {
  static type$: sys.Type
  /**
   * Map a set of pods to "/res/css/{name}.css" CSS files. Ignore
   * pods that are missing a CSS file. This method does *not*
   * flatten/order the pods.
   */
  static toPodCssFiles(pods: sys.List<sys.Pod>): sys.List<sys.File>;
  /**
   * Map a set of pods to "/{name}.js" JavaScript files. Ignore
   * pods that are missing a JavaScript file. This method does *not*
   * flatten/order the pods.
   */
  static toPodJsFiles(pods: sys.List<sys.Pod>): sys.List<sys.File>;
  /**
   * Compile the mime type database into a Javascript file
   * "mime.js"
   */
  static toMimeJsFile(): sys.File;
  /**
   * Given a set of pods return a list of CSS files that form a
   * complete Fantom application:
   * - flatten the pods using {@link sys.Pod.flattenDepends | sys::Pod.flattenDepends}
   * - order them by dependencies using {@link sys.Pod.orderByDepends | sys::Pod.orderByDepends}
   * - return {@link toPodCssFiles | toPodCssFiles}
   */
  static toAppCssFiles(pods: sys.List<sys.Pod>): sys.List<sys.File>;
  /**
   * Compile the indexed props database into a JavaScript file
   * "index-props.js"
   */
  static toIndexPropsJsFile(pods?: sys.List<sys.Pod>): sys.File;
  /**
   * Compile the unit database into a JavaScript file "unit.js"
   */
  static toUnitsJsFile(): sys.File;
  /**
   * Compile the locale props into a JavaScript file
   * "{locale}.js"
   */
  static toLocaleJsFile(locale: sys.Locale, pods?: sys.List<sys.Pod>): sys.File;
  /**
   * Get the standard pod JavaScript file or null if no JS code. 
   * The standard location used by the Fantom JS compiler is
   * "/{pod-name}.js"
   */
  static toPodJsFile(pod: sys.Pod): sys.File | null;
  /**
   * Compile a list of pod JavaScript files into a single unified
   * source map file.  The list of files passed to this method
   * should match exactly the list of files used to create the
   * corresponding JavaScript FilePack.  If the file is the
   * standard pod JS file, then we will include an offset version
   * of "{pod}.js.map" generated by the JavaScript compiler.
   * Otherwise if the file is another JavaScript file (such as
   * units.js) then we just add the appropiate offset.
   * 
   * The `sourceRoot` option may be passed in to replace
   * "/dev/{podName}" as the root URI used to fetch source files
   * from the server.
   */
  static toPodJsMapFile(files: sys.List<sys.File>, options?: sys.Map<string, sys.JsObj> | null): sys.File;
  /**
   * Pack multiple text files together and write to the given
   * output stream.  A trailing newline is automatically added if
   * the file is missing one.  Empty files are skipped.  The
   * stream is not closed. Return the given out stream.
   */
  static pack(files: sys.List<sys.File>, out: sys.OutStream): sys.OutStream;
  /**
   * Compile the timezone database into a JavaScript file "tz.js"
   */
  static toTimezonesJsFile(): sys.File;
  /**
   * Given a set of pods return a list of JavaScript files that
   * form a complete Fantom application:
   * - flatten the pods using {@link sys.Pod.flattenDepends | sys::Pod.flattenDepends}
   * - order them by dependencies using {@link sys.Pod.orderByDepends | sys::Pod.orderByDepends}
   * - insert {@link toEtcJsFiles | toEtcJsFiles} immediately after
   *   "sys.js"
   */
  static toAppJsFiles(pods: sys.List<sys.Pod>): sys.List<sys.File>;
  /**
   * Return the required sys etc files:
   * - add {@link toMimeJsFile | toMimeJsFile}
   * - add {@link toUnitsJsFile | toUnitsJsFile}
   * - add {@link toIndexPropsJsFile | toIndexPropsJsFile}
   */
  static toEtcJsFiles(): sys.List<sys.File>;
  /**
   * Service an HTTP GET request for this bundle file
   */
  onGet(): void;
  /**
   * Construct a bundle for the given list of text files
   */
  static makeFiles(files: sys.List<sys.File>, mimeType?: sys.MimeType | null, ...args: unknown[]): FilePack;
  /**
   * The WebRes instance for this current web request.  Raise an
   * exception if the current actor thread is not serving a web
   * request.
   */
  res(): WebRes;
  /**
   * Convenience method to respond to a POST request. Default
   * implementation returns a 501 Not implemented error.
   */
  onPost(): void;
  /**
   * Convenience method to respond to a HEAD request. Default
   * implementation returns a 501 Not implemented error.
   */
  onHead(): void;
  /**
   * Convenience method to respond to a DELETE request. Default
   * implementation returns a 501 Not implemented error.
   */
  onDelete(): void;
  /**
   * Convenience method to respond to a OPTIONS request. Default
   * implementation returns a 501 Not implemented error.
   */
  onOptions(): void;
  /**
   * Convenience method to respond to a TRACE request. Default
   * implementation returns a 501 Not implemented error.
   */
  onTrace(): void;
  /**
   * The WebReq instance for this current web request.  Raise an
   * exception if the current actor thread is not serving a web
   * request.
   */
  req(): WebReq;
  /**
   * Service a web request. The default implementation routes to {@link onGet | onGet},
   * {@link onPost | onPost}, etc based on the request's method.
   */
  onService(): void;
  /**
   * Convenience method to respond to a PUT request. Default
   * implementation returns a 501 Not implemented error.
   */
  onPut(): void;
}

/**
 * WebClientTest
 */
export class WebClientTest extends sys.Test {
  static type$: sys.Type
  testCookies(): void;
  static make(...args: unknown[]): WebClientTest;
  testGetConvenience(): void;
  testRedirects(): void;
  testGetChunked(): void;
  testGetFixed(): void;
  testBadConfig(): void;
  verifyRedirect(origUri: sys.Uri, expected: sys.Uri | null): void;
}

/**
 * WebSocket is used for both client and server web socket
 * messaging. Current implementation only supports basic
 * non-fragmented text or binary messages.
 */
export class WebSocket extends sys.Obj {
  static type$: sys.Type
  /**
   * Close the web socket
   */
  close(): boolean;
  /**
   * Upgrade a server request to a WebSocket.  Raise IOErr is
   * there is any problems during the handshake in which case the
   * calling WebMod should return a 400 response.
   * 
   * Callers should set the Sec-WebSocket-Protocol response
   * header before calling this method.  However, if not set then
   * this call will set it to the request header value for
   * Sec-WebSocket-Protocol (if available).
   * 
   * Note: once this method completes, the socket is now owned by
   * the WebSocket instance and not the web server (wisp); it
   * must be explicitly closed to prevent a file handle leak.
   */
  static openServer(req: WebReq, res: WebRes): WebSocket;
  /**
   * Receive a message which is returned as either a Str or Buf.
   * Raise IOErr if socket has error or is closed.
   */
  receive(): sys.JsObj | null;
  /**
   * Access to socket options for this request.
   */
  socketOptions(): inet.SocketOptions;
  /**
   * Open a client connection.  The URI must have a "ws" or "wss"
   * scheme. The `headers` parameter defines additional HTTP
   * headers to include in the connection request.
   */
  static openClient(uri: sys.Uri, headers?: sys.Map<string, string> | null): WebSocket;
  /**
   * Return true if this socket has been closed
   */
  isClosed(): boolean;
  /**
   * Send a message which must be either a Str of Buf.  Bufs are
   * sent using their full contents irrelevant of their current
   * position.
   */
  send(msg: sys.JsObj): void;
}

/**
 * FilePackTest
 */
export class FilePackTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): FilePackTest;
  testPack(): void;
}

/**
 * WebReq encapsulates a web request.
 * 
 * See [pod doc](pod-doc#webReq).
 */
export class WebReq extends sys.Obj {
  static type$: sys.Type
  /**
   * Get the WebMod which is currently responsible for processing
   * this request.
   */
  mod(): WebMod;
  mod(it: WebMod): void;
  /**
   * Base URI of the current WebMod.  This Uri always ends in a
   * slash. This is the URI used to route to the WebMod itself. 
   * The remainder of {@link uri | uri} is stored in {@link modRel | modRel}
   * so that the following always holds true (with exception of a
   * trailing slash):
   * ```
   * modBase + modRel == uri
   * ```
   * 
   * For example if the current WebMod is mounted as `/mod` then:
   * ```
   * uri          modBase   modRel
   * ----------   -------   -------
   * `/mod`       `/mod/`   ``
   * `/mod/`      `/mod/`   ``
   * `/mod?q`     `/mod/`   `?q`
   * `/mod/a`     `/mod/`   `a`
   * `/mod/a/b`   `/mod/`   `a/b`
   * ```
   */
  modBase(): sys.Uri;
  modBase(it: sys.Uri): void;
  /**
   * Get the session associated with this browser "connection".
   * The session must be accessed the first time before the
   * response is committed.
   */
  session(): WebSession;
  /**
   * Return if the method is POST
   */
  isPost(): boolean;
  /**
   * Map of cookie values keyed by cookie name.  The cookies map
   * is readonly and case insensitive.
   */
  cookies(): sys.Map<string, string>;
  static make(...args: unknown[]): WebReq;
  /**
   * Get the IP host address of the client socket making this
   * request.
   */
  remoteAddr(): inet.IpAddr;
  /**
   * Map of HTTP request headers.  The headers map is readonly
   * and case insensitive (see {@link sys.Map.caseInsensitive | sys::Map.caseInsensitive}).
   * 
   * Examples:
   * ```
   * req.headers["Accept-Language"]
   * ```
   */
  headers(): sys.Map<string, string>;
  /**
   * The HTTP request method in uppercase. Example: GET, POST,
   * PUT.
   */
  method(): string;
  /**
   * Get the stream to read request body.  See {@link WebUtil.makeContentInStream | WebUtil.makeContentInStream}
   * to check under which conditions request content is
   * available. If request content is not available, then throw
   * an exception.
   * 
   * If the client specified the "Expect: 100-continue" header,
   * then the first access of the request input stream will
   * automatically send the client a [100 Continue](pod-doc#expectContinue)
   * response.
   */
  in(): sys.InStream;
  /**
   * Access to socket options for this request.
   */
  socketOptions(): inet.SocketOptions;
  /**
   * Get the IP port of the client socket making this request.
   */
  remotePort(): number;
  /**
   * The HTTP version of the request.
   */
  version(): sys.Version;
  /**
   * The request URI including the query string relative to this
   * authority.  Also see {@link absUri | absUri}, {@link modBase | modBase},
   * and {@link modRel | modRel}.
   * 
   * Examples:
   * ```
   * /a/b/c
   * /a?q=bar
   * ```
   */
  uri(): sys.Uri;
  /**
   * Return if the method is GET
   */
  isGet(): boolean;
  /**
   * Get the accepted locales for this request based on the
   * "Accept-Language" HTTP header.  List is sorted by
   * preference, where `locales.first` is best, and `locales.last` is
   * worst.  This list is guarenteed to contain Locale("en").
   */
  locales(): sys.List<sys.Locale>;
  /**
   * Get the key/value pairs of the form data.  If the request
   * content type is "application/x-www-form-urlencoded", then
   * the first time this method is called the request content is
   * read and parsed using {@link sys.Uri.decodeQuery | sys::Uri.decodeQuery}.
   * If the content type is not
   * "application/x-www-form-urlencoded" this method returns
   * null.
   */
  form(): sys.Map<string, string> | null;
  /**
   * Given a web request:
   * 1. check that the content-type is form-data
   * 2. get the boundary string
   * 3. invoke callback for each part (see {@link WebUtil.parseMultiPart | WebUtil.parseMultiPart})
   * 
   * For each part in the stream call the given callback function
   * with the part's form name, headers, and an input stream used
   * to read the part's body.
   */
  parseMultiPartForm(cb: ((arg0: string, arg1: sys.InStream, arg2: sys.Map<string, string>) => void)): void;
  /**
   * The absolute request URI including the full authority and
   * the query string.  Also see {@link uri | uri}, {@link modBase | modBase},
   * and {@link modRel | modRel}. This method is equivalent to:
   * ```
   * "http://" + headers["Host"] + uri
   * ```
   * 
   * Examples:
   * ```
   * http://www.foo.com/a/b/c
   * http://www.foo.com/a?q=bar
   * ```
   */
  absUri(): sys.Uri;
  /**
   * WebMod relative part of the URI - see {@link modBase | modBase}.
   */
  modRel(): sys.Uri;
  /**
   * Stash allows you to stash objects on the WebReq object in
   * order to pass data b/w Weblets while processing this
   * request.
   */
  stash(): sys.Map<string, sys.JsObj | null>;
}

/**
 * WebRes encapsulates a response to a web request.
 * 
 * See [pod doc](pod-doc#webRes)
 */
export class WebRes extends sys.Obj {
  static type$: sys.Type
  /**
   * Reason phrase to include in HTTP response line.  If null,
   * then a status phrase is used based on the {@link statusCode | statusCode}.
   */
  statusPhrase(): string | null;
  statusPhrase(it: string | null): void;
  /**
   * Map of HTTP status codes to status messages.
   */
  static statusMsg(): sys.Map<number, string>;
  /**
   * Get or set the HTTP status code for this response. Status
   * code defaults to 200.  Throw an err if the response has
   * already been committed.
   */
  statusCode(): number;
  statusCode(it: number): void;
  /**
   * Remove a cookie for this response.  This method is a
   * convenience for:
   * ```
   * res.cookies.add(Cookie(name, "") { maxAge=0day }
   * ```
   */
  removeCookie(name: string): void;
  /**
   * Get the list of cookies to set via header fields.  Add a a
   * Cookie to this list to set a cookie.  Throw an err if
   * response is already committed.
   * 
   * Example:
   * ```
   * res.cookies.add(Cookie("foo", "123"))
   * res.cookies.add(Cookie("persistent", "some val") { maxAge = 3day })
   * ```
   */
  cookies(): sys.List<Cookie>;
  /**
   * Return the WebOutStream for this response.  The first time
   * this method is accessed the response is committed: all
   * headers currently set will be written to the stream, and can
   * no longer be modified.  If the "Content-Length" header
   * defines a fixed number of bytes, then attemps to write too
   * many bytes will throw an IOErr.  If "Content-Length" is not
   * defined, then a chunked transfer encoding is automatically
   * used.
   */
  out(): WebOutStream;
  static make(...args: unknown[]): WebRes;
  /**
   * Send a redirect response to the client using the specified
   * status code and url.  If this response has already been
   * committed this method throws an Err.  This method implicitly
   * calls {@link done | done}.
   */
  redirect(uri: sys.Uri, statusCode?: number): void;
  /**
   * Map of HTTP response headers.  You must set all headers
   * before you access out() for the first time, which commits
   * the response. Throw an err if response is already committed.
   */
  headers(): sys.Map<string, string>;
  /**
   * Return if this response is complete - see {@link done | done}.
   */
  isDone(): boolean;
  /**
   * Done is called to indicate that that response is complete to
   * terminate pipeline processing.
   */
  done(): void;
  /**
   * Return true if this response has been commmited.  A
   * committed response has written its response headers, and can
   * no longer modify its status code or headers.  A response is
   * committed the first time that {@link out | out} is called.
   */
  isCommitted(): boolean;
  /**
   * Send an error response to client using the specified status
   * and HTML formatted message.  If this response has already
   * been committed this method throws an Err.  This method
   * implicitly calls {@link done | done}.
   */
  sendErr(statusCode: number, msg?: string | null): void;
}

