// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
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
import * as hxPlatformSerial from './hxPlatformSerial.js'
import * as hxPoint from './hxPoint.js'
import * as hxConn from './hxConn.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class ModbusLib extends hxConn.ConnLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusLib.type$; }

  static cur(checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(hx.HxContext.curHx().rt().lib("modbus", checked), ModbusLib.type$.toNullable());
  }

  onStart() {
    hxConn.ConnLib.prototype.onStart.call(this);
    ModbusLinkMgr.init(this);
    return;
  }

  onStop() {
    hxConn.ConnLib.prototype.onStop.call(this);
    ModbusLinkMgr.stop();
    return;
  }

  onLearn(conn,arg) {
    const this$ = this;
    let regMap = ModbusRegMap.fromConn(this.rt(), conn.rec());
    let tagMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    regMap.regs().each((reg) => {
      let names = haystack.Etc.dictNames(reg.tags());
      tagMap.setList(names, (n) => {
        return n;
      });
      return;
    });
    let tags = tagMap.keys().sort();
    let gb = haystack.GridBuilder.make().addCol("dis").addCol("kind").addCol("modbusCur").addCol("modbusWrite").addCol("point").addCol("unit").addColNames(tags);
    regMap.regs().each((reg) => {
      let row = sys.List.make(sys.Obj.type$.toNullable(), [reg.dis(), reg.data().kind().toStr(), ((this$) => { if (reg.readable()) return reg.name(); return null; })(this$), ((this$) => { if (reg.writable()) return reg.name(); return null; })(this$), haystack.Marker.val(), ((this$) => { let $_u2 = reg.unit(); if ($_u2 == null) return null; return reg.unit().toStr(); })(this$)]);
      tags.each((n) => {
        row.add(reg.tags().get(n));
        return;
      });
      gb.addRow(row);
      return;
    });
    return concurrent.Future.makeCompletable().complete(gb.toGrid());
  }

  read(conn,regs) {
    return sys.ObjUtil.coerce(this.conn(haystack.Etc.toId(conn)).send(hx.HxMsg.make1("modbus.read", sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(regs), sys.Type.find("sys::Str[]")))).get(), haystack.Grid.type$);
  }

  write(conn,reg,val) {
    this.conn(haystack.Etc.toId(conn)).send(hx.HxMsg.make2("modbus.write", reg, val)).get();
    return;
  }

  static make() {
    const $self = new ModbusLib();
    ModbusLib.make$($self);
    return $self;
  }

  static make$($self) {
    hxConn.ConnLib.make$($self);
    return;
  }

}

class ModbusDispatch extends hxConn.ConnDispatch {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusDispatch.type$; }

  static #defGaps = undefined;

  static defGaps() {
    if (ModbusDispatch.#defGaps === undefined) {
      ModbusDispatch.static$init();
      if (ModbusDispatch.#defGaps === undefined) ModbusDispatch.#defGaps = null;
    }
    return ModbusDispatch.#defGaps;
  }

  static #defMax = undefined;

  static defMax() {
    if (ModbusDispatch.#defMax === undefined) {
      ModbusDispatch.static$init();
      if (ModbusDispatch.#defMax === undefined) ModbusDispatch.#defMax = null;
    }
    return ModbusDispatch.#defMax;
  }

  #dev = null;

  // private field reflection only
  __dev(it) { if (it === undefined) return this.#dev; else this.#dev = it; }

  #link = null;

  // private field reflection only
  __link(it) { if (it === undefined) return this.#link; else this.#link = it; }

  static make(arg) {
    const $self = new ModbusDispatch();
    ModbusDispatch.make$($self,arg);
    return $self;
  }

  static make$($self,arg) {
    hxConn.ConnDispatch.make$($self, arg);
    return;
  }

  onReceive(msg) {
    let $_u3 = msg.id();
    if (sys.ObjUtil.equals($_u3, "modbus.read")) {
      return this.mread(sys.ObjUtil.coerce(msg.a(), sys.Type.find("sys::Str[]")));
    }
    else if (sys.ObjUtil.equals($_u3, "modbus.write")) {
      return this.mwrite(sys.ObjUtil.coerce(msg.a(), sys.Str.type$), sys.ObjUtil.coerce(msg.b(), sys.Obj.type$));
    }
    else {
      return hxConn.ConnDispatch.prototype.onReceive.call(this, msg);
    }
    ;
  }

  onOpen() {
    this.#dev = ModbusDev.fromConn(this.conn());
    this.#link = ModbusLink.get(this.#dev.uri());
    return;
  }

  onClose() {
    ((this$) => { let $_u4 = this$.#link; if ($_u4 == null) return null; return this$.#link.close(); })(this);
    this.#link = null;
    this.#dev = null;
    return;
  }

  onPing() {
    try {
      this.#link.ping(sys.ObjUtil.coerce(this.#dev, ModbusDev.type$));
    }
    catch ($_u5) {
      $_u5 = sys.Err.make($_u5);
      if ($_u5 instanceof sys.Err) {
        let err = $_u5;
        ;
        this.close(err);
        throw err;
      }
      else {
        throw $_u5;
      }
    }
    ;
    return haystack.Etc.emptyDict();
  }

  onSyncCur(points) {
    const this$ = this;
    try {
      let regs = this.mapToRegs(points);
      this.toBlocks(regs).each((block) => {
        this$.#link.readBlock(sys.ObjUtil.coerce(this$.#dev, ModbusDev.type$), block);
        this$.updateVals(points, block);
        return;
      });
    }
    catch ($_u6) {
      $_u6 = sys.Err.make($_u6);
      if ($_u6 instanceof sys.Err) {
        let err = $_u6;
        ;
        this.close(err);
      }
      else {
        throw $_u6;
      }
    }
    ;
    return;
  }

  mread(regNames) {
    const this$ = this;
    this.open();
    try {
      let gb = haystack.GridBuilder.make();
      gb.addColNames(sys.List.make(sys.Str.type$, ["name", "val"]));
      let regs = regNames.map((n) => {
        return this$.#dev.regMap().reg(n);
      }, sys.Obj.type$.toNullable());
      this.toBlocks(sys.ObjUtil.coerce(regs, sys.Type.find("hxModbus::ModbusReg[]"))).each((block) => {
        this$.#link.readBlock(sys.ObjUtil.coerce(this$.#dev, ModbusDev.type$), block);
        block.regs().each((r,i) => {
          gb.addRow2(r.name(), block.vals().get(i));
          return;
        });
        return;
      });
      return gb.toGrid();
    }
    catch ($_u7) {
      $_u7 = sys.Err.make($_u7);
      if ($_u7 instanceof sys.Err) {
        let err = $_u7;
        ;
        this.close(err);
        throw err;
      }
      else {
        throw $_u7;
      }
    }
    ;
  }

  toBlocks(regs) {
    let gaps = this.resolveConfigNum("modbusBlockGap", ModbusDispatch.defGaps());
    let max = this.resolveConfigNum("modbusBlockMax", ModbusDispatch.defMax());
    return ModbusBlock.optimize(regs, gaps.toInt(), max.toInt());
  }

  resolveConfigNum(tag,def) {
    let v = sys.ObjUtil.as(this.rec().get(tag), haystack.Number.type$);
    if (v == null) {
      (v = sys.ObjUtil.as(this.conn().tuning().rec().get(tag), haystack.Number.type$));
    }
    ;
    if (v == null) {
      (v = def);
    }
    ;
    return def;
  }

  mapToRegs(points) {
    const this$ = this;
    let regs = sys.List.make(ModbusReg.type$);
    points.each((p) => {
      try {
        let cur = ((this$) => { let $_u8 = p.rec().get("modbusCur"); if ($_u8 != null) return $_u8; throw haystack.FaultErr.make("Missing modbusCur"); })(this$);
        let reg = this$.#dev.regMap().reg(sys.ObjUtil.coerce(cur, sys.Str.type$));
        regs.add(sys.ObjUtil.coerce(reg, ModbusReg.type$));
      }
      catch ($_u9) {
        $_u9 = sys.Err.make($_u9);
        if ($_u9 instanceof sys.Err) {
          let err = $_u9;
          ;
          p.updateCurErr(err);
        }
        else {
          throw $_u9;
        }
      }
      ;
      return;
    });
    return regs;
  }

  updateVals(points,block) {
    const this$ = this;
    block.regs().each((r,i) => {
      let val = block.vals().get(i);
      let pts = points.findAll((x) => {
        return sys.ObjUtil.equals(x.rec().get("modbusCur"), r.name());
      });
      pts.each((p) => {
        if (sys.ObjUtil.is(val, sys.Err.type$)) {
          p.updateCurErr(sys.ObjUtil.coerce(val, sys.Err.type$));
        }
        else {
          p.updateCurOk(val);
        }
        ;
        return;
      });
      return;
    });
    return;
  }

  mwrite(regName,val) {
    this.open();
    try {
      let reg = this.#dev.regMap().reg(regName);
      this.#link.write(sys.ObjUtil.coerce(this.#dev, ModbusDev.type$), sys.ObjUtil.coerce(reg, ModbusReg.type$), val);
      return null;
    }
    catch ($_u10) {
      $_u10 = sys.Err.make($_u10);
      if ($_u10 instanceof sys.Err) {
        let err = $_u10;
        ;
        this.close(err);
        throw err;
      }
      else {
        throw $_u10;
      }
    }
    ;
  }

  onWrite(point,event) {
    try {
      if (event.val() != null) {
        let write = ((this$) => { let $_u11 = point.rec().get("modbusWrite"); if ($_u11 != null) return $_u11; throw haystack.FaultErr.make("Missing modbusWrite"); })(this);
        let reg = this.#dev.regMap().reg(sys.ObjUtil.coerce(write, sys.Str.type$));
        this.#link.write(sys.ObjUtil.coerce(this.#dev, ModbusDev.type$), sys.ObjUtil.coerce(reg, ModbusReg.type$), sys.ObjUtil.coerce(event.val(), sys.Obj.type$));
      }
      ;
      point.updateWriteOk(event);
    }
    catch ($_u12) {
      $_u12 = sys.Err.make($_u12);
      if ($_u12 instanceof sys.Err) {
        let err = $_u12;
        ;
        point.updateWriteErr(event, err);
        this.close(err);
      }
      else {
        throw $_u12;
      }
    }
    ;
    return;
  }

  static static$init() {
    ModbusDispatch.#defGaps = haystack.Number.zero();
    ModbusDispatch.#defMax = sys.ObjUtil.coerce(haystack.Number.makeInt(100), haystack.Number.type$);
    return;
  }

}

class TcpTest extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TcpTest.type$; }

  main() {
    const this$ = this;
    let args = sys.Env.cur().args();
    if (sys.ObjUtil.compareLT(args.size(), 3)) {
      this.usage();
      return 1;
    }
    ;
    let iparg = args.get(0);
    let port = sys.ObjUtil.coerce(502, sys.Int.type$.toNullable());
    if (sys.Str.contains(iparg, ":")) {
      (port = sys.Str.toInt(sys.Str.getRange(iparg, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sys.Str.index(iparg, ":"), sys.Int.type$), 1), -1)), 10, false));
      if (port == null) {
        this.fatal(sys.Str.plus("Invalid port ", iparg));
      }
      ;
      (iparg = sys.Str.getRange(iparg, sys.Range.make(0, sys.ObjUtil.coerce(sys.Str.index(iparg, ":"), sys.Int.type$), true)));
    }
    ;
    let ip = inet.IpAddr.make(sys.ObjUtil.coerce(iparg, sys.Str.type$));
    let unit = 1;
    let func = 3;
    let start = 0;
    let len = 1;
    let i = 1;
    let x = args.getSafe(1);
    if (sys.ObjUtil.equals(x, "--unit")) {
      let v = sys.Int.fromStr(sys.ObjUtil.coerce(args.getSafe(2), sys.Str.type$), 10, false);
      if (v == null) {
        this.fatal(sys.Str.plus("invalid unit id: ", sys.ObjUtil.coerce(v, sys.Obj.type$.toNullable())));
      }
      ;
      (unit = sys.ObjUtil.coerce(v, sys.Int.type$));
      i = sys.Int.plus(i, 2);
    }
    ;
    let f = sys.Int.fromStr(sys.ObjUtil.coerce(((this$) => { let $_u13 = args.getSafe(((this$) => { let $_u14 = i;i = sys.Int.increment(i); return $_u14; })(this$)); if ($_u13 != null) return $_u13; return ""; })(this), sys.Str.type$), 10, false);
    if (f == null) {
      this.fatal(sys.Str.plus("invalid func code: ", sys.ObjUtil.coerce(f, sys.Obj.type$.toNullable())));
    }
    ;
    (func = sys.ObjUtil.coerce(f, sys.Int.type$));
    let s = sys.Int.fromStr(sys.ObjUtil.coerce(((this$) => { let $_u15 = args.getSafe(((this$) => { let $_u16 = i;i = sys.Int.increment(i); return $_u16; })(this$)); if ($_u15 != null) return $_u15; return ""; })(this), sys.Str.type$), 10, false);
    if (s == null) {
      this.fatal(sys.Str.plus("invalid start address: ", sys.ObjUtil.coerce(s, sys.Obj.type$.toNullable())));
    }
    ;
    (start = sys.ObjUtil.coerce(s, sys.Int.type$));
    let l = args.getSafe(i);
    if (l != null) {
      (l = sys.ObjUtil.coerce(sys.Int.fromStr(sys.ObjUtil.coerce(l, sys.Str.type$), 10, false), sys.Obj.type$.toNullable()));
      if (l == null) {
        this.fatal(sys.Str.plus("invalid length: ", l));
      }
      ;
      (len = sys.ObjUtil.coerce(l, sys.Int.type$));
    }
    ;
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("> req [", ip), ":"), sys.ObjUtil.coerce(port, sys.Obj.type$.toNullable())), " unit="), sys.ObjUtil.coerce(unit, sys.Obj.type$.toNullable())), "] func="), sys.ObjUtil.coerce(func, sys.Obj.type$.toNullable())), " @ "), sys.ObjUtil.coerce(start, sys.Obj.type$.toNullable())), " ["), sys.ObjUtil.coerce(len, sys.Obj.type$.toNullable())), "]"));
    let tx = sys.ObjUtil.coerce(sys.ObjUtil.with(ModbusTcpTransport.make(sys.ObjUtil.coerce(ip, inet.IpAddr.type$), port, sys.Duration.fromStr("10sec")), (it) => {
      return;
    }), ModbusTcpTransport.type$);
    let master = ModbusMaster.make(tx);
    try {
      master.open();
      let res = null;
      let $_u17 = func;
      if (sys.ObjUtil.equals($_u17, 3)) {
        (res = master.readHoldingRegs(unit, start, len));
      }
      else {
        this.fatal(sys.Str.plus("Unsupported func ", sys.ObjUtil.coerce(func, sys.Obj.type$.toNullable())));
      }
      ;
      sys.ObjUtil.echo(sys.Str.plus("< ", res));
    }
    finally {
      master.close();
    }
    ;
    return;
  }

  fatal(msg) {
    sys.Env.cur().err().printLine(sys.Str.plus("ERR: ", msg));
    sys.Env.cur().exit(1);
    return;
  }

  usage() {
    sys.ObjUtil.echo("Modbus TcpTest utility\nusage:\n  fan modbusExt::TcpTest <ip>[:<port>] [--unit <id>] <func> <start> [len]\n\n  ip      ip address of slave device\n  port    port numbrer of slave device (default=502)\n  func    function code to request\n  start   raw start address to request (ex: 1, not 40001)\n  len     number of registers to read (default=1)\n\n  --unit  unit id of slave device (default to 1)\n  ");
    return;
  }

  static make() {
    const $self = new TcpTest();
    TcpTest.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class ModbusFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusFuncs.type$; }

  static cx() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static modbusPing(conn) {
    return hxConn.ConnFwFuncs.connPing(conn);
  }

  static modbusLearn(conn,arg) {
    if (arg === undefined) arg = null;
    return sys.ObjUtil.coerce(hxConn.ConnFwFuncs.connLearn(conn, arg).get(sys.Duration.fromStr("1min")), haystack.Grid.type$);
  }

  static modbusSyncCur(points) {
    return hxConn.ConnFwFuncs.connSyncCur(points);
  }

  static modbusRead(conn,regs) {
    let list = ((this$) => { let $_u18 = sys.ObjUtil.as(regs, sys.Type.find("sys::Str[]")); if ($_u18 != null) return $_u18; return sys.List.make(sys.Str.type$, [sys.ObjUtil.coerce(regs, sys.Str.type$)]); })(this);
    return ModbusLib.cur().read(conn, sys.ObjUtil.coerce(list, sys.Type.find("sys::Str[]")));
  }

  static modbusWrite(conn,reg,val) {
    ModbusLib.cur().write(conn, reg, val);
    return;
  }

  static modbusRegMap(name) {
    const this$ = this;
    let f = ModbusFuncs.regMapDir(ModbusFuncs.cx()).plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", name), ".csv")));
    if (!f.exists()) {
      throw sys.IOErr.make(sys.Str.plus("Register map not found: ", name));
    }
    ;
    let in$ = util.CsvInStream.make(f.in());
    let gb = haystack.GridBuilder.make();
    gb.addColNames(sys.ObjUtil.coerce(in$.readRow(), sys.Type.find("sys::Str[]")));
    in$.eachRow((r) => {
      gb.addRow(r);
      return;
    });
    in$.close();
    return gb.toGrid();
  }

  static modbusRegMaps() {
    const this$ = this;
    let gb = haystack.GridBuilder.make();
    gb.addColNames(sys.List.make(sys.Str.type$, ["name", "uri", "src"]));
    ModbusFuncs.regMapDir(ModbusFuncs.cx()).listFiles().each((f) => {
      if (sys.ObjUtil.compareNE(f.ext(), "csv")) {
        return;
      }
      ;
      let uri = f.uri().relTo(ModbusFuncs.cx().rt().dir().uri());
      gb.addRow(sys.List.make(sys.Obj.type$, [f.basename(), uri, f.readAllStr()]));
      return;
    });
    return gb.toGrid().sort((a,b) => {
      return sys.Str.localeCompare(sys.ObjUtil.toStr(a.trap("name", sys.List.make(sys.Obj.type$.toNullable(), []))), sys.ObjUtil.toStr(b.trap("name", sys.List.make(sys.Obj.type$.toNullable(), []))));
    });
  }

  static modbusRegMapList() {
    return ModbusFuncs.modbusRegMaps();
  }

  static modbusRegMapSave(name,src) {
    let file = ModbusFuncs.regMapDir(ModbusFuncs.cx()).plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", name), ".csv")));
    file.out().print(src).flush().close();
    return;
  }

  static modbusRegMapMove(oldName,newName) {
    let file = ModbusFuncs.regMapDir(ModbusFuncs.cx()).plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", oldName), ".csv")));
    file.rename(sys.Str.plus(sys.Str.plus("", newName), ".csv"));
    return;
  }

  static modbusRegMapDelete(names) {
    const this$ = this;
    let list = ((this$) => { let $_u19 = sys.ObjUtil.as(names, sys.Type.find("sys::Str[]")); if ($_u19 != null) return $_u19; return sys.List.make(sys.Str.type$, [sys.ObjUtil.toStr(names)]); })(this);
    list.each((name) => {
      let file = ModbusFuncs.regMapDir(ModbusFuncs.cx()).plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", name), ".csv")));
      if (file.exists()) {
        file.delete();
      }
      ;
      return;
    });
    return;
  }

  static regMapDir(cx) {
    let dir = cx.rt().dir().plus(sys.Uri.fromStr("data/modbus/"));
    if (!dir.exists()) {
      dir.create();
    }
    ;
    return dir;
  }

  static make() {
    const $self = new ModbusFuncs();
    ModbusFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class ModbusRegMap extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusRegMap.type$; }

  static #fileCache = undefined;

  static fileCache() {
    if (ModbusRegMap.#fileCache === undefined) {
      ModbusRegMap.static$init();
      if (ModbusRegMap.#fileCache === undefined) ModbusRegMap.#fileCache = null;
    }
    return ModbusRegMap.#fileCache;
  }

  #regs = null;

  regs() { return this.#regs; }

  __regs(it) { if (it === undefined) return this.#regs; else this.#regs = it; }

  #file = null;

  // private field reflection only
  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #modified = null;

  // private field reflection only
  __modified(it) { if (it === undefined) return this.#modified; else this.#modified = it; }

  #byName = null;

  // private field reflection only
  __byName(it) { if (it === undefined) return this.#byName; else this.#byName = it; }

  static fromConn(rt,rec) {
    let uri = ((this$) => { let $_u20 = sys.ObjUtil.as(rec.get("modbusRegMapUri"), sys.Uri.type$); if ($_u20 != null) return $_u20; throw haystack.FaultErr.make("Missing modbusRegMapUri tag"); })(this);
    let file = ModbusRegMap.uriToFile(rt, sys.ObjUtil.coerce(uri, sys.Uri.type$));
    if (!file.exists()) {
      throw haystack.FaultErr.make(sys.Str.plus("File not found for modbusRegMapUri: ", uri));
    }
    ;
    return ModbusRegMap.fromFile(file);
  }

  static uriToFile(rt,uri) {
    if (sys.ObjUtil.equals(uri.scheme(), "fan")) {
      return sys.ObjUtil.coerce(uri.get(), sys.File.type$);
    }
    ;
    if (!uri.isPathAbs()) {
      return rt.dir().plus(sys.Str.toUri(sys.Str.plus("", uri)));
    }
    ;
    throw haystack.FaultErr.make(sys.Str.plus("Unsupported modbusRegMapUri: ", uri));
  }

  static fromFile(file) {
    let cached = sys.ObjUtil.coerce(ModbusRegMap.fileCache().val(), sys.Type.find("[sys::Uri:hxModbus::ModbusRegMap]")).get(file.uri());
    if ((cached != null && sys.ObjUtil.equals(cached.#modified, file.modified()))) {
      return sys.ObjUtil.coerce(cached, ModbusRegMap.type$);
    }
    ;
    let map = ModbusRegMap.parseFile(file);
    ModbusRegMap.fileCache().val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(ModbusRegMap.fileCache().val(), sys.Type.find("[sys::Uri:hxModbus::ModbusRegMap]")).dup().set(file.uri(), map)), sys.Type.find("[sys::Uri:hxModbus::ModbusRegMap]")));
    return map;
  }

  static parseFile(file) {
    const this$ = this;
    let registers = sys.List.make(ModbusReg.type$);
    let rows = util.CsvInStream.make(file.in()).readAllRows();
    let headers = rows.first();
    if (headers.isEmpty()) {
      throw sys.IOErr.make("CSV file has no rows");
    }
    ;
    let colName = ModbusRegMap.csvColIndex(sys.ObjUtil.coerce(headers, sys.Type.find("sys::Str[]")), "name");
    let colAddr = ModbusRegMap.csvColIndex(sys.ObjUtil.coerce(headers, sys.Type.find("sys::Str[]")), "addr");
    let colData = ModbusRegMap.csvColIndex(sys.ObjUtil.coerce(headers, sys.Type.find("sys::Str[]")), "data");
    let colRw = ModbusRegMap.csvColIndex(sys.ObjUtil.coerce(headers, sys.Type.find("sys::Str[]")), "rw");
    let colScale = ModbusRegMap.csvColIndex(sys.ObjUtil.coerce(headers, sys.Type.find("sys::Str[]")), "scale", false);
    let colDis = ModbusRegMap.csvColIndex(sys.ObjUtil.coerce(headers, sys.Type.find("sys::Str[]")), "dis", false);
    let colUnits = ModbusRegMap.csvColIndex(sys.ObjUtil.coerce(headers, sys.Type.find("sys::Str[]")), "unit", false);
    let colTags = ModbusRegMap.csvColIndex(sys.ObjUtil.coerce(headers, sys.Type.find("sys::Str[]")), "tags", false);
    rows.eachRange(sys.Range.make(1, -1), (row,i) => {
      try {
        registers.add(ModbusReg.make((it) => {
          it.__name(row.get(colName));
          it.__addr(sys.ObjUtil.coerce(ModbusAddr.fromStr(row.get(colAddr)), ModbusAddr.type$));
          it.__data(sys.ObjUtil.coerce(ModbusData.fromStr(row.get(colData)), ModbusData.type$));
          it.__readable(sys.Str.contains(row.get(colRw), "r"));
          it.__writable(sys.Str.contains(row.get(colRw), "w"));
          if (sys.ObjUtil.compareGE(colScale, 0)) {
            it.__scale(ModbusScale.fromStr(row.get(colScale), false));
          }
          ;
          if (sys.ObjUtil.compareGE(colDis, 0)) {
            it.__dis(row.get(colDis));
          }
          ;
          if (sys.ObjUtil.compareGE(colUnits, 0)) {
            it.__unit(sys.Unit.fromStr(row.get(colUnits), false));
          }
          ;
          if (sys.ObjUtil.compareGE(colTags, 0)) {
            it.__tags(haystack.ZincReader.make(sys.Str.in(row.get(colTags))).readTags());
          }
          ;
          return;
        }));
      }
      catch ($_u21) {
        $_u21 = sys.Err.make($_u21);
        if ($_u21 instanceof sys.Err) {
          let e = $_u21;
          ;
          throw sys.IOErr.make(sys.Str.plus(sys.Str.plus("Invalid register row [line ", sys.ObjUtil.coerce(sys.Int.plus(i, 1), sys.Obj.type$.toNullable())), "]"), e);
        }
        else {
          throw $_u21;
        }
      }
      ;
      return;
    });
    return ModbusRegMap.make(file, registers);
  }

  static csvColIndex(row,name,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let index = row.findIndex((cell) => {
      return sys.ObjUtil.equals(cell, name);
    });
    if (index != null) {
      return sys.ObjUtil.coerce(index, sys.Int.type$);
    }
    ;
    if (checked) {
      throw sys.IOErr.make(sys.Str.plus("CSV missing required column ", sys.Str.toCode(name)));
    }
    ;
    return -1;
  }

  static make(file,regs) {
    const $self = new ModbusRegMap();
    ModbusRegMap.make$($self,file,regs);
    return $self;
  }

  static make$($self,file,regs) {
    const this$ = $self;
    $self.#file = file;
    $self.#modified = sys.ObjUtil.coerce(file.modified(), sys.DateTime.type$);
    $self.#regs = sys.ObjUtil.coerce(((this$) => { let $_u22 = regs; if ($_u22 == null) return null; return sys.ObjUtil.toImmutable(regs); })($self), sys.Type.find("hxModbus::ModbusReg[]"));
    $self.#byName = sys.ObjUtil.coerce(((this$) => { let $_u23 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hxModbus::ModbusReg")).addList(regs, (r) => {
      return r.name();
    }); if ($_u23 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hxModbus::ModbusReg")).addList(regs, (r) => {
      return r.name();
    })); })($self), sys.Type.find("[sys::Str:hxModbus::ModbusReg]"));
    return;
  }

  reg(name,checked) {
    if (checked === undefined) checked = true;
    let reg = this.#byName.get(name);
    if (reg != null) {
      return reg;
    }
    ;
    if (checked) {
      throw haystack.UnknownNameErr.make(sys.Str.plus("ModbusReg: ", name));
    }
    ;
    return null;
  }

  static static$init() {
    ModbusRegMap.#fileCache = concurrent.AtomicRef.make(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Uri"), sys.Type.find("hxModbus::ModbusRegMap"))), sys.Type.find("[sys::Uri:hxModbus::ModbusRegMap]")));
    return;
  }

}

