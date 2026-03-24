import * as sys from './sys.js';
import * as concurrent from './concurrent.js';

/**
 * Font style property values: normal, italic, oblique
 */
export class FontStyle extends sys.Enum {
  static type$: sys.Type
  static oblique(): FontStyle;
  static normal(): FontStyle;
  /**
   * List of FontStyle values indexed by ordinal
   */
  static vals(): sys.List<FontStyle>;
  static italic(): FontStyle;
  /**
   * Is this the normal value
   */
  isNormal(): boolean;
  /**
   * Return the FontStyle instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): FontStyle;
}

/**
 * FontTest
 */
export class FontTest extends sys.Test {
  static type$: sys.Type
  testMake(): void;
  verifyFont(f: Font, names: sys.List<string>, size: number, weight: FontWeight, style: FontStyle, str: string): void;
  testWeight(): void;
  static make(...args: unknown[]): FontTest;
  testNormalize(): void;
  testProps(): void;
  verifyNormalize(s: string, expected: string): void;
  verifyProps(str: string, props: sys.Map<string, string>): void;
}

/**
 * Size models the width and height of a shape.
 */
export class Size extends sys.Obj {
  static type$: sys.Type
  /**
   * Height
   */
  h(): number;
  /**
   * Width
   */
  w(): number;
  /**
   * Default instance is `0,0`.
   */
  static defVal(): Size;
  /**
   * Return `"w h"`
   */
  toStr(): string;
  /**
   * Construct with w, h as integers.
   */
  static makeInt(w: number, h: number, ...args: unknown[]): Size;
  /**
   * Parse from comma or space separated string. If invalid then
   * throw ParseErr or return null based on checked flag.
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Size;
  /**
   * Return if obj is same Size value.
   */
  equals(obj: sys.JsObj | null): boolean;
  /**
   * Construct with w, h.
   */
  static make(w: number, h: number, ...args: unknown[]): Size;
  /**
   * Return hash of w and h.
   */
  hash(): number;
}

/**
 * Graphical image.  Images are loaded from a file using {@link GraphicsEnv.image | GraphicsEnv.image}.
 */
export abstract class Image extends sys.Obj {
  static type$: sys.Type
  /**
   * Image format based on file type:
   * - `image/png`
   * - `image/gif`
   * - `image/jpeg`
   * - `image/svg+xml`
   */
  mime(): sys.MimeType;
  /**
   * Is this image completely loaded into memory for use.  When a
   * given uri is first accessed by {@link GraphicsEnv.image | GraphicsEnv.image}
   * it may be asynchronously loaded in the background and false
   * is returned until load is complete.
   */
  isLoaded(): boolean;
  /**
   * Render a new image with the given MIME type and size using
   * the provided Graphics instance. Throws `UnsupportedErr` if
   * rendering is not supported in this env.
   */
  static render(mime: sys.MimeType, size: Size, f: ((arg0: Graphics) => void)): Image;
  /**
   * Write image content to the given output stream, where
   * encoding is based on {@link mime | mime} type.  Throws `UnsupportedErr`
   * if write is not supported in this env.
   */
  write(out: sys.OutStream): void;
  /**
   * Get the size height
   */
  h(): number;
  /**
   * Unique uri key for this image in the GraphicsEnv cache.
   */
  uri(): sys.Uri;
  /**
   * Get the natural size of this image. If the image has not
   * been loaded yet, then return 0,0.
   */
  size(): Size;
  /**
   * Get the size width
   */
  w(): number;
}

/**
 * Defines how two stroke lines are joined together
 */
export class StrokeJoin extends sys.Enum {
  static type$: sys.Type
  /**
   * List of StrokeJoin values indexed by ordinal
   */
  static vals(): sys.List<StrokeJoin>;
  /**
   * Join using a bevel with angle to smooth transition
   */
  static bevel(): StrokeJoin;
  /**
   * Join using sharp corners
   */
  static miter(): StrokeJoin;
  /**
   * Join using rounded semi-circle (round in SVG terminology)
   */
  static radius(): StrokeJoin;
  /**
   * Return the StrokeJoin instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): StrokeJoin;
}

/**
 * Represents the x,y coordinate and w,h size of a rectangle.
 */
export class Rect extends sys.Obj {
  static type$: sys.Type
  /**
   * Height
   */
  h(): number;
  /**
   * Width
   */
  w(): number;
  /**
   * X coordinate
   */
  x(): number;
  /**
   * Y coordinate
   */
  y(): number;
  /**
   * Default instance is 0, 0, 0, 0.
   */
  static defVal(): Rect;
  /**
   * Construct with x, y, w, h as integers.
   */
  static makeInt(x: number, y: number, w: number, h: number, ...args: unknown[]): Rect;
  /**
   * Return true if this rectangle intersects any portion of that
   * rectangle
   */
  intersects(that: Rect): boolean;
  /**
   * Get the x, y coordinate of this rectangle.
   */
  pos(): Point;
  /**
   * Compute the intersection between this rectangle and that
   * rectangle. If there is no intersection, then return {@link defVal | defVal}.
   */
  intersection(that: Rect): Rect;
  /**
   * Construct from a Point and Size instance
   */
  static makePosSize(p: Point, s: Size, ...args: unknown[]): Rect;
  /**
   * Construct with x, y, w, h.
   */
  static make(x: number, y: number, w: number, h: number, ...args: unknown[]): Rect;
  /**
   * Return `"x y w h"`
   */
  toStr(): string;
  /**
   * Compute the union between this rectangle and that rectangle,
   * which is the bounding box that exactly contains both
   * rectangles.
   */
  union(that: Rect): Rect;
  /**
   * Return true if x,y is inside the bounds of this rectangle.
   */
  contains(pt: Point): boolean;
  /**
   * Parse from comma or space separated string. If invalid then
   * throw ParseErr or return null based on checked flag.
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Rect;
  /**
   * Get the w, h size of this rectangle.
   */
  size(): Size;
  /**
   * Return if obj is same Rect value.
   */
  equals(obj: sys.JsObj | null): boolean;
  /**
   * Return hash of x, y, w, and h.
   */
  hash(): number;
}

/**
 * Models an CSS4 RGB color with alpha
 */
export class Color extends sys.Obj implements Paint {
  static type$: sys.Type
  /**
   * The RGB components masked together: bits 16-23 red; bits
   * 8-15 green; bits 0-7 blue.
   */
  rgb(): number;
  /**
   * Transparent constant with opacity set to zero
   */
  static transparent(): Color;
  /**
   * White is #FFF
   */
  static white(): Color;
  /**
   * The alpha component from 0.0 to 1.0
   */
  a(): number;
  /**
   * Black is #000
   */
  static black(): Color;
  /**
   * Construct a color using HSL model (hue, saturation,
   * lightness):
   * - hue as 0.0 to 360.0
   * - saturation as 0.0 to 1.0
   * - lightness (or brightness) as 0.0 to 1.0
   * - alpha as 0.0 to 1.0 Also see {@link h | h}, {@link s | s}, {@link l | l}.
   */
  static makeHsl(h: number, s: number, l: number, a?: number): Color;
  /**
   * Get a color which is a dark shade of this color. This
   * decreases the brightness by the given percentage which is a
   * float between 0.0 and 1.0.
   */
  darker(percentage?: number): Color;
  /**
   * Adjust saturation as percentage between -1..1.
   */
  saturate(percentage?: number): Color;
  /**
   * Return if {@link a | a} is zero, fully transparent
   */
  isTransparent(): boolean;
  /**
   * Convenience for `saturate(-percentage)`.
   */
  desaturate(percentage?: number): Color;
  /**
   * Make a new instance with the RGB components masked together:
   * bits 16-23 red; bits 8-15 green; bits 0-7 blue. Alpha should
   * be a float between 1.0 and 0.0.
   */
  static make(rgb?: number, a?: number, ...args: unknown[]): Color;
  /**
   * Make a new instance with the RGB individual components as
   * integers between 0 and 255 and alpha as float between 1.0
   * and 0.0.
   */
  static makeRgb(r: number, g: number, b: number, a?: number): Color;
  /**
   * If the alpha component is 1.0, then format as `"#RRGGBB"` hex
   * string, otherwise format as `"rbga()"` notation.
   */
  toStr(): string;
  /**
   * The blue component from 0 to 255.
   */
  b(): number;
  /**
   * The green component from 0 to 255.
   */
  g(): number;
  /**
   * Hue as a float between 0.0 and 360.0 of the HSL model (hue,
   * saturation, lightness).  Also see {@link makeHsl | makeHsl}, {@link s | s},
   * {@link l | l}.
   */
  h(): number;
  /**
   * Always return true
   */
  isColorPaint(): boolean;
  /**
   * Get a color which is a lighter shade of this color. This
   * increases the brightness by the given percentage which is a
   * float between 0.0 and 1.0.
   */
  lighter(percentage?: number): Color;
  /**
   * Lightness (brightness) as a float between 0.0 and 1.0 of the
   * HSL model (hue, saturation, lightness). Also see {@link makeHsl | makeHsl},
   * {@link h | h}, {@link s | s}.
   */
  l(): number;
  /**
   * Return this
   */
  asColorPaint(): Color;
  /**
   * Format as #RGB, #RRGGBB or #RRGGBBAA syntax
   */
  toHexStr(): string;
  /**
   * The red component from 0 to 255.
   */
  r(): number;
  /**
   * Interpolate between a and b where t is 0.0 to 1.0 using RGB
   * color model.
   */
  static interpolateRgb(a: Color, b: Color, t: number): Color;
  /**
   * Saturation as a float between 0.0 and 1.0 of the HSL model
   * (hue, saturation, lightness).  Also see {@link makeHsl | makeHsl},
   * {@link h | h}, {@link l | l}.
   */
  s(): number;
  /**
   * Parse color from CSS 4 string.  If invalid and checked is
   * true then throw ParseErr otherwise return null.  The
   * following formats are supported:
   * - CSS keyword color
   * - #RRGGBB
   * - #RRGGBBAA
   * - #RGB
   * - #RGBA
   * - rgb(r, g b)
   * - rgba(r, g, b, a)
   * - hsl(h, s, l)
   * - hsla(h, s, l, a)
   * 
   * Functional notation works with comma or space separated
   * arguments.
   * 
   * Examples:
   * ```
   * Color.fromStr("red")
   * Color.fromStr("#8A0")
   * Color.fromStr("#88AA00")
   * Color.fromStr("rgba(255, 0, 0, 0.3)")
   * Color.fromStr("rgb(100% 0% 0% 25%)")
   * ```
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Color;
  /**
   * Equality
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Adjust the opacity of this color and return new instance,
   * where `opacity` is between 0.0  and 1.0.
   */
  opacity(opacity?: number): Color;
  /**
   * Return the hash code.
   */
  hash(): number;
  /**
   * Interpolate between a and b where t is 0.0 to 1.0 using HSL
   * color model.
   */
  static interpolateHsl(a: Color, b: Color, t: number): Color;
}

/**
 * Paint models the color, image, or pattern used to stroke or
 * fill a shape. Currently there is only one implementation: {@link Color | Color}.
 */
export abstract class Paint extends sys.Obj {
  static type$: sys.Type
  /**
   * Is this solid color paint
   */
  isColorPaint(): boolean;
  /**
   * Return as solid Color
   */
  asColorPaint(): Color;
}

/**
 * GraphicsEnv encapsulates a graphics toolkit.  It is
 * responsible image loading and caching.
 */
export abstract class GraphicsEnv extends sys.Obj {
  static type$: sys.Type
  /**
   * Default environment for the VM
   */
  static cur(): GraphicsEnv;
  /**
   * Get an image for the given uri.  The uri is the unique key
   * for the image in this environment.  If file data is null,
   * then asynchronously load and cache the image on the first
   * load.  Standard supported formats are: PNG, JPEG, and SVG.
   */
  image(uri: sys.Uri, data?: sys.Buf | null): Image;
}

/**
 * StrokeTest
 */
export class StrokeTest extends sys.Test {
  static type$: sys.Type
  testMake(): void;
  static make(...args: unknown[]): StrokeTest;
  verifyStroke(s: Stroke, w: number, dash: string | null, cap: StrokeCap, join: StrokeJoin): void;
}

/**
 * TransformTest
 */
export class TransformTest extends sys.Test {
  static type$: sys.Type
  static make(...args: unknown[]): TransformTest;
  test(): void;
  verifyTransform(t: Transform, expected: string): void;
}

/**
 * Insets represents spacing around the edge of a rectangle.
 */
export class Insets extends sys.Obj {
  static type$: sys.Type
  /**
   * Bottom side spacing
   */
  bottom(): number;
  /**
   * Right side spacing
   */
  right(): number;
  /**
   * Top side spacing
   */
  top(): number;
  /**
   * Left side spacing
   */
  left(): number;
  /**
   * Default instance 0, 0, 0, 0.
   */
  static defVal(): Insets;
  /**
   * If all four sides are equal return `"len"` otherwise return `"top
   * right bottom left"`.
   */
  toStr(): string;
  /**
   * Return if all sides are set to zero
   */
  isNone(): boolean;
  /**
   * Top plus bottom
   */
  h(): number;
  /**
   * Return right+left, top+bottom
   */
  toSize(): Size;
  /**
   * Parse from comma or space separated string using CSS format:
   * - "top"
   * - "top, right" (implies bottom = top, left = right)
   * - "top, right, bottom" (implies left = right)
   * - "top, right, bottom, left"
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Insets;
  /**
   * Return if obj is same Insets value.
   */
  equals(obj: sys.JsObj | null): boolean;
  /**
   * Left plus right
   */
  w(): number;
  /**
   * Construct with top, and optional right, bottom, left.  If
   * one side is not specified, it is reflected from the opposite
   * side:
   * ```
   * Insets(5)     => Insets(5,5,5,5)
   * Insets(5,6)   => Insets(5,6,5,6)
   * Insets(5,6,7) => Insets(5,6,7,6)
   * ```
   */
  static make(top: number, right?: number | null, bottom?: number | null, left?: number | null, ...args: unknown[]): Insets;
  /**
   * Return hash of top, right, bottom, left.
   */
  hash(): number;
}

/**
 * GraphicsPath is used to path complex shapes for stroking,
 * filling, and clipping.
 */
export abstract class GraphicsPath extends sys.Obj {
  static type$: sys.Type
  /**
   * Add a Bézier curve to the path.  The cp1 and cp2 parameters
   * specify the first and second control points; x and y specify
   * the end point.
   */
  curveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): this;
  /**
   * Add a line to the path from current point to given point.
   */
  lineTo(x: number, y: number): this;
  /**
   * Stroke the the current path using current stroke and paint.
   * This call terminates the current pathing operation.
   */
  draw(): this;
  /**
   * Fill the current path with current paint. This call
   * terminates the current pathing operation.
   */
  fill(): this;
  /**
   * Create circular arc centered at x, y with given radius.  The
   * start angle and sweep angle are measured in degrees.  East
   * is 0°, north 90°, west is 180°, and south is 270°.  Positive
   * sweeps are counterclockwise and negative sweeps are
   * clockwise.
   */
  arc(x: number, y: number, radius: number, start: number, sweep: number): this;
  /**
   * Add a quadratic Bézier curve to the path.  The cpx and cpy
   * specify the control point; the x and y specify the end
   * point.
   */
  quadTo(cpx: number, cpy: number, x: number, y: number): this;
  /**
   * Close the path by add a line from current point back to
   * starting point.
   */
  close(): this;
  /**
   * Intersect the current clipping shape with this path. This
   * call terminates the current pathing operation.
   */
  clip(): this;
  /**
   * Move the current point without creating a line.
   */
  moveTo(x: number, y: number): this;
}

/**
 * Font weight property values
 */
export class FontWeight extends sys.Enum {
  static type$: sys.Type
  /**
   * List of FontWeight values indexed by ordinal
   */
  static vals(): sys.List<FontWeight>;
  /**
   * Numeric weight as number from 100 to 900
   */
  num(): number;
  static medium(): FontWeight;
  static normal(): FontWeight;
  static extraLight(): FontWeight;
  static black(): FontWeight;
  static bold(): FontWeight;
  static extraBold(): FontWeight;
  static thin(): FontWeight;
  static light(): FontWeight;
  static semiBold(): FontWeight;
  /**
   * Is this the normal value
   */
  isNormal(): boolean;
  /**
   * From numeric value 100 to 900
   */
  static fromNum(num: number, checked?: boolean): FontWeight | null;
  /**
   * Return the FontWeight instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): FontWeight;
}

/**
 * Font models font-family, font-size, and font-style, and
 * font-weight. Metrics are available for a predefined set of
 * fonts.
 */
export class Font extends sys.Obj {
  static type$: sys.Type
  /**
   * Weight as number from 100 to 900
   */
  weight(): FontWeight;
  __weight(it: FontWeight): void;
  /**
   * List of prioritized family names
   */
  names(): sys.List<string>;
  __names(it: sys.List<string>): void;
  /**
   * Size of font in points.
   */
  size(): number;
  __size(it: number): void;
  /**
   * Style as normal, italic, or oblique
   */
  style(): FontStyle;
  __style(it: FontStyle): void;
  /**
   * Return this font with different weight.
   */
  toWeight(weight: FontWeight): Font;
  /**
   * Construct from a map of CSS props such as font-family,
   * font-size. Also see {@link toProps | toProps}.
   */
  static fromProps(props: sys.Map<string, string>, ...args: unknown[]): Font;
  /**
   * Construct with it-block
   */
  static make(f: ((arg0: Font) => void), ...args: unknown[]): Font;
  /**
   * Format as `"[style] [weight] <size>pt <names>"`
   */
  toStr(): string;
  /**
   * Return this font with different point size.
   */
  toSize(size: number): Font;
  /**
   * Get CSS style properties for this font. Also see {@link fromProps | fromProps}
   */
  toProps(): sys.Map<string, string>;
  /**
   * Return this font with different style
   */
  toStyle(style: FontStyle): Font;
  /**
   * Parse font from string using CSS shorthand format for
   * supported properties:
   * ```
   * [<style>] [<weight>] <size> <names>
   * ```
   * 
   * Examples:
   * ```
   * Font.fromStr("12pt Arial")
   * Font.fromStr("bold 10pt Courier")
   * Font.fromStr("italic bold 8pt Times")
   * Font.fromStr("italic 300 10pt sans-serif")
   * ```
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Font;
  /**
   * Equality is based on all fields.
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * First family name in {@link names | names}
   */
  name(): string;
  /**
   * Return hash of all fields
   */
  hash(): number;
}

/**
 * GeomTest
 */
export class GeomTest extends sys.Test {
  static type$: sys.Type
  verifyUnion(a: Rect, b: Rect, r: Rect): void;
  testPoint(): void;
  verifySer(obj: sys.JsObj): void;
  verifyIntersection(a: Rect, b: Rect, r: Rect): void;
  testSplit(): void;
  testSize(): void;
  static make(...args: unknown[]): GeomTest;
  testRect(): void;
  testInsets(): void;
}

/**
 * FontMetrics represents font size information for a {@link Font | Font}
 * within a specific graphics context.
 */
export class FontMetrics extends sys.Obj {
  static type$: sys.Type
  /**
   * Get leading of this font which is the distance above the
   * ascent which may include accents and other marks.
   */
  leading(): number;
  /**
   * Get descent of this font which is the distance from baseline
   * to bottom of chars, not including any leading area.
   */
  descent(): number;
  /**
   * Get ascent of this font which is the distance from baseline
   * to top of chars, not including any leading area.
   */
  ascent(): number;
  /**
   * Get the width of the string when painted with this font.
   */
  width(s: string): number;
  static make(...args: unknown[]): FontMetrics;
  /**
   * Get height of this font which is the sum of ascent, descent,
   * and leading.
   */
  height(): number;
}

/**
 * Defines how a stroke end cap is rendered
 */
export class StrokeCap extends sys.Enum {
  static type$: sys.Type
  /**
   * List of StrokeCap values indexed by ordinal
   */
  static vals(): sys.List<StrokeCap>;
  /**
   * Cap is a half square extension
   */
  static square(): StrokeCap;
  /**
   * Cap is a a rounded semi-circle
   */
  static round(): StrokeCap;
  /**
   * Cap is a flat edge with no extension
   */
  static butt(): StrokeCap;
  /**
   * Return the StrokeCap instance for the specified name.  If
   * not a valid name and checked is false return null, otherwise
   * throw ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): StrokeCap;
}

/**
 * Stroke defines the how to render shape outlines.
 */
export class Stroke extends sys.Obj {
  static type$: sys.Type
  /**
   * Value with width of zero
   */
  static none(): Stroke;
  static __none(it: Stroke): void;
  /**
   * How to render line end caps.  Default is butt.
   */
  cap(): StrokeCap;
  __cap(it: StrokeCap): void;
  /**
   * Stroke width.  Default is 1.
   */
  width(): number;
  __width(it: number): void;
  /**
   * How to render line joins. Default is miter.
   */
  join(): StrokeJoin;
  __join(it: StrokeJoin): void;
  /**
   * Dash pattern as space/comma separated numbers of dashes and
   * gaps. If null then render as solid line.
   */
  dash(): string | null;
  __dash(it: string | null): void;
  /**
   * Default value is width 1, no dash, butt cap, miter join.
   */
  static defVal(): Stroke;
  static __defVal(it: Stroke): void;
  /**
   * Return string format - see {@link fromStr | fromStr}
   */
  toStr(): string;
  /**
   * Is the width set to zero
   */
  isNone(): boolean;
  /**
   * Return this stroke with different width.
   */
  toSize(newWidth: number): Stroke;
  /**
   * Parse from string format:
   * ```
   * width [dash] cap join
   * ```
   * 
   * Examples:
   * ```
   * 0.5
   * 2 [1, 2]
   * round radius
   * ```
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Stroke;
  /**
   * Make with fields
   */
  static makeFields(width?: number, dash?: string | null, cap?: StrokeCap, join?: StrokeJoin, ...args: unknown[]): Stroke;
  /**
   * Equality is based on fields
   */
  equals(obj: sys.JsObj | null): boolean;
  /**
   * Make with an it-block
   */
  static make(f: ((arg0: Stroke) => void), ...args: unknown[]): Stroke;
  /**
   * Hash is based on fields
   */
  hash(): number;
}

/**
 * Point models a x,y coordinate.
 */
export class Point extends sys.Obj {
  static type$: sys.Type
  /**
   * X coordinate
   */
  x(): number;
  /**
   * Y coordinate
   */
  y(): number;
  /**
   * Default instance is `0,0`.
   */
  static defVal(): Point;
  /**
   * Return `"x y"`
   */
  toStr(): string;
  /**
   * Construct with x, y.
   */
  static makeInt(x: number, y: number, ...args: unknown[]): Point;
  /**
   * Return `x+tx, y+ty`
   */
  translate(t: Point): Point;
  /**
   * Parse from comma or space separated string. If invalid then
   * throw ParseErr or return null based on checked flag.
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Point;
  /**
   * Return if obj is same Point value.
   */
  equals(obj: sys.JsObj | null): boolean;
  /**
   * Construct with x, y.
   */
  static make(x: number, y: number, ...args: unknown[]): Point;
  /**
   * Return hash of x and y.
   */
  hash(): number;
}

/**
 * Graphics is used to draw 2D graphics.
 */
export abstract class Graphics extends sys.Obj {
  static type$: sys.Type
  /**
   * Convenience for setting paint to a solid color.  If the
   * paint is currently not a solid color, then get returns {@link Paint.asColorPaint | Paint.asColorPaint}.
   */
  color(): Color;
  color(it: Color): void;
  /**
   * Current paint defines how text and shapes are stroked and
   * filled
   */
  paint(): Paint;
  paint(it: Paint): void;
  /**
   * Global alpha value used to control opacity for rending. The
   * value must be between 0.0 (transparent) and 1.0 (opaue).
   */
  alpha(): number;
  alpha(it: number): void;
  /**
   * Current stroke defines how the shapes are outlined
   */
  stroke(): Stroke;
  stroke(it: Stroke): void;
  /**
   * Current font used for drawing text
   */
  font(): Font;
  font(it: Font): void;
  /**
   * Fill an ellipse within the given bounds with the current
   * stroke and paint.
   */
  fillEllipse(x: number, y: number, w: number, h: number): this;
  /**
   * Fill a rectangle with the current paint.
   */
  fillRect(x: number, y: number, w: number, h: number): this;
  /**
   * Translate the coordinate system to the new origin. This call
   * is a convenience for:
   * ```
   * transform(Transform.translate(x, y))
   * ```
   */
  translate(x: number, y: number): this;
  /**
   * Pop the graphics stack and reset the state to the the last {@link push | push}.
   */
  pop(): this;
  /**
   * Begin a new path operation to stroke, fill, or clip a shape.
   */
  path(): GraphicsPath;
  /**
   * Clip a rectangle with rounded corners with the current
   * paint. The ellipse of the corners is specified by wArc and
   * hArc.
   */
  clipRoundRect(x: number, y: number, w: number, h: number, wArc: number, hArc: number): this;
  /**
   * Perform an affine transformation on the coordinate system
   */
  transform(transform: Transform): this;
  /**
   * Draw a rectangle with rounded corners with the current
   * stroke and paint. The ellipse of the corners is specified by
   * wArc and hArc.
   */
  drawRoundRect(x: number, y: number, w: number, h: number, wArc: number, hArc: number): this;
  /**
   * Draw an ellipse within the given bounds with the current
   * stroke and paint.
   */
  drawEllipse(x: number, y: number, w: number, h: number): this;
  /**
   * Fill a rectangle with rounded corners with the current
   * paint. The ellipse of the corners is specified by wArc and
   * hArc.
   */
  fillRoundRect(x: number, y: number, w: number, h: number, wArc: number, hArc: number): this;
  /**
   * Convenience to clip the given the rectangle.  This sets the
   * clipping area to the intersection of the current clipping
   * region and the specified rectangle.
   */
  clipRect(x: number, y: number, w: number, h: number): this;
  /**
   * Draw a the text string with the current paint and font.  The
   * x, y coordinate specifies the left baseline corner of where
   * the text is to be drawn.  Technically this is a fill
   * operation similiar to the Canvas fillText function (there is
   * currently no support to stroke/outline text).
   */
  drawText(s: string, x: number, y: number): this;
  /**
   * Draw a line with the current stroke and paint.
   */
  drawLine(x1: number, y1: number, x2: number, y2: number): this;
  /**
   * Push the current graphics state onto an internal stack. 
   * Reset the state back to its current state via {@link pop | pop}.
   * If `r` is non-null, the graphics state is automatically
   * translated and clipped to the bounds.
   */
  push(r?: Rect | null): this;
  /**
   * Draw an image at the given coordinate for the top/left
   * corner. If the width or height does not correspond to the
   * image's natural size then the image is scaled to fit.
   */
  drawImage(img: Image, x: number, y: number, w?: number, h?: number): this;
  /**
   * Draw a rectangular region of the source image to the drawing
   * surface. The src rectangle defines the subregion of the
   * source image to use.  The dst rectangle identifies the
   * destination location.  If the src size does not correspond
   * to the dst size, then the image is scaled to fit.
   */
  drawImageRegion(img: Image, src: Rect, dst: Rect): this;
  /**
   * Dispose of this graphics context and release underyling OS
   * resources.
   */
  dispose(): void;
  /**
   * Get font metrics for the current font
   */
  metrics(): FontMetrics;
  /**
   * Draw a rectangle with the current stroke and paint.
   */
  drawRect(x: number, y: number, w: number, h: number): this;
}

/**
 * ColorTest
 */
export class ColorTest extends sys.Test {
  static type$: sys.Type
  testMake(): void;
  static hslStr(c: Color): string;
  verifyHslEq(a: Color, b: Color): void;
  verifyInterpolateHsl(a: Color, b: Color, t: number, expected: string): void;
  testFromStr(): void;
  static make(...args: unknown[]): ColorTest;
  verifyFromStr(s: string, e: Color): void;
  testEquals(): void;
  verifyHsl(obj: sys.JsObj, h: number, s: number, l: number): void;
  testInterpolateHsl(): void;
  testInterpolateRgb(): void;
  verifyInterpolateRgb(a: Color, b: Color, t: number, expected: string): void;
  testListFromStr(): void;
  verifyRbgEq(a: Color, b: Color): void;
  verifyColor(c: Color, r: number, g: number, b: number, a: number, s: string): void;
  testHsl(): void;
}

/**
 * Transform models an affine transformation matrix:
 * ```
 * |a  c  e|
 * |b  d  f|
 * |0  0  1|
 * ```
 */
export class Transform extends sys.Obj {
  static type$: sys.Type
  a(): number;
  b(): number;
  c(): number;
  d(): number;
  e(): number;
  f(): number;
  /**
   * Default instance is no transform.
   */
  static defVal(): Transform;
  /**
   * Rotate angle in degrees
   */
  static rotate(angle: number, cx?: number | null, cy?: number | null): Transform;
  /**
   * Multiply this matrix by given matrix and return result as
   * new instance
   */
  mult(that: Transform): this;
  /**
   * Skew x by angle in degrees
   */
  static skewX(angle: number): Transform;
  /**
   * Scale transform
   */
  static scale(sx: number, sy: number): Transform;
  /**
   * Skew y by angle in degrees
   */
  static skewY(angle: number): Transform;
  /**
   * Translate transform
   */
  static translate(tx: number, ty: number): Transform;
  /**
   * Construct from matrix values
   */
  static make(a: number, b: number, c: number, d: number, e: number, f: number, ...args: unknown[]): Transform;
  /**
   * Return in `matrix(<a> <b> <c> <d> <e> <f>)` format
   */
  toStr(): string;
  /**
   * Parse from SVG string format:
   * ```
   * matrix(<a> <b> <c> <d> <e> <f>)
   * translate(<x> [<y>])
   * scale(<x> [<y>])
   * rotate(<a> [<x> <y>])
   * skewX(<a>)
   * skewY(<a>)
   * ```
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Transform;
  /**
   * Equality is based on string format
   */
  equals(obj: sys.JsObj | null): boolean;
  /**
   * Hash code is based on string format
   */
  hash(): number;
}

