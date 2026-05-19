import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as haystack from './haystack.js';
import * as obs from './obs.js';
import * as axon from './axon.js';
import * as folio from './folio.js';
import * as hx from './hx.js';
import * as hxUtil from './hxUtil.js';

/**
 * ConvertTest
 */
export class ConvertTest extends hx.HxTest {
  static type$: sys.Type
  lib(): PointLib | null;
  lib(it: PointLib | null): void;
  verifyEnumDef(e: EnumDef, name: string, code: number): void;
  verifyEnumBad(e: EnumDef): void;
  doCache(): void;
  doParse(): void;
  doFunc(): void;
  verifyStrToBool(s: string, fs: sys.List<string>, ts: sys.List<string>, toStr?: string): void;
  doEnums(): void;
  doEnumConverts(): void;
  verifyFuncConvert(rec: sys.JsObj | null, pattern: string, from$: sys.JsObj | null, expected: sys.JsObj | null): void;
  doThermistor(): void;
  test(): void;
  verifyThermistor(c: PointConvert, ohms: number, degF: number): void;
  doTypeConverts(): void;
  verifyParse(s: string, in$: sys.JsObj | null, out: sys.JsObj | null, type: sys.Type, x?: sys.JsObj | null): void;
  doUnit(): void;
  static make(...args: unknown[]): ConvertTest;
  verifyConvert(c: PointConvert, rec: haystack.Dict, val: sys.JsObj | null, expected: sys.JsObj | null): void;
  verifyUnit(s: string, from$: number, expected: number): void;
  doBool(): void;
}

/**
 * Point utilties
 */
export class PointUtil extends sys.Obj {
  static type$: sys.Type
  /**
   * Is given point tagged for history collection
   */
  static isHisCollect(pt: haystack.Dict): boolean;
  /**
   * Get the standard point details string
   */
  static pointDetails(lib: PointLib, pt: haystack.Dict, isTop: boolean): string;
  /**
   * Implementation for the toOccupied function
   */
  static toOccupied(r: haystack.Dict, checked: boolean, cx: hx.HxContext): haystack.Dict | null;
  /**
   * Default or check numeric point unit
   */
  static applyUnit(pt: haystack.Dict, val: sys.JsObj | null, action: string): sys.JsObj | null;
  static make(...args: unknown[]): PointUtil;
}

/**
 * Point historization and writable support
 */
export class PointLib extends hx.HxLib {
  static type$: sys.Type
  /**
   * Return list of observables this library publishes
   */
  observables(): sys.List<obs.Observable>;
  /**
   * Should we collect bad data as NA or just omit it
   */
  hisCollectNA(): boolean;
  /**
   * Start callback
   */
  onStart(): void;
  /**
   * Steady state callback
   */
  onSteadyState(): void;
  static make(...args: unknown[]): PointLib;
  /**
   * Stop callback
   */
  onStop(): void;
  /**
   * Publish the HxPointWriteService
   */
  services(): sys.List<hx.HxService>;
}

/**
 * PointRecSetTest
 */
export class PointRecSetTest extends hx.HxTest {
  static type$: sys.Type
  testToOccupied(): void;
  testMatchPointVal(): void;
  testSets(): void;
  verifyToSet($axon: string, recs: sys.List<haystack.Dict | null>): void;
  static make(...args: unknown[]): PointRecSetTest;
}

/**
 * WriteTest
 */
export class WriteTest extends hx.HxTest {
  static type$: sys.Type
  testWrites(): void;
  verifyWrite(lib: PointLib, pt: haystack.Dict, val: sys.JsObj | null, level: number, levels: sys.Map<number, sys.JsObj | null>): haystack.Grid;
  testObservable(): void;
  static make(...args: unknown[]): WriteTest;
}

/**
 * Point module Axon functions
 */
