// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class SmtpClient extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#port = 25;
    this.#socketConfig = inet.SocketConfig.cur();
    this.#log = sys.Log.get("smtp");
    return;
  }

  typeof() { return SmtpClient.type$; }

  #host = null;

  host(it) {
    if (it === undefined) {
      return this.#host;
    }
    else {
      this.#host = it;
      return;
    }
  }

  #port = 0;

  port(it) {
    if (it === undefined) {
      return this.#port;
    }
    else {
      this.#port = it;
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

  #ssl = false;

  ssl(it) {
    if (it === undefined) {
      return this.#ssl;
    }
    else {
      this.#ssl = it;
      return;
    }
  }

  #socketConfig = null;

  socketConfig(it) {
    if (it === undefined) {
      return this.#socketConfig;
    }
    else {
      this.#socketConfig = it;
      return;
    }
  }

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

  #sock = null;

  // private field reflection only
  __sock(it) { if (it === undefined) return this.#sock; else this.#sock = it; }

  #auths = null;

  // private field reflection only
  __auths(it) { if (it === undefined) return this.#auths; else this.#auths = it; }

  #starttls = false;

  // private field reflection only
  __starttls(it) { if (it === undefined) return this.#starttls; else this.#starttls = it; }

  isClosed() {
    return this.#sock == null;
  }

  open() {
    if (this.#host == null) {
      throw sys.NullErr.make("host is null");
    }
    ;
    this.#sock = inet.TcpSocket.make(this.#socketConfig);
    if (this.#ssl) {
      this.#sock = this.#sock.upgradeTls();
    }
    ;
    this.#sock.connect(sys.ObjUtil.coerce(inet.IpAddr.make(sys.ObjUtil.coerce(this.#host, sys.Str.type$)), inet.IpAddr.type$), this.#port);
    try {
      let res = this.readRes();
      if (sys.ObjUtil.compareNE(res.code(), 220)) {
        throw SmtpErr.makeRes(res);
      }
      ;
      this.writeReq(sys.Str.plus(sys.Str.plus("EHLO [", inet.IpAddr.local().numeric()), "]"));
      (res = this.readRes());
      if (sys.ObjUtil.compareNE(res.code(), 250)) {
        throw SmtpErr.makeRes(res);
      }
      ;
      this.readExts(res);
      if ((this.#starttls && (this.#auths == null || this.#auths.isEmpty()))) {
        this.writeReq("STARTTLS");
        (res = this.readRes());
        if (sys.ObjUtil.compareNE(res.code(), 220)) {
          throw SmtpErr.makeRes(res);
        }
        ;
        this.#sock = this.#sock.upgradeTls();
        this.writeReq(sys.Str.plus(sys.Str.plus("EHLO [", inet.IpAddr.local().numeric()), "]"));
        (res = this.readRes());
        if (sys.ObjUtil.compareNE(res.code(), 250)) {
          throw SmtpErr.makeRes(res);
        }
        ;
        this.readExts(res);
      }
      ;
      if ((this.#username != null && this.#password != null && this.#auths != null && !this.#auths.isEmpty())) {
        this.authenticate();
      }
      ;
    }
    catch ($_u0) {
      $_u0 = sys.Err.make($_u0);
      if ($_u0 instanceof sys.Err) {
        let e = $_u0;
        ;
        this.close();
        throw e;
      }
      else {
        throw $_u0;
      }
    }
    ;
    return;
  }

  close() {
    if (this.#sock != null) {
      try {
        this.writeReq("QUIT");
      }
      catch ($_u1) {
      }
      ;
      try {
        this.#sock.close();
      }
      catch ($_u2) {
      }
      ;
      this.#sock = null;
    }
    ;
    return;
  }

  send(email) {
    const this$ = this;
    email.validate();
    let autoOpen = this.isClosed();
    if (autoOpen) {
      this.open();
    }
    ;
    try {
      this.writeReq(sys.Str.plus("MAIL From:", MimeUtil.toAddrSpec(sys.ObjUtil.coerce(email.from(), sys.Str.type$))));
      let res = this.readRes();
      if (sys.ObjUtil.compareNE(res.code(), 250)) {
        throw SmtpErr.makeRes(res);
      }
      ;
      email.recipients().each((to) => {
        this$.writeReq(sys.Str.plus("RCPT To:", MimeUtil.toAddrSpec(to)));
        (res = this$.readRes());
        if (sys.ObjUtil.compareNE(res.code(), 250)) {
          throw SmtpErr.makeRes(res);
        }
        ;
        return;
      });
      this.writeReq("DATA");
      (res = this.readRes());
      if (sys.ObjUtil.compareNE(res.code(), 354)) {
        throw SmtpErr.makeRes(res);
      }
      ;
      email.encode(this.#sock.out());
      this.#sock.out().flush();
      (res = this.readRes());
      if (sys.ObjUtil.compareNE(res.code(), 250)) {
        throw SmtpErr.makeRes(res);
      }
      ;
    }
    finally {
      if (autoOpen) {
        this.close();
      }
      ;
    }
    ;
    return;
  }

  writeReq(req) {
    this.#sock.out().print(req).print("\r\n").flush();
    if (this.#log.isDebug()) {
      this.#log.debug(sys.Str.plus("c: ", req));
    }
    ;
    return;
  }

  readRes() {
    const this$ = this;
    let res = SmtpRes.make();
    while (true) {
      let line = this.#sock.in().readLine();
      try {
        res.code(sys.ObjUtil.coerce(sys.Str.toInt(sys.Str.getRange(line, sys.Range.make(0, 2))), sys.Int.type$));
        if (sys.ObjUtil.compareLE(sys.Str.size(line), 4)) {
          res.lines().add("");
          break;
        }
        ;
        res.lines().add(sys.Str.getRange(line, sys.Range.make(4, -1)));
        if (sys.ObjUtil.compareNE(sys.Str.get(line, 3), 45)) {
          break;
        }
        ;
      }
      catch ($_u3) {
        $_u3 = sys.Err.make($_u3);
        if ($_u3 instanceof sys.Err) {
          let e = $_u3;
          ;
          throw sys.IOErr.make(sys.Str.plus(sys.Str.plus("Invalid SMTP reply '", line), "'"));
        }
        else {
          throw $_u3;
        }
      }
      ;
    }
    ;
    if (this.#log.isDebug()) {
      res.lines().each((line,i) => {
        let sep = ((this$) => { if (sys.ObjUtil.compareLT(i, sys.Int.minus(res.lines().size(), 1))) return "-"; return " "; })(this$);
        this$.#log.debug(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("s: ", sys.ObjUtil.coerce(res.code(), sys.Obj.type$.toNullable())), ""), sep), ""), line));
        return;
      });
    }
    ;
    return res;
  }

  readExts(res) {
    const this$ = this;
    res.lines().each((line) => {
      let toks = sys.Str.split(sys.Str.upper(line));
      let $_u5 = toks.get(0);
      if (sys.ObjUtil.equals($_u5, "AUTH")) {
        this$.#auths = toks.getRange(sys.Range.make(1, -1));
      }
      else if (sys.ObjUtil.equals($_u5, "STARTTLS")) {
        this$.#starttls = true;
      }
      ;
      return;
    });
    return;
  }

  authenticate() {
    if (this.#auths.contains("CRAM-MD5")) {
      this.authCramMd5();
      return;
    }
    ;
    if (this.#auths.contains("LOGIN")) {
      this.authLogin();
      return;
    }
    ;
    if (this.#auths.contains("PLAIN")) {
      this.authPlain();
      return;
    }
    ;
    throw sys.Err.make(sys.Str.plus("No AUTH mechanism available: ", this.#auths));
  }

  authCramMd5() {
    this.writeReq("AUTH CRAM-MD5");
    let res = this.readRes();
    if (sys.ObjUtil.compareNE(res.code(), 334)) {
      throw SmtpErr.makeRes(res);
    }
    ;
    let nonce = sys.Buf.fromBase64(sys.Str.trim(res.line()));
    let hmac = nonce.hmac("MD5", sys.Str.toBuf(this.#password));
    let cred = sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#username), " "), sys.Str.lower(hmac.toHex()));
    this.writeReq(sys.Str.toBuf(cred).toBase64());
    (res = this.readRes());
    if (sys.ObjUtil.compareNE(res.code(), 235)) {
      throw SmtpErr.makeRes(res);
    }
    ;
    return;
  }

  authLogin() {
    this.writeReq("AUTH LOGIN");
    let res = this.readRes();
    if ((sys.ObjUtil.compareNE(res.code(), 334) || sys.ObjUtil.compareNE(res.line(), "VXNlcm5hbWU6"))) {
      throw SmtpErr.makeRes(res);
    }
    ;
    this.writeReq(sys.Str.toBuf(this.#username).toBase64());
    (res = this.readRes());
    if ((sys.ObjUtil.compareNE(res.code(), 334) || sys.ObjUtil.compareNE(res.line(), "UGFzc3dvcmQ6"))) {
      throw SmtpErr.makeRes(res);
    }
    ;
    this.writeReq(sys.Str.toBuf(this.#password).toBase64());
    (res = this.readRes());
    if (sys.ObjUtil.compareNE(res.code(), 235)) {
      throw SmtpErr.makeRes(res);
    }
    ;
    return;
  }

  authPlain() {
    let creds = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().write(0), sys.Buf.type$.toNullable()).print(this.#username), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()).print(this.#password), sys.Buf.type$.toNullable());
    this.writeReq(sys.Str.plus("AUTH PLAIN ", creds.toBase64()));
    let res = this.readRes();
    if (sys.ObjUtil.compareNE(res.code(), 235)) {
      throw SmtpErr.makeRes(res);
    }
    ;
    return;
  }

  static make() {
    const $self = new SmtpClient();
    SmtpClient.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class SmtpRes extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#lines = sys.List.make(sys.Str.type$);
    return;
  }

  typeof() { return SmtpRes.type$; }

  #code = 0;

  code(it) {
    if (it === undefined) {
      return this.#code;
    }
    else {
      this.#code = it;
      return;
    }
  }

  #lines = null;

  lines(it) {
    if (it === undefined) {
      return this.#lines;
    }
    else {
      this.#lines = it;
      return;
    }
  }

  dump(out) {
    if (out === undefined) out = sys.Env.cur().out();
    const this$ = this;
    this.#lines.each((line,i) => {
      let sep = ((this$) => { if (sys.ObjUtil.compareLT(i, sys.Int.minus(this$.#lines.size(), 1))) return "-"; return " "; })(this$);
      out.print(sys.ObjUtil.coerce(this$.#code, sys.Obj.type$.toNullable())).print(sep).printLine(line);
      return;
    });
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this.#code, sys.Obj.type$.toNullable())), " "), this.#lines.last());
  }

  line() {
    return sys.ObjUtil.coerce(this.#lines.last(), sys.Str.type$);
  }

  static make() {
    const $self = new SmtpRes();
    SmtpRes.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class MimeUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MimeUtil.type$; }

  static toEncodedWord(text) {
    if (sys.Str.isAscii(text)) {
      return text;
    }
    ;
    return sys.Str.plus(sys.Str.plus("=?UTF-8?B?", sys.ObjUtil.coerce(sys.Buf.make().print(text), sys.Buf.type$.toNullable()).toBase64()), "?=");
  }

  static toAddrSpec(addr) {
    (addr = sys.Str.trim(addr));
    let lt = sys.Str.index(addr, "<");
    let gt = sys.Str.index(addr, ">");
    if ((lt != null && gt != null)) {
      return sys.Str.getRange(addr, sys.Range.make(sys.ObjUtil.coerce(lt, sys.Int.type$), sys.ObjUtil.coerce(gt, sys.Int.type$)));
    }
    ;
    return sys.Str.plus(sys.Str.plus("<", addr), ">");
  }

  static encodeHeader(out,name,val) {
    out.print(name).print(": ").print(val).print("\r\n");
    return;
  }

  static make() {
    const $self = new MimeUtil();
    MimeUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class EmailPart extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#headers = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.caseInsensitive(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

  typeof() { return EmailPart.type$; }

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

  validate() {
    return;
  }

  encode(out) {
    const this$ = this;
    this.#headers.each((val,name) => {
      MimeUtil.encodeHeader(out, name, val);
      return;
    });
    out.print("\r\n");
    return;
  }

  static make() {
    const $self = new EmailPart();
    EmailPart.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class FilePart extends EmailPart {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilePart.type$; }

  #file = null;

  file(it) {
    if (it === undefined) {
      return this.#file;
    }
    else {
      this.#file = it;
      return;
    }
  }

  static make() {
    const $self = new FilePart();
    FilePart.make$($self);
    return $self;
  }

  static make$($self) {
    EmailPart.make$($self);
    $self.headers().set("Content-Transfer-Encoding", "base64");
    return;
  }

  validate() {
    EmailPart.prototype.validate.call(this);
    if (sys.ObjUtil.coerce(this.#file, sys.Obj.type$.toNullable()) == null) {
      throw sys.Err.make(sys.Str.plus("file null in ", sys.Type.of(this).name()));
    }
    ;
    if (this.headers().get("Content-Type") == null) {
      let mime = ((this$) => { let $_u7 = this$.#file.mimeType(); if ($_u7 != null) return $_u7; throw sys.Err.make("Must specify Content-Type or file extension"); })(this);
      this.headers().set("Content-Type", mime.toStr());
    }
    ;
    let mime = sys.MimeType.fromStr(sys.ObjUtil.coerce(this.headers().get("Content-Type"), sys.Str.type$));
    if ((mime.params().get("name") == null && sys.Str.isAscii(this.#file.name()))) {
      this.headers().set("Content-Type", sys.Str.plus(mime.toStr(), sys.Str.plus(sys.Str.plus("; name=\"", this.#file.name()), "\"")));
    }
    ;
    if (sys.ObjUtil.compareNE(this.headers().get("Content-Transfer-Encoding"), "base64")) {
      throw sys.Err.make("Content-Transfer-Encoding must be base64");
    }
    ;
    return;
  }

  encode(out) {
    this.validate();
    EmailPart.prototype.encode.call(this, out);
    let in$ = this.#file.in();
    try {
      FilePart.encodeBase64(in$, sys.ObjUtil.coerce(this.#file.size(), sys.Int.type$), out);
    }
    finally {
      in$.close();
    }
    ;
    return;
  }

  static encodeBase64(in$,size,out) {
    const this$ = this;
    let buf = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Buf.make(), (it) => {
      it.capacity(100);
      return;
    }), sys.Buf.type$.toNullable());
    let left = size;
    while (sys.ObjUtil.compareGT(left, 0)) {
      in$.readBufFully(buf, sys.Int.min(left, 48));
      out.print(buf.toBase64()).print("\r\n");
      left = sys.Int.minus(left, buf.size());
      buf.clear();
    }
    ;
    return;
  }

}

class TextPart extends EmailPart {
  constructor() {
    super();
    const this$ = this;
    this.#text = "";
    return;
  }

  typeof() { return TextPart.type$; }

  #text = null;

  text(it) {
    if (it === undefined) {
      return this.#text;
    }
    else {
      this.#text = it;
      return;
    }
  }

  static make() {
    const $self = new TextPart();
    TextPart.make$($self);
    return $self;
  }

  static make$($self) {
    EmailPart.make$($self);
    ;
    $self.headers().set("Content-Type", "text/plain");
    $self.headers().set("Content-Transfer-Encoding", "8bit");
    return;
  }

  validate() {
    EmailPart.prototype.validate.call(this);
    if (sys.ObjUtil.coerce(this.#text, sys.Obj.type$.toNullable()) == null) {
      throw sys.NullErr.make(sys.Str.plus("text null in ", sys.Type.of(this).name()));
    }
    ;
    let ct = this.headers().get("Content-Type");
    if (ct == null) {
      throw sys.Err.make("Must define Content-Type header");
    }
    ;
    let mime = sys.MimeType.fromStr(sys.ObjUtil.coerce(ct, sys.Str.type$));
    if (mime.params().get("charset") == null) {
      this.headers().set("Content-Type", sys.Str.plus(mime.toStr(), "; charset=utf-8"));
    }
    ;
    if (sys.ObjUtil.compareNE(this.headers().get("Content-Transfer-Encoding"), "8bit")) {
      if (sys.ObjUtil.compareNE(sys.MimeType.fromStr(sys.ObjUtil.coerce(ct, sys.Str.type$)).params().get("charset"), "us-ascii")) {
        throw sys.Err.make("Content-Transfer-Encoding must be 8bit if not using charset=us-ascii");
      }
      ;
    }
    ;
    return;
  }

  encode(out) {
    const this$ = this;
    this.validate();
    let mime = sys.MimeType.fromStr(sys.ObjUtil.coerce(this.headers().get("Content-Type"), sys.Str.type$));
    let charset = sys.Charset.fromStr(sys.ObjUtil.coerce(mime.params().get("charset"), sys.Str.type$));
    EmailPart.prototype.encode.call(this, out);
    out.charset(sys.ObjUtil.coerce(charset, sys.Charset.type$));
    let in$ = sys.Str.in(this.#text);
    in$.eachLine((line) => {
      if (sys.ObjUtil.equals(line, ".")) {
        (line = ". ");
      }
      ;
      out.print(line).print("\r\n");
      return;
    });
    out.charset(sys.Charset.utf8());
    out.print("\r\n");
    return;
  }

}

class MultiPart extends EmailPart {
  constructor() {
    super();
    const this$ = this;
    this.#parts = sys.List.make(EmailPart.type$);
    return;
  }

  typeof() { return MultiPart.type$; }

  #parts = null;

  parts(it) {
    if (it === undefined) {
      return this.#parts;
    }
    else {
      this.#parts = it;
      return;
    }
  }

  static make() {
    const $self = new MultiPart();
    MultiPart.make$($self);
    return $self;
  }

  static make$($self) {
    EmailPart.make$($self);
    ;
    $self.headers().set("Content-Type", "multipart/mixed");
    return;
  }

  validate() {
    EmailPart.prototype.validate.call(this);
    if (sys.ObjUtil.coerce(this.#parts, sys.Obj.type$.toNullable()) == null) {
      throw sys.NullErr.make(sys.Str.plus("no parts in ", sys.Type.of(this).name()));
    }
    ;
    if (this.#parts.isEmpty()) {
      throw sys.Err.make(sys.Str.plus("no parts in ", sys.Type.of(this).name()));
    }
    ;
    if (this.headers().get("Content-Type") == null) {
      throw sys.Err.make("Must define Content-Type header");
    }
    ;
    let mime = sys.MimeType.fromStr(sys.ObjUtil.coerce(this.headers().get("Content-Type"), sys.Str.type$));
    let boundary = mime.params().get("boundary");
    if (boundary == null) {
      (boundary = sys.Str.plus(sys.Str.plus(sys.Str.plus("_Part_", sys.ObjUtil.coerce(sys.Int.div(sys.DateTime.now().ticks(), 1000000), sys.Obj.type$.toNullable())), "."), sys.Buf.random(4).toHex()));
      this.headers().set("Content-Type", sys.Str.plus(mime.toStr(), sys.Str.plus(sys.Str.plus("; boundary=\"", boundary), "\"")));
    }
    ;
    return;
  }

  encode(out) {
    const this$ = this;
    this.validate();
    let mime = sys.MimeType.fromStr(sys.ObjUtil.coerce(this.headers().get("Content-Type"), sys.Str.type$));
    let boundary = mime.params().get("boundary");
    EmailPart.prototype.encode.call(this, out);
    this.#parts.each((part) => {
      out.print("--").print(boundary).print("\r\n");
      part.encode(out);
      return;
    });
    out.print("--").print(boundary).print("--\r\n");
    return;
  }

}

class Email extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#msgId = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("<", sys.ObjUtil.coerce(sys.Int.div(sys.DateTime.now().ticks(), 1000000), sys.Obj.type$.toNullable())), "."), sys.Buf.random(4).toHex()), "@"), inet.IpAddr.local().hostname()), ">");
    this.#subject = "";
    return;
  }

  typeof() { return Email.type$; }

  #msgId = null;

  msgId(it) {
    if (it === undefined) {
      return this.#msgId;
    }
    else {
      this.#msgId = it;
      return;
    }
  }

  #from = null;

  from(it) {
    if (it === undefined) {
      return this.#from;
    }
    else {
      this.#from = it;
      return;
    }
  }

  #to = null;

  to(it) {
    if (it === undefined) {
      return this.#to;
    }
    else {
      this.#to = it;
      return;
    }
  }

  #cc = null;

  cc(it) {
    if (it === undefined) {
      return this.#cc;
    }
    else {
      this.#cc = it;
      return;
    }
  }

  #bcc = null;

  bcc(it) {
    if (it === undefined) {
      return this.#bcc;
    }
    else {
      this.#bcc = it;
      return;
    }
  }

  #replyTo = null;

  replyTo(it) {
    if (it === undefined) {
      return this.#replyTo;
    }
    else {
      this.#replyTo = it;
      return;
    }
  }

  #subject = null;

  subject(it) {
    if (it === undefined) {
      return this.#subject;
    }
    else {
      this.#subject = it;
      return;
    }
  }

  #body = null;

  body(it) {
    if (it === undefined) {
      return this.#body;
    }
    else {
      this.#body = it;
      return;
    }
  }

  recipients() {
    let acc = sys.List.make(sys.Str.type$);
    if (this.#to != null) {
      acc.addAll(sys.ObjUtil.coerce(this.#to, sys.Type.find("sys::Str[]")));
    }
    ;
    if (this.#cc != null) {
      acc.addAll(sys.ObjUtil.coerce(this.#cc, sys.Type.find("sys::Str[]")));
    }
    ;
    if (this.#bcc != null) {
      acc.addAll(sys.ObjUtil.coerce(this.#bcc, sys.Type.find("sys::Str[]")));
    }
    ;
    return acc;
  }

  validate() {
    if (((this.#to == null || this.#to.isEmpty()) && (this.#cc == null || this.#cc.isEmpty()) && (this.#bcc == null || this.#bcc.isEmpty()))) {
      throw sys.Err.make("no recipients");
    }
    ;
    if (sys.ObjUtil.coerce(this.#from, sys.Obj.type$.toNullable()) == null) {
      throw sys.NullErr.make("from is null");
    }
    ;
    if (sys.ObjUtil.coerce(this.#body, sys.Obj.type$.toNullable()) == null) {
      throw sys.NullErr.make("body is null");
    }
    ;
    this.#body.validate();
    return;
  }

  encode(out) {
    out.print(sys.Str.plus(sys.Str.plus("Message-ID: ", this.#msgId), "\r\n"));
    out.print(sys.Str.plus(sys.Str.plus("From: ", this.#from), "\r\n"));
    if (((this$) => { let $_u8 = this$.#replyTo; if ($_u8 == null) return null; return sys.Str.trimToNull(this$.#replyTo); })(this) != null) {
      out.print(sys.Str.plus(sys.Str.plus("Reply-To: ", this.#replyTo), "\r\n"));
    }
    ;
    this.encodeAddrSpecsField(out, "To", this.#to);
    this.encodeAddrSpecsField(out, "Cc", this.#cc);
    out.print(sys.Str.plus(sys.Str.plus("Subject: ", MimeUtil.toEncodedWord(this.#subject)), "\r\n"));
    out.print(sys.Str.plus(sys.Str.plus("Date: ", sys.DateTime.now().toHttpStr()), "\r\n"));
    out.print("MIME-Version: 1.0\r\n");
    this.#body.encode(out);
    out.print("\r\n.\r\n");
    out.flush();
    return;
  }

  encodeAddrSpecsField(out,name,vals) {
    const this$ = this;
    if ((vals == null || vals.isEmpty())) {
      return;
    }
    ;
    out.print(name).print(":");
    vals.each((val,i) => {
      let comma = ((this$) => { if (sys.ObjUtil.compareLT(sys.Int.plus(i, 1), vals.size())) return ","; return ""; })(this$);
      out.print(" ").print(MimeUtil.toAddrSpec(val)).print(comma).print("\r\n");
      return;
    });
    return;
  }

  static make() {
    const $self = new Email();
    Email.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class SmtpErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SmtpErr.type$; }

  #code = 0;

  code() { return this.#code; }

  __code(it) { if (it === undefined) return this.#code; else this.#code = it; }

  static make(code,msg,cause) {
    const $self = new SmtpErr();
    SmtpErr.make$($self,code,msg,cause);
    return $self;
  }

  static make$($self,code,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.ObjUtil.coerce(msg, sys.Str.type$), cause);
    $self.#code = code;
    return;
  }

  static makeRes(res,cause) {
    const $self = new SmtpErr();
    SmtpErr.makeRes$($self,res,cause);
    return $self;
  }

  static makeRes$($self,res,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, res.toStr(), cause);
    $self.#code = res.code();
    return;
  }

}

class MimeUtilTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MimeUtilTest.type$; }

  testToAddrSpec() {
    this.verifyEq(MimeUtil.toAddrSpec("bob@acme.com"), "<bob@acme.com>");
    this.verifyEq(MimeUtil.toAddrSpec("bob@acme.com "), "<bob@acme.com>");
    this.verifyEq(MimeUtil.toAddrSpec("<bob@acme.com>"), "<bob@acme.com>");
    this.verifyEq(MimeUtil.toAddrSpec("<bob@acme.com> "), "<bob@acme.com>");
    this.verifyEq(MimeUtil.toAddrSpec("Bob Smith <bob@acme.com>"), "<bob@acme.com>");
    this.verifyEq(MimeUtil.toAddrSpec("\"Bob Smith\" <bob@acme.com>"), "<bob@acme.com>");
    return;
  }

  testEncodedWord() {
    this.verifySame(MimeUtil.toEncodedWord("hi!"), "hi!");
    this.verifyEq(MimeUtil.toEncodedWord("\u00ff!"), "=?UTF-8?B?w78h?=");
    return;
  }

  static make() {
    const $self = new MimeUtilTest();
    MimeUtilTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class EmailTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EmailTest.type$; }

  testValidate() {
    const this$ = this;
    let m = this.makeVal();
    m.validate();
    (m = sys.ObjUtil.coerce(sys.ObjUtil.with(this.makeVal(), (it) => {
      it.cc(null);
      it.bcc(null);
      return;
    }), Email.type$));
    m.validate();
    (m = sys.ObjUtil.coerce(sys.ObjUtil.with(this.makeVal(), (it) => {
      it.to(null);
      it.bcc(null);
      return;
    }), Email.type$));
    m.validate();
    (m = sys.ObjUtil.coerce(sys.ObjUtil.with(this.makeVal(), (it) => {
      it.to(null);
      it.cc(null);
      return;
    }), Email.type$));
    m.validate();
    let x = null;
    let xpart = null;
    let xparts = null;
    this.verifyErr(sys.Err.type$, (it) => {
      (m = sys.ObjUtil.coerce(sys.ObjUtil.with(this$.makeVal(), (it) => {
        it.to(null);
        it.cc(null);
        it.bcc(null);
        return;
      }), Email.type$));
      m.validate();
      return;
    });
    this.verifyErr(sys.NullErr.type$, (it) => {
      (m = sys.ObjUtil.coerce(sys.ObjUtil.with(this$.makeVal(), (it) => {
        it.from(x);
        return;
      }), Email.type$));
      m.validate();
      return;
    });
    this.verifyErr(sys.NullErr.type$, (it) => {
      (m = sys.ObjUtil.coerce(sys.ObjUtil.with(this$.makeVal(), (it) => {
        it.subject(sys.ObjUtil.coerce(x, sys.Str.type$));
        return;
      }), Email.type$));
      m.validate();
      return;
    });
    this.verifyErr(sys.NullErr.type$, (it) => {
      (m = sys.ObjUtil.coerce(sys.ObjUtil.with(this$.makeVal(), (it) => {
        it.body(xpart);
        return;
      }), Email.type$));
      m.validate();
      return;
    });
    this.verifyErr(sys.NullErr.type$, (it) => {
      (m = sys.ObjUtil.coerce(sys.ObjUtil.with(this$.makeVal(), (it) => {
        it.body(sys.ObjUtil.coerce(sys.ObjUtil.with(TextPart.make(), (it) => {
          it.text(sys.ObjUtil.coerce(x, sys.Str.type$));
          return;
        }), TextPart.type$));
        return;
      }), Email.type$));
      m.validate();
      return;
    });
    this.verifyErr(sys.NullErr.type$, (it) => {
      (m = sys.ObjUtil.coerce(sys.ObjUtil.with(this$.makeVal(), (it) => {
        it.body(sys.ObjUtil.coerce(sys.ObjUtil.with(MultiPart.make(), (it) => {
          it.parts(sys.ObjUtil.coerce(xparts, sys.Type.find("email::EmailPart[]")));
          return;
        }), MultiPart.type$));
        return;
      }), Email.type$));
      m.validate();
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      (m = sys.ObjUtil.coerce(sys.ObjUtil.with(this$.makeVal(), (it) => {
        it.body(sys.ObjUtil.coerce(sys.ObjUtil.with(MultiPart.make(), (it) => {
          return;
        }), MultiPart.type$));
        return;
      }), Email.type$));
      m.validate();
      return;
    });
    (m = sys.ObjUtil.coerce(sys.ObjUtil.with(this.makeVal(), (it) => {
      it.body(sys.ObjUtil.coerce(sys.ObjUtil.with(TextPart.make(), (it) => {
        it.text("x");
        return;
      }), TextPart.type$));
      return;
    }), Email.type$));
    m.validate();
    this.verifyEq(m.body().headers().get("Content-Type"), "text/plain; charset=utf-8");
    (m = sys.ObjUtil.coerce(sys.ObjUtil.with(this.makeVal(), (it) => {
      it.body(sys.ObjUtil.coerce(sys.ObjUtil.with(TextPart.make(), (it) => {
        it.text("x");
        it.headers().set("Content-Transfer-Encoding", "7bit");
        it.headers().set("Content-Type", "text/plain; charset=us-ascii");
        return;
      }), TextPart.type$));
      return;
    }), Email.type$));
    m.validate();
    this.verifyErr(sys.Err.type$, () => {
      (m = sys.ObjUtil.coerce(sys.ObjUtil.with(this$.makeVal(), (it) => {
        it.body(sys.ObjUtil.coerce(sys.ObjUtil.with(TextPart.make(), (it) => {
          it.text("x");
          it.headers().set("Content-Transfer-Encoding", "7bit");
          return;
        }), TextPart.type$));
        return;
      }), Email.type$));
      m.validate();
      return;
    });
    (m = sys.ObjUtil.coerce(sys.ObjUtil.with(this.makeVal(), (it) => {
      it.body(sys.ObjUtil.coerce(sys.ObjUtil.with(MultiPart.make(), (it) => {
        it.parts(sys.List.make(TextPart.type$, [sys.ObjUtil.coerce(sys.ObjUtil.with(TextPart.make(), (it) => {
          it.text("");
          return;
        }), TextPart.type$)]));
        return;
      }), MultiPart.type$));
      return;
    }), Email.type$));
    m.validate();
    this.verify(sys.MimeType.fromStr(sys.ObjUtil.coerce(m.body().headers().get("Content-Type"), sys.Str.type$)).params().get("boundary") != null);
    (m = sys.ObjUtil.coerce(sys.ObjUtil.with(this.makeVal(), (it) => {
      it.body(sys.ObjUtil.coerce(sys.ObjUtil.with(FilePart.make(), (it) => {
        it.file(sys.Uri.fromStr("test.png").toFile());
        return;
      }), FilePart.type$));
      return;
    }), Email.type$));
    m.validate();
    this.verifyEq(m.body().headers().get("Content-Type"), "image/png; name=\"test.png\"");
    return;
  }

  makeVal() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(Email.make(), (it) => {
      it.to(sys.List.make(sys.Str.type$, ["brian@foo.com"]));
      it.cc(sys.List.make(sys.Str.type$, ["brian@foo.com"]));
      it.bcc(sys.List.make(sys.Str.type$, ["brian@foo.com"]));
      it.from("brian@foo.com");
      it.subject("foo");
      it.body(sys.ObjUtil.coerce(sys.ObjUtil.with(TextPart.make(), (it) => {
        it.text("text");
        return;
      }), TextPart.type$));
      return;
    }), Email.type$);
  }

  static make() {
    const $self = new EmailTest();
    EmailTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

const p = sys.Pod.add$('email');
const xp = sys.Param.noParams$();
let m;
SmtpClient.type$ = p.at$('SmtpClient','sys::Obj',[],{},8192,SmtpClient);
SmtpRes.type$ = p.at$('SmtpRes','sys::Obj',[],{},128,SmtpRes);
MimeUtil.type$ = p.at$('MimeUtil','sys::Obj',[],{},8192,MimeUtil);
EmailPart.type$ = p.at$('EmailPart','sys::Obj',[],{'sys::Serializable':""},8193,EmailPart);
FilePart.type$ = p.at$('FilePart','email::EmailPart',[],{},8192,FilePart);
TextPart.type$ = p.at$('TextPart','email::EmailPart',[],{'sys::Serializable':""},8192,TextPart);
MultiPart.type$ = p.at$('MultiPart','email::EmailPart',[],{'sys::Serializable':""},8192,MultiPart);
Email.type$ = p.at$('Email','sys::Obj',[],{'sys::Serializable':""},8192,Email);
SmtpErr.type$ = p.at$('SmtpErr','sys::Err',[],{},8194,SmtpErr);
MimeUtilTest.type$ = p.at$('MimeUtilTest','sys::Test',[],{},8192,MimeUtilTest);
EmailTest.type$ = p.at$('EmailTest','sys::Test',[],{},8192,EmailTest);
SmtpClient.type$.af$('host',73728,'sys::Str?',{}).af$('port',73728,'sys::Int',{}).af$('username',73728,'sys::Str?',{}).af$('password',73728,'sys::Str?',{}).af$('ssl',73728,'sys::Bool',{}).af$('socketConfig',73728,'inet::SocketConfig',{}).af$('log',73728,'sys::Log',{'sys::NoDoc':""}).af$('sock',67584,'inet::TcpSocket?',{}).af$('auths',67584,'sys::Str[]?',{}).af$('starttls',67584,'sys::Bool',{}).am$('isClosed',8192,'sys::Bool',xp,{}).am$('open',8192,'sys::Void',xp,{}).am$('close',8192,'sys::Void',xp,{}).am$('send',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('email','email::Email',false)]),{}).am$('writeReq',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('req','sys::Str',false)]),{}).am$('readRes',2048,'email::SmtpRes',xp,{}).am$('readExts',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('res','email::SmtpRes',false)]),{}).am$('authenticate',8192,'sys::Void',xp,{}).am$('authCramMd5',8192,'sys::Void',xp,{}).am$('authLogin',8192,'sys::Void',xp,{}).am$('authPlain',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
SmtpRes.type$.af$('code',73728,'sys::Int',{}).af$('lines',73728,'sys::Str[]',{}).am$('dump',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('line',8192,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
MimeUtil.type$.am$('toEncodedWord',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('text','sys::Str',false)]),{}).am$('toAddrSpec',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('addr','sys::Str',false)]),{}).am$('encodeHeader',32898,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
EmailPart.type$.af$('headers',73728,'[sys::Str:sys::Str]',{}).am$('validate',270336,'sys::Void',xp,{}).am$('encode',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('make',139268,'sys::Void',xp,{});
FilePart.type$.af$('file',73728,'sys::File?',{}).am$('make',8196,'sys::Void',xp,{}).am$('validate',271360,'sys::Void',xp,{}).am$('encode',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('encodeBase64',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('size','sys::Int',false),new sys.Param('out','sys::OutStream',false)]),{'sys::NoDoc':""});
TextPart.type$.af$('text',73728,'sys::Str',{}).am$('make',8196,'sys::Void',xp,{}).am$('validate',271360,'sys::Void',xp,{}).am$('encode',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{});
MultiPart.type$.af$('parts',73728,'email::EmailPart[]',{}).am$('make',8196,'sys::Void',xp,{}).am$('validate',271360,'sys::Void',xp,{}).am$('encode',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{});
Email.type$.af$('msgId',73728,'sys::Str',{}).af$('from',73728,'sys::Str?',{}).af$('to',73728,'sys::Str[]?',{}).af$('cc',73728,'sys::Str[]?',{}).af$('bcc',73728,'sys::Str[]?',{}).af$('replyTo',73728,'sys::Str?',{}).af$('subject',73728,'sys::Str',{}).af$('body',73728,'email::EmailPart?',{}).am$('recipients',8192,'sys::Str[]',xp,{}).am$('validate',270336,'sys::Void',xp,{}).am$('encode',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('encodeAddrSpecsField',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('name','sys::Str',false),new sys.Param('vals','sys::Str[]?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
SmtpErr.type$.af$('code',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Int',false),new sys.Param('msg','sys::Str?',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('makeRes',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('res','email::SmtpRes',false),new sys.Param('cause','sys::Err?',true)]),{});
MimeUtilTest.type$.am$('testToAddrSpec',8192,'sys::Void',xp,{}).am$('testEncodedWord',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
EmailTest.type$.am$('testValidate',8192,'sys::Void',xp,{}).am$('makeVal',8192,'email::Email',xp,{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "email");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;inet 1.0");
m.set("pod.summary", "Email support");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:22-05:00 New_York");
m.set("build.tsKey", "241210143122");
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
  SmtpClient,
  MimeUtil,
  EmailPart,
  FilePart,
  TextPart,
  MultiPart,
  Email,
  SmtpErr,
  MimeUtilTest,
  EmailTest,
};
