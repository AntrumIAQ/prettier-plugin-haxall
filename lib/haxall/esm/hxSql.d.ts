import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as sql from './sql.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as hx from './hx.js';
import * as hxConn from './hxConn.js';

/**
 * Dispatch callbacks for the SQL connector
 */
export class SqlDispatch extends hxConn.ConnDispatch {
  static type$: sys.Type
  evalUser(): hx.HxUser;
  onClose(): void;
  onSyncHis(point: hxConn.ConnPoint, span: haystack.Span): sys.JsObj | null;
  onOpen(): void;
  static make(arg: sys.JsObj, ...args: unknown[]): SqlDispatch;
  onPing(): haystack.Dict;
}

/**
 * SqlTest
 */
export class SqlConnTest extends hx.HxTest {
  static type$: sys.Type
  static dt(y: number, m: number, d: number, h: number, min: number, tz?: sys.TimeZone): sys.DateTime;
  verifySyncStatus(rec: haystack.Dict, count: number): void;
  addFuncRec(name: string, src: string, tags?: sys.Map<string, sys.JsObj | null>): haystack.Dict;
  sync(conn: haystack.Dict): void;
  /**
   * Setup and return connector based on etc/sql/config.props
   */
  sqlTestInit(): haystack.Dict | null;
  verifyHis(pt: haystack.Dict, expected: sys.List<sys.List<sys.JsObj | null>>): void;
  testSyncHis(): void;
  testBasics(): void;
  static make(...args: unknown[]): SqlConnTest;
}

/**
 * SQL connector library
 */
export class SqlLib extends hxConn.ConnLib {
  static type$: sys.Type
  onConnDetails(c: hxConn.Conn): string;
  static doOpen(c: hxConn.Conn): sql.SqlConn;
  static make(...args: unknown[]): SqlLib;
}

/**
 * SQL connector functions
 */
export class SqlFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Deprecated - use [connSyncHis()](connSyncHis())
   */
  static sqlSyncHis(points: sys.JsObj, span?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Execute a SQL query and return the result as a grid. Blob
   * columns under 10K are returned as base64.
   * 
   * Examples:
   * ```
   * read(sqlConn).sqlQuery("select * from some_table")
   * sqlQuery(sqlConnId, "select * from some_table")
   * ```
   * 
   * WARNING: any admin user will have full access to query the database
   * based on the user account configured by the sqlConn.
   */
  static sqlQuery(conn: sys.JsObj, $sql: string): haystack.Grid;
  /**
   * Execute a SQL statement and if applicable return a result.
   * If the statement produced auto-generated keys, then return
   * an list of the keys generated, otherwise return number of
   * rows modified.
   * 
   * WARNING: any admin user will have full access to update the database
   * based on the user account configured by the sqlConn.
   */
  static sqlExecute(conn: sys.JsObj, $sql: string): sys.JsObj | null;
  /**
   * Query the tables defined for the database. Return a grid
   * with the `name` column.
   * 
   * Examples:
   * ```
   * read(sqlConn).sqlTables
   * sqlTables(sqlConnId)
   * ```
   */
  static sqlTables(conn: sys.JsObj): haystack.Grid;
  /**
   * Return plain text report on JDBC drivers installed.
   */
  static sqlDebugDrivers(): string;
  /**
   * Deprecated - use [connPing()](connPing())
   */
  static sqlPing(conn: sys.JsObj): concurrent.Future;
  static make(...args: unknown[]): SqlFuncs;
  /**
   * Insert a record or grid of records into the given table. If
   * data is a dict, thena single row is inserted.  If data is a
   * grid or list of dicts, then each row is inserted.  The
   * data's column names must match the table's columns.  If the
   * data has a tag/column not found in the table then it is
   * ignored.
   * 
   * WARNING: any admin user will have full access to update the database
   * based on the user account configured by the sqlConn.
   */
  static sqlInsert(data: sys.JsObj | null, conn: sys.JsObj, table: string): sys.JsObj | null;
}

