import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as web from './web.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as folio from './folio.js';
import * as hx from './hx.js';

export class HxApiWeb extends hx.HxLibWeb implements haystack.WebOpUtil {
  static type$: sys.Type
  lib(): hx.HxLib;
  ns(): haystack.Namespace;
  static make(lib: hx.HxLib, ...args: unknown[]): HxApiWeb;
  onService(): void;
  /**
   * Read a Haystack request grid as GET query params or POST
   * body. If there is any errors then send HTTP error code and
   * return null
   */
  doReadReq(req: web.WebReq, res: web.WebRes): haystack.Grid | null;
  /**
   * Get reader/writer options
   */
  ioOpts(filetype: haystack.Filetype, mime: sys.MimeType): haystack.Dict;
  /**
   * Write a Haystack response grid using content negotiation.
   */
  doWriteRes(req: web.WebReq, res: web.WebRes, result: haystack.Grid): void;
  acceptMimeType(req: web.WebReq): sys.MimeType | null;
  /**
   * Lookup filetype for the given mime type or null
   */
  toFiletype(mime: sys.MimeType): haystack.Filetype | null;
  doReadReqPost(req: web.WebReq, res: web.WebRes): haystack.Grid | null;
  doReadReqGet(req: web.WebReq, res: web.WebRes): haystack.Grid | null;
}

export class HxApiLib extends hx.HxLib {
  static type$: sys.Type
  web(): HxApiWeb;
  static make(...args: unknown[]): HxApiLib;
}

