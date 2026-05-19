import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as crypto from './crypto.js';

/**
 * IpAddr models both IPv4 and IPv6 numeric addresses as well
 * as provide DNS hostname resolution.
 */
export class IpAddr extends sys.Obj {
  static type$: sys.Type
  /**
   * Return the exact string passed to the constructor.
   */
  toStr(): string;
  /**
   * Get this address as a Str in its numeric notation.  For IPv4
   * this is four decimal digits separated by dots.  For IPv6
   * this is eight hexadecimal digits separated by colons.
   */
  numeric(): string;
  /**
   * Is this a 32 bit (four byte) IP version 4 address.
   */
  isIPv4(): boolean;
  /**
   * Return the IpAddr for the local machine.
   */
  static local(): IpAddr;
  /**
   * To the native platform representation:
   * - Java: returns `java.net.InetAddress`
   * - .NET: returns `System.Net.IPAddress`
   */
  toNative(): sys.JsObj;
  /**
   * Is this a 128 bit (sixteen byte) IP version 6 address.
   */
  isIPv6(): boolean;
  /**
   * Return the hostname of this address.  If a hostname was
   * specified in make, then that string is used.  Otherwise this
   * method will perform a reverse DNS lookup potentially
   * blocking the calling thread.  If the address cannot be
   * mapped to a hostname, then return the address in its numeric
   * format.
   */
  hostname(): string;
  /**
   * Resolve a hostname to all of its configured IP addresses. If
   * a numeric IPv4 or IPv6 address is specified then a list of
   * one IpAddr is returned.  If a hostname if provided, then it
   * is resolved to all its configured IP addresses potentially
   * blocking the calling thread.  If the address is invalid or a
   * hostname cannot be resolved then UnknownHostErr is thrown.
   */
  static makeAll(s: string): sys.List<IpAddr>;
  /**
   * Get the raw bytes of this address as a Buf of 4 or 16 bytes
   * for IPv4 or IPv6 respectively.  The buf position is zero.
   */
  bytes(): sys.Buf;
  /**
   * Equality is based on equivalent address bytes.
   */
  equals(obj: sys.JsObj | null): boolean;
  /**
   * Make an IpAddr for the specified raw bytes.  The size of the
   * byte buffer must be 4 for IPv4 or 16 for IPv6, otherwise
   * ArgErr is thrown.  The bytes must be a memory backed buffer.
   */
  static makeBytes(bytes: sys.Buf): IpAddr;
  /**
   * Is this a loopback address.
   */
  isLoopback(): boolean;
  /**
   * Parse an IP address formated as an IPv4 numeric address,
   * IPv6 numeric address, or a DNS hostname.  If a hostname if
   * provided, then it is resolved to an IP address potentially
   * blocking the calling thread.  If the address is invalid or a
   * hostname cannot be resolved then UnknownHostErr is thrown.
   * 
   * Examples:
   * ```
   * IpAddr("169.200.3.103")
   * IpAddr("1080:0:0:0:8:800:200C:417A")
   * IpAddr("1080::8:800:200C:417A")
   * IpAddr("::ffff:129.144.52.38")
   * IpAddr("somehost")
   * IpAddr("www.acme.com")
   * ```
   */
  static make(s: string, ...args: unknown[]): IpAddr;
  /**
   * Hash code is based the address bytes.
   */
  hash(): number;
  /**
   * Is this a site local address.
   */
  isSiteLocal(): boolean;
}

/**
 * UdpSocket manages a UDP/IP datagram endpoint.
 */
