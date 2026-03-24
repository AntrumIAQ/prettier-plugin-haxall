import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as inet from './inet.js';
import * as util from './util.js';
import * as web from './web.js';
import * as wisp from './wisp.js';
import * as xeto from './xeto.js';
import * as haystack from './haystack.js';
import * as auth from './auth.js';
import * as def from './def.js';
import * as defc from './defc.js';
import * as axon from './axon.js';
import * as obs from './obs.js';
import * as folio from './folio.js';
import * as hx from './hx.js';
import * as hxFolio from './hxFolio.js';

export class HxdObsService extends concurrent.Actor implements hx.HxObsService {
  static type$: sys.Type
  rt(): HxdRuntime;
  log(): sys.Log;
  schedule(): obs.ScheduleObservable;
  commit(diff: folio.Diff, user: hx.HxUser | null): void;
  list(): sys.List<obs.Observable>;
  sync(timeout: sys.Duration | null): void;
  hisWrite(rec: haystack.Dict, result: haystack.Dict, user: hx.HxUser | null): void;
  curVal(diff: folio.Diff): void;
  get(name: string, checked?: boolean): obs.Observable | null;
  static make(rt: HxdRuntime, ...args: unknown[]): HxdObsService;
  receive(msgObj: sys.JsObj | null): sys.JsObj | null;
}

export class HxdOverlayCompiler extends sys.Obj {
  static type$: sys.Type
  rt(): HxdRuntime;
  log(): sys.Log;
  libSymbol(): haystack.Symbol;
  base(): haystack.Namespace;
  compileNamespace(): haystack.Namespace;
  static make(rt: HxdRuntime, base: haystack.Namespace, ...args: unknown[]): HxdOverlayCompiler;
}

export class HxdRuntimeLibs extends concurrent.Actor implements hx.HxRuntimeLibs {
  static type$: sys.Type
  rt(): HxdRuntime;
  required(): sys.List<string>;
  actorPool(): concurrent.ActorPool;
  remove(arg: sys.JsObj): void;
  get(name: string, checked?: boolean): hx.HxLib | null;
  has(name: string): boolean;
  static make(rt: HxdRuntime, required: sys.List<string>, ...args: unknown[]): HxdRuntimeLibs;
  add(name: string, tags?: haystack.Dict): hx.HxLib;
  init(removeUnknown: boolean): void;
  receive(arg: sys.JsObj | null): sys.JsObj | null;
  list(): sys.List<hx.HxLib>;
  getType(type: sys.Type, checked?: boolean): hx.HxLib | null;
  status(): haystack.Grid;
}

export class HxdServiceRegistry extends sys.Obj implements hx.HxServiceRegistry {
  static type$: sys.Type
  obs(): HxdObsService;
  conn(): hx.HxConnService;
  file(): hx.HxFileService;
  his(): hx.HxHisService;
  context(): HxdContextService;
  pointWrite(): hx.HxPointWriteService;
  list(): sys.List<sys.Type>;
  crypto(): hx.HxCryptoService;
  watch(): hx.HxWatchService;
  user(): hx.HxUserService;
  get(type: sys.Type, checked?: boolean): hx.HxService | null;
  static make(rt: HxdRuntime, libs: sys.List<hx.HxLib>, ...args: unknown[]): HxdServiceRegistry;
  getAll(type: sys.Type): sys.List<hx.HxService>;
  io(): hx.HxIOService;
  task(): hx.HxTaskService;
  http(): hx.HxHttpService;
}

export class FuncDef extends def.MDef {
  static type$: sys.Type
  expr(): axon.Fn;
  static make(b: def.BDef, src: string | null, ...args: unknown[]): FuncDef;
}

export class HxdLibSpi extends concurrent.Actor implements hx.HxLibSpi {
  static type$: sys.Type
  type(): sys.Type | null;
  install(): HxdInstalledLib;
  webUri(): sys.Uri;
  name(): string;
  rt(): hx.HxRuntime;
  log(): sys.Log;
  subscriptions(): sys.List<obs.Subscription>;
  lib(): hx.HxLib;
  def(): haystack.Lib;
  observe(name: string, config: haystack.Dict, callback: sys.JsObj): obs.Subscription;
  rec(): haystack.Dict;
  steadyState(): concurrent.Future;
  isFault(): boolean;
  sync(timeout?: sys.Duration | null): void;
  statusMsg(): string | null;
  stop(): concurrent.Future;
  status(): string;
  toStatus(status: string, msg: string): void;
  update(rec: haystack.Dict): void;
  static instantiate(rt: HxdRuntime, install: HxdInstalledLib, rec: haystack.Dict): hx.HxLib;
  unready(): concurrent.Future;
  isRunning(): boolean;
  ready(): concurrent.Future;
  receive(msgObj: sys.JsObj | null): sys.JsObj | null;
  start(): concurrent.Future;
  actor(): concurrent.Actor;
  typedRec(dict: haystack.Dict): haystack.Dict;
}

