import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as inet from './inet.js';
import * as web from './web.js';
import * as xml from './xml.js';
import * as auth from './auth.js';
import * as obix from './obix.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as folio from './folio.js';
import * as hx from './hx.js';
import * as hxConn from './hxConn.js';

/**
 * ObixUtil is used to map between oBIX and Haystack data types
 */
export class ObixUtil extends sys.Obj {
  static type$: sys.Type
  static toTags(obj: obix.ObixObj): sys.Map<string, sys.JsObj>;
  /**
   * Convert obix:HistoryQueryOut to HisItem[]
   */
  static toHisItems(res: obix.ObixObj, tz: sys.TimeZone | null): sys.List<haystack.HisItem>;
  static toObix(obj: sys.JsObj | null): obix.ObixObj;
  static toVal(obj: obix.ObixObj): sys.JsObj | null;
  static toGrid(conn: ObixDispatch, obj: obix.ObixObj): haystack.Grid;
  static toChildVal(obj: obix.ObixObj, name: string, def?: sys.JsObj | null): sys.JsObj | null;
  static contractToDis(contract: obix.Contract): string;
  static make(...args: unknown[]): ObixUtil;
}

/**
 * ObixProxy is used to represent an oBIX resource which can be
 * read, written, or invoked.
 */
export class ObixProxy extends sys.Obj {
  static type$: sys.Type
  /**
   * URI relative to ObixWebMod
   */
  uri(): sys.Uri;
  /**
   * Parent proxy or null if this is the Lobby
   */
  parent(): ObixProxy | null;
  /**
   * Runtime associated with this proxy
   */
  rt(): hx.HxRuntime;
  /**
   * Invoke this proxy or throw UnsupportedErr if not an
   * operation
   */
  invoke(arg: obix.ObixObj): obix.ObixObj;
  /**
   * Get URI as server relative URI
   */
  queryToUri(query: string): sys.Uri;
  /**
   * Get child proxy by name, or null
   */
  get(name: string): ObixProxy | null;
  /**
   * Absolute URI to use as root href
   */
  absBaseUri(): sys.Uri;
  /**
   * Constructor
   */
  static make(parent: ObixProxy, name: string, ...args: unknown[]): ObixProxy;
  /**
   * Write this proxy or throw ReadonlyErr if not writable
   */
  write(arg: obix.ObixObj): obix.ObixObj;
  /**
   * Read the oBIX object representation
   */
  read(): obix.ObixObj;
  /**
   * Constructor for lobby only
   */
  static makeLobby(...args: unknown[]): ObixProxy;
  /**
   * Get URI as server relative URI
   */
  idToUri(id: haystack.Ref): sys.Uri;
  /**
   * Lobby root proxy
   */
  lobby(): ObixLobby;
}

/**
 * ObixVal is a proxy which wraps a simple value.
 */
export class ObixVal extends ObixProxy {
  static type$: sys.Type
  val(): sys.JsObj | null;
  val(it: sys.JsObj | null): void;
  read(): obix.ObixObj;
  static make(parent: ObixProxy, name: string, val: sys.JsObj | null, ...args: unknown[]): ObixVal;
}

/**
 * ObixWritableAspect
 */
export class ObixWritableAspect extends ObixAspect {
  static type$: sys.Type
  read(parent: ObixRec, obj: obix.ObixObj): void;
  contract(): sys.Uri;
  get(parent: ObixRec, name: string): ObixProxy | null;
  static make(...args: unknown[]): ObixWritableAspect;
}

export class ObixWritableOp extends ObixProxy {
  static type$: sys.Type
  rec(): haystack.Dict;
  read(): obix.ObixObj;
  invoke(arg: obix.ObixObj): obix.ObixObj;
  static make(parent: ObixRec, ...args: unknown[]): ObixWritableOp;
}

/**
 * ObixWebMod:
 * ```
 * {base}                    // lobby
 * {base}/xsl                // style sheet
 * {base}/icon/{id}/{uri}    // icon tunnel
 * ```
 */
