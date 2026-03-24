import * as sys from './sys.js';

/**
 * Interface for matrix implementations. A matrix is a
 * rectangular array of numbers.
 */
export abstract class Matrix extends sys.Obj {
  static type$: sys.Type
  /**
   * Computes `A - B` and returns a new matrix.
   */
  minus(b: Matrix): Matrix;
  /**
   * Compute the inverse of the matrix.
   */
  inverse(): Matrix;
  /**
   * Set the element at `A[i,j]`, where `i` is the row index, and `j`
   * is column index.
   */
  set(i: number, j: number, val: number): this;
  /**
   * Computes `A * B` and returns a new matrix.
   */
  mult(b: Matrix): Matrix;
  /**
   * The number of rows in the matrix.
   */
  numRows(): number;
  /**
   * Compute the cofactor of the matrix. The matrix must be
   * square.
   */
  cofactor(): Matrix;
  /**
   * Set every element in the matrix to the given val.
   */
  fill(val: number): this;
  /**
   * The number of columns in the matrix.
   */
  numCols(): number;
  /**
   * Computes `A + B` and returns a new matrix.
   */
  plus(b: Matrix): Matrix;
  /**
   * Get the element at `A[i,j]`, where `i` is the row index, and `j`
   * is column index.
   */
  get(i: number, j: number): number;
  /**
   * Get the transpose of the matrix.
   */
  transpose(): Matrix;
  /**
   * Computes `x * A`.
   */
  multScalar(x: number): this;
  /**
   * Return true if the matrix is square.
   */
  isSquare(): boolean;
  /**
   * Compute the determinant of the matrix. The matrix must be
   * square.
   */
  determinant(): number;
}

/**
 * Immutable arbitrary-precision integer.
 */