export class HxdRuntime extends sys.Obj implements hx.HxRuntime {
  static type$: sys.Type
  obs(): HxdObsService;
  libsActorPool(): concurrent.ActorPool;
  dir(): sys.File;
  hxdActorPool(): concurrent.ActorPool;
  his(): hx.HxHisService;
  context(): HxdContextService;
  version(): sys.Version;
  name(): string;
  libs(): HxdRuntimeLibs;
  log(): sys.Log;
  shutdownHook(): (() => void);
  platform(): hx.HxPlatform;
  file(): hx.HxFileService;
  watch(): hx.HxWatchService;
  config(): hx.HxConfig;
  db(): folio.Folio;
  conn(): hx.HxConnService;
  lib(name: string, checked?: boolean): hx.HxLib | null;
  dis(): string;
  init(boot: HxdBoot): this;
  io(): hx.HxIOService;
  pointWrite(): hx.HxPointWriteService;
  sync(timeout?: sys.Duration | null): this;
  crypto(): hx.HxCryptoService;
  task(): hx.HxTaskService;
  stop(): void;
  meta(): haystack.Dict;
  http(): hx.HxHttpService;
  installed(): HxdInstalled;
  ns(): haystack.Namespace;
  isRunning(): boolean;
  now(): sys.DateTime;
  static make(boot: HxdBoot, ...args: unknown[]): HxdRuntime;
  start(): this;
  services(): HxdServiceRegistry;
  isSteadyState(): boolean;
  user(): hx.HxUserService;
}

export class HxdBoot extends sys.Obj {
  static type$: sys.Type
  log(): sys.Log;
  log(it: sys.Log): void;
  dir(): sys.File | null;
  dir(it: sys.File | null): void;
  platform(): sys.Map<string, sys.JsObj | null>;
  platform(it: sys.Map<string, sys.JsObj | null>): void;
  create(): boolean;
  create(it: boolean): void;
  requiredLibs(): sys.List<string>;
  requiredLibs(it: sys.List<string>): void;
  removeUnknownLibs(): boolean;
  removeUnknownLibs(it: boolean): void;
  projMeta(): haystack.Dict;
  projMeta(it: haystack.Dict): void;
  version(): sys.Version;
  version(it: sys.Version): void;
  name(): string | null;
  name(it: string | null): void;
  config(): sys.Map<string, sys.JsObj | null>;
  config(it: sys.Map<string, sys.JsObj | null>): void;
  initRuntime(): HxdRuntime;
  run(): number;
  static make(...args: unknown[]): HxdBoot;
  init(): HxdRuntime;
}

export class HxdFolioHooks extends sys.Obj implements folio.FolioHooks {
  static type$: sys.Type
  rt(): HxdRuntime;
  db(): folio.Folio;
  ns(checked?: boolean): haystack.Namespace | null;
  preCommit(e: folio.FolioCommitEvent): void;
  postHisWrite(e: folio.FolioHisEvent): void;
  postCommit(e: folio.FolioCommitEvent): void;
  static make(rt: HxdRuntime, ...args: unknown[]): HxdFolioHooks;
  /**
   * Xeto namespace if available
   */
  xeto(checked?: boolean): xeto.LibNamespace | null;
}

export class HxdContextService extends sys.Obj implements hx.HxContextService {
  static type$: sys.Type
  rt(): HxdRuntime;
  createSession(session: hx.HxSession): hx.HxContext;
  create(user: hx.HxUser): hx.HxContext;
  xetoReload(): void;
  static make(rt: HxdRuntime, ...args: unknown[]): HxdContextService;
}

export class HxdContext extends hx.HxContext {
  static type$: sys.Type
  sessionRef(): hx.HxSession | null;
  rt(): HxdRuntime;
  user(): hx.HxUser;
  about(): haystack.Dict;
  ns(): haystack.Namespace;
  session(checked?: boolean): hx.HxSession | null;
  db(): folio.Folio;
}

export class HxdInstalled extends sys.Obj {
  static type$: sys.Type
  lib(name: string, checked?: boolean): HxdInstalledLib | null;
  static main(): void;
  static build(): HxdInstalled;
}

export class HxdInstalledLib extends sys.Obj {
  static type$: sys.Type
  pod(): sys.Pod;
  meta(): haystack.Dict;
  name(): string;
  toStr(): string;
  depends(): sys.List<string>;
  type(): sys.Type | null;
  metaFile(): sys.File;
}

export class HxdDefCompiler extends defc.DefCompiler {
  static type$: sys.Type
  rt(): HxdRuntime;
  static make(rt: HxdRuntime, ...args: unknown[]): HxdDefCompiler;
}

export class HxdTestSpi extends hx.HxTestSpi {
  static type$: sys.Type
  forceSteadyState(rt: hx.HxRuntime): void;
  addUser(user: string, pass: string, tags: sys.Map<string, sys.JsObj | null>): hx.HxUser;
  start(projMeta: haystack.Dict): hx.HxRuntime;
  addLib(libName: string, tags: sys.Map<string, sys.JsObj | null>): hx.HxLib;
  stop(rt: hx.HxRuntime): void;
  makeContext(user: hx.HxUser | null): hx.HxContext;
  static boot(dir: sys.File, projMeta?: haystack.Dict): hx.HxRuntime;
  static make(test: hx.HxTest, ...args: unknown[]): HxdTestSpi;
}

export class ResHxLib extends hx.HxLib {
  static type$: sys.Type
  static make(...args: unknown[]): ResHxLib;
}

