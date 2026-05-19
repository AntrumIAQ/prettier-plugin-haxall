import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as util from './util.js';
import * as xeto from './xeto.js';
import * as haystack from './haystack.js';

export class ScalarBinding extends xeto.SpecBinding {
  static type$: sys.Type
  type(): sys.Type;
  spec(): string;
  isDict(): boolean;
  decodeScalar($xeto: string, checked?: boolean): sys.JsObj | null;
  decodeDict($xeto: xeto.Dict): xeto.Dict;
  encodeScalar(val: sys.JsObj): string;
  isInheritable(): boolean;
  static make(spec: string, type: sys.Type, ...args: unknown[]): ScalarBinding;
  isScalar(): boolean;
}

/**
 * ZipLibFiles
 */
export class ZipLibFiles extends MLibFiles {
  static type$: sys.Type
  list(): sys.List<sys.Uri>;
  zipFile(): sys.File;
  read(uri: sys.Uri, f: ((arg0: sys.Err | null, arg1: sys.InStream | null) => void)): void;
  isSupported(): boolean;
  static make(zipFile: sys.File, list: sys.List<sys.Uri>, ...args: unknown[]): ZipLibFiles;
}

/**
 * Utility functions
 */
export class XetoUtil extends sys.Obj {
  static type$: sys.Type
  /**
   * Convert a list of Str or Ref qnames into the unique list of
   * libraries
   */
  static qnamesToLibs(qnames: sys.List<sys.JsObj>): sys.List<string>;
  /**
   * Convert a list of dicts with "spec" tag to unique lib names
   */
  static dataToLibs(recs: sys.List<xeto.Dict>): sys.List<string>;
  /**
   * Convert Xeto full level fidelity to a Haystack fidelity
   */
  static toHaystack(x: sys.JsObj | null): sys.JsObj | null;
  /**
   * If the given lib is is not a valid name return an error
   * message, otherwise if its valid return return null.
   */
  static libNameErr(n: string): string | null;
  /**
   * Find the most common supertype between two specs. In the
   * case of and/or types we only work first ofs
   */
  static commonSupertypeBetween(a: xeto.Spec, b: xeto.Spec): xeto.Spec;
  /**
   * Is the given instance name reserved
   */
  static isReservedInstanceName(n: string): boolean;
  /**
   * Is the given name a reserved spec meta tag
   */
  static isReservedSpecMetaName(n: string): boolean;
  /**
   * Convert "foo.bar.baz" to "fooBarBaz"
   */
  static dottedToCamel(name: string, dot?: number): string;
  /**
   * Convert "fooBarBaz" or "FooBarBaz" to "foo.bar.baz".
   */
  static camelToDotted(name: string, dot?: number): string;
  /**
   * Merge in own meta with special handling for Remove
   */
  static addOwnMeta(acc: sys.Map<string, sys.JsObj>, own: xeto.Dict): void;
  /**
   * Is the given name a reserved lib meta tag
   */
  static isReservedLibMetaName(n: string): boolean;
  /**
   * Standard option to fidellity level mapping
   */
  static optFidelity(opts: xeto.Dict | null): XetoFidelity;
  /**
   * Convert "foo.bar::Baz" to lib name "foo.bar" or null if no
   * "::"
   */
  static qnameToLib(qname: sys.JsObj): string | null;
  /**
   * Is the given name a reserved lib or spec meta tag
   */
  static isReservedMetaName(n: string): boolean;
  /**
   * Return if valid spec name
   */
  static isSpecName(n: string): boolean;
  /**
   * Given a list of specs, remove any specs that are supertypes
   * of other specs in this same list:
   * ```
   * [Equip, Meter, ElecMeter, Vav]  => ElecMeter, Vav
   * ```
   */
  static excludeSupertypes(list: sys.List<CSpec>): sys.List<CSpec>;
  /**
   * Convert Xeto full level fidelity to a Haystack fidelity
   */
  static toHaystackDict(x: xeto.Dict): xeto.Dict;
  /**
   * Boolean option
   */
  static optBool(opts: xeto.Dict | null, name: string, def: boolean): boolean;
  /**
   * Instantiate default value of spec
   */
  static instantiate(ns: MNamespace, spec: XetoSpec, opts: xeto.Dict): sys.JsObj | null;
  /**
   * Is the given spec name reserved
   */
  static isReservedSpecName(n: string): boolean;
  /**
   * Return if name is "_" + digits
   */
  static isAutoName(n: string): boolean;
  /**
   * Convert "foo-bar-baz" to "fooBarBaz"
   */
  static dashedToCamel(name: string): string;
  /**
   * Given a list of specs, find the most specific common
   * supertype they all share.
   */
  static commonSupertype(specs: sys.List<xeto.Spec>): xeto.Spec;
  /**
   * Get logging function from options
   */
  static optLog(opts: xeto.Dict | null, name: string): ((arg0: xeto.XetoLogRec) => void) | null;
  static make(...args: unknown[]): XetoUtil;
  /**
   * Convert Xeto full level fidelity to a Haystack fidelity
   */
  static toHaystackList(x: sys.List): sys.List;
  /**
   * Convert "fooBarBaz" or "FooBarBaz" to "foo-bar-baz".
   */
  static camelToDashed(name: string): string;
  /**
   * Return "{work}/lib/xeto/{name}" for source path of
   * "{work}/src/xeto/{name}".
   */
  static srcToLibDir(v: xeto.LibVersion): sys.File | null;
  /**
   * To floating point number
   */
  static toFloat(x: sys.JsObj | null): number | null;
  /**
   * Return if valid lib name
   */
  static isLibName(n: string): boolean;
  /**
   * Integer option
   */
  static optInt(opts: xeto.Dict | null, name: string, def: number): number;
  /**
   * Return if a is-a b
   */
  static isa(a: CSpec, b: CSpec, isTop?: boolean): boolean;
  /**
   * Return "{work}/lib/xeto/{name}/{name}-{version}.xetolib" for
   * source path of "{work}/src/xeto/{name}".
   */
  static srcToLibZip(v: xeto.LibVersion): sys.File | null;
  /**
   * Convert "foo.bar::Baz" to simple name "Baz" or null if no
   * "::"
   */
  static qnameToName(qname: sys.JsObj): string | null;
  /**
   * Return "{work}" for source path of "{work}/src/xeto/{name}".
   */
  static srcToWorkDir(v: xeto.LibVersion): sys.File | null;
}

/**
 * Writer for Xeto binary encoding of specs and data.
 * 
 * This encoding does not provide full fidelity with Xeto
 * model.  Most scalars are encoded as just a string.  However
 * it does support some types not supported by Haystack
 * fidelity level such as Int, Float, Buf.
 * 
 * NOTE: this encoding is not backward/forward compatible - it only
 * works with XetoBinaryReader of the same version; do not use
 * for persistent data
 */
export class XetoBinaryWriter extends sys.Obj implements XetoBinaryConst {
  static type$: sys.Type
  /**
   * Write boot message that can be serialized over the network
   * to call RemoteNamespace.boot as an overlay namespace
   */
  writeBootOverlay(ns: MNamespace): void;
  writeDict(d: xeto.Dict): void;
  write(byte: number): void;
  writeVal(val: sys.JsObj | null): void;
  writeList(list: sys.List<sys.JsObj | null>): void;
  writeVarInt(val: number): void;
  /**
   * Write boot message that can be serialized over the network
   * and then passed to RemoteNamespace.boot.  The bootLibs are
   * all the libs to synchronously load from the boot up front
   * (sys is always implicitly loaded)
   */
  writeBoot(ns: MNamespace, bootLibs?: sys.List<string> | null): void;
  writeF8(f: number): void;
  writeI4(i: number): void;
  writeI2(i: number): void;
  writeI8(i: number): void;
  writeUtf(s: string): void;
  writeRawDictList(dicts: sys.List<xeto.Dict>): void;
  writeLib(lib: XetoLib): void;
  writeGrid(grid: haystack.Grid): void;
  writeRawRefList(ids: sys.List<haystack.Ref>): void;
}

export class NotReadyErr extends sys.Err {
  static type$: sys.Type
  static make(msg?: string, ...args: unknown[]): NotReadyErr;
}

/**
 * Arguments for `ofs` meta
 */
