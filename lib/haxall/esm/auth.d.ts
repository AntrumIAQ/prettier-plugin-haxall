import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as inet from './inet.js';
import * as web from './web.js';
import * as haystack from './haystack.js';

/**
 * AuthUser models the user information needed to perform
 * server side authentication
 */
export class AuthUser extends sys.Obj {
  static type$: sys.Type
  /**
   * Scheme name to use for authenticating this user
   */
  scheme(): string;
  /**
   * Parameters to use for auth scheme
   */
  params(): sys.Map<string, string>;
  /**
   * Username key
   */
  username(): string;
  /**
   * Return username
   */
  toStr(): string;
  /**
   * Lookup a parameter by name
   */
  param(name: string, checked?: boolean): string | null;
  static make(username: string, scheme: string, params: sys.Map<string, string>, ...args: unknown[]): AuthUser;
}

/**
 * PlaintextScheme implements the x-plaintext algorithm for
 * passing a username and password in the clear to the server
 * for authentication.
 */
export class PlaintextScheme extends AuthScheme {
  static type$: sys.Type
  onClient(cx: AuthClientContext, msg: AuthMsg): AuthMsg;
  onServer(cx: AuthServerContext, msg: AuthMsg): AuthMsg;
  static make(...args: unknown[]): PlaintextScheme;
}

/**
 * RoundtripTest
 */
export class RoundtripTest extends sys.Test {
  static type$: sys.Type
  wisp(): sys.Service | null;
  wisp(it: sys.Service | null): void;
  static clientLevel(): sys.LogLevel;
  port(): number;
  port(it: number): void;
  static serverLevel(): sys.LogLevel;
  verifyAccount(user: string): void;
  verifyAuthBearer(): void;
  static make(...args: unknown[]): RoundtripTest;
  openServer(): void;
  test(): void;
  verifyBad(user: string, pass: string): void;
  closeServer(): void;
  verifyGood(user: string, pass: string): void;
  openClient(user: string, pass: string): AuthClientContext;
}

/**
 * AuthMsgTest
 */
export class AuthMsgTest extends sys.Test {
  static type$: sys.Type
  testEncoding(): void;
  static make(...args: unknown[]): AuthMsgTest;
  verifyEncoding(params: sys.Map<string, string>): void;
  testSplitList(): void;
  verifySplitList(s: string, expected: sys.List<string>): void;
  testListFromStr(): void;
  verifyListFromStr(s: string, expected: sys.List<AuthMsg>): void;
}

/**
 * AuthMsg models a scheme name and set of parameters according
 * to [RFC 7235](https://tools.ietf.org/html/rfc7235).  To
 * simplify parsing, we restrict the grammar to be auth-param
 * and token (the token68 and quoted-string productions are not
 * allowed).
 */
export class AuthMsg extends sys.Obj {
  static type$: sys.Type
  /**
   * Str encoding per RFC 7235
   */
  toStr(): string;
  /**
   * Scheme name normalized to lowercase
   */
  scheme(): string;
  /**
   * Parameters for scheme
   */
  params(): sys.Map<string, string>;
  /**
   * Parse a list of AuthSchemes such as a list of `challenge`
   * productions for the WWW-Authentication header per RFC 7235.
   */
  static listFromStr(s: string): sys.List<AuthMsg>;
  /**
   * Parse a string encoding according to RFC 7235.
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): AuthMsg;
  /**
   * Lookup a parameter by name
   */
  param(name: string, checked?: boolean): string | null;
  /**
   * Get the encoded parameters without the scheme name prefix
   */
  paramsToStr(): string;
  /**
   * Equality is based on string encoding
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Constructor
   */
  static make(scheme: string, params: sys.Map<string, string>, ...args: unknown[]): AuthMsg;
  /**
   * Hash code is based on string encoding
   */
  hash(): number;
}

/**
 * AuthClientContext used to manage the process for
 * authenticating with HTTP/HTTPS server.  Once authenticated
 * an instance of this class is used to prepare to additional
 * WebClient requests.
 */