export class UdpSocket extends sys.Obj {
  static type$: sys.Type
  /**
   * Disconnect this socket from its remote address.  Do nothing
   * if not connected. Return this.
   */
  disconnect(): this;
  /**
   * Is this socket "connected" to a specific remote host.  Since
   * UDP is not session oriented, connected just means we've used
   * connect() to predefine the remote address where we want to
   * send packets.
   */
  isConnected(): boolean;
  /**
   * Bind this socket to the specified local address.  If addr is
   * null then the default IpAddr for the local host is selected.
   * If port is null an ephemeral port is selected.  Throw IOErr
   * if the port is already bound or the bind fails.  Return
   * this.
   */
  bind(addr: IpAddr | null, port: number | null): this;
  /**
   * Access the SocketOptions used to tune this socket.  The
   * following options apply to UdpSockets:
   * - broadcast
   * - receiveBufferSize
   * - sendBufferSize
   * - reuseAddr
   * - receiveBufferSize
   * - trafficClass Accessing other option fields will throw
   *   UnsupportedErr.
   */
  options(): SocketOptions;
  /**
   * Make a new unbound UDP socket. The socket will be configured
   * using the given {@link SocketConfig | socket configuration}.
   * The following configuration applies to UDP sockets:
   * - {@link SocketConfig.broadcast | SocketConfig.broadcast}
   * - {@link SocketConfig.receiveBufferSize | SocketConfig.receiveBufferSize}
   * - {@link SocketConfig.sendBufferSize | SocketConfig.sendBufferSize}
   * - {@link SocketConfig.reuseAddr | SocketConfig.reuseAddr}
   * - {@link SocketConfig.receiveBufferSize | SocketConfig.receiveBufferSize}
   * - {@link SocketConfig.trafficClass | SocketConfig.trafficClass}
   */
  static make(config?: SocketConfig, ...args: unknown[]): UdpSocket;
  /**
   * Get the bound local address or null if unbound.
   */
  localAddr(): IpAddr | null;
  /**
   * Close this socket.  This method is guaranteed to never throw
   * an IOErr.  Return true if the socket was closed successfully
   * or false if the socket was closed abnormally.
   */
  close(): boolean;
  /**
   * Connect this socket to the specified address and port.  Once
   * connected packets may only be send to the remote using this
   * socket.
   */
  connect(addr: IpAddr, port: number): this;
  /**
   * Get the remote address or null if not connected to a
   * specific end point.
   */
  remoteAddr(): IpAddr | null;
  /**
   * Receive a packet on this socket's bound local address.  The
   * resulting packet is filled in with the sender's address and
   * port.  This method blocks until a packet is received.  If
   * this socket's receiveTimeout option is configured, then
   * receive will timeout with an IOErr.
   * 
   * The packet data is read into the Buf starting at it's
   * current position. The buffer is *not* grown - at most
   * Buf.capacity bytes are received. If the received message is
   * longer than the packet's capacity then the message is
   * silently truncated (weird Java behavior).  Upon return the
   * Buf size and position are updated to reflect the bytes read.
   * Use {@link sys.Buf.flip | sys::Buf.flip} to ready the buffer
   * to read from start. If packet is null, then a new packet is
   * created with a capacity of 1kb.  The packet data must always
   * be a memory backed buffer.
   */
  receive(packet?: UdpPacket | null): UdpPacket;
  /**
   * Get the bound local port or null if unbound.
   */
  localPort(): number | null;
  /**
   * Get the remote port or null if not connected to a specific
   * end point.
   */
  remotePort(): number | null;
  /**
   * Is this socket closed.
   */
  isClosed(): boolean;
  /**
   * Is this socket bound to a local address and port.
   */
  isBound(): boolean;
  /**
   * Get the {@link SocketConfig | socket configuration} for this
   * socket.
   */
  config(): SocketConfig;
  /**
   * Send the packet to its specified remote endpoint.  If this
   * is socket is connected to a specific remote address, then
   * the packet's address and port must be null or ArgErr is
   * thrown.  Throw IOErr on error.
   * 
   * The number of bytes sent is buf.remaining; upon return the
   * buf is drained and position is advanced.
   */
  send(packet: UdpPacket): void;
}

/**
 * Configuration options for TCP and UDP sockets. All socket
 * types accept a socket configuration which will be used to
 * configure the socket when it is created.
 * 
 * A system-wide default socket configuration can be obtained
 * with {@link cur | SocketConfig.cur}. You can change the
 * system default by using {@link setCur | SocketConfig.setCur}.
 * 
 * See {@link TcpSocket.make | TcpSocket.make}, {@link TcpListener.make | TcpListener.make},
 * {@link UdpSocket.make | UdpSocket.make}, {@link MulticastSocket.make | MulticastSocket.make}
 */
