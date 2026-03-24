// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as graphics from './graphics.js'
import * as inet from './inet.js'
import * as web from './web.js'
import * as dom from './dom.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class Button extends dom.Elem {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#popupOffset = graphics.Point.defVal();
    this.#isCombo = false;
    this.#mouseDown = false;
    this.#popup = null;
    this.#cbAction = null;
    this.#cbPopup = null;
    return;
  }

  typeof() { return Button.type$; }

  #popupOffset = null;

  popupOffset(it) {
    if (it === undefined) {
      return this.#popupOffset;
    }
    else {
      this.#popupOffset = it;
      return;
    }
  }

  #enabled = null;

  enabled(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(!this.style().hasClass("disabled"), sys.Bool.type$.toNullable());
    }
    else {
      if (sys.ObjUtil.coerce(it, sys.Bool.type$)) {
        this.style().removeClass("disabled");
        this.trap("tabIndex", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]));
      }
      else {
        this.style().addClass("disabled");
        this.trap("tabIndex", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(-1, sys.Obj.type$.toNullable())]));
      }
      ;
      return;
    }
  }

  #isCombo = false;

  isCombo(it) {
    if (it === undefined) {
      return this.#isCombo;
    }
    else {
      this.#isCombo = it;
      return;
    }
  }

  #mouseDown = false;

  mouseDown(it) {
    if (it === undefined) {
      return this.#mouseDown;
    }
    else {
      this.#mouseDown = it;
      return;
    }
  }

  #_event = null;

  _event(it) {
    if (it === undefined) {
      return this.#_event;
    }
    else {
      this.#_event = it;
      return;
    }
  }

  #popup = null;

  // private field reflection only
  __popup(it) { if (it === undefined) return this.#popup; else this.#popup = it; }

  #cbAction = null;

  // private field reflection only
  __cbAction(it) { if (it === undefined) return this.#cbAction; else this.#cbAction = it; }

  #cbPopup = null;

  // private field reflection only
  __cbPopup(it) { if (it === undefined) return this.#cbPopup; else this.#cbPopup = it; }

  static make() {
    const $self = new Button();
    Button.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    dom.Elem.make$($self);
    ;
    $self.style().addClass("domkit-control domkit-control-button domkit-Button");
    $self.trap("tabIndex", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]));
    $self.onEvent("mousedown", false, (e) => {
      e.stop();
      if (!sys.ObjUtil.coerce(this$.enabled(), sys.Bool.type$)) {
        return;
      }
      ;
      this$.#_event = e;
      this$.#mouseDown = true;
      this$.doMouseDown();
      return;
    });
    $self.onEvent("mouseup", false, (e) => {
      if (!sys.ObjUtil.coerce(this$.enabled(), sys.Bool.type$)) {
        return;
      }
      ;
      this$.#_event = e;
      this$.doMouseUp();
      if (this$.#mouseDown) {
        this$.fireAction(e);
        if (this$.#cbPopup != null) {
          this$.openPopup();
        }
        ;
      }
      ;
      this$.#mouseDown = false;
      return;
    });
    $self.onEvent("mouseleave", false, (e) => {
      if (!this$.#mouseDown) {
        return;
      }
      ;
      this$.#_event = e;
      this$.doMouseUp();
      this$.#mouseDown = false;
      return;
    });
    $self.onEvent("keydown", false, (e) => {
      if (!sys.ObjUtil.coerce(this$.enabled(), sys.Bool.type$)) {
        return;
      }
      ;
      this$.#_event = e;
      if ((sys.ObjUtil.equals(e.key(), dom.Key.space()) || (sys.ObjUtil.is(this$, ListButton.type$) && sys.ObjUtil.equals(e.key(), dom.Key.down())))) {
        this$.doMouseDown();
        if (this$.#cbPopup == null) {
          dom.Win.cur().setTimeout(sys.Duration.fromStr("100ms"), () => {
            this$.fireAction(e);
            this$.doMouseUp();
            return;
          });
        }
        else {
          if (sys.ObjUtil.equals(((this$) => { let $_u0=this$.#popup; return ($_u0==null) ? null : $_u0.isOpen(); })(this$), true)) {
            this$.#popup.close();
          }
          else {
            this$.openPopup();
          }
          ;
        }
        ;
      }
      ;
      return;
    });
    return;
  }

  onAction(f) {
    this.#cbAction = f;
    return;
  }

  onPopup(f) {
    this.#cbPopup = f;
    return;
  }

  removeOnPopup() {
    this.#cbPopup = null;
    return;
  }

  openPopup() {
    const this$ = this;
    if (this.#cbPopup == null) {
      return;
    }
    ;
    if (sys.ObjUtil.equals(((this$) => { let $_u1=this$.#popup; return ($_u1==null) ? null : $_u1.isOpen(); })(this), true)) {
      return;
    }
    ;
    let x = sys.Float.plus(this.pagePos().x(), this.#popupOffset.x());
    let y = sys.Float.plusInt(sys.Float.plus(this.pagePos().y(), this.#popupOffset.y()), sys.Num.toInt(sys.ObjUtil.coerce(this.size().h(), sys.Num.type$)));
    let w = sys.Num.toInt(sys.ObjUtil.coerce(this.size().w(), sys.Num.type$));
    if (this.#isCombo) {
      let combo = this.parent();
      (x = combo.pagePos().x());
      (w = sys.Num.toInt(sys.ObjUtil.coerce(combo.size().w(), sys.Num.type$)));
    }
    ;
    this.showDown();
    this.#popup = sys.ObjUtil.coerce(sys.Func.call(this.#cbPopup, this), Popup.type$.toNullable());
    let $_u2 = this.#popup.halign();
    if (sys.ObjUtil.equals($_u2, Align.center())) {
      x = sys.Float.plusInt(x, sys.Int.div(w, 2));
    }
    else if (sys.ObjUtil.equals($_u2, Align.right())) {
      x = sys.Float.plusInt(x, w);
    }
    ;
    this.#popup._onClose((it) => {
      this$.showUp();
      if (this$.#isCombo) {
        sys.ObjUtil.coerce(this$.parent(), Combo.type$).field().focus();
      }
      else {
        this$.focus();
      }
      ;
      return;
    });
    if (this.#popup.style().effective("min-width") == null) {
      this.#popup.style().trap("minWidth", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(w, sys.Obj.type$.toNullable())), "px")]));
    }
    ;
    this.#popup.open(x, y);
    return;
  }

  showDown() {
    this.style().addClass("down");
    return;
  }

  showUp() {
    this.style().removeClass("down");
    return;
  }

  doMouseDown() {
    this.showDown();
    return;
  }

  doMouseUp() {
    this.showUp();
    return;
  }

  fireAction(e) {
    ((this$) => { let $_u3 = this$.#cbAction; if ($_u3 == null) return null; return sys.Func.call(this$.#cbAction, this$); })(this);
    return;
  }

}

class ToggleButton extends Button {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#selected = false;
    this.#elemOn = null;
    this.#elemOff = null;
    this.#group = null;
    return;
  }

  typeof() { return ToggleButton.type$; }

  #selected = false;

  selected(it) {
    if (it === undefined) {
      return this.#selected;
    }
    else {
      this.#selected = it;
      this.style().toggleClass("selected", sys.ObjUtil.coerce(it, sys.Bool.type$.toNullable()));
      if (it) {
        this.showDown();
        if (this.elemOn() != null) {
          sys.ObjUtil.coerce(this.removeAll(), ToggleButton.type$).add(sys.ObjUtil.coerce(this.elemOn(), dom.Elem.type$));
        }
        ;
      }
      else {
        this.showUp();
        if (this.elemOff() != null) {
          sys.ObjUtil.coerce(this.removeAll(), ToggleButton.type$).add(sys.ObjUtil.coerce(this.elemOff(), dom.Elem.type$));
        }
        ;
      }
      ;
      return;
    }
  }

  #elemOn = null;

  elemOn(it) {
    if (it === undefined) {
      return this.#elemOn;
    }
    else {
      const this$ = this;
      let val = it;
      this.#elemOn = ((this$) => { if (sys.ObjUtil.is(it, dom.Elem.type$)) return val; return sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
        it.text(sys.ObjUtil.toStr(val));
        return;
      }), dom.Elem.type$); })(this);
      return;
    }
  }

  #elemOff = null;

  elemOff(it) {
    if (it === undefined) {
      return this.#elemOff;
    }
    else {
      const this$ = this;
      let val = it;
      this.#elemOff = ((this$) => { if (sys.ObjUtil.is(it, dom.Elem.type$)) return val; return sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
        it.text(sys.ObjUtil.toStr(val));
        return;
      }), dom.Elem.type$); })(this);
      return;
    }
  }

  #group = null;

  group(it) {
    if (it === undefined) {
      return this.#group;
    }
    else {
      this.#group = it;
      return;
    }
  }

  static make() {
    const $self = new ToggleButton();
    ToggleButton.make$($self);
    return $self;
  }

  static make$($self) {
    Button.make$($self);
    ;
    $self.style().addClass("domkit-ToggleButton");
    return;
  }

  doMouseUp() {
    if (this.mouseDown()) {
      this.selected(!this.selected());
      if (this.#group != null) {
        this.#group._event(this._event());
        this.#group.select(this);
      }
      ;
    }
    ;
    return;
  }

}

class Box extends dom.Elem {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
  }

  typeof() { return Box.type$; }

  static make() {
    const $self = new Box();
    Box.make$($self);
    return $self;
  }

  static make$($self) {
    dom.Elem.make$($self, "div");
    $self.style().addClass("domkit-Box");
    return;
  }

}

