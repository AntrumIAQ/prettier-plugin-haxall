// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as util from './util.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class StoreErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StoreErr.type$; }

  static make(msg,cause) {
    const $self = new StoreErr();
    StoreErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class UnknownBlobErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownBlobErr.type$; }

  static make(msg,cause) {
    const $self = new UnknownBlobErr();
    UnknownBlobErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class ConcurrentWriteErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConcurrentWriteErr.type$; }

  static make(msg,cause) {
    const $self = new ConcurrentWriteErr();
    ConcurrentWriteErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}





class StoreConfig extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#hisPageSize = sys.Duration.fromStr("10day");
    return;
  }

  typeof() { return StoreConfig.type$; }

  #hisPageSize = null;

  hisPageSize() { return this.#hisPageSize; }

  __hisPageSize(it) { if (it === undefined) return this.#hisPageSize; else this.#hisPageSize = it; }

  static make(f) {
    const $self = new StoreConfig();
    StoreConfig.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    ;
    if (f != null) {
      sys.Func.call(f, $self);
    }
    ;
    if (sys.ObjUtil.compareLT($self.#hisPageSize, sys.Duration.fromStr("1hr"))) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("Invalid hisPageSize: ", $self.#hisPageSize), " < 1hr"));
    }
    ;
    if (sys.ObjUtil.compareGT($self.#hisPageSize, sys.Duration.fromStr("100day"))) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("Invalid hisPageSize: ", $self.#hisPageSize), " > 100day"));
    }
    ;
    if (sys.ObjUtil.compareNE(sys.Int.mod($self.#hisPageSize.ticks(), 3600000000000), 0)) {
      throw sys.Err.make("Invalid hisPageSize: must be hours");
    }
    ;
    return;
  }

}


class JavaTestBridge extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JavaTestBridge.type$; }

  #test = null;

  test(it) {
    if (it === undefined) {
      return this.#test;
    }
    else {
      this.#test = it;
      return;
    }
  }

  static make(t) {
    const $self = new JavaTestBridge();
    JavaTestBridge.make$($self,t);
    return $self;
  }

  static make$($self,t) {
    $self.#test = t;
    return;
  }

  verify(b) {
    this.#test.verify(b);
    return;
  }

}

class BackupTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
    this.#files = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    return;
  }

  typeof() { return BackupTest.type$; }

  #src = null;

  src(it) {
    if (it === undefined) {
      return this.#src;
    }
    else {
      this.#src = it;
      return;
    }
  }

  #backupCount = 0;

  backupCount(it) {
    if (it === undefined) {
      return this.#backupCount;
    }
    else {
      this.#backupCount = it;
      return;
    }
  }

  #files = null;

  files(it) {
    if (it === undefined) {
      return this.#files;
    }
    else {
      this.#files = it;
      return;
    }
  }

  static #counter = undefined;

  static counter() {
    if (BackupTest.#counter === undefined) {
      BackupTest.static$init();
      if (BackupTest.#counter === undefined) BackupTest.#counter = null;
    }
    return BackupTest.#counter;
  }

  testBasics() {
    const this$ = this;
    let srcDir = this.tempDir().plus(sys.Uri.fromStr("src/"));
    let config = StoreConfig.make((it) => {
      it.__hisPageSize(sys.Duration.fromStr("2day"));
      return;
    });
    this.#src = Store.open(srcDir, config);
    this.verifyEq(this.#src.meta().hisPageSize(), sys.Duration.fromStr("2day"));
    this.verifyBackup();
    let a = this.#src.create(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print("a meta"), sys.Buf.type$.toNullable()), sys.Buf.type$), sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print("a val"), sys.Buf.type$.toNullable()), sys.Buf.type$));
    this.verifyBackup();
    let b = this.#src.create(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print("b meta"), sys.Buf.type$.toNullable()), sys.Buf.type$), sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print("b val"), sys.Buf.type$.toNullable()), sys.Buf.type$));
    this.verifyBackup();
    let c = this.#src.create(sys.Buf.random(32), sys.Buf.random(16));
    let d = this.#src.create(sys.Buf.random(32), sys.Buf.random(17));
    sys.Int.times(3, (it) => {
      b.write(null, sys.Buf.random(33));
      return;
    });
    this.verifyBackup();
    a.delete();
    c.delete();
    this.verifyBackup();
    this.addFile("passwords.props", "password db");
    this.addFile("alpha.txt", "Alpha!");
    this.addFile("beta.txt", "Beta!");
    this.addFile("backup-info.txt", "nope!");
    this.addFile("folio-info.txt", "nope!");
    this.verifyBackup();
    let x = sys.List.make(Blob.type$);
    sys.Int.times(100, (i) => {
      x.add(this$.#src.create(BackupTest.rand(sys.Range.make(0, 32)), BackupTest.rand(sys.Range.make(0, 66))));
      return;
    });
    sys.Int.times(100, (i) => {
      x.random().write(null, BackupTest.rand(sys.Range.make(32, 129)));
      return;
    });
    this.verifyBackup();
    this.tempDir().plus(sys.Uri.fromStr("dst/")).moveTo(this.tempDir().plus(sys.Uri.fromStr("copy/")));
    let toFree = sys.List.make(BackupAddr.type$);
    let zipFile = this.doBackup(() => {
      sys.Int.times(100, (i) => {
        this$.#src.create(BackupTest.rand(sys.Range.make(0, 32)), BackupTest.rand(sys.Range.make(0, 66)));
        return;
      });
      sys.Int.times(100, (i) => {
        let blob = x.random();
        toFree.add(BackupAddr.make(sys.ObjUtil.coerce(blob, Blob.type$)));
        blob.write(BackupTest.rand(sys.Range.make(0, 32)), BackupTest.rand(sys.Range.make(0, 200)));
        this$.verifyUsed(sys.ObjUtil.coerce(this$.#src, Store.type$), sys.ObjUtil.coerce(toFree.last(), BackupAddr.type$), true);
        return;
      });
      sys.Int.times(100, (i) => {
        x.random().append(null, BackupTest.rand(sys.Range.make(1, 10)));
        return;
      });
      sys.Int.times(10, (i) => {
        try {
          x.random().delete();
        }
        catch ($_u0) {
        }
        ;
        return;
      });
      return;
    });
    toFree.each((f) => {
      this$.verifyUsed(sys.ObjUtil.coerce(this$.#src, Store.type$), f, false);
      return;
    });
    let origSrc = Store.open(this.tempDir().plus(sys.Uri.fromStr("copy/")));
    let dstDir = this.unzipBackup(zipFile);
    let dst = Store.open(dstDir);
    this.verifyStoreEq(origSrc, dst);
    origSrc.close();
    dst.close();
    let blob = x.random();
    while (sys.ObjUtil.compareLT(blob.fileId(), 0)) {
      (blob = x.random());
    }
    ;
    let addr = BackupAddr.make(sys.ObjUtil.coerce(blob, Blob.type$));
    this.verifyUsed(sys.ObjUtil.coerce(this.#src, Store.type$), addr, true);
    blob.write(null, sys.Str.toBuf("hi there"));
    this.verifyUsed(sys.ObjUtil.coerce(this.#src, Store.type$), addr, false);
    this.#src.close();
    return;
  }

  addFile(name,content) {
    let file = this.#src.dir().plus(sys.Str.toUri(sys.Str.plus("", name)));
    file.out().print(content).close();
    this.#files.set(name, content);
    return;
  }

  verifyBackup() {
    const this$ = this;
    let zipFile = this.doBackup(null);
    let dstDir = this.unzipBackup(zipFile);
    let dst = Store.open(dstDir);
    this.verifyStoreEq(sys.ObjUtil.coerce(this.#src, Store.type$), dst);
    dst.close();
    this.#files.each((expected,name) => {
      let file = dstDir.plus(sys.Str.toUri(sys.Str.plus("", name)));
      if (sys.ObjUtil.equals(expected, "nope!")) {
        this$.verifyEq(sys.ObjUtil.coerce(file.exists(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      }
      else {
        this$.verifyEq(file.readAllStr(), expected);
      }
      ;
      return;
    });
    return;
  }

  doBackup(doWhile) {
    const this$ = this;
    let opts = sys.Map.__fromLiteral(["pathPrefix","futureResult"], [sys.Uri.fromStr("dst/"),"_done_"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    if (doWhile != null) {
      opts.set("testDelay", sys.Duration.fromStr("100ms"));
    }
    ;
    this.verifyEq(sys.ObjUtil.coerce(this.#src.gcFreezeCount(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyEq(this.#src.backup(), null);
    let file = this.tempDir().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("backup-", sys.ObjUtil.coerce(((this$) => { let $_u1 = this$.#backupCount;this$.#backupCount = sys.Int.increment(this$.#backupCount); return $_u1; })(this), sys.Obj.type$.toNullable())), ".zip")));
    let counterVal = BackupTest.counter().val();
    let b = this.#src.backup(file, opts);
    this.verifyEq(b.future().status(), concurrent.FutureStatus.pending());
    b.onComplete((it) => {
      BackupTest.counter().getAndIncrement();
      return;
    });
    this.verifySame(this.#src.backup(), b);
    this.verifySame(b.store(), this.#src);
    this.verifySame(b.file(), file);
    this.verifyErrMsg(StoreErr.type$, "A backup operation is already in progress", (it) => {
      this$.#src.backup(this$.tempDir().plus(sys.Uri.fromStr("foobar.zip")));
      return;
    });
    if (doWhile != null) {
      concurrent.Actor.sleep(sys.Duration.fromStr("10ms"));
      sys.Func.call(doWhile);
    }
    ;
    while (!b.isComplete()) {
      this.verifyEq(sys.ObjUtil.coerce(this.#src.gcFreezeCount(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
      concurrent.Actor.sleep(sys.Duration.fromStr("20ms"));
    }
    ;
    this.verifyEq(sys.ObjUtil.coerce(this.#src.gcFreezeCount(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(b.progress(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(100, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(BackupTest.counter().val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(counterVal, 1), sys.Obj.type$.toNullable()));
    this.verifyEq(b.future().status(), concurrent.FutureStatus.ok());
    this.verifyEq(b.future().get(), "_done_");
    if (b.err() != null) {
      throw sys.ObjUtil.coerce(b.err(), sys.Err.type$);
    }
    ;
    return b.file();
  }

  unzipBackup(zipFile) {
    const this$ = this;
    let zip = sys.Zip.open(zipFile);
    let dstDir = this.tempDir().plus(sys.Uri.fromStr("dst/"));
    dstDir.delete();
    zip.contents().each((f) => {
      f.copyTo(this$.tempDir().plus(sys.Str.toUri(sys.Str.getRange(f.pathStr(), sys.Range.make(1, -1)))));
      return;
    });
    let meta = dstDir.plus(sys.Uri.fromStr("backup-meta.props")).readProps();
    this.verifyEq(meta.get("version"), sys.ObjUtil.typeof(this).pod().version().toStr());
    this.verifyEq(sys.DateTime.fromStr(sys.ObjUtil.coerce(meta.get("ts"), sys.Str.type$)).date(), sys.Date.today());
    return dstDir;
  }

  verifyStoreEq(a,b) {
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(a.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.ver(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.ver(), sys.Obj.type$.toNullable()));
    this.verifyStoreMetaEq(a.meta(), b.meta());
    b.each((bb) => {
      this$.verifyBlobEq(sys.ObjUtil.coerce(a.blob(bb.handle()), Blob.type$), bb);
      return;
    });
    b.deletedEach((bb) => {
      this$.verifyBlobEq(sys.ObjUtil.coerce(a.deletedBlob(bb.handle()), Blob.type$), bb);
      return;
    });
    return;
  }

  verifyStoreMetaEq(a,b) {
    this.verifyEq(sys.ObjUtil.coerce(a.blobMetaMax(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.blobMetaMax(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.blobDataMax(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.blobDataMax(), sys.Obj.type$.toNullable()));
    this.verifyEq(a.hisPageSize(), b.hisPageSize());
    return;
  }

  verifyBlobEq(a,b) {
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(a.isActive(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.isActive(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.isDeleted(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.isDeleted(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.ver(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.ver(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()));
    if (a.isDeleted()) {
      this.verifyEq(sys.ObjUtil.coerce(sys.Int.and(a.handle(), 4294967295), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.and(b.handle(), 4294967295), sys.Obj.type$.toNullable()));
      this.verifyErr(StoreErr.type$, (it) => {
        a.read(sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$));
        return;
      });
      this.verifyErr(StoreErr.type$, (it) => {
        b.read(sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$));
        return;
      });
    }
    else {
      this.verifyBlobMetaEq(a.meta(), b.meta());
      this.verifyEq(sys.ObjUtil.coerce(a.handle(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.handle(), sys.Obj.type$.toNullable()));
      this.verifyBufEq(a.read(sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$)), b.read(sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$)));
    }
    ;
    return;
  }

  verifyBlobMetaEq(a,b) {
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()));
    sys.Int.times(a.size(), (i) => {
      this$.verifyEq(sys.ObjUtil.coerce(a.get(i), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.get(i), sys.Obj.type$.toNullable()));
      return;
    });
    return;
  }

  verifyBufEq(a,b) {
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()));
    sys.Int.times(a.size(), (i) => {
      this$.verifyEq(sys.ObjUtil.coerce(a.get(i), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.get(i), sys.Obj.type$.toNullable()));
      return;
    });
    return;
  }

  verifyUsed(store,addr,isUsed) {
    this.verifyEq(sys.ObjUtil.coerce(store.isUsed(addr.fileId(), addr.pageId()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(isUsed, sys.Obj.type$.toNullable()));
    return;
  }

  static rand(r) {
    return sys.Buf.random(r.random());
  }

  static make() {
    const $self = new BackupTest();
    BackupTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    ;
    return;
  }

  static static$init() {
    BackupTest.#counter = concurrent.AtomicInt.make();
    return;
  }

}

class BackupAddr extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BackupAddr.type$; }

  #fileId = 0;

  fileId() { return this.#fileId; }

  __fileId(it) { if (it === undefined) return this.#fileId; else this.#fileId = it; }

  #pageId = 0;

  pageId() { return this.#pageId; }

  __pageId(it) { if (it === undefined) return this.#pageId; else this.#pageId = it; }

  static make(b) {
    const $self = new BackupAddr();
    BackupAddr.make$($self,b);
    return $self;
  }

  static make$($self,b) {
    $self.#fileId = b.fileId();
    $self.#pageId = b.pageId();
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this.#fileId, sys.Obj.type$.toNullable())), ":"), sys.ObjUtil.coerce(this.#pageId, sys.Obj.type$.toNullable()));
  }

}

class StoreTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StoreTest.type$; }

  #s = null;

  s(it) {
    if (it === undefined) {
      return this.#s;
    }
    else {
      this.#s = it;
      return;
    }
  }

  #ver = 0;

  ver(it) {
    if (it === undefined) {
      return this.#ver;
    }
    else {
      this.#ver = it;
      return;
    }
  }

  testBasics() {
    const this$ = this;
    let dir = this.tempDir();
    this.#s = Store.open(dir);
    let lockPath = sys.Env.cur().tempDir().plus(sys.Uri.fromStr("test/db.lock"));
    this.verifyErrMsg(util.CannotAcquireLockFileErr.type$, sys.ObjUtil.coerce(lockPath.osPath(), sys.Str.type$), (it) => {
      Store.open(dir);
      return;
    });
    this.verifyStoreMeta(sys.ObjUtil.coerce(this.#s, Store.type$));
    this.verifyEq(this.#s.dir(), dir);
    this.verifyEach(sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("hxStore::Blob[]")));
    let am = sys.ObjUtil.coerce(sys.Buf.make().print("a meta"), sys.Buf.type$.toNullable());
    let ad = sys.ObjUtil.coerce(sys.Buf.make().print("a val"), sys.Buf.type$.toNullable());
    let a = this.#s.create(sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    let aver = this.#ver = sys.Int.increment(this.#ver);
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a]));
    this.verifyEq(a.stash(), null);
    a.stash("a stash");
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      a.stash(this$);
      return;
    });
    this.verifyEq(a.stash(), "a stash");
    let bm = sys.ObjUtil.coerce(sys.Buf.make().print("b meta"), sys.Buf.type$.toNullable());
    let bd = sys.Buf.random(128);
    let bver = this.#ver = sys.Int.increment(this.#ver);
    let b = this.#s.create(sys.ObjUtil.coerce(bm, sys.Buf.type$), bd);
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyBlob(b, 1, "1.0", bver, sys.ObjUtil.coerce(bm, sys.Buf.type$), bd);
    this.verifyEach(sys.List.make(Blob.type$, [a, b]));
    let cm = sys.ObjUtil.coerce(sys.Buf.make().print("c meta"), sys.Buf.type$.toNullable());
    let cd = sys.ObjUtil.coerce(sys.Buf.make().print("c 3456789_123456"), sys.Buf.type$.toNullable());
    let c = this.#s.create(sys.ObjUtil.coerce(cm, sys.Buf.type$), sys.ObjUtil.coerce(cd, sys.Buf.type$));
    let cver = this.#ver = sys.Int.increment(this.#ver);
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyBlob(b, 1, "1.0", bver, sys.ObjUtil.coerce(bm, sys.Buf.type$), bd);
    this.verifyBlob(c, 2, "0.1", cver, sys.ObjUtil.coerce(cm, sys.Buf.type$), sys.ObjUtil.coerce(cd, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a, b, c]));
    this.#s.close();
    this.#s = Store.open(dir);
    this.verifyEq(sys.ObjUtil.coerce(this.#s.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.#s.ver(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.#ver, sys.Obj.type$.toNullable()));
    (a = sys.ObjUtil.coerce(this.#s.blob(a.handle()), Blob.type$));
    (b = sys.ObjUtil.coerce(this.#s.blob(b.handle()), Blob.type$));
    (c = sys.ObjUtil.coerce(this.#s.blob(c.handle()), Blob.type$));
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyBlob(b, 1, "1.0", bver, sys.ObjUtil.coerce(bm, sys.Buf.type$), bd);
    this.verifyBlob(c, 2, "0.1", cver, sys.ObjUtil.coerce(cm, sys.Buf.type$), sys.ObjUtil.coerce(cd, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a, b, c]));
    this.verifyEq(a.stash(), null);
    a.stash("a stash");
    this.verifyEq(a.stash(), "a stash");
    let dm = sys.ObjUtil.coerce(sys.Buf.make().print("d meta"), sys.Buf.type$.toNullable());
    let dd = sys.ObjUtil.coerce(sys.Buf.make().print("d rocks!"), sys.Buf.type$.toNullable());
    let d = this.#s.create(sys.ObjUtil.coerce(dm, sys.Buf.type$), sys.ObjUtil.coerce(dd, sys.Buf.type$));
    let dver = this.#ver = sys.Int.increment(this.#ver);
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyBlob(b, 1, "1.0", bver, sys.ObjUtil.coerce(bm, sys.Buf.type$), bd);
    this.verifyBlob(c, 2, "0.1", cver, sys.ObjUtil.coerce(cm, sys.Buf.type$), sys.ObjUtil.coerce(cd, sys.Buf.type$));
    this.verifyBlob(d, 3, "0.2", dver, sys.ObjUtil.coerce(dm, sys.Buf.type$), sys.ObjUtil.coerce(dd, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a, b, c, d]));
    (cd = sys.ObjUtil.coerce(sys.Buf.make().print("c changed!"), sys.Buf.type$.toNullable()));
    c.write(null, cd);
    (cver = this.#ver = sys.Int.increment(this.#ver));
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyBlob(b, 1, "1.0", bver, sys.ObjUtil.coerce(bm, sys.Buf.type$), bd);
    this.verifyBlob(c, 2, "0.3", cver, sys.ObjUtil.coerce(cm, sys.Buf.type$), sys.ObjUtil.coerce(cd, sys.Buf.type$));
    this.verifyBlob(d, 3, "0.2", dver, sys.ObjUtil.coerce(dm, sys.Buf.type$), sys.ObjUtil.coerce(dd, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a, b, c, d]));
    let em = sys.ObjUtil.coerce(sys.Buf.make().print("e meta"), sys.Buf.type$.toNullable());
    let ed = sys.ObjUtil.coerce(sys.Buf.make().print("e is it!"), sys.Buf.type$.toNullable());
    let e = this.#s.create(sys.ObjUtil.coerce(em, sys.Buf.type$), sys.ObjUtil.coerce(ed, sys.Buf.type$));
    let ever = this.#ver = sys.Int.increment(this.#ver);
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyBlob(b, 1, "1.0", bver, sys.ObjUtil.coerce(bm, sys.Buf.type$), bd);
    this.verifyBlob(c, 2, "0.3", cver, sys.ObjUtil.coerce(cm, sys.Buf.type$), sys.ObjUtil.coerce(cd, sys.Buf.type$));
    this.verifyBlob(d, 3, "0.2", dver, sys.ObjUtil.coerce(dm, sys.Buf.type$), sys.ObjUtil.coerce(dd, sys.Buf.type$));
    this.verifyBlob(e, 4, "0.1", ever, sys.ObjUtil.coerce(em, sys.Buf.type$), sys.ObjUtil.coerce(ed, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a, b, c, d, e]));
    d.stash("d stash");
    d.delete();
    (dver = this.#ver = sys.Int.increment(this.#ver));
    this.verifyEq(sys.ObjUtil.coerce(this.#s.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.#s.ver(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(dver, sys.Obj.type$.toNullable()));
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyBlob(b, 1, "1.0", bver, sys.ObjUtil.coerce(bm, sys.Buf.type$), bd);
    this.verifyBlob(c, 2, "0.3", cver, sys.ObjUtil.coerce(cm, sys.Buf.type$), sys.ObjUtil.coerce(cd, sys.Buf.type$));
    this.verifyBlob(e, 4, "0.1", ever, sys.ObjUtil.coerce(em, sys.Buf.type$), sys.ObjUtil.coerce(ed, sys.Buf.type$));
    this.verifyDeleted(d, 3, dver);
    this.verifyEach(sys.List.make(Blob.type$, [a, b, c, e]), sys.List.make(Blob.type$, [d]));
    this.#s.close();
    this.#s = Store.open(dir);
    (a = sys.ObjUtil.coerce(this.#s.blob(a.handle()), Blob.type$));
    (b = sys.ObjUtil.coerce(this.#s.blob(b.handle()), Blob.type$));
    (c = sys.ObjUtil.coerce(this.#s.blob(c.handle()), Blob.type$));
    (d = sys.ObjUtil.coerce(this.#s.deletedBlob(d.handle()), Blob.type$));
    (e = sys.ObjUtil.coerce(this.#s.blob(e.handle()), Blob.type$));
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyBlob(b, 1, "1.0", bver, sys.ObjUtil.coerce(bm, sys.Buf.type$), bd);
    this.verifyBlob(c, 2, "0.3", cver, sys.ObjUtil.coerce(cm, sys.Buf.type$), sys.ObjUtil.coerce(cd, sys.Buf.type$));
    this.verifyBlob(e, 4, "0.1", ever, sys.ObjUtil.coerce(em, sys.Buf.type$), sys.ObjUtil.coerce(ed, sys.Buf.type$));
    this.verifyDeleted(d, 3, dver);
    this.verifyEach(sys.List.make(Blob.type$, [a, b, c, e]), sys.List.make(Blob.type$, [d]));
    let fm = sys.ObjUtil.coerce(sys.Buf.make().print("e meta"), sys.Buf.type$.toNullable());
    let fd = sys.ObjUtil.coerce(sys.Buf.make().print("f is it!"), sys.Buf.type$.toNullable());
    let f = this.#s.create(sys.ObjUtil.coerce(fm, sys.Buf.type$), sys.ObjUtil.coerce(fd, sys.Buf.type$));
    let fver = this.#ver = sys.Int.increment(this.#ver);
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyBlob(b, 1, "1.0", bver, sys.ObjUtil.coerce(bm, sys.Buf.type$), bd);
    this.verifyBlob(c, 2, "0.3", cver, sys.ObjUtil.coerce(cm, sys.Buf.type$), sys.ObjUtil.coerce(cd, sys.Buf.type$));
    this.verifyBlob(e, 4, "0.1", ever, sys.ObjUtil.coerce(em, sys.Buf.type$), sys.ObjUtil.coerce(ed, sys.Buf.type$));
    this.verifyBlob(f, 3, "0.2", fver, sys.ObjUtil.coerce(fm, sys.Buf.type$), sys.ObjUtil.coerce(fd, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a, b, c, e, f]));
    (bm = sys.ObjUtil.coerce(sys.Buf.make().print("b new meta"), sys.Buf.type$.toNullable()));
    (fm = sys.ObjUtil.coerce(sys.Buf.make().print("f new stuff"), sys.Buf.type$.toNullable()));
    (fd = sys.Buf.random(64));
    b.write(bm, null);
    (bver = this.#ver = sys.Int.increment(this.#ver));
    f.write(fm, fd);
    (fver = this.#ver = sys.Int.increment(this.#ver));
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyBlob(b, 1, "1.0", bver, sys.ObjUtil.coerce(bm, sys.Buf.type$), bd);
    this.verifyBlob(c, 2, "0.3", cver, sys.ObjUtil.coerce(cm, sys.Buf.type$), sys.ObjUtil.coerce(cd, sys.Buf.type$));
    this.verifyBlob(e, 4, "0.1", ever, sys.ObjUtil.coerce(em, sys.Buf.type$), sys.ObjUtil.coerce(ed, sys.Buf.type$));
    this.verifyBlob(f, 3, "2.0", fver, sys.ObjUtil.coerce(fm, sys.Buf.type$), sys.ObjUtil.coerce(fd, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a, b, c, e, f]));
    let ok = sys.Buf.random(3);
    let bigMeta = sys.Buf.random(33);
    let bigData = sys.Buf.random(1048577);
    this.verifyErr(StoreErr.type$, (it) => {
      this$.#s.create(bigMeta, ok);
      return;
    });
    this.verifyErr(StoreErr.type$, (it) => {
      this$.#s.create(ok, bigData);
      return;
    });
    this.verifyErr(StoreErr.type$, (it) => {
      b.write(bigMeta, null);
      return;
    });
    this.verifyErr(StoreErr.type$, (it) => {
      b.write(null, bigData);
      return;
    });
    this.verifyErr(StoreErr.type$, (it) => {
      b.write(bigMeta, bigData);
      return;
    });
    let gm = sys.Buf.random(32);
    let gd = bigData;
    gd.size(sys.Int.minus(gd.size(), 1));
    let g = this.#s.create(gm, gd);
    let gver = this.#ver = sys.Int.increment(this.#ver);
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyBlob(b, 1, "1.0", bver, sys.ObjUtil.coerce(bm, sys.Buf.type$), bd);
    this.verifyBlob(c, 2, "0.3", cver, sys.ObjUtil.coerce(cm, sys.Buf.type$), sys.ObjUtil.coerce(cd, sys.Buf.type$));
    this.verifyBlob(e, 4, "0.1", ever, sys.ObjUtil.coerce(em, sys.Buf.type$), sys.ObjUtil.coerce(ed, sys.Buf.type$));
    this.verifyBlob(f, 3, "2.0", fver, sys.ObjUtil.coerce(fm, sys.Buf.type$), sys.ObjUtil.coerce(fd, sys.Buf.type$));
    this.verifyBlob(g, 5, "3.0", gver, gm, gd);
    this.verifyEach(sys.List.make(Blob.type$, [a, b, c, e, f, g]));
    let empty = sys.Buf.make();
    let h = this.#s.create(sys.ObjUtil.coerce(empty, sys.Buf.type$), sys.ObjUtil.coerce(empty, sys.Buf.type$));
    let hver = this.#ver = sys.Int.increment(this.#ver);
    let i = this.#s.create(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(empty), sys.Buf.type$.toNullable()), sys.Buf.type$), sys.ObjUtil.coerce(empty, sys.Buf.type$));
    let iver = this.#ver = sys.Int.increment(this.#ver);
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyBlob(b, 1, "1.0", bver, sys.ObjUtil.coerce(bm, sys.Buf.type$), bd);
    this.verifyBlob(c, 2, "0.3", cver, sys.ObjUtil.coerce(cm, sys.Buf.type$), sys.ObjUtil.coerce(cd, sys.Buf.type$));
    this.verifyBlob(e, 4, "0.1", ever, sys.ObjUtil.coerce(em, sys.Buf.type$), sys.ObjUtil.coerce(ed, sys.Buf.type$));
    this.verifyBlob(f, 3, "2.0", fver, sys.ObjUtil.coerce(fm, sys.Buf.type$), sys.ObjUtil.coerce(fd, sys.Buf.type$));
    this.verifyBlob(g, 5, "3.0", gver, gm, gd);
    this.verifyBlob(h, 6, "0.2", hver, sys.ObjUtil.coerce(empty, sys.Buf.type$), sys.ObjUtil.coerce(empty, sys.Buf.type$));
    this.verifyBlob(i, 7, "0.4", iver, sys.ObjUtil.coerce(empty, sys.Buf.type$), sys.ObjUtil.coerce(empty, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a, b, c, e, f, g, h, i]));
    this.verifyEq(sys.ObjUtil.coerce(this.#s.ro(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.#s.ro(true);
    this.verifyEq(sys.ObjUtil.coerce(this.#s.ro(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyErrMsg(StoreErr.type$, "Store is readonly", (it) => {
      this$.#s.create(sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$), sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$));
      return;
    });
    this.verifyErrMsg(StoreErr.type$, "Store is readonly", (it) => {
      a.write(sys.Str.toBuf("bad"), sys.Str.toBuf("in ro!"));
      return;
    });
    this.verifyErrMsg(StoreErr.type$, "Store is readonly", (it) => {
      b.append(sys.Str.toBuf("bad"), sys.Str.toBuf("in ro!"));
      return;
    });
    this.verifyErrMsg(StoreErr.type$, "Store is readonly", (it) => {
      f.delete();
      return;
    });
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.#s.close();
    this.#s = Store.open(dir);
    this.verifyStoreMeta(sys.ObjUtil.coerce(this.#s, Store.type$));
    (a = sys.ObjUtil.coerce(this.#s.blob(a.handle()), Blob.type$));
    (b = sys.ObjUtil.coerce(this.#s.blob(b.handle()), Blob.type$));
    (c = sys.ObjUtil.coerce(this.#s.blob(c.handle()), Blob.type$));
    (e = sys.ObjUtil.coerce(this.#s.blob(e.handle()), Blob.type$));
    (f = sys.ObjUtil.coerce(this.#s.blob(f.handle()), Blob.type$));
    (g = sys.ObjUtil.coerce(this.#s.blob(g.handle()), Blob.type$));
    (h = sys.ObjUtil.coerce(this.#s.blob(h.handle()), Blob.type$));
    (i = sys.ObjUtil.coerce(this.#s.blob(i.handle()), Blob.type$));
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyBlob(b, 1, "1.0", bver, sys.ObjUtil.coerce(bm, sys.Buf.type$), bd);
    this.verifyBlob(c, 2, "0.3", cver, sys.ObjUtil.coerce(cm, sys.Buf.type$), sys.ObjUtil.coerce(cd, sys.Buf.type$));
    this.verifyBlob(e, 4, "0.1", ever, sys.ObjUtil.coerce(em, sys.Buf.type$), sys.ObjUtil.coerce(ed, sys.Buf.type$));
    this.verifyBlob(f, 3, "2.0", fver, sys.ObjUtil.coerce(fm, sys.Buf.type$), sys.ObjUtil.coerce(fd, sys.Buf.type$));
    this.verifyBlob(g, 5, "3.0", gver, gm, gd);
    this.verifyBlob(h, 6, "0.2", hver, sys.ObjUtil.coerce(empty, sys.Buf.type$), sys.ObjUtil.coerce(empty, sys.Buf.type$));
    this.verifyBlob(i, 7, "0.4", iver, sys.ObjUtil.coerce(empty, sys.Buf.type$), sys.ObjUtil.coerce(empty, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a, b, c, e, f, g, h, i]));
    this.verifyEq(this.#s.blob(d.handle(), false), null);
    this.verifyErr(UnknownBlobErr.type$, (it) => {
      this$.#s.blob(d.handle());
      return;
    });
    this.#s.close();
    this.verifyErrMsg(StoreErr.type$, "Store is closed", (it) => {
      this$.#s.create(sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$), sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$));
      return;
    });
    this.verifyErrMsg(StoreErr.type$, "Store is closed", (it) => {
      a.read(sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$));
      return;
    });
    this.verifyErrMsg(StoreErr.type$, "Store is closed", (it) => {
      a.write(sys.Buf.make(), null);
      return;
    });
    this.verifyErrMsg(StoreErr.type$, "Store is closed", (it) => {
      a.delete();
      return;
    });
    return;
  }

  verifyStoreMeta(s) {
    this.verifyEq(sys.ObjUtil.typeof(s).name(), "Store");
    this.verifyEq(sys.ObjUtil.typeof(s.meta()).name(), "StoreMeta");
    this.verifyEq(sys.ObjUtil.coerce(s.meta().blobMetaMax(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(32, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.meta().blobDataMax(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1048576, sys.Obj.type$.toNullable()));
    this.verifyEq(s.meta().hisPageSize(), sys.Duration.fromStr("10day"));
    return;
  }

  testOnWriteErr() {
    const this$ = this;
    let dir = this.tempDir();
    this.#s = Store.open(dir);
    let a = this.#s.create(sys.Str.toBuf("a"), sys.Str.toBuf("alpha"));
    this.#s.testDiskFull(true);
    this.verifyOnWriteErr((it) => {
      this$.#s.create(sys.Str.toBuf("b"), sys.Str.toBuf("beta"));
      return;
    });
    this.verifyOnWriteErr((it) => {
      a.write(null, sys.Str.toBuf("alpha 2"));
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(this.#s.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyErr(UnknownBlobErr.type$, (it) => {
      this$.#s.blob(1);
      return;
    });
    this.verifyBlobStr(sys.ObjUtil.coerce(this.#s.blob(a.handle()), Blob.type$), "alpha");
    this.verifyOnWriteErr((it) => {
      a.append(null, sys.Str.toBuf("append!"));
      return;
    });
    this.verifyBlobStr(sys.ObjUtil.coerce(this.#s.blob(a.handle()), Blob.type$), "alpha");
    this.#s.close();
    this.#s = Store.open(dir);
    this.verifyEq(sys.ObjUtil.coerce(this.#s.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyErr(UnknownBlobErr.type$, (it) => {
      this$.#s.blob(1);
      return;
    });
    this.verifyBlobStr(sys.ObjUtil.coerce(this.#s.blob(a.handle()), Blob.type$), "alpha");
    this.#s.close();
    return;
  }

  verifyOnWriteErr(f) {
    const this$ = this;
    let err = null;
    let cb = (e) => {
      (err = e);
      return;
    };
    this.#s.onWriteErr(cb);
    this.verifySame(this.#s.onWriteErr(), cb);
    this.verifyErrMsg(sys.IOErr.type$, "java.io.IOException: Disk full test", (it) => {
      sys.Func.call(f, this$);
      return;
    });
    this.verifyEq(((this$) => { let $_u2 = err; if ($_u2 == null) return null; return sys.ObjUtil.typeof(err); })(this), sys.IOErr.type$);
    return;
  }

  verifyBlobStr(b,expected) {
    let buf = sys.Buf.make();
    b.read(sys.ObjUtil.coerce(buf, sys.Buf.type$));
    this.verifyEq(buf.readAllStr(), expected);
    return;
  }

  testAppend() {
    const this$ = this;
    let dir = this.tempDir();
    this.#s = Store.open(dir);
    let am = sys.ObjUtil.coerce(sys.Buf.make().print("a meta"), sys.Buf.type$.toNullable());
    let ad = sys.ObjUtil.coerce(sys.Buf.make().print("a val."), sys.Buf.type$.toNullable());
    let a = this.#s.create(sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    let aver = this.#ver = sys.Int.increment(this.#ver);
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a]));
    a.append(null, sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print("foo bar."), sys.Buf.type$.toNullable()), sys.Buf.type$));
    (aver = this.#ver = sys.Int.increment(this.#ver));
    (ad = sys.ObjUtil.coerce(sys.Buf.make().print("a val.foo bar."), sys.Buf.type$.toNullable()));
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a]));
    this.verifyErr(StoreErr.type$, (it) => {
      a.append(sys.Buf.random(33), sys.Buf.random(2));
      return;
    });
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a]));
    a.append(null, sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print("x."), sys.Buf.type$.toNullable()), sys.Buf.type$));
    (aver = this.#ver = sys.Int.increment(this.#ver));
    (ad = sys.ObjUtil.coerce(sys.Buf.make().print("a val.foo bar.x."), sys.Buf.type$.toNullable()));
    this.verifyBlob(a, 0, "0.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a]));
    a.append(null, sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print("!"), sys.Buf.type$.toNullable()), sys.Buf.type$));
    (aver = this.#ver = sys.Int.increment(this.#ver));
    (ad = sys.ObjUtil.coerce(sys.Buf.make().print("a val.foo bar.x.!"), sys.Buf.type$.toNullable()));
    this.verifyBlob(a, 0, "1.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a]));
    (am = sys.ObjUtil.coerce(sys.Buf.make().print("some new a meta"), sys.Buf.type$.toNullable()));
    (ad = sys.ObjUtil.coerce(sys.Buf.make().print("a val.foo bar.x.!abcdefghijklmnop"), sys.Buf.type$.toNullable()));
    a.append(am, sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print("abcdefghijklmnop"), sys.Buf.type$.toNullable()), sys.Buf.type$));
    (aver = this.#ver = sys.Int.increment(this.#ver));
    this.verifyBlob(a, 0, "2.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a]));
    (am = sys.ObjUtil.coerce(sys.Buf.make().print("meta change 3"), sys.Buf.type$.toNullable()));
    (ad = sys.ObjUtil.coerce(sys.Buf.make().print("a val.foo bar.x.!abcdefghijklmnop!"), sys.Buf.type$.toNullable()));
    a.append(am, sys.Str.toBuf("!"));
    (aver = this.#ver = sys.Int.increment(this.#ver));
    this.verifyBlob(a, 0, "2.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a]));
    this.#s.close();
    this.verifyErrMsg(StoreErr.type$, "Store is closed", (it) => {
      a.append(null, sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print("xyz!"), sys.Buf.type$.toNullable()), sys.Buf.type$));
      return;
    });
    this.#s = Store.open(dir);
    (a = sys.ObjUtil.coerce(this.#s.blob(a.handle()), Blob.type$));
    this.verifyBlob(a, 0, "2.0", aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a]));
    let pageId = 2;
    let incr = 10;
    let maxSize = 1048576;
    while (sys.ObjUtil.compareLT(sys.Int.plus(sys.Int.plus(a.size(), sys.Int.mult(incr, 2)), 1), 1048576)) {
      let buf = sys.Buf.random(sys.Range.make(incr, sys.Int.mult(incr, 2)).random());
      let oldPageSize = StoreTest.bestPageSize(ad.size());
      sys.ObjUtil.coerce(ad.seek(ad.size()), sys.Buf.type$.toNullable()).writeBuf(buf);
      let newPageSize = StoreTest.bestPageSize(ad.size());
      if (sys.ObjUtil.compareNE(newPageSize, oldPageSize)) {
        ((this$) => { let $_u3 = pageId;pageId = sys.Int.increment(pageId); return $_u3; })(this);
        incr = sys.Int.mult(incr, 2);
      }
      ;
      a.append(null, buf);
      (aver = this.#ver = sys.Int.increment(this.#ver));
      this.verifyBlob(a, 0, sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(pageId, sys.Obj.type$.toNullable())), ".0"), aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    }
    ;
    let buf = sys.Buf.random(sys.Int.plus(sys.Int.minus(maxSize, ad.size()), 1));
    this.verifyErr(StoreErr.type$, (it) => {
      a.append(null, buf);
      return;
    });
    this.#s.close();
    this.verifyErrMsg(StoreErr.type$, "Store is closed", (it) => {
      a.append(null, sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print("xyz!"), sys.Buf.type$.toNullable()), sys.Buf.type$));
      return;
    });
    this.#s = Store.open(dir);
    (a = sys.ObjUtil.coerce(this.#s.blob(a.handle()), Blob.type$));
    this.verifyBlob(a, 0, sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(a.fileId(), sys.Obj.type$.toNullable())), ".0"), aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a]));
    (ad = sys.Buf.random(16));
    a.write(null, ad);
    (aver = this.#ver = sys.Int.increment(this.#ver));
    this.verifyBlob(a, 0, sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(a.fileId(), sys.Obj.type$.toNullable())), ".0"), aver, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyEach(sys.List.make(Blob.type$, [a]));
    return;
  }

  testWriteExpectedVer() {
    const this$ = this;
    let dir = this.tempDir();
    this.#s = Store.open(dir);
    let am = sys.ObjUtil.coerce(sys.Buf.make().print("a meta"), sys.Buf.type$.toNullable());
    let ad = sys.ObjUtil.coerce(sys.Buf.make().print("a val"), sys.Buf.type$.toNullable());
    let a = this.#s.create(sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyBlob(a, 0, "0.0", 1, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    this.verifyErr(ConcurrentWriteErr.type$, (it) => {
      a.write(null, sys.Str.toBuf("bad"), 2);
      return;
    });
    this.verifyErr(ConcurrentWriteErr.type$, (it) => {
      a.write(sys.Str.toBuf("bad"), null, 2);
      return;
    });
    this.verifyErr(ConcurrentWriteErr.type$, (it) => {
      a.write(sys.Str.toBuf("bad"), sys.Str.toBuf("bad"), 2);
      return;
    });
    this.verifyBlob(a, 0, "0.0", 1, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.ObjUtil.coerce(ad, sys.Buf.type$));
    a.write(null, sys.Str.toBuf("new val"), 1);
    this.verifyBlob(a, 0, "0.1", 2, sys.ObjUtil.coerce(am, sys.Buf.type$), sys.Str.toBuf("new val"));
    a.write(sys.Str.toBuf("new meta"), null, 2);
    this.verifyBlob(a, 0, "0.1", 3, sys.Str.toBuf("new meta"), sys.Str.toBuf("new val"));
    a.write(sys.Str.toBuf("new meta 2"), sys.Str.toBuf("new val 2"), 3);
    this.verifyBlob(a, 0, "0.0", 4, sys.Str.toBuf("new meta 2"), sys.Str.toBuf("new val 2"));
    this.verifyErr(ConcurrentWriteErr.type$, (it) => {
      a.write(sys.Str.toBuf("bad"), sys.Str.toBuf("bad"), 3);
      return;
    });
    this.verifyBlob(a, 0, "0.0", 4, sys.Str.toBuf("new meta 2"), sys.Str.toBuf("new val 2"));
    this.#s.close();
    return;
  }

  testConfig() {
    const this$ = this;
    this.verifyErr(sys.Err.type$, (it) => {
      let x = StoreConfig.make((it) => {
        it.__hisPageSize(sys.Duration.fromStr("1min"));
        return;
      });
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      let x = StoreConfig.make((it) => {
        it.__hisPageSize(sys.Duration.fromStr("101day"));
        return;
      });
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      let x = StoreConfig.make((it) => {
        it.__hisPageSize(sys.Duration.fromStr("138min"));
        return;
      });
      return;
    });
    let dir = this.tempDir();
    let s = Store.open(dir, StoreConfig.make((it) => {
      it.__hisPageSize(sys.Duration.fromStr("1day"));
      return;
    }));
    this.verifyEq(s.meta().hisPageSize(), sys.Duration.fromStr("1day"));
    s.close();
    (s = Store.open(dir));
    this.verifyEq(s.meta().hisPageSize(), sys.Duration.fromStr("1day"));
    s.close();
    (s = Store.open(dir, StoreConfig.make((it) => {
      it.__hisPageSize(sys.Duration.fromStr("10day"));
      return;
    })));
    this.verifyEq(s.meta().hisPageSize(), sys.Duration.fromStr("1day"));
    s.close();
    return;
  }

  testFlush() {
    const this$ = this;
    let dir = this.tempDir();
    let s = Store.open(dir);
    this.verifyEq(s.flushMode(), "fsync");
    this.verifyErr(sys.ArgErr.type$, (it) => {
      s.flushMode("bad");
      return;
    });
    this.verifyEq(s.flushMode(), "fsync");
    this.verifyEq(sys.ObjUtil.coerce(s.unflushedCount(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    let a = s.create(sys.Str.toBuf("a"), sys.Str.toBuf("first rec"));
    let b = s.create(sys.Str.toBuf("b"), sys.Str.toBuf("second rec"));
    let c = s.create(sys.Str.toBuf("c"), sys.Str.toBuf("third rec"));
    this.verifyEq(sys.ObjUtil.coerce(s.unflushedCount(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    s.flushMode("nosync");
    this.verifyEq(s.flushMode(), "nosync");
    let d = s.create(sys.Str.toBuf("d"), sys.Str.toBuf("forth rec"));
    this.verifyEq(sys.ObjUtil.coerce(s.unflushedCount(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    a.write(null, sys.Str.toBuf("this is a change"));
    this.verifyEq(sys.ObjUtil.coerce(s.unflushedCount(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    b.write(null, sys.Buf.random(64));
    this.verifyEq(sys.ObjUtil.coerce(s.unflushedCount(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    s.flush();
    this.verifyEq(sys.ObjUtil.coerce(s.unflushedCount(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    return;
  }

  verifyEach(active,deleted) {
    if (deleted === undefined) deleted = sys.List.make(Blob.type$);
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(this.#s.ver(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.#ver, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.#s.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(active.size(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.#s.deletedSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(deleted.size(), sys.Obj.type$.toNullable()));
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("hxStore::Blob"));
    this.#s.each((b) => {
      acc.add(sys.ObjUtil.coerce(b.handle(), sys.Obj.type$.toNullable()), b);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(acc.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(active.size(), sys.Obj.type$.toNullable()));
    active.each((b) => {
      this$.verifySame(acc.get(sys.ObjUtil.coerce(b.handle(), sys.Obj.type$.toNullable())), b);
      return;
    });
    acc.clear();
    this.#s.deletedEach((b) => {
      acc.add(sys.ObjUtil.coerce(b.handle(), sys.Obj.type$.toNullable()), b);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(acc.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(deleted.size(), sys.Obj.type$.toNullable()));
    deleted.each((b) => {
      this$.verifySame(acc.get(sys.ObjUtil.coerce(b.handle(), sys.Obj.type$.toNullable())), b);
      return;
    });
    return;
  }

  verifyBlob(b,handleIndex,loc,ver,meta,data) {
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(b.isActive(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(b.isDeleted(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifySame(this.#s.blob(b.handle()), b);
    this.verifyEq(this.#s.deletedBlob(b.handle(), false), null);
    this.verifyErr(UnknownBlobErr.type$, (it) => {
      this$.#s.deletedBlob(b.handle());
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(sys.Int.and(b.handle(), 2147483647), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(handleIndex, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(data.size(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(b.ver(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(ver, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(b.fileId(), sys.Obj.type$.toNullable())), "."), sys.ObjUtil.coerce(b.pageId(), sys.Obj.type$.toNullable())), loc);
    this.verifyEq(sys.ObjUtil.coerce(b.meta().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(meta.size(), sys.Obj.type$.toNullable()));
    sys.Int.times(meta.size(), (i) => {
      this$.verifyEq(sys.ObjUtil.coerce(b.meta().get(i), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(meta.get(i), sys.Obj.type$.toNullable()));
      return;
    });
    let buf = sys.Buf.make();
    b.read(sys.ObjUtil.coerce(buf, sys.Buf.type$));
    this.verifyEq(sys.ObjUtil.coerce(buf.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(data.size(), sys.Obj.type$.toNullable()));
    sys.Int.times(buf.size(), (i) => {
      this$.verifyEq(sys.ObjUtil.coerce(buf.get(i), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(data.get(i), sys.Obj.type$.toNullable()));
      return;
    });
    return;
  }

  verifyDeleted(b,handleIndex,ver) {
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(sys.Int.and(b.handle(), 2147483647), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(handleIndex, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(b.ver(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(ver, sys.Obj.type$.toNullable()));
    this.verifyErrMsg(StoreErr.type$, "Blob is deleted", (it) => {
      b.read(sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$));
      return;
    });
    this.verifyErrMsg(StoreErr.type$, "Blob is deleted", (it) => {
      b.write(null, sys.Buf.random(4));
      return;
    });
    this.verifyErrMsg(StoreErr.type$, "Blob is deleted", (it) => {
      b.delete();
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-1, sys.Obj.type$.toNullable()));
    this.verifySame(this.#s.deletedBlob(b.handle()), b);
    this.verifyEq(this.#s.blob(b.handle(), false), null);
    this.verifyErr(UnknownBlobErr.type$, (it) => {
      this$.#s.blob(b.handle());
      return;
    });
    return;
  }

  static bestPageSize(size) {
    let x = 2;
    while (sys.ObjUtil.compareGT(size, x)) {
      (x = sys.Int.shiftl(x, 1));
    }
    ;
    return x;
  }

  static make() {
    const $self = new StoreTest();
    StoreTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class MiscTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MiscTest.type$; }

  java() {
    return Tests.make(JavaTestBridge.make(this));
  }

  testIO() {
    this.java().testIO();
    return;
  }

  testFreeMap() {
    this.java().testFreeMap();
    return;
  }

  testBlobMap() {
    this.java().testBlobMap();
    return;
  }

  testHandleToStr() {
    this.verifyHandleToStr(-6066929686884122624, "abcdef98.0");
    this.verifyHandleToStr(-6066929686884122601, "abcdef98.17");
    this.verifyHandleToStr(1311768467750060032, "12345678.abcd0000");
    return;
  }

  verifyHandleToStr(h,s) {
    this.verifyEq(Blob.handleToStr(h), s);
    this.verifyEq(sys.ObjUtil.coerce(Blob.handleFromStr(s), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(h, sys.Obj.type$.toNullable()));
    return;
  }

  testBlobMeta() {
    let m = BlobMeta.fromBuf(sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$));
    this.verifyEq(sys.ObjUtil.coerce(m.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifySame(sys.ObjUtil.typeof(m), BlobMeta.type$);
    this.verifySame(m, BlobMeta.fromBuf(sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$)));
    let buf = sys.Buf.make();
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.writeI2(43981), sys.Buf.type$.toNullable()).write(104), sys.Buf.type$.toNullable()).writeI4(168496141), sys.Buf.type$.toNullable()).writeI8(1234605616436508552), sys.Buf.type$.toNullable()).writeI8(-4822678189205112), sys.Buf.type$.toNullable()).writeI4(4158113719), sys.Buf.type$.toNullable()).write(33);
    (m = BlobMeta.fromBuf(sys.ObjUtil.coerce(buf, sys.Buf.type$)));
    this.verifyEq(sys.ObjUtil.coerce(m.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(28, sys.Obj.type$.toNullable()));
    this.verifySame(sys.ObjUtil.typeof(m), BlobMeta.type$);
    this.verifyEq(sys.Int.toHex(m.readU2(0)), "abcd");
    this.verifyEq(sys.ObjUtil.coerce(m.get(2), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(104, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(m.readU4(3), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(168496141, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.Int.toHex(m.readS8(7)), "1122334455667788");
    this.verifyEq(sys.Str.upper(sys.Int.toHex(m.readS8(15))), "FFEEDDCCBBAA9988");
    this.verifyEq(sys.Str.upper(sys.Int.toHex(m.readU4(23))), "F7D7C7B7");
    this.verifyEq(sys.ObjUtil.coerce(m.get(27), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(33, sys.Obj.type$.toNullable()));
    (buf = sys.Buf.make());
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.writeI8(-188897262065272), sys.Buf.type$.toNullable()).writeI4(-1546369200), sys.Buf.type$.toNullable()).writeI2(-32001), sys.Buf.type$.toNullable()).write(-100), sys.Buf.type$.toNullable()).write(252);
    (m = BlobMeta.fromBuf(sys.ObjUtil.coerce(buf, sys.Buf.type$)));
    this.verifyEq(sys.ObjUtil.coerce(m.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(16, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(m.readS8(0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-188897262065272, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(m.readS4(8), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-1546369200, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(m.readS2(12), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-32001, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(m.readS1(14), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-100, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(m.readS1(14), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-100, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(m.readU1(15), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(252, sys.Obj.type$.toNullable()));
    (buf = sys.ObjUtil.coerce(sys.Buf.make(100).print("123"), sys.Buf.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(buf.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(buf.capacity(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(100, sys.Obj.type$.toNullable()));
    (m = BlobMeta.fromBuf(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(buf), sys.Buf.type$.toNullable()), sys.Buf.type$)));
    sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()).print("abcd");
    this.verifyEq(sys.ObjUtil.coerce(m.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(m.get(0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(49, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(m.get(1), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(50, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(m.get(2), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(51, sys.Obj.type$.toNullable()));
    (buf = sys.ObjUtil.coerce(sys.Buf.make(3).print("123"), sys.Buf.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(buf.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(buf.capacity(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    (m = BlobMeta.fromBuf(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(buf), sys.Buf.type$.toNullable()), sys.Buf.type$)));
    sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()).print("abc");
    this.verifyEq(sys.ObjUtil.coerce(m.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(m.get(0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(49, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(m.get(1), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(50, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(m.get(2), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(51, sys.Obj.type$.toNullable()));
    return;
  }

  static make() {
    const $self = new MiscTest();
    MiscTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}


const p = sys.Pod.add$('hxStore');
const xp = sys.Param.noParams$();
let m;
StoreErr.type$ = p.at$('StoreErr','sys::Err',[],{},8194,StoreErr);
UnknownBlobErr.type$ = p.at$('UnknownBlobErr','sys::Err',[],{},8194,UnknownBlobErr);
ConcurrentWriteErr.type$ = p.at$('ConcurrentWriteErr','sys::Err',[],{},8194,ConcurrentWriteErr);
Blob.type$ = p.at$('Blob','sys::Obj',[],{},8738,Blob);
BlobMeta.type$ = p.at$('BlobMeta','sys::Obj',[],{},8738,BlobMeta);
BackupMonitor.type$ = p.at$('BackupMonitor','sys::Obj',[],{},8738,BackupMonitor);
Store.type$ = p.at$('Store','sys::Obj',[],{},8738,Store);
StoreConfig.type$ = p.at$('StoreConfig','sys::Obj',[],{},8194,StoreConfig);
StoreMeta.type$ = p.at$('StoreMeta','sys::Obj',[],{},8738,StoreMeta);
JavaTestBridge.type$ = p.at$('JavaTestBridge','sys::Obj',[],{},8192,JavaTestBridge);
BackupTest.type$ = p.at$('BackupTest','sys::Test',[],{},8192,BackupTest);
BackupAddr.type$ = p.at$('BackupAddr','sys::Obj',[],{},128,BackupAddr);
StoreTest.type$ = p.at$('StoreTest','sys::Test',[],{},8192,StoreTest);
MiscTest.type$ = p.at$('MiscTest','sys::Test',[],{},8192,MiscTest);
Tests.type$ = p.at$('Tests','sys::Obj',[],{},8706,Tests);
StoreErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
UnknownBlobErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
ConcurrentWriteErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
Blob.type$.af$('stash',8704,'sys::Obj?',{}).am$('store',8192,'hxStore::Store',xp,{}).am$('handle',8192,'sys::Int',xp,{}).am$('meta',8192,'hxStore::BlobMeta',xp,{}).am$('ver',8192,'sys::Int',xp,{}).am$('size',8192,'sys::Int',xp,{}).am$('isActive',8192,'sys::Bool',xp,{}).am$('isDeleted',8192,'sys::Bool',xp,{}).am$('fileId',128,'sys::Int',xp,{}).am$('pageId',128,'sys::Int',xp,{}).am$('locToStr',8192,'sys::Str',xp,{}).am$('read',8192,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('write',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('meta','sys::Buf?',false),new sys.Param('data','sys::Buf?',false),new sys.Param('expectedVer','sys::Int',true)]),{}).am$('append',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('meta','sys::Buf?',false),new sys.Param('data','sys::Buf',false)]),{}).am$('delete',8192,'sys::Void',xp,{}).am$('handleToStr',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('h','sys::Int',false)]),{}).am$('handleFromStr',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('h','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
BlobMeta.type$.am$('fromBuf',40966,'hxStore::BlobMeta?',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('size',8192,'sys::Int',xp,{}).am$('get',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{'sys::Operator':""}).am$('readU1',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('readU2',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('readU4',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('readS1',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('readS2',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('readS4',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('readS8',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{});
BackupMonitor.type$.am$('store',8192,'hxStore::Store',xp,{}).am$('file',8192,'sys::File',xp,{}).am$('progress',8192,'sys::Int',xp,{}).am$('startTime',8192,'sys::DateTime',xp,{}).am$('endTime',8192,'sys::DateTime?',xp,{}).am$('future',8192,'concurrent::Future',xp,{}).am$('isComplete',8192,'sys::Bool',xp,{}).am$('err',8192,'sys::Err?',xp,{}).am$('onComplete',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Store.type$.af$('flushMode',8704,'sys::Str',{}).af$('ro',8704,'sys::Bool',{}).af$('onWriteErr',8704,'|sys::Err->sys::Void|?',{}).af$('testDiskFull',8704,'sys::Bool',{'sys::NoDoc':""}).am$('open',40962,'hxStore::Store',sys.List.make(sys.Param.type$,[new sys.Param('dir','sys::File',false),new sys.Param('config','hxStore::StoreConfig?',true)]),{}).am$('meta',8192,'hxStore::StoreMeta',xp,{}).am$('dir',8192,'sys::File',xp,{}).am$('ver',8192,'sys::Int',xp,{}).am$('size',8192,'sys::Int',xp,{}).am$('lockFile',8192,'util::LockFile',xp,{}).am$('gcFreezeCount',8192,'sys::Int',xp,{}).am$('blob',8192,'hxStore::Blob?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Int',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|hxStore::Blob->sys::Void|',false)]),{}).am$('create',8192,'hxStore::Blob',sys.List.make(sys.Param.type$,[new sys.Param('meta','sys::Buf',false),new sys.Param('data','sys::Buf',false)]),{}).am$('unflushedCount',8192,'sys::Int',xp,{}).am$('flush',8192,'sys::Void',xp,{}).am$('close',8192,'sys::Void',xp,{}).am$('isUsed',128,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('fileId','sys::Int',false),new sys.Param('pageId','sys::Int',false)]),{}).am$('backup',8192,'hxStore::BackupMonitor?',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File?',true),new sys.Param('opts','[sys::Str:sys::Obj]?',true)]),{}).am$('pageFileSize',8192,'sys::Int',xp,{'sys::NoDoc':""}).am$('pageFileDistribution',8192,'sys::Str[]',xp,{'sys::NoDoc':""}).am$('debugFiles',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{'sys::NoDoc':""}).am$('deletedSize',8192,'sys::Int',xp,{'sys::NoDoc':""}).am$('deletedBlob',8192,'hxStore::Blob?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Int',false),new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('deletedEach',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|hxStore::Blob->sys::Void|',false)]),{'sys::NoDoc':""}).am$('make',139268,'sys::Void',xp,{});
StoreConfig.type$.af$('hisPageSize',73730,'sys::Duration',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{});
StoreMeta.type$.am$('blobMetaMax',8192,'sys::Int',xp,{}).am$('blobDataMax',8192,'sys::Int',xp,{}).am$('hisPageSize',8192,'sys::Duration',xp,{}).am$('make',139268,'sys::Void',xp,{});
JavaTestBridge.type$.af$('test',73728,'sys::Test',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Test',false)]),{}).am$('verify',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Bool',false)]),{});
BackupTest.type$.af$('src',73728,'hxStore::Store?',{}).af$('backupCount',73728,'sys::Int',{}).af$('files',73728,'[sys::Str:sys::Str]',{}).af$('counter',106498,'concurrent::AtomicInt',{}).am$('testBasics',8192,'sys::Void',xp,{}).am$('addFile',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('content','sys::Str',false)]),{}).am$('verifyBackup',8192,'sys::Void',xp,{}).am$('doBackup',8192,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('doWhile','|->sys::Void|?',false)]),{}).am$('unzipBackup',8192,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('zipFile','sys::File',false)]),{}).am$('verifyStoreEq',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','hxStore::Store',false),new sys.Param('b','hxStore::Store',false)]),{}).am$('verifyStoreMetaEq',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','hxStore::StoreMeta',false),new sys.Param('b','hxStore::StoreMeta',false)]),{}).am$('verifyBlobEq',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','hxStore::Blob',false),new sys.Param('b','hxStore::Blob',false)]),{}).am$('verifyBlobMetaEq',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','hxStore::BlobMeta',false),new sys.Param('b','hxStore::BlobMeta',false)]),{}).am$('verifyBufEq',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Buf',false),new sys.Param('b','sys::Buf',false)]),{}).am$('verifyUsed',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('store','hxStore::Store',false),new sys.Param('addr','hxStore::BackupAddr',false),new sys.Param('isUsed','sys::Bool',false)]),{}).am$('rand',40962,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('r','sys::Range',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
BackupAddr.type$.af$('fileId',73730,'sys::Int',{}).af$('pageId',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','hxStore::Blob',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
StoreTest.type$.af$('s',73728,'hxStore::Store?',{}).af$('ver',73728,'sys::Int',{}).am$('testBasics',8192,'sys::Void',xp,{}).am$('verifyStoreMeta',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','hxStore::Store',false)]),{}).am$('testOnWriteErr',8192,'sys::Void',xp,{}).am$('verifyOnWriteErr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('verifyBlobStr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','hxStore::Blob',false),new sys.Param('expected','sys::Str',false)]),{}).am$('testAppend',8192,'sys::Void',xp,{}).am$('testWriteExpectedVer',8192,'sys::Void',xp,{}).am$('testConfig',8192,'sys::Void',xp,{}).am$('testFlush',8192,'sys::Void',xp,{}).am$('verifyEach',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('active','hxStore::Blob[]',false),new sys.Param('deleted','hxStore::Blob[]',true)]),{}).am$('verifyBlob',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','hxStore::Blob',false),new sys.Param('handleIndex','sys::Int',false),new sys.Param('loc','sys::Str',false),new sys.Param('ver','sys::Int',false),new sys.Param('meta','sys::Buf',false),new sys.Param('data','sys::Buf',false)]),{}).am$('verifyDeleted',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','hxStore::Blob',false),new sys.Param('handleIndex','sys::Int',false),new sys.Param('ver','sys::Int',false)]),{}).am$('bestPageSize',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{});
MiscTest.type$.am$('java',8192,'hxStore::Tests',xp,{}).am$('testIO',8192,'sys::Void',xp,{}).am$('testFreeMap',8192,'sys::Void',xp,{}).am$('testBlobMap',8192,'sys::Void',xp,{}).am$('testHandleToStr',8192,'sys::Void',xp,{}).am$('verifyHandleToStr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('h','sys::Int',false),new sys.Param('s','sys::Str',false)]),{}).am$('testBlobMeta',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
Tests.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('bridge','hxStore::JavaTestBridge',false)]),{}).am$('testIO',8192,'sys::Void',xp,{}).am$('testFreeMap',8192,'sys::Void',xp,{}).am$('testBlobMap',8192,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxStore");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;util 1.0");
m.set("pod.summary", "Haxall folio storage engine");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:26-05:00 New_York");
m.set("build.tsKey", "241210143126");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "false");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "SkyFoundry");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Haxall");
m.set("proj.uri", "https://haxall.io/");
m.set("pod.docApi", "false");
m.set("org.uri", "https://skyfoundry.com/");
m.set("pod.native.java", "true");
m.set("vcs.uri", "https://github.com/haxall/haxall");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  StoreErr,
  UnknownBlobErr,
  ConcurrentWriteErr,
  Blob,
  BlobMeta,
  BackupMonitor,
  Store,
  StoreConfig,
  StoreMeta,
  JavaTestBridge,
  BackupTest,
  StoreTest,
  MiscTest,
  Tests,
};
