import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as inet from './inet.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as obs from './obs.js';
import * as folio from './folio.js';
import * as hx from './hx.js';
import * as hxUtil from './hxUtil.js';
import * as hxPoint from './hxPoint.js';

/**
 * Models a failure condition when the remote point is not "ok"
 */
export class RemoteStatusErr extends sys.Err {
  static type$: sys.Type
  /**
   * Status of the remote point
   */
  status(): ConnStatus;
  /**
   * Construct with status of remote point
   */
  static make(status: ConnStatus, ...args: unknown[]): RemoteStatusErr;
}

/**
 * ConnTraceMsg models one timestamped trace message
 */
export class ConnTraceMsg extends sys.Obj {
  static type$: sys.Type
  /**
   * Description of the trace message
   */
  msg(): string;
  /**
   * Message type:
   * - "dispatch": message send to the ConnDispatch
   * - "req": protocol specific request message
   * - "res": protocol specific response message
   * - "event": protocol specific unsolicited event message
   * - "poll": polling callback
   * - "hk": house keeping callback
   * - "log": when using the trace as a system log
   */
  type(): string;
  /**
   * Extra data about this trace mesage:
   * - "dispatch": the HxMsg instance
   * - "req": message as Str or Buf
   * - "res": message as Str or Buf
   * - "event": message as Str or Buf
   * - "log": LogRec instance
   */
  arg(): sys.JsObj | null;
  /**
   * Timestamp of trace message
   */
  ts(): sys.DateTime;
  /**
   * String representation (subject to change)
   */
  toStr(): string;
  /**
   * Argument to debug string
   */
  argToStr(): string | null;
  /**
   * Convert list of trace messages to a grid
   */
  static toGrid(list: sys.List<ConnTraceMsg>, meta?: sys.JsObj | null): haystack.Grid;
}

/**
 * ConnTrace provides a debug trace for each connector. Trace
 * messages are stored in RAM using a circular buffer.
 */
export class ConnTrace extends concurrent.Actor {
  static type$: sys.Type
  /**
   * Trace a dispatch message
   */
  dispatch(msg: hx.HxMsg): void;
  /**
   * Trace a poll message
   */
  poll(msg: string, arg?: sys.JsObj | null): void;
  /**
   * Enable tracing the connector
   */
  enable(): void;
  /**
   * Trace a protocol specific unsolicited event message. The arg
   * must be a Str or Buf.  If arg is a Buf then you must call `toImmutable`
   * on it first to ensure backing array is not cleared.
   */
  event(msg: string, arg: sys.JsObj): void;
  /**
   * Write a trace message
   */
  write(type: string, msg: string, arg?: sys.JsObj | null): void;
  /**
   * Trace a protocol specific request message. The arg must be a
   * Str or Buf.  If arg is a Buf then you must call `toImmutable`
   * on it first to ensure backing array is not cleared.
   */
  req(msg: string, arg: sys.JsObj): void;
  /**
   * Trace a phase message
   */
  phase(msg: string, arg?: sys.JsObj | null): void;
  /**
   * Trace a protocol specific response message. The arg must be
   * a Str or Buf.  If arg is a Buf then you must call `toImmutable`
   * on it first to ensure backing array is not cleared.
   */
  res(msg: string, arg: sys.JsObj): void;
  /**
   * Get the current trace messages or empty list if not enabled.
   * Messages are ordered from oldest to newest.
   */
  read(): sys.List<ConnTraceMsg>;
  /**
   * Max number of trace messages to store in RAM
   */
  max(): number;
  /**
   * Clear the trace log
   */
  clear(): void;
  /**
   * Read all trace messages since the given timestamp.  If the
   * timestamp is null, then read all messages in the buffer.
   * Messages are ordered from oldest to newest.
   */
  readSince(since: sys.DateTime | null): sys.List<ConnTraceMsg>;
  /**
   * Disable tracing for the connector
   */
  disable(): void;
  /**
   * Is tracing currently enabled for the connector
   */
  isEnabled(): boolean;
  /**
   * Expose the trace as a standard system log.  Messages sent to
   * the log instance are traced as follows:
   * - if message starts with ">" it is logged as "req" type
   * - if message starts with "<" it is logged as "res" type
   * - if message starts with "^" it is logged as "event" type
   * - otherwise it is logged as "log" type
   * 
   * When logging as a request/response the 2nd line is used as
   * summary with the expectation that log format is patterned as
   * follows:
   * ```
   * < message-id
   * Summary line
   * ... more details ...
   * ```
   */
  asLog(): sys.Log;
}

