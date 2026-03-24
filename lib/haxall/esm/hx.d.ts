import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as inet from './inet.js';
import * as crypto from './crypto.js';
import * as util from './util.js';
import * as web from './web.js';
import * as xeto from './xeto.js';
import * as haystack from './haystack.js';
import * as def from './def.js';
import * as axon from './axon.js';
import * as obs from './obs.js';
import * as folio from './folio.js';

/**
 * HxWatch is a subscription to a set of records in a project
 * database. It provides an efficient mechanism to poll for
 * changes. Also see [docHaxall::Watches#fantom](https://fantom.org/doc/docHaxall/Watches#fantom).
 */
export class HxWatch extends sys.Obj {
  static type$: sys.Type
  /**
   * The lease determines the max duration which may elapse
   * without a renew call before the watch is expired.  The
   * default is 1min. Clients can attempt to tune the lease time
   * by setting this field, but no guarantee is made that the
   * framework will honor extremely long lease times.
   */
  lease(): sys.Duration;
  lease(it: sys.Duration): void;
  /**
   * Runtime associated with this watch
   */
  rt(): HxRuntime;
  /**
   * Convenience for `addAll` for `id` column of each row. If any row
   * is missing an `id` tag then it is silently skipped.
   */
  addGrid(grid: haystack.Grid): void;
  /**
   * Get all the records which have been modified since the given
   * ticks. An empty list is returned if no changes have been
   * made to the watched records since ticks.  There is no
   * ordering to the resulting list. This method automatically
   * renews the lease and keeps track of the last poll ticks. 
   * Also see [docHaxall::Watches#fantom](https://fantom.org/doc/docHaxall/Watches#fantom).
   */
  poll(ticks?: sys.Duration): sys.List<haystack.Dict>;
  /**
   * Convenience for `removeAll([id])`
   */
  remove(id: haystack.Ref): void;
  /**
   * Debug display string used during `watchOpen`
   */
  dis(): string;
  /**
   * Remove the given records from this watch.  Any ids not
   * currently subscribed by this watch are silently ignored.
   * Raise exception if watch is closed. This call renews the
   * lease.
   */
  removeAll(ids: sys.List<haystack.Ref>): void;
  /**
   * Identifier which uniquely identifies this watch in the
   * project
   */
  id(): string;
  /**
   * Close this watch and unsubscribe all its records. If watch
   * is already closed, this method is a no op.
   */
  close(): void;
  static make(...args: unknown[]): HxWatch;
  /**
   * Convenience for `removeAll` for `id` column of each row
   */
  removeGrid(grid: haystack.Grid): void;
  /**
   * Convenience for `addAll([id])`
   */
  add(id: haystack.Ref): void;
  /**
   * Debug string
   */
  toStr(): string;
  /**
   * Return if the list of recs currently subscribed is empty.
   */
  isEmpty(): boolean;
  /**
   * List the rec ids currently subscribed by this watch. Raise
   * exception if watch is closed.
   */
  list(): sys.List<haystack.Ref>;
  /**
   * Return if this watch has been closed
   */
  isClosed(): boolean;
  /**
   * Add the given records to this watch.  Silently ignore any
   * ids already subscribed by this watch, not found in the
   * database, or which are inaccessible to the current user. 
   * Raise exception if watch is closed.  This call renews the
   * lease.
   */
  addAll(ids: sys.List<haystack.Ref>): void;
  /**
   * Equality based on reference equality
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Identity hash
   */
  hash(): number;
}

/**
 * Base class for HTTP API operation processing
 */
export class HxApiOp extends sys.Obj {
  static type$: sys.Type
  /**
   * Op definition
   */
  def(): haystack.Def;
  /**
   * Process parsed request.  Default implentation attempts to
   * eval an Axon function of the same name.
   */
  onRequest(req: haystack.Grid, cx: HxContext): haystack.Grid;
  /**
   * Programmatic name of the op
   */
  name(): string;
  /**
   * Subclasses must declare public no-arg constructor
   */
  static make(...args: unknown[]): HxApiOp;
  /**
   * Process an HTTP service call to this op
   */
  onService(req: web.WebReq, res: web.WebRes, cx: HxContext): void;
}

/**
 * Lookups for the standard built-in services supported by all
 * runtimes. This mixin is implemented by both {@link HxServiceRegistry | HxServiceRegistry}
 * and {@link HxRuntime | HxRuntime}, but by convention client
 * code should access services the runtime.
 */
export abstract class HxStdServices extends sys.Obj {
  static type$: sys.Type
  /**
   * Observable APIs
   */
  obs(): HxObsService;
  /**
   * Watch subscription APIs
   */
  watch(): HxWatchService;
  /**
   * Context factory service
   */
  context(): HxContextService;
  /**
   * HTTP APIs
   */
  http(): HxHttpService;
  /**
   * User management APIs
   */
  user(): HxUserService;
}

/**
 * HTTP APIs
 */
export abstract class HxHttpService extends sys.Obj implements HxService {
  static type$: sys.Type
  /**
   * Public HTTP or HTTPS URI of this host.  This is always an
   * absolute URI such `https://acme.com/`
   */
  siteUri(): sys.Uri;
  /**
   * URI on this host to the Haystack HTTP API.  This is always a
   * host relative URI which end withs a slash such `/api/`.
   */
  apiUri(): sys.Uri;
}

