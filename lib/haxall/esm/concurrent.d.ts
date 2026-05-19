import * as sys from './sys.js';

/**
 * Controller for a group of actors which manages their
 * execution using pooled thread resources.
 * 
 * See [docLang::Actors](https://fantom.org/doc/docLang/Actors)
 */
export class ActorPool extends sys.Obj {
  static type$: sys.Type
  /**
   * Max number of messages that may be queued by actors in this
   * pool. Once this limit is reached, any messages sent are
   * immediately rejected and their future will raise {@link QueueOverflowErr | QueueOverflowErr}.
   * This limit only applies to messages sent via `send` and `sendWhenDone`.
   * No limit checking is applied to `sendLater`.
   */
  maxQueue(): number;
  __maxQueue(it: number): void;
  /**
   * Name to use for the pool and associated threads.
   */
  name(): string;
  __name(it: string): void;
  /**
   * Max number of threads which are used by this pool for
   * concurrent actor execution.  This value must be at least one
   * or greater.
   */
  maxThreads(): number;
  __maxThreads(it: number): void;
  /**
   * Return true if this pool has been stopped or killed.  Once a
   * a pool is stopped, new messages may not be delivered to any
   * of its actors.  A stopped pool is not necessarily done until
   * all its actors have finished processing.  Also see {@link isDone | isDone}
   * and {@link join | join}.
   */
  isStopped(): boolean;
  /**
   * Perform an unorderly shutdown.  Any pending messages which
   * have not started processing are cancelled.  Actors which are
   * currently processing a message will be interrupted.  See {@link stop | stop}
   * to perform an orderly shutdown.  If the pool has already
   * been killed, then do nothing.
   */
  kill(): this;
  /**
   * Return true if this pool has been stopped or killed and all
   * its actors have completed processing.  If this pool was
   * stopped then true indicates that all pending messages in the
   * queues before the stop have been fully processed.  If this
   * pool was killed, then this method returns true once all
   * actors have exited their thread.  See {@link join | join} to
   * block until done.
   */
  isDone(): boolean;
  /**
   * Perform an orderly shutdown.  Once stopped, no new messages
   * may be sent to this pool's actors.  However, any pending
   * messages will be processed.  Note that scheduled messages
   * are *not* guaranteed to be processed, only those delivered
   * with `Actor.send`.
   * 
   * Use {@link join | join} to wait for all actors to complete
   * their message queue. To perform an immediate shutdown use {@link kill | kill}.
   * If the pool has already been stopped, then do nothing. 
   * Return this.
   */
  stop(): this;
  /**
   * Wait for this pool's actors to fully terminate or until the
   * given timeout occurs.  A null timeout blocks forever.  If
   * this method times out, then TimeoutErr is thrown.  Throw Err
   * if the pool is not stopped.  Return this.
   */
  join(timeout?: sys.Duration | null): this;
  /**
   * It-block constructor
   */
  static make(f?: ((arg0: ActorPool) => void) | null, ...args: unknown[]): ActorPool;
}

/**
 * ActorMsg provides simple immutable tuple to use for actor
 * messages.
 */
