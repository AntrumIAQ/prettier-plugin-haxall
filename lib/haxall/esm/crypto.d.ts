import * as sys from './sys.js';

/**
 * A PrivKeyEntry stores a private key and the certificate
 * chain for the corresponding public key.
 */
export abstract class PrivKeyEntry extends sys.Obj implements KeyStoreEntry {
  static type$: sys.Type
  /**
   * Get the end entity certificate from the certificate chain;
   * this should be the first entry in the {@link certChain | certChain}.
   */
  cert(): Cert;
  /**
   * Get the certificate chain from this entry.
   */
  certChain(): sys.List<Cert>;
  /**
   * Get the {@link KeyPair | KeyPair} for the entry. It consists
   * of the {@link priv | priv} and {@link pub | pub} keys from
   * this entry.
   */
  keyPair(): KeyPair;
  /**
   * Get the private key from this entry.
   */
  priv(): PrivKey;
  /**
   * Convenience to get the public key from the {@link cert | cert}.
   */
  pub(): PubKey;
  /**
   * Get the attributes associated with this entry. The
   * attributes are immutable.
   */
  attrs(): sys.Map<string, string>;
}

/**
 * A key in an asymmetric key pair
 */
export abstract class AsymKey extends sys.Obj implements Key {
  static type$: sys.Type
  /**
   * Get the PEM encoding of the key.
   */
  toStr(): string;
  /**
   * Gets the size, in bits, of the key modulus used by the
   * asymmetric algorithm.
   */
  keySize(): number;
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

/**
 * Models a JSON Web Key (JWK) as specified by [RFC7517](https://datatracker.ietf.org/doc/html/rfc7517)
 * 
 * JWKs wrap a Key[`Key`] object with additional metadata
 */
export abstract class Jwk extends sys.Obj {
  static type$: sys.Type
  /**
   * Jwk
   */
  meta(): sys.Map<string, sys.JsObj>;
  /**
   * Key
   */
  key(): Key;
}

/**
 * A KeyPair contains a {@link PrivKey | private key} and its
 * corresponding {@link PubKey | public key} in an asymmetric
 * key pair.
 */
export abstract class KeyPair extends sys.Obj {
  static type$: sys.Type
  /**
   * The private key for this pair.
   */
  priv(): PrivKey;
  /**
   * The public key for this pair.
   */
  pub(): PubKey;
  /**
   * Get the key pair algorithm
   */
  algorithm(): string;
}

/**
 * Models a JSON Web Token (JWT) as specified by [RFC7519](https://datatracker.ietf.org/doc/html/rfc7519)
 * 
 * A JWT includes three sections:
 * 1. Javascript Object Signing and Encryption (JOSE) Header
 * 2. Claims
 * 3. Signature
 * 
 * 11111111111.22222222222.33333333333
 * 
 * These sections are encoded as base64url strings and are
 * separated by dot (.) characters.
 * 
 * The (alg) parameter must be set to a supported JWS
 * algorithm.
 * 
 * The following JWS algorithms are supported:
 * - HS256 - HMAC using SHA-256
 * - HS384 - HMAC using SHA-384
 * - HS512 - HMAC using SHA-512
 * - RS256 - RSASSA-PKCS1-v1_5 using SHA-256
 * - RS384 - RSASSA-PKCS1-v1_5 using SHA-384
 * - RS512 - RSASSA-PKCS1-v1_5 using SHA-512
 * - ES256 - ECDSA using P-256 and SHA-256
 * - ES384 - ECDSA using P-256 and SHA-384
 * - ES512 - ECDSA using P-256 and SHA-512
 * - none  - No digital signature or MAC performed
 */
export class Jwt extends sys.Obj {
  static type$: sys.Type
  /**
   * Subject claim for this token
   */
  sub(): string | null;
  __sub(it: string | null): void;
  /**
   * Key ID header
   * 
   * When encoding this value will take precedent if the kid
   * parameter is also set in the JOSE header
   */
  kid(): string | null;
  __kid(it: string | null): void;
  /**
   * Issuer claim for this token
   */
  iss(): string | null;
  __iss(it: string | null): void;
  /**
   * Expiration claim for this token
   * 
   * When encoded, the value will be converted to `TimeZone.utc`,
   * the epoch const will be subtracted from this value and it
   * will be converted to seconds
   * 
   * When decoded, the value will be converted to `TimeZone.utc`
   */
  exp(): sys.DateTime | null;
  __exp(it: sys.DateTime | null): void;
  /**
   * Algorithm header
   */
  alg(): string;
  __alg(it: string): void;
  /**
   * Issued at claim for this token
   * 
   * When encoded, the value will be converted to `TimeZone.utc`,
   * the epoch const will be subtracted from this value and it
   * will be converted to seconds
   * 
   * When decoded, the value will be converted to `TimeZone.utc`
   */
  iat(): sys.DateTime | null;
  __iat(it: sys.DateTime | null): void;
  /**
   * JWT ID claim for this token
   */
  jti(): string | null;
  __jti(it: string | null): void;
  /**
   * Audience claim for this token (Str or Str[])
   * 
   * If value is a Str it will converted to a Str[] of size 1
   */
  aud(): sys.JsObj | null;
  __aud(it: sys.JsObj | null): void;
  /**
   * Not before claim for this token
   * 
   * When encoded, the value will be converted to `TimeZone.utc`,
   * the epoch const will be subtracted from this value and it
   * will be converted to seconds
   * 
   * When decoded, the value will be converted to `TimeZone.utc`
   */
  nbf(): sys.DateTime | null;
  __nbf(it: sys.DateTime | null): void;
  /**
   * JWT Claims
   */
  claims(): sys.Map<string, sys.JsObj>;
  __claims(it: sys.Map<string, sys.JsObj>): void;
  /**
   * JOSE Header
   */
  header(): sys.Map<string, sys.JsObj>;
  __header(it: sys.Map<string, sys.JsObj>): void;
  /**
   * Provide a {@link Key | Key} ({@link PrivKey | PrivKey} or {@link SymKey | SymKey})
   * to sign and return the base64 encoded {@link Jwt | Jwt}
   * 
   * Null key will return an unsigned base64 encoded JWT
   * 
   * The alg field must be set to a supported JWS algorithm
   * 
   * The following JWS Algorithms are supported:
   * - HS256 - HMAC using SHA-256
   * - HS384 - HMAC using SHA-384
   * - HS512 - HMAC using SHA-512
   * - RS256 - RSASSA-PKCS1-v1_5 using SHA-256
   * - RS384 - RSASSA-PKCS1-v1_5 using SHA-384
   * - RS512 - RSASSA-PKCS1-v1_5 using SHA-512
   * - ES256 - ECDSA using P-256 and SHA-256
   * - ES384 - ECDSA using P-256 and SHA-384
   * - ES512 - ECDSA using P-256 and SHA-512
   * - none  - No digital signature or MAC performed
   * ```
   * pair   := Crypto.cur.genKeyPair("RSA", 2048)
   * priv   := pair.priv
   * 
   * jwtStr := Jwt {
   *              it.alg    = "RS256"
   *              it.claims = ["myClaim": "ClaimValue"]
   *              it.exp    = DateTime.nowUtc + 10min
   *              it.iss    = "https://fantom.accounts.dev"
   *           }.encode(priv)
   * ```
   */
  encode(key: Key | null): string;
  /**
   * Decode a {@link Jwt | Jwt} from an encoded Str
   * 
   * The key parameter supports these types to verify the
   * signature:
   * - {@link Key | Key} ({@link PubKey | PubKey} or {@link SymKey | SymKey})
   * - {@link Jwk | Jwk}[] - An error is thrown if the Jwt kid
   *   header parameter
   * ```
   * is missing or no matching kid is found in the list
   * ```
   * 
   * If the exp and/or nbf claims exist, those will be verified
   * ```
   * jwk :=  [
   *           "kty": "EC",
   *           "use": "sig",
   *           "crv": "P-256",
   *           "kid": "abcd",
   *           "x": "I59TOAdnJ7uPgPOdIxj-BhWSQBXKS3lsRZJwj5eIYAo",
   *           "y": "8FJEvVIZDjVBnrBJPRUCwtgS86rHoFl1kBfbjX9rOng",
   *           "alg": "ES256",
   *         ]
   * 
   * ecJwk := Crypto.cur.loadJwk(jwk)
   * 
   * jwt   := Jwt.decode("1111.2222.3333", ecJwk.key)
   * 
   * jwks := Crypto.cur.loadJwksForUri(`https://example.com/jwks.json`)
   * 
   * jwt2  := Jwt.decodeJwks("4444.5555.6666", jwks)
   * ```
   */
  static decode(encoded: string, key: sys.JsObj, clockDrift?: sys.Duration, ...args: unknown[]): Jwt;
  /**
   * Convenience function to check the value of a claim
   * 
   * If value of JWT claim is a List, this function checks that
   * the expectedValue is contained in the List.
   * 
   * If expectedValue is null, just checks if the claim exists
   * 
   * Throws Err if claim does not exist or expectedValue does not
   * match (or is not contained in the List)
   * ```
   * jwt := Jwt.decode("1111.2222.3333", pubKey)
   *           .verifyClaim("iss", "https://fantom.accounts.dev")
   * ```
   */
  verifyClaim(claim: string, expectedValue?: sys.JsObj | null): this;
  /**
   * It-block constructor
   */
  static make(f: ((arg0: Jwt) => void), ...args: unknown[]): Jwt;
  toStr(): string;
}

/**
 * Crypto defines a pluggable mixin for cryptography
 * capabilities in Fantom. Use {@link cur | cur} to access the
 * current Crypto instance.
 */
export abstract class Crypto extends sys.Obj {
  static type$: sys.Type
  /**
   * Get the installed crypto implementation for this runtime.
   */
  static cur(): Crypto;
  /**
   * Generate an asymmetric key pair with the given algorithm and
   * key size (in bits). Throws Err if the algorithm or key size
   * is not supported.
   * ```
   * pair := Crypto.cur.genKeyPair("RSA", 2048)
   * ```
   */
  genKeyPair(algorithm: string, bits: number): KeyPair;
  /**
   * Attempt to load the full certificate chain for the given
   * uri. If the certificate chain cannot be obtained, throw an {@link sys.Err | sys::Err}.
   * 
   * This is an optional operation and implementations may throw {@link sys.UnsupportedErr | sys::UnsupportedErr}.
   * ```
   * certs := Crypto.cur.loadCertForUri(`https://my.server.com/`)
   * ```
   */
  loadCertsForUri(uri: sys.Uri): sys.List<Cert>;
  /**
   * Import JSON Web Key Set from a Uri
   * ```
   * jwks := Crypto.cur.loadJwksForUri(`https://example.com/jwks.json`)
   * ```
   */
  loadJwksForUri(uri: sys.Uri, maxKeys?: number): sys.List<Jwk>;
  /**
   * Load the next PEM-encoded object from the input stream.
   * Returns one of the following depending on the PEM encoding:
   * - {@link PrivKey | PrivKey}
   * - {@link Cert | Cert}
   * - {@link Csr | Csr}
   * 
   * For PKCS#8, the `algorithm` argument will be used for
   * decoding. This argument is ignored for PKCS#1 where the
   * alogithm is inferred.
   * 
   * Returns `null` if there are no more PEM objects to decode. The
   * input stream will be closed in this case.
   * ```
   * key  := Crypto.cur.loadPem(`server.key`) as PrivKey
   * cert := Crypto.cur.loadPem(`server.pem`) as Cert
   * ```
   */
  loadPem(in$: sys.InStream, algorithm?: string): sys.JsObj | null;
  /**
   * Load a JSON Web Key ({@link Jwk | Jwk}) from a Map.
   * 
   * Throws an error if unable to determine the JWK type.
   * ```
   * jwkRsa  := Crypto.cur.loadJwk(["kty":"RSA", "alg":"RS256", ...])
   * jwkEc   := Crypto.cur.loadJwk(["kty":"EC", "alg":"ES256", ...])
   * jwkHmac := Crypto.cur.loadJwk(["kty":"oct", "alg":"HS256", ...])
   * ```
   */
  loadJwk(map: sys.Map<string, sys.JsObj>): Jwk | null;
  /**
   * Load all X.509 certificates from the given input stream.
   * 
   * The stream will be closed after reading the certificates.
   * ```
   * cert := Crypto.cur.loadX509(`server.cert`).first
   * ```
   */
  loadX509(in$: sys.InStream): sys.List<Cert>;
  /**
   * Load a {@link KeyStore | KeyStore} from the given file. If `file`
   * is null, then a new, empty keystore in the PKCS12 format
   * will be returned. The keystore format is determined by the
   * file extension:
   * - `.p12`, `.pfx`: PKCS12 format
   * - `.jks`: Java KeyStore (JAVA only)
   * 
   * If the file does not have an extension, then PKCS12 format
   * will be assumed. Other formats may be supported depending on
   * the runtime implementation. Throws an Err if the format is
   * not supported or there is a problem loading the keystore.
   * 
   * The following options may be supported by the
   * implementation:
   * - `password`: (Str) - the password used to unlock the keystore
   *   or perform integrity checks.
   * ```
   * ks := Crypto.cur.loadKeyStore(`keystore.p12`, ["password":"changeit"])
   * ```
   */
  loadKeyStore(file?: sys.File | null, opts?: sys.Map<string, sys.JsObj>): KeyStore;
  /**
   * Generate a Certificate Signing Request (CSR). The `subjectDn`
   * must be a valid `X.500` distinguised name as defined in [RFC4514](https://tools.ietf.org/html/rfc4514).
   * 
   * By default, the implementation should choose a "strong"
   * signing algorithm for signing the CSR. All implementations
   * must support the `algorithm` option with one of the following
   * values:
   * - `sha256WithRSAEncryption`
   * - `sha512WithRSAEncryption`
   * ```
   * // Generate a csr signed with the default algorithm
   * csr := Crypto.cur.genCsr(pair, "cn=test")
   * 
   * // Generate a csr signed with SHA-512
   * csr := Crypto.cru.genCsr(pair, "cn=test", ["algorithm": "sha512WithRSAEncryption"])
   * ```
   */
  genCsr(keys: KeyPair, subjectDn: string, opts?: sys.Map<string, sys.JsObj>): Csr;
  /**
   * Obtain a {@link CertSigner | builder} that can be used to
   * configure signing options for generating a signed
   * certificate from a {@link Csr | CSR}.
   * ```
   * cert := Crypto.cur.certSigner(csr)
   *   .ca(caKeys, "cn=example,ou=example.org,o=Example Inc,c=US")
   *   .notAfter(Date.today + 365day)
   *   .sign
   * ```
   */
  certSigner(csr: Csr): CertSigner;
  /**
   * Get a {@link Digest | Digest} for the given algorithm.
   * ```
   * buf := Crypto.cur.digest("SHA-256").update("foo".toBuf).digest
   * ```
   */
  digest(algorithm: string): Digest;
}

/**
 * Key defines the api for a cryptographic key.
 */
export abstract class Key extends sys.Obj {
  static type$: sys.Type
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

/**
 * Keystore entry for a trusted certificate.
 */
export abstract class TrustEntry extends sys.Obj implements KeyStoreEntry {
  static type$: sys.Type
  /**
   * Get the trusted certificate from this entry.
   */
  cert(): Cert;
  /**
   * Get the attributes associated with this entry. The
   * attributes are immutable.
   */
  attrs(): sys.Map<string, string>;
}

/**
 * A symmetric key
 */
export abstract class SymKey extends sys.Obj implements Key {
  static type$: sys.Type
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

/**
 * Marker mixin for an entry in a {@link KeyStore | keystore}
 */
export abstract class KeyStoreEntry extends sys.Obj {
  static type$: sys.Type
  /**
   * Get the attributes associated with this entry. The
   * attributes are immutable.
   */
  attrs(): sys.Map<string, string>;
}

/**
 * Cert defines the api for an identity certificate. An
 * identity certificate binds a subject to a public key. The
 * certificate is signed by an issuer.
 */
export abstract class Cert extends sys.Obj {
  static type$: sys.Type
  /**
   * Get the PEM encoding of the certificate
   */
  toStr(): string;
  /**
   * Get the type of certificate (e.g. `X.509`)
   */
  certType(): string;
  /**
   * Get the subject DN from the certificate.
   */
  subject(): string;
  /**
   * Get the issuer DN from the certificate.
   */
  issuer(): string;
  /**
   * Return true if certificate is self signed
   */
  isSelfSigned(): boolean;
  /**
   * Return true if certificate is a Certificate Authority
   */
  isCA(): boolean;
  /**
   * Get the public key from the certificate.
   */
  pub(): PubKey;
  /**
   * Get the encoded form of the certificate.
   */
  encoded(): sys.Buf;
}

export class DigestTest extends CryptoTest {
  static type$: sys.Type
  testSha256(): void;
  static make(...args: unknown[]): DigestTest;
  testUpdates(): void;
}

/**
 * A public key in an asymmetric key pair. A public key can be
 * used to {@link verify | verify} and {@link encrypt | encrypt}
 * data.
 */
export abstract class PubKey extends sys.Obj implements AsymKey {
  static type$: sys.Type
  /**
   * Encrypt the contents of the data buffer and return the
   * result.
   * 
   * Throws an Err if the algorithm does not support encryption,
   * or if the padding is not supported for the algorithm.
   * ```
   * encrypted := pubKey.encrypt("Message".toBuf)
   * ```
   */
  encrypt(data: sys.Buf, padding?: string): sys.Buf;
  /**
   * Throws an Err if the digest algorithm is not supported.
   * ```
   * valid := pubKey.verify("Message".toBuf, "SHA512", signature)
   * ```
   */
  verify(data: sys.Buf, digest: string, signature: sys.Buf): boolean;
  /**
   * Get the PEM encoding of the key.
   */
  toStr(): string;
  /**
   * Gets the size, in bits, of the key modulus used by the
   * asymmetric algorithm.
   */
  keySize(): number;
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

/**
 * A Certificate Signing Request (CSR)
 */
export abstract class Csr extends sys.Obj {
  static type$: sys.Type
  /**
   * Get the subject dn
   */
  subject(): string;
  /**
   * Get the immutable signing options
   */
  opts(): sys.Map<string, sys.JsObj>;
  /**
   * Get the public key for the CSR
   */
  pub(): PubKey;
}

/**
 * A message digest algorithm
 */
export abstract class Digest extends sys.Obj {
  static type$: sys.Type
  /**
   * Update the digest with four byte / 32-bit integer. Return
   * this.
   */
  updateI4(i: number): this;
  /**
   * Update the digest using only the 8-bit characters in given
   * string. Return this.
   */
  updateAscii(str: string): this;
  /**
   * Update the digest with one byte / 8-bit integer. Return
   * this.
   */
  updateByte(i: number): this;
  /**
   * Update the digest using *all* the bytes in the buf (regardless
   * of current position). Return this.
   */
  update(buf: sys.Buf): this;
  /**
   * Update the digest with eight byte / 64-bit integer. Return
   * this.
   */
  updateI8(i: number): this;
  /**
   * Get the computed digest size in bytes
   */
  digestSize(): number;
  /**
   * Complete the digest computation and return the hash. The
   * digest is reset after this method is called.
   */
  digest(): sys.Buf;
  /**
   * Reset the digest. Return this.
   */
  reset(): this;
  /**
   * Get the digest algorithm name
   */
  algorithm(): string;
}

/**
 * The CertSigner allows you to configure various options for
 * signing a certificate from a {@link Csr | CSR} to generate a
 * signed {@link Cert | certifcate}.
 * 
 * See [RFC5280](https://datatracker.ietf.org/doc/html/rfc5280)
 * for more information on configuring v3 extension values.
 */
export abstract class CertSigner extends sys.Obj {
  static type$: sys.Type
  /**
   * Configure the Authority Key Identifier V3 extension
   */
  authKeyId(buf: sys.Buf): this;
  /**
   * Configure the end date for the certificate validity period.
   * The default value is 365 days from today.
   */
  notAfter(date: sys.Date): this;
  /**
   * Configure the Subject Key Identifier V3 extenstion
   */
  subjectKeyId(buf: sys.Buf): this;
  /**
   * Generate the signed certificate based on the current
   * configuration.
   */
  sign(): Cert;
  /**
   * Configure the signature algorithm to sign the certificate
   * with. This map is configured the same as a {@link Crypto.genCsr | Crypto.genCsr}.
   * By default, an implementation should choose a "strong"
   * signing algorithm.
   */
  signWith(opts: sys.Map<string, sys.JsObj>): this;
  /**
   * Configure the start date for the certificate valdity period.
   * The default value is today.
   */
  notBefore(date: sys.Date): this;
  /**
   * Configure the Key Usage V3 extension
   */
  keyUsage(bits: sys.Buf): this;
  /**
   * Configure the Basic Constraints V3 extension
   */
  basicConstraints(ca?: boolean, pathLenConstraint?: number | null): this;
  /**
   * Configure the Extended Key Usage V3 extension.
   */
  extendedKeyUsage(oids: sys.List<string>): this;
  /**
   * Configure the CA private key and public certificate. If this
   * method is not called, then a self-signed certificate will be
   * generated.
   */
  ca(caPrivKey: PrivKey, caCert: Cert): this;
  /**
   * Add a Subject Alternative Name to the certificate. This
   * method may be called multiple times to add different SANs.
   * The `name` may be one of the following types:
   * - `Str`: a DNS name
   * - `Uri`: a Uniform Resource Identifier name
   * - `IpAddr`: an IP address name
   */
  subjectAltName(name: sys.JsObj): this;
}

/**
 * A private key in an asymmetric key pair. A private key can
 * be used to {@link sign | sign} and {@link decrypt | decrypt}
 * data.
 */
export abstract class PrivKey extends sys.Obj implements AsymKey {
  static type$: sys.Type
  /**
   * Sign the contents of the data buffer after applying the
   * given digest algorithm and return the signature. Throws Err
   * if the digest algorithm is not supported.
   * ```
   * signature := privKey.sign("Message".toBuf, "SHA512")
   * ```
   */
  sign(data: sys.Buf, digest: string): sys.Buf;
  /**
   * Decrypt the contents of the data buffer and return the
   * result. Throws Err if the decryption fails for any reason.
   * ```
   * msg := privKey.decrypt(encrypted)
   * ```
   */
  decrypt(data: sys.Buf, padding?: string): sys.Buf;
  /**
   * Get the PEM encoding of the key.
   */
  toStr(): string;
  /**
   * Gets the size, in bits, of the key modulus used by the
   * asymmetric algorithm.
   */
  keySize(): number;
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

export class KeyTest extends CryptoTest {
  static type$: sys.Type
  testSigning(): void;
  testLoadSEC1EncodedEC(): void;
  static make(...args: unknown[]): KeyTest;
  testLoadEc(): void;
  testEncryption(): void;
}

/**
 * KeyStore stores keys[`Key`] and certificates[`Cert`] in an
 * aliased {@link KeyStoreEntry | keystore entry}. Aliases are
 * case-insensitive.
 * 
 * See {@link Crypto.loadKeyStore | Crypto.loadKeyStore}
 */
export abstract class KeyStore extends sys.Obj {
  static type$: sys.Type
  /**
   * Get all the aliases in the key store.
   */
  aliases(): sys.List<string>;
  /**
   * Set an alias to have the given entry. If the alias already
   * exists, it is overwritten.
   * 
   * Throws Err if the key store is not writable.
   * 
   * Throws Err if the key store doesn't support writing the
   * entry type.
   */
  set(alias: string, entry: KeyStoreEntry): this;
  /**
   * Get the format that this keystore stores entries in.
   */
  format(): string;
  /**
   * Save the entries in the keystore to the output stream.
   */
  save(out: sys.OutStream, options?: sys.Map<string, sys.JsObj>): void;
  /**
   * Return ture if the key store has an entry with the given
   * alias.
   */
  containsAlias(alias: string): boolean;
  /**
   * Remove the entry with the given alias.
   * 
   * Throws Err if the key store is not writable.
   */
  remove(alias: string): void;
  /**
   * Adds a {@link PrivKeyEntry | PrivKeyEntry} to the keystore
   * with the given alias and returns it.
   */
  setPrivKey(alias: string, priv: PrivKey, chain: sys.List<Cert>): this;
  /**
   * Get the number of {@link KeyStoreEntry | entries} in the key
   * store.
   */
  size(): number;
  /**
   * Convenience to get a {@link PrivKeyEntry | PrivKeyEntry} from
   * the keystore.
   */
  getPrivKey(alias: string, checked?: boolean): PrivKeyEntry | null;
  /**
   * Adds a {@link TrustEntry | TrustEntry} to the keystore with
   * the given alias and returns it.
   */
  setTrust(alias: string, cert: Cert): this;
  /**
   * Get the entry with the given alias.
   */
  get(alias: string, checked?: boolean): KeyStoreEntry | null;
  /**
   * Convenience to get a {@link TrustEntry | TrustEntry} from the
   * keystore.
   */
  getTrust(alias: string, checked?: boolean): TrustEntry | null;
}

