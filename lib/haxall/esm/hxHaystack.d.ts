import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as folio from './folio.js';
import * as hx from './hx.js';
import * as hxConn from './hxConn.js';

/**
 * Haystack connector functions
 */
export class HaystackFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Invoke a remote action on the given Haystack connector and
   * remote entity.  The id must be a Ref of the remote entity's
   * identifier and action is a Str action name.  If args are
   * specified, then they should be a Dict keyed by parameter
   * name.
   */
  static haystackInvokeAction(conn: sys.JsObj, id: sys.JsObj, action: string, args?: haystack.Dict | null): sys.JsObj | null;
  /**
   * Perform Haystack HTTP API call to read a record by its
   * unique identifier.  Return result as dict.  If the record is
   * not found, then return null or raise UnknownRecErr based on
   * checked flag.  Also see {@link haystack.Client.readById | haystack::Client.readById}.
   */
  static haystackReadById(conn: sys.JsObj, id: sys.JsObj, checked?: boolean): haystack.Dict | null;
  /**
   * Deprecated - use [connLearn()](connLearn())
   */
  static haystackLearn(conn: sys.JsObj, arg?: sys.JsObj | null): haystack.Grid;
  /**
   * Perform Haystack HTTP API call to read a list of records by
   * their identifiers.  Return a grid where each row of the grid
   * maps to the respective id list (indexes line up).  If
   * checked is true and any one of the ids cannot be resolved
   * then raise UnknownRecErr for first id not resolved.  If
   * checked is false, then each id not found has a row where
   * every cell is null.  Also see {@link haystack.Client.readByIds | haystack::Client.readByIds}.
   */
  static haystackReadByIds(conn: sys.JsObj, ids: sys.List<sys.JsObj>, checked?: boolean): haystack.Grid;
  /**
   * Deprecated - use [connSyncCur()](connSyncCur())
   */
  static haystackSyncCur(points: sys.JsObj): sys.List<concurrent.Future>;
  /**
   * Perform Haystack REST API call to read single entity with
   * filter. The filter is an expression like [readAll](readAll). 
   * Return result as dict. If the record is not found, then
   * return null or raise UnknownRecErr based on checked flag. 
   * Also see {@link haystack.Client.read | haystack::Client.read}.
   */
  static haystackRead(conn: axon.Expr, filterExpr: axon.Expr, checked?: axon.Expr): haystack.Dict | null;
  /**
   * Perform Haystack HTTP API call to given Str op name and with
   * given request grid (can be anything acceptable [toGrid](toGrid)).
   * If the checked flag is true and server returns an error
   * grid, then raise {@link haystack.CallErr | haystack::CallErr},
   * otherwise return the grid itself. Result is returned as
   * Grid.  Also see {@link haystack.Client.call | haystack::Client.call}.
   */
  static haystackCall(conn: sys.JsObj, op: string, req?: sys.JsObj | null, checked?: boolean): haystack.Grid;
  /**
   * Perform Haystack REST API "hisRead" call to read history
   * data for the record identified by the id (must be Ref). The
   * range is any string encoding supported by the REST API or
   * any value supported by [toDateSpan](toDateSpan).  Return
   * results as grid with "ts" and "val" column.
   */
  static haystackHisRead(conn: sys.JsObj, id: sys.JsObj, range: sys.JsObj | null): haystack.Grid;
  static make(...args: unknown[]): HaystackFuncs;
  /**
   * Deprecated - use [connSyncHis()](connSyncHis())
   */
  static haystackSyncHis(points: sys.JsObj, span?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Evaluate an Axon expression in a remote server over a
   * haystack connector.  The remote server must be a SkySpark
   * server which supports the "eval" REST op with an Axon
   * expression.  This function blocks while the network request
   * is made.  The result is always returned as a Grid using the
   * same rules as {@link haystack.Etc.toGrid | haystack::Etc.toGrid}.
   * 
   * The expression to evaluate in the remote server may capture
   * variables from the local scope.  If these variables are
   * atomic types, then they are captured as defined by local
   * scope and serialized to the remote server.  Pass `{debug}` for
   * opts to dump to stdout the actual expr with serialized
   * scope.
   * 
   * Options:
   * - `debug`: dumps full expr with seralized scope to stdout
   * - `evalTimeout`: duration number to override remote project's
   *   default [evalTimeout](https://fantom.org/doc/docSkySpark/Tuning#folio)
   * 
   * Examples:
   * ```
   * read(haystackConn).haystackEval(3 + 4)
   * read(haystackConn).haystackEval(readAll(site))
   * read(haystackConn).haystackEval(readAll(kw).hisRead(yesterday))
   * ```
   */
  static haystackEval(conn: axon.Expr, expr: axon.Expr, opts?: axon.Expr): sys.JsObj | null;
  /**
   * Perform Haystack REST API call to read all entities with
   * filter. The filter is an expression like [readAll](readAll). 
   * Return results as grid.  Also see {@link haystack.Client.readAll | haystack::Client.readAll}.
   */
  static haystackReadAll(conn: axon.Expr, filterExpr: axon.Expr): haystack.Grid;
  /**
   * Deprecated - use [connPing()](connPing())
   */
  static haystackPing(conn: sys.JsObj): concurrent.Future;
}

export class HaystackConnTest extends hx.HxTest {
  static type$: sys.Type
  conn(): haystack.Dict | null;
  conn(it: haystack.Dict | null): void;
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
  hisSyncF(): haystack.Dict | null;
  hisSyncF(it: haystack.Dict | null): void;
  ptw(): haystack.Dict | null;
  ptw(it: haystack.Dict | null): void;
  verifyPointWrite(): void;
  verifyReads(): void;
  static dt(y: number, m: number, d: number, h: number, min: number, tz?: sys.TimeZone): sys.DateTime;
  evalToGrid($axon: string): haystack.Grid;
  verifyCall(): void;
  verifyInvokeAction(): void;
  verifyConn(): void;
  init(): void;
  verifyReadHis(): void;
  static item(ts: sys.DateTime, val: sys.JsObj | null): haystack.HisItem;
  test(): void;
  syncConn(): void;
  verifySyncHis(): void;
  doVerifyReadHis(rec: haystack.Dict, range: string): void;
  static make(...args: unknown[]): HaystackConnTest;
  verifyEvalErr($axon: string, errType: sys.Type | null): void;
  resetCur(r: haystack.Dict): void;
  verifyCur(r: haystack.Dict, val: sys.JsObj | null, status?: string, err?: string | null): void;
  verifyHaystackEval(): void;
  verifyWatches(): void;
}

/**
 * Dispatch callbacks for the Haystack connector
 */
export class HaystackDispatch extends hxConn.ConnDispatch {
  static type$: sys.Type
  onEval(expr: string, opts: haystack.Dict): sys.JsObj | null;
  onRead(filter: string, checked: boolean): sys.JsObj | null;
  onSyncCur(points: sys.List<hxConn.ConnPoint>): void;
  onReceive(msg: hx.HxMsg): sys.JsObj | null;
  onWatch(points: sys.List<hxConn.ConnPoint>): void;
  openClient(): haystack.Client;
  onClose(): void;
  onUnwatch(points: sys.List<hxConn.ConnPoint>): void;
  onInvokeAction(id: sys.JsObj, action: string, args: haystack.Dict): sys.JsObj | null;
  onHisRead(id: haystack.Ref, range: string): haystack.Grid;
  onLearn(arg: sys.JsObj | null): haystack.Grid;
  onReadAll(filter: string): sys.JsObj | null;
  onWrite(point: hxConn.ConnPoint, info: hxConn.ConnWriteInfo): void;
  onCall(op: string, req: haystack.Grid, checked: boolean): haystack.Grid;
  onSyncHis(point: hxConn.ConnPoint, span: haystack.Span): sys.JsObj | null;
  onOpen(): void;
  onReadById(id: sys.JsObj, checked: boolean): sys.JsObj | null;
  static make(arg: sys.JsObj, ...args: unknown[]): HaystackDispatch;
  onPollManual(): void;
  onPing(): haystack.Dict;
  call(op: string, req: haystack.Grid, checked?: boolean): haystack.Grid;
  onReadByIds(ids: sys.List<sys.JsObj>, checked: boolean): sys.JsObj | null;
}

/**
 * Haystack connector library
 */
export class HaystackLib extends hxConn.ConnLib {
  static type$: sys.Type
  onConnDetails(c: hxConn.Conn): string;
  static make(...args: unknown[]): HaystackLib;
}