export class SocketConfig extends sys.Obj {
  static type$: sys.Type
  /**
   * `SO_BROADCAST` socket option
   */
  broadcast(): boolean;
  __broadcast(it: boolean): void;
  /**
   * `TCP_NODELAY` socket option specifies that send not be delayed
   * to merge packets (Nagle's algorthm).
   */
  noDelay(): boolean;
  __noDelay(it: boolean): void;
  /**
   * Controls the default timeout used by {@link TcpSocket.connect | TcpSocket.connect}.
   * A null value indicates a system default timeout (usually
   * wait forever).
   */
  connectTimeout(): sys.Duration | null;
  __connectTimeout(it: sys.Duration | null): void;
  /**
   * The {@link crypto.KeyStore | crypto::KeyStore} to use when
   * creating secure sockets. If null, the runtime default will
   * be used.
   */
  keystore(): crypto.KeyStore | null;
  __keystore(it: crypto.KeyStore | null): void;
  /**
   * The {@link crypto.KeyStore | crypto::KeyStore} to use for
   * obtaining trusted certificates when creating secure sockets.
   * If null, the runtime default will be used.
   */
  truststore(): crypto.KeyStore | null;
  __truststore(it: crypto.KeyStore | null): void;
  /**
   * Controls how long a {@link TcpListener.accept | TcpListener.accept}
   * will block before throwing an IOErr timeout exception. `null`
   * is used to indicate infinite timeout.
   */
  acceptTimeout(): sys.Duration | null;
  __acceptTimeout(it: sys.Duration | null): void;
  /**
   * The type-of-class byte in the IP packet header.
   * 
   * For IPv4 this value is detailed in RFC 1349 as the following
   * bitset:
   * - IPTOS_LOWCOST     (0x02)
   * - IPTOS_RELIABILITY (0x04)
   * - IPTOS_THROUGHPUT  (0x08)
   * - IPTOS_LOWDELAY    (0x10)
   * 
   * For IPv6 this is the value placed into the sin6_flowinfo
   * header field.
   */
  trafficClass(): number;
  __trafficClass(it: number): void;
  /**
   * The size in bytes for the sys::OutStream buffer. A value of
   * 0 or null disables output stream buffing.
   */
  outBufferSize(): number | null;
  __outBufferSize(it: number | null): void;
  /**
   * `SO_KEEPALIVE` option
   */
  keepAlive(): boolean;
  __keepAlive(it: boolean): void;
  /**
   * `SO_LINGER` controls the linger time or set to null to disable
   * linger.
   */
  linger(): sys.Duration | null;
  __linger(it: sys.Duration | null): void;
  /**
   * `SO_SNDBUF` option for the size in bytes of the IP stack
   * buffers.
   */
  sendBufferSize(): number;
  __sendBufferSize(it: number): void;
  /**
   * `SO_REUSEADDR` is used to control the time wait state of a
   * closed socket.
   */
  reuseAddr(): boolean;
  __reuseAddr(it: boolean): void;
  /**
   * `SO_RCVBUF` option for the size in bytes of the IP stack
   * buffers.
   */
  receiveBufferSize(): number;
  __receiveBufferSize(it: number): void;
  /**
   * The size in bytes for the sys::InStream buffer. A value of 0
   * or null disables input stream buffing.
   */
  inBufferSize(): number | null;
  __inBufferSize(it: number | null): void;
  /**
   * `SO_TIMEOUT` controls the amount of time a socket will block
   * on a read call before throwing an IOErr timeout exception. `null`
   * is used to indicate an infinite timeout.
   */
  receiveTimeout(): sys.Duration | null;
  __receiveTimeout(it: sys.Duration | null): void;
  /**
   * Get the current, default socket configuration
   */
  static cur(): SocketConfig;
  /**
   * Create a copy of this configuration and then apply any
   * overrides from the it-block.
   */
  copy(f: ((arg0: this) => void)): this;
  /**
   * Create and configure the socket options.
   */
  static make(f?: ((arg0: SocketConfig) => void) | null, ...args: unknown[]): SocketConfig;
  /**
   * Convenience to create a copy of this socket configuration
   * and set the connect and receive timeouts to the given
   * duration. Setting to `null` indicates infinite timeouts.
   */
  setTimeouts(connectTimeout: sys.Duration | null, receiveTimeout?: sys.Duration | null): this;
  /**
   * Set a new default socket configuration. This configuration
   * will only apply to new sockets created after this is called.
   * This method may only be called **once** to change the default
   * socket configuration.
   */
  static setCur(cfg: SocketConfig): void;
}

