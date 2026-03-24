import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as math from './math.js';
import * as inet from './inet.js';
import * as util from './util.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as hx from './hx.js';
import * as hxMath from './hxMath.js';

/**
 * Python library.
 */
export class PyLib extends hx.HxLib {
  static type$: sys.Type
  /**
   * Convenience to get the PyLib instance from the current
   * context.
   */
  static cur(checked?: boolean): PyLib | null;
  /**
   * Construction
   */
  static make(...args: unknown[]): PyLib;
}

/**
 * Mixin for types that implement a python session.
 */
export abstract class PySession extends sys.Obj {
  static type$: sys.Type
  /**
   * If the session has not been initialized yet, invoke the
   * callback with this session to allow it to do one-time setup.
   */
  init(fn: ((arg0: PySession) => void)): this;
  /**
   * Kill the session - it can no longer be used again
   */
  kill(): this;
  /**
   * Set the timeout for evaluating python expressions and return
   * this
   */
  timeout(dur: sys.Duration | null): this;
  /**
   * Evaluate the expression and return the result.
   */
  eval(expr: string): sys.JsObj | null;
  /**
   * Define a variable in local scope, and return this
   */
  define(name: string, val: sys.JsObj | null): this;
  /**
   * Close the session, and return this
   */
  close(): this;
  /**
   * Execute the given code block, and return this
   */
  exec(code: string): this;
}

/**
 * Axon functions for py
 */
export class PyFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Create a new {@link PySession | hxPy::PySession} instance.
   * Options:
   * - `image`: name of the Docker image to run. By default, the lib
   *   will try to run the following images in this order:
   *   1. `ghcr.io/haxall/hxpy:<ver>` (where ver = current library
   *     Haxall version)
   *   2. `ghcr.io/haxall/hxpy:latest`
   *   3. `ghcr.io/haxall/hxpy:main`
   * - `network`:  the name of the Docker network you want the
   *   container to join.
   * - `logLevel`: log level of the hxpy python process in Docker.
   *   Valid values are `WARN`, `INFO`, `DEBUG`, (default='WARN')
   * 
   * The default timeout for [pyEval()](pyEval()) is 5min. Use [pyTimeout()](pyTimeout())
   * to change this timeout.
   * 
   * Sessions created in the context of a task are persistent,
   * meaning they will not be closed until the task is killed.
   */
  static py(opts?: haystack.Dict | null): PySession;
  /**
   * Evalue the given python statement in the session, and return
   * the result. The session will be closed unless it is running
   * in a task.
   */
  static pyEval(py: PySession, stmt: string): sys.JsObj | null;
  /**
   * Initialize the python session by calling the given func to
   * do any one-time setup of the python session. If `pyInit()` has
   * already been called on this session, then the callback is
   * not invoked.
   * 
   * Typically, this func is used in the context of a task since
   * the python session in a task is persistent. This allows to
   * do any one-time [pyExec()](pyExec()) or [pyDefine()](pyDefine())
   * when the task is first creatd.
   */
  static pyInit(py: PySession, fn: axon.Fn): PySession;
  /**
   * Execute the given python code in the session and return the
   * python session. Note: python `exec()` does not return a value,
   * so use [pyEval()](pyEval()) if you need the result of running
   * a python statement. This method is primarily useful for
   * declaring functions that you want available when using [pyEval()](pyEval()).
   */
  static pyExec(py: PySession, code: string): PySession;
  /**
   * Define a variable to be available to python code running in
   * the session.
   */
  static pyDefine(py: PySession, name: string, val: sys.JsObj | null): PySession;
  static make(...args: unknown[]): PyFuncs;
  /**
   * Set the timeout for [pyEval()](pyEval()).
   */
  static pyTimeout(py: PySession, val: haystack.Number | null): PySession;
}