export class AuthClientContext extends sys.Obj implements haystack.HaystackClientAuth {
  static type$: sys.Type
  /**
   * Logging instance
   */
  log(): sys.Log;
  __log(it: sys.Log): void;
  static debugCounter(): concurrent.AtomicInt;
  static __debugCounter(it: concurrent.AtomicInt): void;
  /**
   * Have we successfully authenticated to the server
   */
  isAuthenticated(): boolean;
  isAuthenticated(it: boolean): void;
  /**
   * SocketConfig for WebClient sockets
   */
  socketConfig(): inet.SocketConfig;
  __socketConfig(it: inet.SocketConfig): void;
  /**
   * Headers we wish to use for AuthClient requests
   */
  headers(): sys.Map<string, string>;
  headers(it: sys.Map<string, string>): void;
  /**
   * Plaintext password for authentication
   */
  pass(): string | null;
  pass(it: string | null): void;
  /**
   * User agent string
   */
  userAgent(): string | null;
  __userAgent(it: string | null): void;
  /**
   * URI used to open the connection
   */
  uri(): sys.Uri;
  __uri(it: sys.Uri): void;
  /**
   * Username used for authentication
   */
  user(): string;
  __user(it: string): void;
  /**
   * Stash allows you to store state between messages while
   * authenticating with the server.
   */
  stash(): sys.Map<string, sys.JsObj | null>;
  stash(it: sys.Map<string, sys.JsObj | null>): void;
  /**
   * Prepare a WebClient instance with the auth cookies/headers
   */
  prepare(c: web.WebClient): web.WebClient;
  /**
   * Debug command line tester
   */
  static main(args: sys.List<string>): void;
  /**
   * Make POST request to the server, return response content
   */
  post(c: web.WebClient, content: string): string | null;
  /**
   * Make GET request to the server, return response content
   */
  get(c: web.WebClient): string | null;
  /**
   * Get a required rsponse header
   */
  resHeader(c: web.WebClient, name: string): string;
  /**
   * Standard error to raise
   */
  err(msg: string): AuthErr;
  static debugRes(log: sys.Log | null, count: number, c: web.WebClient, content?: string | null): void;
  static debugReq(log: sys.Log | null, c: web.WebClient, content?: string | null): number;
  /**
   * Open an authenticated context which can be used to prepare
   * additional requests
   */
  static open(uri: sys.Uri, user: string, pass: string, log: sys.Log, socketConfig?: inet.SocketConfig): AuthClientContext;
}

/**
 * AuthServerContext manages the server-side process for
 * authenticating a user. It provides a set of abstract methods
 * to plug into the application user database and session
 * management.
 */
export class AuthServerContext extends sys.Obj {
  static type$: sys.Type
  static debugCounter(): concurrent.AtomicInt;
  isDebug(): boolean;
  isDebug(it: boolean): void;
  /**
   * Current web request
   */
  req(): web.WebReq | null;
  req(it: web.WebReq | null): void;
  /**
   * Current web response
   */
  res(): web.WebRes | null;
  res(it: web.WebRes | null): void;
  /**
   * User currently being being authenticated
   */
  user(): AuthUser | null;
  user(it: AuthUser | null): void;
  /**
   * Log to use for debugging and error reporting
   */
  log(): sys.Log;
  /**
   * Get an AuthUser for the user with the given username.
   * 
   * If null is returned, then the Haystack authentication will *immediately*
   * stop without sending any response to the client. It is the
   * responsibility of the code invoking the AuthServerContext to
   * send an appropriate response in this case. This condition
   * signals that given user is using some alternative form of
   * authentication.
   * 
   * If the user doesn't exist, but you want a "fake" haystack
   * authentication to occur, then return AuthUser.genFake.
   */
  userByUsername(username: string): AuthUser | null;
  /**
   * Login the current user successfully and return the authToken
   */
  login(): string;
  /**
   * Lookup user's password hash string for validation or return
   * null if the user should not be allowed to log in.
   */
  userSecret(): string | null;
  static make(...args: unknown[]): AuthServerContext;
  /**
   * Callback when a user fails a login attempt
   */
  onAuthErr(err: AuthErr): void;
  debug(msg: string): void;
  /**
   * Lookup user session by authToken or return null if invalid
   * token
   */
  sessionByAuthToken(authToken: string): sys.JsObj | null;
  /**
   * Return if the given user's secret matches what is stored
   */
  authSecret(secret: string): boolean;
  /**
   * Process authentication request. Return result of
   * sessionByAuthToken if user is authenticated, otherwise send
   * challenge message and return null
   */
  onService(req: web.WebReq, res: web.WebRes): sys.JsObj | null;
}

/**
 * AuthScheme is base class for modeling pluggable
 * authentication algorithms
 */
