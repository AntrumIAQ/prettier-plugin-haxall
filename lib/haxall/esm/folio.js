// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as util from './util.js'
import * as web from './web.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class FolioBrioReader extends haystack.BrioReader {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FolioBrioReader.type$; }

  #folio = null;

  folio() { return this.#folio; }

  __folio(it) { if (it === undefined) return this.#folio; else this.#folio = it; }

  static make(folio,in$) {
    const $self = new FolioBrioReader();
    FolioBrioReader.make$($self,folio,in$);
    return $self;
  }

  static make$($self,folio,in$) {
    haystack.BrioReader.make$($self, in$);
    $self.#folio = folio;
    return;
  }

  internRef(id,dis) {
    return this.#folio.internRef(sys.ObjUtil.coerce(haystack.Ref.make(id, null), haystack.Ref.type$));
  }

}

class InvalidRecIdErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InvalidRecIdErr.type$; }

  static make(msg,cause) {
    const $self = new InvalidRecIdErr();
    InvalidRecIdErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class InvalidTagNameErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InvalidTagNameErr.type$; }

  static make(msg,cause) {
    const $self = new InvalidTagNameErr();
    InvalidTagNameErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class InvalidTagValErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InvalidTagValErr.type$; }

  static make(msg,cause) {
    const $self = new InvalidTagValErr();
    InvalidTagValErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class ShutdownErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ShutdownErr.type$; }

  static make(msg,cause) {
    const $self = new ShutdownErr();
    ShutdownErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class ReadonlyReplicaErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ReadonlyReplicaErr.type$; }

  static make(msg,cause) {
    const $self = new ReadonlyReplicaErr();
    ReadonlyReplicaErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class DiffErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DiffErr.type$; }

  static make(msg,cause) {
    const $self = new DiffErr();
    DiffErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.ObjUtil.coerce(msg, sys.Str.type$), cause);
    return;
  }

}

class CommitErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CommitErr.type$; }

  static make(msg,cause) {
    const $self = new CommitErr();
    CommitErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.ObjUtil.coerce(msg, sys.Str.type$), cause);
    return;
  }

}

class ConcurrentChangeErr extends CommitErr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConcurrentChangeErr.type$; }

  static make(msg,cause) {
    const $self = new ConcurrentChangeErr();
    ConcurrentChangeErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    CommitErr.make$($self, msg, cause);
    return;
  }

}

class LoadErr extends CommitErr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LoadErr.type$; }

  static make(msg,cause) {
    const $self = new LoadErr();
    LoadErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    CommitErr.make$($self, msg, cause);
    return;
  }

}

class RecErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RecErr.type$; }

  #rec = null;

  rec() { return this.#rec; }

  __rec(it) { if (it === undefined) return this.#rec; else this.#rec = it; }

  static make(rec,msg,cause) {
    const $self = new RecErr();
    RecErr.make$($self,rec,msg,cause);
    return $self;
  }

  static make$($self,rec,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, RecErr.toRecMsg(rec, msg), cause);
    $self.#rec = rec;
    return;
  }

  static toRecMsg(rec,msg) {
    let id = sys.ObjUtil.as(rec.get("id"), haystack.Ref.type$);
    if (id != null) {
      let idStr = id.toZinc();
      if (sys.Str.isEmpty(msg)) {
        return idStr;
      }
      ;
      return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", msg), " ["), idStr), "]");
    }
    ;
    return msg;
  }

}

class HisConfigErr extends RecErr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HisConfigErr.type$; }

  static make(rec,msg,cause) {
    const $self = new HisConfigErr();
    HisConfigErr.make$($self,rec,msg,cause);
    return $self;
  }

  static make$($self,rec,msg,cause) {
    if (cause === undefined) cause = null;
    RecErr.make$($self, rec, msg, cause);
    return;
  }

}

class HisWriteErr extends RecErr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HisWriteErr.type$; }

  static make(rec,msg,cause) {
    const $self = new HisWriteErr();
    HisWriteErr.make$($self,rec,msg,cause);
    return $self;
  }

  static make$($self,rec,msg,cause) {
    if (cause === undefined) cause = null;
    RecErr.make$($self, rec, msg, cause);
    return;
  }

}

class FolioFuture extends concurrent.Future {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FolioFuture.type$; }

  static makeSync(res) {
    return SyncFolioFuture.make(res);
  }

  static makeAsync(future) {
    return AsyncFolioFuture.make(future);
  }

  complete(val) {
    throw sys.UnsupportedErr.make();
  }

  completeErr(err) {
    throw sys.UnsupportedErr.make();
  }

  get(timeout) {
    if (timeout === undefined) timeout = null;
    return sys.ObjUtil.coerce(this.waitFor(timeout), FolioFuture.type$).getRes().val();
  }

  dict(checked) {
    if (checked === undefined) checked = true;
    let rd = this.getRes();
    let dict = rd.dicts().getSafe(0);
    if (dict != null) {
      return dict;
    }
    ;
    if (checked) {
      throw haystack.UnknownRecErr.make(rd.errMsg());
    }
    ;
    return null;
  }

  dicts(checked) {
    if (checked === undefined) checked = true;
    let rd = this.getRes();
    if (!checked) {
      return rd.dicts();
    }
    ;
    if (rd.errs()) {
      throw haystack.UnknownRecErr.make(rd.errMsg());
    }
    ;
    return rd.dicts();
  }

  grid(checked) {
    if (checked === undefined) checked = true;
    return haystack.Etc.makeDictsGrid(null, this.dicts(checked));
  }

  count() {
    return this.getRes().count();
  }

  diff() {
    return sys.ObjUtil.coerce(((this$) => { let $_u0 = this$.getRes().diffs().first(); if ($_u0 != null) return $_u0; throw sys.Err.make("No diffs"); })(this), Diff.type$);
  }

  diffs() {
    return this.getRes().diffs();
  }

  static make() {
    const $self = new FolioFuture();
    FolioFuture.make$($self);
    return $self;
  }

  static make$($self) {
    concurrent.Future.make$($self);
    return;
  }

}

