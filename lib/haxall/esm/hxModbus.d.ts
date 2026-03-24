import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as inet from './inet.js';
import * as util from './util.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as folio from './folio.js';
import * as hx from './hx.js';
import * as hxConn from './hxConn.js';
import * as hxPlatformSerial from './hxPlatformSerial.js';

export class ModbusFloatData extends ModbusNumData {
  static type$: sys.Type
  fromRegs(regs: sys.List<number>, unit?: sys.Unit | null): sys.JsObj;
  toRegs(val: sys.JsObj): sys.List<number>;
  static make(name: string, ...args: unknown[]): ModbusFloatData;
}

/**
 * ModbusRegMapTest
 */
export class ModbusRegMapTest extends hx.HxTest {
  static type$: sys.Type
  static disInput(): ModbusAddrType;
  static holdingReg(): ModbusAddrType;
  static bit(): ModbusData;
  static coil(): ModbusAddrType;
  static s4(): ModbusData;
  static u2(): ModbusData;
  static inputReg(): ModbusAddrType;
  test(): void;
  testScale(): void;
  verifyReg(r: ModbusReg, name: string, dis: string | null, addrStr: string, addrType: ModbusAddrType, addrNum: number, data: ModbusData, unit: sys.Unit | null, tags?: sys.JsObj | null): void;
  testAddr(): void;
  static make(...args: unknown[]): ModbusRegMapTest;
  testTags(): void;
  verifyScale(scale: ModbusScale, in$: number, out: number): void;
}

/**
 * ModbusNumData
 */
export class ModbusNumData extends ModbusData {
  static type$: sys.Type
  kind(): haystack.Kind;
  wordBig(): boolean;
  size(): number;
  byteBig(): boolean;
  name(): string;
  base(): string;
  static make(name: string, ...args: unknown[]): ModbusNumData;
}

/**
 * ModbusBitData
 */
export class ModbusBitData extends ModbusData {
  static type$: sys.Type
  kind(): haystack.Kind;
  size(): number;
  pos(): number;
  name(): string;
  mask(): number;
  fromRegs(regs: sys.List<number>, unit?: sys.Unit | null): sys.JsObj;
  toRegs(val: sys.JsObj): sys.List<number>;
  static make(name: string, ...args: unknown[]): ModbusBitData;
}

/**
 * ModbusScale
 */
export class ModbusScale extends sys.Obj {
  static type$: sys.Type
  /**
   * Scale operator
   */
  op(): number;
  __op(it: number): void;
  /**
   * Numeric scale factor
   */
  factor(): haystack.Number;
  __factor(it: haystack.Number): void;
  /**
   * Compute inverse scale value.
   */
  inverse(in$: haystack.Number, factor?: haystack.Number | null): haystack.Number;
  /**
   * Compute the scaled value.
   */
  compute(in$: haystack.Number, factor?: haystack.Number | null): haystack.Number;
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): ModbusScale;
  /**
   * Constructor.
   */
  static make(f: ((arg0: ModbusScale) => void), ...args: unknown[]): ModbusScale;
}

/**
 * Modbus connector library
 */
export class ModbusLib extends hxConn.ConnLib {
  static type$: sys.Type
  onStart(): void;
  onStop(): void;
  static cur(checked?: boolean): ModbusLib | null;
  onLearn(conn: hxConn.Conn, arg: sys.JsObj | null): concurrent.Future;
  static make(...args: unknown[]): ModbusLib;
}

/**
 * ModbusRegisterMap models a specific device's register
 * mapping to/from normalized data.
 */
export class ModbusRegMap extends sys.Obj {
  static type$: sys.Type
  /**
   * List of all the registers in this map
   */
  regs(): sys.List<ModbusReg>;
  /**
   * Read a file.  This method supports an internalized cache
   * that only reloads the file if it has been modified.
   */
  static fromFile(file: sys.File): ModbusRegMap;
  /**
   * Lookup a register by its name
   */
  reg(name: string, checked?: boolean): ModbusReg | null;
  /**
   * Given a modbusConn rec, lookup its configured register map.
   * There must be `modbusRegMapUri` tag with a URI to the CSV file
   * as "fan:" URI or path relative to the project directory.
   * Raise an error if not configured correctly or CSV cannot be
   * loaded.
   */
  static fromConn(rt: hx.HxRuntime, rec: haystack.Dict): ModbusRegMap;
}

/**
 * ModbusReg models one logical register point (may span
 * multiple 16-bit words)
 */
export class ModbusReg extends sys.Obj {
  static type$: sys.Type
  /**
   * Can we read this regiter
   */
  readable(): boolean;
  __readable(it: boolean): void;
  /**
   * Data
   */
  data(): ModbusData;
  __data(it: ModbusData): void;
  /**
   * Scale factor
   */
  scale(): ModbusScale | null;
  __scale(it: ModbusScale | null): void;
  /**
   * Display name of the register
   */
  dis(): string;
  __dis(it: string): void;
  /**
   * Can we write this register
   */
  writable(): boolean;
  __writable(it: boolean): void;
  /**
   * Additional tags used for modeling the register as a point
   */
  tags(): haystack.Dict;
  __tags(it: haystack.Dict): void;
  /**
   * Unit
   */
  unit(): sys.Unit | null;
  __unit(it: sys.Unit | null): void;
  /**
   * Number of 16-bit words required to hold register value.
   */
  size(): number;
  __size(it: number): void;
  /**
   * Programatic name of the register
   */
  name(): string;
  __name(it: string): void;
  /**
   * Address
   */
  addr(): ModbusAddr;
  __addr(it: ModbusAddr): void;
  toStr(): string;
  /**
   * It-block constructor
   */
  static make(f: ((arg0: ModbusReg) => void), ...args: unknown[]): ModbusReg;
}