export class TcpSocketTest extends sys.Test {
  static type$: sys.Type
  testMake(): void;
  testConnectHttp(): void;
  doTestConnectHttp(timeout: sys.Duration | null): void;
  static make(...args: unknown[]): TcpSocketTest;
  testConnectFailures(): void;
  testBind(): void;
  verifyBind(addr: IpAddr | null, port: number | null): void;
  testOptions(): void;
}

/**
 * Network interface which models name and IP addresses
 * assigned
 */
export class IpInterface extends sys.Obj {
  static type$: sys.Type
  /**
   * Return true if interface supports multicast
   */
  supportsMulticast(): boolean;
  /**
   * Display name of the interface
   */
  dis(): string;
  /**
   * Return true if point to point interface (PPP through modem)
   */
  isPointToPoint(): boolean;
  /**
   * Return true if interface is up and running
   */
  isUp(): boolean;
  /**
   * Media Access Control (MAC) or physical address for this
   * interface return null if address does not exist.
   */
  hardwareAddr(): sys.Buf | null;
  /**
   * Return true if a loopback interface
   */
  isLoopback(): boolean;
  /**
   * Return string representation.
   */
  toStr(): string;
  /**
   * Return list of IP addresses bound to this interface
   */
  addrs(): sys.List<IpAddr>;
  /**
   * Return list of all broadcast IP addresses bound to this
   * interface
   */
  broadcastAddrs(): sys.List<IpAddr>;
  /**
   * Find the interface by its name.  If the interface is not
   * found then return null or raise UnresolvedErr based on
   * checked flag.
   */
  static findByName(name: string, checked?: boolean): IpInterface | null;
  /**
   * List the interfaces on this machine
   */
  static list(): sys.List<IpInterface>;
  /**
   * Find the interface bound to the given IP address.  If
   * multiple interfaces are bound to the address it is undefined
   * which one is returned.  If no interfaces are bound then
   * return null or raise UnresolvedErr based on checked flag.
   */
  static findByAddr(addr: IpAddr, checked?: boolean): IpInterface | null;
  /**
   * Returns the network prefix length in bits for given address.
   * This is also known as the subnet mask in the context of IPv4
   * addresses. Typical IPv4 values would be 8 (255.0.0.0), 16
   * (255.255.0.0) or 24 (255.255.255.0).
   */
  prefixSize(addr: IpAddr): number;
  /**
   * Maximum transmission unit of interface
   */
  mtu(): number;
  /**
   * Equality is based on interface name and addresses
   */
  equals(obj: sys.JsObj | null): boolean;
  /**
   * Name of the interface
   */
  name(): string;
  /**
   * Hash code is based on interface name and addresses
   */
  hash(): number;
}

/**
 * UnknownHostErr indicates a failure to resolve a hostname to
 * an IP address.
 */
export class UnknownHostErr extends sys.IOErr {
  static type$: sys.Type
  static make(msg: string, cause?: sys.Err | null, ...args: unknown[]): UnknownHostErr;
}

export class UdpSocketTest extends sys.Test {
  static type$: sys.Type
  testMake(): void;
  testMessaging(): void;
  static runServer(s: UdpSocket): string;
  static make(...args: unknown[]): UdpSocketTest;
  testBind(): void;
  verifyBind(addr: IpAddr | null, port: number | null): void;
  testOptions(): void;
}

export class IpAddrTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): IpAddrTest;
  test(): void;
  verifyAddr(str: string, bytes: sys.List<number>, numeric?: string, numericAlt?: string | null): void;
}

export class IpInterfaceTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): IpInterfaceTest;
  testFindByAddr(): void;
  testFindByName(): void;
  testList(): void;
}

export class MulticastSocketTest extends sys.Test {
  static type$: sys.Type
  testMake(): void;
  static make(...args: unknown[]): MulticastSocketTest;
}

/**
 * TcpSocket manages a TCP/IP endpoint.
 */
