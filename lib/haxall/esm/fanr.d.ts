import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as util from './util.js';
import * as web from './web.js';

/**
 * Query models a parsed query against the pod database. See [docFanr::Queries](https://fantom.org/doc/docFanr/Queries)
 * for details and formal grammer.
 */
export class Query extends sys.Obj {
  static type$: sys.Type
  /**
   * Return query string - see [docFanr::Queries](https://fantom.org/doc/docFanr/Queries)
   * for format.
   */
  toStr(): string;
  /**
   * Match against full query (name, version, and meta)
   */
  include(pod: PodSpec): boolean;
  /**
   * Match against name only, but *not* version or meta
   */
  includeName(pod: PodSpec): boolean;
  /**
   * Parse query string - see [docFanr::Queries](https://fantom.org/doc/docFanr/Queries)
   * for format.
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Query;
  /**
   * Equality is based on query parts
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Hash is based on query parts
   */
  hash(): number;
}

/**
 * Facet for annotating an {@link Command | Command} option
 * field.
 */
export class CommandOpt extends sys.Obj implements sys.Facet {
  static type$: sys.Type
  /**
   * Usage help, should be a single short line summary
   */
  help(): string;
  __help(it: string): void;
  /**
   * Name of option to use on command line
   */
  name(): string;
  __name(it: string): void;
  /**
   * Property name to use to initialize from fanr config
   */
  config(): string | null;
  __config(it: string | null): void;
  static make(f?: ((arg0: CommandOpt) => void) | null, ...args: unknown[]): CommandOpt;
}

/**
 * FanrRepo models the local environment that we install to and
 * publish from. See [docFanr](https://fantom.org/doc/docFanr/Concepts#env).
 */
export class FanrEnv extends sys.Obj {
  static type$: sys.Type
  /**
   * Env instance we are wrapping
   */
  env(): sys.Env;
  /**
   * Match a set of pods in local environment and return as
   * PodSpecs
   */
  query(query: string): sys.List<PodSpec>;
  /**
   * Lazily load all installed pods as PodSpecs
   */
  queryAll(): sys.List<PodSpec>;
  /**
   * Find a pod by name in local environment and return as
   * PodSpec
   */
  find(podName: string): PodSpec | null;
  /**
   * Constructor for given {@link sys.Env | sys::Env}
   */
  static make(env?: sys.Env, ...args: unknown[]): FanrEnv;
}

/**
 * WebRepoTest
 */
export class WebRepoTest extends sys.Test {
  static type$: sys.Type
  webSpec(): PodSpec | null;
  webSpec(it: PodSpec | null): void;
  verifyPublish(): void;
  /**
   * Test that public (no credentials) reports auth required
   */
  verifyAuthRequired(f: ((arg0: Repo) => void)): void;
  test(): void;
  podFile(podName: string): sys.File;
  /**
   * Test with invalid username and invalid password
   */
  verifyBadCredentials(f: ((arg0: Repo) => void)): void;
  verifyFind(): void;
  verifyAuthErr(msg: string, r: Repo, f: ((arg0: Repo) => void)): void;
  doVerifyPing(r: Repo): void;
  /**
   * Test that valid login account is forbidden from an operation
   */
  verifyForbidden(f: ((arg0: Repo) => void)): void;
  verifyRead(): void;
  verifyQuery(): void;
  doVerifyRead(r: Repo): void;
  teardown(): void;
  static make(...args: unknown[]): WebRepoTest;
  doVerifyPublish(r: Repo, f: sys.File): void;
  verifyPing(): void;
  setup(): void;
  doVerifyFind(r: Repo): void;
  doVerifyQuery(r: Repo): void;
}

/**
 * PodSpec models a specific pod version See [docFanr](https://fantom.org/doc/docFanr/Concepts#podSpec).
 */
export class PodSpec extends sys.Obj {
  static type$: sys.Type
  /**
   * Summary string
   */
  summary(): string;
  /**
   * String format is "{name}-{version}"
   */
  toStr(): string;
  /**
   * List of dependencies for this pod
   */
  depends(): sys.List<sys.Depend>;
  /**
   * Version of this pod
   */
  version(): sys.Version;
  /**
   * Metadata name/value pairs for this pod
   */
  meta(): sys.Map<string, string>;
  /**
   * Name of this pod
   */
  name(): string;
  /**
   * Construct from a pod zip file
   */
  static load(file: sys.File): PodSpec;
  /**
   * Construct from an InStream
   */
  static read(in$: sys.InStream): PodSpec;
  /**
   * Return pod file size in bytes or null if unknown
   */
  size(): number | null;
  /**
   * Equality is based on name and version
   */
  equals(x: sys.JsObj | null): boolean;
  /**
   * Hash code is based on name and version
   */
  hash(): number;
  /**
   * Get the build timestamp or null if not available
   */
  ts(): sys.DateTime | null;
}