export class PointFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Set the relinquish default value (level-17) of writable
   * point. See {@link pointWrite | pointWrite}.
   */
  static pointSetDef(point: sys.JsObj, val: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return grid of thermistor table names as grid with one `name`
   * column
   */
  static pointThermistorTables(): haystack.Grid;
  /**
   * Return if a point value matches a given critera:
   * - match any values which are equal via `==` operator
   * - zero matches false (0% ==> false)
   * - non-zero matches true (not 0% ==> true)
   * - numerics can be matches with range
   * - match can be a function which takes the value
   * 
   * Examples:
   * ```
   * matchPointVal(false, false)     >>  true
   * matchPointVal(0, false)         >>  true
   * matchPointVal(33, false)        >>  false
   * matchPointVal(33, true)         >>  true
   * matchPointVal(33, 0..40)        >>  true
   * matchPointVal(90, 0..40)        >>  false
   * matchPointVal(4) x => x.isEven  >>  true
   * ```
   */
  static matchPointVal(val: sys.JsObj | null, match: sys.JsObj | null): boolean;
  /**
   * User level-1 manual override of writable point. See {@link pointWrite | pointWrite}.
   */
  static pointEmergencyOverride(point: sys.JsObj, val: sys.JsObj | null): sys.JsObj | null;
  /**
   * User level-1 manual auto (override release) of writable
   * point. See {@link pointWrite | pointWrite}.
   */
  static pointEmergencyAuto(point: sys.JsObj): sys.JsObj | null;
  /**
   * Issue a point override command based on current user's
   * access control permissions
   */
  static pointOverrideCommand(point: sys.JsObj, val: sys.JsObj | null, level: haystack.Number, duration?: haystack.Number | null): sys.JsObj | null;
  /**
   * Get debug string for point including writables and his
   * collection. The argument is anything acceptable by [toRec()](toRec()).
   * The result is returned as a plain text string.
   * 
   * Examples:
   * ```
   * read(dis=="My Point").pointDetails
   * pointDetails(@2b80f96a-820a4f1a)
   * ```
   */
  static pointDetails(point: sys.JsObj): string;
  /**
   * Map a set of recs to to a grid of [points](point).  The `recs`
   * parameter may be any value accepted by [toRecList()](toRecList()).
   * Return empty grid if no mapping is found.  The following
   * mappings are supported:
   * - recs with `point` tag are mapped as themselves
   * - recs with `site` are mapped to points with parent `siteRef`
   * - recs with `space` are mapped to points with parent `spaceRef`
   * - recs with `equip` are mapped to points with parent `equipRef`
   * - recs with `device` are mapped to points with parent `deviceRef`
   * 
   * Examples:
   * ```
   * read(site).toPoints      // return children points within site
   * read(space).toPoints     // return children points within space
   * read(equip).toPoints     // return children points within equip
   * read(device).toPoints    // return children points within device
   * ```
   */
  static toPoints(recs: sys.JsObj | null): haystack.Grid;
  /**
   * User level-8 manual override of writable point. If duration
   * is specified it must be a number with unit of time that
   * indicates how long to put the point into override.  After
   * the duration expires, the point is set back to auto (null).
   * See {@link pointWrite | pointWrite}.
   */
  static pointOverride(point: sys.JsObj, val: sys.JsObj | null, duration?: haystack.Number | null): sys.JsObj | null;
  /**
   * Map a set of recs to to a grid of [equips](equip).  The `recs`
   * parameter may be any value accepted by [toRecList()](toRecList()).
   * Return empty grid if no mapping is found.  The following
   * mappings are supported:
   * - recs with `equip` tag are mapped as themselves
   * - recs with `equipRef` tag are mapped to their parent equip
   * - recs with `site` are mapped to equip with parent `siteRef`
   * - recs with `space` are mapped to equip with parent `spaceRef`
   * 
   * Examples:
   * ```
   * read(site).toEquips      // return children equip within site
   * read(space).toEquips     // return children equip within space
   * read(equip).toEquips     // return equip itself
   * read(point).toEquips     // return point's parent equip
   * ```
   */
  static toEquips(recs: sys.JsObj | null): haystack.Grid;
  static make(...args: unknown[]): PointFuncs;
  /**
   * Map a set of recs to to a grid of [spaces](space).  The `recs`
   * parameter may be any value accepted by [toRecList()](toRecList()).
   * Return empty grid if no mapping is found.  The following
   * mappings are supported:
   * - recs with `space` tag are mapped as themselves
   * - recs with `spaceRef` tag are mapped to their parent space
   * - recs with `site` are mapped to spaces with parent `siteRef`
   * 
   * Examples:
   * ```
   * read(site).toSpaces      // return children spaces within site
   * read(equip).toSpaces     // return equip's parent space
   * read(point).toSpaces     // return point's parent space
   * read(space).toSpaces     // return space itself
   * ```
   */
  static toSpaces(recs: sys.JsObj | null): haystack.Grid;
  /**
   * Evaluate a [point conversion](ext-point::doc#convert). First
   * parameter is point to test (anything accepted by [toRec](toRec))
   * or null to use empty dict.
   * 
   * Examples:
   * ```
   * pointConvert(null, "+ 2 * 10", 3)
   * pointConvert(null, "hexToNumber()", "ff")
   * pointConvert(null, "°C => °F", 20°C)
   * ```
   */
  static pointConvert(pt: sys.JsObj | null, convert: string, val: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return grid of current enum defs defined by [enumMeta](enumMeta).
   * This call forces a refresh of the definitions.
   */
  static enumDefs(): haystack.Grid;
  /**
   * User level-8 manual auto (override release) of writable
   * point. See {@link pointWrite | pointWrite}.
   */
  static pointAuto(point: sys.JsObj): sys.JsObj | null;
  /**
   * Set a writable point's priority array value at the given
   * level. The point may be any value accepted by [toRec](toRec).
   * Level must be 1 to 17 (where 17 represents def value).  The
   * who parameter is a string which represent debugging
   * information about which user or application is writing to
   * this priorirty array level. If who is omitted, then the
   * current user's display string is used
   */
  static pointWrite(point: sys.JsObj, val: sys.JsObj | null, level: haystack.Number | null, who?: sys.JsObj | null, opts?: haystack.Dict | null): sys.JsObj | null;
  /**
   * Return definition of given enum def defined by [enumMeta](enumMeta)
   * This call forces a refresh of the definitions.
   */
  static enumDef(id: string, checked?: boolean): haystack.Grid | null;
  /**
   * Map a set of recs to to a grid of [sites](site).  The `recs`
   * parameter may be any value accepted by [toRecList()](toRecList()).
   * Return empty grid if no mapping is found.  The following
   * mappings are supported:
   * - recs with `site` tag are mapped as themselves
   * - recs with `siteRef` tag are mapped to their parent site
   * 
   * Examples:
   * ```
   * read(site).toSites     // return site itself
   * read(space).toSites    // return space's parent site
   * read(equip).toSites    // return equip's parent site
   * read(point).toSites    // return point's parent site
   * ```
   */
  static toSites(recs: sys.JsObj | null): haystack.Grid;
  /**
   * Write all hisCollect items buffered in memory to the
   * historian. Block until complete or until timeout exceeded.
   */
  static hisCollectWriteAll(timeout?: haystack.Number | null): sys.JsObj | null;
  /**
   * Map a set of recs to to a grid of [devices](device).  The `recs`
   * parameter may be any value accepted by [toRecList()](toRecList()).
   * Return empty grid if no mapping is found.  The following
   * mappings are supported:
   * - recs with `device` tag are mapped as themselves
   * - recs with `deviceRef` tag are mapped to their parent device
   * - recs with `site` are mapped to devices with parent `siteRef`
   * - recs with `space` are mapped to devices with parent `spaceRef`
   * - recs with `equip` are mapped to devices with parent `equipRef`
   * 
   * Examples:
   * ```
   * read(site).toDevices      // return children devices within site
   * read(space).toDevices     // return children devices within space
   * read(equip).toDevices     // return children devices within equip
   * read(point).toDevices     // return point's parent device
   * ```
   */
  static toDevices(recs: sys.JsObj | null): haystack.Grid;
  /**
   * Given a `equip` record Dict, return a grid of its points. If
   * this function is overridden you MUST NOT use an XQuery to
   * resolve points; this function must return local only points.
   */
  static equipToPoints(equip: sys.JsObj): haystack.Grid;
  /**
   * Return the current priority array state of a writable point.
   * The point may be any value accepted by [toRec](toRec).  The
   * result is returned grid with following columns:
   * - level: number from 1 - 17 (17 is default)
   * - levelDis: human description of level
   * - val: current value at level or null
   * - who: who last controlled the value at this level
   */
  static pointWriteArray(point: sys.JsObj): haystack.Grid;
  /**
   * Given a [site](site), [space](space), [equip](equip), or [point](point)
   * rec, get its [occupied](occupied) point.  The following
   * algorithm is used to lookup the occupied point:
   * 1. Try to find in equip or parent of nested equip
   * 2. Try to find in space or parent of nested spaces
   * 3. Try to find in site if site if tagged as [sitePoint](sitePoint)
   * 
   * If there are no matches or multiple ambiguous matches, then
   * return null or raise an exception based on checked flag.
   */
  static toOccupied(rec: sys.JsObj | null, checked?: boolean): haystack.Dict | null;
}

/**
 * RosterTest
 */
export class RosterTest extends hx.HxTest {
  static type$: sys.Type
  lib(): PointLib | null;
  lib(it: PointLib | null): void;
  verifyEnumDef(e: EnumDef, name: string, code: number): void;
  verifyWritable(id: haystack.Ref, val: sys.JsObj | null, level: number): haystack.Grid;
  verifyHisCollects(): void;
  test(): void;
  verifyHisCollectWatch(recs: sys.List<haystack.Dict>): void;
  verifyWritables(): void;
  verifyHisCollect(id: haystack.Ref, interval: sys.Duration | null, cov: boolean): void;
  writeArray(id: haystack.Ref): haystack.Grid;
  static make(...args: unknown[]): RosterTest;
  verifyNotWritable(id: haystack.Ref): void;
  verifyEnumMeta(): void;
  verifyNotHisCollect(id: haystack.Ref): void;
}

/**
 * HisCollectTest
 */
export class HisCollectTest extends hx.HxTest {
  static type$: sys.Type
  verifyConfig(lib: PointLib, ptTags: sys.Map<string, sys.JsObj>, interval: string, cov: string, rateLimit: string, writeFreq: string): void;
  testConfig(): void;
  static make(...args: unknown[]): HisCollectTest;
}

