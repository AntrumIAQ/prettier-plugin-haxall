// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class KeyStore {
  constructor() {
    const this$ = this;
  }

  typeof() { return KeyStore.type$; }

  getTrust(alias,checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(this.get(alias, checked), TrustEntry.type$.toNullable());
  }

  getPrivKey(alias,checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(this.get(alias, checked), PrivKeyEntry.type$.toNullable());
  }

  containsAlias(alias) {
    return this.get(alias, false) != null;
  }

}

class KeyStoreEntry {
  constructor() {
    const this$ = this;
  }

  typeof() { return KeyStoreEntry.type$; }

}

class PrivKeyEntry {
  constructor() {
    const this$ = this;
  }

  typeof() { return PrivKeyEntry.type$; }

  cert() {
    return sys.ObjUtil.coerce(this.certChain().first(), Cert.type$);
  }

  pub() {
    return this.cert().pub();
  }

}

class TrustEntry {
  constructor() {
    const this$ = this;
  }

  typeof() { return TrustEntry.type$; }

}

class Crypto {
  constructor() {
    const this$ = this;
  }

  typeof() { return Crypto.type$; }

  static #cur = undefined;

  static cur() {
    if (Crypto.#cur === undefined) {
      Crypto.static$init();
      if (Crypto.#cur === undefined) Crypto.#cur = null;
    }
    return Crypto.#cur;
  }

  loadCertsForUri(uri) {
    throw sys.UnsupportedErr.make();
  }

  static static$init() {
    if (true) {
      try {
        Crypto.#cur = sys.ObjUtil.coerce(((this$) => { if (sys.ObjUtil.equals(sys.Env.cur().runtime(), "java")) return sys.Type.find("cryptoJava::JCrypto").make(); return NilCrypto.make(); })(this), Crypto.type$);
      }
      catch ($_u1) {
        $_u1 = sys.Err.make($_u1);
        if ($_u1 instanceof sys.Err) {
          let err = $_u1;
          ;
          err.trace();
          throw err;
        }
        else {
          throw $_u1;
        }
      }
      ;
    }
    ;
    return;
  }

}

class NilCrypto extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NilCrypto.type$; }

  static cur() { return Crypto.cur(); }

  digest(algorithm) {
    throw this.unsupported();
  }

  genCsr(keys,subjectDn,opts) {
    if (opts === undefined) opts = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj]"));
    throw this.unsupported();
  }

  certSigner(csr) {
    throw this.unsupported();
  }

  genKeyPair(algorithm,bits) {
    throw this.unsupported();
  }

  loadX509(in$) {
    throw this.unsupported();
  }

  loadCertsForUri(uri) {
    throw this.unsupported();
  }

  loadKeyStore(file,opts) {
    if (file === undefined) file = null;
    if (opts === undefined) opts = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj]"));
    throw this.unsupported();
  }

  loadPem(in$,algorithm) {
    if (algorithm === undefined) algorithm = "";
    throw this.unsupported();
  }

  loadJwk(map) {
    throw this.unsupported();
  }

  loadJwksForUri(uri,maxJwKeys) {
    if (maxJwKeys === undefined) maxJwKeys = 10;
    throw this.unsupported();
  }

  unsupported() {
    return sys.UnsupportedErr.make(sys.Str.plus("No crypto implementation for runtime: ", sys.Env.cur().runtime()));
  }

  static make() {
    const $self = new NilCrypto();
    NilCrypto.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class Jwt extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#header = sys.ObjUtil.coerce(((this$) => { let $_u2 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")); if ($_u2 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))); })(this), sys.Type.find("[sys::Str:sys::Obj]"));
    this.#claims = sys.ObjUtil.coerce(((this$) => { let $_u3 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")); if ($_u3 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))); })(this), sys.Type.find("[sys::Str:sys::Obj]"));
    this.#epoch = sys.ObjUtil.coerce(sys.DateTime.fromStr("1970-01-01T00:00:00Z UTC"), sys.DateTime.type$);
    return;
  }

  typeof() { return Jwt.type$; }

  #header = null;

  header() { return this.#header; }

  __header(it) { if (it === undefined) return this.#header; else this.#header = it; }

  #kid = null;

  kid() { return this.#kid; }

  __kid(it) { if (it === undefined) return this.#kid; else this.#kid = it; }

  #alg = null;

  alg() { return this.#alg; }

  __alg(it) { if (it === undefined) return this.#alg; else this.#alg = it; }

  #claims = null;

  claims() { return this.#claims; }

  __claims(it) { if (it === undefined) return this.#claims; else this.#claims = it; }

  #iss = null;

  iss() { return this.#iss; }

  __iss(it) { if (it === undefined) return this.#iss; else this.#iss = it; }

  #sub = null;

  sub() { return this.#sub; }

  __sub(it) { if (it === undefined) return this.#sub; else this.#sub = it; }

  #aud = null;

  aud() { return this.#aud; }

  __aud(it) { if (it === undefined) return this.#aud; else this.#aud = it; }

  #exp = null;

  exp() { return this.#exp; }

  __exp(it) { if (it === undefined) return this.#exp; else this.#exp = it; }

  #nbf = null;

  nbf() { return this.#nbf; }

  __nbf(it) { if (it === undefined) return this.#nbf; else this.#nbf = it; }

  #iat = null;

  iat() { return this.#iat; }

  __iat(it) { if (it === undefined) return this.#iat; else this.#iat = it; }

  #jti = null;

  jti() { return this.#jti; }

  __jti(it) { if (it === undefined) return this.#jti; else this.#jti = it; }

  #epoch = null;

  // private field reflection only
  __epoch(it) { if (it === undefined) return this.#epoch; else this.#epoch = it; }

  static make(f) {
    const $self = new Jwt();
    Jwt.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ;
    sys.Func.call(f, $self);
    if ($self.#kid == null) {
      $self.#kid = sys.ObjUtil.coerce($self.checkHeaderMap(JwtConst.KeyIdHeader(), sys.Str.type$), sys.Str.type$.toNullable());
    }
    ;
    let jwsAlg = JwsAlgorithm.fromAlg($self.#alg);
    $self.#alg = jwsAlg.toStr();
    $self.#header = sys.ObjUtil.coerce(((this$) => { let $_u4 = this$.normalizeHeaderMap(); if ($_u4 == null) return null; return sys.ObjUtil.toImmutable(this$.normalizeHeaderMap()); })($self), sys.Type.find("[sys::Str:sys::Obj]"));
    if ($self.#iss == null) {
      $self.#iss = sys.ObjUtil.coerce($self.checkClaimMap(JwtConst.IssuerClaim(), sys.Str.type$), sys.Str.type$.toNullable());
    }
    ;
    if ($self.#sub == null) {
      $self.#sub = sys.ObjUtil.coerce($self.checkClaimMap(JwtConst.SubjectClaim(), sys.Str.type$), sys.Str.type$.toNullable());
    }
    ;
    if ($self.#jti == null) {
      $self.#jti = sys.ObjUtil.coerce($self.checkClaimMap(JwtConst.JwtIdClaim(), sys.Str.type$), sys.Str.type$.toNullable());
    }
    ;
    if ($self.#exp == null) {
      $self.#exp = sys.ObjUtil.coerce($self.checkClaimMap(JwtConst.ExpirationClaim(), sys.DateTime.type$), sys.DateTime.type$.toNullable());
    }
    ;
    if ($self.#nbf == null) {
      $self.#nbf = sys.ObjUtil.coerce($self.checkClaimMap(JwtConst.NotBeforeClaim(), sys.DateTime.type$), sys.DateTime.type$.toNullable());
    }
    ;
    if ($self.#iat == null) {
      $self.#iat = sys.ObjUtil.coerce($self.checkClaimMap(JwtConst.IssuedAtClaim(), sys.DateTime.type$), sys.DateTime.type$.toNullable());
    }
    ;
    if ($self.#aud == null) {
      $self.#aud = ((this$) => { let $_u5 = this$.toAudienceClaim(this$.#claims.get(JwtConst.AudienceClaim())); if ($_u5 == null) return null; return sys.ObjUtil.toImmutable(this$.toAudienceClaim(this$.#claims.get(JwtConst.AudienceClaim()))); })($self);
    }
    else {
      $self.#aud = ((this$) => { let $_u6 = this$.toAudienceClaim(this$.#aud); if ($_u6 == null) return null; return sys.ObjUtil.toImmutable(this$.toAudienceClaim(this$.#aud)); })($self);
    }
    ;
    $self.#claims = sys.ObjUtil.coerce(((this$) => { let $_u7 = this$.normalizeClaimsMap(); if ($_u7 == null) return null; return sys.ObjUtil.toImmutable(this$.normalizeClaimsMap()); })($self), sys.Type.find("[sys::Str:sys::Obj]"));
    return;
  }

  normalizeHeaderMap() {
    let params = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).addAll(this.#header);
    if (this.#kid != null) {
      params.set(JwtConst.KeyIdHeader(), this.#kid);
    }
    ;
    params.set(JwtConst.AlgorithmHeader(), this.#alg);
    return sys.ObjUtil.coerce(params, sys.Type.find("[sys::Str:sys::Obj]"));
  }

  normalizeClaimsMap() {
    let claimsSet = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).addAll(this.#claims);
    if (this.#iss != null) {
      claimsSet.set(JwtConst.IssuerClaim(), this.#iss);
    }
    ;
    if (this.#sub != null) {
      claimsSet.set(JwtConst.SubjectClaim(), this.#sub);
    }
    ;
    if (this.#aud != null) {
      claimsSet.set(JwtConst.AudienceClaim(), this.toAudienceClaim(this.#aud));
    }
    ;
    if (this.#jti != null) {
      claimsSet.set(JwtConst.JwtIdClaim(), this.#jti);
    }
    ;
    if (this.#exp != null) {
      claimsSet.set(JwtConst.ExpirationClaim(), this.#exp);
    }
    ;
    if (this.#nbf != null) {
      claimsSet.set(JwtConst.NotBeforeClaim(), this.#nbf);
    }
    ;
    if (this.#iat != null) {
      claimsSet.set(JwtConst.IssuedAtClaim(), this.#iat);
    }
    ;
    return sys.ObjUtil.coerce(claimsSet, sys.Type.find("[sys::Str:sys::Obj]"));
  }

  checkHeaderMap(parameter,type) {
    if (this.#header.get(parameter) == null) {
      return null;
    }
    ;
    let val = ((this$) => { if (sys.ObjUtil.equals(sys.ObjUtil.typeof(this$.#header.get(parameter)), type)) return this$.#header.get(parameter); throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("JWT (", parameter), ") header parameter must be "), type.name())); })(this);
    return val;
  }

  checkClaimMap(claim,type) {
    if (this.#claims.get(claim) == null) {
      return null;
    }
    ;
    let val = ((this$) => { if (sys.ObjUtil.equals(sys.ObjUtil.typeof(this$.#claims.get(claim)), type)) return this$.#claims.get(claim); throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("JWT (", claim), ") claim must be "), type.name())); })(this);
    return val;
  }

  static decode(encoded,key,clockDrift) {
    if (clockDrift === undefined) clockDrift = sys.Duration.fromStr("1min");
    const this$ = this;
    if (sys.ObjUtil.is(key, sys.Type.find("sys::List"))) {
      if (!sys.ObjUtil.coerce(key, sys.Type.find("sys::List")).all((it) => {
        return sys.ObjUtil.is(it, Jwk.type$);
      })) {
        throw sys.ArgErr.make("The key parameter must contain all Jwk objects");
      }
      ;
      return Jwt.decodeFromJwks(encoded, sys.ObjUtil.coerce(key, sys.Type.find("crypto::Jwk[]")), clockDrift);
    }
    ;
    if (sys.ObjUtil.is(key, Key.type$)) {
      return Jwt.doDecode(encoded, sys.ObjUtil.coerce(key, Key.type$.toNullable()), clockDrift);
    }
    ;
    throw sys.ArgErr.make("The key parameter must be a Jwk[] or Key");
  }

  static decodeUnsigned(encoded) {
    return Jwt.doDecode(encoded, null);
  }

  static decodeFromJwks(encoded,jwks,clockDrift) {
    if (clockDrift === undefined) clockDrift = sys.Duration.fromStr("1min");
    const this$ = this;
    let jwt = Jwt.decodeUnsigned(encoded);
    let kid = jwt.#kid;
    if (kid == null) {
      throw sys.Err.make(sys.Str.plus("JWT missing (kid) header parameter: ", jwt.#header));
    }
    ;
    let matchingJwk = jwks.find((jwk) => {
      return (jwk.meta().get(JwtConst.KeyIdHeader()) != null && sys.ObjUtil.equals(sys.ObjUtil.coerce(jwk.meta().get(JwtConst.KeyIdHeader()), sys.Str.type$), kid));
    });
    if (matchingJwk == null) {
      throw sys.Err.make(sys.Str.plus("Could not find JWK with matching kid: ", kid));
    }
    ;
    if (sys.ObjUtil.compareNE(matchingJwk.meta().get(JwtConst.AlgorithmHeader()), jwt.#alg)) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("JWT (alg) header parameter ", jwt.#alg), " != JWK alg "), matchingJwk.meta().get(JwtConst.AlgorithmHeader())));
    }
    ;
    return Jwt.doDecode(encoded, matchingJwk.key(), clockDrift);
  }

  static doDecode(encoded,key,clockDrift) {
    if (clockDrift === undefined) clockDrift = sys.Duration.fromStr("1min");
    const this$ = this;
    let parts = sys.Str.split(encoded, sys.ObjUtil.coerce(46, sys.Int.type$.toNullable()));
    if (sys.ObjUtil.compareNE(parts.size(), 3)) {
      throw sys.Err.make("Invalid JWT");
    }
    ;
    let header = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj]"));
    let claims = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj]"));
    let jwsSigningInput = null;
    let signature = null;
    let digestAlgorithm = "";
    let jwsAlg = JwsAlgorithm.none();
    try {
      (header = sys.ObjUtil.coerce(Jwt.readJson(parts.get(0)), sys.Type.find("[sys::Str:sys::Obj]")));
      if (!header.containsKey(JwtConst.AlgorithmHeader())) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus("JWT missing (", JwtConst.AlgorithmHeader()), ") header parameter"));
      }
      ;
      (jwsAlg = sys.ObjUtil.coerce(JwsAlgorithm.fromParameters(header), JwsAlgorithm.type$));
      (digestAlgorithm = jwsAlg.digest());
      (claims = sys.ObjUtil.coerce(Jwt.readJson(parts.get(1)), sys.Type.find("[sys::Str:sys::Obj]")));
      (jwsSigningInput = sys.Str.toBuf(sys.Str.plus(sys.Str.plus(parts.get(0), "."), parts.get(1))));
      (signature = sys.Buf.fromBase64(parts.get(2)));
      if (sys.ObjUtil.equals(jwsAlg.keyType(), "EC")) {
        (signature = Jwt.transcodeConcatToDer(sys.ObjUtil.coerce(signature, sys.Buf.type$)));
      }
      ;
    }
    catch ($_u10) {
      $_u10 = sys.Err.make($_u10);
      if ($_u10 instanceof sys.Err) {
        let e = $_u10;
        ;
        throw sys.Err.make("Error parsing JWT parts", e);
      }
      else {
        throw $_u10;
      }
    }
    ;
    if (key != null) {
      Jwt.verifyExp(sys.ObjUtil.coerce(claims.get(JwtConst.ExpirationClaim()), sys.Int.type$.toNullable()), clockDrift);
      Jwt.verifyNbf(sys.ObjUtil.coerce(claims.get(JwtConst.NotBeforeClaim()), sys.Int.type$.toNullable()), clockDrift);
      if (sys.ObjUtil.is(key, PubKey.type$)) {
        if (sys.ObjUtil.compareNE(jwsAlg.keyType(), key.algorithm())) {
          throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("JWT (alg) header parameter \"", jwsAlg.toStr()), "\" is not compatible with Key algorithm \""), key.algorithm()), "\""));
        }
        ;
        if (!sys.ObjUtil.coerce(key, PubKey.type$).verify(sys.ObjUtil.coerce(jwsSigningInput, sys.Buf.type$), digestAlgorithm, sys.ObjUtil.coerce(signature, sys.Buf.type$))) {
          throw sys.Err.make("Invalid JWT signature");
        }
        ;
      }
      else {
        if (sys.ObjUtil.is(key, MacKey.type$)) {
          if (sys.ObjUtil.compareNE(key.algorithm(), sys.Str.plus("Hmac", jwsAlg.digest()))) {
            throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("JWS (alg) header parameter \"", jwsAlg.toStr()), "\" is not compatible with Key algorithm \""), key.algorithm()), "\""));
          }
          ;
          if (!sys.ObjUtil.coerce(key, MacKey.type$).update(sys.ObjUtil.coerce(jwsSigningInput, sys.Buf.type$)).digest().bytesEqual(sys.ObjUtil.coerce(signature, sys.Buf.type$))) {
            throw sys.Err.make("Invalid JWT MAC");
          }
          ;
        }
        else {
          throw sys.ArgErr.make("Invalid key provided. Unable to verify signature.");
        }
        ;
      }
      ;
    }
    ;
    return Jwt.make((it) => {
      it.#header = sys.ObjUtil.coerce(((this$) => { let $_u11 = header; if ($_u11 == null) return null; return sys.ObjUtil.toImmutable(header); })(this$), sys.Type.find("[sys::Str:sys::Obj]"));
      it.#kid = sys.ObjUtil.coerce(header.get(JwtConst.KeyIdHeader()), sys.Str.type$.toNullable());
      it.#alg = sys.ObjUtil.coerce(header.get(JwtConst.AlgorithmHeader()), sys.Str.type$);
      it.#claims = sys.ObjUtil.coerce(((this$) => { let $_u12 = claims; if ($_u12 == null) return null; return sys.ObjUtil.toImmutable(claims); })(this$), sys.Type.find("[sys::Str:sys::Obj]"));
      it.#iss = sys.ObjUtil.coerce(claims.get(JwtConst.IssuerClaim()), sys.Str.type$.toNullable());
      it.#sub = sys.ObjUtil.coerce(claims.get(JwtConst.SubjectClaim()), sys.Str.type$.toNullable());
      it.#aud = ((this$) => { let $_u13 = it.toAudienceClaim(claims.get(JwtConst.AudienceClaim())); if ($_u13 == null) return null; return sys.ObjUtil.toImmutable(it.toAudienceClaim(claims.get(JwtConst.AudienceClaim()))); })(this$);
      it.#exp = it.fromNumericDate(sys.ObjUtil.coerce(claims.get(JwtConst.ExpirationClaim()), sys.Int.type$.toNullable()));
      it.#nbf = it.fromNumericDate(sys.ObjUtil.coerce(claims.get(JwtConst.NotBeforeClaim()), sys.Int.type$.toNullable()));
      it.#iat = it.fromNumericDate(sys.ObjUtil.coerce(claims.get(JwtConst.IssuedAtClaim()), sys.Int.type$.toNullable()));
      it.#jti = sys.ObjUtil.coerce(claims.get(JwtConst.JwtIdClaim()), sys.Str.type$.toNullable());
      return;
    });
  }

  encode(key) {
    let claimsSet = this.formatRegisteredClaims();
    if ((key == null && sys.ObjUtil.compareNE(this.#header.get(JwtConst.AlgorithmHeader()), "none"))) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("JWT (", JwtConst.AlgorithmHeader()), ") header parameter must be \"none\" if key is null"));
    }
    ;
    let encodedHeader = sys.Str.toBuf(this.writeJsonToStr(this.#header)).toBase64Uri();
    let encodedClaims = sys.Str.toBuf(this.writeJsonToStr(claimsSet)).toBase64Uri();
    let signingContent = sys.Str.toBuf(sys.Str.plus(sys.Str.plus(sys.Str.plus("", encodedHeader), "."), encodedClaims));
    let signature = ((this$) => { if (key == null) return ""; return this$.generateSignature(signingContent, sys.ObjUtil.coerce(key, Key.type$)); })(this);
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", encodedHeader), "."), encodedClaims), "."), signature);
  }

  verifyClaim(claim,expectedValue) {
    if (expectedValue === undefined) expectedValue = null;
    if (!this.#claims.containsKey(claim)) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("JWT (", claim), ") claim is not present"));
    }
    ;
    if ((expectedValue != null && !sys.ObjUtil.is(expectedValue, sys.Type.find("sys::List")))) {
      let claimValue = this.#claims.get(claim);
      if (sys.ObjUtil.is(claimValue, sys.Type.find("sys::List"))) {
        if (!sys.ObjUtil.coerce(claimValue, sys.Type.find("sys::List")).contains(sys.ObjUtil.coerce(expectedValue, sys.Obj.type$))) {
          throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("JWT (", claim), ") claim "), claimValue), " does not contain expected value: "), expectedValue));
        }
        ;
      }
      else {
        if (sys.ObjUtil.compareNE(claimValue, expectedValue)) {
          throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("JWT (", claim), ") claim "), claimValue), " is not equal to expected value: "), expectedValue));
        }
        ;
      }
      ;
    }
    ;
    return this;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("JOSE HEADER:\n", this.prettyPrint(this.#header)), "\nJWT CLAIMS:\n"), this.prettyPrint(this.#claims));
  }

  prettyPrint(map) {
    return sys.ObjUtil.coerce(sys.Type.find("util::JsonOutStream").method("prettyPrintToStr").call(map), sys.Str.type$);
  }

  writeJsonToStr(map) {
    return sys.ObjUtil.coerce(sys.Type.find("util::JsonOutStream").method("writeJsonToStr").call(map), sys.Str.type$);
  }

  static readJson(encoded) {
    return sys.ObjUtil.trap(sys.Type.find("util::JsonInStream").make(sys.List.make(sys.InStream.type$, [sys.Buf.fromBase64(encoded).in()])),"readJson", sys.List.make(sys.Obj.type$.toNullable(), []));
  }

  static verifyExp(exp,clockDrift) {
    if (exp == null) {
      return;
    }
    ;
    if (!sys.ObjUtil.is(sys.ObjUtil.coerce(exp, sys.Obj.type$.toNullable()), sys.Int.type$)) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("JWT (", JwtConst.ExpirationClaim()), ") claim is not a valid value: "), sys.ObjUtil.coerce(exp, sys.Obj.type$.toNullable())));
    }
    ;
    let nowDrift = sys.DateTime.nowUtc().minus(clockDrift);
    if (sys.ObjUtil.compareGT(nowDrift, sys.DateTime.fromJava(sys.Int.mult(sys.ObjUtil.coerce(exp, sys.Int.type$), 1000)))) {
      throw sys.Err.make("JWT expired");
    }
    ;
    return;
  }

  static verifyNbf(nbf,clockDrift) {
    if (nbf == null) {
      return;
    }
    ;
    if (!sys.ObjUtil.is(sys.ObjUtil.coerce(nbf, sys.Obj.type$.toNullable()), sys.Int.type$)) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("JWT (", JwtConst.NotBeforeClaim()), ") claim is not a valid value: "), sys.ObjUtil.coerce(nbf, sys.Obj.type$.toNullable())));
    }
    ;
    let nowDrift = sys.DateTime.nowUtc().plus(clockDrift);
    if (sys.ObjUtil.compareLT(nowDrift, sys.DateTime.fromJava(sys.Int.mult(sys.ObjUtil.coerce(nbf, sys.Int.type$), 1000), sys.TimeZone.utc()))) {
      throw sys.Err.make("JWT not valid yet");
    }
    ;
    return;
  }

  formatRegisteredClaims() {
    let claimsSet = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).addAll(this.#claims);
    if (this.#exp != null) {
      claimsSet.set(JwtConst.ExpirationClaim(), sys.ObjUtil.coerce(this.toNumericDate(sys.ObjUtil.coerce(this.#exp, sys.DateTime.type$)), sys.Obj.type$.toNullable()));
    }
    ;
    if (this.#nbf != null) {
      claimsSet.set(JwtConst.NotBeforeClaim(), sys.ObjUtil.coerce(this.toNumericDate(sys.ObjUtil.coerce(this.#nbf, sys.DateTime.type$)), sys.Obj.type$.toNullable()));
    }
    ;
    if (this.#iat != null) {
      claimsSet.set(JwtConst.IssuedAtClaim(), sys.ObjUtil.coerce(this.toNumericDate(sys.ObjUtil.coerce(this.#iat, sys.DateTime.type$)), sys.Obj.type$.toNullable()));
    }
    ;
    return sys.ObjUtil.coerce(claimsSet, sys.Type.find("[sys::Str:sys::Obj]"));
  }

  toAudienceClaim(aud) {
    if (aud == null) {
      return null;
    }
    else {
      if (sys.ObjUtil.is(aud, sys.Str.type$)) {
        return sys.List.make(sys.Str.type$, [sys.ObjUtil.coerce(aud, sys.Str.type$)]);
      }
      else {
        if (sys.ObjUtil.is(aud, sys.Type.find("sys::List"))) {
          let unique = sys.ObjUtil.coerce(aud, sys.Type.find("sys::List")).unique();
          return sys.ObjUtil.coerce(unique.findType(sys.Str.type$), sys.Type.find("sys::Str[]?"));
        }
        else {
          throw sys.ArgErr.make("JWT (aud) claim must be a Str or Str[]");
        }
        ;
      }
      ;
    }
    ;
    return null;
  }

  fromNumericDate(val) {
    if (val != null) {
      return sys.DateTime.fromJava(sys.Int.mult(sys.ObjUtil.coerce(val, sys.Int.type$), 1000)).toUtc();
    }
    ;
    return null;
  }

  toNumericDate(dt) {
    return dt.toUtc().minusDateTime(this.#epoch).toSec();
  }

  generateSignature(signingContent,key) {
    let signature = "";
    let jwsAlg = JwsAlgorithm.fromAlg(this.#alg);
    if (sys.ObjUtil.is(key, PrivKey.type$)) {
      if (sys.ObjUtil.compareNE(jwsAlg.keyType(), key.algorithm())) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("JWT (alg) header parameter \"", jwsAlg.toStr()), "\" is not compatible with Key algorithm \""), key.algorithm()), "\""));
      }
      ;
      let sigBuf = sys.ObjUtil.coerce(key, PrivKey.type$).sign(signingContent, jwsAlg.digest());
      if (sys.ObjUtil.equals(key.algorithm(), "EC")) {
        (signature = this.transcodeDerToConcat(sigBuf, 64).toBase64Uri());
      }
      else {
        (signature = sigBuf.toBase64Uri());
      }
      ;
    }
    else {
      if (sys.ObjUtil.is(key, MacKey.type$)) {
        if (sys.ObjUtil.compareNE(key.algorithm(), sys.Str.plus("Hmac", jwsAlg.digest()))) {
          throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("JWS (alg) header parameter \"", jwsAlg.toStr()), "\" is not compatible with Key algorithm \""), key.algorithm()), "\""));
        }
        ;
        let sigBuf = sys.ObjUtil.coerce(key, MacKey.type$).update(signingContent).digest();
        (signature = sigBuf.toBase64Uri());
      }
      else {
        throw sys.ArgErr.make("Invalid JWT signing key");
      }
      ;
    }
    ;
    return signature;
  }

  static transcodeConcatToDer(sig) {
    const this$ = this;
    let rawLen = sys.Int.div(sig.size(), 2);
    let i = rawLen;
    while ((sys.ObjUtil.compareGT(i, 1) && sys.ObjUtil.equals(sig.get(sys.Int.minus(rawLen, i)), 0))) {
      i = sys.Int.decrement(i);
    }
    ;
    let j = i;
    if (sys.ObjUtil.compareLT(sig.get(sys.Int.minus(rawLen, i)), 0)) {
      ((this$) => { let $_u15 = j;j = sys.Int.increment(j); return $_u15; })(this);
    }
    ;
    let k = rawLen;
    while ((sys.ObjUtil.compareGT(k, 1) && sys.ObjUtil.equals(sig.get(sys.Int.minus(sys.Int.mult(rawLen, 2), k)), 0))) {
      k = sys.Int.decrement(k);
    }
    ;
    let l = k;
    if (sys.ObjUtil.compareLT(sig.get(sys.Int.minus(sys.Int.mult(rawLen, 2), k)), 0)) {
      ((this$) => { let $_u16 = l;l = sys.Int.increment(l); return $_u16; })(this);
    }
    ;
    let len = sys.Int.plus(sys.Int.plus(sys.Int.plus(2, j), 2), l);
    if (sys.ObjUtil.compareGT(len, 255)) {
      throw sys.ArgErr.make("Invalid JWT ECDSA signature format");
    }
    ;
    let offset = 0;
    let derLen = 0;
    let setByte = false;
    if (sys.ObjUtil.compareLT(len, 128)) {
      (derLen = sys.Int.plus(sys.Int.plus(sys.Int.plus(4, j), 2), l));
      (offset = 1);
    }
    else {
      (derLen = sys.Int.plus(sys.Int.plus(sys.Int.plus(5, j), 2), l));
      (setByte = true);
      (offset = 2);
    }
    ;
    let der = sys.ObjUtil.coerce(sys.Buf.make(derLen).fill(0, derLen), sys.Buf.type$.toNullable());
    der.seek(0);
    der.write(48);
    if (setByte) {
      der.write(129);
    }
    ;
    der.write(len);
    der.write(2);
    der.write(j);
    offset = sys.Int.plus(offset, 3);
    let idx = sys.Int.minus(rawLen, i);
    der.seek(sys.Int.minus(sys.Int.plus(offset, j), i));
    sys.Int.times(i, (it) => {
      der.write(sig.get(idx));
      idx = sys.Int.increment(idx);
      return;
    });
    offset = sys.Int.plus(offset, j);
    der.seek(offset);
    der.write(2);
    der.write(l);
    offset = sys.Int.plus(offset, 2);
    (idx = sys.Int.minus(sys.Int.mult(2, rawLen), k));
    der.seek(sys.Int.minus(sys.Int.plus(offset, l), k));
    sys.Int.times(k, (it) => {
      der.write(sig.get(idx));
      idx = sys.Int.increment(idx);
      return;
    });
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(der.seek(0), sys.Buf.type$.toNullable()), sys.Buf.type$);
  }

  transcodeDerToConcat(sig,outLen) {
    const this$ = this;
    if ((sys.ObjUtil.compareLT(sig.size(), 8) || sys.ObjUtil.compareNE(sig.get(0), 48))) {
      throw sys.ArgErr.make("Invalid JWT ECDSA signature format");
    }
    ;
    let offset = 0;
    if (sys.ObjUtil.compareGT(sig.get(1), 0)) {
      (offset = 2);
    }
    else {
      if (sys.ObjUtil.equals(sig.get(1), 129)) {
        (offset = 3);
      }
      else {
        throw sys.ArgErr.make("Invalid JWT ECDSA signature format");
      }
      ;
    }
    ;
    let rLen = sig.get(sys.Int.plus(offset, 1));
    let i = rLen;
    while ((sys.ObjUtil.compareGT(i, 0) && sys.ObjUtil.equals(sig.get(sys.Int.minus(sys.Int.plus(sys.Int.plus(offset, 2), rLen), i)), 0))) {
      i = sys.Int.decrement(i);
    }
    ;
    let sLen = sig.get(sys.Int.plus(sys.Int.plus(sys.Int.plus(offset, 2), rLen), 1));
    let j = sLen;
    while ((sys.ObjUtil.compareGT(j, 0) && sys.ObjUtil.equals(sig.get(sys.Int.minus(sys.Int.plus(sys.Int.plus(sys.Int.plus(sys.Int.plus(offset, 2), rLen), 2), sLen), j)), 0))) {
      j = sys.Int.decrement(j);
    }
    ;
    let rawLen = sys.Int.max(i, j);
    (rawLen = sys.Int.max(rawLen, sys.Int.div(outLen, 2)));
    if (sys.ObjUtil.compareNE(sys.Int.and(sig.get(sys.Int.minus(offset, 1)), 255), sys.Int.minus(sig.size(), offset))) {
      throw sys.ArgErr.make("Invalid JWT ECDSA signature format");
    }
    ;
    if (sys.ObjUtil.compareNE(sys.Int.and(sig.get(sys.Int.minus(offset, 1)), 255), sys.Int.plus(sys.Int.plus(sys.Int.plus(2, rLen), 2), sLen))) {
      throw sys.ArgErr.make("Invalid JWT ECDSA signature format");
    }
    ;
    if (sys.ObjUtil.compareNE(sig.get(offset), 2)) {
      throw sys.ArgErr.make("Invalid JWT ECDSA signature format");
    }
    ;
    if (sys.ObjUtil.compareNE(sig.get(sys.Int.plus(sys.Int.plus(offset, 2), rLen)), 2)) {
      throw sys.ArgErr.make("Invalid JWT ECDSA signature format");
    }
    ;
    let concatLen = sys.Int.mult(2, rawLen);
    let concat = sys.ObjUtil.coerce(sys.Buf.make(concatLen).fill(0, concatLen), sys.Buf.type$.toNullable());
    let idx = sys.Int.minus(sys.Int.plus(sys.Int.plus(offset, 2), rLen), i);
    concat.seek(sys.Int.minus(rawLen, i));
    sys.Int.times(i, (it) => {
      concat.write(sig.get(idx));
      idx = sys.Int.increment(idx);
      return;
    });
    (idx = sys.Int.minus(sys.Int.plus(sys.Int.plus(sys.Int.plus(sys.Int.plus(offset, 2), rLen), 2), sLen), j));
    concat.seek(sys.Int.minus(sys.Int.mult(2, rawLen), j));
    sys.Int.times(j, (it) => {
      concat.write(sig.get(idx));
      idx = sys.Int.increment(idx);
      return;
    });
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(concat.seek(0), sys.Buf.type$.toNullable()), sys.Buf.type$);
  }

}

class JwtConst {
  constructor() {
    const this$ = this;
  }

  typeof() { return JwtConst.type$; }

  static #AlgorithmHeader = undefined;

  static AlgorithmHeader() {
    if (JwtConst.#AlgorithmHeader === undefined) {
      JwtConst.static$init();
      if (JwtConst.#AlgorithmHeader === undefined) JwtConst.#AlgorithmHeader = null;
    }
    return JwtConst.#AlgorithmHeader;
  }

  static #KeyIdHeader = undefined;

  static KeyIdHeader() {
    if (JwtConst.#KeyIdHeader === undefined) {
      JwtConst.static$init();
      if (JwtConst.#KeyIdHeader === undefined) JwtConst.#KeyIdHeader = null;
    }
    return JwtConst.#KeyIdHeader;
  }

  static #ExpirationClaim = undefined;

  static ExpirationClaim() {
    if (JwtConst.#ExpirationClaim === undefined) {
      JwtConst.static$init();
      if (JwtConst.#ExpirationClaim === undefined) JwtConst.#ExpirationClaim = null;
    }
    return JwtConst.#ExpirationClaim;
  }

  static #NotBeforeClaim = undefined;

  static NotBeforeClaim() {
    if (JwtConst.#NotBeforeClaim === undefined) {
      JwtConst.static$init();
      if (JwtConst.#NotBeforeClaim === undefined) JwtConst.#NotBeforeClaim = null;
    }
    return JwtConst.#NotBeforeClaim;
  }

  static #IssuedAtClaim = undefined;

  static IssuedAtClaim() {
    if (JwtConst.#IssuedAtClaim === undefined) {
      JwtConst.static$init();
      if (JwtConst.#IssuedAtClaim === undefined) JwtConst.#IssuedAtClaim = null;
    }
    return JwtConst.#IssuedAtClaim;
  }

  static #JwtIdClaim = undefined;

  static JwtIdClaim() {
    if (JwtConst.#JwtIdClaim === undefined) {
      JwtConst.static$init();
      if (JwtConst.#JwtIdClaim === undefined) JwtConst.#JwtIdClaim = null;
    }
    return JwtConst.#JwtIdClaim;
  }

  static #SubjectClaim = undefined;

  static SubjectClaim() {
    if (JwtConst.#SubjectClaim === undefined) {
      JwtConst.static$init();
      if (JwtConst.#SubjectClaim === undefined) JwtConst.#SubjectClaim = null;
    }
    return JwtConst.#SubjectClaim;
  }

  static #IssuerClaim = undefined;

  static IssuerClaim() {
    if (JwtConst.#IssuerClaim === undefined) {
      JwtConst.static$init();
      if (JwtConst.#IssuerClaim === undefined) JwtConst.#IssuerClaim = null;
    }
    return JwtConst.#IssuerClaim;
  }

  static #AudienceClaim = undefined;

  static AudienceClaim() {
    if (JwtConst.#AudienceClaim === undefined) {
      JwtConst.static$init();
      if (JwtConst.#AudienceClaim === undefined) JwtConst.#AudienceClaim = null;
    }
    return JwtConst.#AudienceClaim;
  }

  static static$init() {
    JwtConst.#AlgorithmHeader = "alg";
    JwtConst.#KeyIdHeader = "kid";
    JwtConst.#ExpirationClaim = "exp";
    JwtConst.#NotBeforeClaim = "nbf";
    JwtConst.#IssuedAtClaim = "iat";
    JwtConst.#JwtIdClaim = "jti";
    JwtConst.#SubjectClaim = "sub";
    JwtConst.#IssuerClaim = "iss";
    JwtConst.#AudienceClaim = "aud";
    return;
  }

}

class JwsAlgorithm extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JwsAlgorithm.type$; }

  static hs256() { return JwsAlgorithm.vals().get(0); }

  static hs384() { return JwsAlgorithm.vals().get(1); }

  static hs512() { return JwsAlgorithm.vals().get(2); }

  static rs256() { return JwsAlgorithm.vals().get(3); }

  static rs384() { return JwsAlgorithm.vals().get(4); }

  static rs512() { return JwsAlgorithm.vals().get(5); }

  static es256() { return JwsAlgorithm.vals().get(6); }

  static es384() { return JwsAlgorithm.vals().get(7); }

  static es512() { return JwsAlgorithm.vals().get(8); }

  static none() { return JwsAlgorithm.vals().get(9); }

  static #vals = undefined;

  static fromAlg(name) {
    if (name == null) {
      throw sys.Err.make("JWT (alg) header parameter is required");
    }
    ;
    let jwsAlg = JwsAlgorithm.fromStr(sys.Str.lower(name), false);
    if (jwsAlg == null) {
      throw sys.Err.make(sys.Str.plus("Unknown or Unsupported JWT (alg) parameter: ", name));
    }
    ;
    return jwsAlg;
  }

  static fromParameters(params) {
    const this$ = this;
    let alg = params.get(JwtConst.AlgorithmHeader());
    if (alg == null) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Missing (", JwtConst.AlgorithmHeader()), ") Parameter: "), params));
    }
    ;
    let algorithm = JwsAlgorithm.vals().find((v) => {
      return sys.Str.equalsIgnoreCase(v.name(), sys.ObjUtil.coerce(alg, sys.Str.type$));
    });
    return ((this$) => { if (algorithm == null) throw sys.Err.make(sys.Str.plus("Unsupported or Invalid JWS (alg) Parameter: ", alg)); return algorithm; })(this);
  }

  static fromKeyAndDigest(keyType,digest) {
    const this$ = this;
    let algorithm = JwsAlgorithm.vals().find((v) => {
      if (sys.ObjUtil.compareNE(keyType, "none")) {
        return (sys.ObjUtil.equals(v.keyType(), keyType) && sys.ObjUtil.equals(v.digest(), digest));
      }
      else {
        return sys.ObjUtil.equals(v.keyType(), keyType);
      }
      ;
    });
    return ((this$) => { if (algorithm == null) throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unsupported or Invalid JWS Key/Digest: ", keyType), "/"), digest)); return algorithm; })(this);
  }

  digest() {
    let size = sys.Str.getRange(this.name(), sys.Range.make(-3, -1));
    let $_u19 = size;
    if (sys.ObjUtil.equals($_u19, "256")) {
      return "SHA256";
    }
    else if (sys.ObjUtil.equals($_u19, "384")) {
      return "SHA384";
    }
    else if (sys.ObjUtil.equals($_u19, "512")) {
      return "SHA512";
    }
    else {
      return "none";
    }
    ;
  }

  keyType() {
    let $_u20 = sys.Str.get(this.name(), 0);
    if (sys.ObjUtil.equals($_u20, 104)) {
      return "oct";
    }
    else if (sys.ObjUtil.equals($_u20, 114)) {
      return "RSA";
    }
    else if (sys.ObjUtil.equals($_u20, 101)) {
      return "EC";
    }
    else if (sys.ObjUtil.equals($_u20, 110)) {
      return "none";
    }
    else {
      return "none";
    }
    ;
  }

  toStr() {
    if (sys.ObjUtil.compareNE(this.name(), "none")) {
      return sys.Str.upper(this.name());
    }
    else {
      return this.name();
    }
    ;
  }

  static make($ordinal,$name) {
    const $self = new JwsAlgorithm();
    JwsAlgorithm.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(JwsAlgorithm.type$, JwsAlgorithm.vals(), name$, checked);
  }

  static vals() {
    if (JwsAlgorithm.#vals == null) {
      JwsAlgorithm.#vals = sys.List.make(JwsAlgorithm.type$, [
        JwsAlgorithm.make(0, "hs256", ),
        JwsAlgorithm.make(1, "hs384", ),
        JwsAlgorithm.make(2, "hs512", ),
        JwsAlgorithm.make(3, "rs256", ),
        JwsAlgorithm.make(4, "rs384", ),
        JwsAlgorithm.make(5, "rs512", ),
        JwsAlgorithm.make(6, "es256", ),
        JwsAlgorithm.make(7, "es384", ),
        JwsAlgorithm.make(8, "es512", ),
        JwsAlgorithm.make(9, "none", ),
      ]).toImmutable();
    }
    return JwsAlgorithm.#vals;
  }

  static static$init() {
    const $_u21 = JwsAlgorithm.vals();
    if (true) {
    }
    ;
    return;
  }

}

class Digest {
  constructor() {
    const this$ = this;
  }

  typeof() { return Digest.type$; }

}

class Csr {
  constructor() {
    const this$ = this;
  }

  typeof() { return Csr.type$; }

}

class Jwk {
  constructor() {
    const this$ = this;
  }

  typeof() { return Jwk.type$; }

}

class KeyPair {
  constructor() {
    const this$ = this;
  }

  typeof() { return KeyPair.type$; }

  algorithm() {
    return this.pub().algorithm();
  }

}

class Key {
  constructor() {
    const this$ = this;
  }

  typeof() { return Key.type$; }

}

class AsymKey {
  constructor() {
    const this$ = this;
  }

  typeof() { return AsymKey.type$; }

}

class PrivKey {
  constructor() {
    const this$ = this;
  }

  typeof() { return PrivKey.type$; }

}

class PubKey {
  constructor() {
    const this$ = this;
  }

  typeof() { return PubKey.type$; }

}

class SymKey {
  constructor() {
    const this$ = this;
  }

  typeof() { return SymKey.type$; }

}

class MacKey {
  constructor() {
    const this$ = this;
  }

  typeof() { return MacKey.type$; }

}

class Cert {
  constructor() {
    const this$ = this;
  }

  typeof() { return Cert.type$; }

}

class CertSigner {
  constructor() {
    const this$ = this;
  }

  typeof() { return CertSigner.type$; }

}

class CryptoTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CryptoTest.type$; }

  #selfSign = null;

  selfSign(it) {
    if (it === undefined) {
      return this.#selfSign;
    }
    else {
      this.#selfSign = it;
      return;
    }
  }

  crypto() {
    return Crypto.cur();
  }

  setup() {
    let contents = "-----BEGIN CERTIFICATE-----\nMIIC7jCCAdYCCQC4yTJEzwbB+zANBgkqhkiG9w0BAQUFADA5MQswCQYDVQQGEwJV\nUzERMA8GA1UECBMIVmlyZ2luaWExFzAVBgNVBAoTDlNreUZvdW5kcnkgTExDMB4X\nDTE2MDIxMjE2MzI1M1oXDTE3MDIxMTE2MzI1M1owOTELMAkGA1UEBhMCVVMxETAP\nBgNVBAgTCFZpcmdpbmlhMRcwFQYDVQQKEw5Ta3lGb3VuZHJ5IExMQzCCASIwDQYJ\nKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKa7GQ3BKdvyzB6y8xNqNPJRqZ+2MAdI\n1nED+9cNFFZjggUgPHV88ccnz8WAdvfT+SRhNR68aYu6z5O7E+He4Wy0puY/t9v2\nbZWHMnJWJKL/yvqc6KcH1qkXaybATZ8RHqqdtOwJkG7Xv84uITYt2Nfx531xDu/4\n8mR/C0+iRwYJdRLCPacDJjy6sG70ziAgrhg+AigWYOvSNK8TWNpaz4FAuZTLGgHu\nQQ6SjZZ+OF/kv7GvrDe2nstHviA9mWowJPAfHGu6ee3vXhVAVGvivkvnlC1kTcUa\nsABZ+IhXOzho43AIiY78TvBsNTSbuHkGgc2ItxVpWaRdvYPCaSWYVS0CAwEAATAN\nBgkqhkiG9w0BAQUFAAOCAQEAb+ud7iP51/VpfW9w8bEaEXtspLjyarKrr/6PvOjM\n3N9Moqzs1lG9XbkiO6QTVroZhbMz+nCqI9nOMOyHpLtyozG2bleV7pyddDFEtlW+\nruj4q3E3mpP7vcNnylEzMexph6ROh9xKtCAil0orOdYEpGGatmkDK7RVFIRplvqj\n+0A0ptuEFyC4aVubb8wWpsxhExFJOvY97D7U19Q5wp5bPVyhtJli1s/hrs5Sb9CT\nDUhL6fhf0j7awWbKkI404msot/1QB0PpcJwqn5ed+4GU1tml6E+ogLWbmKt3lgNN\nlM04MmrQP6Pow3AfrLFQr2oMrNwib3co9x23GoknwGG4Sw==\n-----END CERTIFICATE-----";
    let crt = sys.Str.toBuf(contents).toFile(sys.Uri.fromStr("self-signed.crt"));
    this.#selfSign = this.crypto().loadX509(crt.in()).first();
    return;
  }

  static make() {
    const $self = new CryptoTest();
    CryptoTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class JwtTest extends CryptoTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JwtTest.type$; }

  testJwtConstruction() {
    const this$ = this;
    let expiration = sys.DateTime.nowUtc().plus(sys.Duration.fromStr("15min"));
    let audience = "https://service.fantom.dev";
    let jwt = Jwt.make((it) => {
      it.__header(sys.ObjUtil.coerce(((this$) => { let $_u22 = sys.Map.__fromLiteral(["customMeta"], ["Hello"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u22 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["customMeta"], ["Hello"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__alg("HS256");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u23 = sys.Map.__fromLiteral(["testClaim","iss","sub","aud"], ["123","https://accounts.fantom.dev","user@fantom.dev",audience], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u23 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["testClaim","iss","sub","aud"], ["123","https://accounts.fantom.dev","user@fantom.dev",audience], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__exp(expiration);
      return;
    });
    this.verifyEq(jwt.iss(), "https://accounts.fantom.dev");
    this.verifyEq(jwt.sub(), "user@fantom.dev");
    this.verifyEq(jwt.exp(), expiration);
    this.verifyEq(jwt.claims().get("exp"), expiration);
    this.verifyEq(jwt.aud(), sys.List.make(sys.Str.type$, [audience]));
    this.verifyEq(jwt.claims().get("aud"), sys.List.make(sys.Str.type$, [audience]));
    this.verifyEq(jwt.header().get("alg"), "HS256");
    this.verifyEq(jwt.header().get("customMeta"), "Hello");
    (jwt = Jwt.make((it) => {
      it.__alg("HS256");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u24 = sys.Map.__fromLiteral(["testClaim","iss","sub","exp","aud"], ["123","https://accounts.fantom.dev","user@fantom.dev",sys.DateTime.nowUtc(),audience], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")); if ($_u24 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["testClaim","iss","sub","exp","aud"], ["123","https://accounts.fantom.dev","user@fantom.dev",sys.DateTime.nowUtc(),audience], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__exp(expiration);
      return;
    }));
    this.verifyEq(jwt.exp(), expiration);
    this.verifyEq(jwt.claims().get("exp"), expiration);
    this.verifyEq(jwt.aud(), sys.List.make(sys.Str.type$, [audience]));
    this.verifyEq(jwt.claims().get("aud"), sys.List.make(sys.Str.type$, [audience]));
    (jwt = Jwt.make((it) => {
      it.__alg("HS256");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u25 = sys.Map.__fromLiteral(["testClaim","iss","sub","aud"], ["123","https://accounts.fantom.dev","user@fantom.dev",sys.List.make(sys.Str.type$, [audience])], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")); if ($_u25 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["testClaim","iss","sub","aud"], ["123","https://accounts.fantom.dev","user@fantom.dev",sys.List.make(sys.Str.type$, [audience])], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      return;
    }));
    this.verifyEq(jwt.aud(), sys.List.make(sys.Str.type$, [audience]));
    this.verifyEq(jwt.claims().get("aud"), sys.List.make(sys.Str.type$, [audience]));
    this.verifyEq(jwt.header().get("alg"), "HS256");
    (jwt = Jwt.make((it) => {
      it.__alg("ES256");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u26 = sys.Map.__fromLiteral(["testClaim","iss","sub"], ["123","https://accounts.fantom.dev","user@fantom.dev"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u26 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["testClaim","iss","sub"], ["123","https://accounts.fantom.dev","user@fantom.dev"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__aud(((this$) => { let $_u27 = audience; if ($_u27 == null) return null; return sys.ObjUtil.toImmutable(audience); })(this$));
      return;
    }));
    this.verifyEq(jwt.aud(), sys.List.make(sys.Str.type$, [audience]));
    this.verifyEq(jwt.claims().get("aud"), sys.List.make(sys.Str.type$, [audience]));
    this.verifyEq(jwt.header().get("alg"), "ES256");
    (jwt = Jwt.make((it) => {
      it.__alg("RS256");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u28 = sys.Map.__fromLiteral(["testClaim","iss","sub"], ["123","https://accounts.fantom.dev","user@fantom.dev"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u28 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["testClaim","iss","sub"], ["123","https://accounts.fantom.dev","user@fantom.dev"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__aud(((this$) => { let $_u29 = sys.List.make(sys.Str.type$, [audience]); if ($_u29 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$, [audience])); })(this$));
      return;
    }));
    this.verifyEq(jwt.aud(), sys.List.make(sys.Str.type$, [audience]));
    this.verifyEq(jwt.claims().get("aud"), sys.List.make(sys.Str.type$, [audience]));
    this.verifyEq(jwt.header().get("alg"), "RS256");
    this.verifyErrMsg(sys.ArgErr.type$, "JWT (exp) claim must be DateTime", (it) => {
      let err = Jwt.make((it) => {
        it.__alg("RS256");
        it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u30 = sys.Map.__fromLiteral(["exp"], [sys.ObjUtil.coerce(1234567, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")); if ($_u30 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["exp"], [sys.ObjUtil.coerce(1234567, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
        return;
      });
      return;
    });
    this.verifyErrMsg(sys.ArgErr.type$, "JWT (kid) header parameter must be Str", (it) => {
      let err = Jwt.make((it) => {
        it.__header(sys.ObjUtil.coerce(((this$) => { let $_u31 = sys.Map.__fromLiteral(["kid"], [sys.ObjUtil.coerce(123456, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")); if ($_u31 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["kid"], [sys.ObjUtil.coerce(123456, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
        it.__alg("RS256");
        return;
      });
      return;
    });
    this.verifyErrMsg(sys.Err.type$, "JWT (alg) header parameter is required", (it) => {
      let err = Jwt.make((it) => {
        it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u32 = sys.Map.__fromLiteral(["testClaim"], ["123"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u32 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["testClaim"], ["123"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
        return;
      });
      return;
    });
    this.verifyErrMsg(sys.Err.type$, "Unknown or Unsupported JWT (alg) parameter: KS256", (it) => {
      let err = Jwt.make((it) => {
        it.__alg("KS256");
        it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u33 = sys.Map.__fromLiteral(["testClaim"], ["123"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u33 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["testClaim"], ["123"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
        return;
      });
      return;
    });
    return;
  }

  testPresignedJwt() {
    const this$ = this;
    let modulus = "AMiMxo9ex9Iwmlnrb4D3F0u3yVb7GF9iJyBGtas2KdoNcnf5UMAnF3xT8ZEwX-5oHhq2Tw-9hkuz5D5IzvqCzMl0UkvEY2-FuZGc-RReroPL8r3czVn2f3AtT1GwubDzM-zfnVwjtHXZ5zYYe2wkAleIuhLX3ESH46vYxTFwwiG__f2SzS4UJ5fsh_S1FHB8dtRtXqfpmGBRFcHvNQRS1p_UaYwFf4QYkwFRl_POJO9gxDs4tbcDYPT181F7zQn6GKuhzEShiow0f-5uhye3giPCibid5PyKxbBo3k3DTS-zeP67TdLLEGAf8ht4WbA_139I1Kyr943wXxNx95B81kc=";
    let key = sys.Map.__fromLiteral(["use","kty","kid","alg","n","e"], ["sig","RSA","2Si4UIEAMQ","RS256",modulus,"AQAB"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    let rsaJwk = this.crypto().loadJwk(key);
    let invalidJwtStr1 = "eyJraWQiOiIyU2k0VUlFQU1RIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ";
    this.verifyErrMsg(sys.Err.type$, "Invalid JWT", (it) => {
      let err = Jwt.decode(invalidJwtStr1, rsaJwk.key());
      return;
    });
    let invalidJwtStr2 = "eyJraWQiOiIyU2k0VUlFQU1RIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJ1c2VyQGZhbnRvbS5vcmciLCJuYmYiOjE3MTEwNTQ1ODcsImF6cCI6Imh0dHBzOi8vand0LmZhbnRvbS5sb2NhbDo4NDQzIiwiaXNzIjoia";
    this.verifyErrMsg(sys.Err.type$, "Invalid JWT", (it) => {
      let err = Jwt.decode(invalidJwtStr2, rsaJwk.key());
      return;
    });
    let invalidJwtStr3 = "eyJraWQiOiIyU2k0VUlFQU1RIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJ1c2VyQGZhbnRvbS5vcmciLCJuYmYiOjE3MTEwNTQ1ODcsImF6cCI6Imh0dHBzOi8vand0LmZhbnRvbS5sb2NhbDo4NDQzIiwiaXNzIjoia.dgtre4";
    this.verifyErrMsg(sys.Err.type$, "Error parsing JWT parts", (it) => {
      let err = Jwt.decode(invalidJwtStr3, rsaJwk.key());
      return;
    });
    let invalidJwtStr4 = "eyJraWQiOiIyU2k0VUlFQU1RIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJ1c2VyQGZhbnRvbS5vcmciLCJuYmYiOjE3MTEwNTQ1ODcsImF6cCI6Imh0dHBzOi8vand0LmZhbnRvbS5sb2NhbDo4NDQzIiwiaXNzIjoiaHR0cHM6Ly9mYW50b20uYWNjb3VudHMuZGV2IiwiZXhwIjoxNzExMDU4Nzg3LCJpYXQiOjE3MTEwNTUxODd9.E_QILzXzRPnVugaa81iXGMNHPEfUJPN7vPPnGNtcPu8Q2lzcEwgyE8q0gEckZH5l5_CZzDcZOYKJuUYCF43I8PmW3R-atjoN0gLhBzpX67QqfRE561IxrSCcbHJVx4LHZisffYHUydUDfU4Ohfuls4bbVbPg7dfxjtnB0EiPlMQ2DXHzBDr6oZ8n3hngaFp8wybgRIDtEbgUiv2hf784dhBDizYjadUBeNZ5eP3-CNMWFaDS080CQNqRv6KCuDoSuASSkbKC60hCWHHkfSyD8unVv5HN36qQXhW1Ur8zwGfbgKkOl8lqu34zHARnzwLYt0JEOHOvXq8zld5MtyQJaQ";
    this.verifyErrMsg(sys.Err.type$, "Invalid JWT signature", (it) => {
      let err = Jwt.decode(invalidJwtStr4, rsaJwk.key(), sys.Duration.fromStr("7300day"));
      return;
    });
    let jwtStr = "eyJraWQiOiIyU2k0VUlFQU1RIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJ1c2VyQGZhbnRvbS5vcmciLCJuYmYiOjE3MTEwNTQ1ODcsImF6cCI6Imh0dHBzOi8vand0LmZhbnRvbS5sb2NhbDo4NDQzIiwiaXNzIjoiaHR0cHM6Ly9mYW50b20uYWNjb3VudHMuZGV2IiwiZXhwIjoxNzExMDU4Nzg3LCJpYXQiOjE3MTEwNTUxODd9.E_QILzXzRPnVugaa81iXGMNHPEfUJPN7vPPnGNtcPu8Q2lzcEwgyE8q0gEckZH5l5_CZzDcZOYKJuUYCF43I8PmW3R-atjoN0gLhBzpX67QqfRE561IxrSCcbHJVx4LHZisffYHUydUDfU4Ohfuls4bbVbPg7dfxjtnB0EiPlMQ2DXHzBDr6oZ8n3hngaFp8wybgRIDtEbgUiv2hf784dhBDizYjadUBeNZ5eP3-CNMWFaDS080CQNqRv6KCuDoSuASSkbKC60hCWHHkfSyD8unVv5HN36qQXhW1Ur8zwGfbgKkOl8lqu34zHARnzwLYt0JEOHOvXq8zld5MtyJJaQ";
    let issuer = "https://fantom.accounts.dev";
    let authorized = "https://jwt.fantom.local:8443";
    let wrongIssuer = "https://not.the.issuer.com";
    this.verifyErrMsg(sys.Err.type$, sys.Str.plus(sys.Str.plus(sys.Str.plus("JWT (iss) claim ", issuer), " is not equal to expected value: "), wrongIssuer), (it) => {
      Jwt.decode(jwtStr, rsaJwk.key(), sys.Duration.fromStr("7300day")).verifyClaim("iss", wrongIssuer);
      return;
    });
    this.verifyErrMsg(sys.Err.type$, "JWT (missing) claim is not present", (it) => {
      sys.ObjUtil.coerce(Jwt.decode(jwtStr, rsaJwk.key(), sys.Duration.fromStr("7300day")).verifyClaim("iss"), Jwt.type$.toNullable()).verifyClaim("missing");
      return;
    });
    this.verifyErrMsg(sys.Err.type$, "JWT expired", (it) => {
      let err = Jwt.decode(jwtStr, rsaJwk.key());
      return;
    });
    let jwt = sys.ObjUtil.coerce(sys.ObjUtil.coerce(Jwt.decode(jwtStr, rsaJwk.key(), sys.Duration.fromStr("7300day")).verifyClaim("iss", issuer), Jwt.type$.toNullable()).verifyClaim("azp", authorized), Jwt.type$.toNullable());
    this.verifyEq(jwt.iss(), issuer);
    return;
  }

  testHmacSignedJwt() {
    const this$ = this;
    let key = sys.Map.__fromLiteral(["kty","kid","k","alg"], ["oct","abcd","badSecret","HS384"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    let octJwk = this.crypto().loadJwk(key);
    this.verifyErrMsg(sys.Err.type$, "JWS (alg) header parameter \"HS256\" is not compatible with Key algorithm \"HmacSHA384\"", (it) => {
      let err = Jwt.make((it) => {
        it.__alg("HS256");
        it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u34 = sys.Map.__fromLiteral(["sub","myClaim"], ["user2@fantom.org","hello2"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u34 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["sub","myClaim"], ["user2@fantom.org","hello2"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
        return;
      }).encode(octJwk.key());
      return;
    });
    let jwtStr = Jwt.make((it) => {
      it.__alg("HS384");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u35 = sys.Map.__fromLiteral(["myClaim"], ["hello2"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u35 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["myClaim"], ["hello2"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__sub("user2@fantom.org");
      return;
    }).encode(octJwk.key());
    this.verifyEq(jwtStr, "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ1c2VyMkBmYW50b20ub3JnIiwibXlDbGFpbSI6ImhlbGxvMiJ9.6ZoRQ1TimaFnKgGyqlFvs6H7x_Etlt2VQDShjfghK-CtnzxN8ZzlNJQZs4g5OlIA");
    let jwt = Jwt.decode(jwtStr, octJwk.key());
    this.verifyEq(jwt.claims().get("sub"), "user2@fantom.org");
    this.verifyEq(jwt.sub(), "user2@fantom.org");
    this.verifyEq(jwt.claims().get("myClaim"), "hello2");
    this.verifyErrMsg(sys.Err.type$, "JWT (exp) claim is not present", (it) => {
      jwt.verifyClaim("exp");
      return;
    });
    this.verifyErrMsg(sys.Err.type$, "JWT (nbf) claim is not present", (it) => {
      jwt.verifyClaim("nbf");
      return;
    });
    return;
  }

  testRsaSignedJwt() {
    const this$ = this;
    let pair = this.crypto().genKeyPair("RSA", 2048);
    let pub = pair.pub();
    let priv = pair.priv();
    let jwtStr = Jwt.make((it) => {
      it.__alg("RS512");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u36 = sys.Map.__fromLiteral(["myClaim"], ["hello"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u36 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["myClaim"], ["hello"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__sub("user@fantom.org");
      it.__aud(((this$) => { let $_u37 = "https://application.fantom.dev"; if ($_u37 == null) return null; return sys.ObjUtil.toImmutable("https://application.fantom.dev"); })(this$));
      it.__exp(sys.DateTime.now().plus(sys.Duration.fromStr("15min")));
      return;
    }).encode(priv);
    let jwt = Jwt.decode(jwtStr, pub);
    this.verifyEq(jwt.claims().get("sub"), "user@fantom.org");
    this.verifyEq(jwt.sub(), "user@fantom.org");
    this.verifyEq(jwt.claims().get("myClaim"), "hello");
    this.verifyEq(jwt.aud(), sys.List.make(sys.Str.type$, ["https://application.fantom.dev"]));
    this.verifyEq(jwt.claims().get("aud"), sys.List.make(sys.Str.type$, ["https://application.fantom.dev"]));
    let pair2 = this.crypto().genKeyPair("RSA", 2048);
    let pub2 = pair2.pub();
    let priv2 = pair2.priv();
    this.verifyErrMsg(sys.Err.type$, "Invalid JWT signature", (it) => {
      let err = Jwt.decode(jwtStr, pub2);
      return;
    });
    let pair3 = this.crypto().genKeyPair("EC", 256);
    let pub3 = pair3.pub();
    let priv3 = pair3.priv();
    this.verifyErrMsg(sys.Err.type$, "JWT (alg) header parameter \"RS512\" is not compatible with Key algorithm \"EC\"", (it) => {
      let err = Jwt.decode(jwtStr, pub3);
      return;
    });
    (jwtStr = Jwt.make((it) => {
      it.__alg("RS256");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u38 = sys.Map.__fromLiteral(["myClaim","exp","iss"], ["ClaimValue",sys.DateTime.nowUtc().minus(sys.Duration.fromStr("10min")),"https://fantom.accounts.dev"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")); if ($_u38 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["myClaim","exp","iss"], ["ClaimValue",sys.DateTime.nowUtc().minus(sys.Duration.fromStr("10min")),"https://fantom.accounts.dev"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      return;
    }).encode(priv2));
    this.verifyErrMsg(sys.Err.type$, "JWT expired", (it) => {
      let err = Jwt.decode(jwtStr, pub2);
      return;
    });
    return;
  }

  testEcSignedJwt() {
    const this$ = this;
    let key = sys.Map.__fromLiteral(["kty","use","crv","kid","x","y","alg"], ["EC","sig","P-256","abcd","I59TOAdnJ7uPgPOdIxj-BhWSQBXKS3lsRZJwj5eIYAo","8FJEvVIZDjVBnrBJPRUCwtgS86rHoFl1kBfbjX9rOng","ES256"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    let ecJwk = this.crypto().loadJwk(key);
    let ecPrivPem = "-----BEGIN PRIVATE KEY-----\nMEECAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJzAlAgEBBCBwYc+D4HMQ5OVHQMw9\nKsTo/26oJb6dN5QH1GbFcVysUA==\n-----END PRIVATE KEY-----";
    let ecPubPem = "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEI59TOAdnJ7uPgPOdIxj+BhWSQBXK\nS3lsRZJwj5eIYArwUkS9UhkONUGesEk9FQLC2BLzqsegWXWQF9uNf2s6eA==\n-----END PUBLIC KEY-----";
    let myPrivKey = sys.ObjUtil.as(this.crypto().loadPem(sys.Str.in(ecPrivPem), "EC"), PrivKey.type$);
    let myPubKey = sys.ObjUtil.as(this.crypto().loadPem(sys.Str.in(ecPubPem), "EC"), PubKey.type$);
    let jwtStr = Jwt.make((it) => {
      it.__alg("ES256");
      it.__sub("user3@fantom.org");
      return;
    }).encode(myPrivKey);
    let jwt = Jwt.decode(jwtStr, sys.ObjUtil.coerce(myPubKey, sys.Obj.type$));
    this.verifyEq(jwt.sub(), "user3@fantom.org");
    (jwt = Jwt.decode(jwtStr, ecJwk.key()));
    let key2 = sys.Map.__fromLiteral(["kty","use","crv","kid","x","y","alg"], ["EC","sig","P-256","wxyz","D201cdGuig-zXWUDYqoBN8k7dEpjT7wnV5Ai4FiqcdE","cMymKfwJHVj6tF_y7sPYJBEWnULIaOKIpu_x8W5lq5w","ES256"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    let ecJwk2 = this.crypto().loadJwk(key2);
    this.verifyErrMsg(sys.Err.type$, "Invalid JWT signature", (it) => {
      let err = Jwt.decode(jwtStr, ecJwk2.key());
      return;
    });
    let pair2 = this.crypto().genKeyPair("EC", 256);
    let pub2 = pair2.pub();
    let priv2 = pair2.priv();
    (jwtStr = Jwt.make((it) => {
      it.__alg("ES384");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u39 = sys.Map.__fromLiteral(["testClaim2"], ["important"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u39 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["testClaim2"], ["important"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__sub("user5@fantom.org");
      it.__aud(((this$) => { let $_u40 = sys.List.make(sys.Str.type$, ["audience1", "audience2", "audience3"]); if ($_u40 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$, ["audience1", "audience2", "audience3"])); })(this$));
      return;
    }).encode(priv2));
    (jwt = sys.ObjUtil.coerce(sys.ObjUtil.coerce(Jwt.decode(jwtStr, pub2).verifyClaim("aud", "audience1"), Jwt.type$.toNullable()).verifyClaim("aud", "audience2"), Jwt.type$.toNullable()));
    this.verifyEq(jwt.sub(), "user5@fantom.org");
    this.verifyEq(jwt.claims().get("testClaim2"), "important");
    this.verify(sys.ObjUtil.coerce(jwt.claims().get("aud"), sys.Type.find("sys::List")).containsAll(sys.List.make(sys.Str.type$, ["audience1", "audience2", "audience3"])));
    this.verifyErrMsg(sys.Err.type$, "JWT (aud) claim [audience1, audience2, audience3] does not contain expected value: audience4", (it) => {
      Jwt.decode(jwtStr, pub2).verifyClaim("aud", "audience4");
      return;
    });
    (jwtStr = Jwt.make((it) => {
      it.__alg("ES512");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u41 = sys.Map.__fromLiteral(["sub"], ["user6@fantom.org"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u41 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["sub"], ["user6@fantom.org"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__nbf(sys.DateTime.nowUtc().plus(sys.Duration.fromStr("5min")));
      return;
    }).encode(priv2));
    this.verifyErrMsg(sys.Err.type$, "JWT not valid yet", (it) => {
      let err = Jwt.decode(jwtStr, pub2);
      return;
    });
    (jwtStr = Jwt.make((it) => {
      it.__alg("ES256");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u42 = sys.Map.__fromLiteral(["sub"], ["user7@fantom.org"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u42 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["sub"], ["user7@fantom.org"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__exp(sys.DateTime.nowUtc().minus(sys.Duration.fromStr("10min")));
      return;
    }).encode(priv2));
    this.verifyErrMsg(sys.Err.type$, "JWT expired", (it) => {
      let err = Jwt.decode(jwtStr, pub2);
      return;
    });
    return;
  }

  testUnsignedJwt() {
    const this$ = this;
    let myJwtStr = Jwt.make((it) => {
      it.__alg("none");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u43 = sys.Map.__fromLiteral(["sub"], ["user8@fantom.org"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u43 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["sub"], ["user8@fantom.org"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__iat(sys.DateTime.nowUtc());
      it.__jti(sys.Uuid.make().toStr());
      it.__nbf(sys.DateTime.nowUtc().minus(sys.Duration.fromStr("5min")));
      it.__exp(sys.DateTime.nowUtc().plus(sys.Duration.fromStr("10min")));
      return;
    }).encode(null);
    let myJwt = Jwt.decodeUnsigned(myJwtStr);
    this.verifyEq(myJwt.claims().get("sub"), "user8@fantom.org");
    this.verifyNotNull(myJwt.claims().get("jti"));
    let key1 = sys.Map.__fromLiteral(["use","kty","kid","alg","n","e"], ["sig","RSA","2Si4UIEAMQ","RS256","AMiMxo9ex9Iwmlnrb4D3F0u3yVb7GF9iJyBGtas2KdoNcnf5UMAnF3xT8ZEwX-5oHhq2Tw-9hkuz5D5IzvqCzMl0UkvEY2-FuZGc-RReroPL8r3czVn2f3AtT1GwubDzM-zfnVwjtHXZ5zYYe2wkAleIuhLX3ESH46vYxTFwwiG__f2SzS4UJ5fsh_S1FHB8dtRtXqfpmGBRFcHvNQRS1p_UaYwFf4QYkwFRl_POJO9gxDs4tbcDYPT181F7zQn6GKuhzEShiow0f-5uhye3giPCibid5PyKxbBo3k3DTS-zeP67TdLLEGAf8ht4WbA_139I1Kyr943wXxNx95B81kc=","AQAB"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    let rsaJwk = this.crypto().loadJwk(key1);
    this.verifyErrMsg(sys.Err.type$, "JWT (alg) header parameter \"none\" is not compatible with Key algorithm \"RSA\"", (it) => {
      let err = Jwt.decode(myJwtStr, rsaJwk.key());
      return;
    });
    return;
  }

  testDecodeWithJwks() {
    const this$ = this;
    let key1 = sys.Map.__fromLiteral(["kty","use","crv","kid","x","y","alg"], ["EC","sig","P-256","wxyz","I59TOAdnJ7uPgPOdIxj-BhWSQBXKS3lsRZJwj5eIYAo","8FJEvVIZDjVBnrBJPRUCwtgS86rHoFl1kBfbjX9rOng","ES256"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    let key2 = sys.Map.__fromLiteral(["kty","kid","k","alg"], ["oct","efgh","badSecret","HS384"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    let ecJwk = this.crypto().loadJwk(key1);
    let octJwk = this.crypto().loadJwk(key2);
    let jwks = sys.List.make(Jwk.type$.toNullable(), [ecJwk, octJwk]);
    let ecPrivPem = "-----BEGIN PRIVATE KEY-----\nMEECAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJzAlAgEBBCBwYc+D4HMQ5OVHQMw9\nKsTo/26oJb6dN5QH1GbFcVysUA==\n-----END PRIVATE KEY-----";
    let myPrivKey = sys.ObjUtil.as(this.crypto().loadPem(sys.Str.in(ecPrivPem), "EC"), PrivKey.type$);
    let jwtStr = Jwt.make((it) => {
      it.__alg("ES256");
      it.__kid("wxyz");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u44 = sys.Map.__fromLiteral(["myClaim"], ["hello"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u44 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["myClaim"], ["hello"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__sub("user@fantom.org");
      return;
    }).encode(myPrivKey);
    let jwt = Jwt.decode(jwtStr, jwks);
    this.verifyEq(jwt.claims().get("sub"), "user@fantom.org");
    this.verifyEq(jwt.sub(), "user@fantom.org");
    this.verifyEq(jwt.claims().get("myClaim"), "hello");
    (jwtStr = Jwt.make((it) => {
      it.__alg("ES384");
      it.__kid("wxyz");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u45 = sys.Map.__fromLiteral(["myClaim"], ["hello"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u45 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["myClaim"], ["hello"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__sub("user@fantom.org");
      return;
    }).encode(myPrivKey));
    this.verifyErrMsg(sys.Err.type$, "JWT (alg) header parameter ES384 != JWK alg ES256", (it) => {
      let err = Jwt.decode(jwtStr, jwks);
      return;
    });
    (jwtStr = Jwt.make((it) => {
      it.__alg("HS384");
      it.__kid("efgh");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u46 = sys.Map.__fromLiteral(["myClaim"], ["hello"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u46 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["myClaim"], ["hello"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__sub("user@fantom.org");
      return;
    }).encode(octJwk.key()));
    let jwks2 = sys.List.make(sys.Obj.type$.toNullable());
    jwks2.add(ecJwk);
    jwks2.add(octJwk);
    (jwt = Jwt.decode(jwtStr, jwks2));
    this.verifyEq(jwt.claims().get("sub"), "user@fantom.org");
    this.verifyEq(jwt.sub(), "user@fantom.org");
    this.verifyEq(jwt.claims().get("myClaim"), "hello");
    (jwtStr = Jwt.make((it) => {
      it.__alg("HS384");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u47 = sys.Map.__fromLiteral(["myClaim"], ["hello"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u47 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["myClaim"], ["hello"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__sub("user@fantom.org");
      return;
    }).encode(octJwk.key()));
    this.verifyErrMsg(sys.Err.type$, "JWT missing (kid) header parameter: [alg:HS384]", (it) => {
      let err = Jwt.decode(jwtStr, jwks);
      return;
    });
    (jwtStr = Jwt.make((it) => {
      it.__alg("HS384");
      it.__kid("ijkl");
      it.__claims(sys.ObjUtil.coerce(((this$) => { let $_u48 = sys.Map.__fromLiteral(["myClaim"], ["hello"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u48 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["myClaim"], ["hello"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      it.__sub("user@fantom.org");
      return;
    }).encode(octJwk.key()));
    this.verifyErrMsg(sys.Err.type$, "Could not find JWK with matching kid: ijkl", (it) => {
      let err = Jwt.decode(jwtStr, jwks);
      return;
    });
    this.verifyErrMsg(sys.ArgErr.type$, "The key parameter must be a Jwk[] or Key", (it) => {
      let err = Jwt.decode(jwtStr, "badSecret");
      return;
    });
    this.verifyErrMsg(sys.ArgErr.type$, "The key parameter must be a Jwk[] or Key", (it) => {
      let err = Jwt.decode(jwtStr, sys.ObjUtil.coerce(octJwk, sys.Obj.type$));
      return;
    });
    this.verifyErrMsg(sys.ArgErr.type$, "The key parameter must contain all Jwk objects", (it) => {
      let jwks3 = sys.List.make(sys.Obj.type$.toNullable());
      jwks3.add(octJwk);
      jwks3.add("badSecret");
      let err = Jwt.decode(jwtStr, jwks3);
      return;
    });
    return;
  }

  testPsychicSignatureAttack() {
    const this$ = this;
    let psychic = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6InRydWUifQ.MAYCAQACAQA";
    let pair = this.crypto().genKeyPair("EC", 256);
    let pub = pair.pub();
    let priv = pair.priv();
    this.verifyErrMsg(sys.Err.type$, "Invalid JWT signature", (it) => {
      let err = Jwt.decode(psychic, pub);
      return;
    });
    return;
  }

  static make() {
    const $self = new JwtTest();
    JwtTest.make$($self);
    return $self;
  }

  static make$($self) {
    CryptoTest.make$($self);
    return;
  }

}

class DigestTest extends CryptoTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DigestTest.type$; }

  testSha256() {
    const this$ = this;
    let md = this.crypto().digest("SHA-256");
    this.verifyEq("SHA-256", md.algorithm());
    this.verifyEq(sys.ObjUtil.coerce(32, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(md.digestSize(), sys.Obj.type$.toNullable()));
    this.verifyDigest(md, "", "e3b0c442 98fc1c14 9afbf4c8 996fb924 27ae41e4 649b934c a495991b 7852b855");
    this.verifyDigest(md, "abc", "ba7816bf 8f01cfea 414140de 5dae2223 b00361a3 96177a9c b410ff61 f20015ad");
    this.verifyDigest(md, "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq", "248d6a61 d20638b8 e5c02693 0c3e6039 a33ce459 64ff2167 f6ecedd4 19db06c1");
    this.verifyDigest(md, "abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu", "cf5b16a7 78af8380 036ce59e 7b049237 0b249b11 e8f07a51 afac4503 7afee9d1");
    let buf = sys.StrBuf.make();
    sys.Int.times(1000000, (it) => {
      buf.addChar(97);
      return;
    });
    this.verifyDigest(md, buf.toStr(), "cdc76e5c 9914fb92 81a1c7e2 84d73e67 f1809a48 a497200e 046d39cc c7112cd0");
    return;
  }

  verifyDigest(md,msg,expect) {
    const this$ = this;
    let expectHash = sys.Buf.fromHex(sys.Str.replace(expect, " ", ""));
    let buf = sys.Str.toBuf(msg);
    this.verify(md.update(buf).digest().bytesEqual(expectHash));
    let byte = sys.Buf.make();
    sys.Int.times(buf.size(), (i) => {
      md.update(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(byte.clear(), sys.Buf.type$.toNullable()).write(buf.get(i)), sys.Buf.type$.toNullable()), sys.Buf.type$));
      return;
    });
    this.verify(md.digest().bytesEqual(expectHash));
    return;
  }

  testUpdates() {
    let a = Crypto.cur().digest("SHA-1");
    let b = sys.Buf.make();
    a.update(sys.Str.toBuf("foo"));
    b.writeBuf(sys.Str.toBuf("foo"));
    a.updateByte(70);
    b.write(70);
    a.updateByte(250);
    b.write(250);
    a.updateI4(305419896);
    b.writeI4(305419896);
    a.updateI4(2882400135);
    b.writeI4(2882400135);
    a.updateI8(188896975781596);
    b.writeI8(188896975781596);
    a.updateAscii("hello");
    b.print("hello");
    let ad = a.digest().toHex();
    let bd = b.toDigest("SHA-1").toHex();
    this.verifyEq(ad, bd);
    return;
  }

  static make() {
    const $self = new DigestTest();
    DigestTest.make$($self);
    return $self;
  }

  static make$($self) {
    CryptoTest.make$($self);
    return;
  }

}

class KeyTest extends CryptoTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return KeyTest.type$; }

  testSigning() {
    let data = sys.Str.toBuf("message");
    let bad = sys.Str.toBuf("messaGe");
    let pair = this.crypto().genKeyPair("RSA", 2048);
    this.verifyKey(pair.priv(), "RSA", "PKCS#8");
    this.verifyKey(pair.pub(), "RSA", "X.509");
    let sig = pair.priv().sign(data, "SHA512");
    this.verify(pair.pub().verify(data, "SHA512", sig));
    this.verifyFalse(pair.pub().verify(bad, "SHA512", sig));
    this.verify(sys.ObjUtil.is(pair, KeyPair.type$));
    this.verify(sys.ObjUtil.is(pair.priv(), PrivKey.type$));
    this.verify(sys.ObjUtil.is(pair.pub(), PubKey.type$));
    (pair = this.crypto().genKeyPair("EC", 256));
    this.verifyKey(pair.priv(), "EC", "PKCS#8");
    this.verifyKey(pair.pub(), "EC", "X.509");
    (sig = pair.priv().sign(data, "SHA256"));
    this.verify(pair.pub().verify(data, "SHA256", sig));
    this.verifyFalse(pair.pub().verify(bad, "SHA256", sig));
    (pair = this.crypto().genKeyPair("DSA", 1024));
    this.verifyKey(pair.priv(), "DSA", "PKCS#8");
    this.verifyKey(pair.pub(), "DSA", "X.509");
    (sig = pair.priv().sign(data, "SHA1"));
    this.verify(pair.pub().verify(data, "SHA1", sig));
    this.verifyFalse(pair.pub().verify(bad, "SHA1", sig));
    let k1 = this.crypto().genKeyPair("RSA", 1024);
    let k2 = this.crypto().genKeyPair("RSA", 1024);
    (sig = k1.priv().sign(data, "SHA512"));
    this.verify(!k2.pub().verify(data, "SHA1", sig));
    return;
  }

  testEncryption() {
    const this$ = this;
    let msg = "message";
    let pair = this.crypto().genKeyPair("RSA", 2048);
    let enc = pair.pub().encrypt(sys.Str.toBuf(msg));
    this.verifyEq(msg, pair.priv().decrypt(enc).readAllStr());
    (enc = pair.pub().encrypt(sys.Str.toBuf(msg)));
    let bad = this.crypto().genKeyPair("RSA", 2048);
    this.verifyErr(sys.Err.type$, (it) => {
      bad.priv().decrypt(enc);
      return;
    });
    this.verifyEq(msg, pair.priv().decrypt(enc).readAllStr());
    return;
  }

  testLoadEc() {
    if (sys.ObjUtil.compareLT(sys.Env.cur().javaVersion(), 16)) {
      let ecPrivLegacy = "-----BEGIN PRIVATE KEY-----\nMIGEAgEAMBAGByqGSM49AgEGBSuBBAAKBG0wawIBAQQg3BYiYrV9YyVXwQmyo2Vp\nIox+Gk3mYFV17fdewbMVKBehRANCAAT0ng721uClmiIoGYm1bBvmVxuSLTwiCt4Y\np0jY/EKA4YDUxReIbpAr2pdd3kdX6m1tpT26FrpEAYFm40PsxM4Q\n-----END PRIVATE KEY-----";
      let privLegacy = sys.ObjUtil.coerce(Crypto.cur().loadPem(sys.Str.in(ecPrivLegacy), "EC"), PrivKey.type$);
      this.verifyKey(privLegacy, "EC", "PKCS#8");
      let ecPubLegacy = "-----BEGIN PUBLIC KEY-----\nMFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE9J4O9tbgpZoiKBmJtWwb5lcbki08Igre\nGKdI2PxCgOGA1MUXiG6QK9qXXd5HV+ptbaU9uha6RAGBZuND7MTOEA==\n-----END PUBLIC KEY-----";
      let pubLegacy = sys.ObjUtil.coerce(Crypto.cur().loadPem(sys.Str.in(ecPubLegacy), "EC"), PubKey.type$);
      this.verifyKey(pubLegacy, "EC", "X.509");
      let data = sys.Str.toBuf("message");
      let sig = privLegacy.sign(data, "SHA256");
      this.verify(pubLegacy.verify(data, "SHA256", sig));
    }
    ;
    let ecPriv = "-----BEGIN PRIVATE KEY-----\nMEECAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJzAlAgEBBCBwYc+D4HMQ5OVHQMw9\nKsTo/26oJb6dN5QH1GbFcVysUA==\n-----END PRIVATE KEY-----";
    let priv = sys.ObjUtil.coerce(this.crypto().loadPem(sys.Str.in(ecPriv), "EC"), PrivKey.type$);
    this.verifyKey(priv, "EC", "PKCS#8");
    let ecPub = "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEI59TOAdnJ7uPgPOdIxj+BhWSQBXK\nS3lsRZJwj5eIYArwUkS9UhkONUGesEk9FQLC2BLzqsegWXWQF9uNf2s6eA==\n-----END PUBLIC KEY-----";
    let pub = sys.ObjUtil.coerce(Crypto.cur().loadPem(sys.Str.in(ecPub), "EC"), PubKey.type$);
    this.verifyKey(pub, "EC", "X.509");
    let data = sys.Str.toBuf("message");
    let sig = priv.sign(data, "SHA256");
    this.verify(pub.verify(data, "SHA256", sig));
    return;
  }

  testLoadSEC1EncodedEC() {
    let secp224r1Priv = "-----BEGIN EC PRIVATE KEY-----\nMGgCAQEEHNPusR74D/x3agjeySMQDuCInyqHslY9TeDyoOOgBwYFK4EEACGhPAM6\nAAQR6uUh2YHV6Aw9Mi+TTOWtdsiZsb0okM88O/oFy9R27eroXszaEDXO7c+EIZe0\nyQRBXRXgUqssdA==\n-----END EC PRIVATE KEY-----";
    let secp224r1X509 = "-----BEGIN CERTIFICATE-----\nMIIBgzCCATECCQCpD+k+mT0boDAKBggqhkjOPQQDAjBTMQswCQYDVQQGEwJVUzEL\nMAkGA1UECAwCVkExETAPBgNVBAcMCFJpY2htb25kMQ8wDQYDVQQKDAZGYW50b20x\nEzARBgNVBAMMCmZhbnRvbS5vcmcwHhcNMjQwOTE2MjAwNjQ2WhcNMjUwOTE2MjAw\nNjQ2WjBTMQswCQYDVQQGEwJVUzELMAkGA1UECAwCVkExETAPBgNVBAcMCFJpY2ht\nb25kMQ8wDQYDVQQKDAZGYW50b20xEzARBgNVBAMMCmZhbnRvbS5vcmcwTjAQBgcq\nhkjOPQIBBgUrgQQAIQM6AAQR6uUh2YHV6Aw9Mi+TTOWtdsiZsb0okM88O/oFy9R2\n7eroXszaEDXO7c+EIZe0yQRBXRXgUqssdDAKBggqhkjOPQQDAgNAADA9Ah0AwPCC\nKX+MIBcOiQAbC7Xr4P1p8YajGAygX0DhMAIcZugPSHA7lTqG4Ror8HdE9ddccqTi\nsUCXhakSPw==\n-----END CERTIFICATE-----";
    let priv = sys.ObjUtil.coerce(this.crypto().loadPem(sys.Str.in(secp224r1Priv)), PrivKey.type$);
    this.verifyKey(priv, "EC", "PKCS#8");
    let cert = sys.ObjUtil.coerce(this.crypto().loadPem(sys.Str.in(secp224r1X509)), Cert.type$);
    this.verifyEq(cert.certType(), "X.509");
    let secp521r1Priv = "-----BEGIN EC PRIVATE KEY-----\nMIHcAgEBBEIB9JXwBOs9ihM4yZCkqx/ZkahI2O68nzlpi5ndvZ/364ga2zNIJLvP\nEzd1d2T287CoeuRl0Z1/4nfJlh7sLHz9j6CgBwYFK4EEACOhgYkDgYYABAD6AS1F\nlipJNjqm/DN/ZAtkJLmBaQv4lhizdM/w4wykYmqxHQghyrNrH6t4J3+GR3ZJZvjs\nyuHzeLYJl2CF1+TjpAGfbYxX9C01KV6bhSNzaraUYMN5+vIYC1vR1oL/pkbwxjt2\nipHHYQUp1NbAAB0VX8ULLSZaTlr0wZGARrONQSVxOw==\n-----END EC PRIVATE KEY-----";
    let secp521r1X509 = "-----BEGIN CERTIFICATE-----\nMIICHjCCAX8CCQCiUoxpzin4GzAKBggqhkjOPQQDBDBTMQswCQYDVQQGEwJVUzEL\nMAkGA1UECAwCVkExETAPBgNVBAcMCFJpY2htb25kMQ8wDQYDVQQKDAZGYW50b20x\nEzARBgNVBAMMCmZhbnRvbS5vcmcwHhcNMjQwOTE2MjA1OTU5WhcNMjUwOTE2MjA1\nOTU5WjBTMQswCQYDVQQGEwJVUzELMAkGA1UECAwCVkExETAPBgNVBAcMCFJpY2ht\nb25kMQ8wDQYDVQQKDAZGYW50b20xEzARBgNVBAMMCmZhbnRvbS5vcmcwgZswEAYH\nKoZIzj0CAQYFK4EEACMDgYYABAD6AS1FlipJNjqm/DN/ZAtkJLmBaQv4lhizdM/w\n4wykYmqxHQghyrNrH6t4J3+GR3ZJZvjsyuHzeLYJl2CF1+TjpAGfbYxX9C01KV6b\nhSNzaraUYMN5+vIYC1vR1oL/pkbwxjt2ipHHYQUp1NbAAB0VX8ULLSZaTlr0wZGA\nRrONQSVxOzAKBggqhkjOPQQDBAOBjAAwgYgCQgEPCrMYbywWCloBY0l4wbjaWx1V\nMK9OIrkxMupmB1WmXTIpoJxBD/WZ1zhXnMDdDSE9WLPik2wFMbPMYKWl6jE22gJC\nAcGzJbG9NBqExMxstzHXescXqsczDL9u/1y2NbvSDp8r9GfbrGNZE/uVm0UimNHs\nZ7MuTgBnRoYEE9gooRSoQx67\n-----END CERTIFICATE-----";
    (priv = sys.ObjUtil.coerce(this.crypto().loadPem(sys.Str.in(secp521r1Priv)), PrivKey.type$));
    this.verifyKey(priv, "EC", "PKCS#8");
    (cert = sys.ObjUtil.coerce(this.crypto().loadPem(sys.Str.in(secp521r1X509)), Cert.type$));
    this.verifyEq(cert.certType(), "X.509");
    let sect233k1Priv = "-----BEGIN EC PRIVATE KEY-----\nMG0CAQEEHSzD7tGQFy7PXZnHRab2n0IiU5LFYYE95jc0PdMLoAcGBSuBBAAaoUAD\nPgAEAA4eD1AQxAx8Zu3ikInx1MAmPsTY2Vi7PnZwWU5hAMibYxvdrnIoYef8t5d4\nXLyECvWtAX5smaTxUYbj\n-----END EC PRIVATE KEY-----";
    (priv = sys.ObjUtil.coerce(this.crypto().loadPem(sys.Str.in(sect233k1Priv)), PrivKey.type$));
    this.verifyKey(priv, "EC", "PKCS#8");
    let sect571r1Priv = "-----BEGIN EC PRIVATE KEY-----\nMIHuAgEBBEgBIjbdTxdfNIU0vhtLWFFkJxsPDsXDE1jM563JFvG8093FrhsgYp8u\n0L6KCIZKsXVWNZEMbyoiyiBPiTCa34s3mZFT7U+86i6gBwYFK4EEACehgZUDgZIA\nBAFL12AP9+JvGGm4hC6BaIucrQ4tU5B1nTwTHMRuaSUllLD6itX9ozFJzdNvV+C+\nufNSFSMy7Kb6WiF9SVhPrgzPu6LtTsBVUgZcjhM8B5py7M5RTxyf/z1PFYUIoSzJ\n7ygLorTbyZf8hbxSHpcOmwGQDh7TpaaFb4aidHVMcszfDw1LvsGjXUrvh9/4c0Bv\nlQ==\n-----END EC PRIVATE KEY-----";
    (priv = sys.ObjUtil.coerce(this.crypto().loadPem(sys.Str.in(sect571r1Priv)), PrivKey.type$));
    this.verifyKey(priv, "EC", "PKCS#8");
    return;
  }

  verifyKey(key,alg,format) {
    this.verifyEq(key.algorithm(), alg);
    this.verifyEq(key.format(), format);
    return;
  }

  static make() {
    const $self = new KeyTest();
    KeyTest.make$($self);
    return $self;
  }

  static make$($self) {
    CryptoTest.make$($self);
    return;
  }

}

const p = sys.Pod.add$('crypto');
const xp = sys.Param.noParams$();
let m;
KeyStore.type$ = p.am$('KeyStore','sys::Obj',[],{},8451,KeyStore);
KeyStoreEntry.type$ = p.am$('KeyStoreEntry','sys::Obj',[],{},8451,KeyStoreEntry);
PrivKeyEntry.type$ = p.am$('PrivKeyEntry','sys::Obj',['crypto::KeyStoreEntry'],{},8451,PrivKeyEntry);
TrustEntry.type$ = p.am$('TrustEntry','sys::Obj',['crypto::KeyStoreEntry'],{},8451,TrustEntry);
Crypto.type$ = p.am$('Crypto','sys::Obj',[],{},8451,Crypto);
NilCrypto.type$ = p.at$('NilCrypto','sys::Obj',['crypto::Crypto'],{},130,NilCrypto);
Jwt.type$ = p.at$('Jwt','sys::Obj',[],{},8194,Jwt);
JwtConst.type$ = p.am$('JwtConst','sys::Obj',[],{},385,JwtConst);
JwsAlgorithm.type$ = p.at$('JwsAlgorithm','sys::Enum',[],{'sys::NoDoc':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,JwsAlgorithm);
Digest.type$ = p.am$('Digest','sys::Obj',[],{},8451,Digest);
Csr.type$ = p.am$('Csr','sys::Obj',[],{},8451,Csr);
Jwk.type$ = p.am$('Jwk','sys::Obj',[],{},8451,Jwk);
KeyPair.type$ = p.am$('KeyPair','sys::Obj',[],{},8451,KeyPair);
Key.type$ = p.am$('Key','sys::Obj',[],{},8451,Key);
AsymKey.type$ = p.am$('AsymKey','sys::Obj',['crypto::Key'],{},8451,AsymKey);
PrivKey.type$ = p.am$('PrivKey','sys::Obj',['crypto::AsymKey'],{},8451,PrivKey);
PubKey.type$ = p.am$('PubKey','sys::Obj',['crypto::AsymKey'],{},8451,PubKey);
SymKey.type$ = p.am$('SymKey','sys::Obj',['crypto::Key'],{},8451,SymKey);
MacKey.type$ = p.am$('MacKey','sys::Obj',['crypto::SymKey'],{'sys::NoDoc':""},8451,MacKey);
Cert.type$ = p.am$('Cert','sys::Obj',[],{},8451,Cert);
CertSigner.type$ = p.am$('CertSigner','sys::Obj',[],{},8449,CertSigner);
CryptoTest.type$ = p.at$('CryptoTest','sys::Test',[],{'sys::NoDoc':""},8193,CryptoTest);
JwtTest.type$ = p.at$('JwtTest','crypto::CryptoTest',[],{'sys::NoDoc':""},8192,JwtTest);
DigestTest.type$ = p.at$('DigestTest','crypto::CryptoTest',[],{},8192,DigestTest);
KeyTest.type$ = p.at$('KeyTest','crypto::CryptoTest',[],{},8192,KeyTest);
KeyStore.type$.am$('format',270337,'sys::Str',xp,{}).am$('aliases',270337,'sys::Str[]',xp,{}).am$('size',270337,'sys::Int',xp,{}).am$('save',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('options','[sys::Str:sys::Obj]',true)]),{}).am$('get',270337,'crypto::KeyStoreEntry?',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('getTrust',270336,'crypto::TrustEntry?',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('getPrivKey',270336,'crypto::PrivKeyEntry?',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('containsAlias',270336,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false)]),{}).am$('setPrivKey',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('priv','crypto::PrivKey',false),new sys.Param('chain','crypto::Cert[]',false)]),{}).am$('setTrust',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('cert','crypto::Cert',false)]),{}).am$('set',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('entry','crypto::KeyStoreEntry',false)]),{}).am$('remove',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false)]),{});
KeyStoreEntry.type$.am$('attrs',270337,'[sys::Str:sys::Str]',xp,{});
PrivKeyEntry.type$.am$('priv',270337,'crypto::PrivKey',xp,{}).am$('certChain',270337,'crypto::Cert[]',xp,{}).am$('cert',270336,'crypto::Cert',xp,{}).am$('pub',270336,'crypto::PubKey',xp,{}).am$('keyPair',270337,'crypto::KeyPair',xp,{});
TrustEntry.type$.am$('cert',270337,'crypto::Cert',xp,{});
Crypto.type$.af$('cur',106498,'crypto::Crypto',{}).am$('digest',270337,'crypto::Digest',sys.List.make(sys.Param.type$,[new sys.Param('algorithm','sys::Str',false)]),{}).am$('genCsr',270337,'crypto::Csr',sys.List.make(sys.Param.type$,[new sys.Param('keys','crypto::KeyPair',false),new sys.Param('subjectDn','sys::Str',false),new sys.Param('opts','[sys::Str:sys::Obj]',true)]),{}).am$('certSigner',270337,'crypto::CertSigner',sys.List.make(sys.Param.type$,[new sys.Param('csr','crypto::Csr',false)]),{}).am$('genKeyPair',270337,'crypto::KeyPair',sys.List.make(sys.Param.type$,[new sys.Param('algorithm','sys::Str',false),new sys.Param('bits','sys::Int',false)]),{}).am$('loadX509',270337,'crypto::Cert[]',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('loadCertsForUri',270336,'crypto::Cert[]',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('loadKeyStore',270337,'crypto::KeyStore',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File?',true),new sys.Param('opts','[sys::Str:sys::Obj]',true)]),{}).am$('loadPem',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('algorithm','sys::Str',true)]),{}).am$('loadJwk',270337,'crypto::Jwk?',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:sys::Obj]',false)]),{}).am$('loadJwksForUri',270337,'crypto::Jwk[]',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('maxKeys','sys::Int',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
NilCrypto.type$.am$('digest',271360,'crypto::Digest',sys.List.make(sys.Param.type$,[new sys.Param('algorithm','sys::Str',false)]),{}).am$('genCsr',271360,'crypto::Csr',sys.List.make(sys.Param.type$,[new sys.Param('keys','crypto::KeyPair',false),new sys.Param('subjectDn','sys::Str',false),new sys.Param('opts','[sys::Str:sys::Obj]',true)]),{}).am$('certSigner',271360,'crypto::CertSigner',sys.List.make(sys.Param.type$,[new sys.Param('csr','crypto::Csr',false)]),{}).am$('genKeyPair',271360,'crypto::KeyPair',sys.List.make(sys.Param.type$,[new sys.Param('algorithm','sys::Str',false),new sys.Param('bits','sys::Int',false)]),{}).am$('loadX509',271360,'crypto::Cert[]',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('loadCertsForUri',271360,'crypto::Cert[]',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('loadKeyStore',271360,'crypto::KeyStore',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File?',true),new sys.Param('opts','[sys::Str:sys::Obj]',true)]),{}).am$('loadPem',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('algorithm','sys::Str',true)]),{}).am$('loadJwk',271360,'crypto::Jwk?',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:sys::Obj]',false)]),{}).am$('loadJwksForUri',271360,'crypto::Jwk[]',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('maxJwKeys','sys::Int',true)]),{}).am$('unsupported',2048,'sys::Err',xp,{}).am$('make',139268,'sys::Void',xp,{});
Jwt.type$.af$('header',73730,'[sys::Str:sys::Obj]',{}).af$('kid',73730,'sys::Str?',{}).af$('alg',73730,'sys::Str',{}).af$('claims',73730,'[sys::Str:sys::Obj]',{}).af$('iss',73730,'sys::Str?',{}).af$('sub',73730,'sys::Str?',{}).af$('aud',73730,'sys::Obj?',{}).af$('exp',73730,'sys::DateTime?',{}).af$('nbf',73730,'sys::DateTime?',{}).af$('iat',73730,'sys::DateTime?',{}).af$('jti',73730,'sys::Str?',{}).af$('epoch',67586,'sys::DateTime',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('normalizeHeaderMap',2048,'[sys::Str:sys::Obj]',xp,{}).am$('normalizeClaimsMap',2048,'[sys::Str:sys::Obj]',xp,{}).am$('checkHeaderMap',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('parameter','sys::Str',false),new sys.Param('type','sys::Type',false)]),{}).am$('checkClaimMap',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('claim','sys::Str',false),new sys.Param('type','sys::Type',false)]),{}).am$('decode',40966,'crypto::Jwt?',sys.List.make(sys.Param.type$,[new sys.Param('encoded','sys::Str',false),new sys.Param('key','sys::Obj',false),new sys.Param('clockDrift','sys::Duration',true)]),{}).am$('decodeUnsigned',40966,'crypto::Jwt?',sys.List.make(sys.Param.type$,[new sys.Param('encoded','sys::Str',false)]),{'sys::NoDoc':""}).am$('decodeFromJwks',34822,'crypto::Jwt?',sys.List.make(sys.Param.type$,[new sys.Param('encoded','sys::Str',false),new sys.Param('jwks','crypto::Jwk[]',false),new sys.Param('clockDrift','sys::Duration',true)]),{}).am$('doDecode',34822,'crypto::Jwt?',sys.List.make(sys.Param.type$,[new sys.Param('encoded','sys::Str',false),new sys.Param('key','crypto::Key?',false),new sys.Param('clockDrift','sys::Duration',true)]),{}).am$('encode',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('key','crypto::Key?',false)]),{}).am$('verifyClaim',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('claim','sys::Str',false),new sys.Param('expectedValue','sys::Obj?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('prettyPrint',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:sys::Obj]',false)]),{}).am$('writeJsonToStr',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:sys::Obj]',false)]),{}).am$('readJson',34818,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('encoded','sys::Str',false)]),{}).am$('verifyExp',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('exp','sys::Int?',false),new sys.Param('clockDrift','sys::Duration',false)]),{}).am$('verifyNbf',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('nbf','sys::Int?',false),new sys.Param('clockDrift','sys::Duration',false)]),{}).am$('formatRegisteredClaims',2048,'[sys::Str:sys::Obj]',xp,{}).am$('toAudienceClaim',2048,'sys::Str[]?',sys.List.make(sys.Param.type$,[new sys.Param('aud','sys::Obj?',false)]),{}).am$('fromNumericDate',2048,'sys::DateTime?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Int?',false)]),{}).am$('toNumericDate',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('dt','sys::DateTime',false)]),{}).am$('generateSignature',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('signingContent','sys::Buf',false),new sys.Param('key','crypto::Key',false)]),{}).am$('transcodeConcatToDer',34818,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('sig','sys::Buf',false)]),{}).am$('transcodeDerToConcat',2048,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('sig','sys::Buf',false),new sys.Param('outLen','sys::Int',false)]),{});
JwtConst.type$.af$('AlgorithmHeader',106498,'sys::Str',{}).af$('KeyIdHeader',106498,'sys::Str',{}).af$('ExpirationClaim',106498,'sys::Str',{}).af$('NotBeforeClaim',106498,'sys::Str',{}).af$('IssuedAtClaim',106498,'sys::Str',{}).af$('JwtIdClaim',106498,'sys::Str',{}).af$('SubjectClaim',106498,'sys::Str',{}).af$('IssuerClaim',106498,'sys::Str',{}).af$('AudienceClaim',106498,'sys::Str',{}).am$('static$init',165890,'sys::Void',xp,{});
JwsAlgorithm.type$.af$('hs256',106506,'crypto::JwsAlgorithm',{}).af$('hs384',106506,'crypto::JwsAlgorithm',{}).af$('hs512',106506,'crypto::JwsAlgorithm',{}).af$('rs256',106506,'crypto::JwsAlgorithm',{}).af$('rs384',106506,'crypto::JwsAlgorithm',{}).af$('rs512',106506,'crypto::JwsAlgorithm',{}).af$('es256',106506,'crypto::JwsAlgorithm',{}).af$('es384',106506,'crypto::JwsAlgorithm',{}).af$('es512',106506,'crypto::JwsAlgorithm',{}).af$('none',106506,'crypto::JwsAlgorithm',{}).af$('vals',106498,'crypto::JwsAlgorithm[]',{}).am$('fromAlg',40966,'crypto::JwsAlgorithm?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str?',false)]),{}).am$('fromParameters',40966,'crypto::JwsAlgorithm?',sys.List.make(sys.Param.type$,[new sys.Param('params','[sys::Str:sys::Obj]',false)]),{}).am$('fromKeyAndDigest',40966,'crypto::JwsAlgorithm?',sys.List.make(sys.Param.type$,[new sys.Param('keyType','sys::Str',false),new sys.Param('digest','sys::Str',false)]),{}).am$('digest',8192,'sys::Str',xp,{}).am$('keyType',8192,'sys::Str',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'crypto::JwsAlgorithm?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Digest.type$.am$('algorithm',270337,'sys::Str',xp,{}).am$('digestSize',270337,'sys::Int',xp,{}).am$('digest',270337,'sys::Buf',xp,{}).am$('update',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('updateAscii',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('updateByte',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('updateI4',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('updateI8',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('reset',270337,'sys::This',xp,{});
Csr.type$.am$('pub',270337,'crypto::PubKey',xp,{}).am$('subject',270337,'sys::Str',xp,{}).am$('opts',270337,'[sys::Str:sys::Obj]',xp,{});
Jwk.type$.am$('meta',270337,'[sys::Str:sys::Obj]',xp,{}).am$('key',270337,'crypto::Key',xp,{});
KeyPair.type$.am$('algorithm',270336,'sys::Str',xp,{}).am$('priv',270337,'crypto::PrivKey',xp,{}).am$('pub',270337,'crypto::PubKey',xp,{});
Key.type$.am$('algorithm',270337,'sys::Str',xp,{}).am$('format',270337,'sys::Str?',xp,{}).am$('encoded',270337,'sys::Buf?',xp,{});
AsymKey.type$.am$('keySize',270337,'sys::Int',xp,{}).am$('toStr',271361,'sys::Str',xp,{});
PrivKey.type$.am$('sign',270337,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Buf',false),new sys.Param('digest','sys::Str',false)]),{}).am$('decrypt',270337,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Buf',false),new sys.Param('padding','sys::Str',true)]),{});
PubKey.type$.am$('verify',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Buf',false),new sys.Param('digest','sys::Str',false),new sys.Param('signature','sys::Buf',false)]),{}).am$('encrypt',270337,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Buf',false),new sys.Param('padding','sys::Str',true)]),{});
MacKey.type$.am$('macSize',270337,'sys::Int',xp,{}).am$('digest',270337,'sys::Buf',xp,{}).am$('update',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('updateAscii',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('updateByte',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('updateI4',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('updateI8',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('reset',270337,'sys::This',xp,{});
Cert.type$.am$('subject',270337,'sys::Str',xp,{}).am$('issuer',270337,'sys::Str',xp,{}).am$('certType',270337,'sys::Str',xp,{}).am$('encoded',270337,'sys::Buf',xp,{}).am$('pub',270337,'crypto::PubKey',xp,{}).am$('toStr',271361,'sys::Str',xp,{}).am$('isSelfSigned',270337,'sys::Bool',xp,{}).am$('isCA',270337,'sys::Bool',xp,{});
CertSigner.type$.am$('ca',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('caPrivKey','crypto::PrivKey',false),new sys.Param('caCert','crypto::Cert',false)]),{}).am$('notBefore',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('date','sys::Date',false)]),{}).am$('notAfter',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('date','sys::Date',false)]),{}).am$('signWith',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('opts','[sys::Str:sys::Obj]',false)]),{}).am$('sign',270337,'crypto::Cert',xp,{}).am$('subjectKeyId',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('authKeyId',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('basicConstraints',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('ca','sys::Bool',true),new sys.Param('pathLenConstraint','sys::Int?',true)]),{}).am$('keyUsage',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('bits','sys::Buf',false)]),{}).am$('extendedKeyUsage',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('oids','sys::Str[]',false)]),{}).am$('subjectAltName',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Obj',false)]),{});
CryptoTest.type$.af$('selfSign',73728,'crypto::Cert?',{}).am$('crypto',270336,'crypto::Crypto',xp,{}).am$('setup',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
JwtTest.type$.am$('testJwtConstruction',8192,'sys::Void',xp,{}).am$('testPresignedJwt',8192,'sys::Void',xp,{}).am$('testHmacSignedJwt',8192,'sys::Void',xp,{}).am$('testRsaSignedJwt',8192,'sys::Void',xp,{}).am$('testEcSignedJwt',8192,'sys::Void',xp,{}).am$('testUnsignedJwt',8192,'sys::Void',xp,{}).am$('testDecodeWithJwks',8192,'sys::Void',xp,{}).am$('testPsychicSignatureAttack',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
DigestTest.type$.am$('testSha256',8192,'sys::Void',xp,{}).am$('verifyDigest',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('md','crypto::Digest',false),new sys.Param('msg','sys::Str',false),new sys.Param('expect','sys::Str',false)]),{}).am$('testUpdates',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
KeyTest.type$.am$('testSigning',8192,'sys::Void',xp,{}).am$('testEncryption',8192,'sys::Void',xp,{}).am$('testLoadEc',8192,'sys::Void',xp,{}).am$('testLoadSEC1EncodedEC',8192,'sys::Void',xp,{}).am$('verifyKey',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','crypto::Key',false),new sys.Param('alg','sys::Str',false),new sys.Param('format','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "crypto");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0");
m.set("pod.summary", "Cryptography API");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:21-05:00 New_York");
m.set("build.tsKey", "241210143121");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "true");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "Fantom");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Fantom Core");
m.set("proj.uri", "https://fantom.org/");
m.set("pod.docApi", "true");
m.set("org.uri", "https://fantom.org/");
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/fantom-lang/fantom");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  KeyStore,
  KeyStoreEntry,
  PrivKeyEntry,
  TrustEntry,
  Crypto,
  Jwt,
  JwsAlgorithm,
  Digest,
  Csr,
  Jwk,
  KeyPair,
  Key,
  AsymKey,
  PrivKey,
  PubKey,
  SymKey,
  MacKey,
  Cert,
  CertSigner,
  CryptoTest,
  JwtTest,
  DigestTest,
  KeyTest,
};
