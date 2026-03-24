import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as util from './util.js';

export class Store extends sys.Obj {
  static type$: sys.Type
  onWriteErr(): ((arg0: sys.Err) => void) | null;
  onWriteErr(it: ((arg0: sys.Err) => void) | null): void;
  flushMode(): string;
  flushMode(it: string): void;
  ro(): boolean;
  ro(it: boolean): void;
  lockFile(): util.LockFile;
  backup(file?: sys.File | null, opts?: sys.Map<string, sys.JsObj> | null): BackupMonitor | null;
  gcFreezeCount(): number;
  dir(): sys.File;
  unflushedCount(): number;
  flush(): void;
  create(meta: sys.Buf, data: sys.Buf): Blob;
  close(): void;
  static make(...args: unknown[]): Store;
  ver(): number;
  each(f: ((arg0: Blob) => void)): void;
  blob(handle: number, checked?: boolean): Blob | null;
  size(): number;
  meta(): StoreMeta;
  static open(dir: sys.File, config?: StoreConfig | null): Store;
}

export class Blob extends sys.Obj {
  static type$: sys.Type
  stash(): sys.JsObj | null;
  stash(it: sys.JsObj | null): void;
  locToStr(): string;
  static handleToStr(h: number): string;
  isActive(): boolean;
  delete(): void;
  isDeleted(): boolean;
  write(meta: sys.Buf | null, data: sys.Buf | null, expectedVer?: number): void;
  static make(...args: unknown[]): Blob;
  static handleFromStr(h: string): number;
  ver(): number;
  read(buf: sys.Buf): sys.Buf;
  handle(): number;
  store(): Store;
  size(): number;
  meta(): BlobMeta;
  append(meta: sys.Buf | null, data: sys.Buf): void;
}

export class StoreMeta extends sys.Obj {
  static type$: sys.Type
  blobMetaMax(): number;
  blobDataMax(): number;
  hisPageSize(): sys.Duration;
  static make(...args: unknown[]): StoreMeta;
}

export class UnknownBlobErr extends sys.Err {
  static type$: sys.Type
  static make(msg: string, cause?: sys.Err | null, ...args: unknown[]): UnknownBlobErr;
}

export class BackupTest extends sys.Test {
  static type$: sys.Type
  backupCount(): number;
  backupCount(it: number): void;
  src(): Store | null;
  src(it: Store | null): void;
  static counter(): concurrent.AtomicInt;
  files(): sys.Map<string, string>;
  files(it: sys.Map<string, string>): void;
  verifyBufEq(a: sys.Buf, b: sys.Buf): void;
  doBackup(doWhile: (() => void) | null): sys.File;
  verifyStoreMetaEq(a: StoreMeta, b: StoreMeta): void;
  verifyBackup(): void;
  verifyBlobMetaEq(a: BlobMeta, b: BlobMeta): void;
  static rand(r: sys.Range): sys.Buf;
  testBasics(): void;
  static make(...args: unknown[]): BackupTest;
  unzipBackup(zipFile: sys.File): sys.File;
  verifyBlobEq(a: Blob, b: Blob): void;
  verifyStoreEq(a: Store, b: Store): void;
  addFile(name: string, content: string): void;
}

export class ConcurrentWriteErr extends sys.Err {
  static type$: sys.Type
  static make(msg: string, cause?: sys.Err | null, ...args: unknown[]): ConcurrentWriteErr;
}

export class StoreTest extends sys.Test {
  static type$: sys.Type
  ver(): number;
  ver(it: number): void;
  s(): Store | null;
  s(it: Store | null): void;
  testAppend(): void;
  testWriteExpectedVer(): void;
  testOnWriteErr(): void;
  verifyBlobStr(b: Blob, expected: string): void;
  testConfig(): void;
  verifyBlob(b: Blob, handleIndex: number, loc: string, ver: number, meta: sys.Buf, data: sys.Buf): void;
  verifyOnWriteErr(f: ((arg0: this) => void)): void;
  testFlush(): void;
  testBasics(): void;
  static make(...args: unknown[]): StoreTest;
  static bestPageSize(size: number): number;
  verifyDeleted(b: Blob, handleIndex: number, ver: number): void;
  verifyEach(active: sys.List<Blob>, deleted?: sys.List<Blob>): void;
}

export class StoreConfig extends sys.Obj {
  static type$: sys.Type
  hisPageSize(): sys.Duration;
  __hisPageSize(it: sys.Duration): void;
  static make(f?: ((arg0: StoreConfig) => void) | null, ...args: unknown[]): StoreConfig;
}

export class MiscTest extends sys.Test {
  static type$: sys.Type
  testFreeMap(): void;
  testIO(): void;
  java(): Tests;
  testBlobMap(): void;
  static make(...args: unknown[]): MiscTest;
  testHandleToStr(): void;
  testBlobMeta(): void;
  verifyHandleToStr(h: number, s: string): void;
}

export class BlobMeta extends sys.Obj {
  static type$: sys.Type
  readU4(index: number): number;
  readS2(index: number): number;
  readS1(index: number): number;
  readS4(index: number): number;
  size(): number;
  readU2(index: number): number;
  get(index: number): number;
  readU1(index: number): number;
  static fromBuf(buf: sys.Buf, ...args: unknown[]): BlobMeta;
  static make(...args: unknown[]): BlobMeta;
  readS8(index: number): number;
}

export class Tests extends sys.Obj {
  static type$: sys.Type
  testFreeMap(): void;
  testIO(): void;
  testBlobMap(): void;
  static make(bridge: JavaTestBridge, ...args: unknown[]): Tests;
}

export class StoreErr extends sys.Err {
  static type$: sys.Type
  static make(msg: string, cause?: sys.Err | null, ...args: unknown[]): StoreErr;
}

export class JavaTestBridge extends sys.Obj {
  static type$: sys.Type
  test(): sys.Test;
  test(it: sys.Test): void;
  verify(b: boolean): void;
  static make(t: sys.Test, ...args: unknown[]): JavaTestBridge;
}

export class BackupMonitor extends sys.Obj {
  static type$: sys.Type
  err(): sys.Err | null;
  onComplete(f: ((arg0: this) => void)): void;
  store(): Store;
  file(): sys.File;
  future(): concurrent.Future;
  progress(): number;
  startTime(): sys.DateTime;
  endTime(): sys.DateTime | null;
  static make(...args: unknown[]): BackupMonitor;
  isComplete(): boolean;
}

