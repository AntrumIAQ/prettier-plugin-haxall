// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as util from './util.js'
import * as web from './web.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class PersistablePacket {
  constructor() {
    const this$ = this;
  }

  typeof() { return PersistablePacket.type$; }

}

class MqttVersion extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MqttVersion.type$; }

  static v3_1_1() { return MqttVersion.vals().get(0); }

  static v5() { return MqttVersion.vals().get(1); }

  static #vals = undefined;

  #code = 0;

  code() { return this.#code; }

  __code(it) { if (it === undefined) return this.#code; else this.#code = it; }

  static make($ordinal,$name,code) {
    const $self = new MqttVersion();
    MqttVersion.make$($self,$ordinal,$name,code);
    return $self;
  }

  static make$($self,$ordinal,$name,code) {
    sys.Enum.make$($self, $ordinal, $name);
    $self.#code = code;
    return;
  }

  static fromCode(code,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let ver = MqttVersion.vals().find((it) => {
      return sys.ObjUtil.equals(it.#code, code);
    });
    if (ver != null) {
      return ver;
    }
    ;
    if (checked) {
      throw sys.ArgErr.make(sys.Str.plus("No version matching code: ", sys.ObjUtil.coerce(code, sys.Obj.type$.toNullable())));
    }
    ;
    return null;
  }

  toStr() {
    let $_u0 = this.#code;
    if (sys.ObjUtil.equals($_u0, 4)) {
      return "3.1.1";
    }
    else if (sys.ObjUtil.equals($_u0, 5)) {
      return "5.0";
    }
    ;
    throw sys.Err.make(sys.Str.plus("Unknown version: ", sys.ObjUtil.coerce(this.#code, sys.Obj.type$.toNullable())));
  }

  is311() {
    return this === MqttVersion.v3_1_1();
  }

  is5() {
    return this === MqttVersion.v5();
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(MqttVersion.type$, MqttVersion.vals(), name$, checked);
  }

  static vals() {
    if (MqttVersion.#vals == null) {
      MqttVersion.#vals = sys.List.make(MqttVersion.type$, [
        MqttVersion.make(0, "v3_1_1", 4),
        MqttVersion.make(1, "v5", 5),
      ]).toImmutable();
    }
    return MqttVersion.#vals;
  }

  static static$init() {
    const $_u1 = MqttVersion.vals();
    if (true) {
    }
    ;
    return;
  }

}

class MqttErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
    this.#reason = null;
    return;
  }

  typeof() { return MqttErr.type$; }

  #reason = null;

  reason() { return this.#reason; }

  __reason(it) { if (it === undefined) return this.#reason; else this.#reason = it; }

  static make(msg,cause) {
    const $self = new MqttErr();
    MqttErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (msg === undefined) msg = "";
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    ;
    return;
  }

  static makeReason(reason,cause) {
    const $self = new MqttErr();
    MqttErr.makeReason$($self,reason,cause);
    return $self;
  }

  static makeReason$($self,reason,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.Str.plus("Reason: ", reason), cause);
    ;
    $self.#reason = reason;
    return;
  }

}

class MalformedPacketErr extends MqttErr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MalformedPacketErr.type$; }

  static make(msg,cause) {
    const $self = new MalformedPacketErr();
    MalformedPacketErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (msg === undefined) msg = "";
    if (cause === undefined) cause = null;
    MqttErr.make$($self, msg, cause);
    return;
  }

}

class MqttConst {
  constructor() {
    const this$ = this;
  }

  typeof() { return MqttConst.type$; }

  static #sessionExpiresOnClose = undefined;

