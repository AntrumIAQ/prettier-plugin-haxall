import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as util from './util.js';
import * as xeto from './xeto.js';
import * as haystack from './haystack.js';
import * as xetoEnv from './xetoEnv.js';

/**
 * FileRepo is a file system based repo that uses the the
 * Fantom path to find zip versions in "lib/xeto/" and
 * sourceversion in "src/xeto/".
 */
export class FileRepo extends sys.Obj implements xeto.LibRepo {
  static type$: sys.Type
  log(): sys.Log;
  env(): xeto.XetoEnv;
  names(): xeto.NameTable;
  createOverlayNamespace(base: xeto.LibNamespace, libs: sys.List<xeto.LibVersion>): xeto.LibNamespace;
  latestMatch(d: xeto.LibDepend, checked?: boolean): xeto.LibVersion | null;
  createFromData(recs: sys.List<xeto.Dict>): xeto.LibNamespace;
  static make(env?: xeto.XetoEnv, ...args: unknown[]): FileRepo;
  latest(name: string, checked?: boolean): xeto.LibVersion | null;
  toStr(): string;
  solveDepends(libs: sys.List<xeto.LibDepend>): sys.List<xeto.LibVersion>;
  version(name: string, version: sys.Version, checked?: boolean): xeto.LibVersion | null;
  createNamespace(libs: sys.List<xeto.LibVersion>): xeto.LibNamespace;
  versions(name: string, checked?: boolean): sys.List<xeto.LibVersion> | null;
  build(build: sys.List<xeto.LibVersion>): xeto.LibNamespace;
  libs(): sys.List<string>;
  rescan(): this;
}

/**
 * LocalNamespace compiles its libs from a repo
 */
export class LocalNamespace extends xetoEnv.MNamespace {
  static type$: sys.Type
  repo(): xeto.LibRepo;
  build(): sys.Map<string, sys.File> | null;
  compileData(src: string, opts?: xeto.Dict | null): sys.JsObj | null;
  doLoadAsync(version: xeto.LibVersion, f: ((arg0: sys.Err | null, arg1: sys.JsObj | null) => void)): void;
  compileLib(src: string, opts?: xeto.Dict | null): xeto.Lib;
  static make(base: xetoEnv.MNamespace | null, names: xeto.NameTable, versions: sys.List<xeto.LibVersion>, repo: xeto.LibRepo, build: sys.Map<string, sys.File> | null, ...args: unknown[]): LocalNamespace;
  isRemote(): boolean;
  doLoadSync(v: xeto.LibVersion): xetoEnv.XetoLib;
}

/**
 * LibVersion implementation for FileRepo
 */
export class FileLibVersion extends sys.Obj implements xeto.LibVersion {
  static type$: sys.Type
  version(): sys.Version;
  name(): string;
  fileRef(): sys.File;
  file(checked?: boolean): sys.File | null;
  static make(name: string, version: sys.Version, file: sys.File, doc: string | null, depends: sys.List<xeto.LibDepend> | null, ...args: unknown[]): FileLibVersion;
  toStr(): string;
  depends(): sys.List<xeto.LibDepend>;
  isSrc(): boolean;
  static makeFile(file: sys.File, ...args: unknown[]): FileLibVersion;
  doc(): string;
  /**
   * Sort by name, then version
   */
  compare(that: sys.JsObj): number;
}

/**
 * ANodeType
 */
export class ANodeType extends sys.Enum {
  static type$: sys.Type
  static instance(): ANodeType;
  static lib(): ANodeType;
  /**
   * List of ANodeType values indexed by ordinal
   */
  static vals(): sys.List<ANodeType>;
  static dataRef(): ANodeType;
  static spec(): ANodeType;
  static specRef(): ANodeType;
  static dict(): ANodeType;
  static dataDoc(): ANodeType;
  static scalar(): ANodeType;
  /**
   * Return the ANodeType instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): ANodeType;
}

