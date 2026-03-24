// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class FandocErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FandocErr.type$; }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #line = 0;

  line() { return this.#line; }

  __line(it) { if (it === undefined) return this.#line; else this.#line = it; }

  static make(msg,file,line,cause) {
    const $self = new FandocErr();
    FandocErr.make$($self,msg,file,line,cause);
    return $self;
  }

  static make$($self,msg,file,line,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    $self.#file = file;
    $self.#line = line;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.msg()), " ["), this.#file), ":"), sys.ObjUtil.coerce(this.#line, sys.Obj.type$.toNullable())), "]");
  }

}

class DocWriter {
  constructor() {
    const this$ = this;
  }

  typeof() { return DocWriter.type$; }

}

class FandocDocWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#onLink = null;
    this.#onImage = null;
    this.#listIndexes = sys.List.make(ListIndex.type$);
    return;
  }

  typeof() { return FandocDocWriter.type$; }

  #onLink = null;

  onLink(it) {
    if (it === undefined) {
      return this.#onLink;
    }
    else {
      this.#onLink = it;
      return;
    }
  }

  #onImage = null;

  onImage(it) {
    if (it === undefined) {
      return this.#onImage;
    }
    else {
      this.#onImage = it;
      return;
    }
  }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  #listIndexes = null;

  // private field reflection only
  __listIndexes(it) { if (it === undefined) return this.#listIndexes; else this.#listIndexes = it; }

  #inBlockquote = false;

  // private field reflection only
  __inBlockquote(it) { if (it === undefined) return this.#inBlockquote; else this.#inBlockquote = it; }

  #inPre = false;

  // private field reflection only
  __inPre(it) { if (it === undefined) return this.#inPre; else this.#inPre = it; }

  #inListItem = false;

  // private field reflection only
  __inListItem(it) { if (it === undefined) return this.#inListItem; else this.#inListItem = it; }

  static make(out) {
    const $self = new FandocDocWriter();
    FandocDocWriter.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    ;
    $self.#out = out;
    return;
  }

  docStart(doc) {
    const this$ = this;
    if (doc.meta().isEmpty()) {
      this.#out.printLine();
      return;
    }
    ;
    this.#out.printLine(sys.Str.padl(sys.Str.defVal(), 72, 42));
    doc.meta().each((v,k) => {
      this$.#out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("** ", k), ": "), v));
      return;
    });
    this.#out.printLine(sys.Str.padl(sys.Str.defVal(), 72, 42));
    this.#out.printLine();
    return;
  }

  docEnd(doc) {
    return;
  }

  elemStart(elem) {
    let $_u0 = elem.id();
    if (sys.ObjUtil.equals($_u0, DocNodeId.emphasis())) {
      this.#out.writeChar(42);
    }
    else if (sys.ObjUtil.equals($_u0, DocNodeId.strong())) {
      this.#out.print("**");
    }
    else if (sys.ObjUtil.equals($_u0, DocNodeId.code())) {
      this.#out.writeChar(39);
    }
    else if (sys.ObjUtil.equals($_u0, DocNodeId.link())) {
      let link = sys.ObjUtil.coerce(elem, Link.type$);
      ((this$) => { let $_u1 = this$.#onLink; if ($_u1 == null) return null; return sys.Func.call(this$.#onLink, link); })(this);
      this.#out.writeChar(91);
    }
    else if (sys.ObjUtil.equals($_u0, DocNodeId.image())) {
      let img = sys.ObjUtil.coerce(elem, Image.type$);
      ((this$) => { let $_u2 = this$.#onImage; if ($_u2 == null) return null; return sys.Func.call(this$.#onImage, img); })(this);
      this.#out.print(sys.Str.plus("![", img.alt()));
      if (img.size() != null) {
        this.#out.print(sys.Str.plus("][", img.size()));
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u0, DocNodeId.para())) {
      let para = sys.ObjUtil.coerce(elem, Para.type$);
      if (!this.#listIndexes.isEmpty()) {
        let indent = sys.Int.mult(this.#listIndexes.size(), 2);
        this.#out.printLine();
        this.#out.printLine();
        this.#out.print(sys.Str.padl(sys.Str.defVal(), indent));
      }
      ;
      if (this.#inBlockquote) {
        this.#out.print("> ");
      }
      ;
      if (para.admonition() != null) {
        this.#out.print(sys.Str.plus(sys.Str.plus("", para.admonition()), ": "));
      }
      ;
      if (para.anchorId() != null) {
        this.#out.print(sys.Str.plus(sys.Str.plus("[#", para.anchorId()), "]"));
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u0, DocNodeId.pre())) {
      this.#inPre = true;
    }
    else if (sys.ObjUtil.equals($_u0, DocNodeId.blockQuote())) {
      this.#inBlockquote = true;
    }
    else if (sys.ObjUtil.equals($_u0, DocNodeId.unorderedList())) {
      this.#listIndexes.push(ListIndex.make());
      if (sys.ObjUtil.compareGT(this.#listIndexes.size(), 1)) {
        this.#out.printLine();
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u0, DocNodeId.orderedList())) {
      let ol = sys.ObjUtil.coerce(elem, OrderedList.type$);
      this.#listIndexes.push(ListIndex.make(ol.style()));
      if (sys.ObjUtil.compareGT(this.#listIndexes.size(), 1)) {
        this.#out.printLine();
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u0, DocNodeId.listItem())) {
      let indent = sys.Int.mult(sys.Int.minus(this.#listIndexes.size(), 1), 2);
      this.#out.print(sys.Str.padl(sys.Str.defVal(), indent));
      this.#out.print(this.#listIndexes.peek());
      this.#listIndexes.peek().increment();
      this.#inListItem = true;
    }
    else if (sys.ObjUtil.equals($_u0, DocNodeId.hr())) {
      this.#out.print("---\n\n");
    }
    ;
    return;
  }

  elemEnd(elem) {
    let $_u3 = elem.id();
    if (sys.ObjUtil.equals($_u3, DocNodeId.emphasis())) {
      this.#out.writeChar(42);
    }
    else if (sys.ObjUtil.equals($_u3, DocNodeId.strong())) {
      this.#out.print("**");
    }
    else if (sys.ObjUtil.equals($_u3, DocNodeId.code())) {
      this.#out.writeChar(39);
    }
    else if (sys.ObjUtil.equals($_u3, DocNodeId.link())) {
      let link = sys.ObjUtil.coerce(elem, Link.type$);
      this.#out.print(sys.Str.plus(sys.Str.plus("]`", link.uri()), "`"));
    }
    else if (sys.ObjUtil.equals($_u3, DocNodeId.image())) {
      let img = sys.ObjUtil.coerce(elem, Image.type$);
      this.#out.print(sys.Str.plus(sys.Str.plus("]`", img.uri()), "`"));
    }
    else if (sys.ObjUtil.equals($_u3, DocNodeId.para())) {
      this.#out.printLine();
      this.#out.printLine();
    }
    else if (sys.ObjUtil.equals($_u3, DocNodeId.heading())) {
      let head = sys.ObjUtil.coerce(elem, Heading.type$);
      let size = sys.Str.size(head.title());
      if (head.anchorId() != null) {
        this.#out.print(sys.Str.plus(sys.Str.plus(" [#", head.anchorId()), "]"));
        size = sys.Int.plus(size, sys.Int.plus(sys.Str.size(head.anchorId()), 4));
      }
      ;
      let char = sys.Str.chars("#*=-").get(sys.Int.minus(head.level(), 1));
      let line = sys.Str.padl(sys.Str.defVal(), sys.Int.max(size, 3), char);
      this.#out.printLine().printLine(line);
    }
    else if (sys.ObjUtil.equals($_u3, DocNodeId.pre())) {
      this.#inPre = false;
    }
    else if (sys.ObjUtil.equals($_u3, DocNodeId.blockQuote())) {
      this.#inBlockquote = false;
    }
    else if (sys.ObjUtil.equals($_u3, DocNodeId.unorderedList())) {
      this.#listIndexes.pop();
      if (this.#listIndexes.isEmpty()) {
        this.#out.printLine();
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u3, DocNodeId.orderedList())) {
      this.#listIndexes.pop();
      if (this.#listIndexes.isEmpty()) {
        this.#out.printLine();
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u3, DocNodeId.listItem())) {
      let item = sys.ObjUtil.coerce(elem, ListItem.type$);
      this.#out.printLine();
      this.#inListItem = false;
    }
    ;
    return;
  }

  text(text) {
    const this$ = this;
    if (this.#inPre) {
      let endsWithLineBreak = sys.Str.endsWith(text.str(), "\n");
      if ((!this.#listIndexes.isEmpty() || !endsWithLineBreak)) {
        if (!this.#listIndexes.isEmpty()) {
          this.#out.printLine();
        }
        ;
        let indentNo = sys.Int.mult(sys.Int.plus(this.#listIndexes.size(), 1), 2);
        let indent = sys.Str.padl(sys.Str.defVal(), indentNo);
        sys.Str.splitLines(text.str()).each((it) => {
          this$.#out.print(indent).printLine(it);
          return;
        });
      }
      else {
        this.#out.printLine("pre>");
        this.#out.print(text.str());
        this.#out.printLine("<pre");
      }
      ;
      this.#out.printLine();
    }
    else {
      this.#out.print(text.str());
    }
    ;
    return;
  }

}

class ListIndex extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#index = 1;
    return;
  }

  typeof() { return ListIndex.type$; }

  static #romans = undefined;

  static romans() {
    if (ListIndex.#romans === undefined) {
      ListIndex.static$init();
      if (ListIndex.#romans === undefined) ListIndex.#romans = null;
    }
    return ListIndex.#romans;
  }

  #style = null;

  style(it) {
    if (it === undefined) {
      return this.#style;
    }
    else {
      this.#style = it;
      return;
    }
  }

  #index = 0;

  index(it) {
    if (it === undefined) {
      return this.#index;
    }
    else {
      this.#index = it;
      return;
    }
  }

  static make(style) {
    const $self = new ListIndex();
    ListIndex.make$($self,style);
    return $self;
  }

  static make$($self,style) {
    if (style === undefined) style = null;
    ;
    $self.#style = style;
    return;
  }

  increment() {
    ((this$) => { let $_u4 = this$.#index;this$.#index = sys.Int.increment(this$.#index); return $_u4; })(this);
    return this;
  }

  toStr() {
    let $_u5 = this.#style;
    if (sys.ObjUtil.equals($_u5, null)) {
      return "- ";
    }
    else if (sys.ObjUtil.equals($_u5, OrderedListStyle.number())) {
      return sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this.#index, sys.Obj.type$.toNullable())), ". ");
    }
    else if (sys.ObjUtil.equals($_u5, OrderedListStyle.lowerAlpha())) {
      return sys.Str.plus(sys.Str.plus("", sys.Str.lower(ListIndex.toB26(this.#index))), ". ");
    }
    else if (sys.ObjUtil.equals($_u5, OrderedListStyle.upperAlpha())) {
      return sys.Str.plus(sys.Str.plus("", sys.Str.upper(ListIndex.toB26(this.#index))), ". ");
    }
    else if (sys.ObjUtil.equals($_u5, OrderedListStyle.lowerRoman())) {
      return sys.Str.plus(sys.Str.plus("", sys.Str.lower(ListIndex.toRoman(this.#index))), ". ");
    }
    else if (sys.ObjUtil.equals($_u5, OrderedListStyle.upperRoman())) {
      return sys.Str.plus(sys.Str.plus("", sys.Str.upper(ListIndex.toRoman(this.#index))), ". ");
    }
    ;
    throw sys.Err.make(sys.Str.plus("Unsupported List Style: ", this.#style));
  }

  static toB26(int) {
    ((this$) => { let $_u6 = int;int = sys.Int.decrement(int); return $_u6; })(this);
    let dig = sys.Int.toChar(sys.Int.plus(65, sys.Int.mod(int, 26)));
    return ((this$) => { if (sys.ObjUtil.compareGE(int, 26)) return sys.Str.plus(ListIndex.toB26(sys.Int.div(int, 26)), dig); return dig; })(this);
  }

  static toRoman(int) {
    const this$ = this;
    let l = ListIndex.romans().keys().find((it) => {
      return sys.ObjUtil.compareLE(it, int);
    });
    return sys.ObjUtil.coerce(((this$) => { if (sys.ObjUtil.compareGT(int, l)) return sys.Str.plus(ListIndex.romans().get(sys.ObjUtil.coerce(sys.ObjUtil.coerce(l, sys.Int.type$), sys.Obj.type$.toNullable())), ListIndex.toRoman(sys.Int.minus(int, sys.ObjUtil.coerce(l, sys.Int.type$)))); return ListIndex.romans().get(sys.ObjUtil.coerce(sys.ObjUtil.coerce(l, sys.Int.type$), sys.Obj.type$.toNullable())); })(this), sys.Str.type$);
  }

  static sortr(unordered) {
    const this$ = this;
    let sorted = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Obj:sys::Obj?]"));
    unordered.keys().sortr().each((it) => {
      sorted.set(sys.ObjUtil.coerce(it, sys.Obj.type$), unordered.get(sys.ObjUtil.coerce(it, sys.Obj.type$.toNullable())));
      return;
    });
    return sys.ObjUtil.coerce(sorted, sys.Type.find("[sys::Int:sys::Str]"));
  }

  static static$init() {
    ListIndex.#romans = sys.ObjUtil.coerce(((this$) => { let $_u9 = ListIndex.sortr(sys.Map.__fromLiteral([sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(900, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(500, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(100, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(90, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(50, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(40, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(9, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())], ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"], sys.Type.find("sys::Int"), sys.Type.find("sys::Str"))); if ($_u9 == null) return null; return sys.ObjUtil.toImmutable(ListIndex.sortr(sys.Map.__fromLiteral([sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(900, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(500, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(100, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(90, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(50, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(40, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(9, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())], ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"], sys.Type.find("sys::Int"), sys.Type.find("sys::Str")))); })(this), sys.Type.find("[sys::Int:sys::Str]"));
    return;
  }

}

class InlineParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InlineParser.type$; }

  #parent = null;

  // private field reflection only
  __parent(it) { if (it === undefined) return this.#parent; else this.#parent = it; }

  #src = null;

  // private field reflection only
  __src(it) { if (it === undefined) return this.#src; else this.#src = it; }

  #line = 0;

  // private field reflection only
  __line(it) { if (it === undefined) return this.#line; else this.#line = it; }

  #pos = 0;

  // private field reflection only
  __pos(it) { if (it === undefined) return this.#pos; else this.#pos = it; }

  #last = 0;

  // private field reflection only
  __last(it) { if (it === undefined) return this.#last; else this.#last = it; }

  #cur = 0;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #peek = 0;

  // private field reflection only
  __peek(it) { if (it === undefined) return this.#peek; else this.#peek = it; }

  #stack = null;

  // private field reflection only
  __stack(it) { if (it === undefined) return this.#stack; else this.#stack = it; }

  static make(parent,src,startLine) {
    const $self = new InlineParser();
    InlineParser.make$($self,parent,src,startLine);
    return $self;
  }

  static make$($self,parent,src,startLine) {
    $self.#parent = parent;
    $self.#src = src;
    $self.#stack = sys.List.make(DocNode.type$);
    $self.#line = startLine;
    $self.#last = 32;
    $self.#cur = ((this$) => { let $_u10 = -1; this$.#peek = $_u10; return $_u10; })($self);
    if (sys.ObjUtil.compareGT(src.size(), 0)) {
      $self.#cur = src.get(0);
    }
    ;
    if (sys.ObjUtil.compareGT(src.size(), 1)) {
      $self.#peek = src.get(1);
    }
    ;
    if (sys.ObjUtil.equals($self.#cur, 10)) {
      $self.#line = sys.Int.increment($self.#line);
      $self.#cur = 32;
    }
    ;
    if (sys.ObjUtil.equals($self.#peek, 10)) {
      $self.#line = sys.Int.increment($self.#line);
      $self.#peek = 32;
    }
    ;
    $self.#pos = 0;
    return;
  }

  parse(parent) {
    while (sys.ObjUtil.compareGT(this.#cur, 0)) {
      this.segment(parent);
    }
    ;
    return;
  }

  segment(parent) {
    this.#stack.push(parent);
    let child = null;
    if ((sys.Int.isSpace(this.#last) || sys.ObjUtil.equals(this.#last, 42) || sys.ObjUtil.equals(this.#last, 47) || sys.ObjUtil.equals(this.#last, 40))) {
      let $_u11 = this.#cur;
      if (sys.ObjUtil.equals($_u11, 39)) {
        (child = this.code());
      }
      else if (sys.ObjUtil.equals($_u11, 96)) {
        (child = this.link());
      }
      else if (sys.ObjUtil.equals($_u11, 91)) {
        (child = this.annotation(parent));
      }
      else if (sys.ObjUtil.equals($_u11, 42)) {
        (child = ((this$) => { if (sys.ObjUtil.equals(this$.#peek, 42)) return this$.strong(); return this$.emphasis(); })(this));
      }
      else if (sys.ObjUtil.equals($_u11, 33)) {
        (child = ((this$) => { if (sys.ObjUtil.equals(this$.#peek, 91)) return this$.image(); return this$.text(); })(this));
      }
      else {
        (child = this.text());
      }
      ;
    }
    else {
      (child = this.text());
    }
    ;
    if (child != null) {
      parent.add(sys.ObjUtil.coerce(child, DocNode.type$));
    }
    ;
    this.#stack.pop();
    return;
  }

  isTextEnd() {
    let $_u14 = this.#cur;
    if (sys.ObjUtil.equals($_u14, 39) || sys.ObjUtil.equals($_u14, 96) || sys.ObjUtil.equals($_u14, 91)) {
      return (sys.Int.isSpace(this.#last) || sys.ObjUtil.equals(this.#last, 40));
    }
    else if (sys.ObjUtil.equals($_u14, 33)) {
      return (sys.ObjUtil.equals(this.#peek, 91) && sys.Int.isSpace(this.#last));
    }
    else if (sys.ObjUtil.equals($_u14, 42)) {
      if (sys.ObjUtil.equals(this.#stack.peek().id(), DocNodeId.strong())) {
        return (sys.ObjUtil.equals(this.#peek, 42) || sys.Int.isSpace(this.#last));
      }
      else {
        if (sys.ObjUtil.equals(this.#stack.peek().id(), DocNodeId.emphasis())) {
          return true;
        }
        else {
          return sys.Int.isSpace(this.#last);
        }
        ;
      }
      ;
    }
    else {
      return false;
    }
    ;
  }

  text() {
    let buf = sys.StrBuf.make();
    buf.addChar(this.#cur);
    this.consume();
    while ((sys.ObjUtil.compareGT(this.#cur, 0) && !this.isTextEnd())) {
      buf.addChar(this.#cur);
      this.consume();
    }
    ;
    return DocText.make(buf.toStr());
  }

  code() {
    let buf = sys.StrBuf.make();
    this.consume();
    while (sys.ObjUtil.compareNE(this.#cur, 39)) {
      if (sys.ObjUtil.compareLE(this.#cur, 0)) {
        throw this.err("Invalid code");
      }
      ;
      buf.addChar(this.#cur);
      this.consume();
    }
    ;
    this.consume();
    let code = Code.make();
    code.add(DocText.make(buf.toStr()));
    return code;
  }

  emphasis() {
    if ((sys.ObjUtil.compareLE(this.#peek, 0) || (sys.Int.isSpace(this.#peek) && sys.ObjUtil.compareNE(this.peekPeek(), 42)))) {
      return this.text();
    }
    ;
    let em = Emphasis.make();
    this.consume();
    while ((sys.ObjUtil.compareNE(this.#cur, 42) || sys.ObjUtil.equals(this.#peek, 42))) {
      if (sys.ObjUtil.compareLE(this.#cur, 0)) {
        throw this.err("Invalid *emphasis*");
      }
      ;
      this.segment(em);
    }
    ;
    this.consume();
    return em;
  }

  strong() {
    let strong = Strong.make();
    this.consume();
    this.consume();
    while ((sys.ObjUtil.compareNE(this.#cur, 42) || sys.ObjUtil.compareNE(this.#peek, 42))) {
      if (sys.ObjUtil.compareLE(this.#cur, 0)) {
        throw this.err("Invalid **strong**");
      }
      ;
      this.segment(strong);
    }
    ;
    this.consume();
    this.consume();
    return strong;
  }

  link() {
    let link = Link.make(this.uri());
    link.line(this.#line);
    link.add(DocText.make(link.uri()));
    return link;
  }

  annotation(parent) {
    if ((sys.ObjUtil.compareLE(this.#peek, 0) || sys.ObjUtil.equals(this.#peek, 93))) {
      return this.text();
    }
    ;
    let body = null;
    let anchor = null;
    if ((sys.ObjUtil.equals(this.#peek, 33) && sys.ObjUtil.equals(this.peekPeek(), 91))) {
      this.consume();
      (body = this.image());
      if (sys.ObjUtil.compareNE(this.#cur, 93)) {
        throw this.err("Invalid img link");
      }
      ;
      this.consume();
    }
    else {
      let s = this.brackets();
      if (sys.Str.startsWith(s, "#")) {
        parent.anchorId(sys.Str.getRange(s, sys.Range.make(1, -1)));
        return null;
      }
      ;
      (body = DocText.make(s));
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, 96)) {
      let link = Link.make(this.uri());
      link.add(sys.ObjUtil.coerce(body, DocNode.type$));
      return link;
    }
    else {
      throw this.err("Invalid annotation []");
    }
    ;
  }

  image() {
    this.consume();
    let alt = this.brackets();
    let size = null;
    if (sys.ObjUtil.equals(this.#cur, 91)) {
      (size = this.brackets());
    }
    ;
    let uri = this.uri();
    let img = Image.make(uri, alt);
    img.size(sys.ObjUtil.coerce(size, sys.Str.type$.toNullable()));
    img.line(this.#line);
    return img;
  }

  uri() {
    if (sys.ObjUtil.compareNE(this.#cur, 96)) {
      throw this.err("Invalid uri");
    }
    ;
    this.consume();
    let buf = sys.StrBuf.make();
    while (sys.ObjUtil.compareNE(this.#cur, 96)) {
      if (sys.ObjUtil.compareLE(this.#cur, 0)) {
        throw this.err("Invalid uri");
      }
      ;
      buf.addChar(this.#cur);
      this.consume();
    }
    ;
    this.consume();
    return buf.toStr();
  }

  brackets() {
    if (sys.ObjUtil.compareNE(this.#cur, 91)) {
      throw this.err("Invalid []");
    }
    ;
    this.consume();
    let buf = sys.StrBuf.make();
    while (sys.ObjUtil.compareNE(this.#cur, 93)) {
      if (sys.ObjUtil.compareLE(this.#cur, 0)) {
        throw this.err("Invalid []");
      }
      ;
      buf.addChar(this.#cur);
      this.consume();
    }
    ;
    this.consume();
    return buf.toStr();
  }

  err(msg) {
    return FandocErr.make(msg, this.#parent.filename(), this.#line);
  }

  consume() {
    this.#last = this.#cur;
    this.#cur = this.#peek;
    ((this$) => { let $_u15 = this$.#pos;this$.#pos = sys.Int.increment(this$.#pos); return $_u15; })(this);
    if (sys.ObjUtil.compareLT(sys.Int.plus(this.#pos, 1), this.#src.size())) {
      this.#peek = this.#src.get(sys.Int.plus(this.#pos, 1));
      if (sys.ObjUtil.equals(this.#peek, 10)) {
        this.#line = sys.Int.increment(this.#line);
        this.#peek = 32;
      }
      ;
    }
    else {
      this.#peek = -1;
    }
    ;
    return;
  }

  peekPeek() {
    if (sys.ObjUtil.compareLT(sys.Int.plus(this.#pos, 2), this.#src.size())) {
      return this.#src.get(sys.Int.plus(this.#pos, 2));
    }
    ;
    return -1;
  }

  debug() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("cur='", ((this$) => { if (sys.ObjUtil.compareLE(this$.#cur, 0)) return "eof"; return sys.Int.toChar(this$.#cur); })(this)), "' peek='"), ((this$) => { if (sys.ObjUtil.compareLE(this$.#peek, 0)) return "eof"; return sys.Int.toChar(this$.#peek); })(this)), "'");
  }

}

class FandocParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#silent = false;
    this.#errs = sys.List.make(FandocErr.type$);
    this.#parseHeader = true;
    this.#filename = "";
    return;
  }

  typeof() { return FandocParser.type$; }

  #silent = false;

  silent(it) {
    if (it === undefined) {
      return this.#silent;
    }
    else {
      this.#silent = it;
      return;
    }
  }

  #errs = null;

  errs(it) {
    if (it === undefined) {
      return this.#errs;
    }
    else {
      this.#errs = it;
      return;
    }
  }

  #parseHeader = false;

  parseHeader(it) {
    if (it === undefined) {
      return this.#parseHeader;
    }
    else {
      this.#parseHeader = it;
      return;
    }
  }

  #filename = null;

  filename(it) {
    if (it === undefined) {
      return this.#filename;
    }
    else {
      this.#filename = it;
      return;
    }
  }

  #lines = null;

  // private field reflection only
  __lines(it) { if (it === undefined) return this.#lines; else this.#lines = it; }

  #numLines = 0;

  // private field reflection only
  __numLines(it) { if (it === undefined) return this.#numLines; else this.#numLines = it; }

  #lineIndex = 0;

  // private field reflection only
  __lineIndex(it) { if (it === undefined) return this.#lineIndex; else this.#lineIndex = it; }

  #cur = null;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #peek = null;

  // private field reflection only
  __peek(it) { if (it === undefined) return this.#peek; else this.#peek = it; }

  #curt = null;

  // private field reflection only
  __curt(it) { if (it === undefined) return this.#curt; else this.#curt = it; }

  #peekt = null;

  // private field reflection only
  __peekt(it) { if (it === undefined) return this.#peekt; else this.#peekt = it; }

  #curLine = 0;

  // private field reflection only
  __curLine(it) { if (it === undefined) return this.#curLine; else this.#curLine = it; }

  #curIndent = 0;

  // private field reflection only
  __curIndent(it) { if (it === undefined) return this.#curIndent; else this.#curIndent = it; }

  #peekIndent = 0;

  // private field reflection only
  __peekIndent(it) { if (it === undefined) return this.#peekIndent; else this.#peekIndent = it; }

  #curStart = 0;

  // private field reflection only
  __curStart(it) { if (it === undefined) return this.#curStart; else this.#curStart = it; }

  #peekStart = 0;

  // private field reflection only
  __peekStart(it) { if (it === undefined) return this.#peekStart; else this.#peekStart = it; }

  parse(filename,in$,close) {
    if (close === undefined) close = true;
    this.#filename = filename;
    this.#errs = sys.List.make(FandocErr.type$);
    this.readLines(in$, close);
    let doc = Doc.make();
    try {
      this.header(doc);
      while (this.#curt !== LineType.eof()) {
        doc.add(this.topBlock());
      }
      ;
    }
    catch ($_u18) {
      $_u18 = sys.Err.make($_u18);
      if ($_u18 instanceof sys.Err) {
        let e = $_u18;
        ;
        this.err(sys.Str.plus("Invalid line ", sys.ObjUtil.coerce(this.#curLine, sys.Obj.type$.toNullable())), this.#curLine, e);
        sys.ObjUtil.coerce(doc.removeAll(), Doc.type$).add(sys.ObjUtil.coerce(Pre.make().add(DocText.make(this.#lines.join("\n"))), Pre.type$));
      }
      else {
        throw $_u18;
      }
    }
    ;
    this.#lines = null;
    return doc;
  }

  parseStr(plaintext) {
    return this.parse("str", sys.Str.in(plaintext), true);
  }

  header(doc) {
    this.skipBlankLines();
    if (!this.#parseHeader) {
      return;
    }
    ;
    while ((this.#curt !== LineType.eof() && sys.Str.startsWith(this.#cur, "**"))) {
      let colon = sys.Str.index(this.#cur, ":");
      if (colon != null) {
        let key = sys.Str.trim(sys.Str.getRange(this.#cur, sys.Range.make(2, sys.ObjUtil.coerce(colon, sys.Int.type$), true)));
        let val = sys.Str.trim(sys.Str.getRange(this.#cur, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1), -1)));
        doc.meta().set(key, val);
      }
      else {
        if (!sys.Str.startsWith(this.#cur, "****")) {
          break;
        }
        ;
      }
      ;
      this.consume();
    }
    ;
    this.skipBlankLines();
    return;
  }

  topBlock() {
    let $_u19 = this.#peekt;
    if (sys.ObjUtil.equals($_u19, LineType.h1()) || sys.ObjUtil.equals($_u19, LineType.h2()) || sys.ObjUtil.equals($_u19, LineType.h3()) || sys.ObjUtil.equals($_u19, LineType.h4())) {
      return this.heading();
    }
    ;
    return this.block(0);
  }

  heading() {
    let level = this.#peekt.headingLevel();
    let h = Heading.make(level);
    this.#curStart = 0;
    this.formattedText(h);
    this.consume();
    this.skipBlankLines();
    let title = sys.ObjUtil.as(h.children().first(), DocText.type$);
    if (title != null) {
      title.str(sys.Str.trim(title.str()));
    }
    ;
    return h;
  }

  block(indent) {
    let $_u20 = this.#curt;
    if (sys.ObjUtil.equals($_u20, LineType.ol())) {
      return this.ol();
    }
    else if (sys.ObjUtil.equals($_u20, LineType.ul())) {
      return this.ul();
    }
    else if (sys.ObjUtil.equals($_u20, LineType.blockquote())) {
      return this.blockquote();
    }
    else if (sys.ObjUtil.equals($_u20, LineType.preStart())) {
      return this.preExplicit();
    }
    else if (sys.ObjUtil.equals($_u20, LineType.hr())) {
      return this.hr();
    }
    else if (sys.ObjUtil.equals($_u20, LineType.normal())) {
      if (sys.ObjUtil.compareGE(this.#curIndent, sys.Int.plus(indent, 2))) {
        return this.pre();
      }
      else {
        return this.para();
      }
      ;
    }
    else {
      throw sys.Err.make(this.#curt.toStr());
    }
    ;
  }

  para() {
    const this$ = this;
    let para = Para.make();
    let first = sys.Str.split(sys.Str.trim(this.#cur)).first();
    if (sys.ObjUtil.equals(sys.Str.get(first, -1), 58)) {
      (first = sys.Str.getRange(first, sys.Range.make(0, -2)));
      if (sys.Str.all(first, (ch) => {
        return sys.Int.isUpper(ch);
      })) {
        para.admonition(first);
        this.#curStart = sys.Int.plus(sys.ObjUtil.coerce(sys.Str.index(this.#cur, ":"), sys.Int.type$), 1);
      }
      ;
    }
    ;
    return this.formattedText(para);
  }

  blockquote() {
    return sys.ObjUtil.coerce(BlockQuote.make().add(this.formattedText(Para.make())), BlockQuote.type$);
  }

  preExplicit() {
    const this$ = this;
    this.consume();
    while (this.#curt === LineType.blank()) {
      this.consume();
    }
    ;
    let lines = sys.List.make(sys.Str.type$);
    let indent = sys.Int.maxVal();
    while ((this.#curt !== LineType.preEnd() && this.#curt !== LineType.eof())) {
      if (sys.ObjUtil.compareNE(this.#curt, LineType.blank())) {
        let i = 0;
        while (sys.ObjUtil.equals(sys.Str.get(this.#cur, i), 32)) {
          ((this$) => { let $_u21 = i;i = sys.Int.increment(i); return $_u21; })(this);
        }
        ;
        (indent = sys.Int.min(indent, i));
      }
      ;
      lines.add(sys.ObjUtil.coerce(this.#cur, sys.Str.type$));
      this.consume();
    }
    ;
    this.consume();
    while (this.#curt === LineType.blank()) {
      this.consume();
    }
    ;
    let buf = sys.StrBuf.make();
    lines.each((line) => {
      if (sys.ObjUtil.compareGT(sys.Str.size(line), indent)) {
        buf.add(sys.Str.getRange(line, sys.Range.make(indent, -1)));
      }
      ;
      buf.addChar(10);
      return;
    });
    let pre = Pre.make();
    pre.add(DocText.make(buf.toStr()));
    return pre;
  }

  pre() {
    const this$ = this;
    let indent = this.#curIndent;
    let buf = sys.StrBuf.make(256);
    buf.add(sys.Str.getRange(this.#cur, sys.Range.make(indent, -1)));
    this.consume();
    while (true) {
      while ((this.#curt === LineType.normal() && sys.ObjUtil.compareGE(this.#curIndent, indent))) {
        buf.add("\n").add(sys.Str.getRange(this.#cur, sys.Range.make(indent, -1)));
        this.consume();
      }
      ;
      let blanks = 0;
      while (this.#curt === LineType.blank()) {
        this.consume();
        ((this$) => { let $_u22 = blanks;blanks = sys.Int.increment(blanks); return $_u22; })(this);
      }
      ;
      if ((this.#curt === LineType.normal() && sys.ObjUtil.compareGE(this.#curIndent, indent))) {
        sys.Int.times(blanks, (it) => {
          buf.add("\n");
          return;
        });
      }
      else {
        break;
      }
      ;
    }
    ;
    let pre = Pre.make();
    pre.add(DocText.make(buf.toStr()));
    return pre;
  }

  hr() {
    this.consume();
    this.skipBlankLines();
    return Hr.make();
  }

  ol() {
    let style = OrderedListStyle.fromFirstChar(sys.Str.get(sys.Str.trim(this.#cur), 0));
    return this.listItems(OrderedList.make(style), sys.ObjUtil.coerce(this.#curt, LineType.type$), this.#curIndent);
  }

  ul() {
    return this.listItems(UnorderedList.make(), sys.ObjUtil.coerce(this.#curt, LineType.type$), this.#curIndent);
  }

  listItems(list,listType,listIndent) {
    while (true) {
      if ((this.#curt === listType && sys.ObjUtil.equals(this.#curIndent, listIndent))) {
        list.add(this.formattedText(ListItem.make()));
      }
      else {
        if (sys.ObjUtil.compareGE(this.#curIndent, listIndent)) {
          sys.ObjUtil.coerce(list.children().last(), DocElem.type$).add(this.block(listIndent));
        }
        else {
          break;
        }
        ;
      }
      ;
    }
    ;
    return list;
  }

  formattedText(elem) {
    const this$ = this;
    let startLineNum = this.#curLine;
    let startIndent = this.#curStart;
    let isBlockQuote = this.#curt === LineType.blockquote();
    let buf = sys.StrBuf.make(256);
    buf.add(sys.Str.trim(sys.Str.getRange(this.#cur, sys.Range.make(this.#curStart, -1))));
    this.consume();
    while ((sys.ObjUtil.compareLE(this.#curStart, startIndent) && (this.#curt === LineType.normal() || (isBlockQuote && sys.ObjUtil.equals(this.#curt, LineType.blockquote()))))) {
      buf.add("\n").add(sys.Str.trim(sys.Str.getRange(this.#cur, sys.Range.make(this.#curStart, -1))));
      this.consume();
    }
    ;
    let endLineNum = sys.Int.minus(this.#lineIndex, 2);
    this.skipBlankLines();
    let oldNumChildren = elem.children().size();
    try {
      InlineParser.make(this, buf, startLineNum).parse(elem);
    }
    catch ($_u23) {
      $_u23 = sys.Err.make($_u23);
      if ($_u23 instanceof sys.Err) {
        let e = $_u23;
        ;
        if (sys.ObjUtil.is(e, FandocErr.type$)) {
          this.errReport(sys.ObjUtil.coerce(e, FandocErr.type$));
        }
        else {
          this.err(sys.Str.plus("Internal error: ", e), startLineNum, e);
        }
        ;
        elem.children().getRange(sys.Range.make(oldNumChildren, -1)).dup().each((badChild) => {
          elem.remove(badChild);
          return;
        });
        elem.add(DocText.make(sys.Str.replace(buf.toStr(), "\n", " ")));
      }
      else {
        throw $_u23;
      }
    }
    ;
    return elem;
  }

  readLines(in$,close) {
    try {
      this.#lines = in$.readAllLines();
      this.#numLines = this.#lines.size();
      this.#lineIndex = ((this$) => { let $_u24 = 0; this$.#curLine = $_u24; return $_u24; })(this);
      this.consume();
      this.consume();
      this.#curLine = 1;
    }
    finally {
      if (close) {
        in$.close();
      }
      ;
    }
    ;
    return;
  }

  err(msg,line,cause) {
    if (cause === undefined) cause = null;
    this.errReport(FandocErr.make(msg, this.#filename, line, cause));
    return;
  }

  errReport(err) {
    this.#errs.add(err);
    if (!this.#silent) {
      sys.ObjUtil.echo(sys.Str.plus("ERROR: ", err));
    }
    ;
    return;
  }

  skipBlankLines() {
    while (this.#curt === LineType.blank()) {
      this.consume();
    }
    ;
    return;
  }

  static isOrderedListMark(line,i) {
    const this$ = this;
    if (!sys.Int.isAlphaNum(sys.Str.get(line, i))) {
      return false;
    }
    ;
    let dot = sys.Str.index(line, ". ", i);
    if (dot == null) {
      return false;
    }
    ;
    let mark = sys.Str.getRange(line, sys.Range.make(i, sys.ObjUtil.coerce(dot, sys.Int.type$), true));
    if (sys.Int.isDigit(sys.Str.get(mark, 0))) {
      return sys.Str.all(mark, (ch) => {
        return sys.Int.isDigit(ch);
      });
    }
    else {
      return sys.Str.all(mark, (ch,index) => {
        let $_u25 = ch;
        if (sys.ObjUtil.equals($_u25, 73) || sys.ObjUtil.equals($_u25, 86) || sys.ObjUtil.equals($_u25, 88) || sys.ObjUtil.equals($_u25, 105) || sys.ObjUtil.equals($_u25, 118) || sys.ObjUtil.equals($_u25, 120)) {
          return true;
        }
        else {
          return sys.ObjUtil.equals(index, 0);
        }
        ;
      });
    }
    ;
  }

  consume() {
    this.#cur = this.#peek;
    this.#curt = this.#peekt;
    this.#curIndent = this.#peekIndent;
    this.#curStart = this.#peekStart;
    let curNotBlank = sys.ObjUtil.compareNE(this.#curt, LineType.blank());
    ((this$) => { let $_u26 = this$.#curLine;this$.#curLine = sys.Int.increment(this$.#curLine); return $_u26; })(this);
    this.#peek = ((this$) => { if (sys.ObjUtil.compareLT(this$.#lineIndex, this$.#numLines)) return this$.#lines.get(((this$) => { let $_u28 = this$.#lineIndex;this$.#lineIndex = sys.Int.increment(this$.#lineIndex); return $_u28; })(this$)); return null; })(this);
    this.#peekIndent = ((this$) => { let $_u29 = 0; this$.#peekStart = $_u29; return $_u29; })(this);
    if (this.#peek == null) {
      this.#peekt = LineType.eof();
    }
    else {
      if (sys.Str.isSpace(this.#peek)) {
        this.#peekt = LineType.blank();
      }
      else {
        if (sys.Str.startsWith(this.#peek, "pre>")) {
          this.#peekt = LineType.preStart();
        }
        else {
          if (sys.Str.startsWith(this.#peek, "<pre")) {
            this.#peekt = LineType.preEnd();
          }
          else {
            if ((sys.Str.startsWith(this.#peek, "###") && curNotBlank)) {
              this.#peekt = LineType.h1();
            }
            else {
              if ((sys.Str.startsWith(this.#peek, "***") && curNotBlank)) {
                this.#peekt = LineType.h2();
              }
              else {
                if ((sys.Str.startsWith(this.#peek, "===") && curNotBlank)) {
                  this.#peekt = LineType.h3();
                }
                else {
                  if ((sys.Str.startsWith(this.#peek, "---") && curNotBlank)) {
                    this.#peekt = LineType.h4();
                  }
                  else {
                    if ((sys.Str.startsWith(this.#peek, "---") && sys.ObjUtil.equals(this.#curt, LineType.blank()))) {
                      this.#peekt = LineType.hr();
                    }
                    else {
                      this.#peekt = LineType.normal();
                      while (sys.Int.isSpace(sys.Str.get(this.#peek, this.#peekIndent))) {
                        ((this$) => { let $_u30 = this$.#peekIndent;this$.#peekIndent = sys.Int.increment(this$.#peekIndent); return $_u30; })(this);
                      }
                      ;
                      if (sys.ObjUtil.compareLT(sys.Int.plus(this.#peekIndent, 2), sys.Str.size(this.#peek))) {
                        if ((sys.ObjUtil.equals(sys.Str.get(this.#peek, this.#peekIndent), 45) && sys.Int.isSpace(sys.Str.get(this.#peek, sys.Int.plus(this.#peekIndent, 1))))) {
                          this.#peekt = LineType.ul();
                          this.#peekIndent = sys.Int.plus(this.#peekIndent, 2);
                          this.#peekStart = this.#peekIndent;
                        }
                        ;
                        if (FandocParser.isOrderedListMark(sys.ObjUtil.coerce(this.#peek, sys.Str.type$), this.#peekIndent)) {
                          this.#peekt = LineType.ol();
                          this.#peekIndent = sys.Int.plus(this.#peekIndent, 2);
                          this.#peekStart = sys.Int.plus(sys.ObjUtil.coerce(sys.Str.index(this.#peek, "."), sys.Int.type$), 2);
                        }
                        else {
                          if ((sys.ObjUtil.equals(sys.Str.get(this.#peek, this.#peekIndent), 62) && sys.Int.isSpace(sys.Str.get(this.#peek, sys.Int.plus(this.#peekIndent, 1))))) {
                            this.#peekt = LineType.blockquote();
                            this.#peekIndent = sys.Int.plus(this.#peekIndent, 2);
                            this.#peekStart = this.#peekIndent;
                          }
                          else {
                            this.#peekStart = this.#peekIndent;
                          }
                          ;
                        }
                        ;
                      }
                      ;
                    }
                    ;
                  }
                  ;
                }
                ;
              }
              ;
            }
            ;
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  static main(args) {
    if (args === undefined) args = sys.Env.cur().args();
    let doc = FandocParser.make().parse(args.get(0), sys.File.make(sys.Str.toUri(args.get(0))).in());
    doc.dump();
    return;
  }

  static make() {
    const $self = new FandocParser();
    FandocParser.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class LineType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LineType.type$; }

  static eof() { return LineType.vals().get(0); }

  static blank() { return LineType.vals().get(1); }

  static ul() { return LineType.vals().get(2); }

  static ol() { return LineType.vals().get(3); }

  static h1() { return LineType.vals().get(4); }

  static h2() { return LineType.vals().get(5); }

  static h3() { return LineType.vals().get(6); }

  static h4() { return LineType.vals().get(7); }

  static blockquote() { return LineType.vals().get(8); }

  static preStart() { return LineType.vals().get(9); }

  static preEnd() { return LineType.vals().get(10); }

  static hr() { return LineType.vals().get(11); }

  static normal() { return LineType.vals().get(12); }

  static #vals = undefined;

  isList() {
    return this === LineType.ul();
  }

  headingLevel() {
    let $_u31 = this;
    if (sys.ObjUtil.equals($_u31, LineType.h1())) {
      return 1;
    }
    else if (sys.ObjUtil.equals($_u31, LineType.h2())) {
      return 2;
    }
    else if (sys.ObjUtil.equals($_u31, LineType.h3())) {
      return 3;
    }
    else if (sys.ObjUtil.equals($_u31, LineType.h4())) {
      return 4;
    }
    else {
      throw sys.Err.make(this.toStr());
    }
    ;
  }

  static make($ordinal,$name) {
    const $self = new LineType();
    LineType.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(LineType.type$, LineType.vals(), name$, checked);
  }

  static vals() {
    if (LineType.#vals == null) {
      LineType.#vals = sys.List.make(LineType.type$, [
        LineType.make(0, "eof", ),
        LineType.make(1, "blank", ),
        LineType.make(2, "ul", ),
        LineType.make(3, "ol", ),
        LineType.make(4, "h1", ),
        LineType.make(5, "h2", ),
        LineType.make(6, "h3", ),
        LineType.make(7, "h4", ),
        LineType.make(8, "blockquote", ),
        LineType.make(9, "preStart", ),
        LineType.make(10, "preEnd", ),
        LineType.make(11, "hr", ),
        LineType.make(12, "normal", ),
      ]).toImmutable();
    }
    return LineType.#vals;
  }

  static static$init() {
    const $_u32 = LineType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class DocNodeId extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocNodeId.type$; }

  static text() { return DocNodeId.vals().get(0); }

  static doc() { return DocNodeId.vals().get(1); }

  static heading() { return DocNodeId.vals().get(2); }

  static para() { return DocNodeId.vals().get(3); }

  static pre() { return DocNodeId.vals().get(4); }

  static blockQuote() { return DocNodeId.vals().get(5); }

  static orderedList() { return DocNodeId.vals().get(6); }

  static unorderedList() { return DocNodeId.vals().get(7); }

  static listItem() { return DocNodeId.vals().get(8); }

  static emphasis() { return DocNodeId.vals().get(9); }

  static strong() { return DocNodeId.vals().get(10); }

  static code() { return DocNodeId.vals().get(11); }

  static link() { return DocNodeId.vals().get(12); }

  static image() { return DocNodeId.vals().get(13); }

  static hr() { return DocNodeId.vals().get(14); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new DocNodeId();
    DocNodeId.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(DocNodeId.type$, DocNodeId.vals(), name$, checked);
  }

  static vals() {
    if (DocNodeId.#vals == null) {
      DocNodeId.#vals = sys.List.make(DocNodeId.type$, [
        DocNodeId.make(0, "text", ),
        DocNodeId.make(1, "doc", ),
        DocNodeId.make(2, "heading", ),
        DocNodeId.make(3, "para", ),
        DocNodeId.make(4, "pre", ),
        DocNodeId.make(5, "blockQuote", ),
        DocNodeId.make(6, "orderedList", ),
        DocNodeId.make(7, "unorderedList", ),
        DocNodeId.make(8, "listItem", ),
        DocNodeId.make(9, "emphasis", ),
        DocNodeId.make(10, "strong", ),
        DocNodeId.make(11, "code", ),
        DocNodeId.make(12, "link", ),
        DocNodeId.make(13, "image", ),
        DocNodeId.make(14, "hr", ),
      ]).toImmutable();
    }
    return DocNodeId.#vals;
  }

  static static$init() {
    const $_u33 = DocNodeId.vals();
    if (true) {
    }
    ;
    return;
  }

}

class DocNode extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocNode.type$; }

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

  isBlock() {
    return !this.isInline();
  }

  dump(out) {
    if (out === undefined) out = sys.Env.cur().out();
    let html = HtmlDocWriter.make(out);
    this.write(html);
    html.out().flush();
    return;
  }

  path() {
    let p = sys.List.make(DocNode.type$, [this]);
    let cur = this.#parent;
    while (cur != null) {
      p.add(sys.ObjUtil.coerce(cur, DocNode.type$));
      (cur = cur.#parent);
    }
    ;
    return p.reverse();
  }

  pos() {
    return ((this$) => { let $_u34 = ((this$) => { let $_u35 = this$.#parent; if ($_u35 == null) return null; return this$.#parent.children(); })(this$); if ($_u34 == null) return null; return ((this$) => { let $_u36 = this$.#parent; if ($_u36 == null) return null; return this$.#parent.children(); })(this$).indexSame(this$); })(this);
  }

  isFirst() {
    return sys.ObjUtil.equals(this.pos(), 0);
  }

  isLast() {
    return ((this$) => { let $_u37 = ((this$) => { let $_u38 = this$.#parent; if ($_u38 == null) return null; return this$.#parent.children(); })(this$); if ($_u37 == null) return null; return ((this$) => { let $_u39 = this$.#parent; if ($_u39 == null) return null; return this$.#parent.children(); })(this$).last(); })(this) === this;
  }

  static make() {
    const $self = new DocNode();
    DocNode.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DocText extends DocNode {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocText.type$; }

  #str = null;

  str(it) {
    if (it === undefined) {
      return this.#str;
    }
    else {
      this.#str = it;
      return;
    }
  }

  static make(str) {
    const $self = new DocText();
    DocText.make$($self,str);
    return $self;
  }

  static make$($self,str) {
    DocNode.make$($self);
    $self.#str = str;
    return;
  }

  id() {
    return DocNodeId.text();
  }

  write(out) {
    out.text(this);
    return;
  }

  isInline() {
    return true;
  }

  toText() {
    return this.#str;
  }

  toStr() {
    return this.#str;
  }

}

class DocElem extends DocNode {
  constructor() {
    super();
    const this$ = this;
    this.#kids = sys.List.make(DocNode.type$);
    return;
  }

  typeof() { return DocElem.type$; }

  #kids = null;

  // private field reflection only
  __kids(it) { if (it === undefined) return this.#kids; else this.#kids = it; }

  #anchorId = null;

  anchorId(it) {
    if (it === undefined) {
      return this.#anchorId;
    }
    else {
      this.#anchorId = it;
      return;
    }
  }

  write(out) {
    out.elemStart(this);
    this.writeChildren(out);
    out.elemEnd(this);
    return;
  }

  writeChildren(out) {
    const this$ = this;
    this.children().each((child) => {
      child.write(out);
      return;
    });
    return;
  }

  children() {
    return this.#kids.ro();
  }

  eachChild(f) {
    this.#kids.each(f);
    return;
  }

  addChild(node) {
    return this.add(node);
  }

  add(node) {
    const this$ = this;
    if (node.parent() != null) {
      throw sys.ArgErr.make(sys.Str.plus("Node already parented: ", node));
    }
    ;
    if (!this.#kids.isEmpty()) {
      let last = this.#kids.last();
      if ((node.id() === DocNodeId.text() && last.id() === DocNodeId.text())) {
        sys.ObjUtil.coerce(this.#kids.last(), DocText.type$).str(sys.Str.plus(sys.ObjUtil.coerce(this.#kids.last(), DocText.type$).str(), sys.ObjUtil.coerce(node, DocText.type$).str()));
        return this;
      }
      ;
      if ((node.id() === DocNodeId.blockQuote() && sys.ObjUtil.equals(last.id(), DocNodeId.blockQuote()))) {
        let elem = sys.ObjUtil.coerce(node, DocElem.type$);
        elem.#kids.dup().each((child) => {
          elem.remove(child);
          sys.ObjUtil.trap(last,"addChild", sys.List.make(sys.Obj.type$.toNullable(), [child]));
          return;
        });
        return this;
      }
      ;
    }
    ;
    node.parent(this);
    this.#kids.add(node);
    return this;
  }

  insert(index,node) {
    const this$ = this;
    let tail = sys.List.make(DocNode.type$, [node]);
    this.#kids.dup().eachRange(sys.Range.make(index, -1), (child) => {
      this$.remove(child);
      tail.add(child);
      return;
    });
    tail.each((it) => {
      this$.add(it);
      return;
    });
    return this;
  }

  addAll(nodes) {
    const this$ = this;
    nodes.each((node) => {
      this$.add(node);
      return;
    });
    return this;
  }

  remove(node) {
    if (this.#kids.removeSame(node) == null) {
      throw sys.ArgErr.make(sys.Str.plus("not my child: ", node));
    }
    ;
    node.parent(null);
    return this;
  }

  removeAll() {
    const this$ = this;
    this.#kids.dup().each((node) => {
      this$.remove(node);
      return;
    });
    return this;
  }

  toText() {
    const this$ = this;
    if (sys.ObjUtil.equals(this.#kids.size(), 1)) {
      return this.#kids.first().toText();
    }
    ;
    let s = sys.StrBuf.make();
    this.#kids.each((kid) => {
      s.join(kid.toText(), " ");
      return;
    });
    return s.toStr();
  }

  path() {
    const this$ = this;
    return sys.ObjUtil.coerce(DocNode.prototype.path.call(this).map((n) => {
      return sys.ObjUtil.coerce(n, DocElem.type$);
    }, DocElem.type$), sys.Type.find("fandoc::DocElem[]"));
  }

  static make() {
    const $self = new DocElem();
    DocElem.make$($self);
    return $self;
  }

  static make$($self) {
    DocNode.make$($self);
    ;
    return;
  }

}

class Doc extends DocElem {
  constructor() {
    super();
    const this$ = this;
    this.#meta = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    return;
  }

  typeof() { return Doc.type$; }

  #meta = null;

  meta(it) {
    if (it === undefined) {
      return this.#meta;
    }
    else {
      this.#meta = it;
      return;
    }
  }

  id() {
    return DocNodeId.doc();
  }

  htmlName() {
    return "body";
  }

  isInline() {
    return false;
  }

  write(out) {
    out.docStart(this);
    DocElem.prototype.write.call(this, out);
    out.docEnd(this);
    return;
  }

  findHeadings() {
    let acc = sys.List.make(Heading.type$);
    this.doFindHeadings(acc, this);
    return acc;
  }

  doFindHeadings(acc,elem) {
    const this$ = this;
    if (sys.ObjUtil.is(elem, Heading.type$)) {
      acc.add(sys.ObjUtil.coerce(elem, Heading.type$));
    }
    ;
    elem.children().each((kid) => {
      if (sys.ObjUtil.is(kid, DocElem.type$)) {
        this$.doFindHeadings(acc, sys.ObjUtil.coerce(kid, DocElem.type$));
      }
      ;
      return;
    });
    return;
  }

  static make() {
    const $self = new Doc();
    Doc.make$($self);
    return $self;
  }

  static make$($self) {
    DocElem.make$($self);
    ;
    return;
  }

}

class Heading extends DocElem {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Heading.type$; }

  #level = 0;

  level() { return this.#level; }

  __level(it) { if (it === undefined) return this.#level; else this.#level = it; }

  static make(level) {
    const $self = new Heading();
    Heading.make$($self,level);
    return $self;
  }

  static make$($self,level) {
    DocElem.make$($self);
    $self.#level = level;
    return;
  }

  id() {
    return DocNodeId.heading();
  }

  htmlName() {
    return sys.Str.plus("h", sys.ObjUtil.coerce(this.#level, sys.Obj.type$.toNullable()));
  }

  isInline() {
    return false;
  }

  title() {
    return this.toText();
  }

}

class Para extends DocElem {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Para.type$; }

  #admonition = null;

  admonition(it) {
    if (it === undefined) {
      return this.#admonition;
    }
    else {
      this.#admonition = it;
      return;
    }
  }

  id() {
    return DocNodeId.para();
  }

  htmlName() {
    return "p";
  }

  isInline() {
    return false;
  }

  static make() {
    const $self = new Para();
    Para.make$($self);
    return $self;
  }

  static make$($self) {
    DocElem.make$($self);
    return;
  }

}

class Pre extends DocElem {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Pre.type$; }

  id() {
    return DocNodeId.pre();
  }

  htmlName() {
    return "pre";
  }

  isInline() {
    return false;
  }

  static make() {
    const $self = new Pre();
    Pre.make$($self);
    return $self;
  }

  static make$($self) {
    DocElem.make$($self);
    return;
  }

}

class BlockQuote extends DocElem {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BlockQuote.type$; }

  id() {
    return DocNodeId.blockQuote();
  }

  htmlName() {
    return "blockquote";
  }

  isInline() {
    return false;
  }

  static make() {
    const $self = new BlockQuote();
    BlockQuote.make$($self);
    return $self;
  }

  static make$($self) {
    DocElem.make$($self);
    return;
  }

}

class OrderedList extends DocElem {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return OrderedList.type$; }

  #style = null;

  style(it) {
    if (it === undefined) {
      return this.#style;
    }
    else {
      this.#style = it;
      return;
    }
  }

  static make(style) {
    const $self = new OrderedList();
    OrderedList.make$($self,style);
    return $self;
  }

  static make$($self,style) {
    DocElem.make$($self);
    $self.#style = style;
    return;
  }

  id() {
    return DocNodeId.orderedList();
  }

  htmlName() {
    return "ol";
  }

  isInline() {
    return false;
  }

}

class OrderedListStyle extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return OrderedListStyle.type$; }

  static number() { return OrderedListStyle.vals().get(0); }

  static upperAlpha() { return OrderedListStyle.vals().get(1); }

  static lowerAlpha() { return OrderedListStyle.vals().get(2); }

  static upperRoman() { return OrderedListStyle.vals().get(3); }

  static lowerRoman() { return OrderedListStyle.vals().get(4); }

  static #vals = undefined;

  htmlType() {
    let $_u40 = this;
    if (sys.ObjUtil.equals($_u40, OrderedListStyle.number())) {
      return "decimal";
    }
    else if (sys.ObjUtil.equals($_u40, OrderedListStyle.upperAlpha())) {
      return "upper-alpha";
    }
    else if (sys.ObjUtil.equals($_u40, OrderedListStyle.lowerAlpha())) {
      return "lower-alpha";
    }
    else if (sys.ObjUtil.equals($_u40, OrderedListStyle.upperRoman())) {
      return "upper-roman";
    }
    else if (sys.ObjUtil.equals($_u40, OrderedListStyle.lowerRoman())) {
      return "lower-roman";
    }
    else {
      throw sys.Err.make(this.toStr());
    }
    ;
  }

  static fromFirstChar(ch) {
    if (sys.ObjUtil.equals(ch, 73)) {
      return OrderedListStyle.upperRoman();
    }
    ;
    if (sys.ObjUtil.equals(ch, 105)) {
      return OrderedListStyle.lowerRoman();
    }
    ;
    if (sys.Int.isUpper(ch)) {
      return OrderedListStyle.upperAlpha();
    }
    ;
    if (sys.Int.isLower(ch)) {
      return OrderedListStyle.lowerAlpha();
    }
    ;
    return OrderedListStyle.number();
  }

  static make($ordinal,$name) {
    const $self = new OrderedListStyle();
    OrderedListStyle.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(OrderedListStyle.type$, OrderedListStyle.vals(), name$, checked);
  }

  static vals() {
    if (OrderedListStyle.#vals == null) {
      OrderedListStyle.#vals = sys.List.make(OrderedListStyle.type$, [
        OrderedListStyle.make(0, "number", ),
        OrderedListStyle.make(1, "upperAlpha", ),
        OrderedListStyle.make(2, "lowerAlpha", ),
        OrderedListStyle.make(3, "upperRoman", ),
        OrderedListStyle.make(4, "lowerRoman", ),
      ]).toImmutable();
    }
    return OrderedListStyle.#vals;
  }

  static static$init() {
    const $_u41 = OrderedListStyle.vals();
    if (true) {
    }
    ;
    return;
  }

}

class UnorderedList extends DocElem {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnorderedList.type$; }

  id() {
    return DocNodeId.unorderedList();
  }

  htmlName() {
    return "ul";
  }

  isInline() {
    return false;
  }

  static make() {
    const $self = new UnorderedList();
    UnorderedList.make$($self);
    return $self;
  }

  static make$($self) {
    DocElem.make$($self);
    return;
  }

}

class ListItem extends DocElem {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ListItem.type$; }

  id() {
    return DocNodeId.listItem();
  }

  htmlName() {
    return "li";
  }

  isInline() {
    return false;
  }

  static make() {
    const $self = new ListItem();
    ListItem.make$($self);
    return $self;
  }

  static make$($self) {
    DocElem.make$($self);
    return;
  }

}

class Emphasis extends DocElem {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Emphasis.type$; }

  id() {
    return DocNodeId.emphasis();
  }

  htmlName() {
    return "em";
  }

  isInline() {
    return true;
  }

  static make() {
    const $self = new Emphasis();
    Emphasis.make$($self);
    return $self;
  }

  static make$($self) {
    DocElem.make$($self);
    return;
  }

}

class Strong extends DocElem {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Strong.type$; }

  id() {
    return DocNodeId.strong();
  }

  htmlName() {
    return "strong";
  }

  isInline() {
    return true;
  }

  static make() {
    const $self = new Strong();
    Strong.make$($self);
    return $self;
  }

  static make$($self) {
    DocElem.make$($self);
    return;
  }

}

class Code extends DocElem {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Code.type$; }

  id() {
    return DocNodeId.code();
  }

  htmlName() {
    return "code";
  }

  isInline() {
    return true;
  }

  static make() {
    const $self = new Code();
    Code.make$($self);
    return $self;
  }

  static make$($self) {
    DocElem.make$($self);
    return;
  }

}

class Link extends DocElem {
  constructor() {
    super();
    const this$ = this;
    this.#isCode = false;
    return;
  }

  typeof() { return Link.type$; }

  #isCode = false;

  isCode(it) {
    if (it === undefined) {
      return this.#isCode;
    }
    else {
      this.#isCode = it;
      return;
    }
  }

  #uri = null;

  uri(it) {
    if (it === undefined) {
      return this.#uri;
    }
    else {
      this.#uri = it;
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

  static make(uri) {
    const $self = new Link();
    Link.make$($self,uri);
    return $self;
  }

  static make$($self,uri) {
    DocElem.make$($self);
    ;
    $self.#uri = uri;
    return;
  }

  id() {
    return DocNodeId.link();
  }

  htmlName() {
    return "a";
  }

  isInline() {
    return true;
  }

  isTextUri() {
    return (sys.ObjUtil.is(this.children().first(), DocText.type$) && sys.ObjUtil.equals(sys.ObjUtil.toStr(this.children().first()), this.#uri));
  }

  setText(text) {
    sys.ObjUtil.coerce(this.removeAll(), Link.type$).add(DocText.make(text));
    return;
  }

}

class Image extends DocElem {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Image.type$; }

  #uri = null;

  uri(it) {
    if (it === undefined) {
      return this.#uri;
    }
    else {
      this.#uri = it;
      return;
    }
  }

  #alt = null;

  alt(it) {
    if (it === undefined) {
      return this.#alt;
    }
    else {
      this.#alt = it;
      return;
    }
  }

  #size = null;

  size(it) {
    if (it === undefined) {
      return this.#size;
    }
    else {
      this.#size = it;
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

  static make(uri,alt) {
    const $self = new Image();
    Image.make$($self,uri,alt);
    return $self;
  }

  static make$($self,uri,alt) {
    DocElem.make$($self);
    $self.#uri = uri;
    $self.#alt = alt;
    return;
  }

  id() {
    return DocNodeId.image();
  }

  htmlName() {
    return "img";
  }

  isInline() {
    return true;
  }

}

class Hr extends DocElem {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Hr.type$; }

  id() {
    return DocNodeId.hr();
  }

  htmlName() {
    return "hr";
  }

  isInline() {
    return false;
  }

  static make() {
    const $self = new Hr();
    Hr.make$($self);
    return $self;
  }

  static make$($self) {
    DocElem.make$($self);
    return;
  }

}

class HtmlDocWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#onLink = null;
    this.#onImage = null;
    return;
  }

  typeof() { return HtmlDocWriter.type$; }

  #onLink = null;

  onLink(it) {
    if (it === undefined) {
      return this.#onLink;
    }
    else {
      this.#onLink = it;
      return;
    }
  }

  #onImage = null;

  onImage(it) {
    if (it === undefined) {
      return this.#onImage;
    }
    else {
      this.#onImage = it;
      return;
    }
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

  static make(out) {
    const $self = new HtmlDocWriter();
    HtmlDocWriter.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    if (out === undefined) out = sys.Env.cur().out();
    ;
    $self.#out = out;
    return;
  }

  docStart(doc) {
    this.#out.print("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"\n");
    this.#out.print(" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n");
    this.#out.print("<html>\n");
    this.#out.print("<head>\n");
    this.docHead(doc);
    this.#out.print("</head>\n");
    return;
  }

  docHead(doc) {
    const this$ = this;
    this.#out.print("  <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>\n");
    doc.meta().each((val,key) => {
      let $_u42 = key;
      if (sys.ObjUtil.equals($_u42, "title")) {
        this$.#out.print("  <title>");
        this$.safeText(val);
        this$.#out.print("</title>\n");
      }
      else {
        this$.#out.print("  <meta");
        this$.attr("name", key);
        this$.attr("content", val);
        this$.#out.print("/>\n");
      }
      ;
      return;
    });
    return;
  }

  docEnd(doc) {
    this.#out.print("</html>");
    return;
  }

  elemStart(elem) {
    if (elem.isBlock()) {
      this.#out.writeChar(10);
    }
    ;
    if (sys.ObjUtil.equals(elem.id(), DocNodeId.link())) {
      if (this.#onLink != null) {
        sys.Func.call(this.#onLink, sys.ObjUtil.coerce(elem, Link.type$));
      }
      ;
      if (sys.ObjUtil.coerce(sys.ObjUtil.trap(elem,"isCode", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Bool.type$)) {
        this.#out.print("<code>");
      }
      ;
    }
    ;
    this.#out.writeChar(60).print(elem.htmlName());
    if (elem.anchorId() != null) {
      this.#out.print(sys.Str.plus(sys.Str.plus(" id='", elem.anchorId()), "'"));
    }
    ;
    let $_u43 = elem.id();
    if (sys.ObjUtil.equals($_u43, DocNodeId.link())) {
      let link = sys.ObjUtil.as(elem, Link.type$);
      this.#out.print(sys.Str.plus(sys.Str.plus(" href='", sys.Str.toXml(link.uri())), "'"));
    }
    else if (sys.ObjUtil.equals($_u43, DocNodeId.image())) {
      let img = sys.ObjUtil.as(elem, Image.type$);
      if (this.#onImage != null) {
        sys.Func.call(this.#onImage, sys.ObjUtil.coerce(img, Image.type$));
      }
      ;
      this.#out.print(sys.Str.plus(sys.Str.plus(" src='", sys.Str.toXml(img.uri())), "' alt='"));
      this.safeAttr(img.alt());
      this.#out.print("'");
      if (img.size() != null) {
        let toks = sys.Str.split(img.size(), sys.ObjUtil.coerce(120, sys.Int.type$.toNullable()));
        let w = toks.getSafe(0);
        let h = toks.getSafe(1);
        if (w != null) {
          this.#out.print(" width='").print(w).print("'");
        }
        ;
        if (h != null) {
          this.#out.print(" height='").print(h).print("'");
        }
        ;
      }
      ;
      this.#out.print("/>");
      return;
    }
    else if (sys.ObjUtil.equals($_u43, DocNodeId.para())) {
      let para = sys.ObjUtil.as(elem, Para.type$);
      if (para.admonition() != null) {
        this.#out.print(sys.Str.plus(sys.Str.plus(" class='", para.admonition()), "'"));
        this.#out.print(">").print(para.admonition()).print(": ");
        return;
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u43, DocNodeId.orderedList())) {
      let ol = sys.ObjUtil.as(elem, OrderedList.type$);
      this.#out.print(sys.Str.plus(sys.Str.plus(" style='list-style-type:", ol.style().htmlType()), "'"));
    }
    else if (sys.ObjUtil.equals($_u43, DocNodeId.hr())) {
      this.#out.printLine("/>");
      return;
    }
    ;
    this.#out.writeChar(62);
    return;
  }

  elemEnd(elem) {
    if (sys.ObjUtil.equals(elem.id(), DocNodeId.image())) {
      return;
    }
    ;
    if (sys.ObjUtil.equals(elem.id(), DocNodeId.hr())) {
      return;
    }
    ;
    this.#out.writeChar(60).writeChar(47).print(elem.htmlName()).writeChar(62);
    if ((sys.ObjUtil.equals(elem.id(), DocNodeId.link()) && sys.ObjUtil.coerce(elem, Link.type$).isCode())) {
      this.#out.print("</code>");
    }
    ;
    if (elem.isBlock()) {
      this.#out.writeChar(10);
    }
    ;
    return;
  }

  text(text) {
    this.safeText(text.str());
    return;
  }

  attr(name,val) {
    this.#out.writeChar(32).print(name).print("='");
    this.safeAttr(val);
    this.#out.writeChar(39);
    return;
  }

  safeAttr(s) {
    const this$ = this;
    sys.Str.each(s, (ch) => {
      if (sys.ObjUtil.equals(ch, 60)) {
        this$.#out.print("&lt;");
      }
      else {
        if (sys.ObjUtil.equals(ch, 38)) {
          this$.#out.print("&amp;");
        }
        else {
          if (sys.ObjUtil.equals(ch, 39)) {
            this$.#out.print("&#39;");
          }
          else {
            if (sys.ObjUtil.equals(ch, 34)) {
              this$.#out.print("&#34;");
            }
            else {
              this$.#out.writeChar(ch);
            }
            ;
          }
          ;
        }
        ;
      }
      ;
      return;
    });
    return;
  }

  safeText(s) {
    const this$ = this;
    sys.Str.each(s, (ch) => {
      if (sys.ObjUtil.equals(ch, 60)) {
        this$.#out.print("&lt;");
      }
      else {
        if (sys.ObjUtil.equals(ch, 38)) {
          this$.#out.print("&amp;");
        }
        else {
          this$.#out.writeChar(ch);
        }
        ;
      }
      ;
      return;
    });
    return;
  }

}

class MarkdownDocWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#onLink = null;
    this.#onImage = null;
    this.#listIndexes = sys.List.make(ListIndex.type$);
    return;
  }

  typeof() { return MarkdownDocWriter.type$; }

  #onLink = null;

  onLink(it) {
    if (it === undefined) {
      return this.#onLink;
    }
    else {
      this.#onLink = it;
      return;
    }
  }

  #onImage = null;

  onImage(it) {
    if (it === undefined) {
      return this.#onImage;
    }
    else {
      this.#onImage = it;
      return;
    }
  }

  static #ulSymbols = undefined;

  static ulSymbols() {
    if (MarkdownDocWriter.#ulSymbols === undefined) {
      MarkdownDocWriter.static$init();
      if (MarkdownDocWriter.#ulSymbols === undefined) MarkdownDocWriter.#ulSymbols = null;
    }
    return MarkdownDocWriter.#ulSymbols;
  }

  static #indDef = undefined;

  static indDef() {
    if (MarkdownDocWriter.#indDef === undefined) {
      MarkdownDocWriter.static$init();
      if (MarkdownDocWriter.#indDef === undefined) MarkdownDocWriter.#indDef = 0;
    }
    return MarkdownDocWriter.#indDef;
  }

  static #indCode = undefined;

  static indCode() {
    if (MarkdownDocWriter.#indCode === undefined) {
      MarkdownDocWriter.static$init();
      if (MarkdownDocWriter.#indCode === undefined) MarkdownDocWriter.#indCode = 0;
    }
    return MarkdownDocWriter.#indCode;
  }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  #listIndexes = null;

  // private field reflection only
  __listIndexes(it) { if (it === undefined) return this.#listIndexes; else this.#listIndexes = it; }

  #inPre = false;

  // private field reflection only
  __inPre(it) { if (it === undefined) return this.#inPre; else this.#inPre = it; }

  static make(out) {
    const $self = new MarkdownDocWriter();
    MarkdownDocWriter.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    if (out === undefined) out = sys.Env.cur().out();
    ;
    $self.#out = out;
    return;
  }

  docStart(doc) {
    return;
  }

  docEnd(doc) {
    this.#out.flush();
    return;
  }

  elemStart(elem) {
    let $_u44 = elem.id();
    if (sys.ObjUtil.equals($_u44, DocNodeId.para())) {
      let para = sys.ObjUtil.as(elem, Para.type$);
      if (this.inListItem()) {
        this.#out.printLine();
        this.#out.print(sys.Str.padl(sys.Str.defVal(), MarkdownDocWriter.indDef()));
      }
      ;
      if (para.anchorId() != null) {
        this.#out.print(sys.Str.plus(sys.Str.plus("[#", para.anchorId()), "]"));
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u44, DocNodeId.blockQuote())) {
      this.#out.print("> ");
    }
    else if (sys.ObjUtil.equals($_u44, DocNodeId.pre())) {
      this.#inPre = true;
    }
    else if (sys.ObjUtil.equals($_u44, DocNodeId.heading())) {
      let h = sys.ObjUtil.as(elem, Heading.type$);
      this.#out.print(sys.Str.padl(sys.Str.defVal(), h.level(), 35)).writeChar(32);
      if (elem.anchorId() != null) {
        this.#out.print(sys.Str.plus(sys.Str.plus("<a name=\"", elem.anchorId()), "\"></a>"));
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u44, DocNodeId.unorderedList())) {
      this.#listIndexes.push(ListIndex.make());
    }
    else if (sys.ObjUtil.equals($_u44, DocNodeId.orderedList())) {
      let ol = sys.ObjUtil.as(elem, OrderedList.type$);
      this.#listIndexes.push(ListIndex.make(OrderedListStyle.number()));
    }
    else if (sys.ObjUtil.equals($_u44, DocNodeId.listItem())) {
      let indent = sys.Int.mult(sys.Int.minus(this.#listIndexes.size(), 1), MarkdownDocWriter.indDef());
      this.#out.print(sys.Str.padl(sys.Str.defVal(), indent));
      this.#out.print(this.liSymbol());
      this.#listIndexes.peek().increment();
    }
    else if (sys.ObjUtil.equals($_u44, DocNodeId.link())) {
      let link = sys.ObjUtil.as(elem, Link.type$);
      ((this$) => { let $_u45 = this$.#onLink; if ($_u45 == null) return null; return sys.Func.call(this$.#onLink, sys.ObjUtil.coerce(link, Link.type$)); })(this);
      this.#out.writeChar(91);
    }
    else if (sys.ObjUtil.equals($_u44, DocNodeId.image())) {
      let img = sys.ObjUtil.as(elem, Image.type$);
      ((this$) => { let $_u46 = this$.#onImage; if ($_u46 == null) return null; return sys.Func.call(this$.#onImage, sys.ObjUtil.coerce(img, Image.type$)); })(this);
      this.#out.print(sys.Str.plus("![", img.alt()));
    }
    else if (sys.ObjUtil.equals($_u44, DocNodeId.emphasis())) {
      this.#out.writeChar(42);
    }
    else if (sys.ObjUtil.equals($_u44, DocNodeId.strong())) {
      this.#out.print("**");
    }
    else if (sys.ObjUtil.equals($_u44, DocNodeId.code())) {
      this.#out.print("`");
    }
    else if (sys.ObjUtil.equals($_u44, DocNodeId.hr())) {
      this.#out.print("---\n");
    }
    ;
    return;
  }

  elemEnd(elem) {
    let $_u47 = elem.id();
    if (sys.ObjUtil.equals($_u47, DocNodeId.para())) {
      if (!this.inListItem()) {
        this.#out.printLine();
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u47, DocNodeId.pre())) {
      this.#inPre = false;
    }
    else if (sys.ObjUtil.equals($_u47, DocNodeId.heading())) {
      this.#out.printLine();
    }
    else if (sys.ObjUtil.equals($_u47, DocNodeId.orderedList()) || sys.ObjUtil.equals($_u47, DocNodeId.unorderedList())) {
      this.#listIndexes.pop();
      if (this.#listIndexes.isEmpty()) {
        this.#out.printLine();
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u47, DocNodeId.link())) {
      let link = sys.ObjUtil.as(elem, Link.type$);
      this.#out.print(sys.Str.plus(sys.Str.plus("](", link.uri()), ")"));
    }
    else if (sys.ObjUtil.equals($_u47, DocNodeId.image())) {
      let img = sys.ObjUtil.as(elem, Image.type$);
      this.#out.print(sys.Str.plus(sys.Str.plus("](", img.uri()), ")"));
    }
    else if (sys.ObjUtil.equals($_u47, DocNodeId.emphasis())) {
      this.#out.writeChar(42);
    }
    else if (sys.ObjUtil.equals($_u47, DocNodeId.strong())) {
      this.#out.print("**");
    }
    else if (sys.ObjUtil.equals($_u47, DocNodeId.code())) {
      this.#out.print("`");
    }
    ;
    if (elem.isBlock()) {
      this.#out.writeChar(10);
    }
    ;
    return;
  }

  text(text) {
    const this$ = this;
    if (this.#inPre) {
      let indent = MarkdownDocWriter.indCode();
      if (this.inListItem()) {
        indent = sys.Int.plus(indent, sys.Int.mult(sys.Int.minus(this.#listIndexes.size(), 1), MarkdownDocWriter.indDef()));
      }
      ;
      let pad = sys.Str.padl(sys.Str.defVal(), indent);
      sys.Str.splitLines(text.str()).each((line) => {
        this$.#out.print(pad).printLine(line);
        return;
      });
    }
    else {
      this.#out.print(text.str());
    }
    ;
    return;
  }

  liSymbol() {
    const this$ = this;
    let li = this.#listIndexes.peek();
    if (li.style() == null) {
      let numUl = this.#listIndexes.findAll((it) => {
        return it.style() == null;
      }).size();
      return MarkdownDocWriter.ulSymbols().get(sys.Int.mod(sys.Int.minus(numUl, 1), MarkdownDocWriter.ulSymbols().size()));
    }
    ;
    return li.toStr();
  }

  inListItem() {
    return !this.#listIndexes.isEmpty();
  }

  static main(args) {
    if (args === undefined) args = sys.Env.cur().args();
    let doc = FandocParser.make().parse(args.get(0), sys.File.make(sys.Str.toUri(args.get(0))).in());
    doc.write(MarkdownDocWriter.make());
    return;
  }

  static static$init() {
    MarkdownDocWriter.#ulSymbols = sys.ObjUtil.coerce(((this$) => { let $_u48 = sys.List.make(sys.Str.type$, ["* ", "+ ", "- "]); if ($_u48 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$, ["* ", "+ ", "- "])); })(this), sys.Type.find("sys::Str[]"));
    MarkdownDocWriter.#indDef = 4;
    MarkdownDocWriter.#indCode = 4;
    return;
  }

}

class FandocTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FandocTest.type$; }

  testEmphasis() {
    const this$ = this;
    this.verifyDoc("*x*", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<em>", "x"])])]));
    this.verifyDoc("*foo*", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<em>", "foo"])])]));
    this.verifyDoc("\n*foo*", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<em>", "foo"])])]));
    this.verifyDoc("alpha *foo* beta", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", "alpha ", sys.List.make(sys.Str.type$, ["<em>", "foo"]), " beta"])]));
    this.verifyDoc("**x**", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<strong>", "x"])])]));
    this.verifyDoc("\n\n**x**", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<strong>", "x"])])]));
    this.verifyDoc("alpha **foo** beta", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", "alpha ", sys.List.make(sys.Str.type$, ["<strong>", "foo"]), " beta"])]));
    let ph = sys.ObjUtil.coerce(sys.ObjUtil.with(FandocParser.make(), (it) => {
      it.parseHeader(false);
      return;
    }), FandocParser.type$).parseStr("\n**foo**");
    this.verifyDocNode(ph, sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<strong>", "foo"])])]));
    this.verifyDoc("* **wow** *", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Obj.type$, ["<em>", " ", sys.List.make(sys.Str.type$, ["<strong>", "wow"]), " "])])]));
    this.verifyDoc("You know, *winter\n**really, really**\nsucks*!", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", "You know, ", sys.List.make(sys.Obj.type$, ["<em>", "winter ", sys.List.make(sys.Str.type$, ["<strong>", "really, really"]), " sucks"]), "!"])]));
    this.verifyDoc("** *wow* **", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Obj.type$, ["<strong>", " ", sys.List.make(sys.Str.type$, ["<em>", "wow"]), " "])])]));
    this.verifyDoc("You know, **winter\n*really, really*\nsucks**!", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", "You know, ", sys.List.make(sys.Obj.type$, ["<strong>", "winter ", sys.List.make(sys.Str.type$, ["<em>", "really, really"]), " sucks"]), "!"])]));
    this.verifyDoc("**`foo`**", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Obj.type$, ["<strong>", sys.List.make(sys.Str.type$, ["<a foo>", "foo"])])])]));
    this.verifyDoc("**[some Foo]`foo`**", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Obj.type$, ["<strong>", sys.List.make(sys.Str.type$, ["<a foo>", "some Foo"])])])]));
    this.verifyDoc("a*b", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "a*b"])]));
    this.verifyDoc("a**b", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "a**b"])]));
    this.verifyDoc("a/b", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "a/b"])]));
    this.verifyDoc("a * b", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "a * b"])]));
    this.verifyDoc("a / b", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "a / b"])]));
    return;
  }

  testEmphasisErr() {
    this.verifyDoc("Alpha beta\ngamma * in *.java,\ndelta.", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "Alpha beta gamma * in *.java, delta."])]));
    return;
  }

  testCode() {
    this.verifyDoc("Brian's", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "Brian's"])]));
    this.verifyDoc("'x'", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<code>", "x"])])]));
    this.verifyDoc("a 'x'", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", "a ", sys.List.make(sys.Str.type$, ["<code>", "x"])])]));
    this.verifyDoc("a 'x' b", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", "a ", sys.List.make(sys.Str.type$, ["<code>", "x"]), " b"])]));
    this.verifyDoc(" 'x' b ", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<code>", "x"]), " b"])]));
    this.verifyDoc("'x * y / z [`foo`]'", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<code>", "x * y / z [`foo`]"])])]));
    this.verifyDoc("'*a*'", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<code>", "*a*"])])]));
    this.verifyDoc("'**a**'", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<code>", "**a**"])])]));
    this.verifyDoc("'/foo/'", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<code>", "/foo/"])])]));
    return;
  }

  testLinks() {
    this.verifyDoc("`uri`", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<a uri>", "uri"])])]));
    this.verifyDoc("a `uri`", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", "a ", sys.List.make(sys.Str.type$, ["<a uri>", "uri"])])]));
    this.verifyDoc("a `uri` b", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", "a ", sys.List.make(sys.Str.type$, ["<a uri>", "uri"]), " b"])]));
    this.verifyDoc("`uri` b", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<a uri>", "uri"]), " b"])]));
    this.verifyDoc("Foo `one` bar `two`.", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", "Foo ", sys.List.make(sys.Str.type$, ["<a one>", "one"]), " bar ", sys.List.make(sys.Str.type$, ["<a two>", "two"]), "."])]));
    this.verifyDoc("[cool site]`http://cool/`", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<a http://cool/>", "cool site"])])]));
    this.verifyDoc("Check [cool site]`http://cool/`!", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", "Check ", sys.List.make(sys.Str.type$, ["<a http://cool/>", "cool site"]), "!"])]));
    this.verifyDoc("([cool site]`http://cool/`)", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", "(", sys.List.make(sys.Str.type$, ["<a http://cool/>", "cool site"]), ")"])]));
    this.verifyDoc("[]", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "[]"])]));
    this.verifyDoc("x [] y", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "x [] y"])]));
    return;
  }

  testImage() {
    this.verifyDoc("![cool image]`cool.png`", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<img cool image;cool.png>"])])]));
    this.verifyDoc("![cool image][100x200]`cool.png`", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<img cool image;cool.png;100x200>"])])]));
    this.verifyDoc("![Brian's Idea]`http://foo/idea.gif`", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Str.type$, ["<img Brian's Idea;http://foo/idea.gif>"])])]));
    this.verifyDoc("alpha ![x]`img.png` beta", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", "alpha ", sys.List.make(sys.Str.type$, ["<img x;img.png>"]), " beta"])]));
    this.verifyDoc("[![x]`img.png`]`#link`", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<p>", sys.List.make(sys.Obj.type$, ["<a>", sys.List.make(sys.Str.type$, ["<img x;img.png>"])])])]));
    return;
  }

  testAnchorIds() {
    let doc = this.verifyDoc("[#xyz]some text\nthe end.", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "some text the end."])]));
    this.verifyEq(sys.ObjUtil.trap(doc.children().first(),"anchorId", sys.List.make(sys.Obj.type$.toNullable(), [])), "xyz");
    (doc = this.verifyDoc("Chapter Two [#ch2]\n=======\nblah blah", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<h3>", "Chapter Two"]), sys.List.make(sys.Str.type$, ["<p>", "blah blah"])])));
    this.verifyEq(sys.ObjUtil.trap(doc.children().first(),"anchorId", sys.List.make(sys.Obj.type$.toNullable(), [])), "ch2");
    (doc = this.verifyDoc("[#ch2]Chapter Two\n=======\nblah blah", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<h3>", "Chapter Two"]), sys.List.make(sys.Str.type$, ["<p>", "blah blah"])])));
    this.verifyEq(sys.ObjUtil.trap(doc.children().first(),"anchorId", sys.List.make(sys.Obj.type$.toNullable(), [])), "ch2");
    return;
  }

  testPara() {
    this.verifyDoc("", sys.List.make(sys.Str.type$, ["<body>"]));
    this.verifyDoc("  \n  \n", sys.List.make(sys.Str.type$, ["<body>"]));
    this.verifyDoc("a", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "a"])]));
    this.verifyDoc("\na", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "a"])]));
    this.verifyDoc("\n\na b c\nd e f.", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "a b c d e f."])]));
    this.verifyDoc("a b c\n\nd e f.  ", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "a b c"]), sys.List.make(sys.Str.type$, ["<p>", "d e f."])]));
    this.verifyDoc("alpha\r\nbeta\r\n\r\ngamma\r\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "alpha beta"]), sys.List.make(sys.Str.type$, ["<p>", "gamma"])]));
    this.verifyDoc("NOTE: that's right", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p NOTE>", "that's right"])]));
    this.verifyDoc("TODO: that's right\nkeep it!", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p TODO>", "that's right keep it!"])]));
    this.verifyDoc("Note: that's right", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "Note: that's right"])]));
    return;
  }

  testPre() {
    this.verifyDoc("  a+b", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<pre>", "a+b"])]));
    this.verifyDoc("a\n\n  foo\n  bar\n\nb", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "a"]), sys.List.make(sys.Str.type$, ["<pre>", "foo\nbar"]), sys.List.make(sys.Str.type$, ["<p>", "b"])]));
    this.verifyDoc("  class A\n  {\n    Int x()\n    {\n      return 3\n    }\n  }\n\n\n  class B {}\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<pre>", "class A\n{\n  Int x()\n  {\n    return 3\n  }\n}\n\n\nclass B {}"])]));
    this.verifyDoc("Code:\n  [,]", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "Code:"]), sys.List.make(sys.Str.type$, ["<pre>", "[,]"])]));
    return;
  }

  testPreExplicit() {
    this.verifyDoc("pre>\n  - a\n\n  - b\n<pre\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<pre>", "- a\n\n- b\n"])]));
    this.verifyDoc("pre>\n  a\n b\nc\n<pre\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<pre>", "  a\n b\nc\n"])]));
    this.verifyDoc("pre>\n   3\n  2\n     5\n    4\n<pre\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<pre>", " 3\n2\n   5\n  4\n"])]));
    return;
  }

  testHeadings() {
    this.verifyDoc("Chapter 1\n*********\n\n1.1\n===\nAlpha\nBeta\n\n1. 1.1\n-----\n  Foo\n\nNew Book\n########\nChapter 2\n*********\n\nRoger - chapter two!\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<h2>", "Chapter 1"]), sys.List.make(sys.Str.type$, ["<h3>", "1.1"]), sys.List.make(sys.Str.type$, ["<p>", "Alpha Beta"]), sys.List.make(sys.Str.type$, ["<h4>", "1. 1.1"]), sys.List.make(sys.Str.type$, ["<pre>", "Foo"]), sys.List.make(sys.Str.type$, ["<h1>", "New Book"]), sys.List.make(sys.Str.type$, ["<h2>", "Chapter 2"]), sys.List.make(sys.Str.type$, ["<p>", "Roger - chapter two!"])]));
    this.verifyDoc("a\n\n####\nb", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "a"]), sys.List.make(sys.Str.type$, ["<p>", "#### b"])]));
    this.verifyDoc("a\n\n===\n\nb", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "a"]), sys.List.make(sys.Str.type$, ["<p>", "==="]), sys.List.make(sys.Str.type$, ["<p>", "b"])]));
    this.verifyDoc("\n\n------\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<hr>"])]));
    return;
  }

  testHr() {
    this.verifyDoc("Foo\n\n---\nBar", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "Foo"]), sys.List.make(sys.Str.type$, ["<hr>"]), sys.List.make(sys.Str.type$, ["<p>", "Bar"])]));
    this.verifyDoc("\n\n---", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<hr>"])]));
    this.verifyDoc("\n\n---\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<hr>"])]));
    return;
  }

  testBlockQuotes() {
    this.verifyDoc("> a", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<blockquote>", sys.List.make(sys.Str.type$, ["<p>", "a"])])]));
    this.verifyDoc("> a\n> b c\n> d", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<blockquote>", sys.List.make(sys.Str.type$, ["<p>", "a b c d"])])]));
    this.verifyDoc("> a\nb c\nd\n\np2", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<blockquote>", sys.List.make(sys.Str.type$, ["<p>", "a b c d"])]), sys.List.make(sys.Str.type$, ["<p>", "p2"])]));
    this.verifyDoc("> a\nb\n\n> c\nd\ne\n\nf", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<blockquote>", sys.List.make(sys.Str.type$, ["<p>", "a b"]), sys.List.make(sys.Str.type$, ["<p>", "c d e"])]), sys.List.make(sys.Str.type$, ["<p>", "f"])]));
    this.verifyDoc("> a\n> b\n\n> c\n> d\n> e\n\nf", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<blockquote>", sys.List.make(sys.Str.type$, ["<p>", "a b"]), sys.List.make(sys.Str.type$, ["<p>", "c d e"])]), sys.List.make(sys.Str.type$, ["<p>", "f"])]));
    return;
  }

  testUL() {
    this.verifyDoc("- a\n\nheading\n----", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Str.type$, ["<li>", "a"])]), sys.List.make(sys.Str.type$, ["<h4>", "heading"])]));
    this.verifyDoc("- a", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Str.type$, ["<li>", "a"])])]));
    this.verifyDoc("- a\n- b\n- c\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Str.type$, ["<li>", "a"]), sys.List.make(sys.Str.type$, ["<li>", "b"]), sys.List.make(sys.Str.type$, ["<li>", "c"])])]));
    this.verifyDoc("- li [link]`uri` text\n- li", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Obj.type$, ["<li>", "li ", sys.List.make(sys.Str.type$, ["<a uri>", "link"]), " text"]), sys.List.make(sys.Str.type$, ["<li>", "li"])])]));
    this.verifyDoc("- one\n  - a\n  - b\n- two\n  - c\n  - d\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Obj.type$, ["<li>", "one", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Str.type$, ["<li>", "a"]), sys.List.make(sys.Str.type$, ["<li>", "b"])])]), sys.List.make(sys.Obj.type$, ["<li>", "two", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Str.type$, ["<li>", "c"]), sys.List.make(sys.Str.type$, ["<li>", "d"])])])])]));
    this.verifyDoc("- one\n  - a\n    - i\n    - j\n  - b\n- two\n  - c\n  - d\n    - k\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Obj.type$, ["<li>", "one", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Obj.type$, ["<li>", "a", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Str.type$, ["<li>", "i"]), sys.List.make(sys.Str.type$, ["<li>", "j"])])]), sys.List.make(sys.Str.type$, ["<li>", "b"])])]), sys.List.make(sys.Obj.type$, ["<li>", "two", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Str.type$, ["<li>", "c"]), sys.List.make(sys.Obj.type$, ["<li>", "d", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Str.type$, ["<li>", "k"])])])])])])]));
    this.verifyDoc("  - a b c\n    d e f\n  - g h i j k\nl m n o\n  - p q\n      r s\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Str.type$, ["<li>", "a b c d e f"]), sys.List.make(sys.Str.type$, ["<li>", "g h i j k l m n o"]), sys.List.make(sys.Obj.type$, ["<li>", "p q", sys.List.make(sys.Str.type$, ["<pre>", "r s"])])])]));
    this.verifyDoc("- 1-a\n  1-b\n- 2-a\n  2-b\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Str.type$, ["<li>", "1-a 1-b"]), sys.List.make(sys.Str.type$, ["<li>", "2-a 2-b"])])]));
    this.verifyDoc("- one\n  line 2\n\n  one para 2\n  more\n\n- two\n\n    Int x()\n      {\n        return x\n      }\n\n    Int y\n\n  two para another\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Obj.type$, ["<li>", "one line 2", sys.List.make(sys.Str.type$, ["<p>", "one para 2 more"])]), sys.List.make(sys.Obj.type$, ["<li>", "two", sys.List.make(sys.Str.type$, ["<pre>", "Int x()\n  {\n    return x\n  }\n\nInt y"]), sys.List.make(sys.Str.type$, ["<p>", "two para another"])])])]));
    return;
  }

  testOL() {
    this.verifyDoc("This is\nit. Right?", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "This is it. Right?"])]));
    this.verifyDoc("1. one\n2. two", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ol 1>", sys.List.make(sys.Str.type$, ["<li>", "one"]), sys.List.make(sys.Str.type$, ["<li>", "two"])])]));
    this.verifyDoc("  A. one\n  B. two", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ol A>", sys.List.make(sys.Str.type$, ["<li>", "one"]), sys.List.make(sys.Str.type$, ["<li>", "two"])])]));
    this.verifyDoc("a. one\ntwo\nthree", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ol a>", sys.List.make(sys.Str.type$, ["<li>", "one two three"])])]));
    this.verifyDoc("I. one\nII. two\nIII. three", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ol I>", sys.List.make(sys.Str.type$, ["<li>", "one"]), sys.List.make(sys.Str.type$, ["<li>", "two"]), sys.List.make(sys.Str.type$, ["<li>", "three"])])]));
    this.verifyDoc("i. one\nii. two", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ol i>", sys.List.make(sys.Str.type$, ["<li>", "one"]), sys.List.make(sys.Str.type$, ["<li>", "two"])])]));
    this.verifyDoc("I. ONE\n  A. alpha\n    i. one\n    ii. two\n  B. beta\nII. TWO\n  A. gamma\n  B. delta\n\n       - a\n       - b\n       - c\n\n     delta continues\n     again\n\n       some code\n         -> foo\n\n     delta another para\n\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ol I>", sys.List.make(sys.Obj.type$, ["<li>", "ONE", sys.List.make(sys.Obj.type$, ["<ol A>", sys.List.make(sys.Obj.type$, ["<li>", "alpha", sys.List.make(sys.Obj.type$, ["<ol i>", sys.List.make(sys.Str.type$, ["<li>", "one"]), sys.List.make(sys.Str.type$, ["<li>", "two"])])]), sys.List.make(sys.Str.type$, ["<li>", "beta"])])]), sys.List.make(sys.Obj.type$, ["<li>", "TWO", sys.List.make(sys.Obj.type$, ["<ol A>", sys.List.make(sys.Str.type$, ["<li>", "gamma"]), sys.List.make(sys.Obj.type$, ["<li>", "delta", sys.List.make(sys.Obj.type$, ["<ul>", sys.List.make(sys.Str.type$, ["<li>", "a"]), sys.List.make(sys.Str.type$, ["<li>", "b"]), sys.List.make(sys.Str.type$, ["<li>", "c"])]), sys.List.make(sys.Str.type$, ["<p>", "delta continues again"]), sys.List.make(sys.Str.type$, ["<pre>", "some code\n  -> foo"]), sys.List.make(sys.Str.type$, ["<p>", "delta another para"])])])])])]));
    this.verifyDoc("1. 1-a\n   1-b\n2. 2-a\n   2-b\n\n   2-c\n   2-d\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ol 1>", sys.List.make(sys.Str.type$, ["<li>", "1-a 1-b"]), sys.List.make(sys.Obj.type$, ["<li>", "2-a 2-b", sys.List.make(sys.Str.type$, ["<p>", "2-c 2-d"])])])]));
    this.verifyDoc("i. 1-a\n   1-b\nii. 2-a\n    2-b\niii. 3-a\n     3-b\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Obj.type$, ["<ol i>", sys.List.make(sys.Str.type$, ["<li>", "1-a 1-b"]), sys.List.make(sys.Str.type$, ["<li>", "2-a 2-b"]), sys.List.make(sys.Str.type$, ["<li>", "3-a 3-b"])])]));
    return;
  }

  testMeta() {
    let doc = this.verifyDoc("**************************************\n** a: b\n** title: Rocking test here!\n**************************************\n\nhead\n***\n\npara", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<h2>", "head"]), sys.List.make(sys.Str.type$, ["<p>", "para"])]));
    this.verifyEq(sys.ObjUtil.coerce(doc.meta().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(doc.meta().get("a"), "b");
    this.verifyEq(doc.meta().get("title"), "Rocking test here!");
    return;
  }

  testErrs() {
    this.verifyErrs("*i", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "*i"])]), sys.List.make(sys.Obj.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$), "Invalid *emphasis*"]));
    this.verifyErrs("a\nb\n**i", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "a b **i"])]), sys.List.make(sys.Obj.type$, [sys.ObjUtil.coerce(3, sys.Obj.type$), "Invalid **strong**"]));
    this.verifyErrs("aaaa\nbbbb bbb\n\nccc\n**i", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "aaaa bbbb bbb"]), sys.List.make(sys.Str.type$, ["<p>", "ccc **i"])]), sys.List.make(sys.Obj.type$, [sys.ObjUtil.coerce(5, sys.Obj.type$), "Invalid **strong**"]));
    this.verifyErrs("abc `foo\n\n1. ok\n2. *bad\n3. **worse\n", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<p>", "abc `foo"]), sys.List.make(sys.Obj.type$, ["<ol 1>", sys.List.make(sys.Str.type$, ["<li>", "ok"]), sys.List.make(sys.Str.type$, ["<li>", "*bad"]), sys.List.make(sys.Str.type$, ["<li>", "**worse"])])]), sys.List.make(sys.Obj.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$), "Invalid uri", sys.ObjUtil.coerce(4, sys.Obj.type$), "Invalid *emphasis*", sys.ObjUtil.coerce(5, sys.Obj.type$), "Invalid **strong**"]));
    this.verifyErrs("------\na\n- one\n- two", sys.List.make(sys.Obj.type$, ["<body>", sys.List.make(sys.Str.type$, ["<pre>", "------\na\n- one\n- two"])]), sys.List.make(sys.Obj.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$), "Invalid line 1"]));
    return;
  }

  verifyErrs(str,expected,errs) {
    const this$ = this;
    let parser = sys.ObjUtil.coerce(sys.ObjUtil.with(FandocParser.make(), (it) => {
      it.silent(true);
      return;
    }), FandocParser.type$);
    let doc = parser.parse("Test", sys.Str.in(str));
    this.verifyDocNode(doc, expected);
    this.verifyEq(sys.ObjUtil.coerce(parser.errs().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.div(errs.size(), 2), sys.Obj.type$.toNullable()));
    parser.errs().each((e,i) => {
      this$.verifyEq(e.file(), "Test");
      this$.verifyEq(sys.ObjUtil.coerce(e.line(), sys.Obj.type$.toNullable()), errs.get(sys.Int.mult(i, 2)));
      this$.verifyEq(e.msg(), errs.get(sys.Int.plus(sys.Int.mult(i, 2), 1)));
      return;
    });
    return;
  }

  testToB26() {
    let li = ListIndex.make(OrderedListStyle.lowerAlpha());
    this.verifyEq(li.toStr(), "a. ");
    this.verifyEq(li.increment().toStr(), "b. ");
    this.verifyEq(li.increment().toStr(), "c. ");
    this.verifyEq(li.increment().toStr(), "d. ");
    this.verifyEq(li.increment().toStr(), "e. ");
    this.verifyEq(li.increment().toStr(), "f. ");
    this.verifyEq(li.increment().toStr(), "g. ");
    li.index(25);
    this.verifyEq(li.toStr(), "y. ");
    this.verifyEq(li.increment().toStr(), "z. ");
    this.verifyEq(li.increment().toStr(), "aa. ");
    this.verifyEq(li.increment().toStr(), "ab. ");
    this.verifyEq(li.increment().toStr(), "ac. ");
    (li = ListIndex.make(OrderedListStyle.upperAlpha()));
    this.verifyEq(li.toStr(), "A. ");
    this.verifyEq(li.increment().toStr(), "B. ");
    this.verifyEq(li.increment().toStr(), "C. ");
    this.verifyEq(li.increment().toStr(), "D. ");
    this.verifyEq(li.increment().toStr(), "E. ");
    this.verifyEq(li.increment().toStr(), "F. ");
    this.verifyEq(li.increment().toStr(), "G. ");
    li.index(26);
    this.verifyEq(li.toStr(), "Z. ");
    this.verifyEq(li.increment().toStr(), "AA. ");
    this.verifyEq(li.increment().toStr(), "AB. ");
    this.verifyEq(li.increment().toStr(), "AC. ");
    return;
  }

  testToRoman() {
    let li = ListIndex.make(OrderedListStyle.lowerRoman());
    this.verifyEq(li.toStr(), "i. ");
    this.verifyEq(li.increment().toStr(), "ii. ");
    this.verifyEq(li.increment().toStr(), "iii. ");
    this.verifyEq(li.increment().toStr(), "iv. ");
    this.verifyEq(li.increment().toStr(), "v. ");
    this.verifyEq(li.increment().toStr(), "vi. ");
    this.verifyEq(li.increment().toStr(), "vii. ");
    li.index(26);
    this.verifyEq(li.toStr(), "xxvi. ");
    this.verifyEq(li.increment().toStr(), "xxvii. ");
    this.verifyEq(li.increment().toStr(), "xxviii. ");
    this.verifyEq(li.increment().toStr(), "xxix. ");
    (li = ListIndex.make(OrderedListStyle.upperRoman()));
    this.verifyEq(li.toStr(), "I. ");
    this.verifyEq(li.increment().toStr(), "II. ");
    this.verifyEq(li.increment().toStr(), "III. ");
    this.verifyEq(li.increment().toStr(), "IV. ");
    this.verifyEq(li.increment().toStr(), "V. ");
    this.verifyEq(li.increment().toStr(), "VI. ");
    this.verifyEq(li.increment().toStr(), "VII. ");
    li.index(26);
    this.verifyEq(li.toStr(), "XXVI. ");
    this.verifyEq(li.increment().toStr(), "XXVII. ");
    this.verifyEq(li.increment().toStr(), "XXVIII. ");
    this.verifyEq(li.increment().toStr(), "XXIX. ");
    return;
  }

  verifyDoc(str,expected) {
    const this$ = this;
    let parser = sys.ObjUtil.coerce(sys.ObjUtil.with(FandocParser.make(), (it) => {
      it.silent(true);
      return;
    }), FandocParser.type$);
    let doc = parser.parse("Test", sys.Str.in(str));
    this.verifyDocNode(doc, expected);
    let roundtrip = sys.StrBuf.make();
    doc.write(FandocDocWriter.make(roundtrip.out()));
    let doc2 = parser.parse("Test-2", sys.Str.in(roundtrip.toStr()));
    this.verifyDocNode(doc2, expected);
    return doc;
  }

  verifyDocNode(actual,expected) {
    const this$ = this;
    let expectedElem = expected.first();
    let expectedKids = expected.getRange(sys.Range.make(1, -1));
    let elemName = sys.Str.getRange(sys.ObjUtil.toStr(expectedElem), sys.Range.make(1, -2));
    let olStyle = OrderedListStyle.number();
    if (sys.Str.startsWith(elemName, "ol")) {
      (olStyle = OrderedListStyle.fromFirstChar(sys.Str.get(elemName, -1)));
      (elemName = "ol");
      this.verifyEq(sys.ObjUtil.trap(actual,"style", sys.List.make(sys.Obj.type$.toNullable(), [])), olStyle);
    }
    else {
      if (sys.Str.startsWith(elemName, "p ")) {
        let admonition = sys.Str.getRange(elemName, sys.Range.make(2, -1));
        (elemName = "p");
        this.verifyEq(sys.ObjUtil.trap(actual,"admonition", sys.List.make(sys.Obj.type$.toNullable(), [])), admonition);
      }
      else {
        if (sys.Str.startsWith(elemName, "a ")) {
          let uri = sys.Str.getRange(elemName, sys.Range.make(2, -1));
          (elemName = "a");
          this.verifyEq(sys.ObjUtil.trap(actual,"uri", sys.List.make(sys.Obj.type$.toNullable(), [])), uri);
        }
        else {
          if (sys.Str.startsWith(elemName, "img ")) {
            let body = sys.Str.getRange(elemName, sys.Range.make(4, -1));
            (elemName = "img");
            this.verifyEq(sys.ObjUtil.trap(actual,"alt", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.split(body, sys.ObjUtil.coerce(59, sys.Int.type$.toNullable())).get(0));
            this.verifyEq(sys.ObjUtil.trap(actual,"uri", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.split(body, sys.ObjUtil.coerce(59, sys.Int.type$.toNullable())).get(1));
            this.verifyEq(sys.ObjUtil.trap(actual,"size", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.split(body, sys.ObjUtil.coerce(59, sys.Int.type$.toNullable())).getSafe(2));
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    this.verifyEq(actual.htmlName(), elemName);
    if (sys.ObjUtil.compareNE(actual.children().size(), expectedKids.size())) {
      sys.ObjUtil.echo("");
      sys.ObjUtil.echo(sys.Str.plus("actual   = ", actual.children()));
      sys.ObjUtil.echo(sys.Str.plus("expected = ", expectedKids));
    }
    ;
    this.verifyEq(sys.ObjUtil.coerce(actual.children().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expectedKids.size(), sys.Obj.type$.toNullable()));
    sys.Int.times(actual.children().size(), (i) => {
      let a = actual.children().get(i);
      let e = expectedKids.get(i);
      if (sys.ObjUtil.is(a, DocElem.type$)) {
        this$.verifyDocNode(sys.ObjUtil.coerce(a, DocElem.type$), sys.ObjUtil.coerce(e, sys.Type.find("sys::Obj[]")));
      }
      else {
        this$.verifyType(a, DocText.type$);
        if (sys.ObjUtil.compareNE(sys.ObjUtil.trap(a,"str", sys.List.make(sys.Obj.type$.toNullable(), [])), e)) {
          sys.Env.cur().err().printLine("-----");
          sys.Env.cur().err().printLine(sys.ObjUtil.trap(a,"str", sys.List.make(sys.Obj.type$.toNullable(), [])));
          sys.Env.cur().err().printLine(" != ");
          sys.Env.cur().err().printLine(e);
          sys.Env.cur().err().printLine("-----");
        }
        ;
        this$.verifyEq(sys.ObjUtil.trap(a,"str", sys.List.make(sys.Obj.type$.toNullable(), [])), e);
      }
      ;
      return;
    });
    return;
  }

  static make() {
    const $self = new FandocTest();
    FandocTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class PathTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PathTest.type$; }

  testPara() {
    this.verifyPath("", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("sys::Int[]")), sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("fandoc::DocNodeId[]")));
    this.verifyPath("a", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para()]));
    this.verifyPath("a b c\nd e f", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para()]));
    this.verifyPath("a\n\nb", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para()]));
    this.verifyPath("NOTE: that's right", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para()]));
    return;
  }

  testHeading() {
    this.verifyPath("H1\n####", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.heading()]));
    this.verifyPath("H2\n****", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.heading()]));
    this.verifyPath("H3\n====", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.heading()]));
    this.verifyPath("H4\n----", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.heading()]));
    this.verifyPath("para text\n\nH4\n----", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.heading()]));
    return;
  }

  testCode() {
    this.verifyPath("para text\n\nThis is a 'code' example.", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para(), DocNodeId.code()]));
    return;
  }

  testLinks() {
    this.verifyPath("`link`", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para(), DocNodeId.link()]));
    this.verifyPath("text [fantom]`https://fantom.org` text", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para(), DocNodeId.link()]));
    return;
  }

  testImages() {
    this.verifyPath("![cool image]`cool.png`", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para(), DocNodeId.image()]));
    this.verifyPath("An image: ![cool image]`cool.png`. Neat.", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para(), DocNodeId.image()]));
    return;
  }

  testEmphasis() {
    this.verifyPath("*x*", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para(), DocNodeId.emphasis()]));
    this.verifyPath("foo *emph* bar", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para(), DocNodeId.emphasis()]));
    this.verifyPath("**strong**", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para(), DocNodeId.strong()]));
    this.verifyPath("foo **strong** bar", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para(), DocNodeId.strong()]));
    this.verifyPath("a *emp\n**emp-strong**\nemp*!", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para(), DocNodeId.emphasis()]));
    this.verifyPath("a *emp\n**emp-strong**\nemp*!", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para(), DocNodeId.emphasis(), DocNodeId.strong()]));
    this.verifyPath("**`link`**", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.para(), DocNodeId.strong(), DocNodeId.link()]));
    return;
  }

  testPre() {
    this.verifyPath("  a+b", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.pre()]));
    this.verifyPath("Code:\n\n  a+b", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.pre()]));
    this.verifyPath("  class A\n  {\n    Int x() { return 3 }\n  }\n\n  class B : A { }\n", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.pre()]));
    this.verifyPath("pre>\n - a\n - b\n<pre\n", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.pre()]));
    return;
  }

  testBlockQuotes() {
    this.verifyPath("> a", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.blockQuote(), DocNodeId.para()]));
    this.verifyPath("> a\n> b c\n> d", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.blockQuote(), DocNodeId.para()]));
    this.verifyPath("> b1\n> b1\n\n> b2\n> b2", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.blockQuote(), DocNodeId.para()]));
    this.verifyPath("> b1\n> b1\n\nPara\n\n> b2\n> b2", sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]), sys.List.make(DocNodeId.type$, [DocNodeId.blockQuote(), DocNodeId.para()]));
    return;
  }

  verifyPath(str,childIndices,expected) {
    const this$ = this;
    let doc = this.parse(str);
    (expected = sys.List.make(DocNodeId.type$, [DocNodeId.doc()]).addAll(expected));
    let target = doc;
    childIndices.each((idx,i) => {
      (target = sys.ObjUtil.coerce(target.children().get(idx), DocElem.type$));
      this$.verifyEq(target.path().map((n) => {
        return n.id();
      }, DocNodeId.type$), expected.getRange(sys.Range.make(0, sys.Int.plus(i, 1))));
      return;
    });
    return doc;
  }

  testPositions() {
    let doc = this.parse("foo");
    this.verifyNull(sys.ObjUtil.coerce(doc.pos(), sys.Obj.type$.toNullable()));
    this.verifyFalse(doc.isFirst());
    this.verifyFalse(doc.isLast());
    let para = sys.ObjUtil.coerce(doc.children().get(0), DocElem.type$);
    this.verifySame(para.id(), DocNodeId.para());
    this.verifyEq(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(para.pos(), sys.Obj.type$.toNullable()));
    this.verify(para.isFirst());
    this.verify(para.isLast());
    (doc = this.parse("foo\n\nbar\n\nbaz"));
    (para = sys.ObjUtil.coerce(doc.children().get(1), DocElem.type$));
    this.verifySame(para.id(), DocNodeId.para());
    this.verifyEq(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(para.pos(), sys.Obj.type$.toNullable()));
    this.verifyFalse(para.isFirst());
    this.verifyFalse(para.isLast());
    return;
  }

  testInsert() {
    let doc = this.parse("foo\n\nbar\n\nbaz");
    let para = sys.ObjUtil.coerce(doc.children().get(1), DocElem.type$);
    this.verifyEq("bar", sys.ObjUtil.trap(para.children().first(),"str", sys.List.make(sys.Obj.type$.toNullable(), [])));
    para.insert(0, DocText.make("foo"));
    this.verifyEq("foobar", sys.ObjUtil.trap(para.children().first(),"str", sys.List.make(sys.Obj.type$.toNullable(), [])));
    para.insert(para.children().size(), DocText.make("baz"));
    this.verifyEq("foobarbaz", sys.ObjUtil.trap(para.children().first(),"str", sys.List.make(sys.Obj.type$.toNullable(), [])));
    (doc = this.parse("> a"));
    this.verifyEq(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(doc.children().size(), sys.Obj.type$.toNullable()));
    let bq = sys.ObjUtil.as(doc.children().first(), BlockQuote.type$);
    this.verifyEq(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(bq.children().size(), sys.Obj.type$.toNullable()));
    (para = sys.ObjUtil.coerce(bq.children().first(), DocElem.type$));
    this.verify(sys.ObjUtil.is(para, Para.type$));
    let p1 = sys.ObjUtil.coerce(Para.make().add(DocText.make("foo")), Para.type$);
    (bq = sys.ObjUtil.coerce(BlockQuote.make().add(p1), BlockQuote.type$));
    doc.insert(0, sys.ObjUtil.coerce(bq, DocNode.type$));
    this.verifyEq(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(doc.children().size(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(bq.children().size(), sys.Obj.type$.toNullable()));
    this.verifySame(p1, bq.children().first());
    this.verifySame(para, bq.children().last());
    let p2 = sys.ObjUtil.coerce(Para.make().add(DocText.make("baz")), Para.type$);
    let bq2 = sys.ObjUtil.coerce(BlockQuote.make().add(p2), BlockQuote.type$);
    doc.insert(doc.children().size(), bq2);
    this.verifyEq(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(doc.children().size(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(bq.children().size(), sys.Obj.type$.toNullable()));
    this.verifySame(p1, bq.children().first());
    this.verifySame(para, bq.children().get(1));
    this.verifySame(p2, bq.children().last());
    let p3 = sys.ObjUtil.coerce(Para.make().add(DocText.make("INNER")), Para.type$);
    bq.insert(1, p3);
    this.verifyEq(sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(bq.children().size(), sys.Obj.type$.toNullable()));
    this.verifySame(p1, bq.children().first());
    this.verifySame(p3, bq.children().get(1));
    this.verifySame(para, bq.children().get(2));
    this.verifySame(p2, bq.children().last());
    return;
  }

  parse(str) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(FandocParser.make(), (it) => {
      it.silent(true);
      return;
    }), FandocParser.type$).parse("Test", sys.Str.in(str));
  }

  static make() {
    const $self = new PathTest();
    PathTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class MarkdownTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
    this.#fandocCheatsheet = "Heading 1\n#########\nHeading 2\n*********\nHeading 3\n=========\nHeading 4\n---------\nHeading with anchor tag [#id]\n-----------------------------\nThis is *italic*\n\nThis is **bold**\n\nThis is a 'code' span.\n\nThis is a code block:\n\n  Void main() {\n      echo(Note the leading 4 spaces)\n  }\n\nThis is a link to [Fantom-Lang]`http://fantom-lang.org/`\n\n![Fanny the Fantom Image]`http://fantom-lang.org/png/fannyEvolved-x128.png`\n\nAbove the rule\n\n---\n\nBelow the rule\n\n> This is a block quote. - said Fanny\n\n- An unordered list\n- An unordered list\n- An unordered list\n\nAnother list:\n\n1. An ordered list\n2. An ordered list\n3. An ordered list\n\n";
    this.#markdownCheatsheet = "# Heading 1\n\n## Heading 2\n\n### Heading 3\n\n#### Heading 4\n\n#### <a name=\"id\"></a>Heading with anchor tag\n\nThis is *italic*\n\nThis is **bold**\n\nThis is a `code` span.\n\nThis is a code block:\n\n    Void main() {\n        echo(Note the leading 4 spaces)\n    }\n\nThis is a link to [Fantom-Lang](http://fantom-lang.org/)\n\n![Fanny the Fantom Image](http://fantom-lang.org/png/fannyEvolved-x128.png)\n\nAbove the rule\n\n---\n\nBelow the rule\n\n> This is a block quote. - said Fanny\n\n\n* An unordered list\n* An unordered list\n* An unordered list\n\n\nAnother list:\n\n1. An ordered list\n2. An ordered list\n3. An ordered list\n\n\n";
    return;
  }

  typeof() { return MarkdownTest.type$; }

  #fandocCheatsheet = null;

  fandocCheatsheet(it) {
    if (it === undefined) {
      return this.#fandocCheatsheet;
    }
    else {
      this.#fandocCheatsheet = it;
      return;
    }
  }

  #markdownCheatsheet = null;

  markdownCheatsheet(it) {
    if (it === undefined) {
      return this.#markdownCheatsheet;
    }
    else {
      this.#markdownCheatsheet = it;
      return;
    }
  }

  testFandoc() {
    let fandoc = FandocParser.make().parseStr(this.#fandocCheatsheet);
    let buf = sys.StrBuf.make();
    fandoc.writeChildren(FandocDocWriter.make(buf.out()));
    this.verifyEq(buf.toStr(), this.#fandocCheatsheet);
    return;
  }

  testMarkdown() {
    let fandoc = FandocParser.make().parseStr(this.#fandocCheatsheet);
    let buf = sys.StrBuf.make();
    fandoc.writeChildren(MarkdownDocWriter.make(buf.out()));
    this.verifyEq(buf.toStr(), this.#markdownCheatsheet);
    return;
  }

  static make() {
    const $self = new MarkdownTest();
    MarkdownTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    ;
    return;
  }

}

const p = sys.Pod.add$('fandoc');
const xp = sys.Param.noParams$();
let m;
FandocErr.type$ = p.at$('FandocErr','sys::Err',[],{'sys::Js':""},8194,FandocErr);
DocWriter.type$ = p.am$('DocWriter','sys::Obj',[],{'sys::Js':""},8449,DocWriter);
FandocDocWriter.type$ = p.at$('FandocDocWriter','sys::Obj',['fandoc::DocWriter'],{'sys::Js':""},8192,FandocDocWriter);
ListIndex.type$ = p.at$('ListIndex','sys::Obj',[],{'sys::Js':""},128,ListIndex);
InlineParser.type$ = p.at$('InlineParser','sys::Obj',[],{'sys::Js':""},128,InlineParser);
FandocParser.type$ = p.at$('FandocParser','sys::Obj',[],{'sys::Js':""},8192,FandocParser);
LineType.type$ = p.at$('LineType','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},170,LineType);
DocNodeId.type$ = p.at$('DocNodeId','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,DocNodeId);
DocNode.type$ = p.at$('DocNode','sys::Obj',[],{'sys::Js':""},8193,DocNode);
DocText.type$ = p.at$('DocText','fandoc::DocNode',[],{'sys::Js':""},8192,DocText);
DocElem.type$ = p.at$('DocElem','fandoc::DocNode',[],{'sys::Js':""},8193,DocElem);
Doc.type$ = p.at$('Doc','fandoc::DocElem',[],{'sys::Js':""},8192,Doc);
Heading.type$ = p.at$('Heading','fandoc::DocElem',[],{'sys::Js':""},8192,Heading);
Para.type$ = p.at$('Para','fandoc::DocElem',[],{'sys::Js':""},8192,Para);
Pre.type$ = p.at$('Pre','fandoc::DocElem',[],{'sys::Js':""},8192,Pre);
BlockQuote.type$ = p.at$('BlockQuote','fandoc::DocElem',[],{'sys::Js':""},8192,BlockQuote);
OrderedList.type$ = p.at$('OrderedList','fandoc::DocElem',[],{'sys::Js':""},8192,OrderedList);
OrderedListStyle.type$ = p.at$('OrderedListStyle','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,OrderedListStyle);
UnorderedList.type$ = p.at$('UnorderedList','fandoc::DocElem',[],{'sys::Js':""},8192,UnorderedList);
ListItem.type$ = p.at$('ListItem','fandoc::DocElem',[],{'sys::Js':""},8192,ListItem);
Emphasis.type$ = p.at$('Emphasis','fandoc::DocElem',[],{'sys::Js':""},8192,Emphasis);
Strong.type$ = p.at$('Strong','fandoc::DocElem',[],{'sys::Js':""},8192,Strong);
Code.type$ = p.at$('Code','fandoc::DocElem',[],{'sys::Js':""},8192,Code);
Link.type$ = p.at$('Link','fandoc::DocElem',[],{'sys::Js':""},8192,Link);
Image.type$ = p.at$('Image','fandoc::DocElem',[],{'sys::Js':""},8192,Image);
Hr.type$ = p.at$('Hr','fandoc::DocElem',[],{'sys::Js':""},8192,Hr);
HtmlDocWriter.type$ = p.at$('HtmlDocWriter','sys::Obj',['fandoc::DocWriter'],{'sys::Js':""},8192,HtmlDocWriter);
MarkdownDocWriter.type$ = p.at$('MarkdownDocWriter','sys::Obj',['fandoc::DocWriter'],{'sys::Js':""},8192,MarkdownDocWriter);
FandocTest.type$ = p.at$('FandocTest','sys::Test',[],{'sys::Js':""},8192,FandocTest);
PathTest.type$ = p.at$('PathTest','sys::Test',[],{'sys::Js':""},8192,PathTest);
MarkdownTest.type$ = p.at$('MarkdownTest','sys::Test',[],{'sys::Js':""},8192,MarkdownTest);
FandocErr.type$.af$('file',73730,'sys::Str',{}).af$('line',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('file','sys::Str',false),new sys.Param('line','sys::Int',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{});
DocWriter.type$.am$('docStart',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','fandoc::Doc',false)]),{}).am$('docEnd',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','fandoc::Doc',false)]),{}).am$('elemStart',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::DocElem',false)]),{}).am$('elemEnd',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::DocElem',false)]),{}).am$('text',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('text','fandoc::DocText',false)]),{});
FandocDocWriter.type$.af$('onLink',73728,'|fandoc::Link->sys::Void|?',{}).af$('onImage',73728,'|fandoc::Image->sys::Void|?',{}).af$('out',67584,'sys::OutStream',{}).af$('listIndexes',67584,'fandoc::ListIndex[]',{}).af$('inBlockquote',67584,'sys::Bool',{}).af$('inPre',67584,'sys::Bool',{}).af$('inListItem',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('docStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','fandoc::Doc',false)]),{}).am$('docEnd',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','fandoc::Doc',false)]),{}).am$('elemStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::DocElem',false)]),{}).am$('elemEnd',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::DocElem',false)]),{}).am$('text',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('text','fandoc::DocText',false)]),{});
ListIndex.type$.af$('romans',100354,'[sys::Int:sys::Str]',{}).af$('style',73728,'fandoc::OrderedListStyle?',{}).af$('index',73728,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('style','fandoc::OrderedListStyle?',true)]),{}).am$('increment',8192,'sys::This',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('toB26',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('int','sys::Int',false)]),{}).am$('toRoman',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('int','sys::Int',false)]),{}).am$('sortr',34818,'[sys::Int:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('unordered','[sys::Int:sys::Str]',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
InlineParser.type$.af$('parent',67584,'fandoc::FandocParser',{}).af$('src',67584,'sys::StrBuf',{}).af$('line',67584,'sys::Int',{}).af$('pos',67584,'sys::Int',{}).af$('last',67584,'sys::Int',{}).af$('cur',67584,'sys::Int',{}).af$('peek',67584,'sys::Int',{}).af$('stack',67584,'fandoc::DocNode[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','fandoc::FandocParser',false),new sys.Param('src','sys::StrBuf',false),new sys.Param('startLine','sys::Int',false)]),{}).am$('parse',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','fandoc::DocElem',false)]),{}).am$('segment',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','fandoc::DocElem',false)]),{}).am$('isTextEnd',2048,'sys::Bool',xp,{}).am$('text',2048,'fandoc::DocText',xp,{}).am$('code',2048,'fandoc::DocNode',xp,{}).am$('emphasis',2048,'fandoc::DocNode',xp,{}).am$('strong',2048,'fandoc::DocNode',xp,{}).am$('link',2048,'fandoc::DocNode',xp,{}).am$('annotation',2048,'fandoc::DocNode?',sys.List.make(sys.Param.type$,[new sys.Param('parent','fandoc::DocElem',false)]),{}).am$('image',2048,'fandoc::DocNode',xp,{}).am$('uri',2048,'sys::Str',xp,{}).am$('brackets',2048,'sys::Str',xp,{}).am$('err',8192,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('consume',2048,'sys::Void',xp,{}).am$('peekPeek',2048,'sys::Int',xp,{}).am$('debug',2048,'sys::Str',xp,{});
FandocParser.type$.af$('silent',73728,'sys::Bool',{}).af$('errs',73728,'fandoc::FandocErr[]',{}).af$('parseHeader',73728,'sys::Bool',{}).af$('filename',65664,'sys::Str',{}).af$('lines',67584,'sys::Str[]?',{}).af$('numLines',67584,'sys::Int',{}).af$('lineIndex',67584,'sys::Int',{}).af$('cur',67584,'sys::Str?',{}).af$('peek',67584,'sys::Str?',{}).af$('curt',67584,'fandoc::LineType?',{}).af$('peekt',67584,'fandoc::LineType?',{}).af$('curLine',67584,'sys::Int',{}).af$('curIndent',67584,'sys::Int',{}).af$('peekIndent',67584,'sys::Int',{}).af$('curStart',67584,'sys::Int',{}).af$('peekStart',67584,'sys::Int',{}).am$('parse',8192,'fandoc::Doc',sys.List.make(sys.Param.type$,[new sys.Param('filename','sys::Str',false),new sys.Param('in','sys::InStream',false),new sys.Param('close','sys::Bool',true)]),{}).am$('parseStr',8192,'fandoc::Doc',sys.List.make(sys.Param.type$,[new sys.Param('plaintext','sys::Str',false)]),{}).am$('header',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','fandoc::Doc',false)]),{}).am$('topBlock',2048,'fandoc::DocElem',xp,{}).am$('heading',2048,'fandoc::DocElem',xp,{}).am$('block',2048,'fandoc::DocElem',sys.List.make(sys.Param.type$,[new sys.Param('indent','sys::Int',false)]),{}).am$('para',2048,'fandoc::DocElem',xp,{}).am$('blockquote',2048,'fandoc::DocElem',xp,{}).am$('preExplicit',2048,'fandoc::DocElem',xp,{}).am$('pre',2048,'fandoc::DocElem',xp,{}).am$('hr',2048,'fandoc::DocElem',xp,{}).am$('ol',2048,'fandoc::DocElem',xp,{}).am$('ul',2048,'fandoc::DocElem',xp,{}).am$('listItems',2048,'fandoc::DocElem',sys.List.make(sys.Param.type$,[new sys.Param('list','fandoc::DocElem',false),new sys.Param('listType','fandoc::LineType',false),new sys.Param('listIndent','sys::Int',false)]),{}).am$('formattedText',2048,'fandoc::DocElem',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::DocElem',false)]),{}).am$('readLines',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('close','sys::Bool',false)]),{}).am$('err',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('line','sys::Int',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('errReport',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','fandoc::FandocErr',false)]),{}).am$('skipBlankLines',2048,'sys::Void',xp,{}).am$('isOrderedListMark',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false),new sys.Param('i','sys::Int',false)]),{}).am$('consume',2048,'sys::Void',xp,{}).am$('main',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',true)]),{}).am$('make',139268,'sys::Void',xp,{});
LineType.type$.af$('eof',106506,'fandoc::LineType',{}).af$('blank',106506,'fandoc::LineType',{}).af$('ul',106506,'fandoc::LineType',{}).af$('ol',106506,'fandoc::LineType',{}).af$('h1',106506,'fandoc::LineType',{}).af$('h2',106506,'fandoc::LineType',{}).af$('h3',106506,'fandoc::LineType',{}).af$('h4',106506,'fandoc::LineType',{}).af$('blockquote',106506,'fandoc::LineType',{}).af$('preStart',106506,'fandoc::LineType',{}).af$('preEnd',106506,'fandoc::LineType',{}).af$('hr',106506,'fandoc::LineType',{}).af$('normal',106506,'fandoc::LineType',{}).af$('vals',106498,'fandoc::LineType[]',{}).am$('isList',8192,'sys::Bool',xp,{}).am$('headingLevel',8192,'sys::Int',xp,{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'fandoc::LineType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DocNodeId.type$.af$('text',106506,'fandoc::DocNodeId',{}).af$('doc',106506,'fandoc::DocNodeId',{}).af$('heading',106506,'fandoc::DocNodeId',{}).af$('para',106506,'fandoc::DocNodeId',{}).af$('pre',106506,'fandoc::DocNodeId',{}).af$('blockQuote',106506,'fandoc::DocNodeId',{}).af$('orderedList',106506,'fandoc::DocNodeId',{}).af$('unorderedList',106506,'fandoc::DocNodeId',{}).af$('listItem',106506,'fandoc::DocNodeId',{}).af$('emphasis',106506,'fandoc::DocNodeId',{}).af$('strong',106506,'fandoc::DocNodeId',{}).af$('code',106506,'fandoc::DocNodeId',{}).af$('link',106506,'fandoc::DocNodeId',{}).af$('image',106506,'fandoc::DocNodeId',{}).af$('hr',106506,'fandoc::DocNodeId',{}).af$('vals',106498,'fandoc::DocNodeId[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'fandoc::DocNodeId?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DocNode.type$.af$('parent',73728,'fandoc::DocElem?',{}).am$('id',270337,'fandoc::DocNodeId',xp,{}).am$('write',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','fandoc::DocWriter',false)]),{}).am$('isInline',270337,'sys::Bool',xp,{}).am$('isBlock',8192,'sys::Bool',xp,{}).am$('dump',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('path',270336,'fandoc::DocNode[]',xp,{}).am$('pos',8192,'sys::Int?',xp,{}).am$('isFirst',8192,'sys::Bool',xp,{}).am$('isLast',8192,'sys::Bool',xp,{}).am$('toText',270337,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
DocText.type$.af$('str',73728,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('id',271360,'fandoc::DocNodeId',xp,{}).am$('write',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','fandoc::DocWriter',false)]),{}).am$('isInline',271360,'sys::Bool',xp,{}).am$('toText',271360,'sys::Str',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
DocElem.type$.af$('kids',67584,'fandoc::DocNode[]',{}).af$('anchorId',73728,'sys::Str?',{}).am$('htmlName',270337,'sys::Str',xp,{}).am$('write',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','fandoc::DocWriter',false)]),{}).am$('writeChildren',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','fandoc::DocWriter',false)]),{}).am$('children',8192,'fandoc::DocNode[]',xp,{}).am$('eachChild',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|fandoc::DocNode->sys::Void|',false)]),{}).am$('addChild',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('node','fandoc::DocNode',false)]),{'sys::Deprecated':"sys::Deprecated{msg=\"Use add()\";}"}).am$('add',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('node','fandoc::DocNode',false)]),{'sys::Operator':""}).am$('insert',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false),new sys.Param('node','fandoc::DocNode',false)]),{}).am$('addAll',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('nodes','fandoc::DocNode[]',false)]),{}).am$('remove',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('node','fandoc::DocNode',false)]),{}).am$('removeAll',8192,'sys::This',xp,{}).am$('toText',271360,'sys::Str',xp,{}).am$('path',9216,'fandoc::DocElem[]',xp,{}).am$('make',139268,'sys::Void',xp,{});
Doc.type$.af$('meta',73728,'[sys::Str:sys::Str]',{}).am$('id',271360,'fandoc::DocNodeId',xp,{}).am$('htmlName',271360,'sys::Str',xp,{}).am$('isInline',271360,'sys::Bool',xp,{}).am$('write',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','fandoc::DocWriter',false)]),{}).am$('findHeadings',8192,'fandoc::Heading[]',xp,{}).am$('doFindHeadings',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','fandoc::Heading[]',false),new sys.Param('elem','fandoc::DocElem',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Heading.type$.af$('level',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('level','sys::Int',false)]),{}).am$('id',271360,'fandoc::DocNodeId',xp,{}).am$('htmlName',271360,'sys::Str',xp,{}).am$('isInline',271360,'sys::Bool',xp,{}).am$('title',8192,'sys::Str',xp,{});
Para.type$.af$('admonition',73728,'sys::Str?',{}).am$('id',271360,'fandoc::DocNodeId',xp,{}).am$('htmlName',271360,'sys::Str',xp,{}).am$('isInline',271360,'sys::Bool',xp,{}).am$('make',139268,'sys::Void',xp,{});
Pre.type$.am$('id',271360,'fandoc::DocNodeId',xp,{}).am$('htmlName',271360,'sys::Str',xp,{}).am$('isInline',271360,'sys::Bool',xp,{}).am$('make',139268,'sys::Void',xp,{});
BlockQuote.type$.am$('id',271360,'fandoc::DocNodeId',xp,{}).am$('htmlName',271360,'sys::Str',xp,{}).am$('isInline',271360,'sys::Bool',xp,{}).am$('make',139268,'sys::Void',xp,{});
OrderedList.type$.af$('style',73728,'fandoc::OrderedListStyle',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('style','fandoc::OrderedListStyle',false)]),{}).am$('id',271360,'fandoc::DocNodeId',xp,{}).am$('htmlName',271360,'sys::Str',xp,{}).am$('isInline',271360,'sys::Bool',xp,{});
OrderedListStyle.type$.af$('number',106506,'fandoc::OrderedListStyle',{}).af$('upperAlpha',106506,'fandoc::OrderedListStyle',{}).af$('lowerAlpha',106506,'fandoc::OrderedListStyle',{}).af$('upperRoman',106506,'fandoc::OrderedListStyle',{}).af$('lowerRoman',106506,'fandoc::OrderedListStyle',{}).af$('vals',106498,'fandoc::OrderedListStyle[]',{}).am$('htmlType',8192,'sys::Str',xp,{}).am$('fromFirstChar',40962,'fandoc::OrderedListStyle',sys.List.make(sys.Param.type$,[new sys.Param('ch','sys::Int',false)]),{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'fandoc::OrderedListStyle?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
UnorderedList.type$.am$('id',271360,'fandoc::DocNodeId',xp,{}).am$('htmlName',271360,'sys::Str',xp,{}).am$('isInline',271360,'sys::Bool',xp,{}).am$('make',139268,'sys::Void',xp,{});
ListItem.type$.am$('id',271360,'fandoc::DocNodeId',xp,{}).am$('htmlName',271360,'sys::Str',xp,{}).am$('isInline',271360,'sys::Bool',xp,{}).am$('make',139268,'sys::Void',xp,{});
Emphasis.type$.am$('id',271360,'fandoc::DocNodeId',xp,{}).am$('htmlName',271360,'sys::Str',xp,{}).am$('isInline',271360,'sys::Bool',xp,{}).am$('make',139268,'sys::Void',xp,{});
Strong.type$.am$('id',271360,'fandoc::DocNodeId',xp,{}).am$('htmlName',271360,'sys::Str',xp,{}).am$('isInline',271360,'sys::Bool',xp,{}).am$('make',139268,'sys::Void',xp,{});
Code.type$.am$('id',271360,'fandoc::DocNodeId',xp,{}).am$('htmlName',271360,'sys::Str',xp,{}).am$('isInline',271360,'sys::Bool',xp,{}).am$('make',139268,'sys::Void',xp,{});
Link.type$.af$('isCode',73728,'sys::Bool',{}).af$('uri',73728,'sys::Str',{}).af$('line',73728,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Str',false)]),{}).am$('id',271360,'fandoc::DocNodeId',xp,{}).am$('htmlName',271360,'sys::Str',xp,{}).am$('isInline',271360,'sys::Bool',xp,{}).am$('isTextUri',8192,'sys::Bool',xp,{}).am$('setText',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('text','sys::Str',false)]),{});
Image.type$.af$('uri',73728,'sys::Str',{}).af$('alt',73728,'sys::Str',{}).af$('size',73728,'sys::Str?',{}).af$('line',73728,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Str',false),new sys.Param('alt','sys::Str',false)]),{}).am$('id',271360,'fandoc::DocNodeId',xp,{}).am$('htmlName',271360,'sys::Str',xp,{}).am$('isInline',271360,'sys::Bool',xp,{});
Hr.type$.am$('id',271360,'fandoc::DocNodeId',xp,{}).am$('htmlName',271360,'sys::Str',xp,{}).am$('isInline',271360,'sys::Bool',xp,{}).am$('make',139268,'sys::Void',xp,{});
HtmlDocWriter.type$.af$('onLink',73728,'|fandoc::Link->sys::Void|?',{}).af$('onImage',73728,'|fandoc::Image->sys::Void|?',{}).af$('out',73728,'sys::OutStream',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('docStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','fandoc::Doc',false)]),{}).am$('docHead',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','fandoc::Doc',false)]),{}).am$('docEnd',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','fandoc::Doc',false)]),{}).am$('elemStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::DocElem',false)]),{}).am$('elemEnd',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::DocElem',false)]),{}).am$('text',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('text','fandoc::DocText',false)]),{}).am$('attr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Str',false)]),{}).am$('safeAttr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('safeText',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{'sys::NoDoc':""});
MarkdownDocWriter.type$.af$('onLink',73728,'|fandoc::Link->sys::Void|?',{}).af$('onImage',73728,'|fandoc::Image->sys::Void|?',{}).af$('ulSymbols',100354,'sys::Str[]',{}).af$('indDef',100354,'sys::Int',{}).af$('indCode',100354,'sys::Int',{}).af$('out',67584,'sys::OutStream',{}).af$('listIndexes',67584,'fandoc::ListIndex[]',{}).af$('inPre',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('docStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','fandoc::Doc',false)]),{}).am$('docEnd',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','fandoc::Doc',false)]),{}).am$('elemStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::DocElem',false)]),{}).am$('elemEnd',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::DocElem',false)]),{}).am$('text',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('text','fandoc::DocText',false)]),{}).am$('liSymbol',2048,'sys::Str',xp,{}).am$('inListItem',2048,'sys::Bool',xp,{}).am$('main',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
FandocTest.type$.am$('testEmphasis',8192,'sys::Void',xp,{}).am$('testEmphasisErr',8192,'sys::Void',xp,{}).am$('testCode',8192,'sys::Void',xp,{}).am$('testLinks',8192,'sys::Void',xp,{}).am$('testImage',8192,'sys::Void',xp,{}).am$('testAnchorIds',8192,'sys::Void',xp,{}).am$('testPara',8192,'sys::Void',xp,{}).am$('testPre',8192,'sys::Void',xp,{}).am$('testPreExplicit',8192,'sys::Void',xp,{}).am$('testHeadings',8192,'sys::Void',xp,{}).am$('testHr',8192,'sys::Void',xp,{}).am$('testBlockQuotes',8192,'sys::Void',xp,{}).am$('testUL',8192,'sys::Void',xp,{}).am$('testOL',8192,'sys::Void',xp,{}).am$('testMeta',8192,'sys::Void',xp,{}).am$('testErrs',8192,'sys::Void',xp,{}).am$('verifyErrs',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('expected','sys::Obj[]',false),new sys.Param('errs','sys::Obj[]',false)]),{}).am$('testToB26',8192,'sys::Void',xp,{}).am$('testToRoman',8192,'sys::Void',xp,{}).am$('verifyDoc',8192,'fandoc::Doc',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('expected','sys::Obj[]',false)]),{}).am$('verifyDocNode',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('actual','fandoc::DocElem',false),new sys.Param('expected','sys::Obj[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
PathTest.type$.am$('testPara',8192,'sys::Void',xp,{}).am$('testHeading',8192,'sys::Void',xp,{}).am$('testCode',8192,'sys::Void',xp,{}).am$('testLinks',8192,'sys::Void',xp,{}).am$('testImages',8192,'sys::Void',xp,{}).am$('testEmphasis',8192,'sys::Void',xp,{}).am$('testPre',8192,'sys::Void',xp,{}).am$('testBlockQuotes',8192,'sys::Void',xp,{}).am$('verifyPath',8192,'fandoc::Doc',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('childIndices','sys::Int[]',false),new sys.Param('expected','fandoc::DocNodeId[]',false)]),{}).am$('testPositions',8192,'sys::Void',xp,{}).am$('testInsert',8192,'sys::Void',xp,{}).am$('parse',8192,'fandoc::Doc',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
MarkdownTest.type$.af$('fandocCheatsheet',73728,'sys::Str',{}).af$('markdownCheatsheet',73728,'sys::Str',{}).am$('testFandoc',8192,'sys::Void',xp,{}).am$('testMarkdown',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "fandoc");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0");
m.set("pod.summary", "Fandoc parser and DOM");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:20-05:00 New_York");
m.set("build.tsKey", "241210143120");
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
  FandocErr,
  DocWriter,
  FandocDocWriter,
  FandocParser,
  DocNodeId,
  DocNode,
  DocText,
  DocElem,
  Doc,
  Heading,
  Para,
  Pre,
  BlockQuote,
  OrderedList,
  OrderedListStyle,
  UnorderedList,
  ListItem,
  Emphasis,
  Strong,
  Code,
  Link,
  Image,
  Hr,
  HtmlDocWriter,
  MarkdownDocWriter,
  FandocTest,
  PathTest,
  MarkdownTest,
};