export class AuthScheme extends sys.Obj {
  static type$: sys.Type
  /**
   * Scheme name (always normalized to lowercase)
   */
  name(): string;
  /**
   * Callback after successful authentication to process the
   * Authentication-Info bearer token header parameters.
   */
  onClientSuccess(cx: AuthClientContext, msg: AuthMsg): void;
  /**
   * Schemes registerd in the system
   */
  static list(): sys.List<AuthScheme>;
  /**
   * Handle a standarized client authentation challenge message
   * from the server using RFC 7235.  Return the message to send
   * back to the server to authenticate.
   */
  onClient(cx: AuthClientContext, msg: AuthMsg): AuthMsg;
  /**
   * Handle non-standardized client authentication when the
   * standard process fails.  If this scheme thinks it can handle
   * the given WebClient's response by sniffing the response code
   * and headers then it should process and return true.
   */
  onClientNonStd(cx: AuthClientContext, c: web.WebClient, content: string | null): boolean;
  /**
   * Handle a server authentation message from a client.  If its
   * the initial message, then `msg.scheme` will be "hello".  There
   * are three outcomes:
   * 1. If the client should be challenged with a 401, then return
   *   the message to send in the WWW-Authenticate header
   * 2. If the client has been successfully authenticated then
   *   return a message with the `authToken` parameter in the
   *   Authentication-Info header.  The authToken should be
   *   generated via {@link AuthServerContext.login | AuthServerContext.login}
   * 3. If authentication fails, then raise {@link AuthErr | AuthErr}
   */
  onServer(cx: AuthServerContext, msg: AuthMsg): AuthMsg;
  /**
   * Lookup a AuthScheme type for the given case insensitive
   * name.
   */
  static find(name: string, checked?: boolean): AuthScheme | null;
}

/**
 * AuthErr
 */
export class AuthErr extends sys.Err {
  static type$: sys.Type
  /**
   * Status message for HTTP response when details should be
   * shared
   */
  resMsg(): string;
  /**
   * Status code to use for HTTP response
   */
  resCode(): number;
  /**
   * Constructor for unknown user
   */
  static makeUnknownUser(username: string): AuthErr;
  /**
   * Constructor for invalid password
   */
  static makeInvalidPassword(): AuthErr;
  /**
   * Constructor with public HTTP response code and message
   */
  static makeRes(debugMsg: string, resMsg: string, resCode?: number, ...args: unknown[]): AuthErr;
  /**
   * Standard constructor - the msg is used for public HTTP
   * response
   */
  static make(msg: string, cause?: sys.Err | null, ...args: unknown[]): AuthErr;
}

/**
 * ScramScheme implements the salted challenge response
 * authentication mechanism as defined in [RFC 5802](https://tools.ietf.org/html/rfc5802).
 */
export class ScramScheme extends AuthScheme {
  static type$: sys.Type
  onClientSuccess(cx: AuthClientContext, msg: AuthMsg): void;
  onClient(cx: AuthClientContext, msg: AuthMsg): AuthMsg;
  static make(...args: unknown[]): ScramScheme;
  onServer(cx: AuthServerContext, msg: AuthMsg): AuthMsg;
}

/**
 * HmacScheme implements pre-3.0 HMAC SHA-1 algorithm
 */
export class HmacScheme extends AuthScheme {
  static type$: sys.Type
  onClient(cx: AuthClientContext, msg: AuthMsg): AuthMsg;
  static gen(): sys.Map<string, string>;
  onServer(cx: AuthServerContext, msg: AuthMsg): AuthMsg;
  /**
   * Compute the secret string which is *normal* base64 HMAC of the
   * "user:salt" like we used in 2.1
   */
  static hmac(user: string, pass: string, salt: string, hash?: string): string;
  static make(...args: unknown[]): HmacScheme;
}

/**
 * BasicScheme
 */
export class BasicScheme extends AuthScheme {
  static type$: sys.Type
  static use(c: web.WebClient, content: string | null): boolean;
  onClient(cx: AuthClientContext, msg: AuthMsg): AuthMsg;
  onClientNonStd(cx: AuthClientContext, c: web.WebClient, content: string | null): boolean;
  onServer(cx: AuthServerContext, msg: AuthMsg): AuthMsg;
  static make(...args: unknown[]): BasicScheme;
}

/**
 * Foloi2Scheme implements client side legacy 2.1
 * authentication
 */
export class Folio2Scheme extends AuthScheme {
  static type$: sys.Type
  onClient(cx: AuthClientContext, msg: AuthMsg): AuthMsg;
  onClientNonStd(cx: AuthClientContext, c: web.WebClient, content: string | null): boolean;
  onServer(cx: AuthServerContext, msg: AuthMsg): AuthMsg;
  static make(...args: unknown[]): Folio2Scheme;
}

