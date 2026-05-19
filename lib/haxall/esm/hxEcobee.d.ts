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
 * Ecobee API request
 */
export class ApiReq extends sys.Obj {
  static type$: sys.Type
  invoke(method: string, uri: sys.Uri, req?: sys.JsObj | null, headers?: sys.Map<string, string>): sys.Map;
  /**
   * Convenience to do a GET to an ecobee endpoint. Handles
   * setting the Content-Type and encoding the json into the
   * request uri.
   */
  invokeGet(endpoint: sys.Uri, obj: EcobeeObj, page?: number | null): EcobeeObj;
  static make(client: oauth2.OAuthClient, log?: sys.Log | null, ...args: unknown[]): ApiReq;
}

/**
 * Selection object
 */
export class EcobeeSelection extends EcobeeObj {
  static type$: sys.Type
  /**
   * Include the thermostat's unacknowledged alert objects
   */
  includeAlerts(): boolean;
  __includeAlerts(it: boolean): void;
  /**
   * Include the current security settings object for the
   * selected thermostat(s)
   */
  includeSecurity(): boolean;
  __includeSecurity(it: boolean): void;
  /**
   * Include the thermostat management company object
   */
  includeManagement(): boolean;
  __includeManagement(it: boolean): void;
  /**
   * Include the thermostat technician object
   */
  includeTechnician(): boolean;
  __includeTechnician(it: boolean): void;
  /**
   * Include the current thermostat privacy settings
   */
  includePrivacy(): boolean;
  __includePrivacy(it: boolean): void;
  /**
   * Include the thermostat runtime object
   */
  includeRuntime(): boolean;
  __includeRuntime(it: boolean): void;
  /**
   * Include the thermostat settings object
   */
  includeSettings(): boolean;
  __includeSettings(it: boolean): void;
  /**
   * The type of match data supplied
   */
  selectionType(): SelectionType;
  __selectionType(it: SelectionType): void;
  /**
   * Include the current firmware version the Thermostat is
   * running
   */
  includeVersion(): boolean;
  __includeVersion(it: boolean): void;
  /**
   * Include the extended thermostat runtime object
   */
  includeExtendedRuntime(): boolean;
  __includeExtendedRuntime(it: boolean): void;
  /**
   * Include the current thermostat weather forecast object
   */
  includeWeather(): boolean;
  __includeWeather(it: boolean): void;
  /**
   * Include the thermostat utility company object
   */
  includeUtility(): boolean;
  __includeUtility(it: boolean): void;
  /**
   * Include the current thermostat equipment status information
   */
  includeEquipmentStatus(): boolean;
  __includeEquipmentStatus(it: boolean): void;
  /**
   * Include the energy configuration for the selected
   * thermostat(s)
   */
  includeEnergy(): boolean;
  __includeEnergy(it: boolean): void;
  /**
   * Include the thermostat calendar events objects
   */
  includeEvents(): boolean;
  __includeEvents(it: boolean): void;
  /**
   * Include the thermostat program object
   */
  includeProgram(): boolean;
  __includeProgram(it: boolean): void;
  /**
   * Include the audio configuration for the selected
   * thermostat(s)
   */
  includeAudid(): boolean;
  __includeAudid(it: boolean): void;
  /**
   * Include the current thermostat equipment status information
   */
  includeNotificationSettings(): boolean;
  __includeNotificationSettings(it: boolean): void;
  /**
   * Include the list of current thermostat remote sensor objects
   * for the selected thermostat(s)
   */
  includeSensors(): boolean;
  __includeSensors(it: boolean): void;
  /**
   * The match data based on selection type (e.g. a list of
   * thermostat identifiers)
   */
  selectionMatch(): string;
  __selectionMatch(it: string): void;
  /**
   * Include the current thermostat house details object
   */
  includeHouseDetails(): boolean;
  __includeHouseDetails(it: boolean): void;
  /**
   * Include the current thermostat OemCfg object
   */
  includeOemCfg(): boolean;
  __includeOemCfg(it: boolean): void;
  /**
   * Include the thermostat location object
   */
  includeLocation(): boolean;
  __includeLocation(it: boolean): void;
  includeCapabilities(): boolean;
  __includeCapabilities(it: boolean): void;
  /**
   * Include the thermostat device configuration objects
   */
  includeDevice(): boolean;
  __includeDevice(it: boolean): void;
  static make(f: ((arg0: EcobeeSelection) => void), ...args: unknown[]): EcobeeSelection;
  static makeThermostats(match: string, ...args: unknown[]): EcobeeSelection;
}

/**
 * RemoteSensorCapability object
 */
export class EcobeeRemoteSensorCapability extends EcobeeObj {
  static type$: sys.Type
  /**
   * The type of sensor capability.
   */
  type(): string | null;
  __type(it: string | null): void;
  /**
   * The unique sensor capability identifer
   * 
   * Note: the sensor id has no relation to its type
   */
  id(): string | null;
  __id(it: string | null): void;
  /**
   * The data value for this capability, always a string.
   */
  value(): string | null;
  __value(it: string | null): void;
  static make(f: ((arg0: EcobeeRemoteSensorCapability) => void), ...args: unknown[]): EcobeeRemoteSensorCapability;
}

/**
 * Ecobee connector library
 */
export class EcobeeLib extends hxConn.ConnLib {
  static type$: sys.Type
  static cur(checked?: boolean): EcobeeLib | null;
  static make(...args: unknown[]): EcobeeLib;
}

/**
 * ThermostatResp
 */
export class ThermostatResp extends EcobeeResp {
  static type$: sys.Type
  thermostatList(): sys.List<EcobeeThermostat>;
  __thermostatList(it: sys.List<EcobeeThermostat>): void;
  static make(f: ((arg0: ThermostatResp) => void), ...args: unknown[]): ThermostatResp;
}

/**
 * Ecobee connector funcs
 */
export class EcobeeFuncs extends sys.Obj {
  static type$: sys.Type
  static make(...args: unknown[]): EcobeeFuncs;
}

/**
 * Ecobee client
 */
export class Ecobee extends sys.Obj {
  static type$: sys.Type
  /**
   * Log
   */
  log(): sys.Log;
  /**
   * Get the thermostat api endpoint
   */
  thermostat(): ThermostatReq;
  /**
   * Get the report api endpoint
   */
  report(): ReportReq;
  static make(clientId: string, refreshToken: string, log?: sys.Log, ...args: unknown[]): Ecobee;
}