export class TcpSocket extends sys.Obj {
  static type$: sys.Type
  /**
   * Bind this socket to the specified local address.  If addr is
   * null then the default IpAddr for the local host is selected.
   * If port is null an ephemeral port is selected.  Throw IOErr
   * if the port is already bound or the bind fails.  Return
   * this.
   */
  bind(addr: IpAddr | null, port: number | null): this;
  /**
   * Access the SocketOptions used to tune this socket.  The
   * following options apply to TcpSockets:
   * - inBufferSize
   * - outBufferSize
   * - keepAlive
   * - receiveBufferSize
   * - sendBufferSize
   * - reuseAddr
   * - linger
   * - receiveTimeout
   * - noDelay
   * - trafficClass Accessing other option fields will throw
   *   UnsupportedErr.
   */
  options(): SocketOptions;
  /**
   * Get the bound local port or null if unbound.
   */
  localPort(): number | null;
  /**
   * Get the input stream used to read data from the socket.  The
   * input stream is automatically buffered according to
   * SocketOptions.inBufferSize. If not connected then throw
   * IOErr.
   */
  in(): sys.InStream;
  /**
   * Is this socket connected to the remote host.
   */
  isConnected(): boolean;
  /**
   * Get the output stream used to write data to the socket.  The
   * output stream is automatically buffered according to
   * SocketOptions.outBufferSize If not connected then throw
   * IOErr.
   */
  out(): sys.OutStream;
  /**
   * Make a new unbound, unconnected TCP socket. The socket will
   * be configured using the given {@link SocketConfig | socket configuration}.
   * The following configuration applies to a TCP socket:
   * - {@link SocketConfig.inBufferSize | SocketConfig.inBufferSize}
   * - {@link SocketConfig.outBufferSize | SocketConfig.outBufferSize}
   * - {@link SocketConfig.keepAlive | SocketConfig.keepAlive}
   * - {@link SocketConfig.receiveBufferSize | SocketConfig.receiveBufferSize}
   * - {@link SocketConfig.sendBufferSize | SocketConfig.sendBufferSize}
   * - {@link SocketConfig.reuseAddr | SocketConfig.reuseAddr}
   * - {@link SocketConfig.linger | SocketConfig.linger}
   * - {@link SocketConfig.receiveTimeout | SocketConfig.receiveTimeout}
   * - {@link SocketConfig.noDelay | SocketConfig.noDelay}
   * - {@link SocketConfig.trafficClass | SocketConfig.trafficClass}
   */
  static make(config?: SocketConfig, ...args: unknown[]): TcpSocket;
  /**
   * Get the bound local address or null if unbound.
   */
  localAddr(): IpAddr | null;
  /**
   * Close this socket and its associated IO streams.  This
   * method is guaranteed to never throw an IOErr.  Return true
   * if the socket was closed successfully or false if the socket
   * was closed abnormally.
   */
  close(): boolean;
  /**
   * Connect this socket to the specified address and port.  This
   * method will block until the connection is made.  Throw IOErr
   * if there is a connection error.  If a non-null timeout is
   * specified, then block no longer then the specified timeout
   * before raising an IOErr.  If timeout is null, then a system
   * default is used.  The default timeout is configured via {@link SocketConfig.connectTimeout | SocketConfig.connectTimeout}.
   */
  connect(addr: IpAddr, port: number, timeout?: sys.Duration | null): this;
  /**
   * Get the remote address or null if not connected.
   */
  remoteAddr(): IpAddr | null;
  /**
   * Disables the output stream for this socket. Any previously
   * written data will be sent followed by TCP's normal
   * connection termination sequence.  Raise IOErr if error
   * occurs.
   */
  shutdownOut(): void;
  /**
   * Place input stream for socket at "end of stream".  Any data
   * sent to input side of socket is acknowledged and then
   * silently discarded. Raise IOErr if error occurs.
   */
  shutdownIn(): void;
  /**
   * Get the remote port or null if not connected.
   */
  remotePort(): number | null;
  /**
   * Get a new TCP socket that is upgraded to use TLS.  If
   * connecting through a web proxy, specify the destination
   * address and port.
   */
  upgradeTls(addr?: IpAddr | null, port?: number | null): TcpSocket;
  /**
   * Is this socket closed.
   */
  isClosed(): boolean;
  /**
   * Is this socket bound to a local address and port.
   */
  isBound(): boolean;
  /**
   * Get the {@link SocketConfig | socket configuration} for this
   * socket.
   */
  config(): SocketConfig;
}

