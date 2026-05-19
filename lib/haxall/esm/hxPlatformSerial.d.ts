import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as hx from './hx.js';

/**
 * Platform support for serial ports
 */
export class PlatformSerialLib extends hx.HxLib {
  static type$: sys.Type
  /**
   * List available ports and their current status
   */
  ports(): sys.List<SerialPort>;
  static make(...args: unknown[]): PlatformSerialLib;
  onReceive(msg: hx.HxMsg): sys.JsObj | null;
  /**
   * Lookup a serial port by its logical name
   */
  port(name: string, checked?: boolean): SerialPort | null;
  /**
   * Open a serial port with the given configuration. Raise an
   * error if the port is already bound to another owner.
   */
  open(rt: hx.HxRuntime, owner: haystack.Dict, config: SerialConfig): SerialSocket;
}

export class SerialSpiTest extends hx.HxTest {
  static type$: sys.Type
  verifyConfig(s: SerialConfig): void;
  testSpi(): void;
  testConfig(): void;
  verifyStatus(lib: PlatformSerialLib, p: SerialPort, n: string, d: string, owner: haystack.Dict | null): void;
  static make(...args: unknown[]): SerialSpiTest;
  verifyPort(p: SerialSocket, c: SerialConfig, isClosed: boolean): void;
}

/**
 * SerialConfig defines the configuration to open a {@link SerialPort | SerialPort}.
 * This class encodes all the config into a string format which
 * may be added to connectors to define how they bind to a
 * serial port.
 */
export class SerialConfig extends sys.Obj {
  static type$: sys.Type
  static parityNone(): number;
  static __parityNone(it: number): void;
  /**
   * Number of data bits to use (5..8).
   */
  data(): number;
  __data(it: number): void;
  /**
   * Partiy mode: {@link parityNone | parityNone}, {@link parityOdd | parityOdd},
   * {@link parityEven | parityEven}.
   */
  parity(): number;
  __parity(it: number): void;
  static parityOdd(): number;
  static __parityOdd(it: number): void;
  static flowXonXoff(): number;
  static __flowXonXoff(it: number): void;
  /**
   * Flow control mode: {@link flowNone | flowNone}, {@link flowRtsCts | flowRtsCts},
   * {@link flowXonXoff | flowXonXoff}
   */
  flow(): number;
  __flow(it: number): void;
  /**
   * Port baud rate (ex: 9600, 38400, 115200)
   */
  baud(): number;
  __baud(it: number): void;
  static parityEven(): number;
  static __parityEven(it: number): void;
  static flowRtsCts(): number;
  static __flowRtsCts(it: number): void;
  static flowNone(): number;
  static __flowNone(it: number): void;
  /**
   * Number of stop bits to use (1..2).
   */
  stop(): number;
  __stop(it: number): void;
  /**
   * Logical port name
   */
  name(): string;
  __name(it: string): void;
  /**
   * It-block ctor.
   */
  static make(f: ((arg0: SerialConfig) => void), ...args: unknown[]): SerialConfig;
  /**
   * Str representation:
   * ```
   * {name}-{baud}-{data}{parity}{stop}-{flow}
   * foo-115200-8n1-rtscts
   * ```
   */
  toStr(): string;
  /**
   * Parse from Str.
   */
  static fromStr(str: string, checked?: boolean, ...args: unknown[]): SerialConfig;
  /**
   * Configs are equal if every setting is equal.
   */
  equals(obj: sys.JsObj | null): boolean;
  /**
   * Hash is toStr.hash
   */
  hash(): number;
}

/**
 * SerialPort models the definition and current status of a
 * serial port.
 */
export class SerialPort extends sys.Obj {
  static type$: sys.Type
  /**
   * Meta data
   */
  meta(): haystack.Dict;
  /**
   * Logical name
   */
  name(): string;
  /**
   * Platform specific device name
   */
  device(): string;
  /**
   * Current record which opened and owns the port or null if
   * closed.
   */
  owner(): haystack.Dict | null;
  /**
   * Debug string
   */
  toStr(): string;
  /**
   * HxRuntime of the {@link owner | owner} if port is open or
   * null if closed
   */
  rt(): hx.HxRuntime | null;
  /**
   * Is this serial port currently open and bound to a connector
   */
  isOpen(): boolean;
  /**
   * Is this serial port current closed and unused
   */
  isClosed(): boolean;
  /**
   * Constructor.  The meta must have a `name` and `device` tag.
   */
  static make(meta: haystack.Dict, ...args: unknown[]): SerialPort;
}

/**
 * Serial port service provider interface. An implementation of
 * this mixin provides access to the serial ports of the host
 * platform. Concurrent access to this SPI is managed by the [SerialLib](SerialLib).
 */
export abstract class PlatformSerialSpi extends sys.Obj {
  static type$: sys.Type
  /**
   * List available ports and their current status
   */
  ports(): sys.List<SerialPort>;
  /**
   * Close this serial port
   */
  close(socket: SerialSocket): void;
  /**
   * Open a serial port with the given configuration.
   */
  open(port: SerialPort, config: SerialConfig): SerialSocket;
}

/**
 * SerialSocket provides I/O access to a serial port opened by [SerialLib.open](SerialLib.open)
 */
export class SerialSocket extends sys.Obj {
  static type$: sys.Type
  /**
   * Timeout for reads, or null for no timeout.
   */
  timeout(): sys.Duration | null;
  timeout(it: sys.Duration | null): void;
  /**
   * The serial port definition
   */
  port(): SerialPort;
  /**
   * Port configuration
   */
  config(): SerialConfig;
  /**
   * Debug string
   */
  toStr(): string;
  /**
   * Get the buffered InStream used to read from this port.
   */
  in(): sys.InStream;
  /**
   * Discard any data in read and write buffers.
   */
  purge(): this;
  /**
   * Get the buffered OutStream used to write to this port.
   */
  out(): sys.OutStream;
  /**
   * Is this port currently closed
   */
  isClosed(): boolean;
  /**
   * Logical name of port
   */
  name(): string;
  /**
   * Close this serial port
   */
  close(): void;
}

