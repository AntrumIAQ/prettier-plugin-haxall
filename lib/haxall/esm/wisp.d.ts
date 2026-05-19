import * as sys from './sys.js';
import * as util from './util.js';
import * as concurrent from './concurrent.js';
import * as inet from './inet.js';
import * as web from './web.js';

/**
 * WispTest
 */
export class WispTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): WispTest;
  verifyExtraHeaders(str: string, expected: sys.Map<string, string> | null): void;
  testExtraHeaders(): void;
}

/**
 * ReqTest
 */
export class ReqTest extends sys.Test {
  static type$: sys.Type
  static main(args?: sys.List<string>): void;
  verifyReq(s: string, method: string, uri: sys.Uri, headers: sys.Map<string, string>): void;
  static make(...args: unknown[]): ReqTest;
  testBasic(): void;
}

/**
 * Pluggable hooks for Wisp session storage.
 */
export abstract class WispSessionStore extends sys.Obj {
  static type$: sys.Type
  /**
   * Save the given session map by session id.
   */
  save(id: string, map: sys.Map<string, sys.JsObj | null>): void;
  /**
   * Delete any resources used by the given session id
   */
  delete(id: string): void;
  /**
   * Callback when WispService is started
   */
  onStart(): void;
  /**
   * Load the session map for the given id, or if it doesn't
   * exist then create a new one.
   */
  load(id: string): sys.Map<string, sys.JsObj | null>;
  /**
   * Parent web service
   */
  service(): WispService;
  /**
   * Callback when WispService is stopped
   */
  onStop(): void;
}

/**
 * Simple web server services HTTP/HTTPS requests to a
 * top-level root WebMod. A given instance of WispService can
 * be only be used through one start/stop lifecycle.
 * 
 * Example:
 * ```
 * WispService { httpPort = 8080; root = MyWebMod() }.start
 * ```
 */
export class WispService extends sys.Obj implements sys.Service {
  static type$: sys.Type
  /**
   * Map of HTTP headers to include in every response.  These are
   * initialized from etc/web/config.props with the key
   * "extraResHeaders" as a set of "key:value" pairs separated by
   * semicolons.
   */
  extraResHeaders(): sys.Map<string, string>;
  __extraResHeaders(it: sys.Map<string, string>): void;
  /**
   * Pluggable interface for managing web session state. Default
   * implementation stores sessions in main memory.
   */
  sessionStore(): WispSessionStore;
  __sessionStore(it: WispSessionStore): void;
  /**
   * WebMod which is called on internal server error to return an
   * 500 error response.  The exception raised is available in `req.stash["err"]`.
   * The `onService` method is called after clearing all headers
   * and setting the response code to 500.  The default error mod
   * may be configured via `errMod` property in
   * etc/web/config.props.
   */
  errMod(): web.WebMod;
  __errMod(it: web.WebMod): void;
  /**
   * Max number of threads which are used for concurrent web
   * request processing.
   */
  maxThreads(): number;
  __maxThreads(it: number): void;
  /**
   * Well known TCP port for HTTP traffic. The port is enabled if
   * non-null and disabled if null.
   */
  httpPort(): number | null;
  __httpPort(it: number | null): void;
  /**
   * Well known TCP port for HTTPS traffic. The port is enabled
   * if non-null and disabled if null. If the http and https
   * ports are both non-null then all http traffic will be
   * redirected to the https port.
   */
  httpsPort(): number | null;
  __httpsPort(it: number | null): void;
  /**
   * The {@link inet.SocketConfig | inet::SocketConfig} to use for
   * creating sockets
   */
  socketConfig(): inet.SocketConfig;
  __socketConfig(it: inet.SocketConfig): void;
  /**
   * Root WebMod used to service requests.
   */
  root(): web.WebMod;
  __root(it: web.WebMod): void;
  /**
   * Which IpAddr to bind to or null for the default.
   */
  addr(): inet.IpAddr | null;
  __addr(it: inet.IpAddr | null): void;
  /**
   * Cookie name to use for built-in session management.
   * Initialized from etc/web/config.props with the key
   * "sessionCookieName" otherwise defaults to "fanws"
   */
  sessionCookieName(): string;
  __sessionCookieName(it: string): void;
  onStart(): void;
  onStop(): void;
  /**
   * Constructor with it-block
   */
  static make(f?: ((arg0: WispService) => void) | null, ...args: unknown[]): WispService;
  /**
   * Is the service in the installed state. Note this method
   * requires accessing a global hash table, so it should not be
   * heavily polled in a concurrent environment.
   */
  isInstalled(): boolean;
  /**
   * Start this service.  If not installed, this method
   * automatically calls {@link install | install}.  If already
   * running, do nothing.  Return this.
   */
  start(): this;
  /**
   * Stop this service.  If not running, do nothing. Return this.
   */
  stop(): this;
  /**
   * Uninstall this service from the VM's service registry. If
   * the service is running, this method automatically calls {@link stop | stop}.
   * If not installed, do nothing.  Return this.
   */
  uninstall(): this;
  /**
   * Is the service in the running state. Note this method
   * requires accessing a global hash table, so it should not be
   * heavily polled in a concurrent environment.
   */
  isRunning(): boolean;
  /**
   * Install this service into the VM's service registry. If
   * already installed, do nothing.  Return this.
   */
  install(): this;
  /**
   * Services are required to implement equality by reference.
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Services are required to implement equality by reference.
   */
  hash(): number;
}

/**
 * WispDefaultErrMod
 */
export class WispDefaultErrMod extends web.WebMod {
  static type$: sys.Type
  static make(...args: unknown[]): WispDefaultErrMod;
  onService(): void;
}

