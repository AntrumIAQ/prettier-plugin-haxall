// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as math from './math.js'
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
class MathFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MathFuncs.type$; }

  static #piVal = undefined;

  static piVal() {
    if (MathFuncs.#piVal === undefined) {
      MathFuncs.static$init();
      if (MathFuncs.#piVal === undefined) MathFuncs.#piVal = null;
    }
    return MathFuncs.#piVal;
  }

  static pi() {
    return MathFuncs.piVal();
  }

  static remainder(a,b) {
    return haystack.Number.make(sys.Float.mod(a.toFloat(), b.toFloat()), a.unit());
  }

  static ceil(val) {
    return haystack.Number.make(sys.Float.ceil(val.toFloat()), val.unit());
  }

  static floor(val) {
    return haystack.Number.make(sys.Float.floor(val.toFloat()), val.unit());
  }

  static round(val) {
    return haystack.Number.make(sys.Float.round(val.toFloat()), val.unit());
  }

  static exp(val) {
    return haystack.Number.make(sys.Float.exp(val.toFloat()));
  }

  static logE(val) {
    return haystack.Number.make(sys.Float.log(val.toFloat()));
  }

  static log10(val) {
    return haystack.Number.make(sys.Float.log10(val.toFloat()));
  }

  static pow(val,exp) {
    return haystack.Number.make(sys.Float.pow(val.toFloat(), exp.toFloat()));
  }

  static sqrt(val) {
    return haystack.Number.make(sys.Float.sqrt(val.toFloat()));
  }

  static random(range) {
    if (range === undefined) range = null;
    let r = ((this$) => { if (range == null) return sys.Range.make(-2251799813685248, 2251799813685248); return sys.ObjUtil.coerce(range, haystack.ObjRange.type$).toIntRange(); })(this);
    return sys.ObjUtil.coerce(haystack.Number.makeInt(r.random()), haystack.Number.type$);
  }

  static bitNot(a) {
    return sys.ObjUtil.coerce(haystack.Number.makeInt(sys.Int.not(a.toInt())), haystack.Number.type$);
  }

  static bitAnd(a,b) {
    return sys.ObjUtil.coerce(haystack.Number.makeInt(sys.Int.and(a.toInt(), b.toInt())), haystack.Number.type$);
  }

  static bitOr(a,b) {
    return sys.ObjUtil.coerce(haystack.Number.makeInt(sys.Int.or(a.toInt(), b.toInt())), haystack.Number.type$);
  }

  static bitXor(a,b) {
    return sys.ObjUtil.coerce(haystack.Number.makeInt(sys.Int.xor(a.toInt(), b.toInt())), haystack.Number.type$);
  }

  static bitShiftr(a,b) {
    return sys.ObjUtil.coerce(haystack.Number.makeInt(sys.Int.shiftr(a.toInt(), b.toInt())), haystack.Number.type$);
  }

  static bitShiftl(a,b) {
    return sys.ObjUtil.coerce(haystack.Number.makeInt(sys.Int.shiftl(a.toInt(), b.toInt())), haystack.Number.type$);
  }

  static acos(val) {
    return haystack.Number.make(sys.Float.acos(val.toFloat()));
  }

  static asin(val) {
    return haystack.Number.make(sys.Float.asin(val.toFloat()));
  }

  static atan(val) {
    return haystack.Number.make(sys.Float.atan(val.toFloat()));
  }

  static atan2(y,x) {
    return haystack.Number.make(sys.Float.atan2(y.toFloat(), x.toFloat()));
  }

  static cos(val) {
    return haystack.Number.make(sys.Float.cos(val.toFloat()));
  }

  static cosh(val) {
    return haystack.Number.make(sys.Float.cosh(val.toFloat()));
  }

  static sin(val) {
    return haystack.Number.make(sys.Float.sin(val.toFloat()));
  }

  static sinh(val) {
    return haystack.Number.make(sys.Float.sinh(val.toFloat()));
  }

  static tan(val) {
    return haystack.Number.make(sys.Float.tan(val.toFloat()));
  }

  static tanh(val) {
    return haystack.Number.make(sys.Float.tanh(val.toFloat()));
  }

  static toDegrees(val) {
    return haystack.Number.make(sys.Float.toDegrees(val.toFloat()));
  }

  static toRadians(val) {
    return haystack.Number.make(sys.Float.toRadians(val.toFloat()));
  }

  static mean(val,acc) {
    return axon.CoreLib.avg(val, acc);
  }

  static median(val,acc) {
    if ((val === haystack.NA.val() || acc === haystack.NA.val())) {
      return haystack.NA.val();
    }
    ;
    let fold = sys.ObjUtil.as(acc, NumberFold.type$);
    if (val === axon.CoreLib.foldStart()) {
      return NumberFold.make();
    }
    ;
    if (val !== axon.CoreLib.foldEnd()) {
      return sys.ObjUtil.coerce(fold.add(sys.ObjUtil.coerce(val, haystack.Number.type$.toNullable())), NumberFold.type$.toNullable());
    }
    ;
    if (fold.isEmpty()) {
      return null;
    }
    ;
    return haystack.Number.make(fold.median(), fold.unit());
  }

  static rootMeanSquareErr(val,acc,nDegrees) {
    if (nDegrees === undefined) nDegrees = haystack.Number.zero();
    if ((val === haystack.NA.val() || acc === haystack.NA.val())) {
      return haystack.NA.val();
    }
    ;
    let fold = sys.ObjUtil.as(acc, NumberFold.type$);
    if (val === axon.CoreLib.foldStart()) {
      return NumberFold.make();
    }
    ;
    if (val !== axon.CoreLib.foldEnd()) {
      return sys.ObjUtil.coerce(fold.add(sys.ObjUtil.coerce(val, haystack.Number.type$.toNullable())), NumberFold.type$.toNullable());
    }
    ;
    if (fold.isEmpty()) {
      return null;
    }
    ;
    let median = fold.median();
    if (sys.ObjUtil.compareLE(fold.size(), nDegrees.toInt())) {
      return null;
    }
    ;
    let sumsq = sys.Float.make(0.0);
    for (let i = 0; sys.ObjUtil.compareLT(i, fold.size()); i = sys.Int.increment(i)) {
      let diff = sys.Float.minus(fold.get(i), median);
      sumsq = sys.Float.plus(sumsq, sys.Float.mult(diff, diff));
    }
    ;
    let rmse = sys.Float.mult(sys.Float.divInt(sys.Float.make(1.0), sys.Int.minus(fold.size(), nDegrees.toInt())), sys.Float.sqrt(sumsq));
    return haystack.Number.make(rmse, fold.unit());
  }

  static meanBiasErr(val,acc,nDegrees) {
    if (nDegrees === undefined) nDegrees = haystack.Number.zero();
    if ((val === haystack.NA.val() || acc === haystack.NA.val())) {
      return haystack.NA.val();
    }
    ;
    let fold = sys.ObjUtil.as(acc, NumberFold.type$);
    if (val === axon.CoreLib.foldStart()) {
      return NumberFold.make();
    }
    ;
    if (val !== axon.CoreLib.foldEnd()) {
      return sys.ObjUtil.coerce(fold.add(sys.ObjUtil.coerce(val, haystack.Number.type$.toNullable())), NumberFold.type$.toNullable());
    }
    ;
    if (fold.isEmpty()) {
      return null;
    }
    ;
    let median = fold.median();
    if (sys.ObjUtil.compareLE(fold.size(), nDegrees.toInt())) {
      return null;
    }
    ;
    let sum = sys.Float.make(0.0);
    for (let i = 0; sys.ObjUtil.compareLT(i, fold.size()); i = sys.Int.increment(i)) {
      sum = sys.Float.plus(sum, sys.Float.minus(fold.get(i), median));
    }
    ;
    let mbe = sys.Float.mult(sys.Float.divInt(sys.Float.make(1.0), sys.Int.minus(fold.size(), nDegrees.toInt())), sum);
    return haystack.Number.make(mbe, fold.unit());
  }

  static standardDeviation(val,acc) {
    if ((val === haystack.NA.val() || acc === haystack.NA.val())) {
      return haystack.NA.val();
    }
    ;
    let fold = sys.ObjUtil.as(acc, NumberFold.type$);
    if (val === axon.CoreLib.foldStart()) {
      return NumberFold.make();
    }
    ;
    if (val !== axon.CoreLib.foldEnd()) {
      return sys.ObjUtil.coerce(fold.add(sys.ObjUtil.coerce(val, haystack.Number.type$.toNullable())), NumberFold.type$.toNullable());
    }
    ;
    if (fold.isEmpty()) {
      return null;
    }
    ;
    let mean = fold.mean();
    let sumsq = sys.Float.make(0.0);
    for (let i = 0; sys.ObjUtil.compareLT(i, fold.size()); i = sys.Int.increment(i)) {
      let diff = sys.Float.minus(fold.get(i), mean);
      sumsq = sys.Float.plus(sumsq, sys.Float.mult(diff, diff));
    }
    ;
    let stdDev = sys.Float.sqrt(sys.Float.divInt(sumsq, sys.Int.minus(fold.size(), 1)));
    return haystack.Number.make(stdDev, fold.unit());
  }

  static quantile(percent,method) {
    if (method === undefined) method = "linear";
    let perc = percent.toFloat();
    if ((sys.ObjUtil.compareLT(perc, sys.Float.make(0.0)) || sys.ObjUtil.compareGT(perc, sys.Float.make(1.0)))) {
      throw sys.ArgErr.make("Percent must be between 0-1");
    }
    ;
    return axon.AxonContext.curAxon().evalToFunc(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("quantileFold(_,_,", percent), ", \""), method), "\")"));
  }

  static quantileFold(val,acc,perc,method) {
    if ((val === haystack.NA.val() || acc === haystack.NA.val())) {
      return haystack.NA.val();
    }
    ;
    let fold = sys.ObjUtil.as(acc, NumberFold.type$);
    if (val === axon.CoreLib.foldStart()) {
      return NumberFold.make();
    }
    ;
    if (val !== axon.CoreLib.foldEnd()) {
      return sys.ObjUtil.coerce(fold.add(sys.ObjUtil.coerce(val, haystack.Number.type$.toNullable())), NumberFold.type$.toNullable());
    }
    ;
    if (fold.isEmpty()) {
      return null;
    }
    ;
    let out = haystack.Number.make(fold.quantile(perc.toFloat(), method), fold.unit());
    return out;
  }

  static toMatrix(obj,opts) {
    if (opts === undefined) opts = haystack.Etc.emptyDict();
    if (sys.ObjUtil.is(obj, MatrixGrid.type$)) {
      return sys.ObjUtil.coerce(obj, MatrixGrid.type$);
    }
    ;
    if (sys.ObjUtil.is(obj, haystack.Grid.type$)) {
      return MatrixGrid.makeGrid(sys.ObjUtil.coerce(obj, haystack.Grid.type$), opts);
    }
    ;
    if (sys.ObjUtil.is(obj, haystack.Dict.type$)) {
      let nrows = ((this$) => { let $_u1 = ((this$) => { let $_u2 = sys.ObjUtil.as(sys.ObjUtil.coerce(obj, haystack.Dict.type$).get("rows"), haystack.Number.type$); if ($_u2 == null) return null; return sys.ObjUtil.as(sys.ObjUtil.coerce(obj, haystack.Dict.type$).get("rows"), haystack.Number.type$).toInt(); })(this$); if ($_u1 != null) return $_u1; throw sys.ArgErr.make(sys.Str.plus("Invalid rows: ", obj)); })(this);
      let ncols = ((this$) => { let $_u3 = ((this$) => { let $_u4 = sys.ObjUtil.as(sys.ObjUtil.coerce(obj, haystack.Dict.type$).get("cols"), haystack.Number.type$); if ($_u4 == null) return null; return sys.ObjUtil.as(sys.ObjUtil.coerce(obj, haystack.Dict.type$).get("cols"), haystack.Number.type$).toInt(); })(this$); if ($_u3 != null) return $_u3; throw sys.ArgErr.make(sys.Str.plus("Invalid cols: ", obj)); })(this);
      let init = ((this$) => { let $_u5 = ((this$) => { let $_u6 = sys.ObjUtil.as(sys.ObjUtil.coerce(obj, haystack.Dict.type$).get("init"), haystack.Number.type$); if ($_u6 == null) return null; return sys.ObjUtil.as(sys.ObjUtil.coerce(obj, haystack.Dict.type$).get("init"), haystack.Number.type$).toFloat(); })(this$); if ($_u5 != null) return $_u5; throw sys.ArgErr.make(sys.Str.plus("Invalid init: ", obj)); })(this);
      let matrix = math.Math.matrix(sys.ObjUtil.coerce(nrows, sys.Int.type$), sys.ObjUtil.coerce(ncols, sys.Int.type$)).fill(sys.ObjUtil.coerce(init, sys.Float.type$));
      return MatrixGrid.makeMatrix(haystack.Etc.emptyDict(), matrix);
    }
    ;
    throw sys.Err.make(sys.Str.plus("Unsupported toMatrix type: ", sys.ObjUtil.typeof(obj)));
  }

  static matrixTranspose(m) {
    return MathFuncs.toMatrix(m).transpose();
  }

  static matrixDeterminant(m) {
    return haystack.Number.make(MathFuncs.toMatrix(m).determinant());
  }

  static matrixInverse(m) {
    return MathFuncs.toMatrix(m).inverse();
  }

  static matrixAdd(a,b) {
    return MathFuncs.toMatrix(a).plus(MathFuncs.toMatrix(b));
  }

  static matrixSub(a,b) {
    return MathFuncs.toMatrix(a).minus(MathFuncs.toMatrix(b));
  }

  static matrixMult(a,b) {
    return MathFuncs.toMatrix(a).mult(MathFuncs.toMatrix(b));
  }

  static matrixFitLinearRegression(y,x) {
    return MatrixGrid.fitLinearRegression(MathFuncs.toMatrix(y), MathFuncs.toMatrix(x));
  }

  static fitLinearRegression(grid,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    let points = MathPointList.make(grid, opts);
    let xmean = points.xmean();
    let ymean = points.ymean();
    let sumxy = sys.Float.make(0.0);
    let sumx2 = sys.Float.make(0.0);
    let xmin = sys.Float.posInf();
    let xmax = sys.Float.negInf();
    let ymin = sys.Float.posInf();
    let ymax = sys.Float.negInf();
    points.each((pt) => {
      let xdiff = sys.Float.minus(pt.x(), xmean);
      let ydiff = sys.Float.minus(pt.y(), ymean);
      sumxy = sys.Float.plus(sumxy, sys.Float.mult(xdiff, ydiff));
      sumx2 = sys.Float.plus(sumx2, sys.Float.mult(xdiff, xdiff));
      (xmin = sys.Float.min(xmin, pt.x()));
      (xmax = sys.Float.max(xmax, pt.x()));
      (ymin = sys.Float.min(ymin, pt.y()));
      (ymax = sys.Float.max(ymax, pt.y()));
      return;
    });
    let m = sys.Float.div(sumxy, sumx2);
    let b = sys.Float.minus(ymean, sys.Float.mult(m, xmean));
    let SStot = sys.Float.make(0.0);
    let SSerr = sys.Float.make(0.0);
    points.each((pt) => {
      let yrdiff = sys.Float.minus(pt.y(), sys.Float.plus(sys.Float.mult(m, pt.x()), b));
      let ymdiff = sys.Float.minus(pt.y(), ymean);
      SStot = sys.Float.plus(SStot, sys.Float.mult(ymdiff, ymdiff));
      SSerr = sys.Float.plus(SSerr, sys.Float.mult(yrdiff, yrdiff));
      return;
    });
    let r2 = sys.Float.minus(sys.Float.make(1.0), sys.Float.div(SSerr, SStot));
    return haystack.Etc.makeDict(sys.Map.__fromLiteral(["m","b","r2","xmin","xmax","ymin","ymax"], [haystack.Number.make(m),haystack.Number.make(b),haystack.Number.make(r2),haystack.Number.make(xmin),haystack.Number.make(xmax),haystack.Number.make(ymin),haystack.Number.make(ymax)], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number")));
  }

  static make() {
    const $self = new MathFuncs();
    MathFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    MathFuncs.#piVal = haystack.Number.make(sys.Float.pi());
    return;
  }

}

class MatrixGrid extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MatrixGrid.type$; }

  addColMeta() { return haystack.Grid.prototype.addColMeta.apply(this, arguments); }

  colNames() { return haystack.Grid.prototype.colNames.apply(this, arguments); }

  colToList() { return haystack.Grid.prototype.colToList.apply(this, arguments); }

  replace() { return haystack.Grid.prototype.replace.apply(this, arguments); }

  commit() { return haystack.Grid.prototype.commit.apply(this, arguments); }

  toConst() { return haystack.Grid.prototype.toConst.apply(this, arguments); }

  findAll() { return haystack.Grid.prototype.findAll.apply(this, arguments); }

  keepCols() { return haystack.Grid.prototype.keepCols.apply(this, arguments); }

  colsToLocale() { return haystack.Grid.prototype.colsToLocale.apply(this, arguments); }

  renameCol() { return haystack.Grid.prototype.renameCol.apply(this, arguments); }

  incomplete() { return haystack.Grid.prototype.incomplete.apply(this, arguments); }

  find() { return haystack.Grid.prototype.find.apply(this, arguments); }

  getRange() { return haystack.Grid.prototype.getRange.apply(this, arguments); }

  has() { return haystack.Grid.prototype.has.apply(this, arguments); }

  join() { return haystack.Grid.prototype.join.apply(this, arguments); }

  sortr() { return haystack.Grid.prototype.sortr.apply(this, arguments); }

  isIncomplete() { return haystack.Grid.prototype.isIncomplete.apply(this, arguments); }

  all() { return haystack.Grid.prototype.all.apply(this, arguments); }

  last() { return haystack.Grid.prototype.last.apply(this, arguments); }

  setColMeta() { return haystack.Grid.prototype.setColMeta.apply(this, arguments); }

  isErr() { return haystack.Grid.prototype.isErr.apply(this, arguments); }

  addCol() { return haystack.Grid.prototype.addCol.apply(this, arguments); }

  sort() { return haystack.Grid.prototype.sort.apply(this, arguments); }

  flatMap() { return haystack.Grid.prototype.flatMap.apply(this, arguments); }

  renameCols() { return haystack.Grid.prototype.renameCols.apply(this, arguments); }

  removeCol() { return haystack.Grid.prototype.removeCol.apply(this, arguments); }

  sortColr() { return haystack.Grid.prototype.sortColr.apply(this, arguments); }

  addCols() { return haystack.Grid.prototype.addCols.apply(this, arguments); }

  unique() { return haystack.Grid.prototype.unique.apply(this, arguments); }

  ids() { return haystack.Grid.prototype.ids.apply(this, arguments); }

  addMeta() { return haystack.Grid.prototype.addMeta.apply(this, arguments); }

  sortDis() { return haystack.Grid.prototype.sortDis.apply(this, arguments); }

  setMeta() { return haystack.Grid.prototype.setMeta.apply(this, arguments); }

  sortCol() { return haystack.Grid.prototype.sortCol.apply(this, arguments); }

  missing() { return haystack.Grid.prototype.missing.apply(this, arguments); }

  dump() { return haystack.Grid.prototype.dump.apply(this, arguments); }

  map() { return haystack.Grid.prototype.map.apply(this, arguments); }

  removeCols() { return haystack.Grid.prototype.removeCols.apply(this, arguments); }

  colDisNames() { return haystack.Grid.prototype.colDisNames.apply(this, arguments); }

  isEmpty() { return haystack.Grid.prototype.isEmpty.apply(this, arguments); }

  any() { return haystack.Grid.prototype.any.apply(this, arguments); }

  findIndex() { return haystack.Grid.prototype.findIndex.apply(this, arguments); }

  filter() { return haystack.Grid.prototype.filter.apply(this, arguments); }

  isHisGrid() { return haystack.Grid.prototype.isHisGrid.apply(this, arguments); }

  mapToList() { return haystack.Grid.prototype.mapToList.apply(this, arguments); }

  reorderCols() { return haystack.Grid.prototype.reorderCols.apply(this, arguments); }

  #matrixRef = null;

  // private field reflection only
  __matrixRef(it) { if (it === undefined) return this.#matrixRef; else this.#matrixRef = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #cols = null;

  cols() { return this.#cols; }

  __cols(it) { if (it === undefined) return this.#cols; else this.#cols = it; }

  #rows = null;

  // private field reflection only
  __rows(it) { if (it === undefined) return this.#rows; else this.#rows = it; }

  static makeGrid(grid,opts) {
    const $self = new MatrixGrid();
    MatrixGrid.makeGrid$($self,grid,opts);
    return $self;
  }

  static makeGrid$($self,grid,opts) {
    if (opts === undefined) opts = haystack.Etc.emptyDict();
    const this$ = $self;
    $self.#meta = grid.meta();
    let cols = grid.cols();
    let m = math.Math.matrix(grid.size(), cols.size());
    grid.each((row,rowi) => {
      cols.each((col,coli) => {
        let val = row.val(col);
        if (val == null) {
          (val = opts.get("nullVal"));
        }
        else {
          if (val === haystack.NA.val()) {
            (val = opts.get("naVal"));
          }
          ;
        }
        ;
        let num = sys.ObjUtil.as(val, haystack.Number.type$);
        if (num == null) {
          throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Grid cell (", sys.ObjUtil.coerce(rowi, sys.Obj.type$.toNullable())), ", "), col.name()), ") not a number: "), ((this$) => { let $_u7 = val; if ($_u7 == null) return null; return sys.ObjUtil.typeof(val); })(this$)));
        }
        ;
        m.set(rowi, coli, num.toFloat());
        return;
      });
      return;
    });
    $self.#matrixRef = sys.Unsafe.make(m);
    $self.#rows = sys.ObjUtil.coerce(((this$) => { let $_u8 = MatrixRow.makeList(this$); if ($_u8 == null) return null; return sys.ObjUtil.toImmutable(MatrixRow.makeList(this$)); })($self), sys.Type.find("hxMath::MatrixRow[]"));
    $self.#cols = sys.ObjUtil.coerce(((this$) => { let $_u9 = MatrixGrid.toCols(cols.size()); if ($_u9 == null) return null; return sys.ObjUtil.toImmutable(MatrixGrid.toCols(cols.size())); })($self), sys.Type.find("haystack::Col[]"));
    return;
  }

  static makeMatrix(meta,matrix) {
    const $self = new MatrixGrid();
    MatrixGrid.makeMatrix$($self,meta,matrix);
    return $self;
  }

  static makeMatrix$($self,meta,matrix) {
    $self.#meta = meta;
    $self.#matrixRef = sys.Unsafe.make(matrix);
    $self.#rows = sys.ObjUtil.coerce(((this$) => { let $_u10 = MatrixRow.makeList(this$); if ($_u10 == null) return null; return sys.ObjUtil.toImmutable(MatrixRow.makeList(this$)); })($self), sys.Type.find("hxMath::MatrixRow[]"));
    $self.#cols = sys.ObjUtil.coerce(((this$) => { let $_u11 = MatrixGrid.toCols(matrix.numCols()); if ($_u11 == null) return null; return sys.ObjUtil.toImmutable(MatrixGrid.toCols(matrix.numCols())); })($self), sys.Type.find("haystack::Col[]"));
    return;
  }

  static toCols(numCols) {
    const this$ = this;
    if (sys.ObjUtil.compareLT(numCols, MatrixCol.list().size())) {
      return MatrixCol.list().getRange(sys.Range.make(0, numCols, true));
    }
    else {
      let arr = MatrixCol.list().dup();
      sys.Range.make(MatrixCol.list().size(), numCols, true).each((n) => {
        arr.add(MatrixCol.make(n));
        return;
      });
      return arr;
    }
    ;
  }

  matrix() {
    return sys.ObjUtil.coerce(this.#matrixRef.val(), math.Matrix.type$);
  }

  numRows() {
    return this.matrix().numRows();
  }

  numCols() {
    return this.matrix().numCols();
  }

  isSquare() {
    return this.matrix().isSquare();
  }

  float(row,col) {
    return this.matrix().get(row, col);
  }

  number(row,col) {
    let f = this.float(row, col);
    return haystack.Number.make(f);
  }

  col(name,checked) {
    if (checked === undefined) checked = true;
    let i = sys.Str.toInt(sys.Str.getRange(name, sys.Range.make(1, -1)), 10, false);
    let col = null;
    if (i != null) {
      (col = this.#cols.getSafe(sys.ObjUtil.coerce(i, sys.Int.type$)));
    }
    ;
    if (col != null) {
      return sys.ObjUtil.coerce(col, haystack.Col.type$.toNullable());
    }
    ;
    if (checked) {
      throw haystack.UnknownNameErr.make(name);
    }
    ;
    return null;
  }

  each(f) {
    this.#rows.each(f);
    return;
  }

  eachWhile(f) {
    return this.#rows.eachWhile(f);
  }

  size() {
    return this.#rows.size();
  }

  get(index) {
    return this.#rows.get(index);
  }

  getSafe(index) {
    return this.#rows.getSafe(index);
  }

  first() {
    return this.#rows.first();
  }

  toRows() {
    return this.#rows;
  }

  transpose() {
    return MatrixGrid.makeMatrix(this.#meta, this.matrix().transpose());
  }

  multByConst(x) {
    let m = math.Math.matrix(this.numRows(), this.numCols());
    for (let r = 0; sys.ObjUtil.compareLT(r, this.numRows()); r = sys.Int.increment(r)) {
      for (let c = 0; sys.ObjUtil.compareLT(c, this.numCols()); c = sys.Int.increment(c)) {
        m.set(r, c, sys.Float.mult(this.float(r, c), x));
      }
      ;
    }
    ;
    return MatrixGrid.makeMatrix(this.#meta, m);
  }

  insertCol(val) {
    let aNumCols = sys.Int.plus(this.numCols(), 1);
    let m = math.Math.matrix(this.numRows(), aNumCols);
    for (let r = 0; sys.ObjUtil.compareLT(r, this.numRows()); r = sys.Int.increment(r)) {
      m.set(r, 0, val);
      for (let c = 0; sys.ObjUtil.compareLT(c, this.numCols()); c = sys.Int.increment(c)) {
        m.set(r, sys.Int.plus(c, 1), this.float(r, c));
      }
      ;
    }
    ;
    return MatrixGrid.makeMatrix(this.#meta, m);
  }

  plus(b) {
    return MatrixGrid.makeMatrix(this.#meta, this.matrix().plus(b.matrix()));
  }

  minus(b) {
    return MatrixGrid.makeMatrix(this.#meta, this.matrix().minus(b.matrix()));
  }

  mult(b) {
    return MatrixGrid.makeMatrix(this.#meta, this.matrix().mult(b.matrix()));
  }

  determinant() {
    return this.matrix().determinant();
  }

  cofactor() {
    return MatrixGrid.makeMatrix(this.#meta, this.matrix().cofactor());
  }

  inverse() {
    return MatrixGrid.makeMatrix(this.#meta, this.matrix().inverse());
  }

  static fitLinearRegression(Y,X) {
    if (sys.ObjUtil.compareGT(X.numCols(), X.numRows())) {
      throw sys.Err.make("The number of columns in X matrix cannot be more than the number of rows");
    }
    ;
    if (sys.ObjUtil.compareNE(X.numRows(), Y.numRows())) {
      throw sys.Err.make("The number of rows in X matrix should be the same as the number of rows in Y matrix");
    }
    ;
    let Xic = X.insertCol(sys.Float.make(1.0));
    let Xtr = Xic.transpose();
    let XtrX = Xtr.mult(Xic);
    let invXtrX = XtrX.inverse();
    let XtrY = Xtr.mult(Y);
    let B = invXtrX.mult(XtrY);
    let Ycalc = util.FloatArray.makeF8(Y.numRows());
    let ymean = sys.Float.make(0.0);
    for (let i = 0; sys.ObjUtil.compareLT(i, Y.numRows()); ((this$) => { let $_u12 = i;i = sys.Int.increment(i); return $_u12; })(this)) {
      let yCalcVal = B.float(0, 0);
      for (let j = 0; sys.ObjUtil.compareLT(j, X.numCols()); ((this$) => { let $_u13 = j;j = sys.Int.increment(j); return $_u13; })(this)) {
        yCalcVal = sys.Float.plus(yCalcVal, sys.Float.mult(B.float(sys.Int.plus(j, 1), 0), X.float(i, j)));
      }
      ;
      Ycalc.set(i, yCalcVal);
      ymean = sys.Float.plus(ymean, Y.float(i, 0));
    }
    ;
    (ymean = sys.Float.divInt(ymean, Y.numRows()));
    let SStot = sys.Float.make(0.0);
    let SSerr = sys.Float.make(0.0);
    for (let i = 0; sys.ObjUtil.compareLT(i, Y.numRows()); ((this$) => { let $_u14 = i;i = sys.Int.increment(i); return $_u14; })(this)) {
      let yrdiff = sys.Float.minus(Y.float(i, 0), Ycalc.get(i));
      let ymdiff = sys.Float.minus(Y.float(i, 0), ymean);
      SStot = sys.Float.plus(SStot, sys.Float.mult(ymdiff, ymdiff));
      SSerr = sys.Float.plus(SSerr, sys.Float.mult(yrdiff, yrdiff));
    }
    ;
    let r2 = sys.Float.minus(sys.Float.make(1.0), sys.Float.div(SSerr, SStot));
    let r = sys.Float.sqrt(r2);
    let gb = haystack.GridBuilder.make();
    gb.setMeta(sys.Map.__fromLiteral(["r","r2","ymean","rowCount","bias"], [haystack.Number.make(r),haystack.Number.make(r2),haystack.Number.make(ymean),haystack.Number.makeInt(Y.numRows()),haystack.Number.make(B.float(0, 0))], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")));
    gb.addCol("b");
    for (let i = 1; sys.ObjUtil.compareLT(i, B.numRows()); ((this$) => { let $_u15 = i;i = sys.Int.increment(i); return $_u15; })(this)) {
      gb.addRow1(haystack.Number.make(B.float(i, 0)));
    }
    ;
    return gb.toGrid();
  }

  static arrayMake(numRows,numCols) {
    return util.FloatArray.makeF8(sys.Int.mult(numRows, numCols));
  }

  static index(numCols,row,col) {
    return sys.Int.plus(sys.Int.mult(row, numCols), col);
  }

}

class MatrixCol extends haystack.Col {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MatrixCol.type$; }

  static #list = undefined;

  static list() {
    if (MatrixCol.#list === undefined) {
      MatrixCol.static$init();
      if (MatrixCol.#list === undefined) MatrixCol.#list = null;
    }
    return MatrixCol.#list;
  }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #index = 0;

  index() { return this.#index; }

  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  static make(index) {
    const $self = new MatrixCol();
    MatrixCol.make$($self,index);
    return $self;
  }

  static make$($self,index) {
    haystack.Col.make$($self);
    $self.#name = sys.Str.plus("v", sys.ObjUtil.coerce(index, sys.Obj.type$.toNullable()));
    $self.#index = index;
    return;
  }

  meta() {
    return haystack.Etc.emptyDict();
  }

  static static$init() {
    const this$ = this;
    if (true) {
      let accList = sys.List.make(MatrixCol.type$);
      let accMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hxMath::MatrixCol"));
      sys.Int.times(100, (i) => {
        let col = MatrixCol.make(i);
        accList.add(col);
        accMap.set(col.#name, col);
        return;
      });
      MatrixCol.#list = sys.ObjUtil.coerce(((this$) => { let $_u16 = accList; if ($_u16 == null) return null; return sys.ObjUtil.toImmutable(accList); })(this), sys.Type.find("hxMath::MatrixCol[]"));
    }
    ;
    return;
  }

}

class MatrixRow extends haystack.Row {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MatrixRow.type$; }

  #grid = null;

  grid() { return this.#grid; }

  __grid(it) { if (it === undefined) return this.#grid; else this.#grid = it; }

  #index = 0;

  index() { return this.#index; }

  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  static makeList(m) {
    const this$ = this;
    let acc = sys.List.make(MatrixRow.type$);
    acc.capacity(m.numRows());
    sys.Int.times(m.numRows(), (i) => {
      acc.add(MatrixRow.make(m, i));
      return;
    });
    return acc;
  }

  static make(grid,index) {
    const $self = new MatrixRow();
    MatrixRow.make$($self,grid,index);
    return $self;
  }

  static make$($self,grid,index) {
    haystack.Row.make$($self);
    $self.#grid = grid;
    $self.#index = index;
    return;
  }

  val(col) {
    return this.#grid.number(this.#index, sys.ObjUtil.coerce(col, MatrixCol.type$).index());
  }

}

class MathPointList extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#points = sys.List.make(MathPoint.type$);
    return;
  }

  typeof() { return MathPointList.type$; }

  #xmean = sys.Float.make(0);

  xmean() { return this.#xmean; }

  __xmean(it) { if (it === undefined) return this.#xmean; else this.#xmean = it; }

  #ymean = sys.Float.make(0);

  ymean() { return this.#ymean; }

  __ymean(it) { if (it === undefined) return this.#ymean; else this.#ymean = it; }

  #n = sys.Float.make(0);

  n() { return this.#n; }

  __n(it) { if (it === undefined) return this.#n; else this.#n = it; }

  #points = null;

  // private field reflection only
  __points(it) { if (it === undefined) return this.#points; else this.#points = it; }

  static make(grid,opts) {
    const $self = new MathPointList();
    MathPointList.make$($self,grid,opts);
    return $self;
  }

  static make$($self,grid,opts) {
    const this$ = $self;
    ;
    if (sys.ObjUtil.compareLT(grid.cols().size(), 2)) {
      throw sys.Err.make("Grid does not have 2 columns");
    }
    ;
    let xcol = grid.cols().get(0);
    let ycol = grid.cols().get(1);
    if (opts == null) {
      (opts = haystack.Etc.emptyDict());
    }
    ;
    if (opts.has("x")) {
      (xcol = sys.ObjUtil.coerce(grid.col(sys.ObjUtil.coerce(opts.trap("x", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$)), haystack.Col.type$));
    }
    ;
    if (opts.has("y")) {
      (ycol = sys.ObjUtil.coerce(grid.col(sys.ObjUtil.coerce(opts.trap("y", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$)), haystack.Col.type$));
    }
    ;
    let acc = sys.List.make(MathPoint.type$);
    acc.capacity(grid.size());
    let xmean = sys.Float.make(0.0);
    let ymean = sys.Float.make(0.0);
    grid.each((row) => {
      let xn = sys.ObjUtil.as(row.val(xcol), haystack.Number.type$);
      let yn = sys.ObjUtil.as(row.val(ycol), haystack.Number.type$);
      if ((xn == null || yn == null)) {
        return;
      }
      ;
      if ((xn.isSpecial() || yn.isSpecial())) {
        return;
      }
      ;
      let x = xn.toFloat();
      let y = yn.toFloat();
      acc.add(MathPoint.make(x, y));
      xmean = sys.Float.plus(xmean, x);
      ymean = sys.Float.plus(ymean, y);
      return;
    });
    if (sys.ObjUtil.equals(acc.size(), 0)) {
      throw sys.Err.make("Grid has no x, y samples");
    }
    ;
    $self.#points = acc;
    $self.#n = sys.Num.toFloat(sys.ObjUtil.coerce(acc.size(), sys.Num.type$));
    $self.#xmean = sys.Float.div(xmean, $self.#n);
    $self.#ymean = sys.Float.div(ymean, $self.#n);
    return;
  }

  x(index) {
    return this.#points.get(index).x();
  }

  y(index) {
    return this.#points.get(index).y();
  }

  get(index) {
    return this.#points.get(index);
  }

  each(f) {
    this.#points.each(f);
    return;
  }

}

class MathPoint extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MathPoint.type$; }

  #x = sys.Float.make(0);

  x() { return this.#x; }

  __x(it) { if (it === undefined) return this.#x; else this.#x = it; }

  #y = sys.Float.make(0);

  y() { return this.#y; }

  __y(it) { if (it === undefined) return this.#y; else this.#y = it; }

  static make(x,y) {
    const $self = new MathPoint();
    MathPoint.make$($self,x,y);
    return $self;
  }

  static make$($self,x,y) {
    $self.#x = x;
    $self.#y = y;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this.#x, sys.Obj.type$.toNullable())), ", "), sys.ObjUtil.coerce(this.#y, sys.Obj.type$.toNullable()));
  }

}

class NumberFold extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#array = util.FloatArray.makeF8(1024);
    return;
  }

  typeof() { return NumberFold.type$; }

  #size = 0;

  size(it) {
    if (it === undefined) {
      return this.#size;
    }
    else {
      this.#size = it;
      return;
    }
  }

  #array = null;

  array(it) {
    if (it === undefined) {
      return this.#array;
    }
    else {
      this.#array = it;
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

  get(index) {
    return this.#array.get(index);
  }

  isEmpty() {
    return sys.ObjUtil.equals(this.#size, 0);
  }

  add(val) {
    if (val == null) {
      return this;
    }
    ;
    if (this.#unit == null) {
      this.#unit = val.unit();
    }
    ;
    if (sys.ObjUtil.equals(this.#size, this.#array.size())) {
      let grow = util.FloatArray.makeF8(sys.Int.mult(this.#array.size(), 2));
      grow.copyFrom(this.#array);
      this.#array = grow;
    }
    ;
    this.#array.set(((this$) => { let $_u17 = this$.#size;this$.#size = sys.Int.increment(this$.#size); return $_u17; })(this), val.toFloat());
    return this;
  }

  mean() {
    if (this.isEmpty()) {
      throw sys.Err.make("NumberFold is empty");
    }
    ;
    let sum = sys.Float.make(0.0);
    for (let i = 0; sys.ObjUtil.compareLT(i, this.#size); i = sys.Int.increment(i)) {
      sum = sys.Float.plus(sum, this.#array.get(i));
    }
    ;
    return sys.Float.div(sum, sys.Num.toFloat(sys.ObjUtil.coerce(this.#size, sys.Num.type$)));
  }

  median() {
    if (this.isEmpty()) {
      throw sys.Err.make("NumberFold is empty");
    }
    ;
    this.#array.sort(sys.Range.make(0, this.#size, true));
    if (sys.Int.isOdd(this.#size)) {
      return this.#array.get(sys.Int.div(this.#size, 2));
    }
    ;
    let a = this.#array.get(sys.Int.minus(sys.Int.div(this.#size, 2), 1));
    let b = this.#array.get(sys.Int.div(this.#size, 2));
    return sys.Float.div(sys.Float.plus(a, b), sys.Float.make(2.0));
  }

  quantile(perc,method) {
    if (sys.ObjUtil.equals(this.#size, 1)) {
      return this.#array.get(0);
    }
    ;
    this.#array.sort(sys.Range.make(0, this.#size, true));
    let i = sys.Float.mult(perc, sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.minus(this.#size, 1), sys.Num.type$)));
    let k = sys.Num.toInt(sys.ObjUtil.coerce(i, sys.Num.type$));
    let d = sys.Float.minusInt(i, k);
    let $_u18 = method;
    if (sys.ObjUtil.equals($_u18, "lower")) {
      return sys.Num.toFloat(sys.ObjUtil.coerce(this.#array.get(k), sys.Num.type$));
    }
    else if (sys.ObjUtil.equals($_u18, "higher")) {
      return this.#array.get(sys.Int.plus(k, 1));
    }
    else if (sys.ObjUtil.equals($_u18, "nearest")) {
      return this.#array.get(sys.Num.toInt(sys.ObjUtil.coerce(sys.Float.round(i), sys.Num.type$)));
    }
    else if (sys.ObjUtil.equals($_u18, "midpoint")) {
      return sys.Num.toFloat(sys.ObjUtil.coerce(sys.Float.divInt(sys.Float.plus(this.#array.get(k), this.#array.get(sys.Int.min(sys.Int.plus(k, 1), sys.Int.minus(this.#size, 1)))), 2), sys.Num.type$));
    }
    else if (sys.ObjUtil.equals($_u18, "linear")) {
      return sys.Num.toFloat(sys.ObjUtil.coerce(sys.Float.plus(this.#array.get(k), sys.Float.mult(sys.Float.minus(this.#array.get(sys.Int.min(sys.Int.plus(k, 1), sys.Int.minus(this.#size, 1))), this.#array.get(k)), d)), sys.Num.type$));
    }
    else {
      throw sys.Err.make(sys.Str.plus("Unexpected method type: ", method));
    }
    ;
  }

  static make() {
    const $self = new NumberFold();
    NumberFold.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class MathLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MathLib.type$; }

  static make() {
    const $self = new MathLib();
    MathLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    return;
  }

}

class MathTest extends hx.HxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MathTest.type$; }

  test() {
    const this$ = this;
    this.rt().libs().add("math");
    this.verifyEq(this.eval("pi()"), haystack.Number.make(sys.Float.pi()));
    this.verifyEq(this.eval("23.remainder(5)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Num.type$.toNullable())));
    this.verifyEq(this.eval("23sec.remainder(5)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Num.type$.toNullable()), "sec"));
    this.verifyEq(sys.ObjUtil.trap(sys.ObjUtil.trap(this.eval("remainder(8.27, 2)"),"toFloat", sys.List.make(sys.Obj.type$.toNullable(), [])),"approx", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(sys.Float.make(0.27), sys.Obj.type$.toNullable())])), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(this.eval("floor(2.4)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Num.type$.toNullable())));
    this.verifyEq(this.eval("floor(2.4ft)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Num.type$.toNullable()), "ft"));
    this.verifyEq(this.eval("ceil(2.4)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Num.type$.toNullable())));
    this.verifyEq(this.eval("ceil(2.4in)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Num.type$.toNullable()), "in"));
    this.verifyEq(this.eval("round(2.4)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Num.type$.toNullable())));
    this.verifyEq(this.eval("round(2.4\$)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Num.type$.toNullable()), "\$"));
    this.verifyEq(this.eval("exp(2)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(7.38905609893065), sys.Num.type$.toNullable())));
    this.verifyEq(this.eval("exp(2).logE"), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Num.type$.toNullable())));
    this.verifyEq(this.eval("1000.log10"), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Num.type$.toNullable())));
    this.verifyEq(this.eval("2.pow(8)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(256.0), sys.Num.type$.toNullable())));
    this.verifyEq(this.eval("9.sqrt"), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Num.type$.toNullable())));
    let acc = sys.List.make(haystack.Number.type$);
    sys.Int.times(100, (it) => {
      acc.add(sys.ObjUtil.coerce(this$.eval("random()"), haystack.Number.type$));
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(acc.unique().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(100, sys.Obj.type$.toNullable()));
    acc.clear();
    sys.Int.times(100, (it) => {
      acc.add(sys.ObjUtil.coerce(this$.eval("random(0..100)"), haystack.Number.type$));
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(acc.all((it) => {
      return sys.Range.make(0, 100).contains(it.toInt());
    }), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(this.eval("0xabc07.bitNot"), haystack.HaystackTest.n(sys.ObjUtil.coerce(-703496, sys.Num.type$.toNullable())));
    this.verifyEq(this.eval("0x237cafe.bitAnd(0xaf0734)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(2556468, sys.Num.type$.toNullable())));
    this.verifyEq(this.eval("bitOr(0x237cafe, 0xaf0734)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(46125054, sys.Num.type$.toNullable())));
    this.verifyEq(this.eval("bitXor(0x237cafe, 0xaf0734)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(43568586, sys.Num.type$.toNullable())));
    this.verifyEq(this.eval("bitShiftr(0x237cafe, 4)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(2325679, sys.Num.type$.toNullable())));
    this.verifyEq(this.eval("bitShiftl(0x237cafe, 8)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(9525984768, sys.Num.type$.toNullable())));
    this.verifyEq(this.eval("acos(0.2)"), haystack.Number.make(sys.Float.make(1.369438406004566)));
    this.verifyEq(this.eval("asin(0.2)"), haystack.Number.make(sys.Float.make(0.2013579207903308)));
    this.verifyEq(this.eval("atan(0.2)"), haystack.Number.make(sys.Float.make(0.19739555984988078)));
    this.verifyEq(this.eval("atan(0.2)"), haystack.Number.make(sys.Float.make(0.19739555984988078)));
    this.verifyEq(this.eval("atan2(1, 2)"), haystack.Number.make(sys.Float.atan2(sys.Float.make(1.0), sys.Float.make(2.0))));
    this.verifyEq(this.eval("cos(2)"), haystack.Number.make(sys.Float.make(-0.4161468365471424)));
    this.verifyEq(this.eval("cosh(2)"), haystack.Number.make(sys.Float.make(3.7621956910836314)));
    this.verifyEq(this.eval("sin(2)"), haystack.Number.make(sys.Float.make(0.9092974268256817)));
    this.verifyEq(this.eval("sinh(2)"), haystack.Number.make(sys.Float.make(3.626860407847019)));
    this.verifyEq(this.eval("tan(2)"), haystack.Number.make(sys.Float.make(-2.185039863261519)));
    this.verifyEq(this.eval("tanh(2)"), haystack.Number.make(sys.Float.make(0.9640275800758169)));
    this.verifyEq(this.eval("toDegrees(pi())"), haystack.Number.make(sys.Float.make(180.0)));
    this.verifyEq(this.eval("toRadians(180)"), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.pi(), sys.Num.type$.toNullable())));
    this.verifyStandardDeviation();
    this.verifyFitLinearRegression();
    return;
  }

  testFolds() {
    this.rt().libs().add("math");
    this.verifyFolds("[]", null, null, null, null, null, null);
    this.verifyFolds("[na()]", haystack.NA.val(), haystack.NA.val(), haystack.NA.val(), haystack.NA.val(), haystack.NA.val(), haystack.NA.val());
    this.verifyFolds("[null]", null, null, null, null, null, null);
    this.verifyFolds("[2]", sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$.toNullable()), null, sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$.toNullable()), null);
    this.verifyFolds("[1, 4]", sys.ObjUtil.coerce(sys.Float.make(2.5), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.5), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(1.060660172), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.121320344), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$.toNullable()));
    this.verifyFolds("[4, 2, 7]", sys.ObjUtil.coerce(sys.Float.make(4.333333333), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(1.201850425), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(1.802775638), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.3333333333), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.5), sys.Obj.type$.toNullable()));
    this.verifyFolds("[4, na(), 7]", haystack.NA.val(), haystack.NA.val(), haystack.NA.val(), haystack.NA.val(), haystack.NA.val(), haystack.NA.val());
    this.verifyFolds("[-3, 4, 10, 11, 6, 4]", sys.ObjUtil.coerce(sys.Float.make(5.333333333), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(1.885618083), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.2627417), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.3333333333), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.4), sys.Obj.type$.toNullable()));
    this.verifyFolds("[-3, 4, 10, 2, 11, 6, 2]", sys.ObjUtil.coerce(sys.Float.make(4.57142857), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(1.726149425), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.013840996), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.571428571), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.666666667), sys.Obj.type$.toNullable()));
    return;
  }

  verifyFolds(list,mean,median,rmse0,rmse1,mbe0,mbe1) {
    this.verifyFoldEq(sys.Str.plus(sys.Str.plus("", list), ".fold(mean)"), mean);
    this.verifyFoldEq(sys.Str.plus(sys.Str.plus("", list), ".fold(median)"), median);
    this.verifyFoldEq(sys.Str.plus(sys.Str.plus("", list), ".fold(rootMeanSquareErr)"), rmse0);
    this.verifyFoldEq(sys.Str.plus(sys.Str.plus("", list), ".fold(rootMeanSquareErr(_, _, 1))"), rmse1);
    this.verifyFoldEq(sys.Str.plus(sys.Str.plus("", list), ".fold(meanBiasErr)"), mbe0);
    this.verifyFoldEq(sys.Str.plus(sys.Str.plus("", list), ".fold(meanBiasErr(_,_,1))"), mbe1);
    return;
  }

  testQuantileFolds() {
    this.rt().libs().add("math");
    this.verifyQuantileFolds("[]", null, null, null, null, null, null);
    this.verifyQuantileFolds("[na()]", haystack.NA.val(), haystack.NA.val(), haystack.NA.val(), haystack.NA.val(), haystack.NA.val(), haystack.NA.val());
    this.verifyQuantileFolds("[null]", null, null, null, null, null, null);
    this.verifyQuantileFolds("[1, 4]", sys.ObjUtil.coerce(sys.Float.make(1.03), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.099999), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.5), sys.Obj.type$.toNullable()));
    this.verifyQuantileFolds("[2]", sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()));
    this.verifyQuantileFolds("[4, 2, 7]", sys.ObjUtil.coerce(sys.Float.make(2.04), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.2), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(7.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.5), sys.Obj.type$.toNullable()));
    this.verifyQuantileFolds("[4, na(), 7]", haystack.NA.val(), haystack.NA.val(), haystack.NA.val(), haystack.NA.val(), haystack.NA.val(), haystack.NA.val());
    this.verifyQuantileFolds("[-3, 4, 10, 11, 6, 4]", sys.ObjUtil.coerce(sys.Float.make(-2.65), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(8.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(8.0), sys.Obj.type$.toNullable()));
    this.verifyQuantileFolds("[-3, 4, 10, 2, 11, 6, 2]", sys.ObjUtil.coerce(sys.Float.make(-2.7), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.8), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(8.0), sys.Obj.type$.toNullable()));
    this.verifyQuantileFolds("[10,10,10,25,100]", sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(22.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(25.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(25.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(17.5), sys.Obj.type$.toNullable()));
    return;
  }

  verifyQuantileFolds(list,quantile1_linear,quantile70_linear,quantile70_nearest,quantile70_lower,quantile70_higher,quantile70_midpoint) {
    const this$ = this;
    this.verifyFoldEq(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", list), ".fold(quantile("), haystack.Number.make(sys.Float.make(0.01))), ") )"), quantile1_linear);
    this.verifyFoldEq(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", list), ".fold(quantile("), haystack.Number.make(sys.Float.make(0.7))), ", \"linear\") )"), quantile70_linear);
    this.verifyFoldEq(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", list), ".fold(quantile("), haystack.Number.make(sys.Float.make(0.7))), ", \"lower\") )"), quantile70_lower);
    this.verifyFoldEq(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", list), ".fold(quantile("), haystack.Number.make(sys.Float.make(0.7))), ", \"higher\") )"), quantile70_higher);
    this.verifyFoldEq(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", list), ".fold(quantile("), haystack.Number.make(sys.Float.make(0.7))), ", \"midpoint\") )"), quantile70_midpoint);
    this.verifyFoldEq(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", list), ".fold(quantile("), haystack.Number.make(sys.Float.make(0.7))), ", \"nearest\") )"), quantile70_nearest);
    this.verifyErr(axon.EvalErr.type$, (it) => {
      let x = this$.eval("[10,10,10,25,100].fold(quantile(0.7, \"notafunc\"))");
      return;
    });
    this.verifyErr(axon.EvalErr.type$, (it) => {
      let x = this$.eval("[10,10,10,25,100].fold(quantile)");
      return;
    });
    return;
  }

  verifyFoldEq($axon,expected) {
    let actual = this.eval($axon);
    if (expected == null) {
      this.verifyNull(actual);
    }
    else {
      if (expected === haystack.NA.val()) {
        this.verifyEq(actual, expected);
      }
      else {
        if (!sys.Float.approx(sys.ObjUtil.coerce(actual, haystack.Number.type$).toFloat(), sys.ObjUtil.coerce(expected, sys.Float.type$))) {
          this.fail(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", $axon), "  "), expected), " != "), actual));
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  verifyStandardDeviation() {
    this.verifyFoldEq("[1.21, 3.4, 2, 4.66, 1.5, 5.61, 7.22].fold(standardDeviation)", sys.ObjUtil.coerce(sys.Float.make(2.2718326984), sys.Obj.type$.toNullable()));
    this.verifyFoldEq("[4, 2, 5, 8, 6].fold(standardDeviation)", sys.ObjUtil.coerce(sys.Float.make(2.23606798), sys.Obj.type$.toNullable()));
    this.verifyFoldEq("[4, na(), 5, 8, 6].fold(standardDeviation)", haystack.NA.val());
    return;
  }

  verifyFitLinearRegression() {
    let r = sys.ObjUtil.coerce(this.eval("[{x:0,y:1}, {x:1, y:0}, {x:3,y:2}, {x:5,y:4}, {x:nan(), y:33}].toGrid.fitLinearRegression"), haystack.Dict.type$);
    this.verifyNumApprox(sys.ObjUtil.coerce(r.trap("m", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.694915254), sys.Obj.type$.toNullable()));
    this.verifyNumApprox(sys.ObjUtil.coerce(r.trap("b", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.186440678), sys.Obj.type$.toNullable()));
    this.verifyEq(r.trap("xmin", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())));
    this.verifyEq(r.trap("xmax", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(5, sys.Num.type$.toNullable())));
    this.verifyEq(r.trap("ymin", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())));
    this.verifyEq(r.trap("ymax", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())));
    (r = sys.ObjUtil.coerce(this.eval("[{x:-2,y:-3}, {x:-1,y:-1}, {x:1,y:2}, {x:4,y:3}].toGrid.fitLinearRegression"), haystack.Dict.type$));
    this.verifyNumApprox(sys.ObjUtil.coerce(r.trap("m", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.9761904761904762), sys.Obj.type$.toNullable()));
    this.verifyNumApprox(sys.ObjUtil.coerce(r.trap("b", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-0.23809523809523808), sys.Obj.type$.toNullable()));
    this.verifyNumApprox(sys.ObjUtil.coerce(r.trap("r2", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.879644165), sys.Obj.type$.toNullable()));
    this.verifyEq(r.trap("xmin", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(-2, sys.Num.type$.toNullable())));
    this.verifyEq(r.trap("xmax", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())));
    this.verifyEq(r.trap("ymin", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(-3, sys.Num.type$.toNullable())));
    this.verifyEq(r.trap("ymax", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())));
    return;
  }

  static make() {
    const $self = new MathTest();
    MathTest.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxTest.make$($self);
    return;
  }

}

class MatrixTest extends haystack.HaystackTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MatrixTest.type$; }

  testToMatrix() {
    this.verifyToMatrix("ver:\"2.0\"\nv0,v1,v2\n1,2,3\n4,5,6", sys.List.make(sys.Type.find("sys::Float[]"), [sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable())]), sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable())])]), false);
    this.verifyToMatrix("ver:\"2.0\"\nv0,v1,v2\n1kW,2,3ft\n4kW,5,6ft", sys.List.make(sys.Type.find("sys::Float[]"), [sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable())]), sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable())])]), true);
    return;
  }

  verifyToMatrix(zinc,floats,hasUnits) {
    const this$ = this;
    let grid = haystack.ZincReader.make(sys.Str.in(zinc)).readGrid();
    let m = MatrixGrid.makeGrid(grid);
    this.verifyEq(sys.ObjUtil.coerce(m.numRows(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(floats.size(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(m.numCols(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(floats.get(0).size(), sys.Obj.type$.toNullable()));
    floats.each((floatRow,rowi) => {
      let mRow = m.get(rowi);
      floatRow.each((float,coli) => {
        this$.verifyEq(sys.ObjUtil.coerce(float, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(m.float(rowi, coli), sys.Obj.type$.toNullable()));
        this$.verifyEq(sys.ObjUtil.trap(mRow.get(sys.Str.plus("v", sys.ObjUtil.coerce(coli, sys.Obj.type$.toNullable()))),"toFloat", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(float, sys.Obj.type$.toNullable()));
        return;
      });
      return;
    });
    if (!hasUnits) {
      this.verifyGridEq(grid, m);
    }
    ;
    return;
  }

  testMath() {
    let a = this.toMatrix("ver:\"2.0\"\nv0,v1,v2\n1,2,3\n4,5,6");
    let b = this.toMatrix("ver:\"2.0\"\nv0,v1,v2\n10,20,30\n40,50,60");
    let c = this.toMatrix("ver:\"2.0\"\nv0,v1\n7,8\n9,10\n11,12");
    let cu = this.toMatrix("ver:\"2.0\" c\nv0,v1\n7m,8m\n9m,10m\n11m,12m");
    let d = this.toMatrix("ver:\"2.0\"\nv0,v1\n1,2\n3,4\nN,NA", haystack.Etc.makeDict(sys.Map.__fromLiteral(["nullVal","naVal"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?"))));
    this.verifyEq(haystack.HaystackTest.n(sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())), d.get(2).get("v0"));
    this.verifyEq(haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable())), d.get(2).get("v1"));
    this.verifyMatrixEq(a.transpose(), "ver:\"2.0\"\nv0,v1\n1,4\n2,5\n3,6");
    this.verifyMatrixEq(a.plus(b), "ver:\"2.0\"\nv0,v1,v2\n11,22,33\n44,55,66");
    this.verifyMatrixEq(b.minus(a), "ver:\"2.0\"\nv0,v1,v2\n9,18,27\n36,45,54");
    this.verifyMatrixEq(a.mult(c), "ver:\"2.0\"\nv0,v1\n58,64\n139,154");
    this.verifyMatrixEq(a.multByConst(sys.Float.make(3.0)), "ver:\"2.0\"\nv0,v1,v2\n3,6,9\n12,15,18");
    this.verifyMatrixEq(a.insertCol(sys.Float.make(99.0)), "ver:\"2.0\"\nv0,v1,v2,v3\n99,1,2,3\n99,4,5,6");
    this.verifyMatrixEq(this.toMatrix("ver:\"2.0\"\nv0,v1,v2\n1,2,3\n0,4,5\n1,0,6").cofactor(), "ver:\"2.0\"\nv0,v1,v2\n24,5,-4\n-12,3,2\n-2,-5,4");
    return;
  }

  testDeterminant() {
    let tol = sys.Float.make(0.001);
    this.verifyEq(sys.ObjUtil.coerce(this.toMatrix("ver:\"2.0\"\nv0\n5").determinant(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.toMatrix("ver:\"2.0\"\nv0,v1\n4,6\n3,8").determinant(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(14.0), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.toMatrix("ver:\"2.0\"\nv0,v1,v2\n6,1,1\n4,-2,5\n2,8,7").determinant(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-306.0), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.toMatrix("ver:\"2.0\"\nv0,v1,v2,v3\n-1,2,3,4\n5,-6,7,8\n9,10,-11,12\n13,14,15,-16").determinant(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-36416.0), sys.Obj.type$.toNullable()));
    return;
  }

  testInverse() {
    this.verifyMatrixEq(this.toMatrix("ver:\"2.0\"\nv0,v1\n4,7\n2,6").inverse(), "ver:\"2.0\"\nv0,v1\n0.6,-0.7\n-0.2,0.4");
    this.verifyMatrixEq(this.toMatrix("ver:\"2.0\"\nv0,v1,v2,v3\n-1,2,3,4\n5,-6,7,8\n9,10,-11,12\n13,14,15,-16").inverse(), "ver:\"2.0\"\nv0,v1,v2,v3\n-0.130492091388, 0.0601933216169, 0.0320738137083, 0.0215289982425\n0.118189806678, -0.0553602811951, 0.0197715289982, 0.0166959578207\n0.0953427065026, 0.0250439367311, -0.0268014059754, 0.0162565905097\n0.0867750439367, 0.0239455184534, 0.0182337434095, -0.0151581722320");
    return;
  }

  testLinearRegression() {
    let y = this.toMatrix("ver:\"2.0\"\nv0\n27\n29\n23\n20\n21");
    let x = this.toMatrix("ver:\"2.0\"\nv0,v1,v2\n4,0,1\n7,1,1\n6,1,0\n2,0,0\n3,0,1");
    let r = MatrixGrid.fitLinearRegression(y, x);
    let tol = sys.Float.make(0.001);
    this.verifyNumApprox(sys.ObjUtil.coerce(r.meta().trap("bias", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(9.25), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(tol, sys.Float.type$.toNullable()));
    this.verifyEq(r.meta().trap("ymean", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(24, sys.Num.type$.toNullable())));
    this.verifyNumApprox(sys.ObjUtil.coerce(r.meta().trap("r", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.9464847243000456), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(tol, sys.Float.type$.toNullable()));
    this.verifyNumApprox(sys.ObjUtil.coerce(r.meta().trap("r2", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.8958333333333334), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(tol, sys.Float.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyNumApprox(sys.ObjUtil.coerce(r.get(0).trap("b", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.75), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(tol, sys.Float.type$.toNullable()));
    this.verifyNumApprox(sys.ObjUtil.coerce(r.get(1).trap("b", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-13.5), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(tol, sys.Float.type$.toNullable()));
    this.verifyNumApprox(sys.ObjUtil.coerce(r.get(2).trap("b", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-1.25), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(tol, sys.Float.type$.toNullable()));
    return;
  }

  toMatrix(zinc,opts) {
    if (opts === undefined) opts = haystack.Etc.emptyDict();
    let grid = haystack.ZincReader.make(sys.Str.in(zinc)).readGrid();
    return MatrixGrid.makeGrid(grid, opts);
  }

  verifyMatrixEq(a,b) {
    const this$ = this;
    if (sys.ObjUtil.is(b, sys.Str.type$)) {
      (b = this.toMatrix(sys.ObjUtil.coerce(b, sys.Str.type$)));
    }
    ;
    this.verifyEq(sys.ObjUtil.coerce(a.numRows(), sys.Obj.type$.toNullable()), sys.ObjUtil.trap(b,"numRows", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(sys.ObjUtil.coerce(a.numCols(), sys.Obj.type$.toNullable()), sys.ObjUtil.trap(b,"numCols", sys.List.make(sys.Obj.type$.toNullable(), [])));
    sys.Int.times(a.numRows(), (i) => {
      sys.Int.times(a.numCols(), (j) => {
        let aIJ = a.float(i, j);
        let bIJ = sys.ObjUtil.trap(b,"float", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(j, sys.Obj.type$.toNullable())]));
        if (!sys.Float.approx(aIJ, sys.ObjUtil.coerce(bIJ, sys.Float.type$))) {
          this$.fail(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("cell (", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), ", "), sys.ObjUtil.coerce(j, sys.Obj.type$.toNullable())), ") not approx. equal: "), sys.ObjUtil.coerce(aIJ, sys.Obj.type$.toNullable())), " ~= "), bIJ));
        }
        ;
        return;
      });
      return;
    });
    this.verify(true);
    return;
  }

  static make() {
    const $self = new MatrixTest();
    MatrixTest.make$($self);
    return $self;
  }

  static make$($self) {
    haystack.HaystackTest.make$($self);
    return;
  }

}

const p = sys.Pod.add$('hxMath');
const xp = sys.Param.noParams$();
let m;
MathFuncs.type$ = p.at$('MathFuncs','sys::Obj',[],{},8194,MathFuncs);
MatrixGrid.type$ = p.at$('MatrixGrid','sys::Obj',['haystack::Grid'],{},8194,MatrixGrid);
MatrixCol.type$ = p.at$('MatrixCol','haystack::Col',[],{},130,MatrixCol);
MatrixRow.type$ = p.at$('MatrixRow','haystack::Row',[],{},130,MatrixRow);
MathPointList.type$ = p.at$('MathPointList','sys::Obj',[],{},128,MathPointList);
MathPoint.type$ = p.at$('MathPoint','sys::Obj',[],{},130,MathPoint);
NumberFold.type$ = p.at$('NumberFold','sys::Obj',[],{},128,NumberFold);
MathLib.type$ = p.at$('MathLib','hx::HxLib',[],{},8194,MathLib);
MathTest.type$ = p.at$('MathTest','hx::HxTest',[],{},8192,MathTest);
MatrixTest.type$ = p.at$('MatrixTest','haystack::HaystackTest',[],{},8192,MatrixTest);
MathFuncs.type$.af$('piVal',100354,'haystack::Number',{}).am$('pi',40962,'haystack::Number',xp,{'axon::Axon':""}).am$('remainder',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Number',false),new sys.Param('b','haystack::Number',false)]),{'axon::Axon':""}).am$('ceil',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('floor',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('round',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('exp',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('logE',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('log10',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('pow',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false),new sys.Param('exp','haystack::Number',false)]),{'axon::Axon':""}).am$('sqrt',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('random',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('range','sys::Obj?',true)]),{'axon::Axon':""}).am$('bitNot',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Number',false)]),{'axon::Axon':""}).am$('bitAnd',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Number',false),new sys.Param('b','haystack::Number',false)]),{'axon::Axon':""}).am$('bitOr',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Number',false),new sys.Param('b','haystack::Number',false)]),{'axon::Axon':""}).am$('bitXor',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Number',false),new sys.Param('b','haystack::Number',false)]),{'axon::Axon':""}).am$('bitShiftr',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Number',false),new sys.Param('b','haystack::Number',false)]),{'axon::Axon':""}).am$('bitShiftl',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Number',false),new sys.Param('b','haystack::Number',false)]),{'axon::Axon':""}).am$('acos',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('asin',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('atan',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('atan2',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('y','haystack::Number',false),new sys.Param('x','haystack::Number',false)]),{'axon::Axon':""}).am$('cos',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('cosh',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('sin',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('sinh',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('tan',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('tanh',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('toDegrees',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('toRadians',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('mean',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('acc','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{meta=[\"foldOn\":\"Number\",\"disKey\":\"ui::mean\"];}"}).am$('median',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('acc','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{meta=[\"foldOn\":\"Number\",\"disKey\":\"ui::median\"];}"}).am$('rootMeanSquareErr',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('acc','sys::Obj?',false),new sys.Param('nDegrees','haystack::Number',true)]),{'axon::Axon':"axon::Axon{meta=[\"foldOn\":\"Number\",\"disKey\":\"ui::rootMeanSquareErr\"];}"}).am$('meanBiasErr',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('acc','sys::Obj?',false),new sys.Param('nDegrees','haystack::Number',true)]),{'axon::Axon':"axon::Axon{meta=[\"foldOn\":\"Number\",\"disKey\":\"ui::meanBiasErr\"];}"}).am$('standardDeviation',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('acc','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{meta=[\"foldOn\":\"Number\",\"disKey\":\"ui::standardDeviation\"];}"}).am$('quantile',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('percent','haystack::Number',false),new sys.Param('method','sys::Str',true)]),{'axon::Axon':""}).am$('quantileFold',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('acc','sys::Obj?',false),new sys.Param('perc','haystack::Number',false),new sys.Param('method','sys::Str',false)]),{'sys::NoDoc':"",'axon::Axon':""}).am$('toMatrix',40962,'hxMath::MatrixGrid',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false),new sys.Param('opts','haystack::Dict',true)]),{'axon::Axon':""}).am$('matrixTranspose',40962,'hxMath::MatrixGrid',sys.List.make(sys.Param.type$,[new sys.Param('m','sys::Obj',false)]),{'axon::Axon':""}).am$('matrixDeterminant',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('m','sys::Obj',false)]),{'axon::Axon':""}).am$('matrixInverse',40962,'hxMath::MatrixGrid',sys.List.make(sys.Param.type$,[new sys.Param('m','sys::Obj',false)]),{'axon::Axon':""}).am$('matrixAdd',40962,'hxMath::MatrixGrid',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj',false),new sys.Param('b','sys::Obj',false)]),{'axon::Axon':""}).am$('matrixSub',40962,'hxMath::MatrixGrid',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj',false),new sys.Param('b','sys::Obj',false)]),{'axon::Axon':""}).am$('matrixMult',40962,'hxMath::MatrixGrid',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj',false),new sys.Param('b','sys::Obj',false)]),{'axon::Axon':""}).am$('matrixFitLinearRegression',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('y','sys::Obj',false),new sys.Param('x','sys::Obj',false)]),{'axon::Axon':""}).am$('fitLinearRegression',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('opts','haystack::Dict?',true)]),{'axon::Axon':""}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
MatrixGrid.type$.af$('matrixRef',67586,'sys::Unsafe',{}).af$('meta',336898,'haystack::Dict',{}).af$('cols',336898,'haystack::Col[]',{}).af$('rows',67586,'hxMath::MatrixRow[]',{}).am$('makeGrid',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('opts','haystack::Dict',true)]),{}).am$('makeMatrix',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('meta','haystack::Dict',false),new sys.Param('matrix','math::Matrix',false)]),{}).am$('toCols',34818,'haystack::Col[]',sys.List.make(sys.Param.type$,[new sys.Param('numCols','sys::Int',false)]),{}).am$('matrix',2048,'math::Matrix',xp,{}).am$('numRows',8192,'sys::Int',xp,{}).am$('numCols',8192,'sys::Int',xp,{}).am$('isSquare',8192,'sys::Bool',xp,{}).am$('float',8192,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('row','sys::Int',false),new sys.Param('col','sys::Int',false)]),{}).am$('number',8192,'haystack::Number?',sys.List.make(sys.Param.type$,[new sys.Param('row','sys::Int',false),new sys.Param('col','sys::Int',false)]),{}).am$('col',271360,'haystack::Col?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Row,sys::Int->sys::Void|',false)]),{}).am$('eachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Row,sys::Int->sys::Obj?|',false)]),{}).am$('size',271360,'sys::Int',xp,{}).am$('get',271360,'haystack::Row',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('getSafe',271360,'haystack::Row?',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('first',271360,'haystack::Row?',xp,{}).am$('toRows',271360,'haystack::Row[]',xp,{}).am$('transpose',271360,'hxMath::MatrixGrid',xp,{}).am$('multByConst',8192,'hxMath::MatrixGrid',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false)]),{}).am$('insertCol',8192,'hxMath::MatrixGrid',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Float',false)]),{}).am$('plus',8192,'hxMath::MatrixGrid',sys.List.make(sys.Param.type$,[new sys.Param('b','hxMath::MatrixGrid',false)]),{'sys::Operator':""}).am$('minus',8192,'hxMath::MatrixGrid',sys.List.make(sys.Param.type$,[new sys.Param('b','hxMath::MatrixGrid',false)]),{'sys::Operator':""}).am$('mult',8192,'hxMath::MatrixGrid',sys.List.make(sys.Param.type$,[new sys.Param('b','hxMath::MatrixGrid',false)]),{'sys::Operator':""}).am$('determinant',8192,'sys::Float',xp,{}).am$('cofactor',8192,'hxMath::MatrixGrid',xp,{}).am$('inverse',8192,'hxMath::MatrixGrid',xp,{}).am$('fitLinearRegression',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('Y','hxMath::MatrixGrid',false),new sys.Param('X','hxMath::MatrixGrid',false)]),{}).am$('arrayMake',40962,'util::FloatArray',sys.List.make(sys.Param.type$,[new sys.Param('numRows','sys::Int',false),new sys.Param('numCols','sys::Int',false)]),{}).am$('index',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('numCols','sys::Int',false),new sys.Param('row','sys::Int',false),new sys.Param('col','sys::Int',false)]),{});
MatrixCol.type$.af$('list',106498,'hxMath::MatrixCol[]',{}).af$('name',336898,'sys::Str',{}).af$('index',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('meta',271360,'haystack::Dict',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
MatrixRow.type$.af$('grid',336898,'hxMath::MatrixGrid',{}).af$('index',73730,'sys::Int',{}).am$('makeList',40962,'hxMath::MatrixRow[]',sys.List.make(sys.Param.type$,[new sys.Param('m','hxMath::MatrixGrid',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','hxMath::MatrixGrid',false),new sys.Param('index','sys::Int',false)]),{}).am$('val',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('col','haystack::Col',false)]),{});
MathPointList.type$.af$('xmean',73730,'sys::Float',{}).af$('ymean',73730,'sys::Float',{}).af$('n',73730,'sys::Float',{}).af$('points',67584,'hxMath::MathPoint[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('opts','haystack::Dict?',false)]),{}).am$('x',8192,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('y',8192,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('get',8192,'hxMath::MathPoint',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{'sys::Operator':""}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|hxMath::MathPoint->sys::Void|',false)]),{});
MathPoint.type$.af$('x',73730,'sys::Float',{}).af$('y',73730,'sys::Float',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
NumberFold.type$.af$('size',73728,'sys::Int',{}).af$('array',73728,'util::FloatArray',{}).af$('unit',73728,'sys::Unit?',{}).am$('get',8192,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{'sys::Operator':""}).am$('isEmpty',8192,'sys::Bool',xp,{}).am$('add',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number?',false)]),{}).am$('mean',8192,'sys::Float',xp,{}).am$('median',8192,'sys::Float',xp,{}).am$('quantile',8192,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('perc','sys::Float',false),new sys.Param('method','sys::Str?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
MathLib.type$.am$('make',139268,'sys::Void',xp,{});
MathTest.type$.am$('test',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('testFolds',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('verifyFolds',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Str',false),new sys.Param('mean','sys::Obj?',false),new sys.Param('median','sys::Obj?',false),new sys.Param('rmse0','sys::Obj?',false),new sys.Param('rmse1','sys::Obj?',false),new sys.Param('mbe0','sys::Obj?',false),new sys.Param('mbe1','sys::Obj?',false)]),{}).am$('testQuantileFolds',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('verifyQuantileFolds',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Str',false),new sys.Param('quantile1_linear','sys::Obj?',false),new sys.Param('quantile70_linear','sys::Obj?',false),new sys.Param('quantile70_nearest','sys::Obj?',false),new sys.Param('quantile70_lower','sys::Obj?',false),new sys.Param('quantile70_higher','sys::Obj?',false),new sys.Param('quantile70_midpoint','sys::Obj?',false)]),{}).am$('verifyFoldEq',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('axon','sys::Str',false),new sys.Param('expected','sys::Obj?',false)]),{}).am$('verifyStandardDeviation',8192,'sys::Void',xp,{}).am$('verifyFitLinearRegression',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
MatrixTest.type$.am$('testToMatrix',8192,'sys::Void',xp,{}).am$('verifyToMatrix',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('zinc','sys::Str',false),new sys.Param('floats','sys::Float[][]',false),new sys.Param('hasUnits','sys::Bool',false)]),{}).am$('testMath',8192,'sys::Void',xp,{}).am$('testDeterminant',8192,'sys::Void',xp,{}).am$('testInverse',8192,'sys::Void',xp,{}).am$('testLinearRegression',8192,'sys::Void',xp,{}).am$('toMatrix',8192,'hxMath::MatrixGrid',sys.List.make(sys.Param.type$,[new sys.Param('zinc','sys::Str',false),new sys.Param('opts','haystack::Dict',true)]),{}).am$('verifyMatrixEq',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','hxMath::MatrixGrid',false),new sys.Param('b','sys::Obj',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxMath");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;math 1.0;util 1.0;haystack 3.1.11;axon 3.1.11;hx 3.1.11");
m.set("pod.summary", "Math function libary");
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
  MathFuncs,
  MatrixGrid,
  MathLib,
  MathTest,
  MatrixTest,
};
