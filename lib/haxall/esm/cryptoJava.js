// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as math from './math.js'
import * as asn1 from './asn1.js'
import * as util from './util.js'
import * as web from './web.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class JCertSigner extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#serialNumber = util.Random.makeSecure().next(sys.Range.make(0, sys.Int.maxVal(), true));
    this.#_notBefore = sys.Date.today().midnight();
    this.#_notAfter = sys.Date.today().plus(sys.Duration.fromStr("365day")).midnight();
    this.#sigAlg = AlgId.makeSpec(Pkcs1.sha256WithRSAEncryption());
    this.#subjectAltNames = asn1.AsnColl.builder();
    this.#exts = sys.List.make(V3Ext.type$);
    return;
  }

  typeof() { return JCertSigner.type$; }

  #csr = null;

  // private field reflection only
  __csr(it) { if (it === undefined) return this.#csr; else this.#csr = it; }

  #caPrivKey = null;

  // private field reflection only
  __caPrivKey(it) { if (it === undefined) return this.#caPrivKey; else this.#caPrivKey = it; }

  #subjectDn = null;

  // private field reflection only
  __subjectDn(it) { if (it === undefined) return this.#subjectDn; else this.#subjectDn = it; }

  #issuerDn = null;

  // private field reflection only
  __issuerDn(it) { if (it === undefined) return this.#issuerDn; else this.#issuerDn = it; }

  #serialNumber = 0;

  // private field reflection only
  __serialNumber(it) { if (it === undefined) return this.#serialNumber; else this.#serialNumber = it; }

  #_notBefore = null;

  // private field reflection only
  ___notBefore(it) { if (it === undefined) return this.#_notBefore; else this.#_notBefore = it; }

  #_notAfter = null;

  // private field reflection only
  ___notAfter(it) { if (it === undefined) return this.#_notAfter; else this.#_notAfter = it; }

  #sigAlg = null;

  // private field reflection only
  __sigAlg(it) { if (it === undefined) return this.#sigAlg; else this.#sigAlg = it; }

  #subjectAltNames = null;

  // private field reflection only
  __subjectAltNames(it) { if (it === undefined) return this.#subjectAltNames; else this.#subjectAltNames = it; }

  #exts = null;

  // private field reflection only
  __exts(it) { if (it === undefined) return this.#exts; else this.#exts = it; }

  static make(csr) {
    const $self = new JCertSigner();
    JCertSigner.make$($self,csr);
    return $self;
  }

  static make$($self,csr) {
    ;
    $self.#csr = csr;
    $self.#subjectDn = sys.ObjUtil.coerce(Dn.fromStr(csr.subject()), Dn.type$);
    $self.#caPrivKey = csr.priv();
    $self.#issuerDn = $self.#subjectDn;
    return;
  }

  ca(caPrivKey,caCert) {
    this.#caPrivKey = caPrivKey;
    this.#issuerDn = sys.ObjUtil.coerce(Dn.fromStr(caCert.subject()), Dn.type$);
    return this;
  }

  notBefore(date) {
    this.#_notBefore = date.midnight();
    return this;
  }

  notAfter(date) {
    this.#_notAfter = date.midnight();
    return this;
  }

  signWith(opts) {
    this.#sigAlg = sys.ObjUtil.coerce(AlgId.fromOpts(opts), AlgId.type$);
    return this;
  }

  sign() {
    this.validate();
    this.finish();
    let encoded = asn1.BerWriter.toBuf(this.asn());
    return sys.ObjUtil.coerce(X509.load(encoded.in()).first(), crypto.Cert.type$);
  }

  validate() {
    if (this.#caPrivKey == null) {
      throw sys.Err.make("No CA configured. The CSR must be generated with a KeyPair, or the ca() method must be called");
    }
    ;
    if (sys.ObjUtil.compareGT(this.#_notBefore, this.#_notAfter)) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("NotBefore (", this.#_notBefore), ") is after NotAfter ("), this.#_notAfter), ")"));
    }
    ;
    return;
  }

  finish() {
    let sans = this.#subjectAltNames.toSeq();
    if (!sans.isEmpty()) {
      this.#exts.add(V3Ext.makeSpec(asn1.Asn.oid("2.5.29.17"), sans));
    }
    ;
    return;
  }

  asn() {
    let tbsCert = this.buildTbsCert();
    let signature = asn1.Asn.bits(Pkcs1.sign(sys.ObjUtil.coerce(this.#caPrivKey, crypto.PrivKey.type$), asn1.BerWriter.toBuf(tbsCert), this.#sigAlg));
    return asn1.Asn.seq(sys.List.make(asn1.AsnObj.type$, [tbsCert, this.#sigAlg, signature]));
  }

  buildTbsCert() {
    let items = sys.List.make(asn1.AsnObj.type$).add(asn1.Asn.tag(asn1.AsnTag.context(0).explicit()).int(sys.ObjUtil.coerce(2, sys.Obj.type$))).add(asn1.Asn.int(sys.ObjUtil.coerce(this.#serialNumber, sys.Obj.type$))).add(this.#sigAlg).add(this.#issuerDn.asn()).add(asn1.Asn.seq(sys.List.make(asn1.AsnObj.type$, [JCertSigner.validity(this.#_notBefore), JCertSigner.validity(this.#_notAfter)]))).add(this.#subjectDn.asn()).add(asn1.Asn.any(sys.ObjUtil.coerce(this.#csr.pub().encoded(), sys.Buf.type$)));
    if (!this.#exts.isEmpty()) {
      items.add(asn1.Asn.tag(asn1.AsnTag.context(3).explicit()).seq(this.#exts));
    }
    ;
    return asn1.Asn.seq(items);
  }

  static validity(ts) {
    if (sys.ObjUtil.equals(ts.sec(), 0)) {
      (ts = ts.plus(sys.Duration.fromStr("1sec")));
    }
    ;
    return ((this$) => { if (sys.ObjUtil.compareLT(ts.year(), 2050)) return asn1.Asn.utc(ts.toUtc()); return asn1.Asn.genTime(ts); })(this);
  }

  subjectKeyId(buf) {
    this.#exts.add(V3Ext.makeSpec(asn1.Asn.oid("2.5.29.14"), asn1.Asn.octets(buf)));
    return this;
  }

  authKeyId(buf) {
    this.#exts.add(V3Ext.makeSpec(asn1.Asn.oid("2.5.29.35"), asn1.Asn.seq(sys.List.make(asn1.AsnObj.type$, [asn1.Asn.tag(asn1.AsnTag.context(0).implicit()).octets(buf)]))));
    return this;
  }

  basicConstraints(ca,pathLenConstraint) {
    if (ca === undefined) ca = false;
    if (pathLenConstraint === undefined) pathLenConstraint = null;
    this.#exts.add(sys.ObjUtil.coerce(BasicConstraints.basicConstraints(ca, pathLenConstraint), V3Ext.type$));
    return this;
  }

  keyUsage(bits) {
    this.#exts.add(V3Ext.makeSpec(asn1.Asn.oid("2.5.29.15"), asn1.Asn.bits(bits)));
    return this;
  }

  subjectAltName(name) {
    if (sys.ObjUtil.is(name, sys.Str.type$)) {
      this.#subjectAltNames.add(asn1.Asn.tag(asn1.AsnTag.context(2).implicit()).str(sys.ObjUtil.coerce(name, sys.Str.type$), asn1.AsnTag.univIa5Str()));
    }
    else {
      if (sys.ObjUtil.is(name, sys.Uri.type$)) {
        this.#subjectAltNames.add(asn1.Asn.tag(asn1.AsnTag.context(6).implicit()).str(sys.ObjUtil.toStr(name), asn1.AsnTag.univIa5Str()));
      }
      else {
        if (sys.ObjUtil.is(name, inet.IpAddr.type$)) {
          this.#subjectAltNames.add(asn1.Asn.tag(asn1.AsnTag.context(7).implicit()).octets(sys.ObjUtil.coerce(name, inet.IpAddr.type$).bytes()));
        }
        else {
          throw sys.UnsupportedErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unsupported type for SAN: ", name), " ("), sys.ObjUtil.typeof(name)), ")"));
        }
        ;
      }
      ;
    }
    ;
    return this;
  }

  extendedKeyUsage(oids) {
    const this$ = this;
    let builder = asn1.AsnColl.builder();
    oids.each((oid) => {
      builder.add(asn1.Asn.oid(oid));
      return;
    });
    this.#exts.add(V3Ext.makeSpec(asn1.Asn.oid("2.5.29.37"), builder.toSeq()));
    return this;
  }

}

class V3Ext extends asn1.AsnSeq {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return V3Ext.type$; }

  static makeSpec(extnId,val,critical) {
    const $self = new V3Ext();
    V3Ext.makeSpec$($self,extnId,val,critical);
    return $self;
  }

  static makeSpec$($self,extnId,val,critical) {
    if (critical === undefined) critical = false;
    asn1.AsnSeq.make$($self, sys.List.make(asn1.AsnTag.type$, [asn1.AsnTag.univSeq()]), asn1.AsnItem.type$.emptyList());
    let vals = sys.List.make(asn1.AsnObj.type$, [extnId]);
    if (critical) {
      vals.add(asn1.Asn.bool(true));
    }
    ;
    vals.add(asn1.Asn.octets(asn1.BerWriter.toBuf(val)));
    $self.__val(((this$) => { let $_u1 = asn1.AsnColl.toItems(vals); if ($_u1 == null) return null; return sys.ObjUtil.toImmutable(asn1.AsnColl.toItems(vals)); })($self));
    return;
  }

  static make(items) {
    const $self = new V3Ext();
    V3Ext.make$($self,items);
    return $self;
  }

  static make$($self,items) {
    asn1.AsnSeq.make$($self, sys.List.make(asn1.AsnTag.type$, [asn1.AsnTag.univSeq()]), items);
    return;
  }

  extnId() {
    return sys.ObjUtil.coerce(this.vals().get(0), asn1.AsnOid.type$);
  }

  isCritical() {
    return ((this$) => { if (this$.vals().get(1).isBool()) return this$.vals().get(1).bool(); return false; })(this);
  }

  extnVal() {
    return ((this$) => { if (this$.vals().get(1).isOcts()) return this$.vals().get(1); return this$.vals().get(2); })(this).buf();
  }

}

class BasicConstraints extends V3Ext {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BasicConstraints.type$; }

  static basicConstraints(isCa,maxPathLen) {
    if (maxPathLen === undefined) maxPathLen = null;
    if ((!isCa && maxPathLen != null)) {
      throw sys.ArgErr.make("maxPathLen only valid if isCa is true");
    }
    ;
    let vals = sys.List.make(asn1.AsnObj.type$);
    if (isCa) {
      vals.add(asn1.Asn.bool(true));
      if ((maxPathLen != null && sys.ObjUtil.compareLT(maxPathLen, 0))) {
        throw sys.ArgErr.make(sys.Str.plus("Negative maxPathLen: ", sys.ObjUtil.coerce(maxPathLen, sys.Obj.type$.toNullable())));
      }
      ;
      if (maxPathLen != null) {
        vals.add(asn1.Asn.int(sys.ObjUtil.coerce(maxPathLen, sys.Obj.type$)));
      }
      ;
    }
    ;
    return BasicConstraints.makeSpec(asn1.Asn.oid("2.5.29.19"), asn1.Asn.seq(vals));
  }

  static makeSpec(extnId,extnVal,critical) {
    const $self = new BasicConstraints();
    BasicConstraints.makeSpec$($self,extnId,extnVal,critical);
    return $self;
  }

  static makeSpec$($self,extnId,extnVal,critical) {
    if (critical === undefined) critical = false;
    V3Ext.makeSpec$($self, extnId, extnVal, critical);
    return;
  }

  static make(items) {
    const $self = new BasicConstraints();
    BasicConstraints.make$($self,items);
    return $self;
  }

  static make$($self,items) {
    V3Ext.make$($self, items);
    return;
  }

  isCa() {
    if (this.isEmpty()) {
      return false;
    }
    ;
    return ((this$) => { if (this$.vals().get(0).isBool()) return this$.vals().get(0).bool(); return false; })(this);
  }

  maxPath() {
    if (this.isEmpty()) {
      return null;
    }
    ;
    if (this.vals().get(0).isInt()) {
      return sys.ObjUtil.coerce(this.vals().get(0).int(), sys.Int.type$.toNullable());
    }
    ;
    return ((this$) => { let $_u5 = this$.vals().getSafe(1); if ($_u5 == null) return null; return this$.vals().getSafe(1).int(); })(this);
  }

}


class JCsr extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#priv = null;
    this.#opts = sys.ObjUtil.coerce(((this$) => { let $_u6 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")); if ($_u6 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))); })(this), sys.Type.find("[sys::Str:sys::Obj]"));
    return;
  }

  typeof() { return JCsr.type$; }

  #pub = null;

  pub() { return this.#pub; }

  __pub(it) { if (it === undefined) return this.#pub; else this.#pub = it; }

  #priv = null;

  priv() { return this.#priv; }

  __priv(it) { if (it === undefined) return this.#priv; else this.#priv = it; }

  #subject = null;

  subject() { return this.#subject; }

  __subject(it) { if (it === undefined) return this.#subject; else this.#subject = it; }

  #opts = null;

  opts() { return this.#opts; }

  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #sigAlg = null;

  // private field reflection only
  __sigAlg(it) { if (it === undefined) return this.#sigAlg; else this.#sigAlg = it; }

  static decode(der) {
    const $self = new JCsr();
    JCsr.decode$($self,der);
    return $self;
  }

  static decode$($self,der) {
    ;
    let req = sys.ObjUtil.coerce(asn1.BerReader.make(der.in()).readObj(), asn1.AsnSeq.type$);
    let reqInfo = sys.ObjUtil.coerce(req.vals().get(0), asn1.AsnSeq.type$);
    let encPubKey = asn1.BerWriter.toBuf(reqInfo.vals().get(2));
    let pubKey = JPubKey.decode(encPubKey, "RSA");
    $self.#pub = sys.ObjUtil.coerce(pubKey, crypto.PubKey.type$);
    $self.#subject = Dn.fromSeq(sys.ObjUtil.coerce(reqInfo.vals().get(1), asn1.AsnSeq.type$)).toStr();
    $self.#sigAlg = AlgId.make(sys.ObjUtil.as(req.vals().get(1), asn1.AsnSeq.type$).vals());
    $self.#opts = sys.ObjUtil.coerce(((this$) => { let $_u7 = sys.Map.__fromLiteral(["algorithm"], [this$.#sigAlg.algorithm()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u7 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["algorithm"], [this$.#sigAlg.algorithm()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })($self), sys.Type.find("[sys::Str:sys::Obj]"));
    return;
  }

  static make(keys,subjectDn,opts) {
    const $self = new JCsr();
    JCsr.make$($self,keys,subjectDn,opts);
    return $self;
  }

  static make$($self,keys,subjectDn,opts) {
    ;
    $self.#pub = keys.pub();
    $self.#priv = keys.priv();
    $self.#subject = subjectDn;
    $self.#opts = sys.ObjUtil.coerce(((this$) => { let $_u8 = opts; if ($_u8 == null) return null; return sys.ObjUtil.toImmutable(opts); })($self), sys.Type.find("[sys::Str:sys::Obj]"));
    $self.#sigAlg = sys.ObjUtil.coerce(AlgId.fromOpts(opts), AlgId.type$);
    return;
  }

  pem() {
    let buf = sys.Buf.make();
    this.gen(buf.out());
    return sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).readAllStr();
  }

  toStr() {
    if (this.#priv != null) {
      return this.pem();
    }
    ;
    return sys.Str.plus("CSR for ", this.#subject);
  }

  gen(out,close) {
    if (close === undefined) close = true;
    if (this.#priv == null) {
      throw sys.ArgErr.make("No private key was supplied");
    }
    ;
    PemWriter.make(out).write(PemLabel.csr(), asn1.BerWriter.toBuf(this.asn()));
    if (close) {
      out.close();
    }
    ;
    return;
  }

  asn() {
    let reqInfo = this.buildReqInfo();
    let sig = this.sign(reqInfo);
    return asn1.Asn.seq(sys.List.make(asn1.AsnObj.type$, [reqInfo, this.#sigAlg, sig]));
  }

  buildReqInfo() {
    let ver = asn1.Asn.int(sys.ObjUtil.coerce(0, sys.Obj.type$));
    let name = Dn.fromStr(this.#subject).asn();
    let pkInfo = asn1.Asn.any(sys.ObjUtil.coerce(this.#pub.encoded(), sys.Buf.type$));
    return asn1.Asn.seq(sys.List.make(asn1.AsnObj.type$, [ver, name, pkInfo]));
  }

  sign(reqInfo) {
    return asn1.Asn.bits(Pkcs1.sign(sys.ObjUtil.coerce(this.#priv, crypto.PrivKey.type$), asn1.BerWriter.toBuf(reqInfo), this.#sigAlg));
  }

}

class JCrypto extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JCrypto.type$; }

  static cur() { return crypto.Crypto.cur(); }

  digest(algorithm) {
    return JDigest.make(algorithm);
  }

  genCsr(keys,subjectDn,opts) {
    if (opts === undefined) opts = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj]"));
    return JCsr.make(keys, subjectDn, opts);
  }

  certSigner(csr) {
    return JCertSigner.make(sys.ObjUtil.coerce(csr, JCsr.type$));
  }

  genKeyPair(algorithm,bits) {
    return JKeyPair.genKeyPair(algorithm, bits);
  }

  loadX509(in$) {
    return X509.load(in$);
  }

  loadCertsForUri(uri) {
    return X509.loadCertsForUri(uri);
  }

  loadKeyStore(file,opts) {
    if (file === undefined) file = null;
    if (opts === undefined) opts = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj]"));
    return JKeyStore.load(file, opts);
  }

  loadPem(in$,algorithm) {
    if (algorithm === undefined) algorithm = "RSA";
    return PemReader.make(in$, algorithm).next();
  }

  loadJwk(map) {
    return JJwk.make(map);
  }

  loadJwksForUri(uri,maxJwKeys) {
    if (maxJwKeys === undefined) maxJwKeys = 10;
    return JJwk.importJwksUri(uri, sys.ObjUtil.coerce(maxJwKeys, sys.Int.type$.toNullable()));
  }

  static make() {
    const $self = new JCrypto();
    JCrypto.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class JJwk extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JJwk.type$; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #key = null;

  key() { return this.#key; }

  __key(it) { if (it === undefined) return this.#key; else this.#key = it; }

  toStr() {
    return util.JsonOutStream.prettyPrintToStr(this.#meta);
  }

  kid() {
    return sys.ObjUtil.coerce(this.#meta.get(JwkConst.KeyIdHeader()), sys.Str.type$.toNullable());
  }

  kty() {
    return sys.ObjUtil.coerce(this.#meta.get(JwkConst.KeyTypeHeader()), sys.Str.type$);
  }

  alg() {
    return sys.ObjUtil.coerce(this.#meta.get(JwkConst.AlgorithmHeader()), sys.Str.type$);
  }

  digestAlgorithm() {
    return crypto.JwsAlgorithm.fromParameters(this.#meta).digest();
  }

  use() {
    return sys.ObjUtil.coerce(this.#meta.get(JwkConst.UseHeader()), sys.Str.type$.toNullable());
  }

  static make(map) {
    const $self = new JJwk();
    JJwk.make$($self,map);
    return $self;
  }

  static make$($self,map) {
    $self.#meta = sys.ObjUtil.coerce(((this$) => { let $_u9 = map; if ($_u9 == null) return null; return sys.ObjUtil.toImmutable(map); })($self), sys.Type.find("[sys::Str:sys::Obj]"));
    if (!$self.#meta.containsKey(JwkConst.KeyTypeHeader())) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("JWK missing Key type (", JwkConst.KeyTypeHeader()), ")"));
    }
    ;
    let kty = JwsKeyType.fromParameters($self.#meta);
    if ($self.#meta.containsKey(JwkConst.UseHeader())) {
      if (JwsUse.fromParameters($self.#meta) == null) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus("JWK Use (", JwkConst.UseHeader()), ") Parameter invalid type"));
      }
      ;
    }
    ;
    if (!$self.#meta.containsKey(JwkConst.AlgorithmHeader())) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("JWK missing Algorithm (", JwkConst.AlgorithmHeader()), ") Paramter"));
    }
    ;
    if (crypto.JwsAlgorithm.fromParameters($self.#meta) == null) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("JWK Algorithm (", JwkConst.AlgorithmHeader()), ") Parameter invalid type"));
    }
    ;
    if ($self.#meta.containsKey(JwkConst.KeyIdHeader())) {
      if (!sys.ObjUtil.is($self.#meta.get(JwkConst.KeyIdHeader()), sys.Str.type$)) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus("JWK Key ID (", JwkConst.KeyIdHeader()), ") invalid type"));
      }
      ;
    }
    ;
    if (sys.ObjUtil.equals(kty, JwsKeyType.rsa())) {
      $self.#key = JwRsaPubKey.getKey($self.#meta);
    }
    else {
      if (sys.ObjUtil.equals(kty, JwsKeyType.ec())) {
        $self.#key = JwEcPubKey.getKey($self.#meta);
      }
      else {
        if (sys.ObjUtil.equals(kty, JwsKeyType.oct())) {
          $self.#key = JwHmacKey.getKey($self.#meta);
        }
        else {
          throw sys.Err.make("Unsupported JWK Type");
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  static importJwksUri(jwksUri,maxJwKeys) {
    if (maxJwKeys === undefined) maxJwKeys = sys.ObjUtil.coerce(10, sys.Int.type$.toNullable());
    try {
      let c = web.WebClient.make(jwksUri);
      c.reqHeaders().set("Accept", "text/plain; charset=utf-8");
      let buf = c.getBuf();
      return JJwk.importJwks(sys.ObjUtil.coerce(util.JsonInStream.make(buf.in()).readJson(), sys.Type.find("[sys::Str:sys::Obj]")), maxJwKeys);
    }
    catch ($_u10) {
      $_u10 = sys.Err.make($_u10);
      if ($_u10 instanceof sys.Err) {
        let err = $_u10;
        ;
        err.trace();
        throw err;
      }
      else {
        throw $_u10;
      }
    }
    ;
  }

  static importJwks(jwks,maxJwKeys) {
    if (maxJwKeys === undefined) maxJwKeys = sys.ObjUtil.coerce(10, sys.Int.type$.toNullable());
    const this$ = this;
    let keysList = sys.ObjUtil.as(jwks.get("keys"), sys.Type.find("sys::List"));
    if (keysList == null) {
      throw sys.Err.make("Invalid JSON Web Key Set");
    }
    ;
    if (sys.ObjUtil.compareGT(keysList.size(), maxJwKeys)) {
      (keysList = keysList.getRange(sys.Range.make(0, sys.Int.minus(sys.ObjUtil.coerce(maxJwKeys, sys.Int.type$), 1))));
    }
    ;
    let jwkList = sys.List.make(crypto.Jwk.type$);
    keysList.each((k) => {
      (jwkList = jwkList.add(JJwk.make(sys.ObjUtil.coerce(k, sys.Type.find("[sys::Str:sys::Obj]")))));
      return;
    });
    return jwkList;
  }

  static toJwk(key,digest,meta) {
    if (meta === undefined) meta = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj]"));
    let jwk = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).addAll(meta);
    if (sys.ObjUtil.is(key, crypto.PubKey.type$)) {
      let pubKey = sys.ObjUtil.as(key, crypto.PubKey.type$);
      if (sys.ObjUtil.equals(pubKey.algorithm(), "EC")) {
        let keyParams = JwEcPubKey.bufToJwk(sys.ObjUtil.coerce(pubKey.encoded(), sys.Buf.type$));
        (jwk = jwk.addAll(keyParams));
        jwk.set(JwkConst.AlgorithmHeader(), crypto.JwsAlgorithm.fromKeyAndDigest("EC", digest).toStr());
        jwk.set(JwkConst.KeyTypeHeader(), "EC");
      }
      else {
        if (sys.ObjUtil.equals(pubKey.algorithm(), "RSA")) {
          let keyParams = JwRsaPubKey.bufToJwk(sys.ObjUtil.coerce(pubKey.encoded(), sys.Buf.type$));
          (jwk = jwk.addAll(keyParams));
          jwk.set(JwkConst.AlgorithmHeader(), crypto.JwsAlgorithm.fromKeyAndDigest("RSA", digest).toStr());
          jwk.set(JwkConst.KeyTypeHeader(), "RSA");
        }
        else {
          throw sys.Err.make("Invalid Public Key");
        }
        ;
      }
      ;
    }
    else {
      if (sys.ObjUtil.is(key, crypto.MacKey.type$)) {
        jwk.set(JwkConst.AlgorithmHeader(), crypto.JwsAlgorithm.fromKeyAndDigest("oct", digest).toStr());
        jwk.set(JwkConst.KeyTypeHeader(), "oct");
        jwk.set(JwaConst.KeyValueParameter(), key.encoded().readAllStr());
      }
      else {
        throw sys.Err.make("Invalid key type");
      }
      ;
    }
    ;
    return JJwk.make(sys.ObjUtil.coerce(jwk, sys.Type.find("[sys::Str:sys::Obj]")));
  }

}

class JwkConst {
  constructor() {
    const this$ = this;
  }

  typeof() { return JwkConst.type$; }

  static #TypeHeader = undefined;

  static TypeHeader() {
    if (JwkConst.#TypeHeader === undefined) {
      JwkConst.static$init();
      if (JwkConst.#TypeHeader === undefined) JwkConst.#TypeHeader = null;
    }
    return JwkConst.#TypeHeader;
  }

  static #KeyTypeHeader = undefined;

  static KeyTypeHeader() {
    if (JwkConst.#KeyTypeHeader === undefined) {
      JwkConst.static$init();
      if (JwkConst.#KeyTypeHeader === undefined) JwkConst.#KeyTypeHeader = null;
    }
    return JwkConst.#KeyTypeHeader;
  }

  static #AlgorithmHeader = undefined;

  static AlgorithmHeader() {
    if (JwkConst.#AlgorithmHeader === undefined) {
      JwkConst.static$init();
      if (JwkConst.#AlgorithmHeader === undefined) JwkConst.#AlgorithmHeader = null;
    }
    return JwkConst.#AlgorithmHeader;
  }

  static #KeyIdHeader = undefined;

  static KeyIdHeader() {
    if (JwkConst.#KeyIdHeader === undefined) {
      JwkConst.static$init();
      if (JwkConst.#KeyIdHeader === undefined) JwkConst.#KeyIdHeader = null;
    }
    return JwkConst.#KeyIdHeader;
  }

  static #UseHeader = undefined;

  static UseHeader() {
    if (JwkConst.#UseHeader === undefined) {
      JwkConst.static$init();
      if (JwkConst.#UseHeader === undefined) JwkConst.#UseHeader = null;
    }
    return JwkConst.#UseHeader;
  }

  static #ContentTypeHeader = undefined;

  static ContentTypeHeader() {
    if (JwkConst.#ContentTypeHeader === undefined) {
      JwkConst.static$init();
      if (JwkConst.#ContentTypeHeader === undefined) JwkConst.#ContentTypeHeader = null;
    }
    return JwkConst.#ContentTypeHeader;
  }

  static static$init() {
    JwkConst.#TypeHeader = "typ";
    JwkConst.#KeyTypeHeader = "kty";
    JwkConst.#AlgorithmHeader = "alg";
    JwkConst.#KeyIdHeader = "kid";
    JwkConst.#UseHeader = "use";
    JwkConst.#ContentTypeHeader = "cty";
    return;
  }

}

class JwaConst {
  constructor() {
    const this$ = this;
  }

  typeof() { return JwaConst.type$; }

  static #CurveParameter = undefined;

  static CurveParameter() {
    if (JwaConst.#CurveParameter === undefined) {
      JwaConst.static$init();
      if (JwaConst.#CurveParameter === undefined) JwaConst.#CurveParameter = null;
    }
    return JwaConst.#CurveParameter;
  }

  static #XCoordParameter = undefined;

  static XCoordParameter() {
    if (JwaConst.#XCoordParameter === undefined) {
      JwaConst.static$init();
      if (JwaConst.#XCoordParameter === undefined) JwaConst.#XCoordParameter = null;
    }
    return JwaConst.#XCoordParameter;
  }

  static #YCoordParameter = undefined;

  static YCoordParameter() {
    if (JwaConst.#YCoordParameter === undefined) {
      JwaConst.static$init();
      if (JwaConst.#YCoordParameter === undefined) JwaConst.#YCoordParameter = null;
    }
    return JwaConst.#YCoordParameter;
  }

  static #ModulusParameter = undefined;

  static ModulusParameter() {
    if (JwaConst.#ModulusParameter === undefined) {
      JwaConst.static$init();
      if (JwaConst.#ModulusParameter === undefined) JwaConst.#ModulusParameter = null;
    }
    return JwaConst.#ModulusParameter;
  }

  static #ExponentParameter = undefined;

  static ExponentParameter() {
    if (JwaConst.#ExponentParameter === undefined) {
      JwaConst.static$init();
      if (JwaConst.#ExponentParameter === undefined) JwaConst.#ExponentParameter = null;
    }
    return JwaConst.#ExponentParameter;
  }

  static #KeyValueParameter = undefined;

  static KeyValueParameter() {
    if (JwaConst.#KeyValueParameter === undefined) {
      JwaConst.static$init();
      if (JwaConst.#KeyValueParameter === undefined) JwaConst.#KeyValueParameter = null;
    }
    return JwaConst.#KeyValueParameter;
  }

  static static$init() {
    JwaConst.#CurveParameter = "crv";
    JwaConst.#XCoordParameter = "x";
    JwaConst.#YCoordParameter = "y";
    JwaConst.#ModulusParameter = "n";
    JwaConst.#ExponentParameter = "e";
    JwaConst.#KeyValueParameter = "k";
    return;
  }

}

class JwsKeyType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JwsKeyType.type$; }

  static oct() { return JwsKeyType.vals().get(0); }

  static rsa() { return JwsKeyType.vals().get(1); }

  static ec() { return JwsKeyType.vals().get(2); }

  static none() { return JwsKeyType.vals().get(3); }

  static #vals = undefined;

  static fromParameters(key) {
    const this$ = this;
    let kty = key.get(JwkConst.KeyTypeHeader());
    if (kty == null) {
      return null;
    }
    ;
    let type = JwsKeyType.vals().find((v) => {
      return sys.ObjUtil.equals(v.toStr(), kty);
    });
    return ((this$) => { if (type == null) throw sys.Err.make("JWK kty invalid type"); return type; })(this);
  }

  toStr() {
    if ((sys.ObjUtil.equals(this.name(), "oct") || sys.ObjUtil.equals(this.name(), "none"))) {
      return this.name();
    }
    ;
    return sys.Str.upper(this.name());
  }

  static make($ordinal,$name) {
    const $self = new JwsKeyType();
    JwsKeyType.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(JwsKeyType.type$, JwsKeyType.vals(), name$, checked);
  }

  static vals() {
    if (JwsKeyType.#vals == null) {
      JwsKeyType.#vals = sys.List.make(JwsKeyType.type$, [
        JwsKeyType.make(0, "oct", ),
        JwsKeyType.make(1, "rsa", ),
        JwsKeyType.make(2, "ec", ),
        JwsKeyType.make(3, "none", ),
      ]).toImmutable();
    }
    return JwsKeyType.#vals;
  }

  static static$init() {
    const $_u12 = JwsKeyType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class JwsUse extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JwsUse.type$; }

  static sig() { return JwsUse.vals().get(0); }

  static enc() { return JwsUse.vals().get(1); }

  static #vals = undefined;

  static fromParameters(key) {
    let use = key.get(JwkConst.UseHeader());
    if (use == null) {
      return null;
    }
    ;
    return JwsUse.fromStr(sys.ObjUtil.coerce(use, sys.Str.type$), false);
  }

  static make($ordinal,$name) {
    const $self = new JwsUse();
    JwsUse.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(JwsUse.type$, JwsUse.vals(), name$, checked);
  }

  static vals() {
    if (JwsUse.#vals == null) {
      JwsUse.#vals = sys.List.make(JwsUse.type$, [
        JwsUse.make(0, "sig", ),
        JwsUse.make(1, "enc", ),
      ]).toImmutable();
    }
    return JwsUse.#vals;
  }

  static static$init() {
    const $_u13 = JwsUse.vals();
    if (true) {
    }
    ;
    return;
  }

}

class JwPubKey {
  constructor() {
    const this$ = this;
  }

  typeof() { return JwPubKey.type$; }

  static pem(der,algorithm) {
    let buf = sys.Buf.make();
    let out = buf.out();
    out.writeChars("-----BEGIN PUBLIC KEY-----\n");
    let base64 = der.toBase64();
    let size = sys.Str.size(base64);
    let idx = 0;
    let pemChars = 64;
    while (sys.ObjUtil.compareLT(idx, size)) {
      let end = sys.Int.min(sys.Int.plus(idx, pemChars), size);
      out.writeChars(sys.Str.getRange(base64, sys.Range.make(idx, end, true))).writeChar(10);
      idx = sys.Int.plus(idx, pemChars);
    }
    ;
    out.writeChars("-----END PUBLIC KEY-----\n");
    buf.flip();
    return sys.ObjUtil.as(crypto.Crypto.cur().loadPem(sys.ObjUtil.coerce(buf.seek(0), sys.Buf.type$.toNullable()).in(), algorithm), crypto.PubKey.type$);
  }

}

class JwRsaPubKey extends sys.Obj {
  constructor() {
    super();
    this.peer = new JwRsaPubKeyPeer(this);
    const this$ = this;
  }

  typeof() { return JwRsaPubKey.type$; }

  static CurveParameter() { return JwaConst.CurveParameter(); }

  static XCoordParameter() { return JwaConst.XCoordParameter(); }

  static ExponentParameter() { return JwaConst.ExponentParameter(); }

  static YCoordParameter() { return JwaConst.YCoordParameter(); }

  static KeyValueParameter() { return JwaConst.KeyValueParameter(); }

  static ModulusParameter() { return JwaConst.ModulusParameter(); }

  static #algorithm = undefined;

  static algorithm() {
    if (JwRsaPubKey.#algorithm === undefined) {
      JwRsaPubKey.static$init();
      if (JwRsaPubKey.#algorithm === undefined) JwRsaPubKey.#algorithm = null;
    }
    return JwRsaPubKey.#algorithm;
  }

  static getKey(map) {
    if (sys.ObjUtil.compareNE(JwsKeyType.fromParameters(map), JwsKeyType.rsa())) {
      throw sys.Err.make("JWK is not RSA key type");
    }
    ;
    if (!map.containsKey(JwaConst.ModulusParameter())) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("JWK missing RSA modulus (", JwaConst.ModulusParameter()), ")"));
    }
    ;
    if (!map.containsKey(JwaConst.ExponentParameter())) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("JWK missing RSA exponent (", JwaConst.ExponentParameter()), ")"));
    }
    ;
    return sys.ObjUtil.coerce(JwPubKey.pem(JwRsaPubKey.der(map), JwRsaPubKey.algorithm()), crypto.Key.type$);
  }

  static jwkToBuf(mod,exp) {
    return JwRsaPubKeyPeer.jwkToBuf(mod,exp);
  }

  static bufToJwk(key) {
    return JwRsaPubKeyPeer.bufToJwk(key);
  }

  static der(jwk) {
    let mod = sys.ObjUtil.as(jwk.get(JwaConst.ModulusParameter()), sys.Str.type$);
    let exp = sys.ObjUtil.as(jwk.get(JwaConst.ExponentParameter()), sys.Str.type$);
    return JwRsaPubKey.jwkToBuf(sys.ObjUtil.coerce(mod, sys.Str.type$), sys.ObjUtil.coerce(exp, sys.Str.type$));
  }

  static make() {
    const $self = new JwRsaPubKey();
    JwRsaPubKey.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    JwRsaPubKey.#algorithm = "RSA";
    return;
  }

}

class JwEcPubKey extends sys.Obj {
  constructor() {
    super();
    this.peer = new JwEcPubKeyPeer(this);
    const this$ = this;
  }

  typeof() { return JwEcPubKey.type$; }

  static CurveParameter() { return JwaConst.CurveParameter(); }

  static XCoordParameter() { return JwaConst.XCoordParameter(); }

  static ExponentParameter() { return JwaConst.ExponentParameter(); }

  static YCoordParameter() { return JwaConst.YCoordParameter(); }

  static KeyValueParameter() { return JwaConst.KeyValueParameter(); }

  static ModulusParameter() { return JwaConst.ModulusParameter(); }

  static #algorithm = undefined;

  static algorithm() {
    if (JwEcPubKey.#algorithm === undefined) {
      JwEcPubKey.static$init();
      if (JwEcPubKey.#algorithm === undefined) JwEcPubKey.#algorithm = null;
    }
    return JwEcPubKey.#algorithm;
  }

  static getKey(map) {
    if (sys.ObjUtil.compareNE(JwsKeyType.fromParameters(map), JwsKeyType.ec())) {
      throw sys.Err.make("JWK is not EC key type");
    }
    ;
    if (!map.containsKey(JwaConst.XCoordParameter())) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("JWK missing EC X coordinate parameter (", JwaConst.XCoordParameter()), ")"));
    }
    ;
    if (!map.containsKey(JwaConst.YCoordParameter())) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("JWK missing EC Y coordinate parameter (", JwaConst.YCoordParameter()), ")"));
    }
    ;
    if (!map.containsKey(JwaConst.CurveParameter())) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("JWK missing EC Curve parameter (", JwaConst.CurveParameter()), ")"));
    }
    ;
    return sys.ObjUtil.coerce(JwPubKey.pem(JwEcPubKey.der(map), JwEcPubKey.algorithm()), crypto.Key.type$);
  }

  static jwkToBuf(x,y,curve) {
    return JwEcPubKeyPeer.jwkToBuf(x,y,curve);
  }

  static bufToJwk(key) {
    return JwEcPubKeyPeer.bufToJwk(key);
  }

  static der(jwk) {
    let x = sys.ObjUtil.as(jwk.get(JwaConst.XCoordParameter()), sys.Str.type$);
    let y = sys.ObjUtil.as(jwk.get(JwaConst.YCoordParameter()), sys.Str.type$);
    let crv = sys.ObjUtil.as(jwk.get(JwaConst.CurveParameter()), sys.Str.type$);
    return JwEcPubKey.jwkToBuf(sys.ObjUtil.coerce(x, sys.Str.type$), sys.ObjUtil.coerce(y, sys.Str.type$), sys.ObjUtil.coerce(crv, sys.Str.type$));
  }

  static make() {
    const $self = new JwEcPubKey();
    JwEcPubKey.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    JwEcPubKey.#algorithm = "EC";
    return;
  }

}

class JwHmacKey extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JwHmacKey.type$; }

  static CurveParameter() { return JwaConst.CurveParameter(); }

  static XCoordParameter() { return JwaConst.XCoordParameter(); }

  static ExponentParameter() { return JwaConst.ExponentParameter(); }

  static YCoordParameter() { return JwaConst.YCoordParameter(); }

  static KeyValueParameter() { return JwaConst.KeyValueParameter(); }

  static ModulusParameter() { return JwaConst.ModulusParameter(); }

  static getKey(map) {
    if (sys.ObjUtil.compareNE(JwsKeyType.fromParameters(map), JwsKeyType.oct())) {
      throw sys.Err.make("JWK is not oct key type");
    }
    ;
    if (!map.containsKey(JwaConst.KeyValueParameter())) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("JWK missing Key Value Parameter (", JwaConst.KeyValueParameter()), ")"));
    }
    ;
    let strKey = sys.ObjUtil.as(map.get(JwaConst.KeyValueParameter()), sys.Str.type$);
    let algorithmName = sys.Str.plus("Hmac", crypto.JwsAlgorithm.fromParameters(map).digest());
    return JMacKey.load(sys.Str.toBuf(strKey), algorithmName);
  }

  static make() {
    const $self = new JwHmacKey();
    JwHmacKey.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class JKeyPair extends sys.Obj {
  constructor() {
    super();
    this.peer = new JKeyPairPeer(this);
    const this$ = this;
  }

  typeof() { return JKeyPair.type$; }

  algorithm() { return crypto.KeyPair.prototype.algorithm.apply(this, arguments); }

  #priv = null;

  priv() { return this.#priv; }

  __priv(it) { if (it === undefined) return this.#priv; else this.#priv = it; }

  #pub = null;

  pub() { return this.#pub; }

  __pub(it) { if (it === undefined) return this.#pub; else this.#pub = it; }

  static genKeyPair(algorithm,bits) {
    return JKeyPairPeer.genKeyPair(algorithm,bits);
  }

  static make(priv,pub) {
    const $self = new JKeyPair();
    JKeyPair.make$($self,priv,pub);
    return $self;
  }

  static make$($self,priv,pub) {
    $self.#priv = priv;
    $self.#pub = pub;
    return;
  }

}





class JKeyStore extends sys.Obj {
  constructor() {
    super();
    this.peer = new JKeyStorePeer(this);
    const this$ = this;
  }

  typeof() { return JKeyStore.type$; }

  containsAlias() { return crypto.KeyStore.prototype.containsAlias.apply(this, arguments); }

  getPrivKey() { return crypto.KeyStore.prototype.getPrivKey.apply(this, arguments); }

  getTrust() { return crypto.KeyStore.prototype.getTrust.apply(this, arguments); }

  #entries = null;

  entries() { return this.#entries; }

  __entries(it) { if (it === undefined) return this.#entries; else this.#entries = it; }

  #format = null;

  format() { return this.#format; }

  __format(it) { if (it === undefined) return this.#format; else this.#format = it; }

  static load(file,opts) {
    return JKeyStorePeer.load(file,opts);
  }

  static make(format,entries) {
    const $self = new JKeyStore();
    JKeyStore.make$($self,format,entries);
    return $self;
  }

  static make$($self,format,entries) {
    $self.#format = format;
    $self.#entries = entries;
    return;
  }

  aliases() {
    return sys.ObjUtil.coerce(this.#entries.keys(sys.Str.type$), sys.Type.find("sys::Str[]"));
  }

  size() {
    return this.#entries.size();
  }

  save(out,options) {
    if (options === undefined) options = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj]"));
    return this.peer.save(this,out,options);
  }

  get(alias,checked) {
    if (checked === undefined) checked = true;
    let entry = sys.ObjUtil.as(this.#entries.get(this.normAlias(alias)), crypto.KeyStoreEntry.type$);
    if (entry != null) {
      return entry;
    }
    ;
    if (checked) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("No entry with alias: '", alias), "'"));
    }
    ;
    return null;
  }

  setPrivKey(alias,privKey,chain) {
    return sys.ObjUtil.coerce(this.set(alias, JPrivKeyEntry.make(privKey, chain)), JKeyStore.type$);
  }

  setTrust(alias,cert) {
    return sys.ObjUtil.coerce(this.set(alias, JTrustEntry.make(cert)), JKeyStore.type$);
  }

  set(alias,entry) {
    this.#entries.set(this.normAlias(alias), entry);
    return this;
  }

  remove(alias) {
    this.#entries.remove(alias);
    return;
  }

  normAlias(alias) {
    return sys.Str.lower(alias);
  }

}

class JKeyStoreEntry extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JKeyStoreEntry.type$; }

  #attrs = null;

  attrs() { return this.#attrs; }

  __attrs(it) { if (it === undefined) return this.#attrs; else this.#attrs = it; }

  static make(attrs) {
    const $self = new JKeyStoreEntry();
    JKeyStoreEntry.make$($self,attrs);
    return $self;
  }

  static make$($self,attrs) {
    $self.#attrs = sys.ObjUtil.coerce(((this$) => { let $_u14 = attrs; if ($_u14 == null) return null; return sys.ObjUtil.toImmutable(attrs); })($self), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

}

class JPrivKeyEntry extends JKeyStoreEntry {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JPrivKeyEntry.type$; }

  cert() { return crypto.PrivKeyEntry.prototype.cert.apply(this, arguments); }

  pub() { return crypto.PrivKeyEntry.prototype.pub.apply(this, arguments); }

  #priv = null;

  priv() { return this.#priv; }

  __priv(it) { if (it === undefined) return this.#priv; else this.#priv = it; }

  #certChain = null;

  certChain() { return this.#certChain; }

  __certChain(it) { if (it === undefined) return this.#certChain; else this.#certChain = it; }

  static make(priv,chain,attrs) {
    const $self = new JPrivKeyEntry();
    JPrivKeyEntry.make$($self,priv,chain,attrs);
    return $self;
  }

  static make$($self,priv,chain,attrs) {
    if (attrs === undefined) attrs = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str]"));
    JKeyStoreEntry.make$($self, attrs);
    $self.#priv = priv;
    $self.#certChain = sys.ObjUtil.coerce(((this$) => { let $_u15 = chain; if ($_u15 == null) return null; return sys.ObjUtil.toImmutable(chain); })($self), sys.Type.find("crypto::Cert[]"));
    return;
  }

  keyPair() {
    return JKeyPair.make(sys.ObjUtil.coerce(this.#priv, JPrivKey.type$), sys.ObjUtil.coerce(this.pub(), JPubKey.type$));
  }

}

class JTrustEntry extends JKeyStoreEntry {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JTrustEntry.type$; }

  #cert = null;

  cert() { return this.#cert; }

  __cert(it) { if (it === undefined) return this.#cert; else this.#cert = it; }

  static make(cert,attrs) {
    const $self = new JTrustEntry();
    JTrustEntry.make$($self,cert,attrs);
    return $self;
  }

  static make$($self,cert,attrs) {
    if (attrs === undefined) attrs = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str]"));
    JKeyStoreEntry.make$($self, attrs);
    $self.#cert = cert;
    return;
  }

}


class PemConst {
  constructor() {
    const this$ = this;
  }

  typeof() { return PemConst.type$; }

  static #DASH5 = undefined;

  static DASH5() {
    if (PemConst.#DASH5 === undefined) {
      PemConst.static$init();
      if (PemConst.#DASH5 === undefined) PemConst.#DASH5 = null;
    }
    return PemConst.#DASH5;
  }

  static #BEGIN = undefined;

  static BEGIN() {
    if (PemConst.#BEGIN === undefined) {
      PemConst.static$init();
      if (PemConst.#BEGIN === undefined) PemConst.#BEGIN = null;
    }
    return PemConst.#BEGIN;
  }

  static #END = undefined;

  static END() {
    if (PemConst.#END === undefined) {
      PemConst.static$init();
      if (PemConst.#END === undefined) PemConst.#END = null;
    }
    return PemConst.#END;
  }

  static #pemChars = undefined;

  static pemChars() {
    if (PemConst.#pemChars === undefined) {
      PemConst.static$init();
      if (PemConst.#pemChars === undefined) PemConst.#pemChars = 0;
    }
    return PemConst.#pemChars;
  }

  static static$init() {
    PemConst.#DASH5 = "-----";
    PemConst.#BEGIN = sys.Str.plus(sys.Str.plus("", PemConst.#DASH5), "BEGIN ");
    PemConst.#END = sys.Str.plus(sys.Str.plus("", PemConst.#DASH5), "END ");
    PemConst.#pemChars = 64;
    return;
  }

}

class PemLabel extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PemLabel.type$; }

  static publicKey() { return PemLabel.vals().get(0); }

  static rsaPrivKey() { return PemLabel.vals().get(1); }

  static ecPrivKey() { return PemLabel.vals().get(2); }

  static privKey() { return PemLabel.vals().get(3); }

  static cert() { return PemLabel.vals().get(4); }

  static csr() { return PemLabel.vals().get(5); }

  static #vals = undefined;

  #text = null;

  text() { return this.#text; }

  __text(it) { if (it === undefined) return this.#text; else this.#text = it; }

  static make($ordinal,$name,text) {
    const $self = new PemLabel();
    PemLabel.make$($self,$ordinal,$name,text);
    return $self;
  }

  static make$($self,$ordinal,$name,text) {
    sys.Enum.make$($self, $ordinal, $name);
    $self.#text = text;
    return;
  }

  static find(text) {
    const this$ = this;
    return PemLabel.vals().find((it) => {
      return sys.ObjUtil.equals(it.#text, text);
    });
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(PemLabel.type$, PemLabel.vals(), name$, checked);
  }

  static vals() {
    if (PemLabel.#vals == null) {
      PemLabel.#vals = sys.List.make(PemLabel.type$, [
        PemLabel.make(0, "publicKey", "PUBLIC KEY"),
        PemLabel.make(1, "rsaPrivKey", "RSA PRIVATE KEY"),
        PemLabel.make(2, "ecPrivKey", "EC PRIVATE KEY"),
        PemLabel.make(3, "privKey", "PRIVATE KEY"),
        PemLabel.make(4, "cert", "CERTIFICATE"),
        PemLabel.make(5, "csr", "CERTIFICATE REQUEST"),
      ]).toImmutable();
    }
    return PemLabel.#vals;
  }

  static static$init() {
    const $_u16 = PemLabel.vals();
    if (true) {
    }
    ;
    return;
  }

}

class PemWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PemWriter.type$; }

  static BEGIN() { return PemConst.BEGIN(); }

  static END() { return PemConst.END(); }

  static DASH5() { return PemConst.DASH5(); }

  static pemChars() { return PemConst.pemChars(); }

  #out = null;

  out() {
    return this.#out;
  }

  static make(out) {
    const $self = new PemWriter();
    PemWriter.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    $self.#out = out;
    return;
  }

  write(label,der) {
    let base64 = der.toBase64();
    let size = sys.Str.size(base64);
    let idx = 0;
    this.#out.writeChars(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", PemConst.BEGIN()), ""), label.text()), ""), PemConst.DASH5()), "\n"));
    while (sys.ObjUtil.compareLT(idx, size)) {
      let end = sys.Int.min(sys.Int.plus(idx, PemConst.pemChars()), size);
      this.#out.writeChars(sys.Str.getRange(base64, sys.Range.make(idx, end, true))).writeChar(10);
      idx = sys.Int.plus(idx, PemConst.pemChars());
    }
    ;
    this.#out.writeChars(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", PemConst.END()), ""), label.text()), ""), PemConst.DASH5()), "\n"));
    return this;
  }

  close() {
    this.#out.close();
    return;
  }

}

class PemReader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PemReader.type$; }

  static BEGIN() { return PemConst.BEGIN(); }

  static END() { return PemConst.END(); }

  static DASH5() { return PemConst.DASH5(); }

  static pemChars() { return PemConst.pemChars(); }

  #algorithm = null;

  // private field reflection only
  __algorithm(it) { if (it === undefined) return this.#algorithm; else this.#algorithm = it; }

  #in = null;

  // private field reflection only
  __in(it) { if (it === undefined) return this.#in; else this.#in = it; }

  #line = null;

  // private field reflection only
  __line(it) { if (it === undefined) return this.#line; else this.#line = it; }

  #label = null;

  // private field reflection only
  __label(it) { if (it === undefined) return this.#label; else this.#label = it; }

  static make(in$,algorithm) {
    const $self = new PemReader();
    PemReader.make$($self,in$,algorithm);
    return $self;
  }

  static make$($self,in$,algorithm) {
    $self.#in = in$;
    $self.#algorithm = algorithm;
    return;
  }

  next() {
    if (!this.skipToBegin()) {
      this.#in.close();
      return null;
    }
    ;
    this.parseLabel();
    let base64 = this.parseBase64();
    let der = sys.Buf.fromBase64(base64);
    let $_u17 = PemLabel.find(sys.ObjUtil.coerce(this.#label, sys.Str.type$));
    if (sys.ObjUtil.equals($_u17, PemLabel.rsaPrivKey())) {
      (der = sys.Buf.fromBase64(this.rsaP1ToP8(base64)));
      return JPrivKey.decode(der, "RSA");
    }
    else if (sys.ObjUtil.equals($_u17, PemLabel.ecPrivKey())) {
      (der = sys.Buf.fromBase64(this.ecSEC1ToP8(base64)));
      return JPrivKey.decode(der, "EC");
    }
    else if (sys.ObjUtil.equals($_u17, PemLabel.privKey())) {
      return JPrivKey.decode(der, this.#algorithm);
    }
    else if (sys.ObjUtil.equals($_u17, PemLabel.publicKey())) {
      return JPubKey.decode(der, this.#algorithm);
    }
    else if (sys.ObjUtil.equals($_u17, PemLabel.cert())) {
      return X509.load(der.in()).first();
    }
    else if (sys.ObjUtil.equals($_u17, PemLabel.csr())) {
      return JCsr.decode(sys.Buf.fromBase64(base64));
    }
    ;
    throw sys.ParseErr.make(sys.Str.plus("Unsupported label: ", this.#label));
  }

  skipToBegin() {
    while (this.nextLine() != null) {
      if ((sys.Str.startsWith(this.#line, PemConst.BEGIN()) && sys.Str.endsWith(this.#line, PemConst.DASH5()))) {
        return true;
      }
      ;
    }
    ;
    return false;
  }

  parseLabel() {
    return sys.ObjUtil.coerce(((this$) => { let $_u18 = sys.Str.getRange(this$.#line, sys.Range.make(sys.Str.size(PemConst.BEGIN()), sys.Int.minus(sys.Str.size(this$.#line), sys.Str.size(PemConst.DASH5())), true)); this$.#label = $_u18; return $_u18; })(this), sys.Str.type$);
  }

  parseBase64() {
    let end = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", PemConst.END()), ""), this.#label), ""), PemConst.DASH5());
    let base64 = sys.StrBuf.make();
    while (true) {
      this.nextLine();
      if (this.#line == null) {
        throw sys.ParseErr.make("Unexpected end-of-file");
      }
      ;
      if (sys.ObjUtil.equals(this.#line, end)) {
        break;
      }
      ;
      base64.add(this.#line);
    }
    ;
    return base64.toStr();
  }

  rsaP1ToP8(base64) {
    let p1 = sys.Buf.fromBase64(base64);
    let oid = sys.ObjUtil.coerce(asn1.BerReader.make(sys.Buf.fromHex("06092A864886F70D010101").in()).readObj(), asn1.AsnOid.type$);
    let root = asn1.Asn.seq(sys.List.make(asn1.AsnObj.type$, [asn1.Asn.int(sys.ObjUtil.coerce(0, sys.Obj.type$)), asn1.Asn.seq(sys.List.make(asn1.AsnObj.type$, [oid, asn1.Asn.Null()])), asn1.Asn.octets(p1)]));
    return asn1.BerWriter.toBuf(root).toBase64();
  }

  ecSEC1ToP8(base64) {
    let sec1 = sys.Buf.fromBase64(base64);
    let seq = asn1.BerReader.make(sec1.in()).readObj();
    let parts = sys.ObjUtil.as(seq.val(), sys.Type.find("sys::List"));
    if (sys.ObjUtil.compareLT(parts.size(), 3)) {
      throw sys.ArgErr.make("Invalid EC Private Key Encoding");
    }
    ;
    let ecParams = sys.ObjUtil.as(sys.ObjUtil.coerce(parts.get(2), asn1.AsnItem.type$).val(), asn1.AsnObj.type$);
    let cx0 = asn1.AsnTag.context(0).implicit();
    if (sys.ObjUtil.compareNE(ecParams.tags().get(0), cx0)) {
      throw sys.ArgErr.make("Invalid EC Private Key ECParameters");
    }
    ;
    let oid = asn1.Asn.oid("1.2.840.10045.2.1");
    let curve = sys.ObjUtil.coerce(asn1.BerReader.make(sys.Buf.fromHex(ecParams.buf().toHex()).in()).readObj(), asn1.AsnOid.type$);
    let root = asn1.Asn.seq(sys.List.make(asn1.AsnObj.type$, [asn1.Asn.int(sys.ObjUtil.coerce(0, sys.Obj.type$)), asn1.Asn.seq(sys.List.make(asn1.AsnOid.type$, [oid, curve])), asn1.Asn.octets(sec1)]));
    return asn1.BerWriter.toBuf(root).toBase64();
  }

  nextLine() {
    return ((this$) => { let $_u19 = this$.#in.readLine(); this$.#line = $_u19; return $_u19; })(this);
  }

}

class Rdn extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Rdn.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static #keywords = undefined;

  static keywords() {
    if (Rdn.#keywords === undefined) {
      Rdn.static$init();
      if (Rdn.#keywords === undefined) Rdn.#keywords = null;
    }
    return Rdn.#keywords;
  }

  static make(type,val) {
    const $self = new Rdn();
    Rdn.make$($self,type,val);
    return $self;
  }

  static make$($self,type,val) {
    $self.#type = type;
    $self.#val = val;
    return;
  }

  shortName() {
    const this$ = this;
    return sys.ObjUtil.coerce(Rdn.keywords().eachWhile((oid,n) => {
      return ((this$) => { if (sys.ObjUtil.equals(oid, this$.#type)) return n; return null; })(this$);
    }), sys.Str.type$.toNullable());
  }

  asnVal() {
    let $_u21 = this.shortName();
    if (sys.ObjUtil.equals($_u21, "C") || sys.ObjUtil.equals($_u21, "DNQUALIFIER") || sys.ObjUtil.equals($_u21, "SERIALNUMBER")) {
      return asn1.Asn.str(this.#val, asn1.AsnTag.univPrintStr());
    }
    else if (sys.ObjUtil.equals($_u21, "DC") || sys.ObjUtil.equals($_u21, "EMAIL")) {
      return asn1.Asn.str(this.#val, asn1.AsnTag.univIa5Str());
    }
    else {
      return asn1.Asn.utf8(this.#val);
    }
    ;
  }

  asn() {
    return asn1.Asn.set(sys.List.make(asn1.AsnSeq.type$, [asn1.Asn.seq(sys.List.make(asn1.AsnObj.type$, [this.#type, this.asnVal()]))]));
  }

  toStr() {
    let name = ((this$) => { let $_u22 = this$.shortName(); if ($_u22 != null) return $_u22; return this$.#type.oidStr(); })(this);
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", name), "="), this.#val);
  }

  static static$init() {
    if (true) {
      let id_at = "2.5.4";
      let pkcs9 = "1.2.840.113549.1.9";
      let m = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("asn1::AsnOid"));
      m.set("CN", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".3")));
      m.set("SURNAME", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".4")));
      m.set("SERIALNUMBER", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".5")));
      m.set("C", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".6")));
      m.set("L", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".7")));
      m.set("S", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".8")));
      m.set("ST", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".8")));
      m.set("STREET", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".9")));
      m.set("O", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".10")));
      m.set("OU", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".11")));
      m.set("TITLE", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".12")));
      m.set("NAME", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".41")));
      m.set("GIVENNAME", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".42")));
      m.set("INITIALS", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".43")));
      m.set("GENERATIONQUALIFIER", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".44")));
      m.set("DNQUALIFIER", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".46")));
      m.set("PSEUDONYM", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", id_at), ".65")));
      m.set("DC", asn1.Asn.oid("0.9.2342.19200300.100.1.25"));
      m.set("UID", asn1.Asn.oid("0.9.2342.19200300.100.1.1"));
      m.set("EMAIL", asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", pkcs9), ".1")));
      Rdn.#keywords = sys.ObjUtil.coerce(((this$) => { let $_u23 = m; if ($_u23 == null) return null; return sys.ObjUtil.toImmutable(m); })(this), sys.Type.find("[sys::Str:asn1::AsnOid]"));
    }
    ;
    return;
  }

}

class DnParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#pos = -1;
    this.#cur = -1;
    return;
  }

  typeof() { return DnParser.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  static #ESC = undefined;

  static ESC() {
    if (DnParser.#ESC === undefined) {
      DnParser.static$init();
      if (DnParser.#ESC === undefined) DnParser.#ESC = 0;
    }
    return DnParser.#ESC;
  }

  static #SP = undefined;

  static SP() {
    if (DnParser.#SP === undefined) {
      DnParser.static$init();
      if (DnParser.#SP === undefined) DnParser.#SP = 0;
    }
    return DnParser.#SP;
  }

  #pos = 0;

  // private field reflection only
  __pos(it) { if (it === undefined) return this.#pos; else this.#pos = it; }

  #cur = 0;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  static make(name) {
    const $self = new DnParser();
    DnParser.make$($self,name);
    return $self;
  }

  static make$($self,name) {
    ;
    $self.#name = name;
    return;
  }

  dn() {
    return Dn.make(this.parse());
  }

  parse() {
    this.#pos = -1;
    this.consume();
    let rdns = sys.List.make(Rdn.type$);
    while (true) {
      let type = this.parseType();
      this.consume(sys.ObjUtil.coerce(61, sys.Int.type$.toNullable()));
      let val = this.parseVal();
      rdns.add(Rdn.make(type, val));
      if (sys.ObjUtil.equals(this.#cur, 44)) {
        this.consume(sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
      }
      else {
        if (sys.ObjUtil.compareGE(this.#pos, sys.Str.size(this.#name))) {
          break;
        }
        else {
          throw this.err("expected COMMA");
        }
        ;
      }
      ;
    }
    ;
    return rdns;
  }

  parseType() {
    let startIdx = this.#pos;
    let buf = sys.StrBuf.make();
    if (sys.Int.isAlpha(this.#cur)) {
      while ((sys.Int.isAlpha(this.#cur) || sys.Int.isDigit(this.#cur) || sys.ObjUtil.equals(this.#cur, 45))) {
        buf.addChar(this.#cur);
        this.consume();
      }
      ;
      let key = sys.Str.upper(buf.toStr());
      return sys.ObjUtil.coerce(((this$) => { let $_u24 = Rdn.keywords().get(key); if ($_u24 != null) return $_u24; throw this$.err(sys.Str.plus("Must use OID for type ", key), startIdx); })(this), asn1.AsnOid.type$);
    }
    else {
      if (sys.Int.isDigit(this.#cur)) {
        buf.add(this.number());
        while (sys.ObjUtil.equals(this.#cur, 46)) {
          buf.addChar(this.consume(sys.ObjUtil.coerce(46, sys.Int.type$.toNullable())));
          buf.add(this.number());
        }
        ;
        return asn1.Asn.oid(buf.toStr());
      }
      else {
        throw this.err("Invalid attribute type");
      }
      ;
    }
    ;
  }

  number() {
    if (!sys.Int.isDigit(this.#cur)) {
      throw this.err("expected number");
    }
    ;
    let start = this.#pos;
    if (sys.ObjUtil.equals(this.#cur, 48)) {
      return sys.Int.toChar(this.consume(sys.ObjUtil.coerce(48, sys.Int.type$.toNullable())));
    }
    ;
    while (sys.Int.isDigit(this.#cur)) {
      this.consume();
    }
    ;
    return sys.Str.getRange(this.#name, sys.Range.make(start, this.#pos, true));
  }

  parseVal() {
    if (sys.ObjUtil.equals(this.#cur, 35)) {
      return this.hexstring();
    }
    ;
    let start = this.#pos;
    if (this.isLeadChar()) {
      this.consume();
    }
    else {
      if (sys.ObjUtil.equals(this.#cur, DnParser.ESC())) {
        this.consumePair();
      }
      else {
        return "";
      }
      ;
    }
    ;
    let prevValidEnd = true;
    while (true) {
      if (sys.ObjUtil.equals(this.#cur, DnParser.ESC())) {
        this.consumePair();
        (prevValidEnd = true);
      }
      else {
        if (this.isTrailChar()) {
          this.consume();
          (prevValidEnd = true);
        }
        else {
          if (this.isStringChar()) {
            this.consume();
            (prevValidEnd = false);
          }
          else {
            break;
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    if (!prevValidEnd) {
      throw this.err("Invalid trailing char", sys.Int.minus(this.#pos, 1));
    }
    ;
    return sys.Str.getRange(this.#name, sys.Range.make(start, this.#pos, true));
  }

  hexstring() {
    let start = this.#pos;
    this.consume(sys.ObjUtil.coerce(35, sys.Int.type$.toNullable()));
    this.consumeHexPair();
    while (this.isHex()) {
      this.consumeHexPair();
    }
    ;
    return sys.Str.getRange(this.#name, sys.Range.make(start, this.#pos, true));
  }

  isHex() {
    return (sys.Int.isDigit(this.#cur) || (sys.ObjUtil.compareLE(65, sys.Int.upper(this.#cur)) && sys.ObjUtil.compareLE(sys.Int.upper(this.#cur), 70)));
  }

  consumeHexPair() {
    const this$ = this;
    sys.Int.times(2, (it) => {
      if (!this$.isHex()) {
        throw this$.err("expected hex pair");
      }
      ;
      this$.consume();
      return;
    });
    return;
  }

  isLeadChar(c) {
    if (c === undefined) c = this.#cur;
    return ((sys.ObjUtil.compareLE(1, c) && sys.ObjUtil.compareLE(c, 31)) || sys.ObjUtil.equals(c, 33) || (sys.ObjUtil.compareLE(36, c) && sys.ObjUtil.compareLE(c, 42)) || (sys.ObjUtil.compareLE(45, c) && sys.ObjUtil.compareLE(c, 58)) || this.isCommonChar());
  }

  isStringChar(c) {
    if (c === undefined) c = this.#cur;
    return ((sys.ObjUtil.compareLE(1, c) && sys.ObjUtil.compareLE(c, 33)) || (sys.ObjUtil.compareLE(35, c) && sys.ObjUtil.compareLE(c, 42)) || (sys.ObjUtil.compareLE(45, c) && sys.ObjUtil.compareLE(c, 58)) || this.isCommonChar());
  }

  isTrailChar(c) {
    if (c === undefined) c = this.#cur;
    return ((sys.ObjUtil.compareLE(1, c) && sys.ObjUtil.compareLE(c, 31)) || sys.ObjUtil.equals(c, 33) || (sys.ObjUtil.compareLE(35, c) && sys.ObjUtil.compareLE(c, 42)) || this.isCommonChar());
  }

  isCommonChar(c) {
    if (c === undefined) c = this.#cur;
    return ((sys.ObjUtil.compareLE(45, c) && sys.ObjUtil.compareLE(c, 58)) || sys.ObjUtil.equals(c, 61) || (sys.ObjUtil.compareLE(63, c) && sys.ObjUtil.compareLE(c, 91)) || sys.ObjUtil.compareLE(93, c));
  }

  consumePair() {
    this.consume(sys.ObjUtil.coerce(DnParser.ESC(), sys.Int.type$.toNullable()));
    let $_u25 = this.#cur;
    if (sys.ObjUtil.equals($_u25, DnParser.ESC()) || sys.ObjUtil.equals($_u25, DnParser.SP()) || sys.ObjUtil.equals($_u25, 35) || sys.ObjUtil.equals($_u25, 61) || sys.ObjUtil.equals($_u25, 34) || sys.ObjUtil.equals($_u25, 43) || sys.ObjUtil.equals($_u25, 44) || sys.ObjUtil.equals($_u25, 59) || sys.ObjUtil.equals($_u25, 60) || sys.ObjUtil.equals($_u25, 62)) {
      this.consume();
    }
    else {
      this.consumeHexPair();
    }
    ;
    return;
  }

  err(msg,p) {
    if (p === undefined) p = this.#pos;
    return sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", msg), ". [pos="), sys.ObjUtil.coerce(p, sys.Obj.type$.toNullable())), ", char='"), sys.Int.toChar(sys.Str.getSafe(this.#name, p))), "'] "), this.#name));
  }

  peek(n) {
    if (n === undefined) n = 1;
    return sys.Str.getSafe(this.#name, sys.Int.plus(this.#pos, n), -1);
  }

  consume(c) {
    if (c === undefined) c = null;
    let temp = this.#cur;
    if ((c != null && sys.ObjUtil.compareNE(this.#cur, c))) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expected '", sys.Int.toChar(sys.ObjUtil.coerce(c, sys.Int.type$))), "' but got '"), sys.Int.toChar(this.#cur)), "' at pos "), sys.ObjUtil.coerce(this.#pos, sys.Obj.type$.toNullable())));
    }
    ;
    this.#pos = sys.Int.increment(this.#pos);
    this.#cur = sys.Str.getSafe(this.#name, this.#pos, -1);
    return temp;
  }

  static static$init() {
    DnParser.#ESC = 92;
    DnParser.#SP = 32;
    return;
  }

}

class Pkcs1 {
  constructor() {
    const this$ = this;
  }

  typeof() { return Pkcs1.type$; }

  static #pkcs_1 = undefined;

  static pkcs_1() {
    if (Pkcs1.#pkcs_1 === undefined) {
      Pkcs1.static$init();
      if (Pkcs1.#pkcs_1 === undefined) Pkcs1.#pkcs_1 = null;
    }
    return Pkcs1.#pkcs_1;
  }

  static #rsaEncryption = undefined;

  static rsaEncryption() {
    if (Pkcs1.#rsaEncryption === undefined) {
      Pkcs1.static$init();
      if (Pkcs1.#rsaEncryption === undefined) Pkcs1.#rsaEncryption = null;
    }
    return Pkcs1.#rsaEncryption;
  }

  static #sha1WithRSAEncryption = undefined;

  static sha1WithRSAEncryption() {
    if (Pkcs1.#sha1WithRSAEncryption === undefined) {
      Pkcs1.static$init();
      if (Pkcs1.#sha1WithRSAEncryption === undefined) Pkcs1.#sha1WithRSAEncryption = null;
    }
    return Pkcs1.#sha1WithRSAEncryption;
  }

  static #sha256WithRSAEncryption = undefined;

  static sha256WithRSAEncryption() {
    if (Pkcs1.#sha256WithRSAEncryption === undefined) {
      Pkcs1.static$init();
      if (Pkcs1.#sha256WithRSAEncryption === undefined) Pkcs1.#sha256WithRSAEncryption = null;
    }
    return Pkcs1.#sha256WithRSAEncryption;
  }

  static #sha384WithRSAEncryption = undefined;

  static sha384WithRSAEncryption() {
    if (Pkcs1.#sha384WithRSAEncryption === undefined) {
      Pkcs1.static$init();
      if (Pkcs1.#sha384WithRSAEncryption === undefined) Pkcs1.#sha384WithRSAEncryption = null;
    }
    return Pkcs1.#sha384WithRSAEncryption;
  }

  static #sha512WithRSAEncryption = undefined;

  static sha512WithRSAEncryption() {
    if (Pkcs1.#sha512WithRSAEncryption === undefined) {
      Pkcs1.static$init();
      if (Pkcs1.#sha512WithRSAEncryption === undefined) Pkcs1.#sha512WithRSAEncryption = null;
    }
    return Pkcs1.#sha512WithRSAEncryption;
  }

  static sign(key,data,sigAlg) {
    let digest = sys.ObjUtil.coerce(null, sys.Str.type$.toNullable());
    let $_u26 = sigAlg.id();
    if (sys.ObjUtil.equals($_u26, Pkcs1.sha1WithRSAEncryption())) {
      (digest = "SHA1");
    }
    else if (sys.ObjUtil.equals($_u26, Pkcs1.sha256WithRSAEncryption())) {
      (digest = "SHA256");
    }
    else if (sys.ObjUtil.equals($_u26, Pkcs1.sha384WithRSAEncryption())) {
      (digest = "SHA384");
    }
    else if (sys.ObjUtil.equals($_u26, Pkcs1.sha512WithRSAEncryption())) {
      (digest = "SHA512");
    }
    else {
      throw sys.ArgErr.make(sys.Str.plus("Unsupported algorithm id: ", sigAlg.id()));
    }
    ;
    return key.sign(data, sys.ObjUtil.coerce(digest, sys.Str.type$));
  }

  static static$init() {
    Pkcs1.#pkcs_1 = asn1.Asn.oid("1.2.840.113549.1.1");
    Pkcs1.#rsaEncryption = asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", Pkcs1.#pkcs_1.oidStr()), ".1"));
    Pkcs1.#sha1WithRSAEncryption = asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", Pkcs1.#pkcs_1.oidStr()), ".5"));
    Pkcs1.#sha256WithRSAEncryption = asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", Pkcs1.#pkcs_1.oidStr()), ".11"));
    Pkcs1.#sha384WithRSAEncryption = asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", Pkcs1.#pkcs_1.oidStr()), ".12"));
    Pkcs1.#sha512WithRSAEncryption = asn1.Asn.oid(sys.Str.plus(sys.Str.plus("", Pkcs1.#pkcs_1.oidStr()), ".13"));
    return;
  }

}

class AlgId extends asn1.AsnSeq {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AlgId.type$; }

  static fromOpts(opts) {
    let optAlg = ((this$) => { let $_u27 = opts.get("algorithm"); if ($_u27 != null) return $_u27; return "sha256WithRSAEncryption"; })(this);
    let $_u28 = optAlg;
    if (sys.ObjUtil.equals($_u28, "sha256WithRSAEncryption")) {
      return AlgId.makeSpec(Pkcs1.sha256WithRSAEncryption());
    }
    else if (sys.ObjUtil.equals($_u28, "sha384WithRSAEncryption")) {
      return AlgId.makeSpec(Pkcs1.sha384WithRSAEncryption());
    }
    else if (sys.ObjUtil.equals($_u28, "sha512WithRSAEncryption")) {
      return AlgId.makeSpec(Pkcs1.sha512WithRSAEncryption());
    }
    else {
      throw sys.UnsupportedErr.make(sys.Str.plus("Unsupported PKCS1 signature algorithm: ", optAlg));
    }
    ;
  }

  static makeSpec(algorithm,parameters) {
    const $self = new AlgId();
    AlgId.makeSpec$($self,algorithm,parameters);
    return $self;
  }

  static makeSpec$($self,algorithm,parameters) {
    if (parameters === undefined) parameters = asn1.Asn.Null();
    asn1.AsnSeq.make$($self, sys.List.make(asn1.AsnTag.type$, [asn1.AsnTag.univSeq()]), asn1.AsnItem.type$.emptyList());
    let vals = sys.List.make(asn1.AsnObj.type$, [algorithm]);
    if (parameters != null) {
      vals.add(sys.ObjUtil.coerce(parameters, asn1.AsnObj.type$));
    }
    ;
    $self.__val(((this$) => { let $_u29 = asn1.AsnColl.toItems(vals); if ($_u29 == null) return null; return sys.ObjUtil.toImmutable(asn1.AsnColl.toItems(vals)); })($self));
    return;
  }

  static make(items) {
    const $self = new AlgId();
    AlgId.make$($self,items);
    return $self;
  }

  static make$($self,items) {
    asn1.AsnSeq.make$($self, sys.List.make(asn1.AsnTag.type$, [asn1.AsnTag.univSeq()]), items);
    return;
  }

  id() {
    return sys.ObjUtil.coerce(this.vals().get(0), asn1.AsnOid.type$);
  }

  params() {
    return this.vals().getSafe(1);
  }

  algorithm() {
    const this$ = this;
    return Pkcs1.type$.fields().find((it) => {
      return sys.ObjUtil.equals(it.get(), this$.id());
    }).name();
  }

}

class Dn extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Dn.type$; }

  #rdns = null;

  rdns() { return this.#rdns; }

  __rdns(it) { if (it === undefined) return this.#rdns; else this.#rdns = it; }

  static fromStr(name) {
    return DnParser.make(name).dn();
  }

  static decode(der) {
    return Dn.fromSeq(sys.ObjUtil.coerce(asn1.BerReader.make(der.in()).readObj(), asn1.AsnSeq.type$));
  }

  static fromSeq(rdnSeq) {
    const this$ = this;
    let rdns = sys.List.make(Rdn.type$);
    rdnSeq.vals().each(sys.ObjUtil.coerce((set$) => {
      let seq = sys.ObjUtil.coerce(set$.vals().first(), asn1.AsnSeq.type$);
      rdns.add(Rdn.make(sys.ObjUtil.coerce(seq.vals().get(0), asn1.AsnOid.type$), sys.ObjUtil.coerce(sys.ObjUtil.trap(seq.vals().get(1),"val", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$)));
      return;
    }, sys.Type.find("|asn1::AsnObj,sys::Int->sys::Void|")));
    return Dn.make(rdns);
  }

  static make(rdns) {
    const $self = new Dn();
    Dn.make$($self,rdns);
    return $self;
  }

  static make$($self,rdns) {
    $self.#rdns = sys.ObjUtil.coerce(((this$) => { let $_u30 = rdns; if ($_u30 == null) return null; return sys.ObjUtil.toImmutable(rdns); })($self), sys.Type.find("cryptoJava::Rdn[]"));
    return;
  }

  get(index) {
    return this.#rdns.get(index);
  }

  asn() {
    const this$ = this;
    let items = sys.List.make(asn1.AsnObj.type$);
    this.#rdns.each((rdn) => {
      items.add(rdn.asn());
      return;
    });
    return asn1.Asn.seq(items);
  }

  toStr() {
    const this$ = this;
    let buf = sys.StrBuf.make();
    this.#rdns.each((rdn,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        buf.addChar(44);
      }
      ;
      buf.add(rdn.toStr());
      return;
    });
    return buf.toStr();
  }

}

class DnTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DnTest.type$; }

  testRfc4514Type() {
    const this$ = this;
    this.verifyEq("CN", this.parse("cn=foo").first().shortName());
    this.verifyNull(this.parse("0.0.40.9999=foo").first().shortName());
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.parse("00.1=foo");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.parse("0.01=foo");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.parse("0.0.=foo");
      return;
    });
    return;
  }

  testRfc4514Val() {
    this.verifyEq("foo", this.parse("cn=foo").first().val());
    return;
  }

  parse(name) {
    return DnParser.make(name).parse();
  }

  static make() {
    const $self = new DnTest();
    DnTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class JwkTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JwkTest.type$; }

  testJwk() {
    let test = sys.Map.__fromLiteral(["keys"], [sys.List.make(sys.Type.find("[sys::Str:sys::Str]"), [sys.Map.__fromLiteral(["alg","e","kid","kty","n","use"], ["RS256","AQAB","wU99adUipEErJshyqJ6vE+q+aQt0K3g5oyoxy2kKvJo=","RSA","nWxKIyGg_t1KZ56lhfd2i9M_BmiYOMfzUhGSf7sOhlkiTxVQMCSYQiS9SU2o4UMYV2ZykBhuGduPxZsvvcwNsB37ubFpBzoi3MJR0C9YOYGju5PrFhClSKeIJznI6e2_fs7TepJxlF-Wtj4Oa8-mN_Z7ydUg6nToqgRKWsXtAKVj1fX_m0pEamnr0STKF-Z58FrZ8rtul__hBAHsTRxV0tLqNCHIC0zAOPxhZlt7OCbJvhnr68R4GyIi4hyWR6LH--BxY_LebtM67qDdIRBOpkhG6Gmj4HXw6xFroVRzzfYVdJKQHpqXmF-4s93g_ETf5C5nF1B_ZHVaCV9mrv-alw","sig"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), sys.Map.__fromLiteral(["alg","e","kid","kty","n","use"], ["RS256","AQAB","hEbJ9Cd2TKaOUMAHj67J1O4bjN6wDxa2l+W1l3Nnh6I=","RSA","sK5zlF0epYoBXE6jb4IuFrMhex88bC7gjjrl8tppIqbuV7hozLRNDFWlHdOYwtB0_Q1T6pvmHvoxYLPxv4aabawXgZ_Ca1K4NV5FBmOFSHjk_SltA6FLGxCAg61hdXMegTSiuANhqO3kYUGc0JnYOdc_6UR6NIfKsNxik5e0m82xsslpsOiqSJSugEswQxa5yEjs0gx6BVuxBVPm7g8jzRg9VL51D8A8eOfluv_cCAmL-4TYV8NlzTQ945_-wDgnJeRhzaEcmyHtSKNEM4bFXjzJPnKmUPFSxuGFy_JjBb_qGnvKWeP4-HV2TkcOpAZoGjgcAGs3lzabJxFbsaOwEw","sig"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), sys.Map.__fromLiteral(["kty","use","crv","kid","x","y","alg"], ["EC","sig","P-256","abcd","BBeYJFS8V8j-hnvrLzDXgswQ1WrDyKmWunhucquXr2c","DLr-IapghPc0cdarUpjbrW0U6ZbnqX7TQJdhRoR-xco","ES256"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), sys.Map.__fromLiteral(["kty","kid","k","alg"], ["oct","jwtId","badSecret","HS384"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))])], sys.Type.find("sys::Str"), sys.Type.find("[sys::Str:sys::Str][]"));
    let jwks = JJwk.importJwks(test);
    this.verifyEq(jwks.get(0).meta().get(JwkConst.KeyIdHeader()), "wU99adUipEErJshyqJ6vE+q+aQt0K3g5oyoxy2kKvJo=");
    this.verifyEq(jwks.get(1).meta().get(JwkConst.KeyIdHeader()), "hEbJ9Cd2TKaOUMAHj67J1O4bjN6wDxa2l+W1l3Nnh6I=");
    this.verifyEq(jwks.get(2).meta().get(JwkConst.KeyIdHeader()), "abcd");
    this.verifyEq(jwks.get(3).meta().get(JwkConst.KeyIdHeader()), "jwtId");
    let $crypto = crypto.Crypto.cur();
    let pair = $crypto.genKeyPair("RSA", 2048);
    let pub = pair.pub();
    let jwk = JJwk.toJwk(pub, "SHA256", sys.Map.__fromLiteral(["customMeta"], ["Hello"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyEq(jwk.meta().get(JwkConst.KeyTypeHeader()), "RSA");
    this.verifyEq(jwk.meta().get(JwkConst.AlgorithmHeader()), "RS256");
    this.verifyEq(jwk.meta().get("customMeta"), "Hello");
    let ecPubPem = "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEI59TOAdnJ7uPgPOdIxj+BhWSQBXK\nS3lsRZJwj5eIYArwUkS9UhkONUGesEk9FQLC2BLzqsegWXWQF9uNf2s6eA==\n-----END PUBLIC KEY-----";
    let myPubKey = sys.ObjUtil.as($crypto.loadPem(sys.Str.in(ecPubPem), "EC"), crypto.PubKey.type$);
    (jwk = JJwk.toJwk(sys.ObjUtil.coerce(myPubKey, crypto.Key.type$), "SHA384", sys.Map.__fromLiteral(["kid"], ["1234"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(jwk.meta().get(JwkConst.KeyTypeHeader()), "EC");
    this.verifyEq(jwk.meta().get(JwkConst.AlgorithmHeader()), "ES384");
    this.verifyEq(jwk.meta().get(JwkConst.KeyIdHeader()), "1234");
    let pair2 = $crypto.genKeyPair("EC", 256);
    let pub2 = pair2.pub();
    (jwk = JJwk.toJwk(pub2, "SHA256", sys.Map.__fromLiteral(["kid"], ["efgh"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(jwk.meta().get(JwkConst.KeyTypeHeader()), "EC");
    this.verifyEq(jwk.meta().get(JwkConst.AlgorithmHeader()), "ES256");
    this.verifyEq(jwk.meta().get(JwkConst.KeyIdHeader()), "efgh");
    (jwk = JJwk.toJwk(jwks.get(3).key(), "SHA256", sys.Map.__fromLiteral(["kid"], ["ijkl"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(jwk.meta().get(JwkConst.KeyTypeHeader()), "oct");
    this.verifyEq(jwk.meta().get(JwkConst.AlgorithmHeader()), "HS256");
    this.verifyEq(jwk.meta().get(JwkConst.KeyIdHeader()), "ijkl");
    this.verifyTrue(jwk.key().encoded().bytesEqual(sys.Str.toBuf("badSecret")));
    return;
  }

  static make() {
    const $self = new JwkTest();
    JwkTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

const p = sys.Pod.add$('cryptoJava');
const xp = sys.Param.noParams$();
let m;
JCertSigner.type$ = p.at$('JCertSigner','sys::Obj',['crypto::CertSigner'],{},8192,JCertSigner);
V3Ext.type$ = p.at$('V3Ext','asn1::AsnSeq',[],{'sys::NoDoc':""},8194,V3Ext);
BasicConstraints.type$ = p.at$('BasicConstraints','cryptoJava::V3Ext',[],{'sys::NoDoc':""},8194,BasicConstraints);
X509.type$ = p.at$('X509','sys::Obj',['crypto::Cert'],{},8706,X509);
JCsr.type$ = p.at$('JCsr','sys::Obj',['crypto::Csr'],{},8194,JCsr);
JCrypto.type$ = p.at$('JCrypto','sys::Obj',['crypto::Crypto'],{},8194,JCrypto);
JJwk.type$ = p.at$('JJwk','sys::Obj',['crypto::Jwk'],{},8194,JJwk);
JwkConst.type$ = p.am$('JwkConst','sys::Obj',[],{},385,JwkConst);
JwaConst.type$ = p.am$('JwaConst','sys::Obj',[],{},385,JwaConst);
JwsKeyType.type$ = p.at$('JwsKeyType','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},170,JwsKeyType);
JwsUse.type$ = p.at$('JwsUse','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},170,JwsUse);
JwPubKey.type$ = p.am$('JwPubKey','sys::Obj',[],{},385,JwPubKey);
JwRsaPubKey.type$ = p.at$('JwRsaPubKey','sys::Obj',['cryptoJava::JwPubKey','cryptoJava::JwaConst'],{'sys::NoDoc':""},128,JwRsaPubKey);
JwEcPubKey.type$ = p.at$('JwEcPubKey','sys::Obj',['cryptoJava::JwPubKey','cryptoJava::JwaConst'],{},128,JwEcPubKey);
JwHmacKey.type$ = p.at$('JwHmacKey','sys::Obj',['cryptoJava::JwaConst'],{},128,JwHmacKey);
JKeyPair.type$ = p.at$('JKeyPair','sys::Obj',['crypto::KeyPair'],{},8194,JKeyPair);
JKey.type$ = p.at$('JKey','sys::Obj',['crypto::Key'],{},8707,JKey);
JPrivKey.type$ = p.at$('JPrivKey','cryptoJava::JKey',['crypto::PrivKey'],{},8706,JPrivKey);
JPubKey.type$ = p.at$('JPubKey','cryptoJava::JKey',['crypto::PubKey'],{},8706,JPubKey);
JMacKey.type$ = p.at$('JMacKey','sys::Obj',['crypto::MacKey'],{'sys::NoDoc':""},8706,JMacKey);
JKeyStore.type$ = p.at$('JKeyStore','sys::Obj',['crypto::KeyStore'],{},8194,JKeyStore);
JKeyStoreEntry.type$ = p.at$('JKeyStoreEntry','sys::Obj',['crypto::KeyStoreEntry'],{},8194,JKeyStoreEntry);
JPrivKeyEntry.type$ = p.at$('JPrivKeyEntry','cryptoJava::JKeyStoreEntry',['crypto::PrivKeyEntry'],{},8194,JPrivKeyEntry);
JTrustEntry.type$ = p.at$('JTrustEntry','cryptoJava::JKeyStoreEntry',['crypto::TrustEntry'],{},8194,JTrustEntry);
JDigest.type$ = p.at$('JDigest','sys::Obj',['crypto::Digest'],{},8706,JDigest);
PemConst.type$ = p.am$('PemConst','sys::Obj',[],{},8449,PemConst);
PemLabel.type$ = p.at$('PemLabel','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,PemLabel);
PemWriter.type$ = p.at$('PemWriter','sys::Obj',['cryptoJava::PemConst'],{},8192,PemWriter);
PemReader.type$ = p.at$('PemReader','sys::Obj',['cryptoJava::PemConst'],{},8192,PemReader);
Rdn.type$ = p.at$('Rdn','sys::Obj',[],{},8194,Rdn);
DnParser.type$ = p.at$('DnParser','sys::Obj',[],{},8192,DnParser);
Pkcs1.type$ = p.am$('Pkcs1','sys::Obj',[],{},8451,Pkcs1);
AlgId.type$ = p.at$('AlgId','asn1::AsnSeq',[],{},8194,AlgId);
Dn.type$ = p.at$('Dn','sys::Obj',[],{},8194,Dn);
DnTest.type$ = p.at$('DnTest','sys::Test',[],{},8192,DnTest);
JwkTest.type$ = p.at$('JwkTest','sys::Test',[],{},8192,JwkTest);
JCertSigner.type$.af$('csr',67586,'cryptoJava::JCsr',{}).af$('caPrivKey',67584,'crypto::PrivKey?',{}).af$('subjectDn',67584,'cryptoJava::Dn',{}).af$('issuerDn',67584,'cryptoJava::Dn',{}).af$('serialNumber',67584,'sys::Int',{}).af$('_notBefore',67584,'sys::DateTime',{}).af$('_notAfter',67584,'sys::DateTime',{}).af$('sigAlg',67584,'cryptoJava::AlgId',{}).af$('subjectAltNames',67584,'asn1::AsnCollBuilder',{}).af$('exts',67584,'cryptoJava::V3Ext[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('csr','cryptoJava::JCsr',false)]),{}).am$('ca',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('caPrivKey','crypto::PrivKey',false),new sys.Param('caCert','crypto::Cert',false)]),{}).am$('notBefore',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('date','sys::Date',false)]),{}).am$('notAfter',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('date','sys::Date',false)]),{}).am$('signWith',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('opts','[sys::Str:sys::Obj]',false)]),{}).am$('sign',271360,'crypto::Cert',xp,{}).am$('validate',2048,'sys::Void',xp,{}).am$('finish',2048,'sys::Void',xp,{}).am$('asn',8192,'asn1::AsnSeq',xp,{}).am$('buildTbsCert',2048,'asn1::AsnSeq',xp,{}).am$('validity',34818,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false)]),{}).am$('subjectKeyId',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('authKeyId',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('basicConstraints',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('ca','sys::Bool',true),new sys.Param('pathLenConstraint','sys::Int?',true)]),{}).am$('keyUsage',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('bits','sys::Buf',false)]),{}).am$('subjectAltName',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Obj',false)]),{}).am$('extendedKeyUsage',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('oids','sys::Str[]',false)]),{});
V3Ext.type$.am$('makeSpec',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('extnId','asn1::AsnOid',false),new sys.Param('val','asn1::AsnObj',false),new sys.Param('critical','sys::Bool',true)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('items','asn1::AsnObj[]',false)]),{}).am$('extnId',8192,'asn1::AsnOid',xp,{}).am$('isCritical',8192,'sys::Bool',xp,{}).am$('extnVal',8192,'sys::Buf',xp,{});
BasicConstraints.type$.am$('basicConstraints',40966,'cryptoJava::BasicConstraints?',sys.List.make(sys.Param.type$,[new sys.Param('isCa','sys::Bool',false),new sys.Param('maxPathLen','sys::Int?',true)]),{}).am$('makeSpec',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('extnId','asn1::AsnOid',false),new sys.Param('extnVal','asn1::AsnColl',false),new sys.Param('critical','sys::Bool',true)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('items','asn1::AsnObj[]',false)]),{}).am$('isCa',8192,'sys::Bool',xp,{}).am$('maxPath',8192,'sys::Int?',xp,{});
X509.type$.am$('load',40962,'cryptoJava::X509[]',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('loadCertsForUri',40962,'cryptoJava::X509[]',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('subject',271360,'sys::Str',xp,{}).am$('issuer',271360,'sys::Str',xp,{}).am$('certType',271360,'sys::Str',xp,{}).am$('encoded',271360,'sys::Buf',xp,{}).am$('pub',271360,'crypto::PubKey',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('serialNum',8192,'sys::Buf',xp,{}).am$('notBefore',8192,'sys::Date',xp,{}).am$('notAfter',8192,'sys::Date',xp,{}).am$('isSelfSigned',271360,'sys::Bool',xp,{}).am$('isCA',271360,'sys::Bool',xp,{}).am$('make',139268,'sys::Void',xp,{});
JCsr.type$.af$('pub',336898,'crypto::PubKey',{}).af$('priv',65666,'crypto::PrivKey?',{}).af$('subject',336898,'sys::Str',{}).af$('opts',336898,'[sys::Str:sys::Obj]',{}).af$('sigAlg',67586,'cryptoJava::AlgId',{}).am$('decode',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('der','sys::Buf',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('keys','crypto::KeyPair',false),new sys.Param('subjectDn','sys::Str',false),new sys.Param('opts','[sys::Str:sys::Obj]',false)]),{}).am$('pem',8192,'sys::Str',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('gen',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('close','sys::Bool',true)]),{}).am$('asn',8192,'asn1::AsnSeq',xp,{}).am$('buildReqInfo',2048,'asn1::AsnSeq',xp,{}).am$('sign',2048,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('reqInfo','asn1::AsnSeq',false)]),{});
JCrypto.type$.am$('digest',271360,'cryptoJava::JDigest',sys.List.make(sys.Param.type$,[new sys.Param('algorithm','sys::Str',false)]),{}).am$('genCsr',271360,'cryptoJava::JCsr',sys.List.make(sys.Param.type$,[new sys.Param('keys','crypto::KeyPair',false),new sys.Param('subjectDn','sys::Str',false),new sys.Param('opts','[sys::Str:sys::Obj]',true)]),{}).am$('certSigner',271360,'crypto::CertSigner',sys.List.make(sys.Param.type$,[new sys.Param('csr','crypto::Csr',false)]),{}).am$('genKeyPair',271360,'cryptoJava::JKeyPair',sys.List.make(sys.Param.type$,[new sys.Param('algorithm','sys::Str',false),new sys.Param('bits','sys::Int',false)]),{}).am$('loadX509',271360,'cryptoJava::X509[]',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('loadCertsForUri',271360,'cryptoJava::X509[]',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('loadKeyStore',271360,'cryptoJava::JKeyStore',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File?',true),new sys.Param('opts','[sys::Str:sys::Obj]',true)]),{}).am$('loadPem',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('algorithm','sys::Str',true)]),{}).am$('loadJwk',271360,'crypto::Jwk?',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:sys::Obj]',false)]),{}).am$('loadJwksForUri',271360,'crypto::Jwk[]',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('maxJwKeys','sys::Int',true)]),{}).am$('make',139268,'sys::Void',xp,{});
JJwk.type$.af$('meta',336898,'[sys::Str:sys::Obj]',{}).af$('key',336898,'crypto::Key',{}).am$('toStr',271360,'sys::Str',xp,{}).am$('kid',2048,'sys::Str?',xp,{}).am$('kty',2048,'sys::Str',xp,{}).am$('alg',2048,'sys::Str',xp,{}).am$('digestAlgorithm',2048,'sys::Str',xp,{}).am$('use',2048,'sys::Str?',xp,{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:sys::Obj]',false)]),{}).am$('importJwksUri',40962,'crypto::Jwk[]',sys.List.make(sys.Param.type$,[new sys.Param('jwksUri','sys::Uri',false),new sys.Param('maxJwKeys','sys::Int?',true)]),{}).am$('importJwks',32898,'crypto::Jwk[]',sys.List.make(sys.Param.type$,[new sys.Param('jwks','[sys::Str:sys::Obj]',false),new sys.Param('maxJwKeys','sys::Int?',true)]),{}).am$('toJwk',40962,'crypto::Jwk',sys.List.make(sys.Param.type$,[new sys.Param('key','crypto::Key',false),new sys.Param('digest','sys::Str',false),new sys.Param('meta','[sys::Str:sys::Obj]',true)]),{'sys::NoDoc':""});
JwkConst.type$.af$('TypeHeader',106498,'sys::Str',{}).af$('KeyTypeHeader',106498,'sys::Str',{}).af$('AlgorithmHeader',106498,'sys::Str',{}).af$('KeyIdHeader',106498,'sys::Str',{}).af$('UseHeader',106498,'sys::Str',{}).af$('ContentTypeHeader',106498,'sys::Str',{}).am$('static$init',165890,'sys::Void',xp,{});
JwaConst.type$.af$('CurveParameter',106498,'sys::Str',{}).af$('XCoordParameter',106498,'sys::Str',{}).af$('YCoordParameter',106498,'sys::Str',{}).af$('ModulusParameter',106498,'sys::Str',{}).af$('ExponentParameter',106498,'sys::Str',{}).af$('KeyValueParameter',106498,'sys::Str',{}).am$('static$init',165890,'sys::Void',xp,{});
JwsKeyType.type$.af$('oct',106506,'cryptoJava::JwsKeyType',{}).af$('rsa',106506,'cryptoJava::JwsKeyType',{}).af$('ec',106506,'cryptoJava::JwsKeyType',{}).af$('none',106506,'cryptoJava::JwsKeyType',{}).af$('vals',106498,'cryptoJava::JwsKeyType[]',{}).am$('fromParameters',40966,'cryptoJava::JwsKeyType?',sys.List.make(sys.Param.type$,[new sys.Param('key','[sys::Str:sys::Obj]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'cryptoJava::JwsKeyType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
JwsUse.type$.af$('sig',106506,'cryptoJava::JwsUse',{}).af$('enc',106506,'cryptoJava::JwsUse',{}).af$('vals',106498,'cryptoJava::JwsUse[]',{}).am$('fromParameters',40966,'cryptoJava::JwsUse?',sys.List.make(sys.Param.type$,[new sys.Param('key','[sys::Str:sys::Obj]',false)]),{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'cryptoJava::JwsUse?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
JwPubKey.type$.am$('pem',40962,'crypto::PubKey?',sys.List.make(sys.Param.type$,[new sys.Param('der','sys::Buf',false),new sys.Param('algorithm','sys::Str',false)]),{});
JwRsaPubKey.type$.af$('algorithm',106498,'sys::Str',{}).am$('getKey',40962,'crypto::Key',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:sys::Obj]',false)]),{}).am$('jwkToBuf',41474,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('mod','sys::Str',false),new sys.Param('exp','sys::Str',false)]),{}).am$('bufToJwk',41474,'[sys::Str:sys::Obj]',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Buf',false)]),{}).am$('der',34818,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('jwk','[sys::Str:sys::Obj]',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
JwEcPubKey.type$.af$('algorithm',106498,'sys::Str',{}).am$('getKey',40962,'crypto::Key',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:sys::Obj]',false)]),{}).am$('jwkToBuf',41474,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Str',false),new sys.Param('y','sys::Str',false),new sys.Param('curve','sys::Str',false)]),{}).am$('bufToJwk',41474,'[sys::Str:sys::Obj]',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Buf',false)]),{}).am$('der',34818,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('jwk','[sys::Str:sys::Obj]',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
JwHmacKey.type$.am$('getKey',40962,'crypto::Key',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:sys::Obj]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
JKeyPair.type$.af$('priv',336898,'cryptoJava::JPrivKey',{}).af$('pub',336898,'cryptoJava::JPubKey',{}).am$('genKeyPair',41474,'cryptoJava::JKeyPair',sys.List.make(sys.Param.type$,[new sys.Param('algorithm','sys::Str',false),new sys.Param('bits','sys::Int',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('priv','cryptoJava::JPrivKey',false),new sys.Param('pub','cryptoJava::JPubKey',false)]),{});
JKey.type$.am$('make',139268,'sys::Void',xp,{});
JPrivKey.type$.am$('decode',40962,'cryptoJava::JPrivKey',sys.List.make(sys.Param.type$,[new sys.Param('der','sys::Buf',false),new sys.Param('algorithm','sys::Str',false)]),{}).am$('algorithm',271360,'sys::Str',xp,{}).am$('format',271360,'sys::Str?',xp,{}).am$('encoded',271360,'sys::Buf?',xp,{}).am$('keySize',271360,'sys::Int',xp,{}).am$('sign',271360,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Buf',false),new sys.Param('digest','sys::Str',false)]),{}).am$('decrypt',271360,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Buf',false),new sys.Param('padding','sys::Str',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
JPubKey.type$.am$('decode',40962,'cryptoJava::JPubKey',sys.List.make(sys.Param.type$,[new sys.Param('der','sys::Buf',false),new sys.Param('algorithm','sys::Str',false)]),{}).am$('algorithm',271360,'sys::Str',xp,{}).am$('format',271360,'sys::Str?',xp,{}).am$('encoded',271360,'sys::Buf?',xp,{}).am$('keySize',271360,'sys::Int',xp,{}).am$('verify',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Buf',false),new sys.Param('digest','sys::Str',false),new sys.Param('signature','sys::Buf',false)]),{}).am$('encrypt',271360,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Buf',false),new sys.Param('padding','sys::Str',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
JMacKey.type$.am$('load',40962,'cryptoJava::JMacKey',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Buf',false),new sys.Param('algorithm','sys::Str',false)]),{}).am$('algorithm',271360,'sys::Str',xp,{}).am$('format',271360,'sys::Str?',xp,{}).am$('encoded',271360,'sys::Buf?',xp,{}).am$('macSize',271360,'sys::Int',xp,{}).am$('digest',271360,'sys::Buf',xp,{}).am$('update',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('updateAscii',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('updateByte',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('updateI4',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('updateI8',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('reset',271360,'sys::This',xp,{}).am$('make',139268,'sys::Void',xp,{});
JKeyStore.type$.af$('entries',65666,'concurrent::ConcurrentMap',{}).af$('format',336898,'sys::Str',{}).am$('load',41474,'cryptoJava::JKeyStore',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File?',false),new sys.Param('opts','[sys::Str:sys::Obj]',false)]),{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('format','sys::Str',false),new sys.Param('entries','concurrent::ConcurrentMap',false)]),{}).am$('aliases',271360,'sys::Str[]',xp,{}).am$('size',271360,'sys::Int',xp,{}).am$('save',271872,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('options','[sys::Str:sys::Obj]',true)]),{}).am$('get',271360,'crypto::KeyStoreEntry?',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('setPrivKey',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('privKey','crypto::PrivKey',false),new sys.Param('chain','crypto::Cert[]',false)]),{}).am$('setTrust',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('cert','crypto::Cert',false)]),{}).am$('set',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('entry','crypto::KeyStoreEntry',false)]),{}).am$('remove',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false)]),{}).am$('normAlias',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false)]),{});
JKeyStoreEntry.type$.af$('attrs',336898,'[sys::Str:sys::Str]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('attrs','[sys::Str:sys::Str]',false)]),{});
JPrivKeyEntry.type$.af$('priv',336898,'crypto::PrivKey',{}).af$('certChain',336898,'crypto::Cert[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('priv','crypto::PrivKey',false),new sys.Param('chain','crypto::Cert[]',false),new sys.Param('attrs','[sys::Str:sys::Str]',true)]),{}).am$('keyPair',271360,'cryptoJava::JKeyPair',xp,{});
JTrustEntry.type$.af$('cert',336898,'crypto::Cert',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cert','crypto::Cert',false),new sys.Param('attrs','[sys::Str:sys::Str]',true)]),{});
JDigest.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('algorithm','sys::Str',false)]),{}).am$('algorithm',271360,'sys::Str',xp,{}).am$('digestSize',271360,'sys::Int',xp,{}).am$('digest',271360,'sys::Buf',xp,{}).am$('update',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('updateAscii',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('updateByte',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('updateI4',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('updateI8',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('reset',271360,'sys::This',xp,{});
PemConst.type$.af$('DASH5',106498,'sys::Str',{}).af$('BEGIN',106498,'sys::Str',{}).af$('END',106498,'sys::Str',{}).af$('pemChars',106498,'sys::Int',{}).am$('static$init',165890,'sys::Void',xp,{});
PemLabel.type$.af$('publicKey',106506,'cryptoJava::PemLabel',{}).af$('rsaPrivKey',106506,'cryptoJava::PemLabel',{}).af$('ecPrivKey',106506,'cryptoJava::PemLabel',{}).af$('privKey',106506,'cryptoJava::PemLabel',{}).af$('cert',106506,'cryptoJava::PemLabel',{}).af$('csr',106506,'cryptoJava::PemLabel',{}).af$('vals',106498,'cryptoJava::PemLabel[]',{}).af$('text',73730,'sys::Str',{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('text','sys::Str',false)]),{}).am$('find',40962,'cryptoJava::PemLabel?',sys.List.make(sys.Param.type$,[new sys.Param('text','sys::Str',false)]),{}).am$('fromStr',40966,'cryptoJava::PemLabel?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
PemWriter.type$.af$('out',73728,'sys::OutStream',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('write',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('label','cryptoJava::PemLabel',false),new sys.Param('der','sys::Buf',false)]),{}).am$('close',8192,'sys::Void',xp,{});
PemReader.type$.af$('algorithm',67586,'sys::Str',{}).af$('in',67584,'sys::InStream',{}).af$('line',67584,'sys::Str?',{}).af$('label',67584,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('algorithm','sys::Str',false)]),{}).am$('next',8192,'sys::Obj?',xp,{}).am$('skipToBegin',2048,'sys::Bool',xp,{}).am$('parseLabel',2048,'sys::Str',xp,{}).am$('parseBase64',2048,'sys::Str',xp,{}).am$('rsaP1ToP8',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('base64','sys::Str',false)]),{}).am$('ecSEC1ToP8',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('base64','sys::Str',false)]),{}).am$('nextLine',2048,'sys::Str?',xp,{});
Rdn.type$.af$('type',73730,'asn1::AsnOid',{}).af$('val',73730,'sys::Str',{}).af$('keywords',106498,'[sys::Str:asn1::AsnOid]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','asn1::AsnOid',false),new sys.Param('val','sys::Str',false)]),{}).am$('shortName',8192,'sys::Str?',xp,{}).am$('asnVal',8192,'asn1::AsnObj',xp,{}).am$('asn',8192,'asn1::AsnSet',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
DnParser.type$.af$('name',73730,'sys::Str',{}).af$('ESC',100354,'sys::Int',{}).af$('SP',100354,'sys::Int',{}).af$('pos',67584,'sys::Int',{}).af$('cur',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('dn',8192,'cryptoJava::Dn',xp,{}).am$('parse',8192,'cryptoJava::Rdn[]',xp,{}).am$('parseType',2048,'asn1::AsnOid',xp,{}).am$('number',2048,'sys::Str',xp,{}).am$('parseVal',2048,'sys::Str',xp,{}).am$('hexstring',2048,'sys::Str',xp,{}).am$('isHex',2048,'sys::Bool',xp,{}).am$('consumeHexPair',2048,'sys::Void',xp,{}).am$('isLeadChar',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',true)]),{}).am$('isStringChar',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',true)]),{}).am$('isTrailChar',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',true)]),{}).am$('isCommonChar',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',true)]),{}).am$('consumePair',2048,'sys::Void',xp,{}).am$('err',2048,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('p','sys::Int',true)]),{}).am$('peek',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',true)]),{}).am$('consume',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int?',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Pkcs1.type$.af$('pkcs_1',106498,'asn1::AsnOid',{}).af$('rsaEncryption',106498,'asn1::AsnOid',{}).af$('sha1WithRSAEncryption',106498,'asn1::AsnOid',{}).af$('sha256WithRSAEncryption',106498,'asn1::AsnOid',{}).af$('sha384WithRSAEncryption',106498,'asn1::AsnOid',{}).af$('sha512WithRSAEncryption',106498,'asn1::AsnOid',{}).am$('sign',40962,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('key','crypto::PrivKey',false),new sys.Param('data','sys::Buf',false),new sys.Param('sigAlg','cryptoJava::AlgId',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
AlgId.type$.am$('fromOpts',40966,'cryptoJava::AlgId?',sys.List.make(sys.Param.type$,[new sys.Param('opts','[sys::Str:sys::Obj]',false)]),{}).am$('makeSpec',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('algorithm','asn1::AsnOid',false),new sys.Param('parameters','asn1::AsnObj?',true)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('items','asn1::AsnObj[]',false)]),{}).am$('id',8192,'asn1::AsnOid',xp,{}).am$('params',8192,'asn1::AsnObj?',xp,{}).am$('algorithm',8192,'sys::Str',xp,{});
Dn.type$.af$('rdns',73730,'cryptoJava::Rdn[]',{}).am$('fromStr',40966,'cryptoJava::Dn?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('decode',40966,'cryptoJava::Dn?',sys.List.make(sys.Param.type$,[new sys.Param('der','sys::Buf',false)]),{}).am$('fromSeq',40966,'cryptoJava::Dn?',sys.List.make(sys.Param.type$,[new sys.Param('rdnSeq','asn1::AsnSeq',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rdns','cryptoJava::Rdn[]',false)]),{}).am$('get',8192,'cryptoJava::Rdn',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{'sys::Operator':""}).am$('asn',8192,'asn1::AsnSeq',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
DnTest.type$.am$('testRfc4514Type',8192,'sys::Void',xp,{}).am$('testRfc4514Val',8192,'sys::Void',xp,{}).am$('parse',2048,'cryptoJava::Rdn[]',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
JwkTest.type$.am$('testJwk',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "cryptoJava");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;concurrent 1.0;asn1 1.0;crypto 1.0;inet 1.0;util 1.0;web 1.0");
m.set("pod.summary", "Crypto implementation for the JVM");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:22-05:00 New_York");
m.set("build.tsKey", "241210143122");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "false");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "Fantom");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Fantom Core");
m.set("proj.uri", "https://fantom.org/");
m.set("pod.docApi", "false");
m.set("org.uri", "https://fantom.org/");
m.set("pod.native.java", "true");
m.set("vcs.uri", "https://github.com/fantom-lang/fantom");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  JCertSigner,
  V3Ext,
  BasicConstraints,
  X509,
  JCsr,
  JCrypto,
  JJwk,
  JKeyPair,
  JKey,
  JPrivKey,
  JPubKey,
  JMacKey,
  JKeyStore,
  JKeyStoreEntry,
  JPrivKeyEntry,
  JTrustEntry,
  JDigest,
  PemConst,
  PemLabel,
  PemWriter,
  PemReader,
  Rdn,
  DnParser,
  Pkcs1,
  AlgId,
  Dn,
  DnTest,
  JwkTest,
};
