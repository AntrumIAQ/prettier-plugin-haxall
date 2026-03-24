import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as asn1 from './asn1.js';
import * as crypto from './crypto.js';
import * as inet from './inet.js';
import * as util from './util.js';
import * as web from './web.js';

export class X509 extends sys.Obj implements crypto.Cert {
  static type$: sys.Type
  static loadCertsForUri(uri: sys.Uri): sys.List<X509>;
  toStr(): string;
  certType(): string;
  notAfter(): sys.Date;
  serialNum(): sys.Buf;
  subject(): string;
  issuer(): string;
  notBefore(): sys.Date;
  isSelfSigned(): boolean;
  static load(in$: sys.InStream): sys.List<X509>;
  isCA(): boolean;
  pub(): crypto.PubKey;
  static make(...args: unknown[]): X509;
  encoded(): sys.Buf;
}

export class JTrustEntry extends JKeyStoreEntry implements crypto.TrustEntry {
  static type$: sys.Type
  cert(): crypto.Cert;
  static make(cert: crypto.Cert, attrs?: sys.Map<string, string>, ...args: unknown[]): JTrustEntry;
  /**
   * Get the attributes associated with this entry. The
   * attributes are immutable.
   */
  attrs(): sys.Map<string, string>;
}

export class JPrivKey extends JKey implements crypto.PrivKey {
  static type$: sys.Type
  toStr(): string;
  keySize(): number;
  format(): string | null;
  sign(data: sys.Buf, digest: string): sys.Buf;
  static decode(der: sys.Buf, algorithm: string): JPrivKey;
  decrypt(data: sys.Buf, padding?: string): sys.Buf;
  static make(...args: unknown[]): JPrivKey;
  algorithm(): string;
  encoded(): sys.Buf | null;
}

export class JKey extends sys.Obj implements crypto.Key {
  static type$: sys.Type
  static make(...args: unknown[]): JKey;
  /**
   * Get the encoding format of the key, or null if the key
   * doesn't support encoding.
   */
  format(): string | null;
  /**
   * The key's algorithm.
   */
  algorithm(): string;
  /**
   * Get the encoded key, or null if the key doesn't support
   * encoding.
   */
  encoded(): sys.Buf | null;
}

export class JKeyPair extends sys.Obj implements crypto.KeyPair {
  static type$: sys.Type
  priv(): JPrivKey;
  pub(): JPubKey;
  static genKeyPair(algorithm: string, bits: number): JKeyPair;
  static make(priv: JPrivKey, pub: JPubKey, ...args: unknown[]): JKeyPair;
  /**
   * Get the key pair algorithm
   */
  algorithm(): string;
}

export class JDigest extends sys.Obj implements crypto.Digest {
  static type$: sys.Type
  updateI4(i: number): this;
  updateAscii(str: string): this;
  updateByte(i: number): this;
  update(buf: sys.Buf): this;
  updateI8(i: number): this;
  digestSize(): number;
  digest(): sys.Buf;
  reset(): this;
  static make(algorithm: string, ...args: unknown[]): JDigest;
  algorithm(): string;
}

export class JPrivKeyEntry extends JKeyStoreEntry implements crypto.PrivKeyEntry {
  static type$: sys.Type
  certChain(): sys.List<crypto.Cert>;
  priv(): crypto.PrivKey;
  keyPair(): JKeyPair;
  static make(priv: crypto.PrivKey, chain: sys.List<crypto.Cert>, attrs?: sys.Map<string, string>, ...args: unknown[]): JPrivKeyEntry;
  /**
   * Get the end entity certificate from the certificate chain;
   * this should be the first entry in the {@link certChain | certChain}.
   */
  cert(): crypto.Cert;
  /**
   * Get the attributes associated with this entry. The
   * attributes are immutable.
   */
  attrs(): sys.Map<string, string>;
  /**
   * Convenience to get the public key from the {@link cert | cert}.
   */
  pub(): crypto.PubKey;
}

