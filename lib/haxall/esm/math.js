// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class Math extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Math.type$; }

  static matrix(numRows,numCols) {
    return MMatrix.make(numRows, numCols);
  }

  static make() {
    const $self = new Math();
    Math.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}


class Matrix {
  constructor() {
    const this$ = this;
  }

  typeof() { return Matrix.type$; }

}


class MMatrixTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MMatrixTest.type$; }

  testGetSet() {
    let m = Math.matrix(2, 2);
    m.set(0, 0, sys.Float.make(1.0));
    this.verify(sys.Float.approx(m.get(0, 0), sys.Float.make(1.0)));
    m.set(1, 1, sys.Float.make(4.0));
    this.verify(sys.Float.approx(m.get(1, 1), sys.Float.make(4.0)));
    return;
  }

  testFill() {
    this.verifyMatrixEq(Math.matrix(2, 2).fill(sys.Float.make(5.0)), this.matrix(2, 2, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable())])));
    return;
  }

  testIsSquare() {
    this.verify(Math.matrix(1, 1).isSquare());
    this.verify(Math.matrix(10, 10).isSquare());
    this.verifyFalse(Math.matrix(1, 2).isSquare());
    return;
  }

  testTranspose() {
    let a = this.matrix(2, 3, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable())]));
    let at = this.matrix(3, 2, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable())]));
    this.verifyMatrixEq(a.transpose(), at);
    this.verifyMatrixEq(a.transpose().transpose(), a);
    return;
  }

  testMultScalar() {
    let a = this.matrix(2, 3, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable())]));
    let b = this.matrix(2, 3, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(8.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(12.0), sys.Obj.type$.toNullable())]));
    this.verifyMatrixEq(a.multScalar(sys.Float.make(2.0)), b);
    return;
  }

  testPlus() {
    let a = this.matrix(2, 3, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable())]));
    let b = this.matrix(2, 3, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(8.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(12.0), sys.Obj.type$.toNullable())]));
    let c = this.matrix(2, 3, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(9.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(12.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(15.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(18.0), sys.Obj.type$.toNullable())]));
    this.verifyMatrixEq(a.plus(b), c);
    return;
  }

  testMinus() {
    let a = this.matrix(2, 3, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable())]));
    let b = this.matrix(2, 3, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(8.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(12.0), sys.Obj.type$.toNullable())]));
    let c = this.matrix(2, 3, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(-1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-3.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-6.0), sys.Obj.type$.toNullable())]));
    this.verifyMatrixEq(a.minus(b), c);
    return;
  }

  testMult() {
    let a = this.matrix(2, 3, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable())]));
    let b = this.matrix(3, 2, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(7.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(8.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(9.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(11.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(12.0), sys.Obj.type$.toNullable())]));
    let c = this.matrix(2, 2, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(58.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(64.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(139.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(154.0), sys.Obj.type$.toNullable())]));
    this.verifyMatrixEq(a.mult(b), c);
    return;
  }

  testDeterminant() {
    let a = this.matrix(1, 1, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable())]));
    this.verifyEq(sys.ObjUtil.coerce(a.determinant(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()));
    (a = this.matrix(2, 2, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(8.0), sys.Obj.type$.toNullable())])));
    this.verifyEq(sys.ObjUtil.coerce(a.determinant(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(14.0), sys.Obj.type$.toNullable()));
    (a = this.matrix(3, 3, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(8.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(7.0), sys.Obj.type$.toNullable())])));
    this.verifyEq(sys.ObjUtil.coerce(a.determinant(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-306.0), sys.Obj.type$.toNullable()));
    (a = this.matrix(4, 4, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(-1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-6.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(7.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(8.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(9.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-11.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(12.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(13.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(14.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(15.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-16.0), sys.Obj.type$.toNullable())])));
    this.verifyEq(sys.ObjUtil.coerce(a.determinant(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-36416.0), sys.Obj.type$.toNullable()));
    return;
  }

  testCofactor() {
    let a = this.matrix(3, 3, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable())]));
    let cf = this.matrix(3, 3, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(24.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-12.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable())]));
    this.verifyMatrixEq(a.cofactor(), cf);
    return;
  }

  testInverse() {
    let a = this.matrix(2, 2, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(7.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable())]));
    let i = this.matrix(2, 2, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(0.6), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-0.7), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-0.2), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.4), sys.Obj.type$.toNullable())]));
    this.verifyMatrixEq(a.inverse(), i);
    (a = this.matrix(4, 4, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(-1.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-6.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(7.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(8.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(9.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-11.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(12.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(13.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(14.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(15.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-16.0), sys.Obj.type$.toNullable())])));
    (i = this.matrix(4, 4, sys.List.make(sys.Float.type$, [sys.ObjUtil.coerce(sys.Float.make(-0.130492091388), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0601933216169), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0320738137083), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0215289982425), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.118189806678), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-0.0553602811951), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0197715289982), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0166959578207), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0953427065026), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0250439367311), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-0.0268014059754), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0162565905097), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0867750439367), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0239455184534), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0182337434095), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(-0.015158172232), sys.Obj.type$.toNullable())])));
    this.verifyMatrixEq(a.inverse(), i);
    return;
  }

  matrix(numRows,numCols,arr) {
    let m = Math.matrix(numRows, numCols);
    for (let i = 0; sys.ObjUtil.compareLT(i, numRows); i = sys.Int.increment(i)) {
      for (let j = 0; sys.ObjUtil.compareLT(j, numCols); j = sys.Int.increment(j)) {
        m.set(i, j, arr.get(sys.Int.plus(sys.Int.mult(i, numCols), j)));
      }
      ;
    }
    ;
    return m;
  }

  verifyMatrixEq(a,b,eps) {
    if (eps === undefined) eps = sys.Float.make(1.0E-6);
    this.verifyEq(sys.ObjUtil.coerce(a.numRows(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.numRows(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.numCols(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.numCols(), sys.Obj.type$.toNullable()));
    for (let i = 0; sys.ObjUtil.compareLT(i, a.numRows()); i = sys.Int.increment(i)) {
      for (let j = 0; sys.ObjUtil.compareLT(j, a.numCols()); j = sys.Int.increment(j)) {
        this.verify(sys.Float.approx(a.get(i, j), b.get(i, j), sys.ObjUtil.coerce(eps, sys.Float.type$.toNullable())));
      }
      ;
    }
    ;
    return;
  }

  static make() {
    const $self = new MMatrixTest();
    MMatrixTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

const p = sys.Pod.add$('math');
const xp = sys.Param.noParams$();
let m;
Math.type$ = p.at$('Math','sys::Obj',[],{},8224,Math);
BigInt.type$ = p.at$('BigInt','sys::Obj',[],{},8706,BigInt);
Matrix.type$ = p.am$('Matrix','sys::Obj',[],{},8449,Matrix);
MMatrix.type$ = p.at$('MMatrix','sys::Obj',['math::Matrix'],{'sys::NoDoc':""},8736,MMatrix);
MMatrixTest.type$ = p.at$('MMatrixTest','sys::Test',[],{},8192,MMatrixTest);
Math.type$.am$('matrix',40962,'math::Matrix',sys.List.make(sys.Param.type$,[new sys.Param('numRows','sys::Int',false),new sys.Param('numCols','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{});
BigInt.type$.af$('defVal',106498,'math::BigInt',{}).af$('zero',106498,'math::BigInt',{}).af$('one',106498,'math::BigInt',{}).am$('fromStr',40966,'math::BigInt?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('radix','sys::Int',true),new sys.Param('checked','sys::Bool',true)]),{}).am$('makeInt',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Int',false)]),{}).am$('makeBuf',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('bytes','sys::Buf',false)]),{}).am$('privateMake',2052,'sys::Void',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('compare',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('negate',8192,'math::BigInt',xp,{'sys::Operator':""}).am$('increment',8192,'math::BigInt',xp,{'sys::Operator':""}).am$('decrement',8192,'math::BigInt',xp,{'sys::Operator':""}).am$('mult',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','math::BigInt',false)]),{'sys::Operator':""}).am$('multInt',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{'sys::Operator':""}).am$('div',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','math::BigInt',false)]),{'sys::Operator':""}).am$('divInt',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{'sys::Operator':""}).am$('mod',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','math::BigInt',false)]),{'sys::Operator':""}).am$('modInt',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{'sys::Operator':""}).am$('plus',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','math::BigInt',false)]),{'sys::Operator':""}).am$('plusInt',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{'sys::Operator':""}).am$('minus',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','math::BigInt',false)]),{'sys::Operator':""}).am$('minusInt',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{'sys::Operator':""}).am$('setBit',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{}).am$('clearBit',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{}).am$('flipBit',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{}).am$('testBit',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{}).am$('bitLen',8192,'sys::Int',xp,{}).am$('not',8192,'math::BigInt',xp,{}).am$('and',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Obj',false)]),{}).am$('or',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Obj',false)]),{}).am$('xor',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Obj',false)]),{}).am$('shiftl',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{}).am$('shiftr',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{}).am$('signum',8192,'sys::Int',xp,{}).am$('abs',8192,'math::BigInt',xp,{}).am$('min',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('that','math::BigInt',false)]),{}).am$('max',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('that','math::BigInt',false)]),{}).am$('pow',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('pow','sys::Int',false)]),{}).am$('toInt',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('toFloat',8192,'sys::Float',xp,{}).am$('toDecimal',8192,'sys::Decimal',xp,{}).am$('toBuf',8192,'sys::Buf',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('toRadix',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('radix','sys::Int',false),new sys.Param('width','sys::Int?',true)]),{});
Matrix.type$.am$('numRows',270337,'sys::Int',xp,{}).am$('numCols',270337,'sys::Int',xp,{}).am$('isSquare',270337,'sys::Bool',xp,{}).am$('get',270337,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false),new sys.Param('j','sys::Int',false)]),{}).am$('set',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false),new sys.Param('j','sys::Int',false),new sys.Param('val','sys::Float',false)]),{}).am$('fill',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Float',false)]),{}).am$('transpose',270337,'math::Matrix',xp,{}).am$('multScalar',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false)]),{}).am$('plus',270337,'math::Matrix',sys.List.make(sys.Param.type$,[new sys.Param('b','math::Matrix',false)]),{'sys::Operator':""}).am$('minus',270337,'math::Matrix',sys.List.make(sys.Param.type$,[new sys.Param('b','math::Matrix',false)]),{'sys::Operator':""}).am$('mult',270337,'math::Matrix',sys.List.make(sys.Param.type$,[new sys.Param('b','math::Matrix',false)]),{'sys::Operator':""}).am$('determinant',270337,'sys::Float',xp,{}).am$('cofactor',270337,'math::Matrix',xp,{}).am$('inverse',270337,'math::Matrix',xp,{});
MMatrix.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('numRows','sys::Int',false),new sys.Param('numCols','sys::Int',false)]),{}).am$('numRows',271360,'sys::Int',xp,{}).am$('numCols',271360,'sys::Int',xp,{}).am$('isSquare',271360,'sys::Bool',xp,{}).am$('get',271360,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false),new sys.Param('j','sys::Int',false)]),{}).am$('set',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false),new sys.Param('j','sys::Int',false),new sys.Param('val','sys::Float',false)]),{}).am$('fill',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Float',false)]),{}).am$('transpose',271360,'math::Matrix',xp,{}).am$('multScalar',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false)]),{}).am$('plus',271360,'math::Matrix',sys.List.make(sys.Param.type$,[new sys.Param('b','math::Matrix',false)]),{'sys::Operator':""}).am$('minus',271360,'math::Matrix',sys.List.make(sys.Param.type$,[new sys.Param('b','math::Matrix',false)]),{'sys::Operator':""}).am$('mult',271360,'math::Matrix',sys.List.make(sys.Param.type$,[new sys.Param('b','math::Matrix',false)]),{'sys::Operator':""}).am$('determinant',271360,'sys::Float',xp,{}).am$('cofactor',271360,'math::Matrix',xp,{}).am$('inverse',271360,'math::Matrix',xp,{});
MMatrixTest.type$.am$('testGetSet',8192,'sys::Void',xp,{}).am$('testFill',8192,'sys::Void',xp,{}).am$('testIsSquare',8192,'sys::Void',xp,{}).am$('testTranspose',8192,'sys::Void',xp,{}).am$('testMultScalar',8192,'sys::Void',xp,{}).am$('testPlus',8192,'sys::Void',xp,{}).am$('testMinus',8192,'sys::Void',xp,{}).am$('testMult',8192,'sys::Void',xp,{}).am$('testDeterminant',8192,'sys::Void',xp,{}).am$('testCofactor',8192,'sys::Void',xp,{}).am$('testInverse',8192,'sys::Void',xp,{}).am$('matrix',2048,'math::Matrix',sys.List.make(sys.Param.type$,[new sys.Param('numRows','sys::Int',false),new sys.Param('numCols','sys::Int',false),new sys.Param('arr','sys::Float[]',false)]),{}).am$('verifyMatrixEq',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','math::Matrix',false),new sys.Param('b','math::Matrix',false),new sys.Param('eps','sys::Float',true)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "math");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0");
m.set("pod.summary", "Math utilities and functions");
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
m.set("pod.native.java", "true");
m.set("vcs.uri", "https://github.com/fantom-lang/fantom");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  Math,
  BigInt,
  Matrix,
  MMatrix,
  MMatrixTest,
};
