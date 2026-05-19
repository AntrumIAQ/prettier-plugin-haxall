// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class HtmlSyntaxWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HtmlSyntaxWriter.type$; }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  static make(out) {
    const $self = new HtmlSyntaxWriter();
    HtmlSyntaxWriter.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    if (out === undefined) out = sys.Env.cur().out();
    $self.#out = out;
    return;
  }

  close() {
    return this.#out.close();
  }

  writeDoc(doc) {
    this.#out.print("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"\n \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns='http://www.w3.org/1999/xhtml'>\n<head>\n  <title>Source</title>\n   <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>\n   <style type='text/css'>\n     body { margin:1em; padding:0; }\n     pre { font:9pt Monaco, \"Courier New\", monospace; }\n     b   { color:#f00; font-weight:normal; }\n     i   { color:#00f; font-style:normal; }\n     em  { color:#077; font-style:normal; }\n     q   { color:#070; font-style:normal; }\n     q:before, q:after { content: \"\"; }\n</style>\n</head>\n<body>");
    this.writeLines(doc);
    this.#out.print("</body></html>");
    return this;
  }

  writeLines(doc) {
    const this$ = this;
    this.#out.printLine("<pre>");
    doc.eachLine((line) => {
      this$.writeLine(line);
      return;
    });
    this.#out.printLine("</pre>");
    return this;
  }

  writeLine(line) {
    const this$ = this;
    this.#out.print("<span id='line").print(sys.ObjUtil.coerce(line.num(), sys.Obj.type$.toNullable())).print("'>");
    line.eachSegment((type,text) => {
      if (type.html() != null) {
        this$.#out.print("<").print(type.html()).print(">");
      }
      ;
      this$.#out.writeXml(text);
      if (type.html() != null) {
        this$.#out.print("</").print(type.html()).print(">");
      }
      ;
      return;
    });
    this.#out.print("</span>\n");
    return this;
  }

}

class SyntaxParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#tabsToSpaces = 2;
    return;
  }

  typeof() { return SyntaxParser.type$; }

  #tabsToSpaces = 0;

  tabsToSpaces(it) {
    if (it === undefined) {
      return this.#tabsToSpaces;
    }
    else {
      this.#tabsToSpaces = it;
      return;
    }
  }

  #rules = null;

  // private field reflection only
  __rules(it) { if (it === undefined) return this.#rules; else this.#rules = it; }

  #tokenizer = null;

  // private field reflection only
  __tokenizer(it) { if (it === undefined) return this.#tokenizer; else this.#tokenizer = it; }

  static make(rules) {
    const $self = new SyntaxParser();
    SyntaxParser.make$($self,rules);
    return $self;
  }

  static make$($self,rules) {
    ;
    $self.#rules = rules;
    $self.#tokenizer = LineTokenizer.make(rules);
    return;
  }

  parse(in$) {
    let doc = SyntaxDoc.make(this.#rules);
    let tail = null;
    let num = 1;
    while (true) {
      let text = in$.readLine();
      if (text == null) {
        break;
      }
      ;
      let line = this.parseLine(((this$) => { let $_u0 = num;num = sys.Int.increment(num); return $_u0; })(this), sys.ObjUtil.coerce(text, sys.Str.type$));
      if (tail == null) {
        doc.lines(line);
      }
      else {
        tail.next(line);
      }
      ;
      (tail = line);
    }
    ;
    return doc;
  }

  parseLine(num,lineText) {
    const this$ = this;
    let line = SyntaxLine.make(num);
    try {
      if (sys.ObjUtil.compareNE(this.#tabsToSpaces, 0)) {
        (lineText = SyntaxParser.convertTabsToSpaces(lineText, this.#tabsToSpaces));
      }
      ;
      this.#tokenizer.tokenizeLine(lineText, (type,text) => {
        line.segments().add(type).add(text);
        return;
      });
    }
    catch ($_u1) {
      $_u1 = sys.Err.make($_u1);
      if ($_u1 instanceof sys.Err) {
        let e = $_u1;
        ;
        e.trace();
        line.segments(sys.List.make(sys.Obj.type$, [SyntaxType.text(), lineText]));
      }
      else {
        throw $_u1;
      }
    }
    ;
    return line;
  }

  static convertTabsToSpaces(text,ts) {
    const this$ = this;
    if (!sys.Str.contains(text, "\t")) {
      return text;
    }
    ;
    let s = sys.StrBuf.make();
    sys.Str.each(text, (ch) => {
      if (sys.ObjUtil.equals(ch, 9)) {
        s.add(sys.Str.spaces(sys.Int.minus(ts, sys.Int.mod(s.size(), ts))));
      }
      else {
        s.addChar(ch);
      }
      ;
      return;
    });
    return s.toStr();
  }

}

class LineTokenizer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LineTokenizer.type$; }

  #rules = null;

  // private field reflection only
  __rules(it) { if (it === undefined) return this.#rules; else this.#rules = it; }

  #brackets = null;

  // private field reflection only
  __brackets(it) { if (it === undefined) return this.#brackets; else this.#brackets = it; }

  #keywordPrefixes = null;

  // private field reflection only
  __keywordPrefixes(it) { if (it === undefined) return this.#keywordPrefixes; else this.#keywordPrefixes = it; }

  #keywords = null;

  // private field reflection only
  __keywords(it) { if (it === undefined) return this.#keywords; else this.#keywords = it; }

  #comments = null;

  // private field reflection only
  __comments(it) { if (it === undefined) return this.#comments; else this.#comments = it; }

  #commentStart = null;

  // private field reflection only
  __commentStart(it) { if (it === undefined) return this.#commentStart; else this.#commentStart = it; }

  #commentEnd = null;

  // private field reflection only
  __commentEnd(it) { if (it === undefined) return this.#commentEnd; else this.#commentEnd = it; }

  #strs = null;

  // private field reflection only
  __strs(it) { if (it === undefined) return this.#strs; else this.#strs = it; }

  #inComment = 0;

  // private field reflection only
  __inComment(it) { if (it === undefined) return this.#inComment; else this.#inComment = it; }

  #inStr = null;

  // private field reflection only
  __inStr(it) { if (it === undefined) return this.#inStr; else this.#inStr = it; }

  #line = null;

  // private field reflection only
  __line(it) { if (it === undefined) return this.#line; else this.#line = it; }

  #lineSize = 0;

  // private field reflection only
  __lineSize(it) { if (it === undefined) return this.#lineSize; else this.#lineSize = it; }

  #pos = 0;

  // private field reflection only
  __pos(it) { if (it === undefined) return this.#pos; else this.#pos = it; }

  #cur = 0;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #peek = 0;

  // private field reflection only
  __peek(it) { if (it === undefined) return this.#peek; else this.#peek = it; }

  static make(rules) {
    const $self = new LineTokenizer();
    LineTokenizer.make$($self,rules);
    return $self;
  }

  static make$($self,rules) {
    const this$ = $self;
    $self.#rules = rules;
    $self.#brackets = rules.brackets();
    $self.#keywords = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")), (it) => {
      it.def(sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()));
      return;
    }), sys.Type.find("[sys::Str:sys::Bool]"));
    $self.#keywordPrefixes = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("sys::Bool")), (it) => {
      it.def(sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()));
      return;
    }), sys.Type.find("[sys::Int:sys::Bool]"));
    if (rules.keywords() != null) {
      rules.keywords().each((k) => {
        this$.#keywords.set(k, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
        this$.#keywordPrefixes.set(sys.ObjUtil.coerce(sys.Int.or(sys.Int.shiftl(sys.Str.get(k, 0), 16), sys.Str.get(k, 1)), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
        return;
      });
    }
    ;
    $self.#comments = sys.List.make(Matcher.type$);
    ((this$) => { let $_u2 = rules.comments(); if ($_u2 == null) return null; return rules.comments().each((s) => {
      this$.#comments.add(this$.toMatcher(s));
      return;
    }); })($self);
    $self.#commentStart = $self.toMatcher(rules.blockCommentStart());
    $self.#commentEnd = $self.toMatcher(rules.blockCommentEnd());
    $self.#strs = sys.List.make(StrMatch.type$);
    if (rules.strs() != null) {
      rules.strs().each((s) => {
        this$.#strs.add(this$.toStrMatch(s));
        return;
      });
    }
    ;
    return;
  }

  tokenizeLine(line,f) {
    this.#line = line;
    this.#lineSize = sys.Str.size(line);
    this.#pos = 0;
    if (sys.ObjUtil.compareGT(this.#lineSize, 0)) {
      this.#cur = sys.Str.get(line, 0);
    }
    ;
    if (sys.ObjUtil.compareGT(this.#lineSize, 1)) {
      this.#peek = sys.Str.get(line, 1);
    }
    ;
    let textStart = 0;
    while (sys.ObjUtil.compareNE(this.#cur, 0)) {
      let thisStart = this.#pos;
      let type = this.next();
      if (sys.ObjUtil.equals(type, SyntaxType.text())) {
        continue;
      }
      ;
      if (sys.ObjUtil.compareLT(textStart, thisStart)) {
        sys.Func.call(f, SyntaxType.text(), sys.Str.getRange(line, sys.Range.make(textStart, thisStart, true)));
      }
      ;
      sys.Func.call(f, type, sys.Str.getRange(line, sys.Range.make(thisStart, this.#pos, true)));
      (textStart = this.#pos);
    }
    ;
    if (sys.ObjUtil.compareLT(textStart, sys.Str.size(line))) {
      sys.Func.call(f, SyntaxType.text(), sys.Str.getRange(line, sys.Range.make(textStart, sys.Str.size(line), true)));
    }
    ;
    return;
  }

  next() {
    if (this.#inStr != null) {
      return this.strLiteral(sys.ObjUtil.coerce(this.#inStr, StrMatch.type$));
    }
    ;
    if ((sys.ObjUtil.compareGT(this.#inComment, 0) || this.#commentStart.isMatch())) {
      return this.blockComment();
    }
    ;
    for (let i = 0; sys.ObjUtil.compareLT(i, this.#comments.size()); i = sys.Int.increment(i)) {
      if (this.#comments.get(i).isMatch()) {
        this.#cur = 0;
        this.#pos = sys.Str.size(this.#line);
        return SyntaxType.comment();
      }
      ;
    }
    ;
    if ((sys.ObjUtil.coerce(this.#keywordPrefixes.get(sys.ObjUtil.coerce(sys.Int.or(sys.Int.shiftl(this.#cur, 16), this.#peek), sys.Obj.type$.toNullable())), sys.Bool.type$) && (sys.ObjUtil.equals(this.#pos, 0) || !sys.Int.isAlphaNum(sys.Str.get(this.#line, sys.Int.minus(this.#pos, 1)))))) {
      let start = this.#pos;
      this.consume();
      this.consume();
      while ((sys.Int.isAlphaNum(this.#cur) || sys.ObjUtil.equals(this.#cur, 95))) {
        this.consume();
      }
      ;
      let word = sys.Str.getRange(this.#line, sys.Range.make(start, this.#pos, true));
      if (sys.ObjUtil.coerce(this.#keywords.get(word), sys.Bool.type$)) {
        return SyntaxType.keyword();
      }
      ;
      return SyntaxType.text();
    }
    ;
    for (let i = 0; sys.ObjUtil.compareLT(i, this.#strs.size()); i = sys.Int.increment(i)) {
      if (this.#strs.get(i).start().isMatch()) {
        return this.strLiteral(this.#strs.get(i));
      }
      ;
    }
    ;
    if (sys.Str.containsChar(this.#brackets, this.#cur)) {
      this.consume();
      return SyntaxType.bracket();
    }
    ;
    this.consume();
    return SyntaxType.text();
  }

  blockComment() {
    while (sys.ObjUtil.compareNE(this.#cur, 0)) {
      if (this.#commentStart.isMatch()) {
        this.#commentStart.consume();
        this.#inComment = sys.Int.increment(this.#inComment);
        if (!this.#rules.blockCommentsNest()) {
          this.#inComment = 1;
        }
        ;
      }
      ;
      if (this.#commentEnd.isMatch()) {
        this.#commentEnd.consume();
        this.#inComment = sys.Int.decrement(this.#inComment);
      }
      ;
      if (sys.ObjUtil.compareLE(this.#inComment, 0)) {
        break;
      }
      ;
      this.consume();
    }
    ;
    return SyntaxType.comment();
  }

  strLiteral(s) {
    if (this.#inStr !== s) {
      s.start().consume();
    }
    ;
    while (sys.ObjUtil.compareNE(this.#cur, 0)) {
      if ((s.end().isMatch() && sys.Int.isEven(this.countEscapes(s.escape())))) {
        s.end().consume();
        this.#inStr = null;
        return SyntaxType.literal();
      }
      ;
      this.consume();
    }
    ;
    if (s.multiLine()) {
      this.#inStr = s;
    }
    ;
    return SyntaxType.literal();
  }

  toStrMatch(s) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(StrMatch.make(), (it) => {
      it.start(this$.toMatcher(s.delimiter(), s.escape()));
      it.end(this$.toMatcher(((this$) => { let $_u3 = s.delimiterEnd(); if ($_u3 != null) return $_u3; return s.delimiter(); })(this$), s.escape()));
      it.escape(s.escape());
      it.multiLine(s.multiLine());
      return;
    }), StrMatch.type$);
  }

  toMatcher(tok,esc) {
    if (esc === undefined) esc = 0;
    const this$ = this;
    (tok = ((this$) => { let $_u4 = ((this$) => { let $_u5 = tok; if ($_u5 == null) return null; return sys.Str.trim(tok); })(this$); if ($_u4 != null) return $_u4; return ""; })(this));
    let $_u6 = sys.Str.size(tok);
    if (sys.ObjUtil.equals($_u6, 0)) {
      return Matcher.make(0, () => {
        return this$.noMatch();
      }, () => {
        return;
      });
    }
    else if (sys.ObjUtil.equals($_u6, 1)) {
      if (sys.ObjUtil.compareGT(esc, 0)) {
        return Matcher.make(1, () => {
          return this$.match1Esc(sys.Str.get(tok, 0), esc);
        }, () => {
          this$.consume();
          return;
        });
      }
      else {
        return Matcher.make(1, () => {
          return this$.match1(sys.Str.get(tok, 0));
        }, () => {
          this$.consume();
          return;
        });
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u6, 2)) {
      if (sys.ObjUtil.compareGT(esc, 0)) {
        return Matcher.make(2, () => {
          return this$.match2Esc(sys.Str.get(tok, 0), sys.Str.get(tok, 1), esc);
        }, () => {
          this$.consume();
          this$.consume();
          return;
        });
      }
      else {
        return Matcher.make(2, () => {
          return this$.match2(sys.Str.get(tok, 0), sys.Str.get(tok, 1));
        }, () => {
          this$.consume();
          this$.consume();
          return;
        });
      }
      ;
    }
    else {
      return Matcher.make(sys.Str.size(tok), () => {
        return this$.matchN(sys.ObjUtil.coerce(tok, sys.Str.type$));
      }, () => {
        this$.consumeN(sys.Str.size(tok));
        return;
      });
    }
    ;
  }

  noMatch() {
    return false;
  }

  match1(ch1) {
    return sys.ObjUtil.equals(this.#cur, ch1);
  }

  match2(ch1,ch2) {
    return (sys.ObjUtil.equals(this.#cur, ch1) && sys.ObjUtil.equals(this.#peek, ch2));
  }

  match1Esc(ch1,esc) {
    return (sys.ObjUtil.equals(this.#cur, ch1) && sys.Int.isEven(this.countEscapes(esc)));
  }

  match2Esc(ch1,ch2,esc) {
    return (sys.ObjUtil.equals(this.#cur, ch1) && sys.ObjUtil.equals(this.#peek, ch2) && sys.Int.isEven(this.countEscapes(esc)));
  }

  matchN(chars) {
    try {
      if ((sys.ObjUtil.compareNE(this.#cur, sys.Str.get(chars, 0)) || sys.ObjUtil.compareNE(this.#peek, sys.Str.get(chars, 1)))) {
        return false;
      }
      ;
      for (let i = 2; sys.ObjUtil.compareLT(i, sys.Str.size(chars)); i = sys.Int.increment(i)) {
        if (sys.ObjUtil.compareNE(sys.Str.get(chars, i), sys.Str.get(this.#line, sys.Int.plus(this.#pos, i)))) {
          return false;
        }
        ;
      }
      ;
      return true;
    }
    catch ($_u7) {
      $_u7 = sys.Err.make($_u7);
      if ($_u7 instanceof sys.Err) {
        let e = $_u7;
        ;
        return false;
      }
      else {
        throw $_u7;
      }
    }
    ;
  }

  countEscapes(esc) {
    let n = 0;
    while (sys.ObjUtil.equals(sys.Str.get(this.#line, sys.Int.minus(sys.Int.minus(this.#pos, n), 1)), esc)) {
      ((this$) => { let $_u8 = n;n = sys.Int.increment(n); return $_u8; })(this);
    }
    ;
    return n;
  }

  consume() {
    this.#cur = this.#peek;
    ((this$) => { let $_u9 = this$.#pos;this$.#pos = sys.Int.increment(this$.#pos); return $_u9; })(this);
    if (sys.ObjUtil.compareGE(this.#pos, this.#lineSize)) {
      this.#pos = this.#lineSize;
    }
    ;
    if (sys.ObjUtil.compareLT(sys.Int.plus(this.#pos, 1), sys.Str.size(this.#line))) {
      this.#peek = sys.Str.get(this.#line, sys.Int.plus(this.#pos, 1));
    }
    else {
      this.#peek = 0;
    }
    ;
    return;
  }

  consumeN(n) {
    for (; sys.ObjUtil.compareGT(n, 0); n = sys.Int.decrement(n)) {
      this.consume();
    }
    ;
    return;
  }

}

class Matcher extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Matcher.type$; }

  #matchFunc = null;

  matchFunc(it) {
    if (it === undefined) {
      return this.#matchFunc;
    }
    else {
      this.#matchFunc = it;
      return;
    }
  }

  #consumeFunc = null;

  consumeFunc(it) {
    if (it === undefined) {
      return this.#consumeFunc;
    }
    else {
      this.#consumeFunc = it;
      return;
    }
  }

  #size = 0;

  size() { return this.#size; }

  __size(it) { if (it === undefined) return this.#size; else this.#size = it; }

  static make(sz,m,c) {
    const $self = new Matcher();
    Matcher.make$($self,sz,m,c);
    return $self;
  }

  static make$($self,sz,m,c) {
    $self.#size = sz;
    $self.#matchFunc = m;
    $self.#consumeFunc = c;
    return;
  }

  isMatch() {
    return sys.Func.call(this.#matchFunc);
  }

  consume() {
    sys.Func.call(this.#consumeFunc);
    return;
  }

}

class StrMatch extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StrMatch.type$; }

  #start = null;

  start(it) {
    if (it === undefined) {
      return this.#start;
    }
    else {
      this.#start = it;
      return;
    }
  }

  #end = null;

  end(it) {
    if (it === undefined) {
      return this.#end;
    }
    else {
      this.#end = it;
      return;
    }
  }

  #escape = 0;

  escape(it) {
    if (it === undefined) {
      return this.#escape;
    }
    else {
      this.#escape = it;
      return;
    }
  }

  #multiLine = false;

  multiLine(it) {
    if (it === undefined) {
      return this.#multiLine;
    }
    else {
      this.#multiLine = it;
      return;
    }
  }

  static make() {
    const $self = new StrMatch();
    StrMatch.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class SyntaxRules extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#brackets = "(){}[]";
    this.#blockCommentsNest = false;
    return;
  }

  typeof() { return SyntaxRules.type$; }

  #brackets = null;

  brackets() { return this.#brackets; }

  __brackets(it) { if (it === undefined) return this.#brackets; else this.#brackets = it; }

  #keywords = null;

  keywords() { return this.#keywords; }

  __keywords(it) { if (it === undefined) return this.#keywords; else this.#keywords = it; }

  #comments = null;

  comments() { return this.#comments; }

  __comments(it) { if (it === undefined) return this.#comments; else this.#comments = it; }

  #strs = null;

  strs() { return this.#strs; }

  __strs(it) { if (it === undefined) return this.#strs; else this.#strs = it; }

  #blockCommentStart = null;

  blockCommentStart() { return this.#blockCommentStart; }

  __blockCommentStart(it) { if (it === undefined) return this.#blockCommentStart; else this.#blockCommentStart = it; }

  #blockCommentEnd = null;

  blockCommentEnd() { return this.#blockCommentEnd; }

  __blockCommentEnd(it) { if (it === undefined) return this.#blockCommentEnd; else this.#blockCommentEnd = it; }

  #blockCommentsNest = false;

  blockCommentsNest() { return this.#blockCommentsNest; }

  __blockCommentsNest(it) { if (it === undefined) return this.#blockCommentsNest; else this.#blockCommentsNest = it; }

  static loadForExt(ext) {
    let props = SyntaxRules.type$.pod().props(sys.Uri.fromStr("ext.props"), sys.Duration.fromStr("1min"));
    let ruleName = props.get(ext);
    if (ruleName == null) {
      return null;
    }
    ;
    let file = sys.Env.cur().findFile(sys.Str.toUri(sys.Str.plus(sys.Str.plus("etc/syntax/syntax-", ruleName), ".fog")), false);
    if (file == null) {
      return null;
    }
    ;
    return sys.ObjUtil.coerce(file.readObj(), SyntaxRules.type$.toNullable());
  }

  static loadForFile(file,firstLine) {
    if (firstLine === undefined) firstLine = null;
    let rules = SyntaxRules.loadForExt(sys.ObjUtil.coerce(((this$) => { let $_u10 = file.ext(); if ($_u10 != null) return $_u10; return "not.found"; })(this), sys.Str.type$));
    if (rules != null) {
      return rules;
    }
    ;
    if (firstLine == null) {
      let in$ = file.in();
      try {
        (firstLine = ((this$) => { let $_u11 = in$.readLine(); if ($_u11 != null) return $_u11; return ""; })(this));
      }
      finally {
        in$.close();
      }
      ;
    }
    ;
    if ((sys.Str.startsWith(firstLine, "#!") || sys.Str.startsWith(firstLine, "# !"))) {
      let toks = sys.Str.split(sys.Str.getRange(firstLine, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sys.Str.index(firstLine, "!"), sys.Int.type$), 1), -1)));
      let cmd = sys.Str.lower(sys.Str.split(toks.get(0), sys.ObjUtil.coerce(47, sys.Int.type$.toNullable())).last());
      if ((sys.ObjUtil.equals(cmd, "env") && sys.ObjUtil.compareGT(toks.size(), 1))) {
        (cmd = sys.Str.lower(sys.Str.split(toks.get(1), sys.ObjUtil.coerce(47, sys.Int.type$.toNullable())).last()));
      }
      ;
      (rules = SyntaxRules.loadForExt(cmd));
      if (rules != null) {
        return rules;
      }
      ;
    }
    ;
    return null;
  }

  static make(f) {
    const $self = new SyntaxRules();
    SyntaxRules.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    ;
    if (f != null) {
      sys.Func.call(f, $self);
    }
    ;
    return;
  }

}

class SyntaxStr extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#delimiter = "\"";
    this.#multiLine = false;
    return;
  }

  typeof() { return SyntaxStr.type$; }

  #delimiter = null;

  delimiter() { return this.#delimiter; }

  __delimiter(it) { if (it === undefined) return this.#delimiter; else this.#delimiter = it; }

  #delimiterEnd = null;

  delimiterEnd() { return this.#delimiterEnd; }

  __delimiterEnd(it) { if (it === undefined) return this.#delimiterEnd; else this.#delimiterEnd = it; }

  #escape = 0;

  escape() { return this.#escape; }

  __escape(it) { if (it === undefined) return this.#escape; else this.#escape = it; }

  #multiLine = false;

  multiLine() { return this.#multiLine; }

  __multiLine(it) { if (it === undefined) return this.#multiLine; else this.#multiLine = it; }

  static make() {
    const $self = new SyntaxStr();
    SyntaxStr.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class SyntaxDoc extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SyntaxDoc.type$; }

  #rules = null;

  rules() {
    return this.#rules;
  }

  #lines = null;

  lines(it) {
    if (it === undefined) {
      return this.#lines;
    }
    else {
      this.#lines = it;
      return;
    }
  }

  static parse(rules,in$) {
    try {
      return SyntaxParser.make(rules).parse(in$);
    }
    finally {
      in$.close();
    }
    ;
  }

  static make(rules) {
    const $self = new SyntaxDoc();
    SyntaxDoc.make$($self,rules);
    return $self;
  }

  static make$($self,rules) {
    $self.#rules = rules;
    return;
  }

  eachLine(f) {
    for (let x = this.#lines; x != null; (x = x.next())) {
      sys.Func.call(f, sys.ObjUtil.coerce(x, SyntaxLine.type$));
    }
    ;
    return;
  }

}

class SyntaxLine extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#segments = sys.List.make(sys.Obj.type$);
    return;
  }

  typeof() { return SyntaxLine.type$; }

  #num = 0;

  num() { return this.#num; }

  __num(it) { if (it === undefined) return this.#num; else this.#num = it; }

  #next = null;

  next(it) {
    if (it === undefined) {
      return this.#next;
    }
    else {
      this.#next = it;
      return;
    }
  }

  #segments = null;

  segments(it) {
    if (it === undefined) {
      return this.#segments;
    }
    else {
      this.#segments = it;
      return;
    }
  }

  static make(num) {
    const $self = new SyntaxLine();
    SyntaxLine.make$($self,num);
    return $self;
  }

  static make$($self,num) {
    ;
    $self.#num = num;
    return;
  }

  eachSegment(f) {
    for (let i = 0; sys.ObjUtil.compareLT(i, this.#segments.size()); i = sys.Int.plus(i, 2)) {
      sys.Func.call(f, sys.ObjUtil.coerce(this.#segments.get(i), SyntaxType.type$), sys.ObjUtil.coerce(this.#segments.get(sys.Int.plus(i, 1)), sys.Str.type$));
    }
    ;
    return;
  }

}

class SyntaxType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SyntaxType.type$; }

  static text() { return SyntaxType.vals().get(0); }

  static bracket() { return SyntaxType.vals().get(1); }

  static keyword() { return SyntaxType.vals().get(2); }

  static literal() { return SyntaxType.vals().get(3); }

  static comment() { return SyntaxType.vals().get(4); }

  static #vals = undefined;

  #html = null;

  html() { return this.#html; }

  __html(it) { if (it === undefined) return this.#html; else this.#html = it; }

  static make($ordinal,$name,html) {
    const $self = new SyntaxType();
    SyntaxType.make$($self,$ordinal,$name,html);
    return $self;
  }

  static make$($self,$ordinal,$name,html) {
    sys.Enum.make$($self, $ordinal, $name);
    $self.#html = html;
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(SyntaxType.type$, SyntaxType.vals(), name$, checked);
  }

  static vals() {
    if (SyntaxType.#vals == null) {
      SyntaxType.#vals = sys.List.make(SyntaxType.type$, [
        SyntaxType.make(0, "text", null),
        SyntaxType.make(1, "bracket", "b"),
        SyntaxType.make(2, "keyword", "i"),
        SyntaxType.make(3, "literal", "em"),
        SyntaxType.make(4, "comment", "q"),
      ]).toImmutable();
    }
    return SyntaxType.#vals;
  }

  static static$init() {
    const $_u12 = SyntaxType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class SyntaxTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SyntaxTest.type$; }

  static #t = undefined;

  static t() {
    if (SyntaxTest.#t === undefined) {
      SyntaxTest.static$init();
      if (SyntaxTest.#t === undefined) SyntaxTest.#t = null;
    }
    return SyntaxTest.#t;
  }

  static #b = undefined;

  static b() {
    if (SyntaxTest.#b === undefined) {
      SyntaxTest.static$init();
      if (SyntaxTest.#b === undefined) SyntaxTest.#b = null;
    }
    return SyntaxTest.#b;
  }

  static #k = undefined;

  static k() {
    if (SyntaxTest.#k === undefined) {
      SyntaxTest.static$init();
      if (SyntaxTest.#k === undefined) SyntaxTest.#k = null;
    }
    return SyntaxTest.#k;
  }

  static #s = undefined;

  static s() {
    if (SyntaxTest.#s === undefined) {
      SyntaxTest.static$init();
      if (SyntaxTest.#s === undefined) SyntaxTest.#s = null;
    }
    return SyntaxTest.#s;
  }

  static #c = undefined;

  static c() {
    if (SyntaxTest.#c === undefined) {
      SyntaxTest.static$init();
      if (SyntaxTest.#c === undefined) SyntaxTest.#c = null;
    }
    return SyntaxTest.#c;
  }

  testKeywords() {
    this.verifySyntax("fan", "public class Foo\n\"public\"\npublicx\npublic7\nxpublic\nvirtual\nfoo(bar)", sys.List.make(sys.Type.find("sys::Obj[]"), [sys.List.make(sys.Obj.type$, [SyntaxTest.k(), "public", SyntaxTest.t(), " ", SyntaxTest.k(), "class", SyntaxTest.t(), " Foo"]), sys.List.make(sys.Obj.type$, [SyntaxTest.s(), "\"public\""]), sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "publicx"]), sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "public7"]), sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "xpublic"]), sys.List.make(sys.Obj.type$, [SyntaxTest.k(), "virtual"]), sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "foo", SyntaxTest.b(), "(", SyntaxTest.t(), "bar", SyntaxTest.b(), ")"])]));
    return;
  }

  testComments() {
    this.verifySyntax("fan", "foo/bar\nx // y\n// z", sys.List.make(sys.Type.find("sys::Obj[]"), [sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "foo/bar"]), sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "x ", SyntaxTest.c(), "// y"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "// z"])]));
    return;
  }

  testMultiline1() {
    this.verifySyntax("fan", "aa /* bb\nccc\ndd */ eee\nx /* // foo */ y", sys.List.make(sys.Type.find("sys::Obj[]"), [sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "aa ", SyntaxTest.c(), "/* bb"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "ccc"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "dd */", SyntaxTest.t(), " eee"]), sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "x ", SyntaxTest.c(), "/* // foo */", SyntaxTest.t(), " y"])]));
    return;
  }

  testMultilineNested1() {
    this.verifySyntax("fan", "x/* bb\n{}\n/*\na /* b /* c\nc */ b */ c\n*/\n{}\ndd */ eee", sys.List.make(sys.Type.find("sys::Obj[]"), [sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "x", SyntaxTest.c(), "/* bb"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "{}"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "/*"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "a /* b /* c"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "c */ b */ c"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "*/"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "{}"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "dd */", SyntaxTest.t(), " eee"])]));
    return;
  }

  testMultilineNested2() {
    this.verifySyntax("fan", "x /* y */ z /*\na /* b */ xx\n\"foo\"\n*/ c*d /* e */\nx/* /* /* x */ x\n*/\n*/foo", sys.List.make(sys.Type.find("sys::Obj[]"), [sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "x ", SyntaxTest.c(), "/* y */", SyntaxTest.t(), " z ", SyntaxTest.c(), "/*"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "a /* b */ xx"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "\"foo\""]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "*/", SyntaxTest.t(), " c*d ", SyntaxTest.c(), "/* e */"]), sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "x", SyntaxTest.c(), "/* /* /* x */ x"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "*/"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "*/", SyntaxTest.t(), "foo"])]));
    return;
  }

  testMultilineUnnested() {
    this.verifySyntax("java", "x /* y */ z /*\na /* {cool}\nab */ xx\n/*\"foo\"\n*/ c*d", sys.List.make(sys.Type.find("sys::Obj[]"), [sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "x ", SyntaxTest.c(), "/* y */", SyntaxTest.t(), " z ", SyntaxTest.c(), "/*"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "a /* {cool}"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "ab */", SyntaxTest.t(), " xx"]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "/*\"foo\""]), sys.List.make(sys.Obj.type$, [SyntaxTest.c(), "*/", SyntaxTest.t(), " c*d"])]));
    return;
  }

  testStrs() {
    this.verifySyntax("fan", "x\"foo\"y!\nx'c'y\n`/bar`y\na\"b\\\"c\"d\n'\\\\'+`x\\`x`!\n\"x\\\\\"!\n{\"x\\\\\\\"y\"}\n\"a\",\"b\",`c`,`d`", sys.List.make(sys.Type.find("sys::Obj[]"), [sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "x", SyntaxTest.s(), "\"foo\"", SyntaxTest.t(), "y!"]), sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "x", SyntaxTest.s(), "'c'", SyntaxTest.t(), "y"]), sys.List.make(sys.Obj.type$, [SyntaxTest.s(), "`/bar`", SyntaxTest.t(), "y"]), sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "a", SyntaxTest.s(), "\"b\\\"c\"", SyntaxTest.t(), "d"]), sys.List.make(sys.Obj.type$, [SyntaxTest.s(), "'\\\\'", SyntaxTest.t(), "+", SyntaxTest.s(), "`x\\`x`", SyntaxTest.t(), "!"]), sys.List.make(sys.Obj.type$, [SyntaxTest.s(), "\"x\\\\\"", SyntaxTest.t(), "!"]), sys.List.make(sys.Obj.type$, [SyntaxTest.b(), "{", SyntaxTest.s(), "\"x\\\\\\\"y\"", SyntaxTest.b(), "}"]), sys.List.make(sys.Obj.type$, [SyntaxTest.s(), "\"a\"", SyntaxTest.t(), ",", SyntaxTest.s(), "\"b\"", SyntaxTest.t(), ",", SyntaxTest.s(), "`c`", SyntaxTest.t(), ",", SyntaxTest.s(), "`d`"])]));
    return;
  }

  testMultiLineStr() {
    this.verifySyntax("fan", "x\"foo\n// string!\na=\\\"b\\\"\nbar\"baz\"\n\";", sys.List.make(sys.Type.find("sys::Obj[]"), [sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "x", SyntaxTest.s(), "\"foo"]), sys.List.make(sys.Obj.type$, [SyntaxTest.s(), "// string!"]), sys.List.make(sys.Obj.type$, [SyntaxTest.s(), "a=\\\"b\\\""]), sys.List.make(sys.Obj.type$, [SyntaxTest.s(), "bar\"", SyntaxTest.t(), "baz", SyntaxTest.s(), "\""]), sys.List.make(sys.Obj.type$, [SyntaxTest.s(), "\"", SyntaxTest.t(), ";"])]));
    return;
  }

  testMixedBlocks() {
    this.verifySyntax("fan", "x\"\"\"foo/*\n/* \"hi\"\nbar*/ */\"\"\"baz", sys.List.make(sys.Type.find("sys::Obj[]"), [sys.List.make(sys.Obj.type$, [SyntaxTest.t(), "x", SyntaxTest.s(), "\"\"\"foo/*"]), sys.List.make(sys.Obj.type$, [SyntaxTest.s(), "/* \"hi\""]), sys.List.make(sys.Obj.type$, [SyntaxTest.s(), "bar*/ */\"\"\"", SyntaxTest.t(), "baz"])]));
    return;
  }

  verifySyntax(ext,src,expected) {
    const this$ = this;
    let rules = SyntaxRules.loadForExt(ext);
    if (rules == null) {
      throw sys.Err.make(sys.Str.plus("no rules for ", ext));
    }
    ;
    let doc = SyntaxDoc.parse(sys.ObjUtil.coerce(rules, SyntaxRules.type$), sys.Str.in(src));
    let lines = sys.List.make(SyntaxLine.type$);
    doc.eachLine((line) => {
      lines.add(line);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(lines.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected.size(), sys.Obj.type$.toNullable()));
    lines.each((line,i) => {
      this$.verifyEq(sys.ObjUtil.coerce(line.num(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(i, 1), sys.Obj.type$.toNullable()));
      let segs = sys.List.make(sys.Obj.type$);
      line.eachSegment((t,s) => {
        segs.add(t).add(s);
        return;
      });
      if (sys.ObjUtil.equals(segs, expected.get(i))) {
        this$.verify(true);
      }
      else {
        sys.ObjUtil.echo(sys.Str.plus("FAILURE line ", sys.ObjUtil.coerce(line.num(), sys.Obj.type$.toNullable())));
        sys.ObjUtil.echo(sys.Str.plus("expected: ", this$.lineToStr(expected.get(i))));
        sys.ObjUtil.echo(sys.Str.plus("actual:   ", this$.lineToStr(segs)));
        this$.fail();
      }
      ;
      return;
    });
    return;
  }

  lineToStr(styling) {
    let s = sys.StrBuf.make();
    for (let i = 0; sys.ObjUtil.compareLT(i, styling.size()); i = sys.Int.plus(i, 2)) {
      let type = ((this$) => { let $_u13 = sys.ObjUtil.as(styling.get(i), SyntaxType.type$); if ($_u13 != null) return $_u13; throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), " "), styling.get(i))); })(this);
      let text = ((this$) => { let $_u14 = sys.ObjUtil.as(styling.get(sys.Int.plus(i, 1)), sys.Str.type$); if ($_u14 != null) return $_u14; throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), "+1 "), styling.get(sys.Int.plus(i, 1)))); })(this);
      s.add(((this$) => { if (type === SyntaxType.literal()) return "s"; return sys.Str.getRange(type.toStr(), sys.Range.make(0, 0)); })(this)).add(" ").add(sys.Str.toCode(text)).add(", ");
    }
    ;
    return s.toStr();
  }

  static make() {
    const $self = new SyntaxTest();
    SyntaxTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

  static static$init() {
    SyntaxTest.#t = SyntaxType.text();
    SyntaxTest.#b = SyntaxType.bracket();
    SyntaxTest.#k = SyntaxType.keyword();
    SyntaxTest.#s = SyntaxType.literal();
    SyntaxTest.#c = SyntaxType.comment();
    return;
  }

}

const p = sys.Pod.add$('syntax');
const xp = sys.Param.noParams$();
let m;
HtmlSyntaxWriter.type$ = p.at$('HtmlSyntaxWriter','sys::Obj',[],{},8192,HtmlSyntaxWriter);
SyntaxParser.type$ = p.at$('SyntaxParser','sys::Obj',[],{},128,SyntaxParser);
LineTokenizer.type$ = p.at$('LineTokenizer','sys::Obj',[],{},128,LineTokenizer);
Matcher.type$ = p.at$('Matcher','sys::Obj',[],{},128,Matcher);
StrMatch.type$ = p.at$('StrMatch','sys::Obj',[],{},128,StrMatch);
SyntaxRules.type$ = p.at$('SyntaxRules','sys::Obj',[],{'sys::Js':"",'sys::Serializable':""},8194,SyntaxRules);
SyntaxStr.type$ = p.at$('SyntaxStr','sys::Obj',[],{'sys::Js':"",'sys::Serializable':""},8194,SyntaxStr);
SyntaxDoc.type$ = p.at$('SyntaxDoc','sys::Obj',[],{},8192,SyntaxDoc);
SyntaxLine.type$ = p.at$('SyntaxLine','sys::Obj',[],{},8192,SyntaxLine);
SyntaxType.type$ = p.at$('SyntaxType','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,SyntaxType);
SyntaxTest.type$ = p.at$('SyntaxTest','sys::Test',[],{},8192,SyntaxTest);
HtmlSyntaxWriter.type$.af$('out',67584,'sys::OutStream',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('close',8192,'sys::Bool',xp,{}).am$('writeDoc',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('doc','syntax::SyntaxDoc',false)]),{}).am$('writeLines',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('doc','syntax::SyntaxDoc',false)]),{}).am$('writeLine',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('line','syntax::SyntaxLine',false)]),{});
SyntaxParser.type$.af$('tabsToSpaces',73728,'sys::Int',{}).af$('rules',67584,'syntax::SyntaxRules',{}).af$('tokenizer',67584,'syntax::LineTokenizer',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rules','syntax::SyntaxRules',false)]),{}).am$('parse',8192,'syntax::SyntaxDoc',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('parseLine',2048,'syntax::SyntaxLine',sys.List.make(sys.Param.type$,[new sys.Param('num','sys::Int',false),new sys.Param('lineText','sys::Str',false)]),{}).am$('convertTabsToSpaces',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('text','sys::Str',false),new sys.Param('ts','sys::Int',false)]),{});
LineTokenizer.type$.af$('rules',67584,'syntax::SyntaxRules',{}).af$('brackets',67584,'sys::Str',{}).af$('keywordPrefixes',67584,'[sys::Int:sys::Bool]',{}).af$('keywords',67584,'[sys::Str:sys::Bool]',{}).af$('comments',67584,'syntax::Matcher[]',{}).af$('commentStart',67584,'syntax::Matcher',{}).af$('commentEnd',67584,'syntax::Matcher',{}).af$('strs',67584,'syntax::StrMatch[]',{}).af$('inComment',67584,'sys::Int',{}).af$('inStr',67584,'syntax::StrMatch?',{}).af$('line',67584,'sys::Str?',{}).af$('lineSize',67584,'sys::Int',{}).af$('pos',67584,'sys::Int',{}).af$('cur',67584,'sys::Int',{}).af$('peek',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rules','syntax::SyntaxRules',false)]),{}).am$('tokenizeLine',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false),new sys.Param('f','|syntax::SyntaxType,sys::Str->sys::Void|',false)]),{}).am$('next',2048,'syntax::SyntaxType',xp,{}).am$('blockComment',2048,'syntax::SyntaxType',xp,{}).am$('strLiteral',2048,'syntax::SyntaxType',sys.List.make(sys.Param.type$,[new sys.Param('s','syntax::StrMatch',false)]),{}).am$('toStrMatch',8192,'syntax::StrMatch',sys.List.make(sys.Param.type$,[new sys.Param('s','syntax::SyntaxStr',false)]),{}).am$('toMatcher',8192,'syntax::Matcher',sys.List.make(sys.Param.type$,[new sys.Param('tok','sys::Str?',false),new sys.Param('esc','sys::Int',true)]),{}).am$('noMatch',8192,'sys::Bool',xp,{}).am$('match1',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ch1','sys::Int',false)]),{}).am$('match2',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ch1','sys::Int',false),new sys.Param('ch2','sys::Int',false)]),{}).am$('match1Esc',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ch1','sys::Int',false),new sys.Param('esc','sys::Int',false)]),{}).am$('match2Esc',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ch1','sys::Int',false),new sys.Param('ch2','sys::Int',false),new sys.Param('esc','sys::Int',false)]),{}).am$('matchN',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('chars','sys::Str',false)]),{}).am$('countEscapes',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('esc','sys::Int',false)]),{}).am$('consume',2048,'sys::Void',xp,{}).am$('consumeN',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false)]),{});
Matcher.type$.af$('matchFunc',73728,'|->sys::Bool|',{}).af$('consumeFunc',73728,'|->sys::Void|',{}).af$('size',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sz','sys::Int',false),new sys.Param('m','|->sys::Bool|',false),new sys.Param('c','|->sys::Void|',false)]),{}).am$('isMatch',8192,'sys::Bool',xp,{}).am$('consume',8192,'sys::Void',xp,{});
StrMatch.type$.af$('start',73728,'syntax::Matcher?',{}).af$('end',73728,'syntax::Matcher?',{}).af$('escape',73728,'sys::Int',{}).af$('multiLine',73728,'sys::Bool',{}).am$('make',139268,'sys::Void',xp,{});
SyntaxRules.type$.af$('brackets',73730,'sys::Str',{}).af$('keywords',73730,'sys::Str[]?',{}).af$('comments',73730,'sys::Str[]?',{}).af$('strs',73730,'syntax::SyntaxStr[]?',{}).af$('blockCommentStart',73730,'sys::Str?',{}).af$('blockCommentEnd',73730,'sys::Str?',{}).af$('blockCommentsNest',73730,'sys::Bool',{}).am$('loadForExt',40962,'syntax::SyntaxRules?',sys.List.make(sys.Param.type$,[new sys.Param('ext','sys::Str',false)]),{}).am$('loadForFile',40962,'syntax::SyntaxRules?',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('firstLine','sys::Str?',true)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{});
SyntaxStr.type$.af$('delimiter',73730,'sys::Str',{}).af$('delimiterEnd',73730,'sys::Str?',{}).af$('escape',73730,'sys::Int',{}).af$('multiLine',73730,'sys::Bool',{}).am$('make',139268,'sys::Void',xp,{});
SyntaxDoc.type$.af$('rules',73728,'syntax::SyntaxRules',{}).af$('lines',65664,'syntax::SyntaxLine?',{}).am$('parse',40962,'syntax::SyntaxDoc',sys.List.make(sys.Param.type$,[new sys.Param('rules','syntax::SyntaxRules',false),new sys.Param('in','sys::InStream',false)]),{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rules','syntax::SyntaxRules',false)]),{}).am$('eachLine',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|syntax::SyntaxLine->sys::Void|',false)]),{});
SyntaxLine.type$.af$('num',73730,'sys::Int',{}).af$('next',65664,'syntax::SyntaxLine?',{}).af$('segments',65664,'sys::Obj[]',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('num','sys::Int',false)]),{}).am$('eachSegment',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|syntax::SyntaxType,sys::Str->sys::Void|',false)]),{});
SyntaxType.type$.af$('text',106506,'syntax::SyntaxType',{}).af$('bracket',106506,'syntax::SyntaxType',{}).af$('keyword',106506,'syntax::SyntaxType',{}).af$('literal',106506,'syntax::SyntaxType',{}).af$('comment',106506,'syntax::SyntaxType',{}).af$('vals',106498,'syntax::SyntaxType[]',{}).af$('html',65666,'sys::Str?',{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('html','sys::Str?',false)]),{}).am$('fromStr',40966,'syntax::SyntaxType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
SyntaxTest.type$.af$('t',106498,'syntax::SyntaxType',{}).af$('b',106498,'syntax::SyntaxType',{}).af$('k',106498,'syntax::SyntaxType',{}).af$('s',106498,'syntax::SyntaxType',{}).af$('c',106498,'syntax::SyntaxType',{}).am$('testKeywords',8192,'sys::Void',xp,{}).am$('testComments',8192,'sys::Void',xp,{}).am$('testMultiline1',8192,'sys::Void',xp,{}).am$('testMultilineNested1',8192,'sys::Void',xp,{}).am$('testMultilineNested2',8192,'sys::Void',xp,{}).am$('testMultilineUnnested',8192,'sys::Void',xp,{}).am$('testStrs',8192,'sys::Void',xp,{}).am$('testMultiLineStr',8192,'sys::Void',xp,{}).am$('testMixedBlocks',8192,'sys::Void',xp,{}).am$('verifySyntax',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ext','sys::Str',false),new sys.Param('src','sys::Str',false),new sys.Param('expected','sys::Obj[][]',false)]),{}).am$('lineToStr',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('styling','sys::Obj[]',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "syntax");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0");
m.set("pod.summary", "Syntax styling for programming languages");
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
  HtmlSyntaxWriter,
  SyntaxRules,
  SyntaxStr,
  SyntaxDoc,
  SyntaxLine,
  SyntaxType,
  SyntaxTest,
};
