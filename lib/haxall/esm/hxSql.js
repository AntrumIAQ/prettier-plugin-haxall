// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as rdf from './rdf.js'
import * as sql from './sql.js'
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
import * as hxPoint from './hxPoint.js'
import * as hxConn from './hxConn.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class SqlDispatch extends hxConn.ConnDispatch {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return SqlDispatch.type$; }

  #client = null;

  // private field reflection only
  __client(it) { if (it === undefined) return this.#client; else this.#client = it; }

  #evalUser$Store = undefined;

  // private field reflection only
  __evalUser$Store(it) { if (it === undefined) return this.#evalUser$Store; else this.#evalUser$Store = it; }

  static make(arg) {
    const $self = new SqlDispatch();
    SqlDispatch.make$($self,arg);
    return $self;
  }

  static make$($self,arg) {
    hxConn.ConnDispatch.make$($self, arg);
    ;
    return;
  }

  onOpen() {
    this.#client = SqlLib.doOpen(this.conn());
    return;
  }

  onClose() {
    this.#client.close();
    this.#client = null;
    return;
  }

  onPing() {
    let meta = this.#client.meta();
    let tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    tags.set("productName", meta.productName());
    tags.set("productVersion", meta.productVersionStr());
    tags.set("driverName", meta.driverName());
    tags.set("driverVersion", meta.driverVersionStr());
    return haystack.Etc.makeDict(tags);
  }

  onSyncHis(point,span) {
    const this$ = this;
    try {
      let exprStr = sys.ObjUtil.as(this.rec().get("sqlSyncHisExpr"), sys.Str.type$);
      if (exprStr == null) {
        throw haystack.FaultErr.make(sys.Str.plus("'sqlConn' rec must define 'sqlSyncHisExpr': ", point.dis()));
      }
      ;
      let result = this.evalSyncHisExpr(point, sys.ObjUtil.coerce(exprStr, sys.Str.type$), span.start(), span.end());
      let items = sys.List.make(haystack.HisItem.type$);
      if (!result.isEmpty()) {
        let cols = result.cols();
        if (sys.ObjUtil.compareNE(cols.size(), 2)) {
          throw sys.Err.make("sqlSyncHisExpr result must have two columns");
        }
        ;
        items.capacity(result.size());
        result.each((row) => {
          items.add(haystack.HisItem.make(sys.ObjUtil.coerce(row.val(cols.get(0)), sys.DateTime.type$), row.val(cols.get(1))));
          return;
        });
      }
      ;
      return point.updateHisOk(items, span);
    }
    catch ($_u0) {
      $_u0 = sys.Err.make($_u0);
      if ($_u0 instanceof sys.Err) {
        let e = $_u0;
        ;
        return point.updateHisErr(e);
      }
      else {
        throw $_u0;
      }
    }
    ;
  }

  evalSyncHisExpr(point,exprStr,start,end) {
    let cx = this.rt().context().create(this.evalUser());
    concurrent.Actor.locals().set(haystack.Etc.cxActorLocalsKey(), cx);
    try {
      let fn = cx.evalToFunc(exprStr);
      let result = fn.call(cx, sys.List.make(sys.Obj.type$, [this.rec(), point.rec(), haystack.ObjRange.make(start, end)]));
      if (!sys.ObjUtil.is(result, haystack.Grid.type$)) {
        throw sys.Err.make(sys.Str.plus("sqlSyncHisExpr returned invalid result type: ", ((this$) => { let $_u1 = result; if ($_u1 == null) return null; return sys.ObjUtil.typeof(result); })(this)));
      }
      ;
      return sys.ObjUtil.coerce(result, haystack.Grid.type$);
    }
    finally {
      concurrent.Actor.locals().remove(haystack.Etc.cxActorLocalsKey());
    }
    ;
  }

  evalUser() {
    if (this.#evalUser$Store === undefined) {
      this.#evalUser$Store = this.evalUser$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#evalUser$Store, hx.HxUser.type$);
  }

  evalUser$Once() {
    return this.rt().user().makeSyntheticUser("sqlHisSync", sys.Map.__fromLiteral(["projAccessFilter"], [sys.Str.plus("name==", sys.Str.toCode(this.rt().name()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
  }

}

class SqlLib extends hxConn.ConnLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SqlLib.type$; }

  static doOpen(c) {
    let uriVal = ((this$) => { let $_u2 = c.rec().get("uri"); if ($_u2 != null) return $_u2; throw haystack.FaultErr.make("Missing 'uri' tag"); })(this);
    let uri = ((this$) => { let $_u3 = sys.ObjUtil.as(uriVal, sys.Uri.type$); if ($_u3 != null) return $_u3; throw haystack.FaultErr.make(sys.Str.plus("Type of 'uri' must be Uri, not ", sys.ObjUtil.typeof(uriVal).name())); })(this);
    let user = ((this$) => { let $_u4 = sys.ObjUtil.as(c.rec().get("username"), sys.Str.type$); if ($_u4 != null) return $_u4; return ""; })(this);
    let pass = ((this$) => { let $_u5 = c.db().passwords().get(c.id().toStr()); if ($_u5 != null) return $_u5; return ""; })(this);
    try {
      return sql.SqlConn.open(uri.toStr(), user, pass);
    }
    catch ($_u6) {
      $_u6 = sys.Err.make($_u6);
      if ($_u6 instanceof sql.SqlErr) {
        let e = $_u6;
        ;
        if (sys.Str.contains(e.msg(), "Communications link failure")) {
          throw haystack.DownErr.make(e.msg(), e);
        }
        ;
        throw e;
      }
      else {
        throw $_u6;
      }
    }
    ;
  }

  onConnDetails(c) {
    let rec = c.rec();
    let uri = rec.get("uri");
    let product = sys.Str.plus(sys.Str.plus(sys.Str.plus("", rec.get("productName")), " "), rec.get("productVersion"));
    let driver = sys.Str.plus(sys.Str.plus(sys.Str.plus("", rec.get("driverName")), " "), rec.get("driverVersion"));
    let s = sys.StrBuf.make();
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("uri:           ", uri), "\nproduct:       "), product), "\ndriver:        "), driver), "\n"));
    return s.toStr();
  }

  static make() {
    const $self = new SqlLib();
    SqlLib.make$($self);
    return $self;
  }

  static make$($self) {
    hxConn.ConnLib.make$($self);
    return;
  }

}

class SqlFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SqlFuncs.type$; }

  static sqlPing(conn) {
    return hxConn.ConnFwFuncs.connPing(conn);
  }

  static sqlSyncHis(points,span) {
    if (span === undefined) span = null;
    return hxConn.ConnFwFuncs.connSyncHis(points, span);
  }

  static sqlDebugDrivers() {
    return sql.SqlConnImpl.debugDrivers();
  }

  static sqlTables(conn) {
    const this$ = this;
    return sys.ObjUtil.coerce(SqlFuncs.withConn(conn, (db) => {
      let gb = haystack.GridBuilder.make().addCol("name");
      let tables = db.meta().tables();
      tables.each((table) => {
        gb.addRow1(table);
        return;
      });
      return gb.toGrid();
    }), haystack.Grid.type$);
  }

  static sqlQuery(conn,$sql) {
    const this$ = this;
    return sys.ObjUtil.coerce(SqlFuncs.withConn(conn, (db) => {
      return SqlFuncs.rowsToGrid(db.sql($sql).query());
    }), haystack.Grid.type$);
  }

  static sqlExecute(conn,$sql) {
    const this$ = this;
    return SqlFuncs.withConn(conn, (db) => {
      return SqlFuncs.fromSqlVal(db.sql($sql).execute());
    });
  }

  static sqlInsert(data,conn,table) {
    const this$ = this;
    return SqlFuncs.withConn(conn, (db) => {
      let tr = db.meta().tableRow(table);
      let single = false;
      let input = null;
      if (sys.ObjUtil.is(data, haystack.Dict.type$)) {
        (single = true);
        (input = haystack.Etc.makeDictGrid(null, sys.ObjUtil.coerce(data, haystack.Dict.type$)));
      }
      else {
        (input = haystack.Etc.toGrid(data));
      }
      ;
      let s1 = sys.StrBuf.make().add("insert into ").add(table).add(" (");
      let s2 = sys.StrBuf.make().add(" values (");
      let inputCols = sys.List.make(sql.Col.type$);
      tr.cols().each((tcol) => {
        let name = tcol.name();
        if (sys.ObjUtil.equals(name, "id")) {
          return;
        }
        ;
        if (input.missing(name)) {
          return;
        }
        ;
        inputCols.add(tcol);
        s1.add(name).add(",");
        s2.add("@").add(name).add(",");
        return;
      });
      s1.set(-1, 41);
      s2.set(-1, 41);
      let sqlStr = s1.add(s2).toStr();
      let stmt = db.sql(sqlStr).prepare();
      let results = sys.List.make(sys.Obj.type$);
      input.each((inputRow) => {
        let params = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
        inputCols.each((inputCol) => {
          let name = inputCol.name();
          params.set(name, SqlFuncs.toSqlVal(inputRow.trap(name, null), inputCol));
          return;
        });
        let r = stmt.execute(params);
        if (sys.ObjUtil.is(r, sys.Type.find("sys::List"))) {
          (r = sys.ObjUtil.coerce(r, sys.Type.find("sys::List")).get(0));
        }
        ;
        results.add(sys.ObjUtil.coerce(SqlFuncs.fromSqlVal(r), sys.Obj.type$));
        return;
      });
      if (single) {
        return SqlFuncs.fromSqlVal(results.first());
      }
      ;
      return results;
    });
  }

  static withConn(conn,f) {
    (conn = sys.ObjUtil.coerce(SqlFuncs.curContext().rt().conn().conn(haystack.Etc.toId(conn)), sys.Obj.type$));
    let db = SqlLib.doOpen(sys.ObjUtil.coerce(conn, hxConn.Conn.type$));
    try {
      return sys.Func.call(f, db);
    }
    finally {
      db.close();
    }
    ;
  }

  static fromSqlVal(val) {
    const this$ = this;
    if (sys.ObjUtil.is(val, sys.Num.type$)) {
      return haystack.Number.makeNum(sys.ObjUtil.coerce(val, sys.Num.type$));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Buf.type$)) {
      let buf = sys.ObjUtil.coerce(val, sys.Buf.type$);
      if (sys.ObjUtil.compareLE(buf.size(), 10240)) {
        return buf.toBase64();
      }
      ;
      return sys.Str.plus("Blob size=", sys.ObjUtil.coerce(buf.size(), sys.Obj.type$.toNullable()));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      let list = sys.ObjUtil.coerce(val, sys.Type.find("sys::List"));
      if (sys.ObjUtil.equals(list.of(), sys.Int.type$)) {
        return list.map((x) => {
          return sys.ObjUtil.coerce(haystack.Number.makeInt(sys.ObjUtil.coerce(x, sys.Int.type$)), haystack.Number.type$);
        }, haystack.Number.type$);
      }
      ;
      if (sys.ObjUtil.equals(list.of(), sys.Str.type$)) {
        return list;
      }
      ;
      if (sys.ObjUtil.equals(list.of(), sql.Row.type$)) {
        return SqlFuncs.rowsToGrid(sys.ObjUtil.coerce(list, sys.Type.find("sql::Row[]")));
      }
      ;
      throw sys.Err.make(sys.Str.plus("Unsupported SQL list type: ", sys.ObjUtil.typeof(list)));
    }
    ;
    return val;
  }

  static rowsToGrid(result) {
    const this$ = this;
    if (result.isEmpty()) {
      return haystack.Etc.makeEmptyGrid();
    }
    ;
    let cols = sys.List.make(sys.Str.type$);
    let colMetas = sys.List.make(haystack.Dict.type$);
    result.first().cols().each((col) => {
      cols.add(haystack.Etc.toTagName(col.name()));
      colMetas.add(haystack.Etc.makeDict(sys.Map.__fromLiteral(["sqlName"], [col.name()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
      return;
    });
    let rows = sys.List.make(sys.Obj.type$);
    result.each((r) => {
      let row = sys.List.make(sys.Obj.type$.toNullable());
      r.cols().each((col) => {
        row.add(SqlFuncs.fromSqlVal(r.get(col)));
        return;
      });
      rows.add(row);
      return;
    });
    return haystack.Etc.makeListsGrid(null, cols, colMetas, sys.ObjUtil.coerce(rows, sys.Type.find("sys::Obj?[][]")));
  }

  static toSqlVal(val,col) {
    if (sys.ObjUtil.equals(col.type(), sys.Str.type$)) {
      return ((this$) => { if (val == null) return "null"; return sys.ObjUtil.toStr(val); })(this);
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Number.type$)) {
      if (sys.ObjUtil.equals(col.type(), sys.Float.type$)) {
        return sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, haystack.Number.type$).toFloat(), sys.Obj.type$.toNullable());
      }
      ;
      if (sys.ObjUtil.equals(col.type(), sys.Int.type$)) {
        return sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, haystack.Number.type$).toInt(), sys.Obj.type$.toNullable());
      }
      ;
    }
    ;
    return val;
  }

  static curContext() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static make() {
    const $self = new SqlFuncs();
    SqlFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class SqlConnTest extends hx.HxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SqlConnTest.type$; }

  sqlTestInit() {
    this.addLib("sql");
    if (this.rt().platform().isSkySpark()) {
      this.addLib("his");
    }
    ;
    let sqlPod = sys.Pod.find("sql");
    let conn = this.addRec(sys.Map.__fromLiteral(["dis","sqlConn","uri","username","sqlSyncHisExpr"], ["Test SQL Conn",haystack.Marker.val(),sys.Str.toUri(sqlPod.config("test.uri")),sqlPod.config("test.username"),"testSyncHis"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.rt().db().passwords().set(conn.id().toStr(), sys.ObjUtil.coerce(sqlPod.config("test.password"), sys.Str.type$));
    let grid = sys.ObjUtil.coerce(this.eval("read(sqlConn).sqlTables()"), haystack.Grid.type$);
    this.verifyEq(grid.cols().get(0).name(), "name");
    (grid = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("sqlTables(", conn.id().toCode()), ")")), haystack.Grid.type$));
    this.verifyEq(grid.cols().get(0).name(), "name");
    this.rt().sync();
    return conn;
  }

  testBasics() {
    const this$ = this;
    let conn = this.sqlTestInit();
    try {
      this.eval("read(sqlConn).sqlExecute(\"drop table sqlext_test_basics\")");
    }
    catch ($_u8) {
      $_u8 = sys.Err.make($_u8);
      if ($_u8 instanceof sys.Err) {
        let e = $_u8;
        ;
      }
      else {
        throw $_u8;
      }
    }
    ;
    let x = this.eval("read(sqlConn).sqlExecute(  \"create table sqlext_test_basics(   tid int auto_increment not null,   dis varchar(255) not null,   date date,   dur varchar(255) not null,   num int,   primary key (tid))\"   )");
    let grid = sys.ObjUtil.coerce(this.eval("read(sqlConn).sqlTables()"), haystack.Grid.type$);
    this.verifyEq(sys.ObjUtil.coerce(grid.findAll((row) => {
      return sys.ObjUtil.equals(row.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), "sqlext_test_basics");
    }).size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    let aId = this.eval("sqlInsert({dis:\"Alpha\", date:\"2010-04-20\", dur:\"forever\", num:66m}, read(sqlConn), \"sqlext_test_basics\")");
    this.verify(sys.ObjUtil.is(aId, haystack.Number.type$));
    (grid = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("sqlQuery(", conn.id().toCode()), ", \"select * from sqlext_test_basics\")")), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(grid.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyDictEq(grid.get(0), sys.Map.__fromLiteral(["tid","dis","date","dur","num"], [aId,"Alpha",sys.Date.fromStr("2010-04-20"),"forever",haystack.HaystackTest.n(sys.ObjUtil.coerce(66, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.addRec(sys.Map.__fromLiteral(["foo","dis","date","dur"], [haystack.Marker.val(),"Beta",sys.Date.make(2010, sys.Month.jun(), 7).toStr(),haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable()), "min")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.addRec(sys.Map.__fromLiteral(["foo","dis","date","dur"], [haystack.Marker.val(),"Gamma",sys.Date.make(2011, sys.Month.jun(), 7).toStr(),haystack.HaystackTest.n(sys.ObjUtil.coerce(5, sys.Num.type$.toNullable()), "min")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    let ids = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("readAll(foo).sort(\"date\").sqlInsert(", conn.id().toCode()), ", \"sqlext_test_basics\")")), sys.Type.find("sys::Obj[]"));
    (grid = sys.ObjUtil.coerce(this.eval("read(sqlConn).sqlQuery(\"select * from sqlext_test_basics\").sort(\"date\")"), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(grid.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyDictEq(grid.get(0), sys.Map.__fromLiteral(["tid","dis","date","dur","num"], [aId,"Alpha",sys.Date.make(2010, sys.Month.apr(), 20),"forever",haystack.HaystackTest.n(sys.ObjUtil.coerce(66, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifyDictEq(grid.get(1), sys.Map.__fromLiteral(["tid","dis","date","dur"], [ids.get(0),"Beta",sys.Date.make(2010, sys.Month.jun(), 7),"1min"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifyDictEq(grid.get(2), sys.Map.__fromLiteral(["tid","dis","date","dur"], [ids.get(1),"Gamma",sys.Date.make(2011, sys.Month.jun(), 7),"5min"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    (grid = sys.ObjUtil.coerce(this.eval("read(sqlConn).sqlQuery(\"select dis as \\\"Dis-Name\\\" from sqlext_test_basics\").sort(\"dis_Name\")"), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(grid.cols().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(grid.cols().first().name(), "dis_Name");
    this.verifyEq(grid.cols().first().meta().get("sqlName"), "Dis-Name");
    let r = this.eval(sys.Str.plus(sys.Str.plus("sqlExecute(", conn.id().toCode()), ", \"update sqlext_test_basics set num=987 where dis=\\\"Alpha\\\"\")"));
    this.verifyEq(r, haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable())));
    (grid = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("sqlExecute(", conn.id().toCode()), ", \"select * from sqlext_test_basics\").sort(\"dis\")")), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(grid.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(grid.get(0).trap("dis", sys.List.make(sys.Obj.type$.toNullable(), [])), "Alpha");
    this.verifyEq(grid.get(1).trap("dis", sys.List.make(sys.Obj.type$.toNullable(), [])), "Beta");
    this.verifyEq(grid.get(2).trap("dis", sys.List.make(sys.Obj.type$.toNullable(), [])), "Gamma");
    return;
  }

  testSyncHis() {
    let conn = this.sqlTestInit();
    this.addFuncRec("testSyncHis", "(conn, his, range) => do\n   //echo(\"sync \" + conn->dis  +\",\" + his.toDis + \", \" + range)\n   sql: \"select timestamp, value from \" + his->tableName +\n        \" where timestamp >= '\" + range.start.format(\"YYYY-MM-DD hh:mm:ss\") + \"'\" +\n        \" and   timestamp <= '\" + range.end.format(\"YYYY-MM-DD hh:mm:ss\") + \"'\"\n   //echo(sql)\n   sqlQuery(conn, sql)\nend");
    try {
      this.eval(sys.Str.plus(sys.Str.plus("sqlExecute(", conn.id().toCode()), ", \"drop table sqlext_test_sync_his_a\")"));
    }
    catch ($_u9) {
      $_u9 = sys.Err.make($_u9);
      if ($_u9 instanceof sys.Err) {
        let e = $_u9;
        ;
      }
      else {
        throw $_u9;
      }
    }
    ;
    let x = this.eval("read(sqlConn).sqlExecute(  \"create table sqlext_test_sync_his_a(   timestamp datetime,   value float)\"   )");
    let hisA = this.addRec(sys.Map.__fromLiteral(["his","tz","dis","sqlConnRef","kind","point","tableName"], [haystack.HaystackTest.m(),"New_York","His-A",conn.id(),"Number",haystack.HaystackTest.m(),"sqlext_test_sync_his_a"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.sync(sys.ObjUtil.coerce(conn, haystack.Dict.type$));
    this.eval(sys.Str.plus(sys.Str.plus("sqlSyncHis(", hisA.id().toCode()), ")"));
    this.sync(sys.ObjUtil.coerce(conn, haystack.Dict.type$));
    (hisA = sys.ObjUtil.coerce(this.readById(hisA.id()), haystack.Dict.type$));
    this.verifySyncStatus(hisA, 0);
    this.eval(sys.Str.plus(sys.Str.plus("sqlInsert(\n  [{timestamp: dateTime(2010-04-25, 1:00, \"New_York\"), value: 2501},\n   {timestamp: dateTime(2010-04-25, 5:00, \"New_York\"), value: 2505},\n   {timestamp: dateTime(2010-04-26, 3:00, \"New_York\"), value: 2603},\n   {timestamp: dateTime(2010-04-26, 4:00, \"New_York\"), value: 2604}],\n   ", conn.id().toCode()), ",\n   \"sqlext_test_sync_his_a\")"));
    let tz = sys.TimeZone.fromStr("New_York");
    this.eval(sys.Str.plus(sys.Str.plus("sqlSyncHis(", hisA.id().toCode()), ", 2010-04-25)"));
    this.sync(sys.ObjUtil.coerce(conn, haystack.Dict.type$));
    (hisA = sys.ObjUtil.coerce(this.readById(hisA.id()), haystack.Dict.type$));
    this.verifySyncStatus(hisA, 2);
    this.sync(sys.ObjUtil.coerce(conn, haystack.Dict.type$));
    this.verifyHis(hisA, sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), [SqlConnTest.dt(2010, 4, 25, 1, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), haystack.HaystackTest.n(sys.ObjUtil.coerce(2501, sys.Num.type$.toNullable()))]), sys.List.make(sys.Obj.type$.toNullable(), [SqlConnTest.dt(2010, 4, 25, 5, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), haystack.HaystackTest.n(sys.ObjUtil.coerce(2505, sys.Num.type$.toNullable()))])]));
    let r = this.eval(sys.Str.plus(sys.Str.plus("sqlSyncHis(", hisA.id().toCode()), ")"));
    this.sync(sys.ObjUtil.coerce(conn, haystack.Dict.type$));
    let s = haystack.ZincWriter.gridToStr(haystack.Etc.toGrid(r));
    (hisA = sys.ObjUtil.coerce(this.readById(hisA.id()), haystack.Dict.type$));
    this.verifySyncStatus(hisA, 2);
    this.sync(sys.ObjUtil.coerce(conn, haystack.Dict.type$));
    this.verifyHis(hisA, sys.List.make(sys.Type.find("sys::Obj?[]"), [sys.List.make(sys.Obj.type$.toNullable(), [SqlConnTest.dt(2010, 4, 25, 1, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), haystack.HaystackTest.n(sys.ObjUtil.coerce(2501, sys.Num.type$.toNullable()))]), sys.List.make(sys.Obj.type$.toNullable(), [SqlConnTest.dt(2010, 4, 25, 5, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), haystack.HaystackTest.n(sys.ObjUtil.coerce(2505, sys.Num.type$.toNullable()))]), sys.List.make(sys.Obj.type$.toNullable(), [SqlConnTest.dt(2010, 4, 26, 3, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), haystack.HaystackTest.n(sys.ObjUtil.coerce(2603, sys.Num.type$.toNullable()))]), sys.List.make(sys.Obj.type$.toNullable(), [SqlConnTest.dt(2010, 4, 26, 4, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), haystack.HaystackTest.n(sys.ObjUtil.coerce(2604, sys.Num.type$.toNullable()))])]));
    (r = this.eval(sys.Str.plus(sys.Str.plus("sqlSyncHis(", hisA.id().toCode()), ")")));
    this.sync(sys.ObjUtil.coerce(conn, haystack.Dict.type$));
    (s = haystack.ZincWriter.gridToStr(haystack.Etc.toGrid(r)));
    (hisA = sys.ObjUtil.coerce(this.readById(hisA.id()), haystack.Dict.type$));
    this.verifySyncStatus(hisA, 0);
    return;
  }

  addFuncRec(name,src,tags) {
    if (tags === undefined) tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    tags.set("def", haystack.Symbol.fromStr(sys.Str.plus("func:", name)));
    tags.set("src", src);
    let r = this.addRec(tags);
    this.rt().sync();
    return r;
  }

  verifyHis(pt,expected) {
    const this$ = this;
    let items = sys.List.make(haystack.HisItem.type$);
    this.rt().his().read(pt, null, null, (item) => {
      items.add(item);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(items.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected.size(), sys.Obj.type$.toNullable()));
    items.each((item,i) => {
      let e = expected.get(((this$) => { let $_u10 = i;i = sys.Int.increment(i); return $_u10; })(this$));
      this$.verifyEq(item.ts(), e.get(0));
      this$.verifyEq(item.val(), e.get(1));
      return;
    });
    return;
  }

  verifySyncStatus(rec,count) {
    this.verifyEq(rec.get("hisStatus"), "ok");
    this.verifyEq(rec.get("hisErr"), null);
    return;
  }

  sync(conn) {
    this.rt().sync();
    return;
  }

  static dt(y,m,d,h,min,tz) {
    if (tz === undefined) tz = sys.TimeZone.utc();
    return sys.ObjUtil.coerce(sys.DateTime.make(y, sys.Month.vals().get(sys.Int.minus(m, 1)), d, h, min, 0, 0, tz), sys.DateTime.type$);
  }

  static make() {
    const $self = new SqlConnTest();
    SqlConnTest.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxTest.make$($self);
    return;
  }

}

const p = sys.Pod.add$('hxSql');
const xp = sys.Param.noParams$();
let m;
SqlDispatch.type$ = p.at$('SqlDispatch','hxConn::ConnDispatch',[],{},8192,SqlDispatch);
SqlLib.type$ = p.at$('SqlLib','hxConn::ConnLib',[],{},8194,SqlLib);
SqlFuncs.type$ = p.at$('SqlFuncs','sys::Obj',[],{},8194,SqlFuncs);
SqlConnTest.type$ = p.at$('SqlConnTest','hx::HxTest',[],{},8192,SqlConnTest);
SqlDispatch.type$.af$('client',67584,'sql::SqlConn?',{}).af$('evalUser$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj',false)]),{}).am$('onOpen',271360,'sys::Void',xp,{}).am$('onClose',271360,'sys::Void',xp,{}).am$('onPing',271360,'haystack::Dict',xp,{}).am$('onSyncHis',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('span','haystack::Span',false)]),{}).am$('evalSyncHisExpr',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('exprStr','sys::Str',false),new sys.Param('start','sys::DateTime',false),new sys.Param('end','sys::DateTime',false)]),{}).am$('evalUser',532480,'hx::HxUser',xp,{}).am$('evalUser$Once',133120,'hx::HxUser',xp,{});
SqlLib.type$.am$('doOpen',40962,'sql::SqlConn',sys.List.make(sys.Param.type$,[new sys.Param('c','hxConn::Conn',false)]),{}).am$('onConnDetails',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('c','hxConn::Conn',false)]),{}).am$('make',139268,'sys::Void',xp,{});
SqlFuncs.type$.am$('sqlPing',40962,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false)]),{'sys::Deprecated':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('sqlSyncHis',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('points','sys::Obj',false),new sys.Param('span','sys::Obj?',true)]),{'sys::Deprecated':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('sqlDebugDrivers',40962,'sys::Str',xp,{'axon::Axon':"axon::Axon{admin=true;}"}).am$('sqlTables',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('sqlQuery',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('sql','sys::Str',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('sqlExecute',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('sql','sys::Str',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('sqlInsert',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false),new sys.Param('conn','sys::Obj',false),new sys.Param('table','sys::Str',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('withConn',34818,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('f','|sql::SqlConn->sys::Obj?|',false)]),{}).am$('fromSqlVal',34818,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('rowsToGrid',34818,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('result','sql::Row[]',false)]),{}).am$('toSqlVal',34818,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('col','sql::Col',false)]),{}).am$('curContext',34818,'hx::HxContext',xp,{}).am$('make',139268,'sys::Void',xp,{});
SqlConnTest.type$.am$('sqlTestInit',8192,'haystack::Dict?',xp,{}).am$('testBasics',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('testSyncHis',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('addFuncRec',8192,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('src','sys::Str',false),new sys.Param('tags','[sys::Str:sys::Obj?]',true)]),{}).am$('verifyHis',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pt','haystack::Dict',false),new sys.Param('expected','sys::Obj?[][]',false)]),{}).am$('verifySyncStatus',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('count','sys::Int',false)]),{}).am$('sync',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','haystack::Dict',false)]),{}).am$('dt',40962,'sys::DateTime',sys.List.make(sys.Param.type$,[new sys.Param('y','sys::Int',false),new sys.Param('m','sys::Int',false),new sys.Param('d','sys::Int',false),new sys.Param('h','sys::Int',false),new sys.Param('min','sys::Int',false),new sys.Param('tz','sys::TimeZone',true)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxSql");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;sql 1.0;haystack 3.1.11;axon 3.1.11;hx 3.1.11;hxConn 3.1.11");
m.set("pod.summary", "SQL connector");
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
  SqlDispatch,
  SqlLib,
  SqlFuncs,
  SqlConnTest,
};