/**
 * Context factory service
 */
export abstract class HxContextService extends sys.Obj implements HxService {
  static type$: sys.Type
  /**
   * Create new context for given user
   */
  create(user: HxUser): HxContext;
}

/**
 * User authentication session
 */
export abstract class HxSession extends sys.Obj {
  static type$: sys.Type
  /**
   * Attestation session key used as secondary verification of
   * cookie key
   */
  attestKey(): string;
  /**
   * Authenticated user associated with the sesssion
   */
  user(): HxUser;
  /**
   * Unique identifier for session
   */
  key(): string;
}

/**
 * Base class for all Haxall library runtime instances.  All
 * Haxall libs must be standard Haystack 4 libs.  This class is
 * used to model the instance of the library within a {@link HxRuntime | HxRuntime}
 * to provide runtime services.
 * 
 * To create a new library:
 * 1. Create a pod with a standard Haystack 4 "lib/lib.trio"
 *   definition
 * 2. Register the lib name using the indexed prop "ph.lib"
 * 3. Create subclass of HxLib
 * 4. Ensure your lib definition has `typeName` tag for subclass
 *   qname
 * 
 * Also see [docHaxall::Libs](https://fantom.org/doc/docHaxall/Libs).
 */
export class HxLib extends sys.Obj {
  static type$: sys.Type
  /**
   * Callback before we stop the runtime This is called on
   * dedicated background actor.
   */
  onUnready(): void;
  /**
   * Runtime
   */
  rt(): HxRuntime;
  /**
   * Observable subscriptions for this extension
   */
  subscriptions(): sys.List<obs.Subscription>;
  /**
   * Logger to use for this library
   */
  log(): sys.Log;
  /**
   * Subscribe this library to an observable. The callback must
   * be an Actor instance or Method literal on this class.  If
   * callback is a method, then its called on the lib's dedicated
   * background actor. pool. This method should be called in the {@link onStart | onStart}
   * callback. The observation is automatically unsubscribed on
   * stop.  You should **not** unsubscribe this subscription - it
   * must be managed by the extension itself.  See [docHaxall::Observables#fantomObserve](https://fantom.org/doc/docHaxall/Observables#fantomObserve).
   */
  observe(name: string, config: haystack.Dict, callback: sys.JsObj): obs.Subscription;
  /**
   * Database record which enables this library and stores
   * settings. This field may be overridden with a {@link haystack.TypedDict | haystack::TypedDict}
   * subclass. Also see [docHaxall::Libs#settings](https://fantom.org/doc/docHaxall/Libs#settings).
   */
  rec(): haystack.Dict;
  /**
   * Return list of observables this extension publishes.  This
   * method must be overridden as a const field and set in the
   * constructor.
   */
  observables(): sys.List<obs.Observable>;
  /**
   * Callback when library is started. This is called on
   * dedicated background actor.
   */
  onStart(): void;
  /**
   * Web service handling for this library
   */
  web(): HxLibWeb;
  /**
   * Running flag.  On startup this flag transitions to true
   * before calling ready and start on the library.  On shutdown
   * this flag transitions to false before calling unready and
   * stop on the library.
   */
  isRunning(): boolean;
  /**
   * Callback when runtime reaches steady state. This is called
   * on dedicated background actor.
   */
  onSteadyState(): void;
  /**
   * Framework use only. Subclasses must declare public no-arg
   * constructor.
   */
  static make(...args: unknown[]): HxLib;
  /**
   * Callback when library is stopped. This is called on
   * dedicated background actor.
   */
  onStop(): void;
  /**
   * Return {@link name | name}
   */
  toStr(): string;
  /**
   * Return list of services this library publishes.  This
   * callback is made during initialization and each time a lib
   * is added/removed from the runtime.
   */
  services(): sys.List<HxService>;
  /**
   * Callback made periodically to perform background tasks.
   * Override {@link houseKeepingFreq | houseKeepingFreq} to
   * enable the frequency of this callback.
   */
  onHouseKeeping(): void;
  /**
   * Callback when associated database {@link rec | rec} is
   * modified. This is called on dedicated background actor.
   */
  onRecUpdate(): void;
  /**
   * Equality is based on reference equality
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Override to return non-null for onHouseKeeping callback
   */
  houseKeepingFreq(): sys.Duration | null;
  /**
   * Programmatic name of the library
   */
  name(): string;
  /**
   * Identity hash
   */
  hash(): number;
  /**
   * Callback when all libs are fully started. This is called on
   * dedicated background actor.
   */
  onReady(): void;
}

/**
 * HxMsg provides simple immutable tuple to use for actor
 * messages.
 */
