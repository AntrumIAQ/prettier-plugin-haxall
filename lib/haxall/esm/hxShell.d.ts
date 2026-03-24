import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as graphics from './graphics.js';
import * as dom from './dom.js';
import * as domkit from './domkit.js';
import * as web from './web.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as hx from './hx.js';

export class HxShellLib extends hx.HxLib {
  static type$: sys.Type
  web(): HxShellWeb;
  static make(...args: unknown[]): HxShellLib;
}

export class ApiCallFuture extends sys.Obj {
  static type$: sys.Type
  onErr(f: ((arg0: haystack.Grid) => void)): this;
  onOk(f: ((arg0: haystack.Grid) => void)): this;
  static make(...args: unknown[]): ApiCallFuture;
}

export class HxShellWeb extends hx.HxLibWeb {
  static type$: sys.Type
  lib(): hx.HxLib;
  title(): string;
  favicon(): sys.Uri;
  static make(lib: hx.HxLib, ...args: unknown[]): HxShellWeb;
  onService(): void;
}

export class Session extends sys.Obj {
  static type$: sys.Type
  uri(): sys.Uri;
  attestKey(): string;
  user(): haystack.Dict;
  prepare(op: string): dom.HttpReq;
  call(op: string, req: haystack.Grid): ApiCallFuture;
  eval(expr: string): ApiCallFuture;
  static make(...args: unknown[]): Session;
}

