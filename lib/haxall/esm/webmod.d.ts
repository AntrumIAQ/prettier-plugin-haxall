import * as sys from './sys.js';
import * as inet from './inet.js';
import * as web from './web.js';
import * as util from './util.js';

/**
 * LogMod is used log requests according to the W3C extended
 * log file format.
 * 
 * See [pod doc](pod-doc#log)
 */
export class LogMod extends web.WebMod {
  static type$: sys.Type
  /**
   * Directory used to store log file(s).
   */
  dir(): sys.File;
  __dir(it: sys.File): void;
  /**
   * Log filename pattern.  The name may contain a pattern
   * between `{}` using the pattern format of {@link sys.DateTime.toLocale | sys::DateTime.toLocale}.
   * For example to maintain a log file per month, use a filename
   * such as "web-{YYYY-MM}.log".
   */
  filename(): string;
  __filename(it: string): void;
  /**
   * Format of the log records as a string of #Fields names. See [pod
   * doc](pod-doc#log)
   */
  fields(): string;
  __fields(it: string): void;
  /**
   * Constructor with it-block.
   */
  static make(f?: ((arg0: LogMod) => void) | null, ...args: unknown[]): LogMod;
  onStop(): void;
  onService(): void;
}

/**
 * FileMod is a web module which publishes a file or directory.
 * 
 * See [pod doc](pod-doc#file)
 */
export class FileMod extends web.WebMod {
  static type$: sys.Type
  /**
   * File or directory to publish.  This field must be configured
   * in the constructor's it-block.
   */
  file(): sys.File;
  __file(it: sys.File): void;
  /**
   * Constructor with it-block, must set {@link file | file}
   */
  static make(f: ((arg0: FileMod) => void) | null, ...args: unknown[]): FileMod;
  onService(): void;
}

/**
 * PipelineMod routes seriallly through a list of sub-WebMods.
 * 
 * See [pod doc](pod-doc#pipeline)
 */
export class PipelineMod extends web.WebMod {
  static type$: sys.Type
  /**
   * Steps to run serially regardless of `WebRes.isDone` before
   * every request.
   */
  before(): sys.List<web.WebMod>;
  __before(it: sys.List<web.WebMod>): void;
  /**
   * Steps to run serially regardless of `WebRes.isDone` after
   * every request.
   */
  after(): sys.List<web.WebMod>;
  __after(it: sys.List<web.WebMod>): void;
  /**
   * Steps to run serially until `WebRes.isDone` returns true.
   */
  steps(): sys.List<web.WebMod>;
  __steps(it: sys.List<web.WebMod>): void;
  /**
   * Call `onStart` on sub-mods.
   */
  onStart(): void;
  /**
   * Constructor with it-block.
   */
  static make(f: ((arg0: PipelineMod) => void) | null, ...args: unknown[]): PipelineMod;
  /**
   * Call `onStop` on sub-mods.
   */
  onStop(): void;
  /**
   * Service the pipeline.
   */
  onService(): void;
}

/**
 * RouteMod routes a level of the URI path to sub-WebMods.
 * 
 * See [pod doc](pod-doc#route)
 */
export class RouteMod extends web.WebMod {
  static type$: sys.Type
  /**
   * Map of URI path names to sub-WebMods.  The name "index" is
   * used for requests to the RouteMod itself.
   */
  routes(): sys.Map<string, web.WebMod>;
  __routes(it: sys.Map<string, web.WebMod>): void;
  /**
   * Call `onStart` on sub-mods.
   */
  onStart(): void;
  /**
   * Constructor with it-block.
   */
  static make(f: ((arg0: RouteMod) => void) | null, ...args: unknown[]): RouteMod;
  /**
   * Call `onStop` on sub-mods.
   */
  onStop(): void;
  onService(): void;
}

