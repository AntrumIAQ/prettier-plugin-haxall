// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class MarkdownExt {
  constructor() {
    const this$ = this;
  }

  typeof() { return MarkdownExt.type$; }

  extendParser(builder) {
    return;
  }

  extendHtml(builder) {
    return;
  }

  extendMarkdown(builder) {
    return;
  }

}

class Node extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#sourceSpans = null;
    return;
  }

  typeof() { return Node.type$; }

  #p = null;

  // private field reflection only
  __p(it) { if (it === undefined) return this.#p; else this.#p = it; }

  #next = null;

  next() {
    return this.#next;
  }

  #prev = null;

  prev() {
    return this.#prev;
  }

  #firstChild = null;

  firstChild() {
    return this.#firstChild;
  }

  #lastChild = null;

  lastChild() {
    return this.#lastChild;
  }

  #sourceSpans = null;

  sourceSpans() {
    return sys.ObjUtil.coerce(((this$) => { if (this$.#sourceSpans == null) return SourceSpan.type$.emptyList(); return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this$.#sourceSpans), sys.Type.find("markdown::SourceSpan[]?")); })(this), sys.Type.find("markdown::SourceSpan[]?"));
  }

  static make() {
    const $self = new Node();
    Node.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  parent() {
    return this.#p;
  }

  setParent(p) {
    this.#p = p;
    return;
  }

  walk(visitor) {
    let method = sys.ObjUtil.typeof(visitor).method(sys.Str.plus("visit", sys.ObjUtil.typeof(this).name()), false);
    if (method != null) {
      method.callOn(visitor, sys.List.make(Node.type$, [this]));
    }
    else {
      if (sys.ObjUtil.is(this, CustomNode.type$)) {
        visitor.visitCustomNode(sys.ObjUtil.coerce(this, CustomNode.type$));
      }
      else {
        if (sys.ObjUtil.is(this, CustomBlock.type$)) {
          visitor.visitCustomBlock(sys.ObjUtil.coerce(this, CustomBlock.type$));
        }
        else {
          throw sys.ArgErr.make(sys.Str.plus("no visit method found for ", sys.ObjUtil.typeof(this)));
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  appendChild(child) {
    child.unlink();
    child.setParent(this);
    if (this.#lastChild != null) {
      this.#lastChild.#next = child;
      child.#prev = this.#lastChild;
      this.#lastChild = child;
    }
    else {
      this.#firstChild = child;
      this.#lastChild = child;
    }
    ;
    return this;
  }

  unlink() {
    if (this.#prev != null) {
      this.#prev.#next = this.#next;
    }
    else {
      if (this.parent() != null) {
        this.parent().#firstChild = this.#next;
      }
      ;
    }
    ;
    if (this.#next != null) {
      this.#next.#prev = this.#prev;
    }
    else {
      if (this.parent() != null) {
        this.parent().#lastChild = this.#prev;
      }
      ;
    }
    ;
    this.#p = null;
    this.#next = null;
    this.#prev = null;
    return;
  }

  insertAfter(sibling) {
    sibling.unlink();
    sibling.#next = this.#next;
    if (sibling.#next != null) {
      sibling.#next.#prev = sibling;
    }
    ;
    sibling.#prev = this;
    this.#next = sibling;
    sibling.#p = this.parent();
    if (sibling.#next == null) {
      sibling.parent().#lastChild = sibling;
    }
    ;
    return;
  }

  insertBefore(sibling) {
    sibling.unlink();
    sibling.#prev = this.#prev;
    if (sibling.#prev != null) {
      sibling.#prev.#next = sibling;
    }
    ;
    sibling.#next = this;
    this.#prev = sibling;
    sibling.#p = this.parent();
    if (sibling.#prev == null) {
      sibling.parent().#firstChild = sibling;
    }
    ;
    return;
  }

  addSourceSpan(sourceSpan) {
    if (sourceSpan == null) {
      return;
    }
    ;
    if (this.sourceSpans() == null) {
      this.#sourceSpans = sys.List.make(SourceSpan.type$);
    }
    ;
    this.sourceSpans().add(sys.ObjUtil.coerce(sourceSpan, SourceSpan.type$));
    return;
  }

  setSourceSpans(sourceSpans) {
    this.#sourceSpans = ((this$) => { if (sourceSpans.isEmpty()) return null; return sourceSpans.dup(); })(this);
    return;
  }

  static eachBetween(start,end,f) {
    let node = start.#next;
    while ((node != null && node !== end)) {
      let next = node.#next;
      sys.Func.call(f, sys.ObjUtil.coerce(node, Node.type$));
      (node = next);
    }
    ;
    return;
  }

  static children(parent) {
    let acc = sys.List.make(Node.type$);
    for (let child = parent.#firstChild; child != null; (child = child.#next)) {
      acc.add(sys.ObjUtil.coerce(child, Node.type$));
    }
    ;
    return acc;
  }

  static find(parent,nodeType) {
    return sys.ObjUtil.coerce(((this$) => { let $_u2 = Node.tryFind(parent, nodeType); if ($_u2 != null) return $_u2; throw sys.Err.make(sys.Str.plus(sys.Str.plus("", nodeType), " not found")); })(this), Node.type$);
  }

  static tryFind(parent,nodeType) {
    let node = parent.#firstChild;
    while (node != null) {
      let next = node.#next;
      if (sys.ObjUtil.typeof(node).fits(nodeType)) {
        return node;
      }
      ;
      let result = Node.tryFind(sys.ObjUtil.coerce(node, Node.type$), nodeType);
      if (result != null) {
        return result;
      }
      ;
      (node = next);
    }
    ;
    return null;
  }

  static eachChild(parent,f) {
    let node = parent.#firstChild;
    while (node != null) {
      let saveNext = node.#next;
      sys.Func.call(f, sys.ObjUtil.coerce(node, Node.type$));
      Node.eachChild(sys.ObjUtil.coerce(node, Node.type$), f);
      (node = saveNext);
    }
    ;
    return;
  }

  static dumpTree(node,out,indent) {
    if (out === undefined) out = sys.Env.cur().out();
    if (indent === undefined) indent = 0;
    let sp = sys.Str.mult(" ", indent);
    out.writeChars(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sp), ""), node), "\n"));
    let child = node.#firstChild;
    while (child != null) {
      Node.dumpTree(sys.ObjUtil.coerce(child, Node.type$), out, sys.Int.plus(indent, 2));
      (child = child.#next);
    }
    ;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(this).name()), "{"), this.toStrAttributes()), "}");
  }

  toStrAttributes() {
    return "";
  }

}

class HardLineBreak extends Node {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HardLineBreak.type$; }

  static make() {
    const $self = new HardLineBreak();
    HardLineBreak.make$($self);
    return $self;
  }

  static make$($self) {
    Node.make$($self);
    return;
  }

}

class SoftLineBreak extends Node {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SoftLineBreak.type$; }

  static make() {
    const $self = new SoftLineBreak();
    SoftLineBreak.make$($self);
    return $self;
  }

  static make$($self) {
    Node.make$($self);
    return;
  }

}

class Delimited {
  constructor() {
    const this$ = this;
  }

  typeof() { return Delimited.type$; }

}

class StrongEmphasis extends Node {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StrongEmphasis.type$; }

  #delimiter = null;

  delimiter() { return this.#delimiter; }

  __delimiter(it) { if (it === undefined) return this.#delimiter; else this.#delimiter = it; }

  static make(delimiter) {
    const $self = new StrongEmphasis();
    StrongEmphasis.make$($self,delimiter);
    return $self;
  }

  static make$($self,delimiter) {
    Node.make$($self);
    $self.#delimiter = delimiter;
    return;
  }

  openingDelim() {
    return this.#delimiter;
  }

  closingDelim() {
    return this.#delimiter;
  }

}

class Emphasis extends Node {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Emphasis.type$; }

  #delimiter = null;

  delimiter() { return this.#delimiter; }

  __delimiter(it) { if (it === undefined) return this.#delimiter; else this.#delimiter = it; }

  static make(delimiter) {
    const $self = new Emphasis();
    Emphasis.make$($self,delimiter);
    return $self;
  }

  static make$($self,delimiter) {
    Node.make$($self);
    $self.#delimiter = delimiter;
    return;
  }

  openingDelim() {
    return this.#delimiter;
  }

  closingDelim() {
    return this.#delimiter;
  }

}

class Text extends Node {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Text.type$; }

  #literal = null;

  literal(it) {
    if (it === undefined) {
      return this.#literal;
    }
    else {
      this.#literal = it;
      return;
    }
  }

  static make(literal) {
    const $self = new Text();
    Text.make$($self,literal);
    return $self;
  }

  static make$($self,literal) {
    Node.make$($self);
    $self.#literal = literal;
    return;
  }

  toStrAttributes() {
    return sys.Str.plus("literal=", this.#literal);
  }

}

class Code extends Node {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Code.type$; }

  #literal = null;

  literal() { return this.#literal; }

  __literal(it) { if (it === undefined) return this.#literal; else this.#literal = it; }

  static make(literal) {
    const $self = new Code();
    Code.make$($self,literal);
    return $self;
  }

  static make$($self,literal) {
    Node.make$($self);
    $self.#literal = literal;
    return;
  }

}

class HtmlInline extends Node {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HtmlInline.type$; }

  #literal = null;

  literal(it) {
    if (it === undefined) {
      return this.#literal;
    }
    else {
      this.#literal = it;
      return;
    }
  }

  static make(literal) {
    const $self = new HtmlInline();
    HtmlInline.make$($self,literal);
    return $self;
  }

  static make$($self,literal) {
    if (literal === undefined) literal = null;
    Node.make$($self);
    $self.#literal = literal;
    return;
  }

}

class CustomNode extends Node {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CustomNode.type$; }

  static make() {
    const $self = new CustomNode();
    CustomNode.make$($self);
    return $self;
  }

  static make$($self) {
    Node.make$($self);
    return;
  }

}

class Block extends Node {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Block.type$; }

  parent() {
    return sys.ObjUtil.coerce(Node.prototype.parent.call(this), Block.type$.toNullable());
  }

  setParent(p) {
    if (!sys.ObjUtil.is(p, Block.type$)) {
      throw sys.ArgErr.make("Parent of block must also be a block");
    }
    ;
    Node.prototype.setParent.call(this, p);
    return;
  }

  static make() {
    const $self = new Block();
    Block.make$($self);
    return $self;
  }

  static make$($self) {
    Node.make$($self);
    return;
  }

}

class Document extends Block {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Document.type$; }

  static make() {
    const $self = new Document();
    Document.make$($self);
    return $self;
  }

  static make$($self) {
    Block.make$($self);
    return;
  }

}

class Heading extends Block {
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
    if (level === undefined) level = 0;
    Block.make$($self);
    $self.#level = level;
    return;
  }

}

class BlockQuote extends Block {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BlockQuote.type$; }

  static make() {
    const $self = new BlockQuote();
    BlockQuote.make$($self);
    return $self;
  }

  static make$($self) {
    Block.make$($self);
    return;
  }

}

class FencedCode extends Block {
  constructor() {
    super();
    const this$ = this;
    this.#fenceIndent = 0;
    return;
  }

  typeof() { return FencedCode.type$; }

  #fenceChar = null;

  fenceChar(it) {
    if (it === undefined) {
      return this.#fenceChar;
    }
    else {
      this.#fenceChar = it;
      return;
    }
  }

  #fenceIndent = 0;

  fenceIndent(it) {
    if (it === undefined) {
      return this.#fenceIndent;
    }
    else {
      this.#fenceIndent = it;
      return;
    }
  }

  #openingFenceLen = null;

  openingFenceLen(it) {
    if (it === undefined) {
      return this.#openingFenceLen;
    }
    else {
      if ((it != null && sys.ObjUtil.compareLT(it, 3))) {
        throw sys.ArgErr.make("openingFenceLen needs to be >= 3");
      }
      ;
      FencedCode.checkFenceLens(it, this.closingFenceLen());
      this.#openingFenceLen = it;
      return;
    }
  }

  #closingFenceLen = null;

  closingFenceLen(it) {
    if (it === undefined) {
      return this.#closingFenceLen;
    }
    else {
      if ((it != null && sys.ObjUtil.compareLT(it, 3))) {
        throw sys.ArgErr.make("closingFenceLen needs to be >= 3");
      }
      ;
      FencedCode.checkFenceLens(this.openingFenceLen(), it);
      this.#closingFenceLen = it;
      return;
    }
  }

  #info = null;

  info(it) {
    if (it === undefined) {
      return this.#info;
    }
    else {
      this.#info = it;
      return;
    }
  }

  #literal = null;

  literal(it) {
    if (it === undefined) {
      return this.#literal;
    }
    else {
      this.#literal = it;
      return;
    }
  }

  static make(fenceChar) {
    const $self = new FencedCode();
    FencedCode.make$($self,fenceChar);
    return $self;
  }

  static make$($self,fenceChar) {
    if (fenceChar === undefined) fenceChar = null;
    Block.make$($self);
    ;
    $self.#fenceChar = fenceChar;
    return;
  }

  static checkFenceLens(openingFenceLen,closingFenceLen) {
    if ((openingFenceLen != null && closingFenceLen != null)) {
      if (sys.ObjUtil.compareLT(closingFenceLen, openingFenceLen)) {
        throw sys.ArgErr.make("fence lengths required to be: closingFenceLen >= openingFenceLen");
      }
      ;
    }
    ;
    return;
  }

}

class HtmlBlock extends Block {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HtmlBlock.type$; }

  #literal = null;

  literal(it) {
    if (it === undefined) {
      return this.#literal;
    }
    else {
      this.#literal = it;
      return;
    }
  }

  static make(literal) {
    const $self = new HtmlBlock();
    HtmlBlock.make$($self,literal);
    return $self;
  }

  static make$($self,literal) {
    if (literal === undefined) literal = null;
    Block.make$($self);
    $self.#literal = literal;
    return;
  }

}

class ThematicBreak extends Block {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ThematicBreak.type$; }

  #literal = null;

  literal(it) {
    if (it === undefined) {
      return this.#literal;
    }
    else {
      this.#literal = it;
      return;
    }
  }

  static make(literal) {
    const $self = new ThematicBreak();
    ThematicBreak.make$($self,literal);
    return $self;
  }

  static make$($self,literal) {
    if (literal === undefined) literal = null;
    Block.make$($self);
    $self.#literal = literal;
    return;
  }

}

class IndentedCode extends Block {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return IndentedCode.type$; }

  #literal = null;

  literal(it) {
    if (it === undefined) {
      return this.#literal;
    }
    else {
      this.#literal = it;
      return;
    }
  }

  static make(literal) {
    const $self = new IndentedCode();
    IndentedCode.make$($self,literal);
    return $self;
  }

  static make$($self,literal) {
    if (literal === undefined) literal = null;
    Block.make$($self);
    $self.#literal = literal;
    return;
  }

}

class ListBlock extends Block {
  constructor() {
    super();
    const this$ = this;
    this.#tight = false;
    return;
  }

  typeof() { return ListBlock.type$; }

  #tight = false;

  tight(it) {
    if (it === undefined) {
      return this.#tight;
    }
    else {
      this.#tight = it;
      return;
    }
  }

  static make() {
    const $self = new ListBlock();
    ListBlock.make$($self);
    return $self;
  }

  static make$($self) {
    Block.make$($self);
    ;
    return;
  }

}

class BulletList extends ListBlock {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BulletList.type$; }

  #marker = null;

  marker(it) {
    if (it === undefined) {
      return this.#marker;
    }
    else {
      this.#marker = it;
      return;
    }
  }

  static make(marker) {
    const $self = new BulletList();
    BulletList.make$($self,marker);
    return $self;
  }

  static make$($self,marker) {
    if (marker === undefined) marker = null;
    ListBlock.make$($self);
    $self.#marker = marker;
    return;
  }

}

class OrderedList extends ListBlock {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return OrderedList.type$; }

  #startNumber = null;

  startNumber(it) {
    if (it === undefined) {
      return this.#startNumber;
    }
    else {
      this.#startNumber = it;
      return;
    }
  }

  #markerDelim = null;

  markerDelim(it) {
    if (it === undefined) {
      return this.#markerDelim;
    }
    else {
      this.#markerDelim = it;
      return;
    }
  }

  static make(startNumber,markerDelim) {
    const $self = new OrderedList();
    OrderedList.make$($self,startNumber,markerDelim);
    return $self;
  }

  static make$($self,startNumber,markerDelim) {
    ListBlock.make$($self);
    $self.#startNumber = startNumber;
    $self.#markerDelim = markerDelim;
    return;
  }

}

class ListItem extends Block {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ListItem.type$; }

  #markerIndent = null;

  markerIndent(it) {
    if (it === undefined) {
      return this.#markerIndent;
    }
    else {
      this.#markerIndent = it;
      return;
    }
  }

  #contentIndent = null;

  contentIndent(it) {
    if (it === undefined) {
      return this.#contentIndent;
    }
    else {
      this.#contentIndent = it;
      return;
    }
  }

  static make(markerIndent,contentIndent) {
    const $self = new ListItem();
    ListItem.make$($self,markerIndent,contentIndent);
    return $self;
  }

  static make$($self,markerIndent,contentIndent) {
    Block.make$($self);
    $self.#markerIndent = markerIndent;
    $self.#contentIndent = contentIndent;
    return;
  }

}

class Paragraph extends Block {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Paragraph.type$; }

  static make() {
    const $self = new Paragraph();
    Paragraph.make$($self);
    return $self;
  }

  static make$($self) {
    Block.make$($self);
    return;
  }

}

class CustomBlock extends Block {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CustomBlock.type$; }

  static make() {
    const $self = new CustomBlock();
    CustomBlock.make$($self);
    return $self;
  }

  static make$($self) {
    Block.make$($self);
    return;
  }

}

class Definitions extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#defsByType = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Type"), sys.Type.find("markdown::DefinitionMap"));
    return;
  }

  typeof() { return Definitions.type$; }

  #defsByType = null;

  // private field reflection only
  __defsByType(it) { if (it === undefined) return this.#defsByType; else this.#defsByType = it; }

  static make() {
    const $self = new Definitions();
    Definitions.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  addDefinitions(map) {
    let existing = this.get(map.of());
    if (existing == null) {
      this.#defsByType.add(map.of(), map);
    }
    else {
      existing.addAll(map);
    }
    ;
    return;
  }

  def(of$,label) {
    let map = this.get(of$);
    return ((this$) => { if (map == null) return null; return map.get(label); })(this);
  }

  get(of$) {
    return this.#defsByType.get(of$);
  }

}

class DefinitionMap extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#defs = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("markdown::Block")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:markdown::Block]"));
    return;
  }

  typeof() { return DefinitionMap.type$; }

  #of = null;

  of() { return this.#of; }

  __of(it) { if (it === undefined) return this.#of; else this.#of = it; }

  #defs = null;

  // private field reflection only
  __defs(it) { if (it === undefined) return this.#defs; else this.#defs = it; }

  static make(of$) {
    const $self = new DefinitionMap();
    DefinitionMap.make$($self,of$);
    return $self;
  }

  static make$($self,of$) {
    ;
    $self.#of = of$;
    if (!of$.fits(Block.type$)) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("", of$), " is not a Block"));
    }
    ;
    return;
  }

  get(label,def) {
    if (def === undefined) def = null;
    let normLabel = Esc.normalizeLabelContent(label);
    return this.#defs.get(normLabel, def);
  }

  addAll(that) {
    const this$ = this;
    that.#defs.each((def,label) => {
      if (!this$.#defs.containsKey(label)) {
        this$.set(label, def);
      }
      ;
      return;
    });
    return;
  }

  putIfAbsent(label,def) {
    let normalizedLabel = Esc.normalizeLabelContent(label);
    if (!this.#defs.containsKey(normalizedLabel)) {
      this.set(normalizedLabel, def);
      return null;
    }
    ;
    return this.#defs.get(normalizedLabel);
  }

  set(normLabel,def) {
    if (!sys.ObjUtil.typeof(def).fits(this.#of)) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("cannot insert ", sys.ObjUtil.typeof(def)), " into map of "), this.#of));
    }
    ;
    this.#defs.set(normLabel, def);
    return;
  }

}

class LinkNode extends Node {
  constructor() {
    super();
    const this$ = this;
    this.#isCode = false;
    return;
  }

  typeof() { return LinkNode.type$; }

  #destination = null;

  destination(it) {
    if (it === undefined) {
      return this.#destination;
    }
    else {
      this.#destination = it;
      return;
    }
  }

  #title = null;

  title(it) {
    if (it === undefined) {
      return this.#title;
    }
    else {
      this.#title = it;
      return;
    }
  }

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

  static make(destination,title) {
    const $self = new LinkNode();
    LinkNode.make$($self,destination,title);
    return $self;
  }

  static make$($self,destination,title) {
    if (title === undefined) title = null;
    Node.make$($self);
    ;
    $self.#destination = destination;
    $self.#title = title;
    return;
  }

  setText(text) {
    this.setContent(Text.make(text));
    return;
  }

  setContent(content) {
    const this$ = this;
    Node.children(this).each((child) => {
      child.unlink();
      return;
    });
    this.appendChild(content);
    return;
  }

  toStrAttributes() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("dest=", this.#destination), ", title="), this.#title);
  }

}

class Link extends LinkNode {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Link.type$; }

  static make(destination,title) {
    const $self = new Link();
    Link.make$($self,destination,title);
    return $self;
  }

  static make$($self,destination,title) {
    if (title === undefined) title = null;
    LinkNode.make$($self, destination, title);
    return;
  }

}

class Image extends LinkNode {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Image.type$; }

  static make(destination,title) {
    const $self = new Image();
    Image.make$($self,destination,title);
    return $self;
  }

  static make$($self,destination,title) {
    if (title === undefined) title = null;
    LinkNode.make$($self, destination, title);
    return;
  }

}

class LinkReferenceDefinition extends Block {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LinkReferenceDefinition.type$; }

  #label = null;

  label() { return this.#label; }

  __label(it) { if (it === undefined) return this.#label; else this.#label = it; }

  #destination = null;

  destination() { return this.#destination; }

  __destination(it) { if (it === undefined) return this.#destination; else this.#destination = it; }

  #title = null;

  title() { return this.#title; }

  __title(it) { if (it === undefined) return this.#title; else this.#title = it; }

  static make(label,destination,title) {
    const $self = new LinkReferenceDefinition();
    LinkReferenceDefinition.make$($self,label,destination,title);
    return $self;
  }

  static make$($self,label,destination,title) {
    Block.make$($self);
    $self.#label = label;
    $self.#destination = destination;
    $self.#title = title;
    return;
  }

}

class Visitor {
  constructor() {
    const this$ = this;
  }

  typeof() { return Visitor.type$; }

  visitBlockQuote(node) {
    this.visitChildren(node);
    return;
  }

  visitBulletList(node) {
    this.visitChildren(node);
    return;
  }

  visitCode(node) {
    this.visitChildren(node);
    return;
  }

  visitCustomBlock(node) {
    this.visitChildren(node);
    return;
  }

  visitCustomNode(node) {
    this.visitChildren(node);
    return;
  }

  visitDocument(node) {
    this.visitChildren(node);
    return;
  }

  visitEmphasis(node) {
    this.visitChildren(node);
    return;
  }

  visitFencedCode(node) {
    this.visitChildren(node);
    return;
  }

  visitHardLineBreak(node) {
    this.visitChildren(node);
    return;
  }

  visitHeading(node) {
    this.visitChildren(node);
    return;
  }

  visitHtmlBlock(node) {
    this.visitChildren(node);
    return;
  }

  visitHtmlInline(node) {
    this.visitChildren(node);
    return;
  }

  visitImage(node) {
    this.visitChildren(node);
    return;
  }

  visitIndentedCode(node) {
    this.visitChildren(node);
    return;
  }

  visitLink(node) {
    this.visitChildren(node);
    return;
  }

  visitListItem(node) {
    this.visitChildren(node);
    return;
  }

  visitLinkReferenceDefinition(node) {
    this.visitChildren(node);
    return;
  }

  visitOrderedList(node) {
    this.visitChildren(node);
    return;
  }

  visitParagraph(node) {
    this.visitChildren(node);
    return;
  }

  visitSoftLineBreak(node) {
    this.visitChildren(node);
    return;
  }

  visitStrongEmphasis(node) {
    this.visitChildren(node);
    return;
  }

  visitText(node) {
    this.visitChildren(node);
    return;
  }

  visitThematicBreak(node) {
    this.visitChildren(node);
    return;
  }

  visitChildren(parent) {
    let node = parent.firstChild();
    while (node != null) {
      let saveNext = node.next();
      node.walk(this);
      (node = saveNext);
    }
    ;
    return;
  }

}

class Xetodoc extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Xetodoc.type$; }

  static #exts = undefined;

  static exts() {
    if (Xetodoc.#exts === undefined) {
      Xetodoc.static$init();
      if (Xetodoc.#exts === undefined) Xetodoc.#exts = null;
    }
    return Xetodoc.#exts;
  }

  static #xetodoc = undefined;

  static xetodoc() {
    if (Xetodoc.#xetodoc === undefined) {
      Xetodoc.static$init();
      if (Xetodoc.#xetodoc === undefined) Xetodoc.#xetodoc = null;
    }
    return Xetodoc.#xetodoc;
  }

  static #htmlRenderer = undefined;

  static htmlRenderer() {
    if (Xetodoc.#htmlRenderer === undefined) {
      Xetodoc.static$init();
      if (Xetodoc.#htmlRenderer === undefined) Xetodoc.#htmlRenderer = null;
    }
    return Xetodoc.#htmlRenderer;
  }

  static #markdownRenderer = undefined;

  static markdownRenderer() {
    if (Xetodoc.#markdownRenderer === undefined) {
      Xetodoc.static$init();
      if (Xetodoc.#markdownRenderer === undefined) Xetodoc.#markdownRenderer = null;
    }
    return Xetodoc.#markdownRenderer;
  }

  static parse(source,linkResolver) {
    if (linkResolver === undefined) linkResolver = null;
    return sys.ObjUtil.coerce(Xetodoc.parser(linkResolver).parse(source), Document.type$);
  }

  static parser(linkResolver) {
    if (linkResolver === undefined) linkResolver = null;
    const this$ = this;
    let builder = Xetodoc.parserBuilder();
    if (linkResolver != null) {
      let unsafe = sys.Unsafe.make(linkResolver);
      builder.postProcessorFactory(() => {
        return sys.ObjUtil.coerce(unsafe.val(), LinkResolver.type$);
      });
    }
    ;
    return builder.build();
  }

  static parserBuilder() {
    return Parser.builder().extensions(Xetodoc.xetodoc());
  }

  static toHtml(source,linkResolver) {
    if (linkResolver === undefined) linkResolver = null;
    return Xetodoc.htmlRenderer().render(Xetodoc.parser(linkResolver).parse(source));
  }

  static renderToHtml(node) {
    return Xetodoc.htmlRenderer().render(node);
  }

  static htmlBuilder() {
    return HtmlRenderer.builder().extensions(Xetodoc.xetodoc());
  }

  renderToMarkdown(node) {
    return Xetodoc.markdownRenderer().render(node);
  }

  static markdownBuilder() {
    return MarkdownRenderer.builder().extensions(Xetodoc.xetodoc());
  }

  extendParser(builder) {
    builder.customInlineContentParserFactory(TicksInlineParser.factory()).customInlineContentParserFactory(BackticksLinkParser.factory()).extensions(Xetodoc.exts());
    return;
  }

  extendHtml(builder) {
    builder.extensions(Xetodoc.exts());
    return;
  }

  extendMarkdown(builder) {
    const this$ = this;
    builder.nodeRendererFactory((cx) => {
      return MdTicksRenderer.make(cx);
    }).extensions(Xetodoc.exts());
    return;
  }

  static make() {
    const $self = new Xetodoc();
    Xetodoc.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    Xetodoc.#exts = sys.ObjUtil.coerce(((this$) => { let $_u4 = sys.List.make(MarkdownExt.type$, [ImgAttrsExt.make(), TablesExt.make()]); if ($_u4 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(MarkdownExt.type$, [ImgAttrsExt.make(), TablesExt.make()])); })(this), sys.Type.find("markdown::MarkdownExt[]"));
    Xetodoc.#xetodoc = sys.ObjUtil.coerce(((this$) => { let $_u5 = sys.List.make(MarkdownExt.type$, [Xetodoc.make()]); if ($_u5 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(MarkdownExt.type$, [Xetodoc.make()])); })(this), sys.Type.find("markdown::MarkdownExt[]"));
    Xetodoc.#htmlRenderer = Xetodoc.htmlBuilder().build();
    Xetodoc.#markdownRenderer = Xetodoc.markdownBuilder().build();
    return;
  }

}

class InlineContentParser {
  constructor() {
    const this$ = this;
  }

  typeof() { return InlineContentParser.type$; }

}

class InlineCodeParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#maxMarkers = sys.Int.maxVal();
    return;
  }

  typeof() { return InlineCodeParser.type$; }

  #markerChar = 0;

  markerChar() { return this.#markerChar; }

  __markerChar(it) { if (it === undefined) return this.#markerChar; else this.#markerChar = it; }

  #maxMarkers = 0;

  // private field reflection only
  __maxMarkers(it) { if (it === undefined) return this.#maxMarkers; else this.#maxMarkers = it; }

  static make(markerChar) {
    const $self = new InlineCodeParser();
    InlineCodeParser.make$($self,markerChar);
    return $self;
  }

  static make$($self,markerChar) {
    ;
    $self.#markerChar = markerChar;
    return;
  }

  withMaxMarkers(max) {
    this.#maxMarkers = sys.Int.max(1, max);
    return this;
  }

  tryParse(state) {
    let scanner = state.scanner();
    let start = scanner.pos();
    let openingMarkers = scanner.matchMultiple(this.#markerChar);
    let afterOpening = scanner.pos();
    if (sys.ObjUtil.compareGT(openingMarkers, this.#maxMarkers)) {
      return ParsedInline.none();
    }
    ;
    while (sys.ObjUtil.compareGT(scanner.find(this.#markerChar), 0)) {
      let beforeClosing = scanner.pos();
      let count = scanner.matchMultiple(this.#markerChar);
      if (sys.ObjUtil.equals(count, openingMarkers)) {
        let content = scanner.source(afterOpening, beforeClosing).content();
        (content = sys.Str.replace(content, "\n", " "));
        if ((sys.ObjUtil.compareGE(sys.Str.size(content), 3) && sys.ObjUtil.equals(sys.Str.get(content, 0), 32) && sys.ObjUtil.equals(sys.Str.get(content, -1), 32) && Chars.hasNonSpace(content))) {
          (content = sys.Str.getRange(content, sys.Range.make(1, sys.Int.minus(sys.Str.size(content), 1), true)));
        }
        ;
        let node = Code.make(content);
        return ParsedInline.of(node, scanner.pos());
      }
      ;
    }
    ;
    let source = scanner.source(start, afterOpening);
    let text = Text.make(source.content());
    return ParsedInline.of(text, afterOpening);
  }

}

class TicksInlineParser extends InlineCodeParser {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TicksInlineParser.type$; }

  static #factory = undefined;

  static factory() {
    if (TicksInlineParser.#factory === undefined) {
      TicksInlineParser.static$init();
      if (TicksInlineParser.#factory === undefined) TicksInlineParser.#factory = null;
    }
    return TicksInlineParser.#factory;
  }

  static make() {
    const $self = new TicksInlineParser();
    TicksInlineParser.make$($self);
    return $self;
  }

  static make$($self) {
    InlineCodeParser.make$($self, 39);
    return;
  }

  static static$init() {
    TicksInlineParser.#factory = TicksInlineParserFactory.make();
    return;
  }

}

class InlineContentParserFactory {
  constructor() {
    const this$ = this;
  }

  typeof() { return InlineContentParserFactory.type$; }

}

class TicksInlineParserFactory extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#triggerChars = sys.ObjUtil.coerce(((this$) => { let $_u6 = sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(39, sys.Obj.type$.toNullable())]); if ($_u6 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(39, sys.Obj.type$.toNullable())])); })(this), sys.Type.find("sys::Int[]"));
    return;
  }

  typeof() { return TicksInlineParserFactory.type$; }

  #triggerChars = null;

  triggerChars() { return this.#triggerChars; }

  __triggerChars(it) { if (it === undefined) return this.#triggerChars; else this.#triggerChars = it; }

  create() {
    return TicksInlineParser.make();
  }

  static make() {
    const $self = new TicksInlineParserFactory();
    TicksInlineParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class BackticksLinkParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BackticksLinkParser.type$; }

  static #factory = undefined;

  static factory() {
    if (BackticksLinkParser.#factory === undefined) {
      BackticksLinkParser.static$init();
      if (BackticksLinkParser.#factory === undefined) BackticksLinkParser.#factory = null;
    }
    return BackticksLinkParser.#factory;
  }

  tryParse(state) {
    let res = sys.ObjUtil.coerce(BackticksInlineParser.make().withMaxMarkers(1), BackticksInlineParser.type$).tryParse(state);
    if (res == null) {
      return res;
    }
    ;
    let code = sys.ObjUtil.coerce(res.node(), Code.type$);
    let link = sys.ObjUtil.coerce(Link.make(code.literal()).appendChild(Text.make(code.literal())), Link.type$);
    return ParsedInline.of(link, res.pos());
  }

  static make() {
    const $self = new BackticksLinkParser();
    BackticksLinkParser.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    BackticksLinkParser.#factory = BackticksLinkParserFactory.make();
    return;
  }

}

class BackticksLinkParserFactory extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#triggerChars = sys.ObjUtil.coerce(((this$) => { let $_u7 = sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(96, sys.Obj.type$.toNullable())]); if ($_u7 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(96, sys.Obj.type$.toNullable())])); })(this), sys.Type.find("sys::Int[]"));
    return;
  }

  typeof() { return BackticksLinkParserFactory.type$; }

  #triggerChars = null;

  triggerChars() { return this.#triggerChars; }

  __triggerChars(it) { if (it === undefined) return this.#triggerChars; else this.#triggerChars = it; }

  create() {
    return BackticksLinkParser.make();
  }

  static make() {
    const $self = new BackticksLinkParserFactory();
    BackticksLinkParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class NodeRenderer {
  constructor() {
    const this$ = this;
  }

  typeof() { return NodeRenderer.type$; }

  beforeRoot(rootNode) {
    return;
  }

  afterRoot(rootNode) {
    return;
  }

}

class MdTicksRenderer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#nodeTypes = sys.ObjUtil.coerce(((this$) => { let $_u8 = sys.List.make(sys.Type.type$, [Code.type$]); if ($_u8 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Type.type$, [Code.type$])); })(this), sys.Type.find("sys::Type[]"));
    return;
  }

  typeof() { return MdTicksRenderer.type$; }

  afterRoot() { return NodeRenderer.prototype.afterRoot.apply(this, arguments); }

  beforeRoot() { return NodeRenderer.prototype.beforeRoot.apply(this, arguments); }

  #cx = null;

  // private field reflection only
  __cx(it) { if (it === undefined) return this.#cx; else this.#cx = it; }

  #nodeTypes = null;

  nodeTypes() { return this.#nodeTypes; }

  __nodeTypes(it) { if (it === undefined) return this.#nodeTypes; else this.#nodeTypes = it; }

  static make(cx) {
    const $self = new MdTicksRenderer();
    MdTicksRenderer.make$($self,cx);
    return $self;
  }

  static make$($self,cx) {
    ;
    $self.#cx = cx;
    return;
  }

  render(node) {
    CoreMarkdownNodeRenderer.writeCode(this.#cx.writer(), sys.ObjUtil.coerce(node, Code.type$), 39);
    return;
  }

}

class TablesExt extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TablesExt.type$; }

  extendParser(builder) {
    builder.customBlockParserFactory(TableParser.factory());
    return;
  }

  extendHtml(builder) {
    const this$ = this;
    builder.nodeRendererFactory((cx) => {
      return TableRenderer.make(cx);
    });
    return;
  }

  extendMarkdown(builder) {
    const this$ = this;
    builder.nodeRendererFactory((cx) => {
      return MarkdownTableRenderer.make(cx);
    }).withSpecialChars(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(124, sys.Obj.type$.toNullable())]));
    return;
  }

  static make() {
    const $self = new TablesExt();
    TablesExt.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class Table extends CustomBlock {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Table.type$; }

  static make() {
    const $self = new Table();
    Table.make$($self);
    return $self;
  }

  static make$($self) {
    CustomBlock.make$($self);
    return;
  }

}

class TableHead extends CustomNode {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TableHead.type$; }

  static make() {
    const $self = new TableHead();
    TableHead.make$($self);
    return $self;
  }

  static make$($self) {
    CustomNode.make$($self);
    return;
  }

}

class TableBody extends CustomNode {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TableBody.type$; }

  static make() {
    const $self = new TableBody();
    TableBody.make$($self);
    return $self;
  }

  static make$($self) {
    CustomNode.make$($self);
    return;
  }

}

class TableRow extends CustomNode {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TableRow.type$; }

  static make() {
    const $self = new TableRow();
    TableRow.make$($self);
    return $self;
  }

  static make$($self) {
    CustomNode.make$($self);
    return;
  }

}

class TableCell extends CustomNode {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TableCell.type$; }

  #header = false;

  header(it) {
    if (it === undefined) {
      return this.#header;
    }
    else {
      this.#header = it;
      return;
    }
  }

  #alignment = null;

  alignment(it) {
    if (it === undefined) {
      return this.#alignment;
    }
    else {
      this.#alignment = it;
      return;
    }
  }

  #width = 0;

  width(it) {
    if (it === undefined) {
      return this.#width;
    }
    else {
      this.#width = it;
      return;
    }
  }

  static make() {
    const $self = new TableCell();
    TableCell.make$($self);
    return $self;
  }

  static make$($self) {
    TableCell.makeFields$($self, false, Alignment.unspecified(), 0);
    return;
  }

  static makeFields(header,alignment,width) {
    const $self = new TableCell();
    TableCell.makeFields$($self,header,alignment,width);
    return $self;
  }

  static makeFields$($self,header,alignment,width) {
    CustomNode.make$($self);
    $self.#header = header;
    $self.#alignment = alignment;
    $self.#width = width;
    return;
  }

  toStrAttributes() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("(header=", sys.ObjUtil.coerce(this.#header, sys.Obj.type$.toNullable())), ", align="), this.#alignment), ", width="), sys.ObjUtil.coerce(this.#width, sys.Obj.type$.toNullable())), ")");
  }

}

class Alignment extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Alignment.type$; }

  static unspecified() { return Alignment.vals().get(0); }

  static left() { return Alignment.vals().get(1); }

  static center() { return Alignment.vals().get(2); }

  static right() { return Alignment.vals().get(3); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new Alignment();
    Alignment.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(Alignment.type$, Alignment.vals(), name$, checked);
  }

  static vals() {
    if (Alignment.#vals == null) {
      Alignment.#vals = sys.List.make(Alignment.type$, [
        Alignment.make(0, "unspecified", ),
        Alignment.make(1, "left", ),
        Alignment.make(2, "center", ),
        Alignment.make(3, "right", ),
      ]).toImmutable();
    }
    return Alignment.#vals;
  }

  static static$init() {
    const $_u9 = Alignment.vals();
    if (true) {
    }
    ;
    return;
  }

}

class BlockParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BlockParser.type$; }

  isContainer() {
    return false;
  }

  canHaveLazyContinuationLines() {
    return false;
  }

  canContain(childBlock) {
    return false;
  }

  addLine(line) {
    return;
  }

  addSourceSpan(sourceSpan) {
    this.block().addSourceSpan(sourceSpan);
    return;
  }

  definitions() {
    return sys.ObjUtil.coerce(DefinitionMap.type$.emptyList(), sys.Type.find("markdown::DefinitionMap[]"));
  }

  closeBlock() {
    return;
  }

  parseInlines(inlineParser) {
    return;
  }

  static make() {
    const $self = new BlockParser();
    BlockParser.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class TableParser extends BlockParser {
  constructor() {
    super();
    const this$ = this;
    this.#rowLines = sys.List.make(SourceLine.type$);
    this.#block = Table.make();
    this.#canHaveLazyContinuationLines = true;
    return;
  }

  typeof() { return TableParser.type$; }

  #columns = null;

  // private field reflection only
  __columns(it) { if (it === undefined) return this.#columns; else this.#columns = it; }

  #rowLines = null;

  // private field reflection only
  __rowLines(it) { if (it === undefined) return this.#rowLines; else this.#rowLines = it; }

  #block = null;

  block() {
    return this.#block;
  }

  #canHaveLazyContinuationLines = false;

  canHaveLazyContinuationLines() {
    return this.#canHaveLazyContinuationLines;
  }

  static #factory = undefined;

  static factory() {
    if (TableParser.#factory === undefined) {
      TableParser.static$init();
      if (TableParser.#factory === undefined) TableParser.#factory = null;
    }
    return TableParser.#factory;
  }

  static make(columns,headerLine) {
    const $self = new TableParser();
    TableParser.make$($self,columns,headerLine);
    return $self;
  }

  static make$($self,columns,headerLine) {
    BlockParser.make$($self);
    ;
    $self.#columns = columns;
    $self.#rowLines.add(headerLine);
    return;
  }

  tryContinue(state) {
    let content = state.line().content();
    let pipe = Chars.find(124, content, state.nextNonSpaceIndex());
    if (sys.ObjUtil.compareNE(pipe, -1)) {
      if (sys.ObjUtil.equals(pipe, state.nextNonSpaceIndex())) {
        if (sys.ObjUtil.equals(Chars.skipSpaceTab(content, sys.Int.plus(pipe, 1)), sys.Str.size(content))) {
          this.#canHaveLazyContinuationLines = false;
          return BlockContinue.none();
        }
        ;
      }
      ;
      return BlockContinue.atIndex(state.index());
    }
    ;
    return BlockContinue.none();
  }

  addLine(line) {
    this.#rowLines.add(line);
    return;
  }

  parseInlines(parser) {
    const this$ = this;
    let sourceSpans = this.block().sourceSpans();
    let headerSourceSpan = ((this$) => { if (!sourceSpans.isEmpty()) return sourceSpans.first(); return null; })(this);
    let head = TableHead.make();
    head.addSourceSpan(headerSourceSpan);
    this.block().appendChild(head);
    let headerRow = TableRow.make();
    headerRow.setSourceSpans(sys.ObjUtil.coerce(head.sourceSpans(), sys.Type.find("markdown::SourceSpan[]")));
    head.appendChild(headerRow);
    let headerCells = TableParser.split(this.#rowLines.get(0));
    headerCells.each((cell,i) => {
      let tableCell = this$.parseCell(cell, i, parser);
      tableCell.header(true);
      headerRow.appendChild(tableCell);
      return;
    });
    let body = null;
    for (let rowIndex = 2; sys.ObjUtil.compareLT(rowIndex, this.#rowLines.size()); rowIndex = sys.Int.increment(rowIndex)) {
      let rowLine = this.#rowLines.get(rowIndex);
      let sourceSpan = ((this$) => { if (sys.ObjUtil.compareLT(rowIndex, sourceSpans.size())) return sourceSpans.get(rowIndex); return null; })(this);
      let cells = TableParser.split(rowLine);
      let row = TableRow.make();
      row.addSourceSpan(sourceSpan);
      for (let i = 0; sys.ObjUtil.compareLT(i, headerCells.size()); i = sys.Int.increment(i)) {
        let cell = ((this$) => { if (sys.ObjUtil.compareLT(i, cells.size())) return cells.get(i); return SourceLine.make("", null); })(this);
        let tableCell = this.parseCell(cell, i, parser);
        row.appendChild(tableCell);
      }
      ;
      if (body == null) {
        (body = TableBody.make());
        this.block().appendChild(sys.ObjUtil.coerce(body, Node.type$));
      }
      ;
      body.appendChild(row);
      body.addSourceSpan(sourceSpan);
    }
    ;
    return;
  }

  parseCell(cell,column,parser) {
    let tableCell = TableCell.make();
    tableCell.addSourceSpan(cell.sourceSpan());
    if (sys.ObjUtil.compareLT(column, this.#columns.size())) {
      let info = this.#columns.get(column);
      tableCell.alignment(info.alignment());
      tableCell.width(info.width());
    }
    ;
    let content = cell.content();
    let start = Chars.skipSpaceTab(content);
    let end = Chars.skipSpaceTabBackwards(content, sys.Int.minus(sys.Str.size(content), 1), start);
    parser.parse(SourceLines.makeOne(cell.substring(start, sys.Int.plus(end, 1))), tableCell);
    return tableCell;
  }

  static split(line) {
    let row = line.content();
    let nonSpace = Chars.skipSpaceTab(row);
    let cellStart = nonSpace;
    let cellEnd = sys.Str.size(row);
    if (sys.ObjUtil.equals(sys.Str.get(row, nonSpace), 124)) {
      (cellStart = sys.Int.plus(nonSpace, 1));
      let nonSpaceEnd = Chars.skipSpaceTabBackwards(row, sys.Int.minus(sys.Str.size(row), 1), cellStart);
      (cellEnd = sys.Int.plus(nonSpaceEnd, 1));
    }
    ;
    let cells = sys.List.make(SourceLine.type$);
    let sb = sys.StrBuf.make();
    for (let i = cellStart; sys.ObjUtil.compareLT(i, cellEnd); i = sys.Int.increment(i)) {
      let c = sys.Str.get(row, i);
      let $_u13 = c;
      if (sys.ObjUtil.equals($_u13, 92)) {
        if ((sys.ObjUtil.compareLT(sys.Int.plus(i, 1), cellEnd) && sys.ObjUtil.equals(sys.Str.get(row, sys.Int.plus(i, 1)), 124))) {
          sb.addChar(124);
          i = sys.Int.increment(i);
        }
        else {
          sb.addChar(92);
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u13, 124)) {
        let content = sb.toStr();
        cells.add(SourceLine.make(content, line.substring(cellStart, i).sourceSpan()));
        sb.clear();
        (cellStart = sys.Int.plus(i, 1));
      }
      else {
        sb.addChar(c);
      }
      ;
    }
    ;
    if (sys.ObjUtil.compareGT(sb.size(), 0)) {
      let content = sb.toStr();
      cells.add(SourceLine.make(content, line.substring(cellStart, sys.Str.size(line.content())).sourceSpan()));
    }
    ;
    return cells;
  }

  static static$init() {
    TableParser.#factory = TableParserFactory.make();
    return;
  }

}

class BlockParserFactory extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BlockParserFactory.type$; }

  static make() {
    const $self = new BlockParserFactory();
    BlockParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class TableParserFactory extends BlockParserFactory {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TableParserFactory.type$; }

  tryStart(state,parser) {
    let paraLines = parser.paragraphLines().lines();
    if ((sys.ObjUtil.equals(paraLines.size(), 1) && sys.ObjUtil.compareNE(Chars.find(124, paraLines.first().content(), 0), -1))) {
      let line = state.line();
      let separatorLine = line.substring(state.index(), sys.Str.size(line.content()));
      let columns = TableParserFactory.parseSeparator(separatorLine.content());
      if ((columns != null && !columns.isEmpty())) {
        let paragraph = paraLines.get(0);
        let headerCells = TableParser.split(paragraph);
        if (sys.ObjUtil.compareGE(columns.size(), headerCells.size())) {
          return sys.ObjUtil.coerce(sys.ObjUtil.coerce(BlockStart.of(sys.List.make(TableParser.type$, [TableParser.make(sys.ObjUtil.coerce(columns, sys.Type.find("markdown::TableCell[]")), paragraph)])).atIndex(state.index()), BlockStart.type$.toNullable()).replaceActiveBlockParser(), BlockStart.type$.toNullable());
        }
        ;
      }
      ;
    }
    ;
    return BlockStart.none();
  }

  static parseSeparator(s) {
    let columns = sys.List.make(TableCell.type$);
    let pipes = 0;
    let valid = false;
    let i = 0;
    let width = 0;
    while (sys.ObjUtil.compareLT(i, sys.Str.size(s))) {
      let c = sys.Str.get(s, i);
      let $_u14 = c;
      if (sys.ObjUtil.equals($_u14, 124)) {
        i = sys.Int.increment(i);
        pipes = sys.Int.increment(pipes);
        if (sys.ObjUtil.compareGT(pipes, 1)) {
          return null;
        }
        ;
        (valid = true);
      }
      else if (sys.ObjUtil.equals($_u14, 45) || sys.ObjUtil.equals($_u14, 58)) {
        if ((sys.ObjUtil.equals(pipes, 0) && !columns.isEmpty())) {
          return null;
        }
        ;
        let left = false;
        let right = false;
        if (sys.ObjUtil.equals(c, 58)) {
          (left = true);
          i = sys.Int.increment(i);
          width = sys.Int.increment(width);
        }
        ;
        let haveDash = false;
        while ((sys.ObjUtil.compareLT(i, sys.Str.size(s)) && sys.ObjUtil.equals(sys.Str.get(s, i), 45))) {
          i = sys.Int.increment(i);
          width = sys.Int.increment(width);
          (haveDash = true);
        }
        ;
        if (!haveDash) {
          return null;
        }
        ;
        if ((sys.ObjUtil.compareLT(i, sys.Str.size(s)) && sys.ObjUtil.equals(sys.Str.get(s, i), 58))) {
          (right = true);
          i = sys.Int.increment(i);
          width = sys.Int.increment(width);
        }
        ;
        columns.add(TableCell.makeFields(false, TableParserFactory.toAlignment(left, right), width));
        (width = 0);
        (pipes = 0);
      }
      else if (sys.ObjUtil.equals($_u14, 32) || sys.ObjUtil.equals($_u14, 9)) {
        i = sys.Int.increment(i);
      }
      else {
        return null;
      }
      ;
    }
    ;
    return ((this$) => { if (valid) return columns; return null; })(this);
  }

  static toAlignment(left,right) {
    if ((left && right)) {
      return Alignment.center();
    }
    else {
      if (left) {
        return Alignment.left();
      }
      else {
        if (right) {
          return Alignment.right();
        }
        else {
          return Alignment.unspecified();
        }
        ;
      }
      ;
    }
    ;
  }

  static make() {
    const $self = new TableParserFactory();
    TableParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    BlockParserFactory.make$($self);
    return;
  }

}

class TableRenderer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#nodeTypes = sys.ObjUtil.coerce(((this$) => { let $_u16 = sys.List.make(sys.Type.type$, [Table.type$, TableHead.type$, TableBody.type$, TableRow.type$, TableCell.type$]); if ($_u16 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Type.type$, [Table.type$, TableHead.type$, TableBody.type$, TableRow.type$, TableCell.type$])); })(this), sys.Type.find("sys::Type[]"));
    return;
  }

  typeof() { return TableRenderer.type$; }

  afterRoot() { return NodeRenderer.prototype.afterRoot.apply(this, arguments); }

  beforeRoot() { return NodeRenderer.prototype.beforeRoot.apply(this, arguments); }

  visitBulletList() { return Visitor.prototype.visitBulletList.apply(this, arguments); }

  visitCustomNode() { return Visitor.prototype.visitCustomNode.apply(this, arguments); }

  visitFencedCode() { return Visitor.prototype.visitFencedCode.apply(this, arguments); }

  visitThematicBreak() { return Visitor.prototype.visitThematicBreak.apply(this, arguments); }

  visitChildren() { return Visitor.prototype.visitChildren.apply(this, arguments); }

  visitLinkReferenceDefinition() { return Visitor.prototype.visitLinkReferenceDefinition.apply(this, arguments); }

  visitHeading() { return Visitor.prototype.visitHeading.apply(this, arguments); }

  visitDocument() { return Visitor.prototype.visitDocument.apply(this, arguments); }

  visitStrongEmphasis() { return Visitor.prototype.visitStrongEmphasis.apply(this, arguments); }

  visitText() { return Visitor.prototype.visitText.apply(this, arguments); }

  visitListItem() { return Visitor.prototype.visitListItem.apply(this, arguments); }

  visitOrderedList() { return Visitor.prototype.visitOrderedList.apply(this, arguments); }

  visitCode() { return Visitor.prototype.visitCode.apply(this, arguments); }

  visitHtmlBlock() { return Visitor.prototype.visitHtmlBlock.apply(this, arguments); }

  visitHardLineBreak() { return Visitor.prototype.visitHardLineBreak.apply(this, arguments); }

  visitParagraph() { return Visitor.prototype.visitParagraph.apply(this, arguments); }

  visitCustomBlock() { return Visitor.prototype.visitCustomBlock.apply(this, arguments); }

  visitLink() { return Visitor.prototype.visitLink.apply(this, arguments); }

  visitBlockQuote() { return Visitor.prototype.visitBlockQuote.apply(this, arguments); }

  visitIndentedCode() { return Visitor.prototype.visitIndentedCode.apply(this, arguments); }

  visitSoftLineBreak() { return Visitor.prototype.visitSoftLineBreak.apply(this, arguments); }

  visitEmphasis() { return Visitor.prototype.visitEmphasis.apply(this, arguments); }

  visitImage() { return Visitor.prototype.visitImage.apply(this, arguments); }

  visitHtmlInline() { return Visitor.prototype.visitHtmlInline.apply(this, arguments); }

  #cx = null;

  // private field reflection only
  __cx(it) { if (it === undefined) return this.#cx; else this.#cx = it; }

  #html = null;

  // private field reflection only
  __html(it) { if (it === undefined) return this.#html; else this.#html = it; }

  #nodeTypes = null;

  nodeTypes() { return this.#nodeTypes; }

  __nodeTypes(it) { if (it === undefined) return this.#nodeTypes; else this.#nodeTypes = it; }

  static make(cx) {
    const $self = new TableRenderer();
    TableRenderer.make$($self,cx);
    return $self;
  }

  static make$($self,cx) {
    ;
    $self.#cx = cx;
    $self.#html = cx.writer();
    return;
  }

  render(node) {
    node.walk(this);
    return;
  }

  visitTable(table) {
    this.renderTableNode(table, "table");
    return;
  }

  visitTableHead(head) {
    this.renderTableNode(head, "thead");
    return;
  }

  visitTableBody(body) {
    this.renderTableNode(body, "tbody");
    return;
  }

  visitTableRow(row) {
    this.renderTableNode(row, "tr");
    return;
  }

  visitTableCell(cell) {
    let tagName = ((this$) => { if (cell.header()) return "th"; return "td"; })(this);
    this.renderTableNode(cell, tagName, this.cellAttrs(cell, tagName));
    return;
  }

  renderTableNode(node,tagName,attrs) {
    if (attrs === undefined) attrs = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str?]"));
    this.#html.line();
    this.#html.tag(tagName, this.toAttrs(node, tagName, attrs));
    this.renderChildren(node);
    this.#html.tag(sys.Str.plus("/", tagName));
    this.#html.line();
    return;
  }

  renderChildren(parent) {
    let node = parent.firstChild();
    while (node != null) {
      let next = node.next();
      this.#cx.render(sys.ObjUtil.coerce(node, Node.type$));
      (node = next);
    }
    ;
    return;
  }

  cellAttrs(cell,tagName) {
    const this$ = this;
    let attrs = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"));
    if (cell.alignment() !== Alignment.unspecified()) {
      attrs.set("align", sys.Str.lower(cell.alignment().name()));
    }
    ;
    return attrs;
  }

  toAttrs(node,tagName,attrs) {
    return this.#cx.extendAttrs(node, tagName, attrs);
  }

}

class MarkdownTableRenderer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#columns = sys.List.make(Alignment.type$);
    this.#nodeTypes = sys.ObjUtil.coerce(((this$) => { let $_u18 = sys.List.make(sys.Type.type$, [Table.type$, TableHead.type$, TableBody.type$, TableRow.type$, TableCell.type$]); if ($_u18 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Type.type$, [Table.type$, TableHead.type$, TableBody.type$, TableRow.type$, TableCell.type$])); })(this), sys.Type.find("sys::Type[]"));
    return;
  }

  typeof() { return MarkdownTableRenderer.type$; }

  afterRoot() { return NodeRenderer.prototype.afterRoot.apply(this, arguments); }

  beforeRoot() { return NodeRenderer.prototype.beforeRoot.apply(this, arguments); }

  visitBulletList() { return Visitor.prototype.visitBulletList.apply(this, arguments); }

  visitCustomNode() { return Visitor.prototype.visitCustomNode.apply(this, arguments); }

  visitFencedCode() { return Visitor.prototype.visitFencedCode.apply(this, arguments); }

  visitThematicBreak() { return Visitor.prototype.visitThematicBreak.apply(this, arguments); }

  visitChildren() { return Visitor.prototype.visitChildren.apply(this, arguments); }

  visitLinkReferenceDefinition() { return Visitor.prototype.visitLinkReferenceDefinition.apply(this, arguments); }

  visitHeading() { return Visitor.prototype.visitHeading.apply(this, arguments); }

  visitDocument() { return Visitor.prototype.visitDocument.apply(this, arguments); }

  visitStrongEmphasis() { return Visitor.prototype.visitStrongEmphasis.apply(this, arguments); }

  visitText() { return Visitor.prototype.visitText.apply(this, arguments); }

  visitListItem() { return Visitor.prototype.visitListItem.apply(this, arguments); }

  visitOrderedList() { return Visitor.prototype.visitOrderedList.apply(this, arguments); }

  visitCode() { return Visitor.prototype.visitCode.apply(this, arguments); }

  visitHtmlBlock() { return Visitor.prototype.visitHtmlBlock.apply(this, arguments); }

  visitHardLineBreak() { return Visitor.prototype.visitHardLineBreak.apply(this, arguments); }

  visitParagraph() { return Visitor.prototype.visitParagraph.apply(this, arguments); }

  visitCustomBlock() { return Visitor.prototype.visitCustomBlock.apply(this, arguments); }

  visitLink() { return Visitor.prototype.visitLink.apply(this, arguments); }

  visitBlockQuote() { return Visitor.prototype.visitBlockQuote.apply(this, arguments); }

  visitIndentedCode() { return Visitor.prototype.visitIndentedCode.apply(this, arguments); }

  visitSoftLineBreak() { return Visitor.prototype.visitSoftLineBreak.apply(this, arguments); }

  visitEmphasis() { return Visitor.prototype.visitEmphasis.apply(this, arguments); }

  visitImage() { return Visitor.prototype.visitImage.apply(this, arguments); }

  visitHtmlInline() { return Visitor.prototype.visitHtmlInline.apply(this, arguments); }

  static #pipe = undefined;

  static pipe() {
    if (MarkdownTableRenderer.#pipe === undefined) {
      MarkdownTableRenderer.static$init();
      if (MarkdownTableRenderer.#pipe === undefined) MarkdownTableRenderer.#pipe = null;
    }
    return MarkdownTableRenderer.#pipe;
  }

  #cx = null;

  // private field reflection only
  __cx(it) { if (it === undefined) return this.#cx; else this.#cx = it; }

  #writer = null;

  // private field reflection only
  __writer(it) { if (it === undefined) return this.#writer; else this.#writer = it; }

  #columns = null;

  // private field reflection only
  __columns(it) { if (it === undefined) return this.#columns; else this.#columns = it; }

  #nodeTypes = null;

  nodeTypes() { return this.#nodeTypes; }

  __nodeTypes(it) { if (it === undefined) return this.#nodeTypes; else this.#nodeTypes = it; }

  static make(cx) {
    const $self = new MarkdownTableRenderer();
    MarkdownTableRenderer.make$($self,cx);
    return $self;
  }

  static make$($self,cx) {
    ;
    $self.#cx = cx;
    $self.#writer = cx.writer();
    return;
  }

  render(node) {
    node.walk(this);
    return;
  }

  visitTable(node) {
    this.#columns.clear();
    this.#writer.pushTight(true);
    this.renderChildren(node);
    this.#writer.popTight();
    this.#writer.block();
    return;
  }

  visitTableHead(head) {
    const this$ = this;
    this.renderChildren(head);
    this.#columns.each((alignment) => {
      this$.#writer.raw(sys.ObjUtil.coerce(124, sys.Obj.type$));
      let $_u19 = alignment;
      if (sys.ObjUtil.equals($_u19, Alignment.left())) {
        this$.#writer.raw(":---");
      }
      else if (sys.ObjUtil.equals($_u19, Alignment.right())) {
        this$.#writer.raw("---:");
      }
      else if (sys.ObjUtil.equals($_u19, Alignment.center())) {
        this$.#writer.raw(":---:");
      }
      else {
        this$.#writer.raw("---");
      }
      ;
      return;
    });
    this.#writer.raw(sys.ObjUtil.coerce(124, sys.Obj.type$));
    this.#writer.block();
    return;
  }

  visitTableBody(body) {
    this.renderChildren(body);
    return;
  }

  visitTableRow(row) {
    this.renderChildren(row);
    this.#writer.raw(sys.ObjUtil.coerce(124, sys.Obj.type$));
    this.#writer.block();
    return;
  }

  visitTableCell(cell) {
    if ((cell.parent() != null && sys.ObjUtil.is(cell.parent().parent(), TableHead.type$))) {
      this.#columns.add(cell.alignment());
    }
    ;
    this.#writer.raw(sys.ObjUtil.coerce(124, sys.Obj.type$));
    this.#writer.pushRawEscape(MarkdownTableRenderer.pipe());
    this.renderChildren(cell);
    this.#writer.popRawEscape();
    return;
  }

  renderChildren(parent) {
    let node = parent.firstChild();
    while (node != null) {
      let next = node.next();
      this.#cx.render(sys.ObjUtil.coerce(node, Node.type$));
      (node = next);
    }
    ;
    return;
  }

  static static$init() {
    const this$ = this;
    MarkdownTableRenderer.#pipe = sys.ObjUtil.coerce(((this$) => { let $_u20 = (c) => {
      return sys.ObjUtil.equals(c, 124);
    }; if ($_u20 == null) return null; return sys.ObjUtil.toImmutable((c) => {
      return sys.ObjUtil.equals(c, 124);
    }); })(this), sys.Type.find("|sys::Int->sys::Bool|"));
    return;
  }

}

class ImgAttrsExt extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ImgAttrsExt.type$; }

  extendParser(builder) {
    builder.customDelimiterProcessor(ImgAttrsDelimiterProcessor.make());
    return;
  }

  extendHtml(builder) {
    const this$ = this;
    builder.attrProviderFactory((cx) => {
      return ImgAttrsAttrProvider.make();
    });
    return;
  }

  extendMarkdown(builder) {
    const this$ = this;
    builder.nodeRendererFactory((cx) => {
      return MarkdownImgAttrsRenderer.make(cx);
    });
    return;
  }

  static make() {
    const $self = new ImgAttrsExt();
    ImgAttrsExt.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class ImgAttrs extends CustomNode {
  constructor() {
    super();
    const this$ = this;
    this.#openingDelim = "{";
    this.#closingDelim = "}";
    return;
  }

  typeof() { return ImgAttrs.type$; }

  #attrs = null;

  attrs() { return this.#attrs; }

  __attrs(it) { if (it === undefined) return this.#attrs; else this.#attrs = it; }

  #openingDelim = null;

  openingDelim() { return this.#openingDelim; }

  __openingDelim(it) { if (it === undefined) return this.#openingDelim; else this.#openingDelim = it; }

  #closingDelim = null;

  closingDelim() { return this.#closingDelim; }

  __closingDelim(it) { if (it === undefined) return this.#closingDelim; else this.#closingDelim = it; }

  static make(attrs) {
    const $self = new ImgAttrs();
    ImgAttrs.make$($self,attrs);
    return $self;
  }

  static make$($self,attrs) {
    CustomNode.make$($self);
    ;
    $self.#attrs = sys.ObjUtil.coerce(((this$) => { let $_u21 = attrs; if ($_u21 == null) return null; return sys.ObjUtil.toImmutable(attrs); })($self), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

  toStrAttributes() {
    return sys.Str.plus("imgAttrs=", this.#attrs);
  }

}

class DelimiterProcessor {
  constructor() {
    const this$ = this;
  }

  typeof() { return DelimiterProcessor.type$; }

}

class ImgAttrsDelimiterProcessor extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#openingChar = 123;
    this.#closingChar = 125;
    this.#minLen = 1;
    return;
  }

  typeof() { return ImgAttrsDelimiterProcessor.type$; }

  static #supported_attrs = undefined;

  static supported_attrs() {
    if (ImgAttrsDelimiterProcessor.#supported_attrs === undefined) {
      ImgAttrsDelimiterProcessor.static$init();
      if (ImgAttrsDelimiterProcessor.#supported_attrs === undefined) ImgAttrsDelimiterProcessor.#supported_attrs = null;
    }
    return ImgAttrsDelimiterProcessor.#supported_attrs;
  }

  #openingChar = 0;

  openingChar() { return this.#openingChar; }

  __openingChar(it) { if (it === undefined) return this.#openingChar; else this.#openingChar = it; }

  #closingChar = 0;

  closingChar() { return this.#closingChar; }

  __closingChar(it) { if (it === undefined) return this.#closingChar; else this.#closingChar = it; }

  #minLen = 0;

  minLen() { return this.#minLen; }

  __minLen(it) { if (it === undefined) return this.#minLen; else this.#minLen = it; }

  process(openingRun,closingRun) {
    const this$ = this;
    if (sys.ObjUtil.compareNE(openingRun.size(), 1)) {
      return 0;
    }
    ;
    let opener = openingRun.opener();
    let nodeToStyle = opener.prev();
    if (!sys.ObjUtil.is(nodeToStyle, Image.type$)) {
      return 0;
    }
    ;
    let toUnlink = sys.List.make(Node.type$);
    let content = sys.StrBuf.make();
    let unsupported = false;
    Node.eachBetween(opener, closingRun.closer(), (node) => {
      if (unsupported) {
        return;
      }
      ;
      if (sys.ObjUtil.is(node, Text.type$)) {
        content.add(sys.ObjUtil.coerce(node, Text.type$).literal());
        toUnlink.add(node);
      }
      else {
        (unsupported = true);
      }
      ;
      return;
    });
    if (unsupported) {
      return 0;
    }
    ;
    let attrs = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"));
    let res = sys.Str.split(content.toStr()).eachWhile((s) => {
      let attr = sys.Str.split(s, sys.ObjUtil.coerce(61, sys.Int.type$.toNullable()));
      if ((sys.ObjUtil.compareGT(attr.size(), 1) && ImgAttrsDelimiterProcessor.supported_attrs().contains(sys.Str.lower(attr.get(0))))) {
        attrs.set(attr.get(0), attr.get(1));
        return null;
      }
      else {
        return sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable());
      }
      ;
    });
    if (res != null) {
      return 0;
    }
    ;
    toUnlink.each((it) => {
      it.unlink();
      return;
    });
    if (!attrs.isEmpty()) {
      nodeToStyle.appendChild(ImgAttrs.make(attrs));
    }
    ;
    return 1;
  }

  static make() {
    const $self = new ImgAttrsDelimiterProcessor();
    ImgAttrsDelimiterProcessor.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  static static$init() {
    ImgAttrsDelimiterProcessor.#supported_attrs = sys.ObjUtil.coerce(((this$) => { let $_u22 = sys.List.make(sys.Str.type$, ["width", "height"]); if ($_u22 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$, ["width", "height"])); })(this), sys.Type.find("sys::Str[]"));
    return;
  }

}

class AttrProvider {
  constructor() {
    const this$ = this;
  }

  typeof() { return AttrProvider.type$; }

}

class ImgAttrsAttrProvider extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ImgAttrsAttrProvider.type$; }

  setAttrs(node,tagName,attrs) {
    const this$ = this;
    if (sys.ObjUtil.is(node, Image.type$)) {
      Node.eachChild(node, (c) => {
        let imgAttrs = sys.ObjUtil.as(c, ImgAttrs.type$);
        if (imgAttrs == null) {
          return;
        }
        ;
        imgAttrs.attrs().each((v,k) => {
          attrs.set(k, v);
          return;
        });
        return;
      });
    }
    ;
    return;
  }

  static make() {
    const $self = new ImgAttrsAttrProvider();
    ImgAttrsAttrProvider.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class MarkdownImgAttrsRenderer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#nodeTypes = sys.ObjUtil.coerce(((this$) => { let $_u23 = sys.List.make(sys.Type.type$, [ImgAttrs.type$]); if ($_u23 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Type.type$, [ImgAttrs.type$])); })(this), sys.Type.find("sys::Type[]"));
    return;
  }

  typeof() { return MarkdownImgAttrsRenderer.type$; }

  visitBulletList() { return Visitor.prototype.visitBulletList.apply(this, arguments); }

  visitCustomNode() { return Visitor.prototype.visitCustomNode.apply(this, arguments); }

  visitFencedCode() { return Visitor.prototype.visitFencedCode.apply(this, arguments); }

  visitThematicBreak() { return Visitor.prototype.visitThematicBreak.apply(this, arguments); }

  visitChildren() { return Visitor.prototype.visitChildren.apply(this, arguments); }

  visitLinkReferenceDefinition() { return Visitor.prototype.visitLinkReferenceDefinition.apply(this, arguments); }

  visitHeading() { return Visitor.prototype.visitHeading.apply(this, arguments); }

  visitDocument() { return Visitor.prototype.visitDocument.apply(this, arguments); }

  visitStrongEmphasis() { return Visitor.prototype.visitStrongEmphasis.apply(this, arguments); }

  visitText() { return Visitor.prototype.visitText.apply(this, arguments); }

  visitListItem() { return Visitor.prototype.visitListItem.apply(this, arguments); }

  visitOrderedList() { return Visitor.prototype.visitOrderedList.apply(this, arguments); }

  visitCode() { return Visitor.prototype.visitCode.apply(this, arguments); }

  visitHtmlBlock() { return Visitor.prototype.visitHtmlBlock.apply(this, arguments); }

  visitHardLineBreak() { return Visitor.prototype.visitHardLineBreak.apply(this, arguments); }

  visitParagraph() { return Visitor.prototype.visitParagraph.apply(this, arguments); }

  visitCustomBlock() { return Visitor.prototype.visitCustomBlock.apply(this, arguments); }

  visitLink() { return Visitor.prototype.visitLink.apply(this, arguments); }

  visitBlockQuote() { return Visitor.prototype.visitBlockQuote.apply(this, arguments); }

  visitIndentedCode() { return Visitor.prototype.visitIndentedCode.apply(this, arguments); }

  visitSoftLineBreak() { return Visitor.prototype.visitSoftLineBreak.apply(this, arguments); }

  visitEmphasis() { return Visitor.prototype.visitEmphasis.apply(this, arguments); }

  visitImage() { return Visitor.prototype.visitImage.apply(this, arguments); }

  visitHtmlInline() { return Visitor.prototype.visitHtmlInline.apply(this, arguments); }

  #writer = null;

  // private field reflection only
  __writer(it) { if (it === undefined) return this.#writer; else this.#writer = it; }

  #nodeTypes = null;

  nodeTypes() { return this.#nodeTypes; }

  __nodeTypes(it) { if (it === undefined) return this.#nodeTypes; else this.#nodeTypes = it; }

  static make(cx) {
    const $self = new MarkdownImgAttrsRenderer();
    MarkdownImgAttrsRenderer.make$($self,cx);
    return $self;
  }

  static make$($self,cx) {
    ;
    $self.#writer = cx.writer();
    return;
  }

  beforeRoot(root) {
    root.walk(this);
    return;
  }

  afterRoot(root) {
    root.walk(this);
    return;
  }

  visitImgAttrs(attrs) {
    if (sys.ObjUtil.is(attrs.parent(), Image.type$)) {
      let img = attrs.parent();
      attrs.unlink();
      img.insertAfter(attrs);
    }
    else {
      if (sys.ObjUtil.is(attrs.prev(), Image.type$)) {
        let img = attrs.prev();
        attrs.unlink();
        img.appendChild(attrs);
      }
      ;
    }
    ;
    return;
  }

  render(node) {
    const this$ = this;
    let attrs = sys.ObjUtil.as(node, ImgAttrs.type$);
    this.#writer.raw(attrs.openingDelim());
    let i = 0;
    attrs.attrs().each((v,k) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        this$.#writer.raw(sys.ObjUtil.coerce(32, sys.Obj.type$));
      }
      ;
      this$.#writer.raw(sys.Str.plus(sys.Str.plus(sys.Str.plus("", k), "="), v));
      i = sys.Int.increment(i);
      return;
    });
    this.#writer.raw(attrs.closingDelim());
    return;
  }

}

class ParserState {
  constructor() {
    const this$ = this;
  }

  typeof() { return ParserState.type$; }

}

class DocumentParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#definitions = Definitions.make();
    this.#line = null;
    this.#lineIndex = -1;
    this.#index = 0;
    this.#column = 0;
    this.#columnIsInTab = false;
    this.#nextNonSpaceIndex = 0;
    this.#nextNonSpaceColumn = 0;
    this.#indent = 0;
    this.#isBlank = false;
    this.#openBlockParsers = sys.List.make(OpenBlockParser.type$);
    this.#allBlockParsers = sys.List.make(BlockParser.type$);
    return;
  }

  typeof() { return DocumentParser.type$; }

  static #core_block_types = undefined;

  static core_block_types() {
    if (DocumentParser.#core_block_types === undefined) {
      DocumentParser.static$init();
      if (DocumentParser.#core_block_types === undefined) DocumentParser.#core_block_types = null;
    }
    return DocumentParser.#core_block_types;
  }

  static #core_factories = undefined;

  static core_factories() {
    if (DocumentParser.#core_factories === undefined) {
      DocumentParser.static$init();
      if (DocumentParser.#core_factories === undefined) DocumentParser.#core_factories = null;
    }
    return DocumentParser.#core_factories;
  }

  #documentBlockParser = null;

  // private field reflection only
  __documentBlockParser(it) { if (it === undefined) return this.#documentBlockParser; else this.#documentBlockParser = it; }

  #definitions = null;

  // private field reflection only
  __definitions(it) { if (it === undefined) return this.#definitions; else this.#definitions = it; }

  #parser = null;

  parser() { return this.#parser; }

  __parser(it) { if (it === undefined) return this.#parser; else this.#parser = it; }

  #blockParserFactories = null;

  blockParserFactories() { return this.#blockParserFactories; }

  __blockParserFactories(it) { if (it === undefined) return this.#blockParserFactories; else this.#blockParserFactories = it; }

  #includeSourceSpans = null;

  includeSourceSpans() { return this.#includeSourceSpans; }

  __includeSourceSpans(it) { if (it === undefined) return this.#includeSourceSpans; else this.#includeSourceSpans = it; }

  #line = null;

  line() {
    return this.#line;
  }

  #lineIndex = 0;

  // private field reflection only
  __lineIndex(it) { if (it === undefined) return this.#lineIndex; else this.#lineIndex = it; }

  #index = 0;

  index() {
    return this.#index;
  }

  #column = 0;

  column() {
    return this.#column;
  }

  #columnIsInTab = false;

  // private field reflection only
  __columnIsInTab(it) { if (it === undefined) return this.#columnIsInTab; else this.#columnIsInTab = it; }

  #nextNonSpaceIndex = 0;

  nextNonSpaceIndex() {
    return this.#nextNonSpaceIndex;
  }

  #nextNonSpaceColumn = 0;

  // private field reflection only
  __nextNonSpaceColumn(it) { if (it === undefined) return this.#nextNonSpaceColumn; else this.#nextNonSpaceColumn = it; }

  #indent = 0;

  indent() {
    return this.#indent;
  }

  #isBlank = false;

  isBlank() {
    return this.#isBlank;
  }

  #openBlockParsers = null;

  // private field reflection only
  __openBlockParsers(it) { if (it === undefined) return this.#openBlockParsers; else this.#openBlockParsers = it; }

  #allBlockParsers = null;

  // private field reflection only
  __allBlockParsers(it) { if (it === undefined) return this.#allBlockParsers; else this.#allBlockParsers = it; }

  static make(parser) {
    const $self = new DocumentParser();
    DocumentParser.make$($self,parser);
    return $self;
  }

  static make$($self,parser) {
    ;
    $self.#parser = parser;
    $self.#blockParserFactories = sys.ObjUtil.coerce(((this$) => { let $_u24 = parser.blockParserFactories(); if ($_u24 == null) return null; return sys.ObjUtil.toImmutable(parser.blockParserFactories()); })($self), sys.Type.find("markdown::BlockParserFactory[]"));
    $self.#includeSourceSpans = parser.includeSourceSpans();
    $self.#documentBlockParser = DocumentBlockParser.make();
    $self.activateBlockParser(OpenBlockParser.make($self.#documentBlockParser, 0));
    return;
  }

  static calculateBlockParserFactories(custom,enabled) {
    const this$ = this;
    let acc = sys.List.make(BlockParserFactory.type$);
    acc.addAll(custom);
    enabled.each((type) => {
      acc.add(sys.ObjUtil.coerce(DocumentParser.core_factories().get(type), BlockParserFactory.type$));
      return;
    });
    return acc;
  }

  static checkEnabledBlockTypes(types) {
    const this$ = this;
    types.each((type) => {
      if (DocumentParser.core_factories().get(type) == null) {
        throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Can't enable block type ", type), ", possible options are "), DocumentParser.core_block_types()));
      }
      ;
      return;
    });
    return;
  }

  activeBlockParser() {
    return this.#openBlockParsers.last().blockParser();
  }

  parse(in$) {
    let line = null;
    while ((line = in$.readLine()) != null) {
      this.parseLine(sys.ObjUtil.coerce(line, sys.Str.type$));
    }
    ;
    return this.finalizeAndProcess();
  }

  parseLine(ln) {
    const this$ = this;
    this.setLine(ln);
    let matches = 1;
    for (let i = 1; sys.ObjUtil.compareLT(i, this.#openBlockParsers.size()); i = sys.Int.increment(i)) {
      let openBlockParser = this.#openBlockParsers.get(i);
      let blockParser = openBlockParser.blockParser();
      this.findNextNonSpace();
      let blockContinue = blockParser.tryContinue(this);
      if (blockContinue == null) {
        break;
      }
      ;
      openBlockParser.sourceIndex(this.index());
      if (blockContinue.finalize()) {
        this.addSourceSpans();
        this.closeBlockParsers(sys.Int.minus(this.#openBlockParsers.size(), i));
        return;
      }
      else {
        if (sys.ObjUtil.compareNE(blockContinue.newIndex(), -1)) {
          this.setNewIndex(blockContinue.newIndex());
        }
        else {
          if (sys.ObjUtil.compareNE(blockContinue.newColumn(), -1)) {
            this.setNewColumn(blockContinue.newColumn());
          }
          ;
        }
        ;
        matches = sys.Int.increment(matches);
      }
      ;
    }
    ;
    let unmatchedBlocks = sys.Int.minus(this.#openBlockParsers.size(), matches);
    let blockParser = this.#openBlockParsers.get(sys.Int.minus(matches, 1)).blockParser();
    let startedNewBlock = false;
    let lastIndex = this.index();
    let tryBlockStarts = (sys.ObjUtil.is(blockParser.block(), Paragraph.type$) || blockParser.isContainer());
    while (tryBlockStarts) {
      (lastIndex = this.index());
      this.findNextNonSpace();
      if ((this.isBlank() || (sys.ObjUtil.compareLT(this.indent(), Parsing.code_block_indent()) && Chars.isLetter(this.line().content(), this.nextNonSpaceIndex())))) {
        this.setNewIndex(this.nextNonSpaceIndex());
        break;
      }
      ;
      let blockStart = this.findBlockStart(blockParser);
      if (blockStart == null) {
        this.setNewIndex(this.nextNonSpaceIndex());
        break;
      }
      ;
      (startedNewBlock = true);
      let sourceIndex = this.index();
      if (sys.ObjUtil.compareGT(unmatchedBlocks, 0)) {
        this.closeBlockParsers(unmatchedBlocks);
        (unmatchedBlocks = 0);
      }
      ;
      if (sys.ObjUtil.compareNE(blockStart.newIndex(), -1)) {
        this.setNewIndex(blockStart.newIndex());
      }
      else {
        if (sys.ObjUtil.compareNE(blockStart.newColumn(), -1)) {
          this.setNewColumn(blockStart.newColumn());
        }
        ;
      }
      ;
      let replacedSourceSpans = null;
      if (blockStart.isReplaceActiveBlockParser()) {
        let replacedBlock = this.prepareActiveBlockParserForReplacement();
        (replacedSourceSpans = replacedBlock.sourceSpans());
      }
      ;
      blockStart.blockParsers().each((newBlockParser) => {
        this$.addChild(OpenBlockParser.make(newBlockParser, sourceIndex));
        if (replacedSourceSpans != null) {
          newBlockParser.block().setSourceSpans(sys.ObjUtil.coerce(replacedSourceSpans, sys.Type.find("markdown::SourceSpan[]")));
        }
        ;
        (blockParser = newBlockParser);
        (tryBlockStarts = newBlockParser.isContainer());
        return;
      });
    }
    ;
    if ((!startedNewBlock && !this.isBlank() && this.activeBlockParser().canHaveLazyContinuationLines())) {
      this.#openBlockParsers.last().sourceIndex(lastIndex);
      this.addLine();
    }
    else {
      if (sys.ObjUtil.compareGT(unmatchedBlocks, 0)) {
        this.closeBlockParsers(unmatchedBlocks);
      }
      ;
      if (!blockParser.isContainer()) {
        this.addLine();
      }
      else {
        if (!this.isBlank()) {
          let paragraphParser = ParagraphParser.make();
          this.addChild(OpenBlockParser.make(paragraphParser, lastIndex));
          this.addLine();
        }
        else {
          this.addSourceSpans();
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  setLine(ln) {
    ((this$) => { let $_u25 = this$.#lineIndex;this$.#lineIndex = sys.Int.increment(this$.#lineIndex); return $_u25; })(this);
    this.#index = 0;
    this.#column = 0;
    this.#columnIsInTab = false;
    let lineContent = DocumentParser.prepareLine(ln);
    let sourceSpan = null;
    if (sys.ObjUtil.compareNE(this.#includeSourceSpans, IncludeSourceSpans.none())) {
      (sourceSpan = SourceSpan.make(this.#lineIndex, 0, sys.Str.size(lineContent)));
    }
    ;
    this.#line = SourceLine.make(lineContent, sourceSpan);
    return;
  }

  findNextNonSpace() {
    let i = this.index();
    let cols = this.column();
    this.#isBlank = true;
    let len = sys.Str.size(this.line().content());
    while (sys.ObjUtil.compareLT(i, len)) {
      let $_u26 = sys.Str.get(this.line().content(), i);
      if (sys.ObjUtil.equals($_u26, 32)) {
        i = sys.Int.increment(i);
        cols = sys.Int.increment(cols);
        continue;
      }
      else if (sys.ObjUtil.equals($_u26, 9)) {
        i = sys.Int.increment(i);
        cols = sys.Int.plus(cols, Parsing.columnsToNextTabStop(cols));
        continue;
      }
      ;
      this.#isBlank = false;
      break;
    }
    ;
    this.#nextNonSpaceIndex = i;
    this.#nextNonSpaceColumn = cols;
    this.#indent = sys.Int.minus(this.#nextNonSpaceColumn, this.column());
    return;
  }

  setNewIndex(newIndex) {
    if (sys.ObjUtil.compareGE(newIndex, this.nextNonSpaceIndex())) {
      this.#index = this.nextNonSpaceIndex();
      this.#column = this.#nextNonSpaceColumn;
    }
    ;
    let len = sys.Str.size(this.line().content());
    while ((sys.ObjUtil.compareLT(this.index(), newIndex) && sys.ObjUtil.compareNE(this.index(), len))) {
      this.advance();
    }
    ;
    this.#columnIsInTab = false;
    return;
  }

  setNewColumn(newColumn) {
    if (sys.ObjUtil.compareGE(newColumn, this.#nextNonSpaceColumn)) {
      this.#index = this.nextNonSpaceIndex();
      this.#column = this.#nextNonSpaceColumn;
    }
    ;
    let len = sys.Str.size(this.line().content());
    while ((sys.ObjUtil.compareLT(this.column(), newColumn) && sys.ObjUtil.compareNE(this.index(), len))) {
      this.advance();
    }
    ;
    if (sys.ObjUtil.compareGT(this.column(), newColumn)) {
      this.#index = sys.Int.decrement(this.index());
      this.#column = newColumn;
      this.#columnIsInTab = true;
    }
    else {
      this.#columnIsInTab = false;
    }
    ;
    return;
  }

  advance() {
    let c = sys.Str.get(this.line().content(), this.index());
    ((this$) => { let $_u27 = this$.index();this$.#index = sys.Int.increment(this$.index()); return $_u27; })(this);
    if (sys.ObjUtil.equals(c, 9)) {
      this.#column = sys.Int.plus(this.column(), Parsing.columnsToNextTabStop(this.column()));
    }
    else {
      ((this$) => { let $_u28 = this$.column();this$.#column = sys.Int.increment(this$.column()); return $_u28; })(this);
    }
    ;
    return;
  }

  addLine() {
    const this$ = this;
    let content = null;
    if (this.#columnIsInTab) {
      let afterTab = sys.Int.plus(this.index(), 1);
      let rest = sys.Str.getRange(this.line().content(), sys.Range.make(afterTab, -1));
      let spaces = Parsing.columnsToNextTabStop(this.column());
      let sb = sys.StrBuf.make(sys.Int.plus(spaces, sys.Str.size(rest)));
      sys.Int.times(spaces, (it) => {
        sb.addChar(32);
        return;
      });
      sb.add(rest);
      (content = sb.toStr());
    }
    else {
      if (sys.ObjUtil.equals(this.index(), 0)) {
        (content = this.line().content());
      }
      else {
        (content = sys.Str.getRange(this.line().content(), sys.Range.make(this.index(), sys.Str.size(this.line().content()), true)));
      }
      ;
    }
    ;
    let sourceSpan = null;
    if (this.#includeSourceSpans === IncludeSourceSpans.blocks_and_inlines()) {
      (sourceSpan = SourceSpan.make(this.#lineIndex, this.index(), sys.Str.size(content)));
    }
    ;
    this.activeBlockParser().addLine(SourceLine.make(sys.ObjUtil.coerce(content, sys.Str.type$), sourceSpan));
    this.addSourceSpans();
    return;
  }

  addSourceSpans() {
    if (this.#includeSourceSpans === IncludeSourceSpans.none()) {
      return;
    }
    ;
    throw sys.Err.make("TODO:HERE");
  }

  findBlockStart(blockParser) {
    const this$ = this;
    let matchedBlockParser = MatchedBlockParser.make(blockParser);
    return sys.ObjUtil.coerce(this.#blockParserFactories.eachWhile((factory) => {
      return factory.tryStart(this$, matchedBlockParser);
    }), BlockStart.type$.toNullable());
  }

  processInLines() {
    const this$ = this;
    let cx = InlineParserContext.make(this.#parser, this.#definitions);
    let inlineParser = DefaultInlineParser.make(cx);
    this.#allBlockParsers.each((blockParser) => {
      blockParser.parseInlines(inlineParser);
      return;
    });
    return;
  }

  addChild(openBlockParser) {
    let block = openBlockParser.blockParser().block();
    while (!this.activeBlockParser().canContain(block)) {
      this.closeBlockParsers(1);
    }
    ;
    this.activeBlockParser().block().appendChild(block);
    this.activateBlockParser(openBlockParser);
    return;
  }

  activateBlockParser(openBlockParser) {
    this.#openBlockParsers.add(openBlockParser);
    return;
  }

  deactivateBlockParser() {
    return sys.ObjUtil.coerce(this.#openBlockParsers.pop(), OpenBlockParser.type$);
  }

  prepareActiveBlockParserForReplacement() {
    let old = this.deactivateBlockParser().blockParser();
    if (sys.ObjUtil.is(old, ParagraphParser.type$)) {
      this.addDefinitionsFrom(sys.ObjUtil.coerce(old, ParagraphParser.type$));
    }
    ;
    old.closeBlock();
    old.block().unlink();
    return old.block();
  }

  static prepareLine(line) {
    if (!sys.Str.containsChar(line, 0)) {
      return line;
    }
    ;
    return sys.Str.replace(line, "\u0000", "\ufffd");
  }

  finalizeAndProcess() {
    this.closeBlockParsers(this.#openBlockParsers.size());
    this.processInLines();
    return this.#documentBlockParser.block();
  }

  closeBlockParsers(count) {
    const this$ = this;
    sys.Int.times(count, (i) => {
      let blockParser = this$.deactivateBlockParser().blockParser();
      this$.finalize(blockParser);
      this$.#allBlockParsers.add(blockParser);
      return;
    });
    return;
  }

  finalize(blockParser) {
    this.addDefinitionsFrom(blockParser);
    blockParser.closeBlock();
    return;
  }

  addDefinitionsFrom(blockParser) {
    const this$ = this;
    blockParser.definitions().each((defMap) => {
      this$.#definitions.addDefinitions(defMap);
      return;
    });
    return;
  }

  static static$init() {
    const this$ = this;
    DocumentParser.#core_block_types = sys.ObjUtil.coerce(((this$) => { let $_u29 = sys.List.make(sys.Type.type$, [BlockQuote.type$, Heading.type$, FencedCode.type$, HtmlBlock.type$, ThematicBreak.type$, ListBlock.type$, IndentedCode.type$]); if ($_u29 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Type.type$, [BlockQuote.type$, Heading.type$, FencedCode.type$, HtmlBlock.type$, ThematicBreak.type$, ListBlock.type$, IndentedCode.type$])); })(this), sys.Type.find("sys::Type[]"));
    if (true) {
      let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Type"), sys.Type.find("markdown::BlockParserFactory")), (it) => {
        it.ordered(true);
        return;
      }), sys.Type.find("[sys::Type:markdown::BlockParserFactory]"));
      acc.set(BlockQuote.type$, BlockQuoteParser.factory());
      acc.set(Heading.type$, HeadingParser.factory());
      acc.set(FencedCode.type$, FencedCodeParser.factory());
      acc.set(HtmlBlock.type$, HtmlBlockParser.factory());
      acc.set(ThematicBreak.type$, ThematicBreakParser.factory());
      acc.set(ListBlock.type$, ListBlockParser.factory());
      acc.set(IndentedCode.type$, IndentedCodeParser.factory());
      DocumentParser.#core_factories = sys.ObjUtil.coerce(((this$) => { let $_u30 = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc), sys.Type.find("[sys::Type:markdown::BlockParserFactory]")); if ($_u30 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc), sys.Type.find("[sys::Type:markdown::BlockParserFactory]"))); })(this), sys.Type.find("[sys::Type:markdown::BlockParserFactory]"));
    }
    ;
    return;
  }

}

class OpenBlockParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return OpenBlockParser.type$; }

  #blockParser = null;

  blockParser() {
    return this.#blockParser;
  }

  #sourceIndex = 0;

  sourceIndex(it) {
    if (it === undefined) {
      return this.#sourceIndex;
    }
    else {
      this.#sourceIndex = it;
      return;
    }
  }

  static make(blockParser,sourceIndex) {
    const $self = new OpenBlockParser();
    OpenBlockParser.make$($self,blockParser,sourceIndex);
    return $self;
  }

  static make$($self,blockParser,sourceIndex) {
    $self.#blockParser = blockParser;
    $self.#sourceIndex = sourceIndex;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("OpenBlockParser(", this.#blockParser), " "), sys.ObjUtil.coerce(this.#sourceIndex, sys.Obj.type$.toNullable())), ")");
  }

}

class MatchedBlockParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MatchedBlockParser.type$; }

  #matchedBlockParser = null;

  matchedBlockParser() {
    return this.#matchedBlockParser;
  }

  static make(matchedBlockParser) {
    const $self = new MatchedBlockParser();
    MatchedBlockParser.make$($self,matchedBlockParser);
    return $self;
  }

  static make$($self,matchedBlockParser) {
    $self.#matchedBlockParser = matchedBlockParser;
    return;
  }

  paragraphLines() {
    if (sys.ObjUtil.is(this.#matchedBlockParser, ParagraphParser.type$)) {
      return sys.ObjUtil.coerce(this.#matchedBlockParser, ParagraphParser.type$).paragraphLines();
    }
    ;
    return sys.ObjUtil.coerce(SourceLines.empty(), SourceLines.type$);
  }

}

class Parsing extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Parsing.type$; }

  static #code_block_indent = undefined;

  static code_block_indent() {
    if (Parsing.#code_block_indent === undefined) {
      Parsing.static$init();
      if (Parsing.#code_block_indent === undefined) Parsing.#code_block_indent = 0;
    }
    return Parsing.#code_block_indent;
  }

  static columnsToNextTabStop(column) {
    return sys.Int.minus(4, sys.Int.mod(column, 4));
  }

  static make() {
    const $self = new Parsing();
    Parsing.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    Parsing.#code_block_indent = 4;
    return;
  }

}

class Scanner extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#line = SourceLine.make("");
    this.#lineLen = 0;
    return;
  }

  typeof() { return Scanner.type$; }

  #lines = null;

  // private field reflection only
  __lines(it) { if (it === undefined) return this.#lines; else this.#lines = it; }

  #lineIndex = 0;

  // private field reflection only
  __lineIndex(it) { if (it === undefined) return this.#lineIndex; else this.#lineIndex = it; }

  #index = 0;

  // private field reflection only
  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  #line = null;

  // private field reflection only
  __line(it) { if (it === undefined) return this.#line; else this.#line = it; }

  #lineLen = 0;

  // private field reflection only
  __lineLen(it) { if (it === undefined) return this.#lineLen; else this.#lineLen = it; }

  static #END = undefined;

  static END() {
    if (Scanner.#END === undefined) {
      Scanner.static$init();
      if (Scanner.#END === undefined) Scanner.#END = 0;
    }
    return Scanner.#END;
  }

  static makeLine(line) {
    const $self = new Scanner();
    Scanner.makeLine$($self,line);
    return $self;
  }

  static makeLine$($self,line) {
    Scanner.make$($self, sys.List.make(SourceLine.type$, [line]));
    return;
  }

  static makeSourceLines(sourceLines) {
    const $self = new Scanner();
    Scanner.makeSourceLines$($self,sourceLines);
    return $self;
  }

  static makeSourceLines$($self,sourceLines) {
    Scanner.make$($self, sourceLines.lines());
    return;
  }

  static make(lines,lineIndex,index) {
    const $self = new Scanner();
    Scanner.make$($self,lines,lineIndex,index);
    return $self;
  }

  static make$($self,lines,lineIndex,index) {
    if (lineIndex === undefined) lineIndex = 0;
    if (index === undefined) index = 0;
    ;
    $self.#lines = sys.ObjUtil.coerce(((this$) => { let $_u31 = lines; if ($_u31 == null) return null; return sys.ObjUtil.toImmutable(lines); })($self), sys.Type.find("markdown::SourceLine[]"));
    $self.#lineIndex = lineIndex;
    $self.#index = index;
    if (!lines.isEmpty()) {
      $self.checkPos(lineIndex, index);
      $self.setLine(lines.get(lineIndex));
    }
    ;
    return;
  }

  peek() {
    if (sys.ObjUtil.compareLT(this.#index, this.#lineLen)) {
      return sys.Str.get(this.#line.content(), this.#index);
    }
    else {
      if (sys.ObjUtil.compareLT(this.#lineIndex, sys.Int.minus(this.#lines.size(), 1))) {
        return 10;
      }
      else {
        return Scanner.END();
      }
      ;
    }
    ;
  }

  peekCodePoint() {
    if (sys.ObjUtil.compareLT(this.#index, this.#lineLen)) {
      let c = sys.Str.get(this.#line.content(), this.#index);
      return c;
    }
    else {
      if (sys.ObjUtil.compareLT(this.#lineIndex, sys.Int.minus(this.#lines.size(), 1))) {
        return 10;
      }
      else {
        return Scanner.END();
      }
      ;
    }
    ;
  }

  peekPrevCodePoint() {
    if (sys.ObjUtil.compareGT(this.#index, 0)) {
      let prev = sys.Int.minus(this.#index, 1);
      let c = sys.Str.get(this.#line.content(), prev);
      return c;
    }
    else {
      if (sys.ObjUtil.compareGT(this.#lineIndex, 0)) {
        return 10;
      }
      else {
        return Scanner.END();
      }
      ;
    }
    ;
  }

  hasNext() {
    if (sys.ObjUtil.compareLT(this.#index, this.#lineLen)) {
      return true;
    }
    else {
      return sys.ObjUtil.compareLT(this.#lineIndex, sys.Int.minus(this.#lines.size(), 1));
    }
    ;
  }

  next() {
    this.#index = sys.Int.increment(this.#index);
    if (sys.ObjUtil.compareGT(this.#index, this.#lineLen)) {
      this.#lineIndex = sys.Int.increment(this.#lineIndex);
      if (sys.ObjUtil.compareLT(this.#lineIndex, this.#lines.size())) {
        this.setLine(this.#lines.get(this.#lineIndex));
      }
      else {
        this.setLine(SourceLine.make(""));
      }
      ;
      this.#index = 0;
    }
    ;
    return;
  }

  matchMultiple(ch) {
    let count = 0;
    while (sys.ObjUtil.equals(this.peek(), ch)) {
      count = sys.Int.increment(count);
      this.next();
    }
    ;
    return count;
  }

  match(f) {
    let count = 0;
    while (sys.Func.call(f, sys.ObjUtil.coerce(this.peek(), sys.Obj.type$.toNullable()))) {
      count = sys.Int.increment(count);
      this.next();
    }
    ;
    return count;
  }

  whitespace() {
    let count = 0;
    while (true) {
      let $_u32 = this.peek();
      if (sys.ObjUtil.equals($_u32, 32) || sys.ObjUtil.equals($_u32, 9) || sys.ObjUtil.equals($_u32, 10) || sys.ObjUtil.equals($_u32, 11) || sys.ObjUtil.equals($_u32, 12) || sys.ObjUtil.equals($_u32, 13)) {
        count = sys.Int.increment(count);
        this.next();
      }
      else {
        break;
      }
      ;
    }
    ;
    return count;
  }

  find(ch) {
    let count = 0;
    while (true) {
      let cur = this.peek();
      if (sys.ObjUtil.equals(cur, Scanner.END())) {
        return -1;
      }
      else {
        if (sys.ObjUtil.equals(cur, ch)) {
          break;
        }
        ;
      }
      ;
      count = sys.Int.increment(count);
      this.next();
    }
    ;
    return count;
  }

  findMatch(f) {
    let count = 0;
    while (true) {
      let c = this.peek();
      if (sys.ObjUtil.equals(c, Scanner.END())) {
        return -1;
      }
      else {
        if (sys.Func.call(f, sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()))) {
          break;
        }
        ;
      }
      ;
      count = sys.Int.increment(count);
      this.next();
    }
    ;
    return count;
  }

  nextCh(ch) {
    if (sys.ObjUtil.equals(this.peek(), ch)) {
      this.next();
      return true;
    }
    ;
    return false;
  }

  nextStr(content) {
    if ((sys.ObjUtil.compareLT(this.#index, this.#lineLen) && sys.ObjUtil.compareLE(sys.Int.plus(this.#index, sys.Str.size(content)), this.#lineLen))) {
      for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(content)); i = sys.Int.increment(i)) {
        if (sys.ObjUtil.compareNE(sys.Str.get(this.#line.content(), sys.Int.plus(this.#index, i)), sys.Str.get(content, i))) {
          return false;
        }
        ;
      }
      ;
      this.#index = sys.Int.plus(this.#index, sys.Str.size(content));
      return true;
    }
    ;
    return false;
  }

  pos() {
    return Position.make(this.#lineIndex, this.#index);
  }

  setPos(pos) {
    this.checkPos(pos.lineIndex(), pos.index());
    this.#lineIndex = pos.lineIndex();
    this.#index = pos.index();
    this.setLine(this.#lines.get(this.#lineIndex));
    return;
  }

  source(begin,end) {
    if (sys.ObjUtil.equals(begin.lineIndex(), end.lineIndex())) {
      let line = this.#lines.get(begin.lineIndex());
      let newContent = sys.Str.getRange(line.content(), sys.Range.make(begin.index(), end.index(), true));
      let newSourceSpan = null;
      let sourceSpan = line.sourceSpan();
      if (sourceSpan != null) {
        (newSourceSpan = SourceSpan.make(sourceSpan.lineIndex(), sys.Int.plus(sourceSpan.columnIndex(), begin.index()), sys.Str.size(newContent)));
      }
      ;
      return SourceLines.makeOne(SourceLine.make(newContent, newSourceSpan));
    }
    else {
      let sourceLines = SourceLines.empty();
      let firstLine = this.#lines.get(begin.lineIndex());
      sourceLines.addLine(firstLine.substring(begin.index(), sys.Str.size(firstLine.content())));
      for (let line = sys.Int.plus(begin.lineIndex(), 1); sys.ObjUtil.compareLT(line, end.lineIndex()); line = sys.Int.increment(line)) {
        sourceLines.addLine(this.#lines.get(line));
      }
      ;
      let lastLine = this.#lines.get(end.lineIndex());
      sourceLines.addLine(lastLine.substring(0, end.index()));
      return sys.ObjUtil.coerce(sourceLines, SourceLines.type$);
    }
    ;
  }

  setLine(line) {
    this.#line = line;
    this.#lineLen = sys.Str.size(line.content());
    return;
  }

  checkPos(lineIndex,index) {
    if ((sys.ObjUtil.compareLT(lineIndex, 0) || sys.ObjUtil.compareGE(lineIndex, this.#lines.size()))) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Line index ", sys.ObjUtil.coerce(lineIndex, sys.Obj.type$.toNullable())), " out of range, number of lines: "), sys.ObjUtil.coerce(this.#lines.size(), sys.Obj.type$.toNullable())));
    }
    ;
    let line = this.#lines.get(lineIndex);
    if ((sys.ObjUtil.compareLT(index, 0) || sys.ObjUtil.compareGT(index, sys.Str.size(line.content())))) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Index ", sys.ObjUtil.coerce(index, sys.Obj.type$.toNullable())), " out of range, line length: "), sys.ObjUtil.coerce(sys.Str.size(line.content()), sys.Obj.type$.toNullable())));
    }
    ;
    return;
  }

  static static$init() {
    Scanner.#END = 0;
    return;
  }

}

class Position extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Position.type$; }

  #lineIndex = 0;

  lineIndex() { return this.#lineIndex; }

  __lineIndex(it) { if (it === undefined) return this.#lineIndex; else this.#lineIndex = it; }

  #index = 0;

  index() { return this.#index; }

  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  static make(lineIndex,index) {
    const $self = new Position();
    Position.make$($self,lineIndex,index);
    return $self;
  }

  static make$($self,lineIndex,index) {
    $self.#lineIndex = lineIndex;
    $self.#index = index;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("pos(line=", sys.ObjUtil.coerce(this.#lineIndex, sys.Obj.type$.toNullable())), ", index="), sys.ObjUtil.coerce(this.#index, sys.Obj.type$.toNullable())), ")");
  }

}

class PostProcessor {
  constructor() {
    const this$ = this;
  }

  typeof() { return PostProcessor.type$; }

}

class LinkResolver {
  constructor() {
    const this$ = this;
  }

  typeof() { return LinkResolver.type$; }

  visitBulletList() { return Visitor.prototype.visitBulletList.apply(this, arguments); }

  visitCustomNode() { return Visitor.prototype.visitCustomNode.apply(this, arguments); }

  visitFencedCode() { return Visitor.prototype.visitFencedCode.apply(this, arguments); }

  visitThematicBreak() { return Visitor.prototype.visitThematicBreak.apply(this, arguments); }

  visitChildren() { return Visitor.prototype.visitChildren.apply(this, arguments); }

  visitLinkReferenceDefinition() { return Visitor.prototype.visitLinkReferenceDefinition.apply(this, arguments); }

  visitHeading() { return Visitor.prototype.visitHeading.apply(this, arguments); }

  visitDocument() { return Visitor.prototype.visitDocument.apply(this, arguments); }

  visitStrongEmphasis() { return Visitor.prototype.visitStrongEmphasis.apply(this, arguments); }

  visitText() { return Visitor.prototype.visitText.apply(this, arguments); }

  visitListItem() { return Visitor.prototype.visitListItem.apply(this, arguments); }

  visitOrderedList() { return Visitor.prototype.visitOrderedList.apply(this, arguments); }

  visitCode() { return Visitor.prototype.visitCode.apply(this, arguments); }

  visitHtmlBlock() { return Visitor.prototype.visitHtmlBlock.apply(this, arguments); }

  visitHardLineBreak() { return Visitor.prototype.visitHardLineBreak.apply(this, arguments); }

  visitParagraph() { return Visitor.prototype.visitParagraph.apply(this, arguments); }

  visitCustomBlock() { return Visitor.prototype.visitCustomBlock.apply(this, arguments); }

  visitBlockQuote() { return Visitor.prototype.visitBlockQuote.apply(this, arguments); }

  visitIndentedCode() { return Visitor.prototype.visitIndentedCode.apply(this, arguments); }

  visitSoftLineBreak() { return Visitor.prototype.visitSoftLineBreak.apply(this, arguments); }

  visitEmphasis() { return Visitor.prototype.visitEmphasis.apply(this, arguments); }

  visitHtmlInline() { return Visitor.prototype.visitHtmlInline.apply(this, arguments); }

  process(node) {
    node.walk(this);
    return node;
  }

  visitLink(link) {
    this.resolve(link);
    return;
  }

  visitImage(img) {
    this.resolve(img);
    return;
  }

}

class BlockStart extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#newIndex = -1;
    this.#newColumn = -1;
    this.#isReplaceActiveBlockParser = false;
    return;
  }

  typeof() { return BlockStart.type$; }

  #blockParsers = null;

  blockParsers() {
    return this.#blockParsers;
  }

  #newIndex = 0;

  newIndex() {
    return this.#newIndex;
  }

  #newColumn = 0;

  newColumn() {
    return this.#newColumn;
  }

  #isReplaceActiveBlockParser = false;

  isReplaceActiveBlockParser() {
    return this.#isReplaceActiveBlockParser;
  }

  static none() {
    return null;
  }

  static of(blockParsers) {
    return BlockStart.make(blockParsers);
  }

  static make(blockParsers) {
    const $self = new BlockStart();
    BlockStart.make$($self,blockParsers);
    return $self;
  }

  static make$($self,blockParsers) {
    ;
    $self.#blockParsers = blockParsers;
    return;
  }

  atIndex(newIndex) {
    this.#newIndex = newIndex;
    return this;
  }

  atColumn(newColumn) {
    this.#newColumn = newColumn;
    return this;
  }

  replaceActiveBlockParser() {
    this.#isReplaceActiveBlockParser = true;
    return this;
  }

}

class BlockContinue extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BlockContinue.type$; }

  #newIndex = 0;

  newIndex() { return this.#newIndex; }

  __newIndex(it) { if (it === undefined) return this.#newIndex; else this.#newIndex = it; }

  #newColumn = 0;

  newColumn() { return this.#newColumn; }

  __newColumn(it) { if (it === undefined) return this.#newColumn; else this.#newColumn = it; }

  #finalize = false;

  finalize() { return this.#finalize; }

  __finalize(it) { if (it === undefined) return this.#finalize; else this.#finalize = it; }

  static none() {
    return null;
  }

  static atIndex(newIndex) {
    return BlockContinue.priv_make(newIndex, -1, false);
  }

  static atColumn(newColumn) {
    return BlockContinue.priv_make(-1, newColumn, false);
  }

  static finished() {
    return BlockContinue.priv_make(-1, -1, true);
  }

  static priv_make(newIndex,newColumn,finalize) {
    const $self = new BlockContinue();
    BlockContinue.priv_make$($self,newIndex,newColumn,finalize);
    return $self;
  }

  static priv_make$($self,newIndex,newColumn,finalize) {
    $self.#newIndex = newIndex;
    $self.#newColumn = newColumn;
    $self.#finalize = finalize;
    return;
  }

}

class SourceSpan extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SourceSpan.type$; }

  #lineIndex = 0;

  lineIndex() { return this.#lineIndex; }

  __lineIndex(it) { if (it === undefined) return this.#lineIndex; else this.#lineIndex = it; }

  #columnIndex = 0;

  columnIndex() { return this.#columnIndex; }

  __columnIndex(it) { if (it === undefined) return this.#columnIndex; else this.#columnIndex = it; }

  #len = 0;

  len() { return this.#len; }

  __len(it) { if (it === undefined) return this.#len; else this.#len = it; }

  static make(lineIndex,columnIndex,len) {
    const $self = new SourceSpan();
    SourceSpan.make$($self,lineIndex,columnIndex,len);
    return $self;
  }

  static make$($self,lineIndex,columnIndex,len) {
    $self.#lineIndex = lineIndex;
    $self.#columnIndex = columnIndex;
    $self.#len = len;
    return;
  }

  equals(obj) {
    if (this === obj) {
      return true;
    }
    ;
    let that = sys.ObjUtil.as(obj, SourceSpan.type$);
    if (that == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#lineIndex, that.#lineIndex) && sys.ObjUtil.equals(this.#columnIndex, that.#columnIndex) && sys.ObjUtil.equals(this.#len, that.#len));
  }

  hash() {
    let res = 1;
    (res = sys.Int.plus(sys.Int.mult(31, res), sys.Int.hash(this.#lineIndex)));
    (res = sys.Int.plus(sys.Int.mult(31, res), sys.Int.hash(this.#columnIndex)));
    (res = sys.Int.plus(sys.Int.mult(31, res), sys.Int.hash(this.#len)));
    return res;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("SourceSpan(line=", sys.ObjUtil.coerce(this.#lineIndex, sys.Obj.type$.toNullable())), ", column="), sys.ObjUtil.coerce(this.#columnIndex, sys.Obj.type$.toNullable())), ", len="), sys.ObjUtil.coerce(this.#len, sys.Obj.type$.toNullable()));
  }

}

class IncludeSourceSpans extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return IncludeSourceSpans.type$; }

  static none() { return IncludeSourceSpans.vals().get(0); }

  static blocks() { return IncludeSourceSpans.vals().get(1); }

  static blocks_and_inlines() { return IncludeSourceSpans.vals().get(2); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new IncludeSourceSpans();
    IncludeSourceSpans.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(IncludeSourceSpans.type$, IncludeSourceSpans.vals(), name$, checked);
  }

  static vals() {
    if (IncludeSourceSpans.#vals == null) {
      IncludeSourceSpans.#vals = sys.List.make(IncludeSourceSpans.type$, [
        IncludeSourceSpans.make(0, "none", ),
        IncludeSourceSpans.make(1, "blocks", ),
        IncludeSourceSpans.make(2, "blocks_and_inlines", ),
      ]).toImmutable();
    }
    return IncludeSourceSpans.#vals;
  }

  static static$init() {
    const $_u33 = IncludeSourceSpans.vals();
    if (true) {
    }
    ;
    return;
  }

}

class SourceSpans extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#sourceSpans = sys.List.make(SourceSpan.type$);
    return;
  }

  typeof() { return SourceSpans.type$; }

  #sourceSpans = null;

  sourceSpans() {
    return this.#sourceSpans;
  }

  static empty() {
    return SourceSpans.priv_make();
  }

  static priv_make() {
    const $self = new SourceSpans();
    SourceSpans.priv_make$($self);
    return $self;
  }

  static priv_make$($self) {
    ;
    return;
  }

  addAllFrom(nodes) {
    const this$ = this;
    nodes.each((node) => {
      this$.addAll(sys.ObjUtil.coerce(node.sourceSpans(), sys.Type.find("markdown::SourceSpan[]")));
      return;
    });
    return;
  }

  addAll(other) {
    if (other.isEmpty()) {
      return;
    }
    ;
    if (this.#sourceSpans.isEmpty()) {
      this.#sourceSpans.addAll(other);
    }
    else {
      let lastIndex = sys.Int.minus(this.#sourceSpans.size(), 1);
      let a = this.#sourceSpans.get(lastIndex);
      let b = other.get(0);
      throw sys.Err.make("TODO: need new input index stuff from 0.24 java");
    }
    ;
    return;
  }

}

class Parser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Parser.type$; }

  #blockParserFactories = null;

  blockParserFactories() { return this.#blockParserFactories; }

  __blockParserFactories(it) { if (it === undefined) return this.#blockParserFactories; else this.#blockParserFactories = it; }

  #inlineContentParserFactories = null;

  inlineContentParserFactories() { return this.#inlineContentParserFactories; }

  __inlineContentParserFactories(it) { if (it === undefined) return this.#inlineContentParserFactories; else this.#inlineContentParserFactories = it; }

  #includeSourceSpans = null;

  includeSourceSpans() { return this.#includeSourceSpans; }

  __includeSourceSpans(it) { if (it === undefined) return this.#includeSourceSpans; else this.#includeSourceSpans = it; }

  #delimiterProcessors = null;

  delimiterProcessors() { return this.#delimiterProcessors; }

  __delimiterProcessors(it) { if (it === undefined) return this.#delimiterProcessors; else this.#delimiterProcessors = it; }

  #linkProcessors = null;

  linkProcessors() { return this.#linkProcessors; }

  __linkProcessors(it) { if (it === undefined) return this.#linkProcessors; else this.#linkProcessors = it; }

  #linkMarkers = null;

  linkMarkers() { return this.#linkMarkers; }

  __linkMarkers(it) { if (it === undefined) return this.#linkMarkers; else this.#linkMarkers = it; }

  #postProcessorFactories = null;

  postProcessorFactories() { return this.#postProcessorFactories; }

  __postProcessorFactories(it) { if (it === undefined) return this.#postProcessorFactories; else this.#postProcessorFactories = it; }

  static builder() {
    return ParserBuilder.make();
  }

  static make() {
    return Parser.builder().build();
  }

  static makeBuilder(builder) {
    const $self = new Parser();
    Parser.makeBuilder$($self,builder);
    return $self;
  }

  static makeBuilder$($self,builder) {
    $self.#blockParserFactories = sys.ObjUtil.coerce(((this$) => { let $_u34 = DocumentParser.calculateBlockParserFactories(builder.blockParserFactories(), builder.enabledBlockTypes()); if ($_u34 == null) return null; return sys.ObjUtil.toImmutable(DocumentParser.calculateBlockParserFactories(builder.blockParserFactories(), builder.enabledBlockTypes())); })($self), sys.Type.find("markdown::BlockParserFactory[]"));
    $self.#inlineContentParserFactories = sys.ObjUtil.coerce(((this$) => { let $_u35 = builder.inlineContentParserFactories(); if ($_u35 == null) return null; return sys.ObjUtil.toImmutable(builder.inlineContentParserFactories()); })($self), sys.Type.find("markdown::InlineContentParserFactory[]"));
    $self.#includeSourceSpans = builder.includeSourceSpans();
    $self.#delimiterProcessors = sys.ObjUtil.coerce(((this$) => { let $_u36 = builder.delimiterProcessors(); if ($_u36 == null) return null; return sys.ObjUtil.toImmutable(builder.delimiterProcessors()); })($self), sys.Type.find("markdown::DelimiterProcessor[]"));
    $self.#linkProcessors = sys.ObjUtil.coerce(((this$) => { let $_u37 = builder.linkProcessors(); if ($_u37 == null) return null; return sys.ObjUtil.toImmutable(builder.linkProcessors()); })($self), sys.Type.find("markdown::LinkProcessor[]"));
    $self.#linkMarkers = sys.ObjUtil.coerce(((this$) => { let $_u38 = builder.linkMarkers(); if ($_u38 == null) return null; return sys.ObjUtil.toImmutable(builder.linkMarkers()); })($self), sys.Type.find("sys::Int[]"));
    $self.#postProcessorFactories = sys.ObjUtil.coerce(((this$) => { let $_u39 = builder.postProcessorFactories(); if ($_u39 == null) return null; return sys.ObjUtil.toImmutable(builder.postProcessorFactories()); })($self), sys.Type.find("|->markdown::PostProcessor|[]"));
    let cx = InlineParserContext.make($self, Definitions.make());
    let inline = DefaultInlineParser.make(cx);
    return;
  }

  parse(text) {
    return this.parseStream(sys.Str.in(text));
  }

  parseStream(in$) {
    let docParser = this.createDocumentParser();
    let doc = docParser.parse(in$);
    return this.postProcess(doc);
  }

  createDocumentParser() {
    return DocumentParser.make(this);
  }

  postProcess(doc) {
    const this$ = this;
    this.#postProcessorFactories.each((factory) => {
      (doc = sys.Func.call(factory).process(doc));
      return;
    });
    return doc;
  }

}

class ParserBuilder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#includeSourceSpans = IncludeSourceSpans.none();
    this.#blockParserFactories = sys.List.make(BlockParserFactory.type$);
    this.#inlineContentParserFactories = sys.List.make(InlineContentParserFactory.type$);
    this.#enabledBlockTypes = DocumentParser.core_block_types();
    this.#delimiterProcessors = sys.List.make(DelimiterProcessor.type$);
    this.#linkProcessors = sys.List.make(LinkProcessor.type$);
    this.#linkMarkers = sys.List.make(sys.Int.type$);
    this.#postProcessorFactories = sys.List.make(sys.Type.find("|->markdown::PostProcessor|"));
    return;
  }

  typeof() { return ParserBuilder.type$; }

  #includeSourceSpans = null;

  includeSourceSpans(it) {
    if (it === undefined) {
      return this.#includeSourceSpans;
    }
    else {
      this.#includeSourceSpans = it;
      return;
    }
  }

  #blockParserFactories = null;

  blockParserFactories(it) {
    if (it === undefined) {
      return this.#blockParserFactories;
    }
    else {
      this.#blockParserFactories = it;
      return;
    }
  }

  #inlineContentParserFactories = null;

  inlineContentParserFactories(it) {
    if (it === undefined) {
      return this.#inlineContentParserFactories;
    }
    else {
      this.#inlineContentParserFactories = it;
      return;
    }
  }

  #enabledBlockTypes = null;

  enabledBlockTypes(it) {
    if (it === undefined) {
      return this.#enabledBlockTypes;
    }
    else {
      this.#enabledBlockTypes = it;
      return;
    }
  }

  #delimiterProcessors = null;

  delimiterProcessors(it) {
    if (it === undefined) {
      return this.#delimiterProcessors;
    }
    else {
      this.#delimiterProcessors = it;
      return;
    }
  }

  #linkProcessors = null;

  linkProcessors(it) {
    if (it === undefined) {
      return this.#linkProcessors;
    }
    else {
      this.#linkProcessors = it;
      return;
    }
  }

  #linkMarkers = null;

  linkMarkers(it) {
    if (it === undefined) {
      return this.#linkMarkers;
    }
    else {
      this.#linkMarkers = it;
      return;
    }
  }

  #postProcessorFactories = null;

  postProcessorFactories(it) {
    if (it === undefined) {
      return this.#postProcessorFactories;
    }
    else {
      this.#postProcessorFactories = it;
      return;
    }
  }

  static make() {
    const $self = new ParserBuilder();
    ParserBuilder.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  build() {
    return Parser.makeBuilder(this);
  }

  withEnabledBlockTypes(enabledBlockTypes) {
    DocumentParser.checkEnabledBlockTypes(enabledBlockTypes);
    this.#enabledBlockTypes = enabledBlockTypes;
    return this;
  }

  customBlockParserFactory(factory) {
    this.#blockParserFactories.add(factory);
    return this;
  }

  customInlineContentParserFactory(factory) {
    this.#inlineContentParserFactories.add(factory);
    return this;
  }

  postProcessorFactory(factory) {
    this.#postProcessorFactories.add(factory);
    return this;
  }

  withIncludeSourceSpans(val) {
    this.#includeSourceSpans = val;
    return this;
  }

  customDelimiterProcessor(delimiterProcessor) {
    this.#delimiterProcessors.add(delimiterProcessor);
    return this;
  }

  linkProcessor(linkProcessor) {
    this.#linkProcessors.add(linkProcessor);
    return this;
  }

  linkMarker(marker) {
    this.#linkMarkers = this.#linkMarkers.add(sys.ObjUtil.coerce(marker, sys.Obj.type$.toNullable())).unique();
    return this;
  }

  extensions(exts) {
    const this$ = this;
    exts.each((ext) => {
      ext.extendParser(this$);
      return;
    });
    return this;
  }

}

class SourceLine extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SourceLine.type$; }

  #content = null;

  content() { return this.#content; }

  __content(it) { if (it === undefined) return this.#content; else this.#content = it; }

  #sourceSpan = null;

  sourceSpan() { return this.#sourceSpan; }

  __sourceSpan(it) { if (it === undefined) return this.#sourceSpan; else this.#sourceSpan = it; }

  static make(content,sourceSpan) {
    const $self = new SourceLine();
    SourceLine.make$($self,content,sourceSpan);
    return $self;
  }

  static make$($self,content,sourceSpan) {
    if (sourceSpan === undefined) sourceSpan = null;
    $self.#content = content;
    $self.#sourceSpan = sourceSpan;
    return;
  }

  substring(beginIndex,endIndex) {
    if (sys.ObjUtil.compareLT(beginIndex, 0)) {
      throw sys.ArgErr.make(sys.Str.plus("beginIndex: ", sys.ObjUtil.coerce(beginIndex, sys.Obj.type$.toNullable())));
    }
    ;
    if (sys.ObjUtil.compareLT(endIndex, 0)) {
      throw sys.ArgErr.make(sys.Str.plus("endIndex: ", sys.ObjUtil.coerce(endIndex, sys.Obj.type$.toNullable())));
    }
    ;
    let newContent = sys.Str.getRange(this.#content, sys.Range.make(beginIndex, endIndex, true));
    let newSourceSpan = null;
    if (this.#sourceSpan != null) {
      let colIndex = sys.Int.plus(this.#sourceSpan.columnIndex(), beginIndex);
      let len = sys.Int.minus(endIndex, beginIndex);
      if (sys.ObjUtil.compareNE(len, 0)) {
        (newSourceSpan = SourceSpan.make(this.#sourceSpan.lineIndex(), colIndex, len));
      }
      ;
    }
    ;
    return SourceLine.make(newContent, newSourceSpan);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("sourceLine(content=", this.#content), ")");
  }

}

class SourceLines extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#lines = sys.List.make(SourceLine.type$);
    return;
  }

  typeof() { return SourceLines.type$; }

  #lines = null;

  lines() {
    return this.#lines;
  }

  static empty() {
    return SourceLines.make(sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("markdown::SourceLine[]")));
  }

  static makeOne(line) {
    const $self = new SourceLines();
    SourceLines.makeOne$($self,line);
    return $self;
  }

  static makeOne$($self,line) {
    SourceLines.make$($self, sys.List.make(SourceLine.type$, [line]));
    return;
  }

  static make(lines) {
    const $self = new SourceLines();
    SourceLines.make$($self,lines);
    return $self;
  }

  static make$($self,lines) {
    ;
    $self.#lines.addAll(lines);
    return;
  }

  isEmpty() {
    return this.#lines.isEmpty();
  }

  addLine(line) {
    this.#lines.add(line);
    return;
  }

  content() {
    const this$ = this;
    let sb = sys.StrBuf.make();
    this.#lines.each((line,i) => {
      if (sys.ObjUtil.compareNE(i, 0)) {
        sb.addChar(10);
      }
      ;
      sb.add(line.content());
      return;
    });
    return sb.toStr();
  }

  sourceSpans() {
    const this$ = this;
    let sourceSpans = sys.List.make(SourceSpan.type$);
    this.#lines.each((line) => {
      let sourceSpan = line.sourceSpan();
      if (sourceSpan != null) {
        sourceSpans.add(sys.ObjUtil.coerce(sourceSpan, SourceSpan.type$));
      }
      ;
      return;
    });
    return sourceSpans;
  }

}

class LinkReferenceDefinitionParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#state = LinkRefState.start_definition();
    this.#workingLines = sys.List.make(SourceLine.type$);
    this.#definitions = sys.List.make(LinkReferenceDefinition.type$);
    this.#sourceSpans = sys.List.make(SourceSpan.type$);
    this.#referenceValid = false;
    return;
  }

  typeof() { return LinkReferenceDefinitionParser.type$; }

  #state = null;

  state() {
    return this.#state;
  }

  #workingLines = null;

  // private field reflection only
  __workingLines(it) { if (it === undefined) return this.#workingLines; else this.#workingLines = it; }

  #definitions = null;

  // private field reflection only
  __definitions(it) { if (it === undefined) return this.#definitions; else this.#definitions = it; }

  #sourceSpans = null;

  // private field reflection only
  __sourceSpans(it) { if (it === undefined) return this.#sourceSpans; else this.#sourceSpans = it; }

  #label = null;

  // private field reflection only
  __label(it) { if (it === undefined) return this.#label; else this.#label = it; }

  #destination = null;

  // private field reflection only
  __destination(it) { if (it === undefined) return this.#destination; else this.#destination = it; }

  #titleDelim = 0;

  // private field reflection only
  __titleDelim(it) { if (it === undefined) return this.#titleDelim; else this.#titleDelim = it; }

  #title = null;

  // private field reflection only
  __title(it) { if (it === undefined) return this.#title; else this.#title = it; }

  #referenceValid = false;

  // private field reflection only
  __referenceValid(it) { if (it === undefined) return this.#referenceValid; else this.#referenceValid = it; }

  static make() {
    const $self = new LinkReferenceDefinitionParser();
    LinkReferenceDefinitionParser.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  paragraphLines() {
    return SourceLines.make(this.#workingLines);
  }

  linkRefDefs() {
    this.finishReference();
    return this.#definitions;
  }

  addSourceSpan(span) {
    this.#sourceSpans.add(span);
    return;
  }

  paraSourceSpans() {
    return this.#sourceSpans;
  }

  parse(line) {
    this.#workingLines.add(line);
    if (this.#state === LinkRefState.paragraph()) {
      return;
    }
    ;
    let scanner = Scanner.makeLine(line);
    while (scanner.hasNext()) {
      let success = false;
      let $_u40 = this.#state;
      if (sys.ObjUtil.equals($_u40, LinkRefState.start_definition())) {
        (success = this.onStartDefinition(scanner));
      }
      else if (sys.ObjUtil.equals($_u40, LinkRefState.label())) {
        (success = this.onLabel(scanner));
      }
      else if (sys.ObjUtil.equals($_u40, LinkRefState.destination())) {
        (success = this.onDestination(scanner));
      }
      else if (sys.ObjUtil.equals($_u40, LinkRefState.start_title())) {
        (success = this.onStartTitle(scanner));
      }
      else if (sys.ObjUtil.equals($_u40, LinkRefState.title())) {
        (success = this.onTitle(scanner));
      }
      else {
        throw sys.UnsupportedErr.make(sys.Str.plus("Unknown parsing state: ", this.#state));
      }
      ;
      if (!success) {
        this.#state = LinkRefState.paragraph();
        this.finishReference();
        return;
      }
      ;
    }
    ;
    return;
  }

  onStartDefinition(scanner) {
    this.finishReference();
    scanner.whitespace();
    if (!scanner.nextCh(91)) {
      return false;
    }
    ;
    this.#state = LinkRefState.label();
    this.#label = sys.StrBuf.make();
    if (!scanner.hasNext()) {
      this.#label.addChar(10);
    }
    ;
    return true;
  }

  onLabel(scanner) {
    let start = scanner.pos();
    if (!LinkScanner.scanLinkLabelContent(scanner)) {
      return false;
    }
    ;
    this.#label.add(scanner.source(start, scanner.pos()).content());
    if (!scanner.hasNext()) {
      this.#label.addChar(10);
      return true;
    }
    else {
      if (scanner.nextCh(93)) {
        if (!scanner.nextCh(58)) {
          return false;
        }
        ;
        if (sys.ObjUtil.compareGT(this.#label.size(), 999)) {
          return false;
        }
        ;
        let normalizedLabel = Esc.normalizeLabelContent(this.#label.toStr());
        if (sys.Str.isEmpty(normalizedLabel)) {
          return false;
        }
        ;
        this.#state = LinkRefState.destination();
        scanner.whitespace();
        return true;
      }
      else {
        return false;
      }
      ;
    }
    ;
  }

  onDestination(scanner) {
    scanner.whitespace();
    let start = scanner.pos();
    if (!LinkScanner.scanLinkDestination(scanner)) {
      return false;
    }
    ;
    let rawDestination = scanner.source(start, scanner.pos()).content();
    this.#destination = ((this$) => { if (sys.Str.startsWith(rawDestination, "<")) return sys.Str.getRange(rawDestination, sys.Range.make(1, sys.Int.minus(sys.Str.size(rawDestination), 1), true)); return rawDestination; })(this);
    let whitespace = scanner.whitespace();
    if (!scanner.hasNext()) {
      this.#referenceValid = true;
      this.#workingLines.clear();
    }
    else {
      if (sys.ObjUtil.equals(whitespace, 0)) {
        return false;
      }
      ;
    }
    ;
    this.#state = LinkRefState.start_title();
    return true;
  }

  onStartTitle(scanner) {
    scanner.whitespace();
    if (!scanner.hasNext()) {
      this.#state = LinkRefState.start_definition();
      return true;
    }
    ;
    this.#titleDelim = 0;
    let c = scanner.peek();
    let $_u42 = c;
    if (sys.ObjUtil.equals($_u42, 34) || sys.ObjUtil.equals($_u42, 39)) {
      this.#titleDelim = c;
    }
    else if (sys.ObjUtil.equals($_u42, 40)) {
      this.#titleDelim = 41;
    }
    ;
    if (sys.ObjUtil.compareNE(this.#titleDelim, 0)) {
      this.#state = LinkRefState.title();
      this.#title = sys.StrBuf.make();
      scanner.next();
      if (!scanner.hasNext()) {
        this.#title.addChar(10);
      }
      ;
    }
    else {
      this.#state = LinkRefState.start_definition();
    }
    ;
    return true;
  }

  onTitle(scanner) {
    let start = scanner.pos();
    if (!LinkScanner.scanLinkTitleContent(scanner, this.#titleDelim)) {
      this.#title = null;
      return false;
    }
    ;
    this.#title.add(scanner.source(start, scanner.pos()).content());
    if (!scanner.hasNext()) {
      this.#title.addChar(10);
      return true;
    }
    ;
    scanner.next();
    scanner.whitespace();
    if (scanner.hasNext()) {
      this.#title = null;
      return false;
    }
    ;
    this.#referenceValid = true;
    this.#workingLines.clear();
    this.#state = LinkRefState.start_definition();
    return true;
  }

  finishReference() {
    if (!this.#referenceValid) {
      return;
    }
    ;
    let d = Esc.unescapeStr(sys.ObjUtil.coerce(this.#destination, sys.Str.type$));
    let t = ((this$) => { if (this$.#title != null) return Esc.unescapeStr(this$.#title.toStr()); return null; })(this);
    let def = LinkReferenceDefinition.make(this.#label.toStr(), d, t);
    def.setSourceSpans(this.#sourceSpans);
    this.#sourceSpans.clear();
    this.#definitions.add(def);
    this.#label = null;
    this.#referenceValid = false;
    this.#destination = null;
    this.#title = null;
    return;
  }

}

class LinkRefState extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LinkRefState.type$; }

  static start_definition() { return LinkRefState.vals().get(0); }

  static label() { return LinkRefState.vals().get(1); }

  static destination() { return LinkRefState.vals().get(2); }

  static start_title() { return LinkRefState.vals().get(3); }

  static title() { return LinkRefState.vals().get(4); }

  static paragraph() { return LinkRefState.vals().get(5); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new LinkRefState();
    LinkRefState.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(LinkRefState.type$, LinkRefState.vals(), name$, checked);
  }

  static vals() {
    if (LinkRefState.#vals == null) {
      LinkRefState.#vals = sys.List.make(LinkRefState.type$, [
        LinkRefState.make(0, "start_definition", ),
        LinkRefState.make(1, "label", ),
        LinkRefState.make(2, "destination", ),
        LinkRefState.make(3, "start_title", ),
        LinkRefState.make(4, "title", ),
        LinkRefState.make(5, "paragraph", ),
      ]).toImmutable();
    }
    return LinkRefState.#vals;
  }

  static static$init() {
    const $_u44 = LinkRefState.vals();
    if (true) {
    }
    ;
    return;
  }

}

class LinkScanner extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LinkScanner.type$; }

  static scanLinkLabelContent(scanner) {
    while (scanner.hasNext()) {
      let $_u45 = scanner.peek();
      if (sys.ObjUtil.equals($_u45, 92)) {
        scanner.next();
        if (LinkScanner.isEscapable(scanner.peek())) {
          scanner.next();
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u45, 93)) {
        return true;
      }
      else if (sys.ObjUtil.equals($_u45, 91)) {
        return false;
      }
      else {
        scanner.next();
      }
      ;
    }
    ;
    return true;
  }

  static scanLinkDestination(scanner) {
    if (!scanner.hasNext()) {
      return false;
    }
    ;
    if (scanner.nextCh(60)) {
      while (scanner.hasNext()) {
        let $_u46 = scanner.peek();
        if (sys.ObjUtil.equals($_u46, 92)) {
          scanner.next();
          if (LinkScanner.isEscapable(scanner.peek())) {
            scanner.next();
          }
          ;
        }
        else if (sys.ObjUtil.equals($_u46, 10) || sys.ObjUtil.equals($_u46, 60)) {
          return false;
        }
        else if (sys.ObjUtil.equals($_u46, 62)) {
          scanner.next();
          return true;
        }
        else {
          scanner.next();
        }
        ;
      }
      ;
      return false;
    }
    else {
      return LinkScanner.scanLinkDestinationWithBalancedParaens(scanner);
    }
    ;
  }

  static scanLinkTitle(scanner) {
    if (!scanner.hasNext()) {
      return false;
    }
    ;
    let endDelim = 0;
    let $_u47 = scanner.peek();
    if (sys.ObjUtil.equals($_u47, 34)) {
      (endDelim = 34);
    }
    else if (sys.ObjUtil.equals($_u47, 39)) {
      (endDelim = 39);
    }
    else if (sys.ObjUtil.equals($_u47, 40)) {
      (endDelim = 41);
    }
    else {
      return false;
    }
    ;
    scanner.next();
    if (!LinkScanner.scanLinkTitleContent(scanner, endDelim)) {
      return false;
    }
    ;
    if (!scanner.hasNext()) {
      return false;
    }
    ;
    scanner.next();
    return true;
  }

  static scanLinkTitleContent(scanner,endDelim) {
    while (scanner.hasNext()) {
      let c = scanner.peek();
      if (sys.ObjUtil.equals(c, 92)) {
        scanner.next();
        if (LinkScanner.isEscapable(scanner.peek())) {
          scanner.next();
        }
        ;
      }
      else {
        if (sys.ObjUtil.equals(c, endDelim)) {
          return true;
        }
        else {
          if ((sys.ObjUtil.equals(endDelim, 41) && sys.ObjUtil.equals(c, 40))) {
            return false;
          }
          else {
            scanner.next();
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    return true;
  }

  static scanLinkDestinationWithBalancedParaens(scanner) {
    let parens = 0;
    let empty = true;
    while (scanner.hasNext()) {
      let c = scanner.peek();
      let $_u48 = c;
      if (sys.ObjUtil.equals($_u48, 32)) {
        return !empty;
      }
      else if (sys.ObjUtil.equals($_u48, 92)) {
        scanner.next();
        if (LinkScanner.isEscapable(scanner.peek())) {
          scanner.next();
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u48, 40)) {
        parens = sys.Int.increment(parens);
        if (sys.ObjUtil.compareGT(parens, 32)) {
          return false;
        }
        ;
        scanner.next();
      }
      else if (sys.ObjUtil.equals($_u48, 41)) {
        if (sys.ObjUtil.equals(parens, 0)) {
          return true;
        }
        else {
          parens = sys.Int.decrement(parens);
        }
        ;
        scanner.next();
      }
      else {
        if (Chars.isIsoControl(c)) {
          return !empty;
        }
        ;
        scanner.next();
      }
      ;
      (empty = false);
    }
    ;
    return true;
  }

  static isEscapable(c) {
    let $_u49 = c;
    if (sys.ObjUtil.equals($_u49, 33) || sys.ObjUtil.equals($_u49, 34) || sys.ObjUtil.equals($_u49, 35) || sys.ObjUtil.equals($_u49, 36) || sys.ObjUtil.equals($_u49, 37) || sys.ObjUtil.equals($_u49, 38) || sys.ObjUtil.equals($_u49, 39) || sys.ObjUtil.equals($_u49, 40) || sys.ObjUtil.equals($_u49, 41) || sys.ObjUtil.equals($_u49, 42) || sys.ObjUtil.equals($_u49, 43) || sys.ObjUtil.equals($_u49, 44) || sys.ObjUtil.equals($_u49, 45) || sys.ObjUtil.equals($_u49, 46) || sys.ObjUtil.equals($_u49, 47) || sys.ObjUtil.equals($_u49, 58) || sys.ObjUtil.equals($_u49, 59) || sys.ObjUtil.equals($_u49, 60) || sys.ObjUtil.equals($_u49, 61) || sys.ObjUtil.equals($_u49, 62) || sys.ObjUtil.equals($_u49, 63) || sys.ObjUtil.equals($_u49, 64) || sys.ObjUtil.equals($_u49, 91) || sys.ObjUtil.equals($_u49, 92) || sys.ObjUtil.equals($_u49, 93) || sys.ObjUtil.equals($_u49, 94) || sys.ObjUtil.equals($_u49, 95) || sys.ObjUtil.equals($_u49, 96) || sys.ObjUtil.equals($_u49, 123) || sys.ObjUtil.equals($_u49, 124) || sys.ObjUtil.equals($_u49, 125) || sys.ObjUtil.equals($_u49, 126)) {
      return true;
    }
    ;
    return false;
  }

  static make() {
    const $self = new LinkScanner();
    LinkScanner.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class HtmlBlockParser extends BlockParser {
  constructor() {
    super();
    const this$ = this;
    this.#finished = false;
    this.#content = BlockContent.make();
    this.#block = HtmlBlock.make();
    return;
  }

  typeof() { return HtmlBlockParser.type$; }

  #closingPattern = null;

  // private field reflection only
  __closingPattern(it) { if (it === undefined) return this.#closingPattern; else this.#closingPattern = it; }

  #finished = false;

  // private field reflection only
  __finished(it) { if (it === undefined) return this.#finished; else this.#finished = it; }

  #content = null;

  // private field reflection only
  __content(it) { if (it === undefined) return this.#content; else this.#content = it; }

  #block = null;

  block() {
    return this.#block;
  }

  static #factory = undefined;

  static factory() {
    if (HtmlBlockParser.#factory === undefined) {
      HtmlBlockParser.static$init();
      if (HtmlBlockParser.#factory === undefined) HtmlBlockParser.#factory = null;
    }
    return HtmlBlockParser.#factory;
  }

  static make(closingPattern) {
    const $self = new HtmlBlockParser();
    HtmlBlockParser.make$($self,closingPattern);
    return $self;
  }

  static make$($self,closingPattern) {
    BlockParser.make$($self);
    ;
    $self.#closingPattern = closingPattern;
    return;
  }

  tryContinue(state) {
    if (this.#finished) {
      return BlockContinue.none();
    }
    ;
    if ((state.isBlank() && this.#closingPattern == null)) {
      return BlockContinue.none();
    }
    else {
      return BlockContinue.atIndex(state.index());
    }
    ;
  }

  addLine(line) {
    this.#content.add(line.content());
    if ((this.#closingPattern != null && this.#closingPattern.matcher(line.content()).find())) {
      this.#finished = true;
    }
    ;
    return;
  }

  closeBlock() {
    this.block().literal(this.#content.toStr());
    this.#content = null;
    return;
  }

  static static$init() {
    HtmlBlockParser.#factory = HtmlBlockParserFactory.make();
    return;
  }

}

class HtmlBlockParserFactory extends BlockParserFactory {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HtmlBlockParserFactory.type$; }

  static #tagname = undefined;

  static tagname() {
    if (HtmlBlockParserFactory.#tagname === undefined) {
      HtmlBlockParserFactory.static$init();
      if (HtmlBlockParserFactory.#tagname === undefined) HtmlBlockParserFactory.#tagname = null;
    }
    return HtmlBlockParserFactory.#tagname;
  }

  static #attribute_name = undefined;

  static attribute_name() {
    if (HtmlBlockParserFactory.#attribute_name === undefined) {
      HtmlBlockParserFactory.static$init();
      if (HtmlBlockParserFactory.#attribute_name === undefined) HtmlBlockParserFactory.#attribute_name = null;
    }
    return HtmlBlockParserFactory.#attribute_name;
  }

  static #unquoted_val = undefined;

  static unquoted_val() {
    if (HtmlBlockParserFactory.#unquoted_val === undefined) {
      HtmlBlockParserFactory.static$init();
      if (HtmlBlockParserFactory.#unquoted_val === undefined) HtmlBlockParserFactory.#unquoted_val = null;
    }
    return HtmlBlockParserFactory.#unquoted_val;
  }

  static #singlequote_val = undefined;

  static singlequote_val() {
    if (HtmlBlockParserFactory.#singlequote_val === undefined) {
      HtmlBlockParserFactory.static$init();
      if (HtmlBlockParserFactory.#singlequote_val === undefined) HtmlBlockParserFactory.#singlequote_val = null;
    }
    return HtmlBlockParserFactory.#singlequote_val;
  }

  static #doublequote_val = undefined;

  static doublequote_val() {
    if (HtmlBlockParserFactory.#doublequote_val === undefined) {
      HtmlBlockParserFactory.static$init();
      if (HtmlBlockParserFactory.#doublequote_val === undefined) HtmlBlockParserFactory.#doublequote_val = null;
    }
    return HtmlBlockParserFactory.#doublequote_val;
  }

  static #attribute_val = undefined;

  static attribute_val() {
    if (HtmlBlockParserFactory.#attribute_val === undefined) {
      HtmlBlockParserFactory.static$init();
      if (HtmlBlockParserFactory.#attribute_val === undefined) HtmlBlockParserFactory.#attribute_val = null;
    }
    return HtmlBlockParserFactory.#attribute_val;
  }

  static #attribute_val_spec = undefined;

  static attribute_val_spec() {
    if (HtmlBlockParserFactory.#attribute_val_spec === undefined) {
      HtmlBlockParserFactory.static$init();
      if (HtmlBlockParserFactory.#attribute_val_spec === undefined) HtmlBlockParserFactory.#attribute_val_spec = null;
    }
    return HtmlBlockParserFactory.#attribute_val_spec;
  }

  static #attribute = undefined;

  static attribute() {
    if (HtmlBlockParserFactory.#attribute === undefined) {
      HtmlBlockParserFactory.static$init();
      if (HtmlBlockParserFactory.#attribute === undefined) HtmlBlockParserFactory.#attribute = null;
    }
    return HtmlBlockParserFactory.#attribute;
  }

  static #open_tag = undefined;

  static open_tag() {
    if (HtmlBlockParserFactory.#open_tag === undefined) {
      HtmlBlockParserFactory.static$init();
      if (HtmlBlockParserFactory.#open_tag === undefined) HtmlBlockParserFactory.#open_tag = null;
    }
    return HtmlBlockParserFactory.#open_tag;
  }

  static #close_tag = undefined;

  static close_tag() {
    if (HtmlBlockParserFactory.#close_tag === undefined) {
      HtmlBlockParserFactory.static$init();
      if (HtmlBlockParserFactory.#close_tag === undefined) HtmlBlockParserFactory.#close_tag = null;
    }
    return HtmlBlockParserFactory.#close_tag;
  }

  static #block_patterns = undefined;

  static block_patterns() {
    if (HtmlBlockParserFactory.#block_patterns === undefined) {
      HtmlBlockParserFactory.static$init();
      if (HtmlBlockParserFactory.#block_patterns === undefined) HtmlBlockParserFactory.#block_patterns = null;
    }
    return HtmlBlockParserFactory.#block_patterns;
  }

  tryStart(state,parser) {
    let nextNonSpace = state.nextNonSpaceIndex();
    let line = state.line().content();
    if ((sys.ObjUtil.compareLT(state.indent(), Parsing.code_block_indent()) && sys.ObjUtil.equals(sys.Str.get(line, nextNonSpace), 60))) {
      for (let blockType = 1; sys.ObjUtil.compareLE(blockType, 7); blockType = sys.Int.increment(blockType)) {
        if ((sys.ObjUtil.equals(blockType, 7) && (sys.ObjUtil.is(parser.matchedBlockParser().block(), Paragraph.type$) || state.activeBlockParser().canHaveLazyContinuationLines()))) {
          continue;
        }
        ;
        let opener = HtmlBlockParserFactory.block_patterns().get(blockType).get(0);
        let closer = HtmlBlockParserFactory.block_patterns().get(blockType).get(1);
        let matches = opener.matcher(sys.Str.getRange(line, sys.Range.make(nextNonSpace, sys.Str.size(line), true))).find();
        if (matches) {
          return sys.ObjUtil.coerce(BlockStart.of(sys.List.make(HtmlBlockParser.type$, [HtmlBlockParser.make(closer)])).atIndex(state.index()), BlockStart.type$.toNullable());
        }
        ;
      }
      ;
    }
    ;
    return BlockStart.none();
  }

  static make() {
    const $self = new HtmlBlockParserFactory();
    HtmlBlockParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    BlockParserFactory.make$($self);
    return;
  }

  static static$init() {
    HtmlBlockParserFactory.#tagname = "[A-Za-z][A-Za-z0-9-]*";
    HtmlBlockParserFactory.#attribute_name = "[a-zA-Z_:][a-zA-Z0-9:._-]*";
    HtmlBlockParserFactory.#unquoted_val = "[^\"'=<>`\\x00-\\x20]+";
    HtmlBlockParserFactory.#singlequote_val = "'[^']*'";
    HtmlBlockParserFactory.#doublequote_val = "\"[^\"]*\"";
    HtmlBlockParserFactory.#attribute_val = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("(?:", HtmlBlockParserFactory.#unquoted_val), "|"), HtmlBlockParserFactory.#singlequote_val), "|"), HtmlBlockParserFactory.#doublequote_val), ")");
    HtmlBlockParserFactory.#attribute_val_spec = sys.Str.plus(sys.Str.plus("(?:\\s*=\\s*", HtmlBlockParserFactory.#attribute_val), ")");
    HtmlBlockParserFactory.#attribute = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("(?:\\s+", HtmlBlockParserFactory.#attribute_name), ""), HtmlBlockParserFactory.#attribute_val_spec), "?)");
    HtmlBlockParserFactory.#open_tag = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("<", HtmlBlockParserFactory.#tagname), ""), HtmlBlockParserFactory.#attribute), "*\\s*/?>");
    HtmlBlockParserFactory.#close_tag = sys.Str.plus(sys.Str.plus("</", HtmlBlockParserFactory.#tagname), "\\s*[>]");
    HtmlBlockParserFactory.#block_patterns = sys.ObjUtil.coerce(((this$) => { let $_u50 = sys.List.make(sys.Type.find("sys::Regex?[]"), [sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable(), [null, null]), sys.Type.find("sys::Regex?[]")), sys.List.make(sys.Regex.type$.toNullable(), [sys.Regex.fromStr("^<(?:script|pre|style|textarea)(?:\\s|>|\$)", "i"), sys.Regex.fromStr("</(?:script|pre|style|textarea)>", "i")]), sys.List.make(sys.Regex.type$.toNullable(), [sys.Regex.fromStr("^<!--"), sys.Regex.fromStr("-->")]), sys.List.make(sys.Regex.type$.toNullable(), [sys.Regex.fromStr("^<[?]"), sys.Regex.fromStr("\\?>")]), sys.List.make(sys.Regex.type$.toNullable(), [sys.Regex.fromStr("^<![A-Z]"), sys.Regex.fromStr(">")]), sys.List.make(sys.Regex.type$.toNullable(), [sys.Regex.fromStr("^<!\\[CDATA\\["), sys.Regex.fromStr("\\]\\]>")]), sys.List.make(sys.Regex.type$.toNullable(), [sys.Regex.fromStr("^</?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\\s|[/]?[>]|\$)", "i"), null]), sys.List.make(sys.Regex.type$.toNullable(), [sys.Regex.fromStr(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("^(?:", HtmlBlockParserFactory.#open_tag), "|"), HtmlBlockParserFactory.#close_tag), ")\\s*\$"), "i"), null])]); if ($_u50 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Type.find("sys::Regex?[]"), [sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable(), [null, null]), sys.Type.find("sys::Regex?[]")), sys.List.make(sys.Regex.type$.toNullable(), [sys.Regex.fromStr("^<(?:script|pre|style|textarea)(?:\\s|>|\$)", "i"), sys.Regex.fromStr("</(?:script|pre|style|textarea)>", "i")]), sys.List.make(sys.Regex.type$.toNullable(), [sys.Regex.fromStr("^<!--"), sys.Regex.fromStr("-->")]), sys.List.make(sys.Regex.type$.toNullable(), [sys.Regex.fromStr("^<[?]"), sys.Regex.fromStr("\\?>")]), sys.List.make(sys.Regex.type$.toNullable(), [sys.Regex.fromStr("^<![A-Z]"), sys.Regex.fromStr(">")]), sys.List.make(sys.Regex.type$.toNullable(), [sys.Regex.fromStr("^<!\\[CDATA\\["), sys.Regex.fromStr("\\]\\]>")]), sys.List.make(sys.Regex.type$.toNullable(), [sys.Regex.fromStr("^</?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\\s|[/]?[>]|\$)", "i"), null]), sys.List.make(sys.Regex.type$.toNullable(), [sys.Regex.fromStr(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("^(?:", HtmlBlockParserFactory.#open_tag), "|"), HtmlBlockParserFactory.#close_tag), ")\\s*\$"), "i"), null])])); })(this), sys.Type.find("sys::Regex?[][]"));
    return;
  }

}

class BlockContent extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#sb = sys.StrBuf.make();
    this.#lineCount = 0;
    return;
  }

  typeof() { return BlockContent.type$; }

  #sb = null;

  // private field reflection only
  __sb(it) { if (it === undefined) return this.#sb; else this.#sb = it; }

  #lineCount = 0;

  // private field reflection only
  __lineCount(it) { if (it === undefined) return this.#lineCount; else this.#lineCount = it; }

  static make() {
    const $self = new BlockContent();
    BlockContent.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  add(line) {
    if (sys.ObjUtil.compareNE(this.#lineCount, 0)) {
      this.#sb.addChar(10);
    }
    ;
    this.#sb.add(line);
    this.#lineCount = sys.Int.increment(this.#lineCount);
    return;
  }

  toStr() {
    return this.#sb.toStr();
  }

}

class ParagraphParser extends BlockParser {
  constructor() {
    super();
    const this$ = this;
    this.#linkRefDefParser = LinkReferenceDefinitionParser.make();
    this.#block = Paragraph.make();
    this.#canHaveLazyContinuationLines = true;
    return;
  }

  typeof() { return ParagraphParser.type$; }

  #linkRefDefParser = null;

  // private field reflection only
  __linkRefDefParser(it) { if (it === undefined) return this.#linkRefDefParser; else this.#linkRefDefParser = it; }

  #block = null;

  block() {
    return this.#block;
  }

  #canHaveLazyContinuationLines = false;

  canHaveLazyContinuationLines() { return this.#canHaveLazyContinuationLines; }

  __canHaveLazyContinuationLines(it) { if (it === undefined) return this.#canHaveLazyContinuationLines; else this.#canHaveLazyContinuationLines = it; }

  static make() {
    const $self = new ParagraphParser();
    ParagraphParser.make$($self);
    return $self;
  }

  static make$($self) {
    BlockParser.make$($self);
    ;
    return;
  }

  tryContinue(state) {
    if (!state.isBlank()) {
      return BlockContinue.atIndex(state.index());
    }
    else {
      return BlockContinue.none();
    }
    ;
  }

  addLine(line) {
    this.#linkRefDefParser.parse(line);
    return;
  }

  addSourceSpan(sourceSpan) {
    this.#linkRefDefParser.addSourceSpan(sourceSpan);
    return;
  }

  definitions() {
    const this$ = this;
    let map = DefinitionMap.make(LinkReferenceDefinition.type$);
    this.#linkRefDefParser.linkRefDefs().each((def) => {
      map.putIfAbsent(def.label(), def);
      return;
    });
    return sys.List.make(DefinitionMap.type$, [map]);
  }

  closeBlock() {
    const this$ = this;
    this.#linkRefDefParser.linkRefDefs().each((def) => {
      this$.block().insertBefore(def);
      return;
    });
    if (this.#linkRefDefParser.paragraphLines().isEmpty()) {
      this.block().unlink();
    }
    else {
      this.block().setSourceSpans(this.#linkRefDefParser.paraSourceSpans());
    }
    ;
    return;
  }

  parseInlines(inlineParser) {
    let lines = this.#linkRefDefParser.paragraphLines();
    if (!lines.isEmpty()) {
      inlineParser.parse(lines, this.block());
    }
    ;
    return;
  }

  paragraphLines() {
    return this.#linkRefDefParser.paragraphLines();
  }

}

class ThematicBreakParser extends BlockParser {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ThematicBreakParser.type$; }

  #block = null;

  block() {
    return this.#block;
  }

  static #factory = undefined;

  static factory() {
    if (ThematicBreakParser.#factory === undefined) {
      ThematicBreakParser.static$init();
      if (ThematicBreakParser.#factory === undefined) ThematicBreakParser.#factory = null;
    }
    return ThematicBreakParser.#factory;
  }

  static make(literal) {
    const $self = new ThematicBreakParser();
    ThematicBreakParser.make$($self,literal);
    return $self;
  }

  static make$($self,literal) {
    BlockParser.make$($self);
    $self.#block = ThematicBreak.make(literal);
    return;
  }

  tryContinue(state) {
    return BlockContinue.none();
  }

  static static$init() {
    ThematicBreakParser.#factory = ThematicBreakParserFactory.make();
    return;
  }

}

class ThematicBreakParserFactory extends BlockParserFactory {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ThematicBreakParserFactory.type$; }

  tryStart(state,parser) {
    if (sys.ObjUtil.compareGE(state.indent(), 4)) {
      return BlockStart.none();
    }
    ;
    let nextNonSpace = state.nextNonSpaceIndex();
    let line = state.line().content();
    if (ThematicBreakParserFactory.isThematicBreak(line, nextNonSpace)) {
      let literal = sys.Str.getRange(line, sys.Range.make(state.index(), -1));
      return sys.ObjUtil.coerce(BlockStart.of(sys.List.make(ThematicBreakParser.type$, [ThematicBreakParser.make(literal)])).atIndex(sys.Str.size(line)), BlockStart.type$.toNullable());
    }
    ;
    return BlockStart.none();
  }

  static isThematicBreak(line,index) {
    let dashes = 0;
    let underscores = 0;
    let stars = 0;
    let len = sys.Str.size(line);
    for (let i = index; sys.ObjUtil.compareLT(i, len); i = sys.Int.increment(i)) {
      let $_u51 = sys.Str.get(line, i);
      if (sys.ObjUtil.equals($_u51, 45)) {
        dashes = sys.Int.increment(dashes);
      }
      else if (sys.ObjUtil.equals($_u51, 95)) {
        underscores = sys.Int.increment(underscores);
      }
      else if (sys.ObjUtil.equals($_u51, 42)) {
        stars = sys.Int.increment(stars);
      }
      else if (sys.ObjUtil.equals($_u51, 32) || sys.ObjUtil.equals($_u51, 9)) {
        continue;
      }
      else {
        return false;
      }
      ;
    }
    ;
    return ((sys.ObjUtil.compareGE(dashes, 3) && sys.ObjUtil.equals(underscores, 0) && sys.ObjUtil.equals(stars, 0)) || (sys.ObjUtil.compareGE(underscores, 3) && sys.ObjUtil.equals(dashes, 0) && sys.ObjUtil.equals(stars, 0)) || (sys.ObjUtil.compareGE(stars, 3) && sys.ObjUtil.equals(dashes, 0) && sys.ObjUtil.equals(underscores, 0)));
  }

  static make() {
    const $self = new ThematicBreakParserFactory();
    ThematicBreakParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    BlockParserFactory.make$($self);
    return;
  }

}

class HeadingParser extends BlockParser {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HeadingParser.type$; }

  #content = null;

  content() {
    return this.#content;
  }

  #block = null;

  block() {
    return this.#block;
  }

  static #factory = undefined;

  static factory() {
    if (HeadingParser.#factory === undefined) {
      HeadingParser.static$init();
      if (HeadingParser.#factory === undefined) HeadingParser.#factory = null;
    }
    return HeadingParser.#factory;
  }

  static make(level,content) {
    const $self = new HeadingParser();
    HeadingParser.make$($self,level,content);
    return $self;
  }

  static make$($self,level,content) {
    BlockParser.make$($self);
    $self.#block = Heading.make(level);
    $self.#content = content;
    return;
  }

  tryContinue(state) {
    return BlockContinue.none();
  }

  parseInlines(parser) {
    parser.parse(this.#content, this.block());
    return;
  }

  static static$init() {
    HeadingParser.#factory = HeadingParserFactory.make();
    return;
  }

}

class HeadingParserFactory extends BlockParserFactory {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HeadingParserFactory.type$; }

  tryStart(state,parser) {
    if (sys.ObjUtil.compareGE(state.indent(), Parsing.code_block_indent())) {
      return BlockStart.none();
    }
    ;
    let line = state.line();
    let nextNonSpace = state.nextNonSpaceIndex();
    if (sys.ObjUtil.equals(sys.Str.get(line.content(), nextNonSpace), 35)) {
      let atxHeading = HeadingParserFactory.toAtxHeading(line.substring(nextNonSpace, sys.Str.size(line.content())));
      if (atxHeading != null) {
        return sys.ObjUtil.coerce(BlockStart.of(sys.List.make(HeadingParser.type$.toNullable(), [atxHeading])).atIndex(sys.Str.size(line.content())), BlockStart.type$.toNullable());
      }
      ;
    }
    ;
    let setextHeadingLevel = HeadingParserFactory.toSetextHeadingLevel(line.content(), nextNonSpace);
    if (sys.ObjUtil.compareGT(setextHeadingLevel, 0)) {
      let para = parser.paragraphLines();
      if (!para.isEmpty()) {
        return sys.ObjUtil.coerce(sys.ObjUtil.coerce(BlockStart.of(sys.List.make(HeadingParser.type$, [HeadingParser.make(setextHeadingLevel, para)])).atIndex(sys.Str.size(line.content())), BlockStart.type$.toNullable()).replaceActiveBlockParser(), BlockStart.type$.toNullable());
      }
      ;
    }
    ;
    return BlockStart.none();
  }

  static toAtxHeading(line) {
    let scanner = Scanner.makeLine(line);
    let level = scanner.matchMultiple(35);
    if ((sys.ObjUtil.equals(level, 0) || sys.ObjUtil.compareGT(level, 6))) {
      return null;
    }
    ;
    if (!scanner.hasNext()) {
      return HeadingParser.make(level, sys.ObjUtil.coerce(SourceLines.empty(), SourceLines.type$));
    }
    ;
    let next = scanner.peek();
    if (!(sys.ObjUtil.equals(next, 32) || sys.ObjUtil.equals(next, 9))) {
      return null;
    }
    ;
    scanner.whitespace();
    let start = scanner.pos();
    let end = start;
    let hashCanEnd = true;
    while (scanner.hasNext()) {
      let c = scanner.peek();
      let $_u52 = c;
      if (sys.ObjUtil.equals($_u52, 35)) {
        if (hashCanEnd) {
          scanner.matchMultiple(35);
          let whitespace = scanner.whitespace();
          if (scanner.hasNext()) {
            (end = scanner.pos());
          }
          ;
          (hashCanEnd = sys.ObjUtil.compareGT(whitespace, 0));
        }
        else {
          scanner.next();
          (end = scanner.pos());
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u52, 32) || sys.ObjUtil.equals($_u52, 9)) {
        (hashCanEnd = true);
        scanner.next();
      }
      else {
        (hashCanEnd = false);
        scanner.next();
        (end = scanner.pos());
      }
      ;
    }
    ;
    let source = scanner.source(start, end);
    return ((this$) => { if (sys.Str.isEmpty(source.content())) return HeadingParser.make(level, sys.ObjUtil.coerce(SourceLines.empty(), SourceLines.type$)); return HeadingParser.make(level, source); })(this);
  }

  static toSetextHeadingLevel(line,index) {
    let $_u54 = sys.Str.get(line, index);
    if (sys.ObjUtil.equals($_u54, 61)) {
      if (HeadingParserFactory.isSetextHeadingRest(line, sys.Int.plus(index, 1), 61)) {
        return 1;
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u54, 45)) {
      if (HeadingParserFactory.isSetextHeadingRest(line, sys.Int.plus(index, 1), 45)) {
        return 2;
      }
      ;
    }
    ;
    return 0;
  }

  static isSetextHeadingRest(line,index,marker) {
    let afterMarker = Chars.skip(marker, line, index, sys.Str.size(line));
    let afterSpace = Chars.skipSpaceTab(line, afterMarker, sys.Str.size(line));
    return sys.ObjUtil.compareGE(afterSpace, sys.Str.size(line));
  }

  static make() {
    const $self = new HeadingParserFactory();
    HeadingParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    BlockParserFactory.make$($self);
    return;
  }

}

class ListBlockParser extends BlockParser {
  constructor() {
    super();
    const this$ = this;
    this.#hadBlankLine = false;
    this.#linesAfterBlank = 0;
    this.#isContainer = true;
    return;
  }

  typeof() { return ListBlockParser.type$; }

  #hadBlankLine = false;

  // private field reflection only
  __hadBlankLine(it) { if (it === undefined) return this.#hadBlankLine; else this.#hadBlankLine = it; }

  #linesAfterBlank = 0;

  // private field reflection only
  __linesAfterBlank(it) { if (it === undefined) return this.#linesAfterBlank; else this.#linesAfterBlank = it; }

  #block = null;

  block() {
    return this.#block;
  }

  #isContainer = false;

  isContainer() { return this.#isContainer; }

  __isContainer(it) { if (it === undefined) return this.#isContainer; else this.#isContainer = it; }

  static #factory = undefined;

  static factory() {
    if (ListBlockParser.#factory === undefined) {
      ListBlockParser.static$init();
      if (ListBlockParser.#factory === undefined) ListBlockParser.#factory = null;
    }
    return ListBlockParser.#factory;
  }

  static make(block) {
    const $self = new ListBlockParser();
    ListBlockParser.make$($self,block);
    return $self;
  }

  static make$($self,block) {
    BlockParser.make$($self);
    ;
    $self.#block = block;
    return;
  }

  canContain(childBlock) {
    if (sys.ObjUtil.is(childBlock, ListItem.type$)) {
      if ((this.#hadBlankLine && sys.ObjUtil.equals(this.#linesAfterBlank, 1))) {
        this.block().tight(false);
        this.#hadBlankLine = false;
      }
      ;
      return true;
    }
    else {
      return false;
    }
    ;
  }

  tryContinue(state) {
    if (state.isBlank()) {
      this.#hadBlankLine = true;
      this.#linesAfterBlank = 0;
    }
    else {
      if (this.#hadBlankLine) {
        this.#linesAfterBlank = sys.Int.increment(this.#linesAfterBlank);
      }
      ;
    }
    ;
    return BlockContinue.atIndex(state.index());
  }

  static static$init() {
    ListBlockParser.#factory = ListBlockParserFactory.make();
    return;
  }

}

class ListBlockParserFactory extends BlockParserFactory {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ListBlockParserFactory.type$; }

  tryStart(state,parser) {
    let matched = parser.matchedBlockParser();
    if (sys.ObjUtil.compareGE(state.indent(), Parsing.code_block_indent())) {
      return BlockStart.none();
    }
    ;
    let markerIndex = state.nextNonSpaceIndex();
    let markerColumn = sys.Int.plus(state.column(), state.indent());
    let inPara = !parser.paragraphLines().isEmpty();
    let listData = ListBlockParserFactory.parseList(state.line().content(), markerIndex, markerColumn, inPara);
    if (listData == null) {
      return BlockStart.none();
    }
    ;
    let newColumn = listData.contentColumn();
    let listItemParser = ListItemParser.make(sys.ObjUtil.coerce(state.indent(), sys.Int.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(newColumn, state.column()), sys.Int.type$.toNullable()));
    if ((!sys.ObjUtil.is(matched, ListBlockParser.type$) || !ListBlockParserFactory.listsMatch(sys.ObjUtil.coerce(matched.block(), ListBlock.type$), listData.listBlock()))) {
      let listBlockParser = ListBlockParser.make(listData.listBlock());
      listData.listBlock().tight(true);
      return sys.ObjUtil.coerce(BlockStart.of(sys.List.make(BlockParser.type$, [listBlockParser, listItemParser])).atColumn(newColumn), BlockStart.type$.toNullable());
    }
    else {
      return sys.ObjUtil.coerce(BlockStart.of(sys.List.make(ListItemParser.type$, [listItemParser])).atColumn(newColumn), BlockStart.type$.toNullable());
    }
    ;
  }

  static parseList(line,markerIndex,markerColumn,inPara) {
    let listMarker = ListBlockParserFactory.parseListMarker(line, markerIndex);
    if (listMarker == null) {
      return null;
    }
    ;
    let listBlock = listMarker.listBlock();
    let indexAfterMarker = listMarker.indexAfterMarker();
    let markerLen = sys.Int.minus(indexAfterMarker, markerIndex);
    let columnAfterMarker = sys.Int.plus(markerColumn, markerLen);
    let contentColumn = columnAfterMarker;
    let hasContent = false;
    let len = sys.Str.size(line);
    for (let i = indexAfterMarker; sys.ObjUtil.compareLT(i, len); i = sys.Int.increment(i)) {
      let c = sys.Str.get(line, i);
      if (sys.ObjUtil.equals(c, 9)) {
        contentColumn = sys.Int.plus(contentColumn, Parsing.columnsToNextTabStop(contentColumn));
      }
      else {
        if (sys.ObjUtil.equals(c, 32)) {
          contentColumn = sys.Int.increment(contentColumn);
        }
        else {
          (hasContent = true);
          break;
        }
        ;
      }
      ;
    }
    ;
    if (inPara) {
      if ((sys.ObjUtil.is(listBlock, OrderedList.type$) && sys.ObjUtil.compareNE(sys.ObjUtil.coerce(listBlock, OrderedList.type$).startNumber(), 1))) {
        return null;
      }
      ;
      if (!hasContent) {
        return null;
      }
      ;
    }
    ;
    if ((!hasContent || sys.ObjUtil.compareGT(sys.Int.minus(contentColumn, columnAfterMarker), Parsing.code_block_indent()))) {
      (contentColumn = sys.Int.plus(columnAfterMarker, 1));
    }
    ;
    return ListData.make(listBlock, contentColumn);
  }

  static parseListMarker(line,index) {
    let c = sys.Str.get(line, index);
    let $_u55 = c;
    if (sys.ObjUtil.equals($_u55, 45) || sys.ObjUtil.equals($_u55, 43) || sys.ObjUtil.equals($_u55, 42)) {
      if (ListBlockParserFactory.isSpaceTabOrEnd(line, sys.Int.plus(index, 1))) {
        let bulletList = BulletList.make(sys.Int.toChar(c));
        return ListMarkerData.make(bulletList, sys.Int.plus(index, 1));
      }
      else {
        return null;
      }
      ;
    }
    else {
      return ListBlockParserFactory.parseOrderedList(line, index);
    }
    ;
  }

  static parseOrderedList(line,index) {
    let digits = 0;
    let len = sys.Str.size(line);
    for (let i = index; sys.ObjUtil.compareLT(i, len); i = sys.Int.increment(i)) {
      let c = sys.Str.get(line, i);
      if (sys.Int.isDigit(c)) {
        digits = sys.Int.increment(digits);
        if (sys.ObjUtil.compareGT(digits, 9)) {
          return null;
        }
        ;
      }
      else {
        if ((sys.ObjUtil.equals(c, 46) || sys.ObjUtil.equals(c, 41))) {
          if ((sys.ObjUtil.compareGE(digits, 1) && ListBlockParserFactory.isSpaceTabOrEnd(line, sys.Int.plus(i, 1)))) {
            let number = sys.Str.getRange(line, sys.Range.make(index, i, true));
            let orderedList = OrderedList.make(sys.Str.toInt(number), sys.Int.toChar(c));
            return ListMarkerData.make(orderedList, sys.Int.plus(i, 1));
          }
          else {
            return null;
          }
          ;
        }
        else {
          return null;
        }
        ;
      }
      ;
    }
    ;
    return null;
  }

  static isSpaceTabOrEnd(line,index) {
    if (sys.ObjUtil.compareLT(index, sys.Str.size(line))) {
      let $_u56 = sys.Str.get(line, index);
      if (sys.ObjUtil.equals($_u56, 32) || sys.ObjUtil.equals($_u56, 9)) {
        return true;
      }
      else {
        return false;
      }
      ;
    }
    else {
      return true;
    }
    ;
  }

  static listsMatch(a,b) {
    if ((sys.ObjUtil.is(a, BulletList.type$) && sys.ObjUtil.is(b, BulletList.type$))) {
      return sys.ObjUtil.equals(sys.ObjUtil.trap(a,"marker", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.trap(b,"marker", sys.List.make(sys.Obj.type$.toNullable(), [])));
    }
    else {
      if ((sys.ObjUtil.is(a, OrderedList.type$) && sys.ObjUtil.is(b, OrderedList.type$))) {
        return sys.ObjUtil.equals(sys.ObjUtil.trap(a,"markerDelim", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.trap(b,"markerDelim", sys.List.make(sys.Obj.type$.toNullable(), [])));
      }
      ;
    }
    ;
    return false;
  }

  static make() {
    const $self = new ListBlockParserFactory();
    ListBlockParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    BlockParserFactory.make$($self);
    return;
  }

}

class ListItemParser extends BlockParser {
  constructor() {
    super();
    const this$ = this;
    this.#hadBlankLine = false;
    this.#isContainer = true;
    return;
  }

  typeof() { return ListItemParser.type$; }

  #contentIndent = 0;

  contentIndent() { return this.#contentIndent; }

  __contentIndent(it) { if (it === undefined) return this.#contentIndent; else this.#contentIndent = it; }

  #hadBlankLine = false;

  // private field reflection only
  __hadBlankLine(it) { if (it === undefined) return this.#hadBlankLine; else this.#hadBlankLine = it; }

  #block = null;

  block() {
    return this.#block;
  }

  #isContainer = false;

  isContainer() { return this.#isContainer; }

  __isContainer(it) { if (it === undefined) return this.#isContainer; else this.#isContainer = it; }

  static make(markerIndent,contentIndent) {
    const $self = new ListItemParser();
    ListItemParser.make$($self,markerIndent,contentIndent);
    return $self;
  }

  static make$($self,markerIndent,contentIndent) {
    BlockParser.make$($self);
    ;
    $self.#contentIndent = sys.ObjUtil.coerce(contentIndent, sys.Int.type$);
    $self.#block = ListItem.make(markerIndent, contentIndent);
    return;
  }

  canContain(childBlock) {
    if (this.#hadBlankLine) {
      let parent = this.block().parent();
      if (sys.ObjUtil.is(parent, ListBlock.type$)) {
        sys.ObjUtil.coerce(parent, ListBlock.type$).tight(false);
      }
      ;
    }
    ;
    return true;
  }

  tryContinue(state) {
    if (state.isBlank()) {
      if (this.block().firstChild() == null) {
        return BlockContinue.none();
      }
      else {
        let activeBlock = state.activeBlockParser().block();
        this.#hadBlankLine = (sys.ObjUtil.is(activeBlock, Paragraph.type$) || sys.ObjUtil.is(activeBlock, ListItem.type$));
        return BlockContinue.atIndex(state.nextNonSpaceIndex());
      }
      ;
    }
    ;
    if (sys.ObjUtil.compareGE(state.indent(), this.#contentIndent)) {
      return BlockContinue.atColumn(sys.Int.plus(state.column(), this.#contentIndent));
    }
    else {
      return BlockContinue.none();
    }
    ;
  }

}

class ListData extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ListData.type$; }

  #listBlock = null;

  listBlock() {
    return this.#listBlock;
  }

  #contentColumn = 0;

  contentColumn() { return this.#contentColumn; }

  __contentColumn(it) { if (it === undefined) return this.#contentColumn; else this.#contentColumn = it; }

  static make(listBlock,contentColumn) {
    const $self = new ListData();
    ListData.make$($self,listBlock,contentColumn);
    return $self;
  }

  static make$($self,listBlock,contentColumn) {
    $self.#listBlock = listBlock;
    $self.#contentColumn = contentColumn;
    return;
  }

}

class ListMarkerData extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ListMarkerData.type$; }

  #listBlock = null;

  listBlock() {
    return this.#listBlock;
  }

  #indexAfterMarker = 0;

  indexAfterMarker() { return this.#indexAfterMarker; }

  __indexAfterMarker(it) { if (it === undefined) return this.#indexAfterMarker; else this.#indexAfterMarker = it; }

  static make(listBlock,indexAfterMarker) {
    const $self = new ListMarkerData();
    ListMarkerData.make$($self,listBlock,indexAfterMarker);
    return $self;
  }

  static make$($self,listBlock,indexAfterMarker) {
    $self.#listBlock = listBlock;
    $self.#indexAfterMarker = indexAfterMarker;
    return;
  }

}

class BlockQuoteParser extends BlockParser {
  constructor() {
    super();
    const this$ = this;
    this.#block = BlockQuote.make();
    this.#isContainer = true;
    return;
  }

  typeof() { return BlockQuoteParser.type$; }

  #block = null;

  block() {
    return this.#block;
  }

  #isContainer = false;

  isContainer() { return this.#isContainer; }

  __isContainer(it) { if (it === undefined) return this.#isContainer; else this.#isContainer = it; }

  static #factory = undefined;

  static factory() {
    if (BlockQuoteParser.#factory === undefined) {
      BlockQuoteParser.static$init();
      if (BlockQuoteParser.#factory === undefined) BlockQuoteParser.#factory = null;
    }
    return BlockQuoteParser.#factory;
  }

  static make() {
    const $self = new BlockQuoteParser();
    BlockQuoteParser.make$($self);
    return $self;
  }

  static make$($self) {
    BlockParser.make$($self);
    ;
    return;
  }

  canContain(block) {
    return true;
  }

  tryContinue(state) {
    let nextNonSpace = state.nextNonSpaceIndex();
    if (BlockQuoteParser.isMarker(state, nextNonSpace)) {
      let newColumn = sys.Int.plus(sys.Int.plus(state.column(), state.indent()), 1);
      if (Chars.isSpaceOrTab(state.line().content(), sys.Int.plus(nextNonSpace, 1))) {
        newColumn = sys.Int.increment(newColumn);
      }
      ;
      return BlockContinue.atColumn(newColumn);
    }
    ;
    return BlockContinue.none();
  }

  static isMarker(state,index) {
    let line = state.line().content();
    return (sys.ObjUtil.compareLT(state.indent(), Parsing.code_block_indent()) && sys.ObjUtil.compareLT(index, sys.Str.size(line)) && sys.ObjUtil.equals(sys.Str.get(line, index), 62));
  }

  static static$init() {
    BlockQuoteParser.#factory = BlockQuoteParserFactory.make();
    return;
  }

}

class BlockQuoteParserFactory extends BlockParserFactory {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BlockQuoteParserFactory.type$; }

  tryStart(state,parser) {
    let nextNonSpace = state.nextNonSpaceIndex();
    if (BlockQuoteParser.isMarker(state, nextNonSpace)) {
      let newColumn = sys.Int.plus(sys.Int.plus(state.column(), state.indent()), 1);
      if (Chars.isSpaceOrTab(state.line().content(), sys.Int.plus(nextNonSpace, 1))) {
        newColumn = sys.Int.increment(newColumn);
      }
      ;
      return sys.ObjUtil.coerce(BlockStart.of(sys.List.make(BlockQuoteParser.type$, [BlockQuoteParser.make()])).atColumn(newColumn), BlockStart.type$.toNullable());
    }
    ;
    return BlockStart.none();
  }

  static make() {
    const $self = new BlockQuoteParserFactory();
    BlockQuoteParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    BlockParserFactory.make$($self);
    return;
  }

}

class DocumentBlockParser extends BlockParser {
  constructor() {
    super();
    const this$ = this;
    this.#block = Document.make();
    this.#isContainer = true;
    return;
  }

  typeof() { return DocumentBlockParser.type$; }

  #block = null;

  block() {
    return this.#block;
  }

  #isContainer = false;

  isContainer() { return this.#isContainer; }

  __isContainer(it) { if (it === undefined) return this.#isContainer; else this.#isContainer = it; }

  static make() {
    const $self = new DocumentBlockParser();
    DocumentBlockParser.make$($self);
    return $self;
  }

  static make$($self) {
    BlockParser.make$($self);
    ;
    return;
  }

  canContain(block) {
    return true;
  }

  tryContinue(state) {
    return BlockContinue.atIndex(state.index());
  }

  addLine(line) {
    return;
  }

}

class FencedCodeParser extends BlockParser {
  constructor() {
    super();
    const this$ = this;
    this.#otherLines = sys.StrBuf.make();
    return;
  }

  typeof() { return FencedCodeParser.type$; }

  #fenceChar = 0;

  // private field reflection only
  __fenceChar(it) { if (it === undefined) return this.#fenceChar; else this.#fenceChar = it; }

  #openingFenceLen = 0;

  // private field reflection only
  __openingFenceLen(it) { if (it === undefined) return this.#openingFenceLen; else this.#openingFenceLen = it; }

  #firstLine = null;

  // private field reflection only
  __firstLine(it) { if (it === undefined) return this.#firstLine; else this.#firstLine = it; }

  #otherLines = null;

  // private field reflection only
  __otherLines(it) { if (it === undefined) return this.#otherLines; else this.#otherLines = it; }

  #block = null;

  block() {
    return this.#block;
  }

  static #factory = undefined;

  static factory() {
    if (FencedCodeParser.#factory === undefined) {
      FencedCodeParser.static$init();
      if (FencedCodeParser.#factory === undefined) FencedCodeParser.#factory = null;
    }
    return FencedCodeParser.#factory;
  }

  static make(fenceChar,fenceLen,fenceIndent) {
    const $self = new FencedCodeParser();
    FencedCodeParser.make$($self,fenceChar,fenceLen,fenceIndent);
    return $self;
  }

  static make$($self,fenceChar,fenceLen,fenceIndent) {
    BlockParser.make$($self);
    ;
    $self.#fenceChar = fenceChar;
    $self.#openingFenceLen = fenceLen;
    $self.#block = FencedCode.make(sys.Int.toChar(fenceChar));
    $self.block().openingFenceLen(sys.ObjUtil.coerce(fenceLen, sys.Int.type$.toNullable()));
    $self.block().fenceIndent(fenceIndent);
    return;
  }

  tryContinue(state) {
    let nextNonSpace = state.nextNonSpaceIndex();
    let newIndex = state.index();
    let line = state.line().content();
    if ((sys.ObjUtil.compareLT(state.indent(), Parsing.code_block_indent()) && sys.ObjUtil.compareLT(nextNonSpace, sys.Str.size(line)) && this.tryClosing(line, nextNonSpace))) {
      return BlockContinue.finished();
    }
    else {
      let i = this.block().fenceIndent();
      let len = sys.Str.size(line);
      while ((sys.ObjUtil.compareGT(i, 0) && sys.ObjUtil.compareLT(newIndex, len) && sys.ObjUtil.equals(sys.Str.get(line, newIndex), 32))) {
        newIndex = sys.Int.increment(newIndex);
        i = sys.Int.decrement(i);
      }
      ;
    }
    ;
    return BlockContinue.atIndex(newIndex);
  }

  tryClosing(line,index) {
    let fences = sys.Int.minus(Chars.skip(this.#fenceChar, line, index, sys.Str.size(line)), index);
    if (sys.ObjUtil.compareLT(fences, this.#openingFenceLen)) {
      return false;
    }
    ;
    let after = Chars.skipSpaceTab(line, sys.Int.plus(index, fences), sys.Str.size(line));
    if (sys.ObjUtil.equals(after, sys.Str.size(line))) {
      this.block().closingFenceLen(sys.ObjUtil.coerce(fences, sys.Int.type$.toNullable()));
      return true;
    }
    ;
    return false;
  }

  addLine(line) {
    if (this.#firstLine == null) {
      this.#firstLine = line.content();
    }
    else {
      this.#otherLines.add(line.content()).addChar(10);
    }
    ;
    return;
  }

  closeBlock() {
    this.block().info(((this$) => { if (this$.#firstLine == null) return null; return Esc.unescapeStr(sys.Str.trim(this$.#firstLine)); })(this));
    this.block().literal(this.#otherLines.toStr());
    return;
  }

  static static$init() {
    FencedCodeParser.#factory = FencedCodeParserFactory.make();
    return;
  }

}

class FencedCodeParserFactory extends BlockParserFactory {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FencedCodeParserFactory.type$; }

  tryStart(state,parser) {
    let indent = state.indent();
    if (sys.ObjUtil.compareGE(indent, Parsing.code_block_indent())) {
      return BlockStart.none();
    }
    ;
    let nextNonSpace = state.nextNonSpaceIndex();
    let blockParser = FencedCodeParserFactory.checkOpener(state.line().content(), nextNonSpace, indent);
    if (blockParser != null) {
      return sys.ObjUtil.coerce(BlockStart.of(sys.List.make(FencedCodeParser.type$.toNullable(), [blockParser])).atIndex(sys.Int.plus(nextNonSpace, sys.ObjUtil.coerce(blockParser.block().openingFenceLen(), sys.Int.type$))), BlockStart.type$.toNullable());
    }
    ;
    return BlockStart.none();
  }

  static checkOpener(line,index,indent) {
    let backticks = 0;
    let tildes = 0;
    let len = sys.Str.size(line);
    for (let i = index; sys.ObjUtil.compareLT(i, len); i = sys.Int.increment(i)) {
      let $_u58 = sys.Str.get(line, i);
      if (sys.ObjUtil.equals($_u58, 96)) {
        backticks = sys.Int.increment(backticks);
      }
      else if (sys.ObjUtil.equals($_u58, 126)) {
        tildes = sys.Int.increment(tildes);
      }
      else {
        break;
      }
      ;
    }
    ;
    if ((sys.ObjUtil.compareGE(backticks, 3) && sys.ObjUtil.equals(tildes, 0))) {
      if (sys.ObjUtil.compareNE(Chars.find(96, line, sys.Int.plus(index, backticks)), -1)) {
        return null;
      }
      ;
      return FencedCodeParser.make(96, backticks, indent);
    }
    else {
      if ((sys.ObjUtil.compareGE(tildes, 3) && sys.ObjUtil.equals(backticks, 0))) {
        return FencedCodeParser.make(126, tildes, indent);
      }
      else {
        return null;
      }
      ;
    }
    ;
  }

  static make() {
    const $self = new FencedCodeParserFactory();
    FencedCodeParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    BlockParserFactory.make$($self);
    return;
  }

}

class IndentedCodeParser extends BlockParser {
  constructor() {
    super();
    const this$ = this;
    this.#block = IndentedCode.make();
    this.#lines = sys.List.make(sys.Str.type$);
    return;
  }

  typeof() { return IndentedCodeParser.type$; }

  #block = null;

  block() {
    return this.#block;
  }

  #lines = null;

  // private field reflection only
  __lines(it) { if (it === undefined) return this.#lines; else this.#lines = it; }

  static #factory = undefined;

  static factory() {
    if (IndentedCodeParser.#factory === undefined) {
      IndentedCodeParser.static$init();
      if (IndentedCodeParser.#factory === undefined) IndentedCodeParser.#factory = null;
    }
    return IndentedCodeParser.#factory;
  }

  static make() {
    const $self = new IndentedCodeParser();
    IndentedCodeParser.make$($self);
    return $self;
  }

  static make$($self) {
    BlockParser.make$($self);
    ;
    return;
  }

  tryContinue(state) {
    if (sys.ObjUtil.compareGE(state.indent(), Parsing.code_block_indent())) {
      return BlockContinue.atColumn(sys.Int.plus(state.column(), Parsing.code_block_indent()));
    }
    else {
      if (state.isBlank()) {
        return BlockContinue.atIndex(state.nextNonSpaceIndex());
      }
      else {
        return BlockContinue.none();
      }
      ;
    }
    ;
  }

  addLine(line) {
    this.#lines.add(line.content());
    return;
  }

  closeBlock() {
    let lastNonBlank = sys.Int.minus(this.#lines.size(), 1);
    while (sys.ObjUtil.compareGE(lastNonBlank, 0)) {
      if (!Chars.isBlank(this.#lines.get(lastNonBlank))) {
        break;
      }
      ;
      lastNonBlank = sys.Int.decrement(lastNonBlank);
    }
    ;
    let sb = sys.StrBuf.make();
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Int.plus(lastNonBlank, 1)); i = sys.Int.increment(i)) {
      sb.add(this.#lines.get(i)).addChar(10);
    }
    ;
    this.block().literal(sb.toStr());
    return;
  }

  static static$init() {
    IndentedCodeParser.#factory = IndentedCodeParserFactory.make();
    return;
  }

}

class IndentedCodeParserFactory extends BlockParserFactory {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return IndentedCodeParserFactory.type$; }

  tryStart(state,parser) {
    if ((sys.ObjUtil.compareGE(state.indent(), Parsing.code_block_indent()) && !state.isBlank() && !sys.ObjUtil.is(state.activeBlockParser().block(), Paragraph.type$))) {
      return sys.ObjUtil.coerce(BlockStart.of(sys.List.make(IndentedCodeParser.type$, [IndentedCodeParser.make()])).atColumn(sys.Int.plus(state.column(), Parsing.code_block_indent())), BlockStart.type$.toNullable());
    }
    ;
    return BlockStart.none();
  }

  static make() {
    const $self = new IndentedCodeParserFactory();
    IndentedCodeParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    BlockParserFactory.make$($self);
    return;
  }

}

class BackslashInlineParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BackslashInlineParser.type$; }

  static #escapable = undefined;

  static escapable() {
    if (BackslashInlineParser.#escapable === undefined) {
      BackslashInlineParser.static$init();
      if (BackslashInlineParser.#escapable === undefined) BackslashInlineParser.#escapable = null;
    }
    return BackslashInlineParser.#escapable;
  }

  static #factory = undefined;

  static factory() {
    if (BackslashInlineParser.#factory === undefined) {
      BackslashInlineParser.static$init();
      if (BackslashInlineParser.#factory === undefined) BackslashInlineParser.#factory = null;
    }
    return BackslashInlineParser.#factory;
  }

  tryParse(state) {
    let scanner = state.scanner();
    scanner.next();
    let next = scanner.peek();
    if (sys.ObjUtil.equals(next, 10)) {
      scanner.next();
      return ParsedInline.of(HardLineBreak.make(), scanner.pos());
    }
    else {
      if (BackslashInlineParser.escapable().matcher(sys.Int.toChar(next)).matches()) {
        scanner.next();
        return ParsedInline.of(Text.make(sys.Int.toChar(next)), scanner.pos());
      }
      else {
        return ParsedInline.of(Text.make("\\"), scanner.pos());
      }
      ;
    }
    ;
  }

  static make() {
    const $self = new BackslashInlineParser();
    BackslashInlineParser.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    BackslashInlineParser.#escapable = sys.ObjUtil.coerce(sys.Regex.fromStr(sys.Str.plus("^", Esc.escapable())), sys.Regex.type$);
    BackslashInlineParser.#factory = BackslashInlineParserFactory.make();
    return;
  }

}

class BackslashInlineParserFactory extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#triggerChars = sys.ObjUtil.coerce(((this$) => { let $_u59 = sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(92, sys.Obj.type$.toNullable())]); if ($_u59 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(92, sys.Obj.type$.toNullable())])); })(this), sys.Type.find("sys::Int[]"));
    return;
  }

  typeof() { return BackslashInlineParserFactory.type$; }

  #triggerChars = null;

  triggerChars() { return this.#triggerChars; }

  __triggerChars(it) { if (it === undefined) return this.#triggerChars; else this.#triggerChars = it; }

  create() {
    return BackslashInlineParser.make();
  }

  static make() {
    const $self = new BackslashInlineParserFactory();
    BackslashInlineParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class HtmlInlineParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HtmlInlineParser.type$; }

  static #asciiLetter = undefined;

  static asciiLetter() {
    if (HtmlInlineParser.#asciiLetter === undefined) {
      HtmlInlineParser.static$init();
      if (HtmlInlineParser.#asciiLetter === undefined) HtmlInlineParser.#asciiLetter = null;
    }
    return HtmlInlineParser.#asciiLetter;
  }

  static #tagNameStart = undefined;

  static tagNameStart() {
    if (HtmlInlineParser.#tagNameStart === undefined) {
      HtmlInlineParser.static$init();
      if (HtmlInlineParser.#tagNameStart === undefined) HtmlInlineParser.#tagNameStart = null;
    }
    return HtmlInlineParser.#tagNameStart;
  }

  static #tagNameContinue = undefined;

  static tagNameContinue() {
    if (HtmlInlineParser.#tagNameContinue === undefined) {
      HtmlInlineParser.static$init();
      if (HtmlInlineParser.#tagNameContinue === undefined) HtmlInlineParser.#tagNameContinue = null;
    }
    return HtmlInlineParser.#tagNameContinue;
  }

  static #attrStart = undefined;

  static attrStart() {
    if (HtmlInlineParser.#attrStart === undefined) {
      HtmlInlineParser.static$init();
      if (HtmlInlineParser.#attrStart === undefined) HtmlInlineParser.#attrStart = null;
    }
    return HtmlInlineParser.#attrStart;
  }

  static #attrContinue = undefined;

  static attrContinue() {
    if (HtmlInlineParser.#attrContinue === undefined) {
      HtmlInlineParser.static$init();
      if (HtmlInlineParser.#attrContinue === undefined) HtmlInlineParser.#attrContinue = null;
    }
    return HtmlInlineParser.#attrContinue;
  }

  static #attrValEnd = undefined;

  static attrValEnd() {
    if (HtmlInlineParser.#attrValEnd === undefined) {
      HtmlInlineParser.static$init();
      if (HtmlInlineParser.#attrValEnd === undefined) HtmlInlineParser.#attrValEnd = null;
    }
    return HtmlInlineParser.#attrValEnd;
  }

  static #factory = undefined;

  static factory() {
    if (HtmlInlineParser.#factory === undefined) {
      HtmlInlineParser.static$init();
      if (HtmlInlineParser.#factory === undefined) HtmlInlineParser.#factory = null;
    }
    return HtmlInlineParser.#factory;
  }

  tryParse(state) {
    let scanner = state.scanner();
    let start = scanner.pos();
    scanner.next();
    let c = scanner.peek();
    if (sys.Func.call(HtmlInlineParser.tagNameStart(), sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()))) {
      if (HtmlInlineParser.tryOpenTag(sys.ObjUtil.coerce(scanner, Scanner.type$))) {
        return HtmlInlineParser.htmlInline(start, sys.ObjUtil.coerce(scanner, Scanner.type$));
      }
      ;
    }
    else {
      if (sys.ObjUtil.equals(c, 47)) {
        if (HtmlInlineParser.tryClosingTag(sys.ObjUtil.coerce(scanner, Scanner.type$))) {
          return HtmlInlineParser.htmlInline(start, sys.ObjUtil.coerce(scanner, Scanner.type$));
        }
        ;
      }
      else {
        if (sys.ObjUtil.equals(c, 63)) {
          if (HtmlInlineParser.tryProcessingInstruction(sys.ObjUtil.coerce(scanner, Scanner.type$))) {
            return HtmlInlineParser.htmlInline(start, sys.ObjUtil.coerce(scanner, Scanner.type$));
          }
          ;
        }
        else {
          if (sys.ObjUtil.equals(c, 33)) {
            scanner.next();
            (c = scanner.peek());
            if (sys.ObjUtil.equals(c, 45)) {
              if (HtmlInlineParser.tryComment(sys.ObjUtil.coerce(scanner, Scanner.type$))) {
                return HtmlInlineParser.htmlInline(start, sys.ObjUtil.coerce(scanner, Scanner.type$));
              }
              ;
            }
            else {
              if (sys.ObjUtil.equals(c, 91)) {
                if (HtmlInlineParser.tryCdata(sys.ObjUtil.coerce(scanner, Scanner.type$))) {
                  return HtmlInlineParser.htmlInline(start, sys.ObjUtil.coerce(scanner, Scanner.type$));
                }
                ;
              }
              else {
                if (sys.Func.call(HtmlInlineParser.asciiLetter(), sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()))) {
                  if (HtmlInlineParser.tryDeclaration(sys.ObjUtil.coerce(scanner, Scanner.type$))) {
                    return HtmlInlineParser.htmlInline(start, sys.ObjUtil.coerce(scanner, Scanner.type$));
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
    return ParsedInline.none();
  }

  static htmlInline(start,scanner) {
    let text = scanner.source(start, scanner.pos()).content();
    let node = HtmlInline.make(text);
    return sys.ObjUtil.coerce(ParsedInline.of(node, scanner.pos()), ParsedInline.type$);
  }

  static tryOpenTag(scanner) {
    scanner.next();
    scanner.match(HtmlInlineParser.tagNameContinue());
    let whitespace = sys.ObjUtil.compareGE(scanner.whitespace(), 1);
    while ((whitespace && sys.ObjUtil.compareGE(scanner.match(HtmlInlineParser.attrStart()), 1))) {
      scanner.match(HtmlInlineParser.attrContinue());
      (whitespace = sys.ObjUtil.compareGE(scanner.whitespace(), 1));
      if (scanner.nextCh(61)) {
        scanner.whitespace();
        let valStart = scanner.peek();
        if (sys.ObjUtil.equals(valStart, 39)) {
          scanner.next();
          if (sys.ObjUtil.compareLT(scanner.find(39), 0)) {
            return false;
          }
          ;
          scanner.next();
        }
        else {
          if (sys.ObjUtil.equals(valStart, 34)) {
            scanner.next();
            if (sys.ObjUtil.compareLT(scanner.find(34), 0)) {
              return false;
            }
            ;
            scanner.next();
          }
          else {
            if (sys.ObjUtil.compareLE(scanner.findMatch(HtmlInlineParser.attrValEnd()), 0)) {
              return false;
            }
            ;
          }
          ;
        }
        ;
        (whitespace = sys.ObjUtil.compareGE(scanner.whitespace(), 1));
      }
      ;
    }
    ;
    scanner.nextCh(47);
    return scanner.nextCh(62);
  }

  static tryClosingTag(scanner) {
    scanner.next();
    if (sys.ObjUtil.compareGE(scanner.match(HtmlInlineParser.tagNameStart()), 1)) {
      scanner.match(HtmlInlineParser.tagNameContinue());
      scanner.whitespace();
      return scanner.nextCh(62);
    }
    ;
    return false;
  }

  static tryProcessingInstruction(scanner) {
    scanner.next();
    while (sys.ObjUtil.compareGT(scanner.find(63), 0)) {
      scanner.next();
      if (scanner.nextCh(62)) {
        return true;
      }
      ;
    }
    ;
    return false;
  }

  static tryComment(scanner) {
    scanner.next();
    if (!scanner.nextCh(45)) {
      return false;
    }
    ;
    if ((scanner.nextCh(62) || scanner.nextStr("->"))) {
      return true;
    }
    ;
    while (sys.ObjUtil.compareGE(scanner.find(45), 0)) {
      if (scanner.nextStr("-->")) {
        return true;
      }
      else {
        scanner.next();
      }
      ;
    }
    ;
    return false;
  }

  static tryCdata(scanner) {
    scanner.next();
    if (scanner.nextStr("CDATA[")) {
      while (sys.ObjUtil.compareGE(scanner.find(93), 0)) {
        if (scanner.nextStr("]]>")) {
          return true;
        }
        else {
          scanner.next();
        }
        ;
      }
      ;
    }
    ;
    return false;
  }

  static tryDeclaration(scanner) {
    scanner.match(HtmlInlineParser.asciiLetter());
    if (sys.ObjUtil.compareLE(scanner.whitespace(), 0)) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareGE(scanner.find(62), 0)) {
      scanner.next();
      return true;
    }
    ;
    return false;
  }

  static make() {
    const $self = new HtmlInlineParser();
    HtmlInlineParser.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    const this$ = this;
    HtmlInlineParser.#asciiLetter = sys.ObjUtil.coerce(((this$) => { let $_u60 = (c) => {
      return sys.Int.isAlpha(c);
    }; if ($_u60 == null) return null; return sys.ObjUtil.toImmutable((c) => {
      return sys.Int.isAlpha(c);
    }); })(this), sys.Type.find("|sys::Int->sys::Bool|"));
    HtmlInlineParser.#tagNameStart = sys.ObjUtil.coerce(((this$) => { let $_u61 = (c) => {
      return sys.Int.isAlpha(c);
    }; if ($_u61 == null) return null; return sys.ObjUtil.toImmutable((c) => {
      return sys.Int.isAlpha(c);
    }); })(this), sys.Type.find("|sys::Int->sys::Bool|"));
    HtmlInlineParser.#tagNameContinue = sys.ObjUtil.coerce(((this$) => { let $_u62 = (c) => {
      return (sys.Int.isAlphaNum(c) || sys.ObjUtil.equals(c, 45));
    }; if ($_u62 == null) return null; return sys.ObjUtil.toImmutable((c) => {
      return (sys.Int.isAlphaNum(c) || sys.ObjUtil.equals(c, 45));
    }); })(this), sys.Type.find("|sys::Int->sys::Bool|"));
    HtmlInlineParser.#attrStart = sys.ObjUtil.coerce(((this$) => { let $_u63 = (c) => {
      return (sys.Int.isAlpha(c) || sys.ObjUtil.equals(c, 95) || sys.ObjUtil.equals(c, 58));
    }; if ($_u63 == null) return null; return sys.ObjUtil.toImmutable((c) => {
      return (sys.Int.isAlpha(c) || sys.ObjUtil.equals(c, 95) || sys.ObjUtil.equals(c, 58));
    }); })(this), sys.Type.find("|sys::Int->sys::Bool|"));
    HtmlInlineParser.#attrContinue = sys.ObjUtil.coerce(((this$) => { let $_u64 = (c) => {
      return (sys.Func.call(HtmlInlineParser.#attrStart, sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable())) || sys.Int.isDigit(c) || sys.ObjUtil.equals(c, 46) || sys.ObjUtil.equals(c, 45));
    }; if ($_u64 == null) return null; return sys.ObjUtil.toImmutable((c) => {
      return (sys.Func.call(HtmlInlineParser.#attrStart, sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable())) || sys.Int.isDigit(c) || sys.ObjUtil.equals(c, 46) || sys.ObjUtil.equals(c, 45));
    }); })(this), sys.Type.find("|sys::Int->sys::Bool|"));
    HtmlInlineParser.#attrValEnd = sys.ObjUtil.coerce(((this$) => { let $_u65 = (c) => {
      let $_u66 = c;
      if (sys.ObjUtil.equals($_u66, 32) || sys.ObjUtil.equals($_u66, 9) || sys.ObjUtil.equals($_u66, 10) || sys.ObjUtil.equals($_u66, 11) || sys.ObjUtil.equals($_u66, 12) || sys.ObjUtil.equals($_u66, 13) || sys.ObjUtil.equals($_u66, 34) || sys.ObjUtil.equals($_u66, 39) || sys.ObjUtil.equals($_u66, 61) || sys.ObjUtil.equals($_u66, 60) || sys.ObjUtil.equals($_u66, 62) || sys.ObjUtil.equals($_u66, 96)) {
        return true;
      }
      else {
        return false;
      }
      ;
    }; if ($_u65 == null) return null; return sys.ObjUtil.toImmutable((c) => {
      let $_u67 = c;
      if (sys.ObjUtil.equals($_u67, 32) || sys.ObjUtil.equals($_u67, 9) || sys.ObjUtil.equals($_u67, 10) || sys.ObjUtil.equals($_u67, 11) || sys.ObjUtil.equals($_u67, 12) || sys.ObjUtil.equals($_u67, 13) || sys.ObjUtil.equals($_u67, 34) || sys.ObjUtil.equals($_u67, 39) || sys.ObjUtil.equals($_u67, 61) || sys.ObjUtil.equals($_u67, 60) || sys.ObjUtil.equals($_u67, 62) || sys.ObjUtil.equals($_u67, 96)) {
        return true;
      }
      else {
        return false;
      }
      ;
    }); })(this), sys.Type.find("|sys::Int->sys::Bool|"));
    HtmlInlineParser.#factory = HtmlInlineParserFactory.make();
    return;
  }

}

class HtmlInlineParserFactory extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#triggerChars = sys.ObjUtil.coerce(((this$) => { let $_u68 = sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(60, sys.Obj.type$.toNullable())]); if ($_u68 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(60, sys.Obj.type$.toNullable())])); })(this), sys.Type.find("sys::Int[]"));
    return;
  }

  typeof() { return HtmlInlineParserFactory.type$; }

  #triggerChars = null;

  triggerChars() { return this.#triggerChars; }

  __triggerChars(it) { if (it === undefined) return this.#triggerChars; else this.#triggerChars = it; }

  create() {
    return HtmlInlineParser.make();
  }

  static make() {
    const $self = new HtmlInlineParserFactory();
    HtmlInlineParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class AutolinkInlineParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AutolinkInlineParser.type$; }

  static #uri = undefined;

  static uri() {
    if (AutolinkInlineParser.#uri === undefined) {
      AutolinkInlineParser.static$init();
      if (AutolinkInlineParser.#uri === undefined) AutolinkInlineParser.#uri = null;
    }
    return AutolinkInlineParser.#uri;
  }

  static #email = undefined;

  static email() {
    if (AutolinkInlineParser.#email === undefined) {
      AutolinkInlineParser.static$init();
      if (AutolinkInlineParser.#email === undefined) AutolinkInlineParser.#email = null;
    }
    return AutolinkInlineParser.#email;
  }

  static #factory = undefined;

  static factory() {
    if (AutolinkInlineParser.#factory === undefined) {
      AutolinkInlineParser.static$init();
      if (AutolinkInlineParser.#factory === undefined) AutolinkInlineParser.#factory = null;
    }
    return AutolinkInlineParser.#factory;
  }

  tryParse(state) {
    let scanner = state.scanner();
    scanner.next();
    let textStart = scanner.pos();
    if (sys.ObjUtil.compareGT(scanner.find(62), 0)) {
      let textSource = scanner.source(textStart, scanner.pos());
      let content = textSource.content();
      scanner.next();
      let dest = null;
      if (AutolinkInlineParser.uri().matcher(content).matches()) {
        (dest = content);
      }
      else {
        if (AutolinkInlineParser.email().matcher(content).matches()) {
          (dest = sys.Str.plus("mailto:", content));
        }
        ;
      }
      ;
      if (dest != null) {
        let link = Link.make(sys.ObjUtil.coerce(dest, sys.Str.type$), null);
        let text = Text.make(content);
        text.setSourceSpans(textSource.sourceSpans());
        link.appendChild(text);
        return ParsedInline.of(link, scanner.pos());
      }
      ;
    }
    ;
    return ParsedInline.none();
  }

  static make() {
    const $self = new AutolinkInlineParser();
    AutolinkInlineParser.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    AutolinkInlineParser.#uri = sys.ObjUtil.coerce(sys.Regex.fromStr("^[a-zA-Z][a-zA-Z0-9.+-]{1,31}:[^<> - ]*\$"), sys.Regex.type$);
    AutolinkInlineParser.#email = sys.ObjUtil.coerce(sys.Regex.fromStr("^([a-zA-Z0-9.!#\$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)\$"), sys.Regex.type$);
    AutolinkInlineParser.#factory = AutolinkInlineParserFactory.make();
    return;
  }

}

class AutolinkInlineParserFactory extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#triggerChars = sys.ObjUtil.coerce(((this$) => { let $_u69 = sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(60, sys.Obj.type$.toNullable())]); if ($_u69 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(60, sys.Obj.type$.toNullable())])); })(this), sys.Type.find("sys::Int[]"));
    return;
  }

  typeof() { return AutolinkInlineParserFactory.type$; }

  #triggerChars = null;

  triggerChars() { return this.#triggerChars; }

  __triggerChars(it) { if (it === undefined) return this.#triggerChars; else this.#triggerChars = it; }

  create() {
    return AutolinkInlineParser.make();
  }

  static make() {
    const $self = new AutolinkInlineParserFactory();
    AutolinkInlineParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class InlineParser {
  constructor() {
    const this$ = this;
  }

  typeof() { return InlineParser.type$; }

}

class InlineParserContext extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InlineParserContext.type$; }

  #factories = null;

  factories() { return this.#factories; }

  __factories(it) { if (it === undefined) return this.#factories; else this.#factories = it; }

  #customDelimiterProcessors = null;

  customDelimiterProcessors() { return this.#customDelimiterProcessors; }

  __customDelimiterProcessors(it) { if (it === undefined) return this.#customDelimiterProcessors; else this.#customDelimiterProcessors = it; }

  #customLinkProcessors = null;

  customLinkProcessors() { return this.#customLinkProcessors; }

  __customLinkProcessors(it) { if (it === undefined) return this.#customLinkProcessors; else this.#customLinkProcessors = it; }

  #customLinkMarkers = null;

  customLinkMarkers() { return this.#customLinkMarkers; }

  __customLinkMarkers(it) { if (it === undefined) return this.#customLinkMarkers; else this.#customLinkMarkers = it; }

  #definitions = null;

  definitions(it) {
    if (it === undefined) {
      return this.#definitions;
    }
    else {
      this.#definitions = it;
      return;
    }
  }

  static make(parser,defs) {
    const $self = new InlineParserContext();
    InlineParserContext.make$($self,parser,defs);
    return $self;
  }

  static make$($self,parser,defs) {
    $self.#factories = sys.ObjUtil.coerce(((this$) => { let $_u70 = parser.inlineContentParserFactories(); if ($_u70 == null) return null; return sys.ObjUtil.toImmutable(parser.inlineContentParserFactories()); })($self), sys.Type.find("markdown::InlineContentParserFactory[]"));
    $self.#customDelimiterProcessors = sys.ObjUtil.coerce(((this$) => { let $_u71 = parser.delimiterProcessors(); if ($_u71 == null) return null; return sys.ObjUtil.toImmutable(parser.delimiterProcessors()); })($self), sys.Type.find("markdown::DelimiterProcessor[]"));
    $self.#customLinkProcessors = sys.ObjUtil.coerce(((this$) => { let $_u72 = parser.linkProcessors(); if ($_u72 == null) return null; return sys.ObjUtil.toImmutable(parser.linkProcessors()); })($self), sys.Type.find("markdown::LinkProcessor[]"));
    $self.#customLinkMarkers = sys.ObjUtil.coerce(((this$) => { let $_u73 = parser.linkMarkers(); if ($_u73 == null) return null; return sys.ObjUtil.toImmutable(parser.linkMarkers()); })($self), sys.Type.find("sys::Int[]"));
    $self.#definitions = defs;
    return;
  }

  def(type,label) {
    return this.#definitions.def(type, label);
  }

}

class InlineParserState {
  constructor() {
    const this$ = this;
  }

  typeof() { return InlineParserState.type$; }

}

class ParsedInline extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ParsedInline.type$; }

  #node = null;

  node() {
    return this.#node;
  }

  #pos = null;

  pos() { return this.#pos; }

  __pos(it) { if (it === undefined) return this.#pos; else this.#pos = it; }

  static none() {
    return null;
  }

  static of(node,pos) {
    return ParsedInline.priv_make(node, pos);
  }

  static priv_make(node,pos) {
    const $self = new ParsedInline();
    ParsedInline.priv_make$($self,node,pos);
    return $self;
  }

  static priv_make$($self,node,pos) {
    $self.#node = node;
    $self.#pos = pos;
    return;
  }

}

class LinkInfo {
  constructor() {
    const this$ = this;
  }

  typeof() { return LinkInfo.type$; }

}

class MLinkInfo extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#label = null;
    this.#destination = null;
    this.#title = null;
    return;
  }

  typeof() { return MLinkInfo.type$; }

  #marker = null;

  marker(it) {
    if (it === undefined) {
      return this.#marker;
    }
    else {
      this.#marker = it;
      return;
    }
  }

  #openingBracket = null;

  openingBracket(it) {
    if (it === undefined) {
      return this.#openingBracket;
    }
    else {
      this.#openingBracket = it;
      return;
    }
  }

  #text = null;

  text() { return this.#text; }

  __text(it) { if (it === undefined) return this.#text; else this.#text = it; }

  #label = null;

  label() { return this.#label; }

  __label(it) { if (it === undefined) return this.#label; else this.#label = it; }

  #destination = null;

  destination() { return this.#destination; }

  __destination(it) { if (it === undefined) return this.#destination; else this.#destination = it; }

  #title = null;

  title() { return this.#title; }

  __title(it) { if (it === undefined) return this.#title; else this.#title = it; }

  #afterTextBracket = null;

  afterTextBracket() { return this.#afterTextBracket; }

  __afterTextBracket(it) { if (it === undefined) return this.#afterTextBracket; else this.#afterTextBracket = it; }

  static make(f) {
    const $self = new MLinkInfo();
    MLinkInfo.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ;
    sys.Func.call(f, $self);
    return;
  }

}

class EntityInlineParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EntityInlineParser.type$; }

  static #hex = undefined;

  static hex() {
    if (EntityInlineParser.#hex === undefined) {
      EntityInlineParser.static$init();
      if (EntityInlineParser.#hex === undefined) EntityInlineParser.#hex = null;
    }
    return EntityInlineParser.#hex;
  }

  static #dec = undefined;

  static dec() {
    if (EntityInlineParser.#dec === undefined) {
      EntityInlineParser.static$init();
      if (EntityInlineParser.#dec === undefined) EntityInlineParser.#dec = null;
    }
    return EntityInlineParser.#dec;
  }

  static #entityContinue = undefined;

  static entityContinue() {
    if (EntityInlineParser.#entityContinue === undefined) {
      EntityInlineParser.static$init();
      if (EntityInlineParser.#entityContinue === undefined) EntityInlineParser.#entityContinue = null;
    }
    return EntityInlineParser.#entityContinue;
  }

  static #factory = undefined;

  static factory() {
    if (EntityInlineParser.#factory === undefined) {
      EntityInlineParser.static$init();
      if (EntityInlineParser.#factory === undefined) EntityInlineParser.#factory = null;
    }
    return EntityInlineParser.#factory;
  }

  tryParse(state) {
    let scanner = state.scanner();
    let start = scanner.pos();
    scanner.next();
    let c = scanner.peek();
    if (sys.ObjUtil.equals(c, 35)) {
      scanner.next();
      if ((scanner.nextCh(120) || scanner.nextCh(88))) {
        let digits = scanner.match(EntityInlineParser.hex());
        if ((sys.ObjUtil.compareLE(1, digits) && sys.ObjUtil.compareLE(digits, 6) && scanner.nextCh(59))) {
          return this.entity(sys.ObjUtil.coerce(scanner, Scanner.type$), start);
        }
        ;
      }
      else {
        let digits = scanner.match(EntityInlineParser.dec());
        if ((sys.ObjUtil.compareLE(1, digits) && sys.ObjUtil.compareLE(digits, 7) && scanner.nextCh(59))) {
          return this.entity(sys.ObjUtil.coerce(scanner, Scanner.type$), start);
        }
        ;
      }
      ;
    }
    else {
      if (sys.Int.isAlpha(c)) {
        scanner.match(EntityInlineParser.entityContinue());
        if (scanner.nextCh(59)) {
          return this.entity(sys.ObjUtil.coerce(scanner, Scanner.type$), start);
        }
        ;
      }
      ;
    }
    ;
    return ParsedInline.none();
  }

  entity(scanner,start) {
    let text = scanner.source(start, scanner.pos()).content();
    return sys.ObjUtil.coerce(ParsedInline.of(Text.make(Html5.entityToStr(text)), scanner.pos()), ParsedInline.type$);
  }

  static make() {
    const $self = new EntityInlineParser();
    EntityInlineParser.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    const this$ = this;
    EntityInlineParser.#hex = sys.ObjUtil.coerce(((this$) => { let $_u74 = (ch) => {
      return (sys.Int.isDigit(ch) || (sys.ObjUtil.compareLE(97, ch) && sys.ObjUtil.compareLE(ch, 102)) || (sys.ObjUtil.compareLE(65, ch) && sys.ObjUtil.compareLE(ch, 70)));
    }; if ($_u74 == null) return null; return sys.ObjUtil.toImmutable((ch) => {
      return (sys.Int.isDigit(ch) || (sys.ObjUtil.compareLE(97, ch) && sys.ObjUtil.compareLE(ch, 102)) || (sys.ObjUtil.compareLE(65, ch) && sys.ObjUtil.compareLE(ch, 70)));
    }); })(this), sys.Type.find("|sys::Int->sys::Bool|"));
    EntityInlineParser.#dec = sys.ObjUtil.coerce(((this$) => { let $_u75 = (ch) => {
      return sys.Int.isDigit(ch);
    }; if ($_u75 == null) return null; return sys.ObjUtil.toImmutable((ch) => {
      return sys.Int.isDigit(ch);
    }); })(this), sys.Type.find("|sys::Int->sys::Bool|"));
    EntityInlineParser.#entityContinue = sys.ObjUtil.coerce(((this$) => { let $_u76 = (ch) => {
      return sys.Int.isAlphaNum(ch);
    }; if ($_u76 == null) return null; return sys.ObjUtil.toImmutable((ch) => {
      return sys.Int.isAlphaNum(ch);
    }); })(this), sys.Type.find("|sys::Int->sys::Bool|"));
    EntityInlineParser.#factory = EntityInlineParserFactory.make();
    return;
  }

}

class EntityInlineParserFactory extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#triggerChars = sys.ObjUtil.coerce(((this$) => { let $_u77 = sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(38, sys.Obj.type$.toNullable())]); if ($_u77 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(38, sys.Obj.type$.toNullable())])); })(this), sys.Type.find("sys::Int[]"));
    return;
  }

  typeof() { return EntityInlineParserFactory.type$; }

  #triggerChars = null;

  triggerChars() { return this.#triggerChars; }

  __triggerChars(it) { if (it === undefined) return this.#triggerChars; else this.#triggerChars = it; }

  create() {
    return EntityInlineParser.make();
  }

  static make() {
    const $self = new EntityInlineParserFactory();
    EntityInlineParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class Delimiter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Delimiter.type$; }

  #chars = null;

  chars() {
    return this.#chars;
  }

  #delimChar = 0;

  delimChar() { return this.#delimChar; }

  __delimChar(it) { if (it === undefined) return this.#delimChar; else this.#delimChar = it; }

  #origSize = 0;

  origSize() { return this.#origSize; }

  __origSize(it) { if (it === undefined) return this.#origSize; else this.#origSize = it; }

  #canOpen = false;

  canOpen() { return this.#canOpen; }

  __canOpen(it) { if (it === undefined) return this.#canOpen; else this.#canOpen = it; }

  #canClose = false;

  canClose() { return this.#canClose; }

  __canClose(it) { if (it === undefined) return this.#canClose; else this.#canClose = it; }

  #prev = null;

  prev(it) {
    if (it === undefined) {
      return this.#prev;
    }
    else {
      this.#prev = it;
      return;
    }
  }

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

  static make(chars,delimChar,canOpen,canClose,prev) {
    const $self = new Delimiter();
    Delimiter.make$($self,chars,delimChar,canOpen,canClose,prev);
    return $self;
  }

  static make$($self,chars,delimChar,canOpen,canClose,prev) {
    $self.#chars = chars;
    $self.#delimChar = delimChar;
    $self.#canOpen = canOpen;
    $self.#canClose = canClose;
    $self.#prev = prev;
    $self.#origSize = chars.size();
    return;
  }

  size() {
    return this.#chars.size();
  }

  opener() {
    return this.#chars.get(sys.Int.minus(this.#chars.size(), 1));
  }

  closer() {
    return sys.ObjUtil.coerce(this.#chars.first(), Text.type$);
  }

  openers(len) {
    if (!(sys.ObjUtil.compareGE(len, 1) && sys.ObjUtil.compareLE(len, this.size()))) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("len must be between 1 and ", sys.ObjUtil.coerce(this.size(), sys.Obj.type$.toNullable())), ", was "), sys.ObjUtil.coerce(len, sys.Obj.type$.toNullable())));
    }
    ;
    return this.#chars.getRange(sys.Range.make(sys.Int.minus(this.#chars.size(), len), this.#chars.size(), true));
  }

  closers(len) {
    if (!(sys.ObjUtil.compareGE(len, 1) && sys.ObjUtil.compareLE(len, this.size()))) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("len must be between 1 and ", sys.ObjUtil.coerce(this.size(), sys.Obj.type$.toNullable())), ", was "), sys.ObjUtil.coerce(len, sys.Obj.type$.toNullable())));
    }
    ;
    return this.#chars.getRange(sys.Range.make(0, len, true));
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Delimiter: ", sys.Int.toChar(this.#delimChar)), " origSize="), sys.ObjUtil.coerce(this.#origSize, sys.Obj.type$.toNullable())), "\n  chars:    "), this.#chars), "\n  canOpen:  "), sys.ObjUtil.coerce(this.#canOpen, sys.Obj.type$.toNullable())), "\n  canClose: "), sys.ObjUtil.coerce(this.#canClose, sys.Obj.type$.toNullable()));
  }

}

class Bracket extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#allowed = true;
    this.#bracketAfter = false;
    return;
  }

  typeof() { return Bracket.type$; }

  #markerNode = null;

  markerNode(it) {
    if (it === undefined) {
      return this.#markerNode;
    }
    else {
      this.#markerNode = it;
      return;
    }
  }

  #markerPos = null;

  markerPos() { return this.#markerPos; }

  __markerPos(it) { if (it === undefined) return this.#markerPos; else this.#markerPos = it; }

  #bracketNode = null;

  bracketNode(it) {
    if (it === undefined) {
      return this.#bracketNode;
    }
    else {
      this.#bracketNode = it;
      return;
    }
  }

  #bracketPos = null;

  bracketPos() { return this.#bracketPos; }

  __bracketPos(it) { if (it === undefined) return this.#bracketPos; else this.#bracketPos = it; }

  #contentPos = null;

  contentPos() { return this.#contentPos; }

  __contentPos(it) { if (it === undefined) return this.#contentPos; else this.#contentPos = it; }

  #prev = null;

  prev() {
    return this.#prev;
  }

  #prevDelim = null;

  prevDelim() {
    return this.#prevDelim;
  }

  #allowed = false;

  allowed(it) {
    if (it === undefined) {
      return this.#allowed;
    }
    else {
      this.#allowed = it;
      return;
    }
  }

  #bracketAfter = false;

  bracketAfter(it) {
    if (it === undefined) {
      return this.#bracketAfter;
    }
    else {
      this.#bracketAfter = it;
      return;
    }
  }

  static link(bracketNode,bracketPos,contentPos,prev,prevDelim) {
    const this$ = this;
    return Bracket.make((it) => {
      it.#markerNode = null;
      it.#markerPos = null;
      it.#bracketNode = bracketNode;
      it.#bracketPos = bracketPos;
      it.#contentPos = contentPos;
      it.#prev = prev;
      it.#prevDelim = prevDelim;
      return;
    });
  }

  static withMarker(markerNode,markerPos,bracketNode,bracketPos,contentPos,prev,prevDelim) {
    const this$ = this;
    return Bracket.make((it) => {
      it.#markerNode = markerNode;
      it.#markerPos = markerPos;
      it.#bracketNode = bracketNode;
      it.#bracketPos = bracketPos;
      it.#contentPos = contentPos;
      it.#prev = prev;
      it.#prevDelim = prevDelim;
      return;
    });
  }

  static make(f) {
    const $self = new Bracket();
    Bracket.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ;
    sys.Func.call(f, $self);
    return;
  }

}

class EmphasisDelimiterProcessor extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EmphasisDelimiterProcessor.type$; }

  #delimChar = 0;

  delimChar() { return this.#delimChar; }

  __delimChar(it) { if (it === undefined) return this.#delimChar; else this.#delimChar = it; }

  static make(delimChar) {
    const $self = new EmphasisDelimiterProcessor();
    EmphasisDelimiterProcessor.make$($self,delimChar);
    return $self;
  }

  static make$($self,delimChar) {
    $self.#delimChar = delimChar;
    return;
  }

  openingChar() {
    return this.#delimChar;
  }

  closingChar() {
    return this.#delimChar;
  }

  minLen() {
    return 1;
  }

  process(openingRun,closingRun) {
    const this$ = this;
    if (((openingRun.canClose() || closingRun.canOpen()) && sys.ObjUtil.compareNE(sys.Int.mod(closingRun.origSize(), 3), 0) && sys.ObjUtil.equals(sys.Int.mod(sys.Int.plus(openingRun.origSize(), closingRun.origSize()), 3), 0))) {
      return 0;
    }
    ;
    let usedDelims = 0;
    let emphasis = null;
    if ((sys.ObjUtil.compareGE(openingRun.size(), 2) && sys.ObjUtil.compareGE(closingRun.size(), 2))) {
      (usedDelims = 2);
      (emphasis = StrongEmphasis.make(sys.Str.mult(sys.Int.toChar(this.#delimChar), 2)));
    }
    else {
      (usedDelims = 1);
      (emphasis = Emphasis.make(sys.Int.toChar(this.#delimChar)));
    }
    ;
    let sourceSpans = SourceSpans.empty();
    sourceSpans.addAllFrom(openingRun.openers(usedDelims));
    let opener = openingRun.opener();
    Node.eachBetween(opener, closingRun.closer(), (node) => {
      emphasis.appendChild(node);
      sourceSpans.addAll(sys.ObjUtil.coerce(node.sourceSpans(), sys.Type.find("markdown::SourceSpan[]")));
      return;
    });
    sourceSpans.addAllFrom(closingRun.closers(usedDelims));
    emphasis.setSourceSpans(sourceSpans.sourceSpans());
    opener.insertAfter(sys.ObjUtil.coerce(emphasis, Node.type$));
    return usedDelims;
  }

}

class AsteriskDelimiterProcessor extends EmphasisDelimiterProcessor {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsteriskDelimiterProcessor.type$; }

  static make() {
    const $self = new AsteriskDelimiterProcessor();
    AsteriskDelimiterProcessor.make$($self);
    return $self;
  }

  static make$($self) {
    EmphasisDelimiterProcessor.make$($self, 42);
    return;
  }

}

class UnderscoreDelimiterProcessor extends EmphasisDelimiterProcessor {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnderscoreDelimiterProcessor.type$; }

  static make() {
    const $self = new UnderscoreDelimiterProcessor();
    UnderscoreDelimiterProcessor.make$($self);
    return $self;
  }

  static make$($self) {
    EmphasisDelimiterProcessor.make$($self, 95);
    return;
  }

}

class BackticksInlineParser extends InlineCodeParser {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BackticksInlineParser.type$; }

  static #factory = undefined;

  static factory() {
    if (BackticksInlineParser.#factory === undefined) {
      BackticksInlineParser.static$init();
      if (BackticksInlineParser.#factory === undefined) BackticksInlineParser.#factory = null;
    }
    return BackticksInlineParser.#factory;
  }

  static make() {
    const $self = new BackticksInlineParser();
    BackticksInlineParser.make$($self);
    return $self;
  }

  static make$($self) {
    InlineCodeParser.make$($self, 96);
    return;
  }

  static static$init() {
    BackticksInlineParser.#factory = BackticksInlineParserFactory.make();
    return;
  }

}

class BackticksInlineParserFactory extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#triggerChars = sys.ObjUtil.coerce(((this$) => { let $_u78 = sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(96, sys.Obj.type$.toNullable())]); if ($_u78 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(96, sys.Obj.type$.toNullable())])); })(this), sys.Type.find("sys::Int[]"));
    return;
  }

  typeof() { return BackticksInlineParserFactory.type$; }

  #triggerChars = null;

  triggerChars() { return this.#triggerChars; }

  __triggerChars(it) { if (it === undefined) return this.#triggerChars; else this.#triggerChars = it; }

  create() {
    return BackticksInlineParser.make();
  }

  static make() {
    const $self = new BackticksInlineParserFactory();
    BackticksInlineParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class DefaultInlineParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DefaultInlineParser.type$; }

  #cx = null;

  // private field reflection only
  __cx(it) { if (it === undefined) return this.#cx; else this.#cx = it; }

  #inlineContentParserFactories = null;

  // private field reflection only
  __inlineContentParserFactories(it) { if (it === undefined) return this.#inlineContentParserFactories; else this.#inlineContentParserFactories = it; }

  #delimProcessors = null;

  // private field reflection only
  __delimProcessors(it) { if (it === undefined) return this.#delimProcessors; else this.#delimProcessors = it; }

  #linkProcessors = null;

  // private field reflection only
  __linkProcessors(it) { if (it === undefined) return this.#linkProcessors; else this.#linkProcessors = it; }

  #linkMarkers = null;

  // private field reflection only
  __linkMarkers(it) { if (it === undefined) return this.#linkMarkers; else this.#linkMarkers = it; }

  #specialChars = null;

  // private field reflection only
  __specialChars(it) { if (it === undefined) return this.#specialChars; else this.#specialChars = it; }

  #inlineParsers = null;

  // private field reflection only
  __inlineParsers(it) { if (it === undefined) return this.#inlineParsers; else this.#inlineParsers = it; }

  #scanner = null;

  scanner() {
    return this.#scanner;
  }

  #includeSourceSpans = false;

  // private field reflection only
  __includeSourceSpans(it) { if (it === undefined) return this.#includeSourceSpans; else this.#includeSourceSpans = it; }

  #trailingSpaces = 0;

  // private field reflection only
  __trailingSpaces(it) { if (it === undefined) return this.#trailingSpaces; else this.#trailingSpaces = it; }

  #lastDelim = null;

  // private field reflection only
  __lastDelim(it) { if (it === undefined) return this.#lastDelim; else this.#lastDelim = it; }

  #lastBracket = null;

  // private field reflection only
  __lastBracket(it) { if (it === undefined) return this.#lastBracket; else this.#lastBracket = it; }

  static make(cx) {
    const $self = new DefaultInlineParser();
    DefaultInlineParser.make$($self,cx);
    return $self;
  }

  static make$($self,cx) {
    $self.#cx = cx;
    $self.#inlineContentParserFactories = $self.calculateInlineContentParserFactories();
    $self.#delimProcessors = DefaultInlineParser.calculateDelimProcessors(cx.customDelimiterProcessors());
    $self.#linkProcessors = DefaultInlineParser.calculateLinkProcessors(cx.customLinkProcessors());
    $self.#linkMarkers = DefaultInlineParser.calculateLinkMarkers(cx.customLinkMarkers());
    $self.#specialChars = DefaultInlineParser.calculateSpecialChars($self.#linkMarkers, $self.#delimProcessors.keys(), $self.#inlineContentParserFactories);
    return;
  }

  calculateInlineContentParserFactories() {
    let acc = sys.List.make(InlineContentParserFactory.type$);
    acc.addAll(this.#cx.factories());
    acc.add(BackslashInlineParser.factory());
    acc.add(BackticksInlineParser.factory());
    acc.add(EntityInlineParser.factory());
    acc.add(AutolinkInlineParser.factory());
    acc.add(HtmlInlineParser.factory());
    return acc;
  }

  static calculateLinkProcessors(custom) {
    let acc = sys.List.make(LinkProcessor.type$);
    acc.addAll(custom);
    acc.add(CoreLinkProcessor.make());
    return acc;
  }

  static calculateDelimProcessors(custom) {
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("markdown::DelimiterProcessor"));
    DefaultInlineParser.addDelimProcessor(sys.List.make(EmphasisDelimiterProcessor.type$, [AsteriskDelimiterProcessor.make(), UnderscoreDelimiterProcessor.make()]), acc);
    DefaultInlineParser.addDelimProcessor(custom, acc);
    return acc;
  }

  static addDelimProcessor(processors,acc) {
    const this$ = this;
    processors.each((processor) => {
      let opening = processor.openingChar();
      let closing = processor.closingChar();
      if (sys.ObjUtil.equals(opening, closing)) {
        let old = acc.get(sys.ObjUtil.coerce(opening, sys.Obj.type$.toNullable()));
        if ((old != null && sys.ObjUtil.equals(old.openingChar(), old.closingChar()))) {
          throw sys.Err.make("TODO");
        }
        else {
          DefaultInlineParser.addDelimiterProcessorForChar(opening, processor, acc);
        }
        ;
      }
      else {
        DefaultInlineParser.addDelimiterProcessorForChar(opening, processor, acc);
        DefaultInlineParser.addDelimiterProcessorForChar(closing, processor, acc);
      }
      ;
      return;
    });
    return;
  }

  static addDelimiterProcessorForChar(delimChar,toAdd,acc) {
    let existing = acc.get(sys.ObjUtil.coerce(delimChar, sys.Obj.type$.toNullable()));
    if (existing != null) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Delimiter processor conflict with delimiter char '", sys.Int.toChar(delimChar)), "'"));
    }
    ;
    acc.set(sys.ObjUtil.coerce(delimChar, sys.Obj.type$.toNullable()), toAdd);
    return;
  }

  createInlineContentParsers() {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("markdown::InlineContentParser[]"));
    this.#inlineContentParserFactories.each((factory) => {
      let parser = factory.create();
      factory.triggerChars().each((ch) => {
        let parsers = acc.get(sys.ObjUtil.coerce(ch, sys.Obj.type$.toNullable()));
        if (parsers == null) {
          acc.set(sys.ObjUtil.coerce(ch, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce((parsers = sys.List.make(InlineContentParser.type$)), sys.Type.find("markdown::InlineContentParser[]")));
        }
        ;
        parsers.add(parser);
        return;
      });
      return;
    });
    return acc;
  }

  static calculateLinkMarkers(customLinkMarkers) {
    const this$ = this;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("sys::Bool")), (it) => {
      it.def(sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()));
      return;
    }), sys.Type.find("[sys::Int:sys::Bool]"));
    customLinkMarkers.each((marker) => {
      acc.set(sys.ObjUtil.coerce(marker, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      return;
    });
    acc.set(sys.ObjUtil.coerce(33, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    return acc;
  }

  static calculateSpecialChars(linkMarkers,delimChars,inlineContentParserFactories) {
    const this$ = this;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("sys::Bool")), (it) => {
      it.def(sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()));
      return;
    }), sys.Type.find("[sys::Int:sys::Bool]"));
    delimChars.each((ch) => {
      acc.set(sys.ObjUtil.coerce(ch, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      return;
    });
    inlineContentParserFactories.each((factory) => {
      factory.triggerChars().each((ch) => {
        acc.set(sys.ObjUtil.coerce(ch, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
        return;
      });
      return;
    });
    acc.set(sys.ObjUtil.coerce(91, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    acc.set(sys.ObjUtil.coerce(93, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    acc.set(sys.ObjUtil.coerce(33, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    acc.set(sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    return acc;
  }

  parse(lines,block) {
    const this$ = this;
    this.reset(lines);
    while (true) {
      let nodes = this.parseInline();
      if (nodes == null) {
        break;
      }
      ;
      nodes.each((node) => {
        block.appendChild(node);
        return;
      });
    }
    ;
    this.processDelimiters(null);
    this.mergeChildTextNodes(block);
    return;
  }

  reset(lines) {
    this.#scanner = Scanner.makeSourceLines(lines);
    this.#includeSourceSpans = !lines.sourceSpans().isEmpty();
    this.#trailingSpaces = 0;
    this.#lastDelim = null;
    this.#lastBracket = null;
    this.#inlineParsers = this.createInlineContentParsers();
    return;
  }

  text(sourceLines) {
    let text = Text.make(sourceLines.content());
    text.setSourceSpans(sourceLines.sourceSpans());
    return text;
  }

  parseInline() {
    const this$ = this;
    let c = this.scanner().peek();
    let $_u79 = c;
    if (sys.ObjUtil.equals($_u79, 91)) {
      return sys.List.make(Node.type$, [this.parseOpenBracket()]);
    }
    else if (sys.ObjUtil.equals($_u79, 93)) {
      return sys.List.make(Node.type$, [this.parseCloseBracket()]);
    }
    else if (sys.ObjUtil.equals($_u79, 10)) {
      return sys.List.make(Node.type$, [this.parseLineBreak()]);
    }
    else if (sys.ObjUtil.equals($_u79, Scanner.END())) {
      return null;
    }
    ;
    if (sys.ObjUtil.coerce(this.#linkMarkers.get(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable())), sys.Bool.type$)) {
      let markerPos = this.scanner().pos();
      let nodes = this.parseLinkMarker();
      if (nodes != null) {
        return nodes;
      }
      ;
      this.scanner().setPos(markerPos);
    }
    ;
    if (!sys.ObjUtil.coerce(this.#specialChars.get(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable())), sys.Bool.type$)) {
      return sys.List.make(Node.type$, [this.parseText()]);
    }
    ;
    let inlineParsers = this.#inlineParsers.get(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()));
    if (inlineParsers != null) {
      let pos = this.scanner().pos();
      let node = inlineParsers.eachWhile((inlineParser) => {
        let parsedInline = inlineParser.tryParse(this$);
        if (parsedInline != null) {
          let node = parsedInline.node();
          this$.scanner().setPos(parsedInline.pos());
          if ((this$.#includeSourceSpans && node.sourceSpans().isEmpty())) {
            node.setSourceSpans(this$.scanner().source(pos, this$.scanner().pos()).sourceSpans());
          }
          ;
          return node;
        }
        else {
          this$.scanner().setPos(pos);
        }
        ;
        return null;
      });
      if (node != null) {
        return sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable(), [node]), sys.Type.find("markdown::Node[]?"));
      }
      ;
    }
    ;
    let processor = this.#delimProcessors.get(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()));
    if (processor != null) {
      let nodes = this.parseDelimiters(sys.ObjUtil.coerce(processor, DelimiterProcessor.type$), c);
      if (nodes != null) {
        return nodes;
      }
      ;
    }
    ;
    return sys.List.make(Node.type$, [this.parseText()]);
  }

  parseDelimiters(processor,delimChar) {
    let res = this.scanDelimiters(processor, delimChar);
    if (res == null) {
      return null;
    }
    ;
    let chars = res.chars();
    this.#lastDelim = Delimiter.make(chars, delimChar, res.canOpen(), res.canClose(), this.#lastDelim);
    if (this.#lastDelim.prev() != null) {
      this.#lastDelim.prev().next(this.#lastDelim);
    }
    ;
    return chars;
  }

  parseOpenBracket() {
    let start = this.scanner().pos();
    this.scanner().next();
    let contentPos = this.scanner().pos();
    let node = this.text(this.scanner().source(start, contentPos));
    this.addBracket(sys.ObjUtil.coerce(Bracket.link(node, start, contentPos, this.#lastBracket, this.#lastDelim), Bracket.type$));
    return node;
  }

  parseLinkMarker() {
    let markerPos = this.scanner().pos();
    this.scanner().next();
    let bracketPos = this.scanner().pos();
    if (this.scanner().nextCh(91)) {
      let contentPos = this.scanner().pos();
      let bangNode = this.text(this.scanner().source(markerPos, bracketPos));
      let bracketNode = this.text(this.scanner().source(bracketPos, contentPos));
      this.addBracket(sys.ObjUtil.coerce(Bracket.withMarker(bangNode, markerPos, bracketNode, bracketPos, contentPos, this.#lastBracket, this.#lastDelim), Bracket.type$));
      return sys.List.make(Text.type$, [bangNode, bracketNode]);
    }
    else {
      return null;
    }
    ;
  }

  parseCloseBracket() {
    let beforeClose = this.scanner().pos();
    this.scanner().next();
    let afterClose = this.scanner().pos();
    let opener = this.#lastBracket;
    if (opener == null) {
      return this.text(this.scanner().source(beforeClose, afterClose));
    }
    ;
    if (!opener.allowed()) {
      this.removeLastBracket();
      return this.text(this.scanner().source(beforeClose, afterClose));
    }
    ;
    let linkOrImage = this.parseLinkOrImage(sys.ObjUtil.coerce(opener, Bracket.type$), beforeClose);
    if (linkOrImage != null) {
      return sys.ObjUtil.coerce(linkOrImage, Node.type$);
    }
    ;
    this.scanner().setPos(afterClose);
    this.removeLastBracket();
    return this.text(this.scanner().source(beforeClose, afterClose));
  }

  parseLinkOrImage(opener,beforeClose) {
    const this$ = this;
    let linkInfo = this.parseLinkInfo(opener, beforeClose);
    if (linkInfo == null) {
      return null;
    }
    ;
    let processorStartPos = this.scanner().pos();
    return sys.ObjUtil.coerce(this.#linkProcessors.eachWhile((processor) => {
      let result = processor.process(sys.ObjUtil.coerce(linkInfo, LinkInfo.type$), sys.ObjUtil.coerce(this$.scanner(), Scanner.type$), this$.#cx);
      if (result == null) {
        this$.scanner().setPos(processorStartPos);
        return null;
      }
      ;
      let node = result.node();
      let pos = result.pos();
      if (result.wrap()) {
        this$.scanner().setPos(pos);
        return this$.wrapBracket(opener, node, result.includeMarker());
      }
      else {
        this$.scanner().setPos(pos);
        return this$.replaceBracket(opener, node, result.includeMarker());
      }
      ;
    }), Node.type$.toNullable());
  }

  parseLinkInfo(opener,beforeClose) {
    const this$ = this;
    let text = this.scanner().source(opener.contentPos(), beforeClose).content();
    let afterClose = this.scanner().pos();
    let destTitle = DefaultInlineParser.parseInlineDestinationTitle(sys.ObjUtil.coerce(this.scanner(), Scanner.type$));
    if (destTitle != null) {
      return MLinkInfo.make((it) => {
        it.marker(opener.markerNode());
        it.openingBracket(opener.bracketNode());
        it.__text(text);
        it.__destination(destTitle.destination());
        it.__title(destTitle.title());
        it.__afterTextBracket(afterClose);
        return;
      });
    }
    ;
    this.scanner().setPos(afterClose);
    let label = DefaultInlineParser.parseLinkLabel(sys.ObjUtil.coerce(this.scanner(), Scanner.type$));
    if (label == null) {
      this.scanner().setPos(afterClose);
    }
    ;
    let textIsRef = (label == null || sys.Str.isEmpty(label));
    if ((opener.bracketAfter() && textIsRef && opener.markerNode() == null)) {
      return null;
    }
    ;
    return MLinkInfo.make((it) => {
      it.marker(opener.markerNode());
      it.openingBracket(opener.bracketNode());
      it.__text(text);
      it.__label(label);
      it.__afterTextBracket(afterClose);
      return;
    });
  }

  wrapBracket(opener,wrapperNode,includeMarker) {
    let n = opener.bracketNode().next();
    while (n != null) {
      let next = n.next();
      wrapperNode.appendChild(sys.ObjUtil.coerce(n, Node.type$));
      (n = next);
    }
    ;
    if (this.#includeSourceSpans) {
      throw sys.Err.make("TODO: source spans");
    }
    ;
    this.processDelimiters(opener.prevDelim());
    this.mergeChildTextNodes(wrapperNode);
    if ((includeMarker && opener.markerNode() != null)) {
      opener.markerNode().unlink();
    }
    ;
    opener.bracketNode().unlink();
    this.removeLastBracket();
    if (opener.markerNode() == null) {
      let bracket = this.#lastBracket;
      while (bracket != null) {
        if (bracket.markerNode() == null) {
          bracket.allowed(false);
        }
        ;
        (bracket = bracket.prev());
      }
      ;
    }
    ;
    return wrapperNode;
  }

  replaceBracket(opener,node,includeMarker) {
    throw sys.Err.make("TODO");
  }

  addBracket(bracket) {
    if (this.#lastBracket != null) {
      this.#lastBracket.bracketAfter(true);
    }
    ;
    this.#lastBracket = bracket;
    return;
  }

  removeLastBracket() {
    this.#lastBracket = this.#lastBracket.prev();
    return;
  }

  static parseInlineDestinationTitle(scanner) {
    if (!scanner.nextCh(40)) {
      return null;
    }
    ;
    scanner.whitespace();
    let dest = DefaultInlineParser.parseLinkDestination(scanner);
    if (dest == null) {
      return null;
    }
    ;
    let title = null;
    let whitespace = scanner.whitespace();
    if (sys.ObjUtil.compareGE(whitespace, 1)) {
      (title = DefaultInlineParser.parseLinkTitle(scanner));
      scanner.whitespace();
    }
    ;
    if (!scanner.nextCh(41)) {
      return null;
    }
    ;
    return DestinationTitle.make(sys.ObjUtil.coerce(dest, sys.Str.type$), title);
  }

  static parseLinkDestination(scanner) {
    let delim = scanner.peek();
    let start = scanner.pos();
    if (!LinkScanner.scanLinkDestination(scanner)) {
      return null;
    }
    ;
    let dest = null;
    if (sys.ObjUtil.equals(delim, 60)) {
      let rawDest = scanner.source(start, scanner.pos()).content();
      (dest = sys.Str.getRange(rawDest, sys.Range.make(1, sys.Int.minus(sys.Str.size(rawDest), 1), true)));
    }
    else {
      (dest = scanner.source(start, scanner.pos()).content());
    }
    ;
    return Esc.unescapeStr(sys.ObjUtil.coerce(dest, sys.Str.type$));
  }

  static parseLinkTitle(scanner) {
    let start = scanner.pos();
    if (!LinkScanner.scanLinkTitle(scanner)) {
      return null;
    }
    ;
    let rawTitle = scanner.source(start, scanner.pos()).content();
    let title = sys.Str.getRange(rawTitle, sys.Range.make(1, sys.Int.minus(sys.Str.size(rawTitle), 1), true));
    return Esc.unescapeStr(title);
  }

  static parseLinkLabel(scanner) {
    if (!scanner.nextCh(91)) {
      return null;
    }
    ;
    let start = scanner.pos();
    if (!LinkScanner.scanLinkLabelContent(scanner)) {
      return null;
    }
    ;
    let end = scanner.pos();
    if (!scanner.nextCh(93)) {
      return null;
    }
    ;
    let content = scanner.source(start, end).content();
    if (sys.ObjUtil.compareGT(sys.Str.size(content), 999)) {
      return null;
    }
    ;
    return content;
  }

  parseLineBreak() {
    this.scanner().next();
    return ((this$) => { if (sys.ObjUtil.compareGE(this$.#trailingSpaces, 2)) return HardLineBreak.make(); return SoftLineBreak.make(); })(this);
  }

  parseText() {
    let start = this.scanner().pos();
    this.scanner().next();
    let c = null;
    while (true) {
      (c = sys.ObjUtil.coerce(this.scanner().peek(), sys.Int.type$.toNullable()));
      if ((sys.ObjUtil.equals(c, Scanner.END()) || sys.ObjUtil.coerce(this.#specialChars.get(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable())), sys.Bool.type$))) {
        break;
      }
      ;
      this.scanner().next();
    }
    ;
    let source = this.scanner().source(start, this.scanner().pos());
    let content = source.content();
    if (sys.ObjUtil.equals(c, 10)) {
      let end = sys.Int.plus(Chars.skipBackwards(32, content), 1);
      this.#trailingSpaces = sys.Int.minus(sys.Str.size(content), end);
      (content = sys.Str.getRange(content, sys.Range.make(0, end, true)));
    }
    else {
      if (sys.ObjUtil.equals(c, Scanner.END())) {
        let end = sys.Int.plus(Chars.skipSpaceTabBackwards(content, sys.Int.minus(sys.Str.size(content), 1), 0), 1);
        (content = sys.Str.getRange(content, sys.Range.make(0, end, true)));
      }
      ;
    }
    ;
    let text = Text.make(content);
    text.setSourceSpans(source.sourceSpans());
    return text;
  }

  scanDelimiters(processor,delimChar) {
    let before = this.scanner().peekPrevCodePoint();
    let start = this.scanner().pos();
    let delimCount = this.scanner().matchMultiple(delimChar);
    if (sys.ObjUtil.compareLT(delimCount, processor.minLen())) {
      this.scanner().setPos(start);
      return null;
    }
    ;
    let delims = sys.List.make(Text.type$);
    this.scanner().setPos(start);
    let posBefore = start;
    while (this.scanner().nextCh(delimChar)) {
      delims.add(this.text(this.scanner().source(posBefore, this.scanner().pos())));
      (posBefore = this.scanner().pos());
    }
    ;
    let after = this.scanner().peekCodePoint();
    let beforeIsPunctuation = (sys.ObjUtil.equals(before, Scanner.END()) || Chars.isPunctuation(before));
    let beforeIsWhitespace = (sys.ObjUtil.equals(before, Scanner.END()) || Chars.isWhitespace(before));
    let afterIsPunctuation = (sys.ObjUtil.equals(after, Scanner.END()) || Chars.isPunctuation(after));
    let afterIsWhiteSpace = (sys.ObjUtil.equals(after, Scanner.END()) || Chars.isWhitespace(after));
    let leftFlanking = (!afterIsWhiteSpace && (!afterIsPunctuation || beforeIsWhitespace || beforeIsPunctuation));
    let rightFlanking = (!beforeIsWhitespace && (!beforeIsPunctuation || afterIsWhiteSpace || afterIsPunctuation));
    let canOpen = false;
    let canClose = false;
    if (sys.ObjUtil.equals(delimChar, 95)) {
      (canOpen = (leftFlanking && (!rightFlanking || beforeIsPunctuation)));
      (canClose = (rightFlanking && (!leftFlanking || afterIsPunctuation)));
    }
    else {
      (canOpen = (leftFlanking && sys.ObjUtil.equals(delimChar, processor.openingChar())));
      (canClose = (rightFlanking && sys.ObjUtil.equals(delimChar, processor.closingChar())));
    }
    ;
    return DelimiterData.make(delims, canOpen, canClose);
  }

  processDelimiters(stackBottom) {
    let openersBottom = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("markdown::Delimiter?"));
    let closer = this.#lastDelim;
    while ((closer != null && sys.ObjUtil.compareNE(closer.prev(), stackBottom))) {
      (closer = closer.prev());
    }
    ;
    while (closer != null) {
      let delimChar = closer.delimChar();
      let processor = this.#delimProcessors.get(sys.ObjUtil.coerce(delimChar, sys.Obj.type$.toNullable()));
      if ((!closer.canClose() || processor == null)) {
        (closer = closer.next());
        continue;
      }
      ;
      let openingDelimChar = processor.openingChar();
      let usedDelims = 0;
      let openerFound = false;
      let potentialOpenerFound = false;
      let opener = closer.prev();
      while ((opener != null && sys.ObjUtil.compareNE(opener, stackBottom) && sys.ObjUtil.compareNE(opener, openersBottom.get(sys.ObjUtil.coerce(delimChar, sys.Obj.type$.toNullable()))))) {
        if ((opener.canOpen() && sys.ObjUtil.equals(opener.delimChar(), openingDelimChar))) {
          (potentialOpenerFound = true);
          (usedDelims = processor.process(sys.ObjUtil.coerce(opener, Delimiter.type$), sys.ObjUtil.coerce(closer, Delimiter.type$)));
          if (sys.ObjUtil.compareGT(usedDelims, 0)) {
            (openerFound = true);
            break;
          }
          ;
        }
        ;
        (opener = opener.prev());
      }
      ;
      if (!openerFound) {
        if (!potentialOpenerFound) {
          openersBottom.set(sys.ObjUtil.coerce(delimChar, sys.Obj.type$.toNullable()), closer.prev());
          if (!closer.canOpen()) {
            this.removeDelimiterKeepNode(sys.ObjUtil.coerce(closer, Delimiter.type$));
          }
          ;
        }
        ;
        (closer = closer.next());
        continue;
      }
      ;
      for (let i = 0; sys.ObjUtil.compareLT(i, usedDelims); i = sys.Int.increment(i)) {
        let delimiter = opener.chars().removeAt(sys.Int.minus(opener.chars().size(), 1));
        delimiter.unlink();
      }
      ;
      for (let i = 0; sys.ObjUtil.compareLT(i, usedDelims); i = sys.Int.increment(i)) {
        let delimiter = closer.chars().removeAt(0);
        delimiter.unlink();
      }
      ;
      this.removeDelimitersBetween(sys.ObjUtil.coerce(opener, Delimiter.type$), sys.ObjUtil.coerce(closer, Delimiter.type$));
      if (sys.ObjUtil.equals(opener.size(), 0)) {
        this.removeDelimiterAndNodes(sys.ObjUtil.coerce(opener, Delimiter.type$));
      }
      ;
      if (sys.ObjUtil.equals(closer.size(), 0)) {
        let next = closer.next();
        this.removeDelimiterAndNodes(sys.ObjUtil.coerce(closer, Delimiter.type$));
        (closer = next);
      }
      ;
    }
    ;
    while ((this.#lastDelim != null && sys.ObjUtil.compareNE(this.#lastDelim, stackBottom))) {
      this.removeDelimiterKeepNode(sys.ObjUtil.coerce(this.#lastDelim, Delimiter.type$));
    }
    ;
    return;
  }

  removeDelimitersBetween(opener,closer) {
    let delimiter = closer.prev();
    while ((delimiter != null && sys.ObjUtil.compareNE(delimiter, opener))) {
      let prev = delimiter.prev();
      this.removeDelimiterKeepNode(sys.ObjUtil.coerce(delimiter, Delimiter.type$));
      (delimiter = prev);
    }
    ;
    return;
  }

  removeDelimiterAndNodes(delim) {
    this.removeDelimiter(delim);
    return;
  }

  removeDelimiterKeepNode(delim) {
    this.removeDelimiter(delim);
    return;
  }

  removeDelimiter(delim) {
    if (delim.prev() != null) {
      delim.prev().next(delim.next());
    }
    ;
    if (delim.next() == null) {
      this.#lastDelim = delim.prev();
    }
    else {
      delim.next().prev(delim.prev());
    }
    ;
    return;
  }

  mergeChildTextNodes(node) {
    if (node.firstChild() == null) {
      return;
    }
    ;
    this.mergeTextNodesInclusive(sys.ObjUtil.coerce(node.firstChild(), Node.type$), sys.ObjUtil.coerce(node.lastChild(), Node.type$));
    return;
  }

  mergeTextNodesInclusive(fromNode,toNode) {
    let first = null;
    let last = null;
    let len = 0;
    let node = fromNode;
    while (node != null) {
      if (sys.ObjUtil.is(node, Text.type$)) {
        let text = sys.ObjUtil.coerce(node, Text.type$);
        if (first == null) {
          (first = text);
        }
        ;
        len = sys.Int.plus(len, sys.Str.size(text.literal()));
        (last = text);
      }
      else {
        this.mergeIfNeeded(first, last, len);
        (first = (last = null));
        (len = 0);
      }
      ;
      if (sys.ObjUtil.equals(node, toNode)) {
        break;
      }
      ;
      (node = node.next());
    }
    ;
    this.mergeIfNeeded(first, last, len);
    return;
  }

  mergeIfNeeded(first,last,textLen) {
    if ((first != null && last != null && sys.ObjUtil.compareNE(first, last))) {
      let sb = sys.StrBuf.make();
      sb.add(first.literal());
      let sourceSpans = null;
      if (this.#includeSourceSpans) {
        throw sys.Err.make("TODO:source spans");
      }
      ;
      let node = first.next();
      let stop = last.next();
      while (sys.ObjUtil.compareNE(node, stop)) {
        sb.add(sys.ObjUtil.coerce(node, Text.type$).literal());
        if (sourceSpans != null) {
          throw sys.Err.make("TODO:source spans");
        }
        ;
        let unlink = node;
        (node = node.next());
        unlink.unlink();
      }
      ;
      let literal = sb.toStr();
      first.literal(literal);
      if (sourceSpans != null) {
        throw sys.Err.make("TODO: source spans");
      }
      ;
    }
    ;
    return;
  }

}

class DestinationTitle extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DestinationTitle.type$; }

  #destination = null;

  destination() { return this.#destination; }

  __destination(it) { if (it === undefined) return this.#destination; else this.#destination = it; }

  #title = null;

  title() { return this.#title; }

  __title(it) { if (it === undefined) return this.#title; else this.#title = it; }

  static make(destination,title) {
    const $self = new DestinationTitle();
    DestinationTitle.make$($self,destination,title);
    return $self;
  }

  static make$($self,destination,title) {
    if (title === undefined) title = null;
    $self.#destination = destination;
    $self.#title = title;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("DestinationTitle(", this.#destination), ", "), this.#title), ")");
  }

}

class DelimiterData extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DelimiterData.type$; }

  #chars = null;

  chars() {
    return this.#chars;
  }

  #canOpen = false;

  canOpen() { return this.#canOpen; }

  __canOpen(it) { if (it === undefined) return this.#canOpen; else this.#canOpen = it; }

  #canClose = false;

  canClose() { return this.#canClose; }

  __canClose(it) { if (it === undefined) return this.#canClose; else this.#canClose = it; }

  static make(chars,canOpen,canClose) {
    const $self = new DelimiterData();
    DelimiterData.make$($self,chars,canOpen,canClose);
    return $self;
  }

  static make$($self,chars,canOpen,canClose) {
    $self.#chars = chars;
    $self.#canOpen = canOpen;
    $self.#canClose = canClose;
    return;
  }

}

class LinkProcessor {
  constructor() {
    const this$ = this;
  }

  typeof() { return LinkProcessor.type$; }

}

class CoreLinkProcessor extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CoreLinkProcessor.type$; }

  process(info,scanner,cx) {
    if (info.destination() != null) {
      return CoreLinkProcessor.doProcess(info, scanner, info.destination(), info.title());
    }
    ;
    let label = info.label();
    let ref = ((this$) => { if ((label != null && !sys.Str.isEmpty(label))) return label; return info.text(); })(this);
    let def = sys.ObjUtil.as(cx.def(LinkReferenceDefinition.type$, sys.ObjUtil.coerce(ref, sys.Str.type$)), LinkReferenceDefinition.type$);
    if (def != null) {
      return CoreLinkProcessor.doProcess(info, scanner, def.destination(), def.title());
    }
    ;
    return LinkResult.none();
  }

  static doProcess(info,scanner,dest,title) {
    const this$ = this;
    if ((info.marker() != null && sys.ObjUtil.equals(info.marker().literal(), "!"))) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.with(LinkResult.wrapTextIn(Image.make(sys.ObjUtil.coerce(dest, sys.Str.type$), title), scanner.pos()), (it) => {
        it.includeMarker(true);
        return;
      }), LinkResult.type$.toNullable()), LinkResult.type$);
    }
    ;
    return sys.ObjUtil.coerce(LinkResult.wrapTextIn(Link.make(sys.ObjUtil.coerce(dest, sys.Str.type$), title), scanner.pos()), LinkResult.type$);
  }

  static make() {
    const $self = new CoreLinkProcessor();
    CoreLinkProcessor.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class LinkResult extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#includeMarker = false;
    return;
  }

  typeof() { return LinkResult.type$; }

  #wrap = false;

  wrap() { return this.#wrap; }

  __wrap(it) { if (it === undefined) return this.#wrap; else this.#wrap = it; }

  #node = null;

  node() {
    return this.#node;
  }

  #pos = null;

  pos() { return this.#pos; }

  __pos(it) { if (it === undefined) return this.#pos; else this.#pos = it; }

  #includeMarker = false;

  includeMarker(it) {
    if (it === undefined) {
      return this.#includeMarker;
    }
    else {
      this.#includeMarker = it;
      return;
    }
  }

  static none() {
    return null;
  }

  static wrapTextIn(node,pos) {
    return LinkResult.priv_make(true, node, pos);
  }

  static replaceWith(node,pos) {
    return LinkResult.priv_make(false, node, pos);
  }

  static priv_make(wrap,node,pos) {
    const $self = new LinkResult();
    LinkResult.priv_make$($self,wrap,node,pos);
    return $self;
  }

  static priv_make$($self,wrap,node,pos) {
    ;
    $self.#wrap = wrap;
    $self.#node = node;
    $self.#pos = pos;
    return;
  }

  replace() {
    return !this.#wrap;
  }

}

class Renderer {
  constructor() {
    const this$ = this;
  }

  typeof() { return Renderer.type$; }

  render(node) {
    let sb = sys.StrBuf.make();
    this.renderTo(sb.out(), node);
    return sb.toStr();
  }

}

class NodeRendererMap extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NodeRendererMap.type$; }

  #renderers = null;

  // private field reflection only
  __renderers(it) { if (it === undefined) return this.#renderers; else this.#renderers = it; }

  static make() {
    const $self = new NodeRendererMap();
    NodeRendererMap.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    $self.#renderers = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Obj:sys::Obj?]")), sys.Type.find("[sys::Type:markdown::NodeRenderer]"));
    return;
  }

  add(renderer) {
    const this$ = this;
    renderer.nodeTypes().each((type) => {
      if (!type.fits(Node.type$)) {
        throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", type), " is not a "), Node.type$));
      }
      ;
      if (!this$.#renderers.containsKey(type)) {
        this$.#renderers.set(type, renderer);
      }
      ;
      return;
    });
    return;
  }

  render(node) {
    ((this$) => { let $_u82 = this$.#renderers.get(sys.ObjUtil.typeof(node)); if ($_u82 == null) return null; return this$.#renderers.get(sys.ObjUtil.typeof(node)).render(node); })(this);
    return;
  }

  beforeRoot(node) {
    const this$ = this;
    this.#renderers.vals().each((it) => {
      it.beforeRoot(node);
      return;
    });
    return;
  }

  afterRoot(node) {
    const this$ = this;
    this.#renderers.vals().each((it) => {
      it.afterRoot(node);
      return;
    });
    return;
  }

}

class CoreHtmlNodeRenderer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#nodeTypes = sys.ObjUtil.coerce(((this$) => { let $_u83 = sys.List.make(sys.Type.type$, [Document.type$, Heading.type$, Paragraph.type$, BlockQuote.type$, BulletList.type$, FencedCode.type$, HtmlBlock.type$, ThematicBreak.type$, IndentedCode.type$, Link.type$, ListItem.type$, OrderedList.type$, Image.type$, Emphasis.type$, StrongEmphasis.type$, Text.type$, Code.type$, HtmlInline.type$, SoftLineBreak.type$, HardLineBreak.type$]); if ($_u83 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Type.type$, [Document.type$, Heading.type$, Paragraph.type$, BlockQuote.type$, BulletList.type$, FencedCode.type$, HtmlBlock.type$, ThematicBreak.type$, IndentedCode.type$, Link.type$, ListItem.type$, OrderedList.type$, Image.type$, Emphasis.type$, StrongEmphasis.type$, Text.type$, Code.type$, HtmlInline.type$, SoftLineBreak.type$, HardLineBreak.type$])); })(this), sys.Type.find("sys::Type[]"));
    return;
  }

  typeof() { return CoreHtmlNodeRenderer.type$; }

  visitCustomNode() { return Visitor.prototype.visitCustomNode.apply(this, arguments); }

  visitLinkReferenceDefinition() { return Visitor.prototype.visitLinkReferenceDefinition.apply(this, arguments); }

  visitCustomBlock() { return Visitor.prototype.visitCustomBlock.apply(this, arguments); }

  afterRoot() { return NodeRenderer.prototype.afterRoot.apply(this, arguments); }

  beforeRoot() { return NodeRenderer.prototype.beforeRoot.apply(this, arguments); }

  #cx = null;

  cx() {
    return this.#cx;
  }

  #html = null;

  // private field reflection only
  __html(it) { if (it === undefined) return this.#html; else this.#html = it; }

  #nodeTypes = null;

  nodeTypes() { return this.#nodeTypes; }

  __nodeTypes(it) { if (it === undefined) return this.#nodeTypes; else this.#nodeTypes = it; }

  static make(cx) {
    const $self = new CoreHtmlNodeRenderer();
    CoreHtmlNodeRenderer.make$($self,cx);
    return $self;
  }

  static make$($self,cx) {
    ;
    $self.#cx = cx;
    $self.#html = cx.writer();
    return;
  }

  render(node) {
    node.walk(this);
    return;
  }

  visitDocument(doc) {
    this.visitChildren(doc);
    return;
  }

  visitHeading(heading) {
    let htag = sys.Str.plus("h", sys.ObjUtil.coerce(heading.level(), sys.Obj.type$.toNullable()));
    this.#html.line().tag(htag, this.attrs(heading, htag));
    this.visitChildren(heading);
    this.#html.tag(sys.Str.plus("/", htag)).line();
    return;
  }

  visitParagraph(p) {
    let omitP = (this.isInTightList(p) || (this.#cx.omitSingleParagraphP() && sys.ObjUtil.is(p.parent(), Document.type$) && p.prev() == null && p.next() == null));
    if (!omitP) {
      this.#html.line();
      this.#html.tag("p", this.attrs(p, "p"));
    }
    ;
    this.visitChildren(p);
    if (!omitP) {
      this.#html.tag("/p").line();
    }
    ;
    return;
  }

  visitBlockQuote(bq) {
    this.#html.line().tag("blockquote", this.attrs(bq, "blockquote")).line();
    this.visitChildren(bq);
    this.#html.line().tag("/blockquote").line();
    return;
  }

  visitBulletList(list) {
    this.renderListBlock(list, "ul", this.attrs(list, "ul"));
    return;
  }

  visitOrderedList(list) {
    let start = ((this$) => { let $_u84 = list.startNumber(); if ($_u84 != null) return $_u84; return sys.ObjUtil.coerce(1, sys.Int.type$.toNullable()); })(this);
    let attrs = this.newAttrs();
    if (sys.ObjUtil.compareNE(start, 1)) {
      attrs.set("start", sys.Str.plus("", sys.ObjUtil.coerce(start, sys.Obj.type$.toNullable())));
    }
    ;
    this.renderListBlock(list, "ol", this.attrs(list, "ol", attrs));
    return;
  }

  visitListItem(item) {
    this.#html.tag("li", this.attrs(item, "li"));
    this.visitChildren(item);
    this.#html.tag("/li");
    this.#html.line();
    return;
  }

  visitFencedCode(code) {
    let literal = code.literal();
    let info = code.info();
    let attrs = this.newAttrs();
    if ((info != null && !sys.Str.isEmpty(info))) {
      let sp = sys.Str.index(info, " ");
      let lang = null;
      if (sp == null) {
        (lang = info);
      }
      else {
        (lang = sys.Str.getRange(info, sys.Range.make(0, sys.ObjUtil.coerce(sp, sys.Int.type$), true)));
      }
      ;
      attrs.set("class", sys.Str.plus("language-", lang));
    }
    ;
    this.renderCodeBlock(sys.ObjUtil.coerce(literal, sys.Str.type$), code, attrs);
    return;
  }

  visitHtmlBlock(block) {
    this.#html.line();
    if (this.#cx.escapeHtml()) {
      this.#html.tag("p", this.attrs(block, "p"));
      this.#html.text(sys.ObjUtil.coerce(block.literal(), sys.Str.type$));
      this.#html.tag("/p");
    }
    else {
      this.#html.raw(sys.ObjUtil.coerce(block.literal(), sys.Str.type$));
    }
    ;
    this.#html.line();
    return;
  }

  visitThematicBreak(tb) {
    this.#html.line().tag("hr", this.attrs(tb, "hr"), true).line();
    return;
  }

  visitIndentedCode(code) {
    this.renderCodeBlock(sys.ObjUtil.coerce(code.literal(), sys.Str.type$), code, sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str]")));
    return;
  }

  visitLink(link) {
    if (link.isCode()) {
      this.#html.tag("code");
    }
    ;
    let attrs = this.newAttrs();
    let url = link.destination();
    if (this.#cx.sanitizeUrls()) {
      (url = this.#cx.urlSanitizer().sanitizeLink(url));
      attrs.set("rel", "nofollow");
    }
    ;
    (url = this.#cx.encodeUrl(url));
    attrs.set("href", url);
    if (link.title() != null) {
      attrs.set("title", sys.ObjUtil.coerce(link.title(), sys.Str.type$));
    }
    ;
    this.#html.tag("a", this.attrs(link, "a", attrs));
    this.visitChildren(link);
    this.#html.tag("/a");
    if (link.isCode()) {
      this.#html.tag("/code");
    }
    ;
    return;
  }

  visitImage(image) {
    let url = image.destination();
    let atv = AltTextVisitor.make();
    image.walk(atv);
    let altText = atv.altText();
    let attrs = this.newAttrs();
    if (this.#cx.sanitizeUrls()) {
      (url = this.#cx.urlSanitizer().sanitizeLink(url));
    }
    ;
    attrs.set("src", this.#cx.encodeUrl(url));
    attrs.set("alt", altText);
    if (image.title() != null) {
      attrs.set("title", sys.ObjUtil.coerce(image.title(), sys.Str.type$));
    }
    ;
    this.#html.tag("img", this.attrs(image, "img", attrs), true);
    return;
  }

  visitEmphasis(emph) {
    this.#html.tag("em", this.attrs(emph, "em"));
    this.visitChildren(emph);
    this.#html.tag("/em");
    return;
  }

  visitStrongEmphasis(strong) {
    this.#html.tag("strong", this.attrs(strong, "strong"));
    this.visitChildren(strong);
    this.#html.tag("/strong");
    return;
  }

  visitText(text) {
    this.#html.text(text.literal());
    return;
  }

  visitCode(code) {
    this.#html.tag("code", this.attrs(code, "code")).text(code.literal()).tag("/code");
    return;
  }

  visitHtmlInline(inline) {
    if (this.#cx.escapeHtml()) {
      this.#html.text(sys.ObjUtil.coerce(inline.literal(), sys.Str.type$));
    }
    else {
      this.#html.raw(sys.ObjUtil.coerce(inline.literal(), sys.Str.type$));
    }
    ;
    return;
  }

  visitSoftLineBreak(node) {
    this.#html.raw(this.#cx.softbreak());
    return;
  }

  visitHardLineBreak(node) {
    this.#html.tag("br", this.attrs(node, "br"), true);
    this.#html.line();
    return;
  }

  visitChildren(parent) {
    let node = parent.firstChild();
    while (node != null) {
      let next = node.next();
      this.#cx.render(sys.ObjUtil.coerce(node, Node.type$));
      (node = next);
    }
    ;
    return;
  }

  renderCodeBlock(literal,node,attrs) {
    this.#html.line().tag("pre", this.attrs(node, "pre")).tag("code", this.attrs(node, "code", attrs)).text(literal).tag("/code").tag("/pre").line();
    return;
  }

  renderListBlock(list,tagName,attrs) {
    this.#html.line().tag(tagName, attrs).line();
    this.visitChildren(list);
    this.#html.line().tag(sys.Str.plus("/", tagName)).line();
    return;
  }

  isInTightList(p) {
    let parent = p.parent();
    if (parent != null) {
      let gramps = parent.parent();
      if (sys.ObjUtil.is(gramps, ListBlock.type$)) {
        let isTight = sys.ObjUtil.coerce(gramps, ListBlock.type$).tight();
        return sys.ObjUtil.coerce(gramps, ListBlock.type$).tight();
      }
      ;
    }
    ;
    return false;
  }

  attrs(node,tagName,defAttrs) {
    if (defAttrs === undefined) defAttrs = this.newAttrs();
    return this.#cx.extendAttrs(node, tagName, defAttrs);
  }

  newAttrs() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"));
  }

}

class AltTextVisitor extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#sb = sys.StrBuf.make();
    return;
  }

  typeof() { return AltTextVisitor.type$; }

  visitBulletList() { return Visitor.prototype.visitBulletList.apply(this, arguments); }

  visitCustomNode() { return Visitor.prototype.visitCustomNode.apply(this, arguments); }

  visitFencedCode() { return Visitor.prototype.visitFencedCode.apply(this, arguments); }

  visitThematicBreak() { return Visitor.prototype.visitThematicBreak.apply(this, arguments); }

  visitChildren() { return Visitor.prototype.visitChildren.apply(this, arguments); }

  visitLinkReferenceDefinition() { return Visitor.prototype.visitLinkReferenceDefinition.apply(this, arguments); }

  visitHeading() { return Visitor.prototype.visitHeading.apply(this, arguments); }

  visitDocument() { return Visitor.prototype.visitDocument.apply(this, arguments); }

  visitStrongEmphasis() { return Visitor.prototype.visitStrongEmphasis.apply(this, arguments); }

  visitListItem() { return Visitor.prototype.visitListItem.apply(this, arguments); }

  visitOrderedList() { return Visitor.prototype.visitOrderedList.apply(this, arguments); }

  visitCode() { return Visitor.prototype.visitCode.apply(this, arguments); }

  visitHtmlBlock() { return Visitor.prototype.visitHtmlBlock.apply(this, arguments); }

  visitParagraph() { return Visitor.prototype.visitParagraph.apply(this, arguments); }

  visitCustomBlock() { return Visitor.prototype.visitCustomBlock.apply(this, arguments); }

  visitLink() { return Visitor.prototype.visitLink.apply(this, arguments); }

  visitBlockQuote() { return Visitor.prototype.visitBlockQuote.apply(this, arguments); }

  visitIndentedCode() { return Visitor.prototype.visitIndentedCode.apply(this, arguments); }

  visitEmphasis() { return Visitor.prototype.visitEmphasis.apply(this, arguments); }

  visitImage() { return Visitor.prototype.visitImage.apply(this, arguments); }

  visitHtmlInline() { return Visitor.prototype.visitHtmlInline.apply(this, arguments); }

  #sb = null;

  // private field reflection only
  __sb(it) { if (it === undefined) return this.#sb; else this.#sb = it; }

  altText() {
    return this.#sb.toStr();
  }

  visitText(text) {
    this.#sb.add(text.literal());
    return;
  }

  visitSoftLineBreak(node) {
    this.#sb.addChar(10);
    return;
  }

  visitHardLineBreak(node) {
    this.#sb.addChar(10);
    return;
  }

  static make() {
    const $self = new AltTextVisitor();
    AltTextVisitor.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class UrlSanitizer {
  constructor() {
    const this$ = this;
  }

  typeof() { return UrlSanitizer.type$; }

  sanitizeImage(url) {
    return this.sanitizeLink(url);
  }

}

class DefaultUrlSanitizer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DefaultUrlSanitizer.type$; }

  sanitizeImage() { return UrlSanitizer.prototype.sanitizeImage.apply(this, arguments); }

  #protocols = null;

  protocols() { return this.#protocols; }

  __protocols(it) { if (it === undefined) return this.#protocols; else this.#protocols = it; }

  static make_default() {
    const $self = new DefaultUrlSanitizer();
    DefaultUrlSanitizer.make_default$($self);
    return $self;
  }

  static make_default$($self) {
    DefaultUrlSanitizer.make$($self, sys.List.make(sys.Str.type$, ["http", "https", "mailto", "data"]));
    return;
  }

  static make(protocols) {
    const $self = new DefaultUrlSanitizer();
    DefaultUrlSanitizer.make$($self,protocols);
    return $self;
  }

  static make$($self,protocols) {
    $self.#protocols = sys.ObjUtil.coerce(((this$) => { let $_u85 = protocols; if ($_u85 == null) return null; return sys.ObjUtil.toImmutable(protocols); })($self), sys.Type.find("sys::Str[]"));
    return;
  }

  sanitizeLink(url) {
    let uri = sys.Str.toUri(url);
    if (uri.scheme() == null) {
      return url;
    }
    ;
    return ((this$) => { if (this$.#protocols.contains(sys.ObjUtil.coerce(uri.scheme(), sys.Str.type$))) return url; return ""; })(this);
  }

}

class HtmlContext extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#nodeRendererMap = NodeRendererMap.make();
    this.#attrProviders = sys.List.make(AttrProvider.type$);
    return;
  }

  typeof() { return HtmlContext.type$; }

  #renderer = null;

  // private field reflection only
  __renderer(it) { if (it === undefined) return this.#renderer; else this.#renderer = it; }

  #nodeRendererMap = null;

  // private field reflection only
  __nodeRendererMap(it) { if (it === undefined) return this.#nodeRendererMap; else this.#nodeRendererMap = it; }

  #attrProviders = null;

  // private field reflection only
  __attrProviders(it) { if (it === undefined) return this.#attrProviders; else this.#attrProviders = it; }

  #writer = null;

  writer() {
    return this.#writer;
  }

  static make(renderer,writer) {
    const $self = new HtmlContext();
    HtmlContext.make$($self,renderer,writer);
    return $self;
  }

  static make$($self,renderer,writer) {
    const this$ = $self;
    ;
    $self.#renderer = renderer;
    $self.#writer = writer;
    renderer.attrProviderFactories().each((f) => {
      this$.#attrProviders.add(sys.Func.call(f, this$));
      return;
    });
    renderer.nodeRendererFactories().each((f) => {
      this$.#nodeRendererMap.add(sys.Func.call(f, this$));
      return;
    });
    return;
  }

  escapeHtml() {
    return this.#renderer.escapeHtml();
  }

  sanitizeUrls() {
    return this.#renderer.sanitizeUrls();
  }

  omitSingleParagraphP() {
    return this.#renderer.omitSingleParagraphP();
  }

  percentEncodeUrls() {
    return this.#renderer.percentEncodeUrls();
  }

  softbreak() {
    return this.#renderer.softbreak();
  }

  encodeUrl(url) {
    return ((this$) => { if (this$.percentEncodeUrls()) return Esc.percentEncodeUrl(url); return url; })(this);
  }

  urlSanitizer() {
    return this.#renderer.urlSanitizer();
  }

  extendAttrs(node,tagName,attrs) {
    if (attrs === undefined) attrs = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str?]"));
    const this$ = this;
    (attrs = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str?]")).addAll(attrs));
    this.#attrProviders.each((provider) => {
      provider.setAttrs(node, tagName, attrs);
      return;
    });
    return attrs;
  }

  render(node) {
    this.#nodeRendererMap.render(node);
    return;
  }

  beforeRoot(node) {
    this.#nodeRendererMap.beforeRoot(node);
    return;
  }

  afterRoot(node) {
    this.#nodeRendererMap.afterRoot(node);
    return;
  }

}

class HtmlRenderer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#urlSanitizer = DefaultUrlSanitizer.make_default();
    return;
  }

  typeof() { return HtmlRenderer.type$; }

  render() { return Renderer.prototype.render.apply(this, arguments); }

  #softbreak = null;

  softbreak() { return this.#softbreak; }

  __softbreak(it) { if (it === undefined) return this.#softbreak; else this.#softbreak = it; }

  #escapeHtml = false;

  escapeHtml() { return this.#escapeHtml; }

  __escapeHtml(it) { if (it === undefined) return this.#escapeHtml; else this.#escapeHtml = it; }

  #percentEncodeUrls = false;

  percentEncodeUrls() { return this.#percentEncodeUrls; }

  __percentEncodeUrls(it) { if (it === undefined) return this.#percentEncodeUrls; else this.#percentEncodeUrls = it; }

  #omitSingleParagraphP = false;

  omitSingleParagraphP() { return this.#omitSingleParagraphP; }

  __omitSingleParagraphP(it) { if (it === undefined) return this.#omitSingleParagraphP; else this.#omitSingleParagraphP = it; }

  #sanitizeUrls = false;

  sanitizeUrls() { return this.#sanitizeUrls; }

  __sanitizeUrls(it) { if (it === undefined) return this.#sanitizeUrls; else this.#sanitizeUrls = it; }

  #nodeRendererFactories = null;

  nodeRendererFactories() { return this.#nodeRendererFactories; }

  __nodeRendererFactories(it) { if (it === undefined) return this.#nodeRendererFactories; else this.#nodeRendererFactories = it; }

  #attrProviderFactories = null;

  attrProviderFactories() { return this.#attrProviderFactories; }

  __attrProviderFactories(it) { if (it === undefined) return this.#attrProviderFactories; else this.#attrProviderFactories = it; }

  #urlSanitizer = null;

  urlSanitizer() { return this.#urlSanitizer; }

  __urlSanitizer(it) { if (it === undefined) return this.#urlSanitizer; else this.#urlSanitizer = it; }

  static builder() {
    return HtmlRendererBuilder.make();
  }

  static make() {
    return HtmlRenderer.builder().build();
  }

  static makeBuilder(builder) {
    const $self = new HtmlRenderer();
    HtmlRenderer.makeBuilder$($self,builder);
    return $self;
  }

  static makeBuilder$($self,builder) {
    const this$ = $self;
    ;
    $self.#softbreak = builder.softbreak();
    $self.#escapeHtml = builder.escapeHtml();
    $self.#percentEncodeUrls = builder.percentEncodeUrls();
    $self.#omitSingleParagraphP = builder.omitSingleParagraphP();
    $self.#sanitizeUrls = builder.sanitizeUrls();
    $self.#attrProviderFactories = sys.ObjUtil.coerce(((this$) => { let $_u88 = builder.attrProviderFactories(); if ($_u88 == null) return null; return sys.ObjUtil.toImmutable(builder.attrProviderFactories()); })($self), sys.Type.find("|markdown::HtmlContext->markdown::AttrProvider|[]"));
    let factories = builder.nodeRendererFactories().dup();
    factories.add((cx) => {
      return CoreHtmlNodeRenderer.make(cx);
    });
    $self.#nodeRendererFactories = sys.ObjUtil.coerce(((this$) => { let $_u89 = factories; if ($_u89 == null) return null; return sys.ObjUtil.toImmutable(factories); })($self), sys.Type.find("|markdown::HtmlContext->markdown::NodeRenderer|[]"));
    return;
  }

  renderTo(out,node) {
    let cx = HtmlContext.make(this, HtmlWriter.make(out));
    cx.beforeRoot(node);
    cx.render(node);
    cx.afterRoot(node);
    return;
  }

}

class HtmlRendererBuilder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#nodeRendererFactories = sys.List.make(sys.Type.find("|markdown::HtmlContext->markdown::NodeRenderer|"));
    this.#attrProviderFactories = sys.List.make(sys.Type.find("|markdown::HtmlContext->markdown::AttrProvider|"));
    this.#softbreak = "\n";
    this.#escapeHtml = false;
    this.#percentEncodeUrls = false;
    this.#omitSingleParagraphP = false;
    this.#sanitizeUrls = false;
    return;
  }

  typeof() { return HtmlRendererBuilder.type$; }

  #nodeRendererFactories = null;

  nodeRendererFactories(it) {
    if (it === undefined) {
      return this.#nodeRendererFactories;
    }
    else {
      this.#nodeRendererFactories = it;
      return;
    }
  }

  #attrProviderFactories = null;

  attrProviderFactories(it) {
    if (it === undefined) {
      return this.#attrProviderFactories;
    }
    else {
      this.#attrProviderFactories = it;
      return;
    }
  }

  #softbreak = null;

  softbreak(it) {
    if (it === undefined) {
      return this.#softbreak;
    }
    else {
      this.#softbreak = it;
      return;
    }
  }

  #escapeHtml = false;

  escapeHtml(it) {
    if (it === undefined) {
      return this.#escapeHtml;
    }
    else {
      this.#escapeHtml = it;
      return;
    }
  }

  #percentEncodeUrls = false;

  percentEncodeUrls(it) {
    if (it === undefined) {
      return this.#percentEncodeUrls;
    }
    else {
      this.#percentEncodeUrls = it;
      return;
    }
  }

  #omitSingleParagraphP = false;

  omitSingleParagraphP(it) {
    if (it === undefined) {
      return this.#omitSingleParagraphP;
    }
    else {
      this.#omitSingleParagraphP = it;
      return;
    }
  }

  #sanitizeUrls = false;

  sanitizeUrls(it) {
    if (it === undefined) {
      return this.#sanitizeUrls;
    }
    else {
      this.#sanitizeUrls = it;
      return;
    }
  }

  static make() {
    const $self = new HtmlRendererBuilder();
    HtmlRendererBuilder.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  build() {
    return HtmlRenderer.makeBuilder(this);
  }

  withSoftBreak(s) {
    this.#softbreak = s;
    return this;
  }

  withEscapeHtml(val) {
    if (val === undefined) val = true;
    this.#escapeHtml = val;
    return this;
  }

  withPercentEncodeUrls(val) {
    if (val === undefined) val = true;
    this.#percentEncodeUrls = val;
    return this;
  }

  withOmitSingleParagraphP(val) {
    if (val === undefined) val = true;
    this.#omitSingleParagraphP = val;
    return this;
  }

  withSanitizeUrls(val) {
    if (val === undefined) val = true;
    this.#sanitizeUrls = val;
    return this;
  }

  nodeRendererFactory(factory) {
    this.#nodeRendererFactories.add(factory);
    return this;
  }

  attrProviderFactory(factory) {
    this.#attrProviderFactories.add(factory);
    return this;
  }

  extensions(exts) {
    const this$ = this;
    exts.each((ext) => {
      ext.extendHtml(this$);
      return;
    });
    return this;
  }

}

class HtmlWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#lastChar = 0;
    return;
  }

  typeof() { return HtmlWriter.type$; }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  #lastChar = 0;

  // private field reflection only
  __lastChar(it) { if (it === undefined) return this.#lastChar; else this.#lastChar = it; }

  static make(out) {
    const $self = new HtmlWriter();
    HtmlWriter.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    ;
    $self.#out = out;
    return;
  }

  line() {
    if ((sys.ObjUtil.compareNE(this.#lastChar, 0) && sys.ObjUtil.compareNE(this.#lastChar, 10))) {
      this.w("\n");
    }
    ;
    return this;
  }

  raw(s) {
    return this.w(s);
  }

  text(text) {
    return this.w(Esc.escapeHtml(text));
  }

  tag(name,attrs,empty) {
    if (attrs === undefined) attrs = null;
    if (empty === undefined) empty = false;
    const this$ = this;
    this.w("<");
    this.w(name);
    if ((attrs != null && !attrs.isEmpty())) {
      attrs.each((v,k) => {
        this$.w(" ");
        this$.w(Esc.escapeHtml(k));
        if (v != null) {
          this$.w("=\"");
          this$.w(Esc.escapeHtml(sys.ObjUtil.coerce(v, sys.Str.type$)));
          this$.w("\"");
        }
        ;
        return;
      });
    }
    ;
    if (empty) {
      this.w(" /");
    }
    ;
    this.w(">");
    return this;
  }

  w(s) {
    this.#out.writeChars(s);
    if (!sys.Str.isEmpty(s)) {
      this.#lastChar = sys.Str.get(s, -1);
    }
    ;
    return this;
  }

}

class MarkdownRenderer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MarkdownRenderer.type$; }

  render() { return Renderer.prototype.render.apply(this, arguments); }

  #nodeRendererFactories = null;

  nodeRendererFactories() { return this.#nodeRendererFactories; }

  __nodeRendererFactories(it) { if (it === undefined) return this.#nodeRendererFactories; else this.#nodeRendererFactories = it; }

  #specialChars = null;

  specialChars() { return this.#specialChars; }

  __specialChars(it) { if (it === undefined) return this.#specialChars; else this.#specialChars = it; }

  static builder() {
    return MarkdownRendererBuilder.make();
  }

  static make() {
    return MarkdownRenderer.builder().build();
  }

  static makeBuilder(builder) {
    const $self = new MarkdownRenderer();
    MarkdownRenderer.makeBuilder$($self,builder);
    return $self;
  }

  static makeBuilder$($self,builder) {
    const this$ = $self;
    $self.#specialChars = sys.ObjUtil.coerce(((this$) => { let $_u90 = builder.specialChars(); if ($_u90 == null) return null; return sys.ObjUtil.toImmutable(builder.specialChars()); })($self), sys.Type.find("sys::Int[]"));
    let factories = builder.nodeRendererFactories().dup();
    factories.add((cx) => {
      return CoreMarkdownNodeRenderer.make(cx);
    });
    $self.#nodeRendererFactories = sys.ObjUtil.coerce(((this$) => { let $_u91 = factories; if ($_u91 == null) return null; return sys.ObjUtil.toImmutable(factories); })($self), sys.Type.find("|markdown::MarkdownContext->markdown::NodeRenderer|[]"));
    return;
  }

  renderTo(out,node) {
    let cx = MarkdownContext.make(this, MarkdownWriter.make(out));
    cx.beforeRoot(node);
    cx.render(node);
    cx.afterRoot(node);
    return;
  }

}

class MarkdownRendererBuilder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#nodeRendererFactories = sys.List.make(sys.Type.find("|markdown::MarkdownContext->markdown::NodeRenderer|"));
    this.#nodePostProcessors = sys.List.make(sys.Type.find("|markdown::MarkdownContext,markdown::Node->sys::Void|"));
    this.#specialChars = sys.List.make(sys.Int.type$);
    return;
  }

  typeof() { return MarkdownRendererBuilder.type$; }

  #nodeRendererFactories = null;

  nodeRendererFactories(it) {
    if (it === undefined) {
      return this.#nodeRendererFactories;
    }
    else {
      this.#nodeRendererFactories = it;
      return;
    }
  }

  #nodePostProcessors = null;

  nodePostProcessors(it) {
    if (it === undefined) {
      return this.#nodePostProcessors;
    }
    else {
      this.#nodePostProcessors = it;
      return;
    }
  }

  #specialChars = null;

  specialChars(it) {
    if (it === undefined) {
      return this.#specialChars;
    }
    else {
      this.#specialChars = it;
      return;
    }
  }

  static make() {
    const $self = new MarkdownRendererBuilder();
    MarkdownRendererBuilder.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  build() {
    return MarkdownRenderer.makeBuilder(this);
  }

  nodeRendererFactory(factory) {
    this.#nodeRendererFactories.add(factory);
    return this;
  }

  withSpecialChars(special) {
    this.#specialChars.addAll(special);
    return this;
  }

  extensions(exts) {
    const this$ = this;
    exts.each((ext) => {
      ext.extendMarkdown(this$);
      return;
    });
    return this;
  }

}

class MarkdownContext extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#nodeRendererMap = NodeRendererMap.make();
    return;
  }

  typeof() { return MarkdownContext.type$; }

  #renderer = null;

  // private field reflection only
  __renderer(it) { if (it === undefined) return this.#renderer; else this.#renderer = it; }

  #nodeRendererMap = null;

  // private field reflection only
  __nodeRendererMap(it) { if (it === undefined) return this.#nodeRendererMap; else this.#nodeRendererMap = it; }

  #writer = null;

  writer() {
    return this.#writer;
  }

  static make(renderer,writer) {
    const $self = new MarkdownContext();
    MarkdownContext.make$($self,renderer,writer);
    return $self;
  }

  static make$($self,renderer,writer) {
    const this$ = $self;
    ;
    $self.#renderer = renderer;
    $self.#writer = writer;
    renderer.nodeRendererFactories().each((f) => {
      this$.#nodeRendererMap.add(sys.Func.call(f, this$));
      return;
    });
    return;
  }

  specialChars() {
    return this.#renderer.specialChars();
  }

  render(node) {
    this.#nodeRendererMap.render(node);
    return;
  }

  beforeRoot(node) {
    this.#nodeRendererMap.beforeRoot(node);
    return;
  }

  afterRoot(node) {
    this.#nodeRendererMap.afterRoot(node);
    return;
  }

}

class CoreMarkdownNodeRenderer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#nodeTypes = sys.ObjUtil.coerce(((this$) => { let $_u92 = sys.List.make(sys.Type.type$, [Document.type$, Heading.type$, Paragraph.type$, BlockQuote.type$, BulletList.type$, FencedCode.type$, HtmlBlock.type$, ThematicBreak.type$, IndentedCode.type$, Link.type$, ListItem.type$, OrderedList.type$, Image.type$, Emphasis.type$, StrongEmphasis.type$, Text.type$, Code.type$, HtmlInline.type$, SoftLineBreak.type$, HardLineBreak.type$]); if ($_u92 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Type.type$, [Document.type$, Heading.type$, Paragraph.type$, BlockQuote.type$, BulletList.type$, FencedCode.type$, HtmlBlock.type$, ThematicBreak.type$, IndentedCode.type$, Link.type$, ListItem.type$, OrderedList.type$, Image.type$, Emphasis.type$, StrongEmphasis.type$, Text.type$, Code.type$, HtmlInline.type$, SoftLineBreak.type$, HardLineBreak.type$])); })(this), sys.Type.find("sys::Type[]"));
    return;
  }

  typeof() { return CoreMarkdownNodeRenderer.type$; }

  visitCustomNode() { return Visitor.prototype.visitCustomNode.apply(this, arguments); }

  visitLinkReferenceDefinition() { return Visitor.prototype.visitLinkReferenceDefinition.apply(this, arguments); }

  visitCustomBlock() { return Visitor.prototype.visitCustomBlock.apply(this, arguments); }

  afterRoot() { return NodeRenderer.prototype.afterRoot.apply(this, arguments); }

  beforeRoot() { return NodeRenderer.prototype.beforeRoot.apply(this, arguments); }

  static #orderedListMarkerPattern = undefined;

  static orderedListMarkerPattern() {
    if (CoreMarkdownNodeRenderer.#orderedListMarkerPattern === undefined) {
      CoreMarkdownNodeRenderer.static$init();
      if (CoreMarkdownNodeRenderer.#orderedListMarkerPattern === undefined) CoreMarkdownNodeRenderer.#orderedListMarkerPattern = null;
    }
    return CoreMarkdownNodeRenderer.#orderedListMarkerPattern;
  }

  #cx = null;

  cx() {
    return this.#cx;
  }

  #writer = null;

  // private field reflection only
  __writer(it) { if (it === undefined) return this.#writer; else this.#writer = it; }

  #listHolder = null;

  // private field reflection only
  __listHolder(it) { if (it === undefined) return this.#listHolder; else this.#listHolder = it; }

  #textEsc = null;

  // private field reflection only
  __textEsc(it) { if (it === undefined) return this.#textEsc; else this.#textEsc = it; }

  #textEscInHeading = null;

  // private field reflection only
  __textEscInHeading(it) { if (it === undefined) return this.#textEscInHeading; else this.#textEscInHeading = it; }

  static #linkDestNeedsAngleBrackets = undefined;

  static linkDestNeedsAngleBrackets() {
    if (CoreMarkdownNodeRenderer.#linkDestNeedsAngleBrackets === undefined) {
      CoreMarkdownNodeRenderer.static$init();
      if (CoreMarkdownNodeRenderer.#linkDestNeedsAngleBrackets === undefined) CoreMarkdownNodeRenderer.#linkDestNeedsAngleBrackets = null;
    }
    return CoreMarkdownNodeRenderer.#linkDestNeedsAngleBrackets;
  }

  static #linkDestEscInAngleBrackets = undefined;

  static linkDestEscInAngleBrackets() {
    if (CoreMarkdownNodeRenderer.#linkDestEscInAngleBrackets === undefined) {
      CoreMarkdownNodeRenderer.static$init();
      if (CoreMarkdownNodeRenderer.#linkDestEscInAngleBrackets === undefined) CoreMarkdownNodeRenderer.#linkDestEscInAngleBrackets = null;
    }
    return CoreMarkdownNodeRenderer.#linkDestEscInAngleBrackets;
  }

  static #linkTitleEscInQuotes = undefined;

  static linkTitleEscInQuotes() {
    if (CoreMarkdownNodeRenderer.#linkTitleEscInQuotes === undefined) {
      CoreMarkdownNodeRenderer.static$init();
      if (CoreMarkdownNodeRenderer.#linkTitleEscInQuotes === undefined) CoreMarkdownNodeRenderer.#linkTitleEscInQuotes = null;
    }
    return CoreMarkdownNodeRenderer.#linkTitleEscInQuotes;
  }

  #nodeTypes = null;

  nodeTypes() { return this.#nodeTypes; }

  __nodeTypes(it) { if (it === undefined) return this.#nodeTypes; else this.#nodeTypes = it; }

  static make(cx) {
    const $self = new CoreMarkdownNodeRenderer();
    CoreMarkdownNodeRenderer.make$($self,cx);
    return $self;
  }

  static make$($self,cx) {
    const this$ = $self;
    ;
    $self.#cx = cx;
    $self.#writer = cx.writer();
    $self.#textEsc = (c) => {
      if (sys.Str.containsChar("[]<>`*_&\n\\", c)) {
        return true;
      }
      ;
      if (cx.specialChars().contains(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()))) {
        return true;
      }
      ;
      return false;
    };
    $self.#textEscInHeading = (c) => {
      return (sys.Func.call(this$.#textEsc, sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable())) || sys.ObjUtil.equals(c, 35));
    };
    return;
  }

  render(node) {
    node.walk(this);
    return;
  }

  visitDocument(doc) {
    this.visitChildren(doc);
    this.#writer.line();
    return;
  }

  visitThematicBreak(tb) {
    let literal = tb.literal();
    if (literal == null) {
      (literal = "___");
    }
    ;
    this.#writer.raw(sys.ObjUtil.coerce(literal, sys.Obj.type$));
    this.#writer.block();
    return;
  }

  visitHeading(heading) {
    const this$ = this;
    if (sys.ObjUtil.compareLE(heading.level(), 2)) {
      let lineBreakVisitor = LineBreakVisitor.make();
      heading.walk(lineBreakVisitor);
      let isMultiLine = lineBreakVisitor.hasLineBreak();
      if (isMultiLine) {
        this.visitChildren(heading);
        this.#writer.line();
        if (sys.ObjUtil.equals(heading.level(), 1)) {
          this.#writer.raw("===");
        }
        else {
          this.#writer.raw("---");
        }
        ;
        this.#writer.block();
        return;
      }
      ;
    }
    ;
    sys.Int.times(heading.level(), (it) => {
      this$.#writer.raw(sys.ObjUtil.coerce(35, sys.Obj.type$));
      return;
    });
    this.#writer.raw(sys.ObjUtil.coerce(32, sys.Obj.type$));
    this.visitChildren(heading);
    this.#writer.block();
    return;
  }

  visitBlockQuote(quote) {
    this.#writer.writePrefix("> ");
    this.#writer.pushPrefix("> ");
    this.visitChildren(quote);
    this.#writer.popPrefix();
    this.#writer.block();
    return;
  }

  visitBulletList(list) {
    this.#writer.pushTight(list.tight());
    this.#listHolder = BulletListHolder.make(this.#listHolder, list);
    this.visitChildren(list);
    this.#listHolder = this.#listHolder.parent();
    this.#writer.popTight();
    this.#writer.block();
    return;
  }

  visitOrderedList(list) {
    this.#writer.pushTight(list.tight());
    this.#listHolder = OrderedListHolder.make(this.#listHolder, list);
    this.visitChildren(list);
    this.#listHolder = this.#listHolder.parent();
    this.#writer.popTight();
    this.#writer.block();
    return;
  }

  visitListItem(item) {
    let markerIndent = ((this$) => { let $_u93 = item.markerIndent(); if ($_u93 != null) return $_u93; return sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()); })(this);
    let marker = null;
    if (sys.ObjUtil.is(this.#listHolder, BulletListHolder.type$)) {
      (marker = sys.Str.plus(sys.Str.mult(" ", sys.ObjUtil.coerce(markerIndent, sys.Int.type$)), sys.ObjUtil.coerce(this.#listHolder, BulletListHolder.type$).marker()));
    }
    else {
      if (sys.ObjUtil.is(this.#listHolder, OrderedListHolder.type$)) {
        let list = sys.ObjUtil.coerce(this.#listHolder, OrderedListHolder.type$);
        (marker = sys.Str.plus(sys.Str.mult(" ", sys.ObjUtil.coerce(markerIndent, sys.Int.type$)), sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(list.number(), sys.Obj.type$.toNullable())), ""), list.delim())));
        ((this$) => { let $_u94 = list.number();list.number(sys.Int.increment(list.number())); return $_u94; })(this);
      }
      else {
        throw sys.ArgErr.make(sys.Str.plus("listHolder is ", this.#listHolder));
      }
      ;
    }
    ;
    let contentIndent = item.contentIndent();
    let spaces = ((this$) => { if (contentIndent == null) return " "; return sys.Str.mult(" ", sys.Int.minus(sys.ObjUtil.coerce(contentIndent, sys.Int.type$), sys.Str.size(marker))); })(this);
    this.#writer.writePrefix(sys.ObjUtil.coerce(marker, sys.Str.type$));
    this.#writer.writePrefix(spaces);
    this.#writer.pushPrefix(sys.Str.mult(" ", sys.Int.plus(sys.Str.size(marker), sys.Str.size(spaces))));
    if (item.firstChild() == null) {
      this.#writer.block();
    }
    else {
      this.visitChildren(item);
    }
    ;
    this.#writer.popPrefix();
    return;
  }

  visitFencedCode(code) {
    const this$ = this;
    let literal = code.literal();
    let fenceChar = ((this$) => { let $_u96 = code.fenceChar(); if ($_u96 != null) return $_u96; return "`"; })(this);
    let openingFenceLen = 0;
    if (code.openingFenceLen() != null) {
      (openingFenceLen = sys.ObjUtil.coerce(code.openingFenceLen(), sys.Int.type$));
    }
    else {
      let fenceCharsInLiteral = CoreMarkdownNodeRenderer.findMaxRunLen(sys.ObjUtil.coerce(fenceChar, sys.Str.type$), sys.ObjUtil.coerce(literal, sys.Str.type$));
      (openingFenceLen = sys.Int.max(3, sys.Int.plus(fenceCharsInLiteral, 1)));
    }
    ;
    let closingFenceLen = ((this$) => { let $_u97 = code.closingFenceLen(); if ($_u97 != null) return $_u97; return sys.ObjUtil.coerce(openingFenceLen, sys.Int.type$.toNullable()); })(this);
    let openingFence = sys.Str.mult(fenceChar, openingFenceLen);
    let closingFence = sys.Str.mult(fenceChar, sys.ObjUtil.coerce(closingFenceLen, sys.Int.type$));
    let indent = code.fenceIndent();
    if (sys.ObjUtil.compareGT(indent, 0)) {
      let indentPrefix = sys.Str.mult(" ", indent);
      this.#writer.writePrefix(indentPrefix);
      this.#writer.pushPrefix(indentPrefix);
    }
    ;
    this.#writer.raw(openingFence);
    if (code.info() != null) {
      this.#writer.raw(sys.ObjUtil.coerce(code.info(), sys.Obj.type$));
    }
    ;
    this.#writer.line();
    if (!sys.Str.isEmpty(literal)) {
      CoreMarkdownNodeRenderer.getLines(sys.ObjUtil.coerce(literal, sys.Str.type$)).each((line) => {
        this$.#writer.raw(line);
        this$.#writer.line();
        return;
      });
    }
    ;
    this.#writer.raw(closingFence);
    if (sys.ObjUtil.compareGT(indent, 0)) {
      this.#writer.popPrefix();
    }
    ;
    this.#writer.block();
    return;
  }

  visitIndentedCode(code) {
    const this$ = this;
    let literal = code.literal();
    this.#writer.writePrefix("    ");
    this.#writer.pushPrefix("    ");
    let lines = CoreMarkdownNodeRenderer.getLines(sys.ObjUtil.coerce(literal, sys.Str.type$));
    lines.each((line,i) => {
      this$.#writer.raw(line);
      if (sys.ObjUtil.compareNE(i, sys.Int.minus(lines.size(), 1))) {
        this$.#writer.line();
      }
      ;
      return;
    });
    this.#writer.popPrefix();
    this.#writer.block();
    return;
  }

  visitHtmlBlock(html) {
    const this$ = this;
    let lines = CoreMarkdownNodeRenderer.getLines(sys.ObjUtil.coerce(html.literal(), sys.Str.type$));
    lines.each((line,i) => {
      this$.#writer.raw(line);
      if (sys.ObjUtil.compareNE(i, sys.Int.minus(lines.size(), 1))) {
        this$.#writer.line();
      }
      ;
      return;
    });
    this.#writer.block();
    return;
  }

  visitParagraph(p) {
    this.visitChildren(p);
    this.#writer.block();
    return;
  }

  visitLink(link) {
    this.writeLinkLike(link.title(), link.destination(), link, "[");
    return;
  }

  visitImage(image) {
    this.writeLinkLike(image.title(), image.destination(), image, "![");
    return;
  }

  writeLinkLike(title,dest,node,opener) {
    this.#writer.raw(opener);
    this.visitChildren(node);
    this.#writer.raw(sys.ObjUtil.coerce(93, sys.Obj.type$));
    this.#writer.raw(sys.ObjUtil.coerce(40, sys.Obj.type$));
    if (sys.Str.any(dest, CoreMarkdownNodeRenderer.linkDestNeedsAngleBrackets())) {
      this.#writer.raw(sys.ObjUtil.coerce(60, sys.Obj.type$));
      this.#writer.text(dest, CoreMarkdownNodeRenderer.linkDestEscInAngleBrackets());
      this.#writer.raw(sys.ObjUtil.coerce(62, sys.Obj.type$));
    }
    else {
      this.#writer.raw(dest);
    }
    ;
    if (title != null) {
      this.#writer.raw(sys.ObjUtil.coerce(32, sys.Obj.type$));
      this.#writer.raw(sys.ObjUtil.coerce(34, sys.Obj.type$));
      this.#writer.text(sys.ObjUtil.coerce(title, sys.Str.type$), CoreMarkdownNodeRenderer.linkTitleEscInQuotes());
      this.#writer.raw(sys.ObjUtil.coerce(34, sys.Obj.type$));
    }
    ;
    this.#writer.raw(sys.ObjUtil.coerce(41, sys.Obj.type$));
    return;
  }

  visitEmphasis(emp) {
    let delim = emp.openingDelim();
    this.#writer.raw(delim);
    this.visitChildren(emp);
    this.#writer.raw(delim);
    return;
  }

  visitStrongEmphasis(strong) {
    this.#writer.raw("**");
    this.visitChildren(strong);
    this.#writer.raw("**");
    return;
  }

  visitCode(code) {
    CoreMarkdownNodeRenderer.writeCode(this.#writer, code, 96);
    return;
  }

  static writeCode(writer,code,marker) {
    const this$ = this;
    let literal = code.literal();
    let markers = CoreMarkdownNodeRenderer.findMaxRunLen(sys.Str.plus("", sys.Int.toChar(marker)), literal);
    sys.Int.times(sys.Int.plus(markers, 1), (it) => {
      writer.raw(sys.ObjUtil.coerce(marker, sys.Obj.type$));
      return;
    });
    let addSpace = (sys.Str.startsWith(literal, "`") || sys.Str.endsWith(literal, "`") || (sys.Str.startsWith(literal, " ") && sys.Str.endsWith(literal, " ") && Chars.hasNonSpace(literal)));
    if (addSpace) {
      writer.raw(sys.ObjUtil.coerce(32, sys.Obj.type$));
    }
    ;
    writer.raw(literal);
    if (addSpace) {
      writer.raw(sys.ObjUtil.coerce(32, sys.Obj.type$));
    }
    ;
    sys.Int.times(sys.Int.plus(markers, 1), (it) => {
      writer.raw(sys.ObjUtil.coerce(marker, sys.Obj.type$));
      return;
    });
    return;
  }

  visitHtmlInline(html) {
    this.#writer.raw(sys.ObjUtil.coerce(html.literal(), sys.Obj.type$));
    return;
  }

  visitHardLineBreak(hard) {
    this.#writer.raw("  ");
    this.#writer.line();
    return;
  }

  visitSoftLineBreak(soft) {
    this.#writer.line();
    return;
  }

  visitText(text) {
    let literal = text.literal();
    if ((this.#writer.atLineStart() && !sys.Str.isEmpty(literal))) {
      let c = sys.Str.get(literal, 0);
      let $_u98 = c;
      if (sys.ObjUtil.equals($_u98, 45)) {
        this.#writer.raw("\\-");
        (literal = sys.Str.getRange(literal, sys.Range.make(1, -1)));
      }
      else if (sys.ObjUtil.equals($_u98, 35)) {
        this.#writer.raw("\\#");
        (literal = sys.Str.getRange(literal, sys.Range.make(1, -1)));
      }
      else if (sys.ObjUtil.equals($_u98, 61)) {
        if (text.prev() != null) {
          this.#writer.raw("\\=");
          (literal = sys.Str.getRange(literal, sys.Range.make(1, -1)));
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u98, 48) || sys.ObjUtil.equals($_u98, 49) || sys.ObjUtil.equals($_u98, 50) || sys.ObjUtil.equals($_u98, 51) || sys.ObjUtil.equals($_u98, 52) || sys.ObjUtil.equals($_u98, 53) || sys.ObjUtil.equals($_u98, 54) || sys.ObjUtil.equals($_u98, 55) || sys.ObjUtil.equals($_u98, 56) || sys.ObjUtil.equals($_u98, 57)) {
        let m = CoreMarkdownNodeRenderer.orderedListMarkerPattern().matcher(literal);
        if (m.find()) {
          this.#writer.raw(sys.ObjUtil.coerce(m.group(1), sys.Obj.type$));
          this.#writer.raw(sys.Str.plus("\\", m.group(2)));
          (literal = sys.Str.getRange(literal, sys.Range.make(m.end(), -1)));
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u98, 9)) {
        this.#writer.raw("&#9;");
        (literal = sys.Str.getRange(literal, sys.Range.make(1, -1)));
      }
      else if (sys.ObjUtil.equals($_u98, 32)) {
        this.#writer.raw("&#32;");
        (literal = sys.Str.getRange(literal, sys.Range.make(1, -1)));
      }
      ;
    }
    ;
    let escape = ((this$) => { if (sys.ObjUtil.is(text.parent(), Heading.type$)) return this$.#textEscInHeading; return this$.#textEsc; })(this);
    if ((sys.Str.endsWith(literal, "!") && sys.ObjUtil.is(text.next(), Link.type$))) {
      this.#writer.text(sys.Str.getRange(literal, sys.Range.make(0, -1, true)), escape);
      this.#writer.raw("\\!");
    }
    else {
      this.#writer.text(literal, escape);
    }
    ;
    return;
  }

  static getLines(literal) {
    let parts = sys.Regex.fromStr("\n").split(literal, -1);
    if (sys.Str.isEmpty(parts.last())) {
      return parts.getRange(sys.Range.make(0, -1, true));
    }
    ;
    return parts;
  }

  static findMaxRunLen(needle,s) {
    let maxRunLen = 0;
    let pos = sys.ObjUtil.coerce(0, sys.Int.type$.toNullable());
    while (sys.ObjUtil.compareLT(pos, sys.Str.size(s))) {
      (pos = sys.Str.index(s, needle, sys.ObjUtil.coerce(pos, sys.Int.type$)));
      if (pos == null) {
        return maxRunLen;
      }
      ;
      let runLen = 0;
      while (true) {
        pos = sys.Int.plus(sys.ObjUtil.coerce(pos, sys.Int.type$), sys.Str.size(needle));
        runLen = sys.Int.increment(runLen);
        if (sys.ObjUtil.compareNE(sys.Str.index(s, needle, sys.ObjUtil.coerce(pos, sys.Int.type$)), pos)) {
          break;
        }
        ;
      }
      ;
      (maxRunLen = sys.Int.max(runLen, maxRunLen));
    }
    ;
    return maxRunLen;
  }

  visitChildren(parent) {
    this.renderChildren(parent);
    return;
  }

  renderChildren(parent) {
    let node = parent.firstChild();
    while (node != null) {
      let next = node.next();
      this.#cx.render(sys.ObjUtil.coerce(node, Node.type$));
      (node = next);
    }
    ;
    return;
  }

  static static$init() {
    const this$ = this;
    CoreMarkdownNodeRenderer.#orderedListMarkerPattern = sys.ObjUtil.coerce(sys.Regex.fromStr("^([0-9]{1,9})([.)])"), sys.Regex.type$);
    CoreMarkdownNodeRenderer.#linkDestNeedsAngleBrackets = sys.ObjUtil.coerce(((this$) => { let $_u100 = (c) => {
      let $_u101 = c;
      if (sys.ObjUtil.equals($_u101, 32) || sys.ObjUtil.equals($_u101, 40) || sys.ObjUtil.equals($_u101, 41) || sys.ObjUtil.equals($_u101, 60) || sys.ObjUtil.equals($_u101, 62) || sys.ObjUtil.equals($_u101, 10) || sys.ObjUtil.equals($_u101, 92)) {
        return true;
      }
      else {
        return false;
      }
      ;
    }; if ($_u100 == null) return null; return sys.ObjUtil.toImmutable((c) => {
      let $_u102 = c;
      if (sys.ObjUtil.equals($_u102, 32) || sys.ObjUtil.equals($_u102, 40) || sys.ObjUtil.equals($_u102, 41) || sys.ObjUtil.equals($_u102, 60) || sys.ObjUtil.equals($_u102, 62) || sys.ObjUtil.equals($_u102, 10) || sys.ObjUtil.equals($_u102, 92)) {
        return true;
      }
      else {
        return false;
      }
      ;
    }); })(this), sys.Type.find("|sys::Int->sys::Bool|"));
    CoreMarkdownNodeRenderer.#linkDestEscInAngleBrackets = sys.ObjUtil.coerce(((this$) => { let $_u103 = (c) => {
      return (sys.ObjUtil.equals(c, 60) || sys.ObjUtil.equals(c, 62) || sys.ObjUtil.equals(c, 10) || sys.ObjUtil.equals(c, 92));
    }; if ($_u103 == null) return null; return sys.ObjUtil.toImmutable((c) => {
      return (sys.ObjUtil.equals(c, 60) || sys.ObjUtil.equals(c, 62) || sys.ObjUtil.equals(c, 10) || sys.ObjUtil.equals(c, 92));
    }); })(this), sys.Type.find("|sys::Int->sys::Bool|"));
    CoreMarkdownNodeRenderer.#linkTitleEscInQuotes = sys.ObjUtil.coerce(((this$) => { let $_u104 = (c) => {
      return (sys.ObjUtil.equals(c, 34) || sys.ObjUtil.equals(c, 10) || sys.ObjUtil.equals(c, 92));
    }; if ($_u104 == null) return null; return sys.ObjUtil.toImmutable((c) => {
      return (sys.ObjUtil.equals(c, 34) || sys.ObjUtil.equals(c, 10) || sys.ObjUtil.equals(c, 92));
    }); })(this), sys.Type.find("|sys::Int->sys::Bool|"));
    return;
  }

}

class ListHolder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ListHolder.type$; }

  #parent = null;

  parent() {
    return this.#parent;
  }

  static make(parent) {
    const $self = new ListHolder();
    ListHolder.make$($self,parent);
    return $self;
  }

  static make$($self,parent) {
    $self.#parent = parent;
    return;
  }

}

class BulletListHolder extends ListHolder {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BulletListHolder.type$; }

  #marker = null;

  marker() { return this.#marker; }

  __marker(it) { if (it === undefined) return this.#marker; else this.#marker = it; }

  static make(parent,list) {
    const $self = new BulletListHolder();
    BulletListHolder.make$($self,parent,list);
    return $self;
  }

  static make$($self,parent,list) {
    ListHolder.make$($self, parent);
    $self.#marker = sys.ObjUtil.coerce(((this$) => { let $_u105 = list.marker(); if ($_u105 != null) return $_u105; return "-"; })($self), sys.Str.type$);
    return;
  }

}

class OrderedListHolder extends ListHolder {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return OrderedListHolder.type$; }

  #delim = null;

  delim() { return this.#delim; }

  __delim(it) { if (it === undefined) return this.#delim; else this.#delim = it; }

  #number = 0;

  number(it) {
    if (it === undefined) {
      return this.#number;
    }
    else {
      this.#number = it;
      return;
    }
  }

  static make(parent,list) {
    const $self = new OrderedListHolder();
    OrderedListHolder.make$($self,parent,list);
    return $self;
  }

  static make$($self,parent,list) {
    ListHolder.make$($self, parent);
    $self.#delim = sys.ObjUtil.coerce(((this$) => { let $_u106 = list.markerDelim(); if ($_u106 != null) return $_u106; return "."; })($self), sys.Str.type$);
    $self.#number = sys.ObjUtil.coerce(((this$) => { let $_u107 = list.startNumber(); if ($_u107 != null) return $_u107; return sys.ObjUtil.coerce(1, sys.Int.type$.toNullable()); })($self), sys.Int.type$);
    return;
  }

}

class LineBreakVisitor extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#hasLineBreak = false;
    return;
  }

  typeof() { return LineBreakVisitor.type$; }

  visitBulletList() { return Visitor.prototype.visitBulletList.apply(this, arguments); }

  visitCustomNode() { return Visitor.prototype.visitCustomNode.apply(this, arguments); }

  visitFencedCode() { return Visitor.prototype.visitFencedCode.apply(this, arguments); }

  visitThematicBreak() { return Visitor.prototype.visitThematicBreak.apply(this, arguments); }

  visitChildren() { return Visitor.prototype.visitChildren.apply(this, arguments); }

  visitLinkReferenceDefinition() { return Visitor.prototype.visitLinkReferenceDefinition.apply(this, arguments); }

  visitHeading() { return Visitor.prototype.visitHeading.apply(this, arguments); }

  visitDocument() { return Visitor.prototype.visitDocument.apply(this, arguments); }

  visitStrongEmphasis() { return Visitor.prototype.visitStrongEmphasis.apply(this, arguments); }

  visitText() { return Visitor.prototype.visitText.apply(this, arguments); }

  visitListItem() { return Visitor.prototype.visitListItem.apply(this, arguments); }

  visitOrderedList() { return Visitor.prototype.visitOrderedList.apply(this, arguments); }

  visitCode() { return Visitor.prototype.visitCode.apply(this, arguments); }

  visitHtmlBlock() { return Visitor.prototype.visitHtmlBlock.apply(this, arguments); }

  visitParagraph() { return Visitor.prototype.visitParagraph.apply(this, arguments); }

  visitCustomBlock() { return Visitor.prototype.visitCustomBlock.apply(this, arguments); }

  visitLink() { return Visitor.prototype.visitLink.apply(this, arguments); }

  visitBlockQuote() { return Visitor.prototype.visitBlockQuote.apply(this, arguments); }

  visitIndentedCode() { return Visitor.prototype.visitIndentedCode.apply(this, arguments); }

  visitEmphasis() { return Visitor.prototype.visitEmphasis.apply(this, arguments); }

  visitImage() { return Visitor.prototype.visitImage.apply(this, arguments); }

  visitHtmlInline() { return Visitor.prototype.visitHtmlInline.apply(this, arguments); }

  #hasLineBreak = false;

  hasLineBreak() {
    return this.#hasLineBreak;
  }

  visitSoftLineBreak(b) {
    this.visitChildren(b);
    this.#hasLineBreak = true;
    return;
  }

  visitHardLineBreak(b) {
    this.visitChildren(b);
    this.#hasLineBreak = true;
    return;
  }

  static make() {
    const $self = new LineBreakVisitor();
    LineBreakVisitor.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class MarkdownWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#blockSep = 0;
    this.#lastChar = 0;
    this.#atLineStart = true;
    this.#prefixes = sys.List.make(sys.Str.type$);
    this.#tight = sys.List.make(sys.Bool.type$);
    this.#rawEscapes = sys.List.make(sys.Type.find("|sys::Int->sys::Bool|"));
    return;
  }

  typeof() { return MarkdownWriter.type$; }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  #blockSep = 0;

  // private field reflection only
  __blockSep(it) { if (it === undefined) return this.#blockSep; else this.#blockSep = it; }

  #lastChar = 0;

  lastChar() {
    return this.#lastChar;
  }

  #atLineStart = false;

  atLineStart() {
    return this.#atLineStart;
  }

  #prefixes = null;

  // private field reflection only
  __prefixes(it) { if (it === undefined) return this.#prefixes; else this.#prefixes = it; }

  #tight = null;

  // private field reflection only
  __tight(it) { if (it === undefined) return this.#tight; else this.#tight = it; }

  #rawEscapes = null;

  // private field reflection only
  __rawEscapes(it) { if (it === undefined) return this.#rawEscapes; else this.#rawEscapes = it; }

  static make(out) {
    const $self = new MarkdownWriter();
    MarkdownWriter.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    ;
    $self.#out = out;
    return;
  }

  raw(obj) {
    if (sys.ObjUtil.is(obj, sys.Str.type$)) {
      this.rawStr(sys.ObjUtil.coerce(obj, sys.Str.type$));
    }
    else {
      this.rawCh(sys.ObjUtil.coerce(obj, sys.Int.type$));
    }
    ;
    return;
  }

  rawStr(s) {
    this.flushBlockSeparator();
    this.writeStr(s);
    return;
  }

  rawCh(c) {
    this.flushBlockSeparator();
    this.write(c);
    return;
  }

  text(s,escape) {
    if (escape === undefined) escape = null;
    if (sys.Str.isEmpty(s)) {
      return;
    }
    ;
    this.flushBlockSeparator();
    this.writeStr(s, escape);
    this.#lastChar = sys.Str.get(s, -1);
    this.#atLineStart = false;
    return;
  }

  line() {
    this.write(10);
    this.writePrefixes();
    this.#atLineStart = true;
    return;
  }

  block() {
    this.#blockSep = ((this$) => { if (this$.isTight()) return 1; return 2; })(this);
    this.#atLineStart = true;
    return;
  }

  pushPrefix(prefix) {
    this.#prefixes.add(prefix);
    return;
  }

  writePrefix(prefix) {
    let tmp = this.#atLineStart;
    this.rawStr(prefix);
    this.#atLineStart = tmp;
    return;
  }

  popPrefix() {
    this.#prefixes.pop();
    return;
  }

  pushTight(tight) {
    this.#tight.add(sys.ObjUtil.coerce(tight, sys.Obj.type$.toNullable()));
    return;
  }

  popTight() {
    this.#tight.pop();
    return;
  }

  pushRawEscape(rawEscape) {
    this.#rawEscapes.add(rawEscape);
    return;
  }

  popRawEscape() {
    this.#rawEscapes.pop();
    return;
  }

  write(c) {
    this.append(c);
    this.#lastChar = c;
    this.#atLineStart = false;
    return;
  }

  writeStr(s,escape) {
    if (escape === undefined) escape = null;
    const this$ = this;
    if ((this.#rawEscapes.isEmpty() && escape == null)) {
      this.#out.writeChars(s);
    }
    else {
      sys.Str.each(s, (c) => {
        this$.append(c, escape);
        return;
      });
    }
    ;
    if (!sys.Str.isEmpty(s)) {
      this.#lastChar = sys.Str.get(s, -1);
    }
    ;
    this.#atLineStart = false;
    return;
  }

  writePrefixes() {
    const this$ = this;
    this.#prefixes.each((prefix) => {
      this$.writeStr(prefix);
      return;
    });
    return;
  }

  flushBlockSeparator() {
    if (sys.ObjUtil.compareNE(this.#blockSep, 0)) {
      this.write(10);
      this.writePrefixes();
      if (sys.ObjUtil.compareGT(this.#blockSep, 1)) {
        this.write(10);
        this.writePrefixes();
      }
      ;
      this.#blockSep = 0;
    }
    ;
    return;
  }

  append(c,escape) {
    if (escape === undefined) escape = null;
    if (this.needsEscaping(c, escape)) {
      if (sys.ObjUtil.equals(c, 10)) {
        this.#out.writeChars("&#10;");
      }
      else {
        this.#out.writeChar(92);
        this.#out.writeChar(c);
      }
      ;
    }
    else {
      this.#out.writeChar(c);
    }
    ;
    return;
  }

  isTight() {
    return (!this.#tight.isEmpty() && sys.ObjUtil.coerce(this.#tight.last(), sys.Bool.type$));
  }

  needsEscaping(c,escape) {
    return ((escape != null && sys.Func.call(escape, sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()))) || this.rawNeedsEscaping(c));
  }

  rawNeedsEscaping(c) {
    const this$ = this;
    return this.#rawEscapes.any((esc) => {
      return sys.Func.call(esc, sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()));
    });
  }

}

class Html5 extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Html5.type$; }

  static #named_char_refs = undefined;

  static named_char_refs() {
    if (Html5.#named_char_refs === undefined) {
      Html5.static$init();
      if (Html5.#named_char_refs === undefined) Html5.#named_char_refs = null;
    }
    return Html5.#named_char_refs;
  }

  static entityToStr(input) {
    if ((!sys.Str.startsWith(input, "&") || !sys.Str.endsWith(input, ";"))) {
      return input;
    }
    ;
    let val = sys.Str.getRange(input, sys.Range.make(1, sys.Int.minus(sys.Str.size(input), 1), true));
    if (sys.Str.startsWith(val, "#")) {
      (val = sys.Str.getRange(val, sys.Range.make(1, -1)));
      let base = 10;
      if ((sys.Str.startsWith(val, "x") || sys.Str.startsWith(val, "X"))) {
        (val = sys.Str.getRange(val, sys.Range.make(1, -1)));
        (base = 16);
      }
      ;
      try {
        let cp = sys.Str.toInt(val, base);
        if (sys.ObjUtil.equals(cp, 0)) {
          return "\ufffd";
        }
        ;
        return sys.Int.toChar(sys.ObjUtil.coerce(cp, sys.Int.type$));
      }
      catch ($_u109) {
        return "\ufffd";
      }
      ;
    }
    else {
      let s = Html5.named_char_refs().get(val);
      if (s != null) {
        return sys.ObjUtil.coerce(s, sys.Str.type$);
      }
      ;
      return input;
    }
    ;
  }

  static make() {
    const $self = new Html5();
    Html5.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    Html5.#named_char_refs = sys.ObjUtil.coerce(((this$) => { let $_u110 = sys.Map.__fromLiteral(["Aacute","aacute","Abreve","abreve","ac","acd","acE","Acirc","acirc","acute","Acy","acy","AElig","aelig","af","Afr","afr","Agrave","agrave","alefsym","aleph","Alpha","alpha","Amacr","amacr","amalg","amp","AMP","andand","And","and","andd","andslope","andv","ang","ange","angle","angmsdaa","angmsdab","angmsdac","angmsdad","angmsdae","angmsdaf","angmsdag","angmsdah","angmsd","angrt","angrtvb","angrtvbd","angsph","angst","angzarr","Aogon","aogon","Aopf","aopf","apacir","ap","apE","ape","apid","apos","ApplyFunction","approx","approxeq","Aring","aring","Ascr","ascr","Assign","ast","asymp","asympeq","Atilde","atilde","Auml","auml","awconint","awint","backcong","backepsilon","backprime","backsim","backsimeq","Backslash","Barv","barvee","barwed","Barwed","barwedge","bbrk","bbrktbrk","bcong","Bcy","bcy","bdquo","becaus","because","Because","bemptyv","bepsi","bernou","Bernoullis","Beta","beta","beth","between","Bfr","bfr","bigcap","bigcirc","bigcup","bigodot","bigoplus","bigotimes","bigsqcup","bigstar","bigtriangledown","bigtriangleup","biguplus","bigvee","bigwedge","bkarow","blacklozenge","blacksquare","blacktriangle","blacktriangledown","blacktriangleleft","blacktriangleright","blank","blk12","blk14","blk34","block","bne","bnequiv","bNot","bnot","Bopf","bopf","bot","bottom","bowtie","boxbox","boxdl","boxdL","boxDl","boxDL","boxdr","boxdR","boxDr","boxDR","boxh","boxH","boxhd","boxHd","boxhD","boxHD","boxhu","boxHu","boxhU","boxHU","boxminus","boxplus","boxtimes","boxul","boxuL","boxUl","boxUL","boxur","boxuR","boxUr","boxUR","boxv","boxV","boxvh","boxvH","boxVh","boxVH","boxvl","boxvL","boxVl","boxVL","boxvr","boxvR","boxVr","boxVR","bprime","breve","Breve","brvbar","bscr","Bscr","bsemi","bsim","bsime","bsolb","bsol","bsolhsub","bull","bullet","bump","bumpE","bumpe","Bumpeq","bumpeq","Cacute","cacute","capand","capbrcup","capcap","cap","Cap","capcup","capdot","CapitalDifferentialD","caps","caret","caron","Cayleys","ccaps","Ccaron","ccaron","Ccedil","ccedil","Ccirc","ccirc","Cconint","ccups","ccupssm","Cdot","cdot","cedil","Cedilla","cemptyv","cent","centerdot","CenterDot","cfr","Cfr","CHcy","chcy","check","checkmark","Chi","chi","circ","circeq","circlearrowleft","circlearrowright","circledast","circledcirc","circleddash","CircleDot","circledR","circledS","CircleMinus","CirclePlus","CircleTimes","cir","cirE","cire","cirfnint","cirmid","cirscir","ClockwiseContourIntegral","CloseCurlyDoubleQuote","CloseCurlyQuote","clubs","clubsuit","colon","Colon","Colone","colone","coloneq","comma","commat","comp","compfn","complement","complexes","cong","congdot","Congruent","conint","Conint","ContourIntegral","copf","Copf","coprod","Coproduct","copy","COPY","copysr","CounterClockwiseContourIntegral","crarr","cross","Cross","Cscr","cscr","csub","csube","csup","csupe","ctdot","cudarrl","cudarrr","cuepr","cuesc","cularr","cularrp","cupbrcap","cupcap","CupCap","cup","Cup","cupcup","cupdot","cupor","cups","curarr","curarrm","curlyeqprec","curlyeqsucc","curlyvee","curlywedge","curren","curvearrowleft","curvearrowright","cuvee","cuwed","cwconint","cwint","cylcty","dagger","Dagger","daleth","darr","Darr","dArr","dash","Dashv","dashv","dbkarow","dblac","Dcaron","dcaron","Dcy","dcy","ddagger","ddarr","DD","dd","DDotrahd","ddotseq","deg","Del","Delta","delta","demptyv","dfisht","Dfr","dfr","dHar","dharl","dharr","DiacriticalAcute","DiacriticalDot","DiacriticalDoubleAcute","DiacriticalGrave","DiacriticalTilde","diam","diamond","Diamond","diamondsuit","diams","die","DifferentialD","digamma","disin","div","divide","divideontimes","divonx","DJcy","djcy","dlcorn","dlcrop","dollar","Dopf","dopf","Dot","dot","DotDot","doteq","doteqdot","DotEqual","dotminus","dotplus","dotsquare","doublebarwedge","DoubleContourIntegral","DoubleDot","DoubleDownArrow","DoubleLeftArrow","DoubleLeftRightArrow","DoubleLeftTee","DoubleLongLeftArrow","DoubleLongLeftRightArrow","DoubleLongRightArrow","DoubleRightArrow","DoubleRightTee","DoubleUpArrow","DoubleUpDownArrow","DoubleVerticalBar","DownArrowBar","downarrow","DownArrow","Downarrow","DownArrowUpArrow","DownBreve","downdownarrows","downharpoonleft","downharpoonright","DownLeftRightVector","DownLeftTeeVector","DownLeftVectorBar","DownLeftVector","DownRightTeeVector","DownRightVectorBar","DownRightVector","DownTeeArrow","DownTee","drbkarow","drcorn","drcrop","Dscr","dscr","DScy","dscy","dsol","Dstrok","dstrok","dtdot","dtri","dtrif","duarr","duhar","dwangle","DZcy","dzcy","dzigrarr","Eacute","eacute","easter","Ecaron","ecaron","Ecirc","ecirc","ecir","ecolon","Ecy","ecy","eDDot","Edot","edot","eDot","ee","efDot","Efr","efr","eg","Egrave","egrave","egs","egsdot","el","Element","elinters","ell","els","elsdot","Emacr","emacr","empty","emptyset","EmptySmallSquare","emptyv","EmptyVerySmallSquare","emsp13","emsp14","emsp","ENG","eng","ensp","Eogon","eogon","Eopf","eopf","epar","eparsl","eplus","epsi","Epsilon","epsilon","epsiv","eqcirc","eqcolon","eqsim","eqslantgtr","eqslantless","Equal","equals","EqualTilde","equest","Equilibrium","equiv","equivDD","eqvparsl","erarr","erDot","escr","Escr","esdot","Esim","esim","Eta","eta","ETH","eth","Euml","euml","euro","excl","exist","Exists","expectation","exponentiale","ExponentialE","fallingdotseq","Fcy","fcy","female","ffilig","fflig","ffllig","Ffr","ffr","filig","FilledSmallSquare","FilledVerySmallSquare","fjlig","flat","fllig","fltns","fnof","Fopf","fopf","forall","ForAll","fork","forkv","Fouriertrf","fpartint","frac12","frac13","frac14","frac15","frac16","frac18","frac23","frac25","frac34","frac35","frac38","frac45","frac56","frac58","frac78","frasl","frown","fscr","Fscr","gacute","Gamma","gamma","Gammad","gammad","gap","Gbreve","gbreve","Gcedil","Gcirc","gcirc","Gcy","gcy","Gdot","gdot","ge","gE","gEl","gel","geq","geqq","geqslant","gescc","ges","gesdot","gesdoto","gesdotol","gesl","gesles","Gfr","gfr","gg","Gg","ggg","gimel","GJcy","gjcy","gla","gl","glE","glj","gnap","gnapprox","gne","gnE","gneq","gneqq","gnsim","Gopf","gopf","grave","GreaterEqual","GreaterEqualLess","GreaterFullEqual","GreaterGreater","GreaterLess","GreaterSlantEqual","GreaterTilde","Gscr","gscr","gsim","gsime","gsiml","gtcc","gtcir","gt","GT","Gt","gtdot","gtlPar","gtquest","gtrapprox","gtrarr","gtrdot","gtreqless","gtreqqless","gtrless","gtrsim","gvertneqq","gvnE","Hacek","hairsp","half","hamilt","HARDcy","hardcy","harrcir","harr","hArr","harrw","Hat","hbar","Hcirc","hcirc","hearts","heartsuit","hellip","hercon","hfr","Hfr","HilbertSpace","hksearow","hkswarow","hoarr","homtht","hookleftarrow","hookrightarrow","hopf","Hopf","horbar","HorizontalLine","hscr","Hscr","hslash","Hstrok","hstrok","HumpDownHump","HumpEqual","hybull","hyphen","Iacute","iacute","ic","Icirc","icirc","Icy","icy","Idot","IEcy","iecy","iexcl","iff","ifr","Ifr","Igrave","igrave","ii","iiiint","iiint","iinfin","iiota","IJlig","ijlig","Imacr","imacr","image","ImaginaryI","imagline","imagpart","imath","Im","imof","imped","Implies","incare","in","infin","infintie","inodot","intcal","int","Int","integers","Integral","intercal","Intersection","intlarhk","intprod","InvisibleComma","InvisibleTimes","IOcy","iocy","Iogon","iogon","Iopf","iopf","Iota","iota","iprod","iquest","iscr","Iscr","isin","isindot","isinE","isins","isinsv","isinv","it","Itilde","itilde","Iukcy","iukcy","Iuml","iuml","Jcirc","jcirc","Jcy","jcy","Jfr","jfr","jmath","Jopf","jopf","Jscr","jscr","Jsercy","jsercy","Jukcy","jukcy","Kappa","kappa","kappav","Kcedil","kcedil","Kcy","kcy","Kfr","kfr","kgreen","KHcy","khcy","KJcy","kjcy","Kopf","kopf","Kscr","kscr","lAarr","Lacute","lacute","laemptyv","lagran","Lambda","lambda","lang","Lang","langd","langle","lap","Laplacetrf","laquo","larrb","larrbfs","larr","Larr","lArr","larrfs","larrhk","larrlp","larrpl","larrsim","larrtl","latail","lAtail","lat","late","lates","lbarr","lBarr","lbbrk","lbrace","lbrack","lbrke","lbrksld","lbrkslu","Lcaron","lcaron","Lcedil","lcedil","lceil","lcub","Lcy","lcy","ldca","ldquo","ldquor","ldrdhar","ldrushar","ldsh","le","lE","LeftAngleBracket","LeftArrowBar","leftarrow","LeftArrow","Leftarrow","LeftArrowRightArrow","leftarrowtail","LeftCeiling","LeftDoubleBracket","LeftDownTeeVector","LeftDownVectorBar","LeftDownVector","LeftFloor","leftharpoondown","leftharpoonup","leftleftarrows","leftrightarrow","LeftRightArrow","Leftrightarrow","leftrightarrows","leftrightharpoons","leftrightsquigarrow","LeftRightVector","LeftTeeArrow","LeftTee","LeftTeeVector","leftthreetimes","LeftTriangleBar","LeftTriangle","LeftTriangleEqual","LeftUpDownVector","LeftUpTeeVector","LeftUpVectorBar","LeftUpVector","LeftVectorBar","LeftVector","lEg","leg","leq","leqq","leqslant","lescc","les","lesdot","lesdoto","lesdotor","lesg","lesges","lessapprox","lessdot","lesseqgtr","lesseqqgtr","LessEqualGreater","LessFullEqual","LessGreater","lessgtr","LessLess","lesssim","LessSlantEqual","LessTilde","lfisht","lfloor","Lfr","lfr","lg","lgE","lHar","lhard","lharu","lharul","lhblk","LJcy","ljcy","llarr","ll","Ll","llcorner","Lleftarrow","llhard","lltri","Lmidot","lmidot","lmoustache","lmoust","lnap","lnapprox","lne","lnE","lneq","lneqq","lnsim","loang","loarr","lobrk","longleftarrow","LongLeftArrow","Longleftarrow","longleftrightarrow","LongLeftRightArrow","Longleftrightarrow","longmapsto","longrightarrow","LongRightArrow","Longrightarrow","looparrowleft","looparrowright","lopar","Lopf","lopf","loplus","lotimes","lowast","lowbar","LowerLeftArrow","LowerRightArrow","loz","lozenge","lozf","lpar","lparlt","lrarr","lrcorner","lrhar","lrhard","lrm","lrtri","lsaquo","lscr","Lscr","lsh","Lsh","lsim","lsime","lsimg","lsqb","lsquo","lsquor","Lstrok","lstrok","ltcc","ltcir","lt","LT","Lt","ltdot","lthree","ltimes","ltlarr","ltquest","ltri","ltrie","ltrif","ltrPar","lurdshar","luruhar","lvertneqq","lvnE","macr","male","malt","maltese","Map","map","mapsto","mapstodown","mapstoleft","mapstoup","marker","mcomma","Mcy","mcy","mdash","mDDot","measuredangle","MediumSpace","Mellintrf","Mfr","mfr","mho","micro","midast","midcir","mid","middot","minusb","minus","minusd","minusdu","MinusPlus","mlcp","mldr","mnplus","models","Mopf","mopf","mp","mscr","Mscr","mstpos","Mu","mu","multimap","mumap","nabla","Nacute","nacute","nang","nap","napE","napid","napos","napprox","natural","naturals","natur","nbsp","nbump","nbumpe","ncap","Ncaron","ncaron","Ncedil","ncedil","ncong","ncongdot","ncup","Ncy","ncy","ndash","nearhk","nearr","neArr","nearrow","ne","nedot","NegativeMediumSpace","NegativeThickSpace","NegativeThinSpace","NegativeVeryThinSpace","nequiv","nesear","nesim","NestedGreaterGreater","NestedLessLess","NewLine","nexist","nexists","Nfr","nfr","ngE","nge","ngeq","ngeqq","ngeqslant","nges","nGg","ngsim","nGt","ngt","ngtr","nGtv","nharr","nhArr","nhpar","ni","nis","nisd","niv","NJcy","njcy","nlarr","nlArr","nldr","nlE","nle","nleftarrow","nLeftarrow","nleftrightarrow","nLeftrightarrow","nleq","nleqq","nleqslant","nles","nless","nLl","nlsim","nLt","nlt","nltri","nltrie","nLtv","nmid","NoBreak","NonBreakingSpace","nopf","Nopf","Not","not","NotCongruent","NotCupCap","NotDoubleVerticalBar","NotElement","NotEqual","NotEqualTilde","NotExists","NotGreater","NotGreaterEqual","NotGreaterFullEqual","NotGreaterGreater","NotGreaterLess","NotGreaterSlantEqual","NotGreaterTilde","NotHumpDownHump","NotHumpEqual","notin","notindot","notinE","notinva","notinvb","notinvc","NotLeftTriangleBar","NotLeftTriangle","NotLeftTriangleEqual","NotLess","NotLessEqual","NotLessGreater","NotLessLess","NotLessSlantEqual","NotLessTilde","NotNestedGreaterGreater","NotNestedLessLess","notni","notniva","notnivb","notnivc","NotPrecedes","NotPrecedesEqual","NotPrecedesSlantEqual","NotReverseElement","NotRightTriangleBar","NotRightTriangle","NotRightTriangleEqual","NotSquareSubset","NotSquareSubsetEqual","NotSquareSuperset","NotSquareSupersetEqual","NotSubset","NotSubsetEqual","NotSucceeds","NotSucceedsEqual","NotSucceedsSlantEqual","NotSucceedsTilde","NotSuperset","NotSupersetEqual","NotTilde","NotTildeEqual","NotTildeFullEqual","NotTildeTilde","NotVerticalBar","nparallel","npar","nparsl","npart","npolint","npr","nprcue","nprec","npreceq","npre","nrarrc","nrarr","nrArr","nrarrw","nrightarrow","nRightarrow","nrtri","nrtrie","nsc","nsccue","nsce","Nscr","nscr","nshortmid","nshortparallel","nsim","nsime","nsimeq","nsmid","nspar","nsqsube","nsqsupe","nsub","nsubE","nsube","nsubset","nsubseteq","nsubseteqq","nsucc","nsucceq","nsup","nsupE","nsupe","nsupset","nsupseteq","nsupseteqq","ntgl","Ntilde","ntilde","ntlg","ntriangleleft","ntrianglelefteq","ntriangleright","ntrianglerighteq","Nu","nu","num","numero","numsp","nvap","nvdash","nvDash","nVdash","nVDash","nvge","nvgt","nvHarr","nvinfin","nvlArr","nvle","nvlt","nvltrie","nvrArr","nvrtrie","nvsim","nwarhk","nwarr","nwArr","nwarrow","nwnear","Oacute","oacute","oast","Ocirc","ocirc","ocir","Ocy","ocy","odash","Odblac","odblac","odiv","odot","odsold","OElig","oelig","ofcir","Ofr","ofr","ogon","Ograve","ograve","ogt","ohbar","ohm","oint","olarr","olcir","olcross","oline","olt","Omacr","omacr","Omega","omega","Omicron","omicron","omid","ominus","Oopf","oopf","opar","OpenCurlyDoubleQuote","OpenCurlyQuote","operp","oplus","orarr","Or","or","ord","order","orderof","ordf","ordm","origof","oror","orslope","orv","oS","Oscr","oscr","Oslash","oslash","osol","Otilde","otilde","otimesas","Otimes","otimes","Ouml","ouml","ovbar","OverBar","OverBrace","OverBracket","OverParenthesis","para","parallel","par","parsim","parsl","part","PartialD","Pcy","pcy","percnt","period","permil","perp","pertenk","Pfr","pfr","Phi","phi","phiv","phmmat","phone","Pi","pi","pitchfork","piv","planck","planckh","plankv","plusacir","plusb","pluscir","plus","plusdo","plusdu","pluse","PlusMinus","plusmn","plussim","plustwo","pm","Poincareplane","pointint","popf","Popf","pound","prap","Pr","pr","prcue","precapprox","prec","preccurlyeq","Precedes","PrecedesEqual","PrecedesSlantEqual","PrecedesTilde","preceq","precnapprox","precneqq","precnsim","pre","prE","precsim","prime","Prime","primes","prnap","prnE","prnsim","prod","Product","profalar","profline","profsurf","prop","Proportional","Proportion","propto","prsim","prurel","Pscr","pscr","Psi","psi","puncsp","Qfr","qfr","qint","qopf","Qopf","qprime","Qscr","qscr","quaternions","quatint","quest","questeq","quot","QUOT","rAarr","race","Racute","racute","radic","raemptyv","rang","Rang","rangd","range","rangle","raquo","rarrap","rarrb","rarrbfs","rarrc","rarr","Rarr","rArr","rarrfs","rarrhk","rarrlp","rarrpl","rarrsim","Rarrtl","rarrtl","rarrw","ratail","rAtail","ratio","rationals","rbarr","rBarr","RBarr","rbbrk","rbrace","rbrack","rbrke","rbrksld","rbrkslu","Rcaron","rcaron","Rcedil","rcedil","rceil","rcub","Rcy","rcy","rdca","rdldhar","rdquo","rdquor","rdsh","real","realine","realpart","reals","Re","rect","reg","REG","ReverseElement","ReverseEquilibrium","ReverseUpEquilibrium","rfisht","rfloor","rfr","Rfr","rHar","rhard","rharu","rharul","Rho","rho","rhov","RightAngleBracket","RightArrowBar","rightarrow","RightArrow","Rightarrow","RightArrowLeftArrow","rightarrowtail","RightCeiling","RightDoubleBracket","RightDownTeeVector","RightDownVectorBar","RightDownVector","RightFloor","rightharpoondown","rightharpoonup","rightleftarrows","rightleftharpoons","rightrightarrows","rightsquigarrow","RightTeeArrow","RightTee","RightTeeVector","rightthreetimes","RightTriangleBar","RightTriangle","RightTriangleEqual","RightUpDownVector","RightUpTeeVector","RightUpVectorBar","RightUpVector","RightVectorBar","RightVector","ring","risingdotseq","rlarr","rlhar","rlm","rmoustache","rmoust","rnmid","roang","roarr","robrk","ropar","ropf","Ropf","roplus","rotimes","RoundImplies","rpar","rpargt","rppolint","rrarr","Rrightarrow","rsaquo","rscr","Rscr","rsh","Rsh","rsqb","rsquo","rsquor","rthree","rtimes","rtri","rtrie","rtrif","rtriltri","RuleDelayed","ruluhar","rx","Sacute","sacute","sbquo","scap","Scaron","scaron","Sc","sc","sccue","sce","scE","Scedil","scedil","Scirc","scirc","scnap","scnE","scnsim","scpolint","scsim","Scy","scy","sdotb","sdot","sdote","searhk","searr","seArr","searrow","sect","semi","seswar","setminus","setmn","sext","Sfr","sfr","sfrown","sharp","SHCHcy","shchcy","SHcy","shcy","ShortDownArrow","ShortLeftArrow","shortmid","shortparallel","ShortRightArrow","ShortUpArrow","shy","Sigma","sigma","sigmaf","sigmav","sim","simdot","sime","simeq","simg","simgE","siml","simlE","simne","simplus","simrarr","slarr","SmallCircle","smallsetminus","smashp","smeparsl","smid","smile","smt","smte","smtes","SOFTcy","softcy","solbar","solb","sol","Sopf","sopf","spades","spadesuit","spar","sqcap","sqcaps","sqcup","sqcups","Sqrt","sqsub","sqsube","sqsubset","sqsubseteq","sqsup","sqsupe","sqsupset","sqsupseteq","square","Square","SquareIntersection","SquareSubset","SquareSubsetEqual","SquareSuperset","SquareSupersetEqual","SquareUnion","squarf","squ","squf","srarr","Sscr","sscr","ssetmn","ssmile","sstarf","Star","star","starf","straightepsilon","straightphi","strns","sub","Sub","subdot","subE","sube","subedot","submult","subnE","subne","subplus","subrarr","subset","Subset","subseteq","subseteqq","SubsetEqual","subsetneq","subsetneqq","subsim","subsub","subsup","succapprox","succ","succcurlyeq","Succeeds","SucceedsEqual","SucceedsSlantEqual","SucceedsTilde","succeq","succnapprox","succneqq","succnsim","succsim","SuchThat","sum","Sum","sung","sup1","sup2","sup3","sup","Sup","supdot","supdsub","supE","supe","supedot","Superset","SupersetEqual","suphsol","suphsub","suplarr","supmult","supnE","supne","supplus","supset","Supset","supseteq","supseteqq","supsetneq","supsetneqq","supsim","supsub","supsup","swarhk","swarr","swArr","swarrow","swnwar","szlig","Tab","target","Tau","tau","tbrk","Tcaron","tcaron","Tcedil","tcedil","Tcy","tcy","tdot","telrec","Tfr","tfr","there4","therefore","Therefore","Theta","theta","thetasym","thetav","thickapprox","thicksim","ThickSpace","ThinSpace","thinsp","thkap","thksim","THORN","thorn","tilde","Tilde","TildeEqual","TildeFullEqual","TildeTilde","timesbar","timesb","times","timesd","tint","toea","topbot","topcir","top","Topf","topf","topfork","tosa","tprime","trade","TRADE","triangle","triangledown","triangleleft","trianglelefteq","triangleq","triangleright","trianglerighteq","tridot","trie","triminus","TripleDot","triplus","trisb","tritime","trpezium","Tscr","tscr","TScy","tscy","TSHcy","tshcy","Tstrok","tstrok","twixt","twoheadleftarrow","twoheadrightarrow","Uacute","uacute","uarr","Uarr","uArr","Uarrocir","Ubrcy","ubrcy","Ubreve","ubreve","Ucirc","ucirc","Ucy","ucy","udarr","Udblac","udblac","udhar","ufisht","Ufr","ufr","Ugrave","ugrave","uHar","uharl","uharr","uhblk","ulcorn","ulcorner","ulcrop","ultri","Umacr","umacr","uml","UnderBar","UnderBrace","UnderBracket","UnderParenthesis","Union","UnionPlus","Uogon","uogon","Uopf","uopf","UpArrowBar","uparrow","UpArrow","Uparrow","UpArrowDownArrow","updownarrow","UpDownArrow","Updownarrow","UpEquilibrium","upharpoonleft","upharpoonright","uplus","UpperLeftArrow","UpperRightArrow","upsi","Upsi","upsih","Upsilon","upsilon","UpTeeArrow","UpTee","upuparrows","urcorn","urcorner","urcrop","Uring","uring","urtri","Uscr","uscr","utdot","Utilde","utilde","utri","utrif","uuarr","Uuml","uuml","uwangle","vangrt","varepsilon","varkappa","varnothing","varphi","varpi","varpropto","varr","vArr","varrho","varsigma","varsubsetneq","varsubsetneqq","varsupsetneq","varsupsetneqq","vartheta","vartriangleleft","vartriangleright","vBar","Vbar","vBarv","Vcy","vcy","vdash","vDash","Vdash","VDash","Vdashl","veebar","vee","Vee","veeeq","vellip","verbar","Verbar","vert","Vert","VerticalBar","VerticalLine","VerticalSeparator","VerticalTilde","VeryThinSpace","Vfr","vfr","vltri","vnsub","vnsup","Vopf","vopf","vprop","vrtri","Vscr","vscr","vsubnE","vsubne","vsupnE","vsupne","Vvdash","vzigzag","Wcirc","wcirc","wedbar","wedge","Wedge","wedgeq","weierp","Wfr","wfr","Wopf","wopf","wp","wr","wreath","Wscr","wscr","xcap","xcirc","xcup","xdtri","Xfr","xfr","xharr","xhArr","Xi","xi","xlarr","xlArr","xmap","xnis","xodot","Xopf","xopf","xoplus","xotime","xrarr","xrArr","Xscr","xscr","xsqcup","xuplus","xutri","xvee","xwedge","Yacute","yacute","YAcy","yacy","Ycirc","ycirc","Ycy","ycy","yen","Yfr","yfr","YIcy","yicy","Yopf","yopf","Yscr","yscr","YUcy","yucy","yuml","Yuml","Zacute","zacute","Zcaron","zcaron","Zcy","zcy","Zdot","zdot","zeetrf","ZeroWidthSpace","Zeta","zeta","zfr","Zfr","ZHcy","zhcy","zigrarr","zopf","Zopf","Zscr","zscr","zwj","zwnj","NewLine"], ["\u00c1","\u00e1","\u0102","\u0103","\u223e","\u223f","\u223e\u0333","\u00c2","\u00e2","\u00b4","\u0410","\u0430","\u00c6","\u00e6","\u2061","\ud504","\ud51e","\u00c0","\u00e0","\u2135","\u2135","\u0391","\u03b1","\u0100","\u0101","\u2a3f","&","&","\u2a55","\u2a53","\u2227","\u2a5c","\u2a58","\u2a5a","\u2220","\u29a4","\u2220","\u29a8","\u29a9","\u29aa","\u29ab","\u29ac","\u29ad","\u29ae","\u29af","\u2221","\u221f","\u22be","\u299d","\u2222","\u00c5","\u237c","\u0104","\u0105","\ud538","\ud552","\u2a6f","\u2248","\u2a70","\u224a","\u224b","'","\u2061","\u2248","\u224a","\u00c5","\u00e5","\ud49c","\ud4b6","\u2254","*","\u2248","\u224d","\u00c3","\u00e3","\u00c4","\u00e4","\u2233","\u2a11","\u224c","\u03f6","\u2035","\u223d","\u22cd","\u2216","\u2ae7","\u22bd","\u2305","\u2306","\u2305","\u23b5","\u23b6","\u224c","\u0411","\u0431","\u201e","\u2235","\u2235","\u2235","\u29b0","\u03f6","\u212c","\u212c","\u0392","\u03b2","\u2136","\u226c","\ud505","\ud51f","\u22c2","\u25ef","\u22c3","\u2a00","\u2a01","\u2a02","\u2a06","\u2605","\u25bd","\u25b3","\u2a04","\u22c1","\u22c0","\u290d","\u29eb","\u25aa","\u25b4","\u25be","\u25c2","\u25b8","\u2423","\u2592","\u2591","\u2593","\u2588","","\u2261\u20e5","\u2aed","\u2310","\ud539","\ud553","\u22a5","\u22a5","\u22c8","\u29c9","\u2510","\u2555","\u2556","\u2557","\u250c","\u2552","\u2553","\u2554","\u2500","\u2550","\u252c","\u2564","\u2565","\u2566","\u2534","\u2567","\u2568","\u2569","\u229f","\u229e","\u22a0","\u2518","\u255b","\u255c","\u255d","\u2514","\u2558","\u2559","\u255a","\u2502","\u2551","\u253c","\u256a","\u256b","\u256c","\u2524","\u2561","\u2562","\u2563","\u251c","\u255e","\u255f","\u2560","\u2035","\u02d8","\u02d8","\u00a6","\ud4b7","\u212c","\u204f","\u223d","\u22cd","\u29c5","\\","\u27c8","\u2022","\u2022","\u224e","\u2aae","\u224f","\u224e","\u224f","\u0106","\u0107","\u2a44","\u2a49","\u2a4b","\u2229","\u22d2","\u2a47","\u2a40","\u2145","\u2229\ufe00","\u2041","\u02c7","\u212d","\u2a4d","\u010c","\u010d","\u00c7","\u00e7","\u0108","\u0109","\u2230","\u2a4c","\u2a50","\u010a","\u010b","\u00b8","\u00b8","\u29b2","\u00a2","\u00b7","\u00b7","\ud520","\u212d","\u0427","\u0447","\u2713","\u2713","\u03a7","\u03c7","\u02c6","\u2257","\u21ba","\u21bb","\u229b","\u229a","\u229d","\u2299","\u00ae","\u24c8","\u2296","\u2295","\u2297","\u25cb","\u29c3","\u2257","\u2a10","\u2aef","\u29c2","\u2232","\u201d","\u2019","\u2663","\u2663",":","\u2237","\u2a74","\u2254","\u2254",",","@","\u2201","\u2218","\u2201","\u2102","\u2245","\u2a6d","\u2261","\u222e","\u222f","\u222e","\ud554","\u2102","\u2210","\u2210","\u00a9","\u00a9","\u2117","\u2233","\u21b5","\u2717","\u2a2f","\ud49e","\ud4b8","\u2acf","\u2ad1","\u2ad0","\u2ad2","\u22ef","\u2938","\u2935","\u22de","\u22df","\u21b6","\u293d","\u2a48","\u2a46","\u224d","\u222a","\u22d3","\u2a4a","\u228d","\u2a45","\u222a\ufe00","\u21b7","\u293c","\u22de","\u22df","\u22ce","\u22cf","\u00a4","\u21b6","\u21b7","\u22ce","\u22cf","\u2232","\u2231","\u232d","\u2020","\u2021","\u2138","\u2193","\u21a1","\u21d3","\u2010","\u2ae4","\u22a3","\u290f","\u02dd","\u010e","\u010f","\u0414","\u0434","\u2021","\u21ca","\u2145","\u2146","\u2911","\u2a77","\u00b0","\u2207","\u0394","\u03b4","\u29b1","\u297f","\ud507","\ud521","\u2965","\u21c3","\u21c2","\u00b4","\u02d9","\u02dd","`","\u02dc","\u22c4","\u22c4","\u22c4","\u2666","\u2666","\u00a8","\u2146","\u03dd","\u22f2","\u00f7","\u00f7","\u22c7","\u22c7","\u0402","\u0452","\u231e","\u230d","\$","\ud53b","\ud555","\u00a8","\u02d9","\u20dc","\u2250","\u2251","\u2250","\u2238","\u2214","\u22a1","\u2306","\u222f","\u00a8","\u21d3","\u21d0","\u21d4","\u2ae4","\u27f8","\u27fa","\u27f9","\u21d2","\u22a8","\u21d1","\u21d5","\u2225","\u2913","\u2193","\u2193","\u21d3","\u21f5","\u0311","\u21ca","\u21c3","\u21c2","\u2950","\u295e","\u2956","\u21bd","\u295f","\u2957","\u21c1","\u21a7","\u22a4","\u2910","\u231f","\u230c","\ud49f","\ud4b9","\u0405","\u0455","\u29f6","\u0110","\u0111","\u22f1","\u25bf","\u25be","\u21f5","\u296f","\u29a6","\u040f","\u045f","\u27ff","\u00c9","\u00e9","\u2a6e","\u011a","\u011b","\u00ca","\u00ea","\u2256","\u2255","\u042d","\u044d","\u2a77","\u0116","\u0117","\u2251","\u2147","\u2252","\ud508","\ud522","\u2a9a","\u00c8","\u00e8","\u2a96","\u2a98","\u2a99","\u2208","\u23e7","\u2113","\u2a95","\u2a97","\u0112","\u0113","\u2205","\u2205","\u25fb","\u2205","\u25ab","\u2004","\u2005","\u2003","\u014a","\u014b","\u2002","\u0118","\u0119","\ud53c","\ud556","\u22d5","\u29e3","\u2a71","\u03b5","\u0395","\u03b5","\u03f5","\u2256","\u2255","\u2242","\u2a96","\u2a95","\u2a75","","\u2242","\u225f","\u21cc","\u2261","\u2a78","\u29e5","\u2971","\u2253","\u212f","\u2130","\u2250","\u2a73","\u2242","\u0397","\u03b7","\u00d0","\u00f0","\u00cb","\u00eb","\u20ac","!","\u2203","\u2203","\u2130","\u2147","\u2147","\u2252","\u0424","\u0444","\u2640","\ufb03","\ufb00","\ufb04","\ud509","\ud523","\ufb01","\u25fc","\u25aa","fj","\u266d","\ufb02","\u25b1","\u0192","\ud53d","\ud557","\u2200","\u2200","\u22d4","\u2ad9","\u2131","\u2a0d","\u00bd","\u2153","\u00bc","\u2155","\u2159","\u215b","\u2154","\u2156","\u00be","\u2157","\u215c","\u2158","\u215a","\u215d","\u215e","\u2044","\u2322","\ud4bb","\u2131","\u01f5","\u0393","\u03b3","\u03dc","\u03dd","\u2a86","\u011e","\u011f","\u0122","\u011c","\u011d","\u0413","\u0433","\u0120","\u0121","\u2265","\u2267","\u2a8c","\u22db","\u2265","\u2267","\u2a7e","\u2aa9","\u2a7e","\u2a80","\u2a82","\u2a84","\u22db\ufe00","\u2a94","\ud50a","\ud524","\u226b","\u22d9","\u22d9","\u2137","\u0403","\u0453","\u2aa5","\u2277","\u2a92","\u2aa4","\u2a8a","\u2a8a","\u2a88","\u2269","\u2a88","\u2269","\u22e7","\ud53e","\ud558","`","\u2265","\u22db","\u2267","\u2aa2","\u2277","\u2a7e","\u2273","\ud4a2","\u210a","\u2273","\u2a8e","\u2a90","\u2aa7","\u2a7a",">",">","\u226b","\u22d7","\u2995","\u2a7c","\u2a86","\u2978","\u22d7","\u22db","\u2a8c","\u2277","\u2273","\u2269\ufe00","\u2269\ufe00","\u02c7","\u200a","\u00bd","\u210b","\u042a","\u044a","\u2948","\u2194","\u21d4","\u21ad","^","\u210f","\u0124","\u0125","\u2665","\u2665","\u2026","\u22b9","\ud525","\u210c","\u210b","\u2925","\u2926","\u21ff","\u223b","\u21a9","\u21aa","\ud559","\u210d","\u2015","\u2500","\ud4bd","\u210b","\u210f","\u0126","\u0127","\u224e","\u224f","\u2043","\u2010","\u00cd","\u00ed","\u2063","\u00ce","\u00ee","\u0418","\u0438","\u0130","\u0415","\u0435","\u00a1","\u21d4","\ud526","\u2111","\u00cc","\u00ec","\u2148","\u2a0c","\u222d","\u29dc","\u2129","\u0132","\u0133","\u012a","\u012b","\u2111","\u2148","\u2110","\u2111","\u0131","\u2111","\u22b7","\u01b5","\u21d2","\u2105","\u2208","\u221e","\u29dd","\u0131","\u22ba","\u222b","\u222c","\u2124","\u222b","\u22ba","\u22c2","\u2a17","\u2a3c","\u2063","\u2062","\u0401","\u0451","\u012e","\u012f","\ud540","\ud55a","\u0399","\u03b9","\u2a3c","\u00bf","\ud4be","\u2110","\u2208","\u22f5","\u22f9","\u22f4","\u22f3","\u2208","\u2062","\u0128","\u0129","\u0406","\u0456","\u00cf","\u00ef","\u0134","\u0135","\u0419","\u0439","\ud50d","\ud527","\u0237","\ud541","\ud55b","\ud4a5","\ud4bf","\u0408","\u0458","\u0404","\u0454","\u039a","\u03ba","\u03f0","\u0136","\u0137","\u041a","\u043a","\ud50e","\ud528","\u0138","\u0425","\u0445","\u040c","\u045c","\ud542","\ud55c","\ud4a6","\ud4c0","\u21da","\u0139","\u013a","\u29b4","\u2112","\u039b","\u03bb","\u27e8","\u27ea","\u2991","\u27e8","\u2a85","\u2112","\u00ab","\u21e4","\u291f","\u2190","\u219e","\u21d0","\u291d","\u21a9","\u21ab","\u2939","\u2973","\u21a2","\u2919","\u291b","\u2aab","\u2aad","\u2aad\ufe00","\u290c","\u290e","\u2772","{","[","\u298b","\u298f","\u298d","\u013d","\u013e","\u013b","\u013c","\u2308","{","\u041b","\u043b","\u2936","\u201c","\u201e","\u2967","\u294b","\u21b2","\u2264","\u2266","\u27e8","\u21e4","\u2190","\u2190","\u21d0","\u21c6","\u21a2","\u2308","\u27e6","\u2961","\u2959","\u21c3","\u230a","\u21bd","\u21bc","\u21c7","\u2194","\u2194","\u21d4","\u21c6","\u21cb","\u21ad","\u294e","\u21a4","\u22a3","\u295a","\u22cb","\u29cf","\u22b2","\u22b4","\u2951","\u2960","\u2958","\u21bf","\u2952","\u21bc","\u2a8b","\u22da","\u2264","\u2266","\u2a7d","\u2aa8","\u2a7d","\u2a7f","\u2a81","\u2a83","\u22da\ufe00","\u2a93","\u2a85","\u22d6","\u22da","\u2a8b","\u22da","\u2266","\u2276","\u2276","\u2aa1","\u2272","\u2a7d","\u2272","\u297c","\u230a","\ud50f","\ud529","\u2276","\u2a91","\u2962","\u21bd","\u21bc","\u296a","\u2584","\u0409","\u0459","\u21c7","\u226a","\u22d8","\u231e","\u21da","\u296b","\u25fa","\u013f","\u0140","\u23b0","\u23b0","\u2a89","\u2a89","\u2a87","\u2268","\u2a87","\u2268","\u22e6","\u27ec","\u21fd","\u27e6","\u27f5","\u27f5","\u27f8","\u27f7","\u27f7","\u27fa","\u27fc","\u27f6","\u27f6","\u27f9","\u21ab","\u21ac","\u2985","\ud543","\ud55d","\u2a2d","\u2a34","\u2217","_","\u2199","\u2198","\u25ca","\u25ca","\u29eb","(","\u2993","\u21c6","\u231f","\u21cb","\u296d","\u200e","\u22bf","\u2039","\ud4c1","\u2112","\u21b0","\u21b0","\u2272","\u2a8d","\u2a8f","[","\u2018","\u201a","\u0141","\u0142","\u2aa6","\u2a79","<","<","\u226a","\u22d6","\u22cb","\u22c9","\u2976","\u2a7b","\u25c3","\u22b4","\u25c2","\u2996","\u294a","\u2966","\u2268\ufe00","\u2268\ufe00","\u00af","\u2642","\u2720","\u2720","\u2905","\u21a6","\u21a6","\u21a7","\u21a4","\u21a5","\u25ae","\u2a29","\u041c","\u043c","\u2014","\u223a","\u2221","\u205f","\u2133","\ud510","\ud52a","\u2127","\u00b5","*","\u2af0","\u2223","\u00b7","\u229f","\u2212","\u2238","\u2a2a","\u2213","\u2adb","\u2026","\u2213","\u22a7","\ud544","\ud55e","\u2213","\ud4c2","\u2133","\u223e","\u039c","\u03bc","\u22b8","\u22b8","\u2207","\u0143","\u0144","\u2220\u20d2","\u2249","\u2a70\u0338","\u224b\u0338","\u0149","\u2249","\u266e","\u2115","\u266e","\u00a0","\u224e\u0338","\u224f\u0338","\u2a43","\u0147","\u0148","\u0145","\u0146","\u2247","\u2a6d\u0338","\u2a42","\u041d","\u043d","\u2013","\u2924","\u2197","\u21d7","\u2197","\u2260","\u2250\u0338","\u200b","\u200b","\u200b","\u200b","\u2262","\u2928","\u2242\u0338","\u226b","\u226a","","\u2204","\u2204","\ud511","\ud52b","\u2267\u0338","\u2271","\u2271","\u2267\u0338","\u2a7e\u0338","\u2a7e\u0338","\u22d9\u0338","\u2275","\u226b\u20d2","\u226f","\u226f","\u226b\u0338","\u21ae","\u21ce","\u2af2","\u220b","\u22fc","\u22fa","\u220b","\u040a","\u045a","\u219a","\u21cd","\u2025","\u2266\u0338","\u2270","\u219a","\u21cd","\u21ae","\u21ce","\u2270","\u2266\u0338","\u2a7d\u0338","\u2a7d\u0338","\u226e","\u22d8\u0338","\u2274","\u226a\u20d2","\u226e","\u22ea","\u22ec","\u226a\u0338","\u2224","\u2060","\u00a0","\ud55f","\u2115","\u2aec","\u00ac","\u2262","\u226d","\u2226","\u2209","\u2260","\u2242\u0338","\u2204","\u226f","\u2271","\u2267\u0338","\u226b\u0338","\u2279","\u2a7e\u0338","\u2275","\u224e\u0338","\u224f\u0338","\u2209","\u22f5\u0338","\u22f9\u0338","\u2209","\u22f7","\u22f6","\u29cf\u0338","\u22ea","\u22ec","\u226e","\u2270","\u2278","\u226a\u0338","\u2a7d\u0338","\u2274","\u2aa2\u0338","\u2aa1\u0338","\u220c","\u220c","\u22fe","\u22fd","\u2280","\u2aaf\u0338","\u22e0","\u220c","\u29d0\u0338","\u22eb","\u22ed","\u228f\u0338","\u22e2","\u2290\u0338","\u22e3","\u2282\u20d2","\u2288","\u2281","\u2ab0\u0338","\u22e1","\u227f\u0338","\u2283\u20d2","\u2289","\u2241","\u2244","\u2247","\u2249","\u2224","\u2226","\u2226","\u2afd\u20e5","\u2202\u0338","\u2a14","\u2280","\u22e0","\u2280","\u2aaf\u0338","\u2aaf\u0338","\u2933\u0338","\u219b","\u21cf","\u219d\u0338","\u219b","\u21cf","\u22eb","\u22ed","\u2281","\u22e1","\u2ab0\u0338","\ud4a9","\ud4c3","\u2224","\u2226","\u2241","\u2244","\u2244","\u2224","\u2226","\u22e2","\u22e3","\u2284","\u2ac5\u0338","\u2288","\u2282\u20d2","\u2288","\u2ac5\u0338","\u2281","\u2ab0\u0338","\u2285","\u2ac6\u0338","\u2289","\u2283\u20d2","\u2289","\u2ac6\u0338","\u2279","\u00d1","\u00f1","\u2278","\u22ea","\u22ec","\u22eb","\u22ed","\u039d","\u03bd","#","\u2116","\u2007","\u224d\u20d2","\u22ac","\u22ad","\u22ae","\u22af","\u2265\u20d2",">\u20d2","\u2904","\u29de","\u2902","\u2264\u20d2","<\u20d2","\u22b4\u20d2","\u2903","\u22b5\u20d2","\u223c\u20d2","\u2923","\u2196","\u21d6","\u2196","\u2927","\u00d3","\u00f3","\u229b","\u00d4","\u00f4","\u229a","\u041e","\u043e","\u229d","\u0150","\u0151","\u2a38","\u2299","\u29bc","\u0152","\u0153","\u29bf","\ud512","\ud52c","\u02db","\u00d2","\u00f2","\u29c1","\u29b5","\u03a9","\u222e","\u21ba","\u29be","\u29bb","\u203e","\u29c0","\u014c","\u014d","\u03a9","\u03c9","\u039f","\u03bf","\u29b6","\u2296","\ud546","\ud560","\u29b7","\u201c","\u2018","\u29b9","\u2295","\u21bb","\u2a54","\u2228","\u2a5d","\u2134","\u2134","\u00aa","\u00ba","\u22b6","\u2a56","\u2a57","\u2a5b","\u24c8","\ud4aa","\u2134","\u00d8","\u00f8","\u2298","\u00d5","\u00f5","\u2a36","\u2a37","\u2297","\u00d6","\u00f6","\u233d","\u203e","\u23de","\u23b4","\u23dc","\u00b6","\u2225","\u2225","\u2af3","\u2afd","\u2202","\u2202","\u041f","\u043f","%",".","\u2030","\u22a5","\u2031","\ud513","\ud52d","\u03a6","\u03c6","\u03d5","\u2133","\u260e","\u03a0","\u03c0","\u22d4","\u03d6","\u210f","\u210e","\u210f","\u2a23","\u229e","\u2a22","+","\u2214","\u2a25","\u2a72","\u00b1","\u00b1","\u2a26","\u2a27","\u00b1","\u210c","\u2a15","\ud561","\u2119","\u00a3","\u2ab7","\u2abb","\u227a","\u227c","\u2ab7","\u227a","\u227c","\u227a","\u2aaf","\u227c","\u227e","\u2aaf","\u2ab9","\u2ab5","\u22e8","\u2aaf","\u2ab3","\u227e","\u2032","\u2033","\u2119","\u2ab9","\u2ab5","\u22e8","\u220f","\u220f","\u232e","\u2312","\u2313","\u221d","\u221d","\u2237","\u221d","\u227e","\u22b0","\ud4ab","\ud4c5","\u03a8","\u03c8","\u2008","\ud514","\ud52e","\u2a0c","\ud562","\u211a","\u2057","\ud4ac","\ud4c6","\u210d","\u2a16","?","\u225f","\"","\"","\u21db","\u223d\u0331","\u0154","\u0155","\u221a","\u29b3","\u27e9","\u27eb","\u2992","\u29a5","\u27e9","\u00bb","\u2975","\u21e5","\u2920","\u2933","\u2192","\u21a0","\u21d2","\u291e","\u21aa","\u21ac","\u2945","\u2974","\u2916","\u21a3","\u219d","\u291a","\u291c","\u2236","\u211a","\u290d","\u290f","\u2910","\u2773","}","]","\u298c","\u298e","\u2990","\u0158","\u0159","\u0156","\u0157","\u2309","}","\u0420","\u0440","\u2937","\u2969","\u201d","\u201d","\u21b3","\u211c","\u211b","\u211c","\u211d","\u211c","\u25ad","\u00ae","\u00ae","\u220b","\u21cb","\u296f","\u297d","\u230b","\ud52f","\u211c","\u2964","\u21c1","\u21c0","\u296c","\u03a1","\u03c1","\u03f1","\u27e9","\u21e5","\u2192","\u2192","\u21d2","\u21c4","\u21a3","\u2309","\u27e7","\u295d","\u2955","\u21c2","\u230b","\u21c1","\u21c0","\u21c4","\u21cc","\u21c9","\u219d","\u21a6","\u22a2","\u295b","\u22cc","\u29d0","\u22b3","\u22b5","\u294f","\u295c","\u2954","\u21be","\u2953","\u21c0","\u02da","\u2253","\u21c4","\u21cc","\u200f","\u23b1","\u23b1","\u2aee","\u27ed","\u21fe","\u27e7","\u2986","\ud563","\u211d","\u2a2e","\u2a35","\u2970",")","\u2994","\u2a12","\u21c9","\u21db","\u203a","\ud4c7","\u211b","\u21b1","\u21b1","]","\u2019","\u2019","\u22cc","\u22ca","\u25b9","\u22b5","\u25b8","\u29ce","\u29f4","\u2968","\u211e","\u015a","\u015b","\u201a","\u2ab8","\u0160","\u0161","\u2abc","\u227b","\u227d","\u2ab0","\u2ab4","\u015e","\u015f","\u015c","\u015d","\u2aba","\u2ab6","\u22e9","\u2a13","\u227f","\u0421","\u0441","\u22a1","\u22c5","\u2a66","\u2925","\u2198","\u21d8","\u2198","\u00a7",";","\u2929","\u2216","\u2216","\u2736","\ud516","\ud530","\u2322","\u266f","\u0429","\u0449","\u0428","\u0448","\u2193","\u2190","\u2223","\u2225","\u2192","\u2191","\u00ad","\u03a3","\u03c3","\u03c2","\u03c2","\u223c","\u2a6a","\u2243","\u2243","\u2a9e","\u2aa0","\u2a9d","\u2a9f","\u2246","\u2a24","\u2972","\u2190","\u2218","\u2216","\u2a33","\u29e4","\u2223","\u2323","\u2aaa","\u2aac","\u2aac\ufe00","\u042c","\u044c","\u233f","\u29c4","/","\ud54a","\ud564","\u2660","\u2660","\u2225","\u2293","\u2293\ufe00","\u2294","\u2294\ufe00","\u221a","\u228f","\u2291","\u228f","\u2291","\u2290","\u2292","\u2290","\u2292","\u25a1","\u25a1","\u2293","\u228f","\u2291","\u2290","\u2292","\u2294","\u25aa","\u25a1","\u25aa","\u2192","\ud4ae","\ud4c8","\u2216","\u2323","\u22c6","\u22c6","\u2606","\u2605","\u03f5","\u03d5","\u00af","\u2282","\u22d0","\u2abd","\u2ac5","\u2286","\u2ac3","\u2ac1","\u2acb","\u228a","\u2abf","\u2979","\u2282","\u22d0","\u2286","\u2ac5","\u2286","\u228a","\u2acb","\u2ac7","\u2ad5","\u2ad3","\u2ab8","\u227b","\u227d","\u227b","\u2ab0","\u227d","\u227f","\u2ab0","\u2aba","\u2ab6","\u22e9","\u227f","\u220b","\u2211","\u2211","\u266a","\u00b9","\u00b2","\u00b3","\u2283","\u22d1","\u2abe","\u2ad8","\u2ac6","\u2287","\u2ac4","\u2283","\u2287","\u27c9","\u2ad7","\u297b","\u2ac2","\u2acc","\u228b","\u2ac0","\u2283","\u22d1","\u2287","\u2ac6","\u228b","\u2acc","\u2ac8","\u2ad4","\u2ad6","\u2926","\u2199","\u21d9","\u2199","\u292a","\u00df","","\u2316","\u03a4","\u03c4","\u23b4","\u0164","\u0165","\u0162","\u0163","\u0422","\u0442","\u20db","\u2315","\ud517","\ud531","\u2234","\u2234","\u2234","\u0398","\u03b8","\u03d1","\u03d1","\u2248","\u223c","\u205f\u200a","\u2009","\u2009","\u2248","\u223c","\u00de","\u00fe","\u02dc","\u223c","\u2243","\u2245","\u2248","\u2a31","\u22a0","\u00d7","\u2a30","\u222d","\u2928","\u2336","\u2af1","\u22a4","\ud54b","\ud565","\u2ada","\u2929","\u2034","\u2122","\u2122","\u25b5","\u25bf","\u25c3","\u22b4","\u225c","\u25b9","\u22b5","\u25ec","\u225c","\u2a3a","\u20db","\u2a39","\u29cd","\u2a3b","\u23e2","\ud4af","\ud4c9","\u0426","\u0446","\u040b","\u045b","\u0166","\u0167","\u226c","\u219e","\u21a0","\u00da","\u00fa","\u2191","\u219f","\u21d1","\u2949","\u040e","\u045e","\u016c","\u016d","\u00db","\u00fb","\u0423","\u0443","\u21c5","\u0170","\u0171","\u296e","\u297e","\ud518","\ud532","\u00d9","\u00f9","\u2963","\u21bf","\u21be","\u2580","\u231c","\u231c","\u230f","\u25f8","\u016a","\u016b","\u00a8","_","\u23df","\u23b5","\u23dd","\u22c3","\u228e","\u0172","\u0173","\ud54c","\ud566","\u2912","\u2191","\u2191","\u21d1","\u21c5","\u2195","\u2195","\u21d5","\u296e","\u21bf","\u21be","\u228e","\u2196","\u2197","\u03c5","\u03d2","\u03d2","\u03a5","\u03c5","\u21a5","\u22a5","\u21c8","\u231d","\u231d","\u230e","\u016e","\u016f","\u25f9","\ud4b0","\ud4ca","\u22f0","\u0168","\u0169","\u25b5","\u25b4","\u21c8","\u00dc","\u00fc","\u29a7","\u299c","\u03f5","\u03f0","\u2205","\u03d5","\u03d6","\u221d","\u2195","\u21d5","\u03f1","\u03c2","\u228a\ufe00","\u2acb\ufe00","\u228b\ufe00","\u2acc\ufe00","\u03d1","\u22b2","\u22b3","\u2ae8","\u2aeb","\u2ae9","\u0412","\u0432","\u22a2","\u22a8","\u22a9","\u22ab","\u2ae6","\u22bb","\u2228","\u22c1","\u225a","\u22ee","|","\u2016","|","\u2016","\u2223","|","\u2758","\u2240","\u200a","\ud519","\ud533","\u22b2","\u2282\u20d2","\u2283\u20d2","\ud54d","\ud567","\u221d","\u22b3","\ud4b1","\ud4cb","\u2acb\ufe00","\u228a\ufe00","\u2acc\ufe00","\u228b\ufe00","\u22aa","\u299a","\u0174","\u0175","\u2a5f","\u2227","\u22c0","\u2259","\u2118","\ud51a","\ud534","\ud54e","\ud568","\u2118","\u2240","\u2240","\ud4b2","\ud4cc","\u22c2","\u25ef","\u22c3","\u25bd","\ud51b","\ud535","\u27f7","\u27fa","\u039e","\u03be","\u27f5","\u27f8","\u27fc","\u22fb","\u2a00","\ud54f","\ud569","\u2a01","\u2a02","\u27f6","\u27f9","\ud4b3","\ud4cd","\u2a06","\u2a04","\u25b3","\u22c1","\u22c0","\u00dd","\u00fd","\u042f","\u044f","\u0176","\u0177","\u042b","\u044b","\u00a5","\ud51c","\ud536","\u0407","\u0457","\ud550","\ud56a","\ud4b4","\ud4ce","\u042e","\u044e","\u00ff","\u0178","\u0179","\u017a","\u017d","\u017e","\u0417","\u0437","\u017b","\u017c","\u2128","\u200b","\u0396","\u03b6","\ud537","\u2128","\u0416","\u0436","\u21dd","\ud56b","\u2124","\ud4b5","\ud4cf","\u200d","\u200c","\n"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u110 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["Aacute","aacute","Abreve","abreve","ac","acd","acE","Acirc","acirc","acute","Acy","acy","AElig","aelig","af","Afr","afr","Agrave","agrave","alefsym","aleph","Alpha","alpha","Amacr","amacr","amalg","amp","AMP","andand","And","and","andd","andslope","andv","ang","ange","angle","angmsdaa","angmsdab","angmsdac","angmsdad","angmsdae","angmsdaf","angmsdag","angmsdah","angmsd","angrt","angrtvb","angrtvbd","angsph","angst","angzarr","Aogon","aogon","Aopf","aopf","apacir","ap","apE","ape","apid","apos","ApplyFunction","approx","approxeq","Aring","aring","Ascr","ascr","Assign","ast","asymp","asympeq","Atilde","atilde","Auml","auml","awconint","awint","backcong","backepsilon","backprime","backsim","backsimeq","Backslash","Barv","barvee","barwed","Barwed","barwedge","bbrk","bbrktbrk","bcong","Bcy","bcy","bdquo","becaus","because","Because","bemptyv","bepsi","bernou","Bernoullis","Beta","beta","beth","between","Bfr","bfr","bigcap","bigcirc","bigcup","bigodot","bigoplus","bigotimes","bigsqcup","bigstar","bigtriangledown","bigtriangleup","biguplus","bigvee","bigwedge","bkarow","blacklozenge","blacksquare","blacktriangle","blacktriangledown","blacktriangleleft","blacktriangleright","blank","blk12","blk14","blk34","block","bne","bnequiv","bNot","bnot","Bopf","bopf","bot","bottom","bowtie","boxbox","boxdl","boxdL","boxDl","boxDL","boxdr","boxdR","boxDr","boxDR","boxh","boxH","boxhd","boxHd","boxhD","boxHD","boxhu","boxHu","boxhU","boxHU","boxminus","boxplus","boxtimes","boxul","boxuL","boxUl","boxUL","boxur","boxuR","boxUr","boxUR","boxv","boxV","boxvh","boxvH","boxVh","boxVH","boxvl","boxvL","boxVl","boxVL","boxvr","boxvR","boxVr","boxVR","bprime","breve","Breve","brvbar","bscr","Bscr","bsemi","bsim","bsime","bsolb","bsol","bsolhsub","bull","bullet","bump","bumpE","bumpe","Bumpeq","bumpeq","Cacute","cacute","capand","capbrcup","capcap","cap","Cap","capcup","capdot","CapitalDifferentialD","caps","caret","caron","Cayleys","ccaps","Ccaron","ccaron","Ccedil","ccedil","Ccirc","ccirc","Cconint","ccups","ccupssm","Cdot","cdot","cedil","Cedilla","cemptyv","cent","centerdot","CenterDot","cfr","Cfr","CHcy","chcy","check","checkmark","Chi","chi","circ","circeq","circlearrowleft","circlearrowright","circledast","circledcirc","circleddash","CircleDot","circledR","circledS","CircleMinus","CirclePlus","CircleTimes","cir","cirE","cire","cirfnint","cirmid","cirscir","ClockwiseContourIntegral","CloseCurlyDoubleQuote","CloseCurlyQuote","clubs","clubsuit","colon","Colon","Colone","colone","coloneq","comma","commat","comp","compfn","complement","complexes","cong","congdot","Congruent","conint","Conint","ContourIntegral","copf","Copf","coprod","Coproduct","copy","COPY","copysr","CounterClockwiseContourIntegral","crarr","cross","Cross","Cscr","cscr","csub","csube","csup","csupe","ctdot","cudarrl","cudarrr","cuepr","cuesc","cularr","cularrp","cupbrcap","cupcap","CupCap","cup","Cup","cupcup","cupdot","cupor","cups","curarr","curarrm","curlyeqprec","curlyeqsucc","curlyvee","curlywedge","curren","curvearrowleft","curvearrowright","cuvee","cuwed","cwconint","cwint","cylcty","dagger","Dagger","daleth","darr","Darr","dArr","dash","Dashv","dashv","dbkarow","dblac","Dcaron","dcaron","Dcy","dcy","ddagger","ddarr","DD","dd","DDotrahd","ddotseq","deg","Del","Delta","delta","demptyv","dfisht","Dfr","dfr","dHar","dharl","dharr","DiacriticalAcute","DiacriticalDot","DiacriticalDoubleAcute","DiacriticalGrave","DiacriticalTilde","diam","diamond","Diamond","diamondsuit","diams","die","DifferentialD","digamma","disin","div","divide","divideontimes","divonx","DJcy","djcy","dlcorn","dlcrop","dollar","Dopf","dopf","Dot","dot","DotDot","doteq","doteqdot","DotEqual","dotminus","dotplus","dotsquare","doublebarwedge","DoubleContourIntegral","DoubleDot","DoubleDownArrow","DoubleLeftArrow","DoubleLeftRightArrow","DoubleLeftTee","DoubleLongLeftArrow","DoubleLongLeftRightArrow","DoubleLongRightArrow","DoubleRightArrow","DoubleRightTee","DoubleUpArrow","DoubleUpDownArrow","DoubleVerticalBar","DownArrowBar","downarrow","DownArrow","Downarrow","DownArrowUpArrow","DownBreve","downdownarrows","downharpoonleft","downharpoonright","DownLeftRightVector","DownLeftTeeVector","DownLeftVectorBar","DownLeftVector","DownRightTeeVector","DownRightVectorBar","DownRightVector","DownTeeArrow","DownTee","drbkarow","drcorn","drcrop","Dscr","dscr","DScy","dscy","dsol","Dstrok","dstrok","dtdot","dtri","dtrif","duarr","duhar","dwangle","DZcy","dzcy","dzigrarr","Eacute","eacute","easter","Ecaron","ecaron","Ecirc","ecirc","ecir","ecolon","Ecy","ecy","eDDot","Edot","edot","eDot","ee","efDot","Efr","efr","eg","Egrave","egrave","egs","egsdot","el","Element","elinters","ell","els","elsdot","Emacr","emacr","empty","emptyset","EmptySmallSquare","emptyv","EmptyVerySmallSquare","emsp13","emsp14","emsp","ENG","eng","ensp","Eogon","eogon","Eopf","eopf","epar","eparsl","eplus","epsi","Epsilon","epsilon","epsiv","eqcirc","eqcolon","eqsim","eqslantgtr","eqslantless","Equal","equals","EqualTilde","equest","Equilibrium","equiv","equivDD","eqvparsl","erarr","erDot","escr","Escr","esdot","Esim","esim","Eta","eta","ETH","eth","Euml","euml","euro","excl","exist","Exists","expectation","exponentiale","ExponentialE","fallingdotseq","Fcy","fcy","female","ffilig","fflig","ffllig","Ffr","ffr","filig","FilledSmallSquare","FilledVerySmallSquare","fjlig","flat","fllig","fltns","fnof","Fopf","fopf","forall","ForAll","fork","forkv","Fouriertrf","fpartint","frac12","frac13","frac14","frac15","frac16","frac18","frac23","frac25","frac34","frac35","frac38","frac45","frac56","frac58","frac78","frasl","frown","fscr","Fscr","gacute","Gamma","gamma","Gammad","gammad","gap","Gbreve","gbreve","Gcedil","Gcirc","gcirc","Gcy","gcy","Gdot","gdot","ge","gE","gEl","gel","geq","geqq","geqslant","gescc","ges","gesdot","gesdoto","gesdotol","gesl","gesles","Gfr","gfr","gg","Gg","ggg","gimel","GJcy","gjcy","gla","gl","glE","glj","gnap","gnapprox","gne","gnE","gneq","gneqq","gnsim","Gopf","gopf","grave","GreaterEqual","GreaterEqualLess","GreaterFullEqual","GreaterGreater","GreaterLess","GreaterSlantEqual","GreaterTilde","Gscr","gscr","gsim","gsime","gsiml","gtcc","gtcir","gt","GT","Gt","gtdot","gtlPar","gtquest","gtrapprox","gtrarr","gtrdot","gtreqless","gtreqqless","gtrless","gtrsim","gvertneqq","gvnE","Hacek","hairsp","half","hamilt","HARDcy","hardcy","harrcir","harr","hArr","harrw","Hat","hbar","Hcirc","hcirc","hearts","heartsuit","hellip","hercon","hfr","Hfr","HilbertSpace","hksearow","hkswarow","hoarr","homtht","hookleftarrow","hookrightarrow","hopf","Hopf","horbar","HorizontalLine","hscr","Hscr","hslash","Hstrok","hstrok","HumpDownHump","HumpEqual","hybull","hyphen","Iacute","iacute","ic","Icirc","icirc","Icy","icy","Idot","IEcy","iecy","iexcl","iff","ifr","Ifr","Igrave","igrave","ii","iiiint","iiint","iinfin","iiota","IJlig","ijlig","Imacr","imacr","image","ImaginaryI","imagline","imagpart","imath","Im","imof","imped","Implies","incare","in","infin","infintie","inodot","intcal","int","Int","integers","Integral","intercal","Intersection","intlarhk","intprod","InvisibleComma","InvisibleTimes","IOcy","iocy","Iogon","iogon","Iopf","iopf","Iota","iota","iprod","iquest","iscr","Iscr","isin","isindot","isinE","isins","isinsv","isinv","it","Itilde","itilde","Iukcy","iukcy","Iuml","iuml","Jcirc","jcirc","Jcy","jcy","Jfr","jfr","jmath","Jopf","jopf","Jscr","jscr","Jsercy","jsercy","Jukcy","jukcy","Kappa","kappa","kappav","Kcedil","kcedil","Kcy","kcy","Kfr","kfr","kgreen","KHcy","khcy","KJcy","kjcy","Kopf","kopf","Kscr","kscr","lAarr","Lacute","lacute","laemptyv","lagran","Lambda","lambda","lang","Lang","langd","langle","lap","Laplacetrf","laquo","larrb","larrbfs","larr","Larr","lArr","larrfs","larrhk","larrlp","larrpl","larrsim","larrtl","latail","lAtail","lat","late","lates","lbarr","lBarr","lbbrk","lbrace","lbrack","lbrke","lbrksld","lbrkslu","Lcaron","lcaron","Lcedil","lcedil","lceil","lcub","Lcy","lcy","ldca","ldquo","ldquor","ldrdhar","ldrushar","ldsh","le","lE","LeftAngleBracket","LeftArrowBar","leftarrow","LeftArrow","Leftarrow","LeftArrowRightArrow","leftarrowtail","LeftCeiling","LeftDoubleBracket","LeftDownTeeVector","LeftDownVectorBar","LeftDownVector","LeftFloor","leftharpoondown","leftharpoonup","leftleftarrows","leftrightarrow","LeftRightArrow","Leftrightarrow","leftrightarrows","leftrightharpoons","leftrightsquigarrow","LeftRightVector","LeftTeeArrow","LeftTee","LeftTeeVector","leftthreetimes","LeftTriangleBar","LeftTriangle","LeftTriangleEqual","LeftUpDownVector","LeftUpTeeVector","LeftUpVectorBar","LeftUpVector","LeftVectorBar","LeftVector","lEg","leg","leq","leqq","leqslant","lescc","les","lesdot","lesdoto","lesdotor","lesg","lesges","lessapprox","lessdot","lesseqgtr","lesseqqgtr","LessEqualGreater","LessFullEqual","LessGreater","lessgtr","LessLess","lesssim","LessSlantEqual","LessTilde","lfisht","lfloor","Lfr","lfr","lg","lgE","lHar","lhard","lharu","lharul","lhblk","LJcy","ljcy","llarr","ll","Ll","llcorner","Lleftarrow","llhard","lltri","Lmidot","lmidot","lmoustache","lmoust","lnap","lnapprox","lne","lnE","lneq","lneqq","lnsim","loang","loarr","lobrk","longleftarrow","LongLeftArrow","Longleftarrow","longleftrightarrow","LongLeftRightArrow","Longleftrightarrow","longmapsto","longrightarrow","LongRightArrow","Longrightarrow","looparrowleft","looparrowright","lopar","Lopf","lopf","loplus","lotimes","lowast","lowbar","LowerLeftArrow","LowerRightArrow","loz","lozenge","lozf","lpar","lparlt","lrarr","lrcorner","lrhar","lrhard","lrm","lrtri","lsaquo","lscr","Lscr","lsh","Lsh","lsim","lsime","lsimg","lsqb","lsquo","lsquor","Lstrok","lstrok","ltcc","ltcir","lt","LT","Lt","ltdot","lthree","ltimes","ltlarr","ltquest","ltri","ltrie","ltrif","ltrPar","lurdshar","luruhar","lvertneqq","lvnE","macr","male","malt","maltese","Map","map","mapsto","mapstodown","mapstoleft","mapstoup","marker","mcomma","Mcy","mcy","mdash","mDDot","measuredangle","MediumSpace","Mellintrf","Mfr","mfr","mho","micro","midast","midcir","mid","middot","minusb","minus","minusd","minusdu","MinusPlus","mlcp","mldr","mnplus","models","Mopf","mopf","mp","mscr","Mscr","mstpos","Mu","mu","multimap","mumap","nabla","Nacute","nacute","nang","nap","napE","napid","napos","napprox","natural","naturals","natur","nbsp","nbump","nbumpe","ncap","Ncaron","ncaron","Ncedil","ncedil","ncong","ncongdot","ncup","Ncy","ncy","ndash","nearhk","nearr","neArr","nearrow","ne","nedot","NegativeMediumSpace","NegativeThickSpace","NegativeThinSpace","NegativeVeryThinSpace","nequiv","nesear","nesim","NestedGreaterGreater","NestedLessLess","NewLine","nexist","nexists","Nfr","nfr","ngE","nge","ngeq","ngeqq","ngeqslant","nges","nGg","ngsim","nGt","ngt","ngtr","nGtv","nharr","nhArr","nhpar","ni","nis","nisd","niv","NJcy","njcy","nlarr","nlArr","nldr","nlE","nle","nleftarrow","nLeftarrow","nleftrightarrow","nLeftrightarrow","nleq","nleqq","nleqslant","nles","nless","nLl","nlsim","nLt","nlt","nltri","nltrie","nLtv","nmid","NoBreak","NonBreakingSpace","nopf","Nopf","Not","not","NotCongruent","NotCupCap","NotDoubleVerticalBar","NotElement","NotEqual","NotEqualTilde","NotExists","NotGreater","NotGreaterEqual","NotGreaterFullEqual","NotGreaterGreater","NotGreaterLess","NotGreaterSlantEqual","NotGreaterTilde","NotHumpDownHump","NotHumpEqual","notin","notindot","notinE","notinva","notinvb","notinvc","NotLeftTriangleBar","NotLeftTriangle","NotLeftTriangleEqual","NotLess","NotLessEqual","NotLessGreater","NotLessLess","NotLessSlantEqual","NotLessTilde","NotNestedGreaterGreater","NotNestedLessLess","notni","notniva","notnivb","notnivc","NotPrecedes","NotPrecedesEqual","NotPrecedesSlantEqual","NotReverseElement","NotRightTriangleBar","NotRightTriangle","NotRightTriangleEqual","NotSquareSubset","NotSquareSubsetEqual","NotSquareSuperset","NotSquareSupersetEqual","NotSubset","NotSubsetEqual","NotSucceeds","NotSucceedsEqual","NotSucceedsSlantEqual","NotSucceedsTilde","NotSuperset","NotSupersetEqual","NotTilde","NotTildeEqual","NotTildeFullEqual","NotTildeTilde","NotVerticalBar","nparallel","npar","nparsl","npart","npolint","npr","nprcue","nprec","npreceq","npre","nrarrc","nrarr","nrArr","nrarrw","nrightarrow","nRightarrow","nrtri","nrtrie","nsc","nsccue","nsce","Nscr","nscr","nshortmid","nshortparallel","nsim","nsime","nsimeq","nsmid","nspar","nsqsube","nsqsupe","nsub","nsubE","nsube","nsubset","nsubseteq","nsubseteqq","nsucc","nsucceq","nsup","nsupE","nsupe","nsupset","nsupseteq","nsupseteqq","ntgl","Ntilde","ntilde","ntlg","ntriangleleft","ntrianglelefteq","ntriangleright","ntrianglerighteq","Nu","nu","num","numero","numsp","nvap","nvdash","nvDash","nVdash","nVDash","nvge","nvgt","nvHarr","nvinfin","nvlArr","nvle","nvlt","nvltrie","nvrArr","nvrtrie","nvsim","nwarhk","nwarr","nwArr","nwarrow","nwnear","Oacute","oacute","oast","Ocirc","ocirc","ocir","Ocy","ocy","odash","Odblac","odblac","odiv","odot","odsold","OElig","oelig","ofcir","Ofr","ofr","ogon","Ograve","ograve","ogt","ohbar","ohm","oint","olarr","olcir","olcross","oline","olt","Omacr","omacr","Omega","omega","Omicron","omicron","omid","ominus","Oopf","oopf","opar","OpenCurlyDoubleQuote","OpenCurlyQuote","operp","oplus","orarr","Or","or","ord","order","orderof","ordf","ordm","origof","oror","orslope","orv","oS","Oscr","oscr","Oslash","oslash","osol","Otilde","otilde","otimesas","Otimes","otimes","Ouml","ouml","ovbar","OverBar","OverBrace","OverBracket","OverParenthesis","para","parallel","par","parsim","parsl","part","PartialD","Pcy","pcy","percnt","period","permil","perp","pertenk","Pfr","pfr","Phi","phi","phiv","phmmat","phone","Pi","pi","pitchfork","piv","planck","planckh","plankv","plusacir","plusb","pluscir","plus","plusdo","plusdu","pluse","PlusMinus","plusmn","plussim","plustwo","pm","Poincareplane","pointint","popf","Popf","pound","prap","Pr","pr","prcue","precapprox","prec","preccurlyeq","Precedes","PrecedesEqual","PrecedesSlantEqual","PrecedesTilde","preceq","precnapprox","precneqq","precnsim","pre","prE","precsim","prime","Prime","primes","prnap","prnE","prnsim","prod","Product","profalar","profline","profsurf","prop","Proportional","Proportion","propto","prsim","prurel","Pscr","pscr","Psi","psi","puncsp","Qfr","qfr","qint","qopf","Qopf","qprime","Qscr","qscr","quaternions","quatint","quest","questeq","quot","QUOT","rAarr","race","Racute","racute","radic","raemptyv","rang","Rang","rangd","range","rangle","raquo","rarrap","rarrb","rarrbfs","rarrc","rarr","Rarr","rArr","rarrfs","rarrhk","rarrlp","rarrpl","rarrsim","Rarrtl","rarrtl","rarrw","ratail","rAtail","ratio","rationals","rbarr","rBarr","RBarr","rbbrk","rbrace","rbrack","rbrke","rbrksld","rbrkslu","Rcaron","rcaron","Rcedil","rcedil","rceil","rcub","Rcy","rcy","rdca","rdldhar","rdquo","rdquor","rdsh","real","realine","realpart","reals","Re","rect","reg","REG","ReverseElement","ReverseEquilibrium","ReverseUpEquilibrium","rfisht","rfloor","rfr","Rfr","rHar","rhard","rharu","rharul","Rho","rho","rhov","RightAngleBracket","RightArrowBar","rightarrow","RightArrow","Rightarrow","RightArrowLeftArrow","rightarrowtail","RightCeiling","RightDoubleBracket","RightDownTeeVector","RightDownVectorBar","RightDownVector","RightFloor","rightharpoondown","rightharpoonup","rightleftarrows","rightleftharpoons","rightrightarrows","rightsquigarrow","RightTeeArrow","RightTee","RightTeeVector","rightthreetimes","RightTriangleBar","RightTriangle","RightTriangleEqual","RightUpDownVector","RightUpTeeVector","RightUpVectorBar","RightUpVector","RightVectorBar","RightVector","ring","risingdotseq","rlarr","rlhar","rlm","rmoustache","rmoust","rnmid","roang","roarr","robrk","ropar","ropf","Ropf","roplus","rotimes","RoundImplies","rpar","rpargt","rppolint","rrarr","Rrightarrow","rsaquo","rscr","Rscr","rsh","Rsh","rsqb","rsquo","rsquor","rthree","rtimes","rtri","rtrie","rtrif","rtriltri","RuleDelayed","ruluhar","rx","Sacute","sacute","sbquo","scap","Scaron","scaron","Sc","sc","sccue","sce","scE","Scedil","scedil","Scirc","scirc","scnap","scnE","scnsim","scpolint","scsim","Scy","scy","sdotb","sdot","sdote","searhk","searr","seArr","searrow","sect","semi","seswar","setminus","setmn","sext","Sfr","sfr","sfrown","sharp","SHCHcy","shchcy","SHcy","shcy","ShortDownArrow","ShortLeftArrow","shortmid","shortparallel","ShortRightArrow","ShortUpArrow","shy","Sigma","sigma","sigmaf","sigmav","sim","simdot","sime","simeq","simg","simgE","siml","simlE","simne","simplus","simrarr","slarr","SmallCircle","smallsetminus","smashp","smeparsl","smid","smile","smt","smte","smtes","SOFTcy","softcy","solbar","solb","sol","Sopf","sopf","spades","spadesuit","spar","sqcap","sqcaps","sqcup","sqcups","Sqrt","sqsub","sqsube","sqsubset","sqsubseteq","sqsup","sqsupe","sqsupset","sqsupseteq","square","Square","SquareIntersection","SquareSubset","SquareSubsetEqual","SquareSuperset","SquareSupersetEqual","SquareUnion","squarf","squ","squf","srarr","Sscr","sscr","ssetmn","ssmile","sstarf","Star","star","starf","straightepsilon","straightphi","strns","sub","Sub","subdot","subE","sube","subedot","submult","subnE","subne","subplus","subrarr","subset","Subset","subseteq","subseteqq","SubsetEqual","subsetneq","subsetneqq","subsim","subsub","subsup","succapprox","succ","succcurlyeq","Succeeds","SucceedsEqual","SucceedsSlantEqual","SucceedsTilde","succeq","succnapprox","succneqq","succnsim","succsim","SuchThat","sum","Sum","sung","sup1","sup2","sup3","sup","Sup","supdot","supdsub","supE","supe","supedot","Superset","SupersetEqual","suphsol","suphsub","suplarr","supmult","supnE","supne","supplus","supset","Supset","supseteq","supseteqq","supsetneq","supsetneqq","supsim","supsub","supsup","swarhk","swarr","swArr","swarrow","swnwar","szlig","Tab","target","Tau","tau","tbrk","Tcaron","tcaron","Tcedil","tcedil","Tcy","tcy","tdot","telrec","Tfr","tfr","there4","therefore","Therefore","Theta","theta","thetasym","thetav","thickapprox","thicksim","ThickSpace","ThinSpace","thinsp","thkap","thksim","THORN","thorn","tilde","Tilde","TildeEqual","TildeFullEqual","TildeTilde","timesbar","timesb","times","timesd","tint","toea","topbot","topcir","top","Topf","topf","topfork","tosa","tprime","trade","TRADE","triangle","triangledown","triangleleft","trianglelefteq","triangleq","triangleright","trianglerighteq","tridot","trie","triminus","TripleDot","triplus","trisb","tritime","trpezium","Tscr","tscr","TScy","tscy","TSHcy","tshcy","Tstrok","tstrok","twixt","twoheadleftarrow","twoheadrightarrow","Uacute","uacute","uarr","Uarr","uArr","Uarrocir","Ubrcy","ubrcy","Ubreve","ubreve","Ucirc","ucirc","Ucy","ucy","udarr","Udblac","udblac","udhar","ufisht","Ufr","ufr","Ugrave","ugrave","uHar","uharl","uharr","uhblk","ulcorn","ulcorner","ulcrop","ultri","Umacr","umacr","uml","UnderBar","UnderBrace","UnderBracket","UnderParenthesis","Union","UnionPlus","Uogon","uogon","Uopf","uopf","UpArrowBar","uparrow","UpArrow","Uparrow","UpArrowDownArrow","updownarrow","UpDownArrow","Updownarrow","UpEquilibrium","upharpoonleft","upharpoonright","uplus","UpperLeftArrow","UpperRightArrow","upsi","Upsi","upsih","Upsilon","upsilon","UpTeeArrow","UpTee","upuparrows","urcorn","urcorner","urcrop","Uring","uring","urtri","Uscr","uscr","utdot","Utilde","utilde","utri","utrif","uuarr","Uuml","uuml","uwangle","vangrt","varepsilon","varkappa","varnothing","varphi","varpi","varpropto","varr","vArr","varrho","varsigma","varsubsetneq","varsubsetneqq","varsupsetneq","varsupsetneqq","vartheta","vartriangleleft","vartriangleright","vBar","Vbar","vBarv","Vcy","vcy","vdash","vDash","Vdash","VDash","Vdashl","veebar","vee","Vee","veeeq","vellip","verbar","Verbar","vert","Vert","VerticalBar","VerticalLine","VerticalSeparator","VerticalTilde","VeryThinSpace","Vfr","vfr","vltri","vnsub","vnsup","Vopf","vopf","vprop","vrtri","Vscr","vscr","vsubnE","vsubne","vsupnE","vsupne","Vvdash","vzigzag","Wcirc","wcirc","wedbar","wedge","Wedge","wedgeq","weierp","Wfr","wfr","Wopf","wopf","wp","wr","wreath","Wscr","wscr","xcap","xcirc","xcup","xdtri","Xfr","xfr","xharr","xhArr","Xi","xi","xlarr","xlArr","xmap","xnis","xodot","Xopf","xopf","xoplus","xotime","xrarr","xrArr","Xscr","xscr","xsqcup","xuplus","xutri","xvee","xwedge","Yacute","yacute","YAcy","yacy","Ycirc","ycirc","Ycy","ycy","yen","Yfr","yfr","YIcy","yicy","Yopf","yopf","Yscr","yscr","YUcy","yucy","yuml","Yuml","Zacute","zacute","Zcaron","zcaron","Zcy","zcy","Zdot","zdot","zeetrf","ZeroWidthSpace","Zeta","zeta","zfr","Zfr","ZHcy","zhcy","zigrarr","zopf","Zopf","Zscr","zscr","zwj","zwnj","NewLine"], ["\u00c1","\u00e1","\u0102","\u0103","\u223e","\u223f","\u223e\u0333","\u00c2","\u00e2","\u00b4","\u0410","\u0430","\u00c6","\u00e6","\u2061","\ud504","\ud51e","\u00c0","\u00e0","\u2135","\u2135","\u0391","\u03b1","\u0100","\u0101","\u2a3f","&","&","\u2a55","\u2a53","\u2227","\u2a5c","\u2a58","\u2a5a","\u2220","\u29a4","\u2220","\u29a8","\u29a9","\u29aa","\u29ab","\u29ac","\u29ad","\u29ae","\u29af","\u2221","\u221f","\u22be","\u299d","\u2222","\u00c5","\u237c","\u0104","\u0105","\ud538","\ud552","\u2a6f","\u2248","\u2a70","\u224a","\u224b","'","\u2061","\u2248","\u224a","\u00c5","\u00e5","\ud49c","\ud4b6","\u2254","*","\u2248","\u224d","\u00c3","\u00e3","\u00c4","\u00e4","\u2233","\u2a11","\u224c","\u03f6","\u2035","\u223d","\u22cd","\u2216","\u2ae7","\u22bd","\u2305","\u2306","\u2305","\u23b5","\u23b6","\u224c","\u0411","\u0431","\u201e","\u2235","\u2235","\u2235","\u29b0","\u03f6","\u212c","\u212c","\u0392","\u03b2","\u2136","\u226c","\ud505","\ud51f","\u22c2","\u25ef","\u22c3","\u2a00","\u2a01","\u2a02","\u2a06","\u2605","\u25bd","\u25b3","\u2a04","\u22c1","\u22c0","\u290d","\u29eb","\u25aa","\u25b4","\u25be","\u25c2","\u25b8","\u2423","\u2592","\u2591","\u2593","\u2588","","\u2261\u20e5","\u2aed","\u2310","\ud539","\ud553","\u22a5","\u22a5","\u22c8","\u29c9","\u2510","\u2555","\u2556","\u2557","\u250c","\u2552","\u2553","\u2554","\u2500","\u2550","\u252c","\u2564","\u2565","\u2566","\u2534","\u2567","\u2568","\u2569","\u229f","\u229e","\u22a0","\u2518","\u255b","\u255c","\u255d","\u2514","\u2558","\u2559","\u255a","\u2502","\u2551","\u253c","\u256a","\u256b","\u256c","\u2524","\u2561","\u2562","\u2563","\u251c","\u255e","\u255f","\u2560","\u2035","\u02d8","\u02d8","\u00a6","\ud4b7","\u212c","\u204f","\u223d","\u22cd","\u29c5","\\","\u27c8","\u2022","\u2022","\u224e","\u2aae","\u224f","\u224e","\u224f","\u0106","\u0107","\u2a44","\u2a49","\u2a4b","\u2229","\u22d2","\u2a47","\u2a40","\u2145","\u2229\ufe00","\u2041","\u02c7","\u212d","\u2a4d","\u010c","\u010d","\u00c7","\u00e7","\u0108","\u0109","\u2230","\u2a4c","\u2a50","\u010a","\u010b","\u00b8","\u00b8","\u29b2","\u00a2","\u00b7","\u00b7","\ud520","\u212d","\u0427","\u0447","\u2713","\u2713","\u03a7","\u03c7","\u02c6","\u2257","\u21ba","\u21bb","\u229b","\u229a","\u229d","\u2299","\u00ae","\u24c8","\u2296","\u2295","\u2297","\u25cb","\u29c3","\u2257","\u2a10","\u2aef","\u29c2","\u2232","\u201d","\u2019","\u2663","\u2663",":","\u2237","\u2a74","\u2254","\u2254",",","@","\u2201","\u2218","\u2201","\u2102","\u2245","\u2a6d","\u2261","\u222e","\u222f","\u222e","\ud554","\u2102","\u2210","\u2210","\u00a9","\u00a9","\u2117","\u2233","\u21b5","\u2717","\u2a2f","\ud49e","\ud4b8","\u2acf","\u2ad1","\u2ad0","\u2ad2","\u22ef","\u2938","\u2935","\u22de","\u22df","\u21b6","\u293d","\u2a48","\u2a46","\u224d","\u222a","\u22d3","\u2a4a","\u228d","\u2a45","\u222a\ufe00","\u21b7","\u293c","\u22de","\u22df","\u22ce","\u22cf","\u00a4","\u21b6","\u21b7","\u22ce","\u22cf","\u2232","\u2231","\u232d","\u2020","\u2021","\u2138","\u2193","\u21a1","\u21d3","\u2010","\u2ae4","\u22a3","\u290f","\u02dd","\u010e","\u010f","\u0414","\u0434","\u2021","\u21ca","\u2145","\u2146","\u2911","\u2a77","\u00b0","\u2207","\u0394","\u03b4","\u29b1","\u297f","\ud507","\ud521","\u2965","\u21c3","\u21c2","\u00b4","\u02d9","\u02dd","`","\u02dc","\u22c4","\u22c4","\u22c4","\u2666","\u2666","\u00a8","\u2146","\u03dd","\u22f2","\u00f7","\u00f7","\u22c7","\u22c7","\u0402","\u0452","\u231e","\u230d","\$","\ud53b","\ud555","\u00a8","\u02d9","\u20dc","\u2250","\u2251","\u2250","\u2238","\u2214","\u22a1","\u2306","\u222f","\u00a8","\u21d3","\u21d0","\u21d4","\u2ae4","\u27f8","\u27fa","\u27f9","\u21d2","\u22a8","\u21d1","\u21d5","\u2225","\u2913","\u2193","\u2193","\u21d3","\u21f5","\u0311","\u21ca","\u21c3","\u21c2","\u2950","\u295e","\u2956","\u21bd","\u295f","\u2957","\u21c1","\u21a7","\u22a4","\u2910","\u231f","\u230c","\ud49f","\ud4b9","\u0405","\u0455","\u29f6","\u0110","\u0111","\u22f1","\u25bf","\u25be","\u21f5","\u296f","\u29a6","\u040f","\u045f","\u27ff","\u00c9","\u00e9","\u2a6e","\u011a","\u011b","\u00ca","\u00ea","\u2256","\u2255","\u042d","\u044d","\u2a77","\u0116","\u0117","\u2251","\u2147","\u2252","\ud508","\ud522","\u2a9a","\u00c8","\u00e8","\u2a96","\u2a98","\u2a99","\u2208","\u23e7","\u2113","\u2a95","\u2a97","\u0112","\u0113","\u2205","\u2205","\u25fb","\u2205","\u25ab","\u2004","\u2005","\u2003","\u014a","\u014b","\u2002","\u0118","\u0119","\ud53c","\ud556","\u22d5","\u29e3","\u2a71","\u03b5","\u0395","\u03b5","\u03f5","\u2256","\u2255","\u2242","\u2a96","\u2a95","\u2a75","","\u2242","\u225f","\u21cc","\u2261","\u2a78","\u29e5","\u2971","\u2253","\u212f","\u2130","\u2250","\u2a73","\u2242","\u0397","\u03b7","\u00d0","\u00f0","\u00cb","\u00eb","\u20ac","!","\u2203","\u2203","\u2130","\u2147","\u2147","\u2252","\u0424","\u0444","\u2640","\ufb03","\ufb00","\ufb04","\ud509","\ud523","\ufb01","\u25fc","\u25aa","fj","\u266d","\ufb02","\u25b1","\u0192","\ud53d","\ud557","\u2200","\u2200","\u22d4","\u2ad9","\u2131","\u2a0d","\u00bd","\u2153","\u00bc","\u2155","\u2159","\u215b","\u2154","\u2156","\u00be","\u2157","\u215c","\u2158","\u215a","\u215d","\u215e","\u2044","\u2322","\ud4bb","\u2131","\u01f5","\u0393","\u03b3","\u03dc","\u03dd","\u2a86","\u011e","\u011f","\u0122","\u011c","\u011d","\u0413","\u0433","\u0120","\u0121","\u2265","\u2267","\u2a8c","\u22db","\u2265","\u2267","\u2a7e","\u2aa9","\u2a7e","\u2a80","\u2a82","\u2a84","\u22db\ufe00","\u2a94","\ud50a","\ud524","\u226b","\u22d9","\u22d9","\u2137","\u0403","\u0453","\u2aa5","\u2277","\u2a92","\u2aa4","\u2a8a","\u2a8a","\u2a88","\u2269","\u2a88","\u2269","\u22e7","\ud53e","\ud558","`","\u2265","\u22db","\u2267","\u2aa2","\u2277","\u2a7e","\u2273","\ud4a2","\u210a","\u2273","\u2a8e","\u2a90","\u2aa7","\u2a7a",">",">","\u226b","\u22d7","\u2995","\u2a7c","\u2a86","\u2978","\u22d7","\u22db","\u2a8c","\u2277","\u2273","\u2269\ufe00","\u2269\ufe00","\u02c7","\u200a","\u00bd","\u210b","\u042a","\u044a","\u2948","\u2194","\u21d4","\u21ad","^","\u210f","\u0124","\u0125","\u2665","\u2665","\u2026","\u22b9","\ud525","\u210c","\u210b","\u2925","\u2926","\u21ff","\u223b","\u21a9","\u21aa","\ud559","\u210d","\u2015","\u2500","\ud4bd","\u210b","\u210f","\u0126","\u0127","\u224e","\u224f","\u2043","\u2010","\u00cd","\u00ed","\u2063","\u00ce","\u00ee","\u0418","\u0438","\u0130","\u0415","\u0435","\u00a1","\u21d4","\ud526","\u2111","\u00cc","\u00ec","\u2148","\u2a0c","\u222d","\u29dc","\u2129","\u0132","\u0133","\u012a","\u012b","\u2111","\u2148","\u2110","\u2111","\u0131","\u2111","\u22b7","\u01b5","\u21d2","\u2105","\u2208","\u221e","\u29dd","\u0131","\u22ba","\u222b","\u222c","\u2124","\u222b","\u22ba","\u22c2","\u2a17","\u2a3c","\u2063","\u2062","\u0401","\u0451","\u012e","\u012f","\ud540","\ud55a","\u0399","\u03b9","\u2a3c","\u00bf","\ud4be","\u2110","\u2208","\u22f5","\u22f9","\u22f4","\u22f3","\u2208","\u2062","\u0128","\u0129","\u0406","\u0456","\u00cf","\u00ef","\u0134","\u0135","\u0419","\u0439","\ud50d","\ud527","\u0237","\ud541","\ud55b","\ud4a5","\ud4bf","\u0408","\u0458","\u0404","\u0454","\u039a","\u03ba","\u03f0","\u0136","\u0137","\u041a","\u043a","\ud50e","\ud528","\u0138","\u0425","\u0445","\u040c","\u045c","\ud542","\ud55c","\ud4a6","\ud4c0","\u21da","\u0139","\u013a","\u29b4","\u2112","\u039b","\u03bb","\u27e8","\u27ea","\u2991","\u27e8","\u2a85","\u2112","\u00ab","\u21e4","\u291f","\u2190","\u219e","\u21d0","\u291d","\u21a9","\u21ab","\u2939","\u2973","\u21a2","\u2919","\u291b","\u2aab","\u2aad","\u2aad\ufe00","\u290c","\u290e","\u2772","{","[","\u298b","\u298f","\u298d","\u013d","\u013e","\u013b","\u013c","\u2308","{","\u041b","\u043b","\u2936","\u201c","\u201e","\u2967","\u294b","\u21b2","\u2264","\u2266","\u27e8","\u21e4","\u2190","\u2190","\u21d0","\u21c6","\u21a2","\u2308","\u27e6","\u2961","\u2959","\u21c3","\u230a","\u21bd","\u21bc","\u21c7","\u2194","\u2194","\u21d4","\u21c6","\u21cb","\u21ad","\u294e","\u21a4","\u22a3","\u295a","\u22cb","\u29cf","\u22b2","\u22b4","\u2951","\u2960","\u2958","\u21bf","\u2952","\u21bc","\u2a8b","\u22da","\u2264","\u2266","\u2a7d","\u2aa8","\u2a7d","\u2a7f","\u2a81","\u2a83","\u22da\ufe00","\u2a93","\u2a85","\u22d6","\u22da","\u2a8b","\u22da","\u2266","\u2276","\u2276","\u2aa1","\u2272","\u2a7d","\u2272","\u297c","\u230a","\ud50f","\ud529","\u2276","\u2a91","\u2962","\u21bd","\u21bc","\u296a","\u2584","\u0409","\u0459","\u21c7","\u226a","\u22d8","\u231e","\u21da","\u296b","\u25fa","\u013f","\u0140","\u23b0","\u23b0","\u2a89","\u2a89","\u2a87","\u2268","\u2a87","\u2268","\u22e6","\u27ec","\u21fd","\u27e6","\u27f5","\u27f5","\u27f8","\u27f7","\u27f7","\u27fa","\u27fc","\u27f6","\u27f6","\u27f9","\u21ab","\u21ac","\u2985","\ud543","\ud55d","\u2a2d","\u2a34","\u2217","_","\u2199","\u2198","\u25ca","\u25ca","\u29eb","(","\u2993","\u21c6","\u231f","\u21cb","\u296d","\u200e","\u22bf","\u2039","\ud4c1","\u2112","\u21b0","\u21b0","\u2272","\u2a8d","\u2a8f","[","\u2018","\u201a","\u0141","\u0142","\u2aa6","\u2a79","<","<","\u226a","\u22d6","\u22cb","\u22c9","\u2976","\u2a7b","\u25c3","\u22b4","\u25c2","\u2996","\u294a","\u2966","\u2268\ufe00","\u2268\ufe00","\u00af","\u2642","\u2720","\u2720","\u2905","\u21a6","\u21a6","\u21a7","\u21a4","\u21a5","\u25ae","\u2a29","\u041c","\u043c","\u2014","\u223a","\u2221","\u205f","\u2133","\ud510","\ud52a","\u2127","\u00b5","*","\u2af0","\u2223","\u00b7","\u229f","\u2212","\u2238","\u2a2a","\u2213","\u2adb","\u2026","\u2213","\u22a7","\ud544","\ud55e","\u2213","\ud4c2","\u2133","\u223e","\u039c","\u03bc","\u22b8","\u22b8","\u2207","\u0143","\u0144","\u2220\u20d2","\u2249","\u2a70\u0338","\u224b\u0338","\u0149","\u2249","\u266e","\u2115","\u266e","\u00a0","\u224e\u0338","\u224f\u0338","\u2a43","\u0147","\u0148","\u0145","\u0146","\u2247","\u2a6d\u0338","\u2a42","\u041d","\u043d","\u2013","\u2924","\u2197","\u21d7","\u2197","\u2260","\u2250\u0338","\u200b","\u200b","\u200b","\u200b","\u2262","\u2928","\u2242\u0338","\u226b","\u226a","","\u2204","\u2204","\ud511","\ud52b","\u2267\u0338","\u2271","\u2271","\u2267\u0338","\u2a7e\u0338","\u2a7e\u0338","\u22d9\u0338","\u2275","\u226b\u20d2","\u226f","\u226f","\u226b\u0338","\u21ae","\u21ce","\u2af2","\u220b","\u22fc","\u22fa","\u220b","\u040a","\u045a","\u219a","\u21cd","\u2025","\u2266\u0338","\u2270","\u219a","\u21cd","\u21ae","\u21ce","\u2270","\u2266\u0338","\u2a7d\u0338","\u2a7d\u0338","\u226e","\u22d8\u0338","\u2274","\u226a\u20d2","\u226e","\u22ea","\u22ec","\u226a\u0338","\u2224","\u2060","\u00a0","\ud55f","\u2115","\u2aec","\u00ac","\u2262","\u226d","\u2226","\u2209","\u2260","\u2242\u0338","\u2204","\u226f","\u2271","\u2267\u0338","\u226b\u0338","\u2279","\u2a7e\u0338","\u2275","\u224e\u0338","\u224f\u0338","\u2209","\u22f5\u0338","\u22f9\u0338","\u2209","\u22f7","\u22f6","\u29cf\u0338","\u22ea","\u22ec","\u226e","\u2270","\u2278","\u226a\u0338","\u2a7d\u0338","\u2274","\u2aa2\u0338","\u2aa1\u0338","\u220c","\u220c","\u22fe","\u22fd","\u2280","\u2aaf\u0338","\u22e0","\u220c","\u29d0\u0338","\u22eb","\u22ed","\u228f\u0338","\u22e2","\u2290\u0338","\u22e3","\u2282\u20d2","\u2288","\u2281","\u2ab0\u0338","\u22e1","\u227f\u0338","\u2283\u20d2","\u2289","\u2241","\u2244","\u2247","\u2249","\u2224","\u2226","\u2226","\u2afd\u20e5","\u2202\u0338","\u2a14","\u2280","\u22e0","\u2280","\u2aaf\u0338","\u2aaf\u0338","\u2933\u0338","\u219b","\u21cf","\u219d\u0338","\u219b","\u21cf","\u22eb","\u22ed","\u2281","\u22e1","\u2ab0\u0338","\ud4a9","\ud4c3","\u2224","\u2226","\u2241","\u2244","\u2244","\u2224","\u2226","\u22e2","\u22e3","\u2284","\u2ac5\u0338","\u2288","\u2282\u20d2","\u2288","\u2ac5\u0338","\u2281","\u2ab0\u0338","\u2285","\u2ac6\u0338","\u2289","\u2283\u20d2","\u2289","\u2ac6\u0338","\u2279","\u00d1","\u00f1","\u2278","\u22ea","\u22ec","\u22eb","\u22ed","\u039d","\u03bd","#","\u2116","\u2007","\u224d\u20d2","\u22ac","\u22ad","\u22ae","\u22af","\u2265\u20d2",">\u20d2","\u2904","\u29de","\u2902","\u2264\u20d2","<\u20d2","\u22b4\u20d2","\u2903","\u22b5\u20d2","\u223c\u20d2","\u2923","\u2196","\u21d6","\u2196","\u2927","\u00d3","\u00f3","\u229b","\u00d4","\u00f4","\u229a","\u041e","\u043e","\u229d","\u0150","\u0151","\u2a38","\u2299","\u29bc","\u0152","\u0153","\u29bf","\ud512","\ud52c","\u02db","\u00d2","\u00f2","\u29c1","\u29b5","\u03a9","\u222e","\u21ba","\u29be","\u29bb","\u203e","\u29c0","\u014c","\u014d","\u03a9","\u03c9","\u039f","\u03bf","\u29b6","\u2296","\ud546","\ud560","\u29b7","\u201c","\u2018","\u29b9","\u2295","\u21bb","\u2a54","\u2228","\u2a5d","\u2134","\u2134","\u00aa","\u00ba","\u22b6","\u2a56","\u2a57","\u2a5b","\u24c8","\ud4aa","\u2134","\u00d8","\u00f8","\u2298","\u00d5","\u00f5","\u2a36","\u2a37","\u2297","\u00d6","\u00f6","\u233d","\u203e","\u23de","\u23b4","\u23dc","\u00b6","\u2225","\u2225","\u2af3","\u2afd","\u2202","\u2202","\u041f","\u043f","%",".","\u2030","\u22a5","\u2031","\ud513","\ud52d","\u03a6","\u03c6","\u03d5","\u2133","\u260e","\u03a0","\u03c0","\u22d4","\u03d6","\u210f","\u210e","\u210f","\u2a23","\u229e","\u2a22","+","\u2214","\u2a25","\u2a72","\u00b1","\u00b1","\u2a26","\u2a27","\u00b1","\u210c","\u2a15","\ud561","\u2119","\u00a3","\u2ab7","\u2abb","\u227a","\u227c","\u2ab7","\u227a","\u227c","\u227a","\u2aaf","\u227c","\u227e","\u2aaf","\u2ab9","\u2ab5","\u22e8","\u2aaf","\u2ab3","\u227e","\u2032","\u2033","\u2119","\u2ab9","\u2ab5","\u22e8","\u220f","\u220f","\u232e","\u2312","\u2313","\u221d","\u221d","\u2237","\u221d","\u227e","\u22b0","\ud4ab","\ud4c5","\u03a8","\u03c8","\u2008","\ud514","\ud52e","\u2a0c","\ud562","\u211a","\u2057","\ud4ac","\ud4c6","\u210d","\u2a16","?","\u225f","\"","\"","\u21db","\u223d\u0331","\u0154","\u0155","\u221a","\u29b3","\u27e9","\u27eb","\u2992","\u29a5","\u27e9","\u00bb","\u2975","\u21e5","\u2920","\u2933","\u2192","\u21a0","\u21d2","\u291e","\u21aa","\u21ac","\u2945","\u2974","\u2916","\u21a3","\u219d","\u291a","\u291c","\u2236","\u211a","\u290d","\u290f","\u2910","\u2773","}","]","\u298c","\u298e","\u2990","\u0158","\u0159","\u0156","\u0157","\u2309","}","\u0420","\u0440","\u2937","\u2969","\u201d","\u201d","\u21b3","\u211c","\u211b","\u211c","\u211d","\u211c","\u25ad","\u00ae","\u00ae","\u220b","\u21cb","\u296f","\u297d","\u230b","\ud52f","\u211c","\u2964","\u21c1","\u21c0","\u296c","\u03a1","\u03c1","\u03f1","\u27e9","\u21e5","\u2192","\u2192","\u21d2","\u21c4","\u21a3","\u2309","\u27e7","\u295d","\u2955","\u21c2","\u230b","\u21c1","\u21c0","\u21c4","\u21cc","\u21c9","\u219d","\u21a6","\u22a2","\u295b","\u22cc","\u29d0","\u22b3","\u22b5","\u294f","\u295c","\u2954","\u21be","\u2953","\u21c0","\u02da","\u2253","\u21c4","\u21cc","\u200f","\u23b1","\u23b1","\u2aee","\u27ed","\u21fe","\u27e7","\u2986","\ud563","\u211d","\u2a2e","\u2a35","\u2970",")","\u2994","\u2a12","\u21c9","\u21db","\u203a","\ud4c7","\u211b","\u21b1","\u21b1","]","\u2019","\u2019","\u22cc","\u22ca","\u25b9","\u22b5","\u25b8","\u29ce","\u29f4","\u2968","\u211e","\u015a","\u015b","\u201a","\u2ab8","\u0160","\u0161","\u2abc","\u227b","\u227d","\u2ab0","\u2ab4","\u015e","\u015f","\u015c","\u015d","\u2aba","\u2ab6","\u22e9","\u2a13","\u227f","\u0421","\u0441","\u22a1","\u22c5","\u2a66","\u2925","\u2198","\u21d8","\u2198","\u00a7",";","\u2929","\u2216","\u2216","\u2736","\ud516","\ud530","\u2322","\u266f","\u0429","\u0449","\u0428","\u0448","\u2193","\u2190","\u2223","\u2225","\u2192","\u2191","\u00ad","\u03a3","\u03c3","\u03c2","\u03c2","\u223c","\u2a6a","\u2243","\u2243","\u2a9e","\u2aa0","\u2a9d","\u2a9f","\u2246","\u2a24","\u2972","\u2190","\u2218","\u2216","\u2a33","\u29e4","\u2223","\u2323","\u2aaa","\u2aac","\u2aac\ufe00","\u042c","\u044c","\u233f","\u29c4","/","\ud54a","\ud564","\u2660","\u2660","\u2225","\u2293","\u2293\ufe00","\u2294","\u2294\ufe00","\u221a","\u228f","\u2291","\u228f","\u2291","\u2290","\u2292","\u2290","\u2292","\u25a1","\u25a1","\u2293","\u228f","\u2291","\u2290","\u2292","\u2294","\u25aa","\u25a1","\u25aa","\u2192","\ud4ae","\ud4c8","\u2216","\u2323","\u22c6","\u22c6","\u2606","\u2605","\u03f5","\u03d5","\u00af","\u2282","\u22d0","\u2abd","\u2ac5","\u2286","\u2ac3","\u2ac1","\u2acb","\u228a","\u2abf","\u2979","\u2282","\u22d0","\u2286","\u2ac5","\u2286","\u228a","\u2acb","\u2ac7","\u2ad5","\u2ad3","\u2ab8","\u227b","\u227d","\u227b","\u2ab0","\u227d","\u227f","\u2ab0","\u2aba","\u2ab6","\u22e9","\u227f","\u220b","\u2211","\u2211","\u266a","\u00b9","\u00b2","\u00b3","\u2283","\u22d1","\u2abe","\u2ad8","\u2ac6","\u2287","\u2ac4","\u2283","\u2287","\u27c9","\u2ad7","\u297b","\u2ac2","\u2acc","\u228b","\u2ac0","\u2283","\u22d1","\u2287","\u2ac6","\u228b","\u2acc","\u2ac8","\u2ad4","\u2ad6","\u2926","\u2199","\u21d9","\u2199","\u292a","\u00df","","\u2316","\u03a4","\u03c4","\u23b4","\u0164","\u0165","\u0162","\u0163","\u0422","\u0442","\u20db","\u2315","\ud517","\ud531","\u2234","\u2234","\u2234","\u0398","\u03b8","\u03d1","\u03d1","\u2248","\u223c","\u205f\u200a","\u2009","\u2009","\u2248","\u223c","\u00de","\u00fe","\u02dc","\u223c","\u2243","\u2245","\u2248","\u2a31","\u22a0","\u00d7","\u2a30","\u222d","\u2928","\u2336","\u2af1","\u22a4","\ud54b","\ud565","\u2ada","\u2929","\u2034","\u2122","\u2122","\u25b5","\u25bf","\u25c3","\u22b4","\u225c","\u25b9","\u22b5","\u25ec","\u225c","\u2a3a","\u20db","\u2a39","\u29cd","\u2a3b","\u23e2","\ud4af","\ud4c9","\u0426","\u0446","\u040b","\u045b","\u0166","\u0167","\u226c","\u219e","\u21a0","\u00da","\u00fa","\u2191","\u219f","\u21d1","\u2949","\u040e","\u045e","\u016c","\u016d","\u00db","\u00fb","\u0423","\u0443","\u21c5","\u0170","\u0171","\u296e","\u297e","\ud518","\ud532","\u00d9","\u00f9","\u2963","\u21bf","\u21be","\u2580","\u231c","\u231c","\u230f","\u25f8","\u016a","\u016b","\u00a8","_","\u23df","\u23b5","\u23dd","\u22c3","\u228e","\u0172","\u0173","\ud54c","\ud566","\u2912","\u2191","\u2191","\u21d1","\u21c5","\u2195","\u2195","\u21d5","\u296e","\u21bf","\u21be","\u228e","\u2196","\u2197","\u03c5","\u03d2","\u03d2","\u03a5","\u03c5","\u21a5","\u22a5","\u21c8","\u231d","\u231d","\u230e","\u016e","\u016f","\u25f9","\ud4b0","\ud4ca","\u22f0","\u0168","\u0169","\u25b5","\u25b4","\u21c8","\u00dc","\u00fc","\u29a7","\u299c","\u03f5","\u03f0","\u2205","\u03d5","\u03d6","\u221d","\u2195","\u21d5","\u03f1","\u03c2","\u228a\ufe00","\u2acb\ufe00","\u228b\ufe00","\u2acc\ufe00","\u03d1","\u22b2","\u22b3","\u2ae8","\u2aeb","\u2ae9","\u0412","\u0432","\u22a2","\u22a8","\u22a9","\u22ab","\u2ae6","\u22bb","\u2228","\u22c1","\u225a","\u22ee","|","\u2016","|","\u2016","\u2223","|","\u2758","\u2240","\u200a","\ud519","\ud533","\u22b2","\u2282\u20d2","\u2283\u20d2","\ud54d","\ud567","\u221d","\u22b3","\ud4b1","\ud4cb","\u2acb\ufe00","\u228a\ufe00","\u2acc\ufe00","\u228b\ufe00","\u22aa","\u299a","\u0174","\u0175","\u2a5f","\u2227","\u22c0","\u2259","\u2118","\ud51a","\ud534","\ud54e","\ud568","\u2118","\u2240","\u2240","\ud4b2","\ud4cc","\u22c2","\u25ef","\u22c3","\u25bd","\ud51b","\ud535","\u27f7","\u27fa","\u039e","\u03be","\u27f5","\u27f8","\u27fc","\u22fb","\u2a00","\ud54f","\ud569","\u2a01","\u2a02","\u27f6","\u27f9","\ud4b3","\ud4cd","\u2a06","\u2a04","\u25b3","\u22c1","\u22c0","\u00dd","\u00fd","\u042f","\u044f","\u0176","\u0177","\u042b","\u044b","\u00a5","\ud51c","\ud536","\u0407","\u0457","\ud550","\ud56a","\ud4b4","\ud4ce","\u042e","\u044e","\u00ff","\u0178","\u0179","\u017a","\u017d","\u017e","\u0417","\u0437","\u017b","\u017c","\u2128","\u200b","\u0396","\u03b6","\ud537","\u2128","\u0416","\u0436","\u21dd","\ud56b","\u2124","\ud4b5","\ud4cf","\u200d","\u200c","\n"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

}

class Esc extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Esc.type$; }

  static #escapable = undefined;

  static escapable() {
    if (Esc.#escapable === undefined) {
      Esc.static$init();
      if (Esc.#escapable === undefined) Esc.#escapable = null;
    }
    return Esc.#escapable;
  }

  static #entity = undefined;

  static entity() {
    if (Esc.#entity === undefined) {
      Esc.static$init();
      if (Esc.#entity === undefined) Esc.#entity = null;
    }
    return Esc.#entity;
  }

  static #whitespace = undefined;

  static whitespace() {
    if (Esc.#whitespace === undefined) {
      Esc.static$init();
      if (Esc.#whitespace === undefined) Esc.#whitespace = null;
    }
    return Esc.#whitespace;
  }

  static #backslash_or_amp = undefined;

  static backslash_or_amp() {
    if (Esc.#backslash_or_amp === undefined) {
      Esc.static$init();
      if (Esc.#backslash_or_amp === undefined) Esc.#backslash_or_amp = null;
    }
    return Esc.#backslash_or_amp;
  }

  static #entity_or_esc_char = undefined;

  static entity_or_esc_char() {
    if (Esc.#entity_or_esc_char === undefined) {
      Esc.static$init();
      if (Esc.#entity_or_esc_char === undefined) Esc.#entity_or_esc_char = null;
    }
    return Esc.#entity_or_esc_char;
  }

  static #escape_in_uri = undefined;

  static escape_in_uri() {
    if (Esc.#escape_in_uri === undefined) {
      Esc.static$init();
      if (Esc.#escape_in_uri === undefined) Esc.#escape_in_uri = null;
    }
    return Esc.#escape_in_uri;
  }

  static #unescaper = undefined;

  static unescaper() {
    if (Esc.#unescaper === undefined) {
      Esc.static$init();
      if (Esc.#unescaper === undefined) Esc.#unescaper = null;
    }
    return Esc.#unescaper;
  }

  static #uri_replacer = undefined;

  static uri_replacer() {
    if (Esc.#uri_replacer === undefined) {
      Esc.static$init();
      if (Esc.#uri_replacer === undefined) Esc.#uri_replacer = null;
    }
    return Esc.#uri_replacer;
  }

  static unescapeStr(s) {
    if (Esc.backslash_or_amp().matcher(s).find()) {
      return Esc.replaceAll(Esc.entity_or_esc_char(), s, Esc.unescaper());
    }
    else {
      return s;
    }
    ;
  }

  static percentEncodeUrl(url) {
    return Esc.replaceAll(Esc.escape_in_uri(), url, Esc.uri_replacer());
  }

  static normalizeLabelContent(input) {
    let trimmed = sys.Str.trim(input);
    let caseFolded = sys.Str.upper(trimmed);
    return Esc.whitespace().matcher(caseFolded).replaceAll(" ");
  }

  static escapeHtml(input) {
    let sb = null;
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(input)); i = sys.Int.increment(i)) {
      let c = sys.Str.get(input, i);
      let replacement = null;
      let $_u111 = c;
      if (sys.ObjUtil.equals($_u111, 38)) {
        (replacement = "&amp;");
      }
      else if (sys.ObjUtil.equals($_u111, 60)) {
        (replacement = "&lt;");
      }
      else if (sys.ObjUtil.equals($_u111, 62)) {
        (replacement = "&gt;");
      }
      else if (sys.ObjUtil.equals($_u111, 34)) {
        (replacement = "&quot;");
      }
      ;
      if (replacement != null) {
        if (sb == null) {
          (sb = sys.StrBuf.make());
          sb.add(sys.Str.getRange(input, sys.Range.make(0, i, true)));
        }
        ;
        sb.add(replacement);
      }
      else {
        if (sb != null) {
          sb.addChar(c);
        }
        ;
      }
      ;
    }
    ;
    return ((this$) => { if (sb == null) return input; return sb.toStr(); })(this);
  }

  static replaceAll(pattern,s,replacer) {
    let matcher = pattern.matcher(s);
    if (!matcher.find()) {
      return s;
    }
    ;
    let sb = sys.StrBuf.make();
    let lastEnd = 0;
    while (true) {
      sb.add(sys.Str.getRange(s, sys.Range.make(lastEnd, matcher.start(), true)));
      sys.Func.call(replacer, sys.ObjUtil.coerce(matcher.group(), sys.Str.type$), sb);
      (lastEnd = matcher.end());
      if (!matcher.find()) {
        break;
      }
      ;
    }
    ;
    if (sys.ObjUtil.compareNE(lastEnd, sys.Str.size(s))) {
      sb.add(sys.Str.getRange(s, sys.Range.make(lastEnd, sys.Str.size(s), true)));
    }
    ;
    return sb.toStr();
  }

  static make() {
    const $self = new Esc();
    Esc.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    const this$ = this;
    Esc.#escapable = "[!\"#\$%&'()*+,./:;<=>?@\\[\\\\\\]^_`{|}~-]";
    Esc.#entity = "&(?:#x[a-f0-9]{1,6}|#[0-9]{1,7}|[a-z][a-z0-9]{1,31});";
    Esc.#whitespace = sys.ObjUtil.coerce(sys.Regex.fromStr("[ \t\r\n]+"), sys.Regex.type$);
    Esc.#backslash_or_amp = sys.ObjUtil.coerce(sys.Regex.fromStr("[\\\\&]"), sys.Regex.type$);
    Esc.#entity_or_esc_char = sys.ObjUtil.coerce(sys.Regex.fromStr(sys.Str.plus(sys.Str.plus(sys.Str.plus("\\\\", Esc.#escapable), "|"), Esc.#entity), "i"), sys.Regex.type$);
    Esc.#escape_in_uri = sys.ObjUtil.coerce(sys.Regex.fromStr("(%[a-fA-F0-9]{0,2}|[^:/?#@!\$&'()*+,;=a-zA-Z0-9\\-._~])"), sys.Regex.type$);
    Esc.#unescaper = sys.ObjUtil.coerce(((this$) => { let $_u113 = (input,sb) => {
      if (sys.ObjUtil.equals(sys.Str.get(input, 0), 92)) {
        sb.add(sys.Str.getRange(input, sys.Range.make(1, sys.Str.size(input), true)));
      }
      else {
        return sb.add(Html5.entityToStr(input));
      }
      ;
      return;
    }; if ($_u113 == null) return null; return sys.ObjUtil.toImmutable((input,sb) => {
      if (sys.ObjUtil.equals(sys.Str.get(input, 0), 92)) {
        sb.add(sys.Str.getRange(input, sys.Range.make(1, sys.Str.size(input), true)));
      }
      else {
        return sb.add(Html5.entityToStr(input));
      }
      ;
      return;
    }); })(this), sys.Type.find("|sys::Str,sys::StrBuf->sys::Void|"));
    Esc.#uri_replacer = sys.ObjUtil.coerce(((this$) => { let $_u114 = (input,sb) => {
      if (sys.ObjUtil.equals(sys.Str.get(input, 0), 37)) {
        if (sys.ObjUtil.equals(sys.Str.size(input), 3)) {
          sb.add(input);
        }
        else {
          sb.add("%25").add(sys.Str.getRange(input, sys.Range.make(1, -1)));
        }
        ;
      }
      else {
        let buf = sys.Str.toBuf(input);
        let byte = buf.read();
        while (byte != null) {
          sb.addChar(37).add(sys.Str.upper(sys.Int.toHex(sys.ObjUtil.coerce(byte, sys.Int.type$))));
          (byte = buf.read());
        }
        ;
      }
      ;
      return;
    }; if ($_u114 == null) return null; return sys.ObjUtil.toImmutable((input,sb) => {
      if (sys.ObjUtil.equals(sys.Str.get(input, 0), 37)) {
        if (sys.ObjUtil.equals(sys.Str.size(input), 3)) {
          sb.add(input);
        }
        else {
          sb.add("%25").add(sys.Str.getRange(input, sys.Range.make(1, -1)));
        }
        ;
      }
      else {
        let buf = sys.Str.toBuf(input);
        let byte = buf.read();
        while (byte != null) {
          sb.addChar(37).add(sys.Str.upper(sys.Int.toHex(sys.ObjUtil.coerce(byte, sys.Int.type$))));
          (byte = buf.read());
        }
        ;
      }
      ;
      return;
    }); })(this), sys.Type.find("|sys::Str,sys::StrBuf->sys::Void|"));
    return;
  }

}

class Chars extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Chars.type$; }

  static find(c,s,startIndex) {
    let len = sys.Str.size(s);
    for (let i = startIndex; sys.ObjUtil.compareLT(i, len); i = sys.Int.increment(i)) {
      if (sys.ObjUtil.equals(sys.Str.get(s, i), c)) {
        return i;
      }
      ;
    }
    ;
    return -1;
  }

  static isBlank(s) {
    return sys.ObjUtil.equals(Chars.skipSpaceTab(s, 0, sys.Str.size(s)), sys.Str.size(s));
  }

  static hasNonSpace(s) {
    const this$ = this;
    return sys.Str.any(s, (ch) => {
      return sys.ObjUtil.compareNE(ch, 32);
    });
  }

  static isLetter(text,i) {
    return sys.Int.isAlpha(sys.Str.get(text, i));
  }

  static isIsoControl(ch) {
    return ((sys.ObjUtil.compareLE(0, ch) && sys.ObjUtil.compareLE(ch, 31)) || (sys.ObjUtil.compareLE(127, ch) && sys.ObjUtil.compareLE(ch, 159)));
  }

  static skip(skip,s,startIndex,endIndex) {
    for (let i = startIndex; sys.ObjUtil.compareLT(i, endIndex); i = sys.Int.increment(i)) {
      if (sys.ObjUtil.compareNE(sys.Str.get(s, i), skip)) {
        return i;
      }
      ;
    }
    ;
    return endIndex;
  }

  static skipSpaceTab(s,startIndex,endIndex) {
    if (startIndex === undefined) startIndex = 0;
    if (endIndex === undefined) endIndex = sys.Str.size(s);
    for (let i = startIndex; sys.ObjUtil.compareLT(i, endIndex); i = sys.Int.increment(i)) {
      let $_u115 = sys.Str.get(s, i);
      if (sys.ObjUtil.equals($_u115, 32) || sys.ObjUtil.equals($_u115, 9)) {
        continue;
      }
      else {
        return i;
      }
      ;
    }
    ;
    return endIndex;
  }

  static skipBackwards(skip,s,startIndex,lastIndex) {
    if (startIndex === undefined) startIndex = sys.Int.minus(sys.Str.size(s), 1);
    if (lastIndex === undefined) lastIndex = 0;
    for (let i = startIndex; sys.ObjUtil.compareGE(i, lastIndex); i = sys.Int.decrement(i)) {
      if (sys.ObjUtil.compareNE(sys.Str.get(s, i), skip)) {
        return i;
      }
      ;
    }
    ;
    return sys.Int.minus(lastIndex, 1);
  }

  static skipSpaceTabBackwards(s,startIndex,lastIndex) {
    if (startIndex === undefined) startIndex = sys.Int.minus(sys.Str.size(s), 1);
    if (lastIndex === undefined) lastIndex = 0;
    for (let i = startIndex; sys.ObjUtil.compareGE(i, lastIndex); i = sys.Int.decrement(i)) {
      if ((sys.ObjUtil.equals(sys.Str.get(s, i), 32) || sys.ObjUtil.equals(sys.Str.get(s, i), 9))) {
        continue;
      }
      ;
      return i;
    }
    ;
    return sys.Int.minus(lastIndex, 1);
  }

  static isSpaceOrTab(s,index) {
    if (sys.ObjUtil.compareLT(index, sys.Str.size(s))) {
      return (sys.ObjUtil.equals(sys.Str.get(s, index), 32) || sys.ObjUtil.equals(sys.Str.get(s, index), 9));
    }
    ;
    return false;
  }

  static isPunctuation(cp) {
    let $_u116 = cp;
    if (sys.ObjUtil.equals($_u116, 95) || sys.ObjUtil.equals($_u116, 45) || sys.ObjUtil.equals($_u116, 41) || sys.ObjUtil.equals($_u116, 93) || sys.ObjUtil.equals($_u116, 125) || sys.ObjUtil.equals($_u116, 33) || sys.ObjUtil.equals($_u116, 34) || sys.ObjUtil.equals($_u116, 35) || sys.ObjUtil.equals($_u116, 37) || sys.ObjUtil.equals($_u116, 38) || sys.ObjUtil.equals($_u116, 39) || sys.ObjUtil.equals($_u116, 42) || sys.ObjUtil.equals($_u116, 44) || sys.ObjUtil.equals($_u116, 46) || sys.ObjUtil.equals($_u116, 47) || sys.ObjUtil.equals($_u116, 58) || sys.ObjUtil.equals($_u116, 59) || sys.ObjUtil.equals($_u116, 63) || sys.ObjUtil.equals($_u116, 64) || sys.ObjUtil.equals($_u116, 92) || sys.ObjUtil.equals($_u116, 40) || sys.ObjUtil.equals($_u116, 91) || sys.ObjUtil.equals($_u116, 123)) {
      return true;
    }
    else if (sys.ObjUtil.equals($_u116, 36) || sys.ObjUtil.equals($_u116, 94) || sys.ObjUtil.equals($_u116, 96) || sys.ObjUtil.equals($_u116, 43) || sys.ObjUtil.equals($_u116, 60) || sys.ObjUtil.equals($_u116, 61) || sys.ObjUtil.equals($_u116, 62) || sys.ObjUtil.equals($_u116, 124) || sys.ObjUtil.equals($_u116, 126)) {
      return true;
    }
    ;
    return false;
  }

  static isWhitespace(cp) {
    let $_u117 = cp;
    if (sys.ObjUtil.equals($_u117, 32) || sys.ObjUtil.equals($_u117, 9) || sys.ObjUtil.equals($_u117, 10) || sys.ObjUtil.equals($_u117, 12) || sys.ObjUtil.equals($_u117, 13)) {
      return true;
    }
    ;
    if ((sys.ObjUtil.equals(cp, 160) || sys.ObjUtil.equals(cp, 5760))) {
      return true;
    }
    ;
    if ((sys.ObjUtil.compareLE(8192, cp) && sys.ObjUtil.compareLE(cp, 8202))) {
      return true;
    }
    ;
    return (sys.ObjUtil.equals(cp, 8239) || sys.ObjUtil.equals(cp, 8287) || sys.ObjUtil.equals(cp, 12288));
  }

  static make() {
    const $self = new Chars();
    Chars.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class MarkdownTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MarkdownTest.type$; }

  static make() {
    const $self = new MarkdownTest();
    MarkdownTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class RenderingTest extends MarkdownTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RenderingTest.type$; }

  verifyRendering(source,expected) {
    this.doVerifyRendering(source, expected, this.render(source));
    return;
  }

  doVerifyRendering(source,expected,actual) {
    this.verifyEq(expected, actual);
    return;
  }

  static showTabs(s) {
    return s;
  }

  static make() {
    const $self = new RenderingTest();
    RenderingTest.make$($self);
    return $self;
  }

  static make$($self) {
    MarkdownTest.make$($self);
    return;
  }

}

class CoreRenderingTest extends RenderingTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CoreRenderingTest.type$; }

  #parser = null;

  // private field reflection only
  __parser(it) { if (it === undefined) return this.#parser; else this.#parser = it; }

  #renderer = null;

  // private field reflection only
  __renderer(it) { if (it === undefined) return this.#renderer; else this.#renderer = it; }

  setup() {
    RenderingTest.prototype.setup.call(this);
    this.#parser = Parser.make();
    this.#renderer = HtmlRenderer.make();
    return;
  }

  render(source) {
    return this.#renderer.render(this.#parser.parse(source));
  }

  static make() {
    const $self = new CoreRenderingTest();
    CoreRenderingTest.make$($self);
    return $self;
  }

  static make$($self) {
    RenderingTest.make$($self);
    return;
  }

}

class ListTightLooseTest extends CoreRenderingTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ListTightLooseTest.type$; }

  testTight() {
    this.verifyRendering("- foo\n- bar\n+ baz\n", "<ul>\n<li>foo</li>\n<li>bar</li>\n</ul>\n<ul>\n<li>baz</li>\n</ul>\n");
    return;
  }

  testLoose() {
    this.verifyRendering("- foo\n\n- bar\n\n\n- baz\n", "<ul>\n<li>\n<p>foo</p>\n</li>\n<li>\n<p>bar</p>\n</li>\n<li>\n<p>baz</p>\n</li>\n</ul>\n");
    return;
  }

  testLooseNested() {
    this.verifyRendering("- foo\n  - bar\n\n    baz", "<ul>\n<li>foo\n<ul>\n<li>\n<p>bar</p>\n<p>baz</p>\n</li>\n</ul>\n</li>\n</ul>\n");
    return;
  }

  testLooseNested2() {
    this.verifyRendering("- a\n  - b\n\n    c\n- d\n", "<ul>\n<li>a\n<ul>\n<li>\n<p>b</p>\n<p>c</p>\n</li>\n</ul>\n</li>\n<li>d</li>\n</ul>\n");
    return;
  }

  testOuter() {
    this.verifyRendering("- foo\n  - bar\n\n\n  baz", "<ul>\n<li>\n<p>foo</p>\n<ul>\n<li>bar</li>\n</ul>\n<p>baz</p>\n</li>\n</ul>\n");
    return;
  }

  testLooseListItem() {
    this.verifyRendering("- one\n\n  two\n", "<ul>\n<li>\n<p>one</p>\n<p>two</p>\n</li>\n</ul>\n");
    return;
  }

  testTightWithBlankLineAfter() {
    this.verifyRendering("- foo\n- bar\n\n", "<ul>\n<li>foo</li>\n<li>bar</li>\n</ul>\n");
    return;
  }

  testTightListWithCodeBlock() {
    this.verifyRendering("- a\n- ```\n  b\n\n\n  ```\n- c\n", "<ul>\n<li>a</li>\n<li>\n<pre><code>b\n\n\n</code></pre>\n</li>\n<li>c</li>\n</ul>\n");
    return;
  }

  testTightListWithCodeBlock2() {
    this.verifyRendering("* foo\n  ```\n  bar\n\n  ```\n  baz\n", "<ul>\n<li>foo\n<pre><code>bar\n\n</code></pre>\nbaz</li>\n</ul>\n");
    return;
  }

  testLooseEmptyListItem() {
    this.verifyRendering("* a\n*\n\n* c", "<ul>\n<li>\n<p>a</p>\n</li>\n<li></li>\n<li>\n<p>c</p>\n</li>\n</ul>\n");
    return;
  }

  testLooseBlankLineAfterCodeBlock() {
    this.verifyRendering("1. ```\n   foo\n   ```\n\n   bar", "<ol>\n<li>\n<pre><code>foo\n</code></pre>\n<p>bar</p>\n</li>\n</ol>\n");
    return;
  }

  static make() {
    const $self = new ListTightLooseTest();
    ListTightLooseTest.make$($self);
    return $self;
  }

  static make$($self) {
    CoreRenderingTest.make$($self);
    return;
  }

}

class CharsTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CharsTest.type$; }

  testSkipBackwards() {
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(Chars.skipBackwards(32, "foo"), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(Chars.skipBackwards(32, "foo "), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(Chars.skipBackwards(32, "foo  "), sys.Obj.type$.toNullable()));
    return;
  }

  testSkipSpaceTabBackwards() {
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(Chars.skipSpaceTabBackwards("foo"), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(Chars.skipSpaceTabBackwards("foo "), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(Chars.skipSpaceTabBackwards("foo\t"), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(Chars.skipSpaceTabBackwards("foo \t \t\t  "), sys.Obj.type$.toNullable()));
    return;
  }

  testIsBlank() {
    this.verify(Chars.isBlank(""));
    this.verify(Chars.isBlank(" "));
    this.verify(Chars.isBlank("\t"));
    this.verify(Chars.isBlank(" \t"));
    this.verifyFalse(Chars.isBlank("a"));
    this.verifyFalse(Chars.isBlank("\f"));
    return;
  }

  static make() {
    const $self = new CharsTest();
    CharsTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class DelimitedTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DelimitedTest.type$; }

  testEmphasis() {
    let input = "* *emphasis* \n* **strong** \n* _important_ \n* __CRITICAL__ \n";
    let parser = Parser.make();
    let doc = parser.parse(input);
    let v = DelimitedTestVisitor.make();
    doc.walk(v);
    let list = v.list();
    this.verifyEq(sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(list.size(), sys.Obj.type$.toNullable()));
    let emphasis = list.get(0);
    let strong = list.get(1);
    let important = list.get(2);
    let critical = list.get(3);
    this.verifyEq("*", emphasis.openingDelim());
    this.verifyEq("*", emphasis.closingDelim());
    this.verifyEq("**", strong.openingDelim());
    this.verifyEq("**", strong.closingDelim());
    this.verifyEq("_", important.openingDelim());
    this.verifyEq("_", important.closingDelim());
    this.verifyEq("__", critical.openingDelim());
    this.verifyEq("__", critical.closingDelim());
    return;
  }

  static make() {
    const $self = new DelimitedTest();
    DelimitedTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class DelimitedTestVisitor extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DelimitedTestVisitor.type$; }

  visitBulletList() { return Visitor.prototype.visitBulletList.apply(this, arguments); }

  visitCustomNode() { return Visitor.prototype.visitCustomNode.apply(this, arguments); }

  visitFencedCode() { return Visitor.prototype.visitFencedCode.apply(this, arguments); }

  visitThematicBreak() { return Visitor.prototype.visitThematicBreak.apply(this, arguments); }

  visitChildren() { return Visitor.prototype.visitChildren.apply(this, arguments); }

  visitLinkReferenceDefinition() { return Visitor.prototype.visitLinkReferenceDefinition.apply(this, arguments); }

  visitHeading() { return Visitor.prototype.visitHeading.apply(this, arguments); }

  visitDocument() { return Visitor.prototype.visitDocument.apply(this, arguments); }

  visitText() { return Visitor.prototype.visitText.apply(this, arguments); }

  visitListItem() { return Visitor.prototype.visitListItem.apply(this, arguments); }

  visitOrderedList() { return Visitor.prototype.visitOrderedList.apply(this, arguments); }

  visitCode() { return Visitor.prototype.visitCode.apply(this, arguments); }

  visitHtmlBlock() { return Visitor.prototype.visitHtmlBlock.apply(this, arguments); }

  visitHardLineBreak() { return Visitor.prototype.visitHardLineBreak.apply(this, arguments); }

  visitParagraph() { return Visitor.prototype.visitParagraph.apply(this, arguments); }

  visitCustomBlock() { return Visitor.prototype.visitCustomBlock.apply(this, arguments); }

  visitLink() { return Visitor.prototype.visitLink.apply(this, arguments); }

  visitBlockQuote() { return Visitor.prototype.visitBlockQuote.apply(this, arguments); }

  visitIndentedCode() { return Visitor.prototype.visitIndentedCode.apply(this, arguments); }

  visitSoftLineBreak() { return Visitor.prototype.visitSoftLineBreak.apply(this, arguments); }

  visitImage() { return Visitor.prototype.visitImage.apply(this, arguments); }

  visitHtmlInline() { return Visitor.prototype.visitHtmlInline.apply(this, arguments); }

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

  static make() {
    const $self = new DelimitedTestVisitor();
    DelimitedTestVisitor.make$($self);
    return $self;
  }

  static make$($self) {
    $self.#list = sys.List.make(Delimited.type$);
    return;
  }

  visitEmphasis(node) {
    this.#list.add(node);
    return;
  }

  visitStrongEmphasis(node) {
    this.#list.add(node);
    return;
  }

}

class EscTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EscTest.type$; }

  testUnescapeStr() {
    let s = "foo\\bar";
    this.verifyEq(s, Esc.unescapeStr(s));
    this.verifyEq("foo!bar", Esc.unescapeStr("foo\\!bar"));
    this.verifyEq("foo<bar", Esc.unescapeStr("foo&lt;bar"));
    this.verifyEq("<elem>", Esc.unescapeStr("&lt;elem&gt;"));
    return;
  }

  testEscapeHtml() {
    this.verifyEq("nothing to escape", Esc.escapeHtml("nothing to escape"));
    this.verifyEq("&amp;", Esc.escapeHtml("&"));
    this.verifyEq("&lt;", Esc.escapeHtml("<"));
    this.verifyEq("&gt;", Esc.escapeHtml(">"));
    this.verifyEq("&quot;", Esc.escapeHtml("\""));
    this.verifyEq("&lt; start", Esc.escapeHtml("< start"));
    this.verifyEq("end &gt;", Esc.escapeHtml("end >"));
    this.verifyEq("&lt; both &gt;", Esc.escapeHtml("< both >"));
    this.verifyEq("&lt; middle &amp; too &gt;", Esc.escapeHtml("< middle & too >"));
    return;
  }

  static make() {
    const $self = new EscTest();
    EscTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class NodeTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NodeTest.type$; }

  test() {
    let root = Document.make();
    this.verifyNull(root.parent());
    let p1 = Paragraph.make();
    let p2 = Paragraph.make();
    root.appendChild(p1);
    this.verifyNode(root, null, null, null, p1, p1);
    root.appendChild(p2);
    this.verifyNode(root, null, null, null, p1, p2);
    p1.unlink();
    this.verifyNode(root, null, null, null, p2, p2);
    p2.insertBefore(p1);
    this.verifyNode(root, null, null, null, p1, p2);
    this.verifyNode(p2, root, null, p1, null, null);
    this.verifyNode(p1, root, p2, null, null, null);
    p1.unlink();
    this.verifyNode(root, null, null, null, p2, p2);
    p2.insertAfter(p1);
    this.verifyNode(root, null, null, null, p2, p1);
    return;
  }

  verifyNode(n,parent,next,prev,firstChild,lastChild) {
    this.verifySame(n.parent(), parent);
    this.verifySame(n.next(), next);
    this.verifySame(n.prev(), prev);
    this.verifySame(n.firstChild(), firstChild);
    this.verifySame(n.lastChild(), lastChild);
    return;
  }

  static make() {
    const $self = new NodeTest();
    NodeTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class SpecialInputTest extends CoreRenderingTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SpecialInputTest.type$; }

  testEmpty() {
    this.verifyRendering("", "");
    return;
  }

  testNullCharacterShouldBeReplaces() {
    this.verifyRendering("foo\u0000bar", "<p>foo\ufffdbar</p>\n");
    return;
  }

  testNullCharacterEntityShouldBeReplaced() {
    this.verifyRendering("foo&#0;bar", "<p>foo\ufffdbar</p>\n");
    return;
  }

  testCrLfAsLineSeparatorShouldBeParsed() {
    this.verifyRendering("foo\r\nbar", "<p>foo\nbar</p>\n");
    return;
  }

  testCrLfAtEndShouldBeParsed() {
    this.verifyRendering("foo\r\n", "<p>foo</p>\n");
    return;
  }

  testIndentedCodeBlockWithMixedTabsAndSpaces() {
    this.verifyRendering("    foo\n\tbar", "<pre><code>foo\nbar\n</code></pre>\n");
    return;
  }

  testListInBlockQuote() {
    this.verifyRendering("> *\n> * a", "<blockquote>\n<ul>\n<li></li>\n<li>a</li>\n</ul>\n</blockquote>\n");
    return;
  }

  testLooseListInBlockQuote() {
    this.verifyRendering("> *\n>\n> * a", "<blockquote>\n<ul>\n<li></li>\n<li>\n<p>a</p>\n</li>\n</ul>\n</blockquote>\n");
    return;
  }

  testLineWithOnlySpacesAfterListBullet() {
    this.verifyRendering("-  \n  \n  foo\n", "<ul>\n<li></li>\n</ul>\n<p>foo</p>\n");
    return;
  }

  testListWIthTwoSpacesForFirstBullet() {
    this.verifyRendering("*  \n  foo\n", "<ul>\n<li>foo</li>\n</ul>\n");
    return;
  }

  testOrderedListMarkerOnly() {
    this.verifyRendering("2.", "<ol start=\"2\">\n<li></li>\n</ol>\n");
    return;
  }

  testColumnIsInTabOnPreviousLine() {
    this.verifyRendering("- foo\n\n\tbar\n\n# baz\n", "<ul>\n<li>\n<p>foo</p>\n<p>bar</p>\n</li>\n</ul>\n<h1>baz</h1>\n");
    this.verifyRendering("- foo\n\n\tbar\n# baz\n", "<ul>\n<li>\n<p>foo</p>\n<p>bar</p>\n</li>\n</ul>\n<h1>baz</h1>\n");
    return;
  }

  testLinkLabelWithBracket() {
    this.verifyRendering("[a[b]\n\n[a[b]: /", "<p>[a[b]</p>\n<p>[a[b]: /</p>\n");
    this.verifyRendering("[a]b]\n\n[a]b]: /", "<p>[a]b]</p>\n<p>[a]b]: /</p>\n");
    this.verifyRendering("[a[b]]\n\n[a[b]]: /", "<p>[a[b]]</p>\n<p>[a[b]]: /</p>\n");
    return;
  }

  testLinkLabelLen() {
    let label1 = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    this.verifyRendering(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[foo][", label1), "]\n\n["), label1), "]: /"), "<p><a href=\"/\">foo</a></p>\n");
    this.verifyRendering(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[foo][x", label1), "]\n\n[x"), label1), "]: /"), sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("<p>[foo][x", label1), "]</p>\n<p>[x"), label1), "]: /</p>\n"));
    this.verifyRendering(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[foo][\n", label1), "]\n\n[\n"), label1), "]: /"), sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("<p>[foo][\n", label1), "]</p>\n<p>[\n"), label1), "]: /</p>\n"));
    let label2 = "a\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\n";
    this.verifyRendering(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[foo][", label2), "]\n\n["), label2), "]: /"), "<p><a href=\"/\">foo</a></p>\n");
    this.verifyRendering(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[foo][12", label2), "]\n\n[12"), label2), "]: /"), sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("<p>[foo][12", label2), "]</p>\n<p>[12"), label2), "]: /</p>\n"));
    return;
  }

  testLinkDestinationEscaping() {
    this.verifyRendering("[foo](\\))", "<p><a href=\")\">foo</a></p>\n");
    this.verifyRendering("[foo](\\ )", "<p><a href=\"\\\">foo</a></p>\n");
    this.verifyRendering("[foo](<a\\b>)", "<p><a href=\"a\\b\">foo</a></p>\n");
    this.verifyRendering("[foo](<a\\>>)", "<p><a href=\"a&gt;\">foo</a></p>\n");
    this.verifyRendering("[foo](<\\>)", "<p>[foo](&lt;&gt;)</p>\n");
    return;
  }

  testLinkReferenceBackslash() {
    this.verifyRendering("[\\]: test", "<p>[]: test</p>\n");
    this.verifyRendering("[a\\b]\n\n[a\\b]: test", "<p><a href=\"test\">a\\b</a></p>\n");
    this.verifyRendering("[a\\]]\n\n[a\\]]: test", "<p><a href=\"test\">a]</a></p>\n");
    return;
  }

  testEmphasisMultipleOf3Rule() {
    this.verifyRendering("a***b* c*", "<p>a*<em><em>b</em> c</em></p>\n");
    return;
  }

  testRenderEvenRegexpProducesStackoverflow() {
    this.render("Contents: <!--[if gte mso 9]> <w:LatentStyles DefLockedState=\"false\" DefUnhideWhenUsed=\"false\" DefSemiHidden=\"false\" DefQFormat=\"false\" DefPriority=\"99\" LatentStyleCount=\"371\">  <w:xxx Locked=\"false\" Priority=\"52\" Name=\"Grid Table 7 Colorful 6\"/> <w:xxx Locked=\"false\" Priority=\"46\" Name=\"List Table 1 Light\"/> <w:xxx Locked=\"false\" Priority=\"47\" Name=\"List Table 2\"/> <w:xxx Locked=\"false\" Priority=\"48\" Name=\"List Table 3\"/> <w:xxx Locked=\"false\" Priority=\"49\" Name=\"List Table 4\"/> <w:xxx Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark\"/> <w:xxx Locked=\"false\" Priority=\"51\" Name=\"List Table 6 Colorful\"/> <w:xxx Locked=\"false\" Priority=\"52\" Name=\"List Table 7 Colorful\"/> <w:xxx Locked=\"false\" Priority=\"46\" Name=\"List Table 1 Light Accent 1\"/> <w:xxx Locked=\"false\" Priority=\"47\" Name=\"List Table 2 Accent 1\"/> <w:xxx Locked=\"false\" Priority=\"48\" Name=\"List Table 3 Accent 1\"/> <w:xxx Locked=\"false\" Priority=\"49\" Name=\"List Table 4 Accent 1\"/> <w:xxx Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark Accent 1\"/>  <w:xxx Locked=\"false\" Priority=\"52\" Name=\"List Table 7 Colorful Accent 1\"/> <w:xxx Locked=\"false\" Priority=\"46\" Name=\"List Table 1 Light Accent 2\"/> <w:xxx Locked=\"false\" Priority=\"47\" Name=\"List Table 2 Accent 2\"/> <w:xxx Locked=\"false\" Priority=\"48\" Name=\"List Table 3 Accent 2\"/> <w:xxx Locked=\"false\" Priority=\"49\" Name=\"List Table 4 Accent 2\"/> <w:xxx Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark Accent 2\"/> <w:xxx Locked=\"false\" Priority=\"51\" Name=\"List Table 6 Colorful Accent 2\"/> <w:xxx Locked=\"false\" Priority=\"52\" Name=\"List Table 7 Colorful Accent 2\"/> <w:xxx Locked=\"false\" Priority=\"46\" Name=\"List Table 1 Light Accent 3\"/> <w:xxx Locked=\"false\" Priority=\"47\" Name=\"List Table 2 Accent 3\"/> <w:xxx Locked=\"false\" Priority=\"48\" Name=\"List Table 3 Accent 3\"/> <w:xxx Locked=\"false\" Priority=\"49\" Name=\"List Table 4 Accent 3\" /> <w:xxx Locked=\"false\" Priority=\"50\" Name=\"List Table 5 Dark Accent 3\"/><w:xxx Locked=\"false\" Priority=\"51\" Name=\"List Table 6 Colorful Accent 3\"/></xml>");
    this.verify(true);
    return;
  }

  testDeeplyIndentedList() {
    this.verifyRendering("* one\n  * two\n    * three\n      * four", "<ul>\n<li>one\n<ul>\n<li>two\n<ul>\n<li>three\n<ul>\n<li>four</li>\n</ul>\n</li>\n</ul>\n</li>\n</ul>\n</li>\n</ul>\n");
    return;
  }

  testTrailingTabs() {
    this.verifyRendering("a\t\nb\n", "<p>a\t\nb</p>\n");
    return;
  }

  testUnicodePunctuation() {
    return;
  }

  testHtmlBlockInterruptingList() {
    this.verifyRendering("- <script>\n- some text\nsome other text\n</script>\n", "<ul>\n<li>\n<script>\n</li>\n<li>some text\nsome other text\n</script></li>\n</ul>\n");
    this.verifyRendering("- <script>\n- some text\nsome other text\n\n</script>\n", "<ul>\n<li>\n<script>\n</li>\n<li>some text\nsome other text</li>\n</ul>\n</script>\n");
    return;
  }

  static make() {
    const $self = new SpecialInputTest();
    SpecialInputTest.make$($self);
    return $self;
  }

  static make$($self) {
    CoreRenderingTest.make$($self);
    return;
  }

}

class HeadingParserTest extends CoreRenderingTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HeadingParserTest.type$; }

  testAtxHeadingStart() {
    this.verifyRendering("# test", "<h1>test</h1>\n");
    this.verifyRendering("###### test", "<h6>test</h6>\n");
    this.verifyRendering("####### test", "<p>####### test</p>\n");
    this.verifyRendering("#test", "<p>#test</p>\n");
    this.verifyRendering("#", "<h1></h1>\n");
    return;
  }

  testAtxHeadingTrailing() {
    this.verifyRendering("# test #", "<h1>test</h1>\n");
    this.verifyRendering("# test ###", "<h1>test</h1>\n");
    this.verifyRendering("# test # ", "<h1>test</h1>\n");
    this.verifyRendering("# test ### ", "<h1>test</h1>\n");
    this.verifyRendering("# test # #", "<h1>test #</h1>\n");
    this.verifyRendering("# test#", "<h1>test#</h1>\n");
    return;
  }

  testSetextHeadingMarkers() {
    this.verifyRendering("test\n=", "<h1>test</h1>\n");
    this.verifyRendering("test\n-", "<h2>test</h2>\n");
    this.verifyRendering("test\n====", "<h1>test</h1>\n");
    this.verifyRendering("test\n----", "<h2>test</h2>\n");
    this.verifyRendering("test\n====   ", "<h1>test</h1>\n");
    this.verifyRendering("test\n====   =", "<p>test\n====   =</p>\n");
    this.verifyRendering("test\n=-=", "<p>test\n=-=</p>\n");
    this.verifyRendering("test\n=a", "<p>test\n=a</p>\n");
    return;
  }

  static make() {
    const $self = new HeadingParserTest();
    HeadingParserTest.make$($self);
    return $self;
  }

  static make$($self) {
    CoreRenderingTest.make$($self);
    return;
  }

}

class ScannerTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ScannerTest.type$; }

  testNext() {
    let scanner = Scanner.make(sys.List.make(SourceLine.type$, [SourceLine.make("foo bar")]), 0, 4);
    this.verifyEq(sys.ObjUtil.coerce(98, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peek(), sys.Obj.type$.toNullable()));
    scanner.next();
    this.verifyEq(sys.ObjUtil.coerce(97, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peek(), sys.Obj.type$.toNullable()));
    scanner.next();
    this.verifyEq(sys.ObjUtil.coerce(114, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peek(), sys.Obj.type$.toNullable()));
    scanner.next();
    this.verifyEq(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peek(), sys.Obj.type$.toNullable()));
    return;
  }

  testMultipleLines() {
    let scanner = Scanner.make(sys.List.make(SourceLine.type$, [SourceLine.make("ab"), SourceLine.make("cde")]), 0, 0);
    this.verify(scanner.hasNext());
    this.verifyEq(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peekPrevCodePoint(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(97, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peek(), sys.Obj.type$.toNullable()));
    scanner.next();
    this.verify(scanner.hasNext());
    this.verifyEq(sys.ObjUtil.coerce(97, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peekPrevCodePoint(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(98, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peek(), sys.Obj.type$.toNullable()));
    scanner.next();
    this.verify(scanner.hasNext());
    this.verifyEq(sys.ObjUtil.coerce(98, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peekPrevCodePoint(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peek(), sys.Obj.type$.toNullable()));
    scanner.next();
    this.verify(scanner.hasNext());
    this.verifyEq(sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peekPrevCodePoint(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(99, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peek(), sys.Obj.type$.toNullable()));
    scanner.next();
    this.verify(scanner.hasNext());
    this.verifyEq(sys.ObjUtil.coerce(99, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peekPrevCodePoint(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(100, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peek(), sys.Obj.type$.toNullable()));
    scanner.next();
    this.verify(scanner.hasNext());
    this.verifyEq(sys.ObjUtil.coerce(100, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peekPrevCodePoint(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(101, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peek(), sys.Obj.type$.toNullable()));
    scanner.next();
    this.verifyFalse(scanner.hasNext());
    this.verifyEq(sys.ObjUtil.coerce(101, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peekPrevCodePoint(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.peek(), sys.Obj.type$.toNullable()));
    scanner.next();
    return;
  }

  testCodePoints() {
    return;
  }

  testTextBetween() {
    let scanner = Scanner.make(sys.List.make(SourceLine.type$, [SourceLine.make("ab", SourceSpan.make(10, 3, 2)), SourceLine.make("cde", SourceSpan.make(11, 4, 3))]), 0, 0);
    let start = scanner.pos();
    scanner.next();
    this.verifySourceLines(scanner.source(start, scanner.pos()), "a", sys.List.make(SourceSpan.type$, [SourceSpan.make(10, 3, 1)]));
    let afterA = scanner.pos();
    scanner.next();
    this.verifySourceLines(scanner.source(start, scanner.pos()), "ab", sys.List.make(SourceSpan.type$, [SourceSpan.make(10, 3, 2)]));
    let afterB = scanner.pos();
    scanner.next();
    this.verifySourceLines(scanner.source(start, scanner.pos()), "ab\n", sys.List.make(SourceSpan.type$, [SourceSpan.make(10, 3, 2)]));
    scanner.next();
    this.verifySourceLines(scanner.source(start, scanner.pos()), "ab\nc", sys.List.make(SourceSpan.type$, [SourceSpan.make(10, 3, 2), SourceSpan.make(11, 4, 1)]));
    scanner.next();
    this.verifySourceLines(scanner.source(start, scanner.pos()), "ab\ncd", sys.List.make(SourceSpan.type$, [SourceSpan.make(10, 3, 2), SourceSpan.make(11, 4, 2)]));
    scanner.next();
    this.verifySourceLines(scanner.source(start, scanner.pos()), "ab\ncde", sys.List.make(SourceSpan.type$, [SourceSpan.make(10, 3, 2), SourceSpan.make(11, 4, 3)]));
    this.verifySourceLines(scanner.source(afterA, scanner.pos()), "b\ncde", sys.List.make(SourceSpan.type$, [SourceSpan.make(10, 4, 1), SourceSpan.make(11, 4, 3)]));
    this.verifySourceLines(scanner.source(afterB, scanner.pos()), "\ncde", sys.List.make(SourceSpan.type$, [SourceSpan.make(11, 4, 3)]));
    return;
  }

  testNextStr() {
    let scanner = Scanner.make(sys.List.make(SourceLine.type$, [SourceLine.make("hey ya"), SourceLine.make("hi")]));
    this.verifyFalse(scanner.nextStr("hoy"));
    this.verify(scanner.nextStr("hey"));
    this.verify(scanner.nextCh(32));
    this.verifyFalse(scanner.nextStr("yo"));
    this.verify(scanner.nextStr("ya"));
    this.verifyFalse(scanner.nextStr(" "));
    return;
  }

  testWhitespace() {
    let scanner = Scanner.make(sys.List.make(SourceLine.type$, [SourceLine.make("foo \t\u000b\r\n\fbar")]));
    this.verify(scanner.nextStr("foo"));
    this.verifyEq(sys.ObjUtil.coerce(6, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(scanner.whitespace(), sys.Obj.type$.toNullable()));
    this.verify(scanner.nextStr("bar"));
    return;
  }

  verifySourceLines(lines,expectedContent,expectedSpans) {
    this.verifyEq(expectedContent, lines.content());
    this.verifyEq(expectedSpans, lines.sourceSpans());
    return;
  }

  static make() {
    const $self = new ScannerTest();
    ScannerTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class FencedCodeParserTest extends CoreRenderingTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FencedCodeParserTest.type$; }

  testBacktickInfo() {
    let doc = Parser.make().parse("```info ~ test\ncode\n```");
    let codeBlock = sys.ObjUtil.coerce(doc.firstChild(), FencedCode.type$);
    this.verifyEq("info ~ test", codeBlock.info());
    this.verifyEq("code\n", codeBlock.literal());
    return;
  }

  testBacktickInfoDoesntAllowBacktick() {
    this.verifyRendering("```info ` test\ncode\n```", "<p>```info ` test\ncode</p>\n<pre><code></code></pre>\n");
    return;
  }

  testBacktickAndTildeCantBeMixed() {
    this.verifyRendering("``~`\ncode\n``~`", "<p><code>~` code </code>~`</p>\n");
    return;
  }

  testClosingCanHaveSpacesAfter() {
    this.verifyRendering("```\ncode\n```  ", "<pre><code>code\n</code></pre>\n");
    return;
  }

  testClosingCanNotHavNonSpaces() {
    this.verifyRendering("```\ncode\n``` a", "<pre><code>code\n``` a\n</code></pre>\n");
    return;
  }

  test151() {
    this.verifyRendering("```\nthis code\n\nshould not have BRs or paragraphs in it\nok\n```", "<pre><code>this code\n\nshould not have BRs or paragraphs in it\nok\n</code></pre>\n");
    return;
  }

  static make() {
    const $self = new FencedCodeParserTest();
    FencedCodeParserTest.make$($self);
    return $self;
  }

  static make$($self) {
    CoreRenderingTest.make$($self);
    return;
  }

}

class DelimiterProcessorTest extends CoreRenderingTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DelimiterProcessorTest.type$; }

  static make() {
    const $self = new DelimiterProcessorTest();
    DelimiterProcessorTest.make$($self);
    return $self;
  }

  static make$($self) {
    CoreRenderingTest.make$($self);
    return;
  }

}

class LinkReferenceDefinitionParserTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LinkReferenceDefinitionParserTest.type$; }

  #parser = null;

  // private field reflection only
  __parser(it) { if (it === undefined) return this.#parser; else this.#parser = it; }

  setup() {
    sys.Test.prototype.setup.call(this);
    this.#parser = LinkReferenceDefinitionParser.make();
    return;
  }

  testStartLabel() {
    this.verifyState("[", LinkRefState.label(), "[");
    return;
  }

  testStartNoLabel() {
    this.verifyPara("a");
    this.parse("a");
    this.parse("[");
    this.verifyEq(LinkRefState.paragraph(), this.#parser.state());
    this.verifyParaLines("a\n[", sys.ObjUtil.coerce(this.#parser, LinkReferenceDefinitionParser.type$));
    return;
  }

  testEmptyLabel() {
    this.verifyPara("[]: /");
    this.verifyPara("[ ]: /");
    this.verifyPara("[ \t\n\u000b\f\r ]: /");
    return;
  }

  testLabelColon() {
    this.verifyPara("[foo] : /");
    return;
  }

  testLabel() {
    this.verifyState("[foo]:", LinkRefState.destination(), "[foo]:");
    this.verifyState("[ foo ]:", LinkRefState.destination(), "[ foo ]:");
    return;
  }

  testLabelInvalid() {
    this.verifyPara("[foo[]:");
    return;
  }

  testLabelMultiline() {
    this.parse("[two");
    this.verifyEq(LinkRefState.label(), this.#parser.state());
    this.parse("lines]:");
    this.verifyEq(LinkRefState.destination(), this.#parser.state());
    this.parse("/url");
    this.verifyEq(LinkRefState.start_title(), this.#parser.state());
    this.verifyDef(sys.ObjUtil.coerce(this.#parser.linkRefDefs().first(), LinkReferenceDefinition.type$), "two\nlines", sys.Uri.fromStr("/url"), null);
    return;
  }

  testLabelStartsWithNewLine() {
    this.parse("[");
    this.verifyEq(LinkRefState.label(), this.#parser.state());
    this.parse("weird]:");
    this.verifyEq(LinkRefState.destination(), this.#parser.state());
    this.parse("/url");
    this.verifyEq(LinkRefState.start_title(), this.#parser.state());
    this.verifyDef(sys.ObjUtil.coerce(this.#parser.linkRefDefs().first(), LinkReferenceDefinition.type$), "\nweird", sys.Uri.fromStr("/url"), null);
    return;
  }

  testDestination() {
    this.parse("[foo]: /url");
    this.verifyEq(LinkRefState.start_title(), this.#parser.state());
    this.verifyParaLines("", sys.ObjUtil.coerce(this.#parser, LinkReferenceDefinitionParser.type$));
    this.verifyEq(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.#parser.linkRefDefs().size(), sys.Obj.type$.toNullable()));
    this.verifyDef(sys.ObjUtil.coerce(this.#parser.linkRefDefs().first(), LinkReferenceDefinition.type$), "foo", sys.Uri.fromStr("/url"), null);
    this.parse("[bar]: </url2>");
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.#parser.linkRefDefs().size(), sys.Obj.type$.toNullable()));
    this.verifyDef(sys.ObjUtil.coerce(this.#parser.linkRefDefs().last(), LinkReferenceDefinition.type$), "bar", sys.Uri.fromStr("/url2"), null);
    return;
  }

  testDestinationInvalid() {
    this.verifyPara("[foo]: <bar<>");
    return;
  }

  testTitle() {
    this.parse("[foo]: /url 'title'");
    this.verifyEq(LinkRefState.start_definition(), this.#parser.state());
    this.verifyParaLines("", sys.ObjUtil.coerce(this.#parser, LinkReferenceDefinitionParser.type$));
    this.verifyEq(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.#parser.linkRefDefs().size(), sys.Obj.type$.toNullable()));
    this.verifyDef(sys.ObjUtil.coerce(this.#parser.linkRefDefs().first(), LinkReferenceDefinition.type$), "foo", sys.Uri.fromStr("/url"), "title");
    return;
  }

  testTitleStartWhitespace() {
    this.parse("[foo]: /url");
    this.verifyEq(LinkRefState.start_title(), this.#parser.state());
    this.verifyParaLines("", sys.ObjUtil.coerce(this.#parser, LinkReferenceDefinitionParser.type$));
    this.parse("   ");
    this.verifyEq(LinkRefState.start_definition(), this.#parser.state());
    this.verifyParaLines("   ", sys.ObjUtil.coerce(this.#parser, LinkReferenceDefinitionParser.type$));
    this.verifyEq(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.#parser.linkRefDefs().size(), sys.Obj.type$.toNullable()));
    this.verifyDef(sys.ObjUtil.coerce(this.#parser.linkRefDefs().first(), LinkReferenceDefinition.type$), "foo", sys.Uri.fromStr("/url"), null);
    return;
  }

  testTitleMultiline() {
    this.parse("[foo]: /url 'two");
    this.verifyEq(LinkRefState.title(), this.#parser.state());
    this.verifyParaLines("[foo]: /url 'two", sys.ObjUtil.coerce(this.#parser, LinkReferenceDefinitionParser.type$));
    this.verifyEq(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.#parser.linkRefDefs().size(), sys.Obj.type$.toNullable()));
    this.parse("lines");
    this.verifyEq(LinkRefState.title(), this.#parser.state());
    this.verifyParaLines("[foo]: /url 'two\nlines", sys.ObjUtil.coerce(this.#parser, LinkReferenceDefinitionParser.type$));
    this.verifyEq(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.#parser.linkRefDefs().size(), sys.Obj.type$.toNullable()));
    this.parse("'");
    this.verifyEq(LinkRefState.start_definition(), this.#parser.state());
    this.verifyParaLines("", sys.ObjUtil.coerce(this.#parser, LinkReferenceDefinitionParser.type$));
    this.verifyEq(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.#parser.linkRefDefs().size(), sys.Obj.type$.toNullable()));
    this.verifyDef(sys.ObjUtil.coerce(this.#parser.linkRefDefs().first(), LinkReferenceDefinition.type$), "foo", sys.Uri.fromStr("/url"), "two\nlines\n");
    return;
  }

  testTitleMultiline2() {
    this.parse("[foo]: /url '");
    this.verifyEq(LinkRefState.title(), this.#parser.state());
    this.parse("title'");
    this.verifyEq(LinkRefState.start_definition(), this.#parser.state());
    this.verifyDef(sys.ObjUtil.coerce(this.#parser.linkRefDefs().first(), LinkReferenceDefinition.type$), "foo", sys.Uri.fromStr("/url"), "\ntitle");
    return;
  }

  testTitleMultiline3() {
    this.parse("[foo]: /url");
    this.verifyEq(LinkRefState.start_title(), this.#parser.state());
    this.parse("\"title\" bad");
    this.verifyEq(LinkRefState.paragraph(), this.#parser.state());
    this.verifyDef(sys.ObjUtil.coerce(this.#parser.linkRefDefs().first(), LinkReferenceDefinition.type$), "foo", sys.Uri.fromStr("/url"), null);
    return;
  }

  testTitleMultiline4() {
    this.parse("[foo]: /url");
    this.verifyEq(LinkRefState.start_title(), this.#parser.state());
    this.parse("(title");
    this.verifyEq(LinkRefState.title(), this.#parser.state());
    this.parse("foo(");
    this.verifyEq(LinkRefState.paragraph(), this.#parser.state());
    this.verifyDef(sys.ObjUtil.coerce(this.#parser.linkRefDefs().first(), LinkReferenceDefinition.type$), "foo", sys.Uri.fromStr("/url"), null);
    return;
  }

  testTitleInvalid() {
    this.verifyPara("[foo]: /url (invalid(");
    this.verifyPara("[foo]: </url>'title'");
    this.verifyPara("[foo]: /url 'title' INVALID");
    return;
  }

  parse(content) {
    this.#parser.parse(SourceLine.make(content));
    return;
  }

  verifyPara(input) {
    this.verifyState(input, LinkRefState.paragraph(), input);
    return;
  }

  verifyState(input,state,content) {
    let parser = LinkReferenceDefinitionParser.make();
    parser.parse(SourceLine.make(input));
    this.verifyEq(state, parser.state());
    this.verifyParaLines(content, parser);
    return;
  }

  verifyDef(def,label,dest,title) {
    this.verifyEq(label, def.label());
    this.verifyEq(dest.toStr(), def.destination());
    this.verifyEq(title, def.title());
    return;
  }

  verifyParaLines(expectedContent,parser) {
    let actual = parser.paragraphLines().content();
    this.verifyEq(expectedContent, actual);
    return;
  }

  static make() {
    const $self = new LinkReferenceDefinitionParserTest();
    LinkReferenceDefinitionParserTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class HtmlInlineParserTest extends CoreRenderingTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HtmlInlineParserTest.type$; }

  testComment() {
    this.verifyRendering("inline <!---->", "<p>inline <!----></p>\n");
    this.verifyRendering("inline <!-- -> -->", "<p>inline <!-- -> --></p>\n");
    this.verifyRendering("inline <!-- -- -->", "<p>inline <!-- -- --></p>\n");
    this.verifyRendering("inline <!-- --->", "<p>inline <!-- ---></p>\n");
    this.verifyRendering("inline <!-- ---->", "<p>inline <!-- ----></p>\n");
    this.verifyRendering("inline <!-->-->", "<p>inline <!-->--&gt;</p>\n");
    this.verifyRendering("inline <!--->-->", "<p>inline <!--->--&gt;</p>\n");
    return;
  }

  testCdata() {
    this.verifyRendering("inline <![CDATA[]]>", "<p>inline <![CDATA[]]></p>\n");
    this.verifyRendering("inline <![CDATA[ ] ]] ]]>", "<p>inline <![CDATA[ ] ]] ]]></p>\n");
    return;
  }

  testDeclaration() {
    this.verifyRendering("inline <!FOO>", "<p>inline &lt;!FOO&gt;</p>\n");
    this.verifyRendering("inline <!FOO >", "<p>inline <!FOO ></p>\n");
    this.verifyRendering("inline <!FOO 'bar'>", "<p>inline <!FOO 'bar'></p>\n");
    this.verifyRendering("inline <!foo bar>", "<p>inline <!foo bar></p>\n");
    return;
  }

  static make() {
    const $self = new HtmlInlineParserTest();
    HtmlInlineParserTest.make$($self);
    return $self;
  }

  static make$($self) {
    CoreRenderingTest.make$($self);
    return;
  }

}

class LinkReferenceDefinitionNodeTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LinkReferenceDefinitionNodeTest.type$; }

  testDefinitionWithoutParagraph() {
    let doc = this.parse("This is a paragraph with a [foo] link.\n\n[foo]: /url 'title'");
    let nodes = Node.children(doc);
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(nodes.size(), sys.Obj.type$.toNullable()));
    this.verifyType(nodes.get(0), Paragraph.type$);
    let def = this.verifyDef(nodes.get(1), "foo");
    this.verifyEq("/url", def.destination());
    this.verifyEq("title", def.title());
    return;
  }

  testDefinitionWithParagraph() {
    let doc = this.parse("[foo]: /url\nThis is a paragraph with a [foo] link.");
    let nodes = Node.children(doc);
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(nodes.size(), sys.Obj.type$.toNullable()));
    this.verifyType(nodes.get(0), LinkReferenceDefinition.type$);
    this.verify(sys.ObjUtil.is(nodes.get(1), Paragraph.type$));
    return;
  }

  testMultipleDefinitions() {
    let doc = this.parse("This is a paragraph with a [foo] link.\n\n[foo]: /url\n[bar]: /url");
    let nodes = Node.children(doc);
    this.verifyEq(sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(nodes.size(), sys.Obj.type$.toNullable()));
    this.verifyType(nodes.get(0), Paragraph.type$);
    this.verifyDef(nodes.get(1), "foo");
    this.verifyDef(nodes.get(2), "bar");
    return;
  }

  testMultipleDefinitionsWithSameLabel() {
    let doc = this.parse("This is a paragraph with a [foo] link.\n\n[foo]: /url1\n[foo]: /url2");
    let nodes = Node.children(doc);
    this.verifyEq(sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(nodes.size(), sys.Obj.type$.toNullable()));
    this.verifyType(nodes.get(0), Paragraph.type$);
    let def1 = this.verifyDef(nodes.get(1), "foo");
    this.verifyEq("/url1", def1.destination());
    let def2 = this.verifyDef(nodes.get(2), "foo");
    this.verifyEq("/url2", def2.destination());
    return;
  }

  testDefinitionOfReplacedBlock() {
    let doc = this.parse("[foo]: /url\nHeading\n=======");
    let nodes = Node.children(doc);
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(nodes.size(), sys.Obj.type$.toNullable()));
    this.verifyDef(nodes.get(0), "foo");
    this.verifyType(nodes.get(1), Heading.type$);
    return;
  }

  testDefinitionInListItem() {
    let doc = this.parse("* [foo]: /url\n  [foo]\n");
    this.verifyType(sys.ObjUtil.coerce(doc.firstChild(), sys.Obj.type$), BulletList.type$);
    let item = doc.firstChild().firstChild();
    this.verifyType(sys.ObjUtil.coerce(item, sys.Obj.type$), ListItem.type$);
    let nodes = Node.children(sys.ObjUtil.coerce(item, Node.type$));
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(nodes.size(), sys.Obj.type$.toNullable()));
    this.verifyDef(nodes.get(0), "foo");
    this.verifyType(nodes.get(1), Paragraph.type$);
    return;
  }

  testDefinitionInListItem2() {
    let doc = this.parse("* [foo]: /url\n* [foo]\n");
    this.verifyType(sys.ObjUtil.coerce(doc.firstChild(), sys.Obj.type$), BulletList.type$);
    let items = Node.children(sys.ObjUtil.coerce(doc.firstChild(), Node.type$));
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(items.size(), sys.Obj.type$.toNullable()));
    let item1 = items.get(0);
    let item2 = items.get(1);
    this.verifyType(item1, ListItem.type$);
    this.verifyType(item2, ListItem.type$);
    this.verifyEq(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(Node.children(item1).size(), sys.Obj.type$.toNullable()));
    this.verifyDef(sys.ObjUtil.coerce(item1.firstChild(), Node.type$), "foo");
    this.verifyEq(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(Node.children(item2).size(), sys.Obj.type$.toNullable()));
    this.verifyType(sys.ObjUtil.coerce(item2.firstChild(), sys.Obj.type$), Paragraph.type$);
    return;
  }

  testDefinitionLabelCaseIsPreserved() {
    let doc = this.parse("This is a paragraph with a [foo] link.\n\n[fOo]: /url 'title'");
    let nodes = Node.children(doc);
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(nodes.size(), sys.Obj.type$.toNullable()));
    this.verifyType(nodes.get(0), Paragraph.type$);
    this.verifyDef(nodes.get(1), "fOo");
    return;
  }

  verifyDef(node,label) {
    this.verify(sys.ObjUtil.is(node, LinkReferenceDefinition.type$));
    let def = sys.ObjUtil.as(node, LinkReferenceDefinition.type$);
    this.verifyEq(label, def.label());
    return sys.ObjUtil.coerce(def, LinkReferenceDefinition.type$);
  }

  parse(input) {
    return Parser.make().parse(input);
  }

  static make() {
    const $self = new LinkReferenceDefinitionNodeTest();
    LinkReferenceDefinitionNodeTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class ThematicBreakParserTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ThematicBreakParserTest.type$; }

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

  setup() {
    this.#parser = Parser.make();
    return;
  }

  testLiteral() {
    this.verifyLiteral("***", "***");
    this.verifyLiteral("-- -", "-- -");
    this.verifyLiteral("  __  __  __  ", "  __  __  __  ");
    this.verifyLiteral("***", "> ***");
    return;
  }

  verifyLiteral(expected,input) {
    let tb = sys.ObjUtil.as(Node.find(this.#parser.parse(input), ThematicBreak.type$), ThematicBreak.type$);
    this.verifyNotNull(tb);
    this.verifyEq(expected, tb.literal());
    return;
  }

  static make() {
    const $self = new ThematicBreakParserTest();
    ThematicBreakParserTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class SourceLineTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SourceLineTest.type$; }

  testSubstring() {
    const this$ = this;
    let line = SourceLine.make("abcd", SourceSpan.make(3, 10, 4));
    this.verifySourceLine(line.substring(0, 4), "abcd", SourceSpan.make(3, 10, 4));
    this.verifySourceLine(line.substring(0, 3), "abc", SourceSpan.make(3, 10, 3));
    this.verifySourceLine(line.substring(0, 2), "ab", SourceSpan.make(3, 10, 2));
    this.verifySourceLine(line.substring(0, 1), "a", SourceSpan.make(3, 10, 1));
    this.verifySourceLine(line.substring(1, 4), "bcd", SourceSpan.make(3, 11, 3));
    this.verifySourceLine(line.substring(1, 3), "bc", SourceSpan.make(3, 11, 2));
    this.verifySourceLine(line.substring(3, 4), "d", SourceSpan.make(3, 13, 1));
    this.verifySourceLine(line.substring(4, 4), "", null);
    this.verifyErr(sys.IndexErr.type$, (it) => {
      SourceLine.make("abcd", SourceSpan.make(3, 10, 4)).substring(3, 2);
      return;
    });
    this.verifyErr(sys.IndexErr.type$, (it) => {
      SourceLine.make("abcd", SourceSpan.make(3, 10, 4)).substring(0, 5);
      return;
    });
    return;
  }

  verifySourceLine(line,expectedContent,expectedSourceSpan) {
    this.verifyEq(expectedContent, line.content());
    this.verifyEq(expectedSourceSpan, line.sourceSpan());
    return;
  }

  static make() {
    const $self = new SourceLineTest();
    SourceLineTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class PathologicalTest extends CoreRenderingTest {
  constructor() {
    super();
    const this$ = this;
    this.#x = 100000;
    return;
  }

  typeof() { return PathologicalTest.type$; }

  #x = 0;

  // private field reflection only
  __x(it) { if (it === undefined) return this.#x; else this.#x = it; }

  testNestedStrongEmphasis() {
    this.#x = 100;
    this.verifyRendering(sys.Str.plus(sys.Str.plus(sys.Str.mult("*a **a ", this.#x), "b"), sys.Str.mult(" a** a*", this.#x)), sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("<p>", sys.Str.mult("<em>a <strong>a ", this.#x)), "b"), sys.Str.mult(" a</strong> a</em>", this.#x)), "</p>\n"));
    return;
  }

  testEmphasisClosersWithNoOpeners() {
    this.verifyRendering(sys.Str.mult("a_ ", this.#x), sys.Str.plus(sys.Str.plus("<p>", sys.Str.mult("a_ ", sys.Int.minus(this.#x, 1))), "a_</p>\n"));
    return;
  }

  testEmphasisOpenersWithNoClosers() {
    this.verifyRendering(sys.Str.mult("_a ", this.#x), sys.Str.plus(sys.Str.plus("<p>", sys.Str.mult("_a ", sys.Int.minus(this.#x, 1))), "_a</p>\n"));
    return;
  }

  testLinkClosersWithNoOpeners() {
    this.verifyRendering(sys.Str.mult("a] ", this.#x), sys.Str.plus(sys.Str.plus("<p>", sys.Str.mult("a] ", sys.Int.minus(this.#x, 1))), "a]</p>\n"));
    return;
  }

  testLinkOpenersWithNoCloser() {
    this.verifyRendering(sys.Str.mult("[ a_ ", this.#x), sys.Str.plus(sys.Str.plus("<p>", sys.Str.mult("[ a_ ", sys.Int.minus(this.#x, 1))), "[ a_</p>\n"));
    return;
  }

  testMismatchedOpenersAndClosers() {
    this.verifyRendering(sys.Str.mult("*a_ ", this.#x), sys.Str.plus(sys.Str.plus("<p>", sys.Str.mult("*a_ ", sys.Int.minus(this.#x, 1))), "*a_</p>\n"));
    return;
  }

  testNestedBrackets() {
    this.#x = 50000;
    this.verifyRendering(sys.Str.plus(sys.Str.plus(sys.Str.mult("[", this.#x), "a"), sys.Str.mult("]", this.#x)), sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("<p>", sys.Str.mult("[", this.#x)), "a"), sys.Str.mult("]", this.#x)), "</p>\n"));
    return;
  }

  testNestedBlockQuotes() {
    this.#x = 250;
    this.verifyRendering(sys.Str.plus(sys.Str.mult("> ", this.#x), "a\n"), sys.Str.plus(sys.Str.plus(sys.Str.mult("<blockquote>\n", this.#x), "<p>a</p>\n"), sys.Str.mult("</blockquote>\n", this.#x)));
    return;
  }

  testHugeHorizontalRule() {
    this.verifyRendering("****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************\n", "<hr />\n");
    return;
  }

  testBackslashInLink() {
    this.verifyRendering(sys.Str.plus(sys.Str.plus("[", sys.Str.mult("\\", this.#x)), "\n"), sys.Str.plus(sys.Str.plus("<p>[", sys.Str.mult("\\", sys.Int.div(this.#x, 2))), "</p>\n"));
    return;
  }

  testUnclosedInlineLinks() {
    this.verifyRendering(sys.Str.plus(sys.Str.mult("[](", this.#x), "\n"), sys.Str.plus(sys.Str.plus("<p>", sys.Str.mult("[](", this.#x)), "</p>\n"));
    return;
  }

  static make() {
    const $self = new PathologicalTest();
    PathologicalTest.make$($self);
    return $self;
  }

  static make$($self) {
    CoreRenderingTest.make$($self);
    ;
    return;
  }

}

class ParserTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ParserTest.type$; }

  testCustomBlockFactory() {
    let parser = Parser.builder().customBlockParserFactory(TestDashBlockParserFactory.make()).build();
    let doc = parser.parse("hey\n\n---\n");
    this.verifyType(sys.ObjUtil.coerce(doc.firstChild(), sys.Obj.type$), Paragraph.type$);
    this.verifyEq("hey", sys.ObjUtil.coerce(doc.firstChild().firstChild(), Text.type$).literal());
    this.verifyType(sys.ObjUtil.coerce(doc.lastChild(), sys.Obj.type$), TestDashBlock.type$);
    return;
  }

  testEnabledBlockTypes() {
    let given = "# heading 1\n\nnot a heading";
    let parser = Parser.make();
    let doc = parser.parse(given);
    this.verifyType(sys.ObjUtil.coerce(doc.firstChild(), sys.Obj.type$), Heading.type$);
    (parser = Parser.builder().withEnabledBlockTypes(sys.List.make(sys.Type.type$, [Heading.type$])).build());
    (doc = parser.parse(given));
    this.verifyType(sys.ObjUtil.coerce(doc.firstChild(), sys.Obj.type$), Heading.type$);
    (parser = Parser.builder().withEnabledBlockTypes(sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("sys::Type[]"))).build());
    (doc = parser.parse(given));
    this.verify(!sys.ObjUtil.is(doc.firstChild(), Heading.type$));
    return;
  }

  testEnabledBlockTypesThrowsWhenGivenUnknownType() {
    const this$ = this;
    this.verifyErr(sys.ArgErr.type$, (it) => {
      Parser.builder().withEnabledBlockTypes(sys.List.make(sys.Type.type$, [Heading.type$, BulletList.type$])).build();
      return;
    });
    return;
  }

  testIndentation() {
    let given = " - 1 space\n   - 3 spaces\n     - 5 spaces\n\t - tab + space";
    let doc = Parser.make().parse(given);
    this.verifyType(sys.ObjUtil.coerce(doc.firstChild(), sys.Obj.type$), BulletList.type$);
    let list = doc.firstChild();
    this.verifySame(list.firstChild(), list.lastChild());
    this.verifyEq("1 space", this.firstText(sys.ObjUtil.coerce(list.firstChild(), Node.type$)));
    (list = list.firstChild().lastChild());
    this.verifySame(list.firstChild(), list.lastChild());
    this.verifyEq("3 spaces", this.firstText(sys.ObjUtil.coerce(list.firstChild(), Node.type$)));
    (list = list.firstChild().lastChild());
    this.verifyEq("5 spaces", this.firstText(sys.ObjUtil.coerce(list.firstChild(), Node.type$)));
    this.verifyEq("tab + space", this.firstText(sys.ObjUtil.coerce(list.firstChild().next(), Node.type$)));
    return;
  }

  firstText(n) {
    while (!sys.ObjUtil.is(n, Text.type$)) {
      this.verifyNotNull(n);
      (n = sys.ObjUtil.coerce(n.firstChild(), Node.type$));
    }
    ;
    return sys.ObjUtil.coerce(n, Text.type$).literal();
  }

  static make() {
    const $self = new ParserTest();
    ParserTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class TestDashBlock extends CustomBlock {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TestDashBlock.type$; }

  static make() {
    const $self = new TestDashBlock();
    TestDashBlock.make$($self);
    return $self;
  }

  static make$($self) {
    CustomBlock.make$($self);
    return;
  }

}

class TestDashBlockParser extends BlockParser {
  constructor() {
    super();
    const this$ = this;
    this.#block = TestDashBlock.make();
    return;
  }

  typeof() { return TestDashBlockParser.type$; }

  #block = null;

  block() {
    return this.#block;
  }

  tryContinue(state) {
    return BlockContinue.none();
  }

  static make() {
    const $self = new TestDashBlockParser();
    TestDashBlockParser.make$($self);
    return $self;
  }

  static make$($self) {
    BlockParser.make$($self);
    ;
    return;
  }

}

class TestDashBlockParserFactory extends BlockParserFactory {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TestDashBlockParserFactory.type$; }

  tryStart(state,parser) {
    if (sys.ObjUtil.equals(state.line().content(), "---")) {
      return BlockStart.of(sys.List.make(TestDashBlockParser.type$, [TestDashBlockParser.make()]));
    }
    ;
    return BlockStart.none();
  }

  static make() {
    const $self = new TestDashBlockParserFactory();
    TestDashBlockParserFactory.make$($self);
    return $self;
  }

  static make$($self) {
    BlockParserFactory.make$($self);
    return;
  }

}

class HtmlRendererTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HtmlRendererTest.type$; }

  testHtmlAllowingShouldNotEscapeInlineHtml() {
    let r = HtmlRendererTest.htmlAllowing().render(HtmlRendererTest.parse("paragraph with <span id='foo' class=\"bar\">inline &amp; html</span>"));
    this.verifyEq("<p>paragraph with <span id='foo' class=\"bar\">inline &amp; html</span></p>\n", r);
    return;
  }

  testHtmlAllowingShouldNotEscapeBlockHtml() {
    let r = HtmlRendererTest.htmlAllowing().render(HtmlRendererTest.parse("<div id='foo' class=\"bar\">block &amp;</div>"));
    this.verifyEq("<div id='foo' class=\"bar\">block &amp;</div>\n", r);
    return;
  }

  testHtmlEscapingShouldEscapeInlineHtml() {
    let r = HtmlRendererTest.htmlEscaping().render(HtmlRendererTest.parse("paragraph with <span id='foo' class=\"bar\">inline &amp; html</span>"));
    this.verifyEq("<p>paragraph with &lt;span id='foo' class=&quot;bar&quot;&gt;inline &amp; html&lt;/span&gt;</p>\n", r);
    return;
  }

  testHtmlEscapingShouldEscapeHtmlBlocks() {
    let r = HtmlRendererTest.htmlEscaping().render(HtmlRendererTest.parse("<div id='foo' class=\"bar\">block &amp;</div>"));
    this.verifyEq("<p>&lt;div id='foo' class=&quot;bar&quot;&gt;block &amp;amp;&lt;/div&gt;</p>\n", r);
    return;
  }

  testTextEscaping() {
    let r = HtmlRendererTest.def().render(HtmlRendererTest.parse("escaping: & < > \" '"));
    this.verifyEq("<p>escaping: &amp; &lt; &gt; &quot; '</p>\n", r);
    return;
  }

  testCharacterReferencesWithoutSemicolonsShouldNotBeParsedShouldBeEscaped() {
    let input = "[example](&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29)";
    let r = HtmlRendererTest.def().render(HtmlRendererTest.parse(input));
    this.verifyEq("<p><a href=\"&amp;#x6A&amp;#x61&amp;#x76&amp;#x61&amp;#x73&amp;#x63&amp;#x72&amp;#x69&amp;#x70&amp;#x74&amp;#x3A&amp;#x61&amp;#x6C&amp;#x65&amp;#x72&amp;#x74&amp;#x28&amp;#x27&amp;#x58&amp;#x53&amp;#x53&amp;#x27&amp;#x29\">example</a></p>\n", r);
    return;
  }

  testAttributeEscaping() {
    let p = Paragraph.make();
    p.appendChild(Link.make("&colon;"));
    this.verifyEq("<p><a href=\"&amp;colon;\"></a></p>\n", HtmlRendererTest.def().render(p));
    return;
  }

  testRawUrlsShouldNotFilterDangerousProtocols() {
    let p = Paragraph.make();
    p.appendChild(Link.make("javascript:alert(5);"));
    this.verifyEq("<p><a href=\"javascript:alert(5);\"></a></p>\n", HtmlRendererTest.raw().render(p));
    return;
  }

  testSanitizedUrlsShouldSetRelNoFollow() {
    let p = Paragraph.make();
    p.appendChild(Link.make("/exampleUrl"));
    this.verifyEq("<p><a rel=\"nofollow\" href=\"/exampleUrl\"></a></p>\n", HtmlRendererTest.sanitize().render(p));
    (p = Paragraph.make());
    p.appendChild(Link.make("https://google.com"));
    this.verifyEq("<p><a rel=\"nofollow\" href=\"https://google.com\"></a></p>\n", HtmlRendererTest.sanitize().render(p));
    return;
  }

  testSanitzieUrlsShouldAllowSafeProtocols() {
    this.verifyEq("<p><a rel=\"nofollow\" href=\"http://google.com\"></a></p>\n", HtmlRendererTest.sanitize().render(sys.ObjUtil.coerce(Paragraph.make().appendChild(Link.make("http://google.com")), Paragraph.type$)));
    this.verifyEq("<p><a rel=\"nofollow\" href=\"https://google.com\"></a></p>\n", HtmlRendererTest.sanitize().render(sys.ObjUtil.coerce(Paragraph.make().appendChild(Link.make("https://google.com")), Paragraph.type$)));
    this.verifyEq("<p><a rel=\"nofollow\" href=\"mailto:foo@bar.example.com\"></a></p>\n", HtmlRendererTest.sanitize().render(sys.ObjUtil.coerce(Paragraph.make().appendChild(Link.make("mailto:foo@bar.example.com")), Paragraph.type$)));
    let image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAAQSURBVBhXY/iPBVBf8P9/AG8TY51nJdgkAAAAAElFTkSuQmCC";
    this.verifyEq(sys.Str.plus(sys.Str.plus("<p><a rel=\"nofollow\" href=\"", image), "\"></a></p>\n"), HtmlRendererTest.sanitize().render(sys.ObjUtil.coerce(Paragraph.make().appendChild(Link.make(image)), Paragraph.type$)));
    return;
  }

  testSanitizeUrlsShouldFilterDangerousProtocols() {
    this.verifyEq("<p><a rel=\"nofollow\" href=\"\"></a></p>\n", HtmlRendererTest.sanitize().render(sys.ObjUtil.coerce(Paragraph.make().appendChild(Link.make("javascript:alert(5)")), Paragraph.type$)));
    this.verifyEq("<p><a rel=\"nofollow\" href=\"\"></a></p>\n", HtmlRendererTest.sanitize().render(sys.ObjUtil.coerce(Paragraph.make().appendChild(Link.make("ftp://google.com")), Paragraph.type$)));
    return;
  }

  testPercentEncodeUrlDisabled() {
    this.verifyEq("<p><a href=\"foo&amp;bar\">a</a></p>\n", HtmlRendererTest.def().render(HtmlRendererTest.parse("[a](foo&amp;bar)")));
    this.verifyEq("<p><a href=\"\u00e4\">a</a></p>\n", HtmlRendererTest.def().render(HtmlRendererTest.parse("[a](\u00e4)")));
    this.verifyEq("<p><a href=\"foo%20bar\">a</a></p>\n", HtmlRendererTest.def().render(HtmlRendererTest.parse("[a](foo%20bar)")));
    return;
  }

  testPercentEncodeUrl() {
    this.verifyEq("<p><a href=\"foo&amp;bar\">a</a></p>\n", HtmlRendererTest.percentEnc().render(HtmlRendererTest.parse("[a](foo&amp;bar)")));
    this.verifyEq("<p><a href=\"foo%20bar\">a</a></p>\n", HtmlRendererTest.percentEnc().render(HtmlRendererTest.parse("[a](foo%20bar)")));
    this.verifyEq("<p><a href=\"foo%61\">a</a></p>\n", HtmlRendererTest.percentEnc().render(HtmlRendererTest.parse("[a](foo%61)")));
    this.verifyEq("<p><a href=\"foo%25\">a</a></p>\n", HtmlRendererTest.percentEnc().render(HtmlRendererTest.parse("[a](foo%)")));
    this.verifyEq("<p><a href=\"foo%25a\">a</a></p>\n", HtmlRendererTest.percentEnc().render(HtmlRendererTest.parse("[a](foo%a)")));
    this.verifyEq("<p><a href=\"foo%25a_\">a</a></p>\n", HtmlRendererTest.percentEnc().render(HtmlRendererTest.parse("[a](foo%a_)")));
    this.verifyEq("<p><a href=\"foo%25xx\">a</a></p>\n", HtmlRendererTest.percentEnc().render(HtmlRendererTest.parse("[a](foo%xx)")));
    this.verifyEq("<p><a href=\"!*'();:@&amp;=+\$,/?#%5B%5D\">a</a></p>\n", HtmlRendererTest.percentEnc().render(HtmlRendererTest.parse("[a](!*'();:@&=+\$,/?#[])")));
    this.verifyEq("<p><a href=\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~\">a</a></p>\n", HtmlRendererTest.percentEnc().render(HtmlRendererTest.parse("[a](ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~)")));
    this.verifyEq("<p><a href=\"%C3%A4\">a</a></p>\n", HtmlRendererTest.percentEnc().render(HtmlRendererTest.parse("[a](\u00e4)")));
    return;
  }

  testOrderedListStartZero() {
    this.verifyEq("<ol start=\"0\">\n<li>Test</li>\n</ol>\n", HtmlRendererTest.def().render(HtmlRendererTest.parse("0. Test\n")));
    return;
  }

  testImageAltTextWithSoftLineBreak() {
    this.verifyEq("<p><img src=\"/url\" alt=\"foo\nbar\" /></p>\n", HtmlRendererTest.def().render(HtmlRendererTest.parse("![foo\nbar](/url)\n")));
    return;
  }

  testAltTextWithHardLineBreak() {
    this.verifyEq("<p><img src=\"/url\" alt=\"foo\nbar\" /></p>\n", HtmlRendererTest.def().render(HtmlRendererTest.parse("![foo  \nbar](/url)\n")));
    return;
  }

  testImageAltTextWithEntities() {
    this.verifyEq("<p><img src=\"/url\" alt=\"foo \u00e4\" /></p>\n", HtmlRendererTest.def().render(HtmlRendererTest.parse("![foo &auml;](/url)\n")));
    return;
  }

  testCanRenderContentsOfSingleParagraph() {
    let paras = HtmlRendererTest.parse("Here I have a test [link](http://www.google.com)");
    let para = paras.firstChild();
    let doc = Document.make();
    let child = para.firstChild();
    while (child != null) {
      let cur = child;
      (child = cur.next());
      doc.appendChild(sys.ObjUtil.coerce(cur, Node.type$));
    }
    ;
    this.verifyEq("Here I have a test <a href=\"http://www.google.com\">link</a>", HtmlRendererTest.def().render(doc));
    return;
  }

  testOmitSingleParagraphP() {
    let r = HtmlRenderer.builder().withOmitSingleParagraphP(true).build();
    this.verifyEq("hi <em>there</em>", r.render(HtmlRendererTest.parse("hi *there*")));
    return;
  }

  static def() {
    return sys.ObjUtil.coerce(HtmlRenderer.make(), HtmlRenderer.type$);
  }

  static htmlAllowing() {
    return HtmlRenderer.builder().withEscapeHtml(false).build();
  }

  static htmlEscaping() {
    return HtmlRenderer.builder().withEscapeHtml(true).build();
  }

  static raw() {
    return HtmlRenderer.builder().withSanitizeUrls(false).build();
  }

  static sanitize() {
    return HtmlRenderer.builder().withSanitizeUrls(true).build();
  }

  static percentEnc() {
    return HtmlRenderer.builder().withPercentEncodeUrls(true).build();
  }

  static parse(source) {
    return Parser.make().parse(source);
  }

  static make() {
    const $self = new HtmlRendererTest();
    HtmlRendererTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class ListBlockParserTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ListBlockParserTest.type$; }

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

  setup() {
    sys.Test.prototype.setup.call(this);
    this.#parser = Parser.make();
    return;
  }

  testBulletListIndents() {
    this.verifyListItemIndents("* foo", 0, 2);
    this.verifyListItemIndents(" * foo", 1, 3);
    this.verifyListItemIndents("  * foo", 2, 4);
    this.verifyListItemIndents("   * foo", 3, 5);
    this.verifyListItemIndents("*  foo", 0, 3);
    this.verifyListItemIndents("*   foo", 0, 4);
    this.verifyListItemIndents("*    foo", 0, 5);
    this.verifyListItemIndents(" *  foo", 1, 4);
    this.verifyListItemIndents("   *    foo", 3, 8);
    this.verifyListItemIndents("*\tfoo", 0, 4);
    this.verifyListItemIndents("-\n", 0, 2);
    this.verifyListItemIndents("> * foo", 0, 2);
    this.verifyListItemIndents(">  * foo", 1, 3);
    this.verifyListItemIndents(">  *  foo", 1, 4);
    return;
  }

  testOrderedListIndents() {
    this.verifyListItemIndents("1. foo", 0, 3);
    this.verifyListItemIndents(" 1. foo", 1, 4);
    this.verifyListItemIndents("  1. foo", 2, 5);
    this.verifyListItemIndents("   1. foo", 3, 6);
    this.verifyListItemIndents("1.  foo", 0, 4);
    this.verifyListItemIndents("1.   foo", 0, 5);
    this.verifyListItemIndents("1.    foo", 0, 6);
    this.verifyListItemIndents(" 1.  foo", 1, 5);
    this.verifyListItemIndents("  1.    foo", 2, 8);
    this.verifyListItemIndents("1.\tfoo", 0, 4);
    this.verifyListItemIndents("> 1. foo", 0, 3);
    this.verifyListItemIndents(">  1. foo", 1, 4);
    this.verifyListItemIndents(">  1.  foo", 1, 5);
    return;
  }

  verifyListItemIndents(input,expectedMarkerIndent,expectedContentIndent) {
    let doc = this.#parser.parse(input);
    let listItem = sys.ObjUtil.as(Node.find(doc, ListItem.type$), ListItem.type$);
    this.verifyEq(sys.ObjUtil.coerce(expectedMarkerIndent, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(listItem.markerIndent(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(expectedContentIndent, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(listItem.contentIndent(), sys.Obj.type$.toNullable()));
    return;
  }

  static make() {
    const $self = new ListBlockParserTest();
    ListBlockParserTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class CommonMarkSpecTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
    this.#specFile = sys.Env.cur().homeDir().plus(sys.Uri.fromStr("etc/markdown/tests/spec.json"));
    this.#bySection = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Obj:sys::Obj?]")), sys.Type.find("[sys::Str:markdown::Example[]]"));
    return;
  }

  typeof() { return CommonMarkSpecTest.type$; }

  #specFile = null;

  // private field reflection only
  __specFile(it) { if (it === undefined) return this.#specFile; else this.#specFile = it; }

  #bySection = null;

  bySection(it) {
    if (it === undefined) {
      return this.#bySection;
    }
    else {
      this.#bySection = it;
      return;
    }
  }

  examples() {
    return sys.ObjUtil.coerce(this.#bySection.vals().flatten(), sys.Type.find("markdown::Example[]"));
  }

  expectedFailures() {
    return sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(208, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(356, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(542, sys.Obj.type$.toNullable())]);
  }

  examplesToRun() {
    return this.examples();
  }

  test() {
    const this$ = this;
    if (!this.init()) {
      return;
    }
    ;
    let results = sys.List.make(ExampleRes.type$);
    this.examplesToRun().each((example) => {
      results.add(this$.run(example));
      return;
    });
    let failedCount = 0;
    results.each((result) => {
      if (result.failed()) {
        let ex = result.example();
        if (this$.expectedFailures().contains(sys.ObjUtil.coerce(ex.id(), sys.Obj.type$.toNullable()))) {
          return;
        }
        ;
        failedCount = sys.Int.increment(failedCount);
        sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", ex.section()), ": "), sys.ObjUtil.coerce(ex.id(), sys.Obj.type$.toNullable())), "\n=== Markdown\n"), ex.markdown()), "\n=== Expected\n"), ex.html()), "\n=== Actual\n"), result.rendered()), "\n===\n"), result.err().traceToStr()));
      }
      ;
      return;
    });
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Int.minus(results.size(), failedCount), sys.Obj.type$.toNullable())), "/"), sys.ObjUtil.coerce(results.size(), sys.Obj.type$.toNullable())), " tests passed."));
    if (sys.ObjUtil.compareGT(failedCount, 0)) {
      this.fail("CommonMark spec tests did not pass.");
    }
    ;
    return;
  }

  init() {
    const this$ = this;
    if (!this.#specFile.exists()) {
      sys.ObjUtil.echo("\n************ WARNING ***********\n\nCommon Mark spec.json not found.\nSkipping tests.\n\n********************************\n");
      return false;
    }
    ;
    let in$ = this.#specFile.in();
    try {
      let arr = sys.ObjUtil.coerce(sys.ObjUtil.trap(sys.Type.find("util::JsonInStream").make(sys.List.make(sys.InStream.type$, [this.#specFile.in()])),"readJson", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Type.find("sys::Map[]"));
      arr.each((json) => {
        let example = Example.make(json);
        this$.#bySection.getOrAdd(example.section(), (section) => {
          return sys.List.make(Example.type$);
        }).add(example);
        return;
      });
    }
    finally {
      in$.close();
    }
    ;
    return true;
  }

  static make() {
    const $self = new CommonMarkSpecTest();
    CommonMarkSpecTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    ;
    return;
  }

}

class HtmlCoreSpecTest extends CommonMarkSpecTest {
  constructor() {
    super();
    const this$ = this;
    this.#parser = sys.ObjUtil.coerce(Parser.make(), Parser.type$);
    this.#renderer = HtmlRenderer.builder().withPercentEncodeUrls().build();
    return;
  }

  typeof() { return HtmlCoreSpecTest.type$; }

  #parser = null;

  // private field reflection only
  __parser(it) { if (it === undefined) return this.#parser; else this.#parser = it; }

  #renderer = null;

  // private field reflection only
  __renderer(it) { if (it === undefined) return this.#renderer; else this.#renderer = it; }

  run(example) {
    let r = null;
    try {
      let doc = this.#parser.parse(example.markdown());
      (r = this.#renderer.render(doc));
      this.verifyEq(example.html(), r);
      return ExampleRes.makeOk(example);
    }
    catch ($_u118) {
      $_u118 = sys.Err.make($_u118);
      if ($_u118 instanceof sys.Err) {
        let err = $_u118;
        ;
        return ExampleRes.make(example, err, r);
      }
      else {
        throw $_u118;
      }
    }
    ;
  }

  static make() {
    const $self = new HtmlCoreSpecTest();
    HtmlCoreSpecTest.make$($self);
    return $self;
  }

  static make$($self) {
    CommonMarkSpecTest.make$($self);
    ;
    return;
  }

}

class ExampleRes extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExampleRes.type$; }

  #example = null;

  example() { return this.#example; }

  __example(it) { if (it === undefined) return this.#example; else this.#example = it; }

  #err = null;

  err() { return this.#err; }

  __err(it) { if (it === undefined) return this.#err; else this.#err = it; }

  #rendered = null;

  rendered() { return this.#rendered; }

  __rendered(it) { if (it === undefined) return this.#rendered; else this.#rendered = it; }

  static makeOk(example) {
    const $self = new ExampleRes();
    ExampleRes.makeOk$($self,example);
    return $self;
  }

  static makeOk$($self,example) {
    ExampleRes.make$($self, example, null, null);
    return;
  }

  static make(example,err,rendered) {
    const $self = new ExampleRes();
    ExampleRes.make$($self,example,err,rendered);
    return $self;
  }

  static make$($self,example,err,rendered) {
    $self.#example = example;
    $self.#err = err;
    $self.#rendered = rendered;
    return;
  }

  failed() {
    return this.#err != null;
  }

}

class Example extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Example.type$; }

  #json = null;

  json() { return this.#json; }

  __json(it) { if (it === undefined) return this.#json; else this.#json = it; }

  static make(json) {
    const $self = new Example();
    Example.make$($self,json);
    return $self;
  }

  static make$($self,json) {
    $self.#json = sys.ObjUtil.coerce(((this$) => { let $_u119 = json; if ($_u119 == null) return null; return sys.ObjUtil.toImmutable(json); })($self), sys.Type.find("sys::Map"));
    return;
  }

  markdown() {
    return sys.ObjUtil.coerce(this.#json.get("markdown"), sys.Str.type$);
  }

  html() {
    return sys.ObjUtil.coerce(this.#json.get("html"), sys.Str.type$);
  }

  id() {
    return sys.ObjUtil.coerce(this.#json.get("example"), sys.Int.type$);
  }

  section() {
    return sys.ObjUtil.coerce(this.#json.get("section"), sys.Str.type$);
  }

  toStr() {
    return sys.Str.plus("", sys.ObjUtil.coerce(this.id(), sys.Obj.type$.toNullable()));
  }

}

class TableMarkdownRendererTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TableMarkdownRendererTest.type$; }

  static #exts = undefined;

  static exts() {
    if (TableMarkdownRendererTest.#exts === undefined) {
      TableMarkdownRendererTest.static$init();
      if (TableMarkdownRendererTest.#exts === undefined) TableMarkdownRendererTest.#exts = null;
    }
    return TableMarkdownRendererTest.#exts;
  }

  static #parser = undefined;

  static parser() {
    if (TableMarkdownRendererTest.#parser === undefined) {
      TableMarkdownRendererTest.static$init();
      if (TableMarkdownRendererTest.#parser === undefined) TableMarkdownRendererTest.#parser = null;
    }
    return TableMarkdownRendererTest.#parser;
  }

  static #renderer = undefined;

  static renderer() {
    if (TableMarkdownRendererTest.#renderer === undefined) {
      TableMarkdownRendererTest.static$init();
      if (TableMarkdownRendererTest.#renderer === undefined) TableMarkdownRendererTest.#renderer = null;
    }
    return TableMarkdownRendererTest.#renderer;
  }

  testHeadNoBody() {
    this.verifyRoundTrip("|Abc|\n|---|\n");
    this.verifyRoundTrip("|Abc|Def|\n|---|---|\n|1|2|\n");
    return;
  }

  testBodyHasFewerColumns() {
    this.verifyRoundTrip("|Abc|Def|\n|---|---|\n|1||\n");
    return;
  }

  testAlignment() {
    this.verifyRoundTrip("|Abc|Def|\n|:---|---|\n|1|2|\n");
    this.verifyRoundTrip("|Abc|Def|\n|---|---:|\n|1|2|\n");
    this.verifyRoundTrip("|Abc|Def|\n|:---:|:---:|\n|1|2|\n");
    return;
  }

  testInsideBlockQuote() {
    this.verifyRoundTrip("> |Abc|Def|\n> |---|---|\n> |1|2|\n");
    return;
  }

  testMultipleTables() {
    this.verifyRoundTrip("|Abc|Def|\n|---|---|\n\n|One|\n|---|\n|Only|\n");
    return;
  }

  testEscaping() {
    this.verifyRoundTrip("|Abc|Def|\n|---|---|\n|Pipe in|text \\||\n");
    this.verifyRoundTrip("|Abc|Def|\n|---|---|\n|Pipe in|code `\\|`|\n");
    this.verifyRoundTrip("|Abc|Def|\n|---|---|\n|Inline HTML|<span>Foo\\|bar</span>|\n");
    return;
  }

  testEscaped() {
    this.verifyRoundTrip("\\|Abc\\|\n\\|---\\|\n");
    return;
  }

  render(source) {
    return TableMarkdownRendererTest.renderer().render(TableMarkdownRendererTest.parser().parse(source));
  }

  verifyRoundTrip(input) {
    let rendered = this.render(input);
    this.verifyEq(input, rendered);
    return;
  }

  static make() {
    const $self = new TableMarkdownRendererTest();
    TableMarkdownRendererTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

  static static$init() {
    TableMarkdownRendererTest.#exts = sys.ObjUtil.coerce(((this$) => { let $_u120 = sys.List.make(MarkdownExt.type$, [TablesExt.make()]); if ($_u120 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(MarkdownExt.type$, [TablesExt.make()])); })(this), sys.Type.find("markdown::MarkdownExt[]"));
    TableMarkdownRendererTest.#parser = Parser.builder().extensions(TableMarkdownRendererTest.#exts).build();
    TableMarkdownRendererTest.#renderer = MarkdownRenderer.builder().extensions(TableMarkdownRendererTest.#exts).build();
    return;
  }

}

class ImgAttrsExtTest extends RenderingTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ImgAttrsExtTest.type$; }

  static #exts = undefined;

  static exts() {
    if (ImgAttrsExtTest.#exts === undefined) {
      ImgAttrsExtTest.static$init();
      if (ImgAttrsExtTest.#exts === undefined) ImgAttrsExtTest.#exts = null;
    }
    return ImgAttrsExtTest.#exts;
  }

  static #parser = undefined;

  static parser() {
    if (ImgAttrsExtTest.#parser === undefined) {
      ImgAttrsExtTest.static$init();
      if (ImgAttrsExtTest.#parser === undefined) ImgAttrsExtTest.#parser = null;
    }
    return ImgAttrsExtTest.#parser;
  }

  static #renderer = undefined;

  static renderer() {
    if (ImgAttrsExtTest.#renderer === undefined) {
      ImgAttrsExtTest.static$init();
      if (ImgAttrsExtTest.#renderer === undefined) ImgAttrsExtTest.#renderer = null;
    }
    return ImgAttrsExtTest.#renderer;
  }

  static #md = undefined;

  static md() {
    if (ImgAttrsExtTest.#md === undefined) {
      ImgAttrsExtTest.static$init();
      if (ImgAttrsExtTest.#md === undefined) ImgAttrsExtTest.#md = null;
    }
    return ImgAttrsExtTest.#md;
  }

  testBaseCase() {
    this.verifyRendering("![text](/url.png){height=5}", "<p><img src=\"/url.png\" alt=\"text\" height=\"5\" /></p>\n");
    this.verifyRendering("![text](/url.png){height=5 width=6}", "<p><img src=\"/url.png\" alt=\"text\" height=\"5\" width=\"6\" /></p>\n");
    this.verifyRendering("![text](/url.png){height=99px   width=100px}", "<p><img src=\"/url.png\" alt=\"text\" height=\"99px\" width=\"100px\" /></p>\n");
    this.verifyRendering("![text](/url.png){width=100 height=100}", "<p><img src=\"/url.png\" alt=\"text\" width=\"100\" height=\"100\" /></p>\n");
    this.verifyRendering("![text](/url.png){height=4.8 width=3.14}", "<p><img src=\"/url.png\" alt=\"text\" height=\"4.8\" width=\"3.14\" /></p>\n");
    this.verifyRendering("![text](/url.png){Width=18 HeIgHt=1001}", "<p><img src=\"/url.png\" alt=\"text\" Width=\"18\" HeIgHt=\"1001\" /></p>\n");
    this.verifyRendering("![text](/url.png){height=green width=blue}", "<p><img src=\"/url.png\" alt=\"text\" height=\"green\" width=\"blue\" /></p>\n");
    return;
  }

  testDoubleDelimiters() {
    this.verifyRendering("![text](/url.png){{height=5}}", "<p><img src=\"/url.png\" alt=\"text\" />{{height=5}}</p>\n");
    return;
  }

  testMismatchingDelimitersAreIgnored() {
    this.verifyRendering("![text](/url.png){", "<p><img src=\"/url.png\" alt=\"text\" />{</p>\n");
    return;
  }

  testUnsupportedStyleNamesAreLeftUnchanged() {
    this.verifyRendering("![text](/url.png){j=502 K=101 img=2 url=5}", "<p><img src=\"/url.png\" alt=\"text\" />{j=502 K=101 img=2 url=5}</p>\n");
    this.verifyRendering("![foo](/url.png){height=3 invalid}\n", "<p><img src=\"/url.png\" alt=\"foo\" />{height=3 invalid}</p>\n");
    this.verifyRendering("![foo](/url.png){height=3 *test*}\n", "<p><img src=\"/url.png\" alt=\"foo\" />{height=3 <em>test</em>}</p>\n");
    return;
  }

  testStyleWithNoValueIsIgnored() {
    this.verifyRendering("![text](/url.png){height}", "<p><img src=\"/url.png\" alt=\"text\" />{height}</p>\n");
    return;
  }

  testImageAltTextWithSpaces() {
    this.verifyRendering("![Android SDK Manager](/contrib/android-sdk-manager.png){height=502 width=101}", "<p><img src=\"/contrib/android-sdk-manager.png\" alt=\"Android SDK Manager\" height=\"502\" width=\"101\" /></p>\n");
    return;
  }

  testImageAltTextWithSoftLineBreak() {
    this.verifyRendering("![foo\nbar](/url){height=101 width=202}\n", "<p><img src=\"/url\" alt=\"foo\nbar\" height=\"101\" width=\"202\" /></p>\n");
    return;
  }

  testImageAltTextWithHardLineBreak() {
    this.verifyRendering("![foo  \nbar](/url){height=506 width=1}\n", "<p><img src=\"/url\" alt=\"foo\nbar\" height=\"506\" width=\"1\" /></p>\n");
    return;
  }

  testImageAltTextWithEntities() {
    this.verifyRendering("![foo &auml;](/url){height=99 width=100}\n", "<p><img src=\"/url\" alt=\"foo \u00e4\" height=\"99\" width=\"100\" /></p>\n");
    return;
  }

  testTextNodesAreUnchanged() {
    this.verifyRendering("x{height=3 width=4}\n", "<p>x{height=3 width=4}</p>\n");
    this.verifyRendering("x {height=3 width=4}\n", "<p>x {height=3 width=4}</p>\n");
    this.verifyRendering("\\documentclass[12pt]{article}\n", "<p>\\documentclass[12pt]{article}</p>\n");
    this.verifyRendering("some *text*{height=3 width=4}\n", "<p>some <em>text</em>{height=3 width=4}</p>\n");
    this.verifyRendering("{NN} text", "<p>{NN} text</p>\n");
    this.verifyRendering("{}", "<p>{}</p>\n");
    return;
  }

  render(source) {
    let doc = ImgAttrsExtTest.parser().parse(source);
    let html = ImgAttrsExtTest.renderer().render(doc);
    let mark = ImgAttrsExtTest.md().render(doc);
    this.verifyEq(html, ImgAttrsExtTest.renderer().render(ImgAttrsExtTest.parser().parse(mark)));
    return html;
  }

  static make() {
    const $self = new ImgAttrsExtTest();
    ImgAttrsExtTest.make$($self);
    return $self;
  }

  static make$($self) {
    RenderingTest.make$($self);
    return;
  }

  static static$init() {
    ImgAttrsExtTest.#exts = sys.ObjUtil.coerce(((this$) => { let $_u121 = sys.List.make(MarkdownExt.type$, [ImgAttrsExt.make()]); if ($_u121 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(MarkdownExt.type$, [ImgAttrsExt.make()])); })(this), sys.Type.find("markdown::MarkdownExt[]"));
    ImgAttrsExtTest.#parser = Parser.builder().extensions(ImgAttrsExtTest.#exts).build();
    ImgAttrsExtTest.#renderer = HtmlRenderer.builder().extensions(ImgAttrsExtTest.#exts).build();
    ImgAttrsExtTest.#md = MarkdownRenderer.builder().extensions(ImgAttrsExtTest.#exts).build();
    return;
  }

}

class TablesExtTest extends RenderingTest {
  constructor() {
    super();
    const this$ = this;
    this.#doRoundTrip = true;
    return;
  }

  typeof() { return TablesExtTest.type$; }

  static #exts = undefined;

  static exts() {
    if (TablesExtTest.#exts === undefined) {
      TablesExtTest.static$init();
      if (TablesExtTest.#exts === undefined) TablesExtTest.#exts = null;
    }
    return TablesExtTest.#exts;
  }

  static #parser = undefined;

  static parser() {
    if (TablesExtTest.#parser === undefined) {
      TablesExtTest.static$init();
      if (TablesExtTest.#parser === undefined) TablesExtTest.#parser = null;
    }
    return TablesExtTest.#parser;
  }

  static #renderer = undefined;

  static renderer() {
    if (TablesExtTest.#renderer === undefined) {
      TablesExtTest.static$init();
      if (TablesExtTest.#renderer === undefined) TablesExtTest.#renderer = null;
    }
    return TablesExtTest.#renderer;
  }

  static #md = undefined;

  static md() {
    if (TablesExtTest.#md === undefined) {
      TablesExtTest.static$init();
      if (TablesExtTest.#md === undefined) TablesExtTest.#md = null;
    }
    return TablesExtTest.#md;
  }

  static #expected2cells = undefined;

  static expected2cells() {
    if (TablesExtTest.#expected2cells === undefined) {
      TablesExtTest.static$init();
      if (TablesExtTest.#expected2cells === undefined) TablesExtTest.#expected2cells = null;
    }
    return TablesExtTest.#expected2cells;
  }

  #doRoundTrip = false;

  // private field reflection only
  __doRoundTrip(it) { if (it === undefined) return this.#doRoundTrip; else this.#doRoundTrip = it; }

  testMustHaveHeaderAndSeparator() {
    this.verifyRendering("Abc|Def", "<p>Abc|Def</p>\n");
    this.verifyRendering("Abc | Def", "<p>Abc | Def</p>\n");
    return;
  }

  testSeparatorMustBeOneOrMore() {
    this.verifyRendering("Abc|Def\n-|-", "<table>\n<thead>\n<tr>\n<th>Abc</th>\n<th>Def</th>\n</tr>\n</thead>\n</table>\n");
    this.verifyRendering("Abc|Def\n--|--", "<table>\n<thead>\n<tr>\n<th>Abc</th>\n<th>Def</th>\n</tr>\n</thead>\n</table>\n");
    return;
  }

  testSeparatorMustNotContainInvalidChars() {
    this.verifyRendering("Abc|Def\n |-a-|---", "<p>Abc|Def\n|-a-|---</p>\n");
    this.verifyRendering("Abc|Def\n |:--a|---", "<p>Abc|Def\n|:--a|---</p>\n");
    this.verifyRendering("Abc|Def\n |:--a--:|---", "<p>Abc|Def\n|:--a--:|---</p>\n");
    return;
  }

  testSeparatorCanHaveLeadingSpaceThenPipe() {
    this.verifyRendering("Abc|Def\n |---|---", "<table>\n<thead>\n<tr>\n<th>Abc</th>\n<th>Def</th>\n</tr>\n</thead>\n</table>\n");
    return;
  }

  testSeparatorCanNotHaveAdjacentPipes() {
    this.verifyRendering("Abc|Def\n---||---", "<p>Abc|Def\n---||---</p>\n");
    return;
  }

  testSeparatorNeedsPipes() {
    this.verifyRendering("Abc|Def\n|--- ---", "<p>Abc|Def\n|--- ---</p>\n");
    return;
  }

  testHeaderMustBeOneLine() {
    this.verifyRendering("No\nAbc|Def\n---|---", "<p>No\nAbc|Def\n---|---</p>\n");
    return;
  }

  testOneHeadNoBody() {
    this.verifyRendering("Abc|Def\n---|---", "<table>\n<thead>\n<tr>\n<th>Abc</th>\n<th>Def</th>\n</tr>\n</thead>\n</table>\n");
    return;
  }

  testOneColumnOneHeadNoBody() {
    let expected = "<table>\n<thead>\n<tr>\n<th>Abc</th>\n</tr>\n</thead>\n</table>\n";
    this.verifyRendering("|Abc\n|---\n", expected);
    this.verifyRendering("|Abc|\n|---|\n", expected);
    this.verifyRendering("Abc|\n---|\n", expected);
    this.verifyRendering("|Abc\n---\n", "<h2>|Abc</h2>\n");
    this.verifyRendering("Abc\n|---\n", "<p>Abc\n|---</p>\n");
    return;
  }

  testOneColumnOneHeadOneBody() {
    let expected = "<table>\n<thead>\n<tr>\n<th>Abc</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n</tr>\n</tbody>\n</table>\n";
    this.verifyRendering("|Abc\n|---\n|1", expected);
    this.verifyRendering("|Abc|\n|---|\n|1|", expected);
    this.verifyRendering("Abc|\n---|\n1|", expected);
    this.verifyRendering("|Abc\n---\n|1", "<h2>|Abc</h2>\n<p>|1</p>\n");
    return;
  }

  testOneHeadOneBody() {
    this.verifyRendering("Abc|Def\n---|---\n1|2", TablesExtTest.expected2cells());
    return;
  }

  testSpaceBeforeSeparator() {
    this.verifyRendering("  |Abc|Def|\n  |---|---|\n  |1|2|", TablesExtTest.expected2cells());
    return;
  }

  testSeparatorMustNotHaveLessPartsThanHead() {
    this.verifyRendering("Abc|Def|Ghi\n---|---\n1|2|3", "<p>Abc|Def|Ghi\n---|---\n1|2|3</p>\n");
    return;
  }

  testPadding() {
    this.verifyRendering(" Abc  | Def \n --- | --- \n 1 | 2 ", TablesExtTest.expected2cells());
    return;
  }

  testPaddingWithCodeBlockIndentation() {
    this.verifyRendering("Abc|Def\n---|---\n    1|2", TablesExtTest.expected2cells());
    return;
  }

  testPipesOnOutside() {
    this.verifyRendering("|Abc|Def|\n|---|---|\n|1|2|", TablesExtTest.expected2cells());
    return;
  }

  testPipesOnOutsideWhitespaceAfterHeader() {
    this.verifyRendering("|Abc|Def| \n|---|---|\n|1|2|", TablesExtTest.expected2cells());
    return;
  }

  testPipesOnOutsideZeroLengthHeaders() {
    this.verifyRendering("||center header||\n-|-------------|-\n1|      2      |3", "<table>\n<thead>\n<tr>\n<th></th>\n<th>center header</th>\n<th></th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n<td>2</td>\n<td>3</td>\n</tr>\n</tbody>\n</table>\n");
    return;
  }

  testInlineElements() {
    this.verifyRendering("*Abc*|Def\n---|---\n1|2", "<table>\n<thead>\n<tr>\n<th><em>Abc</em></th>\n<th>Def</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n<td>2</td>\n</tr>\n</tbody>\n</table>\n");
    return;
  }

  testEscapedPipe() {
    this.verifyRendering("Abc|Def\n---|---\n1\\|2|20", "<table>\n<thead>\n<tr>\n<th>Abc</th>\n<th>Def</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1|2</td>\n<td>20</td>\n</tr>\n</tbody>\n</table>\n");
    return;
  }

  testEscapedBackslash() {
    this.verifyRendering("Abc|Def\n---|---\n1\\\\|2", "<table>\n<thead>\n<tr>\n<th>Abc</th>\n<th>Def</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1|2</td>\n<td></td>\n</tr>\n</tbody>\n</table>\n");
    return;
  }

  testEscapedOther() {
    this.verifyRendering("Abc|Def\n---|---\n1|\\`not code`", "<table>\n<thead>\n<tr>\n<th>Abc</th>\n<th>Def</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n<td>`not code`</td>\n</tr>\n</tbody>\n</table>\n");
    return;
  }

  testBackslashAtEnd() {
    this.#doRoundTrip = false;
    this.verifyRendering("Abc|Def\n---|---\n1|2\\", "<table>\n<thead>\n<tr>\n<th>Abc</th>\n<th>Def</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n<td>2\\</td>\n</tr>\n</tbody>\n</table>\n");
    return;
  }

  testAlignLeft() {
    let expect = "<table>\n<thead>\n<tr>\n<th align=\"left\">Abc</th>\n<th>Def</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align=\"left\">1</td>\n<td>2</td>\n</tr>\n</tbody>\n</table>\n";
    this.verifyRendering("Abc|Def\n:-|-\n1|2", expect);
    this.verifyRendering("Abc|Def\n:--|--\n1|2", expect);
    this.verifyRendering("Abc|Def\n:---|---\n1|2", expect);
    return;
  }

  testAlignRight() {
    let expect = "<table>\n<thead>\n<tr>\n<th align=\"right\">Abc</th>\n<th>Def</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align=\"right\">1</td>\n<td>2</td>\n</tr>\n</tbody>\n</table>\n";
    this.verifyRendering("Abc|Def\n-:|-\n1|2", expect);
    this.verifyRendering("Abc|Def\n--:|--\n1|2", expect);
    this.verifyRendering("Abc|Def\n---:|---\n1|2", expect);
    return;
  }

  testAlignCenter() {
    let expect = "<table>\n<thead>\n<tr>\n<th align=\"center\">Abc</th>\n<th>Def</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align=\"center\">1</td>\n<td>2</td>\n</tr>\n</tbody>\n</table>\n";
    this.verifyRendering("Abc|Def\n:-:|-\n1|2", expect);
    this.verifyRendering("Abc|Def\n:--:|--\n1|2", expect);
    this.verifyRendering("Abc|Def\n:---:|---\n1|2", expect);
    return;
  }

  testAlignCenterSecond() {
    this.verifyRendering("Abc|Def\n---|:---:\n1|2", "<table>\n<thead>\n<tr>\n<th>Abc</th>\n<th align=\"center\">Def</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n<td align=\"center\">2</td>\n</tr>\n</tbody>\n</table>\n");
    return;
  }

  testAlignLeftWithSpaces() {
    this.verifyRendering("Abc|Def\n :--- |---\n1|2", "<table>\n<thead>\n<tr>\n<th align=\"left\">Abc</th>\n<th>Def</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align=\"left\">1</td>\n<td>2</td>\n</tr>\n</tbody>\n</table>\n");
    return;
  }

  testAlignmentMarkerMustBeNextToDashs() {
    this.verifyRendering("Abc|Def\n: ---|---", "<p>Abc|Def\n: ---|---</p>\n");
    this.verifyRendering("Abc|Def\n--- :|---", "<p>Abc|Def\n--- :|---</p>\n");
    this.verifyRendering("Abc|Def\n---|: ---", "<p>Abc|Def\n---|: ---</p>\n");
    this.verifyRendering("Abc|Def\n---|--- :", "<p>Abc|Def\n---|--- :</p>\n");
    return;
  }

  testBodyCanNotHaveMoreColumnsThanHead() {
    this.verifyRendering("Abc|Def\n---|---\n1|2|3", TablesExtTest.expected2cells());
    return;
  }

  testBodyWithFewerColumnsThanHeadresultsInEmptyCells() {
    this.verifyRendering("Abc|Def|Ghi\n---|---|---\n1|2", "<table>\n<thead>\n<tr>\n<th>Abc</th>\n<th>Def</th>\n<th>Ghi</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n<td>2</td>\n<td></td>\n</tr>\n</tbody>\n</table>\n");
    return;
  }

  testInsideBlockQuote() {
    this.verifyRendering("> Abc|Def\n> ---|---\n> 1|2", sys.Str.plus(sys.Str.plus("<blockquote>\n", sys.Str.trim(TablesExtTest.expected2cells())), "\n</blockquote>\n"));
    return;
  }

  testTableWithLazyContinuationLine() {
    this.verifyRendering("Abc|Def\n---|---\n1|2\nlazy", "<table>\n<thead>\n<tr>\n<th>Abc</th>\n<th>Def</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n<td>2</td>\n</tr>\n<tr>\n<td>lazy</td>\n<td></td>\n</tr>\n</tbody>\n</table>\n");
    return;
  }

  testDanglingPipe() {
    this.verifyRendering("Abc|Def\n---|---\n1|2\n|", sys.Str.plus(sys.Str.plus("", sys.Str.trim(TablesExtTest.expected2cells())), "\n<p>|</p>\n"));
    this.verifyRendering("Abc|Def\n---|---\n1|2\n  |  ", sys.Str.plus(sys.Str.plus("", sys.Str.trim(TablesExtTest.expected2cells())), "\n<p>|</p>\n"));
    return;
  }

  testAttrProviderIsApplied() {
    const this$ = this;
    let renderer = HtmlRenderer.builder().attrProviderFactory((cx) => {
      return TablesTestAttrProvider.make();
    }).extensions(TablesExtTest.exts()).build();
    this.verifyEq(renderer.render(TablesExtTest.parser().parse("Abc|Def\n-----|---\n1|2")), "<table test=\"block\">\n<thead test=\"head\">\n<tr test=\"row\">\n<th test=\"cell\" width=\"5em\">Abc</th>\n<th test=\"cell\" width=\"3em\">Def</th>\n</tr>\n</thead>\n<tbody test=\"body\">\n<tr test=\"row\">\n<td test=\"cell\">1</td>\n<td test=\"cell\">2</td>\n</tr>\n</tbody>\n</table>\n");
    return;
  }

  testGfmSpec() {
    this.verifyRendering("| foo | bar |\n| --- | --- |\n| baz | bim |", "<table>\n<thead>\n<tr>\n<th>foo</th>\n<th>bar</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>baz</td>\n<td>bim</td>\n</tr>\n</tbody>\n</table>\n");
    this.verifyRendering("| abc | defghi |\n:-: | -----------:\nbar | baz", "<table>\n<thead>\n<tr>\n<th align=\"center\">abc</th>\n<th align=\"right\">defghi</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align=\"center\">bar</td>\n<td align=\"right\">baz</td>\n</tr>\n</tbody>\n</table>\n");
    this.verifyRendering("| f\\|oo  |\n| ------ |\n| b `\\|` az |\n| b **\\|** im ", "<table>\n<thead>\n<tr>\n<th>f|oo</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>b <code>|</code> az</td>\n</tr>\n<tr>\n<td>b <strong>|</strong> im</td>\n</tr>\n</tbody>\n</table>\n");
    this.verifyRendering("| abc | def |\n| --- | --- |\n| bar | baz |\n> bar", "<table>\n<thead>\n<tr>\n<th>abc</th>\n<th>def</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>bar</td>\n<td>baz</td>\n</tr>\n</tbody>\n</table>\n<blockquote>\n<p>bar</p>\n</blockquote>\n");
    this.verifyRendering("| abc | def |\n| --- | --- |\n| bar | baz |\nbar\n\nbar", "<table>\n<thead>\n<tr>\n<th>abc</th>\n<th>def</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>bar</td>\n<td>baz</td>\n</tr>\n<tr>\n<td>bar</td>\n<td></td>\n</tr>\n</tbody>\n</table>\n<p>bar</p>\n");
    this.verifyRendering("| abc | def |\n| --- |\n| bar |", "<p>| abc | def |\n| --- |\n| bar |</p>\n");
    this.verifyRendering("| abc | def |\n| --- | --- |\n| bar |\n| bar | baz | bool |", "<table>\n<thead>\n<tr>\n<th>abc</th>\n<th>def</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>bar</td>\n<td></td>\n</tr>\n<tr>\n<td>bar</td>\n<td>baz</td>\n</tr>\n</tbody>\n</table>\n");
    this.verifyRendering("| abc | def |\n| --- | --- |", "<table>\n<thead>\n<tr>\n<th>abc</th>\n<th>def</th>\n</tr>\n</thead>\n</table>\n");
    return;
  }

  render(source) {
    let doc = TablesExtTest.parser().parse(source);
    let html = TablesExtTest.renderer().render(doc);
    let mark = TablesExtTest.md().render(doc);
    if (this.#doRoundTrip) {
      this.verifyEq(html, TablesExtTest.renderer().render(TablesExtTest.parser().parse(mark)));
    }
    ;
    this.#doRoundTrip = true;
    return html;
  }

  static make() {
    const $self = new TablesExtTest();
    TablesExtTest.make$($self);
    return $self;
  }

  static make$($self) {
    RenderingTest.make$($self);
    ;
    return;
  }

  static static$init() {
    TablesExtTest.#exts = sys.ObjUtil.coerce(((this$) => { let $_u122 = sys.List.make(MarkdownExt.type$, [TablesExt.make()]); if ($_u122 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(MarkdownExt.type$, [TablesExt.make()])); })(this), sys.Type.find("markdown::MarkdownExt[]"));
    TablesExtTest.#parser = Parser.builder().extensions(TablesExtTest.#exts).build();
    TablesExtTest.#renderer = HtmlRenderer.builder().extensions(TablesExtTest.#exts).build();
    TablesExtTest.#md = MarkdownRenderer.builder().extensions(TablesExtTest.#exts).build();
    TablesExtTest.#expected2cells = "<table>\n<thead>\n<tr>\n<th>Abc</th>\n<th>Def</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n<td>2</td>\n</tr>\n</tbody>\n</table>\n";
    return;
  }

}

class TablesTestAttrProvider extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TablesTestAttrProvider.type$; }

  setAttrs(node,tagName,attrs) {
    let $_u123 = sys.ObjUtil.typeof(node);
    if (sys.ObjUtil.equals($_u123, Table.type$)) {
      attrs.set("test", "block");
    }
    else if (sys.ObjUtil.equals($_u123, TableHead.type$)) {
      attrs.set("test", "head");
    }
    else if (sys.ObjUtil.equals($_u123, TableBody.type$)) {
      attrs.set("test", "body");
    }
    else if (sys.ObjUtil.equals($_u123, TableRow.type$)) {
      attrs.set("test", "row");
    }
    else if (sys.ObjUtil.equals($_u123, TableCell.type$)) {
      attrs.set("test", "cell");
      if (sys.ObjUtil.equals("th", tagName)) {
        attrs.set("width", sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.ObjUtil.coerce(node, TableCell.type$).width(), sys.Obj.type$.toNullable())), "em"));
      }
      ;
    }
    ;
    return;
  }

  static make() {
    const $self = new TablesTestAttrProvider();
    TablesTestAttrProvider.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class XetodocExtTest extends RenderingTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetodocExtTest.type$; }

  static #parser = undefined;

  static parser() {
    if (XetodocExtTest.#parser === undefined) {
      XetodocExtTest.static$init();
      if (XetodocExtTest.#parser === undefined) XetodocExtTest.#parser = null;
    }
    return XetodocExtTest.#parser;
  }

  static #renderer = undefined;

  static renderer() {
    if (XetodocExtTest.#renderer === undefined) {
      XetodocExtTest.static$init();
      if (XetodocExtTest.#renderer === undefined) XetodocExtTest.#renderer = null;
    }
    return XetodocExtTest.#renderer;
  }

  static #md = undefined;

  static md() {
    if (XetodocExtTest.#md === undefined) {
      XetodocExtTest.static$init();
      if (XetodocExtTest.#md === undefined) XetodocExtTest.#md = null;
    }
    return XetodocExtTest.#md;
  }

  testTicks() {
    this.verifyEq(this.render("'code'"), "<p><code>code</code></p>\n");
    this.verifyEq(this.render("this is 'fandoc' code"), "<p>this is <code>fandoc</code> code</p>\n");
    this.verifyEq(this.render("not 'fandoc code"), "<p>not 'fandoc code</p>\n");
    this.verifyEq(this.render("empty '' code is not code"), "<p>empty '' code is not code</p>\n");
    this.verifyEq(this.render("finally ''this 'is' possible''"), "<p>finally <code>this 'is' possible</code></p>\n");
    return;
  }

  testBacktickLinks() {
    return;
  }

  render(source) {
    return XetodocExtTest.renderer().render(XetodocExtTest.parser().parse(source));
  }

  static make() {
    const $self = new XetodocExtTest();
    XetodocExtTest.make$($self);
    return $self;
  }

  static make$($self) {
    RenderingTest.make$($self);
    return;
  }

  static static$init() {
    XetodocExtTest.#parser = Xetodoc.parser(TestLinkResolver.make());
    XetodocExtTest.#renderer = Xetodoc.htmlRenderer();
    XetodocExtTest.#md = Xetodoc.markdownRenderer();
    return;
  }

}

class TestLinkResolver extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TestLinkResolver.type$; }

  visitBulletList() { return Visitor.prototype.visitBulletList.apply(this, arguments); }

  visitCustomNode() { return Visitor.prototype.visitCustomNode.apply(this, arguments); }

  visitFencedCode() { return Visitor.prototype.visitFencedCode.apply(this, arguments); }

  visitThematicBreak() { return Visitor.prototype.visitThematicBreak.apply(this, arguments); }

  visitChildren() { return Visitor.prototype.visitChildren.apply(this, arguments); }

  visitLinkReferenceDefinition() { return Visitor.prototype.visitLinkReferenceDefinition.apply(this, arguments); }

  visitHeading() { return Visitor.prototype.visitHeading.apply(this, arguments); }

  visitDocument() { return Visitor.prototype.visitDocument.apply(this, arguments); }

  visitStrongEmphasis() { return Visitor.prototype.visitStrongEmphasis.apply(this, arguments); }

  visitText() { return Visitor.prototype.visitText.apply(this, arguments); }

  visitListItem() { return Visitor.prototype.visitListItem.apply(this, arguments); }

  visitOrderedList() { return Visitor.prototype.visitOrderedList.apply(this, arguments); }

  visitCode() { return Visitor.prototype.visitCode.apply(this, arguments); }

  visitHtmlBlock() { return Visitor.prototype.visitHtmlBlock.apply(this, arguments); }

  visitHardLineBreak() { return Visitor.prototype.visitHardLineBreak.apply(this, arguments); }

  visitParagraph() { return Visitor.prototype.visitParagraph.apply(this, arguments); }

  process() { return LinkResolver.prototype.process.apply(this, arguments); }

  visitCustomBlock() { return Visitor.prototype.visitCustomBlock.apply(this, arguments); }

  visitLink() { return LinkResolver.prototype.visitLink.apply(this, arguments); }

  visitBlockQuote() { return Visitor.prototype.visitBlockQuote.apply(this, arguments); }

  visitIndentedCode() { return Visitor.prototype.visitIndentedCode.apply(this, arguments); }

  visitSoftLineBreak() { return Visitor.prototype.visitSoftLineBreak.apply(this, arguments); }

  visitEmphasis() { return Visitor.prototype.visitEmphasis.apply(this, arguments); }

  visitImage() { return LinkResolver.prototype.visitImage.apply(this, arguments); }

  visitHtmlInline() { return Visitor.prototype.visitHtmlInline.apply(this, arguments); }

  resolve(node) {
    node.destination("/resolved");
    node.isCode(sys.ObjUtil.is(node, Link.type$));
    node.setText("resolved");
    return;
  }

  static make() {
    const $self = new TestLinkResolver();
    TestLinkResolver.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class MarkdownRendererTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MarkdownRendererTest.type$; }

  testThematicBreaks() {
    this.verifyRoundTrip("___\n");
    this.verifyRoundTrip("___\n\nfoo\n");
    this.verifyRoundTrip("* ___\n");
    this.verifyRoundTrip("- ___\n");
    this.verifyRoundTrip("----\n");
    this.verifyRoundTrip("*****\n");
    let node = ThematicBreak.make();
    this.verifyEq("___", this.render(node));
    return;
  }

  testHeadings() {
    this.verifyRoundTrip("# foo\n");
    this.verifyRoundTrip("## foo\n");
    this.verifyRoundTrip("### foo\n");
    this.verifyRoundTrip("#### foo\n");
    this.verifyRoundTrip("##### foo\n");
    this.verifyRoundTrip("###### foo\n");
    this.verifyRoundTrip("Foo\nbar\n===\n");
    this.verifyRoundTrip("Foo  \nbar\n===\n");
    this.verifyRoundTrip("[foo\nbar](/url)\n===\n");
    this.verifyRoundTrip("# foo\n\nbar\n");
    return;
  }

  testIndentedCodeBlocks() {
    this.verifyRoundTrip("    hi\n");
    this.verifyRoundTrip("    hi\n    code\n");
    this.verifyRoundTrip(">     hi\n>     code\n");
    return;
  }

  testFencedCodeBlocks() {
    this.verifyRoundTrip("```\ntest\n```\n");
    this.verifyRoundTrip("~~~~\ntest\n~~~~\n");
    this.verifyRoundTrip("```info\ntest\n```\n");
    this.verifyRoundTrip(" ```\n test\n ```\n");
    this.verifyRoundTrip("```\n```\n");
    this.verifyRoundTrip("````\ntest\n````\n");
    this.verifyRoundTrip("~~~\ntest\n~~~~~~\n");
    return;
  }

  testFencedCodeBlocksFromAst() {
    let doc = Document.make();
    let code = FencedCode.make();
    code.literal("hi code");
    doc.appendChild(code);
    this.verifyRendering("", "```\nhi code\n```\n", this.render(doc));
    code.literal("hi`\n```\n``test");
    this.verifyRendering("", "````\nhi`\n```\n``test\n````\n", this.render(doc));
    return;
  }

  testHtmlBlocks() {
    this.verifyRoundTrip("<div>test</div>\n");
    this.verifyRoundTrip("> <div\n> test\n> </div>\n");
    return;
  }

  testParagraphs() {
    this.verifyRoundTrip("foo\n");
    this.verifyRoundTrip("foo\n\nbar\n");
    return;
  }

  testBlockQuotes() {
    this.verifyRoundTrip("> test\n");
    this.verifyRoundTrip("> foo\n> bar\n");
    this.verifyRoundTrip("> > foo\n> > bar\n");
    this.verifyRoundTrip("> # Foo\n> \n> bar\n> baz\n");
    return;
  }

  testBulletListItems() {
    this.verifyRoundTrip("* foo\n");
    this.verifyRoundTrip("- foo\n");
    this.verifyRoundTrip("+ foo\n");
    this.verifyRoundTrip("* foo\n  bar\n");
    this.verifyRoundTrip("* ```\n  code\n  ```\n");
    this.verifyRoundTrip("* foo\n\n* bar\n");
    this.verifyRoundTrip("* foo\n  \n  bar\n");
    this.verifyRoundTrip("* foo\n* bar\n");
    this.verifyRoundTrip("- Foo\n  - Bar\n  \n  - Baz\n");
    this.verifyRoundTrip(" -    one\n\n     two\n");
    this.verifyRoundTrip("- \n\nFoo\n");
    return;
  }

  testBulletListItemsFromAst() {
    let doc = Document.make();
    let list = BulletList.make();
    let item = ListItem.make(null, null);
    item.appendChild(Text.make("Test"));
    list.appendChild(item);
    doc.appendChild(list);
    this.verifyRendering("", "- Test\n", this.render(doc));
    list.marker("*");
    this.verifyRendering("", "* Test\n", this.render(doc));
    return;
  }

  testOrderedListItems() {
    this.verifyRoundTrip("1. foo\n");
    this.verifyRoundTrip("2. foo\n\n3. bar\n");
    this.verifyRoundTrip("1. foo\n2. bar\n");
    this.verifyRoundTrip("1. Foo\n   1. Bar\n   \n   2. Baz\n");
    this.verifyRoundTrip(" 1.  one\n\n    two\n");
    return;
  }

  testOrderedListItemsFromAst() {
    let doc = Document.make();
    let list = OrderedList.make(null, null);
    let item = ListItem.make(null, null);
    item.appendChild(Text.make("Test"));
    list.appendChild(item);
    doc.appendChild(list);
    this.verifyRendering("", "1. Test\n", this.render(doc));
    list.startNumber(sys.ObjUtil.coerce(2, sys.Int.type$.toNullable()));
    list.markerDelim(")");
    this.verifyRendering("", "2) Test\n", this.render(doc));
    return;
  }

  testTabs() {
    this.verifyRoundTrip("a\tb\n");
    return;
  }

  testEscaping() {
    this.verifyRoundTrip("\\[a\\](/uri)\n");
    this.verifyRoundTrip("\\`abc\\`\n");
    this.verifyRoundTrip("\\- Test\n");
    this.verifyRoundTrip("\\-\n");
    this.verifyRoundTrip("Test -\n");
    this.verifyRoundTrip("Abc\n\n\\- Test\n");
    this.verifyRoundTrip("\\# Test\n");
    this.verifyRoundTrip("\\## Test\n");
    this.verifyRoundTrip("\\#\n");
    this.verifyRoundTrip("Foo\n\\===\n");
    this.verifyRoundTrip("===\n");
    this.verifyRoundTrip("a\n\n===\n");
    this.verifyRoundTrip("> \\- Test\n");
    this.verifyRoundTrip("- \\- Test\n");
    this.verifyRoundTrip("`a`- foo\n");
    this.verifyRoundTrip("1\\. Foo\n");
    this.verifyRoundTrip("999\\. Foo\n");
    this.verifyRoundTrip("1\\.\n");
    this.verifyRoundTrip("1\\) Foo\n");
    this.verifyRoundTrip("&#9;foo\n");
    this.verifyRoundTrip("&#32;   foo\n");
    this.verifyRoundTrip("foo&#10;&#10;bar\n");
    return;
  }

  testCodeSpans() {
    this.verifyRoundTrip("`foo`\n");
    this.verifyRoundTrip("``foo ` bar``\n");
    this.verifyRoundTrip("```foo `` ` bar```\n");
    this.verifyRoundTrip("`` `foo ``\n");
    this.verifyRoundTrip("``  `  ``\n");
    this.verifyRoundTrip("` `\n");
    return;
  }

  testEmphasis() {
    this.verifyRoundTrip("*foo*\n");
    this.verifyRoundTrip("foo*bar*\n");
    this.verifyRoundTrip("*_foo_*\n");
    this.verifyRoundTrip("*_*foo*_*\n");
    this.verifyRoundTrip("_*foo*_\n");
    this.verifyRoundTrip("foo\\_bar\\_\n");
    let doc = Document.make();
    let p = Paragraph.make();
    doc.appendChild(p);
    let e1 = Emphasis.make("*");
    p.appendChild(e1);
    let e2 = Emphasis.make("_");
    e1.appendChild(e2);
    e2.appendChild(Text.make("hi"));
    this.verifyEq("*_hi_*\n", this.render(doc));
    return;
  }

  testStrongEmphasis() {
    this.verifyRoundTrip("**foo**\n");
    this.verifyRoundTrip("foo**bar**\n");
    return;
  }

  testLinks() {
    this.verifyRoundTrip("[link](/uri)\n");
    this.verifyRoundTrip("[link](/uri \"title\")\n");
    this.verifyRoundTrip("[link](</my uri>)\n");
    this.verifyRoundTrip("[a](<b)c>)\n");
    this.verifyRoundTrip("[a](<b(c>)\n");
    this.verifyRoundTrip("[a](<b\\>c>)\n");
    this.verifyRoundTrip("[a](<b\\\\\\>c>)\n");
    this.verifyRoundTrip("[a](/uri \"foo \\\" bar\")\n");
    this.verifyRoundTrip("[link](/uri \"tes\\\\\")\n");
    this.verifyRoundTrip("[link](/url \"test&#10;&#10;\")\n");
    this.verifyRoundTrip("[link](</url&#10;&#10;>)\n");
    return;
  }

  testImages() {
    this.verifyRoundTrip("![link](/uri)\n");
    this.verifyRoundTrip("![link](/uri \"title\")\n");
    this.verifyRoundTrip("![link](</my uri>)\n");
    this.verifyRoundTrip("![a](<b)c>)\n");
    this.verifyRoundTrip("![a](<b(c>)\n");
    this.verifyRoundTrip("![a](<b\\>c>)\n");
    this.verifyRoundTrip("![a](<b\\\\\\>c>)\n");
    this.verifyRoundTrip("![a](/uri \"foo \\\" bar\")\n");
    return;
  }

  testHtmlInline() {
    this.verifyRoundTrip("<del>*foo*</del>\n");
    return;
  }

  testHardBreak() {
    this.verifyRoundTrip("foo  \nbar\n");
    return;
  }

  testSoftBreak() {
    this.verifyRoundTrip("foo\nbar\n");
    return;
  }

  verifyRoundTrip(input) {
    let rendered = this.parseAndRender(input);
    this.verifyEq(input, rendered);
    return;
  }

  parseAndRender(source) {
    let parsed = this.parse(source);
    return this.render(parsed);
  }

  parse(source) {
    return Parser.make().parse(source);
  }

  render(node) {
    return MarkdownRenderer.make().render(node);
  }

  verifyRendering(source,expected,actual) {
    this.verifyEq(expected, actual);
    return;
  }

  static make() {
    const $self = new MarkdownRendererTest();
    MarkdownRendererTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class MarkdownSpecTest extends CommonMarkSpecTest {
  constructor() {
    super();
    const this$ = this;
    this.#parser = sys.ObjUtil.coerce(Parser.make(), Parser.type$);
    this.#markdown_renderer = sys.ObjUtil.coerce(MarkdownRenderer.make(), MarkdownRenderer.type$);
    this.#html_renderer = HtmlRenderer.builder().withPercentEncodeUrls(true).build();
    return;
  }

  typeof() { return MarkdownSpecTest.type$; }

  #parser = null;

  // private field reflection only
  __parser(it) { if (it === undefined) return this.#parser; else this.#parser = it; }

  #markdown_renderer = null;

  // private field reflection only
  __markdown_renderer(it) { if (it === undefined) return this.#markdown_renderer; else this.#markdown_renderer = it; }

  #html_renderer = null;

  // private field reflection only
  __html_renderer(it) { if (it === undefined) return this.#html_renderer; else this.#html_renderer = it; }

  examplesToRun() {
    return CommonMarkSpecTest.prototype.examplesToRun.call(this);
  }

  run(example) {
    let html = null;
    try {
      let md = this.#markdown_renderer.render(this.#parser.parse(example.markdown()));
      (html = this.#html_renderer.render(this.#parser.parse(md)));
      this.verifyEq(example.html(), html);
      return ExampleRes.makeOk(example);
    }
    catch ($_u124) {
      $_u124 = sys.Err.make($_u124);
      if ($_u124 instanceof sys.Err) {
        let err = $_u124;
        ;
        return ExampleRes.make(example, err, html);
      }
      else {
        throw $_u124;
      }
    }
    ;
  }

  static make() {
    const $self = new MarkdownSpecTest();
    MarkdownSpecTest.make$($self);
    return $self;
  }

  static make$($self) {
    CommonMarkSpecTest.make$($self);
    ;
    return;
  }

}

const p = sys.Pod.add$('markdown');
const xp = sys.Param.noParams$();
let m;
MarkdownExt.type$ = p.am$('MarkdownExt','sys::Obj',[],{'sys::Js':""},8451,MarkdownExt);
Node.type$ = p.at$('Node','sys::Obj',[],{'sys::Js':""},8193,Node);
HardLineBreak.type$ = p.at$('HardLineBreak','markdown::Node',[],{'sys::Js':""},8192,HardLineBreak);
SoftLineBreak.type$ = p.at$('SoftLineBreak','markdown::Node',[],{'sys::Js':""},8192,SoftLineBreak);
Delimited.type$ = p.am$('Delimited','sys::Obj',[],{'sys::Js':""},8449,Delimited);
StrongEmphasis.type$ = p.at$('StrongEmphasis','markdown::Node',['markdown::Delimited'],{'sys::Js':""},8192,StrongEmphasis);
Emphasis.type$ = p.at$('Emphasis','markdown::Node',['markdown::Delimited'],{'sys::Js':""},8192,Emphasis);
Text.type$ = p.at$('Text','markdown::Node',[],{'sys::Js':""},8192,Text);
Code.type$ = p.at$('Code','markdown::Node',[],{'sys::Js':""},8192,Code);
HtmlInline.type$ = p.at$('HtmlInline','markdown::Node',[],{'sys::Js':""},8192,HtmlInline);
CustomNode.type$ = p.at$('CustomNode','markdown::Node',[],{'sys::Js':""},8192,CustomNode);
Block.type$ = p.at$('Block','markdown::Node',[],{'sys::Js':""},8193,Block);
Document.type$ = p.at$('Document','markdown::Block',[],{'sys::Js':""},8224,Document);
Heading.type$ = p.at$('Heading','markdown::Block',[],{'sys::Js':""},8192,Heading);
BlockQuote.type$ = p.at$('BlockQuote','markdown::Block',[],{'sys::Js':""},8192,BlockQuote);
FencedCode.type$ = p.at$('FencedCode','markdown::Block',[],{'sys::Js':""},8192,FencedCode);
HtmlBlock.type$ = p.at$('HtmlBlock','markdown::Block',[],{'sys::Js':""},8192,HtmlBlock);
ThematicBreak.type$ = p.at$('ThematicBreak','markdown::Block',[],{'sys::Js':""},8192,ThematicBreak);
IndentedCode.type$ = p.at$('IndentedCode','markdown::Block',[],{'sys::Js':""},8192,IndentedCode);
ListBlock.type$ = p.at$('ListBlock','markdown::Block',[],{'sys::Js':""},8193,ListBlock);
BulletList.type$ = p.at$('BulletList','markdown::ListBlock',[],{'sys::Js':""},8192,BulletList);
OrderedList.type$ = p.at$('OrderedList','markdown::ListBlock',[],{'sys::Js':""},8192,OrderedList);
ListItem.type$ = p.at$('ListItem','markdown::Block',[],{'sys::Js':""},8192,ListItem);
Paragraph.type$ = p.at$('Paragraph','markdown::Block',[],{'sys::Js':""},8192,Paragraph);
CustomBlock.type$ = p.at$('CustomBlock','markdown::Block',[],{'sys::Js':""},8193,CustomBlock);
Definitions.type$ = p.at$('Definitions','sys::Obj',[],{'sys::Js':""},128,Definitions);
DefinitionMap.type$ = p.at$('DefinitionMap','sys::Obj',[],{'sys::Js':""},8224,DefinitionMap);
LinkNode.type$ = p.at$('LinkNode','markdown::Node',[],{'sys::Js':""},8193,LinkNode);
Link.type$ = p.at$('Link','markdown::LinkNode',[],{'sys::Js':""},8192,Link);
Image.type$ = p.at$('Image','markdown::LinkNode',[],{'sys::Js':""},8192,Image);
LinkReferenceDefinition.type$ = p.at$('LinkReferenceDefinition','markdown::Block',[],{'sys::Js':""},8192,LinkReferenceDefinition);
Visitor.type$ = p.am$('Visitor','sys::Obj',[],{'sys::Js':""},8449,Visitor);
Xetodoc.type$ = p.at$('Xetodoc','sys::Obj',['markdown::MarkdownExt'],{'sys::Js':"",'sys::NoDoc':""},8194,Xetodoc);
InlineContentParser.type$ = p.am$('InlineContentParser','sys::Obj',[],{'sys::Js':""},8449,InlineContentParser);
InlineCodeParser.type$ = p.at$('InlineCodeParser','sys::Obj',['markdown::InlineContentParser'],{'sys::Js':"",'sys::NoDoc':""},8193,InlineCodeParser);
TicksInlineParser.type$ = p.at$('TicksInlineParser','markdown::InlineCodeParser',[],{'sys::Js':""},128,TicksInlineParser);
InlineContentParserFactory.type$ = p.am$('InlineContentParserFactory','sys::Obj',[],{'sys::Js':""},8451,InlineContentParserFactory);
TicksInlineParserFactory.type$ = p.at$('TicksInlineParserFactory','sys::Obj',['markdown::InlineContentParserFactory'],{'sys::Js':""},130,TicksInlineParserFactory);
BackticksLinkParser.type$ = p.at$('BackticksLinkParser','sys::Obj',['markdown::InlineContentParser'],{'sys::Js':""},128,BackticksLinkParser);
BackticksLinkParserFactory.type$ = p.at$('BackticksLinkParserFactory','sys::Obj',['markdown::InlineContentParserFactory'],{'sys::Js':""},130,BackticksLinkParserFactory);
NodeRenderer.type$ = p.am$('NodeRenderer','sys::Obj',[],{'sys::Js':""},8449,NodeRenderer);
MdTicksRenderer.type$ = p.at$('MdTicksRenderer','sys::Obj',['markdown::NodeRenderer'],{'sys::Js':""},128,MdTicksRenderer);
TablesExt.type$ = p.at$('TablesExt','sys::Obj',['markdown::MarkdownExt'],{'sys::Js':""},8194,TablesExt);
Table.type$ = p.at$('Table','markdown::CustomBlock',[],{'sys::Js':""},8192,Table);
TableHead.type$ = p.at$('TableHead','markdown::CustomNode',[],{'sys::Js':""},8192,TableHead);
TableBody.type$ = p.at$('TableBody','markdown::CustomNode',[],{'sys::Js':""},8192,TableBody);
TableRow.type$ = p.at$('TableRow','markdown::CustomNode',[],{'sys::Js':""},8192,TableRow);
TableCell.type$ = p.at$('TableCell','markdown::CustomNode',[],{'sys::Js':""},8192,TableCell);
Alignment.type$ = p.at$('Alignment','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,Alignment);
BlockParser.type$ = p.at$('BlockParser','sys::Obj',[],{'sys::Js':""},8193,BlockParser);
TableParser.type$ = p.at$('TableParser','markdown::BlockParser',[],{'sys::Js':""},128,TableParser);
BlockParserFactory.type$ = p.at$('BlockParserFactory','sys::Obj',[],{'sys::Js':""},8195,BlockParserFactory);
TableParserFactory.type$ = p.at$('TableParserFactory','markdown::BlockParserFactory',[],{'sys::Js':""},130,TableParserFactory);
TableRenderer.type$ = p.at$('TableRenderer','sys::Obj',['markdown::NodeRenderer','markdown::Visitor'],{'sys::Js':""},128,TableRenderer);
MarkdownTableRenderer.type$ = p.at$('MarkdownTableRenderer','sys::Obj',['markdown::NodeRenderer','markdown::Visitor'],{'sys::Js':""},128,MarkdownTableRenderer);
ImgAttrsExt.type$ = p.at$('ImgAttrsExt','sys::Obj',['markdown::MarkdownExt'],{'sys::Js':""},8194,ImgAttrsExt);
ImgAttrs.type$ = p.at$('ImgAttrs','markdown::CustomNode',['markdown::Delimited'],{'sys::Js':""},8192,ImgAttrs);
DelimiterProcessor.type$ = p.am$('DelimiterProcessor','sys::Obj',[],{'sys::Js':""},8451,DelimiterProcessor);
ImgAttrsDelimiterProcessor.type$ = p.at$('ImgAttrsDelimiterProcessor','sys::Obj',['markdown::DelimiterProcessor'],{'sys::Js':""},130,ImgAttrsDelimiterProcessor);
AttrProvider.type$ = p.am$('AttrProvider','sys::Obj',[],{'sys::Js':""},8449,AttrProvider);
ImgAttrsAttrProvider.type$ = p.at$('ImgAttrsAttrProvider','sys::Obj',['markdown::AttrProvider'],{'sys::Js':""},128,ImgAttrsAttrProvider);
MarkdownImgAttrsRenderer.type$ = p.at$('MarkdownImgAttrsRenderer','sys::Obj',['markdown::NodeRenderer','markdown::Visitor'],{'sys::Js':""},128,MarkdownImgAttrsRenderer);
ParserState.type$ = p.am$('ParserState','sys::Obj',[],{'sys::Js':""},8449,ParserState);
DocumentParser.type$ = p.at$('DocumentParser','sys::Obj',['markdown::ParserState'],{'sys::Js':""},128,DocumentParser);
OpenBlockParser.type$ = p.at$('OpenBlockParser','sys::Obj',[],{'sys::Js':""},128,OpenBlockParser);
MatchedBlockParser.type$ = p.at$('MatchedBlockParser','sys::Obj',[],{'sys::Js':""},8192,MatchedBlockParser);
Parsing.type$ = p.at$('Parsing','sys::Obj',[],{'sys::Js':"",'sys::NoDoc':""},8192,Parsing);
Scanner.type$ = p.at$('Scanner','sys::Obj',[],{'sys::Js':""},8192,Scanner);
Position.type$ = p.at$('Position','sys::Obj',[],{'sys::Js':""},8194,Position);
PostProcessor.type$ = p.am$('PostProcessor','sys::Obj',[],{'sys::Js':""},8449,PostProcessor);
LinkResolver.type$ = p.am$('LinkResolver','sys::Obj',['markdown::PostProcessor','markdown::Visitor'],{'sys::Js':"",'sys::NoDoc':""},8449,LinkResolver);
BlockStart.type$ = p.at$('BlockStart','sys::Obj',[],{'sys::Js':""},8224,BlockStart);
BlockContinue.type$ = p.at$('BlockContinue','sys::Obj',[],{'sys::Js':""},8194,BlockContinue);
SourceSpan.type$ = p.at$('SourceSpan','sys::Obj',[],{'sys::Js':""},8194,SourceSpan);
IncludeSourceSpans.type$ = p.at$('IncludeSourceSpans','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,IncludeSourceSpans);
SourceSpans.type$ = p.at$('SourceSpans','sys::Obj',[],{'sys::Js':""},8192,SourceSpans);
Parser.type$ = p.at$('Parser','sys::Obj',[],{'sys::Js':""},8194,Parser);
ParserBuilder.type$ = p.at$('ParserBuilder','sys::Obj',[],{'sys::Js':""},8224,ParserBuilder);
SourceLine.type$ = p.at$('SourceLine','sys::Obj',[],{'sys::Js':""},8194,SourceLine);
SourceLines.type$ = p.at$('SourceLines','sys::Obj',[],{'sys::Js':""},8192,SourceLines);
LinkReferenceDefinitionParser.type$ = p.at$('LinkReferenceDefinitionParser','sys::Obj',[],{'sys::Js':""},128,LinkReferenceDefinitionParser);
LinkRefState.type$ = p.at$('LinkRefState','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},170,LinkRefState);
LinkScanner.type$ = p.at$('LinkScanner','sys::Obj',[],{'sys::Js':""},128,LinkScanner);
HtmlBlockParser.type$ = p.at$('HtmlBlockParser','markdown::BlockParser',[],{'sys::Js':""},128,HtmlBlockParser);
HtmlBlockParserFactory.type$ = p.at$('HtmlBlockParserFactory','markdown::BlockParserFactory',[],{'sys::Js':""},130,HtmlBlockParserFactory);
BlockContent.type$ = p.at$('BlockContent','sys::Obj',[],{'sys::Js':""},128,BlockContent);
ParagraphParser.type$ = p.at$('ParagraphParser','markdown::BlockParser',[],{'sys::Js':""},128,ParagraphParser);
ThematicBreakParser.type$ = p.at$('ThematicBreakParser','markdown::BlockParser',[],{'sys::Js':""},128,ThematicBreakParser);
ThematicBreakParserFactory.type$ = p.at$('ThematicBreakParserFactory','markdown::BlockParserFactory',[],{'sys::Js':""},130,ThematicBreakParserFactory);
HeadingParser.type$ = p.at$('HeadingParser','markdown::BlockParser',[],{'sys::Js':""},128,HeadingParser);
HeadingParserFactory.type$ = p.at$('HeadingParserFactory','markdown::BlockParserFactory',[],{'sys::Js':""},130,HeadingParserFactory);
ListBlockParser.type$ = p.at$('ListBlockParser','markdown::BlockParser',[],{'sys::Js':""},128,ListBlockParser);
ListBlockParserFactory.type$ = p.at$('ListBlockParserFactory','markdown::BlockParserFactory',[],{'sys::Js':""},130,ListBlockParserFactory);
ListItemParser.type$ = p.at$('ListItemParser','markdown::BlockParser',[],{'sys::Js':""},128,ListItemParser);
ListData.type$ = p.at$('ListData','sys::Obj',[],{'sys::Js':""},128,ListData);
ListMarkerData.type$ = p.at$('ListMarkerData','sys::Obj',[],{'sys::Js':""},128,ListMarkerData);
BlockQuoteParser.type$ = p.at$('BlockQuoteParser','markdown::BlockParser',[],{'sys::Js':""},128,BlockQuoteParser);
BlockQuoteParserFactory.type$ = p.at$('BlockQuoteParserFactory','markdown::BlockParserFactory',[],{'sys::Js':""},130,BlockQuoteParserFactory);
DocumentBlockParser.type$ = p.at$('DocumentBlockParser','markdown::BlockParser',[],{'sys::Js':""},128,DocumentBlockParser);
FencedCodeParser.type$ = p.at$('FencedCodeParser','markdown::BlockParser',[],{'sys::Js':""},128,FencedCodeParser);
FencedCodeParserFactory.type$ = p.at$('FencedCodeParserFactory','markdown::BlockParserFactory',[],{'sys::Js':""},130,FencedCodeParserFactory);
IndentedCodeParser.type$ = p.at$('IndentedCodeParser','markdown::BlockParser',[],{'sys::Js':""},128,IndentedCodeParser);
IndentedCodeParserFactory.type$ = p.at$('IndentedCodeParserFactory','markdown::BlockParserFactory',[],{'sys::Js':""},130,IndentedCodeParserFactory);
BackslashInlineParser.type$ = p.at$('BackslashInlineParser','sys::Obj',['markdown::InlineContentParser'],{'sys::Js':""},128,BackslashInlineParser);
BackslashInlineParserFactory.type$ = p.at$('BackslashInlineParserFactory','sys::Obj',['markdown::InlineContentParserFactory'],{'sys::Js':""},130,BackslashInlineParserFactory);
HtmlInlineParser.type$ = p.at$('HtmlInlineParser','sys::Obj',['markdown::InlineContentParser'],{'sys::Js':""},128,HtmlInlineParser);
HtmlInlineParserFactory.type$ = p.at$('HtmlInlineParserFactory','sys::Obj',['markdown::InlineContentParserFactory'],{'sys::Js':""},130,HtmlInlineParserFactory);
AutolinkInlineParser.type$ = p.at$('AutolinkInlineParser','sys::Obj',['markdown::InlineContentParser'],{'sys::Js':""},128,AutolinkInlineParser);
AutolinkInlineParserFactory.type$ = p.at$('AutolinkInlineParserFactory','sys::Obj',['markdown::InlineContentParserFactory'],{'sys::Js':""},130,AutolinkInlineParserFactory);
InlineParser.type$ = p.am$('InlineParser','sys::Obj',[],{'sys::Js':""},8449,InlineParser);
InlineParserContext.type$ = p.at$('InlineParserContext','sys::Obj',[],{'sys::Js':""},8192,InlineParserContext);
InlineParserState.type$ = p.am$('InlineParserState','sys::Obj',[],{'sys::Js':""},8449,InlineParserState);
ParsedInline.type$ = p.at$('ParsedInline','sys::Obj',[],{'sys::Js':""},8192,ParsedInline);
LinkInfo.type$ = p.am$('LinkInfo','sys::Obj',[],{'sys::Js':""},8449,LinkInfo);
MLinkInfo.type$ = p.at$('MLinkInfo','sys::Obj',['markdown::LinkInfo'],{'sys::Js':""},128,MLinkInfo);
EntityInlineParser.type$ = p.at$('EntityInlineParser','sys::Obj',['markdown::InlineContentParser'],{'sys::Js':""},128,EntityInlineParser);
EntityInlineParserFactory.type$ = p.at$('EntityInlineParserFactory','sys::Obj',['markdown::InlineContentParserFactory'],{'sys::Js':""},130,EntityInlineParserFactory);
Delimiter.type$ = p.at$('Delimiter','sys::Obj',[],{'sys::Js':""},8192,Delimiter);
Bracket.type$ = p.at$('Bracket','sys::Obj',[],{'sys::Js':""},128,Bracket);
EmphasisDelimiterProcessor.type$ = p.at$('EmphasisDelimiterProcessor','sys::Obj',['markdown::DelimiterProcessor'],{'sys::Js':"",'sys::NoDoc':""},8195,EmphasisDelimiterProcessor);
AsteriskDelimiterProcessor.type$ = p.at$('AsteriskDelimiterProcessor','markdown::EmphasisDelimiterProcessor',[],{'sys::Js':""},130,AsteriskDelimiterProcessor);
UnderscoreDelimiterProcessor.type$ = p.at$('UnderscoreDelimiterProcessor','markdown::EmphasisDelimiterProcessor',[],{'sys::Js':""},130,UnderscoreDelimiterProcessor);
BackticksInlineParser.type$ = p.at$('BackticksInlineParser','markdown::InlineCodeParser',[],{'sys::Js':""},128,BackticksInlineParser);
BackticksInlineParserFactory.type$ = p.at$('BackticksInlineParserFactory','sys::Obj',['markdown::InlineContentParserFactory'],{'sys::Js':""},130,BackticksInlineParserFactory);
DefaultInlineParser.type$ = p.at$('DefaultInlineParser','sys::Obj',['markdown::InlineParser','markdown::InlineParserState'],{'sys::Js':""},128,DefaultInlineParser);
DestinationTitle.type$ = p.at$('DestinationTitle','sys::Obj',[],{'sys::Js':""},130,DestinationTitle);
DelimiterData.type$ = p.at$('DelimiterData','sys::Obj',[],{'sys::Js':""},128,DelimiterData);
LinkProcessor.type$ = p.am$('LinkProcessor','sys::Obj',[],{'sys::Js':""},8451,LinkProcessor);
CoreLinkProcessor.type$ = p.at$('CoreLinkProcessor','sys::Obj',['markdown::LinkProcessor'],{'sys::Js':""},130,CoreLinkProcessor);
LinkResult.type$ = p.at$('LinkResult','sys::Obj',[],{'sys::Js':""},8192,LinkResult);
Renderer.type$ = p.am$('Renderer','sys::Obj',[],{'sys::Js':""},8449,Renderer);
NodeRendererMap.type$ = p.at$('NodeRendererMap','sys::Obj',[],{'sys::Js':""},128,NodeRendererMap);
CoreHtmlNodeRenderer.type$ = p.at$('CoreHtmlNodeRenderer','sys::Obj',['markdown::Visitor','markdown::NodeRenderer'],{'sys::Js':"",'sys::NoDoc':""},8192,CoreHtmlNodeRenderer);
AltTextVisitor.type$ = p.at$('AltTextVisitor','sys::Obj',['markdown::Visitor'],{'sys::Js':""},128,AltTextVisitor);
UrlSanitizer.type$ = p.am$('UrlSanitizer','sys::Obj',[],{'sys::Js':""},8451,UrlSanitizer);
DefaultUrlSanitizer.type$ = p.at$('DefaultUrlSanitizer','sys::Obj',['markdown::UrlSanitizer'],{'sys::Js':""},130,DefaultUrlSanitizer);
HtmlContext.type$ = p.at$('HtmlContext','sys::Obj',[],{'sys::Js':""},8192,HtmlContext);
HtmlRenderer.type$ = p.at$('HtmlRenderer','sys::Obj',['markdown::Renderer'],{'sys::Js':""},8194,HtmlRenderer);
HtmlRendererBuilder.type$ = p.at$('HtmlRendererBuilder','sys::Obj',[],{'sys::Js':""},8224,HtmlRendererBuilder);
HtmlWriter.type$ = p.at$('HtmlWriter','sys::Obj',[],{'sys::Js':""},8192,HtmlWriter);
MarkdownRenderer.type$ = p.at$('MarkdownRenderer','sys::Obj',['markdown::Renderer'],{'sys::Js':""},8194,MarkdownRenderer);
MarkdownRendererBuilder.type$ = p.at$('MarkdownRendererBuilder','sys::Obj',[],{'sys::Js':""},8224,MarkdownRendererBuilder);
MarkdownContext.type$ = p.at$('MarkdownContext','sys::Obj',[],{'sys::Js':""},8192,MarkdownContext);
CoreMarkdownNodeRenderer.type$ = p.at$('CoreMarkdownNodeRenderer','sys::Obj',['markdown::Visitor','markdown::NodeRenderer'],{'sys::Js':"",'sys::NoDoc':""},8192,CoreMarkdownNodeRenderer);
ListHolder.type$ = p.at$('ListHolder','sys::Obj',[],{'sys::Js':""},128,ListHolder);
BulletListHolder.type$ = p.at$('BulletListHolder','markdown::ListHolder',[],{'sys::Js':""},128,BulletListHolder);
OrderedListHolder.type$ = p.at$('OrderedListHolder','markdown::ListHolder',[],{'sys::Js':""},128,OrderedListHolder);
LineBreakVisitor.type$ = p.at$('LineBreakVisitor','sys::Obj',['markdown::Visitor'],{'sys::Js':""},128,LineBreakVisitor);
MarkdownWriter.type$ = p.at$('MarkdownWriter','sys::Obj',[],{'sys::Js':""},8192,MarkdownWriter);
Html5.type$ = p.at$('Html5','sys::Obj',[],{'sys::Js':""},160,Html5);
Esc.type$ = p.at$('Esc','sys::Obj',[],{'sys::Js':""},160,Esc);
Chars.type$ = p.at$('Chars','sys::Obj',[],{'sys::Js':""},160,Chars);
MarkdownTest.type$ = p.at$('MarkdownTest','sys::Test',[],{'sys::Js':"",'sys::NoDoc':""},8193,MarkdownTest);
RenderingTest.type$ = p.at$('RenderingTest','markdown::MarkdownTest',[],{'sys::Js':"",'sys::NoDoc':""},8193,RenderingTest);
CoreRenderingTest.type$ = p.at$('CoreRenderingTest','markdown::RenderingTest',[],{'sys::Js':"",'sys::NoDoc':""},8192,CoreRenderingTest);
ListTightLooseTest.type$ = p.at$('ListTightLooseTest','markdown::CoreRenderingTest',[],{'sys::Js':""},8192,ListTightLooseTest);
CharsTest.type$ = p.at$('CharsTest','sys::Test',[],{'sys::Js':""},8192,CharsTest);
DelimitedTest.type$ = p.at$('DelimitedTest','sys::Test',[],{'sys::Js':""},8192,DelimitedTest);
DelimitedTestVisitor.type$ = p.at$('DelimitedTestVisitor','sys::Obj',['markdown::Visitor'],{'sys::Js':""},128,DelimitedTestVisitor);
EscTest.type$ = p.at$('EscTest','sys::Test',[],{'sys::Js':""},8192,EscTest);
NodeTest.type$ = p.at$('NodeTest','sys::Test',[],{'sys::Js':""},8192,NodeTest);
SpecialInputTest.type$ = p.at$('SpecialInputTest','markdown::CoreRenderingTest',[],{'sys::Js':""},8192,SpecialInputTest);
HeadingParserTest.type$ = p.at$('HeadingParserTest','markdown::CoreRenderingTest',[],{'sys::Js':""},8192,HeadingParserTest);
ScannerTest.type$ = p.at$('ScannerTest','sys::Test',[],{'sys::Js':""},8192,ScannerTest);
FencedCodeParserTest.type$ = p.at$('FencedCodeParserTest','markdown::CoreRenderingTest',[],{'sys::Js':""},8192,FencedCodeParserTest);
DelimiterProcessorTest.type$ = p.at$('DelimiterProcessorTest','markdown::CoreRenderingTest',[],{},8192,DelimiterProcessorTest);
LinkReferenceDefinitionParserTest.type$ = p.at$('LinkReferenceDefinitionParserTest','sys::Test',[],{'sys::Js':""},8192,LinkReferenceDefinitionParserTest);
HtmlInlineParserTest.type$ = p.at$('HtmlInlineParserTest','markdown::CoreRenderingTest',[],{'sys::Js':""},8192,HtmlInlineParserTest);
LinkReferenceDefinitionNodeTest.type$ = p.at$('LinkReferenceDefinitionNodeTest','sys::Test',[],{'sys::Js':""},8192,LinkReferenceDefinitionNodeTest);
ThematicBreakParserTest.type$ = p.at$('ThematicBreakParserTest','sys::Test',[],{'sys::Js':""},8192,ThematicBreakParserTest);
SourceLineTest.type$ = p.at$('SourceLineTest','sys::Test',[],{'sys::Js':""},8192,SourceLineTest);
PathologicalTest.type$ = p.at$('PathologicalTest','markdown::CoreRenderingTest',[],{},8192,PathologicalTest);
ParserTest.type$ = p.at$('ParserTest','sys::Test',[],{'sys::Js':""},8192,ParserTest);
TestDashBlock.type$ = p.at$('TestDashBlock','markdown::CustomBlock',[],{'sys::Js':""},128,TestDashBlock);
TestDashBlockParser.type$ = p.at$('TestDashBlockParser','markdown::BlockParser',[],{'sys::Js':""},128,TestDashBlockParser);
TestDashBlockParserFactory.type$ = p.at$('TestDashBlockParserFactory','markdown::BlockParserFactory',[],{'sys::Js':""},130,TestDashBlockParserFactory);
HtmlRendererTest.type$ = p.at$('HtmlRendererTest','sys::Test',[],{'sys::Js':""},8192,HtmlRendererTest);
ListBlockParserTest.type$ = p.at$('ListBlockParserTest','sys::Test',[],{'sys::Js':""},8192,ListBlockParserTest);
CommonMarkSpecTest.type$ = p.at$('CommonMarkSpecTest','sys::Test',[],{},8193,CommonMarkSpecTest);
HtmlCoreSpecTest.type$ = p.at$('HtmlCoreSpecTest','markdown::CommonMarkSpecTest',[],{},8192,HtmlCoreSpecTest);
ExampleRes.type$ = p.at$('ExampleRes','sys::Obj',[],{'sys::NoDoc':""},8194,ExampleRes);
Example.type$ = p.at$('Example','sys::Obj',[],{'sys::NoDoc':""},8194,Example);
TableMarkdownRendererTest.type$ = p.at$('TableMarkdownRendererTest','sys::Test',[],{'sys::Js':""},8192,TableMarkdownRendererTest);
ImgAttrsExtTest.type$ = p.at$('ImgAttrsExtTest','markdown::RenderingTest',[],{'sys::Js':""},8192,ImgAttrsExtTest);
TablesExtTest.type$ = p.at$('TablesExtTest','markdown::RenderingTest',[],{'sys::Js':""},8192,TablesExtTest);
TablesTestAttrProvider.type$ = p.at$('TablesTestAttrProvider','sys::Obj',['markdown::AttrProvider'],{'sys::Js':""},128,TablesTestAttrProvider);
XetodocExtTest.type$ = p.at$('XetodocExtTest','markdown::RenderingTest',[],{'sys::Js':""},8192,XetodocExtTest);
TestLinkResolver.type$ = p.at$('TestLinkResolver','sys::Obj',['markdown::LinkResolver'],{'sys::Js':"",'sys::NoDoc':""},8192,TestLinkResolver);
MarkdownRendererTest.type$ = p.at$('MarkdownRendererTest','sys::Test',[],{'sys::Js':""},8192,MarkdownRendererTest);
MarkdownSpecTest.type$ = p.at$('MarkdownSpecTest','markdown::CommonMarkSpecTest',[],{},8192,MarkdownSpecTest);
MarkdownExt.type$.am$('extendParser',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('builder','markdown::ParserBuilder',false)]),{}).am$('extendHtml',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('builder','markdown::HtmlRendererBuilder',false)]),{}).am$('extendMarkdown',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('builder','markdown::MarkdownRendererBuilder',false)]),{});
Node.type$.af$('p',67584,'markdown::Node?',{}).af$('next',73728,'markdown::Node?',{}).af$('prev',73728,'markdown::Node?',{}).af$('firstChild',73728,'markdown::Node?',{}).af$('lastChild',73728,'markdown::Node?',{}).af$('sourceSpans',73728,'markdown::SourceSpan[]?',{}).am$('make',8196,'sys::Void',xp,{}).am$('parent',270336,'markdown::Node?',xp,{}).am$('setParent',266240,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','markdown::Node?',false)]),{}).am$('walk',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('visitor','markdown::Visitor',false)]),{}).am$('appendChild',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('child','markdown::Node',false)]),{}).am$('unlink',8192,'sys::Void',xp,{}).am$('insertAfter',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sibling','markdown::Node',false)]),{}).am$('insertBefore',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sibling','markdown::Node',false)]),{}).am$('addSourceSpan',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sourceSpan','markdown::SourceSpan?',false)]),{}).am$('setSourceSpans',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sourceSpans','markdown::SourceSpan[]',false)]),{}).am$('eachBetween',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('start','markdown::Node',false),new sys.Param('end','markdown::Node',false),new sys.Param('f','|markdown::Node->sys::Void|',false)]),{}).am$('children',40962,'markdown::Node[]',sys.List.make(sys.Param.type$,[new sys.Param('parent','markdown::Node',false)]),{}).am$('find',40962,'markdown::Node',sys.List.make(sys.Param.type$,[new sys.Param('parent','markdown::Node',false),new sys.Param('nodeType','sys::Type',false)]),{}).am$('tryFind',40962,'markdown::Node?',sys.List.make(sys.Param.type$,[new sys.Param('parent','markdown::Node',false),new sys.Param('nodeType','sys::Type',false)]),{}).am$('eachChild',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','markdown::Node',false),new sys.Param('f','|markdown::Node->sys::Void|',false)]),{'sys::NoDoc':""}).am$('dumpTree',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false),new sys.Param('out','sys::OutStream',true),new sys.Param('indent','sys::Int',true)]),{'sys::NoDoc':""}).am$('toStr',271360,'sys::Str',xp,{}).am$('toStrAttributes',266240,'sys::Str',xp,{});
HardLineBreak.type$.am$('make',139268,'sys::Void',xp,{});
SoftLineBreak.type$.am$('make',139268,'sys::Void',xp,{});
Delimited.type$.am$('openingDelim',270337,'sys::Str',xp,{}).am$('closingDelim',270337,'sys::Str',xp,{});
StrongEmphasis.type$.af$('delimiter',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('delimiter','sys::Str',false)]),{}).am$('openingDelim',271360,'sys::Str',xp,{}).am$('closingDelim',271360,'sys::Str',xp,{});
Emphasis.type$.af$('delimiter',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('delimiter','sys::Str',false)]),{}).am$('openingDelim',271360,'sys::Str',xp,{}).am$('closingDelim',271360,'sys::Str',xp,{});
Text.type$.af$('literal',73728,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('literal','sys::Str',false)]),{}).am$('toStrAttributes',267264,'sys::Str',xp,{});
Code.type$.af$('literal',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('literal','sys::Str',false)]),{});
HtmlInline.type$.af$('literal',73728,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('literal','sys::Str?',true)]),{});
CustomNode.type$.am$('make',139268,'sys::Void',xp,{});
Block.type$.am$('parent',271360,'markdown::Block?',xp,{}).am$('setParent',267264,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','markdown::Node?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Document.type$.am$('make',139268,'sys::Void',xp,{});
Heading.type$.af$('level',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('level','sys::Int',true)]),{});
BlockQuote.type$.am$('make',139268,'sys::Void',xp,{});
FencedCode.type$.af$('fenceChar',73728,'sys::Str?',{}).af$('fenceIndent',73728,'sys::Int',{}).af$('openingFenceLen',73728,'sys::Int?',{}).af$('closingFenceLen',73728,'sys::Int?',{}).af$('info',73728,'sys::Str?',{}).af$('literal',73728,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('fenceChar','sys::Str?',true)]),{}).am$('checkFenceLens',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('openingFenceLen','sys::Int?',false),new sys.Param('closingFenceLen','sys::Int?',false)]),{});
HtmlBlock.type$.af$('literal',73728,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('literal','sys::Str?',true)]),{});
ThematicBreak.type$.af$('literal',73728,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('literal','sys::Str?',true)]),{});
IndentedCode.type$.af$('literal',73728,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('literal','sys::Str?',true)]),{});
ListBlock.type$.af$('tight',73728,'sys::Bool',{}).am$('make',139268,'sys::Void',xp,{});
BulletList.type$.af$('marker',73728,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('marker','sys::Str?',true)]),{});
OrderedList.type$.af$('startNumber',73728,'sys::Int?',{}).af$('markerDelim',73728,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('startNumber','sys::Int?',false),new sys.Param('markerDelim','sys::Str?',false)]),{});
ListItem.type$.af$('markerIndent',73728,'sys::Int?',{}).af$('contentIndent',73728,'sys::Int?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('markerIndent','sys::Int?',false),new sys.Param('contentIndent','sys::Int?',false)]),{});
Paragraph.type$.am$('make',139268,'sys::Void',xp,{});
CustomBlock.type$.am$('make',139268,'sys::Void',xp,{});
Definitions.type$.af$('defsByType',67584,'[sys::Type:markdown::DefinitionMap]',{}).am$('make',8196,'sys::Void',xp,{}).am$('addDefinitions',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('map','markdown::DefinitionMap',false)]),{}).am$('def',8192,'markdown::Block?',sys.List.make(sys.Param.type$,[new sys.Param('of','sys::Type',false),new sys.Param('label','sys::Str',false)]),{}).am$('get',2048,'markdown::DefinitionMap?',sys.List.make(sys.Param.type$,[new sys.Param('of','sys::Type',false)]),{});
DefinitionMap.type$.af$('of',73730,'sys::Type',{}).af$('defs',67584,'[sys::Str:markdown::Block]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('of','sys::Type',false)]),{}).am$('get',8192,'markdown::Block?',sys.List.make(sys.Param.type$,[new sys.Param('label','sys::Str',false),new sys.Param('def','markdown::Block?',true)]),{'sys::Operator':""}).am$('addAll',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('that','markdown::DefinitionMap',false)]),{}).am$('putIfAbsent',8192,'markdown::Block?',sys.List.make(sys.Param.type$,[new sys.Param('label','sys::Str',false),new sys.Param('def','markdown::Block',false)]),{}).am$('set',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('normLabel','sys::Str',false),new sys.Param('def','markdown::Block',false)]),{});
LinkNode.type$.af$('destination',73728,'sys::Str',{}).af$('title',73728,'sys::Str?',{}).af$('isCode',73728,'sys::Bool',{'sys::NoDoc':""}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('destination','sys::Str',false),new sys.Param('title','sys::Str?',true)]),{}).am$('setText',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('text','sys::Str',false)]),{'sys::NoDoc':""}).am$('setContent',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('content','markdown::Node',false)]),{'sys::NoDoc':""}).am$('toStrAttributes',267264,'sys::Str',xp,{});
Link.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('destination','sys::Str',false),new sys.Param('title','sys::Str?',true)]),{});
Image.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('destination','sys::Str',false),new sys.Param('title','sys::Str?',true)]),{});
LinkReferenceDefinition.type$.af$('label',73730,'sys::Str',{}).af$('destination',73730,'sys::Str',{}).af$('title',73730,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('label','sys::Str',false),new sys.Param('destination','sys::Str',false),new sys.Param('title','sys::Str?',false)]),{});
Visitor.type$.am$('visitBlockQuote',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::BlockQuote',false)]),{}).am$('visitBulletList',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::BulletList',false)]),{}).am$('visitCode',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Code',false)]),{}).am$('visitCustomBlock',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::CustomBlock',false)]),{}).am$('visitCustomNode',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::CustomNode',false)]),{}).am$('visitDocument',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Document',false)]),{}).am$('visitEmphasis',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Emphasis',false)]),{}).am$('visitFencedCode',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::FencedCode',false)]),{}).am$('visitHardLineBreak',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::HardLineBreak',false)]),{}).am$('visitHeading',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Heading',false)]),{}).am$('visitHtmlBlock',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::HtmlBlock',false)]),{}).am$('visitHtmlInline',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::HtmlInline',false)]),{}).am$('visitImage',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Image',false)]),{}).am$('visitIndentedCode',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::IndentedCode',false)]),{}).am$('visitLink',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Link',false)]),{}).am$('visitListItem',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::ListItem',false)]),{}).am$('visitLinkReferenceDefinition',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::LinkReferenceDefinition',false)]),{}).am$('visitOrderedList',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::OrderedList',false)]),{}).am$('visitParagraph',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Paragraph',false)]),{}).am$('visitSoftLineBreak',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::SoftLineBreak',false)]),{}).am$('visitStrongEmphasis',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::StrongEmphasis',false)]),{}).am$('visitText',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Text',false)]),{}).am$('visitThematicBreak',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::ThematicBreak',false)]),{}).am$('visitChildren',266240,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','markdown::Node',false)]),{});
Xetodoc.type$.af$('exts',100354,'markdown::MarkdownExt[]',{}).af$('xetodoc',100354,'markdown::MarkdownExt[]',{}).af$('htmlRenderer',106498,'markdown::HtmlRenderer',{}).af$('markdownRenderer',106498,'markdown::MarkdownRenderer',{}).am$('parse',40962,'markdown::Document',sys.List.make(sys.Param.type$,[new sys.Param('source','sys::Str',false),new sys.Param('linkResolver','markdown::LinkResolver?',true)]),{}).am$('parser',40962,'markdown::Parser',sys.List.make(sys.Param.type$,[new sys.Param('linkResolver','markdown::LinkResolver?',true)]),{}).am$('parserBuilder',40962,'markdown::ParserBuilder',xp,{}).am$('toHtml',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('source','sys::Str',false),new sys.Param('linkResolver','markdown::LinkResolver?',true)]),{}).am$('renderToHtml',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('htmlBuilder',40962,'markdown::HtmlRendererBuilder',xp,{}).am$('renderToMarkdown',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('markdownBuilder',40962,'markdown::MarkdownRendererBuilder',xp,{}).am$('extendParser',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('builder','markdown::ParserBuilder',false)]),{}).am$('extendHtml',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('builder','markdown::HtmlRendererBuilder',false)]),{}).am$('extendMarkdown',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('builder','markdown::MarkdownRendererBuilder',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
InlineContentParser.type$.am$('tryParse',270337,'markdown::ParsedInline?',sys.List.make(sys.Param.type$,[new sys.Param('inlineParserState','markdown::InlineParserState',false)]),{});
InlineCodeParser.type$.af$('markerChar',69634,'sys::Int',{}).af$('maxMarkers',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('markerChar','sys::Int',false)]),{}).am$('withMaxMarkers',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('max','sys::Int',false)]),{}).am$('tryParse',271360,'markdown::ParsedInline?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::InlineParserState',false)]),{});
TicksInlineParser.type$.af$('factory',106498,'markdown::InlineContentParserFactory',{}).am$('make',8196,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
InlineContentParserFactory.type$.am$('triggerChars',270337,'sys::Int[]',xp,{}).am$('create',270337,'markdown::InlineContentParser',xp,{});
TicksInlineParserFactory.type$.af$('triggerChars',336898,'sys::Int[]',{}).am$('create',271360,'markdown::InlineContentParser',xp,{}).am$('make',139268,'sys::Void',xp,{});
BackticksLinkParser.type$.af$('factory',106498,'markdown::InlineContentParserFactory',{}).am$('tryParse',271360,'markdown::ParsedInline?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::InlineParserState',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
BackticksLinkParserFactory.type$.af$('triggerChars',336898,'sys::Int[]',{}).am$('create',271360,'markdown::InlineContentParser',xp,{}).am$('make',139268,'sys::Void',xp,{});
NodeRenderer.type$.am$('nodeTypes',270337,'sys::Type[]',xp,{}).am$('render',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('beforeRoot',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rootNode','markdown::Node',false)]),{}).am$('afterRoot',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rootNode','markdown::Node',false)]),{});
MdTicksRenderer.type$.af$('cx',67584,'markdown::MarkdownContext',{}).af$('nodeTypes',336898,'sys::Type[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','markdown::MarkdownContext',false)]),{}).am$('render',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{});
TablesExt.type$.am$('extendParser',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('builder','markdown::ParserBuilder',false)]),{}).am$('extendHtml',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('builder','markdown::HtmlRendererBuilder',false)]),{}).am$('extendMarkdown',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('builder','markdown::MarkdownRendererBuilder',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Table.type$.am$('make',139268,'sys::Void',xp,{});
TableHead.type$.am$('make',139268,'sys::Void',xp,{});
TableBody.type$.am$('make',139268,'sys::Void',xp,{});
TableRow.type$.am$('make',139268,'sys::Void',xp,{});
TableCell.type$.af$('header',73728,'sys::Bool',{}).af$('alignment',73728,'markdown::Alignment',{}).af$('width',73728,'sys::Int',{}).am$('make',8196,'sys::Void',xp,{}).am$('makeFields',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('header','sys::Bool',false),new sys.Param('alignment','markdown::Alignment',false),new sys.Param('width','sys::Int',false)]),{}).am$('toStrAttributes',267264,'sys::Str',xp,{});
Alignment.type$.af$('unspecified',106506,'markdown::Alignment',{}).af$('left',106506,'markdown::Alignment',{}).af$('center',106506,'markdown::Alignment',{}).af$('right',106506,'markdown::Alignment',{}).af$('vals',106498,'markdown::Alignment[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'markdown::Alignment?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
BlockParser.type$.am$('isContainer',270336,'sys::Bool',xp,{}).am$('canHaveLazyContinuationLines',270336,'sys::Bool',xp,{}).am$('canContain',270336,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('childBlock','markdown::Block',false)]),{}).am$('block',270337,'markdown::Block',xp,{}).am$('tryContinue',270337,'markdown::BlockContinue?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false)]),{}).am$('addLine',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','markdown::SourceLine',false)]),{}).am$('addSourceSpan',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sourceSpan','markdown::SourceSpan',false)]),{}).am$('definitions',270336,'markdown::DefinitionMap[]',xp,{}).am$('closeBlock',270336,'sys::Void',xp,{}).am$('parseInlines',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('inlineParser','markdown::InlineParser',false)]),{}).am$('make',139268,'sys::Void',xp,{});
TableParser.type$.af$('columns',67584,'markdown::TableCell[]',{}).af$('rowLines',67584,'markdown::SourceLine[]',{}).af$('block',336896,'markdown::Table',{}).af$('canHaveLazyContinuationLines',336896,'sys::Bool',{}).af$('factory',106498,'markdown::BlockParserFactory',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('columns','markdown::TableCell[]',false),new sys.Param('headerLine','markdown::SourceLine',false)]),{}).am$('tryContinue',271360,'markdown::BlockContinue?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false)]),{}).am$('addLine',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','markdown::SourceLine',false)]),{}).am$('parseInlines',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parser','markdown::InlineParser',false)]),{}).am$('parseCell',2048,'markdown::TableCell',sys.List.make(sys.Param.type$,[new sys.Param('cell','markdown::SourceLine',false),new sys.Param('column','sys::Int',false),new sys.Param('parser','markdown::InlineParser',false)]),{}).am$('split',32898,'markdown::SourceLine[]',sys.List.make(sys.Param.type$,[new sys.Param('line','markdown::SourceLine',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
BlockParserFactory.type$.am$('tryStart',270337,'markdown::BlockStart?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false),new sys.Param('matchedBlockParser','markdown::MatchedBlockParser',false)]),{}).am$('make',139268,'sys::Void',xp,{});
TableParserFactory.type$.am$('tryStart',271360,'markdown::BlockStart?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false),new sys.Param('parser','markdown::MatchedBlockParser',false)]),{}).am$('parseSeparator',34818,'markdown::TableCell[]?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('toAlignment',34818,'markdown::Alignment',sys.List.make(sys.Param.type$,[new sys.Param('left','sys::Bool',false),new sys.Param('right','sys::Bool',false)]),{}).am$('make',139268,'sys::Void',xp,{});
TableRenderer.type$.af$('cx',67584,'markdown::HtmlContext',{}).af$('html',67584,'markdown::HtmlWriter',{}).af$('nodeTypes',336898,'sys::Type[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','markdown::HtmlContext',false)]),{}).am$('render',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('visitTable',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('table','markdown::Table',false)]),{}).am$('visitTableHead',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('head','markdown::TableHead',false)]),{}).am$('visitTableBody',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('body','markdown::TableBody',false)]),{}).am$('visitTableRow',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('row','markdown::TableRow',false)]),{}).am$('visitTableCell',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cell','markdown::TableCell',false)]),{}).am$('renderTableNode',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false),new sys.Param('tagName','sys::Str',false),new sys.Param('attrs','[sys::Str:sys::Str?]',true)]),{}).am$('renderChildren',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','markdown::Node',false)]),{}).am$('cellAttrs',2048,'[sys::Str:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('cell','markdown::TableCell',false),new sys.Param('tagName','sys::Str',false)]),{}).am$('toAttrs',2048,'[sys::Str:sys::Str?]',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false),new sys.Param('tagName','sys::Str',false),new sys.Param('attrs','[sys::Str:sys::Str?]',false)]),{});
MarkdownTableRenderer.type$.af$('pipe',100354,'|sys::Int->sys::Bool|',{}).af$('cx',67584,'markdown::MarkdownContext',{}).af$('writer',67584,'markdown::MarkdownWriter',{}).af$('columns',67584,'markdown::Alignment[]',{}).af$('nodeTypes',336898,'sys::Type[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','markdown::MarkdownContext',false)]),{}).am$('render',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('visitTable',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Table',false)]),{}).am$('visitTableHead',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('head','markdown::TableHead',false)]),{}).am$('visitTableBody',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('body','markdown::TableBody',false)]),{}).am$('visitTableRow',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('row','markdown::TableRow',false)]),{}).am$('visitTableCell',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cell','markdown::TableCell',false)]),{}).am$('renderChildren',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','markdown::Node',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ImgAttrsExt.type$.am$('extendParser',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('builder','markdown::ParserBuilder',false)]),{}).am$('extendHtml',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('builder','markdown::HtmlRendererBuilder',false)]),{}).am$('extendMarkdown',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('builder','markdown::MarkdownRendererBuilder',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ImgAttrs.type$.af$('attrs',73730,'[sys::Str:sys::Str]',{}).af$('openingDelim',336898,'sys::Str',{}).af$('closingDelim',336898,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('attrs','[sys::Str:sys::Str]',false)]),{}).am$('toStrAttributes',267264,'sys::Str',xp,{});
DelimiterProcessor.type$.am$('openingChar',270337,'sys::Int',xp,{}).am$('closingChar',270337,'sys::Int',xp,{}).am$('minLen',270337,'sys::Int',xp,{}).am$('process',270337,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('openingRun','markdown::Delimiter',false),new sys.Param('closingRun','markdown::Delimiter',false)]),{});
ImgAttrsDelimiterProcessor.type$.af$('supported_attrs',100354,'sys::Str[]',{}).af$('openingChar',336898,'sys::Int',{}).af$('closingChar',336898,'sys::Int',{}).af$('minLen',336898,'sys::Int',{}).am$('process',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('openingRun','markdown::Delimiter',false),new sys.Param('closingRun','markdown::Delimiter',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
AttrProvider.type$.am$('setAttrs',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false),new sys.Param('tagName','sys::Str',false),new sys.Param('attrs','[sys::Str:sys::Str?]',false)]),{});
ImgAttrsAttrProvider.type$.am$('setAttrs',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false),new sys.Param('tagName','sys::Str',false),new sys.Param('attrs','[sys::Str:sys::Str?]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
MarkdownImgAttrsRenderer.type$.af$('writer',67584,'markdown::MarkdownWriter',{}).af$('nodeTypes',336898,'sys::Type[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','markdown::MarkdownContext',false)]),{}).am$('beforeRoot',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('root','markdown::Node',false)]),{}).am$('afterRoot',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('root','markdown::Node',false)]),{}).am$('visitImgAttrs',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('attrs','markdown::ImgAttrs',false)]),{}).am$('render',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{});
ParserState.type$.am$('line',270337,'markdown::SourceLine?',xp,{}).am$('index',270337,'sys::Int',xp,{}).am$('nextNonSpaceIndex',270337,'sys::Int',xp,{}).am$('column',270337,'sys::Int',xp,{}).am$('indent',270337,'sys::Int',xp,{}).am$('isBlank',270337,'sys::Bool',xp,{}).am$('activeBlockParser',270337,'markdown::BlockParser',xp,{});
DocumentParser.type$.af$('core_block_types',106498,'sys::Type[]',{}).af$('core_factories',106498,'[sys::Type:markdown::BlockParserFactory]',{}).af$('documentBlockParser',67584,'markdown::DocumentBlockParser',{}).af$('definitions',67584,'markdown::Definitions',{}).af$('parser',73730,'markdown::Parser',{}).af$('blockParserFactories',73730,'markdown::BlockParserFactory[]',{}).af$('includeSourceSpans',73730,'markdown::IncludeSourceSpans',{}).af$('line',336896,'markdown::SourceLine?',{}).af$('lineIndex',67584,'sys::Int',{}).af$('index',336896,'sys::Int',{}).af$('column',336896,'sys::Int',{}).af$('columnIsInTab',67584,'sys::Bool',{}).af$('nextNonSpaceIndex',336896,'sys::Int',{}).af$('nextNonSpaceColumn',67584,'sys::Int',{}).af$('indent',336896,'sys::Int',{}).af$('isBlank',336896,'sys::Bool',{}).af$('openBlockParsers',67584,'markdown::OpenBlockParser[]',{}).af$('allBlockParsers',67584,'markdown::BlockParser[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parser','markdown::Parser',false)]),{}).am$('calculateBlockParserFactories',40962,'markdown::BlockParserFactory[]',sys.List.make(sys.Param.type$,[new sys.Param('custom','markdown::BlockParserFactory[]',false),new sys.Param('enabled','sys::Type[]',false)]),{}).am$('checkEnabledBlockTypes',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('types','sys::Type[]',false)]),{}).am$('activeBlockParser',271360,'markdown::BlockParser',xp,{}).am$('parse',8192,'markdown::Document',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('parseLine',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ln','sys::Str',false)]),{}).am$('setLine',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ln','sys::Str',false)]),{}).am$('findNextNonSpace',2048,'sys::Void',xp,{}).am$('setNewIndex',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('newIndex','sys::Int',false)]),{}).am$('setNewColumn',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('newColumn','sys::Int',false)]),{}).am$('advance',2048,'sys::Void',xp,{}).am$('addLine',2048,'sys::Void',xp,{}).am$('addSourceSpans',2048,'sys::Void',xp,{}).am$('findBlockStart',2048,'markdown::BlockStart?',sys.List.make(sys.Param.type$,[new sys.Param('blockParser','markdown::BlockParser',false)]),{}).am$('processInLines',2048,'sys::Void',xp,{}).am$('addChild',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('openBlockParser','markdown::OpenBlockParser',false)]),{}).am$('activateBlockParser',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('openBlockParser','markdown::OpenBlockParser',false)]),{}).am$('deactivateBlockParser',2048,'markdown::OpenBlockParser',xp,{}).am$('prepareActiveBlockParserForReplacement',2048,'markdown::Block',xp,{}).am$('prepareLine',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false)]),{}).am$('finalizeAndProcess',2048,'markdown::Document',xp,{}).am$('closeBlockParsers',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('count','sys::Int',false)]),{}).am$('finalize',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('blockParser','markdown::BlockParser',false)]),{}).am$('addDefinitionsFrom',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('blockParser','markdown::BlockParser',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
OpenBlockParser.type$.af$('blockParser',73728,'markdown::BlockParser',{}).af$('sourceIndex',73728,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('blockParser','markdown::BlockParser',false),new sys.Param('sourceIndex','sys::Int',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
MatchedBlockParser.type$.af$('matchedBlockParser',73728,'markdown::BlockParser',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('matchedBlockParser','markdown::BlockParser',false)]),{}).am$('paragraphLines',8192,'markdown::SourceLines',xp,{});
Parsing.type$.af$('code_block_indent',106498,'sys::Int',{}).am$('columnsToNextTabStop',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('column','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
Scanner.type$.af$('lines',67586,'markdown::SourceLine[]',{}).af$('lineIndex',67584,'sys::Int',{}).af$('index',67584,'sys::Int',{}).af$('line',67584,'markdown::SourceLine',{}).af$('lineLen',67584,'sys::Int',{}).af$('END',98434,'sys::Int',{}).am$('makeLine',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','markdown::SourceLine',false)]),{}).am$('makeSourceLines',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sourceLines','markdown::SourceLines',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lines','markdown::SourceLine[]',false),new sys.Param('lineIndex','sys::Int',true),new sys.Param('index','sys::Int',true)]),{}).am$('peek',8192,'sys::Int',xp,{}).am$('peekCodePoint',8192,'sys::Int',xp,{}).am$('peekPrevCodePoint',8192,'sys::Int',xp,{}).am$('hasNext',8192,'sys::Bool',xp,{}).am$('next',8192,'sys::Void',xp,{}).am$('matchMultiple',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('ch','sys::Int',false)]),{}).am$('match',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Int->sys::Bool|',false)]),{}).am$('whitespace',8192,'sys::Int',xp,{}).am$('find',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('ch','sys::Int',false)]),{}).am$('findMatch',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Int->sys::Bool|',false)]),{}).am$('nextCh',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ch','sys::Int',false)]),{}).am$('nextStr',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('content','sys::Str',false)]),{}).am$('pos',8192,'markdown::Position',xp,{}).am$('setPos',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pos','markdown::Position',false)]),{}).am$('source',8192,'markdown::SourceLines',sys.List.make(sys.Param.type$,[new sys.Param('begin','markdown::Position',false),new sys.Param('end','markdown::Position',false)]),{}).am$('setLine',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','markdown::SourceLine',false)]),{}).am$('checkPos',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lineIndex','sys::Int',false),new sys.Param('index','sys::Int',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Position.type$.af$('lineIndex',73730,'sys::Int',{}).af$('index',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lineIndex','sys::Int',false),new sys.Param('index','sys::Int',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
PostProcessor.type$.am$('process',270337,'markdown::Node',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{});
LinkResolver.type$.am$('process',271360,'markdown::Node',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('visitLink',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('link','markdown::Link',false)]),{}).am$('visitImage',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('img','markdown::Image',false)]),{}).am$('resolve',266241,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('linkNode','markdown::LinkNode',false)]),{});
BlockStart.type$.af$('blockParsers',73728,'markdown::BlockParser[]',{}).af$('newIndex',73728,'sys::Int',{}).af$('newColumn',73728,'sys::Int',{}).af$('isReplaceActiveBlockParser',73728,'sys::Bool',{}).am$('none',40966,'markdown::BlockStart?',xp,{}).am$('of',40966,'markdown::BlockStart?',sys.List.make(sys.Param.type$,[new sys.Param('blockParsers','markdown::BlockParser[]',false)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('blockParsers','markdown::BlockParser[]',false)]),{}).am$('atIndex',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('newIndex','sys::Int',false)]),{}).am$('atColumn',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('newColumn','sys::Int',false)]),{}).am$('replaceActiveBlockParser',8192,'sys::This',xp,{});
BlockContinue.type$.af$('newIndex',73730,'sys::Int',{}).af$('newColumn',73730,'sys::Int',{}).af$('finalize',73730,'sys::Bool',{}).am$('none',40966,'markdown::BlockContinue?',xp,{}).am$('atIndex',40966,'markdown::BlockContinue?',sys.List.make(sys.Param.type$,[new sys.Param('newIndex','sys::Int',false)]),{}).am$('atColumn',40966,'markdown::BlockContinue?',sys.List.make(sys.Param.type$,[new sys.Param('newColumn','sys::Int',false)]),{}).am$('finished',40966,'markdown::BlockContinue?',xp,{}).am$('priv_make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('newIndex','sys::Int',false),new sys.Param('newColumn','sys::Int',false),new sys.Param('finalize','sys::Bool',false)]),{});
SourceSpan.type$.af$('lineIndex',73730,'sys::Int',{}).af$('columnIndex',73730,'sys::Int',{}).af$('len',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lineIndex','sys::Int',false),new sys.Param('columnIndex','sys::Int',false),new sys.Param('len','sys::Int',false)]),{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
IncludeSourceSpans.type$.af$('none',106506,'markdown::IncludeSourceSpans',{}).af$('blocks',106506,'markdown::IncludeSourceSpans',{}).af$('blocks_and_inlines',106506,'markdown::IncludeSourceSpans',{}).af$('vals',106498,'markdown::IncludeSourceSpans[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'markdown::IncludeSourceSpans?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
SourceSpans.type$.af$('sourceSpans',73728,'markdown::SourceSpan[]',{}).am$('empty',40966,'markdown::SourceSpans?',xp,{}).am$('priv_make',8196,'sys::Void',xp,{}).am$('addAllFrom',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('nodes','markdown::Node[]',false)]),{}).am$('addAll',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('other','markdown::SourceSpan[]',false)]),{});
Parser.type$.af$('blockParserFactories',65666,'markdown::BlockParserFactory[]',{}).af$('inlineContentParserFactories',65666,'markdown::InlineContentParserFactory[]',{}).af$('includeSourceSpans',65666,'markdown::IncludeSourceSpans',{}).af$('delimiterProcessors',65666,'markdown::DelimiterProcessor[]',{}).af$('linkProcessors',65666,'markdown::LinkProcessor[]',{}).af$('linkMarkers',65666,'sys::Int[]',{}).af$('postProcessorFactories',65666,'|->markdown::PostProcessor|[]',{}).am$('builder',40962,'markdown::ParserBuilder',xp,{}).am$('make',40966,'markdown::Parser?',xp,{}).am$('makeBuilder',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('builder','markdown::ParserBuilder',false)]),{}).am$('parse',8192,'markdown::Node',sys.List.make(sys.Param.type$,[new sys.Param('text','sys::Str',false)]),{}).am$('parseStream',8192,'markdown::Node',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('createDocumentParser',2048,'markdown::DocumentParser',xp,{}).am$('postProcess',2048,'markdown::Node',sys.List.make(sys.Param.type$,[new sys.Param('doc','markdown::Node',false)]),{});
ParserBuilder.type$.af$('includeSourceSpans',65664,'markdown::IncludeSourceSpans',{}).af$('blockParserFactories',65664,'markdown::BlockParserFactory[]',{}).af$('inlineContentParserFactories',65664,'markdown::InlineContentParserFactory[]',{}).af$('enabledBlockTypes',65664,'sys::Type[]',{}).af$('delimiterProcessors',65664,'markdown::DelimiterProcessor[]',{}).af$('linkProcessors',65664,'markdown::LinkProcessor[]',{}).af$('linkMarkers',65664,'sys::Int[]',{}).af$('postProcessorFactories',65664,'|->markdown::PostProcessor|[]',{}).am$('make',132,'sys::Void',xp,{}).am$('build',8192,'markdown::Parser',xp,{}).am$('withEnabledBlockTypes',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('enabledBlockTypes','sys::Type[]',false)]),{}).am$('customBlockParserFactory',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('factory','markdown::BlockParserFactory',false)]),{}).am$('customInlineContentParserFactory',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('factory','markdown::InlineContentParserFactory',false)]),{}).am$('postProcessorFactory',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('factory','|->markdown::PostProcessor|',false)]),{}).am$('withIncludeSourceSpans',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','markdown::IncludeSourceSpans',false)]),{'sys::NoDoc':""}).am$('customDelimiterProcessor',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('delimiterProcessor','markdown::DelimiterProcessor',false)]),{}).am$('linkProcessor',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('linkProcessor','markdown::LinkProcessor',false)]),{}).am$('linkMarker',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('marker','sys::Int',false)]),{}).am$('extensions',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('exts','markdown::MarkdownExt[]',false)]),{});
SourceLine.type$.af$('content',73730,'sys::Str',{}).af$('sourceSpan',73730,'markdown::SourceSpan?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('content','sys::Str',false),new sys.Param('sourceSpan','markdown::SourceSpan?',true)]),{}).am$('substring',8192,'markdown::SourceLine',sys.List.make(sys.Param.type$,[new sys.Param('beginIndex','sys::Int',false),new sys.Param('endIndex','sys::Int',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
SourceLines.type$.af$('lines',73728,'markdown::SourceLine[]',{}).am$('empty',40966,'markdown::SourceLines?',xp,{}).am$('makeOne',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','markdown::SourceLine',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lines','markdown::SourceLine[]',false)]),{}).am$('isEmpty',8192,'sys::Bool',xp,{}).am$('addLine',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','markdown::SourceLine',false)]),{}).am$('content',8192,'sys::Str',xp,{}).am$('sourceSpans',8192,'markdown::SourceSpan[]',xp,{});
LinkReferenceDefinitionParser.type$.af$('state',73728,'markdown::LinkRefState',{}).af$('workingLines',67584,'markdown::SourceLine[]',{}).af$('definitions',67584,'markdown::LinkReferenceDefinition[]',{}).af$('sourceSpans',67584,'markdown::SourceSpan[]',{}).af$('label',67584,'sys::StrBuf?',{}).af$('destination',67584,'sys::Str?',{}).af$('titleDelim',67584,'sys::Int',{}).af$('title',67584,'sys::StrBuf?',{}).af$('referenceValid',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',xp,{}).am$('paragraphLines',8192,'markdown::SourceLines',xp,{}).am$('linkRefDefs',8192,'markdown::LinkReferenceDefinition[]',xp,{}).am$('addSourceSpan',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('span','markdown::SourceSpan',false)]),{}).am$('paraSourceSpans',8192,'markdown::SourceSpan[]',xp,{}).am$('parse',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','markdown::SourceLine',false)]),{}).am$('onStartDefinition',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('onLabel',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('onDestination',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('onStartTitle',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('onTitle',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('finishReference',2048,'sys::Void',xp,{});
LinkRefState.type$.af$('start_definition',106506,'markdown::LinkRefState',{}).af$('label',106506,'markdown::LinkRefState',{}).af$('destination',106506,'markdown::LinkRefState',{}).af$('start_title',106506,'markdown::LinkRefState',{}).af$('title',106506,'markdown::LinkRefState',{}).af$('paragraph',106506,'markdown::LinkRefState',{}).af$('vals',106498,'markdown::LinkRefState[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'markdown::LinkRefState?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
LinkScanner.type$.am$('scanLinkLabelContent',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('scanLinkDestination',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('scanLinkTitle',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('scanLinkTitleContent',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false),new sys.Param('endDelim','sys::Int',false)]),{}).am$('scanLinkDestinationWithBalancedParaens',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('isEscapable',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HtmlBlockParser.type$.af$('closingPattern',67586,'sys::Regex?',{}).af$('finished',67584,'sys::Bool',{}).af$('content',67584,'markdown::BlockContent?',{}).af$('block',336896,'markdown::HtmlBlock',{}).af$('factory',106498,'markdown::BlockParserFactory',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('closingPattern','sys::Regex?',false)]),{}).am$('tryContinue',271360,'markdown::BlockContinue?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false)]),{}).am$('addLine',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','markdown::SourceLine',false)]),{}).am$('closeBlock',271360,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
HtmlBlockParserFactory.type$.af$('tagname',100354,'sys::Str',{}).af$('attribute_name',100354,'sys::Str',{}).af$('unquoted_val',100354,'sys::Str',{}).af$('singlequote_val',100354,'sys::Str',{}).af$('doublequote_val',100354,'sys::Str',{}).af$('attribute_val',100354,'sys::Str',{}).af$('attribute_val_spec',100354,'sys::Str',{}).af$('attribute',100354,'sys::Str',{}).af$('open_tag',100354,'sys::Str',{}).af$('close_tag',100354,'sys::Str',{}).af$('block_patterns',100354,'sys::Regex?[][]',{}).am$('tryStart',271360,'markdown::BlockStart?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false),new sys.Param('parser','markdown::MatchedBlockParser',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
BlockContent.type$.af$('sb',67584,'sys::StrBuf',{}).af$('lineCount',67584,'sys::Int',{}).am$('make',8196,'sys::Void',xp,{}).am$('add',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
ParagraphParser.type$.af$('linkRefDefParser',67584,'markdown::LinkReferenceDefinitionParser',{}).af$('block',336896,'markdown::Paragraph',{}).af$('canHaveLazyContinuationLines',336898,'sys::Bool',{}).am$('make',8196,'sys::Void',xp,{}).am$('tryContinue',271360,'markdown::BlockContinue?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false)]),{}).am$('addLine',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','markdown::SourceLine',false)]),{}).am$('addSourceSpan',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sourceSpan','markdown::SourceSpan',false)]),{}).am$('definitions',271360,'markdown::DefinitionMap[]',xp,{}).am$('closeBlock',271360,'sys::Void',xp,{}).am$('parseInlines',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('inlineParser','markdown::InlineParser',false)]),{}).am$('paragraphLines',8192,'markdown::SourceLines',xp,{});
ThematicBreakParser.type$.af$('block',336896,'markdown::ThematicBreak',{}).af$('factory',106498,'markdown::BlockParserFactory',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('literal','sys::Str',false)]),{}).am$('tryContinue',271360,'markdown::BlockContinue?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ThematicBreakParserFactory.type$.am$('tryStart',271360,'markdown::BlockStart?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false),new sys.Param('parser','markdown::MatchedBlockParser',false)]),{}).am$('isThematicBreak',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false),new sys.Param('index','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HeadingParser.type$.af$('content',73728,'markdown::SourceLines',{}).af$('block',336896,'markdown::Heading',{}).af$('factory',106498,'markdown::BlockParserFactory',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('level','sys::Int',false),new sys.Param('content','markdown::SourceLines',false)]),{}).am$('tryContinue',271360,'markdown::BlockContinue?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false)]),{}).am$('parseInlines',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parser','markdown::InlineParser',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
HeadingParserFactory.type$.am$('tryStart',271360,'markdown::BlockStart?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false),new sys.Param('parser','markdown::MatchedBlockParser',false)]),{}).am$('toAtxHeading',34818,'markdown::HeadingParser?',sys.List.make(sys.Param.type$,[new sys.Param('line','markdown::SourceLine',false)]),{}).am$('toSetextHeadingLevel',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false),new sys.Param('index','sys::Int',false)]),{}).am$('isSetextHeadingRest',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false),new sys.Param('index','sys::Int',false),new sys.Param('marker','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ListBlockParser.type$.af$('hadBlankLine',67584,'sys::Bool',{}).af$('linesAfterBlank',67584,'sys::Int',{}).af$('block',336896,'markdown::ListBlock',{}).af$('isContainer',336898,'sys::Bool',{}).af$('factory',106498,'markdown::BlockParserFactory',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('block','markdown::ListBlock',false)]),{}).am$('canContain',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('childBlock','markdown::Block',false)]),{}).am$('tryContinue',271360,'markdown::BlockContinue?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ListBlockParserFactory.type$.am$('tryStart',271360,'markdown::BlockStart?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false),new sys.Param('parser','markdown::MatchedBlockParser',false)]),{}).am$('parseList',34818,'markdown::ListData?',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false),new sys.Param('markerIndex','sys::Int',false),new sys.Param('markerColumn','sys::Int',false),new sys.Param('inPara','sys::Bool',false)]),{}).am$('parseListMarker',34818,'markdown::ListMarkerData?',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false),new sys.Param('index','sys::Int',false)]),{}).am$('parseOrderedList',34818,'markdown::ListMarkerData?',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false),new sys.Param('index','sys::Int',false)]),{}).am$('isSpaceTabOrEnd',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false),new sys.Param('index','sys::Int',false)]),{}).am$('listsMatch',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('a','markdown::ListBlock',false),new sys.Param('b','markdown::ListBlock',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ListItemParser.type$.af$('contentIndent',73730,'sys::Int',{}).af$('hadBlankLine',67584,'sys::Bool',{}).af$('block',336896,'markdown::ListItem',{}).af$('isContainer',336898,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('markerIndent','sys::Int?',false),new sys.Param('contentIndent','sys::Int?',false)]),{}).am$('canContain',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('childBlock','markdown::Block',false)]),{}).am$('tryContinue',271360,'markdown::BlockContinue?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false)]),{});
ListData.type$.af$('listBlock',73728,'markdown::ListBlock',{}).af$('contentColumn',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('listBlock','markdown::ListBlock',false),new sys.Param('contentColumn','sys::Int',false)]),{});
ListMarkerData.type$.af$('listBlock',73728,'markdown::ListBlock',{}).af$('indexAfterMarker',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('listBlock','markdown::ListBlock',false),new sys.Param('indexAfterMarker','sys::Int',false)]),{});
BlockQuoteParser.type$.af$('block',336896,'markdown::BlockQuote',{}).af$('isContainer',336898,'sys::Bool',{}).af$('factory',106498,'markdown::BlockParserFactory',{}).am$('make',8196,'sys::Void',xp,{}).am$('canContain',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('block','markdown::Block',false)]),{}).am$('tryContinue',271360,'markdown::BlockContinue?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false)]),{}).am$('isMarker',32898,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false),new sys.Param('index','sys::Int',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
BlockQuoteParserFactory.type$.am$('tryStart',271360,'markdown::BlockStart?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false),new sys.Param('parser','markdown::MatchedBlockParser',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DocumentBlockParser.type$.af$('block',336896,'markdown::Document',{}).af$('isContainer',336898,'sys::Bool',{}).am$('make',8196,'sys::Void',xp,{}).am$('canContain',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('block','markdown::Block',false)]),{}).am$('tryContinue',271360,'markdown::BlockContinue?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false)]),{}).am$('addLine',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','markdown::SourceLine',false)]),{});
FencedCodeParser.type$.af$('fenceChar',67586,'sys::Int',{}).af$('openingFenceLen',67586,'sys::Int',{}).af$('firstLine',67584,'sys::Str?',{}).af$('otherLines',67584,'sys::StrBuf',{}).af$('block',336896,'markdown::FencedCode',{}).af$('factory',106498,'markdown::BlockParserFactory',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('fenceChar','sys::Int',false),new sys.Param('fenceLen','sys::Int',false),new sys.Param('fenceIndent','sys::Int',false)]),{}).am$('tryContinue',271360,'markdown::BlockContinue?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false)]),{}).am$('tryClosing',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false),new sys.Param('index','sys::Int',false)]),{}).am$('addLine',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','markdown::SourceLine',false)]),{}).am$('closeBlock',271360,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
FencedCodeParserFactory.type$.am$('tryStart',271360,'markdown::BlockStart?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false),new sys.Param('parser','markdown::MatchedBlockParser',false)]),{}).am$('checkOpener',34818,'markdown::FencedCodeParser?',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false),new sys.Param('index','sys::Int',false),new sys.Param('indent','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{});
IndentedCodeParser.type$.af$('block',336896,'markdown::IndentedCode',{}).af$('lines',67584,'sys::Str[]',{}).af$('factory',106498,'markdown::BlockParserFactory',{}).am$('make',8196,'sys::Void',xp,{}).am$('tryContinue',271360,'markdown::BlockContinue?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false)]),{}).am$('addLine',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','markdown::SourceLine',false)]),{}).am$('closeBlock',271360,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
IndentedCodeParserFactory.type$.am$('tryStart',271360,'markdown::BlockStart?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false),new sys.Param('parser','markdown::MatchedBlockParser',false)]),{}).am$('make',139268,'sys::Void',xp,{});
BackslashInlineParser.type$.af$('escapable',100354,'sys::Regex',{}).af$('factory',106498,'markdown::InlineContentParserFactory',{}).am$('tryParse',271360,'markdown::ParsedInline?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::InlineParserState',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
BackslashInlineParserFactory.type$.af$('triggerChars',336898,'sys::Int[]',{}).am$('create',271360,'markdown::InlineContentParser',xp,{}).am$('make',139268,'sys::Void',xp,{});
HtmlInlineParser.type$.af$('asciiLetter',100354,'|sys::Int->sys::Bool|',{}).af$('tagNameStart',100354,'|sys::Int->sys::Bool|',{}).af$('tagNameContinue',100354,'|sys::Int->sys::Bool|',{}).af$('attrStart',100354,'|sys::Int->sys::Bool|',{}).af$('attrContinue',100354,'|sys::Int->sys::Bool|',{}).af$('attrValEnd',100354,'|sys::Int->sys::Bool|',{}).af$('factory',106498,'markdown::InlineContentParserFactory',{}).am$('tryParse',271360,'markdown::ParsedInline?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::InlineParserState',false)]),{}).am$('htmlInline',34818,'markdown::ParsedInline',sys.List.make(sys.Param.type$,[new sys.Param('start','markdown::Position',false),new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('tryOpenTag',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('tryClosingTag',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('tryProcessingInstruction',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('tryComment',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('tryCdata',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('tryDeclaration',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
HtmlInlineParserFactory.type$.af$('triggerChars',336898,'sys::Int[]',{}).am$('create',271360,'markdown::InlineContentParser',xp,{}).am$('make',139268,'sys::Void',xp,{});
AutolinkInlineParser.type$.af$('uri',100354,'sys::Regex',{}).af$('email',100354,'sys::Regex',{}).af$('factory',106498,'markdown::InlineContentParserFactory',{}).am$('tryParse',271360,'markdown::ParsedInline?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::InlineParserState',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
AutolinkInlineParserFactory.type$.af$('triggerChars',336898,'sys::Int[]',{}).am$('create',271360,'markdown::InlineContentParser',xp,{}).am$('make',139268,'sys::Void',xp,{});
InlineParser.type$.am$('parse',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lines','markdown::SourceLines',false),new sys.Param('node','markdown::Node',false)]),{});
InlineParserContext.type$.af$('factories',73730,'markdown::InlineContentParserFactory[]',{}).af$('customDelimiterProcessors',73730,'markdown::DelimiterProcessor[]',{}).af$('customLinkProcessors',73730,'markdown::LinkProcessor[]',{}).af$('customLinkMarkers',73730,'sys::Int[]',{}).af$('definitions',65664,'markdown::Definitions',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parser','markdown::Parser',false),new sys.Param('defs','markdown::Definitions',false)]),{}).am$('def',8192,'markdown::Block?',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('label','sys::Str',false)]),{});
InlineParserState.type$.am$('scanner',270337,'markdown::Scanner?',xp,{});
ParsedInline.type$.af$('node',73728,'markdown::Node',{}).af$('pos',73730,'markdown::Position',{}).am$('none',40966,'markdown::ParsedInline?',xp,{}).am$('of',40966,'markdown::ParsedInline?',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false),new sys.Param('pos','markdown::Position',false)]),{}).am$('priv_make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false),new sys.Param('pos','markdown::Position',false)]),{});
LinkInfo.type$.am$('marker',270337,'markdown::Text?',xp,{}).am$('openingBracket',270337,'markdown::Text',xp,{}).am$('text',270337,'sys::Str',xp,{}).am$('label',270337,'sys::Str?',xp,{}).am$('destination',270337,'sys::Str?',xp,{}).am$('title',270337,'sys::Str?',xp,{}).am$('afterTextBracket',270337,'markdown::Position',xp,{});
MLinkInfo.type$.af$('marker',336896,'markdown::Text?',{}).af$('openingBracket',336896,'markdown::Text',{}).af$('text',336898,'sys::Str',{}).af$('label',336898,'sys::Str?',{}).af$('destination',336898,'sys::Str?',{}).af$('title',336898,'sys::Str?',{}).af$('afterTextBracket',336898,'markdown::Position',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{});
EntityInlineParser.type$.af$('hex',100354,'|sys::Int->sys::Bool|',{}).af$('dec',100354,'|sys::Int->sys::Bool|',{}).af$('entityContinue',100354,'|sys::Int->sys::Bool|',{}).af$('factory',106498,'markdown::InlineContentParserFactory',{}).am$('tryParse',271360,'markdown::ParsedInline?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::InlineParserState',false)]),{}).am$('entity',2048,'markdown::ParsedInline',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false),new sys.Param('start','markdown::Position',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
EntityInlineParserFactory.type$.af$('triggerChars',336898,'sys::Int[]',{}).am$('create',271360,'markdown::InlineContentParser',xp,{}).am$('make',139268,'sys::Void',xp,{});
Delimiter.type$.af$('chars',73728,'markdown::Text[]',{}).af$('delimChar',73730,'sys::Int',{}).af$('origSize',73730,'sys::Int',{}).af$('canOpen',73730,'sys::Bool',{}).af$('canClose',73730,'sys::Bool',{}).af$('prev',73728,'markdown::Delimiter?',{}).af$('next',73728,'markdown::Delimiter?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('chars','markdown::Text[]',false),new sys.Param('delimChar','sys::Int',false),new sys.Param('canOpen','sys::Bool',false),new sys.Param('canClose','sys::Bool',false),new sys.Param('prev','markdown::Delimiter?',false)]),{}).am$('size',8192,'sys::Int',xp,{}).am$('opener',8192,'markdown::Text',xp,{}).am$('closer',8192,'markdown::Text',xp,{}).am$('openers',8192,'markdown::Text[]',sys.List.make(sys.Param.type$,[new sys.Param('len','sys::Int',false)]),{}).am$('closers',8192,'markdown::Text[]',sys.List.make(sys.Param.type$,[new sys.Param('len','sys::Int',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
Bracket.type$.af$('markerNode',73728,'markdown::Text?',{}).af$('markerPos',73730,'markdown::Position?',{}).af$('bracketNode',73728,'markdown::Text',{}).af$('bracketPos',73730,'markdown::Position',{}).af$('contentPos',73730,'markdown::Position',{}).af$('prev',73728,'markdown::Bracket?',{}).af$('prevDelim',73728,'markdown::Delimiter?',{}).af$('allowed',73728,'sys::Bool',{}).af$('bracketAfter',73728,'sys::Bool',{}).am$('link',40966,'markdown::Bracket?',sys.List.make(sys.Param.type$,[new sys.Param('bracketNode','markdown::Text',false),new sys.Param('bracketPos','markdown::Position',false),new sys.Param('contentPos','markdown::Position',false),new sys.Param('prev','markdown::Bracket?',false),new sys.Param('prevDelim','markdown::Delimiter?',false)]),{}).am$('withMarker',40966,'markdown::Bracket?',sys.List.make(sys.Param.type$,[new sys.Param('markerNode','markdown::Text',false),new sys.Param('markerPos','markdown::Position',false),new sys.Param('bracketNode','markdown::Text',false),new sys.Param('bracketPos','markdown::Position',false),new sys.Param('contentPos','markdown::Position',false),new sys.Param('prev','markdown::Bracket?',false),new sys.Param('prevDelim','markdown::Delimiter?',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{});
EmphasisDelimiterProcessor.type$.af$('delimChar',69634,'sys::Int',{}).am$('make',4100,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('delimChar','sys::Int',false)]),{}).am$('openingChar',271360,'sys::Int',xp,{}).am$('closingChar',271360,'sys::Int',xp,{}).am$('minLen',271360,'sys::Int',xp,{}).am$('process',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('openingRun','markdown::Delimiter',false),new sys.Param('closingRun','markdown::Delimiter',false)]),{});
AsteriskDelimiterProcessor.type$.am$('make',8196,'sys::Void',xp,{});
UnderscoreDelimiterProcessor.type$.am$('make',8196,'sys::Void',xp,{});
BackticksInlineParser.type$.af$('factory',106498,'markdown::InlineContentParserFactory',{}).am$('make',8196,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
BackticksInlineParserFactory.type$.af$('triggerChars',336898,'sys::Int[]',{}).am$('create',271360,'markdown::InlineContentParser',xp,{}).am$('make',139268,'sys::Void',xp,{});
DefaultInlineParser.type$.af$('cx',67584,'markdown::InlineParserContext',{}).af$('inlineContentParserFactories',67584,'markdown::InlineContentParserFactory[]',{}).af$('delimProcessors',67584,'[sys::Int:markdown::DelimiterProcessor]',{}).af$('linkProcessors',67584,'markdown::LinkProcessor[]',{}).af$('linkMarkers',67584,'[sys::Int:sys::Bool]',{}).af$('specialChars',67584,'[sys::Int:sys::Bool]',{}).af$('inlineParsers',67584,'[sys::Int:markdown::InlineContentParser[]]?',{}).af$('scanner',336896,'markdown::Scanner?',{}).af$('includeSourceSpans',67584,'sys::Bool',{}).af$('trailingSpaces',67584,'sys::Int',{}).af$('lastDelim',67584,'markdown::Delimiter?',{}).af$('lastBracket',67584,'markdown::Bracket?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','markdown::InlineParserContext',false)]),{}).am$('calculateInlineContentParserFactories',2048,'markdown::InlineContentParserFactory[]',xp,{}).am$('calculateLinkProcessors',34818,'markdown::LinkProcessor[]',sys.List.make(sys.Param.type$,[new sys.Param('custom','markdown::LinkProcessor[]',false)]),{}).am$('calculateDelimProcessors',34818,'[sys::Int:markdown::DelimiterProcessor]',sys.List.make(sys.Param.type$,[new sys.Param('custom','markdown::DelimiterProcessor[]',false)]),{}).am$('addDelimProcessor',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('processors','markdown::DelimiterProcessor[]',false),new sys.Param('acc','[sys::Int:markdown::DelimiterProcessor]',false)]),{}).am$('addDelimiterProcessorForChar',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('delimChar','sys::Int',false),new sys.Param('toAdd','markdown::DelimiterProcessor',false),new sys.Param('acc','[sys::Int:markdown::DelimiterProcessor]',false)]),{}).am$('createInlineContentParsers',2048,'[sys::Int:markdown::InlineContentParser[]]',xp,{}).am$('calculateLinkMarkers',34818,'[sys::Int:sys::Bool]',sys.List.make(sys.Param.type$,[new sys.Param('customLinkMarkers','sys::Int[]',false)]),{}).am$('calculateSpecialChars',34818,'[sys::Int:sys::Bool]',sys.List.make(sys.Param.type$,[new sys.Param('linkMarkers','[sys::Int:sys::Bool]',false),new sys.Param('delimChars','sys::Int[]',false),new sys.Param('inlineContentParserFactories','markdown::InlineContentParserFactory[]',false)]),{}).am$('parse',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lines','markdown::SourceLines',false),new sys.Param('block','markdown::Node',false)]),{}).am$('reset',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lines','markdown::SourceLines',false)]),{}).am$('text',2048,'markdown::Text',sys.List.make(sys.Param.type$,[new sys.Param('sourceLines','markdown::SourceLines',false)]),{}).am$('parseInline',2048,'markdown::Node[]?',xp,{}).am$('parseDelimiters',2048,'markdown::Node[]?',sys.List.make(sys.Param.type$,[new sys.Param('processor','markdown::DelimiterProcessor',false),new sys.Param('delimChar','sys::Int',false)]),{}).am$('parseOpenBracket',2048,'markdown::Node',xp,{}).am$('parseLinkMarker',2048,'markdown::Node[]?',xp,{}).am$('parseCloseBracket',2048,'markdown::Node',xp,{}).am$('parseLinkOrImage',2048,'markdown::Node?',sys.List.make(sys.Param.type$,[new sys.Param('opener','markdown::Bracket',false),new sys.Param('beforeClose','markdown::Position',false)]),{}).am$('parseLinkInfo',2048,'markdown::LinkInfo?',sys.List.make(sys.Param.type$,[new sys.Param('opener','markdown::Bracket',false),new sys.Param('beforeClose','markdown::Position',false)]),{}).am$('wrapBracket',2048,'markdown::Node',sys.List.make(sys.Param.type$,[new sys.Param('opener','markdown::Bracket',false),new sys.Param('wrapperNode','markdown::Node',false),new sys.Param('includeMarker','sys::Bool',false)]),{}).am$('replaceBracket',2048,'markdown::Node',sys.List.make(sys.Param.type$,[new sys.Param('opener','markdown::Bracket',false),new sys.Param('node','markdown::Node',false),new sys.Param('includeMarker','sys::Bool',false)]),{}).am$('addBracket',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('bracket','markdown::Bracket',false)]),{}).am$('removeLastBracket',2048,'sys::Void',xp,{}).am$('parseInlineDestinationTitle',34818,'markdown::DestinationTitle?',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('parseLinkDestination',34818,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('parseLinkTitle',34818,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('parseLinkLabel',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('scanner','markdown::Scanner',false)]),{}).am$('parseLineBreak',2048,'markdown::Node',xp,{}).am$('parseText',2048,'markdown::Node',xp,{}).am$('scanDelimiters',2048,'markdown::DelimiterData?',sys.List.make(sys.Param.type$,[new sys.Param('processor','markdown::DelimiterProcessor',false),new sys.Param('delimChar','sys::Int',false)]),{}).am$('processDelimiters',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('stackBottom','markdown::Delimiter?',false)]),{}).am$('removeDelimitersBetween',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('opener','markdown::Delimiter',false),new sys.Param('closer','markdown::Delimiter',false)]),{}).am$('removeDelimiterAndNodes',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('delim','markdown::Delimiter',false)]),{}).am$('removeDelimiterKeepNode',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('delim','markdown::Delimiter',false)]),{}).am$('removeDelimiter',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('delim','markdown::Delimiter',false)]),{}).am$('mergeChildTextNodes',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('mergeTextNodesInclusive',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('fromNode','markdown::Node',false),new sys.Param('toNode','markdown::Node',false)]),{}).am$('mergeIfNeeded',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('first','markdown::Text?',false),new sys.Param('last','markdown::Text?',false),new sys.Param('textLen','sys::Int',false)]),{});
DestinationTitle.type$.af$('destination',73730,'sys::Str',{}).af$('title',73730,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('destination','sys::Str',false),new sys.Param('title','sys::Str?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{});
DelimiterData.type$.af$('chars',73728,'markdown::Text[]',{}).af$('canOpen',73730,'sys::Bool',{}).af$('canClose',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('chars','markdown::Text[]',false),new sys.Param('canOpen','sys::Bool',false),new sys.Param('canClose','sys::Bool',false)]),{});
LinkProcessor.type$.am$('process',270337,'markdown::LinkResult?',sys.List.make(sys.Param.type$,[new sys.Param('info','markdown::LinkInfo',false),new sys.Param('scanner','markdown::Scanner',false),new sys.Param('cx','markdown::InlineParserContext',false)]),{});
CoreLinkProcessor.type$.am$('process',271360,'markdown::LinkResult?',sys.List.make(sys.Param.type$,[new sys.Param('info','markdown::LinkInfo',false),new sys.Param('scanner','markdown::Scanner',false),new sys.Param('cx','markdown::InlineParserContext',false)]),{}).am$('doProcess',34818,'markdown::LinkResult',sys.List.make(sys.Param.type$,[new sys.Param('info','markdown::LinkInfo',false),new sys.Param('scanner','markdown::Scanner',false),new sys.Param('dest','sys::Str?',false),new sys.Param('title','sys::Str?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
LinkResult.type$.af$('wrap',73730,'sys::Bool',{}).af$('node',73728,'markdown::Node',{}).af$('pos',73730,'markdown::Position',{}).af$('includeMarker',73728,'sys::Bool',{}).am$('none',40966,'markdown::LinkResult?',xp,{}).am$('wrapTextIn',40966,'markdown::LinkResult?',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false),new sys.Param('pos','markdown::Position',false)]),{}).am$('replaceWith',40966,'markdown::LinkResult?',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false),new sys.Param('pos','markdown::Position',false)]),{}).am$('priv_make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('wrap','sys::Bool',false),new sys.Param('node','markdown::Node',false),new sys.Param('pos','markdown::Position',false)]),{}).am$('replace',8192,'sys::Bool',xp,{});
Renderer.type$.am$('renderTo',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('node','markdown::Node',false)]),{}).am$('render',270336,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{});
NodeRendererMap.type$.af$('renderers',67584,'[sys::Type:markdown::NodeRenderer]',{}).am$('make',8196,'sys::Void',xp,{}).am$('add',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('renderer','markdown::NodeRenderer',false)]),{}).am$('render',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('beforeRoot',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('afterRoot',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{});
CoreHtmlNodeRenderer.type$.af$('cx',69632,'markdown::HtmlContext',{}).af$('html',67584,'markdown::HtmlWriter',{}).af$('nodeTypes',336898,'sys::Type[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','markdown::HtmlContext',false)]),{}).am$('render',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('visitDocument',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','markdown::Document',false)]),{}).am$('visitHeading',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('heading','markdown::Heading',false)]),{}).am$('visitParagraph',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','markdown::Paragraph',false)]),{}).am$('visitBlockQuote',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('bq','markdown::BlockQuote',false)]),{}).am$('visitBulletList',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('list','markdown::BulletList',false)]),{}).am$('visitOrderedList',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('list','markdown::OrderedList',false)]),{}).am$('visitListItem',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('item','markdown::ListItem',false)]),{}).am$('visitFencedCode',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('code','markdown::FencedCode',false)]),{}).am$('visitHtmlBlock',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('block','markdown::HtmlBlock',false)]),{}).am$('visitThematicBreak',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tb','markdown::ThematicBreak',false)]),{}).am$('visitIndentedCode',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('code','markdown::IndentedCode',false)]),{}).am$('visitLink',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('link','markdown::Link',false)]),{}).am$('visitImage',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('image','markdown::Image',false)]),{}).am$('visitEmphasis',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('emph','markdown::Emphasis',false)]),{}).am$('visitStrongEmphasis',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('strong','markdown::StrongEmphasis',false)]),{}).am$('visitText',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('text','markdown::Text',false)]),{}).am$('visitCode',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('code','markdown::Code',false)]),{}).am$('visitHtmlInline',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('inline','markdown::HtmlInline',false)]),{}).am$('visitSoftLineBreak',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::SoftLineBreak',false)]),{}).am$('visitHardLineBreak',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::HardLineBreak',false)]),{}).am$('visitChildren',267264,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','markdown::Node',false)]),{}).am$('renderCodeBlock',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('literal','sys::Str',false),new sys.Param('node','markdown::Node',false),new sys.Param('attrs','[sys::Str:sys::Str]',false)]),{}).am$('renderListBlock',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('list','markdown::ListBlock',false),new sys.Param('tagName','sys::Str',false),new sys.Param('attrs','[sys::Str:sys::Str?]?',false)]),{}).am$('isInTightList',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('p','markdown::Paragraph',false)]),{}).am$('attrs',8192,'[sys::Str:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false),new sys.Param('tagName','sys::Str',false),new sys.Param('defAttrs','[sys::Str:sys::Str]',true)]),{}).am$('newAttrs',4096,'[sys::Str:sys::Str]',xp,{});
AltTextVisitor.type$.af$('sb',67584,'sys::StrBuf',{}).am$('altText',8192,'sys::Str',xp,{}).am$('visitText',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('text','markdown::Text',false)]),{}).am$('visitSoftLineBreak',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::SoftLineBreak',false)]),{}).am$('visitHardLineBreak',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::HardLineBreak',false)]),{}).am$('make',139268,'sys::Void',xp,{});
UrlSanitizer.type$.am$('sanitizeLink',270337,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('url','sys::Str',false)]),{}).am$('sanitizeImage',270336,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('url','sys::Str',false)]),{});
DefaultUrlSanitizer.type$.af$('protocols',73730,'sys::Str[]',{}).am$('make_default',8196,'sys::Void',xp,{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('protocols','sys::Str[]',false)]),{}).am$('sanitizeLink',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('url','sys::Str',false)]),{});
HtmlContext.type$.af$('renderer',67584,'markdown::HtmlRenderer',{}).af$('nodeRendererMap',67584,'markdown::NodeRendererMap',{}).af$('attrProviders',67584,'markdown::AttrProvider[]',{}).af$('writer',73728,'markdown::HtmlWriter',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('renderer','markdown::HtmlRenderer',false),new sys.Param('writer','markdown::HtmlWriter',false)]),{}).am$('escapeHtml',8192,'sys::Bool',xp,{}).am$('sanitizeUrls',8192,'sys::Bool',xp,{}).am$('omitSingleParagraphP',8192,'sys::Bool',xp,{}).am$('percentEncodeUrls',8192,'sys::Bool',xp,{}).am$('softbreak',8192,'sys::Str',xp,{}).am$('encodeUrl',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('url','sys::Str',false)]),{}).am$('urlSanitizer',8192,'markdown::UrlSanitizer',xp,{}).am$('extendAttrs',8192,'[sys::Str:sys::Str?]',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false),new sys.Param('tagName','sys::Str',false),new sys.Param('attrs','[sys::Str:sys::Str?]',true)]),{}).am$('render',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('beforeRoot',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('afterRoot',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{});
HtmlRenderer.type$.af$('softbreak',65666,'sys::Str',{}).af$('escapeHtml',65666,'sys::Bool',{}).af$('percentEncodeUrls',65666,'sys::Bool',{}).af$('omitSingleParagraphP',65666,'sys::Bool',{}).af$('sanitizeUrls',65666,'sys::Bool',{}).af$('nodeRendererFactories',65666,'|markdown::HtmlContext->markdown::NodeRenderer|[]',{}).af$('attrProviderFactories',65666,'|markdown::HtmlContext->markdown::AttrProvider|[]',{}).af$('urlSanitizer',65666,'markdown::UrlSanitizer',{}).am$('builder',40962,'markdown::HtmlRendererBuilder',xp,{}).am$('make',40966,'markdown::HtmlRenderer?',xp,{}).am$('makeBuilder',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('builder','markdown::HtmlRendererBuilder',false)]),{}).am$('renderTo',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('node','markdown::Node',false)]),{});
HtmlRendererBuilder.type$.af$('nodeRendererFactories',65664,'|markdown::HtmlContext->markdown::NodeRenderer|[]',{}).af$('attrProviderFactories',65664,'|markdown::HtmlContext->markdown::AttrProvider|[]',{}).af$('softbreak',65664,'sys::Str',{}).af$('escapeHtml',65664,'sys::Bool',{}).af$('percentEncodeUrls',65664,'sys::Bool',{}).af$('omitSingleParagraphP',65664,'sys::Bool',{}).af$('sanitizeUrls',65664,'sys::Bool',{}).am$('make',132,'sys::Void',xp,{}).am$('build',8192,'markdown::HtmlRenderer',xp,{}).am$('withSoftBreak',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('withEscapeHtml',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Bool',true)]),{}).am$('withPercentEncodeUrls',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Bool',true)]),{}).am$('withOmitSingleParagraphP',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Bool',true)]),{}).am$('withSanitizeUrls',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Bool',true)]),{}).am$('nodeRendererFactory',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('factory','|markdown::HtmlContext->markdown::NodeRenderer|',false)]),{}).am$('attrProviderFactory',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('factory','|markdown::HtmlContext->markdown::AttrProvider|',false)]),{}).am$('extensions',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('exts','markdown::MarkdownExt[]',false)]),{});
HtmlWriter.type$.af$('out',67584,'sys::OutStream',{}).af$('lastChar',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('line',8192,'sys::This',xp,{}).am$('raw',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('text',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('text','sys::Str',false)]),{}).am$('tag',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('attrs','[sys::Str:sys::Str?]?',true),new sys.Param('empty','sys::Bool',true)]),{}).am$('w',4096,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{});
MarkdownRenderer.type$.af$('nodeRendererFactories',65666,'|markdown::MarkdownContext->markdown::NodeRenderer|[]',{}).af$('specialChars',65666,'sys::Int[]',{}).am$('builder',40962,'markdown::MarkdownRendererBuilder',xp,{}).am$('make',40966,'markdown::MarkdownRenderer?',xp,{}).am$('makeBuilder',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('builder','markdown::MarkdownRendererBuilder',false)]),{}).am$('renderTo',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('node','markdown::Node',false)]),{});
MarkdownRendererBuilder.type$.af$('nodeRendererFactories',65664,'|markdown::MarkdownContext->markdown::NodeRenderer|[]',{}).af$('nodePostProcessors',65664,'|markdown::MarkdownContext,markdown::Node->sys::Void|[]',{}).af$('specialChars',65664,'sys::Int[]',{}).am$('make',132,'sys::Void',xp,{}).am$('build',8192,'markdown::MarkdownRenderer',xp,{}).am$('nodeRendererFactory',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('factory','|markdown::MarkdownContext->markdown::NodeRenderer|',false)]),{}).am$('withSpecialChars',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('special','sys::Int[]',false)]),{}).am$('extensions',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('exts','markdown::MarkdownExt[]',false)]),{});
MarkdownContext.type$.af$('renderer',67584,'markdown::MarkdownRenderer',{}).af$('nodeRendererMap',67584,'markdown::NodeRendererMap',{}).af$('writer',73728,'markdown::MarkdownWriter',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('renderer','markdown::MarkdownRenderer',false),new sys.Param('writer','markdown::MarkdownWriter',false)]),{}).am$('specialChars',8192,'sys::Int[]',xp,{}).am$('render',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('beforeRoot',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('afterRoot',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{});
CoreMarkdownNodeRenderer.type$.af$('orderedListMarkerPattern',100354,'sys::Regex',{}).af$('cx',69632,'markdown::MarkdownContext',{}).af$('writer',67584,'markdown::MarkdownWriter',{}).af$('listHolder',67584,'markdown::ListHolder?',{}).af$('textEsc',67584,'|sys::Int->sys::Bool|',{}).af$('textEscInHeading',67584,'|sys::Int->sys::Bool|',{}).af$('linkDestNeedsAngleBrackets',100354,'|sys::Int->sys::Bool|',{}).af$('linkDestEscInAngleBrackets',100354,'|sys::Int->sys::Bool|',{}).af$('linkTitleEscInQuotes',100354,'|sys::Int->sys::Bool|',{}).af$('nodeTypes',336898,'sys::Type[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','markdown::MarkdownContext',false)]),{}).am$('render',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('visitDocument',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','markdown::Document',false)]),{}).am$('visitThematicBreak',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tb','markdown::ThematicBreak',false)]),{}).am$('visitHeading',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('heading','markdown::Heading',false)]),{}).am$('visitBlockQuote',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('quote','markdown::BlockQuote',false)]),{}).am$('visitBulletList',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('list','markdown::BulletList',false)]),{}).am$('visitOrderedList',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('list','markdown::OrderedList',false)]),{}).am$('visitListItem',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('item','markdown::ListItem',false)]),{}).am$('visitFencedCode',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('code','markdown::FencedCode',false)]),{}).am$('visitIndentedCode',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('code','markdown::IndentedCode',false)]),{}).am$('visitHtmlBlock',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('html','markdown::HtmlBlock',false)]),{}).am$('visitParagraph',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','markdown::Paragraph',false)]),{}).am$('visitLink',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('link','markdown::Link',false)]),{}).am$('visitImage',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('image','markdown::Image',false)]),{}).am$('writeLinkLike',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('title','sys::Str?',false),new sys.Param('dest','sys::Str',false),new sys.Param('node','markdown::Node',false),new sys.Param('opener','sys::Str',false)]),{}).am$('visitEmphasis',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('emp','markdown::Emphasis',false)]),{}).am$('visitStrongEmphasis',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('strong','markdown::StrongEmphasis',false)]),{}).am$('visitCode',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('code','markdown::Code',false)]),{}).am$('writeCode',32898,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('writer','markdown::MarkdownWriter',false),new sys.Param('code','markdown::Code',false),new sys.Param('marker','sys::Int',false)]),{}).am$('visitHtmlInline',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('html','markdown::HtmlInline',false)]),{}).am$('visitHardLineBreak',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('hard','markdown::HardLineBreak',false)]),{}).am$('visitSoftLineBreak',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('soft','markdown::SoftLineBreak',false)]),{}).am$('visitText',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('text','markdown::Text',false)]),{}).am$('getLines',34818,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('literal','sys::Str',false)]),{}).am$('findMaxRunLen',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('needle','sys::Str',false),new sys.Param('s','sys::Str',false)]),{}).am$('visitChildren',267264,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','markdown::Node',false)]),{}).am$('renderChildren',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','markdown::Node',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ListHolder.type$.af$('parent',73728,'markdown::ListHolder?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','markdown::ListHolder?',false)]),{});
BulletListHolder.type$.af$('marker',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','markdown::ListHolder?',false),new sys.Param('list','markdown::BulletList',false)]),{});
OrderedListHolder.type$.af$('delim',73730,'sys::Str',{}).af$('number',73728,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','markdown::ListHolder?',false),new sys.Param('list','markdown::OrderedList',false)]),{});
LineBreakVisitor.type$.af$('hasLineBreak',73728,'sys::Bool',{}).am$('visitSoftLineBreak',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','markdown::SoftLineBreak',false)]),{}).am$('visitHardLineBreak',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','markdown::HardLineBreak',false)]),{}).am$('make',139268,'sys::Void',xp,{});
MarkdownWriter.type$.af$('out',67584,'sys::OutStream',{}).af$('blockSep',67584,'sys::Int',{}).af$('lastChar',73728,'sys::Int',{}).af$('atLineStart',73728,'sys::Bool',{}).af$('prefixes',67584,'sys::Str[]',{}).af$('tight',67584,'sys::Bool[]',{}).af$('rawEscapes',67584,'|sys::Int->sys::Bool|[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('raw',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('rawStr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('rawCh',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('text',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('escape','|sys::Int->sys::Bool|?',true)]),{}).am$('line',8192,'sys::Void',xp,{}).am$('block',8192,'sys::Void',xp,{}).am$('pushPrefix',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prefix','sys::Str',false)]),{}).am$('writePrefix',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prefix','sys::Str',false)]),{}).am$('popPrefix',8192,'sys::Void',xp,{}).am$('pushTight',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tight','sys::Bool',false)]),{}).am$('popTight',8192,'sys::Void',xp,{}).am$('pushRawEscape',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rawEscape','|sys::Int->sys::Bool|',false)]),{}).am$('popRawEscape',8192,'sys::Void',xp,{}).am$('write',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('writeStr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('escape','|sys::Int->sys::Bool|?',true)]),{}).am$('writePrefixes',2048,'sys::Void',xp,{}).am$('flushBlockSeparator',2048,'sys::Void',xp,{}).am$('append',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false),new sys.Param('escape','|sys::Int->sys::Bool|?',true)]),{}).am$('isTight',2048,'sys::Bool',xp,{}).am$('needsEscaping',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false),new sys.Param('escape','|sys::Int->sys::Bool|?',false)]),{}).am$('rawNeedsEscaping',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{});
Html5.type$.af$('named_char_refs',100354,'[sys::Str:sys::Str]',{}).am$('entityToStr',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
Esc.type$.af$('escapable',106498,'sys::Str',{}).af$('entity',106498,'sys::Str',{}).af$('whitespace',106498,'sys::Regex',{}).af$('backslash_or_amp',106498,'sys::Regex',{}).af$('entity_or_esc_char',106498,'sys::Regex',{}).af$('escape_in_uri',106498,'sys::Regex',{}).af$('unescaper',106498,'|sys::Str,sys::StrBuf->sys::Void|',{}).af$('uri_replacer',106498,'|sys::Str,sys::StrBuf->sys::Void|',{}).am$('unescapeStr',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('percentEncodeUrl',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('url','sys::Str',false)]),{}).am$('normalizeLabelContent',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::Str',false)]),{}).am$('escapeHtml',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::Str',false)]),{}).am$('replaceAll',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('pattern','sys::Regex',false),new sys.Param('s','sys::Str',false),new sys.Param('replacer','|sys::Str,sys::StrBuf->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
Chars.type$.am$('find',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false),new sys.Param('s','sys::Str',false),new sys.Param('startIndex','sys::Int',false)]),{}).am$('isBlank',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('hasNonSpace',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('isLetter',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('text','sys::Str',false),new sys.Param('i','sys::Int',false)]),{}).am$('isIsoControl',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ch','sys::Int',false)]),{}).am$('skip',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('skip','sys::Int',false),new sys.Param('s','sys::Str',false),new sys.Param('startIndex','sys::Int',false),new sys.Param('endIndex','sys::Int',false)]),{}).am$('skipSpaceTab',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('startIndex','sys::Int',true),new sys.Param('endIndex','sys::Int',true)]),{}).am$('skipBackwards',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('skip','sys::Int',false),new sys.Param('s','sys::Str',false),new sys.Param('startIndex','sys::Int',true),new sys.Param('lastIndex','sys::Int',true)]),{}).am$('skipSpaceTabBackwards',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('startIndex','sys::Int',true),new sys.Param('lastIndex','sys::Int',true)]),{}).am$('isSpaceOrTab',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('index','sys::Int',false)]),{}).am$('isPunctuation',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('cp','sys::Int',false)]),{}).am$('isWhitespace',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('cp','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{});
MarkdownTest.type$.am$('make',139268,'sys::Void',xp,{});
RenderingTest.type$.am$('render',266241,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('source','sys::Str',false)]),{}).am$('verifyRendering',4096,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('source','sys::Str',false),new sys.Param('expected','sys::Str',false)]),{}).am$('doVerifyRendering',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('source','sys::Str',false),new sys.Param('expected','sys::Str',false),new sys.Param('actual','sys::Str',false)]),{}).am$('showTabs',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
CoreRenderingTest.type$.af$('parser',67584,'markdown::Parser?',{}).af$('renderer',67584,'markdown::HtmlRenderer?',{}).am$('setup',271360,'sys::Void',xp,{}).am$('render',267264,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('source','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ListTightLooseTest.type$.am$('testTight',8192,'sys::Void',xp,{}).am$('testLoose',8192,'sys::Void',xp,{}).am$('testLooseNested',8192,'sys::Void',xp,{}).am$('testLooseNested2',8192,'sys::Void',xp,{}).am$('testOuter',8192,'sys::Void',xp,{}).am$('testLooseListItem',8192,'sys::Void',xp,{}).am$('testTightWithBlankLineAfter',8192,'sys::Void',xp,{}).am$('testTightListWithCodeBlock',8192,'sys::Void',xp,{}).am$('testTightListWithCodeBlock2',8192,'sys::Void',xp,{}).am$('testLooseEmptyListItem',8192,'sys::Void',xp,{}).am$('testLooseBlankLineAfterCodeBlock',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
CharsTest.type$.am$('testSkipBackwards',8192,'sys::Void',xp,{}).am$('testSkipSpaceTabBackwards',8192,'sys::Void',xp,{}).am$('testIsBlank',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
DelimitedTest.type$.am$('testEmphasis',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
DelimitedTestVisitor.type$.af$('list',73728,'markdown::Delimited[]',{}).am$('make',8196,'sys::Void',xp,{}).am$('visitEmphasis',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Emphasis',false)]),{}).am$('visitStrongEmphasis',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::StrongEmphasis',false)]),{});
EscTest.type$.am$('testUnescapeStr',8192,'sys::Void',xp,{}).am$('testEscapeHtml',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
NodeTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('verifyNode',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('n','markdown::Node',false),new sys.Param('parent','markdown::Node?',false),new sys.Param('next','markdown::Node?',false),new sys.Param('prev','markdown::Node?',false),new sys.Param('firstChild','markdown::Node?',false),new sys.Param('lastChild','markdown::Node?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
SpecialInputTest.type$.am$('testEmpty',8192,'sys::Void',xp,{}).am$('testNullCharacterShouldBeReplaces',8192,'sys::Void',xp,{}).am$('testNullCharacterEntityShouldBeReplaced',8192,'sys::Void',xp,{}).am$('testCrLfAsLineSeparatorShouldBeParsed',8192,'sys::Void',xp,{}).am$('testCrLfAtEndShouldBeParsed',8192,'sys::Void',xp,{}).am$('testIndentedCodeBlockWithMixedTabsAndSpaces',8192,'sys::Void',xp,{}).am$('testListInBlockQuote',8192,'sys::Void',xp,{}).am$('testLooseListInBlockQuote',8192,'sys::Void',xp,{}).am$('testLineWithOnlySpacesAfterListBullet',8192,'sys::Void',xp,{}).am$('testListWIthTwoSpacesForFirstBullet',8192,'sys::Void',xp,{}).am$('testOrderedListMarkerOnly',8192,'sys::Void',xp,{}).am$('testColumnIsInTabOnPreviousLine',8192,'sys::Void',xp,{}).am$('testLinkLabelWithBracket',8192,'sys::Void',xp,{}).am$('testLinkLabelLen',8192,'sys::Void',xp,{}).am$('testLinkDestinationEscaping',8192,'sys::Void',xp,{}).am$('testLinkReferenceBackslash',8192,'sys::Void',xp,{}).am$('testEmphasisMultipleOf3Rule',8192,'sys::Void',xp,{}).am$('testRenderEvenRegexpProducesStackoverflow',8192,'sys::Void',xp,{}).am$('testDeeplyIndentedList',8192,'sys::Void',xp,{}).am$('testTrailingTabs',8192,'sys::Void',xp,{}).am$('testUnicodePunctuation',8192,'sys::Void',xp,{}).am$('testHtmlBlockInterruptingList',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
HeadingParserTest.type$.am$('testAtxHeadingStart',8192,'sys::Void',xp,{}).am$('testAtxHeadingTrailing',8192,'sys::Void',xp,{}).am$('testSetextHeadingMarkers',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
ScannerTest.type$.am$('testNext',8192,'sys::Void',xp,{}).am$('testMultipleLines',8192,'sys::Void',xp,{}).am$('testCodePoints',8192,'sys::Void',xp,{}).am$('testTextBetween',8192,'sys::Void',xp,{}).am$('testNextStr',8192,'sys::Void',xp,{}).am$('testWhitespace',8192,'sys::Void',xp,{}).am$('verifySourceLines',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lines','markdown::SourceLines',false),new sys.Param('expectedContent','sys::Str',false),new sys.Param('expectedSpans','markdown::SourceSpan[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
FencedCodeParserTest.type$.am$('testBacktickInfo',8192,'sys::Void',xp,{}).am$('testBacktickInfoDoesntAllowBacktick',8192,'sys::Void',xp,{}).am$('testBacktickAndTildeCantBeMixed',8192,'sys::Void',xp,{}).am$('testClosingCanHaveSpacesAfter',8192,'sys::Void',xp,{}).am$('testClosingCanNotHavNonSpaces',8192,'sys::Void',xp,{}).am$('test151',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
DelimiterProcessorTest.type$.am$('make',139268,'sys::Void',xp,{});
LinkReferenceDefinitionParserTest.type$.af$('parser',67584,'markdown::LinkReferenceDefinitionParser?',{}).am$('setup',271360,'sys::Void',xp,{}).am$('testStartLabel',8192,'sys::Void',xp,{}).am$('testStartNoLabel',8192,'sys::Void',xp,{}).am$('testEmptyLabel',8192,'sys::Void',xp,{}).am$('testLabelColon',8192,'sys::Void',xp,{}).am$('testLabel',8192,'sys::Void',xp,{}).am$('testLabelInvalid',8192,'sys::Void',xp,{}).am$('testLabelMultiline',8192,'sys::Void',xp,{}).am$('testLabelStartsWithNewLine',8192,'sys::Void',xp,{}).am$('testDestination',8192,'sys::Void',xp,{}).am$('testDestinationInvalid',8192,'sys::Void',xp,{}).am$('testTitle',8192,'sys::Void',xp,{}).am$('testTitleStartWhitespace',8192,'sys::Void',xp,{}).am$('testTitleMultiline',8192,'sys::Void',xp,{}).am$('testTitleMultiline2',8192,'sys::Void',xp,{}).am$('testTitleMultiline3',8192,'sys::Void',xp,{}).am$('testTitleMultiline4',8192,'sys::Void',xp,{}).am$('testTitleInvalid',8192,'sys::Void',xp,{}).am$('parse',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('content','sys::Str',false)]),{}).am$('verifyPara',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::Str',false)]),{}).am$('verifyState',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::Str',false),new sys.Param('state','markdown::LinkRefState',false),new sys.Param('content','sys::Str',false)]),{}).am$('verifyDef',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','markdown::LinkReferenceDefinition',false),new sys.Param('label','sys::Str',false),new sys.Param('dest','sys::Uri',false),new sys.Param('title','sys::Str?',false)]),{}).am$('verifyParaLines',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expectedContent','sys::Str',false),new sys.Param('parser','markdown::LinkReferenceDefinitionParser',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HtmlInlineParserTest.type$.am$('testComment',8192,'sys::Void',xp,{}).am$('testCdata',8192,'sys::Void',xp,{}).am$('testDeclaration',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
LinkReferenceDefinitionNodeTest.type$.am$('testDefinitionWithoutParagraph',8192,'sys::Void',xp,{}).am$('testDefinitionWithParagraph',8192,'sys::Void',xp,{}).am$('testMultipleDefinitions',8192,'sys::Void',xp,{}).am$('testMultipleDefinitionsWithSameLabel',8192,'sys::Void',xp,{}).am$('testDefinitionOfReplacedBlock',8192,'sys::Void',xp,{}).am$('testDefinitionInListItem',8192,'sys::Void',xp,{}).am$('testDefinitionInListItem2',8192,'sys::Void',xp,{}).am$('testDefinitionLabelCaseIsPreserved',8192,'sys::Void',xp,{}).am$('verifyDef',2048,'markdown::LinkReferenceDefinition',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false),new sys.Param('label','sys::Str?',false)]),{}).am$('parse',2048,'markdown::Node',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ThematicBreakParserTest.type$.af$('parser',73728,'markdown::Parser?',{}).am$('setup',271360,'sys::Void',xp,{}).am$('testLiteral',8192,'sys::Void',xp,{}).am$('verifyLiteral',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expected','sys::Str',false),new sys.Param('input','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
SourceLineTest.type$.am$('testSubstring',8192,'sys::Void',xp,{}).am$('verifySourceLine',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','markdown::SourceLine',false),new sys.Param('expectedContent','sys::Str',false),new sys.Param('expectedSourceSpan','markdown::SourceSpan?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
PathologicalTest.type$.af$('x',67584,'sys::Int',{}).am$('testNestedStrongEmphasis',8192,'sys::Void',xp,{}).am$('testEmphasisClosersWithNoOpeners',8192,'sys::Void',xp,{}).am$('testEmphasisOpenersWithNoClosers',8192,'sys::Void',xp,{}).am$('testLinkClosersWithNoOpeners',8192,'sys::Void',xp,{}).am$('testLinkOpenersWithNoCloser',8192,'sys::Void',xp,{}).am$('testMismatchedOpenersAndClosers',8192,'sys::Void',xp,{}).am$('testNestedBrackets',8192,'sys::Void',xp,{}).am$('testNestedBlockQuotes',8192,'sys::Void',xp,{}).am$('testHugeHorizontalRule',8192,'sys::Void',xp,{}).am$('testBackslashInLink',8192,'sys::Void',xp,{}).am$('testUnclosedInlineLinks',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
ParserTest.type$.am$('testCustomBlockFactory',8192,'sys::Void',xp,{}).am$('testEnabledBlockTypes',8192,'sys::Void',xp,{}).am$('testEnabledBlockTypesThrowsWhenGivenUnknownType',8192,'sys::Void',xp,{}).am$('testIndentation',8192,'sys::Void',xp,{}).am$('firstText',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('n','markdown::Node',false)]),{}).am$('make',139268,'sys::Void',xp,{});
TestDashBlock.type$.am$('make',139268,'sys::Void',xp,{});
TestDashBlockParser.type$.af$('block',336896,'markdown::TestDashBlock',{}).am$('tryContinue',271360,'markdown::BlockContinue?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false)]),{}).am$('make',139268,'sys::Void',xp,{});
TestDashBlockParserFactory.type$.am$('tryStart',271360,'markdown::BlockStart?',sys.List.make(sys.Param.type$,[new sys.Param('state','markdown::ParserState',false),new sys.Param('parser','markdown::MatchedBlockParser',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HtmlRendererTest.type$.am$('testHtmlAllowingShouldNotEscapeInlineHtml',8192,'sys::Void',xp,{}).am$('testHtmlAllowingShouldNotEscapeBlockHtml',8192,'sys::Void',xp,{}).am$('testHtmlEscapingShouldEscapeInlineHtml',8192,'sys::Void',xp,{}).am$('testHtmlEscapingShouldEscapeHtmlBlocks',8192,'sys::Void',xp,{}).am$('testTextEscaping',8192,'sys::Void',xp,{}).am$('testCharacterReferencesWithoutSemicolonsShouldNotBeParsedShouldBeEscaped',8192,'sys::Void',xp,{}).am$('testAttributeEscaping',8192,'sys::Void',xp,{}).am$('testRawUrlsShouldNotFilterDangerousProtocols',8192,'sys::Void',xp,{}).am$('testSanitizedUrlsShouldSetRelNoFollow',8192,'sys::Void',xp,{}).am$('testSanitzieUrlsShouldAllowSafeProtocols',8192,'sys::Void',xp,{}).am$('testSanitizeUrlsShouldFilterDangerousProtocols',8192,'sys::Void',xp,{}).am$('testPercentEncodeUrlDisabled',8192,'sys::Void',xp,{}).am$('testPercentEncodeUrl',8192,'sys::Void',xp,{}).am$('testOrderedListStartZero',8192,'sys::Void',xp,{}).am$('testImageAltTextWithSoftLineBreak',8192,'sys::Void',xp,{}).am$('testAltTextWithHardLineBreak',8192,'sys::Void',xp,{}).am$('testImageAltTextWithEntities',8192,'sys::Void',xp,{}).am$('testCanRenderContentsOfSingleParagraph',8192,'sys::Void',xp,{}).am$('testOmitSingleParagraphP',8192,'sys::Void',xp,{}).am$('def',34818,'markdown::HtmlRenderer',xp,{}).am$('htmlAllowing',34818,'markdown::HtmlRenderer',xp,{}).am$('htmlEscaping',34818,'markdown::HtmlRenderer',xp,{}).am$('raw',34818,'markdown::HtmlRenderer',xp,{}).am$('sanitize',34818,'markdown::HtmlRenderer',xp,{}).am$('percentEnc',34818,'markdown::HtmlRenderer',xp,{}).am$('parse',34818,'markdown::Node',sys.List.make(sys.Param.type$,[new sys.Param('source','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ListBlockParserTest.type$.af$('parser',73728,'markdown::Parser?',{}).am$('setup',271360,'sys::Void',xp,{}).am$('testBulletListIndents',8192,'sys::Void',xp,{}).am$('testOrderedListIndents',8192,'sys::Void',xp,{}).am$('verifyListItemIndents',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::Str',false),new sys.Param('expectedMarkerIndent','sys::Int',false),new sys.Param('expectedContentIndent','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{});
CommonMarkSpecTest.type$.af$('specFile',67586,'sys::File',{}).af$('bySection',69632,'[sys::Str:markdown::Example[]]',{}).am$('examples',4096,'markdown::Example[]',xp,{}).am$('expectedFailures',266240,'sys::Int[]',xp,{}).am$('examplesToRun',266240,'markdown::Example[]',xp,{}).am$('run',266241,'markdown::ExampleRes',sys.List.make(sys.Param.type$,[new sys.Param('example','markdown::Example',false)]),{}).am$('test',8192,'sys::Void',xp,{}).am$('init',4096,'sys::Bool',xp,{}).am$('make',139268,'sys::Void',xp,{});
HtmlCoreSpecTest.type$.af$('parser',67584,'markdown::Parser',{}).af$('renderer',67584,'markdown::HtmlRenderer',{}).am$('run',267264,'markdown::ExampleRes',sys.List.make(sys.Param.type$,[new sys.Param('example','markdown::Example',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ExampleRes.type$.af$('example',73730,'markdown::Example',{}).af$('err',73730,'sys::Err?',{}).af$('rendered',73730,'sys::Str?',{}).am$('makeOk',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('example','markdown::Example',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('example','markdown::Example',false),new sys.Param('err','sys::Err?',false),new sys.Param('rendered','sys::Str?',false)]),{}).am$('failed',8192,'sys::Bool',xp,{});
Example.type$.af$('json',73730,'sys::Map',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('json','sys::Map',false)]),{}).am$('markdown',8192,'sys::Str',xp,{}).am$('html',8192,'sys::Str',xp,{}).am$('id',8192,'sys::Int',xp,{}).am$('section',8192,'sys::Str',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
TableMarkdownRendererTest.type$.af$('exts',100354,'markdown::MarkdownExt[]',{}).af$('parser',100354,'markdown::Parser',{}).af$('renderer',100354,'markdown::MarkdownRenderer',{}).am$('testHeadNoBody',8192,'sys::Void',xp,{}).am$('testBodyHasFewerColumns',8192,'sys::Void',xp,{}).am$('testAlignment',8192,'sys::Void',xp,{}).am$('testInsideBlockQuote',8192,'sys::Void',xp,{}).am$('testMultipleTables',8192,'sys::Void',xp,{}).am$('testEscaping',8192,'sys::Void',xp,{}).am$('testEscaped',8192,'sys::Void',xp,{}).am$('render',4096,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('source','sys::Str',false)]),{}).am$('verifyRoundTrip',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
ImgAttrsExtTest.type$.af$('exts',100354,'markdown::MarkdownExt[]',{}).af$('parser',100354,'markdown::Parser',{}).af$('renderer',100354,'markdown::HtmlRenderer',{}).af$('md',100354,'markdown::MarkdownRenderer',{}).am$('testBaseCase',8192,'sys::Void',xp,{}).am$('testDoubleDelimiters',8192,'sys::Void',xp,{}).am$('testMismatchingDelimitersAreIgnored',8192,'sys::Void',xp,{}).am$('testUnsupportedStyleNamesAreLeftUnchanged',8192,'sys::Void',xp,{}).am$('testStyleWithNoValueIsIgnored',8192,'sys::Void',xp,{}).am$('testImageAltTextWithSpaces',8192,'sys::Void',xp,{}).am$('testImageAltTextWithSoftLineBreak',8192,'sys::Void',xp,{}).am$('testImageAltTextWithHardLineBreak',8192,'sys::Void',xp,{}).am$('testImageAltTextWithEntities',8192,'sys::Void',xp,{}).am$('testTextNodesAreUnchanged',8192,'sys::Void',xp,{}).am$('render',267264,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('source','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
TablesExtTest.type$.af$('exts',100354,'markdown::MarkdownExt[]',{}).af$('parser',100354,'markdown::Parser',{}).af$('renderer',100354,'markdown::HtmlRenderer',{}).af$('md',100354,'markdown::MarkdownRenderer',{}).af$('expected2cells',100354,'sys::Str',{}).af$('doRoundTrip',67584,'sys::Bool',{}).am$('testMustHaveHeaderAndSeparator',8192,'sys::Void',xp,{}).am$('testSeparatorMustBeOneOrMore',8192,'sys::Void',xp,{}).am$('testSeparatorMustNotContainInvalidChars',8192,'sys::Void',xp,{}).am$('testSeparatorCanHaveLeadingSpaceThenPipe',8192,'sys::Void',xp,{}).am$('testSeparatorCanNotHaveAdjacentPipes',8192,'sys::Void',xp,{}).am$('testSeparatorNeedsPipes',8192,'sys::Void',xp,{}).am$('testHeaderMustBeOneLine',8192,'sys::Void',xp,{}).am$('testOneHeadNoBody',8192,'sys::Void',xp,{}).am$('testOneColumnOneHeadNoBody',8192,'sys::Void',xp,{}).am$('testOneColumnOneHeadOneBody',8192,'sys::Void',xp,{}).am$('testOneHeadOneBody',8192,'sys::Void',xp,{}).am$('testSpaceBeforeSeparator',8192,'sys::Void',xp,{}).am$('testSeparatorMustNotHaveLessPartsThanHead',8192,'sys::Void',xp,{}).am$('testPadding',8192,'sys::Void',xp,{}).am$('testPaddingWithCodeBlockIndentation',8192,'sys::Void',xp,{}).am$('testPipesOnOutside',8192,'sys::Void',xp,{}).am$('testPipesOnOutsideWhitespaceAfterHeader',8192,'sys::Void',xp,{}).am$('testPipesOnOutsideZeroLengthHeaders',8192,'sys::Void',xp,{}).am$('testInlineElements',8192,'sys::Void',xp,{}).am$('testEscapedPipe',8192,'sys::Void',xp,{}).am$('testEscapedBackslash',8192,'sys::Void',xp,{}).am$('testEscapedOther',8192,'sys::Void',xp,{}).am$('testBackslashAtEnd',8192,'sys::Void',xp,{}).am$('testAlignLeft',8192,'sys::Void',xp,{}).am$('testAlignRight',8192,'sys::Void',xp,{}).am$('testAlignCenter',8192,'sys::Void',xp,{}).am$('testAlignCenterSecond',8192,'sys::Void',xp,{}).am$('testAlignLeftWithSpaces',8192,'sys::Void',xp,{}).am$('testAlignmentMarkerMustBeNextToDashs',8192,'sys::Void',xp,{}).am$('testBodyCanNotHaveMoreColumnsThanHead',8192,'sys::Void',xp,{}).am$('testBodyWithFewerColumnsThanHeadresultsInEmptyCells',8192,'sys::Void',xp,{}).am$('testInsideBlockQuote',8192,'sys::Void',xp,{}).am$('testTableWithLazyContinuationLine',8192,'sys::Void',xp,{}).am$('testDanglingPipe',8192,'sys::Void',xp,{}).am$('testAttrProviderIsApplied',8192,'sys::Void',xp,{}).am$('testGfmSpec',8192,'sys::Void',xp,{}).am$('render',267264,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('source','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
TablesTestAttrProvider.type$.am$('setAttrs',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false),new sys.Param('tagName','sys::Str',false),new sys.Param('attrs','[sys::Str:sys::Str?]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
XetodocExtTest.type$.af$('parser',100354,'markdown::Parser',{}).af$('renderer',100354,'markdown::HtmlRenderer',{}).af$('md',100354,'markdown::MarkdownRenderer',{}).am$('testTicks',8192,'sys::Void',xp,{}).am$('testBacktickLinks',8192,'sys::Void',xp,{}).am$('render',267264,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('source','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
TestLinkResolver.type$.am$('resolve',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::LinkNode',false)]),{}).am$('make',139268,'sys::Void',xp,{});
MarkdownRendererTest.type$.am$('testThematicBreaks',8192,'sys::Void',xp,{}).am$('testHeadings',8192,'sys::Void',xp,{}).am$('testIndentedCodeBlocks',8192,'sys::Void',xp,{}).am$('testFencedCodeBlocks',8192,'sys::Void',xp,{}).am$('testFencedCodeBlocksFromAst',8192,'sys::Void',xp,{}).am$('testHtmlBlocks',8192,'sys::Void',xp,{}).am$('testParagraphs',8192,'sys::Void',xp,{}).am$('testBlockQuotes',8192,'sys::Void',xp,{}).am$('testBulletListItems',8192,'sys::Void',xp,{}).am$('testBulletListItemsFromAst',8192,'sys::Void',xp,{}).am$('testOrderedListItems',8192,'sys::Void',xp,{}).am$('testOrderedListItemsFromAst',8192,'sys::Void',xp,{}).am$('testTabs',8192,'sys::Void',xp,{}).am$('testEscaping',8192,'sys::Void',xp,{}).am$('testCodeSpans',8192,'sys::Void',xp,{}).am$('testEmphasis',8192,'sys::Void',xp,{}).am$('testStrongEmphasis',8192,'sys::Void',xp,{}).am$('testLinks',8192,'sys::Void',xp,{}).am$('testImages',8192,'sys::Void',xp,{}).am$('testHtmlInline',8192,'sys::Void',xp,{}).am$('testHardBreak',8192,'sys::Void',xp,{}).am$('testSoftBreak',8192,'sys::Void',xp,{}).am$('verifyRoundTrip',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::Str',false)]),{}).am$('parseAndRender',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('source','sys::Str',false)]),{}).am$('parse',2048,'markdown::Node',sys.List.make(sys.Param.type$,[new sys.Param('source','sys::Str',false)]),{}).am$('render',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('node','markdown::Node',false)]),{}).am$('verifyRendering',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('source','sys::Str',false),new sys.Param('expected','sys::Str',false),new sys.Param('actual','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
MarkdownSpecTest.type$.af$('parser',67584,'markdown::Parser',{}).af$('markdown_renderer',67584,'markdown::MarkdownRenderer',{}).af$('html_renderer',67584,'markdown::HtmlRenderer',{}).am$('examplesToRun',267264,'markdown::Example[]',xp,{}).am$('run',267264,'markdown::ExampleRes',sys.List.make(sys.Param.type$,[new sys.Param('example','markdown::Example',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "markdown");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0");
m.set("pod.summary", "Markdown parsing and rendering");
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
  MarkdownExt,
  Node,
  HardLineBreak,
  SoftLineBreak,
  Delimited,
  StrongEmphasis,
  Emphasis,
  Text,
  Code,
  HtmlInline,
  CustomNode,
  Block,
  Document,
  Heading,
  BlockQuote,
  FencedCode,
  HtmlBlock,
  ThematicBreak,
  IndentedCode,
  ListBlock,
  BulletList,
  OrderedList,
  ListItem,
  Paragraph,
  CustomBlock,
  DefinitionMap,
  LinkNode,
  Link,
  Image,
  LinkReferenceDefinition,
  Visitor,
  Xetodoc,
  InlineContentParser,
  InlineCodeParser,
  InlineContentParserFactory,
  NodeRenderer,
  TablesExt,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alignment,
  BlockParser,
  BlockParserFactory,
  ImgAttrsExt,
  ImgAttrs,
  DelimiterProcessor,
  AttrProvider,
  ParserState,
  MatchedBlockParser,
  Parsing,
  Scanner,
  Position,
  PostProcessor,
  LinkResolver,
  BlockStart,
  BlockContinue,
  SourceSpan,
  IncludeSourceSpans,
  SourceSpans,
  Parser,
  ParserBuilder,
  SourceLine,
  SourceLines,
  InlineParser,
  InlineParserContext,
  InlineParserState,
  ParsedInline,
  LinkInfo,
  Delimiter,
  EmphasisDelimiterProcessor,
  LinkProcessor,
  LinkResult,
  Renderer,
  CoreHtmlNodeRenderer,
  UrlSanitizer,
  HtmlContext,
  HtmlRenderer,
  HtmlRendererBuilder,
  HtmlWriter,
  MarkdownRenderer,
  MarkdownRendererBuilder,
  MarkdownContext,
  CoreMarkdownNodeRenderer,
  MarkdownWriter,
  MarkdownTest,
  RenderingTest,
  CoreRenderingTest,
  ListTightLooseTest,
  CharsTest,
  DelimitedTest,
  EscTest,
  NodeTest,
  SpecialInputTest,
  HeadingParserTest,
  ScannerTest,
  FencedCodeParserTest,
  DelimiterProcessorTest,
  LinkReferenceDefinitionParserTest,
  HtmlInlineParserTest,
  LinkReferenceDefinitionNodeTest,
  ThematicBreakParserTest,
  SourceLineTest,
  PathologicalTest,
  ParserTest,
  HtmlRendererTest,
  ListBlockParserTest,
  CommonMarkSpecTest,
  HtmlCoreSpecTest,
  ExampleRes,
  Example,
  TableMarkdownRendererTest,
  ImgAttrsExtTest,
  TablesExtTest,
  XetodocExtTest,
  TestLinkResolver,
  MarkdownRendererTest,
  MarkdownSpecTest,
};
