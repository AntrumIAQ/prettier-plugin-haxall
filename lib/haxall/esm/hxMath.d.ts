import * as sys from './sys.js';
import * as math from './math.js';
import * as util from './util.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as hx from './hx.js';

/**
 * MathTest
 */
export class MathTest extends hx.HxTest {
  static type$: sys.Type
  verifyFitLinearRegression(): void;
  test(): void;
  testQuantileFolds(): void;
  verifyStandardDeviation(): void;
  verifyFoldEq($axon: string, expected: sys.JsObj | null): void;
  verifyQuantileFolds(list: string, quantile1_linear: sys.JsObj | null, quantile70_linear: sys.JsObj | null, quantile70_nearest: sys.JsObj | null, quantile70_lower: sys.JsObj | null, quantile70_higher: sys.JsObj | null, quantile70_midpoint: sys.JsObj | null): void;
  static make(...args: unknown[]): MathTest;
  verifyFolds(list: string, mean: sys.JsObj | null, median: sys.JsObj | null, rmse0: sys.JsObj | null, rmse1: sys.JsObj | null, mbe0: sys.JsObj | null, mbe1: sys.JsObj | null): void;
  testFolds(): void;
}

/**
 * MatrixTest
 */
export class MatrixTest extends haystack.HaystackTest {
  static type$: sys.Type
  testMath(): void;
  testToMatrix(): void;
  verifyToMatrix(zinc: string, floats: sys.List<sys.List<number>>, hasUnits: boolean): void;
  verifyMatrixEq(a: MatrixGrid, b: sys.JsObj): void;
  testDeterminant(): void;
  toMatrix(zinc: string, opts?: haystack.Dict): MatrixGrid;
  testInverse(): void;
  static make(...args: unknown[]): MatrixTest;
  testLinearRegression(): void;
}

/**
 * Axon functions for math
 */