export class HxMsg extends sys.Obj {
  static type$: sys.Type
  /**
   * Argument a
   */
  a(): sys.JsObj | null;
  /**
   * Argument b
   */
  b(): sys.JsObj | null;
  /**
   * Argument c
   */
  c(): sys.JsObj | null;
  /**
   * Argument d
   */
  d(): sys.JsObj | null;
  /**
   * Argument e
   */
  e(): sys.JsObj | null;
  /**
   * Message identifier type
   */
  id(): string;
  /**
   * Return debug string representation
   */
  toStr(): string;
  /**
   * Constructor with three arguments
   */
  static make3(id: string, a: sys.JsObj | null, b: sys.JsObj | null, c: sys.JsObj | null, ...args: unknown[]): HxMsg;
  /**
   * Constructor with two arguments
   */
  static make2(id: string, a: sys.JsObj | null, b: sys.JsObj | null, ...args: unknown[]): HxMsg;
  /**
   * Constructor with five arguments
   */
  static make5(id: string, a: sys.JsObj | null, b: sys.JsObj | null, c: sys.JsObj | null, d: sys.JsObj | null, e: sys.JsObj | null, ...args: unknown[]): HxMsg;
  /**
   * Constructor with four arguments
   */
  static make4(id: string, a: sys.JsObj | null, b: sys.JsObj | null, c: sys.JsObj | null, d: sys.JsObj | null, ...args: unknown[]): HxMsg;
  /**
   * Constructor with one argument
   */
  static make1(id: string, a: sys.JsObj | null, ...args: unknown[]): HxMsg;
  /**
   * Constructor with zero arguments
   */
  static make0(id: string, ...args: unknown[]): HxMsg;
  /**
   * Equality is based on id and arguments
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Hash is based on id and arguments
   */
  hash(): number;
}

/**
 * Registry for service APIs by type.  Service APIs implement
 * the {@link HxService | HxService} mixin and are published by
 * libraries enabled in the runtime using {@link HxLib.services | HxLib.services}.
 */
export abstract class HxServiceRegistry extends sys.Obj implements HxStdServices {
  static type$: sys.Type
  /**
   * Lookup a service installed for the given type.  If multiple
   * services are installed for the given type, then its
   * indeterminate which is returned.  If the service is not
   * found then raise UnknownServiceErr or return null based on
   * the check flag.
   */
  get(type: sys.Type, checked?: boolean): HxService | null;
  /**
   * Lookup all services installed for the given type.  Return an
   * empty list if no services are registered for given type.
   */
  getAll(type: sys.Type): sys.List<HxService>;
  /**
   * List the registered service types
   */
  list(): sys.List<sys.Type>;
  /**
   * Observable APIs
   */
  obs(): HxObsService;
  /**
   * Watch subscription APIs
   */
  watch(): HxWatchService;
  /**
   * Context factory service
   */
  context(): HxContextService;
  /**
   * HTTP APIs
   */
  http(): HxHttpService;
  /**
   * User management APIs
   */
  user(): HxUserService;
}

/**
 * HxService is a marker interface used to indicate a service
 * API.
 */
export abstract class HxService extends sys.Obj {
  static type$: sys.Type
}

/**
 * HxLib plugin to add web servicing capability. See [docHaxall::Libs#web](https://fantom.org/doc/docHaxall/Libs#web).
 */
export class HxLibWeb extends web.WebMod {
  static type$: sys.Type
  /**
   * Runtime for parent library
   */
  rt(): HxRuntime;
  /**
   * Parent library.  Subclasses can override this method to be
   * covariant.
   */
  lib(): HxLib;
  /**
   * Base uri for this library's endpoint such as "/myLib/"
   */
  uri(): sys.Uri;
}

/**
 * Observable APIs
 */
export abstract class HxObsService extends sys.Obj implements HxService {
  static type$: sys.Type
  /**
   * List the published observables for the runtime
   */
  list(): sys.List<obs.Observable>;
  /**
   * Lookup a observable for the runtime by name.
   */
  get(name: string, checked?: boolean): obs.Observable | null;
}

/**
 * HxTest is a base class for writing Haxall tests which
 * provide access to a booted runtime instance.  Annotate test
 * methods which require a runtime with {@link HxRuntimeTest | HxRuntimeTest}.
 * This class uses the `hxd` implementation for its runtime.
 * ```
 * @HxRuntimeTest
 * Void testBasics()
 * {
 *   x := addRec(["dis":"It works!"])
 *   y := rt.db.readById(x.id)
 *   verifyEq(y.dis, "It works!")
 * }
 * ```
 */
export class HxTest extends haystack.HaystackTest {
  static type$: sys.Type
  /**
   * Convenience for commit to {@link rt | rt}
   */
  commit(rec: haystack.Dict, changes: sys.JsObj | null, flags?: number): haystack.Dict | null;
  /**
   * Add a library and all its depdenencies to the runtime.
   */
  addLib(libName: string, tags?: sys.Map<string, sys.JsObj | null>): HxLib;
  /**
   * Add a record to {@link rt | rt} using the given map of tags.
   */
  addRec(tags?: sys.Map<string, sys.JsObj | null>): haystack.Dict;
  /**
   * Convenience for `read` on {@link rt | rt}
   */
  read(filter: string, checked?: boolean): haystack.Dict | null;
  /**
   * Evaluate an Axon expression using a super user context.
   */
  eval($axon: string): sys.JsObj | null;
  /**
   * Test runtime if `@HxRuntimeTest` configured on test method
   */
  rt(checked?: boolean): HxRuntime | null;
  /**
   * Convenience for `readById` on {@link rt | rt}
   */
  readById(id: haystack.Ref, checked?: boolean): haystack.Dict | null;
  /**
   * If `@HxRuntimeTest` configured then close down {@link rt | rt}
   */
  teardown(): void;
  static make(...args: unknown[]): HxTest;
  /**
   * Create a new context with the given user.  If user is null,
   * then use a default test user with superuser permissions.
   */
  makeContext(user?: HxUser | null): HxContext;
  /**
   * If `@HxRuntimeTest` configured then open {@link rt | rt}
   */
  setup(): void;
}

