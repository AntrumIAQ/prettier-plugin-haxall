// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as util from './util.js'
import * as web from './web.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class Repo extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Repo.type$; }

  static makeForUri(uri,username,password) {
    if (username === undefined) username = null;
    if (password === undefined) password = null;
    if (uri.scheme() == null) {
      return FileRepo.make(uri);
    }
    ;
    if (sys.ObjUtil.equals(uri.scheme(), "file")) {
      return FileRepo.make(uri);
    }
    ;
    if (sys.ObjUtil.equals(uri.scheme(), "http")) {
      return WebRepo.make(uri, username, password);
    }
    ;
    if (sys.ObjUtil.equals(uri.scheme(), "https")) {
      return WebRepo.make(uri, username, password);
    }
    ;
    throw sys.Err.make(sys.Str.plus("No repo available for URI scheme: ", uri));
  }

  toStr() {
    return this.uri().toStr();
  }

  static make() {
    const $self = new Repo();
    Repo.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class FanrEnv extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#byName = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("fanr::PodSpec?"));
    return;
  }

  typeof() { return FanrEnv.type$; }

  #env = null;

  env() { return this.#env; }

  __env(it) { if (it === undefined) return this.#env; else this.#env = it; }

  #byName = null;

  // private field reflection only
  __byName(it) { if (it === undefined) return this.#byName; else this.#byName = it; }

  #queryAll$Store = undefined;

  // private field reflection only
  __queryAll$Store(it) { if (it === undefined) return this.#queryAll$Store; else this.#queryAll$Store = it; }

  static make(env) {
    const $self = new FanrEnv();
    FanrEnv.make$($self,env);
    return $self;
  }

  static make$($self,env) {
    if (env === undefined) env = sys.Env.cur();
    ;
    $self.#env = env;
    return;
  }

  find(podName) {
    if (this.#byName.containsKey(podName)) {
      return this.#byName.get(podName);
    }
    ;
    let file = sys.Env.cur().findPodFile(podName);
    let spec = ((this$) => { if (file == null) return null; return PodSpec.load(sys.ObjUtil.coerce(file, sys.File.type$)); })(this);
    this.#byName.set(podName, spec);
    return spec;
  }

  query(query) {
    const this$ = this;
    let q = Query.fromStr(query);
    if ((sys.ObjUtil.equals(q.parts().size(), 1) && q.parts().get(0).isNameExact())) {
      let spec = this.find(q.parts().get(0).namePattern());
      return ((this$) => { if (spec == null) return sys.List.make(PodSpec.type$); return sys.List.make(PodSpec.type$.toNullable(), [spec]); })(this);
    }
    ;
    return this.queryAll().findAll((p) => {
      return q.include(p);
    });
  }

  queryAll() {
    if (this.#queryAll$Store === undefined) {
      this.#queryAll$Store = this.queryAll$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#queryAll$Store, sys.Type.find("fanr::PodSpec[]"));
  }

  queryAll$Once() {
    const this$ = this;
    let acc = sys.List.make(PodSpec.type$);
    this.#env.findAllPodNames().each((name) => {
      try {
        acc.add(sys.ObjUtil.coerce(this$.find(name), PodSpec.type$));
      }
      catch ($_u2) {
        $_u2 = sys.Err.make($_u2);
        if ($_u2 instanceof sys.Err) {
          let e = $_u2;
          ;
          sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus("ERROR: Cannot query pod: ", name), "\n  "), e));
        }
        else {
          throw $_u2;
        }
      }
      ;
      return;
    });
    return acc;
  }

}