/**
 * Dispatch callbacks for the Modbus connector
 */
export class ModbusDispatch extends hxConn.ConnDispatch {
  static type$: sys.Type
  onSyncCur(points: sys.List<hxConn.ConnPoint>): void;
  onReceive(msg: hx.HxMsg): sys.JsObj | null;
  onClose(): void;
  onWrite(point: hxConn.ConnPoint, event: hxConn.ConnWriteInfo): void;
  onOpen(): void;
  static make(arg: sys.JsObj, ...args: unknown[]): ModbusDispatch;
  onPing(): haystack.Dict;
}

/**
 * Modbus connector functions
 */
export class ModbusFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Deprecated - use [connSyncCur()](connSyncCur())
   */
  static modbusSyncCur(points: sys.JsObj): sys.JsObj | null;
  /**
   * Return given register map contents. Do not include the file
   * extension in the name.
   * 
   * modbusRegMap("myRegisterMap")
   */
  static modbusRegMap(name: string): haystack.Grid;
  /**
   * List installed register maps including source.
   */
  static modbusRegMaps(): haystack.Grid;
  /**
   * Deprecated - use [connPing()](connPing())
   */
  static modbusPing(conn: sys.JsObj): concurrent.Future;
  /**
   * Deprecated - use [connLearn()](connLearn())
   */
  static modbusLearn(conn: sys.JsObj, arg?: sys.JsObj | null): haystack.Grid;
  /**
   * Write a value to given register name on connecter instance.
   */
  static modbusWrite(conn: sys.JsObj, reg: string, val: sys.JsObj): void;
  static make(...args: unknown[]): ModbusFuncs;
  /**
   * Read a point value for given register name on connector
   * instance. The `regs` argument may be a single `Str` name, or a `Str[]`
   * for a block read. The grid returned will contain a row for
   * each register requested and two columns: `name` and `val`.
   */
  static modbusRead(conn: sys.JsObj, regs: sys.JsObj): haystack.Grid;
}

/**
 * ModbusAddrType
 */
export class ModbusAddr extends sys.Obj {
  static type$: sys.Type
  /**
   * Qualified address which includes type prefix.
   */
  qnum(): number;
  /**
   * 40123 maps to 123
   */
  num(): number;
  /**
   * 40123 maps to holdingReg
   */
  type(): ModbusAddrType;
  /**
   * Convert back to string
   */
  toStr(): string;
  /**
   * Parse 5 or 6 digit address where leading digit must be 0, 1,
   * 3, 4 to indicate type and next 4 or 5 digits represent
   * register number
   */
  static fromStr(str: string, ...args: unknown[]): ModbusAddr;
  /**
   * Make with explicit type and register number
   */
  static make(type: ModbusAddrType, num: number, ...args: unknown[]): ModbusAddr;
}

/**
 * ModbusAddrType
 */
export class ModbusAddrType extends sys.Enum {
  static type$: sys.Type
  /**
   * List of ModbusAddrType values indexed by ordinal
   */
  static vals(): sys.List<ModbusAddrType>;
  static holdingReg(): ModbusAddrType;
  static coil(): ModbusAddrType;
  static inputReg(): ModbusAddrType;
  static discreteInput(): ModbusAddrType;
  /**
   * Is this type a numberic type (inputReg or holdingReg)?
   */
  isNum(): boolean;
  /**
   * Is this type a boolean type (coil or discreteInput)?
   */
  isBool(): boolean;
  /**
   * Localized display name for type.
   */
  toLocale(): string;
  /**
   * Back to address prefix 4, 3, 1, 0
   */
  toPrefixChar(): number;
  /**
   * Return the ModbusAddrType instance for the specified name. 
   * If not a valid name and checked is false return null,
   * otherwise throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): ModbusAddrType;
}

export class ModbusIntData extends ModbusNumData {
  static type$: sys.Type
  fromRegs(regs: sys.List<number>, unit?: sys.Unit | null): sys.JsObj;
  toRegs(val: sys.JsObj): sys.List<number>;
  static make(name: string, ...args: unknown[]): ModbusIntData;
}

/**
 * ModbusData
 */
export class ModbusData extends sys.Obj {
  static type$: sys.Type
  toStr(): string;
  /**
   * Kind for data.
   */
  kind(): haystack.Kind;
  /**
   * Get value from raw register data.
   */
  fromRegs(regs: sys.List<number>, unit?: sys.Unit | null): sys.JsObj;
  /**
   * Convert value to register data.
   */
  toRegs(val: sys.JsObj): sys.List<number>;
  /**
   * Parse data model from string.
   */
  static fromStr(s: string, checked?: boolean): ModbusData | null;
  /**
   * Number of registers required to hold data.
   */
  size(): number;
  equals(that: sys.JsObj | null): boolean;
  /**
   * Data name.
   */
  name(): string;
  static make(...args: unknown[]): ModbusData;
  hash(): number;
}