/**
 * HxPlatform models the meta data of the platform running
 * Haxall.  Note this API provides readonly summary information
 * about the platform.  Actual integration to configure the
 * platform is handled in pluggable libraries such as `hxPlatform`,
 * `hxPlatformSerial`, etc.
 */
export class HxPlatform extends sys.Obj {
  static type$: sys.Type
  /**
   * Product home page for about op
   */
  productUri(): sys.Uri;
  /**
   * Vendor home page for about op
   */
  vendorUri(): sys.Uri;
  /**
   * Product name for about op
   */
  productName(): string;
  /**
   * Relative URI to favicon.png image
   */
  faviconUri(): sys.Uri;
  /**
   * Product version for about op
   */
  productVersion(): string;
  /**
   * Construct with meta data dict
   */
  static make(meta: haystack.Dict, ...args: unknown[]): HxPlatform;
  /**
   * Host model
   */
  hostModel(): string;
  /**
   * Is this the full SkySpark runtime
   */
  isSkySpark(): boolean;
  /**
   * Operating system name - see {@link sys.Env.os | sys::Env.os}
   */
  os(): string;
  /**
   * Host operating system platform and version
   */
  hostOs(): string;
  /**
   * Relative URI to the SVG logo
   */
  logoUri(): sys.Uri;
  /**
   * Vendor name for about op
   */
  vendorName(): string;
  /**
   * Meta data
   */
  meta(): haystack.Dict;
  /**
   * Microprocessor architecture - see {@link sys.Env.arch | sys::Env.arch}
   */
  arch(): string;
}

/**
 * Watch subscription APIs
 */
export abstract class HxWatchService extends sys.Obj implements HxService {
  static type$: sys.Type
  /**
   * Return if given record id is under at least one watch
   */
  isWatched(id: haystack.Ref): boolean;
  /**
   * List the watches currently open for this runtime. Also see [docHaxall::Watches#fantom](https://fantom.org/doc/docHaxall/Watches#fantom).
   */
  list(): sys.List<HxWatch>;
  /**
   * Return list of watches currently subscribed to the given id,
   * or return empty list if the given id is not in any watches.
   */
  listOn(id: haystack.Ref): sys.List<HxWatch>;
  /**
   * Find an open watch by its identifier.  If  not found then
   * throw Err or return null based on checked flag. Also see [docHaxall::Watches#fantom](https://fantom.org/doc/docHaxall/Watches#fantom).
   */
  get(id: string, checked?: boolean): HxWatch | null;
  /**
   * Open a new watch with given display string for debugging.
   * Also see [docHaxall::Watches#fantom](https://fantom.org/doc/docHaxall/Watches#fantom).
   */
  open(dis: string): HxWatch;
}

/**
 * Haxall runtime library management APIs
 */
export abstract class HxRuntimeLibs extends sys.Obj {
  static type$: sys.Type
  /**
   * Enable a library in the runtime
   */
  add(name: string, tags?: haystack.Dict): HxLib;
  /**
   * List of libs currently enabled sorted by name
   */
  list(): sys.List<HxLib>;
  /**
   * Disable a library from the runtime.  The lib arg may be a
   * HxLib instace, Lib definition, or Str name.
   */
  remove(lib: sys.JsObj): void;
  /**
   * Lookup an enabled lib by name.  If not found then return
   * null or raise UnknownLibErr based on checked flag.
   */
  get(name: string, checked?: boolean): HxLib | null;
  /**
   * Actor thread pool to use for libraries
   */
  actorPool(): concurrent.ActorPool;
  /**
   * Check if there is an enabled lib with given name
   */
  has(name: string): boolean;
}

/**
 * Haxall core "hx" axon functions supported by all runtimes
 */
