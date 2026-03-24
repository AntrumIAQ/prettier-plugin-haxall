import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as hx from './hx.js';

/**
 * Platform service provider interface for date and time
 */
export abstract class PlatformTimeSpi extends sys.Obj {
  static type$: sys.Type
  /**
   * Get the list of network time protocol server addresses. If
   * NTP is not supported, then return null.
   */
  ntpServersGet(): sys.List<string> | null;
  /**
   * Set the list of network time protocol server addresses.
   */
  ntpServersSet(addresses: sys.List<string>): void;
  /**
   * Set the current date, time, and timezone from DateTime. A
   * restart is required to bring JVM back into a consistent
   * state.
   */
  timeSet(ts: sys.DateTime): void;
}

/**
 * Platform support for date and time
 */
export class PlatformTimeLib extends hx.HxLib {
  static type$: sys.Type
  static make(...args: unknown[]): PlatformTimeLib;
}

