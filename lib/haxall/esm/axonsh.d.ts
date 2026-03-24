import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as util from './util.js';
import * as web from './web.js';
import * as xeto from './xeto.js';
import * as haystack from './haystack.js';
import * as xetoEnv from './xetoEnv.js';
import * as def from './def.js';
import * as defc from './defc.js';
import * as axon from './axon.js';
import * as folio from './folio.js';
import * as hx from './hx.js';

/**
 * Axon shell specific functions
 */
export class ShellFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Import data library into scope.
   * 
   * Examples:
   * ```
   * using()                // list all libraries currently in scope
   * using("phx.points")    // import given library into scope
   * using("*")             // import every library installed
   * ```
   */
  static _using(name?: string | null): sys.JsObj | null;
  /**
   * Load the in-memory database from an Uri.  The uri must be
   * have http/https scheme or reference a file on the local file
   * system (using forward slash). The filename must have one of
   * the following file extensions: zinc, json, trio, or csv. 
   * Each record should define an `id` tag, or if missing then an
   * id will assigned automatically.
   * 
   * Options:
   * - shortIds: will swizzle all internal refs to short ids
   * 
   * Examples:
   * ```
   * // load from the a local file
   * load(`folder/site.json`)
   * 
   * // load from the a local file and use short ids
   * load(`folder/site.json`, {shortIds})
   * 
   * // load from a HTTP URI
   * load(`https://project-haystack.org/example/download/bravo.zinc`)
   * ```
   */
  static load(uri: sys.Uri, opts?: xeto.Dict | null): sys.JsObj | null;
  /**
   * Print the variables in scope
   */
  static scope(): sys.JsObj | null;
  static make(...args: unknown[]): ShellFuncs;
  /**
   * Get library by qname (does not add it to using)
   */
  static datalib(qname: string): xeto.Lib;
  /**
   * Print help summary of every function
   */
  static helpAll(): sys.JsObj | null;
  /**
   * Print help summary or help on a specific command. Examples:
   * ```
   * help()        // print summary
   * help(using)   // print help for the using function
   * ```
   */
  static help(func?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Pretty print the given value.
   * 
   * Options:
   * - spec: "qname" | "own" | "effective"
   * - doc: include spec documentation comments
   * - json: pretty print dict tree as JSON
   * - text: output as plain text (not string literal)
   * - escapeUnicode: escape string literals with non-ASCII chars
   * - width: max width of output text
   */
  static print(val?: sys.JsObj | null, opts?: xeto.Dict | null): sys.JsObj | null;
  /**
   * Set the show error trace flag.
   */
  static showTrace(flag: boolean): sys.JsObj | null;
  /**
   * Exit the shell.
   */
  static quit(): sys.JsObj | null;
  /**
   * Unload all the data from the in-memory database. This is
   * essentially a commit to remove all recs.
   */
  static unloadAll(): sys.JsObj | null;
}

/**
 * ShellFolio is a single-threaded in-memory implementation of
 * Folio
 */
export class ShellFolio extends folio.Folio {
  static type$: sys.Type
  flushMode(): string;
  flushMode(it: string): void;
  backup(): folio.FolioBackup;
  doReadAllEachWhile(filter: haystack.Filter, opts: haystack.Dict | null, f: ((arg0: haystack.Dict) => sys.JsObj | null)): sys.JsObj | null;
  doReadByIds(ids: sys.List<haystack.Ref>): folio.FolioFuture;
  his(): folio.FolioHis;
  passwords(): folio.PasswordStore;
  refreshDisAll(): void;
  doCloseAsync(): folio.FolioFuture;
  doCommitAllAsync(diffs: sys.List<folio.Diff>, cxInfo: sys.JsObj | null): folio.FolioFuture;
  flush(): void;
  curVer(): number;
  doReadAll(filter: haystack.Filter, opts: haystack.Dict | null): folio.FolioFuture;
  static make(config: folio.FolioConfig, ...args: unknown[]): ShellFolio;
  doReadCount(filter: haystack.Filter, opts: haystack.Dict | null): number;
}

/**
 * ShellRuntime implements a limited, single-threaded runtime
 * for the shell.
 */
export class ShellRuntime extends sys.Obj implements hx.HxRuntime, ShellStdServices {
  static type$: sys.Type
  ns(): ShellNamespace;
  dir(): sys.File;
  platform(): hx.HxPlatform;
  services(): ShellServiceRegistry;
  version(): sys.Version;
  name(): string;
  config(): hx.HxConfig;
  db(): folio.Folio;
  lib(name: string, checked?: boolean): hx.HxLib | null;
  dis(): string;
  isRunning(): boolean;
  static make(...args: unknown[]): ShellRuntime;
  sync(timeout?: sys.Duration | null): this;
  isSteadyState(): boolean;
  meta(): haystack.Dict;
  service(type: sys.Type): hx.HxService;
  libs(): hx.HxRuntimeLibs;
  /**
   * Observable APIs
   */
  obs(): hx.HxObsService;
  /**
   * Context factory service
   */
  context(): hx.HxContextService;
  /**
   * Watch subscription APIs
   */
  watch(): hx.HxWatchService;
  /**
   * HTTP APIs
   */
  http(): hx.HxHttpService;
  /**
   * User management APIs
   */
  user(): hx.HxUserService;
  conn(): hx.HxConnService;
  io(): hx.HxIOService;
  pointWrite(): hx.HxPointWriteService;
  crypto(): hx.HxCryptoService;
  file(): hx.HxFileService;
  his(): hx.HxHisService;
  task(): hx.HxTaskService;
}