export class HxCoreFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Return the range of all the values mapped to a given tag
   * name used by all the records matching the given filter. This
   * method is capped to 200 results.  The results are returned
   * as a grid with a single `val` column. Also see {@link readAllTagNames | readAllTagNames}.
   * 
   * Examples:
   * ```
   * // read grid of all unique point unit tags
   * readAllTagVals(point, "unit")
   * ```
   */
  static readAllTagVals(filterExpr: axon.Expr, tagName: axon.Expr): haystack.Grid;
  /**
   * Coerce a value to a record Dict:
   * - Row or Dict returns itself
   * - Grid returns first row
   * - List returns first row (can be either Ref or Dict)
   * - Ref will make a call to read database
   */
  static toRec(val: sys.JsObj | null): haystack.Dict;
  /**
   * Coerce a value to a list of record Dicts:
   * - null return empty list
   * - Ref or Ref[] (will make a call to read database)
   * - Row or Row[] returns itself
   * - Dict or Dict[] returns itself
   * - Grid is mapped to list of rows
   */
  static toRecList(val: sys.JsObj | null): sys.List<haystack.Dict>;
  /**
   * Commit one or more diffs to the folio database. The argument
   * may be one of the following:
   * - result of [diff()](diff())
   * - list of [diff()](diff()) to commit multiple diffs at once
   * - stream of [diff()](diff()); see [docHaxall::Streams#commit](https://fantom.org/doc/docHaxall/Streams#commit).
   * 
   * If one diff is passed, return the new record.  If a list of
   * diffs is passed return a list of new records.
   * 
   * This is a synchronous blocking call which will return the
   * new record or records as the result.
   * 
   * Examples:
   * ```
   * // add new record
   * newRec: commit(diff(null, {dis:"New Rec!"}, {add}))
   * 
   * // add someTag to some group of records
   * readAll(filter).toRecList.map(r => diff(r, {someTag})).commit
   * ```
   */
  static commit(diffs: sys.JsObj): sys.JsObj | null;
  /**
   * Return [about](op:about) dict
   */
  static about(): haystack.Dict;
  /**
   * Reall all records which match filter as stream of Dict
   * records. See [docHaxall::Streams#readAllStream](https://fantom.org/doc/docHaxall/Streams#readAllStream).
   */
  static readAllStream(filterExpr: axon.Expr): sys.JsObj;
  /**
   * Return the number of records which match the given filter
   * expression.
   * 
   * Examples:
   * ```
   * readCount(point)    // return number of recs with point tag
   * ```
   */
  static readCount(filterExpr: axon.Expr): haystack.Number;
  /**
   * Close an open watch by id.  If the watch does not exist or
   * has expired then this is a no op.  Also see {@link HxWatch.close | hx::HxWatch.close}
   * and [docHaxall::Watches#axon](https://fantom.org/doc/docHaxall/Watches#axon).
   */
  static watchClose(watchId: string): sys.JsObj | null;
  /**
   * Strip any tags which cannot be persistently committed to
   * Folio. This includes special tags such as `hisSize` and any
   * transient tags the record has defined.  If `val` is Dict, then
   * a single Dict is returned. Otherwise `val` must be Dict[] or
   * Grid and Dict[] is returned. The `mod` tag is stripped unless
   * the `{mod}` option is specified. The `id` tag is not stripped
   * for cases when adding records with swizzled ids; pass `{-id}`
   * in options to strip the `id` tag also.
   * 
   * Examples:
   * ```
   * // strip uncommittable tags and keep id
   * toCommit: rec.stripUncommittable
   * 
   * // strip uncommittable tags and the id tag
   * toCommit: rec.stripUncommittable({-id})
   * 
   * // strip uncommittable tags, but keep id and mod
   * toCommit: rec.stripUncommittable({mod})
   * ```
   */
  static stripUncommittable(val: sys.JsObj, opts?: sys.JsObj | null): sys.JsObj;
  /**
   * Get the current context as a Dict with the following tags:
   * - `username` for current user
   * - `userRef` id for current user
   * - `locale` current locale
   * 
   * SkySpark tags:
   * - `projName` if evaluating in context of a project
   * - `nodeId` local cluster node id
   * - `ruleRef` if evaluating in context of a rule engine
   * - `ruleTuning` if evaluating in context of rule engine
   */
  static context(): haystack.Dict;
  /**
   * Reload all the Xeto libraries
   */
  static xetoReload(): sys.JsObj | null;
  /**
   * Enable a library by name in the runtime:
   * ```
   * libAdd("mqtt")
   * ```
   */
  static libAdd(name: string, tags?: haystack.Dict | null): haystack.Dict;
  /**
   * Return the intersection of all tag names used by all the
   * records matching the given filter.  The results are returned
   * as a grid with following columns:
   * - `name`: string name of the tag
   * - `kind`: all the different value kinds separated by "|"
   * - `count`: total number of recs with the tag Also see {@link readAllTagVals | readAllTagVals}
   *   and [gridColKinds](gridColKinds).
   * 
   * Examples:
   * ```
   * // read statistics on all tags used by equip recs
   * readAllTagNames(equip)
   * ```
   */
  static readAllTagNames(filterExpr: axon.Expr): haystack.Grid;
  /**
   * Read from database the first record which matches [filter](https://fantom.org/doc/docHaystack/Filters).
   * If no matches found throw UnknownRecErr or null based on
   * checked flag.  If there are multiple matches it is
   * indeterminate which one is returned.  See {@link readAll | readAll}
   * for how filter works.
   * 
   * Examples:
   * ```
   * read(site)                 // read any site rec
   * read(site and dis=="HQ")   // read site rec with specific dis tag
   * read(chiller)              // raise exception if no recs with chiller tag
   * read(chiller, false)       // return null if no recs with chiller tag
   * ```
   */
  static read(filterExpr: axon.Expr, checked?: axon.Expr): haystack.Dict | null;
  /**
   * Construct a modification "diff" used by {@link commit | commit}.
   * The orig should be the instance which was read from the
   * database, or it may be null only if the add flag is passed. 
   * Any tags to add/set/remove should be included in the changes
   * dict.
   * 
   * The following flags are supported:
   * - `add`: indicates diff is adding new record
   * - `remove`: indicates diff is removing record (in general you
   *   should add [trash](trash) tag instead of removing)
   * - `transient`: indicate that this diff should not be flushed to
   *   persistent storage (it may or may not be persisted).
   * - `force`: indicating that changes should be applied regardless
   *   of other concurrent changes which may be been applied after
   *   the orig version was read (use with caution!)
   * 
   * Examples:
   * ```
   * // create new record
   * diff(null, {dis:"New Rec", someMarker}, {add})
   * 
   * // create new record with explicit id like Diff.makeAdd
   * diff(null, {id:151bd3c5-6ce3cb21, dis:"New Rec"}, {add})
   * 
   * // set/add dis tag and remove oldTag
   * diff(orig, {dis:"New Dis", -oldTag})
   * 
   * // set/add val tag transiently
   * diff(orig, {val:123}, {transient})
   * ```
   */
  static diff(orig: haystack.Dict | null, changes: haystack.Dict | null, flags?: haystack.Dict | null): folio.Diff;
  /**
   * Return if given record is under at least one watch. The rec
   * argument can be any value accepted by [toRecId()](toRecId()).
   */
  static isWatched(rec: sys.JsObj): boolean;
  /**
   * Add a grid of recs to an existing watch and return the grid
   * passed in.
   */
  static watchAdd(watchId: string, grid: haystack.Grid): haystack.Grid;
  /**
   * Return the installed timezone database as Grid with
   * following columns:
   * - name: name of the timezone
   * - fullName: qualified name used by Olson database
   */
  static tzdb(): haystack.Grid;
  /**
   * Given record id, read only the persistent tags from Folio.
   * Also see {@link readByIdTransientTags | readByIdTransientTags}
   * and {@link readById | readById}.
   */
  static readByIdPersistentTags(id: haystack.Ref, checked?: boolean): haystack.Dict | null;
  /**
   * Coerce a value to a list of Ref identifiers:
   * - Ref returns itself as list of one
   * - Ref[] returns itself
   * - Dict return `id` tag
   * - Dict[] return `id` tags
   * - Grid return `id` column
   */
  static toRecIdList(val: sys.JsObj | null): sys.List<haystack.Ref>;
  /**
   * Remove a grid of recs from an existing watch and return grid
   * passed in.
   */
  static watchRemove(watchId: string, grid: haystack.Grid): haystack.Grid;
  /**
   * Read a list of ids as a stream of Dict records. If checked
   * if false, then records not found are skipped. See [docHaxall::Streams#readByIdsStream](https://fantom.org/doc/docHaxall/Streams#readByIdsStream).
   */
  static readByIdsStream(ids: sys.List<haystack.Ref>, checked?: boolean): sys.JsObj;
  /**
   * Read a record from database by `id`.  If not found throw
   * UnknownRecErr or return null based on checked flag. In
   * Haxall all refs are relative, but in SkySpark refs may be
   * prefixed with something like "p:projName:r:".  This function
   * will accept both relative and absolute refs.
   * 
   * Examples:
   * ```
   * readById(@2b00f9dc-82690ed6)          // relative ref literal
   * readById(@:demo:r:2b00f9dc-82690ed6)  // project absolute literal
   * readById(id)                          // read using variable
   * readById(equip->siteRef)              // read from ref tag
   * ```
   */
  static readById(id: haystack.Ref | null, checked?: boolean): haystack.Dict | null;
  /**
   * Reall all records from the database which match the [filter](https://fantom.org/doc/docHaystack/Filters).
   * The filter must an expression which matches the filter
   * structure. String values may parsed into a filter using [parseFilter](parseFilter)
   * function.
   * 
   * Options:
   * - `limit`: max number of recs to return
   * - `sort`: sort by display name
   * 
   * Examples:
   * ```
   * readAll(site)                      // read all site recs
   * readAll(equip and siteRef==@xyz)   // read all equip in a given site
   * readAll(equip, {limit:10})         // read up to ten equips
   * readAll(equip, {sort})             // read all equip sorted by dis
   * ```
   */
  static readAll(filterExpr: axon.Expr, optsExpr?: axon.Expr | null): haystack.Grid;
  /**
   * Return grid of enabled libs and their current status. 
   * Columns:
   * - name: library name string
   * - libStatus: status enumeration string
   * - statusMsg: additional message string or null
   */
  static libStatus(): haystack.Grid;
  static make(...args: unknown[]): HxCoreFuncs;
  /**
   * Read a list of record ids into a grid.  The rows in the
   * result correspond by index to the ids list.  If checked is
   * true, then every id must be found in the database or
   * UnknownRecErr is thrown.  If checked is false, then an
   * unknown record is returned as a row with every column set to
   * null (including the `id` tag).  Either relative or project
   * absolute refs may be used.
   * 
   * Examples:
   * ```
   * // read two relative refs
   * readByIds([@2af6f9ce-6ddc5075, @2af6f9ce-2d56b43a])
   * 
   * // read two project absolute refs
   * readByIds([@p:demo:r:2af6f9ce-6ddc5075, @p:demo:r:2af6f9ce-2d56b43a])
   * 
   * // return null for a given id if it does not exist
   * readByIds([@2af6f9ce-6ddc5075, @2af6f9ce-2d56b43a], false)
   * ```
   */
  static readByIds(ids: sys.List<haystack.Ref>, checked?: boolean): haystack.Grid;
  /**
   * Return the installed unit database as Grid with following
   * columns:
   * - quantity: dimension of the unit
   * - name: full name of the unit
   * - symbol: the abbreviated Unicode name of the unit
   */
  static unitdb(): haystack.Grid;
  /**
   * Disable a library by name in the runtime:
   * ```
   * libRemove("mqtt")
   * ```
   */
  static libRemove(name: sys.JsObj): sys.JsObj | null;
  /**
   * Given record id, read only the transient tags from Folio.
   * Also see {@link readByIdPersistentTags | readByIdPersistentTags}
   * and {@link readById | readById}.
   */
  static readByIdTransientTags(id: haystack.Ref, checked?: boolean): haystack.Dict | null;
  /**
   * Grid of installed services.  Format of the grid is subject
   * to change.
   */
  static services(): haystack.Grid;
  /**
   * Store a password key/val pair into current project's
   * password store.  The key is typically a Ref of the
   * associated record. If the `val` is null, then the password
   * will be removed. See [docHaxall::Folio#passwords](https://fantom.org/doc/docHaxall/Folio#passwords).
   * ```
   * passwordSet(@abc-123, "password")
   * passwordSet(@abc-123, null)
   * 
   * ```
   */
  static passwordSet(key: sys.JsObj, val: string | null): void;
  /**
   * Poll an open watch and return all the records which have
   * changed since the last poll.  Raise exception if watchId
   * doesn't exist or has expired.  Also see {@link HxWatch.poll | hx::HxWatch.poll}
   * and [docHaxall::Watches#axon](https://fantom.org/doc/docHaxall/Watches#axon).
   */
  static watchPoll(watchId: sys.JsObj): haystack.Grid;
  /**
   * Return {@link HxRuntime.isSteadyState | hx::HxRuntime.isSteadyState}
   */
  static isSteadyState(): boolean;
  /**
   * Read a record Dict by its id for hyperlinking in a UI. 
   * Unlike other reads which return a Dict, this read returns
   * the columns ordered in the same order as reads which return
   * a Grid.
   */
  static readLink(id: haystack.Ref | null): haystack.Dict | null;
  /**
   * Open a new watch on a grid of records.  The `dis` parameter is
   * used for the watch's debug display string.  Update and
   * return the grid with a meta `watchId` tag.  Also see {@link HxWatchService.open | hx::HxWatchService.open}
   * and [docHaxall::Watches#axon](https://fantom.org/doc/docHaxall/Watches#axon).
   * 
   * Example:
   * ```
   * readAll(myPoints).watchOpen("MyApp|Points")
   * ```
   */
  static watchOpen(grid: haystack.Grid, dis: string): haystack.Grid;
  /**
   * Return list of installed Fantom pods
   */
  static pods(): haystack.Grid;
  /**
   * Coerce a value to a Ref identifier:
   * - Ref returns itself
   * - Row or Dict, return `id` tag
   * - Grid return first row id
   */
  static toRecId(val: sys.JsObj | null): haystack.Ref;
}