/**
 * The polling modes supported by the connector framework
 */
export class ConnPollMode extends sys.Enum {
  static type$: sys.Type
  /**
   * List of ConnPollMode values indexed by ordinal
   */
  static vals(): sys.List<ConnPollMode>;
  /**
   * Connector framework handles the polling logic using buckets
   * strategy
   */
  static buckets(): ConnPollMode;
  /**
   * Connector implementation handles all polling logic
   */
  static manual(): ConnPollMode;
  /**
   * Polling not supported
   */
  static disabled(): ConnPollMode;
  /**
   * Return the ConnPollMode instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): ConnPollMode;
  /**
   * Return `true` if the mode is not {@link disabled | disabled}.
   */
  isEnabled(): boolean;
}

/**
 * Conn models a connection to a single endpoint.
 */
export class Conn extends concurrent.Actor implements hx.HxConn {
  static type$: sys.Type
  /**
   * Parent connector library
   */
  lib(): ConnLib;
  /**
   * Library specific connector data.  This value is managed by
   * the connector actor via {@link ConnDispatch.setConnData | ConnDispatch.setConnData}.
   */
  data(): sys.JsObj | null;
  /**
   * Synchronize the current values for the given points
   */
  syncCur(points: sys.List<ConnPoint>): concurrent.Future;
  /**
   * Display name
   */
  dis(): string;
  /**
   * Get list of all points managed by this connector.
   */
  points(): sys.List<ConnPoint>;
  /**
   * Current version of the record. This dict only represents the
   * current persistent tags. It does not track transient changes
   * such as `connStatus`.
   */
  rec(): haystack.Dict;
  /**
   * Sync a synchronous message to the actor, and block based on
   * the configurable timeout.
   */
  sendSync(msg: hx.HxMsg): sys.JsObj | null;
  /**
   * Record id
   */
  id(): haystack.Ref;
  /**
   * Does the record have the `disabled` marker configured
   */
  isDisabled(): boolean;
  /**
   * Debug string
   */
  toStr(): string;
  /**
   * Conn tuning configuration to use for this connector.
   */
  tuning(): ConnTuning;
  /**
   * Block until this conn processes its current actor queue
   */
  sync(timeout?: sys.Duration | null): this;
  /**
   * Frequency to retry opens. See [connOpenRetryFreq](connOpenRetryFreq).
   */
  openRetryFreq(): sys.Duration;
  /**
   * Poll strategy for connector
   */
  pollMode(): ConnPollMode;
  /**
   * Current status of the connector
   */
  status(): ConnStatus;
  /**
   * Get list of all point ids managed by this connector.
   */
  pointIds(): sys.List<haystack.Ref>;
  /**
   * Runtime system
   */
  rt(): hx.HxRuntime;
  /**
   * Log for this connector
   */
  log(): sys.Log;
  /**
   * Invoke ping request
   */
  ping(): concurrent.Future;
  /**
   * Timeout to use for I/O and actor messaging - see [actorTimeout](actorTimeout).
   */
  timeout(): sys.Duration;
  /**
   * Get the point managed by this connector via its point rec
   * id.
   */
  point(id: haystack.Ref, checked?: boolean): ConnPoint | null;
  /**
   * Debug tracing for this connector
   */
  trace(): ConnTrace;
  /**
   * Force close of connection if open
   */
  close(): concurrent.Future;
  /**
   * Configured poll frequency if connector uses manual polling
   */
  pollFreq(): sys.Duration | null;
  /**
   * Actor messages are routed to {@link ConnDispatch | ConnDispatch}
   */
  receive(m: sys.JsObj | null): sys.JsObj | null;
  /**
   * Configured linger timeout - see [connLinger](connLinger)
   */
  linger(): sys.Duration;
  /**
   * Runtime database
   */
  db(): folio.Folio;
  /**
   * Configured ping frequency to test connection or null if
   * feature is disabled - see [connPingFreq](connPingFreq)
   */
  pingFreq(): sys.Duration | null;
  /**
   * Make a learn request to the connector.  Future result is
   * learn grid.
   */
  learnAsync(arg?: sys.JsObj | null): concurrent.Future;
  /**
   * Debug details
   */
  details(): string;
}