export class ActorMsg extends sys.Obj {
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
   * Message identifier key, typically string or enum
   */
  id(): sys.JsObj;
  /**
   * Return debug string representation
   */
  toStr(): string;
  /**
   * Constructor with three arguments
   */
  static make3(id: sys.JsObj, a: sys.JsObj | null, b: sys.JsObj | null, c: sys.JsObj | null, ...args: unknown[]): ActorMsg;
  /**
   * Constructor with two arguments
   */
  static make2(id: sys.JsObj, a: sys.JsObj | null, b: sys.JsObj | null, ...args: unknown[]): ActorMsg;
  /**
   * Constructor with five arguments
   */
  static make5(id: sys.JsObj, a: sys.JsObj | null, b: sys.JsObj | null, c: sys.JsObj | null, d: sys.JsObj | null, e: sys.JsObj | null, ...args: unknown[]): ActorMsg;
  /**
   * Constructor with four arguments
   */
  static make4(id: sys.JsObj, a: sys.JsObj | null, b: sys.JsObj | null, c: sys.JsObj | null, d: sys.JsObj | null, ...args: unknown[]): ActorMsg;
  /**
   * Constructor with one argument
   */
  static make1(id: sys.JsObj, a: sys.JsObj | null, ...args: unknown[]): ActorMsg;
  /**
   * Constructor with zero arguments
   */
  static make0(id: sys.JsObj, ...args: unknown[]): ActorMsg;
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
 * Actor is a worker who processes messages asynchronously.
 * 
 * See [docLang::Actors](https://fantom.org/doc/docLang/Actors)
 * and [examples](examples::concurrent-actors).
 */
export class Actor extends sys.Obj {
  static type$: sys.Type
  /**
   * Put the currently executing actor thread to sleep for the
   * specified period.  If the thread is interrupted for any
   * reason while sleeping, then InterruptedErr is thrown.
   */
  static sleep(duration: sys.Duration): void;
  /**
   * Create an actor whose execution is controlled by the given
   * ActorPool. If receive is non-null, then it is used to
   * process messages sent to this actor.  If receive is
   * specified then it must be an immutable function (it cannot
   * capture state from the calling thread), otherwise
   * NotImmutableErr is thrown.  If receive is null, then you
   * must subclass Actor and override the {@link receive | receive}
   * method.
   */
  static make(pool: ActorPool, receive?: ((arg0: sys.JsObj | null) => sys.JsObj | null) | null, ...args: unknown[]): Actor;
  /**
   * Schedule a message for delivery after the given future has
   * completed. Completion may be due to the future returning a
   * result, throwing an exception, or cancellation. 
   * Send-when-complete messages are never coalesced.  The given
   * future must be an actor based future.  Also see {@link send | send}
   * and {@link sendLater | sendLater}.
   */
  sendWhenComplete(f: Future, msg: sys.JsObj | null): Future;
  /**
   * Schedule a message for delivery after the specified period
   * of duration has elapsed.  Once the period has elapsed the
   * message is appended to the end of this actor's queue. 
   * Accuracy of scheduling is dependent on thread coordination
   * and pending messages in the queue. Scheduled messages are
   * not guaranteed to be processed if the actor's pool is
   * stopped.  Scheduled messages are never coalesced. Also see {@link send | send}
   * and {@link sendWhenComplete | sendWhenComplete}.
   */
  sendLater(d: sys.Duration, msg: sys.JsObj | null): Future;
  /**
   * The pool used to control execution of this actor.
   */
  pool(): ActorPool;
  /**
   * Create an actor with a coalescing message loop.  This
   * constructor follows the same semantics as {@link make | make},
   * but has the ability to coalesce the messages pending in the
   * thread's message queue.  Coalesced messages are merged into
   * a single pending message with a shared Future.
   * 
   * The `toKey` function is used to derive a key for each message,
   * or if null then the message itself is used as the key.  If
   * the `toKey` function returns null, then the message is not
   * considered for coalescing. Internally messages are indexed
   * by key for efficient coalescing.
   * 
   * If an incoming message has the same key as a pending message
   * in the queue, then the `coalesce` function is called to
   * coalesce the messages into a new merged message.  If `coalesce`
   * function itself is null, then we use the incoming message
   * (last one wins).  The coalesced message occupies the same
   * position in the queue as the original and reuses the
   * original message's Future instance.
   * 
   * Both the `toKey` and `coalesce` functions are called while
   * holding an internal lock on the queue.  So the functions
   * must be efficient and never attempt to interact with other
   * actors.
   */
  static makeCoalescing(pool: ActorPool, toKey: ((arg0: sys.JsObj | null) => sys.JsObj | null) | null, coalesce: ((arg0: sys.JsObj | null, arg1: sys.JsObj | null) => sys.JsObj | null) | null, receive?: ((arg0: sys.JsObj | null) => sys.JsObj | null) | null, ...args: unknown[]): Actor;
  /**
   * Asynchronously send a message to this actor for processing.
   * If msg is not immutable, then NotImmutableErr is thrown.
   * Throw Err if this actor's pool has been stopped.  Return a
   * future which may be used to obtain the result once it the
   * actor has processed the message.  If the message is
   * coalesced then this method returns the original message's
   * future reference. Also see {@link sendLater | sendLater} and {@link sendWhenComplete | sendWhenComplete}.
   */
  send(msg: sys.JsObj | null): Future;
  /**
   * Return the map of "global" variables visibile only to the
   * current actor (similar to how thread locals work in Java). 
   * These variables are keyed by a string name - by convention
   * use a dotted notation beginning with your pod name to avoid
   * naming collisions.
   */
  static locals(): sys.Map<string, sys.JsObj | null>;
}

/**
 * ConcurrentMapTest
 */
export class ConcurrentMapTest extends sys.Test {
  static type$: sys.Type
  verifyConcurrentMap(m: ConcurrentMap, expected: sys.Map<string, sys.JsObj>): void;
  static make(...args: unknown[]): ConcurrentMapTest;
  test(): void;
}

/**
 * State of a Future's asynchronous computation
 */
export class FutureStatus extends sys.Enum {
  static type$: sys.Type
  /**
   * List of FutureStatus values indexed by ordinal
   */
  static vals(): sys.List<FutureStatus>;
  static pending(): FutureStatus;
  static ok(): FutureStatus;
  static err(): FutureStatus;
  static cancelled(): FutureStatus;
  /**
   * Return if pending state
   */
  isPending(): boolean;
  /**
   * Return if the ok state
   */
  isOk(): boolean;
  /**
   * Return if the cancelled state
   */
  isCancelled(): boolean;
  /**
   * Return if the err state
   */
  isErr(): boolean;
  /**
   * Return the FutureStatus instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): FutureStatus;
  /**
   * Return if in any completed state: ok, err, or cancelled
   */
  isComplete(): boolean;
}

/**
 * AtomicTest
 */
export class AtomicTest extends sys.Test {
  static type$: sys.Type
  testBool(): void;
  testInt(): void;
  testRef(): void;
  static make(...args: unknown[]): AtomicTest;
}

/**
 * Lock for synchronization between actors.
 */
export class Lock extends sys.Obj {
  static type$: sys.Type
  /**
   * Release the lock.  Raise exception if not holding the lock.
   */
  unlock(): void;
  /**
   * Acquire the lock if its free and immediately return true. Or
   * if the lock is not available and timeout is null, then
   * immediately return false.  If timeout is non-null, then
   * block up to the given timeout waiting for the lock and
   * return true if lock acquired or false on timeout.
   */
  tryLock(timeout?: sys.Duration | null): boolean;
  /**
   * Construct mutual exclusion lock.
   */
  static makeReentrant(): Lock;
  /**
   * Acquire the lock; if not available then block forever until
   * its available.
   */
  lock(): void;
}

/**
 * AtomicRef is used to manage a object reference shared
 * between actor/threads with atomic updates.  Only immutable
 * objects may be shared.
 */
export class AtomicRef extends sys.Obj {
  static type$: sys.Type
  /**
   * The current value. Throw NotImmutableErr if set to a mutable
   * value.
   */
  val(): sys.JsObj | null;
  val(it: sys.JsObj | null): void;
  /**
   * Return `val.toStr`
   */
  toStr(): string;
  /**
   * Atomically set the value to `update` if current value is
   * equivalent to the `expect` value compared using `===` operator.
   * Return true if updated, or false if current value was not
   * equal to the expected value. Throw NotImmutableErr if `update`
   * is mutable.
   */
  compareAndSet(expect: sys.JsObj | null, update: sys.JsObj | null): boolean;
  /**
   * Atomically set the value and return the previous value.
   * Throw NotImmutableErr if `val` is mutable.
   */
  getAndSet(val: sys.JsObj | null): sys.JsObj | null;
  /**
   * Construct with initial value. Throw NotImmutableErr if
   * initialized to a mutable value.
   */
  static make(val?: sys.JsObj | null, ...args: unknown[]): AtomicRef;
}

/**
 * AtomicInt is used to manage an integer variable shared
 * between actor/threads with atomic updates.
 */
export class AtomicInt extends sys.Obj {
  static type$: sys.Type
  /**
   * The current integer value
   */
  val(): number;
  val(it: number): void;
  /**
   * Atomically add the given value to the current value
   */
  add(delta: number): void;
  /**
   * Return `val.toStr`
   */
  toStr(): string;
  /**
   * Atomically increment the current value by one and return the
   * previous value.
   */
  getAndIncrement(): number;
  /**
   * Atomically increment the current value by one and return the
   * updated value.
   */
  incrementAndGet(): number;
  /**
   * Atomically increment the value by one
   */
  increment(): void;
  /**
   * Atomically decrement the current value by one and return the
   * updated value.
   */
  decrementAndGet(): number;
  /**
   * Atomically set the value to `update` if current value is
   * equivalent to the `expect` value.  Return true if updated, or
   * false if current value was not equal to the expected value.
   */
  compareAndSet(expect: number, update: number): boolean;
  /**
   * Atomically decrement the value by one
   */
  decrement(): void;
  /**
   * Atomically add the given value to the current value and
   * return the previous value.
   */
  getAndAdd(delta: number): number;
  /**
   * Atomically add the given value to the current value and
   * return the updated value.
   */
  addAndGet(delta: number): number;
  /**
   * Atomically set the value and return the previous value.
   */
  getAndSet(val: number): number;
  /**
   * Construct with initial value
   */
  static make(val?: number, ...args: unknown[]): AtomicInt;
  /**
   * Atomically decrement the current value by one and return the
   * previous value.
   */
  getAndDecrement(): number;
}

/**
 * ActorTest
 */
export class ActorTest extends sys.Test {
  static type$: sys.Type
  pool(): ActorPool;
  pool(it: ActorPool): void;
  static constObj(): sys.JsObj;
  static cancel(f: Future): sys.JsObj | null;
  testMake(): void;
  testFutureWaitFor(): void;
  testMessaging(): void;
  testCoalescing(): void;
  testBalance(): void;
  testLater(): void;
  verifyAllSame(list: sys.List<sys.JsObj>): void;
  testStop(): void;
  static coalesceCoalesce(a: sys.List<sys.JsObj>, b: sys.List<sys.JsObj>): sys.JsObj | null;
  static order(msg: sys.JsObj): sys.JsObj | null;
  testOrdering(): void;
  static whenCompleteB(msg: Future): sys.JsObj | null;
  static whenCompleteA(msg: sys.JsObj | null): sys.JsObj | null;
  verifyMsg(m: ActorMsg, count: number, a: sys.JsObj | null, b: sys.JsObj | null, c: sys.JsObj | null, d: sys.JsObj | null, e: sys.JsObj | null): void;
  verifyAllCancelled(futures: sys.List<Future>): void;
  testLocals(): void;
  spawnSleeper(pool: ActorPool): Actor;
  static coalesce(msg: sys.JsObj | null): sys.JsObj | null;
  testFuture(): void;
  static messaging(msg: string): sys.JsObj | null;
  testYields(): void;
  testQueueOverflow(): void;
  testKill(): void;
  testDiagnostics(): void;
  testWhenComplete(): void;
  testMsg(): void;
  static returnNow(msg: sys.JsObj | null): sys.JsObj | null;
  testCoalescingFunc(): void;
  static sleep(msg: sys.JsObj | null): sys.JsObj | null;
  static coalesceKey(msg: sys.JsObj | null): sys.JsObj | null;
  testTimeoutCancel(): void;
  verifyLater(start: sys.Duration, f: Future, expected: sys.Duration | null, tolerance?: sys.Duration): void;
  testBasics(): void;
  teardown(): void;
  static make(...args: unknown[]): ActorTest;
  static coalesceReceive(msg: sys.JsObj | null): sys.JsObj | null;
  static incr(msg: number): number;
  verifyWhenComplete(b: Future, c: Future, expected: string): void;
  testLaterRand(): void;
  static locals(num: number, locale: sys.Locale, msg: sys.JsObj | null): sys.JsObj | null;
}

/**
 * QueueOverflowErr is raised by a Future for messages sent to
 * actor that has exceeded the max queue size.
 */
export class QueueOverflowErr extends sys.Err {
  static type$: sys.Type
  /**
   * Construct with specified error message and optional root
   * cause.
   */
  static make(msg?: string, cause?: sys.Err | null, ...args: unknown[]): QueueOverflowErr;
}

/**
 * ConcurrentMap is a Fantom wrapper around Java's
 * ConcurrentHashMap. It provides high performance concurrency
 * and allows many operations to be performed without locking. 
 * Refer to the ConcurrentHashMap Javadoc for the detailed
 * semanatics on behavior and performance.
 */
export class ConcurrentMap extends sys.Obj {
  static type$: sys.Type
  /**
   * Return list of values
   */
  vals(of$: sys.Type): sys.List<sys.JsObj>;
  /**
   * Return list of keys
   */
  keys(of$: sys.Type): sys.List<sys.JsObj>;
  /**
   * Remove a value by key, ignore if key not mapped
   */
  remove(key: sys.JsObj): sys.JsObj | null;
  /**
   * Get a value by its key or return null
   */
  get(key: sys.JsObj): sys.JsObj | null;
  /**
   * Set a value by key and return old value.  Return the old
   * value mapped by the key or null if it is not currently
   * mapped.
   */
  getAndSet(key: sys.JsObj, val: sys.JsObj): sys.JsObj | null;
  /**
   * Make with initial capacity
   */
  static make(initialCapacity?: number, ...args: unknown[]): ConcurrentMap;
  /**
   * Append the specified map to this map be setting every
   * key/value from `m` in this map. Keys in m not yet mapped are
   * added and keys already mapped are overwritten. Return this.
   */
  setAll(m: sys.Map): this;
  /**
   * Add a value by key, raise exception if key was already
   * mapped
   */
  add(key: sys.JsObj, val: sys.JsObj): void;
  /**
   * Set a value by key
   */
  set(key: sys.JsObj, val: sys.JsObj): void;
  /**
   * Get the value for the specified key, or if it doesn't exist
   * then automatically add it with the given default value.
   */
  getOrAdd(key: sys.JsObj, defVal: sys.JsObj): sys.JsObj;
  /**
   * Return true if the specified key is mapped
   */
  containsKey(key: sys.JsObj): boolean;
  /**
   * Return if size is zero (this is expensive and requires full
   * segment traveral)
   */
  isEmpty(): boolean;
  /**
   * Remove all the key/value pairs
   */
  clear(): void;
  /**
   * Iterate the map's key value pairs
   */
  each(f: ((arg0: sys.JsObj, arg1: sys.JsObj) => void)): void;
  /**
   * Return size (this is expensive and requires full segment
   * traveral)
   */
  size(): number;
  /**
   * Iterate the map's key value pairs until given function
   * returns non-null and return that as the result of this
   * method.  Otherwise itereate every pair and return null
   */
  eachWhile(f: ((arg0: sys.JsObj, arg1: sys.JsObj) => sys.JsObj | null)): sys.JsObj | null;
}

/**
 * AtomicBool is used to manage a boolean variable shared
 * between actor/threads with atomic updates.
 */
export class AtomicBool extends sys.Obj {
  static type$: sys.Type
  /**
   * The current boolean value
   */
  val(): boolean;
  val(it: boolean): void;
  /**
   * Return `val.toStr`
   */
  toStr(): string;
  /**
   * Atomically set the value to `update` if current value is
   * equivalent to the `expect` value.  Return true if updated, or
   * false if current value was not equal to the expected value.
   */
  compareAndSet(expect: boolean, update: boolean): boolean;
  /**
   * Atomically set the value and return the previous value.
   */
  getAndSet(val: boolean): boolean;
  /**
   * Construct with initial value
   */
  static make(val?: boolean, ...args: unknown[]): AtomicBool;
}

/**
 * LockTest
 */
export class LockTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): LockTest;
  test(): void;
}