class SashBox extends Box {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#dir = Dir.right();
    this.#resizable = false;
    this.#sizes = sys.List.make(sys.Str.type$);
    this.#minSize = "10%";
    this.#dims = sys.ObjUtil.coerce(dom.CssDim.type$.emptyList(), sys.Type.find("dom::CssDim[]"));
    this.#active = false;
    return;
  }

  typeof() { return SashBox.type$; }

  #dir = null;

  dir(it) {
    if (it === undefined) {
      return this.#dir;
    }
    else {
      this.#dir = it;
      return;
    }
  }

  #resizable = false;

  resizable(it) {
    if (it === undefined) {
      return this.#resizable;
    }
    else {
      this.#resizable = it;
      return;
    }
  }

  #sizes = null;

  sizes(it) {
    if (it === undefined) {
      return this.#sizes;
    }
    else {
      const this$ = this;
      this.#sizes = it;
      this.#dims = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(it.map((s) => {
        return dom.CssDim.fromStr(s);
      }, sys.Obj.type$.toNullable())), sys.Type.find("sys::Obj?[]")), sys.Type.find("dom::CssDim[]"));
      this.applyStyle();
      return;
    }
  }

  #minSize = null;

  minSize(it) {
    if (it === undefined) {
      return this.#minSize;
    }
    else {
      this.#minSize = it;
      return;
    }
  }

  #dims = null;

  // private field reflection only
  __dims(it) { if (it === undefined) return this.#dims; else this.#dims = it; }

  #active = false;

  // private field reflection only
  __active(it) { if (it === undefined) return this.#active; else this.#active = it; }

  #resizeIndex = null;

  // private field reflection only
  __resizeIndex(it) { if (it === undefined) return this.#resizeIndex; else this.#resizeIndex = it; }

  #pivoff = null;

  // private field reflection only
  __pivoff(it) { if (it === undefined) return this.#pivoff; else this.#pivoff = it; }

  #splitter = null;

  // private field reflection only
  __splitter(it) { if (it === undefined) return this.#splitter; else this.#splitter = it; }

  #cbSashResize = null;

  // private field reflection only
  __cbSashResize(it) { if (it === undefined) return this.#cbSashResize; else this.#cbSashResize = it; }

  static make() {
    const $self = new SashBox();
    SashBox.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    Box.make$($self);
    ;
    $self.style().addClass("domkit-SashBox");
    $self.onEvent("mousedown", true, (e) => {
      this$.onMouseDown(e);
      return;
    });
    $self.onEvent("mouseup", true, (e) => {
      this$.onMouseUp(e);
      return;
    });
    $self.onEvent("mousemove", true, (e) => {
      this$.onMouseMove(e);
      return;
    });
    return;
  }

  onSashResize(f) {
    this.#cbSashResize = f;
    return;
  }

  static div() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(Box.make(), (it) => {
      it.style().addClass("domkit-SashBox-div");
      return;
    }), Box.type$);
  }

  onAdd(c) {
    this.applyStyle();
    return;
  }

  onRemove(c) {
    this.applyStyle();
    return;
  }

  applyStyle() {
    const this$ = this;
    let fixed = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Float"));
    this.#dims.each((d) => {
      if (sys.ObjUtil.equals(d.unit(), "%")) {
        return;
      }
      ;
      fixed.set(d.unit(), sys.ObjUtil.coerce(sys.Float.plus(sys.ObjUtil.coerce(((this$) => { let $_u6 = fixed.get(d.unit()); if ($_u6 != null) return $_u6; return sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Float.type$.toNullable()); })(this$), sys.Float.type$), sys.Num.toFloat(d.val())), sys.Obj.type$.toNullable()));
      return;
    });
    let kids = this.children();
    kids.each((kid,i) => {
      let d = this$.#dims.getSafe(i);
      if (d == null) {
        return;
      }
      ;
      let css = d.toStr();
      if ((sys.ObjUtil.equals(d.unit(), "%") && sys.ObjUtil.compareGT(fixed.size(), 0))) {
        let per = fixed.join(" - ", (sum,unit) => {
          return sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Float.mult(sys.Float.div(sys.Num.toFloat(d.val()), sys.Float.make(100.0)), sum), sys.Obj.type$.toNullable())), ""), unit);
        });
        (css = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("calc(", d.toStr()), " - "), per), ")"));
      }
      ;
      kid.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), [((this$) => { if (sys.ObjUtil.equals(css, "0px")) return "none"; return ((this$) => { if (sys.ObjUtil.is(kid, FlexBox.type$)) return "flex"; return "block"; })(this$); })(this$)]));
      let vert = sys.ObjUtil.equals(this$.#dir, Dir.down());
      kid.style().trap("float", sys.List.make(sys.Obj.type$.toNullable(), [((this$) => { if (vert) return "none"; return "left"; })(this$)]));
      kid.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), [((this$) => { if (vert) return "100%"; return css; })(this$)]));
      kid.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), [((this$) => { if (vert) return css; return "100%"; })(this$)]));
      return;
    });
    return;
  }

  onMouseDown(e) {
    const this$ = this;
    if (!this.#resizable) {
      return;
    }
    ;
    if (this.#resizeIndex == null) {
      return;
    }
    ;
    e.stop();
    let div = this.children().get(sys.Int.plus(sys.ObjUtil.coerce(this.#resizeIndex, sys.Int.type$), 1));
    this.#active = true;
    this.#splitter = sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
      it.style().addClass("domkit-resize-splitter");
      return;
    }), dom.Elem.type$);
    if (sys.ObjUtil.equals(this.#dir, Dir.down())) {
      this.#pivoff = sys.ObjUtil.coerce(sys.Float.minus(this.relPos(e.pagePos()).y(), div.pos().y()), sys.Float.type$.toNullable());
      this.#splitter.style().trap("top", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(div.pos().y(), sys.Obj.type$.toNullable())), "px")]));
      this.#splitter.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), ["100%"]));
      this.#splitter.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(div.size().h(), sys.Obj.type$.toNullable())), "px")]));
    }
    else {
      this.#pivoff = sys.ObjUtil.coerce(sys.Float.minus(this.relPos(e.pagePos()).x(), div.pos().x()), sys.Float.type$.toNullable());
      this.#splitter.style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(div.pos().x(), sys.Obj.type$.toNullable())), "px")]));
      this.#splitter.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(div.size().w(), sys.Obj.type$.toNullable())), "px")]));
      this.#splitter.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), ["100%"]));
    }
    ;
    let doc = dom.Win.cur().doc();
    let fmove = null;
    let fup = null;
    (fmove = doc.onEvent("mousemove", true, (de) => {
      this$.onMouseMove(de);
      return;
    }));
    (fup = doc.onEvent("mouseup", true, (de) => {
      this$.onMouseUp(de);
      de.stop();
      doc.removeEvent("mousemove", true, sys.ObjUtil.coerce(fmove, sys.Type.find("sys::Func")));
      doc.removeEvent("mouseup", true, sys.ObjUtil.coerce(fup, sys.Type.find("sys::Func")));
      return;
    }));
    this.add(sys.ObjUtil.coerce(this.#splitter, dom.Elem.type$));
    return;
  }

  onMouseUp(e) {
    if (!this.#resizable) {
      return;
    }
    ;
    if (!this.#active) {
      return;
    }
    ;
    let p = this.relPos(e.pagePos());
    let kids = this.children();
    if (sys.ObjUtil.equals(this.#dir, Dir.down())) {
      let y = 0;
      for (let i = 0; sys.ObjUtil.compareLE(i, this.#resizeIndex); ((this$) => { let $_u12 = i;i = sys.Int.increment(i); return $_u12; })(this)) {
        y = sys.Int.plus(y, sys.Num.toInt(sys.ObjUtil.coerce(kids.get(i).size().h(), sys.Num.type$)));
      }
      ;
      this.applyResize(sys.ObjUtil.coerce(this.#resizeIndex, sys.Int.type$), sys.Float.minus(sys.Float.minusInt(p.y(), y), sys.ObjUtil.coerce(this.#pivoff, sys.Float.type$)));
    }
    else {
      let x = 0;
      for (let i = 0; sys.ObjUtil.compareLE(i, this.#resizeIndex); ((this$) => { let $_u13 = i;i = sys.Int.increment(i); return $_u13; })(this)) {
        x = sys.Int.plus(x, sys.Num.toInt(sys.ObjUtil.coerce(kids.get(i).size().w(), sys.Num.type$)));
      }
      ;
      this.applyResize(sys.ObjUtil.coerce(this.#resizeIndex, sys.Int.type$), sys.Float.minus(sys.Float.minusInt(p.x(), x), sys.ObjUtil.coerce(this.#pivoff, sys.Float.type$)));
    }
    ;
    this.#active = false;
    this.#resizeIndex = null;
    this.remove(sys.ObjUtil.coerce(this.#splitter, dom.Elem.type$));
    return;
  }

  onMouseMove(e) {
    const this$ = this;
    if (!this.#resizable) {
      return;
    }
    ;
    let p = this.relPos(e.pagePos());
    if (this.#active) {
      if (sys.ObjUtil.equals(this.#dir, Dir.down())) {
        let sy = sys.Float.min(sys.Float.max(sys.Float.make(0.0), sys.Float.minus(p.y(), sys.ObjUtil.coerce(this.#pivoff, sys.Float.type$))), sys.Float.minus(this.size().h(), this.#splitter.size().h()));
        this.#splitter.style().trap("top", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sy, sys.Obj.type$.toNullable())), "px")]));
        e.stop();
      }
      else {
        let sx = sys.Float.min(sys.Float.max(sys.Float.make(0.0), sys.Float.minus(p.x(), sys.ObjUtil.coerce(this.#pivoff, sys.Float.type$))), sys.Float.minus(this.size().w(), this.#splitter.size().w()));
        this.#splitter.style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sx, sys.Obj.type$.toNullable())), "px")]));
        e.stop();
      }
      ;
      return;
    }
    else {
      let div = this.toDiv(e.target());
      if (div != null) {
        this.style().trap("cursor", sys.List.make(sys.Obj.type$.toNullable(), [((this$) => { if (sys.ObjUtil.equals(this$.#dir, Dir.down())) return "row-resize"; return "col-resize"; })(this)]));
        this.#resizeIndex = sys.ObjUtil.coerce(sys.Int.max(0, sys.Int.minus(sys.ObjUtil.coerce(this.children().findIndex((c) => {
          return sys.ObjUtil.equals(c, div);
        }), sys.Int.type$), 1)), sys.Int.type$.toNullable());
      }
      else {
        this.style().trap("cursor", sys.List.make(sys.Obj.type$.toNullable(), ["default"]));
        this.#resizeIndex = null;
      }
      ;
    }
    ;
    return;
  }

  toDiv(elem) {
    while (elem != null) {
      if ((elem.style().hasClass("domkit-SashBox-div") && sys.ObjUtil.equals(elem.parent(), this))) {
        return elem;
      }
      ;
      (elem = elem.parent());
    }
    ;
    return null;
  }

  applyResize(index,delta) {
    this.sizesToPercent();
    let da = this.#dims.get(index);
    let db = this.#dims.get(sys.Int.plus(index, 2));
    let min = sys.Num.toFloat(dom.CssDim.fromStr(this.#minSize).val());
    let dav = sys.Num.toFloat(da.val());
    let dbv = sys.Num.toFloat(db.val());
    if (sys.ObjUtil.compareLE(sys.Float.plus(dav, dbv), sys.Float.plus(min, min))) {
      return;
    }
    ;
    let working = this.sizes().dup();
    let sz = ((this$) => { if (sys.ObjUtil.equals(this$.#dir, Dir.down())) return this$.size().h(); return this$.size().w(); })(this);
    let dp = sys.Float.mult(sys.Float.div(delta, sz), sys.Float.make(100.0));
    let av = sys.Str.toFloat(sys.Float.toLocale(sys.Float.plus(dav, dp), "0.00", sys.Locale.en()));
    let bv = sys.Str.toFloat(sys.Float.toLocale(sys.Float.minus(sys.Float.plus(dav, dbv), sys.ObjUtil.coerce(av, sys.Float.type$)), "0.00", sys.Locale.en()));
    if (sys.ObjUtil.compareLT(av, min)) {
      (av = sys.ObjUtil.coerce(min, sys.Float.type$.toNullable()));
      (bv = sys.Str.toFloat(sys.Float.toLocale(sys.Float.minus(sys.Float.plus(dav, dbv), sys.ObjUtil.coerce(av, sys.Float.type$)), "0.00", sys.Locale.en())));
    }
    else {
      if (sys.ObjUtil.compareLT(bv, min)) {
        (bv = sys.ObjUtil.coerce(min, sys.Float.type$.toNullable()));
        (av = sys.Str.toFloat(sys.Float.toLocale(sys.Float.minus(sys.Float.plus(dav, dbv), sys.ObjUtil.coerce(bv, sys.Float.type$)), "0.00", sys.Locale.en())));
      }
      ;
    }
    ;
    working.set(index, sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(av, sys.Obj.type$.toNullable())), "%"));
    working.set(sys.Int.plus(index, 2), sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(bv, sys.Obj.type$.toNullable())), "%"));
    this.sizes(working);
    this.applyStyle();
    ((this$) => { let $_u16 = this$.#cbSashResize; if ($_u16 == null) return null; return sys.Func.call(this$.#cbSashResize, this$); })(this);
    return;
  }

  sizesToPercent() {
    const this$ = this;
    if (this.#dims.all((d) => {
      return sys.ObjUtil.equals(d.unit(), "%");
    })) {
      return;
    }
    ;
    let sz = ((this$) => { if (sys.ObjUtil.equals(this$.#dir, Dir.down())) return this$.size().h(); return this$.size().w(); })(this);
    let converted = sys.List.make(dom.CssDim.type$);
    let remainder = sys.Float.make(100.0);
    let kids = this.children();
    this.#dims.each((d,i) => {
      if (sys.ObjUtil.equals(d.unit(), "%")) {
        converted.add(dom.CssDim.defVal());
        return;
      }
      ;
      let ksz = ((this$) => { let $_u18 = ((this$) => { let $_u19=kids.getSafe(i); return ($_u19==null) ? null : $_u19.size(); })(this$); if ($_u18 != null) return $_u18; return graphics.Size.defVal(); })(this$);
      let kval = ((this$) => { if (sys.ObjUtil.equals(this$.#dir, Dir.down())) return ksz.h(); return ksz.w(); })(this$);
      let val = sys.Str.toFloat(sys.Float.toLocale(sys.Float.mult(sys.Float.div(kval, sys.Num.toFloat(sys.ObjUtil.coerce(sz, sys.Num.type$))), sys.Float.make(100.0)), "0.00", sys.Locale.en()));
      converted.add(dom.CssDim.make(sys.ObjUtil.coerce(val, sys.Num.type$), "%"));
      remainder = sys.Float.minus(remainder, sys.ObjUtil.coerce(val, sys.Float.type$));
      return;
    });
    this.#dims.each((d,i) => {
      if (sys.ObjUtil.compareNE(d.unit(), "%")) {
        return;
      }
      ;
      let val = sys.Str.toFloat(sys.Float.toLocale(sys.Float.div(sys.Float.mult(sys.Num.toFloat(d.val()), remainder), sys.Float.make(100.0)), "0.00", sys.Locale.en()));
      converted.set(i, dom.CssDim.make(sys.ObjUtil.coerce(val, sys.Num.type$), "%"));
      return;
    });
    let sum = sys.Float.make(0.0);
    converted.each((d) => {
      sum = sys.Float.plus(sum, sys.Num.toFloat(d.val()));
      return;
    });
    if (sys.ObjUtil.compareGT(sum, sys.Float.make(100.0))) {
      converted.set(-1, dom.CssDim.make(sys.ObjUtil.coerce(sys.Float.minus(sys.Num.toFloat(converted.last().val()), sys.Float.minus(sum, sys.Float.make(100.0))), sys.Num.type$), "%"));
    }
    ;
    this.sizes(sys.ObjUtil.coerce(converted.map((c) => {
      return c.toStr();
    }, sys.Obj.type$.toNullable()), sys.Type.find("sys::Str[]")));
    return;
  }

}

class TextField extends dom.Elem {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#cbAction = null;
    this.#cbModify = null;
    return;
  }

  typeof() { return TextField.type$; }

  #cols = null;

  cols(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.trap("size", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$.toNullable());
    }
    else {
      this.trap("size", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(it, sys.Obj.type$.toNullable())]));
      return;
    }
  }

  #placeholder = null;

  placeholder(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.trap("placeholder", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$.toNullable());
    }
    else {
      this.trap("placeholder", sys.List.make(sys.Obj.type$.toNullable(), [it]));
      return;
    }
  }

  #ro = false;

  ro(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.prop("readOnly"), sys.Bool.type$);
    }
    else {
      this.setProp("readOnly", sys.ObjUtil.coerce(it, sys.Obj.type$.toNullable()));
      return;
    }
  }

  #password = false;

  password(it) {
    if (it === undefined) {
      return sys.ObjUtil.equals(this.trap("type", sys.List.make(sys.Obj.type$.toNullable(), [])), "password");
    }
    else {
      this.trap("type", sys.List.make(sys.Obj.type$.toNullable(), [((this$) => { if (it) return "password"; return "text"; })(this)]));
      return;
    }
  }

  #val = null;

  val(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.trap("value", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
    }
    else {
      this.trap("value", sys.List.make(sys.Obj.type$.toNullable(), [it]));
      this.checkUpdate();
      return;
    }
  }

  #cbAction = null;

  // private field reflection only
  __cbAction(it) { if (it === undefined) return this.#cbAction; else this.#cbAction = it; }

  #cbModify = null;

  // private field reflection only
  __cbModify(it) { if (it === undefined) return this.#cbModify; else this.#cbModify = it; }

  static make() {
    const $self = new TextField();
    TextField.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    dom.Elem.make$($self, "input");
    ;
    $self.set("type", "text");
    $self.style().addClass("domkit-control domkit-control-text domkit-TextField");
    $self.onEvent("input", false, (e) => {
      this$.checkUpdate();
      this$.fireModify(e);
      return;
    });
    $self.onEvent("keydown", false, (e) => {
      this$.onKeyDown(e);
      return;
    });
    return;
  }

  onModify(f) {
    this.#cbModify = f;
    return;
  }

  onAction(f) {
    this.#cbAction = f;
    return;
  }

  select(start,end) {
    this.setProp("selectionStart", sys.ObjUtil.coerce(start, sys.Obj.type$.toNullable()));
    this.setProp("selectionEnd", sys.ObjUtil.coerce(end, sys.Obj.type$.toNullable()));
    return;
  }

  onKeyDown(e) {
    if (sys.ObjUtil.equals(e.key(), dom.Key.enter())) {
      this.fireAction(e);
    }
    ;
    return;
  }

  fireAction(e) {
    ((this$) => { let $_u22 = this$.#cbAction; if ($_u22 == null) return null; return sys.Func.call(this$.#cbAction, this$); })(this);
    return;
  }

  fireModify(e) {
    ((this$) => { let $_u23 = this$.#cbModify; if ($_u23 == null) return null; return sys.Func.call(this$.#cbModify, this$); })(this);
    return;
  }

  checkUpdate() {
    if (sys.ObjUtil.is(this.parent(), Combo.type$)) {
      sys.ObjUtil.coerce(this.parent(), Combo.type$).update(sys.Str.trim(this.val()));
    }
    ;
    return;
  }

}

class RadioButton extends dom.Elem {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#cbAction = null;
    this.#group = null;
    return;
  }

  typeof() { return RadioButton.type$; }

  #checked = false;

  checked(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.trap("checked", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Bool.type$);
    }
    else {
      this.trap("checked", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(it, sys.Obj.type$.toNullable())]));
      return;
    }
  }

  #cbAction = null;

  // private field reflection only
  __cbAction(it) { if (it === undefined) return this.#cbAction; else this.#cbAction = it; }

  #group = null;

  group(it) {
    if (it === undefined) {
      return this.#group;
    }
    else {
      this.#group = it;
      return;
    }
  }

  static make() {
    const $self = new RadioButton();
    RadioButton.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    dom.Elem.make$($self, "input");
    ;
    $self.set("type", "radio");
    $self.style().addClass("domkit-RadioButton");
    $self.onEvent("change", false, (e) => {
      this$.fireAction(e);
      return;
    });
    return;
  }

  wrap(content) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make("label"), (it) => {
      it.add(this$).add(sys.ObjUtil.coerce(((this$) => { if (sys.ObjUtil.is(content, dom.Elem.type$)) return content; return sys.ObjUtil.coerce(sys.ObjUtil.with(Label.make(), (it) => {
        it.text(sys.ObjUtil.toStr(content));
        return;
      }), Label.type$); })(this$), dom.Elem.type$));
      return;
    }), dom.Elem.type$);
  }

  onAction(f) {
    this.#cbAction = f;
    return;
  }

  fireAction(e) {
    if (this.#group != null) {
      this.#group._event(e);
      this.#group.select(this);
    }
    ;
    ((this$) => { let $_u25 = this$.#cbAction; if ($_u25 == null) return null; return sys.Func.call(this$.#cbAction, this$); })(this);
    return;
  }

}

class ListButton extends Button {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#items = sys.Obj.type$.emptyList();
    this.#cbSelect = null;
    this.#cbElem = null;
    this.#find = "";
    return;
  }

  typeof() { return ListButton.type$; }

  #items = null;

  items(it) {
    if (it === undefined) {
      return this.#items;
    }
    else {
      this.#items = it;
      this.#sel.index(((this$) => { if (sys.ObjUtil.equals(it.size(), 0)) return null; return sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()); })(this));
      this.update();
      return;
    }
  }

  #sel = null;

  sel() {
    return this.#sel;
  }

  #cbSelect = null;

  // private field reflection only
  __cbSelect(it) { if (it === undefined) return this.#cbSelect; else this.#cbSelect = it; }

  #cbElem = null;

  // private field reflection only
  __cbElem(it) { if (it === undefined) return this.#cbElem; else this.#cbElem = it; }

  #find = null;

  // private field reflection only
  __find(it) { if (it === undefined) return this.#find; else this.#find = it; }

  #menu = null;

  // private field reflection only
  __menu(it) { if (it === undefined) return this.#menu; else this.#menu = it; }

  static make() {
    const $self = new ListButton();
    ListButton.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    Button.make$($self);
    ;
    $self.style().addClass("domkit-ListButton disclosure-list");
    $self.#sel = ListButtonSelection.make($self);
    $self.onPopup((it) => {
      return this$.makeListbox();
    });
    $self.update();
    $self.popupOffset(graphics.Point.makeInt(-12, 0));
    return;
  }

  onSelect(f) {
    this.#cbSelect = f;
    return;
  }

  onElem(f) {
    this.#cbElem = f;
    this.update();
    return;
  }

  update() {
    const this$ = this;
    if (this.isCombo()) {
      return;
    }
    ;
    this.removeAll();
    if ((sys.ObjUtil.equals(this.items().size(), 0) || this.#sel.item() == null)) {
      this.add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
        it.text("\u200b");
        return;
      }), dom.Elem.type$));
    }
    else {
      this.add(this.makeElem(sys.ObjUtil.coerce(this.#sel.item(), sys.Obj.type$)));
    }
    ;
    return;
  }

  fireSelect() {
    ((this$) => { let $_u27 = this$.#cbSelect; if ($_u27 == null) return null; return sys.Func.call(this$.#cbSelect, this$); })(this);
    return;
  }

  makeListbox() {
    const this$ = this;
    this.#find = "";
    this.#menu = sys.ObjUtil.coerce(sys.ObjUtil.with(Menu.make(), (it) => {
      return;
    }), Menu.type$);
    this.items().each((item,i) => {
      let elem = this$.makeElem(item);
      this$.#menu.add(sys.ObjUtil.coerce(sys.ObjUtil.with(MenuItem.make(), (it) => {
        if (!this$.isCombo()) {
          it.style().addClass("domkit-ListButton-MenuItem");
          if (sys.ObjUtil.equals(this$.#sel.index(), i)) {
            it.style().addClass("sel");
          }
          ;
        }
        ;
        it.add(elem);
        it.onAction((it) => {
          this$.#sel.index(sys.ObjUtil.coerce(i, sys.Int.type$.toNullable()));
          this$.fireSelect();
          return;
        });
        return;
      }), MenuItem.type$));
      if (elem.style().hasClass("disabled")) {
        this$.#menu.lastChild().enabled(sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()));
      }
      ;
      return;
    });
    this.#menu.select(this.#sel.index());
    this.#menu.onCustomKeyDown((e) => {
      this$.onMenuKeyDown(e);
      return;
    });
    return sys.ObjUtil.coerce(this.#menu, Popup.type$);
  }

  makeElem(item) {
    const this$ = this;
    let v = ((this$) => { if (this$.#cbElem == null) return sys.ObjUtil.toStr(item); return sys.Func.call(this$.#cbElem, item); })(this);
    return sys.ObjUtil.coerce(((this$) => { if (sys.ObjUtil.is(v, dom.Elem.type$)) return v; return sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
      it.text(sys.ObjUtil.toStr(v));
      return;
    }), dom.Elem.type$); })(this), dom.Elem.type$);
  }

  onMenuKeyDown(e) {
    const this$ = this;
    if (sys.Int.isAlphaNum(e.key().code())) {
      this.#find = sys.Str.plus(this.#find, sys.Str.lower(sys.Int.toChar(e.key().code())));
      let ix = this.items().findIndex((i) => {
        return sys.Str.startsWith(sys.Str.lower(sys.ObjUtil.toStr(i)), this$.#find);
      });
      if (ix != null) {
        this.#menu.select(ix);
      }
      ;
    }
    ;
    return;
  }

}

class Selection extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#enabled = true;
    this.#multi = false;
    return;
  }

  typeof() { return Selection.type$; }

  #enabled = false;

  enabled(it) {
    if (it === undefined) {
      return this.#enabled;
    }
    else {
      this.#enabled = it;
      return;
    }
  }

  #multi = false;

  multi(it) {
    if (it === undefined) {
      return this.#multi;
    }
    else {
      this.#multi = it;
      this.refresh();
      return;
    }
  }

  #item = null;

  item(it) {
    if (it === undefined) {
    }
    else {
    }
  }

  #items = null;

  items(it) {
    if (it === undefined) {
    }
    else {
    }
  }

  #index = null;

  index(it) {
    if (it === undefined) {
    }
    else {
    }
  }

  #indexes = null;

  indexes(it) {
    if (it === undefined) {
    }
    else {
    }
  }

  clear() {
    this.items(sys.List.make(sys.Obj.type$));
    return;
  }

  refresh() {
    return;
  }

  static make() {
    const $self = new Selection();
    Selection.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class IndexSelection extends Selection {
  constructor() {
    super();
    const this$ = this;
    this.#indexes = sys.List.make(sys.Int.type$);
    return;
  }

  typeof() { return IndexSelection.type$; }

  #item = null;

  item(it) {
    if (it === undefined) {
      return this.items().first();
    }
    else {
      this.items(((this$) => { if (it == null) return sys.List.make(sys.Obj.type$); return sys.List.make(sys.Obj.type$.toNullable(), [it]); })(this));
      return;
    }
  }

  #items = null;

  items(it) {
    if (it === undefined) {
      return this.toItems(this.indexes());
    }
    else {
      this.indexes(this.toIndexes(it));
      return;
    }
  }

  #index = null;

  index(it) {
    if (it === undefined) {
      return this.indexes().first();
    }
    else {
      this.indexes(((this$) => { if (it == null) return sys.List.make(sys.Int.type$); return sys.List.make(sys.Int.type$.toNullable(), [sys.ObjUtil.coerce(it, sys.Obj.type$.toNullable())]); })(this));
      return;
    }
  }

  #indexes = null;

  indexes(it) {
    if (it === undefined) {
      return this.#indexes;
    }
    else {
      if (!this.enabled()) {
        return;
      }
      ;
      let oldIndexes = this.#indexes;
      let newIndexes = this.checkIndexes(it).sort().ro();
      this.#indexes = newIndexes;
      this.onUpdate(oldIndexes, newIndexes);
      return;
    }
  }

  isEmpty() {
    return this.indexes().isEmpty();
  }

  size() {
    return this.indexes().size();
  }

  refresh() {
    let temp = this.indexes();
    this.indexes(temp);
    return;
  }

  checkIndexes(indexes) {
    const this$ = this;
    let checked = indexes.findAll((index) => {
      return (sys.ObjUtil.compareLE(0, index) && sys.ObjUtil.compareLT(index, this$.max()));
    });
    if ((!this.multi() && sys.ObjUtil.compareGT(checked.size(), 1))) {
      (checked = sys.List.make(sys.Int.type$.toNullable(), [sys.ObjUtil.coerce(checked.first(), sys.Obj.type$.toNullable())]));
    }
    ;
    return checked;
  }

  toItems(indexes) {
    const this$ = this;
    let max = this.max();
    let acc = sys.List.make(sys.Obj.type$);
    acc.capacity(indexes.size());
    indexes.each((index) => {
      if (sys.ObjUtil.compareLT(index, max)) {
        let item = this$.toItem(index);
        acc.add(item);
      }
      ;
      return;
    });
    return acc;
  }

  toIndexes(items) {
    const this$ = this;
    let acc = sys.List.make(sys.Int.type$);
    acc.capacity(items.size());
    items.each((item) => {
      let index = this$.toIndex(item);
      if (index != null) {
        acc.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(index, sys.Int.type$), sys.Obj.type$.toNullable()));
      }
      ;
      return;
    });
    return acc;
  }

  static make() {
    const $self = new IndexSelection();
    IndexSelection.make$($self);
    return $self;
  }

  static make$($self) {
    Selection.make$($self);
    ;
    return;
  }

}

class ListButtonSelection extends IndexSelection {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ListButtonSelection.type$; }

  #button = null;

  // private field reflection only
  __button(it) { if (it === undefined) return this.#button; else this.#button = it; }

  static make(button) {
    const $self = new ListButtonSelection();
    ListButtonSelection.make$($self,button);
    return $self;
  }

  static make$($self,button) {
    IndexSelection.make$($self);
    $self.#button = button;
    return;
  }

  max() {
    return this.#button.items().size();
  }

  toItem(index) {
    return this.#button.items().get(index);
  }

  toIndex(item) {
    const this$ = this;
    return this.#button.items().findIndex((i) => {
      return sys.ObjUtil.equals(i, item);
    });
  }

  onUpdate(oldIndexes,newIndexes) {
    this.#button.update();
    return;
  }

}

class TreeNode extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#expanded = false;
    return;
  }

  typeof() { return TreeNode.type$; }

  #parent = null;

  parent(it) {
    if (it === undefined) {
      return this.#parent;
    }
    else {
      this.#parent = it;
      return;
    }
  }

  #depth = null;

  depth(it) {
    if (it === undefined) {
      return this.#depth;
    }
    else {
      this.#depth = it;
      return;
    }
  }

  #elem = null;

  elem(it) {
    if (it === undefined) {
      return this.#elem;
    }
    else {
      this.#elem = it;
      return;
    }
  }

  #expanded = false;

  expanded(it) {
    if (it === undefined) {
      return this.#expanded;
    }
    else {
      this.#expanded = it;
      return;
    }
  }

  isExpanded() {
    return this.#expanded;
  }

  hasChildren() {
    return !this.children().isEmpty();
  }

  children() {
    return sys.ObjUtil.coerce(TreeNode.type$.emptyList(), sys.Type.find("domkit::TreeNode[]"));
  }

  static make() {
    const $self = new TreeNode();
    TreeNode.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class TreeFlags extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TreeFlags.type$; }

  #focused = false;

  focused() { return this.#focused; }

  __focused(it) { if (it === undefined) return this.#focused; else this.#focused = it; }

  #selected = false;

  selected() { return this.#selected; }

  __selected(it) { if (it === undefined) return this.#selected; else this.#selected = it; }

  static make(f) {
    const $self = new TreeFlags();
    TreeFlags.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    sys.Func.call(f, $self);
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("TreeFlags { focused=", sys.ObjUtil.coerce(this.#focused, sys.Obj.type$.toNullable())), "; selected="), sys.ObjUtil.coerce(this.#selected, sys.Obj.type$.toNullable())), " }");
  }

}

class TreeEvent extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TreeEvent.type$; }

  #tree = null;

  tree() {
    return this.#tree;
  }

  #node = null;

  node() {
    return this.#node;
  }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #pagePos = null;

  pagePos() { return this.#pagePos; }

  __pagePos(it) { if (it === undefined) return this.#pagePos; else this.#pagePos = it; }

  #nodePos = null;

  nodePos() { return this.#nodePos; }

  __nodePos(it) { if (it === undefined) return this.#nodePos; else this.#nodePos = it; }

  #size = null;

  size() { return this.#size; }

  __size(it) { if (it === undefined) return this.#size; else this.#size = it; }

  static make(t,n,f) {
    const $self = new TreeEvent();
    TreeEvent.make$($self,t,n,f);
    return $self;
  }

  static make$($self,t,n,f) {
    $self.#tree = t;
    $self.#node = n;
    sys.Func.call(f, $self);
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("TreeNode { node=", this.#node), " type="), this.#type), " pagePos="), this.#pagePos), " nodePos="), this.#nodePos), " size="), this.#size), " }");
  }

}

class Tree extends Box {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#roots = sys.List.make(TreeNode.type$);
    this.#nodes = sys.List.make(TreeNode.type$);
    this.#cbTreeEvent = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Func"));
    this.#manFocus = false;
    return;
  }

  typeof() { return Tree.type$; }

  #roots = null;

  roots(it) {
    if (it === undefined) {
      return this.#roots;
    }
    else {
      this.#roots = it;
      return;
    }
  }

  #sel = null;

  sel() {
    return this.#sel;
  }

  static #depthIndent = undefined;

  static depthIndent() {
    if (Tree.#depthIndent === undefined) {
      Tree.static$init();
      if (Tree.#depthIndent === undefined) Tree.#depthIndent = 0;
    }
    return Tree.#depthIndent;
  }

  #nodes = null;

  // private field reflection only
  __nodes(it) { if (it === undefined) return this.#nodes; else this.#nodes = it; }

  #cbSelect = null;

  // private field reflection only
  __cbSelect(it) { if (it === undefined) return this.#cbSelect; else this.#cbSelect = it; }

  #cbAction = null;

  // private field reflection only
  __cbAction(it) { if (it === undefined) return this.#cbAction; else this.#cbAction = it; }

  #cbTreeEvent = null;

  // private field reflection only
  __cbTreeEvent(it) { if (it === undefined) return this.#cbTreeEvent; else this.#cbTreeEvent = it; }

  #manFocus = false;

  // private field reflection only
  __manFocus(it) { if (it === undefined) return this.#manFocus; else this.#manFocus = it; }

  static make() {
    const $self = new Tree();
    Tree.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    Box.make$($self);
    ;
    $self.#sel = TreeSelection.make($self);
    $self.trap("tabIndex", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]));
    $self.style().addClass("domkit-Tree domkit-border");
    $self.onEvent("mousedown", false, (e) => {
      this$.onMouseEvent(e);
      return;
    });
    $self.onEvent("mouseup", false, (e) => {
      this$.onMouseEvent(e);
      return;
    });
    $self.onEvent("dblclick", false, (e) => {
      this$.onMouseEvent(e);
      return;
    });
    $self.onEvent("focus", false, (e) => {
      this$.#manFocus = true;
      this$.refresh();
      return;
    });
    $self.onEvent("blur", false, (e) => {
      this$.#manFocus = false;
      this$.refresh();
      return;
    });
    return;
  }

  rebuild() {
    const this$ = this;
    if (sys.ObjUtil.compareGT(this.size().w(), sys.Float.make(0.0))) {
      this.doRebuild();
    }
    else {
      dom.Win.cur().setTimeout(sys.Duration.fromStr("16ms"), () => {
        this$.rebuild();
        return;
      });
    }
    ;
    return;
  }

  refresh() {
    const this$ = this;
    this.#roots.each((r) => {
      this$.refreshNode(r);
      return;
    });
    return;
  }

  refreshNode(node) {
    this.doRefreshNode(node);
    return;
  }

  expand(node,expanded) {
    if (sys.ObjUtil.equals(node.expanded(), expanded)) {
      return;
    }
    ;
    node.expanded(expanded);
    this.refreshNode(node);
    return;
  }

  displayState(node,state) {
    let content = node.elem().querySelector(".domkit-Tree-node");
    content.style().removeClass("down");
    if (sys.ObjUtil.equals(state, "down")) {
      content.style().addClass("down");
    }
    ;
    return;
  }

  onSelect(f) {
    this.#cbSelect = f;
    return;
  }

  onAction(f) {
    this.#cbAction = f;
    return;
  }

  onTreeEvent(type,f) {
    this.#cbTreeEvent.set(type, f);
    return;
  }

  doRebuild() {
    const this$ = this;
    this.removeAll();
    this.#roots.each((r) => {
      this$.add(this$.toElem(null, r));
      return;
    });
    return;
  }

  doRefreshNode(node) {
    const this$ = this;
    if (node.elem() == null) {
      return;
    }
    ;
    node.elem().style().toggleClass("expanded", sys.ObjUtil.coerce(node.expanded(), sys.Bool.type$.toNullable()));
    let expander = node.elem().querySelector(".domkit-Tree-node-expander");
    expander.style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Int.mult(sys.ObjUtil.coerce(node.depth(), sys.Int.type$), Tree.depthIndent()), sys.Obj.type$.toNullable())), "px")]));
    expander.html(((this$) => { if (node.hasChildren()) return "\u25ba"; return "&nbsp;"; })(this));
    while (sys.ObjUtil.compareGT(node.elem().children().size(), 1)) {
      node.elem().remove(sys.ObjUtil.coerce(node.elem().lastChild(), dom.Elem.type$));
    }
    ;
    let selected = this.#sel.items().contains(node);
    let content = node.elem().querySelector(".domkit-Tree-node");
    content.style().toggleClass("domkit-sel", sys.ObjUtil.coerce(selected, sys.Bool.type$.toNullable()));
    let flags = TreeFlags.make((it) => {
      it.__focused(this$.#manFocus);
      it.__selected(selected);
      return;
    });
    content.style().trap("paddingLeft", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Int.mult(sys.Int.plus(sys.ObjUtil.coerce(node.depth(), sys.Int.type$), 1), Tree.depthIndent()), sys.Obj.type$.toNullable())), "px")]));
    node.onElem(sys.ObjUtil.coerce(content.lastChild(), dom.Elem.type$), flags);
    if (node.expanded()) {
      node.children().each((k) => {
        k.parent(node);
        node.elem().add(this$.toElem(node, k));
        this$.doRefreshNode(k);
        return;
      });
    }
    ;
    return;
  }

  toElem(parent,node) {
    const this$ = this;
    if (node.elem() == null) {
      node.depth(sys.ObjUtil.coerce(((this$) => { if (parent == null) return 0; return sys.Int.plus(sys.ObjUtil.coerce(parent.depth(), sys.Int.type$), 1); })(this), sys.Int.type$.toNullable()));
      node.elem(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
        it.style().addClass("domkit-Tree-node-block");
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
          it.style().addClass("domkit-Tree-node");
          it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
            it.style().addClass("domkit-Tree-node-expander");
            return;
          }), dom.Elem.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
            return;
          }), dom.Elem.type$));
          return;
        }), dom.Elem.type$));
        return;
      }), dom.Elem.type$));
      this.refreshNode(node);
    }
    ;
    return sys.ObjUtil.coerce(node.elem(), dom.Elem.type$);
  }

  toNode(elem) {
    const this$ = this;
    while (!elem.style().hasClass("domkit-Tree-node-block")) {
      (elem = sys.ObjUtil.coerce(elem.parent(), dom.Elem.type$));
    }
    ;
    let elemPath = sys.List.make(dom.Elem.type$, [elem]);
    while (!elemPath.first().parent().style().hasClass("domkit-Tree")) {
      elemPath.insert(0, sys.ObjUtil.coerce(elemPath.first().parent(), dom.Elem.type$));
    }
    ;
    let node = null;
    elemPath.each((p) => {
      let i = p.parent().children().findIndex((k) => {
        return sys.ObjUtil.equals(p, k);
      });
      (node = ((this$) => { if (node == null) return this$.#roots.get(sys.ObjUtil.coerce(i, sys.Int.type$)); return node.children().get(sys.Int.minus(sys.ObjUtil.coerce(i, sys.Int.type$), 1)); })(this$));
      return;
    });
    return sys.ObjUtil.coerce(node, TreeNode.type$);
  }

  onMouseEvent(e) {
    const this$ = this;
    let elem = e.target();
    if (sys.ObjUtil.equals(elem, this)) {
      return;
    }
    ;
    let node = this.toNode(elem);
    if (sys.ObjUtil.equals(e.type(), "mousedown")) {
      if ((!elem.style().hasClass("domkit-Tree-node-expander") && !this.#sel.items().contains(node))) {
        this.#sel.item(node);
        ((this$) => { let $_u35 = this$.#cbSelect; if ($_u35 == null) return null; return sys.Func.call(this$.#cbSelect, this$); })(this);
      }
      ;
    }
    else {
      if (sys.ObjUtil.equals(e.type(), "mouseup")) {
        if (elem.style().hasClass("domkit-Tree-node-expander")) {
          this.expand(node, !node.expanded());
        }
        ;
      }
      ;
    }
    ;
    if ((sys.ObjUtil.equals(e.type(), "dblclick") && !elem.style().hasClass("domkit-Tree-node-expander"))) {
      ((this$) => { let $_u36 = this$.#cbAction; if ($_u36 == null) return null; return sys.Func.call(this$.#cbAction, this$, e); })(this);
    }
    ;
    let cb = this.#cbTreeEvent.get(e.type());
    if (cb != null) {
      let blockElem = node.elem();
      let nodeElem = blockElem.firstChild();
      let indent = sys.Int.mult(sys.Int.plus(sys.ObjUtil.coerce(node.depth(), sys.Int.type$), 1), Tree.depthIndent());
      let npos = nodeElem.relPos(e.pagePos());
      if (sys.ObjUtil.compareLT(sys.Int.minus(sys.Num.toInt(sys.ObjUtil.coerce(npos.x(), sys.Num.type$)), indent), 0)) {
        return;
      }
      ;
      sys.Func.call(cb, TreeEvent.make(this, node, (it) => {
        it.__type(e.type());
        it.__pagePos(e.pagePos());
        it.__nodePos(graphics.Point.make(sys.Float.minusInt(npos.x(), indent), npos.y()));
        it.__size(graphics.Size.make(sys.Float.minusInt(nodeElem.size().w(), indent), nodeElem.size().h()));
        return;
      }));
    }
    ;
    return;
  }

  onUpdateSel(oldNodes,newNodes) {
    const this$ = this;
    oldNodes.each((n) => {
      this$.refreshNode(n);
      return;
    });
    newNodes.each((n) => {
      this$.refreshNode(n);
      return;
    });
    return;
  }

  static static$init() {
    Tree.#depthIndent = 16;
    return;
  }

}

class TreeSelection extends Selection {
  constructor() {
    super();
    const this$ = this;
    this.#items = sys.List.make(sys.Obj.type$);
    return;
  }

  typeof() { return TreeSelection.type$; }

  #item = null;

  item(it) {
    if (it === undefined) {
      return this.items().first();
    }
    else {
      this.items(((this$) => { if (it == null) return sys.List.make(sys.Obj.type$); return sys.List.make(sys.Obj.type$.toNullable(), [it]); })(this));
      return;
    }
  }

  #items = null;

  items(it) {
    if (it === undefined) {
      return this.#items;
    }
    else {
      if (!this.enabled()) {
        return;
      }
      ;
      let oldItems = this.#items;
      let newItems = ((this$) => { if (this$.multi()) return it; return ((this$) => { if (sys.ObjUtil.compareGT(it.size(), 0)) return sys.List.make(sys.Obj.type$.toNullable(), [it.first()]); return sys.List.make(sys.Obj.type$); })(this$); })(this).ro();
      this.#items = newItems;
      this.#tree.onUpdateSel(sys.ObjUtil.coerce(oldItems, sys.Type.find("domkit::TreeNode[]")), sys.ObjUtil.coerce(newItems, sys.Type.find("domkit::TreeNode[]")));
      return;
    }
  }

  #index = null;

  index(it) {
    if (it === undefined) {
      throw sys.Err.make("Not implemented for Tree");
    }
    else {
      throw sys.Err.make("Not implemented for Tree");
    }
  }

  #indexes = null;

  indexes(it) {
    if (it === undefined) {
      throw sys.Err.make("Not implemented for Tree");
    }
    else {
      throw sys.Err.make("Not implemented for Tree");
    }
  }

  #tree = null;

  // private field reflection only
  __tree(it) { if (it === undefined) return this.#tree; else this.#tree = it; }

  static make(tree) {
    const $self = new TreeSelection();
    TreeSelection.make$($self,tree);
    return $self;
  }

  static make$($self,tree) {
    Selection.make$($self);
    ;
    $self.#tree = tree;
    return;
  }

  isEmpty() {
    return this.items().isEmpty();
  }

  size() {
    return this.items().size();
  }

}

class Dialog extends Box {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#title = null;
    this.#frame = null;
    this.#cbMounted = null;
    this.#cbOpen = null;
    this.#cbClose = null;
    this.#cbKeyDown = null;
    return;
  }

  typeof() { return Dialog.type$; }

  #title = null;

  title(it) {
    if (it === undefined) {
      return this.#title;
    }
    else {
      this.#title = it;
      return;
    }
  }

  #uid = 0;

  // private field reflection only
  __uid(it) { if (it === undefined) return this.#uid; else this.#uid = it; }

  static #nextId = undefined;

  static nextId() {
    if (Dialog.#nextId === undefined) {
      Dialog.static$init();
      if (Dialog.#nextId === undefined) Dialog.#nextId = null;
    }
    return Dialog.#nextId;
  }

  #frame = null;

  // private field reflection only
  __frame(it) { if (it === undefined) return this.#frame; else this.#frame = it; }

  #cbMounted = null;

  // private field reflection only
  __cbMounted(it) { if (it === undefined) return this.#cbMounted; else this.#cbMounted = it; }

  #cbOpen = null;

  // private field reflection only
  __cbOpen(it) { if (it === undefined) return this.#cbOpen; else this.#cbOpen = it; }

  #cbClose = null;

  // private field reflection only
  __cbClose(it) { if (it === undefined) return this.#cbClose; else this.#cbClose = it; }

  #cbKeyDown = null;

  // private field reflection only
  __cbKeyDown(it) { if (it === undefined) return this.#cbKeyDown; else this.#cbKeyDown = it; }

  static make() {
    const $self = new Dialog();
    Dialog.make$($self);
    return $self;
  }

  static make$($self) {
    Box.make$($self);
    ;
    $self.#uid = sys.ObjUtil.coerce(Dialog.nextId().val(), sys.Int.type$);
    Dialog.nextId().val(sys.ObjUtil.coerce(sys.Int.plus($self.#uid, 1), sys.Obj.type$.toNullable()));
    $self.style().addClass("domkit-Dialog");
    $self.trap("tabIndex", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]));
    return;
  }

  onBeforeOpen() {
    return;
  }

  onAfterOpen() {
    return;
  }

  onKeyDown(f) {
    this.#cbKeyDown = f;
    return;
  }

  open() {
    const this$ = this;
    this.onBeforeOpen();
    let mask = sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
      it.id(sys.Str.plus("domkitDialog-mask-", sys.ObjUtil.coerce(this$.#uid, sys.Obj.type$.toNullable())));
      it.trap("tabIndex", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]));
      it.style().addClass("domkit-Dialog-mask");
      it.style().trap("opacity", sys.List.make(sys.Obj.type$.toNullable(), ["0"]));
      it.onEvent("keydown", false, (e) => {
        ((this$) => { let $_u40 = this$.#cbKeyDown; if ($_u40 == null) return null; return sys.Func.call(this$.#cbKeyDown, e); })(this$);
        return;
      });
      return;
    }), dom.Elem.type$);
    this.#frame = sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
      it.style().addClass("domkit-Dialog-frame");
      it.style().setAll(sys.Map.__fromLiteral(["transform","opacity"], ["scale(0.75)","0.0"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
      return;
    }), dom.Elem.type$);
    if (this.#title != null) {
      let telem = ((this$) => { let $_u41 = sys.ObjUtil.as(this$.#title, dom.Elem.type$); if ($_u41 != null) return $_u41; return sys.ObjUtil.coerce(sys.ObjUtil.with(Label.make(), (it) => {
        it.style().addClass("def-label");
        it.text(sys.ObjUtil.toStr(this$.#title));
        return;
      }), Label.type$); })(this);
      this.#frame.add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
        it.style().addClass("domkit-Dialog-title");
        it.add(sys.ObjUtil.coerce(telem, dom.Elem.type$));
        it.onEvent("mousedown", false, (e) => {
          e.stop();
          let vp = dom.Win.cur().viewport();
          let doc = dom.Win.cur().doc();
          let off = doc.body().relPos(e.pagePos());
          let fps = this$.#frame.pos();
          let fsz = this$.#frame.size();
          let fmove = null;
          let fup = null;
          (fmove = doc.onEvent("mousemove", true, (de) => {
            let pos = doc.body().relPos(de.pagePos());
            let fx = sys.Int.min(sys.Int.max(sys.Int.minus(sys.Num.toInt(sys.ObjUtil.coerce(pos.x(), sys.Num.type$)), sys.Int.minus(sys.Num.toInt(sys.ObjUtil.coerce(off.x(), sys.Num.type$)), sys.Num.toInt(sys.ObjUtil.coerce(fps.x(), sys.Num.type$)))), 0), sys.Int.minus(sys.Num.toInt(sys.ObjUtil.coerce(vp.w(), sys.Num.type$)), sys.Num.toInt(sys.ObjUtil.coerce(fsz.w(), sys.Num.type$))));
            let fy = sys.Int.min(sys.Int.max(sys.Int.minus(sys.Num.toInt(sys.ObjUtil.coerce(pos.y(), sys.Num.type$)), sys.Int.minus(sys.Num.toInt(sys.ObjUtil.coerce(off.y(), sys.Num.type$)), sys.Num.toInt(sys.ObjUtil.coerce(fps.y(), sys.Num.type$)))), 0), sys.Int.minus(sys.Num.toInt(sys.ObjUtil.coerce(vp.h(), sys.Num.type$)), sys.Num.toInt(sys.ObjUtil.coerce(fsz.h(), sys.Num.type$))));
            mask.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), ["block"]));
            this$.#frame.style().trap("position", sys.List.make(sys.Obj.type$.toNullable(), ["absolute"]));
            this$.#frame.style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(fx, sys.Obj.type$.toNullable())), "px")]));
            this$.#frame.style().trap("top", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(fy, sys.Obj.type$.toNullable())), "px")]));
            return;
          }));
          (fup = doc.onEvent("mouseup", true, (de) => {
            de.stop();
            doc.removeEvent("mousemove", true, sys.ObjUtil.coerce(fmove, sys.Type.find("sys::Func")));
            doc.removeEvent("mouseup", true, sys.ObjUtil.coerce(fup, sys.Type.find("sys::Func")));
            return;
          }));
          return;
        });
        return;
      }), dom.Elem.type$));
    }
    ;
    this.#frame.add(this);
    mask.add(sys.ObjUtil.coerce(this.#frame, dom.Elem.type$));
    let body = dom.Win.cur().doc().body();
    body.add(mask);
    this.fireMounted();
    mask.transition(sys.Map.__fromLiteral(["opacity"], ["1"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), null, sys.Duration.fromStr("100ms"));
    this.#frame.transition(sys.Map.__fromLiteral(["transform","opacity"], ["scale(1)","1"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), null, sys.Duration.fromStr("100ms"), (it) => {
      this$.focus();
      this$.onAfterOpen();
      this$.fireOpen();
      return;
    });
    return;
  }

  close() {
    const this$ = this;
    let mask = dom.Win.cur().doc().elemById(sys.Str.plus("domkitDialog-mask-", sys.ObjUtil.coerce(this.#uid, sys.Obj.type$.toNullable())));
    ((this$) => { let $_u42 = mask; if ($_u42 == null) return null; return mask.transition(sys.Map.__fromLiteral(["opacity"], ["0"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), null, sys.Duration.fromStr("100ms")); })(this);
    ((this$) => { let $_u43 = this$.#frame; if ($_u43 == null) return null; return this$.#frame.transition(sys.Map.__fromLiteral(["transform","opacity"], ["scale(0.75)","0"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), null, sys.Duration.fromStr("100ms"), (it) => {
      ((this$) => { let $_u44 = ((this$) => { let $_u45 = mask; if ($_u45 == null) return null; return mask.parent(); })(this$); if ($_u44 == null) return null; return ((this$) => { let $_u46 = mask; if ($_u46 == null) return null; return mask.parent(); })(this$).remove(sys.ObjUtil.coerce(mask, dom.Elem.type$)); })(this$);
      this$.fireClose();
      return;
    }); })(this);
    return;
  }

  onMounted(f) {
    this.#cbMounted = f;
    return;
  }

  onOpen(f) {
    this.#cbOpen = f;
    return;
  }

  onClose(f) {
    this.#cbClose = f;
    return;
  }

  fireMounted() {
    ((this$) => { let $_u47 = this$.#cbMounted; if ($_u47 == null) return null; return sys.Func.call(this$.#cbMounted, this$); })(this);
    return;
  }

  fireOpen() {
    ((this$) => { let $_u48 = this$.#cbOpen; if ($_u48 == null) return null; return sys.Func.call(this$.#cbOpen, this$); })(this);
    return;
  }

  fireClose() {
    ((this$) => { let $_u49 = this$.#cbClose; if ($_u49 == null) return null; return sys.Func.call(this$.#cbClose, this$); })(this);
    return;
  }

  static static$init() {
    Dialog.#nextId = concurrent.AtomicRef.make(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    return;
  }

}

class Popup extends dom.Elem {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#halign = Align.left();
    return;
  }

  typeof() { return Popup.type$; }

  #halign = null;

  halign(it) {
    if (it === undefined) {
      return this.#halign;
    }
    else {
      this.#halign = it;
      return;
    }
  }

  #isOpen = false;

  isOpen() {
    return this.#isOpen;
  }

  #uid = 0;

  // private field reflection only
  __uid(it) { if (it === undefined) return this.#uid; else this.#uid = it; }

  static #nextId = undefined;

  static nextId() {
    if (Popup.#nextId === undefined) {
      Popup.static$init();
      if (Popup.#nextId === undefined) Popup.#nextId = null;
    }
    return Popup.#nextId;
  }

  static #gutter = undefined;

  static gutter() {
    if (Popup.#gutter === undefined) {
      Popup.static$init();
      if (Popup.#gutter === undefined) Popup.#gutter = sys.Float.make(0);
    }
    return Popup.#gutter;
  }

  #openPos = null;

  // private field reflection only
  __openPos(it) { if (it === undefined) return this.#openPos; else this.#openPos = it; }

  #cbOpen = null;

  // private field reflection only
  __cbOpen(it) { if (it === undefined) return this.#cbOpen; else this.#cbOpen = it; }

  #cbClose = null;

  // private field reflection only
  __cbClose(it) { if (it === undefined) return this.#cbClose; else this.#cbClose = it; }

  #_cbClose = null;

  // private field reflection only
  ___cbClose(it) { if (it === undefined) return this.#_cbClose; else this.#_cbClose = it; }

  static make() {
    const $self = new Popup();
    Popup.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    dom.Elem.make$($self);
    ;
    $self.#uid = Popup.nextId().getAndIncrement();
    $self.style().addClass("domkit-Popup");
    $self.onEvent("keydown", false, (e) => {
      if (sys.ObjUtil.equals(e.key(), dom.Key.esc())) {
        this$.close();
      }
      ;
      return;
    });
    $self.trap("tabIndex", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]));
    return;
  }

  open(x,y) {
    const this$ = this;
    if (this.#isOpen) {
      return;
    }
    ;
    this.#openPos = graphics.Point.make(x, y);
    this.style().setAll(sys.Map.__fromLiteral(["left","top","-webkit-transform","opacity"], [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(x, sys.Obj.type$.toNullable())), "px"),sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(y, sys.Obj.type$.toNullable())), "px"),"scale(1)","0.0"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    let body = dom.Win.cur().doc().body();
    body.add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
      it.id(sys.Str.plus("domkitPopup-mask-", sys.ObjUtil.coerce(this$.#uid, sys.Obj.type$.toNullable())));
      it.style().addClass("domkit-Popup-mask");
      it.onEvent("mousedown", false, (e) => {
        if ((sys.ObjUtil.equals(e.target(), this$) || this$.containsChild(e.target()))) {
          return;
        }
        ;
        this$.close();
        return;
      });
      it.add(this$);
      return;
    }), dom.Elem.type$));
    this.fitBounds();
    this.onBeforeOpen();
    this.transition(sys.Map.__fromLiteral(["opacity"], ["1"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), null, sys.Duration.fromStr("100ms"), (it) => {
      this$.focus();
      this$.fireOpen(null);
      return;
    });
    return;
  }

  close() {
    const this$ = this;
    this.transition(sys.Map.__fromLiteral(["transform","opacity"], ["scale(0.75)","0"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), null, sys.Duration.fromStr("100ms"), (it) => {
      let mask = dom.Win.cur().doc().elemById(sys.Str.plus("domkitPopup-mask-", sys.ObjUtil.coerce(this$.#uid, sys.Obj.type$.toNullable())));
      ((this$) => { let $_u50 = ((this$) => { let $_u51 = mask; if ($_u51 == null) return null; return mask.parent(); })(this$); if ($_u50 == null) return null; return ((this$) => { let $_u52 = mask; if ($_u52 == null) return null; return mask.parent(); })(this$).remove(sys.ObjUtil.coerce(mask, dom.Elem.type$)); })(this$);
      this$.fireClose(null);
      return;
    });
    return;
  }

  fitBounds() {
    if (this.parent() == null) {
      return;
    }
    ;
    let x = this.#openPos.x();
    let y = this.#openPos.y();
    let sz = this.size();
    let $_u53 = this.#halign;
    if (sys.ObjUtil.equals($_u53, Align.center())) {
      (x = sys.Float.max(Popup.gutter(), sys.Float.minusInt(x, sys.Int.div(sys.Num.toInt(sys.ObjUtil.coerce(sz.w(), sys.Num.type$)), 2))));
      this.style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(x, sys.Obj.type$.toNullable())), "px")]));
    }
    else if (sys.ObjUtil.equals($_u53, Align.right())) {
      (x = sys.Float.max(Popup.gutter(), sys.Float.minusInt(x, sys.Num.toInt(sys.ObjUtil.coerce(sz.w(), sys.Num.type$)))));
      this.style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(x, sys.Obj.type$.toNullable())), "px")]));
    }
    ;
    let vp = dom.Win.cur().viewport();
    if (sys.ObjUtil.compareGT(sys.Float.plus(sys.Float.plus(sz.w(), Popup.gutter()), Popup.gutter()), vp.w())) {
      this.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Float.minus(sys.Float.minus(vp.w(), Popup.gutter()), Popup.gutter()), sys.Obj.type$.toNullable())), "px")]));
    }
    ;
    if (sys.ObjUtil.compareGT(sys.Float.plus(sys.Float.plus(sz.h(), Popup.gutter()), Popup.gutter()), vp.h())) {
      this.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Float.minus(sys.Float.minus(vp.h(), Popup.gutter()), Popup.gutter()), sys.Obj.type$.toNullable())), "px")]));
    }
    ;
    (sz = this.size());
    if (sys.ObjUtil.compareGT(sys.Float.plus(sys.Float.plus(x, sz.w()), Popup.gutter()), vp.w())) {
      this.style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Float.minus(sys.Float.minus(vp.w(), sz.w()), Popup.gutter()), sys.Obj.type$.toNullable())), "px")]));
    }
    ;
    if (sys.ObjUtil.compareGT(sys.Float.plus(sys.Float.plus(y, sz.h()), Popup.gutter()), vp.h())) {
      this.style().trap("top", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Float.minus(sys.Float.minus(vp.h(), sz.h()), Popup.gutter()), sys.Obj.type$.toNullable())), "px")]));
    }
    ;
    return;
  }

  onBeforeOpen() {
    return;
  }

  onOpen(f) {
    this.#cbOpen = f;
    return;
  }

  onClose(f) {
    this.#cbClose = f;
    return;
  }

  _onClose(f) {
    this.#_cbClose = f;
    return;
  }

  fireOpen(e) {
    ((this$) => { let $_u54 = this$.#cbOpen; if ($_u54 == null) return null; return sys.Func.call(this$.#cbOpen, this$); })(this);
    this.#isOpen = true;
    return;
  }

  fireClose(e) {
    ((this$) => { let $_u55 = this$.#_cbClose; if ($_u55 == null) return null; return sys.Func.call(this$.#_cbClose, this$); })(this);
    ((this$) => { let $_u56 = this$.#cbClose; if ($_u56 == null) return null; return sys.Func.call(this$.#cbClose, this$); })(this);
    this.#isOpen = false;
    return;
  }

  static static$init() {
    Popup.#nextId = concurrent.AtomicInt.make(0);
    Popup.#gutter = sys.Float.make(12.0);
    return;
  }

}

class Menu extends Popup {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#onCustomKeyDown = null;
    this.#lastEvent = 0;
    this.#armed = false;
    return;
  }

  typeof() { return Menu.type$; }

  #onCustomKeyDown = null;

  onCustomKeyDown(it) {
    if (it === undefined) {
      return this.#onCustomKeyDown;
    }
    else {
      this.#onCustomKeyDown = it;
      return;
    }
  }

  #selIndex = null;

  // private field reflection only
  __selIndex(it) { if (it === undefined) return this.#selIndex; else this.#selIndex = it; }

  #lastEvent = 0;

  // private field reflection only
  __lastEvent(it) { if (it === undefined) return this.#lastEvent; else this.#lastEvent = it; }

  #armed = false;

  // private field reflection only
  __armed(it) { if (it === undefined) return this.#armed; else this.#armed = it; }

  static make() {
    const $self = new Menu();
    Menu.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    Popup.make$($self);
    ;
    $self.trap("tabIndex", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]));
    $self.style().addClass("domkit-Menu");
    $self.onOpen((it) => {
      this$.focus();
      return;
    });
    $self.onEvent("mouseleave", false, (it) => {
      this$.select(null);
      return;
    });
    $self.onEvent("mouseover", false, (e) => {
      if (sys.ObjUtil.compareGT(this$.#lastEvent, 0)) {
        this$.#lastEvent = 0;
        return;
      }
      ;
      let t = e.target();
      while ((t != null && !sys.ObjUtil.is(t, MenuItem.type$))) {
        (t = ((this$) => { let $_u57 = t; if ($_u57 == null) return null; return t.parent(); })(this$));
      }
      ;
      if (t == null) {
        this$.select(null);
        return;
      }
      ;
      let index = this$.children().findIndex((k) => {
        return sys.ObjUtil.equals(t, k);
      });
      if (index != null) {
        let item = sys.ObjUtil.coerce(this$.children().get(sys.ObjUtil.coerce(index, sys.Int.type$)), MenuItem.type$);
        this$.select(((this$) => { if (sys.ObjUtil.coerce(item.enabled(), sys.Bool.type$)) return index; return null; })(this$));
      }
      ;
      this$.#lastEvent = 0;
      return;
    });
    $self.onEvent("mousedown", false, (e) => {
      this$.#armed = true;
      return;
    });
    $self.onEvent("mouseup", false, (e) => {
      if (this$.#armed) {
        this$.fireAction(e);
      }
      ;
      return;
    });
    $self.onEvent("keydown", false, (e) => {
      let $_u59 = e.key();
      if (sys.ObjUtil.equals($_u59, dom.Key.esc())) {
        this$.close();
      }
      else if (sys.ObjUtil.equals($_u59, dom.Key.up())) {
        e.stop();
        this$.#lastEvent = 1;
        this$.select(((this$) => { if (this$.#selIndex == null) return this$.findFirst(); return this$.findPrev(sys.ObjUtil.coerce(this$.#selIndex, sys.Int.type$)); })(this$));
      }
      else if (sys.ObjUtil.equals($_u59, dom.Key.down())) {
        e.stop();
        this$.#lastEvent = 1;
        this$.select(((this$) => { if (this$.#selIndex == null) return this$.findFirst(); return this$.findNext(sys.ObjUtil.coerce(this$.#selIndex, sys.Int.type$)); })(this$));
      }
      else if (sys.ObjUtil.equals($_u59, dom.Key.space()) || sys.ObjUtil.equals($_u59, dom.Key.enter())) {
        e.stop();
        this$.fireAction(e);
      }
      else {
        if (this$.#onCustomKeyDown != null) {
          e.stop();
          this$.#lastEvent = 1;
          sys.Func.call(this$.#onCustomKeyDown, e);
        }
        ;
      }
      ;
      return;
    });
    return;
  }

  onBeforeOpen() {
    if (this.#selIndex != null) {
      this.select(this.#selIndex);
    }
    ;
    return;
  }

  select(index) {
    let kids = this.children();
    if (sys.ObjUtil.equals(kids.size(), 0)) {
      return;
    }
    ;
    if (this.#selIndex != null) {
      kids.get(sys.ObjUtil.coerce(this.#selIndex, sys.Int.type$)).style().removeClass("domkit-sel");
    }
    ;
    if (index == null) {
      this.#selIndex = null;
      return;
    }
    ;
    if (sys.ObjUtil.compareLT(index, 0)) {
      (index = sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()));
    }
    ;
    if (sys.ObjUtil.compareGT(index, sys.Int.minus(kids.size(), 1))) {
      (index = sys.ObjUtil.coerce(sys.Int.minus(kids.size(), 1), sys.Int.type$.toNullable()));
    }
    ;
    let item = kids.get(sys.ObjUtil.coerce(index, sys.Int.type$));
    item.style().addClass("domkit-sel");
    this.#selIndex = index;
    let sy = this.scrollPos().y();
    let mh = this.size().h();
    let iy = item.pos().y();
    let ih = item.size().h();
    if (sys.ObjUtil.compareGT(sy, iy)) {
      this.scrollPos(graphics.Point.make(sys.Float.make(0.0), iy));
    }
    else {
      if (sys.ObjUtil.compareLT(sys.Float.plus(sy, mh), sys.Float.plus(iy, ih))) {
        this.scrollPos(graphics.Point.make(sys.Float.make(0.0), sys.Float.minus(sys.Float.plus(iy, ih), mh)));
      }
      ;
    }
    ;
    return;
  }

  findFirst() {
    let i = 0;
    let kids = this.children();
    while (sys.ObjUtil.compareLT(((this$) => { let $_u62 = i;i = sys.Int.increment(i); return $_u62; })(this), sys.Int.minus(kids.size(), 1))) {
      let item = sys.ObjUtil.as(kids.get(i), MenuItem.type$);
      if ((item != null && sys.ObjUtil.coerce(item.enabled(), sys.Bool.type$))) {
        return sys.ObjUtil.coerce(i, sys.Int.type$.toNullable());
      }
      ;
    }
    ;
    return null;
  }

  findPrev(start) {
    let i = start;
    let kids = this.children();
    while (sys.ObjUtil.compareGE(i = sys.Int.decrement(i), 0)) {
      let item = sys.ObjUtil.as(kids.get(i), MenuItem.type$);
      if ((item != null && sys.ObjUtil.coerce(item.enabled(), sys.Bool.type$))) {
        return sys.ObjUtil.coerce(i, sys.Int.type$.toNullable());
      }
      ;
    }
    ;
    return sys.ObjUtil.coerce(start, sys.Int.type$.toNullable());
  }

  findNext(start) {
    let i = start;
    let kids = this.children();
    while (sys.ObjUtil.compareLT(i = sys.Int.increment(i), kids.size())) {
      let item = sys.ObjUtil.as(kids.get(i), MenuItem.type$);
      if ((item != null && sys.ObjUtil.coerce(item.enabled(), sys.Bool.type$))) {
        return sys.ObjUtil.coerce(i, sys.Int.type$.toNullable());
      }
      ;
    }
    ;
    return sys.ObjUtil.coerce(start, sys.Int.type$.toNullable());
  }

  fireAction(e) {
    if (this.#selIndex == null) {
      return;
    }
    ;
    let item = sys.ObjUtil.coerce(this.children().get(sys.ObjUtil.coerce(this.#selIndex, sys.Int.type$)), MenuItem.type$);
    item.fireAction(e);
    return;
  }

}

class MenuItem extends dom.Elem {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#cbAction = null;
    return;
  }

  typeof() { return MenuItem.type$; }

  #enabled = null;

  enabled(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(!this.style().hasClass("disabled"), sys.Bool.type$.toNullable());
    }
    else {
      this.style().toggleClass("disabled", sys.ObjUtil.coerce(!sys.ObjUtil.coerce(it, sys.Bool.type$), sys.Bool.type$.toNullable()));
      return;
    }
  }

  #_event = null;

  _event(it) {
    if (it === undefined) {
      return this.#_event;
    }
    else {
      this.#_event = it;
      return;
    }
  }

  #cbAction = null;

  // private field reflection only
  __cbAction(it) { if (it === undefined) return this.#cbAction; else this.#cbAction = it; }

  static make() {
    const $self = new MenuItem();
    MenuItem.make$($self);
    return $self;
  }

  static make$($self) {
    dom.Elem.make$($self);
    ;
    $self.style().addClass("domkit-control domkit-MenuItem");
    return;
  }

  onAction(f) {
    this.#cbAction = f;
    return;
  }

  fireAction(e) {
    if (!sys.ObjUtil.coerce(this.enabled(), sys.Bool.type$)) {
      return;
    }
    ;
    this.#_event = e;
    ((this$) => { let $_u63 = sys.ObjUtil.as(this$.parent(), Popup.type$); if ($_u63 == null) return null; return sys.ObjUtil.as(this$.parent(), Popup.type$).close(); })(this);
    ((this$) => { let $_u64 = this$.#cbAction; if ($_u64 == null) return null; return sys.Func.call(this$.#cbAction, this$); })(this);
    return;
  }

}

class FilePicker extends dom.Elem {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#cbSelect = null;
    return;
  }

  typeof() { return FilePicker.type$; }

  #accept = null;

  accept(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.trap("accept", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$.toNullable());
    }
    else {
      this.trap("accept", sys.List.make(sys.Obj.type$.toNullable(), [it]));
      return;
    }
  }

  #multi = false;

  multi(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.trap("multiple", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Bool.type$);
    }
    else {
      this.trap("multiple", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(it, sys.Obj.type$.toNullable())]));
      return;
    }
  }

  #cbSelect = null;

  // private field reflection only
  __cbSelect(it) { if (it === undefined) return this.#cbSelect; else this.#cbSelect = it; }

  static make() {
    const $self = new FilePicker();
    FilePicker.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    dom.Elem.make$($self, "input");
    ;
    $self.style().addClass("domkit-FilePicker");
    $self.trap("type", sys.List.make(sys.Obj.type$.toNullable(), ["file"]));
    $self.trap("tabIndex", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]));
    $self.onEvent("change", false, (it) => {
      if (this$.#cbSelect != null) {
        sys.Func.call(this$.#cbSelect, this$);
      }
      ;
      return;
    });
    return;
  }

  open() {
    this.invoke("click");
    return;
  }

  files() {
    return sys.ObjUtil.coerce(this.trap("files", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Type.find("dom::DomFile[]"));
  }

  reset() {
    this.trap("value", sys.List.make(sys.Obj.type$.toNullable(), [""]));
    return;
  }

  onSelect(f) {
    this.#cbSelect = f;
    return;
  }

}

class FlexBox extends Box {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#dir = "row";
    this.#wrap = "nowrap";
    this.#alignMain = "flex-start";
    this.#alignCross = "center";
    this.#alignLines = "stretch";
    this.#flex = sys.List.make(sys.Str.type$);
    return;
  }

  typeof() { return FlexBox.type$; }

  #dir = null;

  dir(it) {
    if (it === undefined) {
      return this.#dir;
    }
    else {
      this.#dir = it;
      return;
    }
  }

  #wrap = null;

  wrap(it) {
    if (it === undefined) {
      return this.#wrap;
    }
    else {
      this.#wrap = it;
      return;
    }
  }

  #alignMain = null;

  alignMain(it) {
    if (it === undefined) {
      return this.#alignMain;
    }
    else {
      this.#alignMain = it;
      return;
    }
  }

  #alignCross = null;

  alignCross(it) {
    if (it === undefined) {
      return this.#alignCross;
    }
    else {
      this.#alignCross = it;
      return;
    }
  }

  #alignLines = null;

  alignLines(it) {
    if (it === undefined) {
      return this.#alignLines;
    }
    else {
      this.#alignLines = it;
      return;
    }
  }

  #flex = null;

  flex(it) {
    if (it === undefined) {
      return this.#flex;
    }
    else {
      this.#flex = it;
      return;
    }
  }

  static make() {
    const $self = new FlexBox();
    FlexBox.make$($self);
    return $self;
  }

  static make$($self) {
    Box.make$($self);
    ;
    $self.style().addClass("domkit-FlexBox");
    return;
  }

  onParent(p) {
    this.applyStyle();
    return;
  }

  onAdd(c) {
    this.applyStyle();
    return;
  }

  onRemove(c) {
    this.applyStyle();
    return;
  }

  applyStyle() {
    const this$ = this;
    this.style().setAll(sys.Map.__fromLiteral(["flex-direction","flex-wrap","justify-content","align-items","align-content"], [this.#dir,this.#wrap,this.#alignMain,this.#alignCross,this.#alignLines], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.children().each((kid,i) => {
      let f = this$.#flex.getSafe(i);
      if (f != null) {
        kid.style().trap("flex", sys.List.make(sys.Obj.type$.toNullable(), [f]));
      }
      ;
      if (sys.ObjUtil.is(kid, Box.type$)) {
        if ((sys.ObjUtil.equals(this$.#dir, "row") && sys.ObjUtil.equals(kid.style().effective("width"), "100%"))) {
          kid.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), ["auto"]));
        }
        else {
          if ((sys.ObjUtil.equals(this$.#dir, "column") && sys.ObjUtil.equals(kid.style().effective("height"), "100%"))) {
            kid.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), ["auto"]));
          }
          ;
        }
        ;
      }
      ;
      return;
    });
    return;
  }

}

class Table extends dom.Elem {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#model = TableModel.make();
    this.#showHeader = true;
    this.#stripeClasses = sys.List.make(sys.Str.type$, ["even", "odd"]);
    this.#sortEnabled = true;
    this.#cbTableEvent = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Func"));
    this.#sbarsz = 15;
    this.#thumbMargin = 2;
    this.#overScroll = sys.Int.plus(this.#sbarsz, 2);
    this.#scrollPageFreq = sys.Duration.fromStr("100ms");
    this.#scrollPulseDir = sys.Duration.fromStr("300ms");
    this.#headers = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("dom::Elem"));
    this.#cells = sys.Map.__fromLiteral([], [], sys.Type.find("domkit::TablePos"), sys.Type.find("dom::Elem"));
    this.#colx = sys.List.make(sys.Int.type$);
    this.#colw = sys.List.make(sys.Int.type$);
    this.#ucolw = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("sys::Int"));
    this.#hpbutw = 22;
    this.#manFocus = false;
    return;
  }

  typeof() { return Table.type$; }

  #model = null;

  model(it) {
    if (it === undefined) {
      return this.#model;
    }
    else {
      this.#model = it;
      this.#view.refresh();
      return;
    }
  }

  #showHeader = false;

  showHeader(it) {
    if (it === undefined) {
      return this.#showHeader;
    }
    else {
      this.#showHeader = it;
      return;
    }
  }

  #stripeClasses = null;

  stripeClasses(it) {
    if (it === undefined) {
      return this.#stripeClasses;
    }
    else {
      this.#stripeClasses = it;
      return;
    }
  }

  #view = null;

  view() {
    return this.#view;
  }

  #sortEnabled = false;

  sortEnabled(it) {
    if (it === undefined) {
      return this.#sortEnabled;
    }
    else {
      this.#sortEnabled = it;
      return;
    }
  }

  #sel = null;

  sel() {
    return this.#sel;
  }

  static #cellEvents = undefined;

  static cellEvents() {
    if (Table.#cellEvents === undefined) {
      Table.static$init();
      if (Table.#cellEvents === undefined) Table.#cellEvents = null;
    }
    return Table.#cellEvents;
  }

  #cbBeforeSelect = null;

  // private field reflection only
  __cbBeforeSelect(it) { if (it === undefined) return this.#cbBeforeSelect; else this.#cbBeforeSelect = it; }

  #cbSelect = null;

  // private field reflection only
  __cbSelect(it) { if (it === undefined) return this.#cbSelect; else this.#cbSelect = it; }

  #cbAction = null;

  // private field reflection only
  __cbAction(it) { if (it === undefined) return this.#cbAction; else this.#cbAction = it; }

  #cbSort = null;

  // private field reflection only
  __cbSort(it) { if (it === undefined) return this.#cbSort; else this.#cbSort = it; }

  #cbKeyDown = null;

  // private field reflection only
  __cbKeyDown(it) { if (it === undefined) return this.#cbKeyDown; else this.#cbKeyDown = it; }

  #cbTableEvent = null;

  // private field reflection only
  __cbTableEvent(it) { if (it === undefined) return this.#cbTableEvent; else this.#cbTableEvent = it; }

  #cbHeaderPopup = null;

  // private field reflection only
  __cbHeaderPopup(it) { if (it === undefined) return this.#cbHeaderPopup; else this.#cbHeaderPopup = it; }

  #sbarsz = 0;

  // private field reflection only
  __sbarsz(it) { if (it === undefined) return this.#sbarsz; else this.#sbarsz = it; }

  #thumbMargin = 0;

  // private field reflection only
  __thumbMargin(it) { if (it === undefined) return this.#thumbMargin; else this.#thumbMargin = it; }

  #overScroll = 0;

  // private field reflection only
  __overScroll(it) { if (it === undefined) return this.#overScroll; else this.#overScroll = it; }

  #scrollPageFreq = null;

  // private field reflection only
  __scrollPageFreq(it) { if (it === undefined) return this.#scrollPageFreq; else this.#scrollPageFreq = it; }

  #scrollPulseDir = null;

  // private field reflection only
  __scrollPulseDir(it) { if (it === undefined) return this.#scrollPulseDir; else this.#scrollPulseDir = it; }

  #thead = null;

  // private field reflection only
  __thead(it) { if (it === undefined) return this.#thead; else this.#thead = it; }

  #tbody = null;

  // private field reflection only
  __tbody(it) { if (it === undefined) return this.#tbody; else this.#tbody = it; }

  #hbar = null;

  // private field reflection only
  __hbar(it) { if (it === undefined) return this.#hbar; else this.#hbar = it; }

  #vbar = null;

  // private field reflection only
  __vbar(it) { if (it === undefined) return this.#vbar; else this.#vbar = it; }

  #headers = null;

  // private field reflection only
  __headers(it) { if (it === undefined) return this.#headers; else this.#headers = it; }

  #cells = null;

  // private field reflection only
  __cells(it) { if (it === undefined) return this.#cells; else this.#cells = it; }

  #theadh = 0;

  // private field reflection only
  __theadh(it) { if (it === undefined) return this.#theadh; else this.#theadh = it; }

  #tbodyw = 0;

  // private field reflection only
  __tbodyw(it) { if (it === undefined) return this.#tbodyw; else this.#tbodyw = it; }

  #tbodyh = 0;

  // private field reflection only
  __tbodyh(it) { if (it === undefined) return this.#tbodyh; else this.#tbodyh = it; }

  #numCols = 0;

  // private field reflection only
  __numCols(it) { if (it === undefined) return this.#numCols; else this.#numCols = it; }

  #numRows = 0;

  // private field reflection only
  __numRows(it) { if (it === undefined) return this.#numRows; else this.#numRows = it; }

  #colx = null;

  // private field reflection only
  __colx(it) { if (it === undefined) return this.#colx; else this.#colx = it; }

  #colw = null;

  // private field reflection only
  __colw(it) { if (it === undefined) return this.#colw; else this.#colw = it; }

  #ucolw = null;

  // private field reflection only
  __ucolw(it) { if (it === undefined) return this.#ucolw; else this.#ucolw = it; }

  #rowh = 0;

  // private field reflection only
  __rowh(it) { if (it === undefined) return this.#rowh; else this.#rowh = it; }

  #numVisCols = 0;

  // private field reflection only
  __numVisCols(it) { if (it === undefined) return this.#numVisCols; else this.#numVisCols = it; }

  #numVisRows = 0;

  // private field reflection only
  __numVisRows(it) { if (it === undefined) return this.#numVisRows; else this.#numVisRows = it; }

  #maxScrollx = 0;

  // private field reflection only
  __maxScrollx(it) { if (it === undefined) return this.#maxScrollx; else this.#maxScrollx = it; }

  #maxScrolly = 0;

  // private field reflection only
  __maxScrolly(it) { if (it === undefined) return this.#maxScrolly; else this.#maxScrolly = it; }

  #hasScrollx = false;

  // private field reflection only
  __hasScrollx(it) { if (it === undefined) return this.#hasScrollx; else this.#hasScrollx = it; }

  #hasScrolly = false;

  // private field reflection only
  __hasScrolly(it) { if (it === undefined) return this.#hasScrolly; else this.#hasScrolly = it; }

  #htrackw = 0;

  // private field reflection only
  __htrackw(it) { if (it === undefined) return this.#htrackw; else this.#htrackw = it; }

  #hthumbw = 0;

  // private field reflection only
  __hthumbw(it) { if (it === undefined) return this.#hthumbw; else this.#hthumbw = it; }

  #vtrackh = 0;

  // private field reflection only
  __vtrackh(it) { if (it === undefined) return this.#vtrackh; else this.#vtrackh = it; }

  #vthumbh = 0;

  // private field reflection only
  __vthumbh(it) { if (it === undefined) return this.#vthumbh; else this.#vthumbh = it; }

  #resizeCol = null;

  // private field reflection only
  __resizeCol(it) { if (it === undefined) return this.#resizeCol; else this.#resizeCol = it; }

  #resizeElem = null;

  // private field reflection only
  __resizeElem(it) { if (it === undefined) return this.#resizeElem; else this.#resizeElem = it; }

  #hpbut = null;

  // private field reflection only
  __hpbut(it) { if (it === undefined) return this.#hpbut; else this.#hpbut = it; }

  #hasHpbut = false;

  // private field reflection only
  __hasHpbut(it) { if (it === undefined) return this.#hasHpbut; else this.#hasHpbut = it; }

  #hpbutw = 0;

  // private field reflection only
  __hpbutw(it) { if (it === undefined) return this.#hpbutw; else this.#hpbutw = it; }

  #scrollx = 0;

  // private field reflection only
  __scrollx(it) { if (it === undefined) return this.#scrollx; else this.#scrollx = it; }

  #scrolly = 0;

  // private field reflection only
  __scrolly(it) { if (it === undefined) return this.#scrolly; else this.#scrolly = it; }

  #hbarPulseId = null;

  // private field reflection only
  __hbarPulseId(it) { if (it === undefined) return this.#hbarPulseId; else this.#hbarPulseId = it; }

  #vbarPulseId = null;

  // private field reflection only
  __vbarPulseId(it) { if (it === undefined) return this.#vbarPulseId; else this.#vbarPulseId = it; }

  #hbarPageId = null;

  // private field reflection only
  __hbarPageId(it) { if (it === undefined) return this.#hbarPageId; else this.#hbarPageId = it; }

  #vbarPageId = null;

  // private field reflection only
  __vbarPageId(it) { if (it === undefined) return this.#vbarPageId; else this.#vbarPageId = it; }

  #hthumbDragOff = null;

  // private field reflection only
  __hthumbDragOff(it) { if (it === undefined) return this.#hthumbDragOff; else this.#hthumbDragOff = it; }

  #vthumbDragOff = null;

  // private field reflection only
  __vthumbDragOff(it) { if (it === undefined) return this.#vthumbDragOff; else this.#vthumbDragOff = it; }

  #firstVisCol = 0;

  // private field reflection only
  __firstVisCol(it) { if (it === undefined) return this.#firstVisCol; else this.#firstVisCol = it; }

  #firstVisRow = 0;

  // private field reflection only
  __firstVisRow(it) { if (it === undefined) return this.#firstVisRow; else this.#firstVisRow = it; }

  #pivot = null;

  // private field reflection only
  __pivot(it) { if (it === undefined) return this.#pivot; else this.#pivot = it; }

  #manFocus = false;

  // private field reflection only
  __manFocus(it) { if (it === undefined) return this.#manFocus; else this.#manFocus = it; }

  static make() {
    const $self = new Table();
    Table.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    dom.Elem.make$($self, "div");
    ;
    $self.trap("tabIndex", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]));
    $self.#view = TableView.make($self);
    $self.#sel = TableSelection.make($self.#view);
    $self.style().addClass("domkit-Table").addClass("domkit-border");
    $self.onEvent("wheel", false, (e) => {
      if ((!this$.#hasScrolly && e.delta() != null && sys.ObjUtil.compareGT(sys.Float.abs(e.delta().y()), sys.Float.abs(e.delta().x())))) {
        return;
      }
      ;
      this$.onScroll(e.delta());
      e.stop();
      return;
    });
    $self.onEvent("mousedown", false, (e) => {
      this$.onMouseEvent(e);
      return;
    });
    $self.onEvent("mouseup", false, (e) => {
      this$.onMouseEvent(e);
      return;
    });
    $self.onEvent("mousemove", false, (e) => {
      this$.onMouseEvent(e);
      return;
    });
    $self.onEvent("dblclick", false, (e) => {
      this$.onMouseEvent(e);
      return;
    });
    $self.onEvent("keydown", false, (e) => {
      this$.onKeyEvent(e);
      return;
    });
    $self.onEvent("focus", false, (e) => {
      if (!this$.#manFocus) {
        this$.#manFocus = true;
        this$.refresh();
      }
      ;
      return;
    });
    $self.onEvent("blur", false, (e) => {
      this$.#manFocus = false;
      this$.refresh();
      return;
    });
    DomListener.cur().onResize($self, (it) => {
      this$.rebuild();
      return;
    });
    return;
  }

  onHeaderPopup(f) {
    this.#cbHeaderPopup = f;
    return;
  }

  sortCol() {
    return this.#view.sortCol();
  }

  sortDir() {
    return this.#view.sortDir();
  }

  sort(col,dir) {
    if (dir === undefined) dir = Dir.up();
    if (!this.#sortEnabled) {
      return;
    }
    ;
    this.#pivot = null;
    this.#view.sort(col, dir);
    this.model().onSort(col, dir);
    this.refresh();
    ((this$) => { let $_u65 = this$.#cbSort; if ($_u65 == null) return null; return sys.Func.call(this$.#cbSort, this$); })(this);
    return;
  }

  scrollTo(col,row) {
    if ((sys.ObjUtil.equals(this.#numCols, 0) || sys.ObjUtil.compareLE(sys.Int.plus(sys.ObjUtil.coerce(this.#colx.last(), sys.Int.type$), sys.ObjUtil.coerce(this.#colw.last(), sys.Int.type$)), this.#tbodyw))) {
      (col = null);
    }
    ;
    if (sys.ObjUtil.compareLT(this.#numRows, this.#numVisRows)) {
      (row = null);
    }
    ;
    if (col != null) {
      (col = sys.ObjUtil.coerce(sys.Int.min(sys.Int.max(sys.ObjUtil.coerce(col, sys.Int.type$), 0), sys.Int.minus(this.#numCols, 1)), sys.Int.type$.toNullable()));
      let rx = this.#colx.get(sys.ObjUtil.coerce(col, sys.Int.type$));
      let rw = this.#colw.get(sys.ObjUtil.coerce(col, sys.Int.type$));
      let maxx = sys.Int.minus(this.#maxScrollx, this.#tbodyw);
      if (this.#hasScrolly) {
        maxx = sys.Int.plus(maxx, this.#overScroll);
      }
      ;
      (col = sys.ObjUtil.coerce(sys.Int.max(sys.Int.min(sys.ObjUtil.coerce(col, sys.Int.type$), sys.Int.minus(this.#numCols, this.#numVisCols)), 0), sys.Int.type$.toNullable()));
      this.#scrollx = sys.Int.min(rx, maxx);
    }
    ;
    if (row != null) {
      (row = sys.ObjUtil.coerce(sys.Int.min(sys.Int.max(sys.ObjUtil.coerce(row, sys.Int.type$), 0), sys.Int.minus(this.#numRows, 1)), sys.Int.type$.toNullable()));
      let ry = sys.Int.mult(sys.ObjUtil.coerce(row, sys.Int.type$), this.#rowh);
      let miny = this.#scrolly;
      let maxy = sys.Int.minus(sys.Int.plus(this.#scrolly, this.#tbodyh), this.#rowh);
      if (this.#hasScrollx) {
        maxy = sys.Int.minus(maxy, this.#overScroll);
      }
      ;
      if ((sys.ObjUtil.compareGE(ry, miny) && sys.ObjUtil.compareLE(ry, maxy))) {
        (row = null);
      }
      else {
        if (sys.ObjUtil.compareLT(ry, this.#scrolly)) {
          this.#scrolly = ry;
        }
        else {
          this.#scrolly = sys.Int.plus(this.#scrolly, sys.Int.minus(ry, maxy));
          (row = sys.ObjUtil.coerce(sys.Int.max(sys.Int.min(sys.Int.div(this.#scrolly, this.#rowh), sys.Int.minus(this.#numRows, this.#numVisRows)), 0), sys.Int.type$.toNullable()));
        }
        ;
      }
      ;
    }
    ;
    this.onUpdate(sys.ObjUtil.coerce(((this$) => { let $_u66 = col; if ($_u66 != null) return $_u66; return sys.ObjUtil.coerce(this$.#firstVisCol, sys.Int.type$.toNullable()); })(this), sys.Int.type$), sys.ObjUtil.coerce(((this$) => { let $_u67 = row; if ($_u67 != null) return $_u67; return sys.ObjUtil.coerce(this$.#firstVisRow, sys.Int.type$.toNullable()); })(this), sys.Int.type$));
    return;
  }

  onBeforeSelect(f) {
    this.#cbBeforeSelect = f;
    return;
  }

  onSelect(f) {
    this.#cbSelect = f;
    return;
  }

  onAction(f) {
    this.#cbAction = f;
    return;
  }

  onSort(f) {
    this.#cbSort = f;
    return;
  }

  onKeyDown(f) {
    this.#cbKeyDown = f;
    return;
  }

  onTableEvent(type,f) {
    this.#cbTableEvent.set(type, f);
    return;
  }

  onBeforeRebuild() {
    return;
  }

  rebuild() {
    const this$ = this;
    if (sys.ObjUtil.compareGT(this.size().w(), sys.Float.make(0.0))) {
      this.doRebuild();
    }
    else {
      dom.Win.cur().setTimeout(sys.Duration.fromStr("16ms"), () => {
        this$.rebuild();
        return;
      });
    }
    ;
    return;
  }

  refresh() {
    const this$ = this;
    this.refreshHeaders();
    sys.Int.times(this.#numVisRows, (r) => {
      let row = sys.Int.plus(this$.#firstVisRow, r);
      this$.refreshRow(row);
      return;
    });
    return;
  }

  refreshHeaders() {
    const this$ = this;
    sys.Int.times(this.#numVisCols, (c) => {
      let col = sys.Int.plus(this$.#firstVisCol, c);
      let header = this$.#headers.get(sys.ObjUtil.coerce(col, sys.Obj.type$.toNullable()));
      if (header == null) {
        return;
      }
      ;
      this$.refreshHeader(header, col);
      return;
    });
    return;
  }

  refreshHeader(header,col) {
    (header = ((this$) => { let $_u68 = header; if ($_u68 != null) return $_u68; return this$.#headers.get(sys.ObjUtil.coerce(col, sys.Obj.type$.toNullable())); })(this));
    if (header == null) {
      throw sys.Err.make(sys.Str.plus("Header not found: ", sys.ObjUtil.coerce(col, sys.Obj.type$.toNullable())));
    }
    ;
    header.style().removeClass("last");
    if (sys.ObjUtil.equals(col, sys.Int.minus(this.#numCols, 1))) {
      header.style().addClass("last");
    }
    ;
    if ((sys.ObjUtil.compareLT(col, this.#numCols) && sys.ObjUtil.equals(this.#view.colViewToModel(col), this.#view.sortCol()))) {
      header.style().addClass("domkit-Table-header-sort").removeClass("down up popup").addClass(((this$) => { if (sys.ObjUtil.equals(this$.sortDir(), Dir.up())) return "up"; return "down"; })(this));
      if ((sys.ObjUtil.equals(col, sys.Int.minus(this.#numCols, 1)) && this.#hasHpbut)) {
        header.style().addClass("popup");
      }
      ;
    }
    else {
      header.style().removeClass("domkit-Table-header-sort").removeClass("down up popup");
    }
    ;
    if (sys.ObjUtil.compareLT(col, this.#numCols)) {
      this.#view.onHeader(sys.ObjUtil.coerce(header, dom.Elem.type$), col);
    }
    ;
    return;
  }

  refreshRow(row) {
    const this$ = this;
    if ((sys.ObjUtil.compareLT(row, this.#firstVisRow) || sys.ObjUtil.compareGT(row, sys.Int.plus(this.#firstVisRow, this.#numVisRows)))) {
      return;
    }
    ;
    sys.Int.times(this.#numVisCols, (c) => {
      let col = sys.Int.plus(this$.#firstVisCol, c);
      let pos = TablePos.make(col, row);
      let cell = this$.#cells.get(pos);
      if (cell == null) {
        return;
      }
      ;
      this$.refreshCell(cell, pos.col(), pos.row());
      return;
    });
    return;
  }

  refreshCell(cell,col,row) {
    const this$ = this;
    (cell = ((this$) => { let $_u70 = cell; if ($_u70 != null) return $_u70; return this$.#cells.get(TablePos.make(col, row)); })(this));
    if (cell == null) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cell not found: ", sys.ObjUtil.coerce(col, sys.Obj.type$.toNullable())), ","), sys.ObjUtil.coerce(row, sys.Obj.type$.toNullable())));
    }
    ;
    cell.style().removeClass("last").removeClass("domkit-sel");
    if (sys.ObjUtil.compareGT(this.#stripeClasses.size(), 0)) {
      this.#stripeClasses.each((c) => {
        cell.style().removeClass(c);
        return;
      });
      cell.style().addClass(this.#stripeClasses.get(sys.Int.mod(row, this.#stripeClasses.size())));
    }
    ;
    if (sys.ObjUtil.equals(col, sys.Int.minus(this.#numCols, 1))) {
      cell.style().addClass("last");
    }
    ;
    if ((sys.ObjUtil.compareLT(col, this.#numCols) && sys.ObjUtil.compareLT(row, this.#numRows))) {
      let rowSel = sys.ObjUtil.compareGE(this.#sel.indexes().binarySearch(sys.ObjUtil.coerce(this.#view.rowViewToModel(row), sys.Obj.type$.toNullable())), 0);
      if (rowSel) {
        cell.style().addClass("domkit-sel");
      }
      ;
      let flags = TableFlags.make((it) => {
        it.__focused(this$.#manFocus);
        it.__selected(rowSel);
        return;
      });
      this.#view.onCell(sys.ObjUtil.coerce(cell, dom.Elem.type$), col, row, flags);
    }
    ;
    return;
  }

  doRebuild() {
    const this$ = this;
    this.onBeforeRebuild();
    this.#view.refresh();
    this.#view.sort(this.#view.sortCol(), this.#view.sortDir());
    this.#numCols = this.#view.numCols();
    this.#numRows = this.#view.numRows();
    this.#sel.refresh();
    this.#headers.clear();
    this.#cells.clear();
    let tbodysz = this.size();
    this.#theadh = ((this$) => { if (this$.#showHeader) return this$.#view.headerHeight(); return 0; })(this);
    this.#tbodyw = sys.Num.toInt(sys.ObjUtil.coerce(tbodysz.w(), sys.Num.type$));
    this.#tbodyh = sys.Int.minus(sys.Num.toInt(sys.ObjUtil.coerce(tbodysz.h(), sys.Num.type$)), this.#theadh);
    let cx = 0;
    this.#colx.clear();
    this.#colw.clear();
    sys.Int.times(this.#numCols, (c) => {
      let cw = ((this$) => { let $_u72 = this$.#ucolw.get(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable())); if ($_u72 != null) return $_u72; return sys.ObjUtil.coerce(this$.#view.colWidth(c), sys.Int.type$.toNullable()); })(this$);
      this$.#colx.add(sys.ObjUtil.coerce(cx, sys.Obj.type$.toNullable()));
      this$.#colw.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(cw, sys.Int.type$), sys.Obj.type$.toNullable()));
      cx = sys.Int.plus(cx, sys.ObjUtil.coerce(cw, sys.Int.type$));
      return;
    });
    this.#rowh = this.#view.rowHeight();
    this.#numVisCols = sys.Int.plus(this.findMaxVisCols(), 2);
    this.#numVisRows = sys.Int.plus(sys.Int.div(this.#tbodyh, this.#rowh), 2);
    this.#scrollx = 0;
    this.#scrolly = 0;
    this.#maxScrollx = sys.ObjUtil.coerce(this.#colw.reduce(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce((r,w) => {
      return sys.Int.plus(r, w);
    }, sys.Type.find("|sys::Obj?,sys::Int,sys::Int->sys::Obj?|"))), sys.Int.type$);
    this.#maxScrolly = sys.Int.mult(this.#numRows, this.#rowh);
    this.#firstVisCol = 0;
    this.#firstVisRow = 0;
    this.#hasScrollx = sys.ObjUtil.compareGT(this.#maxScrollx, this.#tbodyw);
    this.#hasScrolly = sys.ObjUtil.compareGT(this.#maxScrolly, this.#tbodyh);
    this.#hbar = this.makeScrollBar(Dir.right());
    this.#vbar = this.makeScrollBar(Dir.down());
    if (sys.ObjUtil.compareLE(this.#maxScrollx, this.#tbodyw)) {
      if (sys.ObjUtil.equals(this.#numCols, 0)) {
        this.#numVisCols = 0;
      }
      else {
        this.#numVisCols = this.#numCols;
        this.#colw.set(-1, sys.ObjUtil.coerce(sys.Int.minus(this.#tbodyw, sys.ObjUtil.coerce(this.#colx.last(), sys.Int.type$)), sys.Obj.type$.toNullable()));
      }
      ;
    }
    else {
      if (this.#hasScrolly) {
        ((this$) => { let $_u75 = this$.#colw; let $_u76 = -1; let $_u73 = sys.Int.plus(this$.#colw.get(-1), this$.#overScroll); $_u75.set($_u76,$_u73);  return $_u73; })(this);
      }
      ;
    }
    ;
    this.#thead = sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
      it.style().addClass("domkit-Table-thead");
      it.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.#theadh, sys.Obj.type$.toNullable())), "px")]));
      if (sys.ObjUtil.equals(this$.#theadh, 0)) {
        it.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), ["none"]));
      }
      ;
      return;
    }), dom.Elem.type$);
    sys.Int.times(this.#numVisCols, (c) => {
      let header = sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
        it.style().addClass("domkit-Table-header");
        it.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.colwSafe(c), sys.Obj.type$.toNullable())), "px")]));
        it.style().trap("lineHeight", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Int.plus(this$.#theadh, 1), sys.Obj.type$.toNullable())), "px")]));
        if (sys.ObjUtil.equals(c, sys.Int.minus(this$.#numCols, 1))) {
          it.style().addClass("last");
        }
        ;
        return;
      }), dom.Elem.type$);
      this$.#headers.set(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()), header);
      this$.refreshHeader(header, c);
      this$.#thead.add(header);
      return;
    });
    if (this.#cbHeaderPopup == null) {
      this.#hpbut = null;
      this.#hasHpbut = false;
    }
    else {
      this.#hpbut = sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
        let mtop = sys.Int.plus(sys.Int.div(sys.Int.minus(this$.#theadh, 21), 2), 3);
        it.style().addClass("domkit-Table-header-popup");
        it.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.#theadh, sys.Obj.type$.toNullable())), "px")]));
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
          it.style().trap("marginTop", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(mtop, sys.Obj.type$.toNullable())), "px")]));
          return;
        }), dom.Elem.type$));
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
          return;
        }), dom.Elem.type$));
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
          return;
        }), dom.Elem.type$));
        return;
      }), dom.Elem.type$);
      this.#hasHpbut = true;
      this.#thead.add(sys.ObjUtil.coerce(this.#hpbut, dom.Elem.type$));
    }
    ;
    this.#tbody = sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
      it.style().addClass("domkit-Table-tbody");
      it.style().trap("top", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.#theadh, sys.Obj.type$.toNullable())), "px")]));
      return;
    }), dom.Elem.type$);
    sys.Int.times(this.#numVisRows, (r) => {
      sys.Int.times(this$.#numVisCols, (c) => {
        let rowSel = false;
        let cell = sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
          it.style().addClass("domkit-Table-cell");
          if (sys.ObjUtil.compareGT(this$.#stripeClasses.size(), 0)) {
            it.style().addClass(this$.#stripeClasses.get(sys.Int.mod(r, this$.#stripeClasses.size())));
          }
          ;
          if (sys.ObjUtil.equals(c, sys.Int.minus(this$.#numCols, 1))) {
            it.style().addClass("last");
          }
          ;
          if ((sys.ObjUtil.compareLT(c, this$.#numCols) && sys.ObjUtil.compareLT(r, this$.#numRows))) {
            if (sys.ObjUtil.compareGE(this$.#sel.indexes().binarySearch(sys.ObjUtil.coerce(this$.#view.rowViewToModel(r), sys.Obj.type$.toNullable())), 0)) {
              it.style().addClass("domkit-sel");
              (rowSel = true);
            }
            ;
          }
          ;
          it.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.colwSafe(c), sys.Obj.type$.toNullable())), "px")]));
          it.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.#rowh, sys.Obj.type$.toNullable())), "px")]));
          it.style().trap("lineHeight", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Int.plus(this$.#rowh, 1), sys.Obj.type$.toNullable())), "px")]));
          return;
        }), dom.Elem.type$);
        let flags = TableFlags.make((it) => {
          it.__focused(this$.#manFocus);
          it.__selected(rowSel);
          return;
        });
        this$.#cells.set(TablePos.make(c, r), cell);
        if ((sys.ObjUtil.compareLT(c, this$.#numCols) && sys.ObjUtil.compareLT(r, this$.#numRows))) {
          this$.#view.onCell(cell, c, r, flags);
        }
        ;
        this$.#tbody.add(cell);
        return;
      });
      return;
    });
    this.removeAll();
    this.add(sys.ObjUtil.coerce(this.#thead, dom.Elem.type$));
    this.add(sys.ObjUtil.coerce(this.#tbody, dom.Elem.type$));
    this.add(sys.ObjUtil.coerce(this.#hbar, dom.Elem.type$));
    this.add(sys.ObjUtil.coerce(this.#vbar, dom.Elem.type$));
    this.onUpdate(0, 0);
    if ((dom.Win.cur().isSafari() && sys.ObjUtil.compareGT(this.#cells.size(), 0))) {
      let x = this.#cells.vals().first();
      dom.Win.cur().setTimeout(sys.Duration.fromStr("10ms"), (it) => {
        x.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), ["none"]));
        dom.Win.cur().setTimeout(sys.Duration.fromStr("10ms"), (it) => {
          x.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), ["block"]));
          return;
        });
        return;
      });
    }
    ;
    return;
  }

  makeScrollBar(dir) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
      let xsz = sys.Int.minus(sys.Int.minus(sys.Int.minus(this$.#sbarsz, this$.#thumbMargin), this$.#thumbMargin), 1);
      it.style().addClass("domkit-Table-scrollbar");
      if (sys.ObjUtil.equals(dir, Dir.right())) {
        if (!this$.#hasScrollx) {
          it.style().trap("visibility", sys.List.make(sys.Obj.type$.toNullable(), ["hidden"]));
        }
        ;
        this$.#htrackw = sys.Int.minus(sys.Int.minus(this$.#tbodyw, ((this$) => { if (this$.#hasScrolly) return this$.#sbarsz; return 0; })(this$)), 2);
        this$.#hthumbw = sys.Int.max(sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.mult(sys.Float.div(sys.Num.toFloat(sys.ObjUtil.coerce(this$.#tbodyw, sys.Num.type$)), sys.Num.toFloat(sys.ObjUtil.coerce(this$.#maxScrollx, sys.Num.type$))), sys.Num.toFloat(sys.ObjUtil.coerce(this$.#htrackw, sys.Num.type$))), sys.Num.type$)), xsz);
        it.style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), ["0px"]));
        it.style().trap("bottom", sys.List.make(sys.Obj.type$.toNullable(), ["0px"]));
        it.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.#htrackw, sys.Obj.type$.toNullable())), "px")]));
        it.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.#sbarsz, sys.Obj.type$.toNullable())), "px")]));
        it.style().trap("borderTopWidth", sys.List.make(sys.Obj.type$.toNullable(), ["1px"]));
        it.onEvent("dblclick", false, (e) => {
          e.stop();
          return;
        });
        it.onEvent("mouseup", false, (e) => {
          this$.#hbarPageId = this$.stopScrollPage(this$.#hbarPageId);
          return;
        });
        it.onEvent("mouseout", false, (e) => {
          this$.#hbarPageId = this$.stopScrollPage(this$.#hbarPageId);
          return;
        });
        it.onEvent("mousedown", false, (e) => {
          e.stop();
          let p = e.target().relPos(e.pagePos());
          let thumb = e.target().firstChild();
          if (sys.ObjUtil.compareLT(p.x(), thumb.pos().x())) {
            this$.#hbarPageId = this$.startScrollPage(graphics.Point.makeInt(sys.Int.negate(this$.#tbodyw), 0));
          }
          else {
            if (sys.ObjUtil.compareGT(p.x(), sys.Float.plusInt(thumb.pos().x(), sys.Num.toInt(sys.ObjUtil.coerce(thumb.size().w(), sys.Num.type$))))) {
              this$.#hbarPageId = this$.startScrollPage(graphics.Point.makeInt(this$.#tbodyw, 0));
            }
            ;
          }
          ;
          return;
        });
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
          it.style().trap("margin", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.#thumbMargin, sys.Obj.type$.toNullable())), "px")]));
          it.style().trap("top", sys.List.make(sys.Obj.type$.toNullable(), ["0px"]));
          it.style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), ["0px"]));
          it.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.#hthumbw, sys.Obj.type$.toNullable())), "px")]));
          it.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(xsz, sys.Obj.type$.toNullable())), "px")]));
          it.onEvent("dblclick", false, (e) => {
            e.stop();
            return;
          });
          it.onEvent("mousedown", false, (e) => {
            e.stop();
            this$.#hthumbDragOff = sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(this$.#hbar.firstChild().relPos(e.pagePos()).x(), sys.Num.type$)), sys.Int.type$.toNullable());
            let doc = dom.Win.cur().doc();
            let fmove = null;
            let fup = null;
            (fmove = doc.onEvent("mousemove", true, (de) => {
              let dx = sys.Float.minusInt(this$.#hbar.relPos(de.pagePos()).x(), sys.ObjUtil.coerce(this$.#hthumbDragOff, sys.Int.type$));
              let sx = sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.multInt(sys.Float.div(sys.Num.toFloat(sys.ObjUtil.coerce(dx, sys.Num.type$)), sys.Num.toFloat(sys.ObjUtil.coerce(this$.#htrackw, sys.Num.type$))), this$.#maxScrollx), sys.Num.type$));
              this$.onScroll(graphics.Point.makeInt(sys.Int.minus(sx, this$.#scrollx), 0));
              return;
            }));
            (fup = doc.onEvent("mouseup", true, (de) => {
              de.stop();
              this$.#hthumbDragOff = null;
              doc.removeEvent("mousemove", true, sys.ObjUtil.coerce(fmove, sys.Type.find("sys::Func")));
              doc.removeEvent("mouseup", true, sys.ObjUtil.coerce(fup, sys.Type.find("sys::Func")));
              return;
            }));
            return;
          });
          return;
        }), dom.Elem.type$));
      }
      else {
        if (!this$.#hasScrolly) {
          it.style().trap("visibility", sys.List.make(sys.Obj.type$.toNullable(), ["hidden"]));
        }
        ;
        this$.#vtrackh = sys.Int.minus(sys.Int.minus(this$.#tbodyh, ((this$) => { if (this$.#hasScrollx) return this$.#sbarsz; return 0; })(this$)), 2);
        this$.#vthumbh = sys.Int.max(sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.mult(sys.Float.div(sys.Num.toFloat(sys.ObjUtil.coerce(this$.#tbodyh, sys.Num.type$)), sys.Num.toFloat(sys.ObjUtil.coerce(this$.#maxScrolly, sys.Num.type$))), sys.Num.toFloat(sys.ObjUtil.coerce(this$.#vtrackh, sys.Num.type$))), sys.Num.type$)), xsz);
        it.style().trap("top", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.#theadh, sys.Obj.type$.toNullable())), "px")]));
        it.style().trap("right", sys.List.make(sys.Obj.type$.toNullable(), ["0px"]));
        it.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.#sbarsz, sys.Obj.type$.toNullable())), "px")]));
        it.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.#vtrackh, sys.Obj.type$.toNullable())), "px")]));
        it.style().trap("borderLeftWidth", sys.List.make(sys.Obj.type$.toNullable(), ["1px"]));
        it.onEvent("dblclick", false, (e) => {
          e.stop();
          return;
        });
        it.onEvent("mouseup", false, (e) => {
          this$.#vbarPageId = this$.stopScrollPage(this$.#vbarPageId);
          return;
        });
        it.onEvent("mouseout", false, (e) => {
          this$.#vbarPageId = this$.stopScrollPage(this$.#vbarPageId);
          return;
        });
        it.onEvent("mousedown", false, (e) => {
          e.stop();
          let p = e.target().relPos(e.pagePos());
          let thumb = e.target().firstChild();
          if (sys.ObjUtil.compareLT(p.y(), thumb.pos().y())) {
            this$.#vbarPageId = this$.startScrollPage(graphics.Point.makeInt(0, sys.Int.negate(this$.#tbodyh)));
          }
          else {
            if (sys.ObjUtil.compareGT(p.y(), sys.Float.plusInt(thumb.pos().y(), sys.Num.toInt(sys.ObjUtil.coerce(thumb.size().h(), sys.Num.type$))))) {
              this$.#vbarPageId = this$.startScrollPage(graphics.Point.makeInt(0, this$.#tbodyh));
            }
            ;
          }
          ;
          return;
        });
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
          it.style().trap("margin", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.#thumbMargin, sys.Obj.type$.toNullable())), "px")]));
          it.style().trap("top", sys.List.make(sys.Obj.type$.toNullable(), ["0px"]));
          it.style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), ["0px"]));
          it.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(xsz, sys.Obj.type$.toNullable())), "px")]));
          it.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.#vthumbh, sys.Obj.type$.toNullable())), "px")]));
          it.onEvent("dblclick", false, (e) => {
            e.stop();
            return;
          });
          it.onEvent("mousedown", false, (e) => {
            e.stop();
            this$.#vthumbDragOff = sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(this$.#vbar.firstChild().relPos(e.pagePos()).y(), sys.Num.type$)), sys.Int.type$.toNullable());
            let doc = dom.Win.cur().doc();
            let fmove = null;
            let fup = null;
            (fmove = doc.onEvent("mousemove", true, (de) => {
              let dy = sys.Float.minusInt(this$.#vbar.relPos(de.pagePos()).y(), sys.ObjUtil.coerce(this$.#vthumbDragOff, sys.Int.type$));
              let sy = sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.multInt(sys.Float.div(sys.Num.toFloat(sys.ObjUtil.coerce(dy, sys.Num.type$)), sys.Num.toFloat(sys.ObjUtil.coerce(this$.#vtrackh, sys.Num.type$))), this$.#maxScrolly), sys.Num.type$));
              this$.onScroll(graphics.Point.makeInt(0, sys.Int.minus(sy, this$.#scrolly)));
              return;
            }));
            (fup = doc.onEvent("mouseup", true, (de) => {
              de.stop();
              this$.#vthumbDragOff = null;
              doc.removeEvent("mousemove", true, sys.ObjUtil.coerce(fmove, sys.Type.find("sys::Func")));
              doc.removeEvent("mouseup", true, sys.ObjUtil.coerce(fup, sys.Type.find("sys::Func")));
              return;
            }));
            return;
          });
          return;
        }), dom.Elem.type$));
      }
      ;
      return;
    }), dom.Elem.type$);
  }

  startScrollPage(delta) {
    const this$ = this;
    this.onScroll(delta);
    return sys.ObjUtil.coerce(dom.Win.cur().setInterval(this.#scrollPageFreq, (it) => {
      this$.onScroll(delta);
      return;
    }), sys.Int.type$.toNullable());
  }

  stopScrollPage(fid) {
    if (fid != null) {
      dom.Win.cur().clearInterval(sys.ObjUtil.coerce(fid, sys.Int.type$));
    }
    ;
    return null;
  }

  pulseScrollBar(dir) {
    const this$ = this;
    if (sys.ObjUtil.equals(dir, Dir.right())) {
      this.#hbar.style().addClass("active");
      if (this.#hbarPulseId != null) {
        dom.Win.cur().clearTimeout(sys.ObjUtil.coerce(this.#hbarPulseId, sys.Int.type$));
      }
      ;
      this.#hbarPulseId = sys.ObjUtil.coerce(dom.Win.cur().setTimeout(this.#scrollPulseDir, (it) => {
        this$.#hbar.style().removeClass("active");
        return;
      }), sys.Int.type$.toNullable());
    }
    else {
      this.#vbar.style().addClass("active");
      if (this.#vbarPulseId != null) {
        dom.Win.cur().clearTimeout(sys.ObjUtil.coerce(this.#vbarPulseId, sys.Int.type$));
      }
      ;
      this.#vbarPulseId = sys.ObjUtil.coerce(dom.Win.cur().setTimeout(this.#scrollPulseDir, (it) => {
        this$.#vbar.style().removeClass("active");
        return;
      }), sys.Int.type$.toNullable());
    }
    ;
    return;
  }

  onUpdate(col,row) {
    const this$ = this;
    if (sys.ObjUtil.equals(this.#numCols, 0)) {
      return;
    }
    ;
    if (this.#hasScrollx) {
      let sw = sys.Int.plus(sys.Int.minus(this.#maxScrollx, this.#tbodyw), ((this$) => { if (this$.#hasScrolly) return this$.#overScroll; return 0; })(this));
      let sp = sys.Float.div(sys.Num.toFloat(sys.ObjUtil.coerce(this.#scrollx, sys.Num.type$)), sys.Num.toFloat(sys.ObjUtil.coerce(sw, sys.Num.type$)));
      let hw = sys.Int.minus(sys.Int.minus(this.#htrackw, this.#hthumbw), sys.Int.mult(this.#thumbMargin, 2));
      let hx = sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.mult(sp, sys.Num.toFloat(sys.ObjUtil.coerce(hw, sys.Num.type$))), sys.Num.type$));
      let ox = sys.Str.toInt(sys.Str.getRange(sys.ObjUtil.toStr(this.#hbar.firstChild().style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), []))), sys.Range.make(0, -3)));
      if (sys.ObjUtil.compareNE(ox, hx)) {
        this.pulseScrollBar(Dir.right());
        this.#hbar.firstChild().style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(hx, sys.Obj.type$.toNullable())), "px")]));
      }
      ;
    }
    ;
    if (this.#hasScrolly) {
      let sh = sys.Int.plus(sys.Int.minus(this.#maxScrolly, this.#tbodyh), ((this$) => { if (this$.#hasScrollx) return this$.#overScroll; return 0; })(this));
      let sp = sys.Float.div(sys.Num.toFloat(sys.ObjUtil.coerce(this.#scrolly, sys.Num.type$)), sys.Num.toFloat(sys.ObjUtil.coerce(sh, sys.Num.type$)));
      let vh = sys.Int.minus(sys.Int.minus(this.#vtrackh, this.#vthumbh), sys.Int.mult(this.#thumbMargin, 2));
      let vy = sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.mult(sp, sys.Num.toFloat(sys.ObjUtil.coerce(vh, sys.Num.type$))), sys.Num.type$));
      let oy = sys.Str.toInt(sys.Str.getRange(sys.ObjUtil.toStr(this.#vbar.firstChild().style().trap("top", sys.List.make(sys.Obj.type$.toNullable(), []))), sys.Range.make(0, -3)));
      if (sys.ObjUtil.compareNE(oy, vy)) {
        this.pulseScrollBar(Dir.down());
        this.#vbar.firstChild().style().trap("top", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(vy, sys.Obj.type$.toNullable())), "px")]));
      }
      ;
    }
    ;
    this.#thead.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), ["none"]));
    this.#tbody.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), ["none"]));
    this.onMoveX(col);
    this.onMoveY(row);
    this.#thead.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), [((this$) => { if (sys.ObjUtil.equals(this$.#theadh, 0)) return "none"; return ""; })(this)]));
    this.#tbody.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), [""]));
    this.#headers.each((h,c) => {
      let tx = sys.Int.minus(this$.colxSafe(c), this$.#scrollx);
      h.style().trap("transform", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("translate(", sys.ObjUtil.coerce(tx, sys.Obj.type$.toNullable())), "px, 0)")]));
      return;
    });
    this.#cells.each((c,p) => {
      let tx = sys.Int.minus(this$.colxSafe(p.col()), this$.#scrollx);
      let ty = sys.Int.minus(sys.Int.mult(p.row(), this$.#rowh), this$.#scrolly);
      c.style().trap("transform", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("translate(", sys.ObjUtil.coerce(tx, sys.Obj.type$.toNullable())), "px, "), sys.ObjUtil.coerce(ty, sys.Obj.type$.toNullable())), "px)")]));
      return;
    });
    return;
  }

  onMoveX(col) {
    const this$ = this;
    if (sys.ObjUtil.equals(this.#firstVisCol, col)) {
      return;
    }
    ;
    let oldFirstCol = this.#firstVisCol;
    let delta = sys.Int.minus(col, oldFirstCol);
    let shift = sys.Int.max(sys.Int.abs(delta), this.#numVisCols);
    let count = sys.Int.min(sys.Int.abs(delta), this.#numVisCols);
    sys.Int.times(sys.Int.abs(count), (c) => {
      let oldCol = ((this$) => { if (sys.ObjUtil.compareGT(delta, 0)) return sys.Int.plus(oldFirstCol, c); return sys.Int.minus(sys.Int.minus(sys.Int.plus(oldFirstCol, this$.#numVisCols), c), 1); })(this$);
      let newCol = ((this$) => { if (sys.ObjUtil.compareGT(delta, 0)) return sys.Int.plus(sys.Int.plus(oldFirstCol, shift), c); return sys.Int.plus(sys.Int.plus(oldFirstCol, delta), c); })(this$);
      let newColw = sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this$.colwSafe(newCol), sys.Obj.type$.toNullable())), "px");
      let header = this$.#headers.remove(sys.ObjUtil.coerce(oldCol, sys.Obj.type$.toNullable()));
      header.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), [newColw]));
      this$.#headers.set(sys.ObjUtil.coerce(newCol, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(header, dom.Elem.type$));
      this$.refreshHeader(header, newCol);
      sys.Int.times(this$.#numVisRows, (r) => {
        let row = sys.Int.plus(r, this$.#firstVisRow);
        let op = TablePos.make(oldCol, row);
        let cell = this$.#cells.remove(op);
        cell.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), [newColw]));
        this$.#cells.set(TablePos.make(newCol, row), sys.ObjUtil.coerce(cell, dom.Elem.type$));
        this$.refreshCell(cell, newCol, row);
        return;
      });
      return;
    });
    this.#firstVisCol = col;
    return;
  }

  onMoveY(row) {
    const this$ = this;
    if (sys.ObjUtil.equals(this.#firstVisRow, row)) {
      return;
    }
    ;
    let oldFirstRow = this.#firstVisRow;
    let delta = sys.Int.minus(row, oldFirstRow);
    let shift = sys.Int.max(sys.Int.abs(delta), this.#numVisRows);
    let count = sys.Int.min(sys.Int.abs(delta), this.#numVisRows);
    sys.Int.times(sys.Int.abs(count), (r) => {
      let oldRow = ((this$) => { if (sys.ObjUtil.compareGT(delta, 0)) return sys.Int.plus(oldFirstRow, r); return sys.Int.minus(sys.Int.minus(sys.Int.plus(oldFirstRow, this$.#numVisRows), r), 1); })(this$);
      let newRow = ((this$) => { if (sys.ObjUtil.compareGT(delta, 0)) return sys.Int.plus(sys.Int.plus(oldFirstRow, shift), r); return sys.Int.plus(sys.Int.plus(oldFirstRow, delta), r); })(this$);
      sys.Int.times(this$.#numVisCols, (c) => {
        let col = sys.Int.plus(c, this$.#firstVisCol);
        let op = TablePos.make(col, oldRow);
        let cell = this$.#cells.remove(op);
        this$.#cells.set(TablePos.make(col, newRow), sys.ObjUtil.coerce(cell, dom.Elem.type$));
        this$.refreshCell(cell, col, newRow);
        return;
      });
      return;
    });
    this.#firstVisRow = row;
    return;
  }

  findMaxVisCols() {
    const this$ = this;
    let vis = 0;
    this.#colw.each((w,i) => {
      let dw = 0;
      let di = i;
      while ((sys.ObjUtil.compareLT(dw, this$.#tbodyw) && sys.ObjUtil.compareLT(di, this$.#colw.size()))) {
        dw = sys.Int.plus(dw, this$.#colw.get(((this$) => { let $_u86 = di;di = sys.Int.increment(di); return $_u86; })(this$)));
      }
      ;
      (vis = sys.Int.max(vis, sys.Int.minus(di, i)));
      return;
    });
    return vis;
  }

  openHeaderPopup(button,popup) {
    let x = button.pagePos().x();
    let y = sys.Float.plusInt(button.pagePos().y(), sys.Num.toInt(sys.ObjUtil.coerce(button.size().h(), sys.Num.type$)));
    let w = sys.Num.toInt(sys.ObjUtil.coerce(button.size().w(), sys.Num.type$));
    popup.open(x, y);
    return;
  }

  onScroll(delta) {
    if (delta == null) {
      return;
    }
    ;
    let scrollBoundx = sys.Int.minus(this.#maxScrollx, this.#tbodyw);
    let scrollBoundy = sys.Int.minus(this.#maxScrolly, this.#tbodyh);
    if ((this.#hasScrollx && this.#hasScrolly)) {
      scrollBoundx = sys.Int.plus(scrollBoundx, this.#overScroll);
      scrollBoundy = sys.Int.plus(scrollBoundy, this.#overScroll);
    }
    ;
    this.#scrollx = sys.Int.max(sys.Int.min(sys.Int.plus(this.#scrollx, sys.Num.toInt(sys.ObjUtil.coerce(delta.x(), sys.Num.type$))), scrollBoundx), 0);
    this.#scrolly = sys.Int.max(sys.Int.min(sys.Int.plus(this.#scrolly, sys.Num.toInt(sys.ObjUtil.coerce(delta.y(), sys.Num.type$))), scrollBoundy), 0);
    let col = sys.Int.max(sys.Int.min(sys.Int.max(sys.Int.minus(sys.Int.not(this.#colx.binarySearch(sys.ObjUtil.coerce(this.#scrollx, sys.Obj.type$.toNullable()))), 1), 0), sys.Int.minus(this.#numCols, this.#numVisCols)), 0);
    let row = sys.Int.max(sys.Int.min(sys.Int.div(this.#scrolly, this.#rowh), sys.Int.minus(this.#numRows, this.#numVisRows)), 0);
    this.onUpdate(col, row);
    return;
  }

  onMouseEvent(e) {
    const this$ = this;
    if (sys.ObjUtil.equals(this.#numCols, 0)) {
      return;
    }
    ;
    let p = this.relPos(e.pagePos());
    let mx = sys.Int.plus(sys.Num.toInt(sys.ObjUtil.coerce(p.x(), sys.Num.type$)), this.#scrollx);
    let my = sys.Int.minus(sys.Int.plus(sys.Num.toInt(sys.ObjUtil.coerce(p.y(), sys.Num.type$)), this.#scrolly), this.#theadh);
    this.style().trap("cursor", sys.List.make(sys.Obj.type$.toNullable(), [null]));
    if (sys.ObjUtil.compareGT(mx, sys.Int.plus(sys.ObjUtil.coerce(this.#colx.last(), sys.Int.type$), sys.ObjUtil.coerce(this.#colw.last(), sys.Int.type$)))) {
      return;
    }
    ;
    let col = this.#colx.binarySearch(sys.ObjUtil.coerce(mx, sys.Obj.type$.toNullable()));
    if (sys.ObjUtil.compareLT(col, 0)) {
      (col = sys.Int.minus(sys.Int.not(col), 1));
    }
    ;
    let cx = sys.Int.minus(mx, this.#colx.get(col));
    let canResize = ((sys.ObjUtil.compareGT(col, 0) && sys.ObjUtil.compareLT(cx, 5)) || (sys.ObjUtil.compareLT(col, sys.Int.minus(this.#numCols, 1)) && sys.ObjUtil.compareLT(sys.Int.minus(this.#colw.get(col), cx), 5)));
    if (sys.ObjUtil.compareLT(sys.Num.toInt(sys.ObjUtil.coerce(p.y(), sys.Num.type$)), this.#theadh)) {
      if (sys.ObjUtil.equals(e.type(), "mousemove")) {
        if (canResize) {
          this.style().trap("cursor", sys.List.make(sys.Obj.type$.toNullable(), ["col-resize"]));
        }
        ;
      }
      else {
        if (sys.ObjUtil.equals(e.type(), "mousedown")) {
          if (canResize) {
            this.#resizeCol = sys.ObjUtil.coerce(((this$) => { if (sys.ObjUtil.compareLT(cx, 5)) return sys.Int.minus(col, 1); return col; })(this), sys.Int.type$.toNullable());
            this.style().trap("cursor", sys.List.make(sys.Obj.type$.toNullable(), ["col-resize"]));
            this.add(sys.ObjUtil.coerce(((this$) => { let $_u88 = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
              it.style().addClass("domkit-resize-splitter");
              return;
            }), dom.Elem.type$), (it) => {
              it.style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Float.minusInt(p.x(), 2), sys.Obj.type$.toNullable())), "px")]));
              it.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), ["5px"]));
              it.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), ["100%"]));
              return;
            }), dom.Elem.type$); this$.#resizeElem = $_u88; return $_u88; })(this), dom.Elem.type$));
            let doc = dom.Win.cur().doc();
            let fmove = null;
            let fup = null;
            (fmove = doc.onEvent("mousemove", true, (de) => {
              de.stop();
              let dex = sys.Num.toInt(sys.ObjUtil.coerce(this$.relPos(de.pagePos()).x(), sys.Num.type$));
              this$.#resizeElem.style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Int.minus(dex, 2), sys.Obj.type$.toNullable())), "px")]));
              return;
            }));
            (fup = doc.onEvent("mouseup", true, (de) => {
              let demx = sys.Int.plus(sys.Num.toInt(sys.ObjUtil.coerce(this$.relPos(de.pagePos()).x(), sys.Num.type$)), this$.#scrollx);
              this$.#ucolw.set(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this$.#resizeCol, sys.Int.type$), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.max(20, sys.Int.minus(demx, this$.#colx.get(sys.ObjUtil.coerce(this$.#resizeCol, sys.Int.type$)))), sys.Obj.type$.toNullable()));
              let oldscroll = graphics.Point.makeInt(this$.#scrollx, this$.#scrolly);
              this$.remove(sys.ObjUtil.coerce(this$.#resizeElem, dom.Elem.type$));
              this$.#resizeElem = null;
              this$.doRebuild();
              this$.onScroll(oldscroll);
              de.stop();
              doc.removeEvent("mousemove", true, sys.ObjUtil.coerce(fmove, sys.Type.find("sys::Func")));
              doc.removeEvent("mouseup", true, sys.ObjUtil.coerce(fup, sys.Type.find("sys::Func")));
              return;
            }));
          }
          else {
            if ((this.#hasHpbut && sys.ObjUtil.compareGT(sys.Num.toInt(sys.ObjUtil.coerce(p.x(), sys.Num.type$)), sys.Int.minus(this.#tbodyw, this.#hpbutw)))) {
              let hp = sys.ObjUtil.coerce(sys.Func.call(this.#cbHeaderPopup, this), Popup.type$);
              this.openHeaderPopup(sys.ObjUtil.coerce(this.#hpbut, dom.Elem.type$), hp);
            }
            else {
              (col = this.#view.colViewToModel(col));
              this.sort(sys.ObjUtil.coerce(col, sys.Int.type$.toNullable()), ((this$) => { if (sys.ObjUtil.equals(this$.sortCol(), col)) return ((this$) => { if (sys.ObjUtil.equals(this$.sortDir(), Dir.up())) return Dir.down(); return Dir.up(); })(this$); return Dir.up(); })(this));
            }
            ;
          }
          ;
        }
        ;
      }
      ;
    }
    else {
      let row = sys.Int.div(my, this.#rowh);
      if (sys.ObjUtil.compareGE(row, this.#numRows)) {
        if (sys.ObjUtil.equals(e.type(), "mousedown")) {
          this.updateSel(sys.List.make(sys.Int.type$));
        }
        ;
        return;
      }
      ;
      let cy = sys.Int.minus(my, sys.Int.mult(row, this.#rowh));
      let vcol = col;
      let vrow = row;
      (col = this.#view.colViewToModel(col));
      (row = this.#view.rowViewToModel(row));
      if (sys.ObjUtil.equals(e.type(), "mousedown")) {
        this.onMouseEventSelect(e, row, vrow);
      }
      ;
      if (sys.ObjUtil.equals(e.type(), "dblclick")) {
        ((this$) => { let $_u91 = this$.#cbAction; if ($_u91 == null) return null; return sys.Func.call(this$.#cbAction, this$); })(this);
      }
      ;
      let cb = this.#cbTableEvent.get(e.type());
      if (cb != null) {
        sys.Func.call(cb, TableEvent.make(this, (it) => {
          it.__type(e.type());
          it.__col(col);
          it.__row(row);
          it.__pagePos(e.pagePos());
          it.__cellPos(graphics.Point.makeInt(cx, cy));
          it.__size(graphics.Size.makeInt(this$.#colw.get(vcol), this$.#rowh));
          it._event(e);
          return;
        }));
      }
      ;
    }
    ;
    return;
  }

  onMouseEventSelect(e,row,vrow) {
    const this$ = this;
    this.#manFocus = true;
    if (sys.ObjUtil.equals(e.target().tagName(), "a")) {
      e.target().trap("click", sys.List.make(sys.Obj.type$.toNullable(), []));
      e.stop();
      return;
    }
    ;
    let cur = this.#sel.indexes();
    let newsel = cur.dup();
    if ((e.shift() && this.#pivot != null)) {
      if (sys.ObjUtil.compareLT(vrow, this.#pivot)) {
        sys.Range.make(vrow, sys.ObjUtil.coerce(this.#pivot, sys.Int.type$)).each((i) => {
          newsel.add(sys.ObjUtil.coerce(this$.#view.rowViewToModel(i), sys.Obj.type$.toNullable()));
          return;
        });
        (newsel = newsel.unique().sort());
      }
      else {
        if (sys.ObjUtil.compareGT(vrow, this.#pivot)) {
          sys.Range.make(sys.ObjUtil.coerce(this.#pivot, sys.Int.type$), vrow).each((i) => {
            newsel.add(sys.ObjUtil.coerce(this$.#view.rowViewToModel(i), sys.Obj.type$.toNullable()));
            return;
          });
          (newsel = newsel.unique().sort());
        }
        ;
      }
      ;
    }
    else {
      if ((e.meta() || e.ctrl())) {
        if (cur.contains(sys.ObjUtil.coerce(row, sys.Obj.type$.toNullable()))) {
          newsel.remove(sys.ObjUtil.coerce(row, sys.Obj.type$.toNullable()));
        }
        else {
          newsel.add(sys.ObjUtil.coerce(row, sys.Obj.type$.toNullable())).sort();
        }
        ;
        this.#pivot = sys.ObjUtil.coerce(this.#view.rowModelToView(row), sys.Int.type$.toNullable());
      }
      else {
        (newsel = sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(row, sys.Obj.type$.toNullable())]));
        this.#pivot = sys.ObjUtil.coerce(this.#view.rowModelToView(row), sys.Int.type$.toNullable());
      }
      ;
    }
    ;
    this.updateSel(newsel);
    return;
  }

  onKeyEvent(e) {
    if (sys.ObjUtil.compareNE(e.type(), "keydown")) {
      return;
    }
    ;
    if ((sys.ObjUtil.equals(this.#numCols, 0) || sys.ObjUtil.equals(this.#numRows, 0))) {
      return;
    }
    ;
    let selTop = this.#view.rowViewToModel(0);
    let selBottom = this.#view.rowViewToModel(sys.Int.minus(this.#numRows, 1));
    let selFirstVis = this.#view.rowViewToModel(this.#firstVisRow);
    let pivot = this.#view.rowModelToView(sys.ObjUtil.coerce(((this$) => { let $_u92 = this$.#sel.indexes().first(); if ($_u92 != null) return $_u92; return sys.ObjUtil.coerce(selTop, sys.Int.type$.toNullable()); })(this), sys.Int.type$));
    if (e.meta()) {
      if (sys.ObjUtil.equals(e.key(), dom.Key.up())) {
        e.stop();
        this.updateSel(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(selTop, sys.Obj.type$.toNullable())]));
        this.scrollTo(null, sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()));
        return;
      }
      ;
      if (sys.ObjUtil.equals(e.key(), dom.Key.down())) {
        e.stop();
        this.updateSel(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(selBottom, sys.Obj.type$.toNullable())]));
        this.scrollTo(null, sys.ObjUtil.coerce(sys.Int.minus(this.#numRows, 1), sys.Int.type$.toNullable()));
        return;
      }
      ;
      if (sys.ObjUtil.equals(e.key(), dom.Key.left())) {
        e.stop();
        this.scrollTo(sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()), null);
        return;
      }
      ;
      if (sys.ObjUtil.equals(e.key(), dom.Key.right())) {
        e.stop();
        this.scrollTo(sys.ObjUtil.coerce(sys.Int.minus(this.#numCols, 1), sys.Int.type$.toNullable()), null);
        return;
      }
      ;
    }
    ;
    if (sys.ObjUtil.equals(e.key(), dom.Key.pageUp())) {
      e.stop();
      let prev = sys.Int.max(sys.Int.minus(pivot, sys.Int.minus(this.#numVisRows, 3)), 0);
      this.updateSel(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(this.#view.rowViewToModel(prev), sys.Obj.type$.toNullable())]));
      this.scrollTo(null, sys.ObjUtil.coerce(prev, sys.Int.type$.toNullable()));
      return;
    }
    ;
    if (sys.ObjUtil.equals(e.key(), dom.Key.pageDown())) {
      e.stop();
      let next = sys.Int.min(sys.Int.max(sys.Int.plus(pivot, sys.Int.minus(this.#numVisRows, 3)), 0), sys.Int.minus(this.#numRows, 1));
      this.updateSel(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(this.#view.rowViewToModel(next), sys.Obj.type$.toNullable())]));
      this.scrollTo(null, sys.ObjUtil.coerce(next, sys.Int.type$.toNullable()));
      return;
    }
    ;
    let $_u93 = e.key();
    if (sys.ObjUtil.equals($_u93, dom.Key.left())) {
      let cur = this.#colx.binarySearch(sys.ObjUtil.coerce(this.#scrollx, sys.Obj.type$.toNullable()));
      if (sys.ObjUtil.compareLT(cur, 0)) {
        (cur = sys.Int.minus(sys.Int.not(cur), 1));
      }
      ;
      let pre = ((this$) => { if (sys.ObjUtil.equals(this$.#colx.get(cur), this$.#scrollx)) return sys.Int.minus(cur, 1); return cur; })(this);
      this.scrollTo(sys.ObjUtil.coerce(sys.Int.max(0, pre), sys.Int.type$.toNullable()), null);
      return;
    }
    else if (sys.ObjUtil.equals($_u93, dom.Key.right())) {
      let cur = this.#colx.binarySearch(sys.ObjUtil.coerce(this.#scrollx, sys.Obj.type$.toNullable()));
      if (sys.ObjUtil.compareLT(cur, 0)) {
        (cur = sys.Int.minus(sys.Int.not(cur), 1));
      }
      ;
      this.scrollTo(sys.ObjUtil.coerce(sys.Int.min(sys.Int.minus(this.#numCols, 1), sys.Int.plus(cur, 1)), sys.Int.type$.toNullable()), null);
      return;
    }
    else if (sys.ObjUtil.equals($_u93, dom.Key.up())) {
      if (this.#sel.indexes().isEmpty()) {
        this.updateSel(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(selFirstVis, sys.Obj.type$.toNullable())]));
        this.scrollTo(null, sys.ObjUtil.coerce(this.#firstVisRow, sys.Int.type$.toNullable()));
        return;
      }
      else {
        if (sys.ObjUtil.equals(pivot, 0)) {
          return this.scrollTo(null, sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()));
        }
        ;
        let prev = sys.Int.minus(pivot, 1);
        this.updateSel(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(this.#view.rowViewToModel(prev), sys.Obj.type$.toNullable())]));
        this.scrollTo(null, sys.ObjUtil.coerce(prev, sys.Int.type$.toNullable()));
        return;
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u93, dom.Key.down())) {
      if (this.#sel.indexes().isEmpty()) {
        this.updateSel(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(selFirstVis, sys.Obj.type$.toNullable())]));
        this.scrollTo(null, sys.ObjUtil.coerce(this.#firstVisRow, sys.Int.type$.toNullable()));
        return;
      }
      else {
        if (sys.ObjUtil.equals(pivot, sys.Int.minus(this.#numRows, 1))) {
          return this.scrollTo(null, sys.ObjUtil.coerce(sys.Int.minus(this.#numRows, 1), sys.Int.type$.toNullable()));
        }
        ;
        let next = sys.Int.plus(pivot, 1);
        this.updateSel(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(this.#view.rowViewToModel(next), sys.Obj.type$.toNullable())]));
        this.scrollTo(null, sys.ObjUtil.coerce(next, sys.Int.type$.toNullable()));
        return;
      }
      ;
    }
    ;
    if ((sys.ObjUtil.equals(e.key(), dom.Key.space()) || sys.ObjUtil.equals(e.key(), dom.Key.enter()))) {
      ((this$) => { let $_u95 = this$.#cbAction; if ($_u95 == null) return null; return sys.Func.call(this$.#cbAction, this$); })(this);
      return;
    }
    ;
    if (sys.ObjUtil.equals(e.type(), "keydown")) {
      return ((this$) => { let $_u96 = this$.#cbKeyDown; if ($_u96 == null) return null; return sys.Func.call(this$.#cbKeyDown, e); })(this);
    }
    ;
    return;
  }

  updateSel(newsel) {
    if (!this.#sel.enabled()) {
      return;
    }
    ;
    if (sys.ObjUtil.equals(this.#sel.indexes(), newsel)) {
      return;
    }
    ;
    if (sys.ObjUtil.equals(((this$) => { let $_u97 = this$.#cbBeforeSelect; if ($_u97 == null) return null; return sys.Func.call(this$.#cbBeforeSelect, newsel); })(this), false)) {
      return;
    }
    ;
    this.#sel.indexes(newsel);
    ((this$) => { let $_u98 = this$.#cbSelect; if ($_u98 == null) return null; return sys.Func.call(this$.#cbSelect, this$); })(this);
    return;
  }

  colxSafe(c) {
    return sys.ObjUtil.coerce(((this$) => { let $_u99 = this$.#colx.getSafe(c); if ($_u99 != null) return $_u99; return sys.ObjUtil.coerce(sys.Int.plus(sys.Int.plus(sys.ObjUtil.coerce(this$.#colx.last(), sys.Int.type$), sys.ObjUtil.coerce(this$.#colw.last(), sys.Int.type$)), sys.Int.mult(sys.Int.plus(sys.Int.minus(c, this$.#colx.size()), 1), 100)), sys.Int.type$.toNullable()); })(this), sys.Int.type$);
  }

  colwSafe(c) {
    return sys.ObjUtil.coerce(((this$) => { let $_u100 = this$.#colw.getSafe(c); if ($_u100 != null) return $_u100; return sys.ObjUtil.coerce(100, sys.Int.type$.toNullable()); })(this), sys.Int.type$);
  }

  ts() {
    return sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Duration.now().minus(sys.Duration.boot()).toMillis(), sys.Obj.type$.toNullable())), "ms");
  }

  static static$init() {
    Table.#cellEvents = sys.ObjUtil.coerce(((this$) => { let $_u101 = sys.List.make(sys.Str.type$, ["mousedown", "mouseup", "click", "dblclick"]); if ($_u101 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$, ["mousedown", "mouseup", "click", "dblclick"])); })(this), sys.Type.find("sys::Str[]"));
    return;
  }

}

class TablePos extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TablePos.type$; }

  #col = 0;

  col() { return this.#col; }

  __col(it) { if (it === undefined) return this.#col; else this.#col = it; }

  #row = 0;

  row() { return this.#row; }

  __row(it) { if (it === undefined) return this.#row; else this.#row = it; }

  #hash = 0;

  hash() { return this.#hash; }

  __hash(it) { if (it === undefined) return this.#hash; else this.#hash = it; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  static make(c,r) {
    const $self = new TablePos();
    TablePos.make$($self,c,r);
    return $self;
  }

  static make$($self,c,r) {
    $self.#col = c;
    $self.#row = r;
    $self.#toStr = sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable())), ","), sys.ObjUtil.coerce(r, sys.Obj.type$.toNullable()));
    $self.#hash = sys.Str.hash($self.#toStr);
    return;
  }

  equals(that) {
    return sys.ObjUtil.equals(this.#toStr, sys.ObjUtil.toStr(that));
  }

}

class TableModel extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TableModel.type$; }

  numCols() {
    return 0;
  }

  numRows() {
    return 0;
  }

  headerHeight() {
    return 20;
  }

  colWidth(col) {
    return 100;
  }

  rowHeight() {
    return 20;
  }

  item(row) {
    return sys.ObjUtil.coerce(row, sys.Obj.type$);
  }

  onHeader(header,col) {
    header.text(sys.Str.plus("Col ", sys.ObjUtil.coerce(col, sys.Obj.type$.toNullable())));
    return;
  }

  isVisibleDef(col) {
    return true;
  }

  onCell(cell,col,row,flags) {
    cell.text(sys.Str.plus(sys.Str.plus(sys.Str.plus("C", sys.ObjUtil.coerce(col, sys.Obj.type$.toNullable())), ":R"), sys.ObjUtil.coerce(row, sys.Obj.type$.toNullable())));
    return;
  }

  sortCompare(col,row1,row2) {
    return 0;
  }

  onSort(col,dir) {
    return;
  }

  static make() {
    const $self = new TableModel();
    TableModel.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class TableFlags extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TableFlags.type$; }

  static #defVal = undefined;

  static defVal() {
    if (TableFlags.#defVal === undefined) {
      TableFlags.static$init();
      if (TableFlags.#defVal === undefined) TableFlags.#defVal = null;
    }
    return TableFlags.#defVal;
  }

  #focused = false;

  focused() { return this.#focused; }

  __focused(it) { if (it === undefined) return this.#focused; else this.#focused = it; }

  #selected = false;

  selected() { return this.#selected; }

  __selected(it) { if (it === undefined) return this.#selected; else this.#selected = it; }

  static make(f) {
    const $self = new TableFlags();
    TableFlags.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    sys.Func.call(f, $self);
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("TableFlags { focused=", sys.ObjUtil.coerce(this.#focused, sys.Obj.type$.toNullable())), "; selected="), sys.ObjUtil.coerce(this.#selected, sys.Obj.type$.toNullable())), " }");
  }

  static static$init() {
    const this$ = this;
    TableFlags.#defVal = TableFlags.make((it) => {
      return;
    });
    return;
  }

}

class TableEvent extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TableEvent.type$; }

  #table = null;

  table() {
    return this.#table;
  }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #col = 0;

  col() { return this.#col; }

  __col(it) { if (it === undefined) return this.#col; else this.#col = it; }

  #row = 0;

  row() { return this.#row; }

  __row(it) { if (it === undefined) return this.#row; else this.#row = it; }

  #pagePos = null;

  pagePos() { return this.#pagePos; }

  __pagePos(it) { if (it === undefined) return this.#pagePos; else this.#pagePos = it; }

  #cellPos = null;

  cellPos() { return this.#cellPos; }

  __cellPos(it) { if (it === undefined) return this.#cellPos; else this.#cellPos = it; }

  #size = null;

  size() { return this.#size; }

  __size(it) { if (it === undefined) return this.#size; else this.#size = it; }

  #_event = null;

  _event(it) {
    if (it === undefined) {
      return this.#_event;
    }
    else {
      this.#_event = it;
      return;
    }
  }

  static make(t,f) {
    const $self = new TableEvent();
    TableEvent.make$($self,t,f);
    return $self;
  }

  static make$($self,t,f) {
    $self.#table = t;
    sys.Func.call(f, $self);
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("TableEvent { type=", this.#type), " row="), sys.ObjUtil.coerce(this.#row, sys.Obj.type$.toNullable())), " col="), sys.ObjUtil.coerce(this.#col, sys.Obj.type$.toNullable())), " pagePos="), this.#pagePos), " cellPos="), this.#cellPos), " size="), this.#size), " }");
  }

}

class TableSelection extends IndexSelection {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TableSelection.type$; }

  #view = null;

  // private field reflection only
  __view(it) { if (it === undefined) return this.#view; else this.#view = it; }

  static make(view) {
    const $self = new TableSelection();
    TableSelection.make$($self,view);
    return $self;
  }

  static make$($self,view) {
    IndexSelection.make$($self);
    $self.#view = view;
    return;
  }

  max() {
    return this.#view.numRows();
  }

  toItem(index) {
    return this.#view.table().model().item(index);
  }

  toIndex(item) {
    let numRows = this.#view.numRows();
    for (let row = 0; sys.ObjUtil.compareLT(row, numRows); row = sys.Int.increment(row)) {
      if (sys.ObjUtil.equals(this.#view.table().model().item(row), item)) {
        return sys.ObjUtil.coerce(row, sys.Int.type$.toNullable());
      }
      ;
    }
    ;
    return null;
  }

  onUpdate(oldIndexes,newIndexes) {
    const this$ = this;
    oldIndexes.each((i) => {
      if (sys.ObjUtil.compareLT(i, this$.max())) {
        this$.#view.table().refreshRow(this$.#view.rowModelToView(i));
      }
      ;
      return;
    });
    newIndexes.each((i) => {
      if (sys.ObjUtil.compareLT(i, this$.max())) {
        this$.#view.table().refreshRow(this$.#view.rowModelToView(i));
      }
      ;
      return;
    });
    return;
  }

}

class TableView extends TableModel {
  constructor() {
    super();
    const this$ = this;
    this.#rows = sys.List.make(sys.Int.type$);
    this.#cols = sys.List.make(sys.Int.type$);
    this.#vis = sys.List.make(sys.Bool.type$);
    this.#sortDir = Dir.up();
    return;
  }

  typeof() { return TableView.type$; }

  #table = null;

  table(it) {
    if (it === undefined) {
      return this.#table;
    }
    else {
      this.#table = it;
      return;
    }
  }

  #rows = null;

  // private field reflection only
  __rows(it) { if (it === undefined) return this.#rows; else this.#rows = it; }

  #cols = null;

  // private field reflection only
  __cols(it) { if (it === undefined) return this.#cols; else this.#cols = it; }

  #vis = null;

  // private field reflection only
  __vis(it) { if (it === undefined) return this.#vis; else this.#vis = it; }

  #sortCol = null;

  sortCol() {
    return this.#sortCol;
  }

  #sortDir = null;

  sortDir() {
    return this.#sortDir;
  }

  static make(table) {
    const $self = new TableView();
    TableView.make$($self,table);
    return $self;
  }

  static make$($self,table) {
    TableModel.make$($self);
    ;
    $self.#table = table;
    return;
  }

  numCols() {
    return this.#cols.size();
  }

  numRows() {
    return this.#rows.size();
  }

  headerHeight() {
    return this.#table.model().headerHeight();
  }

  colWidth(c) {
    return this.#table.model().colWidth(this.#cols.get(c));
  }

  rowHeight() {
    return this.#table.model().rowHeight();
  }

  item(r) {
    return this.#table.model().item(this.#rows.get(r));
  }

  onHeader(e,c) {
    this.#table.model().onHeader(e, this.#cols.get(c));
    return;
  }

  onCell(e,c,r,f) {
    this.#table.model().onCell(e, this.#cols.get(c), this.#rows.get(r), f);
    return;
  }

  isColVisible(col) {
    return this.#vis.get(col);
  }

  setColVisible(col,visible) {
    const this$ = this;
    if (sys.ObjUtil.equals(this.#vis.get(col), visible)) {
      return this;
    }
    ;
    this.#vis.set(col, sys.ObjUtil.coerce(visible, sys.Obj.type$.toNullable()));
    this.#cols.clear();
    this.#vis.each((v,i) => {
      if (v) {
        this$.#cols.add(sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
      }
      ;
      return;
    });
    return this;
  }

  sort(col,dir) {
    if (dir === undefined) dir = Dir.up();
    const this$ = this;
    let model = this.#table.model();
    this.#sortCol = col;
    this.#sortDir = dir;
    if (col == null) {
      this.#rows.each((val,i) => {
        this$.#rows.set(i, sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
        return;
      });
    }
    else {
      if (dir === Dir.up()) {
        this.#rows.sort((a,b) => {
          return model.sortCompare(sys.ObjUtil.coerce(col, sys.Int.type$), a, b);
        });
      }
      else {
        this.#rows.sortr((a,b) => {
          return model.sortCompare(sys.ObjUtil.coerce(col, sys.Int.type$), a, b);
        });
      }
      ;
    }
    ;
    return;
  }

  refresh() {
    let model = this.#table.model();
    if (sys.ObjUtil.compareNE(this.#rows.size(), model.numRows())) {
      this.refreshRows();
    }
    ;
    if (sys.ObjUtil.compareNE(this.#vis.size(), model.numCols())) {
      this.refreshCols();
    }
    ;
    return;
  }

  refreshRows() {
    const this$ = this;
    let model = this.#table.model();
    this.#rows.clear();
    this.#rows.capacity(model.numRows());
    sys.Int.times(model.numRows(), (i) => {
      this$.#rows.add(sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
      return;
    });
    if ((this.#sortCol != null && sys.ObjUtil.compareLT(this.#sortCol, model.numCols()))) {
      this.sort(this.#sortCol, this.#sortDir);
    }
    ;
    return;
  }

  refreshCols() {
    const this$ = this;
    let model = this.#table.model();
    this.#cols.clear();
    this.#cols.capacity(model.numCols());
    this.#vis.clear();
    this.#vis.capacity(model.numCols());
    sys.Int.times(model.numCols(), (i) => {
      let visDef = model.isVisibleDef(i);
      this$.#vis.add(sys.ObjUtil.coerce(visDef, sys.Obj.type$.toNullable()));
      if (visDef) {
        this$.#cols.add(sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
      }
      ;
      return;
    });
    return;
  }

  rowViewToModel(i) {
    return this.#rows.get(i);
  }

  colViewToModel(i) {
    return this.#cols.get(i);
  }

  rowsViewToModel(i) {
    const this$ = this;
    return sys.ObjUtil.coerce(i.map((x) => {
      return this$.#rows.get(x);
    }, sys.Int.type$), sys.Type.find("sys::Int[]"));
  }

  colsViewToModel(i) {
    const this$ = this;
    return sys.ObjUtil.coerce(i.map((x) => {
      return this$.#cols.get(x);
    }, sys.Int.type$), sys.Type.find("sys::Int[]"));
  }

  rowModelToView(i) {
    const this$ = this;
    return sys.ObjUtil.coerce(this.#rows.findIndex((x) => {
      return sys.ObjUtil.equals(x, i);
    }), sys.Int.type$);
  }

  colModelToView(i) {
    const this$ = this;
    return sys.ObjUtil.coerce(this.#cols.findIndex((x) => {
      return sys.ObjUtil.equals(x, i);
    }), sys.Int.type$);
  }

  rowsModelToView(i) {
    const this$ = this;
    return sys.ObjUtil.coerce(i.map((x) => {
      return this$.rowModelToView(x);
    }, sys.Int.type$), sys.Type.find("sys::Int[]"));
  }

  colsModelToView(i) {
    const this$ = this;
    return sys.ObjUtil.coerce(i.map((x) => {
      return this$.colModelToView(x);
    }, sys.Int.type$), sys.Type.find("sys::Int[]"));
  }

}

class ScrollBox extends Box {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#cbScroll = null;
    return;
  }

  typeof() { return ScrollBox.type$; }

  #cbScroll = null;

  // private field reflection only
  __cbScroll(it) { if (it === undefined) return this.#cbScroll; else this.#cbScroll = it; }

  static make() {
    const $self = new ScrollBox();
    ScrollBox.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    Box.make$($self);
    ;
    $self.style().addClass("domkit-ScrollBox").addClass("domkit-border");
    $self.onEvent("scroll", false, (e) => {
      this$.fireScroll(e);
      return;
    });
    return;
  }

  onScroll(f) {
    this.#cbScroll = f;
    return;
  }

  fireScroll(e) {
    ((this$) => { let $_u102 = this$.#cbScroll; if ($_u102 == null) return null; return sys.Func.call(this$.#cbScroll, this$); })(this);
    return;
  }

}

class WellBox extends Box {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
  }

  typeof() { return WellBox.type$; }

  static make() {
    const $self = new WellBox();
    WellBox.make$($self);
    return $self;
  }

  static make$($self) {
    Box.make$($self);
    $self.style().addClass("domkit-WellBox");
    return;
  }

  mergeHeader(header,halign) {
    if (halign === undefined) halign = Align.left();
    const this$ = this;
    header.style().trap("top", sys.List.make(sys.Obj.type$.toNullable(), ["12px"]));
    header.style().trap("zIndex", sys.List.make(sys.Obj.type$.toNullable(), ["10"]));
    let $_u103 = halign;
    if (sys.ObjUtil.equals($_u103, Align.center())) {
      header.style().trap("textAlign", sys.List.make(sys.Obj.type$.toNullable(), ["center"]));
    }
    else if (sys.ObjUtil.equals($_u103, Align.right())) {
      header.style().trap("right", sys.List.make(sys.Obj.type$.toNullable(), ["10px"]));
    }
    else {
      header.style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), ["10px"]));
    }
    ;
    this.style().trap("paddingTop", sys.List.make(sys.Obj.type$.toNullable(), ["24px"]));
    return sys.ObjUtil.coerce(sys.ObjUtil.with(Box.make(), (it) => {
      it.style().trap("marginTop", sys.List.make(sys.Obj.type$.toNullable(), ["-12px"]));
      sys.ObjUtil.coerce(it.add(header), Box.type$).add(this$);
      return;
    }), Box.type$);
  }

}

class DomListener extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#checkFreq = 1000000000;
    this.#map = dom.WeakMap.make();
    this.#mounted = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("dom::Elem"));
    this.#checkMutations = sys.List.make(dom.MutationRec.type$);
    this.#checkState = sys.List.make(dom.Elem.type$);
    return;
  }

  typeof() { return DomListener.type$; }

  #checkFreq = 0;

  // private field reflection only
  __checkFreq(it) { if (it === undefined) return this.#checkFreq; else this.#checkFreq = it; }

  #lastTicks = null;

  // private field reflection only
  __lastTicks(it) { if (it === undefined) return this.#lastTicks; else this.#lastTicks = it; }

  #observer = null;

  // private field reflection only
  __observer(it) { if (it === undefined) return this.#observer; else this.#observer = it; }

  #map = null;

  // private field reflection only
  __map(it) { if (it === undefined) return this.#map; else this.#map = it; }

  #mounted = null;

  // private field reflection only
  __mounted(it) { if (it === undefined) return this.#mounted; else this.#mounted = it; }

  #checkMutations = null;

  // private field reflection only
  __checkMutations(it) { if (it === undefined) return this.#checkMutations; else this.#checkMutations = it; }

  #checkState = null;

  // private field reflection only
  __checkState(it) { if (it === undefined) return this.#checkState; else this.#checkState = it; }

  static cur() {
    let r = sys.ObjUtil.as(concurrent.Actor.locals().get("domkit.DomListener"), DomListener.type$);
    if (r == null) {
      concurrent.Actor.locals().set("domkit.DomListener", (r = DomListener.make()));
    }
    ;
    return sys.ObjUtil.coerce(r, DomListener.type$);
  }

  static make() {
    const $self = new DomListener();
    DomListener.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    ;
    $self.#observer = dom.MutationObserver.make((recs) => {
      this$.#checkMutations.addAll(recs);
      return;
    });
    $self.#observer.observe(dom.Win.cur().doc().body(), sys.Map.__fromLiteral(["childList","subtree"], [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")));
    $self.reqCheck();
    return;
  }

  onMount(target,f) {
    let state = sys.ObjUtil.coerce(((this$) => { let $_u104 = this$.#map.get(target); if ($_u104 != null) return $_u104; return DomState.make(); })(this), DomState.type$);
    state.onMount(f);
    this.#map.set(target, state);
    return;
  }

  onUnmount(target,f) {
    let state = sys.ObjUtil.coerce(((this$) => { let $_u105 = this$.#map.get(target); if ($_u105 != null) return $_u105; return DomState.make(); })(this), DomState.type$);
    state.onUnmount(f);
    this.#map.set(target, state);
    return;
  }

  onResize(target,f) {
    let state = sys.ObjUtil.coerce(((this$) => { let $_u106 = this$.#map.get(target); if ($_u106 != null) return $_u106; return DomState.make(); })(this), DomState.type$);
    state.onResize(f);
    this.#map.set(target, state);
    return;
  }

  reqCheck() {
    const this$ = this;
    dom.Win.cur().reqAnimationFrame(() => {
      this$.onCheck();
      return;
    });
    return;
  }

  onCheck() {
    const this$ = this;
    try {
      let nowTicks = sys.Duration.nowTicks();
      if ((this.#lastTicks != null && sys.ObjUtil.compareLT(sys.Int.minus(nowTicks, sys.ObjUtil.coerce(this.#lastTicks, sys.Int.type$)), this.#checkFreq))) {
        return;
      }
      ;
      this.#lastTicks = sys.ObjUtil.coerce(nowTicks, sys.Int.type$.toNullable());
      this.#checkMutations.each((r,i) => {
        this$.#checkState.clear();
        r.added().each((e) => {
          this$.findRegNodes(e, this$.#checkState);
          return;
        });
        this$.#checkState.each((e) => {
          let s = sys.ObjUtil.coerce(this$.#map.get(e), DomState.type$);
          s.fireMount(e);
          this$.#mounted.set(sys.ObjUtil.coerce(sys.ObjUtil.hash(e), sys.Obj.type$.toNullable()), e);
          return;
        });
        this$.#checkState.clear();
        r.removed().each((e) => {
          this$.findRegNodes(e, this$.#checkState);
          return;
        });
        this$.#checkState.each((e) => {
          let s = sys.ObjUtil.coerce(this$.#map.get(e), DomState.type$);
          s.fireUnmount(e);
          this$.#mounted.remove(sys.ObjUtil.coerce(sys.ObjUtil.hash(e), sys.Obj.type$.toNullable()));
          return;
        });
        return;
      });
      this.#checkMutations.clear();
      this.#checkState.clear();
      this.#mounted.each((e) => {
        let s = sys.ObjUtil.coerce(this$.#map.get(e), DomState.type$);
        if (s.onResize() != null) {
          s.newSize(e.size());
          if (s.lastSize() == null) {
            s.lastSize(s.newSize());
          }
          ;
          if (sys.ObjUtil.compareNE(s.lastSize(), s.newSize())) {
            s.fireResize(e);
          }
          ;
          s.lastSize(s.newSize());
        }
        ;
        return;
      });
    }
    catch ($_u107) {
      $_u107 = sys.Err.make($_u107);
      if ($_u107 instanceof sys.Err) {
        let err = $_u107;
        ;
        err.trace();
      }
      else {
        throw $_u107;
      }
    }
    finally {
      this.reqCheck();
    }
    ;
    return;
  }

  findRegNodes(elem,list) {
    const this$ = this;
    if (this.#map.has(elem)) {
      list.add(elem);
    }
    ;
    elem.children().each((c) => {
      this$.findRegNodes(c, list);
      return;
    });
    return;
  }

}

class DomState extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#onMount = null;
    this.#onUnmount = null;
    this.#onResize = null;
    this.#mounted = false;
    this.#unmounted = true;
    return;
  }

  typeof() { return DomState.type$; }

  #onMount = null;

  onMount(it) {
    if (it === undefined) {
      return this.#onMount;
    }
    else {
      this.#onMount = it;
      return;
    }
  }

  #onUnmount = null;

  onUnmount(it) {
    if (it === undefined) {
      return this.#onUnmount;
    }
    else {
      this.#onUnmount = it;
      return;
    }
  }

  #onResize = null;

  onResize(it) {
    if (it === undefined) {
      return this.#onResize;
    }
    else {
      this.#onResize = it;
      return;
    }
  }

  #lastSize = null;

  lastSize(it) {
    if (it === undefined) {
      return this.#lastSize;
    }
    else {
      this.#lastSize = it;
      return;
    }
  }

  #newSize = null;

  newSize(it) {
    if (it === undefined) {
      return this.#newSize;
    }
    else {
      this.#newSize = it;
      return;
    }
  }

  #mounted = false;

  // private field reflection only
  __mounted(it) { if (it === undefined) return this.#mounted; else this.#mounted = it; }

  #unmounted = false;

  // private field reflection only
  __unmounted(it) { if (it === undefined) return this.#unmounted; else this.#unmounted = it; }

  fireMount(elem) {
    if (this.#mounted) {
      return;
    }
    ;
    this.#mounted = true;
    this.#unmounted = false;
    try {
      ((this$) => { let $_u108 = this$.#onMount; if ($_u108 == null) return null; return sys.Func.call(this$.#onMount, elem); })(this);
    }
    catch ($_u109) {
      $_u109 = sys.Err.make($_u109);
      if ($_u109 instanceof sys.Err) {
        let err = $_u109;
        ;
        err.trace();
      }
      else {
        throw $_u109;
      }
    }
    ;
    return;
  }

  fireUnmount(elem) {
    if (this.#unmounted) {
      return;
    }
    ;
    this.#mounted = false;
    this.#unmounted = true;
    try {
      ((this$) => { let $_u110 = this$.#onUnmount; if ($_u110 == null) return null; return sys.Func.call(this$.#onUnmount, elem); })(this);
    }
    catch ($_u111) {
      $_u111 = sys.Err.make($_u111);
      if ($_u111 instanceof sys.Err) {
        let err = $_u111;
        ;
        err.trace();
      }
      else {
        throw $_u111;
      }
    }
    ;
    return;
  }

  fireResize(elem) {
    try {
      ((this$) => { let $_u112 = this$.#onResize; if ($_u112 == null) return null; return sys.Func.call(this$.#onResize, elem); })(this);
    }
    catch ($_u113) {
      $_u113 = sys.Err.make($_u113);
      if ($_u113 instanceof sys.Err) {
        let err = $_u113;
        ;
        err.trace();
      }
      else {
        throw $_u113;
      }
    }
    ;
    return;
  }

  static make() {
    const $self = new DomState();
    DomState.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class Checkbox extends dom.Elem {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#cbAction = null;
    return;
  }

  typeof() { return Checkbox.type$; }

  #indeterminate = false;

  indeterminate(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.trap("indeterminate", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Bool.type$);
    }
    else {
      this.trap("indeterminate", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(it, sys.Obj.type$.toNullable())]));
      return;
    }
  }

  #checked = false;

  checked(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.trap("checked", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Bool.type$);
    }
    else {
      this.trap("checked", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(it, sys.Obj.type$.toNullable())]));
      return;
    }
  }

  #cbAction = null;

  // private field reflection only
  __cbAction(it) { if (it === undefined) return this.#cbAction; else this.#cbAction = it; }

  static make() {
    const $self = new Checkbox();
    Checkbox.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    dom.Elem.make$($self, "input");
    ;
    $self.set("type", "checkbox");
    $self.style().addClass("domkit-Checkbox");
    $self.onEvent("change", false, (e) => {
      this$.fireAction(e);
      return;
    });
    return;
  }

  wrap(content) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make("label"), (it) => {
      it.add(this$).add(sys.ObjUtil.coerce(((this$) => { if (sys.ObjUtil.is(content, dom.Elem.type$)) return content; return sys.ObjUtil.coerce(sys.ObjUtil.with(Label.make(), (it) => {
        it.text(sys.ObjUtil.toStr(content));
        return;
      }), Label.type$); })(this$), dom.Elem.type$));
      return;
    }), dom.Elem.type$);
  }

  onAction(f) {
    this.#cbAction = f;
    return;
  }

  fireAction(e) {
    ((this$) => { let $_u115 = this$.#cbAction; if ($_u115 == null) return null; return sys.Func.call(this$.#cbAction, this$); })(this);
    return;
  }

}

class TextArea extends dom.Elem {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#cbModify = null;
    return;
  }

  typeof() { return TextArea.type$; }

  #cols = null;

  cols(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.trap("cols", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$.toNullable());
    }
    else {
      this.trap("cols", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(it, sys.Obj.type$.toNullable())]));
      return;
    }
  }

  #rows = null;

  rows(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.trap("rows", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$.toNullable());
    }
    else {
      this.trap("rows", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(it, sys.Obj.type$.toNullable())]));
      return;
    }
  }

  #placeholder = null;

  placeholder(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.trap("placeholder", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$.toNullable());
    }
    else {
      this.trap("placeholder", sys.List.make(sys.Obj.type$.toNullable(), [it]));
      return;
    }
  }

  #ro = false;

  ro(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.prop("readOnly"), sys.Bool.type$);
    }
    else {
      this.setProp("readOnly", sys.ObjUtil.coerce(it, sys.Obj.type$.toNullable()));
      return;
    }
  }

  #val = null;

  val(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.trap("value", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
    }
    else {
      this.trap("value", sys.List.make(sys.Obj.type$.toNullable(), [it]));
      return;
    }
  }

  #cbModify = null;

  // private field reflection only
  __cbModify(it) { if (it === undefined) return this.#cbModify; else this.#cbModify = it; }

  static make() {
    const $self = new TextArea();
    TextArea.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    dom.Elem.make$($self, "textarea");
    ;
    $self.style().addClass("domkit-control domkit-control-text domkit-TextArea");
    $self.onEvent("input", false, (e) => {
      this$.fireModify(e);
      return;
    });
    return;
  }

  onModify(f) {
    this.#cbModify = f;
    return;
  }

  fireModify(e) {
    ((this$) => { let $_u116 = this$.#cbModify; if ($_u116 == null) return null; return sys.Func.call(this$.#cbModify, this$); })(this);
    return;
  }

}

class AccordionBox extends Box {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
  }

  typeof() { return AccordionBox.type$; }

  static make() {
    const $self = new AccordionBox();
    AccordionBox.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    Box.make$($self);
    $self.style().addClass("domkit-AccordionBox");
    $self.onEvent("mousedown", false, (e) => {
      this$.onMouseDown(e);
      return;
    });
    return;
  }

  addGroup(header,kids,expanded) {
    if (expanded === undefined) expanded = false;
    const this$ = this;
    header.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), ["block"]));
    kids.each((k) => {
      k.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), ["none"]));
      return;
    });
    let group = sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
      it.style().addClass("domkit-AccordionBox-group collapsed");
      return;
    }), dom.Elem.type$);
    group.add(header);
    group.addAll(kids);
    this.add(group);
    if (expanded) {
      this.expand(sys.Int.minus(this.children().size(), 1), true);
    }
    ;
    return this;
  }

  isExpanded(groupIndex) {
    let group = this.children().getSafe(groupIndex);
    if (group == null) {
      return false;
    }
    ;
    return group.style().hasClass("expanded");
  }

  expand(groupIndex,expanded) {
    const this$ = this;
    let group = this.children().getSafe(groupIndex);
    if (group == null) {
      return;
    }
    ;
    if (expanded) {
      group.style().removeClass("collapsed").addClass("expanded");
      group.children().each((k) => {
        k.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), ["block"]));
        return;
      });
    }
    else {
      group.style().removeClass("expanded").addClass("collapsed");
      group.children().eachRange(sys.Range.make(1, -1), (k) => {
        k.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), ["none"]));
        return;
      });
    }
    ;
    return;
  }

  onMouseDown(e) {
    const this$ = this;
    let kids = this.children();
    let group = kids.find((g) => {
      return g.containsChild(e.target());
    });
    if (group == null) {
      return;
    }
    ;
    if (group.firstChild().containsChild(e.target())) {
      let index = kids.findIndex((g) => {
        return sys.ObjUtil.equals(g, group);
      });
      this.expand(sys.ObjUtil.coerce(index, sys.Int.type$), !this.isExpanded(sys.ObjUtil.coerce(index, sys.Int.type$)));
    }
    ;
    return;
  }

}

class Link extends dom.Elem {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#uri = sys.Uri.fromStr("#");
    return;
  }

  typeof() { return Link.type$; }

  #target = null;

  target(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.trap("target", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
    }
    else {
      this.trap("target", sys.List.make(sys.Obj.type$.toNullable(), [it]));
      return;
    }
  }

  #uri = null;

  uri(it) {
    if (it === undefined) {
      return this.#uri;
    }
    else {
      this.#uri = it;
      this.setAttr("href", this.#uri.encode());
      return;
    }
  }

  static make() {
    const $self = new Link();
    Link.make$($self);
    return $self;
  }

  static make$($self) {
    dom.Elem.make$($self, "a");
    ;
    $self.style().addClass("domkit-control domkit-Link");
    $self.uri(sys.Uri.fromStr("#"));
    return;
  }

}

class DragTarget extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DragTarget.type$; }

  #cbDrag = null;

  // private field reflection only
  __cbDrag(it) { if (it === undefined) return this.#cbDrag; else this.#cbDrag = it; }

  #cbDragImage = null;

  // private field reflection only
  __cbDragImage(it) { if (it === undefined) return this.#cbDragImage; else this.#cbDragImage = it; }

  #cbEnd = null;

  // private field reflection only
  __cbEnd(it) { if (it === undefined) return this.#cbEnd; else this.#cbEnd = it; }

  #dragImage = null;

  // private field reflection only
  __dragImage(it) { if (it === undefined) return this.#dragImage; else this.#dragImage = it; }

  static bind(elem) {
    return DragTarget.make(elem);
  }

  static make(elem) {
    const $self = new DragTarget();
    DragTarget.make$($self,elem);
    return $self;
  }

  static make$($self,elem) {
    const this$ = $self;
    elem.trap("draggable", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())]));
    elem.onEvent("dragstart", false, (e) => {
      if (this$.#cbDrag == null) {
        return;
      }
      ;
      let data = sys.Func.call(this$.#cbDrag, elem);
      DndUtil.setData(e.dataTransfer(), data);
      if (this$.#cbDragImage != null) {
        this$.#dragImage = sys.ObjUtil.coerce(sys.Func.call(this$.#cbDragImage, data), dom.Elem.type$.toNullable());
        this$.#dragImage.style().trap("position", sys.List.make(sys.Obj.type$.toNullable(), ["absolute"]));
        this$.#dragImage.style().trap("top", sys.List.make(sys.Obj.type$.toNullable(), ["-1000px"]));
        this$.#dragImage.style().trap("right", sys.List.make(sys.Obj.type$.toNullable(), ["-1000px"]));
        dom.Win.cur().doc().body().add(sys.ObjUtil.coerce(this$.#dragImage, dom.Elem.type$));
        e.dataTransfer().setDragImage(sys.ObjUtil.coerce(this$.#dragImage, dom.Elem.type$), 0, 0);
      }
      ;
      return;
    });
    elem.onEvent("dragend", false, (e) => {
      if (this$.#cbEnd != null) {
        sys.Func.call(this$.#cbEnd, elem);
      }
      ;
      ((this$) => { let $_u117 = ((this$) => { let $_u118 = this$.#dragImage; if ($_u118 == null) return null; return this$.#dragImage.parent(); })(this$); if ($_u117 == null) return null; return ((this$) => { let $_u119 = this$.#dragImage; if ($_u119 == null) return null; return this$.#dragImage.parent(); })(this$).remove(sys.ObjUtil.coerce(this$.#dragImage, dom.Elem.type$)); })(this$);
      DndUtil.clearData(e.dataTransfer());
      return;
    });
    return;
  }

  onDrag(f) {
    this.#cbDrag = f;
    return;
  }

  onDragImage(f) {
    this.#cbDragImage = f;
    return;
  }

  onEnd(f) {
    this.#cbEnd = f;
    return;
  }

}

class DropTarget extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DropTarget.type$; }

  #cbCanDrop = null;

  // private field reflection only
  __cbCanDrop(it) { if (it === undefined) return this.#cbCanDrop; else this.#cbCanDrop = it; }

  #cbDrop = null;

  // private field reflection only
  __cbDrop(it) { if (it === undefined) return this.#cbDrop; else this.#cbDrop = it; }

  #cbOver = null;

  // private field reflection only
  __cbOver(it) { if (it === undefined) return this.#cbOver; else this.#cbOver = it; }

  #cbLeave = null;

  // private field reflection only
  __cbLeave(it) { if (it === undefined) return this.#cbLeave; else this.#cbLeave = it; }

  #depth = 0;

  // private field reflection only
  __depth(it) { if (it === undefined) return this.#depth; else this.#depth = it; }

  static bind(elem) {
    return DropTarget.make(elem);
  }

  static make(elem) {
    const $self = new DropTarget();
    DropTarget.make$($self,elem);
    return $self;
  }

  static make$($self,elem) {
    const this$ = $self;
    let pos = elem.style().get("position");
    if ((sys.ObjUtil.compareNE(pos, "relative") || sys.ObjUtil.compareNE(pos, "absolute"))) {
      elem.style().set("position", "relative");
    }
    ;
    elem.onEvent("dragenter", false, (e) => {
      e.stop();
      let data = DndUtil.getData(e.dataTransfer());
      if (this$._canDrop(data)) {
        elem.style().addClass("domkit-dnd-over");
      }
      ;
      return;
    });
    elem.onEvent("dragover", false, (e) => {
      e.stop();
      if (this$.#cbOver != null) {
        let x = sys.ObjUtil.coerce(e.trap("clientX", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$);
        let y = sys.ObjUtil.coerce(e.trap("clientY", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$);
        sys.Func.call(this$.#cbOver, graphics.Point.makeInt(x, y));
      }
      ;
      return;
    });
    elem.onEvent("dragleave", false, (e) => {
      if (sys.ObjUtil.equals(e.target(), elem)) {
        elem.style().removeClass("domkit-dnd-over");
        ((this$) => { let $_u120 = this$.#cbLeave; if ($_u120 == null) return null; return sys.Func.call(this$.#cbLeave); })(this$);
      }
      ;
      return;
    });
    elem.onEvent("drop", false, (e) => {
      e.stop();
      elem.style().removeClass("domkit-dnd-over");
      let data = DndUtil.getData(e.dataTransfer());
      if (this$._canDrop(data)) {
        ((this$) => { let $_u121 = this$.#cbDrop; if ($_u121 == null) return null; return sys.Func.call(this$.#cbDrop, data); })(this$);
      }
      ;
      return;
    });
    return;
  }

  canDrop(f) {
    this.#cbCanDrop = f;
    return;
  }

  onDrop(f) {
    this.#cbDrop = f;
    return;
  }

  onOver(f) {
    this.#cbOver = f;
    return;
  }

  onLeave(f) {
    this.#cbLeave = f;
    return;
  }

  _canDrop(data) {
    return sys.ObjUtil.coerce(((this$) => { if (this$.#cbCanDrop == null) return sys.ObjUtil.coerce(true, sys.Obj.type$); return sys.Func.call(this$.#cbCanDrop, data); })(this), sys.Bool.type$);
  }

}

class DndUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DndUtil.type$; }

  static #dataRef = undefined;

  static dataRef() {
    if (DndUtil.#dataRef === undefined) {
      DndUtil.static$init();
      if (DndUtil.#dataRef === undefined) DndUtil.#dataRef = null;
    }
    return DndUtil.#dataRef;
  }

  static getData(dt) {
    let data = sys.ObjUtil.coerce(DndUtil.dataRef().val(), sys.Unsafe.type$).val();
    if (data != null) {
      return sys.ObjUtil.coerce(data, sys.Obj.type$);
    }
    ;
    if (!dt.files().isEmpty()) {
      return dt.files();
    }
    ;
    return dt.getData("text/plain");
  }

  static setData(dt,data) {
    DndUtil.dataRef().val(sys.Unsafe.make(data));
    dt.setData("text/plain", sys.ObjUtil.toStr(data));
    return;
  }

  static clearData(dt) {
    DndUtil.dataRef().val(sys.Unsafe.make(null));
    return;
  }

  static make() {
    const $self = new DndUtil();
    DndUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    DndUtil.#dataRef = concurrent.AtomicRef.make(sys.Unsafe.make(null));
    return;
  }

}

class ButtonGroup extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#buttons = sys.List.make(dom.Elem.type$);
    this.#inheritEnabled = true;
    this.#enabled = true;
    this.#selIndex = null;
    return;
  }

  typeof() { return ButtonGroup.type$; }

  #buttons = null;

  buttons(it) {
    if (it === undefined) {
      return this.#buttons;
    }
    else {
      this.#buttons = it;
      this.update();
      return;
    }
  }

  #inheritEnabled = false;

  inheritEnabled(it) {
    if (it === undefined) {
      return this.#inheritEnabled;
    }
    else {
      this.#inheritEnabled = it;
      return;
    }
  }

  #enabled = false;

  enabled(it) {
    if (it === undefined) {
      return this.#enabled;
    }
    else {
      const this$ = this;
      this.#enabled = it;
      if (this.#inheritEnabled) {
        this.buttons().each((b) => {
          b.enabled(sys.ObjUtil.coerce(this$.#enabled, sys.Bool.type$.toNullable()));
          return;
        });
      }
      ;
      return;
    }
  }

  #selIndex = null;

  selIndex(it) {
    if (it === undefined) {
      return this.#selIndex;
    }
    else {
      let old = this.#selIndex;
      let mod = ((this$) => { let $_u123 = ((this$) => { let $_u124 = this$.#cbBeforeSelect; if ($_u124 == null) return null; return sys.Func.call(this$.#cbBeforeSelect, this$, sys.ObjUtil.coerce(it, sys.Obj.type$)); })(this$); if ($_u123 != null) return $_u123; return sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()); })(this);
      if (sys.ObjUtil.coerce(mod, sys.Bool.type$)) {
        this.#selIndex = it;
      }
      ;
      this.update();
      if (sys.ObjUtil.compareNE(it, old)) {
        ((this$) => { let $_u125 = this$.#cbSelect; if ($_u125 == null) return null; return sys.Func.call(this$.#cbSelect, this$); })(this);
      }
      ;
      return;
    }
  }

  #_event = null;

  _event(it) {
    if (it === undefined) {
      return this.#_event;
    }
    else {
      this.#_event = it;
      return;
    }
  }

  #cbBeforeSelect = null;

  // private field reflection only
  __cbBeforeSelect(it) { if (it === undefined) return this.#cbBeforeSelect; else this.#cbBeforeSelect = it; }

  #cbSelect = null;

  // private field reflection only
  __cbSelect(it) { if (it === undefined) return this.#cbSelect; else this.#cbSelect = it; }

  add(button) {
    if (this.#inheritEnabled) {
      button.enabled(sys.ObjUtil.coerce(this.enabled(), sys.Bool.type$.toNullable()));
    }
    ;
    this.buttons(this.buttons().add(button));
    return this;
  }

  onBeforeSelect(f) {
    this.#cbBeforeSelect = f;
    return;
  }

  onSelect(f) {
    this.#cbSelect = f;
    return;
  }

  select(button) {
    const this$ = this;
    this.selIndex(this.buttons().findIndex((b) => {
      return b === button;
    }));
    return;
  }

  update() {
    const this$ = this;
    this.buttons().each((b,i) => {
      if (sys.ObjUtil.is(b, ToggleButton.type$)) {
        let t = sys.ObjUtil.coerce(b, ToggleButton.type$);
        t.group(this$);
        t.selected(sys.ObjUtil.equals(i, this$.selIndex()));
        return;
      }
      ;
      if (sys.ObjUtil.is(b, RadioButton.type$)) {
        let r = sys.ObjUtil.coerce(b, RadioButton.type$);
        r.group(this$);
        r.checked(sys.ObjUtil.equals(i, this$.selIndex()));
        return;
      }
      ;
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Invalid button for group '", sys.ObjUtil.typeof(b)), "'"));
    });
    return;
  }

  static make() {
    const $self = new ButtonGroup();
    ButtonGroup.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class FlowBox extends Box {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#halign = Align.left();
    this.#gaps = sys.List.make(sys.Str.type$);
    return;
  }

  typeof() { return FlowBox.type$; }

  #halign = null;

  halign(it) {
    if (it === undefined) {
      return this.#halign;
    }
    else {
      this.#halign = it;
      this.style().trap("textAlign", sys.List.make(sys.Obj.type$.toNullable(), [it.toStr()]));
      return;
    }
  }

  #gaps = null;

  gaps(it) {
    if (it === undefined) {
      return this.#gaps;
    }
    else {
      this.#gaps = it;
      this.applyStyle();
      return;
    }
  }

  static make() {
    const $self = new FlowBox();
    FlowBox.make$($self);
    return $self;
  }

  static make$($self) {
    Box.make$($self);
    ;
    $self.style().addClass("domkit-FlowBox");
    return;
  }

  onAdd(c) {
    this.applyStyle();
    return;
  }

  onRemove(c) {
    this.applyStyle();
    return;
  }

  applyStyle() {
    const this$ = this;
    let kids = this.children();
    let text = kids.any((kid) => {
      return sys.ObjUtil.is(kid, TextField.type$);
    });
    let lastGap = null;
    kids.each((kid,i) => {
      let gap = sys.Float.make(0.0);
      if (sys.ObjUtil.compareGT(this$.gaps().size(), 0)) {
        let s = this$.gaps().get(sys.Int.mod(i, this$.gaps().size()));
        (gap = sys.Num.toFloat(dom.CssDim.fromStr(s).val()));
        if ((sys.ObjUtil.compareGT(gap, sys.Float.make(0.0)) && sys.ObjUtil.compareLT(i, sys.Int.minus(kids.size(), 1)))) {
          kid.style().set("margin-right", s);
        }
        ;
      }
      ;
      if (sys.ObjUtil.equals(kid.style().effective("width"), "100%")) {
        kid.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), ["auto"]));
      }
      ;
      if ((sys.ObjUtil.compareGT(kids.size(), 1) && (sys.ObjUtil.equals(gap, sys.Float.make(-1.0)) || sys.ObjUtil.equals(lastGap, sys.Float.make(-1.0))))) {
        if ((sys.ObjUtil.equals(i, 0) || sys.ObjUtil.compareGE(lastGap, sys.Float.make(0.0)))) {
          kid.style().addClass("group-left");
        }
        else {
          if ((sys.ObjUtil.compareLT(i, sys.Int.minus(kids.size(), 1)) && sys.ObjUtil.equals(gap, sys.Float.make(-1.0)))) {
            kid.style().removeClass("group-right").addClass("group-middle");
          }
          else {
            kid.style().addClass("group-right");
          }
          ;
        }
        ;
      }
      ;
      (lastGap = sys.ObjUtil.coerce(gap, sys.Float.type$.toNullable()));
      return;
    });
    return;
  }

}

class Combo extends dom.Elem {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
  }

  typeof() { return Combo.type$; }

  #field = null;

  field() {
    return this.#field;
  }

  #items = null;

  items(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.#button.items(), sys.Type.find("sys::Str[]"));
    }
    else {
      this.#button.items(it);
      return;
    }
  }

  #enabled = null;

  enabled(it) {
    if (it === undefined) {
      return this.#field.enabled();
    }
    else {
      this.#field.enabled(((this$) => { let $_u126 = it; this$.#button.enabled($_u126); return $_u126; })(this));
      return;
    }
  }

  #button = null;

  // private field reflection only
  __button(it) { if (it === undefined) return this.#button; else this.#button = it; }

  static make() {
    const $self = new Combo();
    Combo.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    dom.Elem.make$($self, "div");
    $self.#field = sys.ObjUtil.coerce(sys.ObjUtil.with(TextField.make(), (it) => {
      it.onEvent("keydown", false, (e) => {
        if (sys.ObjUtil.equals(e.key(), dom.Key.down())) {
          e.stop();
          this$.#button.openPopup();
        }
        ;
        return;
      });
      return;
    }), TextField.type$);
    $self.#button = sys.ObjUtil.coerce(sys.ObjUtil.with(ListButton.make(), (it) => {
      it.isCombo(true);
      it.onSelect((it) => {
        this$.#field.val(sys.ObjUtil.coerce(this$.#button.sel().item(), sys.Str.type$));
        this$.#field.focus();
        this$.#field.fireModify(null);
        return;
      });
      return;
    }), ListButton.type$);
    $self.style().addClass("domkit-Combo");
    $self.add($self.#field);
    $self.add($self.#button);
    return;
  }

  onElem(f) {
    this.#button.onElem(f);
    return;
  }

  update(val) {
    const this$ = this;
    this.#button.sel().index(((this$) => { let $_u127 = this$.items().findIndex((i) => {
      return sys.ObjUtil.equals(i, val);
    }); if ($_u127 != null) return $_u127; return sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()); })(this));
    return;
  }

}

class GridBox extends Box {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#halign = Align.left();
    this.#init = true;
    this.#cstyleMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    return;
  }

  typeof() { return GridBox.type$; }

  #halign = null;

  halign(it) {
    if (it === undefined) {
      return this.#halign;
    }
    else {
      let $_u128 = ((this$) => { let $_u129 = it; this$.#halign = $_u129; return $_u129; })(this);
      if (sys.ObjUtil.equals($_u128, Align.left())) {
        this.#table.style().trap("margin", sys.List.make(sys.Obj.type$.toNullable(), [null]));
      }
      else if (sys.ObjUtil.equals($_u128, Align.center())) {
        this.#table.style().trap("margin", sys.List.make(sys.Obj.type$.toNullable(), ["0 auto"]));
      }
      else if (sys.ObjUtil.equals($_u128, Align.right())) {
        this.#table.style().trap("margin", sys.List.make(sys.Obj.type$.toNullable(), ["0 0 0 auto"]));
      }
      else if (sys.ObjUtil.equals($_u128, Align.fill())) {
        this.#table.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), ["100%"]));
      }
      ;
      return;
    }
  }

  #table = null;

  // private field reflection only
  __table(it) { if (it === undefined) return this.#table; else this.#table = it; }

  #tbody = null;

  // private field reflection only
  __tbody(it) { if (it === undefined) return this.#tbody; else this.#tbody = it; }

  #init = false;

  // private field reflection only
  __init(it) { if (it === undefined) return this.#init; else this.#init = it; }

  #cstyleMap = null;

  // private field reflection only
  __cstyleMap(it) { if (it === undefined) return this.#cstyleMap; else this.#cstyleMap = it; }

  static make() {
    const $self = new GridBox();
    GridBox.make$($self);
    return $self;
  }

  static make$($self) {
    Box.make$($self);
    ;
    $self.#table = dom.Elem.make("table");
    $self.#tbody = dom.Elem.make("tbody");
    $self.#table.add($self.#tbody);
    $self.style().addClass("domkit-GridBox");
    $self.add($self.#table);
    return;
  }

  cellStyle(col,row,style) {
    const this$ = this;
    if ((sys.ObjUtil.is(col, sys.Range.type$) && sys.ObjUtil.is(row, sys.Range.type$))) {
      sys.ObjUtil.coerce(row, sys.Range.type$).each((r) => {
        sys.ObjUtil.coerce(col, sys.Range.type$).each((c) => {
          this$.#cstyleMap.set(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable())), ":"), sys.ObjUtil.coerce(r, sys.Obj.type$.toNullable())), style);
          return;
        });
        return;
      });
    }
    else {
      if (sys.ObjUtil.is(col, sys.Range.type$)) {
        sys.ObjUtil.coerce(col, sys.Range.type$).each((c) => {
          this$.#cstyleMap.set(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable())), ":"), row), style);
          return;
        });
      }
      else {
        if (sys.ObjUtil.is(row, sys.Range.type$)) {
          sys.ObjUtil.coerce(row, sys.Range.type$).each((r) => {
            this$.#cstyleMap.set(sys.Str.plus(sys.Str.plus(sys.Str.plus("", col), ":"), sys.ObjUtil.coerce(r, sys.Obj.type$.toNullable())), style);
            return;
          });
        }
        else {
          this.#cstyleMap.set(sys.Str.plus(sys.Str.plus(sys.Str.plus("", col), ":"), row), style);
        }
        ;
      }
      ;
    }
    ;
    if (!this.#init) {
      this.updateCellStyle();
    }
    ;
    return this;
  }

  numRows() {
    return this.#tbody.children().size();
  }

  addRow(cells,colspan) {
    if (colspan === undefined) colspan = sys.ObjUtil.coerce(sys.Int.type$.emptyList(), sys.Type.find("sys::Int[]"));
    return this._addRow(null, cells, colspan);
  }

  insertRowBefore(index,cells,colspan) {
    if (colspan === undefined) colspan = sys.ObjUtil.coerce(sys.Int.type$.emptyList(), sys.Type.find("sys::Int[]"));
    return this._addRow(sys.ObjUtil.coerce(index, sys.Int.type$.toNullable()), cells, colspan);
  }

  _addRow(at,cells,colspan) {
    if (colspan === undefined) colspan = sys.ObjUtil.coerce(sys.Int.type$.emptyList(), sys.Type.find("sys::Int[]"));
    const this$ = this;
    let r = this.#tbody.children().size();
    let cx = 0;
    let tr = dom.Elem.make("tr");
    cells.each((elem,c) => {
      let td = dom.Elem.make("td");
      let cs = colspan.getSafe(c);
      if (cs != null) {
        td.set("colspan", sys.Int.toStr(sys.ObjUtil.coerce(cs, sys.Int.type$)));
      }
      ;
      this$.applyCellStyle(sys.Int.plus(c, cx), r, td);
      if (elem != null) {
        td.add(sys.ObjUtil.coerce(elem, dom.Elem.type$));
      }
      ;
      cx = sys.Int.plus(cx, ((this$) => { if (cs == null) return 0; return sys.Int.minus(sys.ObjUtil.coerce(cs, sys.Int.type$), 1); })(this$));
      tr.add(td);
      return;
    });
    if (at == null) {
      this.#tbody.add(tr);
    }
    else {
      this.#tbody.insertBefore(tr, this.#tbody.children().get(sys.ObjUtil.coerce(at, sys.Int.type$)));
    }
    ;
    this.#init = false;
    return this;
  }

  rowIndexOf(child) {
    const this$ = this;
    return this.#tbody.children().findIndex((row) => {
      return row.containsChild(child);
    });
  }

  removeRow(index) {
    let row = this.#tbody.children().getSafe(index);
    if (row != null) {
      this.#tbody.removeChild(sys.ObjUtil.coerce(row, dom.Elem.type$));
    }
    ;
    return this;
  }

  removeAllRows() {
    this.#tbody.removeAll();
    return this;
  }

  updateCellStyle() {
    const this$ = this;
    this.#tbody.children().each((tr,r) => {
      tr.children().each((td,c) => {
        this$.applyCellStyle(c, r, td);
        return;
      });
      return;
    });
    return;
  }

  applyCellStyle(c,r,td) {
    this.setCellStyle("*:*", td);
    let calt = ((this$) => { if (sys.Int.isOdd(c)) return "odd"; return "even"; })(this);
    let ralt = ((this$) => { if (sys.Int.isOdd(r)) return "odd"; return "even"; })(this);
    this.setCellStyle(sys.Str.plus("*:", ralt), td);
    this.setCellStyle(sys.Str.plus(sys.Str.plus("", calt), ":*"), td);
    this.setCellStyle(sys.Str.plus(sys.Str.plus(sys.Str.plus("", calt), ":"), ralt), td);
    this.setCellStyle(sys.Str.plus("*:", sys.ObjUtil.coerce(r, sys.Obj.type$.toNullable())), td);
    this.setCellStyle(sys.Str.plus(sys.Str.plus(sys.Str.plus("", calt), ":"), sys.ObjUtil.coerce(r, sys.Obj.type$.toNullable())), td);
    this.setCellStyle(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable())), ":*"), td);
    this.setCellStyle(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable())), ":"), ralt), td);
    this.setCellStyle(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable())), ":"), sys.ObjUtil.coerce(r, sys.Obj.type$.toNullable())), td);
    return;
  }

  setCellStyle(key,td) {
    let s = this.#cstyleMap.get(key);
    if (s != null) {
      td.style().setCss(sys.ObjUtil.coerce(s, sys.Str.type$));
    }
    ;
    return;
  }

}

class FlipBox extends Box {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
  }

  typeof() { return FlipBox.type$; }

  #front = null;

  front(it) {
    if (it === undefined) {
      return this.#card.children().getSafe(0);
    }
    else {
      this.#card.add(sys.ObjUtil.coerce(it, dom.Elem.type$));
      it.style().addClass("domkit-FlipBox-front");
      return;
    }
  }

  #back = null;

  back(it) {
    if (it === undefined) {
      return this.#card.children().getSafe(1);
    }
    else {
      this.#card.add(sys.ObjUtil.coerce(it, dom.Elem.type$));
      it.style().addClass("domkit-FlipBox-back");
      return;
    }
  }

  #card = null;

  // private field reflection only
  __card(it) { if (it === undefined) return this.#card; else this.#card = it; }

  static make() {
    const $self = new FlipBox();
    FlipBox.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    Box.make$($self);
    $self.style().addClass("domkit-FlipBox");
    $self.add(((this$) => { let $_u133 = sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
      it.style().addClass("domkit-FlipBox-card");
      return;
    }), dom.Elem.type$); this$.#card = $_u133; return $_u133; })($self));
    return;
  }

  flip(onComplete) {
    if (onComplete === undefined) onComplete = null;
    const this$ = this;
    this.#card.style().toggleClass("flip");
    if (onComplete != null) {
      dom.Win.cur().setTimeout(sys.Duration.fromStr("500ms"), () => {
        sys.Func.call(onComplete, this$);
        return;
      });
    }
    ;
    return;
  }

  isFront() {
    return !this.isBack();
  }

  isBack() {
    return this.#card.style().hasClass("flip");
  }

  toFront() {
    if (this.isBack()) {
      this.flip();
    }
    ;
    return this;
  }

  toBack() {
    if (this.isFront()) {
      this.flip();
    }
    ;
    return this;
  }

}

class Sheet extends Box {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#canDismiss = false;
    this.#delay = null;
    return;
  }

  typeof() { return Sheet.type$; }

  #canDismiss = false;

  canDismiss(it) {
    if (it === undefined) {
      return this.#canDismiss;
    }
    else {
      this.#canDismiss = it;
      return;
    }
  }

  #isOpen = false;

  isOpen() {
    return this.#isOpen;
  }

  #delay = null;

  delay(it) {
    if (it === undefined) {
      return this.#delay;
    }
    else {
      this.#delay = it;
      return;
    }
  }

  #uid = 0;

  // private field reflection only
  __uid(it) { if (it === undefined) return this.#uid; else this.#uid = it; }

  static #nextId = undefined;

  static nextId() {
    if (Sheet.#nextId === undefined) {
      Sheet.static$init();
      if (Sheet.#nextId === undefined) Sheet.#nextId = null;
    }
    return Sheet.#nextId;
  }

  #cbOpen = null;

  // private field reflection only
  __cbOpen(it) { if (it === undefined) return this.#cbOpen; else this.#cbOpen = it; }

  #cbClose = null;

  // private field reflection only
  __cbClose(it) { if (it === undefined) return this.#cbClose; else this.#cbClose = it; }

  #cbKeyDown = null;

  // private field reflection only
  __cbKeyDown(it) { if (it === undefined) return this.#cbKeyDown; else this.#cbKeyDown = it; }

  static make() {
    const $self = new Sheet();
    Sheet.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    Box.make$($self);
    ;
    $self.#uid = sys.ObjUtil.coerce(Sheet.nextId().val(), sys.Int.type$);
    Sheet.nextId().val(sys.ObjUtil.coerce(sys.Int.plus($self.#uid, 1), sys.Obj.type$.toNullable()));
    $self.trap("tabIndex", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]));
    $self.style().addClass("domkit-Sheet");
    $self.onEvent("mousedown", false, (e) => {
      e.stop();
      if (this$.#canDismiss) {
        this$.close();
      }
      ;
      return;
    });
    return;
  }

  onBeforeOpen() {
    return;
  }

  onKeyDown(f) {
    this.#cbKeyDown = f;
    return;
  }

  open(parent,height) {
    const this$ = this;
    if (this.#isOpen) {
      return this;
    }
    ;
    let ppos = parent.pagePos();
    this.style().setAll(sys.Map.__fromLiteral(["left","top","width","height"], [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(ppos.x(), sys.Obj.type$.toNullable())), "px"),sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(ppos.y(), sys.Obj.type$.toNullable())), "px"),sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(parent.size().w(), sys.Obj.type$.toNullable())), "px"),"0px"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    let body = dom.Win.cur().doc().body();
    body.add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make(), (it) => {
      it.id(sys.Str.plus("domkitSheet-mask-", sys.ObjUtil.coerce(this$.#uid, sys.Obj.type$.toNullable())));
      it.style().addClass("domkit-Sheet-mask");
      if (this$.#canDismiss) {
        it.onEvent("keydown", false, (e) => {
          e.stop();
          this$.close();
          return;
        });
        it.onEvent("mousedown", false, (e) => {
          e.stop();
          this$.close();
          return;
        });
      }
      else {
        it.onEvent("keydown", false, (e) => {
          ((this$) => { let $_u134 = this$.#cbKeyDown; if ($_u134 == null) return null; return sys.Func.call(this$.#cbKeyDown, e); })(this$);
          return;
        });
      }
      ;
      it.add(this$);
      return;
    }), dom.Elem.type$));
    this.onBeforeOpen();
    let opts = ((this$) => { if (this$.#delay == null) return null; return sys.Map.__fromLiteral(["transition-delay"], [this$.#delay], sys.Type.find("sys::Str"), sys.Type.find("sys::Duration?")); })(this);
    this.transition(sys.Map.__fromLiteral(["height"], [height], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), opts, sys.Duration.fromStr("250ms"), (it) => {
      this$.focus();
      this$.fireOpen(null);
      return;
    });
    return this;
  }

  close(f) {
    if (f === undefined) f = null;
    const this$ = this;
    if (f != null) {
      this.#cbClose = f;
    }
    ;
    this.transition(sys.Map.__fromLiteral(["height"], ["0"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), null, sys.Duration.fromStr("250ms"), (it) => {
      let mask = dom.Win.cur().doc().elemById(sys.Str.plus("domkitSheet-mask-", sys.ObjUtil.coerce(this$.#uid, sys.Obj.type$.toNullable())));
      let parent = ((this$) => { let $_u136 = mask; if ($_u136 == null) return null; return mask.parent(); })(this$);
      if (parent != null) {
        parent.remove(sys.ObjUtil.coerce(mask, dom.Elem.type$));
        ((this$) => { let $_u137 = parent.querySelector("input"); if ($_u137 == null) return null; return parent.querySelector("input").focus(); })(this$);
      }
      ;
      this$.fireClose(null);
      return;
    });
    return;
  }

  onOpen(f) {
    this.#cbOpen = f;
    return;
  }

  onClose(f) {
    this.#cbClose = f;
    return;
  }

  fireOpen(e) {
    ((this$) => { let $_u138 = this$.#cbOpen; if ($_u138 == null) return null; return sys.Func.call(this$.#cbOpen, this$); })(this);
    this.#isOpen = true;
    return;
  }

  fireClose(e) {
    ((this$) => { let $_u139 = this$.#cbClose; if ($_u139 == null) return null; return sys.Func.call(this$.#cbClose, this$); })(this);
    this.#isOpen = false;
    return;
  }

  static static$init() {
    Sheet.#nextId = concurrent.AtomicRef.make(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    return;
  }

}

class CardBox extends Box {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#effect = null;
    this.#effectDur = sys.Duration.fromStr("350ms");
    return;
  }

  typeof() { return CardBox.type$; }

  #selIndex = null;

  selIndex(it) {
    if (it === undefined) {
      return this.#selIndex;
    }
    else {
      let old = this.#selIndex;
      this.#selIndex = sys.ObjUtil.coerce(sys.Int.min(sys.Int.max(sys.ObjUtil.coerce(it, sys.Int.type$), 0), this.children().size()), sys.Int.type$.toNullable());
      if (sys.ObjUtil.compareNE(old, this.#selIndex)) {
        this.updateStyle();
      }
      ;
      return;
    }
  }

  #effect = null;

  effect(it) {
    if (it === undefined) {
      return this.#effect;
    }
    else {
      this.#effect = it;
      return;
    }
  }

  #effectDur = null;

  effectDur(it) {
    if (it === undefined) {
      return this.#effectDur;
    }
    else {
      this.#effectDur = it;
      return;
    }
  }

  static make() {
    const $self = new CardBox();
    CardBox.make$($self);
    return $self;
  }

  static make$($self) {
    Box.make$($self);
    ;
    $self.style().addClass("domkit-CardBox");
    return;
  }

  selItem() {
    return ((this$) => { if (this$.selIndex() == null) return null; return this$.children().get(sys.ObjUtil.coerce(this$.selIndex(), sys.Int.type$)); })(this);
  }

  onAdd(c) {
    this.updateStyle();
    return;
  }

  onRemove(c) {
    this.updateStyle();
    return;
  }

  updateStyle() {
    const this$ = this;
    let kids = this.children();
    if ((sys.ObjUtil.compareGT(kids.size(), 0) && this.selIndex() == null)) {
      this.selIndex(sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()));
    }
    ;
    let fx = this.#effect;
    let cur = kids.find((k) => {
      return sys.ObjUtil.equals(k.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), [])), "block");
    });
    let next = ((this$) => { if (fx == null) return null; return this$.children().get(sys.ObjUtil.coerce(this$.selIndex(), sys.Int.type$)); })(this);
    let size = ((this$) => { if (fx == null) return null; return this$.size(); })(this);
    if (cur == null) {
      (cur = next);
    }
    ;
    if (cur === next) {
      (fx = null);
      (next = null);
    }
    ;
    let curIndex = kids.findIndex((k) => {
      return sys.ObjUtil.equals(k, cur);
    });
    if ((fx != null && !dom.Win.cur().doc().body().containsChild(this))) {
      (fx = null);
      (next = null);
    }
    ;
    let $_u143 = fx;
    if (sys.ObjUtil.equals($_u143, "slideLeft")) {
      let cy = ((this$) => { if (sys.ObjUtil.compareGT(curIndex, this$.selIndex())) return sys.Str.plus(sys.Str.plus("-", sys.ObjUtil.coerce(size.h(), sys.Obj.type$.toNullable())), "px"); return "0px"; })(this);
      let ny = ((this$) => { if (sys.ObjUtil.compareLT(curIndex, this$.selIndex())) return sys.Str.plus(sys.Str.plus("-", sys.ObjUtil.coerce(size.h(), sys.Obj.type$.toNullable())), "px"); return "0px"; })(this);
      cur.style().trap("transform", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("translateX(0) translateY(", cy), ")")]));
      next.style().trap("transform", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("translateX(", sys.ObjUtil.coerce(size.w(), sys.Obj.type$.toNullable())), "px) translateY("), ny), ")")]));
      next.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), ["block"]));
      cur.transition(sys.Map.__fromLiteral(["transform","opacity"], [sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("translateX(-", sys.ObjUtil.coerce(size.w(), sys.Obj.type$.toNullable())), "px) translateY("), cy), ")"),"0"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), null, this.#effectDur);
      next.transition(sys.Map.__fromLiteral(["transform"], [sys.Str.plus(sys.Str.plus("translateX(0px) translateY(", ny), ")")], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), null, this.#effectDur, (it) => {
        this$.updateDis();
        return;
      });
    }
    else if (sys.ObjUtil.equals($_u143, "slideRight")) {
      let cy = ((this$) => { if (sys.ObjUtil.compareGT(curIndex, this$.selIndex())) return sys.Str.plus(sys.Str.plus("-", sys.ObjUtil.coerce(size.h(), sys.Obj.type$.toNullable())), "px"); return "0px"; })(this);
      let ny = ((this$) => { if (sys.ObjUtil.compareLT(curIndex, this$.selIndex())) return sys.Str.plus(sys.Str.plus("-", sys.ObjUtil.coerce(size.h(), sys.Obj.type$.toNullable())), "px"); return "0px"; })(this);
      cur.style().trap("transform", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("translateX(0) translateY(", cy), ")")]));
      next.style().trap("transform", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("translateX(-", sys.ObjUtil.coerce(size.w(), sys.Obj.type$.toNullable())), "px) translateY("), ny), ")")]));
      next.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), ["block"]));
      cur.transition(sys.Map.__fromLiteral(["transform","opacity"], [sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("translateX(", sys.ObjUtil.coerce(size.w(), sys.Obj.type$.toNullable())), "px) translateY("), cy), ")"),"0"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), null, this.#effectDur);
      next.transition(sys.Map.__fromLiteral(["transform"], [sys.Str.plus(sys.Str.plus("translateX(0px) translateY(", ny), ")")], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), null, this.#effectDur, (it) => {
        this$.updateDis();
        return;
      });
    }
    else {
      this.updateDis();
    }
    ;
    return;
  }

  updateDis() {
    const this$ = this;
    this.children().each((kid,i) => {
      kid.style().trap("display", sys.List.make(sys.Obj.type$.toNullable(), [((this$) => { if (sys.ObjUtil.equals(i, this$.selIndex())) return "block"; return "none"; })(this$)]));
      kid.style().trap("opacity", sys.List.make(sys.Obj.type$.toNullable(), ["1.0"]));
      kid.transition(sys.Map.__fromLiteral(["transform"], ["translateX(0) translateY(0)"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), null, sys.Duration.fromStr("0ns"));
      return;
    });
    return;
  }

}

class ProgressBar extends dom.Elem {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#min = 0;
    this.#max = 100;
    this.#val = 0;
    return;
  }

  typeof() { return ProgressBar.type$; }

  #min = 0;

  min(it) {
    if (it === undefined) {
      return this.#min;
    }
    else {
      this.#min = it;
      this.update();
      return;
    }
  }

  #max = 0;

  max(it) {
    if (it === undefined) {
      return this.#max;
    }
    else {
      this.#max = it;
      this.update();
      return;
    }
  }

  #val = 0;

  val(it) {
    if (it === undefined) {
      return this.#val;
    }
    else {
      this.#val = sys.Int.min(sys.Int.max(it, this.min()), this.max());
      this.update();
      return;
    }
  }

  #cbText = null;

  // private field reflection only
  __cbText(it) { if (it === undefined) return this.#cbText; else this.#cbText = it; }

  #cbBarColor = null;

  // private field reflection only
  __cbBarColor(it) { if (it === undefined) return this.#cbBarColor; else this.#cbBarColor = it; }

  static make(f) {
    const $self = new ProgressBar();
    ProgressBar.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    dom.Elem.make$($self, "div");
    ;
    $self.style().addClass("domkit-control domkit-control-button domkit-ProgressBar");
    if (f != null) {
      sys.Func.call(f, $self);
    }
    ;
    $self.update();
    return;
  }

  onText(f) {
    this.#cbText = f;
    return;
  }

  onBarColor(f) {
    this.#cbBarColor = f;
    return;
  }

  update() {
    this.text(sys.ObjUtil.coerce(((this$) => { if (this$.#cbText == null) return ""; return sys.Func.call(this$.#cbText, this$); })(this), sys.Str.type$));
    let color = ((this$) => { if (this$.#cbBarColor == null) return "#3498db"; return sys.Func.call(this$.#cbBarColor, this$); })(this);
    let offset = sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.mult(sys.Float.div(sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.minus(this.val(), this.min()), sys.Num.type$)), sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.minus(this.max(), this.min()), sys.Num.type$))), sys.Float.make(100.0)), sys.Num.type$));
    this.style().trap("background", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("linear-gradient(left, ", color), " "), sys.ObjUtil.coerce(offset, sys.Obj.type$.toNullable())), "%, "), color), " "), sys.ObjUtil.coerce(offset, sys.Obj.type$.toNullable())), "%, #fff "), sys.ObjUtil.coerce(offset, sys.Obj.type$.toNullable())), "%)")]));
    return;
  }

}

class Tooltip extends dom.Elem {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#delay = sys.Duration.fromStr("750ms");
    this.#inNode = false;
    this.#inTooltip = false;
    return;
  }

  typeof() { return Tooltip.type$; }

  #delay = null;

  delay(it) {
    if (it === undefined) {
      return this.#delay;
    }
    else {
      this.#delay = it;
      return;
    }
  }

  static #gutter = undefined;

  static gutter() {
    if (Tooltip.#gutter === undefined) {
      Tooltip.static$init();
      if (Tooltip.#gutter === undefined) Tooltip.#gutter = 0;
    }
    return Tooltip.#gutter;
  }

  #node = null;

  // private field reflection only
  __node(it) { if (it === undefined) return this.#node; else this.#node = it; }

  #timerId = null;

  // private field reflection only
  __timerId(it) { if (it === undefined) return this.#timerId; else this.#timerId = it; }

  #inNode = false;

  // private field reflection only
  __inNode(it) { if (it === undefined) return this.#inNode; else this.#inNode = it; }

  #inTooltip = false;

  // private field reflection only
  __inTooltip(it) { if (it === undefined) return this.#inTooltip; else this.#inTooltip = it; }

  static make() {
    const $self = new Tooltip();
    Tooltip.make$($self);
    return $self;
  }

  static make$($self) {
    dom.Elem.make$($self);
    ;
    $self.style().addClass("domkit-Popup");
    $self.style().trap("zIndex", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(2000, sys.Obj.type$.toNullable())]));
    return;
  }

  bind(node) {
    const this$ = this;
    if (this.#node != null) {
      throw sys.ArgErr.make(sys.Str.plus("Tooltip already bound to ", this.#node));
    }
    ;
    this.#node = node;
    node.onEvent("mouseenter", false, (it) => {
      this$.#inNode = true;
      this$.check();
      return;
    });
    node.onEvent("mouseleave", false, (it) => {
      this$.#inNode = false;
      this$.check();
      return;
    });
    return;
  }

  check() {
    const this$ = this;
    if (this.#inNode) {
      if (this.#delay == null) {
        if (this.isOpen()) {
          return;
        }
        ;
        this.open();
      }
      else {
        if (this.isOpen()) {
          return;
        }
        ;
        if (this.#timerId != null) {
          return;
        }
        ;
        this.#timerId = sys.ObjUtil.coerce(dom.Win.cur().setTimeout(sys.ObjUtil.coerce(this.#delay, sys.Duration.type$), (it) => {
          this$.open();
          return;
        }), sys.Int.type$.toNullable());
      }
      ;
    }
    else {
      if (this.isOpen()) {
        this.close();
        return;
      }
      ;
      if (this.#timerId != null) {
        dom.Win.cur().clearTimeout(sys.ObjUtil.coerce(this.#timerId, sys.Int.type$));
        this.#timerId = null;
      }
      ;
    }
    ;
    return;
  }

  isOpen() {
    return this.parent() != null;
  }

  open() {
    this.#timerId = null;
    let x = this.#node.pagePos().x();
    let y = sys.Float.plusInt(sys.Float.plus(this.#node.pagePos().y(), this.#node.size().h()), 1);
    this.style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(x, sys.Obj.type$.toNullable())), "px")]));
    this.style().trap("top", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(y, sys.Obj.type$.toNullable())), "px")]));
    this.style().trap("opacity", sys.List.make(sys.Obj.type$.toNullable(), ["0"]));
    dom.Win.cur().doc().body().add(this);
    let sz = this.size();
    let vp = dom.Win.cur().viewport();
    if (sys.ObjUtil.compareGT(sys.Float.plusInt(sys.Float.plusInt(sz.w(), Tooltip.gutter()), Tooltip.gutter()), vp.w())) {
      this.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Float.minusInt(sys.Float.minusInt(vp.w(), Tooltip.gutter()), Tooltip.gutter()), sys.Obj.type$.toNullable())), "px")]));
    }
    ;
    if (sys.ObjUtil.compareGT(sys.Float.plusInt(sys.Float.plusInt(sz.h(), Tooltip.gutter()), Tooltip.gutter()), vp.h())) {
      this.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Float.minusInt(sys.Float.minusInt(vp.h(), Tooltip.gutter()), Tooltip.gutter()), sys.Obj.type$.toNullable())), "px")]));
    }
    ;
    (sz = this.size());
    if (sys.ObjUtil.compareGT(sys.Float.plusInt(sys.Float.plus(x, sz.w()), Tooltip.gutter()), vp.w())) {
      this.style().trap("left", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Float.minusInt(sys.Float.minus(vp.w(), sz.w()), Tooltip.gutter()), sys.Obj.type$.toNullable())), "px")]));
    }
    ;
    if (sys.ObjUtil.compareGT(sys.Float.plusInt(sys.Float.plus(y, sz.h()), Tooltip.gutter()), vp.h())) {
      this.style().trap("top", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Float.minusInt(sys.Float.minus(vp.h(), sz.h()), Tooltip.gutter()), sys.Obj.type$.toNullable())), "px")]));
    }
    ;
    this.transition(sys.Map.__fromLiteral(["opacity"], ["1"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), null, sys.Duration.fromStr("100ms"));
    return;
  }

  close() {
    const this$ = this;
    this.transition(sys.Map.__fromLiteral(["opacity"], ["0"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), null, sys.Duration.fromStr("100ms"), (it) => {
      ((this$) => { let $_u151 = this$.parent(); if ($_u151 == null) return null; return this$.parent().remove(this$); })(this$);
      return;
    });
    return;
  }

  static static$init() {
    Tooltip.#gutter = 12;
    return;
  }

}

class Align extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Align.type$; }

  static top() { return Align.vals().get(0); }

  static left() { return Align.vals().get(1); }

  static bottom() { return Align.vals().get(2); }

  static right() { return Align.vals().get(3); }

  static center() { return Align.vals().get(4); }

  static fill() { return Align.vals().get(5); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new Align();
    Align.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(Align.type$, Align.vals(), name$, checked);
  }

  static vals() {
    if (Align.#vals == null) {
      Align.#vals = sys.List.make(Align.type$, [
        Align.make(0, "top", ),
        Align.make(1, "left", ),
        Align.make(2, "bottom", ),
        Align.make(3, "right", ),
        Align.make(4, "center", ),
        Align.make(5, "fill", ),
      ]).toImmutable();
    }
    return Align.#vals;
  }

  static static$init() {
    const $_u152 = Align.vals();
    if (true) {
    }
    ;
    return;
  }

}

class Dir extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Dir.type$; }

  static up() { return Dir.vals().get(0); }

  static down() { return Dir.vals().get(1); }

  static left() { return Dir.vals().get(2); }

  static right() { return Dir.vals().get(3); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new Dir();
    Dir.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(Dir.type$, Dir.vals(), name$, checked);
  }

  static vals() {
    if (Dir.#vals == null) {
      Dir.#vals = sys.List.make(Dir.type$, [
        Dir.make(0, "up", ),
        Dir.make(1, "down", ),
        Dir.make(2, "left", ),
        Dir.make(3, "right", ),
      ]).toImmutable();
    }
    return Dir.#vals;
  }

  static static$init() {
    const $_u153 = Dir.vals();
    if (true) {
    }
    ;
    return;
  }

}

class Label extends dom.Elem {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
  }

  typeof() { return Label.type$; }

  static make() {
    const $self = new Label();
    Label.make$($self);
    return $self;
  }

  static make$($self) {
    dom.Elem.make$($self, "span");
    $self.style().addClass("domkit-control domkit-Label");
    return;
  }

}

const p = sys.Pod.add$('domkit');
const xp = sys.Param.noParams$();
let m;
Button.type$ = p.at$('Button','dom::Elem',[],{'sys::Js':""},8192,Button);
ToggleButton.type$ = p.at$('ToggleButton','domkit::Button',[],{'sys::Js':""},8192,ToggleButton);
Box.type$ = p.at$('Box','dom::Elem',[],{'sys::Js':""},8192,Box);
SashBox.type$ = p.at$('SashBox','domkit::Box',[],{'sys::Js':""},8192,SashBox);
TextField.type$ = p.at$('TextField','dom::Elem',[],{'sys::Js':""},8192,TextField);
RadioButton.type$ = p.at$('RadioButton','dom::Elem',[],{'sys::Js':""},8192,RadioButton);
ListButton.type$ = p.at$('ListButton','domkit::Button',[],{'sys::Js':""},8192,ListButton);
Selection.type$ = p.at$('Selection','sys::Obj',[],{'sys::Js':""},8193,Selection);
IndexSelection.type$ = p.at$('IndexSelection','domkit::Selection',[],{'sys::NoDoc':"",'sys::Js':""},8193,IndexSelection);
ListButtonSelection.type$ = p.at$('ListButtonSelection','domkit::IndexSelection',[],{'sys::Js':""},128,ListButtonSelection);
TreeNode.type$ = p.at$('TreeNode','sys::Obj',[],{'sys::Js':""},8193,TreeNode);
TreeFlags.type$ = p.at$('TreeFlags','sys::Obj',[],{'sys::Js':""},8194,TreeFlags);
TreeEvent.type$ = p.at$('TreeEvent','sys::Obj',[],{'sys::Js':""},8192,TreeEvent);
Tree.type$ = p.at$('Tree','domkit::Box',[],{'sys::Js':""},8192,Tree);
TreeSelection.type$ = p.at$('TreeSelection','domkit::Selection',[],{'sys::Js':""},128,TreeSelection);
Dialog.type$ = p.at$('Dialog','domkit::Box',[],{'sys::Js':""},8192,Dialog);
Popup.type$ = p.at$('Popup','dom::Elem',[],{'sys::Js':""},8192,Popup);
Menu.type$ = p.at$('Menu','domkit::Popup',[],{'sys::Js':""},8192,Menu);
MenuItem.type$ = p.at$('MenuItem','dom::Elem',[],{'sys::Js':""},8192,MenuItem);
FilePicker.type$ = p.at$('FilePicker','dom::Elem',[],{'sys::Js':""},8192,FilePicker);
FlexBox.type$ = p.at$('FlexBox','domkit::Box',[],{'sys::Js':""},8192,FlexBox);
Table.type$ = p.at$('Table','dom::Elem',[],{'sys::Js':""},8192,Table);
TablePos.type$ = p.at$('TablePos','sys::Obj',[],{'sys::Js':""},130,TablePos);
TableModel.type$ = p.at$('TableModel','sys::Obj',[],{'sys::Js':""},8192,TableModel);
TableFlags.type$ = p.at$('TableFlags','sys::Obj',[],{'sys::Js':""},8194,TableFlags);
TableEvent.type$ = p.at$('TableEvent','sys::Obj',[],{'sys::Js':""},8192,TableEvent);
TableSelection.type$ = p.at$('TableSelection','domkit::IndexSelection',[],{'sys::Js':""},128,TableSelection);
TableView.type$ = p.at$('TableView','domkit::TableModel',[],{'sys::NoDoc':"",'sys::Js':""},8192,TableView);
ScrollBox.type$ = p.at$('ScrollBox','domkit::Box',[],{'sys::Js':""},8192,ScrollBox);
WellBox.type$ = p.at$('WellBox','domkit::Box',[],{'sys::Js':""},8192,WellBox);
DomListener.type$ = p.at$('DomListener','sys::Obj',[],{'sys::Js':""},8192,DomListener);
DomState.type$ = p.at$('DomState','sys::Obj',[],{'sys::Js':""},128,DomState);
Checkbox.type$ = p.at$('Checkbox','dom::Elem',[],{'sys::Js':""},8192,Checkbox);
TextArea.type$ = p.at$('TextArea','dom::Elem',[],{'sys::Js':""},8192,TextArea);
AccordionBox.type$ = p.at$('AccordionBox','domkit::Box',[],{'sys::Js':""},8192,AccordionBox);
Link.type$ = p.at$('Link','dom::Elem',[],{'sys::Js':""},8192,Link);
DragTarget.type$ = p.at$('DragTarget','sys::Obj',[],{'sys::Js':""},8192,DragTarget);
DropTarget.type$ = p.at$('DropTarget','sys::Obj',[],{'sys::Js':""},8192,DropTarget);
DndUtil.type$ = p.at$('DndUtil','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8192,DndUtil);
ButtonGroup.type$ = p.at$('ButtonGroup','sys::Obj',[],{'sys::Js':""},8192,ButtonGroup);
FlowBox.type$ = p.at$('FlowBox','domkit::Box',[],{'sys::Js':""},8192,FlowBox);
Combo.type$ = p.at$('Combo','dom::Elem',[],{'sys::Js':""},8192,Combo);
GridBox.type$ = p.at$('GridBox','domkit::Box',[],{'sys::Js':""},8192,GridBox);
FlipBox.type$ = p.at$('FlipBox','domkit::Box',[],{'sys::Js':""},8192,FlipBox);
Sheet.type$ = p.at$('Sheet','domkit::Box',[],{'sys::NoDoc':"",'sys::Js':""},8192,Sheet);
CardBox.type$ = p.at$('CardBox','domkit::Box',[],{'sys::Js':""},8192,CardBox);
ProgressBar.type$ = p.at$('ProgressBar','dom::Elem',[],{'sys::Js':""},8192,ProgressBar);
Tooltip.type$ = p.at$('Tooltip','dom::Elem',[],{'sys::Js':""},8192,Tooltip);
Align.type$ = p.at$('Align','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,Align);
Dir.type$ = p.at$('Dir','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,Dir);
Label.type$ = p.at$('Label','dom::Elem',[],{'sys::Js':""},8192,Label);
Button.type$.af$('popupOffset',73728,'graphics::Point',{'sys::NoDoc':""}).af$('enabled',271360,'sys::Bool?',{}).af$('isCombo',65664,'sys::Bool',{}).af$('mouseDown',65664,'sys::Bool',{}).af$('_event',73728,'dom::Event?',{'sys::NoDoc':""}).af$('popup',67584,'domkit::Popup?',{}).af$('cbAction',67584,'sys::Func?',{}).af$('cbPopup',67584,'sys::Func?',{}).am$('make',8196,'sys::Void',xp,{}).am$('onAction',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('onPopup',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|domkit::Button->domkit::Popup|',false)]),{}).am$('removeOnPopup',8192,'sys::Void',xp,{'sys::NoDoc':""}).am$('openPopup',8192,'sys::Void',xp,{}).am$('showDown',128,'sys::Void',xp,{}).am$('showUp',128,'sys::Void',xp,{}).am$('doMouseDown',262272,'sys::Void',xp,{}).am$('doMouseUp',262272,'sys::Void',xp,{}).am$('fireAction',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{});
ToggleButton.type$.af$('selected',73728,'sys::Bool',{}).af$('elemOn',73728,'sys::Obj?',{}).af$('elemOff',73728,'sys::Obj?',{}).af$('group',65664,'domkit::ButtonGroup?',{}).am$('make',8196,'sys::Void',xp,{}).am$('doMouseUp',263296,'sys::Void',xp,{});
Box.type$.am$('make',8196,'sys::Void',xp,{});
SashBox.type$.af$('dir',73728,'domkit::Dir',{}).af$('resizable',73728,'sys::Bool',{}).af$('sizes',73728,'sys::Str[]',{}).af$('minSize',73728,'sys::Str',{}).af$('dims',67584,'dom::CssDim[]',{}).af$('active',67584,'sys::Bool',{}).af$('resizeIndex',67584,'sys::Int?',{}).af$('pivoff',67584,'sys::Float?',{}).af$('splitter',67584,'dom::Elem?',{}).af$('cbSashResize',67584,'sys::Func?',{}).am$('make',8196,'sys::Void',xp,{}).am$('onSashResize',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('div',40962,'dom::Elem',xp,{}).am$('onAdd',267264,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','dom::Elem',false)]),{}).am$('onRemove',267264,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','dom::Elem',false)]),{}).am$('applyStyle',2048,'sys::Void',xp,{}).am$('onMouseDown',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{}).am$('onMouseUp',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{}).am$('onMouseMove',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{}).am$('toDiv',2048,'dom::Elem?',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem?',false)]),{}).am$('applyResize',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false),new sys.Param('delta','sys::Float',false)]),{}).am$('sizesToPercent',8192,'sys::Void',xp,{'sys::NoDoc':""});
TextField.type$.af$('cols',8192,'sys::Int?',{}).af$('placeholder',8192,'sys::Str?',{}).af$('ro',8192,'sys::Bool',{}).af$('password',8192,'sys::Bool',{}).af$('val',8192,'sys::Str',{}).af$('cbAction',67584,'sys::Func?',{}).af$('cbModify',67584,'sys::Func?',{}).am$('make',8196,'sys::Void',xp,{}).am$('onModify',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('onAction',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('select',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('start','sys::Int',false),new sys.Param('end','sys::Int',false)]),{}).am$('onKeyDown',266240,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{'sys::NoDoc':""}).am$('fireAction',4096,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event?',false)]),{'sys::NoDoc':""}).am$('fireModify',4096,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event?',false)]),{'sys::NoDoc':""}).am$('checkUpdate',2048,'sys::Void',xp,{});
RadioButton.type$.af$('checked',8192,'sys::Bool',{}).af$('cbAction',67584,'sys::Func?',{}).af$('group',65664,'domkit::ButtonGroup?',{}).am$('make',8196,'sys::Void',xp,{}).am$('wrap',8192,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('content','sys::Obj',false)]),{}).am$('onAction',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('fireAction',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{});
ListButton.type$.af$('items',73728,'sys::Obj[]',{}).af$('sel',73728,'domkit::Selection',{}).af$('cbSelect',67584,'sys::Func?',{}).af$('cbElem',67584,'sys::Func?',{}).af$('find',67584,'sys::Str',{}).af$('menu',67584,'domkit::Menu?',{}).am$('make',8196,'sys::Void',xp,{}).am$('onSelect',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('onElem',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj->sys::Obj|',false)]),{}).am$('update',128,'sys::Void',xp,{}).am$('fireSelect',128,'sys::Void',xp,{}).am$('makeListbox',2048,'domkit::Popup',xp,{}).am$('makeElem',2048,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('item','sys::Obj',false)]),{}).am$('onMenuKeyDown',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{});
Selection.type$.af$('enabled',73728,'sys::Bool',{}).af$('multi',73728,'sys::Bool',{}).af$('item',270337,'sys::Obj?',{}).af$('items',270337,'sys::Obj[]',{}).af$('index',270337,'sys::Int?',{}).af$('indexes',270337,'sys::Int[]',{}).am$('isEmpty',270337,'sys::Bool',xp,{}).am$('size',270337,'sys::Int',xp,{}).am$('clear',8192,'sys::Void',xp,{}).am$('refresh',262272,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
IndexSelection.type$.af$('item',271360,'sys::Obj?',{}).af$('items',271360,'sys::Obj[]',{}).af$('index',271360,'sys::Int?',{}).af$('indexes',336896,'sys::Int[]',{}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('size',271360,'sys::Int',xp,{}).am$('refresh',263296,'sys::Void',xp,{}).am$('max',266241,'sys::Int',xp,{}).am$('toItem',266241,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('toIndex',266241,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('item','sys::Obj',false)]),{}).am$('onUpdate',266241,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('oldIndexes','sys::Int[]',false),new sys.Param('newIndexes','sys::Int[]',false)]),{}).am$('checkIndexes',2048,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('indexes','sys::Int[]',false)]),{}).am$('toItems',2048,'sys::Obj[]',sys.List.make(sys.Param.type$,[new sys.Param('indexes','sys::Int[]',false)]),{}).am$('toIndexes',2048,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('items','sys::Obj[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ListButtonSelection.type$.af$('button',67584,'domkit::ListButton',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('button','domkit::ListButton',false)]),{}).am$('max',271360,'sys::Int',xp,{}).am$('toItem',271360,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('toIndex',271360,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('item','sys::Obj',false)]),{}).am$('onUpdate',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('oldIndexes','sys::Int[]',false),new sys.Param('newIndexes','sys::Int[]',false)]),{});
TreeNode.type$.af$('parent',73728,'domkit::TreeNode?',{}).af$('depth',65664,'sys::Int?',{}).af$('elem',65664,'dom::Elem?',{}).af$('expanded',65664,'sys::Bool',{}).am$('isExpanded',8192,'sys::Bool',xp,{}).am$('hasChildren',270336,'sys::Bool',xp,{}).am$('children',270336,'domkit::TreeNode[]',xp,{}).am$('onElem',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false),new sys.Param('flags','domkit::TreeFlags',false)]),{}).am$('make',139268,'sys::Void',xp,{});
TreeFlags.type$.af$('focused',73730,'sys::Bool',{}).af$('selected',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
TreeEvent.type$.af$('tree',73728,'domkit::Tree',{}).af$('node',73728,'domkit::TreeNode',{}).af$('type',73730,'sys::Str',{}).af$('pagePos',73730,'graphics::Point',{}).af$('nodePos',73730,'graphics::Point',{}).af$('size',73730,'graphics::Size',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('t','domkit::Tree',false),new sys.Param('n','domkit::TreeNode',false),new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
Tree.type$.af$('roots',73728,'domkit::TreeNode[]',{}).af$('sel',73728,'domkit::Selection',{}).af$('depthIndent',100354,'sys::Int',{}).af$('nodes',67584,'domkit::TreeNode[]',{}).af$('cbSelect',67584,'sys::Func?',{}).af$('cbAction',67584,'sys::Func?',{}).af$('cbTreeEvent',67584,'[sys::Str:sys::Func]',{}).af$('manFocus',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',xp,{}).am$('rebuild',8192,'sys::Void',xp,{}).am$('refresh',8192,'sys::Void',xp,{}).am$('refreshNode',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','domkit::TreeNode',false)]),{}).am$('expand',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','domkit::TreeNode',false),new sys.Param('expanded','sys::Bool',false)]),{}).am$('displayState',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','domkit::TreeNode',false),new sys.Param('state','sys::Str?',false)]),{'sys::NoDoc':""}).am$('onSelect',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('onAction',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|domkit::Tree,dom::Event->sys::Void|',false)]),{}).am$('onTreeEvent',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false),new sys.Param('f','|domkit::TreeEvent->sys::Void|',false)]),{}).am$('doRebuild',2048,'sys::Void',xp,{}).am$('doRefreshNode',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','domkit::TreeNode',false)]),{}).am$('toElem',2048,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('parent','domkit::TreeNode?',false),new sys.Param('node','domkit::TreeNode',false)]),{}).am$('toNode',2048,'domkit::TreeNode',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false)]),{}).am$('onMouseEvent',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{}).am$('onUpdateSel',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('oldNodes','domkit::TreeNode[]',false),new sys.Param('newNodes','domkit::TreeNode[]',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
TreeSelection.type$.af$('item',271360,'sys::Obj?',{}).af$('items',336896,'sys::Obj[]',{}).af$('index',271360,'sys::Int?',{}).af$('indexes',271360,'sys::Int[]',{}).af$('tree',67584,'domkit::Tree',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tree','domkit::Tree',false)]),{}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('size',271360,'sys::Int',xp,{});
Dialog.type$.af$('title',73728,'sys::Obj?',{}).af$('uid',67586,'sys::Int',{}).af$('nextId',100354,'concurrent::AtomicRef',{}).af$('frame',67584,'dom::Elem?',{}).af$('cbMounted',67584,'sys::Func?',{}).af$('cbOpen',67584,'sys::Func?',{}).af$('cbClose',67584,'sys::Func?',{}).af$('cbKeyDown',67584,'sys::Func?',{}).am$('make',8196,'sys::Void',xp,{}).am$('onBeforeOpen',266240,'sys::Void',xp,{}).am$('onAfterOpen',266240,'sys::Void',xp,{}).am$('onKeyDown',4096,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|dom::Event->sys::Void|',false)]),{}).am$('open',8192,'sys::Void',xp,{}).am$('close',8192,'sys::Void',xp,{}).am$('onMounted',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{'sys::NoDoc':""}).am$('onOpen',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('onClose',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('fireMounted',2048,'sys::Void',xp,{}).am$('fireOpen',2048,'sys::Void',xp,{}).am$('fireClose',2048,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
Popup.type$.af$('halign',73728,'domkit::Align',{}).af$('isOpen',73728,'sys::Bool',{}).af$('uid',67586,'sys::Int',{}).af$('nextId',100354,'concurrent::AtomicInt',{}).af$('gutter',100354,'sys::Float',{}).af$('openPos',67584,'graphics::Point?',{}).af$('cbOpen',67584,'sys::Func?',{}).af$('cbClose',67584,'sys::Func?',{}).af$('_cbClose',67584,'sys::Func?',{}).am$('make',8196,'sys::Void',xp,{}).am$('open',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('close',8192,'sys::Void',xp,{}).am$('fitBounds',8192,'sys::Void',xp,{}).am$('onBeforeOpen',266240,'sys::Void',xp,{}).am$('onOpen',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('onClose',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('_onClose',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('fireOpen',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event?',false)]),{}).am$('fireClose',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event?',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Menu.type$.af$('onCustomKeyDown',65664,'sys::Func?',{}).af$('selIndex',67584,'sys::Int?',{}).af$('lastEvent',67584,'sys::Int',{}).af$('armed',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',xp,{}).am$('onBeforeOpen',267264,'sys::Void',xp,{}).am$('select',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int?',false)]),{'sys::NoDoc':""}).am$('findFirst',2048,'sys::Int?',xp,{}).am$('findPrev',2048,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('start','sys::Int',false)]),{}).am$('findNext',2048,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('start','sys::Int',false)]),{}).am$('fireAction',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{});
MenuItem.type$.af$('enabled',271360,'sys::Bool?',{}).af$('_event',73728,'dom::Event?',{'sys::NoDoc':""}).af$('cbAction',67584,'sys::Func?',{}).am$('make',8196,'sys::Void',xp,{}).am$('onAction',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('fireAction',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{});
FilePicker.type$.af$('accept',8192,'sys::Str?',{}).af$('multi',8192,'sys::Bool',{}).af$('cbSelect',67584,'sys::Func?',{}).am$('make',8196,'sys::Void',xp,{}).am$('open',8192,'sys::Void',xp,{}).am$('files',8192,'dom::DomFile[]',xp,{}).am$('reset',8192,'sys::Void',xp,{}).am$('onSelect',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|domkit::FilePicker->sys::Void|',false)]),{});
FlexBox.type$.af$('dir',73728,'sys::Str',{}).af$('wrap',73728,'sys::Str',{}).af$('alignMain',73728,'sys::Str',{}).af$('alignCross',73728,'sys::Str',{}).af$('alignLines',73728,'sys::Str',{}).af$('flex',73728,'sys::Str[]',{}).am$('make',8196,'sys::Void',xp,{}).am$('onParent',267264,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','dom::Elem',false)]),{}).am$('onAdd',267264,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','dom::Elem',false)]),{}).am$('onRemove',267264,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','dom::Elem',false)]),{}).am$('applyStyle',2048,'sys::Void',xp,{});
Table.type$.af$('model',73728,'domkit::TableModel',{}).af$('showHeader',73728,'sys::Bool',{}).af$('stripeClasses',73728,'sys::Str[]',{}).af$('view',73728,'domkit::TableView',{'sys::NoDoc':""}).af$('sortEnabled',73728,'sys::Bool',{'sys::NoDoc':""}).af$('sel',73728,'domkit::Selection',{}).af$('cellEvents',100354,'sys::Str[]',{}).af$('cbBeforeSelect',67584,'sys::Func?',{}).af$('cbSelect',67584,'sys::Func?',{}).af$('cbAction',67584,'sys::Func?',{}).af$('cbSort',67584,'sys::Func?',{}).af$('cbKeyDown',67584,'sys::Func?',{}).af$('cbTableEvent',67584,'[sys::Str:sys::Func]',{}).af$('cbHeaderPopup',67584,'sys::Func?',{}).af$('sbarsz',67586,'sys::Int',{}).af$('thumbMargin',67586,'sys::Int',{}).af$('overScroll',67586,'sys::Int',{}).af$('scrollPageFreq',67586,'sys::Duration',{}).af$('scrollPulseDir',67586,'sys::Duration',{}).af$('thead',67584,'dom::Elem?',{}).af$('tbody',67584,'dom::Elem?',{}).af$('hbar',67584,'dom::Elem?',{}).af$('vbar',67584,'dom::Elem?',{}).af$('headers',67584,'[sys::Int:dom::Elem]',{}).af$('cells',67584,'[domkit::TablePos:dom::Elem]',{}).af$('theadh',67584,'sys::Int',{}).af$('tbodyw',67584,'sys::Int',{}).af$('tbodyh',67584,'sys::Int',{}).af$('numCols',67584,'sys::Int',{}).af$('numRows',67584,'sys::Int',{}).af$('colx',67584,'sys::Int[]',{}).af$('colw',67584,'sys::Int[]',{}).af$('ucolw',67584,'[sys::Int:sys::Int]',{}).af$('rowh',67584,'sys::Int',{}).af$('numVisCols',67584,'sys::Int',{}).af$('numVisRows',67584,'sys::Int',{}).af$('maxScrollx',67584,'sys::Int',{}).af$('maxScrolly',67584,'sys::Int',{}).af$('hasScrollx',67584,'sys::Bool',{}).af$('hasScrolly',67584,'sys::Bool',{}).af$('htrackw',67584,'sys::Int',{}).af$('hthumbw',67584,'sys::Int',{}).af$('vtrackh',67584,'sys::Int',{}).af$('vthumbh',67584,'sys::Int',{}).af$('resizeCol',67584,'sys::Int?',{}).af$('resizeElem',67584,'dom::Elem?',{}).af$('hpbut',67584,'dom::Elem?',{}).af$('hasHpbut',67584,'sys::Bool',{}).af$('hpbutw',67586,'sys::Int',{}).af$('scrollx',67584,'sys::Int',{}).af$('scrolly',67584,'sys::Int',{}).af$('hbarPulseId',67584,'sys::Int?',{}).af$('vbarPulseId',67584,'sys::Int?',{}).af$('hbarPageId',67584,'sys::Int?',{}).af$('vbarPageId',67584,'sys::Int?',{}).af$('hthumbDragOff',67584,'sys::Int?',{}).af$('vthumbDragOff',67584,'sys::Int?',{}).af$('firstVisCol',67584,'sys::Int',{}).af$('firstVisRow',67584,'sys::Int',{}).af$('pivot',67584,'sys::Int?',{}).af$('manFocus',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',xp,{}).am$('onHeaderPopup',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|domkit::Table->domkit::Popup|',false)]),{}).am$('sortCol',8192,'sys::Int?',xp,{}).am$('sortDir',8192,'domkit::Dir',xp,{}).am$('sort',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('col','sys::Int?',false),new sys.Param('dir','domkit::Dir',true)]),{}).am$('scrollTo',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('col','sys::Int?',false),new sys.Param('row','sys::Int?',false)]),{}).am$('onBeforeSelect',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Int[]->sys::Bool|',false)]),{'sys::NoDoc':""}).am$('onSelect',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('onAction',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('onSort',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('onKeyDown',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|dom::Event->sys::Void|',false)]),{'sys::NoDoc':""}).am$('onTableEvent',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false),new sys.Param('f','|domkit::TableEvent->sys::Void|',false)]),{}).am$('onBeforeRebuild',266240,'sys::Void',xp,{'sys::NoDoc':""}).am$('rebuild',8192,'sys::Void',xp,{}).am$('refresh',8192,'sys::Void',xp,{}).am$('refreshHeaders',2048,'sys::Void',xp,{}).am$('refreshHeader',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('header','dom::Elem?',false),new sys.Param('col','sys::Int',false)]),{}).am$('refreshRow',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('row','sys::Int',false)]),{}).am$('refreshCell',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cell','dom::Elem?',false),new sys.Param('col','sys::Int',false),new sys.Param('row','sys::Int',false)]),{}).am$('doRebuild',2048,'sys::Void',xp,{}).am$('makeScrollBar',2048,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('dir','domkit::Dir',false)]),{}).am$('startScrollPage',2048,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('delta','graphics::Point',false)]),{}).am$('stopScrollPage',2048,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('fid','sys::Int?',false)]),{}).am$('pulseScrollBar',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dir','domkit::Dir',false)]),{}).am$('onUpdate',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('col','sys::Int',false),new sys.Param('row','sys::Int',false)]),{}).am$('onMoveX',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('col','sys::Int',false)]),{}).am$('onMoveY',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('row','sys::Int',false)]),{}).am$('findMaxVisCols',2048,'sys::Int',xp,{}).am$('openHeaderPopup',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('button','dom::Elem',false),new sys.Param('popup','domkit::Popup',false)]),{}).am$('onScroll',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('delta','graphics::Point?',false)]),{}).am$('onMouseEvent',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{}).am$('onMouseEventSelect',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false),new sys.Param('row','sys::Int',false),new sys.Param('vrow','sys::Int',false)]),{}).am$('onKeyEvent',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{}).am$('updateSel',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('newsel','sys::Int[]',false)]),{'sys::NoDoc':""}).am$('colxSafe',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('colwSafe',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('ts',2048,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
TablePos.type$.af$('col',73730,'sys::Int',{}).af$('row',73730,'sys::Int',{}).af$('hash',336898,'sys::Int',{}).af$('toStr',336898,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false),new sys.Param('r','sys::Int',false)]),{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{});
TableModel.type$.am$('numCols',270336,'sys::Int',xp,{}).am$('numRows',270336,'sys::Int',xp,{}).am$('headerHeight',270336,'sys::Int',xp,{}).am$('colWidth',270336,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('col','sys::Int',false)]),{}).am$('rowHeight',270336,'sys::Int',xp,{}).am$('item',270336,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('row','sys::Int',false)]),{}).am$('onHeader',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('header','dom::Elem',false),new sys.Param('col','sys::Int',false)]),{}).am$('isVisibleDef',270336,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('col','sys::Int',false)]),{}).am$('onCell',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cell','dom::Elem',false),new sys.Param('col','sys::Int',false),new sys.Param('row','sys::Int',false),new sys.Param('flags','domkit::TableFlags',false)]),{}).am$('sortCompare',270336,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('col','sys::Int',false),new sys.Param('row1','sys::Int',false),new sys.Param('row2','sys::Int',false)]),{}).am$('onSort',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('col','sys::Int?',false),new sys.Param('dir','domkit::Dir',false)]),{'sys::NoDoc':""}).am$('make',139268,'sys::Void',xp,{});
TableFlags.type$.af$('defVal',106498,'domkit::TableFlags',{}).af$('focused',73730,'sys::Bool',{}).af$('selected',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
TableEvent.type$.af$('table',73728,'domkit::Table',{}).af$('type',73730,'sys::Str',{}).af$('col',73730,'sys::Int',{}).af$('row',73730,'sys::Int',{}).af$('pagePos',73730,'graphics::Point',{}).af$('cellPos',73730,'graphics::Point',{}).af$('size',73730,'graphics::Size',{}).af$('_event',73728,'dom::Event?',{'sys::NoDoc':""}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('t','domkit::Table',false),new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
TableSelection.type$.af$('view',67584,'domkit::TableView',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('view','domkit::TableView',false)]),{}).am$('max',271360,'sys::Int',xp,{}).am$('toItem',271360,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('toIndex',271360,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('item','sys::Obj',false)]),{}).am$('onUpdate',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('oldIndexes','sys::Int[]',false),new sys.Param('newIndexes','sys::Int[]',false)]),{});
TableView.type$.af$('table',65664,'domkit::Table',{}).af$('rows',67584,'sys::Int[]',{}).af$('cols',67584,'sys::Int[]',{}).af$('vis',67584,'sys::Bool[]',{}).af$('sortCol',65664,'sys::Int?',{}).af$('sortDir',65664,'domkit::Dir',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('table','domkit::Table',false)]),{}).am$('numCols',271360,'sys::Int',xp,{}).am$('numRows',271360,'sys::Int',xp,{}).am$('headerHeight',271360,'sys::Int',xp,{}).am$('colWidth',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('rowHeight',271360,'sys::Int',xp,{}).am$('item',271360,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('r','sys::Int',false)]),{}).am$('onHeader',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Elem',false),new sys.Param('c','sys::Int',false)]),{}).am$('onCell',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Elem',false),new sys.Param('c','sys::Int',false),new sys.Param('r','sys::Int',false),new sys.Param('f','domkit::TableFlags',false)]),{}).am$('isColVisible',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('col','sys::Int',false)]),{}).am$('setColVisible',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('col','sys::Int',false),new sys.Param('visible','sys::Bool',false)]),{}).am$('sort',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('col','sys::Int?',false),new sys.Param('dir','domkit::Dir',true)]),{}).am$('refresh',8192,'sys::Void',xp,{}).am$('refreshRows',2048,'sys::Void',xp,{}).am$('refreshCols',2048,'sys::Void',xp,{}).am$('rowViewToModel',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('colViewToModel',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('rowsViewToModel',8192,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int[]',false)]),{}).am$('colsViewToModel',8192,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int[]',false)]),{}).am$('rowModelToView',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('colModelToView',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('rowsModelToView',8192,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int[]',false)]),{}).am$('colsModelToView',8192,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int[]',false)]),{});
ScrollBox.type$.af$('cbScroll',67584,'sys::Func?',{}).am$('make',8196,'sys::Void',xp,{}).am$('onScroll',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('fireScroll',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{});
WellBox.type$.am$('make',8196,'sys::Void',xp,{}).am$('mergeHeader',8192,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('header','dom::Elem',false),new sys.Param('halign','domkit::Align',true)]),{'sys::NoDoc':""});
DomListener.type$.af$('checkFreq',67584,'sys::Int',{}).af$('lastTicks',67584,'sys::Int?',{}).af$('observer',67584,'dom::MutationObserver',{}).af$('map',67584,'dom::WeakMap',{}).af$('mounted',67584,'[sys::Int:dom::Elem]',{}).af$('checkMutations',67584,'dom::MutationRec[]',{}).af$('checkState',67584,'dom::Elem[]',{}).am$('cur',40962,'domkit::DomListener',xp,{}).am$('make',2052,'sys::Void',xp,{}).am$('onMount',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('target','dom::Elem',false),new sys.Param('f','|dom::Elem->sys::Void|',false)]),{}).am$('onUnmount',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('target','dom::Elem',false),new sys.Param('f','|dom::Elem->sys::Void|',false)]),{}).am$('onResize',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('target','dom::Elem',false),new sys.Param('f','|dom::Elem->sys::Void|',false)]),{}).am$('reqCheck',2048,'sys::Void',xp,{}).am$('onCheck',2048,'sys::Void',xp,{}).am$('findRegNodes',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false),new sys.Param('list','dom::Elem[]',false)]),{});
DomState.type$.af$('onMount',73728,'sys::Func?',{}).af$('onUnmount',73728,'sys::Func?',{}).af$('onResize',73728,'sys::Func?',{}).af$('lastSize',73728,'graphics::Size?',{}).af$('newSize',73728,'graphics::Size?',{}).af$('mounted',67584,'sys::Bool',{}).af$('unmounted',67584,'sys::Bool',{}).am$('fireMount',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false)]),{}).am$('fireUnmount',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false)]),{}).am$('fireResize',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Checkbox.type$.af$('indeterminate',8192,'sys::Bool',{}).af$('checked',8192,'sys::Bool',{}).af$('cbAction',67584,'sys::Func?',{}).am$('make',8196,'sys::Void',xp,{}).am$('wrap',8192,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('content','sys::Obj',false)]),{}).am$('onAction',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('fireAction',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{});
TextArea.type$.af$('cols',8192,'sys::Int?',{}).af$('rows',8192,'sys::Int?',{}).af$('placeholder',8192,'sys::Str?',{}).af$('ro',8192,'sys::Bool',{}).af$('val',8192,'sys::Str',{}).af$('cbModify',67584,'sys::Func?',{}).am$('make',8196,'sys::Void',xp,{}).am$('onModify',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('fireModify',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{});
AccordionBox.type$.am$('make',8196,'sys::Void',xp,{}).am$('addGroup',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('header','dom::Elem',false),new sys.Param('kids','dom::Elem[]',false),new sys.Param('expanded','sys::Bool',true)]),{}).am$('isExpanded',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('groupIndex','sys::Int',false)]),{}).am$('expand',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('groupIndex','sys::Int',false),new sys.Param('expanded','sys::Bool',false)]),{}).am$('onMouseDown',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{});
Link.type$.af$('target',8192,'sys::Str',{}).af$('uri',73728,'sys::Uri',{}).am$('make',8196,'sys::Void',xp,{});
DragTarget.type$.af$('cbDrag',67584,'sys::Func?',{}).af$('cbDragImage',67584,'sys::Func?',{}).af$('cbEnd',67584,'sys::Func?',{}).af$('dragImage',67584,'dom::Elem?',{}).am$('bind',40962,'domkit::DragTarget',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false)]),{}).am$('onDrag',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|dom::Elem->sys::Obj|',false)]),{}).am$('onDragImage',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj->dom::Elem|',false)]),{}).am$('onEnd',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|dom::Elem->sys::Void|',false)]),{});
DropTarget.type$.af$('cbCanDrop',67584,'sys::Func?',{}).af$('cbDrop',67584,'sys::Func?',{}).af$('cbOver',67584,'sys::Func?',{}).af$('cbLeave',67584,'sys::Func?',{}).af$('depth',67584,'sys::Int',{}).am$('bind',40962,'domkit::DropTarget',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false)]),{}).am$('canDrop',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj->sys::Bool|',false)]),{}).am$('onDrop',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj->sys::Void|',false)]),{}).am$('onOver',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|graphics::Point->sys::Void|',false)]),{}).am$('onLeave',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|->sys::Void|',false)]),{}).am$('_canDrop',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj',false)]),{});
DndUtil.type$.af$('dataRef',100354,'concurrent::AtomicRef',{}).am$('getData',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('dt','dom::DataTransfer',false)]),{}).am$('setData',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dt','dom::DataTransfer',false),new sys.Param('data','sys::Obj',false)]),{}).am$('clearData',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dt','dom::DataTransfer',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
ButtonGroup.type$.af$('buttons',73728,'dom::Elem[]',{}).af$('inheritEnabled',73728,'sys::Bool',{}).af$('enabled',73728,'sys::Bool',{}).af$('selIndex',73728,'sys::Int?',{}).af$('_event',73728,'dom::Event?',{'sys::NoDoc':""}).af$('cbBeforeSelect',67584,'sys::Func?',{}).af$('cbSelect',67584,'sys::Func?',{}).am$('add',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('button','dom::Elem',false)]),{}).am$('onBeforeSelect',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|domkit::ButtonGroup,sys::Int->sys::Bool|',false)]),{}).am$('onSelect',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('select',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('button','dom::Elem',false)]),{}).am$('update',128,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
FlowBox.type$.af$('halign',73728,'domkit::Align',{}).af$('gaps',73728,'sys::Str[]',{}).am$('make',8196,'sys::Void',xp,{}).am$('onAdd',267264,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','dom::Elem',false)]),{}).am$('onRemove',267264,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','dom::Elem',false)]),{}).am$('applyStyle',2048,'sys::Void',xp,{});
Combo.type$.af$('field',73728,'domkit::TextField',{}).af$('items',8192,'sys::Str[]',{}).af$('enabled',271360,'sys::Bool?',{}).af$('button',67584,'domkit::ListButton',{}).am$('make',8196,'sys::Void',xp,{}).am$('onElem',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj->sys::Obj|',false)]),{}).am$('update',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{});
GridBox.type$.af$('halign',73728,'domkit::Align',{}).af$('table',67584,'dom::Elem',{}).af$('tbody',67584,'dom::Elem',{}).af$('init',67584,'sys::Bool',{}).af$('cstyleMap',67584,'[sys::Str:sys::Str]',{}).am$('make',8196,'sys::Void',xp,{}).am$('cellStyle',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('col','sys::Obj',false),new sys.Param('row','sys::Obj',false),new sys.Param('style','sys::Str',false)]),{}).am$('numRows',8192,'sys::Int',xp,{}).am$('addRow',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cells','dom::Elem?[]',false),new sys.Param('colspan','sys::Int[]',true)]),{}).am$('insertRowBefore',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false),new sys.Param('cells','dom::Elem?[]',false),new sys.Param('colspan','sys::Int[]',true)]),{}).am$('_addRow',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('at','sys::Int?',false),new sys.Param('cells','dom::Elem?[]',false),new sys.Param('colspan','sys::Int[]',true)]),{}).am$('rowIndexOf',8192,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('child','dom::Elem',false)]),{}).am$('removeRow',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('removeAllRows',8192,'sys::This',xp,{}).am$('updateCellStyle',2048,'sys::Void',xp,{}).am$('applyCellStyle',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false),new sys.Param('r','sys::Int',false),new sys.Param('td','dom::Elem',false)]),{}).am$('setCellStyle',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('td','dom::Elem',false)]),{});
FlipBox.type$.af$('front',8192,'dom::Elem?',{}).af$('back',8192,'dom::Elem?',{}).af$('card',67584,'dom::Elem',{}).am$('make',8196,'sys::Void',xp,{}).am$('flip',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('onComplete','|sys::This->sys::Void|?',true)]),{}).am$('isFront',8192,'sys::Bool',xp,{}).am$('isBack',8192,'sys::Bool',xp,{}).am$('toFront',8192,'sys::This',xp,{}).am$('toBack',8192,'sys::This',xp,{});
Sheet.type$.af$('canDismiss',73728,'sys::Bool',{}).af$('isOpen',73728,'sys::Bool',{}).af$('delay',73728,'sys::Duration?',{'sys::NoDoc':""}).af$('uid',67586,'sys::Int',{}).af$('nextId',100354,'concurrent::AtomicRef',{}).af$('cbOpen',67584,'sys::Func?',{}).af$('cbClose',67584,'sys::Func?',{}).af$('cbKeyDown',67584,'sys::Func?',{}).am$('make',8196,'sys::Void',xp,{}).am$('onBeforeOpen',266240,'sys::Void',xp,{}).am$('onKeyDown',4096,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|dom::Event->sys::Void|',false)]),{}).am$('open',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('parent','dom::Elem',false),new sys.Param('height','sys::Str',false)]),{}).am$('close',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('onOpen',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('onClose',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('fireOpen',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event?',false)]),{}).am$('fireClose',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event?',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
CardBox.type$.af$('selIndex',335872,'sys::Int?',{}).af$('effect',73728,'sys::Str?',{}).af$('effectDur',73728,'sys::Duration',{}).am$('make',8196,'sys::Void',xp,{}).am$('selItem',8192,'dom::Elem?',xp,{}).am$('onAdd',267264,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','dom::Elem',false)]),{}).am$('onRemove',267264,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','dom::Elem',false)]),{}).am$('updateStyle',2048,'sys::Void',xp,{}).am$('updateDis',2048,'sys::Void',xp,{});
ProgressBar.type$.af$('min',73728,'sys::Int',{}).af$('max',73728,'sys::Int',{}).af$('val',73728,'sys::Int',{}).af$('cbText',67584,'sys::Func?',{}).af$('cbBarColor',67584,'sys::Func?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('onText',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|domkit::ProgressBar->sys::Str|',false)]),{}).am$('onBarColor',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|domkit::ProgressBar->sys::Str|',false)]),{}).am$('update',2048,'sys::Void',xp,{});
Tooltip.type$.af$('delay',73728,'sys::Duration?',{}).af$('gutter',100354,'sys::Int',{}).af$('node',67584,'dom::Elem?',{}).af$('timerId',67584,'sys::Int?',{}).af$('inNode',67584,'sys::Bool',{}).af$('inTooltip',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',xp,{}).am$('bind',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','dom::Elem',false)]),{}).am$('check',2048,'sys::Void',xp,{}).am$('isOpen',2048,'sys::Bool',xp,{}).am$('open',2048,'sys::Void',xp,{}).am$('close',8192,'sys::Void',xp,{'sys::NoDoc':""}).am$('static$init',165890,'sys::Void',xp,{});
Align.type$.af$('top',106506,'domkit::Align',{}).af$('left',106506,'domkit::Align',{}).af$('bottom',106506,'domkit::Align',{}).af$('right',106506,'domkit::Align',{}).af$('center',106506,'domkit::Align',{}).af$('fill',106506,'domkit::Align',{}).af$('vals',106498,'domkit::Align[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'domkit::Align?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Dir.type$.af$('up',106506,'domkit::Dir',{}).af$('down',106506,'domkit::Dir',{}).af$('left',106506,'domkit::Dir',{}).af$('right',106506,'domkit::Dir',{}).af$('vals',106498,'domkit::Dir[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'domkit::Dir?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Label.type$.am$('make',8196,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "domkit");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;concurrent 1.0;graphics 1.0;dom 1.0");
m.set("pod.summary", "DOM Based UI Framework");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:22-05:00 New_York");
m.set("build.tsKey", "241210143122");
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
  Button,
  ToggleButton,
  Box,
  SashBox,
  TextField,
  RadioButton,
  ListButton,
  Selection,
  IndexSelection,
  TreeNode,
  TreeFlags,
  TreeEvent,
  Tree,
  Dialog,
  Popup,
  Menu,
  MenuItem,
  FilePicker,
  FlexBox,
  Table,
  TableModel,
  TableFlags,
  TableEvent,
  TableView,
  ScrollBox,
  WellBox,
  DomListener,
  Checkbox,
  TextArea,
  AccordionBox,
  Link,
  DragTarget,
  DropTarget,
  DndUtil,
  ButtonGroup,
  FlowBox,
  Combo,
  GridBox,
  FlipBox,
  Sheet,
  CardBox,
  ProgressBar,
  Tooltip,
  Align,
  Dir,
  Label,
};
