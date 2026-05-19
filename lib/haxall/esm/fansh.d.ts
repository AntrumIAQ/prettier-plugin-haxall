import * as sys from './sys.js';
import * as compiler from './compiler.js';
import * as concurrent from './concurrent.js';

/**
 * Evaluator is responsible for compiling and evaluating a
 * statement or expression.
 */
export class Evaluator extends sys.Obj {
  static type$: sys.Type
  eval(line: string): boolean;
  static make(shell: Shell | null, ...args: unknown[]): Evaluator;
}

/**
 * Fantom Shell
 */
export class Shell extends sys.Obj {
  static type$: sys.Type
  out(): sys.OutStream;
  out(it: sys.OutStream): void;
  in(): sys.InStream;
  in(it: sys.InStream): void;
  /**
   * Run the shell main loop.
   */
  run(): void;
  /**
   * Run the `scope` command.
   */
  dumpScope(): void;
  static make(...args: unknown[]): Shell;
  /**
   * Clear the environment
   */
  clear(): void;
  /**
   * Add using statement after we
   */
  addUsing(line: string): void;
  /**
   * If the line maps to a command function, then run it and
   * return true.  Otherwise return false.
   */
  command(line: string): boolean;
  /**
   * Run the `help` command.
   */
  help(): void;
  /**
   * Run the `quit` command.
   */
  quit(): void;
}

/**
 * Main launcher for fan shell.
 */
export class Main extends sys.Obj {
  static type$: sys.Type
  static main(): void;
  static make(...args: unknown[]): Main;
}