/**
 * Haxall user account
 */
export abstract class HxUser extends sys.Obj {
  static type$: sys.Type
  /**
   * Does this user have admin permissions
   */
  isAdmin(): boolean;
  /**
   * Display string for user
   */
  dis(): string;
  /**
   * User meta data as Haystack dict
   */
  meta(): haystack.Dict;
  /**
   * Ref identifier
   */
  id(): haystack.Ref;
  /**
   * Does this user have superuser permissions
   */
  isSu(): boolean;
  /**
   * Email address if configured
   */
  email(): string | null;
  /**
   * Username identifier
   */
  username(): string;
}

/**
 * Annotates a {@link HxTest | HxTest} method to setup a test
 * runtime instance
 */
export class HxRuntimeTest extends sys.Obj implements sys.Facet {
  static type$: sys.Type
  /**
   * Database meta data encoded as a Trio string
   */
  meta(): sys.JsObj | null;
  __meta(it: sys.JsObj | null): void;
  static make(f?: ((arg0: HxRuntimeTest) => void) | null, ...args: unknown[]): HxRuntimeTest;
}

/**
 * User management APIs
 */
export abstract class HxUserService extends sys.Obj implements HxService {
  static type$: sys.Type
  /**
   * Lookup a user by username.  If not found then raise
   * exception or return null based on the checked flag.
   */
  read(username: sys.JsObj, checked?: boolean): HxUser | null;
  /**
   * Authenticate a web request and return a context.  If request
   * is not authenticated then redirect to login page and return
   * null. Session information is available via {@link HxContext.session | hx::HxContext.session}.
   */
  authenticate(req: web.WebReq, res: web.WebRes): HxContext | null;
}