/**
 * ConnPoint models a point within a connector.
 */
export class ConnPoint extends sys.Obj implements hx.HxConnPoint {
  static type$: sys.Type
  /**
   * Parent connector
   */
  conn(): Conn;
  /**
   * Parent connector library
   */
  lib(): ConnLib;
  /**
   * Library specific point data.  This value is managed by the
   * connector actor via {@link ConnDispatch.setPointData | ConnDispatch.setPointData}.
   */
  data(): sys.JsObj | null;
  /**
   * Timezone defined by rec `tz` tag
   */
  tz(): sys.TimeZone;
  /**
   * Update his sync with given error
   */
  updateHisErr(err: sys.Err): sys.JsObj | null;
  /**
   * History address tag value if configured on the point
   */
  hisAddr(): sys.JsObj | null;
  /**
   * Is current address enabled on this point. This returns true
   * only when all the of following conditions are met:
   * - the connector supports current values
   * - this point has a cur address tag configured
   * - the address tag value is of the proper type
   * - the point is not disabled
   */
  isCurEnabled(): boolean;
  /**
   * Display name
   */
  dis(): string;
  /**
   * Current version of the record. This dict only represents the
   * current persistent tags. It does not track transient changes
   * such as `curVal` and `curStatus`.
   */
  rec(): haystack.Dict;
  /**
   * Record id
   */
  id(): haystack.Ref;
  /**
   * Does the record have the `disabled` marker configured
   */
  isDisabled(): boolean;
  /**
   * Put point into down/fault/remoteErr with given error.
   */
  updateCurErr(err: sys.Err): void;
  /**
   * Debug string
   */
  toStr(): string;
  /**
   * Update write status down/fault with given error
   */
  updateWriteErr(info: ConnWriteInfo, err: sys.Err): void;
  /**
   * Conn tuning configuration to use for this point
   */
  tuning(): ConnTuning;
  /**
   * Point kind defined by rec `kind` tag
   */
  kind(): haystack.Kind;
  /**
   * Is this point currently in one or more watches
   */
  isWatched(): boolean;
  /**
   * Unit defined by rec `unit` tag or null
   */
  unit(): sys.Unit | null;
  /**
   * Update current value and status
   */
  updateCurOk(val: sys.JsObj | null): void;
  /**
   * Is the record missing `disabled` marker configured
   */
  isEnabled(): boolean;
  /**
   * Current address tag value if configured on the point
   */
  curAddr(): sys.JsObj | null;
  /**
   * Write new history items and update status.  Span should be
   * same value passed to `onSyncHis`.  The items will be
   * normalized, clipped by span, converted by `hisConvert` if
   * configured, and then and written to historian.
   */
  updateHisOk(items: sys.List<haystack.HisItem>, span: haystack.Span): sys.JsObj | null;
  /**
   * Write address tag value if configured on the point
   */
  writeAddr(): sys.JsObj | null;
  /**
   * Is history address supported on this point. This returns
   * true only when all the of following conditions are met:
   * - the connector supports history synchronization
   * - this point has a his address tag configured
   * - the address tag value is of the proper type
   * - the point is not disabled
   */
  isHisEnabled(): boolean;
  /**
   * Is write address enabled on this point. This returns true
   * only when all the of following conditions are met:
   * - the connector supports writable points
   * - this point has a write address tag configured
   * - the address tag value is of the proper type
   * - the point is not disabled
   */
  isWriteEnabled(): boolean;
  /**
   * Update write value and status
   */
  updateWriteOk(info: ConnWriteInfo): void;
  /**
   * Debug details
   */
  details(): string;
}