/**
 * Base class for all Ecobee objects
 */
export class EcobeeObj extends sys.Obj {
  static type$: sys.Type
  /**
   * If this object was constructed from a web response, this is
   * the raw decoded JSON object.
   */
  resJson(): sys.Map<string, sys.JsObj | null> | null;
  /**
   * Encode this object to a JSON string
   */
  encode(): string;
  /**
   * Get the name of the json key for this object when it is
   * stored as the value in a json map.
   * ```
   * Example:
   * EcobeeSelection => selection
   * ```
   */
  jsonKey(): string;
  /**
   * Return the unique object id for this object if it has one;
   * otherwise return null
   */
  id(): string | null;
  static make(...args: unknown[]): EcobeeObj;
}

/**
 * RuntimeReportResp
 */
export class RuntimeReportResp extends EcobeeResp {
  static type$: sys.Type
  /**
   * The report UTC end date
   */
  endDate(): sys.Date;
  __endDate(it: sys.Date): void;
  /**
   * The CSV list of column names from the request.
   */
  columns(): string;
  __columns(it: string): void;
  /**
   * The report start interval
   */
  startInterval(): number;
  __startInterval(it: number): void;
  /**
   * The report end interval
   */
  endInterval(): number;
  __endInterval(it: number): void;
  /**
   * A list of runtime reports
   */
  reportList(): sys.List<EcobeeRuntimeReport>;
  __reportList(it: sys.List<EcobeeRuntimeReport>): void;
  /**
   * The report UTC start date
   */
  startDate(): sys.Date;
  __startDate(it: sys.Date): void;
  static make(f: ((arg0: RuntimeReportResp) => void), ...args: unknown[]): RuntimeReportResp;
}

/**
 * RuntimeReport object
 */
export class EcobeeRuntimeReport extends EcobeeObj {
  static type$: sys.Type
  /**
   * The thermostat identifier for the report
   */
  thermostatIdentifier(): string | null;
  __thermostatIdentifier(it: string | null): void;
  /**
   * A list of CSV report string based on the columns requested A
   * runtime report row is composed of a CSV string containing
   * the Date, Time, and the user selected columns.
   */
  rowList(): sys.List<string>;
  __rowList(it: sys.List<string>): void;
  /**
   * The number of report rows in this report
   */
  rowCount(): number | null;
  __rowCount(it: number | null): void;
  id(): string | null;
  static make(f: ((arg0: EcobeeRuntimeReport) => void), ...args: unknown[]): EcobeeRuntimeReport;
}

/**
 * Contains the result of a thermostat summary request.
 */
export class ThermostatSummaryResp extends EcobeeResp {
  static type$: sys.Type
  /**
   * The list of CSV revision values
   */
  revisionList(): sys.List<ThermostatRev>;
  __revisionList(it: sys.List<ThermostatRev>): void;
  /**
   * The list of CSV status values
   */
  statusList(): sys.List<EquipmentStatus>;
  __statusList(it: sys.List<EquipmentStatus>): void;
  /**
   * Number of thermostats listed in the revision list
   */
  thermostatCount(): number;
  __thermostatCount(it: number): void;
  /**
   * Get the thermostat revisions mapped by thermostat identifier
   */
  revisions(): sys.Map<string, ThermostatRev>;
  static make(f: ((arg0: ThermostatSummaryResp) => void), ...args: unknown[]): ThermostatSummaryResp;
}

/**
 * Event object
 */
export class EcobeeEvent extends EcobeeObj {
  static type$: sys.Type
  /**
   * The type of event. Values: hold, demandResponse, sensor,
   * switchOccupancy, vacation, quickSave, today, autoAway,
   * autoHome
   */
  type(): string | null;
  __type(it: string | null): void;
  /**
   * Whether the event is currently active or not
   */
  running(): boolean | null;
  __running(it: boolean | null): void;
  /**
   * The cooling absolute temperature to set
   */
  coolHoldTemp(): number | null;
  __coolHoldTemp(it: number | null): void;
  /**
   * The unique event name
   */
  name(): string | null;
  __name(it: string | null): void;
  /**
   * The heating absolute temperature to set
   */
  heatHoldTemp(): number | null;
  __heatHoldTemp(it: number | null): void;
  static make(f: ((arg0: EcobeeEvent) => void), ...args: unknown[]): EcobeeEvent;
}

/**
 * Page object
 */
export class EcobeePage extends EcobeeObj {
  static type$: sys.Type
  /**
   * The number of objects on this page
   */
  pageSize(): number | null;
  __pageSize(it: number | null): void;
  /**
   * The total number of objects available
   */
  total(): number | null;
  __total(it: number | null): void;
  /**
   * The total pages available
   */
  totalPages(): number | null;
  __totalPages(it: number | null): void;
  /**
   * The page retrieved or, in the case of a request parameter,
   * the specific page requested
   */
  page(): number | null;
  __page(it: number | null): void;
  static makeReq(page: number, ...args: unknown[]): EcobeePage;
  /**
   * Are there more pages to fetch. If this returned true, then
   * all fields can be assumed to be non-null.
   */
  morePages(): boolean;
  static make(f: ((arg0: EcobeePage) => void), ...args: unknown[]): EcobeePage;
}

/**
 * RuntimeReportReq
 */
export class RuntimeReportReq extends EcobeeObj {
  static type$: sys.Type
  /**
   * The UTC report end date
   */
  endDate(): sys.Date;
  __endDate(it: sys.Date): void;
  /**
   * A CSV string of column names. No spaces in CSV.
   */
  columns(): string;
  __columns(it: string): void;
  includeSensors(): boolean | null;
  __includeSensors(it: boolean | null): void;
  selection(): EcobeeSelection;
  __selection(it: EcobeeSelection): void;
  /**
   * The report start interval
   */
  startInterval(): number | null;
  __startInterval(it: number | null): void;
  /**
   * The UTC report start date
   */
  startDate(): sys.Date;
  __startDate(it: sys.Date): void;
  /**
   * The report end interval
   */
  endInterval(): number | null;
  __endInterval(it: number | null): void;
  static make(f: ((arg0: RuntimeReportReq) => void), ...args: unknown[]): RuntimeReportReq;
}

