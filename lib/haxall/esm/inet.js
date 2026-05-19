// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class TcpListener extends sys.Obj {
  constructor() {
    super();
    this.peer = new TcpListenerPeer(this);
    const this$ = this;
  }

  typeof() { return TcpListener.type$; }

  static make(config) {
    const $self = new TcpListener();
    TcpListener.make$($self,config);
    return $self;
  }

  static make$($self,config) {
    if (config === undefined) config = SocketConfig.cur();
    $self.init(config);
    return;
  }

  init(config) {
    return this.peer.init(this,config);
  }

  config() {
    return this.peer.config(this);
  }

  isBound() {
    return this.peer.isBound(this);
  }

  isClosed() {
    return this.peer.isClosed(this);
  }

  localAddr() {
    return this.peer.localAddr(this);
  }

  localPort() {
    return this.peer.localPort(this);
  }

  bind(addr,port,backlog) {
    if (backlog === undefined) backlog = 50;
    return this.peer.bind(this,addr,port,backlog);
  }

  accept() {
    return this.doAccept();
  }

  doAccept() {
    return this.peer.doAccept(this);
  }

  close() {
    return this.peer.close(this);
  }

  options() {
    return SocketOptions.make(this);
  }

  getReceiveBufferSize() {
    return this.peer.getReceiveBufferSize(this);
  }

  setReceiveBufferSize(v) {
    return this.peer.setReceiveBufferSize(this,v);
  }

  getReuseAddr() {
    return this.peer.getReuseAddr(this);
  }

  setReuseAddr(v) {
    return this.peer.setReuseAddr(this,v);
  }

}

class IpAddr extends sys.Obj {
  constructor() {
    super();
    this.peer = new IpAddrPeer(this);
    const this$ = this;
  }

  typeof() { return IpAddr.type$; }

  static make(s) {
    return IpAddr.makeNative(s);
  }

  static makeNative(s) {
    return IpAddrPeer.makeNative(s);
  }

  static makeAll(s) {
    return IpAddrPeer.makeAll(s);
  }

  static makeBytes(bytes) {
    return IpAddrPeer.makeBytes(bytes);
  }

  static local() {
    return IpAddrPeer.local();
  }

  static internalMake() {
    const $self = new IpAddr();
    IpAddr.internalMake$($self);
    return $self;
  }

  static internalMake$($self) {
    return;
  }

  hash() {
    return this.peer.hash(this);
  }

  equals(obj) {
    return this.peer.equals(this,obj);
  }

  toStr() {
    return this.peer.toStr(this);
  }

  isIPv4() {
    return this.peer.isIPv4(this);
  }

  isIPv6() {
    return this.peer.isIPv6(this);
  }

  isLoopback() {
    return this.peer.isLoopback(this);
  }

  isSiteLocal() {
    return this.peer.isSiteLocal(this);
  }

  bytes() {
    return this.peer.bytes(this);
  }

  numeric() {
    return this.peer.numeric(this);
  }

  hostname() {
    return this.peer.hostname(this);
  }

  toNative() {
    return this.peer.toNative(this);
  }

}

