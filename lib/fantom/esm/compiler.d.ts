import * as sys from './sys.js';

/**
 * OrderByInheritance orders the list of TypeDefs from top to
 * bottom such that any inherited types are guaranteed to be
 * positioned first in the types list.  During this process we
 * check for duplicate type names and cyclic inheritance.
 */
export class OrderByInheritance extends CompilerStep {
  static type$: sys.Type
  processing(): sys.Map<string, TypeDef>;
  processing(it: sys.Map<string, TypeDef>): void;
  ordered(): sys.List<TypeDef>;
  ordered(it: sys.List<TypeDef>): void;
  todo(): sys.Map<string, TypeDef>;
  todo(it: sys.Map<string, TypeDef>): void;
  run(): void;
  static make(compiler: Compiler, ...args: unknown[]): OrderByInheritance;
}

/**
 * Coercer handles all the logic for type casts
 */
export class Coercer extends CompilerSupport {
  static type$: sys.Type
  /**
   * Coerce the target expression to the specified type.  If the
   * expression is not type compatible run the onErr function.
   */
  coerce(expr: Expr, expected: CType, onErr: (() => void)): Expr;
  /**
   * Ensure the specified expression is boxed to an object
   * reference.
   */
  box(expr: Expr): Expr;
  /**
   * Coerce the target expression to the specified type.  If the
   * expression is not type compatible run the onErr function.
   * Default Fantom behavior (no FFI checks).
   */
  doCoerce(expr: Expr, expected: CType, onErr: (() => void)): Expr;
  /**
   * Constructor
   */
  static make(c: Compiler, ...args: unknown[]): Coercer;
  /**
   * Run the standard coerce method and ensure the result is
   * boxed.
   */
  coerceBoxed(expr: Expr, expected: CType, onErr: (() => void)): Expr;
  /**
   * Return if {@link coerce | coerce} would not report a compiler
   * error.
   */
  canCoerce(expr: Expr, expected: CType): boolean;
}

/**
 * FCodePrinter prints a human readable syntax for fcode
 */
export class FCodePrinter extends sys.Obj implements FConst {
  static type$: sys.Type
  showIndex(): boolean;
  showIndex(it: boolean): void;
  pod(): FPod;
  pod(it: FPod): void;
  out(): sys.OutStream;
  out(it: sys.OutStream): void;
  buf(): sys.Buf | null;
  buf(it: sys.Buf | null): void;
  printSwitch(): void;
  printLine(obj?: sys.JsObj): FCodePrinter;
  index(index: number): string;
  code(buf: sys.Buf): void;
  static make(pod: FPod, out?: sys.OutStream, ...args: unknown[]): FCodePrinter;
  op(op: FOp): void;
  print(obj?: sys.JsObj): FCodePrinter;
}

/**
 * FOpArg
 */