export class MSpecArgsOfs extends MSpecArgs {
  static type$: sys.Type
  val(): sys.List<XetoSpec>;
  static make(val: sys.List<XetoSpec>, ...args: unknown[]): MSpecArgsOfs;
  ofs(checked: boolean): sys.List<XetoSpec> | null;
}

export class CompBinding extends DictBinding {
  static type$: sys.Type
  clone(spec: string, type: sys.Type): this;
  static make(spec: string, type: sys.Type, ...args: unknown[]): CompBinding;
}

/**
 * XetoSpec is the referential proxy for MSpec
 */
export class XetoSpec extends sys.Obj implements xeto.Spec, haystack.Dict, CSpec {
  static type$: sys.Type
  m(): MSpec | null;
  parent(): xeto.Spec | null;
  hasSlots(): boolean;
  lib(): xeto.Lib;
  isAst(): boolean;
  binding(): xeto.SpecBinding;
  type(): xeto.Spec;
  static makem(m: MSpec, ...args: unknown[]): XetoSpec;
  cbase(): CSpec | null;
  cmetaHas(name: string): boolean;
  qname(): string;
  cofs(): sys.List<XetoSpec> | null;
  cisa(x: CSpec): boolean;
  id(): haystack.Ref;
  has(n: string): boolean;
  trap(n: string, a?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  isOr(): boolean;
  isInterface(): boolean;
  toStr(): string;
  isDict(): boolean;
  slotOwn(n: string, c?: boolean): xeto.Spec | null;
  isNone(): boolean;
  isFunc(): boolean;
  isType(): boolean;
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  enum(): xeto.SpecEnum;
  flavor(): xeto.SpecFlavor;
  metaOwn(): xeto.Dict;
  isAnd(): boolean;
  slots(): xeto.SpecSlots;
  ctype(): CSpec;
  meta(): xeto.Dict;
  name(): string;
  _id(): haystack.Ref;
  isScalar(): boolean;
  isMarker(): boolean;
  isSys(): boolean;
  isSelf(): boolean;
  loc(): util.FileLoc;
  cslots(f: ((arg0: CSpec, arg1: string) => void)): void;
  cenum(key: string, checked?: boolean): CSpec | null;
  isMaybe(): boolean;
  flags(): number;
  cslot(n: string, c?: boolean): CSpec | null;
  slot(n: string, c?: boolean): xeto.Spec | null;
  isMultiRef(): boolean;
  isList(): boolean;
  cmeta(): MNameDict;
  get(n: string, d?: sys.JsObj | null): sys.JsObj | null;
  of(checked?: boolean): xeto.Spec | null;
  missing(n: string): boolean;
  slotsOwn(): xeto.SpecSlots;
  static make(...args: unknown[]): XetoSpec;
  isSlot(): boolean;
  isChoice(): boolean;
  cslotsWhile(f: ((arg0: CSpec, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
  isEmpty(): boolean;
  isQuery(): boolean;
  isEnum(): boolean;
  isMeta(): boolean;
  fantomType(): sys.Type;
  args(): MSpecArgs;
  isRef(): boolean;
  isa(x: xeto.Spec): boolean;
  isGlobal(): boolean;
  isComp(): boolean;
  asm(): XetoSpec;
  cof(): XetoSpec | null;
  eachWhile(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
  ofs(checked?: boolean): sys.List<xeto.Spec> | null;
  cparent(): CSpec | null;
  base(): xeto.Spec | null;
  /**
   * Create a new instance of this dict with the same names, but
   * apply the specified closure to generate new values.
   */
  map(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj)): this;
  /**
   * Get display string for dict or the given tag.  If `name` is
   * null, then return display text for the entire dict using [Etc.dictToDis](Etc.dictToDis).
   * If `name` is non-null then format the tag value using its
   * appropiate `toLocale` method.  If `name` is not defined by this
   * dict, then return `def`.
   */
  dis(name?: string | null, def?: string | null): string | null;
  /**
   * Does this spec directly inherits from And/Or and define `ofs`
   */
  isCompound(): boolean;
}

/**
 * Reader for Xeto binary encoding of specs and data
 * 
 * NOTE: this encoding is not backward/forward compatible - it only
 * works with XetoBinaryReader of the same version; do not use
 * for persistent data
 */
export class XetoBinaryReader extends sys.Obj implements XetoBinaryConst, xeto.NameDictReader {
  static type$: sys.Type
  readName(): number;
  readS8(): number;
  readDict(): haystack.Dict;
  readVarInt(): number;
  readUtf(): string;
  readLib(ns: MNamespace): XetoLib;
  readF8(): number;
  readRawDictList(): sys.List<haystack.Dict>;
  read(): number;
  readRawRefList(): sys.List<haystack.Ref>;
  readVal(): sys.JsObj | null;
  readU4(): number;
}

/**
 * MNameDict is used to wrap a NameDict so it can be a
 * haystack::Dict. Eventually once we get rid of haystack::Dict
 * this class can go away.
 */
export class MNameDict extends sys.Obj implements haystack.Dict {
  static type$: sys.Type
  static empty(): MNameDict;
  wrapped(): xeto.NameDict;
  get(n: string, def?: sys.JsObj | null): sys.JsObj | null;
  missing(n: string): boolean;
  has(n: string): boolean;
  trap(n: string, a?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  isEmpty(): boolean;
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  static wrap(wrapped: xeto.NameDict, ...args: unknown[]): MNameDict;
  eachWhile(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
  /**
   * Return string for debugging only
   */
  toStr(): string;
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
   * Get the `id` tag as a Ref or raise CastErr/UnknownNameErr
   */
  id(): haystack.Ref;
  /**
   * Create a new instance of this dict with the same names, but
   * apply the specified closure to generate new values.
   */
  map(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj)): this;
}

/**
 * Validation for values against a spec type and meta
 */
export class CheckVal extends sys.Obj {
  static type$: sys.Type
  fidelity(): XetoFidelity;
  opts(): xeto.Dict;
  /**
   * Coerce value to integer
   */
  static toInt(v: sys.JsObj | null): number | null;
  /**
   * Given a meta key and value, determine if we should report
   * error using the slot or the type based on who defines the
   * meta key
   */
  static errTypeForMeta(spec: CSpec, key: string, val: sys.JsObj): string;
  check(spec: CSpec, x: sys.JsObj, onErr: ((arg0: string) => void)): void;
  static make(opts: xeto.Dict, ...args: unknown[]): CheckVal;
}

/**
 * Registry of mapping between Xeto specs and Fantom types for
 * the VM
 */
export class SpecBindings extends sys.Obj {
  static type$: sys.Type
  /**
   * Dict fallback
   */
  dict(): DictBinding;
  /**
   * Current bindings for the VM
   */
  static cur(): SpecBindings;
  /**
   * Return if we need to call load for given library name
   */
  needsLoad(libName: string, version: sys.Version): boolean;
  /**
   * Load bindings for given library
   */
  load(libName: string, version: sys.Version): SpecBindingLoader;
  /**
   * Constructor
   */
  static make(...args: unknown[]): SpecBindings;
  /**
   * Add new spec binding
   */
  add(b: xeto.SpecBinding): xeto.SpecBinding;
  /**
   * Lookup a binding for a type and if found attempt to resolve
   * to spec
   */
  forTypeToSpec(ns: xeto.LibNamespace, type: sys.Type): xeto.Spec | null;
  /**
   * List all bindings installed
   */
  list(): sys.List<xeto.SpecBinding>;
  /**
   * Lookup a binding for a spec qname
   */
  forSpec(qname: string): xeto.SpecBinding | null;
  /**
   * Lookup a binding for a type
   */
  forType(type: sys.Type): xeto.SpecBinding | null;
}

/**
 * Exporter
 */
export class Exporter extends sys.Obj {
  static type$: sys.Type
  ns(): MNamespace;
  specRef(): haystack.Ref;
  indentation(): number;
  indentation(it: number): void;
  opts(): haystack.Dict;
  isEffective(): boolean;
  /**
   * Export one instance
   */
  instance(instance: haystack.Dict): this;
  /**
   * Export one library and all its specs and instances
   */
  lib(lib: xeto.Lib): this;
  indent(): this;
  wc(char: number): this;
  /**
   * Export one spec
   */
  spec(spec: xeto.Spec): this;
  flush(): this;
  /**
   * End export
   */
  end(): this;
  static make(ns: MNamespace, out: sys.OutStream, opts: haystack.Dict, ...args: unknown[]): Exporter;
  sp(): this;
  /**
   * Start export
   */
  start(): this;
  w(obj: sys.JsObj): this;
  nl(): this;
}

/**
 * DependSolver impplements LibRepo.solveDepends.  A proper
 * solver can be very expensive, so this is implementation just
 * tries to select against latest matching version for each
 * dependency and if it doesn't work then it gives up.
 */
export class DependSolver extends sys.Obj {
  static type$: sys.Type
  repo(): xeto.LibRepo;
  solve(): sys.List<xeto.LibVersion>;
  static make(repo: xeto.LibRepo, targets: sys.List<xeto.LibDepend>, ...args: unknown[]): DependSolver;
}

/**
 * Implementation of SpecEnum
 */
export class MEnum extends sys.Obj implements xeto.SpecEnum {
  static type$: sys.Type
  defKey(): string;
  map(): sys.Map<string, xeto.Spec>;
  static init(enum$: MType): MEnum;
  keys(): sys.List<string>;
  spec(key: string, checked?: boolean): xeto.Spec | null;
  each(f: ((arg0: xeto.Spec, arg1: string) => void)): void;
  xmeta(key?: string | null, checked?: boolean): xeto.Dict | null;
}

/**
 * PodBindingLoader
 */
export class PodBindingLoader extends SpecBindingLoader {
  static type$: sys.Type
  pod(): sys.Pod;
  loadSpec(acc: SpecBindings, spec: CSpec): xeto.SpecBinding | null;
  static make(pod: sys.Pod, ...args: unknown[]): PodBindingLoader;
}

/**
 * XetoBinaryIO manages the factory to create binary
 * reader/writers. When a client is first booted, we loaded the
 * whole name table from the server. But from that point
 * onwards the server cannot use any name code added after boot
 * since the client won't have it cached.
 */
export class XetoBinaryIO extends sys.Obj {
  static type$: sys.Type
  /**
   * Shared name table up to maxNameCode
   */
  names(): xeto.NameTable;
  /**
   * Max name code (inclusive) that safe to use
   */
  maxNameCode(): number;
  /**
   * Create a new reader
   */
  reader(in$: sys.InStream): XetoBinaryReader;
  /**
   * Create a new writer
   */
  writer(out: sys.OutStream): XetoBinaryWriter;
  /**
   * Constructor to wrap given local namespace
   */
  static makeServer(ns: MNamespace, maxNameCode?: number, ...args: unknown[]): XetoBinaryIO;
}

/**
 * CompSpaceActor is used to encapsulate a CompSpace and
 * provide a thread safe API to execute, observe, and edit the
 * component tree. To use:
 * 1. Call init with the ComponentSpace type and ctor args
 * 2. Call load with the Xeto string
 * 3. Call checkTimers periodically
 */
export class CompSpaceActor extends concurrent.Actor {
  static type$: sys.Type
  /**
   * BlockView feed subscribe; return Grid
   */
  feedSubscribe(cookie: string, gridMeta: haystack.Dict): concurrent.Future;
  /**
   * BlockView feed call; return null
   */
  feedCall(req: haystack.Dict): concurrent.Future;
  /**
   * Initialize the CompSpace using given subtype and make args
   * Future evaluates to this.
   */
  init(csType: sys.Type, args: sys.List<sys.JsObj | null>): concurrent.Future;
  /**
   * Call {@link CompSpace.execute | CompSpace.execute}
   */
  execute(now?: sys.DateTime): concurrent.Future;
  /**
   * Namespace for the CompSpace - must have called init
   */
  ns(): xeto.LibNamespace;
  /**
   * Save to Xeto string
   */
  save(): concurrent.Future;
  /**
   * Load the CompSpace with the given Xeto string. Future
   * evaluates to this.
   */
  load($xeto: string): concurrent.Future;
  /**
   * Constructor
   */
  static make(pool: concurrent.ActorPool, ...args: unknown[]): CompSpaceActor;
  /**
   * Dispatch message
   */
  receive(msgObj: sys.JsObj | null): sys.JsObj | null;
  /**
   * BlockView feed unsubscribe; return null
   */
  feedUnsubscribe(cookie: string): concurrent.Future;
  /**
   * BlockView feed poll; return Grid or null
   */
  feedPoll(cookie: string): concurrent.Future;
}

/**
 * Implementation of Lib wrapped by XetoLib
 */
export class MLib extends sys.Obj {
  static type$: sys.Type
  id(): xeto.Ref;
  depends(): sys.List<xeto.LibDepend>;
  version(): sys.Version;
  nameCode(): number;
  meta(): MNameDict;
  name(): string;
  files(): MLibFiles;
  isSys(): boolean;
  loc(): util.FileLoc;
  specsMap(): sys.Map<string, xeto.Spec>;
  flags(): number;
  static libSpecRef(): xeto.Ref;
  instancesMap(): sys.Map<string, xeto.Dict>;
  instance(name: string, checked?: boolean): xeto.Dict | null;
  globals(): sys.List<xeto.Spec>;
  metaSpecs(): sys.List<xeto.Spec>;
  type(name: string, checked?: boolean): xeto.Spec | null;
  spec(name: string, checked?: boolean): xeto.Spec | null;
  specs(): sys.List<xeto.Spec>;
  has(name: string): boolean;
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  toStr(): string;
  hasFlag(flag: number): boolean;
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  metaSpec(name: string, checked?: boolean): xeto.Spec | null;
  instances(): sys.List<xeto.Dict>;
  global(name: string, checked?: boolean): xeto.Spec | null;
  eachInstance(f: ((arg0: xeto.Dict) => void)): void;
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  missing(name: string): boolean;
  static make(loc: util.FileLoc, nameCode: number, name: string, meta: MNameDict, flags: number, version: sys.Version, depends: sys.List<MLibDepend>, specsMap: sys.Map<string, xeto.Spec>, instancesMap: sys.Map<string, xeto.Dict>, files: MLibFiles, ...args: unknown[]): MLib;
  types(): sys.List<xeto.Spec>;
  eachWhile(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
}

/**
 * Remote namespace that loads libs over a network transport
 * layer. Create a new remote env via [XetoBinaryReader.readBoot](XetoBinaryReader.readBoot).
 */
export class RemoteNamespace extends MNamespace {
  static type$: sys.Type
  io(): XetoBinaryIO;
  __io(it: XetoBinaryIO): void;
  libLoader(): RemoteLibLoader | null;
  __libLoader(it: RemoteLibLoader | null): void;
  compileData(src: string, opts?: xeto.Dict | null): sys.JsObj | null;
  doLoadAsync(v: xeto.LibVersion, f: ((arg0: sys.Err | null, arg1: sys.JsObj | null) => void)): void;
  compileLib(src: string, opts?: xeto.Dict | null): xeto.Lib;
  /**
   * Boot a RemoteEnv from the given boot message input stream
   */
  static boot(in$: sys.InStream, base: MNamespace | null, libLoader: RemoteLibLoader | null): RemoteNamespace;
  isRemote(): boolean;
  doLoadSync(v: xeto.LibVersion): XetoLib;
}

/**
 * Implementation of top-level global slot spec
 */
export class MGlobal extends MSpec {
  static type$: sys.Type
  lib(): XetoLib;
  qname(): string;
  id(): haystack.Ref;
  static make(loc: util.FileLoc, lib: XetoLib, qname: string, nameCode: number, name: string, base: XetoSpec | null, self$: XetoSpec, meta: MNameDict, metaOwn: MNameDict, slots: MSlots, slotsOwn: MSlots, flags: number, args: MSpecArgs, ...args: unknown[]): MGlobal;
  toStr(): string;
  flavor(): xeto.SpecFlavor;
}

/**
 * GridExporter turns xeto data into Haystack grid then uses
 * one of the standard haystack formats for export.
 */
export class GridExporter extends Exporter {
  static type$: sys.Type
  instance(instance: haystack.Dict): this;
  lib(lib: xeto.Lib): this;
  spec(spec: xeto.Spec): this;
  toGrid(): haystack.Grid;
  end(): this;
  static make(ns: MNamespace, out: sys.OutStream, opts: haystack.Dict, filetype: haystack.Filetype, ...args: unknown[]): GridExporter;
  start(): this;
}

export class ImplDictBinding extends DictBinding {
  static type$: sys.Type
  impl(): sys.Type;
  decodeDict($xeto: xeto.Dict): xeto.Dict;
  static make(spec: string, type: sys.Type, ...args: unknown[]): ImplDictBinding;
}

/**
 * JSON Exporter
 */
export class JsonExporter extends Exporter {
  static type$: sys.Type
  instance(instance: haystack.Dict): this;
  lib(lib: xeto.Lib): this;
  spec(spec: xeto.Spec): this;
  end(): this;
  static make(ns: MNamespace, out: sys.OutStream, opts: haystack.Dict, ...args: unknown[]): JsonExporter;
  start(): this;
}

/**
 * XetoWrapperLog
 */
export class XetoWrapperLog extends XetoLog {
  static type$: sys.Type
  wrap(): sys.Log;
  log(level: sys.LogLevel, id: xeto.Ref | null, msg: string, loc: util.FileLoc, err: sys.Err | null): void;
  static make(wrap: sys.Log, ...args: unknown[]): XetoWrapperLog;
}

/**
 * PrinterTheme
 */
export class PrinterTheme extends sys.Obj {
  static type$: sys.Type
  static yellow(): string;
  static __yellow(it: string): void;
  static none(): PrinterTheme;
  static __none(it: PrinterTheme): void;
  static cyan(): string;
  static __cyan(it: string): void;
  static red(): string;
  static __red(it: string): void;
  static configuredRef(): concurrent.AtomicRef;
  static __configuredRef(it: concurrent.AtomicRef): void;
  static white(): string;
  static __white(it: string): void;
  bracket(): string | null;
  __bracket(it: string | null): void;
  static green(): string;
  static __green(it: string): void;
  static black(): string;
  static __black(it: string): void;
  str(): string | null;
  __str(it: string | null): void;
  warn(): string | null;
  __warn(it: string | null): void;
  static blue(): string;
  static __blue(it: string): void;
  static reset(): string;
  static __reset(it: string): void;
  static purple(): string;
  static __purple(it: string): void;
  comment(): string | null;
  __comment(it: string | null): void;
  static make(f: ((arg0: PrinterTheme) => void), ...args: unknown[]): PrinterTheme;
  static configured(): PrinterTheme;
}

/**
 * XetoLib is the referential proxy for MLib
 */
export class XetoLib extends sys.Obj implements xeto.Lib, haystack.Dict {
  static type$: sys.Type
  m(): MLib | null;
  loc(): util.FileLoc;
  instance(name: string, checked?: boolean): xeto.Dict | null;
  metaSpec(name: string, checked?: boolean): xeto.Spec | null;
  instances(): sys.List<xeto.Dict>;
  globals(): sys.List<xeto.Spec>;
  global(name: string, checked?: boolean): xeto.Spec | null;
  metaSpecs(): sys.List<xeto.Spec>;
  type(name: string, checked?: boolean): xeto.Spec | null;
  spec(name: string, checked?: boolean): xeto.Spec | null;
  specs(): sys.List<xeto.Spec>;
  hasXMeta(): boolean;
  eachInstance(f: ((arg0: xeto.Dict) => void)): void;
  get(n: string, d?: sys.JsObj | null): sys.JsObj | null;
  missing(n: string): boolean;
  id(): haystack.Ref;
  has(n: string): boolean;
  trap(n: string, a?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  static make(...args: unknown[]): XetoLib;
  toStr(): string;
  types(): sys.List<xeto.Spec>;
  depends(): sys.List<xeto.LibDepend>;
  hasMarkdown(): boolean;
  isEmpty(): boolean;
  version(): sys.Version;
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  meta(): xeto.Dict;
  name(): string;
  files(): xeto.LibFiles;
  _id(): haystack.Ref;
  eachWhile(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
  isSys(): boolean;
  /**
   * Create a new instance of this dict with the same names, but
   * apply the specified closure to generate new values.
   */
  map(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj)): this;
  /**
   * Get display string for dict or the given tag.  If `name` is
   * null, then return display text for the entire dict using [Etc.dictToDis](Etc.dictToDis).
   * If `name` is non-null then format the tag value using its
   * appropiate `toLocale` method.  If `name` is not defined by this
   * dict, then return `def`.
   */
  dis(name?: string | null, def?: string | null): string | null;
}

/**
 * Data fidelity and type erasure level
 */
export class XetoFidelity extends sys.Enum {
  static type$: sys.Type
  /**
   * List of XetoFidelity values indexed by ordinal
   */
  static vals(): sys.List<XetoFidelity>;
  static haystack(): XetoFidelity;
  static json(): XetoFidelity;
  static full(): XetoFidelity;
  /**
   * Coerce value to the proper level of data fidelity
   */
  coerce(x: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return the XetoFidelity instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): XetoFidelity;
}

/**
 * EmptyLibFiles
 */
export class EmptyLibFiles extends MLibFiles {
  static type$: sys.Type
  static val(): EmptyLibFiles;
  read(uri: sys.Uri, f: ((arg0: sys.Err | null, arg1: sys.InStream | null) => void)): void;
  isSupported(): boolean;
  list(): sys.List<sys.Uri>;
}

/**
 * CNamespace is common API shared by MLibnamespace and
 * XetoCompiler
 */
export abstract class CNamespace extends sys.Obj {
  static type$: sys.Type
  /**
   * Iterate each subtype of given type that returns true for `isa(type)`
   */
  eachSubtype(type: CSpec, f: ((arg0: CSpec) => void)): void;
}

/**
 * XetoOutStreamLog
 */
export class XetoOutStreamLog extends XetoLog {
  static type$: sys.Type
  log(level: sys.LogLevel, id: xeto.Ref | null, msg: string, loc: util.FileLoc, err: sys.Err | null): void;
  static make(out: sys.OutStream, ...args: unknown[]): XetoOutStreamLog;
}

export class MSpecFlags extends sys.Obj {
  static type$: sys.Type
  static maybe(): number;
  static none(): number;
  static interface(): number;
  static ref(): number;
  static and(): number;
  static dict(): number;
  static comp(): number;
  static multiRef(): number;
  static or(): number;
  static query(): number;
  static list(): number;
  static enum(): number;
  static scalar(): number;
  static func(): number;
  static marker(): number;
  static self(): number;
  static choice(): number;
  static inheritMask(): number;
  static flagsToStr(flags: number): string;
  static make(...args: unknown[]): MSpecFlags;
}

/**
 * CNode
 */
export abstract class CNode extends sys.Obj {
  static type$: sys.Type
  /**
   * Required for covariant conflict so that signature matches
   * ANode
   */
  asm(): sys.JsObj;
  /**
   * Qualified name as Ref
   */
  id(): haystack.Ref;
}

/**
 * PrinterSpecMode
 */
export class PrinterSpecMode extends sys.Enum {
  static type$: sys.Type
  static auto(): PrinterSpecMode;
  /**
   * List of PrinterSpecMode values indexed by ordinal
   */
  static vals(): sys.List<PrinterSpecMode>;
  static own(): PrinterSpecMode;
  static effective(): PrinterSpecMode;
  static qname(): PrinterSpecMode;
  /**
   * Return the PrinterSpecMode instance for the specified name. 
   * If not a valid name and checked is false return null,
   * otherwise throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): PrinterSpecMode;
}

/**
 * UnsupportedLibFiles
 */
export class UnsupportedLibFiles extends MLibFiles {
  static type$: sys.Type
  static val(): UnsupportedLibFiles;
  read(uri: sys.Uri, f: ((arg0: sys.Err | null, arg1: sys.InStream | null) => void)): void;
  isSupported(): boolean;
  list(): sys.List<sys.Uri>;
}

/**
 * Implementation of top-level type spec
 */
export class MType extends MSpec {
  static type$: sys.Type
  lib(): XetoLib;
  binding(): xeto.SpecBinding;
  qname(): string;
  id(): haystack.Ref;
  static make(loc: util.FileLoc, lib: XetoLib, qname: string, nameCode: number, name: string, base: XetoSpec | null, self$: XetoSpec, meta: MNameDict, metaOwn: MNameDict, slots: MSlots, slotsOwn: MSlots, flags: number, args: MSpecArgs, binding: xeto.SpecBinding, ...args: unknown[]): MType;
  toStr(): string;
  enum(): MEnum;
  flavor(): xeto.SpecFlavor;
}

/**
 * CSpec is common API shared by both ASpec, RSpec, and
 * XetoSpec
 */
export abstract class CSpec extends sys.Obj implements CNode {
  static type$: sys.Type
  /**
   * Is there one or more effective slots
   */
  hasSlots(): boolean;
  /**
   * Return if this an AST ASpec
   */
  isAst(): boolean;
  /**
   * Binding for spec type
   */
  binding(): xeto.SpecBinding;
  /**
   * Does this spec directly inherits from And/Or and define `ofs`
   */
  isCompound(): boolean;
  /**
   * Base spec or null if this sys::Obj itself
   */
  cbase(): CSpec | null;
  /**
   * Return if effective meta has given slot name
   */
  cmetaHas(name: string): boolean;
  /**
   * Qualified name
   */
  qname(): string;
  /**
   * Return list of component specs for a compound type
   */
  cofs(): sys.List<CSpec> | null;
  /**
   * Return if spec inherits from that from a nominal type
   * perspective. This is the same behavior as Spec.isa, just
   * using CSpec (XetoSpec or AST)
   */
  cisa(that: CSpec): boolean;
  /**
   * Ref for qualified name
   */
  id(): haystack.Ref;
  /**
   * Is base `sys::Or`
   */
  isOr(): boolean;
  /**
   * Inherits from `sys::Interface` without considering And/Or
   */
  isInterface(): boolean;
  /**
   * Inherits from `sys::Dict` without considering And/Or
   */
  isDict(): boolean;
  /**
   * Is this the sys::None spec
   */
  isNone(): boolean;
  /**
   * Inherits from `sys::Func` without considering And/Or
   */
  isFunc(): boolean;
  /**
   * Flavor: type, global, meta, slot
   */
  flavor(): xeto.SpecFlavor;
  /**
   * Is base `sys::And`
   */
  isAnd(): boolean;
  /**
   * Type of the spec or if this a type then return self
   */
  ctype(): CSpec;
  /**
   * Simple name
   */
  name(): string;
  /**
   * Inherits from `sys::Scalar` without considering And/Or
   */
  isScalar(): boolean;
  /**
   * Inherits from `sys::Marker` without considering And/Or
   */
  isMarker(): boolean;
  /**
   * Is this spec in the `sys` library
   */
  isSys(): boolean;
  /**
   * Is this the sys::Self spec
   */
  isSelf(): boolean;
  /**
   * Iterate the effective slots as map
   */
  cslots(f: ((arg0: CSpec, arg1: string) => void)): void;
  /**
   * Lookup enum item by its key - raise exception if not enum
   * type
   */
  cenum(key: string, checked?: boolean): CSpec | null;
  /**
   * Lookup effective slot
   */
  cslot(name: string, checked?: boolean): CSpec | null;
  /**
   * MSpecFlags bitmask flags
   */
  flags(): number;
  /**
   * Is maybe flag set
   */
  isMaybe(): boolean;
  /**
   * Inherits from `sys::MultiRef` without considering And/Or
   */
  isMultiRef(): boolean;
  /**
   * Inherits from `sys::List` without considering And/Or
   */
  isList(): boolean;
  /**
   * Effective meta
   */
  cmeta(): MNameDict;
  /**
   * Inherits from `sys::Choice` without considering And/Or
   */
  isChoice(): boolean;
  /**
   * Iterate the effective slots as map
   */
  cslotsWhile(f: ((arg0: CSpec, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
  /**
   * Is the base `sys::Enum`
   */
  isEnum(): boolean;
  /**
   * Inherits from `sys::Query` without considering And/Or
   */
  isQuery(): boolean;
  /**
   * MSpecArgs
   */
  args(): MSpecArgs;
  /**
   * Inherits from `sys::Ref` without considering And/Or
   */
  isRef(): boolean;
  /**
   * Inherits from `sys.comp::Comp` without considering And/Or
   */
  isComp(): boolean;
  /**
   * Assembled XetoSpec (stub only in AST until Assemble step)
   */
  asm(): XetoSpec;
  /**
   * Return item for seq/ref
   */
  cof(): CSpec | null;
  /**
   * Parent spec which contains this spec definition and scopes {@link name | name}.
   * Returns null for top level specs in the library.
   */
  cparent(): CSpec | null;
}

/**
 * MLibFlags
 */
export class MLibFlags extends sys.Obj {
  static type$: sys.Type
  static hasMarkdown(): number;
  static hasXMeta(): number;
  static flagsToStr(flags: number): string;
  static make(...args: unknown[]): MLibFlags;
}

/**
 * Implementation of top-level meta spec
 */
export class MMetaSpec extends MSpec {
  static type$: sys.Type
  lib(): XetoLib;
  qname(): string;
  id(): haystack.Ref;
  static make(loc: util.FileLoc, lib: XetoLib, qname: string, nameCode: number, name: string, base: XetoSpec | null, self$: XetoSpec, meta: MNameDict, metaOwn: MNameDict, slots: MSlots, slotsOwn: MSlots, flags: number, args: MSpecArgs, ...args: unknown[]): MMetaSpec;
  toStr(): string;
  flavor(): xeto.SpecFlavor;
}

/**
 * CompSpace manages a tree of components.  It is the base
 * class for different component applications for control, Ion
 * UI, and remote programming
 */
export class CompSpace extends sys.Obj implements xeto.AbstractCompSpace {
  static type$: sys.Type
  /**
   * Callback when component is mounted into tree
   */
  onMount(c: xeto.Comp): void;
  /**
   * Callback when component is unmounted from tree
   */
  onUnmount(c: xeto.Comp): void;
  /**
   * Callback for subclasses on start
   */
  onStart(): void;
  /**
   * Create new component instance from dict state. The dict must
   * have a Comp spec tag.
   */
  create(dict: haystack.Dict): xeto.Comp;
  /**
   * Callback for subclasses on stop
   */
  onStop(): void;
  /**
   * Current version of component changes
   */
  ver(): number;
  /**
   * Callback anytime a component in the space is modified. The
   * name and value are the slot modified, or null for a remove.
   */
  onChange(comp: xeto.Comp, name: string, val: sys.JsObj | null): void;
  /**
   * Create new list of component instances from dict state. Each
   * dict must have a Comp spec tag.
   */
  createAll(dicts: sys.List<haystack.Dict>): sys.List<xeto.Comp>;
  /**
   * This method should be called at periodically to execute
   * components and check timers.  The frequency this method is
   * called determines the smallest timer increment.  For example
   * if its called every 100ms then timers will only fire as fast
   * as 100ms.
   */
  execute(now?: sys.DateTime): void;
  /**
   * Iterate every component in space
   */
  each(f: ((arg0: xeto.Comp) => void)): void;
  /**
   * Check that the xeto can be loaded or raise exception
   */
  checkLoad($xeto: string): this;
  /**
   * Stop space.  Sublasses must cease to call checkTimers
   */
  stop(): void;
  /**
   * Xeto namespace for this space
   */
  ns(): xeto.LibNamespace;
  /**
   * Save tree to eto instances
   */
  save(): string;
  /**
   * Read by id
   */
  readById(id: haystack.Ref, checked?: boolean): xeto.Comp | null;
  /**
   * Convenience to create new default component instance from
   * spec.
   */
  createSpec(spec: xeto.Spec): xeto.Comp;
  /**
   * Load tree from xeto instances
   */
  load($xeto: string): this;
  /**
   * Has this space been started, but not stopped yet
   */
  isRunning(): boolean;
  /**
   * Root component
   */
  root(): xeto.Comp;
  /**
   * Constructor
   */
  static make(ns: xeto.LibNamespace, ...args: unknown[]): CompSpace;
  /**
   * Initialize server provider interface for given instance
   */
  initSpi(c: xeto.CompObj, spec: xeto.Spec | null): xeto.CompSpi;
  /**
   * Log error
   */
  err(msg: string, err?: sys.Err | null): void;
  /**
   * Start space.  Sublasses must begin to call checkTimers
   */
  start(): void;
  /**
   * Modify the namespace on the fly.  Every component in the
   * current tree must map to a spec in the new namespace or
   * exception is raised.  This update does not check that
   * components validate against the new specs.
   */
  updateNamespace(ns: xeto.LibNamespace): void;
  /**
   * Initialize the root - this must be called exactly once
   * during initialization
   */
  initRoot(f: ((arg0: this) => xeto.Comp)): this;
}

/**
 * Sys library constants
 */
export class MSys extends sys.Obj {
  static type$: sys.Type
  date(): XetoSpec;
  dateTime(): XetoSpec;
  lib(): XetoSpec;
  bool(): XetoSpec;
  none(): XetoSpec;
  spec(): XetoSpec;
  duration(): XetoSpec;
  number(): XetoSpec;
  ref(): XetoSpec;
  and(): XetoSpec;
  dict(): XetoSpec;
  seq(): XetoSpec;
  or(): XetoSpec;
  query(): XetoSpec;
  list(): XetoSpec;
  uri(): XetoSpec;
  int(): XetoSpec;
  enum(): XetoSpec;
  str(): XetoSpec;
  scalar(): XetoSpec;
  func(): XetoSpec;
  obj(): XetoSpec;
  grid(): XetoSpec;
  marker(): XetoSpec;
  self(): XetoSpec;
  time(): XetoSpec;
  static make(lib: XetoLib, ...args: unknown[]): MSys;
}

/**
 * XetoCallbackLog
 */
export class XetoCallbackLog extends XetoLog {
  static type$: sys.Type
  log(level: sys.LogLevel, id: xeto.Ref | null, msg: string, loc: util.FileLoc, err: sys.Err | null): void;
  static make(cb: ((arg0: xeto.XetoLogRec) => void), ...args: unknown[]): XetoCallbackLog;
}

/**
 * Implementation of LibFiles
 */
export class MLibFiles extends sys.Obj implements xeto.LibFiles {
  static type$: sys.Type
  readBuf(uri: sys.Uri): sys.Buf;
  static make(...args: unknown[]): MLibFiles;
  readStr(uri: sys.Uri): string;
  /**
   * Look up a resource file in this library and read via
   * callback function.  The URI must be path absolute.
   */
  read(uri: sys.Uri, f: ((arg0: sys.Err | null, arg1: sys.InStream | null) => void)): void;
  /**
   * Return if this API is supported, will be false in browser
   * environments.
   */
  isSupported(): boolean;
  /**
   * List resource files in this library.
   */
  list(): sys.List<sys.Uri>;
}

/**
 * Xeto binary constants
 */
export abstract class XetoBinaryConst extends sys.Obj {
  static type$: sys.Type
  static magic(): number;
  static ctrlTypedDict(): number;
  static ctrlNameDict(): number;
  static specInherited(): number;
  static ctrlTrue(): number;
  static ctrlName(): number;
  static ctrlNull(): number;
  static ctrlNumberUnit(): number;
  static ctrlDuration(): number;
  static ctrlFalse(): number;
  static ctrlNumberNoUnit(): number;
  static ctrlGenericScalar(): number;
  static ctrlInt2(): number;
  static ctrlList(): number;
  static version(): number;
  static magicLibVer(): number;
  static ctrlRemove(): number;
  static ctrlInt8(): number;
  static ctrlVersion(): number;
  static ctrlStr(): number;
  static ctrlDate(): number;
  static ctrlDateTime(): number;
  static magicEnd(): number;
  static ctrlEmptyDict(): number;
  static ctrlMarker(): number;
  static magicOverlay(): number;
  static magicLib(): number;
  static ctrlFloat8(): number;
  static ctrlTime(): number;
  static ctrlGenericDict(): number;
  static ctrlGrid(): number;
  static specOwnOnly(): number;
  static ctrlTypedScalar(): number;
  static ctrlNA(): number;
  static ctrlRef(): number;
  static ctrlSpan(): number;
  static ctrlSpecRef(): number;
  static magicLibEnd(): number;
  static ctrlUri(): number;
  static ctrlBuf(): number;
  static ctrlCoord(): number;
}

/**
 * CompSpi implementation
 */
export class MCompSpi extends sys.Obj implements xeto.CompSpi {
  static type$: sys.Type
  id(): haystack.Ref;
  comp(): xeto.Comp;
  comp(it: xeto.Comp): void;
  ver(): number;
  ver(it: number): void;
  cs(): CompSpace;
  cs(it: CompSpace): void;
  onCallRemove(name: string, cb: Function): void;
  parent(): xeto.Comp | null;
  static checkName(name: string): void;
  spec(): xeto.Spec;
  dis(): string;
  links(): xeto.Links;
  has(name: string): boolean;
  static isValidSlotVal(slot: xeto.Spec, val: sys.JsObj, valSpec: xeto.Spec): boolean;
  toStr(): string;
  add(val: sys.JsObj, name: string | null): void;
  onChange(name: string, cb: ((arg0: xeto.Comp, arg1: sys.JsObj | null) => void)): void;
  eachChild(f: ((arg0: xeto.Comp, arg1: string) => void)): void;
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  name(): string;
  child(name: string, checked: boolean): xeto.Comp | null;
  callAsync(name: string, arg: sys.JsObj | null, cb: ((arg0: sys.Err | null, arg1: sys.JsObj | null) => void)): void;
  onCall(name: string, cb: ((arg0: xeto.Comp, arg1: sys.JsObj | null) => void)): void;
  remove(name: string): void;
  get(name: string): sys.JsObj | null;
  missing(name: string): boolean;
  isBelow(parent: xeto.Comp): boolean;
  dump(con: util.Console, opts: sys.JsObj | null): void;
  static make(cs: CompSpace, comp: xeto.CompObj, spec: xeto.Spec, slots: sys.Map<string, sys.JsObj>, ...args: unknown[]): MCompSpi;
  set(name: string, val: sys.JsObj | null): void;
  onChangeRemove(name: string, cb: Function): void;
  isMounted(): boolean;
  call(name: string, arg: sys.JsObj | null): sys.JsObj | null;
  hasChild(name: string): boolean;
  eachWhile(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
  isAbove(child: xeto.Comp): boolean;
}

/**
 * Pretty printer
 */
export class Printer extends sys.Obj {
  static type$: sys.Type
  opts(): xeto.Dict;
  height(): number;
  showdoc(): boolean;
  specMode(): PrinterSpecMode;
  escUnicode(): boolean;
  ns(): MNamespace;
  theme(): PrinterTheme;
  isStdout(): boolean;
  width(): number;
  /**
   * Print data spec using current mode
   */
  lib(lib: xeto.Lib): this;
  terminalHeight(): number;
  /**
   * Print dict pairs without brackets
   */
  pairs(dict: xeto.Dict, skip?: sys.List<string> | null): this;
  /**
   * Pretty print instance data in Xeto text format
   */
  xeto(x: sys.JsObj, topIds?: boolean): this;
  /**
   * Print quoted string in theme color
   */
  quoted(str: string, quote?: string): this;
  /**
   * Print ref
   */
  ref(ref: haystack.Ref): this;
  qname(spec: xeto.Spec): this;
  /**
   * Print bracket such as "{}" in theme color
   */
  bracket(symbol: string): this;
  /**
   * Print dict
   */
  dict(dict: xeto.Dict): this;
  /**
   * Print inline value
   */
  val(val: sys.JsObj | null): this;
  optSpecMode(): PrinterSpecMode;
  /**
   * Print list
   */
  list(list: sys.List<sys.JsObj | null>): this;
  /**
   * Print in warning theme color
   */
  warn(str: string): this;
  opt(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  nl(): this;
  /**
   * Enter color section which should be constant from
   * PrinterTheme
   */
  color(color: string | null): this;
  indent(): this;
  optBool(name: string, def: boolean): boolean;
  wc(char: number): this;
  terminalWidth(): number;
  /**
   * Print data spec using current mode
   */
  specTop(spec: xeto.Spec): this;
  flush(): this;
  /**
   * Pretty print instance data in Xeto text format
   */
  xetoTop(x: sys.JsObj): this;
  /**
   * Pretty print haystack data as JSON
   */
  json(val: sys.JsObj | null): this;
  /**
   * Constructor
   */
  static make(ns: MNamespace, out: sys.OutStream, opts: xeto.Dict, ...args: unknown[]): Printer;
  sp(): this;
  /**
   * Print table
   */
  table(cells: sys.List<sys.List<string>>): this;
  /**
   * Top level print
   */
  print(v: sys.JsObj | null): this;
  /**
   * Comma  (uses bracket color for now)
   */
  comma(): this;
  /**
   * Print list
   */
  grid(grid: haystack.Grid): this;
  optInt(name: string, def: number): number;
  w(obj: sys.JsObj): this;
  /**
   * Colon and space (uses bracket color for now)
   */
  colon(): this;
  /**
   * Print comment string in theme color
   */
  comment(str: string): this;
  /**
   * Exit colored section
   */
  colorEnd(color: string | null): this;
}

/**
 * RDF Turtle Exporter
 */
export class RdfExporter extends Exporter {
  static type$: sys.Type
  refSpec(): xeto.Spec;
  instance(instance: haystack.Dict): this;
  lib(lib: xeto.Lib): this;
  spec(spec: xeto.Spec): this;
  end(): this;
  static make(ns: MNamespace, out: sys.OutStream, opts: haystack.Dict, ...args: unknown[]): RdfExporter;
  start(): this;
}

/**
 * Arguments for `of` meta
 */
export class MSpecArgsOf extends MSpecArgs {
  static type$: sys.Type
  val(): XetoSpec;
  of(checked: boolean): XetoSpec | null;
  static make(val: XetoSpec, ...args: unknown[]): MSpecArgsOf;
}

/**
 * Parameterized spec arguments
 */
export class MSpecArgs extends sys.Obj {
  static type$: sys.Type
  static nil(): MSpecArgs;
  of(checked: boolean): XetoSpec | null;
  ofs(checked: boolean): sys.List<XetoSpec> | null;
  static make(...args: unknown[]): MSpecArgs;
}

/**
 * DirLibFiles
 */
export class DirLibFiles extends MLibFiles {
  static type$: sys.Type
  dir(): sys.File;
  read(uri: sys.Uri, f: ((arg0: sys.Err | null, arg1: sys.InStream | null) => void)): void;
  isSupported(): boolean;
  list(): sys.List<sys.Uri>;
  static make(dir: sys.File, ...args: unknown[]): DirLibFiles;
}

/**
 * SpecBindingLoader
 */
export class SpecBindingLoader extends sys.Obj {
  static type$: sys.Type
  /**
   * Add Xeto to Fantom bindings for the spec if applicable
   */
  loadSpec(acc: SpecBindings, spec: CSpec): xeto.SpecBinding | null;
  /**
   * Add Xeto to Fantom bindings for the given library
   */
  loadLib(acc: SpecBindings, libName: string): void;
  /**
   * Default behavior for loading spec via pod reflection
   */
  loadSpecReflect(acc: SpecBindings, pod: sys.Pod, spec: CSpec): xeto.SpecBinding | null;
  static make(...args: unknown[]): SpecBindingLoader;
}

/**
 * LibNamespace implementation base class
 */
export class MNamespace extends sys.Obj implements xeto.LibNamespace, CNamespace {
  static type$: sys.Type
  sys(): MSys;
  __sys(it: MSys): void;
  sysLib(): xeto.Lib;
  __sysLib(it: xeto.Lib): void;
  names(): xeto.NameTable;
  __names(it: xeto.NameTable): void;
  base(): MNamespace | null;
  __base(it: MNamespace | null): void;
  instance(qname: string, checked?: boolean): xeto.Dict | null;
  lib(name: string, checked?: boolean): xeto.Lib | null;
  libAsync(name: string, f: ((arg0: sys.Err | null, arg1: xeto.Lib | null) => void)): void;
  unqualifiedType(name: string, checked?: boolean): xeto.Spec | null;
  eachLibForIter(f: ((arg0: xeto.Lib) => void)): void;
  type(qname: string, checked?: boolean): XetoSpec | null;
  writeData(out: sys.OutStream, val: sys.JsObj, opts?: xeto.Dict | null): void;
  spec(qname: string, checked?: boolean): XetoSpec | null;
  hasLib(name: string): boolean;
  specFits(a: xeto.Spec, b: xeto.Spec, opts?: xeto.Dict | null): boolean;
  interfaceMethodOn(target: sys.JsObj, methodName: string): sys.Method | null;
  isOverlay(): boolean;
  /**
   * Load a list of versions asynchronously and return result of
   * either a XetoLib or Err (is error on server)
   */
  doLoadAsync(v: xeto.LibVersion, f: ((arg0: sys.Err | null, arg1: sys.JsObj | null) => void)): void;
  interfaceMethod(spec: xeto.Spec, methodName: string): sys.Method | null;
  version(name: string, checked?: boolean): xeto.LibVersion | null;
  xmetaEnum(qname: string, checked?: boolean): xeto.SpecEnum | null;
  fits(cx: xeto.XetoContext, val: sys.JsObj | null, spec: xeto.Spec, opts?: xeto.Dict | null): boolean;
  xmeta(qname: string, checked?: boolean): xeto.Dict | null;
  versions(): sys.List<xeto.LibVersion>;
  isAllLoaded(): boolean;
  libs(): sys.List<xeto.Lib>;
  eachType(f: ((arg0: xeto.Spec) => void)): void;
  libListAsync(names: sys.List<string>, f: ((arg0: sys.Err | null, arg1: sys.List<xeto.Lib> | null) => void)): void;
  global(name: string, checked?: boolean): xeto.Spec | null;
  queryWhile(cx: xeto.XetoContext, subject: xeto.Dict, query: xeto.Spec, opts: xeto.Dict | null, f: ((arg0: xeto.Dict) => sys.JsObj | null)): sys.JsObj | null;
  instantiate(spec: xeto.Spec, opts?: xeto.Dict | null): sys.JsObj | null;
  eachInstanceThatIs(type: xeto.Spec, f: ((arg0: xeto.Dict, arg1: xeto.Spec) => void)): void;
  eachInstance(f: ((arg0: xeto.Dict) => void)): void;
  digest(): string;
  libStatus(name: string, checked?: boolean): xeto.LibStatus | null;
  dump(out?: sys.OutStream): void;
  static make(base: MNamespace | null, names: xeto.NameTable, versions: sys.List<xeto.LibVersion>, loadSys: ((arg0: MNamespace) => XetoLib) | null, ...args: unknown[]): MNamespace;
  compileDicts(src: string, opts?: xeto.Dict | null): sys.List<xeto.Dict>;
  eachSubtype(ctype: CSpec, f: ((arg0: CSpec) => void)): void;
  libErr(name: string): sys.Err | null;
  specOf(val: sys.JsObj | null, checked?: boolean): xeto.Spec | null;
  print(val: sys.JsObj | null, out?: sys.OutStream, opts?: xeto.Dict | null): void;
  libsAllAsync(f: ((arg0: sys.Err | null, arg1: sys.List<xeto.Lib> | null) => void)): void;
  /**
   * Load given version synchronously.  If the libary can not be
   * loaed then raise exception to the caller of this method.
   */
  doLoadSync(v: xeto.LibVersion): XetoLib;
  choice(spec: xeto.Spec): xeto.SpecChoice;
  /**
   * Compile a Xeto data file into an in-memory value. All
   * dependencies are resolved against this namespace.  Raise
   * exception if there are any syntax or semantic errors.  If
   * the file contains a scalar value or one dict, then it is
   * returned as the value.  If the file contains two or more
   * dicts then return a Dict[] of the instances.
   * 
   * Options
   * - externRefs: marker to allow unresolved refs to compile
   */
  compileData(src: string, opts?: xeto.Dict | null): sys.JsObj | null;
  /**
   * Compile Xeto source code into a temp library.  All
   * dependencies are resolved against this namespace.  Raise
   * exception if there are any syntax or semantic errors.
   */
  compileLib(src: string, opts?: xeto.Dict | null): xeto.Lib;
}

/**
 * Implementation of SpecSlots
 */
export class MSlots extends sys.Obj implements xeto.SpecSlots {
  static type$: sys.Type
  static empty(): MSlots;
  map(): xeto.NameDict;
  toStr(): string;
  isEmpty(): boolean;
  each(f: ((arg0: xeto.Spec) => void)): void;
  names(): sys.List<string>;
  size(): number;
  get(name: string, checked?: boolean): XetoSpec | null;
  missing(name: string): boolean;
  has(name: string): boolean;
  static make(map: xeto.NameDict, ...args: unknown[]): MSlots;
  eachWhile(f: ((arg0: xeto.Spec) => sys.JsObj | null)): sys.JsObj | null;
  toDict(): haystack.Dict;
}

/**
 * CompUtil
 */
export class CompUtil extends sys.Obj {
  static type$: sys.Type
  /**
   * Encode a component into a sys.comp::Comp dict representation
   * (no children)
   */
  static compToDict(comp: xeto.Comp): haystack.Dict;
  /**
   * Return grid format used for BlockView feed protocol
   */
  static toFeedGrid(gridMeta: haystack.Dict, cookie: string, dicts: sys.List<haystack.Dict>, deleted: sys.Map<haystack.Ref, haystack.Ref> | null): haystack.Grid;
  /**
   * Return if name is a slot that cannot be directly changed in
   * an Comp
   */
  static isReservedSlot(name: string): boolean;
  /**
   * Convert slot to fantom handler method or null
   */
  static toHandlerMethod(c: xeto.Comp, slot: xeto.Spec): sys.Method | null;
  /**
   * Convert component slot "name" to Fantom method
   * implementation "onName"
   */
  static toHandlerMethodName(name: string): string;
  /**
   * Encode a component into a sys.comp::Comp dict representation
   * (with children)
   */
  static compSave(comp: xeto.Comp): haystack.Dict;
  /**
   * Dict to brio buf
   */
  static dictToBrio(dict: haystack.Dict): sys.Buf;
  static make(...args: unknown[]): CompUtil;
  /**
   * Encode a component into a sys.comp::Comp dict
   * representation, then brio
   */
  static compToBrio(comp: xeto.Comp): sys.Buf;
}

/**
 * Logger is used to report compiler info, warnings, and errors
 */
export class XetoLog extends sys.Obj {
  static type$: sys.Type
  /**
   * Report err level
   */
  err(msg: string, loc: util.FileLoc, err?: sys.Err | null): void;
  /**
   * Report log message
   */
  log(level: sys.LogLevel, id: xeto.Ref | null, msg: string, loc: util.FileLoc, cause: sys.Err | null): void;
  /**
   * Report warning level
   */
  warn(msg: string, loc: util.FileLoc, err?: sys.Err | null): void;
  /**
   * Wrap the {@link sys.Log | sys::Log} object.  This logger is
   * best used when embedding the ProtoCompiler inside larger
   * programs.
   */
  static makeLog(log: sys.Log, ...args: unknown[]): XetoLog;
  static make(...args: unknown[]): XetoLog;
  /**
   * Log errors to the given output stream using the standard
   * format:
   * ```
   * filepath(line): message
   * ```
   * 
   * This logger is best used when running protoc as a stand
   * alone command line program.
   */
  static makeOutStream(out?: sys.OutStream, ...args: unknown[]): XetoLog;
  /**
   * Report info level
   */
  info(msg: string): void;
}

/**
 * Implementation of SpecChoice and validation utilities
 */
export class MChoice extends sys.Obj implements xeto.SpecChoice {
  static type$: sys.Type
  ns(): MNamespace;
  spec(): XetoSpec;
  /**
   * Is the given spec a maybe type
   */
  static maybe(spec: CSpec): boolean;
  /**
   * Return if instance has all the given marker tags of the
   * given choice
   */
  static xhasChoiceMarkers(instance: xeto.Dict, choice: CSpec): boolean;
  isMaybe(): boolean;
  /**
   * Validation called by XetoCompiler in CheckErrors
   */
  static check(ns: CNamespace, spec: CSpec, instance: xeto.Dict, onErr: ((arg0: string) => void)): void;
  type(): xeto.Spec;
  isMultiChoice(): boolean;
  /**
   * Find all the choice selections for instance
   */
  static findSelections(ns: CNamespace, spec: CSpec, instance: xeto.Dict, acc: sys.List<sys.JsObj>): void;
  selections(instance: xeto.Dict, checked?: boolean): sys.List<xeto.Spec>;
  /**
   * Does given spec define the multiChoice flag
   */
  static multiChoice(spec: CSpec): boolean;
  selection(instance: xeto.Dict, checked?: boolean): xeto.Spec | null;
  /**
   * Validate given selections for an instance based on
   * maybe/multi-choice flags
   */
  static validate(spec: CSpec, selections: sys.List<CSpec>, onErr: ((arg0: string) => void)): void;
}

/**
 * Implementation of Spec wrapped by XetoSpec
 */
export class MSpec extends sys.Obj {
  static type$: sys.Type
  loc(): util.FileLoc;
  parent(): XetoSpec | null;
  flags(): number;
  type(): XetoSpec;
  slotsOwn(): MSlots;
  static specSpecRef(): xeto.Ref;
  args(): MSpecArgs;
  metaOwn(): MNameDict;
  slots(): MSlots;
  nameCode(): number;
  meta(): MNameDict;
  name(): string;
  base(): XetoSpec | null;
  hasSlots(): boolean;
  lib(): XetoLib;
  binding(): xeto.SpecBinding;
  slot(name: string, checked?: boolean): XetoSpec | null;
  qname(): string;
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  missing(name: string): boolean;
  id(): haystack.Ref;
  has(name: string): boolean;
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  static make(loc: util.FileLoc, parent: XetoSpec | null, nameCode: number, name: string, base: XetoSpec | null, type: XetoSpec, meta: MNameDict, metaOwn: MNameDict, slots: MSlots, slotsOwn: MSlots, flags: number, args: MSpecArgs, ...args: unknown[]): MSpec;
  toStr(): string;
  slotOwn(name: string, checked?: boolean): XetoSpec | null;
  hasFlag(flag: number): boolean;
  isType(): boolean;
  enum(): MEnum;
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  fantomType(): sys.Type;
  flavor(): xeto.SpecFlavor;
  eachWhile(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
}

/**
 * Handler to async load a remote lib
 */
export abstract class RemoteLibLoader extends sys.Obj {
  static type$: sys.Type
  loadLib(name: string, f: ((arg0: sys.Err | null, arg1: sys.JsObj | null) => void)): void;
}

/**
 * MEnumXMeta
 */
export class MEnumXMeta extends sys.Obj implements xeto.SpecEnum {
  static type$: sys.Type
  enum(): MEnum;
  xmetaSelf(): xeto.Dict;
  xmetaByKey(): sys.Map<string, xeto.Dict>;
  keys(): sys.List<string>;
  spec(key: string, checked?: boolean): xeto.Spec | null;
  each(f: ((arg0: xeto.Spec, arg1: string) => void)): void;
  xmeta(key?: string | null, checked?: boolean): xeto.Dict | null;
  static make(enum$: MEnum, xmetaSelf: xeto.Dict, xmetaByKey: sys.Map<string, xeto.Dict>, ...args: unknown[]): MEnumXMeta;
}

export class GenericScalarBinding extends ScalarBinding {
  static type$: sys.Type
  decodeScalar(str: string, checked?: boolean): sys.JsObj | null;
  static make(spec: string, ...args: unknown[]): GenericScalarBinding;
}

export class DictBinding extends xeto.SpecBinding {
  static type$: sys.Type
  type(): sys.Type;
  spec(): string;
  isDict(): boolean;
  decodeScalar($xeto: string, checked?: boolean): sys.JsObj | null;
  decodeDict($xeto: xeto.Dict): xeto.Dict;
  encodeScalar(val: sys.JsObj): string;
  isInheritable(): boolean;
  static make(spec: string, type?: sys.Type, ...args: unknown[]): DictBinding;
  isScalar(): boolean;
}

export class XetoCompilerErr extends util.FileLocErr {
  static type$: sys.Type
  static make(msg: string, loc: util.FileLoc, cause?: sys.Err | null, ...args: unknown[]): XetoCompilerErr;
}

