// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;


class FloatArray extends sys.Obj {


  constructor(arr)
  {
    super();
    this.#arr = arr;
  }

  #arr;

  typeof() { return FloatArray.type$; }

  static makeF4(size) { return new FloatArray(new Float32Array(size)); }

  static makeF8(size) { return new FloatArray(new Float64Array(size)); }


  size() { return this.#arr.length; }

  get(index) { return this.#arr[index]; }

  set(index, val) { this.#arr[index] = val; }

  copyFrom(that, thatRange = null, thisOffset = 0)
  {
    this.#checkKind(that);
    let start = 0, end = 0;
    const thatSize = that.size();
    if (thatRange == null) { start = 0; end = thatSize; }
    else { start = thatRange.__start(thatSize); end = thatRange.__end(thatSize) + 1; }
    const slice = that.#arr.slice(start, end);
    this.#arr.set(slice, thisOffset);
    return this;
  }

  fill(val, range = null)
  {
    let start = 0, end = 0;
    const size = this.size();
    if (range == null) { start = 0; end = size - 1; }
    else { start = range.__start(size); end = range.__end(size); }
    for (let i=start; i<=end; ++i) { this.#arr[i] = val; }
    return this;
  }

  sort(range = null)
  {
    if (range == null) { this.#arr.sort(); }
    else
    {
      const size  = this.size();
      const start = range.__start(size);
      const end   = range.__end(size) + 1;

      const sortedPart = this.#arr.slice(start, end).sort();
      this.#arr.set(sortedPart, start);
    }
    return this;
  }

  #kind() { return this.#arr.constructor.name; }

  #checkKind(that)
  {
    if (this.#kind() != that.#kind())
      throw sys.ArgErr.make(`Mismatched arrays: ${this.#kind()} != ${that.#kind()}`);
  }
}

class Console extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Console.type$; }

  static cur() {
    return NativeConsole.curNative();
  }

  static wrap(out) {
    return OutStreamConsole.make(out);
  }

  static make() {
    const $self = new Console();
    Console.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}



class NativeConsole extends Console {

  static curNative() { return NativeConsole.#curNative; }

  static #curNative = new NativeConsole();

  constructor() { super(); }

  typeof() { return NativeConsole.type$; }

  width() { return null; }

  height() { return null; }

  debug(msg, err=null)
  {
    console.debug(msg);
    if (err) console.debug(err.traceToStr());
    return this;
  }

  info(msg, err=null)
  {
    console.info(msg);
    if (err) console.info(err.traceToStr());
    return this;
  }

  warn(msg, err=null)
  {
    console.warn(msg);
    if (err) console.warn(err.traceToStr());
    return this;
  }

  err(msg, err=null)
  {
    console.error(msg);
    if (err) console.error(err.traceToStr());
    return this;
  }

  table(obj)
  {
    var grid = []
    var t = ConsoleTable.make(obj);
    for (var r=0; r<t.rows().size(); ++r)
    {
      var row = t.rows().get(r);
      var obj = {};
      for (var c=0; c<t.headers().size(); ++c)
      {
        var key = t.headers().get(c);
        var val = row.get(c);
        obj[key] = val;
      }
      grid.push(obj);
    }
    console.table(grid)
    return this;
  }

  group(msg, collapsed)
  {
    if (!collapsed)
      console.group(msg)
    else
      console.groupCollapsed(msg);
    return this;
  }

  groupEnd()
  {
    console.groupEnd();
    return this;
  }

  prompt(msg)
  {
    return null; // unsupported
  }

  promptPassword(msg)
  {
    return null; // unsupported
  }
}


class OutStreamConsole extends Console {
  constructor() {
    super();
    const this$ = this;
    this.#indent = concurrent.AtomicInt.make();
    return;
  }

  typeof() { return OutStreamConsole.type$; }

  #outRef = null;

  outRef() { return this.#outRef; }

  __outRef(it) { if (it === undefined) return this.#outRef; else this.#outRef = it; }

  #indent = null;

  indent() { return this.#indent; }

  __indent(it) { if (it === undefined) return this.#indent; else this.#indent = it; }

  static make(out) {
    const $self = new OutStreamConsole();
    OutStreamConsole.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    Console.make$($self);
    ;
    $self.#outRef = sys.Unsafe.make(out);
    return;
  }

  width() {
    return null;
  }

  height() {
    return null;
  }

  debug(msg,err) {
    if (err === undefined) err = null;
    return this.log("DEBUG", sys.ObjUtil.coerce(msg, sys.Str.type$), err);
  }

  info(msg,err) {
    if (err === undefined) err = null;
    return this.log(null, sys.ObjUtil.coerce(msg, sys.Str.type$), err);
  }

  warn(msg,err) {
    if (err === undefined) err = null;
    return this.log("WARN", sys.ObjUtil.coerce(msg, sys.Str.type$), err);
  }

  err(msg,err) {
    if (err === undefined) err = null;
    return this.log("ERR", sys.ObjUtil.coerce(msg, sys.Str.type$), err);
  }

  table(obj) {
    ConsoleTable.make(obj).dump(this);
    return this;
  }

  clear() {
    return this;
  }

  group(msg,collapsed) {
    if (collapsed === undefined) collapsed = false;
    this.info(msg);
    this.#indent.increment();
    return this;
  }

  groupEnd() {
    this.#indent.decrement();
    return this;
  }

  prompt(msg) {
    if (msg === undefined) msg = "";
    throw sys.UnsupportedErr.make();
  }

  promptPassword(msg) {
    if (msg === undefined) msg = "";
    throw sys.UnsupportedErr.make();
  }

  log(level,msg,err) {
    if (err === undefined) err = null;
    const this$ = this;
    this.out().print(sys.Str.spaces(sys.Int.mult(this.#indent.val(), 2)));
    if (level != null) {
      this.out().print(level).print(": ");
    }
    ;
    this.out().printLine(msg);
    if (err != null) {
      sys.Str.splitLines(err.traceToStr()).each((line) => {
        this$.out().print(level).printLine(line);
        return;
      });
    }
    ;
    return this;
  }

  out() {
    return sys.ObjUtil.coerce(this.#outRef.val(), sys.OutStream.type$);
  }

}

class ConsoleTable extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#headers = sys.List.make(sys.Str.type$);
    this.#rows = sys.List.make(sys.Type.find("sys::Str[]"));
    return;
  }

  typeof() { return ConsoleTable.type$; }

  #headers = null;

  headers(it) {
    if (it === undefined) {
      return this.#headers;
    }
    else {
      this.#headers = it;
      return;
    }
  }

  #rows = null;

  rows(it) {
    if (it === undefined) {
      return this.#rows;
    }
    else {
      this.#rows = it;
      return;
    }
  }

  #widths$Store = undefined;

  // private field reflection only
  __widths$Store(it) { if (it === undefined) return this.#widths$Store; else this.#widths$Store = it; }

  static make(x) {
    const $self = new ConsoleTable();
    ConsoleTable.make$($self,x);
    return $self;
  }

  static make$($self,x) {
    const this$ = $self;
    ;
    let list = sys.ObjUtil.as(x, sys.Type.find("sys::List"));
    if ((list != null && sys.ObjUtil.is(list.first(), sys.Type.find("sys::List")))) {
      $self.#headers = sys.ObjUtil.coerce(list.get(0), sys.Type.find("sys::Str[]"));
      list.eachRange(sys.Range.make(1, -1), sys.ObjUtil.coerce((listItem) => {
        this$.#rows.add(sys.ObjUtil.coerce(listItem.map((z) => {
          return ConsoleTable.str(z);
        }, sys.Str.type$), sys.Type.find("sys::Str[]")));
        return;
      }, sys.Type.find("|sys::V,sys::Int->sys::Void|")));
      return;
    }
    ;
    if (list != null) {
      let maps = sys.List.make(sys.Type.find("[sys::Str:sys::Str]"));
      list.each((item) => {
        maps.add(ConsoleTable.map(item));
        return;
      });
      let cols = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
        it.ordered(true);
        return;
      }), sys.Type.find("[sys::Str:sys::Str]"));
      maps.each((map) => {
        map.each((v,k) => {
          cols.set(k, k);
          return;
        });
        return;
      });
      $self.#headers = cols.vals();
      maps.each((map) => {
        let row = sys.List.make(sys.Str.type$);
        row.capacity(this$.#headers.size());
        cols.each((k) => {
          row.add(sys.ObjUtil.coerce(((this$) => { let $_u0 = map.get(k); if ($_u0 != null) return $_u0; return ""; })(this$), sys.Str.type$));
          return;
        });
        this$.#rows.add(row);
        return;
      });
      return;
    }
    ;
    $self.#headers = sys.List.make(sys.Str.type$, ["val"]);
    $self.#rows = sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, [ConsoleTable.str(x)])]);
    return;
  }

  widths() {
    if (this.#widths$Store === undefined) {
      this.#widths$Store = this.widths$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#widths$Store, sys.Type.find("sys::Int[]"));
  }

  dump(c) {
    const this$ = this;
    c.info(this.row(this.#headers));
    c.info(this.underlines());
    this.#rows.each((x) => {
      c.info(this$.row(x));
      return;
    });
    return;
  }

  row(cells) {
    const this$ = this;
    let s = sys.StrBuf.make();
    cells.each((cell,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        s.add("  ");
      }
      ;
      s.add(cell);
      s.add(sys.Str.spaces(sys.Int.minus(this$.widths().get(i), sys.Str.size(cell))));
      return;
    });
    return s.toStr();
  }

  underlines() {
    const this$ = this;
    let s = sys.StrBuf.make();
    this.#headers.each((h,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        s.add("  ");
      }
      ;
      sys.Int.times(this$.widths().get(i), (it) => {
        s.addChar(45);
        return;
      });
      return;
    });
    return s.toStr();
  }

  static map(x) {
    const this$ = this;
    if (x == null) {
      return sys.Map.__fromLiteral(["val"], ["null"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    }
    ;
    let m = sys.ObjUtil.typeof(x).method("each", false);
    if ((m == null || sys.ObjUtil.is(x, sys.Str.type$))) {
      return sys.Map.__fromLiteral(["val"], [ConsoleTable.str(x)], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    }
    ;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"));
    let f = (v,k) => {
      acc.set(ConsoleTable.str(k), ConsoleTable.str(v));
      return;
    };
    m.callOn(x, sys.List.make(sys.Type.find("|sys::Obj?,sys::Obj?->sys::Void|"), [f]));
    return acc;
  }

  static str(x) {
    if (x == null) {
      return "";
    }
    ;
    let s = sys.ObjUtil.toStr(x);
    if (sys.Str.contains(s, "\n")) {
      (s = sys.ObjUtil.coerce(sys.Str.splitLines(s).first(), sys.Str.type$));
    }
    ;
    if (sys.ObjUtil.compareGT(sys.Str.size(s), 80)) {
      (s = sys.Str.plus(sys.Str.getRange(s, sys.Range.make(0, 80)), ".."));
    }
    ;
    return s;
  }

  widths$Once() {
    const this$ = this;
    let widths = sys.List.make(sys.Int.type$);
    widths.capacity(this.#headers.size());
    this.#headers.each((h,c) => {
      let w = sys.Str.size(h);
      this$.#rows.each((row) => {
        (w = sys.Int.max(w, sys.Str.size(row.get(c))));
        return;
      });
      widths.add(sys.ObjUtil.coerce(w, sys.Int.type$.toNullable()));
      return;
    });
    return widths;
  }

}

class CsvInStream extends sys.InStream {
  constructor() {
    super();
    const this$ = this;
    this.#delimiter = 44;
    this.#trim = true;
    this.#rowWidth = 10;
    return;
  }

  typeof() { return CsvInStream.type$; }

  #delimiter = 0;

  delimiter(it) {
    if (it === undefined) {
      return this.#delimiter;
    }
    else {
      this.#delimiter = it;
      return;
    }
  }

  #trim = false;

  trim(it) {
    if (it === undefined) {
      return this.#trim;
    }
    else {
      this.#trim = it;
      return;
    }
  }

  #rowWidth = 0;

  // private field reflection only
  __rowWidth(it) { if (it === undefined) return this.#rowWidth; else this.#rowWidth = it; }

  #line = null;

  // private field reflection only
  __line(it) { if (it === undefined) return this.#line; else this.#line = it; }

  #pos = 0;

  // private field reflection only
  __pos(it) { if (it === undefined) return this.#pos; else this.#pos = it; }

  static make(in$) {
    const $self = new CsvInStream();
    CsvInStream.make$($self,in$);
    return $self;
  }

  static make$($self,in$) {
    sys.InStream.make$($self, in$);
    ;
    return;
  }

  readAllRows() {
    const this$ = this;
    let rows = sys.List.make(sys.Type.find("sys::Str[]"));
    this.eachRow((row) => {
      rows.add(row);
      return;
    });
    return rows;
  }

  eachRow(f) {
    try {
      while (true) {
        let row = this.readRow();
        if (row == null) {
          break;
        }
        ;
        sys.Func.call(f, sys.ObjUtil.coerce(row, sys.Type.find("sys::Str[]")));
      }
      ;
    }
    finally {
      this.close();
    }
    ;
    return;
  }

  readRow() {
    this.#line = this.readLine(null);
    if (this.#line == null) {
      return null;
    }
    ;
    let cells = sys.List.make(sys.Str.type$);
    cells.capacity(this.#rowWidth);
    this.#pos = 0;
    while (sys.ObjUtil.compareLT(this.#pos, sys.Str.size(this.#line))) {
      cells.add(this.parseCell());
    }
    ;
    if ((!sys.Str.isEmpty(this.#line) && sys.ObjUtil.equals(sys.Str.get(this.#line, -1), this.#delimiter))) {
      cells.add("");
    }
    ;
    this.#rowWidth = cells.size();
    return cells;
  }

  parseCell() {
    if (this.#trim) {
      while ((sys.ObjUtil.compareLT(this.#pos, sys.Str.size(this.#line)) && sys.Int.isSpace(sys.Str.get(this.#line, this.#pos)))) {
        ((this$) => { let $_u1 = this$.#pos;this$.#pos = sys.Int.increment(this$.#pos); return $_u1; })(this);
      }
      ;
      if (sys.ObjUtil.compareGE(this.#pos, sys.Str.size(this.#line))) {
        return "";
      }
      ;
    }
    ;
    if (sys.ObjUtil.compareNE(sys.Str.get(this.#line, this.#pos), 34)) {
      return this.parseNonQuotedCell();
    }
    else {
      return this.parseQuotedCell();
    }
    ;
  }

  parseNonQuotedCell() {
    let start = this.#pos;
    while ((sys.ObjUtil.compareLT(this.#pos, sys.Str.size(this.#line)) && sys.ObjUtil.compareNE(sys.Str.get(this.#line, this.#pos), this.#delimiter))) {
      this.#pos = sys.Int.increment(this.#pos);
    }
    ;
    let end = sys.Int.minus(this.#pos, 1);
    if (this.#trim) {
      while ((sys.ObjUtil.compareGT(end, start) && sys.Int.isSpace(sys.Str.get(this.#line, end)))) {
        end = sys.Int.decrement(end);
      }
      ;
    }
    ;
    this.#pos = sys.Int.increment(this.#pos);
    if (sys.ObjUtil.compareLT(end, start)) {
      return "";
    }
    ;
    return sys.Str.getRange(this.#line, sys.Range.make(start, end));
  }

  parseQuotedCell() {
    let s = sys.StrBuf.make();
    this.#pos = sys.Int.plus(this.#pos, 1);
    while (true) {
      let ch = sys.Str.getSafe(this.#line, ((this$) => { let $_u2 = this$.#pos;this$.#pos = sys.Int.increment(this$.#pos); return $_u2; })(this), 0);
      while (sys.ObjUtil.equals(ch, 0)) {
        this.#pos = 0;
        this.#line = this.readLine();
        if (this.#line == null) {
          throw sys.IOErr.make("Unexpected end of file in multi-line quoted cell");
        }
        ;
        s.addChar(10);
        (ch = sys.Str.getSafe(this.#line, ((this$) => { let $_u3 = this$.#pos;this$.#pos = sys.Int.increment(this$.#pos); return $_u3; })(this), 0));
      }
      ;
      if (sys.ObjUtil.compareNE(ch, 34)) {
        s.addChar(ch);
        continue;
      }
      ;
      (ch = sys.Str.getSafe(this.#line, ((this$) => { let $_u4 = this$.#pos;this$.#pos = sys.Int.increment(this$.#pos); return $_u4; })(this)));
      if (sys.ObjUtil.equals(ch, 34)) {
        s.addChar(ch);
        continue;
      }
      ;
      while (sys.ObjUtil.compareNE(ch, this.#delimiter)) {
        (ch = sys.Str.getSafe(this.#line, ((this$) => { let $_u5 = this$.#pos;this$.#pos = sys.Int.increment(this$.#pos); return $_u5; })(this), this.#delimiter));
      }
      ;
      break;
    }
    ;
    return s.toStr();
  }

}

class Random extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Random.type$; }

  static makeSecure() {
    return SecureRandom.make();
  }

  static makeSeeded(seed) {
    if (seed === undefined) seed = sys.DateTime.nowTicks();
    return SeededRandom.make(seed);
  }

  static makeImpl() {
    const $self = new Random();
    Random.makeImpl$($self);
    return $self;
  }

  static makeImpl$($self) {
    return;
  }

}

class SeededRandom extends Random {
  constructor() {
    super();
    this.peer = new SeededRandomPeer(this);
    const this$ = this;
  }

  typeof() { return SeededRandom.type$; }

  #seed = 0;

  seed() { return this.#seed; }

  __seed(it) { if (it === undefined) return this.#seed; else this.#seed = it; }

  static make(seed) {
    const $self = new SeededRandom();
    SeededRandom.make$($self,seed);
    return $self;
  }

  static make$($self,seed) {
    Random.makeImpl$($self);
    $self.#seed = seed;
    $self.init();
    return;
  }

  init() {
    return this.peer.init(this);
  }

  next(r) {
    if (r === undefined) r = null;
    return this.peer.next(this,r);
  }

  nextBool() {
    return this.peer.nextBool(this);
  }

  nextFloat() {
    return this.peer.nextFloat(this);
  }

  nextBuf(size) {
    return this.peer.nextBuf(this,size);
  }

}



class SecureRandom extends Random {
  constructor() {
    super();
    this.peer = new SecureRandomPeer(this);
    const this$ = this;
  }

  typeof() { return SecureRandom.type$; }

  static make() {
    const $self = new SecureRandom();
    SecureRandom.make$($self);
    return $self;
  }

  static make$($self) {
    Random.makeImpl$($self);
    $self.init();
    return;
  }

  init() {
    return this.peer.init(this);
  }

  next(r) {
    if (r === undefined) r = null;
    return this.peer.next(this,r);
  }

  nextBool() {
    return this.peer.nextBool(this);
  }

  nextFloat() {
    return this.peer.nextFloat(this);
  }

  nextBuf(size) {
    return this.peer.nextBuf(this,size);
  }

}





class LockFile extends sys.Obj
{


  constructor(file)
  {
    super();
    this.#file = file;
  }

  #file;

  typeof() { return LockFile.type$; }

  static make(file) { return new LockFile(file); }


  file() { return this.#file; }

  lock() { return this; }

  unlock() { return this; }
}


class CannotAcquireLockFileErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CannotAcquireLockFileErr.type$; }

  static make(msg,cause) {
    const $self = new CannotAcquireLockFileErr();
    CannotAcquireLockFileErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class TestRunner extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#out = sys.Env.cur().out();
    this.#failures = sys.List.make(sys.Str.type$);
    this.#startTicks = sys.Duration.now();
    return;
  }

  typeof() { return TestRunner.type$; }

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

  #isVerbose = false;

  isVerbose(it) {
    if (it === undefined) {
      return this.#isVerbose;
    }
    else {
      this.#isVerbose = it;
      return;
    }
  }

  #failures = null;

  // private field reflection only
  __failures(it) { if (it === undefined) return this.#failures; else this.#failures = it; }

  #startTicks = null;

  // private field reflection only
  __startTicks(it) { if (it === undefined) return this.#startTicks; else this.#startTicks = it; }

  #numTypes = 0;

  // private field reflection only
  __numTypes(it) { if (it === undefined) return this.#numTypes; else this.#numTypes = it; }

  #numMethods = 0;

  // private field reflection only
  __numMethods(it) { if (it === undefined) return this.#numMethods; else this.#numMethods = it; }

  #numVerifies = 0;

  // private field reflection only
  __numVerifies(it) { if (it === undefined) return this.#numVerifies; else this.#numVerifies = it; }

  static main(args) {
    let targets = sys.List.make(sys.Str.type$);
    let runner = TestRunner.make();
    let isAll = false;
    let isJs = false;
    let isEs = false;
    for (let i = 0; sys.ObjUtil.compareLT(i, args.size()); i = sys.Int.increment(i)) {
      let arg = args.get(i);
      if ((sys.ObjUtil.equals(arg, "-help") || sys.ObjUtil.equals(arg, "-h") || sys.ObjUtil.equals(arg, "-?"))) {
        runner.printUsage();
        return -1;
      }
      ;
      if (sys.ObjUtil.equals(arg, "-version")) {
        runner.printVersion();
        return -1;
      }
      ;
      if (sys.ObjUtil.equals(arg, "-v")) {
        runner.#isVerbose = true;
        continue;
      }
      ;
      if (sys.ObjUtil.equals(arg, "-all")) {
        (isAll = true);
        continue;
      }
      ;
      if (sys.ObjUtil.equals(arg, "-es")) {
        (isEs = true);
        continue;
      }
      ;
      if (sys.ObjUtil.equals(arg, "-js")) {
        (isJs = true);
        continue;
      }
      ;
      if (sys.Str.startsWith(arg, "-")) {
        sys.ObjUtil.echo(sys.Str.plus("WARNING: Unknown option: ", arg));
        continue;
      }
      ;
      targets.add(arg);
    }
    ;
    if (isEs) {
      return runner.runEs(targets);
    }
    ;
    if (isJs) {
      return runner.runJs(targets);
    }
    ;
    if (isAll) {
      runner.runAll();
    }
    else {
      if (targets.isEmpty()) {
        runner.printUsage();
        return -1;
      }
      ;
      runner.runTargets(targets);
    }
    ;
    runner.reportSummary();
    return runner.numFailures();
  }

  printUsage() {
    this.#out.printLine();
    this.#out.printLine("Fantom Test Runner\nUsage:\n  fant [options] <target>*\nTarget:\n  <pod>\n  <pod>::<Type>\n  <pod>::<Type>.<method>\nOptions:\n  -help, -h, -?  print usage help\n  -version       print version\n  -v             verbose mode\n  -all           test all pods\n  -es            test new ECMA JavaScript environment\n  -js            test legacy JavaScript environment\n");
    return;
  }

  printVersion() {
    const this$ = this;
    this.#out.printLine();
    this.#out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Fantom Test Runner\nCopyright (c) 2006-", sys.ObjUtil.coerce(sys.Date.today().year(), sys.Obj.type$.toNullable())), ", Brian Frank and Andy Frank\nLicensed under the Academic Free License version 3.0\n\nfan.version:  "), sys.ObjUtil.typeof(this).pod().version()), "\nfan.runtime:  "), sys.Env.cur().runtime()), "\nfan.platform: "), sys.Env.cur().platform()), "\n"));
    this.#out.printLine("Env path:");
    sys.Env.cur().path().each((f) => {
      this$.#out.printLine(sys.Str.plus("  ", f.osPath()));
      return;
    });
    this.#out.printLine();
    return;
  }

  runEs(targets) {
    let args = sys.List.make(sys.Str.type$).add("test").addAll(targets);
    let type = sys.Type.find("nodeJs::Main");
    return sys.ObjUtil.coerce(sys.ObjUtil.trap(type.make(),"main", sys.List.make(sys.Obj.type$.toNullable(), [args])), sys.Int.type$);
  }

  runJs(targets) {
    let args = sys.List.make(sys.Str.type$).add("-test").addAll(targets);
    let type = sys.Type.find("compilerJs::NodeRunner");
    return sys.ObjUtil.coerce(sys.ObjUtil.trap(type.make(),"main", sys.List.make(sys.Obj.type$.toNullable(), [args])), sys.Int.type$);
  }

  runTargets(targets) {
    const this$ = this;
    targets.each((target,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        this$.#out.printLine();
      }
      ;
      this$.runTarget(target);
      return;
    });
    return this;
  }

  runTarget(target) {
    let colons = sys.Str.index(target, "::");
    if (colons == null) {
      return this.runPod(sys.ObjUtil.coerce(sys.Pod.find(target), sys.Pod.type$));
    }
    ;
    let podName = sys.Str.getRange(target, sys.Range.make(0, sys.ObjUtil.coerce(colons, sys.Int.type$), true));
    let pod = sys.Pod.find(podName);
    let rest = sys.Str.getRange(target, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colons, sys.Int.type$), 2), -1));
    let dot = sys.Str.index(rest, ".");
    if (dot == null) {
      return this.runType(sys.ObjUtil.coerce(pod.type(rest), sys.Type.type$));
    }
    ;
    let typeName = sys.Str.getRange(rest, sys.Range.make(0, sys.ObjUtil.coerce(dot, sys.Int.type$), true));
    let methodName = sys.Str.getRange(rest, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(dot, sys.Int.type$), 1), -1));
    let type = pod.type(typeName);
    let method = type.method(methodName);
    return this.runMethod(sys.ObjUtil.coerce(type, sys.Type.type$), sys.ObjUtil.coerce(method, sys.Method.type$));
  }

  runAll() {
    const this$ = this;
    sys.Pod.list().each((pod) => {
      this$.doRunPod(pod, true);
      return;
    });
    return this;
  }

  runPod(pod) {
    return this.doRunPod(pod, false);
  }

  doRunPod(pod,blankLine) {
    const this$ = this;
    let types = sys.List.make(sys.Type.type$);
    pod.types().dup().sort().each((type) => {
      if ((type.fits(sys.Test.type$) && !type.isAbstract())) {
        types.add(type);
      }
      ;
      return;
    });
    if (types.isEmpty()) {
      return this;
    }
    ;
    if (blankLine) {
      this.#out.printLine();
    }
    ;
    types.each((type) => {
      this$.runType(type);
      return;
    });
    return this;
  }

  runType(type) {
    const this$ = this;
    ((this$) => { let $_u6 = this$.#numTypes;this$.#numTypes = sys.Int.increment(this$.#numTypes); return $_u6; })(this);
    type.methods().each((method) => {
      if ((sys.Str.startsWith(method.name(), "test") && !method.isAbstract())) {
        this$.runMethod(type, method);
      }
      ;
      return;
    });
    return this;
  }

  runMethod(type,method) {
    this.reportStart(type, method);
    let test = null;
    let verifies = 0;
    try {
      (test = sys.ObjUtil.coerce(type.make(), sys.Test.type$.toNullable()));
      sys.ObjUtil.trap(test,"curTestMethod", sys.List.make(sys.Obj.type$.toNullable(), [method]));
      sys.ObjUtil.trap(test,"verbose", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(this.#isVerbose, sys.Bool.type$.toNullable())]));
      this.onSetup(sys.ObjUtil.coerce(test, sys.Test.type$));
      method.callOn(test, sys.List.make(sys.Obj.type$.toNullable()));
      (verifies = sys.ObjUtil.coerce(sys.ObjUtil.trap(test,"verifyCount", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$));
      this.reportSuccess(type, method, verifies);
    }
    catch ($_u7) {
      $_u7 = sys.Err.make($_u7);
      if ($_u7 instanceof sys.Err) {
        let e = $_u7;
        ;
        if (test != null) {
          (verifies = sys.ObjUtil.coerce(sys.ObjUtil.trap(test,"verifyCount", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$));
        }
        ;
        this.#failures.add(this.qname(type, method));
        this.reportFailure(type, method, e);
      }
      else {
        throw $_u7;
      }
    }
    finally {
      try {
        if (test != null) {
          this.onTeardown(sys.ObjUtil.coerce(test, sys.Test.type$));
        }
        ;
      }
      catch ($_u8) {
        $_u8 = sys.Err.make($_u8);
        if ($_u8 instanceof sys.Err) {
          let e = $_u8;
          ;
          e.trace();
        }
        else {
          throw $_u8;
        }
      }
      ;
    }
    ;
    this.#numMethods = sys.Int.plus(this.#numMethods, 1);
    this.#numVerifies = sys.Int.plus(this.#numVerifies, verifies);
    return this;
  }

  onSetup(test) {
    test.setup();
    return;
  }

  onTeardown(test) {
    test.teardown();
    return;
  }

  reportStart(type,method) {
    this.#out.printLine(sys.Str.plus("-- Run: ", this.qname(type, method)));
    return;
  }

  reportSuccess(type,method,verifies) {
    this.#out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("   Pass: ", this.qname(type, method)), " ["), sys.ObjUtil.coerce(verifies, sys.Obj.type$.toNullable())), "]"));
    return;
  }

  reportFailure(type,method,err) {
    this.#out.printLine();
    this.#out.printLine("TEST FAILED");
    err.trace(this.#out);
    return;
  }

  reportSummary() {
    const this$ = this;
    let elapsed = sys.Duration.now().minus(this.#startTicks);
    let elapsedStr = ((this$) => { if (sys.ObjUtil.compareGT(elapsed, sys.Duration.fromStr("10sec"))) return elapsed.toLocale(); return sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(elapsed.toMillis(), sys.Obj.type$.toNullable())), "ms"); })(this);
    this.#out.printLine();
    this.#out.printLine(sys.Str.plus("Time: ", elapsedStr));
    this.#out.printLine();
    let summary = "All tests passed!";
    if (!this.#failures.isEmpty()) {
      (summary = sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this.#failures.size(), sys.Obj.type$.toNullable())), " FAILURES"));
      this.#out.printLine("Failed:");
      this.#failures.each((qname) => {
        this$.#out.printLine(sys.Str.plus("  ", qname));
        return;
      });
      this.#out.printLine();
    }
    ;
    this.#out.printLine("***");
    this.#out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("*** ", summary), " ["), sys.ObjUtil.coerce(this.#numTypes, sys.Obj.type$.toNullable())), " types, "), sys.ObjUtil.coerce(this.#numMethods, sys.Obj.type$.toNullable())), " methods, "), sys.ObjUtil.coerce(this.#numVerifies, sys.Obj.type$.toNullable())), " verifies]"));
    this.#out.printLine("***");
    return;
  }

  qname(type,method) {
    return sys.Str.plus(sys.Str.plus(type.qname(), "."), method.name());
  }

  numFailures() {
    return this.#failures.size();
  }

  static make() {
    const $self = new TestRunner();
    TestRunner.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class Macro extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Macro.type$; }

  #pattern = null;

  pattern() { return this.#pattern; }

  __pattern(it) { if (it === undefined) return this.#pattern; else this.#pattern = it; }

  static #norm = undefined;

  static norm() {
    if (Macro.#norm === undefined) {
      Macro.static$init();
      if (Macro.#norm === undefined) Macro.#norm = 0;
    }
    return Macro.#norm;
  }

  static #inMacro = undefined;

  static inMacro() {
    if (Macro.#inMacro === undefined) {
      Macro.static$init();
      if (Macro.#inMacro === undefined) Macro.#inMacro = 0;
    }
    return Macro.#inMacro;
  }

  static make(pattern) {
    const $self = new Macro();
    Macro.make$($self,pattern);
    return $self;
  }

  static make$($self,pattern) {
    $self.#pattern = pattern;
    return;
  }

  apply(resolve) {
    let resBuf = sys.StrBuf.make();
    let keyBuf = sys.StrBuf.make();
    let pos = 0;
    let start = -1;
    let size = sys.Str.size(this.#pattern);
    let mode = Macro.norm();
    while (true) {
      if (sys.ObjUtil.equals(mode, Macro.norm())) {
        if (sys.ObjUtil.equals(pos, size)) {
          break;
        }
        ;
        if ((sys.ObjUtil.equals(sys.Str.get(this.#pattern, pos), 123) && sys.ObjUtil.equals(sys.Str.getSafe(this.#pattern, sys.Int.plus(pos, 1)), 123))) {
          (mode = Macro.inMacro());
          (start = pos);
          pos = sys.Int.plus(pos, 2);
          keyBuf.clear();
        }
        else {
          resBuf.addChar(sys.Str.get(this.#pattern, ((this$) => { let $_u10 = pos;pos = sys.Int.increment(pos); return $_u10; })(this)));
        }
        ;
      }
      else {
        if (sys.ObjUtil.equals(mode, Macro.inMacro())) {
          if (sys.ObjUtil.equals(pos, size)) {
            throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unterminated macro at index ", sys.ObjUtil.coerce(start, sys.Obj.type$.toNullable())), ": "), this.#pattern));
          }
          ;
          if ((sys.ObjUtil.equals(sys.Str.get(this.#pattern, pos), 125) && sys.ObjUtil.equals(sys.Str.getSafe(this.#pattern, sys.Int.plus(pos, 1)), 125))) {
            (mode = Macro.norm());
            pos = sys.Int.plus(pos, 2);
            resBuf.add(sys.Func.call(resolve, keyBuf.toStr()));
          }
          else {
            keyBuf.addChar(sys.Str.get(this.#pattern, ((this$) => { let $_u11 = pos;pos = sys.Int.increment(pos); return $_u11; })(this)));
          }
          ;
        }
        else {
          throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Illegal State: mode [", sys.ObjUtil.coerce(mode, sys.Obj.type$.toNullable())), "] pos ["), sys.ObjUtil.coerce(pos, sys.Obj.type$.toNullable())), "]: "), this.#pattern));
        }
        ;
      }
      ;
    }
    ;
    return resBuf.toStr();
  }

  keys() {
    const this$ = this;
    let acc = sys.List.make(sys.Str.type$);
    this.apply((key) => {
      acc.add(key);
      return key;
    });
    return acc;
  }

  static static$init() {
    Macro.#norm = 0;
    Macro.#inMacro = 1;
    return;
  }

}

class AbstractMain extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#helpOpt = false;
    return;
  }

  typeof() { return AbstractMain.type$; }

  #helpOpt = false;

  helpOpt(it) {
    if (it === undefined) {
      return this.#helpOpt;
    }
    else {
      this.#helpOpt = it;
      return;
    }
  }

  appName() {
    let t = sys.Type.of(this);
    if (sys.ObjUtil.equals(t.pod().meta().get("pod.isScript"), "true")) {
      return sys.ObjUtil.coerce(sys.ObjUtil.trap(sys.ObjUtil.trap(sys.ObjUtil.trap(t,"sourceFile", sys.List.make(sys.Obj.type$.toNullable(), [])),"toUri", sys.List.make(sys.Obj.type$.toNullable(), [])),"basename", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
    }
    ;
    if (sys.ObjUtil.equals(t.name(), "Main")) {
      return t.pod().name();
    }
    ;
    return t.name();
  }

  log() {
    return sys.Log.get(this.appName());
  }

  homeDir() {
    let t = sys.Type.of(this);
    if (sys.ObjUtil.equals(t.pod().meta().get("pod.isScript"), "true")) {
      return sys.ObjUtil.coerce(sys.File.make(sys.ObjUtil.coerce(sys.ObjUtil.trap(sys.ObjUtil.trap(t,"sourceFile", sys.List.make(sys.Obj.type$.toNullable(), [])),"toUri", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Uri.type$)).parent(), sys.File.type$);
    }
    else {
      return sys.Env.cur().workDir().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("etc/", t.pod().name()), "/")));
    }
    ;
  }

  argFields() {
    const this$ = this;
    return sys.Type.of(this).fields().findAll((f) => {
      return f.hasFacet(Arg.type$);
    });
  }

  optFields() {
    const this$ = this;
    return sys.Type.of(this).fields().findAll((f) => {
      return f.hasFacet(Opt.type$);
    });
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
          this.log().warn(sys.Str.plus("Unexpected arg: ", tok));
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
    return false;
  }

  parseOpt(opts,tok,next) {
    let n = sys.Str.getRange(tok, sys.Range.make(1, -1));
    for (let i = 0; sys.ObjUtil.compareLT(i, opts.size()); i = sys.Int.increment(i)) {
      let field = opts.get(i);
      let facet = sys.ObjUtil.coerce(field.facet(Opt.type$), Opt.type$);
      let aliases = facet;
      if ((sys.ObjUtil.compareNE(this.optName(field), n) && !facet.aliases().contains(n))) {
        continue;
      }
      ;
      if (sys.ObjUtil.equals(field.type(), sys.Bool.type$)) {
        field.set(this, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
        return false;
      }
      ;
      if ((next == null || sys.Str.startsWith(next, "-"))) {
        this.log().err(sys.Str.plus("Missing value for -", n));
        return false;
      }
      ;
      try {
        field.set(this, this.parseVal(field.type(), sys.ObjUtil.coerce(next, sys.Str.type$)));
      }
      catch ($_u13) {
        $_u13 = sys.Err.make($_u13);
        if ($_u13 instanceof sys.Err) {
          let e = $_u13;
          ;
          this.log().err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot parse -", n), " as "), field.type().name()), ": "), next));
        }
        else {
          throw $_u13;
        }
      }
      ;
      return true;
    }
    ;
    this.log().warn(sys.Str.plus("Unknown option -", n));
    return false;
  }

  parseArg(field,tok) {
    let isList = field.type().fits(sys.Type.find("sys::List"));
    try {
      if (!isList) {
        field.set(this, this.parseVal(field.type(), tok));
        return true;
      }
      ;
      let of$ = field.type().params().get("V");
      let val = this.parseVal(sys.ObjUtil.coerce(of$, sys.Type.type$), tok);
      let list = sys.ObjUtil.as(field.get(this), sys.Type.find("sys::Obj?[]"));
      if (list == null) {
        field.set(this, (list = sys.ObjUtil.coerce(sys.List.make(sys.ObjUtil.coerce(of$, sys.Type.type$), 8), sys.Type.find("sys::Obj?[]?"))));
      }
      ;
      list.add(val);
    }
    catch ($_u14) {
      $_u14 = sys.Err.make($_u14);
      if ($_u14 instanceof sys.Err) {
        let e = $_u14;
        ;
        this.log().err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot parse argument as ", field.type().name()), ": "), tok));
      }
      else {
        throw $_u14;
      }
    }
    ;
    return !isList;
  }

  argName(f) {
    if (sys.Str.endsWith(f.name(), "Arg")) {
      return sys.Str.getRange(f.name(), sys.Range.make(0, -3, true));
    }
    ;
    return f.name();
  }

  optName(f) {
    if (sys.Str.endsWith(f.name(), "Opt")) {
      return sys.Str.getRange(f.name(), sys.Range.make(0, -3, true));
    }
    ;
    return f.name();
  }

  parseVal(of$,tok) {
    (of$ = of$.toNonNullable());
    if (sys.ObjUtil.equals(of$, sys.Str.type$)) {
      return tok;
    }
    ;
    if (sys.ObjUtil.equals(of$, sys.File.type$)) {
      if (sys.Str.contains(tok, "\\")) {
        return sys.File.os(tok).normalize();
      }
      else {
        return sys.File.make(sys.Str.toUri(tok), false);
      }
      ;
    }
    ;
    return of$.method("fromStr").call(tok);
  }

  usage(out) {
    if (out === undefined) out = sys.Env.cur().out();
    const this$ = this;
    let args = this.argFields();
    let opts = this.optFields().findAll((f) => {
      return !f.hasFacet(sys.NoDoc.type$);
    });
    let argRows = this.usagePad(sys.ObjUtil.coerce(args.map((f) => {
      return this$.usageArg(f);
    }, sys.Obj.type$.toNullable()), sys.Type.find("sys::Str[][]")));
    let optRows = this.usagePad(sys.ObjUtil.coerce(opts.map((f) => {
      return this$.usageOpt(f);
    }, sys.Obj.type$.toNullable()), sys.Type.find("sys::Str[][]")));
    let argSummary = args.join(" ", (field) => {
      let s = sys.Str.plus(sys.Str.plus("<", this$.argName(field)), ">");
      if (field.type().fits(sys.Type.find("sys::List"))) {
        s = sys.Str.plus(s, "*");
      }
      ;
      return s;
    });
    out.printLine("Usage:");
    out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", this.appName()), " [options] "), argSummary));
    this.usagePrint(out, "Arguments:", argRows);
    this.usagePrint(out, "Options:", optRows);
    return 1;
  }

  usageArg(field) {
    let name = this.argName(field);
    let help = sys.ObjUtil.as(sys.ObjUtil.trap(field.facet(Arg.type$),"help", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
    return sys.List.make(sys.Str.type$.toNullable(), [name, help]);
  }

  usageOpt(field) {
    let name = this.optName(field);
    let def = field.get(sys.Type.of(this).make());
    let help = sys.ObjUtil.as(sys.ObjUtil.trap(field.facet(Opt.type$),"help", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
    let aliases = sys.ObjUtil.coerce(sys.ObjUtil.trap(field.facet(Opt.type$),"aliases", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Type.find("sys::Str[]"));
    let col1 = sys.Str.plus("-", name);
    if (!aliases.isEmpty()) {
      col1 = sys.Str.plus(col1, sys.Str.plus(", -", aliases.join(", -")));
    }
    ;
    if (sys.ObjUtil.compareNE(def, false)) {
      col1 = sys.Str.plus(col1, sys.Str.plus(sys.Str.plus(" <", field.type().name()), ">"));
    }
    ;
    let col2 = help;
    if ((sys.ObjUtil.compareNE(def, false) && def != null && sys.ObjUtil.compareNE(def, ""))) {
      col2 = sys.Str.plus(col2, sys.Str.plus(sys.Str.plus(" (default ", def), ")"));
    }
    ;
    return sys.List.make(sys.Str.type$.toNullable(), [col1, col2]);
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

  static runtimeProps(acc) {
    if (acc === undefined) acc = null;
    const this$ = this;
    let env = sys.Env.cur();
    if (acc == null) {
      (acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), (it) => {
        it.ordered(true);
        return;
      }), sys.Type.find("[sys::Str:sys::Obj]")));
    }
    ;
    let addVar = (name) => {
      acc.setNotNull(name, env.vars().get(name));
      return;
    };
    sys.Func.call(addVar, "java.version");
    sys.Func.call(addVar, "java.vm.name");
    sys.Func.call(addVar, "java.vm.vendor");
    sys.Func.call(addVar, "java.vm.version");
    sys.Func.call(addVar, "java.home");
    sys.Func.call(addVar, "node.version");
    sys.Func.call(addVar, "node.path");
    acc.set("fan.version", sys.Pod.find("sys").version().toStr());
    acc.set("fan.platform", env.platform());
    acc.set("fan.home", sys.ObjUtil.coerce(env.homeDir().osPath(), sys.Obj.type$));
    if (sys.ObjUtil.compareGT(env.path().size(), 1)) {
      acc.set("fan.path", env.path().map((it) => {
        return it.osPath();
      }, sys.Obj.type$.toNullable()));
    }
    ;
    return sys.ObjUtil.coerce(acc, sys.Type.find("[sys::Str:sys::Obj]"));
  }

  static printProps(props,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    let out = ((this$) => { let $_u15 = sys.ObjUtil.as(((this$) => { let $_u16 = opts; if ($_u16 == null) return null; return opts.get("out"); })(this$), sys.OutStream.type$); if ($_u15 != null) return $_u15; return sys.Env.cur().out(); })(this);
    let indent = ((this$) => { let $_u17 = ((this$) => { let $_u18 = ((this$) => { let $_u19 = opts; if ($_u19 == null) return null; return opts.get("indent"); })(this$); if ($_u18 == null) return null; return sys.ObjUtil.toStr(((this$) => { let $_u20 = opts; if ($_u20 == null) return null; return opts.get("indent"); })(this$)); })(this$); if ($_u17 != null) return $_u17; return ""; })(this);
    let maxName = 4;
    props.each((v,n) => {
      (maxName = sys.Int.max(maxName, sys.Str.size(n)));
      return;
    });
    props.each((v,n) => {
      if (sys.ObjUtil.is(v, sys.Type.find("sys::List"))) {
        out.printLine(sys.Str.plus(indent, sys.Str.plus(sys.Str.plus("", n), ":")));
        sys.ObjUtil.coerce(v, sys.Type.find("sys::List")).each((x) => {
          out.printLine(sys.Str.plus(sys.Str.plus(indent, "  "), x));
          return;
        });
      }
      else {
        if (sys.ObjUtil.is(v, sys.Type.find("sys::Map"))) {
          out.printLine(sys.Str.plus(indent, sys.Str.plus(sys.Str.plus("", n), ":")));
          sys.ObjUtil.coerce(v, sys.Type.find("sys::Map")).each((x,k) => {
            out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(indent, "  "), k), ": "), x));
            return;
          });
        }
        else {
          out.printLine(sys.Str.plus(sys.Str.plus(indent, sys.Str.padr(sys.Str.plus(sys.Str.plus("", n), ":"), sys.Int.plus(maxName, 2))), v));
        }
        ;
      }
      ;
      return;
    });
    return;
  }

  runServices(services) {
    const this$ = this;
    sys.Env.cur().addShutdownHook(() => {
      AbstractMain.shutdownServices();
      return;
    });
    services.each((s) => {
      s.install();
      return;
    });
    services.each((s) => {
      s.start();
      return;
    });
    concurrent.Actor.sleep(sys.Duration.maxVal());
    return 0;
  }

  static shutdownServices() {
    const this$ = this;
    sys.Service.list().each((s) => {
      s.stop();
      return;
    });
    sys.Service.list().each((s) => {
      s.uninstall();
      return;
    });
    return;
  }

  main(args) {
    if (args === undefined) args = sys.Env.cur().args();
    let success = false;
    try {
      let argsOk = this.parseArgs(args);
      if ((!argsOk || this.#helpOpt)) {
        let out = sys.Env.cur().out();
        out.printLine();
        this.usage(out);
        out.printLine();
        if (!this.#helpOpt) {
          this.log().err("Missing arguments");
        }
        ;
        return 1;
      }
      ;
      return this.run();
    }
    catch ($_u21) {
      $_u21 = sys.Err.make($_u21);
      if ($_u21 instanceof sys.Err) {
        let err = $_u21;
        ;
        this.log().err("Cannot boot");
        err.trace();
        return 1;
      }
      else {
        throw $_u21;
      }
    }
    ;
  }

  static make() {
    const $self = new AbstractMain();
    AbstractMain.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class Arg extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#help = "";
    return;
  }

  typeof() { return Arg.type$; }

  #help = null;

  help() { return this.#help; }

  __help(it) { if (it === undefined) return this.#help; else this.#help = it; }

  static make(f) {
    const $self = new Arg();
    Arg.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    ;
    ((this$) => { let $_u22 = f; if ($_u22 == null) return null; return sys.Func.call(f, this$); })($self);
    return;
  }

}

class Opt extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#help = "";
    this.#aliases = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$)), sys.Type.find("sys::Str[]"));
    return;
  }

  typeof() { return Opt.type$; }

  #help = null;

  help() { return this.#help; }

  __help(it) { if (it === undefined) return this.#help; else this.#help = it; }

  #aliases = null;

  aliases() { return this.#aliases; }

  __aliases(it) { if (it === undefined) return this.#aliases; else this.#aliases = it; }

  static make(f) {
    const $self = new Opt();
    Opt.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    ;
    ((this$) => { let $_u23 = f; if ($_u23 == null) return null; return sys.Func.call(f, this$); })($self);
    return;
  }

}

class FileLoc extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FileLoc.type$; }

  static #unknown = undefined;

  static unknown() {
    if (FileLoc.#unknown === undefined) {
      FileLoc.static$init();
      if (FileLoc.#unknown === undefined) FileLoc.#unknown = null;
    }
    return FileLoc.#unknown;
  }

  static #eval = undefined;

  static eval() {
    if (FileLoc.#eval === undefined) {
      FileLoc.static$init();
      if (FileLoc.#eval === undefined) FileLoc.#eval = null;
    }
    return FileLoc.#eval;
  }

  static #inputs = undefined;

  static inputs() {
    if (FileLoc.#inputs === undefined) {
      FileLoc.static$init();
      if (FileLoc.#inputs === undefined) FileLoc.#inputs = null;
    }
    return FileLoc.#inputs;
  }

  static #remote = undefined;

  static remote() {
    if (FileLoc.#remote === undefined) {
      FileLoc.static$init();
      if (FileLoc.#remote === undefined) FileLoc.#remote = null;
    }
    return FileLoc.#remote;
  }

  static #synthetic = undefined;

  static synthetic() {
    if (FileLoc.#synthetic === undefined) {
      FileLoc.static$init();
      if (FileLoc.#synthetic === undefined) FileLoc.#synthetic = null;
    }
    return FileLoc.#synthetic;
  }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #line = 0;

  line() { return this.#line; }

  __line(it) { if (it === undefined) return this.#line; else this.#line = it; }

  #col = 0;

  col() { return this.#col; }

  __col(it) { if (it === undefined) return this.#col; else this.#col = it; }

  static makeFile(file,line,col) {
    if (line === undefined) line = 0;
    if (col === undefined) col = 0;
    let uri = file.uri();
    let name = ((this$) => { if (sys.ObjUtil.equals(uri.scheme(), "fan")) return sys.Str.plus(sys.Str.plus(sys.Str.plus("", uri.host()), "::"), uri.pathStr()); return file.pathStr(); })(this);
    return FileLoc.make(name, line, col);
  }

  static make(file,line,col) {
    const $self = new FileLoc();
    FileLoc.make$($self,file,line,col);
    return $self;
  }

  static make$($self,file,line,col) {
    if (line === undefined) line = 0;
    if (col === undefined) col = 0;
    $self.#file = file;
    $self.#line = line;
    $self.#col = col;
    return;
  }

  static parse(s) {
    let file = s;
    let line = 0;
    let col = 0;
    if (sys.Str.endsWith(s, ")")) {
      let open = sys.Str.indexr(s, "(");
      if (open != null) {
        (file = sys.Str.getRange(s, sys.Range.make(0, sys.ObjUtil.coerce(open, sys.Int.type$), true)));
        let comma = sys.Str.index(s, ",", sys.Int.plus(sys.ObjUtil.coerce(open, sys.Int.type$), 2));
        if (comma == null) {
          (line = sys.ObjUtil.coerce(((this$) => { let $_u25 = sys.Str.toInt(sys.Str.trim(sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(open, sys.Int.type$), 1), -2))), 10, false); if ($_u25 != null) return $_u25; return sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()); })(this), sys.Int.type$));
        }
        else {
          (line = sys.ObjUtil.coerce(((this$) => { let $_u26 = sys.Str.toInt(sys.Str.trim(sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(open, sys.Int.type$), 1), sys.ObjUtil.coerce(comma, sys.Int.type$), true))), 10, false); if ($_u26 != null) return $_u26; return sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()); })(this), sys.Int.type$));
          (col = sys.ObjUtil.coerce(((this$) => { let $_u27 = sys.Str.toInt(sys.Str.trim(sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(comma, sys.Int.type$), 1), -2))), 10, false); if ($_u27 != null) return $_u27; return sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()); })(this), sys.Int.type$));
        }
        ;
      }
      ;
    }
    ;
    return FileLoc.make(file, line, col);
  }

  isUnknown() {
    return this === FileLoc.unknown();
  }

  hash() {
    return sys.Int.xor(sys.Int.xor(sys.Str.hash(this.#file), sys.Int.hash(this.#line)), sys.Int.shiftl(sys.Int.hash(this.#col), 17));
  }

  equals(that) {
    let x = sys.ObjUtil.as(that, FileLoc.type$);
    if (x == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#file, x.#file) && sys.ObjUtil.equals(this.#line, x.#line) && sys.ObjUtil.equals(this.#col, x.#col));
  }

  compare(that) {
    let x = sys.ObjUtil.coerce(that, FileLoc.type$);
    if (sys.ObjUtil.compareNE(this.#file, x.#file)) {
      return sys.ObjUtil.compare(this.#file, x.#file);
    }
    ;
    if (sys.ObjUtil.compareNE(this.#line, x.#line)) {
      return sys.ObjUtil.compare(this.#line, x.#line);
    }
    ;
    return sys.ObjUtil.compare(this.#col, x.#col);
  }

  toStr() {
    if (sys.ObjUtil.compareLE(this.#line, 0)) {
      return this.#file;
    }
    ;
    if (sys.ObjUtil.compareLE(this.#col, 0)) {
      return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#file), "("), sys.ObjUtil.coerce(this.#line, sys.Obj.type$.toNullable())), ")");
    }
    ;
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#file), "("), sys.ObjUtil.coerce(this.#line, sys.Obj.type$.toNullable())), ","), sys.ObjUtil.coerce(this.#col, sys.Obj.type$.toNullable())), ")");
  }

  join(sep) {
    if (sep === undefined) sep = ":";
    if (sys.ObjUtil.compareLE(this.#line, 0)) {
      return this.#file;
    }
    ;
    let s = sys.StrBuf.make();
    s.add(sys.Str.toStr(this.#file)).add(sep).add(sys.ObjUtil.coerce(this.#line, sys.Obj.type$.toNullable()));
    if (sys.ObjUtil.compareGT(this.#col, 0)) {
      s.add(sep).add(sys.ObjUtil.coerce(this.#col, sys.Obj.type$.toNullable()));
    }
    ;
    return s.toStr();
  }

  toFilenameOnly() {
    let slash = ((this$) => { let $_u28 = sys.Str.indexr(this$.#file, "/"); if ($_u28 != null) return $_u28; return sys.Str.indexr(this$.#file, "\\"); })(this);
    if (slash == null) {
      return this;
    }
    ;
    return FileLoc.make(sys.Str.getRange(this.#file, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(slash, sys.Int.type$), 1), -1)), this.#line, this.#col);
  }

  static static$init() {
    FileLoc.#unknown = FileLoc.make("unknown");
    FileLoc.#eval = FileLoc.make("eval");
    FileLoc.#inputs = FileLoc.make("inputs");
    FileLoc.#remote = FileLoc.make("remote");
    FileLoc.#synthetic = FileLoc.make("synthetic");
    return;
  }

}

class FileLocErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FileLocErr.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  static make(msg,loc,cause) {
    const $self = new FileLocErr();
    FileLocErr.make$($self,msg,loc,cause);
    return $self;
  }

  static make$($self,msg,loc,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    $self.#loc = loc;
    return;
  }

  toStr() {
    if (this.#loc.isUnknown()) {
      return sys.Err.prototype.toStr.call(this);
    }
    ;
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#loc.toStr()), ": "), this.msg());
  }

}



class IntArray extends sys.Obj {


  constructor(arr)
  {
    super();
    this.#arr = arr;
  }

  #arr;
  __arr() { return this.#arr; }

  typeof() { return IntArray.type$; }

  static makeS1(size) { return new IntArray(new Int8Array(size)); }

  static makeU1(size) { return new IntArray(new Uint8Array(size)); }

  static makeS2(size) { return new IntArray(new Int16Array(size)); }

  static makeU2(size) { return new IntArray(new Uint16Array(size)); }

  static makeS4(size) { return new IntArray(new Int32Array(size)); }

  static makeU4(size) { return new IntArray(new Uint32Array(size)); }

  static makeS8(size) { return new BigIntArray(new BigInt64Array(size)); }


  size() { return this.#arr.length; }

  get(index) { return this.#arr[index]; }

  set(index, val) { this.#arr[index] = val; }

  copyFrom(that, thatRange = null, thisOffset = 0)
  {
    this.#checkKind(that);
    let start = 0, end = 0;
    const thatSize = that.size();
    if (thatRange == null) { start = 0; end = thatSize; }
    else { start = thatRange.__start(thatSize); end = thatRange.__end(thatSize) + 1; }
    const slice = that.#arr.slice(start, end);
    this.#arr.set(slice, thisOffset);
    return this;
  }

  fill(val, range = null)
  {
    let start = 0, end = 0;
    const size = this.size();
    if (range == null) { start = 0; end = size - 1; }
    else { start = range.__start(size); end = range.__end(size); }
    for (let i=start; i<=end; ++i) this.#arr[i] = val;
    return this;
  }

  sort(range = null)
  {
    if (range == null) { this.#arr.sort(); }
    else
    {
      const size  = this.size();
      const start = range.__start(size);
      const end   = range.__end(size) + 1;

      const sortedPart = this.#arr.slice(start, end).sort();
      this.#arr.set(sortedPart, start);
    }
    return this;
  }

  #kind() { return this.#arr.constructor.name; }

  #checkKind(that)
  {
    if (this.#kind() != that.#kind())
      throw sys.ArgErr.make(`Mismatched arrays: ${this.#kind()} != ${that.#kind()}`);
  }
}



class BigIntArray extends IntArray
{
  constructor(arr) { super(arr); }
  get(index) { return parseInt(this.__arr()[index]); }
  set(index, val) { this.__arr()[index] = BigInt(val); }

}

class SyntheticFile extends sys.File {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SyntheticFile.type$; }

  #modified = null;

  modified(it) {
    if (it === undefined) {
      return null;
    }
    else {
      return;
    }
  }

  static make(uri) {
    const $self = new SyntheticFile();
    SyntheticFile.make$($self,uri);
    return $self;
  }

  static make$($self,uri) {
    sys.File.makeNew$($self, uri);
    return;
  }

  exists() {
    return false;
  }

  size() {
    return null;
  }

  osPath() {
    return null;
  }

  parent() {
    return null;
  }

  list(pattern) {
    if (pattern === undefined) pattern = null;
    return sys.ObjUtil.coerce(sys.File.type$.emptyList(), sys.Type.find("sys::File[]"));
  }

  normalize() {
    return this;
  }

  plus(uri,checkSlash) {
    if (checkSlash === undefined) checkSlash = true;
    return SyntheticFile.make(this.uri().plus(uri));
  }

  create() {
    throw sys.IOErr.make();
  }

  moveTo(to) {
    throw sys.IOErr.make();
  }

  delete() {
    throw sys.IOErr.make();
  }

  deleteOnExit() {
    throw sys.IOErr.make();
  }

  open(mode) {
    if (mode === undefined) mode = "rw";
    throw sys.IOErr.make();
  }

  mmap(mode,pos,size) {
    if (mode === undefined) mode = "rw";
    if (pos === undefined) pos = 0;
    if (size === undefined) size = this.size();
    throw sys.IOErr.make();
  }

  in(bufferSize) {
    if (bufferSize === undefined) bufferSize = sys.ObjUtil.coerce(4096, sys.Int.type$.toNullable());
    throw sys.IOErr.make();
  }

  out(append,bufferSize) {
    if (append === undefined) append = false;
    if (bufferSize === undefined) bufferSize = sys.ObjUtil.coerce(4096, sys.Int.type$.toNullable());
    throw sys.IOErr.make();
  }

}

class FileLogger extends concurrent.ActorPool {
  constructor() {
    super();
    const this$ = this;
    this.#actor = concurrent.Actor.make(this, (msg) => {
      return this$.receive(sys.ObjUtil.coerce(msg, sys.Obj.type$));
    });
    return;
  }

  typeof() { return FileLogger.type$; }

  #dir = null;

  dir() { return this.#dir; }

  __dir(it) { if (it === undefined) return this.#dir; else this.#dir = it; }

  #filename = null;

  filename() { return this.#filename; }

  __filename(it) { if (it === undefined) return this.#filename; else this.#filename = it; }

  #onOpen = null;

  onOpen() { return this.#onOpen; }

  __onOpen(it) { if (it === undefined) return this.#onOpen; else this.#onOpen = it; }

  static #log = undefined;

  static log() {
    if (FileLogger.#log === undefined) {
      FileLogger.static$init();
      if (FileLogger.#log === undefined) FileLogger.#log = null;
    }
    return FileLogger.#log;
  }

  #actor = null;

  // private field reflection only
  __actor(it) { if (it === undefined) return this.#actor; else this.#actor = it; }

  static make(f) {
    const $self = new FileLogger();
    FileLogger.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    concurrent.ActorPool.make$($self, sys.ObjUtil.coerce(f, sys.Type.find("|concurrent::ActorPool->sys::Void|?")));
    ;
    return;
  }

  writeLogRec(rec) {
    this.#actor.send(rec);
    return;
  }

  writeStr(msg) {
    this.#actor.send(msg);
    return;
  }

  receive(msg) {
    try {
      let state = sys.ObjUtil.as(concurrent.Actor.locals().get("state"), FileLoggerState.type$);
      if (state == null) {
        concurrent.Actor.locals().set("state", (state = FileLoggerState.make(this)));
      }
      ;
      if (sys.ObjUtil.is(msg, sys.LogRec.type$)) {
        let rec = sys.ObjUtil.coerce(msg, sys.LogRec.type$);
        state.out().printLine(rec);
        if (rec.err() != null) {
          rec.err().trace(state.out());
        }
        ;
        state.out().flush();
      }
      else {
        state.out().printLine(msg).flush();
      }
      ;
    }
    catch ($_u29) {
      $_u29 = sys.Err.make($_u29);
      if ($_u29 instanceof sys.Err) {
        let e = $_u29;
        ;
        FileLogger.log().err("FileLogger.receive", e);
      }
      else {
        throw $_u29;
      }
    }
    ;
    return null;
  }

  static static$init() {
    FileLogger.#log = sys.Log.get("logger");
    return;
  }

}

class FileLoggerState extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#curPattern = "";
    return;
  }

  typeof() { return FileLoggerState.type$; }

  #logger = null;

  logger() { return this.#logger; }

  __logger(it) { if (it === undefined) return this.#logger; else this.#logger = it; }

  #filename = null;

  filename() { return this.#filename; }

  __filename(it) { if (it === undefined) return this.#filename; else this.#filename = it; }

  #dir = null;

  dir() { return this.#dir; }

  __dir(it) { if (it === undefined) return this.#dir; else this.#dir = it; }

  #pattern = null;

  pattern(it) {
    if (it === undefined) {
      return this.#pattern;
    }
    else {
      this.#pattern = it;
      return;
    }
  }

  #curPattern = null;

  curPattern(it) {
    if (it === undefined) {
      return this.#curPattern;
    }
    else {
      this.#curPattern = it;
      return;
    }
  }

  #curOut = null;

  curOut(it) {
    if (it === undefined) {
      return this.#curOut;
    }
    else {
      this.#curOut = it;
      return;
    }
  }

  static make(logger) {
    const $self = new FileLoggerState();
    FileLoggerState.make$($self,logger);
    return $self;
  }

  static make$($self,logger) {
    ;
    $self.#logger = logger;
    $self.#dir = logger.dir();
    $self.#filename = logger.filename();
    let i = sys.Str.index($self.#filename, "{");
    if (i != null) {
      $self.#pattern = sys.Str.getRange($self.#filename, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(i, sys.Int.type$), 1), sys.ObjUtil.coerce(sys.Str.index($self.#filename, "}"), sys.Int.type$), true));
    }
    else {
      $self.open($self.#dir.plus(sys.Str.toUri($self.#filename)));
    }
    ;
    return;
  }

  out() {
    if ((this.#pattern != null && sys.ObjUtil.compareNE(sys.DateTime.now().toLocale(this.#pattern), this.#curPattern))) {
      ((this$) => { let $_u30 = this$.#curOut; if ($_u30 == null) return null; return this$.#curOut.close(); })(this);
      this.#curPattern = sys.DateTime.now().toLocale(this.#pattern);
      let newName = sys.Str.plus(sys.Str.plus(sys.Str.getRange(this.#filename, sys.Range.make(0, sys.ObjUtil.coerce(sys.Str.index(this.#filename, "{"), sys.Int.type$), true)), this.#curPattern), sys.Str.getRange(this.#filename, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sys.Str.index(this.#filename, "}"), sys.Int.type$), 1), -1)));
      let curFile = this.#dir.plus(sys.Str.toUri(newName));
      return this.open(curFile);
    }
    ;
    return sys.ObjUtil.coerce(this.#curOut, sys.OutStream.type$);
  }

  open(curFile) {
    try {
      this.#curOut = curFile.out(true);
    }
    catch ($_u31) {
      $_u31 = sys.Err.make($_u31);
      if ($_u31 instanceof sys.Err) {
        let e = $_u31;
        ;
        sys.ObjUtil.echo(sys.Str.plus("ERROR: Cannot open log file: ", curFile));
        e.trace();
        this.#curOut = NilOutStream.make();
      }
      else {
        throw $_u31;
      }
    }
    ;
    try {
      ((this$) => { let $_u32 = this$.#logger.onOpen(); if ($_u32 == null) return null; return sys.Func.call(this$.#logger.onOpen(), sys.ObjUtil.coerce(this$.#curOut, sys.OutStream.type$)); })(this);
    }
    catch ($_u33) {
      $_u33 = sys.Err.make($_u33);
      if ($_u33 instanceof sys.Err) {
        let e = $_u33;
        ;
        this.#curOut.printLine(sys.Str.plus("ERROR: FileLogger.onOpen\n", e.traceToStr()));
      }
      else {
        throw $_u33;
      }
    }
    ;
    return sys.ObjUtil.coerce(this.#curOut, sys.OutStream.type$);
  }

}

class NilOutStream extends sys.OutStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NilOutStream.type$; }

  static make() {
    const $self = new NilOutStream();
    NilOutStream.make$($self);
    return $self;
  }

  static make$($self) {
    sys.OutStream.make$($self, null);
    return;
  }

  write(byte) {
    return this;
  }

  writeBuf(buf,n) {
    if (n === undefined) n = buf.remaining();
    return this;
  }

  flush() {
    return this;
  }

  sync() {
    return this;
  }

  close() {
    return true;
  }

}



class BoolArray extends sys.Obj {
  typeof() { return BoolArray.type$; }
}

class CsvOutStream extends sys.OutStream {
  constructor() {
    super();
    const this$ = this;
    this.#delimiter = 44;
    return;
  }

  typeof() { return CsvOutStream.type$; }

  #delimiter = 0;

  delimiter(it) {
    if (it === undefined) {
      return this.#delimiter;
    }
    else {
      this.#delimiter = it;
      return;
    }
  }

  static make(out) {
    const $self = new CsvOutStream();
    CsvOutStream.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    sys.OutStream.make$($self, out);
    ;
    return;
  }

  writeRow(row) {
    const this$ = this;
    row.each((cell,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        this$.writeChar(this$.#delimiter);
      }
      ;
      this$.writeCell(cell);
      return;
    });
    return sys.ObjUtil.coerce(this.writeChar(10), CsvOutStream.type$);
  }

  writeCell(cell) {
    const this$ = this;
    if (!this.isQuoteRequired(cell)) {
      return sys.ObjUtil.coerce(this.print(cell), CsvOutStream.type$);
    }
    ;
    this.writeChar(34);
    sys.Str.each(cell, (ch) => {
      if (sys.ObjUtil.equals(ch, 34)) {
        this$.writeChar(34);
      }
      ;
      this$.writeChar(ch);
      return;
    });
    return sys.ObjUtil.coerce(this.writeChar(34), CsvOutStream.type$);
  }

  isQuoteRequired(cell) {
    const this$ = this;
    if (sys.Str.isEmpty(cell)) {
      return true;
    }
    ;
    if ((sys.Int.isSpace(sys.Str.get(cell, 0)) || sys.Int.isSpace(sys.Str.get(cell, -1)))) {
      return true;
    }
    ;
    return sys.Str.any(cell, (ch) => {
      return (sys.ObjUtil.equals(ch, this$.#delimiter) || sys.ObjUtil.equals(ch, 34) || sys.ObjUtil.equals(ch, 10) || sys.ObjUtil.equals(ch, 13));
    });
  }

}

class JsonInStream extends sys.InStream {
  constructor() {
    super();
    const this$ = this;
    this.#cur = 63;
    this.#pos = 0;
    return;
  }

  typeof() { return JsonInStream.type$; }

  #cur = 0;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #pos = 0;

  // private field reflection only
  __pos(it) { if (it === undefined) return this.#pos; else this.#pos = it; }

  static make(in$) {
    const $self = new JsonInStream();
    JsonInStream.make$($self,in$);
    return $self;
  }

  static make$($self,in$) {
    sys.InStream.make$($self, in$);
    ;
    return;
  }

  readJson() {
    this.#pos = 0;
    this.consume();
    this.skipWhitespace();
    return this.parseVal();
  }

  parseObj() {
    const this$ = this;
    let pairs = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj?]"));
    this.skipWhitespace();
    this.expect(JsonToken.objectStart());
    while (true) {
      this.skipWhitespace();
      if (this.maybe(JsonToken.objectEnd())) {
        return this.transformObj(pairs);
      }
      ;
      this.parsePair(pairs);
      if (!this.maybe(JsonToken.comma())) {
        break;
      }
      ;
    }
    ;
    this.expect(JsonToken.objectEnd());
    return this.transformObj(pairs);
  }

  transformObj(obj) {
    return obj;
  }

  parsePair(obj) {
    this.skipWhitespace();
    let key = this.parseStr();
    this.skipWhitespace();
    this.expect(JsonToken.colon());
    this.skipWhitespace();
    let val = this.parseVal();
    this.skipWhitespace();
    obj.set(key, val);
    return;
  }

  parseVal() {
    if (sys.ObjUtil.equals(this.#cur, JsonToken.quote())) {
      return this.parseStr();
    }
    else {
      if ((sys.Int.isDigit(this.#cur) || sys.ObjUtil.equals(this.#cur, 45))) {
        return this.parseNum();
      }
      else {
        if (sys.ObjUtil.equals(this.#cur, JsonToken.objectStart())) {
          return this.parseObj();
        }
        else {
          if (sys.ObjUtil.equals(this.#cur, JsonToken.arrayStart())) {
            return this.parseArray();
          }
          else {
            if (sys.ObjUtil.equals(this.#cur, 116)) {
              this.consume();
              this.expect(114);
              this.expect(117);
              this.expect(101);
              return sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable());
            }
            else {
              if (sys.ObjUtil.equals(this.#cur, 102)) {
                this.consume();
                this.expect(97);
                this.expect(108);
                this.expect(115);
                this.expect(101);
                return sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable());
              }
              else {
                if (sys.ObjUtil.equals(this.#cur, 110)) {
                  this.consume();
                  this.expect(117);
                  this.expect(108);
                  this.expect(108);
                  return null;
                }
                ;
              }
              ;
            }
            ;
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    if (sys.ObjUtil.compareLT(this.#cur, 0)) {
      throw this.err("Unexpected end of stream");
    }
    ;
    throw this.err(sys.Str.plus("Unexpected token ", sys.ObjUtil.coerce(this.#cur, sys.Obj.type$.toNullable())));
  }

  parseNum() {
    let s = sys.StrBuf.make();
    let isFloat = false;
    if (this.maybe(45)) {
      s.add("-");
    }
    ;
    while (sys.Int.isDigit(this.#cur)) {
      s.addChar(this.#cur);
      this.consume();
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, 46)) {
      (isFloat = true);
      s.addChar(this.#cur);
      this.consume();
      while (sys.Int.isDigit(this.#cur)) {
        s.addChar(this.#cur);
        this.consume();
      }
      ;
    }
    ;
    if ((sys.ObjUtil.equals(this.#cur, 101) || sys.ObjUtil.equals(this.#cur, 69))) {
      (isFloat = true);
      s.addChar(this.#cur);
      this.consume();
      if (sys.ObjUtil.equals(this.#cur, 43)) {
        this.consume();
      }
      else {
        if (sys.ObjUtil.equals(this.#cur, 45)) {
          s.addChar(this.#cur);
          this.consume();
        }
        ;
      }
      ;
      while (sys.Int.isDigit(this.#cur)) {
        s.addChar(this.#cur);
        this.consume();
      }
      ;
    }
    ;
    return sys.ObjUtil.coerce(((this$) => { if (isFloat) return sys.ObjUtil.coerce(sys.Float.fromStr(s.toStr()), sys.Num.type$.toNullable()); return sys.ObjUtil.coerce(sys.Int.fromStr(s.toStr()), sys.Num.type$.toNullable()); })(this), sys.Obj.type$);
  }

  parseStr() {
    let s = sys.StrBuf.make();
    this.expect(JsonToken.quote());
    while (sys.ObjUtil.compareNE(this.#cur, JsonToken.quote())) {
      if (sys.ObjUtil.compareLT(this.#cur, 0)) {
        throw this.err("Unexpected end of str literal");
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 92)) {
        s.addChar(this.escape());
      }
      else {
        s.addChar(this.#cur);
        this.consume();
      }
      ;
    }
    ;
    this.expect(JsonToken.quote());
    return s.toStr();
  }

  escape() {
    this.expect(92);
    let $_u35 = this.#cur;
    if (sys.ObjUtil.equals($_u35, 98)) {
      this.consume();
      return 8;
    }
    else if (sys.ObjUtil.equals($_u35, 102)) {
      this.consume();
      return 12;
    }
    else if (sys.ObjUtil.equals($_u35, 110)) {
      this.consume();
      return 10;
    }
    else if (sys.ObjUtil.equals($_u35, 114)) {
      this.consume();
      return 13;
    }
    else if (sys.ObjUtil.equals($_u35, 116)) {
      this.consume();
      return 9;
    }
    else if (sys.ObjUtil.equals($_u35, 34)) {
      this.consume();
      return 34;
    }
    else if (sys.ObjUtil.equals($_u35, 92)) {
      this.consume();
      return 92;
    }
    else if (sys.ObjUtil.equals($_u35, 47)) {
      this.consume();
      return 47;
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

  parseArray() {
    let array = sys.List.make(sys.Obj.type$.toNullable());
    this.expect(JsonToken.arrayStart());
    this.skipWhitespace();
    if (this.maybe(JsonToken.arrayEnd())) {
      return array;
    }
    ;
    while (true) {
      this.skipWhitespace();
      let val = this.parseVal();
      array.add(val);
      this.skipWhitespace();
      if (!this.maybe(JsonToken.comma())) {
        break;
      }
      ;
    }
    ;
    this.skipWhitespace();
    this.expect(JsonToken.arrayEnd());
    return array;
  }

  skipWhitespace() {
    while (sys.Int.isSpace(this.#cur)) {
      this.consume();
    }
    ;
    return;
  }

  expect(tt) {
    if (sys.ObjUtil.compareLT(this.#cur, 0)) {
      throw this.err(sys.Str.plus("Unexpected end of stream, expected ", sys.Int.toChar(tt)));
    }
    ;
    if (sys.ObjUtil.compareNE(this.#cur, tt)) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expected ", sys.Int.toChar(tt)), ", got "), sys.Int.toChar(this.#cur)), " at "), sys.ObjUtil.coerce(this.#pos, sys.Obj.type$.toNullable())));
    }
    ;
    this.consume();
    return;
  }

  maybe(tt) {
    if (sys.ObjUtil.compareNE(this.#cur, tt)) {
      return false;
    }
    ;
    this.consume();
    return true;
  }

  consume() {
    this.#cur = sys.ObjUtil.coerce(((this$) => { let $_u36 = this$.readChar(); if ($_u36 != null) return $_u36; return sys.ObjUtil.coerce(-1, sys.Int.type$.toNullable()); })(this), sys.Int.type$);
    ((this$) => { let $_u37 = this$.#pos;this$.#pos = sys.Int.increment(this$.#pos); return $_u37; })(this);
    return;
  }

  err(msg) {
    return sys.ParseErr.make(msg);
  }

}

class JsonToken extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JsonToken.type$; }

  static #objectStart = undefined;

  static objectStart() {
    if (JsonToken.#objectStart === undefined) {
      JsonToken.static$init();
      if (JsonToken.#objectStart === undefined) JsonToken.#objectStart = 0;
    }
    return JsonToken.#objectStart;
  }

  static #objectEnd = undefined;

  static objectEnd() {
    if (JsonToken.#objectEnd === undefined) {
      JsonToken.static$init();
      if (JsonToken.#objectEnd === undefined) JsonToken.#objectEnd = 0;
    }
    return JsonToken.#objectEnd;
  }

  static #colon = undefined;

  static colon() {
    if (JsonToken.#colon === undefined) {
      JsonToken.static$init();
      if (JsonToken.#colon === undefined) JsonToken.#colon = 0;
    }
    return JsonToken.#colon;
  }

  static #arrayStart = undefined;

  static arrayStart() {
    if (JsonToken.#arrayStart === undefined) {
      JsonToken.static$init();
      if (JsonToken.#arrayStart === undefined) JsonToken.#arrayStart = 0;
    }
    return JsonToken.#arrayStart;
  }

  static #arrayEnd = undefined;

  static arrayEnd() {
    if (JsonToken.#arrayEnd === undefined) {
      JsonToken.static$init();
      if (JsonToken.#arrayEnd === undefined) JsonToken.#arrayEnd = 0;
    }
    return JsonToken.#arrayEnd;
  }

  static #comma = undefined;

  static comma() {
    if (JsonToken.#comma === undefined) {
      JsonToken.static$init();
      if (JsonToken.#comma === undefined) JsonToken.#comma = 0;
    }
    return JsonToken.#comma;
  }

  static #quote = undefined;

  static quote() {
    if (JsonToken.#quote === undefined) {
      JsonToken.static$init();
      if (JsonToken.#quote === undefined) JsonToken.#quote = 0;
    }
    return JsonToken.#quote;
  }

  static make() {
    const $self = new JsonToken();
    JsonToken.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    JsonToken.#objectStart = 123;
    JsonToken.#objectEnd = 125;
    JsonToken.#colon = 58;
    JsonToken.#arrayStart = 91;
    JsonToken.#arrayEnd = 93;
    JsonToken.#comma = 44;
    JsonToken.#quote = 34;
    return;
  }

}

class JsonOutStream extends sys.OutStream {
  constructor() {
    super();
    const this$ = this;
    this.#escapeUnicode = true;
    this.#prettyPrint = false;
    this.#level = 0;
    return;
  }

  typeof() { return JsonOutStream.type$; }

  #escapeUnicode = false;

  escapeUnicode(it) {
    if (it === undefined) {
      return this.#escapeUnicode;
    }
    else {
      this.#escapeUnicode = it;
      return;
    }
  }

  #prettyPrint = false;

  prettyPrint(it) {
    if (it === undefined) {
      return this.#prettyPrint;
    }
    else {
      this.#prettyPrint = it;
      return;
    }
  }

  #level = 0;

  // private field reflection only
  __level(it) { if (it === undefined) return this.#level; else this.#level = it; }

  static writeJsonToStr(obj) {
    let buf = sys.StrBuf.make();
    JsonOutStream.make(buf.out()).writeJson(obj);
    return buf.toStr();
  }

  static prettyPrintToStr(obj) {
    const this$ = this;
    let buf = sys.StrBuf.make();
    sys.ObjUtil.coerce(sys.ObjUtil.with(JsonOutStream.make(buf.out()), (it) => {
      it.#prettyPrint = true;
      return;
    }), JsonOutStream.type$).writeJson(obj);
    return buf.toStr();
  }

  static make(out) {
    const $self = new JsonOutStream();
    JsonOutStream.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    sys.OutStream.make$($self, out);
    ;
    return;
  }

  writeJson(obj) {
    if (sys.ObjUtil.is(obj, sys.Str.type$)) {
      this.writeJsonStr(sys.ObjUtil.coerce(obj, sys.Str.type$));
    }
    else {
      if (sys.ObjUtil.is(obj, sys.Type.find("sys::Map"))) {
        this.writeJsonMap(sys.ObjUtil.coerce(obj, sys.Type.find("sys::Map")));
      }
      else {
        if (sys.ObjUtil.is(obj, sys.Type.find("sys::List"))) {
          this.writeJsonList(sys.ObjUtil.coerce(obj, sys.Type.find("sys::Obj?[]")));
        }
        else {
          if (sys.ObjUtil.is(obj, sys.Float.type$)) {
            this.writeJsonFloat(sys.ObjUtil.coerce(obj, sys.Float.type$));
          }
          else {
            if (sys.ObjUtil.is(obj, sys.Num.type$)) {
              this.writeJsonNum(sys.ObjUtil.coerce(obj, sys.Num.type$));
            }
            else {
              if (sys.ObjUtil.is(obj, sys.Bool.type$)) {
                this.writeJsonBool(sys.ObjUtil.coerce(obj, sys.Bool.type$));
              }
              else {
                if (obj == null) {
                  this.writeJsonNull();
                }
                else {
                  this.writeJsonObj(sys.ObjUtil.coerce(obj, sys.Obj.type$));
                }
                ;
              }
              ;
            }
            ;
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    return this;
  }

  writeJsonObj(obj) {
    const this$ = this;
    let type = sys.Type.of(obj);
    let ser = sys.ObjUtil.as(type.facet(sys.Serializable.type$, false), sys.Serializable.type$);
    if (ser == null) {
      throw sys.IOErr.make(sys.Str.plus("Object type not serializable: ", type));
    }
    ;
    if (ser.simple()) {
      this.writeJsonStr(sys.ObjUtil.toStr(obj));
      return;
    }
    ;
    this.writeChar(JsonToken.objectStart());
    let first = true;
    type.fields().each((f,i) => {
      if ((f.isStatic() || sys.ObjUtil.equals(f.hasFacet(sys.Transient.type$), true))) {
        return;
      }
      ;
      if (first) {
        (first = false);
      }
      else {
        this$.writeChar(JsonToken.comma());
      }
      ;
      this$.writeJsonPair(f.name(), f.get(obj));
      return;
    });
    this.writeChar(JsonToken.objectEnd());
    return;
  }

  writeJsonMap(map) {
    const this$ = this;
    sys.ObjUtil.coerce(this.writeChar(JsonToken.objectStart()), JsonOutStream.type$).ppnl().indent();
    let notFirst = false;
    map.each((val,key) => {
      if (!sys.ObjUtil.is(key, sys.Str.type$)) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("JSON map key is not Str type: ", key), " ["), sys.ObjUtil.typeof(key)), "]"));
      }
      ;
      if (notFirst) {
        sys.ObjUtil.coerce(this$.writeChar(JsonToken.comma()), JsonOutStream.type$).ppnl();
      }
      ;
      this$.writeJsonPair(sys.ObjUtil.coerce(key, sys.Str.type$), val);
      (notFirst = true);
      return;
    });
    this.ppnl().unindent();
    this.ppsp().writeChar(JsonToken.objectEnd());
    return;
  }

  writeJsonList(array) {
    const this$ = this;
    sys.ObjUtil.coerce(this.writeChar(JsonToken.arrayStart()), JsonOutStream.type$).ppnl().indent();
    let notFirst = false;
    array.each((item) => {
      if (notFirst) {
        sys.ObjUtil.coerce(this$.writeChar(JsonToken.comma()), JsonOutStream.type$).ppnl();
      }
      ;
      this$.ppsp().writeJson(item);
      (notFirst = true);
      return;
    });
    this.ppnl().unindent();
    this.ppsp().writeChar(JsonToken.arrayEnd());
    return;
  }

  writeJsonStr(str) {
    const this$ = this;
    this.writeChar(JsonToken.quote());
    sys.Str.each(str, (char) => {
      if ((sys.ObjUtil.compareLE(char, 127) || !this$.#escapeUnicode)) {
        let $_u38 = char;
        if (sys.ObjUtil.equals($_u38, 8)) {
          sys.ObjUtil.coerce(this$.writeChar(92), JsonOutStream.type$).writeChar(98);
        }
        else if (sys.ObjUtil.equals($_u38, 12)) {
          sys.ObjUtil.coerce(this$.writeChar(92), JsonOutStream.type$).writeChar(102);
        }
        else if (sys.ObjUtil.equals($_u38, 10)) {
          sys.ObjUtil.coerce(this$.writeChar(92), JsonOutStream.type$).writeChar(110);
        }
        else if (sys.ObjUtil.equals($_u38, 13)) {
          sys.ObjUtil.coerce(this$.writeChar(92), JsonOutStream.type$).writeChar(114);
        }
        else if (sys.ObjUtil.equals($_u38, 9)) {
          sys.ObjUtil.coerce(this$.writeChar(92), JsonOutStream.type$).writeChar(116);
        }
        else if (sys.ObjUtil.equals($_u38, 92)) {
          sys.ObjUtil.coerce(this$.writeChar(92), JsonOutStream.type$).writeChar(92);
        }
        else if (sys.ObjUtil.equals($_u38, 34)) {
          sys.ObjUtil.coerce(this$.writeChar(92), JsonOutStream.type$).writeChar(34);
        }
        else {
          if (sys.ObjUtil.compareLT(char, 32)) {
            sys.ObjUtil.coerce(sys.ObjUtil.coerce(this$.writeChar(92), JsonOutStream.type$).writeChar(117), JsonOutStream.type$).print(sys.Int.toHex(char, sys.ObjUtil.coerce(4, sys.Int.type$.toNullable())));
          }
          else {
            this$.writeChar(char);
          }
          ;
        }
        ;
      }
      else {
        sys.ObjUtil.coerce(sys.ObjUtil.coerce(this$.writeChar(92), JsonOutStream.type$).writeChar(117), JsonOutStream.type$).print(sys.Int.toHex(char, sys.ObjUtil.coerce(4, sys.Int.type$.toNullable())));
      }
      ;
      return;
    });
    this.writeChar(JsonToken.quote());
    return;
  }

  writeJsonFloat(float) {
    if ((sys.Float.isNaN(float) || sys.ObjUtil.equals(float, sys.Float.posInf()) || sys.ObjUtil.equals(float, sys.Float.negInf()))) {
      throw sys.IOErr.make(sys.Str.plus(sys.Str.plus("Unsupported JSON float literal: '", sys.ObjUtil.coerce(float, sys.Obj.type$.toNullable())), "'"));
    }
    ;
    this.print(sys.ObjUtil.coerce(float, sys.Obj.type$.toNullable()));
    return;
  }

  writeJsonNum(num) {
    this.print(num);
    return;
  }

  writeJsonBool(bool) {
    this.print(sys.ObjUtil.coerce(bool, sys.Obj.type$.toNullable()));
    return;
  }

  writeJsonNull() {
    this.print("null");
    return;
  }

  writeJsonPair(key,val) {
    this.ppsp().writeJsonStr(key);
    this.writeChar(JsonToken.colon());
    if (this.#prettyPrint) {
      this.writeChar(32);
    }
    ;
    this.writeJson(val);
    return;
  }

  ppnl() {
    if (this.#prettyPrint) {
      this.writeChar(10);
    }
    ;
    return this;
  }

  ppsp() {
    if (this.#prettyPrint) {
      this.print(sys.Str.spaces(sys.Int.mult(this.#level, 2)));
    }
    ;
    return this;
  }

  indent() {
    this.#level = sys.Int.increment(this.#level);
    return this;
  }

  unindent() {
    this.#level = sys.Int.decrement(this.#level);
    return this;
  }

}

class PathEnv extends sys.Env {
  constructor() {
    super();
    const this$ = this;
    this.#log = sys.Log.get("pathenv");
    return;
  }

  typeof() { return PathEnv.type$; }

  #pathRef = null;

  // private field reflection only
  __pathRef(it) { if (it === undefined) return this.#pathRef; else this.#pathRef = it; }

  #vars = null;

  vars() { return this.#vars; }

  __vars(it) { if (it === undefined) return this.#vars; else this.#vars = it; }

  #log = null;

  // private field reflection only
  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  static make() {
    const $self = new PathEnv();
    PathEnv.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    sys.Env.make$($self, sys.Env.cur());
    ;
    let vars = $self.superVars();
    let path = PathEnv.parsePath(null, sys.ObjUtil.coerce(((this$) => { let $_u39 = vars.get("FAN_ENV_PATH"); if ($_u39 != null) return $_u39; return ""; })($self), sys.Str.type$), (msg,err) => {
      this$.#log.warn(sys.Str.plus("Parsing FAN_ENV_PATH: ", msg), err);
      return;
    });
    $self.#vars = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(vars), sys.Type.find("[sys::Str:sys::Str]"));
    $self.#pathRef = concurrent.AtomicRef.make(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(path), sys.Type.find("sys::File[]")));
    return;
  }

  static makeProps(file) {
    const $self = new PathEnv();
    PathEnv.makeProps$($self,file);
    return $self;
  }

  static makeProps$($self,file) {
    const this$ = $self;
    sys.Env.make$($self, sys.Env.cur());
    ;
    let props = file.readProps();
    let vars = $self.superVars().rw();
    props.each((v,n) => {
      if ((sys.Str.startsWith(n, "env.") && sys.ObjUtil.compareGT(sys.Str.size(n), 5))) {
        vars.set(sys.Str.getRange(n, sys.Range.make(4, -1)), v);
      }
      ;
      return;
    });
    let workDir = file.parent();
    let path = PathEnv.parsePath(workDir, sys.ObjUtil.coerce(((this$) => { let $_u40 = props.get("path"); if ($_u40 != null) return $_u40; return ""; })($self), sys.Str.type$), (msg,err) => {
      this$.#log.warn(sys.Str.plus(sys.Str.plus(sys.Str.plus("Parsing ", file.osPath()), ": "), msg), err);
      return;
    });
    $self.#vars = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(vars), sys.Type.find("[sys::Str:sys::Str]"));
    $self.#pathRef = concurrent.AtomicRef.make(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(path), sys.Type.find("sys::File[]")));
    return;
  }

  superVars() {
    return sys.Env.prototype.vars.call(this);
  }

  static parsePath(workDir,path,onWarn) {
    const this$ = this;
    let acc = sys.List.make(sys.File.type$);
    acc.addNotNull(((this$) => { let $_u41 = workDir; if ($_u41 == null) return null; return workDir.normalize(); })(this));
    try {
      sys.Str.split(path, sys.ObjUtil.coerce(59, sys.Int.type$.toNullable())).each((item) => {
        if (sys.Str.isEmpty(item)) {
          return;
        }
        ;
        let dir = ((this$) => { if ((sys.Str.startsWith(item, "..") && workDir != null)) return sys.File.os(sys.Str.plus(sys.Str.plus(sys.Str.plus("", workDir.osPath()), "/"), item)).normalize(); return sys.File.os(item).normalize(); })(this$);
        if (!dir.exists()) {
          (dir = sys.File.make(sys.Str.toUri(item).plusSlash(), false).normalize());
        }
        ;
        if (!dir.exists()) {
          sys.Func.call(onWarn, sys.Str.plus("Dir not found: ", dir), null);
          return;
        }
        ;
        if (!dir.isDir()) {
          sys.Func.call(onWarn, sys.Str.plus("Not a dir: ", dir), null);
          return;
        }
        ;
        PathEnv.doAdd(acc, dir);
        return;
      });
    }
    catch ($_u43) {
      $_u43 = sys.Err.make($_u43);
      if ($_u43 instanceof sys.Err) {
        let e = $_u43;
        ;
        sys.Func.call(onWarn, sys.Str.plus("Cannot parse path: ", path), e);
      }
      else {
        throw $_u43;
      }
    }
    ;
    acc.remove(sys.Env.cur().homeDir());
    acc.add(sys.Env.cur().homeDir());
    return acc;
  }

  path() {
    return sys.ObjUtil.coerce(this.#pathRef.val(), sys.Type.find("sys::File[]"));
  }

  workDir() {
    return sys.ObjUtil.coerce(this.path().first(), sys.File.type$);
  }

  tempDir() {
    return this.workDir().plus(sys.Uri.fromStr("temp/"));
  }

  addToPath(dir) {
    (dir = dir.normalize());
    this.#pathRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(PathEnv.doAdd(this.path().dup(), dir, 0)), sys.Type.find("sys::File[]")));
    return;
  }

  static doAdd(path,dir,insertIndex) {
    if (insertIndex === undefined) insertIndex = -1;
    if (!path.contains(dir)) {
      if (sys.ObjUtil.compareLT(insertIndex, 0)) {
        path.add(dir);
      }
      else {
        path.insert(insertIndex, dir);
      }
      ;
    }
    ;
    return path;
  }

  findFile(uri,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    if (uri.isPathAbs()) {
      throw sys.ArgErr.make(sys.Str.plus("Uri must be rel: ", uri));
    }
    ;
    let result = this.path().eachWhile((dir) => {
      let f = dir.plus(uri, false);
      return ((this$) => { if (f.exists()) return f; return null; })(this$);
    });
    if (result != null) {
      return sys.ObjUtil.coerce(result, sys.File.type$.toNullable());
    }
    ;
    if (checked) {
      throw sys.UnresolvedErr.make(uri.toStr());
    }
    ;
    return null;
  }

  findAllFiles(uri) {
    const this$ = this;
    let acc = sys.List.make(sys.File.type$);
    this.path().each((dir) => {
      let f = dir.plus(uri);
      if (f.exists()) {
        acc.add(f);
      }
      ;
      return;
    });
    return acc;
  }

  findAllPodNames() {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    this.path().each((dir) => {
      let lib = dir.plus(sys.Uri.fromStr("lib/fan/"));
      lib.list().each((f) => {
        if ((f.isDir() || sys.ObjUtil.compareNE(f.ext(), "pod"))) {
          return;
        }
        ;
        let podName = f.basename();
        acc.set(podName, podName);
        return;
      });
      return;
    });
    return acc.keys();
  }

}

class CsvTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CsvTest.type$; }

  test() {
    const this$ = this;
    this.verifyCsv("one, two , three", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["one", "two", "three"])]), (it) => {
      return;
    });
    this.verifyCsv("one, two , three", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["one", " two ", " three"])]), (it) => {
      it.trim(false);
      return;
    });
    this.verifyCsv("1 , 2 , 3\n5 ,   , ", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["1", "2", "3"]), sys.List.make(sys.Str.type$, ["5", "", ""])]), (it) => {
      return;
    });
    this.verifyCsv("1|2|3\n4|5|6", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["1", "2", "3"]), sys.List.make(sys.Str.type$, ["4", "5", "6"])]), (it) => {
      it.delimiter(124);
      return;
    });
    this.verifyCsv("foo,\"bar\"\n\"baz\",roo\n\"abc\",\"x\"\n\"a\" ,\"b\"", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["foo", "bar"]), sys.List.make(sys.Str.type$, ["baz", "roo"]), sys.List.make(sys.Str.type$, ["abc", "x"]), sys.List.make(sys.Str.type$, ["a", "b"])]), (it) => {
      return;
    });
    this.verifyCsv("\" one,two \",\"_\"\"hello\"\"_ \"\n\"\"\"x\"\"\",\" ,y,\"", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, [" one,two ", "_\"hello\"_ "]), sys.List.make(sys.Str.type$, ["\"x\"", " ,y,"])]), (it) => {
      return;
    });
    this.verifyCsv("foo, \"bar\"\n\"baz\", roo\n\"abc\", \"x\"", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["foo", "bar"]), sys.List.make(sys.Str.type$, ["baz", "roo"]), sys.List.make(sys.Str.type$, ["abc", "x"])]), (it) => {
      return;
    });
    this.verifyCsv("long,\"line1\nline2\"", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["long", "line1\nline2"])]), (it) => {
      return;
    });
    this.verifyCsv("long with empty lines,\"line1\n\nline2\"", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["long with empty lines", "line1\n\nline2"])]), (it) => {
      return;
    });
    this.verifyCsv("first;\"a\nb \"\"quote\"\"\nc;\nd\"\nsecond;\"\"\"\nline2\nline3\n\"", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["first", "a\nb \"quote\"\nc;\nd"]), sys.List.make(sys.Str.type$, ["second", "\"\nline2\nline3\n"])]), (it) => {
      it.delimiter(59);
      return;
    });
    this.verifyCsv("\u{420}\u{443}\u{441}\u{441}\u{43a}\u{43e}\u{435},\u{441}\u{43b}\u{43e}\u{432}\u{43e}", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["\u{420}\u{443}\u{441}\u{441}\u{43a}\u{43e}\u{435}", "\u{441}\u{43b}\u{43e}\u{432}\u{43e}"])]), (it) => {
      return;
    });
    this.verifyCsv("a,b,c,d\na,b,c,\na,b,,\na,,,\n,,,\n,b,c,d", sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["a", "b", "c", "d"]), sys.List.make(sys.Str.type$, ["a", "b", "c", ""]), sys.List.make(sys.Str.type$, ["a", "b", "", ""]), sys.List.make(sys.Str.type$, ["a", "", "", ""]), sys.List.make(sys.Str.type$, ["", "", "", ""]), sys.List.make(sys.Str.type$, ["", "b", "c", "d"])]), (it) => {
      return;
    });
    return;
  }

  verifyCsv(src,expected,f) {
    const this$ = this;
    let in$ = CsvInStream.make(sys.Str.in(src));
    sys.Func.call(f, in$);
    let x = in$.readAllRows();
    this.verifyEq(x, expected);
    let i = 0;
    (in$ = CsvInStream.make(sys.Str.in(src)));
    sys.Func.call(f, in$);
    while (true) {
      let row = in$.readRow();
      if (row == null) {
        break;
      }
      ;
      this.verifyEq(row, expected.get(((this$) => { let $_u45 = i;i = sys.Int.increment(i); return $_u45; })(this)));
    }
    ;
    this.verifyEq(sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected.size(), sys.Obj.type$.toNullable()));
    (i = 0);
    (in$ = CsvInStream.make(sys.Str.in(src)));
    sys.Func.call(f, in$);
    in$.eachRow((row) => {
      this$.verifyEq(row, expected.get(((this$) => { let $_u46 = i;i = sys.Int.increment(i); return $_u46; })(this$)));
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected.size(), sys.Obj.type$.toNullable()));
    let buf = sys.Buf.make();
    let out = CsvOutStream.make(buf.out());
    out.delimiter(in$.delimiter());
    expected.each((row) => {
      out.writeRow(row);
      return;
    });
    let str = sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).readAllStr();
    (in$ = CsvInStream.make(sys.Str.in(str)));
    sys.Func.call(f, in$);
    this.verifyEq(in$.readAllRows(), expected);
    let sb = sys.StrBuf.make();
    (out = CsvOutStream.make(sb.out()));
    out.delimiter(in$.delimiter());
    expected.each((row) => {
      out.writeRow(row);
      return;
    });
    (str = sb.toStr());
    (in$ = CsvInStream.make(sys.Str.in(str)));
    sys.Func.call(f, in$);
    this.verifyEq(in$.readAllRows(), expected);
    return;
  }

  static make() {
    const $self = new CsvTest();
    CsvTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class FileLocTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FileLocTest.type$; }

  test() {
    this.verifyLoc(FileLoc.make("foo"), "foo", 0, 0);
    this.verifyLoc(FileLoc.make("foo", 2), "foo", 2, 0);
    this.verifyLoc(FileLoc.make("foo", 2, 3), "foo", 2, 3);
    this.verifyCmd(FileLoc.make("a"), FileLoc.make("a"), 0);
    this.verifyCmd(FileLoc.make("a"), FileLoc.make("b"), -1);
    this.verifyCmd(FileLoc.make("b"), FileLoc.make("a"), 1);
    this.verifyCmd(FileLoc.make("a", 2), FileLoc.make("a", 2), 0);
    this.verifyCmd(FileLoc.make("a", 2), FileLoc.make("a", 4), -1);
    this.verifyCmd(FileLoc.make("a", 4), FileLoc.make("a", 2), 1);
    this.verifyCmd(FileLoc.make("a", 2, 5), FileLoc.make("a", 2, 5), 0);
    this.verifyCmd(FileLoc.make("a", 2, 5), FileLoc.make("a", 2, 7), -1);
    this.verifyCmd(FileLoc.make("a", 2, 9), FileLoc.make("a", 2, 7), 1);
    this.verifyLoc(FileLoc.make("foo.txt").toFilenameOnly(), "foo.txt", 0, 0);
    this.verifyLoc(FileLoc.make("foo.txt", 1, 2).toFilenameOnly(), "foo.txt", 1, 2);
    this.verifyLoc(FileLoc.make("/path/foo.txt").toFilenameOnly(), "foo.txt", 0, 0);
    this.verifyLoc(FileLoc.make("\\path\\foo.txt", 1, 2).toFilenameOnly(), "foo.txt", 1, 2);
    this.verifyLoc(FileLoc.make("/long/path/here/foo.txt", 2, 3).toFilenameOnly(), "foo.txt", 2, 3);
    this.verifyEq(FileLoc.make("a", 2, 9).join(), "a:2:9");
    this.verifyEq(FileLoc.make("a", 2, 9).join("."), "a.2.9");
    this.verifyEq(FileLoc.make("a", 2).join("."), "a.2");
    this.verifyEq(FileLoc.make("a", 2).join(), "a:2");
    this.verifyEq(FileLoc.make("a").join(), "a");
    return;
  }

  verifyLoc(loc,file,line,col) {
    this.verifyEq(loc.file(), file);
    this.verifyEq(sys.ObjUtil.coerce(loc.line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(line, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(loc.col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(col, sys.Obj.type$.toNullable()));
    this.verifyEq(FileLoc.make(file, line, col), loc);
    this.verifyEq(FileLoc.parse(loc.toStr()), loc);
    return;
  }

  verifyCmd(a,b,expected) {
    this.verifyEq(sys.ObjUtil.coerce(sys.ObjUtil.compare(a, b), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(sys.ObjUtil.equals(a, b), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.equals(expected, 0), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(sys.ObjUtil.compareLT(a, b), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.compareLT(expected, 0), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(sys.ObjUtil.compareGT(a, b), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.compareGT(expected, 0), sys.Obj.type$.toNullable()));
    return;
  }

  static make() {
    const $self = new FileLocTest();
    FileLocTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class BoolArrayTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BoolArrayTest.type$; }

  testBits() {
    const this$ = this;
    sys.Range.make(0, 1000, true).each((i) => {
      this$.verifyBits(i);
      return;
    });
    return;
  }

  verifyBits(index) {
    const this$ = this;
    let a = BoolArray.make(1000);
    a.set(index, true);
    sys.Range.make(0, 1000, true).each((i) => {
      this$.verifyEq(sys.ObjUtil.coerce(a.get(i), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.equals(i, index), sys.Obj.type$.toNullable()));
      return;
    });
    a.fill(true);
    a.set(index, false);
    sys.Range.make(0, 1000, true).each((i) => {
      this$.verifyEq(sys.ObjUtil.coerce(a.get(i), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.compareNE(i, index), sys.Obj.type$.toNullable()));
      return;
    });
    return;
  }

  testBitsCombo() {
    this.verifyBitCombo(2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Int.type$.toNullable())]));
    this.verifyBitCombo(3, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Int.type$.toNullable())]));
    this.verifyBitCombo(100, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(17, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(32, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(63, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(99, sys.Int.type$.toNullable())]));
    this.verifyBitCombo(100, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(17, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(33, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(64, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(77, sys.Int.type$.toNullable())]));
    this.verifyBitCombo(100, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(30, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(32, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(33, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(35, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(64, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(63, sys.Int.type$.toNullable())]));
    return;
  }

  verifyBitCombo(size,indices) {
    const this$ = this;
    let a = BoolArray.make(size);
    indices.each((i) => {
      a.set(i, true);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(a.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(size, sys.Obj.type$.toNullable()));
    sys.Range.make(0, size, true).each((i) => {
      this$.verifyEq(sys.ObjUtil.coerce(a.get(i), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(indices.contains(sys.ObjUtil.coerce(i, sys.Int.type$.toNullable())), sys.Obj.type$.toNullable()));
      return;
    });
    let c = BoolArray.make(sys.Int.mult(size, 2));
    c.copyFrom(sys.ObjUtil.coerce(a, BoolArray.type$));
    sys.Range.make(0, size, true).each((i) => {
      this$.verifyEq(sys.ObjUtil.coerce(c.get(i), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(indices.contains(sys.ObjUtil.coerce(i, sys.Int.type$.toNullable())), sys.Obj.type$.toNullable()));
      return;
    });
    sys.Range.make(size, c.size(), true).each((i) => {
      this$.verifyEq(sys.ObjUtil.coerce(c.get(i), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      return;
    });
    let trues = sys.List.make(sys.Int.type$);
    a.eachTrue((i) => {
      trues.add(sys.ObjUtil.coerce(i, sys.Int.type$.toNullable()));
      return;
    });
    this.verifyEq(trues, indices.dup().sort());
    return;
  }

  testRandom() {
    const this$ = this;
    let size = sys.Range.make(300, 700).random();
    let sets = sys.List.make(sys.Int.type$);
    sys.Int.times(100, (i) => {
      let x = sys.Range.make(0, size, true).random();
      if (sets.contains(sys.ObjUtil.coerce(x, sys.Int.type$.toNullable()))) {
        return;
      }
      ;
      sets.add(sys.ObjUtil.coerce(x, sys.Int.type$.toNullable()));
      return;
    });
    let a = BoolArray.make(size);
    sets.each((x) => {
      this$.verifyEq(sys.ObjUtil.coerce(a.getAndSet(x, true), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      this$.verifyEq(sys.ObjUtil.coerce(a.getAndSet(x, true), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      return;
    });
    sys.Int.times(a.size(), (i) => {
      this$.verifyEq(sys.ObjUtil.coerce(a.get(i), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sets.contains(sys.ObjUtil.coerce(i, sys.Int.type$.toNullable())), sys.Obj.type$.toNullable()));
      return;
    });
    let trues = sys.List.make(sys.Int.type$);
    a.eachTrue((i) => {
      trues.add(sys.ObjUtil.coerce(i, sys.Int.type$.toNullable()));
      return;
    });
    this.verifyEq(trues, sets.dup().sort());
    a.clear();
    sys.Int.times(a.size(), (i) => {
      this$.verifyEq(sys.ObjUtil.coerce(a.get(i), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      return;
    });
    a.eachTrue((i) => {
      this$.fail();
      return;
    });
    return;
  }

  static make() {
    const $self = new BoolArrayTest();
    BoolArrayTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class JsonTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JsonTest.type$; }

  testBasics() {
    const this$ = this;
    this.verifyBasics("null", null);
    this.verifyBasics("true", sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyBasics("false", sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyErr(sys.ParseErr.type$, (it) => {
      JsonInStream.make(sys.Str.in("nabc")).readJson();
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      JsonInStream.make(sys.Str.in("tabc")).readJson();
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      JsonInStream.make(sys.Str.in("fabcd")).readJson();
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      JsonInStream.make(sys.Str.in("a")).readJson();
      return;
    });
    this.verifyBasics("5", sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    this.verifyBasics("-1234", sys.ObjUtil.coerce(-1234, sys.Obj.type$.toNullable()));
    this.verifyBasics("23.48", sys.ObjUtil.coerce(sys.Float.make(23.48), sys.Obj.type$.toNullable()));
    this.verifyBasics("2.309e23", sys.ObjUtil.coerce(sys.Float.make(2.309E23), sys.Obj.type$.toNullable()));
    this.verifyBasics("-5.8e-15", sys.ObjUtil.coerce(sys.Float.make(-5.8E-15), sys.Obj.type$.toNullable()));
    this.verifyBasics("\"\"", "");
    this.verifyBasics("\"x\"", "x");
    this.verifyBasics("\"ab\"", "ab");
    this.verifyBasics("\"hello world!\"", "hello world!");
    this.verifyBasics("\"\\\" \\\\ \\/ \\b \\f \\n \\r \\t\"", "\" \\ / \u{8} \f \n \r \t");
    this.verifyBasics("\"\\u00ab \\u0ABC \\uabcd\"", "\u{ab} \u{abc} \u{abcd}");
    this.verifyBasics("[]", sys.List.make(sys.Obj.type$.toNullable()));
    this.verifyBasics("[1]", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]));
    this.verifyBasics("[1,2.0]", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable())]));
    this.verifyBasics("[1,2,3]", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())]));
    this.verifyBasics("[3, 4.0, null, \"hi\"]", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), null, "hi"]));
    this.verifyBasics("[2,\n3]", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())]));
    this.verifyBasics("[2\n,3]", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())]));
    this.verifyBasics("[  2 \n , \n 3 ]", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())]));
    this.verifyBasics("{}", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifyBasics("{\"k\":null}", sys.Map.__fromLiteral(["k"], [null], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifyBasics("{\"a\":1, \"b\":2}", sys.Map.__fromLiteral(["a","b"], [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifyBasics("{\"a\":1, \"b\":2,}", sys.Map.__fromLiteral(["a","b"], [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifyErr(sys.ParseErr.type$, (it) => {
      JsonInStream.make(sys.Str.in("\"")).readJson();
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      JsonInStream.make(sys.Str.in("[")).readJson();
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      JsonInStream.make(sys.Str.in("[1")).readJson();
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      JsonInStream.make(sys.Str.in("[1,2")).readJson();
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      JsonInStream.make(sys.Str.in("{")).readJson();
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      JsonInStream.make(sys.Str.in("{\"x\":")).readJson();
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      JsonInStream.make(sys.Str.in("{\"x\":4,")).readJson();
      return;
    });
    return;
  }

  testUnprintable() {
    this.verifyBasics("\"\\u0000\"", sys.Str.fromChars(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Int.type$.toNullable())])));
    this.verifyBasics("\"abc\\u0000\"", sys.Str.fromChars(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(97, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(98, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(99, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Int.type$.toNullable())])));
    let chars = sys.List.make(sys.Int.type$);
    for (let i = 0; sys.ObjUtil.compareLT(i, 32); ((this$) => { let $_u47 = i;i = sys.Int.increment(i); return $_u47; })(this)) {
      chars.add(sys.ObjUtil.coerce(i, sys.Int.type$.toNullable()));
    }
    ;
    this.verifyBasics("\"\\u0000\\u0001\\u0002\\u0003\\u0004\\u0005\\u0006\\u0007\\b\\t\\n\\u000b\\f\\r\\u000e\\u000f\\u0010\\u0011\\u0012\\u0013\\u0014\\u0015\\u0016\\u0017\\u0018\\u0019\\u001a\\u001b\\u001c\\u001d\\u001e\\u001f\"", sys.Str.fromChars(chars));
    return;
  }

  verifyBasics(s,expected) {
    this.verifyRoundtrip(expected);
    let array = sys.ObjUtil.as(JsonInStream.make(sys.Str.in(sys.Str.plus(sys.Str.plus("[", s), "]"))).readJson(), sys.Type.find("sys::Obj?[]"));
    this.verifyType(sys.ObjUtil.coerce(array, sys.Obj.type$), sys.Type.find("sys::Obj?[]"));
    this.verifyEq(sys.ObjUtil.coerce(array.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(array.get(0), expected);
    this.verifyRoundtrip(array);
    (array = sys.ObjUtil.as(JsonInStream.make(sys.Str.in(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[", s), ","), s), "]"))).readJson(), sys.Type.find("sys::Obj?[]")));
    this.verifyType(sys.ObjUtil.coerce(array, sys.Obj.type$), sys.Type.find("sys::Obj?[]"));
    this.verifyEq(sys.ObjUtil.coerce(array.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(array.get(0), expected);
    this.verifyEq(array.get(1), expected);
    this.verifyRoundtrip(array);
    let map = sys.ObjUtil.as(JsonInStream.make(sys.Str.in(sys.Str.plus(sys.Str.plus("{\"key\":", s), "}"))).readJson(), sys.Type.find("[sys::Str:sys::Obj?]"));
    this.verifyType(sys.ObjUtil.coerce(map, sys.Obj.type$), sys.Type.find("[sys::Str:sys::Obj?]"));
    this.verifyEq(sys.ObjUtil.coerce(map.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(map.get("key"), expected);
    this.verifyRoundtrip(map);
    return;
  }

  verifyRoundtrip(obj) {
    let str = JsonOutStream.writeJsonToStr(obj);
    let roundtrip = JsonInStream.make(sys.Str.in(str)).readJson();
    this.verifyEq(obj, roundtrip);
    return;
  }

  testWrite() {
    const this$ = this;
    this.verifyWrite(null, "null");
    this.verifyWrite(sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), "true");
    this.verifyWrite(sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), "false");
    this.verifyWrite("hi", "\"hi\"");
    this.verifyWrite(sys.ObjUtil.coerce(sys.Float.make(-2.3E34), sys.Obj.type$.toNullable()), "-2.3E34");
    this.verifyWrite(sys.Decimal.make(34.12345), "34.12345");
    this.verifyWrite(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Int.type$.toNullable())]), "[1,2,3]");
    this.verifyWrite(sys.Map.__fromLiteral(["key"], ["val"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), "{\"key\":\"val\"}");
    this.verifyWrite(sys.Map.__fromLiteral(["key"], ["val\\\"ue"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), "{\"key\":\"val\\\\\\\"ue\"}");
    this.verifyWrite(sys.Duration.fromStr("5min"), "\"5min\"");
    this.verifyWrite(sys.Uri.fromStr("/some/uri/"), "\"/some/uri/\"");
    this.verifyWrite(sys.Time.fromStr("23:45:01"), "\"23:45:01\"");
    this.verifyWrite(sys.Date.fromStr("2009-12-21"), "\"2009-12-21\"");
    this.verifyWrite(sys.Month.dec(), "\"dec\"");
    this.verifyWrite(sys.Version.fromStr("3.4"), "\"3.4\"");
    this.verifyWrite(SerialA.make(), "{\"b\":true,\"i\":7,\"f\":5.0,\"s\":\"string\\n\",\"ints\":[1,2,3]}");
    this.verifyErr(sys.IOErr.type$, (it) => {
      this$.verifyWrite(sys.ObjUtil.coerce(sys.Float.nan(), sys.Obj.type$.toNullable()), "");
      return;
    });
    this.verifyErr(sys.IOErr.type$, (it) => {
      this$.verifyWrite(sys.ObjUtil.coerce(sys.Float.posInf(), sys.Obj.type$.toNullable()), "");
      return;
    });
    this.verifyErr(sys.IOErr.type$, (it) => {
      this$.verifyWrite(sys.ObjUtil.coerce(sys.Float.negInf(), sys.Obj.type$.toNullable()), "");
      return;
    });
    this.verifyErr(sys.IOErr.type$, (it) => {
      this$.verifyWrite(sys.Buf.make(), "");
      return;
    });
    this.verifyErr(sys.IOErr.type$, (it) => {
      this$.verifyWrite(sys.Str.type$.pod(), "");
      return;
    });
    return;
  }

  verifyWrite(obj,expected) {
    this.verifyEq(JsonOutStream.writeJsonToStr(obj), expected);
    return;
  }

  testRaw() {
    let buf = sys.StrBuf.make();
    buf.add("\n{\n  \"type\"\n:\n\"Foobar\",\n \n\n\"age\"\n:\n34,    \n\n\n\n");
    buf.add("\t\"nested\"\t:  \n{\t \"ids\":[3.28, 3.14, 2.14],  \t\t\"dead\":false\n\n,");
    buf.add("\t\n \"friends\"\t:\n null\t  \n}\n\t\n}");
    let str = buf.toStr();
    let map = sys.ObjUtil.coerce(JsonInStream.make(sys.Str.in(str)).readJson(), sys.Type.find("[sys::Str:sys::Obj?]"));
    this.verifyEq(map.get("type"), "Foobar");
    this.verifyEq(map.get("age"), sys.ObjUtil.coerce(34, sys.Obj.type$.toNullable()));
    let inner = sys.ObjUtil.coerce(map.get("nested"), sys.Type.find("[sys::Str:sys::Obj?]"));
    this.verifyNotEq(inner, null);
    this.verifyEq(inner.get("dead"), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(inner.get("friends"), null);
    let list = sys.ObjUtil.coerce(inner.get("ids"), sys.Type.find("sys::List"));
    this.verifyNotEq(list, null);
    this.verifyEq(sys.ObjUtil.coerce(list.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(map.get("friends"), null);
    return;
  }

  testEscapes() {
    const this$ = this;
    let obj = sys.ObjUtil.coerce(JsonInStream.make(sys.Str.in("{\n\"foo\"   : \"bar\\nbaz\",\n\"bar\"   : \"_\\r \\t \\u0abc \\\\ \\/_\",\n\"baz\"   : \"\\\"hi\\\"\",\n\"num\"   : 1234,\n\"bool\"  : true,\n\"float\" : 2.4,\n\"dollar\": \"\$100 \\u00f7\",\n\"a\\nb\"  : \"crazy key\"\n}")).readJson(), sys.Type.find("[sys::Str:sys::Obj]"));
    let f = () => {
      this$.verifyEq(obj.get("foo"), "bar\nbaz");
      this$.verifyEq(obj.get("bar"), "_\r \t \u{abc} \\ /_");
      this$.verifyEq(obj.get("baz"), "\"hi\"");
      this$.verifyEq(obj.get("num"), sys.ObjUtil.coerce(1234, sys.Obj.type$.toNullable()));
      this$.verifyEq(obj.get("bool"), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      this$.verify(sys.Float.approx(sys.Float.make(2.4), sys.ObjUtil.coerce(obj.get("float"), sys.Float.type$)));
      this$.verifyEq(obj.get("dollar"), "\$100 \u{f7}");
      this$.verifyEq(obj.get("a\nb"), "crazy key");
      this$.verifyEq(obj.keys().join(","), "foo,bar,baz,num,bool,float,dollar,a\nb");
      return;
    };
    sys.Func.call(f);
    let buf = sys.Buf.make();
    JsonOutStream.make(buf.out()).writeJson(obj);
    let str = sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).readAllStr();
    this.verifyEq(sys.ObjUtil.coerce(sys.Str.contains(str, "\u{f7}"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(sys.Str.contains(str, "\\u00f7"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    (obj = sys.ObjUtil.coerce(JsonInStream.make(sys.Str.in(str)).readJson(), sys.Type.find("[sys::Str:sys::Obj]")));
    sys.Func.call(f);
    (buf = sys.Buf.make());
    sys.ObjUtil.coerce(sys.ObjUtil.with(JsonOutStream.make(buf.out()), (it) => {
      it.escapeUnicode(false);
      return;
    }), JsonOutStream.type$).writeJson(obj);
    (str = sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).readAllStr());
    this.verifyEq(sys.ObjUtil.coerce(sys.Str.contains(str, "\u{f7}"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(sys.Str.contains(str, "\\u00f7"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    (obj = sys.ObjUtil.coerce(JsonInStream.make(sys.Str.in(str)).readJson(), sys.Type.find("[sys::Str:sys::Obj]")));
    sys.Func.call(f);
    return;
  }

  testTransform() {
    this.verifyEq(TransformJsonInStream.make(sys.Str.in("[\n  {},\n  {\"a\": true},\n  {\"b\": \"xyz\", \"c\": 123}\n]")).readJson(), sys.List.make(sys.Obj.type$.toNullable(), [sys.List.make(Pair.type$), sys.List.make(Pair.type$, [Pair.make("a", sys.ObjUtil.coerce(true, sys.Obj.type$))]), sys.List.make(Pair.type$, [Pair.make("b", "xyz"), Pair.make("c", sys.ObjUtil.coerce(123, sys.Obj.type$))])]));
    return;
  }

  static make() {
    const $self = new JsonTest();
    JsonTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class SerialA extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#b = true;
    this.#i = 7;
    this.#f = sys.Float.make(5.0);
    this.#s = "string\n";
    this.#noGo = 99;
    this.#ints = sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Int.type$.toNullable())]);
    return;
  }

  typeof() { return SerialA.type$; }

  #b = false;

  b(it) {
    if (it === undefined) {
      return this.#b;
    }
    else {
      this.#b = it;
      return;
    }
  }

  #i = 0;

  i(it) {
    if (it === undefined) {
      return this.#i;
    }
    else {
      this.#i = it;
      return;
    }
  }

  #f = sys.Float.make(0);

  f(it) {
    if (it === undefined) {
      return this.#f;
    }
    else {
      this.#f = it;
      return;
    }
  }

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

  #noGo = 0;

  noGo(it) {
    if (it === undefined) {
      return this.#noGo;
    }
    else {
      this.#noGo = it;
      return;
    }
  }

  #ints = null;

  ints(it) {
    if (it === undefined) {
      return this.#ints;
    }
    else {
      this.#ints = it;
      return;
    }
  }

  static make() {
    const $self = new SerialA();
    SerialA.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class TransformJsonInStream extends JsonInStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TransformJsonInStream.type$; }

  static make(in$) {
    const $self = new TransformJsonInStream();
    TransformJsonInStream.make$($self,in$);
    return $self;
  }

  static make$($self,in$) {
    JsonInStream.make$($self, in$);
    return;
  }

  transformObj(obj) {
    const this$ = this;
    let pairs = sys.List.make(Pair.type$);
    obj.each((v,k) => {
      pairs.add(Pair.make(k, sys.ObjUtil.coerce(v, sys.Obj.type$)));
      return;
    });
    return pairs;
  }

}

class Pair extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Pair.type$; }

  #key = null;

  key(it) {
    if (it === undefined) {
      return this.#key;
    }
    else {
      this.#key = it;
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

  static make(key,val) {
    const $self = new Pair();
    Pair.make$($self,key,val);
    return $self;
  }

  static make$($self,key,val) {
    $self.#key = key;
    $self.#val = val;
    return;
  }

  equals(that) {
    let x = sys.ObjUtil.as(that, Pair.type$);
    if (x == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#key, x.#key) && sys.ObjUtil.equals(this.#val, x.#val));
  }

  hash() {
    return sys.Int.plus(sys.Int.mult(sys.Str.hash(this.#key), 31), sys.ObjUtil.hash(this.#val));
  }

}

class FloatArrayTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FloatArrayTest.type$; }

  testS4() {
    let a = FloatArray.makeF4(5);
    this.verifyMake(a, 5);
    this.verifyStores(a, true);
    return;
  }

  testS8() {
    let a = FloatArray.makeF8(200);
    this.verifyMake(a, 200);
    this.verifyStores(a, false);
    return;
  }

  testCopyFrom() {
    const this$ = this;
    let a = FloatArray.makeF4(8);
    let b = FloatArray.makeF4(4);
    let reset = () => {
      for (let i = 0; sys.ObjUtil.compareLT(i, a.size()); i = sys.Int.increment(i)) {
        a.set(i, sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.plus(i, 1), sys.Num.type$)));
      }
      ;
      for (let i = 0; sys.ObjUtil.compareLT(i, b.size()); i = sys.Int.increment(i)) {
        b.set(i, sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.mult(sys.Int.plus(i, 1), 10), sys.Num.type$)));
      }
      ;
      return;
    };
    sys.Func.call(reset);
    this.verifyFloats(a, "1,2,3,4,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(FloatArray.makeF4(0));
    this.verifyFloats(a, "1,2,3,4,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(b);
    this.verifyFloats(a, "10,20,30,40,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(b, sys.Range.make(0, 2));
    this.verifyFloats(a, "10,20,30,4,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(b, sys.Range.make(0, 2, true));
    this.verifyFloats(a, "10,20,3,4,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(b, sys.Range.make(1, -1));
    this.verifyFloats(a, "20,30,40,4,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(b, sys.Range.make(-3, -2));
    this.verifyFloats(a, "20,30,3,4,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(b, sys.Range.make(1, 2), 1);
    this.verifyFloats(a, "1,20,30,4,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(b, null, 3);
    this.verifyFloats(a, "1,2,3,10,20,30,40,8");
    sys.Func.call(reset);
    a.copyFrom(b, null, 4);
    this.verifyFloats(a, "1,2,3,4,10,20,30,40");
    sys.Func.call(reset);
    a.copyFrom(b, sys.Range.make(-1, -1), 7);
    this.verifyFloats(a, "1,2,3,4,5,6,7,40");
    sys.Func.call(reset);
    a.copyFrom(b, sys.Range.make(0, 0, true), 7);
    this.verifyFloats(a, "1,2,3,4,5,6,7,8");
    this.verifyErr(sys.ArgErr.type$, (it) => {
      a.copyFrom(FloatArray.makeF8(2));
      return;
    });
    return;
  }

  testFill() {
    let a = FloatArray.makeF4(10);
    this.verifyFloats(a, "0,0,0,0,0,0,0,0,0,0");
    a.fill(sys.Float.make(9.0));
    this.verifyFloats(a, "9,9,9,9,9,9,9,9,9,9");
    a.fill(sys.Float.make(3.0), sys.Range.make(6, -2));
    this.verifyFloats(a, "9,9,9,9,9,9,3,3,3,9");
    a.fill(sys.Float.make(4.0), sys.Range.make(0, 3, true));
    this.verifyFloats(a, "4,4,4,9,9,9,3,3,3,9");
    return;
  }

  testSort() {
    this.verifySort(FloatArray.makeF4(10));
    this.verifySort(FloatArray.makeF8(10));
    return;
  }

  verifySort(a) {
    const this$ = this;
    let expected = sys.List.make(sys.Float.type$);
    let expected2to5 = sys.List.make(sys.Float.type$);
    sys.Int.times(a.size(), (i) => {
      let val = sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.random(sys.Range.make(0, 100)), sys.Num.type$));
      a.set(i, val);
      expected.add(sys.ObjUtil.coerce(val, sys.Float.type$.toNullable()));
      if ((sys.ObjUtil.compareLE(2, i) && sys.ObjUtil.compareLE(i, 5))) {
        expected2to5.add(sys.ObjUtil.coerce(val, sys.Float.type$.toNullable()));
      }
      ;
      return;
    });
    expected2to5.sort();
    a.sort(sys.Range.make(2, 5));
    let actual2to5 = sys.List.make(sys.Float.type$);
    sys.Range.make(2, 5).each((i) => {
      actual2to5.add(sys.ObjUtil.coerce(a.get(i), sys.Float.type$.toNullable()));
      return;
    });
    this.verifyEq(expected2to5, actual2to5);
    expected.sort();
    a.sort();
    let actual = sys.List.make(sys.Float.type$);
    sys.Int.times(a.size(), (i) => {
      actual.add(sys.ObjUtil.coerce(a.get(i), sys.Float.type$.toNullable()));
      return;
    });
    this.verifyEq(expected, actual);
    return;
  }

  verifyMake(a,size) {
    this.verifySame(sys.ObjUtil.typeof(a), FloatArray.type$);
    this.verifyEq(sys.ObjUtil.coerce(a.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(size, sys.Obj.type$.toNullable()));
    for (let i = 0; sys.ObjUtil.compareLT(i, a.size()); i = sys.Int.increment(i)) {
      this.verifyEq(sys.ObjUtil.coerce(a.get(i), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$.toNullable()));
    }
    ;
    return;
  }

  verifyStores(a,f4) {
    this.verifyStore(a, f4, sys.Float.make(1.0));
    this.verifyStore(a, f4, sys.Float.make(-9000.7));
    this.verifyStore(a, f4, sys.Float.make(0.02));
    this.verifyStore(a, f4, sys.Float.nan());
    this.verifyStore(a, f4, sys.Float.posInf());
    this.verifyStore(a, f4, sys.Float.negInf());
    return;
  }

  verifyStore(a,f4,val) {
    let expected = val;
    if (f4) {
      (expected = sys.Float.makeBits32(sys.Float.bits32(val)));
    }
    ;
    a.set(0, val);
    a.set(sys.Int.minus(a.size(), 1), val);
    this.verifyEq(sys.ObjUtil.coerce(a.get(0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.get(sys.Int.minus(a.size(), 1)), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected, sys.Obj.type$.toNullable()));
    return;
  }

  verifyFloats(a,list) {
    let s = sys.StrBuf.make();
    for (let i = 0; sys.ObjUtil.compareLT(i, a.size()); i = sys.Int.increment(i)) {
      s.join(sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(a.get(i), sys.Num.type$)), sys.Obj.type$.toNullable()), ",");
    }
    ;
    this.verifyEq(list, s.toStr());
    return;
  }

  static make() {
    const $self = new FloatArrayTest();
    FloatArrayTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class IntArrayTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return IntArrayTest.type$; }

  testS1() {
    let a = IntArray.makeS1(5);
    this.verifyMake(a, 5);
    this.verifyStore(a, -128);
    this.verifyStore(a, 127);
    this.verifyStore(a, 127);
    return;
  }

  testU1() {
    let a = IntArray.makeU1(5);
    this.verifyStore(a, 255);
    this.verifyStore(a, 4660, 52);
    this.verifyStore(a, 255);
    return;
  }

  testS2() {
    let a = IntArray.makeS2(5);
    this.verifyStore(a, -32768);
    this.verifyStore(a, 32767);
    this.verifyStore(a, 32767);
    return;
  }

  testU2() {
    let a = IntArray.makeU2(5);
    this.verifyStore(a, 65535);
    this.verifyStore(a, 188899089660022, 14454);
    this.verifyStore(a, 65535);
    return;
  }

  testS4() {
    let a = IntArray.makeS4(5);
    this.verifyStore(a, 1);
    this.verifyStore(a, -9);
    this.verifyStore(a, 123456789);
    this.verifyStore(a, -2147483648);
    this.verifyStore(a, 2147483647);
    this.verifyStore(a, 12977228100694, 2131899478);
    return;
  }

  testU4() {
    let a = IntArray.makeU4(5);
    this.verifyStore(a, 1);
    this.verifyStore(a, 4294967295);
    this.verifyStore(a, 4275831075);
    this.verifyStore(a, 2147483647);
    return;
  }

  testS8() {
    let a = IntArray.makeS8(2000);
    this.verifyStore(a, 1);
    this.verifyStore(a, -9);
    this.verifyStore(a, -2147483649);
    this.verifyStore(a, 2147483648);
    this.verifyStore(a, 81985529789090178);
    return;
  }

  testCopyFrom() {
    const this$ = this;
    let a = IntArray.makeS4(8);
    let b = IntArray.makeS4(4);
    let reset = () => {
      for (let i = 0; sys.ObjUtil.compareLT(i, a.size()); i = sys.Int.increment(i)) {
        a.set(i, sys.Int.plus(i, 1));
      }
      ;
      for (let i = 0; sys.ObjUtil.compareLT(i, b.size()); i = sys.Int.increment(i)) {
        b.set(i, sys.Int.mult(sys.Int.plus(i, 1), 10));
      }
      ;
      return;
    };
    sys.Func.call(reset);
    this.verifyInts(a, "1,2,3,4,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(IntArray.makeS4(0));
    this.verifyInts(a, "1,2,3,4,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(b);
    this.verifyInts(a, "10,20,30,40,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(b, sys.Range.make(0, 2));
    this.verifyInts(a, "10,20,30,4,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(b, sys.Range.make(0, 2, true));
    this.verifyInts(a, "10,20,3,4,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(b, sys.Range.make(1, -1));
    this.verifyInts(a, "20,30,40,4,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(b, sys.Range.make(-3, -2));
    this.verifyInts(a, "20,30,3,4,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(b, sys.Range.make(1, 2), 1);
    this.verifyInts(a, "1,20,30,4,5,6,7,8");
    sys.Func.call(reset);
    a.copyFrom(b, null, 3);
    this.verifyInts(a, "1,2,3,10,20,30,40,8");
    sys.Func.call(reset);
    a.copyFrom(b, null, 4);
    this.verifyInts(a, "1,2,3,4,10,20,30,40");
    sys.Func.call(reset);
    a.copyFrom(b, sys.Range.make(-1, -1), 7);
    this.verifyInts(a, "1,2,3,4,5,6,7,40");
    sys.Func.call(reset);
    a.copyFrom(b, sys.Range.make(0, 0, true), 7);
    this.verifyInts(a, "1,2,3,4,5,6,7,8");
    this.verifyErr(sys.ArgErr.type$, (it) => {
      a.copyFrom(IntArray.makeU4(2));
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      a.copyFrom(IntArray.makeS8(2));
      return;
    });
    return;
  }

  testFill() {
    let a = IntArray.makeU1(10);
    this.verifyInts(a, "0,0,0,0,0,0,0,0,0,0");
    a.fill(9);
    this.verifyInts(a, "9,9,9,9,9,9,9,9,9,9");
    a.fill(3, sys.Range.make(6, -2));
    this.verifyInts(a, "9,9,9,9,9,9,3,3,3,9");
    a.fill(4, sys.Range.make(0, 3, true));
    this.verifyInts(a, "4,4,4,9,9,9,3,3,3,9");
    a.fill(-1);
    this.verifyInts(a, "255,255,255,255,255,255,255,255,255,255");
    return;
  }

  testSort() {
    this.verifySort(IntArray.makeS1(10));
    this.verifySort(IntArray.makeU1(10));
    this.verifySort(IntArray.makeS2(10));
    this.verifySort(IntArray.makeU2(10));
    this.verifySort(IntArray.makeS4(10));
    this.verifySort(IntArray.makeU4(10));
    this.verifySort(IntArray.makeS8(10));
    return;
  }

  verifySort(a) {
    const this$ = this;
    let expected = sys.List.make(sys.Int.type$);
    let expected2to5 = sys.List.make(sys.Int.type$);
    sys.Int.times(a.size(), (i) => {
      let val = sys.Int.random(sys.Range.make(0, 100));
      a.set(i, val);
      expected.add(sys.ObjUtil.coerce(val, sys.Int.type$.toNullable()));
      if ((sys.ObjUtil.compareLE(2, i) && sys.ObjUtil.compareLE(i, 5))) {
        expected2to5.add(sys.ObjUtil.coerce(val, sys.Int.type$.toNullable()));
      }
      ;
      return;
    });
    expected2to5.sort();
    a.sort(sys.Range.make(2, 5));
    let actual2to5 = sys.List.make(sys.Int.type$);
    sys.Range.make(2, 5).each((i) => {
      actual2to5.add(sys.ObjUtil.coerce(a.get(i), sys.Int.type$.toNullable()));
      return;
    });
    this.verifyEq(expected2to5, actual2to5);
    expected.sort();
    a.sort();
    let actual = sys.List.make(sys.Int.type$);
    sys.Int.times(a.size(), (i) => {
      actual.add(sys.ObjUtil.coerce(a.get(i), sys.Int.type$.toNullable()));
      return;
    });
    this.verifyEq(expected, actual);
    return;
  }

  verifyMake(a,size) {
    this.verifySame(sys.ObjUtil.typeof(a), IntArray.type$);
    this.verifyEq(sys.ObjUtil.coerce(a.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(size, sys.Obj.type$.toNullable()));
    for (let i = 0; sys.ObjUtil.compareLT(i, a.size()); i = sys.Int.increment(i)) {
      this.verifyEq(sys.ObjUtil.coerce(a.get(i), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    }
    ;
    return;
  }

  verifyStore(a,val,expected) {
    if (expected === undefined) expected = val;
    a.set(0, val);
    a.set(sys.Int.minus(a.size(), 1), val);
    this.verifyEq(sys.ObjUtil.coerce(a.get(0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.get(sys.Int.minus(a.size(), 1)), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected, sys.Obj.type$.toNullable()));
    return;
  }

  verifyInts(a,list) {
    let s = sys.StrBuf.make();
    for (let i = 0; sys.ObjUtil.compareLT(i, a.size()); i = sys.Int.increment(i)) {
      s.join(sys.ObjUtil.coerce(a.get(i), sys.Obj.type$.toNullable()), ",");
    }
    ;
    this.verifyEq(list, s.toStr());
    return;
  }

  static make() {
    const $self = new IntArrayTest();
    IntArrayTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class RandomTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RandomTest.type$; }

  test() {
    const this$ = this;
    let f = (r) => {
      return sys.List.make(sys.Obj.type$, [sys.ObjUtil.coerce(r.next(), sys.Obj.type$), sys.ObjUtil.coerce(r.nextBool(), sys.Obj.type$), sys.ObjUtil.coerce(r.nextFloat(), sys.Obj.type$), r.nextBuf(3).toHex()]);
    };
    let r1 = Random.makeSeeded(123456789);
    let r2 = Random.makeSeeded(123456789);
    this.verifyEq(sys.Func.call(f, r1), sys.Func.call(f, r2));
    this.verifyEq(sys.Func.call(f, r1), sys.Func.call(f, r2));
    (r2 = Random.makeSeeded(123456780));
    this.verifyNotEq(sys.Func.call(f, r1), sys.Func.call(f, r2));
    this.verifyNotEq(sys.Func.call(f, r1), sys.Func.call(f, r2));
    this.verifyRandom(Random.makeSeeded());
    this.verifyRandom(Random.makeSeeded(1234));
    this.verifyRandom(Random.makeSecure());
    return;
  }

  verifyRandom(r) {
    const this$ = this;
    let acc = sys.List.make(sys.Int.type$);
    sys.Int.times(10, (it) => {
      acc.add(sys.ObjUtil.coerce(r.next(), sys.Int.type$.toNullable()));
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(acc.unique().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()));
    acc.clear();
    sys.Int.times(300, (it) => {
      acc.add(sys.ObjUtil.coerce(r.next(sys.Range.make(0, 10)), sys.Int.type$.toNullable()));
      return;
    });
    this.verify(acc.all((it) => {
      return (sys.ObjUtil.compareLE(0, it) && sys.ObjUtil.compareLE(it, 10));
    }));
    this.verifyEq(sys.ObjUtil.coerce(acc.unique().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(11, sys.Obj.type$.toNullable()));
    acc.clear();
    sys.Int.times(300, (it) => {
      acc.add(sys.ObjUtil.coerce(r.next(sys.Range.make(-20, -10, true)), sys.Int.type$.toNullable()));
      return;
    });
    this.verify(acc.all((it) => {
      return (sys.ObjUtil.compareLE(-20, it) && sys.ObjUtil.compareLT(it, -10));
    }));
    this.verifyEq(sys.ObjUtil.coerce(acc.unique().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()));
    let b = r.nextBool();
    this.verify((sys.ObjUtil.equals(b, true) || sys.ObjUtil.equals(b, false)));
    sys.Int.times(100, (it) => {
      let f = r.nextFloat();
      this$.verify((sys.ObjUtil.compareLE(sys.Float.make(0.0), f) && sys.ObjUtil.compareLE(f, sys.Float.make(1.0))));
      return;
    });
    let buf = r.nextBuf(4);
    this.verify(sys.ObjUtil.is(buf, sys.Buf.type$));
    this.verifyEq(sys.ObjUtil.coerce(buf.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    return;
  }

  static make() {
    const $self = new RandomTest();
    RandomTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class MacroTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MacroTest.type$; }

  testEmpty() {
    this.verifyEq("", this.apply(""));
    this.verifyEq("", this.apply("{{}}"));
    return;
  }

  testNoMacros() {
    this.verifyEq("a", this.apply("a"));
    this.verifyEq("{", this.apply("{"));
    this.verifyEq("}", this.apply("}"));
    this.verifyEq("}}", this.apply("}}"));
    this.verifyEq("notAKey}}", this.apply("notAKey}}"));
    this.verifyEq("{notAKey}}", this.apply("{notAKey}}"));
    return;
  }

  testResolve() {
    this.verifyEq("A", this.apply("{{a}}"));
    this.verifyEq("FOO", this.apply("{{foo}}"));
    this.verifyEq("_FOO", this.apply("_{{foo}}"));
    this.verifyEq("_FOO_", this.apply("_{{foo}}_"));
    this.verifyEq("_FOO_BAR", this.apply("_{{foo}}_{{bar}}"));
    this.verifyEq("_FOO_BAR_", this.apply("_{{foo}}_{{bar}}_"));
    this.verifyEq(" ", this.apply("{{ }}"));
    this.verifyEq(" FOO ", this.apply("{{ foo }}"));
    this.verifyEq("_{{_", this.apply("_{{{{}}_"));
    return;
  }

  testUnterminated() {
    const this$ = this;
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.apply("{{");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.apply("{{}");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.apply("{{a");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.apply("{{a}");
      return;
    });
    return;
  }

  testKeys() {
    this.verifyEq(sys.List.make(sys.Str.type$), this.keys("foo"));
    this.verifyEq(sys.List.make(sys.Str.type$, [""]), this.keys("{{}}"));
    this.verifyEq(sys.List.make(sys.Str.type$, [" foo "]), this.keys("{{ foo }}"));
    this.verifyEq(sys.List.make(sys.Str.type$, ["a", "b", "b", "c"]), this.keys("_{{a}}_{{b}}_{{b}}_{{c}}_"));
    return;
  }

  apply(text) {
    const this$ = this;
    return Macro.make(text).apply((it) => {
      return sys.Str.upper(it);
    });
  }

  keys(text) {
    return Macro.make(text).keys();
  }

  static make() {
    const $self = new MacroTest();
    MacroTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class ConsoleTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConsoleTest.type$; }

  static main() {
    let c = Console.cur();
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Console ", c), " ["), sys.ObjUtil.typeof(c)), "]"));
    sys.ObjUtil.echo(sys.Str.plus("width  = ", sys.ObjUtil.coerce(c.width(), sys.Obj.type$.toNullable())));
    sys.ObjUtil.echo(sys.Str.plus("height = ", sys.ObjUtil.coerce(c.height(), sys.Obj.type$.toNullable())));
    c.debug("Debug message!");
    c.info("Info message!");
    c.warn("Warn message!");
    c.err("Error message!");
    let err = sys.Err.make("bad");
    c.debug("Debug message!", err);
    c.info("Info message!", err);
    c.warn("Warn message!", err);
    c.err("Error message!", err);
    c.info("");
    c.table(null);
    c.info("");
    c.table(sys.ObjUtil.coerce(123, sys.Obj.type$.toNullable()));
    c.info("");
    c.table(sys.List.make(sys.Str.type$, ["a", "b", "c"]));
    c.info("");
    c.table(sys.List.make(sys.Type.find("sys::Map"), [sys.Map.__fromLiteral(["First Name","Last Name"], ["Bob","Smith"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), sys.Map.__fromLiteral(["First Name","Last Name","Approx Age"], ["John","Apple",sys.ObjUtil.coerce(52, sys.Obj.type$)], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), sys.Map.__fromLiteral(["First Name","Last Name","Job"], ["Alice","Bobby","Programmer"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))]));
    c.info("");
    c.table(sys.List.make(sys.Type.find("sys::Str[]"), [sys.List.make(sys.Str.type$, ["Name", "Age", "Hire Month"]), sys.List.make(sys.Str.type$, ["Alpha", "30", "Jan-2020"]), sys.List.make(sys.Str.type$, ["Beta", "40", "Feb-1996"]), sys.List.make(sys.Str.type$, ["Charlie", "50", "Mar-2024"])]));
    c.info("");
    c.group("indent 0");
    c.info("line 1");
    c.warn("line 2");
    c.group("indent 1");
    c.err("line 3");
    c.table("scalar");
    c.groupEnd();
    c.err("line 4");
    c.groupEnd();
    c.info("line 5 back to zero");
    c.group("Collapsed", true);
    c.info("alpha");
    c.info("beta");
    c.info("gamma");
    c.groupEnd();
    c.info("Prompt 1>");
    let x = c.prompt();
    c.info(x);
    (x = c.prompt("Prompt 2> "));
    c.info(x);
    c.info("Password 1>");
    (x = c.promptPassword());
    c.info(x);
    (x = c.promptPassword("Passwor 2> "));
    c.info(x);
    c.info("");
    c.info("All done!");
    return;
  }

  static make() {
    const $self = new ConsoleTest();
    ConsoleTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

const p = sys.Pod.add$('util');
const xp = sys.Param.noParams$();
let m;
FloatArray.type$ = p.at$('FloatArray','sys::Obj',[],{'sys::Js':""},8704,FloatArray);
Console.type$ = p.at$('Console','sys::Obj',[],{'sys::Js':""},8195,Console);
NativeConsole.type$ = p.at$('NativeConsole','util::Console',[],{'sys::NoDoc':"",'sys::Js':""},8706,NativeConsole);
OutStreamConsole.type$ = p.at$('OutStreamConsole','util::Console',[],{'sys::NoDoc':"",'sys::Js':""},8194,OutStreamConsole);
ConsoleTable.type$ = p.at$('ConsoleTable','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8192,ConsoleTable);
CsvInStream.type$ = p.at$('CsvInStream','sys::InStream',[],{'sys::Js':""},8192,CsvInStream);
Random.type$ = p.at$('Random','sys::Obj',[],{'sys::Js':""},8193,Random);
SeededRandom.type$ = p.at$('SeededRandom','util::Random',[],{'sys::Js':""},128,SeededRandom);
SecureRandom.type$ = p.at$('SecureRandom','util::Random',[],{'sys::Js':""},128,SecureRandom);
LockFile.type$ = p.at$('LockFile','sys::Obj',[],{'sys::Js':""},8738,LockFile);
CannotAcquireLockFileErr.type$ = p.at$('CannotAcquireLockFileErr','sys::Err',[],{'sys::NoDoc':""},8194,CannotAcquireLockFileErr);
TestRunner.type$ = p.at$('TestRunner','sys::Obj',[],{'sys::Js':""},8192,TestRunner);
Macro.type$ = p.at$('Macro','sys::Obj',[],{'sys::Js':""},8194,Macro);
AbstractMain.type$ = p.at$('AbstractMain','sys::Obj',[],{},8193,AbstractMain);
Arg.type$ = p.at$('Arg','sys::Obj',['sys::Facet'],{'sys::Serializable':""},8242,Arg);
Opt.type$ = p.at$('Opt','sys::Obj',['sys::Facet'],{'sys::Serializable':""},8242,Opt);
FileLoc.type$ = p.at$('FileLoc','sys::Obj',[],{'sys::Js':""},8194,FileLoc);
FileLocErr.type$ = p.at$('FileLocErr','sys::Err',[],{'sys::Js':""},8194,FileLocErr);
IntArray.type$ = p.at$('IntArray','sys::Obj',[],{'sys::Js':""},8704,IntArray);
SyntheticFile.type$ = p.at$('SyntheticFile','sys::File',[],{},8194,SyntheticFile);
FileLogger.type$ = p.at$('FileLogger','concurrent::ActorPool',[],{},8194,FileLogger);
FileLoggerState.type$ = p.at$('FileLoggerState','sys::Obj',[],{},128,FileLoggerState);
NilOutStream.type$ = p.at$('NilOutStream','sys::OutStream',[],{},128,NilOutStream);
BoolArray.type$ = p.at$('BoolArray','sys::Obj',[],{'sys::Js':""},8736,BoolArray);
CsvOutStream.type$ = p.at$('CsvOutStream','sys::OutStream',[],{'sys::Js':""},8192,CsvOutStream);
JsonInStream.type$ = p.at$('JsonInStream','sys::InStream',[],{'sys::Js':""},8192,JsonInStream);
JsonToken.type$ = p.at$('JsonToken','sys::Obj',[],{'sys::Js':""},128,JsonToken);
JsonOutStream.type$ = p.at$('JsonOutStream','sys::OutStream',[],{'sys::Js':""},8192,JsonOutStream);
PathEnv.type$ = p.at$('PathEnv','sys::Env',[],{},8194,PathEnv);
CsvTest.type$ = p.at$('CsvTest','sys::Test',[],{'sys::Js':""},8192,CsvTest);
FileLocTest.type$ = p.at$('FileLocTest','sys::Test',[],{},8192,FileLocTest);
BoolArrayTest.type$ = p.at$('BoolArrayTest','sys::Test',[],{},8192,BoolArrayTest);
JsonTest.type$ = p.at$('JsonTest','sys::Test',[],{},8192,JsonTest);
SerialA.type$ = p.at$('SerialA','sys::Obj',[],{'sys::Serializable':""},128,SerialA);
TransformJsonInStream.type$ = p.at$('TransformJsonInStream','util::JsonInStream',[],{},128,TransformJsonInStream);
Pair.type$ = p.at$('Pair','sys::Obj',[],{},128,Pair);
FloatArrayTest.type$ = p.at$('FloatArrayTest','sys::Test',[],{'sys::Js':""},8192,FloatArrayTest);
IntArrayTest.type$ = p.at$('IntArrayTest','sys::Test',[],{'sys::Js':""},8192,IntArrayTest);
RandomTest.type$ = p.at$('RandomTest','sys::Test',[],{},8192,RandomTest);
MacroTest.type$ = p.at$('MacroTest','sys::Test',[],{'sys::Js':""},8192,MacroTest);
ConsoleTest.type$ = p.at$('ConsoleTest','sys::Test',[],{'sys::Js':""},8192,ConsoleTest);
FloatArray.type$.am$('makeF4',40962,'util::FloatArray',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false)]),{}).am$('makeF8',40962,'util::FloatArray',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false)]),{}).am$('make',132,'sys::Void',xp,{}).am$('size',8192,'sys::Int',xp,{}).am$('get',8192,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{'sys::Operator':""}).am$('set',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false),new sys.Param('val','sys::Float',false)]),{'sys::Operator':""}).am$('copyFrom',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('that','util::FloatArray',false),new sys.Param('thatRange','sys::Range?',true),new sys.Param('thisOffset','sys::Int',true)]),{}).am$('fill',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Float',false),new sys.Param('range','sys::Range?',true)]),{}).am$('sort',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('range','sys::Range?',true)]),{});
Console.type$.am$('cur',40962,'util::Console',xp,{}).am$('wrap',40962,'util::Console',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('width',270337,'sys::Int?',xp,{}).am$('height',270337,'sys::Int?',xp,{}).am$('debug',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false),new sys.Param('err','sys::Err?',true)]),{}).am$('info',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false),new sys.Param('err','sys::Err?',true)]),{}).am$('warn',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false),new sys.Param('err','sys::Err?',true)]),{}).am$('err',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false),new sys.Param('err','sys::Err?',true)]),{}).am$('table',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('clear',270337,'sys::This',xp,{}).am$('group',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false),new sys.Param('collapsed','sys::Bool',true)]),{}).am$('groupEnd',270337,'sys::This',xp,{}).am$('prompt',270337,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',true)]),{}).am$('promptPassword',270337,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',true)]),{}).am$('make',139268,'sys::Void',xp,{});
NativeConsole.type$.am$('curNative',40962,'util::NativeConsole',xp,{}).am$('width',271360,'sys::Int?',xp,{}).am$('height',271360,'sys::Int?',xp,{}).am$('debug',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false),new sys.Param('err','sys::Err?',true)]),{}).am$('info',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false),new sys.Param('err','sys::Err?',true)]),{}).am$('warn',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false),new sys.Param('err','sys::Err?',true)]),{}).am$('err',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false),new sys.Param('err','sys::Err?',true)]),{}).am$('table',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('clear',271360,'sys::This',xp,{}).am$('group',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false),new sys.Param('collapsed','sys::Bool',true)]),{}).am$('groupEnd',271360,'sys::This',xp,{}).am$('prompt',271360,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',true)]),{}).am$('promptPassword',271360,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',true)]),{}).am$('make',139268,'sys::Void',xp,{});
OutStreamConsole.type$.af$('outRef',73730,'sys::Unsafe',{}).af$('indent',73730,'concurrent::AtomicInt',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('width',271360,'sys::Int?',xp,{}).am$('height',271360,'sys::Int?',xp,{}).am$('debug',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false),new sys.Param('err','sys::Err?',true)]),{}).am$('info',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false),new sys.Param('err','sys::Err?',true)]),{}).am$('warn',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false),new sys.Param('err','sys::Err?',true)]),{}).am$('err',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false),new sys.Param('err','sys::Err?',true)]),{}).am$('table',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('clear',271360,'sys::This',xp,{}).am$('group',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false),new sys.Param('collapsed','sys::Bool',true)]),{}).am$('groupEnd',271360,'sys::This',xp,{}).am$('prompt',271360,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',true)]),{}).am$('promptPassword',271360,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',true)]),{}).am$('log',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('level','sys::Str?',false),new sys.Param('msg','sys::Str',false),new sys.Param('err','sys::Err?',true)]),{}).am$('out',8192,'sys::OutStream',xp,{});
ConsoleTable.type$.af$('headers',73728,'sys::Str[]',{}).af$('rows',73728,'sys::Str[][]',{}).af$('widths$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj?',false)]),{}).am$('widths',532480,'sys::Int[]',xp,{}).am$('dump',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','util::Console',false)]),{}).am$('row',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('cells','sys::Str[]',false)]),{}).am$('underlines',2048,'sys::Str',xp,{}).am$('map',40962,'[sys::Str:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj?',false)]),{}).am$('str',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj?',false)]),{}).am$('widths$Once',133120,'sys::Int[]',xp,{});
CsvInStream.type$.af$('delimiter',73728,'sys::Int',{}).af$('trim',73728,'sys::Bool',{}).af$('rowWidth',67584,'sys::Int',{}).af$('line',67584,'sys::Str?',{}).af$('pos',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('readAllRows',8192,'sys::Str[][]',xp,{}).am$('eachRow',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str[]->sys::Void|',false)]),{}).am$('readRow',270336,'sys::Str[]?',xp,{}).am$('parseCell',2048,'sys::Str',xp,{}).am$('parseNonQuotedCell',2048,'sys::Str',xp,{}).am$('parseQuotedCell',2048,'sys::Str',xp,{});
Random.type$.am$('makeSecure',40962,'util::Random',xp,{}).am$('makeSeeded',40962,'util::Random',sys.List.make(sys.Param.type$,[new sys.Param('seed','sys::Int',true)]),{}).am$('makeImpl',4100,'sys::Void',xp,{'sys::NoDoc':""}).am$('next',270337,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('r','sys::Range?',true)]),{}).am$('nextBool',270337,'sys::Bool',xp,{}).am$('nextFloat',270337,'sys::Float',xp,{}).am$('nextBuf',270337,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false)]),{});
SeededRandom.type$.af$('seed',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('seed','sys::Int',false)]),{}).am$('init',8704,'sys::Void',xp,{}).am$('next',271872,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('r','sys::Range?',true)]),{}).am$('nextBool',271872,'sys::Bool',xp,{}).am$('nextFloat',271872,'sys::Float',xp,{}).am$('nextBuf',271872,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false)]),{});
SecureRandom.type$.am$('make',8196,'sys::Void',xp,{}).am$('init',8704,'sys::Void',xp,{}).am$('next',271872,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('r','sys::Range?',true)]),{}).am$('nextBool',271872,'sys::Bool',xp,{}).am$('nextFloat',271872,'sys::Float',xp,{}).am$('nextBuf',271872,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false)]),{});
LockFile.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('file',8192,'sys::File',xp,{}).am$('lock',8192,'sys::This',xp,{}).am$('unlock',8192,'sys::This',xp,{});
CannotAcquireLockFileErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
TestRunner.type$.af$('out',73728,'sys::OutStream',{}).af$('isVerbose',73728,'sys::Bool',{}).af$('failures',67584,'sys::Str[]',{}).af$('startTicks',67584,'sys::Duration',{}).af$('numTypes',67584,'sys::Int',{}).af$('numMethods',67584,'sys::Int',{}).af$('numVerifies',67584,'sys::Int',{}).am$('main',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('printUsage',8192,'sys::Void',xp,{}).am$('printVersion',8192,'sys::Void',xp,{}).am$('runEs',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('targets','sys::Str[]',false)]),{}).am$('runJs',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('targets','sys::Str[]',false)]),{}).am$('runTargets',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('targets','sys::Str[]',false)]),{}).am$('runTarget',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('target','sys::Str',false)]),{}).am$('runAll',270336,'sys::This',xp,{}).am$('runPod',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('pod','sys::Pod',false)]),{}).am$('doRunPod',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('pod','sys::Pod',false),new sys.Param('blankLine','sys::Bool',false)]),{}).am$('runType',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('runMethod',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('method','sys::Method',false)]),{}).am$('onSetup',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('test','sys::Test',false)]),{}).am$('onTeardown',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('test','sys::Test',false)]),{}).am$('reportStart',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('method','sys::Method',false)]),{}).am$('reportSuccess',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('method','sys::Method',false),new sys.Param('verifies','sys::Int',false)]),{}).am$('reportFailure',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('method','sys::Method',false),new sys.Param('err','sys::Err',false)]),{}).am$('reportSummary',270336,'sys::Void',xp,{}).am$('qname',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('method','sys::Method',false)]),{}).am$('numFailures',2048,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
Macro.type$.af$('pattern',73730,'sys::Str',{}).af$('norm',100354,'sys::Int',{}).af$('inMacro',100354,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pattern','sys::Str',false)]),{}).am$('apply',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('resolve','|sys::Str->sys::Str|',false)]),{}).am$('keys',8192,'sys::Str[]',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
AbstractMain.type$.af$('helpOpt',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Print usage help\";aliases=[\"?\"];}"}).am$('appName',270336,'sys::Str',xp,{}).am$('log',270336,'sys::Log',xp,{}).am$('homeDir',270336,'sys::File',xp,{}).am$('argFields',270336,'sys::Field[]',xp,{}).am$('optFields',270336,'sys::Field[]',xp,{}).am$('parseArgs',270336,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('toks','sys::Str[]',false)]),{}).am$('parseOpt',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('opts','sys::Field[]',false),new sys.Param('tok','sys::Str',false),new sys.Param('next','sys::Str?',false)]),{}).am$('parseArg',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('field','sys::Field',false),new sys.Param('tok','sys::Str',false)]),{}).am$('argName',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::Field',false)]),{}).am$('optName',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::Field',false)]),{}).am$('parseVal',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('of','sys::Type',false),new sys.Param('tok','sys::Str',false)]),{}).am$('usage',270336,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('usageArg',2048,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('field','sys::Field',false)]),{}).am$('usageOpt',2048,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('field','sys::Field',false)]),{}).am$('usagePad',2048,'sys::Str[][]',sys.List.make(sys.Param.type$,[new sys.Param('rows','sys::Str[][]',false)]),{}).am$('usagePrint',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('title','sys::Str',false),new sys.Param('rows','sys::Str[][]',false)]),{}).am$('runtimeProps',40962,'[sys::Str:sys::Obj]',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Obj]?',true)]),{}).am$('printProps',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('props','[sys::Str:sys::Obj]',false),new sys.Param('opts','[sys::Str:sys::Obj]?',true)]),{}).am$('run',270337,'sys::Int',xp,{}).am$('runServices',270336,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('services','sys::Service[]',false)]),{}).am$('shutdownServices',34818,'sys::Void',xp,{}).am$('main',270336,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',true)]),{}).am$('make',139268,'sys::Void',xp,{});
Arg.type$.af$('help',73730,'sys::Str',{}).am$('make',139268,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|util::Arg->sys::Void|?',true)]),{});
Opt.type$.af$('help',73730,'sys::Str',{}).af$('aliases',73730,'sys::Str[]',{}).am$('make',139268,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|util::Opt->sys::Void|?',true)]),{});
FileLoc.type$.af$('unknown',106498,'util::FileLoc',{}).af$('eval',106498,'util::FileLoc',{'sys::NoDoc':""}).af$('inputs',106498,'util::FileLoc',{'sys::NoDoc':""}).af$('remote',106498,'util::FileLoc',{'sys::NoDoc':""}).af$('synthetic',106498,'util::FileLoc',{'sys::NoDoc':""}).af$('file',73730,'sys::Str',{}).af$('line',73730,'sys::Int',{}).af$('col',73730,'sys::Int',{}).am$('makeFile',40966,'util::FileLoc?',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('line','sys::Int',true),new sys.Param('col','sys::Int',true)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::Str',false),new sys.Param('line','sys::Int',true),new sys.Param('col','sys::Int',true)]),{}).am$('parse',40962,'util::FileLoc',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{'sys::NoDoc':""}).am$('isUnknown',8192,'sys::Bool',xp,{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('compare',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('join',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('sep','sys::Str',true)]),{'sys::NoDoc':""}).am$('toFilenameOnly',8192,'util::FileLoc',xp,{'sys::NoDoc':""}).am$('static$init',165890,'sys::Void',xp,{});
FileLocErr.type$.af$('loc',73730,'util::FileLoc',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{});
IntArray.type$.am$('makeS1',40962,'util::IntArray',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false)]),{}).am$('makeU1',40962,'util::IntArray',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false)]),{}).am$('makeS2',40962,'util::IntArray',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false)]),{}).am$('makeU2',40962,'util::IntArray',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false)]),{}).am$('makeS4',40962,'util::IntArray',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false)]),{}).am$('makeU4',40962,'util::IntArray',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false)]),{}).am$('makeS8',40962,'util::IntArray',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false)]),{}).am$('make',132,'sys::Void',xp,{}).am$('size',8192,'sys::Int',xp,{}).am$('get',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{'sys::Operator':""}).am$('set',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false),new sys.Param('val','sys::Int',false)]),{'sys::Operator':""}).am$('copyFrom',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('that','util::IntArray',false),new sys.Param('thatRange','sys::Range?',true),new sys.Param('thisOffset','sys::Int',true)]),{}).am$('fill',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Int',false),new sys.Param('range','sys::Range?',true)]),{}).am$('sort',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('range','sys::Range?',true)]),{});
SyntheticFile.type$.af$('modified',271360,'sys::DateTime?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('exists',271360,'sys::Bool',xp,{}).am$('size',271360,'sys::Int?',xp,{}).am$('osPath',271360,'sys::Str?',xp,{}).am$('parent',271360,'sys::File?',xp,{}).am$('list',271360,'sys::File[]',sys.List.make(sys.Param.type$,[new sys.Param('pattern','sys::Regex?',true)]),{}).am$('normalize',271360,'sys::File',xp,{}).am$('plus',271360,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('checkSlash','sys::Bool',true)]),{}).am$('create',271360,'sys::File',xp,{}).am$('moveTo',271360,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('to','sys::File',false)]),{}).am$('delete',271360,'sys::Void',xp,{}).am$('deleteOnExit',271360,'sys::File',xp,{}).am$('open',271360,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('mode','sys::Str',true)]),{}).am$('mmap',271360,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('mode','sys::Str',true),new sys.Param('pos','sys::Int',true),new sys.Param('size','sys::Int?',true)]),{}).am$('in',271360,'sys::InStream',sys.List.make(sys.Param.type$,[new sys.Param('bufferSize','sys::Int?',true)]),{}).am$('out',271360,'sys::OutStream',sys.List.make(sys.Param.type$,[new sys.Param('append','sys::Bool',true),new sys.Param('bufferSize','sys::Int?',true)]),{});
FileLogger.type$.af$('dir',73730,'sys::File',{}).af$('filename',73730,'sys::Str',{}).af$('onOpen',73730,'|sys::OutStream->sys::Void|?',{}).af$('log',100354,'sys::Log',{}).af$('actor',67586,'concurrent::Actor',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('writeLogRec',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','sys::LogRec',false)]),{}).am$('writeStr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('receive',128,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
FileLoggerState.type$.af$('logger',73730,'util::FileLogger',{}).af$('filename',73730,'sys::Str',{}).af$('dir',73730,'sys::File',{}).af$('pattern',73728,'sys::Str?',{}).af$('curPattern',73728,'sys::Str',{}).af$('curOut',73728,'sys::OutStream?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('logger','util::FileLogger',false)]),{}).am$('out',8192,'sys::OutStream',xp,{}).am$('open',8192,'sys::OutStream',sys.List.make(sys.Param.type$,[new sys.Param('curFile','sys::File',false)]),{});
NilOutStream.type$.am$('make',8196,'sys::Void',xp,{}).am$('write',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('byte','sys::Int',false)]),{}).am$('writeBuf',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false),new sys.Param('n','sys::Int',true)]),{}).am$('flush',271360,'sys::This',xp,{}).am$('sync',271360,'sys::This',xp,{}).am$('close',271360,'sys::Bool',xp,{});
BoolArray.type$.am$('make',40966,'util::BoolArray?',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false)]),{}).am$('privateMake',2052,'sys::Void',xp,{}).am$('size',8192,'sys::Int',xp,{}).am$('get',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{'sys::Operator':""}).am$('set',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false),new sys.Param('val','sys::Bool',false)]),{'sys::Operator':""}).am$('getAndSet',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false),new sys.Param('val','sys::Bool',false)]),{}).am$('fill',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Bool',false),new sys.Param('range','sys::Range?',true)]),{}).am$('clear',8192,'sys::This',xp,{}).am$('eachTrue',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Int->sys::Void|',false)]),{}).am$('copyFrom',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('that','util::BoolArray',false)]),{});
CsvOutStream.type$.af$('delimiter',73728,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('writeRow',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('row','sys::Str[]',false)]),{}).am$('writeCell',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cell','sys::Str',false)]),{}).am$('isQuoteRequired',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('cell','sys::Str',false)]),{});
JsonInStream.type$.af$('cur',67584,'sys::Int',{}).af$('pos',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('readJson',8192,'sys::Obj?',xp,{}).am$('parseObj',2048,'sys::Obj',xp,{}).am$('transformObj',270336,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj?]',false)]),{}).am$('parsePair',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj?]',false)]),{}).am$('parseVal',2048,'sys::Obj?',xp,{}).am$('parseNum',2048,'sys::Obj',xp,{}).am$('parseStr',2048,'sys::Str',xp,{}).am$('escape',2048,'sys::Int',xp,{}).am$('parseArray',2048,'sys::List',xp,{}).am$('skipWhitespace',2048,'sys::Void',xp,{}).am$('expect',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tt','sys::Int',false)]),{}).am$('maybe',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('tt','sys::Int',false)]),{}).am$('consume',2048,'sys::Void',xp,{}).am$('err',2048,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{});
JsonToken.type$.af$('objectStart',98434,'sys::Int',{}).af$('objectEnd',98434,'sys::Int',{}).af$('colon',98434,'sys::Int',{}).af$('arrayStart',98434,'sys::Int',{}).af$('arrayEnd',98434,'sys::Int',{}).af$('comma',98434,'sys::Int',{}).af$('quote',98434,'sys::Int',{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
JsonOutStream.type$.af$('escapeUnicode',73728,'sys::Bool',{}).af$('prettyPrint',73728,'sys::Bool',{}).af$('level',67584,'sys::Int',{}).am$('writeJsonToStr',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('prettyPrintToStr',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('writeJson',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('writeJsonObj',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('writeJsonMap',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('map','sys::Map',false)]),{}).am$('writeJsonList',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('array','sys::Obj?[]',false)]),{}).am$('writeJsonStr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('writeJsonFloat',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('float','sys::Float',false)]),{}).am$('writeJsonNum',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('num','sys::Num',false)]),{}).am$('writeJsonBool',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('bool','sys::Bool',false)]),{}).am$('writeJsonNull',2048,'sys::Void',xp,{}).am$('writeJsonPair',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('ppnl',2048,'sys::This',xp,{}).am$('ppsp',2048,'sys::This',xp,{}).am$('indent',2048,'sys::This',xp,{}).am$('unindent',2048,'sys::This',xp,{});
PathEnv.type$.af$('pathRef',67586,'concurrent::AtomicRef',{}).af$('vars',336898,'[sys::Str:sys::Str]',{}).af$('log',67586,'sys::Log',{}).am$('make',8196,'sys::Void',xp,{}).am$('makeProps',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{'sys::NoDoc':""}).am$('superVars',2048,'[sys::Str:sys::Str]',xp,{}).am$('parsePath',40962,'sys::File[]',sys.List.make(sys.Param.type$,[new sys.Param('workDir','sys::File?',false),new sys.Param('path','sys::Str',false),new sys.Param('onWarn','|sys::Str,sys::Err?->sys::Void|',false)]),{'sys::NoDoc':""}).am$('path',271360,'sys::File[]',xp,{}).am$('workDir',271360,'sys::File',xp,{}).am$('tempDir',271360,'sys::File',xp,{}).am$('addToPath',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dir','sys::File',false)]),{'sys::NoDoc':""}).am$('doAdd',34818,'sys::File[]',sys.List.make(sys.Param.type$,[new sys.Param('path','sys::File[]',false),new sys.Param('dir','sys::File',false),new sys.Param('insertIndex','sys::Int',true)]),{}).am$('findFile',271360,'sys::File?',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('findAllFiles',271360,'sys::File[]',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('findAllPodNames',271360,'sys::Str[]',xp,{});
CsvTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('verifyCsv',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false),new sys.Param('expected','sys::Str[][]',false),new sys.Param('f','|util::CsvInStream->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{});
FileLocTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('verifyLoc',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('file','sys::Str',false),new sys.Param('line','sys::Int',false),new sys.Param('col','sys::Int',false)]),{}).am$('verifyCmd',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','util::FileLoc',false),new sys.Param('b','util::FileLoc',false),new sys.Param('expected','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{});
BoolArrayTest.type$.am$('testBits',8192,'sys::Void',xp,{}).am$('verifyBits',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('testBitsCombo',8192,'sys::Void',xp,{}).am$('verifyBitCombo',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false),new sys.Param('indices','sys::Int[]',false)]),{}).am$('testRandom',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
JsonTest.type$.am$('testBasics',8192,'sys::Void',xp,{}).am$('testUnprintable',8192,'sys::Void',xp,{}).am$('verifyBasics',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('expected','sys::Obj?',false)]),{}).am$('verifyRoundtrip',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('testWrite',8192,'sys::Void',xp,{}).am$('verifyWrite',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false),new sys.Param('expected','sys::Str',false)]),{}).am$('testRaw',8192,'sys::Void',xp,{}).am$('testEscapes',8192,'sys::Void',xp,{}).am$('testTransform',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
SerialA.type$.af$('b',73728,'sys::Bool',{}).af$('i',73728,'sys::Int',{}).af$('f',73728,'sys::Float',{}).af$('s',73728,'sys::Str',{}).af$('noGo',73728,'sys::Int',{'sys::Transient':""}).af$('ints',73728,'sys::Int[]',{}).am$('make',139268,'sys::Void',xp,{});
TransformJsonInStream.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('transformObj',271360,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('obj','[sys::Str:sys::Obj?]',false)]),{});
Pair.type$.af$('key',65664,'sys::Str',{}).af$('val',65664,'sys::Obj',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('val','sys::Obj',false)]),{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('hash',271360,'sys::Int',xp,{});
FloatArrayTest.type$.am$('testS4',8192,'sys::Void',xp,{}).am$('testS8',8192,'sys::Void',xp,{}).am$('testCopyFrom',8192,'sys::Void',xp,{}).am$('testFill',8192,'sys::Void',xp,{}).am$('testSort',8192,'sys::Void',xp,{}).am$('verifySort',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','util::FloatArray',false)]),{}).am$('verifyMake',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','util::FloatArray',false),new sys.Param('size','sys::Int',false)]),{}).am$('verifyStores',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','util::FloatArray',false),new sys.Param('f4','sys::Bool',false)]),{}).am$('verifyStore',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','util::FloatArray',false),new sys.Param('f4','sys::Bool',false),new sys.Param('val','sys::Float',false)]),{}).am$('verifyFloats',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','util::FloatArray',false),new sys.Param('list','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
IntArrayTest.type$.am$('testS1',8192,'sys::Void',xp,{}).am$('testU1',8192,'sys::Void',xp,{}).am$('testS2',8192,'sys::Void',xp,{}).am$('testU2',8192,'sys::Void',xp,{}).am$('testS4',8192,'sys::Void',xp,{}).am$('testU4',8192,'sys::Void',xp,{}).am$('testS8',8192,'sys::Void',xp,{}).am$('testCopyFrom',8192,'sys::Void',xp,{}).am$('testFill',8192,'sys::Void',xp,{}).am$('testSort',8192,'sys::Void',xp,{}).am$('verifySort',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','util::IntArray',false)]),{}).am$('verifyMake',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','util::IntArray',false),new sys.Param('size','sys::Int',false)]),{}).am$('verifyStore',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','util::IntArray',false),new sys.Param('val','sys::Int',false),new sys.Param('expected','sys::Int',true)]),{}).am$('verifyInts',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','util::IntArray',false),new sys.Param('list','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
RandomTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('verifyRandom',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','util::Random',false)]),{}).am$('make',139268,'sys::Void',xp,{});
MacroTest.type$.am$('testEmpty',8192,'sys::Void',xp,{}).am$('testNoMacros',8192,'sys::Void',xp,{}).am$('testResolve',8192,'sys::Void',xp,{}).am$('testUnterminated',8192,'sys::Void',xp,{}).am$('testKeys',8192,'sys::Void',xp,{}).am$('apply',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('text','sys::Str',false)]),{}).am$('keys',2048,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('text','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ConsoleTest.type$.am$('main',40962,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "util");
m.set("pod.version", "1.0.83");
m.set("pod.depends", "sys 1.0;concurrent 1.0");
m.set("pod.summary", "Utilities");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "");
m.set("build.user", "");
m.set("build.ts", "2026-03-31T13:16:15-04:00 Detroit");
m.set("build.tsKey", "260331131615");
m.set("build.compiler", "1.0.83");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "true");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "Fantom");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Fantom Core");
m.set("proj.uri", "https://fantom.org/");
m.set("pod.docApi", "true");
m.set("org.uri", "https://fantom.org/");
m.set("pod.native.java", "true");
m.set("vcs.uri", "https://github.com/fantom-lang/fantom");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "true");
p.__meta(m);



// cjs exports begin
export {
  FloatArray,
  Console,
  NativeConsole,
  OutStreamConsole,
  ConsoleTable,
  CsvInStream,
  Random,
  LockFile,
  CannotAcquireLockFileErr,
  TestRunner,
  Macro,
  AbstractMain,
  Arg,
  Opt,
  FileLoc,
  FileLocErr,
  IntArray,
  SyntheticFile,
  FileLogger,
  BoolArray,
  CsvOutStream,
  JsonInStream,
  JsonOutStream,
  PathEnv,
  CsvTest,
  FileLocTest,
  BoolArrayTest,
  JsonTest,
  FloatArrayTest,
  IntArrayTest,
  RandomTest,
  MacroTest,
  ConsoleTest,
};
