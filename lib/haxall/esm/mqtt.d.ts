import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as crypto from './crypto.js';
import * as inet from './inet.js';
import * as web from './web.js';
import * as util from './util.js';

/**
 * MQTT client connection state
 */
export class ClientState extends sys.Enum {
  static type$: sys.Type
  /**
   * List of ClientState values indexed by ordinal
   */
  static vals(): sys.List<ClientState>;
  static disconnecting(): ClientState;
  static connected(): ClientState;
  static disconnected(): ClientState;
  static connecting(): ClientState;
  /**
   * Return the ClientState instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): ClientState;
}

/**
 * Stores messages in-memory for Qos 1 and QoS 2 messages.
 */
export class ClientMemDb extends sys.Obj implements ClientPersistence {
  static type$: sys.Type
  put(key: string, packet: PersistablePacket): void;
  remove(key: string): void;
  get(key: string): PersistablePacket | null;
  static make(...args: unknown[]): ClientMemDb;
  close(): void;
  toStr(): string;
  containsKey(key: string): boolean;
  clear(clientId: string): void;
  each(f: ((arg0: PersistablePacket, arg1: string) => void)): void;
  open(clientId: string): void;
}

/**
 * Utility to build a subscribe request for a single topic and
 * then send it.
 * 
 * By default, the following settings are enabled:
 * - QoS 2
 * - No Local is disabled (false)
 * - Retain as Published is turned off (false)
 * - Retain Handling is set to `send`
 */
export class SubSend extends sys.Obj {
  static type$: sys.Type
  /**
   * Request maximum QoS 2
   */
  qos2(): this;
  /**
   * Set the explicit subscription listener to use for this
   * subscription. This will permanently invalidate any calls to
   * the convenience methods {@link onSubscribe | onSubscribe}, {@link onMessage | onMessage},
   * and {@link onUnsubscribe | onUnsubscribe}.
   */
  listener(listener: SubscriptionListener): this;
  /**
   * Request maximum QoS 1
   */
  qos1(): this;
  /**
   * Request maximum QoS 0
   */
  qos0(): this;
  /**
   * If true, application messages will not be forwareded to a
   * connection with a clientID equal to the clientID of the
   * publishing connection. Cannot be set on a shared
   * subscription. (**MQTT 5 only**)
   */
  noLocal(val: boolean): this;
  /**
   * Request maximum QoS `qos` may be either {@link QoS | QoS} or an
   * Int.
   */
  qos(qos: sys.JsObj): this;
  /**
   * If true, application messages forwared using this
   * subscription keep the RETAIN flag they were published with.
   * If false, application messages forwarded using this
   * subscription have the RETAIN flag set to 0 (false). (**MQTT
   * 5 only**)
   */
  retainAsPublished(val: boolean): this;
  /**
   * This option specifies whether retained are sent when the
   * subscription is established. (**MQTT 5 only**)
   */
  retainHandling(val: RetainHandling): this;
  /**
   * Set the callback to be invoked after the subscription is
   * unsubscribed.
   */
  onUnsubscribe(cb: ((arg0: string, arg1: ReasonCode, arg2: Properties) => void)): this;
  /**
   * Set the callback to be invoked when the subscription is
   * acknowledged.
   */
  onSubscribe(cb: ((arg0: string, arg1: ReasonCode, arg2: Properties) => void)): this;
  /**
   * Set the callback to be invoked when a message is published
   * to this subscription.
   */
  onMessage(cb: ((arg0: string, arg1: Message) => void)): this;
  /**
   * Set the topic filter to subscribe to. You must set a topic
   * filter before you call {@link send | send}.
   */
  topicFilter(topicFilter: string): this;
  /**
   * Build and send the subscribe packet. A future is returned
   * that will be completed when the `SUBACK` is received.
   */
  send(): concurrent.Future;
}

/**
 * Packet type enum. The ordinals correspond to the control
 * value.
 */
export class PacketType extends sys.Enum {
  static type$: sys.Type
  static pubrel(): PacketType;
  static disconnect(): PacketType;
  static pingresp(): PacketType;
  static auth(): PacketType;
  /**
   * List of PacketType values indexed by ordinal
   */
  static vals(): sys.List<PacketType>;
  static pingreq(): PacketType;
  static pubrec(): PacketType;
  static puback(): PacketType;
  static unsuback(): PacketType;
  static suback(): PacketType;
  static unsubscribe(): PacketType;
  static connect(): PacketType;
  static subscribe(): PacketType;
  static connack(): PacketType;
  static reserved(): PacketType;
  static publish(): PacketType;
  static pubcomp(): PacketType;
  /**
   * Return the PacketType instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): PacketType;
}

export class DataCodecTest extends sys.Test implements DataCodec {
  static type$: sys.Type
  testUtf8(): void;
  testVariableByteInteger(): void;
  testProperties(): void;
  testStrPair(): void;
  static make(...args: unknown[]): DataCodecTest;
  testBinary(): void;
}

/**
 * Utility to build a publish request and then send it.
 */
export class PubSend extends sys.Obj {
  static type$: sys.Type
  /**
   * Set the expiry interval for the message (**MQTT 5 only**)
   */
  expiryInterval(interval: sys.Duration | null): this;
  /**
   * Publish this message with QoS 2
   */
  qos2(): this;
  /**
   * Should the message be retained?
   */
  retain(retain: boolean): this;
  /**
   * Publish this message with QoS 1
   */
  qos1(): this;
  /**
   * Publish this message with QoS 0
   */
  qos0(): this;
  /**
   * Add a user property to send with the publish. This method
   * may be called more than once to add multiple user properties
   * (**MQTT 5 only**)
   */
  userProp(name: string, value: string): this;
  /**
   * Publish this message with the given quality-of-service `qos`
   * may be either {@link QoS | QoS} or an Int.
   */
  qos(qos: sys.JsObj): this;
  /**
   * Set the payload to send.
   */
  payload(payload: sys.Buf): this;
  /**
   * Set the content type for the payload of this message.
   * (**MQTT 5 only**)
   */
  contentType(contentType: string): this;
  /**
   * Set the topic to publish to.
   */
  topic(topic: string): this;
  /**
   * Notify the recepient that the payload is UTF-8 encoded data.
   * (**MQTT 5 only**)
   */
  utf8Payload(isUtf8: boolean): this;
  /**
   * Build and send the publish packet. A future is returned that
   * will be completed when the acknowledgement is received
   * according to the configure quality-of-service.
   */
  send(): concurrent.Future;
}

/**
 * General MQTT error.
 */
export class MqttErr extends sys.Err {
  static type$: sys.Type
  reason(): ReasonCode | null;
  static makeReason(reason: ReasonCode, cause?: sys.Err | null, ...args: unknown[]): MqttErr;
  static make(msg?: string, cause?: sys.Err | null, ...args: unknown[]): MqttErr;
}

/**
 * Defines the API for the client persistance layer. The
 * persistance layer is used to store unacknowledged QoS 1 and
 * QoS 2 messages.
 */
export abstract class ClientPersistence extends sys.Obj {
  static type$: sys.Type
  /**
   * Return `true` if there is a packet stored with the given key; `false`
   * otherwise.
   */
  containsKey(key: string): boolean;
  /**
   * Clear all stored messages for the given client identifier.
   */
  clear(clientId: string): void;
  /**
   * Store a packet associated with the given key.
   */
  put(key: string, packet: PersistablePacket): void;
  /**
   * Iterate all stored messages.
   */
  each(f: ((arg0: PersistablePacket, arg1: string) => void)): void;
  /**
   * Remove the stored packet with the given key. If the key does
   * not exist it is a no-op.
   */
  remove(key: string): void;
  /**
   * Close the persistence store.
   */
  close(): void;
  /**
   * Open the persistence layer for storing/retrieving messages
   * for the client with the given client identifier.
   */
  open(clientId: string): void;
}

/**
 * MQTT Client (Asynchronous)
 */
export class MqttClient extends concurrent.Actor implements MqttConst {
  static type$: sys.Type
  /**
   * Client log
   */
  log(): sys.Log;
  /**
   * Client configuration
   */
  config(): ClientConfig;
  /**
   * Disconnect from the server.
   * 
   * Returns a future that will be completed after the `DISCONNECT`
   * message is actually sent to the server.
   */
  disconnect(): concurrent.Future;
  /**
   * Is the client terminated
   */
  isTerminated(): boolean;
  /**
   * Get a subscription builder to configure and send your
   * request.
   */
  subscribeWith(): SubSend;
  /**
   * Unsubscribe from the given topic filter.
   * 
   * Returns a future that will be completed when the `UNSUBACK` is
   * received.
   */
  unsubscribe(topicFilter: string): concurrent.Future;
  /**
   * The current connection state
   */
  state(): ClientState;
  /**
   * Get a publish builder to configure and send your request
   */
  publishWith(): PubSend;
  /**
   * Configure the client to auto-reconnect and return this
   */
  enableAutoReconnect(initialDelay?: sys.Duration, maxDelay?: sys.Duration): this;
  /**
   * Disconnect and terminate all resources used by the client.
   * After this method is called the client can no longer be
   * used. When you are done with the client it is strongly
   * recommended to call this method to clean up all resources.
   */
  terminate(): this;
  static make(config: ClientConfig, log?: sys.Log, ...args: unknown[]): MqttClient;
  /**
   * Open a connection to the server using the given
   * configuration.
   * 
   * Returns a future that will be completed:
   * 1. when the `CONNACK` is received
   * 2. with an error if the connect times out
   */
  connect(config?: ConnectConfig): concurrent.Future;
  /**
   * Add a {@link ClientListener | ClientListener} and return this
   */
  addListener(listener: ClientListener): this;
  /**
   * Subscribe to the given topic filter. You are responsible for
   * setting the option flags correctly. See {@link subscribeWith | subscribeWith}
   * to use a "fluent" API for subscribing.
   * 
   * Return a future that will be completed when the `SUBACK` is
   * received.
   */
  subscribe(filter: string, opts: number, listener: SubscriptionListener): concurrent.Future;
  /**
   * Publish a message to the given topic. See {@link publishWith | publishWith}
   * to use a "fluent" API for publishing.
   * 
   * Returns a future that will be completed when the message is
   * confirmed to be received by the server accoring to the
   * specified QoS.
   */
  publish(topic: string, msg: Message): concurrent.Future;
}

/**
 * A malformed packet error occurs when the decoder fails to
 * decode a packet or detects invalid state between the fields
 * in a packet.
 */
export class MalformedPacketErr extends MqttErr {
  static type$: sys.Type
  static make(msg?: string, cause?: sys.Err | null, ...args: unknown[]): MalformedPacketErr;
}

/**
 * Packets that can be {@link ClientPersistence | persisted}
 * must implement this mixin.
 */
export abstract class PersistablePacket extends sys.Obj {
  static type$: sys.Type
  /**
   * Get an {@link sys.InStream | sys::InStream} for reading a
   * packet that was encoded according to specified {@link packetVersion | packetVersion}.
   */
  in(): sys.InStream;
  /**
   * Get the version of the packet that was persisted.
   */
  packetVersion(): MqttVersion;
}

/**
 * RetainHandling
 */
export class RetainHandling extends sys.Enum {
  static type$: sys.Type
  /**
   * do not send retained messages at the time of the subscribe
   */
  static do_not_send(): RetainHandling;
  /**
   * List of RetainHandling values indexed by ordinal
   */
  static vals(): sys.List<RetainHandling>;
  /**
   * send retained messages at the time of the subscribe
   */
  static send(): RetainHandling;
  /**
   * send retained messages at subscribe only if they
   * subscription does not currently exists
   */
  static send_only_if_new_subscription(): RetainHandling;
  /**
   * Return the RetainHandling instance for the specified name. 
   * If not a valid name and checked is false return null,
   * otherwise throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): RetainHandling;
}

/**
 * Utilities for reading/writing the primitive MQTT data types.
 */
export abstract class DataCodec extends sys.Obj {
  static type$: sys.Type
  /**
   * Read a UTF8 String Pair
   */
  static readStrPair(in$: sys.JsObj): StrPair;
  /**
   * Write {@link Properties | Properties}
   */
  static writeProps(props: Properties | null, out: sys.JsObj): void;
  /**
   * Write binary data
   */
  static writeBin(data: sys.Buf | null, out: sys.JsObj): void;
  /**
   * Write a UTF8 string
   */
  static writeUtf8(str: string | null, obj: sys.JsObj): void;
  /**
   * Write an unsigned byte
   */
  static writeByte(val: number, out: sys.JsObj): void;
  /**
   * Read a Variable-Byte Integer (VBI)
   */
  static readVbi(obj: sys.JsObj): number;
  /**
   * Write a UTF8 String Pair
   */
  static writeStrPair(pair: StrPair, out: sys.JsObj): void;
  /**
   * Read a UTF8 string
   */
  static readUtf8(obj: sys.JsObj): string;
  /**
   * Write a Variable-Byte Integer (VBI)
   */
  static writeVbi(val: number, obj: sys.JsObj): void;
  /**
   * Write a 4-byte unsigned integer
   */
  static writeByte4(val: number, out: sys.JsObj): void;
  /**
   * Write a 2-byte unsigned integer
   */
  static writeByte2(val: number, out: sys.JsObj): void;
  /**
   * Read binary data
   */
  static readBin(in$: sys.JsObj): sys.Buf;
  /**
   * Read {@link Properties | Properties}
   */
  static readProps(in$: sys.JsObj): Properties;
  /**
   * Read a 2-byte unsigned integer
   */
  static readByte2(in$: sys.JsObj): number;
  /**
   * Read a 4-byte unsigned integer
   */
  static readByte4(in$: sys.JsObj): number;
  /**
   * Read an unsigned byte
   */
  static readByte(in$: sys.JsObj): number;
}

/**
 * MQTT data types
 */
export class DataType extends sys.Enum {
  static type$: sys.Type
  static strPair(): DataType;
  /**
   * List of DataType values indexed by ordinal
   */
  static vals(): sys.List<DataType>;
  static byte(): DataType;
  static utf8(): DataType;
  static byte4(): DataType;
  static byte2(): DataType;
  static binary(): DataType;
  static vbi(): DataType;
  /**
   * Return the DataType instance for the specified name.  If not
   * a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): DataType;
}

/**
 * MQTT constants
 */
export abstract class MqttConst extends sys.Obj {
  static type$: sys.Type
  /**
   * MQTT maximum allowable packet identifier
   */
  static maxPacketId(): number;
  /**
   * MQTT minimum allowable subscription identifier
   */
  static minSubId(): number;
  /**
   * MQTT minimum allowable packet identifier
   */
  static minPacketId(): number;
  /**
   * This session expiry interval indicates that the server
   * should never expire the session.
   */
  static sessionNeverExpires(): sys.Duration;
  /**
   * This session expiry interval indicates that the server
   * should close the session when the network connection is
   * closed.
   */
  static sessionExpiresOnClose(): sys.Duration;
  /**
   * MQTT maxium allowable subscription identifier
   */
  static maxSubId(): number;
}

/**
 * Property types
 */
export class Property extends sys.Enum {
  static type$: sys.Type
  static wildcardSubscriptionAvailable(): Property;
  /**
   * List of Property values indexed by ordinal
   */
  static vals(): sys.List<Property>;
  static userProperty(): Property;
  /**
   * How the property should be encoded
   */
  type(): DataType;
  static responseInfo(): Property;
  static maxPacketSize(): Property;
  static requestResponseInfo(): Property;
  static subscriptionIdsAvailable(): Property;
  static assignedClientId(): Property;
  static topicAliasMax(): Property;
  static reasonStr(): Property;
  /**
   * Property id (these do *not* map to ordinal position)
   */
  id(): number;
  static serverKeepAlive(): Property;
  static contentType(): Property;
  static correlationData(): Property;
  static sharedSubscriptionAvailable(): Property;
  static willDelayInterval(): Property;
  static authData(): Property;
  static serverRef(): Property;
  static payloadFormatIndicator(): Property;
  static retainAvailable(): Property;
  static requestProblemInfo(): Property;
  static messageExpiryInterval(): Property;
  static receiveMax(): Property;
  static responseTopic(): Property;
  static sessionExpiryInterval(): Property;
  static topicAlias(): Property;
  static subscriptionId(): Property;
  static authMethod(): Property;
  static maxQoS(): Property;
  toStr(): string;
  static fromId(id: number): Property;
  /**
   * Return the Property instance for the specified name.  If not
   * a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): Property;
}

/**
 * StrPair models the MQTT UTF-8 String Pair data type. This
 * data type is used to hold hame-value pairs.
 */
export class StrPair extends sys.Obj {
  static type$: sys.Type
  val(): string;
  name(): string;
  toStr(): string;
  equals(obj: sys.JsObj | null): boolean;
  static make(name: string, val: string, ...args: unknown[]): StrPair;
  hash(): number;
}

/**
 * MQTT protocol revision
 */
export class MqttVersion extends sys.Enum {
  static type$: sys.Type
  /**
   * The one byte value that represents the protocol revision.
   */
  code(): number;
  /**
   * List of MqttVersion values indexed by ordinal
   */
  static vals(): sys.List<MqttVersion>;
  static v3_1_1(): MqttVersion;
  static v5(): MqttVersion;
  toStr(): string;
  /**
   * Is this version 5.0
   */
  is5(): boolean;
  /**
   * Return the MqttVersion instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): MqttVersion;
  /**
   * Is this version 3.1.1
   */
  is311(): boolean;
  static fromCode(code: number, checked?: boolean): MqttVersion | null;
}

/**
 * Client identifier utilities
 */
export abstract class ClientId extends sys.Obj {
  static type$: sys.Type
  /**
   * Generate a client identifier that MUST be accepted by any
   * compliant MQTT server
   */
  static gen(): string;
}

/**
 * A subscription listener receives callbacks related to a
 * topic subscription.
 */
export abstract class SubscriptionListener extends sys.Obj {
  static type$: sys.Type
  /**
   * Callback when the subscription is acknowledged. The {@link ReasonCode | ReasonCode}
   * indicates if the subscription was a success or not.
   */
  onSubscribed(topic: string, reason: ReasonCode, props: Properties): void;
  /**
   * Callback when the unsubscribe is acknowledged.
   */
  onUnsubscribed(topic: string, reason: ReasonCode, props: Properties): void;
  /**
   * Callback when a message is received on the given topic.
   */
  onMessage(topic: string, msg: Message): void;
}

/**
 * Configuration for a CONNECT request
 */
export class ConnectConfig extends sys.Obj {
  static type$: sys.Type
  /**
   * The maximum packets size the client is willing to accept.
   * May not be set to zero. If set to null, there is no limit on
   * the packet size.
   * 
   * This setting only applies to clients with version >= 5
   */
  maxPacketSize(): number | null;
  __maxPacketSize(it: number | null): void;
  /**
   * If true, the client is requesting the server to return
   * response information in the CONNACK (but the server may
   * choose not to).
   * 
   * This setting only applies to clients with version >= 5
   */
  requestResponseInfo(): boolean;
  __requestResponseInfo(it: boolean): void;
  /**
   * User properties to send as part of the connection request.
   * 
   * This setting only applies to clients with version >= 5
   */
  userProps(): sys.List<StrPair>;
  __userProps(it: sys.List<StrPair>): void;
  /**
   * The password
   */
  password(): sys.Buf | null;
  __password(it: sys.Buf | null): void;
  /**
   * How long to wait for CONNACK after the CONNECT message is
   * sent
   */
  connectTimeout(): sys.Duration;
  __connectTimeout(it: sys.Duration): void;
  /**
   * The keep-alive time interval (which will be converted to
   * seconds)
   */
  keepAlive(): sys.Duration;
  __keepAlive(it: sys.Duration): void;
  /**
   * The authentication data.
   * 
   * This setting only applies to clients with version >= 5
   */
  authData(): sys.Buf | null;
  __authData(it: sys.Buf | null): void;
  /**
   * Is a clean session (v3) or clean start (v5) requested
   */
  cleanSession(): boolean;
  __cleanSession(it: boolean): void;
  /**
   * If `false`, the server may return a reason string or user
   * properties on a CONNACK or DISCONNECT packet, but MUST NOT
   * send a reason string or user properties on any packet other
   * than PUBLISH, CONNACK, or DISCONNECT.
   * 
   * If `true`, the server may return a reason string or user
   * properties on any packet where it is allowed.
   * 
   * This setting only applies to clients with version >= 5
   */
  requestProblemInfo(): boolean;
  __requestProblemInfo(it: boolean): void;
  /**
   * Used to limit the number of QoS 1 and QoS 2 publications
   * that the client is willing to process concurrently. May not
   * set to zero.
   * 
   * This setting only applies to clients with version >= 5
   */
  receiveMax(): number | null;
  __receiveMax(it: number | null): void;
  /**
   * The session expiry interval (in seconds). If set to `0`, the
   * session ends when the network connection is closed. If set
   * to `0xFFFF_FFFF` the session does not expire.
   * 
   * This setting only applies to clients with version >= 5
   */
  sessionExpiryInterval(): sys.Duration;
  __sessionExpiryInterval(it: sys.Duration): void;
  /**
   * The authentication method to use. If null, extended
   * authentication is not performed.
   * 
   * This setting only applies to clients with version >= 5
   */
  authMethod(): string | null;
  __authMethod(it: string | null): void;
  /**
   * The username
   */
  username(): string | null;
  __username(it: string | null): void;
  static make(f?: ((arg0: ConnectConfig) => void) | null, ...args: unknown[]): ConnectConfig;
}

/**
 * MQTT reason codes. These codes are based off the version 5
 * spec but the code for reasons that have a mapping to 3.1.1
 * codes can be obtained using `v3()`.
 */
export class ReasonCode extends sys.Enum {
  static type$: sys.Type
  static not_authorized(): ReasonCode;
  static disconnect_with_will_message(): ReasonCode;
  static reauthenticate(): ReasonCode;
  static connection_rate_exceeded(): ReasonCode;
  static bad_auth_method(): ReasonCode;
  static server_unavailable(): ReasonCode;
  static unspecified_error(): ReasonCode;
  static no_subscription_existed(): ReasonCode;
  static max_connect_time(): ReasonCode;
  static subscription_ids_not_supported(): ReasonCode;
  static unsupported_protocol_version(): ReasonCode;
  static packet_id_not_found(): ReasonCode;
  static wildcard_subscriptions_not_supported(): ReasonCode;
  static quota_exceeded(): ReasonCode;
  static not_authorized_v3(): ReasonCode;
  static message_rate_too_high(): ReasonCode;
  static server_shutting_down(): ReasonCode;
  static packet_too_large(): ReasonCode;
  static server_busy(): ReasonCode;
  static success(): ReasonCode;
  static no_matching_subscribers(): ReasonCode;
  static qos_not_supported(): ReasonCode;
  static retain_not_supported(): ReasonCode;
  static payload_format_invalid(): ReasonCode;
  static malformed_packet(): ReasonCode;
  static granted_qos1(): ReasonCode;
  static administrative_action(): ReasonCode;
  static granted_qos2(): ReasonCode;
  static granted_qos0(): ReasonCode;
  static server_moved(): ReasonCode;
  /**
   * The reason code
   */
  code(): number;
  static topic_name_invalid(): ReasonCode;
  /**
   * List of ReasonCode values indexed by ordinal
   */
  static vals(): sys.List<ReasonCode>;
  static use_another_server(): ReasonCode;
  static bad_username_or_password(): ReasonCode;
  static topic_filter_invalid(): ReasonCode;
  static continue_auth(): ReasonCode;
  static client_identifier_not_valid(): ReasonCode;
  static packet_id_in_use(): ReasonCode;
  static implementation_specific_error(): ReasonCode;
  static banned(): ReasonCode;
  static protocol_error(): ReasonCode;
  static topic_alias_invalid(): ReasonCode;
  static keep_alive_timeout(): ReasonCode;
  /**
   * The packet types this code can be used for
   */
  types(): sys.List<PacketType>;
  static shared_subscriptions_not_supported(): ReasonCode;
  static normal_disconnection(): ReasonCode;
  static receive_max_exceeded(): ReasonCode;
  static session_taken_over(): ReasonCode;
  /**
   * Is this an error reason code?
   */
  isErr(): boolean;
  /**
   * Return the ReasonCode instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): ReasonCode;
  /**
   * Get the MQTT 3.1.1 code
   */
  v3(): number;
  static fromCode(code: number, type: PacketType, checked?: boolean): ReasonCode | null;
}

/**
 * ClientListener is used to register callback handlers for
 * various client events
 */
export abstract class ClientListener extends sys.Obj {
  static type$: sys.Type
  /**
   * Callback when the client has been disconnected from the
   * broker. This can happen for several reasons:
   * - client initiated `DISCONNECT` packet is sent
   * - server initiated `DISCONNECT` packet is received
   * - client `CONNECT` times out (no `CONNACK` received)
   * - network disruption causes existing socket to be closed.
   */
  onDisconnected(err: sys.Err | null): void;
  /**
   * Callback when the client has connected to the broker. This
   * means the broker has responded to a `CONNECT` message with a
   * successful `CONNACK` response.
   */
  onConnected(): void;
}

/**
 * Client auto-reconnect strategies implement this mixin.
 */
export abstract class ClientAutoReconnect extends sys.Obj implements ClientListener {
  static type$: sys.Type
  /**
   * Callback when the client has been disconnected from the
   * broker. This can happen for several reasons:
   * - client initiated `DISCONNECT` packet is sent
   * - server initiated `DISCONNECT` packet is received
   * - client `CONNECT` times out (no `CONNACK` received)
   * - network disruption causes existing socket to be closed.
   */
  onDisconnected(err: sys.Err | null): void;
  /**
   * Callback when the client has connected to the broker. This
   * means the broker has responded to a `CONNECT` message with a
   * successful `CONNACK` response.
   */
  onConnected(): void;
}

/**
 * A message contains the application payload and delivery
 * options for a publish packet.
 */
export class Message extends sys.Obj {
  static type$: sys.Type
  /**
   * If specified, this is the lifetime of the application
   * message in seconds. If the message expirty interval has
   * passed and the server has not managed to start onward
   * delivery to a matching subscriber, then the server MUST
   * delete the copy of the message for that subscriber.
   * 
   * If null, the application message does not expire.
   * 
   * This option only applies to clients with version >= 5
   */
  expiryInterval(): sys.Duration | null;
  __expiryInterval(it: sys.Duration | null): void;
  /**
   * Should the message be retained?
   */
  retain(): boolean;
  __retain(it: boolean): void;
  /**
   * User properties to send as part of the message.
   * 
   * This setting only applies to clients with version >= 5
   */
  userProps(): sys.List<StrPair>;
  __userProps(it: sys.List<StrPair>): void;
  /**
   * The requested {@link QoS | quality of service}
   */
  qos(): QoS;
  __qos(it: QoS): void;
  /**
   * The application payload.
   * 
   * Since it is `const` make sure you use {@link sys.Buf.in | payload.in}
   * to read the contents of the payload.
   */
  payload(): sys.Buf;
  __payload(it: sys.Buf): void;
  /**
   * The content type of the application message
   * 
   * This setting only applies to clients with version >= 5
   */
  contentType(): string | null;
  __contentType(it: string | null): void;
  /**
   * Set to true to notify the server and all recipients that the
   * payload of the message is UTF-8 encoded character data. If
   * false, the payload is treated as unspecified bytes
   * 
   * This option only applies to clients with version >= 5
   */
  utf8Payload(): boolean;
  __utf8Payload(it: boolean): void;
  static makeFields(payload: sys.Buf, qos?: QoS, retain?: boolean, f?: ((arg0: Message) => void) | null, ...args: unknown[]): Message;
  static make(f: ((arg0: Message) => void), ...args: unknown[]): Message;
  /**
   * Get the message properties from the configured fields.
   */
  props(): Properties;
}

/**
 * Properties is a collection of MQTT property pairs.
 */
export class Properties extends sys.Obj {
  static type$: sys.Type
  /**
   * Get the value for the specified property, or return `def` if
   * it is not set.
   */
  get(prop: Property, def?: sys.JsObj | null): sys.JsObj | null;
  static make(...args: unknown[]): Properties;
  /**
   * Add the given property and value pair. If the property
   * already exists it is overwritten. However, the user property
   * may be added multiple times. The value for the property is
   * checked to ensure it is the correct type and fits the
   * accepted range of values for that property.
   * 
   * If the val is `null`, all instances of the property are
   * removed (including those that allow duplicate entries).
   */
  add(prop: Property, val: sys.JsObj | null): this;
  toStr(): string;
  /**
   * Return if no properties are set.
   */
  isEmpty(): boolean;
  /**
   * Remove all properties and return this.
   */
  clear(): this;
  /**
   * Iterate the properties.
   */
  each(f: ((arg0: sys.JsObj, arg1: Property) => void)): void;
}

/**
 * MQTT Quality-of-Service levels
 * - At Most Once (fire-and-forget): QoS 0
 * - At Least Once: QoS 1
 * - Exactly Once: QoS 2
 */
export class QoS extends sys.Enum {
  static type$: sys.Type
  /**
   * List of QoS values indexed by ordinal
   */
  static vals(): sys.List<QoS>;
  static one(): QoS;
  static two(): QoS;
  static zero(): QoS;
  /**
   * Return the QoS instance for the specified name.  If not a
   * valid name and checked is false return null, otherwise throw
   * ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): QoS;
  isZero(): boolean;
}

export class TopicTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): TopicTest;
  testFilters(): void;
  testNames(): void;
  testMatch(): void;
}

/**
 * MQTT Topic
 */
export class Topic extends sys.Obj {
  static type$: sys.Type
  /**
   * Validate that this is a valid topic filter and return it.
   */
  static validateFilter(topic: string): string;
  /**
   * Return true if the topic matches the filter.
   */
  static matches(topic: string, filter: string): boolean;
  /**
   * Validate that this is a valid topic name - it must not
   * contain any wildcard characters. Returns the name.
   */
  static validateName(name: string): string;
  static make(...args: unknown[]): Topic;
}

/**
 * The configuration to use when creating an {@link MqttClient | MqttClient}.
 */
export class ClientConfig extends sys.Obj {
  static type$: sys.Type
  /**
   * The client identifier
   */
  clientId(): string;
  __clientId(it: string): void;
  /**
   * How long to wait for CONNACK before timing out the
   * connection
   */
  mqttConnectTimeout(): sys.Duration;
  __mqttConnectTimeout(it: sys.Duration): void;
  /**
   * Actor pool for client actors
   */
  pool(): concurrent.ActorPool;
  __pool(it: concurrent.ActorPool): void;
  /**
   * The MQTT protocol version to use
   */
  version(): MqttVersion;
  __version(it: MqttVersion): void;
  /**
   * The socket configuration to use.
   */
  socketConfig(): inet.SocketConfig;
  __socketConfig(it: inet.SocketConfig): void;
  /**
   * How many times to retry messages that require
   * acknowledgement
   */
  maxRetry(): number;
  __maxRetry(it: number): void;
  /**
   * The MQTT server uri to connect to.
   * 
   * To connect via the TCP transport use either the `mqtt` (plain
   * socket) or `mqtts` (TLS socket) scheme.
   * 
   * To connect via a websocket use either the `ws` (plain socket)
   * or `wss` (TLS socket) scheme.
   */
  serverUri(): sys.Uri;
  __serverUri(it: sys.Uri): void;
  /**
   * Maximum number of messages requiring acknowledgement that
   * can be in-flight.
   */
  maxInFlight(): number;
  __maxInFlight(it: number): void;
  /**
   * The persistence layer to use for this client
   */
  persistence(): ClientPersistence;
  __persistence(it: ClientPersistence): void;
  /**
   * How long to wait between retries for messages that require
   * acknowledgement
   */
  retryInterval(): sys.Duration;
  __retryInterval(it: sys.Duration): void;
  /**
   * How long until unacknowledged messages timeout
   */
  timeout(): sys.Duration;
  static make(f: ((arg0: ClientConfig) => void), ...args: unknown[]): ClientConfig;
}

export class PropertiesTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): PropertiesTest;
  test(): void;
}

