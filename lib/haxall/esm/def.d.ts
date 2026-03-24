import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as web from './web.js';
import * as rdf from './rdf.js';
import * as xeto from './xeto.js';
import * as haystack from './haystack.js';

/**
 * Utilities
 */
export class DefUtil extends sys.Obj {
  static type$: sys.Type
  /**
   * Resolve a single Symbol/Str to a Def or return null if any
   * error
   */
  static resolve(ns: haystack.Namespace, val: sys.JsObj | null): haystack.Def | null;
  /**
   * Resolve list of Symbol/Str keys to Def[].  Silently ignore
   * errors.
   */
  static resolveList(ns: haystack.Namespace, val: sys.JsObj | null): sys.List<haystack.Def>;
  /**
   * The unique base types in the given def list.  Any defs which
   * have one of their supertypes in the list are excluded. For
   * example given a list of `equip,ahu,vav` return just `equip`
   */
  static findBaseDefs(ns: haystack.Namespace, defs: sys.List<haystack.Def>): sys.List<haystack.Def>;
  /**
   * Intersection of reflections
   */
  static intersection(reflects: sys.List<haystack.Reflection>): sys.List<haystack.Def>;
  /**
   * Implement standard `accumulate` inheritance behavior
   */
  static accumulate(a: sys.JsObj, b: sys.JsObj): sys.JsObj;
  /**
   * Tags to add to implement given def
   */
  static implement(ns: haystack.Namespace, def: haystack.Def): sys.List<haystack.Def>;
  /**
   * Given a list of atomic marker tags, expand to include valid
   * conjunct combinations.  The result is sorted by most parts
   * to least parts.
   */
  static expandMarkersToConjuncts(ns: MNamespace, markers: sys.List<haystack.Def>): sys.List<haystack.Def>;
  static make(...args: unknown[]): DefUtil;
  /**
   * Map terms (which might include conjuncts) into marker tag
   * names
   */
  static termsToTags(terms: sys.List<haystack.Def>): sys.List<string>;
  /**
   * Parse enum as ordered map of Str:Dict keyed by name.  Dict
   * tags:
   * - name: str key
   * - doc: fandoc string if available
   * 
   * Supported inputs:
   * - null returns empty list
   * - Dict of Dicts
   * - Str[] names
   * - Str newline separated names
   * - Str comma separated names
   * - Str fandoc list as - name: fandoc lines
   */
  static parseEnum(enum$: sys.JsObj | null): sys.Map<string, haystack.Dict>;
  /**
   * Return if a given tag def is a password of password subtype
   */
  static isPassword(def: haystack.Def): boolean;
  /**
   * Iterate each tag def in given term
   */
  static eachTag(ns: haystack.Namespace, term: haystack.Def, f: ((arg0: haystack.Def) => void)): void;
  /**
   * Union of reflections
   */
  static union(reflects: sys.List<haystack.Reflection>): sys.List<haystack.Def>;
  /**
   * Convenience for parseEnum which returns only a list of
   * string names.  Using this method is more efficient than
   * calling parseEnums and then mapping the keys.
   */
  static parseEnumNames(enum$: sys.JsObj | null): sys.List<string>;
}