class ModbusBlock extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#valsRef = concurrent.AtomicRef.make(null);
    return;
  }

  typeof() { return ModbusBlock.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #regs = null;

  regs() { return this.#regs; }

  __regs(it) { if (it === undefined) return this.#regs; else this.#regs = it; }

  #valsRef = null;

  // private field reflection only
  __valsRef(it) { if (it === undefined) return this.#valsRef; else this.#valsRef = it; }

  static optimize(regs,gap,max) {
    if (gap === undefined) gap = 0;
    if (max === undefined) max = 100;
    const this$ = this;
    if (sys.ObjUtil.compareLT(gap, 0)) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Invalid gap: ", sys.ObjUtil.coerce(gap, sys.Obj.type$.toNullable())), " (must be >= 0)"));
    }
    ;
    if (sys.ObjUtil.compareLT(max, 1)) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Invalid max: ", sys.ObjUtil.coerce(max, sys.Obj.type$.toNullable())), " (must be >= 1)"));
    }
    ;
    let blocks = sys.List.make(ModbusBlock.type$);
    let acc = sys.List.make(ModbusReg.type$);
    (regs = regs.sort((a,b) => {
      return sys.ObjUtil.compare(a.addr().qnum(), b.addr().qnum());
    }));
    regs.each((r) => {
      if (acc.isEmpty()) {
        acc.add(r);
      }
      else {
        let first = acc.first().addr().qnum();
        let cur = r.addr().qnum();
        let curt = r.addr().type();
        let last = sys.Int.plus(acc.last().addr().qnum(), acc.last().data().size());
        let lastt = acc.last().addr().type();
        if ((sys.ObjUtil.compareNE(curt, lastt) || sys.ObjUtil.compareGT(sys.Int.minus(cur, last), gap) || sys.ObjUtil.compareGE(sys.Int.minus(cur, first), max))) {
          blocks.add(ModbusBlock.make(acc));
          acc.clear();
        }
        ;
        acc.add(r);
      }
      ;
      return;
    });
    if (sys.ObjUtil.compareGT(acc.size(), 0)) {
      blocks.add(ModbusBlock.make(acc));
    }
    ;
    return blocks;
  }

  static make(regs) {
    const $self = new ModbusBlock();
    ModbusBlock.make$($self,regs);
    return $self;
  }

  static make$($self,regs) {
    const this$ = $self;
    ;
    if (sys.ObjUtil.equals(regs.size(), 0)) {
      $self.#type = ModbusAddrType.holdingReg();
      $self.#regs = sys.ObjUtil.coerce(((this$) => { let $_u24 = regs; if ($_u24 == null) return null; return sys.ObjUtil.toImmutable(regs); })($self), sys.Type.find("hxModbus::ModbusReg[]"));
    }
    else {
      $self.#type = regs.first().addr().type();
      if (regs.any((r) => {
        return sys.ObjUtil.compareNE(this$.#type, r.addr().type());
      })) {
        throw sys.ArgErr.make("Addr types do not match");
      }
      ;
      $self.#regs = sys.ObjUtil.coerce(((this$) => { let $_u25 = regs.sort((a,b) => {
        return sys.ObjUtil.compare(a.addr().num(), b.addr().num());
      }); if ($_u25 == null) return null; return sys.ObjUtil.toImmutable(regs.sort((a,b) => {
        return sys.ObjUtil.compare(a.addr().num(), b.addr().num());
      })); })($self), sys.Type.find("hxModbus::ModbusReg[]"));
    }
    ;
    return;
  }

  start() {
    return this.#regs.first().addr().num();
  }

  size() {
    if (sys.ObjUtil.equals(this.#regs.size(), 0)) {
      return 0;
    }
    ;
    if (sys.ObjUtil.equals(this.#regs.size(), 1)) {
      return this.#regs.first().data().size();
    }
    ;
    return sys.Int.minus(sys.Int.plus(this.#regs.last().addr().num(), this.#regs.last().data().size()), this.start());
  }

  toStr() {
    let regs = this.#regs.join("\n");
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("block: ", this.#type), " start="), sys.ObjUtil.coerce(this.start(), sys.Obj.type$.toNullable())), " size="), sys.ObjUtil.coerce(this.size(), sys.Obj.type$.toNullable())), "\n"), regs);
  }

  vals() {
    return sys.ObjUtil.coerce(((this$) => { let $_u26 = this$.#valsRef.val(); if ($_u26 != null) return $_u26; throw sys.Err.make("Block not resolved"); })(this), sys.Type.find("sys::Obj[]"));
  }

  resolve(raw) {
    const this$ = this;
    if (this.#type.isBool()) {
      let vals = sys.List.make(sys.Bool.type$);
      this.#regs.each((r) => {
        let off = sys.Int.minus(r.addr().num(), this$.start());
        vals.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(raw.get(off), sys.Bool.type$), sys.Obj.type$.toNullable()));
        return;
      });
      this.#valsRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(vals), sys.Type.find("sys::Bool[]")));
      return;
    }
    else {
      let vals = sys.List.make(sys.Obj.type$);
      this.#regs.each((r) => {
        try {
          let off = sys.Int.minus(r.addr().num(), this$.start());
          let slice = raw.getRange(sys.Range.make(off, sys.Int.plus(off, r.data().size()), true));
          let num = r.data().fromRegs(sys.ObjUtil.coerce(slice, sys.Type.find("sys::Int[]")), r.unit());
          let sf = ((this$) => { let $_u27=r.scale(); return ($_u27==null) ? null : $_u27.factor(); })(this$);
          if (sf != null) {
            (num = r.scale().compute(sys.ObjUtil.coerce(num, haystack.Number.type$), sf));
          }
          ;
          vals.add(num);
        }
        catch ($_u28) {
          $_u28 = sys.Err.make($_u28);
          if ($_u28 instanceof sys.Err) {
            let err = $_u28;
            ;
            vals.add(err);
          }
          else {
            throw $_u28;
          }
        }
        ;
        return;
      });
      this.#valsRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(vals), sys.Type.find("sys::Obj[]")));
    }
    ;
    return;
  }

  resolveErr(err) {
    const this$ = this;
    let vals = sys.List.make(sys.Obj.type$.toNullable());
    this.#regs.each((r,i) => {
      vals.add(err);
      return;
    });
    this.#valsRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(vals), sys.Type.find("sys::Obj?[]")));
    return;
  }

}

