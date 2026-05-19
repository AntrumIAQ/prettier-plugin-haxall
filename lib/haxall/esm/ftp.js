// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class FtpClient extends sys.Obj {
  constructor() {
    super();
    this.peer = new FtpClientPeer(this);
    const this$ = this;
    this.#log = sys.Log.get("ftp");
    return;
  }

  typeof() { return FtpClient.type$; }

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

  #username = null;

  // private field reflection only
  __username(it) { if (it === undefined) return this.#username; else this.#username = it; }

  #password = null;

  // private field reflection only
  __password(it) { if (it === undefined) return this.#password; else this.#password = it; }

  #socketConfig = null;

  // private field reflection only
  __socketConfig(it) { if (it === undefined) return this.#socketConfig; else this.#socketConfig = it; }

  #cmdSocket = null;

  // private field reflection only
  __cmdSocket(it) { if (it === undefined) return this.#cmdSocket; else this.#cmdSocket = it; }

  #pasvSocket = null;

  // private field reflection only
  __pasvSocket(it) { if (it === undefined) return this.#pasvSocket; else this.#pasvSocket = it; }

  static make(username,password) {
    const $self = new FtpClient();
    FtpClient.make$($self,username,password);
    return $self;
  }

  static make$($self,username,password) {
    if (username === undefined) username = "anonymous";
    if (password === undefined) password = "";
    const this$ = $self;
    ;
    $self.#username = username;
    $self.#password = password;
    $self.#socketConfig = inet.SocketConfig.cur().copy((it) => {
      it.__tlsParams(sys.ObjUtil.coerce(((this$) => { let $_u0 = sys.Map.__fromLiteral(["sslProtocol"], ["TLSv1.2"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u0 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["sslProtocol"], ["TLSv1.2"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj?]")));
      return;
    });
    return;
  }

  read(uri) {
    const this$ = this;
    let path = this.toFilePath(uri);
    this.open(uri, sys.Str.plus("RETR ", path));
    return FtpInStream.make(this.#pasvSocket.in(), () => {
      this$.close();
      return;
    });
  }

  write(uri) {
    const this$ = this;
    let path = this.toFilePath(uri);
    this.open(uri, sys.Str.plus("STOR ", path));
    return FtpOutStream.make(this.#pasvSocket.out(), () => {
      try {
        let res = this$.readRes();
        if (sys.ObjUtil.compareNE(res.code(), 226)) {
          throw FtpErr.make(res.code(), sys.Str.plus("Write failed: ", res));
        }
        ;
      }
      finally {
        this$.close();
      }
      ;
      return;
    });
  }

  list(uri) {
    const this$ = this;
    try {
      let path = this.toDirPath(uri);
      this.open(uri, sys.Str.plus("NLST ", path));
      let acc = sys.List.make(sys.Uri.type$);
      this.#pasvSocket.in().readAllLines().each((n) => {
        let slash = sys.Str.indexr(n, "/", -2);
        if (slash != null) {
          (n = sys.Str.getRange(n, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(slash, sys.Int.type$), 1), -1)));
        }
        ;
        acc.add(uri.plusName(n));
        return;
      });
      return acc;
    }
    finally {
      this.close();
    }
    ;
  }

  mkdir(uri,checked) {
    if (checked === undefined) checked = false;
    const this$ = this;
    let path = this.toDirPath(uri);
    let created = sys.Str.toUri(path);
    let todo = sys.List.make(sys.Uri.type$);
    sys.Int.times(uri.path().size(), (i) => {
      todo.add(uri.getRange(sys.Range.make(0, i)));
      return;
    });
    todo.each((pathUri,i) => {
      try {
        let ignore = sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(550, sys.Obj.type$.toNullable())]);
        if ((sys.ObjUtil.equals(sys.Int.plus(i, 1), todo.size()) && checked)) {
          ignore.clear();
        }
        ;
        (path = this$.toDirPath(pathUri));
        let res = this$.open(pathUri, sys.Str.plus("MKD ", path), ignore);
        let m = sys.Regex.fromStr("\"(.*).*\"").matcher(res.text());
        (created = ((this$) => { if (m.matches()) return sys.Str.toUri(m.group(1)); return sys.Str.toUri(path); })(this$));
      }
      catch ($_u2) {
        $_u2 = sys.Err.make($_u2);
        if ($_u2 instanceof FtpErr) {
          let err = $_u2;
          ;
          if (checked) {
            throw err;
          }
          ;
          return uri;
        }
        else {
          throw $_u2;
        }
      }
      finally {
        this$.close();
      }
      ;
      return;
    });
    return created;
  }

  delete(uri) {
    try {
      let path = this.toFilePath(uri);
      let res = this.open(uri, sys.Str.plus("DELE ", path));
      return sys.Str.toUri(path);
    }
    finally {
      this.close();
    }
    ;
  }

  rmdir(uri) {
    try {
      let path = this.toDirPath(uri);
      let res = this.open(uri, sys.Str.plus("RMD ", path), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(550, sys.Obj.type$.toNullable())]));
      return sys.Str.toUri(path);
    }
    finally {
      this.close();
    }
    ;
  }

  open(uri,cmd,allowableErrs) {
    if (allowableErrs === undefined) allowableErrs = sys.ObjUtil.coerce(sys.Int.type$.emptyList(), sys.Type.find("sys::Int[]"));
    if ((sys.ObjUtil.compareNE(uri.scheme(), "ftp") && sys.ObjUtil.compareNE(uri.scheme(), "ftps"))) {
      throw sys.ArgErr.make(sys.Str.plus("Uri not ftp: ", uri));
    }
    ;
    let useTls = sys.ObjUtil.equals(uri.scheme(), "ftps");
    this.#cmdSocket = this.connect(sys.ObjUtil.coerce(inet.IpAddr.make(sys.ObjUtil.coerce(uri.host(), sys.Str.type$)), inet.IpAddr.type$), sys.ObjUtil.coerce(((this$) => { let $_u3 = uri.port(); if ($_u3 != null) return $_u3; return sys.ObjUtil.coerce(21, sys.Int.type$.toNullable()); })(this), sys.Int.type$));
    let res = this.readRes();
    if ((sys.ObjUtil.compareNE(res.code(), 220) && sys.ObjUtil.compareNE(res.code(), 530))) {
      throw FtpErr.make(res.code(), sys.Str.plus("Cannot connect: ", res));
    }
    ;
    if (useTls) {
      this.writeReq("AUTH TLS");
      (res = this.readRes());
      if (sys.ObjUtil.compareNE(res.code(), 234)) {
        throw FtpErr.make(res.code(), sys.Str.plus("Cannot set auth mechanism to TLS: ", res));
      }
      ;
      this.#cmdSocket = this.#cmdSocket.upgradeTls();
      this.writeReq("PBSZ 0");
      (res = this.readRes());
      if (sys.ObjUtil.compareNE(res.code(), 200)) {
        throw FtpErr.make(res.code(), sys.Str.plus("Cannot set protection buffer size: ", res));
      }
      ;
      this.writeReq("PROT P");
      (res = this.readRes());
      if (sys.ObjUtil.compareNE(res.code(), 200)) {
        throw FtpErr.make(res.code(), sys.Str.plus("Cannot set data channel protection level: ", res));
      }
      ;
    }
    ;
    this.writeReq(sys.Str.plus("USER ", this.#username));
    (res = this.readRes());
    if (sys.ObjUtil.compareNE(res.code(), 331)) {
      throw FtpErr.make(res.code(), sys.Str.plus("Cannot login: ", res));
    }
    ;
    this.writeReq(sys.Str.plus("PASS ", this.#password));
    (res = this.readRes());
    if (sys.ObjUtil.compareNE(res.code(), 230)) {
      throw FtpErr.make(res.code(), sys.Str.plus("Cannot login: ", res));
    }
    ;
    this.writeReq("TYPE I");
    (res = this.readRes());
    if (sys.ObjUtil.compareNE(res.code(), 200)) {
      throw FtpErr.make(res.code(), sys.Str.plus("Cannot set to binary mode: ", res));
    }
    ;
    this.writeReq("PASV");
    (res = this.readRes());
    this.#pasvSocket = this.openPassive(res);
    this.writeReq(cmd);
    (res = this.readRes());
    let $_u4 = res.code();
    if (sys.ObjUtil.equals($_u4, 125)) {
      let _ = res.code();
    }
    else if (sys.ObjUtil.equals($_u4, 150)) {
      let _ = res.code();
    }
    else if (sys.ObjUtil.equals($_u4, 250)) {
      return res;
    }
    else if (sys.ObjUtil.equals($_u4, 257)) {
      let _ = res.code();
    }
    else {
      throw FtpErr.make(res.code(), sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot run ", cmd), ": "), res));
    }
    ;
    if (useTls) {
      this.#pasvSocket = this.openSecureDataChannel(sys.ObjUtil.coerce(this.#cmdSocket, inet.TcpSocket.type$), sys.ObjUtil.coerce(this.#pasvSocket, inet.TcpSocket.type$));
    }
    ;
    return res;
  }

  openSecureDataChannel(cmd,data) {
    return this.peer.openSecureDataChannel(this,cmd,data);
  }

  close() {
    try {
      ((this$) => { let $_u5 = this$.#cmdSocket; if ($_u5 == null) return null; return this$.#cmdSocket.close(); })(this);
    }
    catch ($_u6) {
    }
    ;
    try {
      ((this$) => { let $_u7 = this$.#pasvSocket; if ($_u7 == null) return null; return this$.#pasvSocket.close(); })(this);
    }
    catch ($_u8) {
    }
    ;
    return;
  }

  openPassive(res) {
    if (sys.ObjUtil.compareNE(res.code(), 227)) {
      throw FtpErr.make(res.code(), sys.Str.plus("Cannot enter passive mode: ", res));
    }
    ;
    let text = res.text();
    let host = null;
    let port = null;
    try {
      let toks = sys.Str.split(sys.Str.getRange(text, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sys.Str.index(text, "("), sys.Int.type$), 1), sys.ObjUtil.coerce(sys.Str.index(text, ")"), sys.Int.type$), true)), sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
      (host = inet.IpAddr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", toks.get(0)), "."), toks.get(1)), "."), toks.get(2)), "."), toks.get(3))));
      (port = sys.ObjUtil.coerce(sys.Int.plus(sys.Int.mult(sys.ObjUtil.coerce(sys.Str.toInt(toks.get(4)), sys.Int.type$), 256), sys.ObjUtil.coerce(sys.Str.toInt(toks.get(5)), sys.Int.type$)), sys.Int.type$.toNullable()));
      return this.connect(sys.ObjUtil.coerce(host, inet.IpAddr.type$), sys.ObjUtil.coerce(port, sys.Int.type$));
    }
    catch ($_u9) {
      $_u9 = sys.Err.make($_u9);
      if ($_u9 instanceof sys.Err) {
        let e = $_u9;
        ;
        throw FtpErr.make(227, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot parse PASV res [host=", host), " port="), sys.ObjUtil.coerce(port, sys.Obj.type$.toNullable())), "]: "), sys.Str.toCode(text)), e);
      }
      else {
        throw $_u9;
      }
    }
    ;
  }

  connect(host,port) {
    let socket = inet.TcpSocket.make(this.#socketConfig);
    return socket.connect(host, port);
  }

  readRes() {
    let line = this.#cmdSocket.in().readLine();
    if (this.#log.isDebug()) {
      this.#log.debug(sys.Str.plus("s: ", line));
    }
    ;
    try {
      let code = sys.Str.toInt(sys.Str.getRange(line, sys.Range.make(0, 2)));
      let text = sys.Str.trim(sys.Str.getRange(line, sys.Range.make(4, -1)));
      if (sys.ObjUtil.equals(sys.Str.get(line, 3), 45)) {
        let prefix = sys.Str.plus(sys.Str.getRange(line, sys.Range.make(0, 2)), " ");
        while (true) {
          (line = this.#cmdSocket.in().readLine());
          if (this.#log.isDebug()) {
            this.#log.debug(sys.Str.plus("s: ", line));
          }
          ;
          if (line == null) {
            throw sys.Err.make(sys.Str.plus("Unexpected end of stream, expecting ", sys.Str.toCode(prefix)));
          }
          ;
          text = sys.Str.plus(text, sys.Str.plus("\n", line));
          if (sys.Str.startsWith(line, prefix)) {
            break;
          }
          ;
        }
        ;
        text = sys.Str.plus(text, sys.Str.plus("\n", sys.Str.trim(sys.Str.getRange(line, sys.Range.make(4, -1)))));
      }
      ;
      return FtpRes.make(sys.ObjUtil.coerce(code, sys.Int.type$), text);
    }
    catch ($_u10) {
      $_u10 = sys.Err.make($_u10);
      if ($_u10 instanceof sys.Err) {
        let e = $_u10;
        ;
        throw sys.IOErr.make(sys.Str.plus(sys.Str.plus("Invalid FTP reply '", line), "'"));
      }
      else {
        throw $_u10;
      }
    }
    ;
  }

  writeReq(line) {
    if (this.#log.isDebug()) {
      this.#log.debug(sys.Str.plus("c: ", line));
    }
    ;
    this.#cmdSocket.out().print(line).print("\r\n").flush();
    return;
  }

  toFilePath(uri) {
    if (uri.isDir()) {
      throw sys.ArgErr.make(sys.Str.plus("Uri is dir: ", uri));
    }
    ;
    let pathStr = uri.pathStr();
    if (sys.Str.isEmpty(pathStr)) {
      throw sys.ArgErr.make(sys.Str.plus("Uri has no path: ", uri));
    }
    ;
    return pathStr;
  }

  toDirPath(uri) {
    if (!uri.isDir()) {
      throw sys.ArgErr.make(sys.Str.plus("Uri is not dir: ", uri));
    }
    ;
    let pathStr = uri.pathStr();
    if (sys.Str.isEmpty(pathStr)) {
      throw sys.ArgErr.make(sys.Str.plus("Uri has no path: ", uri));
    }
    ;
    return pathStr;
  }

}

class FtpRes extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FtpRes.type$; }

  #code = 0;

  code() { return this.#code; }

  __code(it) { if (it === undefined) return this.#code; else this.#code = it; }

  #text = null;

  text() { return this.#text; }

  __text(it) { if (it === undefined) return this.#text; else this.#text = it; }

  static make(c,t) {
    const $self = new FtpRes();
    FtpRes.make$($self,c,t);
    return $self;
  }

  static make$($self,c,t) {
    $self.#code = c;
    $self.#text = t;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this.#code, sys.Obj.type$.toNullable())), " "), this.#text);
  }

}

class FtpInStream extends sys.InStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FtpInStream.type$; }

  #closed = false;

  // private field reflection only
  __closed(it) { if (it === undefined) return this.#closed; else this.#closed = it; }

  #onClose = null;

  // private field reflection only
  __onClose(it) { if (it === undefined) return this.#onClose; else this.#onClose = it; }

  static make(in$,onClose) {
    const $self = new FtpInStream();
    FtpInStream.make$($self,in$,onClose);
    return $self;
  }

  static make$($self,in$,onClose) {
    sys.InStream.make$($self, in$);
    $self.#onClose = onClose;
    return;
  }

  close() {
    if (this.#closed) {
      return true;
    }
    ;
    this.#closed = true;
    let r = sys.InStream.prototype.close.call(this);
    sys.Func.call(this.#onClose);
    return r;
  }

}

class FtpOutStream extends sys.OutStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FtpOutStream.type$; }

  #closed = false;

  // private field reflection only
  __closed(it) { if (it === undefined) return this.#closed; else this.#closed = it; }

  #onClose = null;

  // private field reflection only
  __onClose(it) { if (it === undefined) return this.#onClose; else this.#onClose = it; }

  static make(out,onClose) {
    const $self = new FtpOutStream();
    FtpOutStream.make$($self,out,onClose);
    return $self;
  }

  static make$($self,out,onClose) {
    sys.OutStream.make$($self, out);
    $self.#onClose = onClose;
    return;
  }

  close() {
    if (this.#closed) {
      return true;
    }
    ;
    this.#closed = true;
    let r = sys.OutStream.prototype.close.call(this);
    sys.Func.call(this.#onClose);
    return r;
  }

}

class FtpErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FtpErr.type$; }

  #code = 0;

  code() { return this.#code; }

  __code(it) { if (it === undefined) return this.#code; else this.#code = it; }

  static make(code,msg,cause) {
    const $self = new FtpErr();
    FtpErr.make$($self,code,msg,cause);
    return $self;
  }

  static make$($self,code,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.ObjUtil.coerce(msg, sys.Str.type$), cause);
    $self.#code = code;
    return;
  }

}

class Main extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Main.type$; }

  static main(args) {
    if (sys.ObjUtil.compareLT(args.size(), 4)) {
      sys.ObjUtil.echo("usage:");
      sys.ObjUtil.echo("  ftp <user> <pass> <uri> <cmd>");
      sys.ObjUtil.echo("commands:");
      sys.ObjUtil.echo("  list");
      sys.ObjUtil.echo("  read");
      sys.ObjUtil.echo("  write");
      return;
    }
    ;
    let user = args.get(0);
    let pass = args.get(1);
    let uri = sys.Str.toUri(args.get(2));
    let cmd = args.get(3);
    let c = FtpClient.make(user, pass);
    c.log().level(sys.LogLevel.debug());
    let $_u11 = cmd;
    if (sys.ObjUtil.equals($_u11, "list")) {
      sys.ObjUtil.echo(c.list(uri).join("\n"));
    }
    else if (sys.ObjUtil.equals($_u11, "read")) {
      sys.ObjUtil.echo(c.read(uri).readAllStr());
    }
    else if (sys.ObjUtil.equals($_u11, "write")) {
      c.write(uri).print(sys.Str.plus("test write ", sys.DateTime.now())).close();
    }
    else {
      sys.ObjUtil.echo(sys.Str.plus("Invalid cmd: ", cmd));
    }
    ;
    return;
  }

  static make() {
    const $self = new Main();
    Main.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

const p = sys.Pod.add$('ftp');
const xp = sys.Param.noParams$();
let m;
FtpClient.type$ = p.at$('FtpClient','sys::Obj',[],{},8192,FtpClient);
FtpRes.type$ = p.at$('FtpRes','sys::Obj',[],{},128,FtpRes);
FtpInStream.type$ = p.at$('FtpInStream','sys::InStream',[],{},128,FtpInStream);
FtpOutStream.type$ = p.at$('FtpOutStream','sys::OutStream',[],{},128,FtpOutStream);
FtpErr.type$ = p.at$('FtpErr','sys::Err',[],{},8194,FtpErr);
Main.type$ = p.at$('Main','sys::Obj',[],{},8192,Main);
FtpClient.type$.af$('log',73728,'sys::Log',{}).af$('username',67586,'sys::Str',{}).af$('password',67586,'sys::Str',{}).af$('socketConfig',67586,'inet::SocketConfig',{}).af$('cmdSocket',67584,'inet::TcpSocket?',{}).af$('pasvSocket',67584,'inet::TcpSocket?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',true),new sys.Param('password','sys::Str',true)]),{}).am$('read',8192,'sys::InStream',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('write',8192,'sys::OutStream',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('list',8192,'sys::Uri[]',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('mkdir',8192,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('delete',8192,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('rmdir',8192,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('open',2048,'ftp::FtpRes',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('cmd','sys::Str',false),new sys.Param('allowableErrs','sys::Int[]',true)]),{}).am$('openSecureDataChannel',2560,'inet::TcpSocket',sys.List.make(sys.Param.type$,[new sys.Param('cmd','inet::TcpSocket',false),new sys.Param('data','inet::TcpSocket',false)]),{}).am$('close',2048,'sys::Void',xp,{}).am$('openPassive',2048,'inet::TcpSocket',sys.List.make(sys.Param.type$,[new sys.Param('res','ftp::FtpRes',false)]),{}).am$('connect',2048,'inet::TcpSocket',sys.List.make(sys.Param.type$,[new sys.Param('host','inet::IpAddr',false),new sys.Param('port','sys::Int',false)]),{}).am$('readRes',2048,'ftp::FtpRes',xp,{}).am$('writeReq',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false)]),{}).am$('toFilePath',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('toDirPath',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{});
FtpRes.type$.af$('code',73730,'sys::Int',{}).af$('text',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false),new sys.Param('t','sys::Str',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
FtpInStream.type$.af$('closed',67584,'sys::Bool',{}).af$('onClose',67584,'|->sys::Void|',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('onClose','|->sys::Void|',false)]),{}).am$('close',271360,'sys::Bool',xp,{});
FtpOutStream.type$.af$('closed',67584,'sys::Bool',{}).af$('onClose',67584,'|->sys::Void|',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('onClose','|->sys::Void|',false)]),{}).am$('close',271360,'sys::Bool',xp,{});
FtpErr.type$.af$('code',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Int',false),new sys.Param('msg','sys::Str?',false),new sys.Param('cause','sys::Err?',true)]),{});
Main.type$.am$('main',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "ftp");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;inet 1.0");
m.set("pod.summary", "FTP client");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:24-05:00 New_York");
m.set("build.tsKey", "241210143124");
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
  FtpClient,
  FtpErr,
  Main,
};