/**
 * ConnSettings is the base class for connector library
 * settings.
 */
export class ConnSettings extends haystack.TypedDict {
  static type$: sys.Type
  /**
   * Max threads for the connector's actor pool.  Adding more
   * threads allows more connectors to work concurrently
   * processing their messages. However more threads will incur
   * additional memory usage. In general this value should be
   * somewhere between 50% and 75% of the total number of
   * connectors in the extension.  A restart is required for a
   * change to take effect.
   */
  maxThreads(): number;
  __maxThreads(it: number): void;
  /**
   * Default tuning to use when connTuningRef is not explicitly
   * configured on the connector or point record.
   */
  connTuningRef(): haystack.Ref | null;
  __connTuningRef(it: haystack.Ref | null): void;
  /**
   * Constructor
   */
  static make(d: haystack.Dict, f: ((arg0: ConnSettings) => void), ...args: unknown[]): ConnSettings;
}

/**
 * Connector library base class. See [docHaxall::CustomConns#connLib](https://fantom.org/doc/docHaxall/CustomConns#connLib).
 */
export class ConnLib extends hx.HxLib implements hx.HxConnLib {
  static type$: sys.Type
  /**
   * Lookup a connector by its record id
   */
  conn(id: haystack.Ref, checked?: boolean): Conn | null;
  /**
   * Return connector specific details to insert into debug
   * report. Connectors should avoid requiring a message to the
   * Conn actor so that debug can proceed even if the actor is
   * blocked on I/O. Utilize {@link Conn.data | Conn.data} to
   * cache debug information.
   */
  onConnDetails(conn: Conn): string;
  /**
   * Create default point tuning configuration for this library
   */
  tuningDefault(): ConnTuning;
  /**
   * List all the points across all connectors
   */
  points(): sys.List<ConnPoint>;
  /**
   * Settings record
   */
  rec(): ConnSettings;
  /**
   * Start callback - if overridden you *must* call super
   */
  onStart(): void;
  /**
   * Stop callback - if overridden you *must* call super
   */
  onStop(): void;
  /**
   * Record update - if overridden you *must* call super
   */
  onRecUpdate(): void;
  /**
   * Library level callback to process a connector learn.  The
   * default operation dispatches to the connector actor,
   * performs an open, and then callback to to {@link ConnDispatch.onLearn | ConnDispatch.onLearn}.
   * However, some connectors can perform a learn operation
   * without using an open connector (for example using
   * configuration files).  In that case, use this hook to
   * process the learn request without dispatching to the Conn
   * actor.
   */
  onLearn(conn: Conn, arg: sys.JsObj | null): concurrent.Future;
  /**
   * Lookup a point by its record id
   */
  point(id: haystack.Ref, checked?: boolean): ConnPoint | null;
  /**
   * Return connector specific details to insert into debug
   * report. Connectors should avoid requiring a message to the
   * Conn actor so that debug can proceed even if the actor is
   * blocked on I/O. Utilize {@link ConnPoint.data | ConnPoint.data}
   * to cache debug information.
   */
  onPointDetails(point: ConnPoint): string;
  /**
   * Constructor
   */
  static make(...args: unknown[]): ConnLib;
  /**
   * List all the connectors
   */
  conns(): sys.List<Conn>;
  /**
   * Icon logical name to use for this connector type library
   */
  icon(): string;
  /**
   * Display name to use for connector library
   */
  libDis(): string;
  /**
   * Dict with markers for supported features: learn, cur, write,
   * his
   */
  connFeatures(): haystack.Dict;
  /**
   * Library name
   */
  name(): string;
  /**
   * Tag name for the connector records such as `bacnetConn`
   */
  connTag(): string;
  /**
   * Tag name for the connector records such as `bacnetConnRef`
   */
  connRefTag(): string;
  /**
   * Number of configured connectors
   */
  numConns(): number;
}

