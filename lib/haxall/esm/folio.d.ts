import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as xeto from './xeto.js';
import * as haystack from './haystack.js';

/**
 * Diff encapsulates a set of changes to apply to a record.
 */
export class Diff extends sys.Obj {
  static type$: sys.Type
  /**
   * Changes applied to {@link oldRec | oldRec} with resulting {@link newRec | newRec}
   */
  changes(): haystack.Dict;
  /**
   * Bitmask meta-data for diff
   */
  flags(): number;
  /**
   * Flag bitmask for {@link isRemove | isRemove}
   */
  static remove(): number;
  /**
   * Timestamp version of {@link oldRec | oldRec} or null if
   * adding new record
   */
  oldMod(): sys.DateTime | null;
  /**
   * Target record id
   */
  id(): haystack.Ref;
  /**
   * Flag bitmask for {@link isAdd | isAdd}
   */
  static add(): number;
  /**
   * Original record or null if adding new record
   */
  oldRec(): haystack.Dict | null;
  /**
   * Updated record which is null until after commit
   */
  newRec(): haystack.Dict | null;
  /**
   * Flag bitmask for {@link isTransient | isTransient}
   */
  static transient(): number;
  /**
   * Timestamp version of {@link newRec | newRec} or null
   */
  newMod(): sys.DateTime | null;
  /**
   * Flag bitmask for {@link force | force} and {@link transient | transient}
   */
  static forceTransient(): number;
  /**
   * Flag bitmask for {@link isForce | isForce}
   */
  static force(): number;
  /**
   * Flag indicating that changes should be applied regardless of
   * other concurrent changes which may be been applied after the
   * {@link oldRec | oldRec} version was read.
   */
  isForce(): boolean;
  /**
   * Construct a modfication for an existing record.  The oldRec
   * should be the instance which was read from the project.  Any
   * tags to add/set/remove should be included in the changes
   * dict. Use {@link haystack.Remove.val | haystack::Remove.val}
   * to indicate a tag should be removed. See {@link makeAdd | makeAdd}
   * to create a Diff for adding a new record to a project.
   */
  static make(oldRec: haystack.Dict | null, changes: sys.JsObj | null, flags?: number, ...args: unknown[]): Diff;
  /**
   * String representation
   */
  toStr(): string;
  /**
   * Get tag value from new record or null.
   */
  getNew(tag: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Flag indicating if adding a new record to the project
   */
  isAdd(): boolean;
  /**
   * Make a Diff to add a new record into the database.
   */
  static makeAdd(changes: sys.JsObj | null, id?: haystack.Ref, ...args: unknown[]): Diff;
  /**
   * Flag indicating if remove an existing record from the
   * project
   */
  isRemove(): boolean;
  /**
   * Get tag value from old record or null.
   */
  getOld(tag: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Flag indicating that this diff should not be flushed to
   * persistent storage (it may or may not be persisted).
   */
  isTransient(): boolean;
  /**
   * Update diff - not an add nor a remove
   */
  isUpdate(): boolean;
}

/**
 * PasswordStore manages plaintext/hashed passwords and other
 * secrets. It is stored via an obscured props file to prevent
 * casual reading, but is not encrypted.  The passwords file
 * must be kept secret and reads must be sequestered from all
 * network access.  We separate secrets from the main database
 * so that it may be more easily secured.
 */
export class PasswordStore extends sys.Obj {
  static type$: sys.Type
  /**
   * Remove a password by its key.
   */
  remove(key: string): void;
  /**
   * Get a password by its key or return null if not found.
   */
  get(key: string): string | null;
  /**
   * Set a password by its key.
   */
  set(key: string, val: string): void;
}

/**
 * Folio database
 */
export class Folio extends sys.Obj {
  static type$: sys.Type
  /**
   * Home directory for this database
   */
  dir(): sys.File;
  /**
   * Name of this database
   */
  name(): string;
  /**
   * Logging for this database
   */
  log(): sys.Log;
  /**
   * Configuration used to init database
   */
  config(): FolioConfig;
  /**
   * Backup APIs
   */
  backup(): FolioBackup;
  /**
   * Convenience for {@link commitAll | commitAll} with a single
   * diff.
   */
  commit(diff: Diff): Diff;
  /**
   * Return the number of records which match given [filter](https://fantom.org/doc/docHaystack/Filters).
   * This method supports the same options as {@link readAll | readAll}.
   */
  readCount(filter: haystack.Filter, opts?: haystack.Dict | null): number;
  /**
   * Get storage for passwords and other secrets
   */
  passwords(): PasswordStore;
  /**
   * Close the database asynchronously and return future
   */
  closeAsync(): FolioFuture;
  /**
   * Find the first record which matches the given [filter](https://fantom.org/doc/docHaystack/Filters).
   * Throw UnknownRecErr or return null based on checked flag.
   */
  read(filter: haystack.Filter, checked?: boolean): haystack.Dict | null;
  /**
   * Commit a list of diffs to the database asynchronously.
   */
  commitAllAsync(diffs: sys.List<Diff>): FolioFuture;
  /**
   * Read a list of records by id.  The resulting list matches
   * the list of ids by index (null if record not found).
   */
  readByIdsList(ids: sys.List<haystack.Ref>, checked?: boolean): sys.List<haystack.Dict | null>;
  /**
   * Convenience for {@link readByIds | readByIds} with single id.
   */
  readById(id: haystack.Ref | null, checked?: boolean): haystack.Dict | null;
  /**
   * Match all the records against a [filter](https://fantom.org/doc/docHaystack/Filters)
   * and return as grid.
   * 
   * Options:
   * - limit: max number of recs to read
   * - search: search string to apply in addition to filter
   * - sort: marker tag to sort recs by dis string
   * - trash: marker tag to include recs with trash tag
   * - gridMeta: Dict to use for grid meta
   */
  readAll(filter: haystack.Filter, opts?: haystack.Dict | null): haystack.Grid;
  /**
   * Sub-class constructor
   */
  static make(config: FolioConfig, ...args: unknown[]): Folio;
  /**
   * Close the database synchronously (block until closed)
   */
  close(timeout?: sys.Duration | null): void;
  /**
   * Read a list of records by ids into a grid.  The rows in the
   * result correspond by index to the ids list.  If checked is
   * true, then every id must be found in the project or
   * UnknownRecErr is thrown.  If checked is false, then an
   * unknown record is returned as a row with every column set to
   * null (including the `id` tag).
   */
  readByIds(ids: sys.List<haystack.Ref>, checked?: boolean): haystack.Grid;
  /**
   * Match all the records against a [filter](https://fantom.org/doc/docHaystack/Filters)
   * and return as list.  This method uses same semantics and
   * options as {@link readAll | readAll}.
   */
  readAllList(filter: haystack.Filter, opts?: haystack.Dict | null): sys.List<haystack.Dict>;
  /**
   * Convenience for {@link commitAllAsync | commitAllAsync} with
   * a single diff.
   */
  commitAsync(diff: Diff): FolioFuture;
  /**
   * Apply a list of diffs to the database in batch.  Either all
   * the changes are successfully applied, or else none of them
   * are applied and an exception is raised.  Return updated
   * Diffs which encapsulate both the old and new version of each
   * record.
   * 
   * If any of the records have been modified since they were
   * read for the given change set then ConcurrentChangeErr is
   * thrown unless `Diff.force` configured.
   */
  commitAll(diffs: sys.List<Diff>): sys.List<Diff>;
}

/**
 * Response from a {@link Folio | Folio} database that provides
 * access to eventual result
 */
export class FolioFuture extends concurrent.Future {
  static type$: sys.Type
  static make(...args: unknown[]): FolioFuture;
}

/**
 * FolioConfig specifies initialization constants
 */
export class FolioConfig extends sys.Obj {
  static type$: sys.Type
  /**
   * Logging for this database
   */
  log(): sys.Log;
  __log(it: sys.Log): void;
  /**
   * Actor pool to use for threading
   */
  pool(): concurrent.ActorPool;
  __pool(it: concurrent.ActorPool): void;
  /**
   * Ref prefix to make internal refs absolute.  This prefix must
   * include a trailing colon such as "p:project:r:"
   */
  idPrefix(): string | null;
  __idPrefix(it: string | null): void;
  /**
   * Home directory for this database
   */
  dir(): sys.File;
  __dir(it: sys.File): void;
  /**
   * Additional options
   */
  opts(): haystack.Dict;
  __opts(it: haystack.Dict): void;
  /**
   * Name for this database
   */
  name(): string;
  __name(it: string): void;
  /**
   * It-block constructor
   */
  static make(f: ((arg0: FolioConfig) => void), ...args: unknown[]): FolioConfig;
}

/**
 * FolioBackup provides APIs associated with managing backups
 */
export abstract class FolioBackup extends sys.Obj {
  static type$: sys.Type
  /**
   * List the backups currently available ordered from newest to
   * oldest.
   */
  list(): sys.List<FolioBackupFile>;
  /**
   * Kick off a backup operation in the background.  Raise
   * exception if a backup is already running.
   */
  create(): FolioFuture;
}

/**
 * Handle to a backup zip file
 */
export class FolioBackupFile extends sys.Obj {
  static type$: sys.Type
  /**
   * Return file name
   */
  toStr(): string;
  /**
   * Open an input stream to read the backup zip file
   */
  in(): sys.InStream;
  /**
   * Delete the backup file which is an unrecoverable operation
   */
  delete(): void;
  /**
   * Size in bytes of the backup zip file
   */
  size(): number;
  /**
   * Timestamp the backup was started
   */
  ts(): sys.DateTime;
}

/**
 * FolioFlatFile is a simple {@link Folio | Folio}
 * implementation backed by a [Trio](https://fantom.org/doc/docHaystack/Trio)
 * flat file.
 */
export class FolioFlatFile extends Folio {
  static type$: sys.Type
  /**
   * Open for given directory.  Create automatically if file not
   * found. The database is stored in a file named "folio.trio"
   * under dir.
   */
  static open(config: FolioConfig): FolioFlatFile;
}