export class JPubKey extends JKey implements crypto.PubKey {
  static type$: sys.Type
  toStr(): string;
  keySize(): number;
  format(): string | null;
  static decode(der: sys.Buf, algorithm: string): JPubKey;
  encrypt(data: sys.Buf, padding?: string): sys.Buf;
  verify(data: sys.Buf, digest: string, signature: sys.Buf): boolean;
  static make(...args: unknown[]): JPubKey;
  algorithm(): string;
  encoded(): sys.Buf | null;
}

export class JKeyStoreEntry extends sys.Obj implements crypto.KeyStoreEntry {
  static type$: sys.Type
  attrs(): sys.Map<string, string>;
  static make(attrs: sys.Map<string, string>, ...args: unknown[]): JKeyStoreEntry;
}

export class DnParser extends sys.Obj {
  static type$: sys.Type
  name(): string;
  dn(): Dn;
  static make(name: string, ...args: unknown[]): DnParser;
  parse(): sys.List<Rdn>;
}

export class PemWriter extends sys.Obj implements PemConst {
  static type$: sys.Type
  out(): sys.OutStream;
  out(it: sys.OutStream): void;
  static make(out: sys.OutStream, ...args: unknown[]): PemWriter;
  write(label: PemLabel, der: sys.Buf): this;
  close(): void;
}

export class Dn extends sys.Obj {
  static type$: sys.Type
  rdns(): sys.List<Rdn>;
  toStr(): string;
  static fromSeq(rdnSeq: asn1.AsnSeq, ...args: unknown[]): Dn;
  static decode(der: sys.Buf, ...args: unknown[]): Dn;
  static fromStr(name: string, ...args: unknown[]): Dn;
  get(index: number): Rdn;
  static make(rdns: sys.List<Rdn>, ...args: unknown[]): Dn;
  asn(): asn1.AsnSeq;
}

export class PemReader extends sys.Obj implements PemConst {
  static type$: sys.Type
  next(): sys.JsObj | null;
  static make(in$: sys.InStream, algorithm: string, ...args: unknown[]): PemReader;
}

export class JJwk extends sys.Obj implements crypto.Jwk {
  static type$: sys.Type
  meta(): sys.Map<string, sys.JsObj>;
  key(): crypto.Key;
  toStr(): string;
  static importJwksUri(jwksUri: sys.Uri, maxJwKeys?: number | null): sys.List<crypto.Jwk>;
  static make(map: sys.Map<string, sys.JsObj>, ...args: unknown[]): JJwk;
}

export class JCrypto extends sys.Obj implements crypto.Crypto {
  static type$: sys.Type
  genKeyPair(algorithm: string, bits: number): JKeyPair;
  loadCertsForUri(uri: sys.Uri): sys.List<X509>;
  loadJwksForUri(uri: sys.Uri, maxJwKeys?: number): sys.List<crypto.Jwk>;
  loadPem(in$: sys.InStream, algorithm?: string): sys.JsObj | null;
  loadJwk(map: sys.Map<string, sys.JsObj>): crypto.Jwk | null;
  loadX509(in$: sys.InStream): sys.List<X509>;
  loadKeyStore(file?: sys.File | null, opts?: sys.Map<string, sys.JsObj>): JKeyStore;
  genCsr(keys: crypto.KeyPair, subjectDn: string, opts?: sys.Map<string, sys.JsObj>): JCsr;
  certSigner(csr: crypto.Csr): crypto.CertSigner;
  digest(algorithm: string): JDigest;
  static make(...args: unknown[]): JCrypto;
}

