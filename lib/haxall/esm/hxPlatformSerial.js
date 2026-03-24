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
import * as obs from './obs.js'
import * as hx from './hx.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class SerialSocket extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#onClose = () => {
      throw sys.Err.make("onClose not installed");
    };
    this.#timeout = sys.Duration.fromStr("5sec");
    this.#isClosedRef = concurrent.AtomicBool.make(false);
    return;
  }

  typeof() { return SerialSocket.type$; }

  #port = null;

  port() { return this.#port; }

  __port(it) { if (it === undefined) return this.#port; else this.#port = it; }

  #config = null;

  config() { return this.#config; }

  __config(it) { if (it === undefined) return this.#config; else this.#config = it; }

  #onClose = null;

  onClose(it) {
    if (it === undefined) {
      return this.#onClose;
    }
    else {
      this.#onClose = it;
      return;
    }
  }

  #timeout = null;

  timeout(it) {
    if (it === undefined) {
      return this.#timeout;
    }
    else {
      this.#timeout = it;
      return;
    }
  }

  #isClosedRef = null;

  isClosedRef() { return this.#isClosedRef; }

  __isClosedRef(it) { if (it === undefined) return this.#isClosedRef; else this.#isClosedRef = it; }

  static make(port,config) {
    const $self = new SerialSocket();
    SerialSocket.make$($self,port,config);
    return $self;
  }

  static make$($self,port,config) {
    ;
    $self.#port = port;
    $self.#config = config;
    return;
  }

  name() {
    return this.#config.name();
  }

  isClosed() {
    return this.#isClosedRef.val();
  }

  close() {
    if (this.isClosed()) {
      return;
    }
    ;
    sys.Func.call(this.#onClose, this);
    return;
  }

  toStr() {
    return this.#config.toStr();
  }

}

class UnknownSerialPortErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownSerialPortErr.type$; }

  static make(msg,cause) {
    const $self = new UnknownSerialPortErr();
    UnknownSerialPortErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class SerialPortAlreadyOpenErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SerialPortAlreadyOpenErr.type$; }

  static make(msg,cause) {
    const $self = new SerialPortAlreadyOpenErr();
    SerialPortAlreadyOpenErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class SerialPort extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#rtRef = concurrent.AtomicRef.make(null);
    this.#ownerRef = concurrent.AtomicRef.make(null);
    return;
  }

  typeof() { return SerialPort.type$; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #device = null;

  device() { return this.#device; }

  __device(it) { if (it === undefined) return this.#device; else this.#device = it; }

  #rtRef = null;

  rtRef() { return this.#rtRef; }

  __rtRef(it) { if (it === undefined) return this.#rtRef; else this.#rtRef = it; }

  #ownerRef = null;

  ownerRef() { return this.#ownerRef; }

  __ownerRef(it) { if (it === undefined) return this.#ownerRef; else this.#ownerRef = it; }

  static make(meta) {
    const $self = new SerialPort();
    SerialPort.make$($self,meta);
    return $self;
  }

  static make$($self,meta) {
    ;
    $self.#meta = meta;
    $self.#name = sys.ObjUtil.coerce(meta.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
    $self.#device = sys.ObjUtil.coerce(meta.trap("device", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
    return;
  }

  isOpen() {
    return this.owner() != null;
  }

  isClosed() {
    return this.owner() == null;
  }

  rt() {
    return sys.ObjUtil.coerce(this.#rtRef.val(), hx.HxRuntime.type$.toNullable());
  }

  owner() {
    return sys.ObjUtil.coerce(this.#ownerRef.val(), haystack.Dict.type$.toNullable());
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("SerialPort ", sys.Str.toCode(this.#name)), " ["), this.#device), "]");
  }

}

class PlatformSerialSpi {
  constructor() {
    const this$ = this;
  }

  typeof() { return PlatformSerialSpi.type$; }

}

class TestSerialSpi extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#ports = sys.ObjUtil.coerce(((this$) => { let $_u0 = sys.List.make(SerialPort.type$, [SerialPort.make(haystack.Etc.makeDict(sys.Map.__fromLiteral(["name","device"], ["test","/test"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))))]); if ($_u0 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(SerialPort.type$, [SerialPort.make(haystack.Etc.makeDict(sys.Map.__fromLiteral(["name","device"], ["test","/test"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))))])); })(this), sys.Type.find("hxPlatformSerial::SerialPort[]"));
    return;
  }

  typeof() { return TestSerialSpi.type$; }

  #ports = null;

  ports() { return this.#ports; }

  __ports(it) { if (it === undefined) return this.#ports; else this.#ports = it; }

  open(port,config) {
    return TestSerialSocket.make(port, config);
  }

  close(socket) {
    return;
  }

  static make() {
    const $self = new TestSerialSpi();
    TestSerialSpi.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class TestSerialSocket extends SerialSocket {
  constructor() {
    super();
    const this$ = this;
    this.#buf = sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$);
    return;
  }

  typeof() { return TestSerialSocket.type$; }

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

  static make(port,config) {
    const $self = new TestSerialSocket();
    TestSerialSocket.make$($self,port,config);
    return $self;
  }

  static make$($self,port,config) {
    SerialSocket.make$($self, port, config);
    ;
    return;
  }

  in() {
    return this.#buf.in();
  }

  out() {
    return this.#buf.out();
  }

  purge() {
    this.#buf.clear();
    return this;
  }

}

class PlatformSerialFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PlatformSerialFuncs.type$; }

  static platformSerialPorts() {
    const this$ = this;
    let gb = haystack.GridBuilder.make();
    gb.addCol("name").addCol("device").addCol("connState").addCol("proj").addCol("owner");
    PlatformSerialFuncs.lib().ports().each((p) => {
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [p.name(), p.device(), ((this$) => { if (p.isOpen()) return "open"; return "closed"; })(this$), ((this$) => { let $_u2 = p.rt(); if ($_u2 == null) return null; return p.rt().name(); })(this$), ((this$) => { let $_u3 = p.owner(); if ($_u3 == null) return null; return p.owner().id(); })(this$)]));
      return;
    });
    return gb.toGrid();
  }

  static curContext() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static lib() {
    return sys.ObjUtil.coerce(PlatformSerialFuncs.curContext().rt().lib("platformSerial"), PlatformSerialLib.type$);
  }

  static make() {
    const $self = new PlatformSerialFuncs();
    PlatformSerialFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class PlatformSerialLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
    this.#timeout = sys.Duration.fromStr("1min");
    return;
  }

  typeof() { return PlatformSerialLib.type$; }

  #timeout = null;

  // private field reflection only
  __timeout(it) { if (it === undefined) return this.#timeout; else this.#timeout = it; }

  #platformSpi = null;

  // private field reflection only
  __platformSpi(it) { if (it === undefined) return this.#platformSpi; else this.#platformSpi = it; }

  #portsMap = null;

  // private field reflection only
  __portsMap(it) { if (it === undefined) return this.#portsMap; else this.#portsMap = it; }

  static make() {
    const $self = new PlatformSerialLib();
    PlatformSerialLib.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    hx.HxLib.make$($self);
    ;
    $self.#platformSpi = sys.ObjUtil.coerce($self.rt().config().makeSpi("platformSerialSpi"), PlatformSerialSpi.type$);
    $self.#portsMap = sys.ObjUtil.coerce(((this$) => { let $_u4 = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hxPlatformSerial::SerialPort")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:hxPlatformSerial::SerialPort]")).addList(this$.#platformSpi.ports(), (it) => {
      return it.name();
    }); if ($_u4 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hxPlatformSerial::SerialPort")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:hxPlatformSerial::SerialPort]")).addList(this$.#platformSpi.ports(), (it) => {
      return it.name();
    })); })($self), sys.Type.find("[sys::Str:hxPlatformSerial::SerialPort]"));
    return;
  }

  ports() {
    return this.#portsMap.vals();
  }

  port(name,checked) {
    if (checked === undefined) checked = true;
    let p = this.#portsMap.get(name);
    if (p != null) {
      return p;
    }
    ;
    if (checked) {
      throw UnknownSerialPortErr.make(name);
    }
    ;
    return null;
  }

  open(rt,owner,config) {
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.spi().actor().send(hx.HxMsg.make3("open", rt, owner, config)).get(this.#timeout), sys.Unsafe.type$).val(), SerialSocket.type$);
  }

  close(socket) {
    this.spi().actor().send(hx.HxMsg.make1("close", sys.Unsafe.make(socket))).get(this.#timeout);
    return;
  }

  onReceive(msg) {
    let $_u5 = msg.id();
    if (sys.ObjUtil.equals($_u5, "open")) {
      return this.doOpen(sys.ObjUtil.coerce(msg.a(), hx.HxRuntime.type$), sys.ObjUtil.coerce(msg.b(), haystack.Dict.type$), sys.ObjUtil.coerce(msg.c(), SerialConfig.type$));
    }
    else if (sys.ObjUtil.equals($_u5, "close")) {
      return this.doClose(sys.ObjUtil.coerce(sys.ObjUtil.coerce(msg.a(), sys.Unsafe.type$).val(), SerialSocket.type$));
    }
    else {
      throw sys.Err.make(sys.Str.plus("Unknown msg type: ", msg));
    }
    ;
  }

  doOpen(rt,owner,config) {
    const this$ = this;
    let rec = rt.db().readById(owner.id(), false);
    if (rec == null) {
      throw sys.ArgErr.make(sys.Str.plus("Owner is not rec in runtime: ", owner.id()));
    }
    ;
    let serialPort = this.port(config.name());
    if (serialPort.isOpen()) {
      throw SerialPortAlreadyOpenErr.make(sys.Str.plus("Owner: ", serialPort.owner().id().toZinc()));
    }
    ;
    let socket = this.#platformSpi.open(sys.ObjUtil.coerce(serialPort, SerialPort.type$), config);
    socket.onClose((s) => {
      this$.close(s);
      return;
    });
    serialPort.rtRef().val(rt);
    serialPort.ownerRef().val(owner);
    socket.isClosedRef().val(false);
    return sys.Unsafe.make(socket);
  }

  doClose(socket) {
    let serialPort = this.port(socket.name());
    serialPort.rtRef().val(null);
    serialPort.ownerRef().val(null);
    socket.isClosedRef().val(true);
    this.#platformSpi.close(socket);
    return null;
  }

}

class SerialConfig extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#baud = 115200;
    this.#data = 8;
    this.#parity = SerialConfig.parityNone();
    this.#stop = 1;
    this.#flow = SerialConfig.flowRtsCts();
    return;
  }

  typeof() { return SerialConfig.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #baud = 0;

  baud() { return this.#baud; }

  __baud(it) { if (it === undefined) return this.#baud; else this.#baud = it; }

  #data = 0;

  data() { return this.#data; }

  __data(it) { if (it === undefined) return this.#data; else this.#data = it; }

  #parity = 0;

  parity() { return this.#parity; }

  __parity(it) { if (it === undefined) return this.#parity; else this.#parity = it; }

  static #parityNone = undefined;

  static parityNone() {
    if (SerialConfig.#parityNone === undefined) {
      SerialConfig.static$init();
      if (SerialConfig.#parityNone === undefined) SerialConfig.#parityNone = 0;
    }
    return SerialConfig.#parityNone;
  }

  static #parityOdd = undefined;

  static parityOdd() {
    if (SerialConfig.#parityOdd === undefined) {
      SerialConfig.static$init();
      if (SerialConfig.#parityOdd === undefined) SerialConfig.#parityOdd = 0;
    }
    return SerialConfig.#parityOdd;
  }

  static #parityEven = undefined;

  static parityEven() {
    if (SerialConfig.#parityEven === undefined) {
      SerialConfig.static$init();
      if (SerialConfig.#parityEven === undefined) SerialConfig.#parityEven = 0;
    }
    return SerialConfig.#parityEven;
  }

  #stop = 0;

  stop() { return this.#stop; }

  __stop(it) { if (it === undefined) return this.#stop; else this.#stop = it; }

  #flow = 0;

  flow() { return this.#flow; }

  __flow(it) { if (it === undefined) return this.#flow; else this.#flow = it; }

  static #flowNone = undefined;

  static flowNone() {
    if (SerialConfig.#flowNone === undefined) {
      SerialConfig.static$init();
      if (SerialConfig.#flowNone === undefined) SerialConfig.#flowNone = 0;
    }
    return SerialConfig.#flowNone;
  }

  static #flowRtsCts = undefined;

  static flowRtsCts() {
    if (SerialConfig.#flowRtsCts === undefined) {
      SerialConfig.static$init();
      if (SerialConfig.#flowRtsCts === undefined) SerialConfig.#flowRtsCts = 0;
    }
    return SerialConfig.#flowRtsCts;
  }

  static #flowXonXoff = undefined;

  static flowXonXoff() {
    if (SerialConfig.#flowXonXoff === undefined) {
      SerialConfig.static$init();
      if (SerialConfig.#flowXonXoff === undefined) SerialConfig.#flowXonXoff = 0;
    }
    return SerialConfig.#flowXonXoff;
  }

  static make(f) {
    const $self = new SerialConfig();
    SerialConfig.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ;
    sys.Func.call(f, $self);
    if (!haystack.Etc.isTagName($self.#name)) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Invalid name '", $self.#name), "'"));
    }
    ;
    if ((sys.ObjUtil.compareLT($self.#data, 5) || sys.ObjUtil.compareGT($self.#data, 8))) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Invalid data '", sys.ObjUtil.coerce($self.#data, sys.Obj.type$.toNullable())), "'"));
    }
    ;
    if ((sys.ObjUtil.compareLT($self.#parity, 0) || sys.ObjUtil.compareGT($self.#parity, 2))) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Invalid parity '", sys.ObjUtil.coerce($self.#parity, sys.Obj.type$.toNullable())), "'"));
    }
    ;
    if ((sys.ObjUtil.compareLT($self.#stop, 1) || sys.ObjUtil.compareGT($self.#stop, 2))) {
      throw sys.ArgErr.make("Invalid stop 'stop'");
    }
    ;
    if ((sys.ObjUtil.compareLT($self.#flow, 0) || sys.ObjUtil.compareGT($self.#flow, 2))) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Invalid flow '", sys.ObjUtil.coerce($self.#flow, sys.Obj.type$.toNullable())), "'"));
    }
    ;
    return;
  }

  hash() {
    return sys.Str.hash(this.toStr());
  }

  equals(obj) {
    if (!sys.ObjUtil.is(obj, SerialConfig.type$)) {
      return false;
    }
    ;
    let that = sys.ObjUtil.coerce(obj, SerialConfig.type$);
    return (sys.ObjUtil.equals(this.#name, that.#name) && sys.ObjUtil.equals(this.#baud, that.#baud) && sys.ObjUtil.equals(this.#data, that.#data) && sys.ObjUtil.equals(this.#parity, that.#parity) && sys.ObjUtil.equals(this.#stop, that.#stop) && sys.ObjUtil.equals(this.#flow, that.#flow));
  }

  toStr() {
    let buf = sys.StrBuf.make().add(this.#name).addChar(45).add(sys.Int.toStr(this.#baud));
    buf.addChar(45);
    buf.add(sys.Int.toStr(this.#data));
    let $_u6 = this.#parity;
    if (sys.ObjUtil.equals($_u6, SerialConfig.parityOdd())) {
      buf.addChar(111);
    }
    else if (sys.ObjUtil.equals($_u6, SerialConfig.parityEven())) {
      buf.addChar(101);
    }
    else {
      buf.addChar(110);
    }
    ;
    buf.add(sys.ObjUtil.coerce(this.#stop, sys.Obj.type$.toNullable()));
    buf.addChar(45);
    let $_u7 = this.#flow;
    if (sys.ObjUtil.equals($_u7, SerialConfig.flowNone())) {
      buf.add("none");
    }
    else if (sys.ObjUtil.equals($_u7, SerialConfig.flowRtsCts())) {
      buf.add("rtscts");
    }
    else {
      buf.add("xonxoff");
    }
    ;
    return buf.toStr();
  }

  static fromStr(str,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    try {
      let parts = sys.Str.split(str, sys.ObjUtil.coerce(45, sys.Int.type$.toNullable()));
      let name = parts.get(0);
      let baud = sys.Str.toInt(parts.get(1));
      let dps = parts.get(2);
      let fstr = ((this$) => { let $_u8 = parts.getSafe(3); if ($_u8 != null) return $_u8; return ""; })(this);
      let data = sys.Str.toInt(sys.Str.getRange(dps, sys.Range.make(0, 1, true)));
      let parity = ((this$) => { if (sys.ObjUtil.equals(sys.Str.get(dps, 1), 111)) return SerialConfig.parityOdd(); return ((this$) => { if (sys.ObjUtil.equals(sys.Str.get(dps, 1), 101)) return SerialConfig.parityEven(); return SerialConfig.parityNone(); })(this$); })(this);
      let stop = sys.Str.toInt(sys.Str.getRange(dps, sys.Range.make(2, 3, true)));
      let flow = ((this$) => { if (sys.ObjUtil.equals(fstr, "none")) return SerialConfig.flowNone(); return ((this$) => { if (sys.ObjUtil.equals(fstr, "xonxoff")) return SerialConfig.flowXonXoff(); return SerialConfig.flowRtsCts(); })(this$); })(this);
      return SerialConfig.make((it) => {
        it.#name = name;
        it.#baud = sys.ObjUtil.coerce(baud, sys.Int.type$);
        it.#data = sys.ObjUtil.coerce(data, sys.Int.type$);
        it.#parity = parity;
        it.#stop = sys.ObjUtil.coerce(stop, sys.Int.type$);
        it.#flow = flow;
        return;
      });
    }
    catch ($_u13) {
      $_u13 = sys.Err.make($_u13);
      if ($_u13 instanceof sys.Err) {
        let err = $_u13;
        ;
        if (!checked) {
          return null;
        }
        ;
        throw sys.ParseErr.make(sys.Str.plus("Invalid format: ", str), err);
      }
      else {
        throw $_u13;
      }
    }
    ;
  }

  static static$init() {
    SerialConfig.#parityNone = 0;
    SerialConfig.#parityOdd = 1;
    SerialConfig.#parityEven = 2;
    SerialConfig.#flowNone = 0;
    SerialConfig.#flowRtsCts = 1;
    SerialConfig.#flowXonXoff = 2;
    return;
  }

}

class SerialSpiTest extends hx.HxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SerialSpiTest.type$; }

  testConfig() {
    const this$ = this;
    this.verifyEq(SerialConfig.make((it) => {
      it.__name("a");
      return;
    }), SerialConfig.make((it) => {
      it.__name("a");
      return;
    }));
    this.verifyConfig(SerialConfig.make((it) => {
      it.__name("a");
      it.__baud(9600);
      return;
    }));
    this.verifyConfig(SerialConfig.make((it) => {
      it.__name("a");
      it.__parity(SerialConfig.parityEven());
      return;
    }));
    this.verifyConfig(SerialConfig.make((it) => {
      it.__name("a");
      it.__data(7);
      return;
    }));
    this.verifyConfig(SerialConfig.make((it) => {
      it.__name("a");
      it.__stop(2);
      return;
    }));
    this.verifyConfig(SerialConfig.make((it) => {
      it.__name("a");
      it.__flow(SerialConfig.flowXonXoff());
      return;
    }));
    this.verifyConfig(SerialConfig.make((it) => {
      it.__name("foo");
      it.__baud(9600);
      it.__data(7);
      it.__parity(SerialConfig.parityEven());
      it.__stop(2);
      it.__flow(SerialConfig.flowXonXoff());
      return;
    }));
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let x = SerialConfig.make((it) => {
        it.__name("foo-bar");
        return;
      });
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let x = SerialConfig.make((it) => {
        it.__name("foo bar");
        return;
      });
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let x = SerialConfig.make((it) => {
        it.__name("foo");
        it.__data(3);
        return;
      });
      return;
    });
    return;
  }

  verifyConfig(s) {
    const this$ = this;
    let x = SerialConfig.make((it) => {
      it.__name(s.name());
      return;
    });
    this.verifyNotEq(x, s);
    this.verifyEq(SerialConfig.fromStr(s.toStr()), s);
    return;
  }

  testSpi() {
    const this$ = this;
    let lib = sys.ObjUtil.coerce(this.rt().libs().get("platformSerial", false), PlatformSerialLib.type$.toNullable());
    if (lib == null) {
      (lib = sys.ObjUtil.coerce(this.rt().libs().add("platformSerial"), PlatformSerialLib.type$.toNullable()));
    }
    ;
    let s = lib.port("test");
    this.verifyEq(sys.ObjUtil.coerce(lib.ports().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyNotNull(sys.ObjUtil.coerce(lib.ports().indexSame(sys.ObjUtil.coerce(s, SerialPort.type$)), sys.Obj.type$.toNullable()));
    this.verifyStatus(sys.ObjUtil.coerce(lib, PlatformSerialLib.type$), sys.ObjUtil.coerce(s, SerialPort.type$), "test", "/test", null);
    this.verifyEq(lib.port("badone", false), null);
    this.verifyErr(UnknownSerialPortErr.type$, (it) => {
      lib.port("badone");
      return;
    });
    let conn = this.addRec(sys.Map.__fromLiteral(["dis"], ["MyConn"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    let cfg = SerialConfig.make((it) => {
      it.__name("test");
      return;
    });
    let p = lib.open(sys.ObjUtil.coerce(this.rt(), hx.HxRuntime.type$), conn, cfg);
    this.verifyPort(p, cfg, false);
    this.verifyStatus(sys.ObjUtil.coerce(lib, PlatformSerialLib.type$), sys.ObjUtil.coerce(s, SerialPort.type$), "test", "/test", conn);
    this.verifyErr(SerialPortAlreadyOpenErr.type$, (it) => {
      lib.open(sys.ObjUtil.coerce(this$.rt(), hx.HxRuntime.type$), conn, SerialConfig.make((it) => {
        it.__name("test");
        return;
      }));
      return;
    });
    this.verifyErr(UnknownSerialPortErr.type$, (it) => {
      lib.open(sys.ObjUtil.coerce(this$.rt(), hx.HxRuntime.type$), conn, SerialConfig.make((it) => {
        it.__name("foobar");
        return;
      }));
      return;
    });
    let grid = sys.ObjUtil.coerce(this.eval("platformSerialPorts()"), haystack.Grid.type$);
    this.verifyEq(sys.ObjUtil.coerce(grid.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(grid.get(0).get("name"), "test");
    this.verifyEq(grid.get(0).get("device"), "/test");
    this.verifyEq(grid.get(0).get("status"), "open");
    this.verifyEq(grid.get(0).get("owner"), conn.id());
    p.close();
    this.verifyPort(p, cfg, true);
    this.verifyStatus(sys.ObjUtil.coerce(lib, PlatformSerialLib.type$), sys.ObjUtil.coerce(s, SerialPort.type$), "test", "/test", null);
    return;
  }

  verifyStatus(lib,p,n,d,owner) {
    const this$ = this;
    this.verifyEq(p.name(), n);
    this.verifyEq(p.device(), d);
    this.verifyEq(sys.ObjUtil.coerce(p.isOpen(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(owner != null, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(p.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(owner == null, sys.Obj.type$.toNullable()));
    this.verifyEq(p.rt(), ((this$) => { if (owner == null) return null; return this$.rt(); })(this));
    this.verifyValEq(p.owner(), owner);
    let grid = sys.ObjUtil.coerce(this.eval("platformSerialPorts()"), haystack.Grid.type$);
    this.verifyEq(sys.ObjUtil.coerce(grid.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(lib.ports().size(), sys.Obj.type$.toNullable()));
    let row = grid.find((r) => {
      return sys.ObjUtil.equals(r.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), n);
    });
    this.verifyEq(row.get("device"), d);
    this.verifyEq(row.get("status"), ((this$) => { if (owner == null) return "closed"; return "open"; })(this));
    this.verifyEq(row.get("proj"), ((this$) => { if (owner == null) return null; return this$.rt().name(); })(this));
    this.verifyEq(row.get("owner"), ((this$) => { if (owner == null) return null; return owner.id(); })(this));
    return;
  }

  verifyPort(p,c,isClosed) {
    this.verifyEq(p.name(), c.name());
    this.verifySame(p.config(), c);
    this.verifyEq(sys.ObjUtil.coerce(p.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(isClosed, sys.Obj.type$.toNullable()));
    return;
  }

  static make() {
    const $self = new SerialSpiTest();
    SerialSpiTest.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxTest.make$($self);
    return;
  }

}

const p = sys.Pod.add$('hxPlatformSerial');
const xp = sys.Param.noParams$();
let m;
SerialSocket.type$ = p.at$('SerialSocket','sys::Obj',[],{},8193,SerialSocket);
UnknownSerialPortErr.type$ = p.at$('UnknownSerialPortErr','sys::Err',[],{'sys::NoDoc':""},8194,UnknownSerialPortErr);
SerialPortAlreadyOpenErr.type$ = p.at$('SerialPortAlreadyOpenErr','sys::Err',[],{'sys::NoDoc':""},8194,SerialPortAlreadyOpenErr);
SerialPort.type$ = p.at$('SerialPort','sys::Obj',[],{},8194,SerialPort);
PlatformSerialSpi.type$ = p.am$('PlatformSerialSpi','sys::Obj',[],{},8451,PlatformSerialSpi);
TestSerialSpi.type$ = p.at$('TestSerialSpi','sys::Obj',['hxPlatformSerial::PlatformSerialSpi'],{'sys::NoDoc':""},8194,TestSerialSpi);
TestSerialSocket.type$ = p.at$('TestSerialSocket','hxPlatformSerial::SerialSocket',[],{'sys::NoDoc':""},8192,TestSerialSocket);
PlatformSerialFuncs.type$ = p.at$('PlatformSerialFuncs','sys::Obj',[],{'sys::NoDoc':""},8194,PlatformSerialFuncs);
PlatformSerialLib.type$ = p.at$('PlatformSerialLib','hx::HxLib',[],{},8194,PlatformSerialLib);
SerialConfig.type$ = p.at$('SerialConfig','sys::Obj',[],{},8194,SerialConfig);
SerialSpiTest.type$ = p.at$('SerialSpiTest','hx::HxTest',[],{},8192,SerialSpiTest);
SerialSocket.type$.af$('port',73730,'hxPlatformSerial::SerialPort',{}).af$('config',73730,'hxPlatformSerial::SerialConfig',{}).af$('onClose',65664,'|hxPlatformSerial::SerialSocket->sys::Void|',{}).af$('timeout',73728,'sys::Duration?',{}).af$('isClosedRef',65666,'concurrent::AtomicBool',{}).am$('make',4100,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('port','hxPlatformSerial::SerialPort',false),new sys.Param('config','hxPlatformSerial::SerialConfig',false)]),{}).am$('name',8192,'sys::Str',xp,{}).am$('purge',270337,'sys::This',xp,{}).am$('in',270337,'sys::InStream',xp,{}).am$('out',270337,'sys::OutStream',xp,{}).am$('isClosed',8192,'sys::Bool',xp,{}).am$('close',8192,'sys::Void',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
UnknownSerialPortErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
SerialPortAlreadyOpenErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
SerialPort.type$.af$('meta',73730,'haystack::Dict',{}).af$('name',73730,'sys::Str',{}).af$('device',73730,'sys::Str',{}).af$('rtRef',65666,'concurrent::AtomicRef',{}).af$('ownerRef',65666,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('meta','haystack::Dict',false)]),{}).am$('isOpen',8192,'sys::Bool',xp,{}).am$('isClosed',8192,'sys::Bool',xp,{}).am$('rt',8192,'hx::HxRuntime?',xp,{}).am$('owner',8192,'haystack::Dict?',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
PlatformSerialSpi.type$.am$('ports',270337,'hxPlatformSerial::SerialPort[]',xp,{}).am$('open',270337,'hxPlatformSerial::SerialSocket',sys.List.make(sys.Param.type$,[new sys.Param('port','hxPlatformSerial::SerialPort',false),new sys.Param('config','hxPlatformSerial::SerialConfig',false)]),{}).am$('close',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('socket','hxPlatformSerial::SerialSocket',false)]),{});
TestSerialSpi.type$.af$('ports',336898,'hxPlatformSerial::SerialPort[]',{}).am$('open',271360,'hxPlatformSerial::SerialSocket',sys.List.make(sys.Param.type$,[new sys.Param('port','hxPlatformSerial::SerialPort',false),new sys.Param('config','hxPlatformSerial::SerialConfig',false)]),{}).am$('close',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('socket','hxPlatformSerial::SerialSocket',false)]),{}).am$('make',139268,'sys::Void',xp,{});
TestSerialSocket.type$.af$('buf',73728,'sys::Buf',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('port','hxPlatformSerial::SerialPort',false),new sys.Param('config','hxPlatformSerial::SerialConfig',false)]),{}).am$('in',271360,'sys::InStream',xp,{}).am$('out',271360,'sys::OutStream',xp,{}).am$('purge',271360,'sys::This',xp,{});
PlatformSerialFuncs.type$.am$('platformSerialPorts',40962,'haystack::Grid',xp,{'axon::Axon':"axon::Axon{admin=true;}"}).am$('curContext',34818,'hx::HxContext',xp,{}).am$('lib',34818,'hxPlatformSerial::PlatformSerialLib',xp,{}).am$('make',139268,'sys::Void',xp,{});
PlatformSerialLib.type$.af$('timeout',67586,'sys::Duration',{}).af$('platformSpi',67586,'hxPlatformSerial::PlatformSerialSpi',{}).af$('portsMap',67586,'[sys::Str:hxPlatformSerial::SerialPort]',{}).am$('make',8196,'sys::Void',xp,{}).am$('ports',8192,'hxPlatformSerial::SerialPort[]',xp,{}).am$('port',8192,'hxPlatformSerial::SerialPort?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('open',8192,'hxPlatformSerial::SerialSocket',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false),new sys.Param('owner','haystack::Dict',false),new sys.Param('config','hxPlatformSerial::SerialConfig',false)]),{}).am$('close',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('socket','hxPlatformSerial::SerialSocket',false)]),{}).am$('onReceive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('doOpen',2048,'sys::Unsafe',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false),new sys.Param('owner','haystack::Dict',false),new sys.Param('config','hxPlatformSerial::SerialConfig',false)]),{}).am$('doClose',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('socket','hxPlatformSerial::SerialSocket',false)]),{});
SerialConfig.type$.af$('name',73730,'sys::Str',{}).af$('baud',73730,'sys::Int',{}).af$('data',73730,'sys::Int',{}).af$('parity',73730,'sys::Int',{}).af$('parityNone',106498,'sys::Int',{}).af$('parityOdd',106498,'sys::Int',{}).af$('parityEven',106498,'sys::Int',{}).af$('stop',73730,'sys::Int',{}).af$('flow',73730,'sys::Int',{}).af$('flowNone',106498,'sys::Int',{}).af$('flowRtsCts',106498,'sys::Int',{}).af$('flowXonXoff',106498,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('fromStr',40966,'hxPlatformSerial::SerialConfig?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
SerialSpiTest.type$.am$('testConfig',8192,'sys::Void',xp,{}).am$('verifyConfig',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','hxPlatformSerial::SerialConfig',false)]),{}).am$('testSpi',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('verifyStatus',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPlatformSerial::PlatformSerialLib',false),new sys.Param('p','hxPlatformSerial::SerialPort',false),new sys.Param('n','sys::Str',false),new sys.Param('d','sys::Str',false),new sys.Param('owner','haystack::Dict?',false)]),{}).am$('verifyPort',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','hxPlatformSerial::SerialSocket',false),new sys.Param('c','hxPlatformSerial::SerialConfig',false),new sys.Param('isClosed','sys::Bool',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxPlatformSerial");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;haystack 3.1.11;axon 3.1.11;hx 3.1.11");
m.set("pod.summary", "Platform support for serial ports");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:28-05:00 New_York");
m.set("build.tsKey", "241210143128");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "false");
m.set("license.name", "Acadmemic Free License 3.0");
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
  SerialSocket,
  UnknownSerialPortErr,
  SerialPortAlreadyOpenErr,
  SerialPort,
  PlatformSerialSpi,
  TestSerialSpi,
  TestSerialSocket,
  PlatformSerialFuncs,
  PlatformSerialLib,
  SerialConfig,
  SerialSpiTest,
};
