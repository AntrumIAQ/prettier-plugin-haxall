// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class SqlMeta extends sys.Obj {
  constructor() {
    super();
    this.peer = new SqlMetaPeer(this);
    const this$ = this;
  }

  typeof() { return SqlMeta.type$; }

  static make() {
    const $self = new SqlMeta();
    SqlMeta.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  productName() {
    return this.peer.productName(this);
  }

  productVersion() {
    return this.peer.productVersion(this);
  }

  productVersionStr() {
    return this.peer.productVersionStr(this);
  }

  driverName() {
    return this.peer.driverName(this);
  }

  driverVersion() {
    return this.peer.driverVersion(this);
  }

  driverVersionStr() {
    return this.peer.driverVersionStr(this);
  }

  maxColName() {
    return this.peer.maxColName(this);
  }

  maxTableName() {
    return this.peer.maxTableName(this);
  }

  tableExists(tableName) {
    return this.peer.tableExists(this,tableName);
  }

  tables() {
    return this.peer.tables(this);
  }

  tableRow(tableName) {
    return this.peer.tableRow(this,tableName);
  }

}

class Col extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Col.type$; }

  #index = 0;

  index() { return this.#index; }

  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #sqlType = null;

  sqlType() { return this.#sqlType; }

  __sqlType(it) { if (it === undefined) return this.#sqlType; else this.#sqlType = it; }

  static make(index,name,type,sqlType) {
    const $self = new Col();
    Col.make$($self,index,name,type,sqlType);
    return $self;
  }

  static make$($self,index,name,type,sqlType) {
    $self.#index = index;
    $self.#name = name;
    $self.#type = type;
    $self.#sqlType = sqlType;
    return;
  }

  toStr() {
    return this.#name;
  }

}

class Tokenizer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#cur = 0;
    this.#numParams = 0;
    this.#sqlBuf = sys.StrBuf.make();
    this.#params = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]"));
    return;
  }

  typeof() { return Tokenizer.type$; }

  #origSql = null;

  // private field reflection only
  __origSql(it) { if (it === undefined) return this.#origSql; else this.#origSql = it; }

  #cur = 0;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #numParams = 0;

  // private field reflection only
  __numParams(it) { if (it === undefined) return this.#numParams; else this.#numParams = it; }

  #sqlBuf = null;

  // private field reflection only
  __sqlBuf(it) { if (it === undefined) return this.#sqlBuf; else this.#sqlBuf = it; }

  #sql = null;

  sql(it) {
    if (it === undefined) {
      return this.#sql;
    }
    else {
      this.#sql = it;
      return;
    }
  }

  #params = null;

  params(it) {
    if (it === undefined) {
      return this.#params;
    }
    else {
      this.#params = it;
      return;
    }
  }

  static make(origSql) {
    const $self = new Tokenizer();
    Tokenizer.make$($self,origSql);
    return $self;
  }

  static make$($self,origSql) {
    ;
    $self.#origSql = origSql;
    let next = $self.nextToken();
    while (true) {
      let $_u0 = next;
      if (sys.ObjUtil.equals($_u0, Token.text())) {
        (next = $self.text());
      }
      else if (sys.ObjUtil.equals($_u0, Token.param())) {
        (next = $self.param());
      }
      else if (sys.ObjUtil.equals($_u0, Token.escape())) {
        (next = $self.escape());
      }
      else if (sys.ObjUtil.equals($_u0, Token.quoted())) {
        (next = $self.quoted());
      }
      else if (sys.ObjUtil.equals($_u0, Token.end())) {
        $self.#sql = $self.#sqlBuf.toStr();
        return;
      }
      else {
        throw sys.Err.make("unreachable");
      }
      ;
    }
    ;
    return;
  }

  text() {
    let start = ((this$) => { let $_u1 = this$.#cur;this$.#cur = sys.Int.increment(this$.#cur); return $_u1; })(this);
    let tok = this.nextToken();
    while (sys.ObjUtil.equals(tok, Token.text())) {
      ((this$) => { let $_u2 = this$.#cur;this$.#cur = sys.Int.increment(this$.#cur); return $_u2; })(this);
      (tok = this.nextToken());
    }
    ;
    this.#sqlBuf.add(sys.Str.getRange(this.#origSql, sys.Range.make(start, this.#cur, true)));
    return tok;
  }

  param() {
    const this$ = this;
    let start = ((this$) => { let $_u3 = this$.#cur;this$.#cur = sys.Int.increment(this$.#cur); return $_u3; })(this);
    while ((sys.ObjUtil.compareLT(this.#cur, sys.Str.size(this.#origSql)) && Tokenizer.isIdent(sys.Str.get(this.#origSql, this.#cur)))) {
      ((this$) => { let $_u4 = this$.#cur;this$.#cur = sys.Int.increment(this$.#cur); return $_u4; })(this);
    }
    ;
    this.#sqlBuf.add("?");
    let name = sys.Str.getRange(this.#origSql, sys.Range.make(sys.Int.plus(start, 1), this.#cur, true));
    let locs = this.#params.getOrAdd(name, (k) => {
      return sys.List.make(sys.Int.type$);
    });
    locs.add(sys.ObjUtil.coerce(this.#numParams = sys.Int.increment(this.#numParams), sys.Obj.type$.toNullable()));
    return this.nextToken();
  }

  escape() {
    this.#sqlBuf.addChar(sys.Str.get(this.#origSql, sys.Int.plus(this.#cur, 1)));
    this.#cur = sys.Int.plus(this.#cur, 2);
    return this.nextToken();
  }

  quoted() {
    let start = ((this$) => { let $_u5 = this$.#cur;this$.#cur = sys.Int.increment(this$.#cur); return $_u5; })(this);
    while (sys.ObjUtil.compareLT(this.#cur, sys.Str.size(this.#origSql))) {
      if (sys.ObjUtil.equals(sys.Str.get(this.#origSql, this.#cur), 39)) {
        this.#sqlBuf.add(sys.Str.getRange(this.#origSql, sys.Range.make(start, ((this$) => { let $_u6 = this$.#cur;this$.#cur = sys.Int.increment(this$.#cur); return $_u6; })(this))));
        return this.nextToken();
      }
      ;
      ((this$) => { let $_u7 = this$.#cur;this$.#cur = sys.Int.increment(this$.#cur); return $_u7; })(this);
    }
    ;
    throw SqlErr.make("Unterminated quoted text.");
  }

  nextToken() {
    if (sys.ObjUtil.compareGE(this.#cur, sys.Str.size(this.#origSql))) {
      return Token.end();
    }
    ;
    let $_u8 = sys.Str.get(this.#origSql, this.#cur);
    if (sys.ObjUtil.equals($_u8, 64)) {
      if (Tokenizer.isIdent(this.lookahead(1))) {
        return Token.param();
      }
      else {
        return Token.text();
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u8, 92)) {
      let look = this.lookahead(1);
      if ((sys.ObjUtil.equals(look, 64) || sys.ObjUtil.equals(look, 92))) {
        return Token.escape();
      }
      else {
        throw SqlErr.make(sys.Str.plus(sys.Str.plus("Invalid escape sequence '", sys.Str.getRange(this.#origSql, sys.Range.make(this.#cur, sys.Int.plus(this.#cur, 1)))), "'."));
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u8, 39)) {
      return Token.quoted();
    }
    else {
      return Token.text();
    }
    ;
  }

  static isIdent(ch) {
    return ((sys.ObjUtil.compareGE(ch, 97) && sys.ObjUtil.compareLE(ch, 122)) || (sys.ObjUtil.compareGE(ch, 65) && sys.ObjUtil.compareLE(ch, 90)) || (sys.ObjUtil.compareGE(ch, 48) && sys.ObjUtil.compareLE(ch, 57)) || sys.ObjUtil.equals(ch, 95));
  }

  lookahead(n) {
    return ((this$) => { if (sys.ObjUtil.compareLT(sys.Int.plus(this$.#cur, n), sys.Str.size(this$.#origSql))) return sys.Str.get(this$.#origSql, sys.Int.plus(this$.#cur, n)); return -1; })(this);
  }

}

class Token extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Token.type$; }

  static text() { return Token.vals().get(0); }

  static param() { return Token.vals().get(1); }

  static escape() { return Token.vals().get(2); }

  static quoted() { return Token.vals().get(3); }

  static end() { return Token.vals().get(4); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new Token();
    Token.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(Token.type$, Token.vals(), name$, checked);
  }

  static vals() {
    if (Token.#vals == null) {
      Token.#vals = sys.List.make(Token.type$, [
        Token.make(0, "text", ),
        Token.make(1, "param", ),
        Token.make(2, "escape", ),
        Token.make(3, "quoted", ),
        Token.make(4, "end", ),
      ]).toImmutable();
    }
    return Token.#vals;
  }

  static static$init() {
    const $_u10 = Token.vals();
    if (true) {
    }
    ;
    return;
  }

}

class SqlConnPool extends sys.Obj {
  constructor() {
    super();
    this.peer = new SqlConnPoolPeer(this);
    const this$ = this;
    this.#maxConns = 10;
    this.#timeout = sys.Duration.fromStr("30sec");
    this.#linger = sys.Duration.fromStr("5min");
    this.#log = sys.Log.get("sqlPool");
    return;
  }

  typeof() { return SqlConnPool.type$; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #username = null;

  username() { return this.#username; }

  __username(it) { if (it === undefined) return this.#username; else this.#username = it; }

  #password = null;

  password() { return this.#password; }

  __password(it) { if (it === undefined) return this.#password; else this.#password = it; }

  #maxConns = 0;

  maxConns() { return this.#maxConns; }

  __maxConns(it) { if (it === undefined) return this.#maxConns; else this.#maxConns = it; }

  #timeout = null;

  timeout() { return this.#timeout; }

  __timeout(it) { if (it === undefined) return this.#timeout; else this.#timeout = it; }

  #linger = null;

  linger() { return this.#linger; }

  __linger(it) { if (it === undefined) return this.#linger; else this.#linger = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  static make(f) {
    const $self = new SqlConnPool();
    SqlConnPool.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ;
    if (f != null) {
      sys.Func.call(f, $self);
    }
    ;
    return;
  }

  onOpen(c) {
    return;
  }

  onClose(c) {
    return;
  }

  execute(f) {
    return this.peer.execute(this,f);
  }

  checkLinger() {
    return this.peer.checkLinger(this);
  }

  isClosed() {
    return this.peer.isClosed(this);
  }

  close() {
    return this.peer.close(this);
  }

  debug() {
    return this.peer.debug(this);
  }

}

class Statement extends sys.Obj {
  constructor() {
    super();
    this.peer = new StatementPeer(this);
    const this$ = this;
  }

  typeof() { return Statement.type$; }

  #conn = null;

  conn() {
    return this.#conn;
  }

  #sql = null;

  sql() { return this.#sql; }

  __sql(it) { if (it === undefined) return this.#sql; else this.#sql = it; }

  limit(it) {
    if (it === undefined) return this.peer.limit(this);
    this.peer.limit(this, it);
  }

  static make(conn,sql) {
    const $self = new Statement();
    Statement.make$($self,conn,sql);
    return $self;
  }

  static make$($self,conn,sql) {
    $self.#conn = conn;
    $self.#sql = sql;
    $self.init();
    return;
  }

  init() {
    return this.peer.init(this);
  }

  prepare() {
    return this.peer.prepare(this);
  }

  query(params) {
    if (params === undefined) params = null;
    return this.peer.query(this,params);
  }

  queryEach(params,eachFunc) {
    return this.peer.queryEach(this,params,eachFunc);
  }

  queryEachWhile(params,eachFunc) {
    return this.peer.queryEachWhile(this,params,eachFunc);
  }

  execute(params) {
    if (params === undefined) params = null;
    return this.peer.execute(this,params);
  }

  executeBatch(paramsList) {
    return this.peer.executeBatch(this,paramsList);
  }

  more() {
    return this.peer.more(this);
  }

  close() {
    return this.peer.close(this);
  }

}

class Row extends sys.Obj {
  constructor() {
    super();
    this.peer = new RowPeer(this);
    const this$ = this;
  }

  typeof() { return Row.type$; }

  cols() {
    return this.peer.cols(this);
  }

  col(name,checked) {
    if (checked === undefined) checked = true;
    return this.peer.col(this,name,checked);
  }

  get(col) {
    return this.peer.get(this,col);
  }

  set(col,val) {
    return this.peer.set(this,col,val);
  }

  trap(name,args) {
    if (args === undefined) args = null;
    if ((args == null || sys.ObjUtil.equals(args.size(), 0))) {
      return this.get(sys.ObjUtil.coerce(this.col(name), Col.type$));
    }
    ;
    if (sys.ObjUtil.equals(args.size(), 1)) {
      this.set(sys.ObjUtil.coerce(this.col(name), Col.type$), args.first());
      return null;
    }
    ;
    return sys.ObjUtil.trap(sys.Obj.prototype, name, args);
  }

  toStr() {
    const this$ = this;
    return this.cols().join(", ", (col) => {
      return sys.ObjUtil.toStr(((this$) => { let $_u11 = this$.get(col); if ($_u11 != null) return $_u11; return "null"; })(this$));
    });
  }

  static make() {
    const $self = new Row();
    Row.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DeprecatedTokenizer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#cur = 0;
    this.#numParams = 0;
    this.#sqlBuf = sys.StrBuf.make();
    this.#params = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]"));
    return;
  }

  typeof() { return DeprecatedTokenizer.type$; }

  #origSql = null;

  // private field reflection only
  __origSql(it) { if (it === undefined) return this.#origSql; else this.#origSql = it; }

  #cur = 0;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #numParams = 0;

  // private field reflection only
  __numParams(it) { if (it === undefined) return this.#numParams; else this.#numParams = it; }

  #sqlBuf = null;

  // private field reflection only
  __sqlBuf(it) { if (it === undefined) return this.#sqlBuf; else this.#sqlBuf = it; }

  #sql = null;

  sql(it) {
    if (it === undefined) {
      return this.#sql;
    }
    else {
      this.#sql = it;
      return;
    }
  }

  #params = null;

  params(it) {
    if (it === undefined) {
      return this.#params;
    }
    else {
      this.#params = it;
      return;
    }
  }

  static make(origSql) {
    const $self = new DeprecatedTokenizer();
    DeprecatedTokenizer.make$($self,origSql);
    return $self;
  }

  static make$($self,origSql) {
    ;
    $self.#origSql = origSql;
    let next = $self.nextToken();
    while (true) {
      let $_u12 = next;
      if (sys.ObjUtil.equals($_u12, DeprecatedToken.text())) {
        (next = $self.text());
      }
      else if (sys.ObjUtil.equals($_u12, DeprecatedToken.param())) {
        (next = $self.param());
      }
      else if (sys.ObjUtil.equals($_u12, DeprecatedToken.escapedVar())) {
        (next = $self.escapedVar());
      }
      else if (sys.ObjUtil.equals($_u12, DeprecatedToken.quoted())) {
        (next = $self.quoted());
      }
      else if (sys.ObjUtil.equals($_u12, DeprecatedToken.end())) {
        $self.#sql = $self.#sqlBuf.toStr();
        return;
      }
      else {
        throw sys.Err.make("unreachable");
      }
      ;
    }
    ;
    return;
  }

  text() {
    let start = ((this$) => { let $_u13 = this$.#cur;this$.#cur = sys.Int.increment(this$.#cur); return $_u13; })(this);
    let tok = this.nextToken();
    while (sys.ObjUtil.equals(tok, DeprecatedToken.text())) {
      ((this$) => { let $_u14 = this$.#cur;this$.#cur = sys.Int.increment(this$.#cur); return $_u14; })(this);
      (tok = this.nextToken());
    }
    ;
    this.#sqlBuf.add(sys.Str.getRange(this.#origSql, sys.Range.make(start, this.#cur, true)));
    return tok;
  }

  param() {
    const this$ = this;
    let start = ((this$) => { let $_u15 = this$.#cur;this$.#cur = sys.Int.increment(this$.#cur); return $_u15; })(this);
    while ((sys.ObjUtil.compareLT(this.#cur, sys.Str.size(this.#origSql)) && DeprecatedTokenizer.isIdent(sys.Str.get(this.#origSql, this.#cur)))) {
      ((this$) => { let $_u16 = this$.#cur;this$.#cur = sys.Int.increment(this$.#cur); return $_u16; })(this);
    }
    ;
    this.#sqlBuf.add("?");
    let name = sys.Str.getRange(this.#origSql, sys.Range.make(sys.Int.plus(start, 1), this.#cur, true));
    let locs = this.#params.getOrAdd(name, (k) => {
      return sys.List.make(sys.Int.type$);
    });
    locs.add(sys.ObjUtil.coerce(this.#numParams = sys.Int.increment(this.#numParams), sys.Obj.type$.toNullable()));
    return this.nextToken();
  }

  escapedVar() {
    let start = this.#cur;
    this.#cur = sys.Int.plus(this.#cur, 2);
    while ((sys.ObjUtil.compareLT(this.#cur, sys.Str.size(this.#origSql)) && DeprecatedTokenizer.isIdent(sys.Str.get(this.#origSql, this.#cur)))) {
      ((this$) => { let $_u17 = this$.#cur;this$.#cur = sys.Int.increment(this$.#cur); return $_u17; })(this);
    }
    ;
    this.#sqlBuf.add(sys.Str.getRange(this.#origSql, sys.Range.make(sys.Int.plus(start, 1), this.#cur, true)));
    return this.nextToken();
  }

  quoted() {
    let start = ((this$) => { let $_u18 = this$.#cur;this$.#cur = sys.Int.increment(this$.#cur); return $_u18; })(this);
    while (sys.ObjUtil.compareLT(this.#cur, sys.Str.size(this.#origSql))) {
      if (sys.ObjUtil.equals(sys.Str.get(this.#origSql, this.#cur), 39)) {
        this.#sqlBuf.add(sys.Str.getRange(this.#origSql, sys.Range.make(start, ((this$) => { let $_u19 = this$.#cur;this$.#cur = sys.Int.increment(this$.#cur); return $_u19; })(this))));
        return this.nextToken();
      }
      ;
      ((this$) => { let $_u20 = this$.#cur;this$.#cur = sys.Int.increment(this$.#cur); return $_u20; })(this);
    }
    ;
    throw SqlErr.make("Unterminated quoted text.");
  }

  nextToken() {
    if (sys.ObjUtil.compareGE(this.#cur, sys.Str.size(this.#origSql))) {
      return DeprecatedToken.end();
    }
    ;
    let $_u21 = sys.Str.get(this.#origSql, this.#cur);
    if (sys.ObjUtil.equals($_u21, 64)) {
      let look = this.lookahead(1);
      if (DeprecatedTokenizer.isIdent(look)) {
        return DeprecatedToken.param();
      }
      else {
        if ((sys.ObjUtil.equals(look, 64) && DeprecatedTokenizer.isIdent(this.lookahead(2)))) {
          return DeprecatedToken.escapedVar();
        }
        else {
          return DeprecatedToken.text();
        }
        ;
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u21, 39)) {
      return DeprecatedToken.quoted();
    }
    else {
      return DeprecatedToken.text();
    }
    ;
  }

  static isIdent(ch) {
    return ((sys.ObjUtil.compareGE(ch, 97) && sys.ObjUtil.compareLE(ch, 122)) || (sys.ObjUtil.compareGE(ch, 65) && sys.ObjUtil.compareLE(ch, 90)) || (sys.ObjUtil.compareGE(ch, 48) && sys.ObjUtil.compareLE(ch, 57)) || sys.ObjUtil.equals(ch, 95));
  }

  lookahead(n) {
    return ((this$) => { if (sys.ObjUtil.compareLT(sys.Int.plus(this$.#cur, n), sys.Str.size(this$.#origSql))) return sys.Str.get(this$.#origSql, sys.Int.plus(this$.#cur, n)); return -1; })(this);
  }

}

class DeprecatedToken extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DeprecatedToken.type$; }

  static text() { return DeprecatedToken.vals().get(0); }

  static param() { return DeprecatedToken.vals().get(1); }

  static escapedVar() { return DeprecatedToken.vals().get(2); }

  static quoted() { return DeprecatedToken.vals().get(3); }

  static end() { return DeprecatedToken.vals().get(4); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new DeprecatedToken();
    DeprecatedToken.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(DeprecatedToken.type$, DeprecatedToken.vals(), name$, checked);
  }

  static vals() {
    if (DeprecatedToken.#vals == null) {
      DeprecatedToken.#vals = sys.List.make(DeprecatedToken.type$, [
        DeprecatedToken.make(0, "text", ),
        DeprecatedToken.make(1, "param", ),
        DeprecatedToken.make(2, "escapedVar", ),
        DeprecatedToken.make(3, "quoted", ),
        DeprecatedToken.make(4, "end", ),
      ]).toImmutable();
    }
    return DeprecatedToken.#vals;
  }

  static static$init() {
    const $_u23 = DeprecatedToken.vals();
    if (true) {
    }
    ;
    return;
  }

}

class SqlConn {
  constructor() {
    const this$ = this;
  }

  typeof() { return SqlConn.type$; }

  #autoCommit = false;

  autoCommit(it) {
    if (it === undefined) {
    }
    else {
    }
  }

  static open(uri,username,password) {
    return SqlConnImpl.openDefault(uri, username, password);
  }

}

class SqlConnImpl extends sys.Obj {
  constructor() {
    super();
    this.peer = new SqlConnImplPeer(this);
    const this$ = this;
    return;
  }

  typeof() { return SqlConnImpl.type$; }

  autoCommit(it) {
    if (it === undefined) return this.peer.autoCommit(this);
    this.peer.autoCommit(this, it);
  }

  #stash$Store = undefined;

  // private field reflection only
  __stash$Store(it) { if (it === undefined) return this.#stash$Store; else this.#stash$Store = it; }

  static make() {
    const $self = new SqlConnImpl();
    SqlConnImpl.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  static openDefault(uri,username,password) {
    return SqlConnImplPeer.openDefault(uri,username,password);
  }

  static debugDrivers() {
    return SqlConnImplPeer.debugDrivers();
  }

  static printDebugDrivers() {
    sys.ObjUtil.echo();
    sys.ObjUtil.echo(SqlConnImpl.debugDrivers());
    return;
  }

  close() {
    return this.peer.close(this);
  }

  isClosed() {
    return this.peer.isClosed(this);
  }

  meta() {
    return this.peer.meta(this);
  }

  sql(sql) {
    return Statement.make(this, sql);
  }

  stash() {
    if (this.#stash$Store === undefined) {
      this.#stash$Store = this.stash$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#stash$Store, sys.Type.find("[sys::Str:sys::Obj?]"));
  }

  commit() {
    return this.peer.commit(this);
  }

  rollback() {
    return this.peer.rollback(this);
  }

  stash$Once() {
    return sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
  }

}

class TestSqlConn extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return TestSqlConn.type$; }

  static #idCounter = undefined;

  static idCounter() {
    if (TestSqlConn.#idCounter === undefined) {
      TestSqlConn.static$init();
      if (TestSqlConn.#idCounter === undefined) TestSqlConn.#idCounter = null;
    }
    return TestSqlConn.#idCounter;
  }

  #id = 0;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #autoCommit = false;

  autoCommit(it) {
    if (it === undefined) {
      return this.#autoCommit;
    }
    else {
      this.#autoCommit = it;
      return;
    }
  }

  #closed = false;

  // private field reflection only
  __closed(it) { if (it === undefined) return this.#closed; else this.#closed = it; }

  #stash$Store = undefined;

  // private field reflection only
  __stash$Store(it) { if (it === undefined) return this.#stash$Store; else this.#stash$Store = it; }

  static make() {
    const $self = new TestSqlConn();
    TestSqlConn.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    $self.#id = TestSqlConn.idCounter().getAndIncrement();
    return;
  }

  close() {
    return ((this$) => { let $_u24 = true; this$.#closed = $_u24; return $_u24; })(this);
  }

  isClosed() {
    return this.#closed;
  }

  meta() {
    throw sys.Err.make();
  }

  sql(sql) {
    throw sys.Err.make();
  }

  commit() {
    return;
  }

  rollback() {
    return;
  }

  stash() {
    if (this.#stash$Store === undefined) {
      this.#stash$Store = this.stash$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#stash$Store, sys.Type.find("[sys::Str:sys::Obj?]"));
  }

  toStr() {
    return sys.Str.plus("TestSqlConn-", sys.ObjUtil.coerce(this.#id, sys.Obj.type$.toNullable()));
  }

  stash$Once() {
    return sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
  }

  static static$init() {
    TestSqlConn.#idCounter = concurrent.AtomicInt.make();
    return;
  }

}

class SqlErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SqlErr.type$; }

  static make(msg,cause) {
    const $self = new SqlErr();
    SqlErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.ObjUtil.coerce(msg, sys.Str.type$), cause);
    return;
  }

}

class TokenizerTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TokenizerTest.type$; }

  test() {
    const this$ = this;
    this.doVerify("", "", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("x", "x", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@a", "?", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@a @b @a", "? ? ?", sys.Map.__fromLiteral(["a","b"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())]),sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@a @b @a @a @c", "? ? ? ? ?", sys.Map.__fromLiteral(["a","b","c"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable())]),sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())]),sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@", "@", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@@ x", "@@ x", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("-@a-", "-?-", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@a@>-@a@@@>", "?@>-?@@@>", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("'x'@a", "'x'?", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("'x'y@a", "'x'y?", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@a'@b'", "?'@b'", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("x'123'@a", "x'123'?", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("\\@b", "@b", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("\\\\", "\\", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("\\@\\\\\\@", "@\\@", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@a\\@b", "?@b", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@a\\@\\@b", "?@@b", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("\\@b@a", "@b?", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("x\\@b@a", "x@b?", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("x\\@b'123'@a", "x@b'123'?", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.verifyErr(SqlErr.type$, (it) => {
      let p = Tokenizer.make("\\^");
      return;
    });
    this.verifyErr(SqlErr.type$, (it) => {
      let p = Tokenizer.make("'");
      return;
    });
    this.verifyErr(SqlErr.type$, (it) => {
      let p = Tokenizer.make("@a'");
      return;
    });
    this.verifyErr(SqlErr.type$, (it) => {
      let p = Tokenizer.make("'x'@a'y");
      return;
    });
    this.doVerify("select * from foo", "select * from foo", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select name, age from farmers where name = @name", "select name, age from farmers where name = ?", sys.Map.__fromLiteral(["name"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select * from foo where @a = 1 or @b = 2 or @a = 3", "select * from foo where ? = 1 or ? = 2 or ? = 3", sys.Map.__fromLiteral(["a","b"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())]),sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select \\@bar", "select @bar", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select \\@bar from foo where @a = 1", "select @bar from foo where ? = 1", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select \\@\\@bar", "select @@bar", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select \\@\\@bar from foo where @a = 1", "select @@bar from foo where ? = 1", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select * from foo where @a \\@> 1", "select * from foo where ? @> 1", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select * from foo where @a \\@\\@ 1", "select * from foo where ? @@ 1", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select 'abc' from foo where @a = 1", "select 'abc' from foo where ? = 1", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select '@x \\@y \\@ \\\\@>' from foo where @a = 1", "select '@x \\@y \\@ \\\\@>' from foo where ? = 1", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    return;
  }

  doVerify(sql,expected,params) {
    let t = Tokenizer.make(sql);
    this.verifyEq(t.sql(), expected);
    this.verifyEq(t.params(), params);
    return;
  }

  static make() {
    const $self = new TokenizerTest();
    TokenizerTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class SqlConnPoolTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SqlConnPoolTest.type$; }

  test() {
    const this$ = this;
    let cp = SqlConnPool.make((it) => {
      it.__uri("test");
      it.__maxConns(2);
      it.__linger(sys.Duration.fromStr("200ms"));
      it.__timeout(sys.Duration.fromStr("300ms"));
      return;
    });
    let ap = concurrent.ActorPool.make();
    let a1 = SqlConnPoolTestActor.make(ap, cp, "a1");
    let a2 = SqlConnPoolTestActor.make(ap, cp, "a2");
    let a3 = SqlConnPoolTestActor.make(ap, cp, "a3");
    let a4 = SqlConnPoolTestActor.make(ap, cp, "a4");
    let actors = sys.List.make(SqlConnPoolTestActor.type$, [a1, a2, a3, a4]);
    let reset = () => {
      actors.each((a) => {
        a.lastName().val(null);
        return;
      });
      return;
    };
    this.verifyPool(cp, actors, 0, 0, sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable(), [null, null, null, null]), sys.Type.find("sys::Str?[]")));
    a1.send(sys.Duration.fromStr("1ms")).get();
    this.verifyPool(cp, actors, 0, 1, sys.List.make(sys.Str.type$.toNullable(), ["0", null, null, null]));
    let f1 = this.execute(a1, sys.Duration.fromStr("50ms"));
    this.verifyPool(cp, actors, 1, 0, sys.List.make(sys.Str.type$.toNullable(), ["0", null, null, null]));
    f1.get();
    sys.Func.call(reset);
    (f1 = this.execute(a1, sys.Duration.fromStr("50ms")));
    let f2 = this.execute(a2, sys.Duration.fromStr("100ms"));
    this.verifyPool(cp, actors, 2, 0, sys.List.make(sys.Str.type$.toNullable(), ["0", "1", null, null]));
    f1.get();
    this.verifyPool(cp, actors, 1, 1, sys.List.make(sys.Str.type$.toNullable(), ["0", "1", null, null]));
    f2.get();
    this.verifyPool(cp, actors, 0, 2, sys.List.make(sys.Str.type$.toNullable(), ["0", "1", null, null]));
    sys.Func.call(reset);
    (f1 = this.execute(a1, sys.Duration.fromStr("50ms")));
    this.verifyPool(cp, actors, 1, 1, sys.List.make(sys.Str.type$.toNullable(), ["1", null, null, null]));
    f1.get();
    this.verifyPool(cp, actors, 0, 2, sys.List.make(sys.Str.type$.toNullable(), ["1", null, null, null]));
    sys.Func.call(reset);
    (f1 = this.execute(a1, sys.Duration.fromStr("50ms")));
    (f2 = this.execute(a2, sys.Duration.fromStr("100ms")));
    let f3 = a3.send(sys.Duration.fromStr("100ms"));
    let f4 = a4.send(sys.Duration.fromStr("100ms"));
    this.verifyPool(cp, actors, 2, 0, sys.List.make(sys.Str.type$.toNullable(), ["1", "0", null, null]));
    this.verifyEq(sys.ObjUtil.coerce(a1.isExecuting(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a2.isExecuting(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a3.isExecuting(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a4.isExecuting(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    f1.get();
    concurrent.Actor.sleep(sys.Duration.fromStr("10ms"));
    this.verifyEq(sys.ObjUtil.coerce(a1.isExecuting(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a2.isExecuting(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(sys.Bool.xor(a3.isExecuting(), a4.isExecuting()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    f2.get();
    concurrent.Actor.sleep(sys.Duration.fromStr("10ms"));
    this.verifyEq(sys.ObjUtil.coerce(a1.isExecuting(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a2.isExecuting(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a3.isExecuting(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a4.isExecuting(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyPool(cp, actors, 2, 0, sys.List.make(sys.Str.type$, ["1", "0", "x", "x"]));
    f3.get();
    f4.get();
    this.verifyPool(cp, actors, 0, 2, sys.List.make(sys.Str.type$, ["1", "0", "x", "x"]));
    sys.Func.call(reset);
    concurrent.Actor.sleep(cp.linger());
    cp.checkLinger();
    this.verifyPool(cp, actors, 0, 0, sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable(), [null, null, null, null]), sys.Type.find("sys::Str?[]")));
    a3.send(sys.Duration.fromStr("1ms")).get();
    this.verifyPool(cp, actors, 0, 1, sys.List.make(sys.Str.type$.toNullable(), [null, null, "2", null]));
    sys.Func.call(reset);
    (f1 = this.execute(a1, cp.timeout().plus(sys.Duration.fromStr("40ms"))));
    (f2 = this.execute(a2, cp.timeout().plus(sys.Duration.fromStr("40ms"))));
    (f3 = a3.send(sys.Duration.fromStr("1sec")));
    (f4 = a4.send(sys.Duration.fromStr("1sec")));
    this.verifyPool(cp, actors, 2, 0, sys.List.make(sys.Str.type$.toNullable(), ["2", "3", null, null]));
    this.verifyErr(sys.TimeoutErr.type$, (it) => {
      f3.get();
      return;
    });
    this.verifyErr(sys.TimeoutErr.type$, (it) => {
      f4.get();
      return;
    });
    sys.Func.call(reset);
    this.verifyEq(sys.ObjUtil.coerce(cp.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    cp.close();
    this.verifyEq(sys.ObjUtil.coerce(cp.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyPool(cp, actors, 0, 0, sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable(), [null, null, null, null]), sys.Type.find("sys::Str?[]")));
    return;
  }

  execute(a,wait) {
    let f = a.send(wait);
    while (!a.isExecuting()) {
      concurrent.Actor.sleep(sys.Duration.fromStr("10ms"));
    }
    ;
    return f;
  }

  verifyPool(cp,actors,inUse,idle,expect) {
    const this$ = this;
    let d = cp.debug();
    let dIdle = this.debugInt(d, "idle");
    let dInUse = this.debugInt(d, "inUse");
    this.verifyEq(sys.ObjUtil.coerce(dIdle, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(idle, sys.Obj.type$.toNullable()), "idle");
    this.verifyEq(sys.ObjUtil.coerce(dInUse, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(inUse, sys.Obj.type$.toNullable()), "inUse");
    actors.each((actor,i) => {
      let e = expect.get(i);
      let a = ((this$) => { let $_u25 = ((this$) => { let $_u26 = actor.lastName().val(); if ($_u26 == null) return null; return sys.ObjUtil.toStr(actor.lastName().val()); })(this$); if ($_u25 != null) return $_u25; return ""; })(this$);
      if (e == null) {
        this$.verifyEq(a, "", actor.name());
      }
      else {
        if (sys.ObjUtil.equals(e, "x")) {
          this$.verify(a != null, actor.name());
        }
        else {
          this$.verify(sys.Str.endsWith(a, sys.Str.plus("-", e)), actor.name());
        }
        ;
      }
      ;
      return;
    });
    return;
  }

  debugInt(d,key) {
    const this$ = this;
    let line = ((this$) => { let $_u27 = sys.Str.splitLines(d).find((it) => {
      return sys.Str.startsWith(sys.Str.trimStart(it), sys.Str.plus(sys.Str.plus("", key), ":"));
    }); if ($_u27 != null) return $_u27; throw sys.Err.make(key); })(this);
    return sys.ObjUtil.coerce(sys.Str.toInt(sys.Str.trim(sys.Str.getRange(line, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sys.Str.index(line, ":"), sys.Int.type$), 1), -1)))), sys.Int.type$);
  }

  static make() {
    const $self = new SqlConnPoolTest();
    SqlConnPoolTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class SqlConnPoolTestActor extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#lastName = concurrent.AtomicRef.make();
    this.#isExecutingRef = concurrent.AtomicBool.make();
    return;
  }

  typeof() { return SqlConnPoolTestActor.type$; }

  #cp = null;

  cp() { return this.#cp; }

  __cp(it) { if (it === undefined) return this.#cp; else this.#cp = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #lastName = null;

  lastName() { return this.#lastName; }

  __lastName(it) { if (it === undefined) return this.#lastName; else this.#lastName = it; }

  #isExecutingRef = null;

  isExecutingRef() { return this.#isExecutingRef; }

  __isExecutingRef(it) { if (it === undefined) return this.#isExecutingRef; else this.#isExecutingRef = it; }

  static make(ap,cp,n) {
    const $self = new SqlConnPoolTestActor();
    SqlConnPoolTestActor.make$($self,ap,cp,n);
    return $self;
  }

  static make$($self,ap,cp,n) {
    concurrent.Actor.make$($self, ap);
    ;
    $self.#cp = cp;
    $self.#name = n;
    return;
  }

  isExecuting() {
    return this.#isExecutingRef.val();
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#name), " isExecuting="), sys.ObjUtil.coerce(this.isExecuting(), sys.Obj.type$.toNullable()));
  }

  receive(msg) {
    const this$ = this;
    let wait = sys.ObjUtil.coerce(msg, sys.Duration.type$);
    this.#cp.execute((c) => {
      this$.#isExecutingRef.val(true);
      this$.#lastName.val(sys.ObjUtil.toStr(c));
      c.stash().set("lastName", this$.#lastName);
      concurrent.Actor.sleep(wait);
      return;
    });
    this.#isExecutingRef.val(false);
    return null;
  }

}

class DeprecatedTokenizerTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DeprecatedTokenizerTest.type$; }

  test() {
    const this$ = this;
    this.doVerify("", "", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("x", "x", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@a", "?", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@a @b @a", "? ? ?", sys.Map.__fromLiteral(["a","b"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())]),sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@a @b @a @a @c", "? ? ? ? ?", sys.Map.__fromLiteral(["a","b","c"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable())]),sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())]),sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@", "@", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@@ x", "@@ x", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("-@a-", "-?-", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@a@>-@a@@@>", "?@>-?@@@>", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("'x'@a", "'x'?", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("'x'y@a", "'x'y?", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@a'@b'", "?'@b'", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("x'123'@a", "x'123'?", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@@b", "@b", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@a@@b", "?@b", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("@@b@a", "@b?", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("x@@b@a", "x@b?", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("x@@b'123'@a", "x@b'123'?", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.verifyErr(SqlErr.type$, (it) => {
      let p = DeprecatedTokenizer.make("@a'");
      return;
    });
    this.verifyErr(SqlErr.type$, (it) => {
      let p = DeprecatedTokenizer.make("'x'@a'y");
      return;
    });
    this.doVerify("select * from foo", "select * from foo", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select name, age from farmers where name = @name", "select name, age from farmers where name = ?", sys.Map.__fromLiteral(["name"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select * from foo where @a = 1 or @b = 2 or @a = 3", "select * from foo where ? = 1 or ? = 2 or ? = 3", sys.Map.__fromLiteral(["a","b"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())]),sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select @@bar", "select @bar", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select @@bar from foo where @a = 1", "select @bar from foo where ? = 1", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select * from foo where @a @> 1", "select * from foo where ? @> 1", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select * from foo where @a @@ 1", "select * from foo where ? @@ 1", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select 'abc' from foo where @a = 1", "select 'abc' from foo where ? = 1", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    this.doVerify("select '@x @@y @@ @>' from foo where @a = 1", "select '@x @@y @@ @>' from foo where ? = 1", sys.Map.__fromLiteral(["a"], [sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Int[]")));
    return;
  }

  doVerify(sql,expected,params) {
    let t = DeprecatedTokenizer.make(sql);
    this.verifyEq(t.sql(), expected);
    this.verifyEq(t.params(), params);
    return;
  }

  static make() {
    const $self = new DeprecatedTokenizerTest();
    DeprecatedTokenizerTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class SqlTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
    this.#user = "fantest";
    this.#pass = "fantest";
    return;
  }

  typeof() { return SqlTest.type$; }

  #db = null;

  db(it) {
    if (it === undefined) {
      return this.#db;
    }
    else {
      this.#db = it;
      return;
    }
  }

  #dbType = null;

  dbType(it) {
    if (it === undefined) {
      return this.#dbType;
    }
    else {
      this.#dbType = it;
      return;
    }
  }

  #uri = null;

  uri(it) {
    if (it === undefined) {
      return this.#uri;
    }
    else {
      this.#uri = it;
      return;
    }
  }

  #user = null;

  user() { return this.#user; }

  __user(it) { if (it === undefined) return this.#user; else this.#user = it; }

  #pass = null;

  pass() { return this.#pass; }

  __pass(it) { if (it === undefined) return this.#pass; else this.#pass = it; }

  test() {
    this.doTest("jdbc:mysql://localhost:3306/fantest");
    this.doTest("jdbc:postgresql://localhost:5432/postgres");
    return;
  }

  doTest(testUri) {
    this.#uri = testUri;
    sys.Log.get("sql").info(sys.Str.plus("SqlTest: testing ", this.#uri));
    this.open();
    try {
      this.verifyMeta();
      this.dropTables();
      this.createTable();
      this.insertTable();
      this.closures();
      this.transactions();
      this.preparedStmts();
      this.executeStmts();
      this.batchExecute();
      this.pool();
      this.mysqlVariable();
    }
    catch ($_u28) {
      $_u28 = sys.Err.make($_u28);
      if ($_u28 instanceof sys.Err) {
        let e = $_u28;
        ;
        throw e;
      }
      else {
        throw $_u28;
      }
    }
    finally {
      this.#db.close();
      this.verify(this.#db.isClosed());
    }
    ;
    return;
  }

  open() {
    this.#db = SqlConn.open(sys.ObjUtil.coerce(this.#uri, sys.Str.type$), this.#user, this.#pass);
    this.verifyEq(sys.ObjUtil.coerce(this.#db.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    if (sys.Str.contains(this.#uri, "mysql")) {
      this.#dbType = DbType.mysql();
    }
    else {
      if (sys.Str.contains(this.#uri, "postgresql")) {
        this.#dbType = DbType.postgres();
      }
      else {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus("Uri '", this.#uri), "' connects to unknown database type"));
      }
      ;
    }
    ;
    return;
  }

  verifyMeta() {
    const this$ = this;
    let debug = false;
    if (debug) {
      sys.ObjUtil.echo("=== SqlMeta ===");
    }
    ;
    let meta = this.#db.meta();
    sys.ObjUtil.typeof(meta).methods().each((m) => {
      if (sys.ObjUtil.compareNE(m.parent(), SqlMeta.type$)) {
        return;
      }
      ;
      if ((m.isCtor() || !m.isPublic())) {
        return;
      }
      ;
      if (sys.ObjUtil.compareGT(m.params().size(), 0)) {
        return;
      }
      ;
      let val = m.callOn(meta, sys.List.make(sys.Obj.type$.toNullable()));
      if (debug) {
        sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus("", m.name()), ": "), val));
      }
      ;
      return;
    });
    return;
  }

  dropTables() {
    this.verifyEq(sys.ObjUtil.coerce(this.#db.meta().tableExists("foo_bar_should_not_exist"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    if (this.#db.meta().tableExists("farmers")) {
      this.#db.sql("drop table farmers").execute();
    }
    ;
    return;
  }

  createTable() {
    const this$ = this;
    if (sys.ObjUtil.equals(this.#dbType, DbType.postgres())) {
      this.#db.sql("create table farmers(\nfarmer_id serial,\nname      varchar(255) not null,\nmarried   bool,\npet       varchar(255),\nss        char(4),\nage       int,\npigs      smallint,\ncows      int,\nducks     bigint,\nheight    float,\nweight    real,\nbigdec    decimal(2,1),\ndt        timestamptz,\nd         date,\nt         time)").execute();
    }
    else {
      this.#db.sql("create table farmers(\nfarmer_id int auto_increment not null,\nname      varchar(255) not null,\nmarried   bit,\npet       varchar(255),\nss        char(4),\nage       tinyint,\npigs      smallint,\ncows      int,\nducks     bigint,\nheight    float,\nweight    double,\nbigdec    decimal(2,1),\ndt        datetime,\nd         date,\nt         time,\nprimary key (farmer_id))\n").execute();
    }
    ;
    let row = this.#db.meta().tableRow("farmers");
    let cols = row.cols();
    this.verifyEq(sys.ObjUtil.coerce(cols.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(15, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(cols.isRO(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(sys.ObjUtil.is(cols, sys.Type.find("sql::Col[]")), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyType(cols, sys.Type.find("sql::Col[]"));
    this.verifyFarmerCols(row);
    this.verifyEq(row.col("foobar", false), null);
    this.verifyErr(sys.ArgErr.type$, (it) => {
      row.col("foobar");
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      row.col("foobar", true);
      return;
    });
    return;
  }

  insertTable() {
    const this$ = this;
    let dt = sys.DateTime.make(2009, sys.Month.dec(), 15, 23, 19, 21);
    let date = sys.Date.fromStr("1972-09-10");
    let time = sys.Time.fromStr("14:31:55");
    let data = sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), "Alice", sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), "Pooh", "abcd", sys.ObjUtil.coerce(21, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(80, sys.Obj.type$.toNullable()), null, sys.ObjUtil.coerce(sys.Float.make(5.3), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(120.0), sys.Obj.type$.toNullable()), sys.Decimal.make(3.2), dt, date, time]), sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), "Brian", sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), "Haley", "1234", sys.ObjUtil.coerce(35, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(99, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.7), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(140.0), sys.Obj.type$.toNullable()), sys.Decimal.make(1.5), dt, date, time]), sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()), "Charlie", null, "Addi", null, null, sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(44, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(7, sys.Obj.type$.toNullable()), null, sys.ObjUtil.coerce(sys.Float.make(6.1), sys.Obj.type$.toNullable()), sys.Decimal.make(2.0), dt, date, time]), sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()), "Donny", sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), null, "wxyz", sys.ObjUtil.coerce(40, sys.Obj.type$.toNullable()), null, null, sys.ObjUtil.coerce(8, sys.Obj.type$.toNullable()), null, null, sys.Decimal.make(5.0), dt, date, time]), sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()), "John", sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), "Berkeley", "5678", sys.ObjUtil.coerce(35, sys.Obj.type$.toNullable()), null, null, sys.ObjUtil.coerce(8, sys.Obj.type$.toNullable()), null, null, sys.Decimal.make(5.7), dt, date, time])]);
    data.each((row) => {
      this$.insertFarmer(row.getRange(sys.Range.make(1, -1)));
      return;
    });
    let rows = this.query("select * from farmers order by farmer_id");
    this.verifyFarmerCols(sys.ObjUtil.coerce(rows.first(), Row.type$));
    this.verifyEq(sys.ObjUtil.coerce(data.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(rows.size(), sys.Obj.type$.toNullable()));
    data.each((d,i) => {
      this$.verifyRow(rows.get(i), d);
      return;
    });
    let farmers = this.#db.sql("select * from farmers order by farmer_id").query();
    this.verifyType(farmers, sys.Type.find("sql::Row[]"));
    this.verifyEq(sys.ObjUtil.coerce(sys.ObjUtil.is(farmers, sys.Type.find("sql::Row[]")), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(sys.ObjUtil.is(farmers.get(0), Row.type$), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    let f = farmers.get(0);
    this.verifyEq(f.trap("farmer_id", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(f.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Alice");
    this.verifyEq(f.trap("married", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(f.trap("pet", sys.List.make(sys.Obj.type$.toNullable(), [])), "Pooh");
    this.verifyEq(f.trap("ss", sys.List.make(sys.Obj.type$.toNullable(), [])), "abcd");
    this.verifyEq(f.trap("age", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(21, sys.Obj.type$.toNullable()));
    this.verifyEq(f.trap("pigs", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(f.trap("cows", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(80, sys.Obj.type$.toNullable()));
    this.verifyEq(f.trap("ducks", sys.List.make(sys.Obj.type$.toNullable(), [])), null);
    this.verifyEq(f.trap("height", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(sys.Float.make(5.3), sys.Obj.type$.toNullable()));
    this.verifyEq(f.trap("weight", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(sys.Float.make(120.0), sys.Obj.type$.toNullable()));
    this.verifyEq(f.trap("bigdec", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Decimal.make(3.2));
    this.verifyEq(f.trap("dt", sys.List.make(sys.Obj.type$.toNullable(), [])), dt);
    this.verifyEq(f.trap("d", sys.List.make(sys.Obj.type$.toNullable(), [])), date);
    this.verifyEq(f.trap("t", sys.List.make(sys.Obj.type$.toNullable(), [])), time);
    this.verifyEq(f.get(sys.ObjUtil.coerce(f.col("name"), Col.type$)), "Alice");
    this.verifyEq(f.get(sys.ObjUtil.coerce(f.col("Name"), Col.type$)), "Alice");
    this.verifyEq(f.get(sys.ObjUtil.coerce(f.col("NAME"), Col.type$)), "Alice");
    this.verifyEq(f.trap("Name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Alice");
    this.verifyEq(f.trap("NAME", sys.List.make(sys.Obj.type$.toNullable(), [])), "Alice");
    this.verifyEq(f.get(sys.ObjUtil.coerce(f.col("pet"), Col.type$)), "Pooh");
    return;
  }

  insertFarmer(row) {
    let s = "insert into farmers (name, married, pet, ss, age, pigs, cows, ducks, height, weight, bigdec, dt, d, t)\nvalues (@name, @married, @pet, @ss, @age, @pigs, @cows, @ducks, @height, @weight, @bigdec, @dt, @d, @t)";
    let stmt = this.#db.sql(s).prepare();
    let keys = sys.ObjUtil.coerce(stmt.execute(sys.Map.__fromLiteral(["name","married","pet","ss","age","pigs","cows","ducks","height","weight","bigdec","dt","d","t"], [row.get(0),row.get(1),row.get(2),row.get(3),row.get(4),row.get(5),row.get(6),row.get(7),row.get(8),row.get(9),row.get(10),row.get(11),row.get(12),row.get(13)], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))), sys.Type.find("sys::Int[]"));
    stmt.close();
    this.verifyEq(sys.ObjUtil.coerce(keys.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.typeof(keys), sys.Type.find("sys::Int[]"));
    (stmt = this.#db.sql("select * from farmers where farmer_id = @farmerId").prepare());
    let farmer = stmt.query(sys.Map.__fromLiteral(["farmerId"], [sys.ObjUtil.coerce(keys.first(), sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int?"))).first();
    stmt.close();
    this.verifyEq(farmer.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), row.get(0));
    return;
  }

  verifyFarmerCols(r) {
    this.verifyEq(sys.ObjUtil.coerce(r.cols().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(15, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.cols().isRO(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    if (sys.ObjUtil.equals(this.#dbType, DbType.postgres())) {
      this.verifyCol(r.cols().get(0), 0, "farmer_id", sys.Int.type$, "SERIAL");
      this.verifyCol(r.cols().get(1), 1, "name", sys.Str.type$, "VARCHAR");
      this.verifyCol(r.cols().get(2), 2, "married", sys.Bool.type$, "BOOL");
      this.verifyCol(r.cols().get(3), 3, "pet", sys.Str.type$, "VARCHAR");
      this.verifyCol(r.cols().get(4), 4, "ss", sys.Str.type$, "BPCHAR");
      this.verifyCol(r.cols().get(5), 5, "age", sys.Int.type$, "int4");
      this.verifyCol(r.cols().get(6), 6, "pigs", sys.Int.type$, "INT2");
      this.verifyCol(r.cols().get(7), 7, "cows", sys.Int.type$, "int4");
      this.verifyCol(r.cols().get(8), 8, "ducks", sys.Int.type$, "INT8");
      this.verifyCol(r.cols().get(9), 9, "height", sys.Float.type$, "FLOAT8");
      this.verifyCol(r.cols().get(10), 10, "weight", sys.Float.type$, "FLOAT4");
      this.verifyCol(r.cols().get(11), 11, "bigdec", sys.Decimal.type$, "NUMERIC");
      this.verifyCol(r.cols().get(12), 12, "dt", sys.DateTime.type$, "TIMESTAMPTZ");
      this.verifyCol(r.cols().get(13), 13, "d", sys.Date.type$, "DATE");
      this.verifyCol(r.cols().get(14), 14, "t", sys.Time.type$, "TIME");
    }
    else {
      this.verifyCol(r.cols().get(0), 0, "farmer_id", sys.Int.type$, "INT");
      this.verifyCol(r.cols().get(1), 1, "name", sys.Str.type$, "VARCHAR");
      this.verifyCol(r.cols().get(2), 2, "married", sys.Bool.type$, "BIT");
      this.verifyCol(r.cols().get(3), 3, "pet", sys.Str.type$, "VARCHAR");
      this.verifyCol(r.cols().get(4), 4, "ss", sys.Str.type$, "CHAR");
      this.verifyCol(r.cols().get(5), 5, "age", sys.Int.type$, "TINYINT");
      this.verifyCol(r.cols().get(6), 6, "pigs", sys.Int.type$, "SMALLINT");
      this.verifyCol(r.cols().get(7), 7, "cows", sys.Int.type$, "INT");
      this.verifyCol(r.cols().get(8), 8, "ducks", sys.Int.type$, "BIGINT");
      this.verifyCol(r.cols().get(9), 9, "height", sys.Float.type$, "FLOAT");
      this.verifyCol(r.cols().get(10), 10, "weight", sys.Float.type$, "DOUBLE");
      this.verifyCol(r.cols().get(11), 11, "bigdec", sys.Decimal.type$, "DECIMAL");
      this.verifyCol(r.cols().get(12), 12, "dt", sys.DateTime.type$, "DATETIME");
      this.verifyCol(r.cols().get(13), 13, "d", sys.Date.type$, "DATE");
      this.verifyCol(r.cols().get(14), 14, "t", sys.Time.type$, "TIME");
    }
    ;
    return;
  }

  closures() {
    const this$ = this;
    let ages = sys.List.make(sys.Int.type$.toNullable());
    this.#db.sql("select age from farmers").query().each((row) => {
      ages.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.trap(row,"age", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()));
      return;
    });
    let ages2 = sys.List.make(sys.Int.type$.toNullable());
    this.#db.sql("select name, age from farmers").queryEach(null, (row) => {
      if (sys.ObjUtil.trap(row,"age", sys.List.make(sys.Obj.type$.toNullable(), [])) != null) {
        ages2.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Int.plus(sys.ObjUtil.coerce(sys.ObjUtil.trap(row,"age", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$), 10), sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()));
      }
      else {
        ages2.add(null);
      }
      ;
      return;
    });
    ages.each((age,i) => {
      if (age != null) {
        this$.verifyEq(sys.ObjUtil.coerce(sys.Int.plus(sys.ObjUtil.coerce(age, sys.Int.type$), 10), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(ages2.get(i), sys.Obj.type$.toNullable()));
      }
      ;
      return;
    });
    ages.clear();
    ages2.clear();
    this.#db.sql("select age from farmers where age > 30").query().each((row) => {
      ages.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.trap(row,"age", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()));
      return;
    });
    let stmt = this.#db.sql("select age from farmers where age > @age").prepare();
    stmt.queryEach(sys.Map.__fromLiteral(["age"], [sys.ObjUtil.coerce(30, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")), (row) => {
      if (sys.ObjUtil.trap(row,"age", sys.List.make(sys.Obj.type$.toNullable(), [])) != null) {
        sys.ObjUtil.trap(row,"age", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(sys.Int.plus(sys.ObjUtil.coerce(sys.ObjUtil.trap(row,"age", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$), 10), sys.Obj.type$.toNullable())]));
      }
      ;
      ages2.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.trap(row,"age", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()));
      return;
    });
    ages.each((age,i) => {
      if (age != null) {
        this$.verifyEq(sys.ObjUtil.coerce(sys.Int.plus(sys.ObjUtil.coerce(age, sys.Int.type$), 10), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(ages2.get(i), sys.Obj.type$.toNullable()));
      }
      ;
      return;
    });
    let i = 0;
    this.#db.sql("select * from farmers").queryEach(null, (row) => {
      if (sys.ObjUtil.compareNE(i, 0)) {
        return;
      }
      ;
      this$.verifyEq(sys.ObjUtil.coerce(row.cols().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(Farmer.type$.fields().size(), sys.Obj.type$.toNullable()));
      Farmer.type$.fields().each((f,index) => {
        let col = row.col(f.name());
        this$.verify(col != null);
        if (sys.ObjUtil.equals(f.name(), "farmer_id")) {
          this$.verifyEq(col.type(), sys.Int.type$);
        }
        ;
        if (sys.ObjUtil.equals(f.name(), "married")) {
          this$.verifyEq(col.type(), sys.Bool.type$);
        }
        ;
        if (sys.ObjUtil.equals(f.name(), "pet")) {
          this$.verifyEq(col.type(), sys.Str.type$);
        }
        ;
        if (sys.ObjUtil.equals(f.name(), "height")) {
          this$.verifyEq(col.type(), sys.Float.type$);
        }
        ;
        return;
      });
      ((this$) => { let $_u29 = i;i = sys.Int.increment(i); return $_u29; })(this$);
      return;
    });
    this.verifyEq(this.#db.sql("select * from farmers").queryEachWhile(null, (row) => {
      return ((this$) => { if (sys.ObjUtil.equals(row.trap("age", sys.List.make(sys.Obj.type$.toNullable(), [])), 40)) return row.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])); return null; })(this$);
    }), "Donny");
    this.verifyEq(this.#db.sql("select * from farmers").queryEachWhile(null, (row) => {
      return ((this$) => { if (sys.ObjUtil.equals(row.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Frodo")) return row.trap("age", sys.List.make(sys.Obj.type$.toNullable(), [])); return null; })(this$);
    }), null);
    return;
  }

  transactions() {
    this.verifyEq(sys.ObjUtil.coerce(this.#db.autoCommit(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.#db.autoCommit(false);
    this.verifyEq(sys.ObjUtil.coerce(this.#db.autoCommit(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.#db.commit();
    let rows = this.query("select name from farmers order by name");
    this.verifyEq(sys.ObjUtil.coerce(rows.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    this.verifyEq(rows.get(0).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Alice");
    this.verifyEq(rows.get(1).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Brian");
    this.verifyEq(rows.get(2).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Charlie");
    this.verifyEq(rows.get(3).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Donny");
    this.verifyEq(rows.get(4).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "John");
    this.insertFarmer(sys.List.make(sys.Obj.type$.toNullable(), ["Bad", sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), "Bad", "bad!", sys.ObjUtil.coerce(21, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(80, sys.Obj.type$.toNullable()), null, sys.ObjUtil.coerce(sys.Float.make(5.3), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(120.0), sys.Obj.type$.toNullable()), sys.Decimal.make(7.7), sys.DateTime.now(), sys.Date.today(), sys.Time.now()]));
    this.#db.rollback();
    (rows = this.query("select name from farmers order by name"));
    this.verifyEq(sys.ObjUtil.coerce(rows.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    this.verifyEq(rows.get(0).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Alice");
    this.verifyEq(rows.get(1).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Brian");
    this.verifyEq(rows.get(2).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Charlie");
    this.verifyEq(rows.get(3).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Donny");
    this.verifyEq(rows.get(4).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "John");
    return;
  }

  preparedStmts() {
    const this$ = this;
    let stmt = this.#db.sql("select name, age from farmers where name = @name").prepare();
    let result = stmt.query(sys.Map.__fromLiteral(["name"], ["Alice"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyEq(result.get(0).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Alice");
    (result = stmt.query(sys.Map.__fromLiteral(["name"], ["Brian"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(result.get(0).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Brian");
    (result = stmt.query(sys.Map.__fromLiteral(["name"], ["Charlie"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(result.get(0).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Charlie");
    (result = stmt.query(sys.Map.__fromLiteral(["name"], ["Donny"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(result.get(0).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Donny");
    (result = stmt.query(sys.Map.__fromLiteral(["name"], ["John"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(result.get(0).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "John");
    stmt.close();
    (stmt = this.#db.sql("select name, age from farmers where age > @age").prepare());
    (result = stmt.query(sys.Map.__fromLiteral(["age"], [sys.ObjUtil.coerce(30, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int"))));
    this.verifyEq(sys.ObjUtil.coerce(result.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    result.each((row) => {
      this$.verify(sys.ObjUtil.compareGT(result.get(0).trap("age", sys.List.make(sys.Obj.type$.toNullable(), [])), 30), sys.Str.plus(sys.ObjUtil.toStr(result.get(0).trap("age", sys.List.make(sys.Obj.type$.toNullable(), []))), " <= 30"));
      return;
    });
    stmt.close();
    (stmt = this.#db.sql("select name, age from farmers where name = @name and age = @age").prepare());
    (result = stmt.query(sys.Map.__fromLiteral(["name","age"], ["John",sys.ObjUtil.coerce(35, sys.Obj.type$)], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))));
    this.verifyEq(sys.ObjUtil.coerce(result.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(result.get(0).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "John");
    this.verifyEq(result.get(0).trap("age", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(35, sys.Obj.type$.toNullable()));
    stmt.close();
    (stmt = this.#db.sql("select name as x, age as y from farmers where name = @name").prepare());
    (result = stmt.query(sys.Map.__fromLiteral(["name"], ["Alice"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(result.get(0).trap("x", sys.List.make(sys.Obj.type$.toNullable(), [])), "Alice");
    this.verifyEq(result.get(0).trap("y", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(21, sys.Obj.type$.toNullable()));
    (stmt = this.#db.sql("select name from farmers"));
    this.verifyEq(sys.ObjUtil.coerce(stmt.query().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(stmt.limit(), sys.Obj.type$.toNullable()), null);
    stmt.limit(sys.ObjUtil.coerce(3, sys.Int.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(stmt.limit(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(stmt.query().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    stmt.limit(null);
    this.verifyEq(sys.ObjUtil.coerce(stmt.limit(), sys.Obj.type$.toNullable()), null);
    this.verifyEq(sys.ObjUtil.coerce(stmt.query().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    return;
  }

  executeStmts() {
    const this$ = this;
    let r = this.#db.sql("update farmers set pet='Pepper' where ducks=8").execute();
    this.verifyEq(r, sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    (r = this.#db.sql("select name, pet from farmers").execute());
    this.verifyEq(sys.ObjUtil.typeof(r), sys.Type.find("sql::Row[]"));
    let rows = sys.ObjUtil.as(r, sys.Type.find("sql::Row[]"));
    rows.sort((a,b) => {
      return sys.ObjUtil.compare(a.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), b.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])));
    });
    this.verifyEq(rows.get(3).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "Donny");
    this.verifyEq(rows.get(3).trap("pet", sys.List.make(sys.Obj.type$.toNullable(), [])), "Pepper");
    this.verifyEq(rows.get(4).trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "John");
    this.verifyEq(rows.get(4).trap("pet", sys.List.make(sys.Obj.type$.toNullable(), [])), "Pepper");
    return;
  }

  batchExecute() {
    const this$ = this;
    let params = sys.List.make(sys.Type.find("[sys::Str:sys::Obj]"));
    let stmt = this.#db.sql("select farmer_id from farmers");
    stmt.queryEach(null, (r) => {
      params.add(sys.Map.__fromLiteral(["farmerId"], [sys.ObjUtil.coerce(r.trap("farmer_id", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Obj.type$)], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
      return;
    });
    (stmt = this.#db.sql("update farmers set age = farmer_id * farmer_id\nwhere farmer_id = @farmerId"));
    this.verifyErr(SqlErr.type$, (it) => {
      stmt.executeBatch(params);
      return;
    });
    stmt.prepare();
    let res = stmt.executeBatch(params);
    this.verifyEq(res, sys.List.make(sys.Int.type$).fill(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), params.size()));
    this.#db.commit();
    (stmt = this.#db.sql("select farmer_id, age from farmers"));
    stmt.queryEach(null, (r) => {
      let id = sys.ObjUtil.coerce(r.trap("farmer_id", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$);
      let age = sys.ObjUtil.coerce(r.trap("age", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$);
      this$.verifyEq(sys.ObjUtil.coerce(sys.Int.mult(id, id), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(age, sys.Obj.type$.toNullable()));
      return;
    });
    return;
  }

  pool() {
    const this$ = this;
    let pool = TestPool.make((it) => {
      it.__uri(sys.ObjUtil.coerce(this$.#uri, sys.Str.type$));
      it.__username(this$.#user);
      it.__password(this$.#pass);
      return;
    });
    pool.execute((c) => {
      return;
    });
    pool.close();
    return;
  }

  mysqlVariable() {
    if (sys.ObjUtil.compareNE(this.#dbType, DbType.mysql())) {
      return;
    }
    ;
    this.#db.sql("set @v1 = 42").execute();
    if (sys.ObjUtil.equals(sys.ObjUtil.typeof(this).pod().config("deprecatedEscape"), "true")) {
      let stmt = this.#db.sql("select name, @@v1 from farmers where farmer_id = @farmerId");
      stmt.prepare();
      let rows = stmt.query(sys.Map.__fromLiteral(["farmerId"], [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")));
      this.verifyEq(sys.ObjUtil.coerce(rows.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
      let r = rows.get(0);
      this.verifyEq(r.get(sys.ObjUtil.coerce(r.col("name"), Col.type$)), "Alice");
      this.verifyEq(r.get(sys.ObjUtil.coerce(r.col("@v1"), Col.type$)), sys.ObjUtil.coerce(42, sys.Obj.type$.toNullable()));
    }
    else {
      let stmt = this.#db.sql("select name, \\@v1 from farmers where farmer_id = @farmerId");
      stmt.prepare();
      let rows = stmt.query(sys.Map.__fromLiteral(["farmerId"], [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")));
      this.verifyEq(sys.ObjUtil.coerce(rows.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
      let r = rows.get(0);
      this.verifyEq(r.get(sys.ObjUtil.coerce(r.col("name"), Col.type$)), "Alice");
      this.verifyEq(r.get(sys.ObjUtil.coerce(r.col("@v1"), Col.type$)), sys.ObjUtil.coerce(42, sys.Obj.type$.toNullable()));
    }
    ;
    return;
  }

  query(sql) {
    let rows = sys.ObjUtil.coerce(this.#db.sql(sql).query(), sys.Type.find("sql::Row[]"));
    return rows;
  }

  execute(sql) {
    return this.#db.sql(sql).execute();
  }

  verifyCol(col,index,name,type,sqlType) {
    this.verifyEq(sys.ObjUtil.coerce(col.index(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(index, sys.Obj.type$.toNullable()));
    this.verifyEq(col.name(), name);
    this.verifySame(col.type(), type);
    if (sys.ObjUtil.equals(sqlType, "INT")) {
      this.verify((sys.ObjUtil.equals(sys.Str.upper(col.sqlType()), "INT") || sys.ObjUtil.equals(sys.Str.upper(col.sqlType()), "INTEGER")), col.sqlType());
    }
    else {
      this.verifyEq(sys.Str.upper(col.sqlType()), sys.Str.upper(sqlType));
    }
    ;
    return;
  }

  verifyRow(r,cells) {
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(r.cols().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(cells.size(), sys.Obj.type$.toNullable()));
    r.cols().each((c,i) => {
      this$.verifyEq(r.get(c), cells.get(i));
      return;
    });
    return;
  }

  static make() {
    const $self = new SqlTest();
    SqlTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    ;
    return;
  }

}

class Farmer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Farmer.type$; }

  #farmer_id = 0;

  farmer_id(it) {
    if (it === undefined) {
      return this.#farmer_id;
    }
    else {
      this.#farmer_id = it;
      return;
    }
  }

  #name = null;

  name(it) {
    if (it === undefined) {
      return this.#name;
    }
    else {
      this.#name = it;
      return;
    }
  }

  #married = false;

  married(it) {
    if (it === undefined) {
      return this.#married;
    }
    else {
      this.#married = it;
      return;
    }
  }

  #pet = null;

  pet(it) {
    if (it === undefined) {
      return this.#pet;
    }
    else {
      this.#pet = it;
      return;
    }
  }

  #ss = null;

  ss(it) {
    if (it === undefined) {
      return this.#ss;
    }
    else {
      this.#ss = it;
      return;
    }
  }

  #age = 0;

  age(it) {
    if (it === undefined) {
      return this.#age;
    }
    else {
      this.#age = it;
      return;
    }
  }

  #pigs = null;

  pigs(it) {
    if (it === undefined) {
      return this.#pigs;
    }
    else {
      this.#pigs = it;
      return;
    }
  }

  #cows = null;

  cows(it) {
    if (it === undefined) {
      return this.#cows;
    }
    else {
      this.#cows = it;
      return;
    }
  }

  #ducks = null;

  ducks(it) {
    if (it === undefined) {
      return this.#ducks;
    }
    else {
      this.#ducks = it;
      return;
    }
  }

  #height = sys.Float.make(0);

  height(it) {
    if (it === undefined) {
      return this.#height;
    }
    else {
      this.#height = it;
      return;
    }
  }

  #weight = sys.Float.make(0);

  weight(it) {
    if (it === undefined) {
      return this.#weight;
    }
    else {
      this.#weight = it;
      return;
    }
  }

  #bigdec = null;

  bigdec(it) {
    if (it === undefined) {
      return this.#bigdec;
    }
    else {
      this.#bigdec = it;
      return;
    }
  }

  #dt = null;

  dt(it) {
    if (it === undefined) {
      return this.#dt;
    }
    else {
      this.#dt = it;
      return;
    }
  }

  #d = null;

  d(it) {
    if (it === undefined) {
      return this.#d;
    }
    else {
      this.#d = it;
      return;
    }
  }

  #t = null;

  t(it) {
    if (it === undefined) {
      return this.#t;
    }
    else {
      this.#t = it;
      return;
    }
  }

  static make() {
    const $self = new Farmer();
    Farmer.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DbType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DbType.type$; }

  static mysql() { return DbType.vals().get(0); }

  static postgres() { return DbType.vals().get(1); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new DbType();
    DbType.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(DbType.type$, DbType.vals(), name$, checked);
  }

  static vals() {
    if (DbType.#vals == null) {
      DbType.#vals = sys.List.make(DbType.type$, [
        DbType.make(0, "mysql", ),
        DbType.make(1, "postgres", ),
      ]).toImmutable();
    }
    return DbType.#vals;
  }

  static static$init() {
    const $_u32 = DbType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class TestPool extends SqlConnPool {
  constructor() {
    super();
    this.peer = new SqlConnPoolPeer(this);
    const this$ = this;
  }

  typeof() { return TestPool.type$; }

  static make(f) {
    const $self = new TestPool();
    TestPool.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    SqlConnPool.make$($self, sys.ObjUtil.coerce(f, sys.Type.find("|sql::SqlConnPool->sys::Void|?")));
    return;
  }

  onOpen(c) {
    if (!c.stash().isEmpty()) {
      throw sys.Err.make("test failure");
    }
    ;
    c.stash().set("foo", sys.ObjUtil.coerce(42, sys.Obj.type$.toNullable()));
    return;
  }

  onClose(c) {
    if (sys.ObjUtil.compareNE(c.stash().get("foo"), 42)) {
      throw sys.Err.make("test failure");
    }
    ;
    return;
  }

}

const p = sys.Pod.add$('sql');
const xp = sys.Param.noParams$();
let m;
SqlMeta.type$ = p.at$('SqlMeta','sys::Obj',[],{},8192,SqlMeta);
Col.type$ = p.at$('Col','sys::Obj',[],{},8194,Col);
Tokenizer.type$ = p.at$('Tokenizer','sys::Obj',[],{},128,Tokenizer);
Token.type$ = p.at$('Token','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},170,Token);
SqlConnPool.type$ = p.at$('SqlConnPool','sys::Obj',[],{},8194,SqlConnPool);
Statement.type$ = p.at$('Statement','sys::Obj',[],{},8192,Statement);
Row.type$ = p.at$('Row','sys::Obj',[],{},8192,Row);
DeprecatedTokenizer.type$ = p.at$('DeprecatedTokenizer','sys::Obj',[],{},128,DeprecatedTokenizer);
DeprecatedToken.type$ = p.at$('DeprecatedToken','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},170,DeprecatedToken);
SqlConn.type$ = p.am$('SqlConn','sys::Obj',[],{},8449,SqlConn);
SqlConnImpl.type$ = p.at$('SqlConnImpl','sys::Obj',['sql::SqlConn'],{'sys::NoDoc':""},8192,SqlConnImpl);
TestSqlConn.type$ = p.at$('TestSqlConn','sys::Obj',['sql::SqlConn'],{'sys::NoDoc':""},128,TestSqlConn);
SqlErr.type$ = p.at$('SqlErr','sys::Err',[],{},8194,SqlErr);
TokenizerTest.type$ = p.at$('TokenizerTest','sys::Test',[],{},8192,TokenizerTest);
SqlConnPoolTest.type$ = p.at$('SqlConnPoolTest','sys::Test',[],{},8192,SqlConnPoolTest);
SqlConnPoolTestActor.type$ = p.at$('SqlConnPoolTestActor','concurrent::Actor',[],{},130,SqlConnPoolTestActor);
DeprecatedTokenizerTest.type$ = p.at$('DeprecatedTokenizerTest','sys::Test',[],{},8192,DeprecatedTokenizerTest);
SqlTest.type$ = p.at$('SqlTest','sys::Test',[],{},8192,SqlTest);
Farmer.type$ = p.at$('Farmer','sys::Obj',[],{},128,Farmer);
DbType.type$ = p.at$('DbType','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},170,DbType);
TestPool.type$ = p.at$('TestPool','sql::SqlConnPool',[],{},130,TestPool);
SqlMeta.type$.am$('make',132,'sys::Void',xp,{}).am$('productName',8704,'sys::Str',xp,{}).am$('productVersion',8704,'sys::Version',xp,{}).am$('productVersionStr',8704,'sys::Str',xp,{}).am$('driverName',8704,'sys::Str',xp,{}).am$('driverVersion',8704,'sys::Version',xp,{}).am$('driverVersionStr',8704,'sys::Str',xp,{}).am$('maxColName',8704,'sys::Int?',xp,{}).am$('maxTableName',8704,'sys::Int?',xp,{}).am$('tableExists',8704,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('tableName','sys::Str',false)]),{}).am$('tables',8704,'sys::Str[]',xp,{}).am$('tableRow',8704,'sql::Row',sys.List.make(sys.Param.type$,[new sys.Param('tableName','sys::Str',false)]),{});
Col.type$.af$('index',73730,'sys::Int',{}).af$('name',73730,'sys::Str',{}).af$('type',73730,'sys::Type',{}).af$('sqlType',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false),new sys.Param('name','sys::Str',false),new sys.Param('type','sys::Type',false),new sys.Param('sqlType','sys::Str',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
Tokenizer.type$.af$('origSql',67584,'sys::Str',{}).af$('cur',67584,'sys::Int',{}).af$('numParams',67584,'sys::Int',{}).af$('sqlBuf',67584,'sys::StrBuf',{}).af$('sql',65664,'sys::Str?',{}).af$('params',65664,'[sys::Str:sys::Int[]]',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('origSql','sys::Str',false)]),{}).am$('text',2048,'sql::Token',xp,{}).am$('param',2048,'sql::Token',xp,{}).am$('escape',2048,'sql::Token',xp,{}).am$('quoted',2048,'sql::Token',xp,{}).am$('nextToken',2048,'sql::Token',xp,{}).am$('isIdent',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ch','sys::Int',false)]),{}).am$('lookahead',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false)]),{});
Token.type$.af$('text',106506,'sql::Token',{}).af$('param',106506,'sql::Token',{}).af$('escape',106506,'sql::Token',{}).af$('quoted',106506,'sql::Token',{}).af$('end',106506,'sql::Token',{}).af$('vals',106498,'sql::Token[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'sql::Token?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
SqlConnPool.type$.af$('uri',73730,'sys::Str',{}).af$('username',73730,'sys::Str?',{}).af$('password',73730,'sys::Str?',{}).af$('maxConns',73730,'sys::Int',{}).af$('timeout',73730,'sys::Duration',{}).af$('linger',73730,'sys::Duration',{}).af$('log',73730,'sys::Log',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',false)]),{}).am$('onOpen',266240,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','sql::SqlConn',false)]),{}).am$('onClose',266240,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','sql::SqlConn',false)]),{}).am$('execute',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sql::SqlConn->sys::Void|',false)]),{}).am$('checkLinger',8704,'sys::Void',xp,{}).am$('isClosed',8704,'sys::Bool',xp,{}).am$('close',8704,'sys::Void',xp,{}).am$('debug',8704,'sys::Str',xp,{'sys::NoDoc':""});
Statement.type$.af$('conn',65664,'sql::SqlConnImpl',{}).af$('sql',73730,'sys::Str',{}).af$('limit',8704,'sys::Int?',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','sql::SqlConnImpl',false),new sys.Param('sql','sys::Str',false)]),{}).am$('init',2560,'sys::Void',xp,{}).am$('prepare',8704,'sys::This',xp,{}).am$('query',8704,'sql::Row[]',sys.List.make(sys.Param.type$,[new sys.Param('params','[sys::Str:sys::Obj]?',true)]),{}).am$('queryEach',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('params','[sys::Str:sys::Obj]?',false),new sys.Param('eachFunc','|sql::Row->sys::Void|',false)]),{}).am$('queryEachWhile',8704,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('params','[sys::Str:sys::Obj]?',false),new sys.Param('eachFunc','|sql::Row->sys::Obj?|',false)]),{}).am$('execute',8704,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('params','[sys::Str:sys::Obj]?',true)]),{}).am$('executeBatch',8704,'sys::Int?[]',sys.List.make(sys.Param.type$,[new sys.Param('paramsList','[sys::Str:sys::Obj]?[]',false)]),{}).am$('more',8704,'sql::Row[]?',xp,{'sys::NoDoc':""}).am$('close',8704,'sys::Void',xp,{});
Row.type$.am$('cols',8704,'sql::Col[]',xp,{}).am$('col',8704,'sql::Col?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('get',8704,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('col','sql::Col',false)]),{'sys::Operator':""}).am$('set',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('col','sql::Col',false),new sys.Param('val','sys::Obj?',false)]),{'sys::Operator':""}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
DeprecatedTokenizer.type$.af$('origSql',67584,'sys::Str',{}).af$('cur',67584,'sys::Int',{}).af$('numParams',67584,'sys::Int',{}).af$('sqlBuf',67584,'sys::StrBuf',{}).af$('sql',65664,'sys::Str?',{}).af$('params',65664,'[sys::Str:sys::Int[]]',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('origSql','sys::Str',false)]),{}).am$('text',2048,'sql::DeprecatedToken',xp,{}).am$('param',2048,'sql::DeprecatedToken',xp,{}).am$('escapedVar',2048,'sql::DeprecatedToken',xp,{}).am$('quoted',2048,'sql::DeprecatedToken',xp,{}).am$('nextToken',2048,'sql::DeprecatedToken',xp,{}).am$('isIdent',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ch','sys::Int',false)]),{}).am$('lookahead',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false)]),{});
DeprecatedToken.type$.af$('text',106506,'sql::DeprecatedToken',{}).af$('param',106506,'sql::DeprecatedToken',{}).af$('escapedVar',106506,'sql::DeprecatedToken',{}).af$('quoted',106506,'sql::DeprecatedToken',{}).af$('end',106506,'sql::DeprecatedToken',{}).af$('vals',106498,'sql::DeprecatedToken[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'sql::DeprecatedToken?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
SqlConn.type$.af$('autoCommit',270337,'sys::Bool',{}).am$('open',40962,'sql::SqlConn',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Str',false),new sys.Param('username','sys::Str?',false),new sys.Param('password','sys::Str?',false)]),{}).am$('close',270337,'sys::Bool',xp,{}).am$('isClosed',270337,'sys::Bool',xp,{}).am$('stash',270337,'[sys::Str:sys::Obj?]',xp,{}).am$('meta',270337,'sql::SqlMeta',xp,{}).am$('sql',270337,'sql::Statement',sys.List.make(sys.Param.type$,[new sys.Param('sql','sys::Str',false)]),{}).am$('commit',270337,'sys::Void',xp,{}).am$('rollback',270337,'sys::Void',xp,{});
SqlConnImpl.type$.af$('autoCommit',271872,'sys::Bool',{}).af$('stash$Store',722944,'sys::Obj?',{}).am$('make',132,'sys::Void',xp,{}).am$('openDefault',41474,'sql::SqlConn',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Str',false),new sys.Param('username','sys::Str?',false),new sys.Param('password','sys::Str?',false)]),{}).am$('debugDrivers',41474,'sys::Str',xp,{'sys::NoDoc':""}).am$('printDebugDrivers',40962,'sys::Void',xp,{'sys::NoDoc':""}).am$('close',271872,'sys::Bool',xp,{}).am$('isClosed',271872,'sys::Bool',xp,{}).am$('meta',271872,'sql::SqlMeta',xp,{}).am$('sql',271360,'sql::Statement',sys.List.make(sys.Param.type$,[new sys.Param('sql','sys::Str',false)]),{}).am$('stash',795648,'[sys::Str:sys::Obj?]',xp,{}).am$('commit',271872,'sys::Void',xp,{}).am$('rollback',271872,'sys::Void',xp,{}).am$('stash$Once',133120,'[sys::Str:sys::Obj?]',xp,{});
TestSqlConn.type$.af$('idCounter',106498,'concurrent::AtomicInt',{}).af$('id',73730,'sys::Int',{}).af$('autoCommit',336896,'sys::Bool',{}).af$('closed',67584,'sys::Bool',{}).af$('stash$Store',722944,'sys::Obj?',{}).am$('make',132,'sys::Void',xp,{}).am$('close',271360,'sys::Bool',xp,{}).am$('isClosed',271360,'sys::Bool',xp,{}).am$('meta',271360,'sql::SqlMeta',xp,{}).am$('sql',271360,'sql::Statement',sys.List.make(sys.Param.type$,[new sys.Param('sql','sys::Str',false)]),{}).am$('commit',271360,'sys::Void',xp,{}).am$('rollback',271360,'sys::Void',xp,{}).am$('stash',795648,'[sys::Str:sys::Obj?]',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('stash$Once',133120,'[sys::Str:sys::Obj?]',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
SqlErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str?',false),new sys.Param('cause','sys::Err?',true)]),{});
TokenizerTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('doVerify',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sql','sys::Str',false),new sys.Param('expected','sys::Str',false),new sys.Param('params','[sys::Str:sys::Int[]]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
SqlConnPoolTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('execute',2048,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('a','sql::SqlConnPoolTestActor',false),new sys.Param('wait','sys::Duration',false)]),{}).am$('verifyPool',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cp','sql::SqlConnPool',false),new sys.Param('actors','sql::SqlConnPoolTestActor[]',false),new sys.Param('inUse','sys::Int',false),new sys.Param('idle','sys::Int',false),new sys.Param('expect','sys::Str?[]',false)]),{}).am$('debugInt',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('d','sys::Str',false),new sys.Param('key','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
SqlConnPoolTestActor.type$.af$('cp',73730,'sql::SqlConnPool',{}).af$('name',73730,'sys::Str',{}).af$('lastName',73730,'concurrent::AtomicRef',{}).af$('isExecutingRef',73730,'concurrent::AtomicBool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ap','concurrent::ActorPool',false),new sys.Param('cp','sql::SqlConnPool',false),new sys.Param('n','sys::Str',false)]),{}).am$('isExecuting',8192,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('receive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{});
DeprecatedTokenizerTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('doVerify',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sql','sys::Str',false),new sys.Param('expected','sys::Str',false),new sys.Param('params','[sys::Str:sys::Int[]]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
SqlTest.type$.af$('db',65664,'sql::SqlConn?',{}).af$('dbType',65664,'sql::DbType?',{}).af$('uri',65664,'sys::Str?',{}).af$('user',65666,'sys::Str',{}).af$('pass',65666,'sys::Str',{}).am$('test',8192,'sys::Void',xp,{}).am$('doTest',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('testUri','sys::Str',false)]),{}).am$('open',8192,'sys::Void',xp,{}).am$('verifyMeta',8192,'sys::Void',xp,{}).am$('dropTables',8192,'sys::Void',xp,{}).am$('createTable',8192,'sys::Void',xp,{}).am$('insertTable',8192,'sys::Void',xp,{}).am$('insertFarmer',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('row','sys::Obj[]',false)]),{}).am$('verifyFarmerCols',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','sql::Row',false)]),{}).am$('closures',8192,'sys::Void',xp,{}).am$('transactions',8192,'sys::Void',xp,{}).am$('preparedStmts',8192,'sys::Void',xp,{}).am$('executeStmts',8192,'sys::Void',xp,{}).am$('batchExecute',8192,'sys::Void',xp,{}).am$('pool',8192,'sys::Void',xp,{}).am$('mysqlVariable',8192,'sys::Void',xp,{}).am$('query',8192,'sql::Row[]',sys.List.make(sys.Param.type$,[new sys.Param('sql','sys::Str',false)]),{}).am$('execute',8192,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('sql','sys::Str',false)]),{}).am$('verifyCol',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('col','sql::Col',false),new sys.Param('index','sys::Int',false),new sys.Param('name','sys::Str',false),new sys.Param('type','sys::Type',false),new sys.Param('sqlType','sys::Str',false)]),{}).am$('verifyRow',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','sql::Row',false),new sys.Param('cells','sys::Obj[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Farmer.type$.af$('farmer_id',73728,'sys::Int',{}).af$('name',73728,'sys::Str?',{}).af$('married',73728,'sys::Bool',{}).af$('pet',73728,'sys::Str?',{}).af$('ss',73728,'sys::Str?',{}).af$('age',73728,'sys::Int',{}).af$('pigs',73728,'sys::Num?',{}).af$('cows',73728,'sys::Num?',{}).af$('ducks',73728,'sys::Num?',{}).af$('height',73728,'sys::Float',{}).af$('weight',73728,'sys::Float',{}).af$('bigdec',73728,'sys::Decimal?',{}).af$('dt',73728,'sys::DateTime?',{}).af$('d',73728,'sys::Date?',{}).af$('t',73728,'sys::Time?',{}).am$('make',139268,'sys::Void',xp,{});
DbType.type$.af$('mysql',106506,'sql::DbType',{}).af$('postgres',106506,'sql::DbType',{}).af$('vals',106498,'sql::DbType[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'sql::DbType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
TestPool.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',false)]),{}).am$('onOpen',267264,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','sql::SqlConn',false)]),{}).am$('onClose',267264,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','sql::SqlConn',false)]),{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "sql");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;concurrent 1.0");
m.set("pod.summary", "Relational database access");
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
m.set("pod.native.java", "true");
m.set("vcs.uri", "https://github.com/fantom-lang/fantom");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  SqlMeta,
  Col,
  SqlConnPool,
  Statement,
  Row,
  SqlConn,
  SqlConnImpl,
  SqlErr,
  TokenizerTest,
  SqlConnPoolTest,
  DeprecatedTokenizerTest,
  SqlTest,
};