export class ObixWebMod extends obix.ObixMod {
  static type$: sys.Type
  rt(): hx.HxRuntime;
  lib(): ObixLib;
  onWrite(uri: sys.Uri, arg: obix.ObixObj): obix.ObixObj;
  onRead(uri: sys.Uri): obix.ObixObj;
  onInvoke(uri: sys.Uri, arg: obix.ObixObj): obix.ObixObj;
  static make(lib: ObixLib, ...args: unknown[]): ObixWebMod;
  lobby(): obix.ObixObj;
  watch(id: string): obix.ObixModWatch | null;
  watchOpen(): obix.ObixModWatch;
  onService(): void;
}

export class ObixHistoryQuery extends ObixProxy {
  static type$: sys.Type
  read(): obix.ObixObj;
  invoke(arg: obix.ObixObj): obix.ObixObj;
  static make(parent: ObixRec, ...args: unknown[]): ObixHistoryQuery;
}

/**
 * Obix connector Axon functions
 */
export class ObixFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Deprecated - use [connSyncCur()](connSyncCur())
   */
  static obixSyncCur(points: sys.JsObj): sys.List<concurrent.Future>;
  /**
   * Deprecated - use [connPing()](connPing())
   */
  static obixPing(conn: sys.JsObj): concurrent.Future;
  /**
   * Write an object as identified by given uri.  The following
   * arg values are supported:
   * ```
   * arg         oBIX
   * ---         -----
   * null        <obj null='true'/>
   * "foo"       <str val='foo'/>
   * true        <bool val='true'/>
   * 123         <real val='123.0'/>
   * 123m        <real val='123.0' unit='obix:units/meter'/>
   * `foo.txt`   <uri val='foo.txt'/>
   * 2012-03-06  <date val='2012-03-06'/>
   * 23:15       <time val='23:15:00'/>
   * DateTime    <abstime val='...' tz='...'/>
   * XML Str     pass thru
   * ```
   * 
   * Result object is transformed using same rules as {@link obixReadObj | obixReadObj}.
   */
  static obixWriteObj(conn: sys.JsObj, uri: sys.JsObj, arg: sys.JsObj | null): haystack.Grid;
  /**
   * Invoke an `obix:op` operation as identified by given uri. See {@link obixWriteObj | obixWriteObj}
   * for supported arg values and {@link obixReadObj | obixReadObj}
   * for result object.
   */
  static obixInvoke(conn: sys.JsObj, uri: sys.JsObj, arg: sys.JsObj | null): haystack.Grid;
  /**
   * Deprecated - use [connSyncHis()](connSyncHis())
   */
  static obixSyncHis(points: sys.JsObj, span?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Synchronously query a `obix::History` for its timestamp/value
   * pairs. Range may be any valid object used with `his` queries.
   */
  static obixReadHis(conn: sys.JsObj, uri: sys.Uri, span: sys.JsObj | null): haystack.Grid;
  /**
   * Read one Uri from an obixConn.  The object is returned as a
   * grid with the object's meta-data returned via grid.meta and
   * each immediate child returned as a row in the grid.  The
   * tags used for grid meta and the columns are:
   * - href: meta.href is absolute uri of object, the href col is
   *   child's uri relative to meta.href
   * - name: obix `name` attribute
   * - dis: obix `displayName` attribute
   * - val: obix `val` attribute unless `null` attribute is true
   * - is: contract list
   * - icon: uri relative to meta.href of icon
   * 
   * You can read the icon via the tunnel URI:
   * ```
   * {api}/obix/icon/{id}/{uri}
   * ```
   * 
   * Side effects:
   * - performs blocking network IO
   */
  static obixReadObj(conn: sys.JsObj, uri: sys.Uri): haystack.Grid;
  static make(...args: unknown[]): ObixFuncs;
}

/**
 * ObixLobby represents the root proxy object.
 */
export class ObixLobby extends ObixProxy {
  static type$: sys.Type
  mod(): ObixWebMod;
  read(): obix.ObixObj;
  get(name: string): ObixProxy | null;
  static make(mod: ObixWebMod, ...args: unknown[]): ObixLobby;
}

/**
 * Obix connector
 */
