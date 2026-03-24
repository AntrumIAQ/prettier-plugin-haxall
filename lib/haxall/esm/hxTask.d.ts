import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as haystack from './haystack.js';
import * as obs from './obs.js';
import * as axon from './axon.js';
import * as folio from './folio.js';
import * as hx from './hx.js';

/**
 * Task manages running an Axon expression in a background
 * actor
 */
export class Task extends concurrent.Actor implements obs.Observer, hx.HxTask {
  static type$: sys.Type
  /**
   * Parent library
   */
  lib(): TaskLib;
  /**
   * Unique id - either rec id or ephemeral auto-generated id
   */
  id(): haystack.Ref;
  has(name: string): boolean;
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Return id for string
   */
  toStr(): string;
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  /**
   * Return if task is still alive to process messages
   */
  isAlive(): boolean;
  /**
   * Observer meta
   */
  meta(): haystack.Dict;
  /**
   * Get the currently running task
   */
  static cur(): Task | null;
  /**
   * Subscription to observable if applicable
   */
  subscription(): obs.Subscription | null;
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  missing(name: string): boolean;
  /**
   * Receive a message
   */
  receive(msg: sys.JsObj | null): sys.JsObj | null;
  /**
   * Create task for given record
   */
  static makeRec(lib: TaskLib, rec: haystack.Dict, ...args: unknown[]): Task;
  /**
   * Err raised by subscription
   */
  subscriptionErr(): sys.Err | null;
  /**
   * Attempt to subscribe to configured observable
   */
  subscribe(): void;
  isEmpty(): boolean;
  /**
   * Actor is self
   */
  actor(): concurrent.Actor;
  eachWhile(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
  /**
   * Constructor ephemeral expr called from taskRun
   */
  static makeEphemeral(lib: TaskLib, expr: axon.Expr, ...args: unknown[]): Task;
  /**
   * Get display string for dict or the given tag.  If `name` is
   * null, then return display text for the entire dict using [Etc.dictToDis](Etc.dictToDis).
   * If `name` is non-null then format the tag value using its
   * appropiate `toLocale` method.  If `name` is not defined by this
   * dict, then return `def`.
   */
  dis(name?: string | null, def?: string | null): string | null;
  /**
   * Temp shim until we break backward compatibility
   */
  _id(): xeto.Ref;
  /**
   * Create a new instance of this dict with the same names, but
   * apply the specified closure to generate new values.
   */
  map(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj)): this;
}

/**
 * TaskSettings
 */
export class TaskSettings extends haystack.TypedDict {
  static type$: sys.Type
  /**
   * Max threads for the task actor pool
   */
  maxThreads(): number;
  __maxThreads(it: number): void;
  /**
   * Linger time for an ephemeral task before it is removed from
   * debug
   */
  ephemeralLinger(): sys.Duration;
  __ephemeralLinger(it: sys.Duration): void;
  /**
   * Constructor
   */
  static make(d: haystack.Dict, f: ((arg0: TaskSettings) => void), ...args: unknown[]): TaskSettings;
}

/**
 * Task module Axon functions
 */
