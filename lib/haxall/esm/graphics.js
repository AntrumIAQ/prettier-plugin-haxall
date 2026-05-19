// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class Paint {
  constructor() {
    const this$ = this;
  }

  typeof() { return Paint.type$; }

}

class Color extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Color.type$; }

  static #transparent = undefined;

  static transparent() {
    if (Color.#transparent === undefined) {
      Color.static$init();
      if (Color.#transparent === undefined) Color.#transparent = null;
    }
    return Color.#transparent;
  }

  static #black = undefined;

  static black() {
    if (Color.#black === undefined) {
      Color.static$init();
      if (Color.#black === undefined) Color.#black = null;
    }
    return Color.#black;
  }

  static #white = undefined;

  static white() {
    if (Color.#white === undefined) {
      Color.static$init();
      if (Color.#white === undefined) Color.#white = null;
    }
    return Color.#white;
  }

  #rgb = 0;

  rgb() { return this.#rgb; }

  __rgb(it) { if (it === undefined) return this.#rgb; else this.#rgb = it; }

  #a = sys.Float.make(0);

  a() { return this.#a; }

  __a(it) { if (it === undefined) return this.#a; else this.#a = it; }

  static #byKeyword = undefined;

  static byKeyword() {
    if (Color.#byKeyword === undefined) {
      Color.static$init();
      if (Color.#byKeyword === undefined) Color.#byKeyword = null;
    }
    return Color.#byKeyword;
  }

  static make(rgb,a) {
    const $self = new Color();
    Color.make$($self,rgb,a);
    return $self;
  }

  static make$($self,rgb,a) {
    if (rgb === undefined) rgb = 0;
    if (a === undefined) a = sys.Float.make(1.0);
    $self.#rgb = sys.Int.and(rgb, 16777215);
    $self.#a = sys.Float.min(sys.Float.max(a, sys.Float.make(0.0)), sys.Float.make(1.0));
    return;
  }

  static makeRgb(r,g,b,a) {
    if (a === undefined) a = sys.Float.make(1.0);
    return Color.make(sys.Int.or(sys.Int.or(sys.Int.shiftl(sys.Int.and(r, 255), 16), sys.Int.shiftl(sys.Int.and(g, 255), 8)), sys.Int.and(b, 255)), a);
  }

  static makeHsl(h,s,l,a) {
    if (a === undefined) a = sys.Float.make(1.0);
    let c = sys.Float.mult(sys.Float.minus(sys.Float.make(1.0), sys.Float.abs(sys.Float.minus(sys.Float.mult(sys.Float.make(2.0), l), sys.Float.make(1.0)))), s);
    let x = sys.Float.mult(c, sys.Float.minus(sys.Float.make(1.0), sys.Float.abs(sys.Float.minus(sys.Float.mod(sys.Float.div(h, sys.Float.make(60.0)), sys.Float.make(2.0)), sys.Float.make(1.0)))));
    let m = sys.Float.minus(l, sys.Float.div(c, sys.Float.make(2.0)));
    let r = sys.Float.make(0.0);
    let g = sys.Float.make(0.0);
    let b = sys.Float.make(0.0);
    if (sys.ObjUtil.compareLT(h, sys.Float.make(60.0))) {
      (r = c);
      (g = x);
      (b = sys.Float.make(0.0));
    }
    else {
      if ((sys.ObjUtil.compareGE(h, sys.Float.make(60.0)) && sys.ObjUtil.compareLT(h, sys.Float.make(120.0)))) {
        (r = x);
        (g = c);
        (b = sys.Float.make(0.0));
      }
      else {
        if ((sys.ObjUtil.compareGE(h, sys.Float.make(120.0)) && sys.ObjUtil.compareLT(h, sys.Float.make(180.0)))) {
          (r = sys.Float.make(0.0));
          (g = c);
          (b = x);
        }
        else {
          if ((sys.ObjUtil.compareGE(h, sys.Float.make(180.0)) && sys.ObjUtil.compareLT(h, sys.Float.make(240.0)))) {
            (r = sys.Float.make(0.0));
            (g = x);
            (b = c);
          }
          else {
            if ((sys.ObjUtil.compareGE(h, sys.Float.make(240.0)) && sys.ObjUtil.compareLT(h, sys.Float.make(300.0)))) {
              (r = x);
              (g = sys.Float.make(0.0));
              (b = c);
            }
            else {
              if ((sys.ObjUtil.compareGE(h, sys.Float.make(300.0)) && sys.ObjUtil.compareLT(h, sys.Float.make(360.0)))) {
                (r = c);
                (g = sys.Float.make(0.0));
                (b = x);
              }
              ;
            }
            ;
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    return Color.make(sys.Int.or(sys.Int.or(sys.Int.shiftl(sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.round(sys.Float.mult(sys.Float.plus(r, m), sys.Float.make(255.0))), sys.Num.type$)), 16), sys.Int.shiftl(sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.round(sys.Float.mult(sys.Float.plus(g, m), sys.Float.make(255.0))), sys.Num.type$)), 8)), sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.round(sys.Float.mult(sys.Float.plus(b, m), sys.Float.make(255.0))), sys.Num.type$))), a);
  }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    try {
      if (sys.Str.startsWith(s, "#")) {
        return Color.parseHex(s);
      }
      ;
      let k = Color.byKeyword().get(s);
      if (k != null) {
        return k;
      }
      ;
      let paren = sys.Str.index(s, "(");
      if (paren != null) {
        if (sys.ObjUtil.compareNE(sys.Str.get(s, -1), 41)) {
          throw sys.Err.make();
        }
        ;
        return Color.parseFunc(sys.Str.getRange(s, sys.Range.make(0, sys.ObjUtil.coerce(paren, sys.Int.type$), true)), GeomUtil.split(sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(paren, sys.Int.type$), 1), -2))));
      }
      ;
      throw sys.Err.make();
    }
    catch ($_u0) {
      $_u0 = sys.Err.make($_u0);
      if ($_u0 instanceof sys.Err) {
        let e = $_u0;
        ;
      }
      else {
        throw $_u0;
      }
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(sys.Str.plus("Invalid Color: ", s));
    }
    ;
    return null;
  }

  static listFromStr(s,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    try {
      let toks = sys.Str.split(s, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
      if (sys.Str.contains(s, "(")) {
        let acc = sys.List.make(sys.StrBuf.type$);
        let inParen = false;
        toks.each((tok,i) => {
          if (inParen) {
            sys.ObjUtil.coerce(acc.last().addChar(44), sys.StrBuf.type$.toNullable()).add(tok);
          }
          else {
            acc.add(sys.StrBuf.make().add(tok));
          }
          ;
          if (sys.Str.contains(tok, "(")) {
            (inParen = true);
          }
          ;
          if (sys.Str.contains(tok, ")")) {
            (inParen = false);
          }
          ;
          return;
        });
        (toks = sys.ObjUtil.coerce(acc.map((buf) => {
          return buf.toStr();
        }, sys.Str.type$), sys.Type.find("sys::Str[]")));
      }
      ;
      return sys.ObjUtil.coerce(toks.map((tok) => {
        return sys.ObjUtil.coerce(Color.fromStr(tok), Color.type$);
      }, Color.type$), sys.Type.find("graphics::Color[]?"));
    }
    catch ($_u1) {
      $_u1 = sys.Err.make($_u1);
      if ($_u1 instanceof sys.Err) {
        let e = $_u1;
        ;
        e.trace();
      }
      else {
        throw $_u1;
      }
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(sys.Str.plus("Invalid color list: ", s));
    }
    ;
    return null;
  }

  static parseHex(s) {
    let sub = sys.Str.getRange(s, sys.Range.make(1, -1));
    let hex = sys.Str.toInt(sub, 16);
    let $_u2 = sys.Str.size(sub);
    if (sys.ObjUtil.equals($_u2, 3)) {
      let r = sys.Int.and(sys.Int.shiftr(sys.ObjUtil.coerce(hex, sys.Int.type$), 8), 15);
      (r = sys.Int.or(sys.Int.shiftl(r, 4), r));
      let g = sys.Int.and(sys.Int.shiftr(sys.ObjUtil.coerce(hex, sys.Int.type$), 4), 15);
      (g = sys.Int.or(sys.Int.shiftl(g, 4), g));
      let b = sys.Int.and(sys.Int.shiftr(sys.ObjUtil.coerce(hex, sys.Int.type$), 0), 15);
      (b = sys.Int.or(sys.Int.shiftl(b, 4), b));
      return Color.make(sys.Int.or(sys.Int.or(sys.Int.shiftl(r, 16), sys.Int.shiftl(g, 8)), b));
    }
    else if (sys.ObjUtil.equals($_u2, 4)) {
      let r = sys.Int.and(sys.Int.shiftr(sys.ObjUtil.coerce(hex, sys.Int.type$), 12), 15);
      (r = sys.Int.or(sys.Int.shiftl(r, 4), r));
      let g = sys.Int.and(sys.Int.shiftr(sys.ObjUtil.coerce(hex, sys.Int.type$), 8), 15);
      (g = sys.Int.or(sys.Int.shiftl(g, 4), g));
      let b = sys.Int.and(sys.Int.shiftr(sys.ObjUtil.coerce(hex, sys.Int.type$), 4), 15);
      (b = sys.Int.or(sys.Int.shiftl(b, 4), b));
      let a = sys.Int.and(sys.Int.shiftr(sys.ObjUtil.coerce(hex, sys.Int.type$), 0), 15);
      (a = sys.Int.or(sys.Int.shiftl(a, 4), a));
      return Color.makeRgb(r, g, b, sys.Int.divFloat(a, sys.Float.make(255.0)));
    }
    else if (sys.ObjUtil.equals($_u2, 6)) {
      return Color.make(sys.ObjUtil.coerce(hex, sys.Int.type$));
    }
    else if (sys.ObjUtil.equals($_u2, 8)) {
      return Color.make(sys.Int.shiftr(sys.ObjUtil.coerce(hex, sys.Int.type$), 8), sys.ObjUtil.coerce(sys.Str.toFloat(GeomUtil.formatFloat(sys.Int.divFloat(sys.Int.and(sys.ObjUtil.coerce(hex, sys.Int.type$), 255), sys.Float.make(255.0)))), sys.Float.type$));
    }
    else {
      throw sys.Err.make();
    }
    ;
  }

  static parseFunc(func,args) {
    let $_u3 = func;
    if (sys.ObjUtil.equals($_u3, "rgb") || sys.ObjUtil.equals($_u3, "rgba")) {
      return Color.makeRgb(Color.parseRgbArg(args.get(0)), Color.parseRgbArg(args.get(1)), Color.parseRgbArg(args.get(2)), Color.parsePercentArg(args.getSafe(3)));
    }
    else if (sys.ObjUtil.equals($_u3, "hsl") || sys.ObjUtil.equals($_u3, "hsla")) {
      return Color.makeHsl(Color.parseDegArg(args.get(0)), Color.parsePercentArg(args.get(1)), Color.parsePercentArg(args.get(2)), Color.parsePercentArg(args.getSafe(3)));
    }
    else {
      throw sys.Err.make();
    }
    ;
  }

  static parseRgbArg(s) {
    if (sys.ObjUtil.equals(sys.Str.get(s, -1), 37)) {
      return sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.div(sys.Float.mult(sys.Float.make(255.0), sys.ObjUtil.coerce(sys.Str.toFloat(sys.Str.getRange(s, sys.Range.make(0, -2))), sys.Float.type$)), sys.Float.make(100.0)), sys.Num.type$));
    }
    ;
    return sys.ObjUtil.coerce(sys.Str.toInt(s), sys.Int.type$);
  }

  static parseDegArg(s) {
    if (sys.Str.endsWith(s, "deg")) {
      (s = sys.Str.getRange(s, sys.Range.make(0, -4)));
    }
    ;
    let f = sys.Str.toFloat(s);
    if (sys.ObjUtil.compareGT(f, sys.Float.make(360.0))) {
      (f = sys.ObjUtil.coerce(sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.mod(sys.Num.toInt(sys.ObjUtil.coerce(f, sys.Num.type$)), 360), sys.Num.type$)), sys.Float.type$.toNullable()));
    }
    ;
    return sys.ObjUtil.coerce(f, sys.Float.type$);
  }

  static parsePercentArg(s) {
    if (s == null) {
      return sys.Float.make(1.0);
    }
    ;
    if (sys.ObjUtil.equals(sys.Str.get(s, -1), 37)) {
      return sys.Float.div(sys.ObjUtil.coerce(sys.Str.toFloat(sys.Str.getRange(s, sys.Range.make(0, -2))), sys.Float.type$), sys.Float.make(100.0));
    }
    ;
    return sys.ObjUtil.coerce(sys.Str.toFloat(s), sys.Float.type$);
  }

  r() {
    return sys.Int.and(sys.Int.shiftr(this.#rgb, 16), 255);
  }

  g() {
    return sys.Int.and(sys.Int.shiftr(this.#rgb, 8), 255);
  }

  b() {
    return sys.Int.and(this.#rgb, 255);
  }

  h() {
    let r = sys.Num.toFloat(sys.ObjUtil.coerce(this.r(), sys.Num.type$));
    let b = sys.Num.toFloat(sys.ObjUtil.coerce(this.b(), sys.Num.type$));
    let g = sys.Num.toFloat(sys.ObjUtil.coerce(this.g(), sys.Num.type$));
    let min = sys.Float.min(r, sys.Float.min(b, g));
    let max = sys.Float.max(r, sys.Float.max(b, g));
    let delta = sys.Float.minus(max, min);
    let s = ((this$) => { if (sys.ObjUtil.equals(max, sys.Float.make(0.0))) return sys.Float.make(0.0); return sys.Float.div(delta, max); })(this);
    let h = sys.Float.make(0.0);
    if (sys.ObjUtil.compareNE(s, sys.Float.make(0.0))) {
      if (sys.ObjUtil.equals(r, max)) {
        (h = sys.Float.div(sys.Float.minus(g, b), delta));
      }
      else {
        if (sys.ObjUtil.equals(g, max)) {
          (h = sys.Float.plus(sys.Float.make(2.0), sys.Float.div(sys.Float.minus(b, r), delta)));
        }
        else {
          if (sys.ObjUtil.equals(b, max)) {
            (h = sys.Float.plus(sys.Float.make(4.0), sys.Float.div(sys.Float.minus(r, g), delta)));
          }
          ;
        }
        ;
      }
      ;
      h = sys.Float.mult(h, sys.Float.make(60.0));
      if (sys.ObjUtil.compareLT(h, sys.Float.make(0.0))) {
        h = sys.Float.plus(h, sys.Float.make(360.0));
      }
      ;
    }
    ;
    return h;
  }

  s() {
    let min = sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.min(this.r(), sys.Int.min(this.b(), this.g())), sys.Num.type$));
    let max = sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.max(this.r(), sys.Int.max(this.b(), this.g())), sys.Num.type$));
    let c = sys.Float.minus(max, min);
    if (sys.ObjUtil.equals(c, sys.Float.make(0.0))) {
      return sys.Float.make(0.0);
    }
    ;
    return sys.Float.div(sys.Float.div(c, sys.Float.minus(sys.Float.make(1.0), sys.Float.abs(sys.Float.minus(sys.Float.mult(sys.Float.make(2.0), this.l()), sys.Float.make(1.0))))), sys.Float.make(255.0));
  }

  l() {
    let max = sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.max(this.r(), sys.Int.max(this.b(), this.g())), sys.Num.type$));
    let min = sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.min(this.r(), sys.Int.min(this.b(), this.g())), sys.Num.type$));
    return sys.Float.div(sys.Float.mult(sys.Float.plus(max, min), sys.Float.make(0.5)), sys.Float.make(255.0));
  }

  hash() {
    return sys.Int.xor(this.#rgb, sys.Int.shiftl(sys.Float.hash(this.#a), 24));
  }

  equals(that) {
    let x = sys.ObjUtil.as(that, Color.type$);
    if (x == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(x.#rgb, this.#rgb) && sys.ObjUtil.equals(x.#a, this.#a));
  }

  toStr() {
    if (sys.ObjUtil.compareGE(this.#a, sys.Float.make(1.0))) {
      return this.toHexStr();
    }
    ;
    let aStr = sys.Float.toLocale(this.#a, "0.##", sys.Locale.en());
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("rgba(", sys.ObjUtil.coerce(this.r(), sys.Obj.type$.toNullable())), ","), sys.ObjUtil.coerce(this.g(), sys.Obj.type$.toNullable())), ","), sys.ObjUtil.coerce(this.b(), sys.Obj.type$.toNullable())), ","), aStr), ")");
  }

  toHexStr() {
    let hex = sys.Int.toHex(this.#rgb, sys.ObjUtil.coerce(6, sys.Int.type$.toNullable()));
    if (sys.ObjUtil.compareGE(this.#a, sys.Float.make(1.0))) {
      if ((sys.ObjUtil.equals(sys.Str.get(hex, 0), sys.Str.get(hex, 1)) && sys.ObjUtil.equals(sys.Str.get(hex, 2), sys.Str.get(hex, 3)) && sys.ObjUtil.equals(sys.Str.get(hex, 4), sys.Str.get(hex, 5)))) {
        return sys.Str.plus(sys.Str.plus(sys.Str.plus("#", sys.Int.toChar(sys.Str.get(hex, 0))), sys.Int.toChar(sys.Str.get(hex, 2))), sys.Int.toChar(sys.Str.get(hex, 4)));
      }
      else {
        return sys.Str.plus("#", hex);
      }
      ;
    }
    ;
    let ahex = sys.Int.toHex(sys.Int.max(sys.Int.min(sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.mult(sys.Float.make(255.0), this.#a), sys.Num.type$)), 255), 0), sys.ObjUtil.coerce(2, sys.Int.type$.toNullable()));
    return sys.Str.plus(sys.Str.plus("#", hex), ahex);
  }

  isColorPaint() {
    return true;
  }

  asColorPaint() {
    return this;
  }

  isTransparent() {
    return sys.ObjUtil.compareLE(this.#a, sys.Float.make(0.0));
  }

  opacity(opacity) {
    if (opacity === undefined) opacity = sys.Float.make(1.0);
    return Color.make(this.#rgb, sys.Float.mult(this.#a, opacity));
  }

  lighter(percentage) {
    if (percentage === undefined) percentage = sys.Float.make(0.2);
    let l = sys.Float.min(sys.Float.max(sys.Float.plus(this.l(), percentage), sys.Float.make(0.0)), sys.Float.make(1.0));
    return Color.makeHsl(this.h(), this.s(), l);
  }

  darker(percentage) {
    if (percentage === undefined) percentage = sys.Float.make(0.2);
    return this.lighter(sys.Float.negate(percentage));
  }

  saturate(percentage) {
    if (percentage === undefined) percentage = sys.Float.make(0.2);
    let s = sys.Float.min(sys.Float.max(sys.Float.plus(this.s(), percentage), sys.Float.make(0.0)), sys.Float.make(1.0));
    return Color.makeHsl(this.h(), s, this.l());
  }

  desaturate(percentage) {
    if (percentage === undefined) percentage = sys.Float.make(0.2);
    return this.saturate(sys.Float.negate(percentage));
  }

  static interpolateRgb(a,b,t) {
    return Color.makeRgb(Color.interpolateByte(a.r(), b.r(), t), Color.interpolateByte(a.g(), b.g(), t), Color.interpolateByte(a.b(), b.b(), t), Color.interpolatePercent(a.#a, b.#a, t));
  }

  static interpolateHsl(a,b,t) {
    return Color.makeHsl(Color.interpolateDeg(a.h(), b.h(), t), Color.interpolatePercent(a.s(), b.s(), t), Color.interpolatePercent(a.l(), b.l(), t), Color.interpolatePercent(a.#a, b.#a, t));
  }

  static interpolateDeg(a,b,t) {
    return sys.Float.max(sys.Float.min(sys.Float.plus(a, sys.Float.mult(sys.Float.minus(b, a), t)), sys.Float.make(360.0)), sys.Float.make(0.0));
  }

  static interpolateByte(a,b,t) {
    return sys.Int.max(sys.Int.min(sys.Num.toInt(sys.ObjUtil.coerce(sys.Int.plusFloat(a, sys.Int.multFloat(sys.Int.minus(b, a), t)), sys.Num.type$)), 255), 0);
  }

  static interpolatePercent(a,b,t) {
    return sys.Float.max(sys.Float.min(sys.Float.plus(a, sys.Float.mult(sys.Float.minus(b, a), t)), sys.Float.make(1.0)), sys.Float.make(0.0));
  }

  static keywords() {
    return Color.byKeyword().keys();
  }

  static static$init() {
    const this$ = this;
    Color.#transparent = Color.make(0, sys.Float.make(0.0));
    Color.#black = Color.make(0, sys.Float.make(1.0));
    Color.#white = Color.make(16777215, sys.Float.make(1.0));
    if (true) {
      let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("graphics::Color")), (it) => {
        it.caseInsensitive(true);
        return;
      }), sys.Type.find("[sys::Str:graphics::Color]"));
      acc.set("black", Color.make(0));
      acc.set("silver", Color.make(12632256));
      acc.set("gray", Color.make(8421504));
      acc.set("white", Color.make(16777215));
      acc.set("maroon", Color.make(8388608));
      acc.set("red", Color.make(16711680));
      acc.set("purple", Color.make(8388736));
      acc.set("fuchsia", Color.make(16711935));
      acc.set("green", Color.make(32768));
      acc.set("lime", Color.make(65280));
      acc.set("olive", Color.make(8421376));
      acc.set("yellow", Color.make(16776960));
      acc.set("navy", Color.make(128));
      acc.set("blue", Color.make(255));
      acc.set("teal", Color.make(32896));
      acc.set("aqua", Color.make(65535));
      acc.set("orange", Color.make(16753920));
      acc.set("aliceblue", Color.make(15792383));
      acc.set("antiquewhite", Color.make(16444375));
      acc.set("aquamarine", Color.make(8388564));
      acc.set("azure", Color.make(15794175));
      acc.set("beige", Color.make(16119260));
      acc.set("bisque", Color.make(16770244));
      acc.set("blanchedalmond", Color.make(16772045));
      acc.set("blueviolet", Color.make(9055202));
      acc.set("brown", Color.make(10824234));
      acc.set("burlywood", Color.make(14596231));
      acc.set("cadetblue", Color.make(6266528));
      acc.set("chartreuse", Color.make(8388352));
      acc.set("chocolate", Color.make(13789470));
      acc.set("coral", Color.make(16744272));
      acc.set("cornflowerblue", Color.make(6591981));
      acc.set("cornsilk", Color.make(16775388));
      acc.set("crimson", Color.make(14423100));
      acc.set("cyan", Color.make(65535));
      acc.set("darkblue", Color.make(139));
      acc.set("darkcyan", Color.make(35723));
      acc.set("darkgoldenrod", Color.make(12092939));
      acc.set("darkgray", Color.make(11119017));
      acc.set("darkgreen", Color.make(25600));
      acc.set("darkgrey", Color.make(11119017));
      acc.set("darkkhaki", Color.make(12433259));
      acc.set("darkmagenta", Color.make(9109643));
      acc.set("darkolivegreen", Color.make(5597999));
      acc.set("darkorange", Color.make(16747520));
      acc.set("darkorchid", Color.make(10040012));
      acc.set("darkred", Color.make(9109504));
      acc.set("darksalmon", Color.make(15308410));
      acc.set("darkseagreen", Color.make(9419919));
      acc.set("darkslateblue", Color.make(4734347));
      acc.set("darkslategray", Color.make(3100495));
      acc.set("darkslategrey", Color.make(3100495));
      acc.set("darkturquoise", Color.make(52945));
      acc.set("darkviolet", Color.make(9699539));
      acc.set("deeppink", Color.make(16716947));
      acc.set("deepskyblue", Color.make(49151));
      acc.set("dimgray", Color.make(6908265));
      acc.set("dimgrey", Color.make(6908265));
      acc.set("dodgerblue", Color.make(2003199));
      acc.set("firebrick", Color.make(11674146));
      acc.set("floralwhite", Color.make(16775920));
      acc.set("forestgreen", Color.make(2263842));
      acc.set("gainsboro", Color.make(14474460));
      acc.set("ghostwhite", Color.make(16316671));
      acc.set("gold", Color.make(16766720));
      acc.set("goldenrod", Color.make(14329120));
      acc.set("greenyellow", Color.make(11403055));
      acc.set("grey", Color.make(8421504));
      acc.set("honeydew", Color.make(15794160));
      acc.set("hotpink", Color.make(16738740));
      acc.set("indianred", Color.make(13458524));
      acc.set("indigo", Color.make(4915330));
      acc.set("ivory", Color.make(16777200));
      acc.set("khaki", Color.make(15787660));
      acc.set("lavender", Color.make(15132410));
      acc.set("lavenderblush", Color.make(16773365));
      acc.set("lawngreen", Color.make(8190976));
      acc.set("lemonchiffon", Color.make(16775885));
      acc.set("lightblue", Color.make(11393254));
      acc.set("lightcoral", Color.make(15761536));
      acc.set("lightcyan", Color.make(14745599));
      acc.set("lightgoldenrodyellow", Color.make(16448210));
      acc.set("lightgray", Color.make(13882323));
      acc.set("lightgreen", Color.make(9498256));
      acc.set("lightgrey", Color.make(13882323));
      acc.set("lightpink", Color.make(16758465));
      acc.set("lightsalmon", Color.make(16752762));
      acc.set("lightseagreen", Color.make(2142890));
      acc.set("lightskyblue", Color.make(8900346));
      acc.set("lightslategray", Color.make(7833753));
      acc.set("lightslategrey", Color.make(7833753));
      acc.set("lightsteelblue", Color.make(11584734));
      acc.set("lightyellow", Color.make(16777184));
      acc.set("limegreen", Color.make(3329330));
      acc.set("linen", Color.make(16445670));
      acc.set("mediumaquamarine", Color.make(6737322));
      acc.set("mediumblue", Color.make(205));
      acc.set("mediumorchid", Color.make(12211667));
      acc.set("mediumpurple", Color.make(9662683));
      acc.set("mediumseagreen", Color.make(3978097));
      acc.set("mediumslateblue", Color.make(8087790));
      acc.set("mediumspringgreen", Color.make(64154));
      acc.set("mediumturquoise", Color.make(4772300));
      acc.set("mediumvioletred", Color.make(13047173));
      acc.set("midnightblue", Color.make(1644912));
      acc.set("mintcream", Color.make(16121850));
      acc.set("mistyrose", Color.make(16770273));
      acc.set("moccasin", Color.make(16770229));
      acc.set("navajowhite", Color.make(16768685));
      acc.set("oldlace", Color.make(16643558));
      acc.set("olivedrab", Color.make(7048739));
      acc.set("orangered", Color.make(16729344));
      acc.set("orchid", Color.make(14315734));
      acc.set("palegoldenrod", Color.make(15657130));
      acc.set("palegreen", Color.make(10025880));
      acc.set("paleturquoise", Color.make(11529966));
      acc.set("palevioletred", Color.make(14381203));
      acc.set("papayawhip", Color.make(16773077));
      acc.set("peachpuff", Color.make(16767673));
      acc.set("peru", Color.make(13468991));
      acc.set("pink", Color.make(16761035));
      acc.set("plum", Color.make(14524637));
      acc.set("powderblue", Color.make(11591910));
      acc.set("rosybrown", Color.make(12357519));
      acc.set("royalblue", Color.make(4286945));
      acc.set("saddlebrown", Color.make(9127187));
      acc.set("salmon", Color.make(16416882));
      acc.set("sandybrown", Color.make(16032864));
      acc.set("seagreen", Color.make(3050327));
      acc.set("seashell", Color.make(16774638));
      acc.set("sienna", Color.make(10506797));
      acc.set("skyblue", Color.make(8900331));
      acc.set("slateblue", Color.make(6970061));
      acc.set("slategray", Color.make(7372944));
      acc.set("slategrey", Color.make(7372944));
      acc.set("snow", Color.make(16775930));
      acc.set("springgreen", Color.make(65407));
      acc.set("steelblue", Color.make(4620980));
      acc.set("tan", Color.make(13808780));
      acc.set("thistle", Color.make(14204888));
      acc.set("tomato", Color.make(16737095));
      acc.set("transparent", Color.#transparent);
      acc.set("turquoise", Color.make(4251856));
      acc.set("violet", Color.make(15631086));
      acc.set("wheat", Color.make(16113331));
      acc.set("whitesmoke", Color.make(16119285));
      acc.set("yellowgreen", Color.make(10145074));
      acc.set("rebeccapurple", Color.make(6697881));
      Color.#byKeyword = sys.ObjUtil.coerce(((this$) => { let $_u5 = acc; if ($_u5 == null) return null; return sys.ObjUtil.toImmutable(acc); })(this), sys.Type.find("[sys::Str:graphics::Color]"));
    }
    ;
    return;
  }

}

class Font extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#names = sys.ObjUtil.coerce(((this$) => { let $_u6 = sys.List.make(sys.Str.type$, ["sans-serif"]); if ($_u6 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$, ["sans-serif"])); })(this), sys.Type.find("sys::Str[]"));
    this.#size = sys.Float.make(11.0);
    this.#weight = FontWeight.normal();
    this.#style = FontStyle.normal();
    return;
  }

  typeof() { return Font.type$; }

  #names = null;

  names() { return this.#names; }

  __names(it) { if (it === undefined) return this.#names; else this.#names = it; }

  #size = sys.Float.make(0);

  size() { return this.#size; }

  __size(it) { if (it === undefined) return this.#size; else this.#size = it; }

  #weight = null;

  weight() { return this.#weight; }

  __weight(it) { if (it === undefined) return this.#weight; else this.#weight = it; }

  #style = null;

  style() { return this.#style; }

  __style(it) { if (it === undefined) return this.#style; else this.#style = it; }

  #data = null;

  // private field reflection only
  __data(it) { if (it === undefined) return this.#data; else this.#data = it; }

  static make(f) {
    const $self = new Font();
    Font.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ;
    sys.Func.call(f, $self);
    return;
  }

  static makeFields(names,size,weight,style) {
    const $self = new Font();
    Font.makeFields$($self,names,size,weight,style);
    return $self;
  }

  static makeFields$($self,names,size,weight,style) {
    if (weight === undefined) weight = FontWeight.normal();
    if (style === undefined) style = FontStyle.normal();
    ;
    if (names.isEmpty()) {
      throw sys.ArgErr.make("No names specified");
    }
    ;
    $self.#names = sys.ObjUtil.coerce(((this$) => { let $_u7 = names; if ($_u7 == null) return null; return sys.ObjUtil.toImmutable(names); })($self), sys.Type.find("sys::Str[]"));
    $self.#size = size;
    $self.#weight = weight;
    $self.#style = style;
    $self.#data = FontData.find($self);
    return;
  }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    try {
      let toks = sys.Str.split(s);
      let toki = 0;
      let style = FontStyle.decode(toks.get(toki), false);
      if (style != null) {
        ((this$) => { let $_u8 = toki;toki = sys.Int.increment(toki); return $_u8; })(this);
      }
      else {
        (style = FontStyle.normal());
      }
      ;
      let weight = FontWeight.decode(toks.get(toki), false);
      if (weight != null) {
        ((this$) => { let $_u9 = toki;toki = sys.Int.increment(toki); return $_u9; })(this);
      }
      else {
        (weight = FontWeight.normal());
      }
      ;
      if (!sys.Str.endsWith(toks.get(toki), "pt")) {
        throw sys.Err.make();
      }
      ;
      let size = sys.Str.toFloat(sys.Str.getRange(toks.get(toki), sys.Range.make(0, -3)));
      ((this$) => { let $_u10 = toki;toki = sys.Int.increment(toki); return $_u10; })(this);
      let names = Font.decodeNames(toks.getRange(sys.Range.make(toki, -1)).join(" "));
      return Font.makeFields(names, sys.ObjUtil.coerce(size, sys.Float.type$), sys.ObjUtil.coerce(weight, FontWeight.type$), sys.ObjUtil.coerce(style, FontStyle.type$));
    }
    catch ($_u11) {
      $_u11 = sys.Err.make($_u11);
      if ($_u11 instanceof sys.Err) {
        let e = $_u11;
        ;
      }
      else {
        throw $_u11;
      }
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(sys.Str.plus("Invalid Font: ", s));
    }
    ;
    return null;
  }

  static decodeNames(s) {
    return sys.Str.split(s, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
  }

  static decodeSize(s) {
    if (!sys.Str.endsWith(s, "pt")) {
      throw sys.Err.make(sys.Str.plus("Invalid font size: ", s));
    }
    ;
    return sys.ObjUtil.coerce(sys.Str.toFloat(sys.Str.getRange(s, sys.Range.make(0, -3))), sys.Float.type$);
  }

  static decodeWeight(s) {
    return sys.ObjUtil.coerce(FontWeight.decode(s), FontWeight.type$);
  }

  static decodeStyle(s) {
    return sys.ObjUtil.coerce(FontStyle.decode(s), FontStyle.type$);
  }

  static fromProps(props) {
    if (props.get("font-family") == null) {
      return null;
    }
    ;
    return Font.makeFields(Font.decodeNames(sys.ObjUtil.coerce(((this$) => { let $_u12 = props.get("font-family"); if ($_u12 != null) return $_u12; return "sans-serif"; })(this), sys.Str.type$)), Font.decodeSize(sys.ObjUtil.coerce(((this$) => { let $_u13 = props.get("font-size"); if ($_u13 != null) return $_u13; return "12pt"; })(this), sys.Str.type$)), Font.decodeWeight(sys.ObjUtil.coerce(((this$) => { let $_u14 = props.get("font-weight"); if ($_u14 != null) return $_u14; return "normal"; })(this), sys.Str.type$)), Font.decodeStyle(sys.ObjUtil.coerce(((this$) => { let $_u15 = props.get("font-style"); if ($_u15 != null) return $_u15; return "normal"; })(this), sys.Str.type$)));
  }

  toProps() {
    const this$ = this;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"));
    acc.set("font-family", this.#names.join(","));
    acc.set("font-size", sys.Str.plus(GeomUtil.formatFloat(this.#size), "pt"));
    if (!this.#weight.isNormal()) {
      acc.set("font-weight", sys.Int.toStr(this.#weight.num()));
    }
    ;
    if (!this.#style.isNormal()) {
      acc.set("font-style", this.#style.name());
    }
    ;
    return acc;
  }

  name() {
    return sys.ObjUtil.coerce(this.#names.first(), sys.Str.type$);
  }

  hash() {
    return sys.Int.xor(sys.Int.xor(sys.Int.xor(this.#names.hash(), sys.Float.hash(this.#size)), sys.Int.mult(sys.ObjUtil.hash(this.#weight), 73)), sys.Int.mult(sys.ObjUtil.hash(this.#style), 19));
  }

  equals(that) {
    let x = sys.ObjUtil.as(that, Font.type$);
    if (x == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#names, x.#names) && sys.ObjUtil.equals(this.#size, x.#size) && sys.ObjUtil.equals(this.#weight, x.#weight) && sys.ObjUtil.equals(this.#style, x.#style));
  }

  toStr() {
    let s = sys.StrBuf.make();
    if (!this.#style.isNormal()) {
      s.add(this.#style.name()).addChar(32);
    }
    ;
    if (!this.#weight.isNormal()) {
      s.add(sys.ObjUtil.coerce(this.#weight.num(), sys.Obj.type$.toNullable())).addChar(32);
    }
    ;
    s.add(GeomUtil.formatFloat(this.#size)).add("pt").addChar(32);
    s.add(this.#names.join(","));
    return s.toStr();
  }

  toSize(size) {
    if (sys.ObjUtil.equals(this.#size, size)) {
      return this;
    }
    ;
    return Font.makeFields(this.#names, size, this.#weight, this.#style);
  }

  toStyle(style) {
    if (sys.ObjUtil.equals(this.#style, style)) {
      return this;
    }
    ;
    return Font.makeFields(this.#names, this.#size, this.#weight, style);
  }

  toWeight(weight) {
    if (sys.ObjUtil.equals(this.#weight, weight)) {
      return this;
    }
    ;
    return Font.makeFields(this.#names, this.#size, weight, this.#style);
  }

  normalize() {
    if (this.#data != null) {
      return this;
    }
    ;
    return FontData.normalize(this);
  }

  metrics(dc) {
    if (dc === undefined) dc = DeviceContext.cur();
    if (this.#data == null) {
      throw sys.UnsupportedErr.make(sys.Str.plus("FontMetrics not supported: ", this));
    }
    ;
    return FontDataMetrics.make(dc, this.#size, sys.ObjUtil.coerce(this.#data, FontData.type$));
  }

}

class FontMetrics extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FontMetrics.type$; }

  static make() {
    const $self = new FontMetrics();
    FontMetrics.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class FontDataMetrics extends FontMetrics {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FontDataMetrics.type$; }

  static #fudge = undefined;

  static fudge() {
    if (FontDataMetrics.#fudge === undefined) {
      FontDataMetrics.static$init();
      if (FontDataMetrics.#fudge === undefined) FontDataMetrics.#fudge = sys.Float.make(0);
    }
    return FontDataMetrics.#fudge;
  }

  #data = null;

  // private field reflection only
  __data(it) { if (it === undefined) return this.#data; else this.#data = it; }

  #size = sys.Float.make(0);

  // private field reflection only
  __size(it) { if (it === undefined) return this.#size; else this.#size = it; }

  #ratio = sys.Float.make(0);

  // private field reflection only
  __ratio(it) { if (it === undefined) return this.#ratio; else this.#ratio = it; }

  static make(dc,size,data) {
    const $self = new FontDataMetrics();
    FontDataMetrics.make$($self,dc,size,data);
    return $self;
  }

  static make$($self,dc,size,data) {
    FontMetrics.make$($self);
    $self.#data = data;
    $self.#size = size;
    $self.#ratio = sys.Float.div(sys.Float.mult(sys.Float.mult(sys.Float.div(dc.dpi(), sys.Float.make(72.0)), FontDataMetrics.fudge()), size), sys.Float.make(1000.0));
    return;
  }

  height() {
    return sys.Float.round(sys.Int.multFloat(this.#data.height(), this.#ratio));
  }

  ascent() {
    return sys.Float.round(sys.Int.multFloat(this.#data.ascent(), this.#ratio));
  }

  descent() {
    return sys.Float.round(sys.Int.multFloat(this.#data.descent(), this.#ratio));
  }

  leading() {
    return sys.Float.round(sys.Int.multFloat(this.#data.leading(), this.#ratio));
  }

  width(s) {
    let d = this.#data;
    let w = 0;
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(s)); i = sys.Int.increment(i)) {
      w = sys.Int.plus(w, d.charWidth(sys.Str.get(s, i)));
    }
    ;
    return sys.Float.round(sys.Float.mult(sys.Num.toFloat(sys.ObjUtil.coerce(w, sys.Num.type$)), this.#ratio));
  }

  lastChar() {
    return this.#data.lastChar();
  }

  static static$init() {
    FontDataMetrics.#fudge = sys.Float.make(1.02);
    return;
  }

}

class FontWeight extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FontWeight.type$; }

  static thin() { return FontWeight.vals().get(0); }

  static extraLight() { return FontWeight.vals().get(1); }

  static light() { return FontWeight.vals().get(2); }

  static normal() { return FontWeight.vals().get(3); }

  static medium() { return FontWeight.vals().get(4); }

  static semiBold() { return FontWeight.vals().get(5); }

  static bold() { return FontWeight.vals().get(6); }

  static extraBold() { return FontWeight.vals().get(7); }

  static black() { return FontWeight.vals().get(8); }

  static #vals = undefined;

  #num = 0;

  num() { return this.#num; }

  __num(it) { if (it === undefined) return this.#num; else this.#num = it; }

  isNormal() {
    return this === FontWeight.normal();
  }

  static fromNum(num,checked) {
    if (checked === undefined) checked = true;
    let $_u16 = num;
    if (sys.ObjUtil.equals($_u16, 100)) {
      return FontWeight.thin();
    }
    else if (sys.ObjUtil.equals($_u16, 200)) {
      return FontWeight.extraLight();
    }
    else if (sys.ObjUtil.equals($_u16, 300)) {
      return FontWeight.light();
    }
    else if (sys.ObjUtil.equals($_u16, 400)) {
      return FontWeight.normal();
    }
    else if (sys.ObjUtil.equals($_u16, 500)) {
      return FontWeight.medium();
    }
    else if (sys.ObjUtil.equals($_u16, 600)) {
      return FontWeight.semiBold();
    }
    else if (sys.ObjUtil.equals($_u16, 700)) {
      return FontWeight.bold();
    }
    else if (sys.ObjUtil.equals($_u16, 800)) {
      return FontWeight.extraBold();
    }
    else if (sys.ObjUtil.equals($_u16, 900)) {
      return FontWeight.black();
    }
    ;
    if (checked) {
      throw sys.ArgErr.make(sys.Str.plus("Invalid FontWeight num: ", sys.ObjUtil.coerce(num, sys.Obj.type$.toNullable())));
    }
    ;
    return null;
  }

  static decode(s,checked) {
    if (checked === undefined) checked = true;
    try {
      let val = FontWeight.fromStr(s, false);
      if (val != null) {
        return val;
      }
      ;
      return FontWeight.fromNum(sys.ObjUtil.coerce(sys.Str.toInt(s), sys.Int.type$));
    }
    catch ($_u17) {
      $_u17 = sys.Err.make($_u17);
      if ($_u17 instanceof sys.Err) {
        let e = $_u17;
        ;
      }
      else {
        throw $_u17;
      }
    }
    ;
    if (checked) {
      throw sys.ArgErr.make(sys.Str.plus("Invalid FontWeight: ", s));
    }
    ;
    return null;
  }

  static make($ordinal,$name,num) {
    const $self = new FontWeight();
    FontWeight.make$($self,$ordinal,$name,num);
    return $self;
  }

  static make$($self,$ordinal,$name,num) {
    sys.Enum.make$($self, $ordinal, $name);
    $self.#num = num;
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(FontWeight.type$, FontWeight.vals(), name$, checked);
  }

  static vals() {
    if (FontWeight.#vals == null) {
      FontWeight.#vals = sys.List.make(FontWeight.type$, [
        FontWeight.make(0, "thin", 100),
        FontWeight.make(1, "extraLight", 200),
        FontWeight.make(2, "light", 300),
        FontWeight.make(3, "normal", 400),
        FontWeight.make(4, "medium", 500),
        FontWeight.make(5, "semiBold", 600),
        FontWeight.make(6, "bold", 700),
        FontWeight.make(7, "extraBold", 800),
        FontWeight.make(8, "black", 900),
      ]).toImmutable();
    }
    return FontWeight.#vals;
  }

  static static$init() {
    const $_u18 = FontWeight.vals();
    if (true) {
    }
    ;
    return;
  }

}

class FontStyle extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FontStyle.type$; }

  static normal() { return FontStyle.vals().get(0); }

  static italic() { return FontStyle.vals().get(1); }

  static oblique() { return FontStyle.vals().get(2); }

  static #vals = undefined;

  isNormal() {
    return this === FontStyle.normal();
  }

  static decode(s,checked) {
    if (checked === undefined) checked = true;
    return FontStyle.fromStr(s, checked);
  }

  static make($ordinal,$name) {
    const $self = new FontStyle();
    FontStyle.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(FontStyle.type$, FontStyle.vals(), name$, checked);
  }

  static vals() {
    if (FontStyle.#vals == null) {
      FontStyle.#vals = sys.List.make(FontStyle.type$, [
        FontStyle.make(0, "normal", ),
        FontStyle.make(1, "italic", ),
        FontStyle.make(2, "oblique", ),
      ]).toImmutable();
    }
    return FontStyle.#vals;
  }

  static static$init() {
    const $_u19 = FontStyle.vals();
    if (true) {
    }
    ;
    return;
  }

}

class Image {
  constructor() {
    const this$ = this;
  }

  typeof() { return Image.type$; }

  static #mimePng = undefined;

  static mimePng() {
    if (Image.#mimePng === undefined) {
      Image.static$init();
      if (Image.#mimePng === undefined) Image.#mimePng = null;
    }
    return Image.#mimePng;
  }

  static #mimeGif = undefined;

  static mimeGif() {
    if (Image.#mimeGif === undefined) {
      Image.static$init();
      if (Image.#mimeGif === undefined) Image.#mimeGif = null;
    }
    return Image.#mimeGif;
  }

  static #mimeJpeg = undefined;

  static mimeJpeg() {
    if (Image.#mimeJpeg === undefined) {
      Image.static$init();
      if (Image.#mimeJpeg === undefined) Image.#mimeJpeg = null;
    }
    return Image.#mimeJpeg;
  }

  static #mimeSvg = undefined;

  static mimeSvg() {
    if (Image.#mimeSvg === undefined) {
      Image.static$init();
      if (Image.#mimeSvg === undefined) Image.#mimeSvg = null;
    }
    return Image.#mimeSvg;
  }

  static render(mime,size,f) {
    try {
      let env = sys.ObjUtil.coerce(sys.Type.find("graphicsJava::Java2DGraphicsEnv").make(), GraphicsEnv.type$);
      return env.renderImage(mime, size, f);
    }
    catch ($_u20) {
      throw sys.UnsupportedErr.make("Image.render not supported in this env");
    }
    ;
  }

  w() {
    return this.size().w();
  }

  h() {
    return this.size().h();
  }

  write(out) {
    throw sys.UnsupportedErr.make("Image.write not supported in this env");
  }

  static mimeForExt(ext) {
    (ext = sys.Str.lower(ext));
    if (sys.ObjUtil.equals(ext, "svg")) {
      return Image.mimeSvg();
    }
    ;
    if (sys.ObjUtil.equals(ext, "png")) {
      return Image.mimePng();
    }
    ;
    if ((sys.ObjUtil.equals(ext, "jpg") || sys.ObjUtil.equals(ext, "jpeg"))) {
      return Image.mimeJpeg();
    }
    ;
    if (sys.ObjUtil.equals(ext, "gif")) {
      return Image.mimeGif();
    }
    ;
    return sys.ObjUtil.coerce(((this$) => { let $_u21 = sys.MimeType.forExt(ext); if ($_u21 != null) return $_u21; return sys.MimeType.fromStr("image/unknown"); })(this), sys.MimeType.type$);
  }

  static static$init() {
    Image.#mimePng = sys.ObjUtil.coerce(sys.MimeType.fromStr("image/png"), sys.MimeType.type$);
    Image.#mimeGif = sys.ObjUtil.coerce(sys.MimeType.fromStr("image/gif"), sys.MimeType.type$);
    Image.#mimeJpeg = sys.ObjUtil.coerce(sys.MimeType.fromStr("image/jpeg"), sys.MimeType.type$);
    Image.#mimeSvg = sys.ObjUtil.coerce(sys.MimeType.fromStr("image/svg+xml"), sys.MimeType.type$);
    return;
  }

}

class PngImage {
  constructor() {
    const this$ = this;
  }

  typeof() { return PngImage.type$; }

  static mimeGif() { return Image.mimeGif(); }

  write() { return Image.prototype.write.apply(this, arguments); }

  h() { return Image.prototype.h.apply(this, arguments); }

  static mimeSvg() { return Image.mimeSvg(); }

  static mimePng() { return Image.mimePng(); }

  w() { return Image.prototype.w.apply(this, arguments); }

  static mimeJpeg() { return Image.mimeJpeg(); }

  hasAlpha() {
    return (sys.ObjUtil.equals(this.colorType(), 4) || sys.ObjUtil.equals(this.colorType(), 6));
  }

  hasPalette() {
    return sys.ObjUtil.compareGT(this.palette().size(), 0);
  }

  hasTransparency() {
    return sys.ObjUtil.compareGT(this.transparency().size(), 0);
  }

  colorType() {
    return sys.ObjUtil.coerce(this.get("colorType"), sys.Int.type$);
  }

  colors() {
    let c = ((this$) => { if ((sys.ObjUtil.equals(this$.colorType(), 2) || sys.ObjUtil.equals(this$.colorType(), 6))) return 3; return 1; })(this);
    return ((this$) => { if (this$.hasAlpha()) return sys.Int.plus(c, 1); return c; })(this);
  }

  pixelBits() {
    return sys.Int.mult(this.colors(), sys.ObjUtil.coerce(this.get("colorSpaceBits"), sys.Int.type$));
  }

  palette() {
    return sys.ObjUtil.coerce(this.get("palette"), sys.Buf.type$);
  }

  transparency() {
    return sys.ObjUtil.coerce(this.get("transparency"), sys.Buf.type$);
  }

  imgData() {
    return sys.ObjUtil.coerce(this.get("imgData"), sys.Buf.type$);
  }

}

class DeviceContext extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DeviceContext.type$; }

  static #curRef = undefined;

  static curRef() {
    if (DeviceContext.#curRef === undefined) {
      DeviceContext.static$init();
      if (DeviceContext.#curRef === undefined) DeviceContext.#curRef = null;
    }
    return DeviceContext.#curRef;
  }

  #dpi = sys.Float.make(0);

  dpi() { return this.#dpi; }

  __dpi(it) { if (it === undefined) return this.#dpi; else this.#dpi = it; }

  static cur() {
    return DeviceContext.curRef();
  }

  static make(dpi) {
    const $self = new DeviceContext();
    DeviceContext.make$($self,dpi);
    return $self;
  }

  static make$($self,dpi) {
    $self.#dpi = dpi;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("DeviceContext { dpi=", sys.ObjUtil.coerce(this.#dpi, sys.Obj.type$.toNullable())), " }");
  }

  static static$init() {
    DeviceContext.#curRef = DeviceContext.make(sys.Float.make(96.0));
    return;
  }

}

class FontData extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FontData.type$; }

  static #registry = undefined;

  static registry() {
    if (FontData.#registry === undefined) {
      FontData.static$init();
      if (FontData.#registry === undefined) FontData.#registry = null;
    }
    return FontData.#registry;
  }

  #key = null;

  key() { return this.#key; }

  __key(it) { if (it === undefined) return this.#key; else this.#key = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #weight = null;

  weight() { return this.#weight; }

  __weight(it) { if (it === undefined) return this.#weight; else this.#weight = it; }

  #style = null;

  style() { return this.#style; }

  __style(it) { if (it === undefined) return this.#style; else this.#style = it; }

  #height = 0;

  height() { return this.#height; }

  __height(it) { if (it === undefined) return this.#height; else this.#height = it; }

  #leading = 0;

  leading() { return this.#leading; }

  __leading(it) { if (it === undefined) return this.#leading; else this.#leading = it; }

  #ascent = 0;

  ascent() { return this.#ascent; }

  __ascent(it) { if (it === undefined) return this.#ascent; else this.#ascent = it; }

  #descent = 0;

  descent() { return this.#descent; }

  __descent(it) { if (it === undefined) return this.#descent; else this.#descent = it; }

  #widths = null;

  widths() { return this.#widths; }

  __widths(it) { if (it === undefined) return this.#widths; else this.#widths = it; }

  #charToWidth = null;

  // private field reflection only
  __charToWidth(it) { if (it === undefined) return this.#charToWidth; else this.#charToWidth = it; }

  #lastChar = 0;

  lastChar() { return this.#lastChar; }

  __lastChar(it) { if (it === undefined) return this.#lastChar; else this.#lastChar = it; }

  static find(f) {
    return FontData.registry().get(FontData.toKey(f.style(), f.weight(), f.name()));
  }

  static register(acc,m) {
    acc.set(m.#key, m);
    return;
  }

  static toKey(style,weight,name) {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", style), " "), sys.ObjUtil.coerce(weight.num(), sys.Obj.type$.toNullable())), " "), name);
  }

  static make(key,ascent,descent,widths,charToWidth) {
    const $self = new FontData();
    FontData.make$($self,key,ascent,descent,widths,charToWidth);
    return $self;
  }

  static make$($self,key,ascent,descent,widths,charToWidth) {
    let toks = sys.Str.split(key);
    $self.#style = sys.ObjUtil.coerce(FontStyle.decode(toks.get(0)), FontStyle.type$);
    $self.#weight = sys.ObjUtil.coerce(FontWeight.decode(toks.get(1)), FontWeight.type$);
    $self.#name = sys.Str.replace(toks.get(2), "-", " ");
    $self.#key = FontData.toKey($self.#style, $self.#weight, $self.#name);
    $self.#ascent = ascent;
    $self.#descent = descent;
    $self.#leading = descent;
    $self.#height = sys.Int.plus(sys.Int.plus($self.#leading, ascent), descent);
    $self.#widths = sys.ObjUtil.coerce(((this$) => { let $_u24 = widths; if ($_u24 == null) return null; return sys.ObjUtil.toImmutable(widths); })($self), sys.Type.find("sys::Int[]"));
    $self.#charToWidth = charToWidth;
    $self.#lastChar = sys.Int.plus(sys.Str.size(charToWidth), 32);
    return;
  }

  static normalize(f) {
    let m = null;
    for (let i = 0; sys.ObjUtil.compareLT(i, f.names().size()); i = sys.Int.increment(i)) {
      (m = FontData.toNormalize(f.style(), f.weight(), f.names().get(i)));
      if (m != null) {
        break;
      }
      ;
    }
    ;
    if (m == null) {
      (m = FontData.registry().getChecked("normal 400 Helvetica"));
    }
    ;
    return Font.makeFields(sys.List.make(sys.Str.type$, [m.#name]), f.size(), m.#weight, m.#style);
  }

  static toNormalize(style,weight,name) {
    let m = FontData.registry().get(FontData.toKey(style, weight, name));
    if (m != null) {
      return m;
    }
    ;
    if (sys.ObjUtil.compareLT(weight.num(), 400)) {
      (weight = FontWeight.normal());
    }
    else {
      if (sys.ObjUtil.compareGT(weight.num(), 400)) {
        (weight = FontWeight.bold());
      }
      ;
    }
    ;
    (m = FontData.registry().get(FontData.toKey(style, weight, name)));
    if (m != null) {
      return m;
    }
    ;
    if (sys.ObjUtil.equals(style, FontStyle.oblique())) {
      (m = FontData.registry().get(FontData.toKey(FontStyle.italic(), weight, name)));
      if (m != null) {
        return m;
      }
      ;
    }
    ;
    return FontData.registry().get(FontData.toKey(FontStyle.normal(), FontWeight.normal(), name));
  }

  charWidth(ch) {
    if (sys.ObjUtil.compareLT(ch, 32)) {
      return 0;
    }
    ;
    if (sys.ObjUtil.compareLT(ch, this.#lastChar)) {
      let index = sys.Int.minus(sys.Str.get(this.#charToWidth, sys.Int.minus(ch, 32)), 37);
      return this.#widths.get(index);
    }
    ;
    if (sys.ObjUtil.equals(ch, 8226)) {
      return this.charWidth(42);
    }
    ;
    if ((sys.ObjUtil.compareLE(8320, ch) && sys.ObjUtil.compareLE(ch, 8329))) {
      return this.charWidth(179);
    }
    ;
    return this.charWidth(109);
  }

  static static$init() {
    const this$ = this;
    if (true) {
      let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("graphics::FontData")), (it) => {
        it.ordered(true);
        return;
      }), sys.Type.find("[sys::Str:graphics::FontData]"));
      try {
        FontData.register(acc, FontData.make("normal 400 Helvetica", 770, 230, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(191, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(222, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(260, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(278, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(334, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(355, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(365, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(370, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(389, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(469, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(500, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(537, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(549, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(556, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(576, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(584, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(611, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(667, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(722, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(737, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(778, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(834, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(889, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(944, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1015, sys.Obj.type$.toNullable())]), "))+44=8&**.6)*))4444444444))6664@889987;9)184<9;8;98798>887)))04*44144)44''1'<4444*1)419111*(*6%%%%%%?%%%%%%%%%%%%%%%%%%%%%%%%%%)*4444(4*:-46%:*/3***52)**,4<<<7888888?98888))))99;;;;;6;9999887444444=14444))))4444444374444141"));
        FontData.register(acc, FontData.make("normal 700 Helvetica", 770, 230, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(238, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(280, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(333, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(365, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(370, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(389, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(474, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(500, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(549, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(556, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(576, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(584, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(611, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(667, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(722, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(737, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(778, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(834, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(889, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(944, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(975, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable())]), "'(-0095&((+2'(''0000000000((2223;55554375'0538574754354:443('(20(03030(33''0'93333+0(30700.+'+2%%%%%%<%%%%%%%%%%%%%%%%%%%%%%%%%%'(0000'0(6*02%6(,/(((10'(()08883555555<54444''''5577777275555443000000900000''''3333333/33333030"));
        FontData.register(acc, FontData.make("italic 400 Helvetica", 770, 230, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(191, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(222, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(260, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(278, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(334, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(355, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(365, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(370, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(389, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(469, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(500, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(537, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(549, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(556, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(576, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(584, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(611, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(667, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(722, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(737, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(778, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(834, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(889, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(944, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1015, sys.Obj.type$.toNullable())]), "))+44=8&**.6)*))4444444444))6664@889987;9)184<9;8;98798>887)))04*44144)44''1'<4444*1)419111*(*6%%%%%%?%%%%%%%%%%%%%%%%%%%%%%%%%%)*4444(4*:-46%:*/3***52)**,4<<<7888888?98888))))99;;;;;6;9999887444444=14444))))4444444374444141"));
        FontData.register(acc, FontData.make("italic 700 Helvetica", 770, 230, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(238, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(280, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(333, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(365, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(370, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(389, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(474, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(500, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(549, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(556, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(576, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(584, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(611, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(667, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(722, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(737, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(778, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(834, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(889, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(944, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(975, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable())]), "'(-0095&((+2'(''0000000000((2223;55554375'0538574754354:443('(20(03030(33''0'93333+0(30700.+'+2%%%%%%<%%%%%%%%%%%%%%%%%%%%%%%%%%'(0000'0(6*02%6(,/(((10'(()08883555555<54444''''5577777275555443000000900000''''3333333/33333030"));
        FontData.register(acc, FontData.make("normal 300 Roboto", 967, 211, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(170, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(191, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(195, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(210, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(217, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(223, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(226, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(228, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(240, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(246, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(266, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(281, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(287, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(321, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(326, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(331, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(336, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(361, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(378, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(397, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(416, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(427, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(432, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(442, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(453, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(456, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(459, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(475, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(481, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(486, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(490, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(506, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(511, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(516, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(518, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(523, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(530, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(536, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(545, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(550, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(554, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(556, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(558, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(562, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(564, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(569, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(571, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(582, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(586, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(593, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(598, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(599, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(605, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(613, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(616, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(617, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(625, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(631, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(635, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(649, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(657, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(669, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(677, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(685, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(710, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(725, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(739, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(756, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(776, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(802, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(846, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(865, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(886, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(896, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(913, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable())]), "/,2UNh\\&34;R'2.9NNNNNNNNNN)(FNH?p^[abSQef0M_Jmfd\\d`WXb]o[YX.9.:<2KNGOH5OM,-D,nMQNP6E3MBiCAC5+5e%%%%%%q%%%%%%%%%%%%%%%%%%%%%%%%%%/+LTgG*Z<k=?L%k;8J771PA//7>>gij@^^^^^^paSSSS0000cfdddddIdbbbbYWVKKKKKKlGHHHH++++UMQQQQQSPMMMMAQA"));
        FontData.register(acc, FontData.make("normal 400 Roboto", 967, 211, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(174, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(196, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(211, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(240, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(243, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(247, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(248, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(257, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(263, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(265, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(272, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(276, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(309, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(313, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(320, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(327, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(338, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(342, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(348, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(367, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(374, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(412, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(418, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(431, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(447, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(451, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(458, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(472, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(473, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(484, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(489, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(496, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(508, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(516, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(523, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(525, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(533, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(534, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(538, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(547, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(551, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(553, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(554, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(562, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(566, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(568, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(571, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(576, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(581, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(586, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(593, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(597, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(601, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(616, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(623, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(627, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(631, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(636, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(651, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(652, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(656, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(670, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(681, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(687, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(713, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(732, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(751, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(778, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(786, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(844, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(876, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(887, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(898, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(935, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable())]), ",-4[Qg\\&78=S'1.;QQQQQQQQQQ*(FNHAna\\`bSOdf0O]Llfe^e[XY`_m]ZZ/;/<?2MQHRJ8QN*)F*lOTQS6G5NChEBE6+6d%%%%%%p%%%%%%%%%%%%%%%%%%%%%%%%%%,+MVfI)[<j>AP%j@:K993RD.,9@AgiiBaaaaaao`SSSS0000cfeeeeeJe````ZXYMMMMMMkHJJJJ++++WOTTTTTTRNNNNBUB"));
        FontData.register(acc, FontData.make("normal 500 Roboto", 967, 211, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(169, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(220, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(238, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(249, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(251, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(258, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(265, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(268, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(274, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(282, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(324, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(328, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(335, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(352, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(354, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(370, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(380, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(396, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(418, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(427, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(442, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(446, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(451, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(457, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(485, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(487, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(491, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(495, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(503, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(508, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(516, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(522, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(523, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(533, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(537, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(541, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(549, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(555, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(557, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(561, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(564, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(566, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(568, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(571, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(574, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(582, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(591, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(602, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(607, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(610, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(613, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(624, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(631, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(633, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(639, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(647, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(653, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(666, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(668, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(681, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(690, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(702, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(710, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(727, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(734, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(743, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(771, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(783, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(792, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(844, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(870, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(875, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(880, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(895, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(940, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable())]), ")-0WPf\\&34:L'1/7PPPPPPPPPP,(CME?o_Z^^OJad/KZImdb\\bYVV^]n[WU.8.9<0INFNH4PK+*E+lLQNP3D2LAgB?B2*2_%%%%%%q%%%%%%%%%%%%%%%%%%%%%%%%%%),MTcG)Y:i;>K%i>6H551T@/+5=>ehj?______p^OOOO////`dbbbbbGb^^^^WUXIIIIIIkFHHHH,,,,SLQQQQQQOLLLL?R?"));
        FontData.register(acc, FontData.make("normal 700 Roboto", 967, 211, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(162, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(244, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(252, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(253, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(262, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(268, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(274, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(278, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(282, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(292, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(301, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(321, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(331, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(332, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(338, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(353, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(358, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(365, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(374, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(388, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(422, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(437, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(446, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(453, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(457, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(467, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(490, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(500, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(502, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(505, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(509, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(517, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(521, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(534, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(537, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(542, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(548, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(551, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(560, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(563, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(565, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(570, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(572, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(575, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(596, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(608, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(616, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(619, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(631, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(638, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(648, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(650, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(656, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(658, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(665, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(673, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(681, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(690, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(692, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(707, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(718, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(738, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(761, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(784, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(808, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(844, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(866, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(876, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(895, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(940, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable())]), "(,1RQcZ&55=J'9/8QQQQQQQQQQ.*DPEAj]WZYMJ^a/LWIia_X_WTU[ZiWUS-:-;<2HMFMI6PL+*G+hLNMN7E4LCcDBD2)2X%%%%%%l%%%%%%%%%%%%%%%%%%%%%%%%%%(.QR`H(V?e<AK%eB9H883T@0+8>AbdfA]]]]]]kZMMMM////\\a_____G_[[[[USVHHHHHHgFIIII,,,,QLNNNNNONLLLLBOB"));
        FontData.register(acc, FontData.make("normal 400 Times", 750, 250, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(180, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(200, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(250, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(278, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(300, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(310, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(333, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(389, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(408, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(444, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(453, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(469, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(480, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(500, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(541, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(549, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(556, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(564, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(576, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(611, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(667, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(722, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(750, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(760, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(778, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(833, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(889, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(921, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(944, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable())]), "(,/44@?&,,48(,()4444444444))8880B<;;<:7<<,-<:A<<7<;7:<<C<<:,),24,04040,44))4)?4444,-)44<4403'35%%%%%%D%%%%%%%%%%%%%%%%%%%%%%%%%%(,4444'4,>)48%>,.6**,91(,*+4===0<<<<<<A;::::,,,,<<<<<<<8<<<<<<74000000;00000))))4444444644444444"));
        FontData.register(acc, FontData.make("normal 700 Times", 750, 250, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(220, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(250, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(278, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(300, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(333, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(389, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(394, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(444, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(500, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(520, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(540, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(549, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(556, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(570, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(576, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(581, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(611, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(667, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(722, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(750, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(778, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(833, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(930, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(944, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable())]), "'*3//?<(**/4'*'(//////////**444/=989987;;+/;8>9;7;93899?998*(*6/*/3.3.*/3(*3(<3/33.+*3/9//.,&,0%%%%%%?%%%%%%%%%%%%%%%%%%%%%%%%%%'*////&/*:)/4%:*-2))*51'*)*/:::/999999?98888++++99;;;;;4;9999973//////9.....((((/3/////2/3333/3/"));
        FontData.register(acc, FontData.make("italic 400 Times", 750, 250, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(214, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(250, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(276, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(278, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(300, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(310, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(333, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(389, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(422, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(444, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(500, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(523, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(541, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(549, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(556, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(576, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(611, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(667, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(675, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(722, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(750, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(760, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(778, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(833, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(889, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(920, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable())]), "',/11>=&,,19',')1111111111,,9991@778:77::,085>8:7:715:7>755-)-/1,11010)11))0):1111--)10800-.(.3%%%%%%A%%%%%%%%%%%%%%%%%%%%%%%%%%'-1111(1,<(19%<,.4**,62',*+1;;;1777777?87777,,,,:8:::::9:::::571111111800000))))1111111411111010"));
        FontData.register(acc, FontData.make("italic 700 Times", 750, 250, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(220, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(250, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(266, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(278, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(300, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(333, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(348, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(389, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(395, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(444, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(485, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(500, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(549, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(556, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(570, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(576, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(606, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(611, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(667, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(722, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(750, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(778, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(833, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(889, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(944, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable())]), "'-422=<)++25'+')2222222222++5552=999:99:<-298>::8:948:9>988+)+52+22020+24))2)<4222--)40920-,&,5%%%%%%@%%%%%%%%%%%%%%%%%%%%%%%%%%'-2222&2+;(27%;+/3**+62'+**2;;;2999999?99999----:::::::5:::::882222222:00001))).2422222324444020"));
        FontData.register(acc, FontData.make("normal 400 Courier", 754, 247, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(549, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(576, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(600, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable())]), ")))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))%%%%%%*%%%%%%%%%%%%%%%%%%%%%%%%%%)))))))))))))%))&')))()))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))'))))))))"));
        FontData.register(acc, FontData.make("normal 700 Courier", 754, 247, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(549, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(576, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(600, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable())]), ")))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))%%%%%%*%%%%%%%%%%%%%%%%%%%%%%%%%%)))))))))))))%))&')))()))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))'))))))))"));
        FontData.register(acc, FontData.make("italic 400 Courier", 754, 247, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(549, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(576, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(600, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable())]), ")))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))%%%%%%*%%%%%%%%%%%%%%%%%%%%%%%%%%)))))))))))))%))&')))()))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))'))))))))"));
        FontData.register(acc, FontData.make("italic 700 Courier", 754, 247, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(549, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(576, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(600, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable())]), ")))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))%%%%%%*%%%%%%%%%%%%%%%%%%%%%%%%%%)))))))))))))%))&')))()))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))'))))))))"));
        FontData.register(acc, FontData.make("normal 400 Roboto-Mono", 967, 211, sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(601, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(615, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable())]), "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&%%%%%%(%%%%%%%%%%%%%%%%%%%%%%%%%%&&&&&&&&&&&&&%&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&'&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"));
      }
      catch ($_u25) {
        $_u25 = sys.Err.make($_u25);
        if ($_u25 instanceof sys.Err) {
          let e = $_u25;
          ;
          e.trace();
        }
        else {
          throw $_u25;
        }
      }
      ;
      FontData.#registry = sys.ObjUtil.coerce(((this$) => { let $_u26 = acc; if ($_u26 == null) return null; return sys.ObjUtil.toImmutable(acc); })(this), sys.Type.find("[sys::Str:graphics::FontData]"));
    }
    ;
    return;
  }

}

class Stroke extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#width = sys.Float.make(1.0);
    this.#cap = StrokeCap.butt();
    this.#join = StrokeJoin.miter();
    return;
  }

  typeof() { return Stroke.type$; }

  static #defVal = undefined;

  static defVal() {
    if (Stroke.#defVal === undefined) {
      Stroke.static$init();
      if (Stroke.#defVal === undefined) Stroke.#defVal = null;
    }
    return Stroke.#defVal;
  }

  static #none = undefined;

  static none() {
    if (Stroke.#none === undefined) {
      Stroke.static$init();
      if (Stroke.#none === undefined) Stroke.#none = null;
    }
    return Stroke.#none;
  }

  #width = sys.Float.make(0);

  width() { return this.#width; }

  __width(it) { if (it === undefined) return this.#width; else this.#width = it; }

  #dash = null;

  dash() { return this.#dash; }

  __dash(it) { if (it === undefined) return this.#dash; else this.#dash = it; }

  #cap = null;

  cap() { return this.#cap; }

  __cap(it) { if (it === undefined) return this.#cap; else this.#cap = it; }

  #join = null;

  join() { return this.#join; }

  __join(it) { if (it === undefined) return this.#join; else this.#join = it; }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    try {
      let width = sys.Float.make(1.0);
      let dash = null;
      let cap = StrokeCap.butt();
      let join = StrokeJoin.miter();
      let toks = null;
      let bracketStart = sys.Str.index(s, "[");
      if (bracketStart != null) {
        let bracketEnd = sys.Str.indexr(s, "]");
        (dash = sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(bracketStart, sys.Int.type$), 1), sys.ObjUtil.coerce(bracketEnd, sys.Int.type$), true)));
        (toks = sys.Str.split(sys.Str.getRange(s, sys.Range.make(0, sys.ObjUtil.coerce(bracketStart, sys.Int.type$), true))).addAll(sys.Str.split(sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(bracketEnd, sys.Int.type$), 1), -1)))));
      }
      else {
        if (sys.Str.isEmpty(s)) {
          throw sys.Err.make();
        }
        ;
        (toks = sys.Str.split(s));
      }
      ;
      toks.each((tok) => {
        if (sys.Str.isEmpty(tok)) {
          return;
        }
        ;
        let char = sys.Str.get(tok, 0);
        if ((sys.Int.isDigit(char) || sys.ObjUtil.equals(char, 46))) {
          (width = sys.ObjUtil.coerce(sys.Float.fromStr(tok), sys.Float.type$));
          return;
        }
        ;
        let tryCap = StrokeCap.fromStr(tok, false);
        if (tryCap != null) {
          (cap = sys.ObjUtil.coerce(tryCap, StrokeCap.type$));
          return;
        }
        ;
        (join = sys.ObjUtil.coerce(StrokeJoin.fromStr(tok, true), StrokeJoin.type$));
        return;
      });
      return Stroke.makeFields(width, sys.ObjUtil.coerce(dash, sys.Str.type$.toNullable()), cap, join);
    }
    catch ($_u27) {
      $_u27 = sys.Err.make($_u27);
      if ($_u27 instanceof sys.Err) {
        let e = $_u27;
        ;
        if (checked) {
          throw sys.ParseErr.make(sys.Str.plus("Stroke: ", s));
        }
        ;
        return null;
      }
      else {
        throw $_u27;
      }
    }
    ;
  }

  static make(f) {
    const $self = new Stroke();
    Stroke.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ;
    sys.Func.call(f, $self);
    return;
  }

  static makeFields(width,dash,cap,join) {
    const $self = new Stroke();
    Stroke.makeFields$($self,width,dash,cap,join);
    return $self;
  }

  static makeFields$($self,width,dash,cap,join) {
    if (width === undefined) width = sys.Float.make(1.0);
    if (dash === undefined) dash = null;
    if (cap === undefined) cap = StrokeCap.butt();
    if (join === undefined) join = StrokeJoin.miter();
    ;
    $self.#width = width;
    $self.#dash = dash;
    $self.#cap = cap;
    $self.#join = join;
    return;
  }

  isNone() {
    return sys.ObjUtil.equals(this.#width, sys.Float.make(0.0));
  }

  hash() {
    let hash = sys.Int.xor(sys.Int.xor(sys.Float.hash(this.#width), sys.Int.shiftl(this.#cap.ordinal(), 11)), sys.Int.shiftl(this.#join.ordinal(), 13));
    if (this.#dash != null) {
      (hash = sys.Int.xor(hash, sys.Str.hash(this.#dash)));
    }
    ;
    return hash;
  }

  equals(obj) {
    let that = sys.ObjUtil.as(obj, Stroke.type$);
    if (that == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#width, that.#width) && sys.ObjUtil.equals(this.#dash, that.#dash) && this.#cap === that.#cap && this.#join === that.#join);
  }

  toSize(newWidth) {
    if (sys.ObjUtil.equals(this.#width, newWidth)) {
      return this;
    }
    ;
    return Stroke.makeFields(newWidth, this.#dash, this.#cap, this.#join);
  }

  toStr() {
    let s = sys.StrBuf.make();
    if (sys.ObjUtil.compareNE(this.#width, sys.Float.make(1.0))) {
      s.join(GeomUtil.formatFloat(this.#width));
    }
    ;
    if (this.#dash != null) {
      s.add(" [").add(this.#dash).add("]");
    }
    ;
    if (this.#cap !== StrokeCap.butt()) {
      s.addChar(32).add(this.#cap.name());
    }
    ;
    if (this.#join !== StrokeJoin.miter()) {
      s.addChar(32).add(this.#join.name());
    }
    ;
    if (s.isEmpty()) {
      return GeomUtil.formatFloat(this.#width);
    }
    ;
    return s.toStr();
  }

  static static$init() {
    Stroke.#defVal = Stroke.makeFields();
    Stroke.#none = Stroke.makeFields(sys.Float.make(0.0));
    return;
  }

}

class StrokeCap extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StrokeCap.type$; }

  static butt() { return StrokeCap.vals().get(0); }

  static round() { return StrokeCap.vals().get(1); }

  static square() { return StrokeCap.vals().get(2); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new StrokeCap();
    StrokeCap.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(StrokeCap.type$, StrokeCap.vals(), name$, checked);
  }

  static vals() {
    if (StrokeCap.#vals == null) {
      StrokeCap.#vals = sys.List.make(StrokeCap.type$, [
        StrokeCap.make(0, "butt", ),
        StrokeCap.make(1, "round", ),
        StrokeCap.make(2, "square", ),
      ]).toImmutable();
    }
    return StrokeCap.#vals;
  }

  static static$init() {
    const $_u28 = StrokeCap.vals();
    if (true) {
    }
    ;
    return;
  }

}

class StrokeJoin extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StrokeJoin.type$; }

  static bevel() { return StrokeJoin.vals().get(0); }

  static miter() { return StrokeJoin.vals().get(1); }

  static radius() { return StrokeJoin.vals().get(2); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new StrokeJoin();
    StrokeJoin.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(StrokeJoin.type$, StrokeJoin.vals(), name$, checked);
  }

  static vals() {
    if (StrokeJoin.#vals == null) {
      StrokeJoin.#vals = sys.List.make(StrokeJoin.type$, [
        StrokeJoin.make(0, "bevel", ),
        StrokeJoin.make(1, "miter", ),
        StrokeJoin.make(2, "radius", ),
      ]).toImmutable();
    }
    return StrokeJoin.#vals;
  }

  static static$init() {
    const $_u29 = StrokeJoin.vals();
    if (true) {
    }
    ;
    return;
  }

}

class Point extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Point.type$; }

  static #defVal = undefined;

  static defVal() {
    if (Point.#defVal === undefined) {
      Point.static$init();
      if (Point.#defVal === undefined) Point.#defVal = null;
    }
    return Point.#defVal;
  }

  #x = sys.Float.make(0);

  x() { return this.#x; }

  __x(it) { if (it === undefined) return this.#x; else this.#x = it; }

  #y = sys.Float.make(0);

  y() { return this.#y; }

  __y(it) { if (it === undefined) return this.#y; else this.#y = it; }

  static make(x,y) {
    const $self = new Point();
    Point.make$($self,x,y);
    return $self;
  }

  static make$($self,x,y) {
    $self.#x = x;
    $self.#y = y;
    return;
  }

  static makeInt(x,y) {
    const $self = new Point();
    Point.makeInt$($self,x,y);
    return $self;
  }

  static makeInt$($self,x,y) {
    $self.#x = sys.Num.toFloat(sys.ObjUtil.coerce(x, sys.Num.type$));
    $self.#y = sys.Num.toFloat(sys.ObjUtil.coerce(y, sys.Num.type$));
    return;
  }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    try {
      let f = GeomUtil.parseFloatList(s);
      return Point.make(f.get(0), f.get(1));
    }
    catch ($_u30) {
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(sys.Str.plus("Invalid Point: ", s));
    }
    ;
    return null;
  }

  translate(t) {
    return Point.make(sys.Float.plus(this.#x, t.#x), sys.Float.plus(this.#y, t.#y));
  }

  hash() {
    return sys.Int.xor(sys.Float.hash(this.#x), sys.Int.shiftl(sys.Float.hash(this.#y), 16));
  }

  equals(obj) {
    let that = sys.ObjUtil.as(obj, Point.type$);
    if (that == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#x, that.#x) && sys.ObjUtil.equals(this.#y, that.#y));
  }

  toStr() {
    return GeomUtil.formatFloats2(this.#x, this.#y);
  }

  static static$init() {
    Point.#defVal = Point.make(sys.Float.make(0.0), sys.Float.make(0.0));
    return;
  }

}

class Size extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Size.type$; }

  static #defVal = undefined;

  static defVal() {
    if (Size.#defVal === undefined) {
      Size.static$init();
      if (Size.#defVal === undefined) Size.#defVal = null;
    }
    return Size.#defVal;
  }

  #w = sys.Float.make(0);

  w() { return this.#w; }

  __w(it) { if (it === undefined) return this.#w; else this.#w = it; }

  #h = sys.Float.make(0);

  h() { return this.#h; }

  __h(it) { if (it === undefined) return this.#h; else this.#h = it; }

  static make(w,h) {
    const $self = new Size();
    Size.make$($self,w,h);
    return $self;
  }

  static make$($self,w,h) {
    $self.#w = w;
    $self.#h = h;
    return;
  }

  static makeInt(w,h) {
    const $self = new Size();
    Size.makeInt$($self,w,h);
    return $self;
  }

  static makeInt$($self,w,h) {
    $self.#w = sys.Num.toFloat(sys.ObjUtil.coerce(w, sys.Num.type$));
    $self.#h = sys.Num.toFloat(sys.ObjUtil.coerce(h, sys.Num.type$));
    return;
  }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    try {
      let f = GeomUtil.parseFloatList(s);
      return Size.make(f.get(0), f.get(1));
    }
    catch ($_u31) {
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(sys.Str.plus("Invalid Size: ", s));
    }
    ;
    return null;
  }

  toStr() {
    return GeomUtil.formatFloats2(this.#w, this.#h);
  }

  hash() {
    return sys.Int.xor(sys.Float.hash(this.#w), sys.Int.shiftl(sys.Float.hash(this.#h), 16));
  }

  equals(obj) {
    let that = sys.ObjUtil.as(obj, Size.type$);
    if (that == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#w, that.#w) && sys.ObjUtil.equals(this.#h, that.#h));
  }

  static static$init() {
    Size.#defVal = Size.make(sys.Float.make(0.0), sys.Float.make(0.0));
    return;
  }

}

class Rect extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Rect.type$; }

  static #defVal = undefined;

  static defVal() {
    if (Rect.#defVal === undefined) {
      Rect.static$init();
      if (Rect.#defVal === undefined) Rect.#defVal = null;
    }
    return Rect.#defVal;
  }

  #x = sys.Float.make(0);

  x() { return this.#x; }

  __x(it) { if (it === undefined) return this.#x; else this.#x = it; }

  #y = sys.Float.make(0);

  y() { return this.#y; }

  __y(it) { if (it === undefined) return this.#y; else this.#y = it; }

  #w = sys.Float.make(0);

  w() { return this.#w; }

  __w(it) { if (it === undefined) return this.#w; else this.#w = it; }

  #h = sys.Float.make(0);

  h() { return this.#h; }

  __h(it) { if (it === undefined) return this.#h; else this.#h = it; }

  static make(x,y,w,h) {
    const $self = new Rect();
    Rect.make$($self,x,y,w,h);
    return $self;
  }

  static make$($self,x,y,w,h) {
    $self.#x = x;
    $self.#y = y;
    $self.#w = w;
    $self.#h = h;
    return;
  }

  static makeInt(x,y,w,h) {
    const $self = new Rect();
    Rect.makeInt$($self,x,y,w,h);
    return $self;
  }

  static makeInt$($self,x,y,w,h) {
    $self.#x = sys.Num.toFloat(sys.ObjUtil.coerce(x, sys.Num.type$));
    $self.#y = sys.Num.toFloat(sys.ObjUtil.coerce(y, sys.Num.type$));
    $self.#w = sys.Num.toFloat(sys.ObjUtil.coerce(w, sys.Num.type$));
    $self.#h = sys.Num.toFloat(sys.ObjUtil.coerce(h, sys.Num.type$));
    return;
  }

  static makePosSize(p,s) {
    const $self = new Rect();
    Rect.makePosSize$($self,p,s);
    return $self;
  }

  static makePosSize$($self,p,s) {
    $self.#x = p.x();
    $self.#y = p.y();
    $self.#w = s.w();
    $self.#h = s.h();
    return;
  }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    try {
      let f = GeomUtil.parseFloatList(s);
      return Rect.make(f.get(0), f.get(1), f.get(2), f.get(3));
    }
    catch ($_u32) {
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(sys.Str.plus("Invalid Rect: ", s));
    }
    ;
    return null;
  }

  pos() {
    return Point.make(this.#x, this.#y);
  }

  size() {
    return Size.make(this.#w, this.#h);
  }

  contains(pt) {
    return (sys.ObjUtil.compareGE(pt.x(), this.#x) && sys.ObjUtil.compareLE(pt.x(), sys.Float.plus(this.#x, this.#w)) && sys.ObjUtil.compareGE(pt.y(), this.#y) && sys.ObjUtil.compareLE(pt.y(), sys.Float.plus(this.#y, this.#h)));
  }

  intersects(that) {
    let ax1 = this.#x;
    let ay1 = this.#y;
    let ax2 = sys.Float.plus(ax1, this.#w);
    let ay2 = sys.Float.plus(ay1, this.#h);
    let bx1 = that.#x;
    let by1 = that.#y;
    let bx2 = sys.Float.plus(bx1, that.#w);
    let by2 = sys.Float.plus(by1, that.#h);
    return !(sys.ObjUtil.compareLE(ax2, bx1) || sys.ObjUtil.compareLE(bx2, ax1) || sys.ObjUtil.compareLE(ay2, by1) || sys.ObjUtil.compareLE(by2, ay1));
  }

  intersection(that) {
    let ax1 = this.#x;
    let ay1 = this.#y;
    let ax2 = sys.Float.plus(ax1, this.#w);
    let ay2 = sys.Float.plus(ay1, this.#h);
    let bx1 = that.#x;
    let by1 = that.#y;
    let bx2 = sys.Float.plus(bx1, that.#w);
    let by2 = sys.Float.plus(by1, that.#h);
    let rx1 = sys.Float.max(ax1, bx1);
    let rx2 = sys.Float.min(ax2, bx2);
    let ry1 = sys.Float.max(ay1, by1);
    let ry2 = sys.Float.min(ay2, by2);
    let rw = sys.Float.minus(rx2, rx1);
    let rh = sys.Float.minus(ry2, ry1);
    if ((sys.ObjUtil.compareLE(rw, sys.Float.make(0.0)) || sys.ObjUtil.compareLE(rh, sys.Float.make(0.0)))) {
      return Rect.defVal();
    }
    ;
    return Rect.make(rx1, ry1, rw, rh);
  }

  union(that) {
    let ax1 = this.#x;
    let ay1 = this.#y;
    let ax2 = sys.Float.plus(ax1, this.#w);
    let ay2 = sys.Float.plus(ay1, this.#h);
    let bx1 = that.#x;
    let by1 = that.#y;
    let bx2 = sys.Float.plus(bx1, that.#w);
    let by2 = sys.Float.plus(by1, that.#h);
    let rx1 = sys.Float.min(ax1, bx1);
    let rx2 = sys.Float.max(ax2, bx2);
    let ry1 = sys.Float.min(ay1, by1);
    let ry2 = sys.Float.max(ay2, by2);
    let rw = sys.Float.minus(rx2, rx1);
    let rh = sys.Float.minus(ry2, ry1);
    if ((sys.ObjUtil.compareLE(rw, sys.Float.make(0.0)) || sys.ObjUtil.compareLE(rh, sys.Float.make(0.0)))) {
      return Rect.defVal();
    }
    ;
    return Rect.make(rx1, ry1, rw, rh);
  }

  toStr() {
    return GeomUtil.formatFloats4(this.#x, this.#y, this.#w, this.#h);
  }

  hash() {
    return sys.Int.xor(sys.Int.xor(sys.Int.xor(sys.Float.hash(this.#x), sys.Int.shiftl(sys.Float.hash(this.#y), 8)), sys.Int.shiftl(sys.Float.hash(this.#w), 16)), sys.Int.shiftl(sys.Float.hash(this.#w), 24));
  }

  equals(obj) {
    let that = sys.ObjUtil.as(obj, Rect.type$);
    if (that == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#x, that.#x) && sys.ObjUtil.equals(this.#y, that.#y) && sys.ObjUtil.equals(this.#w, that.#w) && sys.ObjUtil.equals(this.#h, that.#h));
  }

  static static$init() {
    Rect.#defVal = Rect.make(sys.Float.make(0.0), sys.Float.make(0.0), sys.Float.make(0.0), sys.Float.make(0.0));
    return;
  }

}

class Insets extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Insets.type$; }

  static #defVal = undefined;

  static defVal() {
    if (Insets.#defVal === undefined) {
      Insets.static$init();
      if (Insets.#defVal === undefined) Insets.#defVal = null;
    }
    return Insets.#defVal;
  }

  #top = sys.Float.make(0);

  top() { return this.#top; }

  __top(it) { if (it === undefined) return this.#top; else this.#top = it; }

  #right = sys.Float.make(0);

  right() { return this.#right; }

  __right(it) { if (it === undefined) return this.#right; else this.#right = it; }

  #bottom = sys.Float.make(0);

  bottom() { return this.#bottom; }

  __bottom(it) { if (it === undefined) return this.#bottom; else this.#bottom = it; }

  #left = sys.Float.make(0);

  left() { return this.#left; }

  __left(it) { if (it === undefined) return this.#left; else this.#left = it; }

  static make(top,right,bottom,left) {
    const $self = new Insets();
    Insets.make$($self,top,right,bottom,left);
    return $self;
  }

  static make$($self,top,right,bottom,left) {
    if (right === undefined) right = null;
    if (bottom === undefined) bottom = null;
    if (left === undefined) left = null;
    if (right == null) {
      (right = top);
    }
    ;
    if (bottom == null) {
      (bottom = top);
    }
    ;
    if (left == null) {
      (left = right);
    }
    ;
    $self.#top = sys.Num.toFloat(top);
    $self.#right = sys.Num.toFloat(right);
    $self.#bottom = sys.Num.toFloat(bottom);
    $self.#left = sys.Num.toFloat(left);
    return;
  }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    try {
      let f = GeomUtil.parseFloatList(s);
      return Insets.make(sys.ObjUtil.coerce(f.get(0), sys.Num.type$), sys.ObjUtil.coerce(f.getSafe(1), sys.Num.type$.toNullable()), sys.ObjUtil.coerce(f.getSafe(2), sys.Num.type$.toNullable()), sys.ObjUtil.coerce(f.getSafe(3), sys.Num.type$.toNullable()));
    }
    catch ($_u33) {
      $_u33 = sys.Err.make($_u33);
      if ($_u33 instanceof sys.Err) {
        let e = $_u33;
        ;
      }
      else {
        throw $_u33;
      }
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(sys.Str.plus("Invalid Insets: ", s));
    }
    ;
    return null;
  }

  toStr() {
    if ((sys.ObjUtil.equals(this.#top, this.#right) && sys.ObjUtil.equals(this.#top, this.#bottom) && sys.ObjUtil.equals(this.#top, this.#left))) {
      return GeomUtil.formatFloat(this.#top);
    }
    else {
      return GeomUtil.formatFloats4(this.#top, this.#right, this.#bottom, this.#left);
    }
    ;
  }

  hash() {
    return sys.Int.xor(sys.Int.xor(sys.Int.xor(sys.Float.hash(this.#top), sys.Int.shiftl(sys.Float.hash(this.#right), 8)), sys.Int.shiftl(sys.Float.hash(this.#bottom), 16)), sys.Int.shiftl(sys.Float.hash(this.#left), 24));
  }

  equals(obj) {
    let that = sys.ObjUtil.as(obj, Insets.type$);
    if (that == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#top, that.#top) && sys.ObjUtil.equals(this.#right, that.#right) && sys.ObjUtil.equals(this.#bottom, that.#bottom) && sys.ObjUtil.equals(this.#left, that.#left));
  }

  toSize() {
    return Size.make(sys.Float.plus(this.#right, this.#left), sys.Float.plus(this.#top, this.#bottom));
  }

  w() {
    return sys.Float.plus(this.#left, this.#right);
  }

  h() {
    return sys.Float.plus(this.#top, this.#bottom);
  }

  isNone() {
    return (sys.ObjUtil.equals(this.#top, sys.Float.make(0.0)) && sys.ObjUtil.equals(this.#right, sys.Float.make(0.0)) && sys.ObjUtil.equals(this.#bottom, sys.Float.make(0.0)) && sys.ObjUtil.equals(this.#left, sys.Float.make(0.0)));
  }

  static static$init() {
    Insets.#defVal = Insets.make(sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Num.type$), sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Num.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Num.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Num.type$.toNullable()));
    return;
  }

}

class GeomUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GeomUtil.type$; }

  static split(s) {
    let acc = sys.List.make(sys.Str.type$);
    let start = 0;
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(s)); i = sys.Int.increment(i)) {
      let c = sys.Str.get(s, i);
      if ((sys.ObjUtil.equals(c, 32) || sys.ObjUtil.equals(c, 44))) {
        if (sys.ObjUtil.compareLT(start, i)) {
          acc.add(sys.Str.getRange(s, sys.Range.make(start, i, true)));
        }
        ;
        (start = sys.Int.plus(i, 1));
      }
      ;
    }
    ;
    if (sys.ObjUtil.compareLT(start, sys.Str.size(s))) {
      acc.add(sys.Str.getRange(s, sys.Range.make(start, -1)));
    }
    ;
    return acc;
  }

  static parseFloatList(s) {
    const this$ = this;
    return sys.ObjUtil.coerce(GeomUtil.split(s).map((tok) => {
      return sys.ObjUtil.coerce(sys.Str.toFloat(sys.Str.trim(tok)), sys.Obj.type$.toNullable());
    }, sys.Obj.type$.toNullable()), sys.Type.find("sys::Float[]"));
  }

  static formatFloats2(a,b) {
    return sys.StrBuf.make().add(GeomUtil.formatFloat(a)).addChar(32).add(GeomUtil.formatFloat(b)).toStr();
  }

  static formatFloats4(a,b,c,d) {
    return sys.StrBuf.make().add(GeomUtil.formatFloat(a)).addChar(32).add(GeomUtil.formatFloat(b)).addChar(32).add(GeomUtil.formatFloat(c)).addChar(32).add(GeomUtil.formatFloat(d)).toStr();
  }

  static formatFloat(f) {
    return sys.Float.toLocale(f, "0.###", sys.Locale.en());
  }

  static make() {
    const $self = new GeomUtil();
    GeomUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class GraphicsPath {
  constructor() {
    const this$ = this;
  }

  typeof() { return GraphicsPath.type$; }

}

class Graphics {
  constructor() {
    const this$ = this;
  }

  typeof() { return Graphics.type$; }

  #paint = null;

  paint(it) {
    if (it === undefined) {
    }
    else {
    }
  }

  #color = null;

  color(it) {
    if (it === undefined) {
    }
    else {
    }
  }

  #stroke = null;

  stroke(it) {
    if (it === undefined) {
    }
    else {
    }
  }

  #alpha = sys.Float.make(0);

  alpha(it) {
    if (it === undefined) {
    }
    else {
    }
  }

  #font = null;

  font(it) {
    if (it === undefined) {
    }
    else {
    }
  }

}

class Transform extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Transform.type$; }

  #a = sys.Float.make(0);

  a() { return this.#a; }

  __a(it) { if (it === undefined) return this.#a; else this.#a = it; }

  #b = sys.Float.make(0);

  b() { return this.#b; }

  __b(it) { if (it === undefined) return this.#b; else this.#b = it; }

  #c = sys.Float.make(0);

  c() { return this.#c; }

  __c(it) { if (it === undefined) return this.#c; else this.#c = it; }

  #d = sys.Float.make(0);

  d() { return this.#d; }

  __d(it) { if (it === undefined) return this.#d; else this.#d = it; }

  #e = sys.Float.make(0);

  e() { return this.#e; }

  __e(it) { if (it === undefined) return this.#e; else this.#e = it; }

  #f = sys.Float.make(0);

  f() { return this.#f; }

  __f(it) { if (it === undefined) return this.#f; else this.#f = it; }

  static #defVal = undefined;

  static defVal() {
    if (Transform.#defVal === undefined) {
      Transform.static$init();
      if (Transform.#defVal === undefined) Transform.#defVal = null;
    }
    return Transform.#defVal;
  }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    try {
      let t = null;
      sys.Str.split(s, sys.ObjUtil.coerce(41, sys.Int.type$.toNullable())).each((func) => {
        if (sys.Str.startsWith(func, ",")) {
          (func = sys.Str.trim(sys.Str.getRange(func, sys.Range.make(1, -1))));
        }
        ;
        if (sys.Str.isEmpty(func)) {
          return;
        }
        ;
        let r = Transform.parseFunc(func);
        (t = ((this$) => { if (t == null) return r; return sys.ObjUtil.coerce(t.mult(r), Transform.type$.toNullable()); })(this$));
        return;
      });
      if (t != null) {
        return t;
      }
      ;
    }
    catch ($_u35) {
      $_u35 = sys.Err.make($_u35);
      if ($_u35 instanceof sys.Err) {
        let e = $_u35;
        ;
      }
      else {
        throw $_u35;
      }
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(sys.Str.plus("Transform: ", s));
    }
    ;
    return null;
  }

  static parseFunc(s) {
    let op = ((this$) => { let $_u36 = sys.Str.index(s, "("); if ($_u36 != null) return $_u36; throw sys.Err.make(); })(this);
    let name = sys.Str.trim(sys.Str.getRange(s, sys.Range.make(0, sys.ObjUtil.coerce(op, sys.Int.type$), true)));
    let argsStr = sys.Str.trim(sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(op, sys.Int.type$), 1), -1)));
    let args = GeomUtil.parseFloatList(argsStr);
    let $_u37 = name;
    if (sys.ObjUtil.equals($_u37, "matrix")) {
      return Transform.make(args.get(0), args.get(1), args.get(2), args.get(3), args.get(4), args.get(5));
    }
    else if (sys.ObjUtil.equals($_u37, "translate")) {
      return Transform.translate(args.get(0), sys.ObjUtil.coerce(((this$) => { let $_u38 = args.getSafe(1); if ($_u38 != null) return $_u38; return sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Float.type$.toNullable()); })(this), sys.Float.type$));
    }
    else if (sys.ObjUtil.equals($_u37, "scale")) {
      return Transform.scale(args.get(0), sys.ObjUtil.coerce(((this$) => { let $_u39 = args.getSafe(1); if ($_u39 != null) return $_u39; return sys.ObjUtil.coerce(args.get(0), sys.Float.type$.toNullable()); })(this), sys.Float.type$));
    }
    else if (sys.ObjUtil.equals($_u37, "rotate")) {
      return Transform.rotate(args.get(0), args.getSafe(1), args.getSafe(2));
    }
    else if (sys.ObjUtil.equals($_u37, "skewX")) {
      return Transform.skewX(args.get(0));
    }
    else if (sys.ObjUtil.equals($_u37, "skewY")) {
      return Transform.skewY(args.get(0));
    }
    else {
      throw sys.Err.make(name);
    }
    ;
  }

  static translate(tx,ty) {
    return Transform.make(sys.Float.make(1.0), sys.Float.make(0.0), sys.Float.make(0.0), sys.Float.make(1.0), tx, ty);
  }

  static scale(sx,sy) {
    return Transform.make(sx, sys.Float.make(0.0), sys.Float.make(0.0), sy, sys.Float.make(0.0), sys.Float.make(0.0));
  }

  static rotate(angle,cx,cy) {
    if (cx === undefined) cx = null;
    if (cy === undefined) cy = null;
    let a = sys.Float.toRadians(angle);
    let acos = sys.Float.cos(a);
    let asin = sys.Float.sin(a);
    let rot = Transform.make(acos, asin, sys.Float.negate(asin), acos, sys.Float.make(0.0), sys.Float.make(0.0));
    if (cx == null) {
      return rot;
    }
    ;
    return Transform.translate(sys.ObjUtil.coerce(cx, sys.Float.type$), sys.ObjUtil.coerce(cy, sys.Float.type$)).mult(rot).mult(Transform.translate(sys.Float.negate(sys.ObjUtil.coerce(cx, sys.Float.type$)), sys.Float.negate(sys.ObjUtil.coerce(cy, sys.Float.type$))));
  }

  static skewX(angle) {
    let a = sys.Float.toRadians(angle);
    return Transform.make(sys.Float.make(1.0), sys.Float.make(0.0), sys.Float.tan(a), sys.Float.make(1.0), sys.Float.make(0.0), sys.Float.make(0.0));
  }

  static skewY(angle) {
    let a = sys.Float.toRadians(angle);
    return Transform.make(sys.Float.make(1.0), sys.Float.tan(a), sys.Float.make(0.0), sys.Float.make(1.0), sys.Float.make(0.0), sys.Float.make(0.0));
  }

  static make(a,b,c,d,e,f) {
    const $self = new Transform();
    Transform.make$($self,a,b,c,d,e,f);
    return $self;
  }

  static make$($self,a,b,c,d,e,f) {
    $self.#a = a;
    $self.#c = c;
    $self.#e = e;
    $self.#b = b;
    $self.#d = d;
    $self.#f = f;
    return;
  }

  mult(that) {
    return Transform.make(sys.Float.plus(sys.Float.plus(sys.Float.mult(this.#a, that.#a), sys.Float.mult(this.#c, that.#b)), sys.Float.mult(this.#e, sys.Float.make(0.0))), sys.Float.plus(sys.Float.plus(sys.Float.mult(this.#b, that.#a), sys.Float.mult(this.#d, that.#b)), sys.Float.mult(this.#f, sys.Float.make(0.0))), sys.Float.plus(sys.Float.plus(sys.Float.mult(this.#a, that.#c), sys.Float.mult(this.#c, that.#d)), sys.Float.mult(this.#e, sys.Float.make(0.0))), sys.Float.plus(sys.Float.plus(sys.Float.mult(this.#b, that.#c), sys.Float.mult(this.#d, that.#d)), sys.Float.mult(this.#f, sys.Float.make(0.0))), sys.Float.plus(sys.Float.plus(sys.Float.mult(this.#a, that.#e), sys.Float.mult(this.#c, that.#f)), sys.Float.mult(this.#e, sys.Float.make(1.0))), sys.Float.plus(sys.Float.plus(sys.Float.mult(this.#b, that.#e), sys.Float.mult(this.#d, that.#f)), sys.Float.mult(this.#f, sys.Float.make(1.0))));
  }

  hash() {
    return sys.Str.hash(this.toStr());
  }

  equals(obj) {
    let that = sys.ObjUtil.as(obj, Transform.type$);
    if (that == null) {
      return false;
    }
    ;
    return sys.ObjUtil.equals(this.toStr(), that.toStr());
  }

  toStr() {
    let s = sys.StrBuf.make();
    s.add("matrix(").add(Transform.f2s(this.#a)).addChar(32).add(Transform.f2s(this.#b)).addChar(32).add(Transform.f2s(this.#c)).addChar(32).add(Transform.f2s(this.#d)).addChar(32).add(Transform.f2s(this.#e)).addChar(32).add(Transform.f2s(this.#f)).addChar(41);
    return s.toStr();
  }

  static f2s(f) {
    return sys.Float.toLocale(f, "0.#####", sys.Locale.en());
  }

  static static$init() {
    Transform.#defVal = Transform.make(sys.Float.make(1.0), sys.Float.make(0.0), sys.Float.make(0.0), sys.Float.make(1.0), sys.Float.make(0.0), sys.Float.make(0.0));
    return;
  }

}

class GraphicsEnv {
  constructor() {
    const this$ = this;
  }

  typeof() { return GraphicsEnv.type$; }

  static #curRef = undefined;

  static curRef() {
    if (GraphicsEnv.#curRef === undefined) {
      GraphicsEnv.static$init();
      if (GraphicsEnv.#curRef === undefined) GraphicsEnv.#curRef = null;
    }
    return GraphicsEnv.#curRef;
  }

  static cur() {
    let cur = GraphicsEnv.curRef().val();
    if (cur == null) {
      GraphicsEnv.curRef().val((cur = GraphicsEnv.init()));
    }
    ;
    return sys.ObjUtil.coerce(cur, GraphicsEnv.type$);
  }

  static init() {
    if (sys.ObjUtil.equals(sys.Env.cur().runtime(), "js")) {
      return sys.ObjUtil.coerce(sys.Type.find("dom::DomGraphicsEnv").make(), GraphicsEnv.type$.toNullable());
    }
    else {
      return sys.ObjUtil.coerce(sys.Type.find("graphicsJava::ServerGraphicsEnv").make(), GraphicsEnv.type$.toNullable());
    }
    ;
  }

  static install(env) {
    GraphicsEnv.curRef().val(env);
    return;
  }

  renderImage(mime,size,f) {
    throw sys.Err.make("Not supported in this env");
  }

  static static$init() {
    GraphicsEnv.#curRef = concurrent.AtomicRef.make(null);
    return;
  }

}

class StrokeTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StrokeTest.type$; }

  testMake() {
    const this$ = this;
    this.verifyStroke(Stroke.make((it) => {
      return;
    }), sys.Float.make(1.0), null, StrokeCap.butt(), StrokeJoin.miter());
    this.verifyStroke(Stroke.make((it) => {
      it.__width(sys.Float.make(3.0));
      return;
    }), sys.Float.make(3.0), null, StrokeCap.butt(), StrokeJoin.miter());
    this.verifyStroke(Stroke.make((it) => {
      it.__dash("3,2");
      return;
    }), sys.Float.make(1.0), "3,2", StrokeCap.butt(), StrokeJoin.miter());
    this.verifyStroke(Stroke.make((it) => {
      it.__cap(StrokeCap.round());
      return;
    }), sys.Float.make(1.0), null, StrokeCap.round(), StrokeJoin.miter());
    this.verifyStroke(Stroke.make((it) => {
      it.__join(StrokeJoin.radius());
      return;
    }), sys.Float.make(1.0), null, StrokeCap.butt(), StrokeJoin.radius());
    this.verifyStroke(Stroke.makeFields(sys.Float.make(2.0)), sys.Float.make(2.0), null, StrokeCap.butt(), StrokeJoin.miter());
    this.verifyStroke(Stroke.makeFields(sys.Float.make(3.0), "2,1"), sys.Float.make(3.0), "2,1", StrokeCap.butt(), StrokeJoin.miter());
    this.verifyStroke(Stroke.makeFields(sys.Float.make(3.0), "2,1", StrokeCap.square()), sys.Float.make(3.0), "2,1", StrokeCap.square(), StrokeJoin.miter());
    this.verifyStroke(Stroke.makeFields(sys.Float.make(3.0), "2,1", StrokeCap.square(), StrokeJoin.bevel()), sys.Float.make(3.0), "2,1", StrokeCap.square(), StrokeJoin.bevel());
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Stroke.fromStr("", true);
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Stroke.fromStr("notAColor", true);
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Stroke.fromStr("notAColor round", true);
      return;
    });
    return;
  }

  verifyStroke(s,w,dash,cap,join) {
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(s.width(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(w, sys.Obj.type$.toNullable()));
    this.verifyEq(s.dash(), dash);
    this.verifyEq(s.cap(), cap);
    this.verifyEq(s.join(), join);
    this.verifyEq(s, Stroke.make((it) => {
      it.__width(w);
      it.__dash(dash);
      it.__cap(cap);
      it.__join(join);
      return;
    }));
    this.verifyEq(s, Stroke.makeFields(w, dash, cap, join));
    this.verifyNotEq(s, Stroke.makeFields(sys.Float.make(123.0), dash, cap, join));
    this.verifyNotEq(s, Stroke.makeFields(w, "8,9", cap, join));
    this.verifyNotEq(s, Stroke.makeFields(w, dash, ((this$) => { if (sys.ObjUtil.equals(cap, StrokeCap.round())) return StrokeCap.square(); return StrokeCap.round(); })(this), join));
    this.verifyNotEq(s, Stroke.makeFields(w, dash, cap, ((this$) => { if (sys.ObjUtil.equals(join, StrokeJoin.radius())) return StrokeJoin.bevel(); return StrokeJoin.radius(); })(this)));
    this.verifyEq(sys.ObjUtil.coerce(s.isNone(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.equals(s.width(), sys.Float.make(0.0)), sys.Obj.type$.toNullable()));
    this.verifyEq(s, Stroke.fromStr(s.toStr()));
    this.verifyEq(s, sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().writeObj(s), sys.Buf.type$.toNullable()).flip(), sys.Buf.type$.toNullable()).readObj());
    return;
  }

  static make() {
    const $self = new StrokeTest();
    StrokeTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class TransformTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TransformTest.type$; }

  test() {
    this.verifyEq(Transform.defVal().toStr(), "matrix(1 0 0 1 0 0)");
    let a = Transform.make(sys.Float.make(1.0), sys.Float.make(2.0), sys.Float.make(3.0), sys.Float.make(4.0), sys.Float.make(5.0), sys.Float.make(6.0));
    let b = Transform.make(sys.Float.make(7.0), sys.Float.make(8.0), sys.Float.make(9.0), sys.Float.make(10.0), sys.Float.make(11.0), sys.Float.make(12.0));
    let c = a.mult(b);
    this.verifyTransform(c, "31 46 39 58 52 76");
    this.verifyTransform(sys.ObjUtil.coerce(Transform.fromStr("matrix(31 46 39 58 52 76"), Transform.type$), "31 46 39 58 52 76");
    this.verifyTransform(sys.ObjUtil.coerce(Transform.fromStr("matrix(31,46,39,58,52,76"), Transform.type$), "31 46 39 58 52 76");
    this.verifyTransform(sys.ObjUtil.coerce(Transform.fromStr("matrix(31, 46, 39, 58, 52, 76"), Transform.type$), "31 46 39 58 52 76");
    this.verifyTransform(sys.ObjUtil.coerce(Transform.fromStr("matrix(31 ,  46 ,  39 ,  58 ,  52 ,  76"), Transform.type$), "31 46 39 58 52 76");
    this.verifyTransform(Transform.translate(sys.Float.make(50.0), sys.Float.make(90.0)), "1 0 0 1 50 90");
    this.verifyTransform(sys.ObjUtil.coerce(Transform.fromStr("translate ( 50 90 ) "), Transform.type$), "1 0 0 1 50 90");
    this.verifyTransform(sys.ObjUtil.coerce(Transform.fromStr("translate  (  50  ) "), Transform.type$), "1 0 0 1 50 0");
    this.verifyTransform(Transform.scale(sys.Float.make(2.0), sys.Float.make(3.0)), "2 0 0 3 0 0");
    this.verifyTransform(sys.ObjUtil.coerce(Transform.fromStr("scale(2 3)"), Transform.type$), "2 0 0 3 0 0");
    this.verifyTransform(sys.ObjUtil.coerce(Transform.fromStr("scale(2)"), Transform.type$), "2 0 0 2 0 0");
    this.verifyTransform(Transform.rotate(sys.Float.make(-45.0)), "0.70711 -0.70711 0.70711 0.70711 0 0");
    this.verifyTransform(sys.ObjUtil.coerce(Transform.fromStr("rotate(-45)"), Transform.type$), "0.70711 -0.70711 0.70711 0.70711 0 0");
    (a = Transform.translate(sys.Float.make(50.0), sys.Float.make(90.0)));
    (b = Transform.rotate(sys.Float.make(-45.0)));
    (c = Transform.translate(sys.Float.make(130.0), sys.Float.make(160.0)));
    this.verifyTransform(a.mult(b).mult(c), "0.70711 -0.70711 0.70711 0.70711 255.06097 111.2132");
    (c = sys.ObjUtil.coerce(Transform.fromStr("translate(50 90) rotate(-45) translate(130 160)"), Transform.type$));
    this.verifyTransform(c, "0.70711 -0.70711 0.70711 0.70711 255.06097 111.2132");
    (c = sys.ObjUtil.coerce(Transform.fromStr("translate(50 90), rotate(-45) ,  translate(130 160)"), Transform.type$));
    this.verifyTransform(c, "0.70711 -0.70711 0.70711 0.70711 255.06097 111.2132");
    return;
  }

  verifyTransform(t,expected) {
    this.verifyEq(t.toStr(), sys.Str.plus(sys.Str.plus("matrix(", expected), ")"));
    this.verifyEq(t, Transform.fromStr(t.toStr()));
    this.verifyEq(t, sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().writeObj(t), sys.Buf.type$.toNullable()).flip(), sys.Buf.type$.toNullable()).readObj());
    return;
  }

  static make() {
    const $self = new TransformTest();
    TransformTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class GeomTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GeomTest.type$; }

  testSplit() {
    this.verifyEq(GeomUtil.split("a"), sys.List.make(sys.Str.type$, ["a"]));
    this.verifyEq(GeomUtil.split("a,b"), sys.List.make(sys.Str.type$, ["a", "b"]));
    this.verifyEq(GeomUtil.split("a b"), sys.List.make(sys.Str.type$, ["a", "b"]));
    this.verifyEq(GeomUtil.split("a, b"), sys.List.make(sys.Str.type$, ["a", "b"]));
    this.verifyEq(GeomUtil.split("a  b"), sys.List.make(sys.Str.type$, ["a", "b"]));
    return;
  }

  testPoint() {
    const this$ = this;
    this.verifyEq(Point.defVal(), Point.makeInt(0, 0));
    this.verifyEq(Point.type$.make(), Point.makeInt(0, 0));
    this.verifyEq(Point.makeInt(3, 4), Point.makeInt(3, 4));
    this.verifyEq(Point.makeInt(3, 4), Point.make(sys.Float.make(3.0), sys.Float.make(4.0)));
    this.verifyEq(Point.make(sys.Float.make(3.5), sys.Float.make(4.5)), Point.make(sys.Float.make(3.5), sys.Float.make(4.5)));
    this.verifyNotEq(Point.makeInt(3, 9), Point.makeInt(3, 4));
    this.verifyNotEq(Point.makeInt(9, 4), Point.makeInt(3, 4));
    this.verifyEq(Point.makeInt(2, 3).toStr(), "2 3");
    this.verifyEq(Point.make(sys.Float.make(2.5), sys.Float.make(0.4)).toStr(), "2.5 0.4");
    this.verifyEq(Point.fromStr("4,-2"), Point.makeInt(4, -2));
    this.verifyEq(Point.fromStr("33 , 44"), Point.makeInt(33, 44));
    this.verifyEq(Point.fromStr("x,-2", false), null);
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Point.fromStr("x,-2");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Point.fromStr("x,-2", true);
      return;
    });
    this.verifySer(Point.makeInt(0, 1));
    this.verifySer(Point.makeInt(-99, -505));
    return;
  }

  testSize() {
    const this$ = this;
    this.verifyEq(Size.defVal(), Size.makeInt(0, 0));
    this.verifyEq(Size.type$.make(), Size.makeInt(0, 0));
    this.verifyEq(Size.makeInt(3, 4), Size.makeInt(3, 4));
    this.verifyEq(Size.makeInt(3, 4), Size.make(sys.Float.make(3.0), sys.Float.make(4.0)));
    this.verifyEq(Size.make(sys.Float.make(3.5), sys.Float.make(4.5)), Size.make(sys.Float.make(3.5), sys.Float.make(4.5)));
    this.verifyNotEq(Size.makeInt(3, 9), Size.makeInt(3, 4));
    this.verifyNotEq(Size.makeInt(9, 4), Size.makeInt(3, 4));
    this.verifyEq(Size.makeInt(2, 3).toStr(), "2 3");
    this.verifyEq(Size.make(sys.Float.make(2.5), sys.Float.make(0.4)).toStr(), "2.5 0.4");
    this.verifyEq(Size.fromStr("4,-2"), Size.makeInt(4, -2));
    this.verifyEq(Size.fromStr("-33 , 60"), Size.makeInt(-33, 60));
    this.verifyEq(Size.fromStr("x,-2", false), null);
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Size.fromStr("x,-2");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Size.fromStr("x,-2", true);
      return;
    });
    this.verifySer(Size.makeInt(0, 1));
    this.verifySer(Size.makeInt(-99, -505));
    return;
  }

  testRect() {
    const this$ = this;
    this.verifyEq(Rect.defVal(), Rect.makeInt(0, 0, 0, 0));
    this.verifyEq(Rect.type$.make(), Rect.makeInt(0, 0, 0, 0));
    let r = Rect.make(sys.Float.make(1.2), sys.Float.make(2.0), sys.Float.make(3.5), sys.Float.make(4.0));
    this.verifyEq(sys.ObjUtil.coerce(r.x(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(1.2), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.y(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.w(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.5), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.h(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()));
    this.verifyEq(Rect.makeInt(1, 2, 3, 4), Rect.makeInt(1, 2, 3, 4));
    this.verifyEq(Rect.makeInt(1, 2, 3, 4), Rect.make(sys.Float.make(1.0), sys.Float.make(2.0), sys.Float.make(3.0), sys.Float.make(4.0)));
    this.verifyNotEq(Rect.makeInt(0, 2, 3, 4), Rect.makeInt(1, 2, 3, 4));
    this.verifyNotEq(Rect.makeInt(1, 0, 3, 4), Rect.makeInt(1, 2, 3, 4));
    this.verifyNotEq(Rect.makeInt(1, 2, 0, 4), Rect.makeInt(1, 2, 3, 4));
    this.verifyNotEq(Rect.makeInt(1, 2, 3, 0), Rect.makeInt(1, 2, 3, 4));
    this.verifyEq(Rect.makeInt(1, 2, 3, 4).toStr(), "1 2 3 4");
    this.verifyEq(Rect.make(sys.Float.make(1.5), sys.Float.make(2.5), sys.Float.make(3.0), sys.Float.make(4.2)).toStr(), "1.5 2.5 3 4.2");
    (r = Rect.makeInt(2, 2, 6, 6));
    this.verify(r.contains(Point.makeInt(4, 4)));
    this.verify(r.contains(Point.makeInt(2, 4)));
    this.verify(r.contains(Point.makeInt(4, 2)));
    this.verify(r.contains(Point.makeInt(2, 2)));
    this.verify(r.contains(Point.makeInt(8, 8)));
    this.verify(!r.contains(Point.makeInt(1, 1)));
    this.verify(!r.contains(Point.makeInt(2, 9)));
    this.verify(!r.contains(Point.makeInt(1, 5)));
    this.verifyIntersection(Rect.makeInt(0, 5, 10, 10), Rect.makeInt(5, 10, 15, 10), Rect.makeInt(5, 10, 5, 5));
    this.verifyIntersection(Rect.makeInt(0, 5, 15, 15), Rect.makeInt(5, 10, 20, 5), Rect.makeInt(5, 10, 10, 5));
    this.verifyIntersection(Rect.makeInt(10, 0, 5, 20), Rect.makeInt(5, 10, 20, 5), Rect.makeInt(10, 10, 5, 5));
    this.verifyIntersection(Rect.makeInt(0, 0, 20, 20), Rect.makeInt(5, 5, 5, 10), Rect.makeInt(5, 5, 5, 10));
    this.verifyIntersection(Rect.makeInt(0, 0, 15, 10), Rect.makeInt(0, 5, 15, 15), Rect.makeInt(0, 5, 15, 5));
    this.verifyIntersection(Rect.makeInt(0, 0, 5, 5), Rect.makeInt(10, 10, 5, 5), Rect.defVal());
    this.verifyIntersection(Rect.makeInt(5, 5, 5, 5), Rect.makeInt(0, 10, 15, 5), Rect.defVal());
    this.verifyIntersection(Rect.makeInt(0, 0, 15, 5), Rect.makeInt(0, 5, 15, 15), Rect.defVal());
    this.verifyUnion(Rect.makeInt(0, 0, 5, 5), Rect.makeInt(10, 15, 10, 5), Rect.makeInt(0, 0, 20, 20));
    this.verifyUnion(Rect.makeInt(10, 5, 5, 20), Rect.makeInt(0, 10, 25, 5), Rect.makeInt(0, 5, 25, 20));
    this.verifyUnion(Rect.makeInt(0, 10, 10, 5), Rect.makeInt(5, 20, 15, 5), Rect.makeInt(0, 10, 20, 15));
    this.verifyUnion(Rect.makeInt(5, 10, 5, 5), Rect.makeInt(15, 5, 5, 20), Rect.makeInt(5, 5, 15, 20));
    this.verifyEq(Rect.fromStr("3,4,5,6"), Rect.makeInt(3, 4, 5, 6));
    this.verifyEq(Rect.fromStr("-1 , -2, -3  , -4"), Rect.makeInt(-1, -2, -3, -4));
    this.verifyEq(Rect.fromStr("3,4,5", false), null);
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Rect.fromStr("3,4,x,6");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Rect.fromStr("", true);
      return;
    });
    this.verifySer(Rect.makeInt(1, 2, 3, 4));
    this.verifySer(Rect.makeInt(-1, 2, -3, 4));
    return;
  }

  verifyIntersection(a,b,r) {
    this.verifyEq(a.intersection(b), r);
    this.verifyEq(b.intersection(a), r);
    this.verifyEq(sys.ObjUtil.coerce(a.intersects(b), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.compareNE(r, Rect.defVal()), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(b.intersects(a), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.compareNE(r, Rect.defVal()), sys.Obj.type$.toNullable()));
    return;
  }

  verifyUnion(a,b,r) {
    this.verifyEq(a.union(a), a);
    this.verifyEq(a.union(b), r);
    this.verifyEq(b.union(a), r);
    this.verifyEq(sys.ObjUtil.coerce(a.intersects(r), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.intersects(a), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(b.intersects(r), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.intersects(b), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.intersects(r), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    return;
  }

  testInsets() {
    const this$ = this;
    this.verifyEq(Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())), Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())));
    this.verifyEq(Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())), Insets.make(sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Num.type$), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Num.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Num.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Num.type$.toNullable())));
    this.verifyEq(sys.ObjUtil.coerce(Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())).top(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())).right(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())).bottom(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())).left(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()));
    this.verifyEq(Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())).toSize(), Size.makeInt(6, 4));
    this.verifyNotEq(Insets.make(sys.ObjUtil.coerce(0, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())), Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())));
    this.verifyNotEq(Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(0, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())), Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())));
    this.verifyNotEq(Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())), Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())));
    this.verifyNotEq(Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())), Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())));
    this.verifyEq(Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$)), Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(1, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Num.type$.toNullable())));
    this.verifyEq(Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable())), Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable())));
    this.verifyEq(Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())), Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable())));
    this.verifyEq(Insets.make(sys.ObjUtil.coerce(7, sys.Num.type$)).toStr(), "7");
    this.verifyEq(Insets.make(sys.ObjUtil.coerce(sys.Float.make(7.5), sys.Num.type$)).toStr(), "7.5");
    this.verifyEq(Insets.make(sys.ObjUtil.coerce(sys.Float.make(1.5), sys.Num.type$), sys.ObjUtil.coerce(sys.Float.make(2.5), sys.Num.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Num.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.2), sys.Num.type$.toNullable())).toStr(), "1.5 2.5 3 4.2");
    this.verifyEq(Insets.fromStr("3,4,5,6"), Insets.make(sys.ObjUtil.coerce(3, sys.Num.type$), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(6, sys.Num.type$.toNullable())));
    this.verifyEq(Insets.fromStr("10"), Insets.make(sys.ObjUtil.coerce(10, sys.Num.type$), sys.ObjUtil.coerce(10, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(10, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(10, sys.Num.type$.toNullable())));
    this.verifyEq(Insets.fromStr("-1 , -2, -3  , -4"), Insets.make(sys.ObjUtil.coerce(-1, sys.Num.type$), sys.ObjUtil.coerce(-2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(-3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(-4, sys.Num.type$.toNullable())));
    this.verifyEq(Insets.fromStr("3,4"), Insets.make(sys.ObjUtil.coerce(3, sys.Num.type$), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())));
    this.verifyEq(Insets.fromStr("3,4,5"), Insets.make(sys.ObjUtil.coerce(3, sys.Num.type$), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Num.type$.toNullable())));
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Insets.fromStr("3,4,x,6");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Insets.fromStr("", true);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(Insets.make(sys.ObjUtil.coerce(0, sys.Num.type$), sys.ObjUtil.coerce(0, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())).isNone(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(0, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())).isNone(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(Insets.make(sys.ObjUtil.coerce(0, sys.Num.type$), sys.ObjUtil.coerce(1, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())).isNone(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(Insets.make(sys.ObjUtil.coerce(0, sys.Num.type$), sys.ObjUtil.coerce(0, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())).isNone(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(Insets.make(sys.ObjUtil.coerce(0, sys.Num.type$), sys.ObjUtil.coerce(0, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Num.type$.toNullable())).isNone(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifySer(Insets.make(sys.ObjUtil.coerce(1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())));
    this.verifySer(Insets.make(sys.ObjUtil.coerce(-1, sys.Num.type$), sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(-3, sys.Num.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())));
    return;
  }

  verifySer(obj) {
    let x = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().writeObj(obj), sys.Buf.type$.toNullable()).flip(), sys.Buf.type$.toNullable()).readObj();
    this.verifyEq(obj, x);
    return;
  }

  static make() {
    const $self = new GeomTest();
    GeomTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class FontTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FontTest.type$; }

  testWeight() {
    const this$ = this;
    this.verifyEq(FontWeight.fromNum(400), FontWeight.normal());
    this.verifyEq(FontWeight.fromNum(700), FontWeight.bold());
    this.verifyEq(FontWeight.fromNum(99, false), null);
    this.verifyErr(sys.ArgErr.type$, (it) => {
      FontWeight.fromNum(-1);
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      FontWeight.fromNum(0, true);
      return;
    });
    this.verifyEq(FontWeight.decode("300"), FontWeight.light());
    this.verifyEq(FontWeight.decode("400"), FontWeight.normal());
    this.verifyEq(FontWeight.decode("normal"), FontWeight.normal());
    this.verifyEq(FontWeight.decode("bold"), FontWeight.bold());
    this.verifyEq(FontWeight.decode("900"), FontWeight.black());
    this.verifyEq(FontWeight.decode("foo", false), null);
    this.verifyEq(FontWeight.decode("555", false), null);
    this.verifyErr(sys.ArgErr.type$, (it) => {
      FontWeight.decode("badone");
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      FontWeight.decode("123", true);
      return;
    });
    return;
  }

  testMake() {
    const this$ = this;
    this.verifyFont(Font.make((it) => {
      it.__names(sys.ObjUtil.coerce(((this$) => { let $_u42 = sys.List.make(sys.Str.type$, ["Arial"]); if ($_u42 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$, ["Arial"])); })(this$), sys.Type.find("sys::Str[]")));
      it.__size(sys.Float.make(10.0));
      return;
    }), sys.List.make(sys.Str.type$, ["Arial"]), sys.Float.make(10.0), FontWeight.normal(), FontStyle.normal(), "10pt Arial");
    this.verifyFont(Font.make((it) => {
      it.__names(sys.ObjUtil.coerce(((this$) => { let $_u43 = sys.List.make(sys.Str.type$, ["Arial", "sans-serif"]); if ($_u43 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$, ["Arial", "sans-serif"])); })(this$), sys.Type.find("sys::Str[]")));
      it.__size(sys.Float.make(11.0));
      it.__weight(FontWeight.bold());
      return;
    }), sys.List.make(sys.Str.type$, ["Arial", "sans-serif"]), sys.Float.make(11.0), FontWeight.bold(), FontStyle.normal(), "700 11pt Arial,sans-serif");
    this.verifyFont(Font.make((it) => {
      it.__names(sys.ObjUtil.coerce(((this$) => { let $_u44 = sys.List.make(sys.Str.type$, ["Courier", "monospace"]); if ($_u44 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$, ["Courier", "monospace"])); })(this$), sys.Type.find("sys::Str[]")));
      it.__size(sys.Float.make(12.0));
      it.__style(FontStyle.italic());
      return;
    }), sys.List.make(sys.Str.type$, ["Courier", "monospace"]), sys.Float.make(12.0), FontWeight.normal(), FontStyle.italic(), "italic 12pt Courier,monospace");
    this.verifyFont(Font.make((it) => {
      it.__names(sys.ObjUtil.coerce(((this$) => { let $_u45 = sys.List.make(sys.Str.type$, ["Courier", "monospace"]); if ($_u45 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$, ["Courier", "monospace"])); })(this$), sys.Type.find("sys::Str[]")));
      it.__size(sys.Float.make(12.0));
      it.__weight(FontWeight.light());
      it.__style(FontStyle.italic());
      return;
    }), sys.List.make(sys.Str.type$, ["Courier", "monospace"]), sys.Float.make(12.0), FontWeight.light(), FontStyle.italic(), "italic 300 12pt Courier,monospace");
    this.verifyFont(sys.ObjUtil.coerce(Font.fromStr("12pt Courier, monospace"), Font.type$), sys.List.make(sys.Str.type$, ["Courier", "monospace"]), sys.Float.make(12.0), FontWeight.normal(), FontStyle.normal(), "12pt Courier,monospace");
    this.verifyFont(sys.ObjUtil.coerce(Font.fromStr("normal 12pt Courier, monospace"), Font.type$), sys.List.make(sys.Str.type$, ["Courier", "monospace"]), sys.Float.make(12.0), FontWeight.normal(), FontStyle.normal(), "12pt Courier,monospace");
    this.verifyFont(sys.ObjUtil.coerce(Font.fromStr("normal bold 12pt Courier, monospace"), Font.type$), sys.List.make(sys.Str.type$, ["Courier", "monospace"]), sys.Float.make(12.0), FontWeight.bold(), FontStyle.normal(), "700 12pt Courier,monospace");
    this.verifyFont(sys.ObjUtil.coerce(Font.fromStr("bold 12pt Consolas, Courier, monospace"), Font.type$), sys.List.make(sys.Str.type$, ["Consolas", "Courier", "monospace"]), sys.Float.make(12.0), FontWeight.bold(), FontStyle.normal(), "700 12pt Consolas,Courier,monospace");
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Font.fromStr("10 Arial");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Font.fromStr("", true);
      return;
    });
    return;
  }

  verifyFont(f,names,size,weight,style,str) {
    const this$ = this;
    this.verifyEq(f.names(), names);
    this.verifyEq(sys.ObjUtil.coerce(f.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(size, sys.Obj.type$.toNullable()));
    this.verifyEq(f.weight(), weight);
    this.verifyEq(f.style(), style);
    this.verifyEq(f.toStr(), str);
    this.verifyEq(f, Font.make((it) => {
      it.__names(sys.ObjUtil.coerce(((this$) => { let $_u46 = names; if ($_u46 == null) return null; return sys.ObjUtil.toImmutable(names); })(this$), sys.Type.find("sys::Str[]")));
      it.__size(size);
      it.__weight(weight);
      it.__style(style);
      return;
    }));
    this.verifyNotEq(f, Font.make((it) => {
      it.__names(sys.ObjUtil.coerce(((this$) => { let $_u47 = names.dup().add("x"); if ($_u47 == null) return null; return sys.ObjUtil.toImmutable(names.dup().add("x")); })(this$), sys.Type.find("sys::Str[]")));
      it.__size(size);
      it.__weight(weight);
      it.__style(style);
      return;
    }));
    this.verifyNotEq(f, Font.make((it) => {
      it.__names(sys.ObjUtil.coerce(((this$) => { let $_u48 = names; if ($_u48 == null) return null; return sys.ObjUtil.toImmutable(names); })(this$), sys.Type.find("sys::Str[]")));
      it.__size(sys.Float.plusInt(size, 1));
      it.__weight(weight);
      it.__style(style);
      return;
    }));
    this.verifyNotEq(f, Font.make((it) => {
      it.__names(sys.ObjUtil.coerce(((this$) => { let $_u49 = names; if ($_u49 == null) return null; return sys.ObjUtil.toImmutable(names); })(this$), sys.Type.find("sys::Str[]")));
      it.__size(size);
      it.__weight(sys.ObjUtil.coerce(FontWeight.fromNum(sys.Int.plus(weight.num(), 100)), FontWeight.type$));
      it.__style(style);
      return;
    }));
    this.verifyNotEq(f, Font.make((it) => {
      it.__names(sys.ObjUtil.coerce(((this$) => { let $_u50 = names; if ($_u50 == null) return null; return sys.ObjUtil.toImmutable(names); })(this$), sys.Type.find("sys::Str[]")));
      it.__size(size);
      it.__weight(weight);
      it.__style(FontStyle.vals().get(sys.Int.plus(style.ordinal(), 1)));
      return;
    }));
    this.verifyEq(f, Font.fromStr(f.toStr()));
    this.verifyEq(f, sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().writeObj(f), sys.Buf.type$.toNullable()).flip(), sys.Buf.type$.toNullable()).readObj());
    return;
  }

  testNormalize() {
    const this$ = this;
    sys.List.make(sys.Str.type$, ["Helvetica", "Something,Helvetica"]).each((x) => {
      this$.verifyNormalize(sys.Str.plus("12pt ", x), "12pt Helvetica");
      this$.verifyNormalize(sys.Str.plus("14pt ", x), "14pt Helvetica");
      this$.verifyNormalize(sys.Str.plus("oblique 14pt ", x), "italic 14pt Helvetica");
      this$.verifyNormalize(sys.Str.plus("italic 14pt ", x), "italic 14pt Helvetica");
      this$.verifyNormalize(sys.Str.plus("bold 11pt ", x), "700 11pt Helvetica");
      this$.verifyNormalize(sys.Str.plus("300 8pt ", x), "8pt Helvetica");
      this$.verifyNormalize(sys.Str.plus("500 8pt ", x), "700 8pt Helvetica");
      this$.verifyNormalize(sys.Str.plus("600 8pt ", x), "700 8pt Helvetica");
      this$.verifyNormalize(sys.Str.plus("900 8pt ", x), "700 8pt Helvetica");
      this$.verifyNormalize(sys.Str.plus("italic 600 8pt ", x), "italic 700 8pt Helvetica");
      this$.verifyNormalize(sys.Str.plus("italic 300 8pt ", x), "italic 8pt Helvetica");
      return;
    });
    this.verifyNormalize("12pt Roboto Mono", "12pt Roboto Mono");
    this.verifyNormalize("bold 12pt Roboto Mono", "12pt Roboto Mono");
    return;
  }

  verifyNormalize(s,expected) {
    let f = Font.fromStr(s);
    let actual = f.normalize();
    this.verifyEq(actual.toStr(), expected);
    return;
  }

  testProps() {
    this.verifyProps("12pt Helvetica", sys.Map.__fromLiteral(["font-family","font-size"], ["Helvetica","12pt"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyProps("bold 12pt Helvetica", sys.Map.__fromLiteral(["font-family","font-size","font-weight"], ["Helvetica","12pt","700"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyProps("300 12pt Helvetica", sys.Map.__fromLiteral(["font-family","font-size","font-weight"], ["Helvetica","12pt","300"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyProps("italic 12pt Helvetica", sys.Map.__fromLiteral(["font-family","font-size","font-style"], ["Helvetica","12pt","italic"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyProps("italic bold 11pt Helvetica", sys.Map.__fromLiteral(["font-family","font-size","font-weight","font-style"], ["Helvetica","11pt","700","italic"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyProps("italic 800 8pt Helvetica", sys.Map.__fromLiteral(["font-family","font-size","font-weight","font-style"], ["Helvetica","8pt","800","italic"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    return;
  }

  verifyProps(str,props) {
    let f = Font.fromStr(str);
    this.verifyEq(f.toProps(), props);
    this.verifyEq(Font.fromProps(props), f);
    return;
  }

  static make() {
    const $self = new FontTest();
    FontTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class ColorTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ColorTest.type$; }

  testMake() {
    let c = Color.make(11189196);
    this.verifyEq(sys.ObjUtil.coerce(c.a(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(c.rgb(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(11189196, sys.Obj.type$.toNullable()));
    this.verifyEq(c.toHexStr(), "#abc");
    this.verifyColor(c, 170, 187, 204, sys.Float.make(1.0), "#abc");
    (c = Color.make(1193046));
    this.verifyEq(sys.ObjUtil.coerce(c.a(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(c.rgb(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1193046, sys.Obj.type$.toNullable()));
    this.verifyEq(c.toHexStr(), "#123456");
    this.verifyColor(c, 18, 52, 86, sys.Float.make(1.0), "#123456");
    (c = Color.make(12307677, sys.Float.make(0.5)));
    this.verifyEq(sys.ObjUtil.coerce(c.rgb(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(12307677, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(c.a(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.5), sys.Obj.type$.toNullable()));
    this.verifyEq(c.toHexStr(), "#bbccdd7f");
    this.verifyColor(c, 187, 204, 221, sys.Float.make(0.5), "rgba(187,204,221,0.5)");
    (c = Color.makeRgb(1, 2, 3, sys.Float.make(0.4)));
    this.verifyEq(sys.ObjUtil.coerce(c.rgb(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(66051, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(c.a(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.4), sys.Obj.type$.toNullable()));
    this.verifyEq(c.toHexStr(), "#01020366");
    this.verifyColor(c, 1, 2, 3, sys.Float.make(0.4), "rgba(1,2,3,0.4)");
    (c = Color.makeRgb(51, 34, 17));
    this.verifyEq(sys.ObjUtil.coerce(c.rgb(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3351057, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(c.a(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()));
    this.verifyColor(c, 51, 34, 17, sys.Float.make(1.0), "#321");
    this.verifySame(Color.fromStr("transparent"), Color.transparent());
    this.verifyEq(sys.ObjUtil.coerce(Color.transparent().isTransparent(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(Color.transparent().a(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(Color.fromStr("red").isTransparent(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    return;
  }

  verifyColor(c,r,g,b,a,s) {
    this.verifyEq(sys.ObjUtil.coerce(c.r(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(r, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(c.g(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(g, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(c.b(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(c.a(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(a, sys.Obj.type$.toNullable()));
    this.verifyEq(c.toStr(), s);
    this.verifyEq(c, Color.fromStr(c.toStr()));
    this.verifyEq(c, sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().writeObj(c), sys.Buf.type$.toNullable()).flip(), sys.Buf.type$.toNullable()).readObj());
    this.verifyEq(c, Color.makeRgb(r, g, b, a));
    return;
  }

  testFromStr() {
    const this$ = this;
    this.verifyFromStr("red", Color.make(16711680));
    this.verifyFromStr("DeepPink", Color.make(16716947));
    this.verifyFromStr("LIME", Color.make(65280));
    this.verifyFromStr("#abc", Color.make(11189196));
    this.verifyFromStr("#023", Color.make(8755));
    this.verifyFromStr("#345", Color.make(3359829));
    this.verifyFromStr("#a7b3", Color.make(11171771, sys.Float.make(0.2)));
    this.verifyFromStr("#30CF", Color.make(3342540));
    this.verifyFromStr("#a4b5c6", Color.make(10794438));
    this.verifyFromStr("#dea4b540", Color.make(14591157, sys.Float.make(0.251)));
    this.verifyFromStr("#12345678", Color.make(1193046, sys.ObjUtil.coerce(sys.Str.toFloat(GeomUtil.formatFloat(sys.Float.make(0.47058823529411764))), sys.Float.type$)));
    this.verifyFromStr("rgb(10, 20, 30)", Color.make(660510, sys.Float.make(1.0)));
    this.verifyFromStr("rgb(10 20 30)", Color.make(660510, sys.Float.make(1.0)));
    this.verifyFromStr("rgb(10%, 20%, 30%)", Color.make(1651532, sys.Float.make(1.0)));
    this.verifyFromStr("rgb(10%  20%  30%)", Color.make(1651532, sys.Float.make(1.0)));
    this.verifyFromStr("rgb(10 , 20 , 30 , 0.5)", Color.make(660510, sys.Float.make(0.5)));
    this.verifyFromStr("rgb(10  20  30  50%)", Color.make(660510, sys.Float.make(0.5)));
    this.verifyFromStr("rgb(50% 0% 100% 25%)", Color.make(8323327, sys.Float.make(0.25)));
    this.verifyFromStr("rgb(50%, 0%, 100%, 0.25)", Color.make(8323327, sys.Float.make(0.25)));
    this.verifyFromStr("rgba(10 , 20 , 30 , 0.5)", Color.make(660510, sys.Float.make(0.5)));
    this.verifyFromStr("rgba(10  20  30  50%)", Color.make(660510, sys.Float.make(0.5)));
    this.verifyFromStr("rgba(50% 0% 100% 25%)", Color.make(8323327, sys.Float.make(0.25)));
    this.verifyFromStr("rgba(50%, 0%, 100%, 0.25)", Color.make(8323327, sys.Float.make(0.25)));
    this.verifyFromStr("hsl(120deg 50% 0.75)", Color.makeHsl(sys.Float.make(120.0), sys.Float.make(0.5), sys.Float.make(0.75), sys.Float.make(1.0)));
    this.verifyFromStr("hsl(700, 0.2, 0.3, 0.4)", Color.makeHsl(sys.Float.make(340.0), sys.Float.make(0.2), sys.Float.make(0.3), sys.Float.make(0.4)));
    this.verifyFromStr("hsl(0deg  0.8  70%)", Color.makeHsl(sys.Float.make(0.0), sys.Float.make(0.8), sys.Float.make(0.7), sys.Float.make(1.0)));
    this.verifyFromStr("hsl(0deg  0.8  70%  50%)", Color.makeHsl(sys.Float.make(0.0), sys.Float.make(0.8), sys.Float.make(0.7), sys.Float.make(0.5)));
    this.verifyFromStr("hsla(120deg 50% 0.75)", Color.makeHsl(sys.Float.make(120.0), sys.Float.make(0.5), sys.Float.make(0.75), sys.Float.make(1.0)));
    this.verifyFromStr("hsla(700, 0.2, 0.3, 0.4)", Color.makeHsl(sys.Float.make(340.0), sys.Float.make(0.2), sys.Float.make(0.3), sys.Float.make(0.4)));
    this.verifyFromStr("hsla(0deg  0.8  70%  50%)", Color.makeHsl(sys.Float.make(0.0), sys.Float.make(0.8), sys.Float.make(0.7), sys.Float.make(0.5)));
    this.verifyEq(Color.fromStr("#bc", false), null);
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Color.fromStr("abc");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = Color.fromStr("#xyz", true);
      return;
    });
    return;
  }

  verifyFromStr(s,e) {
    let a = Color.fromStr(s);
    this.verifyEq(a, e);
    let list = Color.listFromStr(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", s), ","), s), " , "), s));
    this.verifyEq(sys.ObjUtil.coerce(list.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(list.get(0), e);
    this.verifyEq(list.get(1), e);
    this.verifyEq(list.get(2), e);
    return;
  }

  testListFromStr() {
    this.verifyEq(Color.listFromStr("#abc, red, rgb(128, 0, 0)"), sys.List.make(Color.type$, [sys.ObjUtil.coerce(Color.fromStr("#abc"), Color.type$), sys.ObjUtil.coerce(Color.fromStr("red"), Color.type$), sys.ObjUtil.coerce(Color.fromStr("rgb(128, 0, 0)"), Color.type$)]));
    this.verifyEq(Color.listFromStr("rgba(128, 0, 0, 50%), #abc, rgb(128, 0, 0)"), sys.List.make(Color.type$, [sys.ObjUtil.coerce(Color.fromStr("rgba(128, 0, 0, 50%)"), Color.type$), sys.ObjUtil.coerce(Color.fromStr("#abc"), Color.type$), sys.ObjUtil.coerce(Color.fromStr("rgb(128, 0, 0)"), Color.type$)]));
    return;
  }

  testEquals() {
    this.verifyEq(Color.make(11189196), Color.make(11189196));
    this.verifyEq(Color.make(11189196, sys.Float.make(0.5)), Color.make(11189196, sys.Float.make(0.5)));
    this.verifyNotEq(Color.make(11144140), Color.make(11189196));
    this.verifyNotEq(Color.make(11189196, sys.Float.make(1.0)), Color.make(11189196, sys.Float.make(0.9)));
    return;
  }

  testHsl() {
    this.verifyHsl(sys.ObjUtil.coerce(0, sys.Obj.type$), sys.Float.make(0.0), sys.Float.make(0.0), sys.Float.make(0.0));
    this.verifyHsl(sys.ObjUtil.coerce(16777215, sys.Obj.type$), sys.Float.make(0.0), sys.Float.make(0.0), sys.Float.make(1.0));
    this.verifyHsl(sys.ObjUtil.coerce(16711680, sys.Obj.type$), sys.Float.make(0.0), sys.Float.make(1.0), sys.Float.make(0.5));
    this.verifyHsl(sys.ObjUtil.coerce(65280, sys.Obj.type$), sys.Float.make(120.0), sys.Float.make(1.0), sys.Float.make(0.5));
    this.verifyHsl(sys.ObjUtil.coerce(255, sys.Obj.type$), sys.Float.make(240.0), sys.Float.make(1.0), sys.Float.make(0.5));
    this.verifyHsl(sys.ObjUtil.coerce(16776960, sys.Obj.type$), sys.Float.make(60.0), sys.Float.make(1.0), sys.Float.make(0.5));
    this.verifyHsl(sys.ObjUtil.coerce(65535, sys.Obj.type$), sys.Float.make(180.0), sys.Float.make(1.0), sys.Float.make(0.5));
    this.verifyHsl(sys.ObjUtil.coerce(16711935, sys.Obj.type$), sys.Float.make(300.0), sys.Float.make(1.0), sys.Float.make(0.5));
    this.verifyHsl(sys.ObjUtil.coerce(12566463, sys.Obj.type$), sys.Float.make(0.0), sys.Float.make(0.0), sys.Float.make(0.749));
    this.verifyHsl(sys.ObjUtil.coerce(8421504, sys.Obj.type$), sys.Float.make(0.0), sys.Float.make(0.0), sys.Float.make(0.501));
    this.verifyHsl(sys.ObjUtil.coerce(8388608, sys.Obj.type$), sys.Float.make(0.0), sys.Float.make(1.0), sys.Float.make(0.25));
    this.verifyHsl(sys.ObjUtil.coerce(8421376, sys.Obj.type$), sys.Float.make(60.0), sys.Float.make(1.0), sys.Float.make(0.25));
    this.verifyHsl(sys.ObjUtil.coerce(32768, sys.Obj.type$), sys.Float.make(120.0), sys.Float.make(1.0), sys.Float.make(0.25));
    this.verifyHsl(sys.ObjUtil.coerce(8388736, sys.Obj.type$), sys.Float.make(300.0), sys.Float.make(1.0), sys.Float.make(0.25));
    this.verifyHsl(sys.ObjUtil.coerce(32896, sys.Obj.type$), sys.Float.make(180.0), sys.Float.make(1.0), sys.Float.make(0.25));
    this.verifyHsl(sys.ObjUtil.coerce(128, sys.Obj.type$), sys.Float.make(240.0), sys.Float.make(1.0), sys.Float.make(0.25));
    this.verifyHsl(sys.ObjUtil.coerce(3328080, sys.Obj.type$), sys.Float.make(132.0), sys.Float.make(0.6), sys.Float.make(0.49));
    this.verifyHsl(sys.ObjUtil.coerce(6592200, sys.Obj.type$), sys.Float.make(210.0), sys.Float.make(0.476), sys.Float.make(0.588));
    this.verifyHsl(sys.ObjUtil.coerce(8266446, sys.Obj.type$), sys.Float.make(272.093), sys.Float.make(0.716), sys.Float.make(0.47));
    this.verifyHsl(sys.ObjUtil.coerce(16569165, sys.Obj.type$), sys.Float.make(45.942), sys.Float.make(0.967), sys.Float.make(0.645));
    this.verifyHsl(sys.ObjUtil.coerce(Color.fromStr("hsl(240 0.4 1)"), sys.Obj.type$), sys.Float.make(0.0), sys.Float.make(0.0), sys.Float.make(1.0));
    return;
  }

  verifyHsl(obj,h,s,l) {
    let c = ((this$) => { let $_u51 = sys.ObjUtil.as(obj, Color.type$); if ($_u51 != null) return $_u51; return Color.make(sys.ObjUtil.coerce(obj, sys.Int.type$)); })(this);
    this.verify(sys.Float.approx(c.h(), h, sys.ObjUtil.coerce(sys.Float.make(0.001), sys.Float.type$.toNullable())));
    this.verify(sys.Float.approx(c.s(), s, sys.ObjUtil.coerce(sys.Float.make(0.001), sys.Float.type$.toNullable())));
    this.verify(sys.Float.approx(c.l(), l, sys.ObjUtil.coerce(sys.Float.make(0.001), sys.Float.type$.toNullable())));
    this.verifyEq(c, Color.makeHsl(c.h(), c.s(), c.l()));
    return;
  }

  testInterpolateRgb() {
    let a = Color.fromStr("#123");
    let b = Color.fromStr("#cba");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(-1.0), "rgb(0 0 0)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(-0.2), "rgb(0 3 27)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(0.0), "rgb(17 34 51)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(0.25), "rgb(63 72 80)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(0.5), "rgb(110 110 110)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(0.75), "rgb(157 148 140)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(1.0), "rgb(204 187 170)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(1.2), "rgb(241 217 193)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(2.0), "rgb(255 255 255)");
    (a = Color.fromStr("rgba(200 70 30 0.9)"));
    (b = Color.fromStr("rgba(250 20 90 0.1)"));
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(-1.0), "rgba(150 120 0 1.0)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(-0.2), "rgba(190 80 18 1.0)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(0.0), "rgba(200 70 30 0.9)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(0.25), "rgba(212 57 45 0.7)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(0.5), "rgba(225 45 60 0.5)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(0.75), "rgba(237 32 75 0.3)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(1.0), "rgba(250 20 90 0.1)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(1.2), "rgba(255 10 102 0.0)");
    this.verifyInterpolateRgb(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(2.0), "rgba(255 0 150 0.0)");
    return;
  }

  verifyInterpolateRgb(a,b,t,expected) {
    let x = Color.interpolateRgb(a, b, t);
    this.verifyRbgEq(x, sys.ObjUtil.coerce(Color.fromStr(expected), Color.type$));
    return;
  }

  testInterpolateHsl() {
    let a = Color.fromStr("hsl(200 0.5 0.9)");
    let b = Color.fromStr("hsl(20 1 0.1)");
    this.verifyInterpolateHsl(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(-1.0), "hsl(360 0 1)");
    this.verifyInterpolateHsl(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(-0.2), "hsl(236 0.4 1)");
    this.verifyInterpolateHsl(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(0.0), "hsl(200 0.5 0.9)");
    this.verifyInterpolateHsl(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(0.25), "hsl(155 0.625 0.7)");
    this.verifyInterpolateHsl(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(0.5), "hsl(110 0.75 0.5)");
    this.verifyInterpolateHsl(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(0.75), "hsl(65 0.875 0.3)");
    this.verifyInterpolateHsl(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(1.0), "hsl(20 1 0.1)");
    this.verifyInterpolateHsl(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(1.2), "hsl(0 1 0)");
    this.verifyInterpolateHsl(sys.ObjUtil.coerce(a, Color.type$), sys.ObjUtil.coerce(b, Color.type$), sys.Float.make(2.0), "hsl(0 1 0)");
    return;
  }

  verifyInterpolateHsl(a,b,t,expected) {
    let r = Color.interpolateHsl(a, b, t);
    let e = Color.fromStr(expected);
    this.verifyHslEq(r, sys.ObjUtil.coerce(e, Color.type$));
    return;
  }

  static hslStr(c) {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("hsl(", GeomUtil.formatFloat(c.h())), " "), GeomUtil.formatFloat(c.s())), " "), GeomUtil.formatFloat(c.l())), " "), GeomUtil.formatFloat(c.a())), ")");
  }

  verifyRbgEq(a,b) {
    this.verifyEq(sys.ObjUtil.coerce(a.r(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.r(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.g(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.g(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.b(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.b(), sys.Obj.type$.toNullable()));
    this.verify(sys.Float.approx(a.a(), b.a()));
    return;
  }

  verifyHslEq(a,b) {
    this.verify(sys.Float.approx(a.h(), b.h(), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Float.type$.toNullable())));
    this.verify(sys.Float.approx(a.s(), b.s(), sys.ObjUtil.coerce(sys.Float.make(0.05), sys.Float.type$.toNullable())));
    this.verify(sys.Float.approx(a.l(), b.l(), sys.ObjUtil.coerce(sys.Float.make(0.05), sys.Float.type$.toNullable())));
    this.verify(sys.Float.approx(a.a(), b.a()));
    return;
  }

  static make() {
    const $self = new ColorTest();
    ColorTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

const p = sys.Pod.add$('graphics');
const xp = sys.Param.noParams$();
let m;
Paint.type$ = p.am$('Paint','sys::Obj',[],{'sys::Js':""},8451,Paint);
Color.type$ = p.at$('Color','sys::Obj',['graphics::Paint'],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8226,Color);
Font.type$ = p.at$('Font','sys::Obj',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8194,Font);
FontMetrics.type$ = p.at$('FontMetrics','sys::Obj',[],{'sys::Js':""},8195,FontMetrics);
FontDataMetrics.type$ = p.at$('FontDataMetrics','graphics::FontMetrics',[],{'sys::Js':""},130,FontDataMetrics);
FontWeight.type$ = p.at$('FontWeight','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,FontWeight);
FontStyle.type$ = p.at$('FontStyle','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,FontStyle);
Image.type$ = p.am$('Image','sys::Obj',[],{'sys::Js':""},8449,Image);
PngImage.type$ = p.am$('PngImage','sys::Obj',['graphics::Image'],{'sys::Js':"",'sys::NoDoc':""},8449,PngImage);
DeviceContext.type$ = p.at$('DeviceContext','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8194,DeviceContext);
FontData.type$ = p.at$('FontData','sys::Obj',[],{'sys::Js':"",'sys::NoDoc':""},8194,FontData);
Stroke.type$ = p.at$('Stroke','sys::Obj',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8194,Stroke);
StrokeCap.type$ = p.at$('StrokeCap','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,StrokeCap);
StrokeJoin.type$ = p.at$('StrokeJoin','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,StrokeJoin);
Point.type$ = p.at$('Point','sys::Obj',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8194,Point);
Size.type$ = p.at$('Size','sys::Obj',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8194,Size);
Rect.type$ = p.at$('Rect','sys::Obj',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8194,Rect);
Insets.type$ = p.at$('Insets','sys::Obj',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8194,Insets);
GeomUtil.type$ = p.at$('GeomUtil','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8194,GeomUtil);
GraphicsPath.type$ = p.am$('GraphicsPath','sys::Obj',[],{'sys::Js':""},8449,GraphicsPath);
Graphics.type$ = p.am$('Graphics','sys::Obj',[],{'sys::Js':""},8449,Graphics);
Transform.type$ = p.at$('Transform','sys::Obj',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8194,Transform);
GraphicsEnv.type$ = p.am$('GraphicsEnv','sys::Obj',[],{'sys::Js':""},8451,GraphicsEnv);
StrokeTest.type$ = p.at$('StrokeTest','sys::Test',[],{'sys::Js':""},8192,StrokeTest);
TransformTest.type$ = p.at$('TransformTest','sys::Test',[],{},8192,TransformTest);
GeomTest.type$ = p.at$('GeomTest','sys::Test',[],{'sys::Js':""},8192,GeomTest);
FontTest.type$ = p.at$('FontTest','sys::Test',[],{'sys::Js':""},8192,FontTest);
ColorTest.type$ = p.at$('ColorTest','sys::Test',[],{'sys::Js':""},8192,ColorTest);
Paint.type$.am$('isColorPaint',270337,'sys::Bool',xp,{}).am$('asColorPaint',270337,'graphics::Color',xp,{});
Color.type$.af$('transparent',106498,'graphics::Color',{}).af$('black',106498,'graphics::Color',{}).af$('white',106498,'graphics::Color',{}).af$('rgb',73730,'sys::Int',{}).af$('a',73730,'sys::Float',{}).af$('byKeyword',100354,'[sys::Str:graphics::Color]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rgb','sys::Int',true),new sys.Param('a','sys::Float',true)]),{}).am$('makeRgb',40962,'graphics::Color',sys.List.make(sys.Param.type$,[new sys.Param('r','sys::Int',false),new sys.Param('g','sys::Int',false),new sys.Param('b','sys::Int',false),new sys.Param('a','sys::Float',true)]),{}).am$('makeHsl',40962,'graphics::Color',sys.List.make(sys.Param.type$,[new sys.Param('h','sys::Float',false),new sys.Param('s','sys::Float',false),new sys.Param('l','sys::Float',false),new sys.Param('a','sys::Float',true)]),{}).am$('fromStr',40966,'graphics::Color?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('listFromStr',40962,'graphics::Color[]?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('parseHex',34818,'graphics::Color',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('parseFunc',34818,'graphics::Color',sys.List.make(sys.Param.type$,[new sys.Param('func','sys::Str',false),new sys.Param('args','sys::Str[]',false)]),{}).am$('parseRgbArg',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('parseDegArg',34818,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('parsePercentArg',34818,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str?',false)]),{}).am$('r',8192,'sys::Int',xp,{}).am$('g',8192,'sys::Int',xp,{}).am$('b',8192,'sys::Int',xp,{}).am$('h',8192,'sys::Float',xp,{}).am$('s',8192,'sys::Float',xp,{}).am$('l',8192,'sys::Float',xp,{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('toHexStr',8192,'sys::Str',xp,{}).am$('isColorPaint',271360,'sys::Bool',xp,{}).am$('asColorPaint',271360,'graphics::Color',xp,{}).am$('isTransparent',8192,'sys::Bool',xp,{}).am$('opacity',8192,'graphics::Color',sys.List.make(sys.Param.type$,[new sys.Param('opacity','sys::Float',true)]),{}).am$('lighter',8192,'graphics::Color',sys.List.make(sys.Param.type$,[new sys.Param('percentage','sys::Float',true)]),{}).am$('darker',8192,'graphics::Color',sys.List.make(sys.Param.type$,[new sys.Param('percentage','sys::Float',true)]),{}).am$('saturate',8192,'graphics::Color',sys.List.make(sys.Param.type$,[new sys.Param('percentage','sys::Float',true)]),{}).am$('desaturate',8192,'graphics::Color',sys.List.make(sys.Param.type$,[new sys.Param('percentage','sys::Float',true)]),{}).am$('interpolateRgb',40962,'graphics::Color',sys.List.make(sys.Param.type$,[new sys.Param('a','graphics::Color',false),new sys.Param('b','graphics::Color',false),new sys.Param('t','sys::Float',false)]),{}).am$('interpolateHsl',40962,'graphics::Color',sys.List.make(sys.Param.type$,[new sys.Param('a','graphics::Color',false),new sys.Param('b','graphics::Color',false),new sys.Param('t','sys::Float',false)]),{}).am$('interpolateDeg',34818,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Float',false),new sys.Param('b','sys::Float',false),new sys.Param('t','sys::Float',false)]),{}).am$('interpolateByte',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Int',false),new sys.Param('b','sys::Int',false),new sys.Param('t','sys::Float',false)]),{}).am$('interpolatePercent',34818,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Float',false),new sys.Param('b','sys::Float',false),new sys.Param('t','sys::Float',false)]),{}).am$('keywords',40962,'sys::Str[]',xp,{'sys::NoDoc':""}).am$('static$init',165890,'sys::Void',xp,{});
Font.type$.af$('names',73730,'sys::Str[]',{}).af$('size',73730,'sys::Float',{}).af$('weight',73730,'graphics::FontWeight',{}).af$('style',73730,'graphics::FontStyle',{}).af$('data',67586,'graphics::FontData?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('makeFields',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('names','sys::Str[]',false),new sys.Param('size','sys::Float',false),new sys.Param('weight','graphics::FontWeight',true),new sys.Param('style','graphics::FontStyle',true)]),{'sys::NoDoc':""}).am$('fromStr',40966,'graphics::Font?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('decodeNames',34818,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('decodeSize',34818,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('decodeWeight',34818,'graphics::FontWeight',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('decodeStyle',34818,'graphics::FontStyle',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('fromProps',40966,'graphics::Font?',sys.List.make(sys.Param.type$,[new sys.Param('props','[sys::Str:sys::Str]',false)]),{}).am$('toProps',8192,'[sys::Str:sys::Str]',xp,{}).am$('name',8192,'sys::Str',xp,{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('toSize',8192,'graphics::Font',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Float',false)]),{}).am$('toStyle',8192,'graphics::Font',sys.List.make(sys.Param.type$,[new sys.Param('style','graphics::FontStyle',false)]),{}).am$('toWeight',8192,'graphics::Font',sys.List.make(sys.Param.type$,[new sys.Param('weight','graphics::FontWeight',false)]),{}).am$('normalize',8192,'graphics::Font',xp,{'sys::NoDoc':""}).am$('metrics',8192,'graphics::FontMetrics',sys.List.make(sys.Param.type$,[new sys.Param('dc','graphics::DeviceContext',true)]),{'sys::NoDoc':""});
FontMetrics.type$.am$('height',270337,'sys::Float',xp,{}).am$('ascent',270337,'sys::Float',xp,{}).am$('descent',270337,'sys::Float',xp,{}).am$('leading',270337,'sys::Float',xp,{}).am$('width',270337,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
FontDataMetrics.type$.af$('fudge',100354,'sys::Float',{}).af$('data',67586,'graphics::FontData',{}).af$('size',67586,'sys::Float',{}).af$('ratio',67586,'sys::Float',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dc','graphics::DeviceContext',false),new sys.Param('size','sys::Float',false),new sys.Param('data','graphics::FontData',false)]),{'sys::NoDoc':""}).am$('height',271360,'sys::Float',xp,{}).am$('ascent',271360,'sys::Float',xp,{}).am$('descent',271360,'sys::Float',xp,{}).am$('leading',271360,'sys::Float',xp,{}).am$('width',271360,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('lastChar',8192,'sys::Int',xp,{'sys::NoDoc':""}).am$('static$init',165890,'sys::Void',xp,{});
FontWeight.type$.af$('thin',106506,'graphics::FontWeight',{}).af$('extraLight',106506,'graphics::FontWeight',{}).af$('light',106506,'graphics::FontWeight',{}).af$('normal',106506,'graphics::FontWeight',{}).af$('medium',106506,'graphics::FontWeight',{}).af$('semiBold',106506,'graphics::FontWeight',{}).af$('bold',106506,'graphics::FontWeight',{}).af$('extraBold',106506,'graphics::FontWeight',{}).af$('black',106506,'graphics::FontWeight',{}).af$('vals',106498,'graphics::FontWeight[]',{}).af$('num',73730,'sys::Int',{}).am$('isNormal',8192,'sys::Bool',xp,{}).am$('fromNum',40962,'graphics::FontWeight?',sys.List.make(sys.Param.type$,[new sys.Param('num','sys::Int',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('decode',40962,'graphics::FontWeight?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('num','sys::Int',false)]),{}).am$('fromStr',40966,'graphics::FontWeight?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
FontStyle.type$.af$('normal',106506,'graphics::FontStyle',{}).af$('italic',106506,'graphics::FontStyle',{}).af$('oblique',106506,'graphics::FontStyle',{}).af$('vals',106498,'graphics::FontStyle[]',{}).am$('isNormal',8192,'sys::Bool',xp,{}).am$('decode',40962,'graphics::FontStyle?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'graphics::FontStyle?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Image.type$.af$('mimePng',106498,'sys::MimeType',{'sys::NoDoc':""}).af$('mimeGif',106498,'sys::MimeType',{'sys::NoDoc':""}).af$('mimeJpeg',106498,'sys::MimeType',{'sys::NoDoc':""}).af$('mimeSvg',106498,'sys::MimeType',{'sys::NoDoc':""}).am$('render',40962,'graphics::Image',sys.List.make(sys.Param.type$,[new sys.Param('mime','sys::MimeType',false),new sys.Param('size','graphics::Size',false),new sys.Param('f','|graphics::Graphics->sys::Void|',false)]),{}).am$('uri',270337,'sys::Uri',xp,{}).am$('isLoaded',270337,'sys::Bool',xp,{}).am$('mime',270337,'sys::MimeType',xp,{}).am$('size',270337,'graphics::Size',xp,{}).am$('w',270336,'sys::Float',xp,{}).am$('h',270336,'sys::Float',xp,{}).am$('write',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('get',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('prop','sys::Str',false)]),{'sys::NoDoc':"",'sys::Operator':""}).am$('mimeForExt',40962,'sys::MimeType',sys.List.make(sys.Param.type$,[new sys.Param('ext','sys::Str',false)]),{'sys::NoDoc':""}).am$('static$init',165890,'sys::Void',xp,{});
PngImage.type$.am$('hasAlpha',8192,'sys::Bool',xp,{}).am$('hasPalette',8192,'sys::Bool',xp,{}).am$('hasTransparency',8192,'sys::Bool',xp,{}).am$('colorType',8192,'sys::Int',xp,{}).am$('colors',8192,'sys::Int',xp,{}).am$('pixelBits',8192,'sys::Int',xp,{}).am$('palette',8192,'sys::Buf',xp,{}).am$('transparency',8192,'sys::Buf',xp,{}).am$('imgData',8192,'sys::Buf',xp,{}).am$('pixels',270337,'sys::Buf',xp,{});
DeviceContext.type$.af$('curRef',100354,'graphics::DeviceContext',{}).af$('dpi',73730,'sys::Float',{}).am$('cur',40962,'graphics::DeviceContext',xp,{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dpi','sys::Float',false)]),{'sys::NoDoc':""}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
FontData.type$.af$('registry',106498,'[sys::Str:graphics::FontData]',{}).af$('key',73730,'sys::Str',{}).af$('name',73730,'sys::Str',{}).af$('weight',73730,'graphics::FontWeight',{}).af$('style',73730,'graphics::FontStyle',{}).af$('height',73730,'sys::Int',{}).af$('leading',73730,'sys::Int',{}).af$('ascent',73730,'sys::Int',{}).af$('descent',73730,'sys::Int',{}).af$('widths',73730,'sys::Int[]',{}).af$('charToWidth',67586,'sys::Str',{}).af$('lastChar',73730,'sys::Int',{}).am$('find',40962,'graphics::FontData?',sys.List.make(sys.Param.type$,[new sys.Param('f','graphics::Font',false)]),{}).am$('register',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:graphics::FontData]',false),new sys.Param('m','graphics::FontData',false)]),{}).am$('toKey',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('style','graphics::FontStyle',false),new sys.Param('weight','graphics::FontWeight',false),new sys.Param('name','sys::Str',false)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('ascent','sys::Int',false),new sys.Param('descent','sys::Int',false),new sys.Param('widths','sys::Int[]',false),new sys.Param('charToWidth','sys::Str',false)]),{}).am$('normalize',40962,'graphics::Font',sys.List.make(sys.Param.type$,[new sys.Param('f','graphics::Font',false)]),{}).am$('toNormalize',34818,'graphics::FontData?',sys.List.make(sys.Param.type$,[new sys.Param('style','graphics::FontStyle',false),new sys.Param('weight','graphics::FontWeight',false),new sys.Param('name','sys::Str',false)]),{}).am$('charWidth',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('ch','sys::Int',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Stroke.type$.af$('defVal',106498,'graphics::Stroke',{}).af$('none',106498,'graphics::Stroke',{}).af$('width',73730,'sys::Float',{}).af$('dash',73730,'sys::Str?',{}).af$('cap',73730,'graphics::StrokeCap',{}).af$('join',73730,'graphics::StrokeJoin',{}).am$('fromStr',40966,'graphics::Stroke?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('makeFields',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('width','sys::Float',true),new sys.Param('dash','sys::Str?',true),new sys.Param('cap','graphics::StrokeCap',true),new sys.Param('join','graphics::StrokeJoin',true)]),{}).am$('isNone',8192,'sys::Bool',xp,{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('toSize',8192,'graphics::Stroke',sys.List.make(sys.Param.type$,[new sys.Param('newWidth','sys::Float',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
StrokeCap.type$.af$('butt',106506,'graphics::StrokeCap',{}).af$('round',106506,'graphics::StrokeCap',{}).af$('square',106506,'graphics::StrokeCap',{}).af$('vals',106498,'graphics::StrokeCap[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'graphics::StrokeCap?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
StrokeJoin.type$.af$('bevel',106506,'graphics::StrokeJoin',{}).af$('miter',106506,'graphics::StrokeJoin',{}).af$('radius',106506,'graphics::StrokeJoin',{}).af$('vals',106498,'graphics::StrokeJoin[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'graphics::StrokeJoin?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Point.type$.af$('defVal',106498,'graphics::Point',{}).af$('x',73730,'sys::Float',{}).af$('y',73730,'sys::Float',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('makeInt',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Int',false),new sys.Param('y','sys::Int',false)]),{}).am$('fromStr',40966,'graphics::Point?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('translate',8192,'graphics::Point',sys.List.make(sys.Param.type$,[new sys.Param('t','graphics::Point',false)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
Size.type$.af$('defVal',106498,'graphics::Size',{}).af$('w',73730,'sys::Float',{}).af$('h',73730,'sys::Float',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('makeInt',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('w','sys::Int',false),new sys.Param('h','sys::Int',false)]),{}).am$('fromStr',40966,'graphics::Size?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Rect.type$.af$('defVal',106498,'graphics::Rect',{}).af$('x',73730,'sys::Float',{}).af$('y',73730,'sys::Float',{}).af$('w',73730,'sys::Float',{}).af$('h',73730,'sys::Float',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('makeInt',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Int',false),new sys.Param('y','sys::Int',false),new sys.Param('w','sys::Int',false),new sys.Param('h','sys::Int',false)]),{}).am$('makePosSize',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','graphics::Point',false),new sys.Param('s','graphics::Size',false)]),{}).am$('fromStr',40966,'graphics::Rect?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('pos',8192,'graphics::Point',xp,{}).am$('size',8192,'graphics::Size',xp,{}).am$('contains',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('pt','graphics::Point',false)]),{}).am$('intersects',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','graphics::Rect',false)]),{}).am$('intersection',8192,'graphics::Rect',sys.List.make(sys.Param.type$,[new sys.Param('that','graphics::Rect',false)]),{}).am$('union',8192,'graphics::Rect',sys.List.make(sys.Param.type$,[new sys.Param('that','graphics::Rect',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Insets.type$.af$('defVal',106498,'graphics::Insets',{}).af$('top',73730,'sys::Float',{}).af$('right',73730,'sys::Float',{}).af$('bottom',73730,'sys::Float',{}).af$('left',73730,'sys::Float',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('top','sys::Num',false),new sys.Param('right','sys::Num?',true),new sys.Param('bottom','sys::Num?',true),new sys.Param('left','sys::Num?',true)]),{}).am$('fromStr',40966,'graphics::Insets?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('toSize',8192,'graphics::Size',xp,{}).am$('w',8192,'sys::Float',xp,{}).am$('h',8192,'sys::Float',xp,{}).am$('isNone',8192,'sys::Bool',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
GeomUtil.type$.am$('split',40962,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('parseFloatList',40962,'sys::Float[]',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('formatFloats2',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Float',false),new sys.Param('b','sys::Float',false)]),{}).am$('formatFloats4',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Float',false),new sys.Param('b','sys::Float',false),new sys.Param('c','sys::Float',false),new sys.Param('d','sys::Float',false)]),{}).am$('formatFloat',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::Float',false)]),{}).am$('make',139268,'sys::Void',xp,{});
GraphicsPath.type$.am$('draw',270337,'sys::This',xp,{}).am$('fill',270337,'sys::This',xp,{}).am$('clip',270337,'sys::This',xp,{}).am$('moveTo',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('lineTo',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('arc',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('radius','sys::Float',false),new sys.Param('start','sys::Float',false),new sys.Param('sweep','sys::Float',false)]),{}).am$('curveTo',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cp1x','sys::Float',false),new sys.Param('cp1y','sys::Float',false),new sys.Param('cp2x','sys::Float',false),new sys.Param('cp2y','sys::Float',false),new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('quadTo',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cpx','sys::Float',false),new sys.Param('cpy','sys::Float',false),new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('close',270337,'sys::This',xp,{});
Graphics.type$.af$('paint',270337,'graphics::Paint',{}).af$('color',270337,'graphics::Color',{}).af$('stroke',270337,'graphics::Stroke',{}).af$('alpha',270337,'sys::Float',{}).af$('font',270337,'graphics::Font',{}).am$('metrics',270337,'graphics::FontMetrics',xp,{}).am$('path',270337,'graphics::GraphicsPath',xp,{}).am$('drawLine',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x1','sys::Float',false),new sys.Param('y1','sys::Float',false),new sys.Param('x2','sys::Float',false),new sys.Param('y2','sys::Float',false)]),{}).am$('drawRect',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('fillRect',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('clipRect',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('drawRoundRect',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false),new sys.Param('wArc','sys::Float',false),new sys.Param('hArc','sys::Float',false)]),{}).am$('fillRoundRect',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false),new sys.Param('wArc','sys::Float',false),new sys.Param('hArc','sys::Float',false)]),{}).am$('clipRoundRect',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false),new sys.Param('wArc','sys::Float',false),new sys.Param('hArc','sys::Float',false)]),{}).am$('drawEllipse',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('fillEllipse',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('drawText',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('drawImage',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('img','graphics::Image',false),new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',true),new sys.Param('h','sys::Float',true)]),{}).am$('drawImageRegion',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('img','graphics::Image',false),new sys.Param('src','graphics::Rect',false),new sys.Param('dst','graphics::Rect',false)]),{}).am$('translate',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('transform',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('transform','graphics::Transform',false)]),{}).am$('push',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('r','graphics::Rect?',true)]),{}).am$('pop',270337,'sys::This',xp,{}).am$('dispose',270337,'sys::Void',xp,{});
Transform.type$.af$('a',73730,'sys::Float',{}).af$('b',73730,'sys::Float',{}).af$('c',73730,'sys::Float',{}).af$('d',73730,'sys::Float',{}).af$('e',73730,'sys::Float',{}).af$('f',73730,'sys::Float',{}).af$('defVal',106498,'graphics::Transform',{}).am$('fromStr',40966,'graphics::Transform?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('parseFunc',34818,'graphics::Transform',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('translate',40962,'graphics::Transform',sys.List.make(sys.Param.type$,[new sys.Param('tx','sys::Float',false),new sys.Param('ty','sys::Float',false)]),{}).am$('scale',40962,'graphics::Transform',sys.List.make(sys.Param.type$,[new sys.Param('sx','sys::Float',false),new sys.Param('sy','sys::Float',false)]),{}).am$('rotate',40962,'graphics::Transform',sys.List.make(sys.Param.type$,[new sys.Param('angle','sys::Float',false),new sys.Param('cx','sys::Float?',true),new sys.Param('cy','sys::Float?',true)]),{}).am$('skewX',40962,'graphics::Transform',sys.List.make(sys.Param.type$,[new sys.Param('angle','sys::Float',false)]),{}).am$('skewY',40962,'graphics::Transform',sys.List.make(sys.Param.type$,[new sys.Param('angle','sys::Float',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Float',false),new sys.Param('b','sys::Float',false),new sys.Param('c','sys::Float',false),new sys.Param('d','sys::Float',false),new sys.Param('e','sys::Float',false),new sys.Param('f','sys::Float',false)]),{}).am$('mult',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('that','graphics::Transform',false)]),{'sys::Operator':""}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('f2s',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::Float',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
GraphicsEnv.type$.af$('curRef',100354,'concurrent::AtomicRef',{}).am$('cur',40962,'graphics::GraphicsEnv',xp,{}).am$('init',34818,'graphics::GraphicsEnv?',xp,{}).am$('install',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','graphics::GraphicsEnv',false)]),{'sys::NoDoc':""}).am$('image',270337,'graphics::Image',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('data','sys::Buf?',true)]),{}).am$('renderImage',270336,'graphics::Image',sys.List.make(sys.Param.type$,[new sys.Param('mime','sys::MimeType',false),new sys.Param('size','graphics::Size',false),new sys.Param('f','|graphics::Graphics->sys::Void|',false)]),{'sys::NoDoc':""}).am$('static$init',165890,'sys::Void',xp,{});
StrokeTest.type$.am$('testMake',8192,'sys::Void',xp,{}).am$('verifyStroke',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','graphics::Stroke',false),new sys.Param('w','sys::Float',false),new sys.Param('dash','sys::Str?',false),new sys.Param('cap','graphics::StrokeCap',false),new sys.Param('join','graphics::StrokeJoin',false)]),{}).am$('make',139268,'sys::Void',xp,{});
TransformTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('verifyTransform',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('t','graphics::Transform',false),new sys.Param('expected','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
GeomTest.type$.am$('testSplit',8192,'sys::Void',xp,{}).am$('testPoint',8192,'sys::Void',xp,{}).am$('testSize',8192,'sys::Void',xp,{}).am$('testRect',8192,'sys::Void',xp,{}).am$('verifyIntersection',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','graphics::Rect',false),new sys.Param('b','graphics::Rect',false),new sys.Param('r','graphics::Rect',false)]),{}).am$('verifyUnion',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','graphics::Rect',false),new sys.Param('b','graphics::Rect',false),new sys.Param('r','graphics::Rect',false)]),{}).am$('testInsets',8192,'sys::Void',xp,{}).am$('verifySer',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('make',139268,'sys::Void',xp,{});
FontTest.type$.am$('testWeight',8192,'sys::Void',xp,{}).am$('testMake',8192,'sys::Void',xp,{}).am$('verifyFont',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','graphics::Font',false),new sys.Param('names','sys::Str[]',false),new sys.Param('size','sys::Float',false),new sys.Param('weight','graphics::FontWeight',false),new sys.Param('style','graphics::FontStyle',false),new sys.Param('str','sys::Str',false)]),{}).am$('testNormalize',8192,'sys::Void',xp,{}).am$('verifyNormalize',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('expected','sys::Str',false)]),{}).am$('testProps',8192,'sys::Void',xp,{}).am$('verifyProps',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('props','[sys::Str:sys::Str]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ColorTest.type$.am$('testMake',8192,'sys::Void',xp,{}).am$('verifyColor',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','graphics::Color',false),new sys.Param('r','sys::Int',false),new sys.Param('g','sys::Int',false),new sys.Param('b','sys::Int',false),new sys.Param('a','sys::Float',false),new sys.Param('s','sys::Str',false)]),{}).am$('testFromStr',8192,'sys::Void',xp,{}).am$('verifyFromStr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('e','graphics::Color',false)]),{}).am$('testListFromStr',8192,'sys::Void',xp,{}).am$('testEquals',8192,'sys::Void',xp,{}).am$('testHsl',8192,'sys::Void',xp,{}).am$('verifyHsl',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false),new sys.Param('h','sys::Float',false),new sys.Param('s','sys::Float',false),new sys.Param('l','sys::Float',false)]),{}).am$('testInterpolateRgb',8192,'sys::Void',xp,{}).am$('verifyInterpolateRgb',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','graphics::Color',false),new sys.Param('b','graphics::Color',false),new sys.Param('t','sys::Float',false),new sys.Param('expected','sys::Str',false)]),{}).am$('testInterpolateHsl',8192,'sys::Void',xp,{}).am$('verifyInterpolateHsl',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','graphics::Color',false),new sys.Param('b','graphics::Color',false),new sys.Param('t','sys::Float',false),new sys.Param('expected','sys::Str',false)]),{}).am$('hslStr',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('c','graphics::Color',false)]),{}).am$('verifyRbgEq',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','graphics::Color',false),new sys.Param('b','graphics::Color',false)]),{}).am$('verifyHslEq',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','graphics::Color',false),new sys.Param('b','graphics::Color',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "graphics");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;concurrent 1.0");
m.set("pod.summary", "Graphics API");
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
  Paint,
  Color,
  Font,
  FontMetrics,
  FontWeight,
  FontStyle,
  Image,
  PngImage,
  DeviceContext,
  FontData,
  Stroke,
  StrokeCap,
  StrokeJoin,
  Point,
  Size,
  Rect,
  Insets,
  GeomUtil,
  GraphicsPath,
  Graphics,
  Transform,
  GraphicsEnv,
  StrokeTest,
  TransformTest,
  GeomTest,
  FontTest,
  ColorTest,
};