/**
 * Future represents the result of an asynchronous computation.
 * 
 * See [docLang::Actors](https://fantom.org/doc/docLang/Actors)
 */
export class Future extends sys.Obj {
  static type$: sys.Type
  /**
   * Cancel this computation if it has not begun processing. No
   * guarantee is made that the computation will be cancelled.
   */
  cancel(): void;
  /**
   * Block on a list of futures until they all transition to a
   * completed state.  If timeout is null block forever,
   * otherwise raise TimeoutErr if any one of the futures does
   * not complete before the timeout elapses.
   */
  static waitForAll(futures: sys.List<Future>, timeout?: sys.Duration | null): void;
  /**
   * Construct a completable future instance in the pending
   * state. This method is subject to change.
   */
  static makeCompletable(): Future;
  /**
   * Complete the future with a failure condition using given
   * exception.  Raise an exception if the future is already
   * complete (ignore this call if cancelled).  Return this.
   * Raise UnsupportedErr if this future is not completable. This
   * method is subject to change.
   */
  completeErr(err: sys.Err): this;
  /**
   * Block current thread until result is ready.  If timeout
   * occurs then TimeoutErr is raised.  A null timeout blocks
   * forever.  If an exception was raised by the asynchronous
   * computation, then it is raised to the caller of this method.
   */
  get(timeout?: sys.Duration | null): sys.JsObj | null;
  /**
   * Complete the future successfully with given value.  Raise an
   * exception if value is not immutable or the future is already
   * complete (ignore this call if cancelled). Raise
   * UnsupportedErr if this future is not completable. Return
   * this. This method is subject to change.
   */
  complete(val: sys.JsObj | null): this;
  /**
   * Block until this future transitions to a completed state
   * (ok, err, or canceled).  If timeout is null then block
   * forever, otherwise raise a TimeoutErr if timeout elapses. 
   * Return this.
   */
  waitFor(timeout?: sys.Duration | null): this;
  /**
   * Current state of asynchronous computation
   */
  status(): FutureStatus;
}

