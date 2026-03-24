import * as sys from './sys.js';
import * as concurrent from './concurrent.js';

/**
 * DeprecatedTokenizerTest
 */
export class DeprecatedTokenizerTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): DeprecatedTokenizerTest;
  test(): void;
}

/**
 * SqlConnPool manages a pool of reusable SQL connections
 */
export class SqlConnPool extends sys.Obj {
  static type$: sys.Type
  /**
   * Max number of simultaneous connections to allow before
   * blocking threads
   */
  maxConns(): number;
  __maxConns(it: number): void;
  /**
   * Logger
   */
  log(): sys.Log;
  __log(it: sys.Log): void;
  /**
   * Max time to block waiting for a connection before raising
   * TimeoutErr
   */
  timeout(): sys.Duration;
  __timeout(it: sys.Duration): void;
  /**
   * Connection password
   */
  password(): string | null;
  __password(it: string | null): void;
  /**
   * Time to linger an idle connection before closing it.  An
   * external actor must call checkLinger periodically to close
   * idle connetions.
   */
  linger(): sys.Duration;
  __linger(it: sys.Duration): void;
  /**
   * Connection URI
   */
  uri(): string;
  __uri(it: string): void;
  /**
   * Connection username
   */
  username(): string | null;
  __username(it: string | null): void;
  /**
   * Close idle connections that have lingered past the linger
   * timeout.
   */
  checkLinger(): void;
  /**
   * It-block construtor
   */
  static make(f: ((arg0: SqlConnPool) => void) | null, ...args: unknown[]): SqlConnPool;
  /**
   * Close all connections and raise exception on any new
   * executes
   */
  close(): void;
  /**
   * Allocate a SQL connection inside the given callback.  If a
   * connection cannot be acquired before {@link timeout | timeout}
   * elapses then a TimeoutErr is raised. Do not close the
   * connection inside the callback.
   */
  execute(f: ((arg0: SqlConn) => void)): void;
  /**
   * Return if {@link close | close} has been called.
   */
  isClosed(): boolean;
}

/**
 * Row models a row of a relational table. See [pod-doc](pod-doc#row).
 */
export class Row extends sys.Obj {
  static type$: sys.Type
  /**
   * Dump the cells separated by a comma.
   */
  toStr(): string;
  /**
   * Get a column by name.  If not found and checked is true then
   * throw ArgErr, otherwise return null.
   */
  col(name: string, checked?: boolean): Col | null;
  /**
   * Set a column value. See [type mapping](pod-doc#typeMapping).
   */
  set(col: Col, val: sys.JsObj | null): void;
  /**
   * Get column value. See [type mapping](pod-doc#typeMapping).
   */
  get(col: Col): sys.JsObj | null;
  /**
   * Trap is used to get or set a column by name.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Get a read-only list of the columns.
   */
  cols(): sys.List<Col>;
  static make(...args: unknown[]): Row;
}

/**
 * SqlConnPoolTest
 */
export class SqlConnPoolTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): SqlConnPoolTest;
  test(): void;
  debugInt(d: string, key: string): number;
}

/**
 * SqlErr indicates an error from the SQL database driver.
 */
export class SqlErr extends sys.Err {
  static type$: sys.Type
  static make(msg: string | null, cause?: sys.Err | null, ...args: unknown[]): SqlErr;
}

/**
 * SqlMeta provides access to database meta-data
 */
export class SqlMeta extends sys.Obj {
  static type$: sys.Type
  /**
   * Max number of chars in column name or null if no known limit
   */
  maxColName(): number | null;
  /**
   * Does the specified table exist in the database?
   */
  tableExists(tableName: string): boolean;
  /**
   * Get a column meta-data for for the specified table as a
   * prototype row instance.
   */
  tableRow(tableName: string): Row;
  /**
   * Name of database product
   */
  productName(): string;
  /**
   * Product version of database as "major.minor"
   */
  productVersion(): sys.Version;
  /**
   * List the tables in the database.
   */
  tables(): sys.List<string>;
  /**
   * Product version of database as free-form string
   */
  productVersionStr(): string;
  /**
   * Version of of connection driver to database as free-form
   * string
   */
  driverVersionStr(): string;
  /**
   * Version of of connection driver to database as "major.minor"
   */
  driverVersion(): sys.Version;
  /**
   * Max number of chars in table name or null if no known limit
   */
  maxTableName(): number | null;
  /**
   * Name of connection driver to database
   */
  driverName(): string;
}

/**
 * Col models a column of a relational table.  Columns are
 * accessed from rows with {@link Row.col | Row.col} and {@link Row.cols | Row.cols}
 */
export class Col extends sys.Obj {
  static type$: sys.Type
  /**
   * Zero based index of the column in the query result.
   */
  index(): number;
  /**
   * Type of the column. See [type mapping](pod-doc#typeMapping).
   */
  type(): sys.Type;
  /**
   * The type of the column as defined by the SQL database. See [type
   * mapping](pod-doc#typeMapping).
   */
  sqlType(): string;
  /**
   * Name of the column.
   */
  name(): string;
  /**
   * Return `name`.
   */
  toStr(): string;
  /**
   * Construct a column for the given meta-data.
   */
  static make(index: number, name: string, type: sys.Type, sqlType: string, ...args: unknown[]): Col;
}

/**
 * Statement is an executable statement for a specific
 * database. A statement may be executed immediately or
 * prepared and executed later with parameters. See [pod-doc](pod-doc#statements).
 */
