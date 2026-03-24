// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as web from './web.js'
import * as xml from './xml.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class Status extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Status.type$; }

  static ok() { return Status.vals().get(0); }

  static overridden() { return Status.vals().get(1); }

  static unacked() { return Status.vals().get(2); }

  static alarm() { return Status.vals().get(3); }

  static unackedAlarm() { return Status.vals().get(4); }

  static down() { return Status.vals().get(5); }

  static fault() { return Status.vals().get(6); }

  static disabled() { return Status.vals().get(7); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new Status();
    Status.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(Status.type$, Status.vals(), name$, checked);
  }

  static vals() {
    if (Status.#vals == null) {
      Status.#vals = sys.List.make(Status.type$, [
        Status.make(0, "ok", ),
        Status.make(1, "overridden", ),
        Status.make(2, "unacked", ),
        Status.make(3, "alarm", ),
        Status.make(4, "unackedAlarm", ),
        Status.make(5, "down", ),
        Status.make(6, "fault", ),
        Status.make(7, "disabled", ),
      ]).toImmutable();
    }
    return Status.#vals;
  }

  static static$init() {
    const $_u0 = Status.vals();
    if (true) {
    }
    ;
    return;
  }

}

class Contract extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Contract.type$; }

  #uris = null;

  uris() { return this.#uris; }

  __uris(it) { if (it === undefined) return this.#uris; else this.#uris = it; }

  static #empty = undefined;

  static empty() {
    if (Contract.#empty === undefined) {
      Contract.static$init();
      if (Contract.#empty === undefined) Contract.#empty = null;
    }
    return Contract.#empty;
  }

  static #lobby = undefined;

  static lobby() {
    if (Contract.#lobby === undefined) {
      Contract.static$init();
      if (Contract.#lobby === undefined) Contract.#lobby = null;
    }
    return Contract.#lobby;
  }

  static #about = undefined;

  static about() {
    if (Contract.#about === undefined) {
      Contract.static$init();
      if (Contract.#about === undefined) Contract.#about = null;
    }
    return Contract.#about;
  }

  static #batchIn = undefined;

  static batchIn() {
    if (Contract.#batchIn === undefined) {
      Contract.static$init();
      if (Contract.#batchIn === undefined) Contract.#batchIn = null;
    }
    return Contract.#batchIn;
  }

  static #batchOut = undefined;

  static batchOut() {
    if (Contract.#batchOut === undefined) {
      Contract.static$init();
      if (Contract.#batchOut === undefined) Contract.#batchOut = null;
    }
    return Contract.#batchOut;
  }

  static #watchService = undefined;

  static watchService() {
    if (Contract.#watchService === undefined) {
      Contract.static$init();
      if (Contract.#watchService === undefined) Contract.#watchService = null;
    }
    return Contract.#watchService;
  }

  static #watch = undefined;

  static watch() {
    if (Contract.#watch === undefined) {
      Contract.static$init();
      if (Contract.#watch === undefined) Contract.#watch = null;
    }
    return Contract.#watch;
  }

  static #watchIn = undefined;

  static watchIn() {
    if (Contract.#watchIn === undefined) {
      Contract.static$init();
      if (Contract.#watchIn === undefined) Contract.#watchIn = null;
    }
    return Contract.#watchIn;
  }

  static #watchOut = undefined;

  static watchOut() {
    if (Contract.#watchOut === undefined) {
      Contract.static$init();
      if (Contract.#watchOut === undefined) Contract.#watchOut = null;
    }
    return Contract.#watchOut;
  }

  static #read = undefined;

  static read() {
    if (Contract.#read === undefined) {
      Contract.static$init();
      if (Contract.#read === undefined) Contract.#read = null;
    }
    return Contract.#read;
  }

  static #write = undefined;

  static write() {
    if (Contract.#write === undefined) {
      Contract.static$init();
      if (Contract.#write === undefined) Contract.#write = null;
    }
    return Contract.#write;
  }

  static #invoke = undefined;

  static invoke() {
    if (Contract.#invoke === undefined) {
      Contract.static$init();
      if (Contract.#invoke === undefined) Contract.#invoke = null;
    }
    return Contract.#invoke;
  }

  static #badUriErr = undefined;

  static badUriErr() {
    if (Contract.#badUriErr === undefined) {
      Contract.static$init();
      if (Contract.#badUriErr === undefined) Contract.#badUriErr = null;
    }
    return Contract.#badUriErr;
  }

  static #point = undefined;

  static point() {
    if (Contract.#point === undefined) {
      Contract.static$init();
      if (Contract.#point === undefined) Contract.#point = null;
    }
    return Contract.#point;
  }

  static #history = undefined;

  static history() {
    if (Contract.#history === undefined) {
      Contract.static$init();
      if (Contract.#history === undefined) Contract.#history = null;
    }
    return Contract.#history;
  }

  static #writePointIn = undefined;

  static writePointIn() {
    if (Contract.#writePointIn === undefined) {
      Contract.static$init();
      if (Contract.#writePointIn === undefined) Contract.#writePointIn = null;
    }
    return Contract.#writePointIn;
  }

  static #historyFilter = undefined;

  static historyFilter() {
    if (Contract.#historyFilter === undefined) {
      Contract.static$init();
      if (Contract.#historyFilter === undefined) Contract.#historyFilter = null;
    }
    return Contract.#historyFilter;
  }

  static #historyQueryOut = undefined;

  static historyQueryOut() {
    if (Contract.#historyQueryOut === undefined) {
      Contract.static$init();
      if (Contract.#historyQueryOut === undefined) Contract.#historyQueryOut = null;
    }
    return Contract.#historyQueryOut;
  }

  static make(uris) {
    const $self = new Contract();
    Contract.make$($self,uris);
    return $self;
  }

  static make$($self,uris) {
    $self.#uris = sys.ObjUtil.coerce(((this$) => { let $_u1 = uris; if ($_u1 == null) return null; return sys.ObjUtil.toImmutable(uris); })($self), sys.Type.find("sys::Uri[]"));
    return;
  }

  static fromStr(s,checked) {
    if (checked === undefined) checked = false;
    const this$ = this;
    try {
      return Contract.make(sys.ObjUtil.coerce(sys.Str.split(s).map((x) => {
        return sys.ObjUtil.coerce(sys.Uri.decode(x), sys.Uri.type$);
      }, sys.Uri.type$), sys.Type.find("sys::Uri[]")));
    }
    catch ($_u2) {
      if (checked) {
        return null;
      }
      ;
      throw sys.ParseErr.make(sys.Str.plus("Contract: ", s));
    }
    ;
  }

  isEmpty() {
    return this.#uris.isEmpty();
  }

  equals(that) {
    let x = sys.ObjUtil.as(that, Contract.type$);
    if (x == null) {
      return false;
    }
    ;
    return sys.ObjUtil.equals(this.#uris, x.#uris);
  }

  hash() {
    return this.#uris.hash();
  }

  toStr() {
    const this$ = this;
    return this.#uris.join(" ", (it) => {
      return it.encode();
    });
  }

  has(contract) {
    return this.#uris.contains(contract);
  }

  static static$init() {
    Contract.#empty = Contract.make(sys.List.make(sys.Uri.type$));
    Contract.#lobby = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:Lobby")]));
    Contract.#about = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:About")]));
    Contract.#batchIn = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:BatchIn")]));
    Contract.#batchOut = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:BatchOut")]));
    Contract.#watchService = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:WatchService")]));
    Contract.#watch = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:Watch")]));
    Contract.#watchIn = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:WatchIn")]));
    Contract.#watchOut = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:WatchOut")]));
    Contract.#read = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:Read")]));
    Contract.#write = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:Write")]));
    Contract.#invoke = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:Invoke")]));
    Contract.#badUriErr = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:BadUriErr")]));
    Contract.#point = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:Point")]));
    Contract.#history = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:History")]));
    Contract.#writePointIn = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:WritePointIn")]));
    Contract.#historyFilter = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:HistoryFilter")]));
    Contract.#historyQueryOut = Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:HistoryQueryOut")]));
    return;
  }

}

class ObixObj extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#elemName = "obj";
    this.#contract = Contract.empty();
    this.#status = Status.ok();
    return;
  }

  typeof() { return ObixObj.type$; }

  #name = null;

  name(it) {
    if (it === undefined) {
      return this.#name;
    }
    else {
      if (this.#parent != null) {
        throw sys.UnsupportedErr.make("cannot set name while parented");
      }
      ;
      this.#name = it;
      return;
    }
  }

  #href = null;

  href(it) {
    if (it === undefined) {
      return this.#href;
    }
    else {
      this.#href = it;
      return;
    }
  }

  #elemName = null;

  elemName(it) {
    if (it === undefined) {
      return this.#elemName;
    }
    else {
      if (!sys.ObjUtil.coerce(ObixUtil.elemNames().get(it), sys.Bool.type$)) {
        throw sys.ArgErr.make(sys.Str.plus("Invalid elemName: ", it));
      }
      ;
      this.#elemName = it;
      return;
    }
  }

  #contract = null;

  contract(it) {
    if (it === undefined) {
      return this.#contract;
    }
    else {
      this.#contract = it;
      return;
    }
  }

  #of = null;

  of(it) {
    if (it === undefined) {
      return this.#of;
    }
    else {
      this.#of = it;
      return;
    }
  }

  #in = null;

  in(it) {
    if (it === undefined) {
      return this.#in;
    }
    else {
      this.#in = it;
      return;
    }
  }

  #out = null;

  out(it) {
    if (it === undefined) {
      return this.#out;
    }
    else {
      this.#out = it;
      return;
    }
  }

  #isNull = false;

  isNull(it) {
    if (it === undefined) {
      return this.#isNull;
    }
    else {
      this.#isNull = it;
      return;
    }
  }

  #val = null;

  val(it) {
    if (it === undefined) {
      return this.#val;
    }
    else {
      if ((sys.ObjUtil.equals(this.elemName(), "enum") && sys.ObjUtil.is(it, sys.Str.type$))) {
        this.#val = it;
        return;
      }
      ;
      if (it != null) {
        let elem = ObixUtil.valTypeToElemName().get(sys.Type.of(sys.ObjUtil.coerce(it, sys.Obj.type$)));
        if (elem == null) {
          throw sys.ArgErr.make(sys.Str.plus("Invalid val type: ", sys.Type.of(sys.ObjUtil.coerce(it, sys.Obj.type$))));
        }
        ;
        this.#elemName = sys.ObjUtil.coerce(elem, sys.Str.type$);
        if ((sys.ObjUtil.is(it, sys.DateTime.type$) && this.#tz == null)) {
          let tz = sys.ObjUtil.coerce(it, sys.DateTime.type$).tz();
          if (!sys.Str.startsWith(tz.fullName(), "Etc/")) {
            this.#tz = tz;
          }
          ;
        }
        ;
      }
      ;
      this.#val = it;
      return;
    }
  }

  #parent = null;

  parent() {
    return this.#parent;
  }

  #displayName = null;

  displayName(it) {
    if (it === undefined) {
      return this.#displayName;
    }
    else {
      this.#displayName = it;
      return;
    }
  }

  #display = null;

  display(it) {
    if (it === undefined) {
      return this.#display;
    }
    else {
      this.#display = it;
      return;
    }
  }

  #icon = null;

  icon(it) {
    if (it === undefined) {
      return this.#icon;
    }
    else {
      this.#icon = it;
      return;
    }
  }

  #min = null;

  min(it) {
    if (it === undefined) {
      return this.#min;
    }
    else {
      this.#min = it;
      return;
    }
  }

  #max = null;

  max(it) {
    if (it === undefined) {
      return this.#max;
    }
    else {
      this.#max = it;
      return;
    }
  }

  #precision = null;

  precision(it) {
    if (it === undefined) {
      return this.#precision;
    }
    else {
      this.#precision = it;
      return;
    }
  }

  #range = null;

  range(it) {
    if (it === undefined) {
      return this.#range;
    }
    else {
      this.#range = it;
      return;
    }
  }

  #status = null;

  status(it) {
    if (it === undefined) {
      return this.#status;
    }
    else {
      this.#status = it;
      return;
    }
  }

  #tz = null;

  tz(it) {
    if (it === undefined) {
      return this.#tz;
    }
    else {
      this.#tz = it;
      return;
    }
  }

  #unit = null;

  unit(it) {
    if (it === undefined) {
      return this.#unit;
    }
    else {
      this.#unit = it;
      return;
    }
  }

  #writable = false;

  writable(it) {
    if (it === undefined) {
      return this.#writable;
    }
    else {
      this.#writable = it;
      return;
    }
  }

  static #noUris = undefined;

  static noUris() {
    if (ObixObj.#noUris === undefined) {
      ObixObj.static$init();
      if (ObixObj.#noUris === undefined) ObixObj.#noUris = null;
    }
    return ObixObj.#noUris;
  }

  static #noChildren = undefined;

  static noChildren() {
    if (ObixObj.#noChildren === undefined) {
      ObixObj.static$init();
      if (ObixObj.#noChildren === undefined) ObixObj.#noChildren = null;
    }
    return ObixObj.#noChildren;
  }

  static #xmlEsc = undefined;

  static xmlEsc() {
    if (ObixObj.#xmlEsc === undefined) {
      ObixObj.static$init();
      if (ObixObj.#xmlEsc === undefined) ObixObj.#xmlEsc = 0;
    }
    return ObixObj.#xmlEsc;
  }

  #kidsByName = null;

  // private field reflection only
  __kidsByName(it) { if (it === undefined) return this.#kidsByName; else this.#kidsByName = it; }

  #kidsHead = null;

  // private field reflection only
  __kidsHead(it) { if (it === undefined) return this.#kidsHead; else this.#kidsHead = it; }

  #kidsTail = null;

  // private field reflection only
  __kidsTail(it) { if (it === undefined) return this.#kidsTail; else this.#kidsTail = it; }

  #kidsCount = 0;

  // private field reflection only
  __kidsCount(it) { if (it === undefined) return this.#kidsCount; else this.#kidsCount = it; }

  #prev = null;

  // private field reflection only
  __prev(it) { if (it === undefined) return this.#prev; else this.#prev = it; }

  #next = null;

  // private field reflection only
  __next(it) { if (it === undefined) return this.#next; else this.#next = it; }

  normalizedHref() {
    if (this.#href == null) {
      return null;
    }
    ;
    let r = this.root();
    if (r.#href == null) {
      return null;
    }
    ;
    return r.#href.plus(sys.ObjUtil.coerce(this.#href, sys.Uri.type$));
  }

  toStr() {
    let s = sys.StrBuf.make();
    s.add("<").add(this.elemName());
    if (this.name() != null) {
      s.add(" name='").add(this.name()).add("'");
    }
    ;
    if (this.#href != null) {
      s.add(" href='").add(this.#href).add("'");
    }
    ;
    if (this.val() != null) {
      s.add(" val='").add(ObixUtil.valToStr(this.val())).add("'");
    }
    ;
    s.add(">");
    return s.toStr();
  }

  valType() {
    return ObixUtil.elemNameToValType().get(this.elemName());
  }

  valToStr() {
    return ObixUtil.valToStr(this.val());
  }

  root() {
    let x = this;
    while (x.#parent != null) {
      (x = sys.ObjUtil.coerce(x.#parent, ObixObj.type$));
    }
    ;
    return x;
  }

  isEmpty() {
    return sys.ObjUtil.equals(this.#kidsCount, 0);
  }

  size() {
    return this.#kidsCount;
  }

  has(name) {
    if (this.#kidsByName == null) {
      return false;
    }
    ;
    return this.#kidsByName.containsKey(name);
  }

  get(name,checked) {
    if (checked === undefined) checked = true;
    let child = ((this$) => { let $_u3 = this$.#kidsByName; if ($_u3 == null) return null; return this$.#kidsByName.get(name); })(this);
    if (child != null) {
      return child;
    }
    ;
    if (checked) {
      throw sys.NameErr.make(sys.Str.plus(sys.Str.plus("Missing obix child '", name), "'"));
    }
    ;
    return null;
  }

  trap(name,args) {
    if (args === undefined) args = null;
    let child = ((this$) => { let $_u4 = this$.#kidsByName; if ($_u4 == null) return null; return this$.#kidsByName.get(name); })(this);
    if (child != null) {
      return child.val();
    }
    ;
    return sys.ObjUtil.trap(sys.Obj.prototype, name, args);
  }

  list() {
    const this$ = this;
    if (sys.ObjUtil.equals(this.#kidsCount, 0)) {
      return ObixObj.noChildren();
    }
    ;
    let list = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.List.make(ObixObj.type$), (it) => {
      it.capacity(this$.#kidsCount);
      return;
    }), sys.Type.find("obix::ObixObj[]"));
    for (let p = this.#kidsHead; p != null; (p = p.#next)) {
      list.add(sys.ObjUtil.coerce(p, ObixObj.type$));
    }
    ;
    return list.ro();
  }

  first() {
    return this.#kidsHead;
  }

  last() {
    return this.#kidsTail;
  }

  each(f) {
    for (let p = this.#kidsHead; p != null; (p = p.#next)) {
      sys.Func.call(f, sys.ObjUtil.coerce(p, ObixObj.type$));
    }
    ;
    return;
  }

  add(kid) {
    if ((kid.#parent != null || kid.#prev != null || kid.#next != null)) {
      throw sys.ArgErr.make("Child is already parented");
    }
    ;
    if ((kid.name() != null && this.#kidsByName != null && this.#kidsByName.containsKey(sys.ObjUtil.coerce(kid.name(), sys.Str.type$)) && sys.ObjUtil.compareNE(this.elemName(), "list"))) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Duplicate child name '", kid.name()), "'"));
    }
    ;
    if (kid.name() != null) {
      if (this.#kidsByName == null) {
        this.#kidsByName = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("obix::ObixObj"));
      }
      ;
      this.#kidsByName.set(sys.ObjUtil.coerce(kid.name(), sys.Str.type$), kid);
    }
    ;
    if (this.#kidsTail == null) {
      this.#kidsHead = ((this$) => { let $_u5 = kid; this$.#kidsTail = $_u5; return $_u5; })(this);
    }
    else {
      this.#kidsTail.#next = kid;
      kid.#prev = this.#kidsTail;
      this.#kidsTail = kid;
    }
    ;
    ((this$) => { let $_u6 = this$.#kidsCount;this$.#kidsCount = sys.Int.increment(this$.#kidsCount); return $_u6; })(this);
    kid.#parent = this;
    return this;
  }

  remove(kid) {
    if (sys.ObjUtil.compareNE(kid.#parent, this)) {
      throw sys.ArgErr.make("Not parented by me");
    }
    ;
    if (kid.name() != null) {
      this.#kidsByName.remove(sys.ObjUtil.coerce(kid.name(), sys.Str.type$));
    }
    ;
    if (sys.ObjUtil.equals(this.#kidsHead, kid)) {
      this.#kidsHead = kid.#next;
    }
    else {
      kid.#prev.#next = kid.#next;
    }
    ;
    if (sys.ObjUtil.equals(this.#kidsTail, kid)) {
      this.#kidsTail = kid.#prev;
    }
    else {
      kid.#next.#prev = kid.#prev;
    }
    ;
    ((this$) => { let $_u7 = this$.#kidsCount;this$.#kidsCount = sys.Int.decrement(this$.#kidsCount); return $_u7; })(this);
    kid.#parent = null;
    kid.#prev = null;
    kid.#next = null;
    return this;
  }

  clear() {
    let p = this.#kidsHead;
    while (p != null) {
      let x = p.#next;
      p.#parent = ((this$) => { let $_u8 = ((this$) => { let $_u9 = null; p.#next = $_u9; return $_u9; })(this$); p.#prev = $_u8; return $_u8; })(this);
      (p = x);
    }
    ;
    this.#kidsByName.clear();
    this.#kidsHead = ((this$) => { let $_u10 = null; this$.#kidsTail = $_u10; return $_u10; })(this);
    this.#kidsCount = 0;
    return this;
  }

  static readXml(in$,close) {
    if (close === undefined) close = true;
    return ObixXmlParser.make(in$).parse(close);
  }

  writeXml(out,indent) {
    if (indent === undefined) indent = 0;
    const this$ = this;
    out.print(sys.Str.spaces(indent)).print("<").print(this.elemName());
    if (this.name() != null) {
      out.print(" name='").writeXml(sys.ObjUtil.coerce(this.name(), sys.Str.type$), ObixObj.xmlEsc()).print("'");
    }
    ;
    if (this.#href != null) {
      out.print(" href='").print(this.#href.encode()).print("'");
    }
    ;
    if (!this.#contract.isEmpty()) {
      out.print(" is='").print(this.#contract).print("'");
    }
    ;
    if ((this.#of != null && !this.#of.isEmpty())) {
      out.print(" of='").print(this.#of).print("'");
    }
    ;
    if ((this.#in != null && !this.#in.isEmpty())) {
      out.print(" in='").print(this.#in).print("'");
    }
    ;
    if ((this.#out != null && !this.#out.isEmpty())) {
      out.print(" out='").print(this.#out).print("'");
    }
    ;
    if (this.val() != null) {
      out.print(" val='").writeXml(this.valToStr(), ObixObj.xmlEsc()).print("'");
    }
    ;
    if (this.#isNull) {
      out.print(" isNull='true'");
    }
    ;
    if (this.#displayName != null) {
      out.print(" displayName='").writeXml(sys.ObjUtil.coerce(this.#displayName, sys.Str.type$), ObixObj.xmlEsc()).print("'");
    }
    ;
    if (this.#display != null) {
      out.print(" display='").writeXml(sys.ObjUtil.coerce(this.#display, sys.Str.type$), ObixObj.xmlEsc()).print("'");
    }
    ;
    if (this.#icon != null) {
      out.print(" icon='").print(this.#icon.encode()).print("'");
    }
    ;
    if (this.#min != null) {
      out.print(" min='").print(ObixUtil.valToStr(this.#min)).print("'");
    }
    ;
    if (this.#max != null) {
      out.print(" max='").print(ObixUtil.valToStr(this.#max)).print("'");
    }
    ;
    if (this.#precision != null) {
      out.print(" precision='").print(sys.ObjUtil.coerce(this.#precision, sys.Obj.type$.toNullable())).print("'");
    }
    ;
    if (this.#range != null) {
      out.print(" range='").print(this.#range.encode()).print("'");
    }
    ;
    if (this.#status !== Status.ok()) {
      out.print(" status='").print(this.#status).print("'");
    }
    ;
    if (this.#tz != null) {
      out.print(" tz='").print(this.#tz.fullName()).print("'");
    }
    ;
    if (this.#unit != null) {
      out.print(" unit='obix:units/").print(this.#unit.name()).print("'");
    }
    ;
    if (this.#writable) {
      out.print(" writable='true'");
    }
    ;
    if (this.isEmpty()) {
      out.print("/>\n");
    }
    else {
      out.print(">\n");
      this.each((kid) => {
        kid.writeXml(out, sys.Int.plus(indent, 1));
        return;
      });
      out.print(sys.Str.spaces(indent)).print("</").print(this.elemName()).print(">\n");
    }
    ;
    if (this.#parent == null) {
      out.flush();
    }
    ;
    return;
  }

  dump() {
    let out = sys.Env.cur().out();
    this.writeXml(out);
    out.flush();
    return this;
  }

  static make() {
    const $self = new ObixObj();
    ObixObj.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  static static$init() {
    ObixObj.#noUris = sys.ObjUtil.coerce(((this$) => { let $_u11 = sys.List.make(sys.Uri.type$); if ($_u11 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Uri.type$)); })(this), sys.Type.find("sys::Uri[]"));
    ObixObj.#noChildren = sys.ObjUtil.coerce(((this$) => { let $_u12 = sys.List.make(ObixObj.type$); if ($_u12 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(ObixObj.type$)); })(this), sys.Type.find("obix::ObixObj[]"));
    ObixObj.#xmlEsc = sys.Int.or(sys.OutStream.xmlEscNewlines(), sys.OutStream.xmlEscQuotes());
    return;
  }

}

class ObixMod extends web.WebMod {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixMod.type$; }

  #aboutServerName = null;

  // private field reflection only
  __aboutServerName(it) { if (it === undefined) return this.#aboutServerName; else this.#aboutServerName = it; }

  #aboutVendorName = null;

  // private field reflection only
  __aboutVendorName(it) { if (it === undefined) return this.#aboutVendorName; else this.#aboutVendorName = it; }

  #aboutVendorUrl = null;

  // private field reflection only
  __aboutVendorUrl(it) { if (it === undefined) return this.#aboutVendorUrl; else this.#aboutVendorUrl = it; }

  #aboutProductName = null;

  // private field reflection only
  __aboutProductName(it) { if (it === undefined) return this.#aboutProductName; else this.#aboutProductName = it; }

  #aboutProductVer = null;

  // private field reflection only
  __aboutProductVer(it) { if (it === undefined) return this.#aboutProductVer; else this.#aboutProductVer = it; }

  #aboutProductUrl = null;

  // private field reflection only
  __aboutProductUrl(it) { if (it === undefined) return this.#aboutProductUrl; else this.#aboutProductUrl = it; }

  static make(about) {
    const $self = new ObixMod();
    ObixMod.make$($self,about);
    return $self;
  }

  static make$($self,about) {
    if (about === undefined) about = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    web.WebMod.make$($self);
    $self.#aboutServerName = sys.ObjUtil.coerce(((this$) => { let $_u13 = about.get("serverName"); if ($_u13 != null) return $_u13; return sys.Env.cur().host(); })($self), sys.Str.type$);
    $self.#aboutVendorName = sys.ObjUtil.coerce(((this$) => { let $_u14 = about.get("vendorName"); if ($_u14 != null) return $_u14; return "Fantom"; })($self), sys.Str.type$);
    $self.#aboutVendorUrl = sys.ObjUtil.coerce(((this$) => { let $_u15 = about.get("vendorUrl"); if ($_u15 != null) return $_u15; return sys.Uri.fromStr("https://fantom.org"); })($self), sys.Uri.type$);
    $self.#aboutProductName = sys.ObjUtil.coerce(((this$) => { let $_u16 = about.get("productName"); if ($_u16 != null) return $_u16; return "Fantom"; })($self), sys.Str.type$);
    $self.#aboutProductVer = sys.ObjUtil.coerce(((this$) => { let $_u17 = about.get("productVersion"); if ($_u17 != null) return $_u17; return ObixMod.type$.pod().version().toStr(); })($self), sys.Str.type$);
    $self.#aboutProductUrl = sys.ObjUtil.coerce(((this$) => { let $_u18 = about.get("productUrl"); if ($_u18 != null) return $_u18; return sys.Uri.fromStr("https://fantom.org"); })($self), sys.Uri.type$);
    return;
  }

  onService() {
    let uri = this.req().modRel();
    try {
      let cmd = uri.path().getSafe(0);
      let $_u19 = cmd;
      if (sys.ObjUtil.equals($_u19, null)) {
        this.onLobby();
        return;
      }
      else if (sys.ObjUtil.equals($_u19, "about")) {
        this.onAbout();
        return;
      }
      else if (sys.ObjUtil.equals($_u19, "batch")) {
        this.onBatch();
        return;
      }
      else if (sys.ObjUtil.equals($_u19, "watchService")) {
        this.onWatchService();
        return;
      }
      else if (sys.ObjUtil.equals($_u19, "watch")) {
        this.onWatch();
        return;
      }
      else if (sys.ObjUtil.equals($_u19, "xsl")) {
        this.onXsl();
        return;
      }
      ;
    }
    catch ($_u20) {
      $_u20 = sys.Err.make($_u20);
      if ($_u20 instanceof sys.Err) {
        let e = $_u20;
        ;
        let result = ObixErr.toObj(sys.Str.plus("Internal error: ", e.toStr()), e);
        this.writeResObj(result);
        return;
      }
      else {
        throw $_u20;
      }
    }
    ;
    let result = null;
    try {
      let $_u21 = this.req().method();
      if (sys.ObjUtil.equals($_u21, "GET")) {
        (result = this.onRead(uri));
      }
      else if (sys.ObjUtil.equals($_u21, "PUT")) {
        (result = this.onWrite(uri, this.readReqObj()));
      }
      else if (sys.ObjUtil.equals($_u21, "POST")) {
        (result = this.onInvoke(uri, this.readReqObj()));
      }
      else {
        this.res().sendErr(501);
        return;
      }
      ;
    }
    catch ($_u22) {
      $_u22 = sys.Err.make($_u22);
      if ($_u22 instanceof sys.UnresolvedErr) {
        let e = $_u22;
        ;
        (result = ObixErr.toUnresolvedObj(uri));
      }
      else if ($_u22 instanceof sys.Err) {
        let e = $_u22;
        ;
        (result = ObixErr.toObj(sys.Str.plus("Internal error: ", e.toStr()), e));
      }
      else {
        throw $_u22;
      }
    }
    ;
    this.writeResObj(sys.ObjUtil.coerce(result, ObixObj.type$));
    return;
  }

  onLobby() {
    if (sys.ObjUtil.compareNE(this.req().method(), "GET")) {
      this.res().sendErr(501);
      return;
    }
    ;
    this.writeResObj(this.lobby());
    return;
  }

  onAbout() {
    if (sys.ObjUtil.compareNE(this.req().method(), "GET")) {
      this.res().sendErr(501);
      return;
    }
    ;
    this.writeResObj(this.about());
    return;
  }

  onXsl() {
    let file = ObixMod.type$.pod().file(sys.Uri.fromStr("/res/xsl.xml"));
    web.FileWeblet.make(sys.ObjUtil.coerce(file, sys.File.type$)).onService();
    return;
  }

  onBatch() {
    const this$ = this;
    if (sys.ObjUtil.compareNE(this.req().method(), "POST")) {
      this.res().sendErr(501);
      return;
    }
    ;
    let in$ = this.readReqObj();
    if (sys.ObjUtil.compareNE(in$.elemName(), "list")) {
      this.writeResErr("Expecting BatchIn to be <list>");
      return;
    }
    ;
    let out = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.elemName("list");
      it.contract(Contract.batchOut());
      return;
    }), ObixObj.type$);
    in$.each((opIn) => {
      let opUri = sys.Uri.fromStr("");
      let opOut = null;
      try {
        if (sys.ObjUtil.compareNE(opIn.elemName(), "uri")) {
          throw sys.Err.make("Batch op must be <uri>");
        }
        ;
        (opUri = sys.ObjUtil.as(opIn.val(), sys.Uri.type$));
        if (opUri == null) {
          throw sys.Err.make("Batch op missing <uri> val");
        }
        ;
        let normUri = opUri;
        let uriStr = normUri.toStr();
        let baseStr = this$.req().modBase().toStr();
        if (sys.Str.startsWith(uriStr, baseStr)) {
          (normUri = sys.Str.toUri(sys.Str.getRange(uriStr, sys.Range.make(sys.Str.size(baseStr), -1))));
        }
        ;
        let $_u23 = opIn.contract().toStr();
        if (sys.ObjUtil.equals($_u23, "obix:Read")) {
          (opOut = this$.onRead(sys.ObjUtil.coerce(normUri, sys.Uri.type$)));
        }
        else if (sys.ObjUtil.equals($_u23, "obix:Write")) {
          (opOut = this$.onWrite(sys.ObjUtil.coerce(normUri, sys.Uri.type$), sys.ObjUtil.coerce(opIn.get("in"), ObixObj.type$)));
        }
        else if (sys.ObjUtil.equals($_u23, "obix:Invoke")) {
          (opOut = this$.onInvoke(sys.ObjUtil.coerce(normUri, sys.Uri.type$), sys.ObjUtil.coerce(opIn.get("in"), ObixObj.type$)));
        }
        else {
          (opOut = ObixErr.toObj(sys.Str.plus("Unknown batch op type: ", opIn.contract())));
        }
        ;
      }
      catch ($_u24) {
        $_u24 = sys.Err.make($_u24);
        if ($_u24 instanceof sys.UnresolvedErr) {
          let e = $_u24;
          ;
          (opOut = ObixErr.toUnresolvedObj(sys.ObjUtil.coerce(opUri, sys.Uri.type$)));
        }
        else if ($_u24 instanceof sys.Err) {
          let e = $_u24;
          ;
          (opOut = ObixErr.toObj(sys.Str.plus("Failed: ", opIn), e));
        }
        else {
          throw $_u24;
        }
      }
      ;
      opOut.href(opUri);
      out.add(sys.ObjUtil.coerce(opOut, ObixObj.type$));
      return;
    });
    this.writeResObj(out);
    return;
  }

  onWatchService() {
    let uri = this.req().modRel();
    if (sys.ObjUtil.equals(uri.path().size(), 1)) {
      if (sys.ObjUtil.compareNE(this.req().method(), "GET")) {
        this.res().sendErr(501);
        return;
      }
      ;
      this.writeResObj(this.watchService());
      return;
    }
    ;
    if ((sys.ObjUtil.equals(uri.path().size(), 2) && sys.ObjUtil.equals(uri.path().get(1), "make"))) {
      if (sys.ObjUtil.compareNE(this.req().method(), "POST")) {
        this.res().sendErr(501);
        return;
      }
      ;
      let watch = this.watchOpen();
      this.writeResWatch(watch);
      return;
    }
    ;
    this.writeResUnresolvedErr();
    return;
  }

  onWatch() {
    let uri = this.req().modRel();
    let watch = this.watch(sys.ObjUtil.coerce(((this$) => { let $_u25 = uri.path().getSafe(1); if ($_u25 != null) return $_u25; return "?"; })(this), sys.Str.type$));
    if (watch == null) {
      this.writeResUnresolvedErr();
      return;
    }
    ;
    if (sys.ObjUtil.equals(uri.path().size(), 2)) {
      this.writeResWatch(sys.ObjUtil.coerce(watch, ObixModWatch.type$));
      return;
    }
    ;
    let cmd = ((this$) => { let $_u26 = uri.path().getSafe(2); if ($_u26 != null) return $_u26; return ""; })(this);
    if (sys.ObjUtil.equals(cmd, "pollChanges")) {
      this.onWatchPollChanges(sys.ObjUtil.coerce(watch, ObixModWatch.type$));
      return;
    }
    ;
    if (sys.ObjUtil.equals(cmd, "pollRefresh")) {
      this.onWatchPollRefresh(sys.ObjUtil.coerce(watch, ObixModWatch.type$));
      return;
    }
    ;
    if (sys.ObjUtil.equals(cmd, "lease")) {
      this.onWatchLease(sys.ObjUtil.coerce(watch, ObixModWatch.type$));
      return;
    }
    ;
    if (sys.ObjUtil.equals(cmd, "add")) {
      this.onWatchAdd(sys.ObjUtil.coerce(watch, ObixModWatch.type$));
      return;
    }
    ;
    if (sys.ObjUtil.equals(cmd, "remove")) {
      this.onWatchRemove(sys.ObjUtil.coerce(watch, ObixModWatch.type$));
      return;
    }
    ;
    if (sys.ObjUtil.equals(cmd, "delete")) {
      this.onWatchDelete(sys.ObjUtil.coerce(watch, ObixModWatch.type$));
      return;
    }
    ;
    this.writeResUnresolvedErr();
    return;
  }

  onWatchLease(watch) {
    const this$ = this;
    if (sys.ObjUtil.equals(this.req().method(), "PUT")) {
      let val = this.readReqObj().val();
      if (!sys.ObjUtil.is(val, sys.Duration.type$)) {
        throw sys.Err.make(sys.Str.plus("Expected lease val to be reltime, not ", val));
      }
      ;
      watch.lease(sys.ObjUtil.coerce(val, sys.Duration.type$));
    }
    ;
    if ((sys.ObjUtil.equals(this.req().method(), "GET") || sys.ObjUtil.equals(this.req().method(), "PUT"))) {
      this.writeResObj(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("lease");
        it.href(this$.watchUri(watch).plus(sys.Uri.fromStr("lease")));
        it.val(watch.lease());
        return;
      }), ObixObj.type$));
      return;
    }
    ;
    this.res().sendErr(501);
    return;
  }

  onWatchAdd(watch) {
    if (sys.ObjUtil.compareNE(this.req().method(), "POST")) {
      this.res().sendErr(501);
      return;
    }
    ;
    let uris = this.readWatchIn();
    let objs = watch.add(uris);
    this.writeWatchOut(objs);
    return;
  }

  onWatchRemove(watch) {
    const this$ = this;
    if (sys.ObjUtil.compareNE(this.req().method(), "POST")) {
      this.res().sendErr(501);
      return;
    }
    ;
    let uris = this.readWatchIn();
    watch.remove(uris);
    this.writeResObj(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.val(sys.Str.plus("Watch removed: ", sys.ObjUtil.coerce(uris.size(), sys.Obj.type$.toNullable())));
      return;
    }), ObixObj.type$));
    return;
  }

  onWatchPollChanges(watch) {
    if (sys.ObjUtil.compareNE(this.req().method(), "POST")) {
      this.res().sendErr(501);
      return;
    }
    ;
    this.readReqObj();
    let objs = watch.pollChanges();
    this.writeWatchOut(objs);
    return;
  }

  onWatchPollRefresh(watch) {
    if (sys.ObjUtil.compareNE(this.req().method(), "POST")) {
      this.res().sendErr(501);
      return;
    }
    ;
    this.readReqObj();
    let objs = watch.pollRefresh();
    this.writeWatchOut(objs);
    return;
  }

  onWatchDelete(watch) {
    const this$ = this;
    if (sys.ObjUtil.compareNE(this.req().method(), "POST")) {
      this.res().sendErr(501);
      return;
    }
    ;
    watch.delete();
    this.writeResObj(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.val(sys.Str.plus("Watch deleted: ", watch.id()));
      return;
    }), ObixObj.type$));
    return;
  }

  readWatchIn() {
    const this$ = this;
    let obj = this.readReqObj();
    let list = obj.get("hrefs");
    if (sys.ObjUtil.compareNE(list.elemName(), "list")) {
      throw sys.Err.make("Expecting WatchIn.hrefs to be <list>");
    }
    ;
    let acc = sys.List.make(sys.Uri.type$);
    list.each((kid) => {
      let uri = sys.ObjUtil.as(kid.val(), sys.Uri.type$);
      if (uri == null) {
        throw sys.Err.make("Expecting WatchIn child to be <uri>");
      }
      ;
      acc.add(sys.ObjUtil.coerce(uri, sys.Uri.type$));
      return;
    });
    return acc;
  }

  writeWatchOut(objs) {
    const this$ = this;
    let list = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.elemName("list");
      it.name("values");
      return;
    }), ObixObj.type$);
    objs.each((obj) => {
      if (obj.href() == null) {
        throw sys.Err.make(sys.Str.plus("Watched obj missing href: ", obj));
      }
      ;
      list.add(obj);
      return;
    });
    this.writeResObj(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.contract(Contract.watchOut());
      it.href(this$.req().absUri().plus(this$.req().modBase()));
      it.add(list);
      return;
    }), ObixObj.type$));
    return;
  }

  writeResWatch(watch) {
    let obj = watch.toObixObj();
    obj.href(this.watchUri(watch));
    this.writeResObj(obj);
    return;
  }

  watchUri(watch) {
    return this.req().modBase().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("watch/", watch.id()), "/")));
  }

  readReqObj() {
    let str = this.req().in().readAllStr();
    return ObixObj.readXml(sys.Str.in(str));
  }

  writeResObj(obj) {
    let buf = sys.Buf.make();
    let out = buf.out();
    out.print("<?xml version='1.0' encoding='UTF-8'?>\n");
    out.print("<?xml-stylesheet type='text/xsl' href='").print(this.req().modBase()).print("xsl'?>\n");
    obj.writeXml(out);
    buf.flip();
    this.res().headers().set("Content-Type", "text/xml");
    this.res().headers().set("Content-Length", sys.Int.toStr(buf.size()));
    sys.ObjUtil.coerce(this.res().out().writeBuf(sys.ObjUtil.coerce(buf, sys.Buf.type$)), web.WebOutStream.type$).flush();
    return;
  }

  writeResErr(msg,cause) {
    if (cause === undefined) cause = null;
    this.writeResObj(ObixErr.toObj(msg, cause));
    return;
  }

  writeResUnresolvedErr() {
    this.writeResObj(ObixErr.toUnresolvedObj(this.req().modRel()));
    return;
  }

  lobby() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.href(this$.req().absUri().plusSlash());
      it.contract(Contract.lobby());
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("ref");
        it.name("about");
        it.href(sys.Uri.fromStr("about/"));
        it.contract(Contract.about());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("op");
        it.name("batch");
        it.href(sys.Uri.fromStr("batch/"));
        it.in(Contract.batchIn());
        it.out(Contract.batchOut());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("ref");
        it.name("watchService");
        it.href(sys.Uri.fromStr("watchService/"));
        it.contract(Contract.watchService());
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$);
  }

  about() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.href(this$.req().absUri().plusSlash());
      it.contract(Contract.about());
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("obixVersion");
        it.val("1.1");
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("serverName");
        it.val(this$.#aboutServerName);
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("serverTime");
        it.val(sys.DateTime.now());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("serverBootTime");
        it.val(sys.DateTime.boot());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("vendorName");
        it.val(this$.#aboutVendorName);
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("vendorUrl");
        it.val(this$.#aboutVendorUrl);
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("productName");
        it.val(this$.#aboutProductName);
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("productVersion");
        it.val(this$.#aboutProductVer);
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("productUrl");
        it.val(this$.#aboutProductUrl);
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("tz");
        it.val(sys.TimeZone.cur().fullName());
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$);
  }

  watchService() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.href(this$.req().absUri().plusSlash());
      it.contract(Contract.watchService());
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("op");
        it.name("make");
        it.href(sys.Uri.fromStr("make/"));
        it.out(Contract.watch());
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$);
  }

}

class ObixModWatch extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixModWatch.type$; }

  #lease = null;

  lease(it) {
    if (it === undefined) {
    }
    else {
    }
  }

  toObixObj() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.elemName("obj");
      it.contract(Contract.watch());
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("reltime");
        it.name("lease");
        it.href(sys.Uri.fromStr("lease"));
        it.val(this$.lease());
        it.writable(false);
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("op");
        it.name("add");
        it.href(sys.Uri.fromStr("add"));
        it.in(Contract.watchIn());
        it.out(Contract.watchOut());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("op");
        it.name("remove");
        it.href(sys.Uri.fromStr("remove"));
        it.in(Contract.watchIn());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("op");
        it.name("pollChanges");
        it.href(sys.Uri.fromStr("pollChanges"));
        it.out(Contract.watchOut());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("op");
        it.name("pollRefresh");
        it.href(sys.Uri.fromStr("pollRefresh"));
        it.out(Contract.watchOut());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("op");
        it.name("delete");
        it.href(sys.Uri.fromStr("delete"));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$);
  }

  toStr() {
    return sys.Str.plus("ObixModWatch ", this.id());
  }

  static make() {
    const $self = new ObixModWatch();
    ObixModWatch.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class ObixClient extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#log = sys.Log.get("obix");
    this.#socketConfig = inet.SocketConfig.cur();
    this.#cookies = sys.ObjUtil.coerce(web.Cookie.type$.emptyList(), sys.Type.find("web::Cookie[]"));
    return;
  }

  typeof() { return ObixClient.type$; }

  #lobbyUri = null;

  lobbyUri() { return this.#lobbyUri; }

  __lobbyUri(it) { if (it === undefined) return this.#lobbyUri; else this.#lobbyUri = it; }

  #aboutUri = null;

  aboutUri(it) {
    if (it === undefined) {
      return this.#aboutUri;
    }
    else {
      this.#aboutUri = it;
      return;
    }
  }

  #batchUri = null;

  batchUri(it) {
    if (it === undefined) {
      return this.#batchUri;
    }
    else {
      this.#batchUri = it;
      return;
    }
  }

  #watchServiceUri = null;

  watchServiceUri(it) {
    if (it === undefined) {
      return this.#watchServiceUri;
    }
    else {
      this.#watchServiceUri = it;
      return;
    }
  }

  static #debugCounter = undefined;

  static debugCounter() {
    if (ObixClient.#debugCounter === undefined) {
      ObixClient.static$init();
      if (ObixClient.#debugCounter === undefined) ObixClient.#debugCounter = null;
    }
    return ObixClient.#debugCounter;
  }

  #log = null;

  log(it) {
    if (it === undefined) {
      return this.#log;
    }
    else {
      this.#log = it;
      return;
    }
  }

  #socketConfig = null;

  socketConfig(it) {
    if (it === undefined) {
      return this.#socketConfig;
    }
    else {
      this.#socketConfig = it;
      return;
    }
  }

  #authHeaders = null;

  // private field reflection only
  __authHeaders(it) { if (it === undefined) return this.#authHeaders; else this.#authHeaders = it; }

  #watchServiceMakeUri = null;

  // private field reflection only
  __watchServiceMakeUri(it) { if (it === undefined) return this.#watchServiceMakeUri; else this.#watchServiceMakeUri = it; }

  #cookies = null;

  // private field reflection only
  __cookies(it) { if (it === undefined) return this.#cookies; else this.#cookies = it; }

  static makeBasicAuth(lobby,username,password) {
    return ObixClient.make(lobby, sys.Map.__fromLiteral(["Authorization"], [sys.Str.plus("Basic ", sys.Str.toBuf(sys.Str.plus(sys.Str.plus(sys.Str.plus("", username), ":"), password)).toBase64())], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
  }

  static make(lobby,authHeaders) {
    const $self = new ObixClient();
    ObixClient.make$($self,lobby,authHeaders);
    return $self;
  }

  static make$($self,lobby,authHeaders) {
    ;
    $self.#lobbyUri = lobby.plusSlash();
    $self.#authHeaders = authHeaders;
    return;
  }

  readLobby() {
    let lobby = this.read(this.#lobbyUri);
    this.#aboutUri = ((this$) => { let $_u27=lobby.get("about", false); return ($_u27==null) ? null : $_u27.href(); })(this);
    this.#batchUri = ((this$) => { let $_u28=lobby.get("batch", false); return ($_u28==null) ? null : $_u28.href(); })(this);
    this.#watchServiceUri = ((this$) => { let $_u29=lobby.get("watchService", false); return ($_u29==null) ? null : $_u29.href(); })(this);
    return lobby;
  }

  readAbout() {
    if (this.#aboutUri == null) {
      throw sys.Err.make("aboutUri not set");
    }
    ;
    return this.read(sys.ObjUtil.coerce(this.#aboutUri, sys.Uri.type$));
  }

  batchRead(uris) {
    const this$ = this;
    if (this.#batchUri == null) {
      throw sys.Err.make("batchUri not set");
    }
    ;
    if (uris.isEmpty()) {
      return sys.List.make(ObixObj.type$);
    }
    ;
    if (sys.ObjUtil.equals(uris.size(), 1)) {
      return sys.List.make(ObixObj.type$, [this.read(uris.get(0))]);
    }
    ;
    let in$ = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.elemName("list");
      it.contract(Contract.batchIn());
      return;
    }), ObixObj.type$);
    let baseUri = this.#lobbyUri.pathOnly();
    uris.each((uri) => {
      in$.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("uri");
        it.contract(Contract.read());
        it.val(baseUri.plus(uri));
        return;
      }), ObixObj.type$));
      return;
    });
    let out = this.invoke(sys.ObjUtil.coerce(this.#batchUri, sys.Uri.type$), in$);
    if (sys.ObjUtil.equals(out.elemName(), "err")) {
      throw sys.Err.make(out.toStr());
    }
    ;
    return out.list();
  }

  watchOpen() {
    if (this.#watchServiceUri == null) {
      throw sys.Err.make("watchService is not avaialble");
    }
    ;
    if (this.#watchServiceMakeUri == null) {
      let service = this.read(sys.ObjUtil.coerce(this.#watchServiceUri, sys.Uri.type$));
      let makeOp = service.get("make");
      if (makeOp.href() == null) {
        throw sys.Err.make("WatchService.make missing href");
      }
      ;
      this.#watchServiceMakeUri = this.#watchServiceUri.plus(sys.ObjUtil.coerce(makeOp.href(), sys.Uri.type$));
    }
    ;
    let watch = this.invoke(sys.ObjUtil.coerce(this.#watchServiceMakeUri, sys.Uri.type$), ObixObj.make());
    return ObixClientWatch.make(this, watch);
  }

  read(uri) {
    return this.send(uri, "GET", null);
  }

  write(obj) {
    return this.send(sys.ObjUtil.coerce(obj.href(), sys.Uri.type$), "PUT", obj);
  }

  invoke(uri,in$) {
    return this.send(uri, "POST", in$);
  }

  send(uri,method,in$) {
    (uri = this.#lobbyUri.plus(uri));
    let c = web.WebClient.make(uri);
    c.reqMethod(method);
    c.followRedirects(false);
    c.socketConfig(this.#socketConfig);
    c.reqHeaders().setAll(this.#authHeaders);
    c.cookies(this.#cookies);
    if (in$ != null) {
      c.reqHeaders().set("Content-Type", "text/xml; charset=utf-8");
    }
    ;
    if (this.#log.isDebug()) {
      let req = "";
      if (in$ != null) {
        let reqBuf = sys.StrBuf.make();
        in$.writeXml(reqBuf.out());
        (req = reqBuf.toStr());
      }
      ;
      let debugId = this.debugReq(c, req);
      c.writeReq();
      if (!sys.Str.isEmpty(req)) {
        c.reqOut().print(req).close();
      }
      ;
      c.readRes();
      if (sys.ObjUtil.equals(c.resCode(), 100)) {
        c.readRes();
      }
      ;
      let res = ((this$) => { if (sys.ObjUtil.equals(c.resCode(), 200)) return c.resIn().readAllStr(); return ""; })(this);
      this.debugRes(debugId, c, res);
      return this.readResObj(c, sys.Str.in(res));
    }
    else {
      c.writeReq();
      if (in$ != null) {
        in$.writeXml(c.reqOut());
        c.reqOut().close();
      }
      ;
      c.readRes();
      if (sys.ObjUtil.equals(c.resCode(), 100)) {
        c.readRes();
      }
      ;
      return this.readResObj(c, c.resIn());
    }
    ;
  }

  readResObj(c,in$) {
    if (sys.ObjUtil.compareNE(c.resCode(), 200)) {
      throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Bad HTTP response: ", sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable())), " "), c.resPhrase()), " ["), c.reqUri()), "]"));
    }
    ;
    this.#cookies = c.cookies();
    let obj = ObixObj.readXml(in$);
    if (sys.ObjUtil.equals(obj.elemName(), "err")) {
      throw sys.ObjUtil.coerce(ObixErr.make(obj), sys.Err.type$);
    }
    ;
    return obj;
  }

  debugReq(c,req) {
    const this$ = this;
    if (!this.#log.isDebug()) {
      return 0;
    }
    ;
    let debugId = ObixClient.debugCounter().getAndIncrement();
    let s = sys.StrBuf.make();
    s.add(sys.Str.plus(sys.Str.plus("> [", sys.ObjUtil.coerce(debugId, sys.Obj.type$.toNullable())), "]\n"));
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", c.reqMethod()), " "), c.reqUri()), "\n"));
    c.reqHeaders().each((v,n) => {
      s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", n), ": "), v), "\n"));
      return;
    });
    s.add(sys.Str.trimEnd(req)).add("\n");
    this.#log.debug(s.toStr());
    return debugId;
  }

  debugRes(debugId,c,res) {
    const this$ = this;
    if (!this.#log.isDebug()) {
      return;
    }
    ;
    let s = sys.StrBuf.make();
    s.add(sys.Str.plus(sys.Str.plus("< [", sys.ObjUtil.coerce(debugId, sys.Obj.type$.toNullable())), "]\n"));
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable())), " "), c.resPhrase()), "\n"));
    c.resHeaders().each((v,n) => {
      s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", n), ": "), v), "\n"));
      return;
    });
    s.add(sys.Str.trimEnd(res)).add("\n");
    this.#log.debug(s.toStr());
    return;
  }

  static main(args) {
    const this$ = this;
    let c = ObixClient.makeBasicAuth(sys.Str.toUri(args.get(0)), args.get(1), args.get(2));
    c.#log.level(sys.LogLevel.debug());
    c.readLobby();
    sys.Int.times(3, (i) => {
      sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("------ ", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), " ------"));
      let about = c.readAbout();
      sys.ObjUtil.echo();
      sys.ObjUtil.echo(about.trap("serverName", sys.List.make(sys.Obj.type$.toNullable(), [])));
      sys.ObjUtil.echo(about.trap("vendorName", sys.List.make(sys.Obj.type$.toNullable(), [])));
      sys.ObjUtil.echo(about.trap("productName", sys.List.make(sys.Obj.type$.toNullable(), [])));
      sys.ObjUtil.echo(about.trap("productVersion", sys.List.make(sys.Obj.type$.toNullable(), [])));
      sys.ObjUtil.echo();
      return;
    });
    return;
  }

  static static$init() {
    ObixClient.#debugCounter = concurrent.AtomicInt.make();
    return;
  }

}

class ObixClientWatch extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixClientWatch.type$; }

  #client = null;

  client() {
    return this.#client;
  }

  #lease = null;

  lease(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(((this$) => { let $_u31 = sys.ObjUtil.as(this$.#client.read(this$.#leaseUri).val(), sys.Duration.type$); if ($_u31 != null) return $_u31; throw sys.Err.make("Invalid lease val"); })(this), sys.Duration.type$);
    }
    else {
      const this$ = this;
      let newVal = it;
      this.#client.write(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.href(this$.#leaseUri);
        it.val(newVal);
        return;
      }), ObixObj.type$));
      return;
    }
  }

  #uri = null;

  // private field reflection only
  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #leaseUri = null;

  // private field reflection only
  __leaseUri(it) { if (it === undefined) return this.#leaseUri; else this.#leaseUri = it; }

  #addUri = null;

  // private field reflection only
  __addUri(it) { if (it === undefined) return this.#addUri; else this.#addUri = it; }

  #removeUri = null;

  // private field reflection only
  __removeUri(it) { if (it === undefined) return this.#removeUri; else this.#removeUri = it; }

  #pollChangesUri = null;

  // private field reflection only
  __pollChangesUri(it) { if (it === undefined) return this.#pollChangesUri; else this.#pollChangesUri = it; }

  #pollRefreshUri = null;

  // private field reflection only
  __pollRefreshUri(it) { if (it === undefined) return this.#pollRefreshUri; else this.#pollRefreshUri = it; }

  #deleteUri = null;

  // private field reflection only
  __deleteUri(it) { if (it === undefined) return this.#deleteUri; else this.#deleteUri = it; }

  static make(client,obj) {
    const $self = new ObixClientWatch();
    ObixClientWatch.make$($self,client,obj);
    return $self;
  }

  static make$($self,client,obj) {
    if (obj.href() == null) {
      throw sys.Err.make(sys.Str.plus("Server returned Watch without href: ", obj));
    }
    ;
    $self.#client = client;
    $self.#uri = sys.ObjUtil.coerce(obj.href(), sys.Uri.type$);
    $self.#leaseUri = $self.childUri(obj, "lease", "reltime");
    $self.#addUri = $self.childUri(obj, "add", "op");
    $self.#removeUri = $self.childUri(obj, "remove", "op");
    $self.#pollChangesUri = $self.childUri(obj, "pollChanges", "op");
    $self.#pollRefreshUri = $self.childUri(obj, "pollRefresh", "op");
    $self.#deleteUri = $self.childUri(obj, "delete", "op");
    return;
  }

  childUri(obj,name,elem) {
    let child = obj.get(name);
    if (sys.ObjUtil.compareNE(child.elemName(), elem)) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expecting Watch.", name), " to be "), elem), ", not "), child.elemName()));
    }
    ;
    if (child.href() == null) {
      throw sys.Err.make(sys.Str.plus("Missing href for Watch.", name));
    }
    ;
    return this.#uri.plus(sys.ObjUtil.coerce(child.href(), sys.Uri.type$));
  }

  add(uris) {
    if (uris.isEmpty()) {
      return sys.List.make(ObixObj.type$);
    }
    ;
    return this.fromWatchOut(this.#client.invoke(this.#addUri, this.toWatchIn(uris)));
  }

  remove(uris) {
    if (uris.isEmpty()) {
      return;
    }
    ;
    this.#client.invoke(this.#removeUri, this.toWatchIn(uris));
    return;
  }

  pollChanges() {
    return this.fromWatchOut(this.#client.invoke(this.#pollChangesUri, this.nullArg()));
  }

  pollRefresh() {
    return this.fromWatchOut(this.#client.invoke(this.#pollRefreshUri, this.nullArg()));
  }

  close() {
    this.#client.invoke(this.#deleteUri, this.nullArg());
    return;
  }

  nullArg() {
    return ObixObj.make();
  }

  toWatchIn(uris) {
    const this$ = this;
    let list = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.elemName("list");
      it.name("hrefs");
      return;
    }), ObixObj.type$);
    uris.each((uri) => {
      list.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.val(uri);
        return;
      }), ObixObj.type$));
      return;
    });
    return sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.contract(Contract.watchIn());
      it.add(list);
      return;
    }), ObixObj.type$);
  }

  fromWatchOut(res) {
    let list = res.get("values");
    if (sys.ObjUtil.compareNE(list.elemName(), "list")) {
      throw sys.Err.make(sys.Str.plus("Expecting WatchOut.list to be <list>: ", list));
    }
    ;
    return list.list();
  }

}

class ObixXmlParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixXmlParser.type$; }

  #xparser = null;

  xparser(it) {
    if (it === undefined) {
      return this.#xparser;
    }
    else {
      this.#xparser = it;
      return;
    }
  }

  static make(in$) {
    const $self = new ObixXmlParser();
    ObixXmlParser.make$($self,in$);
    return $self;
  }

  static make$($self,in$) {
    $self.#xparser = xml.XParser.make(in$);
    return;
  }

  parse(close) {
    if (close === undefined) close = true;
    try {
      this.#xparser.next();
      while (this.#xparser.nodeType() === xml.XNodeType.pi()) {
        this.#xparser.next();
      }
      ;
      return this.parseObj();
    }
    finally {
      if (close) {
        this.#xparser.close();
      }
      ;
    }
    ;
  }

  parseObj() {
    const this$ = this;
    if (this.#xparser.nodeType() !== xml.XNodeType.elemStart()) {
      throw this.err(sys.Str.plus("Expected element start not ", this.#xparser.nodeType()));
    }
    ;
    let elem = this.#xparser.elem();
    let obj = ObixObj.make();
    obj.elemName(elem.name());
    elem.eachAttr((attr) => {
      this$.parseAttr(obj, sys.ObjUtil.coerce(elem, xml.XElem.type$), attr);
      return;
    });
    this.#xparser.next();
    while (this.#xparser.nodeType() !== xml.XNodeType.elemEnd()) {
      if (this.#xparser.nodeType() === xml.XNodeType.pi()) {
        this.#xparser.next();
        continue;
      }
      ;
      if (!sys.ObjUtil.coerce(ObixUtil.elemNames().get(this.#xparser.elem().name()), sys.Bool.type$)) {
        this.#xparser.skip();
        this.#xparser.next();
        continue;
      }
      ;
      try {
        obj.add(this.parseObj());
      }
      catch ($_u32) {
        $_u32 = sys.Err.make($_u32);
        if ($_u32 instanceof sys.ArgErr) {
          let e = $_u32;
          ;
          throw this.err(e.toStr());
        }
        else {
          throw $_u32;
        }
      }
      ;
    }
    ;
    this.#xparser.next();
    if (obj.val() == null) {
      let defVal = ObixUtil.elemNameToDefaultVal().get(obj.elemName());
      if (defVal === ObixUtil.defaultsToNull()) {
        obj.isNull(true);
      }
      else {
        obj.val(defVal);
      }
      ;
    }
    ;
    return obj;
  }

  parseAttr(obj,elem,attr) {
    try {
      let $_u33 = attr.name();
      if (sys.ObjUtil.equals($_u33, "name")) {
        obj.name(attr.val());
      }
      else if (sys.ObjUtil.equals($_u33, "href")) {
        obj.href(ObixUtil.parseUri(attr.val()));
      }
      else if (sys.ObjUtil.equals($_u33, "is")) {
        obj.contract(sys.ObjUtil.coerce(Contract.fromStr(attr.val()), Contract.type$));
      }
      else if (sys.ObjUtil.equals($_u33, "of")) {
        obj.of(Contract.fromStr(attr.val()));
      }
      else if (sys.ObjUtil.equals($_u33, "in")) {
        obj.in(Contract.fromStr(attr.val()));
      }
      else if (sys.ObjUtil.equals($_u33, "out")) {
        obj.out(Contract.fromStr(attr.val()));
      }
      else if (sys.ObjUtil.equals($_u33, "val")) {
        this.parseVal(obj, attr.val(), elem);
      }
      else if (sys.ObjUtil.equals($_u33, "null")) {
        obj.isNull(sys.ObjUtil.coerce(sys.Str.toBool(attr.val()), sys.Bool.type$));
      }
      else if (sys.ObjUtil.equals($_u33, "displayName")) {
        obj.displayName(attr.val());
      }
      else if (sys.ObjUtil.equals($_u33, "display")) {
        obj.display(attr.val());
      }
      else if (sys.ObjUtil.equals($_u33, "icon")) {
        obj.icon(ObixUtil.parseUri(attr.val()));
      }
      else if (sys.ObjUtil.equals($_u33, "min")) {
        obj.min(this.parseMinMax(attr.val(), elem));
      }
      else if (sys.ObjUtil.equals($_u33, "max")) {
        obj.max(this.parseMinMax(attr.val(), elem));
      }
      else if (sys.ObjUtil.equals($_u33, "range")) {
        obj.range(ObixUtil.parseUri(attr.val()));
      }
      else if (sys.ObjUtil.equals($_u33, "precision")) {
        obj.precision(sys.Str.toInt(attr.val()));
      }
      else if (sys.ObjUtil.equals($_u33, "status")) {
        obj.status(sys.ObjUtil.coerce(Status.fromStr(attr.val()), Status.type$));
      }
      else if (sys.ObjUtil.equals($_u33, "tz")) {
        if (obj.tz() == null) {
          obj.tz(this.parseTimeZone(attr.val()));
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u33, "unit")) {
        if (sys.Str.startsWith(attr.val(), "obix:units/")) {
          obj.unit(sys.Unit.fromStr(sys.Str.replace(sys.Str.getRange(attr.val(), sys.Range.make(11, -1)), " ", "_"), false));
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u33, "writable")) {
        obj.writable(sys.ObjUtil.coerce(sys.Str.toBool(attr.val()), sys.Bool.type$));
      }
      ;
    }
    catch ($_u34) {
      $_u34 = sys.Err.make($_u34);
      if ($_u34 instanceof xml.XErr) {
        let e = $_u34;
        ;
        throw e;
      }
      else if ($_u34 instanceof sys.Err) {
        let e = $_u34;
        ;
        throw this.err(sys.Str.plus(sys.Str.plus("Cannot parse attribute '", attr.name()), "'"), e);
      }
      else {
        throw $_u34;
      }
    }
    ;
    return;
  }

  parseVal(obj,valStr,elem) {
    let func = ObixUtil.elemNameToFromStrFunc().get(elem.name());
    if ((func == null && sys.ObjUtil.equals(obj.elemName(), "obj"))) {
      obj.elemName("str");
      obj.val(valStr);
      return;
    }
    ;
    try {
      obj.val(sys.Func.call(func, valStr, elem));
    }
    catch ($_u35) {
      $_u35 = sys.Err.make($_u35);
      if ($_u35 instanceof sys.Err) {
        let e = $_u35;
        ;
        throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot parse <", elem.name()), "> value: "), sys.Str.toCode(valStr)), e);
      }
      else {
        throw $_u35;
      }
    }
    ;
    return;
  }

  parseMinMax(valStr,elem) {
    let func = ObixUtil.elemNameToMinMaxFunc().get(elem.name());
    if (func == null) {
      throw this.err(sys.Str.plus(sys.Str.plus("Element <", elem.name()), "> cannot have val min/max"));
    }
    ;
    try {
      return sys.Func.call(func, valStr, elem);
    }
    catch ($_u36) {
      $_u36 = sys.Err.make($_u36);
      if ($_u36 instanceof sys.Err) {
        let e = $_u36;
        ;
        throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot parse <", elem.name()), "> min/max: "), sys.Str.toCode(valStr)), e);
      }
      else {
        throw $_u36;
      }
    }
    ;
  }

  parseTimeZone(str) {
    return ((this$) => { let $_u37 = ObixUtil.tzSwizzles().get(str); if ($_u37 != null) return $_u37; return sys.TimeZone.fromStr(str); })(this);
  }

  err(msg,cause) {
    if (cause === undefined) cause = null;
    return xml.XErr.make(msg, this.#xparser.line(), this.#xparser.col(), cause);
  }

}

class ObixErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixErr.type$; }

  #contract = null;

  contract() { return this.#contract; }

  __contract(it) { if (it === undefined) return this.#contract; else this.#contract = it; }

  #display = null;

  display() { return this.#display; }

  __display(it) { if (it === undefined) return this.#display; else this.#display = it; }

  static toObj(msg,cause) {
    if (cause === undefined) cause = null;
    const this$ = this;
    let obj = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.elemName("err");
      it.display(msg);
      return;
    }), ObixObj.type$);
    if (cause != null) {
      obj.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("str");
        it.name("trace");
        it.val(cause.traceToStr());
        return;
      }), ObixObj.type$));
    }
    ;
    return obj;
  }

  static toUnresolvedObj(uri) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.elemName("err");
      it.display(sys.Str.plus("Unresolved uri: ", uri));
      it.href(uri);
      it.contract(Contract.badUriErr());
      return;
    }), ObixObj.type$);
  }

  static make(obj) {
    return ObixErr.doMake(obj.contract(), sys.ObjUtil.coerce(((this$) => { let $_u38 = obj.display(); if ($_u38 != null) return $_u38; return ""; })(this), sys.Str.type$));
  }

  static doMake(contract,display) {
    const $self = new ObixErr();
    ObixErr.doMake$($self,contract,display);
    return $self;
  }

  static doMake$($self,contract,display) {
    sys.Err.make$($self, sys.Str.plus(sys.Str.plus(sys.Str.plus("", contract), ": "), display));
    $self.#contract = contract;
    $self.#display = display;
    return;
  }

  isBadUri() {
    return this.#contract.uris().contains(sys.Uri.fromStr("obix:BadUriErr"));
  }

}

class ObixUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixUtil.type$; }

  static #elemNames = undefined;

  static elemNames() {
    if (ObixUtil.#elemNames === undefined) {
      ObixUtil.static$init();
      if (ObixUtil.#elemNames === undefined) ObixUtil.#elemNames = null;
    }
    return ObixUtil.#elemNames;
  }

  static #valTypeToElemName = undefined;

  static valTypeToElemName() {
    if (ObixUtil.#valTypeToElemName === undefined) {
      ObixUtil.static$init();
      if (ObixUtil.#valTypeToElemName === undefined) ObixUtil.#valTypeToElemName = null;
    }
    return ObixUtil.#valTypeToElemName;
  }

  static #elemNameToValType = undefined;

  static elemNameToValType() {
    if (ObixUtil.#elemNameToValType === undefined) {
      ObixUtil.static$init();
      if (ObixUtil.#elemNameToValType === undefined) ObixUtil.#elemNameToValType = null;
    }
    return ObixUtil.#elemNameToValType;
  }

  static #valTypeToStrFunc = undefined;

  static valTypeToStrFunc() {
    if (ObixUtil.#valTypeToStrFunc === undefined) {
      ObixUtil.static$init();
      if (ObixUtil.#valTypeToStrFunc === undefined) ObixUtil.#valTypeToStrFunc = null;
    }
    return ObixUtil.#valTypeToStrFunc;
  }

  static #elemNameToFromStrFunc = undefined;

  static elemNameToFromStrFunc() {
    if (ObixUtil.#elemNameToFromStrFunc === undefined) {
      ObixUtil.static$init();
      if (ObixUtil.#elemNameToFromStrFunc === undefined) ObixUtil.#elemNameToFromStrFunc = null;
    }
    return ObixUtil.#elemNameToFromStrFunc;
  }

  static #elemNameToMinMaxFunc = undefined;

  static elemNameToMinMaxFunc() {
    if (ObixUtil.#elemNameToMinMaxFunc === undefined) {
      ObixUtil.static$init();
      if (ObixUtil.#elemNameToMinMaxFunc === undefined) ObixUtil.#elemNameToMinMaxFunc = null;
    }
    return ObixUtil.#elemNameToMinMaxFunc;
  }

  static #tzSwizzles = undefined;

  static tzSwizzles() {
    if (ObixUtil.#tzSwizzles === undefined) {
      ObixUtil.static$init();
      if (ObixUtil.#tzSwizzles === undefined) ObixUtil.#tzSwizzles = null;
    }
    return ObixUtil.#tzSwizzles;
  }

  static #defaultsToNull = undefined;

  static defaultsToNull() {
    if (ObixUtil.#defaultsToNull === undefined) {
      ObixUtil.static$init();
      if (ObixUtil.#defaultsToNull === undefined) ObixUtil.#defaultsToNull = null;
    }
    return ObixUtil.#defaultsToNull;
  }

  static #elemNameToDefaultVal = undefined;

  static elemNameToDefaultVal() {
    if (ObixUtil.#elemNameToDefaultVal === undefined) {
      ObixUtil.static$init();
      if (ObixUtil.#elemNameToDefaultVal === undefined) ObixUtil.#elemNameToDefaultVal = null;
    }
    return ObixUtil.#elemNameToDefaultVal;
  }

  static valToStr(val) {
    if (val == null) {
      return "null";
    }
    ;
    let func = ObixUtil.valTypeToStrFunc().get(sys.Type.of(sys.ObjUtil.coerce(val, sys.Obj.type$)));
    if (func != null) {
      return sys.Func.call(func, sys.ObjUtil.coerce(val, sys.Obj.type$));
    }
    ;
    return sys.ObjUtil.toStr(val);
  }

  static parseUri(s) {
    try {
      return sys.ObjUtil.coerce(sys.Uri.decode(s), sys.Uri.type$);
    }
    catch ($_u39) {
      $_u39 = sys.Err.make($_u39);
      if ($_u39 instanceof sys.Err) {
        let e = $_u39;
        ;
      }
      else {
        throw $_u39;
      }
    }
    ;
    return sys.ObjUtil.coerce(sys.Uri.fromStr(s), sys.Uri.type$);
  }

  static parseAbstime(s,elem) {
    try {
      let year = sys.Str.toInt(sys.Str.getRange(s, sys.Range.make(0, 3)));
      if (sys.ObjUtil.compareLT(year, 1901)) {
        (s = sys.Str.plus("1901", sys.Str.getRange(s, sys.Range.make(4, -1))));
      }
      else {
        if (sys.ObjUtil.compareGT(year, 2099)) {
          (s = sys.Str.plus("2099", sys.Str.getRange(s, sys.Range.make(4, -1))));
        }
        ;
      }
      ;
    }
    catch ($_u40) {
    }
    ;
    let tz = elem.get("tz", false);
    if (tz == null) {
      return sys.ObjUtil.coerce(sys.DateTime.fromIso(s, true), sys.DateTime.type$);
    }
    ;
    let swizzle = ObixUtil.tzSwizzles().get(sys.ObjUtil.coerce(tz, sys.Str.type$));
    if (swizzle != null) {
      (tz = swizzle.name());
    }
    ;
    return sys.ObjUtil.coerce(sys.DateTime.fromStr(sys.Str.plus(sys.Str.plus(sys.Str.plus("", s), " "), tz), true), sys.DateTime.type$);
  }

  static make() {
    const $self = new ObixUtil();
    ObixUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    const this$ = this;
    ObixUtil.#elemNames = sys.ObjUtil.coerce(((this$) => { let $_u41 = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral(["obj","bool","int","real","str","enum","uri","abstime","reltime","date","time","list","op","feed","ref","err"], [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")), (it) => {
      it.def(sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()));
      return;
    }), sys.Type.find("[sys::Str:sys::Bool]")); if ($_u41 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral(["obj","bool","int","real","str","enum","uri","abstime","reltime","date","time","list","op","feed","ref","err"], [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")), (it) => {
      it.def(sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()));
      return;
    }), sys.Type.find("[sys::Str:sys::Bool]"))); })(this), sys.Type.find("[sys::Str:sys::Bool]"));
    ObixUtil.#valTypeToElemName = sys.ObjUtil.coerce(((this$) => { let $_u42 = sys.Map.__fromLiteral([sys.Bool.type$,sys.Int.type$,sys.Float.type$,sys.Str.type$,sys.Uri.type$,sys.DateTime.type$,sys.Duration.type$,sys.Date.type$,sys.Time.type$], ["bool","int","real","str","uri","abstime","reltime","date","time"], sys.Type.find("sys::Type"), sys.Type.find("sys::Str")); if ($_u42 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([sys.Bool.type$,sys.Int.type$,sys.Float.type$,sys.Str.type$,sys.Uri.type$,sys.DateTime.type$,sys.Duration.type$,sys.Date.type$,sys.Time.type$], ["bool","int","real","str","uri","abstime","reltime","date","time"], sys.Type.find("sys::Type"), sys.Type.find("sys::Str"))); })(this), sys.Type.find("[sys::Type:sys::Str]"));
    if (true) {
      let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Type"));
      ObixUtil.#valTypeToElemName.each((v,k) => {
        map.set(v, k);
        return;
      });
      map.set("enum", sys.Str.type$);
      ObixUtil.#elemNameToValType = sys.ObjUtil.coerce(((this$) => { let $_u43 = map; if ($_u43 == null) return null; return sys.ObjUtil.toImmutable(map); })(this), sys.Type.find("[sys::Str:sys::Type]"));
    }
    ;
    ObixUtil.#valTypeToStrFunc = sys.ObjUtil.coerce(((this$) => { let $_u44 = sys.Map.__fromLiteral([sys.Uri.type$,sys.DateTime.type$,sys.Duration.type$,sys.Date.type$,sys.Time.type$], [sys.ObjUtil.coerce((v) => {
      return v.encode();
    }, sys.Type.find("|sys::Obj->sys::Str|")),sys.ObjUtil.coerce((v) => {
      return v.toIso();
    }, sys.Type.find("|sys::Obj->sys::Str|")),sys.ObjUtil.coerce((v) => {
      return v.toIso();
    }, sys.Type.find("|sys::Obj->sys::Str|")),sys.ObjUtil.coerce((v) => {
      return v.toIso();
    }, sys.Type.find("|sys::Obj->sys::Str|")),sys.ObjUtil.coerce((v) => {
      return v.toIso();
    }, sys.Type.find("|sys::Obj->sys::Str|"))], sys.Type.find("sys::Type"), sys.Type.find("|sys::Obj->sys::Str|")); if ($_u44 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([sys.Uri.type$,sys.DateTime.type$,sys.Duration.type$,sys.Date.type$,sys.Time.type$], [sys.ObjUtil.coerce((v) => {
      return v.encode();
    }, sys.Type.find("|sys::Obj->sys::Str|")),sys.ObjUtil.coerce((v) => {
      return v.toIso();
    }, sys.Type.find("|sys::Obj->sys::Str|")),sys.ObjUtil.coerce((v) => {
      return v.toIso();
    }, sys.Type.find("|sys::Obj->sys::Str|")),sys.ObjUtil.coerce((v) => {
      return v.toIso();
    }, sys.Type.find("|sys::Obj->sys::Str|")),sys.ObjUtil.coerce((v) => {
      return v.toIso();
    }, sys.Type.find("|sys::Obj->sys::Str|"))], sys.Type.find("sys::Type"), sys.Type.find("|sys::Obj->sys::Str|"))); })(this), sys.Type.find("[sys::Type:|sys::Obj->sys::Str|]"));
    ObixUtil.#elemNameToFromStrFunc = sys.ObjUtil.coerce(((this$) => { let $_u45 = sys.Map.__fromLiteral(["bool","int","real","str","uri","enum","abstime","reltime","date","time"], [(s) => {
      return sys.ObjUtil.coerce(sys.Bool.fromStr(s, true), sys.Obj.type$);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Int.fromStr(s, 10, true), sys.Obj.type$);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Float.fromStr(s, true), sys.Obj.type$);
    },(s) => {
      return s;
    },(s) => {
      return ObixUtil.parseUri(s);
    },(s) => {
      return s;
    },(s,elem) => {
      return ObixUtil.parseAbstime(s, elem);
    },(s) => {
      return sys.Duration.fromIso(s, true);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Date.fromIso(s, true), sys.Obj.type$);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Time.fromIso(s, true), sys.Obj.type$);
    }], sys.Type.find("sys::Str"), sys.Type.find("|sys::Str,xml::XElem->sys::Obj|")); if ($_u45 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["bool","int","real","str","uri","enum","abstime","reltime","date","time"], [(s) => {
      return sys.ObjUtil.coerce(sys.Bool.fromStr(s, true), sys.Obj.type$);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Int.fromStr(s, 10, true), sys.Obj.type$);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Float.fromStr(s, true), sys.Obj.type$);
    },(s) => {
      return s;
    },(s) => {
      return ObixUtil.parseUri(s);
    },(s) => {
      return s;
    },(s,elem) => {
      return ObixUtil.parseAbstime(s, elem);
    },(s) => {
      return sys.Duration.fromIso(s, true);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Date.fromIso(s, true), sys.Obj.type$);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Time.fromIso(s, true), sys.Obj.type$);
    }], sys.Type.find("sys::Str"), sys.Type.find("|sys::Str,xml::XElem->sys::Obj|"))); })(this), sys.Type.find("[sys::Str:|sys::Str,xml::XElem->sys::Obj|]"));
    ObixUtil.#elemNameToMinMaxFunc = sys.ObjUtil.coerce(((this$) => { let $_u46 = sys.Map.__fromLiteral(["int","real","str","abstime","reltime","date","time"], [(s) => {
      return sys.ObjUtil.coerce(sys.Int.fromStr(s, 10, true), sys.Obj.type$);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Float.fromStr(s, true), sys.Obj.type$);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Int.fromStr(s, 10, true), sys.Obj.type$);
    },(s,elem) => {
      return ObixUtil.parseAbstime(s, elem);
    },(s) => {
      return sys.Duration.fromIso(s, true);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Date.fromIso(s, true), sys.Obj.type$);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Time.fromIso(s, true), sys.Obj.type$);
    }], sys.Type.find("sys::Str"), sys.Type.find("|sys::Str,xml::XElem->sys::Obj|")); if ($_u46 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["int","real","str","abstime","reltime","date","time"], [(s) => {
      return sys.ObjUtil.coerce(sys.Int.fromStr(s, 10, true), sys.Obj.type$);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Float.fromStr(s, true), sys.Obj.type$);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Int.fromStr(s, 10, true), sys.Obj.type$);
    },(s,elem) => {
      return ObixUtil.parseAbstime(s, elem);
    },(s) => {
      return sys.Duration.fromIso(s, true);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Date.fromIso(s, true), sys.Obj.type$);
    },(s) => {
      return sys.ObjUtil.coerce(sys.Time.fromIso(s, true), sys.Obj.type$);
    }], sys.Type.find("sys::Str"), sys.Type.find("|sys::Str,xml::XElem->sys::Obj|"))); })(this), sys.Type.find("[sys::Str:|sys::Str,xml::XElem->sys::Obj|]"));
    ObixUtil.#tzSwizzles = sys.ObjUtil.coerce(((this$) => { let $_u47 = sys.Map.__fromLiteral(["EST","EDT","CST","CDT","MST","MDT","PST","PDT"], [sys.ObjUtil.coerce(sys.TimeZone.fromStr("New_York"), sys.TimeZone.type$),sys.ObjUtil.coerce(sys.TimeZone.fromStr("New_York"), sys.TimeZone.type$),sys.ObjUtil.coerce(sys.TimeZone.fromStr("Chicago"), sys.TimeZone.type$),sys.ObjUtil.coerce(sys.TimeZone.fromStr("Chicago"), sys.TimeZone.type$),sys.ObjUtil.coerce(sys.TimeZone.fromStr("Denver"), sys.TimeZone.type$),sys.ObjUtil.coerce(sys.TimeZone.fromStr("Denver"), sys.TimeZone.type$),sys.ObjUtil.coerce(sys.TimeZone.fromStr("Los_Angeles"), sys.TimeZone.type$),sys.ObjUtil.coerce(sys.TimeZone.fromStr("Los_Angeles"), sys.TimeZone.type$)], sys.Type.find("sys::Str"), sys.Type.find("sys::TimeZone")); if ($_u47 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["EST","EDT","CST","CDT","MST","MDT","PST","PDT"], [sys.ObjUtil.coerce(sys.TimeZone.fromStr("New_York"), sys.TimeZone.type$),sys.ObjUtil.coerce(sys.TimeZone.fromStr("New_York"), sys.TimeZone.type$),sys.ObjUtil.coerce(sys.TimeZone.fromStr("Chicago"), sys.TimeZone.type$),sys.ObjUtil.coerce(sys.TimeZone.fromStr("Chicago"), sys.TimeZone.type$),sys.ObjUtil.coerce(sys.TimeZone.fromStr("Denver"), sys.TimeZone.type$),sys.ObjUtil.coerce(sys.TimeZone.fromStr("Denver"), sys.TimeZone.type$),sys.ObjUtil.coerce(sys.TimeZone.fromStr("Los_Angeles"), sys.TimeZone.type$),sys.ObjUtil.coerce(sys.TimeZone.fromStr("Los_Angeles"), sys.TimeZone.type$)], sys.Type.find("sys::Str"), sys.Type.find("sys::TimeZone"))); })(this), sys.Type.find("[sys::Str:sys::TimeZone]"));
    ObixUtil.#defaultsToNull = "__null!__";
    ObixUtil.#elemNameToDefaultVal = sys.ObjUtil.coerce(((this$) => { let $_u48 = sys.Map.__fromLiteral(["bool","int","real","str","uri","reltime","enum","abstime","date","time"], [sys.ObjUtil.coerce(false, sys.Obj.type$),sys.ObjUtil.coerce(0, sys.Obj.type$),sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$),"",sys.Uri.fromStr(""),sys.Duration.fromStr("0ns"),ObixUtil.#defaultsToNull,ObixUtil.#defaultsToNull,ObixUtil.#defaultsToNull,ObixUtil.#defaultsToNull], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")); if ($_u48 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["bool","int","real","str","uri","reltime","enum","abstime","date","time"], [sys.ObjUtil.coerce(false, sys.Obj.type$),sys.ObjUtil.coerce(0, sys.Obj.type$),sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$),"",sys.Uri.fromStr(""),sys.Duration.fromStr("0ns"),ObixUtil.#defaultsToNull,ObixUtil.#defaultsToNull,ObixUtil.#defaultsToNull,ObixUtil.#defaultsToNull], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))); })(this), sys.Type.find("[sys::Str:sys::Obj]"));
    return;
  }

}

class ObixTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixTest.type$; }

  verifyObj(a,b) {
    const this$ = this;
    this.verifyEq(a.elemName(), b.elemName());
    this.verifyEq(a.name(), b.name());
    this.verifyEq(a.href(), b.href());
    this.verifyEq(a.contract(), b.contract());
    this.verifyEq(a.of(), b.of());
    this.verifyEq(a.in(), b.in());
    this.verifyEq(a.out(), b.out());
    this.verifyEq(a.val(), b.val());
    this.verifyEq(sys.ObjUtil.coerce(a.isNull(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.isNull(), sys.Obj.type$.toNullable()));
    this.verifyEq(a.displayName(), b.displayName());
    this.verifyEq(a.display(), b.display());
    this.verifyEq(a.icon(), b.icon());
    this.verifyEq(a.min(), b.min());
    this.verifyEq(a.max(), b.max());
    this.verifyEq(sys.ObjUtil.coerce(a.precision(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.precision(), sys.Obj.type$.toNullable()));
    this.verifyEq(a.range(), b.range());
    this.verifyEq(sys.ObjUtil.coerce(a.precision(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.precision(), sys.Obj.type$.toNullable()));
    this.verifyEq(a.status(), b.status());
    this.verifyEq(a.tz(), b.tz());
    this.verifyEq(a.unit(), b.unit());
    this.verifyEq(sys.ObjUtil.coerce(a.writable(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.writable(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()));
    let alist = a.list();
    let blist = b.list();
    alist.each((ak,i) => {
      let bk = blist.get(i);
      this$.verifySame(ak.parent(), a);
      this$.verifySame(bk.parent(), b);
      this$.verifyObj(ak, bk);
      return;
    });
    this.verifySame(a.first(), alist.first());
    this.verifySame(a.last(), alist.last());
    return;
  }

  verifyChildren(p,kids) {
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(p.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(kids.size(), sys.Obj.type$.toNullable()));
    this.verifyEq(p.list(), kids);
    this.verifyEq(sys.ObjUtil.coerce(p.list().isRO(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    let acc = sys.List.make(ObixObj.type$);
    p.each((it) => {
      acc.add(it);
      return;
    });
    this.verifyEq(acc, kids);
    kids.each((kid) => {
      this$.verifySame(kid.parent(), p);
      if (kid.name() != null) {
        this$.verifySame(p.get(sys.ObjUtil.coerce(kid.name(), sys.Str.type$)), kid);
      }
      ;
      return;
    });
    this.verifyEq(p.get("badone", false), null);
    this.verifyErr(sys.NameErr.type$, (it) => {
      p.get("badone");
      return;
    });
    this.verifyErr(sys.NameErr.type$, (it) => {
      p.get("badone", true);
      return;
    });
    return;
  }

  static make() {
    const $self = new ObixTest();
    ObixTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class XmlTest extends ObixTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XmlTest.type$; }

  testObjTree() {
    const this$ = this;
    this.verifyParse("<?xml version='1.0?>\n<obj href='http://foo/obix/'/>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.href(sys.Uri.fromStr("http://foo/obix/"));
      return;
    }), ObixObj.type$));
    this.verifyParse("<?xml version='1.0?>\n<obj href='http://foo/obix/'>\n  <obj name='a'>\n    <obj name='ax'/>\n  </obj>\n  <?pi?>\n  <obj name='b'>\n    <!-- comment -->\n    <obj name='bx'/>\n    <obj name='by'>\n      <obj name='byi'/>\n    </obj>\n    <?pi?>\n    <obj name='bz'><?pi?></obj>\n  </obj>\n</obj>\n", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.href(sys.Uri.fromStr("http://foo/obix/"));
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
          it.name("ax");
          return;
        }), ObixObj.type$));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
          it.name("bx");
          return;
        }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
          it.name("by");
          it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
            it.name("byi");
            return;
          }), ObixObj.type$));
          return;
        }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
          it.name("bz");
          return;
        }), ObixObj.type$));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testBool() {
    const this$ = this;
    this.verifyParse("<obj>\n <bool name='def'/>\n <bool name='a' val='true'/>\n <bool name='b' val='false'/>\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("def");
        it.val(sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.val(sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.val(sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testInt() {
    const this$ = this;
    this.verifyParse("<obj>\n <int name='def'/>\n <int name='a' val='3'/>\n <int name='b' val='-1234'/>\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("def");
        it.val(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.val(sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.val(sys.ObjUtil.coerce(-1234, sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testReal() {
    const this$ = this;
    this.verifyParse("<obj>\n <real name='def'/>\n <real name='a' val='2'/>\n <real name='b' val='-2.4'/>\n <real name='c' val='4e10'/>\n <real name='nan' val='NaN'/>\n <real name='posInf' val='INF'/>\n <real name='negInf' val='-INF'/>\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("def");
        it.val(sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.val(sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.val(sys.ObjUtil.coerce(sys.Float.make(-2.4), sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("c");
        it.val(sys.ObjUtil.coerce(sys.Float.make(4.0E10), sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("nan");
        it.val(sys.ObjUtil.coerce(sys.Float.nan(), sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("posInf");
        it.val(sys.ObjUtil.coerce(sys.Float.posInf(), sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("negInf");
        it.val(sys.ObjUtil.coerce(sys.Float.negInf(), sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    this.verifyEq(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.val(sys.ObjUtil.coerce(sys.Float.nan(), sys.Obj.type$.toNullable()));
      return;
    }), ObixObj.type$).valToStr(), "NaN");
    this.verifyEq(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.val(sys.ObjUtil.coerce(sys.Float.posInf(), sys.Obj.type$.toNullable()));
      return;
    }), ObixObj.type$).valToStr(), "INF");
    this.verifyEq(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.val(sys.ObjUtil.coerce(sys.Float.negInf(), sys.Obj.type$.toNullable()));
      return;
    }), ObixObj.type$).valToStr(), "-INF");
    return;
  }

  testStr() {
    const this$ = this;
    this.verifyParse("<obj>\n <str name='def'/>\n <str name='a' val='hi'/>\n <str name='b' val='&gt; &apos; &amp; &quot; &lt;'/>\n <str name='c' val='32\u00b0\nline2'/>\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("def");
        it.val("");
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.val("hi");
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.val("> ' & \" <");
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("c");
        it.val("32\u00b0\nline2");
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testUri() {
    const this$ = this;
    this.verifyParse("<obj>\n <uri name='def'/>\n <uri name='a' val='http://foo/'/>\n <uri name='b' val='http://foo/path%20name?foo=bar+baz'/>\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("def");
        it.val(sys.Uri.fromStr(""));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.val(sys.Uri.fromStr("http://foo/"));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.val(sys.Uri.fromStr("http://foo/path name?foo=bar baz"));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testEnum() {
    const this$ = this;
    this.verifyParse("<obj>\n <enum name='def'/>\n <enum name='a' val='slow'/>\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("enum");
        it.name("def");
        it.isNull(true);
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("enum");
        it.name("a");
        it.val("slow");
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testAbstime() {
    const this$ = this;
    this.verifyParse("<obj>\n <abstime name='def'/>\n <abstime name='a' val='2009-01-15T13:54:00Z'/>\n <abstime name='b' val='2009-01-15T13:54:00-05:00'/>\n <abstime name='c' val='2009-01-15T13:54:00Z' tz='London'/>\n <abstime name='d' val='2009-01-15T13:54:00-05:00' tz='America/New_York'/>\n <abstime name='e' val='9999-12-31T23:59:59.999Z'/>\n <abstime name='f' val='0000-01-01T00:00:00Z'/>\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("def");
        it.elemName("abstime");
        it.isNull(true);
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.val(sys.DateTime.make(2009, sys.Month.jan(), 15, 13, 54, 0, 0, sys.TimeZone.utc()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.val(sys.DateTime.make(2009, sys.Month.jan(), 15, 13, 54, 0, 0, sys.ObjUtil.coerce(sys.TimeZone.fromStr("Etc/GMT+5"), sys.TimeZone.type$)));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("c");
        it.val(sys.DateTime.make(2009, sys.Month.jan(), 15, 13, 54, 0, 0, sys.ObjUtil.coerce(sys.TimeZone.fromStr("London"), sys.TimeZone.type$)));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("d");
        it.val(sys.DateTime.make(2009, sys.Month.jan(), 15, 13, 54, 0, 0, sys.ObjUtil.coerce(sys.TimeZone.fromStr("New_York"), sys.TimeZone.type$)));
        it.tz(sys.TimeZone.fromStr("New_York"));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("e");
        it.val(sys.DateTime.make(2099, sys.Month.dec(), 31, 23, 59, 59, 999000000, sys.TimeZone.utc()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("f");
        it.val(sys.DateTime.make(1901, sys.Month.jan(), 1, 0, 0, 0, 0, sys.TimeZone.utc()));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testReltime() {
    const this$ = this;
    this.verifyParse("<obj>\n <reltime name='def'/>\n <reltime name='a' val='PT45S'/>\n <reltime name='b' val='PT0.1S'/>\n <reltime name='c' val='P2DT20H15M'/>\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("def");
        it.val(sys.Duration.fromStr("0ns"));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.val(sys.Duration.fromStr("45sec"));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.val(sys.Duration.fromStr("100ms"));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("c");
        it.val(sys.Duration.fromStr("4095min"));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testDate() {
    const this$ = this;
    this.verifyParse("<obj>\n <date name='def'/>\n <date name='a' val='2010-01-30'/>\n <date name='b' val='1995-12-05' tz='America/Chicago'/>\n <date name='c' val='9999-12-31'/>\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("date");
        it.name("def");
        it.isNull(true);
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.val(sys.Date.make(2010, sys.Month.jan(), 30));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.val(sys.Date.make(1995, sys.Month.dec(), 5));
        it.tz(sys.TimeZone.fromStr("Chicago"));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("c");
        it.val(sys.Date.make(9999, sys.Month.dec(), 31));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testTime() {
    const this$ = this;
    this.verifyParse("<obj>\n <time name='def'/>\n <time name='a' val='05:30:20'/>\n <time name='b' val='23:00:00.456' tz='Europe/London'/>\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("time");
        it.name("def");
        it.isNull(true);
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.val(sys.Time.make(5, 30, 20));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.val(sys.Time.make(23, 0, 0, 456000000));
        it.tz(sys.TimeZone.fromStr("London"));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testValErrs() {
    const this$ = this;
    this.verifyParse("<obj val='foo'/>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.elemName("str");
      it.val("foo");
      return;
    }), ObixObj.type$));
    this.verifyParseErr("<obj><op val='bad'/></obj>");
    return;
  }

  testDisplay() {
    const this$ = this;
    this.verifyParse("<obj>\n <obj name='a' displayName='Alpha' />\n <obj name='b' display='The Beta'/>\n <int name='c' displayName='Gamma' display='The Gamma' val='5'/>\n <obj name='d' displayName='&apos;\"&lt;&gt;' />\n <obj name='e' display='&apos;\"&lt;&gt;' />\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.displayName("Alpha");
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.display("The Beta");
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("c");
        it.displayName("Gamma");
        it.display("The Gamma");
        it.val(sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("d");
        it.displayName("'\"<>");
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("e");
        it.display("'\"<>");
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testIcon() {
    const this$ = this;
    this.verifyParse("<obj>\n <obj name='a' icon='http://foo/icons/a.png' />\n <obj name='b' icon=\"http://foo/icon%20dir/?foo=bar+bar\" />\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.icon(sys.Uri.fromStr("http://foo/icons/a.png"));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.icon(sys.Uri.fromStr("http://foo/icon dir/?foo=bar bar"));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testMinMax() {
    const this$ = this;
    this.verifyParse("<obj>\n <int name='a' min='0'/>\n <int name='b' max='100'/>\n <real name='c' min='1' max='99' />\n <real name='d' min='-INF' max='INF'/>\n <str name='e' min='2' max='20'/>\n <abstime name='f' isNull='true' min='2000-01-01T00:00:00Z' max='2000-12-31T23:59:59Z'/>\n <reltime name='g' min='PT3S' max='PT1M'/>\n <date name='h' isNull='true' min='2000-01-01' max='2000-12-31'/>\n <time name='i' isNull='true' min='01:00:00' max='12:00:00'/>\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.val(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
        it.min(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.val(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
        it.max(sys.ObjUtil.coerce(100, sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("c");
        it.val(sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$.toNullable()));
        it.min(sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()));
        it.max(sys.ObjUtil.coerce(sys.Float.make(99.0), sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("d");
        it.val(sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$.toNullable()));
        it.min(sys.ObjUtil.coerce(sys.Float.negInf(), sys.Obj.type$.toNullable()));
        it.max(sys.ObjUtil.coerce(sys.Float.posInf(), sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("e");
        it.val("");
        it.min(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
        it.max(sys.ObjUtil.coerce(20, sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("f");
        it.elemName("abstime");
        it.isNull(true);
        it.min(sys.DateTime.make(2000, sys.Month.jan(), 1, 0, 0, 0, 0, sys.TimeZone.utc()));
        it.max(sys.DateTime.make(2000, sys.Month.dec(), 31, 23, 59, 59, 0, sys.TimeZone.utc()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("g");
        it.val(sys.Duration.fromStr("0ns"));
        it.min(sys.Duration.fromStr("3sec"));
        it.max(sys.Duration.fromStr("1min"));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("h");
        it.elemName("date");
        it.isNull(true);
        it.min(sys.Date.make(2000, sys.Month.jan(), 1));
        it.max(sys.Date.make(2000, sys.Month.dec(), 31));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("i");
        it.elemName("time");
        it.isNull(true);
        it.min(sys.Time.make(1, 0, 0));
        it.max(sys.Time.make(12, 0, 0));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testPrecision() {
    const this$ = this;
    this.verifyParse("<obj>\n <real name='a' val='75.00' precision='2' />\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.val(sys.ObjUtil.coerce(sys.Float.make(75.0), sys.Obj.type$.toNullable()));
        it.precision(sys.ObjUtil.coerce(2, sys.Int.type$.toNullable()));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testRange() {
    const this$ = this;
    this.verifyParse("<obj>\n <enum name='a' val='1' range='http://foo/range' />\n <enum name='b' val='2' range=\"http://foo/range%20val/\" />\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("enum");
        it.name("a");
        it.val("1");
        it.range(sys.Uri.fromStr("http://foo/range"));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("enum");
        it.name("b");
        it.val("2");
        it.range(sys.Uri.fromStr("http://foo/range val/"));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testStatus() {
    const this$ = this;
    this.verifyParse("<obj>\n <obj name='a' />\n <obj name='b' status='disabled'/>\n <obj name='c' status='fault'/>\n <obj name='d' status='down'/>\n <obj name='e' status='unackedAlarm'/>\n <obj name='f' status='alarm'/>\n <obj name='g' status='unacked'/>\n <obj name='h' status='overridden'/>\n <obj name='i' status='ok'/>\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.status(Status.ok());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.status(Status.disabled());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("c");
        it.status(Status.fault());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("d");
        it.status(Status.down());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("e");
        it.status(Status.unackedAlarm());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("f");
        it.status(Status.alarm());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("g");
        it.status(Status.unacked());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("h");
        it.status(Status.overridden());
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("i");
        it.status(Status.ok());
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testUnit() {
    const this$ = this;
    this.verifyParse("<obj>\n <int name='a' unit='obix:units/meter' />\n <int name='b' unit='obix:units/fahrenheit' />\n <int name='c' unit='obix:units/unknown_unit' />\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.val(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
        it.unit(sys.Unit.fromStr("meter"));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.val(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
        it.unit(sys.Unit.fromStr("fahrenheit"));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("c");
        it.val(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testWritable() {
    const this$ = this;
    this.verifyParse("<obj>\n <int name='a' />\n <int name='b' writable='true'/>\n <int name='c' writable='false'/>\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.val(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
        it.writable(false);
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.val(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
        it.writable(true);
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("c");
        it.val(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
        it.writable(false);
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testIs() {
    const this$ = this;
    this.verifyParse("<obj>\n <obj name='a' is='obix:Point'/>\n <obj name='b' is='obix:Point obix:WritablePoint'/>\n <obj name='c' is='http://foo/a%20b'/>\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.contract(Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:Point")])));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.contract(Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:Point"), sys.Uri.fromStr("obix:WritablePoint")])));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("c");
        it.contract(Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("http://foo/a b")])));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testList() {
    const this$ = this;
    this.verifyParse("<list of='obix:Point'>\n  <real val='1'/>\n  <real val='2'/>\n</list>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.elemName("list");
      it.of(Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:Point")])));
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.val(sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.val(sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testOp() {
    const this$ = this;
    this.verifyParse("<obj>\n  <op name='a' in='/in'/>\n  <op name='b' out='/out1 /out2'/>\n  <op name='c' in='/in' out='/out' />\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("op");
        it.name("a");
        it.in(Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("/in")])));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("op");
        it.name("b");
        it.out(Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("/out1"), sys.Uri.fromStr("/out2")])));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("op");
        it.name("c");
        it.in(Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("/in")])));
        it.out(Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("/out")])));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testFeed() {
    const this$ = this;
    this.verifyParse("<obj>\n  <feed name='a' of='/in'/>\n  <feed name='b' out='/out1 /out2'/>\n  <feed name='c' of='/in' out='/out' />\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("feed");
        it.name("a");
        it.of(Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("/in")])));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("feed");
        it.name("b");
        it.out(Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("/out1"), sys.Uri.fromStr("/out2")])));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("feed");
        it.name("c");
        it.of(Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("/in")])));
        it.out(Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("/out")])));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  testUnknownElems() {
    const this$ = this;
    this.verifyParse("<obj>\n  <newOne/>\n  <int name='a' val='100' custom='foo'><custom/></int>\n  <foo>\n    <bar/>\n    <obj name='foo'/>\n  </foo>\n  <obj name='b'>\n    <real name='c' val='0'/>\n  </obj>\n</obj>", sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("a");
        it.val(sys.ObjUtil.coerce(100, sys.Obj.type$.toNullable()));
        return;
      }), ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
          it.name("c");
          it.val(sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$.toNullable()));
          return;
        }), ObixObj.type$));
        return;
      }), ObixObj.type$));
      return;
    }), ObixObj.type$));
    return;
  }

  verifyParse(s,expected) {
    let actual = ObixXmlParser.make(sys.Str.in(s)).parse();
    this.verifyObj(actual, expected);
    let buf = sys.Buf.make();
    actual.writeXml(buf.out());
    let rt = ObixObj.readXml(sys.Str.in(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).readAllStr()));
    this.verifyObj(rt, expected);
    return;
  }

  verifyParseErr(s) {
    const this$ = this;
    this.verifyErr(xml.XErr.type$, (it) => {
      ObixObj.readXml(sys.Str.in(s));
      return;
    });
    return;
  }

  static make() {
    const $self = new XmlTest();
    XmlTest.make$($self);
    return $self;
  }

  static make$($self) {
    ObixTest.make$($self);
    return;
  }

}

class ObjTest extends ObixTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObjTest.type$; }

  testChildren() {
    const this$ = this;
    let p = ObixObj.make();
    this.verifyChildren(p, sys.List.make(ObixObj.type$));
    let a = ObixObj.make();
    this.verifySame(p.add(a), p);
    this.verifyChildren(p, sys.List.make(ObixObj.type$, [a]));
    let b = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.name("b");
      return;
    }), ObixObj.type$);
    let c = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      return;
    }), ObixObj.type$);
    let d = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.name("d");
      return;
    }), ObixObj.type$);
    p.add(b).add(c).add(d);
    this.verifyChildren(p, sys.List.make(ObixObj.type$, [a, b, c, d]));
    this.verifySame(p.remove(b), p);
    this.verifyChildren(p, sys.List.make(ObixObj.type$, [a, c, d]));
    this.verifyEq(b.parent(), null);
    this.verifyEq(p.get("b", false), null);
    this.verifySame(p.remove(a), p);
    this.verifyChildren(p, sys.List.make(ObixObj.type$, [c, d]));
    this.verifyEq(p.get("d", false), d);
    this.verifySame(p.clear(), p);
    this.verifyChildren(p, sys.List.make(ObixObj.type$));
    this.verifyEq(c.parent(), null);
    this.verifyEq(d.parent(), null);
    p.add(d).add(c).add(b).add(a);
    this.verifyChildren(p, sys.List.make(ObixObj.type$, [d, c, b, a]));
    this.verifyErr(sys.ArgErr.type$, (it) => {
      p.add(b);
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      p.add(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        return;
      }), ObixObj.type$));
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      p.remove(sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.name("b");
        return;
      }), ObixObj.type$));
      return;
    });
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      b.name("boo");
      return;
    });
    return;
  }

  testElemNames() {
    const this$ = this;
    let names = sys.List.make(sys.Str.type$, ["obj", "bool", "int", "real", "str", "enum", "uri", "abstime", "reltime", "date", "time", "list", "op", "feed", "ref", "err"]);
    names.each((s) => {
      let x = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName(s);
        return;
      }), ObixObj.type$);
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let x = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.elemName("foo");
        return;
      }), ObixObj.type$);
      return;
    });
    return;
  }

  testHref() {
    const this$ = this;
    let root = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.href(sys.Uri.fromStr("http://foo/obix/"));
      return;
    }), ObixObj.type$);
    let a = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.href(sys.Uri.fromStr("a/"));
      return;
    }), ObixObj.type$);
    root.add(a);
    let b = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      return;
    }), ObixObj.type$);
    a.add(b);
    let c = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.href(sys.Uri.fromStr("b/c"));
      return;
    }), ObixObj.type$);
    b.add(c);
    this.verifySame(root.root(), root);
    this.verifySame(a.root(), root);
    this.verifySame(b.root(), root);
    this.verifySame(c.root(), root);
    this.verifySame(root.href(), sys.Uri.fromStr("http://foo/obix/"));
    this.verifySame(a.href(), sys.Uri.fromStr("a/"));
    this.verifySame(b.href(), null);
    this.verifySame(c.href(), sys.Uri.fromStr("b/c"));
    this.verifyEq(root.normalizedHref(), sys.Uri.fromStr("http://foo/obix/"));
    this.verifyEq(a.normalizedHref(), sys.Uri.fromStr("http://foo/obix/a/"));
    this.verifyEq(b.normalizedHref(), null);
    this.verifyEq(c.normalizedHref(), sys.Uri.fromStr("http://foo/obix/b/c"));
    return;
  }

  testVal() {
    const this$ = this;
    this.verifyVal("obj", null);
    this.verifyVal("bool", sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyVal("int", sys.ObjUtil.coerce(72, sys.Obj.type$.toNullable()));
    this.verifyVal("real", sys.ObjUtil.coerce(sys.Float.make(75.0), sys.Obj.type$.toNullable()));
    this.verifyVal("str", "hi");
    this.verifyVal("uri", sys.Uri.fromStr("http://host/"));
    this.verifyVal("abstime", sys.DateTime.now());
    this.verifyVal("reltime", sys.Duration.now());
    this.verifyVal("date", sys.Date.today());
    this.verifyVal("time", sys.Time.now());
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let x = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.val(this$);
        return;
      }), ObixObj.type$);
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let x = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
        it.val(sys.Locale.cur());
        return;
      }), ObixObj.type$);
      return;
    });
    return;
  }

  verifyVal(elemName,val) {
    const this$ = this;
    let obj = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.name("foo");
      it.val(val);
      return;
    }), ObixObj.type$);
    this.verifyEq(obj.elemName(), elemName);
    this.verifySame(obj.val(), val);
    let parent = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.add(obj);
      return;
    }), ObixObj.type$);
    this.verifyEq(parent.trap("foo", sys.List.make(sys.Obj.type$.toNullable(), [])), val);
    return;
  }

  testTimeZone() {
    const this$ = this;
    let ny = sys.TimeZone.fromStr("New_York");
    let utc = sys.TimeZone.utc();
    let gmt5 = sys.TimeZone.fromStr("Etc/GMT+5");
    let utcNow = sys.DateTime.nowUtc();
    let nyNow = utcNow.toTimeZone(sys.ObjUtil.coerce(ny, sys.TimeZone.type$));
    let gmt5Now = utcNow.toTimeZone(sys.ObjUtil.coerce(gmt5, sys.TimeZone.type$));
    let obj = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.val(nyNow);
      return;
    }), ObixObj.type$);
    this.verifyEq(sys.ObjUtil.trap(obj.val(),"ticks", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(nyNow.ticks(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.trap(obj.val(),"tz", sys.List.make(sys.Obj.type$.toNullable(), [])), ny);
    this.verifyEq(obj.tz(), ny);
    (obj = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.val(utcNow);
      return;
    }), ObixObj.type$));
    this.verifyEq(sys.ObjUtil.trap(obj.val(),"ticks", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(utcNow.ticks(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.trap(obj.val(),"tz", sys.List.make(sys.Obj.type$.toNullable(), [])), utc);
    this.verifyEq(obj.tz(), null);
    (obj = sys.ObjUtil.coerce(sys.ObjUtil.with(ObixObj.make(), (it) => {
      it.val(gmt5Now);
      return;
    }), ObixObj.type$));
    this.verifyEq(sys.ObjUtil.trap(obj.val(),"ticks", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(gmt5Now.ticks(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.trap(obj.val(),"tz", sys.List.make(sys.Obj.type$.toNullable(), [])), gmt5);
    this.verifyEq(obj.tz(), null);
    return;
  }

  static make() {
    const $self = new ObjTest();
    ObjTest.make$($self);
    return $self;
  }

  static make$($self) {
    ObixTest.make$($self);
    return;
  }

}

const p = sys.Pod.add$('obix');
const xp = sys.Param.noParams$();
let m;
Status.type$ = p.at$('Status','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,Status);
Contract.type$ = p.at$('Contract','sys::Obj',[],{},8194,Contract);
ObixObj.type$ = p.at$('ObixObj','sys::Obj',[],{},8192,ObixObj);
ObixMod.type$ = p.at$('ObixMod','web::WebMod',[],{},8195,ObixMod);
ObixModWatch.type$ = p.at$('ObixModWatch','sys::Obj',[],{},8193,ObixModWatch);
ObixClient.type$ = p.at$('ObixClient','sys::Obj',[],{},8192,ObixClient);
ObixClientWatch.type$ = p.at$('ObixClientWatch','sys::Obj',[],{},8192,ObixClientWatch);
ObixXmlParser.type$ = p.at$('ObixXmlParser','sys::Obj',[],{},128,ObixXmlParser);
ObixErr.type$ = p.at$('ObixErr','sys::Err',[],{},8194,ObixErr);
ObixUtil.type$ = p.at$('ObixUtil','sys::Obj',[],{},128,ObixUtil);
ObixTest.type$ = p.at$('ObixTest','sys::Test',[],{'sys::NoDoc':""},8193,ObixTest);
XmlTest.type$ = p.at$('XmlTest','obix::ObixTest',[],{},8192,XmlTest);
ObjTest.type$ = p.at$('ObjTest','obix::ObixTest',[],{},8192,ObjTest);
Status.type$.af$('ok',106506,'obix::Status',{}).af$('overridden',106506,'obix::Status',{}).af$('unacked',106506,'obix::Status',{}).af$('alarm',106506,'obix::Status',{}).af$('unackedAlarm',106506,'obix::Status',{}).af$('down',106506,'obix::Status',{}).af$('fault',106506,'obix::Status',{}).af$('disabled',106506,'obix::Status',{}).af$('vals',106498,'obix::Status[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'obix::Status?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Contract.type$.af$('uris',73730,'sys::Uri[]',{}).af$('empty',106498,'obix::Contract',{}).af$('lobby',106498,'obix::Contract',{'sys::NoDoc':""}).af$('about',106498,'obix::Contract',{'sys::NoDoc':""}).af$('batchIn',106498,'obix::Contract',{'sys::NoDoc':""}).af$('batchOut',106498,'obix::Contract',{'sys::NoDoc':""}).af$('watchService',106498,'obix::Contract',{'sys::NoDoc':""}).af$('watch',106498,'obix::Contract',{'sys::NoDoc':""}).af$('watchIn',106498,'obix::Contract',{'sys::NoDoc':""}).af$('watchOut',106498,'obix::Contract',{'sys::NoDoc':""}).af$('read',106498,'obix::Contract',{'sys::NoDoc':""}).af$('write',106498,'obix::Contract',{'sys::NoDoc':""}).af$('invoke',106498,'obix::Contract',{'sys::NoDoc':""}).af$('badUriErr',106498,'obix::Contract',{'sys::NoDoc':""}).af$('point',106498,'obix::Contract',{'sys::NoDoc':""}).af$('history',106498,'obix::Contract',{'sys::NoDoc':""}).af$('writePointIn',106498,'obix::Contract',{'sys::NoDoc':""}).af$('historyFilter',106498,'obix::Contract',{'sys::NoDoc':""}).af$('historyQueryOut',106498,'obix::Contract',{'sys::NoDoc':""}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uris','sys::Uri[]',false)]),{}).am$('fromStr',40966,'obix::Contract?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('isEmpty',8192,'sys::Bool',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('has',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('contract','sys::Uri',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ObixObj.type$.af$('name',73728,'sys::Str?',{}).af$('href',73728,'sys::Uri?',{}).af$('elemName',73728,'sys::Str',{}).af$('contract',73728,'obix::Contract',{}).af$('of',73728,'obix::Contract?',{}).af$('in',73728,'obix::Contract?',{}).af$('out',73728,'obix::Contract?',{}).af$('isNull',73728,'sys::Bool',{}).af$('val',73728,'sys::Obj?',{}).af$('parent',73728,'obix::ObixObj?',{}).af$('displayName',73728,'sys::Str?',{}).af$('display',73728,'sys::Str?',{}).af$('icon',73728,'sys::Uri?',{}).af$('min',73728,'sys::Obj?',{}).af$('max',73728,'sys::Obj?',{}).af$('precision',73728,'sys::Int?',{}).af$('range',73728,'sys::Uri?',{}).af$('status',73728,'obix::Status',{}).af$('tz',73728,'sys::TimeZone?',{}).af$('unit',73728,'sys::Unit?',{}).af$('writable',73728,'sys::Bool',{}).af$('noUris',98434,'sys::Uri[]',{}).af$('noChildren',98434,'obix::ObixObj[]',{}).af$('xmlEsc',98434,'sys::Int',{}).af$('kidsByName',67584,'[sys::Str:obix::ObixObj]?',{}).af$('kidsHead',67584,'obix::ObixObj?',{}).af$('kidsTail',67584,'obix::ObixObj?',{}).af$('kidsCount',67584,'sys::Int',{}).af$('prev',67584,'obix::ObixObj?',{}).af$('next',67584,'obix::ObixObj?',{}).am$('normalizedHref',8192,'sys::Uri?',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('valType',8192,'sys::Type?',xp,{}).am$('valToStr',8192,'sys::Str',xp,{}).am$('root',8192,'obix::ObixObj',xp,{}).am$('isEmpty',8192,'sys::Bool',xp,{}).am$('size',8192,'sys::Int',xp,{}).am$('has',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('get',8192,'obix::ObixObj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'sys::Operator':""}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('list',8192,'obix::ObixObj[]',xp,{}).am$('first',8192,'obix::ObixObj?',xp,{}).am$('last',8192,'obix::ObixObj?',xp,{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|obix::ObixObj->sys::Void|',false)]),{}).am$('add',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('kid','obix::ObixObj',false)]),{'sys::Operator':""}).am$('remove',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('kid','obix::ObixObj',false)]),{}).am$('clear',8192,'sys::This',xp,{}).am$('readXml',40962,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('close','sys::Bool',true)]),{}).am$('writeXml',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('indent','sys::Int',true)]),{}).am$('dump',8192,'sys::This',xp,{'sys::NoDoc':""}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
ObixMod.type$.af$('aboutServerName',67586,'sys::Str',{}).af$('aboutVendorName',67586,'sys::Str',{}).af$('aboutVendorUrl',67586,'sys::Uri',{}).af$('aboutProductName',67586,'sys::Str',{}).af$('aboutProductVer',67586,'sys::Str',{}).af$('aboutProductUrl',67586,'sys::Uri',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('about','[sys::Str:sys::Obj]',true)]),{}).am$('onService',271360,'sys::Void',xp,{}).am$('onLobby',2048,'sys::Void',xp,{}).am$('onAbout',2048,'sys::Void',xp,{}).am$('onXsl',2048,'sys::Void',xp,{}).am$('onBatch',2048,'sys::Void',xp,{}).am$('onWatchService',2048,'sys::Void',xp,{}).am$('onWatch',2048,'sys::Void',xp,{}).am$('onWatchLease',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('watch','obix::ObixModWatch',false)]),{}).am$('onWatchAdd',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('watch','obix::ObixModWatch',false)]),{}).am$('onWatchRemove',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('watch','obix::ObixModWatch',false)]),{}).am$('onWatchPollChanges',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('watch','obix::ObixModWatch',false)]),{}).am$('onWatchPollRefresh',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('watch','obix::ObixModWatch',false)]),{}).am$('onWatchDelete',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('watch','obix::ObixModWatch',false)]),{}).am$('readWatchIn',2048,'sys::Uri[]',xp,{}).am$('writeWatchOut',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('objs','obix::ObixObj[]',false)]),{}).am$('writeResWatch',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('watch','obix::ObixModWatch',false)]),{}).am$('watchUri',2048,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('watch','obix::ObixModWatch',false)]),{}).am$('readReqObj',2048,'obix::ObixObj',xp,{}).am$('writeResObj',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','obix::ObixObj',false)]),{}).am$('writeResErr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('writeResUnresolvedErr',2048,'sys::Void',xp,{}).am$('onRead',270337,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('onWrite',270337,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('val','obix::ObixObj',false)]),{}).am$('onInvoke',270337,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('arg','obix::ObixObj',false)]),{}).am$('lobby',270336,'obix::ObixObj',xp,{}).am$('about',270336,'obix::ObixObj',xp,{}).am$('watchService',270336,'obix::ObixObj',xp,{}).am$('watchOpen',270337,'obix::ObixModWatch',xp,{}).am$('watch',270337,'obix::ObixModWatch?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{});
ObixModWatch.type$.af$('lease',270337,'sys::Duration',{}).am$('id',270337,'sys::Str',xp,{}).am$('add',270337,'obix::ObixObj[]',sys.List.make(sys.Param.type$,[new sys.Param('uris','sys::Uri[]',false)]),{}).am$('remove',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uris','sys::Uri[]',false)]),{}).am$('pollChanges',270337,'obix::ObixObj[]',xp,{}).am$('pollRefresh',270337,'obix::ObixObj[]',xp,{}).am$('delete',270337,'sys::Void',xp,{}).am$('toObixObj',270336,'obix::ObixObj',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
ObixClient.type$.af$('lobbyUri',73730,'sys::Uri',{}).af$('aboutUri',73728,'sys::Uri?',{}).af$('batchUri',73728,'sys::Uri?',{}).af$('watchServiceUri',73728,'sys::Uri?',{}).af$('debugCounter',100354,'concurrent::AtomicInt',{}).af$('log',73728,'sys::Log',{'sys::NoDoc':""}).af$('socketConfig',73728,'inet::SocketConfig',{'sys::NoDoc':""}).af$('authHeaders',67584,'[sys::Str:sys::Str]',{}).af$('watchServiceMakeUri',67584,'sys::Uri?',{}).af$('cookies',67584,'web::Cookie[]',{}).am$('makeBasicAuth',40966,'obix::ObixClient?',sys.List.make(sys.Param.type$,[new sys.Param('lobby','sys::Uri',false),new sys.Param('username','sys::Str',false),new sys.Param('password','sys::Str',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lobby','sys::Uri',false),new sys.Param('authHeaders','[sys::Str:sys::Str]',false)]),{}).am$('readLobby',8192,'obix::ObixObj',xp,{}).am$('readAbout',8192,'obix::ObixObj',xp,{}).am$('batchRead',8192,'obix::ObixObj[]',sys.List.make(sys.Param.type$,[new sys.Param('uris','sys::Uri[]',false)]),{}).am$('watchOpen',8192,'obix::ObixClientWatch',xp,{}).am$('read',8192,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('write',8192,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('obj','obix::ObixObj',false)]),{}).am$('invoke',8192,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('in','obix::ObixObj',false)]),{}).am$('send',2048,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('method','sys::Str',false),new sys.Param('in','obix::ObixObj?',false)]),{}).am$('readResObj',2048,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false),new sys.Param('in','sys::InStream',false)]),{}).am$('debugReq',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false),new sys.Param('req','sys::Str',false)]),{}).am$('debugRes',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('debugId','sys::Int',false),new sys.Param('c','web::WebClient',false),new sys.Param('res','sys::Str',false)]),{}).am$('main',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ObixClientWatch.type$.af$('client',73728,'obix::ObixClient',{}).af$('lease',8192,'sys::Duration',{}).af$('uri',67586,'sys::Uri',{}).af$('leaseUri',67586,'sys::Uri',{}).af$('addUri',67586,'sys::Uri',{}).af$('removeUri',67586,'sys::Uri',{}).af$('pollChangesUri',67586,'sys::Uri',{}).af$('pollRefreshUri',67586,'sys::Uri',{}).af$('deleteUri',67586,'sys::Uri',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('client','obix::ObixClient',false),new sys.Param('obj','obix::ObixObj',false)]),{}).am$('childUri',2048,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('obj','obix::ObixObj',false),new sys.Param('name','sys::Str',false),new sys.Param('elem','sys::Str',false)]),{}).am$('add',8192,'obix::ObixObj[]',sys.List.make(sys.Param.type$,[new sys.Param('uris','sys::Uri[]',false)]),{}).am$('remove',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uris','sys::Uri[]',false)]),{}).am$('pollChanges',8192,'obix::ObixObj[]',xp,{}).am$('pollRefresh',8192,'obix::ObixObj[]',xp,{}).am$('close',8192,'sys::Void',xp,{}).am$('nullArg',2048,'obix::ObixObj',xp,{}).am$('toWatchIn',2048,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('uris','sys::Uri[]',false)]),{}).am$('fromWatchOut',2048,'obix::ObixObj[]',sys.List.make(sys.Param.type$,[new sys.Param('res','obix::ObixObj',false)]),{});
ObixXmlParser.type$.af$('xparser',73728,'xml::XParser',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('parse',8192,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('close','sys::Bool',true)]),{}).am$('parseObj',2048,'obix::ObixObj',xp,{}).am$('parseAttr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','obix::ObixObj',false),new sys.Param('elem','xml::XElem',false),new sys.Param('attr','xml::XAttr',false)]),{}).am$('parseVal',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','obix::ObixObj',false),new sys.Param('valStr','sys::Str',false),new sys.Param('elem','xml::XElem',false)]),{}).am$('parseMinMax',2048,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('valStr','sys::Str',false),new sys.Param('elem','xml::XElem',false)]),{}).am$('parseTimeZone',2048,'sys::TimeZone?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('err',2048,'xml::XErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
ObixErr.type$.af$('contract',73730,'obix::Contract',{}).af$('display',73730,'sys::Str',{}).am$('toObj',40962,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('toUnresolvedObj',40962,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('make',40966,'obix::ObixErr?',sys.List.make(sys.Param.type$,[new sys.Param('obj','obix::ObixObj',false)]),{}).am$('doMake',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('contract','obix::Contract',false),new sys.Param('display','sys::Str',false)]),{}).am$('isBadUri',8192,'sys::Bool',xp,{});
ObixUtil.type$.af$('elemNames',98434,'[sys::Str:sys::Bool]',{}).af$('valTypeToElemName',98434,'[sys::Type:sys::Str]',{}).af$('elemNameToValType',98434,'[sys::Str:sys::Type]',{}).af$('valTypeToStrFunc',98434,'[sys::Type:|sys::Obj->sys::Str|]',{}).af$('elemNameToFromStrFunc',98434,'[sys::Str:|sys::Str,xml::XElem->sys::Obj|]',{}).af$('elemNameToMinMaxFunc',98434,'[sys::Str:|sys::Str,xml::XElem->sys::Obj|]',{}).af$('tzSwizzles',98434,'[sys::Str:sys::TimeZone]',{}).af$('defaultsToNull',98434,'sys::Str',{}).af$('elemNameToDefaultVal',98434,'[sys::Str:sys::Obj]',{}).am$('valToStr',32898,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('parseUri',32898,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('parseAbstime',32898,'sys::DateTime',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('elem','xml::XElem',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
ObixTest.type$.am$('verifyObj',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','obix::ObixObj',false),new sys.Param('b','obix::ObixObj',false)]),{}).am$('verifyChildren',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','obix::ObixObj',false),new sys.Param('kids','obix::ObixObj[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
XmlTest.type$.am$('testObjTree',8192,'sys::Void',xp,{}).am$('testBool',8192,'sys::Void',xp,{}).am$('testInt',8192,'sys::Void',xp,{}).am$('testReal',8192,'sys::Void',xp,{}).am$('testStr',8192,'sys::Void',xp,{}).am$('testUri',8192,'sys::Void',xp,{}).am$('testEnum',8192,'sys::Void',xp,{}).am$('testAbstime',8192,'sys::Void',xp,{}).am$('testReltime',8192,'sys::Void',xp,{}).am$('testDate',8192,'sys::Void',xp,{}).am$('testTime',8192,'sys::Void',xp,{}).am$('testValErrs',8192,'sys::Void',xp,{}).am$('testDisplay',8192,'sys::Void',xp,{}).am$('testIcon',8192,'sys::Void',xp,{}).am$('testMinMax',8192,'sys::Void',xp,{}).am$('testPrecision',8192,'sys::Void',xp,{}).am$('testRange',8192,'sys::Void',xp,{}).am$('testStatus',8192,'sys::Void',xp,{}).am$('testUnit',8192,'sys::Void',xp,{}).am$('testWritable',8192,'sys::Void',xp,{}).am$('testIs',8192,'sys::Void',xp,{}).am$('testList',8192,'sys::Void',xp,{}).am$('testOp',8192,'sys::Void',xp,{}).am$('testFeed',8192,'sys::Void',xp,{}).am$('testUnknownElems',8192,'sys::Void',xp,{}).am$('verifyParse',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('expected','obix::ObixObj',false)]),{}).am$('verifyParseErr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ObjTest.type$.am$('testChildren',8192,'sys::Void',xp,{}).am$('testElemNames',8192,'sys::Void',xp,{}).am$('testHref',8192,'sys::Void',xp,{}).am$('testVal',8192,'sys::Void',xp,{}).am$('verifyVal',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elemName','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('testTimeZone',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "obix");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;inet 1.0;web 1.0;concurrent 1.0;xml 1.0");
m.set("pod.summary", "oBIX XML model and client/server REST handling");
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
  Status,
  Contract,
  ObixObj,
  ObixMod,
  ObixModWatch,
  ObixClient,
  ObixClientWatch,
  ObixErr,
  ObixTest,
  XmlTest,
  ObjTest,
};