export class ObixLib extends hxConn.ConnLib {
  static type$: sys.Type
  /**
   * Publish server side APIs
   */
  web(): hx.HxLibWeb;
  static make(...args: unknown[]): ObixLib;
}

/**
 * ObixRec is used to map a Folio record to an oBIX object.
 */
export class ObixRec extends ObixProxy {
  static type$: sys.Type
  /**
   * Is this a root object
   */
  isRoot(): boolean;
  isRoot(it: boolean): void;
  /**
   * Aspects which implement additional oBIX contract
   * functionality
   */
  aspects(): sys.List<ObixAspect>;
  aspects(it: sys.List<ObixAspect>): void;
  /**
   * Folio record
   */
  rec(): haystack.Dict;
  get(name: string): ObixProxy | null;
  tagToObj(name: string, val: sys.JsObj): obix.ObixObj;
  static make(parent: ObixProxy, name: string, rec: haystack.Dict, ...args: unknown[]): ObixRec;
  read(): obix.ObixObj;
}

/**
 * ObixDispatch
 */
export class ObixDispatch extends hxConn.ConnDispatch {
  static type$: sys.Type
  isNiagara(): boolean;
  isNiagara(it: boolean): void;
  watchUris(): sys.Map<sys.Uri, hxConn.ConnPoint>;
  watchUris(it: sys.Map<sys.Uri, hxConn.ConnPoint>): void;
  client(): obix.ObixClient | null;
  client(it: obix.ObixClient | null): void;
  clientWatch(): obix.ObixClientWatch | null;
  clientWatch(it: obix.ObixClientWatch | null): void;
  /**
   * Callback for obixSyncCur
   */
  onSyncCur(points: sys.List<hxConn.ConnPoint>): void;
  onReceive(msg: hx.HxMsg): sys.JsObj | null;
  /**
   * Callback for watch, do subscription on comp
   */
  onWatch(points: sys.List<hxConn.ConnPoint>): void;
  onClose(): void;
  onUnwatch(points: sys.List<hxConn.ConnPoint>): void;
  onLearn(obj: sys.JsObj | null): haystack.Grid;
  onWrite(pt: hxConn.ConnPoint, info: hxConn.ConnWriteInfo): void;
  onSyncHis(point: hxConn.ConnPoint, span: haystack.Span): sys.JsObj | null;
  onOpen(): void;
  static make(arg: sys.JsObj, ...args: unknown[]): ObixDispatch;
  onPollManual(): void;
  onPing(): haystack.Dict;
}

/**
 * ObixTest
 */
export class ObixTest extends hx.HxTest {
  static type$: sys.Type
  conn(): haystack.Dict | null;
  conn(it: haystack.Dict | null): void;
  lobbyUri(): sys.Uri | null;
  lobbyUri(it: sys.Uri | null): void;
  hisSyncF(): haystack.Dict | null;
  hisSyncF(it: haystack.Dict | null): void;
  lib(): ObixLib | null;
  lib(it: ObixLib | null): void;
  recA(): haystack.Dict | null;
  recA(it: haystack.Dict | null): void;
  recB(): haystack.Dict | null;
  recB(it: haystack.Dict | null): void;
  pt1(): haystack.Dict | null;
  pt1(it: haystack.Dict | null): void;
  pt3(): haystack.Dict | null;
  pt3(it: haystack.Dict | null): void;
  pt2(): haystack.Dict | null;
  pt2(it: haystack.Dict | null): void;
  hisB(): haystack.Dict | null;
  hisB(it: haystack.Dict | null): void;
  hisF(): haystack.Dict | null;
  hisF(it: haystack.Dict | null): void;
  client(): obix.ObixClient | null;
  client(it: obix.ObixClient | null): void;
  verifyLobby(): void;
  verifyHisSync(): void;
  href(relative: sys.Uri): sys.Uri;
  verifyConn(): void;
  static item(ts: sys.DateTime, val: sys.JsObj | null): haystack.HisItem;
  verifyToObix(val: sys.JsObj | null, expected: string): void;
  verifyWritables(): void;
  verifyBatch(): void;
  verifyPoints(): void;
  verifyReads(): void;
  static dt(y: number, m: number, d: number, h: number, min: number, tz?: sys.TimeZone): sys.DateTime;
  buildProj(): void;
  verifyHisQueries(): void;
  verifyReadHis(): void;
  test(): void;
  sync(): void;
  verifyServerWatches(): void;
  verifyHis(): void;
  addClientProxy(dis: string, kind: string, uri: sys.Uri): haystack.Dict;
  testToObix(): void;
  dump(title: string, obj: obix.ObixObj): void;
  static make(...args: unknown[]): ObixTest;
  verifyClientWatches(): void;
  verifyHisQuery(rec: haystack.Dict, s: sys.DateTime | null, e: sys.DateTime | null, limit?: number | null): void;
}