/**
 * MulticastSocket extends UdpSocket to provide multicast
 * capabilities.
 */
export class MulticastSocket extends UdpSocket {
  static type$: sys.Type
  /**
   * True to enable outgoing packets to be received by the local
   * socket.
   */
  loopbackMode(): boolean;
  loopbackMode(it: boolean): void;
  /**
   * Default network interface for outgoing datagrams on this
   * socket
   */
  interface(): IpInterface;
  interface(it: IpInterface): void;
  /**
   * Default time to live for packets send on this socket.  Value
   * must be between 0 and 255.  TTL of zero is only delivered
   * locally.
   */
  timeToLive(): number;
  timeToLive(it: number): void;
  /**
   * Join a multicast group.  If interface parameter is null,
   * then {@link interface | interface} field is used.  Return
   * this.
   */
  joinGroup(addr: IpAddr, port?: number | null, interface$?: IpInterface | null): this;
  /**
   * Make a new unbound multicast UDP socket.
   */
  static make(config?: SocketConfig, ...args: unknown[]): MulticastSocket;
  /**
   * Leave a multicast group.  If interface parameter is null,
   * then {@link interface | interface} field is used.  Return
   * this.
   */
  leaveGroup(addr: IpAddr, port?: number | null, interface$?: IpInterface | null): this;
}

/**
 * SocketOptions groups together all the socket options used to
 * tune a TcpSocket, TcpListener, or UdpSocket.  See the
 * options method of each of those classes for which options
 * apply.  Accessing an unsupported option for a particular
 * socket type will throw UnsupportedErr.
 */
export class SocketOptions extends sys.Obj {
  static type$: sys.Type
  /**
   * SO_BROADCAST socket option.
   */
  broadcast(): boolean;
  broadcast(it: boolean): void;
  /**
   * TCP_NODELAY socket option specifies that send not be delayed
   * to merge packets (Nagle's algorthm).
   */
  noDelay(): boolean;
  noDelay(it: boolean): void;
  /**
   * Controls default timeout used by {@link TcpSocket.connect | TcpSocket.connect}.
   * A null value indicates a system default timeout.
   */
  connectTimeout(): sys.Duration | null;
  connectTimeout(it: sys.Duration | null): void;
  /**
   * The type-of-class byte in the IP packet header.
   * 
   * For IPv4 this value is detailed in RFC 1349 as the following
   * bitset:
   * - IPTOS_LOWCOST     (0x02)
   * - IPTOS_RELIABILITY (0x04)
   * - IPTOS_THROUGHPUT  (0x08)
   * - IPTOS_LOWDELAY    (0x10)
   * 
   * For IPv6 this is the value placed into the sin6_flowinfo
   * header field.
   */
  trafficClass(): number;
  trafficClass(it: number): void;
  /**
   * The size in bytes for the sys::OutStream buffer.  A value of
   * 0 or null disables output stream buffing.  This field may
   * only be set before the socket is connected otherwise Err is
   * thrown.
   */
  outBufferSize(): number | null;
  outBufferSize(it: number | null): void;
  /**
   * SO_KEEPALIVE socket option.
   */
  keepAlive(): boolean;
  keepAlive(it: boolean): void;
  /**
   * SO_LINGER socket option controls the linger time or set to
   * null to disable linger.
   */
  linger(): sys.Duration | null;
  linger(it: sys.Duration | null): void;
  /**
   * SO_SNDBUF option for the size in bytes of the IP stack
   * buffers.
   */
  sendBufferSize(): number;
  sendBufferSize(it: number): void;
  /**
   * SO_REUSEADDR socket option is used to control the time wait
   * state of a closed socket.
   */
  reuseAddr(): boolean;
  reuseAddr(it: boolean): void;
  /**
   * SO_RCVBUF option for the size in bytes of the IP stack
   * buffers.
   */
  receiveBufferSize(): number;
  receiveBufferSize(it: number): void;
  /**
   * The size in bytes for the sys::InStream buffer.  A value of
   * 0 or null disables input stream buffing.  This field may
   * only be set before the socket is connected otherwise Err is
   * thrown.
   */
  inBufferSize(): number | null;
  inBufferSize(it: number | null): void;
  /**
   * SO_TIMEOUT socket option controls the amount of time this
   * socket will block on a read call before throwing an IOErr
   * timeout exception. Null is used to indicate an infinite
   * timeout.
   */
  receiveTimeout(): sys.Duration | null;
  receiveTimeout(it: sys.Duration | null): void;
  /**
   * Set all of this instance's options from the specified
   * options.
   */
  copyFrom(options: SocketOptions): void;
}

