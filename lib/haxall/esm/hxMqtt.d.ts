import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as crypto from './crypto.js';
import * as inet from './inet.js';
import * as mqtt from './mqtt.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as folio from './folio.js';
import * as obs from './obs.js';
import * as hx from './hx.js';
import * as hxd from './hxd.js';
import * as hxConn from './hxConn.js';

/**
 * Dispatch callbacks for the MQTT connector
 */
export class MqttDispatch extends hxConn.ConnDispatch implements mqtt.ClientListener {
  static type$: sys.Type
  onReceive(msg: hx.HxMsg): sys.JsObj | null;
  onHouseKeeping(): void;
  onClose(): void;
  onOpen(): void;
  onDisconnected(err: sys.Err | null): void;
  static make(arg: sys.JsObj, ...args: unknown[]): MqttDispatch;
  onPing(): haystack.Dict;
  /**
   * Callback when the client has connected to the broker. This
   * means the broker has responded to a `CONNECT` message with a
   * successful `CONNACK` response.
   */
  onConnected(): void;
}

/**
 * MQTT connector library
 */
export class MqttLib extends hxConn.ConnLib {
  static type$: sys.Type
  observables(): sys.List<obs.Observable>;
  onConnDetails(conn: hxConn.Conn): string;
  static cur(checked?: boolean): MqttLib | null;
  static make(...args: unknown[]): MqttLib;
}

/**
 * MQTT connector functions
 */
export class MqttFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Publish an MQTT message to the given topic on the broker.
   * Currently, the payload of the message must be a Str.
   * 
   * The following configuration options are supported:
   * - `mqttQos`: The quality-of-service to use for publishing the
   *   message. If not specified, then QoS `0` is used. See [mqttQos](mqttQos).
   * - `mqttRetain`: Should the message be retained on the broker (`true`
   *   | `false`). If not specified, then `false` is used. See [mqttRetain](mqttRetain).
   * - `mqttExpiryInterval`: Sets the expiry interval for the message
   *   as a Duration. This is only supported in MQTT 5.
   * ```
   * read(@mqttConn).mqttPublish("/test", "{a: a JSON object}", {mqttQos: 2})
   * 
   * ```
   */
  static mqttPublish(conn: sys.JsObj, topic: string, payload: sys.JsObj, cfg?: haystack.Dict): sys.JsObj | null;
  static make(...args: unknown[]): MqttFuncs;
}

