import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as xeto from './xeto.js';
import * as haystack from './haystack.js';
import * as def from './def.js';
import * as folio from './folio.js';
import * as hxStore from './hxStore.js';

export class CommitTest extends WhiteboxTest {
  static type$: sys.Type
  verifyCommit(rec: haystack.Dict, changes: sys.JsObj, flags: number, persistent: sys.Map<string, sys.JsObj>, transient: sys.Map<string, sys.JsObj>): haystack.Dict;
  verifyCommitErr(rec: haystack.Dict, changes: sys.JsObj, mode: string): void;
  test(): void;
  testTrash(): void;
  static make(...args: unknown[]): CommitTest;
  verifyTrash(r: haystack.Dict, isTrash: boolean): void;
}

export class StoreMgrTest extends WhiteboxTest {
  static type$: sys.Type
  testWriteNum(): void;
  static make(...args: unknown[]): StoreMgrTest;
}

export class HxFolio extends folio.Folio {
  static type$: sys.Type
  backup(): BackupMgr;
  his(): HisMgr;
  passwords(): folio.PasswordStore;
  flushMode(): string;
  flushMode(it: string): void;
  debug(): DebugMgr;
  rec(id: haystack.Ref, checked?: boolean): Rec | null;
  sync(timeout?: sys.Duration | null, mgr?: string | null): this;
  readByIdPersistentTags(id: haystack.Ref, checked?: boolean): haystack.Dict | null;
  debugDump(out: sys.OutStream): void;
  flush(): void;
  curVer(): number;
  diags(): sys.List<FolioDiag>;
  readByIdTransientTags(id: haystack.Ref, checked?: boolean): haystack.Dict | null;
  toAbsRef(ref: haystack.Ref): haystack.Ref;
  static open(config: folio.FolioConfig): folio.Folio;
}

export class DisMgrTest extends WhiteboxTest {
  static type$: sys.Type
  test(): void;
  verifyDis(r: haystack.Dict, dis: string): void;
  static make(...args: unknown[]): DisMgrTest;
  verifySameRef(a: haystack.Ref, b: haystack.Ref, dis: string): void;
}

export class WhiteboxTest extends haystack.HaystackTest {
  static type$: sys.Type
  folio(): HxFolio | null;
  folio(it: HxFolio | null): void;
  commit(rec: haystack.Dict, changes: sys.JsObj, flags?: number): haystack.Dict;
  addRec(tags: sys.JsObj): haystack.Dict;
  verifySparksEq(actual: sys.List<haystack.Dict>, expected: sys.List<haystack.Dict>): void;
  reopen(): folio.Folio;
  sortSparks(sparks: sys.List<haystack.Dict>): void;
  readById(id: haystack.Ref): haystack.Dict;
  teardown(): void;
  close(): void;
  static make(...args: unknown[]): WhiteboxTest;
  open(): HxFolio;
}

export class Rec extends sys.Obj {
  static type$: sys.Type
  id(): haystack.Ref;
  numWatches(): concurrent.AtomicInt;
  blob(): hxStore.Blob;
  dis(): string;
  dict(): haystack.Dict;
  persistent(): haystack.Dict;
  static make(blob: hxStore.Blob, persistent: haystack.Dict, ...args: unknown[]): Rec;
  numWrites(): number;
  toStr(): string;
  eachBlob(f: ((arg0: hxStore.Blob) => void)): void;
  ticks(): number;
  handle(): number;
  isTrash(): boolean;
  hisItems(): sys.List<haystack.HisItem>;
  transient(): haystack.Dict;
}

export class MiscTest extends WhiteboxTest {
  static type$: sys.Type
  counter(): number;
  counter(it: number): void;
  testIntern(): void;
  static make(...args: unknown[]): MiscTest;
  testSync(): void;
}

export class QueryTest extends WhiteboxTest {
  static type$: sys.Type
  x1(): haystack.Dict | null;
  x1(it: haystack.Dict | null): void;
  x2(): haystack.Dict | null;
  x2(it: haystack.Dict | null): void;
  x3(): haystack.Dict | null;
  x3(it: haystack.Dict | null): void;
  a(): haystack.Dict | null;
  a(it: haystack.Dict | null): void;
  b(): haystack.Dict | null;
  b(it: haystack.Dict | null): void;
  c(): haystack.Dict | null;
  c(it: haystack.Dict | null): void;
  d(): haystack.Dict | null;
  d(it: haystack.Dict | null): void;
  e(): haystack.Dict | null;
  e(it: haystack.Dict | null): void;
  f(): haystack.Dict | null;
  f(it: haystack.Dict | null): void;
  g(): haystack.Dict | null;
  g(it: haystack.Dict | null): void;
  h(): haystack.Dict | null;
  h(it: haystack.Dict | null): void;
  i(): haystack.Dict | null;
  i(it: haystack.Dict | null): void;
  test(): void;
  verifyPlanStats(plan: string): void;
  testQueryAcc(): void;
  verifyQuery(filterStr: string, expected: sys.List<haystack.Dict>, plan: string, trash?: boolean): void;
  doTest(indexed: boolean): void;
  static make(...args: unknown[]): QueryTest;
  verifyQueryAcc(cx: folio.FolioContext | null, limit: number, x: sys.List<haystack.Dict>, expected: sys.List<haystack.Dict>): void;
}

export class FolioDiag extends sys.Obj {
  static type$: sys.Type
  dis(): string;
  __dis(it: string): void;
  func(): (() => sys.JsObj);
  __func(it: (() => sys.JsObj)): void;
  name(): string;
  __name(it: string): void;
  val(): sys.JsObj | null;
  static make(name: string, dis: string, func: (() => sys.JsObj), ...args: unknown[]): FolioDiag;
}

