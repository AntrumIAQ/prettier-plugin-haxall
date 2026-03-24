import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as graphics from './graphics.js';

export class Java2DImage extends sys.Obj implements graphics.Image {
  static type$: sys.Type
  mime(): sys.MimeType;
  uri(): sys.Uri;
  size(): graphics.Size;
  awtRef(): sys.Unsafe;
  isLoaded(): boolean;
  get(prop: string): sys.JsObj | null;
  static make(uri: sys.Uri, mime: sys.MimeType, awt: [java]java.awt.image.BufferedImage | null, ...args: unknown[]): Java2DImage;
  write(out: sys.OutStream): void;
  awt(): [java]java.awt.image.BufferedImage | null;
  /**
   * Get the size height
   */
  h(): number;
  /**
   * Get the size width
   */
  w(): number;
}

export class Java2DGraphicsEnv extends sys.Obj implements graphics.GraphicsEnv {
  static type$: sys.Type
  image(uri: sys.Uri, data?: sys.Buf | null): Java2DImage;
  renderImage(mime: sys.MimeType, size: graphics.Size, f: ((arg0: graphics.Graphics) => void)): graphics.Image;
  resolveImageData(uri: sys.Uri): sys.Buf;
  loadImage(uri: sys.Uri, data: sys.Buf): Java2DImage;
  awtFont(f: graphics.Font): [java]java.awt.Font;
  static make(...args: unknown[]): Java2DGraphicsEnv;
}

export class ServerGraphicsEnv extends sys.Obj implements graphics.GraphicsEnv {
  static type$: sys.Type
  image(uri: sys.Uri, data?: sys.Buf | null): graphics.Image;
  resolveImageData(uri: sys.Uri): sys.Buf;
  static make(...args: unknown[]): ServerGraphicsEnv;
}

export class Java2DGraphics extends sys.Obj implements graphics.Graphics {
  static type$: sys.Type
  color(): graphics.Color;
  color(it: graphics.Color): void;
  paint(): graphics.Paint;
  paint(it: graphics.Paint): void;
  alpha(): number;
  alpha(it: number): void;
  stroke(): graphics.Stroke;
  stroke(it: graphics.Stroke): void;
  font(): graphics.Font;
  font(it: graphics.Font): void;
  fillEllipse(x: number, y: number, w: number, h: number): this;
  fillRect(x: number, y: number, w: number, h: number): this;
  translate(x: number, y: number): this;
  pop(): this;
  path(): graphics.GraphicsPath;
  clipRoundRect(x: number, y: number, w: number, h: number, wArc: number, hArc: number): this;
  transform(t: graphics.Transform): this;
  drawRoundRect(x: number, y: number, w: number, h: number, wArc: number, hArc: number): this;
  drawEllipse(x: number, y: number, w: number, h: number): this;
  static make(g: [java]java.awt.Graphics2D, ...args: unknown[]): Java2DGraphics;
  fillRoundRect(x: number, y: number, w: number, h: number, wArc: number, hArc: number): this;
  clipRect(x: number, y: number, w: number, h: number): this;
  drawText(s: string, x: number, y: number): this;
  drawLine(x1: number, y1: number, x2: number, y2: number): this;
  push(r?: graphics.Rect | null): this;
  drawImage(img: graphics.Image, x: number, y: number, w?: number, h?: number): this;
  drawImageRegion(img: graphics.Image, src: graphics.Rect, dst: graphics.Rect): this;
  dispose(): void;
  metrics(): graphics.FontMetrics;
  drawRect(x: number, y: number, w: number, h: number): this;
}

export class Java2DFontMetrics extends graphics.FontMetrics {
  static type$: sys.Type
  leading(): number;
  descent(): number;
  ascent(): number;
  fmRef(): sys.Unsafe;
  height(): number;
  fm(): [java]java.awt.FontMetrics;
  width(s: string): number;
  static make(fm: [java]java.awt.FontMetrics, ...args: unknown[]): Java2DFontMetrics;
}

export class Java2DGraphicsPath extends sys.Obj implements graphics.GraphicsPath {
  static type$: sys.Type
  curveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): this;
  lineTo(x: number, y: number): this;
  draw(): this;
  fill(): this;
  arc(x: number, y: number, radius: number, start: number, sweep: number): this;
  quadTo(cpx: number, cpy: number, x: number, y: number): this;
  static make(g: [java]java.awt.Graphics2D, ...args: unknown[]): Java2DGraphicsPath;
  close(): this;
  clip(): this;
  moveTo(x: number, y: number): this;
}