export class TcpListenerTest extends sys.Test {
  static type$: sys.Type
  testMake(): void;
  static trace(s: string): void;
  dump(s: TcpListener): void;
  static make(...args: unknown[]): TcpListenerTest;
  testBind(): void;
  verifyBind(addr: IpAddr | null, port: number | null): void;
  testOptions(): void;
  testAccept(): void;
  static runClient(port: number): sys.JsObj;
}

/**
 * TcpListener is a server socket that listens to a local well
 * known port for incoming TcpSockets.
 */
export class TcpListener extends sys.Obj {
  static type$: sys.Type
  /**
   * Bind this listener to the specified local address.  If addr
   * is null then the default IpAddr for the local host is
   * selected.  If port is null an ephemeral port is selected. 
   * Throw IOErr if the port is already bound or the bind fails. 
   * Return this.
   */
  bind(addr: IpAddr | null, port: number | null, backlog?: number): this;
  /**
   * Access the SocketOptions used to tune this server socket.
   * The following options apply to TcpListeners:
   * - receiveBufferSize
   * - reuseAddr Accessing other option fields will throw
   *   UnsupportedErr.
   */
  options(): SocketOptions;
  /**
   * Create a new, unbound TCP server socket. The socket will be
   * configured using the given {@link SocketConfig | socket configuration}.
   * The following configuration applies to listeners:
   * - {@link SocketConfig.receiveBufferSize | SocketConfig.receiveBufferSize}
   * - {@link SocketConfig.reuseAddr | SocketConfig.reuseAddr}
   * - {@link SocketConfig.acceptTimeout | SocketConfig.acceptTimeout}
   */
  static make(config?: SocketConfig, ...args: unknown[]): TcpListener;
  /**
   * Get the bound local address or null if unbound.
   */
  localAddr(): IpAddr | null;
  /**
   * Close this server socket.  This method is guaranteed to
   * never throw an IOErr.  Return true if the socket was closed
   * successfully or false if the socket was closed abnormally.
   */
  close(): boolean;
  /**
   * Get the bound local port or null if unbound.
   */
  localPort(): number | null;
  /**
   * Accept the next incoming connection.  This method blocks the
   * calling thread until a new connection is established.  If
   * this listener's {@link SocketConfig.acceptTimeout | SocketConfig.acceptTimeout}
   * is configured, then accept will timeout with an IOErr.
   */
  accept(): TcpSocket;
  /**
   * Is this socket closed.
   */
  isClosed(): boolean;
  /**
   * Is this socket bound to a local address and port.
   */
  isBound(): boolean;
  /**
   * The {@link SocketConfig | SocketConfig} being used to
   * configure the server sockets.
   */
  config(): SocketConfig;
}

/**
 * UdpPacket encapsulates an IpAddr, port, and payload of bytes
 * to send or receive from a UdpSocket.
 */
export class UdpPacket extends sys.Obj {
  static type$: sys.Type
  /**
   * The payload to send or received.  Defaults to null. The data
   * buffer must always be a memory backed buffer.
   */
  data(): sys.Buf | null;
  data(it: sys.Buf | null): void;
  /**
   * The send or receive port number.  Defaults to null.
   */
  port(): number | null;
  port(it: number | null): void;
  /**
   * The send or receive IpAddr.  Defaults to null.
   */
  addr(): IpAddr | null;
  addr(it: IpAddr | null): void;
  /**
   * Construct a new UdpPacket.
   */
  static make(addr?: IpAddr | null, port?: number | null, data?: sys.Buf | null, ...args: unknown[]): UdpPacket;
}