export abstract class ShellStdServices extends sys.Obj implements hx.HxStdServices {
  static type$: sys.Type
  obs(): hx.HxObsService;
  conn(): hx.HxConnService;
  io(): hx.HxIOService;
  pointWrite(): hx.HxPointWriteService;
  crypto(): hx.HxCryptoService;
  file(): hx.HxFileService;
  his(): hx.HxHisService;
  task(): hx.HxTaskService;
  watch(): hx.HxWatchService;
  service(type: sys.Type): hx.HxService;
  context(): hx.HxContextService;
  http(): hx.HxHttpService;
  user(): hx.HxUserService;
}

/**
 * Shell context
 */
export class ShellContext extends hx.HxContext {
  static type$: sys.Type
  /**
   * Flag for full stack trace dumps
   */
  showTrace(): boolean;
  showTrace(it: boolean): void;
  /**
   * Runtime
   */
  rt(): ShellRuntime;
  /**
   * Standout output stream
   */
  out(): sys.OutStream;
  out(it: sys.OutStream): void;
  /**
   * Flag to terminate the interactive loop
   */
  isDone(): boolean;
  isDone(it: boolean): void;
  /**
   * Sentinel value for no echo
   */
  static noEcho(): string;
  /**
   * Map of installed functions
   */
  funcs(): sys.Map<string, axon.TopFn>;
  funcs(it: sys.Map<string, axon.TopFn>): void;
  /**
   * Current user
   */
  user(): hx.HxUser;
  /**
   * Return empty dict
   */
  about(): haystack.Dict;
  /**
   * Run the given expression and handle errors/output
   */
  run(expr: string): number;
  /**
   * Run the iteractive prompt+eval loop
   */
  runInteractive(): number;
  /**
   * Create Xeto printer for output stream
   */
  printer(opts?: haystack.Dict | null): xetoEnv.Printer;
  /**
   * Read all the records with a given tag name/value pair
   */
  xetoReadAllEachWhile(filter: string, f: ((arg0: xeto.Dict) => sys.JsObj | null)): sys.JsObj | null;
  /**
   * Return an immutable thread safe object which will be passed
   * thru the commit process and available via the FolioHooks
   * callbacks. This is typically the User instance.  HxContext
   * always returns user.
   */
  commitInfo(): sys.JsObj | null;
  /**
   * Read a data record by id
   */
  xetoReadById(id: sys.JsObj): haystack.Dict | null;
  /**
   * Resolve dict by id - used by trap on Ref
   */
  trapRef(id: haystack.Ref, checked?: boolean): haystack.Dict | null;
  /**
   * Dereference an id to an record dict or null if unresolved
   */
  deref(id: haystack.Ref): haystack.Dict | null;
  /**
   * Return inference engine used for def aware filter queries
   */
  inference(): haystack.FilterInference;
  /**
   * Def namespace
   */
  ns(): haystack.Namespace;
  /**
   * Return if context has read access to given record
   */
  canRead(rec: haystack.Dict): boolean;
  /**
   * No session available
   */
  session(checked?: boolean): hx.HxSession | null;
  resolveFile(uri: sys.Uri): sys.File;
  /**
   * Constructor
   */
  static make(out?: sys.OutStream, ...args: unknown[]): ShellContext;
  /**
   * Return if context has write (update/delete) access to given
   * record
   */
  canWrite(rec: haystack.Dict): boolean;
  /**
   * Print the value to the stdout
   */
  print(val: sys.JsObj | null, opts?: haystack.Dict | null): void;
  /**
   * Find top-level function by qname or name
   */
  findTop(name: string, checked?: boolean): axon.Fn | null;
  /**
   * In-memory folio database
   */
  db(): ShellFolio;
  /**
   * Return contextual data as dict
   */
  toDict(): haystack.Dict;
}

/**
 * ShellServiceRegistry
 */
export class ShellServiceRegistry extends sys.Obj implements hx.HxServiceRegistry, ShellStdServices {
  static type$: sys.Type
  list(): sys.List<sys.Type>;
  get(type: sys.Type, checked?: boolean): hx.HxService | null;
  static make(rt: ShellRuntime, ...args: unknown[]): ShellServiceRegistry;
  getAll(type: sys.Type): sys.List<hx.HxService>;
  service(type: sys.Type): hx.HxService;
  /**
   * Observable APIs
   */
  obs(): hx.HxObsService;
  /**
   * Context factory service
   */
  context(): hx.HxContextService;
  /**
   * Watch subscription APIs
   */
  watch(): hx.HxWatchService;
  /**
   * HTTP APIs
   */
  http(): hx.HxHttpService;
  /**
   * User management APIs
   */
  user(): hx.HxUserService;
  conn(): hx.HxConnService;
  io(): hx.HxIOService;
  pointWrite(): hx.HxPointWriteService;
  crypto(): hx.HxCryptoService;
  file(): hx.HxFileService;
  his(): hx.HxHisService;
  task(): hx.HxTaskService;
}

/**
 * ShellNamespace wraps the xeto LibNamespace
 */
export class ShellNamespace extends def.MBuiltNamespace {
  static type$: sys.Type
  xetoRef(): concurrent.AtomicRef;
  rt(): ShellRuntime;
  repo(): xeto.LibRepo;
  createDefaultNamespace(): xeto.LibNamespace;
  xetoReload(): void;
  static init(rt: ShellRuntime): ShellNamespace;
  addUsing(libName: string, out: sys.OutStream): void;
  static make(b: def.BNamespace, rt: ShellRuntime, ...args: unknown[]): ShellNamespace;
}

/**
 * Axon shell command line interface program
 */
export class Main extends sys.Obj {
  static type$: sys.Type
  out(): sys.OutStream;
  out(it: sys.OutStream): void;
  main(mainArgs: sys.List<string>): number;
  printHelp(): number;
  hasOpt(opts: sys.List<string>, name: string, abbr?: string | null): boolean;
  static make(...args: unknown[]): Main;
}