/**
 * Haxall execution and security context.
 */
export class HxContext extends axon.AxonContext implements folio.FolioContext {
  static type$: sys.Type
  /**
   * If missing superuser permission, throw PermissionErr
   */
  checkSu(action: string): void;
  /**
   * Runtime associated with this context
   */
  rt(): HxRuntime;
  /**
   * Authentication session associated with this context if
   * applicable
   */
  session(checked?: boolean): HxSession | null;
  /**
   * If missing admin permission, throw PermissionErr
   */
  checkAdmin(action: string): void;
  static make(...args: unknown[]): HxContext;
  /**
   * User account associated with this context
   */
  user(): HxUser;
  /**
   * Folio database for the runtime
   */
  db(): folio.Folio;
  /**
   * Return if context has read access to given record
   */
  canRead(rec: haystack.Dict): boolean;
  /**
   * Return an immutable thread safe object which will be passed
   * thru the commit process and available via the FolioHooks
   * callbacks. This is typically the User instance.
   */
  commitInfo(): sys.JsObj | null;
  /**
   * Return if context has write (update/delete) access to given
   * record
   */
  canWrite(rec: haystack.Dict): boolean;
}

/**
 * Haxall utility methods
 */
export class HxUtil extends sys.Obj {
  static type$: sys.Type
  /**
   * Parse enum as ordered map of Str:Dict keyed by name.  Dict
   * tags:
   * - name: str key
   * - doc: fandoc string if available
   * 
   * Supported inputs:
   * - null returns empty list
   * - Dict of Dicts
   * - Str[] names
   * - Str newline separated names
   * - Str comma separated names
   * - Str fandoc list as - name: fandoc lines
   */
  static parseEnum(enum$: sys.JsObj | null): sys.Map<string, haystack.Dict>;
  /**
   * Dump all threads
   */
  static threadDumpAll(): string;
  /**
   * List units as grid
   */
  static unitdb(): haystack.Grid;
  /**
   * Dump a specific thread by its id
   */
  static threadDump(id: number): string;
  /**
   * Process id or null if cannot be determined
   */
  static pid(): number | null;
  /**
   * Convenience for parseEnum which returns only a list of
   * string names.  Using this method is more efficient than
   * calling parseEnums and then mapping the keys.
   */
  static parseEnumNames(enum$: sys.JsObj | null): sys.List<string>;
  /**
   * Current thread id
   */
  static threadId(): number;
  /**
   * List timezones as grid
   */
  static tzdb(): haystack.Grid;
  /**
   * List pods as grid
   */
  static pods(): haystack.Grid;
  /**
   * Dump thread deadlocks if detected
   */
  static threadDumpDeadlocks(): string;
  static make(...args: unknown[]): HxUtil;
}