/**
 * Function object
 */
export class EcobeeFunction extends EcobeeObj {
  static type$: sys.Type
  /**
   * The function type name
   */
  type(): string | null;
  __type(it: string | null): void;
  /**
   * The function parameters
   */
  params(): sys.Map | null;
  __params(it: sys.Map | null): void;
  static makeFields(type: string, params: sys.Map, ...args: unknown[]): EcobeeFunction;
  static make(f: ((arg0: EcobeeFunction) => void), ...args: unknown[]): EcobeeFunction;
}

/**
 * Ecobee Report Request API
 */
export class ReportReq extends ApiReq {
  static type$: sys.Type
  runtime(req: RuntimeReportReq): RuntimeReportResp;
}

/**
 * Thermostat object
 */
export class EcobeeThermostat extends EcobeeObj {
  static type$: sys.Type
  /**
   * The list of remote sensor objects for this thermostat
   */
  remoteSensors(): sys.List<EcobeeRemoteSensor> | null;
  __remoteSensors(it: sys.List<EcobeeRemoteSensor> | null): void;
  /**
   * The comma-separated list of the thermostat's additoinal
   * features, if any
   */
  features(): string | null;
  __features(it: string | null): void;
  utcTime(): sys.DateTime | null;
  __utcTime(it: sys.DateTime | null): void;
  /**
   * The thermostat brand
   */
  brand(): string | null;
  __brand(it: string | null): void;
  /**
   * The unique thermostat serial number
   */
  identifier(): string | null;
  __identifier(it: string | null): void;
  /**
   * The thermostat settings object
   */
  settings(): EcobeeSettings | null;
  __settings(it: EcobeeSettings | null): void;
  /**
   * The current thermostat configuration revision
   */
  thermostatRev(): string | null;
  __thermostatRev(it: string | null): void;
  /**
   * The runtime state object
   */
  runtime(): EcobeeRuntime | null;
  __runtime(it: EcobeeRuntime | null): void;
  /**
   * The version object containing the firmware version for the
   * thermostat
   */
  version(): EcobeeVersion | null;
  __version(it: EcobeeVersion | null): void;
  /**
   * The status of all equipment controlled by this Thermostat.
   * Only running equipment is listed in the CSV String.
   */
  equipmentStatus(): string | null;
  __equipmentStatus(it: string | null): void;
  /**
   * A user defined name for the thermostat
   */
  name(): string | null;
  __name(it: string | null): void;
  /**
   * Whether the user registered the thermostat
   */
  isRegistered(): boolean | null;
  __isRegistered(it: boolean | null): void;
  /**
   * The thermostat model number
   */
  modelNumber(): string | null;
  __modelNumber(it: string | null): void;
  id(): string | null;
  static make(f: ((arg0: EcobeeThermostat) => void), ...args: unknown[]): EcobeeThermostat;
}

/**
 * Ecobee selection type enum
 */
