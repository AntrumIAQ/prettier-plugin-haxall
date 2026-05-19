// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as graphics from './graphics.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class JpegDecoder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#sof_markers = sys.ObjUtil.coerce(((this$) => { let $_u0 = sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65472, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65473, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65474, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65475, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65477, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65478, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65479, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65481, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65482, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65483, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65485, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65486, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65487, sys.Obj.type$.toNullable())]); if ($_u0 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(65472, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65473, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65474, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65475, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65477, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65478, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65479, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65481, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65482, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65483, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65485, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65486, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65487, sys.Obj.type$.toNullable())])); })(this), sys.Type.find("sys::Int[]"));
    this.#isJFIF = false;
    return;
  }

  typeof() { return JpegDecoder.type$; }

  static #magic = undefined;

  static magic() {
    if (JpegDecoder.#magic === undefined) {
      JpegDecoder.static$init();
      if (JpegDecoder.#magic === undefined) JpegDecoder.#magic = 0;
    }
    return JpegDecoder.#magic;
  }

  static #app0 = undefined;

  static app0() {
    if (JpegDecoder.#app0 === undefined) {
      JpegDecoder.static$init();
      if (JpegDecoder.#app0 === undefined) JpegDecoder.#app0 = 0;
    }
    return JpegDecoder.#app0;
  }

  #sof_markers = null;

  // private field reflection only
  __sof_markers(it) { if (it === undefined) return this.#sof_markers; else this.#sof_markers = it; }

  #uri = null;

  // private field reflection only
  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #in = null;

  // private field reflection only
  __in(it) { if (it === undefined) return this.#in; else this.#in = it; }

  #isJFIF = false;

  // private field reflection only
  __isJFIF(it) { if (it === undefined) return this.#isJFIF; else this.#isJFIF = it; }

  static make(uri,in$) {
    const $self = new JpegDecoder();
    JpegDecoder.make$($self,uri,in$);
    return $self;
  }

  static make$($self,uri,in$) {
    ;
    $self.#uri = uri;
    $self.#in = in$;
    return;
  }

  static isJpeg(buf) {
    return sys.ObjUtil.equals(JpegDecoder.magic(), buf.getRange(sys.Range.make(0, 2, true)).readU2());
  }

  decode() {
    if (sys.ObjUtil.compareNE(JpegDecoder.magic(), this.#in.readU2())) {
      throw sys.IOErr.make("Missing SOI");
    }
    ;
    while (true) {
      let m = this.readMarker();
      if (sys.ObjUtil.equals(JpegDecoder.app0(), m)) {
        this.readApp0();
      }
      else {
        if (this.#sof_markers.contains(sys.ObjUtil.coerce(m, sys.Obj.type$.toNullable()))) {
          return this.readSof();
        }
        else {
          this.skipSegment();
        }
        ;
      }
      ;
    }
    ;
    throw sys.IOErr.make("Invalid JPEG");
  }

  readApp0() {
    let len = this.#in.readU2();
    let seg = this.readSegment(sys.Int.minus(len, 2));
    try {
      this.#isJFIF = sys.ObjUtil.equals("JFIF\u0000", seg.readChars(5));
    }
    catch ($_u1) {
      $_u1 = sys.Err.make($_u1);
      if ($_u1 instanceof sys.IOErr) {
        let e = $_u1;
        ;
        this.#isJFIF = false;
      }
      else {
        throw $_u1;
      }
    }
    ;
    return;
  }

  readSof() {
    const this$ = this;
    let props = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    let frameLen = this.#in.readU2();
    let bitsPerSample = this.#in.readU1();
    let height = this.#in.readU2();
    let width = this.#in.readU2();
    let numComps = this.#in.readU1();
    if (sys.ObjUtil.compareLE(height, 0)) {
      throw sys.IOErr.make(sys.Str.plus("Invalid height: ", sys.ObjUtil.coerce(height, sys.Obj.type$.toNullable())));
    }
    ;
    if (sys.ObjUtil.compareLE(width, 0)) {
      throw sys.IOErr.make(sys.Str.plus("Invalid width: ", sys.ObjUtil.coerce(width, sys.Obj.type$.toNullable())));
    }
    ;
    if (sys.ObjUtil.compareNE(frameLen, sys.Int.plus(8, sys.Int.mult(3, numComps)))) {
      throw sys.IOErr.make(sys.Str.plus("Invalid SOF frame length: ", sys.ObjUtil.coerce(frameLen, sys.Obj.type$.toNullable())));
    }
    ;
    let size = graphics.Size.makeInt(width, height);
    props.set("colorSpace", this.toColorSpace(numComps));
    props.set("colorSpaceBits", sys.ObjUtil.coerce(bitsPerSample, sys.Obj.type$));
    return ServerImage.make((it) => {
      it.__uri(this$.#uri);
      it.__mime(graphics.Image.mimeJpeg());
      it.__size(size);
      it.__props(sys.ObjUtil.coerce(((this$) => { let $_u2 = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(props), sys.Type.find("[sys::Str:sys::Obj]")); if ($_u2 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(props), sys.Type.find("[sys::Str:sys::Obj]"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      return;
    });
  }

  toColorSpace(numComps) {
    let $_u3 = numComps;
    if (sys.ObjUtil.equals($_u3, 1)) {
      return "Gray";
    }
    else if (sys.ObjUtil.equals($_u3, 3)) {
      return ((this$) => { if (this$.#isJFIF) return "YCbCr"; return "RGB"; })(this);
    }
    else if (sys.ObjUtil.equals($_u3, 4)) {
      return "CMYK";
    }
    ;
    throw sys.IOErr.make(sys.Str.plus(sys.Str.plus("Unsupported color space for ", sys.ObjUtil.coerce(numComps, sys.Obj.type$.toNullable())), " components"));
  }

  skipSegment() {
    let len = this.#in.readU2();
    this.#in.readBufFully(null, sys.Int.minus(len, 2));
    return;
  }

  readMarker() {
    let m = this.#in.readU2();
    if (!this.isMarker(m)) {
      throw sys.IOErr.make(sys.Str.plus("expected marker, got ", sys.Int.toHex(m, sys.ObjUtil.coerce(4, sys.Int.type$.toNullable()))));
    }
    ;
    return m;
  }

  isMarker(word) {
    let high = sys.Int.shiftr(sys.Int.and(word, 65535), 8);
    if (sys.ObjUtil.compareNE(high, 255)) {
      return false;
    }
    ;
    let low = sys.Int.and(word, 255);
    if ((sys.ObjUtil.equals(low, 0) || sys.ObjUtil.equals(low, 255))) {
      return false;
    }
    ;
    return true;
  }

  readSegment(len) {
    let segment = sys.Buf.make();
    this.#in.readBuf(sys.ObjUtil.coerce(segment, sys.Buf.type$), len);
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(segment.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$);
  }

  static static$init() {
    JpegDecoder.#magic = 65496;
    JpegDecoder.#app0 = 65504;
    return;
  }

}

class SvgDecoder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SvgDecoder.type$; }

  #uri = null;

  // private field reflection only
  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #in = null;

  // private field reflection only
  __in(it) { if (it === undefined) return this.#in; else this.#in = it; }

  static make(uri,in$) {
    const $self = new SvgDecoder();
    SvgDecoder.make$($self,uri,in$);
    return $self;
  }

  static make$($self,uri,in$) {
    $self.#uri = uri;
    $self.#in = in$;
    return;
  }

  static isSvg(buf) {
    if (sys.ObjUtil.compareNE(buf.get(0), 60)) {
      return false;
    }
    ;
    if ((sys.ObjUtil.equals(buf.get(1), 115) && sys.ObjUtil.equals(buf.get(2), 118) && sys.ObjUtil.equals(buf.get(3), 103))) {
      return true;
    }
    ;
    if ((sys.ObjUtil.equals(buf.get(1), 63) && sys.ObjUtil.equals(buf.get(2), 120) && sys.ObjUtil.equals(buf.get(3), 109) && sys.ObjUtil.equals(buf.get(4), 108))) {
      return true;
    }
    ;
    return false;
  }

  decode() {
    const this$ = this;
    let width = sys.Float.make(100.0);
    let height = sys.Float.make(100.0);
    let str = this.#in.readAllStr();
    let attrName = "viewBox=";
    let attri = sys.Str.index(str, attrName);
    if (attri != null) {
      attri = sys.Int.plus(sys.ObjUtil.coerce(attri, sys.Int.type$), sys.Str.size(attrName));
      let quote = sys.Str.get(str, sys.ObjUtil.coerce(attri, sys.Int.type$));
      let endi = sys.Str.index(str, sys.Int.toChar(quote), sys.Int.plus(sys.ObjUtil.coerce(attri, sys.Int.type$), 1));
      let val = sys.Str.getRange(str, sys.Range.make(sys.ObjUtil.coerce(attri, sys.Int.type$), sys.ObjUtil.coerce(endi, sys.Int.type$), true));
      let nums = sys.Str.split(val);
      (width = sys.ObjUtil.coerce(sys.Float.fromStr(nums.get(2)), sys.Float.type$));
      (height = sys.ObjUtil.coerce(sys.Float.fromStr(nums.get(3)), sys.Float.type$));
    }
    ;
    return ServerImage.make((it) => {
      it.__uri(this$.#uri);
      it.__mime(graphics.Image.mimeSvg());
      it.__size(graphics.Size.make(width, height));
      it.__props(sys.ObjUtil.coerce(((this$) => { let $_u5 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")); if ($_u5 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      return;
    });
  }

}

class PngDecoder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#props = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    this.#palette = sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$);
    this.#transparency = sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$);
    this.#imgData = sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$);
    return;
  }

  typeof() { return PngDecoder.type$; }

  static #magic = undefined;

  static magic() {
    if (PngDecoder.#magic === undefined) {
      PngDecoder.static$init();
      if (PngDecoder.#magic === undefined) PngDecoder.#magic = 0;
    }
    return PngDecoder.#magic;
  }

  #uri = null;

  // private field reflection only
  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #in = null;

  // private field reflection only
  __in(it) { if (it === undefined) return this.#in; else this.#in = it; }

  #props = null;

  // private field reflection only
  __props(it) { if (it === undefined) return this.#props; else this.#props = it; }

  #width = null;

  // private field reflection only
  __width(it) { if (it === undefined) return this.#width; else this.#width = it; }

  #height = null;

  // private field reflection only
  __height(it) { if (it === undefined) return this.#height; else this.#height = it; }

  #bitDepth = null;

  // private field reflection only
  __bitDepth(it) { if (it === undefined) return this.#bitDepth; else this.#bitDepth = it; }

  #colorType = null;

  // private field reflection only
  __colorType(it) { if (it === undefined) return this.#colorType; else this.#colorType = it; }

  #interlaceMethod = null;

  // private field reflection only
  __interlaceMethod(it) { if (it === undefined) return this.#interlaceMethod; else this.#interlaceMethod = it; }

  #palette = null;

  // private field reflection only
  __palette(it) { if (it === undefined) return this.#palette; else this.#palette = it; }

  #transparency = null;

  // private field reflection only
  __transparency(it) { if (it === undefined) return this.#transparency; else this.#transparency = it; }

  #imgData = null;

  // private field reflection only
  __imgData(it) { if (it === undefined) return this.#imgData; else this.#imgData = it; }

  static make(uri,in$) {
    const $self = new PngDecoder();
    PngDecoder.make$($self,uri,in$);
    return $self;
  }

  static make$($self,uri,in$) {
    ;
    $self.#uri = uri;
    $self.#in = in$;
    return;
  }

  static isPng(buf) {
    return sys.ObjUtil.equals(PngDecoder.magic(), buf.getRange(sys.Range.make(0, 8, true)).readS8());
  }

  decode() {
    if (sys.ObjUtil.compareNE(PngDecoder.magic(), this.#in.readS8())) {
      throw sys.IOErr.make("Missing magic");
    }
    ;
    let data = sys.Buf.make();
    while (true) {
      let len = this.#in.readU4();
      let type = this.#in.readChars(4);
      (data = this.#in.readBufFully(sys.ObjUtil.coerce(data.clear(), sys.Buf.type$.toNullable()), len));
      let crc = this.#in.readU4();
      let $_u6 = type;
      if (sys.ObjUtil.equals($_u6, "IHDR")) {
        this.readImageHeader(sys.ObjUtil.coerce(data, sys.Buf.type$));
      }
      else if (sys.ObjUtil.equals($_u6, "PLTE")) {
        this.readPalette(sys.ObjUtil.coerce(data, sys.Buf.type$));
      }
      else if (sys.ObjUtil.equals($_u6, "IDAT")) {
        this.readImageData(sys.ObjUtil.coerce(data, sys.Buf.type$));
      }
      else if (sys.ObjUtil.equals($_u6, "tRNS")) {
        this.readTransparency(sys.ObjUtil.coerce(data, sys.Buf.type$));
      }
      else if (sys.ObjUtil.equals($_u6, "IEND")) {
        break;
      }
      ;
    }
    ;
    return this.toImage();
  }

  toImage() {
    const this$ = this;
    return ServerPngImage.make((it) => {
      it.__uri(this$.#uri);
      it.__mime(graphics.Image.mimePng());
      it.__size(graphics.Size.makeInt(sys.ObjUtil.coerce(this$.#width, sys.Int.type$), sys.ObjUtil.coerce(this$.#height, sys.Int.type$)));
      it.__props(sys.ObjUtil.coerce(((this$) => { let $_u7 = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["colorType","colorSpace","colorSpaceBits","interlaceMethod","palette","transparency","imgData"], [sys.ObjUtil.coerce(this$.#colorType, sys.Obj.type$.toNullable()),this$.colorSpace(),sys.ObjUtil.coerce(((this$) => { if (this$.isIndexedColor()) return sys.ObjUtil.coerce(8, sys.Int.type$.toNullable()); return this$.#bitDepth; })(this$), sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(this$.#interlaceMethod, sys.Obj.type$.toNullable()),this$.#palette.flip(),this$.#transparency.flip(),this$.#imgData.flip()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))), sys.Type.find("[sys::Str:sys::Obj?]")); if ($_u7 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["colorType","colorSpace","colorSpaceBits","interlaceMethod","palette","transparency","imgData"], [sys.ObjUtil.coerce(this$.#colorType, sys.Obj.type$.toNullable()),this$.colorSpace(),sys.ObjUtil.coerce(((this$) => { if (this$.isIndexedColor()) return sys.ObjUtil.coerce(8, sys.Int.type$.toNullable()); return this$.#bitDepth; })(this$), sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(this$.#interlaceMethod, sys.Obj.type$.toNullable()),this$.#palette.flip(),this$.#transparency.flip(),this$.#imgData.flip()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))), sys.Type.find("[sys::Str:sys::Obj?]"))); })(this$), sys.Type.find("[sys::Str:sys::Obj]")));
      return;
    });
  }

  readImageHeader(data) {
    this.#width = sys.ObjUtil.coerce(data.readU4(), sys.Int.type$.toNullable());
    if (sys.ObjUtil.compareLE(this.#width, 0)) {
      throw sys.IOErr.make(sys.Str.plus("Invalid width: ", sys.ObjUtil.coerce(this.#width, sys.Obj.type$.toNullable())));
    }
    ;
    this.#height = sys.ObjUtil.coerce(data.readU4(), sys.Int.type$.toNullable());
    if (sys.ObjUtil.compareLE(this.#height, 0)) {
      throw sys.IOErr.make(sys.Str.plus("Invalid height: ", sys.ObjUtil.coerce(this.#height, sys.Obj.type$.toNullable())));
    }
    ;
    this.#bitDepth = sys.ObjUtil.coerce(data.readU1(), sys.Int.type$.toNullable());
    this.#colorType = sys.ObjUtil.coerce(data.readU1(), sys.Int.type$.toNullable());
    let compressionMethod = data.readU1();
    if (sys.ObjUtil.compareNE(compressionMethod, 0)) {
      throw sys.IOErr.make(sys.Str.plus("Invalid compression method: ", sys.ObjUtil.coerce(compressionMethod, sys.Obj.type$.toNullable())));
    }
    ;
    let filterMethod = data.readU1();
    if (sys.ObjUtil.compareNE(filterMethod, 0)) {
      throw sys.IOErr.make(sys.Str.plus("Invalid filter method: ", sys.ObjUtil.coerce(filterMethod, sys.Obj.type$.toNullable())));
    }
    ;
    this.#interlaceMethod = sys.ObjUtil.coerce(data.readU1(), sys.Int.type$.toNullable());
    if (sys.ObjUtil.compareGT(this.#interlaceMethod, 1)) {
      throw sys.IOErr.make(sys.Str.plus("Invalid interlace method: ", sys.ObjUtil.coerce(this.#interlaceMethod, sys.Obj.type$.toNullable())));
    }
    ;
    return;
  }

  readPalette(data) {
    if (sys.ObjUtil.compareNE(sys.Int.mod(data.size(), 3), 0)) {
      throw sys.IOErr.make(sys.Str.plus("Invalid palette data size: ", sys.ObjUtil.coerce(data.size(), sys.Obj.type$.toNullable())));
    }
    ;
    this.#palette.writeBuf(data);
    return;
  }

  readImageData(data) {
    this.#imgData.writeBuf(data);
    return;
  }

  readTransparency(data) {
    this.#transparency.writeBuf(data);
    if (sys.ObjUtil.equals(this.#colorType, 3)) {
      this.#transparency.fill(255, sys.Int.minus(this.#palette.size(), this.#transparency.size()));
    }
    ;
    return;
  }

  isIndexedColor() {
    return sys.ObjUtil.equals(this.#colorType, 3);
  }

  colorSpace() {
    let $_u10 = this.#colorType;
    if (sys.ObjUtil.equals($_u10, 0)) {
      return "Gray";
    }
    else if (sys.ObjUtil.equals($_u10, 2)) {
      return "RGB";
    }
    else if (sys.ObjUtil.equals($_u10, 3)) {
      return "RGB";
    }
    else if (sys.ObjUtil.equals($_u10, 4)) {
      return "Gray";
    }
    else if (sys.ObjUtil.equals($_u10, 6)) {
      return "RGB";
    }
    ;
    throw sys.IOErr.make(sys.Str.plus("Invalid color type: ", sys.ObjUtil.coerce(this.#colorType, sys.Obj.type$.toNullable())));
  }

  static static$init() {
    PngDecoder.#magic = -8552249625308161526;
    return;
  }

}

class ServerImage extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ServerImage.type$; }

  static mimeGif() { return graphics.Image.mimeGif(); }

  write() { return graphics.Image.prototype.write.apply(this, arguments); }

  h() { return graphics.Image.prototype.h.apply(this, arguments); }

  static mimeSvg() { return graphics.Image.mimeSvg(); }

  static mimePng() { return graphics.Image.mimePng(); }

  w() { return graphics.Image.prototype.w.apply(this, arguments); }

  static mimeJpeg() { return graphics.Image.mimeJpeg(); }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #mime = null;

  mime() { return this.#mime; }

  __mime(it) { if (it === undefined) return this.#mime; else this.#mime = it; }

  #size = null;

  size() { return this.#size; }

  __size(it) { if (it === undefined) return this.#size; else this.#size = it; }

  #props = null;

  props() { return this.#props; }

  __props(it) { if (it === undefined) return this.#props; else this.#props = it; }

  static load(uri,buf,checked) {
    if (checked === undefined) checked = true;
    try {
      if (JpegDecoder.isJpeg(buf)) {
        return JpegDecoder.make(uri, buf.in()).decode();
      }
      ;
      if (PngDecoder.isPng(buf)) {
        return PngDecoder.make(uri, buf.in()).decode();
      }
      ;
      if (SvgDecoder.isSvg(buf)) {
        return SvgDecoder.make(uri, buf.in()).decode();
      }
      ;
      throw sys.ArgErr.make("Could not determine image type");
    }
    catch ($_u11) {
      $_u11 = sys.Err.make($_u11);
      if ($_u11 instanceof sys.Err) {
        let err = $_u11;
        ;
        if (checked) {
          throw err;
        }
        ;
      }
      else {
        throw $_u11;
      }
    }
    ;
    return null;
  }

  static make(f) {
    const $self = new ServerImage();
    ServerImage.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    sys.Func.call(f, $self);
    return;
  }

  isLoaded() {
    return true;
  }

  get(name) {
    return this.#props.get(name);
  }

}

class ServerPngImage extends ServerImage {
  constructor() {
    super();
    const this$ = this;
    this.#pixelsRef = concurrent.AtomicRef.make(null);
    return;
  }

  typeof() { return ServerPngImage.type$; }

  hasPalette() { return graphics.PngImage.prototype.hasPalette.apply(this, arguments); }

  colors() { return graphics.PngImage.prototype.colors.apply(this, arguments); }

  pixelBits() { return graphics.PngImage.prototype.pixelBits.apply(this, arguments); }

  hasTransparency() { return graphics.PngImage.prototype.hasTransparency.apply(this, arguments); }

  static mimeGif() { return graphics.Image.mimeGif(); }

  palette() { return graphics.PngImage.prototype.palette.apply(this, arguments); }

  write() { return graphics.Image.prototype.write.apply(this, arguments); }

  hasAlpha() { return graphics.PngImage.prototype.hasAlpha.apply(this, arguments); }

  h() { return graphics.Image.prototype.h.apply(this, arguments); }

  colorType() { return graphics.PngImage.prototype.colorType.apply(this, arguments); }

  static mimeSvg() { return graphics.Image.mimeSvg(); }

  static mimePng() { return graphics.Image.mimePng(); }

  w() { return graphics.Image.prototype.w.apply(this, arguments); }

  transparency() { return graphics.PngImage.prototype.transparency.apply(this, arguments); }

  imgData() { return graphics.PngImage.prototype.imgData.apply(this, arguments); }

  static mimeJpeg() { return graphics.Image.mimeJpeg(); }

  #pixelsRef = null;

  // private field reflection only
  __pixelsRef(it) { if (it === undefined) return this.#pixelsRef; else this.#pixelsRef = it; }

  static make(f) {
    const $self = new ServerPngImage();
    ServerPngImage.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ServerImage.make$($self, sys.ObjUtil.coerce(f, sys.Type.find("|graphicsJava::ServerImage->sys::Void|")));
    ;
    return;
  }

  pixels() {
    const this$ = this;
    if (this.#pixelsRef.val() != null) {
      return sys.ObjUtil.coerce(this.#pixelsRef.val(), sys.Buf.type$);
    }
    ;
    let data = sys.Zip.deflateInStream(this.imgData().in()).readAllBuf();
    let pixelBytes = sys.Int.div(this.pixelBits(), 8);
    let scanLineLen = sys.Int.mult(pixelBytes, sys.Num.toInt(sys.ObjUtil.coerce(this.size().w(), sys.Num.type$)));
    let numPixels = sys.Int.mult(scanLineLen, sys.Num.toInt(sys.ObjUtil.coerce(this.size().h(), sys.Num.type$)));
    let pixels = sys.Buf.make(numPixels);
    let row = 0;
    while (data.more()) {
      let filter = data.read();
      sys.Range.make(0, scanLineLen, true).each((i) => {
        if (sys.ObjUtil.equals(0, filter)) {
          return sys.ObjUtil.coerce(pixels.write(sys.ObjUtil.coerce(data.read(), sys.Int.type$)), sys.Buf.type$.toNullable());
        }
        ;
        let byte = data.read();
        let col = sys.Int.div(sys.Int.minus(i, sys.Int.mod(i, pixelBytes)), pixelBytes);
        let left = ((this$) => { if (sys.ObjUtil.compareLT(i, pixelBytes)) return 0; return pixels.get(sys.Int.minus(pixels.size(), pixelBytes)); })(this$);
        let upper = ((this$) => { if (sys.ObjUtil.equals(row, 0)) return 0; return pixels.get(sys.Int.plus(sys.Int.plus(sys.Int.mult(sys.Int.minus(row, 1), scanLineLen), sys.Int.mult(col, pixelBytes)), sys.Int.mod(i, pixelBytes))); })(this$);
        let upperLeft = ((this$) => { if ((sys.ObjUtil.equals(row, 0) || sys.ObjUtil.equals(col, 0))) return 0; return pixels.get(sys.Int.plus(sys.Int.plus(sys.Int.mult(sys.Int.minus(row, 1), scanLineLen), sys.Int.mult(sys.Int.minus(col, 1), pixelBytes)), sys.Int.mod(i, pixelBytes))); })(this$);
        let val = null;
        let $_u15 = filter;
        if (sys.ObjUtil.equals($_u15, 1)) {
          (val = sys.ObjUtil.coerce(sys.Int.plus(sys.ObjUtil.coerce(byte, sys.Int.type$), left), sys.Int.type$.toNullable()));
        }
        else if (sys.ObjUtil.equals($_u15, 2)) {
          (val = sys.ObjUtil.coerce(sys.Int.plus(upper, sys.ObjUtil.coerce(byte, sys.Int.type$)), sys.Int.type$.toNullable()));
        }
        else if (sys.ObjUtil.equals($_u15, 3)) {
          (val = sys.ObjUtil.coerce(sys.Int.plus(sys.ObjUtil.coerce(byte, sys.Int.type$), sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.floor(sys.Float.div(sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.plus(left, upper), sys.Num.type$)), sys.Float.make(2.0))), sys.Num.type$))), sys.Int.type$.toNullable()));
        }
        else if (sys.ObjUtil.equals($_u15, 4)) {
          let p = sys.Int.minus(sys.Int.plus(left, upper), upperLeft);
          let pa = sys.Int.abs(sys.Int.minus(p, left));
          let pb = sys.Int.abs(sys.Int.minus(p, upper));
          let pc = sys.Int.abs(sys.Int.minus(p, upperLeft));
          let paeth = upperLeft;
          if ((sys.ObjUtil.compareLE(pa, pb) && sys.ObjUtil.compareLE(pa, pc))) {
            (paeth = left);
          }
          else {
            if (sys.ObjUtil.compareLE(pb, pc)) {
              (paeth = upper);
            }
            ;
          }
          ;
          (val = sys.ObjUtil.coerce(sys.Int.plus(sys.ObjUtil.coerce(byte, sys.Int.type$), paeth), sys.Int.type$.toNullable()));
        }
        ;
        pixels.write(sys.Int.mod(sys.ObjUtil.coerce(val, sys.Int.type$), 256));
        return;
      });
      row = sys.Int.increment(row);
    }
    ;
    this.#pixelsRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(pixels.flip(), sys.Buf.type$.toNullable())), sys.Buf.type$.toNullable()));
    return sys.ObjUtil.coerce(this.#pixelsRef.val(), sys.Buf.type$);
  }

}

class ServerGraphicsEnv extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#images = concurrent.ConcurrentMap.make();
    return;
  }

  typeof() { return ServerGraphicsEnv.type$; }

  renderImage() { return graphics.GraphicsEnv.prototype.renderImage.apply(this, arguments); }

  #images = null;

  // private field reflection only
  __images(it) { if (it === undefined) return this.#images; else this.#images = it; }

  image(uri,data) {
    if (data === undefined) data = null;
    let image = sys.ObjUtil.as(this.#images.get(uri), graphics.Image.type$);
    if (image != null) {
      return sys.ObjUtil.coerce(image, graphics.Image.type$);
    }
    ;
    if (data == null) {
      (data = this.resolveImageData(uri));
    }
    ;
    (image = ServerImage.load(uri, sys.ObjUtil.coerce(data, sys.Buf.type$)));
    return sys.ObjUtil.coerce(this.#images.getOrAdd(uri, sys.ObjUtil.coerce(image, sys.Obj.type$)), graphics.Image.type$);
  }

  resolveImageData(uri) {
    return uri.toFile().readAllBuf();
  }

  static make() {
    const $self = new ServerGraphicsEnv();
    ServerGraphicsEnv.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class Java2DFontMetrics extends graphics.FontMetrics {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Java2DFontMetrics.type$; }

  #height = sys.Float.make(0);

  height() { return this.#height; }

  __height(it) { if (it === undefined) return this.#height; else this.#height = it; }

  #ascent = sys.Float.make(0);

  ascent() { return this.#ascent; }

  __ascent(it) { if (it === undefined) return this.#ascent; else this.#ascent = it; }

  #descent = sys.Float.make(0);

  descent() { return this.#descent; }

  __descent(it) { if (it === undefined) return this.#descent; else this.#descent = it; }

  #leading = sys.Float.make(0);

  leading() { return this.#leading; }

  __leading(it) { if (it === undefined) return this.#leading; else this.#leading = it; }

  #fmRef = null;

  fmRef() { return this.#fmRef; }

  __fmRef(it) { if (it === undefined) return this.#fmRef; else this.#fmRef = it; }

  static make(fm) {
    const $self = new Java2DFontMetrics();
    Java2DFontMetrics.make$($self,fm);
    return $self;
  }

  static make$($self,fm) {
    graphics.FontMetrics.make$($self);
    $self.#height = sys.Num.toFloat(sys.ObjUtil.coerce(sys.ObjUtil.coerce(fm.getHeight(), sys.Int.type$), sys.Num.type$));
    $self.#ascent = sys.Num.toFloat(sys.ObjUtil.coerce(sys.ObjUtil.coerce(fm.getAscent(), sys.Int.type$), sys.Num.type$));
    $self.#descent = sys.Num.toFloat(sys.ObjUtil.coerce(sys.ObjUtil.coerce(fm.getDescent(), sys.Int.type$), sys.Num.type$));
    $self.#leading = sys.Num.toFloat(sys.ObjUtil.coerce(sys.ObjUtil.coerce(fm.getLeading(), sys.Int.type$), sys.Num.type$));
    $self.#fmRef = sys.Unsafe.make(fm);
    return;
  }

  width(s) {
    return sys.Num.toFloat(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.fm().stringWidth(s), sys.Int.type$), sys.Num.type$));
  }

  fm() {
    return sys.ObjUtil.coerce(this.#fmRef.val(), java.failjava.awt.FontMetrics.type$);
  }

}

class Java2DGraphics extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#paint = graphics.Color.transparent();
    this.#stroke = graphics.Stroke.defVal();
    this.#alpha = sys.Float.make(1.0);
    this.#font = graphics.Font.make((it) => {
      return;
    });
    this.#stack = sys.List.make(JavaGraphicsState.type$);
    return;
  }

  typeof() { return Java2DGraphics.type$; }

  #paint = null;

  paint(it) {
    if (it === undefined) {
      return this.#paint;
    }
    else {
      if (sys.ObjUtil.equals(this.#paint, it)) {
        return;
      }
      ;
      this.#paint = it;
      let c = it.asColorPaint();
      if (sys.ObjUtil.compareLT(c.a(), sys.Float.make(1.0))) {
        this.#g.setColor(java.failjava.awt.Color.javaInit(sys.ObjUtil.coerce(c.r(), java.fail.int.type$), sys.ObjUtil.coerce(c.g(), java.fail.int.type$), sys.ObjUtil.coerce(c.b(), java.fail.int.type$), sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.mult(sys.Float.make(255.0), c.a()), sys.Num.type$)), java.fail.int.type$)));
      }
      else {
        this.#g.setColor(java.failjava.awt.Color.javaInit(sys.ObjUtil.coerce(c.r(), java.fail.int.type$), sys.ObjUtil.coerce(c.g(), java.fail.int.type$), sys.ObjUtil.coerce(c.b(), java.fail.int.type$)));
      }
      ;
      return;
    }
  }

  #color = null;

  color(it) {
    if (it === undefined) {
      return this.paint().asColorPaint();
    }
    else {
      this.paint(it);
      return;
    }
  }

  #stroke = null;

  stroke(it) {
    if (it === undefined) {
      return this.#stroke;
    }
    else {
      if (sys.ObjUtil.equals(this.#stroke, it)) {
        return;
      }
      ;
      this.#stroke = it;
      let cap = Java2DGraphics.toStrokeCap(it.cap());
      let join = Java2DGraphics.toStrokeJoin(it.join());
      let dash = Java2DGraphics.toStrokeDash(it.dash());
      this.#g.setStroke(java.failjava.awt.BasicStroke.javaInit(sys.ObjUtil.coerce(it.width(), java.fail.float.type$), sys.ObjUtil.coerce(cap, java.fail.int.type$), sys.ObjUtil.coerce(join, java.fail.int.type$), sys.ObjUtil.coerce(sys.Float.make(10.0), java.fail.float.type$), dash, sys.ObjUtil.coerce(sys.Float.make(0.0), java.fail.float.type$)));
      return;
    }
  }

  #alpha = sys.Float.make(0);

  alpha(it) {
    if (it === undefined) {
      return this.#alpha;
    }
    else {
      (it = sys.Float.clamp(it, sys.Float.make(0.0), sys.Float.make(1.0)));
      if (sys.ObjUtil.equals(this.#alpha, it)) {
        return;
      }
      ;
      this.#alpha = it;
      if (sys.ObjUtil.compareGE(it, sys.Float.make(1.0))) {
        this.#g.setComposite(java.failjava.awt.AlphaComposite.SrcOver());
      }
      else {
        this.#g.setComposite(java.failjava.awt.AlphaComposite.getInstance(sys.ObjUtil.coerce(sys.ObjUtil.coerce(java.failjava.awt.AlphaComposite.SRC_OVER(), sys.Int.type$), java.fail.int.type$), sys.ObjUtil.coerce(it, java.fail.float.type$)));
      }
      ;
      return;
    }
  }

  #font = null;

  font(it) {
    if (it === undefined) {
      return this.#font;
    }
    else {
      if (this.#font === it) {
        return;
      }
      ;
      this.#font = it;
      this.#g.setFont(this.env().awtFont(it));
      return;
    }
  }

  #envRef = null;

  // private field reflection only
  __envRef(it) { if (it === undefined) return this.#envRef; else this.#envRef = it; }

  #g = null;

  // private field reflection only
  __g(it) { if (it === undefined) return this.#g; else this.#g = it; }

  #stack = null;

  // private field reflection only
  __stack(it) { if (it === undefined) return this.#stack; else this.#stack = it; }

  static make(g) {
    const $self = new Java2DGraphics();
    Java2DGraphics.make$($self,g);
    return $self;
  }

  static make$($self,g) {
    ;
    $self.#g = g;
    g.setRenderingHint(java.failjava.awt.RenderingHints.KEY_RENDERING(), java.failjava.awt.RenderingHints.VALUE_RENDER_QUALITY());
    g.setRenderingHint(java.failjava.awt.RenderingHints.KEY_ANTIALIASING(), java.failjava.awt.RenderingHints.VALUE_ANTIALIAS_ON());
    g.setRenderingHint(java.failjava.awt.RenderingHints.KEY_TEXT_ANTIALIASING(), java.failjava.awt.RenderingHints.VALUE_TEXT_ANTIALIAS_LCD_HRGB());
    $self.paint(graphics.Color.black());
    return;
  }

  static toStrokeCap(cap) {
    if (cap === graphics.StrokeCap.round()) {
      return sys.ObjUtil.coerce(java.failjava.awt.BasicStroke.CAP_ROUND(), sys.Int.type$);
    }
    ;
    if (cap === graphics.StrokeCap.square()) {
      return sys.ObjUtil.coerce(java.failjava.awt.BasicStroke.CAP_SQUARE(), sys.Int.type$);
    }
    ;
    return sys.ObjUtil.coerce(java.failjava.awt.BasicStroke.CAP_BUTT(), sys.Int.type$);
  }

  static toStrokeJoin(join) {
    if (join === graphics.StrokeJoin.radius()) {
      return sys.ObjUtil.coerce(java.failjava.awt.BasicStroke.JOIN_ROUND(), sys.Int.type$);
    }
    ;
    if (join === graphics.StrokeJoin.bevel()) {
      return sys.ObjUtil.coerce(java.failjava.awt.BasicStroke.JOIN_BEVEL(), sys.Int.type$);
    }
    ;
    return sys.ObjUtil.coerce(java.failjava.awt.BasicStroke.JOIN_MITER(), sys.Int.type$);
  }

  static toStrokeDash(dash) {
    const this$ = this;
    if (dash == null) {
      return null;
    }
    ;
    let toks = graphics.GeomUtil.split(sys.ObjUtil.coerce(dash, sys.Str.type$));
    if (toks.isEmpty()) {
      return null;
    }
    ;
    let array = java.failfanx.interop.FloatArray.make(sys.ObjUtil.coerce(toks.size(), java.fail.int.type$));
    toks.each((tok,i) => {
      array.set(sys.ObjUtil.coerce(i, java.fail.int.type$), sys.ObjUtil.coerce(sys.Str.toFloat(sys.Str.trim(tok)), java.fail.float.type$));
      return;
    });
    return array;
  }

  metrics() {
    return Java2DFontMetrics.make(sys.ObjUtil.coerce(this.#g.getFontMetrics(), java.failjava.awt.FontMetrics.type$));
  }

  path() {
    return Java2DGraphicsPath.make(this.#g);
  }

  drawLine(x1,y1,x2,y2) {
    this.#g.draw(java.failjava.awt.geom.Line2D$Double.javaInit(x1, y1, x2, y2));
    return this;
  }

  drawRect(x,y,w,h) {
    this.#g.draw(java.failjava.awt.geom.Rectangle2D$Double.javaInit(x, y, w, h));
    return this;
  }

  fillRect(x,y,w,h) {
    this.#g.fill(java.failjava.awt.geom.Rectangle2D$Double.javaInit(x, y, w, h));
    return this;
  }

  clipRect(x,y,w,h) {
    this.#g.clip(java.failjava.awt.geom.Rectangle2D$Double.javaInit(x, y, w, h));
    return this;
  }

  drawRoundRect(x,y,w,h,wArc,hArc) {
    this.#g.draw(java.failjava.awt.geom.RoundRectangle2D$Double.javaInit(x, y, w, h, wArc, hArc));
    return this;
  }

  fillRoundRect(x,y,w,h,wArc,hArc) {
    this.#g.fill(java.failjava.awt.geom.RoundRectangle2D$Double.javaInit(x, y, w, h, wArc, hArc));
    return this;
  }

  clipRoundRect(x,y,w,h,wArc,hArc) {
    this.#g.clip(java.failjava.awt.geom.RoundRectangle2D$Double.javaInit(x, y, w, h, wArc, hArc));
    return this;
  }

  drawEllipse(x,y,w,h) {
    this.#g.draw(java.failjava.awt.geom.Ellipse2D$Double.javaInit(x, y, w, h));
    return this;
  }

  fillEllipse(x,y,w,h) {
    this.#g.fill(java.failjava.awt.geom.Ellipse2D$Double.javaInit(x, y, w, h));
    return this;
  }

  drawText(s,x,y) {
    this.#g.drawString(s, sys.ObjUtil.coerce(x, java.fail.float.type$), sys.ObjUtil.coerce(y, java.fail.float.type$));
    return this;
  }

  drawImage(img,x,y,w,h) {
    if (w === undefined) w = img.w();
    if (h === undefined) h = img.h();
    let awt = sys.ObjUtil.coerce(img, Java2DImage.type$).awt();
    if (awt == null) {
      return this;
    }
    ;
    this.#g.drawImage(awt, sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(x, sys.Num.type$)), java.fail.int.type$), sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(y, sys.Num.type$)), java.fail.int.type$), sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(w, sys.Num.type$)), java.fail.int.type$), sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(h, sys.Num.type$)), java.fail.int.type$), null);
    return this;
  }

  drawImageRegion(img,src,dst) {
    let awt = sys.ObjUtil.coerce(img, Java2DImage.type$).awt();
    if (awt == null) {
      return this;
    }
    ;
    let dx1 = sys.Num.toInt(sys.ObjUtil.coerce(dst.x(), sys.Num.type$));
    let dx2 = sys.Int.plus(dx1, sys.Num.toInt(sys.ObjUtil.coerce(dst.w(), sys.Num.type$)));
    let dy1 = sys.Num.toInt(sys.ObjUtil.coerce(dst.y(), sys.Num.type$));
    let dy2 = sys.Int.plus(dy1, sys.Num.toInt(sys.ObjUtil.coerce(dst.h(), sys.Num.type$)));
    let sx1 = sys.Num.toInt(sys.ObjUtil.coerce(src.x(), sys.Num.type$));
    let sx2 = sys.Int.plus(sx1, sys.Num.toInt(sys.ObjUtil.coerce(src.w(), sys.Num.type$)));
    let sy1 = sys.Num.toInt(sys.ObjUtil.coerce(src.y(), sys.Num.type$));
    let sy2 = sys.Int.plus(sy1, sys.Num.toInt(sys.ObjUtil.coerce(src.h(), sys.Num.type$)));
    this.#g.drawImage(awt, sys.ObjUtil.coerce(dx1, java.fail.int.type$), sys.ObjUtil.coerce(dy1, java.fail.int.type$), sys.ObjUtil.coerce(dx2, java.fail.int.type$), sys.ObjUtil.coerce(dy2, java.fail.int.type$), sys.ObjUtil.coerce(sx1, java.fail.int.type$), sys.ObjUtil.coerce(sy1, java.fail.int.type$), sys.ObjUtil.coerce(sx2, java.fail.int.type$), sys.ObjUtil.coerce(sy2, java.fail.int.type$), null);
    return this;
  }

  translate(x,y) {
    this.#g.translate(x, y);
    return this;
  }

  transform(t) {
    this.#g.transform(java.failjava.awt.geom.AffineTransform.javaInit(sys.ObjUtil.coerce(t.a(), java.fail.float.type$), sys.ObjUtil.coerce(t.b(), java.fail.float.type$), sys.ObjUtil.coerce(t.c(), java.fail.float.type$), sys.ObjUtil.coerce(t.d(), java.fail.float.type$), sys.ObjUtil.coerce(t.e(), java.fail.float.type$), sys.ObjUtil.coerce(t.f(), java.fail.float.type$)));
    return this;
  }

  push(r) {
    if (r === undefined) r = null;
    this.#stack.push(this.saveState());
    if (r == null) {
      this.#g = sys.ObjUtil.coerce(this.#g.create(), java.failjava.awt.Graphics2D.type$);
    }
    else {
      this.#g = sys.ObjUtil.coerce(this.#g.create(sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(r.x(), sys.Num.type$)), java.fail.int.type$), sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(r.y(), sys.Num.type$)), java.fail.int.type$), sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(r.w(), sys.Num.type$)), java.fail.int.type$), sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(r.h(), sys.Num.type$)), java.fail.int.type$)), java.failjava.awt.Graphics2D.type$);
    }
    ;
    return this;
  }

  pop() {
    if (this.#stack.isEmpty()) {
      throw sys.Err.make("Stack is empty");
    }
    ;
    this.#g.dispose();
    this.restoreState(sys.ObjUtil.coerce(this.#stack.pop(), JavaGraphicsState.type$));
    return this;
  }

  env() {
    if (this.#envRef == null) {
      return sys.ObjUtil.coerce(((this$) => { let $_u16 = sys.ObjUtil.coerce(graphics.GraphicsEnv.cur(), Java2DGraphicsEnv.type$.toNullable()); this$.#envRef = $_u16; return $_u16; })(this), Java2DGraphicsEnv.type$);
    }
    ;
    return sys.ObjUtil.coerce(this.#envRef, Java2DGraphicsEnv.type$);
  }

  saveState() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(JavaGraphicsState.make(), (it) => {
      it.g(this$.#g);
      it.paint(this$.paint());
      it.color(this$.color());
      it.stroke(this$.stroke());
      it.alpha(this$.alpha());
      it.font(this$.font());
      return;
    }), JavaGraphicsState.type$);
  }

  restoreState(s) {
    this.#g = sys.ObjUtil.coerce(s.g(), java.failjava.awt.Graphics2D.type$);
    this.paint(sys.ObjUtil.coerce(s.paint(), graphics.Paint.type$));
    this.color(sys.ObjUtil.coerce(s.color(), graphics.Color.type$));
    this.stroke(sys.ObjUtil.coerce(s.stroke(), graphics.Stroke.type$));
    this.alpha(s.alpha());
    this.font(sys.ObjUtil.coerce(s.font(), graphics.Font.type$));
    return;
  }

  dispose() {
    this.#g.dispose();
    return;
  }

}

class JavaGraphicsState extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JavaGraphicsState.type$; }

  #g = null;

  g(it) {
    if (it === undefined) {
      return this.#g;
    }
    else {
      this.#g = it;
      return;
    }
  }

  #paint = null;

  paint(it) {
    if (it === undefined) {
      return this.#paint;
    }
    else {
      this.#paint = it;
      return;
    }
  }

  #color = null;

  color(it) {
    if (it === undefined) {
      return this.#color;
    }
    else {
      this.#color = it;
      return;
    }
  }

  #stroke = null;

  stroke(it) {
    if (it === undefined) {
      return this.#stroke;
    }
    else {
      this.#stroke = it;
      return;
    }
  }

  #alpha = sys.Float.make(0);

  alpha(it) {
    if (it === undefined) {
      return this.#alpha;
    }
    else {
      this.#alpha = it;
      return;
    }
  }

  #font = null;

  font(it) {
    if (it === undefined) {
      return this.#font;
    }
    else {
      this.#font = it;
      return;
    }
  }

  static make() {
    const $self = new JavaGraphicsState();
    JavaGraphicsState.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class Java2DGraphicsPath extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Java2DGraphicsPath.type$; }

  #g = null;

  // private field reflection only
  __g(it) { if (it === undefined) return this.#g; else this.#g = it; }

  #path = null;

  // private field reflection only
  __path(it) { if (it === undefined) return this.#path; else this.#path = it; }

  static make(g) {
    const $self = new Java2DGraphicsPath();
    Java2DGraphicsPath.make$($self,g);
    return $self;
  }

  static make$($self,g) {
    $self.#g = g;
    $self.#path = java.failjava.awt.geom.Path2D$Double.javaInit();
    return;
  }

  draw() {
    this.#g.draw(this.#path);
    return this;
  }

  fill() {
    this.#g.fill(this.#path);
    return this;
  }

  clip() {
    this.#g.clip(this.#path);
    return this;
  }

  moveTo(x,y) {
    this.#path.moveTo(x, y);
    return this;
  }

  lineTo(x,y) {
    this.#path.lineTo(x, y);
    return this;
  }

  arc(x,y,radius,start,sweep) {
    this.#path.append(java.failjava.awt.geom.Arc2D$Double.javaInit(sys.Float.minus(x, radius), sys.Float.minus(y, radius), sys.Float.mult(radius, sys.Float.make(2.0)), sys.Float.mult(radius, sys.Float.make(2.0)), start, sweep, sys.ObjUtil.coerce(sys.ObjUtil.coerce(java.failjava.awt.geom.Arc2D$Double.OPEN(), sys.Int.type$), java.fail.int.type$)), true);
    return this;
  }

  curveTo(cp1x,cp1y,cp2x,cp2y,x,y) {
    this.#path.curveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    return this;
  }

  quadTo(cpx,cpy,x,y) {
    this.#path.quadTo(cpx, cpy, x, y);
    return this;
  }

  close() {
    this.#path.closePath();
    return this;
  }

}

class Java2DGraphicsEnv extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#images = concurrent.ConcurrentMap.make();
    return;
  }

  typeof() { return Java2DGraphicsEnv.type$; }

  #images = null;

  // private field reflection only
  __images(it) { if (it === undefined) return this.#images; else this.#images = it; }

  #installedFonts$Store = undefined;

  // private field reflection only
  __installedFonts$Store(it) { if (it === undefined) return this.#installedFonts$Store; else this.#installedFonts$Store = it; }

  awtFont(f) {
    let size = sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.mult(f.size(), sys.Float.make(1.333)), sys.Num.type$));
    let name = this.awtFontName(f.names());
    if (sys.ObjUtil.compareLE(f.weight(), graphics.FontWeight.normal())) {
      let style = ((this$) => { if (f.style().isNormal()) return sys.ObjUtil.coerce(java.failjava.awt.Font.PLAIN(), sys.Int.type$); return sys.ObjUtil.coerce(java.failjava.awt.Font.ITALIC(), sys.Int.type$); })(this);
      let awt = java.failjava.awt.Font.javaInit(name, sys.ObjUtil.coerce(style, java.fail.int.type$), sys.ObjUtil.coerce(size, java.fail.int.type$));
      return awt;
    }
    else {
      let style = ((this$) => { if (f.style().isNormal()) return sys.ObjUtil.coerce(java.failjava.awt.Font.BOLD(), sys.Int.type$); return sys.Int.or(sys.ObjUtil.coerce(java.failjava.awt.Font.ITALIC(), sys.Int.type$), sys.ObjUtil.coerce(java.failjava.awt.Font.BOLD(), sys.Int.type$)); })(this);
      let awt = java.failjava.awt.Font.javaInit(name, sys.ObjUtil.coerce(style, java.fail.int.type$), sys.ObjUtil.coerce(size, java.fail.int.type$));
      return awt;
    }
    ;
  }

  awtFontName(names) {
    let installed = this.installedFonts();
    for (let i = 0; sys.ObjUtil.compareLT(i, names.size()); i = sys.Int.increment(i)) {
      let n = installed.get(sys.Str.lower(names.get(i)));
      if (n != null) {
        return sys.ObjUtil.coerce(n, sys.Str.type$);
      }
      ;
    }
    ;
    sys.ObjUtil.echo(sys.Str.plus("WARN: Java2D font not installed: ", names.join(", ")));
    let fallback = "Arial";
    installed.set(sys.ObjUtil.coerce(names.first(), sys.Obj.type$), fallback);
    return fallback;
  }

  installedFonts() {
    if (this.#installedFonts$Store === undefined) {
      this.#installedFonts$Store = this.installedFonts$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#installedFonts$Store, concurrent.ConcurrentMap.type$);
  }

  image(uri,data) {
    if (data === undefined) data = null;
    let image = sys.ObjUtil.as(this.#images.get(uri), Java2DImage.type$);
    if (image != null) {
      return sys.ObjUtil.coerce(image, Java2DImage.type$);
    }
    ;
    if (data == null) {
      (data = this.resolveImageData(uri));
    }
    ;
    (image = this.loadImage(uri, sys.ObjUtil.coerce(data, sys.Buf.type$)));
    return sys.ObjUtil.coerce(this.#images.getOrAdd(uri, sys.ObjUtil.coerce(image, sys.Obj.type$)), Java2DImage.type$);
  }

  loadImage(uri,data) {
    let awt = java.failjavax.imageio.ImageIO.read(java.failfanx.interop.Interop.toJava(data.in()));
    let mime = graphics.Image.mimeForExt(sys.ObjUtil.coerce(((this$) => { let $_u19 = uri.ext(); if ($_u19 != null) return $_u19; return ""; })(this), sys.Str.type$));
    return Java2DImage.make(uri, mime, awt);
  }

  resolveImageData(uri) {
    return uri.toFile().readAllBuf();
  }

  renderImage(mime,size,f) {
    let awt = java.failjava.awt.image.BufferedImage.javaInit(sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(size.w(), sys.Num.type$)), java.fail.int.type$), sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(size.h(), sys.Num.type$)), java.fail.int.type$), sys.ObjUtil.coerce(sys.ObjUtil.coerce(java.failjava.awt.image.BufferedImage.TYPE_INT_ARGB(), sys.Int.type$), java.fail.int.type$));
    let uri = sys.Uri.fromStr("rendered-image");
    let img = Java2DImage.make(uri, mime, awt);
    let g = Java2DGraphics.make(sys.ObjUtil.coerce(awt.createGraphics(), java.failjava.awt.Graphics2D.type$));
    sys.Func.call(f, g);
    return img;
  }

  static make() {
    const $self = new Java2DGraphicsEnv();
    Java2DGraphicsEnv.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  installedFonts$Once() {
    const this$ = this;
    let acc = concurrent.ConcurrentMap.make();
    try {
      let fonts = sys.List.make(sys.Str.type$.toNullable(), java.failjava.awt.GraphicsEnvironment.getLocalGraphicsEnvironment().getAvailableFontFamilyNames());
      fonts.each(sys.ObjUtil.coerce((n) => {
        acc.set(sys.Str.lower(n), n);
        return;
      }, sys.Type.find("|sys::V,sys::Int->sys::Void|")));
    }
    catch ($_u20) {
      $_u20 = sys.Err.make($_u20);
      if ($_u20 instanceof sys.Err) {
        let e = $_u20;
        ;
        e.trace();
      }
      else {
        throw $_u20;
      }
    }
    ;
    let mono = acc.get("consolas");
    if (mono == null) {
      (mono = "monaco");
    }
    ;
    if (mono == null) {
      (mono = "courier new");
    }
    ;
    if (mono == null) {
      (mono = "courier");
    }
    ;
    if (mono != null) {
      acc.set("monospace", sys.ObjUtil.coerce(mono, sys.Obj.type$));
    }
    ;
    let sans = acc.get("inter");
    if (sans != null) {
      (sans = "inter regular");
    }
    ;
    if (sans == null) {
      (sans = "roboto");
    }
    ;
    if (sans == null) {
      (sans = "helvetica neue");
    }
    ;
    if (sans == null) {
      (sans = "arial");
    }
    ;
    if (sans != null) {
      acc.set("sans-serif", sys.ObjUtil.coerce(sans, sys.Obj.type$));
    }
    ;
    return acc;
  }

}

class Java2DImage extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Java2DImage.type$; }

  static mimeGif() { return graphics.Image.mimeGif(); }

  h() { return graphics.Image.prototype.h.apply(this, arguments); }

  static mimeSvg() { return graphics.Image.mimeSvg(); }

  static mimePng() { return graphics.Image.mimePng(); }

  w() { return graphics.Image.prototype.w.apply(this, arguments); }

  static mimeJpeg() { return graphics.Image.mimeJpeg(); }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #mime = null;

  mime() { return this.#mime; }

  __mime(it) { if (it === undefined) return this.#mime; else this.#mime = it; }

  #size = null;

  size() { return this.#size; }

  __size(it) { if (it === undefined) return this.#size; else this.#size = it; }

  #awtRef = null;

  awtRef() { return this.#awtRef; }

  __awtRef(it) { if (it === undefined) return this.#awtRef; else this.#awtRef = it; }

  static make(uri,mime,awt) {
    const $self = new Java2DImage();
    Java2DImage.make$($self,uri,mime,awt);
    return $self;
  }

  static make$($self,uri,mime,awt) {
    $self.#uri = uri;
    $self.#mime = mime;
    $self.#size = ((this$) => { if (awt == null) return graphics.Size.defVal(); return graphics.Size.makeInt(sys.ObjUtil.coerce(awt.getWidth(), sys.Int.type$), sys.ObjUtil.coerce(awt.getHeight(), sys.Int.type$)); })($self);
    $self.#awtRef = sys.Unsafe.make(awt);
    return;
  }

  isLoaded() {
    return true;
  }

  write(out) {
    let format = null;
    let $_u22 = this.#mime;
    if (sys.ObjUtil.equals($_u22, graphics.Image.mimePng())) {
      (format = "png");
    }
    else if (sys.ObjUtil.equals($_u22, graphics.Image.mimeGif())) {
      (format = "gif");
    }
    else {
      throw sys.UnsupportedErr.make(sys.Str.plus(sys.Str.plus("Mime type not supported '", this.#mime), "'"));
    }
    ;
    if (this.awt() == null) {
      throw sys.IOErr.make("No raster data available");
    }
    ;
    java.failjavax.imageio.ImageIO.write(this.awt(), format, java.failfanx.interop.Interop.toJava(out));
    return;
  }

  get(prop) {
    return null;
  }

  awt() {
    return sys.ObjUtil.coerce(this.#awtRef.val(), java.failjava.awt.image.BufferedImage.type$.toNullable());
  }

}

const p = sys.Pod.add$('graphicsJava');
const xp = sys.Param.noParams$();
let m;
JpegDecoder.type$ = p.at$('JpegDecoder','sys::Obj',[],{},128,JpegDecoder);
SvgDecoder.type$ = p.at$('SvgDecoder','sys::Obj',[],{},128,SvgDecoder);
PngDecoder.type$ = p.at$('PngDecoder','sys::Obj',[],{},128,PngDecoder);
ServerImage.type$ = p.at$('ServerImage','sys::Obj',['graphics::Image'],{},130,ServerImage);
ServerPngImage.type$ = p.at$('ServerPngImage','graphicsJava::ServerImage',['graphics::PngImage'],{},130,ServerPngImage);
ServerGraphicsEnv.type$ = p.at$('ServerGraphicsEnv','sys::Obj',['graphics::GraphicsEnv'],{},8194,ServerGraphicsEnv);
Java2DFontMetrics.type$ = p.at$('Java2DFontMetrics','graphics::FontMetrics',[],{},8194,Java2DFontMetrics);
Java2DGraphics.type$ = p.at$('Java2DGraphics','sys::Obj',['graphics::Graphics'],{},8192,Java2DGraphics);
JavaGraphicsState.type$ = p.at$('JavaGraphicsState','sys::Obj',[],{},128,JavaGraphicsState);
Java2DGraphicsPath.type$ = p.at$('Java2DGraphicsPath','sys::Obj',['graphics::GraphicsPath'],{},8192,Java2DGraphicsPath);
Java2DGraphicsEnv.type$ = p.at$('Java2DGraphicsEnv','sys::Obj',['graphics::GraphicsEnv'],{},8194,Java2DGraphicsEnv);
Java2DImage.type$ = p.at$('Java2DImage','sys::Obj',['graphics::Image'],{},8194,Java2DImage);
JpegDecoder.type$.af$('magic',106498,'sys::Int',{}).af$('app0',100354,'sys::Int',{}).af$('sof_markers',67586,'sys::Int[]',{}).af$('uri',67586,'sys::Uri',{}).af$('in',67584,'sys::InStream',{}).af$('isJFIF',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('in','sys::InStream',false)]),{}).am$('isJpeg',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('decode',8192,'graphicsJava::ServerImage',xp,{}).am$('readApp0',2048,'sys::Void',xp,{}).am$('readSof',2048,'graphicsJava::ServerImage',xp,{}).am$('toColorSpace',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('numComps','sys::Int',false)]),{}).am$('skipSegment',2048,'sys::Void',xp,{}).am$('readMarker',2048,'sys::Int',xp,{}).am$('isMarker',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('word','sys::Int',false)]),{}).am$('readSegment',2048,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('len','sys::Int',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
SvgDecoder.type$.af$('uri',67586,'sys::Uri',{}).af$('in',67584,'sys::InStream',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('in','sys::InStream',false)]),{}).am$('isSvg',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('decode',8192,'graphicsJava::ServerImage',xp,{});
PngDecoder.type$.af$('magic',106498,'sys::Int',{}).af$('uri',67586,'sys::Uri',{}).af$('in',67584,'sys::InStream',{}).af$('props',67584,'[sys::Str:sys::Obj]',{}).af$('width',67584,'sys::Int?',{}).af$('height',67584,'sys::Int?',{}).af$('bitDepth',67584,'sys::Int?',{}).af$('colorType',67584,'sys::Int?',{}).af$('interlaceMethod',67584,'sys::Int?',{}).af$('palette',67584,'sys::Buf',{}).af$('transparency',67584,'sys::Buf',{}).af$('imgData',67584,'sys::Buf',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('in','sys::InStream',false)]),{}).am$('isPng',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('decode',8192,'graphicsJava::ServerImage',xp,{}).am$('toImage',2048,'graphicsJava::ServerPngImage',xp,{}).am$('readImageHeader',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Buf',false)]),{}).am$('readPalette',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Buf',false)]),{}).am$('readImageData',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Buf',false)]),{}).am$('readTransparency',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Buf',false)]),{}).am$('isIndexedColor',2048,'sys::Bool',xp,{}).am$('colorSpace',2048,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
ServerImage.type$.af$('uri',336898,'sys::Uri',{}).af$('mime',336898,'sys::MimeType',{}).af$('size',336898,'graphics::Size',{}).af$('props',73730,'[sys::Str:sys::Obj]',{}).am$('load',40966,'graphicsJava::ServerImage?',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('buf','sys::Buf',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('isLoaded',271360,'sys::Bool',xp,{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{'sys::Operator':""});
ServerPngImage.type$.af$('pixelsRef',67586,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('pixels',271360,'sys::Buf',xp,{});
ServerGraphicsEnv.type$.af$('images',67586,'concurrent::ConcurrentMap',{}).am$('image',271360,'graphics::Image',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('data','sys::Buf?',true)]),{}).am$('resolveImageData',270336,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Java2DFontMetrics.type$.af$('height',336898,'sys::Float',{}).af$('ascent',336898,'sys::Float',{}).af$('descent',336898,'sys::Float',{}).af$('leading',336898,'sys::Float',{}).af$('fmRef',73730,'sys::Unsafe',{}).am$('width',271360,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('fm',8192,'[java]java.awt::FontMetrics',xp,{});
Java2DGraphics.type$.af$('paint',336896,'graphics::Paint',{}).af$('color',271360,'graphics::Color',{}).af$('stroke',336896,'graphics::Stroke',{}).af$('alpha',336896,'sys::Float',{}).af$('font',336896,'graphics::Font',{}).af$('envRef',67584,'graphicsJava::Java2DGraphicsEnv?',{}).af$('stack',67584,'graphicsJava::JavaGraphicsState[]',{}).am$('toStrokeCap',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('cap','graphics::StrokeCap',false)]),{}).am$('toStrokeJoin',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('join','graphics::StrokeJoin',false)]),{}).am$('toStrokeDash',34818,'[java]fanx.interop::FloatArray?',sys.List.make(sys.Param.type$,[new sys.Param('dash','sys::Str?',false)]),{}).am$('metrics',271360,'graphics::FontMetrics',xp,{}).am$('path',271360,'graphics::GraphicsPath',xp,{}).am$('drawLine',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x1','sys::Float',false),new sys.Param('y1','sys::Float',false),new sys.Param('x2','sys::Float',false),new sys.Param('y2','sys::Float',false)]),{}).am$('drawRect',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('fillRect',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('clipRect',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('drawRoundRect',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false),new sys.Param('wArc','sys::Float',false),new sys.Param('hArc','sys::Float',false)]),{}).am$('fillRoundRect',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false),new sys.Param('wArc','sys::Float',false),new sys.Param('hArc','sys::Float',false)]),{}).am$('clipRoundRect',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false),new sys.Param('wArc','sys::Float',false),new sys.Param('hArc','sys::Float',false)]),{}).am$('drawEllipse',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('fillEllipse',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('drawText',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('drawImage',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('img','graphics::Image',false),new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',true),new sys.Param('h','sys::Float',true)]),{}).am$('drawImageRegion',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('img','graphics::Image',false),new sys.Param('src','graphics::Rect',false),new sys.Param('dst','graphics::Rect',false)]),{}).am$('translate',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('transform',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('t','graphics::Transform',false)]),{}).am$('push',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('r','graphics::Rect?',true)]),{}).am$('pop',271360,'sys::This',xp,{}).am$('env',2048,'graphicsJava::Java2DGraphicsEnv',xp,{}).am$('saveState',2048,'graphicsJava::JavaGraphicsState',xp,{}).am$('restoreState',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','graphicsJava::JavaGraphicsState',false)]),{}).am$('dispose',271360,'sys::Void',xp,{});
JavaGraphicsState.type$.af$('paint',73728,'graphics::Paint?',{}).af$('color',73728,'graphics::Color?',{}).af$('stroke',73728,'graphics::Stroke?',{}).af$('alpha',73728,'sys::Float',{}).af$('font',73728,'graphics::Font?',{}).am$('make',139268,'sys::Void',xp,{});
Java2DGraphicsPath.type$.am$('draw',271360,'sys::This',xp,{}).am$('fill',271360,'sys::This',xp,{}).am$('clip',271360,'sys::This',xp,{}).am$('moveTo',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('lineTo',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('arc',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('radius','sys::Float',false),new sys.Param('start','sys::Float',false),new sys.Param('sweep','sys::Float',false)]),{}).am$('curveTo',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cp1x','sys::Float',false),new sys.Param('cp1y','sys::Float',false),new sys.Param('cp2x','sys::Float',false),new sys.Param('cp2y','sys::Float',false),new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('quadTo',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cpx','sys::Float',false),new sys.Param('cpy','sys::Float',false),new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('close',271360,'sys::This',xp,{});
Java2DGraphicsEnv.type$.af$('images',67586,'concurrent::ConcurrentMap',{}).af$('installedFonts$Store',722944,'sys::Obj?',{}).am$('awtFont',8192,'[java]java.awt::Font',sys.List.make(sys.Param.type$,[new sys.Param('f','graphics::Font',false)]),{}).am$('awtFontName',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('names','sys::Str[]',false)]),{}).am$('installedFonts',526336,'concurrent::ConcurrentMap',xp,{}).am$('image',271360,'graphicsJava::Java2DImage',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('data','sys::Buf?',true)]),{}).am$('loadImage',8192,'graphicsJava::Java2DImage',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('data','sys::Buf',false)]),{}).am$('resolveImageData',270336,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('renderImage',271360,'graphics::Image',sys.List.make(sys.Param.type$,[new sys.Param('mime','sys::MimeType',false),new sys.Param('size','graphics::Size',false),new sys.Param('f','|graphics::Graphics->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('installedFonts$Once',133120,'concurrent::ConcurrentMap',xp,{});
Java2DImage.type$.af$('uri',336898,'sys::Uri',{}).af$('mime',336898,'sys::MimeType',{}).af$('size',336898,'graphics::Size',{}).af$('awtRef',73730,'sys::Unsafe',{}).am$('isLoaded',271360,'sys::Bool',xp,{}).am$('write',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('prop','sys::Str',false)]),{'sys::Operator':""}).am$('awt',8192,'[java]java.awt.image::BufferedImage?',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "graphicsJava");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;concurrent 1.0;graphics 1.0");
m.set("pod.summary", "Server and desktop Java2D graphics");
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
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/fantom-lang/fantom");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  ServerGraphicsEnv,
  Java2DFontMetrics,
  Java2DGraphics,
  Java2DGraphicsPath,
  Java2DGraphicsEnv,
  Java2DImage,
};
