// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class WebReq extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#modBase = sys.Uri.fromStr("/");
    this.#stashRef = sys.Map.__fromLiteral(["web.startTime"], [sys.Duration.now()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    return;
  }

  typeof() { return WebReq.type$; }

  #mod = null;

  mod(it) {
    if (it === undefined) {
    }
    else {
    }
  }

  #modBase = null;

  modBase(it) {
    if (it === undefined) {
      return this.#modBase;
    }
    else {
      if (!it.isDir()) {
        throw sys.ArgErr.make("modBase must end in slash");
      }
      ;
      if (sys.ObjUtil.compareGT(it.path().size(), this.uri().path().size())) {
        throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("modBase (", it), ") is not slice of uri ("), this.uri()), ")"));
      }
      ;
      this.#modBase = it;
      this.#modRelVal = this.uri().getRange(sys.Range.make(it.path().size(), -1));
      return;
    }
  }

  #modRelVal = null;

  // private field reflection only
  __modRelVal(it) { if (it === undefined) return this.#modRelVal; else this.#modRelVal = it; }

  #stashRef = null;

  // private field reflection only
  __stashRef(it) { if (it === undefined) return this.#stashRef; else this.#stashRef = it; }

  #absUri$Store = undefined;

  // private field reflection only
  __absUri$Store(it) { if (it === undefined) return this.#absUri$Store; else this.#absUri$Store = it; }

  #locales$Store = undefined;

  // private field reflection only
  __locales$Store(it) { if (it === undefined) return this.#locales$Store; else this.#locales$Store = it; }

  #cookies$Store = undefined;

  // private field reflection only
  __cookies$Store(it) { if (it === undefined) return this.#cookies$Store; else this.#cookies$Store = it; }

  #form$Store = undefined;

  // private field reflection only
  __form$Store(it) { if (it === undefined) return this.#form$Store; else this.#form$Store = it; }

  absUri() {
    if (this.#absUri$Store === undefined) {
      this.#absUri$Store = this.absUri$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#absUri$Store, sys.Uri.type$);
  }

  modRel() {
    return sys.ObjUtil.coerce(((this$) => { let $_u0 = this$.#modRelVal; if ($_u0 != null) return $_u0; return this$.uri(); })(this), sys.Uri.type$);
  }

  locales() {
    if (this.#locales$Store === undefined) {
      this.#locales$Store = this.locales$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#locales$Store, sys.Type.find("sys::Locale[]"));
  }

  cookies() {
    if (this.#cookies$Store === undefined) {
      this.#cookies$Store = this.cookies$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#cookies$Store, sys.Type.find("[sys::Str:sys::Str]"));
  }

  form() {
    if (this.#form$Store === undefined) {
      this.#form$Store = this.form$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#form$Store, sys.Type.find("[sys::Str:sys::Str]?"));
  }

  stash() {
    return this.#stashRef;
  }

  parseMultiPartForm(cb) {
    const this$ = this;
    let mime = sys.MimeType.fromStr(sys.ObjUtil.coerce(this.headers().get("Content-Type"), sys.Str.type$));
    if (sys.ObjUtil.compareNE(mime.subType(), "form-data")) {
      throw sys.Err.make(sys.Str.plus("Invalid content-type: ", mime));
    }
    ;
    let boundary = ((this$) => { let $_u1 = mime.params().get("boundary"); if ($_u1 != null) return $_u1; throw sys.Err.make(sys.Str.plus("Missing boundary param: ", mime)); })(this);
    WebUtil.parseMultiPart(this.in(), sys.ObjUtil.coerce(boundary, sys.Str.type$), (partHeaders,partIn) => {
      let cd = ((this$) => { let $_u2 = partHeaders.get("Content-Disposition"); if ($_u2 != null) return $_u2; throw sys.Err.make("Multi-part missing Content-Disposition"); })(this$);
      let semi = ((this$) => { let $_u3 = sys.Str.index(cd, ";"); if ($_u3 != null) return $_u3; throw sys.Err.make(sys.Str.plus("Expected semicolon; Content-Disposition: ", cd)); })(this$);
      let params = sys.MimeType.parseParams(sys.Str.getRange(cd, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sys.Str.index(cd, ";"), sys.Int.type$), 1), -1)));
      let formName = ((this$) => { let $_u4 = params.get("name"); if ($_u4 != null) return $_u4; throw sys.Err.make(sys.Str.plus("Expected name param; Content-Disposition: ", cd)); })(this$);
      sys.Func.call(cb, sys.ObjUtil.coerce(formName, sys.Str.type$), partIn, partHeaders);
      try {
        partIn.skip(sys.Int.maxVal());
      }
      catch ($_u5) {
      }
      ;
      return;
    });
    return;
  }

  static make() {
    const $self = new WebReq();
    WebReq.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  absUri$Once() {
    let host = this.headers().get("Host");
    if (host == null) {
      throw sys.Err.make("Missing Host header");
    }
    ;
    return sys.Str.toUri(sys.Str.plus(sys.Str.plus("http://", host), "/")).plus(this.uri());
  }

  locales$Once() {
    const this$ = this;
    let list = sys.List.make(sys.Locale.type$);
    let hval = this.headers().get("Accept-Language");
    if (hval != null) {
      WebUtil.parseList(sys.ObjUtil.coerce(hval, sys.Str.type$)).each((val) => {
        try {
          let colon = sys.Str.index(val, ";q=");
          let qual = ((this$) => { if (colon == null) return sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Float.type$.toNullable()); return sys.Str.toFloat(sys.Str.getRange(val, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 3), -1))); })(this$);
          let lang = ((this$) => { if (colon == null) return val; return sys.Str.getRange(val, sys.Range.make(0, sys.ObjUtil.coerce(colon, sys.Int.type$), true)); })(this$);
          let loc = sys.Locale.fromStr(lang, false);
          if ((sys.ObjUtil.compareGT(qual, sys.Float.make(0.0)) && loc != null && !list.contains(sys.ObjUtil.coerce(loc, sys.Locale.type$)))) {
            list.add(sys.ObjUtil.coerce(loc, sys.Locale.type$));
          }
          ;
        }
        catch ($_u8) {
          $_u8 = sys.Err.make($_u8);
          if ($_u8 instanceof sys.Err) {
            let err = $_u8;
            ;
            err.trace();
          }
          else {
            throw $_u8;
          }
        }
        ;
        return;
      });
    }
    ;
    let en = sys.Locale.fromStr("en");
    if (!list.contains(sys.ObjUtil.coerce(en, sys.Locale.type$))) {
      list.add(sys.ObjUtil.coerce(en, sys.Locale.type$));
    }
    ;
    return list;
  }

  cookies$Once() {
    try {
      return sys.MimeType.parseParams(sys.ObjUtil.coerce(this.headers().get("Cookie", ""), sys.Str.type$)).ro();
    }
    catch ($_u9) {
      $_u9 = sys.Err.make($_u9);
      if ($_u9 instanceof sys.Err) {
        let e = $_u9;
        ;
        e.trace();
      }
      else {
        throw $_u9;
      }
    }
    ;
    return sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")).ro();
  }

  form$Once() {
    let ct = sys.Str.lower(this.headers().get("Content-Type", ""));
    if (sys.Str.startsWith(ct, "application/x-www-form-urlencoded")) {
      let len = this.headers().get("Content-Length");
      if (len == null) {
        throw sys.IOErr.make("Missing Content-Length header");
      }
      ;
      return sys.Uri.decodeQuery(sys.ObjUtil.coerce(this.in().readLine(sys.Str.toInt(len)), sys.Str.type$));
    }
    ;
    return null;
  }

}

class WebRes extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WebRes.type$; }

  #statusCode = 0;

  statusCode(it) {
    if (it === undefined) {
    }
    else {
    }
  }

  #statusPhrase = null;

  statusPhrase(it) {
    if (it === undefined) {
    }
    else {
    }
  }

  static #statusMsg = undefined;

  static statusMsg() {
    if (WebRes.#statusMsg === undefined) {
      WebRes.static$init();
      if (WebRes.#statusMsg === undefined) WebRes.#statusMsg = null;
    }
    return WebRes.#statusMsg;
  }

  removeCookie(name) {
    const this$ = this;
    this.cookies().add(Cookie.make(name, "", (it) => {
      it.__maxAge(sys.Duration.fromStr("0ns"));
      return;
    }));
    return;
  }

  static make() {
    const $self = new WebRes();
    WebRes.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    WebRes.#statusMsg = sys.ObjUtil.coerce(((this$) => { let $_u10 = sys.Map.__fromLiteral([sys.ObjUtil.coerce(100, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(101, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(200, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(201, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(202, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(203, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(204, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(205, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(206, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(300, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(301, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(302, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(303, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(304, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(305, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(307, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(401, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(402, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(403, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(404, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(405, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(406, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(407, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(408, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(409, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(410, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(411, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(412, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(413, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(414, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(415, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(416, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(417, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(429, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(500, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(501, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(502, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(503, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(504, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(505, sys.Obj.type$.toNullable())], ["Continue","Switching Protocols","OK","Created","Accepted","203 Non-Authoritative Information","No Content","Reset Content","Partial Content","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Request Entity Too Large","Request-URI Too Long","Unsupported Media Type","Requested Range Not Satisfiable","Expectation Failed","Too Many Requests","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported"], sys.Type.find("sys::Int"), sys.Type.find("sys::Str")); if ($_u10 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([sys.ObjUtil.coerce(100, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(101, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(200, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(201, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(202, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(203, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(204, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(205, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(206, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(300, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(301, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(302, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(303, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(304, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(305, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(307, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(401, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(402, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(403, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(404, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(405, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(406, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(407, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(408, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(409, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(410, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(411, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(412, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(413, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(414, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(415, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(416, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(417, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(429, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(500, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(501, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(502, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(503, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(504, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(505, sys.Obj.type$.toNullable())], ["Continue","Switching Protocols","OK","Created","Accepted","203 Non-Authoritative Information","No Content","Reset Content","Partial Content","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Request Entity Too Large","Request-URI Too Long","Unsupported Media Type","Requested Range Not Satisfiable","Expectation Failed","Too Many Requests","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported"], sys.Type.find("sys::Int"), sys.Type.find("sys::Str"))); })(this), sys.Type.find("[sys::Int:sys::Str]"));
    return;
  }

}

class WebOutStream extends sys.OutStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WebOutStream.type$; }

  #cssUris = null;

  // private field reflection only
  __cssUris(it) { if (it === undefined) return this.#cssUris; else this.#cssUris = it; }

  #jsUris = null;

  // private field reflection only
  __jsUris(it) { if (it === undefined) return this.#jsUris; else this.#jsUris = it; }

  static make(out) {
    const $self = new WebOutStream();
    WebOutStream.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    sys.OutStream.make$($self, out);
    return;
  }

  w(obj) {
    this.writeChars(((this$) => { if (obj == null) return "null"; return sys.ObjUtil.toStr(obj); })(this));
    return this;
  }

  tab(numSpaces) {
    if (numSpaces === undefined) numSpaces = 2;
    this.writeChars(sys.Str.spaces(numSpaces));
    return this;
  }

  nl() {
    this.writeChar(10);
    return this;
  }

  prolog() {
    this.writeChars(sys.Str.plus(sys.Str.plus("<?xml version='1.0' encoding='", this.charset()), "'?>\n"));
    return this;
  }

  tag(elemName,attrs,empty) {
    if (attrs === undefined) attrs = null;
    if (empty === undefined) empty = false;
    this.writeChar(60);
    this.writeChars(elemName);
    if (attrs != null) {
      sys.ObjUtil.coerce(this.writeChar(32), WebOutStream.type$).writeChars(sys.ObjUtil.coerce(attrs, sys.Str.type$));
    }
    ;
    if (empty) {
      this.writeChars(" /");
    }
    ;
    this.writeChar(62);
    return this;
  }

  tagEnd(elemName) {
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.writeChars("</"), WebOutStream.type$).writeChars(elemName), WebOutStream.type$).writeChar(62);
    return this;
  }

  docType() {
    this.writeChars("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"\n");
    this.writeChars(" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n");
    return this;
  }

  docType5() {
    this.writeChars("<!DOCTYPE html>\n");
    return this;
  }

  html() {
    return this.tag("html", "xmlns='http://www.w3.org/1999/xhtml'").nl();
  }

  htmlEnd() {
    return this.tagEnd("html").nl();
  }

  head() {
    return this.tag("head").nl();
  }

  headEnd() {
    return this.tagEnd("head").nl();
  }

  title(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("title", attrs);
  }

  titleEnd() {
    return this.tagEnd("title").nl();
  }

  includeCss(href) {
    if (this.#cssUris == null) {
      this.#cssUris = sys.List.make(sys.Uri.type$);
    }
    ;
    if (!this.#cssUris.contains(href)) {
      let attrs = sys.Str.plus(sys.Str.plus("rel='stylesheet' type='text/css' href='", sys.Str.toXml(href.encode())), "'");
      this.tag("link", attrs, true).nl();
      this.#cssUris.add(href);
    }
    ;
    return this;
  }

  includeJs(href) {
    if (href === undefined) href = null;
    if (this.#jsUris == null) {
      this.#jsUris = sys.List.make(sys.Uri.type$);
    }
    ;
    if (!this.#jsUris.contains(sys.ObjUtil.coerce(href, sys.Uri.type$))) {
      this.tag("script", sys.Str.plus(sys.Str.plus("type='text/javascript' src='", sys.Str.toXml(href.encode())), "'"));
      this.tagEnd("script").nl();
      this.#jsUris.add(sys.ObjUtil.coerce(href, sys.Uri.type$));
    }
    ;
    return this;
  }

  initJs(env) {
    const this$ = this;
    this.w("<script type='text/javascript'>").nl();
    this.w("globalThis.fan\$env = {").nl();
    env.keys().each((n,i) => {
      let v = env.get(n);
      this$.w(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", sys.Str.toCode(n)), ":"), sys.Str.toCode(v)));
      if (sys.ObjUtil.compareLT(i, sys.Int.minus(env.keys().size(), 1))) {
        this$.w(",");
      }
      ;
      this$.nl();
      return;
    });
    this.w("}").nl();
    let main = env.get("main");
    if (main != null) {
      if (WebJsMode.cur().isEs()) {
        this.w(sys.Str.plus(sys.Str.plus("window.addEventListener('load', function() {\n  fan.sys.Env.__invokeMain('", main), "');\n}, false);")).nl();
      }
      else {
        this.w(sys.Str.plus(sys.Str.plus("window.addEventListener('load', function() {\n  fan.sys.Env.\$invokeMain('", main), "');\n}, false);")).nl();
      }
      ;
    }
    ;
    this.w("</script>").nl();
    return this;
  }

  atom(href,attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag(sys.Str.plus(sys.Str.plus("link rel='alternate' type='application/atom+xml' href='", sys.Str.toXml(href.encode())), "'"), attrs, true).nl();
  }

  rss(href,attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag(sys.Str.plus(sys.Str.plus("link rel='alternate' type='application/rss+xml' href='", sys.Str.toXml(href.encode())), "'"), attrs, true).nl();
  }

  favIcon(href,attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag(sys.Str.plus(sys.Str.plus("link rel='icon' href='", sys.Str.toXml(href.encode())), "'"), attrs, true).nl();
  }

  style(attrs) {
    if (attrs === undefined) attrs = "type='text/css'";
    return this.tag("style", attrs).nl();
  }

  styleEnd() {
    return this.tagEnd("style").nl();
  }

  script(attrs) {
    if (attrs === undefined) attrs = "type='text/javascript'";
    return this.tag("script", attrs).nl();
  }

  scriptEnd() {
    return this.tagEnd("script").nl();
  }

  body(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("body", attrs).nl();
  }

  bodyEnd() {
    return this.tagEnd("body").nl();
  }

  h1(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("h1", attrs);
  }

  h1End() {
    return this.tagEnd("h1").nl();
  }

  h2(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("h2", attrs);
  }

  h2End() {
    return this.tagEnd("h2").nl();
  }

  h3(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("h3", attrs);
  }

  h3End() {
    return this.tagEnd("h3").nl();
  }

  h4(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("h4", attrs);
  }

  h4End() {
    return this.tagEnd("h4").nl();
  }

  h5(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("h5", attrs);
  }

  h5End() {
    return this.tagEnd("h5").nl();
  }

  h6(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("h6", attrs);
  }

  h6End() {
    return this.tagEnd("h6").nl();
  }

  div(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("div", attrs).nl();
  }

  divEnd() {
    return this.tagEnd("div").nl();
  }

  span(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("span", attrs);
  }

  spanEnd() {
    return this.tagEnd("span");
  }

  p(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("p", attrs).nl();
  }

  pEnd() {
    return this.tagEnd("p").nl();
  }

  b(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("b", attrs);
  }

  bEnd() {
    return this.tagEnd("b");
  }

  i(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("i", attrs);
  }

  iEnd() {
    return this.tagEnd("i");
  }

  em(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("em", attrs);
  }

  emEnd() {
    return this.tagEnd("em");
  }

  pre(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("pre", attrs);
  }

  preEnd() {
    return this.tagEnd("pre").nl();
  }

  code(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("code", attrs);
  }

  codeEnd() {
    return this.tagEnd("code");
  }

  hr(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("hr", attrs, true).nl();
  }

  br() {
    return this.tag("br", null, true);
  }

  a(href,attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag(sys.Str.plus(sys.Str.plus("a href='", sys.Str.toXml(href.encode())), "'"), attrs);
  }

  aEnd() {
    return this.tagEnd("a");
  }

  img(src,attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag(sys.Str.plus(sys.Str.plus("img src='", sys.Str.toXml(src.encode())), "'"), attrs, true);
  }

  table(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("table", attrs).nl();
  }

  tableEnd() {
    return this.tagEnd("table").nl();
  }

  thead(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("thead", attrs).nl();
  }

  theadEnd() {
    return this.tagEnd("thead").nl();
  }

  tbody(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("tbody", attrs).nl();
  }

  tbodyEnd() {
    return this.tagEnd("tbody").nl();
  }

  tfoot(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("tfoot", attrs).nl();
  }

  tfootEnd() {
    return this.tagEnd("tfoot").nl();
  }

  tr(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("tr", attrs).nl();
  }

  trEnd() {
    return this.tagEnd("tr").nl();
  }

  th(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("th", attrs);
  }

  thEnd() {
    return this.tagEnd("th").nl();
  }

  td(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("td", attrs);
  }

  tdEnd() {
    return this.tagEnd("td").nl();
  }

  ul(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("ul", attrs).nl();
  }

  ulEnd() {
    return this.tagEnd("ul").nl();
  }

  ol(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("ol", attrs).nl();
  }

  olEnd() {
    return this.tagEnd("ol").nl();
  }

  li(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("li", attrs);
  }

  liEnd() {
    return this.tagEnd("li");
  }

  dl(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("dl", attrs).nl();
  }

  dlEnd() {
    return this.tagEnd("dl").nl();
  }

  dt(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("dt", attrs).nl();
  }

  dtEnd() {
    return this.tagEnd("dt").nl();
  }

  dd(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("dd", attrs).nl();
  }

  ddEnd() {
    return this.tagEnd("dd").nl();
  }

  form(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("form", attrs).nl();
  }

  formEnd() {
    return this.tagEnd("form").nl();
  }

  label(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("label", attrs).nl();
  }

  labelEnd() {
    return this.tagEnd("label").nl();
  }

  input(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("input", attrs, true);
  }

  textField(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("input type='text'", attrs, true);
  }

  password(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("input type='password'", attrs, true);
  }

  hidden(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("input type='hidden'", attrs, true);
  }

  button(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("input type='button'", attrs, true);
  }

  checkbox(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("input type='checkbox'", attrs, true);
  }

  radio(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("input type='radio'", attrs, true);
  }

  submit(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("input type='submit'", attrs, true);
  }

  select(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("select", attrs).nl();
  }

  selectEnd() {
    return this.tagEnd("select").nl();
  }

  option(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("option", attrs);
  }

  optionEnd() {
    return this.tagEnd("option").nl();
  }

  textArea(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("textarea", attrs).nl();
  }

  textAreaEnd() {
    return this.tagEnd("textarea").nl();
  }

  header(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("header", attrs).nl();
  }

  headerEnd() {
    return this.tagEnd("header").nl();
  }

  footer(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("footer", attrs).nl();
  }

  footerEnd() {
    return this.tagEnd("footer").nl();
  }

  main(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("main", attrs).nl();
  }

  mainEnd() {
    return this.tagEnd("main").nl();
  }

  nav(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("nav", attrs).nl();
  }

  navEnd() {
    return this.tagEnd("nav").nl();
  }

  section(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("section", attrs).nl();
  }

  sectionEnd() {
    return this.tagEnd("section").nl();
  }

  article(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("article", attrs).nl();
  }

  articleEnd() {
    return this.tagEnd("article").nl();
  }

  aside(attrs) {
    if (attrs === undefined) attrs = null;
    return this.tag("aside", attrs).nl();
  }

  asideEnd() {
    return this.tagEnd("aside").nl();
  }

  esc(obj) {
    if (obj == null) {
      return this.w("null");
    }
    ;
    return sys.ObjUtil.coerce(this.writeXml(sys.ObjUtil.toStr(obj), sys.OutStream.xmlEscQuotes()), WebOutStream.type$);
  }

}

class Weblet {
  constructor() {
    const this$ = this;
  }

  typeof() { return Weblet.type$; }

  req() {
    try {
      return sys.ObjUtil.coerce(concurrent.Actor.locals().get("web.req"), WebReq.type$);
    }
    catch ($_u12) {
      $_u12 = sys.Err.make($_u12);
      if ($_u12 instanceof sys.NullErr) {
        let e = $_u12;
        ;
        throw sys.Err.make("No web request active in thread");
      }
      else {
        throw $_u12;
      }
    }
    ;
  }

  res() {
    try {
      return sys.ObjUtil.coerce(concurrent.Actor.locals().get("web.res"), WebRes.type$);
    }
    catch ($_u13) {
      $_u13 = sys.Err.make($_u13);
      if ($_u13 instanceof sys.NullErr) {
        let e = $_u13;
        ;
        throw sys.Err.make("No web request active in thread");
      }
      else {
        throw $_u13;
      }
    }
    ;
  }

  onService() {
    let $_u14 = this.req().method();
    if (sys.ObjUtil.equals($_u14, "GET")) {
      this.onGet();
    }
    else if (sys.ObjUtil.equals($_u14, "HEAD")) {
      this.onHead();
    }
    else if (sys.ObjUtil.equals($_u14, "POST")) {
      this.onPost();
    }
    else if (sys.ObjUtil.equals($_u14, "PUT")) {
      this.onPut();
    }
    else if (sys.ObjUtil.equals($_u14, "DELETE")) {
      this.onDelete();
    }
    else if (sys.ObjUtil.equals($_u14, "OPTIONS")) {
      this.onOptions();
    }
    else if (sys.ObjUtil.equals($_u14, "TRACE")) {
      this.onTrace();
    }
    else {
      this.res().sendErr(501);
    }
    ;
    return;
  }

  onGet() {
    this.res().sendErr(501);
    return;
  }

  onHead() {
    this.res().sendErr(501);
    return;
  }

  onPost() {
    this.res().sendErr(501);
    return;
  }

  onPut() {
    this.res().sendErr(501);
    return;
  }

  onDelete() {
    this.res().sendErr(501);
    return;
  }

  onOptions() {
    this.res().sendErr(501);
    return;
  }

  onTrace() {
    this.res().sendErr(501);
    return;
  }

}

class WebMod extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WebMod.type$; }

  res() { return Weblet.prototype.res.apply(this, arguments); }

  onPost() { return Weblet.prototype.onPost.apply(this, arguments); }

  onHead() { return Weblet.prototype.onHead.apply(this, arguments); }

  onDelete() { return Weblet.prototype.onDelete.apply(this, arguments); }

  onOptions() { return Weblet.prototype.onOptions.apply(this, arguments); }

  onGet() { return Weblet.prototype.onGet.apply(this, arguments); }

  onTrace() { return Weblet.prototype.onTrace.apply(this, arguments); }

  req() { return Weblet.prototype.req.apply(this, arguments); }

  onService() { return Weblet.prototype.onService.apply(this, arguments); }

  onPut() { return Weblet.prototype.onPut.apply(this, arguments); }

  onStart() {
    return;
  }

  onStop() {
    return;
  }

  makeResOut(out) {
    let cout = WebUtil.makeContentOutStream(this.res().headers(), out);
    if (cout == null) {
      return null;
    }
    ;
    return WebOutStream.make(sys.ObjUtil.coerce(cout, sys.OutStream.type$));
  }

  static make() {
    const $self = new WebMod();
    WebMod.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class FileWeblet extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FileWeblet.type$; }

  res() { return Weblet.prototype.res.apply(this, arguments); }

  onPost() { return Weblet.prototype.onPost.apply(this, arguments); }

  onHead() { return Weblet.prototype.onHead.apply(this, arguments); }

  onDelete() { return Weblet.prototype.onDelete.apply(this, arguments); }

  onOptions() { return Weblet.prototype.onOptions.apply(this, arguments); }

  onTrace() { return Weblet.prototype.onTrace.apply(this, arguments); }

  req() { return Weblet.prototype.req.apply(this, arguments); }

  onPut() { return Weblet.prototype.onPut.apply(this, arguments); }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #extraResHeaders = null;

  extraResHeaders(it) {
    if (it === undefined) {
      return this.#extraResHeaders;
    }
    else {
      this.#extraResHeaders = it;
      return;
    }
  }

  static make(file) {
    const $self = new FileWeblet();
    FileWeblet.make$($self,file);
    return $self;
  }

  static make$($self,file) {
    if (file.isDir()) {
      throw sys.ArgErr.make("FileWeblet cannot process dir");
    }
    ;
    $self.#file = file;
    return;
  }

  modified() {
    return this.#file.modified().floor(sys.Duration.fromStr("1sec"));
  }

  etag() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("\"", sys.Int.toHex(sys.ObjUtil.coerce(this.#file.size(), sys.Int.type$))), "-"), sys.Int.toHex(this.#file.modified().ticks())), "\"");
  }

  checkUnderDir(dir) {
    if (!dir.isDir()) {
      throw sys.ArgErr.make(sys.Str.plus("Not a directory: ", dir));
    }
    ;
    if (!sys.Str.startsWith(this.#file.normalize().pathStr(), dir.normalize().pathStr())) {
      this.res().sendErr(404);
    }
    ;
    return this;
  }

  onService() {
    if (this.res().isDone()) {
      return;
    }
    ;
    Weblet.prototype.onService.call(this);
    return;
  }

  onGet() {
    if (!this.#file.exists()) {
      this.res().sendErr(404);
      return;
    }
    ;
    this.res().headers().set("ETag", this.etag());
    this.res().headers().set("Last-Modified", this.modified().toHttpStr());
    if (this.#extraResHeaders != null) {
      this.res().headers().setAll(sys.ObjUtil.coerce(this.#extraResHeaders, sys.Type.find("[sys::Str:sys::Str]")));
    }
    ;
    if (this.checkNotModified()) {
      return;
    }
    ;
    let mime = this.#file.mimeType();
    if (mime != null) {
      this.res().headers().set("Content-Type", mime.toStr());
    }
    ;
    let ae = ((this$) => { let $_u15 = this$.req().headers().get("Accept-Encoding"); if ($_u15 != null) return $_u15; return ""; })(this);
    if ((FileWeblet.isGzipFile(this.#file) && sys.ObjUtil.compareGT(WebUtil.parseQVals(sys.ObjUtil.coerce(ae, sys.Str.type$)).get("gzip"), sys.Float.make(0.0)))) {
      this.res().statusCode(200);
      this.res().headers().set("Content-Encoding", "gzip");
      let out = sys.Zip.gzipOutStream(this.res().out());
      this.#file.in().pipe(out, this.#file.size());
      out.close();
      return;
    }
    ;
    this.res().statusCode(200);
    this.res().headers().set("Content-Length", sys.Int.toStr(sys.ObjUtil.coerce(this.#file.size(), sys.Int.type$)));
    this.#file.in().pipe(this.res().out(), this.#file.size());
    return;
  }

  static isGzipFile(file) {
    let mime = file.mimeType();
    if (mime == null) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(mime.mediaType(), "text")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(mime.mediaType(), "application")) {
      if (sys.ObjUtil.equals(mime.subType(), "json")) {
        return true;
      }
      ;
    }
    ;
    if (sys.ObjUtil.equals(mime.mediaType(), "image")) {
      if (sys.ObjUtil.equals(mime.subType(), "svg+xml")) {
        return true;
      }
      ;
    }
    ;
    return false;
  }

  checkNotModified() {
    return FileWeblet.doCheckNotModified(this.req(), this.res(), this.etag(), this.modified());
  }

  static doCheckNotModified(req,res,etag,modified) {
    const this$ = this;
    let matchNone = req.headers().get("If-None-Match");
    if (matchNone != null) {
      let match = WebUtil.parseList(sys.ObjUtil.coerce(matchNone, sys.Str.type$)).any((s) => {
        return (sys.ObjUtil.equals(s, etag) || sys.ObjUtil.equals(s, "*"));
      });
      if (match) {
        res.statusCode(304);
        return true;
      }
      ;
    }
    ;
    let since = req.headers().get("If-Modified-Since");
    if (since != null) {
      let sinceTime = sys.DateTime.fromHttpStr(sys.ObjUtil.coerce(since, sys.Str.type$), false);
      if (sys.ObjUtil.equals(modified, sinceTime)) {
        res.statusCode(304);
        return true;
      }
      ;
    }
    ;
    return false;
  }

}

class WebUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WebUtil.type$; }

  static #tokenChars = undefined;

  static tokenChars() {
    if (WebUtil.#tokenChars === undefined) {
      WebUtil.static$init();
      if (WebUtil.#tokenChars === undefined) WebUtil.#tokenChars = null;
    }
    return WebUtil.#tokenChars;
  }

  static #CR = undefined;

  static CR() {
    if (WebUtil.#CR === undefined) {
      WebUtil.static$init();
      if (WebUtil.#CR === undefined) WebUtil.#CR = 0;
    }
    return WebUtil.#CR;
  }

  static #LF = undefined;

  static LF() {
    if (WebUtil.#LF === undefined) {
      WebUtil.static$init();
      if (WebUtil.#LF === undefined) WebUtil.#LF = 0;
    }
    return WebUtil.#LF;
  }

  static #HT = undefined;

  static HT() {
    if (WebUtil.#HT === undefined) {
      WebUtil.static$init();
      if (WebUtil.#HT === undefined) WebUtil.#HT = 0;
    }
    return WebUtil.#HT;
  }

  static #SP = undefined;

  static SP() {
    if (WebUtil.#SP === undefined) {
      WebUtil.static$init();
      if (WebUtil.#SP === undefined) WebUtil.#SP = 0;
    }
    return WebUtil.#SP;
  }

  static #maxTokenSize = undefined;

  static maxTokenSize() {
    if (WebUtil.#maxTokenSize === undefined) {
      WebUtil.static$init();
      if (WebUtil.#maxTokenSize === undefined) WebUtil.#maxTokenSize = 0;
    }
    return WebUtil.#maxTokenSize;
  }

  static isToken(s) {
    const this$ = this;
    if (sys.Str.isEmpty(s)) {
      return false;
    }
    ;
    return sys.Str.all(s, (c) => {
      return WebUtil.isTokenChar(c);
    });
  }

  static isTokenChar(c) {
    return (sys.ObjUtil.compareLT(c, 127) && WebUtil.tokenChars().get(c));
  }

  static toQuotedStr(s) {
    const this$ = this;
    let buf = sys.StrBuf.make();
    buf.addChar(34);
    sys.Str.each(s, (c) => {
      if ((sys.ObjUtil.compareLT(c, 32) || sys.ObjUtil.compareGT(c, 126))) {
        throw sys.ArgErr.make(sys.Str.plus("Invalid quoted str chars: ", s));
      }
      ;
      if (sys.ObjUtil.equals(c, 34)) {
        buf.addChar(92);
      }
      ;
      buf.addChar(c);
      return;
    });
    buf.addChar(34);
    return buf.toStr();
  }

  static fromQuotedStr(s) {
    if ((sys.ObjUtil.compareLT(sys.Str.size(s), 2) || sys.ObjUtil.compareNE(sys.Str.get(s, 0), 34) || sys.ObjUtil.compareNE(sys.Str.get(s, -1), 34))) {
      throw sys.ArgErr.make(sys.Str.plus("Not quoted str: ", s));
    }
    ;
    return sys.Str.replace(sys.Str.getRange(s, sys.Range.make(1, -2)), "\\\"", "\"");
  }

  static parseList(s) {
    return sys.Str.split(s, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
  }

  static parseHeaders(in$) {
    return WebUtil.doParseHeaders(in$, null);
  }

  static doParseHeaders(in$,cookies) {
    let headers = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    headers.caseInsensitive(true);
    let last = null;
    while (true) {
      let peek = in$.peek();
      if (sys.ObjUtil.equals(peek, WebUtil.CR())) {
        break;
      }
      ;
      if ((sys.Int.isSpace(sys.ObjUtil.coerce(peek, sys.Int.type$)) && last != null)) {
        ((this$) => { let $_u18 = headers; let $_u19 = sys.ObjUtil.coerce(last, sys.Str.type$); let $_u16 = sys.Str.plus(headers.get(sys.ObjUtil.coerce(last, sys.Str.type$)), sys.Str.plus(" ", sys.Str.trim(WebUtil.readLine(in$)))); $_u18.set($_u19,$_u16);  return $_u16; })(this);
        continue;
      }
      ;
      let key = sys.Str.trim(WebUtil.token(in$, 58));
      let val = sys.Str.trim(WebUtil.token(in$, WebUtil.CR()));
      if (sys.ObjUtil.compareNE(in$.read(), WebUtil.LF())) {
        throw sys.ParseErr.make("Invalid CRLF line ending");
      }
      ;
      if ((sys.Str.equalsIgnoreCase(key, "Set-Cookie") && cookies != null)) {
        let cookie = Cookie.fromStr(val, false);
        if (cookie != null) {
          cookies.add(sys.ObjUtil.coerce(cookie, Cookie.type$));
        }
        ;
      }
      ;
      let dup = headers.get(key);
      if (dup == null) {
        headers.set(key, val);
      }
      else {
        headers.set(key, sys.Str.plus(sys.Str.plus(dup, ","), val));
      }
      ;
      (last = key);
    }
    ;
    if ((sys.ObjUtil.compareNE(in$.read(), WebUtil.CR()) || sys.ObjUtil.compareNE(in$.read(), WebUtil.LF()))) {
      throw sys.ParseErr.make("Invalid CRLF headers ending");
    }
    ;
    return headers;
  }

  static token(in$,sep) {
    const this$ = this;
    let tok = in$.readStrToken(sys.ObjUtil.coerce(WebUtil.maxTokenSize(), sys.Int.type$.toNullable()), (ch) => {
      return sys.ObjUtil.equals(ch, sep);
    });
    if (tok == null) {
      throw sys.IOErr.make("Unexpected end of stream");
    }
    ;
    if (sys.ObjUtil.compareGE(sys.Str.size(tok), WebUtil.maxTokenSize())) {
      throw sys.ParseErr.make("Token too big");
    }
    ;
    in$.read();
    return sys.ObjUtil.coerce(tok, sys.Str.type$);
  }

  static parseQVals(s) {
    const this$ = this;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Float"));
    map.def(sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Float.type$.toNullable()));
    sys.Str.split(s, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())).each((tok) => {
      if (sys.Str.isEmpty(tok)) {
        return;
      }
      ;
      let name = tok;
      let q = sys.Float.make(1.0);
      let x = sys.Str.index(tok, ";");
      if (x != null) {
        (name = sys.Str.trim(sys.Str.getRange(tok, sys.Range.make(0, sys.ObjUtil.coerce(x, sys.Int.type$), true))));
        let attrs = sys.Str.trim(sys.Str.getRange(tok, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(x, sys.Int.type$), 1), -1)));
        let qattr = sys.Str.index(attrs, "q=");
        if (qattr != null) {
          (q = sys.ObjUtil.coerce(((this$) => { let $_u20 = sys.Float.fromStr(sys.Str.getRange(attrs, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(qattr, sys.Int.type$), 2), -1)), false); if ($_u20 != null) return $_u20; return sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Float.type$.toNullable()); })(this$), sys.Float.type$));
        }
        ;
      }
      ;
      map.set(name, sys.ObjUtil.coerce(q, sys.Obj.type$.toNullable()));
      return;
    });
    return map;
  }

  static writeHeaders(out,headers) {
    const this$ = this;
    headers.each((v,k) => {
      if (sys.Str.containsChar(v, 10)) {
        (v = sys.Str.splitLines(v).join("\n "));
      }
      ;
      out.print(k).print(": ").print(v).print("\r\n");
      return;
    });
    return;
  }

  static headersToCharset(headers) {
    let ct = headers.get("Content-Type");
    if (ct != null) {
      let mime = sys.MimeType.fromStr(sys.ObjUtil.coerce(ct, sys.Str.type$), false);
      if (mime != null) {
        return mime.charset();
      }
      ;
    }
    ;
    return sys.Charset.utf8();
  }

  static makeContentInStream(headers,in$) {
    (in$ = sys.ObjUtil.coerce(WebUtil.doMakeContentInStream(headers, in$), sys.InStream.type$));
    let ce = headers.get("Content-Encoding");
    if (ce != null) {
      (ce = sys.Str.lower(ce));
      let $_u21 = ce;
      if (sys.ObjUtil.equals($_u21, "gzip")) {
        return sys.Zip.gzipInStream(in$);
      }
      else if (sys.ObjUtil.equals($_u21, "deflate")) {
        return sys.Zip.deflateInStream(in$);
      }
      else {
        throw sys.IOErr.make(sys.Str.plus("Unsupported Content-Encoding: ", ce));
      }
      ;
    }
    ;
    return in$;
  }

  static doMakeContentInStream(headers,in$) {
    const this$ = this;
    let cs = WebUtil.headersToCharset(headers);
    let len = headers.get("Content-Length");
    if (len != null) {
      return sys.ObjUtil.coerce(sys.ObjUtil.with(WebUtil.makeFixedInStream(in$, sys.ObjUtil.coerce(sys.Str.toInt(len), sys.Int.type$)), (it) => {
        it.charset(cs);
        return;
      }), sys.InStream.type$);
    }
    ;
    if (sys.Str.contains(sys.Str.lower(headers.get("Transfer-Encoding", "")), "chunked")) {
      return sys.ObjUtil.coerce(sys.ObjUtil.with(WebUtil.makeChunkedInStream(in$), (it) => {
        it.charset(cs);
        return;
      }), sys.InStream.type$);
    }
    ;
    return in$;
  }

  static makeContentOutStream(headers,out) {
    const this$ = this;
    let cs = WebUtil.headersToCharset(headers);
    let len = headers.get("Content-Length");
    if (len != null) {
      return sys.ObjUtil.coerce(sys.ObjUtil.with(WebUtil.makeFixedOutStream(out, sys.ObjUtil.coerce(sys.Str.toInt(len), sys.Int.type$)), (it) => {
        it.charset(cs);
        return;
      }), sys.OutStream.type$);
    }
    ;
    let ct = headers.get("Content-Type");
    if (ct != null) {
      headers.set("Transfer-Encoding", "chunked");
      return sys.ObjUtil.coerce(sys.ObjUtil.with(WebUtil.makeChunkedOutStream(out), (it) => {
        it.charset(cs);
        return;
      }), sys.OutStream.type$);
    }
    ;
    return null;
  }

  static makeFixedInStream(in$,fixed) {
    return ChunkInStream.make(in$, sys.ObjUtil.coerce(fixed, sys.Int.type$.toNullable()));
  }

  static makeChunkedInStream(in$) {
    return ChunkInStream.make(in$, null);
  }

  static makeFixedOutStream(out,fixed) {
    return FixedOutStream.make(out, fixed);
  }

  static makeChunkedOutStream(out) {
    return ChunkOutStream.make(out);
  }

  static readLine(in$) {
    let max = 65536;
    let line = in$.readLine(sys.ObjUtil.coerce(max, sys.Int.type$.toNullable()));
    if (line == null) {
      throw sys.IOErr.make("Unexpected end of stream");
    }
    ;
    if (sys.ObjUtil.equals(sys.Str.size(line), max)) {
      throw sys.IOErr.make("Max request line");
    }
    ;
    return sys.ObjUtil.coerce(line, sys.Str.type$);
  }

  static parseMultiPart(in$,boundary,cb) {
    (boundary = sys.Str.plus("--", boundary));
    let line = WebUtil.readLine(in$);
    if (sys.ObjUtil.equals(line, sys.Str.plus(boundary, "--"))) {
      return;
    }
    ;
    if (sys.ObjUtil.compareNE(line, boundary)) {
      throw sys.IOErr.make(sys.Str.plus("Expecting boundry line ", sys.Str.toCode(boundary)));
    }
    ;
    while (true) {
      let headers = WebUtil.parseHeaders(in$);
      let partIn = MultiPartInStream.make(in$, boundary);
      sys.Func.call(cb, headers, partIn);
      if (partIn.endOfParts()) {
        break;
      }
      ;
    }
    ;
    return;
  }

  static jsMain(out,main,env) {
    if (env === undefined) env = null;
    const this$ = this;
    let envStr = sys.StrBuf.make();
    if (sys.ObjUtil.compareGT(((this$) => { let $_u22 = env; if ($_u22 == null) return null; return env.size(); })(this), 0)) {
      envStr.add("var env = fan.sys.Map.make(fan.sys.Str.\$type, fan.sys.Str.\$type);\n");
      envStr.add("  env.caseInsensitive\$(true);\n");
      env.each((v,k) => {
        envStr.add("  ");
        (v = sys.Str.toCode(v, sys.ObjUtil.coerce(39, sys.Int.type$.toNullable())));
        if (sys.ObjUtil.equals(k, "sys.uriPodBase")) {
          envStr.add(sys.Str.plus(sys.Str.plus("fan.fwt.WidgetPeer.\$uriPodBase = ", v), ";\n"));
        }
        else {
          envStr.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("env.set('", k), "', "), v), ");\n"));
        }
        ;
        return;
      });
      envStr.add("  fan.sys.Env.cur().\$setVars(env);");
    }
    ;
    out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("<script type='text/javascript'>\nwindow.addEventListener('load', function()\n{\n  // inject env vars\n  ", envStr.toStr()), "\n\n  // find main\n  var qname = '"), main), "';\n  var dot = qname.indexOf('.');\n  if (dot < 0) qname += '.main';\n  var main = fan.sys.Slot.findMethod(qname);\n\n  // invoke main\n  if (main.isStatic()) main.call();\n  else main.callOn(main.parent().make());\n}, false);\n</script>"));
    return;
  }

  static make() {
    const $self = new WebUtil();
    WebUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    if (true) {
      let m = sys.List.make(sys.Bool.type$);
      for (let i = 0; sys.ObjUtil.compareLT(i, 127); i = sys.Int.increment(i)) {
        m.add(sys.ObjUtil.coerce(sys.ObjUtil.compareGT(i, 32), sys.Obj.type$.toNullable()));
      }
      ;
      m.set(40, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(41, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(60, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(62, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(64, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(44, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(59, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(58, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(92, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(34, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(47, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(91, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(93, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(63, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(61, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(123, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(125, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(32, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      m.set(9, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      WebUtil.#tokenChars = sys.ObjUtil.coerce(((this$) => { let $_u23 = m; if ($_u23 == null) return null; return sys.ObjUtil.toImmutable(m); })(this), sys.Type.find("sys::Bool[]"));
    }
    ;
    WebUtil.#CR = 13;
    WebUtil.#LF = 10;
    WebUtil.#HT = 9;
    WebUtil.#SP = 32;
    WebUtil.#maxTokenSize = 16384;
    return;
  }

}

class ChunkInStream extends sys.InStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ChunkInStream.type$; }

  #in = null;

  in(it) {
    if (it === undefined) {
      return this.#in;
    }
    else {
      this.#in = it;
      return;
    }
  }

  #noMoreChunks = false;

  noMoreChunks(it) {
    if (it === undefined) {
      return this.#noMoreChunks;
    }
    else {
      this.#noMoreChunks = it;
      return;
    }
  }

  #chunkRem = 0;

  chunkRem(it) {
    if (it === undefined) {
      return this.#chunkRem;
    }
    else {
      this.#chunkRem = it;
      return;
    }
  }

  #pushback = null;

  pushback(it) {
    if (it === undefined) {
      return this.#pushback;
    }
    else {
      this.#pushback = it;
      return;
    }
  }

  static make(in$,fixed) {
    const $self = new ChunkInStream();
    ChunkInStream.make$($self,in$,fixed);
    return $self;
  }

  static make$($self,in$,fixed) {
    if (fixed === undefined) fixed = null;
    sys.InStream.make$($self, null);
    $self.#in = in$;
    $self.#noMoreChunks = fixed != null;
    $self.#chunkRem = sys.ObjUtil.coerce(((this$) => { if (fixed != null) return fixed; return sys.ObjUtil.coerce(-1, sys.Int.type$.toNullable()); })($self), sys.Int.type$);
    return;
  }

  read() {
    if ((this.#pushback != null && !this.#pushback.isEmpty())) {
      return this.#pushback.pop();
    }
    ;
    if (!this.checkChunk()) {
      return null;
    }
    ;
    this.#chunkRem = sys.Int.minus(this.#chunkRem, 1);
    return this.#in.read();
  }

  readBuf(buf,n) {
    if ((this.#pushback != null && !this.#pushback.isEmpty() && sys.ObjUtil.compareGT(n, 0))) {
      buf.write(sys.ObjUtil.coerce(this.#pushback.pop(), sys.Int.type$));
      return sys.ObjUtil.coerce(1, sys.Int.type$.toNullable());
    }
    ;
    if (!this.checkChunk()) {
      return null;
    }
    ;
    let numRead = this.#in.readBuf(buf, sys.Int.min(this.#chunkRem, n));
    if (numRead != null) {
      this.#chunkRem = sys.Int.minus(this.#chunkRem, sys.ObjUtil.coerce(numRead, sys.Int.type$));
    }
    ;
    return numRead;
  }

  unread(b) {
    if (this.#pushback == null) {
      this.#pushback = sys.List.make(sys.Int.type$);
    }
    ;
    this.#pushback.push(sys.ObjUtil.coerce(b, sys.Obj.type$.toNullable()));
    return this;
  }

  checkChunk() {
    try {
      if (sys.ObjUtil.compareGT(this.#chunkRem, 0)) {
        return true;
      }
      ;
      if (this.#noMoreChunks) {
        return false;
      }
      ;
      if ((sys.ObjUtil.compareNE(this.#chunkRem, -1) && !sys.Str.isEmpty(WebUtil.readLine(this.#in)))) {
        throw sys.Err.make();
      }
      ;
      let line = WebUtil.readLine(this.#in);
      let semi = sys.Str.index(line, ";");
      if (semi != null) {
        (line = sys.Str.getRange(line, sys.Range.make(0, sys.ObjUtil.coerce(semi, sys.Int.type$))));
      }
      ;
      this.#chunkRem = sys.ObjUtil.coerce(sys.Str.toInt(sys.Str.trim(line), 16), sys.Int.type$);
      if (sys.ObjUtil.compareGT(this.#chunkRem, 0)) {
        return true;
      }
      ;
      this.#noMoreChunks = true;
      WebUtil.parseHeaders(this.#in);
      return false;
    }
    catch ($_u25) {
      $_u25 = sys.Err.make($_u25);
      if ($_u25 instanceof sys.Err) {
        let e = $_u25;
        ;
        throw sys.IOErr.make("Invalid format for HTTP chunked transfer encoding");
      }
      else {
        throw $_u25;
      }
    }
    ;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(this)), " { noMoreChunks="), sys.ObjUtil.coerce(this.#noMoreChunks, sys.Obj.type$.toNullable())), " chunkRem="), sys.ObjUtil.coerce(this.#chunkRem, sys.Obj.type$.toNullable())), " pushback="), this.#pushback), " }");
  }

}

class FixedOutStream extends sys.OutStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FixedOutStream.type$; }

  #out = null;

  out(it) {
    if (it === undefined) {
      return this.#out;
    }
    else {
      this.#out = it;
      return;
    }
  }

  #fixed = null;

  fixed(it) {
    if (it === undefined) {
      return this.#fixed;
    }
    else {
      this.#fixed = it;
      return;
    }
  }

  #written = 0;

  written(it) {
    if (it === undefined) {
      return this.#written;
    }
    else {
      this.#written = it;
      return;
    }
  }

  static make(out,fixed) {
    const $self = new FixedOutStream();
    FixedOutStream.make$($self,out,fixed);
    return $self;
  }

  static make$($self,out,fixed) {
    sys.OutStream.make$($self, null);
    $self.#out = out;
    $self.#fixed = sys.ObjUtil.coerce(fixed, sys.Int.type$.toNullable());
    return;
  }

  write(b) {
    this.checkChunk(1);
    this.#out.write(b);
    return this;
  }

  writeBuf(buf,n) {
    if (n === undefined) n = buf.remaining();
    this.checkChunk(n);
    this.#out.writeBuf(buf, n);
    return this;
  }

  flush() {
    this.#out.flush();
    return this;
  }

  close() {
    try {
      this.flush();
      return true;
    }
    catch ($_u26) {
      $_u26 = sys.Err.make($_u26);
      if ($_u26 instanceof sys.Err) {
        let e = $_u26;
        ;
        return false;
      }
      else {
        throw $_u26;
      }
    }
    ;
  }

  checkChunk(n) {
    this.#written = sys.Int.plus(this.#written, n);
    if (sys.ObjUtil.compareGT(this.#written, this.#fixed)) {
      throw sys.IOErr.make(sys.Str.plus("Attempt to write more than Content-Length: ", sys.ObjUtil.coerce(this.#fixed, sys.Obj.type$.toNullable())));
    }
    ;
    return;
  }

}

class ChunkOutStream extends sys.OutStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ChunkOutStream.type$; }

  static #chunkSize = undefined;

  static chunkSize() {
    if (ChunkOutStream.#chunkSize === undefined) {
      ChunkOutStream.static$init();
      if (ChunkOutStream.#chunkSize === undefined) ChunkOutStream.#chunkSize = 0;
    }
    return ChunkOutStream.#chunkSize;
  }

  #out = null;

  out(it) {
    if (it === undefined) {
      return this.#out;
    }
    else {
      this.#out = it;
      return;
    }
  }

  #buffer = null;

  buffer(it) {
    if (it === undefined) {
      return this.#buffer;
    }
    else {
      this.#buffer = it;
      return;
    }
  }

  #closed = false;

  closed(it) {
    if (it === undefined) {
      return this.#closed;
    }
    else {
      this.#closed = it;
      return;
    }
  }

  static make(out) {
    const $self = new ChunkOutStream();
    ChunkOutStream.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    sys.OutStream.make$($self, null);
    $self.#out = out;
    $self.#buffer = sys.Buf.make(sys.Int.plus(ChunkOutStream.chunkSize(), 256));
    return;
  }

  write(b) {
    this.#buffer.write(b);
    this.checkChunk();
    return this;
  }

  writeBuf(buf,n) {
    if (n === undefined) n = buf.remaining();
    this.#buffer.writeBuf(buf, n);
    this.checkChunk();
    return this;
  }

  flush() {
    if (this.#closed) {
      throw sys.IOErr.make("ChunkOutStream is closed");
    }
    ;
    if (sys.ObjUtil.compareGT(this.#buffer.size(), 0)) {
      this.#out.print(sys.Int.toHex(this.#buffer.size())).print("\r\n");
      this.#out.writeBuf(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.#buffer.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$), this.#buffer.remaining());
      this.#out.print("\r\n").flush();
      this.#buffer.clear();
    }
    ;
    return this;
  }

  close() {
    if (this.#closed) {
      return true;
    }
    ;
    try {
      this.flush();
      this.#closed = true;
      this.#out.print("0\r\n\r\n").flush();
      return true;
    }
    catch ($_u27) {
      return false;
    }
    ;
  }

  checkChunk() {
    if (sys.ObjUtil.compareGE(this.#buffer.size(), ChunkOutStream.chunkSize())) {
      this.flush();
    }
    ;
    return;
  }

  static static$init() {
    ChunkOutStream.#chunkSize = 1024;
    return;
  }

}

class MultiPartInStream extends sys.InStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MultiPartInStream.type$; }

  #in = null;

  in(it) {
    if (it === undefined) {
      return this.#in;
    }
    else {
      this.#in = it;
      return;
    }
  }

  #boundary = null;

  boundary(it) {
    if (it === undefined) {
      return this.#boundary;
    }
    else {
      this.#boundary = it;
      return;
    }
  }

  #curLine = null;

  curLine(it) {
    if (it === undefined) {
      return this.#curLine;
    }
    else {
      this.#curLine = it;
      return;
    }
  }

  #pushback = null;

  pushback(it) {
    if (it === undefined) {
      return this.#pushback;
    }
    else {
      this.#pushback = it;
      return;
    }
  }

  #endOfPart = false;

  endOfPart(it) {
    if (it === undefined) {
      return this.#endOfPart;
    }
    else {
      this.#endOfPart = it;
      return;
    }
  }

  #endOfParts = false;

  endOfParts(it) {
    if (it === undefined) {
      return this.#endOfParts;
    }
    else {
      this.#endOfParts = it;
      return;
    }
  }

  #numRead = 0;

  numRead(it) {
    if (it === undefined) {
      return this.#numRead;
    }
    else {
      this.#numRead = it;
      return;
    }
  }

  static make(in$,boundary) {
    const $self = new MultiPartInStream();
    MultiPartInStream.make$($self,in$,boundary);
    return $self;
  }

  static make$($self,in$,boundary) {
    sys.InStream.make$($self, null);
    $self.#in = in$;
    $self.#boundary = boundary;
    $self.#curLine = sys.ObjUtil.coerce(sys.Buf.make(1024), sys.Buf.type$);
    return;
  }

  read() {
    if ((this.#pushback != null && !this.#pushback.isEmpty())) {
      return this.#pushback.pop();
    }
    ;
    if (!this.checkLine()) {
      return null;
    }
    ;
    this.#numRead = sys.Int.plus(this.#numRead, 1);
    return this.#curLine.read();
  }

  readBuf(buf,n) {
    if ((this.#pushback != null && !this.#pushback.isEmpty() && sys.ObjUtil.compareGT(n, 0))) {
      buf.write(sys.ObjUtil.coerce(this.#pushback.pop(), sys.Int.type$));
      this.#numRead = sys.Int.plus(this.#numRead, 1);
      return sys.ObjUtil.coerce(1, sys.Int.type$.toNullable());
    }
    ;
    if (!this.checkLine()) {
      return null;
    }
    ;
    let actualRead = this.#curLine.readBuf(buf, n);
    this.#numRead = sys.Int.plus(this.#numRead, sys.ObjUtil.coerce(actualRead, sys.Int.type$));
    return actualRead;
  }

  unread(b) {
    if (this.#pushback == null) {
      this.#pushback = sys.List.make(sys.Int.type$);
    }
    ;
    this.#pushback.push(sys.ObjUtil.coerce(b, sys.Obj.type$.toNullable()));
    this.#numRead = sys.Int.minus(this.#numRead, 1);
    return this;
  }

  checkLine() {
    if (sys.ObjUtil.compareGT(this.#curLine.remaining(), 0)) {
      return true;
    }
    ;
    if (this.#endOfPart) {
      return false;
    }
    ;
    this.#curLine.clear();
    while (true) {
      let c = this.#in.readU1();
      this.#curLine.write(c);
      if (sys.ObjUtil.equals(c, 13)) {
        continue;
      }
      ;
      if (sys.ObjUtil.compareGE(this.#curLine.size(), 1024)) {
        break;
      }
      ;
      if (sys.ObjUtil.equals(c, 10)) {
        break;
      }
      ;
    }
    ;
    if ((sys.ObjUtil.compareLT(this.#curLine.size(), 2) || sys.ObjUtil.compareNE(this.#curLine.get(-2), 13))) {
      this.#curLine.seek(0);
      return true;
    }
    ;
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(this.#boundary)); i = sys.Int.increment(i)) {
      let c = this.#in.readU1();
      if (sys.ObjUtil.compareNE(c, sys.Str.get(this.#boundary, i))) {
        if (sys.ObjUtil.equals(c, 13)) {
          this.#in.unread(c);
        }
        else {
          this.#curLine.write(c);
        }
        ;
        this.#curLine.seek(0);
        return true;
      }
      ;
      this.#curLine.write(c);
    }
    ;
    this.#curLine.size(sys.Int.minus(sys.Int.minus(this.#curLine.size(), sys.Str.size(this.#boundary)), 2));
    let c1 = this.#in.readU1();
    let c2 = this.#in.readU1();
    if ((sys.ObjUtil.equals(c1, 45) && sys.ObjUtil.equals(c2, 45))) {
      this.#endOfParts = true;
      (c1 = this.#in.readU1());
      (c2 = this.#in.readU1());
    }
    ;
    if ((sys.ObjUtil.compareNE(c1, 13) || sys.ObjUtil.compareNE(c2, 10))) {
      throw sys.IOErr.make(sys.Str.plus("Fishy boundary ", sys.Str.toCode(sys.Str.plus(sys.Int.toChar(c1), sys.Int.toChar(c2)), sys.ObjUtil.coerce(34, sys.Int.type$.toNullable()), true)));
    }
    ;
    this.#endOfPart = true;
    this.#curLine.seek(0);
    return sys.ObjUtil.compareGT(this.#curLine.size(), 0);
  }

}

class WebSocket extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WebSocket.type$; }

  static #opContinue = undefined;

  static opContinue() {
    if (WebSocket.#opContinue === undefined) {
      WebSocket.static$init();
      if (WebSocket.#opContinue === undefined) WebSocket.#opContinue = 0;
    }
    return WebSocket.#opContinue;
  }

  static #opText = undefined;

  static opText() {
    if (WebSocket.#opText === undefined) {
      WebSocket.static$init();
      if (WebSocket.#opText === undefined) WebSocket.#opText = 0;
    }
    return WebSocket.#opText;
  }

  static #opBinary = undefined;

  static opBinary() {
    if (WebSocket.#opBinary === undefined) {
      WebSocket.static$init();
      if (WebSocket.#opBinary === undefined) WebSocket.#opBinary = 0;
    }
    return WebSocket.#opBinary;
  }

  static #opClose = undefined;

  static opClose() {
    if (WebSocket.#opClose === undefined) {
      WebSocket.static$init();
      if (WebSocket.#opClose === undefined) WebSocket.#opClose = 0;
    }
    return WebSocket.#opClose;
  }

  static #opPing = undefined;

  static opPing() {
    if (WebSocket.#opPing === undefined) {
      WebSocket.static$init();
      if (WebSocket.#opPing === undefined) WebSocket.#opPing = 0;
    }
    return WebSocket.#opPing;
  }

  static #opPong = undefined;

  static opPong() {
    if (WebSocket.#opPong === undefined) {
      WebSocket.static$init();
      if (WebSocket.#opPong === undefined) WebSocket.#opPong = 0;
    }
    return WebSocket.#opPong;
  }

  static #receiveAgain = undefined;

  static receiveAgain() {
    if (WebSocket.#receiveAgain === undefined) {
      WebSocket.static$init();
      if (WebSocket.#receiveAgain === undefined) WebSocket.#receiveAgain = null;
    }
    return WebSocket.#receiveAgain;
  }

  #socket = null;

  // private field reflection only
  __socket(it) { if (it === undefined) return this.#socket; else this.#socket = it; }

  #maskOnSend = false;

  // private field reflection only
  __maskOnSend(it) { if (it === undefined) return this.#maskOnSend; else this.#maskOnSend = it; }

  #closed = false;

  // private field reflection only
  __closed(it) { if (it === undefined) return this.#closed; else this.#closed = it; }

  static openClient(uri,headers) {
    if (headers === undefined) headers = null;
    let scheme = uri.scheme();
    if ((sys.ObjUtil.compareNE(scheme, "ws") && sys.ObjUtil.compareNE(scheme, "wss"))) {
      throw sys.ArgErr.make(sys.Str.plus("Unsupported scheme: ", scheme));
    }
    ;
    let httpUri = sys.Str.toUri(sys.Str.plus("http", sys.Str.getRange(uri.toStr(), sys.Range.make(2, -1))));
    let key = sys.Buf.random(16).toBase64();
    let c = WebClient.make(httpUri);
    c.reqMethod("GET");
    c.reqHeaders().set("Upgrade", "websocket");
    c.reqHeaders().set("Connection", "Upgrade");
    c.reqHeaders().set("Sec-WebSocket-Key", key);
    c.reqHeaders().set("Sec-WebSocket-Version", "13");
    if (headers != null) {
      c.reqHeaders().addAll(sys.ObjUtil.coerce(headers, sys.Type.find("[sys::Str:sys::Str]")));
    }
    ;
    c.writeReq();
    c.readRes();
    if (sys.ObjUtil.compareNE(c.resCode(), 101)) {
      throw WebSocket.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Bad HTTP response ", sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable())), " "), c.resPhrase()));
    }
    ;
    WebSocket.checkHeader(c.resHeaders(), "Upgrade", "websocket");
    WebSocket.checkHeader(c.resHeaders(), "Connection", "upgrade");
    let digest = WebSocket.checkHeader(c.resHeaders(), "Sec-WebSocket-Accept", null);
    if (sys.ObjUtil.compareNE(WebSocket.secDigest(key), digest)) {
      throw WebSocket.err("Mismatch Sec-WebSocket-Accept");
    }
    ;
    return WebSocket.make(sys.ObjUtil.coerce(c.socket(), inet.TcpSocket.type$), true);
  }

  static openServer(req,res) {
    if (sys.ObjUtil.compareNE(req.method(), "GET")) {
      throw WebSocket.err("Invalid method");
    }
    ;
    WebSocket.checkHeader(req.headers(), "Upgrade", "websocket");
    WebSocket.checkHeader(req.headers(), "Connection", "upgrade");
    let key = WebSocket.checkHeader(req.headers(), "Sec-WebSocket-Key", null);
    res.headers().set("Upgrade", "websocket");
    res.headers().set("Connection", "Upgrade");
    res.headers().set("Sec-WebSocket-Accept", WebSocket.secDigest(key));
    if (res.headers().get("Sec-WebSocket-Protocol") == null) {
      res.headers().addNotNull("Sec-WebSocket-Protocol", req.headers().get("Sec-WebSocket-Protocol"));
    }
    ;
    let socket = res.upgrade(101);
    return WebSocket.make(socket, false);
  }

  static checkHeader(headers,name,expected) {
    let val = ((this$) => { let $_u28 = headers.get(name); if ($_u28 != null) return $_u28; throw WebSocket.err(sys.Str.plus(sys.Str.plus("Missing ", name), " header")); })(this);
    if ((expected != null && sys.Str.indexIgnoreCase(val, sys.ObjUtil.coerce(expected, sys.Str.type$)) == null)) {
      throw WebSocket.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid ", name), " header: "), val));
    }
    ;
    return sys.ObjUtil.coerce(val, sys.Str.type$);
  }

  static make(socket,maskOnSend) {
    const $self = new WebSocket();
    WebSocket.make$($self,socket,maskOnSend);
    return $self;
  }

  static make$($self,socket,maskOnSend) {
    $self.#socket = socket;
    $self.#maskOnSend = maskOnSend;
    return;
  }

  socketOptions() {
    return this.#socket.options();
  }

  isClosed() {
    return this.#closed;
  }

  receive() {
    return this.receiveBuf(null);
  }

  receiveBuf(buf) {
    while (true) {
      let msg = this.doReceive(buf);
      if (msg === WebSocket.receiveAgain()) {
        continue;
      }
      ;
      return msg;
    }
    ;
    throw sys.Err.make();
  }

  doReceive(payload) {
    let in$ = this.#socket.in();
    let firstByte = in$.readU1();
    let byte = firstByte;
    let fin = sys.ObjUtil.compareGT(sys.Int.and(byte, 128), 0);
    let op = sys.Int.and(byte, 15);
    (byte = in$.readU1());
    let masked = sys.ObjUtil.compareGT(sys.Int.and(byte, 128), 0);
    let len = sys.Int.and(byte, 127);
    if (sys.ObjUtil.equals(len, 126)) {
      (len = in$.readU2());
    }
    else {
      if (sys.ObjUtil.equals(len, 127)) {
        (len = in$.readS8());
      }
      ;
    }
    ;
    let maskKey = ((this$) => { if (masked) return in$.readBufFully(null, 4); return null; })(this);
    (payload = in$.readBufFully(payload, len));
    if (!fin) {
      throw sys.Err.make("Fragmentation not supported yet!");
    }
    ;
    if (masked) {
      for (let i = 0; sys.ObjUtil.compareLT(i, len); i = sys.Int.increment(i)) {
        payload.set(i, sys.Int.xor(payload.get(i), maskKey.get(sys.Int.mod(i, 4))));
      }
      ;
    }
    ;
    let $_u30 = op;
    if (sys.ObjUtil.equals($_u30, WebSocket.opClose())) {
      this.close();
      throw sys.IOErr.make("WebSocket closed");
    }
    else if (sys.ObjUtil.equals($_u30, WebSocket.opPing())) {
      this.pong(sys.ObjUtil.coerce(payload, sys.Buf.type$));
      return WebSocket.receiveAgain();
    }
    else if (sys.ObjUtil.equals($_u30, WebSocket.opPong())) {
      return WebSocket.receiveAgain();
    }
    else if (sys.ObjUtil.equals($_u30, WebSocket.opText())) {
      return payload.readAllStr();
    }
    else if (sys.ObjUtil.equals($_u30, WebSocket.opBinary())) {
      return payload;
    }
    ;
    throw sys.Err.make(sys.Str.plus("Unsuppored opcode: ", sys.ObjUtil.coerce(op, sys.Obj.type$.toNullable())));
  }

  send(msg) {
    let binary = sys.ObjUtil.is(msg, sys.Buf.type$);
    let op = ((this$) => { if (binary) return WebSocket.opBinary(); return WebSocket.opText(); })(this);
    let payload = ((this$) => { if (binary) return sys.ObjUtil.coerce(msg, sys.Buf.type$); return sys.ObjUtil.coerce(sys.Buf.make().print(sys.ObjUtil.coerce(msg, sys.Str.type$)), sys.Buf.type$.toNullable()); })(this);
    this.doSend(op, sys.ObjUtil.coerce(payload, sys.Buf.type$));
    return;
  }

  ping() {
    this.doSend(WebSocket.opPing(), sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print(sys.Str.plus("ping ", sys.Int.toHex(sys.Int.random()))), sys.Buf.type$.toNullable()), sys.Buf.type$));
    return;
  }

  pong(echo) {
    this.doSend(WebSocket.opPong(), echo);
    return;
  }

  doSend(op,payload) {
    if (this.#closed) {
      throw sys.IOErr.make("WebSocket closed");
    }
    ;
    let len = payload.size();
    let maskKey = sys.Buf.random(4);
    let out = this.#socket.out();
    out.write(sys.Int.or(128, op));
    let mask = ((this$) => { if (this$.#maskOnSend) return 128; return 0; })(this);
    if (sys.ObjUtil.compareLT(len, 126)) {
      out.write(sys.Int.or(mask, len));
    }
    else {
      if (sys.ObjUtil.compareLT(len, 65535)) {
        out.write(sys.Int.or(mask, 126)).writeI2(len);
      }
      else {
        out.write(sys.Int.or(mask, 127)).writeI8(len);
      }
      ;
    }
    ;
    if (this.#maskOnSend) {
      out.writeBuf(maskKey);
      for (let i = 0; sys.ObjUtil.compareLT(i, len); i = sys.Int.increment(i)) {
        out.write(sys.Int.xor(payload.get(i), maskKey.get(sys.Int.mod(i, 4))));
      }
      ;
    }
    else {
      if (!sys.ObjUtil.isImmutable(payload)) {
        payload.seek(0);
      }
      ;
      out.writeBuf(payload);
    }
    ;
    out.flush();
    return;
  }

  close() {
    if (this.#closed) {
      return false;
    }
    ;
    try {
      this.doSend(WebSocket.opClose(), sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$));
    }
    catch ($_u34) {
      $_u34 = sys.Err.make($_u34);
      if ($_u34 instanceof sys.Err) {
        let e = $_u34;
        ;
      }
      else {
        throw $_u34;
      }
    }
    ;
    this.#closed = true;
    return this.#socket.close();
  }

  static err(msg) {
    return sys.IOErr.make(msg);
  }

  static secDigest(key) {
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print(key), sys.Buf.type$.toNullable()).print("258EAFA5-E914-47DA-95CA-C5AB0DC85B11"), sys.Buf.type$.toNullable()).toDigest("SHA-1").toBase64();
  }

  static static$init() {
    WebSocket.#opContinue = 0;
    WebSocket.#opText = 1;
    WebSocket.#opBinary = 2;
    WebSocket.#opClose = 8;
    WebSocket.#opPing = 9;
    WebSocket.#opPong = 10;
    WebSocket.#receiveAgain = sys.ObjUtil.coerce(((this$) => { let $_u35 = sys.List.make(sys.Str.type$, ["receiveAgain"]); if ($_u35 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$, ["receiveAgain"])); })(this), sys.Type.find("sys::List"));
    return;
  }

}

class FilePack extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#uriRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return FilePack.type$; }

  res() { return Weblet.prototype.res.apply(this, arguments); }

  onPost() { return Weblet.prototype.onPost.apply(this, arguments); }

  onHead() { return Weblet.prototype.onHead.apply(this, arguments); }

  onDelete() { return Weblet.prototype.onDelete.apply(this, arguments); }

  onOptions() { return Weblet.prototype.onOptions.apply(this, arguments); }

  onTrace() { return Weblet.prototype.onTrace.apply(this, arguments); }

  req() { return Weblet.prototype.req.apply(this, arguments); }

  onService() { return Weblet.prototype.onService.apply(this, arguments); }

  onPut() { return Weblet.prototype.onPut.apply(this, arguments); }

  #buf = null;

  buf() { return this.#buf; }

  __buf(it) { if (it === undefined) return this.#buf; else this.#buf = it; }

  #etag = null;

  etag() { return this.#etag; }

  __etag(it) { if (it === undefined) return this.#etag; else this.#etag = it; }

  #modified = null;

  modified() { return this.#modified; }

  __modified(it) { if (it === undefined) return this.#modified; else this.#modified = it; }

  #mimeType = null;

  mimeType() { return this.#mimeType; }

  __mimeType(it) { if (it === undefined) return this.#mimeType; else this.#mimeType = it; }

  #uri = null;

  uri(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(((this$) => { let $_u36 = this$.#uriRef.val(); if ($_u36 != null) return $_u36; throw sys.Err.make("No uri configured"); })(this), sys.Uri.type$);
    }
    else {
      this.#uriRef.val(it);
      return;
    }
  }

  #uriRef = null;

  // private field reflection only
  __uriRef(it) { if (it === undefined) return this.#uriRef; else this.#uriRef = it; }

  static makeFiles(files,mimeType) {
    if (mimeType === undefined) mimeType = null;
    const this$ = this;
    let totalSize = 0;
    files.each((f) => {
      totalSize = sys.Int.plus(totalSize, sys.ObjUtil.coerce(((this$) => { let $_u37 = f.size(); if ($_u37 != null) return $_u37; return sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()); })(this$), sys.Int.type$));
      return;
    });
    let buf = sys.Buf.make(sys.Int.div(totalSize, 4));
    if (mimeType == null) {
      (mimeType = ((this$) => { let $_u38 = files.get(0).mimeType(); if ($_u38 != null) return $_u38; throw sys.Err.make(sys.Str.plus("Ext to mimeType: ", files.first())); })(this));
    }
    ;
    let out = sys.Zip.gzipOutStream(buf.out());
    FilePack.pack(files, out).close();
    return FilePack.make(sys.ObjUtil.coerce(buf, sys.Buf.type$), sys.ObjUtil.coerce(mimeType, sys.MimeType.type$));
  }

  static make(buf,mimeType) {
    const $self = new FilePack();
    FilePack.make$($self,buf,mimeType);
    return $self;
  }

  static make$($self,buf,mimeType) {
    ;
    (buf = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(buf.trim()), sys.Buf.type$));
    $self.#buf = sys.ObjUtil.coerce(((this$) => { let $_u39 = buf; if ($_u39 == null) return null; return sys.ObjUtil.toImmutable(buf); })($self), sys.Buf.type$);
    $self.#etag = buf.toDigest("SHA-1").toBase64Uri();
    $self.#modified = sys.DateTime.now();
    $self.#mimeType = mimeType;
    return;
  }

  onGet() {
    if (this.res().isDone()) {
      return;
    }
    ;
    if (sys.ObjUtil.compareNE(this.req().method(), "GET")) {
      return this.res().sendErr(501);
    }
    ;
    this.res().headers().set("ETag", this.#etag);
    this.res().headers().set("Last-Modified", this.#modified.toHttpStr());
    if (FileWeblet.doCheckNotModified(this.req(), this.res(), this.#etag, this.#modified)) {
      return;
    }
    ;
    this.res().statusCode(200);
    this.res().headers().set("Content-Encoding", "gzip");
    this.res().headers().set("Content-Type", this.#mimeType.toStr());
    this.res().headers().set("Content-Length", sys.Int.toStr(this.#buf.size()));
    sys.ObjUtil.coerce(this.res().out().writeBuf(this.#buf), WebOutStream.type$).close();
    return;
  }

  static pack(files,out) {
    const this$ = this;
    files.each((f) => {
      FilePack.pipeToPack(f, out);
      return;
    });
    return out;
  }

  static pipeToPack(f,out) {
    let chunkSize = sys.Int.min(sys.ObjUtil.coerce(f.size(), sys.Int.type$), 4096);
    if (sys.ObjUtil.equals(chunkSize, 0)) {
      return;
    }
    ;
    let buf = sys.Buf.make(chunkSize);
    let in$ = f.in(sys.ObjUtil.coerce(chunkSize, sys.Int.type$.toNullable()));
    try {
      let lastIsNewline = false;
      while (true) {
        let n = in$.readBuf(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Buf.type$), chunkSize);
        if (n == null) {
          break;
        }
        ;
        if (sys.ObjUtil.compareGT(n, 0)) {
          (lastIsNewline = sys.ObjUtil.equals(buf.get(-1), 10));
        }
        ;
        out.writeBuf(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$), buf.remaining());
      }
      ;
      if (!lastIsNewline) {
        out.writeChar(10);
      }
      ;
    }
    finally {
      in$.close();
    }
    ;
    return;
  }

  static toAppJsFiles(pods) {
    const this$ = this;
    (pods = sys.Pod.flattenDepends(pods));
    (pods = sys.Pod.orderByDepends(pods));
    let files = FilePack.toPodJsFiles(pods);
    let sysIndex = ((this$) => { let $_u40 = files.findIndex((f) => {
      return sys.ObjUtil.equals(f.name(), "sys.js");
    }); if ($_u40 != null) return $_u40; throw sys.Err.make("Missing sys.js"); })(this);
    files.insertAll(sys.Int.plus(sys.ObjUtil.coerce(sysIndex, sys.Int.type$), 1), FilePack.toEtcJsFiles());
    return files;
  }

  static toPodJsFile(pod) {
    let uri = ((this$) => { if (WebJsMode.cur().isEs()) return sys.Uri.fromStr("/js/"); return sys.Uri.fromStr("/"); })(this).plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", pod.name()), ".js")));
    return pod.file(uri, false);
  }

  static toPodJsFiles(pods) {
    const this$ = this;
    let acc = sys.List.make(sys.File.type$);
    acc.capacity(pods.size());
    pods.each((pod) => {
      let js = FilePack.toPodJsFile(pod);
      if (js != null) {
        if ((sys.ObjUtil.equals(pod.name(), "sys") && WebJsMode.cur().isEs())) {
          acc.add(sys.ObjUtil.coerce(pod.file(sys.Uri.fromStr("/js/fan.js")), sys.File.type$));
        }
        ;
        acc.add(sys.ObjUtil.coerce(js, sys.File.type$));
      }
      ;
      return;
    });
    return acc;
  }

  static toEtcJsFiles() {
    return sys.List.make(sys.File.type$, [FilePack.toMimeJsFile(), FilePack.toUnitsJsFile(), FilePack.toIndexPropsJsFile()]);
  }

  static moduleSystem() {
    return sys.Type.find("compilerEs::CommonJs").make(sys.List.make(sys.File.type$, [sys.Env.cur().tempDir().plus(sys.Uri.fromStr("file_pack/"))]));
  }

  static compileJsFile(cname,fname,arg) {
    if (arg === undefined) arg = null;
    let buf = sys.Buf.make(4096);
    let c = ((this$) => { if (WebJsMode.cur().isEs()) return sys.Type.find(sys.Str.plus("compilerEs::", cname)).make(sys.List.make(sys.Obj.type$, [FilePack.moduleSystem()])); return sys.Type.find(sys.Str.plus("compilerJs::", cname)).make(); })(this);
    sys.ObjUtil.trap(c,"write", sys.List.make(sys.Obj.type$.toNullable(), [buf.out(), arg]));
    return buf.toFile(fname);
  }

  static toMimeJsFile() {
    return FilePack.compileJsFile("JsExtToMime", sys.Uri.fromStr("mime.js"));
  }

  static toUnitsJsFile() {
    return FilePack.compileJsFile("JsUnitDatabase", sys.Uri.fromStr("units.js"));
  }

  static toIndexPropsJsFile(pods) {
    if (pods === undefined) pods = sys.Pod.list();
    return FilePack.compileJsFile("JsIndexedProps", sys.Uri.fromStr("index-props.js"), pods);
  }

  static toTimezonesJsFile() {
    return sys.Buf.make().toFile(sys.Uri.fromStr("tz.js"));
  }

  static toLocaleJsFile(locale,pods) {
    if (pods === undefined) pods = sys.Pod.list();
    const this$ = this;
    let buf = sys.Buf.make(1024);
    let m = sys.Slot.findMethod("compilerJs::JsProps.writeProps");
    let path = sys.Str.toUri(sys.Str.plus(sys.Str.plus("locale/", locale.toStr()), ".props"));
    pods.each((pod) => {
      m.call(buf.out(), pod, path, sys.Duration.fromStr("1sec"));
      return;
    });
    return buf.toFile(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", locale), ".js")));
  }

  static toPodJsMapFile(files,options) {
    if (options === undefined) options = null;
    let buf = sys.Buf.make(4194304);
    let m = ((this$) => { if (WebJsMode.cur().isEs()) return sys.Slot.findMethod("compilerEs::SourceMap.pack"); return sys.Slot.findMethod("compilerJs::SourceMap.pack"); })(this);
    m.call(files, buf.out(), options);
    return buf.toFile(sys.Uri.fromStr("js.map"));
  }

  static toAppCssFiles(pods) {
    (pods = sys.Pod.flattenDepends(pods));
    (pods = sys.Pod.orderByDepends(pods));
    return FilePack.toPodCssFiles(pods);
  }

  static toPodCssFiles(pods) {
    const this$ = this;
    let acc = sys.List.make(sys.File.type$);
    pods.each((pod) => {
      let css = pod.file(sys.Str.toUri(sys.Str.plus(sys.Str.plus("/res/css/", pod.name()), ".css")), false);
      if (css != null) {
        acc.add(sys.ObjUtil.coerce(css, sys.File.type$));
      }
      ;
      return;
    });
    return acc;
  }

  static main(args) {
    const this$ = this;
    let pods = args.map((n) => {
      return sys.ObjUtil.coerce(sys.Pod.find(n), sys.Pod.type$);
    }, sys.Pod.type$);
    FilePack.mainReport(FilePack.toAppJsFiles(sys.ObjUtil.coerce(pods, sys.Type.find("sys::Pod[]"))));
    FilePack.mainReport(FilePack.toAppCssFiles(sys.ObjUtil.coerce(pods, sys.Type.find("sys::Pod[]"))));
    return;
  }

  static mainReport(f) {
    let b = FilePack.makeFiles(f);
    let gzip = sys.Int.toLocale(b.#buf.size(), "B");
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", f.first().ext()), ": "), sys.ObjUtil.coerce(f.size(), sys.Obj.type$.toNullable())), " files, "), gzip), ", "), b.#mimeType));
    return;
  }

}

class WebClient extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#socketConfig = inet.SocketConfig.cur();
    this.#reqUri = sys.Uri.fromStr("");
    this.#reqMethod = "GET";
    this.#reqVersion = WebClient.ver11();
    this.#reqHeaders = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.caseInsensitive(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"));
    this.#resVersion = WebClient.ver11();
    this.#resPhrase = "";
    this.#resHeaders = WebClient.noHeaders();
    this.#cookies = sys.ObjUtil.coerce(Cookie.type$.emptyList(), sys.Type.find("web::Cookie[]"));
    this.#followRedirects = true;
    this.#proxy = WebClient.proxyDef();
    this.#numRedirects = 0;
    return;
  }

  typeof() { return WebClient.type$; }

  #socketConfig = null;

  socketConfig(it) {
    if (it === undefined) {
      return this.#socketConfig;
    }
    else {
      this.#socketConfig = it;
      return;
    }
  }

  #reqUri = null;

  reqUri(it) {
    if (it === undefined) {
      return this.#reqUri;
    }
    else {
      if (!it.isAbs()) {
        throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Request URI not absolute: `", it), "`"));
      }
      ;
      if ((sys.ObjUtil.compareNE(it.scheme(), "http") && sys.ObjUtil.compareNE(it.scheme(), "https"))) {
        throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Request URI is not http or https: `", it), "`"));
      }
      ;
      this.#reqUri = it;
      return;
    }
  }

  #reqMethod = null;

  reqMethod(it) {
    if (it === undefined) {
      return this.#reqMethod;
    }
    else {
      this.#reqMethod = sys.Str.upper(it);
      return;
    }
  }

  #reqVersion = null;

  reqVersion(it) {
    if (it === undefined) {
      return this.#reqVersion;
    }
    else {
      this.#reqVersion = it;
      return;
    }
  }

  #reqHeaders = null;

  reqHeaders(it) {
    if (it === undefined) {
      return this.#reqHeaders;
    }
    else {
      this.#reqHeaders = it;
      return;
    }
  }

  #resVersion = null;

  resVersion(it) {
    if (it === undefined) {
      return this.#resVersion;
    }
    else {
      this.#resVersion = it;
      return;
    }
  }

  #resCode = 0;

  resCode(it) {
    if (it === undefined) {
      return this.#resCode;
    }
    else {
      this.#resCode = it;
      return;
    }
  }

  #resPhrase = null;

  resPhrase(it) {
    if (it === undefined) {
      return this.#resPhrase;
    }
    else {
      this.#resPhrase = it;
      return;
    }
  }

  #resHeaders = null;

  resHeaders(it) {
    if (it === undefined) {
      return this.#resHeaders;
    }
    else {
      this.#resHeaders = it;
      return;
    }
  }

  #cookies = null;

  cookies(it) {
    if (it === undefined) {
      return this.#cookies;
    }
    else {
      const this$ = this;
      this.#cookies = it;
      if (it.isEmpty()) {
        this.#reqHeaders.remove("Cookie");
        return;
      }
      ;
      this.#reqHeaders.set("Cookie", ((this$) => { if (sys.ObjUtil.equals(it.size(), 1)) return it.first().toNameValStr(); return it.join("; ", (c) => {
        return c.toNameValStr();
      }); })(this));
      return;
    }
  }

  #followRedirects = false;

  followRedirects(it) {
    if (it === undefined) {
      return this.#followRedirects;
    }
    else {
      this.#followRedirects = it;
      return;
    }
  }

  #proxy = null;

  proxy(it) {
    if (it === undefined) {
      return this.#proxy;
    }
    else {
      this.#proxy = it;
      return;
    }
  }

  static #ver10 = undefined;

  static ver10() {
    if (WebClient.#ver10 === undefined) {
      WebClient.static$init();
      if (WebClient.#ver10 === undefined) WebClient.#ver10 = null;
    }
    return WebClient.#ver10;
  }

  static #ver11 = undefined;

  static ver11() {
    if (WebClient.#ver11 === undefined) {
      WebClient.static$init();
      if (WebClient.#ver11 === undefined) WebClient.#ver11 = null;
    }
    return WebClient.#ver11;
  }

  static #noHeaders = undefined;

  static noHeaders() {
    if (WebClient.#noHeaders === undefined) {
      WebClient.static$init();
      if (WebClient.#noHeaders === undefined) WebClient.#noHeaders = null;
    }
    return WebClient.#noHeaders;
  }

  #resInStream = null;

  // private field reflection only
  __resInStream(it) { if (it === undefined) return this.#resInStream; else this.#resInStream = it; }

  #reqOutStream = null;

  // private field reflection only
  __reqOutStream(it) { if (it === undefined) return this.#reqOutStream; else this.#reqOutStream = it; }

  #socket = null;

  socket(it) {
    if (it === undefined) {
      return this.#socket;
    }
    else {
      this.#socket = it;
      return;
    }
  }

  #numRedirects = 0;

  // private field reflection only
  __numRedirects(it) { if (it === undefined) return this.#numRedirects; else this.#numRedirects = it; }

  #socketOptions$Store = undefined;

  // private field reflection only
  __socketOptions$Store(it) { if (it === undefined) return this.#socketOptions$Store; else this.#socketOptions$Store = it; }

  #proxyExceptions$Store = undefined;

  // private field reflection only
  __proxyExceptions$Store(it) { if (it === undefined) return this.#proxyExceptions$Store; else this.#proxyExceptions$Store = it; }

  static make(reqUri) {
    const $self = new WebClient();
    WebClient.make$($self,reqUri);
    return $self;
  }

  static make$($self,reqUri) {
    if (reqUri === undefined) reqUri = null;
    ;
    if (reqUri != null) {
      $self.reqUri(sys.ObjUtil.coerce(reqUri, sys.Uri.type$));
    }
    ;
    $self.#reqHeaders.set("Accept-Encoding", "gzip");
    return;
  }

  reqOut() {
    if (this.#reqOutStream == null) {
      throw sys.IOErr.make("No output stream for request");
    }
    ;
    return sys.ObjUtil.coerce(this.#reqOutStream, sys.OutStream.type$);
  }

  resHeader(key,checked) {
    if (checked === undefined) checked = true;
    let val = this.#resHeaders.get(key);
    if ((val != null || !checked)) {
      return val;
    }
    ;
    throw sys.Err.make(sys.Str.plus(sys.Str.plus("Missing HTTP header '", key), "'"));
  }

  resIn() {
    if (this.#resInStream == null) {
      throw sys.IOErr.make(sys.Str.plus("No input stream for response ", sys.ObjUtil.coerce(this.#resCode, sys.Obj.type$.toNullable())));
    }
    ;
    return sys.ObjUtil.coerce(this.#resInStream, sys.InStream.type$);
  }

  resStr() {
    return this.resIn().readAllStr();
  }

  resBuf() {
    return this.resIn().readAllBuf();
  }

  socketOptions() {
    if (this.#socketOptions$Store === undefined) {
      this.#socketOptions$Store = this.socketOptions$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#socketOptions$Store, inet.SocketOptions.type$);
  }

  static proxyDef() {
    try {
      return ((this$) => { let $_u45 = WebClient.type$.pod().config("proxy"); if ($_u45 == null) return null; return sys.Str.toUri(WebClient.type$.pod().config("proxy")); })(this);
    }
    catch ($_u46) {
      $_u46 = sys.Err.make($_u46);
      if ($_u46 instanceof sys.Err) {
        let e = $_u46;
        ;
        e.trace();
      }
      else {
        throw $_u46;
      }
    }
    ;
    return null;
  }

  isProxy(uri) {
    const this$ = this;
    return (this.#proxy != null && !this.proxyExceptions().any((re) => {
      return re.matches(sys.Str.toStr(uri.host()));
    }));
  }

  proxyExceptions() {
    if (this.#proxyExceptions$Store === undefined) {
      this.#proxyExceptions$Store = this.proxyExceptions$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#proxyExceptions$Store, sys.Type.find("sys::Regex[]"));
  }

  authBasic(username,password) {
    let enc = sys.Str.toBuf(sys.Str.plus(sys.Str.plus(sys.Str.plus("", username), ":"), password)).toBase64();
    this.#reqHeaders.set("Authorization", sys.Str.plus("Basic ", enc));
    return this;
  }

  getStr() {
    try {
      return this.getIn().readAllStr();
    }
    finally {
      this.close();
    }
    ;
  }

  getBuf() {
    try {
      return this.getIn().readAllBuf();
    }
    finally {
      this.close();
    }
    ;
  }

  getIn() {
    this.reqMethod("GET");
    this.writeReq();
    this.readRes();
    if (sys.ObjUtil.compareNE(this.#resCode, 200)) {
      throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Bad HTTP response ", sys.ObjUtil.coerce(this.#resCode, sys.Obj.type$.toNullable())), " "), this.#resPhrase));
    }
    ;
    return this.resIn();
  }

  postForm(form) {
    return this.writeForm("POST", form).readRes();
  }

  postStr(content) {
    return this.writeStr("POST", content).readRes();
  }

  postBuf(buf) {
    return this.writeBuf("POST", buf).readRes();
  }

  postFile(file) {
    return this.writeFile("POST", file).readRes();
  }

  writeForm(method,form) {
    if (this.#reqHeaders.get("Expect") != null) {
      throw sys.UnsupportedErr.make("'Expect' header");
    }
    ;
    let body = sys.Uri.encodeQuery(form);
    this.reqMethod(method);
    this.#reqHeaders.set("Content-Type", "application/x-www-form-urlencoded");
    this.#reqHeaders.set("Content-Length", sys.Int.toStr(sys.Str.size(body)));
    this.writeReq();
    this.reqOut().print(body).close();
    return this;
  }

  writeStr(method,content) {
    if (this.#reqHeaders.get("Expect") != null) {
      throw sys.UnsupportedErr.make("'Expect' header");
    }
    ;
    let body = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print(content), sys.Buf.type$.toNullable()).flip(), sys.Buf.type$.toNullable());
    this.reqMethod(method);
    let ct = this.#reqHeaders.get("Content-Type");
    if (ct == null) {
      this.#reqHeaders.set("Content-Type", "text/plain; charset=utf-8");
    }
    ;
    this.#reqHeaders.set("Content-Length", sys.Int.toStr(body.size()));
    this.writeReq();
    this.reqOut().writeBuf(sys.ObjUtil.coerce(body, sys.Buf.type$)).close();
    return this;
  }

  writeBuf(method,content) {
    if (this.#reqHeaders.get("Expect") != null) {
      throw sys.UnsupportedErr.make("'Expect' header");
    }
    ;
    this.reqMethod(method);
    let ct = this.#reqHeaders.get("Content-Type");
    if (ct == null) {
      this.#reqHeaders.set("Content-Type", "application/octet-stream");
    }
    ;
    this.#reqHeaders.set("Content-Length", sys.Int.toStr(content.size()));
    this.writeReq();
    this.reqOut().writeBuf(content.seek(0));
    this.reqOut().close();
    return this;
  }

  writeFile(method,file) {
    if (this.#reqHeaders.get("Expect") != null) {
      throw sys.UnsupportedErr.make("'Expect' header");
    }
    ;
    this.reqMethod(method);
    let ct = this.#reqHeaders.get("Content-Type");
    if (ct == null) {
      this.#reqHeaders.set("Content-Type", sys.ObjUtil.coerce(((this$) => { let $_u47 = ((this$) => { let $_u48 = file.mimeType(); if ($_u48 == null) return null; return file.mimeType().toStr(); })(this$); if ($_u47 != null) return $_u47; return "application/octet-stream"; })(this), sys.Str.type$));
    }
    ;
    if (file.size() != null) {
      this.#reqHeaders.set("Content-Length", sys.Int.toStr(sys.ObjUtil.coerce(file.size(), sys.Int.type$)));
    }
    ;
    this.writeReq();
    file.in().pipe(this.reqOut(), file.size());
    this.reqOut().close();
    return this;
  }

  writeReq() {
    if ((!this.reqUri().isAbs() || this.reqUri().scheme() == null || this.reqUri().host() == null)) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("reqUri is not absolute: `", this.reqUri()), "`"));
    }
    ;
    if (!this.#reqHeaders.caseInsensitive()) {
      throw sys.Err.make("reqHeaders must be case insensitive");
    }
    ;
    if (this.#reqHeaders.containsKey("Host")) {
      throw sys.Err.make("reqHeaders must not define 'Host'");
    }
    ;
    let isHttps = sys.ObjUtil.equals(this.reqUri().scheme(), "https");
    let defPort = ((this$) => { if (isHttps) return 443; return 80; })(this);
    let usingProxy = this.isProxy(this.reqUri());
    let isTunnel = (usingProxy && isHttps);
    if (!this.isConnected()) {
      if (isTunnel) {
        this.#socket = this.openHttpsTunnel();
      }
      else {
        this.#socket = inet.TcpSocket.make(this.#socketConfig);
        if (isHttps) {
          this.#socket = this.#socket.upgradeTls();
        }
        ;
        let connUri = ((this$) => { if (usingProxy) return this$.#proxy; return this$.reqUri(); })(this);
        this.#socket.connect(sys.ObjUtil.coerce(inet.IpAddr.make(sys.ObjUtil.coerce(connUri.host(), sys.Str.type$)), inet.IpAddr.type$), sys.ObjUtil.coerce(((this$) => { let $_u51 = connUri.port(); if ($_u51 != null) return $_u51; return sys.ObjUtil.coerce(defPort, sys.Int.type$.toNullable()); })(this), sys.Int.type$));
      }
      ;
    }
    ;
    let reqPath = ((this$) => { if (usingProxy) return this$.reqUri(); return this$.reqUri().relToAuth(); })(this).encode();
    let host = this.reqUri().host();
    if ((this.reqUri().port() != null && sys.ObjUtil.compareNE(this.reqUri().port(), defPort))) {
      host = sys.Str.plus(host, sys.Str.plus(":", sys.ObjUtil.coerce(this.reqUri().port(), sys.Obj.type$.toNullable())));
    }
    ;
    let out = this.#socket.out();
    this.#reqOutStream = WebUtil.makeContentOutStream(this.#reqHeaders, out);
    out.print(this.reqMethod()).print(" ").print(reqPath).print(" HTTP/").print(this.#reqVersion).print("\r\n");
    out.print("Host: ").print(host).print("\r\n");
    WebUtil.writeHeaders(out, this.#reqHeaders);
    out.print("\r\n");
    out.flush();
    return this;
  }

  openHttpsTunnel() {
    this.#socket = inet.TcpSocket.make(this.#socketConfig);
    this.#socket.connect(sys.ObjUtil.coerce(inet.IpAddr.make(sys.ObjUtil.coerce(this.#proxy.host(), sys.Str.type$)), inet.IpAddr.type$), sys.ObjUtil.coerce(((this$) => { let $_u53 = this$.#proxy.port(); if ($_u53 != null) return $_u53; return sys.ObjUtil.coerce(80, sys.Int.type$.toNullable()); })(this), sys.Int.type$));
    let out = this.#socket.out();
    out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("CONNECT ", this.reqUri().host()), ":"), sys.ObjUtil.coerce(((this$) => { let $_u54 = this$.reqUri().port(); if ($_u54 != null) return $_u54; return sys.ObjUtil.coerce(443, sys.Int.type$.toNullable()); })(this), sys.Obj.type$.toNullable())), " HTTP/"), this.#reqVersion)).print("\r\n").print(sys.Str.plus(sys.Str.plus(sys.Str.plus("Host: ", this.reqUri().host()), ":"), sys.ObjUtil.coerce(((this$) => { let $_u55 = this$.reqUri().port(); if ($_u55 != null) return $_u55; return sys.ObjUtil.coerce(443, sys.Int.type$.toNullable()); })(this), sys.Obj.type$.toNullable()))).print("\r\n").print("\r\n");
    out.flush();
    this.readRes();
    if (sys.ObjUtil.compareNE(this.#resCode, 200)) {
      throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Could not open tunnel: bad HTTP response ", sys.ObjUtil.coerce(this.#resCode, sys.Obj.type$.toNullable())), " "), this.#resPhrase));
    }
    ;
    return this.#socket.upgradeTls(inet.IpAddr.make(sys.ObjUtil.coerce(this.reqUri().host(), sys.Str.type$)), ((this$) => { let $_u56 = this$.reqUri().port(); if ($_u56 != null) return $_u56; return sys.ObjUtil.coerce(443, sys.Int.type$.toNullable()); })(this));
  }

  readRes() {
    if (!this.isConnected()) {
      throw sys.IOErr.make("Not connected");
    }
    ;
    let in$ = this.#socket.in();
    let res = "";
    try {
      (res = WebUtil.readLine(in$));
      if (sys.Str.startsWith(res, "HTTP/1.1")) {
        this.#resVersion = WebClient.ver11();
      }
      else {
        if (sys.Str.startsWith(res, "HTTP/1.0")) {
          this.#resVersion = WebClient.ver10();
        }
        else {
          throw sys.Err.make("Not HTTP");
        }
        ;
      }
      ;
      this.#resCode = sys.ObjUtil.coerce(sys.Str.toInt(sys.Str.getRange(res, sys.Range.make(9, 11))), sys.Int.type$);
      this.#resPhrase = sys.Str.getRange(res, sys.Range.make(13, -1));
      let setCookies = sys.List.make(Cookie.type$);
      this.#resHeaders = WebUtil.doParseHeaders(in$, setCookies);
      if (!setCookies.isEmpty()) {
        this.cookies(setCookies);
      }
      ;
    }
    catch ($_u57) {
      $_u57 = sys.Err.make($_u57);
      if ($_u57 instanceof sys.Err) {
        let e = $_u57;
        ;
        throw sys.IOErr.make(sys.Str.plus("Invalid HTTP response: ", res), e);
      }
      else {
        throw $_u57;
      }
    }
    ;
    if (this.checkFollowRedirect()) {
      return this;
    }
    ;
    this.#resInStream = WebUtil.makeContentInStream(this.#resHeaders, this.#socket.in());
    return this;
  }

  checkFollowRedirect() {
    if (sys.ObjUtil.compareNE(sys.Int.div(this.#resCode, 100), 3)) {
      return false;
    }
    ;
    if (!this.#followRedirects) {
      return false;
    }
    ;
    if (this.#reqOutStream != null) {
      return false;
    }
    ;
    let loc = this.#resHeaders.get("Location");
    if (loc == null) {
      return false;
    }
    ;
    try {
      this.#numRedirects = sys.Int.increment(this.#numRedirects);
      this.close();
      let newUri = sys.Uri.decode(sys.ObjUtil.coerce(loc, sys.Str.type$));
      if (!newUri.isAbs()) {
        (newUri = this.reqUri().plus(sys.ObjUtil.coerce(newUri, sys.Uri.type$)));
      }
      ;
      if ((sys.ObjUtil.equals(this.reqUri(), newUri) && sys.ObjUtil.compareGT(this.#numRedirects, 20))) {
        throw sys.Err.make(sys.Str.plus("Cyclical redirect: ", newUri));
      }
      ;
      this.reqUri(sys.ObjUtil.coerce(newUri, sys.Uri.type$));
      this.writeReq();
      this.readRes();
      return true;
    }
    finally {
      this.#numRedirects = sys.Int.decrement(this.#numRedirects);
    }
    ;
  }

  isConnected() {
    return (this.#socket != null && this.#socket.isConnected());
  }

  close() {
    if (this.#socket != null) {
      this.#socket.close();
    }
    ;
    this.#socket = null;
    return this;
  }

  socketOptions$Once() {
    return inet.TcpSocket.make().options();
  }

  proxyExceptions$Once() {
    const this$ = this;
    try {
      return sys.ObjUtil.coerce(((this$) => { let $_u58 = ((this$) => { let $_u59 = ((this$) => { let $_u60 = WebClient.type$.pod().config("proxy.exceptions"); if ($_u60 == null) return null; return sys.Str.split(WebClient.type$.pod().config("proxy.exceptions"), sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())); })(this$); if ($_u59 == null) return null; return ((this$) => { let $_u61 = WebClient.type$.pod().config("proxy.exceptions"); if ($_u61 == null) return null; return sys.Str.split(WebClient.type$.pod().config("proxy.exceptions"), sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())); })(this$).map((tok) => {
        return sys.Regex.glob(tok);
      }, sys.Regex.type$); })(this$); if ($_u58 != null) return $_u58; return sys.List.make(sys.Regex.type$); })(this), sys.Type.find("sys::Regex[]"));
    }
    catch ($_u62) {
      $_u62 = sys.Err.make($_u62);
      if ($_u62 instanceof sys.Err) {
        let e = $_u62;
        ;
        e.trace();
      }
      else {
        throw $_u62;
      }
    }
    ;
    return sys.List.make(sys.Regex.type$);
  }

  static static$init() {
    WebClient.#ver10 = sys.ObjUtil.coerce(sys.Version.fromStr("1.0"), sys.Version.type$);
    WebClient.#ver11 = sys.ObjUtil.coerce(sys.Version.fromStr("1.1"), sys.Version.type$);
    WebClient.#noHeaders = sys.ObjUtil.coerce(((this$) => { let $_u63 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u63 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

}

class WebSession extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WebSession.type$; }

  toStr() {
    return this.id();
  }

  static make() {
    const $self = new WebSession();
    WebSession.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class Cookie extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#path = "/";
    this.#secure = false;
    this.#httpOnly = true;
    this.#sameSite = "strict";
    return;
  }

  typeof() { return Cookie.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  #maxAge = null;

  maxAge() { return this.#maxAge; }

  __maxAge(it) { if (it === undefined) return this.#maxAge; else this.#maxAge = it; }

  #domain = null;

  domain() { return this.#domain; }

  __domain(it) { if (it === undefined) return this.#domain; else this.#domain = it; }

  #path = null;

  path() { return this.#path; }

  __path(it) { if (it === undefined) return this.#path; else this.#path = it; }

  #secure = false;

  secure() { return this.#secure; }

  __secure(it) { if (it === undefined) return this.#secure; else this.#secure = it; }

  #httpOnly = false;

  httpOnly() { return this.#httpOnly; }

  __httpOnly(it) { if (it === undefined) return this.#httpOnly; else this.#httpOnly = it; }

  #sameSite = null;

  sameSite() { return this.#sameSite; }

  __sameSite(it) { if (it === undefined) return this.#sameSite; else this.#sameSite = it; }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    try {
      let params = null;
      let semi = sys.Str.index(s, ";");
      if (semi != null) {
        (params = sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(semi, sys.Int.type$), 1), -1)));
        (s = sys.Str.getRange(s, sys.Range.make(0, sys.ObjUtil.coerce(semi, sys.Int.type$), true)));
      }
      ;
      let eq = sys.Str.index(s, "=");
      if (eq == null) {
        throw sys.ParseErr.make(s);
      }
      ;
      let name = sys.Str.trim(sys.Str.getRange(s, sys.Range.make(0, sys.ObjUtil.coerce(eq, sys.Int.type$), true)));
      let val = sys.Str.trim(sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(eq, sys.Int.type$), 1), -1)));
      if (params == null) {
        return Cookie.make(name, val);
      }
      ;
      return Cookie.make(name, val, (it) => {
        let p = sys.MimeType.parseParams(sys.ObjUtil.coerce(params, sys.Str.type$));
        it.#domain = p.get("Domain");
        it.#path = p.get("Path", "/");
        return;
      });
    }
    catch ($_u64) {
      $_u64 = sys.Err.make($_u64);
      if ($_u64 instanceof sys.Err) {
        let e = $_u64;
        ;
        if (checked) {
          throw sys.ParseErr.make(sys.Str.plus("Cookie: ", s));
        }
        ;
        return null;
      }
      else {
        throw $_u64;
      }
    }
    ;
  }

  static makeSession(name,val,overrides) {
    if (overrides === undefined) overrides = null;
    const this$ = this;
    let pod = Cookie.type$.pod();
    let fields = sys.Map.__fromLiteral([Cookie.type$.slot("secure"),Cookie.type$.slot("sameSite"),Cookie.type$.slot("httpOnly")], [sys.ObjUtil.coerce(sys.ObjUtil.equals(pod.config("secureSessionCookie", "false"), "true"), sys.Obj.type$.toNullable()),pod.config("sameSiteSessionCookie", "strict"),sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Field"), sys.Type.find("sys::Obj?"));
    if (overrides != null) {
      overrides.each((v,f) => {
        fields.set(f, v);
        return;
      });
    }
    ;
    return Cookie.make(name, val, sys.Field.makeSetFunc(fields));
  }

  static make(name,val,f) {
    const $self = new Cookie();
    Cookie.make$($self,name,val,f);
    return $self;
  }

  static make$($self,name,val,f) {
    if (f === undefined) f = null;
    const this$ = $self;
    ;
    if (f != null) {
      sys.Func.call(f, $self);
    }
    ;
    $self.#name = name;
    $self.#val = val;
    if ((!WebUtil.isToken($self.#name) || sys.ObjUtil.equals(sys.Str.get($self.#name, 0), 36))) {
      throw sys.ArgErr.make(sys.Str.plus("Cookie name has illegal chars: ", val));
    }
    ;
    if (!sys.Str.all($self.#val, (c) => {
      return (sys.ObjUtil.compareLE(32, c) && sys.ObjUtil.compareLE(c, 126) && sys.ObjUtil.compareNE(c, 59));
    })) {
      throw sys.ArgErr.make(sys.Str.plus("Cookie value has illegal chars: ", val));
    }
    ;
    if (sys.ObjUtil.compareGE(sys.Int.plus(sys.Str.size($self.#val), 32), WebUtil.maxTokenSize())) {
      throw sys.ArgErr.make("Cookie value too big");
    }
    ;
    return;
  }

  toStr() {
    let s = sys.StrBuf.make(64);
    s.add(this.#name).add("=").add(this.#val);
    if (this.#maxAge != null) {
      s.add(";Max-Age=").add(sys.ObjUtil.coerce(this.#maxAge.toSec(), sys.Obj.type$.toNullable()));
      if (sys.ObjUtil.compareLE(this.#maxAge.ticks(), 0)) {
        s.add(";Expires=").add("Sat, 01 Jan 2000 00:00:00 GMT");
      }
      else {
        s.add(";Expires=").add(sys.DateTime.nowUtc().plus(sys.ObjUtil.coerce(this.#maxAge, sys.Duration.type$)).toHttpStr());
      }
      ;
    }
    ;
    if (this.#domain != null) {
      s.add(";Domain=").add(this.#domain);
    }
    ;
    if (this.#path != null) {
      s.add(";Path=").add(this.#path);
    }
    ;
    if (this.#secure) {
      s.add(";Secure");
    }
    ;
    if (this.#httpOnly) {
      s.add(";HttpOnly");
    }
    ;
    if (this.#sameSite != null) {
      s.add(sys.Str.plus(";SameSite=", this.#sameSite));
    }
    ;
    return s.toStr();
  }

  toNameValStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#name), "="), this.#val);
  }

}

class WebJsMode extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WebJsMode.type$; }

  static js() { return WebJsMode.vals().get(0); }

  static es() { return WebJsMode.vals().get(1); }

  static #vals = undefined;

  static #curRef = undefined;

  static curRef() {
    if (WebJsMode.#curRef === undefined) {
      WebJsMode.static$init();
      if (WebJsMode.#curRef === undefined) WebJsMode.#curRef = null;
    }
    return WebJsMode.#curRef;
  }

  isEs() {
    return this === WebJsMode.es();
  }

  static cur() {
    return sys.ObjUtil.coerce(WebJsMode.curRef().val(), WebJsMode.type$);
  }

  static setCur(cur) {
    WebJsMode.curRef().val(cur);
    return;
  }

  static make($ordinal,$name) {
    const $self = new WebJsMode();
    WebJsMode.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(WebJsMode.type$, WebJsMode.vals(), name$, checked);
  }

  static vals() {
    if (WebJsMode.#vals == null) {
      WebJsMode.#vals = sys.List.make(WebJsMode.type$, [
        WebJsMode.make(0, "js", ),
        WebJsMode.make(1, "es", ),
      ]).toImmutable();
    }
    return WebJsMode.#vals;
  }

  static static$init() {
    const $_u65 = WebJsMode.vals();
    if (true) {
    }
    ;
    WebJsMode.#curRef = concurrent.AtomicRef.make(WebJsMode.js());
    return;
  }

}

class WebClientTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WebClientTest.type$; }

  testBadConfig() {
    const this$ = this;
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let x = WebClient.make(sys.Uri.fromStr("not/abs"));
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let x = sys.ObjUtil.coerce(sys.ObjUtil.with(WebClient.make(), (it) => {
        it.reqUri(sys.Uri.fromStr("/not/abs"));
        it.writeReq();
        it.readRes();
        return;
      }), WebClient.type$);
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      let x = sys.ObjUtil.coerce(sys.ObjUtil.with(WebClient.make(), (it) => {
        it.writeReq();
        it.readRes();
        return;
      }), WebClient.type$);
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      let x = sys.ObjUtil.coerce(sys.ObjUtil.with(WebClient.make(), (it) => {
        it.reqUri(sys.Uri.fromStr("http://foo/"));
        it.reqHeaders(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
        it.writeReq();
        it.readRes();
        return;
      }), WebClient.type$);
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      let x = sys.ObjUtil.coerce(sys.ObjUtil.with(WebClient.make(), (it) => {
        it.reqUri(sys.Uri.fromStr("http://foo/"));
        it.reqHeaders().set("Host", "bad");
        it.writeReq();
        it.readRes();
        return;
      }), WebClient.type$);
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      let x = sys.ObjUtil.coerce(sys.ObjUtil.with(WebClient.make(), (it) => {
        it.reqUri(sys.Uri.fromStr("http://foo/"));
        it.reqHeaders().set("host", "bad");
        it.writeReq();
        it.readRes();
        return;
      }), WebClient.type$);
      return;
    });
    return;
  }

  testCookies() {
    let a = Cookie.fromStr("alpha=blah; Expires=Tue, 15-Jan-2013 21:47:38 GMT; Path=/; Domain=.example.com; HttpOnly");
    let b = Cookie.fromStr("beta=belch");
    let c = WebClient.make(sys.Uri.fromStr("http://foo.com/"));
    c.cookies(sys.List.make(Cookie.type$.toNullable(), [a]));
    this.verifyEq(c.reqHeaders().get("Cookie"), "alpha=blah");
    c.cookies(sys.List.make(Cookie.type$.toNullable(), [a, b]));
    this.verifyEq(c.reqHeaders().get("Cookie"), "alpha=blah; beta=belch");
    c.cookies(sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("web::Cookie[]")));
    this.verifyEq(c.reqHeaders().get("Cookie"), null);
    return;
  }

  testGetFixed() {
    const this$ = this;
    let c = WebClient.make(sys.Uri.fromStr("https://fantom.org/pod/fantomws/res/img/fanny-mono-grey500.svg"));
    this.verify(!c.isConnected());
    try {
      c.writeReq().readRes();
      this.verify(c.isConnected());
      this.verifyEq(c.resVersion(), sys.Version.fromStr("1.1"));
      this.verifyEq(sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(200, sys.Obj.type$.toNullable()));
      this.verifyEq(c.resPhrase(), "OK");
      this.verifyEq(sys.ObjUtil.coerce(c.resHeaders().caseInsensitive(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      this.verify(sys.Str.contains(c.resHeader("server"), "nginx"));
      this.verify(sys.Str.contains(c.resHeader("SERVER", true), "nginx"));
      this.verifyEq(c.resHeader("foo-bar", false), null);
      this.verifyErr(sys.Err.type$, (it) => {
        c.resHeader("foo-bar");
        return;
      });
      this.verifyErr(sys.Err.type$, (it) => {
        c.resHeader("foo-bar", true);
        return;
      });
      let len = sys.Str.toInt(c.resHeader("Content-Length"));
      let png = c.resBuf();
      this.verifyEq(sys.Int.toChar(png.get(0)), "<");
      this.verifyEq(sys.Int.toChar(png.get(1)), "s");
      this.verifyEq(sys.Int.toChar(png.get(2)), "v");
      this.verifyEq(sys.Int.toChar(png.get(3)), "g");
    }
    finally {
      c.close();
    }
    ;
    return;
  }

  testGetChunked() {
    let c = WebClient.make(sys.Uri.fromStr("https://news.ycombinator.com/"));
    this.verify(!c.isConnected());
    try {
      c.writeReq().readRes();
      this.verify(c.isConnected());
      this.verifyEq(c.resVersion(), sys.Version.fromStr("1.1"));
      this.verifyEq(sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(200, sys.Obj.type$.toNullable()));
      this.verifyEq(c.resPhrase(), "OK");
      this.verifyEq(sys.ObjUtil.coerce(c.resHeaders().caseInsensitive(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      this.verify(sys.Str.contains(sys.Str.lower(c.resHeader("Transfer-Encoding")), "chunked"));
      this.verify(sys.Str.contains(c.resStr(), "<html"));
      c.close();
      let again = c.getStr();
      this.verify(sys.Str.contains(again, "<html"));
    }
    finally {
      c.close();
    }
    ;
    return;
  }

  testGetConvenience() {
    const this$ = this;
    let c = WebClient.make(sys.Uri.fromStr("https://news.ycombinator.com/"));
    this.verify(sys.Str.contains(c.getStr(), "<html"));
    concurrent.Actor.sleep(sys.Duration.fromStr("100ms"));
    this.verify(!c.isConnected());
    let buf = c.getBuf();
    let cs = sys.MimeType.fromStr(sys.ObjUtil.coerce(c.resHeaders().get("Content-Type"), sys.Str.type$)).charset();
    this.verify(sys.Str.contains(sys.ObjUtil.coerce(sys.ObjUtil.with(buf, (it) => {
      it.charset(cs);
      return;
    }), sys.Buf.type$).readAllStr(), "<html"));
    this.verify(!c.isConnected());
    try {
      this.verify(sys.Str.contains(c.getIn().readAllStr(), "<html"));
    }
    finally {
      c.close();
    }
    ;
    return;
  }

  testRedirects() {
    this.verifyRedirect(sys.Uri.fromStr("http://google.com"), null);
    let map = sys.Map.__fromLiteral([sys.Uri.fromStr("/doc/docIntro/WhyFan.html"),sys.Uri.fromStr("/doc/docLib/Dom.html"),sys.Uri.fromStr("/doc/docLib/Email.html"),sys.Uri.fromStr("/doc/docLib/Fandoc.html"),sys.Uri.fromStr("/doc/docLib/Flux.html"),sys.Uri.fromStr("/doc/docLib/Fwt.html"),sys.Uri.fromStr("/doc/docLib/Json.html"),sys.Uri.fromStr("/doc/docLib/Sql.html"),sys.Uri.fromStr("/doc/docLib/Web.html"),sys.Uri.fromStr("/doc/docLib/WebMod.html"),sys.Uri.fromStr("/doc/docLib/Wisp.html"),sys.Uri.fromStr("/doc/docLib/Xml.html"),sys.Uri.fromStr("/doc/docLang/TypeDatabase.html")], [sys.Uri.fromStr("/doc/docIntro/WhyFantom"),sys.Uri.fromStr("/doc/dom/index"),sys.Uri.fromStr("/doc/email/index"),sys.Uri.fromStr("/doc/fandoc/index"),sys.Uri.fromStr("/doc/flux/index"),sys.Uri.fromStr("/doc/fwt/index"),sys.Uri.fromStr("/doc/util/index#json"),sys.Uri.fromStr("/doc/sql/index"),sys.Uri.fromStr("/doc/web/index"),sys.Uri.fromStr("/doc/webmod/index"),sys.Uri.fromStr("/doc/wisp/index"),sys.Uri.fromStr("/doc/xml/index"),sys.Uri.fromStr("/doc/docLang/Env#index")], sys.Type.find("sys::Uri"), sys.Type.find("sys::Uri"));
    let uri = map.keys().random();
    let base = sys.Uri.fromStr("https://fantom.org/");
    this.verifyRedirect(base.plus(sys.ObjUtil.coerce(uri, sys.Uri.type$)), base.plus(sys.ObjUtil.coerce(map.get(sys.ObjUtil.coerce(uri, sys.Uri.type$)), sys.Uri.type$)));
    return;
  }

  verifyRedirect(origUri,expected) {
    let c = WebClient.make(origUri);
    try {
      c.followRedirects(false);
      c.writeReq().readRes();
      this.verifyEq(sys.ObjUtil.coerce(sys.Int.div(c.resCode(), 100), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
      c.close();
      c.followRedirects(true);
      c.writeReq().readRes();
      this.verifyEq(sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(200, sys.Obj.type$.toNullable()));
      this.verifyNotEq(c.reqUri(), origUri);
      if (expected != null) {
        this.verifyEq(c.reqUri(), expected);
      }
      ;
    }
    finally {
      c.close();
    }
    ;
    return;
  }

  static make() {
    const $self = new WebClientTest();
    WebClientTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class FilePackTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilePackTest.type$; }

  testPack() {
    let buf = sys.Buf.make();
    FilePack.pack(sys.List.make(sys.File.type$, [sys.Str.toBuf("a\n").toFile(sys.Uri.fromStr("a.txt")), sys.Str.toBuf("b").toFile(sys.Uri.fromStr("b.txt")), sys.Str.toBuf("c\n").toFile(sys.Uri.fromStr("c.txt")), sys.Str.toBuf("").toFile(sys.Uri.fromStr("d.txt")), sys.Str.toBuf("e").toFile(sys.Uri.fromStr("e.txt"))]), buf.out());
    (buf = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(buf), sys.Buf.type$.toNullable()));
    this.verifyEq(buf.in().readAllStr(), "a\nb\nc\ne\n");
    return;
  }

  static make() {
    const $self = new FilePackTest();
    FilePackTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class WebOutStreamTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WebOutStreamTest.type$; }

  testGeneral() {
    let buf = sys.StrBuf.make();
    let out = WebOutStream.make(buf.out());
    out.w("foo");
    this.verifyOut(buf, "foo");
    out.w(sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyOut(buf, "4");
    out.w(null);
    this.verifyOut(buf, "null");
    out.tab();
    this.verifyOut(buf, "  ");
    out.tab(5);
    this.verifyOut(buf, "     ");
    return;
  }

  testXml() {
    let buf = sys.Buf.make();
    let out = WebOutStream.make(buf.out());
    out.prolog();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<?xml version='1.0' encoding='UTF-8'?>");
    out.tag("bar");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<bar>");
    out.tag("bar", "foo='zoo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<bar foo='zoo'>");
    out.tag("bar", "foo='zoo'", true);
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<bar foo='zoo' />");
    out.tag("bar", null, true);
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<bar />");
    out.tagEnd("bar");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</bar>");
    return;
  }

  testHtml() {
    let buf = sys.Buf.make();
    let out = WebOutStream.make(buf.out());
    out.html();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<html xmlns='http://www.w3.org/1999/xhtml'>");
    out.htmlEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</html>");
    out.head();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<head>");
    out.headEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</head>");
    out.title().w("Test").titleEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<title>Test</title>");
    out.includeCss(sys.Uri.fromStr("foo.css"));
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<link rel='stylesheet' type='text/css' href='foo.css' />");
    out.includeCss(sys.Uri.fromStr("foo.css?a=foo&b=[bar]"));
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<link rel='stylesheet' type='text/css' href='foo.css?a=foo&amp;b=%5Bbar%5D' />");
    out.includeCss(sys.Uri.fromStr("foo.css"));
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), null);
    out.includeJs(sys.Uri.fromStr("foo.js"));
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<script type='text/javascript' src='foo.js'></script>");
    out.includeJs(sys.Uri.fromStr("foo.js?a=foo&b=[bar]"));
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<script type='text/javascript' src='foo.js?a=foo&amp;b=%5Bbar%5D'></script>");
    out.includeJs(sys.Uri.fromStr("foo.js"));
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), null);
    out.atom(sys.Uri.fromStr("foo.xml"));
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<link rel='alternate' type='application/atom+xml' href='foo.xml' />");
    out.atom(sys.Uri.fromStr("foo.xml?a=foo&b=[bar]"));
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<link rel='alternate' type='application/atom+xml' href='foo.xml?a=foo&amp;b=%5Bbar%5D' />");
    out.atom(sys.Uri.fromStr("foo.xml"), "title='bar'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<link rel='alternate' type='application/atom+xml' href='foo.xml' title='bar' />");
    out.rss(sys.Uri.fromStr("foo.xml"));
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<link rel='alternate' type='application/rss+xml' href='foo.xml' />");
    out.rss(sys.Uri.fromStr("foo.xml?a=foo&b=[bar]"));
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<link rel='alternate' type='application/rss+xml' href='foo.xml?a=foo&amp;b=%5Bbar%5D' />");
    out.rss(sys.Uri.fromStr("foo.xml"), "title='bar'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<link rel='alternate' type='application/rss+xml' href='foo.xml' title='bar' />");
    out.favIcon(sys.Uri.fromStr("fav.png"));
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<link rel='icon' href='fav.png' />");
    out.favIcon(sys.Uri.fromStr("fav.png"), "type='image/png'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<link rel='icon' href='fav.png' type='image/png' />");
    out.style();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<style type='text/css'>");
    out.style(null);
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<style>");
    out.styleEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</style>");
    out.script();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<script type='text/javascript'>");
    out.script(null);
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<script>");
    out.scriptEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</script>");
    out.body();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<body>");
    out.body("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<body class='foo'>");
    out.bodyEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</body>");
    out.h1().w("foo").h1End();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<h1>foo</h1>");
    out.h1("class='bar'").w("bar").h1End();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<h1 class='bar'>bar</h1>");
    out.h2().w("foo").h2End();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<h2>foo</h2>");
    out.h2("class='bar'").w("bar").h2End();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<h2 class='bar'>bar</h2>");
    out.h3().w("foo").h3End();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<h3>foo</h3>");
    out.h3("class='bar'").w("bar").h3End();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<h3 class='bar'>bar</h3>");
    out.h4().w("foo").h4End();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<h4>foo</h4>");
    out.h4("class='bar'").w("bar").h4End();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<h4 class='bar'>bar</h4>");
    out.h5().w("foo").h5End();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<h5>foo</h5>");
    out.h5("class='bar'").w("bar").h5End();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<h5 class='bar'>bar</h5>");
    out.h6().w("foo").h6End();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<h6>foo</h6>");
    out.h6("class='bar'").w("bar").h6End();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<h6 class='bar'>bar</h6>");
    out.div();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<div>");
    out.div("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<div class='foo'>");
    out.divEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</div>");
    out.span();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<span>");
    out.span("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<span class='foo'>");
    out.spanEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</span>");
    out.p();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<p>");
    out.p("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<p class='foo'>");
    out.pEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</p>");
    out.b();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<b>");
    out.b("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<b class='foo'>");
    out.bEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</b>");
    out.i();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<i>");
    out.i("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<i class='foo'>");
    out.iEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</i>");
    out.em();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<em>");
    out.em("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<em class='foo'>");
    out.emEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</em>");
    out.pre();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<pre>");
    out.pre("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<pre class='foo'>");
    out.preEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</pre>");
    out.code();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<code>");
    out.code("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<code class='foo'>");
    out.codeEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</code>");
    out.hr();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<hr />");
    out.hr("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<hr class='foo' />");
    out.br();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<br />");
    out.a(sys.Uri.fromStr("#"));
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<a href='#'>");
    out.a(sys.Uri.fromStr("/foo?a=foo&b=[bar]"));
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<a href='/foo?a=foo&amp;b=%5Bbar%5D'>");
    out.aEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</a>");
    out.img(sys.Uri.fromStr("foo.png"));
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<img src='foo.png' />");
    out.img(sys.Uri.fromStr("foo.png?a=foo&b=[bar]"));
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<img src='foo.png?a=foo&amp;b=%5Bbar%5D' />");
    out.img(sys.Uri.fromStr("foo.png"), "alt='bar'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<img src='foo.png' alt='bar' />");
    out.img(sys.Uri.fromStr("foo.png"), "alt='bar' class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<img src='foo.png' alt='bar' class='foo' />");
    out.img(sys.Uri.fromStr("foo.png"), "class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<img src='foo.png' class='foo' />");
    out.table();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<table>");
    out.table("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<table class='foo'>");
    out.tableEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</table>");
    out.thead();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<thead>");
    out.thead("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<thead class='foo'>");
    out.theadEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</thead>");
    out.tbody();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<tbody>");
    out.tbody("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<tbody class='foo'>");
    out.tbodyEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</tbody>");
    out.tfoot();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<tfoot>");
    out.tfoot("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<tfoot class='foo'>");
    out.tfootEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</tfoot>");
    out.tr();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<tr>");
    out.tr("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<tr class='foo'>");
    out.trEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</tr>");
    out.th();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<th>");
    out.th("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<th class='foo'>");
    out.thEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</th>");
    out.td();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<td>");
    out.td("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<td class='foo'>");
    out.tdEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</td>");
    out.ul();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<ul>");
    out.ul("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<ul class='foo'>");
    out.ulEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</ul>");
    out.ol();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<ol>");
    out.ol("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<ol class='foo'>");
    out.olEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</ol>");
    out.li();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<li>");
    out.li("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<li class='foo'>");
    out.liEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</li>");
    out.dl();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<dl>");
    out.dl("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<dl class='foo'>");
    out.dlEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</dl>");
    out.dt();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<dt>");
    out.dt("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<dt class='foo'>");
    out.dtEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</dt>");
    out.dd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<dd>");
    out.dd("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<dd class='foo'>");
    out.ddEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</dd>");
    out.form();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<form>");
    out.form("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<form class='foo'>");
    out.formEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</form>");
    out.label();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<label>");
    out.label("for='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<label for='foo'>");
    out.labelEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</label>");
    out.input();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input />");
    out.input("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input class='foo' />");
    out.textField();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input type='text' />");
    out.textField("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input type='text' class='foo' />");
    out.password();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input type='password' />");
    out.password("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input type='password' class='foo' />");
    out.hidden();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input type='hidden' />");
    out.hidden("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input type='hidden' class='foo' />");
    out.button();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input type='button' />");
    out.button("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input type='button' class='foo' />");
    out.checkbox();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input type='checkbox' />");
    out.checkbox("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input type='checkbox' class='foo' />");
    out.radio();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input type='radio' />");
    out.radio("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input type='radio' class='foo' />");
    out.submit();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input type='submit' />");
    out.submit("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<input type='submit' class='foo' />");
    out.select();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<select>");
    out.select("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<select class='foo'>");
    out.selectEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</select>");
    out.option();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<option>");
    out.option("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<option class='foo'>");
    out.optionEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</option>");
    out.textArea();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<textarea>");
    out.textArea("rows='20' cols='50'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<textarea rows='20' cols='50'>");
    out.textAreaEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</textarea>");
    out.header();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<header>");
    out.header("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<header class='foo'>");
    out.headerEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</header>");
    out.footer();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<footer>");
    out.footer("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<footer class='foo'>");
    out.footerEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</footer>");
    out.main();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<main>");
    out.main("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<main class='foo'>");
    out.mainEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</main>");
    out.nav();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<nav>");
    out.nav("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<nav class='foo'>");
    out.navEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</nav>");
    out.section();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<section>");
    out.section("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<section class='foo'>");
    out.sectionEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</section>");
    out.article();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<article>");
    out.article("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<article class='foo'>");
    out.articleEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</article>");
    out.aside();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<aside>");
    out.aside("class='foo'");
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "<aside class='foo'>");
    out.asideEnd();
    this.verifyOut(sys.ObjUtil.coerce(buf, sys.Obj.type$), "</aside>");
    return;
  }

  testEsc() {
    this.verifyEsc(null, "null");
    this.verifyEsc(sys.ObjUtil.coerce(56, sys.Obj.type$.toNullable()), "56");
    this.verifyEsc("", "");
    this.verifyEsc("x", "x");
    this.verifyEsc("!@^%()", "!@^%()");
    this.verifyEsc("x>", "x>");
    this.verifyEsc("x>\u01bc", "x>\u01bc");
    this.verifyEsc(">", "&gt;");
    this.verifyEsc("]>", "]&gt;");
    this.verifyEsc("<>&\"'", "&lt;>&amp;&quot;&#39;");
    this.verifyEsc("foo&", "foo&amp;");
    this.verifyEsc("foo&bar", "foo&amp;bar");
    this.verifyEsc("&bar", "&amp;bar");
    return;
  }

  verifyEsc(input,match) {
    let buf = sys.Buf.make();
    let out = WebOutStream.make(buf.out());
    out.esc(input);
    this.verifyEq(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).readAllStr(), match);
    let sb = sys.StrBuf.make();
    (out = WebOutStream.make(sb.out()));
    out.esc(input);
    this.verifyEq(sb.toStr(), match);
    return;
  }

  verifyOut(bufOrStrBuf,match) {
    if (sys.ObjUtil.is(bufOrStrBuf, sys.Buf.type$)) {
      let buf = sys.ObjUtil.coerce(bufOrStrBuf, sys.Buf.type$);
      buf.flip();
      this.verifyEq(buf.readLine(), match);
      buf.clear();
    }
    else {
      let buf = sys.ObjUtil.coerce(bufOrStrBuf, sys.StrBuf.type$);
      this.verifyEq(buf.toStr(), match);
      buf.clear();
    }
    ;
    return;
  }

  static make() {
    const $self = new WebOutStreamTest();
    WebOutStreamTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class CookieTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CookieTest.type$; }

  test() {
    const this$ = this;
    let s = "Bugzilla_login=28; VERSION-foo%2Fbar=unspecified; __u=1303429918|un=(referral)|ud=referral";
    this.verifyEq(sys.MimeType.parseParams(s), sys.Map.__fromLiteral(["Bugzilla_login","VERSION-foo%2Fbar","__u"], ["28","unspecified","1303429918|un=(referral)|ud=referral"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    (s = "mm_testcookie_storage=; foobar=123; _ga_DGW3P9MPX4=GS1.2.1720526761");
    this.verifyEq(sys.MimeType.parseParams(s), sys.Map.__fromLiteral(["mm_testcookie_storage","foobar","_ga_DGW3P9MPX4"], ["","123","GS1.2.1720526761"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyCookie(sys.ObjUtil.coerce(Cookie.fromStr("foo=bar"), Cookie.type$), Cookie.make("foo", "bar"));
    this.verifyCookie(sys.ObjUtil.coerce(Cookie.fromStr("foo=\"bar baz\""), Cookie.type$), Cookie.make("foo", "\"bar baz\""));
    this.verifyCookie(sys.ObjUtil.coerce(Cookie.fromStr("foo=\"_\\\"quot\\\"_\""), Cookie.type$), Cookie.make("foo", "\"_\\\"quot\\\"_\""));
    this.verifyCookie(sys.ObjUtil.coerce(Cookie.fromStr("foo=bar"), Cookie.type$), Cookie.make("foo", "bar"));
    this.verifyCookie(sys.ObjUtil.coerce(Cookie.fromStr("foo=bar; domain=foo.org"), Cookie.type$), Cookie.make("foo", "bar", (it) => {
      it.__domain("foo.org");
      return;
    }));
    this.verifyCookie(sys.ObjUtil.coerce(Cookie.fromStr("foo=bar; Domain=foo.org"), Cookie.type$), Cookie.make("foo", "bar", (it) => {
      it.__domain("foo.org");
      return;
    }));
    this.verifyCookie(sys.ObjUtil.coerce(Cookie.fromStr("foo=bar; Domain=foo.org; Path=/baz/"), Cookie.type$), Cookie.make("foo", "bar", (it) => {
      it.__domain("foo.org");
      it.__path("/baz/");
      return;
    }));
    this.verifyCookie(sys.ObjUtil.coerce(Cookie.fromStr("foo=bar; Domain=foo.org; Path=/baz/; HttpOnly"), Cookie.type$), Cookie.make("foo", "bar", (it) => {
      it.__domain("foo.org");
      it.__path("/baz/");
      return;
    }));
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let c = Cookie.fromStr("=bar");
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let c = Cookie.make("\$path", "bar");
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let c = Cookie.make("foo bar", "bar");
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let c = Cookie.make("foo", "bar\nbaz");
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let c = Cookie.make("foo", "del is ");
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let c = Cookie.make("foo", "a;b;c");
      return;
    });
    return;
  }

  verifyCookie(a,b) {
    this.verifyEq(a.toStr(), b.toStr());
    this.verifyEq(a.name(), b.name());
    this.verifyEq(a.val(), b.val());
    this.verifyEq(a.maxAge(), b.maxAge());
    this.verifyEq(a.domain(), b.domain());
    this.verifyEq(a.path(), b.path());
    return;
  }

  testSession() {
    let c = Cookie.makeSession("key", "val");
    this.verifyEq(c.name(), "key");
    this.verifyEq(c.val(), "val");
    this.verifyEq(sys.ObjUtil.coerce(c.httpOnly(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(c.secure(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(c.sameSite(), "strict");
    (c = Cookie.makeSession("key", "val", sys.Map.__fromLiteral([Cookie.type$.slot("secure")], [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Field"), sys.Type.find("sys::Bool"))));
    this.verifyEq(c.name(), "key");
    this.verifyEq(c.val(), "val");
    this.verifyEq(sys.ObjUtil.coerce(c.httpOnly(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(c.secure(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(c.sameSite(), "strict");
    return;
  }

  static make() {
    const $self = new CookieTest();
    CookieTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class UtilTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UtilTest.type$; }

  testIsToken() {
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(WebUtil.isToken(""), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(WebUtil.isToken("x"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(WebUtil.isToken("x y"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(WebUtil.isToken("5a-3dd_33*&^%22!~"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(WebUtil.isToken("(foo)"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(WebUtil.isToken("foo;bar"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    let chars = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("sys::Bool")), (it) => {
      it.def(sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()));
      return;
    }), sys.Type.find("[sys::Int:sys::Bool]"));
    sys.Range.make(48, 57).each((c) => {
      chars.set(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      return;
    });
    sys.Range.make(97, 122).each((c) => {
      chars.set(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      return;
    });
    sys.Range.make(65, 90).each((c) => {
      chars.set(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      return;
    });
    sys.Str.each("!#\$%&'*+-.^_`|~", (c) => {
      chars.set(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      return;
    });
    for (let c = 0; sys.ObjUtil.compareLT(c, 130); c = sys.Int.increment(c)) {
      this.verifyEq(sys.ObjUtil.coerce(WebUtil.isTokenChar(c), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(chars.get(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable())), sys.Obj.type$.toNullable()));
    }
    ;
    return;
  }

  testToQuotedStr() {
    const this$ = this;
    this.verifyQuotedStr("", "\"\"");
    this.verifyQuotedStr("foo bar", "\"foo bar\"");
    this.verifyQuotedStr("foo\"bar\"baz", "\"foo\\\"bar\\\"baz\"");
    this.verifyErr(sys.ArgErr.type$, (it) => {
      WebUtil.toQuotedStr("foo\nbar");
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      WebUtil.toQuotedStr("");
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      WebUtil.toQuotedStr("\u024a");
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      WebUtil.fromQuotedStr("");
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      WebUtil.fromQuotedStr("\"");
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      WebUtil.fromQuotedStr("\"x");
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      WebUtil.fromQuotedStr("x\"");
      return;
    });
    return;
  }

  verifyQuotedStr(s,expected) {
    this.verifyEq(WebUtil.toQuotedStr(s), expected);
    this.verifyEq(WebUtil.fromQuotedStr(expected), s);
    return;
  }

  testParseList() {
    this.verifyEq(WebUtil.parseList("a"), sys.List.make(sys.Str.type$, ["a"]));
    this.verifyEq(WebUtil.parseList(" a "), sys.List.make(sys.Str.type$, ["a"]));
    this.verifyEq(WebUtil.parseList("a, bob, c,delta "), sys.List.make(sys.Str.type$, ["a", "bob", "c", "delta"]));
    return;
  }

  testParseHeaders() {
    let in$ = sys.Str.toBuf("Host: foobar\r\nExtra1:  space\r\nExtra2: space  \r\nCont: one two \r\n  three\r\n\tfour\r\nCoalesce: a,b\r\nCoalesce: c\r\nCoalesce:  d\r\n\r\n").in();
    let headers = WebUtil.parseHeaders(in$);
    this.verifyEq(sys.ObjUtil.coerce(headers.caseInsensitive(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(headers, sys.Map.__fromLiteral(["Host","Extra1","Extra2","Cont","Coalesce"], ["foobar","space","space","one two three four","a,b,c,d"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    return;
  }

  testChunkInStream() {
    let str = "3\r\nxyz\r\nB\r\nhello there\r\n0\r\n\r\n";
    let in$ = WebUtil.makeChunkedInStream(sys.Str.toBuf(str).in());
    this.verifyEq(in$.readAllStr(), "xyzhello there");
    (in$ = WebUtil.makeChunkedInStream(sys.Str.toBuf(str).in()));
    let buf = sys.Buf.make();
    this.verifyEq(sys.ObjUtil.coerce(in$.readBuf(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Buf.type$), 20), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).readAllStr(), "xyz");
    this.verifyEq(sys.ObjUtil.coerce(in$.readBuf(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Buf.type$), 20), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(11, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).readAllStr(), "hello there");
    this.verifyEq(sys.ObjUtil.coerce(in$.readBuf(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Buf.type$), 20), sys.Obj.type$.toNullable()), null);
    this.verifyEq(sys.ObjUtil.coerce(in$.readBuf(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), sys.Buf.type$), 20), sys.Obj.type$.toNullable()), null);
    (in$ = WebUtil.makeChunkedInStream(sys.Str.toBuf(str).in()));
    in$.readBufFully(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), 14);
    this.verifyEq(buf.readAllStr(), "xyzhello there");
    this.verifyEq(sys.ObjUtil.coerce(in$.read(), sys.Obj.type$.toNullable()), null);
    this.verifyEq(sys.ObjUtil.coerce(in$.readChar(), sys.Obj.type$.toNullable()), null);
    this.verifyEq(sys.ObjUtil.coerce(in$.read(), sys.Obj.type$.toNullable()), null);
    (in$ = WebUtil.makeChunkedInStream(sys.Str.toBuf(str).in()));
    this.verifyEq(sys.ObjUtil.coerce(in$.read(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(120, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(in$.read(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(121, sys.Obj.type$.toNullable()));
    in$.unread(63);
    this.verifyEq(sys.ObjUtil.coerce(in$.read(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(63, sys.Obj.type$.toNullable()));
    in$.unread(50).unread(49);
    in$.readBufFully(sys.ObjUtil.coerce(buf.clear(), sys.Buf.type$.toNullable()), 14);
    this.verifyEq(buf.readAllStr(), "12zhello there");
    (in$ = WebUtil.makeFixedInStream(sys.Str.toBuf("abcdefgh").in(), 3));
    this.verifyEq(in$.readAllStr(), "abc");
    return;
  }

  testFixedOutStream() {
    const this$ = this;
    let buf = sys.Buf.make();
    let out = WebUtil.makeFixedOutStream(buf.out(), 4);
    out.print("abcd");
    this.verifyErr(sys.IOErr.type$, (it) => {
      out.write(120);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).readAllStr(), "abcd");
    let buf2 = sys.Buf.make();
    buf.seek(0);
    (out = WebUtil.makeFixedOutStream(buf2.out(), 2));
    out.writeBuf(sys.ObjUtil.coerce(buf, sys.Buf.type$), 2);
    this.verifyErr(sys.IOErr.type$, (it) => {
      out.writeBuf(sys.ObjUtil.coerce(buf, sys.Buf.type$), 1);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(buf2.flip(), sys.Buf.type$.toNullable()).readAllStr(), "ab");
    return;
  }

  testChunkOutStream() {
    const this$ = this;
    let buf = sys.Buf.make();
    let out = WebUtil.makeChunkedOutStream(buf.out());
    sys.Int.times(2000, (i) => {
      out.printLine(sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
      return;
    });
    out.close();
    let in$ = WebUtil.makeChunkedInStream(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).in());
    sys.Int.times(2000, (i) => {
      this$.verifyEq(in$.readLine(), sys.Int.toStr(i));
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(in$.read(), sys.Obj.type$.toNullable()), null);
    return;
  }

  testParseQVals() {
    this.verifyEq(WebUtil.parseQVals(""), sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Float")));
    this.verifyEq(WebUtil.parseQVals("compress"), sys.Map.__fromLiteral(["compress"], [sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Float")));
    this.verifyEq(WebUtil.parseQVals("compress,gzip"), sys.Map.__fromLiteral(["compress","gzip"], [sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Float")));
    this.verifyEq(WebUtil.parseQVals("compress;q=0.7,gzip;q=0.0"), sys.Map.__fromLiteral(["compress","gzip"], [sys.ObjUtil.coerce(sys.Float.make(0.7), sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Float")));
    let q = WebUtil.parseQVals("foo , compress ; q=0.8 , gzip ; q=0.5 , bar; q=x");
    this.verifyEq(q, sys.Map.__fromLiteral(["foo","compress","gzip","bar"], [sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(sys.Float.make(0.8), sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(sys.Float.make(0.5), sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Float")));
    this.verifyEq(sys.ObjUtil.coerce(q.get("compress"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.8), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(q.get("def"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$.toNullable()));
    return;
  }

  testParseMultiPart() {
    const this$ = this;
    let s = "------WebKitFormBoundaryvx0NalAyBZjdpZAe\nContent-Disposition: form-data; name=\"file1\"; filename=\"empty.txt\"\n\n\n------WebKitFormBoundaryvx0NalAyBZjdpZAe\nContent-Disposition: form-data; name=\"file2\"; filename=\"empty.txt\"\n\n\n------WebKitFormBoundaryvx0NalAyBZjdpZAe--\n";
    let boundary = "----WebKitFormBoundaryvx0NalAyBZjdpZAe";
    WebUtil.parseMultiPart(sys.Str.toBuf(sys.Str.replace(s, "\n", "\r\n")).in(), boundary, (h,in$) => {
      this$.verify(sys.Str.startsWith(h.get("Content-Disposition"), "form-data"));
      this$.verifyEq(in$.readAllStr(), "");
      return;
    });
    (boundary = "---------------------------7dacb195e0632");
    let base64 = "LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS03ZGFjYjE5NWUwNjMyDQpDb250ZW5\n0LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9ImZpbGUxIjsgZmlsZW5hbWU9Ik\nM6XGRldlxmYW5cbXVsdGlwYXJ0LWEudHh0Ig0KQ29udGVudC1UeXBlOiB0ZXh0L3BsY\nWluDQoNCmZvbyBiYXINCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tN2RhY2Ix\nOTVlMDYzMg0KQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPSJmaWx\nlMiI7IGZpbGVuYW1lPSJDOlxkZXZcZmFuXG11bHRpcGFydC1iLnR4dCINCkNvbnRlbn\nQtVHlwZTogdGV4dC9wbGFpbg0KDQoAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobH\nB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1O\nT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4C\nBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7Cxsr\nO0tba3uLm6u7y9vr/AwcLDxMXGxw0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tL\nS03ZGFjYjE5NWUwNjMyDQpDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5h\nbWU9ImZpbGUzIjsgZmlsZW5hbWU9IkM6XGRldlxmYW5cbXVsdGlwYXJ0LWMudHh0Ig0\nKQ29udGVudC1UeXBlOiB0ZXh0L3BsYWluDQoNCi0tLS0tLS0NCi0tLS0tLS0NCi0tLS\n0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tN2RhY2IxOTVlMDYzMi0tDQo=";
    let count = 0;
    WebUtil.parseMultiPart(sys.Buf.fromBase64(base64).in(), boundary, (h,in$) => {
      let $_u66 = ((this$) => { let $_u67 = count;count = sys.Int.increment(count); return $_u67; })(this$);
      if (sys.ObjUtil.equals($_u66, 0)) {
        this$.verifyEq(in$.readAllStr(), "foo bar");
      }
      else if (sys.ObjUtil.equals($_u66, 1)) {
        sys.Int.times(100, (i) => {
          this$.verifyEq(sys.ObjUtil.coerce(in$.readU1(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
          return;
        });
        in$.unread(171).unread(205);
        this$.verifyEq(sys.ObjUtil.coerce(in$.readU2(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(52651, sys.Obj.type$.toNullable()));
        let buf = sys.Buf.make();
        in$.readBufFully(buf, 100);
        sys.Int.times(100, (i) => {
          this$.verifyEq(sys.ObjUtil.coerce(buf.get(i), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(100, i), sys.Obj.type$.toNullable()));
          return;
        });
        this$.verifyNull(sys.ObjUtil.coerce(in$.read(), sys.Obj.type$.toNullable()));
      }
      else if (sys.ObjUtil.equals($_u66, 2)) {
        this$.verifyEq(in$.readAllStr(false), "-------\r\n-------");
      }
      ;
      return;
    });
    (boundary = "---------------------------41184676334");
    (s = "-----------------------------41184676334\nContent-Disposition: form-data; name=\"\"; filename=\"something.txt\"\nContent-Type: text/plain\n\nhello world\n-----------------------------41184676334--\n");
    let buf = sys.Buf.make();
    let numRead = 0;
    WebUtil.parseMultiPart(sys.Str.toBuf(sys.Str.replace(s, "\n", "\r\n")).in(), boundary, (h,in$) => {
      in$.pipe(buf.out());
      (numRead = sys.ObjUtil.coerce(sys.ObjUtil.trap(in$,"numRead", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$));
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).readAllStr(), "hello world");
    this.verifyEq(sys.ObjUtil.coerce(numRead, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(11, sys.Obj.type$.toNullable()));
    (s = "------WebKitFormBoundaryZ7PdCaCUA42JfPxv\nContent-Disposition: form-data; name=\"name\"\n\nFooBar\n------WebKitFormBoundaryZ7PdCaCUA42JfPxv\nContent-Disposition: form-data; name=\"ver\"\n\n1.0.5\n------WebKitFormBoundaryZ7PdCaCUA42JfPxv\nContent-Disposition: form-data; name=\"file\"; filename=\"temp.txt\"\nContent-Type: application/octet-stream\n\nHello,\nWorld\n:)\n------WebKitFormBoundaryZ7PdCaCUA42JfPxv--\n");
    (boundary = "----WebKitFormBoundaryZ7PdCaCUA42JfPxv");
    (numRead = 0);
    WebUtil.parseMultiPart(sys.Str.toBuf(sys.Str.replace(s, "\n", "\r\n")).in(), boundary, (h,in$) => {
      ((this$) => { let $_u68 = numRead;numRead = sys.Int.increment(numRead); return $_u68; })(this$);
      let disp = h.get("Content-Disposition");
      this$.verify(sys.Str.startsWith(disp, "form-data;"));
      let map = sys.MimeType.parseParams(sys.Str.trim(sys.Str.getRange(disp, sys.Range.make(10, -1))));
      let $_u69 = map.get("name");
      if (sys.ObjUtil.equals($_u69, "name")) {
        this$.verifyEq(in$.readAllStr(), "FooBar");
      }
      else if (sys.ObjUtil.equals($_u69, "ver")) {
        this$.verifyEq(in$.readAllStr(), "1.0.5");
      }
      else if (sys.ObjUtil.equals($_u69, "file")) {
        this$.verifyEq(in$.readAllStr(), "Hello,\nWorld\n:)");
      }
      ;
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(numRead, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    return;
  }

  static main(args) {
    const this$ = this;
    sys.Uri.fromStr("multipart-a").toFile().out().print("foo bar").close();
    let out = sys.Uri.fromStr("multipart-b").toFile().out();
    sys.Int.times(200, (i) => {
      out.write(i);
      return;
    });
    out.close();
    sys.Uri.fromStr("multipart-c").toFile().out().print("-------\r\n-------").close();
    return;
  }

  testMultiPart1023() {
    const this$ = this;
    let bound = "XXXXX";
    let buf = sys.Buf.make();
    let out = buf.out();
    out.print("--").print(bound).print("\r\n");
    out.print("name: foo1\r\n");
    out.print("\r\n");
    sys.Int.times(1023, (i) => {
      out.write(((this$) => { if (sys.ObjUtil.equals(i, 1022)) return 171; return 0; })(this$));
      return;
    });
    out.print("\r\n");
    out.print("--").print(bound).print("\r\n");
    out.print("name: foo2\r\n");
    out.print("\r\n");
    out.print("Data-Data-Data");
    out.print("\r\n");
    out.print("--").print(bound).print("--\r\n");
    let names = sys.List.make(sys.Str.type$);
    let vals = sys.List.make(sys.Buf.type$);
    WebUtil.parseMultiPart(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).in(), bound, (headers,in$) => {
      names.add(sys.ObjUtil.coerce(headers.get("name"), sys.Str.type$));
      vals.add(in$.readAllBuf());
      return;
    });
    this.verifyEq(names, sys.List.make(sys.Str.type$, ["foo1", "foo2"]));
    this.verifyEq(sys.ObjUtil.coerce(vals.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(vals.get(0).size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1023, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(vals.get(0).get(1022), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(171, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(vals.get(1).size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(14, sys.Obj.type$.toNullable()));
    return;
  }

  static make() {
    const $self = new UtilTest();
    UtilTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

const p = sys.Pod.add$('web');
const xp = sys.Param.noParams$();
let m;
WebReq.type$ = p.at$('WebReq','sys::Obj',[],{},8193,WebReq);
WebRes.type$ = p.at$('WebRes','sys::Obj',[],{},8193,WebRes);
WebOutStream.type$ = p.at$('WebOutStream','sys::OutStream',[],{'sys::Js':""},8192,WebOutStream);
Weblet.type$ = p.am$('Weblet','sys::Obj',[],{},8449,Weblet);
WebMod.type$ = p.at$('WebMod','sys::Obj',['web::Weblet'],{},8195,WebMod);
FileWeblet.type$ = p.at$('FileWeblet','sys::Obj',['web::Weblet'],{},8192,FileWeblet);
WebUtil.type$ = p.at$('WebUtil','sys::Obj',[],{'sys::Js':""},8192,WebUtil);
ChunkInStream.type$ = p.at$('ChunkInStream','sys::InStream',[],{'sys::Js':""},128,ChunkInStream);
FixedOutStream.type$ = p.at$('FixedOutStream','sys::OutStream',[],{'sys::Js':""},128,FixedOutStream);
ChunkOutStream.type$ = p.at$('ChunkOutStream','sys::OutStream',[],{'sys::Js':""},128,ChunkOutStream);
MultiPartInStream.type$ = p.at$('MultiPartInStream','sys::InStream',[],{'sys::Js':""},128,MultiPartInStream);
WebSocket.type$ = p.at$('WebSocket','sys::Obj',[],{},8192,WebSocket);
FilePack.type$ = p.at$('FilePack','sys::Obj',['web::Weblet'],{},8194,FilePack);
WebClient.type$ = p.at$('WebClient','sys::Obj',[],{},8192,WebClient);
WebSession.type$ = p.at$('WebSession','sys::Obj',[],{},8193,WebSession);
Cookie.type$ = p.at$('Cookie','sys::Obj',[],{'sys::Js':""},8194,Cookie);
WebJsMode.type$ = p.at$('WebJsMode','sys::Enum',[],{'sys::Js':"",'sys::NoDoc':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,WebJsMode);
WebClientTest.type$ = p.at$('WebClientTest','sys::Test',[],{},8192,WebClientTest);
FilePackTest.type$ = p.at$('FilePackTest','sys::Test',[],{},8192,FilePackTest);
WebOutStreamTest.type$ = p.at$('WebOutStreamTest','sys::Test',[],{},8192,WebOutStreamTest);
CookieTest.type$ = p.at$('CookieTest','sys::Test',[],{'sys::Js':""},8192,CookieTest);
UtilTest.type$ = p.at$('UtilTest','sys::Test',[],{'sys::Js':""},8192,UtilTest);
WebReq.type$.af$('mod',270337,'web::WebMod',{}).af$('modBase',73728,'sys::Uri',{}).af$('modRelVal',67584,'sys::Uri?',{}).af$('stashRef',67584,'[sys::Str:sys::Obj?]',{}).af$('absUri$Store',722944,'sys::Obj?',{}).af$('locales$Store',722944,'sys::Obj?',{}).af$('cookies$Store',722944,'sys::Obj?',{}).af$('form$Store',722944,'sys::Obj?',{}).am$('method',270337,'sys::Str',xp,{}).am$('isGet',270337,'sys::Bool',xp,{}).am$('isPost',270337,'sys::Bool',xp,{}).am$('version',270337,'sys::Version',xp,{}).am$('remoteAddr',270337,'inet::IpAddr',xp,{}).am$('remotePort',270337,'sys::Int',xp,{}).am$('uri',270337,'sys::Uri',xp,{}).am$('absUri',794624,'sys::Uri',xp,{}).am$('modRel',8192,'sys::Uri',xp,{}).am$('headers',270337,'[sys::Str:sys::Str]',xp,{}).am$('locales',794624,'sys::Locale[]',xp,{}).am$('cookies',794624,'[sys::Str:sys::Str]',xp,{}).am$('session',270337,'web::WebSession',xp,{}).am$('form',794624,'[sys::Str:sys::Str]?',xp,{}).am$('in',270337,'sys::InStream',xp,{}).am$('socketOptions',270337,'inet::SocketOptions',xp,{}).am$('socket',270337,'inet::TcpSocket',xp,{'sys::NoDoc':""}).am$('stash',270336,'[sys::Str:sys::Obj?]',xp,{}).am$('parseMultiPartForm',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cb','|sys::Str,sys::InStream,[sys::Str:sys::Str]->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('absUri$Once',133120,'sys::Uri',xp,{}).am$('locales$Once',133120,'sys::Locale[]',xp,{}).am$('cookies$Once',133120,'[sys::Str:sys::Str]',xp,{}).am$('form$Once',133120,'[sys::Str:sys::Str]?',xp,{});
WebRes.type$.af$('statusCode',270337,'sys::Int',{}).af$('statusPhrase',270337,'sys::Str?',{}).af$('statusMsg',106498,'[sys::Int:sys::Str]',{}).am$('headers',270337,'[sys::Str:sys::Str]',xp,{}).am$('cookies',270337,'web::Cookie[]',xp,{}).am$('removeCookie',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('isCommitted',270337,'sys::Bool',xp,{}).am$('out',270337,'web::WebOutStream',xp,{}).am$('redirect',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('statusCode','sys::Int',true)]),{}).am$('sendErr',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('statusCode','sys::Int',false),new sys.Param('msg','sys::Str?',true)]),{}).am$('isDone',270337,'sys::Bool',xp,{}).am$('done',270337,'sys::Void',xp,{}).am$('upgrade',270337,'inet::TcpSocket',sys.List.make(sys.Param.type$,[new sys.Param('statusCode','sys::Int',true)]),{'sys::NoDoc':""}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
WebOutStream.type$.af$('cssUris',67584,'sys::Uri[]?',{}).af$('jsUris',67584,'sys::Uri[]?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('w',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('tab',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('numSpaces','sys::Int',true)]),{}).am$('nl',8192,'sys::This',xp,{}).am$('prolog',8192,'sys::This',xp,{}).am$('tag',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('elemName','sys::Str',false),new sys.Param('attrs','sys::Str?',true),new sys.Param('empty','sys::Bool',true)]),{}).am$('tagEnd',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('elemName','sys::Str',false)]),{}).am$('docType',8192,'sys::This',xp,{}).am$('docType5',8192,'sys::This',xp,{}).am$('html',8192,'sys::This',xp,{}).am$('htmlEnd',8192,'sys::This',xp,{}).am$('head',8192,'sys::This',xp,{}).am$('headEnd',8192,'sys::This',xp,{}).am$('title',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('titleEnd',8192,'sys::This',xp,{}).am$('includeCss',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('href','sys::Uri',false)]),{}).am$('includeJs',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('href','sys::Uri?',true)]),{}).am$('initJs',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('env','[sys::Str:sys::Str]',false)]),{}).am$('atom',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('href','sys::Uri',false),new sys.Param('attrs','sys::Str?',true)]),{}).am$('rss',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('href','sys::Uri',false),new sys.Param('attrs','sys::Str?',true)]),{}).am$('favIcon',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('href','sys::Uri',false),new sys.Param('attrs','sys::Str?',true)]),{}).am$('style',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('styleEnd',8192,'sys::This',xp,{}).am$('script',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('scriptEnd',8192,'sys::This',xp,{}).am$('body',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('bodyEnd',8192,'sys::This',xp,{}).am$('h1',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('h1End',8192,'sys::This',xp,{}).am$('h2',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('h2End',8192,'sys::This',xp,{}).am$('h3',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('h3End',8192,'sys::This',xp,{}).am$('h4',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('h4End',8192,'sys::This',xp,{}).am$('h5',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('h5End',8192,'sys::This',xp,{}).am$('h6',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('h6End',8192,'sys::This',xp,{}).am$('div',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('divEnd',8192,'sys::This',xp,{}).am$('span',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('spanEnd',8192,'sys::This',xp,{}).am$('p',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('pEnd',8192,'sys::This',xp,{}).am$('b',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('bEnd',8192,'sys::This',xp,{}).am$('i',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('iEnd',8192,'sys::This',xp,{}).am$('em',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('emEnd',8192,'sys::This',xp,{}).am$('pre',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('preEnd',8192,'sys::This',xp,{}).am$('code',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('codeEnd',8192,'sys::This',xp,{}).am$('hr',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('br',8192,'sys::This',xp,{}).am$('a',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('href','sys::Uri',false),new sys.Param('attrs','sys::Str?',true)]),{}).am$('aEnd',8192,'sys::This',xp,{}).am$('img',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Uri',false),new sys.Param('attrs','sys::Str?',true)]),{}).am$('table',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('tableEnd',8192,'sys::This',xp,{}).am$('thead',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('theadEnd',8192,'sys::This',xp,{}).am$('tbody',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('tbodyEnd',8192,'sys::This',xp,{}).am$('tfoot',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('tfootEnd',8192,'sys::This',xp,{}).am$('tr',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('trEnd',8192,'sys::This',xp,{}).am$('th',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('thEnd',8192,'sys::This',xp,{}).am$('td',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('tdEnd',8192,'sys::This',xp,{}).am$('ul',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('ulEnd',8192,'sys::This',xp,{}).am$('ol',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('olEnd',8192,'sys::This',xp,{}).am$('li',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('liEnd',8192,'sys::This',xp,{}).am$('dl',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('dlEnd',8192,'sys::This',xp,{}).am$('dt',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('dtEnd',8192,'sys::This',xp,{}).am$('dd',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('ddEnd',8192,'sys::This',xp,{}).am$('form',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('formEnd',8192,'sys::This',xp,{}).am$('label',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('labelEnd',8192,'sys::This',xp,{}).am$('input',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('textField',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('password',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('hidden',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('button',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('checkbox',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('radio',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('submit',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('select',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('selectEnd',8192,'sys::This',xp,{}).am$('option',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('optionEnd',8192,'sys::This',xp,{}).am$('textArea',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('textAreaEnd',8192,'sys::This',xp,{}).am$('header',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('headerEnd',8192,'sys::This',xp,{}).am$('footer',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('footerEnd',8192,'sys::This',xp,{}).am$('main',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('mainEnd',8192,'sys::This',xp,{}).am$('nav',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('navEnd',8192,'sys::This',xp,{}).am$('section',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('sectionEnd',8192,'sys::This',xp,{}).am$('article',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('articleEnd',8192,'sys::This',xp,{}).am$('aside',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('attrs','sys::Str?',true)]),{}).am$('asideEnd',8192,'sys::This',xp,{}).am$('esc',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{});
Weblet.type$.am$('req',270336,'web::WebReq',xp,{}).am$('res',270336,'web::WebRes',xp,{}).am$('onService',270336,'sys::Void',xp,{}).am$('onGet',270336,'sys::Void',xp,{}).am$('onHead',270336,'sys::Void',xp,{}).am$('onPost',270336,'sys::Void',xp,{}).am$('onPut',270336,'sys::Void',xp,{}).am$('onDelete',270336,'sys::Void',xp,{}).am$('onOptions',270336,'sys::Void',xp,{}).am$('onTrace',270336,'sys::Void',xp,{});
WebMod.type$.am$('onStart',270336,'sys::Void',xp,{}).am$('onStop',270336,'sys::Void',xp,{}).am$('makeResOut',270336,'web::WebOutStream?',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{'sys::NoDoc':""}).am$('make',139268,'sys::Void',xp,{});
FileWeblet.type$.af$('file',73730,'sys::File',{}).af$('extraResHeaders',73728,'[sys::Str:sys::Str]?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('modified',270336,'sys::DateTime',xp,{}).am$('etag',270336,'sys::Str',xp,{}).am$('checkUnderDir',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('dir','sys::File',false)]),{}).am$('onService',271360,'sys::Void',xp,{}).am$('onGet',271360,'sys::Void',xp,{}).am$('isGzipFile',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('checkNotModified',266240,'sys::Bool',xp,{}).am$('doCheckNotModified',32898,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false),new sys.Param('etag','sys::Str',false),new sys.Param('modified','sys::DateTime',false)]),{});
WebUtil.type$.af$('tokenChars',100354,'sys::Bool[]',{}).af$('CR',98434,'sys::Int',{}).af$('LF',98434,'sys::Int',{}).af$('HT',98434,'sys::Int',{}).af$('SP',98434,'sys::Int',{}).af$('maxTokenSize',98434,'sys::Int',{}).am$('isToken',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('isTokenChar',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('toQuotedStr',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('fromQuotedStr',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('parseList',40962,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('parseHeaders',40962,'[sys::Str:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('doParseHeaders',32898,'[sys::Str:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('cookies','web::Cookie[]?',false)]),{}).am$('token',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('sep','sys::Int',false)]),{}).am$('parseQVals',40962,'[sys::Str:sys::Float]',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('writeHeaders',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('headers','[sys::Str:sys::Str]',false)]),{'sys::NoDoc':""}).am$('headersToCharset',40962,'sys::Charset',sys.List.make(sys.Param.type$,[new sys.Param('headers','[sys::Str:sys::Str]',false)]),{}).am$('makeContentInStream',40962,'sys::InStream',sys.List.make(sys.Param.type$,[new sys.Param('headers','[sys::Str:sys::Str]',false),new sys.Param('in','sys::InStream',false)]),{}).am$('doMakeContentInStream',34818,'sys::InStream?',sys.List.make(sys.Param.type$,[new sys.Param('headers','[sys::Str:sys::Str]',false),new sys.Param('in','sys::InStream',false)]),{}).am$('makeContentOutStream',40962,'sys::OutStream?',sys.List.make(sys.Param.type$,[new sys.Param('headers','[sys::Str:sys::Str]',false),new sys.Param('out','sys::OutStream',false)]),{}).am$('makeFixedInStream',40962,'sys::InStream',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('fixed','sys::Int',false)]),{}).am$('makeChunkedInStream',40962,'sys::InStream',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('makeFixedOutStream',40962,'sys::OutStream',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('fixed','sys::Int',false)]),{}).am$('makeChunkedOutStream',40962,'sys::OutStream',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('readLine',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{'sys::NoDoc':""}).am$('parseMultiPart',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('boundary','sys::Str',false),new sys.Param('cb','|[sys::Str:sys::Str],sys::InStream->sys::Void|',false)]),{}).am$('jsMain',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('main','sys::Str',false),new sys.Param('env','[sys::Str:sys::Str]?',true)]),{'sys::Deprecated':"sys::Deprecated{msg=\"use WebOutStream.initJs\";}"}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
ChunkInStream.type$.af$('in',73728,'sys::InStream',{}).af$('noMoreChunks',73728,'sys::Bool',{}).af$('chunkRem',73728,'sys::Int',{}).af$('pushback',73728,'sys::Int[]?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('fixed','sys::Int?',true)]),{}).am$('read',271360,'sys::Int?',xp,{}).am$('readBuf',271360,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false),new sys.Param('n','sys::Int',false)]),{}).am$('unread',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{}).am$('checkChunk',2048,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
FixedOutStream.type$.af$('out',73728,'sys::OutStream',{}).af$('fixed',73728,'sys::Int?',{}).af$('written',73728,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('fixed','sys::Int',false)]),{}).am$('write',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{}).am$('writeBuf',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false),new sys.Param('n','sys::Int',true)]),{}).am$('flush',271360,'sys::This',xp,{}).am$('close',271360,'sys::Bool',xp,{}).am$('checkChunk',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false)]),{});
ChunkOutStream.type$.af$('chunkSize',106498,'sys::Int',{}).af$('out',73728,'sys::OutStream',{}).af$('buffer',73728,'sys::Buf?',{}).af$('closed',73728,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('write',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{}).am$('writeBuf',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false),new sys.Param('n','sys::Int',true)]),{}).am$('flush',271360,'sys::This',xp,{}).am$('close',271360,'sys::Bool',xp,{}).am$('checkChunk',2048,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
MultiPartInStream.type$.af$('in',73728,'sys::InStream',{}).af$('boundary',73728,'sys::Str',{}).af$('curLine',73728,'sys::Buf',{}).af$('pushback',73728,'sys::Int[]?',{}).af$('endOfPart',73728,'sys::Bool',{}).af$('endOfParts',73728,'sys::Bool',{}).af$('numRead',73728,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('boundary','sys::Str',false)]),{}).am$('read',271360,'sys::Int?',xp,{}).am$('readBuf',271360,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false),new sys.Param('n','sys::Int',false)]),{}).am$('unread',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::Int',false)]),{}).am$('checkLine',2048,'sys::Bool',xp,{});
WebSocket.type$.af$('opContinue',100354,'sys::Int',{}).af$('opText',100354,'sys::Int',{}).af$('opBinary',100354,'sys::Int',{}).af$('opClose',100354,'sys::Int',{}).af$('opPing',100354,'sys::Int',{}).af$('opPong',100354,'sys::Int',{}).af$('receiveAgain',100354,'sys::List',{}).af$('socket',67584,'inet::TcpSocket',{}).af$('maskOnSend',67584,'sys::Bool',{}).af$('closed',67584,'sys::Bool',{}).am$('openClient',40962,'web::WebSocket',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('headers','[sys::Str:sys::Str]?',true)]),{}).am$('openServer',40962,'web::WebSocket',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('checkHeader',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('headers','[sys::Str:sys::Str]',false),new sys.Param('name','sys::Str',false),new sys.Param('expected','sys::Str?',false)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('socket','inet::TcpSocket',false),new sys.Param('maskOnSend','sys::Bool',false)]),{}).am$('socketOptions',8192,'inet::SocketOptions',xp,{'sys::Deprecated':"sys::Deprecated{msg=\"Socket should be configured using SocketConfig\";}"}).am$('isClosed',8192,'sys::Bool',xp,{}).am$('receive',8192,'sys::Obj?',xp,{}).am$('receiveBuf',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf?',false)]),{'sys::NoDoc':""}).am$('doReceive',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('payload','sys::Buf?',false)]),{}).am$('send',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj',false)]),{}).am$('ping',8192,'sys::Void',xp,{'sys::NoDoc':""}).am$('pong',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('echo','sys::Buf',false)]),{}).am$('doSend',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('op','sys::Int',false),new sys.Param('payload','sys::Buf',false)]),{}).am$('close',8192,'sys::Bool',xp,{}).am$('err',34818,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('secDigest',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
FilePack.type$.af$('buf',73730,'sys::Buf',{'sys::NoDoc':""}).af$('etag',73730,'sys::Str',{'sys::NoDoc':""}).af$('modified',73730,'sys::DateTime',{'sys::NoDoc':""}).af$('mimeType',73730,'sys::MimeType',{'sys::NoDoc':""}).af$('uri',8192,'sys::Uri',{'sys::NoDoc':""}).af$('uriRef',67586,'concurrent::AtomicRef',{}).am$('makeFiles',40966,'web::FilePack?',sys.List.make(sys.Param.type$,[new sys.Param('files','sys::File[]',false),new sys.Param('mimeType','sys::MimeType?',true)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false),new sys.Param('mimeType','sys::MimeType',false)]),{}).am$('onGet',271360,'sys::Void',xp,{}).am$('pack',40962,'sys::OutStream',sys.List.make(sys.Param.type$,[new sys.Param('files','sys::File[]',false),new sys.Param('out','sys::OutStream',false)]),{}).am$('pipeToPack',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::File',false),new sys.Param('out','sys::OutStream',false)]),{}).am$('toAppJsFiles',40962,'sys::File[]',sys.List.make(sys.Param.type$,[new sys.Param('pods','sys::Pod[]',false)]),{}).am$('toPodJsFile',40962,'sys::File?',sys.List.make(sys.Param.type$,[new sys.Param('pod','sys::Pod',false)]),{}).am$('toPodJsFiles',40962,'sys::File[]',sys.List.make(sys.Param.type$,[new sys.Param('pods','sys::Pod[]',false)]),{}).am$('toEtcJsFiles',40962,'sys::File[]',xp,{}).am$('moduleSystem',40962,'sys::Obj',xp,{'sys::NoDoc':""}).am$('compileJsFile',34818,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('cname','sys::Str',false),new sys.Param('fname','sys::Uri',false),new sys.Param('arg','sys::Obj?',true)]),{}).am$('toMimeJsFile',40962,'sys::File',xp,{}).am$('toUnitsJsFile',40962,'sys::File',xp,{}).am$('toIndexPropsJsFile',40962,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('pods','sys::Pod[]',true)]),{}).am$('toTimezonesJsFile',40962,'sys::File',xp,{'sys::Deprecated':"sys::Deprecated{msg=\"tz.js is now included by default in sys.js\";}"}).am$('toLocaleJsFile',40962,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('locale','sys::Locale',false),new sys.Param('pods','sys::Pod[]',true)]),{}).am$('toPodJsMapFile',40962,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('files','sys::File[]',false),new sys.Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('toAppCssFiles',40962,'sys::File[]',sys.List.make(sys.Param.type$,[new sys.Param('pods','sys::Pod[]',false)]),{}).am$('toPodCssFiles',40962,'sys::File[]',sys.List.make(sys.Param.type$,[new sys.Param('pods','sys::Pod[]',false)]),{}).am$('main',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{'sys::NoDoc':""}).am$('mainReport',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::File[]',false)]),{});
WebClient.type$.af$('socketConfig',73728,'inet::SocketConfig',{}).af$('reqUri',73728,'sys::Uri',{}).af$('reqMethod',73728,'sys::Str',{}).af$('reqVersion',73728,'sys::Version',{}).af$('reqHeaders',73728,'[sys::Str:sys::Str]',{}).af$('resVersion',73728,'sys::Version',{}).af$('resCode',73728,'sys::Int',{}).af$('resPhrase',73728,'sys::Str',{}).af$('resHeaders',73728,'[sys::Str:sys::Str]',{}).af$('cookies',73728,'web::Cookie[]',{}).af$('followRedirects',73728,'sys::Bool',{}).af$('proxy',73728,'sys::Uri?',{}).af$('ver10',100354,'sys::Version',{}).af$('ver11',100354,'sys::Version',{}).af$('noHeaders',100354,'[sys::Str:sys::Str]',{}).af$('resInStream',67584,'sys::InStream?',{}).af$('reqOutStream',67584,'sys::OutStream?',{}).af$('socket',65664,'inet::TcpSocket?',{}).af$('numRedirects',67584,'sys::Int',{}).af$('socketOptions$Store',722944,'sys::Obj?',{}).af$('proxyExceptions$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('reqUri','sys::Uri?',true)]),{}).am$('reqOut',8192,'sys::OutStream',xp,{}).am$('resHeader',8192,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('resIn',8192,'sys::InStream',xp,{}).am$('resStr',8192,'sys::Str',xp,{}).am$('resBuf',8192,'sys::Buf',xp,{}).am$('socketOptions',532480,'inet::SocketOptions',xp,{'sys::Deprecated':"sys::Deprecated{msg=\"Use WebClient.socketConfig to configure sockets\";}"}).am$('proxyDef',34818,'sys::Uri?',xp,{}).am$('isProxy',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('proxyExceptions',526336,'sys::Regex[]',xp,{}).am$('authBasic',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',false),new sys.Param('password','sys::Str',false)]),{}).am$('getStr',8192,'sys::Str',xp,{}).am$('getBuf',8192,'sys::Buf',xp,{}).am$('getIn',8192,'sys::InStream',xp,{}).am$('postForm',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('form','[sys::Str:sys::Str]',false)]),{}).am$('postStr',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('content','sys::Str',false)]),{}).am$('postBuf',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('postFile',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('writeForm',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Str',false),new sys.Param('form','[sys::Str:sys::Str]',false)]),{}).am$('writeStr',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Str',false),new sys.Param('content','sys::Str',false)]),{}).am$('writeBuf',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Str',false),new sys.Param('content','sys::Buf',false)]),{}).am$('writeFile',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Str',false),new sys.Param('file','sys::File',false)]),{}).am$('writeReq',8192,'sys::This',xp,{}).am$('openHttpsTunnel',2048,'inet::TcpSocket',xp,{}).am$('readRes',8192,'sys::This',xp,{}).am$('checkFollowRedirect',2048,'sys::Bool',xp,{}).am$('isConnected',8192,'sys::Bool',xp,{}).am$('close',8192,'sys::This',xp,{}).am$('socketOptions$Once',133120,'inet::SocketOptions',xp,{}).am$('proxyExceptions$Once',133120,'sys::Regex[]',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
WebSession.type$.am$('id',270337,'sys::Str',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('each',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj?,sys::Str->sys::Void|',false)]),{}).am$('get',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('set',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{'sys::Operator':""}).am$('remove',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('map',270337,'[sys::Str:sys::Obj?]',xp,{'sys::Deprecated':"sys::Deprecated{msg=\"Use get, set, remove, each\";}"}).am$('delete',270337,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
Cookie.type$.af$('name',73730,'sys::Str',{}).af$('val',73730,'sys::Str',{}).af$('maxAge',73730,'sys::Duration?',{}).af$('domain',73730,'sys::Str?',{}).af$('path',73730,'sys::Str?',{}).af$('secure',73730,'sys::Bool',{}).af$('httpOnly',73730,'sys::Bool',{}).af$('sameSite',73730,'sys::Str?',{}).am$('fromStr',40966,'web::Cookie?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('makeSession',40962,'web::Cookie',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Str',false),new sys.Param('overrides','[sys::Field:sys::Obj?]?',true)]),{'sys::NoDoc':""}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Str',false),new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('toNameValStr',128,'sys::Str',xp,{});
WebJsMode.type$.af$('js',106506,'web::WebJsMode',{}).af$('es',106506,'web::WebJsMode',{}).af$('vals',106498,'web::WebJsMode[]',{}).af$('curRef',100354,'concurrent::AtomicRef',{}).am$('isEs',8192,'sys::Bool',xp,{}).am$('cur',40962,'web::WebJsMode',xp,{}).am$('setCur',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cur','web::WebJsMode',false)]),{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'web::WebJsMode?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
WebClientTest.type$.am$('testBadConfig',8192,'sys::Void',xp,{}).am$('testCookies',8192,'sys::Void',xp,{}).am$('testGetFixed',8192,'sys::Void',xp,{}).am$('testGetChunked',8192,'sys::Void',xp,{}).am$('testGetConvenience',8192,'sys::Void',xp,{}).am$('testRedirects',8192,'sys::Void',xp,{}).am$('verifyRedirect',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('origUri','sys::Uri',false),new sys.Param('expected','sys::Uri?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
FilePackTest.type$.am$('testPack',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
WebOutStreamTest.type$.am$('testGeneral',8192,'sys::Void',xp,{}).am$('testXml',8192,'sys::Void',xp,{}).am$('testHtml',8192,'sys::Void',xp,{}).am$('testEsc',8192,'sys::Void',xp,{}).am$('verifyEsc',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::Obj?',false),new sys.Param('match','sys::Str',false)]),{}).am$('verifyOut',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('bufOrStrBuf','sys::Obj',false),new sys.Param('match','sys::Str?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
CookieTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('verifyCookie',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','web::Cookie',false),new sys.Param('b','web::Cookie',false)]),{}).am$('testSession',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
UtilTest.type$.am$('testIsToken',8192,'sys::Void',xp,{}).am$('testToQuotedStr',8192,'sys::Void',xp,{}).am$('verifyQuotedStr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('expected','sys::Str',false)]),{}).am$('testParseList',8192,'sys::Void',xp,{}).am$('testParseHeaders',8192,'sys::Void',xp,{}).am$('testChunkInStream',8192,'sys::Void',xp,{}).am$('testFixedOutStream',8192,'sys::Void',xp,{}).am$('testChunkOutStream',8192,'sys::Void',xp,{}).am$('testParseQVals',8192,'sys::Void',xp,{}).am$('testParseMultiPart',8192,'sys::Void',xp,{}).am$('main',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('testMultiPart1023',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "web");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;concurrent 1.0;inet 1.0");
m.set("pod.summary", "Standard weblet APIs for processing HTTP requests");
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
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/fantom-lang/fantom");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  WebReq,
  WebRes,
  WebOutStream,
  Weblet,
  WebMod,
  FileWeblet,
  WebUtil,
  WebSocket,
  FilePack,
  WebClient,
  WebSession,
  Cookie,
  WebJsMode,
  WebClientTest,
  FilePackTest,
  WebOutStreamTest,
  CookieTest,
  UtilTest,
};