export class SelectionType extends sys.Enum {
  static type$: sys.Type
  static thermostats(): SelectionType;
  /**
   * List of SelectionType values indexed by ordinal
   */
  static vals(): sys.List<SelectionType>;
  static registered(): SelectionType;
  static managementSet(): SelectionType;
  /**
   * Return the SelectionType instance for the specified name. 
   * If not a valid name and checked is false return null,
   * otherwise throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): SelectionType;
}

export class EcobeeDispatch extends hxConn.ConnDispatch {
  static type$: sys.Type
  onSyncCur(points: sys.List<hxConn.ConnPoint>): void;
  onClose(): void;
  onLearn(arg: sys.JsObj | null): haystack.Grid;
  onWrite(point: hxConn.ConnPoint, event: hxConn.ConnWriteInfo): void;
  onSyncHis(point: hxConn.ConnPoint, span: haystack.Span): sys.JsObj | null;
  onOpen(): void;
  static make(arg: sys.JsObj, ...args: unknown[]): EcobeeDispatch;
  onPing(): haystack.Dict;
}

/**
 * Encode an ecobee object to JSON
 */
export class EcobeeEncoder extends sys.Obj {
  static type$: sys.Type
  static encode(val: sys.JsObj | null): sys.JsObj | null;
  encodeMap(val: sys.Map): sys.Map;
  encodeObj(obj: EcobeeObj): sys.JsObj;
  static jsonStr(val: sys.JsObj | null): string;
  encodeEnum(val: sys.Enum): sys.JsObj;
  encodeVal(val: sys.JsObj | null): sys.JsObj | null;
  encodeList(val: sys.List): sys.List;
  static make(...args: unknown[]): EcobeeEncoder;
}

/**
 * EquipmentStatus
 */
export class EquipmentStatus extends sys.Obj {
  static type$: sys.Type
  /**
   * The thermostat identifier
   */
  id(): string;
  __id(it: string): void;
  /**
   * The equipment status (if the equipment is currently running)
   */
  status(): string;
  __status(it: string): void;
  static fromStr(csv: string, ...args: unknown[]): EquipmentStatus;
  static make(f: ((arg0: EquipmentStatus) => void), ...args: unknown[]): EquipmentStatus;
}

/**
 * ThermostatRev
 */
export class ThermostatRev extends sys.Obj {
  static type$: sys.Type
  /**
   * The current revision of the thermostat runtime settings.
   * This revision is incremented whenever the thermostat
   * transmits a new status message, or updates the equipment
   * state, or Remote Sensor readings. The shortest interval this
   * revision may change is 3 minutes.
   */
  runtimeRev(): string;
  __runtimeRev(it: string): void;
  /**
   * Current thermostat revision. The revision is incremented
   * whenever the thermostat program, hvac mode, settings, or
   * configuration change. Changes to the following objects will
   * update the thermostat revision:
   * - Settings
   * - Program
   * - Event
   * - Device
   */
  thermostatRev(): string;
  __thermostatRev(it: string): void;
  /**
   * Current revision of the thermostat alarms. This revision is
   * incremented whenever a new Alert is issued or an Alert is
   * modified (acknowledge or deferred).
   */
  alertsRev(): string;
  __alertsRev(it: string): void;
  /**
   * Is the thermostat currently connected to ecobee servers
   */
  connected(): boolean;
  __connected(it: boolean): void;
  /**
   * The thermostat name
   */
  name(): string;
  __name(it: string): void;
  /**
   * The thermostat identifier
   */
  id(): string;
  __id(it: string): void;
  /**
   * The current revision of the thermostat interval runtime
   * settings. This revision is incremented whenever the
   * thermostat transmits a new status message in the form of a
   * Runtime object. The thermostat updates this on a 15 minute
   * interval.
   */
  intervalRev(): string;
  __intervalRev(it: string): void;
  /**
   * Decode the thermostat revision from its CSV format
   */
  static fromStr(csv: string, ...args: unknown[]): ThermostatRev;
  static make(f: ((arg0: ThermostatRev) => void), ...args: unknown[]): ThermostatRev;
}

/**
 * Ecobee error info
 */
export class EcobeeErr extends sys.Err {
  static type$: sys.Type
  /**
   * Status
   */
  status(): EcobeeStatus;
  toStr(): string;
  code(): number;
  message(): string;
  static make(status: EcobeeStatus, cause?: sys.Err | null, ...args: unknown[]): EcobeeErr;
}

/**
 * Settings object
 */
export class EcobeeSettings extends EcobeeObj {
  static type$: sys.Type
  /**
   * When set to true if a sensor has detected presence for more
   * than 10 minutes then include that sensor in temp average. If
   * no activity has been seen on a sensor for more than 1 hour
   * then remove this sensor from temperature average.
   */
  followMeComfort(): boolean | null;
  __followMeComfort(it: boolean | null): void;
  /**
   * Whether fan control by the Thermostat is required in
   * auxiliary heating (gas/electric/boiler), otherwise
   * controlled by furnace.
   */
  fanControlRequired(): boolean | null;
  __fanControlRequired(it: boolean | null): void;
  /**
   * The flag to tell if the heat pump is in heating mode or in
   * cooling when the relay is engaged. If set to zero it's
   * heating when the reversing valve is open, cooling when
   * closed and if it's one - it's the opposite.
   */
  heatPumpReversalOnCool(): boolean | null;
  __heatPumpReversalOnCool(it: boolean | null): void;
  /**
   * This Boolean field represents whether the HVAC system has a
   * UV filter. The default value is true.
   */
  hasUVFilter(): boolean | null;
  __hasUVFilter(it: boolean | null): void;
  /**
   * This read-only field represents the type of ventilator
   * present for the Thermostat. The possible values are none,
   * ventilator, hrv, and erv.
   */
  ventilatorType(): string | null;
  __ventilatorType(it: string | null): void;
  /**
   * The minimum humidity level (in percent) set point for the
   * humidifier
   */
  humidity(): string | null;
  __humidity(it: string | null): void;
  /**
   * The integer representation of the user access settings. See
   * the SecuritySettings object for more information.
   */
  userAccessSetting(): number | null;
  __userAccessSetting(it: number | null): void;
  /**
   * Whether to send an alert when service is required again.
   */
  serviceRemindMe(): boolean | null;
  __serviceRemindMe(it: boolean | null): void;
  /**
   * Whether the thermostat is connected to a dehumidifier. If
   * true or dehumidifyOvercoolOffset > 0 then allow setting
   * dehumidifierMode and dehumidifierLevel.
   */
  hasDehumidifier(): boolean | null;
  __hasDehumidifier(it: boolean | null): void;
  /**
   * The temperature at which an auxHeat temperature alert is
   * triggered.
   */
  auxRuntimeAlert(): number | null;
  __auxRuntimeAlert(it: number | null): void;
  /**
   * The maximum automated set point set back offset allowed in
   * degress
   */
  maxSetBack(): number | null;
  __maxSetBack(it: number | null): void;
  /**
   * The minimum outdoor temperature that the compressor can
   * operate at
   * - applies more to air source heat pumps than geothermal
   */
  compressorProtectionMinTemp(): number | null;
  __compressorProtectionMinTemp(it: number | null): void;
  /**
   * The maximum heat set point allowed by the thermostat
   * firmware.
   */
  heatMaxTemp(): number | null;
  __heatMaxTemp(it: number | null): void;
  /**
   * Whether electricity bill alerts are enabled.
   */
  enableElectricityBillAlert(): boolean | null;
  __enableElectricityBillAlert(it: boolean | null): void;
  /**
   * Whether the thermostat is in frost control mode
   */
  condensationAvoid(): boolean | null;
  __condensationAvoid(it: boolean | null): void;
  /**
   * The minimum cool set point allowed by the thermostat
   * firmware.
   */
  coolMinTemp(): number | null;
  __coolMinTemp(it: number | null): void;
  /**
   * Whether to use a zone controller or not
   */
  useZoneController(): boolean | null;
  __useZoneController(it: boolean | null): void;
  /**
   * The minimum time the compressor must be off for in order to
   * prevent short-cycling
   */
  compressorProtectionMinTime(): number | null;
  __compressorProtectionMinTime(it: number | null): void;
  /**
   * The difference between current temp and set-point that will
   * trigger stage 2 heating
   */
  stage1HeatingDifferentialTemp(): number | null;
  __stage1HeatingDifferentialTemp(it: number | null): void;
  /**
   * The name of the the group this thermostat belongs to, if
   * any. See GET Group request and POST Group request for more
   * information.
   */
  groupName(): string | null;
  __groupName(it: string | null): void;
  /**
   * Whether humidification alerts are enabled to the thermostat
   * owner.
   */
  humidityAlertNotify(): boolean | null;
  __humidityAlertNotify(it: boolean | null): void;
  /**
   * The humidity level to trigger a low humidity alert.
   */
  humidityLowAlert(): number | null;
  __humidityLowAlert(it: number | null): void;
  /**
   * The humidifier mode. Values: auto, manual, off
   */
  humidifierMode(): string | null;
  __humidifierMode(it: string | null): void;
  /**
   * Whether humidification alerts are enabled to the technician
   * associated with the thermostat.
   */
  humidityAlertNotifyTechnician(): boolean | null;
  __humidityAlertNotifyTechnician(it: boolean | null): void;
  /**
   * Whether the thermostat is using 12hr time format
   */
  userTimeFormat12(): boolean | null;
  __userTimeFormat12(it: boolean | null): void;
  /**
   * Whether the thermostat should use AC overcool to dehumidify.
   * When set to true a positive integer value must be supplied
   * for dehumidifyOvercoolOffset otherwise an API validation
   * exception will be thrown.
   */
  dehumidifyWithAC(): boolean | null;
  __dehumidifyWithAC(it: boolean | null): void;
  /**
   * Whether Demand Response requests are accepted by this
   * thermostat. Possible values are: always, askMe,
   * customerSelect, defaultAccept, defaultDecline, never.
   */
  drAccept(): string | null;
  __drAccept(it: string | null): void;
  /**
   * The minimum heat set point configured by the user's
   * preferences.
   */
  coolRangeLow(): number | null;
  __coolRangeLow(it: number | null): void;
  /**
   * This field represents whether or not to allow
   * dehumidification when cooling. The default value is true.
   */
  ventilatorDehumidify(): boolean | null;
  __ventilatorDehumidify(it: boolean | null): void;
  /**
   * The maximum cool set point configured by the user's
   * preferences.
   */
  coolRangeHigh(): number | null;
  __coolRangeHigh(it: number | null): void;
  /**
   * The user access code value for this thermostat. See the
   * SecuritySettings object for more information.
   */
  userAccessCode(): string | null;
  __userAccessCode(it: string | null): void;
  /**
   * The dehumidifier mode. Values: on, off. If set to off then
   * the dehumidifier will not run, nor will the AC overcool run.
   */
  dehumidifierMode(): string | null;
  __dehumidifierMode(it: string | null): void;
  /**
   * The user configured monthly interval between HVAC service
   * reminders
   */
  monthsBetweenService(): number | null;
  __monthsBetweenService(it: number | null): void;
  /**
   * Whether the auxHeat temperature alerts for the technician
   * are enabled.
   */
  auxRuntimeAlertNotifyTechnician(): boolean | null;
  __auxRuntimeAlertNotifyTechnician(it: boolean | null): void;
  /**
   * A note about the physical location where the SMART or EMS
   * Equipment Interface module is located
   */
  eiLocation(): string | null;
  __eiLocation(it: string | null): void;
  /**
   * The minimum heat set point allowed by the thermostat
   * firmware.
   */
  heatMinTemp(): number | null;
  __heatMinTemp(it: number | null): void;
  /**
   * Whether random start delay is enabled for cooling.
   */
  randomStartDelayCool(): number | null;
  __randomStartDelayCool(it: number | null): void;
  /**
   * The minimu time in minutes the ventilator is configured to
   * run. The thermostat will always guarantee that the
   * ventilator runs for this minimum duration whenever engaged.
   */
  ventilatorMinOnTime(): number | null;
  __ventilatorMinOnTime(it: number | null): void;
  /**
   * When set to true if a larger than normal delta is found
   * between sensors the fan will be engaged for 15min/hour.
   */
  smartCirculation(): boolean | null;
  __smartCirculation(it: boolean | null): void;
  /**
   * The setting value for the group this thermostat belongs to,
   * if any. See GET Group request and POST Group request for
   * more information.
   */
  groupSetting(): number | null;
  __groupSetting(it: number | null): void;
  /**
   * Whether hot temperature alerts are enabled
   */
  hotTempAlertEnabled(): boolean | null;
  __hotTempAlertEnabled(it: boolean | null): void;
  /**
   * This read-only field represents the Date and Time the
   * ventilator will run until. The default value is 2014-01-01
   * 00:00:00.
   */
  ventilatorOffDateTime(): string | null;
  __ventilatorOffDateTime(it: string | null): void;
  /**
   * Whether to use the ventilator to dehumidify when climate or
   * calendar event indicates the owner is home. The default
   * value is false.
   */
  ventilatorFreeCooling(): boolean | null;
  __ventilatorFreeCooling(it: boolean | null): void;
  /**
   * Whether the thermostat is controlling a forced air furnace
   */
  hasForcedAir(): boolean | null;
  __hasForcedAir(it: boolean | null): void;
  /**
   * Whether the thermostat is controlling an energy recovery
   * ventilator
   */
  hasErv(): boolean | null;
  __hasErv(it: boolean | null): void;
  /**
   * This Boolean field represents whether the ventilator timer
   * is on or off. The default value is false. If set to true the
   * ventilatorOffDateTime is set to now() + 20 minutes. If set
   * to false the ventilatorOffDateTime is set to it's default
   * value.
   */
  isVentilatorTimerOn(): boolean | null;
  __isVentilatorTimerOn(it: boolean | null): void;
  /**
   * Whether the thermostat is controlling a boiler
   */
  hasBoiler(): boolean | null;
  __hasBoiler(it: boolean | null): void;
  /**
   * The temperature at which a cold temp alert is triggered
   */
  coldTempAlert(): number | null;
  __coldTempAlert(it: number | null): void;
  /**
   * The dollar amount the owner specifies for their desired
   * maximum electricity bill.
   */
  monthlyElectricityBillLimit(): number | null;
  __monthlyElectricityBillLimit(it: number | null): void;
  /**
   * If enabled, allows the Thermostat to be put in HVACAuto
   * mode.
   */
  autoHeatCoolFeatureEnabled(): boolean | null;
  __autoHeatCoolFeatureEnabled(it: boolean | null): void;
  /**
   * Whether the thermostat is controlling a heat pump
   */
  hasHeatPump(): boolean | null;
  __hasHeatPump(it: boolean | null): void;
  /**
   * The ventilator mode. Value: auto, minontime, on, off
   */
  vent(): string | null;
  __vent(it: string | null): void;
  /**
   * The thermostat backlight intensity when asleep. A value
   * between 0 and 10, with 0 meaning `off` - the zero value may
   * not be honored by all ecobee versions
   */
  backlightSleepIntensity(): number | null;
  __backlightSleepIntensity(it: number | null): void;
  /**
   * Whether the thermostat should use pre cooling to reach the
   * set point on time.
   */
  disablePreCooling(): boolean | null;
  __disablePreCooling(it: boolean | null): void;
  /**
   * When set to true if no occupancy motion detected thermostat
   * will go into indefinite away hold, until either the user
   * presses resume schedule or motion is detected.
   */
  autoAway(): boolean | null;
  __autoAway(it: boolean | null): void;
  /**
   * The maximum automated set point set forward offset allowed
   * in degrees
   */
  maxSetForward(): number | null;
  __maxSetForward(it: number | null): void;
  /**
   * Whether the thermostat is controlling a humidifier
   */
  hasHumidifier(): boolean | null;
  __hasHumidifier(it: boolean | null): void;
  /**
   * The humidity level to trigger a high humidity alert.
   */
  humidityHighAlert(): number | null;
  __humidityHighAlert(it: number | null): void;
  /**
   * The minimum time, in minutes, to run the fan each hour.
   * Value from 1 to 60.
   */
  fanMinOnTime(): number | null;
  __fanMinOnTime(it: number | null): void;
  /**
   * Whether the alert for when wifi is offline is enabled.
   */
  wifiOfflineAlert(): boolean | null;
  __wifiOfflineAlert(it: boolean | null): void;
  /**
   * Whether the technician associated with this thermostat
   * should receive the HVAC service reminders as well.
   */
  serviceRemindTechnician(): boolean | null;
  __serviceRemindTechnician(it: boolean | null): void;
  /**
   * Whether the auxOutdoor temperature alerts are enabled.
   */
  auxOutdoorTempAlertyNotify(): boolean | null;
  __auxOutdoorTempAlertyNotify(it: boolean | null): void;
  /**
   * Whether the property is a rental, or not
   */
  isRentalProperty(): boolean | null;
  __isRentalProperty(it: boolean | null): void;
  /**
   * The set point set back offset, in degrees, configured for a
   * quick save event
   */
  quickSaveSetBack(): number | null;
  __quickSaveSetBack(it: number | null): void;
  /**
   * This field represents whether to permit the cooling to
   * operate when the Outdoor temperature is under a specific
   * threshold, currently 55F. The default value is false.
   */
  coolingLockout(): boolean | null;
  __coolingLockout(it: boolean | null): void;
  /**
   * Whether the thermostat is connected to an electric HVAC
   * system.
   */
  hasElectric(): boolean | null;
  __hasElectric(it: boolean | null): void;
  /**
   * The maximum outdoor temperature above which aux heat will
   * not run.
   */
  auxMaxOutdoorTemp(): number | null;
  __auxMaxOutdoorTemp(it: number | null): void;
  /**
   * The minimum temperature difference between the heat and cool
   * values. Used to ensure that when thermostat is in auto mode,
   * the heat and cool values are separated by at least this
   * value.
   */
  heatCoolMinDelta(): number | null;
  __heatCoolMinDelta(it: number | null): void;
  /**
   * Whether the auxHeat temperature alerts are enabled.
   */
  auxRuntimeAlertNotify(): boolean | null;
  __auxRuntimeAlertNotify(it: boolean | null): void;
  /**
   * What's the default Fan Speed on a HVAC with multi-span.
   * Accepted values: low, medium, high, and optimized.
   */
  fanSpeed(): string | null;
  __fanSpeed(it: string | null): void;
  /**
   * Whether the auxOutdoor temperature alerts for the technician
   * are enabled.
   */
  auxOutdoorTempAlertNotifyTechnician(): boolean | null;
  __auxOutdoorTempAlertNotifyTechnician(it: boolean | null): void;
  /**
   * The set point set forward offset, in degrees, configured for
   * a quick save event
   */
  quickSaveSetForward(): number | null;
  __quickSaveSetForward(it: number | null): void;
  /**
   * Whether an installer code is required
   */
  installerCodeRequired(): boolean | null;
  __installerCodeRequired(it: boolean | null): void;
  /**
   * Determines whether or not to turn the backlight off during
   * sleep.
   */
  backlightOffDuringSleep(): boolean | null;
  __backlightOffDuringSleep(it: boolean | null): void;
  /**
   * The maximum heat set point configured by the user's
   * preferences.
   */
  heatRangeHigh(): number | null;
  __heatRangeHigh(it: number | null): void;
  /**
   * The maximum cool set point allowed by the thermostat
   * firmware.
   */
  coolMaxTemp(): number | null;
  __coolMaxTemp(it: number | null): void;
  /**
   * The time after a cooling cycle that the fan will run for to
   * extract any cooling left in the system - 30 second default
   * (for not)
   */
  stage1CoolingDissipationTime(): number | null;
  __stage1CoolingDissipationTime(it: number | null): void;
  /**
   * Whether the thermostat is controlling a heat recovery
   * ventilator
   */
  hasHrv(): boolean | null;
  __hasHrv(it: boolean | null): void;
  /**
   * The owners billing cycle duration in months.
   */
  electricityBillCycleMonths(): number | null;
  __electricityBillCycleMonths(it: number | null): void;
  /**
   * The time after a heating cycle that the fan will run for to
   * extract any heating left in the system - 30 second default.
   */
  stage1HeatingDissipationTime(): number | null;
  __stage1HeatingDissipationTime(it: number | null): void;
  /**
   * Date to be reminded about the next HVAC service date
   */
  remindMeDate(): sys.Date | null;
  __remindMeDate(it: sys.Date | null): void;
  /**
   * The unique reference to the group this thermostat belongs
   * to, if any. See GET Group request and POST Group request for
   * more information.
   */
  groupRef(): string | null;
  __groupRef(it: string | null): void;
  /**
   * The day of the month the owner's electricity usage is
   * billed.
   */
  electricityBillingDayOfMonth(): number | null;
  __electricityBillingDayOfMonth(it: number | null): void;
  /**
   * This field represents whether to permit dehumidifier to
   * operate when the heating is running. The default value is
   * false.
   */
  dehumidfyWhenHeating(): boolean | null;
  __dehumidfyWhenHeating(it: boolean | null): void;
  /**
   * The temperature at which an auxOutdoor temperature alert is
   * triggered.
   */
  auxOutdoorTempAlert(): number | null;
  __auxOutdoorTempAlert(it: number | null): void;
  /**
   * Whether heat pump alerts are disabled.
   */
  disableHeatPumpAlerts(): boolean | null;
  __disableHeatPumpAlerts(it: boolean | null): void;
  /**
   * The current HVAC mode the thermostat is in. Values: auto,
   * auxHeatOnly, cool, heat, off
   */
  hvacMode(): string | null;
  __hvacMode(it: string | null): void;
  /**
   * The amount to adjust the temperature reading in degrees F -
   * this value is subtracted from the temperature read from the
   * sensor.
   */
  tempCorrection(): number | null;
  __tempCorrection(it: number | null): void;
  /**
   * The thermostat backlight intensity when on. A value between
   * 0 and 10, with 0 meaning `off` - the zero value may not be
   * honored by all ecobee versions
   */
  backlightOnIntensity(): number | null;
  __backlightOnIntensity(it: number | null): void;
  /**
   * The temperature at which a hot temp alert is triggered
   */
  hotTempAlert(): number | null;
  __hotTempAlert(it: number | null): void;
  /**
   * Multilanguage support
   */
  locale(): string | null;
  __locale(it: string | null): void;
  /**
   * The time in seconds before the thermostat screen goes into
   * sleep mode
   */
  backlightOffTime(): number | null;
  __backlightOffTime(it: number | null): void;
  /**
   * The minimum heat set point configured by the user's
   * preferences.
   */
  heatRangeLow(): number | null;
  __heatRangeLow(it: number | null): void;
  /**
   * Whether temperature alerts are enabled to the thermostat
   * owner
   */
  tempAlertNotify(): boolean | null;
  __tempAlertNotify(it: boolean | null): void;
  /**
   * The default end time setting the thermostat applies to user
   * temperature holds. Values useEndTime4hour, useEndTime2hour
   * (EMS Only), nextPeriod, indefinite, askMe
   */
  holdAction(): string | null;
  __holdAction(it: string | null): void;
  /**
   * Whether the thermostat should use AC overcool to dehumidify
   * and what that temperature offset should be. A value of 0
   * means this feature is disabled and dehumidifyWithAC will be
   * set to false. Value represents the value in F to subtract
   * from the current set point. Values should be in the range 0
   * - 50 and be divisible by 5.
   */
  dehumidifyOvercoolOffset(): number | null;
  __dehumidifyOvercoolOffset(it: number | null): void;
  /**
   * Whether the Thermostat uses a geothermal / ground source
   * heat pump.
   */
  heatPumpGroundWater(): boolean | null;
  __heatPumpGroundWater(it: boolean | null): void;
  /**
   * The number of cool stage the connected HVAC equipment
   * supports
   */
  coolStages(): number | null;
  __coolStages(it: number | null): void;
  /**
   * Whether cold temperature alerts are enabled
   */
  coldTempAlertEnabled(): boolean | null;
  __coldTempAlertEnabled(it: boolean | null): void;
  /**
   * The difference between current temperature and set-point
   * that will trigger stage 2 cooling.
   */
  stage1CoolingDifferentialTemp(): number | null;
  __stage1CoolingDifferentialTemp(it: number | null): void;
  /**
   * Whether electricity bill projection alerts are enabled
   */
  enableProjectedElectricityBillAlert(): boolean | null;
  __enableProjectedElectricityBillAlert(it: boolean | null): void;
  /**
   * Whether the thermostat is configured to report in degrees
   * Celsisus
   */
  useCelsius(): boolean | null;
  __useCelsius(it: boolean | null): void;
  /**
   * Whether the thermostat should use pre heating to reach the
   * set point on time.
   */
  disablePreHeating(): boolean | null;
  __disablePreHeating(it: boolean | null): void;
  /**
   * Whether temperature alerts are enabled to the technician
   * associated with the thermostat.
   */
  tempAlertNotifyTechnician(): boolean | null;
  __tempAlertNotifyTechnician(it: boolean | null): void;
  /**
   * The number of heat stages the connected HVAC equipment
   * supports
   */
  heatStages(): number | null;
  __heatStages(it: number | null): void;
  /**
   * The last service data of the HVAC equipment
   */
  lastServiceDate(): sys.Date | null;
  __lastServiceDate(it: sys.Date | null): void;
  /**
   * The number of minutes to run ventilator per hour when away.
   */
  ventilatorMinOnTimeAway(): number | null;
  __ventilatorMinOnTimeAway(it: number | null): void;
  /**
   * Whether random start delay is enabled for heating
   */
  randomStartDelayHeat(): number | null;
  __randomStartDelayHeat(it: number | null): void;
  /**
   * The number of minutes to run ventilator per hour when home.
   */
  ventilatorMinOnTimeHome(): number | null;
  __ventilatorMinOnTimeHome(it: number | null): void;
  /**
   * The dehumidification set point in percentage.
   */
  dehumidifierLevel(): number | null;
  __dehumidifierLevel(it: number | null): void;
  /**
   * The annual start month of the owners billing cycle.
   */
  electricityBillStartMonth(): number | null;
  __electricityBillStartMonth(it: number | null): void;
  /**
   * Whether alerts are disabled from showing on the thermostat.
   */
  disableAlertsOnIdt(): boolean | null;
  __disableAlertsOnIdt(it: boolean | null): void;
  static make(f: ((arg0: EcobeeSettings) => void), ...args: unknown[]): EcobeeSettings;
}

/**
 * EcobeeVersion
 */
export class EcobeeVersion extends EcobeeObj {
  static type$: sys.Type
  thermostatFirmwareVersion(): sys.Version | null;
  __thermostatFirmwareVersion(it: sys.Version | null): void;
  static fromStr(val: string, ...args: unknown[]): EcobeeVersion;
  static make(f: ((arg0: EcobeeVersion) => void), ...args: unknown[]): EcobeeVersion;
}

/**
 * Runtime object
 */
export class EcobeeRuntime extends EcobeeObj {
  static type$: sys.Type
  /**
   * The current runtime revision. Equivalent in meaning to the
   * runtime revision number in the thermostat summary call.
   */
  runtimeRev(): string | null;
  __runtimeRev(it: string | null): void;
  /**
   * The desired heat temperature as per the current running
   * program or active event
   */
  desiredHeat(): number | null;
  __desiredHeat(it: number | null): void;
  /**
   * The UTC date of the last runtime reading
   */
  runtimeDate(): sys.Date | null;
  __runtimeDate(it: sys.Date | null): void;
  actualAQScore(): number | null;
  __actualAQScore(it: number | null): void;
  /**
   * The current humidity % shown on the thermostat
   */
  actualHumidity(): number | null;
  __actualHumidity(it: number | null): void;
  /**
   * This field provides the possible valid range for which a
   * desiredHeat setpoint can be set to. This value takes into
   * account the thermostat heat temperature limits as well the
   * running program or active events. Values are returned as an
   * Integer array representing the canonical minimum and
   * maximum, e.g. [450,790].
   */
  desiredHeatRange(): sys.List<number> | null;
  __desiredHeatRange(it: sys.List<number> | null): void;
  /**
   * The desired fan mode. Values: auto, on, or null if the HVAC
   * system is off and the thermostat is not controlling a fan
   * independently.
   */
  desiredFanMode(): string | null;
  __desiredFanMode(it: string | null): void;
  actualVOC(): number | null;
  __actualVOC(it: number | null): void;
  /**
   * The last recorded connection date and time
   */
  connectDateTime(): string | null;
  __connectDateTime(it: string | null): void;
  /**
   * The UTC date/timestamp of when the thermostat last posted
   * its runtime information
   */
  lastStatusModified(): sys.DateTime | null;
  __lastStatusModified(it: sys.DateTime | null): void;
  /**
   * The UTC dat/time stamp of when the thermostat first
   * connected to the server
   */
  firstConnected(): sys.DateTime | null;
  __firstConnected(it: sys.DateTime | null): void;
  /**
   * The desired cool temperature as per the current running
   * program or active event
   */
  desiredCool(): number | null;
  __desiredCool(it: number | null): void;
  /**
   * The desired humidity set point
   */
  desiredHumidity(): number | null;
  __desiredHumidity(it: number | null): void;
  /**
   * Whether the thermostat is currently connected to the server
   */
  connected(): boolean | null;
  __connected(it: boolean | null): void;
  actualAQAccuracy(): number | null;
  __actualAQAccuracy(it: number | null): void;
  /**
   * The last 5 minute interval which was updated by the
   * thermostat telemetry update. Subtract 2 from this interval
   * to obtain the beginning interval for the last 3 readings.
   * Multiply by 5 mins to obtain the minutes of the day. Range
   * 0-287
   */
  runtimeInterval(): number | null;
  __runtimeInterval(it: number | null): void;
  /**
   * This field provides the possible valid range for which a
   * desiredCool setpoint can be set to. This value takes into
   * account the thermostat cool temperature limits as well the
   * running program or active events. Values are returned as an
   * Integer array representing the canonical minimum and
   * maximum, e.g. [650,920].
   */
  desiredCoolRange(): sys.List<number> | null;
  __desiredCoolRange(it: sys.List<number> | null): void;
  /**
   * The last recorded disconnection date and time
   */
  disconnectDateTime(): string | null;
  __disconnectDateTime(it: string | null): void;
  /**
   * The current temperature displayed on the thermostat
   */
  actualTemperature(): number | null;
  __actualTemperature(it: number | null): void;
  /**
   * The UTC date/timestamp of when the thermostat was updated
   */
  lastModified(): sys.DateTime | null;
  __lastModified(it: sys.DateTime | null): void;
  actualCO2(): number | null;
  __actualCO2(it: number | null): void;
  /**
   * The dry-bulb temperature recorded by the thermostat.
   */
  rawTemperature(): number | null;
  __rawTemperature(it: number | null): void;
  static make(f: ((arg0: EcobeeRuntime) => void), ...args: unknown[]): EcobeeRuntime;
}

/**
 * Ecobee Thermostat Request API
 */
export class ThermostatReq extends ApiReq {
  static type$: sys.Type
  /**
   * This request retrieves a list of thermostat configuration
   * and state revisions
   */
  summary(selection: EcobeeSelection): ThermostatSummaryResp;
  /**
   * Write an update to the thermostat to change a setting or
   * other value
   */
  update(selection: EcobeeSelection, thermostat: EcobeeThermostat): void;
  /**
   * Invoke an ecobee function
   */
  callFunc(selection: EcobeeSelection, func: EcobeeFunction): void;
  /**
   * Get all thermostats matching the selection
   */
  get(selection: EcobeeSelection): sys.List<EcobeeThermostat>;
}

/**
 * Synthetic type for Ecobee response object
 */
export class EcobeeResp extends EcobeeObj {
  static type$: sys.Type
  /**
   * Page information
   */
  page(): EcobeePage | null;
  __page(it: EcobeePage | null): void;
  /**
   * Response status
   */
  status(): EcobeeStatus;
  __status(it: EcobeeStatus): void;
  /**
   * Are there more pages to fetch
   */
  morePages(): boolean;
  static make(f: ((arg0: EcobeeResp) => void), ...args: unknown[]): EcobeeResp;
}

/**
 * RemoteSensor object
 */
export class EcobeeRemoteSensor extends EcobeeObj {
  static type$: sys.Type
  /**
   * The unique 4-digit alphanumeric sensor code
   */
  code(): string | null;
  __code(it: string | null): void;
  /**
   * The type of sensor
   */
  type(): string | null;
  __type(it: string | null): void;
  /**
   * The list of remote sensor capability objects for the remote
   * sensor
   */
  capability(): sys.List<EcobeeRemoteSensorCapability>;
  __capability(it: sys.List<EcobeeRemoteSensorCapability>): void;
  /**
   * The user assigned sensor name
   */
  name(): string | null;
  __name(it: string | null): void;
  /**
   * This flag indicates whether the remote sensor is currently
   * in use by a comfort setting
   */
  inUse(): boolean | null;
  __inUse(it: boolean | null): void;
  /**
   * The unique sensor identifier. It is composed of deviceName +
   * deviceId separated by colons (e.g. `rs:100`)
   */
  id(): string | null;
  __id(it: string | null): void;
  /**
   * Get the capability with the given type or return null if
   * this sensor doesn't support this capability
   */
  getCapability(type: string): EcobeeRemoteSensorCapability | null;
  /**
   * Return true if this sensor supports the capability with the
   * given type
   */
  hasCapability(type: string): boolean;
  static make(f: ((arg0: EcobeeRemoteSensor) => void), ...args: unknown[]): EcobeeRemoteSensor;
}

/**
 * Status object
 */
export class EcobeeStatus extends EcobeeObj {
  static type$: sys.Type
  /**
   * The status code for this status
   */
  code(): number;
  __code(it: number): void;
  /**
   * The detailed message for this status
   */
  message(): string;
  __message(it: string): void;
  toStr(): string;
  /**
   * Is this an error status
   */
  isErr(): boolean;
  static makeFields(code: number, message: string, ...args: unknown[]): EcobeeStatus;
  /**
   * Is this a successful status
   */
  isOk(): boolean;
  static make(f: ((arg0: EcobeeStatus) => void), ...args: unknown[]): EcobeeStatus;
}

