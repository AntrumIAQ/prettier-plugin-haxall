import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as util from './util.js';

/**
 * CompLayout models layout of a component on a logical grid
 * coordinate system
 */
export class CompLayout extends sys.Obj {
  static type$: sys.Type
  /**
   * String representation as "x,y,w"
   */
  toStr(): string;
  /**
   * Parse from string as "x,y,w"
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): CompLayout;
  /**
   * Width in logical coordinate system
   */
  w(): number;
  /**
   * Return if obj is same CompLayout value.
   */
  equals(obj: sys.JsObj | null): boolean;
  /**
   * Logical x coordinate
   */
  x(): number;
  /**
   * Logical y coordinate
   */
  y(): number;
  /**
   * Constructor
   */
  static make(x: number, y: number, w?: number, ...args: unknown[]): CompLayout;
  /**
   * Return hash of x, y, and h
   */
  hash(): number;
}

/**
 * Xeto library name, version, and dependencies
 */
export abstract class LibVersion extends sys.Obj {
  static type$: sys.Type
  /**
   * Sort by name, then version
   */
  compare(that: sys.JsObj): number;
  /**
   * Dependencies of this library
   */
  depends(): sys.List<LibDepend>;
  /**
   * Order a list of versions by their dependencies.  Raise
   * exception if the given list does not satisify all the
   * internal dependencies or has circular dependencies.
   */
  static orderByDepends(libs: sys.List<LibVersion>): sys.List<LibVersion>;
  /**
   * Library version
   */
  version(): sys.Version;
  /**
   * Library dotted name
   */
  name(): string;
  /**
   * Summary information or empty string if not available
   */
  doc(): string;
}

/**
 * Component or function block
 */