export class FOpArg extends sys.Enum {
  static type$: sys.Type
  /**
   * List of FOpArg values indexed by ordinal
   */
  static vals(): sys.List<FOpArg>;
  static TypeRef(): FOpArg;
  static Uri(): FOpArg;
  static Int(): FOpArg;
  static Str(): FOpArg;
  static MethodRef(): FOpArg;
  static Decimal(): FOpArg;
  static TypePair(): FOpArg;
  static FieldRef(): FOpArg;
  static Duration(): FOpArg;
  static Jump(): FOpArg;
  static Float(): FOpArg;
  static Register(): FOpArg;
  static None(): FOpArg;
  /**
   * Return the FOpArg instance for the specified name.  If not a
   * valid name and checked is false return null, otherwise throw
   * ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): FOpArg;
}

/**
 * LoadPod is used to immediately load the pod which has just
 * been successfully compiled into Compiler.fpod.  This step is
 * only used with script compiles.
 */
export class LoadPod extends CompilerStep {
  static type$: sys.Type
  /**
   * Not used, use load instead
   */
  run(): void;
  /**
   * Run the step and return loaded Pod instance
   */
  load(): sys.Pod;
  /**
   * Constructor takes the associated Compiler
   */
  static make(compiler: Compiler, ...args: unknown[]): LoadPod;
}

/**
 * CField is a "compiler field" which is represents a Field in
 * the compiler.  CFields unify methods being compiled as
 * FieldDefs with methods imported as ReflectField or FField.
 */
export abstract class CField extends sys.Obj implements CSlot {
  static type$: sys.Type
  getter(): CMethod | null;
  /**
   * Is this field the parameterization of a generic field, with
   * the generic type replaced with a real type.
   */
  isParameterized(): boolean;
  type(): CType;
  /**
   * Original return type from inherited method if a covariant
   * override.
   */
  inheritedReturns(): CType;
  fieldType(): CType;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  /**
   * Is this field typed with a generic parameter.
   */
  isGeneric(): boolean;
  setter(): CMethod | null;
  /**
   * Does this field covariantly override a method?
   */
  isCovariant(): boolean;
  parent(): CType;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  ns(): CNamespace;
  signature(): string;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  flags(): number;
  isSynthetic(): boolean;
  isPrivate(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  qname(): string;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  toStr(): string;
  isGetter(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  isInternal(): boolean;
  name(): string;
  isSetter(): boolean;
  /**
   * Fandoc API docs if available
   */
  doc(): CDoc | null;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  /**
   * Get the facet keyed by given type, or null if not defined.
   */
  facet(qname: string): CFacet | null;
  isCtor(): boolean;
}

/**
 * CallExpr is a method call.
 */
export class CallExpr extends NameExpr {
  static type$: sys.Type
  isItAdd(): boolean;
  isItAdd(it: boolean): void;
  isCallOp(): boolean;
  isCallOp(it: boolean): void;
  isDynamic(): boolean;
  isDynamic(it: boolean): void;
  method(): CMethod | null;
  method(it: CMethod | null): void;
  synthetic(): boolean;
  synthetic(it: boolean): void;
  noParens(): boolean;
  noParens(it: boolean): void;
  args(): sys.List<Expr>;
  args(it: sys.List<Expr>): void;
  isCtorChain(): boolean;
  isCtorChain(it: boolean): void;
  static makeWithMethod(loc: Loc, target: Expr | null, method: CMethod, args?: sys.List<Expr> | null, ...args: unknown[]): CallExpr;
  toStr(): string;
  serialize(): string;
  isStmt(): boolean;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  isCompare(): boolean;
  targetx(): Expr;
  asCall(): CallExpr | null;
  static make(loc: Loc, target?: Expr | null, name?: string | null, id?: ExprId, ...args: unknown[]): CallExpr;
  print(out: AstWriter): void;
  walkChildren(v: Visitor): void;
}

/**
 * CompilationUnit models the top level compilation unit of a
 * source file.
 */
export class CompilationUnit extends Node {
  static type$: sys.Type
  types(): sys.List<TypeDef>;
  types(it: sys.List<TypeDef>): void;
  usings(): sys.List<Using>;
  usings(it: sys.List<Using>): void;
  pod(): CPod;
  pod(it: CPod): void;
  importedTypes(): sys.Map<string, sys.List<CType>> | null;
  importedTypes(it: sys.Map<string, sys.List<CType>> | null): void;
  tokens(): sys.List<TokenVal> | null;
  tokens(it: sys.List<TokenVal> | null): void;
  toStr(): string;
  print(out: AstWriter): void;
  static make(loc: Loc, pod: CPod, ...args: unknown[]): CompilationUnit;
}

/**
 * FTypeRef stores a typeRef structure used to reference type
 * signatures.
 */
export class FTypeRef extends sys.Obj {
  static type$: sys.Type
  hashcode(): number;
  typeName(): number;
  sig(): string;
  podName(): number;
  static read(in$: sys.InStream): FTypeRef;
  signature(pod: FPod): string;
  format(pod: FPod): string;
  isGenericInstance(): boolean;
  equals(obj: sys.JsObj | null): boolean;
  static make(podName: number, typeName: number, sig: string, ...args: unknown[]): FTypeRef;
  write(out: sys.OutStream): void;
  hash(): number;
}

/**
 * IndexedAssignExpr is a subclass of ShortcutExpr used in
 * situations like x[y] += z where we need keep of two extra
 * scratch variables and the get's matching set method. Note
 * this class models the top x[y] += z, NOT the get target
 * which is x[y].
 * 
 * In this example, IndexedAssignExpr shortcuts Int.plus and
 * its target shortcuts List.get:
 * ```
 * x := [2]
 * x[0] += 3
 * ```
 */
export class IndexedAssignExpr extends ShortcutExpr {
  static type$: sys.Type
  scratchA(): MethodVar | null;
  scratchA(it: MethodVar | null): void;
  scratchB(): MethodVar | null;
  scratchB(it: MethodVar | null): void;
  setMethod(): CMethod | null;
  setMethod(it: CMethod | null): void;
  static makeFrom(from$: ShortcutExpr, ...args: unknown[]): IndexedAssignExpr;
}

/**
 * ScanForUsingsAndTypes is the first phase in a two pass
 * parser.  Here we scan thru the tokens to parse using
 * declarations and type definitions so that we can fully
 * define the namespace of types.  The result of this step is
 * to populate each CompilationUnit's using and types, and the
 * PodDef.typeDefs map.
 */
export class ScanForUsingsAndTypes extends CompilerStep {
  static type$: sys.Type
  /**
   * Run the step
   */
  run(): void;
  /**
   * Constructor takes the associated Compiler
   */
  static make(compiler: Compiler, ...args: unknown[]): ScanForUsingsAndTypes;
}

/**
 * FPod is the read/write fcode representation of sys::Pod. 
 * It's main job in life is to manage all the pod-wide constant
 * tables for names, literals, type/slot references and
 * type/slot definitions.
 */
export class FPod extends sys.Obj implements CPod, FConst {
  static type$: sys.Type
  durations(): FTable;
  durations(it: FTable): void;
  zip(): sys.Zip | null;
  zip(it: sys.Zip | null): void;
  floats(): FTable;
  floats(it: FTable): void;
  depends(): sys.List<CDepend>;
  depends(it: sys.List<CDepend>): void;
  methodRefs(): FTable;
  methodRefs(it: FTable): void;
  index(): sys.Map<string, sys.JsObj>;
  index(it: sys.Map<string, sys.JsObj>): void;
  version(): sys.Version;
  version(it: sys.Version): void;
  uris(): FTable;
  uris(it: FTable): void;
  fieldRefs(): FTable;
  fieldRefs(it: FTable): void;
  typeRefs(): FTable;
  typeRefs(it: FTable): void;
  meta(): sys.Map<string, string>;
  meta(it: sys.Map<string, string>): void;
  name(): string;
  name(it: string): void;
  ns(): CNamespace;
  ns(it: CNamespace): void;
  strs(): FTable;
  strs(it: FTable): void;
  ints(): FTable;
  ints(it: FTable): void;
  onFile(): ((arg0: sys.Uri) => sys.OutStream) | null;
  onFile(it: ((arg0: sys.Uri) => sys.OutStream) | null): void;
  names(): FTable;
  names(it: FTable): void;
  ftypesByName(): sys.Map<string, FType> | null;
  ftypesByName(it: sys.Map<string, FType> | null): void;
  decimals(): FTable;
  decimals(it: FTable): void;
  ftypes(): sys.List<FType> | null;
  ftypes(it: sys.List<FType> | null): void;
  addMethodRef(method: CMethod, argCount?: number | null): number;
  integer(index: number): number;
  float(index: number): number;
  /**
   * Read the entire pod into memory (including full type
   * specifications)
   */
  readFully(): void;
  fieldRef(index: number): FFieldRef;
  /**
   * Write the tables and type files out to zip storage
   */
  write(zip?: sys.Zip): void;
  resolveType(name: string, checked: boolean): CType | null;
  /**
   * Read the just the pod and type meta-data, but not each
   * type's full definition
   */
  read(): void;
  /**
   * Get input stream to read the specified file from zip
   * storage.
   */
  in(uri: sys.Uri): sys.InStream | null;
  str(index: number): string;
  decimal(index: number): number;
  resolveTypes(indexes: sys.List<number>): sys.List<CType>;
  addName(val: string): number;
  /**
   * Write every fcode file in this pod
   */
  doWrite(onFile: ((arg0: sys.Uri) => sys.OutStream)): void;
  /**
   * Get output stream to write the specified file to zip
   * storage.
   */
  out(uri: sys.Uri): sys.OutStream;
  duration(index: number): sys.Duration;
  file(): sys.File;
  dump(out?: sys.OutStream): void;
  static make(ns: CNamespace, podName: string, zip: sys.Zip | null, ...args: unknown[]): FPod;
  typeRefStr(index: number): string;
  typeRef(index: number): FTypeRef;
  fieldRefStr(index: number): string;
  types(): sys.List<CType>;
  toType(index: number): CType | null;
  uri(index: number): string;
  n(index: number): string;
  methodRefStr(index: number): string;
  addFieldRef(field: CField): number;
  addTypeRef(t: CType): number;
  methodRef(index: number): FMethodRef;
  /**
   * Return name
   */
  toStr(): string;
  /**
   * Return if this pod has client side JavaScript
   */
  hasJs(): boolean;
  /**
   * If this a foreign function interface pod.
   */
  isForeign(): boolean;
  /**
   * Equality based on pod name.
   */
  equals(t: sys.JsObj | null): boolean;
  /**
   * If this a foreign function interface return the bridge.
   */
  bridge(): CBridge | null;
  /**
   * Hash on name.
   */
  hash(): number;
}

/**
 * SlotDef models a slot definition - a FieldDef or MethodDef
 */
export class SlotDef extends DefNode implements CSlot {
  static type$: sys.Type
  overridden(): boolean;
  overridden(it: boolean): void;
  parentDef(): TypeDef;
  parentDef(it: TypeDef): void;
  name(): string;
  name(it: string): void;
  parent(): CType;
  qname(): string;
  ns(): CNamespace;
  static make(loc: Loc, parentDef: TypeDef, ...args: unknown[]): SlotDef;
  walk(v: Visitor, depth: VisitDepth): void;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  signature(): string;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  flags(): number;
  isSynthetic(): boolean;
  isPrivate(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  toStr(): string;
  isGetter(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  isInternal(): boolean;
  isSetter(): boolean;
  /**
   * Fandoc API docs if available
   */
  doc(): CDoc | null;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  /**
   * Get the facet keyed by given type, or null if not defined.
   */
  facet(qname: string): CFacet | null;
  isCtor(): boolean;
}

/**
 * SlotLiteralExpr
 */
export class SlotLiteralExpr extends Expr {
  static type$: sys.Type
  parent(): CType;
  parent(it: CType): void;
  slot(): CSlot | null;
  slot(it: CSlot | null): void;
  name(): string;
  name(it: string): void;
  static make(loc: Loc, parent: CType, name: string, ...args: unknown[]): SlotLiteralExpr;
  toStr(): string;
  serialize(): string;
}

/**
 * AttrAsm provides support for assembling the attributes table
 * for types and slots.
 */
export class AttrAsm extends CompilerSupport {
  static type$: sys.Type
  fpod(): FPod;
  fpod(it: FPod): void;
  attrs(): sys.List<FAttr>;
  attrs(it: sys.List<FAttr>): void;
  enumOrdinal(ordinal: number): void;
  sourceFile(source: string | null): void;
  facets(facets: sys.List<FacetDef> | null): void;
  static make(compiler: Compiler, fpod: FPod, ...args: unknown[]): AttrAsm;
  u2(name: string, data: number): void;
  add(name: string, data: sys.Buf): void;
  utf(name: string, data: string): void;
  lineNumber(line: number | null): void;
}

/**
 * SuperExpr is used to access super class slots.  It always
 * references the implicit this local variable stored in
 * register zero, but the super class's slot definitions.
 */
export class SuperExpr extends LocalVarExpr {
  static type$: sys.Type
  explicitType(): CType | null;
  explicitType(it: CType | null): void;
  isAssignable(): boolean;
  static make(loc: Loc, explicitType?: CType | null, ...args: unknown[]): SuperExpr;
  toStr(): string;
  register(): number;
}

/**
 * ReflectMethod
 */
export class ReflectMethod extends ReflectSlot implements CMethod {
  static type$: sys.Type
  parent(): CType;
  parent(it: CType): void;
  params(): sys.List<CParam>;
  params(it: sys.List<CParam>): void;
  returns(): CType;
  returns(it: CType): void;
  ns(): ReflectNamespace;
  ns(it: ReflectNamespace): void;
  isGeneric(): boolean;
  isGeneric(it: boolean): void;
  m(): sys.Method;
  m(it: sys.Method): void;
  inheritedReturns(): CType;
  slot(): sys.Slot;
  static make(ns: ReflectNamespace, parent: CType, m: sys.Method, ...args: unknown[]): ReflectMethod;
  /**
   * Is this method the parameterization of a generic method,
   * with all the generic parameters filled in with real types.
   */
  isParameterized(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  isSynthetic(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  /**
   * Return if this method has the exact same parameters as the
   * specified method.
   */
  hasSameParams(that: CMethod): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  qname(): string;
  inheritedReturnType(): CType;
  toStr(): string;
  isInternal(): boolean;
  /**
   * Return a string with the name and parameters.
   */
  nameAndParamTypesToStr(): string;
  name(): string;
  /**
   * Fandoc API docs if available
   */
  doc(): CDoc | null;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  returnType(): CType;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  signature(): string;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  flags(): number;
  isPrivate(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  isGetter(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  /**
   * If isParameterized is true, then return the generic method
   * which this method parameterizes, otherwise null
   */
  generic(): CMethod | null;
  isSetter(): boolean;
  /**
   * Does this method have a covariant return type (we don't
   * count This returns as covariant)
   */
  isCovariant(): boolean;
  /**
   * Get the facet keyed by given type, or null if not defined.
   */
  facet(qname: string): CFacet | null;
  isCtor(): boolean;
}

/**
 * Assemble is responsible for assembling the resolved,
 * analyzed, normalized abstract syntax tree into it's fcode
 * representation in memory as a FPod stored on compiler.fpod.
 */
export class Assemble extends CompilerStep {
  static type$: sys.Type
  /**
   * Run the step
   */
  run(): void;
  /**
   * Constructor takes the associated Compiler
   */
  static make(compiler: Compiler, ...args: unknown[]): Assemble;
}

/**
 * ShortcutExpr is used for operator expressions which are a
 * shortcut to a method call:
 * ```
 * a + b     =>  a.plus(b)
 * a - b     =>  a.minus(b)
 * a * b     =>  a.mult(b)
 * a / b     =>  a.div(b)
 * a % b     =>  a.mod(b)
 * a[b]      =>  a.get(b)
 * a[b] = c  =>  a.set(b, c)
 * -a        =>  a.negate()
 * ++a, a++  =>  a.increment()
 * --a, a--  =>  a.decrement()
 * a == b    =>  a.equals(b)
 * a != b    =>  ! a.equals(b)
 * a <=>     =>  a.compare(b)
 * a > b     =>  a.compare(b) > 0
 * a >= b    =>  a.compare(b) >= 0
 * a < b     =>  a.compare(b) < 0
 * a <= b    =>  a.compare(b) <= 0
 * ```
 */
export class ShortcutExpr extends CallExpr {
  static type$: sys.Type
  isPostfixLeave(): boolean;
  isPostfixLeave(it: boolean): void;
  tempVar(): MethodVar | null;
  tempVar(it: MethodVar | null): void;
  opToken(): Token;
  opToken(it: Token): void;
  op(): ShortcutOp;
  op(it: ShortcutOp): void;
  isAssignable(): boolean;
  isAssign(): boolean;
  static makeUnary(loc: Loc, opToken: Token, operand: Expr, ...args: unknown[]): ShortcutExpr;
  toStr(): string;
  static makeGet(loc: Loc, target: Expr, index: Expr, ...args: unknown[]): ShortcutExpr;
  assignRequiresTempVar(): boolean;
  isStrConcat(): boolean;
  isStmt(): boolean;
  isCompare(): boolean;
  static makeBinary(lhs: Expr, opToken: Token, rhs: Expr, ...args: unknown[]): ShortcutExpr;
  static makeFrom(from$: ShortcutExpr, ...args: unknown[]): ShortcutExpr;
  assignTarget(): sys.JsObj | null;
  print(out: AstWriter): void;
}

/**
 * FMethodVar models one parameter or local variable in a
 * FMethod
 */
export class FMethodVar extends sys.Obj implements FConst, CParam {
  static type$: sys.Type
  def(): sys.Buf | null;
  def(it: sys.Buf | null): void;
  defNameIndex(): number;
  defNameIndex(it: number): void;
  fmethod(): FMethod;
  fmethod(it: FMethod): void;
  flags(): number;
  flags(it: number): void;
  nameIndex(): number;
  nameIndex(it: number): void;
  typeRef(): number;
  typeRef(it: number): void;
  type(): CType;
  write(out: sys.OutStream): void;
  toStr(): string;
  read(in$: sys.InStream): FMethodVar;
  fpod(): FPod;
  name(): string;
  isParam(): boolean;
  static make(fmethod: FMethod, ...args: unknown[]): FMethodVar;
  hasDefault(): boolean;
  paramType(): CType;
}

/**
 * MapLiteralExpr creates a List instance
 */
export class MapLiteralExpr extends Expr {
  static type$: sys.Type
  vals(): sys.List<Expr>;
  vals(it: sys.List<Expr>): void;
  keys(): sys.List<Expr>;
  keys(it: sys.List<Expr>): void;
  explicitType(): MapType | null;
  explicitType(it: MapType | null): void;
  static make(loc: Loc, explicitType?: MapType | null, ...args: unknown[]): MapLiteralExpr;
  toStr(): string;
  format(f: ((arg0: Expr) => string)): string;
  serialize(): string;
  walkChildren(v: Visitor): void;
}

/**
 * LocaleLiteralExpr: podName::key=defVal
 */
export class LocaleLiteralExpr extends Expr {
  static type$: sys.Type
  def(): string | null;
  def(it: string | null): void;
  pattern(): string;
  pattern(it: string): void;
  key(): string;
  key(it: string): void;
  podName(): string | null;
  podName(it: string | null): void;
  static make(loc: Loc, pattern: string, ...args: unknown[]): LocaleLiteralExpr;
  toStr(): string;
}

/**
 * ShortcutOp is a sub-id for ExprId.shortcut which identifies
 * the an shortuct operation and it's method call
 */
export class ShortcutOp extends sys.Enum {
  static type$: sys.Type
  symbol(): string;
  static minus(): ShortcutOp;
  static mult(): ShortcutOp;
  static mod(): ShortcutOp;
  /**
   * List of ShortcutOp values indexed by ordinal
   */
  static vals(): sys.List<ShortcutOp>;
  static cmp(): ShortcutOp;
  static increment(): ShortcutOp;
  isOperator(): boolean;
  static div(): ShortcutOp;
  static get(): ShortcutOp;
  static add(): ShortcutOp;
  static set(): ShortcutOp;
  degree(): number;
  methodName(): string;
  static eq(): ShortcutOp;
  static plus(): ShortcutOp;
  static negate(): ShortcutOp;
  static decrement(): ShortcutOp;
  static fromPrefix(prefix: string): ShortcutOp | null;
  formatErr(lhs: CType, rhs: CType): string;
  /**
   * Return the ShortcutOp instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): ShortcutOp;
}

/**
 * Using models an using import statement.
 */
export class Using extends Node {
  static type$: sys.Type
  resolvedPod(): CPod | null;
  resolvedPod(it: CPod | null): void;
  asName(): string | null;
  asName(it: string | null): void;
  typeName(): string | null;
  typeName(it: string | null): void;
  resolvedType(): CType | null;
  resolvedType(it: CType | null): void;
  podName(): string;
  podName(it: string): void;
  toStr(): string;
  /**
   * Does this using import the entire pod
   */
  isPod(): boolean;
  print(out: AstWriter): void;
  static make(loc: Loc, ...args: unknown[]): Using;
}

/**
 * TokenVal stores an instance of a Token at a specific
 * location.
 */
export class TokenVal extends Loc {
  static type$: sys.Type
  val(): sys.JsObj | null;
  val(it: sys.JsObj | null): void;
  kind(): Token;
  kind(it: Token): void;
  newline(): boolean;
  newline(it: boolean): void;
  whitespace(): boolean;
  whitespace(it: boolean): void;
  toStr(): string;
  /**
   * Get this token as Fantom source code.
   */
  toCode(): string;
  /**
   * Return if this token is a left opening paren, but only if on
   * the same line:
   * 
   * Ok:
   * ```
   * call(...)
   * ```
   * 
   * Not ok:
   * ```
   * call
   *   (...)
   * ```
   */
  isCallOpenParen(): boolean;
  /**
   * Return if this token is a left opening bracket, but only if
   * on the same line:
   * 
   * Ok:
   * ```
   * expr[...]
   * ```
   * 
   * Not ok:
   * ```
   * expr
   *   [...]
   * ```
   */
  isIndexOpenBracket(): boolean;
  equals(obj: sys.JsObj | null): boolean;
  static make(kind: Token, val?: sys.JsObj | null, ...args: unknown[]): TokenVal;
  hash(): number;
}

/**
 * Extra information for DSL tokens.
 */
export class TokenValDsl extends TokenVal {
  static type$: sys.Type
  leadingTabs(): number;
  leadingTabs(it: number): void;
  leadingSpaces(): number;
  leadingSpaces(it: number): void;
  static make(kind: Token, src: string, tabs: number, spaces: number, ...args: unknown[]): TokenValDsl;
}

/**
 * Compiler manages the top level process of the compiler
 * pipeline. There are a couple different "pipelines" used to
 * accomplish various twists on compiling Fantom code (from
 * memory, files, etc). The pipelines are implemented as
 * discrete CompilerSteps. As the steps are executed, the
 * Compiler instance itself stores the state as we move from
 * files -> ast -> resolved ast -> code.
 * 
 * Error reporting is managed via the Compiler.errors list.  If
 * the compiler encounters problems it accumulates the errors
 * as CompileExceptions in this list, then raises the first
 * exception to the caller.  All errors go thru the
 * CompilerSupport.err() methods for logging.  To log an error
 * and continue we simply call err().  To fail fast, we code
 * something like: throw err(). Or at the end of a step we may
 * call bombIfErr() which throws the first exception if any
 * errors have accumulated.
 */
export class Compiler extends sys.Obj {
  static type$: sys.Type
  errs(): sys.List<CompilerErr>;
  errs(it: sys.List<CompilerErr>): void;
  pod(): PodDef | null;
  pod(it: PodDef | null): void;
  log(): CompilerLog;
  log(it: CompilerLog): void;
  ns(): CNamespace | null;
  ns(it: CNamespace | null): void;
  localeProps(): string | null;
  localeProps(it: string | null): void;
  js(): string | null;
  js(it: string | null): void;
  jsPropsFiles(): sys.List<sys.File> | null;
  jsPropsFiles(it: sys.List<sys.File> | null): void;
  output(): CompilerOutput | null;
  output(it: CompilerOutput | null): void;
  resFiles(): sys.List<sys.File> | null;
  resFiles(it: sys.List<sys.File> | null): void;
  warns(): sys.List<CompilerErr>;
  warns(it: sys.List<CompilerErr>): void;
  wrappers(): sys.Map<string, CField>;
  wrappers(it: sys.Map<string, CField>): void;
  srcFiles(): sys.List<sys.File> | null;
  srcFiles(it: sys.List<sys.File> | null): void;
  jsSourceMap(): string | null;
  jsSourceMap(it: string | null): void;
  types(): sys.List<TypeDef> | null;
  types(it: sys.List<TypeDef> | null): void;
  depends(): sys.List<CDepend>;
  depends(it: sys.List<CDepend>): void;
  cjs(): string | null;
  cjs(it: string | null): void;
  cjsSourceMap(): string | null;
  cjsSourceMap(it: string | null): void;
  tsDecl(): string | null;
  tsDecl(it: string | null): void;
  fpod(): FPod | null;
  fpod(it: FPod | null): void;
  input(): CompilerInput;
  input(it: CompilerInput): void;
  closures(): sys.List<ClosureExpr> | null;
  closures(it: sys.List<ClosureExpr> | null): void;
  jsFiles(): sys.List<sys.File> | null;
  jsFiles(it: sys.List<sys.File> | null): void;
  jsPod(): sys.JsObj | null;
  jsPod(it: sys.JsObj | null): void;
  localeDefs(): sys.List<LocaleLiteralExpr>;
  localeDefs(it: sys.List<LocaleLiteralExpr>): void;
  isSys(): boolean;
  isSys(it: boolean): void;
  esm(): string | null;
  esm(it: string | null): void;
  /**
   * Compile fan source code from the configured CompilerInput
   * into a fan pod and return the resulting CompilerOutput.
   */
  compile(): CompilerOutput;
  /**
   * Execute back-end compiler pipeline
   */
  backend(): void;
  /**
   * Construct with reasonable defaults
   */
  static make(input: CompilerInput, ...args: unknown[]): Compiler;
  /**
   * Execute front-end compiler pipeline
   */
  frontend(): void;
}

/**
 * FType is the read/write fcode representation of sys::Type.
 */
export class FType extends sys.Obj implements CType {
  static type$: sys.Type
  fmethods(): sys.List<FMethod> | null;
  fmethods(it: sys.List<FMethod> | null): void;
  hollow(): boolean;
  hollow(it: boolean): void;
  fpod(): FPod;
  fpod(it: FPod): void;
  fmixins(): sys.List<number> | null;
  fmixins(it: sys.List<number> | null): void;
  flags(): number;
  flags(it: number): void;
  ffields(): sys.List<FField> | null;
  ffields(it: sys.List<FField> | null): void;
  fattrs(): sys.List<FAttr> | null;
  fattrs(it: sys.List<FAttr> | null): void;
  self(): number;
  self(it: number): void;
  ffacets(): sys.List<FFacet> | null;
  ffacets(it: sys.List<FFacet> | null): void;
  fbase(): number;
  fbase(it: number): void;
  base(): CType | null;
  base(it: CType | null): void;
  isParameterized(): boolean;
  mixins(): sys.List<CType>;
  qname(): string;
  write(): void;
  doc(): CDoc | null;
  pod(): FPod;
  signature(): string;
  operators(): COperators;
  isVal(): boolean;
  uri(): sys.Uri;
  facet(qname: string): CFacet | null;
  read(): void;
  writeMeta(out: sys.OutStream): void;
  slots(): sys.Map<string, CSlot>;
  isGenericParameter(): boolean;
  isNullable(): boolean;
  name(): string;
  ns(): CNamespace;
  toNullable(): CType;
  attr(name: string): FAttr | null;
  static make(fpod: FPod, ...args: unknown[]): FType;
  isGeneric(): boolean;
  toListOf(): CType;
  readMeta(in$: sys.InStream): this;
  isNum(): boolean;
  /**
   * If this type is being used for type inference then get the
   * type as it should be inferred.  Typically we just return
   * this. However some FFI types such as `[java]::int` are never
   * used on the stack directly and are inferred to be `sys::Int`.
   */
  inferredAs(): CType;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  /**
   * Is this a compiler generated synthetic class
   */
  isSynthetic(): boolean;
  /**
   * Return if this type fits any of the types in the specified
   * list.
   */
  fitsAny(types: sys.List<CType>): boolean;
  /**
   * Is the entire class implemented in native code?
   */
  isNative(): boolean;
  /**
   * Is this type ok to use as a const field?  Any const type
   * fine, plus we allow Obj, List, Map, Buf, and Func since they
   * will implicitly have toImmutable called on them.
   */
  isConstFieldType(): boolean;
  isObj(): boolean;
  isBool(): boolean;
  isBuf(): boolean;
  isInt(): boolean;
  isDecimal(): boolean;
  /**
   * Return if this Type is an sys::Facet
   */
  isFacet(): boolean;
  isNothing(): boolean;
  /**
   * Return signature
   */
  toStr(): string;
  /**
   * Lookup a method by name (null if field).
   */
  method(name: string): CMethod | null;
  /**
   * If this TypeDef extends from a FFI class or implements any
   * FFI mixins, then return the FFI type otherwise return null.
   */
  foreignInheritance(): CType | null;
  /**
   * If this type is a generic parameter (V, L, etc), then return
   * the actual type for the native implementation.  For example
   * V is Obj, and L is List.  This is the type we actually use
   * when constructing a signature for the invoke opcode.
   */
  raw(): CType;
  /**
   * Return if type is supported by the Fantom type system.  For
   * example the Java FFI will correctly model a Java
   * multi-dimensional array during compilation, however there is
   * no Fantom representation.  We check for supported types
   * during CheckErrors when accessing fields and methods.
   */
  isSupported(): boolean;
  isFunc(): boolean;
  /**
   * Does this type implement the specified type.  If true, then
   * this type is assignable to the specified type (although the
   * converse is not necessarily true).  All types (including
   * mixin types) fit sys::Obj.
   */
  fits(t: CType): boolean;
  isType(): boolean;
  isMap(): boolean;
  /**
   * Is this an internally scoped class
   */
  isInternal(): boolean;
  /**
   * Return if this type contains a slot by the specified name.
   */
  hasSlot(name: string): boolean;
  /**
   * Lookup a field by name (null if method).
   */
  field(name: string): CField | null;
  /**
   * If this is a foreign function return the bridge.
   */
  bridge(): CBridge | null;
  /**
   * List of the all defined fields (including inherited fields).
   */
  fields(): sys.List<CField>;
  /**
   * Hash on signature.
   */
  hash(): number;
  /**
   * Get this type as a non-nullable (if nullable)
   */
  toNonNullable(): CType;
  isThis(): boolean;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  /**
   * If this is a TypeRef, return what it references
   */
  deref(): CType;
  /**
   * List of the all instance constructors.
   */
  instanceCtors(): sys.List<CMethod>;
  /**
   * If this a foreign function interface type.
   */
  isForeign(): boolean;
  /**
   * List of the all defined methods (including inherited
   * methods).
   */
  methods(): sys.List<CMethod>;
  /**
   * Lookup a slot by name.  If the slot doesn't exist then
   * return null.
   */
  slot(name: string): CSlot | null;
  isList(): boolean;
  /**
   * If this is a parameterized type which uses `This`, then
   * replace `This` with the specified type.
   */
  parameterizeThis(thisType: CType): CType;
  /**
   * Return if this Type is const and immutable.
   */
  isConst(): boolean;
  /**
   * Is this a public scoped class
   */
  isPublic(): boolean;
  isStr(): boolean;
  /**
   * Return if this Type is final and cannot be subclassed.
   */
  isFinal(): boolean;
  /**
   * Return if this Type is a class (as opposed to enum or mixin)
   */
  isClass(): boolean;
  /**
   * Is this a valid type usable anywhere (such as local var)
   */
  isValid(): boolean;
  /**
   * Return if this Type is an sys::Enum
   */
  isEnum(): boolean;
  isFloat(): boolean;
  /**
   * Return if this Type is a mixin type and cannot be
   * instantiated.
   */
  isMixin(): boolean;
  /**
   * Return if this Type is abstract and cannot be instantiated. 
   * This method will always return true if the type is a mixin.
   */
  isAbstract(): boolean;
  isRange(): boolean;
  isVoid(): boolean;
  /**
   * List of the all constructors.
   */
  ctors(): sys.List<CMethod>;
  /**
   * Equality based on signature.
   */
  equals(t: sys.JsObj | null): boolean;
}

/**
 * NullableType wraps another CType as nullable with trailing
 * "?".
 */
export class NullableType extends sys.Obj implements CType {
  static type$: sys.Type
  signature(): string;
  signature(it: string): void;
  root(): CType;
  root(it: CType): void;
  isParameterized(): boolean;
  inferredAs(): CType;
  mixins(): sys.List<CType>;
  qname(): string;
  isSupported(): boolean;
  fits(t: CType): boolean;
  slots(): sys.Map<string, CSlot>;
  isGenericParameter(): boolean;
  isNullable(): boolean;
  name(): string;
  doc(): CDoc | null;
  toNonNullable(): CType;
  pod(): CPod;
  ns(): CNamespace;
  isForeign(): boolean;
  flags(): number;
  toNullable(): CType;
  parameterizeThis(thisType: CType): CType;
  operators(): COperators;
  static make(root: CType, ...args: unknown[]): NullableType;
  isGeneric(): boolean;
  isValid(): boolean;
  isVal(): boolean;
  toListOf(): CType;
  facet(qname: string): CFacet | null;
  base(): CType | null;
  isNum(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  /**
   * Is this a compiler generated synthetic class
   */
  isSynthetic(): boolean;
  /**
   * Return if this type fits any of the types in the specified
   * list.
   */
  fitsAny(types: sys.List<CType>): boolean;
  /**
   * Is the entire class implemented in native code?
   */
  isNative(): boolean;
  /**
   * Is this type ok to use as a const field?  Any const type
   * fine, plus we allow Obj, List, Map, Buf, and Func since they
   * will implicitly have toImmutable called on them.
   */
  isConstFieldType(): boolean;
  isObj(): boolean;
  isBool(): boolean;
  isBuf(): boolean;
  isInt(): boolean;
  isDecimal(): boolean;
  /**
   * Return if this Type is an sys::Facet
   */
  isFacet(): boolean;
  isNothing(): boolean;
  /**
   * Return signature
   */
  toStr(): string;
  /**
   * Lookup a method by name (null if field).
   */
  method(name: string): CMethod | null;
  /**
   * If this TypeDef extends from a FFI class or implements any
   * FFI mixins, then return the FFI type otherwise return null.
   */
  foreignInheritance(): CType | null;
  /**
   * If this type is a generic parameter (V, L, etc), then return
   * the actual type for the native implementation.  For example
   * V is Obj, and L is List.  This is the type we actually use
   * when constructing a signature for the invoke opcode.
   */
  raw(): CType;
  isFunc(): boolean;
  isType(): boolean;
  isMap(): boolean;
  /**
   * Is this an internally scoped class
   */
  isInternal(): boolean;
  /**
   * Return if this type contains a slot by the specified name.
   */
  hasSlot(name: string): boolean;
  /**
   * Lookup a field by name (null if method).
   */
  field(name: string): CField | null;
  /**
   * If this is a foreign function return the bridge.
   */
  bridge(): CBridge | null;
  /**
   * List of the all defined fields (including inherited fields).
   */
  fields(): sys.List<CField>;
  /**
   * Hash on signature.
   */
  hash(): number;
  isThis(): boolean;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  /**
   * If this is a TypeRef, return what it references
   */
  deref(): CType;
  /**
   * List of the all instance constructors.
   */
  instanceCtors(): sys.List<CMethod>;
  /**
   * List of the all defined methods (including inherited
   * methods).
   */
  methods(): sys.List<CMethod>;
  /**
   * Lookup a slot by name.  If the slot doesn't exist then
   * return null.
   */
  slot(name: string): CSlot | null;
  isList(): boolean;
  /**
   * Return if this Type is const and immutable.
   */
  isConst(): boolean;
  /**
   * Is this a public scoped class
   */
  isPublic(): boolean;
  isStr(): boolean;
  /**
   * Return if this Type is final and cannot be subclassed.
   */
  isFinal(): boolean;
  /**
   * Return if this Type is a class (as opposed to enum or mixin)
   */
  isClass(): boolean;
  /**
   * Return if this Type is an sys::Enum
   */
  isEnum(): boolean;
  isFloat(): boolean;
  /**
   * Return if this Type is a mixin type and cannot be
   * instantiated.
   */
  isMixin(): boolean;
  /**
   * Return if this Type is abstract and cannot be instantiated. 
   * This method will always return true if the type is a mixin.
   */
  isAbstract(): boolean;
  isRange(): boolean;
  isVoid(): boolean;
  /**
   * List of the all constructors.
   */
  ctors(): sys.List<CMethod>;
  /**
   * Equality based on signature.
   */
  equals(t: sys.JsObj | null): boolean;
}

/**
 * FFieldRef
 */
export class FFieldRef extends sys.Obj {
  static type$: sys.Type
  parent(): number;
  hashcode(): number;
  name(): number;
  typeRef(): number;
  static read(in$: sys.InStream): FFieldRef;
  format(pod: FPod): string;
  equals(obj: sys.JsObj | null): boolean;
  static make(parent: number, name: number, typeRef: number, ...args: unknown[]): FFieldRef;
  write(out: sys.OutStream): void;
  hash(): number;
}

/**
 * FAttr is attribute meta-data for a FType or FSlot
 */
export class FAttr extends sys.Obj implements FConst {
  static type$: sys.Type
  data(): sys.Buf | null;
  data(it: sys.Buf | null): void;
  name(): number;
  name(it: number): void;
  u2(): number;
  write(out: sys.OutStream): void;
  static make(...args: unknown[]): FAttr;
  read(in$: sys.InStream): FAttr;
  utf(): string;
}

/**
 * FieldDef models a field definition
 */
export class FieldDef extends SlotDef implements CField {
  static type$: sys.Type
  type(): CType;
  type(it: CType): void;
  init(): Expr | null;
  init(it: Expr | null): void;
  field(): sys.Field | null;
  field(it: sys.Field | null): void;
  requiresNullCheck(): boolean;
  requiresNullCheck(it: boolean): void;
  closureInfo(): string | null;
  closureInfo(it: string | null): void;
  inheritedRet(): CType | null;
  inheritedRet(it: CType | null): void;
  walkInit(): boolean;
  walkInit(it: boolean): void;
  get(): MethodDef | null;
  get(it: MethodDef | null): void;
  set(): MethodDef | null;
  set(it: MethodDef | null): void;
  concreteBase(): CField | null;
  concreteBase(it: CField | null): void;
  enumDef(): EnumDef | null;
  enumDef(it: EnumDef | null): void;
  getter(): CMethod | null;
  makeAccessorExpr(loc: Loc, useAccessor: boolean): FieldExpr;
  inheritedReturns(): CType;
  signature(): string;
  hasGet(): boolean;
  static make(loc: Loc, parent: TypeDef, name?: string, flags?: number, ...args: unknown[]): FieldDef;
  hasSet(): boolean;
  print(out: AstWriter): void;
  setter(): CMethod | null;
  walk(v: Visitor, depth: VisitDepth): void;
  parent(): CType;
  /**
   * Is this field the parameterization of a generic field, with
   * the generic type replaced with a real type.
   */
  isParameterized(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  isSynthetic(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  qname(): string;
  toStr(): string;
  isInternal(): boolean;
  name(): string;
  /**
   * Fandoc API docs if available
   */
  doc(): CDoc | null;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  fieldType(): CType;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  ns(): CNamespace;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  flags(): number;
  isPrivate(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  isGetter(): boolean;
  /**
   * Is this field typed with a generic parameter.
   */
  isGeneric(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  isSetter(): boolean;
  /**
   * Does this field covariantly override a method?
   */
  isCovariant(): boolean;
  /**
   * Get the facet keyed by given type, or null if not defined.
   */
  facet(qname: string): CFacet | null;
  isCtor(): boolean;
}

/**
 * DefNode is the abstract base class for definition nodes such
 * as TypeDef, MethodDef, and FieldDef.  All definitions may be
 * documented using a Javadoc style FanDoc comment.
 */
export class DefNode extends Node implements CNode {
  static type$: sys.Type
  docDef(): DocDef | null;
  docDef(it: DocDef | null): void;
  flags(): number;
  flags(it: number): void;
  facets(): sys.List<FacetDef> | null;
  facets(it: sys.List<FacetDef> | null): void;
  walkFacets(v: Visitor, depth: VisitDepth): void;
  printFacets(out: AstWriter): void;
  static make(loc: Loc, ...args: unknown[]): DefNode;
  doc(): CDoc | null;
  addFacet(support: CompilerSupport, type: CType, vals?: sys.Map<string, sys.JsObj> | null): void;
  facet(qname: string): CFacet | null;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  /**
   * Associated namespace for this type representation
   */
  ns(): CNamespace;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
}

/**
 * FOp provides all the fcode constants
 */
export class FOp extends sys.Enum {
  static type$: sys.Type
  static CatchEnd(): FOp;
  static FinallyStart(): FOp;
  static LoadStr(): FOp;
  static CmpNotNull(): FOp;
  static StoreMixinStatic(): FOp;
  static LoadVar(): FOp;
  static StoreVar(): FOp;
  static Throw(): FOp;
  static LoadFloat(): FOp;
  static CallVirtual(): FOp;
  static Cmp(): FOp;
  static CallNew(): FOp;
  static JumpFalse(): FOp;
  static CmpNotSame(): FOp;
  static LoadDecimal(): FOp;
  static Nop(): FOp;
  static LoadDuration(): FOp;
  static Pop(): FOp;
  static CmpEQ(): FOp;
  static CatchAllStart(): FOp;
  static Switch(): FOp;
  static LoadMixinStatic(): FOp;
  static CallCtor(): FOp;
  static LoadType(): FOp;
  static StoreInstance(): FOp;
  static CmpNE(): FOp;
  static CmpSame(): FOp;
  static LoadInt(): FOp;
  /**
   * List of FOp values indexed by ordinal
   */
  static vals(): sys.List<FOp>;
  static Leave(): FOp;
  static Is(): FOp;
  static CallMixinVirtual(): FOp;
  static CmpLT(): FOp;
  static CatchErrStart(): FOp;
  static LoadUri(): FOp;
  static As(): FOp;
  static CallMixinStatic(): FOp;
  arg(): FOpArg;
  static CmpNull(): FOp;
  static LoadInstance(): FOp;
  static JumpTrue(): FOp;
  static Dup(): FOp;
  static LoadFalse(): FOp;
  static FinallyEnd(): FOp;
  static Return(): FOp;
  static CallMixinNonVirtual(): FOp;
  static JumpFinally(): FOp;
  static CmpGE(): FOp;
  static LoadTrue(): FOp;
  static StoreStatic(): FOp;
  static Jump(): FOp;
  static CmpGT(): FOp;
  static CallNonVirtual(): FOp;
  static LoadNull(): FOp;
  static CallStatic(): FOp;
  static LoadStatic(): FOp;
  static Coerce(): FOp;
  static CmpLE(): FOp;
  /**
   * Return the FOp instance for the specified name.  If not a
   * valid name and checked is false return null, otherwise throw
   * ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): FOp;
}

/**
 * InitFacet is used to auto-generate AST modifications to
 * facet classes.
 */
export class InitFacet extends CompilerStep {
  static type$: sys.Type
  fields(): sys.List<FieldDef> | null;
  fields(it: sys.List<FieldDef> | null): void;
  ctors(): sys.List<MethodDef> | null;
  ctors(it: sys.List<MethodDef> | null): void;
  visitTypeDef(t: TypeDef): void;
  run(): void;
  static make(compiler: Compiler, ...args: unknown[]): InitFacet;
}

/**
 * ClosureToImmutable processes each closure to determine its
 * immutability.  At this point, all the enclosed variables
 * have been mapped to fields by ClosureVars.  So we have three
 * cases:
 * 1. If every field is known const, then the function is always
 *   immutable, and we can just override isImmutable to return
 *   true.
 * 2. If any field is known to never be const, then the function
 *   can never be immutable, and we just use Func defaults for
 *   isImmutable and toImmutable.
 * 3. In the last case we have fields like Obj or List which
 *   require us calling toImmutable.  In this case we generate a
 *   toImmutable method which constructs a new closure instance
 *   by calling toImmutable on each field.
 */
export class ClosureToImmutable extends CompilerStep {
  static type$: sys.Type
  run(): void;
  /**
   * Are any of the fields known to never be immutable? If any
   * field is not immutable, then return meaningful error
   * message.
   */
  isNeverImmutable(cls: TypeDef): string | null;
  /**
   * Are all the fields known to be const types?
   */
  isAlwaysImmutable(cls: TypeDef): boolean;
  /**
   * Set const flag on every field def.
   */
  setAllFieldsConst(cls: TypeDef): void;
  static make(compiler: Compiler, ...args: unknown[]): ClosureToImmutable;
}

/**
 * FMethod is the read/write fcode representation of
 * sys::Method.
 */
export class FMethod extends FSlot implements CMethod {
  static type$: sys.Type
  vars(): sys.List<FMethodVar> | null;
  vars(it: sys.List<FMethodVar> | null): void;
  maxStack(): number;
  maxStack(it: number): void;
  inheritedRet(): number;
  inheritedRet(it: number): void;
  localCount(): number;
  localCount(it: number): void;
  ret(): number;
  ret(it: number): void;
  code(): sys.Buf | null;
  code(it: sys.Buf | null): void;
  paramCount(): number;
  paramCount(it: number): void;
  fparams(): sys.List<FMethodVar>;
  write(out: sys.OutStream): void;
  params(): sys.List<CParam>;
  returns(): CType;
  signature(): string;
  read(in$: sys.InStream): this;
  inheritedReturns(): CType;
  dump(): void;
  static make(fparent: FType, ...args: unknown[]): FMethod;
  isGeneric(): boolean;
  parent(): CType;
  /**
   * Is this method the parameterization of a generic method,
   * with all the generic parameters filled in with real types.
   */
  isParameterized(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  isSynthetic(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  /**
   * Return if this method has the exact same parameters as the
   * specified method.
   */
  hasSameParams(that: CMethod): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  qname(): string;
  inheritedReturnType(): CType;
  toStr(): string;
  isInternal(): boolean;
  /**
   * Return a string with the name and parameters.
   */
  nameAndParamTypesToStr(): string;
  name(): string;
  /**
   * Fandoc API docs if available
   */
  doc(): CDoc | null;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  returnType(): CType;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  ns(): CNamespace;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  flags(): number;
  isPrivate(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  isGetter(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  /**
   * If isParameterized is true, then return the generic method
   * which this method parameterizes, otherwise null
   */
  generic(): CMethod | null;
  isSetter(): boolean;
  /**
   * Does this method have a covariant return type (we don't
   * count This returns as covariant)
   */
  isCovariant(): boolean;
  /**
   * Get the facet keyed by given type, or null if not defined.
   */
  facet(qname: string): CFacet | null;
  isCtor(): boolean;
}

/**
 * ThisExpr models the "this" keyword to access the implicit
 * this local variable always stored in register zero.
 */
export class ThisExpr extends LocalVarExpr {
  static type$: sys.Type
  isAssignable(): boolean;
  static make(loc: Loc, ctype?: CType | null, ...args: unknown[]): ThisExpr;
  toStr(): string;
  register(): number;
}

/**
 * CParam models a MethodParam in the compiler.  CParams unify
 * the params being compiled (ParamDef) and parameters imported
 * (ReflectParam, FMethodVar)
 */
export abstract class CParam extends sys.Obj {
  static type$: sys.Type
  type(): CType;
  hasDefault(): boolean;
  paramType(): CType;
  name(): string;
}

/**
 * TryStmt models a try/catch/finally block
 */
export class TryStmt extends Stmt {
  static type$: sys.Type
  exception(): Expr | null;
  exception(it: Expr | null): void;
  catches(): sys.List<Catch>;
  catches(it: sys.List<Catch>): void;
  finallyBlock(): Block | null;
  finallyBlock(it: Block | null): void;
  block(): Block | null;
  block(it: Block | null): void;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  isExit(): boolean;
  static make(loc: Loc, ...args: unknown[]): TryStmt;
  print(out: AstWriter): void;
  walkChildren(v: Visitor, depth: VisitDepth): void;
}

/**
 * ResolveDepends resolves each dependency to a CPod and checks
 * the version.  We also set CNamespace.depends in this step.
 */
export class ResolveDepends extends CompilerStep {
  static type$: sys.Type
  loc(): Loc;
  loc(it: Loc): void;
  /**
   * Run the step
   */
  run(): void;
  /**
   * Constructor takes the associated Compiler
   */
  static make(compiler: Compiler, ...args: unknown[]): ResolveDepends;
}

/**
 * IfStmt models an if or if/else statement.
 */
export class IfStmt extends Stmt {
  static type$: sys.Type
  falseBlock(): Block | null;
  falseBlock(it: Block | null): void;
  trueBlock(): Block;
  trueBlock(it: Block): void;
  condition(): Expr;
  condition(it: Expr): void;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  isExit(): boolean;
  print(out: AstWriter): void;
  static make(loc: Loc, condition: Expr, trueBlock: Block, ...args: unknown[]): IfStmt;
  walkChildren(v: Visitor, depth: VisitDepth): void;
}

/**
 * UsingAndTypeScanner
 */
export class UsingAndTypeScanner extends CompilerSupport {
  static type$: sys.Type
  static make(compiler: Compiler, unit: CompilationUnit, allTypes: sys.Map<string, TypeDef>, ...args: unknown[]): UsingAndTypeScanner;
  parse(): void;
}

/**
 * ReflectSlot is the implementation of CSlot for a slot
 * imported from a precompiled pod (as opposed to a SlotDef
 * within the compilation units being compiled).
 */
export class ReflectSlot extends sys.Obj implements CSlot {
  static type$: sys.Type
  qname(): string;
  name(): string;
  doc(): CDoc | null;
  signature(): string;
  flags(): number;
  slot(): sys.Slot;
  static make(...args: unknown[]): ReflectSlot;
  facet(qname: string): CFacet | null;
  parent(): CType;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  ns(): CNamespace;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  isSynthetic(): boolean;
  isPrivate(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  toStr(): string;
  isGetter(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  isInternal(): boolean;
  isSetter(): boolean;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  isCtor(): boolean;
}

/**
 * During the Parse step we created a list of all the closures.
 * In InitClosures we map each ClosureExpr into a TypeDef as an
 * anonymous class, then we map ClosureExpr.substitute to call
 * the constructor anonymous class.
 */
export class InitClosures extends CompilerStep {
  static type$: sys.Type
  closure(): ClosureExpr | null;
  closure(it: ClosureExpr | null): void;
  cls(): TypeDef | null;
  cls(it: TypeDef | null): void;
  ctor(): MethodDef | null;
  ctor(it: MethodDef | null): void;
  loc(): Loc | null;
  loc(it: Loc | null): void;
  signature(): FuncType | null;
  signature(it: FuncType | null): void;
  doCall(): MethodDef | null;
  doCall(it: MethodDef | null): void;
  enclosingType(): TypeDef | null;
  enclosingType(it: TypeDef | null): void;
  run(): void;
  /**
   * This method overrides either call(List) or callx(A...) to
   * push the args onto the stack, then redirect to the specified
   * CallExpr c. We share this code for both closures and
   * curries.
   */
  static genMethodCall(compiler: Compiler, loc: Loc, parent: TypeDef, signature: FuncType, c: CallExpr, firstAsTarget: boolean): MethodDef;
  static make(compiler: Compiler, ...args: unknown[]): InitClosures;
}

/**
 * FPrinter is used to pretty print fcode
 */
export class FPrinter extends sys.Obj implements FConst {
  static type$: sys.Type
  showIndex(): boolean;
  showIndex(it: boolean): void;
  pod(): FPod;
  pod(it: FPod): void;
  showCode(): boolean;
  showCode(it: boolean): void;
  out(): sys.OutStream;
  out(it: sys.OutStream): void;
  showLines(): boolean;
  showLines(it: boolean): void;
  enumOrdinalAttr(attr: FAttr): void;
  tables(): void;
  sourceFileAttr(attr: FAttr): void;
  lineNumbersAttr(attr: FAttr): void;
  all(): void;
  printLine(obj?: sys.JsObj): FPrinter;
  method(m: FMethod): void;
  lineNumberAttr(attr: FAttr): void;
  index(index: number): string;
  facetsAttr(attr: FAttr): void;
  attrs(attrs: sys.List<FAttr> | null): void;
  field(f: FField): void;
  name(i: number): string;
  code(code: sys.Buf): void;
  flags(flags: number): string;
  slot(s: FSlot): void;
  attr(attr: FAttr): void;
  static make(pod: FPod, out?: sys.OutStream, ...args: unknown[]): FPrinter;
  table(title: string, table: FTable): void;
  typeRef(i: number): string;
  print(obj: sys.JsObj): FPrinter;
  ftype(t: FType): void;
  ftypes(): void;
  errTableAttr(attr: FAttr): void;
}

/**
 * Token is the enum for all the token types.
 */
export class Token extends sys.Enum {
  static type$: sys.Type
  static decimalLiteral(): Token;
  static forKeyword(): Token;
  static nullKeyword(): Token;
  static throwKeyword(): Token;
  static doubleColon(): Token;
  static elseKeyword(): Token;
  static assignPercent(): Token;
  static returnKeyword(): Token;
  static bang(): Token;
  static assignSlash(): Token;
  static overrideKeyword(): Token;
  static caseKeyword(): Token;
  static identifier(): Token;
  static caret(): Token;
  static rbrace(): Token;
  static finalKeyword(): Token;
  static at(): Token;
  static switchKeyword(): Token;
  static thisKeyword(): Token;
  static assignPlus(): Token;
  static notSame(): Token;
  static rparen(): Token;
  static minus(): Token;
  static voidKeyword(): Token;
  static dotDotLt(): Token;
  static assignMinus(): Token;
  /**
   * List of Token values indexed by ordinal
   */
  static vals(): sys.List<Token>;
  static cmp(): Token;
  static dot(): Token;
  static docComment(): Token;
  static increment(): Token;
  static gtEq(): Token;
  static lparenSynthetic(): Token;
  static dollar(): Token;
  static same(): Token;
  static abstractKeyword(): Token;
  static trueKeyword(): Token;
  static strLiteral(): Token;
  static star(): Token;
  static question(): Token;
  static ltEq(): Token;
  static breakKeyword(): Token;
  static intLiteral(): Token;
  static comma(): Token;
  static tryKeyword(): Token;
  static decrement(): Token;
  static doublePipe(): Token;
  static mixinKeyword(): Token;
  static durationLiteral(): Token;
  static ifKeyword(): Token;
  static usingKeyword(): Token;
  static rbracket(): Token;
  /**
   * Get string used to display token to user in error messages
   */
  symbol(): string;
  static defaultKeyword(): Token;
  /**
   * Get a map of the keywords
   */
  static keywords(): sys.Map<string, Token>;
  /**
   * Is this an assignment token such as "=", etc "+=", etc
   */
  isAssign(): boolean;
  static arrow(): Token;
  static staticKeyword(): Token;
  static whileKeyword(): Token;
  static lt(): Token;
  static superKeyword(): Token;
  static safeArrow(): Token;
  static lbracket(): Token;
  static localeLiteral(): Token;
  static asKeyword(): Token;
  static defAssign(): Token;
  static floatLiteral(): Token;
  static pipe(): Token;
  static assertKeyword(): Token;
  static onceKeyword(): Token;
  /**
   * Is this a keyword token such as "null"
   */
  keyword(): boolean;
  static notEq(): Token;
  static publicKeyword(): Token;
  static lbrace(): Token;
  static volatileKeyword(): Token;
  static eq(): Token;
  static internalKeyword(): Token;
  static plus(): Token;
  static continueKeyword(): Token;
  static readonlyKeyword(): Token;
  static dotDot(): Token;
  static isKeyword(): Token;
  static dsl(): Token;
  static lparen(): Token;
  static nativeKeyword(): Token;
  static virtualKeyword(): Token;
  static doubleAmp(): Token;
  static safeDot(): Token;
  static amp(): Token;
  static classKeyword(): Token;
  static foreachKeyword(): Token;
  static isnotKeyword(): Token;
  static tilde(): Token;
  static percent(): Token;
  static newKeyword(): Token;
  static pound(): Token;
  static doKeyword(): Token;
  static constKeyword(): Token;
  static protectedKeyword(): Token;
  static elvis(): Token;
  static uriLiteral(): Token;
  static semicolon(): Token;
  static privateKeyword(): Token;
  static finallyKeyword(): Token;
  static falseKeyword(): Token;
  static gt(): Token;
  static catchKeyword(): Token;
  static colon(): Token;
  static itKeyword(): Token;
  static slash(): Token;
  static eof(): Token;
  static assignStar(): Token;
  static assign(): Token;
  toStr(): string;
  /**
   * Get this Token as a ExprId or throw Err.
   */
  toExprId(): ExprId;
  static main(): void;
  /**
   * Is one of: public, protected, internal, private
   */
  isProtectionKeyword(): boolean;
  /**
   * Return if -- or ++
   */
  isIncrementOrDecrement(): boolean;
  /**
   * Map an operator token to it's shortcut operator enum. Degree
   * is 1 for unary and 2 for binary.
   */
  toShortcutOp(degree: number): ShortcutOp;
  /**
   * Return the Token instance for the specified name.  If not a
   * valid name and checked is false return null, otherwise throw
   * ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): Token;
}

/**
 * RangeLiteralExpr creates a Range instance
 */
export class RangeLiteralExpr extends Expr {
  static type$: sys.Type
  exclusive(): boolean;
  exclusive(it: boolean): void;
  end(): Expr;
  end(it: Expr): void;
  start(): Expr;
  start(it: Expr): void;
  static make(loc: Loc, ctype: CType, start: Expr, end: Expr, exclusive: boolean, ...args: unknown[]): RangeLiteralExpr;
  toStr(): string;
  walkChildren(v: Visitor): void;
}

/**
 * ResolveImports maps every Using node in each CompilationUnit
 * to a pod and ensures that it exists and that no imports are
 * duplicated.  Then we create a map for all the types which
 * are imported into the CompilationUnit so that the Parser can
 * quickly distinguish between a type identifier and other
 * identifiers.  The results of this step populate
 * Using.resolvedXXX and CompilationUnit.importedTypes.
 */
export class ResolveImports extends CompilerStep {
  static type$: sys.Type
  resolved(): sys.Map<string, CPod>;
  resolved(it: sys.Map<string, CPod>): void;
  /**
   * Run the step
   */
  run(): void;
  /**
   * Resolve a pod name into its CPod representation.  If pod
   * cannot be resolved then log an error and return null.
   */
  static resolvePod(cs: CompilerSupport, podName: string, loc: Loc): CPod | null;
  /**
   * Resolve a fully qualified type name into its CType
   * representation. This may be a TypeDef within the compilation
   * units or could be an imported type.  If the type name cannot
   * be resolved then we log an error and return null.
   */
  static resolveQualified(cs: CompilerSupport, podName: string, typeName: string, loc: Loc): CType | null;
  /**
   * Constructor takes the associated Compiler
   */
  static make(compiler: Compiler, ...args: unknown[]): ResolveImports;
}

/**
 * RegexDslPlugin is used to create a Regex instance from a raw
 * string.
 */
export class RegexDslPlugin extends DslPlugin {
  static type$: sys.Type
  /**
   * Find a DSL plugin for the given anchor type.  If there is a
   * problem then log an error and return null.
   */
  compile(dsl: DslExpr): Expr;
  /**
   * Constructor with associated compiler.
   */
  static make(c: Compiler, ...args: unknown[]): RegexDslPlugin;
}

/**
 * CNamespace is responsible for providing a unified view pods,
 * types, and slots between the entities currently being
 * compiled and the entities being imported from pre-compiled
 * pods.
 */
export class CNamespace extends sys.Obj {
  static type$: sys.Type
  enumOrdinal(): CMethod | null;
  enumOrdinal(it: CMethod | null): void;
  slotFindMethod(): CMethod | null;
  slotFindMethod(it: CMethod | null): void;
  facetType(): CType | null;
  facetType(it: CType | null): void;
  floatMinus(): CMethod | null;
  floatMinus(it: CMethod | null): void;
  funcCheckInCtor(): CMethod | null;
  funcCheckInCtor(it: CMethod | null): void;
  funcBind(): CMethod | null;
  funcBind(it: CMethod | null): void;
  rangeMakeExclusive(): CMethod | null;
  rangeMakeExclusive(it: CMethod | null): void;
  sysPod(): CPod | null;
  sysPod(it: CPod | null): void;
  typeType(): CType | null;
  typeType(it: CType | null): void;
  rangeType(): CType | null;
  rangeType(it: CType | null): void;
  /**
   * Map of dependencies keyed by pod name set in ResolveDepends.
   */
  depends(): sys.Map<string, CDepend> | null;
  depends(it: sys.Map<string, CDepend> | null): void;
  fieldNotSetErrType(): CType | null;
  fieldNotSetErrType(it: CType | null): void;
  floatPlus(): CMethod | null;
  floatPlus(it: CMethod | null): void;
  strBufAdd(): CMethod | null;
  strBufAdd(it: CMethod | null): void;
  rangeMakeInclusive(): CMethod | null;
  rangeMakeInclusive(it: CMethod | null): void;
  nothingType(): CType | null;
  nothingType(it: CType | null): void;
  fieldType(): CType | null;
  fieldType(it: CType | null): void;
  slotFindFunc(): CMethod | null;
  slotFindFunc(it: CMethod | null): void;
  intIncrement(): CMethod | null;
  intIncrement(it: CMethod | null): void;
  enumType(): CType | null;
  enumType(it: CType | null): void;
  testType(): CType | null;
  testType(it: CType | null): void;
  durationType(): CType | null;
  durationType(it: CType | null): void;
  objWith(): CMethod | null;
  objWith(it: CMethod | null): void;
  boolNot(): CMethod | null;
  boolNot(it: CMethod | null): void;
  methodType(): CType | null;
  methodType(it: CType | null): void;
  podFind(): CMethod | null;
  podFind(it: CMethod | null): void;
  funcType(): CType | null;
  funcType(it: CType | null): void;
  slotType(): CType | null;
  slotType(it: CType | null): void;
  intType(): CType | null;
  intType(it: CType | null): void;
  mapType(): CType | null;
  mapType(it: CType | null): void;
  typeField(): CMethod | null;
  typeField(it: CMethod | null): void;
  fieldNotSetErrMake(): CMethod | null;
  fieldNotSetErrMake(it: CMethod | null): void;
  uriType(): CType | null;
  uriType(it: CType | null): void;
  funcCall(): CMethod | null;
  funcCall(it: CMethod | null): void;
  podLocale(): CMethod | null;
  podLocale(it: CMethod | null): void;
  intPlus(): CMethod | null;
  intPlus(it: CMethod | null): void;
  typePod(): CMethod | null;
  typePod(it: CMethod | null): void;
  floatType(): CType | null;
  floatType(it: CType | null): void;
  listMakeObj(): CMethod | null;
  listMakeObj(it: CMethod | null): void;
  notImmutableErrType(): CType | null;
  notImmutableErrType(it: CType | null): void;
  typeMethod(): CMethod | null;
  typeMethod(it: CMethod | null): void;
  voidType(): CType | null;
  voidType(it: CType | null): void;
  strBufMake(): CMethod | null;
  strBufMake(it: CMethod | null): void;
  listMake(): CMethod | null;
  listMake(it: CMethod | null): void;
  strPlus(): CMethod | null;
  strPlus(it: CMethod | null): void;
  intDecrement(): CMethod | null;
  intDecrement(it: CMethod | null): void;
  funcExitCtor(): CMethod | null;
  funcExitCtor(it: CMethod | null): void;
  objToImmutable(): CMethod | null;
  objToImmutable(it: CMethod | null): void;
  mapMake(): CMethod | null;
  mapMake(it: CMethod | null): void;
  notImmutableErrMake(): CMethod | null;
  notImmutableErrMake(it: CMethod | null): void;
  genericParams(): sys.Map<string, CType> | null;
  genericParams(it: sys.Map<string, CType> | null): void;
  strType(): CType | null;
  strType(it: CType | null): void;
  objTrap(): CMethod | null;
  objTrap(it: CMethod | null): void;
  error(): CType | null;
  error(it: CType | null): void;
  listType(): CType | null;
  listType(it: CType | null): void;
  boolType(): CType | null;
  boolType(it: CType | null): void;
  strBufType(): CType | null;
  strBufType(it: CType | null): void;
  podType(): CType | null;
  podType(it: CType | null): void;
  objType(): CType | null;
  objType(it: CType | null): void;
  decimalType(): CType | null;
  decimalType(it: CType | null): void;
  mapSet(): CMethod | null;
  mapSet(it: CMethod | null): void;
  strBufToStr(): CMethod | null;
  strBufToStr(it: CMethod | null): void;
  errType(): CType | null;
  errType(it: CType | null): void;
  itBlockType(): FuncType | null;
  itBlockType(it: FuncType | null): void;
  listAdd(): CMethod | null;
  listAdd(it: CMethod | null): void;
  funcEnterCtor(): CMethod | null;
  funcEnterCtor(it: CMethod | null): void;
  /**
   * Attempt to import the specified pod name against our
   * dependency library.  If not found then throw CompilerErr.
   */
  resolvePod(podName: string, loc: Loc | null): CPod;
  /**
   * Attempt resolve a signature against our dependency library. 
   * If not a valid signature or it can't be resolved, then throw
   * Err.
   */
  resolveType(sig: string): CType;
  /**
   * Order a list of pods by their dependencies. This method does
   * not flatten dependencies - see {@link flattenDepends | flattenDepends}.
   */
  orderByDepends(pods: sys.List<CPod>): sys.List<CPod>;
  /**
   * Attempt resolve a slot against our dependency library.  If
   * can't be resolved, then throw Err.
   */
  resolveSlot(qname: string): CSlot;
  /**
   * Expand a set of pods to include all their recursive
   * dependencies. This method does not order them; see {@link orderByDepends | orderByDepends}.
   */
  flattenDepends(pods: sys.List<CPod>): sys.List<CPod>;
  cleanup(): void;
  /**
   * Convenience to flatten and order all pod dependencies. See {@link flattenDepends | flattenDepends}
   * and {@link orderByDepends | orderByDepends}
   */
  flattenAndOrderByDepends(pods: sys.List<CPod>): sys.List<CPod>;
  static make(...args: unknown[]): CNamespace;
  /**
   * Map one of the generic parameter types such as "sys::V" into
   * a CType
   */
  genericParameter(id: string): CType;
}

/**
 * ListType models a parameterized List type.
 */
export class ListType extends GenericType {
  static type$: sys.Type
  signature(): string;
  v(): CType;
  v(it: CType): void;
  doParameterize(ch: number): CType;
  fits(t: CType): boolean;
  isGenericParameter(): boolean;
  flags(): number;
  static make(v: CType, ...args: unknown[]): ListType;
  isValid(): boolean;
}

/**
 * CompileJs is used to call the compilerJs plugin to generate
 * javascript for the pod if the @js facet is configured.
 */
export class CompileJs extends CompilerStep {
  static type$: sys.Type
  run(): void;
  needCompileJs(): boolean;
  needCompileEs(): boolean;
  static make(compiler: Compiler, ...args: unknown[]): CompileJs;
}

/**
 * Tokenizer inputs a Str and output a list of Tokens
 */
export class Tokenizer extends CompilerSupport {
  static type$: sys.Type
  /**
   * Tokenize the entire input into a list of tokens.
   */
  tokenize(): sys.List<TokenVal>;
  /**
   * Return the next token in the buffer.
   */
  next(): TokenVal | null;
  /**
   * Construct with characters of source file.  The buffer passed
   * must be normalized in that all newlines must be represented
   * strictly as \n and not \r or \r\n (see File.readAllStr).  If
   * isDoc is false, we skip all star-star Fandoc comments.
   */
  static make(compiler: Compiler, loc: Loc, buf: string, isDoc: boolean, ...args: unknown[]): Tokenizer;
  /**
   * Parse an escapse sequence which starts with a \
   */
  escape(): number;
  /**
   * Return a CompilerException for current location in source.
   */
  err(msg: string, loc?: Loc | null): CompilerErr;
}

/**
 * CallResolver handles the process of resolving a CallExpr or
 * UnknownVarExpr to a method call or a field access.
 */
export class CallResolver extends CompilerSupport {
  static type$: sys.Type
  curType(): TypeDef | null;
  curType(it: TypeDef | null): void;
  isItAdd(): boolean;
  isItAdd(it: boolean): void;
  baseIt(): CType | null;
  baseIt(it: CType | null): void;
  isFuncFieldCall(): boolean;
  isFuncFieldCall(it: boolean): void;
  name(): string;
  name(it: string): void;
  loc(): Loc;
  loc(it: Loc): void;
  curMethod(): MethodDef | null;
  curMethod(it: MethodDef | null): void;
  result(): Expr | null;
  result(it: Expr | null): void;
  found(): CSlot | null;
  found(it: CSlot | null): void;
  expr(): NameExpr;
  expr(it: NameExpr): void;
  isVar(): boolean;
  isVar(it: boolean): void;
  target(): Expr | null;
  target(it: Expr | null): void;
  args(): sys.List<Expr>;
  args(it: sys.List<Expr>): void;
  foundOnIt(): boolean;
  foundOnIt(it: boolean): void;
  base(): CType | null;
  base(it: CType | null): void;
  /**
   * Resolve the base type which defines the slot we are calling.
   */
  resolveBase(): void;
  /**
   * Resolve into a method call or field access
   */
  resolve(): Expr;
  /**
   * If this is a standalone name without a base target such as
   * "Foo" and the name maps to a type name, then this is a type
   * literal.
   */
  isStaticLiteral(): boolean;
  /**
   * Find the method or field with the specified name.
   */
  find(): void;
  /**
   * Construct with NameExpr (base class of CallExpr and
   * UnknownVarExpr)
   */
  static make(compiler: Compiler, curType: TypeDef | null, curMethod: MethodDef | null, expr: NameExpr, ...args: unknown[]): CallResolver;
  /**
   * If the last argument to the resolved call is a closure, then
   * use the method to infer the function type.  If the last arg
   * is a closure, but the call doesn't take a closure, then
   * translate into an implicit call to Obj.with
   */
  static inferClosureTypeFromCall(support: CompilerSupport, call: CallExpr, base: CType): Expr;
}

/**
 * Catch models a single catch clause of a TryStmt
 */
export class Catch extends Node {
  static type$: sys.Type
  errVariable(): string | null;
  errVariable(it: string | null): void;
  start(): number;
  start(it: number): void;
  errType(): TypeRef | null;
  errType(it: TypeRef | null): void;
  block(): Block | null;
  block(it: Block | null): void;
  end(): number;
  end(it: number): void;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  print(out: AstWriter): void;
  static make(loc: Loc, ...args: unknown[]): Catch;
}

/**
 * GenerateOutput creates the appropriate CompilerOutput
 * instance for Compiler.output based on the configured
 * CompilerInput.output.
 */
export class GenerateOutput extends CompilerStep {
  static type$: sys.Type
  /**
   * Run the step
   */
  run(): void;
  /**
   * Constructor takes the associated Compiler
   */
  static make(compiler: Compiler, ...args: unknown[]): GenerateOutput;
}

/**
 * CondExpr is used for || and && short-circuit boolean
 * conditionals.
 */
export class CondExpr extends Expr {
  static type$: sys.Type
  opToken(): Token;
  opToken(it: Token): void;
  operands(): sys.List<Expr>;
  operands(it: sys.List<Expr>): void;
  isCond(): boolean;
  static make(first: Expr, opToken: Token, ...args: unknown[]): CondExpr;
  toStr(): string;
  walkChildren(v: Visitor): void;
}

/**
 * CheckParamDefs is used to process all the parameter default
 * expressions for all the methods.  What we are looking for is
 * default expressions which use default expressions before it
 * which require us to insert a store instruction.
 */
export class CheckParamDefs extends CompilerStep {
  static type$: sys.Type
  used(): boolean;
  used(it: boolean): void;
  name(): string | null;
  name(it: string | null): void;
  visitMethodDef(m: MethodDef): void;
  run(): void;
  usedInSuccDef(params: sys.List<ParamDef>, index: number): ParamDef | null;
  static make(compiler: Compiler, ...args: unknown[]): CheckParamDefs;
  visitExpr(expr: Expr): Expr;
}

/**
 * WhileStmt models a while loop of the format:
 * ```
 * while (condition) block
 * ```
 */
export class WhileStmt extends Stmt {
  static type$: sys.Type
  condition(): Expr;
  condition(it: Expr): void;
  block(): Block;
  block(it: Block): void;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  isExit(): boolean;
  print(out: AstWriter): void;
  static make(loc: Loc, condition: Expr, block: Block, ...args: unknown[]): WhileStmt;
  walkChildren(v: Visitor, depth: VisitDepth): void;
}

/**
 * ThrowExpr models throw as an expr versus a statement for use
 * inside ternary/elvis operations.
 */
export class ThrowExpr extends Expr {
  static type$: sys.Type
  exception(): Expr;
  exception(it: Expr): void;
  static make(loc: Loc, exception: Expr, ...args: unknown[]): ThrowExpr;
  toStr(): string;
  walkChildren(v: Visitor): void;
}

/**
 * ReflectParam
 */
export class ReflectParam extends sys.Obj implements CParam {
  static type$: sys.Type
  type(): CType;
  type(it: CType): void;
  p(): sys.Param;
  p(it: sys.Param): void;
  hasDefault(): boolean;
  name(): string;
  static make(ns: ReflectNamespace, p: sys.Param, ...args: unknown[]): ReflectParam;
  paramType(): CType;
}

/**
 * GenericType models a parameterized generic type: List, Map,
 * or Func
 */
export class GenericType extends sys.Obj implements CType {
  static type$: sys.Type
  base(): CType | null;
  base(it: CType | null): void;
  isParameterized(): boolean;
  mixins(): sys.List<CType>;
  qname(): string;
  doc(): CDoc | null;
  pod(): CPod;
  operators(): COperators;
  isVal(): boolean;
  facet(qname: string): CFacet | null;
  doParameterize(ch: number): CType;
  slots(): sys.Map<string, CSlot>;
  isNullable(): boolean;
  name(): string;
  ns(): CNamespace;
  toNullable(): CType;
  static make(base: CType, ...args: unknown[]): GenericType;
  isGeneric(): boolean;
  toListOf(): CType;
  isNum(): boolean;
  /**
   * If this type is being used for type inference then get the
   * type as it should be inferred.  Typically we just return
   * this. However some FFI types such as `[java]::int` are never
   * used on the stack directly and are inferred to be `sys::Int`.
   */
  inferredAs(): CType;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  /**
   * Is this a compiler generated synthetic class
   */
  isSynthetic(): boolean;
  /**
   * Return if this type fits any of the types in the specified
   * list.
   */
  fitsAny(types: sys.List<CType>): boolean;
  /**
   * Is the entire class implemented in native code?
   */
  isNative(): boolean;
  /**
   * Is this type ok to use as a const field?  Any const type
   * fine, plus we allow Obj, List, Map, Buf, and Func since they
   * will implicitly have toImmutable called on them.
   */
  isConstFieldType(): boolean;
  isObj(): boolean;
  isBool(): boolean;
  isBuf(): boolean;
  isInt(): boolean;
  isDecimal(): boolean;
  /**
   * Return if this Type is an sys::Facet
   */
  isFacet(): boolean;
  isNothing(): boolean;
  /**
   * Return signature
   */
  toStr(): string;
  /**
   * Lookup a method by name (null if field).
   */
  method(name: string): CMethod | null;
  /**
   * If this TypeDef extends from a FFI class or implements any
   * FFI mixins, then return the FFI type otherwise return null.
   */
  foreignInheritance(): CType | null;
  /**
   * If this type is a generic parameter (V, L, etc), then return
   * the actual type for the native implementation.  For example
   * V is Obj, and L is List.  This is the type we actually use
   * when constructing a signature for the invoke opcode.
   */
  raw(): CType;
  /**
   * Return if type is supported by the Fantom type system.  For
   * example the Java FFI will correctly model a Java
   * multi-dimensional array during compilation, however there is
   * no Fantom representation.  We check for supported types
   * during CheckErrors when accessing fields and methods.
   */
  isSupported(): boolean;
  isFunc(): boolean;
  /**
   * Does this type implement the specified type.  If true, then
   * this type is assignable to the specified type (although the
   * converse is not necessarily true).  All types (including
   * mixin types) fit sys::Obj.
   */
  fits(t: CType): boolean;
  isType(): boolean;
  isMap(): boolean;
  /**
   * Is this an internally scoped class
   */
  isInternal(): boolean;
  /**
   * Return if this type contains a slot by the specified name.
   */
  hasSlot(name: string): boolean;
  /**
   * Return if this type is a generic parameter (such as V or K)
   * in a generic type (List, Map, or Method).  Generic
   * parameters serve as place holders for the parameterization
   * of the generic type. Fantom has a predefined set of generic
   * parameters which are always defined in the sys pod with a
   * one character name.
   */
  isGenericParameter(): boolean;
  /**
   * Lookup a field by name (null if method).
   */
  field(name: string): CField | null;
  /**
   * If this is a foreign function return the bridge.
   */
  bridge(): CBridge | null;
  /**
   * List of the all defined fields (including inherited fields).
   */
  fields(): sys.List<CField>;
  /**
   * Hash on signature.
   */
  hash(): number;
  /**
   * Get this type as a non-nullable (if nullable)
   */
  toNonNullable(): CType;
  isThis(): boolean;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  /**
   * If this is a TypeRef, return what it references
   */
  deref(): CType;
  /**
   * List of the all instance constructors.
   */
  instanceCtors(): sys.List<CMethod>;
  /**
   * This is the full signature of the type.
   */
  signature(): string;
  /**
   * If this a foreign function interface type.
   */
  isForeign(): boolean;
  /**
   * List of the all defined methods (including inherited
   * methods).
   */
  methods(): sys.List<CMethod>;
  /**
   * Get the flags bitmask.
   */
  flags(): number;
  /**
   * Lookup a slot by name.  If the slot doesn't exist then
   * return null.
   */
  slot(name: string): CSlot | null;
  isList(): boolean;
  /**
   * If this is a parameterized type which uses `This`, then
   * replace `This` with the specified type.
   */
  parameterizeThis(thisType: CType): CType;
  /**
   * Return if this Type is const and immutable.
   */
  isConst(): boolean;
  /**
   * Is this a public scoped class
   */
  isPublic(): boolean;
  isStr(): boolean;
  /**
   * Return if this Type is final and cannot be subclassed.
   */
  isFinal(): boolean;
  /**
   * Return if this Type is a class (as opposed to enum or mixin)
   */
  isClass(): boolean;
  /**
   * Is this a valid type usable anywhere (such as local var)
   */
  isValid(): boolean;
  /**
   * Return if this Type is an sys::Enum
   */
  isEnum(): boolean;
  isFloat(): boolean;
  /**
   * Return if this Type is a mixin type and cannot be
   * instantiated.
   */
  isMixin(): boolean;
  /**
   * Return if this Type is abstract and cannot be instantiated. 
   * This method will always return true if the type is a mixin.
   */
  isAbstract(): boolean;
  isRange(): boolean;
  isVoid(): boolean;
  /**
   * List of the all constructors.
   */
  ctors(): sys.List<CMethod>;
  /**
   * Equality based on signature.
   */
  equals(t: sys.JsObj | null): boolean;
}

/**
 * CFacet models a facet definition in a CType or CSlot
 */
export abstract class CFacet extends sys.Obj {
  static type$: sys.Type
  /**
   * Qualified name of facet type
   */
  qname(): string;
  /**
   * Get the value of the given facet field or null if undefined.
   */
  get(name: string): sys.JsObj | null;
}

/**
 * FUtil provides fcode encoding and decoding utilities.
 */
export class FUtil extends sys.Obj implements FConst {
  static type$: sys.Type
  static readAttrs(in$: sys.InStream): sys.List<FAttr>;
  static readBuf(in$: sys.InStream): sys.Buf | null;
  static make(...args: unknown[]): FUtil;
  static writeBuf(out: sys.OutStream | null, buf: sys.Buf | null): void;
  /**
   * Write a fandoc item to the specified output stream.  The
   * fandoc file format is an extremely simple plan text format
   * with left justified type/slot qnames, followed by the fandoc
   * content indented two spaces.
   */
  static writeDoc(out: sys.OutStream, key: string, doc: string | null): void;
  static writeAttrs(out: sys.OutStream, fattrs: sys.List<FAttr> | null): void;
}

/**
 * PodDef models the pod being compiled.
 */
export class PodDef extends Node implements CPod {
  static type$: sys.Type
  typeDefs(): sys.Map<string, TypeDef> | null;
  typeDefs(it: sys.Map<string, TypeDef> | null): void;
  ns(): CNamespace;
  ns(it: CNamespace): void;
  units(): sys.List<CompilationUnit>;
  units(it: sys.List<CompilationUnit>): void;
  index(): sys.Map<string, sys.JsObj>;
  index(it: sys.Map<string, sys.JsObj>): void;
  meta(): sys.Map<string, string>;
  meta(it: sys.Map<string, string>): void;
  name(): string;
  file(): sys.File;
  static make(ns: CNamespace, loc: Loc, name: string, ...args: unknown[]): PodDef;
  types(): sys.List<CType>;
  resolveType(name: string, checked: boolean): CType | null;
  depends(): sys.List<CDepend>;
  version(): sys.Version;
  print(out: AstWriter): void;
  /**
   * Return name
   */
  toStr(): string;
  /**
   * Return if this pod has client side JavaScript
   */
  hasJs(): boolean;
  /**
   * If this a foreign function interface pod.
   */
  isForeign(): boolean;
  /**
   * Equality based on pod name.
   */
  equals(t: sys.JsObj | null): boolean;
  /**
   * If this a foreign function interface return the bridge.
   */
  bridge(): CBridge | null;
  /**
   * Hash on name.
   */
  hash(): number;
}

/**
 * InitEnum is used to auto-generate EnumDefs into abstract
 * syntax tree representation of the fields and method.
 */
export class InitEnum extends CompilerStep {
  static type$: sys.Type
  visitTypeDef(t: TypeDef): void;
  run(): void;
  /**
   * Add fromStr method.
   */
  addFromStr(): void;
  /**
   * Make enum value field:  public static final Foo name =
   * make(ord, name)
   */
  makeField(def: EnumDef): FieldDef;
  /**
   * Make vals field: List of Enum values
   */
  makeValsField(): FieldDef;
  /**
   * Add constructor or enhance existing constructor.
   */
  addCtor(): void;
  static make(compiler: Compiler, ...args: unknown[]): InitEnum;
}

/**
 * GenericParameterType models the generic parameter types
 * sys::V, sys::K, etc.
 */
export class GenericParameterType extends sys.Obj implements CType {
  static type$: sys.Type
  qname(): string;
  qname(it: string): void;
  name(): string;
  name(it: string): void;
  ns(): CNamespace;
  ns(it: CNamespace): void;
  isParameterized(): boolean;
  mixins(): sys.List<CType>;
  slots(): sys.Map<string, CSlot>;
  isGenericParameter(): boolean;
  isNullable(): boolean;
  doc(): CDoc | null;
  pod(): CPod;
  signature(): string;
  flags(): number;
  toNullable(): CType;
  operators(): COperators;
  static make(ns: CNamespace, name: string, ...args: unknown[]): GenericParameterType;
  isGeneric(): boolean;
  isVal(): boolean;
  toListOf(): CType;
  facet(qname: string): CFacet | null;
  base(): CType | null;
  isNum(): boolean;
  /**
   * If this type is being used for type inference then get the
   * type as it should be inferred.  Typically we just return
   * this. However some FFI types such as `[java]::int` are never
   * used on the stack directly and are inferred to be `sys::Int`.
   */
  inferredAs(): CType;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  /**
   * Is this a compiler generated synthetic class
   */
  isSynthetic(): boolean;
  /**
   * Return if this type fits any of the types in the specified
   * list.
   */
  fitsAny(types: sys.List<CType>): boolean;
  /**
   * Is the entire class implemented in native code?
   */
  isNative(): boolean;
  /**
   * Is this type ok to use as a const field?  Any const type
   * fine, plus we allow Obj, List, Map, Buf, and Func since they
   * will implicitly have toImmutable called on them.
   */
  isConstFieldType(): boolean;
  isObj(): boolean;
  isBool(): boolean;
  isBuf(): boolean;
  isInt(): boolean;
  isDecimal(): boolean;
  /**
   * Return if this Type is an sys::Facet
   */
  isFacet(): boolean;
  isNothing(): boolean;
  /**
   * Return signature
   */
  toStr(): string;
  /**
   * Lookup a method by name (null if field).
   */
  method(name: string): CMethod | null;
  /**
   * If this TypeDef extends from a FFI class or implements any
   * FFI mixins, then return the FFI type otherwise return null.
   */
  foreignInheritance(): CType | null;
  /**
   * If this type is a generic parameter (V, L, etc), then return
   * the actual type for the native implementation.  For example
   * V is Obj, and L is List.  This is the type we actually use
   * when constructing a signature for the invoke opcode.
   */
  raw(): CType;
  /**
   * Return if type is supported by the Fantom type system.  For
   * example the Java FFI will correctly model a Java
   * multi-dimensional array during compilation, however there is
   * no Fantom representation.  We check for supported types
   * during CheckErrors when accessing fields and methods.
   */
  isSupported(): boolean;
  isFunc(): boolean;
  /**
   * Does this type implement the specified type.  If true, then
   * this type is assignable to the specified type (although the
   * converse is not necessarily true).  All types (including
   * mixin types) fit sys::Obj.
   */
  fits(t: CType): boolean;
  isType(): boolean;
  isMap(): boolean;
  /**
   * Is this an internally scoped class
   */
  isInternal(): boolean;
  /**
   * Return if this type contains a slot by the specified name.
   */
  hasSlot(name: string): boolean;
  /**
   * Lookup a field by name (null if method).
   */
  field(name: string): CField | null;
  /**
   * If this is a foreign function return the bridge.
   */
  bridge(): CBridge | null;
  /**
   * List of the all defined fields (including inherited fields).
   */
  fields(): sys.List<CField>;
  /**
   * Hash on signature.
   */
  hash(): number;
  /**
   * Get this type as a non-nullable (if nullable)
   */
  toNonNullable(): CType;
  isThis(): boolean;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  /**
   * If this is a TypeRef, return what it references
   */
  deref(): CType;
  /**
   * List of the all instance constructors.
   */
  instanceCtors(): sys.List<CMethod>;
  /**
   * If this a foreign function interface type.
   */
  isForeign(): boolean;
  /**
   * List of the all defined methods (including inherited
   * methods).
   */
  methods(): sys.List<CMethod>;
  /**
   * Lookup a slot by name.  If the slot doesn't exist then
   * return null.
   */
  slot(name: string): CSlot | null;
  isList(): boolean;
  /**
   * If this is a parameterized type which uses `This`, then
   * replace `This` with the specified type.
   */
  parameterizeThis(thisType: CType): CType;
  /**
   * Return if this Type is const and immutable.
   */
  isConst(): boolean;
  /**
   * Is this a public scoped class
   */
  isPublic(): boolean;
  isStr(): boolean;
  /**
   * Return if this Type is final and cannot be subclassed.
   */
  isFinal(): boolean;
  /**
   * Return if this Type is a class (as opposed to enum or mixin)
   */
  isClass(): boolean;
  /**
   * Is this a valid type usable anywhere (such as local var)
   */
  isValid(): boolean;
  /**
   * Return if this Type is an sys::Enum
   */
  isEnum(): boolean;
  isFloat(): boolean;
  /**
   * Return if this Type is a mixin type and cannot be
   * instantiated.
   */
  isMixin(): boolean;
  /**
   * Return if this Type is abstract and cannot be instantiated. 
   * This method will always return true if the type is a mixin.
   */
  isAbstract(): boolean;
  isRange(): boolean;
  isVoid(): boolean;
  /**
   * List of the all constructors.
   */
  ctors(): sys.List<CMethod>;
  /**
   * Equality based on signature.
   */
  equals(t: sys.JsObj | null): boolean;
}

/**
 * LocalVarExpr is used to access a local variable stored in a
 * register.
 */
export class LocalVarExpr extends Expr {
  static type$: sys.Type
  unwrap(): boolean;
  unwrap(it: boolean): void;
  var(): MethodVar | null;
  var(it: MethodVar | null): void;
  isAssignable(): boolean;
  static make(loc: Loc, var$: MethodVar | null, id?: ExprId, ...args: unknown[]): LocalVarExpr;
  toStr(): string;
  assignRequiresTempVar(): boolean;
  sameVarAs(that: Expr): boolean;
  static makeNoUnwrap(loc: Loc, var$: MethodVar): LocalVarExpr;
  name(): string;
  register(): number;
}

/**
 * ParameterizedMethod models a parameterized CMethod
 */
export class ParameterizedMethod extends sys.Obj implements CMethod {
  static type$: sys.Type
  parent(): CType;
  parent(it: CType): void;
  params(): sys.List<CParam>;
  params(it: sys.List<CParam>): void;
  returns(): CType;
  returns(it: CType): void;
  signature(): string;
  signature(it: string): void;
  generic(): CMethod | null;
  generic(it: CMethod | null): void;
  isParameterized(): boolean;
  qname(): string;
  inheritedReturns(): CType;
  name(): string;
  doc(): CDoc | null;
  flags(): number;
  static make(parent: GenericType, generic: CMethod, ...args: unknown[]): ParameterizedMethod;
  facet(qname: string): CFacet | null;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  isSynthetic(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  /**
   * Return if this method has the exact same parameters as the
   * specified method.
   */
  hasSameParams(that: CMethod): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  inheritedReturnType(): CType;
  toStr(): string;
  isInternal(): boolean;
  /**
   * Return a string with the name and parameters.
   */
  nameAndParamTypesToStr(): string;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  returnType(): CType;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  ns(): CNamespace;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  isPrivate(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  isGetter(): boolean;
  /**
   * Does this method contains generic parameters in its
   * signature.
   */
  isGeneric(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  isSetter(): boolean;
  /**
   * Does this method have a covariant return type (we don't
   * count This returns as covariant)
   */
  isCovariant(): boolean;
  isCtor(): boolean;
}

/**
 * ProtectedRegion
 */
export class ProtectedRegion extends sys.Obj {
  static type$: sys.Type
  hasFinally(): boolean;
  hasFinally(it: boolean): void;
  jumpFinallys(): sys.List<number> | null;
  jumpFinallys(it: sys.List<number> | null): void;
  static make(stmt: TryStmt, ...args: unknown[]): ProtectedRegion;
}

/**
 * Type or slot documentation in plain text fandoc format
 */
export class DocDef extends Node implements CDoc {
  static type$: sys.Type
  lines(): sys.List<string>;
  lines(it: sys.List<string>): void;
  print(out: AstWriter): void;
  text(): string;
  static make(loc: Loc, lines: sys.List<string>, ...args: unknown[]): DocDef;
}

/**
 * ConstantFolder is used to implement constant folding
 * optimizations where known literals and operations can be
 * performed ahead of time by the compiler.
 */
export class ConstantFolder extends CompilerSupport {
  static type$: sys.Type
  /**
   * Constructor
   */
  static make(compiler: Compiler, ...args: unknown[]): ConstantFolder;
  /**
   * Check shortcut expression for constant folding
   */
  fold(call: CallExpr): Expr;
}

/**
 * CheckInheritance is used to check invalid extends or mixins.
 */
export class CheckInheritance extends CompilerStep {
  static type$: sys.Type
  visitTypeDef(t: TypeDef): void;
  run(): void;
  static make(compiler: Compiler, ...args: unknown[]): CheckInheritance;
}

/**
 * UnaryExpr is used for unary expressions including !, +. Note
 * that - is mapped to negate() as a shortcut method.
 */
export class UnaryExpr extends Expr {
  static type$: sys.Type
  opToken(): Token;
  opToken(it: Token): void;
  operand(): Expr;
  operand(it: Expr): void;
  static make(loc: Loc, id: ExprId, opToken: Token, operand: Expr, ...args: unknown[]): UnaryExpr;
  toStr(): string;
  walkChildren(v: Visitor): void;
}

/**
 * ReflectType is the implementation of CType for a type
 * imported from a precompiled pod (as opposed to a TypeDef
 * within the compilation units being compiled).
 */
export class ReflectType extends sys.Obj implements CType {
  static type$: sys.Type
  mixins(): sys.List<CType>;
  mixins(it: sys.List<CType>): void;
  pod(): ReflectPod;
  pod(it: ReflectPod): void;
  isVal(): boolean;
  t(): sys.Type;
  base(): CType | null;
  base(it: CType | null): void;
  isParameterized(): boolean;
  qname(): string;
  slots(): sys.Map<string, CSlot>;
  isGenericParameter(): boolean;
  isNullable(): boolean;
  name(): string;
  doc(): CDoc | null;
  ns(): ReflectNamespace;
  signature(): string;
  flags(): number;
  slot(name: string): CSlot | null;
  toNullable(): CType;
  operators(): COperators;
  /**
   * Construct with loaded Type.
   */
  static make(ns: ReflectNamespace, t: sys.Type, ...args: unknown[]): ReflectType;
  isGeneric(): boolean;
  toListOf(): CType;
  facet(qname: string): CFacet | null;
  isNum(): boolean;
  /**
   * If this type is being used for type inference then get the
   * type as it should be inferred.  Typically we just return
   * this. However some FFI types such as `[java]::int` are never
   * used on the stack directly and are inferred to be `sys::Int`.
   */
  inferredAs(): CType;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  /**
   * Is this a compiler generated synthetic class
   */
  isSynthetic(): boolean;
  /**
   * Return if this type fits any of the types in the specified
   * list.
   */
  fitsAny(types: sys.List<CType>): boolean;
  /**
   * Is the entire class implemented in native code?
   */
  isNative(): boolean;
  /**
   * Is this type ok to use as a const field?  Any const type
   * fine, plus we allow Obj, List, Map, Buf, and Func since they
   * will implicitly have toImmutable called on them.
   */
  isConstFieldType(): boolean;
  isObj(): boolean;
  isBool(): boolean;
  isBuf(): boolean;
  isInt(): boolean;
  isDecimal(): boolean;
  /**
   * Return if this Type is an sys::Facet
   */
  isFacet(): boolean;
  isNothing(): boolean;
  /**
   * Return signature
   */
  toStr(): string;
  /**
   * Lookup a method by name (null if field).
   */
  method(name: string): CMethod | null;
  /**
   * If this TypeDef extends from a FFI class or implements any
   * FFI mixins, then return the FFI type otherwise return null.
   */
  foreignInheritance(): CType | null;
  /**
   * If this type is a generic parameter (V, L, etc), then return
   * the actual type for the native implementation.  For example
   * V is Obj, and L is List.  This is the type we actually use
   * when constructing a signature for the invoke opcode.
   */
  raw(): CType;
  /**
   * Return if type is supported by the Fantom type system.  For
   * example the Java FFI will correctly model a Java
   * multi-dimensional array during compilation, however there is
   * no Fantom representation.  We check for supported types
   * during CheckErrors when accessing fields and methods.
   */
  isSupported(): boolean;
  isFunc(): boolean;
  /**
   * Does this type implement the specified type.  If true, then
   * this type is assignable to the specified type (although the
   * converse is not necessarily true).  All types (including
   * mixin types) fit sys::Obj.
   */
  fits(t: CType): boolean;
  isType(): boolean;
  isMap(): boolean;
  /**
   * Is this an internally scoped class
   */
  isInternal(): boolean;
  /**
   * Return if this type contains a slot by the specified name.
   */
  hasSlot(name: string): boolean;
  /**
   * Lookup a field by name (null if method).
   */
  field(name: string): CField | null;
  /**
   * If this is a foreign function return the bridge.
   */
  bridge(): CBridge | null;
  /**
   * List of the all defined fields (including inherited fields).
   */
  fields(): sys.List<CField>;
  /**
   * Hash on signature.
   */
  hash(): number;
  /**
   * Get this type as a non-nullable (if nullable)
   */
  toNonNullable(): CType;
  isThis(): boolean;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  /**
   * If this is a TypeRef, return what it references
   */
  deref(): CType;
  /**
   * List of the all instance constructors.
   */
  instanceCtors(): sys.List<CMethod>;
  /**
   * If this a foreign function interface type.
   */
  isForeign(): boolean;
  /**
   * List of the all defined methods (including inherited
   * methods).
   */
  methods(): sys.List<CMethod>;
  isList(): boolean;
  /**
   * If this is a parameterized type which uses `This`, then
   * replace `This` with the specified type.
   */
  parameterizeThis(thisType: CType): CType;
  /**
   * Return if this Type is const and immutable.
   */
  isConst(): boolean;
  /**
   * Is this a public scoped class
   */
  isPublic(): boolean;
  isStr(): boolean;
  /**
   * Return if this Type is final and cannot be subclassed.
   */
  isFinal(): boolean;
  /**
   * Return if this Type is a class (as opposed to enum or mixin)
   */
  isClass(): boolean;
  /**
   * Is this a valid type usable anywhere (such as local var)
   */
  isValid(): boolean;
  /**
   * Return if this Type is an sys::Enum
   */
  isEnum(): boolean;
  isFloat(): boolean;
  /**
   * Return if this Type is a mixin type and cannot be
   * instantiated.
   */
  isMixin(): boolean;
  /**
   * Return if this Type is abstract and cannot be instantiated. 
   * This method will always return true if the type is a mixin.
   */
  isAbstract(): boolean;
  isRange(): boolean;
  isVoid(): boolean;
  /**
   * List of the all constructors.
   */
  ctors(): sys.List<CMethod>;
  /**
   * Equality based on signature.
   */
  equals(t: sys.JsObj | null): boolean;
}

/**
 * Assembler assembles all the TypeDefs into their fcode
 * representation.
 */
export class Assembler extends CompilerSupport implements FConst {
  static type$: sys.Type
  assemblePod(): FPod;
  assembleMethod(fparent: FType, def: MethodDef): FMethod;
  name(val: string): number;
  assemblePodNoCode(): FPod;
  assembleField(fparent: FType, def: FieldDef): FField;
  static make(compiler: Compiler, ...args: unknown[]): Assembler;
  typeRef(type: CType): number;
}

/**
 * ParameterizedMethodParam
 */
export class ParameterizedMethodParam extends sys.Obj implements CParam {
  static type$: sys.Type
  type(): CType;
  type(it: CType): void;
  generic(): CParam;
  generic(it: CParam): void;
  toStr(): string;
  hasDefault(): boolean;
  name(): string;
  static make(parent: GenericType, generic: CParam, ...args: unknown[]): ParameterizedMethodParam;
  paramType(): CType;
}

/**
 * CType is a "compiler type" which is class used for
 * representing the Fantom type system in the compiler.  CTypes
 * map to types within the compilation units themsevles as
 * TypeDef and TypeRef or to precompiled types in imported pods
 * via ReflectType or FType.
 */
export abstract class CType extends sys.Obj implements CNode {
  static type$: sys.Type
  isNum(): boolean;
  /**
   * A parameterized type is a type which has parameterized a
   * generic type and replaced all the generic parameter types
   * with generic argument types.  The type Str[] is a
   * parameterized type of the generic type List (V is replaced
   * with Str).  A parameterized type always has a signature
   * which is different from the qname.
   */
  isParameterized(): boolean;
  /**
   * If this type is being used for type inference then get the
   * type as it should be inferred.  Typically we just return
   * this. However some FFI types such as `[java]::int` are never
   * used on the stack directly and are inferred to be `sys::Int`.
   */
  inferredAs(): CType;
  /**
   * Is this a compiler generated synthetic class
   */
  isSynthetic(): boolean;
  /**
   * Return if this type fits any of the types in the specified
   * list.
   */
  fitsAny(types: sys.List<CType>): boolean;
  /**
   * Is the entire class implemented in native code?
   */
  isNative(): boolean;
  /**
   * Is this type ok to use as a const field?  Any const type
   * fine, plus we allow Obj, List, Map, Buf, and Func since they
   * will implicitly have toImmutable called on them.
   */
  isConstFieldType(): boolean;
  isObj(): boolean;
  /**
   * Return the mixins directly implemented by this type.
   */
  mixins(): sys.List<CType>;
  isBool(): boolean;
  isBuf(): boolean;
  /**
   * Qualified name such as "sys:Str".
   */
  qname(): string;
  isInt(): boolean;
  isDecimal(): boolean;
  /**
   * Return if this Type is an sys::Facet
   */
  isFacet(): boolean;
  isNothing(): boolean;
  /**
   * Return signature
   */
  toStr(): string;
  /**
   * Lookup a method by name (null if field).
   */
  method(name: string): CMethod | null;
  /**
   * If this TypeDef extends from a FFI class or implements any
   * FFI mixins, then return the FFI type otherwise return null.
   */
  foreignInheritance(): CType | null;
  /**
   * If this type is a generic parameter (V, L, etc), then return
   * the actual type for the native implementation.  For example
   * V is Obj, and L is List.  This is the type we actually use
   * when constructing a signature for the invoke opcode.
   */
  raw(): CType;
  /**
   * Return if type is supported by the Fantom type system.  For
   * example the Java FFI will correctly model a Java
   * multi-dimensional array during compilation, however there is
   * no Fantom representation.  We check for supported types
   * during CheckErrors when accessing fields and methods.
   */
  isSupported(): boolean;
  isFunc(): boolean;
  /**
   * Does this type implement the specified type.  If true, then
   * this type is assignable to the specified type (although the
   * converse is not necessarily true).  All types (including
   * mixin types) fit sys::Obj.
   */
  fits(t: CType): boolean;
  isType(): boolean;
  isMap(): boolean;
  /**
   * Is this an internally scoped class
   */
  isInternal(): boolean;
  /**
   * Map of the all defined slots, both fields and methods
   * (including inherited slots).
   */
  slots(): sys.Map<string, CSlot>;
  /**
   * Return if this type contains a slot by the specified name.
   */
  hasSlot(name: string): boolean;
  /**
   * Return if this type is a generic parameter (such as V or K)
   * in a generic type (List, Map, or Method).  Generic
   * parameters serve as place holders for the parameterization
   * of the generic type. Fantom has a predefined set of generic
   * parameters which are always defined in the sys pod with a
   * one character name.
   */
  isGenericParameter(): boolean;
  /**
   * Lookup a field by name (null if method).
   */
  field(name: string): CField | null;
  /**
   * Is this is a nullable type (marked with trailing ?)
   */
  isNullable(): boolean;
  /**
   * Simple name of the type such as "Str".
   */
  name(): string;
  /**
   * If this is a foreign function return the bridge.
   */
  bridge(): CBridge | null;
  /**
   * List of the all defined fields (including inherited fields).
   */
  fields(): sys.List<CField>;
  /**
   * Hash on signature.
   */
  hash(): number;
  /**
   * Get this type as a non-nullable (if nullable)
   */
  toNonNullable(): CType;
  /**
   * Static utility for value type
   */
  static isValType(qname: string): boolean;
  isThis(): boolean;
  /**
   * If this is a TypeRef, return what it references
   */
  deref(): CType;
  /**
   * Parent pod which defines this type.
   */
  pod(): CPod;
  /**
   * List of the all instance constructors.
   */
  instanceCtors(): sys.List<CMethod>;
  /**
   * This is the full signature of the type.
   */
  signature(): string;
  /**
   * If this a foreign function interface type.
   */
  isForeign(): boolean;
  /**
   * List of the all defined methods (including inherited
   * methods).
   */
  methods(): sys.List<CMethod>;
  /**
   * Get the flags bitmask.
   */
  flags(): number;
  /**
   * Lookup a slot by name.  If the slot doesn't exist then
   * return null.
   */
  slot(name: string): CSlot | null;
  isList(): boolean;
  /**
   * Get this type as a nullable type (marked with trailing ?)
   */
  toNullable(): CType;
  /**
   * If this is a parameterized type which uses `This`, then
   * replace `This` with the specified type.
   */
  parameterizeThis(thisType: CType): CType;
  /**
   * Given a list of types, compute the most specific type which
   * they all share, or at worst return sys::Obj.  This method
   * does not take into account mixins, only extends class
   * inheritance.
   */
  static common(ns: CNamespace, types: sys.List<CType>): CType;
  /**
   * Get operators lookup structure
   */
  operators(): COperators;
  /**
   * Return if this Type is const and immutable.
   */
  isConst(): boolean;
  /**
   * Is this a public scoped class
   */
  isPublic(): boolean;
  isStr(): boolean;
  /**
   * Return if this Type is final and cannot be subclassed.
   */
  isFinal(): boolean;
  /**
   * Return if this Type is a class (as opposed to enum or mixin)
   */
  isClass(): boolean;
  /**
   * A generic type means that one or more of my slots contain
   * signatures using a generic parameter (such as V or K). 
   * Fantom supports three built-in generic types: List, Map, and
   * Func.  A generic instance (such as Str[]) is NOT a generic
   * type (all of its generic parameters have been filled in).
   * User defined generic types are not supported in Fan.
   */
  isGeneric(): boolean;
  /**
   * Is this a valid type usable anywhere (such as local var)
   */
  isValid(): boolean;
  /**
   * Return if this Type is an sys::Enum
   */
  isEnum(): boolean;
  /**
   * Is this is a value type (Bool, Int, or Float and their
   * nullables)
   */
  isVal(): boolean;
  isFloat(): boolean;
  /**
   * Return if this Type is a mixin type and cannot be
   * instantiated.
   */
  isMixin(): boolean;
  /**
   * Return if this Type is abstract and cannot be instantiated. 
   * This method will always return true if the type is a mixin.
   */
  isAbstract(): boolean;
  isRange(): boolean;
  isVoid(): boolean;
  /**
   * List of the all constructors.
   */
  ctors(): sys.List<CMethod>;
  /**
   * Equality based on signature.
   */
  equals(t: sys.JsObj | null): boolean;
  /**
   * Create a parameterized List of this type.
   */
  toListOf(): CType;
  /**
   * The direct super class of this type (null for Obj).
   */
  base(): CType | null;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  /**
   * Associated namespace for this type representation
   */
  ns(): CNamespace;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  /**
   * Fandoc API docs if available
   */
  doc(): CDoc | null;
  /**
   * Get the facet keyed by given type, or null if not defined.
   */
  facet(qname: string): CFacet | null;
}

/**
 * ComplexLiteral is used to model a serialized complex object
 * declared in facets.  It is only used in facets, in all other
 * code complex literals are parsed as it-block ClosureExprs.
 */
export class ComplexLiteral extends Expr {
  static type$: sys.Type
  vals(): sys.List<Expr>;
  vals(it: sys.List<Expr>): void;
  names(): sys.List<string>;
  names(it: sys.List<string>): void;
  doToStr(f: ((arg0: Expr) => string)): string;
  static make(loc: Loc, ctype: CType, ...args: unknown[]): ComplexLiteral;
  toStr(): string;
  serialize(): string;
  walkChildren(v: Visitor): void;
}

/**
 * CompilerLog manages logging compiler messages.  The default
 * writes everything to standard output.
 */
export class CompilerLog extends sys.Obj {
  static type$: sys.Type
  /**
   * Sink for all output
   */
  out(): sys.OutStream | null;
  out(it: sys.OutStream | null): void;
  /**
   * Current level of indentation
   */
  indentation(): number;
  indentation(it: number): void;
  /**
   * Max severity of log entries to report
   */
  level(): sys.LogLevel;
  level(it: sys.LogLevel): void;
  /**
   * Indent the output.
   */
  indent(): void;
  /**
   * Unindent the output.
   */
  unindent(): void;
  /**
   * Generate a log entry.  The log entry is only generated if
   * the specified level is greater than or equal to the
   * configured level field.
   */
  log(rec: sys.LogRec): void;
  /**
   * Is debug level enabled
   */
  isDebug(): boolean;
  /**
   * Construct for specified output stream.
   */
  static make(out?: sys.OutStream, ...args: unknown[]): CompilerLog;
  /**
   * Log an info level message.
   */
  info(msg: string, err?: sys.Err | null): void;
  /**
   * Print a line.
   */
  printLine(s?: sys.JsObj | null): CompilerLog;
  /**
   * Log an debug level message.
   */
  debug(msg: string, err?: sys.Err | null): void;
  /**
   * Log an error level message.
   */
  err(msg: string, err?: sys.Err | null): void;
  /**
   * Log a CompilerErr
   */
  compilerErr(err: CompilerErr): void;
  /**
   * Log a warn level message.
   */
  warn(msg: string, err?: sys.Err | null): void;
  /**
   * Print a string without trailing newline.
   */
  print(s: sys.JsObj | null): CompilerLog;
}

/**
 * LiteralExpr puts an Bool, Int, Float, Str, Duration, Uri, or
 * null constant onto the stack.
 */
export class LiteralExpr extends Expr {
  static type$: sys.Type
  val(): sys.JsObj | null;
  val(it: sys.JsObj | null): void;
  static makeStr(loc: Loc, ns: CNamespace, val: string, ...args: unknown[]): LiteralExpr;
  static makeFalse(loc: Loc, ns: CNamespace, ...args: unknown[]): LiteralExpr;
  static make(loc: Loc, id: ExprId, ctype: CType, val: sys.JsObj | null, ...args: unknown[]): LiteralExpr;
  toStr(): string;
  static makeDefaultLiteral(loc: Loc, ns: CNamespace, ctype: CType): LiteralExpr;
  isAlwaysNullable(): boolean;
  serialize(): string;
  static makeNull(loc: Loc, ns: CNamespace, ...args: unknown[]): LiteralExpr;
  static makeTrue(loc: Loc, ns: CNamespace, ...args: unknown[]): LiteralExpr;
  asTableSwitchCase(): number | null;
}

/**
 * FConst provides all the fcode constants
 */
export abstract class FConst extends sys.Obj {
  static type$: sys.Type
  static FCodeVersion(): string;
  static Enum(): number;
  static LineNumberAttr(): string;
  static Synthetic(): number;
  static LineNumbersAttr(): string;
  static Once(): number;
  static Getter(): number;
  static Internal(): number;
  static SourceFileAttr(): string;
  static ErrTableAttr(): string;
  static Mixin(): number;
  static Native(): number;
  static Ctor(): number;
  static Private(): number;
  static Final(): number;
  static Override(): number;
  static FlagsMask(): number;
  static Facet(): number;
  static FacetsAttr(): string;
  static Protected(): number;
  static Abstract(): number;
  static Const(): number;
  static Virtual(): number;
  static Public(): number;
  static Storage(): number;
  static Setter(): number;
  static Param(): number;
  static EnumOrdinalAttr(): string;
  static Static(): number;
  static ParamDefaultAttr(): string;
}

/**
 * CDoc models the fandoc for a definition node
 */
export abstract class CDoc extends sys.Obj {
  static type$: sys.Type
  /**
   * Constructor for raw string
   */
  static fromStr(s: string | null, ...args: unknown[]): CDoc;
  /**
   * Raw fandoc text string
   */
  text(): string;
}

/**
 * ReflectNamespace implements Namespace using reflection to
 * compile against the VM's current pod repository.
 */
export class ReflectNamespace extends CNamespace {
  static type$: sys.Type
  /**
   * Map a list of imported Types into a CTypes
   */
  importTypes(t: sys.List<sys.Type>): sys.List<CType>;
  /**
   * Map an imported Method into a CMethod
   */
  importMethod(m: sys.Method): CMethod;
  /**
   * Map an imported Field into a CField
   */
  importField(f: sys.Field): CField;
  /**
   * Map an imported Type into a CType
   */
  importType(t: sys.Type | null): CType | null;
  /**
   * Construct a ReflectNamespace
   */
  static make(...args: unknown[]): ReflectNamespace;
  /**
   * Map an imported Slot into a CSlot
   */
  importSlot(slot: sys.Slot): CSlot;
  /**
   * Map an imported Pod into a CPod
   */
  importPod(pod: sys.Pod): ReflectPod;
}

/**
 * ContinueStmt continues a while/for loop.
 */
export class ContinueStmt extends Stmt {
  static type$: sys.Type
  loop(): Stmt | null;
  loop(it: Stmt | null): void;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  isExit(): boolean;
  print(out: AstWriter): void;
  static make(loc: Loc, ...args: unknown[]): ContinueStmt;
}

/**
 * ParamDef models the definition of a method parameter.
 */
export class ParamDef extends Node implements CParam {
  static type$: sys.Type
  def(): Expr | null;
  def(it: Expr | null): void;
  type(): CType;
  type(it: CType): void;
  name(): string;
  name(it: string): void;
  toStr(): string;
  /**
   * Does this param have a def that uses an assign store
   * instruction because CheckParamDefs detected it used previous
   * parameters
   */
  isAssign(): boolean;
  hasDefault(): boolean;
  print(out: AstWriter): void;
  static make(loc: Loc, type: CType, name: string, def?: Expr | null, ...args: unknown[]): ParamDef;
  paramType(): CType;
}

/**
 * Main is the main entry point for the Fantom compiler.
 * Originally it was used for "fanc" command line, but it
 * encapsualtes static methods used by sys.
 */
export class Main extends sys.Obj {
  static type$: sys.Type
  /**
   * Compile the script file into JS source code. See {@link sys.Env.compileScript | sys::Env.compileScript}
   * for option definitions.
   */
  static compileScriptToJs(podName: string, file: sys.File, options?: sys.Map<string, sys.JsObj> | null): string;
  /**
   * Compile the script file into a transient pod. See {@link sys.Env.compileScript | sys::Env.compileScript}
   * for option definitions.
   */
  static compileScript(podName: string, file: sys.File, options?: sys.Map<string, sys.JsObj> | null): sys.Pod;
  static make(...args: unknown[]): Main;
}

/**
 * ApiDocWriter is used to write out an AST definition in the
 * Fantom API doc formatted used by compilerDoc. See `compilerDoc::ApiDocParser`
 * for formal definition.
 */
export class ApiDocWriter extends sys.Obj {
  static type$: sys.Type
  out(): sys.OutStream;
  out(it: sys.OutStream): void;
  writeType(t: TypeDef): this;
  static make(out: sys.OutStream, ...args: unknown[]): ApiDocWriter;
  close(): boolean;
  w(x: string): this;
}

/**
 * Parse is responsible for parsing all the compilation units
 * which have already been tokenized into their full abstract
 * syntax tree representation in memory.  Once complete this
 * step populates the Compiler.types list with the list of
 * declared types.
 */
export class Parse extends CompilerStep {
  static type$: sys.Type
  /**
   * Run the step
   */
  run(): void;
  /**
   * Constructor takes the associated Compiler
   */
  static make(compiler: Compiler, ...args: unknown[]): Parse;
}

/**
 * Node is the base class of all classes which represent a node
 * in the abstract syntax tree generated by the parser.
 */
export class Node extends sys.Obj {
  static type$: sys.Type
  loc(): Loc;
  loc(it: Loc): void;
  /**
   * Pretty print this node and it's descendants.
   */
  print(out: AstWriter): void;
  /**
   * Print to std out
   */
  dump(): void;
  /**
   * All Node's must have a valid location in a source file.
   */
  static make(loc: Loc, ...args: unknown[]): Node;
}

/**
 * TypeDef models a type definition for a class, mixin or enum
 */
export class TypeDef extends DefNode implements CType {
  static type$: sys.Type
  mixins(): sys.List<CType>;
  mixins(it: sys.List<CType>): void;
  qname(): string;
  enumDefs(): sys.List<EnumDef>;
  enumDefs(it: sys.List<EnumDef>): void;
  baseSpecified(): boolean;
  baseSpecified(it: boolean): void;
  pod(): CPod;
  pod(it: CPod): void;
  isVal(): boolean;
  closure(): ClosureExpr | null;
  closure(it: ClosureExpr | null): void;
  unit(): CompilationUnit;
  unit(it: CompilationUnit): void;
  closures(): sys.List<ClosureExpr>;
  closures(it: sys.List<ClosureExpr>): void;
  name(): string;
  ns(): CNamespace;
  ns(it: CNamespace): void;
  indexedFacets(): sys.List<FacetDef> | null;
  indexedFacets(it: sys.List<FacetDef> | null): void;
  podDef(): PodDef;
  podDef(it: PodDef): void;
  base(): CType | null;
  base(it: CType | null): void;
  /**
   * Return if this class has a slot definition for specified
   * name.
   */
  hasSlotDef(name: string): boolean;
  isParameterized(): boolean;
  /**
   * Return FieldDef for specified name or null.
   */
  fieldDef(name: string): FieldDef | null;
  /**
   * Get the SlotDefs declared within this TypeDef.
   */
  slotDefs(): sys.List<SlotDef>;
  /**
   * Does this class have any it block constructors
   */
  hasItBlockCtor(): boolean;
  /**
   * Return SlotDef for specified name or null.
   */
  slotDef(name: string): SlotDef | null;
  signature(): string;
  /**
   * Get the FieldDefs declared within this TypeDef.
   */
  fieldDefs(): sys.List<FieldDef>;
  /**
   * If during parse we added any static initializer methods, now
   * is the time to remove them all and replace them with a
   * single collapsed MethodDef (processed in Normalize step)
   */
  normalizeStaticInits(m: MethodDef): void;
  /**
   * Does this class have any native slots (false if entire class
   * is native)
   */
  hasNativePeer(): boolean;
  /**
   * Cached COperators map
   */
  operators(): COperators;
  /**
   * Get the static FieldDefs declared within this TypeDef.
   */
  staticFieldDefs(): sys.List<FieldDef>;
  /**
   * Return EnumDef for specified name or null.
   */
  enumDef(name: string): EnumDef | null;
  /**
   * Return MethodDef for specified name or null.
   */
  methodDef(name: string): MethodDef | null;
  /**
   * Get the MethodDefs declared within this TypeDef.
   */
  methodDefs(): sys.List<MethodDef>;
  /**
   * Replace oldSlot with newSlot in my slot tables.
   */
  replaceSlot(oldSlot: CSlot, newSlot: CSlot): void;
  /**
   * Get the constructor MethodDefs declared within this TypeDef.
   */
  ctorDefs(): sys.List<MethodDef>;
  /**
   * Return if this type is the anonymous class of a closure
   */
  isClosure(): boolean;
  /**
   * Get the instance FieldDefs declared within this TypeDef.
   */
  instanceFieldDefs(): sys.List<FieldDef>;
  /**
   * Return all the all slots (inherited and defined)
   */
  slots(): sys.Map<string, CSlot>;
  isGenericParameter(): boolean;
  /**
   * Add a slot to the type definition.  The method is used to
   * add SlotDefs declared by this type as well as slots
   * inherited by this type.
   */
  addSlot(s: CSlot, slotDefIndex?: number | null): void;
  isNullable(): boolean;
  toNullable(): CType;
  static make(ns: CNamespace, loc: Loc, unit: CompilationUnit, name: string, flags?: number, ...args: unknown[]): TypeDef;
  isGeneric(): boolean;
  print(out: AstWriter): void;
  toListOf(): CType;
  /**
   * Get static initializer if one is defined.
   */
  staticInit(): MethodDef | null;
  walk(v: Visitor, depth: VisitDepth): void;
  isNum(): boolean;
  /**
   * If this type is being used for type inference then get the
   * type as it should be inferred.  Typically we just return
   * this. However some FFI types such as `[java]::int` are never
   * used on the stack directly and are inferred to be `sys::Int`.
   */
  inferredAs(): CType;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  /**
   * Is this a compiler generated synthetic class
   */
  isSynthetic(): boolean;
  /**
   * Return if this type fits any of the types in the specified
   * list.
   */
  fitsAny(types: sys.List<CType>): boolean;
  /**
   * Is the entire class implemented in native code?
   */
  isNative(): boolean;
  /**
   * Is this type ok to use as a const field?  Any const type
   * fine, plus we allow Obj, List, Map, Buf, and Func since they
   * will implicitly have toImmutable called on them.
   */
  isConstFieldType(): boolean;
  isObj(): boolean;
  isBool(): boolean;
  isBuf(): boolean;
  isInt(): boolean;
  isDecimal(): boolean;
  /**
   * Return if this Type is an sys::Facet
   */
  isFacet(): boolean;
  isNothing(): boolean;
  /**
   * Return signature
   */
  toStr(): string;
  /**
   * Lookup a method by name (null if field).
   */
  method(name: string): CMethod | null;
  /**
   * If this TypeDef extends from a FFI class or implements any
   * FFI mixins, then return the FFI type otherwise return null.
   */
  foreignInheritance(): CType | null;
  /**
   * If this type is a generic parameter (V, L, etc), then return
   * the actual type for the native implementation.  For example
   * V is Obj, and L is List.  This is the type we actually use
   * when constructing a signature for the invoke opcode.
   */
  raw(): CType;
  /**
   * Return if type is supported by the Fantom type system.  For
   * example the Java FFI will correctly model a Java
   * multi-dimensional array during compilation, however there is
   * no Fantom representation.  We check for supported types
   * during CheckErrors when accessing fields and methods.
   */
  isSupported(): boolean;
  isFunc(): boolean;
  /**
   * Does this type implement the specified type.  If true, then
   * this type is assignable to the specified type (although the
   * converse is not necessarily true).  All types (including
   * mixin types) fit sys::Obj.
   */
  fits(t: CType): boolean;
  isType(): boolean;
  isMap(): boolean;
  /**
   * Is this an internally scoped class
   */
  isInternal(): boolean;
  /**
   * Return if this type contains a slot by the specified name.
   */
  hasSlot(name: string): boolean;
  /**
   * Lookup a field by name (null if method).
   */
  field(name: string): CField | null;
  /**
   * Fandoc API docs if available
   */
  doc(): CDoc | null;
  /**
   * If this is a foreign function return the bridge.
   */
  bridge(): CBridge | null;
  /**
   * List of the all defined fields (including inherited fields).
   */
  fields(): sys.List<CField>;
  /**
   * Hash on signature.
   */
  hash(): number;
  /**
   * Get this type as a non-nullable (if nullable)
   */
  toNonNullable(): CType;
  isThis(): boolean;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  /**
   * If this is a TypeRef, return what it references
   */
  deref(): CType;
  /**
   * List of the all instance constructors.
   */
  instanceCtors(): sys.List<CMethod>;
  /**
   * If this a foreign function interface type.
   */
  isForeign(): boolean;
  /**
   * List of the all defined methods (including inherited
   * methods).
   */
  methods(): sys.List<CMethod>;
  /**
   * Get the flags bitmask.
   */
  flags(): number;
  /**
   * Lookup a slot by name.  If the slot doesn't exist then
   * return null.
   */
  slot(name: string): CSlot | null;
  isList(): boolean;
  /**
   * If this is a parameterized type which uses `This`, then
   * replace `This` with the specified type.
   */
  parameterizeThis(thisType: CType): CType;
  /**
   * Return if this Type is const and immutable.
   */
  isConst(): boolean;
  /**
   * Is this a public scoped class
   */
  isPublic(): boolean;
  isStr(): boolean;
  /**
   * Return if this Type is final and cannot be subclassed.
   */
  isFinal(): boolean;
  /**
   * Return if this Type is a class (as opposed to enum or mixin)
   */
  isClass(): boolean;
  /**
   * Is this a valid type usable anywhere (such as local var)
   */
  isValid(): boolean;
  /**
   * Return if this Type is an sys::Enum
   */
  isEnum(): boolean;
  isFloat(): boolean;
  /**
   * Return if this Type is a mixin type and cannot be
   * instantiated.
   */
  isMixin(): boolean;
  /**
   * Return if this Type is abstract and cannot be instantiated. 
   * This method will always return true if the type is a mixin.
   */
  isAbstract(): boolean;
  isRange(): boolean;
  isVoid(): boolean;
  /**
   * List of the all constructors.
   */
  ctors(): sys.List<CMethod>;
  /**
   * Equality based on signature.
   */
  equals(t: sys.JsObj | null): boolean;
  /**
   * Get the facet keyed by given type, or null if not defined.
   */
  facet(qname: string): CFacet | null;
}

/**
 * UnknownVarExpr is a place holder in the AST for a variable
 * until we can figure out what it references: local or slot. 
 * We also use this class for storage operators before they are
 * resolved to a field.
 */
export class UnknownVarExpr extends NameExpr {
  static type$: sys.Type
  static make(loc: Loc, target: Expr | null, name: string, id?: ExprId, ...args: unknown[]): UnknownVarExpr;
}

/**
 * MockMethod
 */
export class MockMethod extends MockSlot implements CMethod {
  static type$: sys.Type
  params(): sys.List<CParam>;
  params(it: sys.List<CParam>): void;
  returns(): CType;
  returns(it: CType): void;
  inheritedReturns(): CType;
  static make(parent: CType, name: string, flags: number, ret: CType, params: sys.List<CType>, ...args: unknown[]): MockMethod;
  parent(): CType;
  /**
   * Is this method the parameterization of a generic method,
   * with all the generic parameters filled in with real types.
   */
  isParameterized(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  isSynthetic(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  /**
   * Return if this method has the exact same parameters as the
   * specified method.
   */
  hasSameParams(that: CMethod): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  qname(): string;
  inheritedReturnType(): CType;
  toStr(): string;
  isInternal(): boolean;
  /**
   * Return a string with the name and parameters.
   */
  nameAndParamTypesToStr(): string;
  name(): string;
  /**
   * Fandoc API docs if available
   */
  doc(): CDoc | null;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  returnType(): CType;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  ns(): CNamespace;
  signature(): string;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  flags(): number;
  isPrivate(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  isGetter(): boolean;
  /**
   * Does this method contains generic parameters in its
   * signature.
   */
  isGeneric(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  /**
   * If isParameterized is true, then return the generic method
   * which this method parameterizes, otherwise null
   */
  generic(): CMethod | null;
  isSetter(): boolean;
  /**
   * Does this method have a covariant return type (we don't
   * count This returns as covariant)
   */
  isCovariant(): boolean;
  /**
   * Get the facet keyed by given type, or null if not defined.
   */
  facet(qname: string): CFacet | null;
  isCtor(): boolean;
}

/**
 * FuncType models a parameterized Func type.
 */
export class FuncType extends GenericType {
  static type$: sys.Type
  params(): sys.List<CType>;
  params(it: sys.List<CType>): void;
  returns(): CType;
  returns(it: CType): void;
  signature(): string;
  inferredSignature(): boolean;
  inferredSignature(it: boolean): void;
  unnamed(): boolean;
  unnamed(it: boolean): void;
  names(): sys.List<string>;
  names(it: sys.List<string>): void;
  isGenericParameter(): boolean;
  static makeItBlock(itType: CType, ...args: unknown[]): FuncType;
  flags(): number;
  static toMostSpecific(a: CType, b: CType): CType;
  arity(): number;
  mostSpecific(b: FuncType): FuncType;
  /**
   * Replace any occurance of "sys::This" with thisType.
   */
  parameterizeThis(thisType: CType): FuncType;
  toParamDefs(loc: Loc): sys.List<ParamDef>;
  isValid(): boolean;
  doParameterize(ch: number): CType;
  ret(): CType;
  /**
   * Return if this function type has `This` type in its signature.
   */
  usesThis(): boolean;
  toArity(num: number): FuncType;
  fits(t: CType): boolean;
  static make(params: sys.List<CType>, names: sys.List<string>, returns: CType, ...args: unknown[]): FuncType;
}

/**
 * Walk the AST to resolve:
 * - Manage local variable scope
 * - Resolve loop for breaks and continues
 * - Resolve LocalDefStmt.init into full assignment expression
 * - Resolve Expr.ctype
 * - Resolve UknownVarExpr -> LocalVarExpr, FieldExpr, or
 *   CallExpr
 * - Resolve CallExpr to their CMethod
 */
export class ResolveExpr extends CompilerStep {
  static type$: sys.Type
  coercer(): Coercer;
  coercer(it: Coercer): void;
  stmtStack(): sys.List<Stmt>;
  stmtStack(it: sys.List<Stmt>): void;
  inClosure(): boolean;
  inClosure(it: boolean): void;
  blockStack(): sys.List<Block>;
  blockStack(it: sys.List<Block>): void;
  enterBlock(block: Block): void;
  run(): void;
  enterStmt(stmt: Stmt): void;
  visitStmt(stmt: Stmt): sys.List<Stmt> | null;
  exitBlock(block: Block): void;
  enterMethodDef(m: MethodDef): void;
  static make(compiler: Compiler, ...args: unknown[]): ResolveExpr;
  visitExpr(expr: Expr): Expr;
}

/**
 * Parser is responsible for parsing a list of tokens into the
 * abstract syntax tree.  At this point the CompilationUnit,
 * Usings, and TypeDefs are already populated by the
 * ScanForUsingAndTypes step.
 */
export class Parser extends CompilerSupport {
  static type$: sys.Type
  static ProtectionMask(): number;
  /**
   * TypeDef:
   * ```
   * <typeDef>      :=  <classDef> | <mixinDef> | <enumDef> | <facetDef>
   * 
   * <classDef>     :=  <classHeader> <classBody>
   * <classHeader>  :=  [<doc>] <facets> <typeFlags> "class" [<inheritance>]
   * <classFlags>   :=  [<protection>] ["abstract"] ["final"]
   * <classBody>    :=  "{" <slotDefs> "}"
   * 
   * <enumDef>      :=  <enumHeader> <enumBody>
   * <enumHeader>   :=  [<doc>] <facets> <protection> "enum" [<inheritance>]
   * <enumBody>     :=  "{" <enumDefs> <slotDefs> "}"
   * 
   * <facetDef      :=  <facetHeader> <enumBody>
   * <facetHeader>  :=  [<doc>] <facets> [<protection>] "facet" "class" <id> [<inheritance>]
   * <facetBody>    :=  "{" <slotDefs> "}"
   * 
   * <mixinDef>     :=  <enumHeader> <enumBody>
   * <mixinHeader>  :=  [<doc>] <facets> <protection> "mixin" [<inheritance>]
   * <mixinBody>    :=  "{" <slotDefs> "}"
   * 
   * <protection>   :=  "public" | "protected" | "private" | "internal"
   * <inheritance>  :=  ":" <typeList>
   * ```
   */
  typeDef(): void;
  err(msg: string, loc?: Loc | null): CompilerErr;
  /**
   * Construct the parser for the specified compilation unit.
   */
  static make(compiler: Compiler, unit: CompilationUnit, closures: sys.List<ClosureExpr>, ...args: unknown[]): Parser;
  /**
   * Top level parse a compilation unit:
   * ```
   * <compilationUnit> :=  [<usings>] <typeDef>*
   * ```
   */
  parse(): void;
}

/**
 * CompilerInput encapsulates all the input needed run the
 * compiler. The compiler can be run in one of two modes - file
 * or str.  In file mode the source code and resource files are
 * read from the file system.  In str mode we compile a single
 * source file from an in-memory string.
 */
export class CompilerInput extends sys.Obj {
  static type$: sys.Type
  /**
   * If set to true, then generate apidocs for test subclasses
   */
  docTests(): boolean;
  docTests(it: boolean): void;
  /**
   * Namespace used to resolve dependency pods/types. Default
   * implementation uses reflection of the compiler's VM.
   */
  ns(): CNamespace;
  ns(it: CNamespace): void;
  /**
   * Log used for reporting compile status
   */
  log(): CompilerLog;
  log(it: CompilerLog): void;
  /**
   * Generate a unique wrapper type per parameterized List/Map.
   * By default we generate one acme::Wrap$List class per pod for
   * all List types. But when transpiling Java we need a
   * different version per parameterized List/Map.
   */
  wrapperPerParameterizedCollectionType(): boolean;
  wrapperPerParameterizedCollectionType(it: boolean): void;
  /**
   * Flag to indicate if we are are compiling a script.  Scripts
   * don't require explicit depends and can import any type via
   * the using statement or with qualified type names.
   */
  isScript(): boolean;
  isScript(it: boolean): void;
  /**
   * List of files or directores containing `.props` files that
   * should be compiled to JavaScript.  If this field is null
   * then it defaults to {@link resFiles | resFiles}.  Uris are
   * relative to {@link baseDir | baseDir}. This field is used
   * only in file mode.
   */
  jsPropsFiles(): sys.List<sys.Uri> | null;
  jsPropsFiles(it: sys.List<sys.Uri> | null): void;
  /**
   * Flag indicating if we should treat all types as having the
   * @Js facet
   */
  forceJs(): boolean;
  forceJs(it: boolean): void;
  /**
   * Output directory to write pod to, defaults to the current
   * environment's working lib directory
   */
  outDir(): sys.File;
  outDir(it: sys.File): void;
  /**
   * Include source code in output pod, default is false
   */
  includeSrc(): boolean;
  includeSrc(it: boolean): void;
  /**
   * What type of output should be generated - the compiler can
   * be used to generate a transient in-memory pod, write a pod
   * zip file to disk, or generate JavaScript code.
   */
  output(): CompilerOutputMode | null;
  output(it: CompilerOutputMode | null): void;
  /**
   * This mode determines whether the source code is input from
   * the file system or from an in-memory string.
   */
  mode(): CompilerInputMode | null;
  mode(it: CompilerInputMode | null): void;
  /**
   * Base directory of source tree - this directory is used to
   * create the relative paths of the source and resource files
   * in the pod zip.
   */
  baseDir(): sys.File | null;
  baseDir(it: sys.File | null): void;
  /**
   * List of resource files or directories containing resource
   * files to include in the pod zip.  Uris are relative to {@link baseDir | baseDir}.
   * This field is used only in file mode.  If a file has a "jar"
   * extension then its contents are unzipped into the target
   * pod.
   */
  resFiles(): sys.List<sys.Uri> | null;
  resFiles(it: sys.List<sys.Uri> | null): void;
  /**
   * Location to use for SourceFile facet (str mode only)
   */
  srcStrLoc(): Loc | null;
  srcStrLoc(it: Loc | null): void;
  /**
   * Location to use for reporting errors associated with the
   * input itself - typically this is mapped to the build script.
   */
  inputLoc(): Loc;
  inputLoc(it: Loc): void;
  /**
   * Flag to force Fantom closures to be compiled with type
   * reflection information when emitting JavaScript.
   */
  jsReflectClosures(): boolean;
  jsReflectClosures(it: boolean): void;
  /**
   * Generate a type cast coercion between collections with
   * different parameterized types. For example normal Fantom we
   * can use `Str[]` where `Obj[]` it expected with no cast.  But
   * when transpiling Java, these must be explicitly cast. The
   * compiler actually generates a proper parameterized type cast
   * such as `Obj[]`, but in Java this isn't valid so we always
   * just cast to the generic type `List`.
   */
  coerceParameterizedCollectionTypes(): boolean;
  coerceParameterizedCollectionTypes(it: boolean): void;
  /**
   * List of Fantom source files or directories containing Fantom
   * source files to compile.  Uris are relative to {@link baseDir | baseDir}.
   * This field is used only in file mode.
   */
  srcFiles(): sys.List<sys.Uri> | null;
  srcFiles(it: sys.List<sys.Uri> | null): void;
  /**
   * Fantom source code to compile (str mode only)
   */
  srcStr(): string | null;
  srcStr(it: string | null): void;
  /**
   * Summary description for pod
   */
  summary(): string | null;
  summary(it: string | null): void;
  /**
   * Include fandoc in output pod, default is false
   */
  includeDoc(): boolean;
  includeDoc(it: boolean): void;
  /**
   * List of this pod's dependencies used for both the compiler
   * checking and output in the pod's manifest.
   */
  depends(): sys.List<sys.Depend>;
  depends(it: sys.List<sys.Depend>): void;
  /**
   * If set to true, then disassembled fcode is dumped to `log.out`.
   */
  fcodeDump(): boolean;
  fcodeDump(it: boolean): void;
  /**
   * Pod indexing name/value pairs.  The index values can be a
   * single Str or a Str[] if there are multiple values mapped to
   * one key.
   */
  index(): sys.Map<string, sys.JsObj>;
  index(it: sys.Map<string, sys.JsObj>): void;
  /**
   * Version to include in ouput pod's manifest.
   */
  version(): sys.Version | null;
  version(it: sys.Version | null): void;
  /**
   * List of JavaScript files or directories containing
   * JavaScript files to include in the JavaScript output.  Uris
   * are relative to {@link baseDir | baseDir}. This field is used
   * only in file mode.
   */
  jsFiles(): sys.List<sys.Uri> | null;
  jsFiles(it: sys.List<sys.Uri> | null): void;
  /**
   * Is this compile process being run inside a test, default is
   * false
   */
  isTest(): boolean;
  isTest(it: boolean): void;
  /**
   * Pod meta-data name/value pairs
   */
  meta(): sys.Map<string, string>;
  meta(it: sys.Map<string, string>): void;
  /**
   * Name of output pod - required in all modes.
   */
  podName(): string | null;
  podName(it: string | null): void;
  static make(...args: unknown[]): CompilerInput;
}

/**
 * Expr
 */
export class Expr extends Node {
  static type$: sys.Type
  leave(): boolean;
  leave(it: boolean): void;
  id(): ExprId;
  ctype(): CType | null;
  ctype(it: CType | null): void;
  /**
   * If this an assignment expression, then return the result of
   * calling the given function with the LHS. Otherwise return
   * false.
   */
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  /**
   * Return if this expression can be used as the left hand side
   * of an assignment expression.
   */
  isAssignable(): boolean;
  /**
   * Set this expression to not be left on the stack.
   */
  noLeave(): Expr;
  /**
   * Get this expression as a string suitable for documentation.
   * This string must not contain a newline or it will break the
   * DocApiParser.
   */
  toDocStr(): string | null;
  static walkExprs(v: Visitor, exprs: sys.List<Expr | null>): sys.List<Expr>;
  /**
   * If this an instance of CallExpr return it otherwise null
   */
  asCall(): CallExpr | null;
  /**
   * Is this a boolean conditional (boolOr/boolAnd)
   */
  isCond(): boolean;
  /**
   * Return this expression as an ExprStmt
   */
  toStmt(): ExprStmt;
  /**
   * Get this expression's type as a string for error reporting.
   */
  toTypeStr(): string;
  /**
   * Make an Expr which will serialize the given literal.
   */
  static makeForLiteral(loc: Loc, ns: CNamespace, val: sys.JsObj): Expr;
  static make(loc: Loc, id: ExprId, ...args: unknown[]): Expr;
  /**
   * Given a list of Expr instances, find the common base type
   * they all share.  This method does not take into account the
   * null literal.  It is used for type inference for lists and
   * maps.
   */
  static commonType(ns: CNamespace, exprs: sys.List<Expr>): CType;
  toStr(): string;
  /**
   * If this expression performs assignment, then return the
   * target of that assignment.  Otherwise return null.
   */
  assignTarget(): sys.JsObj | null;
  static walkExpr(v: Visitor, expr: Expr | null): Expr | null;
  /**
   * Assignments to instance fields require a temporary local
   * variable.
   */
  assignRequiresTempVar(): boolean;
  /**
   * Return if this expression represents the same variable or
   * field as that.  This is used for self assignment checks.
   */
  sameVarAs(that: Expr): boolean;
  /**
   * Was this expression generated by the compiler (not
   * necessarily everything auto-generated has this flag true,
   * but we set in cases where error checking needs to be handled
   * special)
   */
  synthetic(): boolean;
  /**
   * Return if this expression is guaranteed to sometimes return
   * a null result (safe invoke, as, etc)
   */
  isAlwaysNullable(): boolean;
  /**
   * Return this expression as serialization text or throw
   * exception if not serializable.
   */
  serialize(): string;
  print(out: AstWriter): void;
  /**
   * Return this expression as an Int literal usable in a
   * tableswitch, or null if this Expr doesn't represent a
   * constant Int.  Expressions which work as table switch cases:
   * int literals and enum constants
   */
  asTableSwitchCase(): number | null;
  /**
   * Does this expression make up a complete statement. If you
   * override this to true, then you must make sure the expr is
   * popped in CodeAsm.
   */
  isStmt(): boolean;
  /**
   * Map the list of expressions into their list of types
   */
  static ctypes(exprs: sys.List<Expr>): sys.List<CType>;
  walk(v: Visitor): Expr;
  walkChildren(v: Visitor): void;
}

/**
 * DslExpr is an embedded Domain Specific Language which is
 * parsed by a DslPlugin.
 */
export class DslExpr extends Expr {
  static type$: sys.Type
  srcLoc(): Loc;
  srcLoc(it: Loc): void;
  src(): string;
  src(it: string): void;
  leadingTabs(): number;
  leadingTabs(it: number): void;
  leadingSpaces(): number;
  leadingSpaces(it: number): void;
  anchorType(): CType;
  anchorType(it: CType): void;
  static make(loc: Loc, anchorType: CType, srcLoc: Loc, src: string, ...args: unknown[]): DslExpr;
  toStr(): string;
  print(out: AstWriter): void;
}

/**
 * ExprStmt is a statement with a stand along expression such
 * as an assignment or method call.
 */
export class ExprStmt extends Stmt {
  static type$: sys.Type
  expr(): Expr;
  expr(it: Expr): void;
  toStr(): string;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  isExit(): boolean;
  print(out: AstWriter): void;
  isOnceFieldInit(): boolean;
  printOpt(out: AstWriter, nl?: boolean): void;
  static make(expr: Expr, ...args: unknown[]): ExprStmt;
  walkChildren(v: Visitor, depth: VisitDepth): void;
}

/**
 * ConstChecks adds hooks into constructors and it-blocks to
 * ensure that an attempt to set a const field will throw
 * ConstErr if not in the objects constructor.  We also use
 * this step to insert the runtime checks for non-nullable
 * fields.
 * 
 * For each it-block which sets const fields:
 * ```
 * doCall(Foo it)
 * {
 *   this.checkInCtor(it)
 *   ...
 * }
 * ```
 * 
 * For each constructor which takes an it-block:
 * ```
 * new make(..., |This| f)
 * {
 *   f?.enterCtor(this)
 *   ...
 *   checksField$Foo()  // if non-nullable fields need runtime checks
 *   f?.exitCtor()      // for every return
 *   return
 * }
 * ```
 */
export class ConstChecks extends CompilerStep {
  static type$: sys.Type
  curCtor(): MethodDef | null;
  curCtor(it: MethodDef | null): void;
  fieldCheck(): MethodDef | null;
  fieldCheck(it: MethodDef | null): void;
  run(): void;
  visitStmt(stmt: Stmt): sys.List<Stmt> | null;
  static make(compiler: Compiler, ...args: unknown[]): ConstChecks;
}

/**
 * CMethod is a "compiler method" which is represents a Method
 * in the compiler.  CMethods unify methods being compiled as
 * MethodDefs with methods imported as ReflectMethod or
 * FMethod.
 */
export abstract class CMethod extends sys.Obj implements CSlot {
  static type$: sys.Type
  /**
   * Is this method the parameterization of a generic method,
   * with all the generic parameters filled in with real types.
   */
  isParameterized(): boolean;
  /**
   * Return if this method has the exact same parameters as the
   * specified method.
   */
  hasSameParams(that: CMethod): boolean;
  inheritedReturnType(): CType;
  /**
   * Parameter signatures
   */
  params(): sys.List<CParam>;
  /**
   * Return a string with the name and parameters.
   */
  nameAndParamTypesToStr(): string;
  /**
   * Original return type from inherited method if a covariant
   * override.
   */
  inheritedReturns(): CType;
  /**
   * Return type
   */
  returns(): CType;
  returnType(): CType;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  /**
   * Does this method contains generic parameters in its
   * signature.
   */
  isGeneric(): boolean;
  static calcGeneric(m: CMethod): boolean;
  /**
   * If isParameterized is true, then return the generic method
   * which this method parameterizes, otherwise null
   */
  generic(): CMethod | null;
  /**
   * Does this method have a covariant return type (we don't
   * count This returns as covariant)
   */
  isCovariant(): boolean;
  parent(): CType;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  ns(): CNamespace;
  signature(): string;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  flags(): number;
  isSynthetic(): boolean;
  isPrivate(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  qname(): string;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  toStr(): string;
  isGetter(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  isInternal(): boolean;
  name(): string;
  isSetter(): boolean;
  /**
   * Fandoc API docs if available
   */
  doc(): CDoc | null;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  /**
   * Get the facet keyed by given type, or null if not defined.
   */
  facet(qname: string): CFacet | null;
  isCtor(): boolean;
}

/**
 * FFacet
 */
export class FFacet extends sys.Obj implements CFacet {
  static type$: sys.Type
  val(): string;
  qname(): string;
  toStr(): string;
  static decode(fpod: FPod, attr: FAttr | null): sys.List<FFacet>;
  get(name: string): sys.JsObj | null;
  static make(qn: string, v: string, ...args: unknown[]): FFacet;
}

/**
 * StaticTargetExpr wraps a type reference as an Expr for use
 * as a target in a static field access or method call
 */
export class StaticTargetExpr extends Expr {
  static type$: sys.Type
  static make(loc: Loc, ctype: CType, ...args: unknown[]): StaticTargetExpr;
  toStr(): string;
  sameVarAs(that: Expr): boolean;
}

/**
 * MockParam
 */
export class MockParam extends sys.Obj implements CParam {
  static type$: sys.Type
  type(): CType;
  type(it: CType): void;
  name(): string;
  name(it: string): void;
  hasDefault(): boolean;
  static make(name: string, of$: CType, ...args: unknown[]): MockParam;
  paramType(): CType;
}

/**
 * CodeAsm is used to assemble the fcode instructions of an
 * Expr or Block.
 */
export class CodeAsm extends CompilerSupport {
  static type$: sys.Type
  lineCount(): number;
  lineCount(it: number): void;
  fpod(): FPod;
  fpod(it: FPod): void;
  returnLocal(): MethodVar | null;
  returnLocal(it: MethodVar | null): void;
  loc(): Loc;
  loc(it: Loc): void;
  curMethod(): MethodDef | null;
  curMethod(it: MethodDef | null): void;
  lastLine(): number;
  lastLine(it: number): void;
  leavesToReturn(): sys.List<number> | null;
  leavesToReturn(it: sys.List<number> | null): void;
  errCount(): number;
  errCount(it: number): void;
  loopStack(): sys.List<Loop>;
  loopStack(it: sys.List<Loop>): void;
  protectedRegions(): sys.List<ProtectedRegion> | null;
  protectedRegions(it: sys.List<ProtectedRegion> | null): void;
  code(): sys.Buf;
  code(it: sys.Buf): void;
  lastOffset(): number;
  lastOffset(it: number): void;
  errTable(): sys.Buf;
  errTable(it: sys.Buf): void;
  lines(): sys.Buf;
  lines(it: sys.Buf): void;
  /**
   * Append a opcode with a type argument.
   */
  opType(opcode: FOp, arg: CType): void;
  block(block: Block): void;
  /**
   * Finish writing out the line number table
   */
  finishLines(): sys.Buf;
  /**
   * Finish writing out the exception handling table
   */
  finishErrTable(): sys.Buf;
  /**
   * Finish writing out the exception handling table
   */
  finishCode(): sys.Buf;
  expr(expr: Expr): void;
  static make(compiler: Compiler, loc: Loc, fpod: FPod, curMethod: MethodDef | null, ...args: unknown[]): CodeAsm;
  /**
   * Append a opcode with option two byte argument.
   */
  op(op: FOp, arg?: number | null): void;
  stmt(stmt: Stmt): void;
}

/**
 * Input source from the file system
 */
export class CompilerInputMode extends sys.Enum {
  static type$: sys.Type
  /**
   * List of CompilerInputMode values indexed by ordinal
   */
  static vals(): sys.List<CompilerInputMode>;
  static str(): CompilerInputMode;
  static file(): CompilerInputMode;
  /**
   * Return the CompilerInputMode instance for the specified
   * name.  If not a valid name and checked is false return null,
   * otherwise throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): CompilerInputMode;
}

/**
 * ReflectField
 */
export class ReflectField extends ReflectSlot implements CField {
  static type$: sys.Type
  parent(): CType;
  parent(it: CType): void;
  getter(): CMethod | null;
  getter(it: CMethod | null): void;
  type(): CType;
  type(it: CType): void;
  ns(): ReflectNamespace;
  ns(it: ReflectNamespace): void;
  f(): sys.Field;
  f(it: sys.Field): void;
  setter(): CMethod | null;
  setter(it: CMethod | null): void;
  inheritedReturns(): CType;
  slot(): sys.Slot;
  static make(ns: ReflectNamespace, parent: CType, f: sys.Field, ...args: unknown[]): ReflectField;
  /**
   * Is this field the parameterization of a generic field, with
   * the generic type replaced with a real type.
   */
  isParameterized(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  isSynthetic(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  qname(): string;
  toStr(): string;
  isInternal(): boolean;
  name(): string;
  /**
   * Fandoc API docs if available
   */
  doc(): CDoc | null;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  fieldType(): CType;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  signature(): string;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  flags(): number;
  isPrivate(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  isGetter(): boolean;
  /**
   * Is this field typed with a generic parameter.
   */
  isGeneric(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  isSetter(): boolean;
  /**
   * Does this field covariantly override a method?
   */
  isCovariant(): boolean;
  /**
   * Get the facet keyed by given type, or null if not defined.
   */
  facet(qname: string): CFacet | null;
  isCtor(): boolean;
}

/**
 * CDepend is a compiler dependency which wraps {@link sys.Depend | sys::Depend}
 */
export class CDepend extends sys.Obj {
  static type$: sys.Type
  /**
   * Depend specification
   */
  depend(): sys.Depend;
  /**
   * Resolved pod for the dependency or null if unresolved
   */
  pod(): CPod | null;
  pod(it: CPod | null): void;
  /**
   * Return depend.toStr
   */
  toStr(): string;
  static makeList(d: sys.List<sys.Depend>): sys.List<CDepend>;
  static fromStr(s: string): CDepend;
  /**
   * Pod name of the dependency
   */
  name(): string;
  static make(d: sys.Depend, p: CPod | null, ...args: unknown[]): CDepend;
}

/**
 * DefaultCtor adds a default public constructor called make()
 * if no constructor was explicitly specified.
 */
export class DefaultCtor extends CompilerStep {
  static type$: sys.Type
  visitTypeDef(t: TypeDef): void;
  run(): void;
  static make(compiler: Compiler, ...args: unknown[]): DefaultCtor;
  static addDefaultCtor(parent: TypeDef, flags: number): MethodDef;
}

/**
 * TypeRef models a type reference such as an extends clause or
 * a method parameter.  Really it is just an AST node wrapper
 * for a CType that let's us keep track of the source code Loc.
 */
export class TypeRef extends Node implements CType {
  static type$: sys.Type
  t(): CType;
  t(it: CType): void;
  isParameterized(): boolean;
  inferredAs(): CType;
  mixins(): sys.List<CType>;
  qname(): string;
  method(name: string): CMethod | null;
  fits(that: CType): boolean;
  slots(): sys.Map<string, CSlot>;
  isGenericParameter(): boolean;
  field(name: string): CField | null;
  isNullable(): boolean;
  name(): string;
  doc(): CDoc | null;
  toNonNullable(): CType;
  deref(): CType;
  pod(): CPod;
  ns(): CNamespace;
  signature(): string;
  isForeign(): boolean;
  flags(): number;
  slot(name: string): CSlot | null;
  toNullable(): CType;
  parameterizeThis(thisType: CType): CType;
  operators(): COperators;
  static make(loc: Loc, t: CType, ...args: unknown[]): TypeRef;
  isValid(): boolean;
  isGeneric(): boolean;
  isVal(): boolean;
  print(out: AstWriter): void;
  toListOf(): CType;
  facet(qname: string): CFacet | null;
  base(): CType | null;
  isNum(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  /**
   * Is this a compiler generated synthetic class
   */
  isSynthetic(): boolean;
  /**
   * Return if this type fits any of the types in the specified
   * list.
   */
  fitsAny(types: sys.List<CType>): boolean;
  /**
   * Is the entire class implemented in native code?
   */
  isNative(): boolean;
  /**
   * Is this type ok to use as a const field?  Any const type
   * fine, plus we allow Obj, List, Map, Buf, and Func since they
   * will implicitly have toImmutable called on them.
   */
  isConstFieldType(): boolean;
  isObj(): boolean;
  isBool(): boolean;
  isBuf(): boolean;
  isInt(): boolean;
  isDecimal(): boolean;
  /**
   * Return if this Type is an sys::Facet
   */
  isFacet(): boolean;
  isNothing(): boolean;
  /**
   * Return signature
   */
  toStr(): string;
  /**
   * If this TypeDef extends from a FFI class or implements any
   * FFI mixins, then return the FFI type otherwise return null.
   */
  foreignInheritance(): CType | null;
  /**
   * If this type is a generic parameter (V, L, etc), then return
   * the actual type for the native implementation.  For example
   * V is Obj, and L is List.  This is the type we actually use
   * when constructing a signature for the invoke opcode.
   */
  raw(): CType;
  /**
   * Return if type is supported by the Fantom type system.  For
   * example the Java FFI will correctly model a Java
   * multi-dimensional array during compilation, however there is
   * no Fantom representation.  We check for supported types
   * during CheckErrors when accessing fields and methods.
   */
  isSupported(): boolean;
  isFunc(): boolean;
  isType(): boolean;
  isMap(): boolean;
  /**
   * Is this an internally scoped class
   */
  isInternal(): boolean;
  /**
   * Return if this type contains a slot by the specified name.
   */
  hasSlot(name: string): boolean;
  /**
   * If this is a foreign function return the bridge.
   */
  bridge(): CBridge | null;
  /**
   * List of the all defined fields (including inherited fields).
   */
  fields(): sys.List<CField>;
  /**
   * Hash on signature.
   */
  hash(): number;
  isThis(): boolean;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  /**
   * List of the all instance constructors.
   */
  instanceCtors(): sys.List<CMethod>;
  /**
   * List of the all defined methods (including inherited
   * methods).
   */
  methods(): sys.List<CMethod>;
  isList(): boolean;
  /**
   * Return if this Type is const and immutable.
   */
  isConst(): boolean;
  /**
   * Is this a public scoped class
   */
  isPublic(): boolean;
  isStr(): boolean;
  /**
   * Return if this Type is final and cannot be subclassed.
   */
  isFinal(): boolean;
  /**
   * Return if this Type is a class (as opposed to enum or mixin)
   */
  isClass(): boolean;
  /**
   * Return if this Type is an sys::Enum
   */
  isEnum(): boolean;
  isFloat(): boolean;
  /**
   * Return if this Type is a mixin type and cannot be
   * instantiated.
   */
  isMixin(): boolean;
  /**
   * Return if this Type is abstract and cannot be instantiated. 
   * This method will always return true if the type is a mixin.
   */
  isAbstract(): boolean;
  isRange(): boolean;
  isVoid(): boolean;
  /**
   * List of the all constructors.
   */
  ctors(): sys.List<CMethod>;
  /**
   * Equality based on signature.
   */
  equals(t: sys.JsObj | null): boolean;
}

/**
 * COperators is used to manage methods annoated with the
 * Operator facet for efficient operator method resolution.
 */
export class COperators extends sys.Obj {
  static type$: sys.Type
  parent(): CType;
  parent(it: CType): void;
  /**
   * Get operators defined for prefix.  For example:
   * ```
   * find("plus") => [plus, plusFloat, plusDecimal]
   * ```
   */
  find(prefix: string): sys.List<CMethod>;
  /**
   * Given a method name get the operator prefix:
   * ```
   * "plus"     =>  "plus"
   * "plusInt"  =>  "plus"
   * "fooBar"   =>  null
   * ```
   */
  static toPrefix(methodName: string): string | null;
  /**
   * Construct for given parent type
   */
  static make(parent: CType, ...args: unknown[]): COperators;
}

/**
 * TernaryExpr is used for the ternary expression <cond> ?
 * <true> : <false>
 */
export class TernaryExpr extends Expr {
  static type$: sys.Type
  trueExpr(): Expr;
  trueExpr(it: Expr): void;
  falseExpr(): Expr;
  falseExpr(it: Expr): void;
  condition(): Expr;
  condition(it: Expr): void;
  static make(condition: Expr, trueExpr: Expr, falseExpr: Expr, ...args: unknown[]): TernaryExpr;
  toStr(): string;
  walkChildren(v: Visitor): void;
}

/**
 * ExprId uniquely identifies the type of expr
 */
export class ExprId extends sys.Enum {
  static type$: sys.Type
  static coerce(): ExprId;
  static decimalLiteral(): ExprId;
  static thisExpr(): ExprId;
  static staticTarget(): ExprId;
  static falseLiteral(): ExprId;
  static localeLiteral(): ExprId;
  static floatLiteral(): ExprId;
  static isExpr(): ExprId;
  static closure(): ExprId;
  static typeLiteral(): ExprId;
  static superExpr(): ExprId;
  static field(): ExprId;
  static cmpNull(): ExprId;
  static notSame(): ExprId;
  static complexLiteral(): ExprId;
  static asExpr(): ExprId;
  static dsl(): ExprId;
  /**
   * List of ExprId values indexed by ordinal
   */
  static vals(): sys.List<ExprId>;
  static listLiteral(): ExprId;
  static trueLiteral(): ExprId;
  static storage(): ExprId;
  static unknownVar(): ExprId;
  static boolNot(): ExprId;
  static same(): ExprId;
  static shortcut(): ExprId;
  static slotLiteral(): ExprId;
  static boolAnd(): ExprId;
  static construction(): ExprId;
  static elvis(): ExprId;
  static uriLiteral(): ExprId;
  static strLiteral(): ExprId;
  static throwExpr(): ExprId;
  static nullLiteral(): ExprId;
  static boolOr(): ExprId;
  static intLiteral(): ExprId;
  static isnotExpr(): ExprId;
  static call(): ExprId;
  static itExpr(): ExprId;
  static cmpNotNull(): ExprId;
  static localVar(): ExprId;
  static rangeLiteral(): ExprId;
  static durationLiteral(): ExprId;
  static mapLiteral(): ExprId;
  static ternary(): ExprId;
  static assign(): ExprId;
  /**
   * Return the ExprId instance for the specified name.  If not a
   * valid name and checked is false return null, otherwise throw
   * ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): ExprId;
}

/**
 * InitInput is responsible:
 * - verifies the CompilerInput instance
 * - checks the depends dir
 * - constructs the appropiate CNamespace
 * - initializes Comiler.pod with a PodDef
 * - tokenizes the source code from file or string input
 */
export class InitInput extends CompilerStep {
  static type$: sys.Type
  /**
   * Run the step
   */
  run(): void;
  /**
   * Constructor takes the associated Compiler
   */
  static make(compiler: Compiler, ...args: unknown[]): InitInput;
}

/**
 * ClosureExpr is an "inlined anonymous method" which closes
 * over it's lexical scope.  ClosureExpr is placed into the AST
 * by the parser with the code field containing the method
 * implementation.  In InitClosures we remap a ClosureExpr to
 * an anonymous class TypeDef which extends Func.  The function
 * implementation is moved to the anonymous class's doCall()
 * method.  However we leave ClosureExpr in the AST in it's
 * original location with a substitute expression. The
 * substitute expr just creates an instance of the anonymous
 * class. But by leaving the ClosureExpr in the tree, we can
 * keep track of the original lexical scope of the closure.
 */
export class ClosureExpr extends Expr {
  static type$: sys.Type
  enclosingVars(): sys.Map<string, MethodVar> | null;
  enclosingVars(it: sys.Map<string, MethodVar> | null): void;
  enclosingClosure(): ClosureExpr | null;
  enclosingClosure(it: ClosureExpr | null): void;
  setsConst(): boolean;
  setsConst(it: boolean): void;
  cls(): TypeDef | null;
  cls(it: TypeDef | null): void;
  itType(): CType | null;
  itType(it: CType | null): void;
  enclosingSlot(): SlotDef;
  enclosingSlot(it: SlotDef): void;
  name(): string;
  name(it: string): void;
  isItBlock(): boolean;
  isItBlock(it: boolean): void;
  code(): Block | null;
  code(it: Block | null): void;
  signature(): FuncType;
  signature(it: FuncType): void;
  substitute(): CallExpr | null;
  substitute(it: CallExpr | null): void;
  doCall(): MethodDef | null;
  doCall(it: MethodDef | null): void;
  call(): MethodDef | null;
  call(it: MethodDef | null): void;
  enclosingType(): TypeDef;
  enclosingType(it: TypeDef): void;
  toStr(): string;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  toWith(target: Expr): Expr;
  static make(loc: Loc, enclosingType: TypeDef, enclosingSlot: SlotDef, enclosingClosure: ClosureExpr | null, signature: FuncType, name: string, ...args: unknown[]): ClosureExpr;
  collapseExprAndReturn(m: MethodDef): void;
  outerThisField(): CField;
  setInferredSignature(t: FuncType): void;
  print(out: AstWriter): void;
}

/**
 * FPodNamespace implements Namespace by reading the fcode from
 * pods directly.  Its not as efficient as using reflection,
 * but lets us compile against a different pod set.
 */
export class FPodNamespace extends CNamespace {
  static type$: sys.Type
  /**
   * where to look for pod or null to delegate to Env.findPodFile
   */
  dir(): sys.File | null;
  /**
   * Make a FPod namespace which looks in the specified directory
   * to resolve pod files or null to delegate to `Env.findPodFile`.
   */
  static make(dir: sys.File | null, ...args: unknown[]): FPodNamespace;
}

/**
 * ClosureVars is used to process closure variables which have
 * been enclosed from their parent scope:
 * 
 * ResolveExpr ----------- ResolveExpr we detected variables
 * used from parent scope and created shadow variables in the
 * closure's scope with a reference via `MethodVar.shadows`. 
 * Also during this step we note any variables which are
 * reassigned making them non-final (according to Java final
 * variable semantics).
 * 
 * Process Method -------------- First we walk all types
 * looking for methods which use closure variables:
 * 1. For each one walk thru its variables to see if any variables
 *   enclosed are non-final (reassigned at some point).  These
 *   variables as hoisted onto the heap with wrappers:
 * ```
 * class Wrapper$T { new make(T v) { val=v }  T val }
 * ```
 * 2. If no wrapped variables, then we can leave a cvars method
 *   alone - everything stays the same.  If however we do have
 *   wrapped variables, then we need to walk the expr tree of the
 *   method replacing all access of the variable with its wrapper
 *   access:
 * ```
 * x := 3     =>   x := Wrapper$Int(3)
 * x = x + 1  =>   x.val = x.val + 1
 * ```
 * 3. If any params were wrapped, we generated a new local
 *   variable in `wrapNonFinalVars`.  During the expr tree walk we
 *   replaced all references to the param to its new wrapped
 *   local.   To finish processing the method we insert a bit of
 *   code in the beginning of the method to initialize the local.
 * 
 * Process Closure --------------- After we have walked all
 * methods using closure variables (which might include closure
 * doCall methods themselves), then we walk all the closures.
 * 1. For each shadowed variables we need:
 *   a. Define field on the closure to store variable
 *   b. Pass variable to closure constructor at substitution site
 *   c. Add variable to as closure constructor param
 *   d. Assign param to field in constructor If the variable has
 *     been wrapped we are doing this for the wrapped variable (we
 *     don't unwrap it).
 * 2. If any of the closures shadowed variables are wrapped, then
 *   we do a expr tree walk of doCall - the exact same thing as
 *   step 2 of the processMethod stage.
 */
export class ClosureVars extends CompilerStep {
  static type$: sys.Type
  run(): void;
  /**
   * This method is called by ClosureExpr to auto-generate the
   * implicit outer "this" field in the Closure's implementation
   * class:
   * 1. Add $this field to closure's anonymous class
   * 2. Add $this param to closure's make constructor
   * 3. Pass this to closure constructor at substitute site
   * 4. Set field from param in constructor
   */
  static makeOuterThisField(closure: ClosureExpr): CField;
  visitStmt(stmt: Stmt): sys.List<Stmt> | null;
  /**
   * Given a variable type, generate a wrapper class of the
   * format:
   * ```
   * class Wrap$ctype[$n] { CType val }
   * ```
   * 
   * Wrappers are used to manage variables on the heap so that
   * they can be shared between methods and closures.  We
   * generate one wrapper class per variable type per pod with
   * potentially a non-nullable and nullable variant ($n suffix).
   * 
   * Eventually we'd probably like to share wrappers for common
   * types like Int, Str, Obj, etc.
   * 
   * Return the val field of the wrapper.
   */
  static genWrapper(cs: CompilerSupport, ctype: CType): CField;
  static make(compiler: Compiler, ...args: unknown[]): ClosureVars;
  visitExpr(expr: Expr): Expr;
}

/**
 * NameExpr is the base class for an identifier expression
 * which has an optional base expression.  NameExpr is the base
 * class for UnknownVarExpr and CallExpr which are resolved via
 * CallResolver
 */
export class NameExpr extends Expr {
  static type$: sys.Type
  target(): Expr | null;
  target(it: Expr | null): void;
  name(): string | null;
  name(it: string | null): void;
  isSafe(): boolean;
  isSafe(it: boolean): void;
  static make(loc: Loc, id: ExprId, target: Expr | null, name: string | null, ...args: unknown[]): NameExpr;
  toStr(): string;
  isAlwaysNullable(): boolean;
  walkChildren(v: Visitor): void;
}

/**
 * TypeCheckExpr is an expression which is composed of an
 * arbitrary expression and a type - is, as, coerce
 */
export class TypeCheckExpr extends Expr {
  static type$: sys.Type
  /**
   * From type if coerce
   */
  from(): CType | null;
  from(it: CType | null): void;
  check(): CType;
  check(it: CType): void;
  target(): Expr;
  target(it: Expr): void;
  synthetic(): boolean;
  synthetic(it: boolean): void;
  static coerce(target: Expr, to: CType, ...args: unknown[]): TypeCheckExpr;
  opStr(): string;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  static make(loc: Loc, id: ExprId, target: Expr, check: CType, ...args: unknown[]): TypeCheckExpr;
  toStr(): string;
  isAlwaysNullable(): boolean;
  serialize(): string;
  isStmt(): boolean;
  walkChildren(v: Visitor): void;
}

/**
 * Tokenize is responsible for parsing all the source files
 * into a a list of tokens.  Each source file is mapped to a
 * CompilationUnit and stored in the PodDef.units field:
 * ```
 * Compiler.srcFiles -> Compiler.pod.units
 * ```
 * 
 * During the standard pipeline this step is called by the
 * InitInput step.
 */
export class Tokenize extends CompilerStep {
  static type$: sys.Type
  input(): CompilerInput;
  input(it: CompilerInput): void;
  run(): void;
  tokenize(loc: Loc, src: string): CompilationUnit;
  static make(compiler: Compiler, ...args: unknown[]): Tokenize;
}

/**
 * ListLiteralExpr creates a List instance
 */
export class ListLiteralExpr extends Expr {
  static type$: sys.Type
  vals(): sys.List<Expr>;
  vals(it: sys.List<Expr>): void;
  explicitType(): ListType | null;
  explicitType(it: ListType | null): void;
  static makeFor(loc: Loc, ctype: CType, vals: sys.List<Expr>, ...args: unknown[]): ListLiteralExpr;
  static make(loc: Loc, explicitType?: ListType | null, ...args: unknown[]): ListLiteralExpr;
  toStr(): string;
  format(f: ((arg0: Expr) => string)): string;
  serialize(): string;
  walkChildren(v: Visitor): void;
}

/**
 * FMethodRef
 */
export class FMethodRef extends sys.Obj {
  static type$: sys.Type
  ret(): number;
  parent(): number;
  hashcode(): number;
  params(): sys.List<number>;
  name(): number;
  static read(in$: sys.InStream): FMethodRef;
  format(pod: FPod): string;
  equals(obj: sys.JsObj | null): boolean;
  static make(parent: number, name: number, ret: number, params: sys.List<number>, ...args: unknown[]): FMethodRef;
  write(out: sys.OutStream): void;
  hash(): number;
}

/**
 * ForStmt models a for loop of the format:
 * ```
 * for (init; condition; update) block
 * ```
 */
export class ForStmt extends Stmt {
  static type$: sys.Type
  update(): Expr | null;
  update(it: Expr | null): void;
  block(): Block | null;
  block(it: Block | null): void;
  init(): Stmt | null;
  init(it: Stmt | null): void;
  condition(): Expr | null;
  condition(it: Expr | null): void;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  isExit(): boolean;
  static make(loc: Loc, ...args: unknown[]): ForStmt;
  print(out: AstWriter): void;
  walkChildren(v: Visitor, depth: VisitDepth): void;
}

/**
 * Loop
 */
export class Loop extends sys.Obj {
  static type$: sys.Type
  breaks(): sys.List<number>;
  breaks(it: sys.List<number>): void;
  continues(): sys.List<number>;
  continues(it: sys.List<number>): void;
  protectedRegions(): sys.List<ProtectedRegion>;
  protectedRegions(it: sys.List<ProtectedRegion>): void;
  stmt(): Stmt;
  stmt(it: Stmt): void;
  static make(stmt: Stmt, ...args: unknown[]): Loop;
}

/**
 * MethodVar is a variable used in a method - either param or
 * local.
 */
export class MethodVar extends sys.Obj {
  static type$: sys.Type
  flags(): number;
  flags(it: number): void;
  scope(): Block | null;
  scope(it: Block | null): void;
  isReassigned(): boolean;
  isReassigned(it: boolean): void;
  method(): MethodDef;
  method(it: MethodDef): void;
  usedInClosure(): boolean;
  usedInClosure(it: boolean): void;
  isCatchVar(): boolean;
  isCatchVar(it: boolean): void;
  paramDef(): ParamDef | null;
  paramDef(it: ParamDef | null): void;
  wrapField(): CField | null;
  wrapField(it: CField | null): void;
  paramWrapper(): MethodVar | null;
  paramWrapper(it: MethodVar | null): void;
  ctype(): CType;
  ctype(it: CType): void;
  name(): string;
  name(it: string): void;
  shadows(): MethodVar | null;
  shadows(it: MethodVar | null): void;
  register(): number;
  register(it: number): void;
  isParam(): boolean;
  static makeForParam(method: MethodDef, register: number, p: ParamDef, paramType: CType, ...args: unknown[]): MethodVar;
  static make(method: MethodDef, register: number, ctype: CType, name: string, flags?: number, scope?: Block | null, ...args: unknown[]): MethodVar;
  toStr(): string;
  reassigned(): void;
  isWrapped(): boolean;
}

/**
 * Simple implementation for a marker facet
 */
export class MarkerFacet extends sys.Obj implements CFacet {
  static type$: sys.Type
  qname(): string;
  get(name: string): sys.JsObj | null;
  static make(qname: string, ...args: unknown[]): MarkerFacet;
}

/**
 * ItExpr models the "it" keyword to access the implicit target
 * of an it-block.
 */
export class ItExpr extends LocalVarExpr {
  static type$: sys.Type
  isAssignable(): boolean;
  static make(loc: Loc, ctype?: CType | null, ...args: unknown[]): ItExpr;
  toStr(): string;
  name(): string;
  register(): number;
}

/**
 * CBridge is the base class for compiler FFI plugins to expose
 * external type systems to the Fantom compiler as CPods,
 * CTypes, and CSlots.  Subclasses are registered for a FFI
 * name with the "compilerBridge" facet and must declare a
 * constructor with a Compiler arg.
 */
export class CBridge extends CompilerSupport {
  static type$: sys.Type
  /**
   * Coerce the target expression to the specified type.  If the
   * expression is not type compatible run the onErr function.
   * Default implementation provides standard Fantom coercion.
   * 
   * If the bridge is going to coerce `expr` into a new expression,
   * then it should mark the resulting expression as synthetic. A
   * synthetic expression must be "undoable":
   * - TypeCheckExpr where target is uncoerced expr
   * - CallExpr where last argument is uncoerced expr See
   *   ResolveExpr.resolveAssign for more details.
   */
  coerce(expr: Expr, expected: CType, onErr: (() => void)): Expr;
  /**
   * Resolve a construction chain call where a Fantom constructor
   * calls the super-class constructor.  Type check the arguments
   * and insert any conversions needed.
   */
  resolveConstructorChain(call: CallExpr): Expr;
  /**
   * Given a dot operator slot access on the given foreign base
   * type, determine the appopriate slot to use based on whether
   * parens were used
   * ```
   * base.name    =>  noParens = true
   * base.name()  =>  noParens = false
   * ```
   */
  resolveSlotAccess(base: CType, name: string, noParens: boolean): CSlot | null;
  /**
   * Resolve the specified foreign namespace to a CPod. Throw a
   * CompilerErr with appropriate message if name cannot be
   * resolved.
   */
  resolvePod(name: string, loc: Loc | null): CPod;
  /**
   * Resolve a construction call.  Type check the arguments and
   * insert any conversions needed.
   */
  resolveConstruction(call: CallExpr): Expr;
  /**
   * Constructor with associated compiler.
   */
  static make(c: Compiler, ...args: unknown[]): CBridge;
  /**
   * Called during CheckErrors step for a type which extends a
   * FFI class or implements any FFI mixins.
   */
  checkType(def: TypeDef): void;
  /**
   * Guaranteed cleanup hook
   */
  cleanup(): void;
  /**
   * Resolve a method call.  Type check the arguments and insert
   * any conversions needed.
   */
  resolveCall(call: CallExpr): Expr;
  /**
   * Called during Inherit step when a Fantom slot overrides a
   * FFI slot. Log and throw compiler error if there is a
   * problem.
   */
  checkOverride(t: TypeDef, base: CSlot, def: SlotDef): void;
}

/**
 * NopStmt is no operation do nothing statement.
 */
export class NopStmt extends Stmt {
  static type$: sys.Type
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  isExit(): boolean;
  print(out: AstWriter): void;
  static make(loc: Loc, ...args: unknown[]): NopStmt;
}

/**
 * ReflectFacet
 */
export class ReflectFacet extends sys.Obj implements CFacet {
  static type$: sys.Type
  f(): sys.Facet;
  f(it: sys.Facet): void;
  toStr(): string;
  qname(): string;
  get(name: string): sys.JsObj | null;
  static map(ns: ReflectNamespace, f: sys.Facet | null): ReflectFacet | null;
}

/**
 * ReflectPod is the CPod wrapper for a dependent Pod loaded
 * via reflection.
 */
export class ReflectPod extends sys.Obj implements CPod {
  static type$: sys.Type
  pod(): sys.Pod;
  pod(it: sys.Pod): void;
  ns(): ReflectNamespace;
  ns(it: ReflectNamespace): void;
  file(): sys.File;
  static make(ns: ReflectNamespace, pod: sys.Pod, ...args: unknown[]): ReflectPod;
  types(): sys.List<CType>;
  resolveType(typeName: string, checked: boolean): ReflectType | null;
  depends(): sys.List<CDepend>;
  version(): sys.Version;
  meta(): sys.Map<string, string>;
  name(): string;
  /**
   * Return name
   */
  toStr(): string;
  /**
   * Return if this pod has client side JavaScript
   */
  hasJs(): boolean;
  /**
   * If this a foreign function interface pod.
   */
  isForeign(): boolean;
  /**
   * Equality based on pod name.
   */
  equals(t: sys.JsObj | null): boolean;
  /**
   * If this a foreign function interface return the bridge.
   */
  bridge(): CBridge | null;
  /**
   * Hash on name.
   */
  hash(): number;
}

/**
 * VisitStep represents one discrete task run during the
 * compiler pipeline.  The implementations are found under
 * steps.
 */
export class CompilerStep extends CompilerSupport implements Visitor {
  static type$: sys.Type
  curType(): TypeDef | null;
  curType(it: TypeDef | null): void;
  curMethod(): MethodDef | null;
  curMethod(it: MethodDef | null): void;
  curUnit(): CompilationUnit | null;
  curUnit(it: CompilationUnit | null): void;
  inStatic(): boolean;
  /**
   * Run the step
   */
  run(): void;
  enterUnit(unit: CompilationUnit): void;
  enterTypeDef(def: TypeDef): void;
  exitUnit(unit: CompilationUnit): void;
  exitTypeDef(def: TypeDef): void;
  enterMethodDef(def: MethodDef): void;
  /**
   * Constructor takes the associated Compiler
   */
  static make(compiler: Compiler, ...args: unknown[]): CompilerStep;
  exitMethodDef(def: MethodDef): void;
  /**
   * Callback when visiting a method.
   */
  visitMethodDef(def: MethodDef): void;
  /**
   * Callback when visiting a type definition.
   */
  visitTypeDef(def: TypeDef): void;
  /**
   * Callback when entering a block.
   */
  enterBlock(block: Block): void;
  /**
   * Callback when visiting a block.
   */
  visitBlock(block: Block): void;
  /**
   * Callback when visiting a field definition.
   */
  visitFieldDef(def: FieldDef): void;
  /**
   * Callback when exiting a block.
   */
  exitBlock(block: Block): void;
  /**
   * Callback when exiting a field definition.
   */
  exitFieldDef(def: FieldDef): void;
  /**
   * Callback when entering a finally block
   */
  enterFinally(stmt: TryStmt): void;
  /**
   * Callback when entering a stmt.
   */
  enterStmt(stmt: Stmt): void;
  /**
   * Callback when exiting a finally block
   */
  exitFinally(stmt: TryStmt): void;
  /**
   * Call to visit an expression.  Return expr or a new
   * expression if doing a replacement for the expression in the
   * abstract syntax tree.
   */
  visitExpr(expr: Expr): Expr;
  /**
   * Callback when entering a field definition.
   */
  enterFieldDef(def: FieldDef): void;
  /**
   * Callback when visiting a stmt.  Return a list to replace the
   * statement with new statements, or return null to keep
   * existing statement.
   */
  visitStmt(stmt: Stmt): sys.List<Stmt> | null;
  /**
   * Peform a walk of the abstract syntax tree down to the
   * specified depth.
   */
  walk(c: Compiler, depth: VisitDepth): void;
  /**
   * Callback when exiting a stmt.
   */
  exitStmt(stmt: Stmt): void;
}

/**
 * DslPlugin is the base class for Domain Specific Language
 * plugins used to compile embedded DSLs.  Subclasses are
 * registered on the anchor type's qname with the
 * "compiler.dsl.{anchor}" indexed prop and must declare a
 * constructor with a Compiler arg.
 */
export class DslPlugin extends CompilerSupport {
  static type$: sys.Type
  /**
   * Normalize the DSL source using Fantom's multi-line
   * whitespace rules where no non-whitespace chars may be appear
   * to the left of the opening "<|" token.  If source is
   * formatted incorrectly then log and throw error.
   */
  normalizeSrc(dsl: DslExpr): string;
  /**
   * Compile DSL source into its Fantom equivalent expression.
   * Log and throw compiler error if there is a problem.
   */
  compile(dsl: DslExpr): Expr;
  /**
   * Find a DSL plugin for the given anchor type.  If there is a
   * problem then log an error and return null.
   */
  static find(c: CompilerSupport, loc: Loc, anchorType: CType): DslPlugin | null;
  /**
   * Constructor with associated compiler.
   */
  static make(c: Compiler, ...args: unknown[]): DslPlugin;
}

/**
 * BreakStmt breaks out of a while/for loop.
 */
export class BreakStmt extends Stmt {
  static type$: sys.Type
  loop(): Stmt | null;
  loop(it: Stmt | null): void;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  isExit(): boolean;
  print(out: AstWriter): void;
  static make(loc: Loc, ...args: unknown[]): BreakStmt;
}

/**
 * StmtId
 */
export class StmtId extends sys.Enum {
  static type$: sys.Type
  /**
   * List of StmtId values indexed by ordinal
   */
  static vals(): sys.List<StmtId>;
  static tryStmt(): StmtId;
  static nop(): StmtId;
  static switchStmt(): StmtId;
  static localDef(): StmtId;
  static expr(): StmtId;
  static continueStmt(): StmtId;
  static forStmt(): StmtId;
  static whileStmt(): StmtId;
  static returnStmt(): StmtId;
  static throwStmt(): StmtId;
  static ifStmt(): StmtId;
  static breakStmt(): StmtId;
  /**
   * Return the StmtId instance for the specified name.  If not a
   * valid name and checked is false return null, otherwise throw
   * ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): StmtId;
}

/**
 * CPod is a "compiler pod" used for representing a Pod in the
 * compiler.
 */
export abstract class CPod extends sys.Obj {
  static type$: sys.Type
  /**
   * Return name
   */
  toStr(): string;
  /**
   * List of the all defined types.
   */
  types(): sys.List<CType>;
  /**
   * Lookup a type by its simple name.  If the type doesn't exist
   * and checked is true then throw UnknownTypeErr otherwise
   * return null.
   */
  resolveType(name: string, checked: boolean): CType | null;
  /**
   * Return if this pod has client side JavaScript
   */
  hasJs(): boolean;
  /**
   * Associated namespace for this pod representation
   */
  ns(): CNamespace;
  /**
   * Get the pod dependencies
   */
  depends(): sys.List<CDepend>;
  /**
   * If this a foreign function interface pod.
   */
  isForeign(): boolean;
  /**
   * Get the pod version or null if unknown.
   */
  version(): sys.Version;
  /**
   * Pod zip file.  Not all implementations have a backing file
   * in which case they will throw UnsupportedErr
   */
  file(): sys.File;
  /**
   * Pod meta data
   */
  meta(): sys.Map<string, string>;
  /**
   * Equality based on pod name.
   */
  equals(t: sys.JsObj | null): boolean;
  /**
   * Get the pod name
   */
  name(): string;
  /**
   * If this a foreign function interface return the bridge.
   */
  bridge(): CBridge | null;
  /**
   * Hash on name.
   */
  hash(): number;
}

/**
 * Loc provides a source file, line number, and column number.
 */
export class Loc extends sys.Obj {
  static type$: sys.Type
  col(): number | null;
  col(it: number | null): void;
  line(): number | null;
  line(it: number | null): void;
  file(): string;
  file(it: string): void;
  toStr(): string;
  compare(that: sys.JsObj): number;
  static makeUninit(...args: unknown[]): Loc;
  static makeFile(file: sys.File | null, line?: number | null, col?: number | null, ...args: unknown[]): Loc;
  filename(): string | null;
  equals(that: sys.JsObj | null): boolean;
  fileUri(): string | null;
  toLocStr(): string;
  static make(file: string, line?: number | null, col?: number | null, ...args: unknown[]): Loc;
  hash(): number;
}

/**
 * LocalDefStmt models a local variable declaration and its
 * optional initialization expression.
 */
export class LocalDefStmt extends Stmt {
  static type$: sys.Type
  init(): Expr | null;
  init(it: Expr | null): void;
  var(): MethodVar | null;
  var(it: MethodVar | null): void;
  isCatchVar(): boolean;
  isCatchVar(it: boolean): void;
  ctype(): CType | null;
  ctype(it: CType | null): void;
  name(): string;
  name(it: string): void;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  static makeCatchVar(c: Catch, ...args: unknown[]): LocalDefStmt;
  isExit(): boolean;
  initVal(): Expr | null;
  static make(loc: Loc, ctype?: CType | null, name?: string, ...args: unknown[]): LocalDefStmt;
  toStr(): string;
  static makeAssign(init: BinaryExpr, ...args: unknown[]): LocalDefStmt;
  print(out: AstWriter): void;
  printOpt(out: AstWriter, nl?: boolean): void;
  walkChildren(v: Visitor, depth: VisitDepth): void;
}

/**
 * SwitchStmt models a switch and its case and default block
 */
export class SwitchStmt extends Stmt {
  static type$: sys.Type
  isTableswitch(): boolean;
  isTableswitch(it: boolean): void;
  cases(): sys.List<Case>;
  cases(it: sys.List<Case>): void;
  defaultBlock(): Block | null;
  defaultBlock(it: Block | null): void;
  condition(): Expr;
  condition(it: Expr): void;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  isExit(): boolean;
  static make(loc: Loc, condition: Expr, ...args: unknown[]): SwitchStmt;
  print(out: AstWriter): void;
  walkChildren(v: Visitor, depth: VisitDepth): void;
}

/**
 * FField is the read/write fcode representation of sys::Field.
 */
export class FField extends FSlot implements CField {
  static type$: sys.Type
  getter(): CMethod | null;
  getter(it: CMethod | null): void;
  typeRef(): number;
  typeRef(it: number): void;
  setter(): CMethod | null;
  setter(it: CMethod | null): void;
  type(): CType;
  write(out: sys.OutStream): void;
  read(in$: sys.InStream): this;
  inheritedReturns(): CType;
  signature(): string;
  static make(fparent: FType, ...args: unknown[]): FField;
  parent(): CType;
  /**
   * Is this field the parameterization of a generic field, with
   * the generic type replaced with a real type.
   */
  isParameterized(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  isSynthetic(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  qname(): string;
  toStr(): string;
  isInternal(): boolean;
  name(): string;
  /**
   * Fandoc API docs if available
   */
  doc(): CDoc | null;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  fieldType(): CType;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  ns(): CNamespace;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  flags(): number;
  isPrivate(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  isGetter(): boolean;
  /**
   * Is this field typed with a generic parameter.
   */
  isGeneric(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  isSetter(): boolean;
  /**
   * Does this field covariantly override a method?
   */
  isCovariant(): boolean;
  /**
   * Get the facet keyed by given type, or null if not defined.
   */
  facet(qname: string): CFacet | null;
  isCtor(): boolean;
}

/**
 * StrDslPlugin is used to create a raw Str literal.
 */
export class StrDslPlugin extends DslPlugin {
  static type$: sys.Type
  /**
   * Find a DSL plugin for the given anchor type.  If there is a
   * problem then log an error and return null.
   */
  compile(dsl: DslExpr): Expr;
  /**
   * Constructor with associated compiler.
   */
  static make(c: Compiler, ...args: unknown[]): StrDslPlugin;
}

/**
 * CNode represents a compile node as base type for CType and
 * CSlot
 */
export abstract class CNode extends sys.Obj {
  static type$: sys.Type
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  /**
   * Associated namespace for this type representation
   */
  ns(): CNamespace;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  /**
   * Fandoc API docs if available
   */
  doc(): CDoc | null;
  /**
   * Get the facet keyed by given type, or null if not defined.
   */
  facet(qname: string): CFacet | null;
}

/**
 * CSlot is a "compiler slot" which is represents a Slot in the
 * compiler.  CSlots unifies slots being compiled as SlotDefs
 * with slots imported as ReflectSlot or FSlot.
 */
export abstract class CSlot extends sys.Obj implements CNode {
  static type$: sys.Type
  parent(): CType;
  isStatic(): boolean;
  ns(): CNamespace;
  signature(): string;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  flags(): number;
  isSynthetic(): boolean;
  isPrivate(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  qname(): string;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  toStr(): string;
  isGetter(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  isInternal(): boolean;
  name(): string;
  isSetter(): boolean;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  isCtor(): boolean;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  /**
   * Fandoc API docs if available
   */
  doc(): CDoc | null;
  /**
   * Get the facet keyed by given type, or null if not defined.
   */
  facet(qname: string): CFacet | null;
}

/**
 * FieldExpr is used for a field variable access.
 */
export class FieldExpr extends NameExpr {
  static type$: sys.Type
  useAccessor(): boolean;
  useAccessor(it: boolean): void;
  field(): CField | null;
  field(it: CField | null): void;
  isAssignable(): boolean;
  static make(loc: Loc, target?: Expr | null, field?: CField | null, useAccessor?: boolean, ...args: unknown[]): FieldExpr;
  toStr(): string;
  assignRequiresTempVar(): boolean;
  sameVarAs(that: Expr): boolean;
  serialize(): string;
  asTableSwitchCase(): number | null;
}

/**
 * ThrowStmt throws an exception
 */
export class ThrowStmt extends Stmt {
  static type$: sys.Type
  exception(): Expr;
  exception(it: Expr): void;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  isExit(): boolean;
  print(out: AstWriter): void;
  static make(loc: Loc, exception: Expr, ...args: unknown[]): ThrowStmt;
  walkChildren(v: Visitor, depth: VisitDepth): void;
}

/**
 * MockSlot are special slots used between the compiler and
 * runtime but not publically exposed by reflection.
 */
export class MockSlot extends sys.Obj implements CSlot {
  static type$: sys.Type
  parent(): CType;
  parent(it: CType): void;
  flags(): number;
  flags(it: number): void;
  name(): string;
  name(it: string): void;
  signature(): string;
  qname(): string;
  static make(parent: CType, name: string, flags: number, ...args: unknown[]): MockSlot;
  doc(): CDoc | null;
  facet(qname: string): CFacet | null;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  ns(): CNamespace;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  isSynthetic(): boolean;
  isPrivate(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  toStr(): string;
  isGetter(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  isInternal(): boolean;
  isSetter(): boolean;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  isCtor(): boolean;
}

/**
 * EnumDef is used to define one ordinal/named enum value in an
 * enum TypeDef.  If using a custom constructor, it includes
 * the constructor arguments.
 */
export class EnumDef extends Node {
  static type$: sys.Type
  ctorArgs(): sys.List<Expr>;
  ctorArgs(it: sys.List<Expr>): void;
  facets(): sys.List<FacetDef> | null;
  facets(it: sys.List<FacetDef> | null): void;
  name(): string;
  name(it: string): void;
  doc(): DocDef | null;
  doc(it: DocDef | null): void;
  ordinal(): number;
  ordinal(it: number): void;
  toStr(): string;
  print(out: AstWriter): void;
  static make(loc: Loc, doc: DocDef | null, facets: sys.List<FacetDef> | null, name: string, ordinal: number, ...args: unknown[]): EnumDef;
}

/**
 * Vistor is used to walk the abstract syntax tree and visit
 * key nodes. The walk for each node type entails:
 * 1. enter
 * 2. children
 * 3. exit
 * 4. visit
 */
export abstract class Visitor extends sys.Obj {
  static type$: sys.Type
  /**
   * Callback when visiting a method.
   */
  visitMethodDef(def: MethodDef): void;
  /**
   * Callback when visiting a type definition.
   */
  visitTypeDef(def: TypeDef): void;
  /**
   * Callback when entering a block.
   */
  enterBlock(block: Block): void;
  /**
   * Callback when visiting a block.
   */
  visitBlock(block: Block): void;
  /**
   * Callback when visiting a field definition.
   */
  visitFieldDef(def: FieldDef): void;
  /**
   * Callback when exiting a type definition.
   */
  exitTypeDef(def: TypeDef): void;
  /**
   * Callback when exiting a block.
   */
  exitBlock(block: Block): void;
  /**
   * Callback when exiting a field definition.
   */
  exitFieldDef(def: FieldDef): void;
  /**
   * Callback when entering a finally block
   */
  enterFinally(stmt: TryStmt): void;
  /**
   * Callback when entering a method.
   */
  enterMethodDef(def: MethodDef): void;
  /**
   * Callback when entering a stmt.
   */
  enterStmt(stmt: Stmt): void;
  /**
   * Callback when exiting a finally block
   */
  exitFinally(stmt: TryStmt): void;
  /**
   * Callback when entering a compilation unit.
   */
  enterUnit(unit: CompilationUnit): void;
  /**
   * Call to visit an expression.  Return expr or a new
   * expression if doing a replacement for the expression in the
   * abstract syntax tree.
   */
  visitExpr(expr: Expr): Expr;
  /**
   * Callback when exiting a method.
   */
  exitMethodDef(def: MethodDef): void;
  /**
   * Callback when entering a type definition.
   */
  enterTypeDef(def: TypeDef): void;
  /**
   * Callback when entering a field definition.
   */
  enterFieldDef(def: FieldDef): void;
  /**
   * Callback when existing a compilation unit.
   */
  exitUnit(unit: CompilationUnit): void;
  /**
   * Callback when visiting a stmt.  Return a list to replace the
   * statement with new statements, or return null to keep
   * existing statement.
   */
  visitStmt(stmt: Stmt): sys.List<Stmt> | null;
  /**
   * Peform a walk of the abstract syntax tree down to the
   * specified depth.
   */
  walk(c: Compiler, depth: VisitDepth): void;
  /**
   * Callback when exiting a stmt.
   */
  exitStmt(stmt: Stmt): void;
}

/**
 * CheckErrors walks the tree of statements and expressions
 * looking for errors the compiler can detect such as invalid
 * type usage.  We attempt to leave all the error reporting to
 * this step, so that we can batch report as many errors as
 * possible.
 * 
 * Since CheckErrors already performs a full tree walk down to
 * each leaf expression, we also do a couple of other AST
 * decorations in this step:
 * ```
 * 1) add temp local for field assignments like return ++x
 * 2) add temp local for returns inside protected region
 * 3) check for field accessor optimization
 * 4) check for field storage requirements
 * 5) add implicit coersions: auto-casts, boxing, to non-nullable
 * 6) implicit call to toImmutable when assigning to const field
 * 7) mark ClosureExpr.setsConst
 * ```
 */
export class CheckErrors extends CompilerStep {
  static type$: sys.Type
  visitMethodDef(m: MethodDef): void;
  enterStmt(stmt: Stmt): void;
  checkFacet(f: FacetDef): void;
  checkFacets(facets: sys.List<FacetDef> | null): void;
  static isSlotVisible(curType: TypeDef, slot: CSlot): boolean;
  exitStmt(stmt: Stmt): void;
  visitTypeDef(t: TypeDef): void;
  run(): void;
  visitFieldDef(f: FieldDef): void;
  exitFinally(stmt: TryStmt): void;
  visitStmt(stmt: Stmt): sys.List<Stmt> | null;
  checkPodDef(pod: PodDef): void;
  enterFinally(stmt: TryStmt): void;
  static make(compiler: Compiler, ...args: unknown[]): CheckErrors;
  visitExpr(expr: Expr): Expr;
  static isRestrictedName(name: string): boolean;
}

/**
 * Case models a single case block of a SwitchStmt
 */
export class Case extends Node {
  static type$: sys.Type
  cases(): sys.List<Expr>;
  cases(it: sys.List<Expr>): void;
  startOffset(): number;
  startOffset(it: number): void;
  block(): Block | null;
  block(it: Block | null): void;
  print(out: AstWriter): void;
  static make(loc: Loc, ...args: unknown[]): Case;
  walk(v: Visitor, depth: VisitDepth): void;
}

/**
 * ParameterizedField
 */
export class ParameterizedField extends sys.Obj implements CField {
  static type$: sys.Type
  parent(): CType;
  parent(it: CType): void;
  getter(): CMethod | null;
  getter(it: CMethod | null): void;
  type(): CType;
  type(it: CType): void;
  generic(): CField;
  generic(it: CField): void;
  setter(): CMethod | null;
  setter(it: CMethod | null): void;
  isParameterized(): boolean;
  qname(): string;
  inheritedReturns(): CType;
  name(): string;
  doc(): CDoc | null;
  signature(): string;
  flags(): number;
  static make(parent: GenericType, generic: CField, ...args: unknown[]): ParameterizedField;
  facet(qname: string): CFacet | null;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  isSynthetic(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  toStr(): string;
  isInternal(): boolean;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  fieldType(): CType;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  ns(): CNamespace;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  isPrivate(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  isGetter(): boolean;
  /**
   * Is this field typed with a generic parameter.
   */
  isGeneric(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  isSetter(): boolean;
  /**
   * Does this field covariantly override a method?
   */
  isCovariant(): boolean;
  isCtor(): boolean;
}

/**
 * Normalize the abstract syntax tree:
 * - Collapse multiple static new blocks
 * - Init static fields in static new block
 * - Init instance fields in instance new block
 * - Add implicit return in methods
 * - Add implicit super constructor call
 * - Rewrite synthetic getter/setter for override of concrete
 *   field
 * - Infer collection fields from LHS of field definition
 * - Generate once method boiler plate
 */
export class Normalize extends CompilerStep {
  static type$: sys.Type
  visitTypeDef(t: TypeDef): void;
  run(): void;
  static make(compiler: Compiler, ...args: unknown[]): Normalize;
}

/**
 * Cond
 */
export class Cond extends sys.Obj {
  static type$: sys.Type
  jumpTrues(): sys.List<number>;
  jumpTrues(it: sys.List<number>): void;
  jumpFalses(): sys.List<number>;
  jumpFalses(it: sys.List<number>): void;
  static make(...args: unknown[]): Cond;
}

/**
 * FSlot is the read/write fcode representation of sys::Slot.
 */
export class FSlot extends sys.Obj implements CSlot, FConst {
  static type$: sys.Type
  flags(): number;
  flags(it: number): void;
  ffacets(): sys.List<FFacet> | null;
  ffacets(it: sys.List<FFacet> | null): void;
  nameIndex(): number;
  nameIndex(it: number): void;
  fattrs(): sys.List<FAttr> | null;
  fattrs(it: sys.List<FAttr> | null): void;
  fparent(): FType;
  fparent(it: FType): void;
  parent(): CType;
  qname(): string;
  name(): string;
  doc(): CDoc | null;
  pod(): FPod;
  attr(name: string): FAttr | null;
  static make(fparent: FType, ...args: unknown[]): FSlot;
  facet(qname: string): CFacet | null;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  ns(): CNamespace;
  signature(): string;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  isSynthetic(): boolean;
  isPrivate(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  toStr(): string;
  isGetter(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  isInternal(): boolean;
  isSetter(): boolean;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  isCtor(): boolean;
}

/**
 * FTable is a 16-bit indexed lookup table for pod constants.
 */
export class FTable extends sys.Obj {
  static type$: sys.Type
  pod(): FPod;
  pod(it: FPod): void;
  reader(): ((arg0: sys.InStream) => sys.JsObj);
  reader(it: ((arg0: sys.InStream) => sys.JsObj)): void;
  table(): sys.List<sys.JsObj>;
  table(it: sys.List<sys.JsObj>): void;
  reverse(): sys.Map<sys.JsObj, number>;
  reverse(it: sys.Map<sys.JsObj, number>): void;
  writer(): ((arg0: sys.OutStream, arg1: sys.JsObj) => void);
  writer(it: ((arg0: sys.OutStream, arg1: sys.JsObj) => void)): void;
  static makeMethodRefs(pod: FPod): FTable;
  static makeFieldRefs(pod: FPod): FTable;
  static makeInts(pod: FPod): FTable;
  /**
   * Get the object identified by the specified 16-bit index.
   */
  get(index: number): sys.JsObj;
  static makeStrs(pod: FPod): FTable;
  static makeFloats(pod: FPod): FTable;
  static makeDecimals(pod: FPod): FTable;
  static make(pod: FPod, writer: ((arg0: sys.OutStream, arg1: sys.JsObj) => void), reader: ((arg0: sys.InStream) => sys.JsObj), ...args: unknown[]): FTable;
  /**
   * Deserialize.
   */
  write(out: sys.OutStream): void;
  /**
   * Perform a reverse lookup to map a value to it's index (only
   * available at compile time).  If the value isn't in the table
   * yet, then add it.
   */
  add(val: sys.JsObj): number;
  /**
   * Serialize.
   */
  read(in$: sys.InStream | null): FTable;
  /**
   * Return if this table is empty
   */
  isEmpty(): boolean;
  static makeTypeRefs(pod: FPod): FTable;
  static makeDurations(pod: FPod): FTable;
}

/**
 * VisitDepth enumerates how deep to traverse the AST
 */
export class VisitDepth extends sys.Enum {
  static type$: sys.Type
  /**
   * List of VisitDepth values indexed by ordinal
   */
  static vals(): sys.List<VisitDepth>;
  static typeDef(): VisitDepth;
  static slotDef(): VisitDepth;
  static expr(): VisitDepth;
  static stmt(): VisitDepth;
  /**
   * Return the VisitDepth instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): VisitDepth;
}

/**
 * FacetDef models a facet declaration.
 */
export class FacetDef extends Node implements CFacet {
  static type$: sys.Type
  vals(): sys.List<Expr>;
  vals(it: sys.List<Expr>): void;
  type(): CType;
  type(it: CType): void;
  names(): sys.List<string>;
  names(it: sys.List<string>): void;
  toStr(): string;
  serialize(): string;
  print(out: AstWriter): void;
  qname(): string;
  get(name: string): sys.JsObj | null;
  static make(loc: Loc, type: CType, ...args: unknown[]): FacetDef;
  walk(v: Visitor): void;
}

/**
 * LocaleProps is used to generate or merge locale/en.props if
 * any locale literals specified defaults such as `$<foo=Foo>`
 */
export class LocaleProps extends CompilerStep {
  static type$: sys.Type
  run(): void;
  static make(compiler: Compiler, ...args: unknown[]): LocaleProps;
}

/**
 * MapType models a parameterized Map type.
 */
export class MapType extends GenericType {
  static type$: sys.Type
  signature(): string;
  k(): CType;
  k(it: CType): void;
  v(): CType;
  v(it: CType): void;
  doParameterize(ch: number): CType;
  fits(t: CType): boolean;
  isGenericParameter(): boolean;
  flags(): number;
  static make(k: CType, v: CType, ...args: unknown[]): MapType;
  isValid(): boolean;
}

/**
 * MockField
 */
export class MockField extends MockSlot implements CField {
  static type$: sys.Type
  type(): CType;
  type(it: CType): void;
  getter(): CMethod | null;
  inheritedReturns(): CType;
  static make(parent: CType, name: string, flags: number, of$: CType, ...args: unknown[]): MockField;
  setter(): CMethod | null;
  parent(): CType;
  /**
   * Is this field the parameterization of a generic field, with
   * the generic type replaced with a real type.
   */
  isParameterized(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  isSynthetic(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  qname(): string;
  toStr(): string;
  isInternal(): boolean;
  name(): string;
  /**
   * Fandoc API docs if available
   */
  doc(): CDoc | null;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  fieldType(): CType;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  ns(): CNamespace;
  signature(): string;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  flags(): number;
  isPrivate(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  isGetter(): boolean;
  /**
   * Is this field typed with a generic parameter.
   */
  isGeneric(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  isSetter(): boolean;
  /**
   * Does this field covariantly override a method?
   */
  isCovariant(): boolean;
  /**
   * Get the facet keyed by given type, or null if not defined.
   */
  facet(qname: string): CFacet | null;
  isCtor(): boolean;
}

/**
 * Inherit processes each TypeDef to resolve the inherited
 * slots. This step is used to check invalid inheritances due
 * to conflicting slots and invalid overrides.
 */
export class Inherit extends CompilerStep {
  static type$: sys.Type
  visitTypeDef(t: TypeDef): void;
  run(): void;
  static make(compiler: Compiler, ...args: unknown[]): Inherit;
}

/**
 * Input source from the file system - see {@link CompilerOutput | CompilerOutput}
 */
export class CompilerOutputMode extends sys.Enum {
  static type$: sys.Type
  /**
   * List of CompilerOutputMode values indexed by ordinal
   */
  static vals(): sys.List<CompilerOutputMode>;
  static podFile(): CompilerOutputMode;
  static js(): CompilerOutputMode;
  static transientPod(): CompilerOutputMode;
  /**
   * Return the CompilerOutputMode instance for the specified
   * name.  If not a valid name and checked is false return null,
   * otherwise throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): CompilerOutputMode;
}

/**
 * AstWriter
 */
export class AstWriter extends sys.Obj {
  static type$: sys.Type
  needIndent(): boolean;
  needIndent(it: boolean): void;
  out(): sys.OutStream;
  out(it: sys.OutStream): void;
  indentation(): number;
  indentation(it: number): void;
  /**
   * Increment the indentation
   */
  indent(): AstWriter;
  /**
   * Decrement the indentation
   */
  unindent(): AstWriter;
  /**
   * Write the source code for the mask of flags with a trailing
   * space.
   */
  flags(flags: number): AstWriter;
  static flagsToStr(flags: number): string;
  /**
   * Write and then return this.
   */
  w(o: sys.JsObj): AstWriter;
  /**
   * Make for specified output stream
   */
  static make(out?: sys.OutStream, ...args: unknown[]): AstWriter;
  /**
   * Write newline and then return this.
   */
  nl(): AstWriter;
}

/**
 * Block is a list of zero or more Stmts
 */
export class Block extends Node {
  static type$: sys.Type
  stmts(): sys.List<Stmt>;
  stmts(it: sys.List<Stmt>): void;
  /**
   * Append a statement
   */
  add(stmt: Stmt): void;
  /**
   * Return if any of the statements perform definite assignment.
   */
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  walkExpr(closure: ((arg0: Expr) => Expr)): void;
  /**
   * Return is there are no statements
   */
  isEmpty(): boolean;
  /**
   * Does this block always cause us to exit the method (does the
   * last statement return true for Stmt.isExit)
   */
  isExit(): boolean;
  print(out: AstWriter): void;
  /**
   * Return number of statements
   */
  size(): number;
  /**
   * Append a list of statements
   */
  addAll(stmts: sys.List<Stmt>): void;
  printOpt(out: AstWriter, braces?: boolean): void;
  static make(loc: Loc, ...args: unknown[]): Block;
  walk(v: Visitor, depth: VisitDepth): void;
}

/**
 * ReturnStmt returns from the method
 */
export class ReturnStmt extends Stmt {
  static type$: sys.Type
  isSynthetic(): boolean;
  isSynthetic(it: boolean): void;
  expr(): Expr | null;
  expr(it: Expr | null): void;
  leaveVar(): MethodVar | null;
  leaveVar(it: MethodVar | null): void;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  isExit(): boolean;
  static make(loc: Loc, expr?: Expr | null, ...args: unknown[]): ReturnStmt;
  toStr(): string;
  static makeSynthetic(loc: Loc, expr?: Expr | null): ReturnStmt;
  print(out: AstWriter): void;
  walkChildren(v: Visitor, depth: VisitDepth): void;
}

/**
 * CompilerSupport provides lots of convenience methods for
 * classes used during the compiler pipeline.
 */
export class CompilerSupport extends sys.Obj {
  static type$: sys.Type
  suppressErr(): boolean;
  suppressErr(it: boolean): void;
  /**
   * Return if t is a parameterized collection type and the input
   * flag coerceParameterizedCollectionTypes is set
   */
  needParameterizedCollectionCoerce(t: CType): boolean;
  /**
   * Convenience for compiler.pod
   */
  pod(): PodDef;
  /**
   * Log, store, and return the specified CompilerErr.
   */
  errReport(e: CompilerErr): CompilerErr;
  /**
   * Convenience for compiler.ns
   */
  ns(): CNamespace;
  /**
   * Convenience for compiler.log
   */
  log(): CompilerLog;
  /**
   * Convenience for compiler.pod.units
   */
  units(): sys.List<CompilationUnit>;
  /**
   * Get default compilation unit to use for synthetic
   * definitions such as wrapper types.
   */
  syntheticsUnit(): CompilationUnit;
  /**
   * If any errors are accumulated, then throw the first one
   */
  bombIfErr(): void;
  /**
   * Get the compiler.
   */
  compiler(): Compiler;
  /**
   * Constructor takes the associated Compiler
   */
  static make(compiler: Compiler, ...args: unknown[]): CompilerSupport;
  /**
   * Convenience for compiler.types
   */
  types(): sys.List<TypeDef>;
  /**
   * Create, log, and return a CompilerErr.
   */
  err(msg: string, loc?: Loc | null): CompilerErr;
  /**
   * Add a synthetic type
   */
  addTypeDef(t: TypeDef): void;
  /**
   * Remove a synthetic type
   */
  removeTypeDef(t: TypeDef): void;
  /**
   * Create, log, and return a warning CompilerErr.
   */
  warn(msg: string, loc?: Loc | null): CompilerErr;
}

/**
 * TypeParser is used to parser formal type signatures into
 * CTypes.
 * ```
 * x::N
 * x::V[]
 * x::V[x::K]
 * |x::A, ... -> x::R|
 * ```
 */
export class TypeParser extends sys.Obj {
  static type$: sys.Type
  /**
   * Parse the signature into a resolved CType.  We *don't* use the
   * CNamespace's cache - it is using me when a signature isn't
   * found in the cache.  But we do use the CPod's type cache via
   * CPod.resolveType.
   */
  static resolve(ns: CNamespace, sig: string): CType;
}

/**
 * MethodDef models a method definition - it's signature and
 * body.
 */
export class MethodDef extends SlotDef implements CMethod {
  static type$: sys.Type
  vars(): sys.List<MethodVar>;
  vars(it: sys.List<MethodVar>): void;
  ret(): CType;
  ret(it: CType): void;
  ctorChain(): CallExpr | null;
  ctorChain(it: CallExpr | null): void;
  returns(): CType;
  returns(it: CType): void;
  inheritedRet(): CType | null;
  inheritedRet(it: CType | null): void;
  code(): Block | null;
  code(it: Block | null): void;
  usesCvars(): boolean;
  usesCvars(it: boolean): void;
  paramDefs(): sys.List<ParamDef>;
  paramDefs(it: sys.List<ParamDef>): void;
  accessorFor(): FieldDef | null;
  accessorFor(it: FieldDef | null): void;
  /**
   * Return if setter for FieldDef
   */
  isFieldSetter(): boolean;
  static isNameInstanceInit(name: string): boolean;
  /**
   * Generate unique varaible name for transpiler. This name is **not**
   * mapped into Fantom as local var like addLocalVar.
   */
  transpileTempVar(): string;
  static makeInstanceInit(loc: Loc, parent: TypeDef, block: Block | null): MethodDef;
  /**
   * Get or create a shadow variable in this closure method to
   * shadow a variable from an outer scope
   */
  getOrAddShadowVar(binding: MethodVar, scope: Block | null): MethodVar;
  /**
   * Add a parameter to the end of the method signature and
   * initialize the param MethodVar. Note: currently this only
   * works if no locals are defined.
   */
  addParamVar(ctype: CType, name: string): MethodVar;
  params(): sys.List<CParam>;
  /**
   * Return if this a instance initializer block.
   */
  isInstanceInit(): boolean;
  inheritedReturns(): CType;
  /**
   * Return if this is a constructor with an it-block as last
   * parameter
   */
  isItBlockCtor(): boolean;
  /**
   * Return if this a static initializer block.
   */
  isStaticInit(): boolean;
  /**
   * Make and add a MethodVar for a local variable.  If name is
   * null then we auto-generate a temporary variable name
   */
  addLocalVar(ctype: CType, name: string | null, scope: Block | null): MethodVar;
  signature(): string;
  static make(loc: Loc, parent: TypeDef, name?: string, flags?: number, ...args: unknown[]): MethodDef;
  static makeStaticInit(loc: Loc, parent: TypeDef, block: Block | null): MethodDef;
  static isNameStaticInit(name: string): boolean;
  print(out: AstWriter): void;
  /**
   * Return if getter/setter for FieldDef
   */
  isFieldAccessor(): boolean;
  /**
   * Make and add a MethodVar for a local variable.
   */
  addLocalVarForDef(def: LocalDefStmt, scope: Block | null): MethodVar;
  walk(v: Visitor, depth: VisitDepth): void;
  parent(): CType;
  /**
   * Is this method the parameterization of a generic method,
   * with all the generic parameters filled in with real types.
   */
  isParameterized(): boolean;
  /**
   * Return if type has NoDoc facet
   */
  isNoDoc(): boolean;
  isSynthetic(): boolean;
  isInstanceCtor(): boolean;
  isNative(): boolean;
  /**
   * Return if this method has the exact same parameters as the
   * specified method.
   */
  hasSameParams(that: CMethod): boolean;
  /**
   * Return if this slot is foreign or uses any foreign types in
   * its signature.
   */
  usesForeign(): boolean;
  qname(): string;
  inheritedReturnType(): CType;
  toStr(): string;
  isInternal(): boolean;
  /**
   * Return a string with the name and parameters.
   */
  nameAndParamTypesToStr(): string;
  name(): string;
  /**
   * Fandoc API docs if available
   */
  doc(): CDoc | null;
  isVirtual(): boolean;
  /**
   * If this a foreign function return the bridge.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  bridge(): CBridge | null;
  isStaticCtor(): boolean;
  returnType(): CType;
  /**
   * Return if the given facet is defined.
   */
  hasFacet(qname: string): boolean;
  isStatic(): boolean;
  ns(): CNamespace;
  /**
   * If this a foreign function interface slot.  A FFI slot is
   * one declared in another language.  See {@link usesForeign | usesForeign}
   * to check if the slot uses any FFI types in its signature.
   */
  isForeign(): boolean;
  flags(): number;
  isPrivate(): boolean;
  isStorage(): boolean;
  isProtected(): boolean;
  isAccessor(): boolean;
  isConst(): boolean;
  /**
   * Return if this slot is visible to the given type
   */
  isVisibleTo(curType: CType): boolean;
  isOverride(): boolean;
  isPublic(): boolean;
  /**
   * Return the bridge if this slot is foreign or uses any
   * foreign types in its signature.
   */
  usesBridge(): CBridge | null;
  isGetter(): boolean;
  /**
   * Does this method contains generic parameters in its
   * signature.
   */
  isGeneric(): boolean;
  isEnum(): boolean;
  isAbstract(): boolean;
  isOnce(): boolean;
  /**
   * If isParameterized is true, then return the generic method
   * which this method parameterizes, otherwise null
   */
  generic(): CMethod | null;
  isSetter(): boolean;
  /**
   * Does this method have a covariant return type (we don't
   * count This returns as covariant)
   */
  isCovariant(): boolean;
  /**
   * Get the facet keyed by given type, or null if not defined.
   */
  facet(qname: string): CFacet | null;
  isCtor(): boolean;
}

/**
 * WritePod writes the FPod to a zip file.
 */
export class WritePod extends CompilerStep {
  static type$: sys.Type
  /**
   * Not used, use write instead
   */
  run(): void;
  /**
   * Run the step and return pod file written
   */
  write(): sys.File;
  static make(compiler: Compiler, ...args: unknown[]): WritePod;
}

/**
 * Stmt
 */
export class Stmt extends Node {
  static type$: sys.Type
  id(): StmtId;
  /**
   * Check for definite assignment where the given function
   * returns true for the LHS of an assignment in all code paths.
   */
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  static walkExpr(v: Visitor, depth: VisitDepth, expr: Expr | null): Expr | null;
  /**
   * Does this statement always cause us to exit the method (or
   * does it cause us to loop forever without a break to the next
   * statement)
   */
  isExit(): boolean;
  /**
   * Is this statement a field initialization for a once storage
   * field. This is used in compilerEs to skip initializing
   * fields to "_once_"
   */
  isOnceFieldInit(): boolean;
  static make(loc: Loc, id: StmtId, ...args: unknown[]): Stmt;
  walk(v: Visitor, depth: VisitDepth): sys.List<Stmt> | null;
  walkChildren(v: Visitor, depth: VisitDepth): void;
}

/**
 * BinaryExpr is used for binary expressions with a left hand
 * side and a right hand side including assignment.  Note that
 * many common binary operations are actually modeled as
 * ShortcutExpr to enable method based operator overloading.
 */
export class BinaryExpr extends Expr {
  static type$: sys.Type
  tempVar(): MethodVar | null;
  tempVar(it: MethodVar | null): void;
  opToken(): Token;
  opToken(it: Token): void;
  lhs(): Expr;
  lhs(it: Expr): void;
  rhs(): Expr;
  rhs(it: Expr): void;
  isDefiniteAssign(f: ((arg0: Expr) => boolean)): boolean;
  static make(lhs: Expr, opToken: Token, rhs: Expr, ...args: unknown[]): BinaryExpr;
  toStr(): string;
  assignTarget(): sys.JsObj | null;
  static makeAssign(lhs: Expr, rhs: Expr, leave?: boolean, ...args: unknown[]): BinaryExpr;
  serialize(): string;
  isStmt(): boolean;
  walkChildren(v: Visitor): void;
}

/**
 * CompilerErr - instances should always be created via
 * CompilerStep.err().
 */
export class CompilerErr extends sys.Err {
  static type$: sys.Type
  col(): number | null;
  level(): sys.LogLevel;
  line(): number | null;
  file(): string | null;
  loc(): Loc;
  isErr(): boolean;
  isWarn(): boolean;
  static make(msg: string, loc: Loc | null, cause?: sys.Err | null, level?: sys.LogLevel, ...args: unknown[]): CompilerErr;
}

/**
 * Fantom Disassembler
 */
export class Fanp extends sys.Obj {
  static type$: sys.Type
  showIndex(): boolean;
  showIndex(it: boolean): void;
  showCode(): boolean;
  showCode(it: boolean): void;
  showTables(): boolean;
  showTables(it: boolean): void;
  file(): string | null;
  file(it: string | null): void;
  compiler(): Compiler | null;
  compiler(it: Compiler | null): void;
  showLines(): boolean;
  showLines(it: boolean): void;
  executeFile(target: string | null): void;
  run(args: sys.List<string>): void;
  static main(): void;
  static make(...args: unknown[]): Fanp;
  printPod(pod: sys.Pod): void;
  printType(t: sys.Type): void;
  printer(pod: sys.Pod): FPrinter;
  printSlot(slot: sys.Slot): void;
  execute(target: string): void;
  fpod(podName: string): FPod;
  help(): void;
  ftype(pod: FPod, typeName: string): FType;
  fslot(ftype: FType, slotName: string): FSlot;
}

/**
 * CompilerOutput encapsulates the result of a compile.  The
 * compiler can output in three modes:
 * - `transientPod`: compiles to an in-memory pod
 * - `podFile`: compile a pod file to the file system, but don't
 *   automatically load it.
 * - `js`: runs through frontend of compiler to build AST and
 *   generates JavaScript code (doesn't perform any backend fcode
 *   or pod generation)
 */
export class CompilerOutput extends sys.Obj {
  static type$: sys.Type
  /**
   * If {@link CompilerOutputMode.podFile | CompilerOutputMode.podFile}
   * mode, the pod zip file written to disk.
   */
  podFile(): sys.File | null;
  podFile(it: sys.File | null): void;
  /**
   * If {@link CompilerOutputMode.js | CompilerOutputMode.js}
   * mode, the JavaScript code string.
   */
  js(): string | null;
  js(it: string | null): void;
  cjs(): string | null;
  cjs(it: string | null): void;
  /**
   * Mode indicates the type of this output
   */
  mode(): CompilerOutputMode | null;
  mode(it: CompilerOutputMode | null): void;
  /**
   * If {@link CompilerOutputMode.transientPod | CompilerOutputMode.transientPod}
   * mode, this is loaded pod.
   */
  transientPod(): sys.Pod | null;
  transientPod(it: sys.Pod | null): void;
  esm(): string | null;
  esm(it: string | null): void;
  static make(...args: unknown[]): CompilerOutput;
}