/**
 * Facet for annotating an {@link Command | Command} argument
 * field.
 */
export class CommandArg extends sys.Obj implements sys.Facet {
  static type$: sys.Type
  /**
   * Usage help, should be a single short line summary
   */
  help(): string;
  __help(it: string): void;
  /**
   * Name of the argument
   */
  name(): string;
  __name(it: string): void;
  static make(f?: ((arg0: CommandArg) => void) | null, ...args: unknown[]): CommandArg;
}

/**
 * Repo models a database of pod versions See [docFanr](https://fantom.org/doc/docFanr/Concepts#repos).
 */
export class Repo extends sys.Obj {
  static type$: sys.Type
  toStr(): string;
  /**
   * Open an input stream to read the specified pod version.
   * Callers should ensure that the stream is drained and closed
   * as quickly as possible.
   */
  read(pod: PodSpec): sys.InStream;
  /**
   * Ping the repo and return summary props.  Standard props
   * include:
   * - `fanr.type`: qname of Repo implementation class
   * - `fanr.version`: version string of `fanr` pod being used
   */
  ping(): sys.Map<string, string>;
  /**
   * Find pod versions which match query.  The `numVersions`
   * specifies how many different versions will be matched for a
   * single pod.  Multiple pod versions are matched from highest
   * version to lowest version, so a limit of one will always
   * match the current (highest) version.
   */
  query(query: string, numVersions?: number): sys.List<PodSpec>;
  /**
   * URI for this Repo
   */
  uri(): sys.Uri;
  /**
   * Find an exact match for the given pod name and version.  If
   * version is null, then find latest version.  If not found
   * then return null or throw UnknownPodErr based on checked
   * flag.
   */
  find(podName: string, version: sys.Version | null, checked?: boolean): PodSpec | null;
  /**
   * Publish the given pod file.  If successful return the spec
   * for newly added pod.  Throw err if the pod is malformed or
   * already published in the database.
   */
  publish(podFile: sys.File): PodSpec;
  /**
   * Find and create Repo implementation for URI based on its
   * scheme. Current schemes supported as "file" and "http".
   */
  static makeForUri(uri: sys.Uri, username?: string | null, password?: string | null): Repo;
  static make(...args: unknown[]): Repo;
}

/**
 * WebRepoAuth is used to plug in authentication and permission
 * authorization for a WebRepoMod.
 */
export class WebRepoAuth extends sys.Obj {
  static type$: sys.Type
  /**
   * Get the salt used for the SALTED-HMAC-SHA1 secret algorithm
   * for the given user.  If the user doesn't exist or salts
   * aren't supported, then return null.
   */
  salt(user: sys.JsObj | null): string | null;
  /**
   * Is the given user allowed to publish the given pod? If pod
   * is null, return if user is allowed to publish anything.
   */
  allowPublish(user: sys.JsObj | null, pod: PodSpec | null): boolean;
  /**
   * What algorithms are supported for computing the signature of
   * a request. They should be sorted from most preferred to
   * least preferred. Standard values are:
   * - `HMAC-SHA1`: SHA-1 HMAC using secret as key The default
   *   implementation of both client and server only supports
   *   "HMAC-SHA1".
   */
  signatureAlgorithms(): sys.List<string>;
  /**
   * Get the secret as a byte buffer for the given user and
   * algorithm which can be used to verify the digital signature
   * of a request. See {@link secretAlgorithms | secretAlgorithms}
   * for list of algorithms (parameter is guaranteed to be in all
   * upper case).
   */
  secret(user: sys.JsObj | null, algorithm: string): sys.Buf;
  /**
   * What algorithms are supported to compute the "secret" to use
   * for digital signatures.  They should be sorted from most
   * preferred to least preferred.  Standard values are:
   * - `PASSWORD`: simple plaintext password is used as secret
   * - `SALTED-HMAC-SHA1`: HMAC of "user:salt" with password as key
   */
  secretAlgorithms(): sys.List<string>;
  /**
   * Is the given user allowed to read/download/install the given
   * pod? If pod is null, return if user is allowed to install
   * anything.
   */
  allowRead(user: sys.JsObj | null, pod: PodSpec | null): boolean;
  /**
   * Given a username, return an implementation specific object
   * which models the user for the given username.  Or return
   * null if username doesn't map to a valid user.
   */
  user(username: string): sys.JsObj | null;
  /**
   * Is the given user allowed to query the given pod? If pod is
   * null, return if user is allowed to query anything.
   */
  allowQuery(user: sys.JsObj | null, pod: PodSpec | null): boolean;
  static make(...args: unknown[]): WebRepoAuth;
}