class ModbusLink extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#_touched = concurrent.AtomicInt.make(0);
    return;
  }

  typeof() { return ModbusLink.type$; }

  #_touched = null;

  // private field reflection only
  ___touched(it) { if (it === undefined) return this.#_touched; else this.#_touched = it; }

  #lib = null;

  // private field reflection only
  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #uri = null;

  // private field reflection only
  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #name = null;

  // private field reflection only
  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #actor = null;

  // private field reflection only
  __actor(it) { if (it === undefined) return this.#actor; else this.#actor = it; }

  static get(uri) {
    return ModbusLinkMgr.cur().open(uri);
  }

  static make(pool,lib,uri) {
    const $self = new ModbusLink();
    ModbusLink.make$($self,pool,lib,uri);
    return $self;
  }

  static make$($self,pool,lib,uri) {
    const this$ = $self;
    ;
    $self.#lib = lib;
    $self.#uri = uri;
    $self.#name = sys.Str.plus("ModbusLink-", uri);
    $self.#actor = concurrent.Actor.make(pool, (m) => {
      return this$.actorReceive(sys.ObjUtil.coerce(m, hx.HxMsg.type$));
    });
    return;
  }

  touched() {
    return this.#_touched.val();
  }

  ping(dev) {
    let ping = ((this$) => { let $_u29 = dev.regMap().reg("ping", false); if ($_u29 != null) return $_u29; throw haystack.FaultErr.make("Missing ping register"); })(this);
    let val = this.read(dev, sys.ObjUtil.coerce(ping, ModbusReg.type$));
    if (sys.ObjUtil.is(val, sys.Err.type$)) {
      throw sys.ObjUtil.coerce(val, sys.Err.type$);
    }
    ;
    return;
  }

  read(dev,reg) {
    let block = ModbusBlock.make(sys.List.make(ModbusReg.type$, [reg]));
    this.readBlock(dev, block);
    return sys.ObjUtil.coerce(block.vals().first(), sys.Obj.type$);
  }

  readBlock(dev,block) {
    this.#actor.send(hx.HxMsg.make2("read", dev, block)).get(dev.readTimeout());
    return;
  }

  write(dev,reg,val) {
    this.#actor.send(hx.HxMsg.make3("write", dev, reg, val)).get(dev.writeTimeout());
    return;
  }

  close() {
    this.#actor.send(hx.HxMsg.make0("close")).get();
    return;
  }

  actorReceive(m) {
    this.#_touched.val(sys.Duration.nowTicks());
    let $_u30 = m.id();
    if (sys.ObjUtil.equals($_u30, "read")) {
      return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this._read(this._open(sys.ObjUtil.coerce(m.a(), ModbusDev.type$)), sys.ObjUtil.coerce(m.a(), ModbusDev.type$), sys.ObjUtil.coerce(m.b(), ModbusBlock.type$))), sys.Obj.type$.toNullable());
    }
    else if (sys.ObjUtil.equals($_u30, "write")) {
      return this._write(this._open(sys.ObjUtil.coerce(m.a(), ModbusDev.type$)), sys.ObjUtil.coerce(m.a(), ModbusDev.type$), sys.ObjUtil.coerce(m.b(), ModbusReg.type$), sys.ObjUtil.coerce(m.c(), sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u30, "close")) {
      return this._close(sys.ObjUtil.coerce(concurrent.Actor.locals().get("m"), ModbusMaster.type$.toNullable()));
    }
    else {
      return null;
    }
    ;
  }

  _open(dev) {
    let master = sys.ObjUtil.coerce(concurrent.Actor.locals().get("m"), ModbusMaster.type$.toNullable());
    if (master == null) {
      let tx = null;
      let $_u31 = this.#uri.scheme();
      if (sys.ObjUtil.equals($_u31, "modbus-tcp")) {
        (tx = ModbusTcpTransport.make(sys.ObjUtil.coerce(inet.IpAddr.make(sys.ObjUtil.coerce(this.#uri.host(), sys.Str.type$)), inet.IpAddr.type$), this.#uri.port(), dev.timeout()));
      }
      else if (sys.ObjUtil.equals($_u31, "modbus-rtutcp")) {
        (tx = ModbusRtuTcpTransport.make(sys.ObjUtil.coerce(inet.IpAddr.make(sys.ObjUtil.coerce(this.#uri.host(), sys.Str.type$)), inet.IpAddr.type$), this.#uri.port(), dev.timeout()));
      }
      else if (sys.ObjUtil.equals($_u31, "modbus-rtu")) {
        let serial = sys.ObjUtil.as(this.#lib.rt().lib("platformSerial", false), hxPlatformSerial.PlatformSerialLib.type$);
        if (serial == null) {
          throw haystack.FaultErr.make("RTU not supported");
        }
        ;
        let config = hxPlatformSerial.SerialConfig.fromStr(sys.ObjUtil.coerce(this.#uri.host(), sys.Str.type$));
        (tx = ModbusRtuTransport.make(serial.open(this.#lib.rt(), this.#lib.rec(), sys.ObjUtil.coerce(config, hxPlatformSerial.SerialConfig.type$))));
      }
      else {
        throw haystack.FaultErr.make(sys.Str.plus("Invalid scheme: ", this.#uri.scheme()));
      }
      ;
      tx.log(this.#lib.log());
      concurrent.Actor.locals().set("m", (master = ModbusMaster.make(sys.ObjUtil.coerce(tx, ModbusTransport.type$))));
    }
    ;
    master.open();
    return sys.ObjUtil.coerce(master, ModbusMaster.type$);
  }

  _close(master) {
    ((this$) => { let $_u32 = master; if ($_u32 == null) return null; return master.close(); })(this);
    concurrent.Actor.locals().remove("m");
    return null;
  }

  _read(master,dev,block) {
    const this$ = this;
    try {
      master.withTrace(sys.ObjUtil.coerce(dev.log(), sys.Log.type$), (it) => {
        let start = sys.Int.minus(block.start(), 1);
        let size = block.size();
        let raw = null;
        let $_u33 = block.type();
        if (sys.ObjUtil.equals($_u33, ModbusAddrType.coil())) {
          (raw = master.readCoils(dev.slave(), start, size));
        }
        else if (sys.ObjUtil.equals($_u33, ModbusAddrType.discreteInput())) {
          (raw = master.readDiscreteInputs(dev.slave(), start, size));
        }
        else if (sys.ObjUtil.equals($_u33, ModbusAddrType.inputReg())) {
          (raw = master.readInputRegs(dev.slave(), start, size));
        }
        else if (sys.ObjUtil.equals($_u33, ModbusAddrType.holdingReg())) {
          (raw = master.readHoldingRegs(dev.slave(), start, size));
        }
        ;
        block.resolve(sys.ObjUtil.coerce(raw, sys.Type.find("sys::Obj[]")));
        return;
      });
    }
    catch ($_u34) {
      $_u34 = sys.Err.make($_u34);
      if ($_u34 instanceof sys.IOErr) {
        let err = $_u34;
        ;
        let sb = sys.StrBuf.make().add("Low-level IO error\n").add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Device: ", dev.uri()), " [slave="), sys.ObjUtil.coerce(dev.slave(), sys.Obj.type$.toNullable())), "]\n")).add(sys.Str.plus(sys.Str.plus("Block: [type=", block.type()), "]\n")).add("Registers:\n");
        block.regs().each((reg) => {
          let rw = ((this$) => { if (reg.readable()) return "r"; return ""; })(this$);
          if (reg.writable()) {
            (rw = sys.Str.plus(rw, "w"));
          }
          ;
          sb.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", reg.name()), " "), reg.dis()), " [addr="), reg.addr()), "] [data="), reg.data()), "] [size="), sys.ObjUtil.coerce(reg.size(), sys.Obj.type$.toNullable())), "] ["), rw), "]\n"));
          return;
        });
        dev.log().err(sb.toStr(), err);
        throw sys.IOErr.make(sb.toStr(), err);
      }
      else if ($_u34 instanceof sys.Err) {
        let err = $_u34;
        ;
        let ex = sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", err.msg()), " ["), block.regs().first().addr()), " count="), sys.ObjUtil.coerce(block.size(), sys.Obj.type$.toNullable())), "]"), err);
        block.resolveErr(ex);
      }
      else {
        throw $_u34;
      }
    }
    ;
    return null;
  }

  _write(master,dev,reg,val) {
    const this$ = this;
    if (!reg.writable()) {
      throw sys.ArgErr.make("Register is not writable");
    }
    ;
    let type = reg.addr().type();
    let addr = sys.Int.minus(reg.addr().num(), 1);
    master.withTrace(sys.ObjUtil.coerce(dev.log(), sys.Log.type$), (it) => {
      if (sys.ObjUtil.equals(type, ModbusAddrType.coil())) {
        master.writeCoil(dev.slave(), addr, sys.ObjUtil.coerce(val, sys.Bool.type$));
      }
      else {
        let sf = ((this$) => { let $_u36=reg.scale(); return ($_u36==null) ? null : $_u36.factor(); })(this$);
        if (sf != null) {
          (val = reg.scale().inverse(sys.ObjUtil.coerce(val, haystack.Number.type$), sf));
        }
        ;
        let regs = reg.data().toRegs(val);
        if (sys.ObjUtil.is(reg.data(), ModbusBitData.type$)) {
          let bit = sys.ObjUtil.coerce(reg.data(), ModbusBitData.type$);
          let cur = master.readHoldingRegs(dev.slave(), addr, reg.data().size()).first();
          regs.set(0, sys.ObjUtil.coerce(((this$) => { if (sys.ObjUtil.equals(val, true)) return sys.Int.or(sys.ObjUtil.coerce(cur, sys.Int.type$), bit.mask()); return sys.Int.and(sys.ObjUtil.coerce(cur, sys.Int.type$), sys.Int.not(bit.mask())); })(this$), sys.Obj.type$.toNullable()));
        }
        ;
        if (dev.forceWriteMultiple()) {
          master._writeHoldingRegs(dev.slave(), addr, regs);
        }
        else {
          master.writeHoldingRegs(dev.slave(), addr, regs);
        }
        ;
      }
      ;
      return;
    });
    return null;
  }

}

class ModbusLinkMgr extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#poll = hx.HxMsg.make0("poll");
    this.#pollFreq = sys.Duration.fromStr("1min");
    this.#staleTime = 60000000000;
    return;
  }

  typeof() { return ModbusLinkMgr.type$; }

  static #curRef = undefined;

  static curRef() {
    if (ModbusLinkMgr.#curRef === undefined) {
      ModbusLinkMgr.static$init();
      if (ModbusLinkMgr.#curRef === undefined) ModbusLinkMgr.#curRef = null;
    }
    return ModbusLinkMgr.#curRef;
  }

  #poll = null;

  // private field reflection only
  __poll(it) { if (it === undefined) return this.#poll; else this.#poll = it; }

  #pollFreq = null;

  // private field reflection only
  __pollFreq(it) { if (it === undefined) return this.#pollFreq; else this.#pollFreq = it; }

  #staleTime = 0;

  // private field reflection only
  __staleTime(it) { if (it === undefined) return this.#staleTime; else this.#staleTime = it; }

  #lib = null;

  // private field reflection only
  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #pool = null;

  // private field reflection only
  __pool(it) { if (it === undefined) return this.#pool; else this.#pool = it; }

  #actor = null;

  // private field reflection only
  __actor(it) { if (it === undefined) return this.#actor; else this.#actor = it; }

  static init(lib) {
    if (ModbusLinkMgr.curRef().val() == null) {
      ModbusLinkMgr.curRef().val(ModbusLinkMgr.make(lib));
    }
    ;
    return;
  }

  static stop() {
    let mgr = sys.ObjUtil.as(ModbusLinkMgr.curRef().val(), ModbusLinkMgr.type$);
    if (mgr == null) {
      return;
    }
    ;
    return;
  }

  static cur() {
    return sys.ObjUtil.coerce(ModbusLinkMgr.curRef().val(), ModbusLinkMgr.type$);
  }

  static make(lib) {
    const $self = new ModbusLinkMgr();
    ModbusLinkMgr.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    const this$ = $self;
    ;
    $self.#lib = lib;
    $self.#pool = concurrent.ActorPool.make((it) => {
      it.__name("ModbusLink");
      return;
    });
    $self.#actor = concurrent.Actor.make($self.#pool, (m) => {
      return this$.actorReceive(sys.ObjUtil.coerce(m, hx.HxMsg.type$));
    });
    $self.#actor.sendLater($self.#pollFreq, $self.#poll);
    return;
  }

  open(uri) {
    return sys.ObjUtil.coerce(this.#actor.send(hx.HxMsg.make1("open", uri)).get(sys.Duration.fromStr("5sec")), ModbusLink.type$);
  }

  actorReceive(m) {
    let map = sys.ObjUtil.coerce(concurrent.Actor.locals().get("m"), sys.Type.find("[sys::Uri:hxModbus::ModbusLink]?"));
    if (map == null) {
      concurrent.Actor.locals().set("m", (map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Uri"), sys.Type.find("hxModbus::ModbusLink"))));
    }
    ;
    let $_u38 = m.id();
    if (sys.ObjUtil.equals($_u38, "open")) {
      let uri = sys.ObjUtil.coerce(m.a(), sys.Uri.type$);
      let link = map.get(uri);
      if (link == null) {
        map.set(uri, sys.ObjUtil.coerce((link = ModbusLink.make(this.#pool, this.#lib, uri)), ModbusLink.type$));
      }
      ;
      return link;
    }
    else if (sys.ObjUtil.equals($_u38, "poll")) {
      try {
        this._check(sys.ObjUtil.coerce(map, sys.Type.find("[sys::Uri:hxModbus::ModbusLink]")));
      }
      finally {
        this.#actor.sendLater(this.#pollFreq, this.#poll);
      }
      ;
      return null;
    }
    else {
      return null;
    }
    ;
  }

  _check(map) {
    const this$ = this;
    let now = sys.Duration.nowTicks();
    map.keys().each((k) => {
      let link = map.get(k);
      let diff = sys.Int.minus(now, link.touched());
      if (sys.ObjUtil.compareGE(diff, this$.#staleTime)) {
        link.close();
        map.remove(k);
      }
      ;
      return;
    });
    return;
  }

  static static$init() {
    ModbusLinkMgr.#curRef = concurrent.AtomicRef.make(null);
    return;
  }

}

class ModbusDev extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#forceWriteMultiple = false;
    return;
  }

  typeof() { return ModbusDev.type$; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #slave = 0;

  slave() { return this.#slave; }

  __slave(it) { if (it === undefined) return this.#slave; else this.#slave = it; }

  #regMap = null;

  regMap() { return this.#regMap; }

  __regMap(it) { if (it === undefined) return this.#regMap; else this.#regMap = it; }

  #forceWriteMultiple = false;

  forceWriteMultiple() { return this.#forceWriteMultiple; }

  __forceWriteMultiple(it) { if (it === undefined) return this.#forceWriteMultiple; else this.#forceWriteMultiple = it; }

  #readTimeout = null;

  readTimeout() { return this.#readTimeout; }

  __readTimeout(it) { if (it === undefined) return this.#readTimeout; else this.#readTimeout = it; }

  #writeTimeout = null;

  writeTimeout() { return this.#writeTimeout; }

  __writeTimeout(it) { if (it === undefined) return this.#writeTimeout; else this.#writeTimeout = it; }

  #timeout = null;

  timeout() { return this.#timeout; }

  __timeout(it) { if (it === undefined) return this.#timeout; else this.#timeout = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  static make(f) {
    const $self = new ModbusDev();
    ModbusDev.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ;
    sys.Func.call(f, $self);
    return;
  }

  static fromConn(conn) {
    const this$ = this;
    let rec = conn.rec();
    let uri = rec.get("uri");
    if (uri == null) {
      throw haystack.FaultErr.make("Missing 'uri' tag");
    }
    ;
    if (!sys.ObjUtil.is(uri, sys.Uri.type$)) {
      throw haystack.FaultErr.make("Invalid 'uri' tag - must be an Uri");
    }
    ;
    let slave = rec.get("modbusSlave");
    if (slave == null) {
      throw haystack.FaultErr.make("Missing 'slave' tag");
    }
    ;
    if (!sys.ObjUtil.is(slave, haystack.Number.type$)) {
      throw haystack.FaultErr.make("Invalid 'slave' tag - must be a Number");
    }
    ;
    let regUri = rec.get("modbusRegMapUri");
    if (regUri == null) {
      throw haystack.FaultErr.make("Missing 'modbusRegMapUri' tag");
    }
    ;
    if (!sys.ObjUtil.is(regUri, sys.Uri.type$)) {
      throw haystack.FaultErr.make("Invalid 'modbusRegMapUri' tag - must be an Uri");
    }
    ;
    let fwm = rec.get("modbusForceWriteMultiple") != null;
    return ModbusDev.make((it) => {
      it.#uri = sys.ObjUtil.coerce(uri, sys.Uri.type$);
      it.#slave = sys.ObjUtil.coerce(sys.ObjUtil.trap(slave,"toInt", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$);
      it.#regMap = ModbusDev.loadRegMap(conn.rt(), sys.ObjUtil.coerce(regUri, sys.Uri.type$));
      it.#forceWriteMultiple = fwm;
      it.#readTimeout = it.toDuration(rec, "modbusReadTimeout", conn.timeout());
      it.#writeTimeout = it.toDuration(rec, "modbusWriteTimeout", conn.timeout());
      it.#timeout = conn.timeout();
      it.#log = conn.trace().asLog();
      return;
    });
  }

  static loadRegMap(rt,uri) {
    let file = ModbusRegMap.uriToFile(rt, uri);
    if (!file.exists()) {
      throw haystack.FaultErr.make(sys.Str.plus("File not found for modbusRegMapUri: ", uri));
    }
    ;
    return ModbusRegMap.fromFile(file);
  }

  toDuration(rec,tag,def) {
    let v = rec.get(tag);
    if (v == null) {
      return def;
    }
    ;
    try {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(v, haystack.Number.type$).toDuration(), sys.Duration.type$);
    }
    catch ($_u39) {
      $_u39 = sys.Err.make($_u39);
      if ($_u39 instanceof sys.Err) {
        let err = $_u39;
        ;
        throw haystack.FaultErr.make(sys.Str.plus(sys.Str.plus("Invalid '", tag), "' tag - must be Duration"), err);
      }
      else {
        throw $_u39;
      }
    }
    ;
  }

}

class ModbusReg extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusReg.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  #addr = null;

  addr() { return this.#addr; }

  __addr(it) { if (it === undefined) return this.#addr; else this.#addr = it; }

  #data = null;

  data() { return this.#data; }

  __data(it) { if (it === undefined) return this.#data; else this.#data = it; }

  #size = 0;

  size() { return this.#size; }

  __size(it) { if (it === undefined) return this.#size; else this.#size = it; }

  #readable = false;

  readable() { return this.#readable; }

  __readable(it) { if (it === undefined) return this.#readable; else this.#readable = it; }

  #writable = false;

  writable() { return this.#writable; }

  __writable(it) { if (it === undefined) return this.#writable; else this.#writable = it; }

  #scale = null;

  scale() { return this.#scale; }

  __scale(it) { if (it === undefined) return this.#scale; else this.#scale = it; }

  #unit = null;

  unit() { return this.#unit; }

  __unit(it) { if (it === undefined) return this.#unit; else this.#unit = it; }

  #tags = null;

  tags() { return this.#tags; }

  __tags(it) { if (it === undefined) return this.#tags; else this.#tags = it; }

  static make(f) {
    const $self = new ModbusReg();
    ModbusReg.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    sys.Func.call(f, $self);
    if (!haystack.Etc.isTagName($self.#name)) {
      throw sys.Err.make(sys.Str.plus("Invalid register name: ", $self.#name));
    }
    ;
    if (($self.#dis == null || sys.Str.isEmpty($self.#dis))) {
      $self.#dis = $self.#name;
    }
    ;
    if ($self.#tags == null) {
      $self.#tags = haystack.Etc.emptyDict();
    }
    ;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#name), " ["), this.#dis), "] "), this.#addr), " "), this.#data);
  }

}

class ModbusAddr extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusAddr.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #num = 0;

  num() { return this.#num; }

  __num(it) { if (it === undefined) return this.#num; else this.#num = it; }

  #qnum = 0;

  qnum() { return this.#qnum; }

  __qnum(it) { if (it === undefined) return this.#qnum; else this.#qnum = it; }

  static fromStr(str) {
    if ((sys.ObjUtil.compareNE(sys.Str.size(str), 5) && sys.ObjUtil.compareNE(sys.Str.size(str), 6))) {
      throw sys.ParseErr.make(sys.Str.plus("ModbusAddr wrong size: ", str));
    }
    ;
    let type = ModbusAddrType.fromPrefixChar(sys.Str.get(str, 0));
    let num = ((this$) => { let $_u40 = sys.Str.toInt(sys.Str.getRange(str, sys.Range.make(1, -1)), 10, false); if ($_u40 != null) return $_u40; throw sys.ParseErr.make(sys.Str.plus("ModbusAddr not integer: ", str)); })(this);
    return ModbusAddr.make(sys.ObjUtil.coerce(type, ModbusAddrType.type$), sys.ObjUtil.coerce(num, sys.Int.type$));
  }

  static make(type,num) {
    const $self = new ModbusAddr();
    ModbusAddr.make$($self,type,num);
    return $self;
  }

  static make$($self,type,num) {
    $self.#type = type;
    $self.#num = num;
    $self.#qnum = sys.ObjUtil.coerce(sys.Str.toInt($self.toStr()), sys.Int.type$);
    return;
  }

  toStr() {
    let s = sys.StrBuf.make();
    s.addChar(this.#type.toPrefixChar());
    if (sys.ObjUtil.compareLT(this.#num, 10)) {
      s.addChar(48);
    }
    ;
    if (sys.ObjUtil.compareLT(this.#num, 100)) {
      s.addChar(48);
    }
    ;
    if (sys.ObjUtil.compareLT(this.#num, 1000)) {
      s.addChar(48);
    }
    ;
    s.add(sys.Int.toStr(this.#num));
    return s.toStr();
  }

}

class ModbusAddrType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusAddrType.type$; }

  static coil() { return ModbusAddrType.vals().get(0); }

  static discreteInput() { return ModbusAddrType.vals().get(1); }

  static inputReg() { return ModbusAddrType.vals().get(2); }

  static holdingReg() { return ModbusAddrType.vals().get(3); }

  static #vals = undefined;

  isBool() {
    return (sys.ObjUtil.equals(this, ModbusAddrType.coil()) || sys.ObjUtil.equals(this, ModbusAddrType.discreteInput()));
  }

  isNum() {
    return (sys.ObjUtil.equals(this, ModbusAddrType.inputReg()) || sys.ObjUtil.equals(this, ModbusAddrType.holdingReg()));
  }

  static fromPrefixChar(char) {
    if (sys.ObjUtil.equals(char, 52)) {
      return ModbusAddrType.holdingReg();
    }
    ;
    if (sys.ObjUtil.equals(char, 51)) {
      return ModbusAddrType.inputReg();
    }
    ;
    if (sys.ObjUtil.equals(char, 49)) {
      return ModbusAddrType.discreteInput();
    }
    ;
    if (sys.ObjUtil.equals(char, 48)) {
      return ModbusAddrType.coil();
    }
    ;
    throw sys.ParseErr.make(sys.Str.plus("ModbusAddrType invalid prefix digit: ", sys.Int.toChar(char)));
  }

  toPrefixChar() {
    if (this === ModbusAddrType.holdingReg()) {
      return 52;
    }
    ;
    if (this === ModbusAddrType.inputReg()) {
      return 51;
    }
    ;
    if (this === ModbusAddrType.discreteInput()) {
      return 49;
    }
    ;
    if (this === ModbusAddrType.coil()) {
      return 48;
    }
    ;
    return 63;
  }

  toLocale() {
    let $_u41 = this;
    if (sys.ObjUtil.equals($_u41, ModbusAddrType.coil())) {
      return sys.Str.plus("", ModbusAddrType.type$.pod().locale("coil", "Coil"));
    }
    else if (sys.ObjUtil.equals($_u41, ModbusAddrType.discreteInput())) {
      return sys.Str.plus("", ModbusAddrType.type$.pod().locale("discreteInput", "Discrete Input"));
    }
    else if (sys.ObjUtil.equals($_u41, ModbusAddrType.inputReg())) {
      return sys.Str.plus("", ModbusAddrType.type$.pod().locale("inputReg", "Input Register"));
    }
    else if (sys.ObjUtil.equals($_u41, ModbusAddrType.holdingReg())) {
      return sys.Str.plus("", ModbusAddrType.type$.pod().locale("holdingReg", "Holding Register"));
    }
    else {
      throw sys.ArgErr.make();
    }
    ;
  }

  static make($ordinal,$name) {
    const $self = new ModbusAddrType();
    ModbusAddrType.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(ModbusAddrType.type$, ModbusAddrType.vals(), name$, checked);
  }

  static vals() {
    if (ModbusAddrType.#vals == null) {
      ModbusAddrType.#vals = sys.List.make(ModbusAddrType.type$, [
        ModbusAddrType.make(0, "coil", ),
        ModbusAddrType.make(1, "discreteInput", ),
        ModbusAddrType.make(2, "inputReg", ),
        ModbusAddrType.make(3, "holdingReg", ),
      ]).toImmutable();
    }
    return ModbusAddrType.#vals;
  }

  static static$init() {
    const $_u42 = ModbusAddrType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class ModbusData extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusData.type$; }

  static #map = undefined;

  static map() {
    if (ModbusData.#map === undefined) {
      ModbusData.static$init();
      if (ModbusData.#map === undefined) ModbusData.#map = null;
    }
    return ModbusData.#map;
  }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    let data = ModbusData.map().get(s);
    if (data == null) {
      if (!checked) {
        return null;
      }
      ;
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid data '", s), "'"));
    }
    ;
    return data;
  }

  hash() {
    return sys.Str.hash(this.name());
  }

  equals(that) {
    return sys.ObjUtil.equals(this.name(), ((this$) => { let $_u43 = sys.ObjUtil.as(that, ModbusData.type$); if ($_u43 == null) return null; return sys.ObjUtil.as(that, ModbusData.type$).name(); })(this));
  }

  toStr() {
    return this.name();
  }

  static make() {
    const $self = new ModbusData();
    ModbusData.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    const this$ = this;
    ModbusData.#map = sys.ObjUtil.coerce(((this$) => { let $_u44 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hxModbus::ModbusData")).setList(sys.List.make(ModbusData.type$, [ModbusBitData.make("bit"), ModbusBitData.make("bit:0"), ModbusBitData.make("bit:1"), ModbusBitData.make("bit:2"), ModbusBitData.make("bit:3"), ModbusBitData.make("bit:4"), ModbusBitData.make("bit:5"), ModbusBitData.make("bit:6"), ModbusBitData.make("bit:7"), ModbusBitData.make("bit:8"), ModbusBitData.make("bit:9"), ModbusBitData.make("bit:10"), ModbusBitData.make("bit:11"), ModbusBitData.make("bit:12"), ModbusBitData.make("bit:13"), ModbusBitData.make("bit:14"), ModbusBitData.make("bit:15"), ModbusIntData.make("u1"), ModbusIntData.make("u1le"), ModbusIntData.make("u1leb"), ModbusIntData.make("u1lew"), ModbusIntData.make("u2"), ModbusIntData.make("u2le"), ModbusIntData.make("u2leb"), ModbusIntData.make("u2lew"), ModbusIntData.make("u4"), ModbusIntData.make("u4le"), ModbusIntData.make("u4leb"), ModbusIntData.make("u4lew"), ModbusIntData.make("s1"), ModbusIntData.make("s1le"), ModbusIntData.make("s1leb"), ModbusIntData.make("s1lew"), ModbusIntData.make("s2"), ModbusIntData.make("s2le"), ModbusIntData.make("s2leb"), ModbusIntData.make("s2lew"), ModbusIntData.make("s4"), ModbusIntData.make("s4le"), ModbusIntData.make("s4leb"), ModbusIntData.make("s4lew"), ModbusIntData.make("s8"), ModbusIntData.make("s8le"), ModbusIntData.make("s8leb"), ModbusIntData.make("s8lew"), ModbusFloatData.make("f4"), ModbusFloatData.make("f4le"), ModbusFloatData.make("f4leb"), ModbusFloatData.make("f4lew"), ModbusFloatData.make("f8"), ModbusFloatData.make("f8le"), ModbusFloatData.make("f8leb"), ModbusFloatData.make("f8lew")]), (v) => {
      return v.name();
    }); if ($_u44 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hxModbus::ModbusData")).setList(sys.List.make(ModbusData.type$, [ModbusBitData.make("bit"), ModbusBitData.make("bit:0"), ModbusBitData.make("bit:1"), ModbusBitData.make("bit:2"), ModbusBitData.make("bit:3"), ModbusBitData.make("bit:4"), ModbusBitData.make("bit:5"), ModbusBitData.make("bit:6"), ModbusBitData.make("bit:7"), ModbusBitData.make("bit:8"), ModbusBitData.make("bit:9"), ModbusBitData.make("bit:10"), ModbusBitData.make("bit:11"), ModbusBitData.make("bit:12"), ModbusBitData.make("bit:13"), ModbusBitData.make("bit:14"), ModbusBitData.make("bit:15"), ModbusIntData.make("u1"), ModbusIntData.make("u1le"), ModbusIntData.make("u1leb"), ModbusIntData.make("u1lew"), ModbusIntData.make("u2"), ModbusIntData.make("u2le"), ModbusIntData.make("u2leb"), ModbusIntData.make("u2lew"), ModbusIntData.make("u4"), ModbusIntData.make("u4le"), ModbusIntData.make("u4leb"), ModbusIntData.make("u4lew"), ModbusIntData.make("s1"), ModbusIntData.make("s1le"), ModbusIntData.make("s1leb"), ModbusIntData.make("s1lew"), ModbusIntData.make("s2"), ModbusIntData.make("s2le"), ModbusIntData.make("s2leb"), ModbusIntData.make("s2lew"), ModbusIntData.make("s4"), ModbusIntData.make("s4le"), ModbusIntData.make("s4leb"), ModbusIntData.make("s4lew"), ModbusIntData.make("s8"), ModbusIntData.make("s8le"), ModbusIntData.make("s8leb"), ModbusIntData.make("s8lew"), ModbusFloatData.make("f4"), ModbusFloatData.make("f4le"), ModbusFloatData.make("f4leb"), ModbusFloatData.make("f4lew"), ModbusFloatData.make("f8"), ModbusFloatData.make("f8le"), ModbusFloatData.make("f8leb"), ModbusFloatData.make("f8lew")]), (v) => {
      return v.name();
    })); })(this), sys.Type.find("[sys::Str:hxModbus::ModbusData]"));
    return;
  }

}

class ModbusBitData extends ModbusData {
  constructor() {
    super();
    const this$ = this;
    this.#kind = haystack.Kind.bool();
    this.#size = 1;
    this.#pos = 0;
    return;
  }

  typeof() { return ModbusBitData.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #kind = null;

  kind() { return this.#kind; }

  __kind(it) { if (it === undefined) return this.#kind; else this.#kind = it; }

  #size = 0;

  size() { return this.#size; }

  __size(it) { if (it === undefined) return this.#size; else this.#size = it; }

  #pos = 0;

  pos() { return this.#pos; }

  __pos(it) { if (it === undefined) return this.#pos; else this.#pos = it; }

  #mask = 0;

  mask() { return this.#mask; }

  __mask(it) { if (it === undefined) return this.#mask; else this.#mask = it; }

  static make(name) {
    const $self = new ModbusBitData();
    ModbusBitData.make$($self,name);
    return $self;
  }

  static make$($self,name) {
    ModbusData.make$($self);
    ;
    $self.#name = name;
    if (sys.Str.contains(name, ":")) {
      $self.#pos = sys.ObjUtil.coerce(sys.Str.toInt(sys.Str.getRange(name, sys.Range.make(4, -1))), sys.Int.type$);
    }
    ;
    $self.#mask = sys.Int.shiftl(1, $self.#pos);
    return;
  }

  fromRegs(regs,unit) {
    if (unit === undefined) unit = null;
    return sys.ObjUtil.coerce(sys.ObjUtil.compareGT(sys.Int.and(sys.ObjUtil.coerce(regs.first(), sys.Int.type$), this.#mask), 0), sys.Obj.type$);
  }

  toRegs(val) {
    return sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]);
  }

}

class ModbusNumData extends ModbusData {
  constructor() {
    super();
    const this$ = this;
    this.#kind = haystack.Kind.number();
    this.#wordBig = true;
    this.#byteBig = true;
    return;
  }

  typeof() { return ModbusNumData.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #base = null;

  base() { return this.#base; }

  __base(it) { if (it === undefined) return this.#base; else this.#base = it; }

  #size = 0;

  size() { return this.#size; }

  __size(it) { if (it === undefined) return this.#size; else this.#size = it; }

  #kind = null;

  kind() { return this.#kind; }

  __kind(it) { if (it === undefined) return this.#kind; else this.#kind = it; }

  #wordBig = false;

  wordBig() { return this.#wordBig; }

  __wordBig(it) { if (it === undefined) return this.#wordBig; else this.#wordBig = it; }

  #byteBig = false;

  byteBig() { return this.#byteBig; }

  __byteBig(it) { if (it === undefined) return this.#byteBig; else this.#byteBig = it; }

  static make(name) {
    const $self = new ModbusNumData();
    ModbusNumData.make$($self,name);
    return $self;
  }

  static make$($self,name) {
    ModbusData.make$($self);
    ;
    $self.#name = name;
    $self.#base = sys.Str.getRange(name, sys.Range.make(0, 1));
    let $_u45 = sys.Str.get(name, 1);
    if (sys.ObjUtil.equals($_u45, 49)) {
      $self.#size = 1;
    }
    else if (sys.ObjUtil.equals($_u45, 50)) {
      $self.#size = 1;
    }
    else if (sys.ObjUtil.equals($_u45, 52)) {
      $self.#size = 2;
    }
    else if (sys.ObjUtil.equals($_u45, 56)) {
      $self.#size = 4;
    }
    ;
    if (sys.Str.endsWith(name, "le")) {
      $self.#wordBig = ((this$) => { let $_u46 = false; this$.#byteBig = $_u46; return $_u46; })($self);
    }
    else {
      if (sys.Str.endsWith(name, "lew")) {
        $self.#wordBig = false;
      }
      else {
        if (sys.Str.endsWith(name, "leb")) {
          $self.#byteBig = false;
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  toBits(regs) {
    const this$ = this;
    if (sys.ObjUtil.compareNE(regs.size(), this.#size)) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Registers size mismatch ", sys.ObjUtil.coerce(regs.size(), sys.Obj.type$.toNullable())), " != "), sys.ObjUtil.coerce(this.#size, sys.Obj.type$.toNullable())));
    }
    ;
    let len = sys.Int.minus(regs.size(), 1);
    let bits = 0;
    regs.each((w,i) => {
      if (!this$.#byteBig) {
        (w = this$.swapBytes(w));
      }
      ;
      if (this$.#wordBig) {
        (bits = sys.Int.or(bits, sys.Int.shiftl(w, sys.Int.mult(sys.Int.minus(len, i), 16))));
      }
      else {
        (bits = sys.Int.or(bits, sys.Int.shiftl(w, sys.Int.mult(i, 16))));
      }
      ;
      return;
    });
    return bits;
  }

  fromBits(bits) {
    const this$ = this;
    let regs = sys.List.make(sys.Int.type$);
    sys.Int.times(this.#size, (i) => {
      let w = sys.Int.and(sys.Int.shiftr(bits, sys.Int.mult(i, 16)), 65535);
      if (!this$.#byteBig) {
        (w = this$.swapBytes(w));
      }
      ;
      regs.add(sys.ObjUtil.coerce(w, sys.Obj.type$.toNullable()));
      return;
    });
    return ((this$) => { if (this$.#wordBig) return regs.reverse(); return regs; })(this);
  }

  swapBytes(w) {
    return sys.Int.or(sys.Int.shiftl(sys.Int.and(w, 255), 8), sys.Int.and(255, sys.Int.shiftr(w, 8)));
  }

}

class ModbusIntData extends ModbusNumData {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusIntData.type$; }

  static make(name) {
    const $self = new ModbusIntData();
    ModbusIntData.make$($self,name);
    return $self;
  }

  static make$($self,name) {
    ModbusNumData.make$($self, name);
    return;
  }

  fromRegs(regs,unit) {
    if (unit === undefined) unit = null;
    let bits = this.toBits(regs);
    let val = 0;
    let $_u48 = this.base();
    if (sys.ObjUtil.equals($_u48, "u1")) {
      (val = sys.Int.and(bits, 255));
    }
    else if (sys.ObjUtil.equals($_u48, "u2")) {
      (val = sys.Int.and(bits, 65535));
    }
    else if (sys.ObjUtil.equals($_u48, "u4")) {
      (val = sys.Int.and(bits, 4294967295));
    }
    else if (sys.ObjUtil.equals($_u48, "s1")) {
      (val = sys.Int.and(bits, 255));
      if (sys.ObjUtil.compareGT(sys.Int.and(val, 128), 0)) {
        val = sys.Int.plus(val, -256);
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u48, "s2")) {
      (val = sys.Int.and(bits, 65535));
      if (sys.ObjUtil.compareGT(sys.Int.and(val, 32768), 0)) {
        val = sys.Int.plus(val, -65536);
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u48, "s4")) {
      (val = sys.Int.and(bits, 4294967295));
      if (sys.ObjUtil.compareGT(sys.Int.and(val, 2147483648), 0)) {
        val = sys.Int.plus(val, -4294967296);
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u48, "s8")) {
      (val = bits);
    }
    else {
      throw sys.Err.make();
    }
    ;
    return sys.ObjUtil.coerce(haystack.Number.makeInt(val, unit), sys.Obj.type$);
  }

  toRegs(val) {
    const this$ = this;
    if (sys.ObjUtil.is(val, haystack.Number.type$)) {
      return this.fromBits(sys.ObjUtil.coerce(val, haystack.Number.type$).toInt());
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      let ints = sys.List.make(sys.Int.type$);
      sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).each((n) => {
        ints.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(n, haystack.Number.type$).toInt(), sys.Obj.type$.toNullable()));
        return;
      });
      return ints;
    }
    ;
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      let buf = sys.Buf.fromHex(sys.ObjUtil.coerce(val, sys.Str.type$));
      if (sys.ObjUtil.compareNE(sys.Int.mod(buf.size(), 2), 0)) {
        throw sys.ArgErr.make("Invalid hex string length");
      }
      ;
      let ints = sys.List.make(sys.Int.type$);
      while (sys.ObjUtil.compareGT(buf.remaining(), 0)) {
        ints.add(sys.ObjUtil.coerce(buf.readU2(), sys.Obj.type$.toNullable()));
      }
      ;
      return ints;
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid value ", val), " ["), sys.ObjUtil.typeof(val)), "]"));
  }

}

class ModbusFloatData extends ModbusNumData {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusFloatData.type$; }

  static make(name) {
    const $self = new ModbusFloatData();
    ModbusFloatData.make$($self,name);
    return $self;
  }

  static make$($self,name) {
    ModbusNumData.make$($self, name);
    return;
  }

  fromRegs(regs,unit) {
    if (unit === undefined) unit = null;
    let bits = this.toBits(regs);
    if (sys.ObjUtil.equals(this.base(), "f4")) {
      return haystack.Number.make(sys.Float.makeBits32(bits), unit);
    }
    ;
    if (sys.ObjUtil.equals(this.base(), "f8")) {
      return haystack.Number.make(sys.Float.makeBits(bits), unit);
    }
    ;
    throw sys.Err.make(this.base());
  }

  toRegs(val) {
    if (sys.ObjUtil.equals(this.base(), "f4")) {
      return this.fromBits(sys.Float.bits32(sys.ObjUtil.coerce(val, haystack.Number.type$).toFloat()));
    }
    ;
    if (sys.ObjUtil.equals(this.base(), "f8")) {
      return this.fromBits(sys.Float.bits(sys.ObjUtil.coerce(val, haystack.Number.type$).toFloat()));
    }
    ;
    throw sys.Err.make(this.base());
  }

}

class ModbusScale extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusScale.type$; }

  #op = 0;

  op() { return this.#op; }

  __op(it) { if (it === undefined) return this.#op; else this.#op = it; }

  #factor = null;

  factor() { return this.#factor; }

  __factor(it) { if (it === undefined) return this.#factor; else this.#factor = it; }

  static #ops = undefined;

  static ops() {
    if (ModbusScale.#ops === undefined) {
      ModbusScale.static$init();
      if (ModbusScale.#ops === undefined) ModbusScale.#ops = null;
    }
    return ModbusScale.#ops;
  }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    try {
      let op = sys.Str.get(s, 0);
      if (!ModbusScale.ops().contains(sys.ObjUtil.coerce(op, sys.Obj.type$.toNullable()))) {
        throw sys.Err.make("Invalid op 'op.toChar'");
      }
      ;
      let factor = haystack.Number.fromStr(sys.Str.trim(sys.Str.getRange(s, sys.Range.make(1, -1))));
      return ModbusScale.make((it) => {
        it.#op = op;
        it.#factor = sys.ObjUtil.coerce(factor, haystack.Number.type$);
        return;
      });
    }
    catch ($_u49) {
      $_u49 = sys.Err.make($_u49);
      if ($_u49 instanceof sys.Err) {
        let err = $_u49;
        ;
        if (!checked) {
          return null;
        }
        ;
        throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid scale '", s), "'"));
      }
      else {
        throw $_u49;
      }
    }
    ;
  }

  static make(f) {
    const $self = new ModbusScale();
    ModbusScale.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    sys.Func.call(f, $self);
    return;
  }

  compute(in$,factor) {
    if (factor === undefined) factor = null;
    let f = ((this$) => { let $_u50 = factor; if ($_u50 != null) return $_u50; return this$.#factor; })(this);
    let $_u51 = this.#op;
    if (sys.ObjUtil.equals($_u51, 43)) {
      return in$.plus(sys.ObjUtil.coerce(f, haystack.Number.type$));
    }
    else if (sys.ObjUtil.equals($_u51, 45)) {
      return in$.minus(sys.ObjUtil.coerce(f, haystack.Number.type$));
    }
    else if (sys.ObjUtil.equals($_u51, 42)) {
      return in$.mult(sys.ObjUtil.coerce(f, haystack.Number.type$));
    }
    else if (sys.ObjUtil.equals($_u51, 47)) {
      return in$.div(sys.ObjUtil.coerce(f, haystack.Number.type$));
    }
    else {
      throw sys.Err.make();
    }
    ;
  }

  inverse(in$,factor) {
    if (factor === undefined) factor = null;
    let f = ((this$) => { let $_u52 = factor; if ($_u52 != null) return $_u52; return this$.#factor; })(this);
    let $_u53 = this.#op;
    if (sys.ObjUtil.equals($_u53, 43)) {
      return in$.minus(sys.ObjUtil.coerce(f, haystack.Number.type$));
    }
    else if (sys.ObjUtil.equals($_u53, 45)) {
      return in$.plus(sys.ObjUtil.coerce(f, haystack.Number.type$));
    }
    else if (sys.ObjUtil.equals($_u53, 42)) {
      return in$.div(sys.ObjUtil.coerce(f, haystack.Number.type$));
    }
    else if (sys.ObjUtil.equals($_u53, 47)) {
      return in$.mult(sys.ObjUtil.coerce(f, haystack.Number.type$));
    }
    else {
      throw sys.Err.make();
    }
    ;
  }

  static static$init() {
    ModbusScale.#ops = sys.ObjUtil.coerce(((this$) => { let $_u54 = sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(43, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(45, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(42, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(47, sys.Obj.type$.toNullable())]); if ($_u54 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(43, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(45, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(42, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(47, sys.Obj.type$.toNullable())])); })(this), sys.Type.find("sys::Int[]"));
    return;
  }

}

class ModbusTransport extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#log = null;
    return;
  }

  typeof() { return ModbusTransport.type$; }

  #log = null;

  log(it) {
    if (it === undefined) {
      return this.#log;
    }
    else {
      this.#log = it;
      return;
    }
  }

  useCrc() {
    return true;
  }

  static make() {
    const $self = new ModbusTransport();
    ModbusTransport.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class ModbusTcpTransport extends ModbusTransport {
  constructor() {
    super();
    const this$ = this;
    this.#txId = 0;
    return;
  }

  typeof() { return ModbusTcpTransport.type$; }

  #host = null;

  host() { return this.#host; }

  __host(it) { if (it === undefined) return this.#host; else this.#host = it; }

  #port = 0;

  port() { return this.#port; }

  __port(it) { if (it === undefined) return this.#port; else this.#port = it; }

  #socketConfig = null;

  socketConfig() { return this.#socketConfig; }

  __socketConfig(it) { if (it === undefined) return this.#socketConfig; else this.#socketConfig = it; }

  #socket = null;

  // private field reflection only
  __socket(it) { if (it === undefined) return this.#socket; else this.#socket = it; }

  #txId = 0;

  // private field reflection only
  __txId(it) { if (it === undefined) return this.#txId; else this.#txId = it; }

  static make(host,port,timeout) {
    const $self = new ModbusTcpTransport();
    ModbusTcpTransport.make$($self,host,port,timeout);
    return $self;
  }

  static make$($self,host,port,timeout) {
    ModbusTransport.make$($self);
    ;
    $self.#host = host;
    $self.#port = sys.ObjUtil.coerce(((this$) => { let $_u55 = port; if ($_u55 != null) return $_u55; return sys.ObjUtil.coerce(502, sys.Int.type$.toNullable()); })($self), sys.Int.type$);
    $self.#socketConfig = inet.SocketConfig.cur().setTimeouts(timeout);
    return;
  }

  useCrc() {
    return false;
  }

  open() {
    if (sys.ObjUtil.equals(((this$) => { let $_u56 = this$.#socket; if ($_u56 == null) return null; return this$.#socket.isConnected(); })(this), true)) {
      return;
    }
    ;
    this.#socket = inet.TcpSocket.make(this.#socketConfig);
    this.#socket.connect(this.#host, this.#port);
    return;
  }

  close() {
    ((this$) => { let $_u57 = this$.#socket; if ($_u57 == null) return null; return this$.#socket.close(); })(this);
    this.#socket = null;
    return;
  }

  req(msg) {
    if ((this.#socket == null || !this.#socket.isConnected())) {
      throw sys.IOErr.make("Socket not open");
    }
    ;
    let reqTxId = ((this$) => { let $_u58 = this$.#txId;this$.#txId = sys.Int.increment(this$.#txId); return $_u58; })(this);
    if (sys.ObjUtil.compareGT(this.#txId, 65535)) {
      this.#txId = 0;
    }
    ;
    if (sys.ObjUtil.equals(((this$) => { let $_u59 = this$.log(); if ($_u59 == null) return null; return this$.log().isDebug(); })(this), true)) {
      let s = sys.StrBuf.make().add(sys.Str.plus(sys.Str.plus("> ", sys.ObjUtil.coerce(reqTxId, sys.Obj.type$.toNullable())), "\n")).add("Modbus Req\n").add(sys.Int.toHex(reqTxId, sys.ObjUtil.coerce(4, sys.Int.type$.toNullable()))).add(" ").add("0000").add(" ").add(sys.Int.toHex(msg.size(), sys.ObjUtil.coerce(4, sys.Int.type$.toNullable()))).add(" ").add(msg.toHex());
      this.log().debug(s.toStr());
    }
    ;
    let out = this.#socket.out();
    out.writeI2(reqTxId);
    out.writeI2(0);
    out.writeI2(msg.size());
    out.writeBuf(msg.flip());
    out.flush();
    let in$ = ModbusInStream.make(this.#socket.in(), this.log(), sys.Str.plus("", sys.ObjUtil.coerce(reqTxId, sys.Obj.type$.toNullable())));
    let resTxId = in$.readU2();
    if (sys.ObjUtil.compareNE(reqTxId, resTxId)) {
      throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Transaction ID mistmatch ", sys.ObjUtil.coerce(reqTxId, sys.Obj.type$.toNullable())), " != "), sys.ObjUtil.coerce(resTxId, sys.Obj.type$.toNullable())));
    }
    ;
    in$.readU2();
    let len = in$.readU2();
    return in$;
  }

}

class ModbusRtuTcpTransport extends ModbusTransport {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusRtuTcpTransport.type$; }

  #host = null;

  host() { return this.#host; }

  __host(it) { if (it === undefined) return this.#host; else this.#host = it; }

  #port = 0;

  port() { return this.#port; }

  __port(it) { if (it === undefined) return this.#port; else this.#port = it; }

  #socketConfig = null;

  socketConfig() { return this.#socketConfig; }

  __socketConfig(it) { if (it === undefined) return this.#socketConfig; else this.#socketConfig = it; }

  #socket = null;

  // private field reflection only
  __socket(it) { if (it === undefined) return this.#socket; else this.#socket = it; }

  static make(host,port,timeout) {
    const $self = new ModbusRtuTcpTransport();
    ModbusRtuTcpTransport.make$($self,host,port,timeout);
    return $self;
  }

  static make$($self,host,port,timeout) {
    const this$ = $self;
    ModbusTransport.make$($self);
    $self.#host = host;
    $self.#port = sys.ObjUtil.coerce(((this$) => { let $_u60 = port; if ($_u60 != null) return $_u60; return sys.ObjUtil.coerce(502, sys.Int.type$.toNullable()); })($self), sys.Int.type$);
    $self.#socketConfig = inet.SocketConfig.cur().copy((it) => {
      it.__connectTimeout(timeout);
      it.__receiveTimeout(timeout);
      return;
    });
    return;
  }

  open() {
    if (sys.ObjUtil.equals(((this$) => { let $_u61 = this$.#socket; if ($_u61 == null) return null; return this$.#socket.isConnected(); })(this), true)) {
      return;
    }
    ;
    this.#socket = inet.TcpSocket.make(this.#socketConfig);
    this.#socket.connect(this.#host, this.#port);
    return;
  }

  close() {
    ((this$) => { let $_u62 = this$.#socket; if ($_u62 == null) return null; return this$.#socket.close(); })(this);
    this.#socket = null;
    return;
  }

  req(msg) {
    if ((this.#socket == null || !this.#socket.isConnected())) {
      throw sys.IOErr.make("Socket not open");
    }
    ;
    if (sys.ObjUtil.equals(((this$) => { let $_u63 = this$.log(); if ($_u63 == null) return null; return this$.log().isDebug(); })(this), true)) {
      this.log().debug(sys.Str.plus("> RTU-TCP\nModbus Req\n", msg.toHex()));
    }
    ;
    this.#socket.out().writeBuf(msg.flip()).flush();
    return ModbusInStream.make(this.#socket.in(), this.log(), "RTU-TCP");
  }

}

class ModbusRtuTransport extends ModbusTransport {
  constructor() {
    super();
    const this$ = this;
    this.#timeout = sys.Duration.fromStr("1sec");
    return;
  }

  typeof() { return ModbusRtuTransport.type$; }

  #port = null;

  // private field reflection only
  __port(it) { if (it === undefined) return this.#port; else this.#port = it; }

  #frameDelay = null;

  // private field reflection only
  __frameDelay(it) { if (it === undefined) return this.#frameDelay; else this.#frameDelay = it; }

  #timeout = null;

  // private field reflection only
  __timeout(it) { if (it === undefined) return this.#timeout; else this.#timeout = it; }

  static make(port,frameDelay) {
    const $self = new ModbusRtuTransport();
    ModbusRtuTransport.make$($self,port,frameDelay);
    return $self;
  }

  static make$($self,port,frameDelay) {
    if (frameDelay === undefined) frameDelay = sys.Duration.fromStr("50ms");
    ModbusTransport.make$($self);
    ;
    if (sys.ObjUtil.compareLT(frameDelay, sys.Duration.fromStr("2ms"))) {
      throw sys.IOErr.make(sys.Str.plus(sys.Str.plus("frameDelay out of bounds ", frameDelay), " < 2ms"));
    }
    ;
    $self.#port = port;
    $self.#port.timeout(null);
    $self.#frameDelay = frameDelay;
    return;
  }

  open() {
    return;
  }

  close() {
    this.#port.close();
    return;
  }

  req(msg) {
    if (sys.ObjUtil.equals(((this$) => { let $_u64 = this$.log(); if ($_u64 == null) return null; return this$.log().isDebug(); })(this), true)) {
      this.log().debug(sys.Str.plus("> RTU\nModbus Req\n", msg.toHex()));
    }
    ;
    this.#port.out().writeBuf(msg.flip()).flush();
    concurrent.Actor.sleep(this.#frameDelay);
    try {
      let start = sys.Duration.now();
      let buf = sys.Buf.make();
      while (true) {
        let now = sys.Duration.now();
        if (sys.ObjUtil.equals(this.#port.in().avail(), 0)) {
          if ((sys.ObjUtil.compareGT(buf.size(), 0) && sys.ObjUtil.compareGT(now.minus(start), this.#frameDelay))) {
            break;
          }
          ;
          if (sys.ObjUtil.compareGT(now.minus(start), this.#timeout)) {
            throw sys.IOErr.make("Response timeout");
          }
          ;
          concurrent.Actor.sleep(sys.Duration.fromStr("1ms"));
          continue;
        }
        ;
        let byte = this.#port.in().read();
        if (byte != null) {
          buf.write(sys.ObjUtil.coerce(byte, sys.Int.type$));
        }
        ;
        (start = now);
      }
      ;
      return ModbusInStream.make(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).in(), this.log(), "RTU");
    }
    finally {
      concurrent.Actor.sleep(this.#frameDelay);
    }
    ;
  }

}

class ModbusInStream extends sys.InStream {
  constructor() {
    super();
    const this$ = this;
    this.#data = sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$);
    return;
  }

  typeof() { return ModbusInStream.type$; }

  #log = null;

  // private field reflection only
  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #label = null;

  // private field reflection only
  __label(it) { if (it === undefined) return this.#label; else this.#label = it; }

  #data = null;

  data() {
    return this.#data;
  }

  static make(in$,log,label) {
    const $self = new ModbusInStream();
    ModbusInStream.make$($self,in$,log,label);
    return $self;
  }

  static make$($self,in$,log,label) {
    if (label === undefined) label = "";
    sys.InStream.make$($self, in$);
    ;
    $self.#log = log;
    $self.#label = label;
    return;
  }

  read() {
    let b = sys.InStream.prototype.read.call(this);
    if (b != null) {
      this.#data.write(sys.ObjUtil.coerce(b, sys.Int.type$));
    }
    ;
    return b;
  }

  readBuf(buf,n) {
    let p = buf.pos();
    let c = sys.InStream.prototype.readBuf.call(this, buf, n);
    if (c != null) {
      this.#data.writeBuf(buf.getRange(sys.Range.make(p, sys.Int.plus(p, sys.ObjUtil.coerce(c, sys.Int.type$)), true)));
    }
    ;
    return c;
  }

  unread(b) {
    throw sys.IOErr.make("unread not supported");
  }

  close() {
    if (sys.ObjUtil.coerce(((this$) => { let $_u65 = ((this$) => { let $_u66 = this$.#log; if ($_u66 == null) return null; return this$.#log.isDebug(); })(this$); if ($_u65 != null) return $_u65; return sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()); })(this), sys.Bool.type$)) {
      let s = sys.StrBuf.make().add(sys.Str.plus(sys.Str.plus("< ", this.#label), "\n")).add("Modbus Res\n").add(this.#data.toHex());
      this.#log.debug(s.toStr());
      this.#data.clear();
    }
    ;
    return true;
  }

}

class ModbusMaster extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusMaster.type$; }

  #transport = null;

  // private field reflection only
  __transport(it) { if (it === undefined) return this.#transport; else this.#transport = it; }

  static make(transport) {
    const $self = new ModbusMaster();
    ModbusMaster.make$($self,transport);
    return $self;
  }

  static make$($self,transport) {
    $self.#transport = transport;
    return;
  }

  open() {
    this.#transport.open();
    return this;
  }

  close() {
    this.#transport.close();
    return this;
  }

  withTrace(log,f) {
    let curLog = this.#transport.log();
    try {
      this.#transport.log(log);
      sys.Func.call(f, this);
    }
    finally {
      this.#transport.log(curLog);
    }
    ;
    return;
  }

  readCoil(slave,addr) {
    return sys.ObjUtil.coerce(this.readCoils(slave, addr, 1).first(), sys.Bool.type$);
  }

  readCoils(slave,start,count) {
    return this.readBinary(slave, 1, start, count);
  }

  writeCoil(slave,addr,val) {
    this.writeBinary(slave, 5, addr, val);
    return;
  }

  readDiscreteInput(slave,addr) {
    return sys.ObjUtil.coerce(this.readDiscreteInputs(slave, addr, 1).first(), sys.Bool.type$);
  }

  readDiscreteInputs(slave,start,count) {
    return this.readBinary(slave, 2, start, count);
  }

  readInputReg(slave,addr) {
    return sys.ObjUtil.coerce(this.readInputRegs(slave, addr, 1).first(), sys.Int.type$);
  }

  readInputRegs(slave,start,count) {
    return this.read16(slave, 4, start, count);
  }

  readHoldingReg(slave,addr) {
    return sys.ObjUtil.coerce(this.readHoldingRegs(slave, addr, 1).first(), sys.Int.type$);
  }

  readHoldingRegs(slave,start,count) {
    return this.read16(slave, 3, start, count);
  }

  writeHoldingReg(slave,addr,val) {
    this.write16(slave, 6, addr, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(val, sys.Obj.type$.toNullable())]));
    return;
  }

  writeHoldingRegs(slave,start,vals) {
    if (sys.ObjUtil.equals(vals.size(), 1)) {
      this.writeHoldingReg(slave, start, sys.ObjUtil.coerce(vals.first(), sys.Int.type$));
    }
    else {
      this.write16(slave, 16, start, vals);
    }
    ;
    return;
  }

  _writeHoldingRegs(slave,start,vals) {
    this.write16(slave, 16, start, vals, true);
    return;
  }

  readBinary(slave,func,start,count) {
    const this$ = this;
    let msg = sys.Buf.make();
    let out = msg.out();
    out.write(slave);
    out.write(func);
    out.writeI2(start);
    out.writeI2(count);
    this.addCrc(sys.ObjUtil.coerce(msg, sys.Buf.type$));
    let in$ = this.#transport.req(sys.ObjUtil.coerce(msg, sys.Buf.type$));
    try {
      let rslave = in$.readU1();
      if (sys.ObjUtil.compareNE(slave, rslave)) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Slave mismatch ", sys.ObjUtil.coerce(slave, sys.Obj.type$.toNullable())), " != "), sys.ObjUtil.coerce(rslave, sys.Obj.type$.toNullable())));
      }
      ;
      let fc = in$.readU1();
      if (this.isErr(fc)) {
        throw this.err(in$);
      }
      ;
      if (sys.ObjUtil.compareNE(fc, func)) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Function code mismatch ", sys.ObjUtil.coerce(func, sys.Obj.type$.toNullable())), " != "), sys.ObjUtil.coerce(fc, sys.Obj.type$.toNullable())));
      }
      ;
      let list = sys.List.make(sys.Bool.type$);
      let cur = 0;
      let len = in$.readU1();
      sys.Int.times(count, (i) => {
        if ((sys.ObjUtil.equals(i, 0) || sys.ObjUtil.equals(sys.Int.mod(i, 8), 0))) {
          (cur = in$.readU1());
        }
        ;
        list.add(sys.ObjUtil.coerce(sys.ObjUtil.equals(sys.Int.and(cur, 1), 1), sys.Obj.type$.toNullable()));
        (cur = sys.Int.shiftr(cur, 1));
        return;
      });
      this.verifyCrc(in$);
      return list;
    }
    finally {
      in$.close();
    }
    ;
  }

  writeBinary(slave,func,addr,val) {
    let msg = sys.Buf.make();
    let out = msg.out();
    out.write(slave);
    out.write(func);
    out.writeI2(addr);
    out.writeI2(((this$) => { if (val) return 65280; return 0; })(this));
    this.addCrc(sys.ObjUtil.coerce(msg, sys.Buf.type$));
    let in$ = this.#transport.req(sys.ObjUtil.coerce(msg, sys.Buf.type$));
    try {
      let rslave = in$.readU1();
      if (sys.ObjUtil.compareNE(slave, rslave)) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Slave mismtach ", sys.ObjUtil.coerce(slave, sys.Obj.type$.toNullable())), " != "), sys.ObjUtil.coerce(rslave, sys.Obj.type$.toNullable())));
      }
      ;
      let fc = in$.readU1();
      if (this.isErr(fc)) {
        throw this.err(in$);
      }
      ;
      if (sys.ObjUtil.compareNE(fc, func)) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Function code mismatch ", sys.ObjUtil.coerce(func, sys.Obj.type$.toNullable())), " != "), sys.ObjUtil.coerce(fc, sys.Obj.type$.toNullable())));
      }
      ;
      let raddr = in$.readU2();
      let rval = in$.readU2();
      this.verifyCrc(in$);
    }
    finally {
      in$.close();
    }
    ;
    return;
  }

  read16(slave,func,start,count) {
    const this$ = this;
    let msg = sys.Buf.make();
    let out = msg.out();
    out.write(slave);
    out.write(func);
    out.writeI2(start);
    out.writeI2(count);
    this.addCrc(sys.ObjUtil.coerce(msg, sys.Buf.type$));
    let in$ = this.#transport.req(sys.ObjUtil.coerce(msg, sys.Buf.type$));
    try {
      let rslave = in$.readU1();
      if (sys.ObjUtil.compareNE(slave, rslave)) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Slave mismtach ", sys.ObjUtil.coerce(slave, sys.Obj.type$.toNullable())), " != "), sys.ObjUtil.coerce(rslave, sys.Obj.type$.toNullable())));
      }
      ;
      let fc = in$.readU1();
      if (this.isErr(fc)) {
        throw this.err(in$);
      }
      ;
      if (sys.ObjUtil.compareNE(fc, func)) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Function code mismatch ", sys.ObjUtil.coerce(func, sys.Obj.type$.toNullable())), " != "), sys.ObjUtil.coerce(fc, sys.Obj.type$.toNullable())));
      }
      ;
      let list = sys.List.make(sys.Int.type$);
      let len = sys.Int.div(in$.readU1(), 2);
      sys.Int.times(len, (i) => {
        list.add(sys.ObjUtil.coerce(in$.readU2(), sys.Obj.type$.toNullable()));
        return;
      });
      this.verifyCrc(in$);
      return list;
    }
    finally {
      in$.close();
    }
    ;
  }

  write16(slave,func,addr,vals,forceMulti) {
    if (forceMulti === undefined) forceMulti = false;
    const this$ = this;
    let len = vals.size();
    let msg = sys.Buf.make();
    let out = msg.out();
    out.write(slave);
    out.write(func);
    out.writeI2(addr);
    if ((sys.ObjUtil.compareGT(len, 1) || forceMulti)) {
      out.writeI2(len);
      out.write(sys.Int.mult(len, 2));
    }
    ;
    vals.each((v) => {
      out.writeI2(v);
      return;
    });
    this.addCrc(sys.ObjUtil.coerce(msg, sys.Buf.type$));
    let in$ = this.#transport.req(sys.ObjUtil.coerce(msg, sys.Buf.type$));
    try {
      let rslave = in$.readU1();
      if (sys.ObjUtil.compareNE(slave, rslave)) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Slave mismtach ", sys.ObjUtil.coerce(slave, sys.Obj.type$.toNullable())), " != "), sys.ObjUtil.coerce(rslave, sys.Obj.type$.toNullable())));
      }
      ;
      let fc = in$.readU1();
      if (this.isErr(fc)) {
        throw this.err(in$);
      }
      ;
      if (sys.ObjUtil.compareNE(fc, func)) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Function code mismatch ", sys.ObjUtil.coerce(func, sys.Obj.type$.toNullable())), " != "), sys.ObjUtil.coerce(fc, sys.Obj.type$.toNullable())));
      }
      ;
      let raddr = in$.readU2();
      if (sys.ObjUtil.compareNE(addr, raddr)) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Address mismatch ", sys.ObjUtil.coerce(addr, sys.Obj.type$.toNullable())), " != "), sys.ObjUtil.coerce(raddr, sys.Obj.type$.toNullable())));
      }
      ;
      let rval = in$.readU2();
      this.verifyCrc(in$);
    }
    finally {
      in$.close();
    }
    ;
    return;
  }

  isErr(code) {
    return sys.ObjUtil.compareNE(sys.Int.and(code, 128), 0);
  }

  err(in$) {
    let code = in$.readU1();
    let msg = "";
    let $_u68 = code;
    if (sys.ObjUtil.equals($_u68, 1)) {
      (msg = "Illegal Function");
    }
    else if (sys.ObjUtil.equals($_u68, 2)) {
      (msg = "Illegal Data Address");
    }
    else if (sys.ObjUtil.equals($_u68, 3)) {
      (msg = "Illegal Data Value");
    }
    else if (sys.ObjUtil.equals($_u68, 4)) {
      (msg = "Slave Device Failure");
    }
    else if (sys.ObjUtil.equals($_u68, 5)) {
      (msg = "Acknowledge");
    }
    else if (sys.ObjUtil.equals($_u68, 6)) {
      (msg = "Slave Device Busy");
    }
    else if (sys.ObjUtil.equals($_u68, 7)) {
      (msg = "Negative Acknowledge");
    }
    else if (sys.ObjUtil.equals($_u68, 8)) {
      (msg = "Memory Parity Error");
    }
    else if (sys.ObjUtil.equals($_u68, 10)) {
      (msg = "Gateway Path Unavailable");
    }
    else if (sys.ObjUtil.equals($_u68, 11)) {
      (msg = "Gateway Target Device Failed to Respond");
    }
    else {
      (msg = "Unknown code");
    }
    ;
    return sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Exception code ", sys.ObjUtil.coerce(code, sys.Obj.type$.toNullable())), ": "), msg));
  }

  addCrc(msg) {
    if (!this.#transport.useCrc()) {
      return;
    }
    ;
    let crc = msg.crc("CRC-16");
    msg.write(crc);
    msg.write(sys.Int.shiftr(crc, 8));
    return;
  }

  verifyCrc(msg) {
    if (!this.#transport.useCrc()) {
      return;
    }
    ;
    let computed = msg.data().crc("CRC-16");
    let expected = sys.Int.or(msg.readU1(), sys.Int.shiftl(msg.readU1(), 8));
    if (sys.ObjUtil.compareNE(computed, expected)) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid CRC ", sys.Int.toHex(computed)), " != "), sys.Int.toHex(expected)));
    }
    ;
    return;
  }

}

class ModbusMasterTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusMasterTest.type$; }

  testBasics() {
    const this$ = this;
    let t = ModbusTestTransport.make();
    let m = ModbusMaster.make(t);
    this.verifyEq(sys.ObjUtil.coerce(t._open(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    m.open();
    this.verifyEq(sys.ObjUtil.coerce(t._open(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    t.crc(true);
    t.test(this.toBuf("0103020005"));
    this.verifyEq(sys.ObjUtil.coerce(m.readHoldingReg(1, 0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    t.test(this.toBuf("018305"));
    this.verifyErr(sys.Err.type$, (it) => {
      m.readHoldingReg(1, 0);
      return;
    });
    t.crc(false);
    t.test(this.toBuf("0103020007"));
    this.verifyEq(sys.ObjUtil.coerce(m.readHoldingReg(1, 0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(7, sys.Obj.type$.toNullable()));
    t.test(this.toBuf("018307"));
    this.verifyErr(sys.Err.type$, (it) => {
      m.readHoldingReg(1, 0);
      return;
    });
    m.close();
    this.verifyEq(sys.ObjUtil.coerce(t._open(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    return;
  }

  testDiscreteCoils() {
    const this$ = this;
    let t = ModbusTestTransport.make();
    let m = ModbusMaster.make(t).open();
    t.test(this.toBuf("01010100"));
    this.verifyEq(sys.ObjUtil.coerce(m.readCoil(1, 1), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    t.test(this.toBuf("01010101"));
    this.verifyEq(sys.ObjUtil.coerce(m.readCoil(1, 1), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    t.test(this.toBuf("01010101"));
    this.verifyEq(sys.ObjUtil.coerce(m.readCoil(1, 2), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    t.test(this.toBuf("01010101"));
    this.verifyEq(sys.ObjUtil.coerce(m.readCoil(1, 5), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    t.test(this.toBuf("01010101"));
    this.verifyEq(m.readCoils(1, 1, 1), sys.List.make(sys.Bool.type$, [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())]));
    t.test(this.toBuf("01010103"));
    this.verifyEq(m.readCoils(1, 1, 3), sys.List.make(sys.Bool.type$, [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable())]));
    t.test(this.toBuf("01010104"));
    this.verifyEq(m.readCoils(1, 1, 3), sys.List.make(sys.Bool.type$, [sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())]));
    t.test(this.toBuf("010500040000"));
    m.writeCoil(1, 4, false);
    t.test(this.toBuf("01050004ff00"));
    m.writeCoil(1, 4, true);
    t.test(this.toBuf("01010100"));
    this.verifyErr(sys.Err.type$, (it) => {
      m.readCoil(3, 0);
      return;
    });
    t.test(this.toBuf("01070100"));
    this.verifyErr(sys.Err.type$, (it) => {
      m.readCoil(1, 0);
      return;
    });
    t.test(this.toBuf("01070100"));
    this.verifyErr(sys.Err.type$, (it) => {
      m.writeCoil(1, 4, true);
      return;
    });
    return;
  }

  testHoldingRegs() {
    const this$ = this;
    let t = ModbusTestTransport.make();
    let m = ModbusMaster.make(t).open();
    t.test(this.toBuf("0103020001"));
    this.verifyEq(sys.ObjUtil.coerce(m.readHoldingReg(1, 100), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    t.test(this.toBuf("0203020002"));
    this.verifyEq(sys.ObjUtil.coerce(m.readHoldingReg(2, 100), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    t.test(this.toBuf("0203020003"));
    this.verifyEq(sys.ObjUtil.coerce(m.readHoldingReg(2, 5), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    t.test(this.toBuf("050302000a"));
    this.verifyEq(m.readHoldingRegs(5, 100, 1), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable())]));
    t.test(this.toBuf("010304000a000b"));
    this.verifyEq(m.readHoldingRegs(1, 100, 2), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(11, sys.Obj.type$.toNullable())]));
    t.test(this.toBuf("010306000a000b000c"));
    this.verifyEq(m.readHoldingRegs(1, 100, 3), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(11, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(12, sys.Obj.type$.toNullable())]));
    t.test(this.toBuf("01060001000a"));
    m.writeHoldingReg(1, 1, 10);
    t.test(this.toBuf("01060001000a"));
    m.writeHoldingRegs(1, 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable())]));
    t.test(this.toBuf("01060002000b"));
    m.writeHoldingReg(1, 2, 11);
    t.test(this.toBuf("05060003000c"));
    m.writeHoldingReg(5, 3, 12);
    t.test(this.toBuf("011000010002"));
    m.writeHoldingRegs(1, 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(11, sys.Obj.type$.toNullable())]));
    t.test(this.toBuf("011000050003"));
    m.writeHoldingRegs(1, 5, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(11, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(12, sys.Obj.type$.toNullable())]));
    t.test(this.toBuf("021000070004"));
    m.writeHoldingRegs(2, 7, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(11, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(12, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(20, sys.Obj.type$.toNullable())]));
    t.test(this.toBuf("0103020001"));
    this.verifyErr(sys.Err.type$, (it) => {
      m.readHoldingReg(3, 0);
      return;
    });
    t.test(this.toBuf("0105020001"));
    this.verifyErr(sys.Err.type$, (it) => {
      m.readHoldingReg(1, 0);
      return;
    });
    t.test(this.toBuf("0107020001"));
    this.verifyErr(sys.Err.type$, (it) => {
      m.writeHoldingReg(1, 0, 22);
      return;
    });
    t.test(this.toBuf("018305"));
    this.verifyErr(sys.Err.type$, (it) => {
      m.readHoldingReg(1, 0);
      return;
    });
    t.test(this.toBuf("018305"));
    this.verifyErr(sys.Err.type$, (it) => {
      m.readHoldingRegs(1, 0, 10);
      return;
    });
    t.test(this.toBuf("018601"));
    this.verifyErr(sys.Err.type$, (it) => {
      m.writeHoldingReg(1, 0, 3);
      return;
    });
    t.test(this.toBuf("019001"));
    this.verifyErr(sys.Err.type$, (it) => {
      m.writeHoldingRegs(1, 0, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())]));
      return;
    });
    return;
  }

  toBuf(str) {
    const this$ = this;
    if (sys.ObjUtil.compareNE(sys.Int.mod(sys.Str.size(str), 2), 0)) {
      throw sys.Err.make("req does not end on byte boundry");
    }
    ;
    let buf = sys.Buf.make();
    sys.Int.times(sys.Int.div(sys.Str.size(str), 2), (i) => {
      let x = sys.Int.mult(i, 2);
      let s = sys.Str.getRange(str, sys.Range.make(x, sys.Int.plus(x, 1)));
      buf.write(sys.ObjUtil.coerce(sys.Int.fromStr(s, 16), sys.Int.type$));
      return;
    });
    return sys.ObjUtil.coerce(buf, sys.Buf.type$);
  }

  static make() {
    const $self = new ModbusMasterTest();
    ModbusMasterTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class ModbusTestTransport extends ModbusTransport {
  constructor() {
    super();
    const this$ = this;
    this.#_open = false;
    this.#crc = true;
    this.#test = sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$);
    return;
  }

  typeof() { return ModbusTestTransport.type$; }

  #_open = false;

  _open(it) {
    if (it === undefined) {
      return this.#_open;
    }
    else {
      this.#_open = it;
      return;
    }
  }

  #crc = false;

  crc(it) {
    if (it === undefined) {
      return this.#crc;
    }
    else {
      this.#crc = it;
      return;
    }
  }

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

  open() {
    this.#_open = true;
    return;
  }

  close() {
    this.#_open = false;
    return;
  }

  useCrc() {
    return this.#crc;
  }

  req(msg) {
    return ModbusInStream.make(this.toRes(this.#test).in(), sys.Log.get("modbustest"));
  }

  toRes(buf) {
    if (this.useCrc()) {
      let crc = buf.crc("CRC-16");
      buf.write(crc);
      buf.write(sys.Int.shiftr(crc, 8));
    }
    ;
    return buf.flip();
  }

  static make() {
    const $self = new ModbusTestTransport();
    ModbusTestTransport.make$($self);
    return $self;
  }

  static make$($self) {
    ModbusTransport.make$($self);
    ;
    return;
  }

}

class ModbusRegMapTest extends hx.HxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusRegMapTest.type$; }

  static #coil = undefined;

  static coil() {
    if (ModbusRegMapTest.#coil === undefined) {
      ModbusRegMapTest.static$init();
      if (ModbusRegMapTest.#coil === undefined) ModbusRegMapTest.#coil = null;
    }
    return ModbusRegMapTest.#coil;
  }

  static #disInput = undefined;

  static disInput() {
    if (ModbusRegMapTest.#disInput === undefined) {
      ModbusRegMapTest.static$init();
      if (ModbusRegMapTest.#disInput === undefined) ModbusRegMapTest.#disInput = null;
    }
    return ModbusRegMapTest.#disInput;
  }

  static #inputReg = undefined;

  static inputReg() {
    if (ModbusRegMapTest.#inputReg === undefined) {
      ModbusRegMapTest.static$init();
      if (ModbusRegMapTest.#inputReg === undefined) ModbusRegMapTest.#inputReg = null;
    }
    return ModbusRegMapTest.#inputReg;
  }

  static #holdingReg = undefined;

  static holdingReg() {
    if (ModbusRegMapTest.#holdingReg === undefined) {
      ModbusRegMapTest.static$init();
      if (ModbusRegMapTest.#holdingReg === undefined) ModbusRegMapTest.#holdingReg = null;
    }
    return ModbusRegMapTest.#holdingReg;
  }

  static #bit = undefined;

  static bit() {
    if (ModbusRegMapTest.#bit === undefined) {
      ModbusRegMapTest.static$init();
      if (ModbusRegMapTest.#bit === undefined) ModbusRegMapTest.#bit = null;
    }
    return ModbusRegMapTest.#bit;
  }

  static #u2 = undefined;

  static u2() {
    if (ModbusRegMapTest.#u2 === undefined) {
      ModbusRegMapTest.static$init();
      if (ModbusRegMapTest.#u2 === undefined) ModbusRegMapTest.#u2 = null;
    }
    return ModbusRegMapTest.#u2;
  }

  static #s4 = undefined;

  static s4() {
    if (ModbusRegMapTest.#s4 === undefined) {
      ModbusRegMapTest.static$init();
      if (ModbusRegMapTest.#s4 === undefined) ModbusRegMapTest.#s4 = null;
    }
    return ModbusRegMapTest.#s4;
  }

  test() {
    const this$ = this;
    let csv = "name,addr,data,rw,unit\na,40001,u2,rw,\nb,39876,s4,r,kW\nc,10234,bit,r,\nd,00080,bit,rw,";
    let f = this.tempDir().plus(sys.Uri.fromStr("modbus.csv"));
    f.out().print(csv).flush().close();
    let mapOrig = ModbusRegMap.fromFile(f);
    this.verifySame(ModbusRegMap.fromFile(f), mapOrig);
    concurrent.Actor.sleep(sys.Duration.fromStr("1sec"));
    f.out().print(csv).flush().close();
    let map = ModbusRegMap.fromFile(f);
    this.verifyNotSame(map, mapOrig);
    this.verifyReg(map.regs().get(0), "a", null, "40001", ModbusRegMapTest.holdingReg(), 1, ModbusRegMapTest.u2(), null);
    this.verifyReg(map.regs().get(1), "b", null, "39876", ModbusRegMapTest.inputReg(), 9876, ModbusRegMapTest.s4(), sys.Unit.fromStr("kW"));
    this.verifyReg(map.regs().get(2), "c", null, "10234", ModbusRegMapTest.disInput(), 234, ModbusRegMapTest.bit(), null);
    this.verifyReg(map.regs().get(3), "d", null, "00080", ModbusRegMapTest.coil(), 80, ModbusRegMapTest.bit(), null);
    this.verifySame(map.reg("b"), map.regs().get(1));
    this.verifyEq(map.reg("bad", false), null);
    this.verifyErr(haystack.UnknownNameErr.type$, (it) => {
      map.reg("bad");
      return;
    });
    this.verifyErr(haystack.UnknownNameErr.type$, (it) => {
      map.reg("bad", true);
      return;
    });
    return;
  }

  testAddr() {
    this.verifyEq(sys.ObjUtil.coerce(ModbusAddrType.coil().isBool(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(ModbusAddrType.coil().isNum(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(ModbusAddrType.discreteInput().isBool(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(ModbusAddrType.discreteInput().isNum(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(ModbusAddrType.inputReg().isBool(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(ModbusAddrType.inputReg().isNum(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(ModbusAddrType.holdingReg().isBool(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(ModbusAddrType.holdingReg().isNum(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(ModbusAddr.fromStr("00005").qnum(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(ModbusAddr.fromStr("10020").qnum(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(10020, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(ModbusAddr.fromStr("30500").qnum(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(30500, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(ModbusAddr.fromStr("40100").qnum(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(40100, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(ModbusAddr.fromStr("499999").qnum(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(499999, sys.Obj.type$.toNullable()));
    return;
  }

  testTags() {
    let aTags = haystack.Etc.emptyTags();
    let bTags = haystack.Etc.makeDict(sys.List.make(sys.Str.type$, ["foo"]));
    let cTags = haystack.Etc.makeDict(sys.List.make(sys.Str.type$, ["foo", "bar", "rar"]));
    let dTags = haystack.Etc.emptyTags();
    let csv = "name,addr,data,rw,tags\na,40001,u2,rw,\nb,39876,s4,r,foo\nc,10234,bit,r,foo bar rar\nd,00080,bit,rw,";
    let f = this.tempDir().plus(sys.Uri.fromStr("modbus2.csv"));
    f.out().print(csv).flush().close();
    let map = ModbusRegMap.fromFile(f);
    this.verifyReg(map.regs().get(0), "a", null, "40001", ModbusRegMapTest.holdingReg(), 1, ModbusRegMapTest.u2(), null, aTags);
    this.verifyReg(map.regs().get(1), "b", null, "39876", ModbusRegMapTest.inputReg(), 9876, ModbusRegMapTest.s4(), null, bTags);
    this.verifyReg(map.regs().get(2), "c", null, "10234", ModbusRegMapTest.disInput(), 234, ModbusRegMapTest.bit(), null, cTags);
    this.verifyReg(map.regs().get(3), "d", null, "00080", ModbusRegMapTest.coil(), 80, ModbusRegMapTest.bit(), null, dTags);
    return;
  }

  verifyReg(r,name,dis,addrStr,addrType,addrNum,data,unit,tags) {
    if (tags === undefined) tags = null;
    this.verifyEq(r.name(), name);
    this.verifyEq(r.dis(), ((this$) => { let $_u69 = dis; if ($_u69 != null) return $_u69; return name; })(this));
    this.verifyEq(r.addr().toStr(), addrStr);
    this.verifyEq(r.addr().type(), addrType);
    this.verifyEq(sys.ObjUtil.coerce(r.addr().num(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(addrNum, sys.Obj.type$.toNullable()));
    this.verifyEq(r.data(), data);
    this.verifyEq(r.unit(), unit);
    this.verifyDictEq(r.tags(), sys.ObjUtil.coerce(((this$) => { let $_u70 = tags; if ($_u70 != null) return $_u70; return haystack.Etc.emptyTags(); })(this), sys.Obj.type$));
    return;
  }

  testScale() {
    let a = ModbusScale.fromStr("+ 1.5");
    let b = ModbusScale.fromStr("- 100");
    let c = ModbusScale.fromStr("* 15");
    let d = ModbusScale.fromStr("* -6");
    let e = ModbusScale.fromStr("/18.42");
    let f = ModbusScale.fromStr("/-5");
    this.verifyScale(sys.ObjUtil.coerce(a, ModbusScale.type$), sys.ObjUtil.coerce(sys.Float.make(5.2), sys.Num.type$), sys.ObjUtil.coerce(sys.Float.make(6.7), sys.Num.type$));
    this.verifyScale(sys.ObjUtil.coerce(b, ModbusScale.type$), sys.ObjUtil.coerce(275, sys.Num.type$), sys.ObjUtil.coerce(175, sys.Num.type$));
    this.verifyScale(sys.ObjUtil.coerce(c, ModbusScale.type$), sys.ObjUtil.coerce(10, sys.Num.type$), sys.ObjUtil.coerce(150, sys.Num.type$));
    this.verifyScale(sys.ObjUtil.coerce(d, ModbusScale.type$), sys.ObjUtil.coerce(24, sys.Num.type$), sys.ObjUtil.coerce(-144, sys.Num.type$));
    this.verifyScale(sys.ObjUtil.coerce(e, ModbusScale.type$), sys.ObjUtil.coerce(sys.Float.make(92.1), sys.Num.type$), sys.ObjUtil.coerce(sys.Float.make(4.999999999999999), sys.Num.type$));
    this.verifyScale(sys.ObjUtil.coerce(f, ModbusScale.type$), sys.ObjUtil.coerce(sys.Float.make(25.0), sys.Num.type$), sys.ObjUtil.coerce(-5, sys.Num.type$));
    return;
  }

  verifyScale(scale,in$,out) {
    let nin = ((this$) => { if (sys.ObjUtil.is(in$, sys.Int.type$)) return haystack.Number.makeInt(sys.ObjUtil.coerce(in$, sys.Int.type$)); return haystack.Number.make(sys.ObjUtil.coerce(in$, sys.Float.type$)); })(this);
    let nout = ((this$) => { if (sys.ObjUtil.is(out, sys.Int.type$)) return haystack.Number.makeInt(sys.ObjUtil.coerce(out, sys.Int.type$)); return haystack.Number.make(sys.ObjUtil.coerce(out, sys.Float.type$)); })(this);
    this.verifyEq(scale.compute(sys.ObjUtil.coerce(nin, haystack.Number.type$)), nout);
    this.verifyEq(scale.inverse(sys.ObjUtil.coerce(nout, haystack.Number.type$)), nin);
    return;
  }

  static make() {
    const $self = new ModbusRegMapTest();
    ModbusRegMapTest.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxTest.make$($self);
    return;
  }

  static static$init() {
    ModbusRegMapTest.#coil = ModbusAddrType.coil();
    ModbusRegMapTest.#disInput = ModbusAddrType.discreteInput();
    ModbusRegMapTest.#inputReg = ModbusAddrType.inputReg();
    ModbusRegMapTest.#holdingReg = ModbusAddrType.holdingReg();
    ModbusRegMapTest.#bit = sys.ObjUtil.coerce(ModbusData.fromStr("bit"), ModbusData.type$);
    ModbusRegMapTest.#u2 = sys.ObjUtil.coerce(ModbusData.fromStr("u2"), ModbusData.type$);
    ModbusRegMapTest.#s4 = sys.ObjUtil.coerce(ModbusData.fromStr("s4"), ModbusData.type$);
    return;
  }

}

class ModbusDataTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusDataTest.type$; }

  testBits() {
    const this$ = this;
    let a = ModbusData.fromStr("bit");
    let b = ModbusData.fromStr("bit:0");
    let c = ModbusData.fromStr("bit:2");
    let d = ModbusData.fromStr("bit:15");
    this.verifyBits(sys.ObjUtil.coerce(a, ModbusBitData.type$), 0, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), false);
    this.verifyBits(sys.ObjUtil.coerce(a, ModbusBitData.type$), 0, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65520, sys.Obj.type$.toNullable())]), false);
    this.verifyBits(sys.ObjUtil.coerce(a, ModbusBitData.type$), 0, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]), true);
    this.verifyBits(sys.ObjUtil.coerce(a, ModbusBitData.type$), 0, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), true);
    this.verifyBits(sys.ObjUtil.coerce(b, ModbusBitData.type$), 0, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), false);
    this.verifyBits(sys.ObjUtil.coerce(b, ModbusBitData.type$), 0, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65520, sys.Obj.type$.toNullable())]), false);
    this.verifyBits(sys.ObjUtil.coerce(b, ModbusBitData.type$), 0, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]), true);
    this.verifyBits(sys.ObjUtil.coerce(b, ModbusBitData.type$), 0, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), true);
    this.verifyBits(sys.ObjUtil.coerce(c, ModbusBitData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), false);
    this.verifyBits(sys.ObjUtil.coerce(c, ModbusBitData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65520, sys.Obj.type$.toNullable())]), false);
    this.verifyBits(sys.ObjUtil.coerce(c, ModbusBitData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(7, sys.Obj.type$.toNullable())]), true);
    this.verifyBits(sys.ObjUtil.coerce(c, ModbusBitData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), true);
    this.verifyBits(sys.ObjUtil.coerce(d, ModbusBitData.type$), 15, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), false);
    this.verifyBits(sys.ObjUtil.coerce(d, ModbusBitData.type$), 15, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(32767, sys.Obj.type$.toNullable())]), false);
    this.verifyBits(sys.ObjUtil.coerce(d, ModbusBitData.type$), 15, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(32768, sys.Obj.type$.toNullable())]), true);
    this.verifyBits(sys.ObjUtil.coerce(d, ModbusBitData.type$), 15, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), true);
    this.verifyErr(sys.ParseErr.type$, (it) => {
      ModbusData.fromStr("bi");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      ModbusData.fromStr("bit/0");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      ModbusData.fromStr("bit2");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      ModbusData.fromStr("bit:4:");
      return;
    });
    this.verifyErr(sys.NullErr.type$, (it) => {
      a.fromRegs(sys.ObjUtil.coerce(sys.Int.type$.emptyList(), sys.Type.find("sys::Int[]")));
      return;
    });
    return;
  }

  verifyBits(data,pos,regs,val) {
    this.verifyEq(data.kind(), haystack.Kind.bool());
    this.verifyEq(sys.ObjUtil.coerce(data.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(data.pos(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(pos, sys.Obj.type$.toNullable()));
    this.verifyEq(data.fromRegs(regs), sys.ObjUtil.coerce(val, sys.Obj.type$.toNullable()));
    return;
  }

  testInts() {
    let u1 = ModbusData.fromStr("u1");
    let u2 = ModbusData.fromStr("u2");
    let u4 = ModbusData.fromStr("u4");
    this.verifyInt(sys.ObjUtil.coerce(u1, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(u1, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]), 1);
    this.verifyInt(sys.ObjUtil.coerce(u1, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable())]), 128);
    this.verifyInt(sys.ObjUtil.coerce(u1, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable())]), 255);
    this.verifyInt(sys.ObjUtil.coerce(u1, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), 255, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable())]));
    this.verifyInt(sys.ObjUtil.coerce(u2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(u2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable())]), 255);
    this.verifyInt(sys.ObjUtil.coerce(u2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(32768, sys.Obj.type$.toNullable())]), 32768);
    this.verifyInt(sys.ObjUtil.coerce(u2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), 65535);
    this.verifyInt(sys.ObjUtil.coerce(u4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(u4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable())]), 255);
    this.verifyInt(sys.ObjUtil.coerce(u4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(32768, sys.Obj.type$.toNullable())]), 32768);
    this.verifyInt(sys.ObjUtil.coerce(u4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), 65535);
    this.verifyInt(sys.ObjUtil.coerce(u4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), 4294967295);
    let s1 = ModbusData.fromStr("s1");
    let s2 = ModbusData.fromStr("s2");
    let s4 = ModbusData.fromStr("s4");
    let s8 = ModbusData.fromStr("s8");
    this.verifyInt(sys.ObjUtil.coerce(s1, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(s1, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable())]), 10);
    this.verifyInt(sys.ObjUtil.coerce(s1, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(127, sys.Obj.type$.toNullable())]), 127);
    this.verifyInt(sys.ObjUtil.coerce(s1, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable())]), -128, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65408, sys.Obj.type$.toNullable())]));
    this.verifyInt(sys.ObjUtil.coerce(s1, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable())]), -1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]));
    this.verifyInt(sys.ObjUtil.coerce(s1, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), -1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]));
    this.verifyInt(sys.ObjUtil.coerce(s2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(s2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable())]), 10);
    this.verifyInt(sys.ObjUtil.coerce(s2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(127, sys.Obj.type$.toNullable())]), 127);
    this.verifyInt(sys.ObjUtil.coerce(s2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable())]), 128);
    this.verifyInt(sys.ObjUtil.coerce(s2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable())]), 255);
    this.verifyInt(sys.ObjUtil.coerce(s2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(32767, sys.Obj.type$.toNullable())]), 32767);
    this.verifyInt(sys.ObjUtil.coerce(s2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(32768, sys.Obj.type$.toNullable())]), -32768);
    this.verifyInt(sys.ObjUtil.coerce(s2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), -1);
    this.verifyInt(sys.ObjUtil.coerce(s4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(s4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable())]), 10);
    this.verifyInt(sys.ObjUtil.coerce(s4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(32767, sys.Obj.type$.toNullable())]), 32767);
    this.verifyInt(sys.ObjUtil.coerce(s4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(32768, sys.Obj.type$.toNullable())]), 32768);
    this.verifyInt(sys.ObjUtil.coerce(s4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(32767, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), 2147483647);
    this.verifyInt(sys.ObjUtil.coerce(s4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(32768, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), -2147483648);
    this.verifyInt(sys.ObjUtil.coerce(s4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), -1);
    this.verifyInt(sys.ObjUtil.coerce(s8, ModbusIntData.type$), 4, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(s8, ModbusIntData.type$), 4, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65290, sys.Obj.type$.toNullable())]), 4294967050);
    this.verifyInt(sys.ObjUtil.coerce(s8, ModbusIntData.type$), 4, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(32767, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), sys.Int.maxVal());
    this.verifyInt(sys.ObjUtil.coerce(s8, ModbusIntData.type$), 4, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(32768, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.Int.minVal());
    this.verifyInt(sys.ObjUtil.coerce(s8, ModbusIntData.type$), 4, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), -1);
    return;
  }

  testIntWriteRaw() {
    const this$ = this;
    let u1 = ModbusData.fromStr("u1");
    let u2 = ModbusData.fromStr("u2");
    let u4 = ModbusData.fromStr("u4");
    this.verifyIntWrite(sys.ObjUtil.coerce(u1, ModbusIntData.type$), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable())]), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable())]));
    this.verifyIntWrite(sys.ObjUtil.coerce(u2, ModbusIntData.type$), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable())]), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable())]));
    this.verifyIntWrite(sys.ObjUtil.coerce(u4, ModbusIntData.type$), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable())]), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable())]));
    this.verifyIntWrite(sys.ObjUtil.coerce(u1, ModbusIntData.type$), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(45, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(80, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable())]), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(45, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(80, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable())]));
    this.verifyIntWrite(sys.ObjUtil.coerce(u2, ModbusIntData.type$), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(45, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(80, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable())]), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(45, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(80, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable())]));
    this.verifyIntWrite(sys.ObjUtil.coerce(u4, ModbusIntData.type$), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(45, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(80, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable())]), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(45, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(80, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable())]));
    this.verifyIntWrite(sys.ObjUtil.coerce(u4, ModbusIntData.type$), "a0b1c2d3e4f5", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(41137, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(49875, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(58613, sys.Obj.type$.toNullable())]));
    this.verifyErr(sys.ArgErr.type$, (it) => {
      this$.verifyIntWrite(sys.ObjUtil.coerce(u4, ModbusIntData.type$), "a0b1c2", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(41137, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(194, sys.Obj.type$.toNullable())]));
      return;
    });
    return;
  }

  testIntsLittleEndian() {
    let u1 = ModbusData.fromStr("u1le");
    let u1b = ModbusData.fromStr("u1leb");
    let u1w = ModbusData.fromStr("u1lew");
    this.verifyInt(sys.ObjUtil.coerce(u1, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(u1, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(256, sys.Obj.type$.toNullable())]), 1);
    this.verifyInt(sys.ObjUtil.coerce(u1, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(32768, sys.Obj.type$.toNullable())]), 128);
    this.verifyInt(sys.ObjUtil.coerce(u1, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65280, sys.Obj.type$.toNullable())]), 255);
    this.verifyInt(sys.ObjUtil.coerce(u1b, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(u1b, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(256, sys.Obj.type$.toNullable())]), 1);
    this.verifyInt(sys.ObjUtil.coerce(u1b, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(32768, sys.Obj.type$.toNullable())]), 128);
    this.verifyInt(sys.ObjUtil.coerce(u1b, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65280, sys.Obj.type$.toNullable())]), 255);
    this.verifyInt(sys.ObjUtil.coerce(u1w, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(u1w, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]), 1);
    this.verifyInt(sys.ObjUtil.coerce(u1w, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable())]), 128);
    this.verifyInt(sys.ObjUtil.coerce(u1w, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable())]), 255);
    let u2 = ModbusData.fromStr("u2le");
    let u2b = ModbusData.fromStr("u2leb");
    let u2w = ModbusData.fromStr("u2lew");
    this.verifyInt(sys.ObjUtil.coerce(u2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(u2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65280, sys.Obj.type$.toNullable())]), 255);
    this.verifyInt(sys.ObjUtil.coerce(u2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable())]), 32768);
    this.verifyInt(sys.ObjUtil.coerce(u2, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), 65535);
    this.verifyInt(sys.ObjUtil.coerce(u2b, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(u2b, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65280, sys.Obj.type$.toNullable())]), 255);
    this.verifyInt(sys.ObjUtil.coerce(u2b, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable())]), 32768);
    this.verifyInt(sys.ObjUtil.coerce(u2b, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), 65535);
    this.verifyInt(sys.ObjUtil.coerce(u2w, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(u2w, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable())]), 255);
    this.verifyInt(sys.ObjUtil.coerce(u2w, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(32768, sys.Obj.type$.toNullable())]), 32768);
    this.verifyInt(sys.ObjUtil.coerce(u2w, ModbusIntData.type$), 1, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), 65535);
    let u4 = ModbusData.fromStr("u4le");
    let u4b = ModbusData.fromStr("u4leb");
    let u4w = ModbusData.fromStr("u4lew");
    this.verifyInt(sys.ObjUtil.coerce(u4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(u4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65280, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 255);
    this.verifyInt(sys.ObjUtil.coerce(u4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 32768);
    this.verifyInt(sys.ObjUtil.coerce(u4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 65535);
    this.verifyInt(sys.ObjUtil.coerce(u4, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), 4294967295);
    this.verifyInt(sys.ObjUtil.coerce(u4b, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(u4b, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65280, sys.Obj.type$.toNullable())]), 255);
    this.verifyInt(sys.ObjUtil.coerce(u4b, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable())]), 32768);
    this.verifyInt(sys.ObjUtil.coerce(u4b, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), 65535);
    this.verifyInt(sys.ObjUtil.coerce(u4b, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), 4294967295);
    this.verifyInt(sys.ObjUtil.coerce(u4w, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 0);
    this.verifyInt(sys.ObjUtil.coerce(u4w, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 255);
    this.verifyInt(sys.ObjUtil.coerce(u4w, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(32768, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 32768);
    this.verifyInt(sys.ObjUtil.coerce(u4w, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), 65535);
    this.verifyInt(sys.ObjUtil.coerce(u4w, ModbusIntData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]), 4294967295);
    return;
  }

  verifyInt(data,size,regs,val,check) {
    if (check === undefined) check = regs;
    let num = haystack.Number.makeInt(val);
    this.verifyEq(data.kind(), haystack.Kind.number());
    this.verifyEq(sys.ObjUtil.coerce(data.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(size, sys.Obj.type$.toNullable()));
    this.verifyEq(data.fromRegs(regs), num);
    this.verifyEq(data.toRegs(sys.ObjUtil.coerce(num, sys.Obj.type$)), check);
    return;
  }

  verifyIntWrite(data,raw,check) {
    const this$ = this;
    let val = null;
    if (sys.ObjUtil.is(raw, sys.Int.type$)) {
      (val = haystack.Number.makeInt(sys.ObjUtil.coerce(val, sys.Int.type$)));
    }
    ;
    if (sys.ObjUtil.is(raw, sys.Type.find("sys::Int[]"))) {
      let nums = sys.List.make(haystack.Number.type$);
      sys.ObjUtil.coerce(raw, sys.Type.find("sys::Int[]")).each((i) => {
        nums.add(sys.ObjUtil.coerce(haystack.Number.makeInt(i), haystack.Number.type$));
        return;
      });
      (val = nums);
    }
    ;
    if (sys.ObjUtil.is(raw, sys.Str.type$)) {
      (val = raw);
    }
    ;
    this.verifyEq(data.kind(), haystack.Kind.number());
    this.verifyEq(data.toRegs(sys.ObjUtil.coerce(val, sys.Obj.type$)), check);
    return;
  }

  testFloats() {
    let f4 = ModbusData.fromStr("f4");
    let f8 = ModbusData.fromStr("f8");
    this.verifyFloat(sys.ObjUtil.coerce(f4, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.Float.make(0.0));
    this.verifyFloat(sys.ObjUtil.coerce(f4, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(16320, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.Float.make(1.5));
    this.verifyFloat(sys.ObjUtil.coerce(f4, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(49088, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.Float.make(-1.5));
    this.verifyFloat(sys.ObjUtil.coerce(f4, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(17427, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(16384, sys.Obj.type$.toNullable())]), sys.Float.make(589.0));
    this.verifyFloat(sys.ObjUtil.coerce(f8, ModbusFloatData.type$), 4, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.Float.make(0.0));
    this.verifyFloat(sys.ObjUtil.coerce(f8, ModbusFloatData.type$), 4, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(16393, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.Float.make(3.125));
    this.verifyFloat(sys.ObjUtil.coerce(f8, ModbusFloatData.type$), 4, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(49161, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.Float.make(-3.125));
    this.verifyFloat(sys.ObjUtil.coerce(f8, ModbusFloatData.type$), 4, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(32752, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.Float.posInf());
    this.verifyFloat(sys.ObjUtil.coerce(f8, ModbusFloatData.type$), 4, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65520, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.Float.negInf());
    return;
  }

  testFloatsLittleEndian() {
    let f4 = ModbusData.fromStr("f4le");
    let f4b = ModbusData.fromStr("f4leb");
    let f4w = ModbusData.fromStr("f4lew");
    this.verifyFloat(sys.ObjUtil.coerce(f4, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.Float.make(0.0));
    this.verifyFloat(sys.ObjUtil.coerce(f4, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(49215, sys.Obj.type$.toNullable())]), sys.Float.make(1.5));
    this.verifyFloat(sys.ObjUtil.coerce(f4, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(49343, sys.Obj.type$.toNullable())]), sys.Float.make(-1.5));
    this.verifyFloat(sys.ObjUtil.coerce(f4, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(64, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4932, sys.Obj.type$.toNullable())]), sys.Float.make(589.0));
    this.verifyFloat(sys.ObjUtil.coerce(f4w, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.Float.make(0.0));
    this.verifyFloat(sys.ObjUtil.coerce(f4w, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(16320, sys.Obj.type$.toNullable())]), sys.Float.make(1.5));
    this.verifyFloat(sys.ObjUtil.coerce(f4w, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(49088, sys.Obj.type$.toNullable())]), sys.Float.make(-1.5));
    this.verifyFloat(sys.ObjUtil.coerce(f4w, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(16384, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(17427, sys.Obj.type$.toNullable())]), sys.Float.make(589.0));
    this.verifyFloat(sys.ObjUtil.coerce(f4b, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.Float.make(0.0));
    this.verifyFloat(sys.ObjUtil.coerce(f4b, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(49215, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.Float.make(1.5));
    this.verifyFloat(sys.ObjUtil.coerce(f4b, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(49343, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.Float.make(-1.5));
    this.verifyFloat(sys.ObjUtil.coerce(f4b, ModbusFloatData.type$), 2, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(4932, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(64, sys.Obj.type$.toNullable())]), sys.Float.make(589.0));
    return;
  }

  verifyFloat(data,size,regs,val) {
    this.verifyEq(data.kind(), haystack.Kind.number());
    this.verifyEq(sys.ObjUtil.coerce(data.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(size, sys.Obj.type$.toNullable()));
    this.verifyEq(data.fromRegs(regs), haystack.Number.make(val));
    return;
  }

  static make() {
    const $self = new ModbusDataTest();
    ModbusDataTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class ModbusBlockTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ModbusBlockTest.type$; }

  testBasics() {
    let a = this.reg("a", "40001", "u2");
    let b = this.reg("b", "40002", "u2");
    let c = this.reg("c", "40003", "u2");
    let d = this.reg("d", "40004", "u2");
    let e = this.reg("e", "40005", "u2");
    let f = this.reg("f", "40006", "u2");
    let blocks = ModbusBlock.optimize(sys.List.make(ModbusReg.type$, [a, b, c, d, e]));
    this.verifyEq(sys.ObjUtil.coerce(blocks.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(blocks.get(0).regs(), sys.List.make(ModbusReg.type$, [a, b, c, d, e]));
    (blocks = ModbusBlock.optimize(sys.List.make(ModbusReg.type$, [a, b, c, e, f])));
    this.verifyEq(sys.ObjUtil.coerce(blocks.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(blocks.get(0).regs(), sys.List.make(ModbusReg.type$, [a, b, c]));
    this.verifyEq(blocks.get(1).regs(), sys.List.make(ModbusReg.type$, [e, f]));
    (blocks = ModbusBlock.optimize(sys.List.make(ModbusReg.type$, [a, b, c, e, f]), 1));
    this.verifyEq(sys.ObjUtil.coerce(blocks.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(blocks.get(0).regs(), sys.List.make(ModbusReg.type$, [a, b, c, e, f]));
    (blocks = ModbusBlock.optimize(sys.List.make(ModbusReg.type$, [a, b, c, d]), 0, 1));
    this.verifyEq(sys.ObjUtil.coerce(blocks.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(blocks.get(0).regs(), sys.List.make(ModbusReg.type$, [a]));
    this.verifyEq(blocks.get(1).regs(), sys.List.make(ModbusReg.type$, [b]));
    this.verifyEq(blocks.get(2).regs(), sys.List.make(ModbusReg.type$, [c]));
    this.verifyEq(blocks.get(3).regs(), sys.List.make(ModbusReg.type$, [d]));
    (blocks = ModbusBlock.optimize(sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("hxModbus::ModbusReg[]"))));
    this.verifyEq(sys.ObjUtil.coerce(blocks.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    return;
  }

  testRegTypes() {
    let c1 = this.reg("c1", "00001", "u2");
    let c2 = this.reg("c2", "09999", "u2");
    let d1 = this.reg("d1", "10001", "u2");
    let d2 = this.reg("d2", "19999", "u2");
    let i1 = this.reg("i1", "30001", "u2");
    let i2 = this.reg("i2", "39999", "u2");
    let h1 = this.reg("h1", "40001", "u2");
    let h2 = this.reg("h2", "49999", "u2");
    let blocks = ModbusBlock.optimize(sys.List.make(ModbusReg.type$, [h2, h1, c1, c2, i1, i2, d1, d2]), 10000, 10000);
    this.verifyEq(sys.ObjUtil.coerce(blocks.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(blocks.get(0).regs(), sys.List.make(ModbusReg.type$, [c1, c2]));
    this.verifyEq(blocks.get(1).regs(), sys.List.make(ModbusReg.type$, [d1, d2]));
    this.verifyEq(blocks.get(2).regs(), sys.List.make(ModbusReg.type$, [i1, i2]));
    this.verifyEq(blocks.get(3).regs(), sys.List.make(ModbusReg.type$, [h1, h2]));
    return;
  }

  testDataTypes() {
    let a = this.reg("a", "40001", "u2");
    let b = this.reg("b", "40002", "u1");
    let c = this.reg("c", "40003", "u4");
    let d = this.reg("d", "40005", "u2");
    let e = this.reg("e", "40006", "bit:1");
    let f = this.reg("f", "40006", "bit:2");
    let g = this.reg("g", "40007", "f8");
    let h = this.reg("h", "40010", "s4");
    let blocks = ModbusBlock.optimize(sys.List.make(ModbusReg.type$, [a, b, c, d, e, f, g, h]));
    this.verifyEq(sys.ObjUtil.coerce(blocks.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(blocks.get(0).start(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(blocks.get(0).size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(11, sys.Obj.type$.toNullable()));
    (blocks = ModbusBlock.optimize(sys.List.make(ModbusReg.type$, [c]), 0, 1));
    this.verifyEq(sys.ObjUtil.coerce(blocks.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(blocks.get(0).start(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(blocks.get(0).size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    (blocks = ModbusBlock.optimize(sys.List.make(ModbusReg.type$, [a, b, c]), 0, 1));
    this.verifyEq(sys.ObjUtil.coerce(blocks.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(blocks.get(2).start(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(blocks.get(2).size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    (blocks = ModbusBlock.optimize(sys.List.make(ModbusReg.type$, [g, h]), 0, 1));
    this.verifyEq(sys.ObjUtil.coerce(blocks.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(blocks.get(0).start(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(7, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(blocks.get(0).size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    return;
  }

  reg(name,addr,data) {
    const this$ = this;
    return ModbusReg.make((it) => {
      it.__name(name);
      it.__addr(sys.ObjUtil.coerce(ModbusAddr.fromStr(addr), ModbusAddr.type$));
      it.__data(sys.ObjUtil.coerce(ModbusData.fromStr(data), ModbusData.type$));
      it.__readable(true);
      it.__writable(true);
      return;
    });
  }

  static make() {
    const $self = new ModbusBlockTest();
    ModbusBlockTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

const p = sys.Pod.add$('hxModbus');
const xp = sys.Param.noParams$();
let m;
ModbusLib.type$ = p.at$('ModbusLib','hxConn::ConnLib',[],{},8194,ModbusLib);
ModbusDispatch.type$ = p.at$('ModbusDispatch','hxConn::ConnDispatch',[],{},8192,ModbusDispatch);
TcpTest.type$ = p.at$('TcpTest','sys::Obj',[],{'sys::NoDoc':""},8192,TcpTest);
ModbusFuncs.type$ = p.at$('ModbusFuncs','sys::Obj',[],{},8194,ModbusFuncs);
ModbusRegMap.type$ = p.at$('ModbusRegMap','sys::Obj',[],{},8194,ModbusRegMap);
ModbusBlock.type$ = p.at$('ModbusBlock','sys::Obj',[],{'sys::NoDoc':""},8194,ModbusBlock);
ModbusLink.type$ = p.at$('ModbusLink','sys::Obj',[],{'sys::NoDoc':""},8194,ModbusLink);
ModbusLinkMgr.type$ = p.at$('ModbusLinkMgr','sys::Obj',[],{'sys::NoDoc':""},130,ModbusLinkMgr);
ModbusDev.type$ = p.at$('ModbusDev','sys::Obj',[],{'sys::NoDoc':""},8194,ModbusDev);
ModbusReg.type$ = p.at$('ModbusReg','sys::Obj',[],{'sys::Js':""},8194,ModbusReg);
ModbusAddr.type$ = p.at$('ModbusAddr','sys::Obj',[],{'sys::Js':""},8194,ModbusAddr);
ModbusAddrType.type$ = p.at$('ModbusAddrType','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,ModbusAddrType);
ModbusData.type$ = p.at$('ModbusData','sys::Obj',[],{'sys::Js':""},8195,ModbusData);
ModbusBitData.type$ = p.at$('ModbusBitData','hxModbus::ModbusData',[],{'sys::Js':""},8194,ModbusBitData);
ModbusNumData.type$ = p.at$('ModbusNumData','hxModbus::ModbusData',[],{'sys::Js':""},8195,ModbusNumData);
ModbusIntData.type$ = p.at$('ModbusIntData','hxModbus::ModbusNumData',[],{'sys::Js':""},8194,ModbusIntData);
ModbusFloatData.type$ = p.at$('ModbusFloatData','hxModbus::ModbusNumData',[],{'sys::Js':""},8194,ModbusFloatData);
ModbusScale.type$ = p.at$('ModbusScale','sys::Obj',[],{'sys::Js':""},8194,ModbusScale);
ModbusTransport.type$ = p.at$('ModbusTransport','sys::Obj',[],{'sys::NoDoc':""},8193,ModbusTransport);
ModbusTcpTransport.type$ = p.at$('ModbusTcpTransport','hxModbus::ModbusTransport',[],{'sys::NoDoc':""},8192,ModbusTcpTransport);
ModbusRtuTcpTransport.type$ = p.at$('ModbusRtuTcpTransport','hxModbus::ModbusTransport',[],{'sys::NoDoc':""},8192,ModbusRtuTcpTransport);
ModbusRtuTransport.type$ = p.at$('ModbusRtuTransport','hxModbus::ModbusTransport',[],{'sys::NoDoc':""},8192,ModbusRtuTransport);
ModbusInStream.type$ = p.at$('ModbusInStream','sys::InStream',[],{'sys::NoDoc':""},8192,ModbusInStream);
ModbusMaster.type$ = p.at$('ModbusMaster','sys::Obj',[],{'sys::NoDoc':""},8192,ModbusMaster);
ModbusMasterTest.type$ = p.at$('ModbusMasterTest','sys::Test',[],{},128,ModbusMasterTest);
ModbusTestTransport.type$ = p.at$('ModbusTestTransport','hxModbus::ModbusTransport',[],{},128,ModbusTestTransport);
ModbusRegMapTest.type$ = p.at$('ModbusRegMapTest','hx::HxTest',[],{},8192,ModbusRegMapTest);
ModbusDataTest.type$ = p.at$('ModbusDataTest','sys::Test',[],{},128,ModbusDataTest);
ModbusBlockTest.type$ = p.at$('ModbusBlockTest','sys::Test',[],{},128,ModbusBlockTest);
ModbusLib.type$.am$('cur',40962,'hxModbus::ModbusLib?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('onStart',271360,'sys::Void',xp,{}).am$('onStop',271360,'sys::Void',xp,{}).am$('onLearn',271360,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxConn::Conn',false),new sys.Param('arg','sys::Obj?',false)]),{}).am$('read',128,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('regs','sys::Str[]',false)]),{}).am$('write',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('reg','sys::Str',false),new sys.Param('val','sys::Obj',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ModbusDispatch.type$.af$('defGaps',100354,'haystack::Number',{}).af$('defMax',100354,'haystack::Number',{}).af$('dev',67584,'hxModbus::ModbusDev?',{}).af$('link',67584,'hxModbus::ModbusLink?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj',false)]),{}).am$('onReceive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('onOpen',271360,'sys::Void',xp,{}).am$('onClose',271360,'sys::Void',xp,{}).am$('onPing',271360,'haystack::Dict',xp,{}).am$('onSyncCur',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('mread',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('regNames','sys::Str[]',false)]),{}).am$('toBlocks',2048,'hxModbus::ModbusBlock[]',sys.List.make(sys.Param.type$,[new sys.Param('regs','hxModbus::ModbusReg[]',false)]),{}).am$('resolveConfigNum',2048,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false),new sys.Param('def','haystack::Number',false)]),{}).am$('mapToRegs',2048,'hxModbus::ModbusReg[]',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('updateVals',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false),new sys.Param('block','hxModbus::ModbusBlock',false)]),{}).am$('mwrite',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('regName','sys::Str',false),new sys.Param('val','sys::Obj',false)]),{}).am$('onWrite',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('event','hxConn::ConnWriteInfo',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
TcpTest.type$.am$('main',8192,'sys::Void',xp,{}).am$('fatal',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('usage',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
ModbusFuncs.type$.am$('cx',34818,'hx::HxContext',xp,{}).am$('modbusPing',40962,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false)]),{'sys::Deprecated':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('modbusLearn',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('arg','sys::Obj?',true)]),{'sys::Deprecated':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('modbusSyncCur',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('points','sys::Obj',false)]),{'sys::Deprecated':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('modbusRead',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('regs','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('modbusWrite',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('reg','sys::Str',false),new sys.Param('val','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('modbusRegMap',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{'axon::Axon':""}).am$('modbusRegMaps',40962,'haystack::Grid',xp,{'axon::Axon':""}).am$('modbusRegMapList',40962,'haystack::Grid',xp,{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('modbusRegMapSave',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('src','sys::Str',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('modbusRegMapMove',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('oldName','sys::Str',false),new sys.Param('newName','sys::Str',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('modbusRegMapDelete',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('names','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('regMapDir',34818,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ModbusRegMap.type$.af$('fileCache',100354,'concurrent::AtomicRef',{}).af$('regs',73730,'hxModbus::ModbusReg[]',{}).af$('file',67586,'sys::File',{}).af$('modified',67586,'sys::DateTime',{}).af$('byName',67586,'[sys::Str:hxModbus::ModbusReg]',{}).am$('fromConn',40962,'hxModbus::ModbusRegMap',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false),new sys.Param('rec','haystack::Dict',false)]),{}).am$('uriToFile',32898,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false),new sys.Param('uri','sys::Uri',false)]),{}).am$('fromFile',40962,'hxModbus::ModbusRegMap',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('parseFile',34818,'hxModbus::ModbusRegMap',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('csvColIndex',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('row','sys::Str[]',false),new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('regs','hxModbus::ModbusReg[]',false)]),{}).am$('reg',8192,'hxModbus::ModbusReg?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ModbusBlock.type$.af$('type',73730,'hxModbus::ModbusAddrType',{}).af$('regs',73730,'hxModbus::ModbusReg[]',{}).af$('valsRef',67586,'concurrent::AtomicRef',{}).am$('optimize',40962,'hxModbus::ModbusBlock[]',sys.List.make(sys.Param.type$,[new sys.Param('regs','hxModbus::ModbusReg[]',false),new sys.Param('gap','sys::Int',true),new sys.Param('max','sys::Int',true)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('regs','hxModbus::ModbusReg[]',false)]),{}).am$('start',8192,'sys::Int',xp,{}).am$('size',8192,'sys::Int',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('vals',8192,'sys::Obj[]',xp,{}).am$('resolve',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('raw','sys::Obj[]',false)]),{}).am$('resolveErr',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err',false)]),{});
ModbusLink.type$.af$('_touched',67586,'concurrent::AtomicInt',{}).af$('lib',67586,'hxModbus::ModbusLib',{}).af$('uri',67586,'sys::Uri',{}).af$('name',67586,'sys::Str',{}).af$('actor',67586,'concurrent::Actor',{}).am$('get',40962,'hxModbus::ModbusLink',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pool','concurrent::ActorPool',false),new sys.Param('lib','hxModbus::ModbusLib',false),new sys.Param('uri','sys::Uri',false)]),{'sys::NoDoc':""}).am$('touched',8192,'sys::Int',xp,{}).am$('ping',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dev','hxModbus::ModbusDev',false)]),{}).am$('read',8192,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('dev','hxModbus::ModbusDev',false),new sys.Param('reg','hxModbus::ModbusReg',false)]),{}).am$('readBlock',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dev','hxModbus::ModbusDev',false),new sys.Param('block','hxModbus::ModbusBlock',false)]),{}).am$('write',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dev','hxModbus::ModbusDev',false),new sys.Param('reg','hxModbus::ModbusReg',false),new sys.Param('val','sys::Obj',false)]),{}).am$('close',128,'sys::Void',xp,{}).am$('actorReceive',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('m','hx::HxMsg',false)]),{}).am$('_open',2048,'hxModbus::ModbusMaster',sys.List.make(sys.Param.type$,[new sys.Param('dev','hxModbus::ModbusDev',false)]),{}).am$('_close',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('master','hxModbus::ModbusMaster?',false)]),{}).am$('_read',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('master','hxModbus::ModbusMaster',false),new sys.Param('dev','hxModbus::ModbusDev',false),new sys.Param('block','hxModbus::ModbusBlock',false)]),{}).am$('_write',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('master','hxModbus::ModbusMaster',false),new sys.Param('dev','hxModbus::ModbusDev',false),new sys.Param('reg','hxModbus::ModbusReg',false),new sys.Param('val','sys::Obj',false)]),{});
ModbusLinkMgr.type$.af$('curRef',100354,'concurrent::AtomicRef',{}).af$('poll',67586,'hx::HxMsg',{}).af$('pollFreq',67586,'sys::Duration',{}).af$('staleTime',67586,'sys::Int',{}).af$('lib',67586,'hxModbus::ModbusLib',{}).af$('pool',67586,'concurrent::ActorPool',{}).af$('actor',67586,'concurrent::Actor',{}).am$('init',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxModbus::ModbusLib',false)]),{}).am$('stop',40962,'sys::Void',xp,{}).am$('cur',40962,'hxModbus::ModbusLinkMgr',xp,{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxModbus::ModbusLib',false)]),{}).am$('open',8192,'hxModbus::ModbusLink',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('actorReceive',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('m','hx::HxMsg',false)]),{}).am$('_check',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Uri:hxModbus::ModbusLink]',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ModbusDev.type$.af$('uri',73730,'sys::Uri',{}).af$('slave',73730,'sys::Int',{}).af$('regMap',73730,'hxModbus::ModbusRegMap',{}).af$('forceWriteMultiple',73730,'sys::Bool',{}).af$('readTimeout',73730,'sys::Duration',{}).af$('writeTimeout',73730,'sys::Duration',{}).af$('timeout',73730,'sys::Duration',{}).af$('log',73730,'sys::Log?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('fromConn',40966,'hxModbus::ModbusDev?',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxConn::Conn',false)]),{}).am$('loadRegMap',34818,'hxModbus::ModbusRegMap',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false),new sys.Param('uri','sys::Uri',false)]),{}).am$('toDuration',2048,'sys::Duration',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('tag','sys::Str',false),new sys.Param('def','sys::Duration',false)]),{});
ModbusReg.type$.af$('name',73730,'sys::Str',{}).af$('dis',73730,'sys::Str',{}).af$('addr',73730,'hxModbus::ModbusAddr',{}).af$('data',73730,'hxModbus::ModbusData',{}).af$('size',73730,'sys::Int',{}).af$('readable',73730,'sys::Bool',{}).af$('writable',73730,'sys::Bool',{}).af$('scale',73730,'hxModbus::ModbusScale?',{}).af$('unit',73730,'sys::Unit?',{}).af$('tags',73730,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
ModbusAddr.type$.af$('type',73730,'hxModbus::ModbusAddrType',{}).af$('num',73730,'sys::Int',{}).af$('qnum',73730,'sys::Int',{}).am$('fromStr',40966,'hxModbus::ModbusAddr?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','hxModbus::ModbusAddrType',false),new sys.Param('num','sys::Int',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
ModbusAddrType.type$.af$('coil',106506,'hxModbus::ModbusAddrType',{}).af$('discreteInput',106506,'hxModbus::ModbusAddrType',{}).af$('inputReg',106506,'hxModbus::ModbusAddrType',{}).af$('holdingReg',106506,'hxModbus::ModbusAddrType',{}).af$('vals',106498,'hxModbus::ModbusAddrType[]',{}).am$('isBool',8192,'sys::Bool',xp,{}).am$('isNum',8192,'sys::Bool',xp,{}).am$('fromPrefixChar',32902,'hxModbus::ModbusAddrType?',sys.List.make(sys.Param.type$,[new sys.Param('char','sys::Int',false)]),{}).am$('toPrefixChar',8192,'sys::Int',xp,{}).am$('toLocale',8192,'sys::Str',xp,{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'hxModbus::ModbusAddrType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ModbusData.type$.af$('map',100354,'[sys::Str:hxModbus::ModbusData]',{}).am$('fromStr',40962,'hxModbus::ModbusData?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('name',270337,'sys::Str',xp,{}).am$('kind',270337,'haystack::Kind',xp,{}).am$('size',270337,'sys::Int',xp,{}).am$('fromRegs',270337,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('regs','sys::Int[]',false),new sys.Param('unit','sys::Unit?',true)]),{}).am$('toRegs',270337,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
ModbusBitData.type$.af$('name',336898,'sys::Str',{}).af$('kind',336898,'haystack::Kind',{}).af$('size',336898,'sys::Int',{}).af$('pos',73730,'sys::Int',{}).af$('mask',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('fromRegs',271360,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('regs','sys::Int[]',false),new sys.Param('unit','sys::Unit?',true)]),{}).am$('toRegs',271360,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{});
ModbusNumData.type$.af$('name',336898,'sys::Str',{}).af$('base',73730,'sys::Str',{}).af$('size',336898,'sys::Int',{}).af$('kind',336898,'haystack::Kind',{}).af$('wordBig',73730,'sys::Bool',{}).af$('byteBig',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('toBits',4096,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('regs','sys::Int[]',false)]),{}).am$('fromBits',4096,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('bits','sys::Int',false)]),{}).am$('swapBytes',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('w','sys::Int',false)]),{});
ModbusIntData.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('fromRegs',271360,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('regs','sys::Int[]',false),new sys.Param('unit','sys::Unit?',true)]),{}).am$('toRegs',271360,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{});
ModbusFloatData.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('fromRegs',271360,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('regs','sys::Int[]',false),new sys.Param('unit','sys::Unit?',true)]),{}).am$('toRegs',271360,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{});
ModbusScale.type$.af$('op',73730,'sys::Int',{}).af$('factor',73730,'haystack::Number',{}).af$('ops',100354,'sys::Int[]',{}).am$('fromStr',40966,'hxModbus::ModbusScale?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('compute',8192,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('in','haystack::Number',false),new sys.Param('factor','haystack::Number?',true)]),{}).am$('inverse',8192,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('in','haystack::Number',false),new sys.Param('factor','haystack::Number?',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ModbusTransport.type$.af$('log',65664,'sys::Log?',{}).am$('useCrc',270336,'sys::Bool',xp,{}).am$('open',270337,'sys::Void',xp,{}).am$('close',270337,'sys::Void',xp,{}).am$('req',270337,'hxModbus::ModbusInStream',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Buf',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ModbusTcpTransport.type$.af$('host',73730,'inet::IpAddr',{}).af$('port',73730,'sys::Int',{}).af$('socketConfig',73730,'inet::SocketConfig',{}).af$('socket',67584,'inet::TcpSocket?',{}).af$('txId',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('host','inet::IpAddr',false),new sys.Param('port','sys::Int?',false),new sys.Param('timeout','sys::Duration',false)]),{}).am$('useCrc',271360,'sys::Bool',xp,{}).am$('open',271360,'sys::Void',xp,{}).am$('close',271360,'sys::Void',xp,{}).am$('req',271360,'hxModbus::ModbusInStream',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Buf',false)]),{});
ModbusRtuTcpTransport.type$.af$('host',73730,'inet::IpAddr',{}).af$('port',73730,'sys::Int',{}).af$('socketConfig',73730,'inet::SocketConfig',{}).af$('socket',67584,'inet::TcpSocket?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('host','inet::IpAddr',false),new sys.Param('port','sys::Int?',false),new sys.Param('timeout','sys::Duration',false)]),{}).am$('open',271360,'sys::Void',xp,{}).am$('close',271360,'sys::Void',xp,{}).am$('req',271360,'hxModbus::ModbusInStream',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Buf',false)]),{});
ModbusRtuTransport.type$.af$('port',67584,'hxPlatformSerial::SerialSocket',{}).af$('frameDelay',67586,'sys::Duration',{}).af$('timeout',67586,'sys::Duration',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('port','hxPlatformSerial::SerialSocket',false),new sys.Param('frameDelay','sys::Duration',true)]),{}).am$('open',271360,'sys::Void',xp,{}).am$('close',271360,'sys::Void',xp,{}).am$('req',271360,'hxModbus::ModbusInStream',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Buf',false)]),{});
ModbusInStream.type$.af$('log',67584,'sys::Log?',{}).af$('label',67586,'sys::Str',{}).af$('data',73728,'sys::Buf',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream?',false),new sys.Param('log','sys::Log?',false),new sys.Param('label','sys::Str',true)]),{}).am$('read',271360,'sys::Int?',xp,{}).am$('readBuf',271360,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false),new sys.Param('n','sys::Int',false)]),{}).am$('unread',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{}).am$('close',271360,'sys::Bool',xp,{});
ModbusMaster.type$.af$('transport',67584,'hxModbus::ModbusTransport',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('transport','hxModbus::ModbusTransport',false)]),{}).am$('open',8192,'sys::This',xp,{}).am$('close',8192,'sys::This',xp,{}).am$('withTrace',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('log','sys::Log',false),new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('readCoil',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('addr','sys::Int',false)]),{}).am$('readCoils',8192,'sys::Bool[]',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('start','sys::Int',false),new sys.Param('count','sys::Int',false)]),{}).am$('writeCoil',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('addr','sys::Int',false),new sys.Param('val','sys::Bool',false)]),{}).am$('readDiscreteInput',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('addr','sys::Int',false)]),{}).am$('readDiscreteInputs',8192,'sys::Bool[]',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('start','sys::Int',false),new sys.Param('count','sys::Int',false)]),{}).am$('readInputReg',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('addr','sys::Int',false)]),{}).am$('readInputRegs',8192,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('start','sys::Int',false),new sys.Param('count','sys::Int',false)]),{}).am$('readHoldingReg',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('addr','sys::Int',false)]),{}).am$('readHoldingRegs',8192,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('start','sys::Int',false),new sys.Param('count','sys::Int',false)]),{}).am$('writeHoldingReg',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('addr','sys::Int',false),new sys.Param('val','sys::Int',false)]),{}).am$('writeHoldingRegs',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('start','sys::Int',false),new sys.Param('vals','sys::Int[]',false)]),{}).am$('_writeHoldingRegs',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('start','sys::Int',false),new sys.Param('vals','sys::Int[]',false)]),{}).am$('readBinary',2048,'sys::Bool[]',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('func','sys::Int',false),new sys.Param('start','sys::Int',false),new sys.Param('count','sys::Int',false)]),{}).am$('writeBinary',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('func','sys::Int',false),new sys.Param('addr','sys::Int',false),new sys.Param('val','sys::Bool',false)]),{}).am$('read16',2048,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('func','sys::Int',false),new sys.Param('start','sys::Int',false),new sys.Param('count','sys::Int',false)]),{}).am$('write16',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slave','sys::Int',false),new sys.Param('func','sys::Int',false),new sys.Param('addr','sys::Int',false),new sys.Param('vals','sys::Int[]',false),new sys.Param('forceMulti','sys::Bool',true)]),{}).am$('isErr',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Int',false)]),{}).am$('err',2048,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('in','hxModbus::ModbusInStream',false)]),{}).am$('addCrc',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Buf',false)]),{}).am$('verifyCrc',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','hxModbus::ModbusInStream',false)]),{});
ModbusMasterTest.type$.am$('testBasics',8192,'sys::Void',xp,{}).am$('testDiscreteCoils',8192,'sys::Void',xp,{}).am$('testHoldingRegs',8192,'sys::Void',xp,{}).am$('toBuf',2048,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ModbusTestTransport.type$.af$('_open',73728,'sys::Bool',{}).af$('crc',73728,'sys::Bool',{}).af$('test',73728,'sys::Buf',{}).am$('open',271360,'sys::Void',xp,{}).am$('close',271360,'sys::Void',xp,{}).am$('useCrc',271360,'sys::Bool',xp,{}).am$('req',271360,'hxModbus::ModbusInStream',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Buf',false)]),{}).am$('toRes',2048,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ModbusRegMapTest.type$.af$('coil',106498,'hxModbus::ModbusAddrType',{}).af$('disInput',106498,'hxModbus::ModbusAddrType',{}).af$('inputReg',106498,'hxModbus::ModbusAddrType',{}).af$('holdingReg',106498,'hxModbus::ModbusAddrType',{}).af$('bit',106498,'hxModbus::ModbusData',{}).af$('u2',106498,'hxModbus::ModbusData',{}).af$('s4',106498,'hxModbus::ModbusData',{}).am$('test',8192,'sys::Void',xp,{}).am$('testAddr',8192,'sys::Void',xp,{}).am$('testTags',8192,'sys::Void',xp,{}).am$('verifyReg',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','hxModbus::ModbusReg',false),new sys.Param('name','sys::Str',false),new sys.Param('dis','sys::Str?',false),new sys.Param('addrStr','sys::Str',false),new sys.Param('addrType','hxModbus::ModbusAddrType',false),new sys.Param('addrNum','sys::Int',false),new sys.Param('data','hxModbus::ModbusData',false),new sys.Param('unit','sys::Unit?',false),new sys.Param('tags','sys::Obj?',true)]),{}).am$('testScale',8192,'sys::Void',xp,{}).am$('verifyScale',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('scale','hxModbus::ModbusScale',false),new sys.Param('in','sys::Num',false),new sys.Param('out','sys::Num',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
ModbusDataTest.type$.am$('testBits',8192,'sys::Void',xp,{}).am$('verifyBits',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','hxModbus::ModbusBitData',false),new sys.Param('pos','sys::Int',false),new sys.Param('regs','sys::Int[]',false),new sys.Param('val','sys::Bool',false)]),{}).am$('testInts',8192,'sys::Void',xp,{}).am$('testIntWriteRaw',8192,'sys::Void',xp,{}).am$('testIntsLittleEndian',8192,'sys::Void',xp,{}).am$('verifyInt',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','hxModbus::ModbusIntData',false),new sys.Param('size','sys::Int',false),new sys.Param('regs','sys::Int[]',false),new sys.Param('val','sys::Int',false),new sys.Param('check','sys::Int[]',true)]),{}).am$('verifyIntWrite',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','hxModbus::ModbusIntData',false),new sys.Param('raw','sys::Obj',false),new sys.Param('check','sys::Int[]',false)]),{}).am$('testFloats',8192,'sys::Void',xp,{}).am$('testFloatsLittleEndian',8192,'sys::Void',xp,{}).am$('verifyFloat',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','hxModbus::ModbusFloatData',false),new sys.Param('size','sys::Int',false),new sys.Param('regs','sys::Int[]',false),new sys.Param('val','sys::Float',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ModbusBlockTest.type$.am$('testBasics',8192,'sys::Void',xp,{}).am$('testRegTypes',8192,'sys::Void',xp,{}).am$('testDataTypes',8192,'sys::Void',xp,{}).am$('reg',2048,'hxModbus::ModbusReg',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('addr','sys::Str',false),new sys.Param('data','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxModbus");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;inet 1.0;util 1.0;haystack 3.1.11;axon 3.1.11;folio 3.1.11;hx 3.1.11;hxConn 3.1.11;hxPlatformSerial 3.1.11");
m.set("pod.summary", "Modbus connector");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:28-05:00 New_York");
m.set("build.tsKey", "241210143128");
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
  ModbusLib,
  ModbusDispatch,
  TcpTest,
  ModbusFuncs,
  ModbusRegMap,
  ModbusBlock,
  ModbusLink,
  ModbusDev,
  ModbusReg,
  ModbusAddr,
  ModbusAddrType,
  ModbusData,
  ModbusBitData,
  ModbusNumData,
  ModbusIntData,
  ModbusFloatData,
  ModbusScale,
  ModbusTransport,
  ModbusTcpTransport,
  ModbusRtuTcpTransport,
  ModbusRtuTransport,
  ModbusInStream,
  ModbusMaster,
  ModbusRegMapTest,
};
