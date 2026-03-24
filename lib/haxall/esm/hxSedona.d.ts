import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as sys from './sys.js';
import * as util from './util.js';
import * as web from './web.js';
import * as xml from './xml.js';
import * as sedona from './sedona.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as folio from './folio.js';
import * as hx from './hx.js';
import * as hxConn from './hxConn.js';

/**
 * SedonaScheme.
 */
export class SedonaScheme extends sys.Obj {
  static type$: sys.Type
  /**
   * Callback to perform a discovery.
   */
  discover(): haystack.Grid;
  /**
   * Close DaspSocket for this scheme.
   */
  closeDaspSocket(s: [java]sedona.dasp.DaspSocket): void;
  /**
   * List available SedonaSchemes.
   */
  static schemes(): sys.List<SedonaScheme>;
  /**
   * URI scheme for this transport.
   */
  uriScheme(): string;
  /**
   * Create DaspSocket for this scheme.
   */
  createDaspSocket(rec: haystack.Dict): [java]sedona.dasp.DaspSocket;
  /**
   * Get Host InetAddress.
   */
  inetAddress(uri: sys.Uri): [java]java.net.InetAddress;
  /**
   * Get options or null for defaults.
   */
  options(conn: hxConn.Conn): [java]java.util.Hashtable | null;
  static make(...args: unknown[]): SedonaScheme;
}

/**
 * Sedona library functions.
 */
export class SedonaFuncs extends sys.Obj {
  static type$: sys.Type
  static sedonaHome(): sys.File;
  /**
   * Deprecated - use [connSyncCur()](connSyncCur())
   */
  static sedonaSyncCur(points: sys.JsObj): sys.List<concurrent.Future>;
  /**
   * Synchronously read the current state of the component
   * identified by the given component identifier.
   */
  static sedonaReadComp(conn: sys.JsObj, compId: haystack.Number): sys.JsObj | null;
  /**
   * Deprecated - use [connPing()](connPing())
   */
  static sedonaPing(conn: sys.JsObj): concurrent.Future;
  static make(...args: unknown[]): SedonaFuncs;
  /**
   * Synchronously write a property
   */
  static sedonaWrite(conn: sys.JsObj, addr: string, val: sys.JsObj | null): sys.JsObj | null;
}

/**
 * Sedona utilities
 */
export class SedonaUtil extends sys.Obj {
  static type$: sys.Type
  static compToDict(comp: [java]sedona.sox.SoxComponent): haystack.Dict;
  static idsToStr(array: [java]fanx.interop.IntArray): string;
  static valueToFan(v: [java]sedona.Value | null, unit?: sys.Unit | null): sys.JsObj | null;
  static sedonaTypeToKind(type: [java]sedona.Type): string | null;
  static fanToValue(type: [java]sedona.Type, v: sys.JsObj | null): [java]sedona.Value;
  static make(...args: unknown[]): SedonaUtil;
}

/**
 * Sedona Extension
 */
export class SedonaLib extends hxConn.ConnLib {
  static type$: sys.Type
  static make(...args: unknown[]): SedonaLib;
}

/**
 * SedonaDispatch
 */
export class SedonaDispatch extends hxConn.ConnDispatch {
  static type$: sys.Type
  sox(): [java]sedona.sox.SoxClient | null;
  sox(it: [java]sedona.sox.SoxClient | null): void;
  dasm(): [java]sedona.dasp.DaspSocket | null;
  dasm(it: [java]sedona.dasp.DaspSocket | null): void;
  scheme(): SedonaScheme | null;
  scheme(it: SedonaScheme | null): void;
  /**
   * Callback for sedonaSyncCur, do explicit readProp
   */
  onSyncCur(points: sys.List<hxConn.ConnPoint>): void;
  onReceive(msg: hx.HxMsg): sys.JsObj | null;
  /**
   * Callback for watch, do subscription on comp
   */
  onWatch(points: sys.List<hxConn.ConnPoint>): void;
  onClose(): void;
  /**
   * Callback for unwatch, do unsubscription on comp
   */
  onUnwatch(points: sys.List<hxConn.ConnPoint>): void;
  onLearn(arg: sys.JsObj | null): haystack.Grid;
  onWrite(point: hxConn.ConnPoint, info: hxConn.ConnWriteInfo): void;
  onOpen(): void;
  static make(arg: sys.JsObj, ...args: unknown[]): SedonaDispatch;
  /**
   * Callback for SoxCompListener, our SoxComp is already updated
   */
  onUpdateCur(id: haystack.Ref): sys.JsObj | null;
  onPing(): haystack.Dict;
}