/**
 * WebRepoMod implements basic server side functionality for
 * publishing a repo over HTTP to be used by `WebRepo`. URI
 * namespace:
 * ```
 * Method   Uri                       Operation
 * ------   --------------------      ---------
 * GET      {base}/ping               ping meta-data
 * GET      {base}/find/{name}        pod find current
 * GET      {base}/find/{name}/{ver}  pod find
 * GET      {base}/query?{query}      pod query
 * POST     {base}/query              pod query
 * GET      {base}/pod/{name}/{ver}   pod download
 * POST     {base}/publish            publish pod
 * GET      {base}/auth?{username}    authentication info
 * ```
 * 
 * See [Web Repos](https://fantom.org/doc/docFanr/WebRepos).
 */
export class WebRepoMod extends web.WebMod {
  static type$: sys.Type
  /**
   * Authentication and authorization plug-in. Default is to make
   * everything completely public.
   */
  auth(): WebRepoAuth;
  __auth(it: WebRepoAuth): void;
  /**
   * Repository to publish on the web, typically a local
   * FileRepo.
   */
  repo(): Repo;
  __repo(it: Repo): void;
  /**
   * Meta-data to include in ping requests.  If customized, then
   * be sure to include standard props defined by {@link Repo.ping | Repo.ping}.
   */
  pingMeta(): sys.Map<string, string>;
  __pingMeta(it: sys.Map<string, string>): void;
  /**
   * Dir to store temp files, defaults to `Env.tempDir`
   */
  tempDir(): sys.File;
  __tempDir(it: sys.File): void;
  /**
   * Constructor, must set {@link repo | repo}.
   */
  static make(f?: ((arg0: WebRepoMod) => void) | null, ...args: unknown[]): WebRepoMod;
  /**
   * Service
   */
  onService(): void;
}

/**
 * QueryTest
 */
export class QueryTest extends sys.Test {
  static type$: sys.Type
  testParser(): void;
  verifyIncludeCmp(query: string, spec: PodSpec, expected: number | null): void;
  verifyParser(input: string, parts: sys.List<sys.List<sys.JsObj | null>>): void;
  testTokenizer(): void;
  verifyInclude(query: string, spec: PodSpec, expected: boolean): void;
  spec(name: string, ver: string, meta?: sys.Map<string, string>): PodSpec;
  verifyToks(src: string, toks: sys.List<sys.JsObj | null>): void;
  testInclude(): void;
  verifyIncludeEq(query: string, spec: PodSpec, expected: boolean): void;
  static make(...args: unknown[]): QueryTest;
}

/**
 * Command implements a top-level command in the fanr command
 * line tool.
 * 
 * Commands declare their options using the {@link CommandOpt | CommandOpt}
 * facet which works similiar to {@link util.AbstractMain | util::AbstractMain}.
 * If the field is a Bool, then the option is treated as a flag
 * option.  Otherwise it must be one of these types: Str, Uri.
 */
export class Command extends sys.Obj {
  static type$: sys.Type
  /**
   * Stdout for printing command output
   */
  out(): sys.OutStream;
  out(it: sys.OutStream): void;
  /**
   * Password for authentication
   */
  password(): string | null;
  password(it: string | null): void;
  /**
   * Option to dump full stack trace on errors
   */
  errTrace(): boolean;
  errTrace(it: boolean): void;
  /**
   * Repository URI -r option
   */
  repoUri(): sys.Uri | null;
  repoUri(it: sys.Uri | null): void;
  /**
   * Option to skip confirmation (auto yes)
   */
  skipConfirm(): boolean;
  skipConfirm(it: boolean): void;
  /**
   * Username for authentication
   */
  username(): string | null;
  username(it: string | null): void;
  /**
   * Get the repo to use for this command:
   * - default is config prop "repo"
   * - override with "-r" option
   */
  repo(): Repo;
  /**
   * Print usage to given output stream
   */
  usage(out?: sys.OutStream): void;
  /**
   * Execute command.  If there is a failure then throw {@link err | err},
   * otherwise the command is assumed to be successful.
   */
  run(): void;
  static make(...args: unknown[]): Command;
  /**
   * Short summary of command for usage screen
   */
  summary(): string;
  /**
   * Throw an exception which may be used to unwind the stack
   * back to main to indicate command failed and return non-zero
   */
  err(msg: string, cause?: sys.Err | null): sys.Err;
  /**
   * Get the local environment to use this command
   */
  env(): FanrEnv;
  /**
   * Ask for y/n confirmation or skip if `-y` option specified.
   */
  confirm(msg: string): boolean;
  /**
   * Log a warning to {@link out | out}
   */
  warn(msg: string): void;
  /**
   * Name of command
   */
  name(): string;
}