/**
 * ObixTag is used to map a single tag name/value pair of a
 * record.
 */
export class ObixTag extends ObixRec {
  static type$: sys.Type
  tagVal(): sys.JsObj;
  tagName(): string;
  static make(parent: ObixRec, rec: haystack.Dict, tagName: string, tagVal: sys.JsObj, ...args: unknown[]): ObixTag;
  read(): obix.ObixObj;
}

/**
 * ObixQuery provides a flat list which matches a filter
 */
export class ObixQuery extends ObixProxy {
  static type$: sys.Type
  read(): obix.ObixObj;
  get(filter: string): ObixProxy | null;
  static make(parent: ObixProxy, ...args: unknown[]): ObixQuery;
}

/**
 * ObixAspect is used to enhance an ObixProxy to provide
 * contract support such as `obix:History`.
 */
export class ObixAspect extends sys.Obj {
  static type$: sys.Type
  static history(): ObixAspect;
  static point(): ObixAspect;
  static writable(): ObixAspect;
  read(parent: ObixRec, obj: obix.ObixObj): void;
  contract(): sys.Uri;
  static toContract(rec: haystack.Dict): obix.Contract;
  static toAspects(rec: haystack.Dict): sys.List<ObixAspect>;
  get(parent: ObixRec, name: string): ObixProxy | null;
  static make(...args: unknown[]): ObixAspect;
}

/**
 * ObixPointAspect
 */
export class ObixPointAspect extends ObixAspect {
  static type$: sys.Type
  read(parent: ObixRec, obj: obix.ObixObj): void;
  contract(): sys.Uri;
  get(parent: ObixRec, name: string): ObixProxy | null;
  static make(...args: unknown[]): ObixPointAspect;
}

/**
 * ObixHistoryAspect
 */
export class ObixHistoryAspect extends ObixAspect {
  static type$: sys.Type
  read(parent: ObixRec, obj: obix.ObixObj): void;
  contract(): sys.Uri;
  get(parent: ObixRec, name: string): ObixProxy | null;
  static make(...args: unknown[]): ObixHistoryAspect;
}

/**
 * ObixRecs represents the "rec/" namespace
 */
export class ObixRecs extends ObixProxy {
  static type$: sys.Type
  read(): obix.ObixObj;
  get(name: string): ObixProxy | null;
  static make(parent: ObixProxy, ...args: unknown[]): ObixRecs;
}

/**
 * ObixFilter implements a ObixQuery filter
 */
export class ObixFilter extends ObixProxy {
  static type$: sys.Type
  read(): obix.ObixObj;
  static make(parent: ObixProxy, filter: string, ...args: unknown[]): ObixFilter;
}

/**
 * ObixWatch wraps HxWatch as ObixModWatch
 */
export class ObixWatch extends obix.ObixModWatch {
  static type$: sys.Type
  recsUri(): sys.Uri;
  mod(): ObixWebMod;
  watch(): hx.HxWatch;
  lease(): sys.Duration;
  lease(it: sys.Duration): void;
  pollChanges(): sys.List<obix.ObixObj>;
  delete(): void;
  remove(uris: sys.List<sys.Uri>): void;
  id(): string;
  static make(mod: ObixWebMod, watch: hx.HxWatch, ...args: unknown[]): ObixWatch;
  add(uris: sys.List<sys.Uri>): sys.List<obix.ObixObj>;
  pollRefresh(): sys.List<obix.ObixObj>;
}

