import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as util from './util.js';
import * as web from './web.js';
import * as haystack from './haystack.js';

/**
 * Observer is an actor which subscribes to an observable's
 * data items
 * 
 * NOTE: this API is subject to change
 */
export abstract class Observer extends sys.Obj {
  static type$: sys.Type
  /**
   * Actor for observer
   */
  actor(): concurrent.Actor;
  /**
   * Meta data for observer
   */
  meta(): haystack.Dict;
}

/**
 * Subscription models an Observable to Observer binding
 * 
 * NOTE: this API is subject to change
 */
export class Subscription extends sys.Obj {
  static type$: sys.Type
  /**
   * Subscribed observer consuming data items
   */
  observer(): Observer;
  /**
   * Observable producing data items
   */
  observable(): Observable;
  /**
   * Configuration options for subscription
   */
  config(): haystack.Dict;
  /**
   * Debug string
   */
  toStr(): string;
  /**
   * Send sync message to observer actor
   */
  sync(): concurrent.Future;
  /**
   * Return if this subscription is still active
   */
  isSubscribed(): boolean;
  /**
   * Convenience for `Observable.unsubscribe(this)`
   */
  unsubscribe(): void;
  /**
   * Constructor
   */
  static make(observable: Observable, observer: Observer, config: haystack.Dict, ...args: unknown[]): Subscription;
  /**
   * Return if this subscription has been cancelled
   */
  isUnsubscribed(): boolean;
  /**
   * Send observation message to observer actor
   */
  send(msg: Observation): concurrent.Future;
}

/**
 * Observable is the subject of an asynchronous data stream.
 * 
 * NOTE: this API is subject to change
 */
export class Observable extends sys.Obj {
  static type$: sys.Type
  /**
   * List the active subscriptions
   */
  subscriptions(): sys.List<Subscription>;
  /**
   * Unsubscribe all subscriptions
   */
  unsubscribeAll(): void;
  /**
   * Subscribe an observer actor to this this observables data
   * stream
   */
  subscribe(observer: Observer, config: haystack.Dict): Subscription;
  /**
   * Does this observer have any active subscriptions
   */
  hasSubscriptions(): boolean;
  /**
   * Unsubscribe a current subscription
   */
  unsubscribe(s: Subscription): void;
  /**
   * Return the name of this observable. This name must match up
   * with the the `observe` def subtype name
   */
  name(): string;
  static make(...args: unknown[]): Observable;
}

/**
 * Observation is base class for all observable data items
 * 
 * NOTE: this API is subject to change
 */
export abstract class Observation extends sys.Obj implements haystack.Dict {
  static type$: sys.Type
  /**
   * Type name which matches {@link Observable.name | Observable.name}
   * and the def name
   */
  type(): string;
  /**
   * Subtype name if available which is specific to the
   * observable type
   */
  subType(): string | null;
  /**
   * Timestamp for the event
   */
  ts(): sys.DateTime;
  /**
   * Return string for debugging only
   */
  toStr(): string;
  /**
   * Return if the there are no name/value pairs
   */
  isEmpty(): boolean;
  /**
   * Iterate through the name/value pairs
   */
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  /**
   * Get display string for dict or the given tag.  If `name` is
   * null, then return display text for the entire dict using [Etc.dictToDis](Etc.dictToDis).
   * If `name` is non-null then format the tag value using its
   * appropiate `toLocale` method.  If `name` is not defined by this
   * dict, then return `def`.
   */
  dis(name?: string | null, def?: string | null): string | null;
  /**
   * Get the value for the given name or `def` if name not mapped
   */
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return true if the given name is not mapped to a non-null
   * value.
   */
  missing(name: string): boolean;
  /**
   * Get the value mapped by the given name.  If it is not mapped
   * to a non-null value, then throw an UnknownNameErr.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Temp shim until we break backward compatibility
   */
  _id(): xeto.Ref;
  /**
   * Return true if the given name is mapped to a non-null value.
   */
  has(name: string): boolean;
  /**
   * Get the `id` tag as a Ref or raise CastErr/UnknownNameErr
   */
  id(): haystack.Ref;
  /**
   * Iterate through the name/value pairs until the given
   * function returns non-null, then break the iteration and
   * return resulting object.  Return null if function returns
   * null for every name/value pair.
   */
  eachWhile(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
  /**
   * Create a new instance of this dict with the same names, but
   * apply the specified closure to generate new values.
   */
  map(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj)): this;
}

/**
 * RecSubscription is used for `obsRecs` to handle filtering
 * 
 * NOTE: this API is subject to change
 */
export class RecSubscription extends Subscription {
  static type$: sys.Type
  /**
   * Filter is configured
   */
  filter(): haystack.Filter | null;
  /**
   * Match the record against configured filter
   */
  include(rec: haystack.Dict): boolean;
  /**
   * Constructor
   */
  static make(observable: Observable, observer: Observer, config: haystack.Dict, ...args: unknown[]): RecSubscription;
}

