import * as sys from './sys.js';
import * as inet from './inet.js';
import * as web from './web.js';
import * as concurrent from './concurrent.js';
import * as xml from './xml.js';

/**
 * XmlTest - test XML encoding/decoding
 */
export class XmlTest extends ObixTest {
  static type$: sys.Type
  testBool(): void;
  testStr(): void;
  testIcon(): void;
  testUnit(): void;
  testRange(): void;
  testOp(): void;
  testValErrs(): void;
  testUnknownElems(): void;
  testEnum(): void;
  verifyParse(s: string, expected: ObixObj): void;
  testMinMax(): void;
  testInt(): void;
  testUri(): void;
  testFeed(): void;
  testWritable(): void;
  testReltime(): void;
  testAbstime(): void;
  testStatus(): void;
  testTime(): void;
  verifyParseErr(s: string): void;
  static make(...args: unknown[]): XmlTest;
  testObjTree(): void;
  testPrecision(): void;
  testIs(): void;
  testDisplay(): void;
  testList(): void;
  testReal(): void;
  testDate(): void;
}

/**
 * Status enumeration indicates data quality.
 */
export class Status extends sys.Enum {
  static type$: sys.Type
  /**
   * List of Status values indexed by ordinal
   */
  static vals(): sys.List<Status>;
  /**
   * Data is ok, but local override is in effect.
   */
  static overridden(): Status;
  /**
   * Communications failure.
   */
  static down(): Status;
  /**
   * Object is currently in an alarm state.
   */
  static alarm(): Status;
  /**
   * Object has been disabled from normal operation.
   */
  static disabled(): Status;
  /**
   * Normal status condition.
   */
  static ok(): Status;
  /**
   * Past alarm condition remains unacknowledged.
   */
  static unacked(): Status;
  /**
   * Object data is not available or trustworth due to failure
   * condition.
   */
  static fault(): Status;
  /**
   * Object is currently in an the alarm state which has not been
   * acknowledged.
   */
  static unackedAlarm(): Status;
  /**
   * Return the Status instance for the specified name.  If not a
   * valid name and checked is false return null, otherwise throw
   * ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): Status;
}

/**
 * ObjTest - child/parent test tree structure
 */
export class ObjTest extends ObixTest {
  static type$: sys.Type
  verifyVal(elemName: string, val: sys.JsObj | null): void;
  testChildren(): void;
  testTimeZone(): void;
  testVal(): void;
  static make(...args: unknown[]): ObjTest;
  testHref(): void;
  testElemNames(): void;
}

/**
 * ObixClient implements the client side of the oBIX HTTP REST
 * protocol.
 */
export class ObixClient extends sys.Obj {
  static type$: sys.Type
  /**
   * Batch operation relative URI - either set manually or via {@link readLobby | readLobby}.
   */
  batchUri(): sys.Uri | null;
  batchUri(it: sys.Uri | null): void;
  /**
   * About object relative URI - either set manually or via {@link readLobby | readLobby}.
   */
  aboutUri(): sys.Uri | null;
  aboutUri(it: sys.Uri | null): void;
  /**
   * Uri of the lobby object
   */
  lobbyUri(): sys.Uri;
  /**
   * Watch service relative URI - either set manually or via {@link readLobby | readLobby}
   */
  watchServiceUri(): sys.Uri | null;
  watchServiceUri(it: sys.Uri | null): void;
  /**
   * Invoke the operation identified by the specified href. If
   * the result is* an `<err>` object, then throw an ObixErr with
   * the object.
   */
  invoke(uri: sys.Uri, in$: ObixObj): ObixObj;
  static main(args: sys.List<string>): void;
  /**
   * Perform a batch read for all the given URIs.  The {@link batchUri | batchUri}
   * must be either set manually or via {@link readLobby | readLobby}.
   */
  batchRead(uris: sys.List<sys.Uri>): sys.List<ObixObj>;
  /**
   * Construct with given headers to use for authentication
   */
  static make(lobby: sys.Uri, authHeaders: sys.Map<string, string>, ...args: unknown[]): ObixClient;
  /**
   * Write an obix document to the specified href and return the
   * server's result.  If the result is an `<err>` object, then
   * throw an ObixErr with the object.
   */
  write(obj: ObixObj): ObixObj;
  /**
   * Read an obix document with the specified href. If the result
   * is an `<err>` object, then throw an ObixErr with the object.
   */
  read(uri: sys.Uri): ObixObj;
  /**
   * Construct to use Basic Authentication
   */
  static makeBasicAuth(lobby: sys.Uri, username: string, password: string, ...args: unknown[]): ObixClient;
  /**
   * Read about object.  The {@link aboutUri | aboutUri} must be
   * either set manually or via {@link readLobby | readLobby}.
   */
  readAbout(): ObixObj;
  /**
   * Read the lobby object.  This method will set the {@link aboutUri | aboutUri}
   * and {@link batchUri | batchUri} fields.
   */
  readLobby(): ObixObj;
  /**
   * Create a new watch from via {@link watchServiceUri | watchServiceUri}
   * and return the object which represents the watch.  Raise err
   * if watch service isn't available.
   */
  watchOpen(): ObixClientWatch;
}

/**
 * ObixMod hooks for implementing server side watches.  ObixMod
 * manages the networking/protocol side of things, but
 * subclasses are responsible for managing the actual URI
 * subscription list and polling.
 */
export class ObixModWatch extends sys.Obj {
  static type$: sys.Type
  /**
   * Get/set lease time
   */
  lease(): sys.Duration;
  lease(it: sys.Duration): void;
  /**
   * Add the given uris to watch and return current state.  If
   * there is an error for an individual uri, return an error
   * object. Resulting objects must have hrefs which exactly
   * match input uri.
   */
  add(uris: sys.List<sys.Uri>): sys.List<ObixObj>;
  /**
   * Debug string
   */
  toStr(): string;
  /**
   * Poll URIs which have changed since last poll. Resulting
   * objects must have hrefs which exactly match input uri.
   */
  pollChanges(): sys.List<ObixObj>;
  /**
   * Handle delete/cleanup of watch.
   */
  delete(): void;
  /**
   * Remove the given uris from the watch.  Silently ignore bad
   * uris.
   */
  remove(uris: sys.List<sys.Uri>): void;
  /**
   * Map  server side representation to its on-the-wire Obix
   * representation.
   */
  toObixObj(): ObixObj;
  /**
   * Poll all URIs in this watch. Resulting objects must have
   * hrefs which exactly match input uri.
   */
  pollRefresh(): sys.List<ObixObj>;
  /**
   * Get unique idenifier for the watch. This string must be safe
   * to use within a URI path (should not contain special chars
   * or slashes)
   */
  id(): string;
  static make(...args: unknown[]): ObixModWatch;
}

/**
 * ObixMod is an abstract base class that implements the
 * standard plumbing for adding oBIX server side support.
 * Standardized URIs handled by the base class:
 * ```
 * {modBase}/xsl           debug style sheet
 * {modBase}/about         about object
 * {modBase}/batch         batch operation
 * {modBase}/watchService  watch service
 * {modBase}/watch/{id}    watch
 * ```
 * 
 * All other URIs to the mod are automatically handled by the
 * following callbacks:
 * - GET: {@link onRead | onRead}
 * - PUT: {@link onWrite | onWrite}
 * - POST: {@link onInvoke | onInvoke}
 */
export class ObixMod extends web.WebMod {
  static type$: sys.Type
  /**
   * Get represenation of the About object.  Subclasses should
   * override this to customize their about.  See {@link make | make}
   * to customize vendor and product fields.
   */
  about(): ObixObj;
  /**
   * Return the ObixObj representation of the given URI for the
   * application.  The URI is relative to the ObixMod base - see {@link web.WebReq.modRel | web::WebReq.modRel}.
   * Throw UnresolvedErr if URI doesn't map to a valid object. 
   * The resulting object must have its href set to the proper
   * absolute URI according to 5.2 of the oBIX specification.
   */
  onRead(uri: sys.Uri): ObixObj;
  /**
   * Get represenation of the WatchService object.  Subclasses
   * can override this to customize their watch service.
   */
  watchService(): ObixObj;
  onService(): void;
  /**
   * Write the value for the given URI and return the new
   * representation.  The URI is relative to the ObixMod base -
   * see {@link web.WebReq.modRel | web::WebReq.modRel}.  Throw
   * UnresolvedErr if URI doesn't map to a valid object.  Throw
   * ReadonlyErr if URI doesn't map to a writable object.
   */
  onWrite(uri: sys.Uri, val: ObixObj): ObixObj;
  /**
   * Invoke the operation for the given URI and return the
   * result. The URI is relative to the ObixMod base - see {@link web.WebReq.modRel | web::WebReq.modRel}
   * Throw UnresolvedErr if URI doesn't map to a valid operation.
   */
  onInvoke(uri: sys.Uri, arg: ObixObj): ObixObj;
  /**
   * Construct with the given map for `obix:About` parameters:
   * - serverName: defaults to `Env.cur.host`
   * - vendorName: defaults to "Fantom"
   * - vendorUrl: defaults to "https://fantom.org/"
   * - productName: defaults to "Fantom"
   * - productVersion: defaults to version of obix pod
   * - productUrl: defaults to "https://fantom.org/"
   */
  static make(about?: sys.Map<string, sys.JsObj>, ...args: unknown[]): ObixMod;
  /**
   * Get represenation of the Lobby object.  Subclasses can
   * override this to customize their lobby.
   */
  lobby(): ObixObj;
  /**
   * Find an existing watch by its identifier or return null.
   */
  watch(id: string): ObixModWatch | null;
  /**
   * Construct a new watch.
   */
  watchOpen(): ObixModWatch;
}

/**
 * Represents a clients side watch for an {@link ObixClient | ObixClient}
 */
export class ObixClientWatch extends sys.Obj {
  static type$: sys.Type
  /**
   * Associated client
   */
  client(): ObixClient;
  client(it: ObixClient): void;
  /**
   * Get or set the watch lease time on the server
   */
  lease(): sys.Duration;
  lease(it: sys.Duration): void;
  /**
   * Poll for changes to get state of only objects which have
   * changed.
   */
  pollChanges(): sys.List<ObixObj>;
  /**
   * Remove URIs from the watch.
   */
  remove(uris: sys.List<sys.Uri>): void;
  /**
   * Close the watch down on the server side.
   */
  close(): void;
  /**
   * Add URIs to the watch.
   */
  add(uris: sys.List<sys.Uri>): sys.List<ObixObj>;
  /**
   * Poll refresh to get current state of every URI in watch
   */
  pollRefresh(): sys.List<ObixObj>;
}

/**
 * Contract encapsulates a list of URIs to prototype objects.
 */
export class Contract extends sys.Obj {
  static type$: sys.Type
  /**
   * The empty contract with no URIs.
   */
  static empty(): Contract;
  /**
   * List of uris.
   */
  uris(): sys.List<sys.Uri>;
  /**
   * Return if the contract list contains the given URI
   */
  has(contract: sys.Uri): boolean;
  /**
   * Construct with a list of URIs.
   */
  static make(uris: sys.List<sys.Uri>, ...args: unknown[]): Contract;
  /**
   * Return list of encoded uris separated by a space.
   */
  toStr(): string;
  /**
   * Convenience for `uris.isEmpty`.
   */
  isEmpty(): boolean;
  /**
   * Parse a list of encoded URIs separated by space.  If format
   * error then throw ParseErr or return null based on checked
   * flag.
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Contract;
  /**
   * Two contracts are equal if they have the same list of URIs.
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Hash code is list of URIs.
   */
  hash(): number;
}

/**
 * ObixObj models an `obix:obj` element.
 */
export class ObixObj extends sys.Obj {
  static type$: sys.Type
  /**
   * Parent object or null if unparented.
   */
  parent(): ObixObj | null;
  parent(it: ObixObj | null): void;
  /**
   * TimeZone facet assocaited with abstime, date, and time
   * objects. This field is automatically updated when {@link val | val}
   * is assigned a DateTime unless its timezone is UTC or starts
   * with "Etc/".  After decoding this field is set only if an
   * explicit "tz" attribute was specified.
   */
  tz(): sys.TimeZone | null;
  tz(it: sys.TimeZone | null): void;
  /**
   * Number of decimal places to use for a real value.
   */
  precision(): number | null;
  precision(it: number | null): void;
  /**
   * URI of this object. The root object of a document must have
   * an absolute URI, other objects may have a URI relative to
   * the document root.  See {@link normalizedHref | normalizedHref}
   * to get this href normalized against the root object.
   */
  href(): sys.Uri | null;
  href(it: sys.Uri | null): void;
  /**
   * Object value for value object types:
   * - obix:bool    => sys::Bool
   * - obix:int     => sys::Int
   * - obix:real    => sys::Float
   * - obix:str     => sys::Str
   * - obix:enum    => sys::Str
   * - obix:uri     => sys::Uri
   * - obix:abstime => sys::DateTime
   * - obix:reltime => sys::Duration
   * - obix:date    => sys::Date
   * - obix:time    => sys::Time
   * 
   * If the value is not one of the types listed above, then
   * ArgErr is thrown.  If the value is set to non-null, then the
   * {@link elemName | elemName} is automatically updated.
   */
  val(): sys.JsObj | null;
  val(it: sys.JsObj | null): void;
  /**
   * The `in` contract for operations and feeds.
   */
  in(): Contract | null;
  in(it: Contract | null): void;
  /**
   * The list of contract URIs this object implemented as
   * specified by `is` attribute.
   */
  contract(): Contract;
  contract(it: Contract): void;
  /**
   * Unit of measurement for int and real values.  We only
   * support units which are predefind in the oBIX unit database
   * and specified using the URI "obix:units/".  These units are
   * mapped to the {@link sys.Unit | sys::Unit} API. If an unknown
   * unit URI is decoded, then it is silently ignored and this
   * field will be null.
   */
  unit(): sys.Unit | null;
  unit(it: sys.Unit | null): void;
  /**
   * Programatic name of the object which defines role of this
   * object in its parent.  Throw UnsupportedErr if an attempt is
   * made to set the name once mounted under a parent.
   */
  name(): string | null;
  name(it: string | null): void;
  /**
   * Status facet indicates quality and state.
   */
  status(): Status;
  status(it: Status): void;
  /**
   * Localized human readable version of the name attribute.
   */
  displayName(): string | null;
  displayName(it: string | null): void;
  /**
   * Reference to the graphical icon.
   */
  icon(): sys.Uri | null;
  icon(it: sys.Uri | null): void;
  /**
   * Reference to the range definition of an enum or bool value.
   */
  range(): sys.Uri | null;
  range(it: sys.Uri | null): void;
  /**
   * The XML element name to use for this object.  If not one of
   * the valid oBIX element names then throw ArgErr. Valid
   * element names are:
   * ```
   * obj, bool, int, real, str, enum, uri, abstime,
   * reltime, date, time, list, op, feed, ref, err
   * ```
   */
  elemName(): string;
  elemName(it: string): void;
  /**
   * The `out` contract for operations.
   */
  out(): Contract | null;
  out(it: Contract | null): void;
  /**
   * Specifies is this object can be written, or false if
   * readonly.
   */
  writable(): boolean;
  writable(it: boolean): void;
  /**
   * Inclusive minium for value.
   */
  min(): sys.JsObj | null;
  min(it: sys.JsObj | null): void;
  /**
   * The `of` contract for lists and feeds.
   */
  of(): Contract | null;
  of(it: Contract | null): void;
  /**
   * Inclusive maximum for value.
   */
  max(): sys.JsObj | null;
  max(it: sys.JsObj | null): void;
  /**
   * Localized human readable string summary of the object.
   */
  display(): string | null;
  display(it: string | null): void;
  /**
   * The null flag indicates the absense of a value.
   */
  isNull(): boolean;
  isNull(it: boolean): void;
  /**
   * Get this objects {@link href | href} normalized against the
   * root object's URI.  Return null no href defined.
   */
  normalizedHref(): sys.Uri | null;
  /**
   * Return if there is child object by the specified name.
   */
  has(name: string): boolean;
  /**
   * If the name maps to a child object, then return that child's
   * value.  Otherwise route to `Obj.trap`.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Return string representation.
   */
  toStr(): string;
  /**
   * Add a child object.  Throw ArgErr if this child is already
   * parented or has a duplicate name.  Return this.
   */
  add(kid: ObixObj): this;
  /**
   * Get the last child returned by {@link list | list} or null.
   */
  last(): ObixObj | null;
  /**
   * Get a readonly list of the children objects or empty list if
   * no children.  If iterating the children it is more efficient
   * to use {@link each | each}.
   */
  list(): sys.List<ObixObj>;
  /**
   * Iterate each of the children objects.
   */
  each(f: ((arg0: ObixObj) => void)): void;
  /**
   * Get the value encoded as a string.  The string is *not* XML
   * escaped.  If value is null return "null".
   */
  valToStr(): string;
  /**
   * Return number of child objects.
   */
  size(): number;
  /**
   * Return this element type's Fantom value type or null if this
   * is a non-value type such as `obj`.
   */
  valType(): sys.Type | null;
  /**
   * Parse an XML document into memory as a tree of ObixObj. If
   * close is true, then the input stream is guaranteed to be
   * closed.
   */
  static readXml(in$: sys.InStream, close?: boolean): ObixObj;
  /**
   * Write this ObixObj as an XML document to the specified
   * stream. No XML prolog is specified so that this method can
   * used to write a snippet of the overall document.
   */
  writeXml(out: sys.OutStream, indent?: number): void;
  /**
   * Remove the specified child object by reference. Throw ArgErr
   * if not my child.  Return this
   */
  remove(kid: ObixObj): this;
  /**
   * Get the root ancestor of this object, or return `this` if no
   * parent.
   */
  root(): ObixObj;
  /**
   * Get a child by name.  If not found and checked is true then
   * throw NameErr, otherwise null.
   */
  get(name: string, checked?: boolean): ObixObj | null;
  static make(...args: unknown[]): ObixObj;
  /**
   * Return is size is zero.
   */
  isEmpty(): boolean;
  /**
   * Remove all children objects.  Return this.
   */
  clear(): this;
  /**
   * Get the first child returned by {@link list | list} or null.
   */
  first(): ObixObj | null;
}

/**
 * ObixErr is used to raise an obix `<err>` object as a Fantom
 * exception.
 */
export class ObixErr extends sys.Err {
  static type$: sys.Type
  /**
   * The `is` attribute of the `<err>` object
   */
  contract(): Contract;
  /**
   * The `display` attribute of the `<err>` object
   */
  display(): string;
  /**
   * Convert error message and cause back to an `<err>` object
   */
  static toObj(msg: string, cause?: sys.Err | null): ObixObj;
  /**
   * Convert to `<err>` with BadUriErr contract
   */
  static toUnresolvedObj(uri: sys.Uri): ObixObj;
  /**
   * Return if the oBIX error defines the `obix:BadUriErr` contract
   */
  isBadUri(): boolean;
  /**
   * Construct error ObixObj
   */
  static make(obj: ObixObj, ...args: unknown[]): ObixErr;
}