export class MathFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Fold a sample of numbers into their RMSE (root mean square
   * error). The RMSE function determines the RMSE between a
   * sample set and its mean using the n-degrees of freedom RMSE:
   * ```
   * RMBE = sqrt( Σ(xᵢ - median)² ) / (n - nDegrees)
   * ```
   * 
   * Examples:
   * ```
   * samples.fold(rootMeanSquareErr)         // unbiased zero degrees of freedom
   * samples.fold(rootMeanSquareErr(_,_,1))  // 1 degree of freedom
   * ```
   */
  static rootMeanSquareErr(val: sys.JsObj | null, acc: sys.JsObj | null, nDegrees?: haystack.Number): sys.JsObj | null;
  /**
   * Return the cosine of angle in radians.
   */
  static cos(val: haystack.Number): haystack.Number;
  /**
   * Return the determinant as a unitless Number for the given
   * matrix which is any value accepted by {@link toMatrix | toMatrix}.
   * The matrix must be square.
   */
  static matrixDeterminant(m: sys.JsObj): haystack.Number;
  /**
   * Return the arc tangent.
   */
  static atan(val: haystack.Number): haystack.Number;
  /**
   * Return square root of val.
   */
  static sqrt(val: haystack.Number): haystack.Number;
  /**
   * Computes the p*th* quantile of a list of numbers, according
   * to the specified interpolation method. The value p must be a
   * number between 0.0 to 1.0.
   * - **linear** (default): Interpolates proportionally between the
   *   two closest values
   * - **nearest**: Rounds to the nearest data point
   * - **lower**: Rounds to the nearest lower data point
   * - **higher**: Rounds to the nearest higher data point
   * - **midpoint**: Averages two nearest values
   * 
   * Usage:
   * ```
   * [1,2,3].fold(quantile(p, method))
   * ```
   * 
   * Examples:
   * ```
   * [10,10,10,25,100].fold(quantile(0.7 )) => 22 //default to linear
   * [10,10,10,25,100].fold(quantile(0.7, "nearest")) => 25
   * [10,10,10,25,100].fold(quantile(0.7, "lower")) => 10
   * [10,10,10,25,100].fold(quantile(0.7, "higher")) => 25
   * [10,10,10,25,100].fold(quantile(0.7, "linear")) => 22 //same as no arg
   * [10,10,10,25,100].fold(quantile(0.7, "midpoint")) => 17.5
   * ```
   * 
   * Detailed Logic:
   * ```
   * p: percentile (decimal 0-1)
   * n: list size
   * rank: p * (n-1) // this is the index of the percentile in your list
   * // if rank is an integer, return list[rank]
   * // if rank is not an integer, interpolate via one of the above methods (illustrated below in examples)
   * 
   * [1,2,3,4,5].percentile(0.5) => 3 // rank=2 is an int so we can index[2] directly
   * 
   * [10,10,10, 25, 100].percentile(0.7, method)
   *   rank = (0.7 * 4) => 2.8
   * 
   *   //adjust rank based on method
   *   nearest =  index[3]                // => 25
   *   lower =    index[2]                // => 10
   *   higher =   index[3]                // => 25
   * 
   *   //or interpolate for these methods
   * 
   *   //takes the 2 closest indices and calculates midpoint
   *   midpoint = (25-10)/2 + 10          // => 17.5
   * 
   *   //takes the 2 closest indices and calculates weighted average
   *   linear =   (0.2 * 10) + (0.8 * 25) // => 22
   * ```
   */
  static quantile(percent: haystack.Number, method?: string): sys.JsObj | null;
  /**
   * Return e raised to val.
   */
  static exp(val: haystack.Number): haystack.Number;
  /**
   * Converts rectangular coordinates (x, y) to polar (r, theta).
   */
  static atan2(y: haystack.Number, x: haystack.Number): haystack.Number;
  /**
   * Return tangent of angle in radians.
   */
  static tan(val: haystack.Number): haystack.Number;
  /**
   * Return hyperbolic sine.
   */
  static sinh(val: haystack.Number): haystack.Number;
  /**
   * Transpose the given matrix which is any value accepted by {@link toMatrix | toMatrix}.
   */
  static matrixTranspose(m: sys.JsObj): MatrixGrid;
  /**
   * Convert angle in radians to an angle in degrees.
   */
  static toDegrees(val: haystack.Number): haystack.Number;
  /**
   * Return the smallest whole number greater than or equal to
   * val. Result has same unit as `val`.
   */
  static ceil(val: haystack.Number): haystack.Number;
  /**
   * Return the arc cosine.
   */
  static acos(val: haystack.Number): haystack.Number;
  /**
   * Bitwise and: `a & b`
   */
  static bitAnd(a: haystack.Number, b: haystack.Number): haystack.Number;
  /**
   * Return natural logarithm to the base e of val.
   */
  static logE(val: haystack.Number): haystack.Number;
  /**
   * Fold a sample of numbers into their median value which is
   * the middle value of the sorted samples.  If there are an
   * even number of sample, then the median is the mean of the
   * middle two.  Null values are ignored.  Return null if no
   * values.
   * 
   * Example:
   * ```
   * [2, 4, 5, 3, 1].fold(median)
   * ```
   */
  static median(val: sys.JsObj | null, acc: sys.JsObj | null): sys.JsObj | null;
  /**
   * Bitwise xor: `a ^ b`
   */
  static bitXor(a: haystack.Number, b: haystack.Number): haystack.Number;
  /**
   * Return the inverse of the given matrix which is any value
   * accepted by {@link toMatrix | toMatrix}.
   */
  static matrixInverse(m: sys.JsObj): MatrixGrid;
  /**
   * Bitwise not: `~a`
   */
  static bitNot(a: haystack.Number): haystack.Number;
  /**
   * Multiply two matrices and return new matrix.  The parameters
   * may be any value supported {@link toMatrix | toMatrix}. 
   * Matrix `a` column count must match matrix `b` row count.
   */
  static matrixMult(a: sys.JsObj, b: sys.JsObj): MatrixGrid;
  /**
   * Return base 10 logarithm of val.
   */
  static log10(val: haystack.Number): haystack.Number;
  /**
   * Bitwise or: `a | b`
   */
  static bitOr(a: haystack.Number, b: haystack.Number): haystack.Number;
  /**
   * Return random integer within given inclusive range. If range
   * is null, then full range of representative integers is
   * assumed.
   * 
   * Examples:
   * ```
   * random()       // random num with no range
   * random(0..100) // random num between 0 and 100
   * ```
   */
  static random(range?: sys.JsObj | null): haystack.Number;
  /**
   * Return hyperbolic tangent.
   */
  static tanh(val: haystack.Number): haystack.Number;
  /**
   * Given a matrix of y coordinates and a matrix of multiple x
   * coordinates compute the best fit multiple linear regression
   * equation using the ordinary least squares method.  Both `y`
   * and `x` may be any value accepted by {@link toMatrix | toMatrix}.
   * 
   * The resulting linear equation for r X coordinates is:
   * ```
   * yᵢ = bias + b₁xᵢ₁ + b₂xᵢ₂ +...+ bᵣxᵢᵣ
   * ```
   * 
   * The equation is returned as a grid.  The grid meta:
   * - `bias`: bias or zero coefficient which is independent of any
   *   of the x factors
   * - `r2`:  R² coefficient of determination as a number between 1.0
   *   (perfect correlation) and 0.0 (no correlation)
   * - `r`: the square root of R², referred to as the correlation
   *   coefficient
   * - `rowCount`: the number of rows of data used in the correlation
   *   For each X factor there is a row with the following tags:
   * - `b`: the correlation coefficient for the given X factor
   */
  static matrixFitLinearRegression(y: sys.JsObj, x: sys.JsObj): haystack.Grid;
  /**
   * Convert a general grid to an optimized matrix grid.  Matrixs
   * are two dimensional grids of Numbers.  Columns are named
   * "v0", "v1", "v2", etc. Grid meta is preserved, but not
   * column meta.  Numbers in the resulting matrix are unitless;
   * any units passed in are stripped.
   * 
   * The following options are supported:
   * - nullVal (Number): replace null values in the grid with this
   *   value
   * - naVal (Number): replace NA values in the grid with this
   *   value
   * ```
   * toMatrix(grid, {nullVal: 0, naVal: 0})
   * 
   * ```
   * 
   * To create a sparse or initialized matrix you can pass a Dict
   * with the the following tags (all required)
   * ```
   * toMatrix({rows:10, cols: 1000, init: 0})
   * ```
   */
  static toMatrix(obj: sys.JsObj, opts?: haystack.Dict): MatrixGrid;
  /**
   * Return val raised to the specified power.
   */
  static pow(val: haystack.Number, exp: haystack.Number): haystack.Number;
  /**
   * Return sine of angle in radians.
   */
  static sin(val: haystack.Number): haystack.Number;
  /**
   * Given a grid of x, y coordinates compute the best fit linear
   * regression equation using the ordinary least squares method.
   * The first column of the grid is used for `x` and the second
   * column is `y`.  Any rows without a Number for both x and y are
   * skipped.  Any special Numbers (infinity/NaN) are skipped.
   * 
   * Options:
   * - `x`: column name to use for x if not first column
   * - `y`: column name to use for y if not second column
   * 
   * The resulting linear equation is:
   * ```
   * yᵢ = mxᵢ + b
   * ```
   * 
   * The equation is returned as a dictionary with these keys:
   * - `m`: slope of the best fit regression line
   * - `b`: intercept of the best fit regression line
   * - `r2`:  R² coefficient of determination as a number between 1.0
   *   (perfect correlation) and 0.0 (no correlation)
   * - `xmin`: minimum value of x variable in sample data
   * - `xmax`: maximum value of x variable in sample data
   * - `ymin`: minimum value of y variable in sample data
   * - `ymax`: maximum value of y variable in sample data
   * 
   * Also see {@link matrixFitLinearRegression | matrixFitLinearRegression}
   * to compute a multiple linear regression.
   * 
   * Example:
   * ```
   * data: [{x:1, y:2},
   *        {x:2, y:4},
   *        {x:4, y:4},
   *        {x:6, y:5}].toGrid
   *  fitLinearRegression(data)
   * 
   *  >>> {m:0.4915, b: 2.1525, r2: 0.7502}
   * ```
   */
  static fitLinearRegression(grid: haystack.Grid, opts?: haystack.Dict | null): haystack.Dict;
  /**
   * Return the largest whole number less than or equal to val.
   * Result has same unit as `val`.
   */
  static floor(val: haystack.Number): haystack.Number;
  static make(...args: unknown[]): MathFuncs;
  /**
   * Convert angle in degrees to an angle in radians.
   */
  static toRadians(val: haystack.Number): haystack.Number;
  /**
   * Return the hyperbolic cosine.
   */
  static cosh(val: haystack.Number): haystack.Number;
  /**
   * Add two matrices together and return new matrix.  The
   * parameters may be any value supported {@link toMatrix | toMatrix}.
   * Matrices must have the same dimensions.
   */
  static matrixAdd(a: sys.JsObj, b: sys.JsObj): MatrixGrid;
  /**
   * Subtract two matrices and return new matrix.  The parameters
   * may be any value supported {@link toMatrix | toMatrix}. 
   * Matrices must have the same dimensions.
   */
  static matrixSub(a: sys.JsObj, b: sys.JsObj): MatrixGrid;
  /**
   * Bitwise right shift: `a >> b`
   */
  static bitShiftr(a: haystack.Number, b: haystack.Number): haystack.Number;
  /**
   * Returns the nearest whole number to val. Result has same
   * unit as `val`.
   */
  static round(val: haystack.Number): haystack.Number;
  /**
   * Fold a sample of numbers into their standard average or
   * arithmetic mean.  This function is the same as [core::avg](avg()).
   * Nulls values are ignored.  Return null if no values.
   * 
   * Example:
   * ```
   * [2, 4, 5, 3].fold(mean)
   * ```
   */
  static mean(val: sys.JsObj | null, acc: sys.JsObj | null): sys.JsObj | null;
  /**
   * Return constant for pi: 3.141592653589793
   */
  static pi(): haystack.Number;
  /**
   * Bitwise left shift: `a << b`
   */
  static bitShiftl(a: haystack.Number, b: haystack.Number): haystack.Number;
  /**
   * Return the arc sine.
   */
  static asin(val: haystack.Number): haystack.Number;
  /**
   * Fold a sample of numbers into their MBE (mean bias error).
   * The MBE function determines the MBE between a sample set and
   * its mean:
   * ```
   * MBE = Σ(xᵢ - median) / (n - nDegrees)
   * ```
   * 
   * Examples:
   * ```
   * samples.fold(meanBiasErr)         // unbiased zero degrees of freedom
   * samples.fold(meanBiasErr(_,_,1))  // 1 degree of freedom
   * ```
   */
  static meanBiasErr(val: sys.JsObj | null, acc: sys.JsObj | null, nDegrees?: haystack.Number): sys.JsObj | null;
  /**
   * Return the remainder or modulo of division: `a % b`. Result
   * has same unit as `a`.
   */
  static remainder(a: haystack.Number, b: haystack.Number): haystack.Number;
  /**
   * Fold a series of numbers into the standard deviation of a *sample*:
   * ```
   * s = sqrt(Σ (xᵢ - mean)² / (n-1))
   * ```
   * 
   * Example:
   * ```
   * [4, 2, 5, 8, 6].fold(standardDeviation)
   * ```
   */
  static standardDeviation(val: sys.JsObj | null, acc: sys.JsObj | null): sys.JsObj | null;
}

