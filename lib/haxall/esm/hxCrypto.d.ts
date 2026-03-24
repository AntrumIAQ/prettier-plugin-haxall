import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as crypto from './crypto.js';
import * as inet from './inet.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as hx from './hx.js';

/**
 * Cryptographic certificate and key pair management
 */
export class CryptoLib extends hx.HxLib implements hx.HxCryptoService {
  static type$: sys.Type
  /**
   * Directory for crypto keystore file
   */
  dir(): sys.File;
  /**
   * The keystore to store all trusted keys and certificates
   */
  keystore(): CryptoKeyStore;
  onStart(): void;
  /**
   * Read the keystore into a Buf.
   */
  readBuf(): sys.Buf;
  static make(...args: unknown[]): CryptoLib;
  /**
   * Overwrite the contents of the keystore on disk with the
   * contents of this Buf.
   */
  writeBuf(buf: sys.Buf): void;
  /**
   * Get a keystore containing only the key aliased as "https".
   */
  httpsKey(checked?: boolean): crypto.KeyStore | null;
  /**
   * Publish the HxCryptoService
   */
  services(): sys.List<hx.HxService>;
  /**
   * The host specific private key and certificate
   */
  hostKey(): crypto.PrivKeyEntry;
  /**
   * The host specific public/private key pair.
   */
  hostKeyPair(): crypto.KeyPair;
}

/**
 * CryptoKeyStore saves itself to file after every modification
 */
export class CryptoKeyStore extends sys.Obj implements crypto.KeyStore {
  static type$: sys.Type
  /**
   * Backing file for the keystore
   */
  file(): sys.File;
  aliases(): sys.List<string>;
  save(out: sys.OutStream, options?: sys.Map<string, sys.JsObj>): void;
  remove(alias: string): void;
  setPrivKey(alias: string, priv: crypto.PrivKey, chain: sys.List<crypto.Cert>): this;
  setTrust(alias: string, cert: crypto.Cert): this;
  get(alias: string, checked?: boolean): crypto.KeyStoreEntry | null;
  /**
   * Read the keystore into a Buf.
   */
  readBuf(): sys.Buf;
  static make(pool: concurrent.ActorPool, dir: sys.File, log: sys.Log, timeout?: sys.Duration, ...args: unknown[]): CryptoKeyStore;
  set(alias: string, entry: crypto.KeyStoreEntry): this;
  /**
   * Overwrite the contents of the keystore on disk with the
   * contents of this Buf.
   */
  writeBuf(buf: sys.Buf): this;
  format(): string;
  /**
   * Get the Host key pair
   */
  hostKey(): crypto.PrivKeyEntry;
  /**
   * Find the JVM trusted certificates file
   */
  static findJvmCerts(): sys.File;
  size(): number;
  static toFile(dir: sys.File): sys.File;
  /**
   * Return ture if the key store has an entry with the given
   * alias.
   */
  containsAlias(alias: string): boolean;
  /**
   * Convenience to get a [PrivKeyEntry](PrivKeyEntry) from the
   * keystore.
   */
  getPrivKey(alias: string, checked?: boolean): crypto.PrivKeyEntry | null;
  /**
   * Convenience to get a [TrustEntry](TrustEntry) from the
   * keystore.
   */
  getTrust(alias: string, checked?: boolean): crypto.TrustEntry | null;
}

/**
 * Axon functions for crypto library
 */
export class CryptoFuncs extends sys.Obj {
  static type$: sys.Type
  static make(...args: unknown[]): CryptoFuncs;
  /**
   * Generate a self-signed certificate and store it in the
   * keystore with the given alias. A new 2048-bit RSA key will
   * be generated and then self-signed for the given subject DN.
   * The following options are supported for configuring the
   * signing:
   * - `notBefore` (Date): the start date for certificate validity
   *   period (default=today)
   * - `notAfter` (Date): the end date for the certificate validity
   *   period (default=today+365day)
   * 
   * This func will throw an error if an entry with the given
   * alias already exists.
   */
  static cryptoGenSelfSignedCert(alias: string, subjectDn: string, opts?: haystack.Dict): sys.JsObj | null;
}

