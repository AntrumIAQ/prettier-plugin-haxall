import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as hx from './hx.js';

/**
 * Platform service provider interface for basic functionality
 */
export abstract class PlatformSpi extends sys.Obj {
  static type$: sys.Type
  /**
   * Reboot the operating system and runtime process
   */
  reboot(): void;
  /**
   * Restart runtime process, but do not reboot operating system
   */
  restart(): void;
  /**
   * Shutdown operating system and runtime process
   */
  shutdown(): void;
  /**
   * Return additional platform summary information as a list of
   * dicts. Each dict must have three tags: section, dis, and
   * val.  The supported section names: sw, hw, os, java.
   */
  info(): sys.List<haystack.Dict>;
}

/**
 * Platform support for basic functionality
 */
export class PlatformLib extends hx.HxLib {
  static type$: sys.Type
  static make(...args: unknown[]): PlatformLib;
}

