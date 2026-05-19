// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as rdf from './rdf.js'
import * as util from './util.js'
import * as web from './web.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
import * as axon from './axon.js'
import * as def from './def.js'
import * as folio from './folio.js'
import * as obs from './obs.js'
import * as hx from './hx.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class CryptoLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CryptoLib.type$; }

  #dir = null;

  dir() { return this.#dir; }

  __dir(it) { if (it === undefined) return this.#dir; else this.#dir = it; }

  #keystore = null;

  keystore() { return this.#keystore; }

  __keystore(it) { if (it === undefined) return this.#keystore; else this.#keystore = it; }

  static make() {
    const $self = new CryptoLib();
    CryptoLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    $self.#dir = $self.rt().dir().plus(sys.Uri.fromStr("crypto/")).create();
    $self.#keystore = CryptoKeyStore.make($self.rt().libs().actorPool(), $self.#dir, $self.log(), $self.actorTimeout());
    return;
  }

  actorTimeout() {
    let val = sys.ObjUtil.as(this.rec().get("actorTimeout"), haystack.Number.type$);
    if ((val != null && val.isDuration())) {
      return sys.ObjUtil.coerce(val.toDuration(), sys.Duration.type$);
    }
    ;
    return sys.Duration.fromStr("1min");
  }

  services() {
    return sys.List.make(CryptoLib.type$, [this]);
  }

  httpsKey(checked) {
    if (checked === undefined) checked = true;
    let entry = sys.ObjUtil.as(this.#keystore.get("https", false), crypto.PrivKeyEntry.type$);
    if (entry != null) {
      return crypto.Crypto.cur().loadKeyStore().set("https", sys.ObjUtil.coerce(entry, crypto.KeyStoreEntry.type$));
    }
    ;
    if (checked) {
      throw sys.ArgErr.make("https key not found");
    }
    ;
    return null;
  }

  hostKeyPair() {
    return this.hostKey().keyPair();
  }

  hostKey() {
    return this.#keystore.hostKey();
  }

  readBuf() {
    return this.#keystore.readBuf();
  }

  writeBuf(buf) {
    this.#keystore.writeBuf(buf);
    return;
  }

  onStart() {
    const this$ = this;
    if (this.rt().config().isTest()) {
      return;
    }
    ;
    inet.SocketConfig.setCur(inet.SocketConfig.make((it) => {
      it.__truststore(this$.#keystore);
      return;
    }));
    java.failjava.lang.System.setProperty("javax.net.ssl.trustStoreType", "pkcs12");
    java.failjava.lang.System.setProperty("javax.net.ssl.trustStore", this.#keystore.file().osPath());
    java.failjava.lang.System.setProperty("javax.net.ssl.trustStorePassword", "changeit");
    return;
  }

}

class CryptoFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CryptoFuncs.type$; }

  static cryptoGenSelfSignedCert(alias,subjectDn,opts) {
    if (opts === undefined) opts = haystack.Etc.emptyDict();
    if (CryptoFuncs.ks().containsAlias(alias)) {
      throw sys.ArgErr.make(sys.Str.plus("An entry already exists with alias ", sys.Str.toCode(alias)));
    }
    ;
    let $crypto = crypto.Crypto.cur();
    let keys = $crypto.genKeyPair("RSA", 2048);
    let csr = $crypto.genCsr(keys, subjectDn);
    let cert = $crypto.certSigner(csr).notBefore(sys.ObjUtil.coerce(((this$) => { let $_u0 = opts.get("notBefore"); if ($_u0 != null) return $_u0; return sys.Date.today(); })(this), sys.Date.type$)).notAfter(sys.ObjUtil.coerce(((this$) => { let $_u1 = opts.get("notAfter"); if ($_u1 != null) return $_u1; return sys.Date.today().plus(sys.Duration.fromStr("365day")); })(this), sys.Date.type$)).basicConstraints().sign();
    CryptoFuncs.ks().setPrivKey(alias, keys.priv(), sys.List.make(crypto.Cert.type$, [cert]));
    return alias;
  }

  static cryptoLocal(type) {
    let t = ((this$) => { let $_u2 = type; if ($_u2 != null) return $_u2; return "all"; })(this);
    let f = "";
    let $_u3 = type;
    if (sys.ObjUtil.equals($_u3, "cryptoTrust")) {
      (f = "trusted");
    }
    else if (sys.ObjUtil.equals($_u3, "cryptoPrivKey")) {
      (f = "bundle");
    }
    else {
      (f = "cryptoEntry");
    }
    ;
    return CryptoFuncs.cryptoReadAllKeys().filter(sys.ObjUtil.coerce(haystack.Filter.fromStr(f), haystack.Filter.type$));
  }

  static cryptoCheckAction(dict) {
    let uri = sys.Uri.fromStr("");
    if (sys.ObjUtil.is(dict, sys.Uri.type$)) {
      (uri = sys.ObjUtil.coerce(dict, sys.Uri.type$));
    }
    else {
      if (sys.ObjUtil.is(dict, haystack.Grid.type$)) {
        (uri = sys.ObjUtil.coerce(haystack.Etc.toRec(dict).get("uri"), sys.Uri.type$));
      }
      else {
        if (sys.ObjUtil.is(dict, haystack.Dict.type$)) {
          (uri = sys.ObjUtil.coerce(sys.ObjUtil.coerce(dict, haystack.Dict.type$).get("uri"), sys.Uri.type$));
        }
        else {
          if (sys.ObjUtil.is(dict, sys.Str.type$)) {
            (uri = sys.ObjUtil.coerce(sys.Uri.fromStr(sys.ObjUtil.coerce(dict, sys.Str.type$)), sys.Uri.type$));
          }
          else {
            throw sys.ArgErr.make(sys.Str.plus("Invalid input: ", dict));
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    return CryptoFuncs.cryptoCheckUri(uri).addMeta(haystack.Etc.makeDict1("view", "table"));
  }

  static cryptoReadAllKeys() {
    const this$ = this;
    let aliases = CryptoFuncs.ks().aliases().sort();
    let rows = sys.List.make(haystack.Dict.type$);
    aliases.each((alias) => {
      let entry = CryptoFuncs.ks().get(alias);
      let row = CryptoFuncs.entryToRow(sys.ObjUtil.coerce(entry, sys.Obj.type$), alias);
      if (row != null) {
        rows.add(sys.ObjUtil.coerce(row, haystack.Dict.type$));
      }
      ;
      return;
    });
    let keys = haystack.Etc.makeDictsGrid(null, rows);
    return CryptoFuncs.cryptoStdDisplay(keys);
  }

  static cryptoTrustUri(dict) {
    const this$ = this;
    let rec = haystack.Etc.toRec(dict);
    let alias = CryptoFuncs.toAlias(rec.trap("alias", sys.List.make(sys.Obj.type$.toNullable(), [])));
    let uri = sys.ObjUtil.coerce(rec.trap("uri", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Uri.type$);
    let check = rec.has("check");
    if (sys.Str.isEmpty(alias)) {
      (alias = sys.Buf.random(6).toBase64Uri());
    }
    ;
    let rawCerts = crypto.Crypto.cur().loadCertsForUri(uri);
    let certs = CryptoFuncs.sortRootToEndEntity(rawCerts);
    let aliases = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("crypto::Cert"));
    certs.each((cert,i) => {
      let entryAlias = ((this$) => { if (sys.ObjUtil.equals(i, 0)) return alias; return sys.Str.plus(sys.Str.plus(sys.Str.plus("", alias), "."), sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())); })(this$);
      if (CryptoFuncs.ks().containsAlias(entryAlias)) {
        throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Entry with alias '", entryAlias), "' already exists."));
      }
      ;
      aliases.set(entryAlias, sys.ObjUtil.coerce(cert, crypto.Cert.type$));
      return;
    });
    let rows = sys.List.make(haystack.Dict.type$);
    aliases.each((cert,entryAlias) => {
      if ((!check && (cert.isCA() || cert.isSelfSigned()))) {
        CryptoFuncs.ks().setTrust(entryAlias, cert);
        let entry = CryptoFuncs.ks().get(entryAlias);
        rows.add(sys.ObjUtil.coerce(CryptoFuncs.entryToRow(sys.ObjUtil.coerce(entry, sys.Obj.type$), entryAlias), haystack.Dict.type$));
      }
      else {
        rows.add(sys.ObjUtil.coerce(CryptoFuncs.entryToRow(cert, entryAlias), haystack.Dict.type$));
      }
      ;
      return;
    });
    return haystack.Etc.makeDictsGrid(null, rows);
  }

  static cryptoCheckUri(uri) {
    let opts = haystack.Etc.makeDict3("alias", "check", "uri", uri, "check", haystack.Marker.val());
    let chain = CryptoFuncs.cryptoTrustUri(opts).sortCol("alias");
    return CryptoFuncs.cryptoStdDisplay(chain);
  }

  static cryptoStdDisplay(input) {
    const this$ = this;
    let cols = input.colNames();
    let preferredOrder = sys.List.make(sys.Str.type$, ["id", "alias", "ca", "selfSigned", "notAfter", "keyAlg", "keySize", "subject", "issuer"]);
    let sorted = preferredOrder.intersection(cols);
    sorted.each((c,i) => {
      (cols = cols.moveTo(c, i));
      return;
    });
    let hidden = haystack.Etc.makeDict1("hidden", haystack.Marker.val());
    return input.reorderCols(cols).addColMeta("id", hidden);
  }

  static sortRootToEndEntity(serverCerts) {
    const this$ = this;
    if (sys.ObjUtil.equals(serverCerts.size(), 1)) {
      return serverCerts;
    }
    ;
    let roots = serverCerts.findAll(sys.ObjUtil.coerce((c) => {
      return (c.isCA() && c.isSelfSigned());
    }, sys.Type.find("|sys::V,sys::Int->sys::Bool|")));
    if ((sys.ObjUtil.equals(roots.size(), 0) || sys.ObjUtil.compareGT(roots.size(), 1))) {
      return serverCerts;
    }
    ;
    serverCerts.removeAll(roots);
    let rootCA = sys.ObjUtil.coerce(roots.get(0), crypto.Cert.type$);
    let chain = sys.List.make(crypto.Cert.type$, [rootCA]);
    let certsNotInChain = sys.List.make(sys.Obj.type$.toNullable());
    if (sys.ObjUtil.compareGT(serverCerts.size(), 0)) {
      let endEntitys = serverCerts.findAll(sys.ObjUtil.coerce((c) => {
        return (!c.isCA() && !c.isSelfSigned());
      }, sys.Type.find("|sys::V,sys::Int->sys::Bool|")));
      if ((sys.ObjUtil.equals(endEntitys.size(), 0) || sys.ObjUtil.compareGT(endEntitys.size(), 1))) {
        return serverCerts;
      }
      ;
      serverCerts.removeAll(endEntitys);
      let endEntity = sys.ObjUtil.coerce(endEntitys.get(0), crypto.Cert.type$);
      if (sys.ObjUtil.compareGT(serverCerts.size(), 0)) {
        let intermediateCAs = sys.List.make(crypto.Cert.type$);
        let ca = sys.ObjUtil.coerce(serverCerts.find(sys.ObjUtil.coerce((c) => {
          return sys.ObjUtil.equals(c.subject(), endEntity.issuer());
        }, sys.Type.find("|sys::V,sys::Int->sys::Bool|"))), crypto.Cert.type$.toNullable());
        let count = 0;
        while ((ca != null && sys.ObjUtil.compareLT(count, 10))) {
          intermediateCAs.insert(0, sys.ObjUtil.coerce(ca, crypto.Cert.type$));
          serverCerts.remove(sys.ObjUtil.coerce(ca, sys.Obj.type$));
          ((this$) => { let $_u5 = count;count = sys.Int.increment(count); return $_u5; })(this);
          (ca = sys.ObjUtil.coerce(serverCerts.find(sys.ObjUtil.coerce((c) => {
            return sys.ObjUtil.equals(c.subject(), ca.issuer());
          }, sys.Type.find("|sys::V,sys::Int->sys::Bool|"))), crypto.Cert.type$.toNullable()));
        }
        ;
        if (sys.ObjUtil.compareGT(serverCerts.size(), 0)) {
          (certsNotInChain = sys.ObjUtil.coerce(serverCerts, sys.Type.find("sys::Obj?[]")));
        }
        ;
        if ((sys.ObjUtil.compareNE(endEntity.issuer(), rootCA.subject()) && sys.ObjUtil.compareNE(intermediateCAs.get(0).issuer(), rootCA.subject()))) {
          return serverCerts;
        }
        ;
        chain.addAll(intermediateCAs);
      }
      else {
        if (sys.ObjUtil.compareNE(endEntity.issuer(), rootCA.subject())) {
          return serverCerts;
        }
        ;
      }
      ;
      chain.add(endEntity);
      chain.addAll(sys.ObjUtil.coerce(certsNotInChain, sys.Type.find("crypto::Cert[]")));
    }
    ;
    return chain;
  }

  static cryptoEntryDelete(aliases) {
    const this$ = this;
    CryptoFuncs.toAliases(sys.ObjUtil.coerce(aliases, sys.Obj.type$)).each((alias) => {
      CryptoFuncs.ks().remove(alias);
      return;
    });
    return null;
  }

  static cryptoEntryRename(dict) {
    let rec = haystack.Etc.toRec(dict);
    let alias = CryptoFuncs.toAlias(rec.trap("alias", sys.List.make(sys.Obj.type$.toNullable(), [])));
    let from$ = CryptoFuncs.toAlias(rec.id());
    let entry = ((this$) => { let $_u6 = CryptoFuncs.ks().get(from$, false); if ($_u6 != null) return $_u6; throw sys.Err.make(sys.Str.plus(sys.Str.plus("Entry with alias '", from$), "' not found")); })(this);
    if ((CryptoFuncs.ks().containsAlias(alias) && !sys.ObjUtil.coerce(rec.get("force"), sys.Bool.type$))) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("Entry with alias ", alias), " already exists. Use force option to overwrite."));
    }
    ;
    CryptoFuncs.ks().set(alias, sys.ObjUtil.coerce(entry, crypto.KeyStoreEntry.type$));
    if (!sys.ObjUtil.coerce(rec.get("keep"), sys.Bool.type$)) {
      CryptoFuncs.ks().remove(from$);
    }
    ;
    return alias;
  }

  static cryptoShowPub(obj) {
    const this$ = this;
    let alias = CryptoFuncs.toAlias(obj);
    let entry = CryptoFuncs.ks().get(alias);
    let buf = sys.StrBuf.make();
    let certs = sys.ObjUtil.coerce(((this$) => { if (sys.ObjUtil.is(entry, crypto.TrustEntry.type$)) return sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.trap(entry,"cert", sys.List.make(sys.Obj.type$.toNullable(), []))]); return sys.ObjUtil.trap(entry,"certChain", sys.List.make(sys.Obj.type$.toNullable(), [])); })(this), sys.Type.find("crypto::Cert[]"));
    certs.each((cert) => {
      buf.add(cert.toStr());
      return;
    });
    return haystack.Etc.makeMapGrid(sys.Map.__fromLiteral(["view"], ["text"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), sys.Map.__fromLiteral(["val"], [buf.toStr()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
  }

  static cryptoAddCert(alias,pem,force) {
    if (force === undefined) force = false;
    (alias = CryptoFuncs.toAlias(alias));
    if ((CryptoFuncs.ks().containsAlias(alias) && !force)) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("Entry with alias ", alias), " already exists. Use force option to overwrite."));
    }
    ;
    let $crypto = crypto.Crypto.cur();
    let privKey = null;
    let chain = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("crypto::Cert[]"));
    let in$ = sys.Str.in(pem);
    while (true) {
      let entry = $crypto.loadPem(in$);
      if (entry == null) {
        break;
      }
      else {
        if (sys.ObjUtil.is(entry, crypto.PrivKey.type$)) {
          (privKey = sys.ObjUtil.coerce(entry, crypto.PrivKey.type$.toNullable()));
        }
        else {
          chain.add(sys.ObjUtil.coerce(entry, crypto.Cert.type$));
        }
        ;
      }
      ;
    }
    ;
    if (privKey == null) {
      if (sys.ObjUtil.compareNE(chain.size(), 1)) {
        throw sys.Err.make("Must provide a single certificate to trust");
      }
      ;
      CryptoFuncs.ks().setTrust(alias, sys.ObjUtil.coerce(chain.first(), crypto.Cert.type$));
    }
    else {
      if (chain.isEmpty()) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus("No certificate chain in ", alias), " PEM file"));
      }
      ;
      CryptoFuncs.ks().setPrivKey(alias, sys.ObjUtil.coerce(privKey, crypto.PrivKey.type$), chain);
    }
    ;
    return alias;
  }

  static entryToRow(entry,alias) {
    if (alias === undefined) alias = null;
    let tags = sys.Map.__fromLiteral(["cryptoEntry"], [haystack.Marker.val()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    let cert = null;
    if (alias != null) {
      tags.set("id", CryptoFuncs.aliasToId(sys.ObjUtil.coerce(alias, sys.Str.type$)));
      tags.set("alias", sys.ObjUtil.coerce(alias, sys.Obj.type$));
    }
    ;
    if (sys.ObjUtil.is(entry, crypto.PrivKeyEntry.type$)) {
      let keyEntry = sys.ObjUtil.coerce(entry, crypto.PrivKeyEntry.type$);
      (cert = keyEntry.certChain().first());
      tags.set("bundle", haystack.Marker.val());
    }
    else {
      if (sys.ObjUtil.is(entry, crypto.TrustEntry.type$)) {
        (cert = sys.ObjUtil.coerce(entry, crypto.TrustEntry.type$).cert());
        tags.set("trusted", haystack.Marker.val());
      }
      else {
        if (sys.ObjUtil.is(entry, crypto.Cert.type$)) {
          (cert = sys.ObjUtil.coerce(entry, crypto.Cert.type$.toNullable()));
          tags.set("pem", cert.toStr());
          if (cert.isSelfSigned()) {
            tags.set("selfSigned", haystack.Marker.val());
          }
          ;
          if (cert.isCA()) {
            tags.set("ca", haystack.Marker.val());
          }
          ;
        }
        else {
          throw sys.ArgErr.make(sys.Str.plus("Unrecognized entry: ", sys.ObjUtil.typeof(entry)));
        }
        ;
      }
      ;
    }
    ;
    tags.set("subject", cert.subject());
    tags.set("issuer", cert.issuer());
    tags.set("certType", cert.certType());
    try {
      let key = cert.pub();
      tags.set("notBefore", sys.ObjUtil.coerce(sys.ObjUtil.trap(cert,"notBefore", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Obj.type$));
      tags.set("notAfter", sys.ObjUtil.coerce(sys.ObjUtil.trap(cert,"notAfter", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Obj.type$));
      tags.set("keyAlg", key.algorithm());
      tags.set("keySize", haystack.Number.makeInt(key.keySize()).toLocale("#"));
    }
    catch ($_u8) {
      $_u8 = sys.Err.make($_u8);
      if ($_u8 instanceof sys.Err) {
        let ignore = $_u8;
        ;
      }
      else {
        throw $_u8;
      }
    }
    ;
    return haystack.Etc.makeDict(tags);
  }

  static aliasToId(alias) {
    return sys.ObjUtil.coerce(haystack.Ref.make(sys.Str.toBuf(alias).toBase64Uri(), alias), haystack.Ref.type$);
  }

  static toAlias(val) {
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      if (sys.Str.trimToNull(sys.ObjUtil.coerce(val, sys.Str.type$)) == null) {
        throw sys.Err.make("Alias cannot be empty");
      }
      ;
      return sys.ObjUtil.coerce(val, sys.Str.type$);
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Ref.type$)) {
      return sys.Buf.fromBase64(sys.ObjUtil.coerce(val, haystack.Ref.type$).id()).readAllStr();
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot coerce val to alias str: ", val), " ["), ((this$) => { let $_u9 = val; if ($_u9 == null) return null; return sys.ObjUtil.typeof(val); })(this)), "]"));
  }

  static toAliases(val) {
    const this$ = this;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return CryptoFuncs.toAliases(sys.ObjUtil.coerce(val, haystack.Grid.type$).ids());
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]")).map((x) => {
        return CryptoFuncs.toAlias(x);
      }, sys.Str.type$), sys.Type.find("sys::Str[]"));
    }
    ;
    return sys.List.make(sys.Str.type$, [CryptoFuncs.toAlias(val)]);
  }

  static ks() {
    return hx.HxContext.curHx().rt().services().crypto().keystore();
  }

  static make() {
    const $self = new CryptoFuncs();
    CryptoFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class CryptoKeyStore extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CryptoKeyStore.type$; }

  containsAlias() { return crypto.KeyStore.prototype.containsAlias.apply(this, arguments); }

  getPrivKey() { return crypto.KeyStore.prototype.getPrivKey.apply(this, arguments); }

  getTrust() { return crypto.KeyStore.prototype.getTrust.apply(this, arguments); }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  static #Jvm = undefined;

  static Jvm() {
    if (CryptoKeyStore.#Jvm === undefined) {
      CryptoKeyStore.static$init();
      if (CryptoKeyStore.#Jvm === undefined) CryptoKeyStore.#Jvm = null;
    }
    return CryptoKeyStore.#Jvm;
  }

  #log = null;

  // private field reflection only
  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #timeout = null;

  // private field reflection only
  __timeout(it) { if (it === undefined) return this.#timeout; else this.#timeout = it; }

  #actor = null;

  // private field reflection only
  __actor(it) { if (it === undefined) return this.#actor; else this.#actor = it; }

  #keystore = null;

  // private field reflection only
  __keystore(it) { if (it === undefined) return this.#keystore; else this.#keystore = it; }

  static make(pool,dir,log,timeout) {
    const $self = new CryptoKeyStore();
    CryptoKeyStore.make$($self,pool,dir,log,timeout);
    return $self;
  }

  static make$($self,pool,dir,log,timeout) {
    if (timeout === undefined) timeout = sys.Duration.fromStr("1min");
    const this$ = $self;
    $self.#file = CryptoKeyStore.toFile(dir);
    $self.#log = log;
    $self.#timeout = timeout;
    $self.#actor = concurrent.Actor.make(pool, (msg) => {
      return this$.onReceive(msg);
    });
    $self.#keystore = crypto.Crypto.cur().loadKeyStore(((this$) => { if (this$.#file.exists()) return this$.#file; return null; })($self));
    let updatedJvm = $self.initJvm();
    let updatedHost = $self.initHostKey();
    let updated = (updatedJvm || updatedHost);
    if (updated) {
      $self.autosave();
    }
    ;
    $self.backup();
    return;
  }

  initJvm() {
    const this$ = this;
    let jvmFile = CryptoKeyStore.findJvmCerts();
    if (!jvmFile.exists()) {
      this.#log.warn("Could not find JVM trusted certs file");
      return false;
    }
    ;
    let opts = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    let format = ((this$) => { if (sys.Str.startsWith(sys.Env.cur().vars().get("java.version"), "1.")) return "jks"; return "pkcs12"; })(this);
    opts.set("format", format);
    let pwd = sys.Env.cur().vars().get("javax.net.ssl.keyStorePassword");
    if (pwd != null) {
      opts.set("password", sys.ObjUtil.coerce(pwd, sys.Obj.type$));
    }
    ;
    let untrusted = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.caseInsensitive(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"));
    this.#keystore.aliases().each((alias) => {
      if (sys.Str.startsWith(alias, CryptoKeyStore.Jvm())) {
        untrusted.set(alias, alias);
      }
      ;
      return;
    });
    let updated = false;
    let jvm = crypto.Crypto.cur().loadKeyStore(jvmFile, opts);
    jvm.aliases().each((alias) => {
      let entry = jvm.get(alias);
      let jvmAlias = sys.Str.plus(sys.Str.plus(sys.Str.plus("", CryptoKeyStore.Jvm()), ""), alias);
      if (!this$.#keystore.containsAlias(jvmAlias)) {
        this$.#log.debug(sys.Str.plus("Loading JVM keystore entry: ", alias));
        (updated = true);
        this$.#keystore.set(jvmAlias, sys.ObjUtil.coerce(entry, crypto.KeyStoreEntry.type$));
      }
      ;
      untrusted.remove(jvmAlias);
      return;
    });
    if (!untrusted.isEmpty()) {
      untrusted.each((alias) => {
        this$.#log.info(sys.Str.plus("Removing certifcate no longer trusted by the JVM: ", alias));
        this$.#keystore.remove(alias);
        return;
      });
      (updated = true);
    }
    ;
    return updated;
  }

  static findJvmCerts() {
    let securityDir = sys.File.os(sys.ObjUtil.coerce(sys.Env.cur().vars().get("java.home"), sys.Str.type$)).plus(sys.Uri.fromStr("lib/security/"));
    let f = securityDir.plus(sys.Uri.fromStr("jssecacerts"));
    if (!f.exists()) {
      (f = securityDir.plus(sys.Uri.fromStr("cacerts")));
    }
    ;
    return f;
  }

  initHostKey() {
    let entry = sys.ObjUtil.as(this.#keystore.get("host", false), crypto.PrivKeyEntry.type$);
    if (entry != null) {
      return false;
    }
    ;
    let pair = crypto.Crypto.cur().genKeyPair("RSA", 2048);
    let csr = crypto.Crypto.cur().genCsr(pair, "cn=skyarc.host");
    let cert = crypto.Crypto.cur().certSigner(csr).sign();
    (entry = this.#keystore.setPrivKey("host", pair.priv(), sys.List.make(crypto.Cert.type$, [cert])).getPrivKey("host"));
    return true;
  }

  static toFile(dir) {
    return dir.plus(sys.Uri.fromStr("keystore.p12"));
  }

  backup() {
    return sys.ObjUtil.coerce(this.#actor.send(hx.HxMsg.make0("backup")).get(this.#timeout), sys.File.type$);
  }

  hostKey() {
    return sys.ObjUtil.coerce(this.#keystore.get("host", true), crypto.PrivKeyEntry.type$);
  }

  readBuf() {
    return sys.ObjUtil.coerce(this.#actor.send(hx.HxMsg.make0("readBuf")).get(this.#timeout), sys.Buf.type$);
  }

  writeBuf(buf) {
    return sys.ObjUtil.coerce(this.#actor.send(hx.HxMsg.make1("writeBuf", buf)).get(this.#timeout), CryptoKeyStore.type$);
  }

  format() {
    return this.#keystore.format();
  }

  aliases() {
    return this.#keystore.aliases();
  }

  size() {
    return this.#keystore.size();
  }

  get(alias,checked) {
    if (checked === undefined) checked = true;
    return this.#keystore.get(alias, checked);
  }

  save(out,options) {
    if (options === undefined) options = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj]"));
    this.#actor.send(hx.HxMsg.make2("save", sys.Unsafe.make(out), options)).get(this.#timeout);
    return;
  }

  setPrivKey(alias,priv,chain) {
    return sys.ObjUtil.coerce(this.#actor.send(hx.HxMsg.make3("set", alias, priv, chain)).get(this.#timeout), CryptoKeyStore.type$);
  }

  setTrust(alias,cert) {
    return sys.ObjUtil.coerce(this.#actor.send(hx.HxMsg.make2("set", alias, cert)).get(this.#timeout), CryptoKeyStore.type$);
  }

  set(alias,entry) {
    return sys.ObjUtil.coerce(this.#actor.send(hx.HxMsg.make2("set", alias, entry)).get(this.#timeout), CryptoKeyStore.type$);
  }

  remove(alias) {
    this.#actor.send(hx.HxMsg.make1("set", alias)).get(this.#timeout);
    return;
  }

  onReceive(obj) {
    let msg = sys.ObjUtil.as(obj, hx.HxMsg.type$);
    let $_u12 = ((this$) => { let $_u13=msg; return ($_u13==null) ? null : $_u13.id(); })(this);
    if (sys.ObjUtil.equals($_u12, "backup")) {
      return this.onBackup();
    }
    else if (sys.ObjUtil.equals($_u12, "readBuf")) {
      return this.#file.readAllBuf();
    }
    else if (sys.ObjUtil.equals($_u12, "writeBuf")) {
      return this.onWriteBuf(sys.ObjUtil.coerce(msg.a(), sys.Buf.type$));
    }
    else if (sys.ObjUtil.equals($_u12, "save")) {
      return this.onSave(sys.ObjUtil.coerce(sys.ObjUtil.coerce(msg.a(), sys.Unsafe.type$).val(), sys.OutStream.type$), sys.ObjUtil.coerce(msg.b(), sys.Type.find("[sys::Str:sys::Obj]")));
    }
    else if (sys.ObjUtil.equals($_u12, "set")) {
      return this.onSet(sys.ObjUtil.coerce(msg, hx.HxMsg.type$));
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("Unexpected message: ", obj));
  }

  onBackup() {
    let backupFile = this.#file.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#file.basename()), "-bkup."), this.#file.ext())));
    this.#file.copyTo(backupFile, sys.Map.__fromLiteral(["overwrite"], [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")));
    return backupFile;
  }

  onSave(out,options) {
    this.#keystore.save(out, options);
    return this;
  }

  onWriteBuf(buf) {
    const this$ = this;
    let bufKeyStore = crypto.Crypto.cur().loadKeyStore(buf.toFile(sys.Uri.fromStr("onWrite.p12")));
    this.#keystore.aliases().each((alias) => {
      this$.#keystore.remove(alias);
      return;
    });
    bufKeyStore.aliases().each((alias) => {
      this$.#keystore.set(alias, sys.ObjUtil.coerce(bufKeyStore.get(alias), crypto.KeyStoreEntry.type$));
      return;
    });
    let out = this.#file.out();
    try {
      out.writeBuf(buf);
    }
    finally {
      out.close();
    }
    ;
    return this;
  }

  onSet(msg) {
    let alias = sys.ObjUtil.coerce(msg.a(), sys.Str.type$);
    if (msg.b() == null) {
      this.#keystore.remove(alias);
    }
    else {
      if (sys.ObjUtil.is(msg.b(), crypto.PrivKey.type$)) {
        this.#keystore.setPrivKey(alias, sys.ObjUtil.coerce(msg.b(), crypto.PrivKey.type$), sys.ObjUtil.coerce(msg.c(), sys.Type.find("crypto::Cert[]")));
      }
      else {
        if (sys.ObjUtil.is(msg.b(), crypto.Cert.type$)) {
          this.#keystore.setTrust(alias, sys.ObjUtil.coerce(msg.b(), crypto.Cert.type$));
        }
        else {
          if (sys.ObjUtil.is(msg.b(), crypto.KeyStoreEntry.type$)) {
            this.#keystore.set(alias, sys.ObjUtil.coerce(msg.b(), crypto.KeyStoreEntry.type$));
          }
          else {
            throw sys.ArgErr.make(sys.Str.plus("", msg));
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    return this.autosave();
  }

  autosave() {
    let out = this.#file.out();
    try {
      return this.onSave(out, sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj]")));
    }
    finally {
      out.close();
    }
    ;
  }

  static static$init() {
    CryptoKeyStore.#Jvm = "jvm\$";
    return;
  }

}

const p = sys.Pod.add$('hxCrypto');
const xp = sys.Param.noParams$();
let m;
CryptoLib.type$ = p.at$('CryptoLib','hx::HxLib',['hx::HxCryptoService'],{},8194,CryptoLib);
CryptoFuncs.type$ = p.at$('CryptoFuncs','sys::Obj',[],{},8194,CryptoFuncs);
CryptoKeyStore.type$ = p.at$('CryptoKeyStore','sys::Obj',['crypto::KeyStore'],{},8194,CryptoKeyStore);
CryptoLib.type$.af$('dir',73730,'sys::File',{}).af$('keystore',336898,'hxCrypto::CryptoKeyStore',{}).am$('make',8196,'sys::Void',xp,{}).am$('actorTimeout',2048,'sys::Duration',xp,{}).am$('services',271360,'hx::HxService[]',xp,{}).am$('httpsKey',271360,'crypto::KeyStore?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('hostKeyPair',271360,'crypto::KeyPair',xp,{}).am$('hostKey',271360,'crypto::PrivKeyEntry',xp,{}).am$('readBuf',271360,'sys::Buf',xp,{}).am$('writeBuf',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('onStart',271360,'sys::Void',xp,{});
CryptoFuncs.type$.am$('cryptoGenSelfSignedCert',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('subjectDn','sys::Str',false),new sys.Param('opts','haystack::Dict',true)]),{'axon::Axon':"axon::Axon{su=true;}"}).am$('cryptoLocal',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str?',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{su=true;}"}).am$('cryptoCheckAction',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('dict','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{su=true;}"}).am$('cryptoReadAllKeys',40962,'haystack::Grid',xp,{'sys::NoDoc':"",'axon::Axon':"axon::Axon{su=true;}"}).am$('cryptoTrustUri',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('dict','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{su=true;}"}).am$('cryptoCheckUri',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{su=true;}"}).am$('cryptoStdDisplay',34818,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('input','haystack::Grid',false)]),{'sys::NoDoc':""}).am$('sortRootToEndEntity',34818,'sys::List',sys.List.make(sys.Param.type$,[new sys.Param('serverCerts','sys::List',false)]),{'sys::NoDoc':""}).am$('cryptoEntryDelete',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('aliases','sys::Obj?',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{su=true;}"}).am$('cryptoEntryRename',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('dict','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{su=true;}"}).am$('cryptoShowPub',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':""}).am$('cryptoAddCert',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('pem','sys::Str',false),new sys.Param('force','sys::Bool',true)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{su=true;}"}).am$('entryToRow',34818,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('entry','sys::Obj',false),new sys.Param('alias','sys::Str?',true)]),{}).am$('aliasToId',34818,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false)]),{}).am$('toAlias',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('toAliases',34818,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('ks',34818,'crypto::KeyStore',xp,{}).am$('make',139268,'sys::Void',xp,{});
CryptoKeyStore.type$.af$('file',73730,'sys::File',{}).af$('Jvm',100354,'sys::Str',{}).af$('log',67586,'sys::Log',{}).af$('timeout',67586,'sys::Duration',{}).af$('actor',67586,'concurrent::Actor',{}).af$('keystore',67586,'crypto::KeyStore',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pool','concurrent::ActorPool',false),new sys.Param('dir','sys::File',false),new sys.Param('log','sys::Log',false),new sys.Param('timeout','sys::Duration',true)]),{}).am$('initJvm',2048,'sys::Bool',xp,{}).am$('findJvmCerts',40962,'sys::File',xp,{}).am$('initHostKey',2048,'sys::Bool',xp,{}).am$('toFile',40962,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('dir','sys::File',false)]),{}).am$('backup',8192,'sys::File',xp,{'sys::NoDoc':""}).am$('hostKey',8192,'crypto::PrivKeyEntry',xp,{}).am$('readBuf',8192,'sys::Buf',xp,{}).am$('writeBuf',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('format',271360,'sys::Str',xp,{}).am$('aliases',271360,'sys::Str[]',xp,{}).am$('size',271360,'sys::Int',xp,{}).am$('get',271360,'crypto::KeyStoreEntry?',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('save',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('options','[sys::Str:sys::Obj]',true)]),{}).am$('setPrivKey',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('priv','crypto::PrivKey',false),new sys.Param('chain','crypto::Cert[]',false)]),{}).am$('setTrust',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('cert','crypto::Cert',false)]),{}).am$('set',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('entry','crypto::KeyStoreEntry',false)]),{}).am$('remove',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false)]),{}).am$('onReceive',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('onBackup',2048,'sys::File',xp,{}).am$('onSave',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('options','[sys::Str:sys::Obj]',false)]),{}).am$('onWriteBuf',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('onSet',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('autosave',2048,'sys::This',xp,{}).am$('static$init',165890,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxCrypto");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;crypto 1.0;inet 1.0;haystack 3.1.11;axon 3.1.11;hx 3.1.11");
m.set("pod.summary", "Cryptographic certificate and key pair management");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:27-05:00 New_York");
m.set("build.tsKey", "241210143127");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "false");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "SkyFoundry");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Haxall");
m.set("proj.uri", "https://haxall.io/");
m.set("pod.docApi", "true");
m.set("org.uri", "https://skyfoundry.com/");
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/haxall/haxall");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  CryptoLib,
  CryptoFuncs,
  CryptoKeyStore,
};
