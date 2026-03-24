import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as web from './web.js';
import * as util from './util.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as folio from './folio.js';
import * as hx from './hx.js';
import * as hxConn from './hxConn.js';
import * as oauth2 from './oauth2.js';

/**
 * Nest SDM API request
 */
export class ApiReq extends sys.Obj {
  static type$: sys.Type
  invoke(method: string, uri: sys.Uri, req?: sys.JsObj | null, headers?: sys.Map<string, string>): sys.Map | null;
}

/**
 * Nest error info
 */
export class NestErr extends sys.Err {
  static type$: sys.Type
  /**
   * Raw error information
   */
  error(): sys.Map<string, sys.JsObj | null>;
  toStr(): string;
  code(): number;
  message(): string;
  static make(error: sys.Map<string, sys.JsObj | null>, cause?: sys.Err | null, ...args: unknown[]): NestErr;
}

/**
 * Google Nest Device
 */
export class NestDevice extends NestResource {
  static type$: sys.Type
  /**
   * Get the simple name of the type
   */
  typeName(): string;
  /**
   * Get the fully qualifed device type
   */
  type(): string;
  static make(json: sys.Map, ...args: unknown[]): NestDevice;
  /**
   * Get the parent relations
   */
  parentRelations(): sys.List<ParentRelation>;
  /**
   * Get a strongly typed device type based on the json, or
   * return a basic NestDevice as fallback.
   */
  static fromJson(json: sys.Map): NestDevice;
}

export class NestRoom extends NestResource {
  static type$: sys.Type
  /**
   * Get the id of the structure this room is in
   * ```
   * enterprises/<project-id>/structures/<structure-id>/rooms/<room-id>
   * ```
   */
  structureId(): string;
  dis(): string;
  static make(json: sys.Map, ...args: unknown[]): NestRoom;
}

/**
 * Base class for all Google Nest Resource types
 */
export class NestResource extends sys.Obj {
  static type$: sys.Type
  json(): sys.Map<string, sys.JsObj | null>;
  toStr(): string;
  /**
   * Get a trait field
   */
  traitVal(trait: string, field: string): sys.JsObj | null;
  traits(): sys.Map<string, sys.JsObj | null>;
  /**
   * Custom name for this resource
   */
  dis(): string;
  /**
   * Get the full "name" of this resource. This is the relative
   * path to the resource
   */
  name(): sys.Uri;
  /**
   * Get the trait map for the given trait
   */
  trait(name: string): sys.Map;
  /**
   * The id or this particular resource. Typically this is the
   * last value in the {@link name | name} path.
   */
  id(): string;
  static make(json: sys.Map<string, sys.JsObj | null>, ...args: unknown[]): NestResource;
}

export class DevicesReq extends ApiReq {
  static type$: sys.Type
  list(): sys.List<NestDevice>;
  get(deviceId: string): NestDevice;
  exec(deviceId: string, command: string, params: sys.Map): void;
}

export class NestStructure extends NestResource {
  static type$: sys.Type
  static make(json: sys.Map, ...args: unknown[]): NestStructure;
}

/**
 * A parent relation
 */
export class ParentRelation extends sys.Obj {
  static type$: sys.Type
  /**
   * The name of the relation -- e.g., structure/room where the
   * device is assigned to
   */
  parent(): sys.Uri;
  /**
   * The custom name of the relation -- e.g., structure/room
   * where the device is assigned to.
   */
  dis(): string;
  toStr(): string;
  static make(json: sys.Map, ...args: unknown[]): ParentRelation;
}

export class StructuresReq extends ApiReq {
  static type$: sys.Type
  list(): sys.List<NestStructure>;
  get(structureId: string): NestStructure;
}

/**
 * Google Nest (SDM) Client (v1)
 */
export class Nest extends sys.Obj {
  static type$: sys.Type
  /**
   * Log
   */
  log(): sys.Log;
  /**
   * Get a room endpoint
   */
  rooms(): RoomsReq;
  /**
   * Get a devices endpoint
   */
  devices(): DevicesReq;
  /**
   * Get a structures endpoint
   */
  structures(): StructuresReq;
  static make(projectId: string, clientId: string, clientSecret: string, refreshToken: string, log?: sys.Log, ...args: unknown[]): Nest;
}

/**
 * ThermostatMode
 */
export class ThermostatMode extends sys.Enum {
  static type$: sys.Type
  /**
   * List of ThermostatMode values indexed by ordinal
   */
  static vals(): sys.List<ThermostatMode>;
  static OFF(): ThermostatMode;
  static HEAT(): ThermostatMode;
  static HEATCOOL(): ThermostatMode;
  static COOL(): ThermostatMode;
  /**
   * Return the ThermostatMode instance for the specified name. 
   * If not a valid name and checked is false return null,
   * otherwise throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): ThermostatMode;
}

/**
 * HvacStatus
 */
export class HvacStatus extends sys.Enum {
  static type$: sys.Type
  /**
   * List of HvacStatus values indexed by ordinal
   */
  static vals(): sys.List<HvacStatus>;
  static HEATING(): HvacStatus;
  static OFF(): HvacStatus;
  static COOLING(): HvacStatus;
  /**
   * Return the HvacStatus instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): HvacStatus;
}

/**
 * Nest connector library
 */
export class NestLib extends hxConn.ConnLib {
  static type$: sys.Type
  static cur(checked?: boolean): NestLib | null;
  static make(...args: unknown[]): NestLib;
}

/**
 * Nest Thermostat Device
 */
export class NestThermostat extends NestDevice {
  static type$: sys.Type
  mode(): ThermostatMode;
  connectivity(): Connectivity;
  temperature(): number;
  humidity(): number;
  static make(json: sys.Map, ...args: unknown[]): NestThermostat;
  setpoint(): sys.Map<string, number>;
  isFanOn(): boolean;
  status(): HvacStatus;
}

export class RoomsReq extends ApiReq {
  static type$: sys.Type
  list(structureId: string): sys.List<NestRoom>;
  get(structureId: string, roomId: string): NestRoom;
}

/**
 * Connectivity
 */
export class Connectivity extends sys.Enum {
  static type$: sys.Type
  /**
   * List of Connectivity values indexed by ordinal
   */
  static vals(): sys.List<Connectivity>;
  static ONLINE(): Connectivity;
  static OFFLINE(): Connectivity;
  isOnline(): boolean;
  /**
   * Return the Connectivity instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): Connectivity;
}

export class NestDispatch extends hxConn.ConnDispatch {
  static type$: sys.Type
  onSyncCur(points: sys.List<hxConn.ConnPoint>): void;
  onClose(): void;
  onLearn(arg: sys.JsObj | null): haystack.Grid;
  onWrite(point: hxConn.ConnPoint, event: hxConn.ConnWriteInfo): void;
  onOpen(): void;
  static make(arg: sys.JsObj, ...args: unknown[]): NestDispatch;
  onPing(): haystack.Dict;
}

