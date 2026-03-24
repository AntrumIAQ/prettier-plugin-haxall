import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as inet from './inet.js';
import * as web from './web.js';
import * as wisp from './wisp.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as hx from './hx.js';

/**
 * HTTP service handling
 */
export class HttpLib extends hx.HxLib implements hx.HxHttpService {
  static type$: sys.Type
  /**
   * Root WebMod instance to use when Wisp is launched
   */
  rootRef(): concurrent.AtomicRef;
  /**
   * Unready callback
   */
  onUnready(): void;
  /**
   * Public HTTP or HTTPS URI of this host.  This is always an
   * absolute URI such `https://acme.com/`
   */
  siteUri(): sys.Uri;
  /**
   * Settings record
   */
  rec(): HttpSettings;
  /**
   * URI on this host to the Haystack HTTP API.  This is always a
   * host relative URI which end withs a slash such `/api/`.
   */
  apiUri(): sys.Uri;
  /**
   * Root WebMod instance
   */
  root(checked?: boolean): web.WebMod | null;
  wisp(): wisp.WispService;
  static make(...args: unknown[]): HttpLib;
  /**
   * Publish the HxHttpService
   */
  services(): sys.List<hx.HxService>;
  /**
   * Ready callback
   */
  onReady(): void;
}

/**
 * Settings record
 */
export class HttpSettings extends haystack.TypedDict {
  static type$: sys.Type
  /**
   * Port for HTTPS; only applicable if `httpsEnabled`
   */
  httpsPort(): number;
  __httpsPort(it: number): void;
  /**
   * Public HTTP or HTTPS URI to use for URIs to this server. 
   * This setting should be configured if running behind a proxy
   * server where the local IP host or port isn't what is used
   * for public access.  This URI must always address this
   * machine and not another node in the cluster.
   */
  siteUri(): sys.Uri | null;
  __siteUri(it: sys.Uri | null): void;
  /**
   * IP address to bind to locally for HTTP/HTTPS ports
   */
  addr(): string | null;
  __addr(it: string | null): void;
  /**
   * Max threads to allocate to service concurrent HTTP requests.
   */
  maxThreads(): number;
  __maxThreads(it: number): void;
  /**
   * Disable showing exception stack trace for 500 internal
   * server errors
   */
  disableErrTrace(): boolean;
  __disableErrTrace(it: boolean): void;
  /**
   * If false all traffic is handled in plaintext on `httpPort`. 
   * If set to true, then all traffic is forced to use HTTPS on `httpsPort`
   * and requests to `httpPort` are redirected.
   */
  httpsEnabled(): boolean;
  __httpsEnabled(it: boolean): void;
  /**
   * Port for HTTP traffic
   */
  httpPort(): number;
  __httpPort(it: number): void;
  /**
   * Constructor
   */
  static make(d: haystack.Dict, f: ((arg0: HttpSettings) => void), ...args: unknown[]): HttpSettings;
}

/**
 * HTTP module functions
 */
export class HttpFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Primary HTTP or HTTPS Uri - see {@link hx.HxHttpService.siteUri | hx::HxHttpService.siteUri}
   */
  static httpSiteUri(): sys.Uri;
  static make(...args: unknown[]): HttpFuncs;
}

