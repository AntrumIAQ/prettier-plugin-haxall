// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as ftp from './ftp.js'
import * as rdf from './rdf.js'
import * as util from './util.js'
import * as web from './web.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
import * as axon from './axon.js'
import * as def from './def.js'
import * as folio from './folio.js'
import * as hxUtil from './hxUtil.js'
import * as obs from './obs.js'
import * as hx from './hx.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class IOLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return IOLib.type$; }

  services() {
    return sys.List.make(IOLib.type$, [this]);
  }

  read(handle,f) {
    return IOHandle.fromObj(this.rt(), handle).withIn(f);
  }

  write(handle,f) {
    return IOHandle.fromObj(this.rt(), handle).withOut(f);
  }

  static make() {
    const $self = new IOLib();
    IOLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    return;
  }

}

class IOUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return IOUtil.type$; }

  static toFile(cx,obj,debugAction) {
    return IOHandle.fromObj(cx.rt(), obj).toFile(debugAction);
  }

  static openZip(file) {
    let m = sys.ObjUtil.typeof(file).method("toLocal", false);
    if (m != null) {
      (file = sys.ObjUtil.coerce(m.callOn(file, sys.List.make(sys.Obj.type$.toNullable())), sys.File.type$));
    }
    ;
    return sys.Zip.open(file);
  }

  static make() {
    const $self = new IOUtil();
    IOUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class IOCsvReader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return IOCsvReader.type$; }

  #cx = null;

  // private field reflection only
  __cx(it) { if (it === undefined) return this.#cx; else this.#cx = it; }

  #handle = null;

  // private field reflection only
  __handle(it) { if (it === undefined) return this.#handle; else this.#handle = it; }

  #opts = null;

  // private field reflection only
  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #noHeader = false;

  // private field reflection only
  __noHeader(it) { if (it === undefined) return this.#noHeader; else this.#noHeader = it; }

  #delimiter = null;

  // private field reflection only
  __delimiter(it) { if (it === undefined) return this.#delimiter; else this.#delimiter = it; }

  #submitted = 0;

  // private field reflection only
  __submitted(it) { if (it === undefined) return this.#submitted; else this.#submitted = it; }

  static make(cx,handle,opts) {
    const $self = new IOCsvReader();
    IOCsvReader.make$($self,cx,handle,opts);
    return $self;
  }

  static make$($self,cx,handle,opts) {
    $self.#cx = cx;
    $self.#handle = handle;
    $self.#opts = sys.ObjUtil.coerce(((this$) => { let $_u0 = opts; if ($_u0 != null) return $_u0; return haystack.Etc.emptyDict(); })($self), haystack.Dict.type$);
    $self.#delimiter = sys.ObjUtil.coerce(((this$) => { let $_u1 = sys.ObjUtil.as(this$.#opts.get("delimiter"), sys.Str.type$); if ($_u1 != null) return $_u1; return ","; })($self), sys.Str.type$);
    $self.#noHeader = $self.#opts.has("noHeader");
    return;
  }

  read() {
    const this$ = this;
    return sys.ObjUtil.coerce(this.toHandle(this.#handle).withIn((in$) => {
      let rows = this$.makeCsvInStream(in$).readAllRows();
      if (rows.isEmpty()) {
        return haystack.Etc.makeEmptyGrid();
      }
      ;
      let colNames = ((this$) => { if (this$.#noHeader) return this$.genColNames(rows.get(0)); return this$.normColNames(rows.removeAt(0)); })(this$);
      while ((!rows.isEmpty() && rows.last().isEmpty())) {
        rows.removeAt(-1);
      }
      ;
      let gb = haystack.GridBuilder.make().addColNames(colNames);
      rows.each((row,i) => {
        this$.checkColCount(colNames, row, i);
        let normRow = row.map((cell) => {
          return this$.normCell(cell);
        }, sys.Obj.type$.toNullable());
        gb.addRow(normRow);
        return;
      });
      return gb.toGrid();
    }), haystack.Grid.type$);
  }

  each(fn) {
    const this$ = this;
    return this.toHandle(this.#handle).withIn((in$) => {
      let args = sys.List.make(sys.Obj.type$.toNullable(), [null, null]);
      let num = 0;
      this$.makeCsvInStream(in$).eachRow((row) => {
        fn.call(this$.#cx, args.set(0, sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(row), sys.Type.find("sys::Str[]"))).set(1, haystack.Number.makeInt(num)));
        ((this$) => { let $_u3 = num;num = sys.Int.increment(num); return $_u3; })(this$);
        return;
      });
      return haystack.Number.makeInt(num);
    });
  }

  stream(stream) {
    const this$ = this;
    this.toHandle(this.#handle).withIn((inRaw) => {
      let in$ = this$.makeCsvInStream(inRaw);
      let firstRow = in$.readRow();
      if (firstRow == null) {
        return null;
      }
      ;
      let colNames = ((this$) => { if (this$.#noHeader) return this$.genColNames(sys.ObjUtil.coerce(firstRow, sys.Type.find("sys::Str[]"))); return this$.normColNames(sys.ObjUtil.coerce(firstRow, sys.Type.find("sys::Str[]"))); })(this$);
      if (this$.#noHeader) {
        this$.submit(stream, colNames, sys.ObjUtil.coerce(firstRow, sys.Type.find("sys::Str[]")));
      }
      ;
      while (!stream.isComplete()) {
        let cells = in$.readRow();
        if (cells == null) {
          break;
        }
        ;
        this$.submit(stream, colNames, sys.ObjUtil.coerce(cells, sys.Type.find("sys::Str[]")));
      }
      ;
      return null;
    });
    return;
  }

  submit(stream,colNames,cells) {
    const this$ = this;
    this.checkColCount(colNames, cells, this.#submitted);
    let map = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj?]"));
    colNames.each((n,i) => {
      map.set(n, this$.normCell(cells.get(i)));
      return;
    });
    let dict = haystack.Etc.makeDict(map);
    stream.submit(dict);
    ((this$) => { let $_u5 = this$.#submitted;this$.#submitted = sys.Int.increment(this$.#submitted); return $_u5; })(this);
    return;
  }

  genColNames(firstRow) {
    const this$ = this;
    return sys.ObjUtil.coerce(firstRow.map((r,i) => {
      return sys.Str.plus("v", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
    }, sys.Obj.type$.toNullable()), sys.Type.find("sys::Str[]"));
  }

  normColNames(firstRow) {
    return haystack.GridBuilder.normColNames(firstRow);
  }

  makeCsvInStream(in$) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(util.CsvInStream.make(in$), (it) => {
      it.delimiter(sys.Str.get(this$.#delimiter, 0));
      return;
    }), util.CsvInStream.type$);
  }

  checkColCount(colNames,cells,rowIndex) {
    if (sys.ObjUtil.equals(colNames.size(), cells.size())) {
      return;
    }
    ;
    throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid number of cols in row ", sys.ObjUtil.coerce(sys.Int.plus(rowIndex, 1), sys.Obj.type$.toNullable())), " (expected "), sys.ObjUtil.coerce(colNames.size(), sys.Obj.type$.toNullable())), ", got "), sys.ObjUtil.coerce(cells.size(), sys.Obj.type$.toNullable())), ")\n"), cells.join(",")));
  }

  normCell(cell) {
    return ((this$) => { if (sys.Str.isEmpty(cell)) return null; return cell; })(this);
  }

  toHandle(val) {
    return IOHandle.fromObj(this.#cx.rt(), this.#handle);
  }

}

class IOHandle extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return IOHandle.type$; }

  static fromObj(rt,h) {
    if (sys.ObjUtil.is(h, IOHandle.type$)) {
      return sys.ObjUtil.coerce(h, IOHandle.type$);
    }
    ;
    if (sys.ObjUtil.is(h, sys.Str.type$)) {
      return StrHandle.make(sys.ObjUtil.coerce(h, sys.Str.type$));
    }
    ;
    if (sys.ObjUtil.is(h, sys.Uri.type$)) {
      return IOHandle.fromUri(rt, sys.ObjUtil.coerce(h, sys.Uri.type$));
    }
    ;
    if (sys.ObjUtil.is(h, haystack.Dict.type$)) {
      return IOHandle.fromDict(rt, sys.ObjUtil.coerce(h, haystack.Dict.type$), "file");
    }
    ;
    if (sys.ObjUtil.is(h, sys.Buf.type$)) {
      return BufHandle.make(sys.ObjUtil.coerce(h, sys.Buf.type$));
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("Cannot obtain IO handle from ", ((this$) => { let $_u7 = h; if ($_u7 == null) return null; return sys.ObjUtil.typeof(h); })(this)));
  }

  static fromUri(rt,uri) {
    if (sys.ObjUtil.equals(uri.scheme(), "http")) {
      return HttpHandle.make(uri);
    }
    ;
    if (sys.ObjUtil.equals(uri.scheme(), "https")) {
      return HttpHandle.make(uri);
    }
    ;
    if (sys.ObjUtil.equals(uri.scheme(), "ftp")) {
      return FtpHandle.make(rt, uri);
    }
    ;
    if (sys.ObjUtil.equals(uri.scheme(), "ftps")) {
      return FtpHandle.make(rt, uri);
    }
    ;
    if (sys.ObjUtil.equals(uri.scheme(), "fan")) {
      return FanHandle.make(uri);
    }
    ;
    return FileHandle.make(rt.file().resolve(uri));
  }

  static fromDict(rt,rec,tag) {
    if (rec.has("zipEntry")) {
      return ZipEntryHandle.make(IOHandle.fromObj(rt, rec.trap("file", sys.List.make(sys.Obj.type$.toNullable(), []))).toFile("ioZipEntry"), sys.ObjUtil.coerce(rec.trap("path", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Uri.type$));
    }
    ;
    let id = sys.ObjUtil.as(rec.get("id"), haystack.Ref.type$);
    let bin = sys.ObjUtil.as(rec.get(tag), haystack.Bin.type$);
    if ((id == null || bin == null)) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Dict has missing/incorrect 'id' and '", tag), "' tags"));
    }
    ;
    return BinHandle.make(rt, rec, tag);
  }

  toFile(func) {
    throw sys.UnsupportedErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot run ", func), " on "), sys.ObjUtil.typeof(this).name()));
  }

  dir() {
    throw sys.UnsupportedErr.make(sys.Str.plus("Cannot run ioDir() on ", sys.ObjUtil.typeof(this).name()));
  }

  toAppend() {
    throw sys.UnsupportedErr.make(sys.Str.plus("Append mode not supported on ", sys.ObjUtil.typeof(this).name()));
  }

  create() {
    this.toFile("create").create();
    return;
  }

  delete() {
    this.toFile("delete").delete();
    return;
  }

  info() {
    let f = this.toFile("info");
    return DirItem.makeFile(f.uri(), f);
  }

  withIn(f) {
    let in$ = this.in();
    try {
      return sys.Func.call(f, in$);
    }
    finally {
      in$.close();
    }
    ;
  }

  withOut(f) {
    let out = this.out();
    try {
      sys.Func.call(f, out);
    }
    finally {
      out.close();
    }
    ;
    return this.withOutResult();
  }

  withOutResult() {
    return null;
  }

  inToBuf() {
    const this$ = this;
    return sys.ObjUtil.coerce(this.withIn((in$) => {
      return in$.readAllBuf();
    }), sys.Buf.type$);
  }

  static make() {
    const $self = new IOHandle();
    IOHandle.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DirItem extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DirItem.type$; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #mime = null;

  mime() { return this.#mime; }

  __mime(it) { if (it === undefined) return this.#mime; else this.#mime = it; }

  #isDir = false;

  isDir() { return this.#isDir; }

  __isDir(it) { if (it === undefined) return this.#isDir; else this.#isDir = it; }

  #size = null;

  size() { return this.#size; }

  __size(it) { if (it === undefined) return this.#size; else this.#size = it; }

  #mod = null;

  mod() { return this.#mod; }

  __mod(it) { if (it === undefined) return this.#mod; else this.#mod = it; }

  static makeFile(uri,file) {
    const $self = new DirItem();
    DirItem.makeFile$($self,uri,file);
    return $self;
  }

  static makeFile$($self,uri,file) {
    $self.#uri = uri;
    $self.#name = file.name();
    $self.#mime = file.mimeType();
    $self.#isDir = file.isDir();
    $self.#size = file.size();
    $self.#mod = file.modified();
    return;
  }

  static make(uri,name,mime,isDir,size,mod) {
    const $self = new DirItem();
    DirItem.make$($self,uri,name,mime,isDir,size,mod);
    return $self;
  }

  static make$($self,uri,name,mime,isDir,size,mod) {
    $self.#uri = uri;
    $self.#name = name;
    $self.#mime = mime;
    $self.#isDir = isDir;
    $self.#size = size;
    $self.#mod = mod;
    return;
  }

}

class CharsetHandle extends IOHandle {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CharsetHandle.type$; }

  #handle = null;

  handle(it) {
    if (it === undefined) {
      return this.#handle;
    }
    else {
      this.#handle = it;
      return;
    }
  }

  #charset = null;

  charset() { return this.#charset; }

  __charset(it) { if (it === undefined) return this.#charset; else this.#charset = it; }

  static make(h,charset) {
    const $self = new CharsetHandle();
    CharsetHandle.make$($self,h,charset);
    return $self;
  }

  static make$($self,h,charset) {
    IOHandle.make$($self);
    $self.#handle = h;
    $self.#charset = charset;
    return;
  }

  in() {
    let in$ = this.#handle.in();
    in$.charset(this.#charset);
    return in$;
  }

  out() {
    let out = this.#handle.out();
    out.charset(this.#charset);
    return out;
  }

  withOutResult() {
    return this.#handle.withOutResult();
  }

}

class StrHandle extends IOHandle {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StrHandle.type$; }

  #str = null;

  str() { return this.#str; }

  __str(it) { if (it === undefined) return this.#str; else this.#str = it; }

  #buf = null;

  buf(it) {
    if (it === undefined) {
      return this.#buf;
    }
    else {
      this.#buf = it;
      return;
    }
  }

  static make(s) {
    const $self = new StrHandle();
    StrHandle.make$($self,s);
    return $self;
  }

  static make$($self,s) {
    IOHandle.make$($self);
    $self.#str = s;
    return;
  }

  in() {
    return sys.Str.in(this.#str);
  }

  out() {
    this.#buf = sys.StrBuf.make().add(this.#str);
    return this.#buf.out();
  }

  withOutResult() {
    return this.#buf.toStr();
  }

  inToBuf() {
    return sys.Str.toBuf(this.#str);
  }

}

class BufHandle extends IOHandle {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BufHandle.type$; }

  #buf = null;

  buf() {
    return this.#buf;
  }

  static make(buf) {
    const $self = new BufHandle();
    BufHandle.make$($self,buf);
    return $self;
  }

  static make$($self,buf) {
    IOHandle.make$($self);
    $self.#buf = buf;
    return;
  }

  toFile(func) {
    return this.#buf.toFile(sys.Str.toUri(sys.Str.plus("", func)));
  }

  in() {
    return this.#buf.in();
  }

  out() {
    return this.#buf.out();
  }

  withOutResult() {
    return haystack.Etc.makeDict(sys.Map.__fromLiteral(["size"], [haystack.Number.makeInt(this.#buf.size())], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")));
  }

}

class FileHandle extends IOHandle {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FileHandle.type$; }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #append = false;

  append() { return this.#append; }

  __append(it) { if (it === undefined) return this.#append; else this.#append = it; }

  static make(file) {
    const $self = new FileHandle();
    FileHandle.make$($self,file);
    return $self;
  }

  static make$($self,file) {
    IOHandle.make$($self);
    $self.#file = file;
    return;
  }

  static makeAppend(file) {
    const $self = new FileHandle();
    FileHandle.makeAppend$($self,file);
    return $self;
  }

  static makeAppend$($self,file) {
    IOHandle.make$($self);
    $self.#file = file;
    $self.#append = true;
    return;
  }

  toFile(func) {
    return this.#file;
  }

  toAppend() {
    return FileHandle.makeAppend(this.#file);
  }

  in() {
    return this.#file.in();
  }

  out() {
    return this.#file.out(this.#append);
  }

  withOutResult() {
    return haystack.Etc.makeDict(sys.Map.__fromLiteral(["size"], [haystack.Number.makeInt(sys.ObjUtil.coerce(((this$) => { let $_u8 = this$.#file.size(); if ($_u8 != null) return $_u8; return sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()); })(this), sys.Int.type$))], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")));
  }

  dir() {
    const this$ = this;
    let kids = this.#file.list();
    let acc = sys.List.make(DirItem.type$);
    acc.capacity(kids.size());
    kids.each((kid) => {
      if (kid.isHidden()) {
        return;
      }
      ;
      acc.add(DirItem.makeFile(kid.uri(), kid));
      return;
    });
    return acc;
  }

  info() {
    return DirItem.makeFile(this.#file.uri(), this.#file);
  }

}

class BinHandle extends IOHandle {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BinHandle.type$; }

  #proj = null;

  proj() { return this.#proj; }

  __proj(it) { if (it === undefined) return this.#proj; else this.#proj = it; }

  #rec = null;

  rec() { return this.#rec; }

  __rec(it) { if (it === undefined) return this.#rec; else this.#rec = it; }

  #tag = null;

  tag() { return this.#tag; }

  __tag(it) { if (it === undefined) return this.#tag; else this.#tag = it; }

  static make(rt,rec,tag) {
    const $self = new BinHandle();
    BinHandle.make$($self,rt,rec,tag);
    return $self;
  }

  static make$($self,rt,rec,tag) {
    IOHandle.make$($self);
    try {
      $self.#proj = ((this$) => { let $_u9 = sys.ObjUtil.coerce(sys.ObjUtil.trap(rt,"proj", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Obj.type$); if ($_u9 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(sys.ObjUtil.trap(rt,"proj", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Obj.type$)); })($self);
      $self.#rec = rec;
      $self.#tag = tag;
    }
    catch ($_u10) {
      $_u10 = sys.Err.make($_u10);
      if ($_u10 instanceof sys.UnknownSlotErr) {
        let e = $_u10;
        ;
        throw sys.Err.make("Cannot use bin files outside of SkySpark");
      }
      else {
        throw $_u10;
      }
    }
    ;
    return;
  }

  in() {
    return sys.ObjUtil.coerce(sys.ObjUtil.trap(this.#proj,"readBin", sys.List.make(sys.Obj.type$.toNullable(), [this.#rec, this.#tag])), sys.InStream.type$);
  }

  out() {
    return sys.ObjUtil.coerce(sys.ObjUtil.trap(this.#proj,"writeBin", sys.List.make(sys.Obj.type$.toNullable(), [this.#rec, this.#tag, null])), sys.OutStream.type$);
  }

}

class ZipEntryHandle extends IOHandle {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ZipEntryHandle.type$; }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #path = null;

  path() { return this.#path; }

  __path(it) { if (it === undefined) return this.#path; else this.#path = it; }

  static make(file,path) {
    const $self = new ZipEntryHandle();
    ZipEntryHandle.make$($self,file,path);
    return $self;
  }

  static make$($self,file,path) {
    IOHandle.make$($self);
    $self.#file = file;
    $self.#path = path;
    return;
  }

  in() {
    let zip = IOUtil.openZip(this.#file);
    let entry = ((this$) => { let $_u11 = zip.contents().get(this$.#path); if ($_u11 != null) return $_u11; throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Zip entry not found: ", this$.#file), " | "), this$.#path)); })(this);
    return ZipEntryInStream.make(zip, entry.in());
  }

  out() {
    throw sys.UnsupportedErr.make("Cannot write to ZipEntry");
  }

}

class ZipEntryInStream extends sys.InStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ZipEntryInStream.type$; }

  #zip = null;

  // private field reflection only
  __zip(it) { if (it === undefined) return this.#zip; else this.#zip = it; }

  static make(zip,in$) {
    const $self = new ZipEntryInStream();
    ZipEntryInStream.make$($self,zip,in$);
    return $self;
  }

  static make$($self,zip,in$) {
    sys.InStream.make$($self, in$);
    $self.#zip = zip;
    return;
  }

  close() {
    sys.InStream.prototype.close.call(this);
    return this.#zip.close();
  }

}

class GZipEntryHandle extends IOHandle {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GZipEntryHandle.type$; }

  #handle = null;

  handle(it) {
    if (it === undefined) {
      return this.#handle;
    }
    else {
      this.#handle = it;
      return;
    }
  }

  static make(handle) {
    const $self = new GZipEntryHandle();
    GZipEntryHandle.make$($self,handle);
    return $self;
  }

  static make$($self,handle) {
    IOHandle.make$($self);
    $self.#handle = handle;
    return;
  }

  in() {
    return sys.Zip.gzipInStream(this.#handle.in());
  }

  out() {
    return sys.Zip.gzipOutStream(this.#handle.out());
  }

}

class FanHandle extends IOHandle {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FanHandle.type$; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  static make(uri) {
    const $self = new FanHandle();
    FanHandle.make$($self,uri);
    return $self;
  }

  static make$($self,uri) {
    IOHandle.make$($self);
    $self.#uri = uri;
    return;
  }

  in() {
    return this.toFanFile().in();
  }

  out() {
    throw sys.UnsupportedErr.make("Cannot write to fan:// handle");
  }

  dir() {
    const this$ = this;
    if (sys.ObjUtil.compareGT(this.#uri.path().size(), 0)) {
      throw sys.UnsupportedErr.make("Use empty path such as fan://podName/");
    }
    ;
    let files = sys.Pod.find(sys.ObjUtil.coerce(this.#uri.host(), sys.Str.type$)).files().findAll((f) => {
      if (sys.ObjUtil.equals(f.path().first(), "lib")) {
        return false;
      }
      ;
      if (sys.ObjUtil.equals(f.ext(), "apidoc")) {
        return false;
      }
      ;
      return true;
    });
    return sys.ObjUtil.coerce(files.map((f) => {
      return DirItem.makeFile(f.uri(), f);
    }, DirItem.type$), sys.Type.find("hxIO::DirItem[]"));
  }

  toFanFile() {
    let f = sys.ObjUtil.coerce(this.#uri.get(), sys.File.type$);
    if (sys.ObjUtil.equals(f.path().first(), "lib")) {
      throw sys.UnresolvedErr.make(this.#uri.toStr());
    }
    ;
    return f;
  }

}

class HttpHandle extends IOHandle {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HttpHandle.type$; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  static make(uri) {
    const $self = new HttpHandle();
    HttpHandle.make$($self,uri);
    return $self;
  }

  static make$($self,uri) {
    IOHandle.make$($self);
    $self.#uri = uri;
    return;
  }

  in() {
    return this.toClient().getIn();
  }

  out() {
    throw sys.UnsupportedErr.make("Cannot write to HTTP handle");
  }

  toFile(func) {
    return this.toClient().getBuf().toFile(sys.Str.toUri(this.#uri.name()));
  }

  toClient() {
    return web.WebClient.make(this.#uri);
  }

}

class FtpHandle extends IOHandle {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FtpHandle.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  static make(rt,uri) {
    const $self = new FtpHandle();
    FtpHandle.make$($self,rt,uri);
    return $self;
  }

  static make$($self,rt,uri) {
    IOHandle.make$($self);
    $self.#rt = rt;
    $self.#uri = uri;
    return;
  }

  create() {
    if (this.#uri.isDir()) {
      this.open(this.#uri).mkdir(this.#uri);
    }
    else {
      this.out();
    }
    ;
    return;
  }

  delete() {
    const this$ = this;
    if (this.#uri.isDir()) {
      this.dir().each((item) => {
        FtpHandle.make(this$.#rt, item.uri()).delete();
        return;
      });
      this.open(this.#uri).rmdir(this.#uri);
    }
    else {
      this.open(this.#uri).delete(this.#uri);
    }
    ;
    return;
  }

  in() {
    return this.open(this.#uri).read(this.#uri);
  }

  out() {
    let client = this.open(this.#uri);
    client.mkdir(sys.ObjUtil.coerce(this.#uri.parent(), sys.Uri.type$));
    (client = this.open(this.#uri));
    return client.write(this.#uri);
  }

  dir() {
    const this$ = this;
    return sys.ObjUtil.coerce(this.open(this.#uri).list(this.#uri).map((uri) => {
      return DirItem.make(uri, uri.name(), uri.mimeType(), false, null, null);
    }, DirItem.type$), sys.Type.find("hxIO::DirItem[]"));
  }

  open(uri) {
    let key = uri.plus(sys.Uri.fromStr("/")).toStr();
    let log = this.#rt.lib("io").log();
    let cred = ((this$) => { let $_u12 = this$.#rt.db().passwords().get(key); if ($_u12 != null) return $_u12; return "anonymous:"; })(this);
    let colon = sys.Str.index(cred, ":");
    if (colon == null) {
      throw sys.Err.make(sys.Str.plus("ftp credentials not 'user:pass' - ", sys.Str.toCode(cred)));
    }
    ;
    let user = sys.Str.getRange(cred, sys.Range.make(0, sys.ObjUtil.coerce(colon, sys.Int.type$), true));
    let pass = sys.Str.getRange(cred, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1), -1));
    if (log.isDebug()) {
      log.debug(sys.Str.plus(sys.Str.plus(sys.Str.plus("FtpClient.open uri=", sys.Str.toCode(key)), " user="), sys.Str.toCode(user)));
    }
    ;
    let c = ftp.FtpClient.make(user, pass);
    c.log(log);
    return c;
  }

}

class SkipHandle extends IOHandle {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SkipHandle.type$; }

  #handle = null;

  handle(it) {
    if (it === undefined) {
      return this.#handle;
    }
    else {
      this.#handle = it;
      return;
    }
  }

  #opts = null;

  opts() { return this.#opts; }

  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  static make(h,opts) {
    const $self = new SkipHandle();
    SkipHandle.make$($self,h,opts);
    return $self;
  }

  static make$($self,h,opts) {
    IOHandle.make$($self);
    $self.#handle = h;
    $self.#opts = opts;
    return;
  }

  out() {
    throw sys.UnsupportedErr.make("Cannot write to ioSkip handle");
  }

  in() {
    let in$ = this.#handle.in();
    if (this.#opts.has("bom")) {
      this.skipBom(in$);
    }
    ;
    if (this.#opts.has("bytes")) {
      this.skipBytes(in$, this.toInt("bytes"));
    }
    ;
    if (this.#opts.has("chars")) {
      this.skipChars(in$, this.toInt("chars"));
    }
    ;
    if (this.#opts.has("lines")) {
      this.skipLines(in$, this.toInt("lines"));
    }
    ;
    return in$;
  }

  skipBytes(in$,num) {
    const this$ = this;
    sys.Int.times(num, (it) => {
      in$.read();
      return;
    });
    return;
  }

  skipChars(in$,num) {
    const this$ = this;
    sys.Int.times(num, (it) => {
      in$.readChar();
      return;
    });
    return;
  }

  skipLines(in$,num) {
    const this$ = this;
    sys.Int.times(num, (it) => {
      in$.readLine();
      return;
    });
    return;
  }

  skipBom(in$) {
    let b1 = in$.read();
    if (sys.ObjUtil.equals(b1, 254)) {
      let b2 = in$.read();
      if (sys.ObjUtil.equals(b2, 255)) {
        in$.charset(sys.Charset.utf16BE());
        return;
      }
      ;
      in$.unread(sys.ObjUtil.coerce(b2, sys.Int.type$)).unread(sys.ObjUtil.coerce(b1, sys.Int.type$));
    }
    ;
    if (sys.ObjUtil.equals(b1, 255)) {
      let b2 = in$.read();
      if (sys.ObjUtil.equals(b2, 254)) {
        in$.charset(sys.Charset.utf16LE());
        return;
      }
      ;
      in$.unread(sys.ObjUtil.coerce(b2, sys.Int.type$)).unread(sys.ObjUtil.coerce(b1, sys.Int.type$));
    }
    ;
    if (sys.ObjUtil.equals(b1, 239)) {
      let b2 = in$.read();
      if (sys.ObjUtil.equals(b2, 187)) {
        let b3 = in$.read();
        if (sys.ObjUtil.compareNE(b3, 191)) {
          throw sys.IOErr.make(sys.Str.plus("Invalid UTF-8 BOM 0xef_bb_", sys.Int.toHex(sys.ObjUtil.coerce(b3, sys.Int.type$))));
        }
        ;
        in$.charset(sys.Charset.utf8());
        return;
      }
      ;
      in$.unread(sys.ObjUtil.coerce(b2, sys.Int.type$)).unread(sys.ObjUtil.coerce(b1, sys.Int.type$));
      return;
    }
    ;
    in$.unread(sys.ObjUtil.coerce(b1, sys.Int.type$));
    return;
  }

  toInt(tag) {
    let num = ((this$) => { let $_u13 = sys.ObjUtil.as(this$.#opts.trap(tag), haystack.Number.type$); if ($_u13 != null) return $_u13; throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Opt ", tag), " must be Number")); })(this);
    return num.toInt();
  }

}

class IOFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return IOFuncs.type$; }

  static ioRandom(size) {
    return sys.Buf.random(size.toInt());
  }

  static ioCharset(handle,charset) {
    return CharsetHandle.make(IOFuncs.toHandle(handle), sys.ObjUtil.coerce(sys.Charset.fromStr(charset), sys.Charset.type$));
  }

  static ioAppend(handle) {
    return IOFuncs.toHandle(handle).toAppend();
  }

  static ioBin(rec,tag) {
    let cx = IOFuncs.curContext();
    return IOHandle.fromDict(cx.rt(), haystack.Etc.toRec(rec), tag);
  }

  static ioDir(handle) {
    let h = IOFuncs.toHandle(handle);
    return IOFuncs.toInfoGrid(h.dir());
  }

  static ioInfo(handle) {
    let h = IOFuncs.toHandle(handle);
    return sys.ObjUtil.coerce(IOFuncs.toInfoGrid(sys.List.make(DirItem.type$, [h.info()])).first(), haystack.Dict.type$);
  }

  static toInfoGrid(items) {
    const this$ = this;
    let cols = sys.List.make(sys.Str.type$, ["uri", "name", "mimeType", "dir", "size", "mod"]);
    let colMeta = sys.List.make(haystack.Dict.type$.toNullable(), [null, null, null, null, haystack.Etc.makeDict(sys.Map.__fromLiteral(["format"], ["B"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), null]);
    let rows = sys.List.make(sys.Obj.type$.toNullable());
    items.each((item) => {
      let mime = ((this$) => { let $_u14 = ((this$) => { let $_u15 = item.mime(); if ($_u15 == null) return null; return item.mime().noParams(); })(this$); if ($_u14 == null) return null; return ((this$) => { let $_u16 = item.mime(); if ($_u16 == null) return null; return item.mime().noParams(); })(this$).toStr(); })(this$);
      let dir = ((this$) => { if (item.isDir()) return haystack.Marker.val(); return null; })(this$);
      let size = ((this$) => { if (item.size() != null) return haystack.Number.makeInt(sys.ObjUtil.coerce(item.size(), sys.Int.type$)); return null; })(this$);
      rows.add(sys.List.make(sys.Obj.type$.toNullable(), [item.uri(), item.name(), mime, dir, size, item.mod()]));
      return;
    });
    return haystack.Etc.makeListsGrid(null, cols, colMeta, sys.ObjUtil.coerce(rows, sys.Type.find("sys::Obj?[][]")));
  }

  static ioCreate(handle) {
    let h = IOFuncs.toHandle(handle);
    h.create();
    return null;
  }

  static ioDelete(handle) {
    const this$ = this;
    if (sys.ObjUtil.is(handle, sys.Type.find("sys::List"))) {
      sys.ObjUtil.coerce(handle, sys.Type.find("sys::List")).each((h) => {
        IOFuncs.ioDelete(h);
        return;
      });
      return null;
    }
    ;
    IOFuncs.toHandle(handle).delete();
    return null;
  }

  static ioCopy(from$,to,opts) {
    if (opts === undefined) opts = haystack.Etc.emptyDict();
    let fromFile = IOFuncs.toHandle(from$).toFile("ioCopy");
    let toFile = IOFuncs.toHandle(to).toFile("ioCopy");
    let optsFile = ((this$) => { if (opts.has("overwrite")) return sys.Map.__fromLiteral(["overwrite"], [sys.ObjUtil.coerce(!sys.ObjUtil.equals(opts.get("overwrite"), false), sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")); return sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")); })(this);
    fromFile.copyTo(toFile, sys.ObjUtil.coerce(optsFile, sys.Type.find("[sys::Str:sys::Obj]?")));
    return null;
  }

  static ioMove(from$,to) {
    let fromFile = IOFuncs.toHandle(from$).toFile("ioMove");
    let toFile = IOFuncs.toHandle(to).toFile("ioMove");
    fromFile.moveTo(toFile);
    return null;
  }

  static ioReadStr(handle) {
    return IOFuncs.toHandle(handle).in().readAllStr();
  }

  static ioWriteStr(str,handle) {
    const this$ = this;
    return IOFuncs.toHandle(handle).withOut((out) => {
      out.print(str);
      return;
    });
  }

  static ioReadLines(handle,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    let io = IOFuncs.toHandle(handle);
    if ((opts != null && opts.has("limit"))) {
      return sys.ObjUtil.coerce(io.withIn((in$) => {
        let max = sys.ObjUtil.coerce(opts.get("limit"), haystack.Number.type$).toInt();
        let acc = sys.List.make(sys.Str.type$);
        while (true) {
          let line = in$.readLine(sys.ObjUtil.coerce(max, sys.Int.type$.toNullable()));
          if (line == null) {
            break;
          }
          ;
          acc.add(sys.ObjUtil.coerce(line, sys.Str.type$));
        }
        ;
        return acc;
      }), sys.Type.find("sys::Str[]"));
    }
    ;
    return io.in().readAllLines();
  }

  static ioEachLine(handle,fn) {
    const this$ = this;
    return IOFuncs.toHandle(handle).withIn((in$) => {
      let cx = IOFuncs.curContext();
      let num = 0;
      let args = sys.List.make(sys.Obj.type$.toNullable(), [null, null]);
      in$.eachLine((line) => {
        fn.call(cx, args.set(0, line).set(1, haystack.Number.makeInt(num)));
        ((this$) => { let $_u20 = num;num = sys.Int.increment(num); return $_u20; })(this$);
        return;
      });
      return haystack.Number.makeInt(num);
    });
  }

  static ioStreamLines(handle) {
    return IOStreamLinesStream.make(IOFuncs.toHandle(handle));
  }

  static ioWriteLines(lines,handle) {
    const this$ = this;
    return IOFuncs.toHandle(handle).withOut((out) => {
      lines.each((line) => {
        out.printLine(line);
        return;
      });
      return;
    });
  }

  static ioReadTrio(handle) {
    const this$ = this;
    return sys.ObjUtil.coerce(IOFuncs.toHandle(handle).withIn((in$) => {
      return haystack.TrioReader.make(in$).readAllDicts();
    }), sys.Type.find("haystack::Dict[]"));
  }

  static ioWriteTrio(val,handle,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    let dicts = haystack.Etc.toRecs(val);
    return IOFuncs.toHandle(handle).withOut((out) => {
      haystack.TrioWriter.make(out, opts).writeAllDicts(dicts);
      return;
    });
  }

  static ioReadZinc(handle) {
    const this$ = this;
    return sys.ObjUtil.coerce(IOFuncs.toHandle(handle).withIn((in$) => {
      return haystack.ZincReader.make(in$).readGrid();
    }), haystack.Grid.type$);
  }

  static ioWriteZinc(val,handle) {
    const this$ = this;
    let grid = IOFuncs.toDataGrid(val);
    return IOFuncs.toHandle(handle).withOut((out) => {
      haystack.ZincWriter.make(out).writeGrid(grid);
      return;
    });
  }

  static ioReadXeto(handle,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    return IOFuncs.toHandle(handle).withIn((in$) => {
      return hx.HxContext.curHx().xeto().compileData(in$.readAllStr(), sys.ObjUtil.coerce(opts, xeto.Dict.type$.toNullable()));
    });
  }

  static ioWriteXeto(val,handle,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    return IOFuncs.toHandle(handle).withOut((out) => {
      hx.HxContext.curHx().xeto().writeData(out, sys.ObjUtil.coerce(val, sys.Obj.type$), sys.ObjUtil.coerce(opts, xeto.Dict.type$.toNullable()));
      return;
    });
  }

  static ioReadCsv(handle,opts) {
    if (opts === undefined) opts = null;
    return IOCsvReader.make(IOFuncs.curContext(), sys.ObjUtil.coerce(handle, sys.Obj.type$), opts).read();
  }

  static ioStreamCsv(handle,opts) {
    if (opts === undefined) opts = null;
    return IOStreamCsvStream.make(handle, opts);
  }

  static ioEachCsv(handle,opts,fn) {
    return IOCsvReader.make(IOFuncs.curContext(), sys.ObjUtil.coerce(handle, sys.Obj.type$), opts).each(fn);
  }

  static ioWriteCsv(val,handle,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    if (opts == null) {
      (opts = haystack.Etc.emptyDict());
    }
    ;
    let delimiter = ((this$) => { let $_u21 = sys.ObjUtil.as(opts.get("delimiter"), sys.Str.type$); if ($_u21 != null) return $_u21; return ","; })(this);
    let newline = ((this$) => { let $_u22 = sys.ObjUtil.as(opts.get("newline"), sys.Str.type$); if ($_u22 != null) return $_u22; return "\n"; })(this);
    let header = opts.get("noHeader") == null;
    let stripUnits = opts.get("stripUnits") != null;
    let grid = IOFuncs.toDataGrid(val);
    return IOFuncs.toHandle(handle).withOut((out) => {
      let csv = sys.ObjUtil.coerce(sys.ObjUtil.with(haystack.CsvWriter.make(out), (it) => {
        it.delimiter(sys.Str.get(delimiter, 0));
        it.newline(sys.ObjUtil.coerce(newline, sys.Str.type$));
        it.showHeader(header);
        it.stripUnits(stripUnits);
        return;
      }), haystack.CsvWriter.type$);
      sys.ObjUtil.coerce(csv.writeGrid(grid), haystack.CsvWriter.type$).close();
      return;
    });
  }

  static ioWriteExcel(val,handle) {
    const this$ = this;
    let listOfGrids = (sys.ObjUtil.is(val, sys.Type.find("sys::List")) && sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).all((item) => {
      return sys.ObjUtil.is(item, haystack.Grid.type$);
    }));
    if (listOfGrids) {
      return IOFuncs.toHandle(handle).withOut((out) => {
        hxUtil.ExcelWriter.make(out).writeWorkbook(sys.ObjUtil.coerce(val, sys.Type.find("haystack::Grid[]"))).close();
        return;
      });
    }
    ;
    let grid = IOFuncs.toDataGrid(val);
    return IOFuncs.toHandle(handle).withOut((out) => {
      sys.ObjUtil.coerce(hxUtil.ExcelWriter.make(out).writeGrid(grid), hxUtil.ExcelWriter.type$).close();
      return;
    });
  }

  static ioReadJson(handle,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    return IOFuncs.toHandle(handle).withIn((in$) => {
      return haystack.JsonReader.make(in$, IOFuncs.toJsonOpts(opts)).readVal();
    });
  }

  static toJsonOpts(arg) {
    let cx = IOFuncs.curContext();
    if (arg == null) {
      (arg = haystack.Etc.emptyDict());
    }
    ;
    if (cx.rt().platform().isShell()) {
      return haystack.Etc.emptyDict();
    }
    ;
    let filetype = cx.ns().filetype("json");
    let settings = cx.rt().lib("io").rec();
    return filetype.ioOpts(cx.ns(), null, sys.ObjUtil.coerce(arg, haystack.Dict.type$), settings);
  }

  static ioReadJsonGrid(handle,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    return sys.ObjUtil.coerce(IOFuncs.toHandle(handle).withIn((in$) => {
      return haystack.JsonReader.make(in$, IOFuncs.toJsonOpts(opts)).readGrid();
    }), haystack.Grid.type$);
  }

  static ioWriteJson(val,handle,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    return IOFuncs.toHandle(handle).withOut((out) => {
      (opts = IOFuncs.toJsonOpts(opts));
      let json = haystack.JsonWriter.make(out, IOFuncs.toJsonOpts(opts));
      if (opts.has("noEscapeUnicode")) {
        json.out().escapeUnicode(false);
      }
      ;
      json.writeVal(val);
      return;
    });
  }

  static ioWriteHtml(val,handle,opts) {
    if (opts === undefined) opts = haystack.Etc.emptyDict();
    const this$ = this;
    return IOFuncs.toHandle(handle).withOut((out) => {
      let req = haystack.Etc.dictMerge(opts, sys.Map.__fromLiteral(["data","filetype"], [haystack.Etc.toGrid(val).toConst(),"html"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
      IOFuncs.curContext().export(req, out);
      return;
    });
  }

  static ioWriteXml(val,handle) {
    const this$ = this;
    let grid = IOFuncs.toDataGrid(val);
    return IOFuncs.toHandle(handle).withOut((out) => {
      sys.ObjUtil.coerce(hxUtil.XmlWriter.make(out).writeGrid(grid), hxUtil.XmlWriter.type$).close();
      return;
    });
  }

  static ioWriteTurtle(val,handle) {
    const this$ = this;
    let grid = IOFuncs.toDataGrid(val);
    return IOFuncs.toHandle(handle).withOut((out) => {
      def.TurtleWriter.make(out, haystack.Etc.makeDict1("ns", IOFuncs.curContext().ns())).writeGrid(grid);
      return;
    });
  }

  static ioWriteJsonLd(val,handle) {
    const this$ = this;
    let grid = IOFuncs.toDataGrid(val);
    return IOFuncs.toHandle(handle).withOut((out) => {
      def.JsonLdWriter.make(out, haystack.Etc.makeDict1("ns", IOFuncs.curContext().ns())).writeGrid(grid);
      return;
    });
  }

  static ioZipDir(handle) {
    const this$ = this;
    let cx = IOFuncs.curContext();
    let file = IOFuncs.toHandle(handle).toFile("ioZipDir");
    let zip = IOUtil.openZip(file);
    let contents = zip.contents();
    zip.close();
    let cols = sys.List.make(sys.Str.type$, ["path", "size", "mod"]);
    let colMeta = sys.List.make(haystack.Dict.type$.toNullable(), [null, haystack.Etc.makeDict(sys.Map.__fromLiteral(["format"], ["B"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), null]);
    let rows = sys.List.make(sys.Obj.type$.toNullable());
    contents.each((f) => {
      let size = ((this$) => { if (f.size() != null) return haystack.Number.makeInt(sys.ObjUtil.coerce(f.size(), sys.Int.type$)); return null; })(this$);
      rows.add(sys.List.make(sys.Obj.type$.toNullable(), [f.uri(), size, f.modified()]));
      return;
    });
    return haystack.Etc.makeListsGrid(null, cols, colMeta, sys.ObjUtil.coerce(rows, sys.Type.find("sys::Obj?[][]")));
  }

  static ioZipEntry(handle,path) {
    try {
      ((this$) => { let $_u24 = handle; if ($_u24 == null) return null; return sys.ObjUtil.toImmutable(handle); })(this);
    }
    catch ($_u25) {
      $_u25 = sys.Err.make($_u25);
      if ($_u25 instanceof sys.NotImmutableErr) {
        let e = $_u25;
        ;
        throw sys.ArgErr.make(sys.Str.plus("Unsuppored handle for ioZipEntry: ", sys.ObjUtil.typeof(handle)));
      }
      else {
        throw $_u25;
      }
    }
    ;
    return haystack.Etc.makeDict(sys.Map.__fromLiteral(["zipEntry","file","path"], [haystack.Marker.val(),handle,path], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
  }

  static ioGzip(handle) {
    return GZipEntryHandle.make(IOFuncs.toHandle(handle));
  }

  static ioFromBase64(s) {
    return BufHandle.make(sys.Buf.fromBase64(s));
  }

  static ioToBase64(handle,opts) {
    if (opts === undefined) opts = null;
    if (opts == null) {
      (opts = haystack.Etc.emptyDict());
    }
    ;
    let buf = IOFuncs.toHandle(handle).inToBuf();
    return ((this$) => { if (opts.has("uri")) return buf.toBase64Uri(); return buf.toBase64(); })(this);
  }

  static ioToHex(handle) {
    return IOFuncs.toHandle(handle).inToBuf().toHex();
  }

  static ioCrc(handle,algorithm) {
    return sys.ObjUtil.coerce(haystack.Number.makeInt(IOFuncs.toHandle(handle).inToBuf().crc(algorithm)), haystack.Number.type$);
  }

  static ioDigest(handle,algorithm) {
    return IOFuncs.toHandle(handle).inToBuf().toDigest(algorithm);
  }

  static ioHmac(handle,algorithm,key) {
    return IOFuncs.toHandle(handle).inToBuf().hmac(algorithm, IOFuncs.toHandle(key).inToBuf());
  }

  static ioPbk(algorithm,password,salt,iterations,keyLen) {
    return sys.Buf.pbk(algorithm, password, IOFuncs.toHandle(salt).inToBuf(), iterations.toInt(), keyLen.toInt());
  }

  static ioSkip(handle,opts) {
    return SkipHandle.make(IOFuncs.toHandle(handle), opts);
  }

  static ioWritePdf(val,handle,opts) {
    if (opts === undefined) opts = haystack.Etc.emptyDict();
    const this$ = this;
    return IOFuncs.toHandle(handle).withOut((out) => {
      try {
        let req = haystack.Etc.dictMerge(opts, sys.Map.__fromLiteral(["data","filetype"], [haystack.Etc.toGrid(val).toConst(),"pdf"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
        IOFuncs.curContext().export(req, out);
      }
      catch ($_u27) {
        $_u27 = sys.Err.make($_u27);
        if ($_u27 instanceof sys.Err) {
          let e = $_u27;
          ;
          e.trace();
          throw e;
        }
        else {
          throw $_u27;
        }
      }
      ;
      return;
    });
  }

  static ioWriteSvg(val,handle,opts) {
    if (opts === undefined) opts = haystack.Etc.emptyDict();
    const this$ = this;
    return IOFuncs.toHandle(handle).withOut((out) => {
      let size = ((this$) => { let $_u28 = sys.ObjUtil.as(opts.get("size"), sys.Str.type$); if ($_u28 != null) return $_u28; return "1000,800"; })(this$);
      let req = haystack.Etc.dictMerge(opts, sys.Map.__fromLiteral(["data","filetype","size"], [haystack.Etc.toGrid(val).toConst(),"svg",size], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
      IOFuncs.curContext().export(req, out);
      return;
    });
  }

  static ioExport(req,handle) {
    const this$ = this;
    return sys.ObjUtil.coerce(IOFuncs.toHandle(handle).withOut((out) => {
      IOFuncs.curContext().export(req, out);
      return;
    }), sys.Obj.type$);
  }

  static toDataGrid(val) {
    return haystack.Etc.toGrid(val);
  }

  static toHandle(handle) {
    return IOHandle.fromObj(IOFuncs.curContext().rt(), handle);
  }

  static curContext() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static make() {
    const $self = new IOFuncs();
    IOFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class IOStreamLinesStream extends axon.SourceStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return IOStreamLinesStream.type$; }

  #handle = null;

  // private field reflection only
  __handle(it) { if (it === undefined) return this.#handle; else this.#handle = it; }

  static make(handle) {
    const $self = new IOStreamLinesStream();
    IOStreamLinesStream.make$($self,handle);
    return $self;
  }

  static make$($self,handle) {
    axon.SourceStream.make$($self);
    $self.#handle = handle;
    return;
  }

  funcName() {
    return "ioStreamLines";
  }

  funcArgs() {
    return sys.List.make(sys.Obj.type$.toNullable(), [this.#handle]);
  }

  onStart(sig) {
    const this$ = this;
    IOHandle.fromObj(this.rt(), this.#handle).withIn((in$) => {
      while (true) {
        let line = in$.readLine();
        if (line == null) {
          break;
        }
        ;
        if (this$.isComplete()) {
          break;
        }
        ;
        this$.submit(line);
      }
      ;
      return null;
    });
    return;
  }

  rt() {
    return sys.ObjUtil.coerce(this.cx(), hx.HxContext.type$).rt();
  }

}

class IOStreamCsvStream extends axon.SourceStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return IOStreamCsvStream.type$; }

  #handle = null;

  // private field reflection only
  __handle(it) { if (it === undefined) return this.#handle; else this.#handle = it; }

  #opts = null;

  // private field reflection only
  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  static make(handle,opts) {
    const $self = new IOStreamCsvStream();
    IOStreamCsvStream.make$($self,handle,opts);
    return $self;
  }

  static make$($self,handle,opts) {
    axon.SourceStream.make$($self);
    $self.#handle = handle;
    $self.#opts = opts;
    return;
  }

  funcName() {
    return "ioStreamCsv";
  }

  funcArgs() {
    return sys.List.make(sys.Obj.type$.toNullable(), [this.#handle, this.#opts]);
  }

  onStart(sig) {
    IOCsvReader.make(sys.ObjUtil.coerce(this.cx(), hx.HxContext.type$), sys.ObjUtil.coerce(this.#handle, sys.Obj.type$), sys.ObjUtil.coerce(this.#opts, haystack.Dict.type$.toNullable())).stream(this);
    return;
  }

}

class IOTest extends hx.HxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return IOTest.type$; }

  test() {
    const this$ = this;
    this.addLib("io");
    let projDir = this.rt().dir();
    this.verifyErr(axon.EvalErr.type$, (it) => {
      this$.eval("ioReadStr(`test.txt`)");
      return;
    });
    this.verifyErr(axon.EvalErr.type$, (it) => {
      this$.eval("ioReadStr(`/test.txt`)");
      return;
    });
    this.verifyErr(axon.EvalErr.type$, (it) => {
      this$.eval("ioReadStr(`../test.txt`)");
      return;
    });
    this.verifyErr(axon.EvalErr.type$, (it) => {
      this$.eval("ioReadStr(`io/../../test.txt`)");
      return;
    });
    this.verifyEq(this.eval("(\"bar\").ioToHex"), "626172");
    this.verifyEq(this.eval("ioRandom(6).ioToHex.size"), haystack.HaystackTest.n(sys.ObjUtil.coerce(12, sys.Num.type$.toNullable())));
    this.eval("ioWriteStr(\"hello world!\", `io/test.txt`)");
    this.verifyEq(this.eval("ioReadStr(`io/test.txt`)"), "hello world!");
    this.verifyEq(this.eval("ioReadStr(\"str literal\")"), "str literal");
    this.eval("ioWriteStr(\"a\", `io/append.txt`.ioAppend)");
    this.verifyEq(this.eval("ioReadStr(`io/append.txt`)"), "a");
    this.eval("ioWriteStr(\"b\", `io/append.txt`.ioAppend)");
    this.verifyEq(this.eval("ioReadStr(`io/append.txt`.ioAppend)"), "ab");
    this.eval("ioWriteStr(\"c\\nd\", ioAppend(`io/append.txt`))");
    this.verifyEq(this.eval("ioReadStr(`io/append.txt`)"), "abc\nd");
    this.eval("ioWriteLines([\"foo\", \"bar\"], ioAppend(`io/append.txt`))");
    this.verifyEq(this.eval("ioReadStr(`io/append.txt`)"), "abc\ndfoo\nbar\n");
    this.eval("ioWriteLines([\"a123\", \"b123\", \"c123\"], `io/lines.txt`)");
    this.verifyEq(this.eval("ioReadLines(`io/lines.txt`)"), sys.List.make(sys.Str.type$, ["a123", "b123", "c123"]));
    this.verifyEq(this.eval("ioReadLines(`io/lines.txt`, {limit:3})"), sys.List.make(sys.Str.type$, ["a12", "3", "b12", "3", "c12", "3"]));
    this.verifyEq(this.eval("(()=> do s: \"\"; ioEachLine(`io/lines.txt`) (x,i) => s = s + i + \":\" +  x + \" | \"; s; end)()"), "0:a123 | 1:b123 | 2:c123 | ");
    this.verifyEq(this.eval("ioStreamLines(`io/lines.txt`).limit(2).collect"), sys.List.make(sys.Obj.type$.toNullable(), ["a123", "b123"]));
    this.verifyEq(this.eval("ioStreamLines(`io/lines.txt`).limit(2).map(x=>x.upper).collect"), sys.List.make(sys.Obj.type$.toNullable(), ["A123", "B123"]));
    this.eval("ioWriteTrio([{n:\"Brian\", age:30yr}, {n:\"Andy\", marker}], `io/test.trio`)");
    let trio = sys.ObjUtil.coerce(this.eval("ioReadTrio(`io/test.trio`)"), sys.Type.find("haystack::Dict[]"));
    this.verifyEq(sys.ObjUtil.coerce(trio.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyDictEq(trio.get(0), sys.Map.__fromLiteral(["n","age"], ["Brian",haystack.HaystackTest.n(sys.ObjUtil.coerce(30, sys.Num.type$.toNullable()), "yr")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifyDictEq(trio.get(1), sys.Map.__fromLiteral(["n","marker"], ["Andy",haystack.Marker.val()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.verifyEq(this.eval("ioWriteTrio([{n:\"Brian\"}], \"\")"), "n:Brian\n");
    this.verifyEq(this.eval("ioWriteTrio([{n:\"Brian\"}], \"// hi\\n\")"), "// hi\nn:Brian\n");
    this.verifyEq(this.eval("{src:\"source\", c: \"C\", b:\"B\", a:\"A\"}.ioWriteTrio(\"\")"), "a:A\nb:B\nc:C\nsrc:source\n");
    this.verifyEq(this.eval("{src:\"source\", c: \"C\", b:\"B\", a:\"A\"}.ioWriteTrio(\"\", {noSort})"), "src:source\nc:C\nb:B\na:A\n");
    this.eval("ioWriteZinc([{n:\"Brian\", age:30yr}, {n:\"Andy\", marker}], `io/test.zinc`)");
    let zinc = sys.ObjUtil.coerce(this.eval("ioReadZinc(`io/test.zinc`)"), haystack.Grid.type$);
    this.verifyEq(sys.ObjUtil.coerce(zinc.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyDictEq(zinc.get(0), sys.Map.__fromLiteral(["n","age"], ["Brian",haystack.HaystackTest.n(sys.ObjUtil.coerce(30, sys.Num.type$.toNullable()), "yr")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifyDictEq(zinc.get(1), sys.Map.__fromLiteral(["n","marker"], ["Andy",haystack.Marker.val()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.eval("ioWriteCsv([{n:\"Brian\", age:30yr}, {n:\"Andy\", marker}], `io/test.csv`)");
    let csv = sys.ObjUtil.coerce(this.eval("ioReadCsv(`io/test.csv`)"), haystack.Grid.type$);
    this.verifyEq(sys.ObjUtil.coerce(csv.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyDictEq(csv.get(0), sys.Map.__fromLiteral(["n","age"], ["Brian","30yr"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyDictEq(csv.get(1), sys.Map.__fromLiteral(["n","marker"], ["Andy","\u2713"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.eval("ioWriteCsv([{n:\"Brian\", age:30yr}, {n:\"Andy\", marker}], `io/test-2.csv`, {delimiter:\"|\", newline:\"\\r\\n\"})");
    let s = projDir.plus(sys.Uri.fromStr("io/test-2.csv")).readAllStr(false);
    this.verifyEq(s, "age|marker|n\r\n30yr|\"\"|Brian\r\n\"\"|\u2713|Andy\r\n");
    (csv = sys.ObjUtil.coerce(this.eval("ioReadCsv(`io/test-2.csv`, {delimiter:\"|\", noHeader})"), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(csv.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(csv.colNames(), sys.List.make(sys.Str.type$, ["v0", "v1", "v2"]));
    this.verifyDictsEq(sys.ObjUtil.coerce(this.eval("ioStreamCsv(`io/test-2.csv`, {delimiter:\"|\"}).collect"), sys.Type.find("haystack::Dict?[]")), sys.List.make(sys.Type.find("[sys::Str:sys::Str]"), [sys.Map.__fromLiteral(["n","age"], ["Brian","30yr"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), sys.Map.__fromLiteral(["n","marker"], ["Andy","\u2713"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))]));
    this.verifyDictsEq(sys.ObjUtil.coerce(this.eval("ioStreamCsv(`io/test-2.csv`, {delimiter:\"|\", noHeader}).collect"), sys.Type.find("haystack::Dict?[]")), sys.List.make(sys.Type.find("[sys::Str:sys::Str]"), [sys.Map.__fromLiteral(["v0","v1","v2"], ["age","marker","n"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), sys.Map.__fromLiteral(["v2","v0"], ["Brian","30yr"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), sys.Map.__fromLiteral(["v2","v1"], ["Andy","\u2713"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))]));
    this.verifyEq(this.eval("(()=> do acc: []; ioEachCsv(`io/test.csv`, null) (x) => acc = acc.add(x[2]); acc; end)()"), sys.List.make(sys.Obj.type$.toNullable(), ["n", "Brian", "Andy"]));
    this.eval("ioWriteCsv([{n:\"Brian\", age:30yr}, {n:\"Andy\", marker}], `io/test-3.csv`, {delimiter:\"|\", newline:\"\\r\\n\", noHeader, stripUnits})");
    (s = projDir.plus(sys.Uri.fromStr("io/test-3.csv")).readAllStr(false));
    this.verifyEq(s, "30|\"\"|Brian\r\n\"\"|\u2713|Andy\r\n");
    (csv = sys.ObjUtil.coerce(this.eval("ioReadCsv(`io/test-3.csv`, {delimiter:\"|\", noHeader})"), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(csv.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(csv.colNames(), sys.List.make(sys.Str.type$, ["v0", "v1", "v2"]));
    let dir = sys.ObjUtil.coerce(this.eval("ioDir(`io/`).sort(\"name\")"), haystack.Grid.type$);
    this.verifyEq(sys.ObjUtil.coerce(dir.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(8, sys.Obj.type$.toNullable()));
    this.verifyEq(dir.get(0).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "append.txt");
    this.verifyEq(dir.get(0).trap("size", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(13, sys.Num.type$.toNullable())));
    this.verifyEq(sys.ObjUtil.trap(dir.get(0).trap("mod", sys.List.make(sys.Obj.type$.toNullable(), [])),"date", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Date.today());
    this.verifyCharset("UTF-8");
    this.verifyCharset("UTF-16BE");
    this.verifyCharset("UTF-16LE");
    projDir.plus(sys.Uri.fromStr("io/foo.txt")).out().print("foo!").close();
    this.eval("ioCopy(`io/foo.txt`, `io/foo-copy.txt`)");
    this.verifyEq(sys.ObjUtil.coerce(projDir.plus(sys.Uri.fromStr("io/foo-copy.txt")).exists(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(projDir.plus(sys.Uri.fromStr("io/foo-copy.txt")).readAllStr(), "foo!");
    projDir.plus(sys.Uri.fromStr("io/foo.txt")).out().print("foo 2!").close();
    this.verifyErr(axon.EvalErr.type$, (it) => {
      this$.eval("ioCopy(`io/foo.txt`, `io/foo-copy.txt`)");
      return;
    });
    this.verifyEq(projDir.plus(sys.Uri.fromStr("io/foo-copy.txt")).readAllStr(), "foo!");
    this.eval("ioCopy(`io/foo.txt`, `io/foo-copy.txt`, {overwrite: false})");
    this.verifyEq(projDir.plus(sys.Uri.fromStr("io/foo-copy.txt")).readAllStr(), "foo!");
    this.eval("ioCopy(`io/foo.txt`, `io/foo-copy.txt`, {overwrite})");
    this.verifyEq(projDir.plus(sys.Uri.fromStr("io/foo-copy.txt")).readAllStr(), "foo 2!");
    projDir.plus(sys.Uri.fromStr("io/sub/a.txt")).out().print("a!").close();
    projDir.plus(sys.Uri.fromStr("io/sub/b.txt")).out().print("b!").close();
    this.eval("ioCopy(`io/sub/`, `io/sub-copy/`)");
    this.verifyEq(projDir.plus(sys.Uri.fromStr("io/sub-copy/a.txt")).readAllStr(), "a!");
    this.verifyEq(projDir.plus(sys.Uri.fromStr("io/sub-copy/b.txt")).readAllStr(), "b!");
    this.eval("ioMove(`io/sub-copy/b.txt`, `io/sub-copy/b2.txt`)");
    this.eval("ioMove(`io/sub-copy/`, `io/sub-move/`)");
    this.verifyEq(sys.ObjUtil.coerce(projDir.plus(sys.Uri.fromStr("io/sub-copy/")).exists(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(projDir.plus(sys.Uri.fromStr("io/sub-move/")).exists(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(projDir.plus(sys.Uri.fromStr("io/sub-move/a.txt")).readAllStr(), "a!");
    this.verifyEq(projDir.plus(sys.Uri.fromStr("io/sub-move/b2.txt")).readAllStr(), "b!");
    this.verifyEq(sys.ObjUtil.coerce(projDir.plus(sys.Uri.fromStr("io/lines.txt")).exists(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.eval("ioDelete(`io/lines.txt`)");
    this.verifyEq(sys.ObjUtil.coerce(projDir.plus(sys.Uri.fromStr("io/lines.txt")).exists(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(projDir.plus(sys.Uri.fromStr("io/foo/")).exists(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.eval("ioCreate(`io/foo/`)");
    this.verifyEq(sys.ObjUtil.coerce(projDir.plus(sys.Uri.fromStr("io/foo/")).exists(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(projDir.plus(sys.Uri.fromStr("io/foo/bar.txt")).exists(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.eval("ioCreate(`io/foo/bar.txt`)");
    this.verifyEq(sys.ObjUtil.coerce(projDir.plus(sys.Uri.fromStr("io/foo/bar.txt")).exists(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(projDir.plus(sys.Uri.fromStr("io/foo/bar.txt")).readAllStr(), "");
    projDir.plus(sys.Uri.fromStr("io/more.csv")).out().print("Name,Name, name , , Foo Bar,\nB,Brian,Frank,b1,3,b2\nA,Andy,Frank,b1,4,").close();
    (csv = sys.ObjUtil.coerce(this.eval("ioReadCsv(`io/more.csv`)"), haystack.Grid.type$));
    this.verifyDictEq(csv.get(0), sys.Map.__fromLiteral(["name","name_1","name_2","fooBar","blank","blank_1"], ["B","Brian","Frank","3","b1","b2"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyDictEq(csv.get(1), sys.Map.__fromLiteral(["name","name_1","name_2","fooBar","blank","blank_1"], ["A","Andy","Frank","4","b1",null], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?")));
    this.eval("ioWriteXml([{n:\"Brian\", age:30yr}, {n:\"Andy\", foo}], `io/test.xml`)");
    this.verifyEq(projDir.plus(sys.Uri.fromStr("io/test.xml")).readAllStr(), "<grid ver='3.0'>\n\n<cols>\n<age/>\n<foo/>\n<n/>\n</cols>\n\n<row>\n<age kind='Number' val='30yr'/>\n<n kind='Str' val='Brian'/>\n</row>\n<row>\n<foo kind='Marker'/>\n<n kind='Str' val='Andy'/>\n</row>\n</grid>\n");
    this.eval("{l:[1,2], d:{dis:\"Dict\"}, g:[].toGrid}.toGrid({foo, bar:^hi}).addColMeta(\"d\", {dis:\"D&D\", x:{baz}}).ioWriteXml(`io/test.xml`)");
    this.verifyEq(projDir.plus(sys.Uri.fromStr("io/test.xml")).readAllStr(), "<grid ver='3.0'>\n<meta>\n<foo kind='Marker'/>\n<bar kind='Symbol' val='hi'/>\n</meta>\n\n<cols>\n<l/>\n<d dis='D&amp;D'>\n<meta>\n<x kind='Dict'>\n<baz kind='Marker'/>\n</x>\n</meta>\n</d>\n<g/>\n</cols>\n\n<row>\n<l kind='List'>\n<item kind='Number' val='1'/>\n<item kind='Number' val='2'/>\n</l>\n<d kind='Dict'>\n<dis kind='Str' val='Dict'/>\n</d>\n<g kind='Grid'>\n\n<cols>\n<empty/>\n</cols>\n\n</g>\n</row>\n</grid>\n");
    projDir.plus(sys.Uri.fromStr("io/json.txt")).out().print("{\"name\":\"Brian\",\n\"int\": 123,\n\"float\": 10.2,\n\"bool\": true,\n\"list\": [1, null, 3],\n\"map.it\": {\"foo\":9},\n\"whatType\":\"d:2018-07-18\"\n}").close();
    let json = sys.ObjUtil.coerce(this.eval("ioReadJson(`io/json.txt`, {v3})"), haystack.Dict.type$);
    this.verifyEq(json.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Brian");
    this.verifyEq(json.trap("int", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())));
    this.verifyEq(json.trap("float", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(10.2), sys.Num.type$.toNullable())));
    this.verifyEq(json.trap("bool", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(json.trap("list", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.List.make(haystack.Number.type$.toNullable(), [haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable())), null, haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()))]));
    this.verify(sys.ObjUtil.is(json.get("map.it"), haystack.Dict.type$));
    this.verifyEq(sys.ObjUtil.trap(json.get("map.it"),"foo", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(9, sys.Num.type$.toNullable())));
    this.verifyEq(json.trap("whatType", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Date.fromStr("2018-07-18"));
    (json = sys.ObjUtil.coerce(this.eval("ioReadJson(`io/json.txt`, {safeNames})"), haystack.Dict.type$));
    this.verify(sys.ObjUtil.is(json.trap("map_it", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Dict.type$));
    this.verifyEq(sys.ObjUtil.trap(json.trap("map_it", sys.List.make(sys.Obj.type$.toNullable(), [])),"foo", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(9, sys.Num.type$.toNullable())));
    this.verifyEq(json.trap("whatType", sys.List.make(sys.Obj.type$.toNullable(), [])), "d:2018-07-18");
    (json = sys.ObjUtil.coerce(this.eval("ioReadJson(`io/json.txt`, {v3, safeNames, notHaystack})"), haystack.Dict.type$));
    this.verify(sys.ObjUtil.is(json.trap("map_it", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Dict.type$));
    this.verifyEq(sys.ObjUtil.trap(json.trap("map_it", sys.List.make(sys.Obj.type$.toNullable(), [])),"foo", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(9, sys.Num.type$.toNullable())));
    this.verifyEq(json.trap("whatType", sys.List.make(sys.Obj.type$.toNullable(), [])), "d:2018-07-18");
    projDir.plus(sys.Uri.fromStr("io/json.txt")).out().print("{\"a\":\"d:2018-07-18\",\n \"b\":\"d:bad\"}").close();
    (json = sys.ObjUtil.coerce(this.eval("ioReadJson(`io/json.txt`, {v3, safeVals})"), haystack.Dict.type$));
    this.verifyEq(json.trap("a", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Date.fromStr("2018-07-18"));
    this.verifyEq(json.trap("b", sys.List.make(sys.Obj.type$.toNullable(), [])), "d:bad");
    this.eval("ioWriteJson([{n:\"Brian\", age:30yr}, {n:\"Andy\", bday:1980-01-31, nil: null}], `io/json.txt`, {v3})");
    this.verifyEq(projDir.plus(sys.Uri.fromStr("io/json.txt")).readAllStr(), "[{\"n\":\"Brian\", \"age\":\"n:30 yr\"}, {\"n\":\"Andy\", \"bday\":\"d:1980-01-31\"}]");
    this.verifyEq(this.eval("ioWriteJson(\"75\u00b0F\", \"\")"), "\"75\\u00b0F\"");
    this.verifyEq(this.eval("ioWriteJson(\"75\u00b0F\", \"\", {noEscapeUnicode})"), "\"75\u00b0F\"");
    this.eval("ioWriteJson([{n:\"Brian\", age:30yr}, {n:\"Andy\"}].toGrid.reorderCols([\"n\", \"age\"]), `io/json.txt`, {v3})");
    this.verifyEq(projDir.plus(sys.Uri.fromStr("io/json.txt")).readAllStr(), "{\n\"meta\": {\"ver\":\"3.0\"},\n\"cols\":[\n{\"name\":\"n\"},\n{\"name\":\"age\"}\n],\n\"rows\":[\n{\"n\":\"Brian\", \"age\":\"n:30 yr\"},\n{\"n\":\"Andy\"}\n]\n}\n");
    let g = sys.ObjUtil.coerce(this.eval("ioReadJsonGrid(`io/json.txt`, {v3})"), haystack.Grid.type$);
    this.verifyGridEq(g, sys.ObjUtil.coerce(this.eval("[{n:\"Brian\", age:30yr}, {n:\"Andy\"}].toGrid.reorderCols([\"n\", \"age\"])"), haystack.Grid.type$));
    projDir.plus(sys.Uri.fromStr("io/foo.xeto")).out().print("Date \"2023-11-21\"").close();
    let xeto = this.eval("ioReadXeto(`io/foo.xeto`)");
    this.verifyEq(xeto, sys.Date.fromStr("2023-11-21"));
    projDir.plus(sys.Uri.fromStr("io/foo.xeto")).out().print("sys::Dict {\n  ref: @foo-bar\n}").close();
    (xeto = this.eval("ioReadXeto(`io/foo.xeto`, {externRefs})"));
    this.verifyDictEq(sys.ObjUtil.coerce(xeto, haystack.Dict.type$), sys.Map.__fromLiteral(["ref"], [haystack.Ref.fromStr("foo-bar")], sys.Type.find("sys::Str"), sys.Type.find("haystack::Ref?")));
    this.eval("ioWriteXeto([{n:\"Brian\", age:30yr}, {n:\"Andy\", bday:1980-01-31}], `io/foo.xeto`)");
    this.verifyEq(sys.Str.trim(projDir.plus(sys.Uri.fromStr("io/foo.xeto")).readAllStr()), "Dict {\n  n: \"Brian\"\n  age: Number \"30yr\"\n}\n\nDict {\n  n: \"Andy\"\n  bday: Date \"1980-01-31\"\n}");
    let zip = sys.Zip.write(projDir.plus(sys.Uri.fromStr("io/zipped.zip")).out());
    zip.writeNext(sys.Uri.fromStr("/alpha.txt")).print("alpha!").close();
    zip.writeNext(sys.Uri.fromStr("/beta.csv")).print("a,b\n1a,1b\n2a,2b").close();
    zip.close();
    (dir = sys.ObjUtil.coerce(this.eval("ioZipDir(`io/zipped.zip`)"), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(dir.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(dir.get(0).trap("path", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Uri.fromStr("/alpha.txt"));
    this.verifyEq(dir.get(0).trap("size", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(6, sys.Num.type$.toNullable())));
    this.verifyEq(sys.ObjUtil.trap(dir.get(0).trap("mod", sys.List.make(sys.Obj.type$.toNullable(), [])),"date", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Date.today());
    this.verifyEq(dir.get(1).trap("path", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Uri.fromStr("/beta.csv"));
    this.verifyEq(this.eval("ioZipEntry(`io/zipped.zip`, `/alpha.txt`).ioReadStr"), "alpha!");
    (csv = sys.ObjUtil.coerce(this.eval("ioZipEntry(`io/zipped.zip`, `/beta.csv`).ioReadCsv"), haystack.Grid.type$));
    this.verifyDictEq(csv.get(0), sys.Map.__fromLiteral(["a","b"], ["1a","1b"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyDictEq(csv.get(1), sys.Map.__fromLiteral(["a","b"], ["2a","2b"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    sys.Zip.gzipOutStream(projDir.plus(sys.Uri.fromStr("io/foo.gz")).out()).print("a,b\n1,2\n3,4\n").close();
    this.verifyEq(this.eval("ioGzip(`io/foo.gz`).ioReadStr"), "a,b\n1,2\n3,4\n");
    this.verifyDictEq(sys.ObjUtil.coerce(this.eval("ioGzip(`io/foo.gz`).ioReadCsv.first"), haystack.Dict.type$), sys.Map.__fromLiteral(["a","b"], ["1","2"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.eval("\"gzip out!\".ioWriteStr(ioGzip(`io/bar.gz`))");
    this.verifyEq(sys.Zip.gzipInStream(projDir.plus(sys.Uri.fromStr("io/bar.gz")).in()).readAllStr(), "gzip out!");
    this.verifyEq(this.eval("ioToBase64(\"safe base64~~\")"), sys.Str.toBuf("safe base64~~").toBase64());
    this.verifyEq(this.eval("ioToBase64(\"safe base64~~\", null)"), sys.Str.toBuf("safe base64~~").toBase64());
    this.verifyEq(this.eval("ioToBase64(\"safe base64~~\", {uri})"), sys.Str.toBuf("safe base64~~").toBase64Uri());
    this.verifyEq(this.eval("ioFromBase64(\"c2t5c3Bhcms\").ioReadStr"), "skyspark");
    this.verifyEq(this.eval("ioCrc(\"foo\", \"CRC-32\").toHex"), sys.Int.toHex(sys.Str.toBuf("foo").crc("CRC-32")));
    this.verifyEq(this.eval("ioDigest(\"foo\", \"MD5\").ioToBase64"), sys.Str.toBuf("foo").toDigest("MD5").toBase64());
    this.verifyEq(this.eval("ioDigest(\"foo\", \"SHA-1\").ioToBase64"), sys.Str.toBuf("foo").toDigest("SHA-1").toBase64());
    this.verifyEq(this.eval("ioHmac(\"foo\", \"SHA-1\", \"secret\").ioToBase64"), sys.Str.toBuf("foo").hmac("SHA-1", sys.Str.toBuf("secret")).toBase64());
    this.verifyEq(this.eval("ioPbk(\"PBKDF2WithHmacSHA1\", \"secret\", \"_salt_\", 1000, 20).ioToBase64"), sys.Buf.pbk("PBKDF2WithHmacSHA1", "secret", sys.Str.toBuf("_salt_"), 1000, 20).toBase64());
    this.verifyEq(this.eval("ioSkip(\"a\\n\\nc\\nd\\ne\", {lines:0}).ioReadLines"), sys.List.make(sys.Str.type$, ["a", "", "c", "d", "e"]));
    this.verifyEq(this.eval("ioSkip(\"a\\n\\nc\\nd\\ne\", {lines:1}).ioReadLines"), sys.List.make(sys.Str.type$, ["", "c", "d", "e"]));
    this.verifyEq(this.eval("ioSkip(\"a\\n\\nc\\nd\\ne\", {lines:2}).ioReadLines"), sys.List.make(sys.Str.type$, ["c", "d", "e"]));
    this.verifyEq(this.eval("ioSkip(\"a\\n\\nc\\nd\\ne\", {lines:3}).ioReadLines"), sys.List.make(sys.Str.type$, ["d", "e"]));
    this.verifyEq(this.eval("ioSkip(\"a\\n\\nc\\nd\\ne\", {lines:4}).ioReadLines"), sys.List.make(sys.Str.type$, ["e"]));
    this.verifyEq(this.eval("ioSkip(\"a\\n\\nc\\nd\\ne\", {lines:5}).ioReadLines"), sys.List.make(sys.Str.type$));
    this.verifyEq(this.eval("ioSkip(\"a\\n\\nc\\nd\\ne\", {lines:6}).ioReadLines"), sys.List.make(sys.Str.type$));
    this.verifyEq(this.eval("ioSkip(\"a\\u0394bcde\", {chars:0}).ioReadStr"), "a\u0394bcde");
    this.verifyEq(this.eval("ioSkip(\"a\\u0394bcde\", {chars:1}).ioReadStr"), "\u0394bcde");
    this.verifyEq(this.eval("ioSkip(\"a\\u0394bcde\", {chars:2}).ioReadStr"), "bcde");
    this.verifyEq(this.eval("ioSkip(\"a\\u0394bcde\", {chars:5}).ioReadStr"), "e");
    this.verifyEq(this.eval("ioSkip(\"a\\u0394bcde\", {chars:6}).ioReadStr"), "");
    this.verifySkipBom(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(254, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable())]), sys.Charset.utf16BE());
    this.verifySkipBom(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(254, sys.Obj.type$.toNullable())]), sys.Charset.utf16LE());
    this.verifySkipBom(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(239, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(187, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(191, sys.Obj.type$.toNullable())]), sys.Charset.utf8());
    let str = sys.ObjUtil.toStr(this.eval("ioReadStr(`fan://haystack/locale/en.props`)"));
    this.verifyEq(sys.ObjUtil.coerce(sys.Str.contains(str, "Copyright"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyErr(axon.EvalErr.type$, (it) => {
      this$.eval("ioReadStr(`fan://ioExt/lib/lib.trio`)");
      return;
    });
    this.verifyErr(axon.EvalErr.type$, (it) => {
      this$.eval("ioReadStr(`fan://ioExt/badfile.txt`)");
      return;
    });
    this.verifyErr(axon.EvalErr.type$, (it) => {
      this$.eval("ioReadStr(`fan://badPodFooBar/badfile.txt`)");
      return;
    });
    if (this.rt().platform().isSkySpark()) {
      let f = this.addRec(sys.Map.__fromLiteral(["file"], [haystack.Bin.make("text/plain")], sys.Type.find("sys::Str"), sys.Type.find("haystack::Bin?")));
      this.eval(sys.Str.plus(sys.Str.plus("ioWriteStr(\"bin test!\", readById(", f.id().toCode()), "))"));
      let text = this.eval(sys.Str.plus(sys.Str.plus("readById(", f.id().toCode()), ").ioReadStr()"));
      this.verifyEq(text, "bin test!");
      (f = this.addRec(sys.Map.__fromLiteral(["foo"], [haystack.Bin.make("text/plain")], sys.Type.find("sys::Str"), sys.Type.find("haystack::Bin?"))));
      this.eval(sys.Str.plus(sys.Str.plus("ioWriteStr(\"bin test foo!\", readById(", f.id().toCode()), ").ioBin(\"foo\"))"));
      (text = this.eval(sys.Str.plus(sys.Str.plus("ioBin(readById(", f.id().toCode()), "), \"foo\").ioReadStr()")));
      this.verifyEq(text, "bin test foo!");
    }
    ;
    return;
  }

  verifyEvalErrMsg($axon,msg) {
    try {
      this.eval($axon);
      this.fail();
    }
    catch ($_u29) {
      $_u29 = sys.Err.make($_u29);
      if ($_u29 instanceof axon.EvalErr) {
        let e = $_u29;
        ;
        this.verifyEq(e.cause().toStr(), msg);
      }
      else {
        throw $_u29;
      }
    }
    ;
    return;
  }

  verifyCharset(charset) {
    let unicode = "abc \u00ab ! \u01cf \n \u3c00";
    let expr = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("ioWriteStr(", sys.Str.toCode(unicode)), ", `io/charset.txt`.ioCharset("), sys.Str.toCode(charset)), "))");
    this.eval(expr);
    let in$ = this.rt().dir().plus(sys.Uri.fromStr("io/charset.txt")).in();
    in$.charset(sys.ObjUtil.coerce(sys.Charset.fromStr(charset), sys.Charset.type$));
    this.verifyEq(in$.readAllStr(), unicode);
    in$.close();
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus("ioReadStr(ioCharset(`io/charset.txt`, ", sys.Str.toCode(charset)), "))")), unicode);
    return;
  }

  testBufHandle() {
    const this$ = this;
    let buf = sys.Buf.make();
    let h = IOHandle.fromObj(sys.ObjUtil.coerce(this.rt(), hx.HxRuntime.type$), buf);
    this.verify(sys.ObjUtil.is(h, BufHandle.type$));
    let res = h.withOut((out) => {
      out.writeChars("Foo");
      return;
    });
    this.verifyEq(sys.ObjUtil.trap(res,"size", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())));
    (h = IOHandle.fromObj(sys.ObjUtil.coerce(this.rt(), hx.HxRuntime.type$), sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable())));
    let s = h.withIn((in$) => {
      return in$.readAllStr();
    });
    this.verifyEq(s, "Foo");
    return;
  }

  verifySkipBom(bytes,charset) {
    const this$ = this;
    let str = "skyspark \u0394 rocks!\nline 2";
    let buf = sys.Buf.make();
    bytes.each((b) => {
      buf.write(b);
      return;
    });
    buf.charset(charset);
    buf.print(str);
    let base64 = buf.toBase64();
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus("ioFromBase64(", sys.Str.toCode(base64)), ").ioSkip({bom}).ioReadStr")), str);
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus("ioFromBase64(", sys.Str.toCode(base64)), ").ioSkip({bom, chars:2}).ioReadStr")), sys.Str.getRange(str, sys.Range.make(2, -1)));
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus("ioFromBase64(", sys.Str.toCode(base64)), ").ioSkip({bom, lines:1}).ioReadStr")), "line 2");
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("ioFromBase64(", sys.Str.toCode(base64)), ").ioSkip({bytes:"), sys.ObjUtil.coerce(bytes.size(), sys.Obj.type$.toNullable())), "}).ioCharset("), sys.Str.toCode(charset.toStr())), ").ioReadStr")), str);
    (base64 = sys.ObjUtil.coerce(sys.Buf.make().print(str), sys.Buf.type$.toNullable()).toBase64());
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus("ioFromBase64(", sys.Str.toCode(base64)), ").ioSkip({bom}).ioReadStr")), str);
    return;
  }

  static make() {
    const $self = new IOTest();
    IOTest.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxTest.make$($self);
    return;
  }

}

const p = sys.Pod.add$('hxIO');
const xp = sys.Param.noParams$();
let m;
IOLib.type$ = p.at$('IOLib','hx::HxLib',['hx::HxIOService'],{},8194,IOLib);
IOUtil.type$ = p.at$('IOUtil','sys::Obj',[],{},8194,IOUtil);
IOCsvReader.type$ = p.at$('IOCsvReader','sys::Obj',[],{},128,IOCsvReader);
IOHandle.type$ = p.at$('IOHandle','sys::Obj',[],{},8193,IOHandle);
DirItem.type$ = p.at$('DirItem','sys::Obj',[],{},8194,DirItem);
CharsetHandle.type$ = p.at$('CharsetHandle','hxIO::IOHandle',[],{},128,CharsetHandle);
StrHandle.type$ = p.at$('StrHandle','hxIO::IOHandle',[],{},128,StrHandle);
BufHandle.type$ = p.at$('BufHandle','hxIO::IOHandle',[],{},128,BufHandle);
FileHandle.type$ = p.at$('FileHandle','hxIO::IOHandle',[],{},128,FileHandle);
BinHandle.type$ = p.at$('BinHandle','hxIO::IOHandle',[],{},128,BinHandle);
ZipEntryHandle.type$ = p.at$('ZipEntryHandle','hxIO::IOHandle',[],{},128,ZipEntryHandle);
ZipEntryInStream.type$ = p.at$('ZipEntryInStream','sys::InStream',[],{},128,ZipEntryInStream);
GZipEntryHandle.type$ = p.at$('GZipEntryHandle','hxIO::IOHandle',[],{},128,GZipEntryHandle);
FanHandle.type$ = p.at$('FanHandle','hxIO::IOHandle',[],{},128,FanHandle);
HttpHandle.type$ = p.at$('HttpHandle','hxIO::IOHandle',[],{},128,HttpHandle);
FtpHandle.type$ = p.at$('FtpHandle','hxIO::IOHandle',[],{},128,FtpHandle);
SkipHandle.type$ = p.at$('SkipHandle','hxIO::IOHandle',[],{},128,SkipHandle);
IOFuncs.type$ = p.at$('IOFuncs','sys::Obj',[],{},8194,IOFuncs);
IOStreamLinesStream.type$ = p.at$('IOStreamLinesStream','axon::SourceStream',[],{},128,IOStreamLinesStream);
IOStreamCsvStream.type$ = p.at$('IOStreamCsvStream','axon::SourceStream',[],{},128,IOStreamCsvStream);
IOTest.type$ = p.at$('IOTest','hx::HxTest',[],{},8192,IOTest);
IOLib.type$.am$('services',271360,'hx::HxService[]',xp,{}).am$('read',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('f','|sys::InStream->sys::Obj?|',false)]),{}).am$('write',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('f','|sys::OutStream->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{});
IOUtil.type$.am$('toFile',40962,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false),new sys.Param('obj','sys::Obj',false),new sys.Param('debugAction','sys::Str',false)]),{}).am$('openZip',32898,'sys::Zip',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('make',139268,'sys::Void',xp,{});
IOCsvReader.type$.af$('cx',67584,'hx::HxContext',{}).af$('handle',67584,'sys::Obj',{}).af$('opts',67586,'haystack::Dict',{}).af$('noHeader',67586,'sys::Bool',{}).af$('delimiter',67586,'sys::Str',{}).af$('submitted',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false),new sys.Param('handle','sys::Obj',false),new sys.Param('opts','haystack::Dict?',false)]),{}).am$('read',8192,'haystack::Grid',xp,{}).am$('each',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('fn','axon::Fn',false)]),{}).am$('stream',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('stream','hxIO::IOStreamCsvStream',false)]),{}).am$('submit',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('stream','axon::MStream',false),new sys.Param('colNames','sys::Str[]',false),new sys.Param('cells','sys::Str[]',false)]),{}).am$('genColNames',2048,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('firstRow','sys::Str[]',false)]),{}).am$('normColNames',2048,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('firstRow','sys::Str[]',false)]),{}).am$('makeCsvInStream',2048,'util::CsvInStream',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('checkColCount',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('colNames','sys::Str[]',false),new sys.Param('cells','sys::Str[]',false),new sys.Param('rowIndex','sys::Int',false)]),{}).am$('normCell',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cell','sys::Str',false)]),{}).am$('toHandle',2048,'hxIO::IOHandle',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{});
IOHandle.type$.am$('fromObj',40962,'hxIO::IOHandle',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false),new sys.Param('h','sys::Obj?',false)]),{}).am$('fromUri',32898,'hxIO::IOHandle',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false),new sys.Param('uri','sys::Uri',false)]),{}).am$('fromDict',32898,'hxIO::IOHandle',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('tag','sys::Str',false)]),{}).am$('toFile',270336,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('func','sys::Str',false)]),{}).am$('dir',270336,'hxIO::DirItem[]',xp,{}).am$('toAppend',270336,'hxIO::IOHandle',xp,{}).am$('create',270336,'sys::Void',xp,{}).am$('delete',270336,'sys::Void',xp,{}).am$('info',270336,'hxIO::DirItem',xp,{}).am$('withIn',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::InStream->sys::Obj?|',false)]),{}).am$('withOut',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::OutStream->sys::Void|',false)]),{}).am$('in',270337,'sys::InStream',xp,{}).am$('out',270337,'sys::OutStream',xp,{}).am$('withOutResult',262272,'sys::Obj?',xp,{}).am$('inToBuf',270336,'sys::Buf',xp,{}).am$('make',139268,'sys::Void',xp,{});
DirItem.type$.af$('uri',73730,'sys::Uri',{}).af$('name',73730,'sys::Str',{}).af$('mime',73730,'sys::MimeType?',{}).af$('isDir',73730,'sys::Bool',{}).af$('size',73730,'sys::Int?',{}).af$('mod',73730,'sys::DateTime?',{}).am$('makeFile',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('file','sys::File',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('name','sys::Str',false),new sys.Param('mime','sys::MimeType?',false),new sys.Param('isDir','sys::Bool',false),new sys.Param('size','sys::Int?',false),new sys.Param('mod','sys::DateTime?',false)]),{});
CharsetHandle.type$.af$('handle',73728,'hxIO::IOHandle',{}).af$('charset',73730,'sys::Charset',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('h','hxIO::IOHandle',false),new sys.Param('charset','sys::Charset',false)]),{}).am$('in',271360,'sys::InStream',xp,{}).am$('out',271360,'sys::OutStream',xp,{}).am$('withOutResult',271360,'sys::Obj?',xp,{});
StrHandle.type$.af$('str',73730,'sys::Str',{}).af$('buf',73728,'sys::StrBuf?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('in',271360,'sys::InStream',xp,{}).am$('out',271360,'sys::OutStream',xp,{}).am$('withOutResult',271360,'sys::Obj?',xp,{}).am$('inToBuf',271360,'sys::Buf',xp,{});
BufHandle.type$.af$('buf',73728,'sys::Buf',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('toFile',271360,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('func','sys::Str',false)]),{}).am$('in',271360,'sys::InStream',xp,{}).am$('out',271360,'sys::OutStream',xp,{}).am$('withOutResult',271360,'sys::Obj?',xp,{});
FileHandle.type$.af$('file',73730,'sys::File',{}).af$('append',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('makeAppend',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('toFile',271360,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('func','sys::Str',false)]),{}).am$('toAppend',271360,'hxIO::IOHandle',xp,{}).am$('in',271360,'sys::InStream',xp,{}).am$('out',271360,'sys::OutStream',xp,{}).am$('withOutResult',271360,'sys::Obj?',xp,{}).am$('dir',271360,'hxIO::DirItem[]',xp,{}).am$('info',271360,'hxIO::DirItem',xp,{});
BinHandle.type$.af$('proj',73730,'sys::Obj',{}).af$('rec',73730,'haystack::Dict',{}).af$('tag',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('tag','sys::Str',false)]),{}).am$('in',271360,'sys::InStream',xp,{}).am$('out',271360,'sys::OutStream',xp,{});
ZipEntryHandle.type$.af$('file',73730,'sys::File',{}).af$('path',73730,'sys::Uri',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('path','sys::Uri',false)]),{}).am$('in',271360,'sys::InStream',xp,{}).am$('out',271360,'sys::OutStream',xp,{});
ZipEntryInStream.type$.af$('zip',67584,'sys::Zip',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('zip','sys::Zip',false),new sys.Param('in','sys::InStream',false)]),{}).am$('close',271360,'sys::Bool',xp,{});
GZipEntryHandle.type$.af$('handle',73728,'hxIO::IOHandle',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('handle','hxIO::IOHandle',false)]),{}).am$('in',271360,'sys::InStream',xp,{}).am$('out',271360,'sys::OutStream',xp,{});
FanHandle.type$.af$('uri',73730,'sys::Uri',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('in',271360,'sys::InStream',xp,{}).am$('out',271360,'sys::OutStream',xp,{}).am$('dir',271360,'hxIO::DirItem[]',xp,{}).am$('toFanFile',2048,'sys::File',xp,{});
HttpHandle.type$.af$('uri',73730,'sys::Uri',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('in',271360,'sys::InStream',xp,{}).am$('out',271360,'sys::OutStream',xp,{}).am$('toFile',271360,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('func','sys::Str',false)]),{}).am$('toClient',8192,'web::WebClient',xp,{});
FtpHandle.type$.af$('rt',73730,'hx::HxRuntime',{}).af$('uri',73730,'sys::Uri',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false),new sys.Param('uri','sys::Uri',false)]),{}).am$('create',271360,'sys::Void',xp,{}).am$('delete',271360,'sys::Void',xp,{}).am$('in',271360,'sys::InStream',xp,{}).am$('out',271360,'sys::OutStream',xp,{}).am$('dir',271360,'hxIO::DirItem[]',xp,{}).am$('open',8192,'ftp::FtpClient',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{});
SkipHandle.type$.af$('handle',73728,'hxIO::IOHandle',{}).af$('opts',73730,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('h','hxIO::IOHandle',false),new sys.Param('opts','haystack::Dict',false)]),{}).am$('out',271360,'sys::OutStream',xp,{}).am$('in',271360,'sys::InStream',xp,{}).am$('skipBytes',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('num','sys::Int',false)]),{}).am$('skipChars',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('num','sys::Int',false)]),{}).am$('skipLines',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('num','sys::Int',false)]),{}).am$('skipBom',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('toInt',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false)]),{});
IOFuncs.type$.am$('ioRandom',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('size','haystack::Number',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioCharset',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('charset','sys::Str',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioAppend',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioBin',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('rec','sys::Obj',false),new sys.Param('tag','sys::Str',false)]),{'sys::NoDoc':"",'sys::Deprecated':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioDir',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioInfo',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('toInfoGrid',34818,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('items','hxIO::DirItem[]',false)]),{}).am$('ioCreate',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioDelete',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioCopy',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('from','sys::Obj?',false),new sys.Param('to','sys::Obj?',false),new sys.Param('opts','haystack::Dict',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioMove',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('from','sys::Obj?',false),new sys.Param('to','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioReadStr',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioWriteStr',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioReadLines',40962,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','haystack::Dict?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioEachLine',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioStreamLines',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioWriteLines',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lines','sys::Str[]',false),new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioReadTrio',40962,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioWriteTrio',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','haystack::Dict?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioReadZinc',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioWriteZinc',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioReadXeto',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','sys::Obj?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioWriteXeto',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','sys::Obj?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioReadCsv',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','haystack::Dict?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioStreamCsv',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','haystack::Dict?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioEachCsv',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioWriteCsv',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','haystack::Dict?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioWriteExcel',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioReadJson',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','haystack::Dict?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('toJsonOpts',34818,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('arg','haystack::Dict?',false)]),{}).am$('ioReadJsonGrid',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','haystack::Dict?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioWriteJson',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','haystack::Dict?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioWriteHtml',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','haystack::Dict',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioWriteXml',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioWriteTurtle',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioWriteJsonLd',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioZipDir',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioZipEntry',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('path','sys::Uri',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioGzip',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioFromBase64',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioToBase64',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','haystack::Dict?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioToHex',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioCrc',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('algorithm','sys::Str',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioDigest',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('algorithm','sys::Str',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioHmac',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('algorithm','sys::Str',false),new sys.Param('key','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioPbk',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('algorithm','sys::Str',false),new sys.Param('password','sys::Str',false),new sys.Param('salt','sys::Obj?',false),new sys.Param('iterations','haystack::Number',false),new sys.Param('keyLen','haystack::Number',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioSkip',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','haystack::Dict',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioWritePdf',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','haystack::Dict',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioWriteSvg',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','haystack::Dict',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('ioExport',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Dict',false),new sys.Param('handle','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('toDataGrid',32898,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('toHandle',32898,'hxIO::IOHandle',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false)]),{}).am$('curContext',32898,'hx::HxContext',xp,{}).am$('make',139268,'sys::Void',xp,{});
IOStreamLinesStream.type$.af$('handle',67584,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sig','axon::Signal',false)]),{}).am$('rt',8192,'hx::HxRuntime',xp,{});
IOStreamCsvStream.type$.af$('handle',67584,'sys::Obj?',{}).af$('opts',67584,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('opts','haystack::Dict?',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sig','axon::Signal',false)]),{});
IOTest.type$.am$('test',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('verifyEvalErrMsg',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('axon','sys::Str',false),new sys.Param('msg','sys::Str',false)]),{}).am$('verifyCharset',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('charset','sys::Str',false)]),{}).am$('testBufHandle',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('verifySkipBom',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('bytes','sys::Int[]',false),new sys.Param('charset','sys::Charset',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxIO");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;util 1.0;web 1.0;axon 3.1.11;folio 3.1.11;ftp 3.1.11;haystack 3.1.11;def 3.1.11;hx 3.1.11;hxUtil 3.1.11");
m.set("pod.summary", "I/O function library");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:27-05:00 New_York");
m.set("build.tsKey", "241210143127");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "false");
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
  IOLib,
  IOUtil,
  IOHandle,
  DirItem,
  IOFuncs,
  IOTest,
};