/**
 * ConnDispatch provides an implementation for all callbacks. 
 * A subclass is created by each connector to implement the
 * various callbacks and store mutable state.  All dispatch
 * callbacks are executed within the parent Conn actor.  See [docHaxall::CustomConns#connDispatch](https://fantom.org/doc/docHaxall/CustomConns#connDispatch).
 */
export class ConnDispatch extends sys.Obj {
  static type$: sys.Type
  /**
   * Parent connector
   */
  conn(): Conn;
  /**
   * Callback to poll a bucket of points with the same tuning
   * config. Default implementation calls {@link onSyncCur | onSyncCur}.
   * This callback is only used if the {@link Conn.pollMode | Conn.pollMode}
   * is configured as "buckets".
   */
  onPollBucket(points: sys.List<ConnPoint>): void;
  /**
   * Parent library
   */
  lib(): ConnLib;
  /**
   * Return if there is one or more points currently in watch.
   */
  hasPointsWatched(): boolean;
  /**
   * Display name
   */
  dis(): string;
  /**
   * Get list of all points managed by this connector.
   */
  points(): sys.List<ConnPoint>;
  /**
   * Callback to synchronize the given list of points.  The
   * result of this call should be to invoke {@link ConnPoint.updateCurOk | ConnPoint.updateCurOk}
   * or {@link ConnPoint.updateCurErr | ConnPoint.updateCurErr} on
   * each point.  All the points are guaranteed to return true
   * for {@link ConnPoint.isCurEnabled | isCurEnabled}
   */
  onSyncCur(points: sys.List<ConnPoint>): void;
  /**
   * Current version of the record. This dict only represents the
   * current persistent tags. It does not track transient changes
   * such as `connStatus`.
   */
  rec(): haystack.Dict;
  /**
   * Record id
   */
  id(): haystack.Ref;
  /**
   * Set the {@link Conn.data | Conn.data} value.  The value must
   * be immutable.
   */
  setConnData(val: sys.JsObj | null): void;
  /**
   * Callback to handle custom actor messages
   */
  onReceive(msg: hx.HxMsg): sys.JsObj | null;
  /**
   * Callback when point is removed from this connector
   */
  onPointRemoved(pt: ConnPoint): void;
  /**
   * Callback when one or more points are put into watch mode. 
   * All the points are guaranteed to return true for {@link ConnPoint.isCurEnabled | isCurEnabled}
   */
  onWatch(points: sys.List<ConnPoint>): void;
  /**
   * Callback made periodically every few seconds to handle
   * background tasks.
   */
  onHouseKeeping(): void;
  /**
   * Callback to handle close of the connection.
   */
  onClose(): void;
  /**
   * Callback when one or more points are taken out of watch
   * mode.
   */
  onUnwatch(points: sys.List<ConnPoint>): void;
  /**
   * Runtime system
   */
  rt(): hx.HxRuntime;
  /**
   * Callback to handle learn tree navigation.  This method
   * should return a grid where the rows are either navigation
   * elements to traverse or points to map.  The `learn` tag is
   * used to indicate a row which may be "dived into" to navigate
   * the remote system's tree. The `learn` value is passed back to
   * this function to get the next level of the tree.  A null arg
   * should return the root of the learn tree.
   * 
   * Also see {@link ConnLib.onLearn | ConnLib.onLearn} which
   * provides the top-level callback for learn.  If your learn
   * implementation does not require an open connection, then use
   * the `ConnLib` level callback.  By default that callback will
   * dispatch a message to Conn actor, perform {@link open | open},
   * and then invoke this callback.
   * 
   * The following tags should be used to indicate points to map:
   * - dis: display name for navigation (required for all rows)
   * - point: marker indicating point (1 or more fooCur/His/Write)
   * - fooPoint: marker
   * - fooCur: address if object can be mapped for cur real-time
   *   sync
   * - fooWrite: address if object can be mapped for writing
   * - fooHis: address if object can be mapped for history sync
   * - kind: point kind type if known
   * - unit: point unit if known
   * - hisInterpolate: if point is known to be collected as COV
   * - enum: if range of bool or multi-state is known
   * - any other known tags to map to the learned points
   */
  onLearn(arg: sys.JsObj | null): haystack.Grid;
  /**
   * Log for this connector
   */
  log(): sys.Log;
  /**
   * Callback to write a point.  The connector should write `info.val`
   * to the remote system.  If successful then call {@link ConnPoint.updateWriteOk | ConnPoint.updateWriteOk}.
   * If there is an error then invoke {@link ConnPoint.updateWriteErr | ConnPoint.updateWriteErr}
   * or raise an exception.  Note the value  may have been
   * convered from [writeVal](writeVal) if [writeConvert](writeConvert)
   * is configured.
   */
  onWrite(point: ConnPoint, event: ConnWriteInfo): void;
  /**
   * Get the point managed by this connector via its point rec
   * id.
   */
  point(id: haystack.Ref, checked?: boolean): ConnPoint | null;
  /**
   * Callback when conn record is updated
   */
  onConnUpdated(): void;
  /**
   * Callback to synchronize the a point's history data from the
   * connector.  The result of this callback must be to invoke {@link ConnPoint.updateHisOk | ConnPoint.updateHisOk}
   * or {@link ConnPoint.updateHisErr | ConnPoint.updateHisErr}
   * (or just raise exception).  The return of this method should
   * be whatever `updateHisXXX` returns.
   */
  onSyncHis(point: ConnPoint, span: haystack.Span): sys.JsObj | null;
  /**
   * Debug tracing for this connector
   */
  trace(): ConnTrace;
  /**
   * Callback to handle opening the connection.  Raise DownErr or
   * FaultErr if the connection failed.  This callback is always
   * called before operations such as {@link onPing | onPing}.
   */
  onOpen(): void;
  /**
   * Constructor with framework specific argument
   */
  static make(arg: sys.JsObj, ...args: unknown[]): ConnDispatch;
  /**
   * Force this connector closed.
   */
  close(cause: sys.Err | null): this;
  /**
   * Callback made periodically for manual polling.  This
   * callback is only invoked if {@link Conn.pollMode | Conn.pollMode}
   * is configured as "manual". The frequency of the callback is
   * determined by {@link Conn.pollFreq | Conn.pollFreq}. Use {@link pointsWatched | pointsWatched}
   * to list of points currently being watched.
   */
  onPollManual(): void;
  /**
   * Set the {@link ConnPoint.data | ConnPoint.data} value.  The
   * value must be immutable.
   */
  setPointData(pt: ConnPoint, val: sys.JsObj | null): void;
  /**
   * Callback when point is added to this connector
   */
  onPointAdded(pt: ConnPoint): void;
  /**
   * Callback to handle ping of the connector.  Return custom
   * status tags such as device version, etc to store on the
   * connector record persistently.  If there are version tags
   * which should be removed then map those tags to Remove.val. 
   * If ping fails then raise exception and the connector will be
   * automatically closed.
   */
  onPing(): haystack.Dict;
  /**
   * Callback when conn record is removed
   */
  onConnRemoved(): void;
  /**
   * Callback when point record is updated
   */
  onPointUpdated(pt: ConnPoint): void;
  /**
   * Runtime database
   */
  db(): folio.Folio;
  /**
   * Open the connector.  The connection will linger open based
   * on the configured linger timeout, then automatically close.
   * If the connector fails to open, then raise an exception.
   */
  open(): this;
  /**
   * Get list of points which are currently in watch.
   */
  pointsWatched(): sys.List<ConnPoint>;
}

