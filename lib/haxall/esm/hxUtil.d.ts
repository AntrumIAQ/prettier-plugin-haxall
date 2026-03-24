import * as sys from './sys.js';
import * as haystack from './haystack.js';

/**
 * CircularBuf provides a list of items with a fixed size. 
 * Once the fixed size is reached, newer elements replace the
 * oldest items.
 */
export class CircularBuf extends sys.Obj {
  static type$: sys.Type
  /**
   * Max size
   */
  max(): number;
  max(it: number): void;
  /**
   * Number of items in buffer
   */
  size(): number;
  size(it: number): void;
  /**
   * Construct with max size
   */
  static make(max: number, ...args: unknown[]): CircularBuf;
  /**
   * Newest item added to the buffer
   */
  newest(): sys.JsObj | null;
  /**
   * Add new item to the buffer; if size is is at max remove the
   * oldest item
   */
  add(item: sys.JsObj | null): void;
  /**
   * Iterate from oldest to newest as long as given func returns
   * null.  If non-null is returned then break and return the
   * value.
   */
  eachrWhile(f: ((arg0: sys.JsObj | null) => sys.JsObj | null)): sys.JsObj | null;
  /**
   * Clear all items
   */
  clear(): void;
  /**
   * Iterate from oldest to newest
   */
  eachr(f: ((arg0: sys.JsObj | null) => void)): void;
  /**
   * Iterate from newest to oldest
   */
  each(f: ((arg0: sys.JsObj | null) => void)): void;
  /**
   * Olest item in the buffer
   */
  oldest(): sys.JsObj | null;
  /**
   * Resize this buffer with the new max size
   */
  resize(newMax: number): void;
  /**
   * Iterate from newest to oldest as long as given func returns
   * null.  If non-null is returned then break and return the
   * value.
   */
  eachWhile(f: ((arg0: sys.JsObj | null) => sys.JsObj | null)): sys.JsObj | null;
}

/**
 * MiscTest
 */
export class MiscTest extends sys.Test {
  static type$: sys.Type
  verifyCircularBuf(c: CircularBuf, expected: sys.List<sys.JsObj | null>): void;
  static make(...args: unknown[]): MiscTest;
  testCircularBuf(): void;
}