class SyncFolioFuture extends FolioFuture {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SyncFolioFuture.type$; }

  #getRes = null;

  getRes() { return this.#getRes; }

  __getRes(it) { if (it === undefined) return this.#getRes; else this.#getRes = it; }

  static make(res) {
    const $self = new SyncFolioFuture();
    SyncFolioFuture.make$($self,res);
    return $self;
  }

  static make$($self,res) {
    FolioFuture.make$($self);
    $self.#getRes = res;
    return;
  }

  status() {
    return concurrent.FutureStatus.ok();
  }

  timeout(timeout) {
    return this;
  }

  waitFor(timeout) {
    if (timeout === undefined) timeout = null;
    return this;
  }

  cancel() {
    return;
  }

}

class AsyncFolioFuture extends FolioFuture {
  constructor() {
    super();
    const this$ = this;
    this.#timeoutRef = concurrent.AtomicRef.make(sys.Duration.fromStr("30sec"));
    return;
  }

  typeof() { return AsyncFolioFuture.type$; }

  #future = null;

  future() { return this.#future; }

  __future(it) { if (it === undefined) return this.#future; else this.#future = it; }

  #timeoutRef = null;

  timeoutRef() { return this.#timeoutRef; }

  __timeoutRef(it) { if (it === undefined) return this.#timeoutRef; else this.#timeoutRef = it; }

  static make(future) {
    const $self = new AsyncFolioFuture();
    AsyncFolioFuture.make$($self,future);
    return $self;
  }

  static make$($self,future) {
    FolioFuture.make$($self);
    ;
    $self.#future = future;
    return;
  }

  wraps() {
    return this.#future;
  }

  status() {
    return this.#future.status();
  }

  timeout(t) {
    this.#timeoutRef.val(t);
    return this;
  }

  cancel() {
    this.#future.cancel();
    return;
  }

  waitFor(timeout) {
    if (timeout === undefined) timeout = null;
    this.#future.waitFor(timeout);
    return this;
  }

  getRes() {
    return sys.ObjUtil.coerce(this.#future.get(sys.ObjUtil.coerce(this.#timeoutRef.val(), sys.Duration.type$.toNullable())), FolioRes.type$);
  }

}

class FolioRes extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FolioRes.type$; }

  errs() {
    return false;
  }

  errMsg() {
    return "";
  }

  dicts() {
    throw sys.UnsupportedErr.make("Dicts not available");
  }

  diffs() {
    throw sys.UnsupportedErr.make("Diffs not available");
  }

  static make() {
    const $self = new FolioRes();
    FolioRes.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class ReadFolioRes extends FolioRes {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ReadFolioRes.type$; }

  #errMsgObj = null;

  errMsgObj() { return this.#errMsgObj; }

  __errMsgObj(it) { if (it === undefined) return this.#errMsgObj; else this.#errMsgObj = it; }

  #errs = false;

  errs() { return this.#errs; }

  __errs(it) { if (it === undefined) return this.#errs; else this.#errs = it; }

  #dicts = null;

  dicts() { return this.#dicts; }

  __dicts(it) { if (it === undefined) return this.#dicts; else this.#dicts = it; }

  static make(errMsgObj,errs,dicts) {
    const $self = new ReadFolioRes();
    ReadFolioRes.make$($self,errMsgObj,errs,dicts);
    return $self;
  }

  static make$($self,errMsgObj,errs,dicts) {
    FolioRes.make$($self);
    $self.#errMsgObj = ((this$) => { let $_u1 = errMsgObj; if ($_u1 == null) return null; return sys.ObjUtil.toImmutable(errMsgObj); })($self);
    $self.#errs = errs;
    $self.#dicts = sys.ObjUtil.coerce(((this$) => { let $_u2 = dicts; if ($_u2 == null) return null; return sys.ObjUtil.toImmutable(dicts); })($self), sys.Type.find("haystack::Dict?[]"));
    return;
  }

  val() {
    return this.#dicts;
  }

  errMsg() {
    return sys.ObjUtil.toStr(this.#errMsgObj);
  }

  count() {
    return this.#dicts.size();
  }

}

class CountFolioRes extends FolioRes {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CountFolioRes.type$; }

  #count = 0;

  count() { return this.#count; }

  __count(it) { if (it === undefined) return this.#count; else this.#count = it; }

  static make(count) {
    const $self = new CountFolioRes();
    CountFolioRes.make$($self,count);
    return $self;
  }

  static make$($self,count) {
    FolioRes.make$($self);
    $self.#count = count;
    return;
  }

  val() {
    return haystack.Number.makeInt(this.#count);
  }

}

class CommitFolioRes extends FolioRes {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CommitFolioRes.type$; }

  #diffs = null;

  diffs() { return this.#diffs; }

  __diffs(it) { if (it === undefined) return this.#diffs; else this.#diffs = it; }

  static make(diffs) {
    const $self = new CommitFolioRes();
    CommitFolioRes.make$($self,diffs);
    return $self;
  }

  static make$($self,diffs) {
    FolioRes.make$($self);
    $self.#diffs = sys.ObjUtil.coerce(((this$) => { let $_u3 = diffs; if ($_u3 == null) return null; return sys.ObjUtil.toImmutable(diffs); })($self), sys.Type.find("folio::Diff[]"));
    return;
  }

  val() {
    return this.#diffs;
  }

  count() {
    return this.#diffs.size();
  }

  dicts() {
    const this$ = this;
    return sys.ObjUtil.coerce(this.#diffs.map((d) => {
      return d.newRec();
    }, haystack.Dict.type$.toNullable()), sys.Type.find("haystack::Dict?[]"));
  }

}

class HisWriteFolioRes extends FolioRes {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HisWriteFolioRes.type$; }

  static #empty = undefined;

  static empty() {
    if (HisWriteFolioRes.#empty === undefined) {
      HisWriteFolioRes.static$init();
      if (HisWriteFolioRes.#empty === undefined) HisWriteFolioRes.#empty = null;
    }
    return HisWriteFolioRes.#empty;
  }

  #dict = null;

  dict() { return this.#dict; }

  __dict(it) { if (it === undefined) return this.#dict; else this.#dict = it; }

  static make(dict) {
    const $self = new HisWriteFolioRes();
    HisWriteFolioRes.make$($self,dict);
    return $self;
  }

  static make$($self,dict) {
    FolioRes.make$($self);
    $self.#dict = dict;
    return;
  }

  val() {
    return this.#dict;
  }

  count() {
    return ((this$) => { let $_u4 = sys.ObjUtil.as(this$.#dict.get("count"), haystack.Number.type$); if ($_u4 != null) return $_u4; return haystack.Number.zero(); })(this).toInt();
  }

  dicts() {
    return sys.List.make(haystack.Dict.type$, [this.#dict]);
  }

  static static$init() {
    HisWriteFolioRes.#empty = HisWriteFolioRes.make(haystack.Etc.makeDict1("count", haystack.Number.zero()));
    return;
  }

}

class BackupFolioRes extends FolioRes {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BackupFolioRes.type$; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make() {
    const $self = new BackupFolioRes();
    BackupFolioRes.make$($self);
    return $self;
  }

  static make$($self) {
    FolioRes.make$($self);
    $self.#val = ((this$) => { let $_u5 = haystack.Etc.makeDict1("dis", "Backup complete"); if ($_u5 == null) return null; return sys.ObjUtil.toImmutable(haystack.Etc.makeDict1("dis", "Backup complete")); })($self);
    return;
  }

  count() {
    return 1;
  }

}

class Folio extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#hooksRef = concurrent.AtomicRef.make(NilHooks.make());
    this.#closedRef = concurrent.AtomicBool.make(false);
    return;
  }

  typeof() { return Folio.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #config = null;

  config() { return this.#config; }

  __config(it) { if (it === undefined) return this.#config; else this.#config = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #dir = null;

  dir() { return this.#dir; }

  __dir(it) { if (it === undefined) return this.#dir; else this.#dir = it; }

  #idPrefix = null;

  idPrefix() { return this.#idPrefix; }

  __idPrefix(it) { if (it === undefined) return this.#idPrefix; else this.#idPrefix = it; }

  #hooks = null;

  hooks(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.#hooksRef.val(), FolioHooks.type$);
    }
    else {
      if (!sys.ObjUtil.is(this.#hooksRef.val(), NilHooks.type$)) {
        throw sys.Err.make("Cannot modify hooks more than once");
      }
      ;
      this.#hooksRef.val(it);
      return;
    }
  }

  #hooksRef = null;

  // private field reflection only
  __hooksRef(it) { if (it === undefined) return this.#hooksRef; else this.#hooksRef = it; }

  #flushMode = null;

  flushMode(it) {
    if (it === undefined) {
    }
    else {
    }
  }

  #closedRef = null;

  // private field reflection only
  __closedRef(it) { if (it === undefined) return this.#closedRef; else this.#closedRef = it; }

  static #optsLimit1 = undefined;

  static optsLimit1() {
    if (Folio.#optsLimit1 === undefined) {
      Folio.static$init();
      if (Folio.#optsLimit1 === undefined) Folio.#optsLimit1 = null;
    }
    return Folio.#optsLimit1;
  }

  static #optsLimit1AndTrash = undefined;

  static optsLimit1AndTrash() {
    if (Folio.#optsLimit1AndTrash === undefined) {
      Folio.static$init();
      if (Folio.#optsLimit1AndTrash === undefined) Folio.#optsLimit1AndTrash = null;
    }
    return Folio.#optsLimit1AndTrash;
  }

  static make(config) {
    const $self = new Folio();
    Folio.make$($self,config);
    return $self;
  }

  static make$($self,config) {
    ;
    $self.#name = config.name();
    $self.#config = config;
    $self.#log = config.log();
    $self.#dir = config.dir();
    $self.#idPrefix = config.idPrefix();
    return;
  }

  sync(timeout,mgr) {
    if (timeout === undefined) timeout = null;
    if (mgr === undefined) mgr = null;
    return this;
  }

  isClosed() {
    return this.#closedRef.val();
  }

  close(timeout) {
    if (timeout === undefined) timeout = null;
    this.closeAsync().timeout(timeout).getRes();
    return;
  }

  closeAsync() {
    if (this.#closedRef.getAndSet(true)) {
      return sys.ObjUtil.coerce(FolioFuture.makeSync(CountFolioRes.make(0)), FolioFuture.type$);
    }
    else {
      return this.doCloseAsync();
    }
    ;
  }

  checkRead() {
    if (this.isClosed()) {
      throw ShutdownErr.make("Cannot read, folio is closed");
    }
    ;
    return this;
  }

  checkWrite() {
    if (this.isClosed()) {
      throw ShutdownErr.make("Cannot write, folio is closed");
    }
    ;
    if (this.#config.isReplica()) {
      throw ReadonlyReplicaErr.make("Cannot write, folio is replica");
    }
    ;
    return this;
  }

  readById(id,checked) {
    if (checked === undefined) checked = true;
    return this.checkRead().doReadByIds(sys.List.make(haystack.Ref.type$.toNullable(), [id])).dict(checked);
  }

  readByIds(ids,checked) {
    if (checked === undefined) checked = true;
    return this.checkRead().doReadByIds(ids).grid(checked);
  }

  readByIdsList(ids,checked) {
    if (checked === undefined) checked = true;
    return this.checkRead().doReadByIds(ids).dicts(checked);
  }

  readCount(filter,opts) {
    if (opts === undefined) opts = null;
    return this.checkRead().doReadCount(filter, opts);
  }

  read(filter,checked) {
    if (checked === undefined) checked = true;
    return this.checkRead().doReadAll(filter, Folio.optsLimit1()).dict(checked);
  }

  readAll(filter,opts) {
    if (opts === undefined) opts = null;
    return haystack.Etc.makeDictsGrid(((this$) => { let $_u6 = opts; if ($_u6 == null) return null; return opts.get("gridMeta"); })(this), this.checkRead().doReadAll(filter, opts).dicts(false));
  }

  readAllList(filter,opts) {
    if (opts === undefined) opts = null;
    return this.checkRead().doReadAll(filter, opts).dicts();
  }

  readByIdTrash(id,checked) {
    if (checked === undefined) checked = true;
    let rec = this.readById(id, false);
    if (rec != null) {
      return rec;
    }
    ;
    return this.doReadAll(haystack.Filter.eq("id", sys.ObjUtil.coerce(id, sys.Obj.type$)), Folio.optsLimit1AndTrash()).dict(checked);
  }

  readAllEach(filter,opts,f) {
    const this$ = this;
    return this.checkRead().doReadAllEachWhile(filter, opts, (x) => {
      sys.Func.call(f, x);
      return null;
    });
  }

  readAllEachWhile(filter,opts,f) {
    return this.checkRead().doReadAllEachWhile(filter, opts, f);
  }

  readByIdPersistentTags(id,checked) {
    if (checked === undefined) checked = true;
    throw sys.UnsupportedErr.make();
  }

  readByIdTransientTags(id,checked) {
    if (checked === undefined) checked = true;
    throw sys.UnsupportedErr.make();
  }

  internRef(id) {
    let rec = this.readById(id, false);
    if (rec != null) {
      return rec.id();
    }
    ;
    return id;
  }

  commit(diff) {
    return this.checkWrite().doCommitAllSync(sys.List.make(Diff.type$, [diff]), this.cxCommitInfo()).diff();
  }

  commitAll(diffs) {
    return this.checkWrite().doCommitAllSync(diffs, this.cxCommitInfo()).diffs();
  }

  commitAsync(diff) {
    return this.checkWrite().doCommitAllAsync(sys.List.make(Diff.type$, [diff]), this.cxCommitInfo());
  }

  commitAllAsync(diffs) {
    return this.checkWrite().doCommitAllAsync(diffs, this.cxCommitInfo());
  }

  commitRemoveTrashAsync() {
    const this$ = this;
    let recs = this.readAllList(haystack.Filter.has("trash"), haystack.Etc.makeDict1("trash", haystack.Marker.val()));
    let diffs = recs.map((rec) => {
      return Diff.make(rec, null, sys.Int.or(Diff.remove(), Diff.force()));
    }, Diff.type$);
    return this.commitAllAsync(sys.ObjUtil.coerce(diffs, sys.Type.find("folio::Diff[]")));
  }

  doCommitAllSync(diffs,cxInfo) {
    return this.doCommitAllAsync(diffs, cxInfo);
  }

  cxCommitInfo() {
    return ((this$) => { let $_u7 = FolioContext.curFolio(false); if ($_u7 == null) return null; return FolioContext.curFolio(false).commitInfo(); })(this);
  }

  static static$init() {
    Folio.#optsLimit1 = haystack.Etc.dict1("limit", sys.ObjUtil.coerce(haystack.Number.makeInt(1), sys.Obj.type$));
    Folio.#optsLimit1AndTrash = haystack.Etc.dict2("limit", sys.ObjUtil.coerce(haystack.Number.makeInt(1), sys.Obj.type$), "trash", haystack.Marker.val());
    return;
  }

}

class FolioBackup {
  constructor() {
    const this$ = this;
  }

  typeof() { return FolioBackup.type$; }

}

class FolioBackupFile extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FolioBackupFile.type$; }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #tsRef = null;

  // private field reflection only
  __tsRef(it) { if (it === undefined) return this.#tsRef; else this.#tsRef = it; }

  static make(file,ts) {
    const $self = new FolioBackupFile();
    FolioBackupFile.make$($self,file,ts);
    return $self;
  }

  static make$($self,file,ts) {
    $self.#file = file;
    $self.#tsRef = ts;
    return;
  }

  ts() {
    return this.#tsRef;
  }

  size() {
    return sys.ObjUtil.coerce(this.#file.size(), sys.Int.type$);
  }

  in() {
    return this.#file.in();
  }

  delete() {
    this.#file.delete();
    return;
  }

  toStr() {
    return this.#file.name();
  }

}

class FolioConfig extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#name = "db";
    this.#opts = haystack.Etc.emptyDict();
    return;
  }

  typeof() { return FolioConfig.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #dir = null;

  dir() { return this.#dir; }

  __dir(it) { if (it === undefined) return this.#dir; else this.#dir = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #idPrefix = null;

  idPrefix() { return this.#idPrefix; }

  __idPrefix(it) { if (it === undefined) return this.#idPrefix; else this.#idPrefix = it; }

  #pool = null;

  pool() { return this.#pool; }

  __pool(it) { if (it === undefined) return this.#pool; else this.#pool = it; }

  #opts = null;

  opts() { return this.#opts; }

  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #isReplica = false;

  isReplica() { return this.#isReplica; }

  __isReplica(it) { if (it === undefined) return this.#isReplica; else this.#isReplica = it; }

  static make(f) {
    const $self = new FolioConfig();
    FolioConfig.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    const this$ = $self;
    ;
    sys.Func.call(f, $self);
    $self.#dir = $self.#dir.normalize();
    if ($self.#log == null) {
      $self.#log = sys.Log.get($self.#dir.name());
    }
    ;
    if ($self.#pool == null) {
      $self.#pool = concurrent.ActorPool.make((it) => {
        it.__name(sys.Str.plus("Folio-", this$.#dir.name()));
        return;
      });
    }
    ;
    if ($self.#idPrefix != null) {
      haystack.Ref.fromStr("test").toAbs(sys.ObjUtil.coerce($self.#idPrefix, sys.Str.type$));
    }
    ;
    $self.#isReplica = $self.#opts.has("replica");
    return;
  }

  isExtern(ref) {
    if (ref.isRel()) {
      return false;
    }
    ;
    if ((this.#idPrefix != null && sys.Str.startsWith(ref.id(), sys.ObjUtil.coerce(this.#idPrefix, sys.Str.type$)))) {
      return false;
    }
    ;
    if (sys.Str.startsWith(ref.id(), "nav:")) {
      return false;
    }
    ;
    return true;
  }

  dump() {
    sys.ObjUtil.echo("FolioConfig");
    sys.ObjUtil.echo(sys.Str.plus("  name     = ", this.#name));
    sys.ObjUtil.echo(sys.Str.plus("  dir      = ", this.#dir));
    sys.ObjUtil.echo(sys.Str.plus("  log      = ", this.#log));
    sys.ObjUtil.echo(sys.Str.plus("  idPrefix = ", this.#idPrefix));
    sys.ObjUtil.echo(sys.Str.plus("  pool     = ", this.#pool.name()));
    sys.ObjUtil.echo(sys.Str.plus("  opts     = ", this.#opts));
    return;
  }

}

class Diff extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Diff.type$; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #oldMod = null;

  oldMod() { return this.#oldMod; }

  __oldMod(it) { if (it === undefined) return this.#oldMod; else this.#oldMod = it; }

  #oldRec = null;

  oldRec() { return this.#oldRec; }

  __oldRec(it) { if (it === undefined) return this.#oldRec; else this.#oldRec = it; }

  #newRec = null;

  newRec() { return this.#newRec; }

  __newRec(it) { if (it === undefined) return this.#newRec; else this.#newRec = it; }

  #newMod = null;

  newMod() { return this.#newMod; }

  __newMod(it) { if (it === undefined) return this.#newMod; else this.#newMod = it; }

  #changes = null;

  changes() { return this.#changes; }

  __changes(it) { if (it === undefined) return this.#changes; else this.#changes = it; }

  #flags = 0;

  flags() { return this.#flags; }

  __flags(it) { if (it === undefined) return this.#flags; else this.#flags = it; }

  static #add = undefined;

  static add() {
    if (Diff.#add === undefined) {
      Diff.static$init();
      if (Diff.#add === undefined) Diff.#add = 0;
    }
    return Diff.#add;
  }

  static #remove = undefined;

  static remove() {
    if (Diff.#remove === undefined) {
      Diff.static$init();
      if (Diff.#remove === undefined) Diff.#remove = 0;
    }
    return Diff.#remove;
  }

  static #transient = undefined;

  static transient() {
    if (Diff.#transient === undefined) {
      Diff.static$init();
      if (Diff.#transient === undefined) Diff.#transient = 0;
    }
    return Diff.#transient;
  }

  static #force = undefined;

  static force() {
    if (Diff.#force === undefined) {
      Diff.static$init();
      if (Diff.#force === undefined) Diff.#force = 0;
    }
    return Diff.#force;
  }

  static #bypassRestricted = undefined;

  static bypassRestricted() {
    if (Diff.#bypassRestricted === undefined) {
      Diff.static$init();
      if (Diff.#bypassRestricted === undefined) Diff.#bypassRestricted = 0;
    }
    return Diff.#bypassRestricted;
  }

  static #curVal = undefined;

  static curVal() {
    if (Diff.#curVal === undefined) {
      Diff.static$init();
      if (Diff.#curVal === undefined) Diff.#curVal = 0;
    }
    return Diff.#curVal;
  }

  static #point = undefined;

  static point() {
    if (Diff.#point === undefined) {
      Diff.static$init();
      if (Diff.#point === undefined) Diff.#point = 0;
    }
    return Diff.#point;
  }

  static #forceTransient = undefined;

  static forceTransient() {
    if (Diff.#forceTransient === undefined) {
      Diff.static$init();
      if (Diff.#forceTransient === undefined) Diff.#forceTransient = 0;
    }
    return Diff.#forceTransient;
  }

  static make(oldRec,changes,flags) {
    const $self = new Diff();
    Diff.make$($self,oldRec,changes,flags);
    return $self;
  }

  static make$($self,oldRec,changes,flags) {
    if (flags === undefined) flags = 0;
    $self.#changes = haystack.Etc.makeDict(changes);
    $self.#flags = flags;
    if (oldRec == null) {
      if (sys.ObjUtil.equals(sys.Int.and(flags, Diff.add()), 0)) {
        throw DiffErr.make("Must pass 'add' flag if oldRec is null");
      }
      ;
      if ($self.#changes.has("id")) {
        throw DiffErr.make("Cannot specify 'id' tag if using 'add' flag");
      }
      ;
      $self.#id = haystack.Ref.gen();
    }
    else {
      if (sys.ObjUtil.compareNE(sys.Int.and(flags, Diff.add()), 0)) {
        throw DiffErr.make("Cannot pass oldRec if using 'add' flag");
      }
      ;
      $self.#id = sys.ObjUtil.coerce(oldRec.trap("id", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$);
      $self.#oldMod = sys.ObjUtil.coerce(oldRec.trap("mod", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.DateTime.type$.toNullable());
    }
    ;
    $self.#flags = $self.check();
    return;
  }

  static makeAdd(changes,id) {
    const $self = new Diff();
    Diff.makeAdd$($self,changes,id);
    return $self;
  }

  static makeAdd$($self,changes,id) {
    if (id === undefined) id = haystack.Ref.gen();
    $self.#id = id;
    $self.#changes = haystack.Etc.makeDict(changes);
    $self.#flags = Diff.add();
    if ($self.#changes.has("id")) {
      throw DiffErr.make("makeAdd cannot specify 'id' tag");
    }
    ;
    $self.#flags = $self.check();
    return;
  }

  check() {
    const this$ = this;
    if (this.isTransient()) {
      if (this.isAdd()) {
        throw DiffErr.make("Invalid diff flags: transient + add");
      }
      ;
      if (this.isRemove()) {
        throw DiffErr.make("Invalid diff flags: transient + remove");
      }
      ;
    }
    ;
    if (this.isAdd()) {
      FolioUtil.checkRecId(this.#id);
    }
    ;
    let newFlags = this.#flags;
    this.#changes.each((val,name) => {
      FolioUtil.checkTagName(name);
      let kind = FolioUtil.checkTagVal(name, val);
      (newFlags = sys.Int.or(newFlags, DiffTagRule.check(this$, name, kind, sys.ObjUtil.coerce(val, sys.Obj.type$))));
      return;
    });
    return newFlags;
  }

  isUpdate() {
    return (!this.isAdd() && !this.isRemove());
  }

  isAdd() {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, Diff.add()), 0);
  }

  isRemove() {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, Diff.remove()), 0);
  }

  isTransient() {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, Diff.transient()), 0);
  }

  isForce() {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, Diff.force()), 0);
  }

  isBypassRestricted() {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, Diff.bypassRestricted()), 0);
  }

  isCurVal() {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, Diff.curVal()), 0);
  }

  isAddPoint() {
    return (this.isAdd() && sys.ObjUtil.compareNE(sys.Int.and(this.#flags, Diff.point()), 0));
  }

  getOld(tag,def) {
    if (def === undefined) def = null;
    return ((this$) => { let $_u8 = this$.#oldRec; if ($_u8 == null) return null; return this$.#oldRec.get(tag, def); })(this);
  }

  getNew(tag,def) {
    if (def === undefined) def = null;
    return ((this$) => { let $_u9 = this$.#newRec; if ($_u9 == null) return null; return this$.#newRec.get(tag, def); })(this);
  }

  toStr() {
    const this$ = this;
    let s = sys.StrBuf.make();
    if (this.isAdd()) {
      s.addChar(43);
    }
    else {
      if (this.isRemove()) {
        s.addChar(45);
      }
      else {
        s.addChar(94);
      }
      ;
    }
    ;
    s.add("{id:").add(this.#id.toCode());
    if (this.#newMod != null) {
      s.add(",mod:").add(this.#newMod.toIso());
    }
    ;
    let first = true;
    this.#changes.each((val,name) => {
      if ((sys.ObjUtil.equals(name, "id") || sys.ObjUtil.equals(name, "mod"))) {
        return;
      }
      ;
      s.addChar(44);
      s.add(name);
      if (val !== haystack.Marker.val()) {
        s.addChar(58);
        if (sys.ObjUtil.is(val, haystack.Ref.type$)) {
          s.addChar(64).add(sys.ObjUtil.toStr(val));
        }
        else {
          s.add(haystack.ZincWriter.valToStr(val));
        }
        ;
      }
      ;
      return;
    });
    s.addChar(125);
    return s.toStr();
  }

  static makex(id,newMod,changes,flags) {
    const $self = new Diff();
    Diff.makex$($self,id,newMod,changes,flags);
    return $self;
  }

  static makex$($self,id,newMod,changes,flags) {
    $self.#id = id;
    $self.#newMod = newMod;
    $self.#changes = sys.ObjUtil.coerce(changes, haystack.Dict.type$);
    $self.#flags = flags;
    return;
  }

  static makeAll(id,oldMod,oldRec,newMod,newRec,changes,flags) {
    const $self = new Diff();
    Diff.makeAll$($self,id,oldMod,oldRec,newMod,newRec,changes,flags);
    return $self;
  }

  static makeAll$($self,id,oldMod,oldRec,newMod,newRec,changes,flags) {
    $self.#id = id;
    $self.#oldMod = oldMod;
    $self.#oldRec = oldRec;
    $self.#newMod = newMod;
    $self.#newRec = newRec;
    $self.#changes = changes;
    $self.#flags = flags;
    return;
  }

  toAuditStr() {
    try {
      let s = sys.StrBuf.make();
      let dis = ((this$) => { let $_u10 = ((this$) => { let $_u11 = this$.#newRec; if ($_u11 == null) return null; return this$.#newRec.dis(); })(this$); if ($_u10 != null) return $_u10; return ((this$) => { let $_u12 = this$.#oldRec; if ($_u12 == null) return null; return this$.#oldRec.dis(); })(this$); })(this);
      s.addChar(64).add(this.#id.toProjRel().id()).addChar(32).addChar(34).add(dis).add("\" => ");
      if (this.isRemove()) {
        return s.add("Remove").toStr();
      }
      ;
      if (this.isAdd()) {
        return s.add("Add").toStr();
      }
      ;
      return s.add(haystack.ZincWriter.valToStr(this.#changes)).toStr();
    }
    catch ($_u13) {
      $_u13 = sys.Err.make($_u13);
      if ($_u13 instanceof sys.Err) {
        let e = $_u13;
        ;
        return e.toStr();
      }
      else {
        throw $_u13;
      }
    }
    ;
  }

  static static$init() {
    Diff.#add = 1;
    Diff.#remove = 2;
    Diff.#transient = 4;
    Diff.#force = 8;
    Diff.#bypassRestricted = 16;
    Diff.#curVal = 32;
    Diff.#point = 64;
    Diff.#forceTransient = sys.Int.or(Diff.#force, Diff.#transient);
    return;
  }

}

class FolioContext {
  constructor() {
    const this$ = this;
  }

  typeof() { return FolioContext.type$; }

  static curFolio(checked) {
    if (checked === undefined) checked = true;
    let cx = concurrent.Actor.locals().get(haystack.Etc.cxActorLocalsKey());
    if (cx != null) {
      return sys.ObjUtil.coerce(cx, FolioContext.type$.toNullable());
    }
    ;
    if (checked) {
      throw sys.Err.make("No FolioContext available");
    }
    ;
    return null;
  }

}

class ReadCache extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#byId = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("haystack::Dict"));
    return;
  }

  typeof() { return ReadCache.type$; }

  #folio = null;

  folio() { return this.#folio; }

  __folio(it) { if (it === undefined) return this.#folio; else this.#folio = it; }

  static #notFound = undefined;

  static notFound() {
    if (ReadCache.#notFound === undefined) {
      ReadCache.static$init();
      if (ReadCache.#notFound === undefined) ReadCache.#notFound = null;
    }
    return ReadCache.#notFound;
  }

  #byId = null;

  // private field reflection only
  __byId(it) { if (it === undefined) return this.#byId; else this.#byId = it; }

  #misses = 0;

  misses(it) {
    if (it === undefined) {
      return this.#misses;
    }
    else {
      this.#misses = it;
      return;
    }
  }

  static make(folio) {
    const $self = new ReadCache();
    ReadCache.make$($self,folio);
    return $self;
  }

  static make$($self,folio) {
    ;
    $self.#folio = folio;
    return;
  }

  readById(id,checked) {
    if (checked === undefined) checked = true;
    let r = this.#byId.get(id);
    if (r == null) {
      this.#misses = sys.Int.increment(this.#misses);
      (r = ((this$) => { let $_u14 = this$.#folio.readById(id, false); if ($_u14 != null) return $_u14; return ReadCache.notFound(); })(this));
      this.#byId.set(id, sys.ObjUtil.coerce(r, haystack.Dict.type$));
    }
    ;
    if (r !== ReadCache.notFound()) {
      return r;
    }
    ;
    if (checked) {
      throw haystack.UnknownRecErr.make(id.toStr());
    }
    ;
    return null;
  }

  readByIdsList(ids,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    return sys.ObjUtil.coerce(ids.map((id) => {
      return this$.readById(id, checked);
    }, haystack.Dict.type$.toNullable()), sys.Type.find("haystack::Dict?[]"));
  }

  readByIds(ids,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let g = this.#folio.readByIds(ids, checked);
    g.each((it) => {
      this$.add(it);
      return;
    });
    return g;
  }

  read(filter,checked) {
    if (checked === undefined) checked = true;
    let r = this.#folio.read(sys.ObjUtil.coerce(haystack.Filter.fromStr(filter), haystack.Filter.type$), checked);
    if (r != null) {
      this.add(r);
    }
    ;
    return r;
  }

  readAll(filter) {
    const this$ = this;
    let r = this.#folio.readAll(sys.ObjUtil.coerce(haystack.Filter.fromStr(filter), haystack.Filter.type$));
    r.each((it) => {
      this$.add(it);
      return;
    });
    return r;
  }

  readCount(filter) {
    return this.#folio.readCount(sys.ObjUtil.coerce(haystack.Filter.fromStr(filter), haystack.Filter.type$));
  }

  add(rec) {
    if (rec == null) {
      return;
    }
    ;
    let i = sys.ObjUtil.as(rec.get("id"), haystack.Ref.type$);
    if (i != null) {
      this.#byId.set(sys.ObjUtil.coerce(i, haystack.Ref.type$), sys.ObjUtil.coerce(rec, haystack.Dict.type$));
    }
    ;
    return;
  }

  addAll(recs) {
    const this$ = this;
    recs.each((rec) => {
      this$.add(rec);
      return;
    });
    return;
  }

  static static$init() {
    ReadCache.#notFound = haystack.Etc.makeDict(sys.Map.__fromLiteral(["notFound"], [haystack.Marker.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker")));
    return;
  }

}

class FolioHooks {
  constructor() {
    const this$ = this;
  }

  typeof() { return FolioHooks.type$; }

  xeto(checked) {
    if (checked === undefined) checked = true;
    return ((this$) => { let $_u15 = this$.ns(false); if ($_u15 == null) return null; return this$.ns(false).xeto(); })(this);
  }

}

class FolioCommitEvent extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FolioCommitEvent.type$; }

  static make() {
    const $self = new FolioCommitEvent();
    FolioCommitEvent.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class FolioHisEvent extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FolioHisEvent.type$; }

  static make() {
    const $self = new FolioHisEvent();
    FolioHisEvent.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class NilHooks extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NilHooks.type$; }

  xeto() { return FolioHooks.prototype.xeto.apply(this, arguments); }

  ns(checked) {
    if (checked === undefined) checked = true;
    if (checked) {
      throw sys.UnsupportedErr.make("Namespace not availble");
    }
    ;
    return null;
  }

  preCommit(event) {
    return;
  }

  postCommit(event) {
    return;
  }

  postHisWrite(event) {
    return;
  }

  static make() {
    const $self = new NilHooks();
    NilHooks.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class PasswordStore extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#cacheRef = concurrent.AtomicRef.make(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), sys.Type.find("[sys::Str:sys::Str]")));
    return;
  }

  typeof() { return PasswordStore.type$; }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #idPrefix = null;

  idPrefix() { return this.#idPrefix; }

  __idPrefix(it) { if (it === undefined) return this.#idPrefix; else this.#idPrefix = it; }

  static #rands = undefined;

  static rands() {
    if (PasswordStore.#rands === undefined) {
      PasswordStore.static$init();
      if (PasswordStore.#rands === undefined) PasswordStore.#rands = null;
    }
    return PasswordStore.#rands;
  }

  static #timeout = undefined;

  static timeout() {
    if (PasswordStore.#timeout === undefined) {
      PasswordStore.static$init();
      if (PasswordStore.#timeout === undefined) PasswordStore.#timeout = null;
    }
    return PasswordStore.#timeout;
  }

  #cacheRef = null;

  // private field reflection only
  __cacheRef(it) { if (it === undefined) return this.#cacheRef; else this.#cacheRef = it; }

  #actor = null;

  // private field reflection only
  __actor(it) { if (it === undefined) return this.#actor; else this.#actor = it; }

  static open(file,config) {
    let ps = PasswordStore.make(file, config);
    ps.#actor.send(PasswordStore.msg(PasswordStoreMsgType.init())).get(PasswordStore.timeout());
    return ps;
  }

  static make(file,config) {
    const $self = new PasswordStore();
    PasswordStore.make$($self,file,config);
    return $self;
  }

  static make$($self,file,config) {
    const this$ = $self;
    ;
    $self.#file = file;
    $self.#idPrefix = config.idPrefix();
    $self.#log = config.log();
    $self.#actor = concurrent.Actor.make(config.pool(), (msg) => {
      this$.receive(sys.ObjUtil.coerce(msg, PasswordStoreMsg.type$));
      return null;
    });
    return;
  }

  get(key) {
    let val = this.cache().get(key);
    if (val == null) {
      (val = this.cache().get((key = this.relKey(key))));
    }
    ;
    if (val == null) {
      return null;
    }
    ;
    return PasswordStore.decode(sys.ObjUtil.coerce(val, sys.Str.type$));
  }

  set(key,val) {
    (key = this.relKey(key));
    this.#actor.send(PasswordStore.msg(PasswordStoreMsgType.set(), key, PasswordStore.encode(val))).get(PasswordStore.timeout());
    return;
  }

  remove(key) {
    let val = this.cache().get(key);
    if (val == null) {
      (val = this.cache().get((key = this.relKey(key))));
    }
    ;
    if (val != null) {
      this.#actor.send(PasswordStore.msg(PasswordStoreMsgType.remove(), key)).get(PasswordStore.timeout());
    }
    ;
    return;
  }

  relKey(key) {
    if ((this.#idPrefix != null && sys.Str.startsWith(key, sys.ObjUtil.coerce(this.#idPrefix, sys.Str.type$)))) {
      return sys.Str.getRange(key, sys.Range.make(sys.Str.size(this.#idPrefix), -1));
    }
    ;
    return key;
  }

  readBuf() {
    let buf = sys.Buf.make();
    buf.out().writeProps(this.cache());
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(buf), sys.Buf.type$.toNullable()), sys.Buf.type$);
  }

  writeBuf(buf) {
    this.#actor.send(PasswordStore.msg(PasswordStoreMsgType.writeBuf(), sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(buf), sys.Buf.type$))).get(PasswordStore.timeout());
    return;
  }

  receive(msg) {
    let $_u16 = msg.type();
    if (sys.ObjUtil.equals($_u16, PasswordStoreMsgType.init())) {
      return this.onInit();
    }
    else if (sys.ObjUtil.equals($_u16, PasswordStoreMsgType.sync())) {
      return this.onSync();
    }
    else if (sys.ObjUtil.equals($_u16, PasswordStoreMsgType.set())) {
      return this.onSet(sys.ObjUtil.coerce(msg.a(), sys.Str.type$), msg.b());
    }
    else if (sys.ObjUtil.equals($_u16, PasswordStoreMsgType.remove())) {
      return this.onSet(sys.ObjUtil.coerce(msg.a(), sys.Str.type$), null);
    }
    else if (sys.ObjUtil.equals($_u16, PasswordStoreMsgType.writeBuf())) {
      return this.onWriteBuf(sys.ObjUtil.coerce(msg.a(), sys.Buf.type$));
    }
    else {
      throw sys.Err.make(msg.type().toStr());
    }
    ;
  }

  onSync() {
    return "sync";
  }

  onInit() {
    try {
      if (this.#file.exists()) {
        this.#cacheRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.#file.readProps()), sys.Type.find("[sys::Str:sys::Str]")));
      }
      ;
    }
    catch ($_u17) {
      $_u17 = sys.Err.make($_u17);
      if ($_u17 instanceof sys.Err) {
        let e = $_u17;
        ;
        this.#log.err(sys.Str.plus("Failed to load ", this.#file), e);
      }
      else {
        throw $_u17;
      }
    }
    ;
    return "init";
  }

  onSet(key,val) {
    let newCache = this.cache().dup();
    if (val != null) {
      newCache.set(key, sys.ObjUtil.coerce(val, sys.Str.type$));
    }
    else {
      newCache.remove(key);
    }
    ;
    return this.update(newCache);
  }

  onWriteBuf(buf) {
    return this.update(buf.in().readProps());
  }

  update(newCache) {
    this.#cacheRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(newCache), sys.Type.find("[sys::Str:sys::Str]")));
    let out = this.#file.out();
    try {
      this.#file.writeProps(newCache);
    }
    catch ($_u18) {
      $_u18 = sys.Err.make($_u18);
      if ($_u18 instanceof sys.Err) {
        let e = $_u18;
        ;
        this.#log.err(sys.Str.plus("Failed to save ", this.#file), e);
      }
      else {
        throw $_u18;
      }
    }
    finally {
      out.close();
    }
    ;
    return "updated";
  }

  static msg(type,a,b) {
    if (a === undefined) a = null;
    if (b === undefined) b = null;
    return PasswordStoreMsg.make(type, a, b);
  }

  static encode(password) {
    const this$ = this;
    if (sys.ObjUtil.compareLT(sys.Str.size(password), 10)) {
      password = sys.Str.plus(password, sys.Str.plus("\u0000", sys.Str.spaces(sys.Int.minus(10, sys.Str.size(password)))));
    }
    ;
    let buf = sys.Buf.make();
    let rs = PasswordStore.rands().size();
    let x = sys.Int.random(sys.Range.make(0, rs, true));
    let y = sys.Int.random(sys.Range.make(0, rs, true));
    let z = sys.Int.random(sys.Range.make(0, rs, true));
    buf.write(108);
    buf.write(x);
    buf.write(y);
    buf.write(z);
    sys.Str.each(password, (ch,i) => {
      if (sys.ObjUtil.compareGT(ch, 16383)) {
        throw sys.IOErr.make("Unsupported unicode chars");
      }
      ;
      let mask = sys.Int.xor(sys.Int.xor(PasswordStore.rands().get(sys.Int.mod(sys.Int.plus(x, i), rs)), PasswordStore.rands().get(sys.Int.mod(sys.Int.plus(y, i), rs))), PasswordStore.rands().get(sys.Int.mod(sys.Int.plus(z, i), rs)));
      buf.writeI2(sys.Int.and(sys.Int.xor(sys.Int.shiftl(ch, 2), mask), 65535));
      return;
    });
    return buf.toBase64();
  }

  static decode(password) {
    let buf = sys.Buf.fromBase64(password);
    if (sys.ObjUtil.compareNE(buf.readU1(), 108)) {
      throw sys.IOErr.make("bad password");
    }
    ;
    let rs = PasswordStore.rands().size();
    let x = buf.readU1();
    let y = buf.readU1();
    let z = buf.readU1();
    let s = sys.StrBuf.make();
    while (buf.more()) {
      let i = s.size();
      let mask = sys.Int.xor(sys.Int.xor(PasswordStore.rands().get(sys.Int.mod(sys.Int.plus(x, i), rs)), PasswordStore.rands().get(sys.Int.mod(sys.Int.plus(y, i), rs))), PasswordStore.rands().get(sys.Int.mod(sys.Int.plus(z, i), rs)));
      let ch = sys.Int.and(sys.Int.shiftr(sys.Int.xor(buf.readU2(), mask), 2), 16383);
      if (sys.ObjUtil.equals(ch, 0)) {
        break;
      }
      ;
      s.addChar(ch);
    }
    ;
    return s.toStr();
    return "";
  }

  cache() {
    return sys.ObjUtil.coerce(this.#cacheRef.val(), sys.Type.find("[sys::Str:sys::Str]"));
  }

  static static$init() {
    PasswordStore.#rands = sys.ObjUtil.coerce(((this$) => { let $_u19 = sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(-8424197955127778879, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-3490751530244947321, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-3756814336815756546, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-7633434407529788736, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(479059926652987677, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3378186269282849611, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(436354850448062002, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2352768397007011722, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(299757901745910723, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(6099822295971229762, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-1718136137164216779, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4233063720761130250, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-4062490847779596792, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3198210267979328836, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-3012146189774838148, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(7542718147880808573, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-1882003276665306733, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2533345967220341803, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1332551985372522256, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(9216977809401225811, sys.Obj.type$.toNullable())]); if ($_u19 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(-8424197955127778879, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-3490751530244947321, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-3756814336815756546, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-7633434407529788736, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(479059926652987677, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3378186269282849611, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(436354850448062002, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2352768397007011722, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(299757901745910723, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(6099822295971229762, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-1718136137164216779, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4233063720761130250, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-4062490847779596792, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3198210267979328836, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-3012146189774838148, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(7542718147880808573, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-1882003276665306733, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2533345967220341803, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1332551985372522256, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(9216977809401225811, sys.Obj.type$.toNullable())])); })(this), sys.Type.find("sys::Int[]"));
    PasswordStore.#timeout = sys.Duration.fromStr("15sec");
    return;
  }

}

class PasswordStoreMsgType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PasswordStoreMsgType.type$; }

  static init() { return PasswordStoreMsgType.vals().get(0); }

  static sync() { return PasswordStoreMsgType.vals().get(1); }

  static set() { return PasswordStoreMsgType.vals().get(2); }

  static remove() { return PasswordStoreMsgType.vals().get(3); }

  static writeBuf() { return PasswordStoreMsgType.vals().get(4); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new PasswordStoreMsgType();
    PasswordStoreMsgType.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(PasswordStoreMsgType.type$, PasswordStoreMsgType.vals(), name$, checked);
  }

  static vals() {
    if (PasswordStoreMsgType.#vals == null) {
      PasswordStoreMsgType.#vals = sys.List.make(PasswordStoreMsgType.type$, [
        PasswordStoreMsgType.make(0, "init", ),
        PasswordStoreMsgType.make(1, "sync", ),
        PasswordStoreMsgType.make(2, "set", ),
        PasswordStoreMsgType.make(3, "remove", ),
        PasswordStoreMsgType.make(4, "writeBuf", ),
      ]).toImmutable();
    }
    return PasswordStoreMsgType.#vals;
  }

  static static$init() {
    const $_u20 = PasswordStoreMsgType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class PasswordStoreMsg extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PasswordStoreMsg.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #a = null;

  a() { return this.#a; }

  __a(it) { if (it === undefined) return this.#a; else this.#a = it; }

  #b = null;

  b() { return this.#b; }

  __b(it) { if (it === undefined) return this.#b; else this.#b = it; }

  static make(type,a,b) {
    const $self = new PasswordStoreMsg();
    PasswordStoreMsg.make$($self,type,a,b);
    return $self;
  }

  static make$($self,type,a,b) {
    $self.#type = type;
    $self.#a = ((this$) => { let $_u21 = a; if ($_u21 == null) return null; return sys.ObjUtil.toImmutable(a); })($self);
    $self.#b = ((this$) => { let $_u22 = b; if ($_u22 == null) return null; return sys.ObjUtil.toImmutable(b); })($self);
    return;
  }

}

class FolioUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FolioUtil.type$; }

  static #maxRecIdSize = undefined;

  static maxRecIdSize() {
    if (FolioUtil.#maxRecIdSize === undefined) {
      FolioUtil.static$init();
      if (FolioUtil.#maxRecIdSize === undefined) FolioUtil.#maxRecIdSize = 0;
    }
    return FolioUtil.#maxRecIdSize;
  }

  static #maxTagSize = undefined;

  static maxTagSize() {
    if (FolioUtil.#maxTagSize === undefined) {
      FolioUtil.static$init();
      if (FolioUtil.#maxTagSize === undefined) FolioUtil.#maxTagSize = 0;
    }
    return FolioUtil.#maxTagSize;
  }

  static #maxUriSize = undefined;

  static maxUriSize() {
    if (FolioUtil.#maxUriSize === undefined) {
      FolioUtil.static$init();
      if (FolioUtil.#maxUriSize === undefined) FolioUtil.#maxUriSize = 0;
    }
    return FolioUtil.#maxUriSize;
  }

  static #maxStrSize = undefined;

  static maxStrSize() {
    if (FolioUtil.#maxStrSize === undefined) {
      FolioUtil.static$init();
      if (FolioUtil.#maxStrSize === undefined) FolioUtil.#maxStrSize = 0;
    }
    return FolioUtil.#maxStrSize;
  }

  static #hisMinYear = undefined;

  static hisMinYear() {
    if (FolioUtil.#hisMinYear === undefined) {
      FolioUtil.static$init();
      if (FolioUtil.#hisMinYear === undefined) FolioUtil.#hisMinYear = 0;
    }
    return FolioUtil.#hisMinYear;
  }

  static #hisMinDate = undefined;

  static hisMinDate() {
    if (FolioUtil.#hisMinDate === undefined) {
      FolioUtil.static$init();
      if (FolioUtil.#hisMinDate === undefined) FolioUtil.#hisMinDate = null;
    }
    return FolioUtil.#hisMinDate;
  }

  static #hisMinTs = undefined;

  static hisMinTs() {
    if (FolioUtil.#hisMinTs === undefined) {
      FolioUtil.static$init();
      if (FolioUtil.#hisMinTs === undefined) FolioUtil.#hisMinTs = null;
    }
    return FolioUtil.#hisMinTs;
  }

  static checkRecId(id) {
    let s = id.id();
    if ((sys.ObjUtil.equals(sys.Str.getSafe(s, 1), 46) && sys.Int.isUpper(sys.Str.get(s, 0)))) {
      throw InvalidRecIdErr.make(sys.Str.plus("Cannot use Niagara id: ", s));
    }
    ;
    if (sys.ObjUtil.compareGT(sys.Str.size(s), FolioUtil.maxRecIdSize())) {
      throw InvalidRecIdErr.make(sys.Str.plus("Id too long: ", s));
    }
    ;
    if (sys.Str.contains(s, ":")) {
      throw InvalidRecIdErr.make(sys.Str.plus("Id cannot contain colon: ", s));
    }
    ;
    return;
  }

  static checkTagName(name) {
    if (!haystack.Etc.isTagName(name)) {
      throw InvalidTagNameErr.make(sys.Str.plus("Invalid tag name chars: ", name));
    }
    ;
    if (sys.ObjUtil.compareGT(sys.Str.size(name), FolioUtil.maxTagSize())) {
      throw InvalidTagNameErr.make(sys.Str.plus("Tag too long: ", name));
    }
    ;
    return;
  }

  static checkTagVal(name,val) {
    const this$ = this;
    if (val == null) {
      throw InvalidTagValErr.make(sys.Str.plus("Tag cannot be null: ", name));
    }
    ;
    let kind = ((this$) => { let $_u23 = haystack.Kind.fromVal(val, false); if ($_u23 != null) return $_u23; throw InvalidTagValErr.make(sys.Str.plus("Unsupported tag type: ", sys.ObjUtil.typeof(val))); })(this);
    if (!kind.canStore()) {
      throw InvalidTagValErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unsupported tag type: ", sys.ObjUtil.typeof(val)), " ["), kind), "]"));
    }
    ;
    if (kind.isList()) {
      sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).each((x) => {
        FolioUtil.checkTagVal("", x);
        return;
      });
    }
    else {
      if (kind.isDict()) {
        sys.ObjUtil.coerce(val, haystack.Dict.type$).each((x) => {
          FolioUtil.checkTagVal("", x);
          return;
        });
      }
      ;
    }
    ;
    if ((kind === haystack.Kind.str() && sys.ObjUtil.compareGT(sys.Str.size(sys.ObjUtil.toStr(val)), FolioUtil.maxStrSize()))) {
      throw InvalidTagValErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Tag '", name), "' has Str value > "), sys.ObjUtil.coerce(FolioUtil.maxStrSize(), sys.Obj.type$.toNullable())), " chars"));
    }
    ;
    if ((kind === haystack.Kind.uri() && sys.ObjUtil.compareGT(sys.Str.size(sys.ObjUtil.toStr(val)), FolioUtil.maxUriSize()))) {
      throw InvalidTagValErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Tag '", name), "' Uri value > "), sys.ObjUtil.coerce(FolioUtil.maxUriSize(), sys.Obj.type$.toNullable())), " chars"));
    }
    ;
    if (sys.ObjUtil.equals(name, "name")) {
      if (sys.ObjUtil.is(val, sys.Str.type$)) {
        if ((!haystack.Etc.isTagName(sys.ObjUtil.coerce(val, sys.Str.type$)) && !haystack.Etc.isTagName(sys.Str.replace(sys.ObjUtil.toStr(val), ".", "_")))) {
          throw InvalidTagValErr.make(sys.Str.plus("Invalid 'name' tag value ", sys.ObjUtil.trap(val,"toCode", sys.List.make(sys.Obj.type$.toNullable(), []))));
        }
        ;
      }
      else {
        if (!sys.ObjUtil.is(val, haystack.Remove.type$)) {
          throw InvalidTagValErr.make("Tag 'name' must be a Str");
        }
        ;
      }
      ;
    }
    ;
    return sys.ObjUtil.coerce(kind, haystack.Kind.type$);
  }

  static checkDiffs(diffs) {
    const this$ = this;
    if (sys.ObjUtil.equals(diffs.size(), 0)) {
      throw DiffErr.make("No diffs to commit");
    }
    ;
    if (sys.ObjUtil.equals(diffs.size(), 1)) {
      return;
    }
    ;
    let dups = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("folio::Diff"));
    let transient = diffs.first().isTransient();
    diffs.each((diff) => {
      if (sys.ObjUtil.compareNE(diff.isTransient(), transient)) {
        throw DiffErr.make("Cannot mix transient and persistent diffs");
      }
      ;
      if (dups.get(diff.id()) != null) {
        throw DiffErr.make(sys.Str.plus("Duplicate diffs for ", diff.id()));
      }
      ;
      dups.set(diff.id(), diff);
      return;
    });
    return;
  }

  static stripUncommittable(folio,d,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    if (opts == null) {
      (opts = haystack.Etc.emptyDict());
    }
    ;
    let transients = haystack.Etc.emptyDict();
    if (d.has("id")) {
      (transients = sys.ObjUtil.coerce(((this$) => { let $_u24 = folio.readByIdTransientTags(d.id(), false); if ($_u24 != null) return $_u24; return haystack.Etc.emptyDict(); })(this), haystack.Dict.type$));
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    d.each((v,n) => {
      if (transients.has(n)) {
        return;
      }
      ;
      if ((sys.ObjUtil.equals(n, "mod") && opts.has("mod"))) {
        acc.set(n, v);
        return;
      }
      ;
      if (DiffTagRule.isUncommittable(n)) {
        return;
      }
      ;
      if ((sys.ObjUtil.equals(n, "id") && opts.get("id") === haystack.Remove.val())) {
        return;
      }
      ;
      acc.set(n, v);
      return;
    });
    return haystack.Etc.makeDict(acc);
  }

  static isUncommittable(name) {
    return DiffTagRule.isUncommittable(name);
  }

  static tagsToNeverIndex() {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    acc.addList(sys.List.make(sys.Str.type$, ["id", "mod", "trash"]));
    DiffTagRule.rules().each((r,n) => {
      if ((r.type() === DiffTagRuleType.transientOnly() || r.type() === DiffTagRuleType.never())) {
        acc.set(n, n);
      }
      ;
      return;
    });
    return acc;
  }

  static tagsToNeverLearn() {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    acc.addList(sys.List.make(sys.Str.type$, ["navId", "disMacro", "navName", "cur", "his", "writable", "hisCollectInterval", "hisCollectCov"]));
    DiffTagRule.rules().each((r,n) => {
      if ((r.type() === DiffTagRuleType.transientOnly() || r.type() === DiffTagRuleType.never())) {
        acc.set(n, n);
      }
      ;
      return;
    });
    return acc;
  }

  static hisTz(rec,checked) {
    if (checked === undefined) checked = true;
    let val = rec.get("tz");
    if (val == null) {
      if (checked) {
        throw HisConfigErr.make(rec, "Missing 'tz' tag");
      }
      ;
      return null;
    }
    ;
    let str = sys.ObjUtil.as(val, sys.Str.type$);
    if (str == null) {
      if (checked) {
        throw HisConfigErr.make(rec, sys.Str.plus("Invalid type for 'tz' tag: ", sys.ObjUtil.typeof(val)));
      }
      ;
      return null;
    }
    ;
    let tz = sys.TimeZone.fromStr(sys.ObjUtil.coerce(str, sys.Str.type$), false);
    if (tz == null) {
      if (checked) {
        throw HisConfigErr.make(rec, sys.Str.plus("Invalid 'tz' tag: ", str));
      }
      ;
      return null;
    }
    ;
    return tz;
  }

  static hisKind(rec,checked) {
    if (checked === undefined) checked = true;
    let val = rec.get("kind");
    if (val == null) {
      if (checked) {
        throw HisConfigErr.make(rec, "Missing 'kind' tag");
      }
      ;
      return null;
    }
    ;
    let str = sys.ObjUtil.as(val, sys.Str.type$);
    if (str == null) {
      if (checked) {
        throw HisConfigErr.make(rec, sys.Str.plus("Invalid type for 'kind' tag: ", sys.ObjUtil.typeof(val)));
      }
      ;
      return null;
    }
    ;
    let kind = haystack.Kind.fromStr(sys.ObjUtil.coerce(str, sys.Str.type$), false);
    if (kind == null) {
      if (checked) {
        throw HisConfigErr.make(rec, sys.Str.plus("Invalid 'kind' tag: ", str));
      }
      ;
      return null;
    }
    ;
    if (!FolioUtil.isHisKind(sys.ObjUtil.coerce(kind, haystack.Kind.type$))) {
      if (checked) {
        throw HisConfigErr.make(rec, sys.Str.plus("Unsupported 'kind' for his: ", kind));
      }
      ;
      return null;
    }
    ;
    return kind;
  }

  static hisUnit(rec,checked) {
    if (checked === undefined) checked = true;
    let val = rec.get("unit");
    if (val == null) {
      return null;
    }
    ;
    let str = sys.ObjUtil.as(val, sys.Str.type$);
    if (str == null) {
      if (checked) {
        throw HisConfigErr.make(rec, sys.Str.plus("Invalid type for 'unit' tag: ", sys.ObjUtil.typeof(val)));
      }
      ;
      return null;
    }
    ;
    let unit = haystack.Number.loadUnit(sys.ObjUtil.coerce(str, sys.Str.type$), false);
    if (unit == null) {
      if (checked) {
        throw HisConfigErr.make(rec, sys.Str.plus("Invalid 'unit' tag: ", str));
      }
      ;
      return null;
    }
    ;
    return unit;
  }

  static hisTsPrecision(rec,checked) {
    if (checked === undefined) checked = true;
    let val = rec.get("hisTsPrecision");
    if (val == null) {
      return sys.Duration.fromStr("1sec");
    }
    ;
    let num = sys.ObjUtil.as(val, haystack.Number.type$);
    if (num == null) {
      if (checked) {
        throw HisConfigErr.make(rec, sys.Str.plus("Invalid type for hisTsPrecision: ", sys.ObjUtil.typeof(val).name()));
      }
      ;
      return null;
    }
    ;
    let dur = num.toDuration(false);
    if (sys.ObjUtil.equals(dur, sys.Duration.fromStr("1ms"))) {
      return sys.Duration.fromStr("1ms");
    }
    ;
    if (sys.ObjUtil.equals(dur, sys.Duration.fromStr("1sec"))) {
      return sys.Duration.fromStr("1sec");
    }
    ;
    if (checked) {
      throw HisConfigErr.make(rec, sys.Str.plus("Unsupported hisTsPrecision: ", num));
    }
    ;
    return null;
  }

  static isHisKind(kind) {
    return (kind === haystack.Kind.number() || kind === haystack.Kind.bool() || kind === haystack.Kind.str() || kind === haystack.Kind.coord());
  }

  static hisWriteCheck(rec,items,opts) {
    if (opts === undefined) opts = haystack.Etc.emptyDict();
    let forecast = opts.has("forecast");
    let clip = sys.ObjUtil.as(opts.get("clip"), haystack.Span.type$);
    let unitSet = opts.has("unitSet");
    if (rec.get("point") !== haystack.Marker.val()) {
      throw HisConfigErr.make(rec, "Rec missing 'point' tag");
    }
    ;
    if (rec.get("his") !== haystack.Marker.val()) {
      throw HisConfigErr.make(rec, "Rec missing 'his' tag");
    }
    ;
    if (rec.has("aux")) {
      throw HisConfigErr.make(rec, "Rec marked as 'aux'");
    }
    ;
    if (rec.has("trash")) {
      throw HisConfigErr.make(rec, "Rec marked as 'trash'");
    }
    ;
    let kind = FolioUtil.hisKind(rec);
    let tz = FolioUtil.hisTz(rec);
    let unit = FolioUtil.hisUnit(rec);
    let tsPrecision = FolioUtil.hisTsPrecision(rec);
    let isNumber = kind === haystack.Kind.number();
    let sorted = true;
    for (let i = 1; sys.ObjUtil.compareLT(i, items.size()); i = sys.Int.increment(i)) {
      if (sys.ObjUtil.compareGT(items.get(sys.Int.minus(i, 1)).ts(), items.get(i).ts())) {
        (sorted = false);
      }
      ;
    }
    ;
    if (!sorted) {
      (items = items.dup().sort());
    }
    ;
    let acc = sys.List.make(haystack.HisItem.type$);
    acc.capacity(items.size());
    for (let i = 0; sys.ObjUtil.compareLT(i, items.size()); i = sys.Int.increment(i)) {
      let item = items.get(i);
      if (item.ts().tz() !== tz) {
        throw HisWriteErr.make(rec, sys.Str.plus(sys.Str.plus(sys.Str.plus("Mismatched timezone, rec tz ", sys.Str.toCode(tz.name())), " != item tz "), sys.Str.toCode(item.ts().tz().name())));
      }
      ;
      if (sys.ObjUtil.compareLT(item.ts().year(), FolioUtil.hisMinYear())) {
        throw HisWriteErr.make(rec, sys.Str.plus(sys.Str.plus(sys.Str.plus("Timestamps before ", sys.ObjUtil.coerce(FolioUtil.hisMinYear(), sys.Obj.type$.toNullable())), " not supported: "), item));
      }
      ;
      let ts = item.ts().floor(sys.ObjUtil.coerce(tsPrecision, sys.Duration.type$));
      if ((clip != null && !clip.contains(ts))) {
        continue;
      }
      ;
      let val = item.val();
      if (val == null) {
        throw HisWriteErr.make(rec, "Cannot write null val");
      }
      ;
      if ((sys.ObjUtil.typeof(val) !== kind.type() && val !== haystack.NA.val() && val !== haystack.Remove.val())) {
        throw HisWriteErr.make(rec, sys.Str.plus(sys.Str.plus(sys.Str.plus("Mismatched value type, rec kind ", sys.Str.toCode(kind.name())), " != item type "), sys.Str.toCode(sys.ObjUtil.typeof(val).qname())));
      }
      ;
      if ((isNumber && sys.ObjUtil.is(val, haystack.Number.type$))) {
        let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
        if (num.unit() == null) {
          if ((unitSet && unit != null)) {
            (val = (num = haystack.Number.make(num.toFloat(), unit)));
          }
          ;
        }
        else {
          if (sys.ObjUtil.compareNE(num.unit(), unit)) {
            throw HisWriteErr.make(rec, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Mismatched unit, rec unit '", unit), "' != item unit '"), num.unit()), "'"));
          }
          ;
        }
        ;
        if (!num.isInt()) {
          let f1 = num.toFloat();
          let f2 = sys.Float.makeBits32(sys.Float.bits32(f1));
          if (sys.ObjUtil.compareNE(f1, f2)) {
            (val = haystack.Number.make(f2, num.unit()));
          }
          ;
        }
        else {
          if (sys.Float.isNegZero(num.toFloat())) {
            (val = haystack.Number.make(sys.Float.normNegZero(num.toFloat()), num.unit()));
          }
          ;
        }
        ;
        if ((forecast && sys.ObjUtil.compareNE(num.unit(), unit))) {
          (val = haystack.Number.make(num.toFloat(), unit));
        }
        ;
      }
      ;
      let newItem = haystack.HisItem.make(ts, val);
      if ((!acc.isEmpty() && sys.ObjUtil.equals(acc.last().ts(), ts))) {
        acc.set(-1, newItem);
      }
      else {
        acc.add(newItem);
      }
      ;
    }
    ;
    return acc;
  }

  static hisWriteMerge(cur,changes) {
    const this$ = this;
    if (changes.isEmpty()) {
      return cur.dup();
    }
    ;
    if (cur.isEmpty()) {
      return changes.findAll((item) => {
        return item.val() !== haystack.Remove.val();
      });
    }
    ;
    let acc = sys.List.make(haystack.HisItem.type$);
    let ax = cur;
    let a = cur.first();
    let ai = 0;
    let bx = changes;
    let b = changes.first();
    let bi = 0;
    while (true) {
      if (sys.ObjUtil.compareLT(a.ts(), b.ts())) {
        acc.add(sys.ObjUtil.coerce(a, haystack.HisItem.type$));
        ((this$) => { let $_u25 = ai;ai = sys.Int.increment(ai); return $_u25; })(this);
        if (sys.ObjUtil.compareGE(ai, ax.size())) {
          break;
        }
        ;
        (a = ax.get(ai));
      }
      else {
        if (sys.ObjUtil.compareGT(a.ts(), b.ts())) {
          if (b.val() !== haystack.Remove.val()) {
            acc.add(sys.ObjUtil.coerce(b, haystack.HisItem.type$));
          }
          ;
          ((this$) => { let $_u26 = bi;bi = sys.Int.increment(bi); return $_u26; })(this);
          if (sys.ObjUtil.compareGE(bi, bx.size())) {
            break;
          }
          ;
          (b = bx.get(bi));
        }
        else {
          if (b.val() !== haystack.Remove.val()) {
            acc.add(sys.ObjUtil.coerce(b, haystack.HisItem.type$));
          }
          ;
          ((this$) => { let $_u27 = ai;ai = sys.Int.increment(ai); return $_u27; })(this);
          ((this$) => { let $_u28 = bi;bi = sys.Int.increment(bi); return $_u28; })(this);
          if (sys.ObjUtil.compareGE(ai, ax.size())) {
            break;
          }
          ;
          (a = ax.get(ai));
          if (sys.ObjUtil.compareGE(bi, bx.size())) {
            break;
          }
          ;
          (b = bx.get(bi));
        }
        ;
      }
      ;
    }
    ;
    while (sys.ObjUtil.compareLT(ai, ax.size())) {
      (a = ax.get(((this$) => { let $_u29 = ai;ai = sys.Int.increment(ai); return $_u29; })(this)));
      acc.add(sys.ObjUtil.coerce(a, haystack.HisItem.type$));
    }
    ;
    while (sys.ObjUtil.compareLT(bi, bx.size())) {
      (b = bx.get(((this$) => { let $_u30 = bi;bi = sys.Int.increment(bi); return $_u30; })(this)));
      if (b.val() !== haystack.Remove.val()) {
        acc.add(sys.ObjUtil.coerce(b, haystack.HisItem.type$));
      }
      ;
    }
    ;
    return acc;
  }

  static make() {
    const $self = new FolioUtil();
    FolioUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    FolioUtil.#maxRecIdSize = 60;
    FolioUtil.#maxTagSize = 60;
    FolioUtil.#maxUriSize = 1000;
    FolioUtil.#maxStrSize = 32767;
    FolioUtil.#hisMinYear = 1950;
    FolioUtil.#hisMinDate = sys.ObjUtil.coerce(sys.Date.make(FolioUtil.#hisMinYear, sys.Month.jan(), 1), sys.Date.type$);
    FolioUtil.#hisMinTs = FolioUtil.#hisMinDate.midnight(sys.TimeZone.utc());
    return;
  }

}

class DiffTagRule extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DiffTagRule.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #diffFlags = 0;

  diffFlags() { return this.#diffFlags; }

  __diffFlags(it) { if (it === undefined) return this.#diffFlags; else this.#diffFlags = it; }

  static #rules = undefined;

  static rules() {
    if (DiffTagRule.#rules === undefined) {
      DiffTagRule.static$init();
      if (DiffTagRule.#rules === undefined) DiffTagRule.#rules = null;
    }
    return DiffTagRule.#rules;
  }

  static make(type,diffFlags) {
    const $self = new DiffTagRule();
    DiffTagRule.make$($self,type,diffFlags);
    return $self;
  }

  static make$($self,type,diffFlags) {
    $self.#type = type;
    $self.#diffFlags = diffFlags;
    return;
  }

  static check(diff,name,kind,val) {
    if ((kind === haystack.Kind.bin() && diff.isTransient())) {
      throw DiffErr.make("Bin tag cannot be transient");
    }
    ;
    let rule = DiffTagRule.rules().get(name);
    if (rule == null) {
      return 0;
    }
    ;
    let $_u31 = rule.#type;
    if (sys.ObjUtil.equals($_u31, DiffTagRuleType.never())) {
      throw DiffErr.make(sys.Str.plus("Cannot set tag: ", sys.Str.toCode(name)));
    }
    else if (sys.ObjUtil.equals($_u31, DiffTagRuleType.restricted())) {
      DiffTagRule.checkRestricted(diff, name, kind, val);
    }
    else if (sys.ObjUtil.equals($_u31, DiffTagRuleType.transientOnly())) {
      if (!diff.isTransient()) {
        throw DiffErr.make(sys.Str.plus("Cannot set tag persistently: ", sys.Str.toCode(name)));
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u31, DiffTagRuleType.persistentOnly())) {
      if (diff.isTransient()) {
        throw DiffErr.make(sys.Str.plus("Cannot set tag transiently: ", sys.Str.toCode(name)));
      }
      ;
    }
    ;
    return rule.#diffFlags;
  }

  static isUncommittable(name) {
    let rule = DiffTagRule.rules().get(name);
    if (rule == null) {
      return false;
    }
    ;
    if (rule.#type === DiffTagRuleType.transientOnly()) {
      return true;
    }
    ;
    if (rule.#type === DiffTagRuleType.never()) {
      if (sys.ObjUtil.equals(name, "id")) {
        return false;
      }
      ;
      return true;
    }
    ;
    return false;
  }

  static checkRestricted(diff,name,kind,val) {
    if (diff.isBypassRestricted()) {
      return;
    }
    ;
    if (diff.isAdd()) {
      throw DiffErr.make(sys.Str.plus("Cannot add rec with restricted tag: ", sys.Str.toCode(name)));
    }
    ;
    if (val === haystack.Remove.val()) {
      throw DiffErr.make(sys.Str.plus("Cannot remove restricted tag: ", sys.Str.toCode(name)));
    }
    ;
    throw DiffErr.make(sys.Str.plus("Cannot set restricted tag: ", sys.Str.toCode(name)));
  }

  static static$init() {
    if (true) {
      let never = DiffTagRule.make(DiffTagRuleType.never(), 0);
      let restricted = DiffTagRule.make(DiffTagRuleType.restricted(), 0);
      let persistentOnly = DiffTagRule.make(DiffTagRuleType.persistentOnly(), 0);
      let transientOnly = DiffTagRule.make(DiffTagRuleType.transientOnly(), 0);
      let curVal = DiffTagRule.make(DiffTagRuleType.transientOnly(), Diff.curVal());
      let point = DiffTagRule.make(DiffTagRuleType.persistentOnly(), Diff.point());
      DiffTagRule.#rules = sys.ObjUtil.coerce(((this$) => { let $_u32 = sys.Map.__fromLiteral(["id","mod","transient","projMeta","uiMeta","ext","conn","dis","disMacro","equip","navName","point","site","trash","connState","connStatus","connErr","curVal","curStatus","curErr","curSource","writeVal","writeLevel","writeStatus","writeErr","nextTime","nextVal","hisStatus","hisErr","hisId","hisSize","hisStart","hisStartVal","hisEnd","hisEndVal","userFailedLogins"], [never,never,never,restricted,restricted,restricted,persistentOnly,persistentOnly,persistentOnly,persistentOnly,persistentOnly,point,persistentOnly,persistentOnly,transientOnly,transientOnly,transientOnly,curVal,curVal,transientOnly,transientOnly,transientOnly,transientOnly,transientOnly,transientOnly,transientOnly,transientOnly,transientOnly,transientOnly,never,never,never,never,never,never,transientOnly], sys.Type.find("sys::Str"), sys.Type.find("folio::DiffTagRule")); if ($_u32 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["id","mod","transient","projMeta","uiMeta","ext","conn","dis","disMacro","equip","navName","point","site","trash","connState","connStatus","connErr","curVal","curStatus","curErr","curSource","writeVal","writeLevel","writeStatus","writeErr","nextTime","nextVal","hisStatus","hisErr","hisId","hisSize","hisStart","hisStartVal","hisEnd","hisEndVal","userFailedLogins"], [never,never,never,restricted,restricted,restricted,persistentOnly,persistentOnly,persistentOnly,persistentOnly,persistentOnly,point,persistentOnly,persistentOnly,transientOnly,transientOnly,transientOnly,curVal,curVal,transientOnly,transientOnly,transientOnly,transientOnly,transientOnly,transientOnly,transientOnly,transientOnly,transientOnly,transientOnly,never,never,never,never,never,never,transientOnly], sys.Type.find("sys::Str"), sys.Type.find("folio::DiffTagRule"))); })(this), sys.Type.find("[sys::Str:folio::DiffTagRule]"));
    }
    ;
    return;
  }

}

class DiffTagRuleType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DiffTagRuleType.type$; }

  static never() { return DiffTagRuleType.vals().get(0); }

  static restricted() { return DiffTagRuleType.vals().get(1); }

  static persistentOnly() { return DiffTagRuleType.vals().get(2); }

  static transientOnly() { return DiffTagRuleType.vals().get(3); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new DiffTagRuleType();
    DiffTagRuleType.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(DiffTagRuleType.type$, DiffTagRuleType.vals(), name$, checked);
  }

  static vals() {
    if (DiffTagRuleType.#vals == null) {
      DiffTagRuleType.#vals = sys.List.make(DiffTagRuleType.type$, [
        DiffTagRuleType.make(0, "never", ),
        DiffTagRuleType.make(1, "restricted", ),
        DiffTagRuleType.make(2, "persistentOnly", ),
        DiffTagRuleType.make(3, "transientOnly", ),
      ]).toImmutable();
    }
    return DiffTagRuleType.#vals;
  }

  static static$init() {
    const $_u33 = DiffTagRuleType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class FolioHis {
  constructor() {
    const this$ = this;
  }

  typeof() { return FolioHis.type$; }

}

class FolioFlatFile extends Folio {
  constructor() {
    super();
    const this$ = this;
    this.#curVerRef = concurrent.AtomicInt.make(1);
    return;
  }

  typeof() { return FolioFlatFile.type$; }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #passwords = null;

  passwords() { return this.#passwords; }

  __passwords(it) { if (it === undefined) return this.#passwords; else this.#passwords = it; }

  #actor = null;

  // private field reflection only
  __actor(it) { if (it === undefined) return this.#actor; else this.#actor = it; }

  #curVerRef = null;

  // private field reflection only
  __curVerRef(it) { if (it === undefined) return this.#curVerRef; else this.#curVerRef = it; }

  #flushMode = null;

  flushMode(it) {
    if (it === undefined) {
      return "fsync";
    }
    else {
      throw sys.UnsupportedErr.make("flushMode");
    }
  }

  #map = null;

  map() { return this.#map; }

  __map(it) { if (it === undefined) return this.#map; else this.#map = it; }

  static open(config) {
    let file = config.dir().plus(sys.Uri.fromStr("folio.trio"));
    try {
      let map = FolioFlatFileLoader.make(config, file).load();
      return FolioFlatFile.make(config, file, map);
    }
    catch ($_u34) {
      $_u34 = sys.Err.make($_u34);
      if ($_u34 instanceof sys.Err) {
        let e = $_u34;
        ;
        throw sys.Err.make(sys.Str.plus("Cannot open folio: ", file), e);
      }
      else {
        throw $_u34;
      }
    }
    ;
  }

  static make(config,file,map) {
    const $self = new FolioFlatFile();
    FolioFlatFile.make$($self,config,file,map);
    return $self;
  }

  static make$($self,config,file,map) {
    const this$ = $self;
    Folio.make$($self, config);
    ;
    $self.#file = file;
    $self.#map = map;
    $self.#passwords = PasswordStore.open($self.dir().plus(sys.Uri.fromStr("passwords.props")), config);
    $self.#actor = concurrent.Actor.make(config.pool(), (msg) => {
      return this$.onReceive(sys.ObjUtil.coerce(msg, FolioFlatFileMsg.type$));
    });
    return;
  }

  curVer() {
    return this.#curVerRef.val();
  }

  flush() {
    return;
  }

  doCloseAsync() {
    return sys.ObjUtil.coerce(FolioFuture.makeSync(CountFolioRes.make(0)), FolioFuture.type$);
  }

  doReadByIds(ids) {
    const this$ = this;
    let map = this.#map;
    let acc = sys.List.make(haystack.Dict.type$.toNullable());
    let errMsg = "";
    let dicts = sys.List.make(haystack.Dict.type$.toNullable());
    dicts.size(ids.size());
    ids.each((id,i) => {
      let rec = sys.ObjUtil.as(map.get(id), haystack.Dict.type$);
      if ((rec == null && id.isRel() && this$.idPrefix() != null)) {
        (rec = sys.ObjUtil.coerce(map.get(id.toAbs(sys.ObjUtil.coerce(this$.idPrefix(), sys.Str.type$))), haystack.Dict.type$.toNullable()));
      }
      ;
      if ((rec != null && rec.missing("trash"))) {
        dicts.set(i, rec);
      }
      else {
        if (sys.Str.isEmpty(errMsg)) {
          (errMsg = id.toStr());
        }
        ;
      }
      ;
      return;
    });
    let errs = !sys.Str.isEmpty(errMsg);
    return sys.ObjUtil.coerce(FolioFuture.makeSync(ReadFolioRes.make(errMsg, errs, dicts)), FolioFuture.type$);
  }

  doReadAll(filter,opts) {
    const this$ = this;
    let errMsg = filter.toStr();
    let acc = sys.List.make(haystack.Dict.type$);
    this.doReadAllEachWhile(filter, opts, (rec) => {
      acc.add(rec);
      return null;
    });
    if ((opts != null && opts.has("sort"))) {
      (acc = haystack.Etc.sortDictsByDis(acc));
    }
    ;
    return sys.ObjUtil.coerce(FolioFuture.makeSync(ReadFolioRes.make(errMsg, false, acc)), FolioFuture.type$);
  }

  doReadCount(filter,opts) {
    const this$ = this;
    let count = 0;
    this.doReadAllEachWhile(filter, opts, () => {
      ((this$) => { let $_u35 = count;count = sys.Int.increment(count); return $_u35; })(this$);
      return;
    });
    return count;
  }

  doReadAllEachWhile(filter,opts,f) {
    const this$ = this;
    if (opts == null) {
      (opts = haystack.Etc.emptyDict());
    }
    ;
    let limit = ((this$) => { let $_u36 = ((this$) => { let $_u37 = sys.ObjUtil.as(opts.get("limit"), haystack.Number.type$); if ($_u37 == null) return null; return sys.ObjUtil.as(opts.get("limit"), haystack.Number.type$).toInt(); })(this$); if ($_u36 != null) return $_u36; return sys.ObjUtil.coerce(10000, sys.Int.type$.toNullable()); })(this);
    let skipTrash = opts.missing("trash");
    let map = this.#map;
    let cx = haystack.PatherContext.make((id) => {
      return sys.ObjUtil.coerce(map.get(id), haystack.Dict.type$.toNullable());
    });
    let count = 0;
    return this.eachWhile((rec) => {
      if (!filter.matches(rec, cx)) {
        return null;
      }
      ;
      if ((rec.has("trash") && skipTrash)) {
        return null;
      }
      ;
      ((this$) => { let $_u38 = count;count = sys.Int.increment(count); return $_u38; })(this$);
      let x = sys.Func.call(f, rec);
      if (x != null) {
        return x;
      }
      ;
      return ((this$) => { if (sys.ObjUtil.compareGE(count, limit)) return "break"; return null; })(this$);
    });
  }

  doCommitAllAsync(diffs,cxInfo) {
    (diffs = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(diffs), sys.Type.find("folio::Diff[]")));
    FolioUtil.checkDiffs(diffs);
    return sys.ObjUtil.coerce(FolioFuture.makeAsync(this.#actor.send(FolioFlatFileMsg.make("commit", diffs, cxInfo))), FolioFuture.type$);
  }

  his() {
    throw sys.UnsupportedErr.make();
  }

  backup() {
    throw sys.UnsupportedErr.make();
  }

  eachWhile(f) {
    return this.#map.eachWhile(sys.ObjUtil.coerce(f, sys.Type.find("|sys::Obj,sys::Obj->sys::Obj?|")));
  }

  each(f) {
    this.#map.each(sys.ObjUtil.coerce(f, sys.Type.find("|sys::Obj,sys::Obj->sys::Void|")));
    return;
  }

  onReceive(msg) {
    let $_u40 = msg.id();
    if (sys.ObjUtil.equals($_u40, "commit")) {
      return this.onCommit(sys.ObjUtil.coerce(msg.a(), sys.Type.find("folio::Diff[]")), msg.b());
    }
    else {
      throw sys.Err.make(sys.Str.plus("Invalid msg: ", msg));
    }
    ;
  }

  onCommit(diffs,cxInfo) {
    const this$ = this;
    let newMod = sys.DateTime.nowUtc(null);
    let commits = sys.List.make(FolioFlatFileCommit.type$);
    diffs.each((diff) => {
      let nm = ((this$) => { if (sys.ObjUtil.compareLE(newMod, diff.oldMod())) return diff.oldMod().plus(sys.Duration.fromStr("1ms")); return newMod; })(this$);
      commits.add(FolioFlatFileCommit.make(this$, diff, nm, cxInfo));
      return;
    });
    let hooks = this.hooks();
    commits.each((c) => {
      c.verify();
      hooks.preCommit(c.event());
      return;
    });
    (diffs = sys.ObjUtil.coerce(commits.map((c) => {
      return c.apply();
    }, Diff.type$), sys.Type.find("folio::Diff[]")));
    let map = this.#map;
    diffs.each((diff) => {
      if (diff.isRemove()) {
        map.remove(diff.id());
      }
      else {
        map.set(diff.id(), sys.ObjUtil.coerce(diff.newRec(), sys.Obj.type$));
      }
      ;
      return;
    });
    commits.each((c) => {
      hooks.postCommit(c.event());
      return;
    });
    if (!diffs.first().isTransient()) {
      this.#curVerRef.increment();
      this.saveToFile();
    }
    ;
    return CommitFolioRes.make(diffs);
  }

  saveToFile() {
    let recs = sys.ObjUtil.coerce(this.#map.vals(haystack.Dict.type$), sys.Type.find("haystack::Dict[]"));
    let out = this.#file.out();
    FolioFlatFileWriter.make(this, out).writeAllDicts(recs);
    out.sync().close();
    return;
  }

}

class FolioFlatFileMsg extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FolioFlatFileMsg.type$; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #a = null;

  a() { return this.#a; }

  __a(it) { if (it === undefined) return this.#a; else this.#a = it; }

  #b = null;

  b() { return this.#b; }

  __b(it) { if (it === undefined) return this.#b; else this.#b = it; }

  static make(id,a,b) {
    const $self = new FolioFlatFileMsg();
    FolioFlatFileMsg.make$($self,id,a,b);
    return $self;
  }

  static make$($self,id,a,b) {
    $self.#id = id;
    $self.#a = ((this$) => { let $_u42 = a; if ($_u42 == null) return null; return sys.ObjUtil.toImmutable(a); })($self);
    $self.#b = ((this$) => { let $_u43 = b; if ($_u43 == null) return null; return sys.ObjUtil.toImmutable(b); })($self);
    return;
  }

}

class FolioFlatFileLoader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#recs = sys.List.make(haystack.Dict.type$);
    this.#ids = sys.List.make(haystack.Ref.type$);
    this.#idsMap = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("haystack::Ref"));
    return;
  }

  typeof() { return FolioFlatFileLoader.type$; }

  #idPrefix = null;

  idPrefix() { return this.#idPrefix; }

  __idPrefix(it) { if (it === undefined) return this.#idPrefix; else this.#idPrefix = it; }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #recs = null;

  recs(it) {
    if (it === undefined) {
      return this.#recs;
    }
    else {
      this.#recs = it;
      return;
    }
  }

  #ids = null;

  ids(it) {
    if (it === undefined) {
      return this.#ids;
    }
    else {
      this.#ids = it;
      return;
    }
  }

  #idsMap = null;

  idsMap(it) {
    if (it === undefined) {
      return this.#idsMap;
    }
    else {
      this.#idsMap = it;
      return;
    }
  }

  static make(config,file) {
    const $self = new FolioFlatFileLoader();
    FolioFlatFileLoader.make$($self,config,file);
    return $self;
  }

  static make$($self,config,file) {
    ;
    $self.#idPrefix = config.idPrefix();
    $self.#file = file;
    return;
  }

  load() {
    this.readTrio();
    this.normIds();
    this.normRecs();
    this.updateDisVal();
    return this.makeMap();
  }

  readTrio() {
    if (!this.#file.exists()) {
      return;
    }
    ;
    this.#recs = haystack.TrioReader.make(this.#file.in()).readAllDicts();
    return;
  }

  normIds() {
    const this$ = this;
    this.#recs.each((rec) => {
      let id = this$.normRef(rec.id());
      this$.#ids.add(id);
      this$.#idsMap.add(id, id);
      return;
    });
    return;
  }

  normRef(id) {
    if ((id.isRel() && this.#idPrefix != null)) {
      (id = id.toAbs(sys.ObjUtil.coerce(this.#idPrefix, sys.Str.type$)));
    }
    ;
    let intern = this.#idsMap.get(id);
    if (intern != null) {
      return sys.ObjUtil.coerce(intern, haystack.Ref.type$);
    }
    ;
    return id;
  }

  normRecs() {
    const this$ = this;
    this.#recs = sys.ObjUtil.coerce(this.#recs.map((rec) => {
      return this$.normRec(rec);
    }, haystack.Dict.type$), sys.Type.find("haystack::Dict[]"));
    return;
  }

  normRec(rec) {
    const this$ = this;
    let tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    rec.each((v,n) => {
      if (sys.ObjUtil.is(v, haystack.Ref.type$)) {
        (v = this$.normRef(sys.ObjUtil.coerce(v, haystack.Ref.type$)));
      }
      ;
      tags.set(n, v);
      return;
    });
    return haystack.Etc.makeDict(tags);
  }

  updateDisVal() {
    const this$ = this;
    this.#recs.each((rec) => {
      rec.id().disVal(rec.dis());
      return;
    });
    return;
  }

  makeMap() {
    const this$ = this;
    let map = concurrent.ConcurrentMap.make(1024);
    this.#recs.each((rec) => {
      let id = rec.id();
      if (map.get(id) != null) {
        throw sys.Err.make(sys.Str.plus("Duplicate ids: ", id));
      }
      ;
      map.set(id, rec);
      return;
    });
    return map;
  }

}

class FolioFlatFileWriter extends haystack.TrioWriter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FolioFlatFileWriter.type$; }

  #folio = null;

  folio() { return this.#folio; }

  __folio(it) { if (it === undefined) return this.#folio; else this.#folio = it; }

  static make(f,out) {
    const $self = new FolioFlatFileWriter();
    FolioFlatFileWriter.make$($self,f,out);
    return $self;
  }

  static make$($self,f,out) {
    haystack.TrioWriter.make$($self, out);
    $self.#folio = f;
    return;
  }

  normVal(val) {
    if (sys.ObjUtil.is(val, haystack.Ref.type$)) {
      return this.normRef(sys.ObjUtil.coerce(val, haystack.Ref.type$));
    }
    ;
    return val;
  }

  normRef(id) {
    (id = id.toRel(this.#folio.idPrefix()));
    if (id.disVal() == null) {
      return id;
    }
    ;
    return sys.ObjUtil.coerce(haystack.Ref.makeWithDis(id, null), haystack.Ref.type$);
  }

}

class FolioFlatFileCommit extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FolioFlatFileCommit.type$; }

  #folio = null;

  folio() { return this.#folio; }

  __folio(it) { if (it === undefined) return this.#folio; else this.#folio = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #inDiff = null;

  inDiff() { return this.#inDiff; }

  __inDiff(it) { if (it === undefined) return this.#inDiff; else this.#inDiff = it; }

  #newMod = null;

  newMod() { return this.#newMod; }

  __newMod(it) { if (it === undefined) return this.#newMod; else this.#newMod = it; }

  #oldRec = null;

  oldRec() { return this.#oldRec; }

  __oldRec(it) { if (it === undefined) return this.#oldRec; else this.#oldRec = it; }

  #oldMod = null;

  oldMod() { return this.#oldMod; }

  __oldMod(it) { if (it === undefined) return this.#oldMod; else this.#oldMod = it; }

  #event = null;

  event(it) {
    if (it === undefined) {
      return this.#event;
    }
    else {
      this.#event = it;
      return;
    }
  }

  static make(folio,diff,newMod,cxInfo) {
    const $self = new FolioFlatFileCommit();
    FolioFlatFileCommit.make$($self,folio,diff,newMod,cxInfo);
    return $self;
  }

  static make$($self,folio,diff,newMod,cxInfo) {
    $self.#folio = folio;
    $self.#id = $self.normRef(diff.id());
    $self.#inDiff = diff;
    $self.#newMod = newMod;
    $self.#oldRec = sys.ObjUtil.coerce(folio.map().get($self.#id), haystack.Dict.type$.toNullable());
    $self.#oldMod = $self.#inDiff.oldMod();
    $self.#event = FolioFlatFileCommitEvent.make(diff, $self.#oldRec, cxInfo);
    return;
  }

  verify() {
    if (this.#inDiff.isAdd()) {
      if (this.#oldRec != null) {
        throw CommitErr.make(sys.Str.plus("Rec already exists: ", this.#id));
      }
      ;
    }
    else {
      if (this.#oldRec == null) {
        throw CommitErr.make(sys.Str.plus("Rec not found: ", this.#id));
      }
      ;
      if ((!this.#inDiff.isForce() && sys.ObjUtil.compareNE(this.#oldRec.trap("mod", sys.List.make(sys.Obj.type$.toNullable(), [])), this.#oldMod))) {
        throw ConcurrentChangeErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#id), ": "), this.#oldRec.trap("mod", sys.List.make(sys.Obj.type$.toNullable(), []))), " != "), this.#oldMod));
      }
      ;
    }
    ;
    return this;
  }

  apply() {
    const this$ = this;
    let tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    if (this.#oldRec != null) {
      this.#oldRec.each((v,n) => {
        tags.set(n, v);
        return;
      });
    }
    ;
    this.#inDiff.changes().each((v,n) => {
      if (v === haystack.Remove.val()) {
        tags.remove(n);
      }
      else {
        tags.set(n, this$.norm(v));
      }
      ;
      return;
    });
    tags.set("id", this.#id);
    if (!this.#inDiff.isTransient()) {
      tags.set("mod", this.#newMod);
    }
    ;
    let newRec = haystack.Etc.makeDict(tags);
    newRec.id().disVal(newRec.dis());
    let outDiff = Diff.makeAll(this.#id, this.#oldMod, this.#oldRec, this.#newMod, newRec, this.#inDiff.changes(), this.#inDiff.flags());
    this.#event.diff(outDiff);
    return outDiff;
  }

  norm(val) {
    if (sys.ObjUtil.is(val, haystack.Ref.type$)) {
      return this.normRef(sys.ObjUtil.coerce(val, haystack.Ref.type$));
    }
    ;
    return val;
  }

  normRef(id) {
    if ((id.isRel() && this.#folio.idPrefix() != null)) {
      (id = id.toAbs(sys.ObjUtil.coerce(this.#folio.idPrefix(), sys.Str.type$)));
    }
    ;
    let rec = sys.ObjUtil.as(this.#folio.map().get(id), haystack.Dict.type$);
    if (rec != null) {
      return rec.id();
    }
    ;
    if (id.disVal() != null) {
      (id = sys.ObjUtil.coerce(haystack.Ref.make(id.id(), null), haystack.Ref.type$));
    }
    ;
    return id;
  }

}

class FolioFlatFileCommitEvent extends FolioCommitEvent {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FolioFlatFileCommitEvent.type$; }

  #diff = null;

  diff(it) {
    if (it === undefined) {
      return this.#diff;
    }
    else {
      this.#diff = it;
      return;
    }
  }

  #oldRec = null;

  oldRec(it) {
    if (it === undefined) {
      return this.#oldRec;
    }
    else {
      this.#oldRec = it;
      return;
    }
  }

  #cxInfo = null;

  cxInfo(it) {
    if (it === undefined) {
      return this.#cxInfo;
    }
    else {
      this.#cxInfo = it;
      return;
    }
  }

  static make(diff,oldRec,cxInfo) {
    const $self = new FolioFlatFileCommitEvent();
    FolioFlatFileCommitEvent.make$($self,diff,oldRec,cxInfo);
    return $self;
  }

  static make$($self,diff,oldRec,cxInfo) {
    FolioCommitEvent.make$($self);
    $self.diff(diff);
    $self.oldRec(oldRec);
    $self.cxInfo(cxInfo);
    return;
  }

}

const p = sys.Pod.add$('folio');
const xp = sys.Param.noParams$();
let m;
FolioBrioReader.type$ = p.at$('FolioBrioReader','haystack::BrioReader',[],{'sys::NoDoc':""},8192,FolioBrioReader);
InvalidRecIdErr.type$ = p.at$('InvalidRecIdErr','sys::Err',[],{'sys::NoDoc':""},8194,InvalidRecIdErr);
InvalidTagNameErr.type$ = p.at$('InvalidTagNameErr','sys::Err',[],{'sys::NoDoc':""},8194,InvalidTagNameErr);
InvalidTagValErr.type$ = p.at$('InvalidTagValErr','sys::Err',[],{'sys::NoDoc':""},8194,InvalidTagValErr);
ShutdownErr.type$ = p.at$('ShutdownErr','sys::Err',[],{'sys::NoDoc':""},8194,ShutdownErr);
ReadonlyReplicaErr.type$ = p.at$('ReadonlyReplicaErr','sys::Err',[],{'sys::NoDoc':""},8194,ReadonlyReplicaErr);
DiffErr.type$ = p.at$('DiffErr','sys::Err',[],{'sys::NoDoc':""},8194,DiffErr);
CommitErr.type$ = p.at$('CommitErr','sys::Err',[],{'sys::NoDoc':""},8194,CommitErr);
ConcurrentChangeErr.type$ = p.at$('ConcurrentChangeErr','folio::CommitErr',[],{'sys::NoDoc':""},8194,ConcurrentChangeErr);
LoadErr.type$ = p.at$('LoadErr','folio::CommitErr',[],{'sys::NoDoc':""},8194,LoadErr);
RecErr.type$ = p.at$('RecErr','sys::Err',[],{'sys::NoDoc':""},8194,RecErr);
HisConfigErr.type$ = p.at$('HisConfigErr','folio::RecErr',[],{'sys::NoDoc':""},8194,HisConfigErr);
HisWriteErr.type$ = p.at$('HisWriteErr','folio::RecErr',[],{'sys::NoDoc':""},8194,HisWriteErr);
FolioFuture.type$ = p.at$('FolioFuture','concurrent::Future',[],{},8195,FolioFuture);
SyncFolioFuture.type$ = p.at$('SyncFolioFuture','folio::FolioFuture',[],{},130,SyncFolioFuture);
AsyncFolioFuture.type$ = p.at$('AsyncFolioFuture','folio::FolioFuture',[],{},130,AsyncFolioFuture);
FolioRes.type$ = p.at$('FolioRes','sys::Obj',[],{'sys::NoDoc':""},8195,FolioRes);
ReadFolioRes.type$ = p.at$('ReadFolioRes','folio::FolioRes',[],{'sys::NoDoc':""},8226,ReadFolioRes);
CountFolioRes.type$ = p.at$('CountFolioRes','folio::FolioRes',[],{'sys::NoDoc':""},8226,CountFolioRes);
CommitFolioRes.type$ = p.at$('CommitFolioRes','folio::FolioRes',[],{'sys::NoDoc':""},8226,CommitFolioRes);
HisWriteFolioRes.type$ = p.at$('HisWriteFolioRes','folio::FolioRes',[],{'sys::NoDoc':""},8226,HisWriteFolioRes);
BackupFolioRes.type$ = p.at$('BackupFolioRes','folio::FolioRes',[],{'sys::NoDoc':""},8226,BackupFolioRes);
Folio.type$ = p.at$('Folio','sys::Obj',[],{},8195,Folio);
FolioBackup.type$ = p.am$('FolioBackup','sys::Obj',[],{},8451,FolioBackup);
FolioBackupFile.type$ = p.at$('FolioBackupFile','sys::Obj',[],{},8194,FolioBackupFile);
FolioConfig.type$ = p.at$('FolioConfig','sys::Obj',[],{},8194,FolioConfig);
Diff.type$ = p.at$('Diff','sys::Obj',[],{},8194,Diff);
FolioContext.type$ = p.am$('FolioContext','sys::Obj',[],{'sys::NoDoc':""},8449,FolioContext);
ReadCache.type$ = p.at$('ReadCache','sys::Obj',[],{'sys::NoDoc':""},8192,ReadCache);
FolioHooks.type$ = p.am$('FolioHooks','sys::Obj',[],{'sys::NoDoc':""},8451,FolioHooks);
FolioCommitEvent.type$ = p.at$('FolioCommitEvent','sys::Obj',[],{'sys::NoDoc':""},8193,FolioCommitEvent);
FolioHisEvent.type$ = p.at$('FolioHisEvent','sys::Obj',[],{'sys::NoDoc':""},8193,FolioHisEvent);
NilHooks.type$ = p.at$('NilHooks','sys::Obj',['folio::FolioHooks'],{},130,NilHooks);
PasswordStore.type$ = p.at$('PasswordStore','sys::Obj',[],{},8194,PasswordStore);
PasswordStoreMsgType.type$ = p.at$('PasswordStoreMsgType','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},170,PasswordStoreMsgType);
PasswordStoreMsg.type$ = p.at$('PasswordStoreMsg','sys::Obj',[],{},130,PasswordStoreMsg);
FolioUtil.type$ = p.at$('FolioUtil','sys::Obj',[],{'sys::NoDoc':""},8194,FolioUtil);
DiffTagRule.type$ = p.at$('DiffTagRule','sys::Obj',[],{},130,DiffTagRule);
DiffTagRuleType.type$ = p.at$('DiffTagRuleType','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},170,DiffTagRuleType);
FolioHis.type$ = p.am$('FolioHis','sys::Obj',[],{'sys::NoDoc':""},8451,FolioHis);
FolioFlatFile.type$ = p.at$('FolioFlatFile','folio::Folio',[],{},8194,FolioFlatFile);
FolioFlatFileMsg.type$ = p.at$('FolioFlatFileMsg','sys::Obj',[],{},130,FolioFlatFileMsg);
FolioFlatFileLoader.type$ = p.at$('FolioFlatFileLoader','sys::Obj',[],{},128,FolioFlatFileLoader);
FolioFlatFileWriter.type$ = p.at$('FolioFlatFileWriter','haystack::TrioWriter',[],{},128,FolioFlatFileWriter);
FolioFlatFileCommit.type$ = p.at$('FolioFlatFileCommit','sys::Obj',[],{},128,FolioFlatFileCommit);
FolioFlatFileCommitEvent.type$ = p.at$('FolioFlatFileCommitEvent','folio::FolioCommitEvent',[],{},128,FolioFlatFileCommitEvent);
FolioBrioReader.type$.af$('folio',73730,'folio::Folio',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('folio','folio::Folio',false),new sys.Param('in','sys::InStream',false)]),{}).am$('internRef',271360,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('dis','sys::Str?',false)]),{});
InvalidRecIdErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
InvalidTagNameErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
InvalidTagValErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
ShutdownErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
ReadonlyReplicaErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
DiffErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str?',false),new sys.Param('cause','sys::Err?',true)]),{});
CommitErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str?',false),new sys.Param('cause','sys::Err?',true)]),{});
ConcurrentChangeErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str?',false),new sys.Param('cause','sys::Err?',true)]),{});
LoadErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str?',false),new sys.Param('cause','sys::Err?',true)]),{});
RecErr.type$.af$('rec',73730,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('toRecMsg',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('msg','sys::Str',false)]),{});
HisConfigErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
HisWriteErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
FolioFuture.type$.am$('makeSync',40966,'folio::FolioFuture?',sys.List.make(sys.Param.type$,[new sys.Param('res','folio::FolioRes',false)]),{'sys::NoDoc':""}).am$('makeAsync',40966,'folio::FolioFuture?',sys.List.make(sys.Param.type$,[new sys.Param('future','concurrent::Future',false)]),{'sys::NoDoc':""}).am$('complete',9216,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'sys::NoDoc':""}).am$('completeErr',9216,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err',false)]),{'sys::NoDoc':""}).am$('get',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{'sys::NoDoc':""}).am$('dict',8192,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('dicts',270336,'haystack::Dict?[]',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('grid',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('count',8192,'sys::Int',xp,{'sys::NoDoc':""}).am$('diff',8192,'folio::Diff',xp,{'sys::NoDoc':""}).am$('diffs',8192,'folio::Diff[]',xp,{'sys::NoDoc':""}).am$('timeout',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',false)]),{'sys::NoDoc':""}).am$('getRes',262273,'folio::FolioRes',xp,{}).am$('make',139268,'sys::Void',xp,{});
SyncFolioFuture.type$.af$('getRes',336898,'folio::FolioRes',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('res','folio::FolioRes',false)]),{}).am$('status',271360,'concurrent::FutureStatus',xp,{}).am$('timeout',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',false)]),{}).am$('waitFor',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{}).am$('cancel',271360,'sys::Void',xp,{});
AsyncFolioFuture.type$.af$('future',73730,'concurrent::Future',{}).af$('timeoutRef',73730,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('future','concurrent::Future',false)]),{}).am$('wraps',271360,'concurrent::Future?',xp,{}).am$('status',271360,'concurrent::FutureStatus',xp,{}).am$('timeout',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Duration?',false)]),{}).am$('cancel',271360,'sys::Void',xp,{}).am$('waitFor',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{}).am$('getRes',271360,'folio::FolioRes',xp,{});
FolioRes.type$.am$('val',270337,'sys::Obj?',xp,{}).am$('errs',270336,'sys::Bool',xp,{}).am$('errMsg',270336,'sys::Str',xp,{}).am$('count',270337,'sys::Int',xp,{}).am$('dicts',270336,'haystack::Dict?[]',xp,{}).am$('diffs',270336,'folio::Diff[]',xp,{}).am$('make',139268,'sys::Void',xp,{});
ReadFolioRes.type$.af$('errMsgObj',73730,'sys::Obj',{}).af$('errs',336898,'sys::Bool',{}).af$('dicts',336898,'haystack::Dict?[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('errMsgObj','sys::Obj',false),new sys.Param('errs','sys::Bool',false),new sys.Param('dicts','haystack::Dict?[]',false)]),{}).am$('val',271360,'sys::Obj?',xp,{}).am$('errMsg',271360,'sys::Str',xp,{}).am$('count',271360,'sys::Int',xp,{});
CountFolioRes.type$.af$('count',336898,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('count','sys::Int',false)]),{}).am$('val',271360,'sys::Obj?',xp,{});
CommitFolioRes.type$.af$('diffs',336898,'folio::Diff[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('diffs','folio::Diff[]',false)]),{}).am$('val',271360,'sys::Obj?',xp,{}).am$('count',271360,'sys::Int',xp,{}).am$('dicts',271360,'haystack::Dict?[]',xp,{});
HisWriteFolioRes.type$.af$('empty',106498,'folio::HisWriteFolioRes',{}).af$('dict',73730,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false)]),{}).am$('val',271360,'sys::Obj?',xp,{}).am$('count',271360,'sys::Int',xp,{}).am$('dicts',271360,'haystack::Dict?[]',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
BackupFolioRes.type$.af$('val',336898,'sys::Obj?',{}).am$('make',8196,'sys::Void',xp,{}).am$('count',271360,'sys::Int',xp,{});
Folio.type$.af$('name',73730,'sys::Str',{}).af$('config',73730,'folio::FolioConfig',{}).af$('log',73730,'sys::Log',{}).af$('dir',73730,'sys::File',{}).af$('idPrefix',73730,'sys::Str?',{'sys::NoDoc':""}).af$('hooks',8192,'folio::FolioHooks',{'sys::NoDoc':""}).af$('hooksRef',67586,'concurrent::AtomicRef',{}).af$('flushMode',270337,'sys::Str',{'sys::NoDoc':""}).af$('closedRef',67586,'concurrent::AtomicBool',{}).af$('optsLimit1',100354,'haystack::Dict',{}).af$('optsLimit1AndTrash',100354,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('config','folio::FolioConfig',false)]),{}).am$('sync',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true),new sys.Param('mgr','sys::Str?',true)]),{'sys::NoDoc':""}).am$('passwords',270337,'folio::PasswordStore',xp,{}).am$('curVer',270337,'sys::Int',xp,{'sys::NoDoc':""}).am$('backup',270337,'folio::FolioBackup',xp,{}).am$('his',270337,'folio::FolioHis',xp,{'sys::NoDoc':""}).am$('flush',270337,'sys::Void',xp,{'sys::NoDoc':""}).am$('isClosed',8192,'sys::Bool',xp,{'sys::NoDoc':""}).am$('close',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{}).am$('closeAsync',8192,'folio::FolioFuture',xp,{}).am$('checkRead',8192,'sys::This',xp,{'sys::NoDoc':""}).am$('checkWrite',8192,'sys::This',xp,{'sys::NoDoc':""}).am$('doCloseAsync',266241,'folio::FolioFuture',xp,{'sys::NoDoc':""}).am$('readById',8192,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref?',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('readByIds',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('readByIdsList',8192,'haystack::Dict?[]',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('readCount',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',true)]),{}).am$('read',8192,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('readAll',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',true)]),{}).am$('readAllList',8192,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',true)]),{}).am$('readByIdTrash',8192,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref?',false),new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('readAllEach',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('f','|haystack::Dict->sys::Void|',false)]),{'sys::NoDoc':""}).am$('readAllEachWhile',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('f','|haystack::Dict->sys::Obj?|',false)]),{'sys::NoDoc':""}).am$('doReadByIds',266241,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false)]),{'sys::NoDoc':""}).am$('doReadAll',266241,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',false)]),{'sys::NoDoc':""}).am$('doReadCount',266241,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',false)]),{'sys::NoDoc':""}).am$('doReadAllEachWhile',266241,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('f','|haystack::Dict->sys::Obj?|',false)]),{'sys::NoDoc':""}).am$('readByIdPersistentTags',270336,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('readByIdTransientTags',270336,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('internRef',270336,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{'sys::NoDoc':""}).am$('commit',8192,'folio::Diff',sys.List.make(sys.Param.type$,[new sys.Param('diff','folio::Diff',false)]),{}).am$('commitAll',8192,'folio::Diff[]',sys.List.make(sys.Param.type$,[new sys.Param('diffs','folio::Diff[]',false)]),{}).am$('commitAsync',8192,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('diff','folio::Diff',false)]),{}).am$('commitAllAsync',8192,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('diffs','folio::Diff[]',false)]),{}).am$('commitRemoveTrashAsync',8192,'folio::FolioFuture',xp,{'sys::NoDoc':""}).am$('doCommitAllSync',266240,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('diffs','folio::Diff[]',false),new sys.Param('cxInfo','sys::Obj?',false)]),{'sys::NoDoc':""}).am$('doCommitAllAsync',266241,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('diffs','folio::Diff[]',false),new sys.Param('cxInfo','sys::Obj?',false)]),{'sys::NoDoc':""}).am$('cxCommitInfo',2048,'sys::Obj?',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
FolioBackup.type$.am$('list',270337,'folio::FolioBackupFile[]',xp,{}).am$('create',270337,'folio::FolioFuture',xp,{}).am$('monitor',270337,'sys::Obj?',xp,{'sys::NoDoc':""}).am$('status',270337,'sys::Str',xp,{'sys::NoDoc':""}).am$('summary',270337,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('file','folio::FolioBackupFile',false)]),{'sys::NoDoc':""});
FolioBackupFile.type$.af$('file',73730,'sys::File',{'sys::NoDoc':""}).af$('tsRef',67586,'sys::DateTime',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('ts','sys::DateTime',false)]),{'sys::NoDoc':""}).am$('ts',8192,'sys::DateTime',xp,{}).am$('size',8192,'sys::Int',xp,{}).am$('in',8192,'sys::InStream',xp,{}).am$('delete',8192,'sys::Void',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
FolioConfig.type$.af$('name',73730,'sys::Str',{}).af$('dir',73730,'sys::File',{}).af$('log',73730,'sys::Log',{}).af$('idPrefix',73730,'sys::Str?',{}).af$('pool',73730,'concurrent::ActorPool',{}).af$('opts',73730,'haystack::Dict',{}).af$('isReplica',73730,'sys::Bool',{'sys::NoDoc':""}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('isExtern',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ref','haystack::Ref',false)]),{'sys::NoDoc':""}).am$('dump',8192,'sys::Void',xp,{'sys::NoDoc':""});
Diff.type$.af$('id',73730,'haystack::Ref',{}).af$('oldMod',73730,'sys::DateTime?',{}).af$('oldRec',73730,'haystack::Dict?',{}).af$('newRec',73730,'haystack::Dict?',{}).af$('newMod',73730,'sys::DateTime?',{}).af$('changes',73730,'haystack::Dict',{}).af$('flags',73730,'sys::Int',{}).af$('add',106498,'sys::Int',{}).af$('remove',106498,'sys::Int',{}).af$('transient',106498,'sys::Int',{}).af$('force',106498,'sys::Int',{}).af$('bypassRestricted',106498,'sys::Int',{'sys::NoDoc':""}).af$('curVal',106498,'sys::Int',{'sys::NoDoc':""}).af$('point',106498,'sys::Int',{'sys::NoDoc':""}).af$('forceTransient',106498,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('oldRec','haystack::Dict?',false),new sys.Param('changes','sys::Obj?',false),new sys.Param('flags','sys::Int',true)]),{}).am$('makeAdd',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('changes','sys::Obj?',false),new sys.Param('id','haystack::Ref',true)]),{}).am$('check',2048,'sys::Int',xp,{}).am$('isUpdate',8192,'sys::Bool',xp,{}).am$('isAdd',8192,'sys::Bool',xp,{}).am$('isRemove',8192,'sys::Bool',xp,{}).am$('isTransient',8192,'sys::Bool',xp,{}).am$('isForce',8192,'sys::Bool',xp,{}).am$('isBypassRestricted',8192,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isCurVal',8192,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isAddPoint',8192,'sys::Bool',xp,{'sys::NoDoc':""}).am$('getOld',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{}).am$('getNew',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('makex',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('newMod','sys::DateTime',false),new sys.Param('changes','sys::Obj',false),new sys.Param('flags','sys::Int',false)]),{'sys::NoDoc':""}).am$('makeAll',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('oldMod','sys::DateTime?',false),new sys.Param('oldRec','haystack::Dict?',false),new sys.Param('newMod','sys::DateTime?',false),new sys.Param('newRec','haystack::Dict?',false),new sys.Param('changes','haystack::Dict',false),new sys.Param('flags','sys::Int',false)]),{'sys::NoDoc':""}).am$('toAuditStr',8192,'sys::Str',xp,{'sys::NoDoc':""}).am$('static$init',165890,'sys::Void',xp,{});
FolioContext.type$.am$('curFolio',40962,'folio::FolioContext?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('canRead',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('canWrite',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('commitInfo',270337,'sys::Obj?',xp,{});
ReadCache.type$.af$('folio',73730,'folio::Folio',{}).af$('notFound',100354,'haystack::Dict',{}).af$('byId',67584,'[haystack::Ref:haystack::Dict]',{}).af$('misses',65664,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('folio','folio::Folio',false)]),{}).am$('readById',8192,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('readByIdsList',8192,'haystack::Dict?[]',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('readByIds',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('read',8192,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('filter','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('readAll',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('filter','sys::Str',false)]),{}).am$('readCount',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('filter','sys::Str',false)]),{}).am$('add',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict?',false)]),{'sys::NoDoc':""}).am$('addAll',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('recs','haystack::Dict?[]',false)]),{'sys::NoDoc':""}).am$('static$init',165890,'sys::Void',xp,{});
FolioHooks.type$.am$('ns',270337,'haystack::Namespace?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('xeto',270336,'xeto::LibNamespace?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('preCommit',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('event','folio::FolioCommitEvent',false)]),{}).am$('postCommit',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('event','folio::FolioCommitEvent',false)]),{}).am$('postHisWrite',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('event','folio::FolioHisEvent',false)]),{});
FolioCommitEvent.type$.am$('diff',270337,'folio::Diff',xp,{}).am$('oldRec',270337,'haystack::Dict?',xp,{}).am$('cxInfo',270337,'sys::Obj?',xp,{}).am$('make',139268,'sys::Void',xp,{});
FolioHisEvent.type$.am$('rec',270337,'haystack::Dict',xp,{}).am$('result',270337,'haystack::Dict',xp,{}).am$('cxInfo',270337,'sys::Obj?',xp,{}).am$('make',139268,'sys::Void',xp,{});
NilHooks.type$.am$('ns',271360,'haystack::Namespace?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('preCommit',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('event','folio::FolioCommitEvent',false)]),{}).am$('postCommit',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('event','folio::FolioCommitEvent',false)]),{}).am$('postHisWrite',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('event','folio::FolioHisEvent',false)]),{}).am$('make',139268,'sys::Void',xp,{});
PasswordStore.type$.af$('file',73730,'sys::File',{'sys::NoDoc':""}).af$('log',73730,'sys::Log',{'sys::NoDoc':""}).af$('idPrefix',73730,'sys::Str?',{'sys::NoDoc':""}).af$('rands',100354,'sys::Int[]',{}).af$('timeout',100354,'sys::Duration',{}).af$('cacheRef',67586,'concurrent::AtomicRef',{}).af$('actor',67586,'concurrent::Actor',{}).am$('open',40962,'folio::PasswordStore',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('config','folio::FolioConfig',false)]),{'sys::NoDoc':""}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('config','folio::FolioConfig',false)]),{}).am$('get',8192,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{}).am$('set',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('val','sys::Str',false)]),{}).am$('remove',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{}).am$('relKey',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{}).am$('readBuf',8192,'sys::Buf',xp,{'sys::NoDoc':""}).am$('writeBuf',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{'sys::NoDoc':""}).am$('receive',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','folio::PasswordStoreMsg',false)]),{}).am$('onSync',2048,'sys::Obj?',xp,{}).am$('onInit',2048,'sys::Obj?',xp,{}).am$('onSet',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('onWriteBuf',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('update',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('newCache','[sys::Str:sys::Str]',false)]),{}).am$('msg',32898,'folio::PasswordStoreMsg',sys.List.make(sys.Param.type$,[new sys.Param('type','folio::PasswordStoreMsgType',false),new sys.Param('a','sys::Obj?',true),new sys.Param('b','sys::Obj?',true)]),{}).am$('encode',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('password','sys::Str',false)]),{'sys::NoDoc':""}).am$('decode',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('password','sys::Str',false)]),{'sys::NoDoc':""}).am$('cache',2048,'[sys::Str:sys::Str]',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
PasswordStoreMsgType.type$.af$('init',106506,'folio::PasswordStoreMsgType',{}).af$('sync',106506,'folio::PasswordStoreMsgType',{}).af$('set',106506,'folio::PasswordStoreMsgType',{}).af$('remove',106506,'folio::PasswordStoreMsgType',{}).af$('writeBuf',106506,'folio::PasswordStoreMsgType',{}).af$('vals',106498,'folio::PasswordStoreMsgType[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'folio::PasswordStoreMsgType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
PasswordStoreMsg.type$.af$('type',73730,'folio::PasswordStoreMsgType',{}).af$('a',73730,'sys::Obj?',{}).af$('b',73730,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','folio::PasswordStoreMsgType',false),new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false)]),{});
FolioUtil.type$.af$('maxRecIdSize',106498,'sys::Int',{}).af$('maxTagSize',106498,'sys::Int',{}).af$('maxUriSize',106498,'sys::Int',{}).af$('maxStrSize',106498,'sys::Int',{}).af$('hisMinYear',106498,'sys::Int',{}).af$('hisMinDate',106498,'sys::Date',{}).af$('hisMinTs',106498,'sys::DateTime',{}).am$('checkRecId',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('checkTagName',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('checkTagVal',40962,'haystack::Kind',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('checkDiffs',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('diffs','folio::Diff[]',false)]),{}).am$('stripUncommittable',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('folio','folio::Folio',false),new sys.Param('d','haystack::Dict',false),new sys.Param('opts','haystack::Dict?',true)]),{}).am$('isUncommittable',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('tagsToNeverIndex',40962,'[sys::Str:sys::Str]',xp,{}).am$('tagsToNeverLearn',40962,'[sys::Str:sys::Str]',xp,{}).am$('hisTz',40962,'sys::TimeZone?',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('hisKind',40962,'haystack::Kind?',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('hisUnit',40962,'sys::Unit?',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('hisTsPrecision',40962,'sys::Duration?',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('isHisKind',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('kind','haystack::Kind',false)]),{}).am$('hisWriteCheck',40962,'haystack::HisItem[]',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('items','haystack::HisItem[]',false),new sys.Param('opts','haystack::Dict',true)]),{}).am$('hisWriteMerge',40962,'haystack::HisItem[]',sys.List.make(sys.Param.type$,[new sys.Param('cur','haystack::HisItem[]',false),new sys.Param('changes','haystack::HisItem[]',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
DiffTagRule.type$.af$('type',73730,'folio::DiffTagRuleType',{}).af$('diffFlags',73730,'sys::Int',{}).af$('rules',106498,'[sys::Str:folio::DiffTagRule]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','folio::DiffTagRuleType',false),new sys.Param('diffFlags','sys::Int',false)]),{}).am$('check',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('diff','folio::Diff',false),new sys.Param('name','sys::Str',false),new sys.Param('kind','haystack::Kind',false),new sys.Param('val','sys::Obj',false)]),{}).am$('isUncommittable',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('checkRestricted',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('diff','folio::Diff',false),new sys.Param('name','sys::Str',false),new sys.Param('kind','haystack::Kind',false),new sys.Param('val','sys::Obj',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DiffTagRuleType.type$.af$('never',106506,'folio::DiffTagRuleType',{}).af$('restricted',106506,'folio::DiffTagRuleType',{}).af$('persistentOnly',106506,'folio::DiffTagRuleType',{}).af$('transientOnly',106506,'folio::DiffTagRuleType',{}).af$('vals',106498,'folio::DiffTagRuleType[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'folio::DiffTagRuleType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
FolioHis.type$.am$('read',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('span','haystack::Span?',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('f','|haystack::HisItem->sys::Void|',false)]),{}).am$('write',270337,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('items','haystack::HisItem[]',false),new sys.Param('opts','haystack::Dict?',true)]),{});
FolioFlatFile.type$.af$('file',73730,'sys::File',{'sys::NoDoc':""}).af$('passwords',336898,'folio::PasswordStore',{'sys::NoDoc':""}).af$('actor',67586,'concurrent::Actor',{}).af$('curVerRef',67586,'concurrent::AtomicInt',{}).af$('flushMode',271360,'sys::Str',{'sys::NoDoc':""}).af$('map',65666,'concurrent::ConcurrentMap',{}).am$('open',40962,'folio::FolioFlatFile',sys.List.make(sys.Param.type$,[new sys.Param('config','folio::FolioConfig',false)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('config','folio::FolioConfig',false),new sys.Param('file','sys::File',false),new sys.Param('map','concurrent::ConcurrentMap',false)]),{}).am$('curVer',271360,'sys::Int',xp,{'sys::NoDoc':""}).am$('flush',271360,'sys::Void',xp,{'sys::NoDoc':""}).am$('doCloseAsync',271360,'folio::FolioFuture',xp,{'sys::NoDoc':""}).am$('doReadByIds',271360,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false)]),{'sys::NoDoc':""}).am$('doReadAll',271360,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',false)]),{'sys::NoDoc':""}).am$('doReadCount',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',false)]),{'sys::NoDoc':""}).am$('doReadAllEachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('f','|haystack::Dict->sys::Obj?|',false)]),{'sys::NoDoc':""}).am$('doCommitAllAsync',271360,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('diffs','folio::Diff[]',false),new sys.Param('cxInfo','sys::Obj?',false)]),{'sys::NoDoc':""}).am$('his',271360,'folio::FolioHis',xp,{'sys::NoDoc':""}).am$('backup',271360,'folio::FolioBackup',xp,{'sys::NoDoc':""}).am$('eachWhile',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Dict->sys::Obj?|',false)]),{}).am$('each',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Dict->sys::Void|',false)]),{}).am$('onReceive',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','folio::FolioFlatFileMsg',false)]),{}).am$('onCommit',2048,'folio::CommitFolioRes',sys.List.make(sys.Param.type$,[new sys.Param('diffs','folio::Diff[]',false),new sys.Param('cxInfo','sys::Obj?',false)]),{}).am$('saveToFile',2048,'sys::Void',xp,{});
FolioFlatFileMsg.type$.af$('id',73730,'sys::Str',{}).af$('a',73730,'sys::Obj?',{}).af$('b',73730,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false)]),{});
FolioFlatFileLoader.type$.af$('idPrefix',73730,'sys::Str?',{}).af$('file',73730,'sys::File',{}).af$('recs',73728,'haystack::Dict[]',{}).af$('ids',73728,'haystack::Ref[]',{}).af$('idsMap',73728,'[haystack::Ref:haystack::Ref]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('config','folio::FolioConfig',false),new sys.Param('file','sys::File',false)]),{}).am$('load',8192,'concurrent::ConcurrentMap',xp,{}).am$('readTrio',2048,'sys::Void',xp,{}).am$('normIds',2048,'sys::Void',xp,{}).am$('normRef',2048,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('normRecs',2048,'sys::Void',xp,{}).am$('normRec',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('updateDisVal',2048,'sys::Void',xp,{}).am$('makeMap',2048,'concurrent::ConcurrentMap',xp,{});
FolioFlatFileWriter.type$.af$('folio',73730,'folio::FolioFlatFile',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','folio::FolioFlatFile',false),new sys.Param('out','sys::OutStream',false)]),{}).am$('normVal',271360,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('normRef',8192,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{});
FolioFlatFileCommit.type$.af$('folio',73730,'folio::FolioFlatFile',{}).af$('id',73730,'haystack::Ref',{}).af$('inDiff',73730,'folio::Diff',{}).af$('newMod',73730,'sys::DateTime',{}).af$('oldRec',73730,'haystack::Dict?',{}).af$('oldMod',73730,'sys::DateTime?',{}).af$('event',73728,'folio::FolioFlatFileCommitEvent',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('folio','folio::FolioFlatFile',false),new sys.Param('diff','folio::Diff',false),new sys.Param('newMod','sys::DateTime',false),new sys.Param('cxInfo','sys::Obj?',false)]),{}).am$('verify',8192,'sys::Void',xp,{}).am$('apply',8192,'folio::Diff',xp,{}).am$('norm',2048,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('normRef',2048,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{});
FolioFlatFileCommitEvent.type$.af$('diff',336896,'folio::Diff',{}).af$('oldRec',336896,'haystack::Dict?',{}).af$('cxInfo',336896,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('diff','folio::Diff',false),new sys.Param('oldRec','haystack::Dict?',false),new sys.Param('cxInfo','sys::Obj?',false)]),{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "folio");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;xeto 3.1.11;haystack 3.1.11");
m.set("pod.summary", "Folio database APIs");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:26-05:00 New_York");
m.set("build.tsKey", "241210143126");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "false");
m.set("hx.docFantom", "true");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "SkyFoundry");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Haxall");
m.set("proj.uri", "https://haxall.io/");
m.set("pod.docApi", "true");
m.set("org.uri", "https://skyfoundry.com/");
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/haxall/haxall");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  FolioBrioReader,
  InvalidRecIdErr,
  InvalidTagNameErr,
  InvalidTagValErr,
  ShutdownErr,
  ReadonlyReplicaErr,
  DiffErr,
  CommitErr,
  ConcurrentChangeErr,
  LoadErr,
  RecErr,
  HisConfigErr,
  HisWriteErr,
  FolioFuture,
  FolioRes,
  ReadFolioRes,
  CountFolioRes,
  CommitFolioRes,
  HisWriteFolioRes,
  BackupFolioRes,
  Folio,
  FolioBackup,
  FolioBackupFile,
  FolioConfig,
  Diff,
  FolioContext,
  ReadCache,
  FolioHooks,
  FolioCommitEvent,
  FolioHisEvent,
  PasswordStore,
  FolioUtil,
  FolioHis,
  FolioFlatFile,
};