/**
 * ConnStatus enumeration.  This is a unified status value that
 * incorporates [connStatus](connStatus), [curStatus](curStatus),
 * [writeStatus](writeStatus) and [hisStatus](hisStatus).  We do
 * not model hisStatus pending/syncing.
 */
export class ConnStatus extends sys.Enum {
  static type$: sys.Type
  static remoteDown(): ConnStatus;
  /**
   * List of ConnStatus values indexed by ordinal
   */
  static vals(): sys.List<ConnStatus>;
  static down(): ConnStatus;
  static unknown(): ConnStatus;
  static stale(): ConnStatus;
  static disabled(): ConnStatus;
  static remoteUnknown(): ConnStatus;
  static ok(): ConnStatus;
  static fault(): ConnStatus;
  static remoteDisabled(): ConnStatus;
  static remoteFault(): ConnStatus;
  /**
   * Is the {@link ok | ok} instance
   */
  isOk(): boolean;
  /**
   * Is the {@link disabled | disabled} instance
   */
  isDisabled(): boolean;
  /**
   * Is this is a remote status
   */
  isRemote(): boolean;
  /**
   * Return if this is not {@link isRemote | isRemote}
   */
  isLocal(): boolean;
  /**
   * Return the ConnStatus instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): ConnStatus;
  /**
   * Is the {@link unknown | unknown} instance
   */
  isUnknown(): boolean;
}