  static sessionExpiresOnClose() {
    if (MqttConst.#sessionExpiresOnClose === undefined) {
      MqttConst.static$init();
      if (MqttConst.#sessionExpiresOnClose === undefined) MqttConst.#sessionExpiresOnClose = null;
    }
    return MqttConst.#sessionExpiresOnClose;
  }

  static #sessionNeverExpires = undefined;

  static sessionNeverExpires() {
    if (MqttConst.#sessionNeverExpires === undefined) {
      MqttConst.static$init();
      if (MqttConst.#sessionNeverExpires === undefined) MqttConst.#sessionNeverExpires = null;
    }
    return MqttConst.#sessionNeverExpires;
  }

  static #minPacketId = undefined;

  static minPacketId() {
    if (MqttConst.#minPacketId === undefined) {
      MqttConst.static$init();
      if (MqttConst.#minPacketId === undefined) MqttConst.#minPacketId = 0;
    }
    return MqttConst.#minPacketId;
  }

  static #maxPacketId = undefined;

  static maxPacketId() {
    if (MqttConst.#maxPacketId === undefined) {
      MqttConst.static$init();
      if (MqttConst.#maxPacketId === undefined) MqttConst.#maxPacketId = 0;
    }
    return MqttConst.#maxPacketId;
  }

  static #minSubId = undefined;

  static minSubId() {
    if (MqttConst.#minSubId === undefined) {
      MqttConst.static$init();
      if (MqttConst.#minSubId === undefined) MqttConst.#minSubId = 0;
    }
    return MqttConst.#minSubId;
  }

  static #maxSubId = undefined;

  static maxSubId() {
    if (MqttConst.#maxSubId === undefined) {
      MqttConst.static$init();
      if (MqttConst.#maxSubId === undefined) MqttConst.#maxSubId = 0;
    }
    return MqttConst.#maxSubId;
  }

  static static$init() {
    MqttConst.#sessionExpiresOnClose = sys.Duration.fromStr("0ns");
    MqttConst.#sessionNeverExpires = sys.ObjUtil.coerce(sys.Duration.fromStr("4294967295sec"), sys.Duration.type$);
    MqttConst.#minPacketId = 1;
    MqttConst.#maxPacketId = 65535;
    MqttConst.#minSubId = 1;
    MqttConst.#maxSubId = 268435455;
    return;
  }

}

class PendingAck extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#persistKey = null;
    this.#lastSent = concurrent.AtomicInt.make(0);
    this.#resp = concurrent.Future.makeCompletable();
    this.#stash = concurrent.ConcurrentMap.make(2);
    return;
  }

  typeof() { return PendingAck.type$; }

  #packetId = 0;

  packetId() { return this.#packetId; }

  __packetId(it) { if (it === undefined) return this.#packetId; else this.#packetId = it; }

  #persistKey = null;

  persistKey() { return this.#persistKey; }

  __persistKey(it) { if (it === undefined) return this.#persistKey; else this.#persistKey = it; }

  #created = 0;

  created() { return this.#created; }

  __created(it) { if (it === undefined) return this.#created; else this.#created = it; }

  #lastSent = null;

  // private field reflection only
  __lastSent(it) { if (it === undefined) return this.#lastSent; else this.#lastSent = it; }

  #resp = null;

  resp() { return this.#resp; }

  __resp(it) { if (it === undefined) return this.#resp; else this.#resp = it; }

  #stash = null;

  stash() { return this.#stash; }

  __stash(it) { if (it === undefined) return this.#stash; else this.#stash = it; }

  static make(packet,persistKey) {
    const $self = new PendingAck();
    PendingAck.make$($self,packet,persistKey);
    return $self;
  }

  static make$($self,packet,persistKey) {
    if (persistKey === undefined) persistKey = null;
    ;
    $self.#created = sys.Duration.nowTicks();
    $self.#packetId = packet.pid();
    $self.#persistKey = persistKey;
    if (persistKey == null) {
      $self.#stash.set("req", packet);
    }
    ;
    return;
  }

  static clone(source,persistKey) {
    const $self = new PendingAck();
    PendingAck.clone$($self,source,persistKey);
    return $self;
  }

  static clone$($self,source,persistKey) {
    ;
    $self.#persistKey = persistKey;
    $self.#packetId = source.#packetId;
    $self.#created = source.#created;
    $self.#resp = source.#resp;
    $self.#stash = source.#stash;
    return;
  }

  age() {
    return sys.ObjUtil.coerce(sys.Duration.make(sys.Int.minus(sys.Duration.nowTicks(), this.#created)), sys.Duration.type$);
  }

  touch() {
    this.#lastSent.val(sys.Duration.nowTicks());
    return this;
  }

  isComplete() {
    return this.#resp.status().isComplete();
  }

  isRetryNeeded(threshold) {
    if (this.isComplete()) {
      return false;
    }
    ;
    return sys.ObjUtil.compareGT(sys.Duration.make(sys.Int.minus(sys.Duration.nowTicks(), this.#lastSent.val())), threshold);
  }

  get(checked) {
    if (checked === undefined) checked = true;
    if (this.isComplete()) {
      return sys.ObjUtil.coerce(this.#resp.get(), ControlPacket.type$.toNullable());
    }
    ;
    if (checked) {
      throw MqttErr.make(sys.Str.plus("Ack not received for packet ", sys.ObjUtil.coerce(this.#packetId, sys.Obj.type$.toNullable())));
    }
    ;
    return null;
  }

  req(checked) {
    if (checked === undefined) checked = true;
    let req = sys.ObjUtil.as(this.#stash.get("req"), ControlPacket.type$);
    if (req != null) {
      return req;
    }
    ;
    if (checked) {
      throw MqttErr.make("Request not stashed");
    }
    ;
    return null;
  }

}

class PendingConn extends PendingAck {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PendingConn.type$; }

  #connect = null;

  connect() { return this.#connect; }

  __connect(it) { if (it === undefined) return this.#connect; else this.#connect = it; }

  static make(connect) {
    const $self = new PendingConn();
    PendingConn.make$($self,connect);
    return $self;
  }

  static make$($self,connect) {
    PendingAck.make$($self, connect, null);
    $self.#connect = connect;
    return;
  }

  connack(checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(this.get(checked), ConnAck.type$.toNullable());
  }

}

class Topic extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Topic.type$; }

  static #sep = undefined;

  static sep() {
    if (Topic.#sep === undefined) {
      Topic.static$init();
      if (Topic.#sep === undefined) Topic.#sep = 0;
    }
    return Topic.#sep;
  }

  static #multi = undefined;

  static multi() {
    if (Topic.#multi === undefined) {
      Topic.static$init();
      if (Topic.#multi === undefined) Topic.#multi = 0;
    }
    return Topic.#multi;
  }

  static #single = undefined;

  static single() {
    if (Topic.#single === undefined) {
      Topic.static$init();
      if (Topic.#single === undefined) Topic.#single = 0;
    }
    return Topic.#single;
  }

  static #max_len = undefined;

  static max_len() {
    if (Topic.#max_len === undefined) {
      Topic.static$init();
      if (Topic.#max_len === undefined) Topic.#max_len = 0;
    }
    return Topic.#max_len;
  }

  static validateName(name) {
    const this$ = this;
    Topic.validateNameOrFilter(name);
    let hasWild = sys.Str.any(name, (ch) => {
      return (sys.ObjUtil.equals(ch, Topic.multi()) || sys.ObjUtil.equals(ch, Topic.single()));
    });
    if (!hasWild) {
      return name;
    }
    ;
    throw MqttErr.make(sys.Str.plus("Topic name must not contain wildcards: ", name));
  }

  static validateFilter(topic) {
    Topic.validateNameOrFilter(topic);
    let pos = -1;
    let prev = null;
    let cur = null;
    let chars = sys.Str.chars(topic);
    while (true) {
      pos = sys.Int.increment(pos);
      if (sys.ObjUtil.compareGE(pos, chars.size())) {
        break;
      }
      ;
      (prev = cur);
      (cur = sys.ObjUtil.coerce(sys.Str.get(topic, pos), sys.Int.type$.toNullable()));
      if (sys.ObjUtil.equals(cur, Topic.multi())) {
        if (sys.ObjUtil.compareNE(pos, sys.Int.minus(sys.Str.size(topic), 1))) {
          throw MqttErr.make(sys.Str.plus("The multi-level wildcard must be the last character: ", topic));
        }
        ;
        if ((sys.ObjUtil.compareGT(pos, 0) && sys.ObjUtil.compareNE(prev, Topic.sep()))) {
          throw MqttErr.make(sys.Str.plus("A multi-level wildcard not specified on its own must follow a topic level separator: ", topic));
        }
        ;
      }
      else {
        if (sys.ObjUtil.equals(cur, Topic.single())) {
          let after = chars.getSafe(sys.Int.plus(pos, 1));
          if (sys.ObjUtil.equals(pos, 0)) {
            if (after == null) {
              break;
            }
            ;
          }
          ;
          if (((prev != null && sys.ObjUtil.compareNE(prev, Topic.sep())) || (after != null && sys.ObjUtil.compareNE(after, Topic.sep())))) {
            throw MqttErr.make(sys.Str.plus("A single-level wildcard must occupy an entire level: ", topic));
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    return topic;
  }

  static validateNameOrFilter(val) {
    if (sys.Str.isEmpty(val)) {
      throw MqttErr.make("Topics names and filters must contain at least one character");
    }
    ;
    if (sys.Str.containsChar(val, 0)) {
      throw MqttErr.make("Topic names and filters must not contain the null character");
    }
    ;
    if (sys.ObjUtil.compareGT(sys.Str.toBuf(val).size(), Topic.max_len())) {
      throw MqttErr.make(sys.Str.plus(sys.Str.plus("Topic names and filters must be no more than ", sys.ObjUtil.coerce(Topic.max_len(), sys.Obj.type$.toNullable())), " bytes"));
    }
    ;
    return;
  }

  static matches(topic,filter) {
    try {
      Topic.validateName(topic);
      Topic.validateFilter(filter);
    }
    catch ($_u2) {
      $_u2 = sys.Err.make($_u2);
      if ($_u2 instanceof sys.Err) {
        let err = $_u2;
        ;
        return false;
      }
      else {
        throw $_u2;
      }
    }
    ;
    if (sys.ObjUtil.equals(topic, filter)) {
      return true;
    }
    ;
    let tparts = sys.Str.split(topic, sys.ObjUtil.coerce(Topic.sep(), sys.Int.type$.toNullable()));
    let fparts = sys.Str.split(filter, sys.ObjUtil.coerce(Topic.sep(), sys.Int.type$.toNullable()));
    let i = 0;
    while (sys.ObjUtil.compareLT(i, tparts.size())) {
      let tpart = tparts.get(i);
      let fpart = fparts.getSafe(i);
      i = sys.Int.increment(i);
      if (sys.ObjUtil.equals(tpart, fpart)) {
        continue;
      }
      ;
      if (sys.ObjUtil.equals(fpart, sys.Int.toChar(Topic.single()))) {
        continue;
      }
      ;
      if (sys.ObjUtil.equals(fpart, sys.Int.toChar(Topic.multi()))) {
        return true;
      }
      ;
      return false;
    }
    ;
    if (sys.ObjUtil.compareNE(tparts.size(), fparts.size())) {
      if (sys.ObjUtil.compareNE(sys.Int.plus(tparts.size(), 1), fparts.size())) {
        return false;
      }
      ;
      if (sys.ObjUtil.compareNE(fparts.get(-1), sys.Int.toChar(Topic.multi()))) {
        return false;
      }
      ;
    }
    ;
    return true;
  }

  static make() {
    const $self = new Topic();
    Topic.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    Topic.#sep = 47;
    Topic.#multi = 35;
    Topic.#single = 43;
    Topic.#max_len = 65535;
    return;
  }

}

class DataCodec {
  constructor() {
    const this$ = this;
  }

  typeof() { return DataCodec.type$; }

  static #uint8_max = undefined;

  static uint8_max() {
    if (DataCodec.#uint8_max === undefined) {
      DataCodec.static$init();
      if (DataCodec.#uint8_max === undefined) DataCodec.#uint8_max = 0;
    }
    return DataCodec.#uint8_max;
  }

  static #uint16_max = undefined;

  static uint16_max() {
    if (DataCodec.#uint16_max === undefined) {
      DataCodec.static$init();
      if (DataCodec.#uint16_max === undefined) DataCodec.#uint16_max = 0;
    }
    return DataCodec.#uint16_max;
  }

  static #uint32_max = undefined;

  static uint32_max() {
    if (DataCodec.#uint32_max === undefined) {
      DataCodec.static$init();
      if (DataCodec.#uint32_max === undefined) DataCodec.#uint32_max = 0;
    }
    return DataCodec.#uint32_max;
  }

  static #vbi_max = undefined;

  static vbi_max() {
    if (DataCodec.#vbi_max === undefined) {
      DataCodec.static$init();
      if (DataCodec.#vbi_max === undefined) DataCodec.#vbi_max = 0;
    }
    return DataCodec.#vbi_max;
  }

  static #maxStr = undefined;

  static maxStr() {
    if (DataCodec.#maxStr === undefined) {
      DataCodec.static$init();
      if (DataCodec.#maxStr === undefined) DataCodec.#maxStr = 0;
    }
    return DataCodec.#maxStr;
  }

  static toIn(obj) {
    if (sys.ObjUtil.is(obj, sys.InStream.type$)) {
      return sys.ObjUtil.coerce(obj, sys.InStream.type$);
    }
    ;
    if (sys.ObjUtil.is(obj, sys.Buf.type$)) {
      return sys.ObjUtil.coerce(obj, sys.Buf.type$).in();
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot convert to InStream: ", obj), " ("), sys.ObjUtil.typeof(obj)), ")"));
  }

  static toOut(obj) {
    if (sys.ObjUtil.is(obj, sys.OutStream.type$)) {
      return sys.ObjUtil.coerce(obj, sys.OutStream.type$);
    }
    ;
    if (sys.ObjUtil.is(obj, sys.Buf.type$)) {
      return sys.ObjUtil.coerce(obj, sys.Buf.type$).out();
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot convert to OutStream: ", obj), " ("), sys.ObjUtil.typeof(obj)), ")"));
  }

  static writeByte(val,out) {
    DataCodec.toOut(out).write(DataCodec.checkRange(0, val, DataCodec.uint8_max()));
    return;
  }

  static readByte(in$) {
    return sys.ObjUtil.coerce(DataCodec.toIn(in$).read(), sys.Int.type$);
  }

  static writeByte2(val,out) {
    DataCodec.toOut(out).writeI2(DataCodec.checkRange(0, val, DataCodec.uint16_max()));
    return;
  }

  static readByte2(in$) {
    return DataCodec.toIn(in$).readU2();
  }

  static writeByte4(val,out) {
    DataCodec.toOut(out).writeI4(DataCodec.checkRange(0, val, DataCodec.uint32_max()));
    return;
  }

  static readByte4(in$) {
    return DataCodec.toIn(in$).readU4();
  }

  static writeVbi(val,obj) {
    DataCodec.checkRange(0, val, DataCodec.vbi_max());
    let out = DataCodec.toOut(obj);
    while (true) {
      let byte = sys.Int.mod(val, 128);
      (val = sys.Int.div(val, 128));
      if (sys.ObjUtil.compareGT(val, 0)) {
        (byte = sys.Int.or(byte, 128));
      }
      ;
      out.write(byte);
      if (sys.ObjUtil.compareLE(val, 0)) {
        break;
      }
      ;
    }
    ;
    return;
  }

  static readVbi(obj) {
    let in$ = DataCodec.toIn(obj);
    let multiplier = 1;
    let value = 0;
    while (true) {
      let byte = in$.read();
      value = sys.Int.plus(value, sys.Int.mult(sys.Int.and(sys.ObjUtil.coerce(byte, sys.Int.type$), 127), multiplier));
      if (sys.ObjUtil.compareGT(multiplier, 2097152)) {
        throw sys.IOErr.make("Malformed Variable Byte Integer");
      }
      ;
      multiplier = sys.Int.mult(multiplier, 128);
      if (sys.ObjUtil.equals(sys.Int.and(sys.ObjUtil.coerce(byte, sys.Int.type$), 128), 0)) {
        break;
      }
      ;
    }
    ;
    return value;
  }

  static checkRange(min,val,max) {
    if ((sys.ObjUtil.compareLT(val, min) || sys.ObjUtil.compareGT(val, max))) {
      throw sys.ArgErr.make(sys.Str.plus("Out-of-range: ", sys.ObjUtil.coerce(val, sys.Obj.type$.toNullable())));
    }
    ;
    return val;
  }

  static writeUtf8(str,obj) {
    let out = DataCodec.toOut(obj);
    if (str == null) {
      (str = "");
    }
    ;
    let bytes = sys.Str.toBuf(str);
    if (sys.ObjUtil.compareGT(bytes.size(), DataCodec.maxStr())) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Str is too big: ", sys.ObjUtil.coerce(bytes.size(), sys.Obj.type$.toNullable())), " bytes"));
    }
    ;
    out.writeI2(bytes.size());
    out.writeBuf(bytes);
    return;
  }

  static readUtf8(obj) {
    let in$ = DataCodec.toIn(obj);
    let len = in$.readU2();
    if (sys.ObjUtil.equals(len, 0)) {
      return "";
    }
    ;
    return in$.readBufFully(null, len).readAllStr();
  }

  static writeBin(data,out) {
    if (data == null) {
      return DataCodec.writeByte2(0, out);
    }
    ;
    DataCodec.writeByte2(data.size(), out);
    DataCodec.toOut(out).writeBuf(sys.ObjUtil.coerce(data, sys.Buf.type$));
    return;
  }

  static readBin(in$) {
    let len = DataCodec.readByte2(in$);
    return DataCodec.toIn(in$).readBufFully(null, len);
  }

  static writeStrPair(pair,out) {
    DataCodec.writeUtf8(pair.name(), out);
    DataCodec.writeUtf8(pair.val(), out);
    return;
  }

  static readStrPair(in$) {
    let name = DataCodec.readUtf8(in$);
    let val = DataCodec.readUtf8(in$);
    return StrPair.make(name, val);
  }

  static writeProps(props,out) {
    const this$ = this;
    if ((props == null || props.isEmpty())) {
      return DataCodec.writeVbi(0, out);
    }
    ;
    let buf = sys.Buf.make();
    props.each((val,prop) => {
      DataCodec.writeVbi(prop.id(), sys.ObjUtil.coerce(buf, sys.Obj.type$));
      let $_u3 = prop.type();
      if (sys.ObjUtil.equals($_u3, DataType.byte())) {
        DataCodec.writeByte(sys.ObjUtil.coerce(val, sys.Int.type$), sys.ObjUtil.coerce(buf, sys.Obj.type$));
      }
      else if (sys.ObjUtil.equals($_u3, DataType.byte2())) {
        DataCodec.writeByte2(sys.ObjUtil.coerce(val, sys.Int.type$), sys.ObjUtil.coerce(buf, sys.Obj.type$));
      }
      else if (sys.ObjUtil.equals($_u3, DataType.byte4())) {
        DataCodec.writeByte4(sys.ObjUtil.coerce(val, sys.Int.type$), sys.ObjUtil.coerce(buf, sys.Obj.type$));
      }
      else if (sys.ObjUtil.equals($_u3, DataType.utf8())) {
        DataCodec.writeUtf8(sys.ObjUtil.coerce(val, sys.Str.type$.toNullable()), sys.ObjUtil.coerce(buf, sys.Obj.type$));
      }
      else if (sys.ObjUtil.equals($_u3, DataType.vbi())) {
        DataCodec.writeVbi(sys.ObjUtil.coerce(val, sys.Int.type$), sys.ObjUtil.coerce(buf, sys.Obj.type$));
      }
      else if (sys.ObjUtil.equals($_u3, DataType.binary())) {
        DataCodec.writeBin(sys.ObjUtil.coerce(val, sys.Buf.type$.toNullable()), sys.ObjUtil.coerce(buf, sys.Obj.type$));
      }
      else if (sys.ObjUtil.equals($_u3, DataType.strPair())) {
        DataCodec.writeStrPair(sys.ObjUtil.coerce(val, StrPair.type$), sys.ObjUtil.coerce(buf, sys.Obj.type$));
      }
      else {
        throw sys.Err.make(sys.Str.plus("Unexpected property type: ", prop));
      }
      ;
      return;
    });
    DataCodec.writeVbi(buf.size(), out);
    DataCodec.toOut(out).writeBuf(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$));
    return;
  }

  static readProps(in$) {
    let props = Properties.make();
    let len = DataCodec.readVbi(in$);
    if (sys.ObjUtil.equals(len, 0)) {
      return props;
    }
    ;
    let buf = DataCodec.toIn(in$).readBufFully(null, len);
    while (buf.more()) {
      let id = DataCodec.readVbi(buf);
      let prop = Property.fromId(id);
      let val = null;
      let $_u4 = prop.type();
      if (sys.ObjUtil.equals($_u4, DataType.byte())) {
        (val = sys.ObjUtil.coerce(DataCodec.readByte(buf), sys.Obj.type$.toNullable()));
      }
      else if (sys.ObjUtil.equals($_u4, DataType.byte2())) {
        (val = sys.ObjUtil.coerce(DataCodec.readByte2(buf), sys.Obj.type$.toNullable()));
      }
      else if (sys.ObjUtil.equals($_u4, DataType.byte4())) {
        (val = sys.ObjUtil.coerce(DataCodec.readByte4(buf), sys.Obj.type$.toNullable()));
      }
      else if (sys.ObjUtil.equals($_u4, DataType.utf8())) {
        (val = DataCodec.readUtf8(buf));
      }
      else if (sys.ObjUtil.equals($_u4, DataType.vbi())) {
        (val = sys.ObjUtil.coerce(DataCodec.readVbi(buf), sys.Obj.type$.toNullable()));
      }
      else if (sys.ObjUtil.equals($_u4, DataType.binary())) {
        (val = DataCodec.readBin(buf));
      }
      else if (sys.ObjUtil.equals($_u4, DataType.strPair())) {
        (val = DataCodec.readStrPair(buf));
      }
      else {
        throw sys.Err.make(sys.Str.plus("Unexpected property type: ", prop));
      }
      ;
      props.add(prop, val);
    }
    ;
    return props;
  }

  static static$init() {
    DataCodec.#uint8_max = 255;
    DataCodec.#uint16_max = 65535;
    DataCodec.#uint32_max = 4294967295;
    DataCodec.#vbi_max = 268435455;
    DataCodec.#maxStr = DataCodec.#uint16_max;
    return;
  }

}

class DataType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DataType.type$; }

  static byte() { return DataType.vals().get(0); }

  static byte2() { return DataType.vals().get(1); }

  static byte4() { return DataType.vals().get(2); }

  static utf8() { return DataType.vals().get(3); }

  static vbi() { return DataType.vals().get(4); }

  static binary() { return DataType.vals().get(5); }

  static strPair() { return DataType.vals().get(6); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new DataType();
    DataType.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(DataType.type$, DataType.vals(), name$, checked);
  }

  static vals() {
    if (DataType.#vals == null) {
      DataType.#vals = sys.List.make(DataType.type$, [
        DataType.make(0, "byte", ),
        DataType.make(1, "byte2", ),
        DataType.make(2, "byte4", ),
        DataType.make(3, "utf8", ),
        DataType.make(4, "vbi", ),
        DataType.make(5, "binary", ),
        DataType.make(6, "strPair", ),
      ]).toImmutable();
    }
    return DataType.#vals;
  }

  static static$init() {
    const $_u5 = DataType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class ClientId {
  constructor() {
    const this$ = this;
  }

  typeof() { return ClientId.type$; }

  static #max_safe_len = undefined;

  static max_safe_len() {
    if (ClientId.#max_safe_len === undefined) {
      ClientId.static$init();
      if (ClientId.#max_safe_len === undefined) ClientId.#max_safe_len = 0;
    }
    return ClientId.#max_safe_len;
  }

  static #safe_chars = undefined;

  static safe_chars() {
    if (ClientId.#safe_chars === undefined) {
      ClientId.static$init();
      if (ClientId.#safe_chars === undefined) ClientId.#safe_chars = null;
    }
    return ClientId.#safe_chars;
  }

  static gen() {
    const this$ = this;
    let rand = util.Random.makeSecure();
    let chars = sys.List.make(sys.Int.type$, ClientId.max_safe_len());
    sys.Int.times(ClientId.max_safe_len(), (x) => {
      chars.add(sys.ObjUtil.coerce(sys.Str.get(ClientId.safe_chars(), rand.next(sys.Range.make(0, sys.Str.size(ClientId.safe_chars()), true))), sys.Obj.type$));
      return;
    });
    return sys.Str.fromChars(sys.ObjUtil.coerce(chars, sys.Type.find("sys::Int[]")));
  }

  static static$init() {
    ClientId.#max_safe_len = 23;
    ClientId.#safe_chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return;
  }

}

class PubSend extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#_topic = null;
    this.#fields = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Field"), sys.Type.find("sys::Obj?"));
    this.#userProps = sys.List.make(StrPair.type$);
    return;
  }

  typeof() { return PubSend.type$; }

  #client = null;

  // private field reflection only
  __client(it) { if (it === undefined) return this.#client; else this.#client = it; }

  #_topic = null;

  // private field reflection only
  ___topic(it) { if (it === undefined) return this.#_topic; else this.#_topic = it; }

  #fields = null;

  // private field reflection only
  __fields(it) { if (it === undefined) return this.#fields; else this.#fields = it; }

  #userProps = null;

  // private field reflection only
  __userProps(it) { if (it === undefined) return this.#userProps; else this.#userProps = it; }

  static make(client) {
    const $self = new PubSend();
    PubSend.make$($self,client);
    return $self;
  }

  static make$($self,client) {
    ;
    $self.#client = client;
    $self.qos(QoS.two());
    $self.payload(sys.ObjUtil.coerce(sys.Buf.make(0), sys.Buf.type$));
    return;
  }

  topic(topic) {
    this.#_topic = Topic.validateName(topic);
    return this;
  }

  payload(payload) {
    this.#fields.set(Message.type$.slot("payload"), sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(payload), sys.Buf.type$));
    return this;
  }

  qos0() {
    return this.qos(QoS.zero());
  }

  qos1() {
    return this.qos(QoS.one());
  }

  qos2() {
    return this.qos(QoS.two());
  }

  qos(qos) {
    if (sys.ObjUtil.is(qos, sys.Int.type$)) {
      (qos = QoS.vals().get(sys.ObjUtil.coerce(qos, sys.Int.type$)));
    }
    else {
      if (!sys.ObjUtil.is(qos, QoS.type$)) {
        throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot set QoS from ", qos), " ("), sys.ObjUtil.typeof(qos)), ")"));
      }
      ;
    }
    ;
    this.#fields.set(Message.type$.slot("qos"), qos);
    return this;
  }

  retain(retain) {
    this.#fields.set(Message.type$.slot("retain"), sys.ObjUtil.coerce(retain, sys.Obj.type$.toNullable()));
    return this;
  }

  utf8Payload(isUtf8) {
    this.#fields.set(Message.type$.slot("utf8Payload"), sys.ObjUtil.coerce(isUtf8, sys.Obj.type$.toNullable()));
    return this;
  }

  expiryInterval(interval) {
    this.#fields.set(Message.type$.slot("expiryInterval"), interval);
    return this;
  }

  userProp(name,value) {
    this.#userProps.add(StrPair.make(name, value));
    return this;
  }

  contentType(contentType) {
    this.#fields.set(Message.type$.slot("contentType"), contentType);
    return this;
  }

  send() {
    if (this.#_topic == null) {
      throw sys.ArgErr.make("No topic configured");
    }
    ;
    this.#fields.set(Message.type$.slot("userProps"), sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.#userProps), sys.Type.find("mqtt::StrPair[]")));
    let setter = sys.Field.makeSetFunc(this.#fields);
    let msg = Message.type$.make(sys.List.make(sys.Type.find("|sys::Obj->sys::Void|"), [setter]));
    return this.#client.publish(sys.ObjUtil.coerce(this.#_topic, sys.Str.type$), sys.ObjUtil.coerce(msg, Message.type$));
  }

}

class MqttTransport {
  constructor() {
    const this$ = this;
  }

  typeof() { return MqttTransport.type$; }

  static open(config) {
    let $_u6 = config.serverUri().scheme();
    if (sys.ObjUtil.equals($_u6, "mqtt") || sys.ObjUtil.equals($_u6, "mqtts")) {
      return TcpTransport.make(config);
    }
    else if (sys.ObjUtil.equals($_u6, "ws") || sys.ObjUtil.equals($_u6, "wss")) {
      return WsTransport.make(config);
    }
    else {
      throw MqttErr.make(sys.Str.plus("Unsupported URI scheme: ", config.serverUri()));
    }
    ;
  }

}

class TcpTransport extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TcpTransport.type$; }

  #socket = null;

  // private field reflection only
  __socket(it) { if (it === undefined) return this.#socket; else this.#socket = it; }

  static make(config) {
    const $self = new TcpTransport();
    TcpTransport.make$($self,config);
    return $self;
  }

  static make$($self,config) {
    let uri = config.serverUri();
    let port = null;
    let $_u7 = uri.scheme();
    if (sys.ObjUtil.equals($_u7, "mqtt")) {
      $self.#socket = inet.TcpSocket.make(config.socketConfig());
      (port = ((this$) => { let $_u8 = uri.port(); if ($_u8 != null) return $_u8; return sys.ObjUtil.coerce(1883, sys.Int.type$.toNullable()); })($self));
    }
    else if (sys.ObjUtil.equals($_u7, "mqtts")) {
      $self.#socket = TcpTransport.tlsSocket(config);
      (port = ((this$) => { let $_u9 = uri.port(); if ($_u9 != null) return $_u9; return sys.ObjUtil.coerce(8883, sys.Int.type$.toNullable()); })($self));
    }
    ;
    $self.#socket.connect(sys.ObjUtil.coerce(inet.IpAddr.make(sys.ObjUtil.coerce(uri.host(), sys.Str.type$)), inet.IpAddr.type$), sys.ObjUtil.coerce(port, sys.Int.type$));
    return;
  }

  static tlsSocket(config) {
    return inet.TcpSocket.make(config.socketConfig()).upgradeTls();
  }

  send(msg) {
    this.#socket.out().writeBuf(msg).flush();
    return;
  }

  in() {
    return this.#socket.in();
  }

  close() {
    this.#socket.close();
    return;
  }

  isClosed() {
    return (this.#socket.isClosed() || !this.#socket.isConnected());
  }

}

class WsTransport extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WsTransport.type$; }

  #socket = null;

  // private field reflection only
  __socket(it) { if (it === undefined) return this.#socket; else this.#socket = it; }

  #wsIn = null;

  // private field reflection only
  __wsIn(it) { if (it === undefined) return this.#wsIn; else this.#wsIn = it; }

  static make(config) {
    const $self = new WsTransport();
    WsTransport.make$($self,config);
    return $self;
  }

  static make$($self,config) {
    $self.#socket = web.WebSocket.openClient(config.serverUri(), sys.Map.__fromLiteral(["Sec-WebSocket-Protocol"], ["mqtt"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    $self.#wsIn = WsInStream.make($self.#socket);
    return;
  }

  send(msg) {
    this.#socket.send(msg);
    return;
  }

  in() {
    return this.#wsIn;
  }

  close() {
    this.#socket.close();
    return;
  }

  isClosed() {
    return this.#socket.isClosed();
  }

}

class WsInStream extends sys.InStream {
  constructor() {
    super();
    const this$ = this;
    this.#curFrame = sys.ObjUtil.coerce(sys.Buf.make(0), sys.Buf.type$);
    return;
  }

  typeof() { return WsInStream.type$; }

  #socket = null;

  // private field reflection only
  __socket(it) { if (it === undefined) return this.#socket; else this.#socket = it; }

  #curFrame = null;

  // private field reflection only
  __curFrame(it) { if (it === undefined) return this.#curFrame; else this.#curFrame = it; }

  static make(socket) {
    const $self = new WsInStream();
    WsInStream.make$($self,socket);
    return $self;
  }

  static make$($self,socket) {
    sys.InStream.make$($self, null);
    ;
    $self.#socket = socket;
    return;
  }

  frame() {
    if (!this.#curFrame.more()) {
      this.#curFrame = sys.ObjUtil.coerce(this.#socket.receive(), sys.Buf.type$);
    }
    ;
    return this.#curFrame;
  }

  read() {
    return this.frame().read();
  }

  readBuf(buf,n) {
    (n = sys.Int.min(n, this.frame().remaining()));
    buf.writeBuf(this.frame(), n);
    return sys.ObjUtil.coerce(n, sys.Int.type$.toNullable());
  }

  unread(b) {
    throw sys.IOErr.make("Unsupported");
  }

}

class Message extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#utf8Payload = false;
    this.#expiryInterval = null;
    this.#topicAlias = null;
    this.#responseTopic = null;
    this.#correlationData = null;
    this.#userProps = sys.ObjUtil.coerce(((this$) => { let $_u10 = sys.List.make(StrPair.type$); if ($_u10 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(StrPair.type$)); })(this), sys.Type.find("mqtt::StrPair[]"));
    this.#subscriptionIds = sys.ObjUtil.coerce(((this$) => { let $_u11 = sys.List.make(sys.Int.type$); if ($_u11 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Int.type$)); })(this), sys.Type.find("sys::Int[]"));
    this.#contentType = null;
    return;
  }

  typeof() { return Message.type$; }

  #payload = null;

  payload() { return this.#payload; }

  __payload(it) { if (it === undefined) return this.#payload; else this.#payload = it; }

  #qos = null;

  qos() { return this.#qos; }

  __qos(it) { if (it === undefined) return this.#qos; else this.#qos = it; }

  #retain = false;

  retain() { return this.#retain; }

  __retain(it) { if (it === undefined) return this.#retain; else this.#retain = it; }

  #utf8Payload = false;

  utf8Payload() { return this.#utf8Payload; }

  __utf8Payload(it) { if (it === undefined) return this.#utf8Payload; else this.#utf8Payload = it; }

  #expiryInterval = null;

  expiryInterval() { return this.#expiryInterval; }

  __expiryInterval(it) { if (it === undefined) return this.#expiryInterval; else this.#expiryInterval = it; }

  #topicAlias = null;

  topicAlias() { return this.#topicAlias; }

  __topicAlias(it) { if (it === undefined) return this.#topicAlias; else this.#topicAlias = it; }

  #responseTopic = null;

  responseTopic() { return this.#responseTopic; }

  __responseTopic(it) { if (it === undefined) return this.#responseTopic; else this.#responseTopic = it; }

  #correlationData = null;

  correlationData() { return this.#correlationData; }

  __correlationData(it) { if (it === undefined) return this.#correlationData; else this.#correlationData = it; }

  #userProps = null;

  userProps() { return this.#userProps; }

  __userProps(it) { if (it === undefined) return this.#userProps; else this.#userProps = it; }

  #subscriptionIds = null;

  subscriptionIds() { return this.#subscriptionIds; }

  __subscriptionIds(it) { if (it === undefined) return this.#subscriptionIds; else this.#subscriptionIds = it; }

  #contentType = null;

  contentType() { return this.#contentType; }

  __contentType(it) { if (it === undefined) return this.#contentType; else this.#contentType = it; }

  static make(f) {
    const $self = new Message();
    Message.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ;
    sys.Func.call(f, $self);
    return;
  }

  static makeFields(payload,qos,retain,f) {
    const $self = new Message();
    Message.makeFields$($self,payload,qos,retain,f);
    return $self;
  }

  static makeFields$($self,payload,qos,retain,f) {
    if (qos === undefined) qos = QoS.one();
    if (retain === undefined) retain = false;
    if (f === undefined) f = null;
    ;
    ((this$) => { let $_u12 = f; if ($_u12 == null) return null; return sys.Func.call(f, this$); })($self);
    $self.#payload = sys.ObjUtil.coerce(((this$) => { let $_u13 = payload; if ($_u13 == null) return null; return sys.ObjUtil.toImmutable(payload); })($self), sys.Buf.type$);
    $self.#qos = qos;
    $self.#retain = retain;
    return;
  }

  props() {
    const this$ = this;
    let props = Properties.make().add(Property.payloadFormatIndicator(), sys.ObjUtil.coerce(((this$) => { if (this$.#utf8Payload) return 1; return 0; })(this), sys.Obj.type$.toNullable())).add(Property.messageExpiryInterval(), sys.ObjUtil.coerce(((this$) => { let $_u15 = this$.#expiryInterval; if ($_u15 == null) return null; return this$.#expiryInterval.toSec(); })(this), sys.Obj.type$.toNullable())).add(Property.topicAlias(), sys.ObjUtil.coerce(this.#topicAlias, sys.Obj.type$.toNullable())).add(Property.responseTopic(), this.#responseTopic).add(Property.correlationData(), this.#correlationData).add(Property.contentType(), this.#contentType);
    this.#userProps.each((userProp) => {
      props.add(Property.userProperty(), userProp);
      return;
    });
    this.#subscriptionIds.each((id) => {
      props.add(Property.subscriptionId(), sys.ObjUtil.coerce(id, sys.Obj.type$.toNullable()));
      return;
    });
    return props;
  }

}

class ClientListener {
  constructor() {
    const this$ = this;
  }

  typeof() { return ClientListener.type$; }

  onConnected() {
    return;
  }

  onDisconnected(err) {
    return;
  }

}

class ClientListeners extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#listenersRef = sys.Unsafe.make(sys.List.make(ClientListener.type$));
    return;
  }

  typeof() { return ClientListeners.type$; }

  #client = null;

  // private field reflection only
  __client(it) { if (it === undefined) return this.#client; else this.#client = it; }

  #listenersRef = null;

  // private field reflection only
  __listenersRef(it) { if (it === undefined) return this.#listenersRef; else this.#listenersRef = it; }

  static make(client) {
    const $self = new ClientListeners();
    ClientListeners.make$($self,client);
    return $self;
  }

  static make$($self,client) {
    concurrent.Actor.make$($self, client.config().pool());
    ;
    $self.#client = client;
    return;
  }

  log() {
    return this.#client.log();
  }

  listeners() {
    return sys.ObjUtil.coerce(this.#listenersRef.val(), sys.Type.find("mqtt::ClientListener[]"));
  }

  addListener(listener) {
    this.send(concurrent.ActorMsg.make1("add", sys.Unsafe.make(listener))).get();
    return;
  }

  fireConnected() {
    return this.send(concurrent.ActorMsg.make0("connected"));
  }

  fireDisconnected(err,isClientDisconnect) {
    if (isClientDisconnect === undefined) isClientDisconnect = false;
    return this.send(concurrent.ActorMsg.make2("disconnected", err, sys.ObjUtil.coerce(isClientDisconnect, sys.Obj.type$.toNullable())));
  }

  receive(obj) {
    let msg = sys.ObjUtil.coerce(obj, concurrent.ActorMsg.type$);
    let $_u16 = msg.id();
    if (sys.ObjUtil.equals($_u16, "add")) {
      return this.onAddListener(sys.ObjUtil.coerce(sys.ObjUtil.trap(msg.a(),"val", sys.List.make(sys.Obj.type$.toNullable(), [])), ClientListener.type$));
    }
    else if (sys.ObjUtil.equals($_u16, "connected")) {
      return this.onConnected();
    }
    else if (sys.ObjUtil.equals($_u16, "disconnected")) {
      return this.onDisconnected(sys.ObjUtil.coerce(msg.a(), sys.Err.type$.toNullable()), sys.ObjUtil.coerce(msg.b(), sys.Bool.type$));
    }
    else {
      throw sys.ArgErr.make(sys.Str.plus("Unexpected msg: ", msg));
    }
    ;
  }

  onAddListener(listener) {
    this.listeners().add(listener);
    return sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable());
  }

  onConnected() {
    const this$ = this;
    this.listeners().each((listener) => {
      try {
        listener.onConnected();
      }
      catch ($_u17) {
        $_u17 = sys.Err.make($_u17);
        if ($_u17 instanceof sys.Err) {
          let err = $_u17;
          ;
          this$.log().err(sys.Str.plus(sys.Str.plus("Listener ", listener), " failed onConnected"), err);
        }
        else {
          throw $_u17;
        }
      }
      ;
      return;
    });
    return null;
  }

  onDisconnected(err,isClientDisconnect) {
    const this$ = this;
    this.listeners().each((listener) => {
      if ((isClientDisconnect && sys.ObjUtil.is(listener, ClientAutoReconnect.type$))) {
        return;
      }
      ;
      try {
        listener.onDisconnected(err);
      }
      catch ($_u18) {
        $_u18 = sys.Err.make($_u18);
        if ($_u18 instanceof sys.Err) {
          let error = $_u18;
          ;
          this$.log().err(sys.Str.plus(sys.Str.plus("Listener ", listener), " failed onDisconnected"), error);
        }
        else {
          throw $_u18;
        }
      }
      ;
      return;
    });
    return null;
  }

}

class ClientConfig extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#version = MqttVersion.v3_1_1();
    this.#clientId = ClientId.gen();
    this.#serverUri = sys.Uri.fromStr("mqtt://localhost:1883");
    this.#socketConfig = inet.SocketConfig.cur().copy((it) => {
      it.__connectTimeout(sys.Duration.fromStr("10sec"));
      it.__receiveTimeout(null);
      return;
    });
    this.#mqttConnectTimeout = sys.Duration.fromStr("10sec");
    this.#maxInFlight = 1000;
    this.#maxRetry = 0;
    this.#retryInterval = sys.Duration.fromStr("10sec");
    return;
  }

  typeof() { return ClientConfig.type$; }

  #version = null;

  version() { return this.#version; }

  __version(it) { if (it === undefined) return this.#version; else this.#version = it; }

  #clientId = null;

  clientId() { return this.#clientId; }

  __clientId(it) { if (it === undefined) return this.#clientId; else this.#clientId = it; }

  #serverUri = null;

  serverUri() { return this.#serverUri; }

  __serverUri(it) { if (it === undefined) return this.#serverUri; else this.#serverUri = it; }

  #socketConfig = null;

  socketConfig() { return this.#socketConfig; }

  __socketConfig(it) { if (it === undefined) return this.#socketConfig; else this.#socketConfig = it; }

  #mqttConnectTimeout = null;

  mqttConnectTimeout() { return this.#mqttConnectTimeout; }

  __mqttConnectTimeout(it) { if (it === undefined) return this.#mqttConnectTimeout; else this.#mqttConnectTimeout = it; }

  #maxInFlight = 0;

  maxInFlight() { return this.#maxInFlight; }

  __maxInFlight(it) { if (it === undefined) return this.#maxInFlight; else this.#maxInFlight = it; }

  #pool = null;

  pool() { return this.#pool; }

  __pool(it) { if (it === undefined) return this.#pool; else this.#pool = it; }

  #persistence = null;

  persistence() { return this.#persistence; }

  __persistence(it) { if (it === undefined) return this.#persistence; else this.#persistence = it; }

  #maxRetry = 0;

  maxRetry() { return this.#maxRetry; }

  __maxRetry(it) { if (it === undefined) return this.#maxRetry; else this.#maxRetry = it; }

  #retryInterval = null;

  retryInterval() { return this.#retryInterval; }

  __retryInterval(it) { if (it === undefined) return this.#retryInterval; else this.#retryInterval = it; }

  static make(f) {
    const $self = new ClientConfig();
    ClientConfig.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    const this$ = $self;
    ;
    sys.Func.call(f, $self);
    if ($self.#pool == null) {
      $self.#pool = concurrent.ActorPool.make((it) => {
        it.__name(sys.Str.plus(sys.Str.plus("", this$.#clientId), "-MqttPool"));
        return;
      });
    }
    ;
    if ($self.#persistence == null) {
      $self.#persistence = ClientMemDb.make();
    }
    ;
    if ((sys.ObjUtil.compareLT($self.#maxInFlight, 1) || sys.ObjUtil.compareGT($self.#maxInFlight, MqttConst.maxPacketId()))) {
      throw sys.ArgErr.make(sys.Str.plus("Invalid maxInFlight: ", sys.ObjUtil.coerce($self.#maxInFlight, sys.Obj.type$.toNullable())));
    }
    ;
    return;
  }

  timeout() {
    return this.#retryInterval.mult(this.#maxRetry).plus(this.#retryInterval);
  }

}

class ClientAutoReconnect {
  constructor() {
    const this$ = this;
  }

  typeof() { return ClientAutoReconnect.type$; }

  onDisconnected() { return ClientListener.prototype.onDisconnected.apply(this, arguments); }

  onConnected() { return ClientListener.prototype.onConnected.apply(this, arguments); }

}

class DefaultAutoReconnect extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#curDelay = concurrent.AtomicInt.make(-1);
    this.#numRetries = concurrent.AtomicInt.make(0);
    this.#disconnectTs = concurrent.AtomicInt.make(0);
    return;
  }

  typeof() { return DefaultAutoReconnect.type$; }

  onConnected() { return ClientListener.prototype.onConnected.apply(this, arguments); }

  #client = null;

  // private field reflection only
  __client(it) { if (it === undefined) return this.#client; else this.#client = it; }

  #initialDelay = null;

  initialDelay() { return this.#initialDelay; }

  __initialDelay(it) { if (it === undefined) return this.#initialDelay; else this.#initialDelay = it; }

  #maxDelay = null;

  maxDelay() { return this.#maxDelay; }

  __maxDelay(it) { if (it === undefined) return this.#maxDelay; else this.#maxDelay = it; }

  #curDelay = null;

  // private field reflection only
  __curDelay(it) { if (it === undefined) return this.#curDelay; else this.#curDelay = it; }

  #numRetries = null;

  // private field reflection only
  __numRetries(it) { if (it === undefined) return this.#numRetries; else this.#numRetries = it; }

  #disconnectTs = null;

  // private field reflection only
  __disconnectTs(it) { if (it === undefined) return this.#disconnectTs; else this.#disconnectTs = it; }

  static #reconnectMsg = undefined;

  static reconnectMsg() {
    if (DefaultAutoReconnect.#reconnectMsg === undefined) {
      DefaultAutoReconnect.static$init();
      if (DefaultAutoReconnect.#reconnectMsg === undefined) DefaultAutoReconnect.#reconnectMsg = null;
    }
    return DefaultAutoReconnect.#reconnectMsg;
  }

  static make(client,f) {
    const $self = new DefaultAutoReconnect();
    DefaultAutoReconnect.make$($self,client,f);
    return $self;
  }

  static make$($self,client,f) {
    if (f === undefined) f = null;
    concurrent.Actor.makeCoalescing$($self, client.config().pool(), null, null);
    ;
    ((this$) => { let $_u19 = f; if ($_u19 == null) return null; return sys.Func.call(f, this$); })($self);
    $self.#client = client;
    return;
  }

  log() {
    return this.#client.log();
  }

  onDisconnected(err) {
    this.send(concurrent.ActorMsg.make1("disconnect", err));
    return;
  }

  receive(obj) {
    let msg = sys.ObjUtil.coerce(obj, concurrent.ActorMsg.type$);
    let $_u20 = msg.id();
    if (sys.ObjUtil.equals($_u20, "disconnect")) {
      return this.onInitialDisconnect();
    }
    else if (sys.ObjUtil.equals($_u20, "reconnect")) {
      return this.onReconnect();
    }
    else {
      throw sys.Err.make(sys.Str.plus("Unexpected msg: ", msg));
    }
    ;
  }

  onInitialDisconnect() {
    this.#disconnectTs.val(sys.DateTime.nowTicks());
    this.#curDelay.val(this.#initialDelay.ticks());
    this.log().info("Client disconnected. Attempting to reconnect...");
    return this.sendLater(this.#initialDelay, DefaultAutoReconnect.reconnectMsg());
  }

  onReconnect() {
    try {
      this.#client.connect().get();
      let elapsed = sys.Duration.make(sys.Int.minus(sys.DateTime.nowTicks(), this.#disconnectTs.val()));
      this.log().info(sys.Str.plus(sys.Str.plus("Reconnected after ", elapsed.toLocale()), "!"));
      this.#numRetries.val(0);
    }
    catch ($_u21) {
      $_u21 = sys.Err.make($_u21);
      if ($_u21 instanceof sys.Err) {
        let err = $_u21;
        ;
        this.scheduleNextAttempt(err);
      }
      else {
        throw $_u21;
      }
    }
    ;
    return null;
  }

  scheduleNextAttempt(err) {
    if (err === undefined) err = null;
    this.#numRetries.increment();
    this.#curDelay.val(sys.Int.min(sys.Int.mult(2, this.#curDelay.val()), this.#maxDelay.ticks()));
    let dur = sys.Duration.make(this.#curDelay.val());
    this.debug(sys.Str.plus(sys.Str.plus(sys.Str.plus("Reconnect [", sys.ObjUtil.coerce(this.#numRetries.val(), sys.Obj.type$.toNullable())), "] failed. Next attempt in "), dur.toLocale()), err);
    this.sendLater(sys.ObjUtil.coerce(dur, sys.Duration.type$), DefaultAutoReconnect.reconnectMsg());
    return;
  }

  debug(msg,err) {
    if (err === undefined) err = null;
    if (this.log().isDebug()) {
      this.log().debug(msg, err);
    }
    ;
    return;
  }

  static static$init() {
    DefaultAutoReconnect.#reconnectMsg = concurrent.ActorMsg.make0("reconnect");
    return;
  }

}

class MqttClient extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#stateRef = concurrent.AtomicRef.make(ClientState.disconnected());
    this.#transportRef = concurrent.AtomicRef.make(sys.Unsafe.make(null));
    this.#lastPacketSent = concurrent.AtomicInt.make(0);
    this.#lastPacketReceived = concurrent.AtomicInt.make(0);
    this.#quota = concurrent.AtomicInt.make(sys.Int.maxVal());
    this.#subMgrRef = sys.Unsafe.make(ClientSubMgr.make(this));
    this.#terminated = concurrent.AtomicBool.make(false);
    this.#pendingConnectRef = concurrent.AtomicRef.make(MqttClient.notConnected());
    this.#clientIdRef = concurrent.AtomicRef.make();
    this.#pendingAcks = concurrent.ConcurrentMap.make();
    this.#lastPacketId = concurrent.AtomicInt.make(MqttConst.maxPacketId());
    return;
  }

  typeof() { return MqttClient.type$; }

  static maxPacketId() { return MqttConst.maxPacketId(); }

  static minSubId() { return MqttConst.minSubId(); }

  static minPacketId() { return MqttConst.minPacketId(); }

  static sessionNeverExpires() { return MqttConst.sessionNeverExpires(); }

  static sessionExpiresOnClose() { return MqttConst.sessionExpiresOnClose(); }

  static maxSubId() { return MqttConst.maxSubId(); }

  #config = null;

  config() { return this.#config; }

  __config(it) { if (it === undefined) return this.#config; else this.#config = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  static #housekeeping = undefined;

  static housekeeping() {
    if (MqttClient.#housekeeping === undefined) {
      MqttClient.static$init();
      if (MqttClient.#housekeeping === undefined) MqttClient.#housekeeping = null;
    }
    return MqttClient.#housekeeping;
  }

  #packetReader = null;

  packetReader() { return this.#packetReader; }

  __packetReader(it) { if (it === undefined) return this.#packetReader; else this.#packetReader = it; }

  #packetWriter = null;

  packetWriter() { return this.#packetWriter; }

  __packetWriter(it) { if (it === undefined) return this.#packetWriter; else this.#packetWriter = it; }

  #stateRef = null;

  stateRef() { return this.#stateRef; }

  __stateRef(it) { if (it === undefined) return this.#stateRef; else this.#stateRef = it; }

  #transportRef = null;

  transportRef() { return this.#transportRef; }

  __transportRef(it) { if (it === undefined) return this.#transportRef; else this.#transportRef = it; }

  #lastPacketSent = null;

  lastPacketSent() { return this.#lastPacketSent; }

  __lastPacketSent(it) { if (it === undefined) return this.#lastPacketSent; else this.#lastPacketSent = it; }

  #lastPacketReceived = null;

  lastPacketReceived() { return this.#lastPacketReceived; }

  __lastPacketReceived(it) { if (it === undefined) return this.#lastPacketReceived; else this.#lastPacketReceived = it; }

  #quota = null;

  quota() { return this.#quota; }

  __quota(it) { if (it === undefined) return this.#quota; else this.#quota = it; }

  #subMgrRef = null;

  // private field reflection only
  __subMgrRef(it) { if (it === undefined) return this.#subMgrRef; else this.#subMgrRef = it; }

  #listeners = null;

  listeners() { return this.#listeners; }

  __listeners(it) { if (it === undefined) return this.#listeners; else this.#listeners = it; }

  #terminated = null;

  // private field reflection only
  __terminated(it) { if (it === undefined) return this.#terminated; else this.#terminated = it; }

  #pendingConnectRef = null;

  pendingConnectRef() { return this.#pendingConnectRef; }

  __pendingConnectRef(it) { if (it === undefined) return this.#pendingConnectRef; else this.#pendingConnectRef = it; }

  #clientIdRef = null;

  clientIdRef() { return this.#clientIdRef; }

  __clientIdRef(it) { if (it === undefined) return this.#clientIdRef; else this.#clientIdRef = it; }

  #pendingAcks = null;

  // private field reflection only
  __pendingAcks(it) { if (it === undefined) return this.#pendingAcks; else this.#pendingAcks = it; }

  #lastPacketId = null;

  // private field reflection only
  __lastPacketId(it) { if (it === undefined) return this.#lastPacketId; else this.#lastPacketId = it; }

  static make(config,log) {
    const $self = new MqttClient();
    MqttClient.make$($self,config,log);
    return $self;
  }

  static make$($self,config,log) {
    if (log === undefined) log = sys.Log.get(config.pool().name());
    const this$ = $self;
    concurrent.Actor.makeCoalescing$($self, config.pool(), (msg) => {
      if (!sys.ObjUtil.is(msg, concurrent.ActorMsg.type$)) {
        return null;
      }
      ;
      return ((this$) => { if (sys.ObjUtil.equals(sys.ObjUtil.coerce(msg, concurrent.ActorMsg.type$).id(), "shutdown")) return "shutdown"; return null; })(this$);
    }, null, null);
    ;
    $self.#config = config;
    $self.#log = log;
    $self.#packetReader = PacketReaderActor.make($self);
    $self.#packetWriter = PacketWriterActor.make($self);
    $self.#listeners = ClientListeners.make($self);
    return;
  }

  state() {
    return sys.ObjUtil.coerce(this.#stateRef.val(), ClientState.type$);
  }

  transport() {
    return sys.ObjUtil.coerce(((this$) => { let $_u23 = sys.ObjUtil.as(this$.#transportRef.val(), sys.Unsafe.type$); if ($_u23 == null) return null; return sys.ObjUtil.as(this$.#transportRef.val(), sys.Unsafe.type$).val(); })(this), MqttTransport.type$.toNullable());
  }

  subMgr() {
    return sys.ObjUtil.coerce(this.#subMgrRef.val(), ClientSubMgr.type$);
  }

  isTerminated() {
    return this.#terminated.val();
  }

  pendingConnect() {
    return sys.ObjUtil.coerce(this.#pendingConnectRef.val(), PendingConn.type$);
  }

  clientId() {
    return sys.ObjUtil.coerce(this.#clientIdRef.val(), sys.Str.type$);
  }

  nextPacketId() {
    for (let i = 0; sys.ObjUtil.compareLT(i, MqttConst.maxPacketId()); i = sys.Int.increment(i)) {
      let id = this.#lastPacketId.incrementAndGet();
      if (sys.ObjUtil.compareGT(id, MqttConst.maxPacketId())) {
        (id = MqttConst.minPacketId());
        this.#lastPacketId.val(id);
      }
      ;
      if (this.#pendingAcks.get(sys.ObjUtil.coerce(id, sys.Obj.type$)) == null) {
        return id;
      }
      ;
    }
    ;
    throw MqttErr.make(sys.Str.plus("No available packet identifiers: ", sys.ObjUtil.coerce(this.#pendingAcks.size(), sys.Obj.type$.toNullable())));
  }

  sendPacket(packet,pending) {
    this.#pendingAcks.set(sys.ObjUtil.coerce(packet.pid(), sys.Obj.type$), pending.touch());
    this.#packetWriter.send(packet);
    return pending;
  }

  freePending(arg) {
    let pid = sys.ObjUtil.as(arg, sys.Int.type$);
    if (pid == null) {
      (pid = sys.ObjUtil.coerce(sys.ObjUtil.coerce(arg, ControlPacket.type$).pid(), sys.Int.type$.toNullable()));
    }
    ;
    return sys.ObjUtil.coerce(this.#pendingAcks.remove(sys.ObjUtil.coerce(pid, sys.Obj.type$)), PendingAck.type$.toNullable());
  }

  finishPending(pending) {
    this.freePending(sys.ObjUtil.coerce(pending.packetId(), sys.Obj.type$));
    if (pending.persistKey() != null) {
      this.#config.persistence().remove(sys.ObjUtil.coerce(pending.persistKey(), sys.Str.type$));
      this.#quota.increment();
    }
    ;
    return;
  }

  enableAutoReconnect(initialDelay,maxDelay) {
    if (initialDelay === undefined) initialDelay = sys.Duration.fromStr("1sec");
    if (maxDelay === undefined) maxDelay = sys.Duration.fromStr("2min");
    const this$ = this;
    return this.addListener(DefaultAutoReconnect.make(this, (it) => {
      it.__initialDelay(initialDelay.max(sys.Duration.fromStr("500ms")));
      it.__maxDelay(maxDelay.max(sys.Duration.fromStr("1sec")));
      return;
    }));
  }

  addListener(listener) {
    this.#listeners.addListener(listener);
    return this;
  }

  connect(config) {
    if (config === undefined) config = ConnectConfig.make();
    return sys.ObjUtil.coerce(this.send(concurrent.ActorMsg.make1("connect", config)).get(), concurrent.Future.type$);
  }

  publish(topic,msg) {
    return sys.ObjUtil.coerce(this.sendWhenComplete(this.pendingConnect().resp(), concurrent.ActorMsg.make1("publish", Publish.makeFields(topic, msg))).get(), concurrent.Future.type$);
  }

  publishWith() {
    return PubSend.make(this);
  }

  subscribe(filter,opts,listener) {
    let sub = Subscribe.makeFields(sys.List.make(sys.Str.type$, [filter]), sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(opts, sys.Obj.type$.toNullable())]));
    let msg = concurrent.ActorMsg.make2("subscribe", sub, sys.Unsafe.make(listener));
    return sys.ObjUtil.coerce(this.sendWhenComplete(this.pendingConnect().resp(), msg).get(), concurrent.Future.type$);
  }

  subscribeWith() {
    return SubSend.make(this);
  }

  unsubscribe(topicFilter) {
    let unsub = Unsubscribe.makeFields(sys.List.make(sys.Str.type$, [topicFilter]));
    let msg = concurrent.ActorMsg.make1("unsubscribe", unsub);
    return sys.ObjUtil.coerce(this.sendWhenComplete(this.pendingConnect().resp(), msg).get(), concurrent.Future.type$);
  }

  disconnect() {
    return this.sendWhenComplete(this.pendingConnect().resp(), concurrent.ActorMsg.make1("disconnect", Disconnect.make()));
  }

  terminate() {
    this.#terminated.val(true);
    try {
      this.onShutdown();
    }
    finally {
      this.#config.pool().stop();
    }
    ;
    return this;
  }

  receive(obj) {
    let msg = sys.ObjUtil.as(obj, concurrent.ActorMsg.type$);
    if (msg === MqttClient.housekeeping()) {
      return this.onHousekeeping(sys.ObjUtil.coerce(msg.a(), concurrent.ActorMsg.type$.toNullable()));
    }
    ;
    try {
      let $_u24 = ((this$) => { let $_u25=msg; return ($_u25==null) ? null : $_u25.id(); })(this);
      if (sys.ObjUtil.equals($_u24, "connect")) {
        return this.onConnect(sys.ObjUtil.coerce(msg.a(), ConnectConfig.type$));
      }
      else if (sys.ObjUtil.equals($_u24, "publish")) {
        return this.onPublish(sys.ObjUtil.coerce(msg.a(), Publish.type$));
      }
      else if (sys.ObjUtil.equals($_u24, "subscribe")) {
        return this.onSubscribe(sys.ObjUtil.coerce(msg.a(), Subscribe.type$), sys.ObjUtil.coerce(sys.ObjUtil.coerce(msg.b(), sys.Unsafe.type$).val(), SubscriptionListener.type$));
      }
      else if (sys.ObjUtil.equals($_u24, "unsubscribe")) {
        return this.onUnsubscribe(sys.ObjUtil.coerce(msg.a(), Unsubscribe.type$));
      }
      else if (sys.ObjUtil.equals($_u24, "disconnect")) {
        return this.onDisconnect(sys.ObjUtil.coerce(msg.a(), Disconnect.type$));
      }
      else if (sys.ObjUtil.equals($_u24, "recv")) {
        return this.onRecv(sys.ObjUtil.coerce(msg.a(), ControlPacket.type$));
      }
      else if (sys.ObjUtil.equals($_u24, "shutdown")) {
        return this.onShutdown(sys.ObjUtil.coerce(msg.a(), sys.Err.type$.toNullable()));
      }
      ;
    }
    catch ($_u26) {
      $_u26 = sys.Err.make($_u26);
      if ($_u26 instanceof sys.Err) {
        let err = $_u26;
        ;
        let packet = sys.ObjUtil.as(msg.a(), ControlPacket.type$);
        if (packet != null) {
          this.freePending(sys.ObjUtil.coerce(packet, sys.Obj.type$));
        }
        ;
        throw err;
      }
      else {
        throw $_u26;
      }
    }
    ;
    throw MqttErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unexpected message: ", obj), " ("), ((this$) => { let $_u27 = obj; if ($_u27 == null) return null; return sys.ObjUtil.typeof(obj); })(this)), ")"));
  }

  onConnect(config) {
    return ClientConnectHandler.make(this, config).run();
  }

  onPublish(packet) {
    return ClientPublishHandler.make(this).publish(packet);
  }

  onSubscribe(packet,listener) {
    return this.subMgr().subscribe(packet, listener);
  }

  onUnsubscribe(packet) {
    return this.subMgr().unsubscribe(packet);
  }

  onPingReq(ping) {
    this.#packetWriter.send(ping);
    return null;
  }

  onDisconnect(disconnect) {
    try {
      this.transition(ClientState.connected(), ClientState.disconnecting());
      this.#packetWriter.send(disconnect).get(sys.Duration.fromStr("10sec"));
    }
    catch ($_u28) {
      $_u28 = sys.Err.make($_u28);
      if ($_u28 instanceof sys.Err) {
        let ignore = $_u28;
        ;
      }
      else {
        throw $_u28;
      }
    }
    finally {
      this.onShutdown();
    }
    ;
    return null;
  }

  packetReceived(packet) {
    this.#lastPacketReceived.val(sys.Duration.nowTicks());
    this.send(concurrent.ActorMsg.make1("recv", packet));
    return;
  }

  onRecv(packet) {
    try {
      let $_u29 = packet.type();
      if (sys.ObjUtil.equals($_u29, PacketType.connack())) {
        return ClientConnAckHandler.make(this, sys.ObjUtil.coerce(packet, ConnAck.type$)).run();
      }
      else if (sys.ObjUtil.equals($_u29, PacketType.pingresp())) {
        return null;
      }
      else if (sys.ObjUtil.equals($_u29, PacketType.publish())) {
        return ClientPublishHandler.make(this).deliver(sys.ObjUtil.coerce(packet, Publish.type$));
      }
      else if (sys.ObjUtil.equals($_u29, PacketType.pubrel())) {
        return ClientPublishHandler.make(this).pubRel(sys.ObjUtil.coerce(packet, PubRel.type$));
      }
      else if (sys.ObjUtil.equals($_u29, PacketType.disconnect())) {
        return this.onReceiveDisconnect(sys.ObjUtil.coerce(packet, Disconnect.type$));
      }
      ;
    }
    catch ($_u30) {
      $_u30 = sys.Err.make($_u30);
      if ($_u30 instanceof sys.Err) {
        let err = $_u30;
        ;
        this.#log.err(sys.Str.plus("Failed to handle incoming packet: ", packet.type()), err);
        return null;
      }
      else {
        throw $_u30;
      }
    }
    ;
    let pending = this.freePending(packet);
    if (pending == null) {
      this.debug(sys.Str.plus("Unexpected: ", packet.type()));
      return null;
    }
    ;
    try {
      let $_u31 = packet.type();
      if (sys.ObjUtil.equals($_u31, PacketType.puback())) {
        ClientPublishHandler.make(this).pubAck(sys.ObjUtil.coerce(packet, PubAck.type$), sys.ObjUtil.coerce(pending, PendingAck.type$));
      }
      else if (sys.ObjUtil.equals($_u31, PacketType.pubrec())) {
        ClientPublishHandler.make(this).pubRec(sys.ObjUtil.coerce(packet, PubRec.type$), sys.ObjUtil.coerce(pending, PendingAck.type$));
      }
      else if (sys.ObjUtil.equals($_u31, PacketType.pubcomp())) {
        ClientPublishHandler.make(this).pubComp(sys.ObjUtil.coerce(packet, PubComp.type$), sys.ObjUtil.coerce(pending, PendingAck.type$));
      }
      else if (sys.ObjUtil.equals($_u31, PacketType.suback())) {
        this.subMgr().subAck(sys.ObjUtil.coerce(packet, SubAck.type$), sys.ObjUtil.coerce(pending, PendingAck.type$));
      }
      else if (sys.ObjUtil.equals($_u31, PacketType.unsuback())) {
        this.subMgr().unsubAck(sys.ObjUtil.coerce(packet, UnsubAck.type$), sys.ObjUtil.coerce(pending, PendingAck.type$));
      }
      ;
      if ((packet.type() !== PacketType.pubrec() && !pending.isComplete())) {
        pending.resp().complete(packet);
      }
      ;
    }
    catch ($_u32) {
      $_u32 = sys.Err.make($_u32);
      if ($_u32 instanceof sys.Err) {
        let err = $_u32;
        ;
        this.#log.err(sys.Str.plus("Failed to process ack for ", packet.type()), err);
        if (!pending.isComplete()) {
          pending.resp().completeErr(err);
        }
        ;
      }
      else {
        throw $_u32;
      }
    }
    ;
    return null;
  }

  onReceiveDisconnect(disconnect) {
    this.#log.info(sys.Str.plus("Server requested DISCONNECT: ", disconnect.reason()));
    this.onShutdown();
    return null;
  }

  onHousekeeping(msg) {
    if (!this.canMessage()) {
      return null;
    }
    ;
    try {
      if (this.checkConnackReceived()) {
        this.checkKeepAlive();
        this.checkPending();
      }
      ;
    }
    catch ($_u33) {
      $_u33 = sys.Err.make($_u33);
      if ($_u33 instanceof sys.Err) {
        let err = $_u33;
        ;
        this.#log.err("Houskeeping failed", err);
      }
      else {
        throw $_u33;
      }
    }
    ;
    this.sendLater(sys.Duration.fromStr("1sec"), MqttClient.housekeeping());
    return null;
  }

  checkConnackReceived() {
    let req = this.pendingConnect();
    if (req.isComplete()) {
      return true;
    }
    else {
      if (sys.ObjUtil.compareGT(sys.Int.minus(sys.Duration.nowTicks(), req.created()), this.#config.mqttConnectTimeout().ticks())) {
        req.resp().completeErr(sys.ObjUtil.coerce(this.onShutdown(sys.TimeoutErr.make(sys.Str.plus("CONNACK not received within ", this.#config.mqttConnectTimeout().toLocale()))), sys.Err.type$));
      }
      ;
    }
    ;
    return false;
  }

  checkKeepAlive() {
    let server = this.pendingConnect().connack().props().get(Property.serverKeepAlive());
    let ticks = ((this$) => { if (server == null) return this$.pendingConnect().connect().keepAlive().ticks(); return sys.Duration.fromStr(sys.Str.plus(sys.Str.plus("", server), "sec")).ticks(); })(this);
    if (sys.ObjUtil.equals(ticks, 0)) {
      return;
    }
    ;
    if (sys.ObjUtil.compareGT(sys.Int.minus(sys.Duration.nowTicks(), this.#lastPacketSent.val()), ticks)) {
      this.onPingReq(PingReq.defVal());
    }
    ;
    return;
  }

  checkPending() {
    const this$ = this;
    if (this.#pendingAcks.isEmpty()) {
      return;
    }
    ;
    this.#pendingAcks.each(sys.ObjUtil.coerce((pending) => {
      if (sys.ObjUtil.compareGT(pending.age(), this$.#config.timeout())) {
        this$.#log.debug(sys.Str.plus(sys.Str.plus(sys.Str.plus("Packet ", sys.ObjUtil.coerce(pending.packetId(), sys.Obj.type$.toNullable())), " timed out after "), this$.#config.timeout().toLocale()));
        this$.finishPending(pending);
        pending.resp().completeErr(sys.TimeoutErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("No acknowledgement received for packet ", sys.ObjUtil.coerce(pending.packetId(), sys.Obj.type$.toNullable())), " after "), this$.#config.timeout().toLocale())));
      }
      else {
        if ((sys.ObjUtil.compareGT(this$.#config.maxRetry(), 0) && pending.isRetryNeeded(this$.#config.retryInterval()))) {
          this$.#log.debug(sys.Str.plus("Retry packet ", sys.ObjUtil.coerce(pending.packetId(), sys.Obj.type$.toNullable())));
          let p = this$.#config.persistence().get(sys.ObjUtil.coerce(pending.persistKey(), sys.Str.type$));
          let packet = PersistableControlPacket.fromPersistablePacket(sys.ObjUtil.coerce(p, PersistablePacket.type$));
          packet.markDup();
          this$.sendPacket(packet, pending);
        }
        ;
      }
      ;
      return;
    }, sys.Type.find("|sys::Obj,sys::Obj->sys::Void|")));
    return;
  }

  transition(expected,to) {
    if (!this.#stateRef.compareAndSet(expected, to)) {
      throw MqttErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot transition ", this.#stateRef), " => "), to), " : (expected "), expected), ")"));
    }
    ;
    return this.state();
  }

  canMessage() {
    return (!this.isTerminated() && this.state() !== ClientState.disconnected());
  }

  checkCanMessage() {
    if (!this.canMessage()) {
      throw MqttErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot send packets: ", this.state()), " [terminated="), sys.ObjUtil.coerce(this.isTerminated(), sys.Obj.type$.toNullable())), "]"));
    }
    ;
    return;
  }

  shutdown(err) {
    if (err === undefined) err = null;
    return this.send(concurrent.ActorMsg.make1("shutdown", err));
  }

  onShutdown(err) {
    if (err === undefined) err = null;
    const this$ = this;
    if (this.state() === ClientState.disconnected()) {
      return err;
    }
    ;
    let isClientDisconnect = this.state() === ClientState.disconnecting();
    this.#stateRef.val(ClientState.disconnected());
    if (err != null) {
      this.#log.err("Client disconnected", err);
    }
    ;
    ((this$) => { let $_u35 = this$.transport(); if ($_u35 == null) return null; return this$.transport().close(); })(this);
    this.#transportRef.val(null);
    try {
      this.#config.persistence().close();
    }
    catch ($_u36) {
      $_u36 = sys.Err.make($_u36);
      if ($_u36 instanceof sys.Err) {
        let ignore = $_u36;
        ;
      }
      else {
        throw $_u36;
      }
    }
    ;
    this.subMgr().close();
    if (this.pendingConnect().connect().cleanSession()) {
      this.#config.persistence().clear(this.clientId());
      this.subMgr().clear();
    }
    ;
    this.#pendingAcks.each(sys.ObjUtil.coerce((pending) => {
      try {
        pending.resp().completeErr(sys.ObjUtil.coerce(((this$) => { let $_u37 = err; if ($_u37 != null) return $_u37; return MqttErr.make("Client disconnected"); })(this$), sys.Err.type$));
      }
      catch ($_u38) {
        $_u38 = sys.Err.make($_u38);
        if ($_u38 instanceof sys.Err) {
          let x = $_u38;
          ;
        }
        else {
          throw $_u38;
        }
      }
      ;
      return;
    }, sys.Type.find("|sys::Obj,sys::Obj->sys::Void|")));
    this.#pendingAcks.clear();
    if (!this.pendingConnect().isComplete()) {
      this.pendingConnect().resp().completeErr(sys.ObjUtil.coerce(((this$) => { let $_u39 = err; if ($_u39 != null) return $_u39; return MqttErr.make("Client disconnected"); })(this), sys.Err.type$));
    }
    ;
    this.#pendingConnectRef.val(MqttClient.notConnected());
    this.#listeners.fireDisconnected(err, isClientDisconnect);
    return err;
  }

  debug(msg,err) {
    if (err === undefined) err = null;
    if (this.#log.isDebug()) {
      this.#log.debug(msg, err);
    }
    ;
    return;
  }

  static notConnected() {
    let p = PendingConn.make(ConnectConfig.make().packet("not-connected"));
    p.resp().completeErr(MqttErr.make("Disconnected"));
    return p;
  }

  debugClient() {
    let s = sys.StrBuf.make();
    s.add("Mqtt Client\n").add("-----------\n").add(sys.Str.plus(sys.Str.plus("At: ", sys.DateTime.now().toLocale()), "\n")).add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("State: ", this.#stateRef.val()), " [canMessage="), sys.ObjUtil.coerce(this.canMessage(), sys.Obj.type$.toNullable())), "]\n")).add(sys.Str.plus(sys.Str.plus("ConnAck Properties: ", this.pendingConnect().connack().props()), "\n")).add(sys.Str.plus(sys.Str.plus("Quota: ", this.#quota), "\n")).add(sys.Str.plus("Pending Acks: ", sys.ObjUtil.coerce(this.#pendingAcks.size(), sys.Obj.type$.toNullable())));
    return s.toStr();
  }

  static static$init() {
    MqttClient.#housekeeping = concurrent.ActorMsg.make0("housekeeping");
    return;
  }

}

class ClientState extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ClientState.type$; }

  static disconnected() { return ClientState.vals().get(0); }

  static connecting() { return ClientState.vals().get(1); }

  static connected() { return ClientState.vals().get(2); }

  static disconnecting() { return ClientState.vals().get(3); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new ClientState();
    ClientState.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(ClientState.type$, ClientState.vals(), name$, checked);
  }

  static vals() {
    if (ClientState.#vals == null) {
      ClientState.#vals = sys.List.make(ClientState.type$, [
        ClientState.make(0, "disconnected", ),
        ClientState.make(1, "connecting", ),
        ClientState.make(2, "connected", ),
        ClientState.make(3, "disconnecting", ),
      ]).toImmutable();
    }
    return ClientState.#vals;
  }

  static static$init() {
    const $_u40 = ClientState.vals();
    if (true) {
    }
    ;
    return;
  }

}

class ConnectConfig extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#versionRef = concurrent.AtomicRef.make(MqttVersion.v3_1_1());
    this.#keepAlive = sys.Duration.fromStr("1min");
    this.#cleanSession = true;
    this.#username = null;
    this.#password = null;
    this.#connectTimeout = sys.Duration.fromStr("10sec");
    this.#sessionExpiryInterval = MqttConst.sessionExpiresOnClose();
    this.#receiveMax = null;
    this.#maxPacketSize = null;
    this.#topicAliasMax = 0;
    this.#requestResponseInfo = false;
    this.#requestProblemInfo = true;
    this.#userProps = sys.ObjUtil.coerce(((this$) => { let $_u41 = sys.List.make(StrPair.type$); if ($_u41 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(StrPair.type$)); })(this), sys.Type.find("mqtt::StrPair[]"));
    this.#authMethod = null;
    this.#authData = null;
    return;
  }

  typeof() { return ConnectConfig.type$; }

  #versionRef = null;

  versionRef() { return this.#versionRef; }

  __versionRef(it) { if (it === undefined) return this.#versionRef; else this.#versionRef = it; }

  #keepAlive = null;

  keepAlive() { return this.#keepAlive; }

  __keepAlive(it) { if (it === undefined) return this.#keepAlive; else this.#keepAlive = it; }

  #cleanSession = false;

  cleanSession() { return this.#cleanSession; }

  __cleanSession(it) { if (it === undefined) return this.#cleanSession; else this.#cleanSession = it; }

  #username = null;

  username() { return this.#username; }

  __username(it) { if (it === undefined) return this.#username; else this.#username = it; }

  #password = null;

  password() { return this.#password; }

  __password(it) { if (it === undefined) return this.#password; else this.#password = it; }

  #connectTimeout = null;

  connectTimeout() { return this.#connectTimeout; }

  __connectTimeout(it) { if (it === undefined) return this.#connectTimeout; else this.#connectTimeout = it; }

  #sessionExpiryInterval = null;

  sessionExpiryInterval() { return this.#sessionExpiryInterval; }

  __sessionExpiryInterval(it) { if (it === undefined) return this.#sessionExpiryInterval; else this.#sessionExpiryInterval = it; }

  #receiveMax = null;

  receiveMax() { return this.#receiveMax; }

  __receiveMax(it) { if (it === undefined) return this.#receiveMax; else this.#receiveMax = it; }

  #maxPacketSize = null;

  maxPacketSize() { return this.#maxPacketSize; }

  __maxPacketSize(it) { if (it === undefined) return this.#maxPacketSize; else this.#maxPacketSize = it; }

  #topicAliasMax = 0;

  // private field reflection only
  __topicAliasMax(it) { if (it === undefined) return this.#topicAliasMax; else this.#topicAliasMax = it; }

  #requestResponseInfo = false;

  requestResponseInfo() { return this.#requestResponseInfo; }

  __requestResponseInfo(it) { if (it === undefined) return this.#requestResponseInfo; else this.#requestResponseInfo = it; }

  #requestProblemInfo = false;

  requestProblemInfo() { return this.#requestProblemInfo; }

  __requestProblemInfo(it) { if (it === undefined) return this.#requestProblemInfo; else this.#requestProblemInfo = it; }

  #userProps = null;

  userProps() { return this.#userProps; }

  __userProps(it) { if (it === undefined) return this.#userProps; else this.#userProps = it; }

  #authMethod = null;

  authMethod() { return this.#authMethod; }

  __authMethod(it) { if (it === undefined) return this.#authMethod; else this.#authMethod = it; }

  #authData = null;

  authData() { return this.#authData; }

  __authData(it) { if (it === undefined) return this.#authData; else this.#authData = it; }

  static make(f) {
    const $self = new ConnectConfig();
    ConnectConfig.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    ;
    ((this$) => { let $_u42 = f; if ($_u42 == null) return null; return sys.Func.call(f, this$); })($self);
    return;
  }

  version() {
    return sys.ObjUtil.coerce(this.#versionRef.val(), MqttVersion.type$);
  }

  packet(clientId) {
    const this$ = this;
    return Connect.make((it) => {
      it.__version(this$.version());
      it.__clientId(clientId);
      it.__keepAlive(this$.#keepAlive);
      it.__cleanSession(this$.#cleanSession);
      it.__username(this$.#username);
      it.__password(sys.ObjUtil.coerce(((this$) => { let $_u43 = this$.#password; if ($_u43 == null) return null; return sys.ObjUtil.toImmutable(this$.#password); })(this$), sys.Buf.type$.toNullable()));
      it.__props(this$.toProps());
      return;
    });
  }

  toProps() {
    const this$ = this;
    let props = Properties.make().add(Property.sessionExpiryInterval(), sys.ObjUtil.coerce(this.#sessionExpiryInterval.toSec(), sys.Obj.type$.toNullable())).add(Property.receiveMax(), sys.ObjUtil.coerce(this.#receiveMax, sys.Obj.type$.toNullable())).add(Property.maxPacketSize(), sys.ObjUtil.coerce(this.#maxPacketSize, sys.Obj.type$.toNullable())).add(Property.topicAliasMax(), sys.ObjUtil.coerce(this.#topicAliasMax, sys.Obj.type$.toNullable())).add(Property.requestResponseInfo(), sys.ObjUtil.coerce(((this$) => { if (this$.#requestResponseInfo) return 1; return 0; })(this), sys.Obj.type$.toNullable())).add(Property.authMethod(), this.#authMethod).add(Property.authData(), this.#authData);
    this.#userProps.each((userProp) => {
      props.add(Property.userProperty(), userProp);
      return;
    });
    return props;
  }

}

class SubSend extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#_topicFilter = null;
    this.#_qos = QoS.two();
    this.#_noLocal = false;
    this.#_retainAsPublished = false;
    this.#_retainHandling = RetainHandling.send();
    return;
  }

  typeof() { return SubSend.type$; }

  #client = null;

  // private field reflection only
  __client(it) { if (it === undefined) return this.#client; else this.#client = it; }

  #_topicFilter = null;

  // private field reflection only
  ___topicFilter(it) { if (it === undefined) return this.#_topicFilter; else this.#_topicFilter = it; }

  #_qos = null;

  // private field reflection only
  ___qos(it) { if (it === undefined) return this.#_qos; else this.#_qos = it; }

  #_noLocal = false;

  // private field reflection only
  ___noLocal(it) { if (it === undefined) return this.#_noLocal; else this.#_noLocal = it; }

  #_retainAsPublished = false;

  // private field reflection only
  ___retainAsPublished(it) { if (it === undefined) return this.#_retainAsPublished; else this.#_retainAsPublished = it; }

  #_retainHandling = null;

  // private field reflection only
  ___retainHandling(it) { if (it === undefined) return this.#_retainHandling; else this.#_retainHandling = it; }

  #callbacks = null;

  // private field reflection only
  __callbacks(it) { if (it === undefined) return this.#callbacks; else this.#callbacks = it; }

  #_listener = null;

  // private field reflection only
  ___listener(it) { if (it === undefined) return this.#_listener; else this.#_listener = it; }

  static make(client) {
    const $self = new SubSend();
    SubSend.make$($self,client);
    return $self;
  }

  static make$($self,client) {
    ;
    $self.#client = client;
    $self.#callbacks = CallbackListener.make();
    $self.#_listener = $self.#callbacks;
    return;
  }

  topicFilter(topicFilter) {
    this.#_topicFilter = Topic.validateFilter(topicFilter);
    return this;
  }

  qos0() {
    return this.qos(QoS.zero());
  }

  qos1() {
    return this.qos(QoS.one());
  }

  qos2() {
    return this.qos(QoS.two());
  }

  qos(qos) {
    if (sys.ObjUtil.is(qos, sys.Int.type$)) {
      (qos = QoS.vals().get(sys.ObjUtil.coerce(qos, sys.Int.type$)));
    }
    else {
      if (!sys.ObjUtil.is(qos, QoS.type$)) {
        throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot set QoS from ", qos), " ("), sys.ObjUtil.typeof(qos)), ")"));
      }
      ;
    }
    ;
    this.#_qos = sys.ObjUtil.coerce(qos, QoS.type$);
    return this;
  }

  noLocal(val) {
    this.#_noLocal = val;
    return this;
  }

  retainAsPublished(val) {
    this.#_retainAsPublished = val;
    return this;
  }

  retainHandling(val) {
    this.#_retainHandling = val;
    return this;
  }

  onSubscribe(cb) {
    this.#callbacks.cbSub(cb);
    return this;
  }

  onMessage(cb) {
    this.#callbacks.cbMsg(cb);
    return this;
  }

  onUnsubscribe(cb) {
    this.#callbacks.cbUnsub(cb);
    return this;
  }

  listener(listener) {
    this.#_listener = listener;
    return this;
  }

  send() {
    if (this.#_topicFilter == null) {
      throw sys.ArgErr.make("Topic filter not set");
    }
    ;
    return this.#client.subscribe(sys.ObjUtil.coerce(this.#_topicFilter, sys.Str.type$), this.buildOpts(), this.#_listener);
  }

  buildOpts() {
    let opts = this.#_qos.ordinal();
    if (this.#client.config().version().is5()) {
      if (this.#_noLocal) {
        (opts = sys.Int.or(opts, 4));
      }
      ;
      if (this.#_retainAsPublished) {
        (opts = sys.Int.or(opts, 8));
      }
      ;
      (opts = sys.Int.or(opts, sys.Int.shiftl(this.#_retainHandling.ordinal(), 4)));
    }
    ;
    return opts;
  }

}

class RetainHandling extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RetainHandling.type$; }

  static send() { return RetainHandling.vals().get(0); }

  static send_only_if_new_subscription() { return RetainHandling.vals().get(1); }

  static do_not_send() { return RetainHandling.vals().get(2); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new RetainHandling();
    RetainHandling.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(RetainHandling.type$, RetainHandling.vals(), name$, checked);
  }

  static vals() {
    if (RetainHandling.#vals == null) {
      RetainHandling.#vals = sys.List.make(RetainHandling.type$, [
        RetainHandling.make(0, "send", ),
        RetainHandling.make(1, "send_only_if_new_subscription", ),
        RetainHandling.make(2, "do_not_send", ),
      ]).toImmutable();
    }
    return RetainHandling.#vals;
  }

  static static$init() {
    const $_u45 = RetainHandling.vals();
    if (true) {
    }
    ;
    return;
  }

}

class SubscriptionListener {
  constructor() {
    const this$ = this;
  }

  typeof() { return SubscriptionListener.type$; }

  onSubscribed(topic,reason,props) {
    return;
  }

  onMessage(topic,msg) {
    return;
  }

  onUnsubscribed(topic,reason,props) {
    return;
  }

}

class CallbackListener extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#cbSub = null;
    this.#cbMsg = null;
    this.#cbUnsub = null;
    return;
  }

  typeof() { return CallbackListener.type$; }

  #cbSub = null;

  cbSub(it) {
    if (it === undefined) {
      return this.#cbSub;
    }
    else {
      this.#cbSub = it;
      return;
    }
  }

  #cbMsg = null;

  cbMsg(it) {
    if (it === undefined) {
      return this.#cbMsg;
    }
    else {
      this.#cbMsg = it;
      return;
    }
  }

  #cbUnsub = null;

  cbUnsub(it) {
    if (it === undefined) {
      return this.#cbUnsub;
    }
    else {
      this.#cbUnsub = it;
      return;
    }
  }

  onSubscribed(topic,reason,props) {
    ((this$) => { let $_u46 = this$.#cbSub; if ($_u46 == null) return null; return sys.Func.call(this$.#cbSub, topic, reason, props); })(this);
    return;
  }

  onMessage(topic,msg) {
    ((this$) => { let $_u47 = this$.#cbMsg; if ($_u47 == null) return null; return sys.Func.call(this$.#cbMsg, topic, msg); })(this);
    return;
  }

  onUnsubscribed(topic,reason,props) {
    ((this$) => { let $_u48 = this$.#cbUnsub; if ($_u48 == null) return null; return sys.Func.call(this$.#cbUnsub, topic, reason, props); })(this);
    return;
  }

  static make() {
    const $self = new CallbackListener();
    CallbackListener.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class PacketReaderActor extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PacketReaderActor.type$; }

  #client = null;

  // private field reflection only
  __client(it) { if (it === undefined) return this.#client; else this.#client = it; }

  static make(client) {
    const $self = new PacketReaderActor();
    PacketReaderActor.make$($self,client);
    return $self;
  }

  static make$($self,client) {
    concurrent.Actor.make$($self, client.config().pool());
    $self.#client = client;
    return;
  }

  log() {
    return this.#client.log();
  }

  transport() {
    return this.#client.transport();
  }

  receive(obj) {
    try {
      if (!this.doReceive()) {
        return null;
      }
      ;
    }
    catch ($_u49) {
      $_u49 = sys.Err.make($_u49);
      if ($_u49 instanceof sys.Err) {
        let err = $_u49;
        ;
        if (!this.#client.canMessage()) {
          return null;
        }
        ;
        this.log().err("Packet.read", err);
      }
      else {
        throw $_u49;
      }
    }
    ;
    this.send("loop");
    return null;
  }

  doReceive() {
    let buf = sys.ObjUtil.as(concurrent.Actor.locals().get("buf"), sys.Buf.type$);
    if (buf == null) {
      concurrent.Actor.locals().set("buf", (buf = sys.Buf.make(4096)));
    }
    ;
    buf.clear();
    try {
      let in$ = this.transport().in();
      DataCodec.writeByte(DataCodec.readByte(in$), sys.ObjUtil.coerce(buf, sys.Obj.type$));
      let len = DataCodec.readVbi(in$);
      DataCodec.writeVbi(len, sys.ObjUtil.coerce(buf, sys.Obj.type$));
      in$.pipe(buf.out(), sys.ObjUtil.coerce(len, sys.Int.type$.toNullable()), false);
      buf.seek(0);
    }
    catch ($_u50) {
      $_u50 = sys.Err.make($_u50);
      if ($_u50 instanceof sys.Err) {
        let err = $_u50;
        ;
        if (sys.ObjUtil.coerce(((this$) => { let $_u51 = ((this$) => { let $_u52 = this$.transport(); if ($_u52 == null) return null; return this$.transport().isClosed(); })(this$); if ($_u51 != null) return $_u51; return sys.ObjUtil.coerce(true, sys.Bool.type$.toNullable()); })(this), sys.Bool.type$)) {
          return false;
        }
        ;
        this.#client.shutdown(err);
        throw err;
      }
      else {
        throw $_u50;
      }
    }
    ;
    let packet = ControlPacket.readPacket(buf.in(), this.#client.config().version());
    this.trace(packet, sys.ObjUtil.coerce(buf, sys.Buf.type$));
    this.#client.packetReceived(packet);
    return true;
  }

  trace(packet,buf) {
    if (!this.#client.log().isDebug()) {
      return;
    }
    ;
    let s = sys.StrBuf.make().add(sys.Str.plus(sys.Str.plus("< ", sys.ObjUtil.coerce(packet.pid(), sys.Obj.type$.toNullable())), "\n"));
    s.add(sys.Str.plus("Packet Type: ", packet.type()));
    let payload = false;
    let $_u53 = packet.type();
    if (sys.ObjUtil.equals($_u53, PacketType.publish())) {
      s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(" ", sys.ObjUtil.trap(packet,"topicName", sys.List.make(sys.Obj.type$.toNullable(), []))), " qos="), sys.ObjUtil.trap(packet,"qos", sys.List.make(sys.Obj.type$.toNullable(), []))));
      (payload = true);
    }
    ;
    s.addChar(10);
    s.add(buf.toHex());
    if (payload) {
      try {
        let payloadStr = sys.ObjUtil.trap(sys.ObjUtil.trap(sys.ObjUtil.trap(packet,"payload", sys.List.make(sys.Obj.type$.toNullable(), [])),"in", sys.List.make(sys.Obj.type$.toNullable(), [])),"readAllStr", sys.List.make(sys.Obj.type$.toNullable(), []));
        s.add(sys.Str.plus("\n\nPayload:\n", payloadStr));
      }
      catch ($_u54) {
        $_u54 = sys.Err.make($_u54);
        if ($_u54 instanceof sys.Err) {
          let ignore = $_u54;
          ;
        }
        else {
          throw $_u54;
        }
      }
      ;
    }
    ;
    this.#client.log().debug(s.toStr());
    return;
  }

}

class PacketWriterActor extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PacketWriterActor.type$; }

  #client = null;

  // private field reflection only
  __client(it) { if (it === undefined) return this.#client; else this.#client = it; }

  #version = null;

  // private field reflection only
  __version(it) { if (it === undefined) return this.#version; else this.#version = it; }

  #actor = null;

  // private field reflection only
  __actor(it) { if (it === undefined) return this.#actor; else this.#actor = it; }

  static make(client) {
    const $self = new PacketWriterActor();
    PacketWriterActor.make$($self,client);
    return $self;
  }

  static make$($self,client) {
    const this$ = $self;
    $self.#client = client;
    $self.#version = client.config().version();
    $self.#actor = concurrent.Actor.make(client.pool(), (msg) => {
      return this$.onSend(sys.ObjUtil.coerce(msg, concurrent.ActorMsg.type$));
    });
    return;
  }

  transport() {
    return sys.ObjUtil.coerce(this.#client.transport(), MqttTransport.type$);
  }

  sendSync(packet) {
    let f = this.send(packet);
    try {
      f.get();
    }
    catch ($_u55) {
      $_u55 = sys.Err.make($_u55);
      if ($_u55 instanceof sys.Err) {
        let ignore = $_u55;
        ;
      }
      else {
        throw $_u55;
      }
    }
    ;
    return f;
  }

  send(packet) {
    let buf = sys.Buf.make(4096);
    packet.encode(buf.out(), this.#version);
    return this.#actor.send(concurrent.ActorMsg.make2("send", packet, sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable())), sys.Buf.type$.toNullable())));
  }

  onSend(msg) {
    let packet = sys.ObjUtil.as(msg.a(), ControlPacket.type$);
    let buf = sys.ObjUtil.as(msg.b(), sys.Buf.type$);
    try {
      this.transport().send(sys.ObjUtil.coerce(buf, sys.Buf.type$));
      this.#client.lastPacketSent().val(sys.Duration.nowTicks());
      this.trace(sys.ObjUtil.coerce(packet, ControlPacket.type$), sys.ObjUtil.coerce(buf, sys.Buf.type$));
    }
    catch ($_u56) {
      $_u56 = sys.Err.make($_u56);
      if ($_u56 instanceof sys.IOErr) {
        let err = $_u56;
        ;
        this.#client.shutdown(err);
        throw err;
      }
      else if ($_u56 instanceof sys.Err) {
        let err = $_u56;
        ;
        this.#client.log().err(sys.Str.plus("Failed to write packet ", packet.type()), err);
      }
      else {
        throw $_u56;
      }
    }
    ;
    return packet;
  }

  trace(packet,buf) {
    const this$ = this;
    if (!this.#client.log().isDebug()) {
      return;
    }
    ;
    let s = sys.StrBuf.make().add(sys.Str.plus(sys.Str.plus("> ", sys.ObjUtil.coerce(packet.pid(), sys.Obj.type$.toNullable())), "\n"));
    s.add(sys.Str.plus("Packet Type: ", packet.type()));
    let payload = false;
    let $_u57 = packet.type();
    if (sys.ObjUtil.equals($_u57, PacketType.publish())) {
      s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(" topic=", sys.ObjUtil.trap(packet,"topicName", sys.List.make(sys.Obj.type$.toNullable(), []))), " qos="), sys.ObjUtil.trap(packet,"qos", sys.List.make(sys.Obj.type$.toNullable(), []))));
      (payload = true);
    }
    else if (sys.ObjUtil.equals($_u57, PacketType.subscribe())) {
      let opts = sys.ObjUtil.coerce(sys.ObjUtil.trap(packet,"opts", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Type.find("sys::Int[]")).map((i) => {
        return sys.Int.toRadix(i, 2, sys.ObjUtil.coerce(8, sys.Int.type$.toNullable()));
      }, sys.Str.type$);
      s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(" topics=", sys.ObjUtil.trap(packet,"topics", sys.List.make(sys.Obj.type$.toNullable(), []))), " "), opts));
      (payload = true);
    }
    ;
    s.addChar(10);
    s.add(buf.toHex());
    if (payload) {
      try {
        let payloadStr = sys.ObjUtil.trap(sys.ObjUtil.trap(sys.ObjUtil.trap(packet,"payload", sys.List.make(sys.Obj.type$.toNullable(), [])),"in", sys.List.make(sys.Obj.type$.toNullable(), [])),"readAllStr", sys.List.make(sys.Obj.type$.toNullable(), []));
        s.add(sys.Str.plus("\n\nPayload:\n", payloadStr));
      }
      catch ($_u58) {
        $_u58 = sys.Err.make($_u58);
        if ($_u58 instanceof sys.Err) {
          let ignore = $_u58;
          ;
        }
        else {
          throw $_u58;
        }
      }
      ;
    }
    ;
    this.#client.log().debug(s.toStr());
    return;
  }

}

class ClientHandler extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ClientHandler.type$; }

  #client = null;

  client() { return this.#client; }

  __client(it) { if (it === undefined) return this.#client; else this.#client = it; }

  static make(client) {
    const $self = new ClientHandler();
    ClientHandler.make$($self,client);
    return $self;
  }

  static make$($self,client) {
    $self.#client = client;
    return;
  }

  log() {
    return this.#client.log();
  }

  state() {
    return this.#client.state();
  }

  clientConfig() {
    return this.#client.config();
  }

  version() {
    return this.clientConfig().version();
  }

  clientId() {
    return this.#client.clientId();
  }

  connackProps() {
    return this.#client.pendingConnect().connack().props();
  }

  db() {
    return this.clientConfig().persistence();
  }

  debug(msg,err) {
    if (err === undefined) err = null;
    this.#client.debug(msg, err);
    return;
  }

}

class ClientConnAckHandler extends ClientHandler {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ClientConnAckHandler.type$; }

  #ack = null;

  // private field reflection only
  __ack(it) { if (it === undefined) return this.#ack; else this.#ack = it; }

  #pendingConnect = null;

  // private field reflection only
  __pendingConnect(it) { if (it === undefined) return this.#pendingConnect; else this.#pendingConnect = it; }

  static make(client,ack) {
    const $self = new ClientConnAckHandler();
    ClientConnAckHandler.make$($self,client,ack);
    return $self;
  }

  static make$($self,client,ack) {
    ClientHandler.make$($self, client);
    $self.#ack = ack;
    $self.#pendingConnect = client.pendingConnect();
    return;
  }

  run() {
    if (this.state() === ClientState.connected()) {
      throw sys.ObjUtil.coerce(this.client().onShutdown(MqttErr.make("Server sent CONNACK, but already connected")), sys.Err.type$);
    }
    ;
    if (!this.#ack.isSuccess()) {
      this.client().shutdown(MqttErr.makeReason(this.#ack.reason()));
      if (this.#ack.props().reasonStr() != null) {
        this.log().err(sys.Str.plus("CONNECT rejected by server: ", this.#ack.props().reasonStr()));
      }
      ;
      return this.state();
    }
    ;
    let requestedClean = this.#pendingConnect.connect().cleanSession();
    let requestedRestore = !requestedClean;
    try {
      if ((requestedClean && this.#ack.isSessionPresent())) {
        throw MqttErr.make("Requested clean session, but server indicated a session was already present");
      }
      ;
      this.client().transition(ClientState.connecting(), ClientState.connected());
    }
    catch ($_u59) {
      $_u59 = sys.Err.make($_u59);
      if ($_u59 instanceof sys.Err) {
        let err = $_u59;
        ;
        this.log().err("CONNACK processing failed", err);
        this.client().shutdown(err);
        return this.state();
      }
      else {
        throw $_u59;
      }
    }
    ;
    this.debug(sys.Str.plus("CONNACK: ", this.#ack.props()));
    this.client().clientIdRef().val(this.#ack.props().get(Property.assignedClientId(), this.clientConfig().clientId()));
    this.db().open(this.clientId());
    if (requestedRestore) {
      if (!this.#ack.isSessionPresent()) {
        this.debug(sys.Str.plus(sys.Str.plus("Resume session for ", this.clientId()), " request, but server indicated no session present. Clearing persisted state."));
        this.db().clear(this.clientId());
      }
      else {
        ClientPublishHandler.make(this.client()).resume();
      }
      ;
    }
    else {
      this.db().clear(this.clientId());
    }
    ;
    this.client().quota().val(this.#ack.props().receiveMax());
    this.#pendingConnect.resp().complete(this.#ack);
    this.client().listeners().fireConnected();
    this.debug(sys.Str.plus(sys.Str.plus(sys.Str.plus("Connected to ", this.clientConfig().serverUri()), " as "), this.clientId()));
    return this.state();
  }

}

class ClientConnectHandler extends ClientHandler {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ClientConnectHandler.type$; }

  #config = null;

  // private field reflection only
  __config(it) { if (it === undefined) return this.#config; else this.#config = it; }

  static make(client,config) {
    const $self = new ClientConnectHandler();
    ClientConnectHandler.make$($self,client,config);
    return $self;
  }

  static make$($self,client,config) {
    ClientHandler.make$($self, client);
    $self.#config = config;
    return;
  }

  run() {
    this.openTransport();
    this.client().transition(ClientState.disconnected(), ClientState.connecting());
    this.#config.versionRef().val(this.clientConfig().version());
    let packet = this.#config.packet(this.clientConfig().clientId()).validate();
    this.client().pendingConnectRef().val(PendingConn.make(packet));
    this.client().packetWriter().send(packet);
    this.client().sendLater(sys.Duration.fromStr("1sec"), MqttClient.housekeeping());
    this.client().packetReader().send("loop");
    return this.client().pendingConnect().resp();
  }

  openTransport() {
    this.client().transportRef().val(sys.Unsafe.make(MqttTransport.open(this.clientConfig())));
    return;
  }

}

class ClientPublishHandler extends ClientHandler {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ClientPublishHandler.type$; }

  static #pub_prefix = undefined;

  static pub_prefix() {
    if (ClientPublishHandler.#pub_prefix === undefined) {
      ClientPublishHandler.static$init();
      if (ClientPublishHandler.#pub_prefix === undefined) ClientPublishHandler.#pub_prefix = null;
    }
    return ClientPublishHandler.#pub_prefix;
  }

  static #pubrec_prefix = undefined;

  static pubrec_prefix() {
    if (ClientPublishHandler.#pubrec_prefix === undefined) {
      ClientPublishHandler.static$init();
      if (ClientPublishHandler.#pubrec_prefix === undefined) ClientPublishHandler.#pubrec_prefix = null;
    }
    return ClientPublishHandler.#pubrec_prefix;
  }

  static #pubrel_prefix = undefined;

  static pubrel_prefix() {
    if (ClientPublishHandler.#pubrel_prefix === undefined) {
      ClientPublishHandler.static$init();
      if (ClientPublishHandler.#pubrel_prefix === undefined) ClientPublishHandler.#pubrel_prefix = null;
    }
    return ClientPublishHandler.#pubrel_prefix;
  }

  static make(client) {
    const $self = new ClientPublishHandler();
    ClientPublishHandler.make$($self,client);
    return $self;
  }

  static make$($self,client) {
    ClientHandler.make$($self, client);
    return;
  }

  publish(packet) {
    this.client().checkCanMessage();
    if (sys.ObjUtil.compareGT(packet.qos(), this.connackProps().maxQoS())) {
      return ClientPublishHandler.reject(sys.Str.plus(sys.Str.plus(sys.Str.plus("Max. QoS on server is ", this.connackProps().maxQoS()), ". Cannot send "), packet.qos()));
    }
    ;
    if ((packet.retain() && !this.connackProps().retainAvailable())) {
      return ClientPublishHandler.reject("Retained messages not supported by the server");
    }
    ;
    if (packet.msg().props().get(Property.subscriptionId()) != null) {
      return ClientPublishHandler.reject(sys.Str.plus("A publish packet sent to a server must not contain a subscription identifier: ", packet.msg().props()));
    }
    ;
    if (packet.qos().isZero()) {
      return this.client().packetWriter().sendSync(packet);
    }
    ;
    let serverQuota = this.connackProps().receiveMax();
    if (sys.ObjUtil.equals(this.client().quota().val(), 0)) {
      return ClientPublishHandler.reject(sys.Str.plus("Quota exceeded: ", sys.ObjUtil.coerce(serverQuota, sys.Obj.type$.toNullable())));
    }
    ;
    packet.packetVersionRef().val(this.version());
    try {
      packet.packetId().val(this.client().nextPacketId());
      let key = ClientPublishHandler.pubKey(packet);
      this.db().put(key, packet);
      let pending = this.client().sendPacket(packet, PendingAck.make(packet, key));
      this.client().quota().decrement();
      return pending.resp();
    }
    catch ($_u60) {
      $_u60 = sys.Err.make($_u60);
      if ($_u60 instanceof sys.Err) {
        let err = $_u60;
        ;
        this.log().err("Failed to send QoS packet", err);
        throw err;
      }
      else {
        throw $_u60;
      }
    }
    ;
  }

  static reject(reason) {
    return concurrent.Future.makeCompletable().completeErr(MqttErr.make(reason));
  }

  static toErr(packet) {
    let details = ((this$) => { let $_u61 = packet.props().reasonStr(); if ($_u61 != null) return $_u61; return "No details available."; })(this);
    return MqttErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Publish failed: ", packet.reason()), ". Details: "), details));
  }

  pubAck(packet,pending) {
    this.onFinalAck(packet, pending);
    return;
  }

  pubRec(packet,pending) {
    let key = ClientPublishHandler.pubKey(packet);
    this.db().remove(key);
    if (packet.isErr()) {
      return pending.resp().completeErr(ClientPublishHandler.toErr(packet));
    }
    ;
    let ack = PubRel.make(packet.pid());
    (key = ClientPublishHandler.pubrelKey(ack));
    this.db().put(key, ack);
    this.client().sendPacket(ack, PendingAck.clone(pending, key));
    return;
  }

  pubComp(packet,pending) {
    this.onFinalAck(packet, pending);
    return;
  }

  onFinalAck(packet,pending) {
    this.client().finishPending(pending);
    if (packet.isErr()) {
      pending.resp().completeErr(ClientPublishHandler.toErr(packet));
    }
    ;
    return;
  }

  deliver(packet) {
    if (packet.qos() === QoS.zero()) {
      this.client().subMgr().deliver(packet);
    }
    else {
      if (packet.qos() === QoS.one()) {
        this.client().subMgr().deliver(packet);
        this.client().packetWriter().send(PubAck.make(packet.pid()));
      }
      else {
        if (packet.qos() === QoS.two()) {
          let ack = PubRec.make(packet.pid());
          let key = ClientPublishHandler.pubrecKey(packet);
          if (!this.db().containsKey(key)) {
            this.db().put(key, ack);
            this.client().subMgr().deliver(packet);
          }
          ;
          this.client().packetWriter().send(ack);
        }
        ;
      }
      ;
    }
    ;
    return null;
  }

  pubRel(packet) {
    let ack = PubComp.make(packet.pid());
    let key = ClientPublishHandler.pubrecKey(packet);
    this.db().remove(key);
    this.client().packetWriter().send(ack);
    return null;
  }

  resume() {
    const this$ = this;
    this.db().each((p,key) => {
      if ((sys.Str.startsWith(key, ClientPublishHandler.pub_prefix()) || sys.Str.startsWith(key, ClientPublishHandler.pubrel_prefix()))) {
        try {
          let packet = PersistableControlPacket.fromPersistablePacket(p);
          packet.markDup();
          this$.client().sendPacket(packet, PendingAck.make(packet, key));
        }
        catch ($_u62) {
          $_u62 = sys.Err.make($_u62);
          if ($_u62 instanceof sys.Err) {
            let err = $_u62;
            ;
            this$.log().err(sys.Str.plus("Failed to resend packet: ", key), err);
          }
          else {
            throw $_u62;
          }
        }
        ;
      }
      ;
      return;
    });
    return;
  }

  static pubKey(packet) {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", ClientPublishHandler.pub_prefix()), ""), sys.ObjUtil.coerce(packet.pid(), sys.Obj.type$.toNullable()));
  }

  static pubrelKey(packet) {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", ClientPublishHandler.pubrel_prefix()), ""), sys.ObjUtil.coerce(packet.pid(), sys.Obj.type$.toNullable()));
  }

  static pubrecKey(packet) {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", ClientPublishHandler.pubrec_prefix()), ""), sys.ObjUtil.coerce(packet.pid(), sys.Obj.type$.toNullable()));
  }

  static static$init() {
    ClientPublishHandler.#pub_prefix = "p1-";
    ClientPublishHandler.#pubrec_prefix = "p2-";
    ClientPublishHandler.#pubrel_prefix = "p3-";
    return;
  }

}

class ClientSubMgr extends ClientHandler {
  constructor() {
    super();
    const this$ = this;
    this.#topics = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("mqtt::SubscriptionListener"));
    this.#aliases = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("sys::Str"));
    return;
  }

  typeof() { return ClientSubMgr.type$; }

  #topics = null;

  // private field reflection only
  __topics(it) { if (it === undefined) return this.#topics; else this.#topics = it; }

  #aliases = null;

  // private field reflection only
  __aliases(it) { if (it === undefined) return this.#aliases; else this.#aliases = it; }

  static make(client) {
    const $self = new ClientSubMgr();
    ClientSubMgr.make$($self,client);
    return $self;
  }

  static make$($self,client) {
    ClientHandler.make$($self, client);
    ;
    return;
  }

  close() {
    this.#aliases.clear();
    return;
  }

  clear() {
    this.#topics.clear();
    return;
  }

  subscribe(packet,listener) {
    const this$ = this;
    this.client().checkCanMessage();
    try {
      packet.packetId().val(this.client().nextPacketId());
      packet.topics().each((topic) => {
        this$.#topics.set(topic, listener);
        return;
      });
      return this.client().sendPacket(packet, PendingAck.make(packet)).resp();
    }
    catch ($_u63) {
      $_u63 = sys.Err.make($_u63);
      if ($_u63 instanceof sys.Err) {
        let err = $_u63;
        ;
        this.log().err("Failed to send subscribe packet", err);
        throw err;
      }
      else {
        throw $_u63;
      }
    }
    ;
  }

  subAck(ack,pending) {
    const this$ = this;
    let subscribe = sys.ObjUtil.coerce(pending.req(), Subscribe.type$);
    subscribe.topics().each((topic,i) => {
      try {
        ((this$) => { let $_u64 = this$.#topics.get(topic); if ($_u64 == null) return null; return this$.#topics.get(topic).onSubscribed(topic, ack.returnCodes().get(i), ack.props()); })(this$);
      }
      catch ($_u65) {
        $_u65 = sys.Err.make($_u65);
        if ($_u65 instanceof sys.Err) {
          let err = $_u65;
          ;
          this$.log().err("onSubscribed callback failed", err);
        }
        else {
          throw $_u65;
        }
      }
      ;
      return;
    });
    return;
  }

  deliver(packet) {
    const this$ = this;
    let topicName = packet.topicName();
    let alias = packet.msg().topicAlias();
    if (alias != null) {
      if (sys.Str.isEmpty(topicName)) {
        (topicName = sys.ObjUtil.coerce(((this$) => { let $_u66 = this$.#aliases.get(sys.ObjUtil.coerce(sys.ObjUtil.coerce(alias, sys.Int.type$), sys.Obj.type$.toNullable())); if ($_u66 != null) return $_u66; return ""; })(this), sys.Str.type$));
      }
      else {
        this.#aliases.set(sys.ObjUtil.coerce(sys.ObjUtil.coerce(alias, sys.Int.type$), sys.Obj.type$.toNullable()), topicName);
      }
      ;
    }
    ;
    this.#topics.each((listener,filter) => {
      try {
        if (!Topic.matches(topicName, filter)) {
          return;
        }
        ;
        listener.onMessage(packet.topicName(), packet.msg());
      }
      catch ($_u67) {
        $_u67 = sys.Err.make($_u67);
        if ($_u67 instanceof sys.Err) {
          let err = $_u67;
          ;
          this$.log().err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Delivery of ", packet.topicName()), " to "), filter), " failed"), err);
        }
        else {
          throw $_u67;
        }
      }
      ;
      return;
    });
    return;
  }

  unsubscribe(packet) {
    this.client().checkCanMessage();
    try {
      packet.packetId().val(this.client().nextPacketId());
      return this.client().sendPacket(packet, PendingAck.make(packet)).resp();
    }
    catch ($_u68) {
      $_u68 = sys.Err.make($_u68);
      if ($_u68 instanceof sys.Err) {
        let err = $_u68;
        ;
        this.log().err("Failed to unsubscribe", err);
        throw err;
      }
      else {
        throw $_u68;
      }
    }
    ;
  }

  unsubAck(ack,pending) {
    const this$ = this;
    let unsub = sys.ObjUtil.coerce(pending.req(), Unsubscribe.type$);
    unsub.topics().each((topic,i) => {
      let reason = ((this$) => { let $_u69 = ack.reasons().getSafe(i); if ($_u69 != null) return $_u69; return ReasonCode.success(); })(this$);
      ((this$) => { let $_u70 = this$.#topics.remove(topic); if ($_u70 == null) return null; return this$.#topics.remove(topic).onUnsubscribed(topic, sys.ObjUtil.coerce(reason, ReasonCode.type$), ack.props()); })(this$);
      return;
    });
    return;
  }

}

class ClientPersistence {
  constructor() {
    const this$ = this;
  }

  typeof() { return ClientPersistence.type$; }

  get(key) {
    throw sys.UnsupportedErr.make();
  }

}

class ClientMemDb extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#sessions = concurrent.ConcurrentMap.make();
    this.#isOpened = concurrent.AtomicBool.make(false);
    this.#sessionRef = concurrent.AtomicRef.make(null);
    return;
  }

  typeof() { return ClientMemDb.type$; }

  #sessions = null;

  // private field reflection only
  __sessions(it) { if (it === undefined) return this.#sessions; else this.#sessions = it; }

  #isOpened = null;

  // private field reflection only
  __isOpened(it) { if (it === undefined) return this.#isOpened; else this.#isOpened = it; }

  #sessionRef = null;

  // private field reflection only
  __sessionRef(it) { if (it === undefined) return this.#sessionRef; else this.#sessionRef = it; }

  static make() {
    const $self = new ClientMemDb();
    ClientMemDb.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  session(checked) {
    if (checked === undefined) checked = true;
    if (checked) {
      this.checkOpened();
    }
    ;
    return sys.ObjUtil.coerce(((this$) => { let $_u71 = sys.ObjUtil.as(this$.#sessionRef.val(), sys.Unsafe.type$); if ($_u71 == null) return null; return sys.ObjUtil.as(this$.#sessionRef.val(), sys.Unsafe.type$).val(); })(this), ClientMemSession.type$.toNullable());
  }

  open(clientId) {
    if (this.#isOpened.val()) {
      throw MqttErr.make("Already opened");
    }
    ;
    let session = sys.ObjUtil.coerce(this.#sessions.getOrAdd(clientId, ClientMemSession.make(clientId)), ClientMemSession.type$);
    this.#sessionRef.val(sys.Unsafe.make(session));
    this.#isOpened.val(true);
    return;
  }

  get(key) {
    return this.session().get(key);
  }

  put(key,packet) {
    this.session().put(key, packet);
    return;
  }

  each(f) {
    const this$ = this;
    this.session().keys().each((key) => {
      sys.Func.call(f, sys.ObjUtil.coerce(this$.session().packets().get(key), PersistablePacket.type$), key);
      return;
    });
    return;
  }

  remove(key) {
    this.session().remove(key);
    return;
  }

  containsKey(key) {
    return this.session().packets().containsKey(key);
  }

  close() {
    this.checkOpened();
    this.#isOpened.val(false);
    this.#sessionRef.val(null);
    return;
  }

  clear(clientId) {
    ((this$) => { let $_u72 = sys.ObjUtil.as(this$.#sessions.get(clientId), ClientMemSession.type$); if ($_u72 == null) return null; return sys.ObjUtil.as(this$.#sessions.get(clientId), ClientMemSession.type$).clear(); })(this);
    return;
  }

  toStr() {
    if (!this.#isOpened.val()) {
      return "[closed]";
    }
    ;
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[open] [", this.session().clientId()), "] [# keys: "), sys.ObjUtil.coerce(this.session().keys().size(), sys.Obj.type$.toNullable())), "]");
  }

  checkOpened() {
    if (!this.#isOpened.val()) {
      throw MqttErr.make("Not opened");
    }
    ;
    return;
  }

}

class ClientMemSession extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#packets = concurrent.ConcurrentMap.make();
    return;
  }

  typeof() { return ClientMemSession.type$; }

  #clientId = null;

  clientId() { return this.#clientId; }

  __clientId(it) { if (it === undefined) return this.#clientId; else this.#clientId = it; }

  #packets = null;

  packets() { return this.#packets; }

  __packets(it) { if (it === undefined) return this.#packets; else this.#packets = it; }

  static make(clientId) {
    const $self = new ClientMemSession();
    ClientMemSession.make$($self,clientId);
    return $self;
  }

  static make$($self,clientId) {
    ;
    $self.#clientId = clientId;
    return;
  }

  get(key) {
    return sys.ObjUtil.coerce(this.#packets.get(key), PersistablePacket.type$.toNullable());
  }

  put(key,packet) {
    this.#packets.set(key, packet);
    return;
  }

  remove(key) {
    this.#packets.remove(key);
    return;
  }

  clear() {
    this.#packets.clear();
    return;
  }

  keys() {
    return sys.ObjUtil.coerce(this.#packets.keys(sys.Str.type$), sys.Type.find("sys::Str[]"));
  }

}

class ControlPacket extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#packetId = concurrent.AtomicInt.make(0);
    return;
  }

  typeof() { return ControlPacket.type$; }

  static #empty = undefined;

  static empty() {
    if (ControlPacket.#empty === undefined) {
      ControlPacket.static$init();
      if (ControlPacket.#empty === undefined) ControlPacket.#empty = null;
    }
    return ControlPacket.#empty;
  }

  #packetId = null;

  packetId() { return this.#packetId; }

  __packetId(it) { if (it === undefined) return this.#packetId; else this.#packetId = it; }

  static make() {
    const $self = new ControlPacket();
    ControlPacket.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  packetFlags() {
    return 0;
  }

  pid() {
    return this.#packetId.val();
  }

  encode(out,version) {
    let varPay = this.variableHeaderAndPayload(version);
    let byte1 = sys.Int.or(sys.Int.shiftl(this.type().ordinal(), 4), sys.Int.and(this.packetFlags(), 15));
    out.write(byte1);
    DataCodec.writeVbi(varPay.size(), out);
    out.writeBuf(varPay);
    return;
  }

  static readPacket(in$,version) {
    let byte1 = DataCodec.readByte(in$);
    let flags = sys.Int.and(byte1, 15);
    let code = sys.Int.shiftr(byte1, 4);
    let type = PacketType.vals().getSafe(code);
    let len = DataCodec.readVbi(in$);
    let varPay = in$.readBufFully(null, len);
    let $_u73 = type;
    if (sys.ObjUtil.equals($_u73, PacketType.connack())) {
      return ConnAck.decode(varPay.in(), version);
    }
    else if (sys.ObjUtil.equals($_u73, PacketType.publish())) {
      return Publish.decode(flags, varPay.in(), version);
    }
    else if (sys.ObjUtil.equals($_u73, PacketType.puback())) {
      return PubAck.decode(varPay.in(), version);
    }
    else if (sys.ObjUtil.equals($_u73, PacketType.pubrec())) {
      return PubRec.decode(varPay.in(), version);
    }
    else if (sys.ObjUtil.equals($_u73, PacketType.pubrel())) {
      return PubRel.decode(flags, varPay.in(), version);
    }
    else if (sys.ObjUtil.equals($_u73, PacketType.pubcomp())) {
      return PubComp.decode(varPay.in(), version);
    }
    else if (sys.ObjUtil.equals($_u73, PacketType.subscribe())) {
      return Subscribe.decode(flags, varPay.in(), version);
    }
    else if (sys.ObjUtil.equals($_u73, PacketType.suback())) {
      return SubAck.decode(varPay.in(), version);
    }
    else if (sys.ObjUtil.equals($_u73, PacketType.unsubscribe())) {
      return Unsubscribe.decode(flags, varPay.in(), version);
    }
    else if (sys.ObjUtil.equals($_u73, PacketType.unsuback())) {
      return UnsubAck.decode(varPay.in(), version);
    }
    else if (sys.ObjUtil.equals($_u73, PacketType.pingresp())) {
      return PingResp.defVal();
    }
    else {
      throw MqttErr.make(sys.Str.plus("Unsupported packet type: ", sys.ObjUtil.coerce(code, sys.Obj.type$.toNullable())));
    }
    ;
  }

  checkReservedFlags(flags) {
    if (sys.ObjUtil.compareNE(flags, 0)) {
      throw MalformedPacketErr.make(sys.Str.plus("Invalid packet flags: ", sys.Int.toRadix(flags, 16, sys.ObjUtil.coerce(2, sys.Int.type$.toNullable()))));
    }
    ;
    return;
  }

  static static$init() {
    ControlPacket.#empty = sys.ObjUtil.coerce(((this$) => { let $_u74 = sys.ObjUtil.coerce(sys.Buf.make(0), sys.Buf.type$); if ($_u74 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(sys.Buf.make(0), sys.Buf.type$)); })(this), sys.Buf.type$);
    return;
  }

}

class PersistableControlPacket extends ControlPacket {
  constructor() {
    super();
    const this$ = this;
    this.#packetVersionRef = concurrent.AtomicRef.make(null);
    return;
  }

  typeof() { return PersistableControlPacket.type$; }

  #packetVersionRef = null;

  packetVersionRef() { return this.#packetVersionRef; }

  __packetVersionRef(it) { if (it === undefined) return this.#packetVersionRef; else this.#packetVersionRef = it; }

  markDup() {
    return;
  }

  packetVersion() {
    return sys.ObjUtil.coerce(((this$) => { let $_u75 = this$.#packetVersionRef.val(); if ($_u75 != null) return $_u75; throw MqttErr.make(sys.Str.plus("Illegal State: packet version not set on ", sys.ObjUtil.typeof(this$))); })(this), MqttVersion.type$);
  }

  in() {
    let buf = sys.Buf.make();
    this.encode(buf.out(), this.packetVersion());
    return sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).in();
  }

  static fromPersistablePacket(p) {
    return sys.ObjUtil.coerce(ControlPacket.readPacket(p.in(), p.packetVersion()), PersistableControlPacket.type$);
  }

  static make() {
    const $self = new PersistableControlPacket();
    PersistableControlPacket.make$($self);
    return $self;
  }

  static make$($self) {
    ControlPacket.make$($self);
    ;
    return;
  }

}

class PingReq extends ControlPacket {
  constructor() {
    super();
    const this$ = this;
    this.#type = PacketType.pingreq();
    return;
  }

  typeof() { return PingReq.type$; }

  static #defVal = undefined;

  static defVal() {
    if (PingReq.#defVal === undefined) {
      PingReq.static$init();
      if (PingReq.#defVal === undefined) PingReq.#defVal = null;
    }
    return PingReq.#defVal;
  }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  static make() {
    const $self = new PingReq();
    PingReq.make$($self);
    return $self;
  }

  static make$($self) {
    ControlPacket.make$($self);
    ;
    return;
  }

  variableHeaderAndPayload(version) {
    return ControlPacket.empty();
  }

  static static$init() {
    PingReq.#defVal = PingReq.make();
    return;
  }

}

class PingResp extends ControlPacket {
  constructor() {
    super();
    const this$ = this;
    this.#type = PacketType.pingresp();
    return;
  }

  typeof() { return PingResp.type$; }

  static #defVal = undefined;

  static defVal() {
    if (PingResp.#defVal === undefined) {
      PingResp.static$init();
      if (PingResp.#defVal === undefined) PingResp.#defVal = null;
    }
    return PingResp.#defVal;
  }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  static make() {
    const $self = new PingResp();
    PingResp.make$($self);
    return $self;
  }

  static make$($self) {
    ControlPacket.make$($self);
    ;
    return;
  }

  variableHeaderAndPayload(version) {
    return ControlPacket.empty();
  }

  static static$init() {
    PingResp.#defVal = PingResp.make();
    return;
  }

}

class ReasonCode extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ReasonCode.type$; }

  static success() { return ReasonCode.vals().get(0); }

  static normal_disconnection() { return ReasonCode.vals().get(1); }

  static granted_qos0() { return ReasonCode.vals().get(2); }

  static granted_qos1() { return ReasonCode.vals().get(3); }

  static granted_qos2() { return ReasonCode.vals().get(4); }

  static disconnect_with_will_message() { return ReasonCode.vals().get(5); }

  static not_authorized_v3() { return ReasonCode.vals().get(6); }

  static no_matching_subscribers() { return ReasonCode.vals().get(7); }

  static no_subscription_existed() { return ReasonCode.vals().get(8); }

  static continue_auth() { return ReasonCode.vals().get(9); }

  static reauthenticate() { return ReasonCode.vals().get(10); }

  static unspecified_error() { return ReasonCode.vals().get(11); }

  static malformed_packet() { return ReasonCode.vals().get(12); }

  static protocol_error() { return ReasonCode.vals().get(13); }

  static implementation_specific_error() { return ReasonCode.vals().get(14); }

  static unsupported_protocol_version() { return ReasonCode.vals().get(15); }

  static client_identifier_not_valid() { return ReasonCode.vals().get(16); }

  static bad_username_or_password() { return ReasonCode.vals().get(17); }

  static not_authorized() { return ReasonCode.vals().get(18); }

  static server_unavailable() { return ReasonCode.vals().get(19); }

  static server_busy() { return ReasonCode.vals().get(20); }

  static banned() { return ReasonCode.vals().get(21); }

  static server_shutting_down() { return ReasonCode.vals().get(22); }

  static bad_auth_method() { return ReasonCode.vals().get(23); }

  static keep_alive_timeout() { return ReasonCode.vals().get(24); }

  static session_taken_over() { return ReasonCode.vals().get(25); }

  static topic_filter_invalid() { return ReasonCode.vals().get(26); }

  static topic_name_invalid() { return ReasonCode.vals().get(27); }

  static packet_id_in_use() { return ReasonCode.vals().get(28); }

  static packet_id_not_found() { return ReasonCode.vals().get(29); }

  static receive_max_exceeded() { return ReasonCode.vals().get(30); }

  static topic_alias_invalid() { return ReasonCode.vals().get(31); }

  static packet_too_large() { return ReasonCode.vals().get(32); }

  static message_rate_too_high() { return ReasonCode.vals().get(33); }

  static quota_exceeded() { return ReasonCode.vals().get(34); }

  static administrative_action() { return ReasonCode.vals().get(35); }

  static payload_format_invalid() { return ReasonCode.vals().get(36); }

  static retain_not_supported() { return ReasonCode.vals().get(37); }

  static qos_not_supported() { return ReasonCode.vals().get(38); }

  static use_another_server() { return ReasonCode.vals().get(39); }

  static server_moved() { return ReasonCode.vals().get(40); }

  static shared_subscriptions_not_supported() { return ReasonCode.vals().get(41); }

  static connection_rate_exceeded() { return ReasonCode.vals().get(42); }

  static max_connect_time() { return ReasonCode.vals().get(43); }

  static subscription_ids_not_supported() { return ReasonCode.vals().get(44); }

  static wildcard_subscriptions_not_supported() { return ReasonCode.vals().get(45); }

  static #vals = undefined;

  #code = 0;

  code() { return this.#code; }

  __code(it) { if (it === undefined) return this.#code; else this.#code = it; }

  #types = null;

  types() { return this.#types; }

  __types(it) { if (it === undefined) return this.#types; else this.#types = it; }

  static make($ordinal,$name,code,types) {
    const $self = new ReasonCode();
    ReasonCode.make$($self,$ordinal,$name,code,types);
    return $self;
  }

  static make$($self,$ordinal,$name,code,types) {
    if (types === undefined) types = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("mqtt::PacketType[]"));
    sys.Enum.make$($self, $ordinal, $name);
    $self.#code = code;
    $self.#types = sys.ObjUtil.coerce(((this$) => { let $_u76 = types; if ($_u76 == null) return null; return sys.ObjUtil.toImmutable(types); })($self), sys.Type.find("mqtt::PacketType[]"));
    return;
  }

  isErr() {
    return sys.ObjUtil.compareGE(this.#code, 128);
  }

  v3() {
    if (sys.ObjUtil.equals(this.#code, 0)) {
      return 0;
    }
    ;
    let $_u77 = this;
    if (sys.ObjUtil.equals($_u77, ReasonCode.unsupported_protocol_version())) {
      return 1;
    }
    else if (sys.ObjUtil.equals($_u77, ReasonCode.client_identifier_not_valid())) {
      return 2;
    }
    else if (sys.ObjUtil.equals($_u77, ReasonCode.server_unavailable())) {
      return 3;
    }
    else if (sys.ObjUtil.equals($_u77, ReasonCode.bad_username_or_password())) {
      return 4;
    }
    else if (sys.ObjUtil.equals($_u77, ReasonCode.not_authorized_v3())) {
      return 5;
    }
    else if (sys.ObjUtil.equals($_u77, ReasonCode.not_authorized())) {
      return 5;
    }
    else if (sys.ObjUtil.equals($_u77, ReasonCode.unspecified_error())) {
      return 8;
    }
    ;
    throw MqttErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this), " ("), sys.ObjUtil.coerce(this.#code, sys.Obj.type$.toNullable())), ") does not map to a 3.1.1 reason code"));
  }

  static fromCode(code,type,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let vals = ReasonCode.vals().findAll((it) => {
      return sys.ObjUtil.equals(it.#code, code);
    });
    let val = vals.findAll((it) => {
      return it.#types.contains(type);
    });
    if (sys.ObjUtil.compareGT(val.size(), 1)) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Multiple codes matched ", sys.ObjUtil.coerce(code, sys.Obj.type$.toNullable())), ": "), val));
    }
    ;
    if (sys.ObjUtil.equals(val.size(), 1)) {
      return val.first();
    }
    ;
    if (checked) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("No reason code for ", type), " matches "), sys.ObjUtil.coerce(code, sys.Obj.type$.toNullable())));
    }
    ;
    return null;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(ReasonCode.type$, ReasonCode.vals(), name$, checked);
  }

  static vals() {
    if (ReasonCode.#vals == null) {
      ReasonCode.#vals = sys.List.make(ReasonCode.type$, [
        ReasonCode.make(0, "success", 0, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.puback(), PacketType.pubrec(), PacketType.pubrel(), PacketType.pubcomp(), PacketType.unsuback(), PacketType.auth()])),
        ReasonCode.make(1, "normal_disconnection", 0, sys.List.make(PacketType.type$, [PacketType.disconnect()])),
        ReasonCode.make(2, "granted_qos0", 0, sys.List.make(PacketType.type$, [PacketType.suback()])),
        ReasonCode.make(3, "granted_qos1", 1, sys.List.make(PacketType.type$, [PacketType.suback()])),
        ReasonCode.make(4, "granted_qos2", 2, sys.List.make(PacketType.type$, [PacketType.suback()])),
        ReasonCode.make(5, "disconnect_with_will_message", 4, sys.List.make(PacketType.type$, [PacketType.disconnect()])),
        ReasonCode.make(6, "not_authorized_v3", 5, sys.List.make(PacketType.type$, [PacketType.connack()])),
        ReasonCode.make(7, "no_matching_subscribers", 16, sys.List.make(PacketType.type$, [PacketType.puback(), PacketType.pubrec()])),
        ReasonCode.make(8, "no_subscription_existed", 17, sys.List.make(PacketType.type$, [PacketType.unsuback()])),
        ReasonCode.make(9, "continue_auth", 24, sys.List.make(PacketType.type$, [PacketType.auth()])),
        ReasonCode.make(10, "reauthenticate", 25, sys.List.make(PacketType.type$, [PacketType.auth()])),
        ReasonCode.make(11, "unspecified_error", 128, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.puback(), PacketType.pubrec(), PacketType.suback(), PacketType.unsuback(), PacketType.disconnect()])),
        ReasonCode.make(12, "malformed_packet", 129, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.disconnect()])),
        ReasonCode.make(13, "protocol_error", 130, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.disconnect()])),
        ReasonCode.make(14, "implementation_specific_error", 131, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.puback(), PacketType.pubrec(), PacketType.suback(), PacketType.unsuback(), PacketType.disconnect()])),
        ReasonCode.make(15, "unsupported_protocol_version", 132, sys.List.make(PacketType.type$, [PacketType.connack()])),
        ReasonCode.make(16, "client_identifier_not_valid", 133, sys.List.make(PacketType.type$, [PacketType.connack()])),
        ReasonCode.make(17, "bad_username_or_password", 134, sys.List.make(PacketType.type$, [PacketType.connack()])),
        ReasonCode.make(18, "not_authorized", 135, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.puback(), PacketType.pubrec(), PacketType.suback(), PacketType.unsuback(), PacketType.disconnect()])),
        ReasonCode.make(19, "server_unavailable", 136, sys.List.make(PacketType.type$, [PacketType.connack()])),
        ReasonCode.make(20, "server_busy", 137, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.disconnect()])),
        ReasonCode.make(21, "banned", 138, sys.List.make(PacketType.type$, [PacketType.connack()])),
        ReasonCode.make(22, "server_shutting_down", 139, sys.List.make(PacketType.type$, [PacketType.disconnect()])),
        ReasonCode.make(23, "bad_auth_method", 140, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.disconnect()])),
        ReasonCode.make(24, "keep_alive_timeout", 141, sys.List.make(PacketType.type$, [PacketType.disconnect()])),
        ReasonCode.make(25, "session_taken_over", 142, sys.List.make(PacketType.type$, [PacketType.disconnect()])),
        ReasonCode.make(26, "topic_filter_invalid", 143, sys.List.make(PacketType.type$, [PacketType.suback(), PacketType.unsuback(), PacketType.disconnect()])),
        ReasonCode.make(27, "topic_name_invalid", 144, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.puback(), PacketType.pubrec(), PacketType.disconnect()])),
        ReasonCode.make(28, "packet_id_in_use", 145, sys.List.make(PacketType.type$, [PacketType.puback(), PacketType.pubrec(), PacketType.suback(), PacketType.unsuback()])),
        ReasonCode.make(29, "packet_id_not_found", 146, sys.List.make(PacketType.type$, [PacketType.pubrel(), PacketType.pubcomp()])),
        ReasonCode.make(30, "receive_max_exceeded", 147, sys.List.make(PacketType.type$, [PacketType.disconnect()])),
        ReasonCode.make(31, "topic_alias_invalid", 148, sys.List.make(PacketType.type$, [PacketType.disconnect()])),
        ReasonCode.make(32, "packet_too_large", 149, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.disconnect()])),
        ReasonCode.make(33, "message_rate_too_high", 150, sys.List.make(PacketType.type$, [PacketType.disconnect()])),
        ReasonCode.make(34, "quota_exceeded", 151, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.puback(), PacketType.pubrec(), PacketType.suback(), PacketType.disconnect()])),
        ReasonCode.make(35, "administrative_action", 152, sys.List.make(PacketType.type$, [PacketType.disconnect()])),
        ReasonCode.make(36, "payload_format_invalid", 153, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.puback(), PacketType.pubrec(), PacketType.disconnect()])),
        ReasonCode.make(37, "retain_not_supported", 154, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.disconnect()])),
        ReasonCode.make(38, "qos_not_supported", 155, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.disconnect()])),
        ReasonCode.make(39, "use_another_server", 156, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.disconnect()])),
        ReasonCode.make(40, "server_moved", 157, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.disconnect()])),
        ReasonCode.make(41, "shared_subscriptions_not_supported", 158, sys.List.make(PacketType.type$, [PacketType.suback(), PacketType.disconnect()])),
        ReasonCode.make(42, "connection_rate_exceeded", 159, sys.List.make(PacketType.type$, [PacketType.connack(), PacketType.disconnect()])),
        ReasonCode.make(43, "max_connect_time", 160, sys.List.make(PacketType.type$, [PacketType.disconnect()])),
        ReasonCode.make(44, "subscription_ids_not_supported", 161, sys.List.make(PacketType.type$, [PacketType.suback(), PacketType.disconnect()])),
        ReasonCode.make(45, "wildcard_subscriptions_not_supported", 162, sys.List.make(PacketType.type$, [PacketType.suback(), PacketType.disconnect()])),
      ]).toImmutable();
    }
    return ReasonCode.#vals;
  }

  static static$init() {
    const $_u78 = ReasonCode.vals();
    if (true) {
    }
    ;
    return;
  }

}

class Publish extends PersistableControlPacket {
  constructor() {
    super();
    const this$ = this;
    this.#type = PacketType.publish();
    this.#isDup = concurrent.AtomicBool.make(false);
    return;
  }

  typeof() { return Publish.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #isDup = null;

  // private field reflection only
  __isDup(it) { if (it === undefined) return this.#isDup; else this.#isDup = it; }

  #topicName = null;

  topicName() { return this.#topicName; }

  __topicName(it) { if (it === undefined) return this.#topicName; else this.#topicName = it; }

  #msg = null;

  msg() { return this.#msg; }

  __msg(it) { if (it === undefined) return this.#msg; else this.#msg = it; }

  static make(f) {
    const $self = new Publish();
    Publish.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    PersistableControlPacket.make$($self);
    ;
    sys.Func.call(f, $self);
    return;
  }

  static makeFields(topicName,msg) {
    const $self = new Publish();
    Publish.makeFields$($self,topicName,msg);
    return $self;
  }

  static makeFields$($self,topicName,msg) {
    PersistableControlPacket.make$($self);
    ;
    $self.#topicName = topicName;
    $self.#msg = msg;
    return;
  }

  static decode(flags,in$,version) {
    const $self = new Publish();
    Publish.decode$($self,flags,in$,version);
    return $self;
  }

  static decode$($self,flags,in$,version) {
    const this$ = $self;
    PersistableControlPacket.make$($self);
    ;
    $self.#isDup.val(sys.ObjUtil.compareNE(sys.Int.and(flags, 8), 0));
    let qos = QoS.vals().get(sys.Int.and(sys.Int.shiftr(flags, 1), 3));
    let retain = sys.ObjUtil.compareNE(sys.Int.and(flags, 1), 0);
    $self.#topicName = DataCodec.readUtf8(in$);
    if (qos !== QoS.zero()) {
      $self.packetId().val(DataCodec.readByte2(in$));
    }
    ;
    let props = ((this$) => { if (version.is5()) return DataCodec.readProps(in$); return Properties.make(); })($self);
    let payload = ((this$) => { if (sys.ObjUtil.equals(in$.avail(), 0)) return ControlPacket.empty(); return in$.readAllBuf(); })($self);
    $self.#msg = Message.makeFields(payload, qos, retain, (it) => {
      it.__utf8Payload(props.utf8Payload());
      it.__expiryInterval(props.messageExpiryInterval());
      it.__topicAlias(sys.ObjUtil.coerce(props.get(Property.topicAlias()), sys.Int.type$.toNullable()));
      it.__responseTopic(sys.ObjUtil.coerce(props.get(Property.responseTopic()), sys.Str.type$.toNullable()));
      it.__correlationData(sys.ObjUtil.coerce(((this$) => { let $_u81 = sys.ObjUtil.coerce(props.get(Property.correlationData()), sys.Buf.type$.toNullable()); if ($_u81 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(props.get(Property.correlationData()), sys.Buf.type$.toNullable())); })(this$), sys.Buf.type$.toNullable()));
      it.__contentType(sys.ObjUtil.coerce(props.get(Property.contentType()), sys.Str.type$.toNullable()));
      it.__userProps(sys.ObjUtil.coerce(((this$) => { let $_u82 = props.userProps(); if ($_u82 == null) return null; return sys.ObjUtil.toImmutable(props.userProps()); })(this$), sys.Type.find("mqtt::StrPair[]")));
      it.__subscriptionIds(sys.ObjUtil.coerce(((this$) => { let $_u83 = props.subscriptionIds(); if ($_u83 == null) return null; return sys.ObjUtil.toImmutable(props.subscriptionIds()); })(this$), sys.Type.find("sys::Int[]")));
      return;
    });
    return;
  }

  markDup() {
    this.#isDup.val(true);
    return;
  }

  payload() {
    return this.#msg.payload();
  }

  qos() {
    return this.#msg.qos();
  }

  retain() {
    return this.#msg.retain();
  }

  packetFlags() {
    let flags = 0;
    if ((this.#isDup.val() && this.qos() !== QoS.zero())) {
      (flags = sys.Int.or(flags, 8));
    }
    ;
    (flags = sys.Int.or(flags, sys.Int.shiftl(this.qos().ordinal(), 1)));
    if (this.retain()) {
      (flags = sys.Int.or(flags, 1));
    }
    ;
    return flags;
  }

  variableHeaderAndPayload(version) {
    Topic.validateName(this.#topicName);
    let buf = sys.Buf.make(sys.Int.plus(sys.Int.plus(sys.Str.size(this.#topicName), 4), this.#msg.payload().size()));
    DataCodec.writeUtf8(this.#topicName, sys.ObjUtil.coerce(buf, sys.Obj.type$));
    if (this.qos() !== QoS.zero()) {
      DataCodec.writeByte2(this.pid(), sys.ObjUtil.coerce(buf, sys.Obj.type$));
    }
    ;
    if (version.is5()) {
      DataCodec.writeProps(this.#msg.props(), sys.ObjUtil.coerce(buf, sys.Obj.type$));
    }
    ;
    buf.writeBuf(this.#msg.payload());
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$);
  }

}

class QoS extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return QoS.type$; }

  static zero() { return QoS.vals().get(0); }

  static one() { return QoS.vals().get(1); }

  static two() { return QoS.vals().get(2); }

  static #vals = undefined;

  isZero() {
    return this === QoS.zero();
  }

  static make($ordinal,$name) {
    const $self = new QoS();
    QoS.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(QoS.type$, QoS.vals(), name$, checked);
  }

  static vals() {
    if (QoS.#vals == null) {
      QoS.#vals = sys.List.make(QoS.type$, [
        QoS.make(0, "zero", ),
        QoS.make(1, "one", ),
        QoS.make(2, "two", ),
      ]).toImmutable();
    }
    return QoS.#vals;
  }

  static static$init() {
    const $_u84 = QoS.vals();
    if (true) {
    }
    ;
    return;
  }

}

class PubFlowPacket extends PersistableControlPacket {
  constructor() {
    super();
    const this$ = this;
    this.#reason = ReasonCode.success();
    this.#props = Properties.make();
    return;
  }

  typeof() { return PubFlowPacket.type$; }

  #reason = null;

  reason() { return this.#reason; }

  __reason(it) { if (it === undefined) return this.#reason; else this.#reason = it; }

  #props = null;

  props() { return this.#props; }

  __props(it) { if (it === undefined) return this.#props; else this.#props = it; }

  static make(pid,f) {
    const $self = new PubFlowPacket();
    PubFlowPacket.make$($self,pid,f);
    return $self;
  }

  static make$($self,pid,f) {
    if (f === undefined) f = null;
    PersistableControlPacket.make$($self);
    ;
    ((this$) => { let $_u85 = f; if ($_u85 == null) return null; return sys.Func.call(f, this$); })($self);
    $self.packetId().val(pid);
    return;
  }

  static decode(in$,version) {
    const $self = new PubFlowPacket();
    PubFlowPacket.decode$($self,in$,version);
    return $self;
  }

  static decode$($self,in$,version) {
    PersistableControlPacket.make$($self);
    ;
    $self.packetId().val(DataCodec.readByte2(in$));
    if (version.is5()) {
      if (sys.ObjUtil.compareGT(in$.avail(), 0)) {
        $self.#reason = sys.ObjUtil.coerce(ReasonCode.fromCode(DataCodec.readByte(in$), $self.type()), ReasonCode.type$);
      }
      ;
      if (sys.ObjUtil.compareGT(in$.avail(), 0)) {
        $self.#props = DataCodec.readProps(in$);
      }
      ;
    }
    ;
    return;
  }

  variableHeaderAndPayload(version) {
    let buf = sys.Buf.make(16);
    DataCodec.writeByte2(this.pid(), sys.ObjUtil.coerce(buf, sys.Obj.type$));
    if (version.is5()) {
      DataCodec.writeByte(this.#reason.code(), sys.ObjUtil.coerce(buf, sys.Obj.type$));
      DataCodec.writeProps(this.#props, sys.ObjUtil.coerce(buf, sys.Obj.type$));
    }
    ;
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$);
  }

  isErr() {
    return this.#reason.isErr();
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(this).name()), "(id="), sys.ObjUtil.coerce(this.pid(), sys.Obj.type$.toNullable())), ", code="), this.#reason), ")");
  }

}

class PubAck extends PubFlowPacket {
  constructor() {
    super();
    const this$ = this;
    this.#type = PacketType.puback();
    return;
  }

  typeof() { return PubAck.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  static make(pid,f) {
    const $self = new PubAck();
    PubAck.make$($self,pid,f);
    return $self;
  }

  static make$($self,pid,f) {
    if (f === undefined) f = null;
    PubFlowPacket.make$($self, pid, sys.ObjUtil.coerce(f, sys.Type.find("|mqtt::PubFlowPacket->sys::Void|?")));
    ;
    return;
  }

  static decode(in$,version) {
    const $self = new PubAck();
    PubAck.decode$($self,in$,version);
    return $self;
  }

  static decode$($self,in$,version) {
    PubFlowPacket.decode$($self, in$, version);
    ;
    return;
  }

}

class PubRec extends PubFlowPacket {
  constructor() {
    super();
    const this$ = this;
    this.#type = PacketType.pubrec();
    return;
  }

  typeof() { return PubRec.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  static make(pid,f) {
    const $self = new PubRec();
    PubRec.make$($self,pid,f);
    return $self;
  }

  static make$($self,pid,f) {
    if (f === undefined) f = null;
    PubFlowPacket.make$($self, pid, sys.ObjUtil.coerce(f, sys.Type.find("|mqtt::PubFlowPacket->sys::Void|?")));
    ;
    return;
  }

  static decode(in$,version) {
    const $self = new PubRec();
    PubRec.decode$($self,in$,version);
    return $self;
  }

  static decode$($self,in$,version) {
    PubFlowPacket.decode$($self, in$, version);
    ;
    return;
  }

}

class PubRel extends PubFlowPacket {
  constructor() {
    super();
    const this$ = this;
    this.#type = PacketType.pubrel();
    return;
  }

  typeof() { return PubRel.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  static make(pid,f) {
    const $self = new PubRel();
    PubRel.make$($self,pid,f);
    return $self;
  }

  static make$($self,pid,f) {
    if (f === undefined) f = null;
    PubFlowPacket.make$($self, pid, sys.ObjUtil.coerce(f, sys.Type.find("|mqtt::PubFlowPacket->sys::Void|?")));
    ;
    return;
  }

  static decode(flags,in$,version) {
    const $self = new PubRel();
    PubRel.decode$($self,flags,in$,version);
    return $self;
  }

  static decode$($self,flags,in$,version) {
    PubFlowPacket.decode$($self, in$, version);
    ;
    if (sys.ObjUtil.compareNE(flags, $self.packetFlags())) {
      throw MqttErr.make(sys.Str.plus("Invalid packet flags: ", sys.Int.toRadix(flags, 2, sys.ObjUtil.coerce(8, sys.Int.type$.toNullable()))));
    }
    ;
    return;
  }

  packetFlags() {
    return 2;
  }

}

class PubComp extends PubFlowPacket {
  constructor() {
    super();
    const this$ = this;
    this.#type = PacketType.pubcomp();
    return;
  }

  typeof() { return PubComp.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  static make(pid,f) {
    const $self = new PubComp();
    PubComp.make$($self,pid,f);
    return $self;
  }

  static make$($self,pid,f) {
    if (f === undefined) f = null;
    PubFlowPacket.make$($self, pid, sys.ObjUtil.coerce(f, sys.Type.find("|mqtt::PubFlowPacket->sys::Void|?")));
    ;
    return;
  }

  static decode(in$,version) {
    const $self = new PubComp();
    PubComp.decode$($self,in$,version);
    return $self;
  }

  static decode$($self,in$,version) {
    PubFlowPacket.decode$($self, in$, version);
    ;
    return;
  }

}

class Unsubscribe extends ControlPacket {
  constructor() {
    super();
    const this$ = this;
    this.#type = PacketType.unsubscribe();
    this.#props = Properties.make();
    return;
  }

  typeof() { return Unsubscribe.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #props = null;

  props() { return this.#props; }

  __props(it) { if (it === undefined) return this.#props; else this.#props = it; }

  #topics = null;

  topics() { return this.#topics; }

  __topics(it) { if (it === undefined) return this.#topics; else this.#topics = it; }

  static makeFields(topics) {
    const $self = new Unsubscribe();
    Unsubscribe.makeFields$($self,topics);
    return $self;
  }

  static makeFields$($self,topics) {
    ControlPacket.make$($self);
    ;
    $self.#topics = sys.ObjUtil.coerce(((this$) => { let $_u86 = topics; if ($_u86 == null) return null; return sys.ObjUtil.toImmutable(topics); })($self), sys.Type.find("sys::Str[]"));
    $self.checkFields();
    return;
  }

  static decode(flags,in$,version) {
    const $self = new Unsubscribe();
    Unsubscribe.decode$($self,flags,in$,version);
    return $self;
  }

  static decode$($self,flags,in$,version) {
    ControlPacket.make$($self);
    ;
    if (sys.ObjUtil.compareNE(flags, $self.packetFlags())) {
      throw MqttErr.make(sys.Str.plus("Invalid packet flags: ", sys.Int.toRadix(flags, 2, sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()))));
    }
    ;
    $self.packetId().val(DataCodec.readByte2(in$));
    if (version.is5()) {
      $self.#props = DataCodec.readProps(in$);
    }
    ;
    let acc = sys.List.make(sys.Str.type$);
    while (sys.ObjUtil.compareGT(in$.avail(), 0)) {
      acc.add(DataCodec.readUtf8(in$));
    }
    ;
    $self.#topics = sys.ObjUtil.coerce(((this$) => { let $_u87 = acc; if ($_u87 == null) return null; return sys.ObjUtil.toImmutable(acc); })($self), sys.Type.find("sys::Str[]"));
    $self.checkFields();
    return;
  }

  checkFields() {
    if (this.#topics.isEmpty()) {
      throw sys.ArgErr.make("Must specify at least one topic");
    }
    ;
    return;
  }

  packetFlags() {
    return 2;
  }

  variableHeaderAndPayload(version) {
    const this$ = this;
    this.#topics.each((it) => {
      Topic.validateFilter(it);
      return;
    });
    let buf = sys.Buf.make(256);
    DataCodec.writeByte2(this.pid(), sys.ObjUtil.coerce(buf, sys.Obj.type$));
    if (version.is5()) {
      DataCodec.writeProps(this.#props, sys.ObjUtil.coerce(buf, sys.Obj.type$));
    }
    ;
    this.#topics.each((topic) => {
      DataCodec.writeUtf8(topic, sys.ObjUtil.coerce(buf, sys.Obj.type$));
      return;
    });
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$);
  }

}

class UnsubAck extends ControlPacket {
  constructor() {
    super();
    const this$ = this;
    this.#type = PacketType.unsuback();
    this.#props = Properties.make();
    this.#reasons = sys.ObjUtil.coerce(((this$) => { let $_u88 = sys.ObjUtil.coerce(ReasonCode.type$.emptyList(), sys.Type.find("mqtt::ReasonCode[]")); if ($_u88 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(ReasonCode.type$.emptyList(), sys.Type.find("mqtt::ReasonCode[]"))); })(this), sys.Type.find("mqtt::ReasonCode[]"));
    return;
  }

  typeof() { return UnsubAck.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #props = null;

  props() { return this.#props; }

  __props(it) { if (it === undefined) return this.#props; else this.#props = it; }

  #reasons = null;

  reasons() { return this.#reasons; }

  __reasons(it) { if (it === undefined) return this.#reasons; else this.#reasons = it; }

  static decode(in$,version) {
    const $self = new UnsubAck();
    UnsubAck.decode$($self,in$,version);
    return $self;
  }

  static decode$($self,in$,version) {
    ControlPacket.make$($self);
    ;
    $self.packetId().val(DataCodec.readByte2(in$));
    if (version.is5()) {
      $self.#props = DataCodec.readProps(in$);
      let acc = sys.List.make(ReasonCode.type$);
      while (sys.ObjUtil.compareGT(in$.avail(), 0)) {
        acc.add(sys.ObjUtil.coerce(ReasonCode.fromCode(DataCodec.readByte(in$), $self.#type), ReasonCode.type$));
      }
      ;
      $self.#reasons = sys.ObjUtil.coerce(((this$) => { let $_u89 = acc; if ($_u89 == null) return null; return sys.ObjUtil.toImmutable(acc); })($self), sys.Type.find("mqtt::ReasonCode[]"));
    }
    ;
    return;
  }

  variableHeaderAndPayload(version) {
    const this$ = this;
    let buf = sys.Buf.make(2);
    DataCodec.writeByte2(this.pid(), sys.ObjUtil.coerce(buf, sys.Obj.type$));
    if (version.is5()) {
      DataCodec.writeProps(this.#props, sys.ObjUtil.coerce(buf, sys.Obj.type$));
      this.#reasons.each((reason) => {
        DataCodec.writeByte(reason.code(), sys.ObjUtil.coerce(buf, sys.Obj.type$));
        return;
      });
    }
    ;
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("UnsubAck(id=", sys.ObjUtil.coerce(this.pid(), sys.Obj.type$.toNullable())), ")");
  }

}

class Subscribe extends ControlPacket {
  constructor() {
    super();
    const this$ = this;
    this.#type = PacketType.subscribe();
    this.#props = Properties.make();
    return;
  }

  typeof() { return Subscribe.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #topics = null;

  topics() { return this.#topics; }

  __topics(it) { if (it === undefined) return this.#topics; else this.#topics = it; }

  #opts = null;

  opts() { return this.#opts; }

  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #props = null;

  props() { return this.#props; }

  __props(it) { if (it === undefined) return this.#props; else this.#props = it; }

  static makeFields(topics,opts,props) {
    const $self = new Subscribe();
    Subscribe.makeFields$($self,topics,opts,props);
    return $self;
  }

  static makeFields$($self,topics,opts,props) {
    if (props === undefined) props = Properties.make();
    ControlPacket.make$($self);
    ;
    $self.#topics = sys.ObjUtil.coerce(((this$) => { let $_u90 = topics; if ($_u90 == null) return null; return sys.ObjUtil.toImmutable(topics); })($self), sys.Type.find("sys::Str[]"));
    $self.#opts = sys.ObjUtil.coerce(((this$) => { let $_u91 = opts; if ($_u91 == null) return null; return sys.ObjUtil.toImmutable(opts); })($self), sys.Type.find("sys::Int[]"));
    $self.#props = props;
    $self.checkFields();
    return;
  }

  static decode(flags,in$,version) {
    const $self = new Subscribe();
    Subscribe.decode$($self,flags,in$,version);
    return $self;
  }

  static decode$($self,flags,in$,version) {
    ControlPacket.make$($self);
    ;
    if (sys.ObjUtil.compareNE(flags, $self.packetFlags())) {
      throw MqttErr.make(sys.Str.plus("Invalid packet flags: ", sys.Int.toRadix(flags, 2, sys.ObjUtil.coerce(8, sys.Int.type$.toNullable()))));
    }
    ;
    if (version.is5()) {
      throw sys.UnsupportedErr.make(sys.Str.plus("TODO: ", version));
    }
    ;
    $self.packetId().val(DataCodec.readByte2(in$));
    if (version.is5()) {
      $self.#props = DataCodec.readProps(in$);
    }
    ;
    let t = sys.List.make(sys.Str.type$);
    let o = sys.List.make(sys.Int.type$);
    while (sys.ObjUtil.compareNE(in$.avail(), 0)) {
      t.add(DataCodec.readUtf8(in$));
      o.add(sys.ObjUtil.coerce(DataCodec.readByte(in$), sys.Obj.type$.toNullable()));
    }
    ;
    $self.#topics = sys.ObjUtil.coerce(((this$) => { let $_u92 = t; if ($_u92 == null) return null; return sys.ObjUtil.toImmutable(t); })($self), sys.Type.find("sys::Str[]"));
    $self.#opts = sys.ObjUtil.coerce(((this$) => { let $_u93 = o; if ($_u93 == null) return null; return sys.ObjUtil.toImmutable(o); })($self), sys.Type.find("sys::Int[]"));
    $self.checkFields();
    return;
  }

  checkFields() {
    if (sys.ObjUtil.compareNE(this.#topics.size(), this.#opts.size())) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("# topics (", sys.ObjUtil.coerce(this.#topics.size(), sys.Obj.type$.toNullable())), ") != # options ("), sys.ObjUtil.coerce(this.#opts.size(), sys.Obj.type$.toNullable())), ")"));
    }
    ;
    return;
  }

  packetFlags() {
    return 2;
  }

  variableHeaderAndPayload(version) {
    const this$ = this;
    this.#topics.each((it) => {
      Topic.validateFilter(it);
      return;
    });
    let buf = sys.Buf.make(256);
    DataCodec.writeByte2(this.pid(), sys.ObjUtil.coerce(buf, sys.Obj.type$));
    if (version.is5()) {
      DataCodec.writeProps(this.#props, sys.ObjUtil.coerce(buf, sys.Obj.type$));
    }
    ;
    this.#topics.each((topic,i) => {
      DataCodec.writeUtf8(topic, sys.ObjUtil.coerce(buf, sys.Obj.type$));
      DataCodec.writeByte(this$.#opts.get(i), sys.ObjUtil.coerce(buf, sys.Obj.type$));
      return;
    });
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$);
  }

}

class SubAck extends ControlPacket {
  constructor() {
    super();
    const this$ = this;
    this.#type = PacketType.suback();
    this.#props = Properties.make();
    this.#returnCodes = sys.ObjUtil.coerce(((this$) => { let $_u94 = sys.ObjUtil.coerce(ReasonCode.type$.emptyList(), sys.Type.find("mqtt::ReasonCode[]")); if ($_u94 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(ReasonCode.type$.emptyList(), sys.Type.find("mqtt::ReasonCode[]"))); })(this), sys.Type.find("mqtt::ReasonCode[]"));
    return;
  }

  typeof() { return SubAck.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #props = null;

  props() { return this.#props; }

  __props(it) { if (it === undefined) return this.#props; else this.#props = it; }

  #returnCodes = null;

  returnCodes() { return this.#returnCodes; }

  __returnCodes(it) { if (it === undefined) return this.#returnCodes; else this.#returnCodes = it; }

  static makeFields(returnCodes) {
    const $self = new SubAck();
    SubAck.makeFields$($self,returnCodes);
    return $self;
  }

  static makeFields$($self,returnCodes) {
    ControlPacket.make$($self);
    ;
    $self.#returnCodes = sys.ObjUtil.coerce(((this$) => { let $_u95 = returnCodes; if ($_u95 == null) return null; return sys.ObjUtil.toImmutable(returnCodes); })($self), sys.Type.find("mqtt::ReasonCode[]"));
    $self.checkFields();
    return;
  }

  static decode(in$,version) {
    const $self = new SubAck();
    SubAck.decode$($self,in$,version);
    return $self;
  }

  static decode$($self,in$,version) {
    ControlPacket.make$($self);
    ;
    $self.packetId().val(DataCodec.readByte2(in$));
    if (version.is5()) {
      $self.#props = DataCodec.readProps(in$);
    }
    ;
    let acc = sys.List.make(ReasonCode.type$);
    while (sys.ObjUtil.compareGT(in$.avail(), 0)) {
      acc.add(sys.ObjUtil.coerce(ReasonCode.fromCode(DataCodec.readByte(in$), $self.#type), ReasonCode.type$));
    }
    ;
    $self.#returnCodes = sys.ObjUtil.coerce(((this$) => { let $_u96 = acc; if ($_u96 == null) return null; return sys.ObjUtil.toImmutable(acc); })($self), sys.Type.find("mqtt::ReasonCode[]"));
    $self.checkFields();
    return;
  }

  checkFields() {
    if (this.#returnCodes.isEmpty()) {
      throw sys.ArgErr.make("There must be at least one return code");
    }
    ;
    return;
  }

  variableHeaderAndPayload(version) {
    const this$ = this;
    let buf = sys.Buf.make(this.#returnCodes.size());
    DataCodec.writeByte2(this.pid(), sys.ObjUtil.coerce(buf, sys.Obj.type$));
    if (version.is5()) {
      DataCodec.writeProps(this.#props, sys.ObjUtil.coerce(buf, sys.Obj.type$));
    }
    ;
    this.#returnCodes.each((reason) => {
      DataCodec.writeByte(reason.code(), sys.ObjUtil.coerce(buf, sys.Obj.type$));
      return;
    });
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("SubAck(id=", sys.ObjUtil.coerce(this.pid(), sys.Obj.type$.toNullable())), ")");
  }

}

class Connect extends ControlPacket {
  constructor() {
    super();
    const this$ = this;
    this.#type = PacketType.connect();
    this.#willPublish = null;
    this.#username = null;
    this.#password = null;
    this.#props = Properties.make();
    return;
  }

  typeof() { return Connect.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #version = null;

  version() { return this.#version; }

  __version(it) { if (it === undefined) return this.#version; else this.#version = it; }

  #cleanSession = false;

  cleanSession() { return this.#cleanSession; }

  __cleanSession(it) { if (it === undefined) return this.#cleanSession; else this.#cleanSession = it; }

  #keepAlive = null;

  keepAlive() { return this.#keepAlive; }

  __keepAlive(it) { if (it === undefined) return this.#keepAlive; else this.#keepAlive = it; }

  #clientId = null;

  clientId() { return this.#clientId; }

  __clientId(it) { if (it === undefined) return this.#clientId; else this.#clientId = it; }

  #willPublish = null;

  willPublish() { return this.#willPublish; }

  __willPublish(it) { if (it === undefined) return this.#willPublish; else this.#willPublish = it; }

  #username = null;

  username() { return this.#username; }

  __username(it) { if (it === undefined) return this.#username; else this.#username = it; }

  #password = null;

  password() { return this.#password; }

  __password(it) { if (it === undefined) return this.#password; else this.#password = it; }

  #props = null;

  props() { return this.#props; }

  __props(it) { if (it === undefined) return this.#props; else this.#props = it; }

  static make(f) {
    const $self = new Connect();
    Connect.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ControlPacket.make$($self);
    ;
    sys.Func.call(f, $self);
    return;
  }

  variableHeaderAndPayload(version) {
    let buf = sys.Buf.make(128);
    this.variableHeader(sys.ObjUtil.coerce(buf, sys.Buf.type$), version);
    this.payload(sys.ObjUtil.coerce(buf, sys.Buf.type$), version);
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$);
  }

  variableHeader(buf,version) {
    DataCodec.writeUtf8("MQTT", buf);
    DataCodec.writeByte(version.code(), buf);
    DataCodec.writeByte(this.flags(), buf);
    DataCodec.writeByte2(this.#keepAlive.toSec(), buf);
    if (version.is5()) {
      DataCodec.writeProps(this.#props, buf);
    }
    ;
    return;
  }

  payload(buf,version) {
    DataCodec.writeUtf8(this.#clientId, buf);
    if (this.hasWill()) {
      if (version.is5()) {
        DataCodec.writeProps(this.#willPublish.msg().props(), buf);
      }
      ;
      DataCodec.writeUtf8(this.#willPublish.topicName(), buf);
      DataCodec.writeBin(this.#willPublish.msg().payload(), buf);
    }
    ;
    if (this.#username != null) {
      DataCodec.writeUtf8(this.#username, buf);
    }
    ;
    if (this.#password != null) {
      DataCodec.writeBin(this.#password, buf);
    }
    ;
    return;
  }

  validate() {
    if (this.#version.is311()) {
      if ((sys.Str.isEmpty(this.#clientId) && !this.#cleanSession)) {
        throw MqttErr.make(sys.Str.plus(sys.Str.plus("ClientId is zero bytes, but clean session not requested [MQTT-3.1.3-7] (", this.#version), ")"));
      }
      ;
      if ((this.#username == null && this.#password != null)) {
        throw MqttErr.make(sys.Str.plus(sys.Str.plus("Cannot set a password without a username [MQTT-3.1.2-22] (", this.#version), ")"));
      }
      ;
    }
    ;
    return this;
  }

  hasWill() {
    return this.#willPublish != null;
  }

  flags() {
    let flags = 0;
    if (this.#username != null) {
      (flags = sys.Int.or(flags, 128));
    }
    ;
    if (this.#password != null) {
      (flags = sys.Int.or(flags, 64));
    }
    ;
    if (this.hasWill()) {
      if (this.#willPublish.retain()) {
        (flags = sys.Int.or(flags, 32));
      }
      ;
      (flags = sys.Int.or(flags, sys.Int.shiftl(this.#willPublish.qos().ordinal(), 3)));
      (flags = sys.Int.or(flags, 4));
    }
    ;
    if (this.#cleanSession) {
      (flags = sys.Int.or(flags, 2));
    }
    ;
    return flags;
  }

}

class ConnAck extends ControlPacket {
  constructor() {
    super();
    const this$ = this;
    this.#type = PacketType.connack();
    this.#props = Properties.make();
    return;
  }

  typeof() { return ConnAck.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #isSessionPresent = false;

  isSessionPresent() { return this.#isSessionPresent; }

  __isSessionPresent(it) { if (it === undefined) return this.#isSessionPresent; else this.#isSessionPresent = it; }

  #reason = null;

  reason() { return this.#reason; }

  __reason(it) { if (it === undefined) return this.#reason; else this.#reason = it; }

  #props = null;

  props() { return this.#props; }

  __props(it) { if (it === undefined) return this.#props; else this.#props = it; }

  static make(f) {
    const $self = new ConnAck();
    ConnAck.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ControlPacket.make$($self);
    ;
    sys.Func.call(f, $self);
    return;
  }

  static decode(in$,version) {
    const $self = new ConnAck();
    ConnAck.decode$($self,in$,version);
    return $self;
  }

  static decode$($self,in$,version) {
    ControlPacket.make$($self);
    ;
    let ackFlags = DataCodec.readByte(in$);
    $self.#isSessionPresent = sys.ObjUtil.compareNE(sys.Int.and(ackFlags, 1), 0);
    if (sys.ObjUtil.compareNE(sys.Int.and(ackFlags, 254), 0)) {
      throw MqttErr.make(sys.Str.plus("Invalid ack flags: ", sys.Int.toRadix(ackFlags, 2, sys.ObjUtil.coerce(8, sys.Int.type$.toNullable()))));
    }
    ;
    $self.#reason = sys.ObjUtil.coerce(ReasonCode.fromCode(DataCodec.readByte(in$), $self.#type), ReasonCode.type$);
    if (version.is5()) {
      $self.#props = DataCodec.readProps(in$);
    }
    ;
    return;
  }

  variableHeaderAndPayload(version) {
    let buf = sys.Buf.make(16);
    let flags = 0;
    if (this.#isSessionPresent) {
      (flags = sys.Int.or(flags, 1));
    }
    ;
    DataCodec.writeByte(flags, sys.ObjUtil.coerce(buf, sys.Obj.type$));
    DataCodec.writeByte(this.#reason.code(), sys.ObjUtil.coerce(buf, sys.Obj.type$));
    if (version.is5()) {
      DataCodec.writeProps(this.#props, sys.ObjUtil.coerce(buf, sys.Obj.type$));
    }
    ;
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$);
  }

  isSuccess() {
    return this.#reason === ReasonCode.success();
  }

}

class Disconnect extends ControlPacket {
  constructor() {
    super();
    const this$ = this;
    this.#type = PacketType.disconnect();
    this.#reason = ReasonCode.normal_disconnection();
    this.#props = Properties.make();
    return;
  }

  typeof() { return Disconnect.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #reason = null;

  reason() { return this.#reason; }

  __reason(it) { if (it === undefined) return this.#reason; else this.#reason = it; }

  #props = null;

  props() { return this.#props; }

  __props(it) { if (it === undefined) return this.#props; else this.#props = it; }

  static make(f) {
    const $self = new Disconnect();
    Disconnect.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    ControlPacket.make$($self);
    ;
    ((this$) => { let $_u97 = f; if ($_u97 == null) return null; return sys.Func.call(f, this$); })($self);
    return;
  }

  static makeFields(reason,props) {
    const $self = new Disconnect();
    Disconnect.makeFields$($self,reason,props);
    return $self;
  }

  static makeFields$($self,reason,props) {
    if (props === undefined) props = Properties.make();
    ControlPacket.make$($self);
    ;
    $self.#reason = reason;
    $self.#props = props;
    return;
  }

  static decode(in$,version) {
    const $self = new Disconnect();
    Disconnect.decode$($self,in$,version);
    return $self;
  }

  static decode$($self,in$,version) {
    ControlPacket.make$($self);
    ;
    if (version.is311()) {
      return;
    }
    ;
    throw sys.UnsupportedErr.make(sys.Str.plus("TODO: ", version));
  }

  variableHeaderAndPayload(version) {
    if (version.is311()) {
      return ControlPacket.empty();
    }
    ;
    let buf = sys.Buf.make(32);
    DataCodec.writeByte(this.#reason.code(), sys.ObjUtil.coerce(buf, sys.Obj.type$));
    DataCodec.writeProps(this.#props, sys.ObjUtil.coerce(buf, sys.Obj.type$));
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$);
  }

}

class PacketType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PacketType.type$; }

  static reserved() { return PacketType.vals().get(0); }

  static connect() { return PacketType.vals().get(1); }

  static connack() { return PacketType.vals().get(2); }

  static publish() { return PacketType.vals().get(3); }

  static puback() { return PacketType.vals().get(4); }

  static pubrec() { return PacketType.vals().get(5); }

  static pubrel() { return PacketType.vals().get(6); }

  static pubcomp() { return PacketType.vals().get(7); }

  static subscribe() { return PacketType.vals().get(8); }

  static suback() { return PacketType.vals().get(9); }

  static unsubscribe() { return PacketType.vals().get(10); }

  static unsuback() { return PacketType.vals().get(11); }

  static pingreq() { return PacketType.vals().get(12); }

  static pingresp() { return PacketType.vals().get(13); }

  static disconnect() { return PacketType.vals().get(14); }

  static auth() { return PacketType.vals().get(15); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new PacketType();
    PacketType.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(PacketType.type$, PacketType.vals(), name$, checked);
  }

  static vals() {
    if (PacketType.#vals == null) {
      PacketType.#vals = sys.List.make(PacketType.type$, [
        PacketType.make(0, "reserved", ),
        PacketType.make(1, "connect", ),
        PacketType.make(2, "connack", ),
        PacketType.make(3, "publish", ),
        PacketType.make(4, "puback", ),
        PacketType.make(5, "pubrec", ),
        PacketType.make(6, "pubrel", ),
        PacketType.make(7, "pubcomp", ),
        PacketType.make(8, "subscribe", ),
        PacketType.make(9, "suback", ),
        PacketType.make(10, "unsubscribe", ),
        PacketType.make(11, "unsuback", ),
        PacketType.make(12, "pingreq", ),
        PacketType.make(13, "pingresp", ),
        PacketType.make(14, "disconnect", ),
        PacketType.make(15, "auth", ),
      ]).toImmutable();
    }
    return PacketType.#vals;
  }

  static static$init() {
    const $_u98 = PacketType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class Properties extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#props = concurrent.ConcurrentMap.make(8);
    return;
  }

  typeof() { return Properties.type$; }

  #props = null;

  // private field reflection only
  __props(it) { if (it === undefined) return this.#props; else this.#props = it; }

  static make() {
    const $self = new Properties();
    Properties.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  add(prop,val) {
    if (val == null) {
      this.#props.remove(prop);
      return this;
    }
    ;
    this.checkType(prop, sys.ObjUtil.coerce(val, sys.Obj.type$));
    this.checkRange(prop, sys.ObjUtil.coerce(val, sys.Obj.type$));
    if (prop === Property.userProperty()) {
      let arr = sys.ObjUtil.coerce(this.#props.get(prop), sys.Type.find("mqtt::StrPair[]?"));
      if (arr == null) {
        (arr = sys.List.make(StrPair.type$));
      }
      ;
      this.#props.set(prop, sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(arr.rw().add(sys.ObjUtil.coerce(val, StrPair.type$))), sys.Type.find("mqtt::StrPair[]")));
    }
    else {
      if (prop === Property.subscriptionId()) {
        let arr = sys.ObjUtil.coerce(this.#props.get(prop), sys.Type.find("sys::Int[]?"));
        if (arr == null) {
          (arr = sys.List.make(sys.Int.type$));
        }
        ;
        this.#props.set(prop, sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(arr.rw().add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, sys.Int.type$), sys.Obj.type$.toNullable()))), sys.Type.find("sys::Int[]")));
      }
      else {
        this.#props.set(prop, sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(val), sys.Obj.type$.toNullable()), sys.Obj.type$));
      }
      ;
    }
    ;
    return this;
  }

  isEmpty() {
    return this.#props.isEmpty();
  }

  get(prop,def) {
    if (def === undefined) def = null;
    return ((this$) => { let $_u99 = this$.#props.get(prop); if ($_u99 != null) return $_u99; return def; })(this);
  }

  clear() {
    this.#props.clear();
    return this;
  }

  each(f) {
    const this$ = this;
    this.#props.keys(Property.type$).sort().each((prop) => {
      let val = this$.#props.get(prop);
      if (!sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
        sys.Func.call(f, sys.ObjUtil.coerce(val, sys.Obj.type$), sys.ObjUtil.coerce(prop, Property.type$));
      }
      else {
        sys.ObjUtil.as(val, sys.Type.find("sys::List")).each((item) => {
          sys.Func.call(f, sys.ObjUtil.coerce(item, sys.Obj.type$), sys.ObjUtil.coerce(prop, Property.type$));
          return;
        });
      }
      ;
      return;
    });
    return;
  }

  toStr() {
    const this$ = this;
    if (this.isEmpty()) {
      return "[]";
    }
    ;
    let buf = sys.StrBuf.make().add("[\n");
    this.each((val,prop) => {
      buf.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", prop), " = "), val), "\n"));
      return;
    });
    return buf.add("]").toStr();
  }

  maxPacketSize() {
    return sys.ObjUtil.coerce(this.get(Property.maxPacketSize(), sys.ObjUtil.coerce(sys.Int.maxVal(), sys.Obj.type$.toNullable())), sys.Int.type$);
  }

  messageExpiryInterval() {
    let secs = this.get(Property.messageExpiryInterval());
    if (secs == null) {
      return null;
    }
    ;
    return sys.Duration.fromStr(sys.Str.plus(sys.Str.plus("", secs), "sec"));
  }

  maxQoS() {
    return QoS.vals().get(sys.ObjUtil.coerce(this.get(Property.maxQoS(), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())), sys.Int.type$));
  }

  reasonStr() {
    return sys.ObjUtil.coerce(this.get(Property.reasonStr()), sys.Str.type$.toNullable());
  }

  receiveMax() {
    return sys.ObjUtil.coerce(this.get(Property.receiveMax(), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())), sys.Int.type$);
  }

  retainAvailable() {
    return sys.ObjUtil.equals(this.get(Property.retainAvailable(), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())), 1);
  }

  subscriptionIds() {
    return sys.ObjUtil.coerce(this.get(Property.subscriptionId(), sys.Int.type$.emptyList()), sys.Type.find("sys::Int[]"));
  }

  userProps() {
    return sys.ObjUtil.coerce(this.get(Property.userProperty(), StrPair.type$.emptyList()), sys.Type.find("mqtt::StrPair[]"));
  }

  utf8Payload() {
    return sys.ObjUtil.equals(this.get(Property.payloadFormatIndicator(), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())), 1);
  }

  wildcardSubscriptionAvailable() {
    return sys.ObjUtil.equals(this.get(Property.wildcardSubscriptionAvailable(), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())), 1);
  }

  checkType(prop,val) {
    let ok = true;
    let $_u100 = prop.type();
    if (sys.ObjUtil.equals($_u100, DataType.byte()) || sys.ObjUtil.equals($_u100, DataType.byte2()) || sys.ObjUtil.equals($_u100, DataType.byte4()) || sys.ObjUtil.equals($_u100, DataType.vbi())) {
      (ok = sys.ObjUtil.is(val, sys.Int.type$));
    }
    else if (sys.ObjUtil.equals($_u100, DataType.utf8())) {
      (ok = sys.ObjUtil.is(val, sys.Str.type$));
    }
    else if (sys.ObjUtil.equals($_u100, DataType.binary())) {
      (ok = sys.ObjUtil.is(val, sys.Buf.type$));
    }
    else if (sys.ObjUtil.equals($_u100, DataType.strPair())) {
      (ok = sys.ObjUtil.is(val, StrPair.type$));
    }
    else {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unexpected property: ", prop), " ["), prop.type()), "]"));
    }
    ;
    if (!ok) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", prop), " must be "), prop.type()), ": "), val), " ("), sys.ObjUtil.typeof(val)), ")"));
    }
    ;
    return;
  }

  checkRange(prop,val) {
    let ok = true;
    let $_u101 = prop.type();
    if (sys.ObjUtil.equals($_u101, DataType.byte())) {
      (ok = (sys.ObjUtil.compareLE(0, val) && sys.ObjUtil.compareLE(val, 255)));
    }
    else if (sys.ObjUtil.equals($_u101, DataType.byte2())) {
      (ok = (sys.ObjUtil.compareLE(0, val) && sys.ObjUtil.compareLE(val, 65535)));
    }
    else if (sys.ObjUtil.equals($_u101, DataType.byte4())) {
      (ok = (sys.ObjUtil.compareLE(0, val) && sys.ObjUtil.compareLE(val, 4294967295)));
    }
    ;
    let $_u102 = prop;
    if (sys.ObjUtil.equals($_u102, Property.maxPacketSize()) || sys.ObjUtil.equals($_u102, Property.receiveMax()) || sys.ObjUtil.equals($_u102, Property.topicAlias())) {
      (ok = sys.ObjUtil.compareNE(val, 0));
    }
    else if (sys.ObjUtil.equals($_u102, Property.maxQoS()) || sys.ObjUtil.equals($_u102, Property.payloadFormatIndicator()) || sys.ObjUtil.equals($_u102, Property.requestResponseInfo()) || sys.ObjUtil.equals($_u102, Property.sharedSubscriptionAvailable()) || sys.ObjUtil.equals($_u102, Property.subscriptionIdsAvailable()) || sys.ObjUtil.equals($_u102, Property.wildcardSubscriptionAvailable())) {
      (ok = (sys.ObjUtil.equals(val, 0) || sys.ObjUtil.equals(val, 1)));
    }
    else if (sys.ObjUtil.equals($_u102, Property.subscriptionId())) {
      (ok = (sys.ObjUtil.compareLE(MqttConst.minSubId(), val) && sys.ObjUtil.compareLE(val, MqttConst.maxSubId())));
    }
    ;
    if (!ok) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Value out-of-range for ", prop), ": "), val));
    }
    ;
    return;
  }

}

class Property extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Property.type$; }

  static payloadFormatIndicator() { return Property.vals().get(0); }

  static messageExpiryInterval() { return Property.vals().get(1); }

  static contentType() { return Property.vals().get(2); }

  static responseTopic() { return Property.vals().get(3); }

  static correlationData() { return Property.vals().get(4); }

  static subscriptionId() { return Property.vals().get(5); }

  static sessionExpiryInterval() { return Property.vals().get(6); }

  static assignedClientId() { return Property.vals().get(7); }

  static serverKeepAlive() { return Property.vals().get(8); }

  static authMethod() { return Property.vals().get(9); }

  static authData() { return Property.vals().get(10); }

  static requestProblemInfo() { return Property.vals().get(11); }

  static willDelayInterval() { return Property.vals().get(12); }

  static requestResponseInfo() { return Property.vals().get(13); }

  static responseInfo() { return Property.vals().get(14); }

  static serverRef() { return Property.vals().get(15); }

  static reasonStr() { return Property.vals().get(16); }

  static receiveMax() { return Property.vals().get(17); }

  static topicAliasMax() { return Property.vals().get(18); }

  static topicAlias() { return Property.vals().get(19); }

  static maxQoS() { return Property.vals().get(20); }

  static retainAvailable() { return Property.vals().get(21); }

  static userProperty() { return Property.vals().get(22); }

  static maxPacketSize() { return Property.vals().get(23); }

  static wildcardSubscriptionAvailable() { return Property.vals().get(24); }

  static subscriptionIdsAvailable() { return Property.vals().get(25); }

  static sharedSubscriptionAvailable() { return Property.vals().get(26); }

  static #vals = undefined;

  #id = 0;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  static make($ordinal,$name,id,type) {
    const $self = new Property();
    Property.make$($self,$ordinal,$name,id,type);
    return $self;
  }

  static make$($self,$ordinal,$name,id,type) {
    sys.Enum.make$($self, $ordinal, $name);
    $self.#id = id;
    $self.#type = type;
    return;
  }

  static fromId(id) {
    const this$ = this;
    return sys.ObjUtil.coerce(Property.vals().find((it) => {
      return sys.ObjUtil.equals(it.#id, id);
    }), Property.type$);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Property(name: ", this.name()), ", id: 0x"), sys.Int.toRadix(this.#id, 16, sys.ObjUtil.coerce(2, sys.Int.type$.toNullable()))), ", type: "), this.#type), ")");
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(Property.type$, Property.vals(), name$, checked);
  }

  static vals() {
    if (Property.#vals == null) {
      Property.#vals = sys.List.make(Property.type$, [
        Property.make(0, "payloadFormatIndicator", 1, byte),
        Property.make(1, "messageExpiryInterval", 2, byte4),
        Property.make(2, "contentType", 3, utf8),
        Property.make(3, "responseTopic", 8, utf8),
        Property.make(4, "correlationData", 9, binary),
        Property.make(5, "subscriptionId", 11, vbi),
        Property.make(6, "sessionExpiryInterval", 17, byte4),
        Property.make(7, "assignedClientId", 18, utf8),
        Property.make(8, "serverKeepAlive", 19, byte2),
        Property.make(9, "authMethod", 21, utf8),
        Property.make(10, "authData", 22, binary),
        Property.make(11, "requestProblemInfo", 23, byte),
        Property.make(12, "willDelayInterval", 24, byte4),
        Property.make(13, "requestResponseInfo", 25, byte),
        Property.make(14, "responseInfo", 26, utf8),
        Property.make(15, "serverRef", 28, utf8),
        Property.make(16, "reasonStr", 31, utf8),
        Property.make(17, "receiveMax", 33, byte2),
        Property.make(18, "topicAliasMax", 34, byte2),
        Property.make(19, "topicAlias", 35, byte2),
        Property.make(20, "maxQoS", 36, byte),
        Property.make(21, "retainAvailable", 37, byte),
        Property.make(22, "userProperty", 38, strPair),
        Property.make(23, "maxPacketSize", 39, byte4),
        Property.make(24, "wildcardSubscriptionAvailable", 40, byte),
        Property.make(25, "subscriptionIdsAvailable", 41, byte),
        Property.make(26, "sharedSubscriptionAvailable", 42, byte),
      ]).toImmutable();
    }
    return Property.#vals;
  }

  static static$init() {
    const $_u103 = Property.vals();
    if (true) {
    }
    ;
    return;
  }

}

class StrPair extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StrPair.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make(name,val) {
    const $self = new StrPair();
    StrPair.make$($self,name,val);
    return $self;
  }

  static make$($self,name,val) {
    $self.#name = name;
    $self.#val = val;
    return;
  }

  hash() {
    return sys.Str.hash(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#name), ""), this.#val));
  }

  equals(obj) {
    if (this === obj) {
      return true;
    }
    ;
    let that = sys.ObjUtil.as(obj, StrPair.type$);
    if (that == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#name, that.#name) && sys.ObjUtil.equals(this.#val, that.#val));
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#name), "="), this.#val);
  }

}

class PropertiesTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PropertiesTest.type$; }

  test() {
    this.verify(Properties.make().isEmpty());
    let props = this.makeTestProps();
    this.verifyEq(props.get(Property.userProperty()), sys.List.make(StrPair.type$, [StrPair.make("foo", "bar"), StrPair.make("baz", "qaz")]));
    return;
  }

  makeTestProps() {
    let props = Properties.make();
    props.add(Property.userProperty(), StrPair.make("foo", "bar"));
    props.add(Property.userProperty(), StrPair.make("baz", "qaz"));
    return props;
  }

  static make() {
    const $self = new PropertiesTest();
    PropertiesTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class TopicTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TopicTest.type$; }

  testNames() {
    const this$ = this;
    sys.List.make(sys.Str.type$, ["/", "\$SYS", "/foo", "/foo/"]).each((name) => {
      Topic.validateName(name);
      this$.verify(true);
      return;
    });
    sys.List.make(sys.Str.type$, ["+", "#", "/foo/+", "/foo/#"]).each((name) => {
      this$.verifyErr(MqttErr.type$, (it) => {
        Topic.validateName(name);
        return;
      });
      return;
    });
    return;
  }

  testFilters() {
    const this$ = this;
    sys.List.make(sys.Str.type$, ["#", "sport/tennis/player1/#", "sport/#", "+", "+/tennis/#", "sport/+/player1", "+/+", "/+"]).each((filter) => {
      Topic.validateFilter(filter);
      this$.verify(true);
      return;
    });
    sys.List.make(sys.Str.type$, ["sport/tennis#", "sport/tennis/#/ranking", "sport+", "+sport", "sp+ort", "s+/", "/+sport"]).each((filter) => {
      this$.verifyErr(MqttErr.type$, (it) => {
        Topic.validateFilter(filter);
        return;
      });
      return;
    });
    return;
  }

  testMatch() {
    this.verify(Topic.matches("/", "/"));
    this.verify(Topic.matches("/a", "/a"));
    this.verify(Topic.matches("a/b", "a/b"));
    this.verify(Topic.matches("sport/tennis/player1", "sport/tennis/player1/#"));
    this.verify(Topic.matches("sport/tennis/player1/ranking", "sport/tennis/player1/#"));
    this.verify(Topic.matches("sport/tennis/player1/score/wimbledon", "sport/tennis/player1/#"));
    this.verify(Topic.matches("sport", "sport/#"));
    this.verify(Topic.matches("/", "#"));
    this.verify(Topic.matches("foo", "#"));
    this.verify(Topic.matches("sport/tennis/player1", "sport/tennis/+"));
    this.verify(Topic.matches("sport/", "sport/+"));
    this.verifyFalse(Topic.matches("/a", "a"));
    this.verifyFalse(Topic.matches("a/", "a"));
    this.verifyFalse(Topic.matches("sport/tennis/player1/ranking", "sport/tennis/+"));
    this.verifyFalse(Topic.matches("sport", "sport/+"));
    this.verifyFalse(Topic.matches("/test1/foo", "/test2/#"));
    this.verifyFalse(Topic.matches("/test1", "/test2"));
    return;
  }

  static make() {
    const $self = new TopicTest();
    TopicTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class DataCodecTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DataCodecTest.type$; }

  testUtf8() {
    let buf = sys.Buf.make();
    DataCodec.writeUtf8("", sys.ObjUtil.coerce(buf, sys.Obj.type$));
    this.verifyEq("", DataCodec.readUtf8(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$)));
    DataCodec.writeUtf8("mqtt", sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Obj.type$));
    this.verifyEq("mqtt", DataCodec.readUtf8(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$)));
    DataCodec.writeUtf8("\u1f10\u03bd \u1f00\u03c1\u03c7\u1fc7 \u1f26\u03bd \u1f41 \u03bb\u03cc\u03b3\u03bf\u03c2", sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Obj.type$));
    this.verifyEq("\u1f10\u03bd \u1f00\u03c1\u03c7\u1fc7 \u1f26\u03bd \u1f41 \u03bb\u03cc\u03b3\u03bf\u03c2", DataCodec.readUtf8(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$)));
    return;
  }

  testVariableByteInteger() {
    let buf = sys.Buf.make();
    DataCodec.writeVbi(0, sys.ObjUtil.coerce(buf, sys.Obj.type$));
    this.verifyEq(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(DataCodec.readVbi(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$)), sys.Obj.type$.toNullable()));
    DataCodec.writeVbi(127, sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Obj.type$));
    this.verifyEq(sys.ObjUtil.coerce(127, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(DataCodec.readVbi(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$)), sys.Obj.type$.toNullable()));
    DataCodec.writeVbi(128, sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Obj.type$));
    this.verifyEq(sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(DataCodec.readVbi(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$)), sys.Obj.type$.toNullable()));
    DataCodec.writeVbi(16383, sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Obj.type$));
    this.verifyEq(sys.ObjUtil.coerce(16383, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(DataCodec.readVbi(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$)), sys.Obj.type$.toNullable()));
    DataCodec.writeVbi(16384, sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Obj.type$));
    this.verifyEq(sys.ObjUtil.coerce(16384, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(DataCodec.readVbi(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$)), sys.Obj.type$.toNullable()));
    DataCodec.writeVbi(2097151, sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Obj.type$));
    this.verifyEq(sys.ObjUtil.coerce(2097151, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(DataCodec.readVbi(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$)), sys.Obj.type$.toNullable()));
    DataCodec.writeVbi(2097152, sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Obj.type$));
    this.verifyEq(sys.ObjUtil.coerce(2097152, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(DataCodec.readVbi(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$)), sys.Obj.type$.toNullable()));
    DataCodec.writeVbi(268435455, sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Obj.type$));
    this.verifyEq(sys.ObjUtil.coerce(268435455, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(DataCodec.readVbi(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$)), sys.Obj.type$.toNullable()));
    return;
  }

  testBinary() {
    let buf = sys.Buf.make();
    DataCodec.writeBin(sys.Buf.make(), sys.ObjUtil.coerce(buf, sys.Obj.type$));
    this.verifyEq(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(DataCodec.readBin(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$)).size(), sys.Obj.type$.toNullable()));
    DataCodec.writeBin(sys.Str.toBuf("mqtt"), sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Obj.type$));
    this.verifyEq("mqtt", DataCodec.readBin(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$)).readAllStr());
    return;
  }

  testStrPair() {
    let buf = sys.Buf.make();
    DataCodec.writeStrPair(StrPair.make("foo", "bar"), sys.ObjUtil.coerce(buf, sys.Obj.type$));
    this.verifyEq(StrPair.make("foo", "bar"), DataCodec.readStrPair(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$)));
    return;
  }

  testProperties() {
    let buf = sys.Buf.make();
    DataCodec.writeProps(Properties.make(), sys.ObjUtil.coerce(buf, sys.Obj.type$));
    this.verify(DataCodec.readProps(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$)).isEmpty());
    let props = Properties.make();
    props.add(Property.payloadFormatIndicator(), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    props.add(Property.receiveMax(), sys.ObjUtil.coerce(1024, sys.Obj.type$.toNullable()));
    props.add(Property.maxPacketSize(), sys.ObjUtil.coerce(1073741824, sys.Obj.type$.toNullable()));
    props.add(Property.contentType(), "text/plain");
    props.add(Property.authData(), sys.Str.toBuf("password"));
    props.add(Property.userProperty(), StrPair.make("a", "A"));
    props.add(Property.userProperty(), StrPair.make("b", "B"));
    DataCodec.writeProps(props, sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Obj.type$));
    let decoded = DataCodec.readProps(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Obj.type$));
    this.verifyEq(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), decoded.get(Property.payloadFormatIndicator()));
    this.verifyEq(sys.ObjUtil.coerce(1024, sys.Obj.type$.toNullable()), decoded.get(Property.receiveMax()));
    this.verifyEq(sys.ObjUtil.coerce(1073741824, sys.Obj.type$.toNullable()), decoded.get(Property.maxPacketSize()));
    this.verifyEq("text/plain", decoded.get(Property.contentType()));
    this.verifyEq(sys.Str.toBuf("password").toHex(), sys.ObjUtil.trap(decoded.get(Property.authData()),"toHex", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(sys.List.make(StrPair.type$, [StrPair.make("a", "A"), StrPair.make("b", "B")]), decoded.get(Property.userProperty()));
    return;
  }

  static make() {
    const $self = new DataCodecTest();
    DataCodecTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

const p = sys.Pod.add$('mqtt');
const xp = sys.Param.noParams$();
let m;
PersistablePacket.type$ = p.am$('PersistablePacket','sys::Obj',[],{},8449,PersistablePacket);
MqttVersion.type$ = p.at$('MqttVersion','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,MqttVersion);
MqttErr.type$ = p.at$('MqttErr','sys::Err',[],{},8194,MqttErr);
MalformedPacketErr.type$ = p.at$('MalformedPacketErr','mqtt::MqttErr',[],{},8194,MalformedPacketErr);
MqttConst.type$ = p.am$('MqttConst','sys::Obj',[],{},8449,MqttConst);
PendingAck.type$ = p.at$('PendingAck','sys::Obj',[],{},130,PendingAck);
PendingConn.type$ = p.at$('PendingConn','mqtt::PendingAck',[],{},130,PendingConn);
Topic.type$ = p.at$('Topic','sys::Obj',[],{},8194,Topic);
DataCodec.type$ = p.am$('DataCodec','sys::Obj',[],{},8449,DataCodec);
DataType.type$ = p.at$('DataType','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,DataType);
ClientId.type$ = p.am$('ClientId','sys::Obj',[],{},8451,ClientId);
PubSend.type$ = p.at$('PubSend','sys::Obj',[],{},8224,PubSend);
MqttTransport.type$ = p.am$('MqttTransport','sys::Obj',[],{},385,MqttTransport);
TcpTransport.type$ = p.at$('TcpTransport','sys::Obj',['mqtt::MqttTransport'],{},128,TcpTransport);
WsTransport.type$ = p.at$('WsTransport','sys::Obj',['mqtt::MqttTransport'],{},128,WsTransport);
WsInStream.type$ = p.at$('WsInStream','sys::InStream',[],{},128,WsInStream);
Message.type$ = p.at$('Message','sys::Obj',[],{},8194,Message);
ClientListener.type$ = p.am$('ClientListener','sys::Obj',[],{},8449,ClientListener);
ClientListeners.type$ = p.at$('ClientListeners','concurrent::Actor',[],{},130,ClientListeners);
ClientConfig.type$ = p.at$('ClientConfig','sys::Obj',[],{},8194,ClientConfig);
ClientAutoReconnect.type$ = p.am$('ClientAutoReconnect','sys::Obj',['mqtt::ClientListener'],{},8449,ClientAutoReconnect);
DefaultAutoReconnect.type$ = p.at$('DefaultAutoReconnect','concurrent::Actor',['mqtt::ClientAutoReconnect'],{},130,DefaultAutoReconnect);
MqttClient.type$ = p.at$('MqttClient','concurrent::Actor',['mqtt::MqttConst'],{},8194,MqttClient);
ClientState.type$ = p.at$('ClientState','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,ClientState);
ConnectConfig.type$ = p.at$('ConnectConfig','sys::Obj',[],{},8194,ConnectConfig);
SubSend.type$ = p.at$('SubSend','sys::Obj',[],{},8224,SubSend);
RetainHandling.type$ = p.at$('RetainHandling','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,RetainHandling);
SubscriptionListener.type$ = p.am$('SubscriptionListener','sys::Obj',[],{},8449,SubscriptionListener);
CallbackListener.type$ = p.at$('CallbackListener','sys::Obj',['mqtt::SubscriptionListener'],{},128,CallbackListener);
PacketReaderActor.type$ = p.at$('PacketReaderActor','concurrent::Actor',['mqtt::DataCodec'],{},130,PacketReaderActor);
PacketWriterActor.type$ = p.at$('PacketWriterActor','sys::Obj',['mqtt::DataCodec'],{},130,PacketWriterActor);
ClientHandler.type$ = p.at$('ClientHandler','sys::Obj',[],{},129,ClientHandler);
ClientConnAckHandler.type$ = p.at$('ClientConnAckHandler','mqtt::ClientHandler',[],{},128,ClientConnAckHandler);
ClientConnectHandler.type$ = p.at$('ClientConnectHandler','mqtt::ClientHandler',[],{},128,ClientConnectHandler);
ClientPublishHandler.type$ = p.at$('ClientPublishHandler','mqtt::ClientHandler',[],{},128,ClientPublishHandler);
ClientSubMgr.type$ = p.at$('ClientSubMgr','mqtt::ClientHandler',[],{},128,ClientSubMgr);
ClientPersistence.type$ = p.am$('ClientPersistence','sys::Obj',[],{},8451,ClientPersistence);
ClientMemDb.type$ = p.at$('ClientMemDb','sys::Obj',['mqtt::ClientPersistence'],{},8194,ClientMemDb);
ClientMemSession.type$ = p.at$('ClientMemSession','sys::Obj',[],{},130,ClientMemSession);
ControlPacket.type$ = p.at$('ControlPacket','sys::Obj',['mqtt::DataCodec'],{},131,ControlPacket);
PersistableControlPacket.type$ = p.at$('PersistableControlPacket','mqtt::ControlPacket',['mqtt::PersistablePacket'],{},131,PersistableControlPacket);
PingReq.type$ = p.at$('PingReq','mqtt::ControlPacket',[],{},130,PingReq);
PingResp.type$ = p.at$('PingResp','mqtt::ControlPacket',[],{},130,PingResp);
ReasonCode.type$ = p.at$('ReasonCode','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,ReasonCode);
Publish.type$ = p.at$('Publish','mqtt::PersistableControlPacket',[],{},130,Publish);
QoS.type$ = p.at$('QoS','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,QoS);
PubFlowPacket.type$ = p.at$('PubFlowPacket','mqtt::PersistableControlPacket',[],{},131,PubFlowPacket);
PubAck.type$ = p.at$('PubAck','mqtt::PubFlowPacket',[],{},130,PubAck);
PubRec.type$ = p.at$('PubRec','mqtt::PubFlowPacket',[],{},130,PubRec);
PubRel.type$ = p.at$('PubRel','mqtt::PubFlowPacket',[],{},130,PubRel);
PubComp.type$ = p.at$('PubComp','mqtt::PubFlowPacket',[],{},130,PubComp);
Unsubscribe.type$ = p.at$('Unsubscribe','mqtt::ControlPacket',[],{},130,Unsubscribe);
UnsubAck.type$ = p.at$('UnsubAck','mqtt::ControlPacket',[],{},130,UnsubAck);
Subscribe.type$ = p.at$('Subscribe','mqtt::ControlPacket',[],{},130,Subscribe);
SubAck.type$ = p.at$('SubAck','mqtt::ControlPacket',[],{},130,SubAck);
Connect.type$ = p.at$('Connect','mqtt::ControlPacket',[],{},130,Connect);
ConnAck.type$ = p.at$('ConnAck','mqtt::ControlPacket',[],{},130,ConnAck);
Disconnect.type$ = p.at$('Disconnect','mqtt::ControlPacket',[],{},130,Disconnect);
PacketType.type$ = p.at$('PacketType','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,PacketType);
Properties.type$ = p.at$('Properties','sys::Obj',[],{},8194,Properties);
Property.type$ = p.at$('Property','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,Property);
StrPair.type$ = p.at$('StrPair','sys::Obj',[],{},8226,StrPair);
PropertiesTest.type$ = p.at$('PropertiesTest','sys::Test',[],{},8192,PropertiesTest);
TopicTest.type$ = p.at$('TopicTest','sys::Test',[],{},8192,TopicTest);
DataCodecTest.type$ = p.at$('DataCodecTest','sys::Test',['mqtt::DataCodec'],{},8192,DataCodecTest);
PersistablePacket.type$.am$('packetVersion',270337,'mqtt::MqttVersion',xp,{}).am$('in',270337,'sys::InStream',xp,{});
MqttVersion.type$.af$('v3_1_1',106506,'mqtt::MqttVersion',{}).af$('v5',106506,'mqtt::MqttVersion',{}).af$('vals',106498,'mqtt::MqttVersion[]',{}).af$('code',73730,'sys::Int',{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('code','sys::Int',false)]),{}).am$('fromCode',40962,'mqtt::MqttVersion?',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Int',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('is311',8192,'sys::Bool',xp,{}).am$('is5',8192,'sys::Bool',xp,{}).am$('fromStr',40966,'mqtt::MqttVersion?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
MqttErr.type$.af$('reason',73730,'mqtt::ReasonCode?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',true),new sys.Param('cause','sys::Err?',true)]),{}).am$('makeReason',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('reason','mqtt::ReasonCode',false),new sys.Param('cause','sys::Err?',true)]),{});
MalformedPacketErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',true),new sys.Param('cause','sys::Err?',true)]),{});
MqttConst.type$.af$('sessionExpiresOnClose',106498,'sys::Duration',{}).af$('sessionNeverExpires',106498,'sys::Duration',{}).af$('minPacketId',106498,'sys::Int',{}).af$('maxPacketId',106498,'sys::Int',{}).af$('minSubId',106498,'sys::Int',{}).af$('maxSubId',106498,'sys::Int',{}).am$('static$init',165890,'sys::Void',xp,{});
PendingAck.type$.af$('packetId',73730,'sys::Int',{}).af$('persistKey',73730,'sys::Str?',{}).af$('created',73730,'sys::Int',{}).af$('lastSent',67586,'concurrent::AtomicInt',{}).af$('resp',73730,'concurrent::Future',{}).af$('stash',73730,'concurrent::ConcurrentMap',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::ControlPacket',false),new sys.Param('persistKey','sys::Str?',true)]),{}).am$('clone',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('source','mqtt::PendingAck',false),new sys.Param('persistKey','sys::Str',false)]),{}).am$('age',8192,'sys::Duration',xp,{}).am$('touch',8192,'sys::This',xp,{}).am$('isComplete',8192,'sys::Bool',xp,{}).am$('isRetryNeeded',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('threshold','sys::Duration',false)]),{}).am$('get',8192,'mqtt::ControlPacket?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('req',8192,'mqtt::ControlPacket?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{});
PendingConn.type$.af$('connect',73730,'mqtt::Connect',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('connect','mqtt::Connect',false)]),{}).am$('connack',8192,'mqtt::ConnAck?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{});
Topic.type$.af$('sep',100354,'sys::Int',{}).af$('multi',100354,'sys::Int',{}).af$('single',100354,'sys::Int',{}).af$('max_len',100354,'sys::Int',{}).am$('validateName',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('validateFilter',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('topic','sys::Str',false)]),{}).am$('validateNameOrFilter',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{}).am$('matches',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('topic','sys::Str',false),new sys.Param('filter','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
DataCodec.type$.af$('uint8_max',100354,'sys::Int',{}).af$('uint16_max',100354,'sys::Int',{}).af$('uint32_max',100354,'sys::Int',{}).af$('vbi_max',100354,'sys::Int',{}).af$('maxStr',100354,'sys::Int',{}).am$('toIn',34818,'sys::InStream',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('toOut',34818,'sys::OutStream',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('writeByte',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Int',false),new sys.Param('out','sys::Obj',false)]),{}).am$('readByte',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::Obj',false)]),{}).am$('writeByte2',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Int',false),new sys.Param('out','sys::Obj',false)]),{}).am$('readByte2',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::Obj',false)]),{}).am$('writeByte4',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Int',false),new sys.Param('out','sys::Obj',false)]),{}).am$('readByte4',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::Obj',false)]),{}).am$('writeVbi',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Int',false),new sys.Param('obj','sys::Obj',false)]),{}).am$('readVbi',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('checkRange',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('min','sys::Int',false),new sys.Param('val','sys::Int',false),new sys.Param('max','sys::Int',false)]),{}).am$('writeUtf8',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str?',false),new sys.Param('obj','sys::Obj',false)]),{}).am$('readUtf8',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('writeBin',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Buf?',false),new sys.Param('out','sys::Obj',false)]),{}).am$('readBin',40962,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::Obj',false)]),{}).am$('writeStrPair',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pair','mqtt::StrPair',false),new sys.Param('out','sys::Obj',false)]),{}).am$('readStrPair',40962,'mqtt::StrPair',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::Obj',false)]),{}).am$('writeProps',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('props','mqtt::Properties?',false),new sys.Param('out','sys::Obj',false)]),{}).am$('readProps',40962,'mqtt::Properties',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::Obj',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DataType.type$.af$('byte',106506,'mqtt::DataType',{}).af$('byte2',106506,'mqtt::DataType',{}).af$('byte4',106506,'mqtt::DataType',{}).af$('utf8',106506,'mqtt::DataType',{}).af$('vbi',106506,'mqtt::DataType',{}).af$('binary',106506,'mqtt::DataType',{}).af$('strPair',106506,'mqtt::DataType',{}).af$('vals',106498,'mqtt::DataType[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'mqtt::DataType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ClientId.type$.af$('max_safe_len',100354,'sys::Int',{}).af$('safe_chars',100354,'sys::Str',{}).am$('gen',40962,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
PubSend.type$.af$('client',67586,'mqtt::MqttClient',{}).af$('_topic',67584,'sys::Str?',{}).af$('fields',67584,'[sys::Field:sys::Obj?]',{}).af$('userProps',67584,'mqtt::StrPair[]',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('client','mqtt::MqttClient',false)]),{}).am$('topic',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('topic','sys::Str',false)]),{}).am$('payload',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('payload','sys::Buf',false)]),{}).am$('qos0',8192,'sys::This',xp,{}).am$('qos1',8192,'sys::This',xp,{}).am$('qos2',8192,'sys::This',xp,{}).am$('qos',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('qos','sys::Obj',false)]),{}).am$('retain',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('retain','sys::Bool',false)]),{}).am$('utf8Payload',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('isUtf8','sys::Bool',false)]),{}).am$('expiryInterval',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('interval','sys::Duration?',false)]),{}).am$('userProp',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('value','sys::Str',false)]),{}).am$('contentType',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('contentType','sys::Str',false)]),{}).am$('send',8192,'concurrent::Future',xp,{});
MqttTransport.type$.am$('open',40962,'mqtt::MqttTransport',sys.List.make(sys.Param.type$,[new sys.Param('config','mqtt::ClientConfig',false)]),{}).am$('send',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Buf',false)]),{}).am$('in',270337,'sys::InStream',xp,{}).am$('close',270337,'sys::Void',xp,{}).am$('isClosed',270337,'sys::Bool',xp,{});
TcpTransport.type$.af$('socket',67584,'inet::TcpSocket?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('config','mqtt::ClientConfig',false)]),{}).am$('tlsSocket',34818,'inet::TcpSocket',sys.List.make(sys.Param.type$,[new sys.Param('config','mqtt::ClientConfig',false)]),{}).am$('send',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Buf',false)]),{}).am$('in',271360,'sys::InStream',xp,{}).am$('close',271360,'sys::Void',xp,{}).am$('isClosed',271360,'sys::Bool',xp,{});
WsTransport.type$.af$('socket',67584,'web::WebSocket',{}).af$('wsIn',67584,'mqtt::WsInStream',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('config','mqtt::ClientConfig',false)]),{}).am$('send',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Buf',false)]),{}).am$('in',271360,'sys::InStream',xp,{}).am$('close',271360,'sys::Void',xp,{}).am$('isClosed',271360,'sys::Bool',xp,{});
WsInStream.type$.af$('socket',67584,'web::WebSocket',{}).af$('curFrame',67584,'sys::Buf',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('socket','web::WebSocket',false)]),{}).am$('frame',2048,'sys::Buf',xp,{}).am$('read',271360,'sys::Int?',xp,{}).am$('readBuf',271360,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false),new sys.Param('n','sys::Int',false)]),{}).am$('unread',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{});
Message.type$.af$('payload',73730,'sys::Buf',{}).af$('qos',73730,'mqtt::QoS',{}).af$('retain',73730,'sys::Bool',{}).af$('utf8Payload',73730,'sys::Bool',{}).af$('expiryInterval',73730,'sys::Duration?',{}).af$('topicAlias',65666,'sys::Int?',{}).af$('responseTopic',65666,'sys::Str?',{}).af$('correlationData',65666,'sys::Buf?',{}).af$('userProps',73730,'mqtt::StrPair[]',{}).af$('subscriptionIds',65666,'sys::Int[]',{}).af$('contentType',73730,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('makeFields',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('payload','sys::Buf',false),new sys.Param('qos','mqtt::QoS',true),new sys.Param('retain','sys::Bool',true),new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('props',8192,'mqtt::Properties',xp,{});
ClientListener.type$.am$('onConnected',270336,'sys::Void',xp,{}).am$('onDisconnected',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err?',false)]),{});
ClientListeners.type$.af$('client',67586,'mqtt::MqttClient',{}).af$('listenersRef',67586,'sys::Unsafe',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('client','mqtt::MqttClient',false)]),{}).am$('log',2048,'sys::Log',xp,{}).am$('listeners',2048,'mqtt::ClientListener[]',xp,{}).am$('addListener',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('listener','mqtt::ClientListener',false)]),{}).am$('fireConnected',8192,'concurrent::Future',xp,{}).am$('fireDisconnected',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err?',false),new sys.Param('isClientDisconnect','sys::Bool',true)]),{}).am$('receive',267264,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('onAddListener',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('listener','mqtt::ClientListener',false)]),{}).am$('onConnected',2048,'sys::Obj?',xp,{}).am$('onDisconnected',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err?',false),new sys.Param('isClientDisconnect','sys::Bool',false)]),{});
ClientConfig.type$.af$('version',73730,'mqtt::MqttVersion',{}).af$('clientId',73730,'sys::Str',{}).af$('serverUri',73730,'sys::Uri',{}).af$('socketConfig',73730,'inet::SocketConfig',{}).af$('mqttConnectTimeout',73730,'sys::Duration',{}).af$('maxInFlight',73730,'sys::Int',{}).af$('pool',73730,'concurrent::ActorPool',{}).af$('persistence',73730,'mqtt::ClientPersistence',{}).af$('maxRetry',73730,'sys::Int',{}).af$('retryInterval',73730,'sys::Duration',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('timeout',8192,'sys::Duration',xp,{});
DefaultAutoReconnect.type$.af$('client',67586,'mqtt::MqttClient',{}).af$('initialDelay',73730,'sys::Duration',{}).af$('maxDelay',73730,'sys::Duration',{}).af$('curDelay',67586,'concurrent::AtomicInt',{}).af$('numRetries',67586,'concurrent::AtomicInt',{}).af$('disconnectTs',67586,'concurrent::AtomicInt',{}).af$('reconnectMsg',100354,'concurrent::ActorMsg',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('client','mqtt::MqttClient',false),new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('log',2048,'sys::Log',xp,{}).am$('onDisconnected',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err?',false)]),{}).am$('receive',267264,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('onInitialDisconnect',2048,'sys::Obj?',xp,{}).am$('onReconnect',2048,'sys::Obj?',xp,{}).am$('scheduleNextAttempt',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err?',true)]),{}).am$('debug',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('err','sys::Err?',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
MqttClient.type$.af$('config',73730,'mqtt::ClientConfig',{}).af$('log',73730,'sys::Log',{}).af$('housekeeping',98434,'concurrent::ActorMsg',{}).af$('packetReader',65666,'mqtt::PacketReaderActor',{}).af$('packetWriter',65666,'mqtt::PacketWriterActor',{}).af$('stateRef',65666,'concurrent::AtomicRef',{}).af$('transportRef',65666,'concurrent::AtomicRef',{}).af$('lastPacketSent',65666,'concurrent::AtomicInt',{}).af$('lastPacketReceived',65666,'concurrent::AtomicInt',{}).af$('quota',65666,'concurrent::AtomicInt',{}).af$('subMgrRef',67586,'sys::Unsafe',{}).af$('listeners',65666,'mqtt::ClientListeners',{}).af$('terminated',67586,'concurrent::AtomicBool',{}).af$('pendingConnectRef',65666,'concurrent::AtomicRef',{}).af$('clientIdRef',65666,'concurrent::AtomicRef',{}).af$('pendingAcks',67586,'concurrent::ConcurrentMap',{}).af$('lastPacketId',67586,'concurrent::AtomicInt',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('config','mqtt::ClientConfig',false),new sys.Param('log','sys::Log',true)]),{}).am$('state',8192,'mqtt::ClientState',xp,{}).am$('transport',128,'mqtt::MqttTransport?',xp,{}).am$('subMgr',128,'mqtt::ClientSubMgr',xp,{}).am$('isTerminated',8192,'sys::Bool',xp,{}).am$('pendingConnect',128,'mqtt::PendingConn',xp,{}).am$('clientId',128,'sys::Str',xp,{}).am$('nextPacketId',128,'sys::Int',xp,{}).am$('sendPacket',128,'mqtt::PendingAck?',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::ControlPacket',false),new sys.Param('pending','mqtt::PendingAck',false)]),{}).am$('freePending',2048,'mqtt::PendingAck?',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj',false)]),{}).am$('finishPending',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pending','mqtt::PendingAck',false)]),{}).am$('enableAutoReconnect',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('initialDelay','sys::Duration',true),new sys.Param('maxDelay','sys::Duration',true)]),{}).am$('addListener',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('listener','mqtt::ClientListener',false)]),{}).am$('connect',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('config','mqtt::ConnectConfig',true)]),{}).am$('publish',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('topic','sys::Str',false),new sys.Param('msg','mqtt::Message',false)]),{}).am$('publishWith',8192,'mqtt::PubSend',xp,{}).am$('subscribe',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('filter','sys::Str',false),new sys.Param('opts','sys::Int',false),new sys.Param('listener','mqtt::SubscriptionListener',false)]),{}).am$('subscribeWith',8192,'mqtt::SubSend',xp,{}).am$('unsubscribe',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('topicFilter','sys::Str',false)]),{}).am$('disconnect',8192,'concurrent::Future',xp,{}).am$('terminate',8192,'sys::This',xp,{}).am$('receive',267264,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{'sys::NoDoc':""}).am$('onConnect',2048,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('config','mqtt::ConnectConfig',false)]),{}).am$('onPublish',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::Publish',false)]),{}).am$('onSubscribe',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::Subscribe',false),new sys.Param('listener','mqtt::SubscriptionListener',false)]),{}).am$('onUnsubscribe',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::Unsubscribe',false)]),{}).am$('onPingReq',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('ping','mqtt::PingReq',false)]),{}).am$('onDisconnect',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('disconnect','mqtt::Disconnect',false)]),{}).am$('packetReceived',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::ControlPacket',false)]),{}).am$('onRecv',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::ControlPacket',false)]),{}).am$('onReceiveDisconnect',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('disconnect','mqtt::Disconnect',false)]),{}).am$('onHousekeeping',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','concurrent::ActorMsg?',false)]),{}).am$('checkConnackReceived',2048,'sys::Bool',xp,{}).am$('checkKeepAlive',2048,'sys::Void',xp,{}).am$('checkPending',2048,'sys::Void',xp,{}).am$('transition',128,'mqtt::ClientState',sys.List.make(sys.Param.type$,[new sys.Param('expected','mqtt::ClientState',false),new sys.Param('to','mqtt::ClientState',false)]),{}).am$('canMessage',128,'sys::Bool',xp,{}).am$('checkCanMessage',128,'sys::Void',xp,{}).am$('shutdown',128,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err?',true)]),{}).am$('onShutdown',128,'sys::Err?',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err?',true)]),{}).am$('debug',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('err','sys::Err?',true)]),{}).am$('notConnected',34818,'mqtt::PendingConn',xp,{}).am$('debugClient',8192,'sys::Str',xp,{'sys::NoDoc':""}).am$('static$init',165890,'sys::Void',xp,{});
ClientState.type$.af$('disconnected',106506,'mqtt::ClientState',{}).af$('connecting',106506,'mqtt::ClientState',{}).af$('connected',106506,'mqtt::ClientState',{}).af$('disconnecting',106506,'mqtt::ClientState',{}).af$('vals',106498,'mqtt::ClientState[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'mqtt::ClientState?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ConnectConfig.type$.af$('versionRef',65666,'concurrent::AtomicRef',{}).af$('keepAlive',73730,'sys::Duration',{}).af$('cleanSession',73730,'sys::Bool',{}).af$('username',73730,'sys::Str?',{}).af$('password',73730,'sys::Buf?',{}).af$('connectTimeout',73730,'sys::Duration',{}).af$('sessionExpiryInterval',73730,'sys::Duration',{}).af$('receiveMax',73730,'sys::Int?',{}).af$('maxPacketSize',73730,'sys::Int?',{}).af$('topicAliasMax',67586,'sys::Int',{}).af$('requestResponseInfo',73730,'sys::Bool',{}).af$('requestProblemInfo',73730,'sys::Bool',{}).af$('userProps',73730,'mqtt::StrPair[]',{}).af$('authMethod',73730,'sys::Str?',{}).af$('authData',73730,'sys::Buf?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('version',128,'mqtt::MqttVersion',xp,{}).am$('packet',128,'mqtt::Connect',sys.List.make(sys.Param.type$,[new sys.Param('clientId','sys::Str',false)]),{}).am$('toProps',2048,'mqtt::Properties',xp,{});
SubSend.type$.af$('client',67586,'mqtt::MqttClient',{}).af$('_topicFilter',67584,'sys::Str?',{}).af$('_qos',67584,'mqtt::QoS',{}).af$('_noLocal',67584,'sys::Bool',{}).af$('_retainAsPublished',67584,'sys::Bool',{}).af$('_retainHandling',67584,'mqtt::RetainHandling',{}).af$('callbacks',67584,'mqtt::CallbackListener',{}).af$('_listener',67584,'mqtt::SubscriptionListener',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('client','mqtt::MqttClient',false)]),{}).am$('topicFilter',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('topicFilter','sys::Str',false)]),{}).am$('qos0',8192,'sys::This',xp,{}).am$('qos1',8192,'sys::This',xp,{}).am$('qos2',8192,'sys::This',xp,{}).am$('qos',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('qos','sys::Obj',false)]),{}).am$('noLocal',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Bool',false)]),{}).am$('retainAsPublished',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Bool',false)]),{}).am$('retainHandling',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','mqtt::RetainHandling',false)]),{}).am$('onSubscribe',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cb','|sys::Str,mqtt::ReasonCode,mqtt::Properties->sys::Void|',false)]),{}).am$('onMessage',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cb','|sys::Str,mqtt::Message->sys::Void|',false)]),{}).am$('onUnsubscribe',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cb','|sys::Str,mqtt::ReasonCode,mqtt::Properties->sys::Void|',false)]),{}).am$('listener',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('listener','mqtt::SubscriptionListener',false)]),{}).am$('send',8192,'concurrent::Future',xp,{}).am$('buildOpts',2048,'sys::Int',xp,{});
RetainHandling.type$.af$('send',106506,'mqtt::RetainHandling',{}).af$('send_only_if_new_subscription',106506,'mqtt::RetainHandling',{}).af$('do_not_send',106506,'mqtt::RetainHandling',{}).af$('vals',106498,'mqtt::RetainHandling[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'mqtt::RetainHandling?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
SubscriptionListener.type$.am$('onSubscribed',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('topic','sys::Str',false),new sys.Param('reason','mqtt::ReasonCode',false),new sys.Param('props','mqtt::Properties',false)]),{}).am$('onMessage',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('topic','sys::Str',false),new sys.Param('msg','mqtt::Message',false)]),{}).am$('onUnsubscribed',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('topic','sys::Str',false),new sys.Param('reason','mqtt::ReasonCode',false),new sys.Param('props','mqtt::Properties',false)]),{});
CallbackListener.type$.af$('cbSub',73728,'|sys::Str,mqtt::ReasonCode,mqtt::Properties->sys::Void|?',{}).af$('cbMsg',73728,'|sys::Str,mqtt::Message->sys::Void|?',{}).af$('cbUnsub',73728,'|sys::Str,mqtt::ReasonCode,mqtt::Properties->sys::Void|?',{}).am$('onSubscribed',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('topic','sys::Str',false),new sys.Param('reason','mqtt::ReasonCode',false),new sys.Param('props','mqtt::Properties',false)]),{}).am$('onMessage',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('topic','sys::Str',false),new sys.Param('msg','mqtt::Message',false)]),{}).am$('onUnsubscribed',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('topic','sys::Str',false),new sys.Param('reason','mqtt::ReasonCode',false),new sys.Param('props','mqtt::Properties',false)]),{}).am$('make',139268,'sys::Void',xp,{});
PacketReaderActor.type$.af$('client',67586,'mqtt::MqttClient',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('client','mqtt::MqttClient',false)]),{}).am$('log',2048,'sys::Log',xp,{}).am$('transport',2048,'mqtt::MqttTransport?',xp,{}).am$('receive',267264,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('doReceive',2048,'sys::Bool',xp,{}).am$('trace',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::ControlPacket',false),new sys.Param('buf','sys::Buf',false)]),{});
PacketWriterActor.type$.af$('client',67586,'mqtt::MqttClient',{}).af$('version',67586,'mqtt::MqttVersion',{}).af$('actor',67586,'concurrent::Actor',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('client','mqtt::MqttClient',false)]),{}).am$('transport',2048,'mqtt::MqttTransport',xp,{}).am$('sendSync',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::ControlPacket',false)]),{}).am$('send',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::ControlPacket',false)]),{}).am$('onSend',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','concurrent::ActorMsg',false)]),{}).am$('trace',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::ControlPacket',false),new sys.Param('buf','sys::Buf',false)]),{});
ClientHandler.type$.af$('client',69634,'mqtt::MqttClient',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('client','mqtt::MqttClient',false)]),{}).am$('log',8192,'sys::Log',xp,{}).am$('state',8192,'mqtt::ClientState',xp,{}).am$('clientConfig',8192,'mqtt::ClientConfig',xp,{}).am$('version',8192,'mqtt::MqttVersion',xp,{}).am$('clientId',8192,'sys::Str',xp,{}).am$('connackProps',8192,'mqtt::Properties',xp,{}).am$('db',8192,'mqtt::ClientPersistence',xp,{}).am$('debug',4096,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('err','sys::Err?',true)]),{});
ClientConnAckHandler.type$.af$('ack',67586,'mqtt::ConnAck',{}).af$('pendingConnect',67586,'mqtt::PendingConn',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('client','mqtt::MqttClient',false),new sys.Param('ack','mqtt::ConnAck',false)]),{}).am$('run',8192,'sys::Obj?',xp,{});
ClientConnectHandler.type$.af$('config',67586,'mqtt::ConnectConfig',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('client','mqtt::MqttClient',false),new sys.Param('config','mqtt::ConnectConfig',false)]),{}).am$('run',8192,'concurrent::Future',xp,{}).am$('openTransport',2048,'sys::Void',xp,{});
ClientPublishHandler.type$.af$('pub_prefix',100354,'sys::Str',{}).af$('pubrec_prefix',100354,'sys::Str',{}).af$('pubrel_prefix',100354,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('client','mqtt::MqttClient',false)]),{}).am$('publish',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::Publish',false)]),{}).am$('reject',34818,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('reason','sys::Str',false)]),{}).am$('toErr',34818,'mqtt::MqttErr',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::PubFlowPacket',false)]),{}).am$('pubAck',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::PubAck',false),new sys.Param('pending','mqtt::PendingAck',false)]),{}).am$('pubRec',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::PubRec',false),new sys.Param('pending','mqtt::PendingAck',false)]),{}).am$('pubComp',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::PubComp',false),new sys.Param('pending','mqtt::PendingAck',false)]),{}).am$('onFinalAck',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::PubFlowPacket',false),new sys.Param('pending','mqtt::PendingAck',false)]),{}).am$('deliver',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::Publish',false)]),{}).am$('pubRel',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::PubRel',false)]),{}).am$('resume',8192,'sys::Void',xp,{}).am$('pubKey',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::ControlPacket',false)]),{}).am$('pubrelKey',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::ControlPacket',false)]),{}).am$('pubrecKey',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::ControlPacket',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ClientSubMgr.type$.af$('topics',67584,'[sys::Str:mqtt::SubscriptionListener]',{}).af$('aliases',67584,'[sys::Int:sys::Str]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('client','mqtt::MqttClient',false)]),{}).am$('close',8192,'sys::Void',xp,{}).am$('clear',8192,'sys::Void',xp,{}).am$('subscribe',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::Subscribe',false),new sys.Param('listener','mqtt::SubscriptionListener',false)]),{}).am$('subAck',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ack','mqtt::SubAck',false),new sys.Param('pending','mqtt::PendingAck',false)]),{}).am$('deliver',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::Publish',false)]),{}).am$('unsubscribe',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('packet','mqtt::Unsubscribe',false)]),{}).am$('unsubAck',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ack','mqtt::UnsubAck',false),new sys.Param('pending','mqtt::PendingAck',false)]),{});
ClientPersistence.type$.am$('open',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('clientId','sys::Str',false)]),{}).am$('get',270336,'mqtt::PersistablePacket?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{'sys::NoDoc':""}).am$('put',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('packet','mqtt::PersistablePacket',false)]),{}).am$('each',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|mqtt::PersistablePacket,sys::Str->sys::Void|',false)]),{}).am$('remove',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{}).am$('containsKey',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{}).am$('close',270337,'sys::Void',xp,{}).am$('clear',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('clientId','sys::Str',false)]),{});
ClientMemDb.type$.af$('sessions',67586,'concurrent::ConcurrentMap',{}).af$('isOpened',67586,'concurrent::AtomicBool',{}).af$('sessionRef',67586,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',xp,{}).am$('session',2048,'mqtt::ClientMemSession?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('open',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('clientId','sys::Str',false)]),{}).am$('get',271360,'mqtt::PersistablePacket?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{}).am$('put',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('packet','mqtt::PersistablePacket',false)]),{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|mqtt::PersistablePacket,sys::Str->sys::Void|',false)]),{}).am$('remove',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{}).am$('containsKey',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{}).am$('close',271360,'sys::Void',xp,{}).am$('clear',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('clientId','sys::Str',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('checkOpened',2048,'sys::Void',xp,{});
ClientMemSession.type$.af$('clientId',73730,'sys::Str',{}).af$('packets',73730,'concurrent::ConcurrentMap',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('clientId','sys::Str',false)]),{}).am$('get',8192,'mqtt::PersistablePacket?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{}).am$('put',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('packet','mqtt::PersistablePacket',false)]),{}).am$('remove',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{}).am$('clear',8192,'sys::Void',xp,{}).am$('keys',8192,'sys::Str[]',xp,{});
ControlPacket.type$.af$('empty',102402,'sys::Buf',{}).af$('packetId',73730,'concurrent::AtomicInt',{}).am$('make',8196,'sys::Void',xp,{}).am$('type',270337,'mqtt::PacketType',xp,{}).am$('packetFlags',266240,'sys::Int',xp,{}).am$('pid',8192,'sys::Int',xp,{}).am$('encode',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('variableHeaderAndPayload',266241,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('readPacket',40962,'mqtt::ControlPacket',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('checkReservedFlags',4096,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
PersistableControlPacket.type$.af$('packetVersionRef',65666,'concurrent::AtomicRef',{}).am$('markDup',270336,'sys::Void',xp,{}).am$('packetVersion',271360,'mqtt::MqttVersion',xp,{}).am$('in',271360,'sys::InStream',xp,{}).am$('fromPersistablePacket',40962,'mqtt::PersistableControlPacket',sys.List.make(sys.Param.type$,[new sys.Param('p','mqtt::PersistablePacket',false)]),{}).am$('make',139268,'sys::Void',xp,{});
PingReq.type$.af$('defVal',106498,'mqtt::PingReq',{}).af$('type',336898,'mqtt::PacketType',{}).am$('make',8196,'sys::Void',xp,{}).am$('variableHeaderAndPayload',267264,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
PingResp.type$.af$('defVal',106498,'mqtt::PingResp',{}).af$('type',336898,'mqtt::PacketType',{}).am$('make',8196,'sys::Void',xp,{}).am$('variableHeaderAndPayload',267264,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ReasonCode.type$.af$('success',106506,'mqtt::ReasonCode',{}).af$('normal_disconnection',106506,'mqtt::ReasonCode',{}).af$('granted_qos0',106506,'mqtt::ReasonCode',{}).af$('granted_qos1',106506,'mqtt::ReasonCode',{}).af$('granted_qos2',106506,'mqtt::ReasonCode',{}).af$('disconnect_with_will_message',106506,'mqtt::ReasonCode',{}).af$('not_authorized_v3',106506,'mqtt::ReasonCode',{}).af$('no_matching_subscribers',106506,'mqtt::ReasonCode',{}).af$('no_subscription_existed',106506,'mqtt::ReasonCode',{}).af$('continue_auth',106506,'mqtt::ReasonCode',{}).af$('reauthenticate',106506,'mqtt::ReasonCode',{}).af$('unspecified_error',106506,'mqtt::ReasonCode',{}).af$('malformed_packet',106506,'mqtt::ReasonCode',{}).af$('protocol_error',106506,'mqtt::ReasonCode',{}).af$('implementation_specific_error',106506,'mqtt::ReasonCode',{}).af$('unsupported_protocol_version',106506,'mqtt::ReasonCode',{}).af$('client_identifier_not_valid',106506,'mqtt::ReasonCode',{}).af$('bad_username_or_password',106506,'mqtt::ReasonCode',{}).af$('not_authorized',106506,'mqtt::ReasonCode',{}).af$('server_unavailable',106506,'mqtt::ReasonCode',{}).af$('server_busy',106506,'mqtt::ReasonCode',{}).af$('banned',106506,'mqtt::ReasonCode',{}).af$('server_shutting_down',106506,'mqtt::ReasonCode',{}).af$('bad_auth_method',106506,'mqtt::ReasonCode',{}).af$('keep_alive_timeout',106506,'mqtt::ReasonCode',{}).af$('session_taken_over',106506,'mqtt::ReasonCode',{}).af$('topic_filter_invalid',106506,'mqtt::ReasonCode',{}).af$('topic_name_invalid',106506,'mqtt::ReasonCode',{}).af$('packet_id_in_use',106506,'mqtt::ReasonCode',{}).af$('packet_id_not_found',106506,'mqtt::ReasonCode',{}).af$('receive_max_exceeded',106506,'mqtt::ReasonCode',{}).af$('topic_alias_invalid',106506,'mqtt::ReasonCode',{}).af$('packet_too_large',106506,'mqtt::ReasonCode',{}).af$('message_rate_too_high',106506,'mqtt::ReasonCode',{}).af$('quota_exceeded',106506,'mqtt::ReasonCode',{}).af$('administrative_action',106506,'mqtt::ReasonCode',{}).af$('payload_format_invalid',106506,'mqtt::ReasonCode',{}).af$('retain_not_supported',106506,'mqtt::ReasonCode',{}).af$('qos_not_supported',106506,'mqtt::ReasonCode',{}).af$('use_another_server',106506,'mqtt::ReasonCode',{}).af$('server_moved',106506,'mqtt::ReasonCode',{}).af$('shared_subscriptions_not_supported',106506,'mqtt::ReasonCode',{}).af$('connection_rate_exceeded',106506,'mqtt::ReasonCode',{}).af$('max_connect_time',106506,'mqtt::ReasonCode',{}).af$('subscription_ids_not_supported',106506,'mqtt::ReasonCode',{}).af$('wildcard_subscriptions_not_supported',106506,'mqtt::ReasonCode',{}).af$('vals',106498,'mqtt::ReasonCode[]',{}).af$('code',73730,'sys::Int',{}).af$('types',73730,'mqtt::PacketType[]',{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('code','sys::Int',false),new sys.Param('types','mqtt::PacketType[]',true)]),{}).am$('isErr',8192,'sys::Bool',xp,{}).am$('v3',8192,'sys::Int',xp,{}).am$('fromCode',40962,'mqtt::ReasonCode?',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Int',false),new sys.Param('type','mqtt::PacketType',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('fromStr',40966,'mqtt::ReasonCode?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Publish.type$.af$('type',336898,'mqtt::PacketType',{}).af$('isDup',67586,'concurrent::AtomicBool',{}).af$('topicName',73730,'sys::Str',{}).af$('msg',73730,'mqtt::Message',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('makeFields',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('topicName','sys::Str',false),new sys.Param('msg','mqtt::Message',false)]),{}).am$('decode',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false),new sys.Param('in','sys::InStream',false),new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('markDup',271360,'sys::Void',xp,{}).am$('payload',8192,'sys::Buf',xp,{}).am$('qos',8192,'mqtt::QoS',xp,{}).am$('retain',8192,'sys::Bool',xp,{}).am$('packetFlags',267264,'sys::Int',xp,{}).am$('variableHeaderAndPayload',267264,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('version','mqtt::MqttVersion',false)]),{});
QoS.type$.af$('zero',106506,'mqtt::QoS',{}).af$('one',106506,'mqtt::QoS',{}).af$('two',106506,'mqtt::QoS',{}).af$('vals',106498,'mqtt::QoS[]',{}).am$('isZero',8192,'sys::Bool',xp,{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'mqtt::QoS?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
PubFlowPacket.type$.af$('reason',73730,'mqtt::ReasonCode',{}).af$('props',73730,'mqtt::Properties',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pid','sys::Int',false),new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('decode',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('variableHeaderAndPayload',267264,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('isErr',8192,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
PubAck.type$.af$('type',336898,'mqtt::PacketType',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pid','sys::Int',false),new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('decode',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('version','mqtt::MqttVersion',false)]),{});
PubRec.type$.af$('type',336898,'mqtt::PacketType',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pid','sys::Int',false),new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('decode',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('version','mqtt::MqttVersion',false)]),{});
PubRel.type$.af$('type',336898,'mqtt::PacketType',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pid','sys::Int',false),new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('decode',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false),new sys.Param('in','sys::InStream',false),new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('packetFlags',267264,'sys::Int',xp,{});
PubComp.type$.af$('type',336898,'mqtt::PacketType',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pid','sys::Int',false),new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('decode',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('version','mqtt::MqttVersion',false)]),{});
Unsubscribe.type$.af$('type',336898,'mqtt::PacketType',{}).af$('props',73730,'mqtt::Properties',{}).af$('topics',73730,'sys::Str[]',{}).am$('makeFields',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('topics','sys::Str[]',false)]),{}).am$('decode',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false),new sys.Param('in','sys::InStream',false),new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('checkFields',2048,'sys::Void',xp,{}).am$('packetFlags',267264,'sys::Int',xp,{}).am$('variableHeaderAndPayload',267264,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('version','mqtt::MqttVersion',false)]),{});
UnsubAck.type$.af$('type',336898,'mqtt::PacketType',{}).af$('props',73730,'mqtt::Properties',{}).af$('reasons',73730,'mqtt::ReasonCode[]',{}).am$('decode',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('variableHeaderAndPayload',267264,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
Subscribe.type$.af$('type',336898,'mqtt::PacketType',{}).af$('topics',73730,'sys::Str[]',{}).af$('opts',73730,'sys::Int[]',{}).af$('props',73730,'mqtt::Properties',{}).am$('makeFields',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('topics','sys::Str[]',false),new sys.Param('opts','sys::Int[]',false),new sys.Param('props','mqtt::Properties',true)]),{}).am$('decode',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false),new sys.Param('in','sys::InStream',false),new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('checkFields',2048,'sys::Void',xp,{}).am$('packetFlags',267264,'sys::Int',xp,{}).am$('variableHeaderAndPayload',267264,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('version','mqtt::MqttVersion',false)]),{});
SubAck.type$.af$('type',336898,'mqtt::PacketType',{}).af$('props',73730,'mqtt::Properties',{}).af$('returnCodes',73730,'mqtt::ReasonCode[]',{}).am$('makeFields',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('returnCodes','mqtt::ReasonCode[]',false)]),{}).am$('decode',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('checkFields',2048,'sys::Void',xp,{}).am$('variableHeaderAndPayload',267264,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
Connect.type$.af$('type',336898,'mqtt::PacketType',{}).af$('version',73730,'mqtt::MqttVersion',{}).af$('cleanSession',73730,'sys::Bool',{}).af$('keepAlive',73730,'sys::Duration',{}).af$('clientId',73730,'sys::Str',{}).af$('willPublish',73730,'mqtt::Publish?',{}).af$('username',73730,'sys::Str?',{}).af$('password',73730,'sys::Buf?',{}).af$('props',73730,'mqtt::Properties',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('variableHeaderAndPayload',267264,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('variableHeader',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false),new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('payload',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false),new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('validate',8192,'sys::This',xp,{}).am$('hasWill',8192,'sys::Bool',xp,{}).am$('flags',128,'sys::Int',xp,{});
ConnAck.type$.af$('type',336898,'mqtt::PacketType',{}).af$('isSessionPresent',73730,'sys::Bool',{}).af$('reason',73730,'mqtt::ReasonCode',{}).af$('props',73730,'mqtt::Properties',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('decode',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('variableHeaderAndPayload',267264,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('isSuccess',8192,'sys::Bool',xp,{});
Disconnect.type$.af$('type',336898,'mqtt::PacketType',{}).af$('reason',73730,'mqtt::ReasonCode',{}).af$('props',73730,'mqtt::Properties',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('makeFields',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('reason','mqtt::ReasonCode',false),new sys.Param('props','mqtt::Properties',true)]),{}).am$('decode',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('version','mqtt::MqttVersion',false)]),{}).am$('variableHeaderAndPayload',267264,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('version','mqtt::MqttVersion',false)]),{});
PacketType.type$.af$('reserved',106506,'mqtt::PacketType',{}).af$('connect',106506,'mqtt::PacketType',{}).af$('connack',106506,'mqtt::PacketType',{}).af$('publish',106506,'mqtt::PacketType',{}).af$('puback',106506,'mqtt::PacketType',{}).af$('pubrec',106506,'mqtt::PacketType',{}).af$('pubrel',106506,'mqtt::PacketType',{}).af$('pubcomp',106506,'mqtt::PacketType',{}).af$('subscribe',106506,'mqtt::PacketType',{}).af$('suback',106506,'mqtt::PacketType',{}).af$('unsubscribe',106506,'mqtt::PacketType',{}).af$('unsuback',106506,'mqtt::PacketType',{}).af$('pingreq',106506,'mqtt::PacketType',{}).af$('pingresp',106506,'mqtt::PacketType',{}).af$('disconnect',106506,'mqtt::PacketType',{}).af$('auth',106506,'mqtt::PacketType',{}).af$('vals',106498,'mqtt::PacketType[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'mqtt::PacketType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Properties.type$.af$('props',67586,'concurrent::ConcurrentMap',{}).am$('make',8196,'sys::Void',xp,{}).am$('add',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('prop','mqtt::Property',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('isEmpty',8192,'sys::Bool',xp,{}).am$('get',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('prop','mqtt::Property',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('clear',8192,'sys::This',xp,{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,mqtt::Property->sys::Void|',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('maxPacketSize',128,'sys::Int',xp,{}).am$('messageExpiryInterval',128,'sys::Duration?',xp,{}).am$('maxQoS',128,'mqtt::QoS',xp,{}).am$('reasonStr',128,'sys::Str?',xp,{}).am$('receiveMax',128,'sys::Int',xp,{}).am$('retainAvailable',128,'sys::Bool',xp,{}).am$('subscriptionIds',128,'sys::Int[]',xp,{}).am$('userProps',128,'mqtt::StrPair[]',xp,{}).am$('utf8Payload',128,'sys::Bool',xp,{}).am$('wildcardSubscriptionAvailable',128,'sys::Bool',xp,{}).am$('checkType',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prop','mqtt::Property',false),new sys.Param('val','sys::Obj',false)]),{}).am$('checkRange',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prop','mqtt::Property',false),new sys.Param('val','sys::Obj',false)]),{});
Property.type$.af$('payloadFormatIndicator',106506,'mqtt::Property',{}).af$('messageExpiryInterval',106506,'mqtt::Property',{}).af$('contentType',106506,'mqtt::Property',{}).af$('responseTopic',106506,'mqtt::Property',{}).af$('correlationData',106506,'mqtt::Property',{}).af$('subscriptionId',106506,'mqtt::Property',{}).af$('sessionExpiryInterval',106506,'mqtt::Property',{}).af$('assignedClientId',106506,'mqtt::Property',{}).af$('serverKeepAlive',106506,'mqtt::Property',{}).af$('authMethod',106506,'mqtt::Property',{}).af$('authData',106506,'mqtt::Property',{}).af$('requestProblemInfo',106506,'mqtt::Property',{}).af$('willDelayInterval',106506,'mqtt::Property',{}).af$('requestResponseInfo',106506,'mqtt::Property',{}).af$('responseInfo',106506,'mqtt::Property',{}).af$('serverRef',106506,'mqtt::Property',{}).af$('reasonStr',106506,'mqtt::Property',{}).af$('receiveMax',106506,'mqtt::Property',{}).af$('topicAliasMax',106506,'mqtt::Property',{}).af$('topicAlias',106506,'mqtt::Property',{}).af$('maxQoS',106506,'mqtt::Property',{}).af$('retainAvailable',106506,'mqtt::Property',{}).af$('userProperty',106506,'mqtt::Property',{}).af$('maxPacketSize',106506,'mqtt::Property',{}).af$('wildcardSubscriptionAvailable',106506,'mqtt::Property',{}).af$('subscriptionIdsAvailable',106506,'mqtt::Property',{}).af$('sharedSubscriptionAvailable',106506,'mqtt::Property',{}).af$('vals',106498,'mqtt::Property[]',{}).af$('id',73730,'sys::Int',{}).af$('type',73730,'mqtt::DataType',{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('id','sys::Int',false),new sys.Param('type','mqtt::DataType',false)]),{}).am$('fromId',40962,'mqtt::Property',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Int',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('fromStr',40966,'mqtt::Property?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
StrPair.type$.af$('name',73730,'sys::Str',{}).af$('val',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Str',false)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
PropertiesTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('makeTestProps',2048,'mqtt::Properties',xp,{}).am$('make',139268,'sys::Void',xp,{});
TopicTest.type$.am$('testNames',8192,'sys::Void',xp,{}).am$('testFilters',8192,'sys::Void',xp,{}).am$('testMatch',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
DataCodecTest.type$.am$('testUtf8',8192,'sys::Void',xp,{}).am$('testVariableByteInteger',8192,'sys::Void',xp,{}).am$('testBinary',8192,'sys::Void',xp,{}).am$('testStrPair',8192,'sys::Void',xp,{}).am$('testProperties',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "mqtt");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;crypto 1.0;inet 1.0;web 1.0;util 1.0");
m.set("pod.summary", "MQTT core library");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:28-05:00 New_York");
m.set("build.tsKey", "241210143128");
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
  PersistablePacket,
  MqttVersion,
  MqttErr,
  MalformedPacketErr,
  MqttConst,
  Topic,
  DataCodec,
  DataType,
  ClientId,
  PubSend,
  Message,
  ClientListener,
  ClientConfig,
  ClientAutoReconnect,
  MqttClient,
  ClientState,
  ConnectConfig,
  SubSend,
  RetainHandling,
  SubscriptionListener,
  ClientPersistence,
  ClientMemDb,
  ReasonCode,
  QoS,
  PacketType,
  Properties,
  Property,
  StrPair,
  PropertiesTest,
  TopicTest,
  DataCodecTest,
};