class SocketOptions extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SocketOptions.type$; }

  #inBufferSize = null;

  inBufferSize(it) {
    if (it === undefined) {
      const this$ = this;
      return sys.ObjUtil.coerce(this.wrap(() => {
        return sys.ObjUtil.trap(this$.#socket,"getInBufferSize", sys.List.make(sys.Obj.type$.toNullable(), []));
      }), sys.Int.type$.toNullable());
    }
    else {
      const this$ = this;
      let newVal = it;
      this.wrap(() => {
        sys.ObjUtil.trap(this$.#socket,"setInBufferSize", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(newVal, sys.Obj.type$.toNullable())]));
        return;
      });
      return;
    }
  }

  #outBufferSize = null;

  outBufferSize(it) {
    if (it === undefined) {
      const this$ = this;
      return sys.ObjUtil.coerce(this.wrap(() => {
        return sys.ObjUtil.trap(this$.#socket,"getOutBufferSize", sys.List.make(sys.Obj.type$.toNullable(), []));
      }), sys.Int.type$.toNullable());
    }
    else {
      const this$ = this;
      let newVal = it;
      this.wrap(() => {
        sys.ObjUtil.trap(this$.#socket,"setOutBufferSize", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(newVal, sys.Obj.type$.toNullable())]));
        return;
      });
      return;
    }
  }

  #broadcast = false;

  broadcast(it) {
    if (it === undefined) {
      const this$ = this;
      return sys.ObjUtil.coerce(this.wrap(() => {
        return sys.ObjUtil.coerce(sys.ObjUtil.trap(this$.#socket,"getBroadcast", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Obj.type$);
      }), sys.Bool.type$);
    }
    else {
      const this$ = this;
      let newVal = it;
      this.wrap(() => {
        sys.ObjUtil.trap(this$.#socket,"setBroadcast", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(newVal, sys.Obj.type$.toNullable())]));
        return;
      });
      return;
    }
  }

  #keepAlive = false;

  keepAlive(it) {
    if (it === undefined) {
      const this$ = this;
      return sys.ObjUtil.coerce(this.wrap(() => {
        return sys.ObjUtil.coerce(sys.ObjUtil.trap(this$.#socket,"getKeepAlive", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Obj.type$);
      }), sys.Bool.type$);
    }
    else {
      const this$ = this;
      let newVal = it;
      this.wrap(() => {
        sys.ObjUtil.trap(this$.#socket,"setKeepAlive", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(newVal, sys.Obj.type$.toNullable())]));
        return;
      });
      return;
    }
  }

  #receiveBufferSize = 0;

  receiveBufferSize(it) {
    if (it === undefined) {
      const this$ = this;
      return sys.ObjUtil.coerce(this.wrap(() => {
        return sys.ObjUtil.coerce(sys.ObjUtil.trap(this$.#socket,"getReceiveBufferSize", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Obj.type$);
      }), sys.Int.type$);
    }
    else {
      const this$ = this;
      let newVal = it;
      this.wrap(() => {
        sys.ObjUtil.trap(this$.#socket,"setReceiveBufferSize", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(newVal, sys.Obj.type$.toNullable())]));
        return;
      });
      return;
    }
  }

  #sendBufferSize = 0;

  sendBufferSize(it) {
    if (it === undefined) {
      const this$ = this;
      return sys.ObjUtil.coerce(this.wrap(() => {
        return sys.ObjUtil.coerce(sys.ObjUtil.trap(this$.#socket,"getSendBufferSize", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Obj.type$);
      }), sys.Int.type$);
    }
    else {
      const this$ = this;
      let newVal = it;
      this.wrap(() => {
        sys.ObjUtil.trap(this$.#socket,"setSendBufferSize", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(newVal, sys.Obj.type$.toNullable())]));
        return;
      });
      return;
    }
  }

  #reuseAddr = false;

  reuseAddr(it) {
    if (it === undefined) {
      const this$ = this;
      return sys.ObjUtil.coerce(this.wrap(() => {
        return sys.ObjUtil.coerce(sys.ObjUtil.trap(this$.#socket,"getReuseAddr", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Obj.type$);
      }), sys.Bool.type$);
    }
    else {
      const this$ = this;
      let newVal = it;
      this.wrap(() => {
        sys.ObjUtil.trap(this$.#socket,"setReuseAddr", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(newVal, sys.Obj.type$.toNullable())]));
        return;
      });
      return;
    }
  }

  #linger = null;

  linger(it) {
    if (it === undefined) {
      const this$ = this;
      return sys.ObjUtil.coerce(this.wrap(() => {
        return sys.ObjUtil.trap(this$.#socket,"getLinger", sys.List.make(sys.Obj.type$.toNullable(), []));
      }), sys.Duration.type$.toNullable());
    }
    else {
      const this$ = this;
      let newVal = it;
      this.wrap(() => {
        sys.ObjUtil.trap(this$.#socket,"setLinger", sys.List.make(sys.Obj.type$.toNullable(), [newVal]));
        return;
      });
      return;
    }
  }

  #connectTimeout = null;

  connectTimeout(it) {
    if (it === undefined) {
      return this.#connectTimeout;
    }
    else {
      this.#connectTimeout = it;
      return;
    }
  }

  #receiveTimeout = null;

  receiveTimeout(it) {
    if (it === undefined) {
      const this$ = this;
      return sys.ObjUtil.coerce(this.wrap(() => {
        return sys.ObjUtil.trap(this$.#socket,"getReceiveTimeout", sys.List.make(sys.Obj.type$.toNullable(), []));
      }), sys.Duration.type$.toNullable());
    }
    else {
      const this$ = this;
      let newVal = it;
      this.wrap(() => {
        sys.ObjUtil.trap(this$.#socket,"setReceiveTimeout", sys.List.make(sys.Obj.type$.toNullable(), [newVal]));
        return;
      });
      return;
    }
  }

  #noDelay = false;

  noDelay(it) {
    if (it === undefined) {
      const this$ = this;
      return sys.ObjUtil.coerce(this.wrap(() => {
        return sys.ObjUtil.coerce(sys.ObjUtil.trap(this$.#socket,"getNoDelay", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Obj.type$);
      }), sys.Bool.type$);
    }
    else {
      const this$ = this;
      let newVal = it;
      this.wrap(() => {
        sys.ObjUtil.trap(this$.#socket,"setNoDelay", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(newVal, sys.Obj.type$.toNullable())]));
        return;
      });
      return;
    }
  }

  #trafficClass = 0;

  trafficClass(it) {
    if (it === undefined) {
      const this$ = this;
      return sys.ObjUtil.coerce(this.wrap(() => {
        return sys.ObjUtil.coerce(sys.ObjUtil.trap(this$.#socket,"getTrafficClass", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Obj.type$);
      }), sys.Int.type$);
    }
    else {
      const this$ = this;
      let newVal = it;
      this.wrap(() => {
        sys.ObjUtil.trap(this$.#socket,"setTrafficClass", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(newVal, sys.Obj.type$.toNullable())]));
        return;
      });
      return;
    }
  }

  #socket = null;

  // private field reflection only
  __socket(it) { if (it === undefined) return this.#socket; else this.#socket = it; }

  static make(socket) {
    const $self = new SocketOptions();
    SocketOptions.make$($self,socket);
    return $self;
  }

  static make$($self,socket) {
    $self.#socket = socket;
    return;
  }

  copyFrom(options) {
    const this$ = this;
    sys.Type.of(this).fields().each((f) => {
      try {
        let v = f.get(options);
        if ((sys.ObjUtil.equals(v, 0) && sys.ObjUtil.equals(f.name(), "trafficClass"))) {
          return;
        }
        ;
        f.set(this$, v);
      }
      catch ($_u0) {
        $_u0 = sys.Err.make($_u0);
        if ($_u0 instanceof sys.UnsupportedErr) {
          let e = $_u0;
          ;
        }
        else {
          throw $_u0;
        }
      }
      ;
      return;
    });
    return;
  }

  wrap(m) {
    try {
      return sys.Func.call(m);
    }
    catch ($_u1) {
      $_u1 = sys.Err.make($_u1);
      if ($_u1 instanceof sys.UnknownSlotErr) {
        let e = $_u1;
        ;
        throw sys.UnsupportedErr.make(sys.Str.plus("Option not supported for ", sys.Type.of(this.#socket)));
      }
      else {
        throw $_u1;
      }
    }
    ;
  }

}

class UnknownHostErr extends sys.IOErr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownHostErr.type$; }

  static make(msg,cause) {
    const $self = new UnknownHostErr();
    UnknownHostErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.IOErr.make$($self, msg, cause);
    return;
  }

}

class UdpSocket extends sys.Obj {
  constructor() {
    super();
    this.peer = new UdpSocketPeer(this);
    const this$ = this;
  }

  typeof() { return UdpSocket.type$; }

  static make(config) {
    const $self = new UdpSocket();
    UdpSocket.make$($self,config);
    return $self;
  }

  static make$($self,config) {
    if (config === undefined) config = SocketConfig.cur();
    $self.init(config);
    return;
  }

  init(config) {
    return this.peer.init(this,config);
  }

  config() {
    return this.peer.config(this);
  }

  isBound() {
    return this.peer.isBound(this);
  }

  isConnected() {
    return this.peer.isConnected(this);
  }

  isClosed() {
    return this.peer.isClosed(this);
  }

  localAddr() {
    return this.peer.localAddr(this);
  }

  localPort() {
    return this.peer.localPort(this);
  }

  remoteAddr() {
    return this.peer.remoteAddr(this);
  }

  remotePort() {
    return this.peer.remotePort(this);
  }

  bind(addr,port) {
    return this.peer.bind(this,addr,port);
  }

  connect(addr,port) {
    return this.peer.connect(this,addr,port);
  }

  send(packet) {
    return this.peer.send(this,packet);
  }

  receive(packet) {
    if (packet === undefined) packet = null;
    return this.peer.receive(this,packet);
  }

  disconnect() {
    return this.peer.disconnect(this);
  }

  close() {
    return this.peer.close(this);
  }

  options() {
    return this.peer.options(this);
  }

  getBroadcast() {
    return this.peer.getBroadcast(this);
  }

  setBroadcast(v) {
    return this.peer.setBroadcast(this,v);
  }

  getReceiveBufferSize() {
    return this.peer.getReceiveBufferSize(this);
  }

  setReceiveBufferSize(v) {
    return this.peer.setReceiveBufferSize(this,v);
  }

  getSendBufferSize() {
    return this.peer.getSendBufferSize(this);
  }

  setSendBufferSize(v) {
    return this.peer.setSendBufferSize(this,v);
  }

  getReuseAddr() {
    return this.peer.getReuseAddr(this);
  }

  setReuseAddr(v) {
    return this.peer.setReuseAddr(this,v);
  }

  getReceiveTimeout() {
    return this.peer.getReceiveTimeout(this);
  }

  setReceiveTimeout(v) {
    return this.peer.setReceiveTimeout(this,v);
  }

  getTrafficClass() {
    return this.peer.getTrafficClass(this);
  }

  setTrafficClass(v) {
    return this.peer.setTrafficClass(this,v);
  }

}

class MulticastSocket extends UdpSocket {
  constructor() {
    super();
    this.peer = new MulticastSocketPeer(this);
    const this$ = this;
  }

  typeof() { return MulticastSocket.type$; }

  #interface = null;

  interface(it) {
    if (it === undefined) {
      return this.getInterface();
    }
    else {
      this.setInterface(it);
      return;
    }
  }

  timeToLive(it) {
    if (it === undefined) return this.peer.timeToLive(this);
    this.peer.timeToLive(this, it);
  }

  loopbackMode(it) {
    if (it === undefined) return this.peer.loopbackMode(this);
    this.peer.loopbackMode(this, it);
  }

  static make(config) {
    const $self = new MulticastSocket();
    MulticastSocket.make$($self,config);
    return $self;
  }

  static make$($self,config) {
    if (config === undefined) config = SocketConfig.cur();
    UdpSocket.make$($self, config);
    return;
  }

  getInterface() {
    return this.peer.getInterface(this);
  }

  setInterface(val) {
    return this.peer.setInterface(this,val);
  }

  joinGroup(addr,port,interface$) {
    if (port === undefined) port = null;
    if (interface$ === undefined) interface$ = null;
    return this.peer.joinGroup(this,addr,port,interface$);
  }

  leaveGroup(addr,port,interface$) {
    if (port === undefined) port = null;
    if (interface$ === undefined) interface$ = null;
    return this.peer.leaveGroup(this,addr,port,interface$);
  }

}

class SocketConfig extends sys.Obj {
  constructor() {
    super();
    this.peer = new SocketConfigPeer(this);
    const this$ = this;
    this.#keystore = null;
    this.#truststore = null;
    this.#tlsParams = sys.ObjUtil.coerce(((this$) => { let $_u2 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")); if ($_u2 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))); })(this), sys.Type.find("[sys::Str:sys::Obj?]"));
    this.#inBufferSize = sys.ObjUtil.coerce(4096, sys.Int.type$.toNullable());
    this.#outBufferSize = sys.ObjUtil.coerce(4096, sys.Int.type$.toNullable());
    this.#keepAlive = false;
    this.#receiveBufferSize = 65536;
    this.#sendBufferSize = 65536;
    this.#reuseAddr = false;
    this.#linger = null;
    this.#connectTimeout = sys.Duration.fromStr("1min");
    this.#receiveTimeout = sys.Duration.fromStr("1min");
    this.#acceptTimeout = null;
    this.#noDelay = true;
    this.#trafficClass = 0;
    this.#broadcast = false;
    return;
  }

  typeof() { return SocketConfig.type$; }

  static #curRef = undefined;

  static curRef() {
    if (SocketConfig.#curRef === undefined) {
      SocketConfig.static$init();
      if (SocketConfig.#curRef === undefined) SocketConfig.#curRef = null;
    }
    return SocketConfig.#curRef;
  }

  static #errRef = undefined;

  static errRef() {
    if (SocketConfig.#errRef === undefined) {
      SocketConfig.static$init();
      if (SocketConfig.#errRef === undefined) SocketConfig.#errRef = null;
    }
    return SocketConfig.#errRef;
  }

  #keystore = null;

  keystore() { return this.#keystore; }

  __keystore(it) { if (it === undefined) return this.#keystore; else this.#keystore = it; }

  #truststore = null;

  truststore() { return this.#truststore; }

  __truststore(it) { if (it === undefined) return this.#truststore; else this.#truststore = it; }

  #tlsParams = null;

  tlsParams() { return this.#tlsParams; }

  __tlsParams(it) { if (it === undefined) return this.#tlsParams; else this.#tlsParams = it; }

  #inBufferSize = null;

  inBufferSize() { return this.#inBufferSize; }

  __inBufferSize(it) { if (it === undefined) return this.#inBufferSize; else this.#inBufferSize = it; }

  #outBufferSize = null;

  outBufferSize() { return this.#outBufferSize; }

  __outBufferSize(it) { if (it === undefined) return this.#outBufferSize; else this.#outBufferSize = it; }

  #keepAlive = false;

  keepAlive() { return this.#keepAlive; }

  __keepAlive(it) { if (it === undefined) return this.#keepAlive; else this.#keepAlive = it; }

  #receiveBufferSize = 0;

  receiveBufferSize() { return this.#receiveBufferSize; }

  __receiveBufferSize(it) { if (it === undefined) return this.#receiveBufferSize; else this.#receiveBufferSize = it; }

  #sendBufferSize = 0;

  sendBufferSize() { return this.#sendBufferSize; }

  __sendBufferSize(it) { if (it === undefined) return this.#sendBufferSize; else this.#sendBufferSize = it; }

  #reuseAddr = false;

  reuseAddr() { return this.#reuseAddr; }

  __reuseAddr(it) { if (it === undefined) return this.#reuseAddr; else this.#reuseAddr = it; }

  #linger = null;

  linger() { return this.#linger; }

  __linger(it) { if (it === undefined) return this.#linger; else this.#linger = it; }

  #connectTimeout = null;

  connectTimeout() { return this.#connectTimeout; }

  __connectTimeout(it) { if (it === undefined) return this.#connectTimeout; else this.#connectTimeout = it; }

  #receiveTimeout = null;

  receiveTimeout() { return this.#receiveTimeout; }

  __receiveTimeout(it) { if (it === undefined) return this.#receiveTimeout; else this.#receiveTimeout = it; }

  #acceptTimeout = null;

  acceptTimeout() { return this.#acceptTimeout; }

  __acceptTimeout(it) { if (it === undefined) return this.#acceptTimeout; else this.#acceptTimeout = it; }

  #noDelay = false;

  noDelay() { return this.#noDelay; }

  __noDelay(it) { if (it === undefined) return this.#noDelay; else this.#noDelay = it; }

  #trafficClass = 0;

  trafficClass() { return this.#trafficClass; }

  __trafficClass(it) { if (it === undefined) return this.#trafficClass; else this.#trafficClass = it; }

  #broadcast = false;

  broadcast() { return this.#broadcast; }

  __broadcast(it) { if (it === undefined) return this.#broadcast; else this.#broadcast = it; }

  static cur() {
    return sys.ObjUtil.coerce(SocketConfig.curRef().val(), SocketConfig.type$);
  }

  static setCur(cfg) {
    if (SocketConfig.errRef().val() != null) {
      throw sys.Err.make("Default socket configuration already set", sys.ObjUtil.coerce(SocketConfig.errRef().val(), sys.Err.type$.toNullable()));
    }
    ;
    SocketConfig.curRef().val(cfg);
    SocketConfig.errRef().val(sys.Err.make("Default socket configuration changed"));
    return;
  }

  static make(f) {
    const $self = new SocketConfig();
    SocketConfig.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    ;
    ((this$) => { let $_u3 = f; if ($_u3 == null) return null; return sys.Func.call(f, this$); })($self);
    return;
  }

  static makeCopy(orig,f) {
    const $self = new SocketConfig();
    SocketConfig.makeCopy$($self,orig,f);
    return $self;
  }

  static makeCopy$($self,orig,f) {
    ;
    if (orig != null) {
      $self.#keystore = orig.#keystore;
      $self.#truststore = orig.#truststore;
      $self.#tlsParams = sys.ObjUtil.coerce(((this$) => { let $_u4 = orig.#tlsParams; if ($_u4 == null) return null; return sys.ObjUtil.toImmutable(orig.#tlsParams); })($self), sys.Type.find("[sys::Str:sys::Obj?]"));
      $self.#inBufferSize = orig.#inBufferSize;
      $self.#keepAlive = orig.#keepAlive;
      $self.#receiveBufferSize = orig.#receiveBufferSize;
      $self.#sendBufferSize = orig.#sendBufferSize;
      $self.#reuseAddr = orig.#reuseAddr;
      $self.#linger = orig.#linger;
      $self.#connectTimeout = orig.#connectTimeout;
      $self.#receiveTimeout = orig.#receiveTimeout;
      $self.#acceptTimeout = orig.#acceptTimeout;
      $self.#noDelay = orig.#noDelay;
      $self.#trafficClass = orig.#trafficClass;
      $self.#broadcast = orig.#broadcast;
    }
    ;
    sys.Func.call(f, $self);
    return;
  }

  copy(f) {
    return SocketConfig.makeCopy(this, f);
  }

  setTimeouts(connectTimeout,receiveTimeout) {
    if (receiveTimeout === undefined) receiveTimeout = connectTimeout;
    const this$ = this;
    return this.copy((it) => {
      it.#connectTimeout = connectTimeout;
      it.#receiveTimeout = receiveTimeout;
      return;
    });
  }

  force_peer() {
    return this.peer.force_peer(this);
  }

  static static$init() {
    SocketConfig.#curRef = concurrent.AtomicRef.make(SocketConfig.make());
    SocketConfig.#errRef = concurrent.AtomicRef.make();
    return;
  }

}

class TcpSocket extends sys.Obj {
  constructor() {
    super();
    this.peer = new TcpSocketPeer(this);
    const this$ = this;
  }

  typeof() { return TcpSocket.type$; }

  static make(config) {
    const $self = new TcpSocket();
    TcpSocket.make$($self,config);
    return $self;
  }

  static make$($self,config) {
    if (config === undefined) config = SocketConfig.cur();
    $self.init(config);
    return;
  }

  init(config) {
    return this.peer.init(this,config);
  }

  config() {
    return this.peer.config(this);
  }

  isBound() {
    return this.peer.isBound(this);
  }

  isConnected() {
    return this.peer.isConnected(this);
  }

  isClosed() {
    return this.peer.isClosed(this);
  }

  localAddr() {
    return this.peer.localAddr(this);
  }

  localPort() {
    return this.peer.localPort(this);
  }

  remoteAddr() {
    return this.peer.remoteAddr(this);
  }

  remotePort() {
    return this.peer.remotePort(this);
  }

  bind(addr,port) {
    return this.peer.bind(this,addr,port);
  }

  connect(addr,port,timeout) {
    if (timeout === undefined) timeout = this.config().connectTimeout();
    return this.peer.connect(this,addr,port,timeout);
  }

  upgradeTls(addr,port) {
    if (addr === undefined) addr = null;
    if (port === undefined) port = null;
    return this.peer.upgradeTls(this,addr,port);
  }

  in() {
    return this.peer.in(this);
  }

  out() {
    return this.peer.out(this);
  }

  close() {
    return this.peer.close(this);
  }

  shutdownIn() {
    return this.peer.shutdownIn(this);
  }

  shutdownOut() {
    return this.peer.shutdownOut(this);
  }

  clientAuth() {
    return this.peer.clientAuth(this);
  }

  localCerts() {
    return this.peer.localCerts(this);
  }

  remoteCerts() {
    return this.peer.remoteCerts(this);
  }

  options() {
    return this.peer.options(this);
  }

  getInBufferSize() {
    return this.peer.getInBufferSize(this);
  }

  setInBufferSize(v) {
    return this.peer.setInBufferSize(this,v);
  }

  getOutBufferSize() {
    return this.peer.getOutBufferSize(this);
  }

  setOutBufferSize(v) {
    return this.peer.setOutBufferSize(this,v);
  }

  getKeepAlive() {
    return this.peer.getKeepAlive(this);
  }

  setKeepAlive(v) {
    return this.peer.setKeepAlive(this,v);
  }

  getReceiveBufferSize() {
    return this.peer.getReceiveBufferSize(this);
  }

  setReceiveBufferSize(v) {
    return this.peer.setReceiveBufferSize(this,v);
  }

  getSendBufferSize() {
    return this.peer.getSendBufferSize(this);
  }

  setSendBufferSize(v) {
    return this.peer.setSendBufferSize(this,v);
  }

  getReuseAddr() {
    return this.peer.getReuseAddr(this);
  }

  setReuseAddr(v) {
    return this.peer.setReuseAddr(this,v);
  }

  getLinger() {
    return this.peer.getLinger(this);
  }

  setLinger(v) {
    return this.peer.setLinger(this,v);
  }

  getReceiveTimeout() {
    return this.peer.getReceiveTimeout(this);
  }

  setReceiveTimeout(v) {
    return this.peer.setReceiveTimeout(this,v);
  }

  getNoDelay() {
    return this.peer.getNoDelay(this);
  }

  setNoDelay(v) {
    return this.peer.setNoDelay(this,v);
  }

  getTrafficClass() {
    return this.peer.getTrafficClass(this);
  }

  setTrafficClass(v) {
    return this.peer.setTrafficClass(this,v);
  }

}

class IpInterface extends sys.Obj {
  constructor() {
    super();
    this.peer = new IpInterfacePeer(this);
    const this$ = this;
  }

  typeof() { return IpInterface.type$; }

  static list() {
    return IpInterfacePeer.list();
  }

  static findByAddr(addr,checked) {
    if (checked === undefined) checked = true;
    return IpInterfacePeer.findByAddr(addr,checked);
  }

  static findByName(name,checked) {
    if (checked === undefined) checked = true;
    return IpInterfacePeer.findByName(name,checked);
  }

  static make() {
    const $self = new IpInterface();
    IpInterface.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  hash() {
    return this.peer.hash(this);
  }

  toStr() {
    return this.peer.toStr(this);
  }

  equals(obj) {
    return this.peer.equals(this,obj);
  }

  name() {
    return this.peer.name(this);
  }

  dis() {
    return this.peer.dis(this);
  }

  addrs() {
    return this.peer.addrs(this);
  }

  broadcastAddrs() {
    return this.peer.broadcastAddrs(this);
  }

  prefixSize(addr) {
    return this.peer.prefixSize(this,addr);
  }

  isUp() {
    return this.peer.isUp(this);
  }

  hardwareAddr() {
    return this.peer.hardwareAddr(this);
  }

  mtu() {
    return this.peer.mtu(this);
  }

  supportsMulticast() {
    return this.peer.supportsMulticast(this);
  }

  isPointToPoint() {
    return this.peer.isPointToPoint(this);
  }

  isLoopback() {
    return this.peer.isLoopback(this);
  }

}

class UdpPacket extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#addr = null;
    this.#port = null;
    this.#data = null;
    return;
  }

  typeof() { return UdpPacket.type$; }

  #addr = null;

  addr(it) {
    if (it === undefined) {
      return this.#addr;
    }
    else {
      this.#addr = it;
      return;
    }
  }

  #port = null;

  port(it) {
    if (it === undefined) {
      return this.#port;
    }
    else {
      this.#port = it;
      return;
    }
  }

  #data = null;

  data(it) {
    if (it === undefined) {
      return this.#data;
    }
    else {
      this.#data = it;
      return;
    }
  }

  static make(addr,port,data) {
    const $self = new UdpPacket();
    UdpPacket.make$($self,addr,port,data);
    return $self;
  }

  static make$($self,addr,port,data) {
    if (addr === undefined) addr = null;
    if (port === undefined) port = null;
    if (data === undefined) data = null;
    ;
    $self.#addr = addr;
    $self.#port = port;
    $self.#data = data;
    return;
  }

}

class UdpSocketTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UdpSocketTest.type$; }

  testMake() {
    let s = UdpSocket.make();
    this.verifyEq(sys.ObjUtil.coerce(s.isBound(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.isConnected(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(s.localAddr(), null);
    this.verifyEq(sys.ObjUtil.coerce(s.localPort(), sys.Obj.type$.toNullable()), null);
    this.verifyEq(s.remoteAddr(), null);
    this.verifyEq(sys.ObjUtil.coerce(s.remotePort(), sys.Obj.type$.toNullable()), null);
    s.close();
    return;
  }

  testBind() {
    this.verifyBind(null, null);
    this.verifyBind(IpAddr.local(), null);
    this.verifyBind(null, sys.ObjUtil.coerce(2072, sys.Int.type$.toNullable()));
    this.verifyBind(IpAddr.local(), sys.ObjUtil.coerce(2073, sys.Int.type$.toNullable()));
    return;
  }

  verifyBind(addr,port) {
    let s = UdpSocket.make();
    this.verifySame(s.bind(addr, port), s);
    this.verifyEq(sys.ObjUtil.coerce(s.isBound(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.isConnected(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    if (addr == null) {
      this.verify(s.localAddr() != null);
    }
    else {
      this.verifyEq(s.localAddr(), addr);
    }
    ;
    if (port == null) {
      this.verify(sys.ObjUtil.compareGT(s.localPort(), 0));
    }
    else {
      this.verifyEq(sys.ObjUtil.coerce(s.localPort(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(port, sys.Obj.type$.toNullable()));
    }
    ;
    this.verifyEq(s.remoteAddr(), null);
    this.verifyEq(sys.ObjUtil.coerce(s.remotePort(), sys.Obj.type$.toNullable()), null);
    s.close();
    this.verifyEq(sys.ObjUtil.coerce(s.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    return;
  }

  testMessaging() {
    const this$ = this;
    let s = UdpSocket.make().bind(null, null);
    let sactor = concurrent.Actor.make(concurrent.ActorPool.make(), (msg) => {
      return UdpSocketTest.runServer(sys.ObjUtil.coerce(sys.ObjUtil.trap(msg,"val", sys.List.make(sys.Obj.type$.toNullable(), [])), UdpSocket.type$));
    });
    let sfuture = sactor.send(sys.Unsafe.make(s));
    concurrent.Actor.sleep(sys.Duration.fromStr("50ms"));
    let c = UdpSocket.make();
    c.connect(IpAddr.local(), sys.ObjUtil.coerce(s.localPort(), sys.Int.type$));
    this.verifyEq(sys.ObjUtil.coerce(c.isBound(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(c.isConnected(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(c.remoteAddr(), IpAddr.local());
    this.verifyEq(sys.ObjUtil.coerce(c.remotePort(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(s.localPort(), sys.Obj.type$.toNullable()));
    this.verifyErr(sys.ArgErr.type$, (it) => {
      c.send(UdpPacket.make(IpAddr.local(), null, sys.Buf.make()));
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      c.send(UdpPacket.make(null, s.localPort(), sys.Buf.make()));
      return;
    });
    let buf = sys.Buf.make();
    buf.print("alpha");
    c.send(UdpPacket.make(null, null, sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable())));
    let packet = c.receive();
    this.verifyEq(sys.ObjUtil.coerce(packet.data().capacity(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1024, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(packet.data().flip(), sys.Buf.type$.toNullable()).readAllStr(), "alpha.");
    sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()).print("hello");
    buf.flip();
    sys.Int.times(3, (it) => {
      buf.read();
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(buf.pos(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    c.send(UdpPacket.make(null, null, buf));
    (packet = c.receive());
    this.verifyEq(sys.ObjUtil.coerce(packet.data().flip(), sys.Buf.type$.toNullable()).readAllStr(), "lo.");
    c.disconnect();
    this.verifyEq(sys.ObjUtil.coerce(c.isConnected(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(c.remoteAddr(), null);
    this.verifyEq(sys.ObjUtil.coerce(c.remotePort(), sys.Obj.type$.toNullable()), null);
    this.verifyErr(sys.ArgErr.type$, (it) => {
      c.send(UdpPacket.make(IpAddr.local(), null, sys.Buf.make()));
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      c.send(UdpPacket.make(null, s.localPort(), sys.Buf.make()));
      return;
    });
    c.send(UdpPacket.make(IpAddr.local(), s.localPort(), sys.ObjUtil.coerce(sys.ObjUtil.trap(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()).print("abc"), sys.Buf.type$.toNullable()),"flip", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Buf.type$)));
    sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()).print("xy");
    this.verifyEq(sys.ObjUtil.coerce(buf.pos(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    (packet = c.receive(UdpPacket.make(null, null, buf)));
    this.verifyEq(packet.addr(), IpAddr.local());
    this.verifyEq(sys.ObjUtil.coerce(packet.port(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(s.localPort(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(packet.data().flip(), sys.Buf.type$.toNullable()).readAllStr(), "xyabc.");
    c.send(UdpPacket.make(IpAddr.local(), s.localPort(), sys.ObjUtil.coerce(sys.ObjUtil.trap(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()).print("ABCDEFG"), sys.Buf.type$.toNullable()),"flip", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Buf.type$)));
    sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()).capacity(3);
    this.verifyEq(sys.ObjUtil.coerce(buf.pos(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(buf.capacity(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    c.receive(packet);
    this.verifyEq(packet.addr(), IpAddr.local());
    this.verifyEq(sys.ObjUtil.coerce(packet.port(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(s.localPort(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(packet.data().flip(), sys.Buf.type$.toNullable()).readAllStr(), "ABC");
    c.send(UdpPacket.make(IpAddr.local(), s.localPort(), sys.ObjUtil.coerce(sys.ObjUtil.trap(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()).print("0123456789"), sys.Buf.type$.toNullable()),"flip", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Buf.type$)));
    sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()).capacity(5);
    buf.print("qr");
    this.verifyEq(sys.ObjUtil.coerce(buf.pos(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(buf.capacity(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    c.receive(packet);
    this.verifyEq(packet.addr(), IpAddr.local());
    this.verifyEq(sys.ObjUtil.coerce(packet.port(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(s.localPort(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(packet.data().flip(), sys.Buf.type$.toNullable()).readAllStr(), "qr012");
    c.connect(IpAddr.local(), sys.ObjUtil.coerce(s.localPort(), sys.Int.type$));
    this.verifyEq(sys.ObjUtil.coerce(c.isConnected(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(c.remoteAddr(), IpAddr.local());
    this.verifyEq(sys.ObjUtil.coerce(c.remotePort(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(s.localPort(), sys.Obj.type$.toNullable()));
    c.send(UdpPacket.make(null, null, sys.ObjUtil.coerce(sys.ObjUtil.trap(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()).print("kill"), sys.Buf.type$.toNullable()),"flip", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Buf.type$)));
    sfuture.get(sys.Duration.fromStr("5sec"));
    s.close();
    c.close();
    return;
  }

  static runServer(s) {
    while (true) {
      let packet = s.receive();
      let req = sys.ObjUtil.coerce(packet.data().flip(), sys.Buf.type$.toNullable()).readAllStr();
      if (sys.ObjUtil.equals(req, "kill")) {
        break;
      }
      ;
      packet.data().print(".");
      packet.data().flip();
      s.send(packet);
    }
    ;
    return "ok";
  }

  testOptions() {
    const this$ = this;
    let s = UdpSocket.make();
    let so = s.options();
    let broadcast = so.broadcast();
    so.broadcast(!broadcast);
    this.verifyEq(sys.ObjUtil.coerce(so.broadcast(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(!broadcast, sys.Obj.type$.toNullable()));
    let receive = so.receiveBufferSize();
    so.receiveBufferSize(sys.Int.mult(receive, 2));
    this.verifyEq(sys.ObjUtil.coerce(so.receiveBufferSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.mult(receive, 2), sys.Obj.type$.toNullable()));
    let send = so.sendBufferSize();
    so.sendBufferSize(sys.Int.div(send, 2));
    this.verifyEq(sys.ObjUtil.coerce(so.sendBufferSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.div(send, 2), sys.Obj.type$.toNullable()));
    let reuse = so.reuseAddr();
    so.reuseAddr(!reuse);
    this.verifyEq(sys.ObjUtil.coerce(so.reuseAddr(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(!reuse, sys.Obj.type$.toNullable()));
    so.receiveTimeout(sys.Duration.fromStr("100ms"));
    this.verifyEq(so.receiveTimeout(), sys.Duration.fromStr("100ms"));
    so.receiveTimeout(null);
    this.verifyEq(so.receiveTimeout(), null);
    let tc = so.trafficClass();
    so.trafficClass(6);
    this.verifyEq(sys.ObjUtil.coerce(so.trafficClass(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(6, sys.Obj.type$.toNullable()));
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      sys.ObjUtil.echo(sys.ObjUtil.coerce(so.inBufferSize(), sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      so.inBufferSize(sys.ObjUtil.coerce(88, sys.Int.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      sys.ObjUtil.echo(sys.ObjUtil.coerce(so.outBufferSize(), sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      so.outBufferSize(sys.ObjUtil.coerce(99, sys.Int.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      sys.ObjUtil.echo(sys.ObjUtil.coerce(so.keepAlive(), sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      so.keepAlive(false);
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      sys.ObjUtil.echo(so.linger());
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      so.linger(null);
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      sys.ObjUtil.echo(sys.ObjUtil.coerce(so.noDelay(), sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      so.noDelay(true);
      return;
    });
    let xo = TcpSocket.make().options();
    xo.copyFrom(so);
    this.verifyEq(sys.ObjUtil.coerce(xo.broadcast(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(so.broadcast(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(xo.receiveBufferSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(so.receiveBufferSize(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(xo.sendBufferSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(so.sendBufferSize(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(xo.reuseAddr(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(so.reuseAddr(), sys.Obj.type$.toNullable()));
    this.verifyEq(xo.receiveTimeout(), so.receiveTimeout());
    s.close();
    return;
  }

  static make() {
    const $self = new UdpSocketTest();
    UdpSocketTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class TcpListenerTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TcpListenerTest.type$; }

  testMake() {
    let s = TcpListener.make();
    this.verifyEq(sys.ObjUtil.coerce(s.isBound(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(s.localAddr(), null);
    this.verifyEq(sys.ObjUtil.coerce(s.localPort(), sys.Obj.type$.toNullable()), null);
    s.close();
    return;
  }

  testBind() {
    this.verifyBind(null, null);
    this.verifyBind(IpAddr.local(), null);
    this.verifyBind(null, sys.ObjUtil.coerce(1872, sys.Int.type$.toNullable()));
    this.verifyBind(IpAddr.local(), sys.ObjUtil.coerce(1873, sys.Int.type$.toNullable()));
    return;
  }

  verifyBind(addr,port) {
    let s = TcpListener.make();
    this.verifySame(s.bind(addr, port), s);
    this.verifyEq(sys.ObjUtil.coerce(s.isBound(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    if (addr == null) {
      this.verify(s.localAddr() != null);
    }
    else {
      this.verifyEq(s.localAddr(), addr);
    }
    ;
    if (port == null) {
      this.verify(sys.ObjUtil.compareGT(s.localPort(), 0));
    }
    else {
      this.verifyEq(sys.ObjUtil.coerce(s.localPort(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(port, sys.Obj.type$.toNullable()));
    }
    ;
    s.close();
    this.verifyEq(sys.ObjUtil.coerce(s.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    return;
  }

  testAccept() {
    const this$ = this;
    let listener = TcpListener.make().bind(null, null);
    let port = listener.localPort();
    let actor = concurrent.Actor.make(concurrent.ActorPool.make(), (it) => {
      return TcpListenerTest.runClient(sys.ObjUtil.coerce(port, sys.Int.type$));
    });
    let future = actor.send(null);
    TcpListenerTest.trace("s: accept...");
    let s = listener.accept();
    TcpListenerTest.trace("s: accepted!");
    this.verifyEq(sys.ObjUtil.coerce(s.isConnected(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    let req = s.in().readLine();
    TcpListenerTest.trace(sys.Str.plus("s: req = ", req));
    this.verifyEq(req, "hello");
    s.out().printLine("how you doing?").flush();
    let res = future.get(sys.Duration.fromStr("5sec"));
    TcpListenerTest.trace(sys.Str.plus("s: response = ", res));
    this.verifyEq(res, "how you doing?");
    s.close();
    listener.close();
    return;
  }

  static runClient(port) {
    TcpListenerTest.trace("c: connecting...");
    let s = TcpSocket.make().connect(IpAddr.local(), port);
    TcpListenerTest.trace("c: connected!");
    s.out().printLine("hello").flush();
    let res = s.in().readLine();
    TcpListenerTest.trace(sys.Str.plus("c: response ", res));
    s.close();
    return sys.ObjUtil.coerce(res, sys.Obj.type$);
  }

  static trace(s) {
    return;
  }

  testOptions() {
    const this$ = this;
    let s = TcpListener.make();
    let so = s.options();
    let receive = so.receiveBufferSize();
    so.receiveBufferSize(sys.Int.mult(receive, 2));
    this.verifyEq(sys.ObjUtil.coerce(so.receiveBufferSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.mult(receive, 2), sys.Obj.type$.toNullable()));
    let reuse = so.reuseAddr();
    so.reuseAddr(!reuse);
    this.verifyEq(sys.ObjUtil.coerce(so.reuseAddr(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(!reuse, sys.Obj.type$.toNullable()));
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      sys.ObjUtil.echo(sys.ObjUtil.coerce(so.broadcast(), sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      so.broadcast(false);
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      sys.ObjUtil.echo(sys.ObjUtil.coerce(so.inBufferSize(), sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      so.inBufferSize(sys.ObjUtil.coerce(88, sys.Int.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      sys.ObjUtil.echo(sys.ObjUtil.coerce(so.outBufferSize(), sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      so.outBufferSize(sys.ObjUtil.coerce(99, sys.Int.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      sys.ObjUtil.echo(sys.ObjUtil.coerce(so.keepAlive(), sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      so.keepAlive(false);
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      sys.ObjUtil.echo(sys.ObjUtil.coerce(so.sendBufferSize(), sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      so.sendBufferSize(100);
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      sys.ObjUtil.echo(so.linger());
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      so.linger(null);
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      sys.ObjUtil.echo(sys.ObjUtil.coerce(so.noDelay(), sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      so.noDelay(true);
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      sys.ObjUtil.echo(sys.ObjUtil.coerce(so.trafficClass(), sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      so.trafficClass(0);
      return;
    });
    s.close();
    return;
  }

  dump(s) {
    sys.ObjUtil.echo("---------");
    sys.ObjUtil.echo(sys.Str.plus("bound      = ", sys.ObjUtil.coerce(s.isBound(), sys.Obj.type$.toNullable())));
    sys.ObjUtil.echo(sys.Str.plus("closed     = ", sys.ObjUtil.coerce(s.isClosed(), sys.Obj.type$.toNullable())));
    sys.ObjUtil.echo(sys.Str.plus("localAddr  = ", s.localAddr()));
    sys.ObjUtil.echo(sys.Str.plus("localPort  = ", sys.ObjUtil.coerce(s.localPort(), sys.Obj.type$.toNullable())));
    sys.ObjUtil.echo(sys.Str.plus("receive    = ", sys.ObjUtil.coerce(s.options().receiveBufferSize(), sys.Obj.type$.toNullable())));
    sys.ObjUtil.echo(sys.Str.plus("reuseAddr  = ", sys.ObjUtil.coerce(s.options().reuseAddr(), sys.Obj.type$.toNullable())));
    sys.ObjUtil.echo(sys.Str.plus("timeout    = ", s.options().receiveTimeout()));
    return;
  }

  static make() {
    const $self = new TcpListenerTest();
    TcpListenerTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class IpInterfaceTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return IpInterfaceTest.type$; }

  testList() {
    const this$ = this;
    let list = IpInterface.list();
    this.verifyEq(sys.ObjUtil.typeof(list), sys.Type.find("inet::IpInterface[]"));
    this.verifyEq(sys.ObjUtil.coerce(list.isEmpty(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    list.each((x) => {
      this$.verifyEq(x, x);
      return;
    });
    return;
  }

  testFindByAddr() {
    const this$ = this;
    let good = IpAddr.local();
    let i = IpInterface.findByAddr(good);
    this.verifyEq(sys.ObjUtil.coerce(i.addrs().contains(good), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(i, i);
    let bad = IpAddr.make("0.1.2.3");
    this.verifyErr(sys.UnresolvedErr.type$, (it) => {
      IpInterface.findByAddr(sys.ObjUtil.coerce(bad, IpAddr.type$));
      return;
    });
    this.verifyErr(sys.UnresolvedErr.type$, (it) => {
      IpInterface.findByAddr(sys.ObjUtil.coerce(bad, IpAddr.type$), true);
      return;
    });
    this.verifyEq(IpInterface.findByAddr(sys.ObjUtil.coerce(bad, IpAddr.type$), false), null);
    return;
  }

  testFindByName() {
    const this$ = this;
    let good = IpInterface.list().first().name();
    let i = IpInterface.findByName(good);
    this.verifyEq(i.name(), good);
    this.verifyEq(i, i);
    let bad = "badname";
    this.verifyErr(sys.UnresolvedErr.type$, (it) => {
      IpInterface.findByName(bad);
      return;
    });
    this.verifyErr(sys.UnresolvedErr.type$, (it) => {
      IpInterface.findByName(bad, true);
      return;
    });
    this.verifyEq(IpInterface.findByName(bad, false), null);
    return;
  }

  static make() {
    const $self = new IpInterfaceTest();
    IpInterfaceTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class TcpSocketTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TcpSocketTest.type$; }

  testMake() {
    const this$ = this;
    let s = TcpSocket.make();
    this.verifyEq(sys.ObjUtil.coerce(s.isBound(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.isConnected(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(s.localAddr(), null);
    this.verifyEq(sys.ObjUtil.coerce(s.localPort(), sys.Obj.type$.toNullable()), null);
    this.verifyEq(s.remoteAddr(), null);
    this.verifyEq(sys.ObjUtil.coerce(s.remotePort(), sys.Obj.type$.toNullable()), null);
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.in();
      return;
    });
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.out();
      return;
    });
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.shutdownIn();
      return;
    });
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.shutdownOut();
      return;
    });
    s.close();
    return;
  }

  testBind() {
    this.verifyBind(null, null);
    this.verifyBind(IpAddr.local(), null);
    let port = sys.Range.make(1200, 9999).random();
    this.verifyBind(null, sys.ObjUtil.coerce(port, sys.Int.type$.toNullable()));
    this.verifyBind(IpAddr.local(), sys.ObjUtil.coerce(port, sys.Int.type$.toNullable()));
    return;
  }

  verifyBind(addr,port) {
    const this$ = this;
    let s = TcpSocket.make();
    this.verifySame(s.bind(addr, port), s);
    this.verifyEq(sys.ObjUtil.coerce(s.isBound(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.isConnected(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.in();
      return;
    });
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.out();
      return;
    });
    if (addr == null) {
      this.verify(s.localAddr() != null);
    }
    else {
      this.verifyEq(s.localAddr(), addr);
    }
    ;
    if (port == null) {
      this.verify(sys.ObjUtil.compareGT(s.localPort(), 0));
    }
    else {
      this.verifyEq(sys.ObjUtil.coerce(s.localPort(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(port, sys.Obj.type$.toNullable()));
    }
    ;
    this.verifyEq(s.remoteAddr(), null);
    this.verifyEq(sys.ObjUtil.coerce(s.remotePort(), sys.Obj.type$.toNullable()), null);
    s.close();
    this.verifyEq(sys.ObjUtil.coerce(s.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.in();
      return;
    });
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.out();
      return;
    });
    return;
  }

  testConnectFailures() {
    const this$ = this;
    let s = TcpSocket.make();
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.connect(IpAddr.local(), 1969);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(s.isConnected(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.in();
      return;
    });
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.out();
      return;
    });
    s.close();
    let t1 = sys.Duration.now();
    (s = TcpSocket.make());
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.connect(sys.ObjUtil.coerce(IpAddr.make("1.1.1.1"), IpAddr.type$), 1969, sys.Duration.fromStr("100ms"));
      return;
    });
    let t2 = sys.Duration.now();
    this.verifyEq(sys.ObjUtil.coerce(s.isConnected(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verify((sys.ObjUtil.compareLT(sys.Duration.fromStr("80ms"), t2.minus(t1)) && sys.ObjUtil.compareLT(t2.minus(t1), sys.Duration.fromStr("150ms"))));
    s.close();
    this.verifyEq(sys.ObjUtil.coerce(s.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.in();
      return;
    });
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.out();
      return;
    });
    return;
  }

  testConnectHttp() {
    this.doTestConnectHttp(null);
    this.doTestConnectHttp(sys.Duration.fromStr("30sec"));
    return;
  }

  doTestConnectHttp(timeout) {
    const this$ = this;
    let s = TcpSocket.make().connect(sys.ObjUtil.coerce(IpAddr.make("fantom.org"), IpAddr.type$), 80, timeout);
    this.verifyEq(sys.ObjUtil.coerce(s.isBound(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.isConnected(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verify(sys.ObjUtil.coerce(s.in(), sys.Obj.type$.toNullable()) != null);
    this.verify(sys.ObjUtil.coerce(s.out(), sys.Obj.type$.toNullable()) != null);
    this.verifyErr(sys.Err.type$, (it) => {
      s.options().inBufferSize(sys.ObjUtil.coerce(16, sys.Int.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      s.options().outBufferSize(sys.ObjUtil.coerce(16, sys.Int.type$.toNullable()));
      return;
    });
    s.out().print("GET / HTTP/1.0\r\n\r\n").flush();
    let res = s.in().readLine();
    this.verify(sys.Str.startsWith(res, "HTTP/"));
    s.close();
    this.verifyEq(sys.ObjUtil.coerce(s.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.in();
      return;
    });
    this.verifyErr(sys.IOErr.type$, (it) => {
      s.out();
      return;
    });
    return;
  }

  testOptions() {
    const this$ = this;
    let s = TcpSocket.make();
    let so = s.options();
    let in$ = so.inBufferSize();
    so.inBufferSize(sys.ObjUtil.coerce(sys.Int.mult(sys.ObjUtil.coerce(in$, sys.Int.type$), 2), sys.Int.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(so.inBufferSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.mult(sys.ObjUtil.coerce(in$, sys.Int.type$), 2), sys.Obj.type$.toNullable()));
    let out = so.outBufferSize();
    so.outBufferSize(sys.ObjUtil.coerce(sys.Int.plus(sys.Int.mult(sys.ObjUtil.coerce(in$, sys.Int.type$), 2), 1), sys.Int.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(so.outBufferSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(sys.Int.mult(sys.ObjUtil.coerce(in$, sys.Int.type$), 2), 1), sys.Obj.type$.toNullable()));
    let keepAlive = so.keepAlive();
    so.keepAlive(!keepAlive);
    this.verifyEq(sys.ObjUtil.coerce(so.keepAlive(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(!keepAlive, sys.Obj.type$.toNullable()));
    let receive = so.receiveBufferSize();
    so.receiveBufferSize(sys.Int.mult(receive, 2));
    this.verifyEq(sys.ObjUtil.coerce(so.receiveBufferSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.mult(receive, 2), sys.Obj.type$.toNullable()));
    let send = so.sendBufferSize();
    so.sendBufferSize(sys.Int.mult(send, 4));
    this.verifyEq(sys.ObjUtil.coerce(so.sendBufferSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.mult(send, 4), sys.Obj.type$.toNullable()));
    let reuse = so.reuseAddr();
    so.reuseAddr(!reuse);
    this.verifyEq(sys.ObjUtil.coerce(so.reuseAddr(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(!reuse, sys.Obj.type$.toNullable()));
    so.linger(sys.Duration.fromStr("2sec"));
    this.verifyEq(so.linger(), sys.Duration.fromStr("2sec"));
    so.linger(null);
    this.verifyEq(so.linger(), null);
    so.receiveTimeout(sys.Duration.fromStr("100ms"));
    this.verifyEq(so.receiveTimeout(), sys.Duration.fromStr("100ms"));
    so.receiveTimeout(null);
    this.verifyEq(so.receiveTimeout(), null);
    this.verifyEq(sys.ObjUtil.coerce(so.noDelay(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    so.noDelay(false);
    this.verifyEq(sys.ObjUtil.coerce(so.noDelay(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    let tc = so.trafficClass();
    so.trafficClass(6);
    this.verifyEq(sys.ObjUtil.coerce(so.trafficClass(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(6, sys.Obj.type$.toNullable()));
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      sys.ObjUtil.echo(sys.ObjUtil.coerce(so.broadcast(), sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      so.broadcast(false);
      return;
    });
    let xo = TcpSocket.make().options();
    xo.copyFrom(so);
    this.verifyEq(sys.ObjUtil.coerce(xo.inBufferSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(so.inBufferSize(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(xo.outBufferSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(so.outBufferSize(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(xo.keepAlive(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(so.keepAlive(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(xo.receiveBufferSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(so.receiveBufferSize(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(xo.sendBufferSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(so.sendBufferSize(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(xo.reuseAddr(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(so.reuseAddr(), sys.Obj.type$.toNullable()));
    this.verifyEq(xo.linger(), so.linger());
    this.verifyEq(xo.receiveTimeout(), so.receiveTimeout());
    this.verifyEq(sys.ObjUtil.coerce(xo.noDelay(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(so.noDelay(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(xo.trafficClass(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(so.trafficClass(), sys.Obj.type$.toNullable()));
    s.close();
    return;
  }

  static make() {
    const $self = new TcpSocketTest();
    TcpSocketTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class MulticastSocketTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MulticastSocketTest.type$; }

  testMake() {
    let s = MulticastSocket.make();
    this.verifyEq(sys.ObjUtil.coerce(s.isBound(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.isConnected(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(s.localAddr(), null);
    this.verifyEq(sys.ObjUtil.coerce(s.localPort(), sys.Obj.type$.toNullable()), null);
    this.verifyEq(s.remoteAddr(), null);
    this.verifyEq(sys.ObjUtil.coerce(s.remotePort(), sys.Obj.type$.toNullable()), null);
    this.verifyEq(sys.ObjUtil.coerce(s.timeToLive(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(sys.Str.isEmpty(s.interface().name()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    s.close();
    return;
  }

  static make() {
    const $self = new MulticastSocketTest();
    MulticastSocketTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class IpAddrTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return IpAddrTest.type$; }

  test() {
    const this$ = this;
    this.verifyAddr("192.168.1.105", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(192, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(168, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(105, sys.Obj.type$.toNullable())]));
    this.verifyAddr("255.0.128.0", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]));
    this.verifyAddr("1123:4567:89ab:cdef:fedc:ba98:7654:3210", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(17, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(35, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(69, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(103, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(137, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(171, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(205, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(239, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(254, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(220, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(186, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(152, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(118, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(84, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(50, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(16, sys.Obj.type$.toNullable())]), "1123:4567:89ab:cdef:fedc:ba98:7654:3210");
    this.verifyAddr("f123:4567::89ab:cdef", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(241, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(35, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(69, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(103, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(137, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(171, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(205, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(239, sys.Obj.type$.toNullable())]), "f123:4567:0:0:0:0:89ab:cdef", "f123:4567::89ab:cdef");
    this.verifyAddr("::f123:89ab:CDEF", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(241, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(35, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(137, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(171, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(205, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(239, sys.Obj.type$.toNullable())]), "0:0:0:0:0:f123:89ab:cdef", "::f123:89ab:cdef");
    this.verifyAddr("::FE77:169.2.30.200", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(254, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(119, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(169, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(30, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(200, sys.Obj.type$.toNullable())]), "0:0:0:0:0:fe77:a902:1ec8", "::fe77:a902:1ec8");
    this.verifyAddr("::169.2.30.200", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(169, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(30, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(200, sys.Obj.type$.toNullable())]), "0:0:0:0:0:0:a902:1ec8", "::169.2.30.200");
    this.verifyErr(UnknownHostErr.type$, (it) => {
      let x = IpAddr.make("0123:4567:89ab:cdef:fedc:ba98:7654:3210:ffff");
      return;
    });
    this.verifyErr(UnknownHostErr.type$, (it) => {
      let x = IpAddr.make("::fx54:3210:ffff");
      return;
    });
    this.verifySame(IpAddr.local(), IpAddr.local());
    let ms = IpAddr.makeAll("microsoft.com");
    this.verify(sys.ObjUtil.compareGT(ms.size(), 1));
    this.verifyEq(ms.get(0), IpAddr.make(ms.get(0).numeric()));
    this.verifyEq(sys.ObjUtil.coerce(ms.get(0).hash(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(IpAddr.make(ms.get(0).numeric()).hash(), sys.Obj.type$.toNullable()));
    this.verifyNotEq(ms.get(0), IpAddr.make(ms.get(1).numeric()));
    this.verifyNotEq(sys.ObjUtil.coerce(ms.get(0).hash(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(IpAddr.make(ms.get(1).numeric()).hash(), sys.Obj.type$.toNullable()));
    this.verifyEq(IpAddr.make("www.microsoft.com"), IpAddr.make("WWW.Microsoft.COM"));
    this.verifyEq(sys.ObjUtil.coerce(IpAddr.make("www.microsoft.com").hash(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(IpAddr.make("WWW.Microsoft.COM").hash(), sys.Obj.type$.toNullable()));
    return;
  }

  verifyAddr(str,bytes,numeric,numericAlt) {
    if (numeric === undefined) numeric = str;
    if (numericAlt === undefined) numericAlt = null;
    const this$ = this;
    let a = IpAddr.make(str);
    this.verifyEq(a.toStr(), str);
    this.verifyEq(sys.ObjUtil.coerce(a.isIPv4(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.equals(bytes.size(), 4), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.isIPv6(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.equals(bytes.size(), 16), sys.Obj.type$.toNullable()));
    try {
      this.verifyEq(a.numeric(), numeric);
    }
    catch ($_u5) {
      $_u5 = sys.Err.make($_u5);
      if ($_u5 instanceof sys.Err) {
        let err = $_u5;
        ;
        if (numericAlt != null) {
          this.verifyEq(a.numeric(), numericAlt);
        }
        else {
          throw err;
        }
        ;
      }
      else {
        throw $_u5;
      }
    }
    ;
    let buf = sys.Buf.make();
    bytes.each((b) => {
      buf.write(b);
      return;
    });
    this.verifyEq(a.bytes().toHex(), buf.toHex());
    sys.Int.times(2, (it) => {
      let abytes = a.bytes();
      bytes.each((b) => {
        this$.verifyEq(sys.ObjUtil.coerce(abytes.read(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b, sys.Obj.type$.toNullable()));
        return;
      });
      return;
    });
    let x = IpAddr.makeBytes(a.bytes());
    this.verifyEq(a, x);
    this.verifyEq(a.bytes().toHex(), x.bytes().toHex());
    this.verifyEq(sys.ObjUtil.coerce(a.isIPv4(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(x.isIPv4(), sys.Obj.type$.toNullable()));
    let all = IpAddr.makeAll(str);
    this.verifyEq(sys.ObjUtil.coerce(all.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(all.get(0).toStr(), str);
    this.verifyEq(all.get(0), a);
    return;
  }

  static make() {
    const $self = new IpAddrTest();
    IpAddrTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

const p = sys.Pod.add$('inet');
const xp = sys.Param.noParams$();
let m;
TcpListener.type$ = p.at$('TcpListener','sys::Obj',[],{},8192,TcpListener);
IpAddr.type$ = p.at$('IpAddr','sys::Obj',[],{},8226,IpAddr);
SocketOptions.type$ = p.at$('SocketOptions','sys::Obj',[],{},8224,SocketOptions);
UnknownHostErr.type$ = p.at$('UnknownHostErr','sys::IOErr',[],{},8194,UnknownHostErr);
UdpSocket.type$ = p.at$('UdpSocket','sys::Obj',[],{},8192,UdpSocket);
MulticastSocket.type$ = p.at$('MulticastSocket','inet::UdpSocket',[],{},8192,MulticastSocket);
SocketConfig.type$ = p.at$('SocketConfig','sys::Obj',[],{},8194,SocketConfig);
TcpSocket.type$ = p.at$('TcpSocket','sys::Obj',[],{},8192,TcpSocket);
IpInterface.type$ = p.at$('IpInterface','sys::Obj',[],{},8226,IpInterface);
UdpPacket.type$ = p.at$('UdpPacket','sys::Obj',[],{},8192,UdpPacket);
UdpSocketTest.type$ = p.at$('UdpSocketTest','sys::Test',[],{},8192,UdpSocketTest);
TcpListenerTest.type$ = p.at$('TcpListenerTest','sys::Test',[],{},8192,TcpListenerTest);
IpInterfaceTest.type$ = p.at$('IpInterfaceTest','sys::Test',[],{},8192,IpInterfaceTest);
TcpSocketTest.type$ = p.at$('TcpSocketTest','sys::Test',[],{},8192,TcpSocketTest);
MulticastSocketTest.type$ = p.at$('MulticastSocketTest','sys::Test',[],{},8192,MulticastSocketTest);
IpAddrTest.type$ = p.at$('IpAddrTest','sys::Test',[],{},8192,IpAddrTest);
TcpListener.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('config','inet::SocketConfig',true)]),{}).am$('init',2560,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('config','inet::SocketConfig',false)]),{}).am$('config',8704,'inet::SocketConfig',xp,{}).am$('isBound',8704,'sys::Bool',xp,{}).am$('isClosed',8704,'sys::Bool',xp,{}).am$('localAddr',8704,'inet::IpAddr?',xp,{}).am$('localPort',8704,'sys::Int?',xp,{}).am$('bind',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('addr','inet::IpAddr?',false),new sys.Param('port','sys::Int?',false),new sys.Param('backlog','sys::Int',true)]),{}).am$('accept',8192,'inet::TcpSocket',xp,{}).am$('doAccept',2560,'inet::TcpSocket',xp,{}).am$('close',8704,'sys::Bool',xp,{}).am$('options',8192,'inet::SocketOptions',xp,{'sys::Deprecated':"sys::Deprecated{msg=\"Use SocketConfig\";}"}).am$('getReceiveBufferSize',640,'sys::Int',xp,{}).am$('setReceiveBufferSize',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Int',false)]),{}).am$('getReuseAddr',640,'sys::Bool',xp,{}).am$('setReuseAddr',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Bool',false)]),{});
IpAddr.type$.am$('make',40966,'inet::IpAddr?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('makeNative',35330,'inet::IpAddr',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('makeAll',41474,'inet::IpAddr[]',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('makeBytes',41474,'inet::IpAddr',sys.List.make(sys.Param.type$,[new sys.Param('bytes','sys::Buf',false)]),{}).am$('local',41474,'inet::IpAddr',xp,{}).am$('internalMake',132,'sys::Void',xp,{}).am$('hash',271872,'sys::Int',xp,{}).am$('equals',271872,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('toStr',271872,'sys::Str',xp,{}).am$('isIPv4',8704,'sys::Bool',xp,{}).am$('isIPv6',8704,'sys::Bool',xp,{}).am$('isLoopback',8704,'sys::Bool',xp,{}).am$('isSiteLocal',8704,'sys::Bool',xp,{}).am$('bytes',8704,'sys::Buf',xp,{}).am$('numeric',8704,'sys::Str',xp,{}).am$('hostname',8704,'sys::Str',xp,{}).am$('toNative',8704,'sys::Obj',xp,{});
SocketOptions.type$.af$('inBufferSize',8192,'sys::Int?',{}).af$('outBufferSize',8192,'sys::Int?',{}).af$('broadcast',8192,'sys::Bool',{}).af$('keepAlive',8192,'sys::Bool',{}).af$('receiveBufferSize',8192,'sys::Int',{}).af$('sendBufferSize',8192,'sys::Int',{}).af$('reuseAddr',8192,'sys::Bool',{}).af$('linger',8192,'sys::Duration?',{}).af$('connectTimeout',73728,'sys::Duration?',{'sys::Deprecated':"sys::Deprecated{msg=\"Use SocketConfig.connectTimeout\";}"}).af$('receiveTimeout',8192,'sys::Duration?',{}).af$('noDelay',8192,'sys::Bool',{}).af$('trafficClass',8192,'sys::Int',{}).af$('socket',67584,'sys::Obj',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('socket','sys::Obj',false)]),{}).am$('copyFrom',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('options','inet::SocketOptions',false)]),{}).am$('wrap',128,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('m','|->sys::Obj?|',false)]),{});
UnknownHostErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
UdpSocket.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('config','inet::SocketConfig',true)]),{}).am$('init',2560,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('config','inet::SocketConfig',false)]),{}).am$('config',8704,'inet::SocketConfig',xp,{}).am$('isBound',8704,'sys::Bool',xp,{}).am$('isConnected',8704,'sys::Bool',xp,{}).am$('isClosed',8704,'sys::Bool',xp,{}).am$('localAddr',8704,'inet::IpAddr?',xp,{}).am$('localPort',8704,'sys::Int?',xp,{}).am$('remoteAddr',8704,'inet::IpAddr?',xp,{}).am$('remotePort',8704,'sys::Int?',xp,{}).am$('bind',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('addr','inet::IpAddr?',false),new sys.Param('port','sys::Int?',false)]),{}).am$('connect',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('addr','inet::IpAddr',false),new sys.Param('port','sys::Int',false)]),{}).am$('send',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('packet','inet::UdpPacket',false)]),{}).am$('receive',8704,'inet::UdpPacket',sys.List.make(sys.Param.type$,[new sys.Param('packet','inet::UdpPacket?',true)]),{}).am$('disconnect',8704,'sys::This',xp,{}).am$('close',8704,'sys::Bool',xp,{}).am$('options',8704,'inet::SocketOptions',xp,{'sys::Deprecated':"sys::Deprecated{msg=\"Use SocketConfig\";}"}).am$('getBroadcast',640,'sys::Bool',xp,{}).am$('setBroadcast',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Bool',false)]),{}).am$('getReceiveBufferSize',640,'sys::Int',xp,{}).am$('setReceiveBufferSize',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Int',false)]),{}).am$('getSendBufferSize',640,'sys::Int',xp,{}).am$('setSendBufferSize',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Int',false)]),{}).am$('getReuseAddr',640,'sys::Bool',xp,{}).am$('setReuseAddr',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Bool',false)]),{}).am$('getReceiveTimeout',640,'sys::Duration?',xp,{}).am$('setReceiveTimeout',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Duration?',false)]),{}).am$('getTrafficClass',640,'sys::Int',xp,{}).am$('setTrafficClass',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Int',false)]),{});
MulticastSocket.type$.af$('interface',8192,'inet::IpInterface',{}).af$('timeToLive',8704,'sys::Int',{}).af$('loopbackMode',8704,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('config','inet::SocketConfig',true)]),{}).am$('getInterface',2560,'inet::IpInterface',xp,{}).am$('setInterface',2560,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','inet::IpInterface',false)]),{}).am$('joinGroup',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('addr','inet::IpAddr',false),new sys.Param('port','sys::Int?',true),new sys.Param('interface','inet::IpInterface?',true)]),{}).am$('leaveGroup',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('addr','inet::IpAddr',false),new sys.Param('port','sys::Int?',true),new sys.Param('interface','inet::IpInterface?',true)]),{});
SocketConfig.type$.af$('curRef',100354,'concurrent::AtomicRef',{}).af$('errRef',100354,'concurrent::AtomicRef',{}).af$('keystore',73730,'crypto::KeyStore?',{}).af$('truststore',73730,'crypto::KeyStore?',{}).af$('tlsParams',73730,'[sys::Str:sys::Obj?]',{'sys::NoDoc':""}).af$('inBufferSize',73730,'sys::Int?',{}).af$('outBufferSize',73730,'sys::Int?',{}).af$('keepAlive',73730,'sys::Bool',{}).af$('receiveBufferSize',73730,'sys::Int',{}).af$('sendBufferSize',73730,'sys::Int',{}).af$('reuseAddr',73730,'sys::Bool',{}).af$('linger',73730,'sys::Duration?',{}).af$('connectTimeout',73730,'sys::Duration?',{}).af$('receiveTimeout',73730,'sys::Duration?',{}).af$('acceptTimeout',73730,'sys::Duration?',{}).af$('noDelay',73730,'sys::Bool',{}).af$('trafficClass',73730,'sys::Int',{}).af$('broadcast',73730,'sys::Bool',{}).am$('cur',40962,'inet::SocketConfig',xp,{}).am$('setCur',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cfg','inet::SocketConfig',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('makeCopy',4100,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('orig','inet::SocketConfig?',false),new sys.Param('f','|sys::This->sys::Void|',false)]),{'sys::NoDoc':""}).am$('copy',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('setTimeouts',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('connectTimeout','sys::Duration?',false),new sys.Param('receiveTimeout','sys::Duration?',true)]),{}).am$('force_peer',2560,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
TcpSocket.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('config','inet::SocketConfig',true)]),{}).am$('init',2560,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('config','inet::SocketConfig',false)]),{}).am$('config',8704,'inet::SocketConfig',xp,{}).am$('isBound',8704,'sys::Bool',xp,{}).am$('isConnected',8704,'sys::Bool',xp,{}).am$('isClosed',8704,'sys::Bool',xp,{}).am$('localAddr',8704,'inet::IpAddr?',xp,{}).am$('localPort',8704,'sys::Int?',xp,{}).am$('remoteAddr',8704,'inet::IpAddr?',xp,{}).am$('remotePort',8704,'sys::Int?',xp,{}).am$('bind',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('addr','inet::IpAddr?',false),new sys.Param('port','sys::Int?',false)]),{}).am$('connect',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('addr','inet::IpAddr',false),new sys.Param('port','sys::Int',false),new sys.Param('timeout','sys::Duration?',true)]),{}).am$('upgradeTls',8704,'inet::TcpSocket',sys.List.make(sys.Param.type$,[new sys.Param('addr','inet::IpAddr?',true),new sys.Param('port','sys::Int?',true)]),{}).am$('in',8704,'sys::InStream',xp,{}).am$('out',8704,'sys::OutStream',xp,{}).am$('close',8704,'sys::Bool',xp,{}).am$('shutdownIn',8704,'sys::Void',xp,{}).am$('shutdownOut',8704,'sys::Void',xp,{}).am$('clientAuth',8704,'sys::Str',xp,{'sys::NoDoc':""}).am$('localCerts',8704,'crypto::Cert[]',xp,{'sys::NoDoc':""}).am$('remoteCerts',8704,'crypto::Cert[]',xp,{'sys::NoDoc':""}).am$('options',8704,'inet::SocketOptions',xp,{'sys::Deprecated':"sys::Deprecated{msg=\"Use SocketConfig\";}"}).am$('getInBufferSize',640,'sys::Int?',xp,{}).am$('setInBufferSize',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Int?',false)]),{}).am$('getOutBufferSize',640,'sys::Int?',xp,{}).am$('setOutBufferSize',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Int?',false)]),{}).am$('getKeepAlive',640,'sys::Bool',xp,{}).am$('setKeepAlive',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Bool',false)]),{}).am$('getReceiveBufferSize',640,'sys::Int',xp,{}).am$('setReceiveBufferSize',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Int',false)]),{}).am$('getSendBufferSize',640,'sys::Int',xp,{}).am$('setSendBufferSize',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Int',false)]),{}).am$('getReuseAddr',640,'sys::Bool',xp,{}).am$('setReuseAddr',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Bool',false)]),{}).am$('getLinger',640,'sys::Duration?',xp,{}).am$('setLinger',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Duration?',false)]),{}).am$('getReceiveTimeout',640,'sys::Duration?',xp,{}).am$('setReceiveTimeout',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Duration?',false)]),{}).am$('getNoDelay',640,'sys::Bool',xp,{}).am$('setNoDelay',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Bool',false)]),{}).am$('getTrafficClass',640,'sys::Int',xp,{}).am$('setTrafficClass',640,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Int',false)]),{});
IpInterface.type$.am$('list',41474,'inet::IpInterface[]',xp,{}).am$('findByAddr',41474,'inet::IpInterface?',sys.List.make(sys.Param.type$,[new sys.Param('addr','inet::IpAddr',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('findByName',41474,'inet::IpInterface?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('make',132,'sys::Void',xp,{}).am$('hash',271872,'sys::Int',xp,{}).am$('toStr',271872,'sys::Str',xp,{}).am$('equals',271872,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('name',8704,'sys::Str',xp,{}).am$('dis',8704,'sys::Str',xp,{}).am$('addrs',8704,'inet::IpAddr[]',xp,{}).am$('broadcastAddrs',8704,'inet::IpAddr[]',xp,{}).am$('prefixSize',8704,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('addr','inet::IpAddr',false)]),{}).am$('isUp',8704,'sys::Bool',xp,{}).am$('hardwareAddr',8704,'sys::Buf?',xp,{}).am$('mtu',8704,'sys::Int',xp,{}).am$('supportsMulticast',8704,'sys::Bool',xp,{}).am$('isPointToPoint',8704,'sys::Bool',xp,{}).am$('isLoopback',8704,'sys::Bool',xp,{});
UdpPacket.type$.af$('addr',73728,'inet::IpAddr?',{}).af$('port',73728,'sys::Int?',{}).af$('data',73728,'sys::Buf?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('addr','inet::IpAddr?',true),new sys.Param('port','sys::Int?',true),new sys.Param('data','sys::Buf?',true)]),{});
UdpSocketTest.type$.am$('testMake',8192,'sys::Void',xp,{}).am$('testBind',8192,'sys::Void',xp,{}).am$('verifyBind',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('addr','inet::IpAddr?',false),new sys.Param('port','sys::Int?',false)]),{}).am$('testMessaging',8192,'sys::Void',xp,{}).am$('runServer',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('s','inet::UdpSocket',false)]),{}).am$('testOptions',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
TcpListenerTest.type$.am$('testMake',8192,'sys::Void',xp,{}).am$('testBind',8192,'sys::Void',xp,{}).am$('verifyBind',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('addr','inet::IpAddr?',false),new sys.Param('port','sys::Int?',false)]),{}).am$('testAccept',8192,'sys::Void',xp,{}).am$('runClient',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('port','sys::Int',false)]),{}).am$('trace',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('testOptions',8192,'sys::Void',xp,{}).am$('dump',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','inet::TcpListener',false)]),{}).am$('make',139268,'sys::Void',xp,{});
IpInterfaceTest.type$.am$('testList',8192,'sys::Void',xp,{}).am$('testFindByAddr',8192,'sys::Void',xp,{}).am$('testFindByName',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
TcpSocketTest.type$.am$('testMake',8192,'sys::Void',xp,{}).am$('testBind',8192,'sys::Void',xp,{}).am$('verifyBind',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('addr','inet::IpAddr?',false),new sys.Param('port','sys::Int?',false)]),{}).am$('testConnectFailures',8192,'sys::Void',xp,{}).am$('testConnectHttp',8192,'sys::Void',xp,{}).am$('doTestConnectHttp',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',false)]),{}).am$('testOptions',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
MulticastSocketTest.type$.am$('testMake',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
IpAddrTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('verifyAddr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('bytes','sys::Int[]',false),new sys.Param('numeric','sys::Str',true),new sys.Param('numericAlt','sys::Str?',true)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "inet");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;concurrent 1.0;crypto 1.0");
m.set("pod.summary", "IP networking");
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
m.set("pod.native.dotnet", "true");
m.set("proj.name", "Fantom Core");
m.set("proj.uri", "https://fantom.org/");
m.set("pod.docApi", "true");
m.set("org.uri", "https://fantom.org/");
m.set("pod.native.java", "true");
m.set("vcs.uri", "https://github.com/fantom-lang/fantom");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  TcpListener,
  IpAddr,
  SocketOptions,
  UnknownHostErr,
  UdpSocket,
  MulticastSocket,
  SocketConfig,
  TcpSocket,
  IpInterface,
  UdpPacket,
  UdpSocketTest,
  TcpListenerTest,
  IpInterfaceTest,
  TcpSocketTest,
  MulticastSocketTest,
  IpAddrTest,
};