export class Statement extends sys.Obj {
  static type$: sys.Type
  /**
   * The SQL text used to create this statement.
   */
  sql(): string;
  /**
   * Maximum number of rows returned when this statement is
   * executed.  If limit is exceeded rows are silently dropped. A
   * value of null indicates no limit.
   */
  limit(): number | null;
  limit(it: number | null): void;
  /**
   * Prepare this statement by compiling for efficient execution.
   * Return this.
   */
  prepare(): this;
  /**
   * Execute the statement.  For each row in the result, invoke
   * the specified function `eachFunc`. If the function returns
   * non-null, then break the iteration and return the resulting
   * object.  Return null if the function returns null for every
   * item.
   */
  queryEachWhile(params: sys.Map<string, sys.JsObj> | null, eachFunc: ((arg0: Row) => sys.JsObj | null)): sys.JsObj | null;
  /**
   * Execute a batch of commands on a prepared Statement. If all
   * commands execute successfully, returns an array of update
   * counts.
   * 
   * For each element in the array, if the element is non-null,
   * then it represents an update count giving the number of rows
   * in the database that were affected by the command's
   * execution.
   * 
   * If a given array element is null, it indicates that the
   * command was processed successfully but that the number of
   * rows affected is unknown.
   * 
   * If one of the commands in a batch update fails to execute
   * properly, this method throws a SqlErr that wraps a
   * java.sql.BatchUpdateException, and a JDBC driver may or may
   * not continue to process the remaining commands in the batch,
   * consistent with the underlying DBMS -- either always
   * continuing to process commands or never continuing to
   * process commands.
   */
  executeBatch(paramsList: sys.List<sys.Map<string, sys.JsObj> | null>): sys.List<number | null>;
  /**
   * Execute the statement and return the resulting `List` of `Rows`.
   * The `Cols` are available from `List.of.fields` or on `type.fields`
   * of each row instance.
   */
  query(params?: sys.Map<string, sys.JsObj> | null): sys.List<Row>;
  /**
   * Execute a SQL statement and if applicable return a result:
   * - If the statement is a query or procedure which produces a
   *   result set, then return `Row[]`
   * - If the statement is an insert and auto-generated keys are
   *   supported by the connector then return `Int[]` or `Str[]` of
   *   keys generated
   * - Return an `Int` with the update count
   */
  execute(params?: sys.Map<string, sys.JsObj> | null): sys.JsObj;
  /**
   * Execute the statement.  For each row in the result, invoke
   * the specified function `eachFunc`.
   */
  queryEach(params: sys.Map<string, sys.JsObj> | null, eachFunc: ((arg0: Row) => void)): void;
  /**
   * Close the statement.
   */
  close(): void;
}

/**
 * SqlConn manages a connection to a relational database. See [pod-doc](pod-doc#connections).
 */
export abstract class SqlConn extends sys.Obj {
  static type$: sys.Type
  /**
   * If auto-commit is true then each statement is executed and
   * committed as an individual transaction.  Otherwise
   * statements are grouped into transaction which must be closed
   * via {@link commit | commit} or {@link rollback | rollback}.
   */
  autoCommit(): boolean;
  autoCommit(it: boolean): void;
  /**
   * Undo any changes made inside the current transaction.
   */
  rollback(): void;
  /**
   * Commit all the changes made inside the current transaction.
   */
  commit(): void;
  /**
   * Create a statement for this database.
   */
  sql(sql: string): Statement;
  /**
   * Return if {@link close | close} has been called.
   */
  isClosed(): boolean;
  /**
   * Get the database meta-data
   */
  meta(): SqlMeta;
  /**
   * Close the database connection.  Closing a connection already
   * closed is a no-op.  This method is guaranteed to never throw
   * an exception.  Return true if the connection was closed
   * successfully or `false` if closed abnormally.
   * 
   * Do not close connections that were created by SqlConnPool. 
   * The pool handles that for you.
   */
  close(): boolean;
  /**
   * Open a connection to the database specified by the given
   * JDBC uri and username/password credentials.  Raise exception
   * if connection cannot be established. See [pod-doc](pod-doc#connections).
   */
  static open(uri: string, username: string | null, password: string | null): SqlConn;
  /**
   * User data stash for adding cached data to this connection.
   */
  stash(): sys.Map<string, sys.JsObj | null>;
}

/**
 * TokenizerTest
 */
export class TokenizerTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): TokenizerTest;
  test(): void;
}

/**
 * SqlTest
 */
export class SqlTest extends sys.Test {
  static type$: sys.Type
  mysqlVariable(): void;
  insertTable(): void;
  test(): void;
  query(sql: string): sys.List<Row>;
  batchExecute(): void;
  pool(): void;
  transactions(): void;
  execute(sql: string): sys.JsObj;
  verifyCol(col: Col, index: number, name: string, type: sys.Type, sqlType: string): void;
  preparedStmts(): void;
  executeStmts(): void;
  closures(): void;
  createTable(): void;
  insertFarmer(row: sys.List<sys.JsObj>): void;
  verifyRow(r: Row, cells: sys.List<sys.JsObj>): void;
  /**
   * Drop all tables in the database
   */
  dropTables(): void;
  static make(...args: unknown[]): SqlTest;
  verifyFarmerCols(r: Row): void;
  /**
   * Verify the metadata
   */
  verifyMeta(): void;
  open(): void;
}