export abstract class Comp extends sys.Obj {
  static type$: sys.Type
  /**
   * Remove an onCall callback
   */
  onCallRemove(name: string, cb: Function): void;
  /**
   * Call a method slot asynchronously. If slot is not found then
   * silently ignore and return null. If slot is defined but not
   * an Function then raise exception.
   */
  callAsync(name: string, arg: sys.JsObj | null, cb: ((arg0: sys.Err | null, arg1: sys.JsObj | null) => void)): void;
  /**
   * Parent component or null if root/unmounted
   */
  parent(): Comp | null;
  /**
   * How often should this component have its onExecute callback
   * invoked. Return null if this component has no time based
   * computation.
   */
  onExecuteFreq(): sys.Duration | null;
  /**
   * Callback when a method is called. This is an observer
   * callback only and will not determine the result value of
   * calling a method.
   */
  onCall(name: string, cb: ((arg0: this, arg1: sys.JsObj | null) => void)): void;
  /**
   * Callback on instance itself when a call is invoked.
   */
  onCallThis(name: string, arg: sys.JsObj | null): void;
  /**
   * Xeto type for this component
   */
  spec(): Spec;
  /**
   * Remove a slot by name.  Do nothing is name isn't mapped.
   */
  remove(name: string): this;
  /**
   * Return display string for this component
   */
  dis(): string;
  /**
   * Get the given slot value or null if slot name not defined.
   */
  get(name: string): sys.JsObj | null;
  /**
   * Return true if the component does not have a slot by given
   * name.
   */
  missing(name: string): boolean;
  /**
   * Is this component is a descendant in the tree of the given
   * component. If the given component is this, then return true.
   */
  isBelow(parent: Comp): boolean;
  /**
   * Gets links slot as dict of incoming component links
   */
  links(): Links;
  /**
   * Return id that uniquely identifies this component within its
   * space.
   */
  id(): Ref;
  /**
   * Return true if this component has a slot by given name.
   */
  has(name: string): boolean;
  /**
   * Get or set the slot mapped by the given name.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Return debug string
   */
  toStr(): string;
  /**
   * Add a slot.  If name is null one is auto-generated otherwise
   * the name must be unique.
   */
  add(val: sys.JsObj, name?: string | null): this;
  /**
   * Set a slot by name.  If val is null, then this is a
   * convenience for remove.
   */
  set(name: string, val: sys.JsObj | null): this;
  /**
   * Callback when a slot is modified.  The newVal is null if the
   * slot was removed.
   */
  onChange(name: string, cb: ((arg0: this, arg1: sys.JsObj | null) => void)): void;
  /**
   * Remove an onChange callback
   */
  onChangeRemove(name: string, cb: Function): void;
  /**
   * Callback on instance itself when a slot is modified. Value
   * is null if slot removed.
   */
  onChangeThis(name: string, newVal: sys.JsObj | null): void;
  /**
   * Callback to recompute component state.
   */
  onExecute(cx: CompContext): void;
  /**
   * Return if this component is mounted into a component space
   */
  isMounted(): boolean;
  /**
   * Iterate children components in the tree structure
   */
  eachChild(f: ((arg0: Comp, arg1: string) => void)): void;
  /**
   * Iterate slot name/value pairs using same semantics as {@link get | get}.
   */
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  /**
   * Call a method slot synchronously. If slot is not found then
   * silently ignore and return null. If slot is defined but not
   * a Function or the Function must be called asynchronously
   * then raise exception.
   */
  call(name: string, arg?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Check if a child component is mapped by the given name
   */
  hasChild(name: string): boolean;
  /**
   * Slot name under parent or "" if parent is null
   */
  name(): string;
  /**
   * Iterate name/value pairs until callback returns non-null
   */
  eachWhile(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
  /**
   * Is this is an ancestor in the tree of the given component.
   * If the given component is this, then return true.
   */
  isAbove(child: Comp): boolean;
  /**
   * Lookup a child component by name
   */
  child(name: string, checked?: boolean): Comp | null;
}

/**
 * XetoEnv models the server side file system search path.
 */
export class XetoEnv extends sys.Obj {
  static type$: sys.Type
  /**
   * Current environment for the VM
   */
  static cur(): XetoEnv;
  /**
   * Home directory where xeto software is installed
   */
  homeDir(): sys.File;
  /**
   * List of paths to search for libraries in both lib and src
   * format
   */
  path(): sys.List<sys.File>;
  /**
   * Default install directory for `xeto install`. Default is the {@link workDir | workDir}
   */
  installDir(): sys.File;
  /**
   * Working directory - first directory in the path.  The
   * workDir is used as default location for `xeto init` to create
   * new libs.
   */
  workDir(): sys.File;
}

/**
 * CompObj is the base class for all Comp subclasses
 */
export class CompObj extends sys.Obj implements Comp {
  static type$: sys.Type
  /**
   * Constructor for generic component with given spec
   */
  static makeForSpec(spec: Spec, ...args: unknown[]): CompObj;
  /**
   * Constructor for subclasses
   */
  static make(...args: unknown[]): CompObj;
  /**
   * Remove an onCall callback
   */
  onCallRemove(name: string, cb: Function): void;
  /**
   * Call a method slot asynchronously. If slot is not found then
   * silently ignore and return null. If slot is defined but not
   * an Function then raise exception.
   */
  callAsync(name: string, arg: sys.JsObj | null, cb: ((arg0: sys.Err | null, arg1: sys.JsObj | null) => void)): void;
  /**
   * Parent component or null if root/unmounted
   */
  parent(): Comp | null;
  /**
   * How often should this component have its onExecute callback
   * invoked. Return null if this component has no time based
   * computation.
   */
  onExecuteFreq(): sys.Duration | null;
  /**
   * Callback when a method is called. This is an observer
   * callback only and will not determine the result value of
   * calling a method.
   */
  onCall(name: string, cb: ((arg0: this, arg1: sys.JsObj | null) => void)): void;
  /**
   * Callback on instance itself when a call is invoked.
   */
  onCallThis(name: string, arg: sys.JsObj | null): void;
  /**
   * Xeto type for this component
   */
  spec(): Spec;
  /**
   * Remove a slot by name.  Do nothing is name isn't mapped.
   */
  remove(name: string): this;
  /**
   * Return display string for this component
   */
  dis(): string;
  /**
   * Get the given slot value or null if slot name not defined.
   */
  get(name: string): sys.JsObj | null;
  /**
   * Return true if the component does not have a slot by given
   * name.
   */
  missing(name: string): boolean;
  /**
   * Is this component is a descendant in the tree of the given
   * component. If the given component is this, then return true.
   */
  isBelow(parent: Comp): boolean;
  /**
   * Gets links slot as dict of incoming component links
   */
  links(): Links;
  /**
   * Return id that uniquely identifies this component within its
   * space.
   */
  id(): Ref;
  /**
   * Return true if this component has a slot by given name.
   */
  has(name: string): boolean;
  /**
   * Get or set the slot mapped by the given name.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Return debug string
   */
  toStr(): string;
  /**
   * Add a slot.  If name is null one is auto-generated otherwise
   * the name must be unique.
   */
  add(val: sys.JsObj, name?: string | null): this;
  /**
   * Set a slot by name.  If val is null, then this is a
   * convenience for remove.
   */
  set(name: string, val: sys.JsObj | null): this;
  /**
   * Callback when a slot is modified.  The newVal is null if the
   * slot was removed.
   */
  onChange(name: string, cb: ((arg0: this, arg1: sys.JsObj | null) => void)): void;
  /**
   * Remove an onChange callback
   */
  onChangeRemove(name: string, cb: Function): void;
  /**
   * Callback on instance itself when a slot is modified. Value
   * is null if slot removed.
   */
  onChangeThis(name: string, newVal: sys.JsObj | null): void;
  /**
   * Callback to recompute component state.
   */
  onExecute(cx: CompContext): void;
  /**
   * Return if this component is mounted into a component space
   */
  isMounted(): boolean;
  /**
   * Iterate children components in the tree structure
   */
  eachChild(f: ((arg0: Comp, arg1: string) => void)): void;
  /**
   * Iterate slot name/value pairs using same semantics as {@link get | get}.
   */
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  /**
   * Call a method slot synchronously. If slot is not found then
   * silently ignore and return null. If slot is defined but not
   * a Function or the Function must be called asynchronously
   * then raise exception.
   */
  call(name: string, arg?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Check if a child component is mapped by the given name
   */
  hasChild(name: string): boolean;
  /**
   * Slot name under parent or "" if parent is null
   */
  name(): string;
  /**
   * Iterate name/value pairs until callback returns non-null
   */
  eachWhile(f: ((arg0: sys.JsObj, arg1: string) => sys.JsObj | null)): sys.JsObj | null;
  /**
   * Is this is an ancestor in the tree of the given component.
   * If the given component is this, then return true.
   */
  isAbove(child: Comp): boolean;
  /**
   * Lookup a child component by name
   */
  child(name: string, checked?: boolean): Comp | null;
}

/**
 * Access to file resources packaged with library.
 */
export abstract class LibFiles extends sys.Obj {
  static type$: sys.Type
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
  /**
   * Convenience to read file to in-memory buffer
   */
  readBuf(uri: sys.Uri): sys.Buf;
  /**
   * Convenience to read file to in-memory string
   */
  readStr(uri: sys.Uri): string;
}

/**
 * SpecSlots is a map of named Specs
 */
export abstract class SpecSlots extends sys.Obj {
  static type$: sys.Type
  /**
   * Return if slots are empty
   */
  isEmpty(): boolean;
  /**
   * Iterate through the children
   */
  each(f: ((arg0: Spec) => void)): void;
  /**
   * Convenience to list the slots names; prefer {@link each | each}.
   */
  names(): sys.List<string>;
  /**
   * Get the child slot spec
   */
  get(name: string, checked?: boolean): Spec | null;
  /**
   * Return if the given slot name is undefined.
   */
  missing(name: string): boolean;
  /**
   * Return if the given slot name is defined.
   */
  has(name: string): boolean;
  /**
   * Iterate through the children until function returns non-null
   */
  eachWhile(f: ((arg0: Spec) => sys.JsObj | null)): sys.JsObj | null;
}

/**
 * Xeto library dependency as name and version constraints
 */
export abstract class LibDepend extends sys.Obj implements Dict {
  static type$: sys.Type
  /**
   * String representation is "<qname> <versions>"
   */
  toStr(): string;
  /**
   * Version constraints that satisify this dependency
   */
  versions(): LibDependVersions;
  /**
   * Library dotted name
   */
  name(): string;
  /**
   * Construct with name and version constraints
   */
  static make(name: string, versions?: LibDependVersions, ...args: unknown[]): LibDepend;
  /**
   * Return if the there are no name/value pairs
   */
  isEmpty(): boolean;
  /**
   * Iterate through the name/value pairs
   */
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  /**
   * Get the value for the given name or `def` if name not mapped
   */
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return true if this dictionary does not contain given name
   */
  missing(name: string): boolean;
  _id(): Ref;
  /**
   * Return true if this dictionary contains given name
   */
  has(name: string): boolean;
  /**
   * Get the value mapped by the given name.  If it is not mapped
   * to a non-null value, then throw an UnknownNameErr.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
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
 * LibStatus
 */
export class LibStatus extends sys.Enum {
  static type$: sys.Type
  /**
   * Load was attempted, but failed due to compiler error
   */
  static err(): LibStatus;
  /**
   * List of LibStatus values indexed by ordinal
   */
  static vals(): sys.List<LibStatus>;
  /**
   * The library has not been loaded into the namespace yet
   */
  static notLoaded(): LibStatus;
  /**
   * The library was successfully loaded into namespace
   */
  static ok(): LibStatus;
  /**
   * Return the LibStatus instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): LibStatus;
}

/**
 * Link models a dataflow relationship between two Comp slots
 */
export abstract class Link extends sys.Obj implements Dict {
  static type$: sys.Type
  /**
   * Soruce component slot name
   */
  fromSlot(): string;
  /**
   * Source component identifier
   */
  fromRef(): Ref;
  /**
   * Return if the there are no name/value pairs
   */
  isEmpty(): boolean;
  /**
   * Iterate through the name/value pairs
   */
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  /**
   * Get the value for the given name or `def` if name not mapped
   */
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return true if this dictionary does not contain given name
   */
  missing(name: string): boolean;
  _id(): Ref;
  /**
   * Return true if this dictionary contains given name
   */
  has(name: string): boolean;
  /**
   * Get the value mapped by the given name.  If it is not mapped
   * to a non-null value, then throw an UnknownNameErr.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
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
 * Choice APIs for a specific choice spec via {@link LibNamespace.choice | LibNamespace.choice}.
 */
export abstract class SpecChoice extends sys.Obj {
  static type$: sys.Type
  /**
   * Return if the choice slot allows zero selections
   */
  isMaybe(): boolean;
  /**
   * Choice type for the spec
   */
  type(): Spec;
  /**
   * Return if the choice slot allows multiple selections
   */
  isMultiChoice(): boolean;
  /**
   * Spec for this choice - might be slot or choice type
   */
  spec(): Spec;
  /**
   * Return all choice selections the given instance implements.
   * - one selection => return list of one
   * - zero selections + isMaybe is true => return empty list
   * - zero selections + isMaybe is false + checked is false =>
   *   return empty list
   * - zero selections + isMaybe is false + checked is true =>
   *   raise exception
   * - multiple selections + isMultiChoice is false + checked is
   *   false => return all
   * - multiple selections + isMultiChoice is false + checked is
   *   true => raise exception
   * - multiple selections + isMultiChoice is true + checked is
   *   true => return all
   */
  selections(instance: Dict, checked?: boolean): sys.List<Spec>;
  /**
   * Return single choice selection considering validation rules.
   * This method is a semantically equivalent to:
   * ```
   * selections(instance, checked).first
   * ```
   */
  selection(instance: Dict, checked?: boolean): Spec | null;
}

/**
 * MXetoLogRec
 */
export class MXetoLogRec extends sys.Obj implements XetoLogRec {
  static type$: sys.Type
  msg(): string;
  loc(): util.FileLoc;
  err(): sys.Err | null;
  level(): sys.LogLevel;
  id(): Ref | null;
  toStr(): string;
  static make(level: sys.LogLevel, id: Ref | null, msg: string, loc: util.FileLoc, err: sys.Err | null, ...args: unknown[]): MXetoLogRec;
}

/**
 * Context for Comp.onExecute
 */
export abstract class CompContext extends sys.Obj {
  static type$: sys.Type
  /**
   * Current DateTime to use; might be simulated
   */
  now(): sys.DateTime;
}

/**
 * Library namespace is a pinned manifest of specific library
 * versions. Namespaces may lazily load their libs, in which
 * case not all operations are supported. Create a new
 * namespace via {@link LibRepo.createNamespace | LibRepo.createNamespace}.
 */
export abstract class LibNamespace extends sys.Obj {
  static type$: sys.Type
  /**
   * Get or load instance by the given qualified name If the
   * instance's lib is not loaded, it is loaded synchronously.
   */
  instance(qname: string, checked?: boolean): Dict | null;
  /**
   * Get the given library by name synchronously.  If this is a
   * Java environment, then the library will be compiled on its
   * first access. If the library cannot be compiled then an
   * exception is always raised regardless of checked flag.  If
   * this is a JS environment then the library must already have
   * been loaded, otherwise raise exception regardless of checked
   * flag.  The checked flag only returns null if the library is
   * not defined by this namespace.  Use {@link libAsync | libAsync}
   * to load a library in JS environment.
   */
  lib(name: string, checked?: boolean): Lib | null;
  /**
   * Get or load library asynchronously by the given dotted name.
   * This method automatically also loads the dependency chain.
   * Once loaded then invoke callback with library or err.
   */
  libAsync(name: string, f: ((arg0: sys.Err | null, arg1: Lib | null) => void)): void;
  /**
   * Get or load type by the given qualified name. If the type's
   * lib is not loaded, it is loaded synchronously.
   */
  type(qname: string, checked?: boolean): Spec | null;
  /**
   * Write instance data in Xeto text format to an output stream.
   * If the value is a Dict[], then it is flattened in the
   * output.  Use {@link compileData | compileData} to read data
   * from Xeto text format.
   */
  writeData(out: sys.OutStream, val: sys.JsObj, opts?: Dict | null): void;
  /**
   * Get or load spec by the given qualified name:
   * - type: "foo.bar::Baz"
   * - global: "foo.bar::baz"
   * - slot: "foo.bar::Baz.qux" If the spec's lib is not loaded, it
   *   is loaded synchronously.
   */
  spec(qname: string, checked?: boolean): Spec | null;
  /**
   * Return if this namespace contains the given lib name. This
   * is true if version will return non-null regardless of
   * libStatus.
   */
  hasLib(name: string): boolean;
  /**
   * Return true if this an overlay namespace overlaid on {@link base | base}.
   */
  isOverlay(): boolean;
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
  compileData(src: string, opts?: Dict | null): sys.JsObj | null;
  /**
   * Compile Xeto source code into a temp library.  All
   * dependencies are resolved against this namespace.  Raise
   * exception if there are any syntax or semantic errors.
   */
  compileLib(src: string, opts?: Dict | null): Lib;
  /**
   * Lookup the version info for a library name in this
   * namespace.
   */
  version(name: string, checked?: boolean): LibVersion | null;
  /**
   * Lookup the extended meta for an enum spec.  This returns a
   * SpecEnum instance with resolved extended meta for all the
   * enum items via a merge of all libs with instances named
   * "xmeta-{lib}-{spec}-enum".
   */
  xmetaEnum(qname: string, checked?: boolean): SpecEnum | null;
  /**
   * Return if the given instance fits the spec via structural
   * typing. Options:
   * - `graph`: marker to also check graph of references such as
   *   required points
   * - `ignoreRefs`: marker to ignore if refs resolve to valid target
   * - `haystack`: marker tag to use Haystack level data fidelity
   */
  fits(cx: XetoContext, val: sys.JsObj | null, spec: Spec, opts?: Dict | null): boolean;
  /**
   * Lookup the extended meta for the given spec qname.  This is
   * a merge of the spec's own meta along with any instance dicts
   * in the namespace with a local id of "xmeta-{lib}-{spec}". 
   * Only libs currently loaded are considered for the result. 
   * If the spec is not defined then return null or raise an
   * exception based on checked flag.  For example to register
   * extended meta data on the `ph::Site` spec you would create an
   * instance dict with the local name of `xmeta-ph-Site`.
   */
  xmeta(qname: string, checked?: boolean): Dict | null;
  /**
   * List the library name and versions in this namespace.
   */
  versions(): sys.List<LibVersion>;
  /**
   * Return true if the every library in this namespace has been
   * loaded (successfully or unsuccessfully).  This method
   * returns false is any libs have a load status of `notLoaded`. 
   * Many operations require a namespace to be fully loaded.
   */
  isAllLoaded(): boolean;
  /**
   * List all libraries.  On first call, this will force all
   * libraries to be loaded synchronously.  Any libs which cannot
   * be compiled will log an error and be excluded from this
   * list.  If {@link isAllLoaded | isAllLoaded} is true then this
   * call can also be in JS environments, otherwise you must use
   * the {@link libsAllAsync | libsAllAsync} call to fully load
   * all libraries into memory.
   */
  libs(): sys.List<Lib>;
  /**
   * Iterate all the top-level types in libs. In remote namespace
   * this only iterates loaded libs.
   */
  eachType(f: ((arg0: Spec) => void)): void;
  /**
   * Get or load list of libraries asynchronously by the given
   * dotted names. This method automatically also loads the
   * dependency chain. Once loaded then invoke callback with
   * libraries or err.  If a lib cannot be loaded then it is
   * excluded from the callback list (so its possible the results
   * list is not the same size as the names list).
   */
  libListAsync(names: sys.List<string>, f: ((arg0: sys.Err | null, arg1: sys.List<Lib> | null) => void)): void;
  /**
   * Create default instance for the given spec. Raise exception
   * if spec is abstract.
   * 
   * Options:
   * - `graph`: marker tag to instantiate graph of recs (will
   *   auto-generate ids)
   * - `abstract`: marker to supress error if spec is abstract
   * - `id`: Ref tag to include in new instance
   * - `haystack`: marker tag to use Haystack level data fidelity
   */
  instantiate(spec: Spec, opts?: Dict | null): sys.JsObj | null;
  /**
   * Iterate all the instances in libs In remote namespace this
   * only iterates loaded libs.
   */
  eachInstance(f: ((arg0: Dict) => void)): void;
  /**
   * Base64 digest for this namespace based on its lib versions
   */
  digest(): string;
  /**
   * Return load status for the given library name:
   * - `notLoaded`: library is included but has not been loaded yet
   * - `ok`: library is included and loaded successfully
   * - `err`: library is included but could not be loaded
   * - null/exception if library not included
   */
  libStatus(name: string, checked?: boolean): LibStatus | null;
  /**
   * Convenience for {@link compileData | compileData} but always
   * returns data as list of dicts. If the data is not a Dict nor
   * list of Dicts, then raise an exception.
   */
  compileDicts(src: string, opts?: Dict | null): sys.List<Dict>;
  /**
   * Exception for a library with lib status of `err`, or null
   * otherwise. Raise exception is library not included in this
   * namespace.
   */
  libErr(name: string): sys.Err | null;
  /**
   * Spec for Fantom {@link sys.Type | sys::Type} or the typeof
   * given object
   */
  specOf(val: sys.JsObj | null, checked?: boolean): Spec | null;
  /**
   * Load all libraries asynchronosly.  Once this operation
   * completes successfully the {@link isAllLoaded | isAllLoaded}
   * method will return `true` and the {@link libs | libs} method
   * may be used even in JS environments.  Note that an error is
   * reported only if the entire load failed.  Individual libs
   * which cannot be loaded will logged on server, and be
   * excluded from the final libs list.
   */
  libsAllAsync(f: ((arg0: sys.Err | null, arg1: sys.List<Lib> | null) => void)): void;
  /**
   * Return choice API for given spec. Callers should prefer the
   * slot over the type since the slot determines maybe and
   * multi-choice flags. Raise exception if {@link Spec.isChoice | Spec.isChoice}
   * is false.
   */
  choice(spec: Spec): SpecChoice;
  /**
   * Return base namespace if this namespace is an overlay.
   */
  base(): LibNamespace | null;
}

/**
 * Xeto library dependency version constraints.  The format is:
 * ```
 * <range>    :=  <ver> "-" <ver>
 * <ver>      :=  <seg> "." <seg> "." <seg>
 * <seg>      :=  <wildcard> | <number>
 * <wildcard> :=  "x"
 * <number>   :=  <digit>+
 * <digit>    :=  "0" - "9"
 * ```
 * 
 * Examples:
 * ```
 * 1.2.3         // version 1.2.3 exact
 * 1.2.x         // any version that starts with "1.2."
 * 3.x.x         // any version that starts with "3."
 * 1.0.0-2.0.0   // range from 1.0.0 to 2.0.0 inclusive
 * 1.2.0-1.3.x   // range from 1.2.0 to 1.3.* inclusive
 * ```
 */
export abstract class LibDependVersions extends sys.Obj {
  static type$: sys.Type
  /**
   * Create exact match for given version
   */
  static fromVersion(v: sys.Version, ...args: unknown[]): LibDependVersions;
  /**
   * Constant for "x.x.x"
   */
  static wildcard(): LibDependVersions;
  /**
   * Return if the given version satisifies this instance's
   * constraints
   */
  contains(version: sys.Version): boolean;
  /**
   * Parse string representation
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): LibDependVersions;
}

/**
 * Scalar is used to represent typed scalar values when there
 * is no native Fantom class we can use to track their type.
 */
export class Scalar extends sys.Obj {
  static type$: sys.Type
  /**
   * String value
   */
  val(): string;
  /**
   * Scalar type qualified name
   */
  qname(): string;
  /**
   * Return string value
   */
  toStr(): string;
  /**
   * Equality is base on qname and val
   */
  equals(obj: sys.JsObj | null): boolean;
  /**
   * Construct for spec qname and string value
   */
  static make(qname: string, val: string, ...args: unknown[]): Scalar;
  /**
   * Hash is composed of type and val
   */
  hash(): number;
}

/**
 * Function is a computation modeled by the `sys::Func` spec.
 */
export abstract class Function extends sys.Obj {
  static type$: sys.Type
  /**
   * Call the function with component and argument
   * asynchronously. Invoke the given callback with an exception
   * or result object.
   */
  callAsync(self$: Comp, arg: sys.JsObj | null, cb: ((arg0: sys.Err | null, arg1: sys.JsObj | null) => void)): void;
  /**
   * Return if this function must be called asynchronously
   */
  isAsync(): boolean;
  /**
   * Call the function with component and argument. Raise
   * exception if the function must be called async.
   */
  call(self$: Comp, arg: sys.JsObj | null): sys.JsObj | null;
}

/**
 * Item metadata for an Enum spec
 */
export abstract class SpecEnum extends sys.Obj {
  static type$: sys.Type
  /**
   * List the string keys
   */
  keys(): sys.List<string>;
  /**
   * Lookup enum item spec by its string key
   */
  spec(key: string, checked?: boolean): Spec | null;
  /**
   * Iterate the enum items by spec and string key
   */
  each(f: ((arg0: Spec, arg1: string) => void)): void;
  /**
   * Get the extended meta for the given enum item key.  If key
   * is null then get the extended meta for the enum spec itself.
   * This method is only available if the requested by the {@link LibNamespace.xmetaEnum | LibNamespace.xmetaEnum}
   * otherwise an exception is raised.
   */
  xmeta(key?: string | null, checked?: boolean): Dict | null;
}

/**
 * Versioned library module of specs and defs.
 * 
 * Lib dict representation:
 * - id: Ref "lib:{name}"
 * - spec: Ref "sys::Lib"
 * - loaded: marker tag if loaded into memory
 * - meta
 */
export abstract class Lib extends sys.Obj implements Dict {
  static type$: sys.Type
  /**
   * Lookup an instance dict by its simple name
   */
  instance(name: string, checked?: boolean): Dict | null;
  /**
   * Lookup a top level meta spec in this library by simple name
   */
  metaSpec(name: string, checked?: boolean): Spec | null;
  /**
   * List the instance data dicts declared in this library
   */
  instances(): sys.List<Dict>;
  /**
   * List the top level global slots
   */
  globals(): sys.List<Spec>;
  /**
   * Lookup a top level global slot spec in this library by
   * simple name
   */
  global(name: string, checked?: boolean): Spec | null;
  /**
   * List the top level meta specs
   */
  metaSpecs(): sys.List<Spec>;
  /**
   * Lookup a top level type spec in this library by simple name
   */
  type(name: string, checked?: boolean): Spec | null;
  /**
   * Lookup a top level spec in this library by simple name (type
   * or global slot)
   */
  spec(name: string, checked?: boolean): Spec | null;
  /**
   * List the top level specs (types and global slots)
   */
  specs(): sys.List<Spec>;
  /**
   * List the top level types
   */
  types(): sys.List<Spec>;
  /**
   * List the dependencies
   */
  depends(): sys.List<LibDepend>;
  /**
   * Version of this library
   */
  version(): sys.Version;
  /**
   * Meta data for library
   */
  meta(): Dict;
  /**
   * Dotted name of the library
   */
  name(): string;
  /**
   * Access all the resource files contained by this library. 
   * Resources are any files included in the libs's zip file
   * excluding xeto files. This API is only available in server
   * environments.
   */
  files(): LibFiles;
  /**
   * Return "lib:{name}" as identifier This is a temp shim until
   * we move `haystack::Dict` fully into Xeto.
   */
  _id(): Ref;
  /**
   * Return if the there are no name/value pairs
   */
  isEmpty(): boolean;
  /**
   * Iterate through the name/value pairs
   */
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  /**
   * Get the value for the given name or `def` if name not mapped
   */
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return true if this dictionary does not contain given name
   */
  missing(name: string): boolean;
  /**
   * Return true if this dictionary contains given name
   */
  has(name: string): boolean;
  /**
   * Get the value mapped by the given name.  If it is not mapped
   * to a non-null value, then throw an UnknownNameErr.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
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
 * Library repository is a database of Xeto libs.  A repository
 * might provide access to multiple versions per library.
 */
export abstract class LibRepo extends sys.Obj {
  static type$: sys.Type
  /**
   * Current default repository for the VM
   */
  static cur(): LibRepo;
  /**
   * Construct a namespace that overlays the given namespace with
   * the given list of lib versions in this repo.  This method
   * works just like createNamespace with the exception that it
   * reuses the libs from the the base namespace.  The
   * combination of the base libs and overlay libs must be
   * satisfy all version constraints.   The overlay libs must not
   * duplicte any libs in the base.
   */
  createOverlayNamespace(base: LibNamespace, libs: sys.List<LibVersion>): LibNamespace;
  /**
   * Get the latest version that matches the given dependency. 
   * If no matches are available, then raise exception or return
   * null based on check flag.
   */
  latestMatch(depend: LibDepend, checked?: boolean): LibVersion | null;
  /**
   * Get the latest version of the library name available.  If no
   * versions are available then raise exception or return null
   * based on check flag.
   */
  latest(name: string, checked?: boolean): LibVersion | null;
  /**
   * Solve the dependency graph for given list of libs and return
   * a complete dependency graph.  Raise an exception is no
   * solution can be computed based on the installed lib
   * versions.
   */
  solveDepends(libs: sys.List<LibDepend>): sys.List<LibVersion>;
  /**
   * Get the info for a specific library name and version. If the
   * given library or version is not available then raise
   * exception or return null based on the checked flag.
   */
  version(name: string, version: sys.Version, checked?: boolean): LibVersion | null;
  /**
   * Construct a namespace for the given set of lib versions in
   * this repo. This method does not solve the dependency graph. 
   * The list of lib versions passed must be a complete
   * dependency tree that satisifies all version constraints. 
   * Also see {@link solveDepends | solveDepends}.
   */
  createNamespace(libs: sys.List<LibVersion>): LibNamespace;
  /**
   * List the verions available for given library name.  If the
   * library is not available then raise exception or return null
   * based on check flag.
   */
  versions(name: string, checked?: boolean): sys.List<LibVersion> | null;
  /**
   * List the library names installed in the repository.
   */
  libs(): sys.List<string>;
}

/**
 * XetoContext is used to pass contextual state to XetoEnv
 * operations.
 */
export abstract class XetoContext extends sys.Obj {
  static type$: sys.Type
}

/**
 * Ref is used to model an entity identifier and optional
 * display string.
 */
export class Ref extends sys.Obj {
  static type$: sys.Type
  /**
   * Return display value of target if available, otherwise {@link id | id}
   */
  dis(): string;
  /**
   * Identifier that does **not** include leading `@` nor display
   * string
   */
  id(): string;
  static make(...args: unknown[]): Ref;
}

/**
 * Dict is an immutable map of name/value pairs.
 */
export abstract class Dict extends sys.Obj {
  static type$: sys.Type
  /**
   * Return if the there are no name/value pairs
   */
  isEmpty(): boolean;
  /**
   * Iterate through the name/value pairs
   */
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  /**
   * Get the value for the given name or `def` if name not mapped
   */
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return true if this dictionary does not contain given name
   */
  missing(name: string): boolean;
  _id(): Ref;
  /**
   * Return true if this dictionary contains given name
   */
  has(name: string): boolean;
  /**
   * Get the value mapped by the given name.  If it is not mapped
   * to a non-null value, then throw an UnknownNameErr.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
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
 * Links models the incoming links of a component.  It is a
 * dict keyed by the toSlot name.
 */
export abstract class Links extends sys.Obj implements Dict {
  static type$: sys.Type
  /**
   * Add given link (if not duplicate) and return new instance of
   * Links
   */
  add(toSlot: string, link: Link): this;
  /**
   * Remove given link (if found) and return new instance of
   * Links
   */
  remove(toSlot: string, link: Link): this;
  /**
   * Return if given toSlot has one or more links
   */
  isLinked(toSlot: string): boolean;
  /**
   * List all the links with the given toSlot name
   */
  listOn(toSlot: string): sys.List<Link>;
  /**
   * Iterate all the links as flat list
   */
  eachLink(f: ((arg0: string, arg1: Link) => void)): void;
  /**
   * Return if the there are no name/value pairs
   */
  isEmpty(): boolean;
  /**
   * Iterate through the name/value pairs
   */
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  /**
   * Get the value for the given name or `def` if name not mapped
   */
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return true if this dictionary does not contain given name
   */
  missing(name: string): boolean;
  _id(): Ref;
  /**
   * Return true if this dictionary contains given name
   */
  has(name: string): boolean;
  /**
   * Get the value mapped by the given name.  If it is not mapped
   * to a non-null value, then throw an UnknownNameErr.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
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
 * Xeto data specification.
 * 
 * Spec dict representation:
 * - id: Ref "lib:{qname}"
 * - spec: Ref "sys::Spec"
 * - base: Ref to base type (types only)
 * - type: Ref to slot type (slots only)
 * - effective meta
 */
export abstract class Spec extends sys.Obj implements Dict {
  static type$: sys.Type
  /**
   * Parent spec which contains this spec definition and scopes {@link name | name}.
   * Returns null for top level specs in the library.
   */
  parent(): Spec | null;
  /**
   * Parent library for spec
   */
  lib(): Lib;
  /**
   * Type of this spec.  If this spec is a top level type then
   * return self.
   */
  type(): Spec;
  /**
   * Return fully qualified name of this spec:
   * - Type specs will return "foo.bar::Baz"
   * - Global slots will return "foo.bar::baz"
   * - Type slots will return "foo.bar::Baz.qux"
   * - Derived specs will return "derived123::{name}"
   */
  qname(): string;
  /**
   * Convenience for `slotsOwn.get`
   */
  slotOwn(name: string, checked?: boolean): Spec | null;
  /**
   * Return enum item meta.  Raise exception if {@link isEnum | isEnum}
   * is false.
   */
  enum(): SpecEnum;
  /**
   * Get my own declared meta-data
   */
  metaOwn(): Dict;
  /**
   * Get the effective children slots including inherited
   */
  slots(): SpecSlots;
  /**
   * Get my effective meta; this does not include synthesized
   * tags like `spec`
   */
  meta(): Dict;
  /**
   * Return simple name scoped by {@link lib | lib} or {@link parent | parent}.
   */
  name(): string;
  /**
   * Identifier for a spec is always its qualified name This is a
   * temp shim until we move `haystack::Dict` fully into Xeto.
   */
  _id(): Ref;
  /**
   * Does meta have maybe tag
   */
  isMaybe(): boolean;
  /**
   * Convenience for `slots.get`
   */
  slot(name: string, checked?: boolean): Spec | null;
  /**
   * Get the declared children slots
   */
  slotsOwn(): SpecSlots;
  /**
   * Return if this is a spec that inherits from `sys::Choice`.  If
   * this spec inherits from a choice via a And/Or type then
   * return false.  See {@link LibNamespace.choice | LibNamespace.choice}
   * to access {@link SpecChoice | SpecChoice} API.
   */
  isChoice(): boolean;
  /**
   * Is the base `sys::Enum`
   */
  isEnum(): boolean;
  /**
   * Return if `this` spec inherits from `that` from a nominal type
   * perspective. Nonimal typing matches any of the following
   * conditions:
   * - if `that` matches one of `this` inherited specs via {@link base | base}
   * - if `this` is maybe and that is `None`
   * - if `this` is `And` and `that` matches any `this.ofs`
   * - if `this` is `Or` and `that` matches all `this.ofs` (common base)
   * - if `that` is `Or` and `this` matches any of `that.ofs`
   */
  isa(that: Spec): boolean;
  /**
   * Base spec from which this spec directly inherits its meta
   * and slots. Returns null if this is `sys::Obj` itself.
   */
  base(): Spec | null;
  /**
   * Return if the there are no name/value pairs
   */
  isEmpty(): boolean;
  /**
   * Iterate through the name/value pairs
   */
  each(f: ((arg0: sys.JsObj, arg1: string) => void)): void;
  /**
   * Get the value for the given name or `def` if name not mapped
   */
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return true if this dictionary does not contain given name
   */
  missing(name: string): boolean;
  /**
   * Return true if this dictionary contains given name
   */
  has(name: string): boolean;
  /**
   * Get the value mapped by the given name.  If it is not mapped
   * to a non-null value, then throw an UnknownNameErr.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
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