/**
 * Math function library
 */
export class MathLib extends hx.HxLib {
  static type$: sys.Type
  static make(...args: unknown[]): MathLib;
}

/**
 * MatrixGrid models a two dimensional grid of unitless
 * Numbers. It wraps a Fantom `math::Matrix` instance.
 */
export class MatrixGrid extends sys.Obj implements haystack.Grid {
  static type$: sys.Type
  meta(): haystack.Dict;
  cols(): sys.List<haystack.Col>;
  col(name: string, checked?: boolean): haystack.Col | null;
  /**
   * Multiply two matrices together
   */
  mult(b: MatrixGrid): MatrixGrid;
  getSafe(index: number): haystack.Row | null;
  /**
   * Get floating point value for given cell in matrix
   */
  float(row: number, col: number): number;
  /**
   * Get Number value for given cell in matrix
   */
  number(row: number, col: number): haystack.Number | null;
  /**
   * Insert column at leftmost position and fill with given
   * value.
   */
  insertCol(val: number): MatrixGrid;
  static index(numCols: number, row: number, col: number): number;
  /**
   * Number of cols in matrix
   */
  numCols(): number;
  each(f: ((arg0: haystack.Row, arg1: number) => void)): void;
  /**
   * Add two matrices together (must be of same dimension)
   */
  plus(b: MatrixGrid): MatrixGrid;
  /**
   * Construct from a grid of Numbers.  Columns are named "v0",
   * "v1", etc.  We maintain grid meta, but not column meta.
   */
  static makeGrid(grid: haystack.Grid, opts?: haystack.Dict, ...args: unknown[]): MatrixGrid;
  size(): number;
  /**
   * Is this a square matrix where numRows == numCols
   */
  isSquare(): boolean;
  toRows(): sys.List<haystack.Row>;
  /**
   * Subtract two matrices together (must be of same dimension)
   */
  minus(b: MatrixGrid): MatrixGrid;
  /**
   * Number of rows in matrix
   */
  numRows(): number;
  /**
   * Cofactor
   */
  cofactor(): MatrixGrid;
  get(index: number): haystack.Row;
  /**
   * Perform multiple linear regression using the 2 provided
   * matrices. Y is expected to only have one column and it
   * contains the dependent values. X will have as many columns
   * as there are correlating factors. Y and X must have the same
   * number of rows. X cannot have more columns that it has rows.
   */
  static fitLinearRegression(Y: MatrixGrid, X: MatrixGrid): haystack.Grid;
  /**
   * Inverse
   */
  inverse(): MatrixGrid;
  static arrayMake(numRows: number, numCols: number): util.FloatArray;
  /**
   * Multily each cell by given constant
   */
  multByConst(x: number): MatrixGrid;
  /**
   * Transpose
   */
  transpose(): MatrixGrid;
  eachWhile(f: ((arg0: haystack.Row, arg1: number) => sys.JsObj | null)): sys.JsObj | null;
  first(): haystack.Row | null;
  /**
   * Determinant
   */
  determinant(): number;
  /**
   * Return a new grid with additional column meta-data. The new
   * tags are merged according to [Etc.dictMerge](Etc.dictMerge).
   * The `col` parameter may be either a [Col](Col) or column name.
   * The meta may be any value accepted by [Etc.makeDict](Etc.makeDict).
   * If column is not found then return this. Also see {@link setColMeta | setColMeta}.
   */
  addColMeta(col: sys.JsObj, meta: sys.JsObj | null): haystack.Grid;
  /**
   * Convenience for {@link cols | cols} mapped to [Col.name](Col.name).
   * The resulting list is safe for mutating.
   */
  colNames(): sys.List<string>;
  /**
   * Get a column as a list of the cell values ordered by row.
   */
  colToList(col: sys.JsObj, listOf?: sys.Type): sys.List<sys.JsObj | null>;
  /**
   * Replace every cell with the given `from` value with the `to`
   * value. The resulting grid has the same grid and col meta. 
   * Replacement comparison is by via Fantom equality via `==`
   * operator, so it will only replace scalar values or null.
   */
  replace(from$: sys.JsObj | null, to: sys.JsObj | null): haystack.Grid;
  /**
   * Return a new Grid which is the result of applying the given
   * diffs to this grid.  The diffs must have the same number of
   * rows as this grid. Any cells in the diffs with a Remove.val
   * are removed from this grid, otherwise they are
   * updated/added.
   */
  commit(diffs: haystack.Grid): haystack.Grid;
  /**
   * Return a new grid which finds matching the rows in this
   * grid.  The has the same meta and column definitions. Also
   * see {@link find | find} and {@link filter | filter}.
   */
  findAll(f: ((arg0: haystack.Row, arg1: number) => boolean)): haystack.Grid;
  /**
   * Return a new grid with all the columns removed except the
   * given columns.  The `toKeep` columns can be [Col](Col)
   * instances or column names.  Columns not found are silently
   * ignored.
   */
  keepCols(toKeep: sys.List<sys.JsObj>): haystack.Grid;
  /**
   * Return a new Grid wich each col name mapped to its localized
   * tag name if the col does not already have a display string.
   * See [Etc.tagToLocale](Etc.tagToLocale) and [docSkySpark::Localization#tags](https://fantom.org/doc/docSkySpark/Localization#tags).
   */
  colsToLocale(): haystack.Grid;
  /**
   * Return a new grid with the given column renamed. The `oldCol`
   * parameter may be a [Col](Col) or col name.
   */
  renameCol(oldCol: sys.JsObj, newName: string): haystack.Grid;
  toCol(c: sys.JsObj, checked?: boolean): haystack.Col | null;
  /**
   * Find one matching row or return null if no matches. Also see
   * {@link findIndex | findIndex} and {@link findAll | findAll}.
   */
  find(f: ((arg0: haystack.Row, arg1: number) => boolean)): haystack.Row | null;
  /**
   * Return a new grid which is a slice of the rows in this grid.
   * Negative indexes may be used to access from the end of the
   * grid.  The has the same meta and column definitions.
   */
  getRange(r: sys.Range): haystack.Grid;
  /**
   * Return if this grid contains the given column name.
   */
  has(name: string): boolean;
  /**
   * Join two grids by column name.  The `joinCol` parameter may be
   * a [Col](Col) or col name.  Current implementation requires:
   * - grids cannot have conflicting col names (other than join
   *   col)
   * - each row in both grids must have a unique value for join col
   * - grid level meta is merged
   * - join column meta is merged
   */
  join(that: haystack.Grid, joinCol: sys.JsObj): haystack.Grid;
  /**
   * Return a new Grid which is a copy of this grid with the rows
   * reverse sorted by the given comparator function.
   */
  sortr(f: ((arg0: haystack.Row, arg1: haystack.Row) => number)): haystack.Grid;
  /**
   * Return true if the function returns true for all of the rows
   * in the grid.  If the grid is empty, return false.
   */
  all(f: ((arg0: haystack.Row, arg1: number) => boolean)): boolean;
  toCols(cols: sys.List<sys.JsObj>): sys.List<haystack.Col>;
  /**
   * Get the last row or return null if grid is empty. Throw
   * UnsupportedErr is the grid doesn't support indexed based row
   * access.
   */
  last(): haystack.Row | null;
  /**
   * Return new grid with column meta-data replaced by given
   * meta. The `col` parameter may be either a [Col](Col) or column
   * name. The meta may be any value accepted by [Etc.makeDict](Etc.makeDict)
   * If column is not found then return this.  Also see {@link addColMeta | addColMeta}.
   */
  setColMeta(col: sys.JsObj, meta: sys.JsObj | null): haystack.Grid;
  /**
   * Return if this is an error grid - meta has "err" tag.
   */
  isErr(): boolean;
  /**
   * Return a new grid with an additional column.  The cells of
   * the column are created by calling the mapping function for
   * each row. The meta may be any value accepted by [Etc.makeDict](Etc.makeDict)
   */
  addCol(name: string, meta: sys.JsObj | null, f: ((arg0: haystack.Row, arg1: number) => sys.JsObj | null)): haystack.Grid;
  /**
   * Return a new Grid which is a copy of this grid with the rows
   * sorted by the given comparator function.
   */
  sort(f: ((arg0: haystack.Row, arg1: haystack.Row) => number)): haystack.Grid;
  /**
   * Return a new grid which maps each of the rows to zero or
   * more new Dicts. The grid meta and existing column meta are
   * maintained.  New columns have empty meta.
   */
  flatMap(f: ((arg0: haystack.Row, arg1: number) => sys.JsObj | null)): haystack.Grid;
  /**
   * Return a new grid with multiple columns renamed.  The given
   * map is keyed old column names and maps to new column names. 
   * Any column names not found are ignored.
   */
  renameCols(oldToNew: sys.Map<sys.JsObj, string>): haystack.Grid;
  /**
   * Return a new grid with the given column removed. The `col`
   * parameter may be either a [Col](Col) or column name. If
   * column doesn't exist return this grid.
   */
  removeCol(col: sys.JsObj): haystack.Grid;
  /**
   * Sort the given column in reverse.  See {@link sortCol | sortCol}
   */
  sortColr(col: sys.JsObj): haystack.Grid;
  /**
   * Return a new grid by adding the given grid as a new set of
   * columns to this grid.  If the given grid contains duplicate
   * column names, then they are given auto-generated unique
   * names.  If the given grid contains fewer rows then this
   * grid, then the missing cells are filled with null.
   */
  addCols(x: haystack.Grid): haystack.Grid;
  /**
   * Return a new grid with only rows that define a unique key by
   * the given key columns.  If multiple rows have the same key
   * cells, then the first row is returned and subsequent rows
   * are removed.  The `keyCols` can be [Col](Col) instances or
   * column names.
   */
  unique(keyCols: sys.List<sys.JsObj>): haystack.Grid;
  /**
   * Return a new grid with additional grid level meta-data. The
   * new tags are merged according to [Etc.dictMerge](Etc.dictMerge).
   * The meta may be any value accepted by [Etc.makeDict](Etc.makeDict)
   * Also see {@link setMeta | setMeta}.
   */
  addMeta(meta: sys.JsObj | null): haystack.Grid;
  /**
   * Sort using [Etc.compareDis](Etc.compareDis) and [Dict.dis](Dict.dis).
   */
  sortDis(): haystack.Grid;
  /**
   * Return a new grid with grid level meta-data replaced by
   * given meta.  The meta may be any value accepted by [Etc.makeDict](Etc.makeDict).
   * Also see {@link addMeta | addMeta}.
   */
  setMeta(meta: sys.JsObj | null): haystack.Grid;
  /**
   * Convenience for {@link sort | sort} which sorts the given
   * column. The `col` parameter can be a [Col](Col) or a str name. 
   * The sorting algorithm used is the same one used by the table
   * UI based on the localized display string.  If column is not
   * found then return this.
   */
  sortCol(col: sys.JsObj): haystack.Grid;
  /**
   * Return if this grid does not contains the given column name.
   */
  missing(name: string): boolean;
  /**
   * Return a new grid which maps the rows to new Dict.  The grid
   * meta and existing column meta are maintained.  New columns
   * have empty meta.  If the mapping function returns null, then
   * the row is removed.
   */
  map(f: ((arg0: haystack.Row, arg1: number) => sys.JsObj | null)): haystack.Grid;
  /**
   * Return a new grid with all the given columns removed. The `toRemove`
   * columns can be [Col](Col) instances or column names. Columns
   * not found are silently ignored.
   */
  removeCols(toRemove: sys.List<sys.JsObj>): haystack.Grid;
  /**
   * Convenience for {@link cols | cols} mapped to [Col.dis](Col.dis).
   * The resulting list is safe for mutating.
   */
  colDisNames(): sys.List<string>;
  /**
   * Convenience for {@link size | size} equal to zero.
   */
  isEmpty(): boolean;
  /**
   * Return true if the function returns true for any of the rows
   * in the grid.  If the grid is empty, return false.
   */
  any(f: ((arg0: haystack.Row, arg1: number) => boolean)): boolean;
  /**
   * Find one matching row index or return null if no matches.
   * Also see {@link find | find}.
   */
  findIndex(f: ((arg0: haystack.Row, arg1: number) => boolean)): number | null;
  /**
   * Return a new grid which finds matching rows based on the
   * given filter.  Also see {@link findAll | findAll}.
   */
  filter(filter: haystack.Filter, cx?: haystack.HaystackContext | null): haystack.Grid;
  /**
   * Return if this grid conforms to the [history grid shape](lib-his::doc#hisGrid):
   * - has at least two columns
   * - first column is named "ts"
   * - has meta hisStart and hisEnd DateTime values
   * 
   * This method does **not** check timezones or the ts cells.
   */
  isHisGrid(): boolean;
  /**
   * Map each row to a list of values.
   */
  mapToList(f: ((arg0: haystack.Row, arg1: number) => sys.JsObj | null)): sys.List<sys.JsObj | null>;
  /**
   * Return a new grid with the columns reordered.  The given
   * list of names represents the new order and must contain the
   * same current [Col](Col) instances or column names. Any column
   * names not found are ignored.
   */
  reorderCols(cols: sys.List<sys.JsObj>): haystack.Grid;
}