export class PemLabel extends sys.Enum {
  static type$: sys.Type
  static csr(): PemLabel;
  /**
   * List of PemLabel values indexed by ordinal
   */
  static vals(): sys.List<PemLabel>;
  static cert(): PemLabel;
  static publicKey(): PemLabel;
  text(): string;
  static rsaPrivKey(): PemLabel;
  static privKey(): PemLabel;
  static ecPrivKey(): PemLabel;
  static find(text: string): PemLabel | null;
  /**
   * Return the PemLabel instance for the specified name.  If not
   * a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): PemLabel;
}

export abstract class PemConst extends sys.Obj {
  static type$: sys.Type
  static BEGIN(): string;
  static END(): string;
  static DASH5(): string;
  static pemChars(): number;
}

export class Rdn extends sys.Obj {
  static type$: sys.Type
  val(): string;
  static keywords(): sys.Map<string, asn1.AsnOid>;
  type(): asn1.AsnOid;
  toStr(): string;
  asnVal(): asn1.AsnObj;
  shortName(): string | null;
  static make(type: asn1.AsnOid, val: string, ...args: unknown[]): Rdn;
  asn(): asn1.AsnSet;
}

export class JCertSigner extends sys.Obj implements crypto.CertSigner {
  static type$: sys.Type
  notAfter(date: sys.Date): this;
  sign(): crypto.Cert;
  notBefore(date: sys.Date): this;
  keyUsage(bits: sys.Buf): this;
  basicConstraints(ca?: boolean, pathLenConstraint?: number | null): this;
  static make(csr: JCsr, ...args: unknown[]): JCertSigner;
  ca(caPrivKey: crypto.PrivKey, caCert: crypto.Cert): this;
  authKeyId(buf: sys.Buf): this;
  subjectKeyId(buf: sys.Buf): this;
  signWith(opts: sys.Map<string, sys.JsObj>): this;
  extendedKeyUsage(oids: sys.List<string>): this;
  asn(): asn1.AsnSeq;
  subjectAltName(name: sys.JsObj): this;
}

export abstract class Pkcs1 extends sys.Obj {
  static type$: sys.Type
  static sha256WithRSAEncryption(): asn1.AsnOid;
  static sha1WithRSAEncryption(): asn1.AsnOid;
  static pkcs_1(): asn1.AsnOid;
  static sha384WithRSAEncryption(): asn1.AsnOid;
  static rsaEncryption(): asn1.AsnOid;
  static sha512WithRSAEncryption(): asn1.AsnOid;
  static sign(key: crypto.PrivKey, data: sys.Buf, sigAlg: AlgId): sys.Buf;
}

export class DnTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): DnTest;
  testRfc4514Type(): void;
  testRfc4514Val(): void;
}

export class AlgId extends asn1.AsnSeq {
  static type$: sys.Type
  id(): asn1.AsnOid;
  algorithm(): string;
  static makeSpec(algorithm: asn1.AsnOid, parameters?: asn1.AsnObj | null, ...args: unknown[]): AlgId;
  static fromOpts(opts: sys.Map<string, sys.JsObj>, ...args: unknown[]): AlgId;
  params(): asn1.AsnObj | null;
  static make(items: sys.List<asn1.AsnObj>, ...args: unknown[]): AlgId;
}

export class JKeyStore extends sys.Obj implements crypto.KeyStore {
  static type$: sys.Type
  format(): string;
  aliases(): sys.List<string>;
  save(out: sys.OutStream, options?: sys.Map<string, sys.JsObj>): void;
  remove(alias: string): void;
  setPrivKey(alias: string, privKey: crypto.PrivKey, chain: sys.List<crypto.Cert>): this;
  static load(file: sys.File | null, opts: sys.Map<string, sys.JsObj>): JKeyStore;
  setTrust(alias: string, cert: crypto.Cert): this;
  get(alias: string, checked?: boolean): crypto.KeyStoreEntry | null;
  set(alias: string, entry: crypto.KeyStoreEntry): this;
  size(): number;
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

export class JwkTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): JwkTest;
  testJwk(): void;
}

export class JCsr extends sys.Obj implements crypto.Csr {
  static type$: sys.Type
  subject(): string;
  opts(): sys.Map<string, sys.JsObj>;
  pub(): crypto.PubKey;
  toStr(): string;
  static decode(der: sys.Buf, ...args: unknown[]): JCsr;
  gen(out: sys.OutStream, close?: boolean): void;
  pem(): string;
  static make(keys: crypto.KeyPair, subjectDn: string, opts: sys.Map<string, sys.JsObj>, ...args: unknown[]): JCsr;
  asn(): asn1.AsnSeq;
}