/**
 * ConnTuning models a [connTuning](connTuning) rec. See [docHaxall::ConnTuning](https://fantom.org/doc/docHaxall/ConnTuning)
 */
export class ConnTuning extends sys.Obj {
  static type$: sys.Type
  /**
   * Debug string
   */
  toStr(): string;
  /**
   * Time before a point's curStatus marked from "ok" to "stale".
   * See See [docHaxall::ConnTuning#staleTime](https://fantom.org/doc/docHaxall/ConnTuning#staleTime).
   */
  staleTime(): sys.Duration;
  /**
   * Minimum time between writes used to throttle the speed of
   * writes. See See [docHaxall::ConnTuning#writeMinTime](https://fantom.org/doc/docHaxall/ConnTuning#writeMinTime).
   */
  writeMinTime(): sys.Duration | null;
  /**
   * Issue a write when system starts up, otherwise suppress it.
   * See [docHaxall::ConnTuning#writeOnStart](https://fantom.org/doc/docHaxall/ConnTuning#writeOnStart).
   */
  writeOnStart(): boolean;
  /**
   * Display name
   */
  dis(): string;
  /**
   * Frequency between polls of `curVal`. See See [docHaxall::ConnTuning#pollTime](https://fantom.org/doc/docHaxall/ConnTuning#pollTime).
   */
  pollTime(): sys.Duration;
  /**
   * Rec for tuning config
   */
  rec(): haystack.Dict;
  /**
   * Record id
   */
  id(): haystack.Ref;
  /**
   * Construct with current record
   */
  static make(rec: haystack.Dict, ...args: unknown[]): ConnTuning;
  /**
   * Rewrite the point everytime time the connector transitions
   * to open. See See [docHaxall::ConnTuning#writeOnOpen](https://fantom.org/doc/docHaxall/ConnTuning#writeOnOpen).
   */
  writeOnOpen(): boolean;
  /**
   * Maximum time between writes used to send periodic writes.
   * See See [docHaxall::ConnTuning#writeMaxTime](https://fantom.org/doc/docHaxall/ConnTuning#writeMaxTime).
   */
  writeMaxTime(): sys.Duration | null;
}

/**
 * ConnWriteInfo wraps the value to write to the remote system.
 * It carries information used to update local transient tags.
 */
export class ConnWriteInfo extends sys.Obj {
  static type$: sys.Type
  /**
   * Value to write to the remote system; might be converted from
   * writeVal
   */
  val(): sys.JsObj | null;
  /**
   * Debug string representation
   */
  toStr(): string;
  asMaxTime(): this;
  asMinTime(): this;
  asOnOpen(): this;
}

