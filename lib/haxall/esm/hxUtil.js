// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as util from './util.js'
import * as web from './web.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class CircularBuf extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#items = sys.List.make(sys.Obj.type$.toNullable());
    this.#tail = -1;
    return;
  }

  typeof() { return CircularBuf.type$; }

  #max = 0;

  max() {
    return this.#max;
  }

  #size = 0;

  size() {
    return this.#size;
  }

  #items = null;

  // private field reflection only
  __items(it) { if (it === undefined) return this.#items; else this.#items = it; }

  #tail = 0;

  // private field reflection only
  __tail(it) { if (it === undefined) return this.#tail; else this.#tail = it; }

  static make(max) {
    const $self = new CircularBuf();
    CircularBuf.make$($self,max);
    return $self;
  }

  static make$($self,max) {
    ;
    $self.#max = max;
    $self.#items.size(max);
    return;
  }

  resize(newMax) {
    const this$ = this;
    if (sys.ObjUtil.equals(this.#max, newMax)) {
      return;
    }
    ;
    let temp = sys.List.make(sys.Obj.type$.toNullable());
    this.each((item) => {
      temp.add(item);
      return;
    });
    this.#max = newMax;
    this.#size = 0;
    this.#items = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.List.make(sys.Obj.type$.toNullable()), (it) => {
      it.size(newMax);
      return;
    }), sys.Type.find("sys::Obj?[]"));
    this.#tail = -1;
    temp.eachr((item) => {
      this$.add(item);
      return;
    });
    return;
  }

  newest() {
    return ((this$) => { if (sys.ObjUtil.compareLT(this$.#tail, 0)) return null; return this$.#items.getSafe(this$.#tail); })(this);
  }

  oldest() {
    return ((this$) => { if (sys.ObjUtil.compareGE(sys.Int.plus(this$.#tail, 1), this$.#size)) return this$.#items.getSafe(0); return this$.#items.getSafe(sys.Int.plus(this$.#tail, 1)); })(this);
  }

  eachWhile(f) {
    let end = this.#size;
    let i = this.#tail;
    let n = 0;
    while (sys.ObjUtil.compareLT(n, end)) {
      let r = sys.Func.call(f, this.#items.get(i));
      if (r != null) {
        return r;
      }
      ;
      ((this$) => { let $_u2 = n;n = sys.Int.increment(n); return $_u2; })(this);
      ((this$) => { let $_u3 = i;i = sys.Int.decrement(i); return $_u3; })(this);
      if (sys.ObjUtil.compareLT(i, 0)) {
        (i = sys.Int.minus(this.#max, 1));
      }
      ;
    }
    ;
    return null;
  }

  eachrWhile(f) {
    let end = this.#size;
    let i = sys.Int.plus(this.#tail, 1);
    if (sys.ObjUtil.compareGE(i, this.#size)) {
      (i = 0);
    }
    ;
    let n = 0;
    while (sys.ObjUtil.compareLT(n, end)) {
      let r = sys.Func.call(f, this.#items.get(i));
      if (r != null) {
        return r;
      }
      ;
      ((this$) => { let $_u4 = n;n = sys.Int.increment(n); return $_u4; })(this);
      ((this$) => { let $_u5 = i;i = sys.Int.increment(i); return $_u5; })(this);
      if (sys.ObjUtil.compareGE(i, this.#max)) {
        (i = 0);
      }
      ;
    }
    ;
    return null;
  }

  each(f) {
    let end = this.#size;
    let i = this.#tail;
    let n = 0;
    while (sys.ObjUtil.compareLT(n, end)) {
      sys.Func.call(f, this.#items.get(i));
      ((this$) => { let $_u6 = n;n = sys.Int.increment(n); return $_u6; })(this);
      ((this$) => { let $_u7 = i;i = sys.Int.decrement(i); return $_u7; })(this);
      if (sys.ObjUtil.compareLT(i, 0)) {
        (i = sys.Int.minus(this.#max, 1));
      }
      ;
    }
    ;
    return;
  }

  eachr(f) {
    let end = this.#size;
    let i = sys.Int.plus(this.#tail, 1);
    if (sys.ObjUtil.compareGE(i, this.#size)) {
      (i = 0);
    }
    ;
    let n = 0;
    while (sys.ObjUtil.compareLT(n, end)) {
      sys.Func.call(f, this.#items.get(i));
      ((this$) => { let $_u8 = n;n = sys.Int.increment(n); return $_u8; })(this);
      ((this$) => { let $_u9 = i;i = sys.Int.increment(i); return $_u9; })(this);
      if (sys.ObjUtil.compareGE(i, this.#max)) {
        (i = 0);
      }
      ;
    }
    ;
    return;
  }

  add(item) {
    this.#tail = sys.Int.plus(this.#tail, 1);
    if (sys.ObjUtil.compareGE(this.#tail, this.#max)) {
      this.#tail = 0;
    }
    ;
    this.#items.set(this.#tail, item);
    this.#size = sys.Int.min(sys.Int.plus(this.#size, 1), this.#max);
    return;
  }

  clear() {
    const this$ = this;
    this.#items = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.List.make(sys.Obj.type$.toNullable()), (it) => {
      it.size(this$.#max);
      return;
    }), sys.Type.find("sys::Obj?[]"));
    this.#size = 0;
    this.#tail = -1;
    return;
  }

}

class XmlWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XmlWriter.type$; }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  static make(out) {
    const $self = new XmlWriter();
    XmlWriter.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    $self.#out = out;
    return;
  }

  flush() {
    this.#out.flush();
    return this;
  }

  close() {
    return this.#out.close();
  }

  writeGrid(grid) {
    this.#out.printLine("<grid ver='3.0'>");
    this.writeGridBody(grid);
    this.#out.printLine("</grid>");
    this.#out.flush();
    return this;
  }

  writeGridBody(grid) {
    const this$ = this;
    if (!grid.meta().isEmpty()) {
      this.writeMeta(grid.meta());
    }
    ;
    let cols = grid.cols();
    this.#out.printLine();
    this.#out.printLine("<cols>");
    cols.each((col) => {
      this$.writeCol(col);
      return;
    });
    this.#out.printLine("</cols>");
    this.#out.printLine();
    grid.each((row) => {
      this$.writeRow(cols, row);
      return;
    });
    return;
  }

  writeCol(col) {
    this.#out.print("<").print(col.name());
    let dis = col.dis();
    let meta = col.meta();
    if (sys.ObjUtil.compareNE(dis, col.name())) {
      this.writeAttr("dis", dis);
      (meta = haystack.Etc.dictRemove(meta, "dis"));
    }
    ;
    this.writeMetaAndEnd(col.name(), meta);
    return;
  }

  writeRow(cols,row) {
    const this$ = this;
    this.#out.printLine("<row>");
    cols.each((col) => {
      this$.writeCell(row, col);
      return;
    });
    this.#out.printLine("</row>");
    return;
  }

  writeCell(row,col) {
    let val = row.val(col);
    if (val == null) {
      return;
    }
    ;
    this.writeVal(col.name(), val);
    return;
  }

  writeMetaAndEnd(elemName,meta) {
    if (meta.isEmpty()) {
      this.#out.printLine("/>");
      return;
    }
    ;
    this.#out.printLine(">");
    this.writeMeta(meta);
    this.#out.print("</").print(elemName).printLine(">");
    return;
  }

  writeMeta(meta) {
    const this$ = this;
    this.#out.printLine("<meta>");
    meta.each((v,n) => {
      this$.writeVal(n, v);
      return;
    });
    this.#out.printLine("</meta>");
    return;
  }

  writeVal(elemName,val) {
    let kind = haystack.Kind.fromVal(val, false);
    let kindName = ((this$) => { let $_u10 = ((this$) => { let $_u11=kind; return ($_u11==null) ? null : $_u11.name(); })(this$); if ($_u10 != null) return $_u10; return "null"; })(this);
    this.#out.print("<").print(elemName);
    this.writeAttr("kind", sys.ObjUtil.coerce(kindName, sys.Str.type$));
    if ((kind == null || !kind.isCollection())) {
      this.writeValAttr(val);
      this.#out.printLine("/>");
    }
    else {
      if (kind.isCollection()) {
        this.#out.printLine(">");
        if (kind.isList()) {
          this.writeList(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]")));
        }
        ;
        if (kind.isDict()) {
          this.writeDict(sys.ObjUtil.coerce(val, haystack.Dict.type$));
        }
        ;
        if (sys.ObjUtil.equals(kind, haystack.Kind.grid())) {
          this.writeGridBody(sys.ObjUtil.coerce(val, haystack.Grid.type$));
        }
        ;
        this.#out.print("</").print(elemName).printLine(">");
      }
      ;
    }
    ;
    return;
  }

  writeValAttr(val) {
    if ((val == null || val === haystack.Marker.val() || val === haystack.NA.val() || val === haystack.Remove.val())) {
      return;
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Ref.type$)) {
      let ref = sys.ObjUtil.coerce(val, haystack.Ref.type$);
      if (ref.disVal() != null) {
        this.writeAttr("dis", sys.ObjUtil.coerce(ref.disVal(), sys.Str.type$));
      }
      ;
      this.writeAttr("val", ref.id());
      return;
    }
    ;
    this.writeAttr("val", sys.ObjUtil.toStr(val));
    return;
  }

  writeList(list) {
    const this$ = this;
    list.each((v) => {
      this$.writeVal("item", v);
      return;
    });
    return;
  }

  writeDict(dict) {
    const this$ = this;
    dict.each((v,n) => {
      this$.writeVal(n, v);
      return;
    });
    return;
  }

  writeAttr(name,val) {
    this.#out.writeChar(32).writeXml(name).writeChar(61).writeChar(39).writeXml(val, sys.Int.or(sys.OutStream.xmlEscQuotes(), sys.OutStream.xmlEscNewlines())).writeChar(39);
    return;
  }

}

class ExcelWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#unitToStyle = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Unit"), sys.Type.find("sys::Str"));
    this.#styleToUnit = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Unit"));
    this.#tzToStyle = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    this.#styleToTz = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    return;
  }

  typeof() { return ExcelWriter.type$; }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  #unitToStyle = null;

  // private field reflection only
  __unitToStyle(it) { if (it === undefined) return this.#unitToStyle; else this.#unitToStyle = it; }

  #styleToUnit = null;

  // private field reflection only
  __styleToUnit(it) { if (it === undefined) return this.#styleToUnit; else this.#styleToUnit = it; }

  #tzToStyle = null;

  // private field reflection only
  __tzToStyle(it) { if (it === undefined) return this.#tzToStyle; else this.#tzToStyle = it; }

  #styleToTz = null;

  // private field reflection only
  __styleToTz(it) { if (it === undefined) return this.#styleToTz; else this.#styleToTz = it; }

  static make(out) {
    const $self = new ExcelWriter();
    ExcelWriter.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    ;
    $self.#out = ExcelOutStream.make(out);
    return;
  }

  flush() {
    this.#out.flush();
    return this;
  }

  close() {
    return this.#out.close();
  }

  writeGrid(grid) {
    return this.writeWorkbook(sys.List.make(haystack.Grid.type$, [grid]));
  }

  writeWorkbook(grids) {
    const this$ = this;
    grids.each((grid) => {
      this$.computeStyling(grid);
      return;
    });
    this.#out.workbook();
    this.#out.styles();
    this.#styleToTz.keys().sort().each((style) => {
      let tz = this$.#styleToTz.get(style);
      this$.#out.styleNumberFormat(style, sys.Str.plus(sys.Str.plus("yyyy-mm-dd hh:mm:ss \"", tz), "\""));
      return;
    });
    this.#styleToUnit.keys().sort().each((style) => {
      let unit = this$.#styleToUnit.get(style);
      if (unit === haystack.Number.dollar()) {
        this$.#out.styleNumberFormat(style, "\"\$\"0.00");
      }
      else {
        this$.#out.styleNumberFormat(style, sys.Str.plus(sys.Str.plus("0.0\"", unit), "\""));
      }
      ;
      return;
    });
    this.#out.stylesEnd();
    grids.each((grid) => {
      this$.writeWorksheet(grid);
      return;
    });
    this.#out.workbookEnd();
    return this;
  }

  computeStyling(grid) {
    const this$ = this;
    grid.each((row) => {
      row.each((v) => {
        this$.checkStyle(v);
        return;
      });
      return;
    });
    return;
  }

  checkStyle(val) {
    if (sys.ObjUtil.is(val, haystack.Number.type$)) {
      return this.checkStyleNumber(sys.ObjUtil.coerce(val, haystack.Number.type$));
    }
    ;
    if (sys.ObjUtil.is(val, sys.DateTime.type$)) {
      return this.checkStyleDateTime(sys.ObjUtil.coerce(val, sys.DateTime.type$));
    }
    ;
    return;
  }

  checkStyleNumber(num) {
    let u = num.unit();
    if ((u != null && this.#unitToStyle.get(sys.ObjUtil.coerce(u, sys.Unit.type$)) == null)) {
      let style = sys.Str.plus("U", sys.ObjUtil.coerce(this.#unitToStyle.size(), sys.Obj.type$.toNullable()));
      this.#unitToStyle.set(sys.ObjUtil.coerce(u, sys.Unit.type$), style);
      this.#styleToUnit.set(style, sys.ObjUtil.coerce(u, sys.Unit.type$));
    }
    ;
    return;
  }

  checkStyleDateTime(ts) {
    let tz = ts.tzAbbr();
    if (this.#tzToStyle.get(tz) == null) {
      let style = sys.Str.plus("DT", sys.ObjUtil.coerce(this.#tzToStyle.size(), sys.Obj.type$.toNullable()));
      this.#tzToStyle.set(tz, style);
      this.#styleToTz.set(style, tz);
    }
    ;
    return;
  }

  writeWorksheet(grid) {
    const this$ = this;
    let title = sys.ObjUtil.as(grid.meta().get("title"), sys.Str.type$);
    this.#out.worksheet(title).table();
    let cols = grid.cols();
    cols.each((col) => {
      this$.#out.col(this$.colWidth(grid, col));
      return;
    });
    this.#out.row(true);
    cols.each((col) => {
      this$.#out.cell(col.dis());
      return;
    });
    this.#out.rowEnd();
    grid.each((row) => {
      this$.#out.row();
      cols.each((col) => {
        let val = row.val(col);
        if (sys.ObjUtil.is(val, haystack.Number.type$)) {
          let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
          let style = ((this$) => { if (num.unit() != null) return this$.#unitToStyle.get(sys.ObjUtil.coerce(num.unit(), sys.Unit.type$)); return null; })(this$);
          this$.#out.cellNumber(num.toFloat(), style);
        }
        else {
          if (sys.ObjUtil.is(val, sys.DateTime.type$)) {
            let ts = sys.ObjUtil.coerce(val, sys.DateTime.type$);
            let style = this$.#tzToStyle.get(ts.tzAbbr());
            this$.#out.cellDateTime(sys.ObjUtil.coerce(val, sys.DateTime.type$), style);
          }
          else {
            this$.#out.cell(this$.dis(row, col));
          }
          ;
        }
        ;
        return;
      });
      this$.#out.rowEnd();
      return;
    });
    this.#out.tableEnd();
    this.#out.worksheetEnd();
    return;
  }

  colWidth(grid,col) {
    const this$ = this;
    let chars = sys.Str.size(col.dis());
    grid.each((row) => {
      (chars = sys.Int.max(chars, sys.Str.size(this$.dis(row, col))));
      return;
    });
    return sys.Int.min(sys.Int.max(40, sys.Int.mult(chars, 6)), 140);
  }

  dis(row,col) {
    let val = row.val(col);
    if (val == null) {
      return "";
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Ref.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Ref.type$).dis();
    }
    ;
    if (val === haystack.Marker.val()) {
      return "\u2713";
    }
    ;
    return sys.ObjUtil.toStr(val);
  }

}

class ExcelOutStream extends sys.OutStream {
  constructor() {
    super();
    const this$ = this;
    this.#in1 = " ";
    this.#in2 = "  ";
    this.#in3 = "   ";
    this.#in4 = "    ";
    this.#sheet = 1;
    return;
  }

  typeof() { return ExcelOutStream.type$; }

  #in1 = null;

  // private field reflection only
  __in1(it) { if (it === undefined) return this.#in1; else this.#in1 = it; }

  #in2 = null;

  // private field reflection only
  __in2(it) { if (it === undefined) return this.#in2; else this.#in2 = it; }

  #in3 = null;

  // private field reflection only
  __in3(it) { if (it === undefined) return this.#in3; else this.#in3 = it; }

  #in4 = null;

  // private field reflection only
  __in4(it) { if (it === undefined) return this.#in4; else this.#in4 = it; }

  #sheet = 0;

  // private field reflection only
  __sheet(it) { if (it === undefined) return this.#sheet; else this.#sheet = it; }

  static make(out) {
    const $self = new ExcelOutStream();
    ExcelOutStream.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    sys.OutStream.make$($self, out);
    ;
    return;
  }

  workbook() {
    return sys.ObjUtil.coerce(this.printLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\"\n xmlns:o=\"urn:schemas-microsoft-com:office:office\"\n xmlns:x=\"urn:schemas-microsoft-com:office:excel\"\n xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\"\n xmlns:html=\"http://www.w3.org/TR/REC-html40\">"), ExcelOutStream.type$);
  }

  workbookEnd() {
    return sys.ObjUtil.coerce(this.printLine("</Workbook>"), ExcelOutStream.type$);
  }

  styles() {
    return sys.ObjUtil.coerce(this.printLine("<Styles>\n  <Style ss:ID=\"HeaderRow\">\n    <Font ss:Bold=\"1\" />\n  </Style>\n  <Style ss:ID=\"DT\">\n     <NumberFormat ss:Format=\"yyyy-mm-dd hh:mm:ss\"/>\n  </Style>"), ExcelOutStream.type$);
  }

  styleNumberFormat(key,format) {
    return sys.ObjUtil.coerce(this.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  <Style ss:ID=\"", key), "\">\n     <NumberFormat ss:Format=\""), sys.Str.toXml(format)), "\"/>\n  </Style>")), ExcelOutStream.type$);
  }

  stylesEnd() {
    return sys.ObjUtil.coerce(this.printLine("</Styles>"), ExcelOutStream.type$);
  }

  worksheet(name) {
    if (name === undefined) name = null;
    if (name == null) {
      (name = sys.Str.plus("Sheet", sys.ObjUtil.coerce(this.#sheet, sys.Obj.type$.toNullable())));
    }
    ;
    this.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#in1), "<Worksheet ss:Name=\""), sys.Str.toXml(name)), "\">"));
    ((this$) => { let $_u13 = this$.#sheet;this$.#sheet = sys.Int.increment(this$.#sheet); return $_u13; })(this);
    return this;
  }

  worksheetEnd() {
    return sys.ObjUtil.coerce(this.printLine(sys.Str.plus(sys.Str.plus("", this.#in1), "</Worksheet>")), ExcelOutStream.type$);
  }

  table() {
    return sys.ObjUtil.coerce(this.printLine(sys.Str.plus(sys.Str.plus("", this.#in2), "<Table>")), ExcelOutStream.type$);
  }

  tableEnd() {
    return sys.ObjUtil.coerce(this.printLine(sys.Str.plus(sys.Str.plus("", this.#in2), "</Table>")), ExcelOutStream.type$);
  }

  col(width) {
    return sys.ObjUtil.coerce(this.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#in2), "<Column ss:Width=\""), sys.ObjUtil.coerce(width, sys.Obj.type$.toNullable())), "\"/>")), ExcelOutStream.type$);
  }

  row(header) {
    if (header === undefined) header = false;
    if (header) {
      this.printLine(sys.Str.plus(sys.Str.plus("", this.#in3), "<Row ss:StyleID=\"HeaderRow\">"));
    }
    else {
      this.printLine(sys.Str.plus(sys.Str.plus("", this.#in3), "<Row>"));
    }
    ;
    return this;
  }

  rowEnd() {
    return sys.ObjUtil.coerce(this.printLine(sys.Str.plus(sys.Str.plus("", this.#in3), "</Row>")), ExcelOutStream.type$);
  }

  cellNumber(val,style) {
    if (style === undefined) style = null;
    if ((sys.Float.isNaN(val) || sys.ObjUtil.equals(val, sys.Float.posInf()) || sys.ObjUtil.equals(val, sys.Float.negInf()))) {
      return this.cell(sys.Float.toStr(val), "String", style);
    }
    else {
      return this.cell(sys.Float.toStr(val), "Number", style);
    }
    ;
  }

  cellDateTime(val,style) {
    if (style === undefined) style = null;
    return this.cell(val.toLocale("YYYY-MM-DD'T'hh:mm:ss.FFF"), "DateTime", style);
  }

  cell(val,type,style) {
    if (type === undefined) type = "String";
    if (style === undefined) style = null;
    let attr = ((this$) => { if (style != null) return sys.Str.plus(sys.Str.plus(" ss:StyleID=\"", style), "\""); return ""; })(this);
    this.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#in4), "<Cell"), attr), "><Data ss:Type=\""), type), "\">"), sys.Str.toXml(val)), "</Data></Cell>"));
    return this;
  }

}

class MiscTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MiscTest.type$; }

  testCircularBuf() {
    const this$ = this;
    let c = CircularBuf.make(3);
    this.verifyEq(sys.ObjUtil.coerce(c.max(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$));
    c.add("a");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["a"]));
    c.add("b");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["b", "a"]));
    c.add("c");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["c", "b", "a"]));
    c.add("d");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["d", "c", "b"]));
    c.add("e");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["e", "d", "c"]));
    c.add("f");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["f", "e", "d"]));
    c.add("g");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["g", "f", "e"]));
    c.resize(3);
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["g", "f", "e"]));
    c.resize(2);
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["g", "f"]));
    c.add("h");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["h", "g"]));
    c.add("i");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["i", "h"]));
    c.add("j");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["j", "i"]));
    c.add("k");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["k", "j"]));
    c.resize(4);
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["k", "j"]));
    c.add("l");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["l", "k", "j"]));
    c.add("m");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["m", "l", "k", "j"]));
    c.add("n");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["n", "m", "l", "k"]));
    c.add("o");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["o", "n", "m", "l"]));
    c.add("p");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["p", "o", "n", "m"]));
    c.add("q");
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$, ["q", "p", "o", "n"]));
    let list = sys.List.make(sys.Str.type$);
    c.eachWhile((v) => {
      list.add(sys.ObjUtil.coerce(v, sys.Str.type$));
      return sys.ObjUtil.coerce(((this$) => { if (sys.ObjUtil.equals(v, "p")) return sys.ObjUtil.coerce(true, sys.Bool.type$.toNullable()); return null; })(this$), sys.Obj.type$.toNullable());
    });
    this.verifyEq(list, sys.List.make(sys.Str.type$, ["q", "p"]));
    list.clear();
    c.eachrWhile((v) => {
      list.add(sys.ObjUtil.coerce(v, sys.Str.type$));
      return sys.ObjUtil.coerce(((this$) => { if (sys.ObjUtil.equals(v, "p")) return sys.ObjUtil.coerce(true, sys.Bool.type$.toNullable()); return null; })(this$), sys.Obj.type$.toNullable());
    });
    this.verifyEq(list, sys.List.make(sys.Str.type$, ["n", "o", "p"]));
    c.clear();
    this.verifyEq(sys.ObjUtil.coerce(c.max(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyCircularBuf(c, sys.List.make(sys.Str.type$));
    return;
  }

  verifyCircularBuf(c,expected) {
    const this$ = this;
    let actual = sys.List.make(sys.Str.type$);
    this.verifyEq(sys.ObjUtil.coerce(c.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected.size(), sys.Obj.type$.toNullable()));
    c.each((val) => {
      actual.add(sys.ObjUtil.coerce(val, sys.Str.type$));
      return;
    });
    this.verifyEq(actual, expected);
    this.verifyEq(c.newest(), expected.first());
    this.verifyEq(c.oldest(), expected.last());
    let revActual = sys.List.make(sys.Str.type$);
    let revExpect = expected.dup().reverse();
    c.eachr((val) => {
      revActual.add(sys.ObjUtil.coerce(val, sys.Str.type$));
      return;
    });
    this.verifyEq(revActual, revExpect);
    return;
  }

  static make() {
    const $self = new MiscTest();
    MiscTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

const p = sys.Pod.add$('hxUtil');
const xp = sys.Param.noParams$();
let m;
CircularBuf.type$ = p.at$('CircularBuf','sys::Obj',[],{},8192,CircularBuf);
XmlWriter.type$ = p.at$('XmlWriter','sys::Obj',['haystack::GridWriter'],{'sys::NoDoc':"",'sys::Js':""},8192,XmlWriter);
ExcelWriter.type$ = p.at$('ExcelWriter','sys::Obj',['haystack::GridWriter'],{'sys::Js':"",'sys::NoDoc':""},8192,ExcelWriter);
ExcelOutStream.type$ = p.at$('ExcelOutStream','sys::OutStream',[],{'sys::Js':"",'sys::NoDoc':""},128,ExcelOutStream);
MiscTest.type$ = p.at$('MiscTest','sys::Test',[],{},8192,MiscTest);
CircularBuf.type$.af$('max',73728,'sys::Int',{}).af$('size',73728,'sys::Int',{}).af$('items',67584,'sys::Obj?[]',{}).af$('tail',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('max','sys::Int',false)]),{}).am$('resize',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('newMax','sys::Int',false)]),{}).am$('newest',8192,'sys::Obj?',xp,{}).am$('oldest',8192,'sys::Obj?',xp,{}).am$('eachWhile',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj?->sys::Obj?|',false)]),{}).am$('eachrWhile',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj?->sys::Obj?|',false)]),{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj?->sys::Void|',false)]),{}).am$('eachr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj?->sys::Void|',false)]),{}).am$('add',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('item','sys::Obj?',false)]),{}).am$('clear',8192,'sys::Void',xp,{});
XmlWriter.type$.af$('out',67584,'sys::OutStream',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('flush',8192,'sys::This',xp,{}).am$('close',8192,'sys::Bool',xp,{}).am$('writeGrid',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('writeGridBody',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('writeCol',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('col','haystack::Col',false)]),{}).am$('writeRow',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cols','haystack::Col[]',false),new sys.Param('row','haystack::Row',false)]),{}).am$('writeCell',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('row','haystack::Row',false),new sys.Param('col','haystack::Col',false)]),{}).am$('writeMetaAndEnd',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elemName','sys::Str',false),new sys.Param('meta','haystack::Dict',false)]),{}).am$('writeMeta',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('meta','haystack::Dict',false)]),{}).am$('writeVal',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elemName','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('writeValAttr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('writeList',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Obj?[]',false)]),{}).am$('writeDict',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false)]),{}).am$('writeAttr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Str',false)]),{});
ExcelWriter.type$.af$('out',67584,'hxUtil::ExcelOutStream',{}).af$('unitToStyle',67584,'[sys::Unit:sys::Str]',{}).af$('styleToUnit',67584,'[sys::Str:sys::Unit]',{}).af$('tzToStyle',67584,'[sys::Str:sys::Str]',{}).af$('styleToTz',67584,'[sys::Str:sys::Str]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('flush',8192,'sys::This',xp,{}).am$('close',8192,'sys::Bool',xp,{}).am$('writeGrid',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('writeWorkbook',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('grids','haystack::Grid[]',false)]),{}).am$('computeStyling',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('checkStyle',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('checkStyleNumber',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('num','haystack::Number',false)]),{}).am$('checkStyleDateTime',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false)]),{}).am$('writeWorksheet',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('colWidth',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('col','haystack::Col',false)]),{}).am$('dis',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('row','haystack::Row',false),new sys.Param('col','haystack::Col',false)]),{});
ExcelOutStream.type$.af$('in1',67586,'sys::Str',{}).af$('in2',67586,'sys::Str',{}).af$('in3',67586,'sys::Str',{}).af$('in4',67586,'sys::Str',{}).af$('sheet',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('workbook',8192,'sys::This',xp,{}).am$('workbookEnd',8192,'sys::This',xp,{}).am$('styles',8192,'sys::This',xp,{}).am$('styleNumberFormat',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('format','sys::Str',false)]),{}).am$('stylesEnd',8192,'sys::This',xp,{}).am$('worksheet',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str?',true)]),{}).am$('worksheetEnd',8192,'sys::This',xp,{}).am$('table',8192,'sys::This',xp,{}).am$('tableEnd',8192,'sys::This',xp,{}).am$('col',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('width','sys::Int',false)]),{}).am$('row',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('header','sys::Bool',true)]),{}).am$('rowEnd',8192,'sys::This',xp,{}).am$('cellNumber',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Float',false),new sys.Param('style','sys::Str?',true)]),{}).am$('cellDateTime',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::DateTime',false),new sys.Param('style','sys::Str?',true)]),{}).am$('cell',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('type','sys::Str',true),new sys.Param('style','sys::Str?',true)]),{});
MiscTest.type$.am$('testCircularBuf',8192,'sys::Void',xp,{}).am$('verifyCircularBuf',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','hxUtil::CircularBuf',false),new sys.Param('expected','sys::Obj?[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxUtil");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;haystack 3.1.11");
m.set("pod.summary", "Haxall utillity APIs");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:25-05:00 New_York");
m.set("build.tsKey", "241210143125");
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
  CircularBuf,
  XmlWriter,
  ExcelWriter,
  MiscTest,
};