export class BigInt extends sys.Obj {
  static type$: sys.Type
  static zero(): BigInt;
  /**
   * Default value is 0.
   */
  static defVal(): BigInt;
  static one(): BigInt;
  /**
   * Returns a BigInt whose value is equal to that of the
   * specified Int.
   */
  static makeInt(val: number, ...args: unknown[]): BigInt;
  /**
   * Bitwise left shift of this by b. Negative values call shiftr
   * instead.
   */
  shiftl(b: number): BigInt;
  /**
   * Multiply this with b.  Shortcut is a*b.
   */
  mult(b: BigInt): BigInt;
  /**
   * Return remainder of this divided by b.  Shortcut is a%b.
   */
  mod(b: BigInt): BigInt;
  /**
   * Translates a byte array containing the two's-complement
   * binary representation of a BigInt into a BigInt.
   */
  static makeBuf(bytes: sys.Buf, ...args: unknown[]): BigInt;
  /**
   * Divide this by b.  Shortcut is a/b.
   */
  div(b: BigInt): BigInt;
  /**
   * Bitwise arithmetic right-shift of this by b.  Note that this
   * is similar to Int.shifta, not Int.shiftr.  Sign extension is
   * performed. Negative values call shiftl instead.
   */
  shiftr(b: number): BigInt;
  /**
   * Set the given bit to 0. Equivalent to
   * this.and(1.shiftl(b).not).
   */
  clearBit(b: number): BigInt;
  /**
   * Convert the number to an Decimal.
   * 
   * This simply wraps the BigInt with Decimal with a 0 scale,
   * equivilent mathematically to int * 2^0
   */
  toDecimal(): number;
  /**
   * -1, 0, 1 if the BigInt is negative, zero, or positive.
   */
  signum(): number;
  /**
   * Return decimal string representation.
   */
  toStr(): string;
  /**
   * Return string representation in given radix.  If width is
   * non-null, then leading zeros are prepended to ensure the
   * specified width.
   */
  toRadix(radix: number, width?: number | null): string;
  /**
   * Return true if given bit is 1. Equivalent to
   * this.and(1.shiftl(b)) != 0.
   */
  testBit(b: number): boolean;
  /**
   * Add this with b.  Shortcut is a+b.
   */
  plus(b: BigInt): BigInt;
  /**
   * Parse a Str into a BigInt using the specified radix. If
   * invalid format and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(s: string, radix?: number, checked?: boolean, ...args: unknown[]): BigInt;
  /**
   * Divide this by b.  Shortcut is a/b.
   */
  divInt(b: number): BigInt;
  /**
   * The hash for a BigInt is platform dependent.
   */
  hash(): number;
  /**
   * Subtract b from this.  Shortcut is a-b.
   */
  minus(b: BigInt): BigInt;
  /**
   * Compare based on integer value.
   */
  compare(obj: sys.JsObj): number;
  /**
   * Return remainder of this divided by b.  Shortcut is a%b.
   */
  modInt(b: number): number;
  /**
   * Increment by one.  Shortcut is ++a or a++.
   */
  increment(): BigInt;
  /**
   * Multiply this with b.  Shortcut is a*b.
   */
  multInt(b: number): BigInt;
  /**
   * Set the given bit to 1. Equivalent to this.or(1.shiftl(b)).
   */
  setBit(b: number): BigInt;
  /**
   * Bitwise not/inverse of this.
   */
  not(): BigInt;
  /**
   * Return the smaller of this and the specified BigInt values.
   */
  min(that: BigInt): BigInt;
  /**
   * Bitwise-and of this and b.
   */
  and(b: sys.JsObj): BigInt;
  /**
   * Return this value raised to the specified power. Throw
   * ArgErr if pow is less than zero.
   */
  pow(pow: number): BigInt;
  /**
   * Bitwise-exclusive-or of this and b.
   */
  xor(b: sys.JsObj): BigInt;
  /**
   * Add this with b.  Shortcut is a+b.
   */
  plusInt(b: number): BigInt;
  /**
   * Flip the given bit between 0 and 1. Equivalent to
   * this.xor(1.shiftl(b)).
   */
  flipBit(b: number): BigInt;
  /**
   * Convert the number to an Int.
   * 
   * If the value is out-of-range and checked is true, an Err is
   * thrown. Otherwise the value is truncated, with possible loss
   * of sign.
   */
  toInt(checked?: boolean): number;
  /**
   * Bitwise-or of this and b.
   */
  or(b: sys.JsObj): BigInt;
  /**
   * Return the larger of this and the specified BigInt values.
   */
  max(that: BigInt): BigInt;
  /**
   * Convert the number to an Float.
   * 
   * If the value is out-of-range, it will return Float.posInf or
   * Float.negInf.  Possible loss of precision is still possible,
   * even if the value is finite.
   */
  toFloat(): number;
  /**
   * Returns a byte array containing the two's-complement
   * representation of this BigInt.
   */
  toBuf(): sys.Buf;
  /**
   * Returns the number of bits in the minimal two's-complement
   * representation of this BigInteger, excluding a sign bit.
   */
  bitLen(): number;
  /**
   * Return the absolute value of this integer.  If this value is
   * positive then return this, otherwise return the negation.
   */
  abs(): BigInt;
  /**
   * Negative of this.  Shortcut is -a.
   */
  negate(): BigInt;
  /**
   * Decrement by one.  Shortcut is --a or a--.
   */
  decrement(): BigInt;
  /**
   * Subtract b from this.  Shortcut is a-b.
   */
  minusInt(b: number): BigInt;
  /**
   * Return true if same both represent that same integer value.
   */
  equals(obj: sys.JsObj | null): boolean;
}

/**
 * This mixin contains a set of utilities and functions for
 * various math operations.
 */
export class Math extends sys.Obj {
  static type$: sys.Type
  /**
   * Create a new {@link Matrix | Matrix} with the given number of
   * rows and columns. All elements of the matrix are initialized
   * to zero.
   */
  static matrix(numRows: number, numCols: number): Matrix;
  static make(...args: unknown[]): Math;
}

export class MMatrixTest extends sys.Test {
  static type$: sys.Type
  testMult(): void;
  testInverse(): void;
  testMinus(): void;
  static make(...args: unknown[]): MMatrixTest;
  testCofactor(): void;
  testFill(): void;
  testTranspose(): void;
  testPlus(): void;
  testGetSet(): void;
  testIsSquare(): void;
  testDeterminant(): void;
  testMultScalar(): void;
}