/**
 * Haxall command line interface.  To create a new hx command:
 * 1. Define subclass of HxCli
 * 2. Register type qname via indexed prop as "hx.cli"
 * 3. Annotate options and args using {@link util.AbstractMain | util::AbstractMain}
 *   design
 */
export class HxCli extends util.AbstractMain {
  static type$: sys.Type
  /**
   * Command name alises/shortcuts
   */
  aliases(): sys.List<string>;
  /**
   * Log name is "hx"
   */
  log(): sys.Log;
  /**
   * Run the command.  Return zero on success
   */
  run(): number;
  /**
   * Find a specific command or return null
   */
  static find(name: string): HxCli | null;
  static make(...args: unknown[]): HxCli;
  /**
   * Single line summary of the command for help
   */
  summary(): string;
  /**
   * Print a line to stdout
   */
  printLine(line?: string): void;
  /**
   * App name is "hx {name}"
   */
  appName(): string;
  /**
   * List installed commands
   */
  static list(): sys.List<HxCli>;
  /**
   * Command name
   */
  name(): string;
}

/**
 * HxRuntime is the top level coordinator of a Haxall server.
 */
export abstract class HxRuntime extends sys.Obj implements HxStdServices {
  static type$: sys.Type
  /**
   * Lookup a library by name.  Convenience for `libs.get`.
   */
  lib(name: string, checked?: boolean): HxLib | null;
  /**
   * Namespace of definitions
   */
  ns(): haystack.Namespace;
  /**
   * Runtime project directory.  It the root directory of all
   * project oriented operational files.  The folio database is
   * stored under this directory in a sub-directory named `db/`.
   */
  dir(): sys.File;
  /**
   * Platform hosting the runtime
   */
  platform(): HxPlatform;
  /**
   * Display name of the runtime.
   */
  dis(): string;
  /**
   * Running flag.  On startup this flag transitions to true
   * before calling ready and start on all the libraries.  On
   * shutdown this flag transitions to false before calling
   * unready and stop on all the libraries.
   */
  isRunning(): boolean;
  /**
   * Service registry
   */
  services(): HxServiceRegistry;
  /**
   * Runtime version
   */
  version(): sys.Version;
  /**
   * Block until currently queued background processing completes
   */
  sync(timeout?: sys.Duration | null): this;
  /**
   * Has the runtime has reached steady state.  Steady state is
   * reached after a configurable wait period elapses after the
   * runtime is fully loaded.  This gives internal services time
   * to spin up before interacting with external systems.  See [docHaxall::Runtime#steadyState](https://fantom.org/doc/docHaxall/Runtime#steadyState).
   */
  isSteadyState(): boolean;
  /**
   * Runtime level meta data stored in the [projMeta](projMeta)
   * database record
   */
  meta(): haystack.Dict;
  /**
   * Programatic name of the runtime. This string is always a
   * valid tag name.
   */
  name(): string;
  /**
   * Library managment APIs
   */
  libs(): HxRuntimeLibs;
  /**
   * Folio database for this runtime
   */
  db(): folio.Folio;
  /**
   * Observable APIs
   */
  obs(): HxObsService;
  /**
   * Watch subscription APIs
   */
  watch(): HxWatchService;
  /**
   * Context factory service
   */
  context(): HxContextService;
  /**
   * HTTP APIs
   */
  http(): HxHttpService;
  /**
   * User management APIs
   */
  user(): HxUserService;
}