class PodSpec extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PodSpec.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #version = null;

  version() { return this.#version; }

  __version(it) { if (it === undefined) return this.#version; else this.#version = it; }

  #depends = null;

  depends() { return this.#depends; }

  __depends(it) { if (it === undefined) return this.#depends; else this.#depends = it; }

  #summary = null;

  summary() { return this.#summary; }

  __summary(it) { if (it === undefined) return this.#summary; else this.#summary = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  static load(file) {
    return PodSpec.doLoad(file.in(), file);
  }

  static read(in$) {
    return PodSpec.doLoad(in$, null);
  }

  static doLoad(in$,src) {
    let zip = sys.Zip.read(in$);
    try {
      let meta = null;
      for (let f = null; (f = zip.readNext()) != null; ) {
        if (sys.ObjUtil.equals(f.uri(), sys.Uri.fromStr("/meta.props"))) {
          (meta = f);
          break;
        }
        ;
      }
      ;
      if (meta == null) {
        throw sys.Err.make("Missing meta.props");
      }
      ;
      return PodSpec.make(meta.readProps(), src);
    }
    finally {
      zip.close();
    }
    ;
  }

  static make(m,file) {
    const $self = new PodSpec();
    PodSpec.make$($self,m,file);
    return $self;
  }

  static make$($self,m,file) {
    $self.#name = PodSpec.getReq(m, "pod.name");
    $self.#version = sys.ObjUtil.coerce(sys.Version.fromStr(PodSpec.getReq(m, "pod.version")), sys.Version.type$);
    $self.#depends = sys.ObjUtil.coerce(((this$) => { let $_u3 = PodSpec.parseDepends(m); if ($_u3 == null) return null; return sys.ObjUtil.toImmutable(PodSpec.parseDepends(m)); })($self), sys.Type.find("sys::Depend[]"));
    $self.#summary = PodSpec.getReq(m, "pod.summary");
    $self.#toStr = sys.Str.plus(sys.Str.plus(sys.Str.plus("", $self.#name), "-"), $self.#version);
    $self.#meta = sys.ObjUtil.coerce(((this$) => { let $_u4 = m; if ($_u4 == null) return null; return sys.ObjUtil.toImmutable(m); })($self), sys.Type.find("[sys::Str:sys::Str]"));
    $self.#file = file;
    return;
  }

  static getReq(m,n) {
    return sys.ObjUtil.coerce(((this$) => { let $_u5 = m.get(n); if ($_u5 != null) return $_u5; throw sys.Err.make(sys.Str.plus(sys.Str.plus("Missing '", n), "' in meta.props")); })(this), sys.Str.type$);
  }

  static parseDepends(m) {
    const this$ = this;
    let s = sys.Str.trim(PodSpec.getReq(m, "pod.depends"));
    if (sys.Str.isEmpty(s)) {
      return sys.ObjUtil.coerce(sys.Depend.type$.emptyList(), sys.Type.find("sys::Depend[]"));
    }
    ;
    return sys.ObjUtil.coerce(sys.Str.split(s, sys.ObjUtil.coerce(59, sys.Int.type$.toNullable())).map((tok) => {
      return sys.ObjUtil.coerce(sys.Depend.fromStr(tok), sys.Depend.type$);
    }, sys.Depend.type$), sys.Type.find("sys::Depend[]"));
  }

  size() {
    return ((this$) => { let $_u6 = this$.#file; if ($_u6 == null) return null; return this$.#file.size(); })(this);
  }

  ts() {
    return sys.DateTime.fromStr(sys.ObjUtil.coerce(((this$) => { let $_u7 = ((this$) => { let $_u8 = this$.#meta.get("build.ts"); if ($_u8 != null) return $_u8; return this$.#meta.get("build.time"); })(this$); if ($_u7 != null) return $_u7; return ""; })(this), sys.Str.type$), false);
  }

  hash() {
    return sys.Str.hash(this.#toStr);
  }

  equals(x) {
    return (sys.ObjUtil.is(x, PodSpec.type$) && sys.ObjUtil.equals(this.#toStr, sys.ObjUtil.toStr(x)));
  }

  containsCode() {
    let fcode = ((this$) => { let $_u9 = this$.#meta.get("pod.fcode"); if ($_u9 != null) return $_u9; return "true"; })(this);
    return sys.ObjUtil.compareNE(fcode, "false");
  }

}

class FileRepoDb extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#podDirs = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("fanr::PodDir"));
    return;
  }

  typeof() { return FileRepoDb.type$; }

  #repo = null;

  repo() { return this.#repo; }

  __repo(it) { if (it === undefined) return this.#repo; else this.#repo = it; }

  #dir = null;

  dir() { return this.#dir; }

  __dir(it) { if (it === undefined) return this.#dir; else this.#dir = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #podDirs = null;

  // private field reflection only
  __podDirs(it) { if (it === undefined) return this.#podDirs; else this.#podDirs = it; }

  static make(repo) {
    const $self = new FileRepoDb();
    FileRepoDb.make$($self,repo);
    return $self;
  }

  static make$($self,repo) {
    ;
    $self.#repo = repo;
    $self.#dir = repo.dir();
    $self.#log = sys.Log.get("fanr");
    return;
  }

  dispatch(msg) {
    let $_u10 = msg.id();
    if (sys.ObjUtil.equals($_u10, FileRepoMsg.load())) {
      return this.load();
    }
    else if (sys.ObjUtil.equals($_u10, FileRepoMsg.find())) {
      return this.find(sys.ObjUtil.coerce(msg.a(), sys.Str.type$), sys.ObjUtil.coerce(msg.b(), sys.Version.type$.toNullable()));
    }
    else if (sys.ObjUtil.equals($_u10, FileRepoMsg.query())) {
      return this.query(sys.ObjUtil.coerce(msg.a(), sys.Str.type$), sys.ObjUtil.coerce(msg.b(), sys.Int.type$));
    }
    else if (sys.ObjUtil.equals($_u10, FileRepoMsg.publish())) {
      return this.publish(sys.ObjUtil.coerce(msg.a(), sys.File.type$));
    }
    else if (sys.ObjUtil.equals($_u10, FileRepoMsg.refresh())) {
      return this.refresh();
    }
    else {
      throw sys.Err.make(sys.Str.plus("Unknown msg: ", msg));
    }
    ;
  }

  load() {
    const this$ = this;
    let t1 = sys.Duration.now();
    this.#log.debug("FileRepoDb.loading...");
    this.#dir.listDirs().each((podDir) => {
      this$.loadPod(podDir);
      return;
    });
    let t2 = sys.Duration.now();
    this.#log.debug(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("FileRepoDb.loaded (", sys.ObjUtil.coerce(this.#podDirs.size(), sys.Obj.type$.toNullable())), " pods loaded in "), t2.minus(t1).toLocale()), ")"));
    return null;
  }

  loadPod(dir) {
    const this$ = this;
    let curVer = null;
    let curFile = null;
    dir.listFiles().each((file) => {
      let n = file.name();
      let dash = sys.Str.indexr(n, "-");
      if ((!sys.Str.endsWith(n, ".pod") || dash == null)) {
        return;
      }
      ;
      let ver = sys.Version.fromStr(sys.Str.getRange(n, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(dash, sys.Int.type$), 1), -5)), false);
      if (ver == null) {
        return;
      }
      ;
      if ((curVer == null || sys.ObjUtil.compareGT(ver, curVer))) {
        (curVer = ver);
        (curFile = file);
      }
      ;
      return;
    });
    if (curFile != null) {
      try {
        let curSpec = PodSpec.load(sys.ObjUtil.coerce(curFile, sys.File.type$));
        this.#podDirs.set(curSpec.name(), PodDir.make(dir, curSpec));
      }
      catch ($_u11) {
        $_u11 = sys.Err.make($_u11);
        if ($_u11 instanceof sys.Err) {
          let e = $_u11;
          ;
          this.#log.err(sys.Str.plus("Corrupt pod: ", curFile), e);
        }
        else {
          throw $_u11;
        }
      }
      ;
    }
    ;
    return;
  }

  loadAll(podDir) {
    const this$ = this;
    if (podDir.all() != null) {
      return;
    }
    ;
    podDir.all(sys.List.make(PodSpec.type$));
    podDir.dir().list().each((file) => {
      if (sys.ObjUtil.compareNE(file.ext(), "pod")) {
        return;
      }
      ;
      try {
        podDir.all().add(PodSpec.load(file));
      }
      catch ($_u12) {
        $_u12 = sys.Err.make($_u12);
        if ($_u12 instanceof sys.Err) {
          let e = $_u12;
          ;
          this$.#log.err(sys.Str.plus("Corrupt pod: ", file), e);
        }
        else {
          throw $_u12;
        }
      }
      ;
      return;
    });
    podDir.sortAll();
    return;
  }

  refresh() {
    this.#podDirs.clear();
    return this.load();
  }

  find(name,ver) {
    const this$ = this;
    let dir = this.#podDirs.get(name);
    if (dir == null) {
      return null;
    }
    ;
    if (ver == null) {
      return dir.cur();
    }
    ;
    this.loadAll(sys.ObjUtil.coerce(dir, PodDir.type$));
    return dir.all().find((pod) => {
      return sys.ObjUtil.equals(pod.version(), ver);
    });
  }

  query(query,numVersions) {
    const this$ = this;
    if (sys.ObjUtil.compareLT(numVersions, 1)) {
      throw sys.ArgErr.make("numVersions < 1");
    }
    ;
    let q = Query.fromStr(query);
    let acc = sys.List.make(PodSpec.type$);
    this.#podDirs.each((podDir) => {
      if (!q.includeName(podDir.cur())) {
        return;
      }
      ;
      if ((sys.ObjUtil.equals(numVersions, 1) && q.include(podDir.cur()))) {
        acc.add(podDir.cur());
        return;
      }
      ;
      this$.loadAll(podDir);
      let matches = 0;
      for (let i = 0; sys.ObjUtil.compareLT(i, podDir.all().size()); i = sys.Int.increment(i)) {
        let spec = podDir.all().get(i);
        if (q.include(spec)) {
          acc.add(spec);
          ((this$) => { let $_u13 = matches;matches = sys.Int.increment(matches); return $_u13; })(this$);
          if (sys.ObjUtil.compareGE(matches, numVersions)) {
            break;
          }
          ;
        }
        ;
      }
      ;
      return;
    });
    return sys.Unsafe.make(acc);
  }

  publish(inputFile) {
    let spec = PodSpec.load(inputFile);
    let dbFile = this.#repo.specToFile(spec);
    if (dbFile.exists()) {
      throw sys.Err.make(sys.Str.plus("Pod already published: ", spec));
    }
    ;
    inputFile.copyTo(dbFile);
    (spec = PodSpec.load(dbFile));
    let podDir = this.#podDirs.get(spec.name());
    if (podDir == null) {
      this.#podDirs.set(spec.name(), PodDir.make(sys.ObjUtil.coerce(dbFile.parent(), sys.File.type$), spec));
    }
    else {
      if (sys.ObjUtil.compareGT(spec.version(), podDir.cur().version())) {
        podDir.cur(spec);
      }
      ;
      if (podDir.all() != null) {
        podDir.all().add(spec);
        podDir.sortAll();
      }
      ;
    }
    ;
    return spec;
  }

}

class PodDir extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PodDir.type$; }

  #dir = null;

  dir() { return this.#dir; }

  __dir(it) { if (it === undefined) return this.#dir; else this.#dir = it; }

  #cur = null;

  cur(it) {
    if (it === undefined) {
      return this.#cur;
    }
    else {
      this.#cur = it;
      return;
    }
  }

  #all = null;

  all(it) {
    if (it === undefined) {
      return this.#all;
    }
    else {
      this.#all = it;
      return;
    }
  }

  static make(dir,cur) {
    const $self = new PodDir();
    PodDir.make$($self,dir,cur);
    return $self;
  }

  static make$($self,dir,cur) {
    $self.#dir = dir;
    $self.#cur = cur;
    return;
  }

  sortAll() {
    const this$ = this;
    this.#all.sortr((a,b) => {
      return sys.ObjUtil.compare(a.version(), b.version());
    });
    return;
  }

}

class FileRepoMsg extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FileRepoMsg.type$; }

  static #load = undefined;

  static load() {
    if (FileRepoMsg.#load === undefined) {
      FileRepoMsg.static$init();
      if (FileRepoMsg.#load === undefined) FileRepoMsg.#load = 0;
    }
    return FileRepoMsg.#load;
  }

  static #find = undefined;

  static find() {
    if (FileRepoMsg.#find === undefined) {
      FileRepoMsg.static$init();
      if (FileRepoMsg.#find === undefined) FileRepoMsg.#find = 0;
    }
    return FileRepoMsg.#find;
  }

  static #query = undefined;

  static query() {
    if (FileRepoMsg.#query === undefined) {
      FileRepoMsg.static$init();
      if (FileRepoMsg.#query === undefined) FileRepoMsg.#query = 0;
    }
    return FileRepoMsg.#query;
  }

  static #versions = undefined;

  static versions() {
    if (FileRepoMsg.#versions === undefined) {
      FileRepoMsg.static$init();
      if (FileRepoMsg.#versions === undefined) FileRepoMsg.#versions = 0;
    }
    return FileRepoMsg.#versions;
  }

  static #publish = undefined;

  static publish() {
    if (FileRepoMsg.#publish === undefined) {
      FileRepoMsg.static$init();
      if (FileRepoMsg.#publish === undefined) FileRepoMsg.#publish = 0;
    }
    return FileRepoMsg.#publish;
  }

  static #refresh = undefined;

  static refresh() {
    if (FileRepoMsg.#refresh === undefined) {
      FileRepoMsg.static$init();
      if (FileRepoMsg.#refresh === undefined) FileRepoMsg.#refresh = 0;
    }
    return FileRepoMsg.#refresh;
  }

  #id = 0;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #a = null;

  a() { return this.#a; }

  __a(it) { if (it === undefined) return this.#a; else this.#a = it; }

  #b = null;

  b() { return this.#b; }

  __b(it) { if (it === undefined) return this.#b; else this.#b = it; }

  static make(id,a,b) {
    const $self = new FileRepoMsg();
    FileRepoMsg.make$($self,id,a,b);
    return $self;
  }

  static make$($self,id,a,b) {
    if (a === undefined) a = null;
    if (b === undefined) b = null;
    $self.#id = id;
    $self.#a = ((this$) => { let $_u14 = a; if ($_u14 == null) return null; return sys.ObjUtil.toImmutable(a); })($self);
    $self.#b = ((this$) => { let $_u15 = b; if ($_u15 == null) return null; return sys.ObjUtil.toImmutable(b); })($self);
    return;
  }

  static static$init() {
    FileRepoMsg.#load = 0;
    FileRepoMsg.#find = 1;
    FileRepoMsg.#query = 2;
    FileRepoMsg.#versions = 3;
    FileRepoMsg.#publish = 4;
    FileRepoMsg.#refresh = 5;
    return;
  }

}

class FileRepo extends Repo {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FileRepo.type$; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  static #actorPool = undefined;

  static actorPool() {
    if (FileRepo.#actorPool === undefined) {
      FileRepo.static$init();
      if (FileRepo.#actorPool === undefined) FileRepo.#actorPool = null;
    }
    return FileRepo.#actorPool;
  }

  static #timeout = undefined;

  static timeout() {
    if (FileRepo.#timeout === undefined) {
      FileRepo.static$init();
      if (FileRepo.#timeout === undefined) FileRepo.#timeout = null;
    }
    return FileRepo.#timeout;
  }

  #dir = null;

  dir() { return this.#dir; }

  __dir(it) { if (it === undefined) return this.#dir; else this.#dir = it; }

  #actor = null;

  // private field reflection only
  __actor(it) { if (it === undefined) return this.#actor; else this.#actor = it; }

  static make(uri) {
    const $self = new FileRepo();
    FileRepo.make$($self,uri);
    return $self;
  }

  static make$($self,uri) {
    const this$ = $self;
    Repo.make$($self);
    let obj = ((this$) => { if (uri.scheme() == null) return sys.File.make(uri, false); return uri.get(); })($self);
    let file = sys.ObjUtil.as(obj, sys.File.type$);
    if (file == null) {
      throw sys.Err.make(sys.Str.plus("FileRepo uri does not resolve to file: ", uri));
    }
    ;
    if (!file.exists()) {
      throw sys.Err.make(sys.Str.plus("FileRepo uri does not exist: ", uri));
    }
    ;
    if (!file.isDir()) {
      throw sys.Err.make(sys.Str.plus("FileRepo uri does not resolve to dir: ", uri));
    }
    ;
    $self.#dir = file.normalize();
    $self.#uri = $self.#dir.uri();
    $self.#actor = concurrent.Actor.make(FileRepo.actorPool(), (msg) => {
      return this$.receive(msg);
    });
    $self.#actor.send(FileRepoMsg.make(FileRepoMsg.load()));
    return;
  }

  ping() {
    return sys.Map.__fromLiteral(["fanr.type","fanr.version"], [sys.ObjUtil.typeof(this).toStr(),FileRepo.type$.pod().version().toStr()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
  }

  find(name,ver,checked) {
    if (checked === undefined) checked = true;
    let msg = FileRepoMsg.make(FileRepoMsg.find(), name, ver);
    let spec = sys.ObjUtil.as(this.#actor.send(msg).get(FileRepo.timeout()), PodSpec.type$);
    if (spec != null) {
      return spec;
    }
    ;
    if (checked) {
      throw sys.UnknownPodErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", name), "-"), ver));
    }
    ;
    return null;
  }

  query(query,numVersions) {
    if (numVersions === undefined) numVersions = 1;
    let msg = FileRepoMsg.make(FileRepoMsg.query(), query, sys.ObjUtil.coerce(numVersions, sys.Obj.type$.toNullable()));
    let r = sys.ObjUtil.coerce(this.#actor.send(msg).get(FileRepo.timeout()), sys.Unsafe.type$);
    return sys.ObjUtil.coerce(r.val(), sys.Type.find("fanr::PodSpec[]"));
  }

  read(spec) {
    return this.specToFile(spec).in();
  }

  publish(podFile) {
    let msg = FileRepoMsg.make(FileRepoMsg.publish(), podFile);
    let r = sys.ObjUtil.coerce(this.#actor.send(msg).get(FileRepo.timeout()), PodSpec.type$);
    return r;
  }

  refresh() {
    let msg = FileRepoMsg.make(FileRepoMsg.refresh());
    return this.#actor.send(msg);
  }

  receive(msg) {
    let db = sys.ObjUtil.as(concurrent.Actor.locals().get("fanr.file.db"), FileRepoDb.type$);
    if (db == null) {
      concurrent.Actor.locals().set("fanr.file.db", (db = FileRepoDb.make(this)));
    }
    ;
    return db.dispatch(sys.ObjUtil.coerce(msg, FileRepoMsg.type$));
  }

  specToFile(spec) {
    return this.#dir.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", spec.name()), "/"), spec.toStr()), ".pod")));
  }

  static static$init() {
    FileRepo.#actorPool = concurrent.ActorPool.make();
    FileRepo.#timeout = sys.Duration.fromStr("30sec");
    return;
  }

}

class Tokenizer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Tokenizer.type$; }

  #tok = null;

  tok(it) {
    if (it === undefined) {
      return this.#tok;
    }
    else {
      this.#tok = it;
      return;
    }
  }

  #val = null;

  val(it) {
    if (it === undefined) {
      return this.#val;
    }
    else {
      this.#val = it;
      return;
    }
  }

  #input = null;

  // private field reflection only
  __input(it) { if (it === undefined) return this.#input; else this.#input = it; }

  #index = 0;

  // private field reflection only
  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  #cur = 0;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #peek = 0;

  // private field reflection only
  __peek(it) { if (it === undefined) return this.#peek; else this.#peek = it; }

  static make(input) {
    const $self = new Tokenizer();
    Tokenizer.make$($self,input);
    return $self;
  }

  static make$($self,input) {
    $self.#index = -1;
    $self.#input = input;
    $self.#tok = Token.eof();
    $self.consume();
    $self.consume();
    return;
  }

  next() {
    this.#val = null;
    while (sys.Int.isSpace(this.#cur)) {
      this.consume();
    }
    ;
    if ((sys.Int.isAlpha(this.#cur) || sys.ObjUtil.equals(this.#cur, 42))) {
      return ((this$) => { let $_u17 = this$.word(); this$.#tok = $_u17; return $_u17; })(this);
    }
    ;
    if ((sys.ObjUtil.equals(this.#cur, 34) || sys.ObjUtil.equals(this.#cur, 39))) {
      return ((this$) => { let $_u18 = this$.str(); this$.#tok = $_u18; return $_u18; })(this);
    }
    ;
    if (sys.Int.isDigit(this.#cur)) {
      return ((this$) => { let $_u19 = this$.num(); this$.#tok = $_u19; return $_u19; })(this);
    }
    ;
    return ((this$) => { let $_u20 = this$.symbol(); this$.#tok = $_u20; return $_u20; })(this);
  }

  word() {
    let s = sys.StrBuf.make();
    let stars = 0;
    while ((sys.Int.isAlphaNum(this.#cur) || sys.ObjUtil.equals(this.#cur, 95) || sys.ObjUtil.equals(this.#cur, 42))) {
      if (sys.ObjUtil.equals(this.#cur, 42)) {
        ((this$) => { let $_u21 = stars;stars = sys.Int.increment(stars); return $_u21; })(this);
      }
      ;
      s.addChar(this.#cur);
      this.consume();
    }
    ;
    let id = s.toStr();
    this.#val = id;
    if (sys.ObjUtil.compareGT(stars, 0)) {
      return Token.idPattern();
    }
    ;
    return Token.id();
  }

  num() {
    let s = sys.StrBuf.make().addChar(this.#cur);
    this.consume();
    let dashes = 0;
    let dots = 0;
    while ((sys.Int.isDigit(this.#cur) || sys.ObjUtil.equals(this.#cur, 95) || (sys.ObjUtil.equals(this.#cur, 45) && sys.ObjUtil.equals(dots, 0)) || (sys.ObjUtil.equals(this.#cur, 46) && sys.ObjUtil.equals(dashes, 0)))) {
      if (sys.ObjUtil.equals(this.#cur, 45)) {
        ((this$) => { let $_u22 = dashes;dashes = sys.Int.increment(dashes); return $_u22; })(this);
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 46)) {
        ((this$) => { let $_u23 = dots;dots = sys.Int.increment(dots); return $_u23; })(this);
      }
      ;
      if (sys.ObjUtil.compareNE(this.#cur, 95)) {
        s.addChar(this.#cur);
      }
      ;
      this.consume();
    }
    ;
    if (sys.ObjUtil.equals(dashes, 2)) {
      this.#val = sys.Date.fromStr(s.toStr());
      return Token.date();
    }
    ;
    if (sys.ObjUtil.compareGT(dots, 0)) {
      this.#val = sys.Version.fromStr(s.toStr());
      return Token.version();
    }
    ;
    this.#val = sys.ObjUtil.coerce(sys.Int.fromStr(s.toStr()), sys.Obj.type$.toNullable());
    return Token.int();
  }

  str() {
    let quote = this.#cur;
    this.consume();
    let s = sys.StrBuf.make();
    while (true) {
      let ch = this.#cur;
      if (sys.ObjUtil.equals(ch, quote)) {
        this.consume();
        break;
      }
      ;
      if (sys.ObjUtil.equals(ch, 36)) {
        throw this.err("String interpolation not supported");
      }
      ;
      if (sys.ObjUtil.equals(ch, 0)) {
        throw this.err("Unexpected end of str");
      }
      ;
      if (sys.ObjUtil.equals(ch, 92)) {
        s.addChar(this.escape());
        continue;
      }
      ;
      this.consume();
      s.addChar(ch);
    }
    ;
    this.#val = s.toStr();
    return Token.str();
  }

  escape() {
    this.consume();
    let $_u24 = this.#cur;
    if (sys.ObjUtil.equals($_u24, 98)) {
      this.consume();
      return 8;
    }
    else if (sys.ObjUtil.equals($_u24, 102)) {
      this.consume();
      return 12;
    }
    else if (sys.ObjUtil.equals($_u24, 110)) {
      this.consume();
      return 10;
    }
    else if (sys.ObjUtil.equals($_u24, 114)) {
      this.consume();
      return 13;
    }
    else if (sys.ObjUtil.equals($_u24, 116)) {
      this.consume();
      return 9;
    }
    else if (sys.ObjUtil.equals($_u24, 34)) {
      this.consume();
      return 34;
    }
    else if (sys.ObjUtil.equals($_u24, 36)) {
      this.consume();
      return 36;
    }
    else if (sys.ObjUtil.equals($_u24, 39)) {
      this.consume();
      return 39;
    }
    else if (sys.ObjUtil.equals($_u24, 96)) {
      this.consume();
      return 96;
    }
    else if (sys.ObjUtil.equals($_u24, 92)) {
      this.consume();
      return 92;
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, 117)) {
      this.consume();
      let n3 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      let n2 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      let n1 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      let n0 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      if ((n3 == null || n2 == null || n1 == null || n0 == null)) {
        throw this.err("Invalid hex value for \\uxxxx");
      }
      ;
      return sys.Int.or(sys.Int.or(sys.Int.or(sys.Int.shiftl(sys.ObjUtil.coerce(n3, sys.Int.type$), 12), sys.Int.shiftl(sys.ObjUtil.coerce(n2, sys.Int.type$), 8)), sys.Int.shiftl(sys.ObjUtil.coerce(n1, sys.Int.type$), 4)), sys.ObjUtil.coerce(n0, sys.Int.type$));
    }
    ;
    throw this.err("Invalid escape sequence");
  }

  symbol() {
    let c = this.#cur;
    this.consume();
    let $_u25 = c;
    if (sys.ObjUtil.equals($_u25, 0)) {
      return Token.eof();
    }
    else if (sys.ObjUtil.equals($_u25, 13)) {
      throw this.err("Carriage return \\r not allowed in source");
    }
    else if (sys.ObjUtil.equals($_u25, 44)) {
      return Token.comma();
    }
    else if (sys.ObjUtil.equals($_u25, 45)) {
      return Token.minus();
    }
    else if (sys.ObjUtil.equals($_u25, 43)) {
      return Token.plus();
    }
    else if (sys.ObjUtil.equals($_u25, 46)) {
      return Token.dot();
    }
    else if (sys.ObjUtil.equals($_u25, 60)) {
      if (sys.ObjUtil.equals(this.#cur, 61)) {
        this.consume();
        return Token.ltEq();
      }
      ;
      return Token.lt();
    }
    else if (sys.ObjUtil.equals($_u25, 61)) {
      if (sys.ObjUtil.equals(this.#cur, 61)) {
        this.consume();
        return Token.eq();
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u25, 62)) {
      if (sys.ObjUtil.equals(this.#cur, 61)) {
        this.consume();
        return Token.gtEq();
      }
      ;
      return Token.gt();
    }
    else if (sys.ObjUtil.equals($_u25, 33)) {
      if (sys.ObjUtil.equals(this.#cur, 61)) {
        this.consume();
        return Token.notEq();
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u25, 126)) {
      if (sys.ObjUtil.equals(this.#cur, 61)) {
        this.consume();
        return Token.like();
      }
      ;
    }
    ;
    if (sys.ObjUtil.equals(c, 0)) {
      return Token.eof();
    }
    ;
    throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unexpected symbol: ", sys.Int.toChar(c)), " (0x"), sys.Int.toHex(c)), ")"));
  }

  err(msg) {
    return sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", msg), ": "), this.#input));
  }

  consume() {
    this.#cur = this.#peek;
    this.#peek = ((this$) => { if (sys.ObjUtil.compareLT(this$.#index = sys.Int.increment(this$.#index), sys.Str.size(this$.#input))) return sys.Str.get(this$.#input, this$.#index); return 0; })(this);
    return;
  }

}

class Token extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Token.type$; }

  static id() { return Token.vals().get(0); }

  static idPattern() { return Token.vals().get(1); }

  static int() { return Token.vals().get(2); }

  static date() { return Token.vals().get(3); }

  static version() { return Token.vals().get(4); }

  static str() { return Token.vals().get(5); }

  static dot() { return Token.vals().get(6); }

  static comma() { return Token.vals().get(7); }

  static minus() { return Token.vals().get(8); }

  static plus() { return Token.vals().get(9); }

  static eq() { return Token.vals().get(10); }

  static notEq() { return Token.vals().get(11); }

  static like() { return Token.vals().get(12); }

  static lt() { return Token.vals().get(13); }

  static ltEq() { return Token.vals().get(14); }

  static gt() { return Token.vals().get(15); }

  static gtEq() { return Token.vals().get(16); }

  static eof() { return Token.vals().get(17); }

  static #vals = undefined;

  #symbol = null;

  symbol() { return this.#symbol; }

  __symbol(it) { if (it === undefined) return this.#symbol; else this.#symbol = it; }

  #queryOp = null;

  queryOp() { return this.#queryOp; }

  __queryOp(it) { if (it === undefined) return this.#queryOp; else this.#queryOp = it; }

  static make($ordinal,$name,s,q) {
    const $self = new Token();
    Token.make$($self,$ordinal,$name,s,q);
    return $self;
  }

  static make$($self,$ordinal,$name,s,q) {
    if (q === undefined) q = null;
    sys.Enum.make$($self, $ordinal, $name);
    $self.#symbol = s;
    $self.#queryOp = q;
    return;
  }

  toStr() {
    return this.#symbol;
  }

  isScalar() {
    return (this === Token.int() || this === Token.str() || this === Token.date() || this === Token.version());
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(Token.type$, Token.vals(), name$, checked);
  }

  static vals() {
    if (Token.#vals == null) {
      Token.#vals = sys.List.make(Token.type$, [
        Token.make(0, "id", "identifier"),
        Token.make(1, "idPattern", "identifier pattern"),
        Token.make(2, "int", "Int"),
        Token.make(3, "date", "Date"),
        Token.make(4, "version", "Version"),
        Token.make(5, "str", "Str"),
        Token.make(6, "dot", "."),
        Token.make(7, "comma", ","),
        Token.make(8, "minus", "-"),
        Token.make(9, "plus", "+"),
        Token.make(10, "eq", "==", eq),
        Token.make(11, "notEq", "==", notEq),
        Token.make(12, "like", "~=", like),
        Token.make(13, "lt", "<", lt),
        Token.make(14, "ltEq", "<=", ltEq),
        Token.make(15, "gt", ">", gt),
        Token.make(16, "gtEq", ">=", gtEq),
        Token.make(17, "eof", "eof"),
      ]).toImmutable();
    }
    return Token.#vals;
  }

  static static$init() {
    const $_u27 = Token.vals();
    if (true) {
    }
    ;
    return;
  }

}

class Query extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Query.type$; }

  #parts = null;

  parts() { return this.#parts; }

  __parts(it) { if (it === undefined) return this.#parts; else this.#parts = it; }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    try {
      return Parser.make(s).parse();
    }
    catch ($_u28) {
      $_u28 = sys.Err.make($_u28);
      if ($_u28 instanceof sys.Err) {
        let e = $_u28;
        ;
        if (!sys.ObjUtil.is(e, sys.ParseErr.type$)) {
          (e = sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Internal err ", e.toStr()), ": "), s), e));
        }
        ;
        if (checked) {
          throw e;
        }
        ;
        return null;
      }
      else {
        throw $_u28;
      }
    }
    ;
  }

  static make(parts) {
    const $self = new Query();
    Query.make$($self,parts);
    return $self;
  }

  static make$($self,parts) {
    $self.#parts = sys.ObjUtil.coerce(((this$) => { let $_u29 = parts; if ($_u29 == null) return null; return sys.ObjUtil.toImmutable(parts); })($self), sys.Type.find("fanr::QueryPart[]"));
    return;
  }

  toStr() {
    return this.#parts.join(",");
  }

  hash() {
    return this.#parts.hash();
  }

  equals(that) {
    return (sys.ObjUtil.is(that, Query.type$) && sys.ObjUtil.equals(this.#parts, sys.ObjUtil.coerce(that, Query.type$).#parts));
  }

  include(pod) {
    const this$ = this;
    return this.#parts.any((part) => {
      return part.include(pod);
    });
  }

  includeName(pod) {
    const this$ = this;
    return this.#parts.any((part) => {
      return part.includeName(pod);
    });
  }

}

class QueryPart extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return QueryPart.type$; }

  #namePattern = null;

  namePattern() { return this.#namePattern; }

  __namePattern(it) { if (it === undefined) return this.#namePattern; else this.#namePattern = it; }

  #version = null;

  version() { return this.#version; }

  __version(it) { if (it === undefined) return this.#version; else this.#version = it; }

  #metas = null;

  metas() { return this.#metas; }

  __metas(it) { if (it === undefined) return this.#metas; else this.#metas = it; }

  #nameRegex = null;

  // private field reflection only
  __nameRegex(it) { if (it === undefined) return this.#nameRegex; else this.#nameRegex = it; }

  static make(namePattern,version,metas) {
    const $self = new QueryPart();
    QueryPart.make$($self,namePattern,version,metas);
    return $self;
  }

  static make$($self,namePattern,version,metas) {
    $self.#namePattern = namePattern;
    if (sys.Str.contains(namePattern, "*")) {
      $self.#nameRegex = sys.Regex.glob(namePattern);
    }
    ;
    $self.#version = version;
    $self.#metas = sys.ObjUtil.coerce(((this$) => { let $_u30 = metas; if ($_u30 == null) return null; return sys.ObjUtil.toImmutable(metas); })($self), sys.Type.find("fanr::QueryMeta[]"));
    return;
  }

  isNameExact() {
    return this.#nameRegex == null;
  }

  hash() {
    return sys.Str.hash(this.#namePattern);
  }

  equals(that) {
    if (!sys.ObjUtil.is(that, QueryPart.type$)) {
      return false;
    }
    ;
    let x = sys.ObjUtil.coerce(that, QueryPart.type$);
    return (sys.ObjUtil.equals(this.#namePattern, x.#namePattern) && sys.ObjUtil.equals(this.#version, x.#version) && sys.ObjUtil.equals(this.#metas, x.#metas));
  }

  toStr() {
    const this$ = this;
    let s = sys.StrBuf.make();
    s.add(this.#namePattern);
    if (this.#version != null) {
      let v = this.#version.toStr();
      s.add(" ").add(sys.Str.getRange(v, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sys.Str.index(v, " "), sys.Int.type$), 1), -1)));
    }
    ;
    this.#metas.each((m) => {
      s.add(" ").add(m);
      return;
    });
    return s.toStr();
  }

  include(pod) {
    if (!this.includeName(pod)) {
      return false;
    }
    ;
    if (!this.includeVersion(pod)) {
      return false;
    }
    ;
    if (!this.includeMetas(pod)) {
      return false;
    }
    ;
    return true;
  }

  includeName(pod) {
    if (this.#nameRegex == null) {
      return sys.ObjUtil.equals(this.#namePattern, pod.name());
    }
    else {
      return this.#nameRegex.matches(pod.name());
    }
    ;
  }

  includeVersion(pod) {
    if (this.#version == null) {
      return true;
    }
    ;
    return this.#version.match(pod.version());
  }

  includeMetas(pod) {
    const this$ = this;
    if (this.#metas.isEmpty()) {
      return true;
    }
    ;
    return this.#metas.all((meta) => {
      return meta.include(pod);
    });
  }

}

class QueryMeta extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return QueryMeta.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #op = null;

  op() { return this.#op; }

  __op(it) { if (it === undefined) return this.#op; else this.#op = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make(name,op,val) {
    const $self = new QueryMeta();
    QueryMeta.make$($self,name,op,val);
    return $self;
  }

  static make$($self,name,op,val) {
    $self.#name = name;
    $self.#op = op;
    $self.#val = ((this$) => { let $_u31 = val; if ($_u31 == null) return null; return sys.ObjUtil.toImmutable(val); })($self);
    return;
  }

  toStr() {
    if (this.#op === QueryOp.has()) {
      return this.#name;
    }
    ;
    let valStr = ((this$) => { if (sys.ObjUtil.is(this$.#val, sys.Str.type$)) return sys.Str.toCode(sys.ObjUtil.coerce(this$.#val, sys.Str.type$)); return sys.ObjUtil.toStr(this$.#val); })(this);
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#name), " "), this.#op), " "), valStr);
  }

  hash() {
    return sys.Int.xor(sys.Str.hash(this.#name), sys.Int.shiftl(sys.ObjUtil.hash(this.#op), 11));
  }

  equals(that) {
    if (!sys.ObjUtil.is(that, QueryMeta.type$)) {
      return false;
    }
    ;
    let x = sys.ObjUtil.coerce(that, QueryMeta.type$);
    return (sys.ObjUtil.equals(this.#name, x.#name) && sys.ObjUtil.equals(this.#op, x.#op) && sys.ObjUtil.equals(this.#val, x.#val));
  }

  include(pod) {
    let actualStr = pod.meta().get(this.#name);
    if (actualStr == null) {
      return false;
    }
    ;
    if (this.#op === QueryOp.has()) {
      return sys.ObjUtil.compareNE(actualStr, "false");
    }
    ;
    let actual = this.coerce(sys.ObjUtil.typeof(this.#val), sys.ObjUtil.coerce(actualStr, sys.Str.type$));
    if (actual == null) {
      return this.#op === QueryOp.notEq();
    }
    ;
    if (this.#op === QueryOp.eq()) {
      return sys.ObjUtil.equals(actual, this.#val);
    }
    ;
    if (this.#op === QueryOp.notEq()) {
      return sys.ObjUtil.compareNE(actual, this.#val);
    }
    ;
    if (this.#op === QueryOp.like()) {
      return sys.Str.contains(sys.Str.lower(sys.ObjUtil.toStr(actual)), sys.Str.lower(sys.ObjUtil.toStr(this.#val)));
    }
    ;
    if (this.#op === QueryOp.lt()) {
      return sys.ObjUtil.compareLT(actual, this.#val);
    }
    ;
    if (this.#op === QueryOp.ltEq()) {
      return sys.ObjUtil.compareLE(actual, this.#val);
    }
    ;
    if (this.#op === QueryOp.gtEq()) {
      return sys.ObjUtil.compareGE(actual, this.#val);
    }
    ;
    if (this.#op === QueryOp.gt()) {
      return sys.ObjUtil.compareGT(actual, this.#val);
    }
    ;
    throw sys.UnsupportedErr.make(this.#op.toStr());
  }

  coerce(type,s) {
    if (type === sys.Str.type$) {
      return s;
    }
    ;
    if (type === sys.Int.type$) {
      return sys.ObjUtil.coerce(sys.Int.fromStr(s, 10, false), sys.Obj.type$.toNullable());
    }
    ;
    if (type === sys.Date.type$) {
      return ((this$) => { let $_u33 = sys.DateTime.fromStr(s, false); if ($_u33 == null) return null; return sys.DateTime.fromStr(s, false).date(); })(this);
    }
    ;
    if (type === sys.Version.type$) {
      return sys.Version.fromStr(s, false);
    }
    ;
    throw sys.UnsupportedErr.make(type.toStr());
  }

}

class QueryOp extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return QueryOp.type$; }

  static has() { return QueryOp.vals().get(0); }

  static eq() { return QueryOp.vals().get(1); }

  static notEq() { return QueryOp.vals().get(2); }

  static like() { return QueryOp.vals().get(3); }

  static lt() { return QueryOp.vals().get(4); }

  static ltEq() { return QueryOp.vals().get(5); }

  static gtEq() { return QueryOp.vals().get(6); }

  static gt() { return QueryOp.vals().get(7); }

  static #vals = undefined;

  #symbol = null;

  symbol() { return this.#symbol; }

  __symbol(it) { if (it === undefined) return this.#symbol; else this.#symbol = it; }

  static make($ordinal,$name,symbol) {
    const $self = new QueryOp();
    QueryOp.make$($self,$ordinal,$name,symbol);
    return $self;
  }

  static make$($self,$ordinal,$name,symbol) {
    sys.Enum.make$($self, $ordinal, $name);
    $self.#symbol = symbol;
    return;
  }

  toStr() {
    return this.#symbol;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(QueryOp.type$, QueryOp.vals(), name$, checked);
  }

  static vals() {
    if (QueryOp.#vals == null) {
      QueryOp.#vals = sys.List.make(QueryOp.type$, [
        QueryOp.make(0, "has", "has"),
        QueryOp.make(1, "eq", "=="),
        QueryOp.make(2, "notEq", "!="),
        QueryOp.make(3, "like", "~="),
        QueryOp.make(4, "lt", "<"),
        QueryOp.make(5, "ltEq", "<="),
        QueryOp.make(6, "gtEq", ">="),
        QueryOp.make(7, "gt", ">"),
      ]).toImmutable();
    }
    return QueryOp.#vals;
  }

  static static$init() {
    const $_u34 = QueryOp.vals();
    if (true) {
    }
    ;
    return;
  }

}

class Parser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Parser.type$; }

  #tokenizer = null;

  // private field reflection only
  __tokenizer(it) { if (it === undefined) return this.#tokenizer; else this.#tokenizer = it; }

  #cur = null;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #curVal = null;

  // private field reflection only
  __curVal(it) { if (it === undefined) return this.#curVal; else this.#curVal = it; }

  #peek = null;

  // private field reflection only
  __peek(it) { if (it === undefined) return this.#peek; else this.#peek = it; }

  #peekVal = null;

  // private field reflection only
  __peekVal(it) { if (it === undefined) return this.#peekVal; else this.#peekVal = it; }

  static make(input) {
    const $self = new Parser();
    Parser.make$($self,input);
    return $self;
  }

  static make$($self,input) {
    $self.#tokenizer = Tokenizer.make(input);
    $self.#cur = ((this$) => { let $_u35 = Token.eof(); this$.#peek = $_u35; return $_u35; })($self);
    $self.consume();
    $self.consume();
    return;
  }

  parse() {
    let parts = sys.List.make(QueryPart.type$);
    parts.add(this.part());
    while (this.#cur === Token.comma()) {
      this.consume();
      parts.add(this.part());
    }
    ;
    if (this.#cur !== Token.eof()) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expecting end of file, not ", this.#cur), " ("), this.#curVal), ")"));
    }
    ;
    return Query.make(parts);
  }

  part() {
    return QueryPart.make(this.partName(), this.partVersion(), this.partMetas());
  }

  partName() {
    if ((this.#cur === Token.id() || this.#cur === Token.idPattern())) {
      let name = this.#curVal;
      this.consume();
      return sys.ObjUtil.coerce(name, sys.Str.type$);
    }
    ;
    throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expecting pod name pattern, not ", this.#cur), " ("), this.#curVal), ")"));
  }

  partVersion() {
    if ((this.#cur !== Token.int() && this.#cur !== Token.version())) {
      return null;
    }
    ;
    let s = sys.StrBuf.make().add("v ");
    while ((this.#cur === Token.int() || this.#cur === Token.version() || this.#cur === Token.plus() || this.#cur === Token.minus() || (this.#cur === Token.comma() && (this.#peek === Token.int() || this.#peek === Token.version())))) {
      s.add(((this$) => { let $_u36 = this$.#curVal; if ($_u36 != null) return $_u36; return this$.#cur.symbol(); })(this));
      this.consume();
    }
    ;
    let d = sys.Depend.fromStr(s.toStr(), false);
    if (d == null) {
      throw this.err(sys.Str.plus("Invalid version constraint: ", s));
    }
    ;
    return d;
  }

  partMetas() {
    if (this.#cur !== Token.id()) {
      return sys.ObjUtil.coerce(QueryMeta.type$.emptyList(), sys.Type.find("fanr::QueryMeta[]"));
    }
    ;
    let metas = sys.List.make(QueryMeta.type$);
    while (this.#cur === Token.id()) {
      metas.add(this.meta());
    }
    ;
    return metas;
  }

  meta() {
    let name = this.metaName();
    let op = QueryOp.has();
    let val = null;
    if (this.#cur.queryOp() != null) {
      (op = sys.ObjUtil.coerce(this.#cur.queryOp(), QueryOp.type$));
      this.consume();
      (val = this.consumeScalar());
    }
    ;
    return QueryMeta.make(name, op, val);
  }

  metaName() {
    let s = sys.StrBuf.make();
    s.add(this.consumeId());
    while (this.#cur === Token.dot()) {
      this.consume();
      s.addChar(46).add(this.consumeId());
    }
    ;
    return s.toStr();
  }

  err(msg) {
    return this.#tokenizer.err(msg);
  }

  consumeId() {
    this.verify(Token.id());
    let id = this.#curVal;
    this.consume();
    return sys.ObjUtil.coerce(id, sys.Str.type$);
  }

  consumeScalar() {
    if ((this.#cur === Token.minus() && this.#peek === Token.int())) {
      this.consume();
      let int = sys.ObjUtil.coerce(this.#curVal, sys.Int.type$);
      this.consume();
      return sys.ObjUtil.coerce(sys.Int.negate(int), sys.Obj.type$);
    }
    ;
    if (!this.#cur.isScalar()) {
      throw this.err(sys.Str.plus("Expected scalar, not ", this.#cur));
    }
    ;
    let val = this.#curVal;
    this.consume();
    return sys.ObjUtil.coerce(val, sys.Obj.type$);
  }

  verify(expected) {
    if (sys.ObjUtil.compareNE(this.#cur, expected)) {
      if (this.#cur === Token.id()) {
        throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expected ", expected), ", not identifier '"), this.#curVal), "'"));
      }
      else {
        throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expected ", expected), ", not "), this.#cur));
      }
      ;
    }
    ;
    return;
  }

  consume(expected) {
    if (expected === undefined) expected = null;
    if (expected != null) {
      this.verify(sys.ObjUtil.coerce(expected, Token.type$));
    }
    ;
    this.#cur = this.#peek;
    this.#curVal = this.#peekVal;
    this.#peek = this.#tokenizer.next();
    this.#peekVal = this.#tokenizer.val();
    return;
  }

}

class Command extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#out = sys.Env.cur().out();
    return;
  }

  typeof() { return Command.type$; }

  #out = null;

  out(it) {
    if (it === undefined) {
      return this.#out;
    }
    else {
      this.#out = it;
      return;
    }
  }

  #repoUri = null;

  repoUri(it) {
    if (it === undefined) {
      return this.#repoUri;
    }
    else {
      this.#repoUri = it;
      return;
    }
  }

  #errTrace = false;

  errTrace(it) {
    if (it === undefined) {
      return this.#errTrace;
    }
    else {
      this.#errTrace = it;
      return;
    }
  }

  #skipConfirm = false;

  skipConfirm(it) {
    if (it === undefined) {
      return this.#skipConfirm;
    }
    else {
      this.#skipConfirm = it;
      return;
    }
  }

  #username = null;

  username(it) {
    if (it === undefined) {
      return this.#username;
    }
    else {
      this.#username = it;
      return;
    }
  }

  #password = null;

  password(it) {
    if (it === undefined) {
      return this.#password;
    }
    else {
      this.#password = it;
      return;
    }
  }

  #repo$Store = undefined;

  // private field reflection only
  __repo$Store(it) { if (it === undefined) return this.#repo$Store; else this.#repo$Store = it; }

  #env$Store = undefined;

  // private field reflection only
  __env$Store(it) { if (it === undefined) return this.#env$Store; else this.#env$Store = it; }

  warn(msg) {
    this.#out.printLine(sys.Str.plus("WARN: ", msg));
    return;
  }

  err(msg,cause) {
    if (cause === undefined) cause = null;
    return CommandErr.make(msg, cause);
  }

  confirm(msg) {
    if (this.#skipConfirm) {
      return true;
    }
    ;
    this.#out.printLine();
    this.#out.print(sys.Str.plus(sys.Str.plus("", msg), " [y/n]: ")).flush();
    let r = sys.Env.cur().in().readLine();
    return sys.Str.startsWith(sys.Str.lower(r), "y");
  }

  printPodVersion(version) {
    this.printPodVersions(sys.List.make(PodSpec.type$, [version]));
    return;
  }

  printPodVersions(versions) {
    const this$ = this;
    let top = versions.sortr().first();
    let summary = top.summary();
    if (sys.ObjUtil.compareGT(sys.Str.size(summary), 100)) {
      (summary = sys.Str.plus(sys.Str.getRange(summary, sys.Range.make(0, 100)), "..."));
    }
    ;
    let verPad = 6;
    versions.each((x) => {
      (verPad = sys.Int.max(verPad, sys.Str.size(x.version().toStr())));
      return;
    });
    this.#out.printLine(top.name());
    this.#out.printLine(sys.Str.plus("  ", summary));
    versions.each((x) => {
      let details = sys.StrBuf.make();
      if (x.ts() != null) {
        details.join(x.ts().date().toLocale("DD-MMM-YYYY"), ", ");
      }
      ;
      if (x.size() != null) {
        details.join(sys.Int.toLocale(sys.ObjUtil.coerce(x.size(), sys.Int.type$), "B"), ", ");
      }
      ;
      let verStr = sys.Str.padr(x.version().toStr(), verPad);
      this$.#out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", verStr), " ("), details), ")"));
      return;
    });
    return;
  }

  repo() {
    if (this.#repo$Store === undefined) {
      this.#repo$Store = this.repo$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#repo$Store, Repo.type$);
  }

  env() {
    if (this.#env$Store === undefined) {
      this.#env$Store = this.env$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#env$Store, FanrEnv.type$);
  }

  init(args) {
    this.initOptsFromConfig();
    if (!this.parseArgs(args)) {
      return false;
    }
    ;
    this.promptPassword();
    return true;
  }

  initOptsFromConfig() {
    const this$ = this;
    this.optFields().each((field) => {
      let val = this$.optDefault(field);
      field.set(this$, val);
      return;
    });
    return;
  }

  optDefault(field) {
    let def = field.get(this);
    let facet = sys.ObjUtil.coerce(field.facet(CommandOpt.type$), CommandOpt.type$);
    if (facet.config() != null) {
      let config = Command.type$.pod().config(sys.ObjUtil.coerce(facet.config(), sys.Str.type$));
      if (config != null) {
        try {
          (def = Command.parseVal(field.type(), sys.ObjUtil.coerce(config, sys.Str.type$)));
        }
        catch ($_u37) {
          $_u37 = sys.Err.make($_u37);
          if ($_u37 instanceof sys.Err) {
            let e = $_u37;
            ;
            this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid config value for '", facet.config()), "': "), config));
          }
          else {
            throw $_u37;
          }
        }
        ;
      }
      ;
    }
    ;
    return def;
  }

  parseArgs(toks) {
    let args = this.argFields();
    let opts = this.optFields();
    let varArgs = (!args.isEmpty() && args.last().type().fits(sys.Type.find("sys::List")));
    let argi = 0;
    for (let i = 0; sys.ObjUtil.compareLT(i, toks.size()); i = sys.Int.increment(i)) {
      let tok = toks.get(i);
      let next = ((this$) => { if (sys.ObjUtil.compareLT(sys.Int.plus(i, 1), toks.size())) return toks.get(sys.Int.plus(i, 1)); return null; })(this);
      if (sys.Str.startsWith(tok, "-")) {
        if (this.parseOpt(opts, tok, next)) {
          i = sys.Int.increment(i);
        }
        ;
      }
      else {
        if (sys.ObjUtil.compareLT(argi, args.size())) {
          if (this.parseArg(args.get(argi), tok)) {
            argi = sys.Int.increment(argi);
          }
          ;
        }
        else {
          this.warn(sys.Str.plus("Unexpected arg: ", tok));
        }
        ;
      }
      ;
    }
    ;
    if (sys.ObjUtil.equals(argi, args.size())) {
      return true;
    }
    ;
    if ((sys.ObjUtil.equals(argi, sys.Int.minus(args.size(), 1)) && varArgs)) {
      return true;
    }
    ;
    this.usage();
    this.#out.printLine();
    this.#out.printLine("Missing arguments");
    return false;
  }

  argFields() {
    const this$ = this;
    return sys.Type.of(this).fields().findAll((f) => {
      return f.hasFacet(CommandArg.type$);
    });
  }

  optFields() {
    const this$ = this;
    return sys.Type.of(this).fields().findAll((f) => {
      return f.hasFacet(CommandOpt.type$);
    });
  }

  parseOpt(opts,tok,next) {
    let n = sys.Str.getRange(tok, sys.Range.make(1, -1));
    for (let i = 0; sys.ObjUtil.compareLT(i, opts.size()); i = sys.Int.increment(i)) {
      let field = opts.get(i);
      let facet = sys.ObjUtil.coerce(field.facet(CommandOpt.type$), CommandOpt.type$);
      if (sys.ObjUtil.compareNE(facet.name(), n)) {
        continue;
      }
      ;
      if (sys.ObjUtil.equals(field.type(), sys.Bool.type$)) {
        field.set(this, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
        return false;
      }
      ;
      if ((next == null || sys.Str.startsWith(next, "-"))) {
        this.err(sys.Str.plus("Missing value for -", n));
        return false;
      }
      ;
      try {
        field.set(this, Command.parseVal(field.type(), sys.ObjUtil.coerce(next, sys.Str.type$)));
      }
      catch ($_u39) {
        $_u39 = sys.Err.make($_u39);
        if ($_u39 instanceof sys.Err) {
          let e = $_u39;
          ;
          this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot parse -", n), " as "), field.type().name()), ": "), next));
        }
        else {
          throw $_u39;
        }
      }
      ;
      return true;
    }
    ;
    this.warn(sys.Str.plus("Unknown option -", n));
    return false;
  }

  parseArg(field,tok) {
    let isList = field.type().fits(sys.Type.find("sys::List"));
    try {
      if (!isList) {
        field.set(this, Command.parseVal(field.type(), tok));
        return true;
      }
      ;
      let of$ = field.type().params().get("V");
      let val = Command.parseVal(sys.ObjUtil.coerce(of$, sys.Type.type$), tok);
      let list = sys.ObjUtil.as(field.get(this), sys.Type.find("sys::Obj?[]"));
      if (list == null) {
        field.set(this, (list = sys.ObjUtil.coerce(sys.List.make(sys.ObjUtil.coerce(of$, sys.Type.type$), 8), sys.Type.find("sys::Obj?[]?"))));
      }
      ;
      list.add(val);
    }
    catch ($_u40) {
      $_u40 = sys.Err.make($_u40);
      if ($_u40 instanceof sys.Err) {
        let e = $_u40;
        ;
        this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot parse argument as ", field.type().name()), ": "), tok));
      }
      else {
        throw $_u40;
      }
    }
    ;
    return !isList;
  }

  static parseVal(of$,tok) {
    (of$ = of$.toNonNullable());
    if (sys.ObjUtil.equals(of$, sys.Str.type$)) {
      return tok;
    }
    ;
    if (sys.ObjUtil.equals(of$, sys.File.type$)) {
      return Command.parsePath(tok);
    }
    ;
    return of$.method("fromStr").call(tok);
  }

  static parsePath(path) {
    if (sys.Str.contains(path, "\\")) {
      return sys.File.os(path).normalize();
    }
    else {
      return sys.ObjUtil.coerce(sys.File.make(sys.Str.toUri(path), false), sys.File.type$);
    }
    ;
  }

  promptPassword() {
    if ((this.#username != null && this.#password == null)) {
      this.#password = sys.Env.cur().promptPassword(sys.Str.plus(sys.Str.plus("Password for '", this.#username), "'>"));
    }
    ;
    return;
  }

  usage(out) {
    if (out === undefined) out = this.#out;
    const this$ = this;
    let args = this.argFields();
    let opts = this.optFields();
    let argRows = this.usagePad(sys.ObjUtil.coerce(args.map((f) => {
      return this$.usageArg(f);
    }, sys.Obj.type$.toNullable()), sys.Type.find("sys::Str[][]")));
    let optRows = this.usagePad(sys.ObjUtil.coerce(opts.map((f) => {
      return this$.usageOpt(f);
    }, sys.Obj.type$.toNullable()), sys.Type.find("sys::Str[][]")));
    let argSummary = args.join(" ", (field) => {
      let facet = sys.ObjUtil.coerce(field.facet(CommandArg.type$), CommandArg.type$);
      let s = sys.Str.plus(sys.Str.plus("<", facet.name()), ">");
      if (field.type().fits(sys.Type.find("sys::List"))) {
        s = sys.Str.plus(s, "*");
      }
      ;
      return s;
    });
    out.printLine("Summary:");
    out.printLine(sys.Str.plus("  ", this.summary()));
    out.printLine("Usage:");
    out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("  fanr ", this.name()), " [options] "), argSummary));
    this.usagePrint(out, "Arguments:", argRows);
    this.usagePrint(out, "Options:", optRows);
    return;
  }

  usageArg(field) {
    let facet = sys.ObjUtil.coerce(field.facet(CommandArg.type$), CommandArg.type$);
    return sys.List.make(sys.Str.type$, [facet.name(), facet.help()]);
  }

  usageOpt(field) {
    let facet = sys.ObjUtil.coerce(field.facet(CommandOpt.type$), CommandOpt.type$);
    let name = facet.name();
    let def = this.optDefault(field);
    let help = facet.help();
    let col1 = sys.Str.plus("-", name);
    if (sys.ObjUtil.compareNE(def, false)) {
      col1 = sys.Str.plus(col1, sys.Str.plus(sys.Str.plus(" <", field.type().name()), ">"));
    }
    ;
    let col2 = help;
    if ((sys.ObjUtil.compareNE(def, false) && def != null)) {
      col2 = sys.Str.plus(col2, sys.Str.plus(sys.Str.plus(" (default ", def), ")"));
    }
    ;
    return sys.List.make(sys.Str.type$, [col1, col2]);
  }

  usagePad(rows) {
    const this$ = this;
    if (rows.isEmpty()) {
      return rows;
    }
    ;
    let max = sys.ObjUtil.coerce(rows.map((row) => {
      return sys.ObjUtil.coerce(sys.Str.size(row.get(0)), sys.Obj.type$.toNullable());
    }, sys.Obj.type$.toNullable()).max(), sys.Int.type$);
    let pad = sys.Int.min(20, sys.Int.plus(2, max));
    rows.each((row) => {
      row.set(0, sys.Str.padr(row.get(0), pad));
      return;
    });
    return rows;
  }

  usagePrint(out,title,rows) {
    const this$ = this;
    if (rows.isEmpty()) {
      return;
    }
    ;
    out.printLine(title);
    rows.each((row) => {
      out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", row.get(0)), "  "), row.get(1)));
      return;
    });
    return;
  }

  static make() {
    const $self = new Command();
    Command.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  repo$Once() {
    if (this.#repoUri == null) {
      throw this.err("No repoUri available: use -r or set 'repo' in etc/fanr/config.props");
    }
    ;
    try {
      return Repo.makeForUri(sys.ObjUtil.coerce(this.#repoUri, sys.Uri.type$), this.#username, this.#password);
    }
    catch ($_u41) {
      $_u41 = sys.Err.make($_u41);
      if ($_u41 instanceof sys.Err) {
        let e = $_u41;
        ;
        throw this.err(sys.Str.plus("Cannot init repo: ", this.#repoUri), e);
      }
      else {
        throw $_u41;
      }
    }
    ;
  }

  env$Once() {
    return FanrEnv.make();
  }

}

class CommandErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CommandErr.type$; }

  static make(msg,cause) {
    const $self = new CommandErr();
    CommandErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class CommandArg extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CommandArg.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #help = null;

  help() { return this.#help; }

  __help(it) { if (it === undefined) return this.#help; else this.#help = it; }

  static make(f) {
    const $self = new CommandArg();
    CommandArg.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    ((this$) => { let $_u42 = f; if ($_u42 == null) return null; return sys.Func.call(f, this$); })($self);
    return;
  }

}

class CommandOpt extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CommandOpt.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #help = null;

  help() { return this.#help; }

  __help(it) { if (it === undefined) return this.#help; else this.#help = it; }

  #config = null;

  config() { return this.#config; }

  __config(it) { if (it === undefined) return this.#config; else this.#config = it; }

  static make(f) {
    const $self = new CommandOpt();
    CommandOpt.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    ((this$) => { let $_u43 = f; if ($_u43 == null) return null; return sys.Func.call(f, this$); })($self);
    return;
  }

}

class HelpCmd extends Command {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HelpCmd.type$; }

  #command = null;

  command(it) {
    if (it === undefined) {
      return this.#command;
    }
    else {
      this.#command = it;
      return;
    }
  }

  name() {
    return "help";
  }

  summary() {
    return "print help on a specific command";
  }

  run() {
    const this$ = this;
    let c = Main.make().commands().find((c) => {
      return sys.ObjUtil.equals(c.name(), this$.#command);
    });
    if (c == null) {
      throw this.err(sys.Str.plus("Help command not found: ", this.#command));
    }
    ;
    c.usage();
    return;
  }

  static make() {
    const $self = new HelpCmd();
    HelpCmd.make$($self);
    return $self;
  }

  static make$($self) {
    Command.make$($self);
    return;
  }

}

class EnvCmd extends Command {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EnvCmd.type$; }

  #query = null;

  query(it) {
    if (it === undefined) {
      return this.#query;
    }
    else {
      this.#query = it;
      return;
    }
  }

  name() {
    return "env";
  }

  summary() {
    return "query pods installed in local environment";
  }

  run() {
    const this$ = this;
    let specs = this.env().query(sys.ObjUtil.coerce(this.#query, sys.Str.type$));
    if (specs.isEmpty()) {
      this.out().printLine("No pods found");
      return;
    }
    ;
    specs.sort().each((spec) => {
      this$.printPodVersion(spec);
      return;
    });
    return;
  }

  static make() {
    const $self = new EnvCmd();
    EnvCmd.make$($self);
    return $self;
  }

  static make$($self) {
    Command.make$($self);
    return;
  }

}

class Main extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#commands = sys.List.make(Command.type$, [HelpCmd.make(), ConfigCmd.make(), PingCmd.make(), EnvCmd.make(), QueryCmd.make(), InstallCmd.make(), UninstallCmd.make(), PublishCmd.make()]);
    return;
  }

  typeof() { return Main.type$; }

  #commands = null;

  commands(it) {
    if (it === undefined) {
      return this.#commands;
    }
    else {
      this.#commands = it;
      return;
    }
  }

  main(args) {
    const this$ = this;
    if (args.isEmpty()) {
      return this.usage();
    }
    ;
    let n = args.first();
    if ((sys.ObjUtil.equals(n, "-?") || sys.ObjUtil.equals(n, "-help"))) {
      return this.usage();
    }
    ;
    let matches = this.#commands.findAll((c) => {
      return sys.Str.startsWith(c.name(), sys.ObjUtil.coerce(n, sys.Str.type$));
    });
    if (sys.ObjUtil.equals(matches.size(), 0)) {
      return this.usage(sys.Str.plus("Unknown command: ", n));
    }
    ;
    if (sys.ObjUtil.compareGT(matches.size(), 1)) {
      return this.usage(sys.Str.plus("Ambiguous command: ", matches.join(", ", (it) => {
        return it.name();
      })));
    }
    ;
    let cmd = matches.first();
    try {
      if (!cmd.init(args.getRange(sys.Range.make(1, -1)))) {
        return 1;
      }
      ;
      cmd.run();
      return 0;
    }
    catch ($_u44) {
      $_u44 = sys.Err.make($_u44);
      if ($_u44 instanceof sys.Err) {
        let e = $_u44;
        ;
        cmd.out().printLine(sys.Str.plus(sys.Str.plus("ERROR: ", cmd.name()), " command failed"));
        if (cmd.errTrace()) {
          e.trace(cmd.out());
        }
        else {
          let dis = ((this$) => { if (sys.ObjUtil.is(e, CommandErr.type$)) return e.msg(); return e.toStr(); })(this);
          cmd.out().printLine(sys.Str.plus("  ", dis));
          cmd.out().printLine("  use -errTrace for full stack trace");
        }
        ;
        return 1;
      }
      else {
        throw $_u44;
      }
    }
    ;
  }

  usage(errMsg,out) {
    if (errMsg === undefined) errMsg = null;
    if (out === undefined) out = sys.Env.cur().out();
    const this$ = this;
    let maxName = 10;
    this.#commands.each((cmd) => {
      (maxName = sys.Int.max(maxName, sys.Str.size(cmd.name())));
      return;
    });
    maxName = sys.Int.plus(maxName, 2);
    out.printLine("Fantom Repository Manager");
    out.printLine("usage:");
    out.printLine("  fanr <command> [options] [args]");
    out.printLine("commands:");
    out.printLine(sys.Str.plus(sys.Str.plus("  ", sys.Str.padr("-?, -help", maxName)), " print usage help"));
    this.#commands.each((c) => {
      out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", sys.Str.padr(c.name(), maxName)), " "), c.summary()));
      return;
    });
    if (errMsg != null) {
      out.printLine().printLine(errMsg);
    }
    ;
    return 1;
  }

  static make() {
    const $self = new Main();
    Main.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class PingCmd extends Command {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PingCmd.type$; }

  name() {
    return "ping";
  }

  summary() {
    return "ping the repo for availability";
  }

  run() {
    const this$ = this;
    let t1 = sys.Duration.now();
    let ping = this.repo().ping();
    let t2 = sys.Duration.now();
    this.out().printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Ping: ", this.repo().uri()), " ["), t2.minus(t1).toLocale()), "]"));
    this.out().printLine();
    ping.keys().sort().each((n) => {
      this$.out().printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("", n), ": "), ping.get(n)));
      return;
    });
    this.out().printLine();
    return;
  }

  static make() {
    const $self = new PingCmd();
    PingCmd.make$($self);
    return $self;
  }

  static make$($self) {
    Command.make$($self);
    return;
  }

}

class InstallCmd extends Command {
  constructor() {
    super();
    const this$ = this;
    this.#items = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("fanr::InstallItem"));
    return;
  }

  typeof() { return InstallCmd.type$; }

  #query = null;

  query(it) {
    if (it === undefined) {
      return this.#query;
    }
    else {
      this.#query = it;
      return;
    }
  }

  #items = null;

  items(it) {
    if (it === undefined) {
      return this.#items;
    }
    else {
      this.#items = it;
      return;
    }
  }

  name() {
    return "install";
  }

  summary() {
    return "install a pod from repo to local env";
  }

  run() {
    const this$ = this;
    let specs = this.repo().query(sys.ObjUtil.coerce(this.#query, sys.Str.type$), 1);
    if (specs.isEmpty()) {
      this.out().printLine("No install pods matched");
      return;
    }
    ;
    specs.each((spec) => {
      this$.#items.set(spec.name(), InstallItem.make(spec, this$.env().find(spec.name())));
      return;
    });
    this.findDepends();
    this.printInstallPlan(this.#items);
    if (!this.confirm("Install?")) {
      return;
    }
    ;
    let ts = sys.DateTime.now().toLocale("YYMMDD-hhmmss");
    let rand = sys.Buf.random(4).toHex();
    let stageDir = sys.Env.cur().tempDir().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("fanr-stage-", ts), "-"), rand), "/")));
    this.out().printLine();
    this.#items.each((item) => {
      this$.download(item, stageDir);
      return;
    });
    this.out().printLine();
    this.out().printLine(sys.Str.plus(sys.Str.plus("Download successful (", sys.ObjUtil.coerce(this.#items.size(), sys.Obj.type$.toNullable())), " pods)"));
    this.out().printLine();
    this.#items.each((item) => {
      this$.install(item, stageDir);
      return;
    });
    this.out().printLine();
    this.out().printLine(sys.Str.plus(sys.Str.plus("Installation successful (", sys.ObjUtil.coerce(this.#items.size(), sys.Obj.type$.toNullable())), " pods)"));
    return;
  }

  findDepends() {
    const this$ = this;
    while (true) {
      let again = false;
      this.#items.dup().each((item) => {
        if (item.dependsChecked()) {
          return;
        }
        ;
        this$.checkDepends(item);
        item.dependsChecked(true);
        (again = true);
        return;
      });
      if (!again) {
        break;
      }
      ;
    }
    ;
    return;
  }

  checkDepends(item) {
    const this$ = this;
    item.spec().depends().each((d) => {
      let curInstalled = this$.env().find(d.name());
      if ((curInstalled != null && d.match(curInstalled.version()))) {
        return;
      }
      ;
      let toInstall = this$.#items.get(d.name());
      if ((toInstall != null && d.match(toInstall.spec().version()))) {
        return;
      }
      ;
      let newInstall = this$.repo().query(d.toStr(), 1).first();
      if (newInstall != null) {
        this$.#items.set(newInstall.name(), InstallItem.make(sys.ObjUtil.coerce(newInstall, PodSpec.type$), curInstalled));
        return;
      }
      ;
      throw this$.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot meet dependency '", d), "' for '"), item.name()), "'"));
    });
    return;
  }

  printInstallPlan(items) {
    const this$ = this;
    let maxName = sys.Str.size(items.vals().max((a,b) => {
      return sys.ObjUtil.compare(sys.Str.size(a.name()), sys.Str.size(b.name()));
    }).name());
    let maxAction = sys.Str.size(items.vals().max((a,b) => {
      return sys.ObjUtil.compare(sys.Str.size(a.actionStr()), sys.Str.size(b.actionStr()));
    }).actionStr());
    let maxOldVer = sys.Str.size(items.vals().max((a,b) => {
      return sys.ObjUtil.compare(sys.Str.size(a.oldVerStr()), sys.Str.size(b.oldVerStr()));
    }).oldVerStr());
    this.out().printLine();
    items.keys().sort().each((name) => {
      let item = items.get(name);
      this$.out().printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.justl(name, maxName), "  ["), sys.Str.justl(item.actionStr(), maxAction)), "]  "), sys.Str.justl(item.oldVerStr(), maxOldVer)), " => "), item.newVerStr()));
      return;
    });
    this.out().printLine();
    return;
  }

  download(item,stageDir) {
    this.out().print(sys.Str.plus(sys.Str.plus("Downloading ", item.name()), " ... ")).flush();
    let dest = stageDir.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", item.name()), ".pod")));
    let destOut = dest.out();
    try {
      this.repo().read(item.spec()).pipe(destOut);
      destOut.close();
    }
    catch ($_u46) {
      $_u46 = sys.Err.make($_u46);
      if ($_u46 instanceof sys.Err) {
        let e = $_u46;
        ;
        this.out().printLine().printLine();
        destOut.close();
        throw e;
      }
      else {
        throw $_u46;
      }
    }
    ;
    this.out().printLine("Complete");
    return;
  }

  install(item,stageDir) {
    this.out().print(sys.Str.plus(sys.Str.plus("Installing ", item.name()), " ... ")).flush();
    let src = stageDir.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", item.name()), ".pod")));
    let dest = sys.Env.cur().workDir().plus(sys.Uri.fromStr("lib/fan/"));
    src.copyInto(dest, sys.Map.__fromLiteral(["overwrite"], [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")));
    this.out().printLine("Complete");
    return;
  }

  static make() {
    const $self = new InstallCmd();
    InstallCmd.make$($self);
    return $self;
  }

  static make$($self) {
    Command.make$($self);
    ;
    return;
  }

}

class InstallItem extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InstallItem.type$; }

  #spec = null;

  spec(it) {
    if (it === undefined) {
      return this.#spec;
    }
    else {
      this.#spec = it;
      return;
    }
  }

  #cur = null;

  cur(it) {
    if (it === undefined) {
      return this.#cur;
    }
    else {
      this.#cur = it;
      return;
    }
  }

  #oldVerStr = null;

  oldVerStr(it) {
    if (it === undefined) {
      return this.#oldVerStr;
    }
    else {
      this.#oldVerStr = it;
      return;
    }
  }

  #newVerStr = null;

  newVerStr(it) {
    if (it === undefined) {
      return this.#newVerStr;
    }
    else {
      this.#newVerStr = it;
      return;
    }
  }

  #dependsChecked = false;

  dependsChecked(it) {
    if (it === undefined) {
      return this.#dependsChecked;
    }
    else {
      this.#dependsChecked = it;
      return;
    }
  }

  static make(spec,cur) {
    const $self = new InstallItem();
    InstallItem.make$($self,spec,cur);
    return $self;
  }

  static make$($self,spec,cur) {
    $self.#spec = spec;
    $self.#cur = cur;
    $self.#oldVerStr = ((this$) => { if (cur == null) return "not-installed"; return cur.version().toStr(); })($self);
    $self.#newVerStr = spec.version().toStr();
    return;
  }

  name() {
    return this.#spec.name();
  }

  actionStr() {
    if (this.isSkip()) {
      return "skip";
    }
    ;
    if (this.#cur == null) {
      return "install";
    }
    ;
    if (sys.ObjUtil.compareGT(this.#cur.version(), this.#spec.version())) {
      return "downgrade";
    }
    ;
    return "upgrade";
  }

  isSkip() {
    return sys.ObjUtil.equals(this.#spec.version(), ((this$) => { let $_u48=this$.#cur; return ($_u48==null) ? null : $_u48.version(); })(this));
  }

}

class UninstallCmd extends Command {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UninstallCmd.type$; }

  #query = null;

  query(it) {
    if (it === undefined) {
      return this.#query;
    }
    else {
      this.#query = it;
      return;
    }
  }

  name() {
    return "uninstall";
  }

  summary() {
    return "uninstall a pod from local env";
  }

  run() {
    const this$ = this;
    let specs = this.env().query(sys.ObjUtil.coerce(this.#query, sys.Str.type$));
    if (specs.isEmpty()) {
      this.out().printLine("No pods found");
      return;
    }
    ;
    this.out().printLine();
    specs.sort().each((spec) => {
      this$.printPodVersion(spec);
      return;
    });
    this.out().printLine();
    if (!this.checkDepends(specs)) {
      this.out().printLine();
      this.out().printLine("Cannot uninstall without breaking above dependencies");
      return;
    }
    ;
    let msg = ((this$) => { if (sys.ObjUtil.equals(specs.size(), 1)) return sys.Str.plus(sys.Str.plus("Uninstall ", specs.first().name()), "?"); return sys.Str.plus(sys.Str.plus("Uninstall ", sys.ObjUtil.coerce(specs.size(), sys.Obj.type$.toNullable())), " pods?"); })(this);
    if (!this.confirm(msg)) {
      return;
    }
    ;
    this.out().printLine();
    specs.each((spec) => {
      this$.delete(spec);
      return;
    });
    this.out().printLine();
    this.out().printLine(sys.Str.plus(sys.Str.plus("Uninstall successful (", sys.ObjUtil.coerce(specs.size(), sys.Obj.type$.toNullable())), " pods)"));
    return;
  }

  checkDepends(specs) {
    const this$ = this;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("fanr::PodSpec")).setList(specs, (s) => {
      return s.name();
    });
    let ok = true;
    this.env().queryAll().each((pod) => {
      if (map.get(pod.name()) != null) {
        return;
      }
      ;
      pod.depends().each((d) => {
        if (map.get(d.name()) != null) {
          this$.out().printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("ERROR: '", pod.name()), "' depends on '"), d.name()), "'"));
          (ok = false);
        }
        ;
        return;
      });
      return;
    });
    return ok;
  }

  delete(spec) {
    let file = sys.Env.cur().findPodFile(spec.name());
    this.out().print(sys.Str.plus(sys.Str.plus("Deleting ", file.osPath()), " ... ")).flush();
    file.delete();
    this.out().printLine("Complete");
    return;
  }

  static make() {
    const $self = new UninstallCmd();
    UninstallCmd.make$($self);
    return $self;
  }

  static make$($self) {
    Command.make$($self);
    return;
  }

}

class PublishCmd extends Command {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PublishCmd.type$; }

  #pod = null;

  pod(it) {
    if (it === undefined) {
      return this.#pod;
    }
    else {
      this.#pod = it;
      return;
    }
  }

  #file = null;

  // private field reflection only
  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #srcSpec = null;

  // private field reflection only
  __srcSpec(it) { if (it === undefined) return this.#srcSpec; else this.#srcSpec = it; }

  #pubSpec = null;

  // private field reflection only
  __pubSpec(it) { if (it === undefined) return this.#pubSpec; else this.#pubSpec = it; }

  name() {
    return "publish";
  }

  summary() {
    return "publish pod from env to repo";
  }

  run() {
    this.findFile();
    this.parseSpec();
    if (!this.confirm(sys.Str.plus("Publish ", this.#srcSpec))) {
      return;
    }
    ;
    this.publish();
    this.printResult();
    return;
  }

  findFile() {
    if ((sys.Str.contains(this.#pod, ".") || sys.Str.contains(this.#pod, "/") || sys.Str.contains(this.#pod, "\\"))) {
      this.#file = Command.parsePath(sys.ObjUtil.coerce(this.#pod, sys.Str.type$));
      if (!this.#file.exists()) {
        throw this.err(sys.Str.plus("Pod file not found: ", this.#file));
      }
      ;
    }
    else {
      this.#file = sys.Env.cur().findPodFile(sys.ObjUtil.coerce(this.#pod, sys.Str.type$));
      if (this.#file == null) {
        throw this.err(sys.Str.plus("Pod not found: ", this.#pod));
      }
      ;
    }
    ;
    return;
  }

  parseSpec() {
    try {
      this.#srcSpec = PodSpec.load(sys.ObjUtil.coerce(this.#file, sys.File.type$));
    }
    catch ($_u50) {
      $_u50 = sys.Err.make($_u50);
      if ($_u50 instanceof sys.Err) {
        let e = $_u50;
        ;
        throw this.err(sys.Str.plus("Invalid or corrupt pod file: ", this.#file), e);
      }
      else {
        throw $_u50;
      }
    }
    ;
    return;
  }

  publish() {
    this.#pubSpec = this.repo().publish(sys.ObjUtil.coerce(this.#file, sys.File.type$));
    return;
  }

  printResult() {
    this.out().printLine("Publish success:");
    this.out().printLine();
    this.printPodVersions(sys.List.make(PodSpec.type$.toNullable(), [this.#pubSpec]));
    return;
  }

  static make() {
    const $self = new PublishCmd();
    PublishCmd.make$($self);
    return $self;
  }

  static make$($self) {
    Command.make$($self);
    return;
  }

}

class ConfigCmd extends Command {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConfigCmd.type$; }

  name() {
    return "config";
  }

  summary() {
    return "print config and version info";
  }

  run() {
    const this$ = this;
    let config = sys.ObjUtil.typeof(this).pod().props(sys.Uri.fromStr("config.props"), sys.Duration.fromStr("1ms"));
    this.out().printLine("Fantom Repository Manager");
    this.out().printLine("Copyright (c) 2011, Brian Frank and Andy Frank");
    this.out().printLine("Licensed under the Academic Free License version 3.0");
    this.out().printLine();
    this.out().printLine(sys.Str.plus("sys.version:    ", sys.Str.type$.pod().version()));
    this.out().printLine(sys.Str.plus("fanr.version:   ", sys.ObjUtil.typeof(this).pod().version()));
    this.out().printLine(sys.Str.plus("env.platform:   ", sys.Env.cur().platform()));
    this.out().printLine(sys.Str.plus("env.home:       ", sys.Env.cur().homeDir()));
    this.out().printLine(sys.Str.plus("env.work:       ", sys.Env.cur().workDir()));
    this.out().printLine();
    config.keys().sort().each((key) => {
      let keyStr = sys.Str.padr(sys.Str.plus(sys.Str.plus("", key), ":"), 15);
      let val = config.get(key);
      this$.out().printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("", keyStr), " "), val));
      return;
    });
    return;
  }

  static make() {
    const $self = new ConfigCmd();
    ConfigCmd.make$($self);
    return $self;
  }

  static make$($self) {
    Command.make$($self);
    return;
  }

}

class QueryCmd extends Command {
  constructor() {
    super();
    const this$ = this;
    this.#numVersions = 5;
    return;
  }

  typeof() { return QueryCmd.type$; }

  #query = null;

  query(it) {
    if (it === undefined) {
      return this.#query;
    }
    else {
      this.#query = it;
      return;
    }
  }

  #numVersions = 0;

  numVersions(it) {
    if (it === undefined) {
      return this.#numVersions;
    }
    else {
      this.#numVersions = it;
      return;
    }
  }

  name() {
    return "query";
  }

  summary() {
    return "query repo to list pods available";
  }

  run() {
    const this$ = this;
    let specs = this.repo().query(sys.ObjUtil.coerce(this.#query, sys.Str.type$), this.#numVersions);
    if (specs.isEmpty()) {
      this.out().printLine("No pods found");
      return;
    }
    ;
    let byName = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("fanr::PodSpec[]"));
    specs.each((spec) => {
      byName.getOrAdd(spec.name(), () => {
        return sys.List.make(PodSpec.type$);
      }).add(spec);
      return;
    });
    byName.keys().sort().each((name) => {
      this$.printPodVersions(sys.ObjUtil.coerce(byName.get(name), sys.Type.find("fanr::PodSpec[]")));
      return;
    });
    return;
  }

  static make() {
    const $self = new QueryCmd();
    QueryCmd.make$($self);
    return $self;
  }

  static make$($self) {
    Command.make$($self);
    ;
    return;
  }

}

class WebRepoMod extends web.WebMod {
  constructor() {
    super();
    const this$ = this;
    this.#auth = PublicWebRepoAuth.make();
    this.#pingMeta = sys.ObjUtil.coerce(((this$) => { let $_u51 = sys.Map.__fromLiteral(["fanr.type","fanr.version"], [WebRepo.type$.toStr(),WebRepoMod.type$.pod().version().toStr()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u51 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["fanr.type","fanr.version"], [WebRepo.type$.toStr(),WebRepoMod.type$.pod().version().toStr()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this), sys.Type.find("[sys::Str:sys::Str]"));
    this.#tempDir = sys.Env.cur().tempDir();
    return;
  }

  typeof() { return WebRepoMod.type$; }

  #repo = null;

  repo() { return this.#repo; }

  __repo(it) { if (it === undefined) return this.#repo; else this.#repo = it; }

  #auth = null;

  auth() { return this.#auth; }

  __auth(it) { if (it === undefined) return this.#auth; else this.#auth = it; }

  #pingMeta = null;

  pingMeta() { return this.#pingMeta; }

  __pingMeta(it) { if (it === undefined) return this.#pingMeta; else this.#pingMeta = it; }

  #tempDir = null;

  tempDir() { return this.#tempDir; }

  __tempDir(it) { if (it === undefined) return this.#tempDir; else this.#tempDir = it; }

  static make(f) {
    const $self = new WebRepoMod();
    WebRepoMod.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    web.WebMod.make$($self);
    ;
    if (f != null) {
      sys.Func.call(f, $self);
    }
    ;
    return;
  }

  onService() {
    try {
      let user = this.authenticate();
      if (this.res().isDone()) {
        return;
      }
      ;
      let path = this.req().modRel().path();
      let cmd = ((this$) => { let $_u52 = path.getSafe(0); if ($_u52 != null) return $_u52; return "?"; })(this);
      if ((sys.ObjUtil.equals(cmd, "find") && sys.ObjUtil.equals(path.size(), 2))) {
        this.onFind(path.get(1), null, user);
        return;
      }
      ;
      if ((sys.ObjUtil.equals(cmd, "find") && sys.ObjUtil.equals(path.size(), 3))) {
        this.onFind(path.get(1), path.get(2), user);
        return;
      }
      ;
      if ((sys.ObjUtil.equals(cmd, "query") && sys.ObjUtil.equals(path.size(), 1))) {
        this.onQuery(user);
        return;
      }
      ;
      if ((sys.ObjUtil.equals(cmd, "pod") && sys.ObjUtil.equals(path.size(), 3))) {
        this.onPod(path.get(1), path.get(2), user);
        return;
      }
      ;
      if ((sys.ObjUtil.equals(cmd, "publish") && sys.ObjUtil.equals(path.size(), 1))) {
        this.onPublish(user);
        return;
      }
      ;
      if ((sys.ObjUtil.equals(cmd, "ping") && sys.ObjUtil.equals(path.size(), 1))) {
        this.onPing(user);
        return;
      }
      ;
      if ((sys.ObjUtil.equals(cmd, "auth") && sys.ObjUtil.equals(path.size(), 1))) {
        this.onAuth(user);
        return;
      }
      ;
      this.sendNotFoundErr();
    }
    catch ($_u53) {
      $_u53 = sys.Err.make($_u53);
      if ($_u53 instanceof sys.Err) {
        let e = $_u53;
        ;
        if (!this.res().isCommitted()) {
          this.sendErr(500, e.toStr());
        }
        else {
          throw e;
        }
        ;
      }
      else {
        throw $_u53;
      }
    }
    ;
    return;
  }

  authenticate() {
    let username = this.req().headers().get("Fanr-Username");
    if (username == null) {
      return null;
    }
    ;
    let user = this.#auth.user(sys.ObjUtil.coerce(username, sys.Str.type$));
    if (user == null) {
      this.sendUnauthErr(sys.Str.plus("Invalid username: ", username));
      return null;
    }
    ;
    let signAlgorithm = this.getRequiredHeader("Fanr-SignatureAlgorithm");
    let secretAlgorithm = sys.Str.upper(this.getRequiredHeader("Fanr-SecretAlgorithm"));
    let signature = this.getRequiredHeader("Fanr-Signature");
    let ts = sys.DateTime.fromStr(this.getRequiredHeader("Fanr-Ts"));
    if (sys.ObjUtil.compareGT(this.now().minusDateTime(sys.ObjUtil.coerce(ts, sys.DateTime.type$)).abs(), sys.Duration.fromStr("15min"))) {
      this.sendUnauthErr(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid timestamp window for signature: ", ts), " != "), this.now()));
      return null;
    }
    ;
    if (sys.ObjUtil.compareNE(signAlgorithm, "HMAC-SHA1")) {
      this.sendUnauthErr(sys.Str.plus("Unsupported signature algorithm: ", signAlgorithm));
      return null;
    }
    ;
    let s = WebRepo.toSignatureBody(this.req().method(), this.req().absUri(), this.req().headers());
    let secret = this.#auth.secret(user, secretAlgorithm);
    let expectedSignature = s.hmac("SHA-1", secret).toBase64();
    if (sys.ObjUtil.compareNE(expectedSignature, signature)) {
      this.sendUnauthErr("Invalid password (invalid signature)");
      return null;
    }
    ;
    return user;
  }

  onPing(user) {
    let props = this.#pingMeta.dup();
    props.set("ts", sys.DateTime.now().toStr());
    this.res().headers().set("Content-Type", "text/plain");
    util.JsonOutStream.make(this.res().out()).writeJson(props).flush();
    return;
  }

  onFind(podName,verStr,user) {
    if (!this.#auth.allowQuery(user, null)) {
      this.sendForbiddenErr(user);
      return;
    }
    ;
    let ver = null;
    if (verStr != null) {
      (ver = sys.Version.fromStr(sys.ObjUtil.coerce(verStr, sys.Str.type$), false));
      if (ver == null) {
        this.sendErr(404, sys.Str.plus("Invalid version: ", verStr));
        return;
      }
      ;
    }
    ;
    let spec = this.#repo.find(podName, ver, false);
    if (spec == null) {
      this.sendErr(404, sys.Str.plus(sys.Str.plus(sys.Str.plus("Pod not found: ", podName), "-"), ver));
      return;
    }
    ;
    if (!this.#auth.allowQuery(user, spec)) {
      this.sendForbiddenErr(user);
      return;
    }
    ;
    this.res().headers().set("Content-Type", "text/plain");
    this.printPodSpecJson(this.res().out(), sys.ObjUtil.coerce(spec, PodSpec.type$), false);
    return;
  }

  onQuery(user) {
    const this$ = this;
    if (!this.#auth.allowQuery(user, null)) {
      this.sendForbiddenErr(user);
      return;
    }
    ;
    let query = null;
    let $_u54 = this.req().method();
    if (sys.ObjUtil.equals($_u54, "GET")) {
      (query = ((this$) => { let $_u55 = this$.req().uri().queryStr(); if ($_u55 != null) return $_u55; throw sys.Err.make("Missing '?query' in URI"); })(this));
    }
    else if (sys.ObjUtil.equals($_u54, "POST")) {
      (query = this.req().in().readAllStr());
    }
    else {
      this.sendBadMethodErr();
    }
    ;
    let numVersions = ((this$) => { let $_u56 = sys.Int.fromStr(sys.ObjUtil.coerce(((this$) => { let $_u57 = this$.req().headers().get("Fanr-NumVersions"); if ($_u57 != null) return $_u57; return "3"; })(this$), sys.Str.type$), 10, false); if ($_u56 != null) return $_u56; return sys.ObjUtil.coerce(3, sys.Int.type$.toNullable()); })(this);
    let pods = null;
    try {
      (pods = this.#repo.query(sys.ObjUtil.coerce(query, sys.Str.type$), sys.ObjUtil.coerce(numVersions, sys.Int.type$)));
    }
    catch ($_u58) {
      $_u58 = sys.Err.make($_u58);
      if ($_u58 instanceof sys.ParseErr) {
        let e = $_u58;
        ;
        this.sendErr(400, e.toStr());
        return;
      }
      else {
        throw $_u58;
      }
    }
    ;
    (pods = pods.findAll((pod) => {
      return this$.#auth.allowQuery(user, pod);
    }));
    this.res().headers().set("Content-Type", "text/plain");
    let out = this.res().out();
    out.printLine("{\"pods\":[");
    pods.each((pod,i) => {
      this$.printPodSpecJson(out, pod, sys.ObjUtil.compareLT(sys.Int.plus(i, 1), pods.size()));
      return;
    });
    out.printLine("]}");
    return;
  }

  onPod(podName,podVer,user) {
    const this$ = this;
    if (!this.#auth.allowRead(user, null)) {
      this.sendForbiddenErr(user);
      return;
    }
    ;
    let query = sys.Str.plus(sys.Str.plus(sys.Str.plus("", podName), " "), podVer);
    let spec = this.#repo.query(query, 100).find((p) => {
      return sys.ObjUtil.equals(p.version().toStr(), podVer);
    });
    if (spec == null) {
      this.sendErr(404, sys.Str.plus("No pod match: ", query));
      return;
    }
    ;
    if (!this.#auth.allowRead(user, spec)) {
      this.sendForbiddenErr(user);
      return;
    }
    ;
    this.res().headers().set("Content-Type", "application/zip");
    if (spec.size() != null) {
      this.res().headers().set("Content-Length", sys.Int.toStr(sys.ObjUtil.coerce(spec.size(), sys.Int.type$)));
    }
    ;
    this.#repo.read(sys.ObjUtil.coerce(spec, PodSpec.type$)).pipe(this.res().out(), spec.size());
    return;
  }

  onPublish(user) {
    if (sys.ObjUtil.compareNE(this.req().method(), "POST")) {
      this.sendBadMethodErr();
      return;
    }
    ;
    if (!this.#auth.allowPublish(user, null)) {
      this.sendForbiddenErr(user);
      return;
    }
    ;
    let tempName = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("fanr-", sys.DateTime.now().toLocale("YYMMDDhhmmss")), "-"), sys.Buf.random(4).toHex()), ".pod");
    let tempFile = this.#tempDir.plus(sys.Str.toUri(tempName));
    try {
      let tempOut = tempFile.out();
      let len = ((this$) => { let $_u59 = ((this$) => { let $_u60 = this$.req().headers().get("Content-Length"); if ($_u60 == null) return null; return sys.Str.toInt(this$.req().headers().get("Content-Length")); })(this$); if ($_u59 != null) return $_u59; return null; })(this);
      try {
        this.req().in().pipe(tempOut, sys.ObjUtil.coerce(len, sys.Int.type$.toNullable()));
      }
      finally {
        tempOut.close();
      }
      ;
      let spec = PodSpec.load(tempFile);
      if (!this.#auth.allowPublish(user, spec)) {
        this.sendForbiddenErr(user);
        return;
      }
      ;
      (spec = this.#repo.publish(tempFile));
      this.res().headers().set("Content-Type", "text/plain");
      let out = this.res().out();
      out.printLine("{\"published\":");
      this.printPodSpecJson(out, spec, false);
      out.printLine("}");
    }
    finally {
      try {
        tempFile.delete();
      }
      catch ($_u61) {
      }
      ;
    }
    ;
    return;
  }

  onAuth(reqUser) {
    if (sys.ObjUtil.compareNE(this.req().method(), "GET")) {
      this.sendBadMethodErr();
      return;
    }
    ;
    let username = ((this$) => { let $_u62 = this$.req().uri().queryStr(); if ($_u62 != null) return $_u62; return "*"; })(this);
    let user = this.#auth.user(sys.ObjUtil.coerce(username, sys.Str.type$));
    let salt = this.#auth.salt(user);
    let secrets = this.#auth.secretAlgorithms().join(",");
    let signatures = this.#auth.signatureAlgorithms().join(",");
    this.res().headers().set("Content-Type", "text/plain");
    let out = this.res().out();
    out.printLine("{");
    out.printLine(sys.Str.plus(sys.Str.plus(" \"username\":", sys.Str.toCode(username)), ","));
    if (salt != null) {
      out.printLine(sys.Str.plus(sys.Str.plus(" \"salt\":", sys.Str.toCode(salt)), ","));
    }
    ;
    out.printLine(sys.Str.plus(sys.Str.plus(" \"secretAlgorithms\":", sys.Str.toCode(secrets)), ","));
    out.printLine(sys.Str.plus(sys.Str.plus(" \"signatureAlgorithms\":", sys.Str.toCode(signatures)), ","));
    out.printLine(sys.Str.plus(" \"ts\":", sys.Str.toCode(this.now().toStr())));
    out.printLine("}");
    return;
  }

  printPodSpecJson(out,pod,comma) {
    const this$ = this;
    out.printLine("{");
    let keys = pod.meta().keys();
    keys.moveTo("pod.name", 0);
    keys.moveTo("pod.version", 1);
    keys.each((k,j) => {
      let v = pod.meta().get(k);
      out.print(sys.Str.toCode(k)).print(":").print(sys.Str.toCode(v)).printLine(((this$) => { if (sys.ObjUtil.compareLT(sys.Int.plus(j, 1), keys.size())) return ","; return ""; })(this$));
      return;
    });
    out.printLine(((this$) => { if (comma) return "},"; return "}"; })(this));
    return;
  }

  getRequiredHeader(key) {
    return sys.ObjUtil.coerce(((this$) => { let $_u65 = this$.req().headers().get(key); if ($_u65 != null) return $_u65; throw sys.Err.make(sys.Str.plus("Missing required header ", sys.Str.toCode(key))); })(this), sys.Str.type$);
  }

  sendUnauthErr(msg) {
    this.sendErr(401, msg);
    return;
  }

  sendForbiddenErr(user) {
    if (user == null) {
      this.sendErr(401, "Authentication required");
    }
    else {
      this.sendErr(403, "Not allowed");
    }
    ;
    return;
  }

  sendNotFoundErr() {
    this.sendErr(404, sys.Str.plus("Resource not found: ", this.req().modRel()));
    return;
  }

  sendBadMethodErr() {
    this.sendErr(501, sys.Str.plus("Method not implemented: ", this.req().method()));
    return;
  }

  sendErr(code,msg) {
    this.res().statusCode(code);
    this.res().headers().set("Content-Type", "text/plain");
    sys.ObjUtil.coerce(this.res().out().printLine(sys.Str.plus(sys.Str.plus("{\"err\":", sys.Str.toCode(msg)), "}")), web.WebOutStream.type$).close();
    this.res().done();
    return;
  }

  now() {
    return sys.DateTime.nowUtc(null);
  }

}

class WebRepo extends Repo {
  constructor() {
    super();
    const this$ = this;
    this.#secret = concurrent.AtomicRef.make(null);
    this.#secretAlgorithm = concurrent.AtomicRef.make(null);
    this.#tsSkew = concurrent.AtomicRef.make(sys.Duration.fromStr("0ns"));
    return;
  }

  typeof() { return WebRepo.type$; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #username = null;

  // private field reflection only
  __username(it) { if (it === undefined) return this.#username; else this.#username = it; }

  #password = null;

  // private field reflection only
  __password(it) { if (it === undefined) return this.#password; else this.#password = it; }

  #secret = null;

  // private field reflection only
  __secret(it) { if (it === undefined) return this.#secret; else this.#secret = it; }

  #secretAlgorithm = null;

  // private field reflection only
  __secretAlgorithm(it) { if (it === undefined) return this.#secretAlgorithm; else this.#secretAlgorithm = it; }

  #tsSkew = null;

  // private field reflection only
  __tsSkew(it) { if (it === undefined) return this.#tsSkew; else this.#tsSkew = it; }

  static make(uri,username,password) {
    const $self = new WebRepo();
    WebRepo.make$($self,uri,username,password);
    return $self;
  }

  static make$($self,uri,username,password) {
    Repo.make$($self);
    ;
    $self.#uri = uri.plusSlash();
    $self.#username = username;
    $self.#password = sys.ObjUtil.coerce(((this$) => { let $_u66 = password; if ($_u66 != null) return $_u66; return ""; })($self), sys.Str.type$);
    return;
  }

  ping() {
    let c = this.prepare("GET", sys.Uri.fromStr("ping"));
    c.writeReq().readRes();
    return sys.ObjUtil.coerce(this.parseRes(c), sys.Type.find("[sys::Str:sys::Str]"));
  }

  find(podName,ver,checked) {
    if (checked === undefined) checked = true;
    let c = this.prepare("GET", ((this$) => { if (ver == null) return sys.Str.toUri(sys.Str.plus("find/", podName)); return sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus("find/", podName), "/"), ver)); })(this));
    c.writeReq().readRes();
    if (sys.ObjUtil.equals(c.resCode(), 404)) {
      if (checked) {
        throw sys.UnknownPodErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", podName), "-"), ver));
      }
      ;
      return null;
    }
    ;
    let jsonRes = this.parseRes(c);
    return PodSpec.make(sys.ObjUtil.coerce(jsonRes, sys.Type.find("[sys::Str:sys::Str]")), null);
  }

  query(query,numVersions) {
    if (numVersions === undefined) numVersions = 1;
    const this$ = this;
    let c = this.prepare("POST", sys.Uri.fromStr("query"), sys.Map.__fromLiteral(["Fanr-NumVersions"], [sys.Int.toStr(numVersions)], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    c.postStr(query);
    let jsonRes = this.parseRes(c);
    let jsonPods = sys.ObjUtil.coerce(((this$) => { let $_u68 = jsonRes.get("pods"); if ($_u68 != null) return $_u68; throw sys.Err.make("Missing 'pods' in JSON response"); })(this), sys.Type.find("[sys::Str:sys::Str][]"));
    let pods = sys.List.make(PodSpec.type$);
    pods.capacity(jsonPods.size());
    jsonPods.each((json) => {
      pods.add(PodSpec.make(json, null));
      return;
    });
    return pods;
  }

  read(spec) {
    let c = this.prepare("GET", sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus("pod/", spec.name()), "/"), spec.version())));
    c.writeReq().readRes();
    if (sys.ObjUtil.compareNE(c.resCode(), 200)) {
      this.parseRes(c);
    }
    ;
    return c.resIn();
  }

  publish(podFile) {
    let c = this.prepare("POST", sys.Uri.fromStr("publish"));
    c.reqHeaders().set("Content-Type", "application/zip");
    c.reqHeaders().set("Content-Length", sys.Int.toStr(sys.ObjUtil.coerce(podFile.size(), sys.Int.type$)));
    c.reqHeaders().set("Expect", "100-continue");
    c.writeReq();
    c.readRes();
    if (sys.ObjUtil.compareNE(c.resCode(), 100)) {
      this.parseRes(c);
    }
    ;
    podFile.in().pipe(c.reqOut(), podFile.size());
    c.reqOut().close();
    c.readRes();
    let jsonRes = this.parseRes(c);
    let jsonSpec = sys.ObjUtil.coerce(((this$) => { let $_u69 = jsonRes.get("published"); if ($_u69 != null) return $_u69; throw sys.Err.make("Missing 'published' in JSON response"); })(this), sys.Type.find("[sys::Str:sys::Str]"));
    return PodSpec.make(jsonSpec, null);
  }

  prepare(method,path,headers) {
    if (headers === undefined) headers = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str]"));
    const this$ = this;
    let c = web.WebClient.make(this.#uri.plus(path));
    c.reqMethod(method);
    headers.each((v,k) => {
      c.reqHeaders().set(k, v);
      return;
    });
    if (this.#username != null) {
      this.sign(c);
    }
    ;
    return c;
  }

  sign(c) {
    if (this.#secret.val() == null) {
      this.initForSigning();
    }
    ;
    let secret = sys.Buf.fromBase64(sys.ObjUtil.coerce(this.#secret.val(), sys.Str.type$));
    c.reqHeaders().set("Fanr-Username", sys.ObjUtil.coerce(this.#username, sys.Str.type$));
    c.reqHeaders().set("Fanr-SecretAlgorithm", sys.ObjUtil.coerce(this.#secretAlgorithm.val(), sys.Str.type$));
    c.reqHeaders().set("Fanr-SignatureAlgorithm", "HMAC-SHA1");
    c.reqHeaders().set("Fanr-Ts", sys.DateTime.nowUtc().plus(sys.ObjUtil.coerce(this.#tsSkew.val(), sys.Duration.type$)).toStr());
    let s = WebRepo.toSignatureBody(c.reqMethod(), c.reqUri(), c.reqHeaders());
    c.reqHeaders().set("Fanr-Signature", s.hmac("SHA1", secret).toBase64());
    return;
  }

  static toSignatureBody(method,uri,headers) {
    const this$ = this;
    let s = sys.Buf.make();
    s.printLine(sys.Str.upper(method));
    s.printLine(sys.Str.lower(uri.relToAuth().encode()));
    let keys = headers.keys().findAll((key) => {
      (key = sys.Str.lower(key));
      return (sys.Str.startsWith(key, "fanr-") && sys.ObjUtil.compareNE(key, "fanr-signature"));
    });
    keys.sort().each((key) => {
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(s.print(sys.Str.lower(key)), sys.Buf.type$.toNullable()).print(":"), sys.Buf.type$.toNullable()).printLine(headers.get(key));
      return;
    });
    return sys.ObjUtil.coerce(s, sys.Buf.type$);
  }

  initForSigning() {
    const this$ = this;
    let c = web.WebClient.make(this.#uri.plus(sys.Str.toUri(sys.Str.plus("auth?", this.#username))));
    c.writeReq().readRes();
    let res = this.parseRes(c);
    let ts = sys.DateTime.fromStr(sys.ObjUtil.coerce(((this$) => { let $_u70 = res.get("ts"); if ($_u70 != null) return $_u70; throw sys.Err.make("Response missing 'ts'"); })(this), sys.Str.type$));
    this.#tsSkew.val(ts.minusDateTime(sys.DateTime.now()));
    let sigAlgorithms = ((this$) => { let $_u71 = sys.ObjUtil.as(res.get("signatureAlgorithms"), sys.Str.type$); if ($_u71 != null) return $_u71; throw sys.Err.make("Response missing 'signatureAlgorithms'"); })(this);
    if (sys.Str.split(sigAlgorithms, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())).find((a) => {
      return sys.ObjUtil.equals(sys.Str.upper(a), "HMAC-SHA1");
    }) == null) {
      throw sys.Err.make(sys.Str.plus("Unsupported signature algorithms: ", sigAlgorithms));
    }
    ;
    let secretAlgorithms = ((this$) => { let $_u72 = sys.ObjUtil.as(res.get("secretAlgorithms"), sys.Str.type$); if ($_u72 != null) return $_u72; throw sys.Err.make("Response missing 'secretAlgorithms'"); })(this);
    this.#secret.val(sys.Str.split(secretAlgorithms, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())).eachWhile((a) => {
      this$.#secretAlgorithm.val((a = sys.Str.upper(a)));
      if (sys.ObjUtil.equals(a, "PASSWORD")) {
        return sys.ObjUtil.coerce(sys.Buf.make().print(this$.#password), sys.Buf.type$.toNullable()).toBase64();
      }
      ;
      if (sys.ObjUtil.equals(sys.Str.upper(a), "SALTED-HMAC-SHA1")) {
        let salt = ((this$) => { let $_u73 = res.get("salt"); if ($_u73 != null) return $_u73; throw sys.Err.make("Response missing 'salt'"); })(this$);
        return sys.ObjUtil.coerce(sys.Buf.make().print(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.#username), ":"), salt)), sys.Buf.type$.toNullable()).hmac("SHA-1", sys.Str.toBuf(this$.#password)).toBase64();
      }
      ;
      return null;
    }));
    if (this.#secret.val() == null) {
      throw sys.Err.make(sys.Str.plus("Unsupported secret algorithms: ", secretAlgorithms));
    }
    ;
    return;
  }

  parseRes(c) {
    let json = null;
    try {
      (json = util.JsonInStream.make(c.resIn()).readJson());
    }
    catch ($_u74) {
      $_u74 = sys.Err.make($_u74);
      if ($_u74 instanceof sys.Err) {
        let e = $_u74;
        ;
        throw RemoteErr.make(sys.Str.plus(sys.Str.plus("Cannot parse response as JSON [", sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable())), "]"), e);
      }
      else {
        throw $_u74;
      }
    }
    ;
    let map = sys.ObjUtil.as(json, sys.Type.find("[sys::Str:sys::Obj?]"));
    if (map == null) {
      throw RemoteErr.make(sys.Str.plus("Invalid JSON response: ", ((this$) => { let $_u75 = json; if ($_u75 == null) return null; return sys.ObjUtil.typeof(json); })(this)));
    }
    ;
    if (sys.ObjUtil.equals(sys.Int.div(c.resCode(), 100), 2)) {
      return sys.ObjUtil.coerce(map, sys.Type.find("[sys::Str:sys::Obj?]"));
    }
    ;
    let err = ((this$) => { let $_u76 = map.get("err"); if ($_u76 != null) return $_u76; return "Unknown error"; })(this);
    throw RemoteErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", err), " ["), sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable())), "]"));
  }

}

class RemoteErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RemoteErr.type$; }

  static make(msg,cause) {
    const $self = new RemoteErr();
    RemoteErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.ObjUtil.coerce(msg, sys.Str.type$), cause);
    return;
  }

}

class WebRepoAuth extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WebRepoAuth.type$; }

  signatureAlgorithms() {
    return sys.List.make(sys.Str.type$, ["HMAC-SHA1"]);
  }

  static make() {
    const $self = new WebRepoAuth();
    WebRepoAuth.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class PublicWebRepoAuth extends WebRepoAuth {
  constructor() {
    super();
    const this$ = this;
    this.#publicSalt = sys.Buf.random(16).toHex();
    return;
  }

  typeof() { return PublicWebRepoAuth.type$; }

  #publicSalt = null;

  // private field reflection only
  __publicSalt(it) { if (it === undefined) return this.#publicSalt; else this.#publicSalt = it; }

  user(username) {
    return null;
  }

  salt(user) {
    return this.#publicSalt;
  }

  secret(user,algorithm) {
    return sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$);
  }

  secretAlgorithms() {
    return sys.List.make(sys.Str.type$, ["PASSWORD", "SALTED-HMAC-SHA1"]);
  }

  allowQuery(u,p) {
    return true;
  }

  allowRead(u,p) {
    return true;
  }

  allowPublish(u,p) {
    return true;
  }

  static make() {
    const $self = new PublicWebRepoAuth();
    PublicWebRepoAuth.make$($self);
    return $self;
  }

  static make$($self) {
    WebRepoAuth.make$($self);
    ;
    return;
  }

}

class SimpleWebRepoAuth extends WebRepoAuth {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SimpleWebRepoAuth.type$; }

  #username = null;

  // private field reflection only
  __username(it) { if (it === undefined) return this.#username; else this.#username = it; }

  #userSalt = null;

  // private field reflection only
  __userSalt(it) { if (it === undefined) return this.#userSalt; else this.#userSalt = it; }

  #password = null;

  // private field reflection only
  __password(it) { if (it === undefined) return this.#password; else this.#password = it; }

  static make(username,password) {
    const $self = new SimpleWebRepoAuth();
    SimpleWebRepoAuth.make$($self,username,password);
    return $self;
  }

  static make$($self,username,password) {
    WebRepoAuth.make$($self);
    $self.#username = username;
    $self.#userSalt = sys.Buf.random(16).toHex();
    $self.#password = password;
    return;
  }

  user(username) {
    return ((this$) => { if (sys.ObjUtil.equals(username, this$.#username)) return this$; return null; })(this);
  }

  secret(user,algorithm) {
    if (sys.ObjUtil.compareNE(user, this)) {
      throw sys.Err.make(sys.Str.plus("Invalid user: ", user));
    }
    ;
    let $_u78 = algorithm;
    if (sys.ObjUtil.equals($_u78, "PASSWORD")) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print(this.#password), sys.Buf.type$.toNullable()), sys.Buf.type$);
    }
    else if (sys.ObjUtil.equals($_u78, "SALTED-HMAC-SHA1")) {
      return sys.ObjUtil.coerce(sys.Buf.make().print(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#username), ":"), this.#userSalt)), sys.Buf.type$.toNullable()).hmac("SHA-1", sys.Str.toBuf(this.#password));
    }
    else {
      throw sys.Err.make(sys.Str.plus("Unexpected secret algorithm: ", algorithm));
    }
    ;
  }

  salt(user) {
    return ((this$) => { if (user != null) return this$.#userSalt; return null; })(this);
  }

  secretAlgorithms() {
    return sys.List.make(sys.Str.type$, ["PASSWORD", "SALTED-HMAC-SHA1"]);
  }

  allowQuery(u,p) {
    return u != null;
  }

  allowRead(u,p) {
    return u != null;
  }

  allowPublish(u,p) {
    return u != null;
  }

}

class WebRepoMain extends util.AbstractMain {
  constructor() {
    super();
    const this$ = this;
    this.#httpPort = sys.ObjUtil.coerce(80, sys.Int.type$.toNullable());
    this.#httpsPort = null;
    this.#password = "";
    return;
  }

  typeof() { return WebRepoMain.type$; }

  #httpPort = null;

  httpPort(it) {
    if (it === undefined) {
      return this.#httpPort;
    }
    else {
      this.#httpPort = it;
      return;
    }
  }

  #httpsPort = null;

  httpsPort(it) {
    if (it === undefined) {
      return this.#httpsPort;
    }
    else {
      this.#httpsPort = it;
      return;
    }
  }

  #username = null;

  username(it) {
    if (it === undefined) {
      return this.#username;
    }
    else {
      this.#username = it;
      return;
    }
  }

  #password = null;

  password(it) {
    if (it === undefined) {
      return this.#password;
    }
    else {
      this.#password = it;
      return;
    }
  }

  #localRepo = null;

  localRepo(it) {
    if (it === undefined) {
      return this.#localRepo;
    }
    else {
      this.#localRepo = it;
      return;
    }
  }

  run() {
    const this$ = this;
    if (this.#username != null) {
      this.log().info("Running with authentication");
    }
    ;
    let mod = WebRepoMod.make((it) => {
      it.__repo(Repo.makeForUri(sys.Str.toUri(this$.#localRepo)));
      if (this$.#username != null) {
        it.__auth(SimpleWebRepoAuth.make(sys.ObjUtil.coerce(this$.#username, sys.Str.type$), sys.ObjUtil.coerce(this$.#password, sys.Str.type$)));
      }
      ;
      return;
    });
    let wisp = WebRepoMain.makeWispService(mod, sys.ObjUtil.coerce(this.#httpPort, sys.Int.type$), this.#httpsPort);
    return this.runServices(sys.List.make(sys.Service.type$, [wisp]));
  }

  static makeWispService(mod,httpPort,httpsPort) {
    let wispType = sys.Type.find("wisp::WispService");
    let wispHttpPort = wispType.field("httpPort");
    let wispHttpsPort = wispType.field("httpsPort");
    let wispRoot = wispType.field("root");
    return sys.ObjUtil.coerce(wispType.make(sys.List.make(sys.Type.find("|sys::Obj->sys::Void|"), [sys.Field.makeSetFunc(sys.Map.__fromLiteral([sys.ObjUtil.coerce(wispHttpPort, sys.Field.type$),sys.ObjUtil.coerce(wispHttpsPort, sys.Field.type$),sys.ObjUtil.coerce(wispRoot, sys.Field.type$)], [sys.ObjUtil.coerce(httpPort, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(httpsPort, sys.Obj.type$.toNullable()),mod], sys.Type.find("sys::Field"), sys.Type.find("sys::Obj?")))])), sys.Service.type$);
  }

  static make() {
    const $self = new WebRepoMain();
    WebRepoMain.make$($self);
    return $self;
  }

  static make$($self) {
    util.AbstractMain.make$($self);
    ;
    return;
  }

}

class WebRepoTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
    this.#auth = TestWebRepoAuth.make("bob", "123");
    this.#httpPort = 1972;
    this.#httpsPort = null;
    return;
  }

  typeof() { return WebRepoTest.type$; }

  #auth = null;

  auth(it) {
    if (it === undefined) {
      return this.#auth;
    }
    else {
      this.#auth = it;
      return;
    }
  }

  #wispService = null;

  wispService(it) {
    if (it === undefined) {
      return this.#wispService;
    }
    else {
      this.#wispService = it;
      return;
    }
  }

  #httpPort = 0;

  httpPort(it) {
    if (it === undefined) {
      return this.#httpPort;
    }
    else {
      this.#httpPort = it;
      return;
    }
  }

  #httpsPort = null;

  httpsPort(it) {
    if (it === undefined) {
      return this.#httpsPort;
    }
    else {
      this.#httpsPort = it;
      return;
    }
  }

  #pub = null;

  pub(it) {
    if (it === undefined) {
      return this.#pub;
    }
    else {
      this.#pub = it;
      return;
    }
  }

  #badUser = null;

  badUser(it) {
    if (it === undefined) {
      return this.#badUser;
    }
    else {
      this.#badUser = it;
      return;
    }
  }

  #badPass = null;

  badPass(it) {
    if (it === undefined) {
      return this.#badPass;
    }
    else {
      this.#badPass = it;
      return;
    }
  }

  #good = null;

  good(it) {
    if (it === undefined) {
      return this.#good;
    }
    else {
      this.#good = it;
      return;
    }
  }

  #webSpec = null;

  webSpec(it) {
    if (it === undefined) {
      return this.#webSpec;
    }
    else {
      this.#webSpec = it;
      return;
    }
  }

  setup() {
    const this$ = this;
    let fr = FileRepo.make(this.tempDir().uri());
    fr.publish(this.podFile("web"));
    fr.publish(this.podFile("wisp"));
    fr.publish(this.podFile("util"));
    let mod = WebRepoMod.make((it) => {
      it.__repo(fr);
      it.__auth(this$.#auth);
      it.__pingMeta(sys.ObjUtil.coerce(((this$) => { let $_u80 = it.pingMeta().dup().add("extra", "foo"); if ($_u80 == null) return null; return sys.ObjUtil.toImmutable(it.pingMeta().dup().add("extra", "foo")); })(this$), sys.Type.find("[sys::Str:sys::Str]")));
      return;
    });
    this.#wispService = WebRepoMain.makeWispService(mod, this.#httpPort, this.#httpsPort);
    sys.ObjUtil.trap(sys.ObjUtil.trap(this.#wispService,"log", sys.List.make(sys.Obj.type$.toNullable(), [])),"level", sys.List.make(sys.Obj.type$.toNullable(), [sys.LogLevel.silent()]));
    this.#wispService.start();
    this.#pub = Repo.makeForUri(sys.Str.toUri(sys.Str.plus(sys.Str.plus("http://localhost:", sys.ObjUtil.coerce(this.#httpPort, sys.Obj.type$.toNullable())), "/")));
    this.#good = Repo.makeForUri(sys.Str.toUri(sys.Str.plus(sys.Str.plus("http://localhost:", sys.ObjUtil.coerce(this.#httpPort, sys.Obj.type$.toNullable())), "/")), "bob", "123");
    this.#badUser = Repo.makeForUri(sys.Str.toUri(sys.Str.plus(sys.Str.plus("http://localhost:", sys.ObjUtil.coerce(this.#httpPort, sys.Obj.type$.toNullable())), "/")), "bad", "123");
    this.#badPass = Repo.makeForUri(sys.Str.toUri(sys.Str.plus(sys.Str.plus("http://localhost:", sys.ObjUtil.coerce(this.#httpPort, sys.Obj.type$.toNullable())), "/")), "bob", "bad");
    return;
  }

  teardown() {
    ((this$) => { let $_u81 = this$.#wispService; if ($_u81 == null) return null; return this$.#wispService.uninstall(); })(this);
    return;
  }

  podFile(podName) {
    return sys.Env.cur().homeDir().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("lib/fan/", podName), ".pod")));
  }

  test() {
    this.verifyPing();
    this.verifyFind();
    this.verifyQuery();
    this.verifyRead();
    this.verifyPublish();
    return;
  }

  verifyPing() {
    const this$ = this;
    this.verifyBadCredentials((r) => {
      r.ping();
      return;
    });
    this.doVerifyPing(sys.ObjUtil.coerce(this.#pub, Repo.type$));
    this.doVerifyPing(sys.ObjUtil.coerce(this.#good, Repo.type$));
    return;
  }

  doVerifyPing(r) {
    let p = r.ping();
    this.verifyEq(p.get("fanr.version"), sys.ObjUtil.typeof(this).pod().version().toStr());
    this.verifyEq(p.get("fanr.type"), WebRepo.type$.qname());
    this.verifyEq(p.get("extra"), "foo");
    this.verifyEq(sys.DateTime.fromStr(sys.ObjUtil.coerce(p.get("ts"), sys.Str.type$)).date(), sys.Date.today());
    return;
  }

  verifyFind() {
    const this$ = this;
    this.verifyBadCredentials((r) => {
      r.find("foo", sys.Version.fromStr("1.0"));
      return;
    });
    this.#auth.allowPublic().val(false);
    this.verifyAuthRequired((r) => {
      r.find("foo", sys.Version.fromStr("1.0"));
      return;
    });
    this.#auth.allowPublic().val(true);
    this.doVerifyFind(sys.ObjUtil.coerce(this.#pub, Repo.type$));
    this.#auth.allowUser().val(((this$) => { let $_u82 = false; this$.#auth.allowPublic().val($_u82); return $_u82; })(this));
    this.verifyForbidden((r) => {
      r.find("foo", sys.Version.fromStr("1.0"));
      return;
    });
    this.#auth.allowUser().val(true);
    this.doVerifyFind(sys.ObjUtil.coerce(this.#good, Repo.type$));
    return;
  }

  doVerifyFind(r) {
    const this$ = this;
    let wisp = sys.Pod.find("wisp");
    let $util = sys.Pod.find("util");
    let pod = r.find("wisp", wisp.version());
    this.verifyEq(pod.name(), "wisp");
    this.verifyEq(pod.version(), wisp.version());
    (pod = r.find("wisp", null));
    this.verifyEq(pod.name(), "wisp");
    this.verifyEq(pod.version(), wisp.version());
    let badVer = sys.Version.fromStr("28.99.1234");
    this.verifyEq(r.find("fooBarNotFound", sys.Version.fromStr("1.0.123"), false), null);
    this.verifyEq(r.find("wisp", badVer, false), null);
    this.verifyErr(sys.UnknownPodErr.type$, (it) => {
      r.find("wisp", badVer);
      return;
    });
    this.verifyErr(sys.UnknownPodErr.type$, (it) => {
      r.find("wisp", badVer, true);
      return;
    });
    this.verifyForbidden((x) => {
      x.find("util", $util.version());
      return;
    });
    return;
  }

  verifyQuery() {
    const this$ = this;
    this.verifyBadCredentials((r) => {
      r.query("*");
      return;
    });
    this.#auth.allowPublic().val(false);
    this.verifyAuthRequired((r) => {
      r.query("*");
      return;
    });
    this.#auth.allowPublic().val(true);
    this.doVerifyQuery(sys.ObjUtil.coerce(this.#pub, Repo.type$));
    this.#auth.allowUser().val(((this$) => { let $_u83 = false; this$.#auth.allowPublic().val($_u83); return $_u83; })(this));
    this.verifyForbidden((r) => {
      r.query("*");
      return;
    });
    this.#auth.allowUser().val(true);
    this.doVerifyQuery(sys.ObjUtil.coerce(this.#good, Repo.type$));
    return;
  }

  doVerifyQuery(r) {
    let pods = r.query("*").sort();
    this.verifyEq(sys.ObjUtil.coerce(pods.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(pods.get(0).name(), "web");
    this.verifyEq(pods.get(1).name(), "wisp");
    this.#webSpec = pods.get(0);
    return;
  }

  verifyRead() {
    const this$ = this;
    this.verifyBadCredentials((r) => {
      r.read(sys.ObjUtil.coerce(this$.#webSpec, PodSpec.type$));
      return;
    });
    this.#auth.allowPublic().val(false);
    this.verifyAuthRequired((r) => {
      r.read(sys.ObjUtil.coerce(this$.#webSpec, PodSpec.type$));
      return;
    });
    this.#auth.allowPublic().val(true);
    this.doVerifyRead(sys.ObjUtil.coerce(this.#pub, Repo.type$));
    this.#auth.allowUser().val(((this$) => { let $_u84 = false; this$.#auth.allowPublic().val($_u84); return $_u84; })(this));
    this.verifyForbidden((r) => {
      r.read(sys.ObjUtil.coerce(this$.#webSpec, PodSpec.type$));
      return;
    });
    this.#auth.allowUser().val(true);
    this.doVerifyRead(sys.ObjUtil.coerce(this.#good, Repo.type$));
    return;
  }

  doVerifyRead(r) {
    let temp = this.tempDir().plus(sys.Uri.fromStr("web-download.pod"));
    let out = temp.out();
    r.read(sys.ObjUtil.coerce(this.#webSpec, PodSpec.type$)).pipe(out);
    out.close();
    let spec = PodSpec.load(temp);
    this.verifyEq(spec.name(), "web");
    this.verifyEq(spec.meta().get("org.name"), "Fantom");
    return;
  }

  verifyPublish() {
    const this$ = this;
    let f = this.podFile("inet");
    this.verifyBadCredentials((r) => {
      r.publish(f);
      return;
    });
    this.#auth.allowPublic().val(false);
    this.verifyAuthRequired((r) => {
      r.publish(f);
      return;
    });
    this.#auth.allowPublic().val(true);
    this.doVerifyPublish(sys.ObjUtil.coerce(this.#pub, Repo.type$), f);
    (f = this.podFile("build"));
    this.#auth.allowUser().val(((this$) => { let $_u85 = false; this$.#auth.allowPublic().val($_u85); return $_u85; })(this));
    this.verifyForbidden((r) => {
      r.publish(f);
      return;
    });
    this.#auth.allowUser().val(true);
    this.doVerifyPublish(sys.ObjUtil.coerce(this.#good, Repo.type$), f);
    (f = this.podFile("util"));
    this.verifyForbidden((r) => {
      r.publish(f);
      return;
    });
    let pods = this.#good.query("*").sort();
    this.verifyEq(sys.ObjUtil.coerce(pods.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(pods.get(0).name(), "build");
    this.verifyEq(pods.get(1).name(), "inet");
    this.verifyEq(pods.get(2).name(), "web");
    this.verifyEq(pods.get(3).name(), "wisp");
    return;
  }

  doVerifyPublish(r,f) {
    let spec = r.publish(f);
    this.verifyEq(spec.name(), f.basename());
    return;
  }

  verifyBadCredentials(f) {
    this.verifyAuthErr("Invalid username: bad [401]", sys.ObjUtil.coerce(this.#badUser, Repo.type$), f);
    this.verifyAuthErr("Invalid password (invalid signature) [401]", sys.ObjUtil.coerce(this.#badPass, Repo.type$), f);
    return;
  }

  verifyAuthRequired(f) {
    this.verifyAuthErr("Authentication required [401]", sys.ObjUtil.coerce(this.#pub, Repo.type$), f);
    return;
  }

  verifyForbidden(f) {
    this.verifyAuthErr("Not allowed [403]", sys.ObjUtil.coerce(this.#good, Repo.type$), f);
    return;
  }

  verifyAuthErr(msg,r,f) {
    let err = null;
    try {
      sys.Func.call(f, r);
    }
    catch ($_u86) {
      $_u86 = sys.Err.make($_u86);
      if ($_u86 instanceof sys.Err) {
        let e = $_u86;
        ;
        (err = e);
      }
      else {
        throw $_u86;
      }
    }
    ;
    if (err == null) {
      this.fail(sys.Str.plus("No err raised: ", msg));
    }
    ;
    if (!sys.ObjUtil.is(err, RemoteErr.type$)) {
      err.trace();
    }
    ;
    this.verifyEq(sys.ObjUtil.typeof(err), RemoteErr.type$);
    this.verifyEq(err.msg(), msg);
    return;
  }

  static make() {
    const $self = new WebRepoTest();
    WebRepoTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    ;
    return;
  }

}

class TestWebRepoAuth extends SimpleWebRepoAuth {
  constructor() {
    super();
    const this$ = this;
    this.#allowPublic = concurrent.AtomicBool.make(false);
    this.#allowUser = concurrent.AtomicBool.make(false);
    return;
  }

  typeof() { return TestWebRepoAuth.type$; }

  #allowPublic = null;

  allowPublic() { return this.#allowPublic; }

  __allowPublic(it) { if (it === undefined) return this.#allowPublic; else this.#allowPublic = it; }

  #allowUser = null;

  allowUser() { return this.#allowUser; }

  __allowUser(it) { if (it === undefined) return this.#allowUser; else this.#allowUser = it; }

  static make(u,p) {
    const $self = new TestWebRepoAuth();
    TestWebRepoAuth.make$($self,u,p);
    return $self;
  }

  static make$($self,u,p) {
    SimpleWebRepoAuth.make$($self, u, p);
    ;
    return;
  }

  allowQuery(u,p) {
    return this.allow(u, p);
  }

  allowRead(u,p) {
    return this.allow(u, p);
  }

  allowPublish(u,p) {
    return this.allow(u, p);
  }

  allow(u,p) {
    if (sys.ObjUtil.equals(((this$) => { let $_u87=p; return ($_u87==null) ? null : $_u87.name(); })(this), "util")) {
      return false;
    }
    ;
    return (this.#allowPublic.val() || (u != null && this.#allowUser.val()));
  }

}

class QueryTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return QueryTest.type$; }

  testTokenizer() {
    const this$ = this;
    this.verifyToks("", sys.List.make(sys.Obj.type$.toNullable()));
    this.verifyToks("x", sys.List.make(sys.Obj.type$, [Token.id(), "x"]));
    this.verifyToks("fooBar", sys.List.make(sys.Obj.type$, [Token.id(), "fooBar"]));
    this.verifyToks("fooBar1999x", sys.List.make(sys.Obj.type$, [Token.id(), "fooBar1999x"]));
    this.verifyToks("foo_23", sys.List.make(sys.Obj.type$, [Token.id(), "foo_23"]));
    this.verifyToks("5", sys.List.make(sys.Obj.type$, [Token.int(), sys.ObjUtil.coerce(5, sys.Obj.type$)]));
    this.verifyToks("123_456", sys.List.make(sys.Obj.type$, [Token.int(), sys.ObjUtil.coerce(123456, sys.Obj.type$)]));
    this.verifyToks("2009-10-04", sys.List.make(sys.Obj.type$.toNullable(), [Token.date(), sys.Date.make(2009, sys.Month.oct(), 4)]));
    this.verifyToks("1.2", sys.List.make(sys.Obj.type$.toNullable(), [Token.version(), sys.Version.fromStr("1.2")]));
    this.verifyToks("1.2.3.4", sys.List.make(sys.Obj.type$.toNullable(), [Token.version(), sys.Version.fromStr("1.2.3.4")]));
    this.verifyToks("\"\"", sys.List.make(sys.Obj.type$.toNullable(), [Token.str(), ""]));
    this.verifyToks("\"x y\"", sys.List.make(sys.Obj.type$.toNullable(), [Token.str(), "x y"]));
    this.verifyToks("\"x\\\"y\"", sys.List.make(sys.Obj.type$.toNullable(), [Token.str(), "x\"y"]));
    this.verifyToks("\"_\\u012f \\n \\t \\\\_\"", sys.List.make(sys.Obj.type$.toNullable(), [Token.str(), "_\u012f \n \t \\_"]));
    this.verifyToks("''", sys.List.make(sys.Obj.type$.toNullable(), [Token.str(), ""]));
    this.verifyToks("'x y'", sys.List.make(sys.Obj.type$.toNullable(), [Token.str(), "x y"]));
    this.verifyToks("'x\\'y'", sys.List.make(sys.Obj.type$.toNullable(), [Token.str(), "x'y"]));
    this.verifyToks("'_\\u012f \\n \\t \\\\_'", sys.List.make(sys.Obj.type$.toNullable(), [Token.str(), "_\u012f \n \t \\_"]));
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.verifyToks("\"fo..", sys.List.make(sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.verifyToks("`fo..", sys.List.make(sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.verifyToks("\"\\u345x\"", sys.List.make(sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.verifyToks("\"\\ua\"", sys.List.make(sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.verifyToks("\"\\u234\"", sys.List.make(sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.verifyToks("#", sys.List.make(sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.verifyToks("2.x", sys.List.make(sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.verifyToks("11-03-05", sys.List.make(sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.verifyToks("2.5.@6", sys.List.make(sys.Obj.type$.toNullable()));
      return;
    });
    return;
  }

  verifyToks(src,toks) {
    let t = Tokenizer.make(src);
    let acc = sys.List.make(sys.Obj.type$.toNullable());
    while (true) {
      let x = t.next();
      if (sys.ObjUtil.equals(x, Token.eof())) {
        break;
      }
      ;
      acc.add(t.tok()).add(t.val());
    }
    ;
    this.verifyEq(sys.List.make(sys.Obj.type$.toNullable()).addAll(acc), sys.List.make(sys.Obj.type$.toNullable()).addAll(toks));
    return;
  }

  testParser() {
    const this$ = this;
    this.verifyParser("foo", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["foo"])]));
    this.verifyParser("foo_Bar_22", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["foo_Bar_22"])]));
    this.verifyParser("*", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["*"])]));
    this.verifyParser("*foo", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["*foo"])]));
    this.verifyParser("foo*", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["foo*"])]));
    this.verifyParser("*foo_bar*", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["*foo_bar*"])]));
    this.verifyParser("foo 2", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", sys.Depend.fromStr("v 2")])]));
    this.verifyParser("foo 10.20", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", sys.Depend.fromStr("v 10.20")])]));
    this.verifyParser("foo 10.20.30", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", sys.Depend.fromStr("v 10.20.30")])]));
    this.verifyParser("foo 2+", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", sys.Depend.fromStr("v 2+")])]));
    this.verifyParser("foo 2.3+", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", sys.Depend.fromStr("v 2.3+")])]));
    this.verifyParser("foo 1.0-1.3", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", sys.Depend.fromStr("v 1.0-1.3")])]));
    this.verifyParser("foo 1.0,1.3", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", sys.Depend.fromStr("v 1.0,1.3")])]));
    this.verifyParser("foo 1.0-2.0,3.2+", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", sys.Depend.fromStr("v 1.0-2.0,3.2+")])]));
    this.verifyParser("foo a.b", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", null, sys.List.make(QueryMeta.type$, [QueryMeta.make("a.b", QueryOp.has(), null)])])]));
    this.verifyParser("foo a.b == 123", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", null, sys.List.make(QueryMeta.type$, [QueryMeta.make("a.b", QueryOp.eq(), sys.ObjUtil.coerce(123, sys.Obj.type$.toNullable()))])])]));
    this.verifyParser("foo a.b != 123", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", null, sys.List.make(QueryMeta.type$, [QueryMeta.make("a.b", QueryOp.notEq(), sys.ObjUtil.coerce(123, sys.Obj.type$.toNullable()))])])]));
    this.verifyParser("foo a.b ~= 'bar baz'", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", null, sys.List.make(QueryMeta.type$, [QueryMeta.make("a.b", QueryOp.like(), "bar baz")])])]));
    this.verifyParser("foo a.b < 2010-01-01", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", null, sys.List.make(QueryMeta.type$, [QueryMeta.make("a.b", QueryOp.lt(), sys.Date.fromStr("2010-01-01"))])])]));
    this.verifyParser("foo a.b <= 9", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", null, sys.List.make(QueryMeta.type$, [QueryMeta.make("a.b", QueryOp.ltEq(), sys.ObjUtil.coerce(9, sys.Obj.type$.toNullable()))])])]));
    this.verifyParser("foo a.b >= 9", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", null, sys.List.make(QueryMeta.type$, [QueryMeta.make("a.b", QueryOp.gtEq(), sys.ObjUtil.coerce(9, sys.Obj.type$.toNullable()))])])]));
    this.verifyParser("foo a.b > 9", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", null, sys.List.make(QueryMeta.type$, [QueryMeta.make("a.b", QueryOp.gt(), sys.ObjUtil.coerce(9, sys.Obj.type$.toNullable()))])])]));
    this.verifyParser("foo a.b > 2 a.b < 10", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", null, sys.List.make(QueryMeta.type$, [QueryMeta.make("a.b", QueryOp.gt(), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())), QueryMeta.make("a.b", QueryOp.lt(), sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()))])])]));
    this.verifyParser("foo a.b > -9", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", null, sys.List.make(QueryMeta.type$, [QueryMeta.make("a.b", QueryOp.gt(), sys.ObjUtil.coerce(-9, sys.Obj.type$.toNullable()))])])]));
    this.verifyParser("foo, bar", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["foo"]), sys.List.make(sys.Str.type$, ["bar"])]));
    this.verifyParser("foo,bar,*goo", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["foo"]), sys.List.make(sys.Str.type$, ["bar"]), sys.List.make(sys.Str.type$, ["*goo"])]));
    this.verifyParser("foo 1.2,1.4, bar", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", sys.Depend.fromStr("v 1.2,1.4")]), sys.List.make(sys.Str.type$, ["bar"])]));
    this.verifyParser("foo 1.2,1.4 a.ver ~= 20.3, bar", sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), ["foo", sys.Depend.fromStr("v 1.2,1.4"), sys.List.make(QueryMeta.type$, [QueryMeta.make("a.ver", QueryOp.like(), sys.Version.fromStr("20.3"))])]), sys.List.make(sys.Str.type$, ["bar"])]));
    this.verifyEq(Query.fromStr("2", false), null);
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Query.fromStr("2", true);
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Query.fromStr("2");
      return;
    });
    return;
  }

  verifyParser(input,parts) {
    const this$ = this;
    let q = Query.fromStr(input);
    this.verifyEq(sys.ObjUtil.coerce(q.parts().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(parts.size(), sys.Obj.type$.toNullable()));
    q.parts().each((actual,i) => {
      let expected = parts.get(i);
      this$.verifyEq(actual.namePattern(), expected.get(0));
      this$.verifyEq(actual.version(), expected.getSafe(1));
      this$.verifyEq(actual.metas(), ((this$) => { let $_u88 = expected.getSafe(2); if ($_u88 != null) return $_u88; return sys.List.make(QueryMeta.type$); })(this$));
      return;
    });
    return;
  }

  testInclude() {
    this.verifyInclude("fooBar", this.spec("fooBar", "1.0.34"), true);
    this.verifyInclude("foobar", this.spec("fooBar", "1.0.34"), false);
    this.verifyInclude("fooBar", this.spec("foo", "1.0.34"), false);
    this.verifyInclude("foo*", this.spec("foo", "1.0.34"), true);
    this.verifyInclude("*", this.spec("fooBar", "1.0.34"), true);
    this.verifyInclude("foo*", this.spec("fooBar", "1.0.34"), true);
    this.verifyInclude("foo*", this.spec("foxBar", "1.0.34"), false);
    this.verifyInclude("*Bar", this.spec("fooBar", "1.0.34"), true);
    this.verifyInclude("*Bar", this.spec("fooXar", "1.0.34"), false);
    this.verifyInclude("acme*Ext", this.spec("acmeFooExt", "1.0.34"), true);
    this.verifyInclude("acme*Ext", this.spec("incFooExt", "1.0.34"), false);
    this.verifyInclude("acme*Ext", this.spec("acmeFoo", "1.0.34"), false);
    this.verifyInclude("foo 1.0", this.spec("foo", "1.0.34"), true);
    this.verifyInclude("foo 1.0", this.spec("bar", "1.0.34"), false);
    this.verifyInclude("foo 1.0", this.spec("foo", "1.1"), false);
    this.verifyInclude("foo 1.0.13+", this.spec("foo", "1.0.12"), false);
    this.verifyInclude("foo 1.0.13+", this.spec("foo", "1.0.13"), true);
    this.verifyInclude("foo 1.0.13+", this.spec("foo", "1.3.22"), true);
    this.verifyInclude("foo 1.1,1.3", this.spec("foo", "1.1.100"), true);
    this.verifyInclude("foo 1.1,1.3", this.spec("foo", "1.2.100"), false);
    this.verifyInclude("foo 1.1,1.3", this.spec("foo", "1.3.100"), true);
    this.verifyInclude("foo 1.1-1.3", this.spec("foo", "1.1.100"), true);
    this.verifyInclude("foo 1.1-1.3", this.spec("foo", "1.2.100"), true);
    this.verifyInclude("foo 1.1-1.3", this.spec("foo", "1.3.100"), true);
    this.verifyInclude("foo 1.1-1.3", this.spec("foo", "1.4.100"), false);
    this.verifyInclude("foo a.b", this.spec("foo", "1.0"), false);
    this.verifyInclude("foo a.b", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["xxx"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), true);
    this.verifyInclude("foo a.b", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["true"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), true);
    this.verifyInclude("foo a.b", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["false"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), false);
    let ts = "2011-05-09T13:51:31.2-04:00 New_York";
    this.verifyIncludeEq("foo a.b=='hi'", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["HI"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), false);
    this.verifyIncludeEq("foo a.b=='hi'", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["hi"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), true);
    this.verifyIncludeEq("foo a.b==123", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["hi"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), false);
    this.verifyIncludeEq("foo a.b==123", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["12"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), false);
    this.verifyIncludeEq("foo a.b==123", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["123"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), true);
    this.verifyIncludeEq("foo a.b==2011-05-08", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["hi"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), false);
    this.verifyIncludeEq("foo a.b==2011-05-08", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], [ts], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), false);
    this.verifyIncludeEq("foo a.b==2011-05-09", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], [ts], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), true);
    this.verifyIncludeEq("foo a.b==10.3", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["hi"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), false);
    this.verifyIncludeEq("foo a.b==10.3", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["1.3"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), false);
    this.verifyIncludeEq("foo a.b==10.3", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["10.3"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), true);
    this.verifyInclude("foo a.b~='Foo'", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["fo"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), false);
    this.verifyInclude("foo a.b~='Foo'", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["33"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), false);
    this.verifyInclude("foo a.b~='Foo'", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["Foo"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), true);
    this.verifyInclude("foo a.b~='Foo'", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["FOOL"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), true);
    this.verifyInclude("foo a.b~='Foo'", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["it Foo"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), true);
    this.verifyIncludeCmp("foo a.b ? 10", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["xyz"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), null);
    this.verifyIncludeCmp("foo a.b ? 10", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["8"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), sys.ObjUtil.coerce(-1, sys.Int.type$.toNullable()));
    this.verifyIncludeCmp("foo a.b ? 10", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["10"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()));
    this.verifyIncludeCmp("foo a.b ? 10", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["12"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), sys.ObjUtil.coerce(1, sys.Int.type$.toNullable()));
    this.verifyIncludeCmp("foo a.b ? 2011-05-08", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["not ts"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), null);
    this.verifyIncludeCmp("foo a.b ? 2011-05-10", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], [ts], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), sys.ObjUtil.coerce(-1, sys.Int.type$.toNullable()));
    this.verifyIncludeCmp("foo a.b ? 2011-05-09", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], [ts], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()));
    this.verifyIncludeCmp("foo a.b ? 2011-05-08", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], [ts], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), sys.ObjUtil.coerce(1, sys.Int.type$.toNullable()));
    this.verifyIncludeCmp("foo a.b ? 2.3", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["xyz"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), null);
    this.verifyIncludeCmp("foo a.b ? 2.3", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["2.2"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), sys.ObjUtil.coerce(-1, sys.Int.type$.toNullable()));
    this.verifyIncludeCmp("foo a.b ? 2.3", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["2.3"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()));
    this.verifyIncludeCmp("foo a.b ? 2.3", this.spec("foo", "1.0", sys.Map.__fromLiteral(["a.b"], ["2.3.22"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), sys.ObjUtil.coerce(1, sys.Int.type$.toNullable()));
    return;
  }

  verifyIncludeEq(query,spec,expected) {
    this.verifyInclude(query, spec, expected);
    this.verifyInclude(sys.Str.replace(query, "==", "!="), spec, !expected);
    return;
  }

  verifyIncludeCmp(query,spec,expected) {
    this.verifyInclude(sys.Str.replace(query, "?", "<"), spec, sys.ObjUtil.equals(expected, -1));
    this.verifyInclude(sys.Str.replace(query, "?", "<="), spec, (sys.ObjUtil.equals(expected, -1) || sys.ObjUtil.equals(expected, 0)));
    this.verifyInclude(sys.Str.replace(query, "?", ">="), spec, (sys.ObjUtil.equals(expected, 1) || sys.ObjUtil.equals(expected, 0)));
    this.verifyInclude(sys.Str.replace(query, "?", ">"), spec, sys.ObjUtil.equals(expected, 1));
    return;
  }

  verifyInclude(query,spec,expected) {
    this.verifyEq(sys.ObjUtil.coerce(Query.fromStr(query).include(spec), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected, sys.Obj.type$.toNullable()));
    return;
  }

  spec(name,ver,meta) {
    if (meta === undefined) meta = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    meta.set("pod.name", name);
    meta.set("pod.version", ver);
    meta.set("pod.depends", "");
    meta.set("pod.summary", "test pod");
    return PodSpec.make(meta, null);
  }

  static make() {
    const $self = new QueryTest();
    QueryTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

const p = sys.Pod.add$('fanr');
const xp = sys.Param.noParams$();
let m;
Repo.type$ = p.at$('Repo','sys::Obj',[],{},8195,Repo);
FanrEnv.type$ = p.at$('FanrEnv','sys::Obj',[],{},8192,FanrEnv);
PodSpec.type$ = p.at$('PodSpec','sys::Obj',[],{},8194,PodSpec);
FileRepoDb.type$ = p.at$('FileRepoDb','sys::Obj',[],{},128,FileRepoDb);
PodDir.type$ = p.at$('PodDir','sys::Obj',[],{},128,PodDir);
FileRepoMsg.type$ = p.at$('FileRepoMsg','sys::Obj',[],{},130,FileRepoMsg);
FileRepo.type$ = p.at$('FileRepo','fanr::Repo',[],{},130,FileRepo);
Tokenizer.type$ = p.at$('Tokenizer','sys::Obj',[],{},128,Tokenizer);
Token.type$ = p.at$('Token','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},170,Token);
Query.type$ = p.at$('Query','sys::Obj',[],{},8194,Query);
QueryPart.type$ = p.at$('QueryPart','sys::Obj',[],{},130,QueryPart);
QueryMeta.type$ = p.at$('QueryMeta','sys::Obj',[],{},130,QueryMeta);
QueryOp.type$ = p.at$('QueryOp','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},170,QueryOp);
Parser.type$ = p.at$('Parser','sys::Obj',[],{},128,Parser);
Command.type$ = p.at$('Command','sys::Obj',[],{},8193,Command);
CommandErr.type$ = p.at$('CommandErr','sys::Err',[],{},130,CommandErr);
CommandArg.type$ = p.at$('CommandArg','sys::Obj',['sys::Facet'],{'sys::Serializable':""},8242,CommandArg);
CommandOpt.type$ = p.at$('CommandOpt','sys::Obj',['sys::Facet'],{'sys::Serializable':""},8242,CommandOpt);
HelpCmd.type$ = p.at$('HelpCmd','fanr::Command',[],{},128,HelpCmd);
EnvCmd.type$ = p.at$('EnvCmd','fanr::Command',[],{},128,EnvCmd);
Main.type$ = p.at$('Main','sys::Obj',[],{'sys::NoDoc':""},8192,Main);
PingCmd.type$ = p.at$('PingCmd','fanr::Command',[],{},128,PingCmd);
InstallCmd.type$ = p.at$('InstallCmd','fanr::Command',[],{},128,InstallCmd);
InstallItem.type$ = p.at$('InstallItem','sys::Obj',[],{},128,InstallItem);
UninstallCmd.type$ = p.at$('UninstallCmd','fanr::Command',[],{},128,UninstallCmd);
PublishCmd.type$ = p.at$('PublishCmd','fanr::Command',[],{},128,PublishCmd);
ConfigCmd.type$ = p.at$('ConfigCmd','fanr::Command',[],{},128,ConfigCmd);
QueryCmd.type$ = p.at$('QueryCmd','fanr::Command',[],{},128,QueryCmd);
WebRepoMod.type$ = p.at$('WebRepoMod','web::WebMod',[],{},8194,WebRepoMod);
WebRepo.type$ = p.at$('WebRepo','fanr::Repo',[],{},130,WebRepo);
RemoteErr.type$ = p.at$('RemoteErr','sys::Err',[],{},130,RemoteErr);
WebRepoAuth.type$ = p.at$('WebRepoAuth','sys::Obj',[],{},8195,WebRepoAuth);
PublicWebRepoAuth.type$ = p.at$('PublicWebRepoAuth','fanr::WebRepoAuth',[],{},130,PublicWebRepoAuth);
SimpleWebRepoAuth.type$ = p.at$('SimpleWebRepoAuth','fanr::WebRepoAuth',[],{},130,SimpleWebRepoAuth);
WebRepoMain.type$ = p.at$('WebRepoMain','util::AbstractMain',[],{'sys::NoDoc':""},8192,WebRepoMain);
WebRepoTest.type$ = p.at$('WebRepoTest','sys::Test',[],{},8192,WebRepoTest);
TestWebRepoAuth.type$ = p.at$('TestWebRepoAuth','fanr::SimpleWebRepoAuth',[],{},130,TestWebRepoAuth);
QueryTest.type$ = p.at$('QueryTest','sys::Test',[],{},8192,QueryTest);
Repo.type$.am$('makeForUri',40962,'fanr::Repo',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('username','sys::Str?',true),new sys.Param('password','sys::Str?',true)]),{}).am$('uri',270337,'sys::Uri',xp,{}).am$('ping',270337,'[sys::Str:sys::Str]',xp,{}).am$('find',270337,'fanr::PodSpec?',sys.List.make(sys.Param.type$,[new sys.Param('podName','sys::Str',false),new sys.Param('version','sys::Version?',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('query',270337,'fanr::PodSpec[]',sys.List.make(sys.Param.type$,[new sys.Param('query','sys::Str',false),new sys.Param('numVersions','sys::Int',true)]),{}).am$('read',270337,'sys::InStream',sys.List.make(sys.Param.type$,[new sys.Param('pod','fanr::PodSpec',false)]),{}).am$('publish',270337,'fanr::PodSpec',sys.List.make(sys.Param.type$,[new sys.Param('podFile','sys::File',false)]),{}).am$('toStr',9216,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
FanrEnv.type$.af$('env',73730,'sys::Env',{}).af$('byName',67584,'[sys::Str:fanr::PodSpec?]',{}).af$('queryAll$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','sys::Env',true)]),{}).am$('find',8192,'fanr::PodSpec?',sys.List.make(sys.Param.type$,[new sys.Param('podName','sys::Str',false)]),{}).am$('query',8192,'fanr::PodSpec[]',sys.List.make(sys.Param.type$,[new sys.Param('query','sys::Str',false)]),{}).am$('queryAll',532480,'fanr::PodSpec[]',xp,{}).am$('queryAll$Once',133120,'fanr::PodSpec[]',xp,{});
PodSpec.type$.af$('name',73730,'sys::Str',{}).af$('version',73730,'sys::Version',{}).af$('depends',73730,'sys::Depend[]',{}).af$('summary',73730,'sys::Str',{}).af$('meta',73730,'[sys::Str:sys::Str]',{}).af$('file',73730,'sys::File?',{'sys::NoDoc':""}).af$('toStr',336898,'sys::Str',{}).am$('load',40962,'fanr::PodSpec',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('read',40962,'fanr::PodSpec',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('doLoad',34818,'fanr::PodSpec',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('src','sys::File?',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('m','[sys::Str:sys::Str]',false),new sys.Param('file','sys::File?',false)]),{'sys::NoDoc':""}).am$('getReq',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('m','[sys::Str:sys::Str]',false),new sys.Param('n','sys::Str',false)]),{}).am$('parseDepends',34818,'sys::Depend[]',sys.List.make(sys.Param.type$,[new sys.Param('m','[sys::Str:sys::Str]',false)]),{}).am$('size',8192,'sys::Int?',xp,{}).am$('ts',8192,'sys::DateTime?',xp,{}).am$('hash',9216,'sys::Int',xp,{}).am$('equals',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj?',false)]),{}).am$('containsCode',8192,'sys::Bool',xp,{'sys::NoDoc':""});
FileRepoDb.type$.af$('repo',73730,'fanr::FileRepo',{}).af$('dir',73730,'sys::File',{}).af$('log',73730,'sys::Log',{}).af$('podDirs',67584,'[sys::Str:fanr::PodDir]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('repo','fanr::FileRepo',false)]),{}).am$('dispatch',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','fanr::FileRepoMsg',false)]),{}).am$('load',2048,'sys::Obj?',xp,{}).am$('loadPod',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dir','sys::File',false)]),{}).am$('loadAll',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('podDir','fanr::PodDir',false)]),{}).am$('refresh',2048,'sys::Obj?',xp,{}).am$('find',2048,'fanr::PodSpec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('ver','sys::Version?',false)]),{}).am$('query',2048,'sys::Unsafe',sys.List.make(sys.Param.type$,[new sys.Param('query','sys::Str',false),new sys.Param('numVersions','sys::Int',false)]),{}).am$('publish',2048,'fanr::PodSpec',sys.List.make(sys.Param.type$,[new sys.Param('inputFile','sys::File',false)]),{});
PodDir.type$.af$('dir',73730,'sys::File',{}).af$('cur',73728,'fanr::PodSpec',{}).af$('all',73728,'fanr::PodSpec[]?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dir','sys::File',false),new sys.Param('cur','fanr::PodSpec',false)]),{}).am$('sortAll',8192,'sys::Void',xp,{});
FileRepoMsg.type$.af$('load',106498,'sys::Int',{}).af$('find',106498,'sys::Int',{}).af$('query',106498,'sys::Int',{}).af$('versions',106498,'sys::Int',{}).af$('publish',106498,'sys::Int',{}).af$('refresh',106498,'sys::Int',{}).af$('id',73730,'sys::Int',{}).af$('a',73730,'sys::Obj?',{}).af$('b',73730,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Int',false),new sys.Param('a','sys::Obj?',true),new sys.Param('b','sys::Obj?',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
FileRepo.type$.af$('uri',336898,'sys::Uri',{}).af$('actorPool',100354,'concurrent::ActorPool',{}).af$('timeout',100354,'sys::Duration',{}).af$('dir',73730,'sys::File',{}).af$('actor',67586,'concurrent::Actor',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('ping',271360,'[sys::Str:sys::Str]',xp,{}).am$('find',271360,'fanr::PodSpec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('ver','sys::Version?',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('query',271360,'fanr::PodSpec[]',sys.List.make(sys.Param.type$,[new sys.Param('query','sys::Str',false),new sys.Param('numVersions','sys::Int',true)]),{}).am$('read',271360,'sys::InStream',sys.List.make(sys.Param.type$,[new sys.Param('spec','fanr::PodSpec',false)]),{}).am$('publish',271360,'fanr::PodSpec',sys.List.make(sys.Param.type$,[new sys.Param('podFile','sys::File',false)]),{}).am$('refresh',8192,'concurrent::Future',xp,{}).am$('receive',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('specToFile',128,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('spec','fanr::PodSpec',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Tokenizer.type$.af$('tok',73728,'fanr::Token',{}).af$('val',73728,'sys::Obj?',{}).af$('input',67584,'sys::Str',{}).af$('index',67584,'sys::Int',{}).af$('cur',67584,'sys::Int',{}).af$('peek',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::Str',false)]),{}).am$('next',8192,'fanr::Token',xp,{}).am$('word',2048,'fanr::Token',xp,{}).am$('num',2048,'fanr::Token',xp,{}).am$('str',2048,'fanr::Token',xp,{}).am$('escape',2048,'sys::Int',xp,{}).am$('symbol',2048,'fanr::Token',xp,{}).am$('err',8192,'sys::ParseErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('consume',2048,'sys::Void',xp,{});
Token.type$.af$('id',106506,'fanr::Token',{}).af$('idPattern',106506,'fanr::Token',{}).af$('int',106506,'fanr::Token',{}).af$('date',106506,'fanr::Token',{}).af$('version',106506,'fanr::Token',{}).af$('str',106506,'fanr::Token',{}).af$('dot',106506,'fanr::Token',{}).af$('comma',106506,'fanr::Token',{}).af$('minus',106506,'fanr::Token',{}).af$('plus',106506,'fanr::Token',{}).af$('eq',106506,'fanr::Token',{}).af$('notEq',106506,'fanr::Token',{}).af$('like',106506,'fanr::Token',{}).af$('lt',106506,'fanr::Token',{}).af$('ltEq',106506,'fanr::Token',{}).af$('gt',106506,'fanr::Token',{}).af$('gtEq',106506,'fanr::Token',{}).af$('eof',106506,'fanr::Token',{}).af$('vals',106498,'fanr::Token[]',{}).af$('symbol',73730,'sys::Str',{}).af$('queryOp',73730,'fanr::QueryOp?',{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('s','sys::Str',false),new sys.Param('q','fanr::QueryOp?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('isScalar',8192,'sys::Bool',xp,{}).am$('fromStr',40966,'fanr::Token?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Query.type$.af$('parts',65666,'fanr::QueryPart[]',{}).am$('fromStr',40966,'fanr::Query?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parts','fanr::QueryPart[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('include',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('pod','fanr::PodSpec',false)]),{}).am$('includeName',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('pod','fanr::PodSpec',false)]),{});
QueryPart.type$.af$('namePattern',73730,'sys::Str',{}).af$('version',73730,'sys::Depend?',{}).af$('metas',73730,'fanr::QueryMeta[]',{}).af$('nameRegex',67586,'sys::Regex?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('namePattern','sys::Str',false),new sys.Param('version','sys::Depend?',false),new sys.Param('metas','fanr::QueryMeta[]',false)]),{}).am$('isNameExact',8192,'sys::Bool',xp,{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('include',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('pod','fanr::PodSpec',false)]),{}).am$('includeName',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('pod','fanr::PodSpec',false)]),{}).am$('includeVersion',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('pod','fanr::PodSpec',false)]),{}).am$('includeMetas',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('pod','fanr::PodSpec',false)]),{});
QueryMeta.type$.af$('name',73730,'sys::Str',{}).af$('op',73730,'fanr::QueryOp',{}).af$('val',73730,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('op','fanr::QueryOp',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('include',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('pod','fanr::PodSpec',false)]),{}).am$('coerce',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('s','sys::Str',false)]),{});
QueryOp.type$.af$('has',106506,'fanr::QueryOp',{}).af$('eq',106506,'fanr::QueryOp',{}).af$('notEq',106506,'fanr::QueryOp',{}).af$('like',106506,'fanr::QueryOp',{}).af$('lt',106506,'fanr::QueryOp',{}).af$('ltEq',106506,'fanr::QueryOp',{}).af$('gtEq',106506,'fanr::QueryOp',{}).af$('gt',106506,'fanr::QueryOp',{}).af$('vals',106498,'fanr::QueryOp[]',{}).af$('symbol',73730,'sys::Str',{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('symbol','sys::Str',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('fromStr',40966,'fanr::QueryOp?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Parser.type$.af$('tokenizer',67584,'fanr::Tokenizer',{}).af$('cur',67584,'fanr::Token',{}).af$('curVal',67584,'sys::Obj?',{}).af$('peek',67584,'fanr::Token',{}).af$('peekVal',67584,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::Str',false)]),{}).am$('parse',8192,'fanr::Query',xp,{}).am$('part',2048,'fanr::QueryPart',xp,{}).am$('partName',2048,'sys::Str',xp,{}).am$('partVersion',2048,'sys::Depend?',xp,{}).am$('partMetas',2048,'fanr::QueryMeta[]',xp,{}).am$('meta',2048,'fanr::QueryMeta',xp,{}).am$('metaName',2048,'sys::Str',xp,{}).am$('err',2048,'sys::ParseErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('consumeId',2048,'sys::Str',xp,{}).am$('consumeScalar',2048,'sys::Obj',xp,{}).am$('verify',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expected','fanr::Token',false)]),{}).am$('consume',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expected','fanr::Token?',true)]),{});
Command.type$.af$('out',73728,'sys::OutStream',{}).af$('repoUri',73728,'sys::Uri?',{'fanr::CommandOpt':"fanr::CommandOpt{name=\"r\";help=\"Repository URI for command\";config=\"repo\";}"}).af$('errTrace',73728,'sys::Bool',{'fanr::CommandOpt':"fanr::CommandOpt{name=\"errTrace\";help=\"Dump error stack traces\";}"}).af$('skipConfirm',73728,'sys::Bool',{'fanr::CommandOpt':"fanr::CommandOpt{name=\"y\";help=\"Skip confirmation\";}"}).af$('username',73728,'sys::Str?',{'fanr::CommandOpt':"fanr::CommandOpt{name=\"u\";help=\"Username for authentication\";config=\"username\";}"}).af$('password',73728,'sys::Str?',{'fanr::CommandOpt':"fanr::CommandOpt{name=\"p\";help=\"Password for authentication\";config=\"password\";}"}).af$('repo$Store',722944,'sys::Obj?',{}).af$('env$Store',722944,'sys::Obj?',{}).am$('name',270337,'sys::Str',xp,{}).am$('summary',270337,'sys::Str',xp,{}).am$('run',270337,'sys::Void',xp,{}).am$('warn',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('err',8192,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('confirm',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('printPodVersion',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('version','fanr::PodSpec',false)]),{}).am$('printPodVersions',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('versions','fanr::PodSpec[]',false)]),{}).am$('repo',532480,'fanr::Repo',xp,{}).am$('env',532480,'fanr::FanrEnv',xp,{}).am$('init',128,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('initOptsFromConfig',2048,'sys::Void',xp,{}).am$('optDefault',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('field','sys::Field',false)]),{}).am$('parseArgs',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('toks','sys::Str[]',false)]),{}).am$('argFields',2048,'sys::Field[]',xp,{}).am$('optFields',2048,'sys::Field[]',xp,{}).am$('parseOpt',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('opts','sys::Field[]',false),new sys.Param('tok','sys::Str',false),new sys.Param('next','sys::Str?',false)]),{}).am$('parseArg',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('field','sys::Field',false),new sys.Param('tok','sys::Str',false)]),{}).am$('parseVal',34818,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('of','sys::Type',false),new sys.Param('tok','sys::Str',false)]),{}).am$('parsePath',32898,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('path','sys::Str',false)]),{}).am$('promptPassword',2048,'sys::Void',xp,{}).am$('usage',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('usageArg',2048,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('field','sys::Field',false)]),{}).am$('usageOpt',2048,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('field','sys::Field',false)]),{}).am$('usagePad',2048,'sys::Str[][]',sys.List.make(sys.Param.type$,[new sys.Param('rows','sys::Str[][]',false)]),{}).am$('usagePrint',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('title','sys::Str',false),new sys.Param('rows','sys::Str[][]',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('repo$Once',133120,'fanr::Repo',xp,{}).am$('env$Once',133120,'fanr::FanrEnv',xp,{});
CommandErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',false)]),{});
CommandArg.type$.af$('name',73730,'sys::Str',{}).af$('help',73730,'sys::Str',{}).am$('make',139268,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|fanr::CommandArg->sys::Void|?',true)]),{});
CommandOpt.type$.af$('name',73730,'sys::Str',{}).af$('help',73730,'sys::Str',{}).af$('config',73730,'sys::Str?',{}).am$('make',139268,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|fanr::CommandOpt->sys::Void|?',true)]),{});
HelpCmd.type$.af$('command',73728,'sys::Str?',{'fanr::CommandArg':"fanr::CommandArg{name=\"command\";help=\"show help for given command name\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
EnvCmd.type$.af$('query',73728,'sys::Str?',{'fanr::CommandArg':"fanr::CommandArg{name=\"query\";help=\"query filter used to match pods in env\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
Main.type$.af$('commands',73728,'fanr::Command[]',{}).am$('main',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('usage',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('errMsg','sys::Str?',true),new sys.Param('out','sys::OutStream',true)]),{}).am$('make',139268,'sys::Void',xp,{});
PingCmd.type$.am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
InstallCmd.type$.af$('query',73728,'sys::Str?',{'fanr::CommandArg':"fanr::CommandArg{name=\"query\";help=\"query filter for pods to install\";}"}).af$('items',73728,'[sys::Str:fanr::InstallItem]',{}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Void',xp,{}).am$('findDepends',2048,'sys::Void',xp,{}).am$('checkDepends',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('item','fanr::InstallItem',false)]),{}).am$('printInstallPlan',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('items','[sys::Str:fanr::InstallItem]',false)]),{}).am$('download',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('item','fanr::InstallItem',false),new sys.Param('stageDir','sys::File',false)]),{}).am$('install',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('item','fanr::InstallItem',false),new sys.Param('stageDir','sys::File',false)]),{}).am$('make',139268,'sys::Void',xp,{});
InstallItem.type$.af$('spec',73728,'fanr::PodSpec',{}).af$('cur',73728,'fanr::PodSpec?',{}).af$('oldVerStr',73728,'sys::Str',{}).af$('newVerStr',73728,'sys::Str',{}).af$('dependsChecked',73728,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','fanr::PodSpec',false),new sys.Param('cur','fanr::PodSpec?',false)]),{}).am$('name',8192,'sys::Str',xp,{}).am$('actionStr',8192,'sys::Str',xp,{}).am$('isSkip',8192,'sys::Bool',xp,{});
UninstallCmd.type$.af$('query',73728,'sys::Str?',{'fanr::CommandArg':"fanr::CommandArg{name=\"query\";help=\"query filter for pods to uninstall\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Void',xp,{}).am$('checkDepends',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('specs','fanr::PodSpec[]',false)]),{}).am$('delete',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','fanr::PodSpec',false)]),{}).am$('make',139268,'sys::Void',xp,{});
PublishCmd.type$.af$('pod',73728,'sys::Str?',{'fanr::CommandArg':"fanr::CommandArg{name=\"pod\";help=\"name or local file path for pod to publish\";}"}).af$('file',67584,'sys::File?',{}).af$('srcSpec',67584,'fanr::PodSpec?',{}).af$('pubSpec',67584,'fanr::PodSpec?',{}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Void',xp,{}).am$('findFile',2048,'sys::Void',xp,{}).am$('parseSpec',2048,'sys::Void',xp,{}).am$('publish',2048,'sys::Void',xp,{}).am$('printResult',2048,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
ConfigCmd.type$.am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
QueryCmd.type$.af$('query',73728,'sys::Str?',{'fanr::CommandArg':"fanr::CommandArg{name=\"query\";help=\"query filter used to match pods in repo\";}"}).af$('numVersions',73728,'sys::Int',{'fanr::CommandOpt':"fanr::CommandOpt{name=\"n\";help=\"Number of versions per pod limit\";config=\"numVersions\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
WebRepoMod.type$.af$('repo',73730,'fanr::Repo',{}).af$('auth',73730,'fanr::WebRepoAuth',{}).af$('pingMeta',73730,'[sys::Str:sys::Str]',{}).af$('tempDir',73730,'sys::File',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('onService',271360,'sys::Void',xp,{}).am$('authenticate',2048,'sys::Obj?',xp,{}).am$('onPing',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Obj?',false)]),{}).am$('onFind',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('podName','sys::Str',false),new sys.Param('verStr','sys::Str?',false),new sys.Param('user','sys::Obj?',false)]),{}).am$('onQuery',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Obj?',false)]),{}).am$('onPod',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('podName','sys::Str',false),new sys.Param('podVer','sys::Str',false),new sys.Param('user','sys::Obj?',false)]),{}).am$('onPublish',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Obj?',false)]),{}).am$('onAuth',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('reqUser','sys::Obj?',false)]),{}).am$('printPodSpecJson',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('pod','fanr::PodSpec',false),new sys.Param('comma','sys::Bool',false)]),{}).am$('getRequiredHeader',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{}).am$('sendUnauthErr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('sendForbiddenErr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Obj?',false)]),{}).am$('sendNotFoundErr',2048,'sys::Void',xp,{}).am$('sendBadMethodErr',2048,'sys::Void',xp,{}).am$('sendErr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Int',false),new sys.Param('msg','sys::Str',false)]),{}).am$('now',2048,'sys::DateTime',xp,{});
WebRepo.type$.af$('uri',336898,'sys::Uri',{}).af$('username',67586,'sys::Str?',{}).af$('password',67586,'sys::Str',{}).af$('secret',67586,'concurrent::AtomicRef',{}).af$('secretAlgorithm',67586,'concurrent::AtomicRef',{}).af$('tsSkew',67586,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('username','sys::Str?',false),new sys.Param('password','sys::Str?',false)]),{}).am$('ping',271360,'[sys::Str:sys::Str]',xp,{}).am$('find',271360,'fanr::PodSpec?',sys.List.make(sys.Param.type$,[new sys.Param('podName','sys::Str',false),new sys.Param('ver','sys::Version?',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('query',271360,'fanr::PodSpec[]',sys.List.make(sys.Param.type$,[new sys.Param('query','sys::Str',false),new sys.Param('numVersions','sys::Int',true)]),{}).am$('read',271360,'sys::InStream',sys.List.make(sys.Param.type$,[new sys.Param('spec','fanr::PodSpec',false)]),{}).am$('publish',271360,'fanr::PodSpec',sys.List.make(sys.Param.type$,[new sys.Param('podFile','sys::File',false)]),{}).am$('prepare',2048,'web::WebClient',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Str',false),new sys.Param('path','sys::Uri',false),new sys.Param('headers','[sys::Str:sys::Str]',true)]),{}).am$('sign',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false)]),{}).am$('toSignatureBody',32898,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Str',false),new sys.Param('uri','sys::Uri',false),new sys.Param('headers','[sys::Str:sys::Str]',false)]),{}).am$('initForSigning',2048,'sys::Void',xp,{}).am$('parseRes',2048,'[sys::Str:sys::Obj?]',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false)]),{});
RemoteErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str?',false),new sys.Param('cause','sys::Err?',true)]),{});
WebRepoAuth.type$.am$('secretAlgorithms',270337,'sys::Str[]',xp,{}).am$('signatureAlgorithms',270336,'sys::Str[]',xp,{}).am$('user',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',false)]),{}).am$('salt',270337,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Obj?',false)]),{}).am$('secret',270337,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Obj?',false),new sys.Param('algorithm','sys::Str',false)]),{}).am$('allowQuery',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Obj?',false),new sys.Param('pod','fanr::PodSpec?',false)]),{}).am$('allowRead',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Obj?',false),new sys.Param('pod','fanr::PodSpec?',false)]),{}).am$('allowPublish',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Obj?',false),new sys.Param('pod','fanr::PodSpec?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
PublicWebRepoAuth.type$.af$('publicSalt',67586,'sys::Str',{}).am$('user',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',false)]),{}).am$('salt',271360,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Obj?',false)]),{}).am$('secret',271360,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Obj?',false),new sys.Param('algorithm','sys::Str',false)]),{}).am$('secretAlgorithms',271360,'sys::Str[]',xp,{}).am$('allowQuery',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('u','sys::Obj?',false),new sys.Param('p','fanr::PodSpec?',false)]),{}).am$('allowRead',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('u','sys::Obj?',false),new sys.Param('p','fanr::PodSpec?',false)]),{}).am$('allowPublish',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('u','sys::Obj?',false),new sys.Param('p','fanr::PodSpec?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
SimpleWebRepoAuth.type$.af$('username',67586,'sys::Str',{}).af$('userSalt',67586,'sys::Str',{}).af$('password',67586,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',false),new sys.Param('password','sys::Str',false)]),{}).am$('user',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',false)]),{}).am$('secret',271360,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Obj?',false),new sys.Param('algorithm','sys::Str',false)]),{}).am$('salt',271360,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Obj?',false)]),{}).am$('secretAlgorithms',271360,'sys::Str[]',xp,{}).am$('allowQuery',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('u','sys::Obj?',false),new sys.Param('p','fanr::PodSpec?',false)]),{}).am$('allowRead',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('u','sys::Obj?',false),new sys.Param('p','fanr::PodSpec?',false)]),{}).am$('allowPublish',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('u','sys::Obj?',false),new sys.Param('p','fanr::PodSpec?',false)]),{});
WebRepoMain.type$.af$('httpPort',73728,'sys::Int?',{'util::Opt':"util::Opt{help=\"http port\";}"}).af$('httpsPort',73728,'sys::Int?',{'util::Opt':"util::Opt{help=\"https port\";}"}).af$('username',73728,'sys::Str?',{'util::Opt':"util::Opt{help=\"username to use for authentication\";aliases=[\"u\"];}"}).af$('password',73728,'sys::Str?',{'util::Opt':"util::Opt{help=\"password to use for authentication\";aliases=[\"p\"];}"}).af$('localRepo',73728,'sys::Str?',{'util::Arg':"util::Arg{help=\"local repo to publish\";}"}).am$('run',271360,'sys::Int',xp,{}).am$('makeWispService',32898,'sys::Service',sys.List.make(sys.Param.type$,[new sys.Param('mod','web::WebMod',false),new sys.Param('httpPort','sys::Int',false),new sys.Param('httpsPort','sys::Int?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
WebRepoTest.type$.af$('auth',65664,'fanr::TestWebRepoAuth',{}).af$('wispService',65664,'sys::Service?',{}).af$('httpPort',65664,'sys::Int',{}).af$('httpsPort',65664,'sys::Int?',{}).af$('pub',65664,'fanr::Repo?',{}).af$('badUser',65664,'fanr::Repo?',{}).af$('badPass',65664,'fanr::Repo?',{}).af$('good',65664,'fanr::Repo?',{}).af$('webSpec',73728,'fanr::PodSpec?',{}).am$('setup',271360,'sys::Void',xp,{}).am$('teardown',271360,'sys::Void',xp,{}).am$('podFile',8192,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('podName','sys::Str',false)]),{}).am$('test',8192,'sys::Void',xp,{}).am$('verifyPing',8192,'sys::Void',xp,{}).am$('doVerifyPing',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','fanr::Repo',false)]),{}).am$('verifyFind',8192,'sys::Void',xp,{}).am$('doVerifyFind',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','fanr::Repo',false)]),{}).am$('verifyQuery',8192,'sys::Void',xp,{}).am$('doVerifyQuery',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','fanr::Repo',false)]),{}).am$('verifyRead',8192,'sys::Void',xp,{}).am$('doVerifyRead',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','fanr::Repo',false)]),{}).am$('verifyPublish',8192,'sys::Void',xp,{}).am$('doVerifyPublish',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','fanr::Repo',false),new sys.Param('f','sys::File',false)]),{}).am$('verifyBadCredentials',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|fanr::Repo->sys::Void|',false)]),{}).am$('verifyAuthRequired',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|fanr::Repo->sys::Void|',false)]),{}).am$('verifyForbidden',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|fanr::Repo->sys::Void|',false)]),{}).am$('verifyAuthErr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('r','fanr::Repo',false),new sys.Param('f','|fanr::Repo->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{});
TestWebRepoAuth.type$.af$('allowPublic',73730,'concurrent::AtomicBool',{}).af$('allowUser',73730,'concurrent::AtomicBool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('u','sys::Str',false),new sys.Param('p','sys::Str',false)]),{}).am$('allowQuery',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('u','sys::Obj?',false),new sys.Param('p','fanr::PodSpec?',false)]),{}).am$('allowRead',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('u','sys::Obj?',false),new sys.Param('p','fanr::PodSpec?',false)]),{}).am$('allowPublish',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('u','sys::Obj?',false),new sys.Param('p','fanr::PodSpec?',false)]),{}).am$('allow',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('u','sys::Obj?',false),new sys.Param('p','fanr::PodSpec?',false)]),{});
QueryTest.type$.am$('testTokenizer',8192,'sys::Void',xp,{}).am$('verifyToks',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false),new sys.Param('toks','sys::Obj?[]',false)]),{}).am$('testParser',8192,'sys::Void',xp,{}).am$('verifyParser',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::Str',false),new sys.Param('parts','sys::Obj?[][]',false)]),{}).am$('testInclude',8192,'sys::Void',xp,{}).am$('verifyIncludeEq',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('query','sys::Str',false),new sys.Param('spec','fanr::PodSpec',false),new sys.Param('expected','sys::Bool',false)]),{}).am$('verifyIncludeCmp',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('query','sys::Str',false),new sys.Param('spec','fanr::PodSpec',false),new sys.Param('expected','sys::Int?',false)]),{}).am$('verifyInclude',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('query','sys::Str',false),new sys.Param('spec','fanr::PodSpec',false),new sys.Param('expected','sys::Bool',false)]),{}).am$('spec',8192,'fanr::PodSpec',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('ver','sys::Str',false),new sys.Param('meta','[sys::Str:sys::Str]',true)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "fanr");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;concurrent 1.0;util 1.0;web 1.0");
m.set("pod.summary", "Fantom Repository Manager");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:21-05:00 New_York");
m.set("build.tsKey", "241210143121");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "true");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "Fantom");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Fantom Core");
m.set("proj.uri", "https://fantom.org/");
m.set("pod.docApi", "true");
m.set("org.uri", "https://fantom.org/");
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/fantom-lang/fantom");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  Repo,
  FanrEnv,
  PodSpec,
  Query,
  Command,
  CommandArg,
  CommandOpt,
  Main,
  WebRepoMod,
  WebRepoAuth,
  WebRepoMain,
  WebRepoTest,
  QueryTest,
};
