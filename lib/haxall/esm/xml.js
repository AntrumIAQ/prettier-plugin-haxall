// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class XErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XErr.type$; }

  #line = 0;

  line() { return this.#line; }

  __line(it) { if (it === undefined) return this.#line; else this.#line = it; }

  #col = 0;

  col() { return this.#col; }

  __col(it) { if (it === undefined) return this.#col; else this.#col = it; }

  static make(message,line,col,cause) {
    const $self = new XErr();
    XErr.make$($self,message,line,col,cause);
    return $self;
  }

  static make$($self,message,line,col,cause) {
    if (message === undefined) message = null;
    if (line === undefined) line = 0;
    if (col === undefined) col = 0;
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.ObjUtil.coerce(message, sys.Str.type$), cause);
    $self.#line = line;
    $self.#col = col;
    return;
  }

  toStr() {
    let s = sys.Err.prototype.toStr.call(this);
    if (sys.ObjUtil.compareGT(this.#line, 0)) {
      if (sys.ObjUtil.compareGT(this.#col, 0)) {
        s = sys.Str.plus(s, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(" [line ", sys.ObjUtil.coerce(this.#line, sys.Obj.type$.toNullable())), ", col "), sys.ObjUtil.coerce(this.#col, sys.Obj.type$.toNullable())), "]"));
      }
      else {
        s = sys.Str.plus(s, sys.Str.plus(sys.Str.plus(" [line ", sys.ObjUtil.coerce(this.#line, sys.Obj.type$.toNullable())), "]"));
      }
      ;
    }
    ;
    return s;
  }

}

class XParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#doc = XDoc.make();
    this.#depth = -1;
    this.#line = 1;
    this.#col = 1;
    this.#pushback = -1;
    this.#pushback2 = -1;
    this.#stack = sys.List.make(XElem.type$, [XElem.make("")]);
    this.#nsStack = sys.List.make(XNsDefs.type$, [XNsDefs.make()]);
    this.#buf = sys.StrBuf.make();
    this.#entityBuf = sys.StrBuf.make();
    return;
  }

  typeof() { return XParser.type$; }

  #doc = null;

  doc() {
    return this.#doc;
  }

  #nodeType = null;

  nodeType() {
    return this.#nodeType;
  }

  #depth = 0;

  depth() {
    return this.#depth;
  }

  #line = 0;

  line() {
    return this.#line;
  }

  #col = 0;

  col() {
    return this.#col;
  }

  static #nameMap = undefined;

  static nameMap() {
    if (XParser.#nameMap === undefined) {
      XParser.static$init();
      if (XParser.#nameMap === undefined) XParser.#nameMap = null;
    }
    return XParser.#nameMap;
  }

  static #spaceMap = undefined;

  static spaceMap() {
    if (XParser.#spaceMap === undefined) {
      XParser.static$init();
      if (XParser.#spaceMap === undefined) XParser.#spaceMap = null;
    }
    return XParser.#spaceMap;
  }

  static #unresolvedNs = undefined;

  static unresolvedNs() {
    if (XParser.#unresolvedNs === undefined) {
      XParser.static$init();
      if (XParser.#unresolvedNs === undefined) XParser.#unresolvedNs = null;
    }
    return XParser.#unresolvedNs;
  }

  #in = null;

  // private field reflection only
  __in(it) { if (it === undefined) return this.#in; else this.#in = it; }

  #pushback = 0;

  // private field reflection only
  __pushback(it) { if (it === undefined) return this.#pushback; else this.#pushback = it; }

  #pushback2 = 0;

  // private field reflection only
  __pushback2(it) { if (it === undefined) return this.#pushback2; else this.#pushback2 = it; }

  #stack = null;

  // private field reflection only
  __stack(it) { if (it === undefined) return this.#stack; else this.#stack = it; }

  #nsStack = null;

  // private field reflection only
  __nsStack(it) { if (it === undefined) return this.#nsStack; else this.#nsStack = it; }

  #defaultNs = null;

  // private field reflection only
  __defaultNs(it) { if (it === undefined) return this.#defaultNs; else this.#defaultNs = it; }

  #curPi = null;

  // private field reflection only
  __curPi(it) { if (it === undefined) return this.#curPi; else this.#curPi = it; }

  #buf = null;

  // private field reflection only
  __buf(it) { if (it === undefined) return this.#buf; else this.#buf = it; }

  #entityBuf = null;

  // private field reflection only
  __entityBuf(it) { if (it === undefined) return this.#entityBuf; else this.#entityBuf = it; }

  #cdata = false;

  // private field reflection only
  __cdata(it) { if (it === undefined) return this.#cdata; else this.#cdata = it; }

  #name = null;

  // private field reflection only
  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #prefix = null;

  // private field reflection only
  __prefix(it) { if (it === undefined) return this.#prefix; else this.#prefix = it; }

  #popStack = false;

  // private field reflection only
  __popStack(it) { if (it === undefined) return this.#popStack; else this.#popStack = it; }

  #emptyElem = false;

  // private field reflection only
  __emptyElem(it) { if (it === undefined) return this.#emptyElem; else this.#emptyElem = it; }

  static make(in$) {
    const $self = new XParser();
    XParser.make$($self,in$);
    return $self;
  }

  static make$($self,in$) {
    ;
    $self.#in = in$;
    return;
  }

  parseDoc(close) {
    if (close === undefined) close = true;
    try {
      this.sniffEncoding();
      this.parseProlog();
      this.#doc.root(this.parseElem(close));
      return this.#doc;
    }
    finally {
      if (close) {
        this.close();
      }
      ;
    }
    ;
  }

  parseElem(close) {
    if (close === undefined) close = true;
    try {
      let depth = 1;
      let root = sys.ObjUtil.coerce(this.elem().copy(), XElem.type$.toNullable());
      let cur = root;
      while (sys.ObjUtil.compareGT(depth, 0)) {
        let nodeType = this.next();
        if (nodeType == null) {
          throw this.eosErr();
        }
        ;
        let $_u0 = nodeType;
        if (sys.ObjUtil.equals($_u0, XNodeType.elemStart())) {
          let oldCur = cur;
          (cur = sys.ObjUtil.coerce(this.elem().copy(), XElem.type$.toNullable()));
          oldCur.add(sys.ObjUtil.coerce(cur, sys.Obj.type$));
          ((this$) => { let $_u1 = depth;depth = sys.Int.increment(depth); return $_u1; })(this);
        }
        else if (sys.ObjUtil.equals($_u0, XNodeType.elemEnd())) {
          (cur = sys.ObjUtil.coerce(cur.parent(), XElem.type$.toNullable()));
          ((this$) => { let $_u2 = depth;depth = sys.Int.decrement(depth); return $_u2; })(this);
        }
        else if (sys.ObjUtil.equals($_u0, XNodeType.text())) {
          cur.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.text().copy(), XText.type$.toNullable()), sys.Obj.type$));
        }
        else if (sys.ObjUtil.equals($_u0, XNodeType.pi())) {
          cur.add(sys.ObjUtil.coerce(this.#curPi, sys.Obj.type$));
        }
        else {
          throw sys.Err.make(sys.Str.plus("unhandled node type: ", nodeType));
        }
        ;
      }
      ;
      return sys.ObjUtil.coerce(root, XElem.type$);
    }
    finally {
      if (close) {
        this.close();
      }
      ;
    }
    ;
  }

  next() {
    if (this.#popStack) {
      this.#popStack = false;
      this.pop();
    }
    ;
    if (this.#emptyElem) {
      this.#emptyElem = false;
      this.#popStack = true;
      return ((this$) => { let $_u3 = XNodeType.elemEnd(); this$.#nodeType = $_u3; return $_u3; })(this);
    }
    ;
    while (true) {
      let c = 0;
      try {
        (c = this.read());
      }
      catch ($_u4) {
        $_u4 = sys.Err.make($_u4);
        if ($_u4 instanceof XIncompleteErr) {
          let e = $_u4;
          ;
          return ((this$) => { let $_u5 = null; this$.#nodeType = $_u5; return $_u5; })(this);
        }
        else {
          throw $_u4;
        }
      }
      ;
      if (sys.ObjUtil.equals(c, 60)) {
        (c = this.read());
        if (sys.ObjUtil.equals(c, 33)) {
          (c = this.read());
          if (sys.ObjUtil.equals(c, 45)) {
            (c = this.read());
            if (sys.ObjUtil.compareNE(c, 45)) {
              throw this.err("Expecting comment");
            }
            ;
            this.skipComment();
            continue;
          }
          else {
            if (sys.ObjUtil.equals(c, 91)) {
              this.consume("CDATA[");
              this.parseCDATA();
              return ((this$) => { let $_u6 = XNodeType.text(); this$.#nodeType = $_u6; return $_u6; })(this);
            }
            else {
              if (sys.ObjUtil.equals(c, 68)) {
                this.consume("OCTYPE");
                this.parseDocType();
                continue;
              }
              ;
            }
            ;
          }
          ;
          throw this.err("Unexpected markup");
        }
        else {
          if (sys.ObjUtil.equals(c, 63)) {
            this.parsePi();
            if (sys.Str.equalsIgnoreCase(this.#curPi.target(), "xml")) {
              continue;
            }
            ;
            if (sys.ObjUtil.compareLT(this.#depth, 0)) {
              this.#doc.add(sys.ObjUtil.coerce(this.#curPi, sys.Obj.type$));
            }
            ;
            return ((this$) => { let $_u7 = XNodeType.pi(); this$.#nodeType = $_u7; return $_u7; })(this);
          }
          else {
            if (sys.ObjUtil.equals(c, 47)) {
              this.parseElemEnd();
              this.#popStack = true;
              return ((this$) => { let $_u8 = XNodeType.elemEnd(); this$.#nodeType = $_u8; return $_u8; })(this);
            }
            else {
              this.parseElemStart(c);
              return ((this$) => { let $_u9 = XNodeType.elemStart(); this$.#nodeType = $_u9; return $_u9; })(this);
            }
            ;
          }
          ;
        }
        ;
      }
      ;
      if (!this.parseText(c)) {
        continue;
      }
      ;
      return ((this$) => { let $_u10 = XNodeType.text(); this$.#nodeType = $_u10; return $_u10; })(this);
    }
    ;
    throw sys.Err.make("illegal state");
  }

  skip(toDepth) {
    if (toDepth === undefined) toDepth = this.#depth;
    while (true) {
      if ((this.#nodeType === XNodeType.elemEnd() && sys.ObjUtil.equals(this.#depth, toDepth))) {
        return;
      }
      ;
      this.#nodeType = this.next();
      if (this.#nodeType == null) {
        throw this.eosErr();
      }
      ;
    }
    ;
    return;
  }

  elem() {
    if (sys.ObjUtil.compareLT(this.#depth, 0)) {
      return null;
    }
    ;
    return this.#stack.get(this.#depth);
  }

  elemAt(depth) {
    if ((sys.ObjUtil.compareLT(depth, 0) || sys.ObjUtil.compareGT(depth, this.#depth))) {
      throw sys.IndexErr.make(sys.Int.toStr(depth));
    }
    ;
    return this.#stack.get(depth);
  }

  text() {
    const this$ = this;
    if (this.#nodeType !== XNodeType.text()) {
      return null;
    }
    ;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(XText.make(this.#buf.toStr()), (it) => {
      it.cdata(this$.#cdata);
      return;
    }), XText.type$);
  }

  pi() {
    if (this.#nodeType !== XNodeType.pi()) {
      return null;
    }
    ;
    return this.#curPi;
  }

  close() {
    return this.#in.close();
  }

  sniffEncoding() {
    this.#in.charset(sys.ObjUtil.coerce(sys.Charset.fromStr("ISO-8859-1"), sys.Charset.type$));
    let b1 = ((this$) => { let $_u11 = this$.#in.readChar(); if ($_u11 != null) return $_u11; return sys.ObjUtil.coerce(-1, sys.Int.type$.toNullable()); })(this);
    let b2 = ((this$) => { let $_u12 = this$.#in.readChar(); if ($_u12 != null) return $_u12; return sys.ObjUtil.coerce(-1, sys.Int.type$.toNullable()); })(this);
    if (((sys.ObjUtil.equals(b1, 254) && sys.ObjUtil.equals(b2, 255)) || (sys.ObjUtil.equals(b1, 0) && sys.ObjUtil.equals(b2, 60)))) {
      this.#in.charset(sys.Charset.utf16BE());
      return;
    }
    ;
    if (((sys.ObjUtil.equals(b1, 255) && sys.ObjUtil.equals(b2, 254)) || (sys.ObjUtil.equals(b1, 60) && sys.ObjUtil.equals(b2, 0)))) {
      this.#in.charset(sys.Charset.utf16LE());
      return;
    }
    ;
    if ((sys.ObjUtil.equals(b1, 239) && sys.ObjUtil.equals(b2, 187))) {
      if (sys.ObjUtil.compareNE(this.#in.readChar(), 191)) {
        throw sys.IOErr.make("Invalid UTF-8 BOM");
      }
      ;
      this.#in.charset(sys.Charset.utf8());
      return;
    }
    ;
    if (sys.ObjUtil.equals(b1, 10)) {
      ((this$) => { let $_u13 = this$.#line;this$.#line = sys.Int.increment(this$.#line); return $_u13; })(this);
    }
    else {
      if (sys.ObjUtil.compareGT(b1, 0)) {
        ((this$) => { let $_u14 = this$.#col;this$.#col = sys.Int.increment(this$.#col); return $_u14; })(this);
      }
      ;
    }
    ;
    if (sys.ObjUtil.equals(b2, 10)) {
      ((this$) => { let $_u15 = this$.#line;this$.#line = sys.Int.increment(this$.#line); return $_u15; })(this);
    }
    else {
      if (sys.ObjUtil.compareGT(b2, 0)) {
        ((this$) => { let $_u16 = this$.#col;this$.#col = sys.Int.increment(this$.#col); return $_u16; })(this);
      }
      ;
    }
    ;
    this.#pushback2 = sys.ObjUtil.coerce(b1, sys.Int.type$);
    this.#pushback = sys.ObjUtil.coerce(b2, sys.Int.type$);
    this.#in.charset(sys.Charset.utf8());
    return;
  }

  parseProlog() {
    while (this.next() !== XNodeType.elemStart()) {
      if (this.#nodeType === XNodeType.pi()) {
        continue;
      }
      ;
      throw this.err(sys.Str.plus("Expecting element start, not ", this.#nodeType));
    }
    ;
    return;
  }

  parseDocType() {
    this.skipSpace();
    let rootElem = this.parseName(this.read(), true);
    this.skipSpace();
    let publicId = null;
    let systemId = null;
    let c = this.read();
    if ((sys.ObjUtil.equals(c, 80) || sys.ObjUtil.equals(c, 83))) {
      let key = this.parseName(c, false);
      if (sys.ObjUtil.equals(key, "PUBLIC")) {
        this.skipSpace();
        (c = this.read());
        if ((sys.ObjUtil.equals(c, 34) || sys.ObjUtil.equals(c, 39))) {
          (publicId = this.parseQuotedStr(c));
        }
        else {
          this.#pushback = c;
        }
        ;
        this.skipSpace();
        (c = this.read());
        if ((sys.ObjUtil.equals(c, 34) || sys.ObjUtil.equals(c, 39))) {
          (systemId = this.parseQuotedStr(c));
        }
        else {
          this.#pushback = c;
        }
        ;
      }
      else {
        if (sys.ObjUtil.equals(key, "SYSTEM")) {
          this.skipSpace();
          (c = this.read());
          if ((sys.ObjUtil.equals(c, 34) || sys.ObjUtil.equals(c, 39))) {
            (systemId = this.parseQuotedStr(c));
          }
          else {
            this.#pushback = c;
          }
          ;
        }
        ;
      }
      ;
    }
    else {
      this.#pushback = c;
    }
    ;
    let docType = ((this$) => { let $_u17 = XDocType.make(); this$.#doc.docType($_u17); return $_u17; })(this);
    docType.rootElem(rootElem);
    docType.publicId(publicId);
    try {
      if (systemId != null) {
        docType.systemId(sys.Uri.decode(sys.ObjUtil.coerce(systemId, sys.Str.type$)));
      }
      ;
    }
    catch ($_u18) {
      $_u18 = sys.Err.make($_u18);
      if ($_u18 instanceof sys.Err) {
        let e = $_u18;
        ;
        throw this.err(sys.Str.plus("Invalid system id uri: ", systemId));
      }
      else {
        throw $_u18;
      }
    }
    ;
    let depth = 1;
    while (true) {
      (c = this.read());
      if (sys.ObjUtil.equals(c, 60)) {
        ((this$) => { let $_u19 = depth;depth = sys.Int.increment(depth); return $_u19; })(this);
      }
      ;
      if (sys.ObjUtil.equals(c, 62)) {
        ((this$) => { let $_u20 = depth;depth = sys.Int.decrement(depth); return $_u20; })(this);
      }
      ;
      if (sys.ObjUtil.equals(depth, 0)) {
        return;
      }
      ;
    }
    ;
    return;
  }

  parseElemStart(c) {
    const this$ = this;
    let elem = this.push();
    let startLine = this.#line;
    let startCol = sys.Int.minus(this.#col, 1);
    this.parseQName(c);
    elem.name(sys.ObjUtil.coerce(this.#name, sys.Str.type$));
    elem.line(this.#line);
    let prefix = this.#prefix;
    let resolveAttrNs = false;
    while (true) {
      let sp = this.skipSpace();
      (c = this.read());
      if (sys.ObjUtil.equals(c, 62)) {
        break;
      }
      else {
        if (sys.ObjUtil.equals(c, 47)) {
          (c = this.read());
          if (sys.ObjUtil.compareNE(c, 62)) {
            throw this.err("Expecting /> empty element");
          }
          ;
          this.#emptyElem = true;
          break;
        }
        else {
          if (!sp) {
            throw this.err("Expecting space before attribute", this.#line, sys.Int.minus(this.#col, 1));
          }
          ;
          (resolveAttrNs = sys.Bool.or(resolveAttrNs, this.parseAttr(c, elem)));
        }
        ;
      }
      ;
    }
    ;
    if (prefix == null) {
      elem.ns(this.#defaultNs);
    }
    else {
      elem.ns(this.prefixToNs(sys.ObjUtil.coerce(prefix, sys.Str.type$), startLine, startCol, true));
    }
    ;
    if (resolveAttrNs) {
      elem.eachAttr((a,i) => {
        if (a.uri() !== XParser.unresolvedNs()) {
          return;
        }
        ;
        let ns = this$.prefixToNs(a.ns().prefix(), startLine, startCol, true);
        elem.attrList().set(i, XAttr.make(a.name(), a.val(), ns));
        return;
      });
    }
    ;
    return;
  }

  parseElemEnd() {
    let line = this.#line;
    let col = this.#col;
    this.parseQName(this.read());
    let ns = null;
    if (this.#prefix == null) {
      (ns = this.#defaultNs);
    }
    else {
      (ns = this.prefixToNs(sys.ObjUtil.coerce(this.#prefix, sys.Str.type$), line, col, true));
    }
    ;
    if (sys.ObjUtil.compareLT(this.#depth, 0)) {
      throw this.err("Element end without start", line, col);
    }
    ;
    let elem = this.#stack.get(this.#depth);
    if ((sys.ObjUtil.compareNE(elem.name(), this.#name) || elem.ns() !== ns)) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expecting end of element '", elem.qname()), "' (start line "), sys.ObjUtil.coerce(elem.line(), sys.Obj.type$.toNullable())), ")"), line, col);
    }
    ;
    this.skipSpace();
    if (sys.ObjUtil.compareNE(this.read(), 62)) {
      throw this.err("Expecting > end of element");
    }
    ;
    return;
  }

  parseAttr(c,elem) {
    let startLine = this.#line;
    let startCol = sys.Int.minus(this.#col, 1);
    this.parseQName(c);
    let prefix = this.#prefix;
    let name = this.#name;
    this.skipSpace();
    if (sys.ObjUtil.compareNE(this.read(), 61)) {
      throw this.err("Expecting '='", this.#line, sys.Int.minus(this.#col, 1));
    }
    ;
    this.skipSpace();
    (c = this.read());
    if ((sys.ObjUtil.compareNE(c, 34) && sys.ObjUtil.compareNE(c, 39))) {
      throw this.err("Expecting quoted attribute value", this.#line, sys.Int.minus(this.#col, 1));
    }
    ;
    let val = this.parseQuotedStr(c);
    if (prefix == null) {
      if (sys.ObjUtil.equals(name, "xmlns")) {
        this.pushNs("", val, startLine, startCol);
      }
      ;
    }
    else {
      if (sys.ObjUtil.equals(prefix, "xmlns")) {
        this.pushNs(sys.ObjUtil.coerce(name, sys.Str.type$), val, startLine, startCol);
        (prefix = null);
        (name = sys.Str.plus("xmlns:", name));
      }
      else {
        if (sys.Str.equalsIgnoreCase(prefix, "xml")) {
          (prefix = null);
          (name = sys.Str.plus("xml:", name));
        }
        ;
      }
      ;
    }
    ;
    if (prefix == null) {
      elem.addAttr(sys.ObjUtil.coerce(name, sys.Str.type$), val);
      return false;
    }
    ;
    let ns = this.prefixToNs(sys.ObjUtil.coerce(prefix, sys.Str.type$), this.#line, this.#col, false);
    elem.addAttr(sys.ObjUtil.coerce(name, sys.Str.type$), val, ns);
    return ns.uri() === XParser.unresolvedNs();
  }

  parseQName(c) {
    this.#prefix = null;
    this.#name = this.parseName(c, false);
    (c = this.read());
    if (sys.ObjUtil.equals(c, 58)) {
      this.#prefix = this.#name;
      this.#name = this.parseName(this.read(), true);
    }
    else {
      this.#pushback = c;
    }
    ;
    return;
  }

  parseQuotedStr(quote) {
    let buf = this.#buf;
    buf.clear();
    let c = 0;
    while (sys.ObjUtil.compareNE((c = this.read()), quote)) {
      buf.addChar(this.toCharData(c));
    }
    ;
    return this.bufToStr();
  }

  parseName(c,includeColon) {
    if (!XParser.isName(c)) {
      throw this.err("Expected XML name");
    }
    ;
    let buf = this.#buf;
    buf.clear().addChar(c);
    if (includeColon) {
      while ((XParser.isName((c = this.read())) || sys.ObjUtil.equals(c, 58))) {
        buf.addChar(c);
      }
      ;
    }
    else {
      while (XParser.isName((c = this.read()))) {
        buf.addChar(c);
      }
      ;
    }
    ;
    this.#pushback = c;
    return this.bufToStr();
  }

  parseCDATA() {
    this.#buf.clear();
    this.#cdata = true;
    let c2 = -1;
    let c1 = -1;
    let c0 = -1;
    while (true) {
      (c2 = c1);
      (c1 = c0);
      (c0 = this.read());
      if ((sys.ObjUtil.equals(c2, 93) && sys.ObjUtil.equals(c1, 93) && sys.ObjUtil.equals(c0, 62))) {
        this.#buf.remove(-1).remove(-1);
        return;
      }
      ;
      this.#buf.addChar(c0);
    }
    ;
    return;
  }

  parseText(c) {
    let line = this.#line;
    let col = sys.Int.minus(this.#col, 1);
    let gotText = !XParser.isSpace(c);
    this.#buf.clear().addChar(this.toCharData(c));
    this.#cdata = false;
    while (true) {
      try {
        (c = this.read());
      }
      catch ($_u21) {
        $_u21 = sys.Err.make($_u21);
        if ($_u21 instanceof XIncompleteErr) {
          let e = $_u21;
          ;
          if (!gotText) {
            return false;
          }
          ;
          if (sys.ObjUtil.compareLT(this.#depth, 0)) {
            throw XErr.make("Expecting root element", line, col);
          }
          ;
          throw e;
        }
        else {
          throw $_u21;
        }
      }
      ;
      if (sys.ObjUtil.equals(c, 60)) {
        this.#pushback = c;
        if ((gotText && sys.ObjUtil.compareLT(this.#depth, 0))) {
          throw XErr.make("Expecting root element", line, col);
        }
        ;
        return gotText;
      }
      ;
      if (!XParser.isSpace(c)) {
        (gotText = true);
      }
      ;
      this.#buf.addChar(this.toCharData(c));
    }
    ;
    throw sys.Err.make("illegal state");
  }

  parsePi() {
    let target = this.parseName(this.read(), true);
    this.skipSpace();
    this.#buf.clear();
    let c1 = -1;
    let c0 = -1;
    while (true) {
      (c1 = c0);
      (c0 = this.read());
      if ((sys.ObjUtil.equals(c1, 63) && sys.ObjUtil.equals(c0, 62))) {
        break;
      }
      ;
      this.#buf.addChar(c0);
    }
    ;
    this.#buf.remove(-1);
    this.#curPi = XPi.make(target, this.#buf.toStr());
    return;
  }

  skipSpace() {
    let c = this.read();
    if (!XParser.isSpace(c)) {
      this.#pushback = c;
      return false;
    }
    ;
    while (XParser.isSpace((c = this.read()))) {
    }
    ;
    this.#pushback = c;
    return true;
  }

  skipComment() {
    let c2 = -1;
    let c1 = -1;
    let c0 = -1;
    while (true) {
      (c2 = c1);
      (c1 = c0);
      (c0 = this.read());
      if ((sys.ObjUtil.equals(c2, 45) && sys.ObjUtil.equals(c1, 45))) {
        if (sys.ObjUtil.compareNE(c0, 62)) {
          throw this.err("Cannot have -- in middle of comment");
        }
        ;
        return;
      }
      ;
    }
    ;
    return;
  }

  consume(s) {
    const this$ = this;
    sys.Str.each(s, (expected) => {
      if (sys.ObjUtil.compareNE(expected, this$.read())) {
        throw this$.err(sys.Str.plus(sys.Str.plus("Expected '", sys.Int.toChar(expected)), "'"));
      }
      ;
      return;
    });
    return;
  }

  read() {
    let c = this.#pushback2;
    if (sys.ObjUtil.compareNE(c, -1)) {
      this.#pushback2 = -1;
      return c;
    }
    ;
    (c = this.#pushback);
    if (sys.ObjUtil.compareNE(c, -1)) {
      this.#pushback = -1;
      return c;
    }
    ;
    let cx = this.#in.readChar();
    if (cx == null) {
      throw this.eosErr();
    }
    ;
    (c = sys.ObjUtil.coerce(cx, sys.Int.type$));
    if (sys.ObjUtil.equals(c, 10)) {
      ((this$) => { let $_u22 = this$.#line;this$.#line = sys.Int.increment(this$.#line); return $_u22; })(this);
      this.#col = 1;
      return 10;
    }
    else {
      if (sys.ObjUtil.equals(c, 13)) {
        let lookAhead = this.#in.readChar();
        if ((lookAhead != null && sys.ObjUtil.compareNE(lookAhead, 10))) {
          this.#pushback = sys.ObjUtil.coerce(lookAhead, sys.Int.type$);
        }
        ;
        ((this$) => { let $_u23 = this$.#line;this$.#line = sys.Int.increment(this$.#line); return $_u23; })(this);
        this.#col = 0;
        return 10;
      }
      else {
        ((this$) => { let $_u24 = this$.#col;this$.#col = sys.Int.increment(this$.#col); return $_u24; })(this);
        return c;
      }
      ;
    }
    ;
  }

  toCharData(c) {
    if (sys.ObjUtil.equals(c, 60)) {
      throw this.err("Invalid markup in char data");
    }
    ;
    if (sys.ObjUtil.compareNE(c, 38)) {
      return c;
    }
    ;
    (c = this.read());
    if (sys.ObjUtil.equals(c, 35)) {
      (c = sys.ObjUtil.coerce(this.#in.readChar(), sys.Int.type$));
      ((this$) => { let $_u25 = this$.#col;this$.#col = sys.Int.increment(this$.#col); return $_u25; })(this);
      let x = 0;
      let base = 10;
      if (sys.ObjUtil.equals(c, 120)) {
        (base = 16);
      }
      else {
        (x = this.toNum(x, c, base));
      }
      ;
      (c = sys.ObjUtil.coerce(this.#in.readChar(), sys.Int.type$));
      ((this$) => { let $_u26 = this$.#col;this$.#col = sys.Int.increment(this$.#col); return $_u26; })(this);
      while (sys.ObjUtil.compareNE(c, 59)) {
        (x = this.toNum(x, c, base));
        (c = sys.ObjUtil.coerce(this.#in.readChar(), sys.Int.type$));
        ((this$) => { let $_u27 = this$.#col;this$.#col = sys.Int.increment(this$.#col); return $_u27; })(this);
      }
      ;
      return x;
    }
    ;
    let ebuf = this.#entityBuf;
    ebuf.clear();
    ebuf.addChar(c);
    while (sys.ObjUtil.compareNE((c = this.read()), 59)) {
      ebuf.addChar(c);
    }
    ;
    let entity = ebuf.toStr();
    if (sys.ObjUtil.equals(entity, "lt")) {
      return 60;
    }
    ;
    if (sys.ObjUtil.equals(entity, "gt")) {
      return 62;
    }
    ;
    if (sys.ObjUtil.equals(entity, "amp")) {
      return 38;
    }
    ;
    if (sys.ObjUtil.equals(entity, "quot")) {
      return 34;
    }
    ;
    if (sys.ObjUtil.equals(entity, "apos")) {
      return 39;
    }
    ;
    throw this.err(sys.Str.plus(sys.Str.plus("Unsupported entity &", entity), ";"));
  }

  toNum(x,c,base) {
    let digit = sys.Int.fromDigit(c, base);
    if (digit == null) {
      this.err(sys.Str.plus(sys.Str.plus("Expected base ", sys.ObjUtil.coerce(base, sys.Obj.type$.toNullable())), " number"));
    }
    ;
    return sys.Int.plus(sys.Int.mult(x, base), sys.ObjUtil.coerce(digit, sys.Int.type$));
  }

  bufToStr() {
    return this.#buf.toStr();
  }

  prefixToNs(prefix,line,col,checked) {
    for (let i = this.#depth; sys.ObjUtil.compareGE(i, 0); i = sys.Int.decrement(i)) {
      let ns = this.#nsStack.get(i).find(prefix);
      if (ns != null) {
        return sys.ObjUtil.coerce(ns, XNs.type$);
      }
      ;
    }
    ;
    if (!checked) {
      return XNs.make(prefix, XParser.unresolvedNs());
    }
    ;
    throw this.err(sys.Str.plus(sys.Str.plus("Undeclared namespace prefix '", prefix), "'"), line, col);
  }

  pushNs(prefix,val,line,col) {
    let uri = sys.Uri.fromStr("");
    try {
      if (!sys.Str.isEmpty(val)) {
        (uri = sys.ObjUtil.coerce(sys.Uri.decode(val), sys.Uri.type$));
      }
      ;
    }
    catch ($_u28) {
      $_u28 = sys.Err.make($_u28);
      if ($_u28 instanceof sys.Err) {
        let e = $_u28;
        ;
        throw this.err(sys.Str.plus("Invalid namespace uri ", val), line, col);
      }
      else {
        throw $_u28;
      }
    }
    ;
    let ns = XNs.make(prefix, uri);
    this.#nsStack.get(this.#depth).list().add(ns);
    if (sys.Str.isEmpty(prefix)) {
      this.reEvalDefaultNs();
    }
    ;
    return;
  }

  reEvalDefaultNs() {
    this.#defaultNs = null;
    for (let i = this.#depth; sys.ObjUtil.compareGE(i, 0); i = sys.Int.decrement(i)) {
      this.#defaultNs = this.#nsStack.get(i).find("");
      if (this.#defaultNs != null) {
        if (sys.Str.isEmpty(this.#defaultNs.uri().toStr())) {
          this.#defaultNs = null;
        }
        ;
        return;
      }
      ;
    }
    ;
    return;
  }

  push() {
    ((this$) => { let $_u29 = this$.#depth;this$.#depth = sys.Int.increment(this$.#depth); return $_u29; })(this);
    try {
      let elem = this.#stack.get(this.#depth).clearAttrs();
      return elem;
    }
    catch ($_u30) {
      $_u30 = sys.Err.make($_u30);
      if ($_u30 instanceof sys.IndexErr) {
        let e = $_u30;
        ;
        let elem = XElem.make("");
        this.#stack.add(elem);
        this.#nsStack.add(XNsDefs.make());
        return elem;
      }
      else {
        throw $_u30;
      }
    }
    ;
  }

  pop() {
    let nsDefs = this.#nsStack.get(this.#depth);
    if (!nsDefs.isEmpty()) {
      nsDefs.clear();
      this.reEvalDefaultNs();
    }
    ;
    ((this$) => { let $_u31 = this$.#depth;this$.#depth = sys.Int.decrement(this$.#depth); return $_u31; })(this);
    return;
  }

  err(msg,line,col) {
    if (line === undefined) line = this.#line;
    if (col === undefined) col = this.#col;
    return XErr.make(msg, line, col);
  }

  eosErr() {
    throw XIncompleteErr.make("Unexpected end of stream", this.#line, this.#col);
  }

  static isName(c) {
    return ((this$) => { if (sys.ObjUtil.compareLT(c, 128)) return XParser.nameMap().get(c); return true; })(this);
  }

  static isSpace(c) {
    return ((this$) => { if (sys.ObjUtil.compareLT(c, 128)) return XParser.spaceMap().get(c); return false; })(this);
  }

  static static$init() {
    const this$ = this;
    if (true) {
      let name = sys.List.make(sys.Bool.type$);
      sys.Int.times(128, () => {
        name.add(sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
        return;
      });
      for (let i = 97; sys.ObjUtil.compareLE(i, 122); i = sys.Int.increment(i)) {
        name.set(i, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      }
      ;
      for (let i = 65; sys.ObjUtil.compareLE(i, 90); i = sys.Int.increment(i)) {
        name.set(i, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      }
      ;
      for (let i = 48; sys.ObjUtil.compareLE(i, 57); i = sys.Int.increment(i)) {
        name.set(i, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      }
      ;
      name.set(45, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      name.set(46, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      name.set(95, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      XParser.#nameMap = sys.ObjUtil.coerce(((this$) => { let $_u34 = name; if ($_u34 == null) return null; return sys.ObjUtil.toImmutable(name); })(this), sys.Type.find("sys::Bool[]"));
      let space = sys.List.make(sys.Bool.type$);
      sys.Int.times(128, () => {
        space.add(sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
        return;
      });
      space.set(10, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      space.set(13, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      space.set(32, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      space.set(9, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      XParser.#spaceMap = sys.ObjUtil.coerce(((this$) => { let $_u35 = space; if ($_u35 == null) return null; return sys.ObjUtil.toImmutable(space); })(this), sys.Type.find("sys::Bool[]"));
    }
    ;
    XParser.#unresolvedNs = sys.Uri.fromStr("__unresolved__");
    return;
  }

}

class XNsDefs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#list = sys.List.make(XNs.type$);
    return;
  }

  typeof() { return XNsDefs.type$; }

  #list = null;

  list(it) {
    if (it === undefined) {
      return this.#list;
    }
    else {
      this.#list = it;
      return;
    }
  }

  find(prefix) {
    if (this.#list.isEmpty()) {
      return null;
    }
    ;
    for (let i = 0; sys.ObjUtil.compareLT(i, this.#list.size()); i = sys.Int.increment(i)) {
      if (sys.ObjUtil.equals(this.#list.get(i).prefix(), prefix)) {
        return this.#list.get(i);
      }
      ;
    }
    ;
    return null;
  }

  isEmpty() {
    return this.#list.isEmpty();
  }

  clear() {
    this.#list.clear();
    return;
  }

  static make() {
    const $self = new XNsDefs();
    XNsDefs.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class XAttr extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XAttr.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make(name,val,ns) {
    const $self = new XAttr();
    XAttr.make$($self,name,val,ns);
    return $self;
  }

  static make$($self,name,val,ns) {
    if (ns === undefined) ns = null;
    if ((ns != null && ns.isDefault())) {
      throw sys.ArgErr.make("Cannot define attr in default namespace");
    }
    ;
    $self.#name = name;
    $self.#val = val;
    $self.#ns = ns;
    return;
  }

  static makeNs(ns) {
    const $self = new XAttr();
    XAttr.makeNs$($self,ns);
    return $self;
  }

  static makeNs$($self,ns) {
    $self.#name = ((this$) => { if (ns.isDefault()) return "xmlns"; return sys.Str.plus("xmlns:", ns.prefix()); })($self);
    $self.#val = ns.uri().toStr();
    return;
  }

  prefix() {
    return ((this$) => { let $_u37=this$.#ns; return ($_u37==null) ? null : $_u37.prefix(); })(this);
  }

  uri() {
    return ((this$) => { let $_u38=this$.#ns; return ($_u38==null) ? null : $_u38.uri(); })(this);
  }

  qname() {
    if (this.#ns == null) {
      return this.#name;
    }
    ;
    return sys.Str.plus(sys.Str.plus(this.#ns.prefix(), ":"), this.#name);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.qname()), "='"), sys.Str.toXml(this.#val)), "'");
  }

  write(out) {
    if (this.#ns != null) {
      out.writeChars(this.#ns.prefix()).writeChar(58);
    }
    ;
    out.writeXml(this.#name).writeChar(61).writeChar(39).writeXml(this.#val, sys.Int.or(sys.OutStream.xmlEscQuotes(), sys.OutStream.xmlEscNewlines())).writeChar(39);
    return;
  }

}

class XNode extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XNode.type$; }

  #parent = null;

  parent(it) {
    if (it === undefined) {
      return this.#parent;
    }
    else {
      this.#parent = it;
      return;
    }
  }

  doc() {
    for (let x = this; x != null; (x = x.#parent)) {
      if (sys.ObjUtil.is(x, XDoc.type$)) {
        return sys.ObjUtil.coerce(x, XDoc.type$.toNullable());
      }
      ;
    }
    ;
    return null;
  }

  writeToStr() {
    let s = sys.StrBuf.make();
    this.write(s.out());
    return s.toStr();
  }

  static make() {
    const $self = new XNode();
    XNode.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class XNodeType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XNodeType.type$; }

  static doc() { return XNodeType.vals().get(0); }

  static elem() { return XNodeType.vals().get(1); }

  static text() { return XNodeType.vals().get(2); }

  static pi() { return XNodeType.vals().get(3); }

  static elemStart() { return XNodeType.vals().get(4); }

  static elemEnd() { return XNodeType.vals().get(5); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new XNodeType();
    XNodeType.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(XNodeType.type$, XNodeType.vals(), name$, checked);
  }

  static vals() {
    if (XNodeType.#vals == null) {
      XNodeType.#vals = sys.List.make(XNodeType.type$, [
        XNodeType.make(0, "doc", ),
        XNodeType.make(1, "elem", ),
        XNodeType.make(2, "text", ),
        XNodeType.make(3, "pi", ),
        XNodeType.make(4, "elemStart", ),
        XNodeType.make(5, "elemEnd", ),
      ]).toImmutable();
    }
    return XNodeType.#vals;
  }

  static static$init() {
    const $_u39 = XNodeType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class XText extends XNode {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XText.type$; }

  #val = null;

  val(it) {
    if (it === undefined) {
      return this.#val;
    }
    else {
      this.#val = it;
      return;
    }
  }

  #cdata = false;

  cdata(it) {
    if (it === undefined) {
      return this.#cdata;
    }
    else {
      this.#cdata = it;
      return;
    }
  }

  static make(val) {
    const $self = new XText();
    XText.make$($self,val);
    return $self;
  }

  static make$($self,val) {
    XNode.make$($self);
    $self.#val = val;
    return;
  }

  nodeType() {
    return XNodeType.text();
  }

  toStr() {
    if (sys.ObjUtil.compareGT(sys.Str.size(this.#val), 20)) {
      return sys.Str.plus(sys.Str.getRange(this.#val, sys.Range.make(0, 20)), "...");
    }
    ;
    return this.#val;
  }

  copy() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(XText.make(this.#val), (it) => {
      it.#cdata = this$.#cdata;
      return;
    }), XText.type$);
  }

  write(out) {
    if (this.#cdata) {
      if (sys.Str.contains(this.#val, "]]>")) {
        throw sys.IOErr.make("CDATA val contains ']]>'");
      }
      ;
      out.writeChars("<![CDATA[").writeChars(this.#val).writeChars("]]>");
    }
    else {
      out.writeXml(this.#val);
    }
    ;
    return;
  }

}

class XElem extends XNode {
  constructor() {
    super();
    const this$ = this;
    this.#attrList = XElem.noAttrs();
    this.#childList = XElem.noNodes();
    return;
  }

  typeof() { return XElem.type$; }

  #name = null;

  name(it) {
    if (it === undefined) {
      return this.#name;
    }
    else {
      this.#name = it;
      return;
    }
  }

  #ns = null;

  ns(it) {
    if (it === undefined) {
      return this.#ns;
    }
    else {
      this.#ns = it;
      return;
    }
  }

  #line = 0;

  line(it) {
    if (it === undefined) {
      return this.#line;
    }
    else {
      this.#line = it;
      return;
    }
  }

  static #noElems = undefined;

  static noElems() {
    if (XElem.#noElems === undefined) {
      XElem.static$init();
      if (XElem.#noElems === undefined) XElem.#noElems = null;
    }
    return XElem.#noElems;
  }

  static #noNodes = undefined;

  static noNodes() {
    if (XElem.#noNodes === undefined) {
      XElem.static$init();
      if (XElem.#noNodes === undefined) XElem.#noNodes = null;
    }
    return XElem.#noNodes;
  }

  static #noAttrs = undefined;

  static noAttrs() {
    if (XElem.#noAttrs === undefined) {
      XElem.static$init();
      if (XElem.#noAttrs === undefined) XElem.#noAttrs = null;
    }
    return XElem.#noAttrs;
  }

  #attrList = null;

  attrList(it) {
    if (it === undefined) {
      return this.#attrList;
    }
    else {
      this.#attrList = it;
      return;
    }
  }

  #childList = null;

  childList(it) {
    if (it === undefined) {
      return this.#childList;
    }
    else {
      this.#childList = it;
      return;
    }
  }

  static make(name,ns) {
    const $self = new XElem();
    XElem.make$($self,name,ns);
    return $self;
  }

  static make$($self,name,ns) {
    if (ns === undefined) ns = null;
    XNode.make$($self);
    ;
    $self.#name = name;
    $self.#ns = ns;
    return;
  }

  nodeType() {
    return XNodeType.elem();
  }

  prefix() {
    return ((this$) => { let $_u40=this$.#ns; return ($_u40==null) ? null : $_u40.prefix(); })(this);
  }

  uri() {
    return ((this$) => { let $_u41=this$.#ns; return ($_u41==null) ? null : $_u41.uri(); })(this);
  }

  qname() {
    if ((this.#ns == null || this.#ns.isDefault())) {
      return this.#name;
    }
    ;
    return sys.Str.plus(sys.Str.plus(this.#ns.prefix(), ":"), this.#name);
  }

  toStr() {
    const this$ = this;
    let s = sys.StrBuf.make();
    s.addChar(60).add(this.qname());
    this.attrs().each((a) => {
      s.addChar(32).add(a);
      return;
    });
    s.addChar(62);
    return s.toStr();
  }

  attrs() {
    return this.#attrList.ro();
  }

  eachAttr(f) {
    this.#attrList.each(f);
    return;
  }

  attr(name,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let attr = this.#attrList.find((a) => {
      return sys.ObjUtil.equals(a.name(), name);
    });
    if ((attr != null || !checked)) {
      return attr;
    }
    ;
    throw XErr.make(sys.Str.plus(sys.Str.plus("Missing attr '", name), "'"), this.#line);
  }

  get(name,checked) {
    if (checked === undefined) checked = true;
    return ((this$) => { let $_u42=this$.attr(name, checked); return ($_u42==null) ? null : $_u42.val(); })(this);
  }

  addAttr(name,val,ns) {
    if (ns === undefined) ns = null;
    return this.add(XAttr.make(name, val, ns));
  }

  removeAttr(attr) {
    if (this.#attrList.isEmpty()) {
      return null;
    }
    ;
    return this.#attrList.removeSame(attr);
  }

  removeAttrAt(index) {
    return this.#attrList.removeAt(index);
  }

  clearAttrs() {
    this.#attrList = XElem.noAttrs();
    return this;
  }

  children() {
    return this.#childList.ro();
  }

  each(f) {
    this.#childList.each(f);
    return;
  }

  add(child) {
    const this$ = this;
    if (sys.ObjUtil.is(child, XAttr.type$)) {
      if (this.#attrList.isRO()) {
        this.#attrList = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.List.make(XAttr.type$), (it) => {
          it.capacity(4);
          return;
        }), sys.Type.find("xml::XAttr[]"));
      }
      ;
      this.#attrList.add(sys.ObjUtil.coerce(child, XAttr.type$));
    }
    else {
      let node = sys.ObjUtil.coerce(child, XNode.type$);
      if (node.parent() != null) {
        throw sys.ArgErr.make(sys.Str.plus("Node already parented: ", child));
      }
      ;
      node.parent(this);
      if (this.#childList.isRO()) {
        this.#childList = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.List.make(XNode.type$), (it) => {
          it.capacity(4);
          return;
        }), sys.Type.find("xml::XNode[]"));
      }
      ;
      this.#childList.add(node);
    }
    ;
    return this;
  }

  remove(child) {
    if (this.#childList.isEmpty()) {
      return null;
    }
    ;
    if (this.#childList.removeSame(child) !== child) {
      return null;
    }
    ;
    child.parent(null);
    return child;
  }

  removeAt(index) {
    let child = this.#childList.removeAt(index);
    child.parent(null);
    return child;
  }

  elems() {
    return sys.ObjUtil.coerce(this.#childList.findType(XElem.type$), sys.Type.find("xml::XElem[]"));
  }

  elem(name,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let elem = this.#childList.find((n) => {
      return (sys.ObjUtil.is(n, XElem.type$) && sys.ObjUtil.equals(sys.ObjUtil.coerce(n, XElem.type$).#name, name));
    });
    if ((elem != null || !checked)) {
      return sys.ObjUtil.coerce(elem, XElem.type$.toNullable());
    }
    ;
    throw XErr.make(sys.Str.plus(sys.Str.plus("Missing element '", name), "'"), this.#line);
  }

  text() {
    const this$ = this;
    return sys.ObjUtil.coerce(this.#childList.find((n) => {
      return sys.ObjUtil.is(n, XText.type$);
    }), XText.type$.toNullable());
  }

  copy() {
    let copy = XElem.make(this.#name, this.#ns);
    copy.#line = this.#line;
    if (!this.#attrList.isEmpty()) {
      copy.#attrList = this.#attrList.dup();
    }
    ;
    if (!this.#childList.isEmpty()) {
      copy.#childList = this.#childList.dup();
    }
    ;
    return copy;
  }

  write(out) {
    this.doWrite(out, 0);
    return;
  }

  doWrite(out,indent) {
    const this$ = this;
    out.writeChar(60);
    if ((this.#ns != null && !this.#ns.isDefault())) {
      out.writeChars(this.#ns.prefix()).writeChar(58);
    }
    ;
    out.writeChars(this.#name);
    this.#attrList.each((attr) => {
      out.writeChar(32);
      attr.write(out);
      return;
    });
    if (this.#childList.isEmpty()) {
      out.writeChar(47).writeChar(62);
      return;
    }
    ;
    out.writeChar(62);
    ((this$) => { let $_u43 = indent;indent = sys.Int.increment(indent); return $_u43; })(this);
    let needIndent = !sys.ObjUtil.is(this.#childList.first(), XText.type$);
    this.#childList.each((node) => {
      let isText = sys.ObjUtil.is(node, XText.type$);
      if ((needIndent && !isText)) {
        out.writeChar(10).writeChars(sys.Str.spaces(indent));
      }
      ;
      (needIndent = !isText);
      if (sys.ObjUtil.is(node, XElem.type$)) {
        sys.ObjUtil.coerce(node, XElem.type$).doWrite(out, indent);
      }
      else {
        node.write(out);
      }
      ;
      return;
    });
    ((this$) => { let $_u44 = indent;indent = sys.Int.decrement(indent); return $_u44; })(this);
    if (needIndent) {
      out.writeChar(10).writeChars(sys.Str.spaces(indent));
    }
    ;
    out.writeChar(60).writeChar(47);
    if ((this.#ns != null && !this.#ns.isDefault())) {
      out.writeChars(this.#ns.prefix()).writeChar(58);
    }
    ;
    out.writeChars(this.#name).writeChar(62);
    return;
  }

  static static$init() {
    XElem.#noElems = sys.ObjUtil.coerce(((this$) => { let $_u45 = sys.List.make(XElem.type$); if ($_u45 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(XElem.type$)); })(this), sys.Type.find("xml::XElem[]"));
    XElem.#noNodes = sys.ObjUtil.coerce(((this$) => { let $_u46 = sys.List.make(XNode.type$); if ($_u46 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(XNode.type$)); })(this), sys.Type.find("xml::XNode[]"));
    XElem.#noAttrs = sys.ObjUtil.coerce(((this$) => { let $_u47 = sys.List.make(XAttr.type$); if ($_u47 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(XAttr.type$)); })(this), sys.Type.find("xml::XAttr[]"));
    return;
  }

}

class XDocType extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#rootElem = "undefined";
    return;
  }

  typeof() { return XDocType.type$; }

  #rootElem = null;

  rootElem(it) {
    if (it === undefined) {
      return this.#rootElem;
    }
    else {
      this.#rootElem = it;
      return;
    }
  }

  #publicId = null;

  publicId(it) {
    if (it === undefined) {
      return this.#publicId;
    }
    else {
      this.#publicId = it;
      return;
    }
  }

  #systemId = null;

  systemId(it) {
    if (it === undefined) {
      return this.#systemId;
    }
    else {
      this.#systemId = it;
      return;
    }
  }

  toStr() {
    let s = sys.StrBuf.make().add("<!DOCTYPE ").add(this.#rootElem);
    if (this.#publicId != null) {
      s.add(" PUBLIC '").add(this.#publicId).add("'");
    }
    ;
    if (this.#systemId != null) {
      if (this.#publicId == null) {
        s.add(" SYSTEM '");
      }
      else {
        s.add(" '");
      }
      ;
      s.add(this.#systemId).add("'");
    }
    ;
    s.add(">");
    return s.toStr();
  }

  static make() {
    const $self = new XDocType();
    XDocType.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class XIncompleteErr extends XErr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XIncompleteErr.type$; }

  static make(message,line,col,cause) {
    const $self = new XIncompleteErr();
    XIncompleteErr.make$($self,message,line,col,cause);
    return $self;
  }

  static make$($self,message,line,col,cause) {
    if (message === undefined) message = null;
    if (line === undefined) line = 0;
    if (col === undefined) col = 0;
    if (cause === undefined) cause = null;
    XErr.make$($self, message, line, col, cause);
    return;
  }

}

class XPi extends XNode {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XPi.type$; }

  #target = null;

  target(it) {
    if (it === undefined) {
      return this.#target;
    }
    else {
      this.#target = it;
      return;
    }
  }

  #val = null;

  val(it) {
    if (it === undefined) {
      return this.#val;
    }
    else {
      this.#val = it;
      return;
    }
  }

  static make(target,val) {
    const $self = new XPi();
    XPi.make$($self,target,val);
    return $self;
  }

  static make$($self,target,val) {
    XNode.make$($self);
    $self.#target = target;
    $self.#val = val;
    return;
  }

  nodeType() {
    return XNodeType.pi();
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("<?", this.#target), " "), this.#val), "?>");
  }

  write(out) {
    out.writeChar(60).writeChar(63).writeChars(this.#target).writeChar(32).writeChars(this.#val).writeChar(63).writeChar(62);
    return;
  }

}

class XDoc extends XNode {
  constructor() {
    super();
    const this$ = this;
    this.#piList = XDoc.noPis();
    return;
  }

  typeof() { return XDoc.type$; }

  #docType = null;

  docType(it) {
    if (it === undefined) {
      return this.#docType;
    }
    else {
      this.#docType = it;
      return;
    }
  }

  #root = null;

  root(it) {
    if (it === undefined) {
      return this.#root;
    }
    else {
      if (it.parent() != null) {
        throw sys.ArgErr.make(sys.Str.plus("Node already parented: ", it));
      }
      ;
      it.parent(this);
      this.#root = it;
      return;
    }
  }

  static #noPis = undefined;

  static noPis() {
    if (XDoc.#noPis === undefined) {
      XDoc.static$init();
      if (XDoc.#noPis === undefined) XDoc.#noPis = null;
    }
    return XDoc.#noPis;
  }

  #piList = null;

  piList(it) {
    if (it === undefined) {
      return this.#piList;
    }
    else {
      this.#piList = it;
      return;
    }
  }

  static make(root) {
    const $self = new XDoc();
    XDoc.make$($self,root);
    return $self;
  }

  static make$($self,root) {
    if (root === undefined) root = null;
    XNode.make$($self);
    ;
    if (root != null) {
      $self.root(sys.ObjUtil.coerce(root, XElem.type$));
    }
    else {
      $self.root(XElem.make("undefined"));
    }
    ;
    return;
  }

  nodeType() {
    return XNodeType.doc();
  }

  toStr() {
    return "<?xml version='1.0'?>";
  }

  pis() {
    return this.#piList.ro();
  }

  add(child) {
    if (sys.ObjUtil.is(child, XElem.type$)) {
      this.root(sys.ObjUtil.coerce(child, XElem.type$));
      return this;
    }
    ;
    let pi = sys.ObjUtil.coerce(child, XPi.type$);
    if (pi.parent() != null) {
      throw sys.ArgErr.make(sys.Str.plus("Node already parented: ", pi));
    }
    ;
    pi.parent(this);
    this.#piList = this.#piList.rw();
    this.#piList.add(pi);
    return this;
  }

  removePi(pi) {
    if (this.#piList.isEmpty()) {
      return null;
    }
    ;
    if (this.#piList.removeSame(pi) !== pi) {
      return null;
    }
    ;
    pi.parent(null);
    return pi;
  }

  write(out) {
    const this$ = this;
    out.writeChars(sys.Str.plus(sys.Str.plus("<?xml version='1.0' encoding='", out.charset()), "'?>\n"));
    if (this.#docType != null) {
      out.writeChars(this.#docType.toStr()).writeChar(10);
    }
    ;
    this.#piList.each((pi) => {
      pi.write(out);
      out.writeChar(10);
      return;
    });
    this.root().write(out);
    out.writeChar(10);
    return;
  }

  static static$init() {
    XDoc.#noPis = sys.ObjUtil.coerce(((this$) => { let $_u48 = sys.List.make(XPi.type$); if ($_u48 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(XPi.type$)); })(this), sys.Type.find("xml::XPi[]"));
    return;
  }

}

class XNs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XNs.type$; }

  #prefix = null;

  prefix() { return this.#prefix; }

  __prefix(it) { if (it === undefined) return this.#prefix; else this.#prefix = it; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  static make(prefix,uri) {
    const $self = new XNs();
    XNs.make$($self,prefix,uri);
    return $self;
  }

  static make$($self,prefix,uri) {
    $self.#prefix = prefix;
    $self.#uri = uri;
    return;
  }

  isDefault() {
    return sys.ObjUtil.equals(this.#prefix, "");
  }

  hash() {
    return this.#uri.hash();
  }

  equals(that) {
    if (!sys.ObjUtil.is(that, XNs.type$)) {
      return false;
    }
    ;
    return sys.ObjUtil.equals(this.#uri, sys.ObjUtil.coerce(that, XNs.type$).#uri);
  }

  toStr() {
    return this.#uri.toStr();
  }

}

class XmlTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XmlTest.type$; }

  verifyNode(a,b) {
    this.verifyEq(a.nodeType(), b.nodeType());
    let $_u49 = sys.Type.of(a);
    if (sys.ObjUtil.equals($_u49, XDoc.type$)) {
      this.verifyDoc(sys.ObjUtil.coerce(a, XDoc.type$), sys.ObjUtil.coerce(b, XDoc.type$));
    }
    else if (sys.ObjUtil.equals($_u49, XElem.type$)) {
      this.verifyElem(sys.ObjUtil.coerce(a, XElem.type$.toNullable()), sys.ObjUtil.coerce(b, XElem.type$.toNullable()));
    }
    else if (sys.ObjUtil.equals($_u49, XText.type$)) {
      this.verifyText(sys.ObjUtil.coerce(a, XText.type$), sys.ObjUtil.coerce(b, XText.type$));
    }
    else if (sys.ObjUtil.equals($_u49, XPi.type$)) {
      this.verifyPi(sys.ObjUtil.coerce(a, XPi.type$), sys.ObjUtil.coerce(b, XPi.type$));
    }
    ;
    return;
  }

  verifyDoc(a,b) {
    this.verifyEq(((this$) => { let $_u50 = a.docType(); if ($_u50 == null) return null; return a.docType().toStr(); })(this), ((this$) => { let $_u51 = b.docType(); if ($_u51 == null) return null; return b.docType().toStr(); })(this));
    this.verifyPis(sys.ObjUtil.coerce(a.pis(), sys.Type.find("xml::XPi[]")), sys.ObjUtil.coerce(b.pis(), sys.Type.find("xml::XPi[]")));
    this.verifyElem(a.root(), b.root());
    return;
  }

  verifyElem(a,b) {
    const this$ = this;
    if (a == null) {
      this.verify(b == null);
      return;
    }
    ;
    this.verifyEq(a.prefix(), b.prefix());
    this.verifyEq(a.name(), b.name());
    this.verifyEq(a.qname(), b.qname());
    this.verifyEq(a.ns(), b.ns());
    this.verifyEq(sys.ObjUtil.coerce(a.attrs().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.attrs().size(), sys.Obj.type$.toNullable()));
    a.attrs().each((aa,i) => {
      let ba = b.attrs().get(i);
      this$.verifyAttr(aa, ba);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(a.children().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.children().size(), sys.Obj.type$.toNullable()));
    a.children().each((an,i) => {
      let bn = b.children().get(i);
      this$.verifyNode(an, bn);
      return;
    });
    return;
  }

  verifyAttr(a,b) {
    this.verifyEq(a.name(), b.name());
    this.verifyEq(a.qname(), b.qname());
    this.verifyEq(a.val(), b.val());
    return;
  }

  verifyText(a,b) {
    this.verifyEq(a.val(), b.val());
    this.verifyEq(sys.ObjUtil.coerce(a.cdata(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.cdata(), sys.Obj.type$.toNullable()));
    return;
  }

  verifyPi(a,b) {
    this.verifyEq(a.target(), b.target());
    this.verifyEq(a.val(), b.val());
    return;
  }

  verifyPis(a,b) {
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(a.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()));
    a.each((ax,i) => {
      this$.verifyPi(ax, b.get(i));
      return;
    });
    return;
  }

  static make() {
    const $self = new XmlTest();
    XmlTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class DomTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DomTest.type$; }

  testAttrs() {
    const this$ = this;
    let x = XElem.make("foo");
    let a = XAttr.make("a", "aval");
    let b = XAttr.make("b", "bval");
    let c = XAttr.make("c", "cval");
    this.verifyEq(x.attrs(), sys.List.make(XAttr.type$));
    this.verifyEq(sys.ObjUtil.coerce(x.attrs().isRO(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(x.attr("a", false), null);
    this.verifyEq(x.get("a", false), null);
    this.verifyErr(XErr.type$, (it) => {
      x.attr("a");
      return;
    });
    this.verifyErr(XErr.type$, (it) => {
      x.attr("a", true);
      return;
    });
    this.verifyErr(XErr.type$, (it) => {
      x.get("a");
      return;
    });
    this.verifyErr(XErr.type$, (it) => {
      x.get("a", true);
      return;
    });
    this.verifySame(x.add(a), x);
    this.verifyEq(x.attrs(), sys.List.make(XAttr.type$, [a]));
    this.verifyEq(sys.ObjUtil.coerce(x.attrs().isRO(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifySame(x.attr("a"), a);
    this.verifySame(x.attr("a", false), a);
    this.verifySame(x.attr("a", true), a);
    this.verifySame(x.get("a"), "aval");
    this.verifySame(x.get("a", false), "aval");
    this.verifySame(x.get("a", true), "aval");
    x.add(b).add(c);
    this.verifyEq(x.attrs(), sys.List.make(XAttr.type$, [a, b, c]));
    this.verifyEq(sys.ObjUtil.coerce(x.attrs().isRO(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifySame(x.attr("a"), a);
    this.verifySame(x.attr("b"), b);
    this.verifySame(x.attr("c"), c);
    this.verifySame(x.get("a"), "aval");
    this.verifySame(x.get("b"), "bval");
    this.verifySame(x.get("c"), "cval");
    this.verifyEq(x.get("aa", false), null);
    this.verifyErr(XErr.type$, (it) => {
      x.attr("aa");
      return;
    });
    let acc = sys.List.make(XAttr.type$);
    x.eachAttr((q) => {
      acc.add(q);
      return;
    });
    this.verifyEq(acc, sys.List.make(XAttr.type$, [a, b, c]));
    this.verifySame(x.removeAttrAt(1), b);
    this.verifyEq(x.attrs(), sys.List.make(XAttr.type$, [a, c]));
    this.verifySame(x.removeAttrAt(-1), c);
    this.verifyEq(x.attrs(), sys.List.make(XAttr.type$, [a]));
    this.verifySame(x.removeAttr(a), a);
    this.verifyEq(x.attrs(), sys.List.make(XAttr.type$));
    this.verifyEq(sys.ObjUtil.coerce(x.attrs().isRO(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(x.removeAttr(a), null);
    this.verifySame(x.add(b), x);
    this.verifyEq(x.attrs(), sys.List.make(XAttr.type$, [b]));
    this.verifySame(x.get("a", false), null);
    this.verifySame(x.get("b", false), "bval");
    this.verifySame(x.get("c", false), null);
    return;
  }

  testChildren() {
    const this$ = this;
    let x = XElem.make("x");
    let a = XElem.make("a");
    let b = XElem.make("b").add(XText.make("btext"));
    let t = XText.make("text");
    let pi = XPi.make("pi", "pival");
    this.verifyEq(x.children(), sys.List.make(XNode.type$));
    this.verifyEq(sys.ObjUtil.coerce(x.children().isRO(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(x.elems(), sys.List.make(XElem.type$));
    this.verifyEq(x.elem("foo", false), null);
    this.verifyErr(XErr.type$, (it) => {
      x.elem("foo");
      return;
    });
    this.verifyErr(XErr.type$, (it) => {
      x.elem("foo", true);
      return;
    });
    this.verifyEq(x.text(), null);
    x.add(pi);
    this.verifySame(pi.parent(), x);
    this.verifyEq(x.children(), sys.List.make(XNode.type$, [pi]));
    this.verifyEq(sys.ObjUtil.coerce(x.children().isRO(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(x.elems(), sys.List.make(XElem.type$));
    this.verifyEq(x.text(), null);
    x.add(a);
    this.verifySame(a.parent(), x);
    this.verifyEq(x.children(), sys.List.make(XNode.type$, [pi, a]));
    this.verifyEq(sys.ObjUtil.coerce(x.children().isRO(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(x.elems(), sys.List.make(XElem.type$, [a]));
    this.verifySame(x.elem("a", false), a);
    this.verifySame(x.elem("a", true), a);
    this.verifyEq(x.text(), null);
    x.add(t);
    this.verifySame(t.parent(), x);
    this.verifyEq(x.children(), sys.List.make(XNode.type$, [pi, a, t]));
    this.verifyEq(x.elems(), sys.List.make(XElem.type$, [a]));
    this.verifySame(x.elem("a"), a);
    this.verifySame(x.text(), t);
    x.add(b);
    this.verifySame(b.parent(), x);
    this.verifyEq(x.children(), sys.List.make(XNode.type$, [pi, a, t, b]));
    this.verifyEq(x.elems(), sys.List.make(XElem.type$, [a, b]));
    this.verifySame(x.elem("a"), a);
    this.verifySame(x.elem("b"), b);
    this.verifyEq(x.elem("foo", false), null);
    this.verifyErr(XErr.type$, (it) => {
      x.elem("foo");
      return;
    });
    this.verifyErr(XErr.type$, (it) => {
      x.elem("foo", true);
      return;
    });
    this.verifySame(x.text(), t);
    let acc = sys.List.make(XNode.type$);
    x.each((n) => {
      acc.add(n);
      return;
    });
    this.verifyEq(acc, sys.List.make(XNode.type$, [pi, a, t, b]));
    this.verifyErr(sys.ArgErr.type$, (it) => {
      x.add(t);
      return;
    });
    this.verifySame(x.removeAt(-2), t);
    this.verifyEq(t.parent(), null);
    x.add(t);
    this.verifyEq(x.children(), sys.List.make(XNode.type$, [pi, a, b, t]));
    this.verifySame(x.remove(t), t);
    this.verifySame(x.remove(pi), pi);
    this.verifySame(x.remove(pi), null);
    this.verifySame(x.remove(a), a);
    this.verifyEq(t.parent(), null);
    this.verifyEq(a.parent(), null);
    this.verifyEq(pi.parent(), null);
    this.verifyEq(x.children(), sys.List.make(XNode.type$, [b]));
    this.verifyEq(sys.ObjUtil.coerce(x.children().isRO(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(x.elems(), sys.List.make(XElem.type$, [b]));
    return;
  }

  testDoc() {
    const this$ = this;
    let doc = XDoc.make();
    this.verifySame(doc.doc(), doc);
    this.verifySame(doc.root().doc(), doc);
    this.verifyEq(doc.root().name(), "undefined");
    this.verifySame(doc.root().parent(), doc);
    doc.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root"), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("a"), (it) => {
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("b"), (it) => {
          it.add(XText.make("text"));
          return;
        }), XElem.type$));
        return;
      }), XElem.type$)).add(XElem.make("c"));
      return;
    }), XElem.type$));
    this.verifySame(doc.doc(), doc);
    this.verifySame(doc.root().doc(), doc);
    this.verifySame(doc.root().parent(), doc);
    this.verifySame(doc.root().elem("a").doc(), doc);
    this.verifySame(doc.root().elem("a").elem("b").doc(), doc);
    this.verifySame(doc.root().elem("a").elem("b").text().doc(), doc);
    this.verifyEq(XElem.make("x").doc(), null);
    this.verifyErr(sys.ArgErr.type$, (it) => {
      doc.root(sys.ObjUtil.coerce(doc.root().elem("a"), XElem.type$));
      return;
    });
    doc.add(XElem.make("newRoot"));
    this.verifyEq(doc.root().name(), "newRoot");
    this.verifySame(doc.root().parent(), doc);
    this.verifySame(doc.root().doc(), doc);
    let piA = XPi.make("a", "aval");
    let piB = XPi.make("b", "bval");
    this.verifyEq(doc.pis(), sys.List.make(XPi.type$));
    this.verifyEq(sys.ObjUtil.coerce(doc.pis().isRO(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(doc.removePi(piA), null);
    doc.add(piA);
    this.verifyEq(doc.pis(), sys.List.make(XPi.type$, [piA]));
    this.verifyEq(sys.ObjUtil.coerce(doc.pis().isRO(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    doc.add(piB);
    this.verifyEq(doc.pis(), sys.List.make(XPi.type$, [piA, piB]));
    this.verifyEq(sys.ObjUtil.coerce(doc.pis().isRO(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifySame(doc.removePi(piA), piA);
    this.verifyEq(doc.pis(), sys.List.make(XPi.type$, [piB]));
    this.verifyEq(sys.ObjUtil.coerce(doc.pis().isRO(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    return;
  }

  testNsIdentity() {
    let nsdef = XNs.make("", sys.Uri.fromStr("http://foo/default"));
    let nsq = XNs.make("q", sys.Uri.fromStr("http://foo/q"));
    this.verifyEq(sys.ObjUtil.coerce(nsdef.isDefault(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(nsq.isDefault(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(nsdef.prefix(), "");
    this.verifyEq(nsq.prefix(), "q");
    this.verifyEq(nsdef.uri(), sys.Uri.fromStr("http://foo/default"));
    this.verifyEq(nsdef, XNs.make("", sys.Uri.fromStr("http://foo/default")));
    this.verifyEq(nsdef, XNs.make("foo", sys.Uri.fromStr("http://foo/default")));
    this.verifyNotEq(nsdef, XNs.make("", sys.Uri.fromStr("http://foo/diff/")));
    return;
  }

  testNsElem() {
    let nsdef = XNs.make("", sys.Uri.fromStr("http://foo/default"));
    let nsq = XNs.make("q", sys.Uri.fromStr("http://foo/q"));
    let u = XElem.make("u");
    this.verifyEq(u.name(), "u");
    this.verifyEq(u.qname(), "u");
    this.verifyEq(u.prefix(), null);
    this.verifyEq(u.uri(), null);
    this.verifyEq(u.ns(), null);
    let x = XElem.make("root", nsdef);
    this.verifyEq(x.name(), "root");
    this.verifyEq(x.qname(), "root");
    this.verifyEq(x.prefix(), "");
    this.verifyEq(x.uri(), sys.Uri.fromStr("http://foo/default"));
    this.verifySame(x.ns(), nsdef);
    let a = XElem.make("a", nsq);
    this.verifyEq(a.name(), "a");
    this.verifyEq(a.qname(), "q:a");
    this.verifyEq(a.prefix(), "q");
    this.verifyEq(a.uri(), sys.Uri.fromStr("http://foo/q"));
    this.verifySame(a.ns(), nsq);
    return;
  }

  testNsAttr() {
    const this$ = this;
    let nsdef = XNs.make("", sys.Uri.fromStr("http://foo/default"));
    let nsq = XNs.make("q", sys.Uri.fromStr("http://foo/q"));
    let u = XAttr.make("u", "uval");
    this.verifyEq(u.name(), "u");
    this.verifyEq(u.qname(), "u");
    this.verifyEq(u.prefix(), null);
    this.verifyEq(u.uri(), null);
    this.verifyEq(u.ns(), null);
    let a = XAttr.make("a", "aval", nsq);
    this.verifyEq(a.name(), "a");
    this.verifyEq(a.qname(), "q:a");
    this.verifyEq(a.prefix(), "q");
    this.verifyEq(a.uri(), sys.Uri.fromStr("http://foo/q"));
    this.verifySame(a.ns(), nsq);
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let x = XAttr.make("def", "defval", nsdef);
      return;
    });
    return;
  }

  static make() {
    const $self = new DomTest();
    DomTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class PullTest extends XmlTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PullTest.type$; }

  static #start = undefined;

  static start() {
    if (PullTest.#start === undefined) {
      PullTest.static$init();
      if (PullTest.#start === undefined) PullTest.#start = null;
    }
    return PullTest.#start;
  }

  static #end = undefined;

  static end() {
    if (PullTest.#end === undefined) {
      PullTest.static$init();
      if (PullTest.#end === undefined) PullTest.#end = null;
    }
    return PullTest.#end;
  }

  static #text = undefined;

  static text() {
    if (PullTest.#text === undefined) {
      PullTest.static$init();
      if (PullTest.#text === undefined) PullTest.#text = null;
    }
    return PullTest.#text;
  }

  static #pi = undefined;

  static pi() {
    if (PullTest.#pi === undefined) {
      PullTest.static$init();
      if (PullTest.#pi === undefined) PullTest.#pi = null;
    }
    return PullTest.#pi;
  }

  static #empty = undefined;

  static empty() {
    if (PullTest.#empty === undefined) {
      PullTest.static$init();
      if (PullTest.#empty === undefined) PullTest.#empty = null;
    }
    return PullTest.#empty;
  }

  #parser = null;

  parser(it) {
    if (it === undefined) {
      return this.#parser;
    }
    else {
      this.#parser = it;
      return;
    }
  }

  testElems() {
    this.init("<root>\n  <a>\n    <b></b>\n    <c/>\n  </a>\n  <d/>\n</root>");
    let root = XElem.make("root");
    let a = XElem.make("a");
    let b = XElem.make("b");
    let c = XElem.make("c");
    let d = XElem.make("d");
    this.verifyEq(this.#parser.elem(), null);
    this.verifyEq(sys.ObjUtil.coerce(this.#parser.depth(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-1, sys.Obj.type$.toNullable()));
    this.verifyNext(PullTest.start(), 0, sys.List.make(XElem.type$, [root]));
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, a]));
    this.verifyNext(PullTest.start(), 2, sys.List.make(XElem.type$, [root, a, b]));
    this.verifyNext(PullTest.end(), 2, sys.List.make(XElem.type$, [root, a, b]));
    this.verifyNext(PullTest.start(), 2, sys.List.make(XElem.type$, [root, a, c]));
    this.verifyNext(PullTest.end(), 2, sys.List.make(XElem.type$, [root, a, c]));
    this.verifyNext(PullTest.end(), 1, sys.List.make(XElem.type$, [root, a]));
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, d]));
    this.verifyNext(PullTest.end(), 1, sys.List.make(XElem.type$, [root, d]));
    this.verifyNext(PullTest.end(), 0, sys.List.make(XElem.type$, [root]));
    this.verifyNext(null, -1, PullTest.empty());
    return;
  }

  testAttrs() {
    const this$ = this;
    this.init("<root a='foo'>\n  <a b='bad!' c='good!'>\n    <b xyz='4 &lt; 5'/>\n    <c/>\n  </a>\n  <d>\n    <e/>\n    <f x='X'  y='Y'\n       z='Z'/>\n    <g/>\n  </d>\n</root>");
    let root = sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root"), (it) => {
      it.addAttr("a", "foo");
      return;
    }), XElem.type$);
    let a = sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("a"), (it) => {
      it.addAttr("b", "bad!");
      it.addAttr("c", "good!");
      return;
    }), XElem.type$);
    let b = sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("b"), (it) => {
      it.addAttr("xyz", "4 < 5");
      return;
    }), XElem.type$);
    let c = XElem.make("c");
    let d = XElem.make("d");
    let e = XElem.make("e");
    let f = sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("f"), (it) => {
      it.addAttr("x", "X");
      it.addAttr("y", "Y");
      it.addAttr("z", "Z");
      return;
    }), XElem.type$);
    let g = XElem.make("g");
    this.verifyNext(PullTest.start(), 0, sys.List.make(XElem.type$, [root]));
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, a]));
    this.verifyNext(PullTest.start(), 2, sys.List.make(XElem.type$, [root, a, b]));
    this.verifyNext(PullTest.end(), 2, sys.List.make(XElem.type$, [root, a, b]));
    this.verifyNext(PullTest.start(), 2, sys.List.make(XElem.type$, [root, a, c]));
    this.verifyNext(PullTest.end(), 2, sys.List.make(XElem.type$, [root, a, c]));
    this.verifyNext(PullTest.end(), 1, sys.List.make(XElem.type$, [root, a]));
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, d]));
    this.verifyNext(PullTest.start(), 2, sys.List.make(XElem.type$, [root, d, e]));
    this.verifyNext(PullTest.end(), 2, sys.List.make(XElem.type$, [root, d, e]));
    this.verifyNext(PullTest.start(), 2, sys.List.make(XElem.type$, [root, d, f]));
    this.verifyNext(PullTest.end(), 2, sys.List.make(XElem.type$, [root, d, f]));
    this.verifyNext(PullTest.start(), 2, sys.List.make(XElem.type$, [root, d, g]));
    this.verifyNext(PullTest.end(), 2, sys.List.make(XElem.type$, [root, d, g]));
    this.verifyNext(PullTest.end(), 1, sys.List.make(XElem.type$, [root, d]));
    this.verifyNext(PullTest.end(), 0, sys.List.make(XElem.type$, [root]));
    this.verifyNext(null, -1, PullTest.empty());
    return;
  }

  testMixed() {
    const this$ = this;
    this.init("<?xml version='1.0'?>\n<root>\n  <a>foo bar</a>\n  <!-- comment -->\n  <b>this <i>really</i> is cool</b>\n  <![CDATA[anything &amp; goes]]>\n</root>");
    let root = XElem.make("root");
    let a = XElem.make("a");
    let b = XElem.make("b");
    let i = XElem.make("i");
    this.verifyNext(PullTest.start(), 0, sys.List.make(XElem.type$, [root]));
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, a]));
    this.verifyNext(PullTest.text(), 1, sys.List.make(XElem.type$, [root, a]), XText.make("foo bar"));
    this.verifyNext(PullTest.end(), 1, sys.List.make(XElem.type$, [root, a]));
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, b]));
    this.verifyNext(PullTest.text(), 1, sys.List.make(XElem.type$, [root, b]), XText.make("this "));
    this.verifyNext(PullTest.start(), 2, sys.List.make(XElem.type$, [root, b, i]));
    this.verifyNext(PullTest.text(), 2, sys.List.make(XElem.type$, [root, b, i]), XText.make("really"));
    this.verifyNext(PullTest.end(), 2, sys.List.make(XElem.type$, [root, b, i]));
    this.verifyNext(PullTest.text(), 1, sys.List.make(XElem.type$, [root, b]), XText.make(" is cool"));
    this.verifyNext(PullTest.end(), 1, sys.List.make(XElem.type$, [root, b]));
    this.verifyNext(PullTest.text(), 0, sys.List.make(XElem.type$, [root]), sys.ObjUtil.coerce(sys.ObjUtil.with(XText.make("anything &amp; goes"), (it) => {
      it.cdata(true);
      return;
    }), XText.type$));
    this.verifyNext(PullTest.end(), 0, sys.List.make(XElem.type$, [root]));
    this.verifyNext(null, -1, PullTest.empty());
    return;
  }

  testPi() {
    this.init("<?xml version='1.0'?>\n<?targetA?>\n<?targetB with some value?>\n<root>\n  <?targetB\n    with some value?>\n</root>");
    let root = XElem.make("root");
    let piA = XPi.make("targetA", "");
    let piB = XPi.make("targetB", "with some value");
    this.verifyPis(sys.ObjUtil.coerce(this.#parser.doc().pis(), sys.Type.find("xml::XPi[]")), sys.List.make(XPi.type$));
    this.verifyNext(PullTest.pi(), -1, PullTest.empty(), piA);
    this.verifyPis(sys.ObjUtil.coerce(this.#parser.doc().pis(), sys.Type.find("xml::XPi[]")), sys.List.make(XPi.type$, [piA]));
    this.verifyNext(PullTest.pi(), -1, PullTest.empty(), piB);
    this.verifyPis(sys.ObjUtil.coerce(this.#parser.doc().pis(), sys.Type.find("xml::XPi[]")), sys.List.make(XPi.type$, [piA, piB]));
    this.verifyNext(PullTest.start(), 0, sys.List.make(XElem.type$, [root]));
    this.verifyNext(PullTest.pi(), 0, sys.List.make(XElem.type$, [root]), piB);
    this.verifyNext(PullTest.end(), 0, sys.List.make(XElem.type$, [root]));
    this.verifyNext(null, -1, PullTest.empty());
    return;
  }

  testDoc() {
    this.init("<?xml version='1.0'?>\n<!DOCTYPE foo\tPUBLIC\t'foo' 'urn:foo'>\n<root/>");
    let root = XElem.make("root");
    this.verifyEq(this.#parser.elem(), null);
    this.verifyEq(sys.ObjUtil.coerce(this.#parser.depth(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-1, sys.Obj.type$.toNullable()));
    this.verifyEq(this.#parser.doc().docType(), null);
    this.verifyNext(PullTest.start(), 0, sys.List.make(XElem.type$, [root]));
    this.verifyEq(this.#parser.doc().docType().toStr(), "<!DOCTYPE foo PUBLIC 'foo' 'urn:foo'>");
    return;
  }

  testNs() {
    const this$ = this;
    this.init("<root xmlns='fan:def' xmlns:q='fan:q'>\n  <a attr='val' q:attr='val'/>\n  <q:b/>\n</root>");
    let def = XNs.make("", sys.Uri.fromStr("fan:def"));
    let q = XNs.make("q", sys.Uri.fromStr("fan:q"));
    let root = sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root", def), (it) => {
      it.add(XAttr.makeNs(def)).add(XAttr.makeNs(q));
      return;
    }), XElem.type$);
    let a = sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("a", def), (it) => {
      it.addAttr("attr", "val");
      it.addAttr("attr", "val", q);
      return;
    }), XElem.type$);
    let b = XElem.make("b", q);
    this.verifyEq(this.#parser.elem(), null);
    this.verifyEq(sys.ObjUtil.coerce(this.#parser.depth(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-1, sys.Obj.type$.toNullable()));
    this.verifyNext(PullTest.start(), 0, sys.List.make(XElem.type$, [root]));
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, a]));
    this.verifyNext(PullTest.end(), 1, sys.List.make(XElem.type$, [root, a]));
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, b]));
    this.verifyNext(PullTest.end(), 1, sys.List.make(XElem.type$, [root, b]));
    this.verifyNext(PullTest.end(), 0, sys.List.make(XElem.type$, [root]));
    this.verifyNext(null, -1, PullTest.empty());
    return;
  }

  testSkipAndMem() {
    const this$ = this;
    this.init("<root>\n  <!-- skip nodes -->\n  <skip/>\n  <skip><bar/></skip>\n  <skip>\n    <foo><bar/></foo>\n    <foo/>\n    <foo><bar/></foo>\n  </skip>\n  <!-- mem nodes -->\n  <a/>\n  <mem1 a='b'/>\n  <a/>\n  <mem2><kid><grandkid/></kid></mem2>\n  <a/>\n</root>");
    let root = XElem.make("root");
    let skip = XElem.make("skip");
    let foo = XElem.make("foo");
    let a = XElem.make("a");
    let mem1 = sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("mem1"), (it) => {
      it.addAttr("a", "b");
      return;
    }), XElem.type$);
    let mem2 = XElem.make("mem2");
    this.verifyNext(PullTest.start(), 0, sys.List.make(XElem.type$, [root]));
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, skip]));
    this.verifyEq(sys.ObjUtil.coerce(this.#parser.line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.#parser.skip();
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, skip]));
    this.verifyEq(sys.ObjUtil.coerce(this.#parser.line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.#parser.skip();
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, skip]));
    this.verifyEq(sys.ObjUtil.coerce(this.#parser.line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    this.verifyNext(PullTest.start(), 2, sys.List.make(XElem.type$, [root, skip, foo]));
    this.verifyEq(sys.ObjUtil.coerce(this.#parser.line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(6, sys.Obj.type$.toNullable()));
    this.#parser.skip(1);
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, a]));
    this.verifyEq(sys.ObjUtil.coerce(this.#parser.line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(11, sys.Obj.type$.toNullable()));
    this.verifyNext(PullTest.end(), 1, sys.List.make(XElem.type$, [root, a]));
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, mem1]));
    let xmem1 = this.#parser.parseElem();
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, a]));
    this.verifyEq(sys.ObjUtil.coerce(this.#parser.line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(13, sys.Obj.type$.toNullable()));
    this.verifyNext(PullTest.end(), 1, sys.List.make(XElem.type$, [root, a]));
    this.verifyElem(xmem1, mem1);
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, mem2]));
    let xmem2 = this.#parser.parseElem();
    this.verifyNext(PullTest.start(), 1, sys.List.make(XElem.type$, [root, a]));
    this.verifyEq(sys.ObjUtil.coerce(this.#parser.line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(15, sys.Obj.type$.toNullable()));
    this.verifyNext(PullTest.end(), 1, sys.List.make(XElem.type$, [root, a]));
    this.verifyElem(xmem2, sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("mem2"), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("kid"), (it) => {
        it.add(XElem.make("grandkid"));
        return;
      }), XElem.type$));
      return;
    }), XElem.type$));
    this.verifyNext(PullTest.end(), 0, sys.List.make(XElem.type$, [root]));
    this.verifyNext(null, -1, PullTest.empty());
    this.verifyElem(xmem1, mem1);
    this.verifyElem(xmem2, sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("mem2"), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("kid"), (it) => {
        it.add(XElem.make("grandkid"));
        return;
      }), XElem.type$));
      return;
    }), XElem.type$));
    return;
  }

  verifyNext(t,depth,stack,cur) {
    if (cur === undefined) cur = null;
    const this$ = this;
    this.verifyEq(this.#parser.next(), t);
    this.verifyEq(this.#parser.nodeType(), t);
    this.verifyEq(sys.ObjUtil.coerce(this.#parser.depth(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(depth, sys.Obj.type$.toNullable()));
    this.verifyElem(this.#parser.elem(), stack.last());
    stack.each((e,i) => {
      this$.verifyElem(this$.#parser.elemAt(i), e);
      return;
    });
    this.verifyErr(sys.IndexErr.type$, (it) => {
      this$.#parser.elemAt(-1);
      return;
    });
    this.verifyErr(sys.IndexErr.type$, (it) => {
      this$.#parser.elemAt(stack.size());
      return;
    });
    let $_u52 = t;
    if (sys.ObjUtil.equals($_u52, PullTest.text())) {
      this.verifyText(sys.ObjUtil.coerce(this.#parser.text(), XText.type$), sys.ObjUtil.coerce(cur, XText.type$));
    }
    else if (sys.ObjUtil.equals($_u52, PullTest.pi())) {
      this.verifyPi(sys.ObjUtil.coerce(this.#parser.pi(), XPi.type$), sys.ObjUtil.coerce(cur, XPi.type$));
    }
    ;
    return;
  }

  dump() {
    const this$ = this;
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(":::: ", this.#parser.nodeType()), " "), sys.ObjUtil.coerce(this.#parser.depth(), sys.Obj.type$.toNullable())));
    sys.ObjUtil.echo(sys.Str.plus("     elem: ", this.#parser.elem()));
    sys.Int.times(sys.Int.plus(this.#parser.depth(), 1), (i) => {
      sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus("     elemAt(", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), "): "), this$.#parser.elemAt(i)));
      return;
    });
    return;
  }

  init(src) {
    this.#parser = XParser.make(sys.Str.in(src));
    return;
  }

  static make() {
    const $self = new PullTest();
    PullTest.make$($self);
    return $self;
  }

  static make$($self) {
    XmlTest.make$($self);
    return;
  }

  static static$init() {
    PullTest.#start = XNodeType.elemStart();
    PullTest.#end = XNodeType.elemEnd();
    PullTest.#text = XNodeType.text();
    PullTest.#pi = XNodeType.pi();
    PullTest.#empty = sys.ObjUtil.coerce(((this$) => { let $_u53 = sys.List.make(XElem.type$); if ($_u53 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(XElem.type$)); })(this), sys.Type.find("xml::XElem[]"));
    return;
  }

}

class WriteTest extends XmlTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WriteTest.type$; }

  testWrites() {
    const this$ = this;
    let x = XElem.make("x");
    this.verifyWrite(x, "<x/>");
    x.addAttr("a", "aval");
    this.verifyWrite(x, "<x a='aval'/>");
    x.addAttr("b", "bval");
    this.verifyWrite(x, "<x a='aval' b='bval'/>");
    let withText = XElem.make("withText").add(XText.make("some text"));
    this.verifyWrite(withText, "<withText>some text</withText>");
    x.add(withText);
    this.verifyWrite(x, "<x a='aval' b='bval'>\n <withText>some text</withText>\n</x>");
    let a = XElem.make("a").add(XPi.make("pi", "name='val'"));
    let b = XElem.make("b").addAttr("foo", "bar");
    x.add(a).add(b);
    this.verifyWrite(x, "<x a='aval' b='bval'>\n <withText>some text</withText>\n <a>\n  <?pi name='val'?>\n </a>\n <b foo='bar'/>\n</x>");
    let c = XElem.make("c").add(XText.make("text of c!"));
    x.add(c);
    this.verifyWrite(x, "<x a='aval' b='bval'>\n <withText>some text</withText>\n <a>\n  <?pi name='val'?>\n </a>\n <b foo='bar'/>\n <c>text of c!</c>\n</x>");
    let mixed = sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("mixed"), (it) => {
      it.add(XText.make("the ")).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("b"), (it) => {
        it.add(XText.make("real"));
        return;
      }), XElem.type$)).add(XText.make(" deal"));
      return;
    }), XElem.type$);
    this.verifyWrite(mixed, "<mixed>the <b>real</b> deal</mixed>");
    x.add(mixed);
    this.verifyWrite(x, "<x a='aval' b='bval'>\n <withText>some text</withText>\n <a>\n  <?pi name='val'?>\n </a>\n <b foo='bar'/>\n <c>text of c!</c>\n <mixed>the <b>real</b> deal</mixed>\n</x>");
    let seq = XElem.make("seq").add(XText.make("a")).add(XText.make("b")).add(XText.make("c"));
    this.verifyWrite(seq, "<seq>abc</seq>", false);
    let multi = XElem.make("multi").add(XText.make("line1\nline2"));
    this.verifyWrite(multi, "<multi>line1\nline2</multi>");
    return;
  }

  testDoc() {
    const this$ = this;
    let doc = XDoc.make();
    this.verifyWrite(doc, "<?xml version='1.0' encoding='UTF-8'?>\n<undefined/>\n");
    doc.root(XElem.make("root").addAttr("foo", "bar").add(XText.make("how, how")));
    this.verifyWrite(doc, "<?xml version='1.0' encoding='UTF-8'?>\n<root foo='bar'>how, how</root>\n");
    doc.docType(sys.ObjUtil.coerce(sys.ObjUtil.with(XDocType.make(), (it) => {
      it.rootElem("root");
      it.systemId(sys.Uri.fromStr("root.dtd"));
      return;
    }), XDocType.type$));
    this.verifyWrite(doc, "<?xml version='1.0' encoding='UTF-8'?>\n<!DOCTYPE root SYSTEM 'root.dtd'>\n<root foo='bar'>how, how</root>\n");
    doc.docType(sys.ObjUtil.coerce(sys.ObjUtil.with(XDocType.make(), (it) => {
      it.rootElem("root");
      it.publicId("foo");
      return;
    }), XDocType.type$));
    this.verifyWrite(doc, "<?xml version='1.0' encoding='UTF-8'?>\n<!DOCTYPE root PUBLIC 'foo'>\n<root foo='bar'>how, how</root>\n");
    doc.docType(sys.ObjUtil.coerce(sys.ObjUtil.with(XDocType.make(), (it) => {
      it.rootElem("root");
      it.publicId("-//W3C//DTD XHTML 1.0 Transitional//EN");
      it.systemId(sys.Uri.fromStr("http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"));
      return;
    }), XDocType.type$));
    this.verifyWrite(doc, "<?xml version='1.0' encoding='UTF-8'?>\n<!DOCTYPE root PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>\n<root foo='bar'>how, how</root>\n");
    (doc = sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.add(XPi.make("xml-stylesheet", "type='text/xsl' href='simple.xsl'")).add(XElem.make("foo"));
      return;
    }), XDoc.type$));
    this.verifyWrite(doc, "<?xml version='1.0' encoding='UTF-8'?>\n<?xml-stylesheet type='text/xsl' href='simple.xsl'?>\n<foo/>\n");
    (doc = sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.docType(sys.ObjUtil.coerce(sys.ObjUtil.with(XDocType.make(), (it) => {
        it.rootElem("foo");
        it.systemId(sys.Uri.fromStr("foo.dtd"));
        return;
      }), XDocType.type$));
      it.add(XPi.make("alpha", "foo bar")).add(XPi.make("beta", "foo=bar")).add(XElem.make("foo"));
      return;
    }), XDoc.type$));
    this.verifyWrite(doc, "<?xml version='1.0' encoding='UTF-8'?>\n<!DOCTYPE foo SYSTEM 'foo.dtd'>\n<?alpha foo bar?>\n<?beta foo=bar?>\n<foo/>\n");
    return;
  }

  testEsc() {
    let x = XElem.make("x").addAttr("foo", "<AT&T>");
    this.verifyWrite(x, "<x foo='&lt;AT&amp;T>'/>");
    (x = XElem.make("x").addAttr("foo", "quot=\" \n apos='"));
    this.verifyWrite(x, "<x foo='quot=&quot; &#x0a; apos=&#39;'/>");
    (x = XElem.make("x").add(XText.make("'hi' & <there>\n \"line2\"")));
    this.verifyWrite(x, "<x>'hi' &amp; &lt;there>\n \"line2\"</x>");
    return;
  }

  testCdata() {
    const this$ = this;
    let x = XElem.make("x").add(sys.ObjUtil.coerce(sys.ObjUtil.with(XText.make("'hi' & <there>\n \"line2\""), (it) => {
      it.cdata(true);
      return;
    }), XText.type$));
    this.verifyWrite(x, "<x><![CDATA['hi' & <there>\n \"line2\"]]></x>");
    (x = XElem.make("x").add(sys.ObjUtil.coerce(sys.ObjUtil.with(XText.make("]]>"), (it) => {
      it.cdata(true);
      return;
    }), XText.type$)));
    this.verifyErr(sys.IOErr.type$, (it) => {
      this$.verifyWrite(x, "?");
      return;
    });
    return;
  }

  testNs() {
    const this$ = this;
    let nsdef = XNs.make("", sys.Uri.fromStr("http://foo/def"));
    let nsq = XNs.make("q", sys.Uri.fromStr("http://foo/q"));
    let x = sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root", nsdef), (it) => {
      it.add(XAttr.makeNs(nsdef)).add(XAttr.makeNs(nsq)).add(XElem.make("a", nsdef)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("b", nsq), (it) => {
        it.add(XAttr.make("x", "xv")).add(XAttr.make("y", "yv", nsq));
        return;
      }), XElem.type$));
      return;
    }), XElem.type$);
    this.verifyWrite(x, "<root xmlns='http://foo/def' xmlns:q='http://foo/q'>\n <a/>\n <q:b x='xv' q:y='yv'/>\n</root>");
    return;
  }

  verifyWrite(xml,expected,testRoundtrip) {
    if (testRoundtrip === undefined) testRoundtrip = true;
    let buf = sys.Buf.make();
    xml.write(buf.out());
    let actual = sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).readAllStr();
    this.verifyEq(actual, expected);
    let strBuf = sys.StrBuf.make();
    xml.write(strBuf.out());
    (actual = strBuf.toStr());
    this.verifyEq(actual, expected);
    this.verifyEq(xml.writeToStr(), expected);
    if (!testRoundtrip) {
      return;
    }
    ;
    if (sys.ObjUtil.is(xml, XDoc.type$)) {
      this.verifyDoc(XParser.make(sys.Str.in(expected)).parseDoc(), sys.ObjUtil.coerce(xml, XDoc.type$));
    }
    else {
      if (sys.ObjUtil.is(xml, XElem.type$)) {
        this.verifyElem(XParser.make(sys.Str.in(expected)).parseDoc().root(), sys.ObjUtil.coerce(xml, XElem.type$.toNullable()));
      }
      ;
    }
    ;
    return;
  }

  static make() {
    const $self = new WriteTest();
    WriteTest.make$($self);
    return $self;
  }

  static make$($self) {
    XmlTest.make$($self);
    return;
  }

}

class ParserErrTest extends XmlTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ParserErrTest.type$; }

  testBadStarts() {
    this.verifyXErr("", 1, 1);
    this.verifyXErr(" ", 1, 2);
    this.verifyXErr("x", 1, 1);
    this.verifyXErr("xyz <r/>", 1, 2);
    this.verifyXIncompleteErr("<?");
    this.verifyXIncompleteErr("<?xml");
    this.verifyXIncompleteErr("<?xml ?");
    this.verifyXIncompleteErr("<!DOCTYPE");
    this.verifyXIncompleteErr("<!DOCTYPE foo");
    this.verifyXIncompleteErr("<x");
    this.verifyXIncompleteErr("<x/");
    return;
  }

  testElems() {
    this.verifyXErr("</x>", 1, 3);
    this.verifyXErr("<x</x>", 1, 3);
    this.verifyXErr("<  />", 1, 3);
    this.verifyXErr("< x />", 1, 3);
    this.verifyXErr("<root></rootx>", 1, 9);
    this.verifyXErr("<r><x></y></r>", 1, 9);
    this.verifyXErr("<r><x><y></x></y></r>", 1, 12);
    this.verifyXErr("<r><x><y/></x></y></r>", 1, 17);
    this.verifyXErr("<r>\n</x></r>", 2, 3);
    this.verifyXErr("<r>\n\n </>\n</r>", 3, 5);
    this.verifyXErr("<r>\n\n <  />\n</r>", 3, 4);
    this.verifyXErr("<r>foo</x>", 1, 9);
    this.verifyXIncompleteErr("<root><a");
    this.verifyXIncompleteErr("<root><a/");
    this.verifyXIncompleteErr("<root><a/><");
    this.verifyXIncompleteErr("<root><a/></");
    this.verifyXIncompleteErr("<root><a/></root");
    this.verifyXIncompleteErr("<root><root/>");
    this.verifyXIncompleteErr("<root>text...");
    return;
  }

  testAttrs() {
    this.verifyXErr("<x a=x/>", 1, 6);
    this.verifyXErr("<x a=/>", 1, 6);
    this.verifyXErr("<x a=>", 1, 6);
    this.verifyXErr("<x a=<", 1, 6);
    this.verifyXErr("<x\n a = x/>", 2, 6);
    this.verifyXErr("<x a''/>", 1, 5);
    this.verifyXErr("<x\na\n ''/>", 3, 2);
    this.verifyXIncompleteErr("<x a='");
    this.verifyXIncompleteErr("<x a=\"");
    this.verifyXIncompleteErr("<x a='xx");
    this.verifyXIncompleteErr("<x a=\"xx");
    return;
  }

  testNs() {
    this.verifyXErr("\n<x xmlns=' '/>", 2, 4);
    this.verifyXErr("<p:root/>", 1, 2);
    this.verifyXErr("<p:root xmlns='foo'/>", 1, 2);
    this.verifyXErr("\n\n <p:root xmlns:P='foo'/>", 3, 3);
    this.verifyXErr("<r><p:x xmlns:p='foo'/><p:y/></r>", 1, 25);
    this.verifyXErr("<r><p:x xmlns:p='foo'></x></r>", 1, 25);
    this.verifyXErr("<r><p:x xmlns:p='foo'></p></r>", 1, 25);
    this.verifyXErr("<r><p:x xmlns:p='foo'></P:x></r>", 1, 25);
    this.verifyXErr("<r attr:x='bad'>", 1, 2);
    this.verifyXErr("<r><x xmlns:p='foo'/><y p:a='v'/></r>", 1, 23);
    return;
  }

  verifyXErr(xml,line,col) {
    try {
      XParser.make(sys.Str.in(xml)).parseDoc();
      this.fail();
    }
    catch ($_u54) {
      $_u54 = sys.Err.make($_u54);
      if ($_u54 instanceof XErr) {
        let e = $_u54;
        ;
        this.verifyEq(sys.ObjUtil.coerce(e.line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(line, sys.Obj.type$.toNullable()));
        this.verifyEq(sys.ObjUtil.coerce(e.col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(col, sys.Obj.type$.toNullable()));
      }
      else {
        throw $_u54;
      }
    }
    ;
    return;
  }

  verifyXIncompleteErr(xml) {
    try {
      XParser.make(sys.Str.in(xml)).parseDoc();
      this.fail();
    }
    catch ($_u55) {
      $_u55 = sys.Err.make($_u55);
      if ($_u55 instanceof XIncompleteErr) {
        let e = $_u55;
        ;
        let lines = sys.Str.splitLines(xml);
        this.verifyEq(sys.ObjUtil.coerce(e.line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(lines.size(), sys.Obj.type$.toNullable()));
        this.verify(sys.ObjUtil.compareGE(e.col(), sys.Int.minus(sys.Str.size(lines.last()), 1)));
      }
      else {
        throw $_u55;
      }
    }
    ;
    return;
  }

  static make() {
    const $self = new ParserErrTest();
    ParserErrTest.make$($self);
    return $self;
  }

  static make$($self) {
    XmlTest.make$($self);
    return;
  }

}

class ParserTest extends XmlTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ParserTest.type$; }

  testDocType() {
    const this$ = this;
    this.verifyParse("<!DOCTYPE foo>\n<foo/>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.docType(sys.ObjUtil.coerce(sys.ObjUtil.with(XDocType.make(), (it) => {
        it.rootElem("foo");
        it.publicId(null);
        it.systemId(null);
        return;
      }), XDocType.type$));
      it.root(XElem.make("foo"));
      return;
    }), XDoc.type$));
    this.verifyParse("<!DOCTYPE  q:foo >\n<foo/>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.docType(sys.ObjUtil.coerce(sys.ObjUtil.with(XDocType.make(), (it) => {
        it.rootElem("q:foo");
        it.publicId(null);
        it.systemId(null);
        return;
      }), XDocType.type$));
      it.root(XElem.make("foo"));
      return;
    }), XDoc.type$));
    this.verifyParse("<!DOCTYPE foo SYSTEM 'foo.dtd'>\n<foo/>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.docType(sys.ObjUtil.coerce(sys.ObjUtil.with(XDocType.make(), (it) => {
        it.rootElem("foo");
        it.publicId(null);
        it.systemId(sys.Uri.fromStr("foo.dtd"));
        return;
      }), XDocType.type$));
      it.root(XElem.make("foo"));
      return;
    }), XDoc.type$));
    this.verifyParse("<!DOCTYPE  HTML  PUBLIC  \"-//IETF//DTD HTML 3.0//EN\">\n<HTML/>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.docType(sys.ObjUtil.coerce(sys.ObjUtil.with(XDocType.make(), (it) => {
        it.rootElem("HTML");
        it.publicId("-//IETF//DTD HTML 3.0//EN");
        it.systemId(null);
        return;
      }), XDocType.type$));
      it.root(XElem.make("HTML"));
      return;
    }), XDoc.type$));
    this.verifyParse("<!DOCTYPE html PUBLIC\n '-//W3C//DTD XHTML 1.0 Strict//EN'\n 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd' >\n<HTML/>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.docType(sys.ObjUtil.coerce(sys.ObjUtil.with(XDocType.make(), (it) => {
        it.rootElem("html");
        it.publicId("-//W3C//DTD XHTML 1.0 Strict//EN");
        it.systemId(sys.Uri.fromStr("http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"));
        return;
      }), XDocType.type$));
      it.root(XElem.make("HTML"));
      return;
    }), XDoc.type$));
    this.verifyParse("<!DOCTYPE TVSCHEDULE [\n <!ELEMENT TVSCHEDULE (CHANNEL+)>\n <!ELEMENT CHANNEL (BANNER,DAY+)>\n <!ELEMENT BANNER (#PCDATA)>\n <!ELEMENT DAY (#PCDATA)>\n <!ATTLIST CHANNEL CHAN CDATA #REQUIRED>\n <!ENTITY FOO \"BAR\">\n]>\n<TVSCHEDULE/>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.docType(sys.ObjUtil.coerce(sys.ObjUtil.with(XDocType.make(), (it) => {
        it.rootElem("TVSCHEDULE");
        it.publicId(null);
        it.systemId(null);
        return;
      }), XDocType.type$));
      it.root(XElem.make("TVSCHEDULE"));
      return;
    }), XDoc.type$));
    return;
  }

  testElem() {
    const this$ = this;
    this.verifyParse("<root/>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(XElem.make("root"));
      return;
    }), XDoc.type$));
    this.verifyParse("<root>\n <alpha>\n   <beta/>\n </alpha>\n <gamma></gamma>\n</root>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root"), (it) => {
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("alpha"), (it) => {
          it.add(XElem.make("beta"));
          return;
        }), XElem.type$)).add(XElem.make("gamma"));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    return;
  }

  testAttr() {
    const this$ = this;
    this.verifyParse("<root a='aval' b=\"bval\"/>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root"), (it) => {
        it.addAttr("a", "aval");
        it.addAttr("b", "bval");
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    this.verifyParse("<root foo='&lt;&#x20;&gt;'/>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root"), (it) => {
        it.addAttr("foo", "< >");
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    this.verifyParse("<root a='&apos; &quot;' b=\"&apos; &quot;\" />", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root"), (it) => {
        it.addAttr("a", "' \"");
        it.addAttr("b", "' \"");
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    return;
  }

  testMixed() {
    const this$ = this;
    this.verifyParse("<r>hello</r>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("r"), (it) => {
        it.add(XText.make("hello"));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    this.verifyParse(" <r>&amp;\n&#x1234;</r> ", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("r"), (it) => {
        it.add(XText.make("&\n\u1234"));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    this.verifyParse("<r>this is <b>bold</b> for real!</r>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("r"), (it) => {
        it.add(XText.make("this is ")).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("b"), (it) => {
          it.add(XText.make("bold"));
          return;
        }), XElem.type$)).add(XText.make(" for real!"));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    return;
  }

  testCdata() {
    const this$ = this;
    this.verifyParse("<r><![CDATA[]]></r>\n", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("r"), (it) => {
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(XText.make(""), (it) => {
          it.cdata(true);
          return;
        }), XText.type$));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    this.verifyParse("<r><![CDATA[x]]></r>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("r"), (it) => {
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(XText.make("x"), (it) => {
          it.cdata(true);
          return;
        }), XText.type$));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    this.verifyParse("<r><![CDATA[ <&]> ]]></r>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("r"), (it) => {
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(XText.make(" <&]> "), (it) => {
          it.cdata(true);
          return;
        }), XText.type$));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    return;
  }

  testPi() {
    const this$ = this;
    this.verifyParse("<root>\n  <?foo bar?>\n</root>\n", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root"), (it) => {
        it.add(XPi.make("foo", "bar"));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    this.verifyParse("<?xml version='1.0'?>\n<root>\n  <?x y?>\n</root>\n", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root"), (it) => {
        it.add(XPi.make("x", "y"));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    this.verifyParse("<?xml-stylesheet\n  type='text/xsl' href='simple.xsl'?>\n<root>\n  <?synthetic?>\n</root>\n", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.add(XPi.make("xml-stylesheet", "type='text/xsl' href='simple.xsl'")).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root"), (it) => {
        it.add(XPi.make("synthetic", ""));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    this.verifyParse("\n  <?alpha aaa aaa?>\n<?beta?>\n<root>\n  <?gamma  ccc?>\n  <a>\n    <?delta d='ddd'?>\n  </a>\n  <?q:epsilon:x?>\n</root> \n", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.add(XPi.make("alpha", "aaa aaa")).add(XPi.make("beta", "")).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root"), (it) => {
        it.add(XPi.make("gamma", "ccc")).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("a"), (it) => {
          it.add(XPi.make("delta", "d='ddd'"));
          return;
        }), XElem.type$)).add(XPi.make("q:epsilon:x", ""));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    return;
  }

  testNs() {
    const this$ = this;
    let def = XNs.make("", sys.Uri.fromStr("urn:def"));
    let q = XNs.make("q", sys.Uri.fromStr("urn:foo"));
    let rx = XNs.make("rx", sys.Uri.fromStr("urn:bar"));
    this.verifyParse("<q:foo xmlns:q='urn:foo'/>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("foo", q), (it) => {
        it.add(XAttr.makeNs(q));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    this.verifyParse("<foo xmlns='urn:def'/>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("foo", def), (it) => {
        it.add(XAttr.makeNs(def));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    this.verifyParse("<root xmlns='urn:def' xmlns:q='urn:foo'>\n  <a><q:b/></a>\n</root>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root", def), (it) => {
        it.add(XAttr.makeNs(def)).add(XAttr.makeNs(q)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("a", def), (it) => {
          it.add(XElem.make("b", q));
          return;
        }), XElem.type$));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    this.verifyParse("<root xmlns:q='urn:foo' xmlns:rx='urn:bar'>\n  <a><inner/></a>\n  <b xmlns='urn:def'><inner/></b>\n  <q:c><inner/></q:c>\n  <rx:d><inner/></rx:d>\n</root>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root", null), (it) => {
        it.add(XAttr.makeNs(q)).add(XAttr.makeNs(rx)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("a", null), (it) => {
          it.add(XElem.make("inner", null));
          return;
        }), XElem.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("b", def), (it) => {
          it.add(XAttr.makeNs(def)).add(XElem.make("inner", def));
          return;
        }), XElem.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("c", q), (it) => {
          it.add(XElem.make("inner", null));
          return;
        }), XElem.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("d", rx), (it) => {
          it.add(XElem.make("inner", null));
          return;
        }), XElem.type$));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    return;
  }

  testNestedDefaultNs() {
    const this$ = this;
    let def1 = XNs.make("", sys.Uri.fromStr("urn:def1"));
    let def2 = XNs.make("", sys.Uri.fromStr("urn:def2"));
    let def3 = XNs.make("", sys.Uri.fromStr("urn:def3"));
    let xyz = XNs.make("xyz", sys.Uri.fromStr("urn:xyz"));
    this.verifyParse("<root xmlns='urn:def1'>\n  <a/>\n  <b xmlns='urn:def2' xmlns:xyz='urn:xyz'>\n    <none xmlns=''>\n      <innerNone/>\n      <def2 xmlns='urn:def2'><inner/></def2>\n      <def3 xmlns='urn:def3'><xyz:inner/></def3>\n    </none>\n  </b>\n  <c xmlns='urn:def3'><inner/></c>\n  <d/>\n</root>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root", def1), (it) => {
        it.add(XAttr.makeNs(def1)).add(XElem.make("a", def1)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("b", def2), (it) => {
          it.add(XAttr.makeNs(def2)).add(XAttr.makeNs(xyz)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("none", null), (it) => {
            it.addAttr("xmlns", "");
            it.add(XElem.make("innerNone", null)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("def2", def2), (it) => {
              it.add(XAttr.makeNs(def2)).add(XElem.make("inner", def2));
              return;
            }), XElem.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("def3", def3), (it) => {
              it.add(XAttr.makeNs(def3)).add(XElem.make("inner", xyz));
              return;
            }), XElem.type$));
            return;
          }), XElem.type$));
          return;
        }), XElem.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("c", def3), (it) => {
          it.add(XAttr.makeNs(def3)).add(XElem.make("inner", def3));
          return;
        }), XElem.type$)).add(XElem.make("d", def1));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    return;
  }

  testNsAttr() {
    const this$ = this;
    let def = XNs.make("", sys.Uri.fromStr("urn:def"));
    let q = XNs.make("q", sys.Uri.fromStr("urn:foo"));
    let rx = XNs.make("rx", sys.Uri.fromStr("urn:bar"));
    this.verifyParse("<rx:root rx:pre='PRE'\n    xmlns='urn:def' xmlns:q='urn:foo' xmlns:rx='urn:bar'\n    a='A' q:b='B' rx:c='C'>\n  <foo rx:pre='PRE' a='A' q:b='B' rx:c='C'/>\n</rx:root>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("root", rx), (it) => {
        it.addAttr("pre", "PRE", rx);
        it.add(XAttr.makeNs(def)).add(XAttr.makeNs(q)).add(XAttr.makeNs(rx));
        it.addAttr("a", "A", null);
        it.addAttr("b", "B", q);
        it.addAttr("c", "C", rx);
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("foo", def), (it) => {
          it.addAttr("pre", "PRE", rx);
          it.addAttr("a", "A", null);
          it.addAttr("b", "B", q);
          it.addAttr("c", "C", rx);
          return;
        }), XElem.type$));
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    return;
  }

  testXmlAttr() {
    const this$ = this;
    let doc = this.verifyParse("<foo xml:lang='en' XML:Foo='bar'/>", sys.ObjUtil.coerce(sys.ObjUtil.with(XDoc.make(), (it) => {
      it.root(sys.ObjUtil.coerce(sys.ObjUtil.with(XElem.make("foo"), (it) => {
        it.addAttr("xml:lang", "en");
        it.addAttr("xml:Foo", "bar");
        return;
      }), XElem.type$));
      return;
    }), XDoc.type$));
    this.verifyEq(doc.root().attr("xml:lang").name(), "xml:lang");
    this.verifyEq(doc.root().attr("xml:lang").prefix(), null);
    this.verifyEq(doc.root().attr("xml:lang").ns(), null);
    this.verifyEq(doc.root().attr("xml:Foo").name(), "xml:Foo");
    this.verifyEq(doc.root().attr("xml:Foo").prefix(), null);
    this.verifyEq(doc.root().attr("xml:Foo").ns(), null);
    return;
  }

  verifyParse(xml,expected) {
    let actual = XParser.make(sys.Str.in(xml)).parseDoc();
    this.verifyDoc(actual, expected);
    let buf = sys.Buf.make();
    actual.write(buf.out());
    let roundtrip = XParser.make(sys.Str.in(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).readAllStr())).parseDoc();
    this.verifyDoc(roundtrip, expected);
    let sb = sys.StrBuf.make();
    actual.write(sb.out());
    (roundtrip = XParser.make(sys.Str.in(sb.toStr())).parseDoc());
    this.verifyDoc(roundtrip, expected);
    return actual;
  }

  static make() {
    const $self = new ParserTest();
    ParserTest.make$($self);
    return $self;
  }

  static make$($self) {
    XmlTest.make$($self);
    return;
  }

}

const p = sys.Pod.add$('xml');
const xp = sys.Param.noParams$();
let m;
XErr.type$ = p.at$('XErr','sys::Err',[],{'sys::Js':""},8194,XErr);
XParser.type$ = p.at$('XParser','sys::Obj',[],{'sys::Js':""},8192,XParser);
XNsDefs.type$ = p.at$('XNsDefs','sys::Obj',[],{'sys::Js':""},128,XNsDefs);
XAttr.type$ = p.at$('XAttr','sys::Obj',[],{'sys::Js':""},8194,XAttr);
XNode.type$ = p.at$('XNode','sys::Obj',[],{'sys::Js':""},8193,XNode);
XNodeType.type$ = p.at$('XNodeType','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,XNodeType);
XText.type$ = p.at$('XText','xml::XNode',[],{'sys::Js':""},8192,XText);
XElem.type$ = p.at$('XElem','xml::XNode',[],{'sys::Js':""},8192,XElem);
XDocType.type$ = p.at$('XDocType','sys::Obj',[],{'sys::Js':""},8192,XDocType);
XIncompleteErr.type$ = p.at$('XIncompleteErr','xml::XErr',[],{'sys::Js':""},8194,XIncompleteErr);
XPi.type$ = p.at$('XPi','xml::XNode',[],{'sys::Js':""},8192,XPi);
XDoc.type$ = p.at$('XDoc','xml::XNode',[],{'sys::Js':""},8192,XDoc);
XNs.type$ = p.at$('XNs','sys::Obj',[],{'sys::Js':""},8194,XNs);
XmlTest.type$ = p.at$('XmlTest','sys::Test',[],{'sys::NoDoc':"",'sys::Js':""},8193,XmlTest);
DomTest.type$ = p.at$('DomTest','sys::Test',[],{'sys::Js':""},8192,DomTest);
PullTest.type$ = p.at$('PullTest','xml::XmlTest',[],{'sys::Js':""},8192,PullTest);
WriteTest.type$ = p.at$('WriteTest','xml::XmlTest',[],{'sys::Js':""},8192,WriteTest);
ParserErrTest.type$ = p.at$('ParserErrTest','xml::XmlTest',[],{'sys::Js':""},8192,ParserErrTest);
ParserTest.type$ = p.at$('ParserTest','xml::XmlTest',[],{'sys::Js':""},8192,ParserTest);
XErr.type$.af$('line',73730,'sys::Int',{}).af$('col',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('message','sys::Str?',true),new sys.Param('line','sys::Int',true),new sys.Param('col','sys::Int',true),new sys.Param('cause','sys::Err?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{});
XParser.type$.af$('doc',73728,'xml::XDoc',{}).af$('nodeType',73728,'xml::XNodeType?',{}).af$('depth',73728,'sys::Int',{}).af$('line',73728,'sys::Int',{}).af$('col',73728,'sys::Int',{}).af$('nameMap',100354,'sys::Bool[]',{}).af$('spaceMap',100354,'sys::Bool[]',{}).af$('unresolvedNs',100354,'sys::Uri',{}).af$('in',67584,'sys::InStream',{}).af$('pushback',67584,'sys::Int',{}).af$('pushback2',67584,'sys::Int',{}).af$('stack',67584,'xml::XElem[]',{}).af$('nsStack',67584,'xml::XNsDefs[]',{}).af$('defaultNs',67584,'xml::XNs?',{}).af$('curPi',67584,'xml::XPi?',{}).af$('buf',67584,'sys::StrBuf',{}).af$('entityBuf',67584,'sys::StrBuf',{}).af$('cdata',67584,'sys::Bool',{}).af$('name',67584,'sys::Str?',{}).af$('prefix',67584,'sys::Str?',{}).af$('popStack',67584,'sys::Bool',{}).af$('emptyElem',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('parseDoc',8192,'xml::XDoc',sys.List.make(sys.Param.type$,[new sys.Param('close','sys::Bool',true)]),{}).am$('parseElem',8192,'xml::XElem',sys.List.make(sys.Param.type$,[new sys.Param('close','sys::Bool',true)]),{}).am$('next',8192,'xml::XNodeType?',xp,{}).am$('skip',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('toDepth','sys::Int',true)]),{}).am$('elem',8192,'xml::XElem?',xp,{}).am$('elemAt',8192,'xml::XElem',sys.List.make(sys.Param.type$,[new sys.Param('depth','sys::Int',false)]),{}).am$('text',8192,'xml::XText?',xp,{}).am$('pi',8192,'xml::XPi?',xp,{}).am$('close',8192,'sys::Bool',xp,{}).am$('sniffEncoding',2048,'sys::Void',xp,{}).am$('parseProlog',2048,'sys::Void',xp,{}).am$('parseDocType',2048,'sys::Void',xp,{}).am$('parseElemStart',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('parseElemEnd',2048,'sys::Void',xp,{}).am$('parseAttr',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false),new sys.Param('elem','xml::XElem',false)]),{}).am$('parseQName',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('parseQuotedStr',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('quote','sys::Int',false)]),{}).am$('parseName',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false),new sys.Param('includeColon','sys::Bool',false)]),{}).am$('parseCDATA',2048,'sys::Void',xp,{}).am$('parseText',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('parsePi',2048,'sys::Void',xp,{}).am$('skipSpace',2048,'sys::Bool',xp,{}).am$('skipComment',2048,'sys::Void',xp,{}).am$('consume',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('read',2048,'sys::Int',xp,{}).am$('toCharData',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('toNum',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Int',false),new sys.Param('c','sys::Int',false),new sys.Param('base','sys::Int',false)]),{}).am$('bufToStr',2048,'sys::Str',xp,{}).am$('prefixToNs',2048,'xml::XNs',sys.List.make(sys.Param.type$,[new sys.Param('prefix','sys::Str',false),new sys.Param('line','sys::Int',false),new sys.Param('col','sys::Int',false),new sys.Param('checked','sys::Bool',false)]),{}).am$('pushNs',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prefix','sys::Str',false),new sys.Param('val','sys::Str',false),new sys.Param('line','sys::Int',false),new sys.Param('col','sys::Int',false)]),{}).am$('reEvalDefaultNs',2048,'sys::Void',xp,{}).am$('push',2048,'xml::XElem',xp,{}).am$('pop',2048,'sys::Void',xp,{}).am$('err',2048,'xml::XErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('line','sys::Int',true),new sys.Param('col','sys::Int',true)]),{}).am$('eosErr',2048,'xml::XErr',xp,{}).am$('isName',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('isSpace',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
XNsDefs.type$.af$('list',73728,'xml::XNs[]',{}).am$('find',8192,'xml::XNs?',sys.List.make(sys.Param.type$,[new sys.Param('prefix','sys::Str',false)]),{}).am$('isEmpty',8192,'sys::Bool',xp,{}).am$('clear',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
XAttr.type$.af$('name',73730,'sys::Str',{}).af$('ns',73730,'xml::XNs?',{}).af$('val',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Str',false),new sys.Param('ns','xml::XNs?',true)]),{}).am$('makeNs',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xml::XNs',false)]),{}).am$('prefix',8192,'sys::Str?',xp,{}).am$('uri',8192,'sys::Uri?',xp,{}).am$('qname',8192,'sys::Str',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('write',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{});
XNode.type$.af$('parent',73728,'xml::XNode?',{}).am$('nodeType',270337,'xml::XNodeType',xp,{}).am$('doc',8192,'xml::XDoc?',xp,{}).am$('writeToStr',8192,'sys::Str',xp,{}).am$('write',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('make',139268,'sys::Void',xp,{});
XNodeType.type$.af$('doc',106506,'xml::XNodeType',{}).af$('elem',106506,'xml::XNodeType',{}).af$('text',106506,'xml::XNodeType',{}).af$('pi',106506,'xml::XNodeType',{}).af$('elemStart',106506,'xml::XNodeType',{}).af$('elemEnd',106506,'xml::XNodeType',{}).af$('vals',106498,'xml::XNodeType[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'xml::XNodeType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
XText.type$.af$('val',73728,'sys::Str',{}).af$('cdata',73728,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{}).am$('nodeType',271360,'xml::XNodeType',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('copy',8192,'sys::This',xp,{}).am$('write',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{});
XElem.type$.af$('name',73728,'sys::Str',{}).af$('ns',73728,'xml::XNs?',{}).af$('line',73728,'sys::Int',{}).af$('noElems',98434,'xml::XElem[]',{}).af$('noNodes',98434,'xml::XNode[]',{}).af$('noAttrs',98434,'xml::XAttr[]',{}).af$('attrList',65664,'xml::XAttr[]',{}).af$('childList',65664,'xml::XNode[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('ns','xml::XNs?',true)]),{}).am$('nodeType',271360,'xml::XNodeType',xp,{}).am$('prefix',8192,'sys::Str?',xp,{}).am$('uri',8192,'sys::Uri?',xp,{}).am$('qname',8192,'sys::Str',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('attrs',8192,'xml::XAttr[]',xp,{}).am$('eachAttr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xml::XAttr,sys::Int->sys::Void|',false)]),{}).am$('attr',8192,'xml::XAttr?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('get',8192,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'sys::Operator':""}).am$('addAttr',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Str',false),new sys.Param('ns','xml::XNs?',true)]),{}).am$('removeAttr',8192,'xml::XAttr?',sys.List.make(sys.Param.type$,[new sys.Param('attr','xml::XAttr',false)]),{}).am$('removeAttrAt',8192,'xml::XAttr',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('clearAttrs',8192,'sys::This',xp,{}).am$('children',8192,'xml::XNode[]',xp,{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xml::XNode,sys::Int->sys::Void|',false)]),{}).am$('add',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('child','sys::Obj',false)]),{'sys::Operator':""}).am$('remove',8192,'xml::XNode?',sys.List.make(sys.Param.type$,[new sys.Param('child','xml::XNode',false)]),{}).am$('removeAt',8192,'xml::XNode',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('elems',8192,'xml::XElem[]',xp,{}).am$('elem',8192,'xml::XElem?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('text',8192,'xml::XText?',xp,{}).am$('copy',8192,'sys::This',xp,{}).am$('write',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('doWrite',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('indent','sys::Int',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
XDocType.type$.af$('rootElem',73728,'sys::Str',{}).af$('publicId',73728,'sys::Str?',{}).af$('systemId',73728,'sys::Uri?',{}).am$('toStr',271360,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
XIncompleteErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('message','sys::Str?',true),new sys.Param('line','sys::Int',true),new sys.Param('col','sys::Int',true),new sys.Param('cause','sys::Err?',true)]),{});
XPi.type$.af$('target',73728,'sys::Str',{}).af$('val',73728,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('target','sys::Str',false),new sys.Param('val','sys::Str',false)]),{}).am$('nodeType',271360,'xml::XNodeType',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('write',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{});
XDoc.type$.af$('docType',73728,'xml::XDocType?',{}).af$('root',73728,'xml::XElem',{}).af$('noPis',98434,'xml::XPi[]',{}).af$('piList',65664,'xml::XPi[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('root','xml::XElem?',true)]),{}).am$('nodeType',271360,'xml::XNodeType',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('pis',8192,'xml::XNode[]',xp,{}).am$('add',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('child','sys::Obj',false)]),{'sys::Operator':""}).am$('removePi',8192,'xml::XPi?',sys.List.make(sys.Param.type$,[new sys.Param('pi','xml::XPi',false)]),{}).am$('write',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
XNs.type$.af$('prefix',73730,'sys::Str',{}).af$('uri',73730,'sys::Uri',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prefix','sys::Str',false),new sys.Param('uri','sys::Uri',false)]),{}).am$('isDefault',8192,'sys::Bool',xp,{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
XmlTest.type$.am$('verifyNode',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','xml::XNode',false),new sys.Param('b','xml::XNode',false)]),{}).am$('verifyDoc',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','xml::XDoc',false),new sys.Param('b','xml::XDoc',false)]),{}).am$('verifyElem',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','xml::XElem?',false),new sys.Param('b','xml::XElem?',false)]),{}).am$('verifyAttr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','xml::XAttr',false),new sys.Param('b','xml::XAttr',false)]),{}).am$('verifyText',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','xml::XText',false),new sys.Param('b','xml::XText',false)]),{}).am$('verifyPi',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','xml::XPi',false),new sys.Param('b','xml::XPi',false)]),{}).am$('verifyPis',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','xml::XPi[]',false),new sys.Param('b','xml::XPi[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DomTest.type$.am$('testAttrs',8192,'sys::Void',xp,{}).am$('testChildren',8192,'sys::Void',xp,{}).am$('testDoc',8192,'sys::Void',xp,{}).am$('testNsIdentity',8192,'sys::Void',xp,{}).am$('testNsElem',8192,'sys::Void',xp,{}).am$('testNsAttr',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
PullTest.type$.af$('start',106498,'xml::XNodeType',{}).af$('end',106498,'xml::XNodeType',{}).af$('text',106498,'xml::XNodeType',{}).af$('pi',106498,'xml::XNodeType',{}).af$('empty',106498,'xml::XElem[]',{}).af$('parser',73728,'xml::XParser?',{}).am$('testElems',8192,'sys::Void',xp,{}).am$('testAttrs',8192,'sys::Void',xp,{}).am$('testMixed',8192,'sys::Void',xp,{}).am$('testPi',8192,'sys::Void',xp,{}).am$('testDoc',8192,'sys::Void',xp,{}).am$('testNs',8192,'sys::Void',xp,{}).am$('testSkipAndMem',8192,'sys::Void',xp,{}).am$('verifyNext',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('t','xml::XNodeType?',false),new sys.Param('depth','sys::Int',false),new sys.Param('stack','xml::XElem[]',false),new sys.Param('cur','xml::XNode?',true)]),{}).am$('dump',8192,'sys::Void',xp,{}).am$('init',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
WriteTest.type$.am$('testWrites',8192,'sys::Void',xp,{}).am$('testDoc',8192,'sys::Void',xp,{}).am$('testEsc',8192,'sys::Void',xp,{}).am$('testCdata',8192,'sys::Void',xp,{}).am$('testNs',8192,'sys::Void',xp,{}).am$('verifyWrite',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('xml','xml::XNode',false),new sys.Param('expected','sys::Str',false),new sys.Param('testRoundtrip','sys::Bool',true)]),{}).am$('make',139268,'sys::Void',xp,{});
ParserErrTest.type$.am$('testBadStarts',8192,'sys::Void',xp,{}).am$('testElems',8192,'sys::Void',xp,{}).am$('testAttrs',8192,'sys::Void',xp,{}).am$('testNs',8192,'sys::Void',xp,{}).am$('verifyXErr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('xml','sys::Str',false),new sys.Param('line','sys::Int',false),new sys.Param('col','sys::Int',false)]),{}).am$('verifyXIncompleteErr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('xml','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ParserTest.type$.am$('testDocType',8192,'sys::Void',xp,{}).am$('testElem',8192,'sys::Void',xp,{}).am$('testAttr',8192,'sys::Void',xp,{}).am$('testMixed',8192,'sys::Void',xp,{}).am$('testCdata',8192,'sys::Void',xp,{}).am$('testPi',8192,'sys::Void',xp,{}).am$('testNs',8192,'sys::Void',xp,{}).am$('testNestedDefaultNs',8192,'sys::Void',xp,{}).am$('testNsAttr',8192,'sys::Void',xp,{}).am$('testXmlAttr',8192,'sys::Void',xp,{}).am$('verifyParse',8192,'xml::XDoc',sys.List.make(sys.Param.type$,[new sys.Param('xml','sys::Str',false),new sys.Param('expected','xml::XDoc',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "xml");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0");
m.set("pod.summary", "XML Parser and Document Modeling");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:22-05:00 New_York");
m.set("build.tsKey", "241210143122");
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
  XErr,
  XParser,
  XAttr,
  XNode,
  XNodeType,
  XText,
  XElem,
  XDocType,
  XIncompleteErr,
  XPi,
  XDoc,
  XNs,
  XmlTest,
  DomTest,
  PullTest,
  WriteTest,
  ParserErrTest,
  ParserTest,
};
