import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as util from './util.js';
import * as web from './web.js';
import * as xeto from './xeto.js';
import * as xetoEnv from './xetoEnv.js';
import * as xetoDoc from './xetoDoc.js';
import * as haystack from './haystack.js';
import * as def from './def.js';
import * as defc from './defc.js';

/**
 * Xeto CLI command plugin.  To create:
 * 1. Define subclass of XetoCmd
 * 2. Register type qname via indexed prop as "xeto.cmd" (if not
 *   in this pod)
 * 3. Annotate options and args using {@link util.AbstractMain | util::AbstractMain}
 *   design
 */
export class XetoCmd extends util.AbstractMain {
  static type$: sys.Type
  /**
   * Read an input file of dicts from any format
   */
  readInputFile(file: sys.File | null): sys.List<haystack.Dict>;
  /**
   * Command name alises/shortcuts
   */
  aliases(): sys.List<string>;
  /**
   * Prompt for a confirm yes/no
   */
  promptConfirm(msg: string): boolean;
  /**
   * Log name is "xeto"
   */
  log(): sys.Log;
  /**
   * Run the command.  Return zero on success
   */
  run(): number;
  /**
   * Output grid to given file extension
   */
  writeOutputFile(file: sys.File, grid: haystack.Grid): void;
  /**
   * Find a specific command or return null
   */
  static find(name: string): XetoCmd | null;
  static make(...args: unknown[]): XetoCmd;
  /**
   * Single line summary of the command for help
   */
  summary(): string;
  /**
   * Print a line to stdout
   */
  printLine(line?: string): void;
  /**
   * Print error message and return 1
   */
  err(msg: string): number;
  /**
   * App name is "xeto {name}"
   */
  appName(): string;
  /**
   * List installed commands
   */
  static list(): sys.List<XetoCmd>;
  /**
   * Output to a file or stdout and guaranteed closed
   */
  withOut(arg: sys.File | null, f: ((arg0: sys.OutStream) => void)): void;
  /**
   * Command name
   */
  name(): string;
}

/**
 * Xeto CLI tools
 */
export class Main extends sys.Obj {
  static type$: sys.Type
  static main(args: sys.List<string>): number;
  static make(...args: unknown[]): Main;
}