export class TaskFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Sleep for the given duration.  If not currently running in a
   * task this is a no-op.  This will block the current task's
   * thread and prevent other tasks from using it until the sleep
   * completes. So this function should be used sparingly and
   * with care.
   */
  static taskSleep(dur: haystack.Number): void;
  /**
   * Return if a future has completed or is still pending a
   * result. A future is completed by any of the following
   * conditions:
   * - the task processes the message and returns a result
   * - the task processes the message and raises an exception
   * - the future is cancelled See [lib-task::doc#futures](lib-task::doc#futures).
   */
  static futureIsComplete(future: concurrent.Future): boolean;
  /**
   * Refresh the user account used for tasks
   */
  static taskRefreshUser(): void;
  /**
   * Cancel a future.  If the message is still queued then its
   * removed from the actor's queue and will not be processed. No
   * guarantee is made that the message will not be processed.
   * See [lib-task::doc#futures](lib-task::doc#futures).
   */
  static futureCancel(future: concurrent.Future): sys.JsObj | null;
  /**
   * Schedule a message for delivery after the specified period
   * of duration has elapsed.  Once the period has elapsed the
   * message is appended to the end of the task's queue.  Return
   * a future to track the asynchronous result.  See [lib-task::doc#messaging](lib-task::doc#messaging).
   */
  static taskSendLater(task: sys.JsObj, dur: haystack.Number, msg: sys.JsObj | null): concurrent.Future;
  /**
   * Return current state of a future as one of the following
   * strings:
   * - `pending`: still queued or being processed
   * - `ok`: completed with result value
   * - `err`: completed with an exception
   * - `cancelled`: future was cancelled before processing See [lib-task::doc#futures](lib-task::doc#futures).
   */
  static futureState(future: concurrent.Future): string;
  /**
   * Block current thread until a future's result is ready.  A
   * null timeout will block forever.  If an exception was raised
   * by the asynchronous computation, then it is raised to the
   * caller. See [lib-task::doc#futures](lib-task::doc#futures).
   */
  static futureGet(future: concurrent.Future, timeout?: haystack.Number | null): sys.JsObj | null;
  /**
   * Run the given expression asynchronously in an ephemeral
   * task. Return a future to track the asynchronous result. 
   * Note the expr passed cannot use any variables from the
   * current scope. See [lib-task::doc#ephemeralTasks](lib-task::doc#ephemeralTasks).
   */
  static taskRun(expr: axon.Expr, msg?: axon.Expr): concurrent.Future;
  static make(...args: unknown[]): TaskFuncs;
  /**
   * List the current tasks as a grid. The format of this grid is
   * subject to change.
   */
  static tasks(opts?: haystack.Dict | null): haystack.Grid;
  /**
   * Is the current context running asynchrounsly inside a task
   */
  static taskIsRunning(): boolean;
  /**
   * Asynchronously send a message to the given task for
   * processing. Return a future to track the asynchronous
   * result. See [lib-task::doc#messaging](lib-task::doc#messaging).
   */
  static taskSend(task: sys.JsObj, msg: sys.JsObj | null): concurrent.Future;
  /**
   * Remove a task local variable by name. Must be running in a
   * task context.  See [lib-task::doc#locals](lib-task::doc#locals).
   */
  static taskLocalRemove(name: string): sys.JsObj | null;
  /**
   * Block on a list of futures until they all transition to a
   * completed state.  If timeout is null block forever,
   * otherwise raise TimeoutErr if any one of the futures does
   * not complete before the timeout elapses. See [lib-task::doc#futures](lib-task::doc#futures).
   */
  static futureWaitForAll(futures: sys.List<concurrent.Future>, timeout?: haystack.Number | null): sys.List<concurrent.Future>;
  /**
   * Return current task if running within the context of an
   * asynchronous task.  If context is not within a task, then
   * return null or raise an exception based on checked flag.
   */
  static taskCur(checked?: boolean): Task | null;
  /**
   * Set cancel flag for the given task.  Cancelling a task sets
   * an internal flag which is checked by the context's heartbeat
   * on every Axon call.  On the next Axon call the current
   * message context will raise a {@link sys.CancelledErr | sys::CancelledErr}
   * which will be raised by the respective future.  Cancelling a
   * task does **not** interrupt any current operations, so any
   * blocking future or I/O calls should always use a timeout.
   */
  static taskCancel(task: sys.JsObj): void;
  /**
   * Schedule a message for delivery after the given future has
   * completed. Completion may be due to the future returning a
   * result, throwing an exception, or cancellation.  Return a
   * future to track the asynchronous result.  See [lib-task::doc#messaging](lib-task::doc#messaging).
   */
  static taskSendWhenComplete(task: sys.JsObj, future: concurrent.Future, msg?: sys.JsObj | null): concurrent.Future;
  /**
   * Lookup a task by id which is any value supported by [toRecId()](toRecId()).
   */
  static task(id: sys.JsObj | null, checked?: boolean): Task | null;
  /**
   * Get a task local variable by name or def if not defined.
   * Must be running in a task context.  See [lib-task::doc#locals](lib-task::doc#locals).
   */
  static taskLocalGet(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Set a task local variable. The name must be a valid tag
   * name. Must be running in a task context.  See [lib-task::doc#locals](lib-task::doc#locals).
   */
  static taskLocalSet(name: string, val: sys.JsObj | null): sys.JsObj | null;
  /**
   * Restart a task.  This kills the tasks and discards any
   * pending messages in its queue.  See [lib-task::doc#lifecycle](lib-task::doc#lifecycle).
   */
  static taskRestart(task: sys.JsObj): Task;
  /**
   * Block until a future transitions to a completed state (ok,
   * err, or canceled).  If timeout is null then block forever,
   * otherwise raise a TimeoutErr if timeout elapses.  Return
   * future. See [lib-task::doc#futures](lib-task::doc#futures).
   */
  static futureWaitFor(future: concurrent.Future, timeout?: haystack.Number | null): concurrent.Future;
  /**
   * Update the current running task's progress data with given
   * dict. This is a silent no-op if the current context is not
   * running in a task.
   * 
   * Example:
   * ```
   * // report progress percentage processing a list of records
   * recs.each((rec, index)=>do
   *   taskProgress({percent: round(100%*index/recs.size), cur:rec.dis})
   *   processRec(rec)
   * end)
   * taskProgress({percent:100%})
   * ```
   */
  static taskProgress(progress: sys.JsObj | null): sys.JsObj | null;
}

/**
 * Async task engine library
 */
export class TaskLib extends hx.HxLib implements hx.HxTaskService {
  static type$: sys.Type
  pool(): concurrent.ActorPool;
  /**
   * Run the given expression asynchronously in an ephemeral
   * task. Return a future to track the asynchronous result.
   */
  run(expr: axon.Expr, msg?: sys.JsObj | null): concurrent.Future;
  /**
   * Settings record
   */
  rec(): TaskSettings;
  /**
   * Start callback
   */
  onStart(): void;
  /**
   * Get or create an adjunct within the context of the current
   * task.  If an adjunct is already attached to the task then
   * return it, otherwise invoke the given function to create it.
   * Raise an exception if not running with the context of a
   * task.
   */
  adjunct(onInit: (() => hx.HxTaskAdjunct)): hx.HxTaskAdjunct;
  /**
   * Stop callback
   */
  onStop(): void;
  onHouseKeeping(): void;
  houseKeepingFreq(): sys.Duration | null;
  /**
   * Get the currently running task
   */
  cur(checked?: boolean): hx.HxTask | null;
  userFallback(): hx.HxUser;
  /**
   * Subscribe tasks on steady state
   */
  onSteadyState(): void;
  /**
   * Construction
   */
  static make(...args: unknown[]): TaskLib;
  /**
   * Publish HxTaskService
   */
  services(): sys.List<hx.HxService>;
  /**
   * Update current task's progress info for debugging.  If not
   * running in the context of a task, then this is a no op.
   */
  progress(progress: haystack.Dict): void;
  user(): hx.HxUser;
}

/**
 * TaskTest
 */
export class TaskTest extends hx.HxTest {
  static type$: sys.Type
  testCancel(): void;
  testAdjuncts(): void;
  addFuncRec(name: string, src: string, tags?: sys.Map<string, sys.JsObj | null>): haystack.Dict;
  testLocals(): void;
  sync(): void;
  verifyKilled(task: Task): void;
  testSettings(): void;
  verifyUnsubscribed(o: obs.Observable, t: Task): void;
  verifySend(task: sys.JsObj, msg: sys.JsObj, expected: sys.JsObj): void;
  testBasics(): void;
  testUser(): void;
  static make(...args: unknown[]): TaskTest;
  verifyTask(task: Task, type: string, status: string, fault?: string | null): Task;
  addTaskRec(dis: string, expr: string): haystack.Dict;
  verifySubscribed(o: obs.Observable, t: Task): void;
}

