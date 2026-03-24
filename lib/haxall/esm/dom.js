// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as graphics from './graphics.js'
import * as inet from './inet.js'
import * as web from './web.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class Storage extends sys.Obj {
  constructor() {
    super();
    this.peer = new StoragePeer(this);
    const this$ = this;
  }

  typeof() { return Storage.type$; }

  static make() {
    const $self = new Storage();
    Storage.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  size() {
    return this.peer.size(this);
  }

  keys() {
    return this.peer.keys(this);
  }

  key(index) {
    return this.peer.key(this,index);
  }

  get(key) {
    return this.peer.get(this,key);
  }

  set(key,val) {
    return this.peer.set(this,key,val);
  }

  remove(key) {
    return this.peer.remove(this,key);
  }

  clear() {
    return this.peer.clear(this);
  }

}

class StoragePeer extends sys.Obj {


  constructor(self) { super(); }

  $instance;


  size = function(self)
  {
    return this.$instance.length;
  }

  keys = function(self)
  {
    var keys = Object.keys(this.$instance);
    return sys.List.make(sys.Str.type$, keys);
  }

  key = function(self, index)
  {
    return this.$instance.key(index);
  }

  get = function(self, key)
  {
    return this.$instance.getItem(key);
  }

  set = function(self, key, val)
  {
    this.$instance.setItem(key, val);
  }

  remove = function(self, key)
  {
    this.$instance.removeItem(key);
  }

  clear = function(self)
  {
    this.$instance.clear();
  }
}

class MutationObserver extends sys.Obj {
  constructor() {
    super();
    this.peer = new MutationObserverPeer(this);
    const this$ = this;
  }

  typeof() { return MutationObserver.type$; }

  #callback = null;

  callback(it) {
    if (it === undefined) {
      return this.#callback;
    }
    else {
      this.#callback = it;
      return;
    }
  }

  static make(callback) {
    const $self = new MutationObserver();
    MutationObserver.make$($self,callback);
    return $self;
  }

  static make$($self,callback) {
    $self.#callback = callback;
    return;
  }

  observe(target,opts) {
    return this.peer.observe(this,target,opts);
  }

  takeRecs() {
    return this.peer.takeRecs(this);
  }

  disconnect() {
    return this.peer.disconnect(this);
  }

}

class MutationObserverPeer extends sys.Obj {

  constructor(self)
  {
    super();
    this.observer = new js.MutationObserver(function(recs)
    {
      const list = MutationObserverPeer.$makeRecList(recs);
      self.callback()(list);
    });
  }

  observe(self, target, opts)
  {
    const config = {
      childList:             opts.get("childList")      == true,
      attributes:            opts.get("attrs")          == true,
      characterData:         opts.get("charData")       == true,
      subtree:               opts.get("subtree")        == true,
      attributeOldValue:     opts.get("attrOldVal")     == true,
      characterDataOldValue: opts.get("charDataOldVal") == true,
    };
    const filter = opts.get("attrFilter")
    if (filter != null) config.attributeFilter = filter.values();
    this.observer.observe(target.peer.elem, config);
    return self;
  }

  takeRecs = function(self)
  {
    const recs = this.observer.takeRecords();
    return MutationObserverPeer.$makeRecList(recs);
  }

  disconnect = function(self)
  {
    this.observer.disconnect();
  }

  static $makeRec = function(rec)
  {
    const fanRec = MutationRec.make();

    if (rec.type == "attributes")         fanRec.type ("attrs");
    else if (rec.type == "characterData") fanRec.type ("charData");
    else                                  fanRec.type (rec.type);

    fanRec.target (ElemPeer.wrap(rec.target));
    fanRec.attr   (rec.attributeName);
    fanRec.attrNs (rec.attributeNamespace);
    fanRec.oldVal (rec.oldValue);

    if (rec.previousSibling) fanRec.prevSibling (ElemPeer.wrap(rec.previousSibling));
    if (rec.nextSibling)     fanRec.nextSibling (ElemPeer.wrap(rec.nextSibling));

    const added = new Array();
    for (let i=0; i<rec.addedNodes.length; i++)
      added.push(ElemPeer.wrap(rec.addedNodes[i]));
    fanRec.added (sys.List.make(Elem.type$, added));

    const removed = new Array();
    for (let i=0; i<rec.removedNodes.length; i++)
      removed.push(ElemPeer.wrap(rec.removedNodes[i]));
    fanRec.removed (sys.List.make(Elem.type$, removed));

    return fanRec;
  }

  static $makeRecList = function(recs)
  {
    const list = new Array();
    for (let i=0; i<recs.length; i++)
      list.push(MutationObserverPeer.$makeRec(recs[i]));
    return sys.List.make(MutationRec.type$, list);
  }
}

class MutationRec extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MutationRec.type$; }

  #type = null;

  type(it) {
    if (it === undefined) {
      return this.#type;
    }
    else {
      this.#type = it;
      return;
    }
  }

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

  #added = null;

  added(it) {
    if (it === undefined) {
      return this.#added;
    }
    else {
      this.#added = it;
      return;
    }
  }

  #removed = null;

  removed(it) {
    if (it === undefined) {
      return this.#removed;
    }
    else {
      this.#removed = it;
      return;
    }
  }

  #prevSibling = null;

  prevSibling(it) {
    if (it === undefined) {
      return this.#prevSibling;
    }
    else {
      this.#prevSibling = it;
      return;
    }
  }

  #nextSibling = null;

  nextSibling(it) {
    if (it === undefined) {
      return this.#nextSibling;
    }
    else {
      this.#nextSibling = it;
      return;
    }
  }

  #attr = null;

  attr(it) {
    if (it === undefined) {
      return this.#attr;
    }
    else {
      this.#attr = it;
      return;
    }
  }

  #attrNs = null;

  attrNs(it) {
    if (it === undefined) {
      return this.#attrNs;
    }
    else {
      this.#attrNs = it;
      return;
    }
  }

  #oldVal = null;

  oldVal(it) {
    if (it === undefined) {
      return this.#oldVal;
    }
    else {
      this.#oldVal = it;
      return;
    }
  }

  static make(f) {
    const $self = new MutationRec();
    MutationRec.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    if (f != null) {
      sys.Func.call(f, $self);
    }
    ;
    return;
  }

}

class TextSel extends sys.Obj {
  constructor() {
    super();
    this.peer = new TextSelPeer(this);
    const this$ = this;
  }

  typeof() { return TextSel.type$; }

  static make() {
    const $self = new TextSel();
    TextSel.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  clear() {
    return this.peer.clear(this);
  }

}

class TextSelPeer extends sys.Obj {
  constructor(self)
  {
    super();
    this.sel = null;
  }

  clear(self)
  {
    return this.sel.removeAllRanges();
  }
}



class CanvasGraphics extends sys.Obj {

  constructor() { super(); }
  typeof() { return CanvasGraphics.type$; }

  cx;

  // render
  static render(canvas, cb)
  {
    const cx = canvas.peer.elem.getContext("2d");
    const g = new CanvasGraphics();
    if (!canvas.peer.__inited)
    {
      // first time thru scale by half a pixel to avoid blurry lines
      canvas.peer.__inited = true;
      cx.translate(0.5, 0.5);
    }
    g.cx = cx;
    cb(g);
  }

  // Paint paint
  #paint = graphics.Color.black();
  paint(it)
  {
    if (it === undefined) return this.#paint;

    this.#paint = it;
    this.cx.fillStyle = it.asColorPaint().toStr();
    this.cx.strokeStyle = it.asColorPaint().toStr();
  }

  // Color color
  #color = graphics.Color.black();
  color(it)
  {
    if (it === undefined) return this.#color;

    this.#color = it;
    this.paint(it);
  }

  // Stroke stroke
  #stroke = graphics.Stroke.defVal();
  stroke(it)
  {
    if (it === undefined) return this.#stroke;

    this.#stroke       = it;
    this.cx.lineWidth  = it.width();
    this.cx.lineCap    = it.cap().toStr();
    this.cx.lineJoin   = it.join() == graphics.StrokeJoin.radius() ? "round" : it.join().toStr();
    this.cx.setLineDash(this.#toStrokeDash(it.dash()));
  }

  #toStrokeDash(x)
  {
    if (x == null) return [];
    return graphics.GeomUtil.parseFloatList(x).__values();
  }

  // Float alpha
  #alpha = null;
  alpha(it)
  {
    if (it === undefined) return this.#alpha;

    this.#alpha = it;
    this.cx.globalAlpha = it;
  }

  // Font font
  #font = null;
  font(it)
  {
    if (it === undefined) return this.#font;

    this.#font = it;
    this.cx.font = it.toStr();
  }

  // FontMetrics metrics()
  metrics()
  {
    return new CanvasFontMetrics().init(this.cx);
  }

  // GraphicsPath path()
  path()
  {
    this.cx.beginPath();
    const path = new CanvasGraphicsPath();
    path.cx = this.cx;
    return path;
  }

  // This drawLine(Float x1, Float y1, Float x2, Float y2)
  drawLine(x1, y1, x2, y2)
  {
    this.cx.beginPath();
    this.cx.moveTo(x1, y1);
    this.cx.lineTo(x2, y2);
    this.cx.stroke();
    return this;
  }

  // This drawRect(Float x, Float y, Float w, Float h)
  drawRect(x, y, w, h)
  {
    this.cx.strokeRect(x, y, w, h);
    return this;
  }

  // This fillRect(Float x, Float y, Float w, Float h)
  fillRect(x, y, w, h)
  {
    this.cx.fillRect(x, y, w, h);
    return this;
  }

  // This clipRect(Float x, Float y, Float w, Float h)
  clipRect(x, y, w, h)
  {
    this.cx.beginPath();
    this.cx.rect(x, y, w, h)
    this.cx.clip();
    return this;
  }

  // This drawRoundRect(Float x, Float y, Float w, Float h, Float wArc, Float hArc)
  drawRoundRect(x, y, w, h, wArc, hArc)
  {
    this.pathRoundRect(x, y, w, h, wArc, hArc);
    this.cx.stroke();
    return this;
  }

  // This fillRoundRect(Float x, Float y, Float w, Float h, Float wArc, Float hArc)
  fillRoundRect(x, y, w, h, wArc, hArc)
  {
    this.pathRoundRect(x, y, w, h, wArc, hArc);
    this.cx.fill();
    return this;
  }

  // generate path for a rounded rectangle
  pathRoundRect(x, y, w, h, wArc, hArc)
  {
    this.cx.beginPath();
    this.cx.moveTo(x + wArc, y);
    this.cx.lineTo(x + w - wArc, y);
    this.cx.quadraticCurveTo(x + w, y, x + w, y + hArc);
    this.cx.lineTo(x + w, y + h - hArc);
    this.cx.quadraticCurveTo(x + w, y + h , x + w - wArc, y + h);
    this.cx.lineTo(x + wArc, y + h);
    this.cx.quadraticCurveTo(x, y + h , x, y + h - hArc);
    this.cx.lineTo(x, y + hArc);
    this.cx.quadraticCurveTo(x, y, x + wArc, y);
  }

  // This drawEllipse(Float x, Float y, Float w, Float h)
  drawEllipsefunction(x, y, w, h)
  {
    this.pathEllipse(x, y, w, h);
    this.cx.stroke();
  }

  // This fillEllipse(Float x, Float y, Float w, Float h)
  fillEllipse(x, y, w, h)
  {
    this.pathEllipse(x, y, w, h);
    this.cx.fill();
  }

  // generate path for an ellipse
  pathEllipse(x, y, w, h)
  {
    var rx = w / 2;
    var ry = h / 2;
    var cx = x + rx;
    var cy = y + ry;
    this.cx.beginPath();
    this.cx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
  }

  // This drawText(Str s, Float x, Float y)
  drawText(s, x, y)
  {
    this.cx.fillText(s, x, y);
    return this;
  }

  // This drawImage(Image img, Float x, Float y, Float w := img.w, Float h := img.h)
  drawImage(img, x, y, w, h)
  {
    if (w === undefined) w = img.w();
    if (h === undefined) h = img.h();
    this.cx.drawImage(img.peer.elem, x, y, w, h);
    return this;
  }

  // This drawImageRegion(Image img, Rect src, Rect dst)
  drawImageRegion(img, src, dst)
  {
    this.cx.drawImage(img.peer.elem,
      src.x(), src.y(), src.w(), src.h(),
      dst.x(), dst.y(), dst.w(), dst.h());
    return this;
  }

  // This translate(Float x, Float y)
  translate(x, y)
  {
    this.cx.translate(x, y);
    return this;
  }

  // This transform(Transform transform)
  transform(t)
  {
    this.cx.transform(t.a(), t.b(), t.c(), t.d(), t.e(), t.f());
    return this;
  }

  // This push(Rect? r := null)
  push(r)
  {
    this.cx.save();
    if (r !== undefined && r !== null)
    {
      this.cx.beginPath();
      this.cx.translate(r.x(), r.y());
      this.cx.rect(0, 0, r.w(), r.h());
      this.cx.clip();
    }
    const state = {
      paint:  this.#paint,
      color:  this.#color,
      stroke: this.#stroke,
      alpha:  this.#alpha,
      font:   this.#font
    }
    this.#stack.push(state);
    return this;
  }

  // This pop()
  pop()
  {
    this.cx.restore();
    const state = this.#stack.pop();
    this.#paint  = state.paint;
    this.#color  = state.color;
    this.#stroke = state.stroke;
    this.#alpha  = state.alpha;
    this.#font   = state.font;
    return this;
  }

  // state for fields in push/pop
  #stack = new Array();

}



class CanvasGraphicsPath extends sys.Obj {

  constructor() { super(); }
  typeof() { return CanvasGraphicsPath.type$; }

  // canvas context
  cx;

  // This draw()
  draw()
  {
    this.cx.stroke();
    return this;
  }

  // This fill()
  fill()
  {
    this.cx.fill();
    return this;
  }

  // This clip()
  clip()
  {
    this.cx.clip();
    return this;
  }

  // This moveTo(Float x, Float y)
  moveTo(x, y)
  {
    this.cx.moveTo(x, y);
    return this;
  }

  // This lineTo(Float x, Float y)
  lineTo(x, y)
  {
    this.cx.lineTo(x, y);
    return this;
  }

  // This arc(Float x, Float y, Float radius, Float start, Float sweep)
  arc(x, y, radius, start, sweep)
  {
    const startRadians = (360 - start) * Math.PI / 180;
    const endRadians = startRadians - (sweep * Math.PI / 180);
    const counterclockwise = sweep > 0;
    this.cx.arc(x, y, radius, startRadians, endRadians, counterclockwise);
    return this;
  }

  // This curveTo(Float cp1x, Float cp1y, Float cp2x, Float cp2y, Float x, Float y)
  curveTo(cp1x, cp1y, cp2x, cp2y, x, y)
  {
    this.cx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    return this;
  }

  // This quadTo(Float cpx, Float cpy, Float x, Float y)
  quadTo(cpx, cpy, x, y)
  {
    this.cx.quadraticCurveTo(cpx, cpy, x, y);
    return this;
  }

  // This close()
  close()
  {
    this.cx.closePath();
    return this;
  }
}



class CanvasFontMetrics extends graphics.FontMetrics {

  constructor() { super(); }
  typeof() { return CanvasFontMetrics.type$; }

  init(cx)
  {
    const m = cx.measureText("Hg");
    this.#cx = cx
    this.#ascent =  Math.ceil(m.actualBoundingBoxAscent);
    this.#descent = Math.ceil(m.actualBoundingBoxDescent);
    this.#leading = Math.ceil(m.fontBoundingBoxAscent) - this.#ascent;
    this.#height = this.#leading + this.#ascent + this.#descent;
    return this;
  }

  #cx;
  #ascent;
  #descent;
  #leading;
  #height;

  height()   { return this.#height; }
  leading()  { return this.#leading; }
  ascent()   { return this.#ascent; }
  descent()  { return this.#descent; }
  width(str) { return this.#cx.measureText(str).width; }

}

class Elem extends sys.Obj {
  constructor() {
    super();
    this.peer = new ElemPeer(this);
    const this$ = this;
  }

  typeof() { return Elem.type$; }

  #id = null;

  id(it) {
    if (it === undefined) {
      return this.attr("id");
    }
    else {
      this.setAttr("id", it);
      return;
    }
  }

  text(it) {
    if (it === undefined) return this.peer.text(this);
    this.peer.text(this, it);
  }

  html(it) {
    if (it === undefined) return this.peer.html(this);
    this.peer.html(this, it);
  }

  enabled(it) {
    if (it === undefined) return this.peer.enabled(this);
    this.peer.enabled(this, it);
  }

  pos(it) {
    if (it === undefined) return this.peer.pos(this);
    this.peer.pos(this, it);
  }

  size(it) {
    if (it === undefined) return this.peer.size(this);
    this.peer.size(this, it);
  }

  scrollPos(it) {
    if (it === undefined) return this.peer.scrollPos(this);
    this.peer.scrollPos(this, it);
  }

  static make(tagName,ns) {
    const $self = new Elem();
    Elem.make$($self,tagName,ns);
    return $self;
  }

  static make$($self,tagName,ns) {
    if (tagName === undefined) tagName = "div";
    if (ns === undefined) ns = null;
    $self._make(tagName, ns);
    return;
  }

  _make(tagName,ns) {
    return this.peer._make(this,tagName,ns);
  }

  static fromNative(elem,type) {
    if (type === undefined) type = Elem.type$;
    return ElemPeer.fromNative(elem,type);
  }

  static fromHtml(html) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      it.html(html);
      return;
    }), Elem.type$).firstChild(), Elem.type$);
  }

  ns() {
    return this.peer.ns(this);
  }

  tagName() {
    return this.peer.tagName(this);
  }

  style() {
    return this.peer.style(this);
  }

  attrs() {
    return this.peer.attrs(this);
  }

  attr(name) {
    return this.peer.attr(this,name);
  }

  setAttr(name,val,ns) {
    if (ns === undefined) ns = null;
    return this.peer.setAttr(this,name,val,ns);
  }

  removeAttr(name) {
    return this.peer.removeAttr(this,name);
  }

  get(name) {
    return this.attr(name);
  }

  set(name,val) {
    this.setAttr(name, val);
    return;
  }

  prop(name) {
    return this.peer.prop(this,name);
  }

  setProp(name,val) {
    return this.peer.setProp(this,name,val);
  }

  trap(name,args) {
    if (args === undefined) args = null;
    return this.peer.trap(this,name,args);
  }

  invoke(name,args) {
    if (args === undefined) args = null;
    return this.peer.invoke(this,name,args);
  }

  pagePos() {
    return this.peer.pagePos(this);
  }

  relPos(p) {
    let pp = this.pagePos();
    return graphics.Point.make(sys.Float.minus(p.x(), pp.x()), sys.Float.minus(p.y(), pp.y()));
  }

  scrollSize() {
    return this.peer.scrollSize(this);
  }

  scrollIntoView(alignToTop) {
    if (alignToTop === undefined) alignToTop = true;
    return this.peer.scrollIntoView(this,alignToTop);
  }

  renderCanvas(f) {
    CanvasGraphics.render(this, f);
    return;
  }

  parent() {
    return this.peer.parent(this);
  }

  hasChildren() {
    return this.peer.hasChildren(this);
  }

  children() {
    return this.peer.children(this);
  }

  firstChild() {
    return this.peer.firstChild(this);
  }

  lastChild() {
    return this.peer.lastChild(this);
  }

  prevSibling() {
    return this.peer.prevSibling(this);
  }

  nextSibling() {
    return this.peer.nextSibling(this);
  }

  containsChild(elem) {
    return this.peer.containsChild(this,elem);
  }

  querySelector(selectors) {
    return this.peer.querySelector(this,selectors);
  }

  querySelectorAll(selectors) {
    return this.peer.querySelectorAll(this,selectors);
  }

  closest(selectors) {
    return this.peer.closest(this,selectors);
  }

  clone(deep) {
    if (deep === undefined) deep = true;
    return this.peer.clone(this,deep);
  }

  add(child) {
    this.addChild(child);
    this.onAdd(child);
    child.onParent(this);
    return this;
  }

  insertBefore(child,ref) {
    this.insertChildBefore(child, ref);
    this.onAdd(child);
    child.onParent(this);
    return this;
  }

  replace(oldChild,newChild) {
    this.replaceChild(oldChild, newChild);
    oldChild.onUnparent(this);
    this.onRemove(oldChild);
    this.onAdd(newChild);
    newChild.onParent(this);
    return this;
  }

  remove(child) {
    this.removeChild(child);
    child.onUnparent(this);
    this.onRemove(child);
    return this;
  }

  addAll(elems) {
    const this$ = this;
    elems.each((e) => {
      this$.add(e);
      return;
    });
    return this;
  }

  removeAll() {
    const this$ = this;
    this.children().each((kid) => {
      this$.remove(kid);
      return;
    });
    return this;
  }

  addChild(child) {
    return this.peer.addChild(this,child);
  }

  insertChildBefore(child,ref) {
    return this.peer.insertChildBefore(this,child,ref);
  }

  replaceChild(oldChild,newChild) {
    return this.peer.replaceChild(this,oldChild,newChild);
  }

  removeChild(child) {
    return this.peer.removeChild(this,child);
  }

  onParent(parent) {
    return;
  }

  onUnparent(parent) {
    return;
  }

  onAdd(child) {
    return;
  }

  onRemove(child) {
    return;
  }

  hasFocus() {
    return this.peer.hasFocus(this);
  }

  focus() {
    return this.peer.focus(this);
  }

  blur() {
    return this.peer.blur(this);
  }

  onEvent(type,useCapture,handler) {
    return this.peer.onEvent(this,type,useCapture,handler);
  }

  removeEvent(type,useCapture,handler) {
    return this.peer.removeEvent(this,type,useCapture,handler);
  }

  transition(props,opts,dur,onComplete) {
    if (onComplete === undefined) onComplete = null;
    const this$ = this;
    let x = this.size();
    let style = this.style();
    if (opts != null) {
      style.setAll(sys.ObjUtil.coerce(opts, sys.Type.find("[sys::Str:sys::Obj?]")));
    }
    ;
    style.trap("transitionDuration", sys.List.make(sys.Obj.type$.toNullable(), [dur]));
    style.trap("transitionProperty", sys.List.make(sys.Obj.type$.toNullable(), [Style.toVendors(props.keys()).join(", ")]));
    props.each((val,prop) => {
      style.set(prop, val);
      return;
    });
    if (onComplete != null) {
      Win.cur().setTimeout(dur, (it) => {
        sys.Func.call(onComplete, this$);
        return;
      });
    }
    ;
    return;
  }

  animateStart(frames,opts,dur) {
    if (opts != null) {
      this.style().setAll(sys.ObjUtil.coerce(opts, sys.Type.find("[sys::Str:sys::Obj?]")));
    }
    ;
    this.style().trap("animationName", sys.List.make(sys.Obj.type$.toNullable(), [frames.name()]));
    this.style().trap("animationDuration", sys.List.make(sys.Obj.type$.toNullable(), [dur]));
    return;
  }

  animateStop() {
    this.style().trap("animation", sys.List.make(sys.Obj.type$.toNullable(), [null]));
    return;
  }

}

class ElemPeer extends sys.Obj {


  constructor(self)
  {
    super();
    this.#pos  = graphics.Point.defVal();
    this.#size = graphics.Size.defVal();
  }

  #pos;
  #size;
  #svg;
  #style;
  #scrollPos;
  #scrollSize;

  _make(self, tagName, ns)
  {
    // short-circut for wrap()
    if (tagName === undefined) return;

    const doc  = Win.cur().doc().peer.doc;
    const elem = ns
      ? doc.createElementNS(ns.toStr(), tagName)
      : doc.createElement(tagName);
    this.elem = elem;
    this.elem._fanElem = self;

    // optimziation hooks for non-html namespaces
    if (ns)
    {
      if (ns.toStr() == "http://www.w3.org/2000/svg") this.#svg = true;
    }
  }

  static fromNative = function(obj, type)
  {
    if (obj instanceof Elem) return obj;
    return ElemPeer.wrap(obj, type.make());
  }


  static wrap = function(elem, fanElem)
  {
    if (!elem) throw sys.ArgErr.make("elem is null")

    if (elem._fanElem != undefined)
      return elem._fanElem;

    if (fanElem && !(fanElem instanceof Elem))
      throw sys.ArgErr.make("Type does not subclass Elem: " + fanElem);

    const x = fanElem || Elem.make();
    x.peer.elem = elem;
    elem._fanElem = x;
    return x;
  }


  ns(self)
  {
    const ns = this.elem.namespaceURI;
    return sys.Uri.fromStr(ns);
  }

  tagName(self) { return sys.Str.lower(this.elem.nodeName); }

  style(self)
  {
    if (!this.#style)
    {
      this.#style = Style.make();
      this.#style.peer.elem  = this.elem;
      this.#style.peer.style = this.elem.style;

      // polyfill for IE11/Edge with SVG nodes
      if (this.#svg && !this.elem.classList)
        this.elem.classList = new StylePeer.polyfillClassList(this.elem);
    }

    return this.#style;
  }

  text(self, it)
  {
    if (it === undefined) return this.elem.textContent;
    else this.elem.textContent = it;
  }

  html(self, it)
  {
    if (it === undefined) return this.elem.innerHTML;
    this.elem.innerHTML = it;
  }

  enabled(self, it)
  {
    if (this.elem.disabled === undefined) return null;
    else if (it === undefined) return !this.elem.disabled;
    else this.elem.disabled = !it;
  }


  attrs(self)
  {
    const map = sys.Map.make(sys.Str.type$, sys.Str.type$);
    map.caseInsensitive(true);
    const attrs = this.elem.attributes;
    for(let i=0; i<attrs.length; i++)
    {
      map.set(attrs[i].name, attrs[i].value);
    }
    return map;
  }

  attr(self, name)
  {
    return this.elem.getAttribute(name);
  }

  setAttr(self, name, val, ns)
  {
    if (val == null)
      this.elem.removeAttribute(name);
    else
    {
      if (ns == null)
        this.elem.setAttribute(name, val);
      else
        this.elem.setAttributeNS(ns.toStr(), name, val);
    }
    return self;
  }

  removeAttr(self, name)
  {
    this.elem.removeAttribute(name);
    return self;
  }


  prop(self, name)
  {
    if (ElemPeer.propHooks[name])
      return ElemPeer.propHooks[name](this);

    return this.elem[name];
  }

  setProp(self, name, val)
  {
    this.elem[name] = val;
    return self;
  }

  static propHooks = {
    contentWindow: function(peer)
    {
      const v = peer.elem.contentWindow;
      if (v == null) return null;
      const w = Win.make();
      w.peer.win = v;
      return w
    },
    files: function(peer)
    {
      const f = peer.elem.files;
      if (f == null) return null;
      const list = sys.List.make(DomFile.type$);
      for (let i=0; i<f.length; i++) list.add(DomFilePeer.wrap(f[i]));
      return list;
    }
  }


  trap(self, name, args)
  {
    if (this.#svg) return Svg.doTrap(self, name, args);

    if (args == null || args.isEmpty()) return this.prop(self, name);
    this.setProp(self, name, args.first());
    return null;
  }

  invoke(self, name, args)
  {
    const f = this.elem[name];

    // verify propery is actually a function
    if (typeof f != 'function')
      throw sys.ArgErr.make(name + " is not a function");

    // map fantom objects to js natives
    let arglist = null;
    if (args != null)
    {
      // TODO :)
      arglist = [];
      for (let i=0; i<args.size(); i++)
        arglist.push(args.get(i));
    }

    return f.apply(this.elem, arglist);
  }

  //////////////////////////////////////////////////////////////////////////
  // Layout
  //////////////////////////////////////////////////////////////////////////

  pos(self, it)
  {
    if (it === undefined)
    {
      const x = this.elem.offsetLeft;
      const y = this.elem.offsetTop;
      if (this.#pos.x() != x || this.#pos.y() != y)
        this.#pos = graphics.Point.makeInt(x, y);
      return this.#pos;
    }

    this.#pos = graphics.Point.makeInt(it.x(), it.y());
    this.elem.style.left = it.x() + "px";
    this.elem.style.top  = it.y() + "px";
  }

  pagePos(self)
  {
    const r = this.elem.getBoundingClientRect();
    const x = Math.round(r.left);
    const y = Math.round(r.top);
    return graphics.Point.makeInt(x, y);
  }

  size(self, it)
  {
    if (it === undefined)
    {
      const w = this.elem.offsetWidth  || 0;
      const h = this.elem.offsetHeight || 0;
      if (this.#size.w() != w || this.#size.h() != h)
        this.#size = graphics.Size.makeInt(w, h);
      return this.#size;
    }

    this.#size = graphics.Size.makeInt(it.w(), it.h());
    this.elem.style.width  = it.w() + "px";
    this.elem.style.height = it.h() + "px";
  }

  scrollPos(self, it)
  {
    if (it === undefined)
    {
      const x = this.elem.scrollLeft;
      const y = this.elem.scrollTop;
      if (!this.#scrollPos || this.#scrollPos.x() != x || this.#scrollPos.y() != y)
        this.#scrollPos = graphics.Point.makeInt(x, y);
      return this.#scrollPos;
    }

    this.#scrollPos = graphics.Point.makeInt(it.x(), it.y());
    this.elem.scrollLeft = it.x();
    this.elem.scrollTop  = it.y();
  }

  scrollSize(self)
  {
    const w = this.elem.scrollWidth;
    const h = this.elem.scrollHeight;
    if (!this.#scrollSize || this.#scrollSize.w() != w || this.#size.h() != h)
      this.#scrollSize = graphics.Size.makeInt(w, h);
    return this.#scrollSize;
  }

  scrollIntoView(self, alignToTop)
  {
    this.elem.scrollIntoView(alignToTop);
  }


  parent(self)
  {
    if (this.elem.nodeName == "BODY") return null;
    const parent = this.elem.parentNode;
    if (parent == null) return null;
    return ElemPeer.wrap(parent);
  }

  hasChildren(self)
  {
    return this.elem.childElementCount > 0;
  }

  children(self)
  {
    const list = new Array();
    const kids = this.elem.childNodes;
    for (let i=0; i<kids.length; i++)
      if (kids[i].nodeType == 1)
        list.push(ElemPeer.wrap(kids[i]));
    return sys.List.make(Elem.type$, list);
  }

  firstChild(self)
  {
    const kids = this.elem.childNodes;
    for (let i=0; i<kids.length; i++)
      if (kids[i].nodeType == 1)
        return ElemPeer.wrap(kids[i]);
    return null;
  }

  lastChild(self)
  {
    const kids = this.elem.childNodes;
    for (let i=kids.length-1; i>=0; i--)
      if (kids[i].nodeType == 1)
        return ElemPeer.wrap(kids[i]);
    return null;
  }

  prevSibling(self)
  {
    let sib = this.elem.previousSibling;
    while (sib != null && sib.nodeType != 1)
      sib = sib.previousSibling;
    if (sib == null) return null;
    return ElemPeer.wrap(sib);
  }

  nextSibling(self)
  {
    let sib = this.elem.nextSibling;
    while (sib != null && sib.nodeType != 1)
      sib = sib.nextSibling;
    if (sib == null) return null;
    return ElemPeer.wrap(sib);
  }

  containsChild(self, test)
  {
    return this.elem.contains(test.peer.elem);
  }

  querySelector(self, selectors)
  {
    const elem = this.elem.querySelector(selectors);
    if (elem == null) return null;
    return ElemPeer.wrap(elem);
  }

  querySelectorAll(self, selectors)
  {
    const list  = sys.List.make(Elem.type$);
    const elems = this.elem.querySelectorAll(selectors);
    for (let i=0; i<elems.length; i++)
      list.add(ElemPeer.wrap(elems[i]));
    return list;
  }

  closest(self, selectors)
  {
    const elem = this.elem.closest(selectors);
    if (elem == null) return null;
    return ElemPeer.wrap(elem);
  }

  clone(self, deep)
  {
    const clone = this.elem.cloneNode(deep);
    return ElemPeer.wrap(clone);
  }

  addChild(self, child)
  {
    this.elem.appendChild(child.peer.elem);
  }

  insertChildBefore(self, child, ref)
  {
    this.elem.insertBefore(child.peer.elem, ref.peer.elem);
  }

  replaceChild(self, oldChild, newChild)
  {
    this.elem.replaceChild(newChild.peer.elem, oldChild.peer.elem);
  }

  removeChild(self, child)
  {
    this.elem.removeChild(child.peer.elem);
  }

  hasFocus(self)
  {
    return this.elem === document.activeElement;
  }

  focus(self)
  {
    // IE throws err if element is not visible, so we need
    // to wrap in a try block
    try { this.elem.focus(); }
    catch (err) {} // ignore
  }

  blur(self)
  {
    this.elem.blur();
  }

  find(self, f)
  {
    const kids = this.children(self);
    for (let i=0; i<kids.size(); i++)
    {
      let kid = kids[i];
      if (f(kid)) return kid;
      kid = kid.find(f);
      if (kid != null) return kid;
    }
    return null;
  }

  findAll(self, f, acc)
  {
    if (acc == null) acc = new Array();
    const kids = this.children(self);
    for (let i=0; i<kids.size(); i++)
    {
      const kid = kids[i];
      if (f(kid)) acc.push(kid);
      kid.findAll(f, acc);
    }
    return acc;
  }

  onEvent(self, type, useCapture, handler)
  {
    handler.$func = function(e) { handler(EventPeer.make(e)); }
    this.elem.addEventListener(type, handler.$func, useCapture);
    return handler;
  }

  removeEvent(self, type, useCapture, handler)
  {
    if (handler.$func)
      this.elem.removeEventListener(type, handler.$func, useCapture);
  }

  toStr(self)
  {
    const name = this.elem.nodeName;
    const type = this.elem.type;
    const id   = this.elem.id;
    let str    = "<" + sys.Str.lower(name);
    if (type != null && type.length > 0) str += " type='" + type + "'";
    if (id != null && id.length > 0) str += " id='" + id + "'"
    str += ">";
    return str;
  }
}

class Style extends sys.Obj {
  constructor() {
    super();
    this.peer = new StylePeer(this);
    const this$ = this;
  }

  typeof() { return Style.type$; }

  classes(it) {
    if (it === undefined) return this.peer.classes(this);
    this.peer.classes(this, it);
  }

  static #vendor = undefined;

  static vendor() {
    if (Style.#vendor === undefined) {
      Style.static$init();
      if (Style.#vendor === undefined) Style.#vendor = null;
    }
    return Style.#vendor;
  }

  static #vendorVals = undefined;

  static vendorVals() {
    if (Style.#vendorVals === undefined) {
      Style.static$init();
      if (Style.#vendorVals === undefined) Style.#vendorVals = null;
    }
    return Style.#vendorVals;
  }

  static #counter = undefined;

  static counter() {
    if (Style.#counter === undefined) {
      Style.static$init();
      if (Style.#counter === undefined) Style.#counter = null;
    }
    return Style.#counter;
  }

  static #pseudoCacheRef = undefined;

  static pseudoCacheRef() {
    if (Style.#pseudoCacheRef === undefined) {
      Style.static$init();
      if (Style.#pseudoCacheRef === undefined) Style.#pseudoCacheRef = null;
    }
    return Style.#pseudoCacheRef;
  }

  static make() {
    const $self = new Style();
    Style.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  hasClass(name) {
    return this.peer.hasClass(this,name);
  }

  addClass(name) {
    return this.peer.addClass(this,name);
  }

  removeClass(name) {
    return this.peer.removeClass(this,name);
  }

  toggleClass(name,cond) {
    if (cond === undefined) cond = null;
    if (sys.ObjUtil.coerce(((this$) => { let $_u0 = ((this$) => { let $_u1 = cond; if ($_u1 == null) return null; return sys.Bool.not(cond); })(this$); if ($_u0 != null) return $_u0; return sys.ObjUtil.coerce(this$.hasClass(name), sys.Bool.type$.toNullable()); })(this), sys.Bool.type$)) {
      this.removeClass(name);
    }
    else {
      this.addClass(name);
    }
    ;
    return this;
  }

  addPseudoClass(name,css) {
    const this$ = this;
    if (!sys.Str.startsWith(name, ":")) {
      throw sys.ArgErr.make("Pseudo-class name must start with ':'");
    }
    ;
    let key = sys.Str.plus(sys.Str.plus(sys.Str.plus("", name), "/"), css);
    let cls = Style.pseudoCache().get(key);
    if (cls == null) {
      (cls = sys.Str.plus("dom-style-autogen-", sys.ObjUtil.coerce(Style.counter().getAndIncrement(), sys.Obj.type$.toNullable())));
      Win.cur().doc().head().add(sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make("style"), (it) => {
        it.trap("type", sys.List.make(sys.Obj.type$.toNullable(), ["text/css"]));
        it.text(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(".", cls), ""), name), " { "), css), " }"));
        return;
      }), Elem.type$));
      Style.pseudoCache().set(key, sys.ObjUtil.coerce(cls, sys.Str.type$));
    }
    ;
    this.addClass(sys.ObjUtil.coerce(cls, sys.Str.type$));
    return sys.ObjUtil.coerce(cls, sys.Str.type$);
  }

  clear() {
    return this.peer.clear(this);
  }

  computed(name) {
    return this.peer.computed(this,name);
  }

  effective(name) {
    return this.peer.effective(this,name);
  }

  get(name) {
    return this.peer.get(this,name);
  }

  set(name,val) {
    const this$ = this;
    if (val == null) {
      this.setProp(name, null);
      return this;
    }
    ;
    let sval = "";
    let $_u2 = ((this$) => { let $_u3 = val; if ($_u3 == null) return null; return sys.ObjUtil.typeof(val); })(this);
    if (sys.ObjUtil.equals($_u2, sys.Duration.type$)) {
      (sval = sys.Str.plus(sys.Str.plus("", sys.ObjUtil.trap(val,"toMillis", sys.List.make(sys.Obj.type$.toNullable(), []))), "ms"));
    }
    else {
      (sval = sys.ObjUtil.toStr(val));
    }
    ;
    if (Style.vendor().containsKey(name)) {
      this.setProp(sys.Str.plus("-webkit-", name), sval);
      this.setProp(sys.Str.plus("-moz-", name), sval);
      this.setProp(sys.Str.plus("-ms-", name), sval);
    }
    ;
    if (Style.vendorVals().any((v) => {
      return sys.Str.startsWith(sval, v);
    })) {
      this.setProp(name, sys.Str.plus("-webkit-", sval));
      this.setProp(name, sys.Str.plus("-moz-", sval));
      this.setProp(name, sys.Str.plus("-ms-", sval));
    }
    ;
    this.setProp(name, sval);
    return this;
  }

  setAll(map) {
    const this$ = this;
    map.each((v,n) => {
      this$.set(n, v);
      return;
    });
    return this;
  }

  setCss(css) {
    const this$ = this;
    sys.Str.split(css, sys.ObjUtil.coerce(59, sys.Int.type$.toNullable())).each((s) => {
      if (sys.Str.isEmpty(s)) {
        return;
      }
      ;
      let i = sys.Str.index(s, ":");
      let n = sys.Str.trim(sys.Str.getRange(s, sys.Range.make(0, sys.ObjUtil.coerce(i, sys.Int.type$), true)));
      let v = sys.Str.trim(sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(i, sys.Int.type$), 1), -1)));
      this$.set(n, v);
      return;
    });
    return this;
  }

  trap(name,args) {
    if (args === undefined) args = null;
    (name = this.fromCamel(name));
    if ((args == null || args.isEmpty())) {
      return this.get(name);
    }
    ;
    this.set(name, args.first());
    return null;
  }

  setProp(name,val) {
    return this.peer.setProp(this,name,val);
  }

  fromCamel(s) {
    const this$ = this;
    let h = sys.StrBuf.make();
    sys.Str.each(s, (ch) => {
      if (sys.Int.isUpper(ch)) {
        h.addChar(45).addChar(sys.Int.lower(ch));
      }
      else {
        h.addChar(ch);
      }
      ;
      return;
    });
    return h.toStr();
  }

  static toVendors(names) {
    const this$ = this;
    let acc = sys.List.make(sys.Str.type$);
    names.each((n) => {
      acc.addAll(Style.toVendor(n));
      return;
    });
    return acc;
  }

  static toVendor(name) {
    if (Style.vendor().containsKey(name)) {
      let w = Win.cur();
      if (w.isWebkit()) {
        return sys.List.make(sys.Str.type$, [sys.Str.plus("-webkit-", name)]);
      }
      ;
      if (w.isFirefox()) {
        return sys.List.make(sys.Str.type$, [sys.Str.plus("-moz-", name), name]);
      }
      ;
      if (w.isIE()) {
        return sys.List.make(sys.Str.type$, [sys.Str.plus("-ms-", name), name]);
      }
      ;
    }
    ;
    return sys.List.make(sys.Str.type$, [name]);
  }

  static pseudoCache() {
    return sys.ObjUtil.coerce(sys.ObjUtil.as(Style.pseudoCacheRef().val(), sys.Unsafe.type$).val(), sys.Type.find("[sys::Str:sys::Str]"));
  }

  static static$init() {
    Style.#vendor = sys.ObjUtil.coerce(((this$) => { let $_u4 = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).setList(sys.List.make(sys.Str.type$, ["align-content", "align-items", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "animation-fill-mode", "flex", "flex-direction", "flex-wrap", "justify-content", "transform", "user-select"])), sys.Type.find("[sys::Str:sys::Str[]]")); if ($_u4 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).setList(sys.List.make(sys.Str.type$, ["align-content", "align-items", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "animation-fill-mode", "flex", "flex-direction", "flex-wrap", "justify-content", "transform", "user-select"])), sys.Type.find("[sys::Str:sys::Str[]]"))); })(this), sys.Type.find("[sys::Str:sys::Str[]]"));
    Style.#vendorVals = sys.ObjUtil.coerce(((this$) => { let $_u5 = sys.List.make(sys.Str.type$, ["linear-gradient"]); if ($_u5 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$, ["linear-gradient"])); })(this), sys.Type.find("sys::Str[]"));
    Style.#counter = concurrent.AtomicInt.make(0);
    Style.#pseudoCacheRef = concurrent.AtomicRef.make(sys.Unsafe.make(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    return;
  }

}

class StylePeer extends sys.Obj {


  constructor(self)
  {
    // set in ElemPeer.style
    super();
    this.elem  = null;
    this.style = null;
  }

  classes(self, it)
  {
    if (it === undefined)
      return sys.List.make(sys.Str.type$, this.elem.classList);
    else
      this.elem.className = it.join(" ");
  }

  hasClass(self, className)
  {
    return this.elem.classList.contains(className);
  }

  addClass(self, className)
  {
    // split for legacy support for addClass("x y z")
    const arr = className.split(" ");
    for (let i=0; i<arr.length; i++) this.elem.classList.add(arr[i]);
    return self;
  }

  removeClass(self, className)
  {
    // split for legacy support for removeClass("x y z")
    const arr = className.split(" ");
    for (let i=0; i<arr.length; i++) this.elem.classList.remove(arr[i]);
    return self;
  }

  clear(self)
  {
    this.style.cssText = "";
    return self;
  }

  computed(self, name)
  {
    if (!this.elem) return null;
    return window.getComputedStyle(this.elem).getPropertyValue(name);
  }

  effective(self, name)
  {
    if (!this.elem) return null;

    // inline style rule always wins
    let val = this.get(self, name);
    if (val != null && val != "") return val;

    // else walk sheets
    const matches = [];
    for (let i=0; i<document.styleSheets.length; i++)
    {
      // it is a security exception to introspect the rules of a
      // stylesheet that was loaded from a different domain than
      // the current document; so just silently ignore those rules

      const sheet = document.styleSheets[i];
      let rules;
      try { rules = sheet.rules || sheet.cssRules || []; }
      catch (err) { rules = []; }

      for (let r=0; r<rules.length; r++)
      {
        const rule = rules[r];
        if (this.elem.msMatchesSelector)
        {
          if (this.elem.msMatchesSelector(rule.selectorText))
            matches.push(rule);
        }
        else
        {
          // Safari 10 (at least) throws an err during matches() if it doesn't
          // understand the CSS selector; silently ignore these errs
          try
          {
            if (this.elem.matches(rule.selectorText))
              matches.push(rule);
          }
          catch (err) {}
        }
      }
    }

    // walk backwards to find last val
    for (let m=matches.length-1; m>=0; m--)
    {
      val = matches[m].style.getPropertyValue(name);
      if (val != null && val != "") return val;
    }

    return null;
  }

  get(self, name)
  {
    return this.style.getPropertyValue(name);
  }

  setProp(self, name, val)
  {
    if (val == null) this.style.removeProperty(name);
    else this.style.setProperty(name, val);
  }


  static polyfillClassList(e)
  {
    const elem = e;
    function list()
    {
      const attr = elem.getAttribute("class")
      return attr ? attr.split(" ") : [];
    }

    this.add = function(name)
    {
      const x = list();
      x.push(name);
      elem.setAttribute("class", x.join(" "));
    }

    this.remove = function(name)
    {
      const x = list();
      const i = x.indexOf(name);
      if (i >= 0)
      {
        x.splice(i, 1);
        elem.setAttribute("class", x.join(" "));
      }
    }

    this.contains = function(name)
    {
      return list().indexOf(name) >= 0;
    }
  }
}

class Svg extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Svg.type$; }

  static #ns = undefined;

  static ns() {
    if (Svg.#ns === undefined) {
      Svg.static$init();
      if (Svg.#ns === undefined) Svg.#ns = null;
    }
    return Svg.#ns;
  }

  static #nsXLink = undefined;

  static nsXLink() {
    if (Svg.#nsXLink === undefined) {
      Svg.static$init();
      if (Svg.#nsXLink === undefined) Svg.#nsXLink = null;
    }
    return Svg.#nsXLink;
  }

  static #genId = undefined;

  static genId() {
    if (Svg.#genId === undefined) {
      Svg.static$init();
      if (Svg.#genId === undefined) Svg.#genId = null;
    }
    return Svg.#genId;
  }

  static #camelMap = undefined;

  static camelMap() {
    if (Svg.#camelMap === undefined) {
      Svg.static$init();
      if (Svg.#camelMap === undefined) Svg.#camelMap = null;
    }
    return Svg.#camelMap;
  }

  static make() {
    const $self = new Svg();
    Svg.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static elem(tagName) {
    return Elem.make(tagName, Svg.ns());
  }

  static line(x1,y1,x2,y2) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(Svg.elem("line"), (it) => {
      it.trap("x1", sys.List.make(sys.Obj.type$.toNullable(), [x1]));
      it.trap("y1", sys.List.make(sys.Obj.type$.toNullable(), [y1]));
      it.trap("x2", sys.List.make(sys.Obj.type$.toNullable(), [x2]));
      it.trap("y2", sys.List.make(sys.Obj.type$.toNullable(), [y2]));
      return;
    }), Elem.type$);
  }

  static rect(x,y,w,h) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(Svg.elem("rect"), (it) => {
      it.trap("x", sys.List.make(sys.Obj.type$.toNullable(), [x]));
      it.trap("y", sys.List.make(sys.Obj.type$.toNullable(), [y]));
      it.trap("width", sys.List.make(sys.Obj.type$.toNullable(), [w]));
      it.trap("height", sys.List.make(sys.Obj.type$.toNullable(), [h]));
      return;
    }), Elem.type$);
  }

  static text(text,x,y) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(Svg.elem("text"), (it) => {
      it.text(text);
      it.trap("x", sys.List.make(sys.Obj.type$.toNullable(), [x]));
      it.trap("y", sys.List.make(sys.Obj.type$.toNullable(), [y]));
      return;
    }), Elem.type$);
  }

  static image(href,x,y,w,h) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(Svg.elem("image"), (it) => {
      it.trap("x", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(x, sys.Obj.type$.toNullable())]));
      it.trap("y", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(y, sys.Obj.type$.toNullable())]));
      it.trap("width", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(w, sys.Obj.type$.toNullable())]));
      it.trap("height", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(h, sys.Obj.type$.toNullable())]));
      it.setAttr("href", href.encode(), Svg.nsXLink());
      return;
    }), Elem.type$);
  }

  static def(svgElem,defElem) {
    const this$ = this;
    if (sys.ObjUtil.compareNE(svgElem.tagName(), "svg")) {
      throw sys.Err.make(sys.Str.plus("Document not <svg> element: ", svgElem.tagName()));
    }
    ;
    let defsElem = svgElem.children().find((kid) => {
      return sys.ObjUtil.equals(kid.tagName(), "defs");
    });
    if (defsElem == null) {
      (defsElem = Svg.elem("defs"));
      if (svgElem.hasChildren()) {
        svgElem.insertBefore(sys.ObjUtil.coerce(defsElem, Elem.type$), sys.ObjUtil.coerce(svgElem.children().first(), Elem.type$));
      }
      else {
        svgElem.add(sys.ObjUtil.coerce(defsElem, Elem.type$));
      }
      ;
    }
    ;
    if (defElem.id() == null) {
      defElem.id(sys.Str.plus("def-", sys.Int.toHex(Svg.genId().incrementAndGet())));
    }
    ;
    if (defElem.parent() == null) {
      defsElem.add(defElem);
    }
    ;
    return sys.ObjUtil.coerce(defElem.id(), sys.Str.type$);
  }

  static defUrl(svgElem,defElem) {
    return sys.Str.plus(sys.Str.plus("url(#", Svg.def(svgElem, defElem)), ")");
  }

  static doTrap(svgElem,name,args) {
    if (args === undefined) args = null;
    const this$ = this;
    if ((args == null || args.isEmpty())) {
      return ((this$) => { let $_u6 = svgElem.attr(name); if ($_u6 == null) return null; return sys.Str.toStr(svgElem.attr(name)); })(this);
    }
    else {
      let val = args.first();
      if (sys.ObjUtil.equals(name, "text")) {
        svgElem.text(sys.ObjUtil.toStr(val));
        return null;
      }
      ;
      if (sys.ObjUtil.equals(name, "font")) {
        if (sys.ObjUtil.is(val, sys.Str.type$)) {
          (val = graphics.Font.fromStr(sys.ObjUtil.coerce(val, sys.Str.type$)));
        }
        ;
        let f = sys.ObjUtil.coerce(val, graphics.Font.type$);
        f.toProps().each((v,n) => {
          svgElem.setAttr(n, sys.Str.toStr(v));
          return;
        });
        return null;
      }
      ;
      if (Svg.camelMap().containsKey(name)) {
        (name = Svg.fromCamel(name));
      }
      ;
      svgElem.setAttr(name, sys.ObjUtil.toStr(val));
      return null;
    }
    ;
  }

  static fromCamel(s) {
    let h = sys.StrBuf.make(sys.Int.plus(sys.Str.size(s), 2));
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(s)); i = sys.Int.increment(i)) {
      let ch = sys.Str.get(s, i);
      if (sys.Int.isUpper(ch)) {
        h.addChar(45).addChar(sys.Int.lower(ch));
      }
      else {
        h.addChar(ch);
      }
      ;
    }
    ;
    return h.toStr();
  }

  static static$init() {
    Svg.#ns = sys.Uri.fromStr("http://www.w3.org/2000/svg");
    Svg.#nsXLink = sys.Uri.fromStr("http://www.w3.org/1999/xlink");
    Svg.#genId = concurrent.AtomicInt.make();
    Svg.#camelMap = sys.ObjUtil.coerce(((this$) => { let $_u7 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")).setList(sys.List.make(sys.Str.type$, ["accentHeight", "alignmentBaseline", "baselineShift", "capHeight", "clipPath", "clipRule", "colorInterpolation", "colorInterpolationFilters", "colorProfile", "colorRendering", "dominantBaseline", "enableBackground", "fillOpacity", "fillRule", "floodColor", "floodOpacity", "fontFamily", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontWeight", "glyphName", "glyphOrientationHorizontal", "glyphOrientationVertical", "horizAdvX", "horizOriginX", "imageRendering", "letterSpacing", "lightingColor", "markerEnd", "markerMid", "markerStart", "overlinePosition", "overlineThickness", "panose1", "paintOrder", "renderingIntent", "shapeRendering", "stopColor", "stopOpacity", "strikethroughPosition", "strikethroughThickness", "strokeDasharray", "strokeDashoffset", "strokeLinecap", "strokeLinejoin", "strokeMiterlimit", "strokeOpacity", "strokeWidth", "textAnchor", "textDecoration", "textRendering", "underlinePosition", "underlineThickness", "unicode", "unicodeBidi", "unicodeRange", "unitsPerEm", "vAlphabetic", "vHanging", "vIdeographic", "vMathematical", "values", "version", "vertAdvY", "vertOriginX", "vertOriginY", "wordSpacing", "xHeight"])); if ($_u7 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")).setList(sys.List.make(sys.Str.type$, ["accentHeight", "alignmentBaseline", "baselineShift", "capHeight", "clipPath", "clipRule", "colorInterpolation", "colorInterpolationFilters", "colorProfile", "colorRendering", "dominantBaseline", "enableBackground", "fillOpacity", "fillRule", "floodColor", "floodOpacity", "fontFamily", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontWeight", "glyphName", "glyphOrientationHorizontal", "glyphOrientationVertical", "horizAdvX", "horizOriginX", "imageRendering", "letterSpacing", "lightingColor", "markerEnd", "markerMid", "markerStart", "overlinePosition", "overlineThickness", "panose1", "paintOrder", "renderingIntent", "shapeRendering", "stopColor", "stopOpacity", "strikethroughPosition", "strikethroughThickness", "strokeDasharray", "strokeDashoffset", "strokeLinecap", "strokeLinejoin", "strokeMiterlimit", "strokeOpacity", "strokeWidth", "textAnchor", "textDecoration", "textRendering", "underlinePosition", "underlineThickness", "unicode", "unicodeBidi", "unicodeRange", "unitsPerEm", "vAlphabetic", "vHanging", "vIdeographic", "vMathematical", "values", "version", "vertAdvY", "vertOriginX", "vertOriginY", "wordSpacing", "xHeight"]))); })(this), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

}

class DomCoord extends sys.Obj {
  constructor() {
    super();
    this.peer = new DomCoordPeer(this);
    const this$ = this;
  }

  typeof() { return DomCoord.type$; }

  static make() {
    const $self = new DomCoord();
    DomCoord.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  lat() {
    return this.peer.lat(this);
  }

  lng() {
    return this.peer.lng(this);
  }

  accuracy() {
    return this.peer.accuracy(this);
  }

  altitude() {
    return this.peer.altitude(this);
  }

  altitudeAccuracy() {
    return this.peer.altitudeAccuracy(this);
  }

  heading() {
    return this.peer.heading(this);
  }

  speed() {
    return this.peer.speed(this);
  }

  ts() {
    return this.peer.ts(this);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("{ lat=", sys.ObjUtil.coerce(this.lat(), sys.Obj.type$.toNullable())), " lng="), sys.ObjUtil.coerce(this.lng(), sys.Obj.type$.toNullable())), " accuracy="), sys.ObjUtil.coerce(this.accuracy(), sys.Obj.type$.toNullable())), " altitude="), sys.ObjUtil.coerce(this.altitude(), sys.Obj.type$.toNullable())), sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(" altitudeAccuracy=", sys.ObjUtil.coerce(this.altitudeAccuracy(), sys.Obj.type$.toNullable())), " heading="), sys.ObjUtil.coerce(this.heading(), sys.Obj.type$.toNullable())), " speed="), sys.ObjUtil.coerce(this.speed(), sys.Obj.type$.toNullable())), " ts="), this.ts()), " }"));
  }

}

class DomCoordPeer extends sys.Obj {

  constructor(self) { super(); }

  static wrap(pos)
  {
    let x = DomCoord.make();
    x.peer.$coords = pos.coords;
    x.peer.$ts = pos.timestamp ? sys.Duration.fromStr(""+pos.timestamp+"ms") : null;
    return x;
  }

  $coords;
  $ts;

  lat(self)              { return this.$coords.latitude;  }
  lng(self)              { return this.$coords.longitude; }
  accuracy(self)         { return this.$coords.accuracy;  }
  altitude(self)         { return this.$coords.altitude; }
  altitudeAccuracy(self) { return this.$coords.altitudeAccuracy; }
  heading(self)          { return this.$coords.heading; }
  speed(self)            { return this.$coords.speed; }
  ts(self)               { return this.$ts; }
}

class DomGraphicsEnv extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#images = concurrent.ConcurrentMap.make();
    return;
  }

  typeof() { return DomGraphicsEnv.type$; }

  renderImage() { return graphics.GraphicsEnv.prototype.renderImage.apply(this, arguments); }

  #images = null;

  // private field reflection only
  __images(it) { if (it === undefined) return this.#images; else this.#images = it; }

  image(uri,data) {
    if (data === undefined) data = null;
    let image = sys.ObjUtil.as(this.#images.get(uri), DomImage.type$);
    if (image != null) {
      return sys.ObjUtil.coerce(image, graphics.Image.type$);
    }
    ;
    (image = this.loadImage(uri));
    return sys.ObjUtil.coerce(this.#images.getOrAdd(uri, sys.ObjUtil.coerce(image, sys.Obj.type$)), graphics.Image.type$);
  }

  loadImage(uri) {
    let mime = graphics.Image.mimeForExt(sys.ObjUtil.coerce(((this$) => { let $_u8 = uri.ext(); if ($_u8 != null) return $_u8; return ""; })(this), sys.Str.type$));
    let elem = Elem.make("img");
    elem.trap("src", sys.List.make(sys.Obj.type$.toNullable(), [uri.encode()]));
    return DomImage.make(uri, mime, elem);
  }

  static make() {
    const $self = new DomGraphicsEnv();
    DomGraphicsEnv.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class HttpReq extends sys.Obj {
  constructor() {
    super();
    this.peer = new HttpReqPeer(this);
    const this$ = this;
    this.#uri = sys.Uri.fromStr("#");
    this.#headers = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    this.#async = true;
    this.#resType = "";
    this.#withCredentials = false;
    return;
  }

  typeof() { return HttpReq.type$; }

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

  #headers = null;

  headers(it) {
    if (it === undefined) {
      return this.#headers;
    }
    else {
      this.#headers = it;
      return;
    }
  }

  #async = false;

  async(it) {
    if (it === undefined) {
      return this.#async;
    }
    else {
      this.#async = it;
      return;
    }
  }

  #resType = null;

  resType(it) {
    if (it === undefined) {
      return this.#resType;
    }
    else {
      this.#resType = it;
      return;
    }
  }

  #withCredentials = false;

  withCredentials(it) {
    if (it === undefined) {
      return this.#withCredentials;
    }
    else {
      this.#withCredentials = it;
      return;
    }
  }

  #cbProgress = null;

  // private field reflection only
  __cbProgress(it) { if (it === undefined) return this.#cbProgress; else this.#cbProgress = it; }

  static make(f) {
    const $self = new HttpReq();
    HttpReq.make$($self,f);
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

  onProgress(f) {
    this.#cbProgress = f;
    return;
  }

  send(method,content,c) {
    return this.peer.send(this,method,content,c);
  }

  get(c) {
    this.send("GET", null, c);
    return;
  }

  post(content,c) {
    this.send("POST", content, c);
    return;
  }

  postForm(form,c) {
    return this.peer.postForm(this,form,c);
  }

  postFormMultipart(form,c) {
    return this.peer.postFormMultipart(this,form,c);
  }

}

class HttpReqPeer extends sys.Obj {

  constructor(self) { super(); }

  send(self, method, content, f)
  {
    const xhr = new XMLHttpRequest();
    let buf;
    let view;

    // attach progress listener if configured
    if (self.__cbProgress() != null)
    {
      let p = xhr;
      const m = method.toUpperCase();
      if (m == "POST" || m == "PUT") p = xhr.upload
      p.addEventListener("progress", function(e) {
        if (e.lengthComputable) self.__cbProgress()(e.loaded, e.total);
      });
    }

    // open request
    xhr.open(method.toUpperCase(), self.uri().encode(), self.async());
    if (self.async())
    {
      xhr.onreadystatechange = function ()
      {
        if (xhr.readyState == 4)
          f(HttpReqPeer.makeRes(xhr));
      }
    }

    // set response type
    xhr.responseType = self.resType();

    // setup headers
    let ct = false;
    const k = self.headers().keys();
    for (let i=0; i<k.size(); i++)
    {
      const key = k.get(i);
      if (sys.Str.lower(key) == "content-type") ct = true;
      xhr.setRequestHeader(key, self.headers().get(key));
    }
    xhr.withCredentials = self.withCredentials();

    // send request based on content type
    if (content == null)
    {
      xhr.send(null);
    }
    else if (content instanceof FormData)
    {
      // send FormData (implicity adds Content-Type header)
      xhr.send(content);
    }
    else if (sys.ObjUtil.typeof(content) === sys.Str.type$)
    {
      // send text
      if (!ct) xhr.setRequestHeader("Content-Type", "text/plain");
      xhr.send(content);
    }
    else if (content instanceof sys.Buf)
    {
      // send binary
      if (!ct) xhr.setRequestHeader("Content-Type", "application/octet-stream");
      buf = new ArrayBuffer(content.size());
      view = new Uint8Array(buf);
      view.set(content.__unsafeArray().slice(0, content.size()));
      xhr.send(view);
    }
    else if (content instanceof DomFile)
    {
      // send file as raw data
      xhr.send(content.peer.file);
    }
    else
    {
      throw sys.Err.make("Can only send Str or Buf: " + content);
    }

    // for sync requests; directly invoke response handler
    if (!self.async()) f(HttpReqPeer.makeRes(xhr));
  }

  static makeRes(xhr)
  {
    const isText = xhr.responseType == "" || xhr.responseType == "text";

    const res = HttpRes.make();
    res.__xhr = xhr;
    res.status(xhr.status);
    if (isText)
      res.content(xhr.responseText);
    else if (xhr.responseType == "arraybuffer")
      res.contentBuf(sys.MemBuf.__makeBytes(xhr.response));

    const all = xhr.getAllResponseHeaders().split("\n");
    for (let i=0; i<all.length; i++)
    {
      if (all[i].length == 0) continue;
      const j = all[i].indexOf(":");
      const k = sys.Str.trim(all[i].substring(0, j));
      const v = sys.Str.trim(all[i].substring(j+1));
      res.headers().set(k, v);
    }

    return res;
  }

  postForm(self, form, f)
  {
    // encode form content into urlencoded str
    let content = ""
    const k = form.keys();
    for (let i=0; i<k.size(); i++)
    {
      if (i > 0) content += "&";
      content += encodeURIComponent(k.get(i)) + "=" +
                 encodeURIComponent(form.get(k.get(i)));
    }
    // send POST request
    self.headers().set("Content-Type", "application/x-www-form-urlencoded");
    self.send("POST", content, f);
  }

  postFormMultipart(self, form, f)
  {
    // encode form map to FormData instance
    const data = new FormData();
    const keys = form.keys();
    for (let i=0; i<keys.size(); i++)
    {
      const k = keys.get(i);
      const v = form.get(k);
      if (v instanceof DomFile)
        data.append(k, v.peer.file, v.peer.file.name);
      else
        data.append(k, v);
    }
    // send POST request
    self.send("POST", data, f);
  }
}


class ResizeObserver extends sys.Obj {
  constructor() {
    super();
    this.peer = new ResizeObserverPeer(this);
    const this$ = this;
  }

  typeof() { return ResizeObserver.type$; }

  #callback = null;

  callback(it) {
    if (it === undefined) {
      return this.#callback;
    }
    else {
      this.#callback = it;
      return;
    }
  }

  static make() {
    const $self = new ResizeObserver();
    ResizeObserver.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  observe(target) {
    return this.peer.observe(this,target);
  }

  unobserve(target) {
    return this.peer.unobserve(this,target);
  }

  disconnect() {
    return this.peer.disconnect(this);
  }

  onResize(callback) {
    this.#callback = callback;
    return;
  }

}

class ResizeObserverPeer extends sys.Obj {

  constructor(self)
  {
    super();
    this.observer = new js.ResizeObserver(function(entries)
    {
      if (self.callback() != null)
      {
        const list = ResizeObserverPeer.$makeEntryList(entries);
        const args = sys.List.make(sys.Obj.type$, [list]);
        self.callback()(args);
      }
    });
  }

  observe(self, target)
  {
    this.observer.observe(target.peer.elem);
    return self;
  }

  unobserve(self, target)
  {
    this.observer.unobserve(target.peer.elem);
    return self;
  }

  disconnect(self)
  {
    this.observer.disconnect();
  }

  static $makeEntryList(entries)
  {
    const list = new Array();
    for (let i=0; i<entries.length; i++)
      list.push(ResizeObserverPeer.$makeEntry(entries[i]));
    return sys.List.make(ResizeObserver.type$, list);
  }

  static $makeEntry(entry)
  {
    const w   = entry.contentRect.width;
    const h   = entry.contentRect.height;
    const re  = ResizeObserverEntry.make();
    re.target (ElemPeer.wrap(entry.target));
    re.size   (graphics.Size.make(w, h));
    return re;
  }
}

class ResizeObserverEntry extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ResizeObserverEntry.type$; }

  #target = null;

  target() {
    return this.#target;
  }

  #size = null;

  size() { return this.#size; }

  __size(it) { if (it === undefined) return this.#size; else this.#size = it; }

  static make(f) {
    const $self = new ResizeObserverEntry();
    ResizeObserverEntry.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    if (f != null) {
      sys.Func.call(f, $self);
    }
    ;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("ResizeObserverEntry { target=", this.#target), " size="), this.#size), " }");
  }

}

class DataTransfer extends sys.Obj {
  constructor() {
    super();
    this.peer = new DataTransferPeer(this);
    const this$ = this;
  }

  typeof() { return DataTransfer.type$; }

  dropEffect(it) {
    if (it === undefined) return this.peer.dropEffect(this);
    this.peer.dropEffect(this, it);
  }

  effectAllowed(it) {
    if (it === undefined) return this.peer.effectAllowed(this);
    this.peer.effectAllowed(this, it);
  }

  types() {
    return this.peer.types(this);
  }

  getData(type) {
    return this.peer.getData(this,type);
  }

  setData(type,val) {
    return this.peer.setData(this,type,val);
  }

  setDragImage(image,x,y) {
    return this.peer.setDragImage(this,image,x,y);
  }

  files() {
    return this.peer.files(this);
  }

  static make() {
    const $self = new DataTransfer();
    DataTransfer.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DataTransferPeer extends sys.Obj {

  constructor(self) { super(); }

  dataTx;
  data;

  dropEffect(self, it)
  {
    if (it===undefined) return this.dataTx.dropEffect;
    else this.dataTx.dropEffect = it;
  }

  effectAllowed(self, it)
  {
    if (it===undefined) return this.dataTx.effectAllowed;
    else this.dataTx.effectAllowed = it;
  }

  types(self)
  {
    const list = sys.List.make(sys.Str.type$);
    for (let i=0; i<this.dataTx.types.length; i++) list.add(this.dataTx.types[i]);
    return list;
  }

  getData(self, type)
  {
    let val = this.dataTx.getData(type);
    if (val === "") val = this.data[type] || "";
    return val;
  }

  setData(self, type, val)
  {
    // we keep a backup of data for WebKit workaround - see EventPeer.dataTransfer
    this.data[type] = val;
    return this.dataTx.setData(type, val);
  }

  setDragImage(self, image, x, y)
  {
    this.dataTx.setDragImage(image.peer.elem, x, y);
    return self;
  }

  files(self)
  {
    if (this.dataTx.files.length == 0)
      return DomFile.type$.emptyList();

    const list = sys.List.make(DomFile.type$);
    for (let i=0; i<this.dataTx.files.length; i++)
        list.add(DomFilePeer.wrap(this.dataTx.files[i]));
    return list;
  }

  static make(dataTx)
  {
    const x = DataTransfer.make();
    x.peer.dataTx = dataTx;
    x.peer.data = {};
    return x;
  }
}

class HttpRes extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#headers = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.caseInsensitive(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"));
    this.#content = "";
    this.#contentBuf = sys.ObjUtil.coerce(sys.Buf.make(0), sys.Buf.type$);
    return;
  }

  typeof() { return HttpRes.type$; }

  #status = 0;

  status(it) {
    if (it === undefined) {
      return this.#status;
    }
    else {
      this.#status = it;
      return;
    }
  }

  #headers = null;

  headers(it) {
    if (it === undefined) {
      return this.#headers;
    }
    else {
      this.#headers = it;
      return;
    }
  }

  #content = null;

  content(it) {
    if (it === undefined) {
      return this.#content;
    }
    else {
      this.#content = it;
      return;
    }
  }

  #contentBuf = null;

  contentBuf(it) {
    if (it === undefined) {
      return this.#contentBuf;
    }
    else {
      this.#contentBuf = it;
      return;
    }
  }

  static make() {
    const $self = new HttpRes();
    HttpRes.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class Doc extends sys.Obj {
  constructor() {
    super();
    this.peer = new DocPeer(this);
    const this$ = this;
  }

  typeof() { return Doc.type$; }

  title(it) {
    if (it === undefined) return this.peer.title(this);
    this.peer.title(this, it);
  }

  static make() {
    const $self = new Doc();
    Doc.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  head() {
    return this.peer.head(this);
  }

  body() {
    return this.peer.body(this);
  }

  activeElem() {
    return this.peer.activeElem(this);
  }

  elemById(id) {
    return this.peer.elemById(this,id);
  }

  elemFromPos(p) {
    return this.peer.elemFromPos(this,p);
  }

  elemsFromPos(p) {
    return this.peer.elemsFromPos(this,p);
  }

  createElem(tagName,attrib,ns) {
    if (attrib === undefined) attrib = null;
    if (ns === undefined) ns = null;
    return this.peer.createElem(this,tagName,attrib,ns);
  }

  createFrag() {
    return this.peer.createFrag(this);
  }

  querySelector(selectors) {
    return this.peer.querySelector(this,selectors);
  }

  querySelectorAll(selectors) {
    return this.peer.querySelectorAll(this,selectors);
  }

  querySelectorAllType(selectors,type) {
    return this.peer.querySelectorAllType(this,selectors,type);
  }

  exportPng(img) {
    return this.peer.exportPng(this,img);
  }

  exportJpg(img,quality) {
    return this.peer.exportJpg(this,img,quality);
  }

  onEvent(type,useCapture,handler) {
    return this.peer.onEvent(this,type,useCapture,handler);
  }

  removeEvent(type,useCapture,handler) {
    return this.peer.removeEvent(this,type,useCapture,handler);
  }

  exec(name,defUi,val) {
    if (defUi === undefined) defUi = false;
    if (val === undefined) val = null;
    return this.peer.exec(this,name,defUi,val);
  }

  out() {
    return this.peer.out(this);
  }

  cookies() {
    try {
      return sys.MimeType.parseParams(this.getCookiesStr()).ro();
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

  addCookie(c) {
    return this.peer.addCookie(this,c);
  }

  getCookiesStr() {
    return this.peer.getCookiesStr(this);
  }

}

class DocPeer extends sys.Obj {

  constructor(self) { super(); }

  doc;

  title(self, it)
  {
    if (it===undefined) return this.doc.title;
    else this.doc.title = it;
  }

  head(self)
  {
    return ElemPeer.wrap(this.doc.head);
  }

  body(self)
  {
    return ElemPeer.wrap(this.doc.body);
  }

  activeElem(self)
  {
    const elem = this.doc.activeElement;
    if (elem == null) return null;
    return ElemPeer.wrap(elem);
  }

  elemById(self, id)
  {
    const elem = this.doc.getElementById(id);
    if (elem == null) return null;
    return ElemPeer.wrap(elem);
  }

  elemFromPos(self, p)
  {
    const elem = this.doc.elementFromPoint(p.x(), p.y());
    if (elem == null) return null;
    return ElemPeer.wrap(elem);
  }

  elemsFromPos(self, p)
  {
    const list  = sys.List.make(Elem.type$);
    const elems = this.doc.elementsFromPoint(p.x(), p.y());
    for (let i=0; i<elems.length; i++)
      list.add(ElemPeer.wrap(elems[i]));
    return list;
  }

  createElem(self, tagName, attribs, ns)
  {
    const elem = ns
      ? this.doc.createElementNS(ns.toStr, tagName)
      : this.doc.createElement(tagName);
    const wrap = ElemPeer.wrap(elem);
    if (attribs != null)
    {
      const k = attribs.keys();
      for (let i=0; i<k.size(); i++)
        wrap.set(k.get(i), attribs.get(k.get(i)));
    }
    return wrap;
  }

  createFrag(self)
  {
    const frag = this.doc.createDocumentFragment();
    return ElemPeer.wrap(frag);
  }

  querySelector(self, selectors)
  {
    const elem = this.doc.querySelector(selectors);
    if (elem == null) return null;
    return ElemPeer.wrap(elem);
  }

  querySelectorAll(self, selectors)
  {
    const list  = sys.List.make(Elem.type$);
    const elems = this.doc.querySelectorAll(selectors);
    for (let i=0; i<elems.length; i++)
      list.add(ElemPeer.wrap(elems[i]));
    return list;
  }

  querySelectorAllType(self, selectors, type)
  {
    const list  = sys.List.make(Elem.type$);
    const elems = this.doc.querySelectorAll(selectors);
    for (let i=0; i<elems.length; i++)
      list.add(ElemPeer.wrap(elems[i], type.make()));
    return list;
  }

  exportPng(self, img)
  {
    return this.#export(img, "image/png");
  }

  exportJpg(self, img, quality)
  {
    return this.#export(img, "image/jpeg", quality);
  }

  #export(img, mimeType, quality)
  {
    const elem = img.peer.elem;

    // set phy canvas size to img
    const canvas = this.doc.createElement("canvas");
    canvas.style.width  = elem.width  + "px";
    canvas.style.height = elem.height + "px";

    // scale up working space if retina
    const ratio   = window.devicePixelRatio || 1;
    canvas.width  = ratio * elem.width;
    canvas.height = ratio * elem.height;

    // render with scale factor
    const cx = canvas.getContext("2d");
    cx.scale(ratio, ratio);
    cx.drawImage(elem, 0, 0);
    return canvas.toDataURL(mimeType, quality);
  }

  onEvent(self, type, useCapture, handler)
  {
    handler.$func = function(e) { handler(EventPeer.make(e)); }
    this.doc.addEventListener(type, handler.$func, useCapture);
    return handler;
  }

  removeEvent(self, type, useCapture, handler)
  {
    if (handler.$func)
      this.doc.removeEventListener(type, handler.$func, useCapture);
  }

  exec(self, name, defUi, val)
  {
    return this.doc.execCommand(name, defUi, val);
  }

  out(self)
  {
    return web.WebOutStream.make(new DocOutStream(this.doc));
  }

  getCookiesStr(self) { return this.doc.cookie; }

  addCookie(self,c)
  {
    // always force HttpOnly otherwise this is a no-op for browsers
    c.__httpOnly(false)
    this.doc.cookie = c.toStr();
  }
}



class DocOutStream extends sys.OutStream {

  constructor(doc)
  {
    super();
    this.#doc = doc;
  }

  #doc;

  w(v)
  {
    throw sys.UnsupportedErr.make("binary write on Doc output");
  }

  write(x)
  {
    throw sys.UnsupportedErr.make("binary write on Doc output");
  }

  writeBuf(buf, n)
  {
    throw sys.UnsupportedErr.make("binary write on Doc output");
  }

  writeI2(x)
  {
    throw sys.UnsupportedErr.make("binary write on Doc output");
  }

  writeI4(x)
  {
    throw sys.UnsupportedErr.make("binary write on Doc output");
  }

  writeI8(x)
  {
    throw sys.UnsupportedErr.make("binary write on Doc output");
  }

  writeF4(x)
  {
    throw sys.UnsupportedErr.make("binary write on Doc output");
  }

  writeF8(x)
  {
    throw sys.UnsupportedErr.make("binary write on Doc output");
  }

  writeUtf(x)
  {
    throw sys.UnsupportedErr.make("modified UTF-8 format write on StrBuf output");
  }

  writeChar(c)
  {
    this.#doc.write(String.fromCharCode(c));
  }

  writeChars(s, off, len)
  {
    if (off === undefined) off = 0;
    if (len === undefined) len = s.length-off;
    this.#doc.write(s.slice(off, off+len));
    return this;
  }

  flush() { return this; }

  close()
  {
    this.#doc.close();
    return true;
  }
}

class Key extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Key.type$; }

  static #a = undefined;

  static a() {
    if (Key.#a === undefined) {
      Key.static$init();
      if (Key.#a === undefined) Key.#a = null;
    }
    return Key.#a;
  }

  static #b = undefined;

  static b() {
    if (Key.#b === undefined) {
      Key.static$init();
      if (Key.#b === undefined) Key.#b = null;
    }
    return Key.#b;
  }

  static #c = undefined;

  static c() {
    if (Key.#c === undefined) {
      Key.static$init();
      if (Key.#c === undefined) Key.#c = null;
    }
    return Key.#c;
  }

  static #d = undefined;

  static d() {
    if (Key.#d === undefined) {
      Key.static$init();
      if (Key.#d === undefined) Key.#d = null;
    }
    return Key.#d;
  }

  static #e = undefined;

  static e() {
    if (Key.#e === undefined) {
      Key.static$init();
      if (Key.#e === undefined) Key.#e = null;
    }
    return Key.#e;
  }

  static #f = undefined;

  static f() {
    if (Key.#f === undefined) {
      Key.static$init();
      if (Key.#f === undefined) Key.#f = null;
    }
    return Key.#f;
  }

  static #g = undefined;

  static g() {
    if (Key.#g === undefined) {
      Key.static$init();
      if (Key.#g === undefined) Key.#g = null;
    }
    return Key.#g;
  }

  static #h = undefined;

  static h() {
    if (Key.#h === undefined) {
      Key.static$init();
      if (Key.#h === undefined) Key.#h = null;
    }
    return Key.#h;
  }

  static #i = undefined;

  static i() {
    if (Key.#i === undefined) {
      Key.static$init();
      if (Key.#i === undefined) Key.#i = null;
    }
    return Key.#i;
  }

  static #j = undefined;

  static j() {
    if (Key.#j === undefined) {
      Key.static$init();
      if (Key.#j === undefined) Key.#j = null;
    }
    return Key.#j;
  }

  static #k = undefined;

  static k() {
    if (Key.#k === undefined) {
      Key.static$init();
      if (Key.#k === undefined) Key.#k = null;
    }
    return Key.#k;
  }

  static #l = undefined;

  static l() {
    if (Key.#l === undefined) {
      Key.static$init();
      if (Key.#l === undefined) Key.#l = null;
    }
    return Key.#l;
  }

  static #m = undefined;

  static m() {
    if (Key.#m === undefined) {
      Key.static$init();
      if (Key.#m === undefined) Key.#m = null;
    }
    return Key.#m;
  }

  static #n = undefined;

  static n() {
    if (Key.#n === undefined) {
      Key.static$init();
      if (Key.#n === undefined) Key.#n = null;
    }
    return Key.#n;
  }

  static #o = undefined;

  static o() {
    if (Key.#o === undefined) {
      Key.static$init();
      if (Key.#o === undefined) Key.#o = null;
    }
    return Key.#o;
  }

  static #p = undefined;

  static p() {
    if (Key.#p === undefined) {
      Key.static$init();
      if (Key.#p === undefined) Key.#p = null;
    }
    return Key.#p;
  }

  static #q = undefined;

  static q() {
    if (Key.#q === undefined) {
      Key.static$init();
      if (Key.#q === undefined) Key.#q = null;
    }
    return Key.#q;
  }

  static #r = undefined;

  static r() {
    if (Key.#r === undefined) {
      Key.static$init();
      if (Key.#r === undefined) Key.#r = null;
    }
    return Key.#r;
  }

  static #s = undefined;

  static s() {
    if (Key.#s === undefined) {
      Key.static$init();
      if (Key.#s === undefined) Key.#s = null;
    }
    return Key.#s;
  }

  static #t = undefined;

  static t() {
    if (Key.#t === undefined) {
      Key.static$init();
      if (Key.#t === undefined) Key.#t = null;
    }
    return Key.#t;
  }

  static #u = undefined;

  static u() {
    if (Key.#u === undefined) {
      Key.static$init();
      if (Key.#u === undefined) Key.#u = null;
    }
    return Key.#u;
  }

  static #v = undefined;

  static v() {
    if (Key.#v === undefined) {
      Key.static$init();
      if (Key.#v === undefined) Key.#v = null;
    }
    return Key.#v;
  }

  static #w = undefined;

  static w() {
    if (Key.#w === undefined) {
      Key.static$init();
      if (Key.#w === undefined) Key.#w = null;
    }
    return Key.#w;
  }

  static #x = undefined;

  static x() {
    if (Key.#x === undefined) {
      Key.static$init();
      if (Key.#x === undefined) Key.#x = null;
    }
    return Key.#x;
  }

  static #y = undefined;

  static y() {
    if (Key.#y === undefined) {
      Key.static$init();
      if (Key.#y === undefined) Key.#y = null;
    }
    return Key.#y;
  }

  static #z = undefined;

  static z() {
    if (Key.#z === undefined) {
      Key.static$init();
      if (Key.#z === undefined) Key.#z = null;
    }
    return Key.#z;
  }

  static #num0 = undefined;

  static num0() {
    if (Key.#num0 === undefined) {
      Key.static$init();
      if (Key.#num0 === undefined) Key.#num0 = null;
    }
    return Key.#num0;
  }

  static #num1 = undefined;

  static num1() {
    if (Key.#num1 === undefined) {
      Key.static$init();
      if (Key.#num1 === undefined) Key.#num1 = null;
    }
    return Key.#num1;
  }

  static #num2 = undefined;

  static num2() {
    if (Key.#num2 === undefined) {
      Key.static$init();
      if (Key.#num2 === undefined) Key.#num2 = null;
    }
    return Key.#num2;
  }

  static #num3 = undefined;

  static num3() {
    if (Key.#num3 === undefined) {
      Key.static$init();
      if (Key.#num3 === undefined) Key.#num3 = null;
    }
    return Key.#num3;
  }

  static #num4 = undefined;

  static num4() {
    if (Key.#num4 === undefined) {
      Key.static$init();
      if (Key.#num4 === undefined) Key.#num4 = null;
    }
    return Key.#num4;
  }

  static #num5 = undefined;

  static num5() {
    if (Key.#num5 === undefined) {
      Key.static$init();
      if (Key.#num5 === undefined) Key.#num5 = null;
    }
    return Key.#num5;
  }

  static #num6 = undefined;

  static num6() {
    if (Key.#num6 === undefined) {
      Key.static$init();
      if (Key.#num6 === undefined) Key.#num6 = null;
    }
    return Key.#num6;
  }

  static #num7 = undefined;

  static num7() {
    if (Key.#num7 === undefined) {
      Key.static$init();
      if (Key.#num7 === undefined) Key.#num7 = null;
    }
    return Key.#num7;
  }

  static #num8 = undefined;

  static num8() {
    if (Key.#num8 === undefined) {
      Key.static$init();
      if (Key.#num8 === undefined) Key.#num8 = null;
    }
    return Key.#num8;
  }

  static #num9 = undefined;

  static num9() {
    if (Key.#num9 === undefined) {
      Key.static$init();
      if (Key.#num9 === undefined) Key.#num9 = null;
    }
    return Key.#num9;
  }

  static #space = undefined;

  static space() {
    if (Key.#space === undefined) {
      Key.static$init();
      if (Key.#space === undefined) Key.#space = null;
    }
    return Key.#space;
  }

  static #backspace = undefined;

  static backspace() {
    if (Key.#backspace === undefined) {
      Key.static$init();
      if (Key.#backspace === undefined) Key.#backspace = null;
    }
    return Key.#backspace;
  }

  static #enter = undefined;

  static enter() {
    if (Key.#enter === undefined) {
      Key.static$init();
      if (Key.#enter === undefined) Key.#enter = null;
    }
    return Key.#enter;
  }

  static #delete = undefined;

  static delete() {
    if (Key.#delete === undefined) {
      Key.static$init();
      if (Key.#delete === undefined) Key.#delete = null;
    }
    return Key.#delete;
  }

  static #esc = undefined;

  static esc() {
    if (Key.#esc === undefined) {
      Key.static$init();
      if (Key.#esc === undefined) Key.#esc = null;
    }
    return Key.#esc;
  }

  static #tab = undefined;

  static tab() {
    if (Key.#tab === undefined) {
      Key.static$init();
      if (Key.#tab === undefined) Key.#tab = null;
    }
    return Key.#tab;
  }

  static #capsLock = undefined;

  static capsLock() {
    if (Key.#capsLock === undefined) {
      Key.static$init();
      if (Key.#capsLock === undefined) Key.#capsLock = null;
    }
    return Key.#capsLock;
  }

  static #semicolon = undefined;

  static semicolon() {
    if (Key.#semicolon === undefined) {
      Key.static$init();
      if (Key.#semicolon === undefined) Key.#semicolon = null;
    }
    return Key.#semicolon;
  }

  static #equal = undefined;

  static equal() {
    if (Key.#equal === undefined) {
      Key.static$init();
      if (Key.#equal === undefined) Key.#equal = null;
    }
    return Key.#equal;
  }

  static #comma = undefined;

  static comma() {
    if (Key.#comma === undefined) {
      Key.static$init();
      if (Key.#comma === undefined) Key.#comma = null;
    }
    return Key.#comma;
  }

  static #dash = undefined;

  static dash() {
    if (Key.#dash === undefined) {
      Key.static$init();
      if (Key.#dash === undefined) Key.#dash = null;
    }
    return Key.#dash;
  }

  static #period = undefined;

  static period() {
    if (Key.#period === undefined) {
      Key.static$init();
      if (Key.#period === undefined) Key.#period = null;
    }
    return Key.#period;
  }

  static #slash = undefined;

  static slash() {
    if (Key.#slash === undefined) {
      Key.static$init();
      if (Key.#slash === undefined) Key.#slash = null;
    }
    return Key.#slash;
  }

  static #backtick = undefined;

  static backtick() {
    if (Key.#backtick === undefined) {
      Key.static$init();
      if (Key.#backtick === undefined) Key.#backtick = null;
    }
    return Key.#backtick;
  }

  static #openBracket = undefined;

  static openBracket() {
    if (Key.#openBracket === undefined) {
      Key.static$init();
      if (Key.#openBracket === undefined) Key.#openBracket = null;
    }
    return Key.#openBracket;
  }

  static #backSlash = undefined;

  static backSlash() {
    if (Key.#backSlash === undefined) {
      Key.static$init();
      if (Key.#backSlash === undefined) Key.#backSlash = null;
    }
    return Key.#backSlash;
  }

  static #closeBracket = undefined;

  static closeBracket() {
    if (Key.#closeBracket === undefined) {
      Key.static$init();
      if (Key.#closeBracket === undefined) Key.#closeBracket = null;
    }
    return Key.#closeBracket;
  }

  static #quote = undefined;

  static quote() {
    if (Key.#quote === undefined) {
      Key.static$init();
      if (Key.#quote === undefined) Key.#quote = null;
    }
    return Key.#quote;
  }

  static #left = undefined;

  static left() {
    if (Key.#left === undefined) {
      Key.static$init();
      if (Key.#left === undefined) Key.#left = null;
    }
    return Key.#left;
  }

  static #up = undefined;

  static up() {
    if (Key.#up === undefined) {
      Key.static$init();
      if (Key.#up === undefined) Key.#up = null;
    }
    return Key.#up;
  }

  static #right = undefined;

  static right() {
    if (Key.#right === undefined) {
      Key.static$init();
      if (Key.#right === undefined) Key.#right = null;
    }
    return Key.#right;
  }

  static #down = undefined;

  static down() {
    if (Key.#down === undefined) {
      Key.static$init();
      if (Key.#down === undefined) Key.#down = null;
    }
    return Key.#down;
  }

  static #pageUp = undefined;

  static pageUp() {
    if (Key.#pageUp === undefined) {
      Key.static$init();
      if (Key.#pageUp === undefined) Key.#pageUp = null;
    }
    return Key.#pageUp;
  }

  static #pageDown = undefined;

  static pageDown() {
    if (Key.#pageDown === undefined) {
      Key.static$init();
      if (Key.#pageDown === undefined) Key.#pageDown = null;
    }
    return Key.#pageDown;
  }

  static #home = undefined;

  static home() {
    if (Key.#home === undefined) {
      Key.static$init();
      if (Key.#home === undefined) Key.#home = null;
    }
    return Key.#home;
  }

  static #end = undefined;

  static end() {
    if (Key.#end === undefined) {
      Key.static$init();
      if (Key.#end === undefined) Key.#end = null;
    }
    return Key.#end;
  }

  static #insert = undefined;

  static insert() {
    if (Key.#insert === undefined) {
      Key.static$init();
      if (Key.#insert === undefined) Key.#insert = null;
    }
    return Key.#insert;
  }

  static #f1 = undefined;

  static f1() {
    if (Key.#f1 === undefined) {
      Key.static$init();
      if (Key.#f1 === undefined) Key.#f1 = null;
    }
    return Key.#f1;
  }

  static #f2 = undefined;

  static f2() {
    if (Key.#f2 === undefined) {
      Key.static$init();
      if (Key.#f2 === undefined) Key.#f2 = null;
    }
    return Key.#f2;
  }

  static #f3 = undefined;

  static f3() {
    if (Key.#f3 === undefined) {
      Key.static$init();
      if (Key.#f3 === undefined) Key.#f3 = null;
    }
    return Key.#f3;
  }

  static #f4 = undefined;

  static f4() {
    if (Key.#f4 === undefined) {
      Key.static$init();
      if (Key.#f4 === undefined) Key.#f4 = null;
    }
    return Key.#f4;
  }

  static #f5 = undefined;

  static f5() {
    if (Key.#f5 === undefined) {
      Key.static$init();
      if (Key.#f5 === undefined) Key.#f5 = null;
    }
    return Key.#f5;
  }

  static #f6 = undefined;

  static f6() {
    if (Key.#f6 === undefined) {
      Key.static$init();
      if (Key.#f6 === undefined) Key.#f6 = null;
    }
    return Key.#f6;
  }

  static #f7 = undefined;

  static f7() {
    if (Key.#f7 === undefined) {
      Key.static$init();
      if (Key.#f7 === undefined) Key.#f7 = null;
    }
    return Key.#f7;
  }

  static #f8 = undefined;

  static f8() {
    if (Key.#f8 === undefined) {
      Key.static$init();
      if (Key.#f8 === undefined) Key.#f8 = null;
    }
    return Key.#f8;
  }

  static #f9 = undefined;

  static f9() {
    if (Key.#f9 === undefined) {
      Key.static$init();
      if (Key.#f9 === undefined) Key.#f9 = null;
    }
    return Key.#f9;
  }

  static #f10 = undefined;

  static f10() {
    if (Key.#f10 === undefined) {
      Key.static$init();
      if (Key.#f10 === undefined) Key.#f10 = null;
    }
    return Key.#f10;
  }

  static #alt = undefined;

  static alt() {
    if (Key.#alt === undefined) {
      Key.static$init();
      if (Key.#alt === undefined) Key.#alt = null;
    }
    return Key.#alt;
  }

  static #shift = undefined;

  static shift() {
    if (Key.#shift === undefined) {
      Key.static$init();
      if (Key.#shift === undefined) Key.#shift = null;
    }
    return Key.#shift;
  }

  static #ctrl = undefined;

  static ctrl() {
    if (Key.#ctrl === undefined) {
      Key.static$init();
      if (Key.#ctrl === undefined) Key.#ctrl = null;
    }
    return Key.#ctrl;
  }

  static #meta = undefined;

  static meta() {
    if (Key.#meta === undefined) {
      Key.static$init();
      if (Key.#meta === undefined) Key.#meta = null;
    }
    return Key.#meta;
  }

  static #byCode = undefined;

  static byCode() {
    if (Key.#byCode === undefined) {
      Key.static$init();
      if (Key.#byCode === undefined) Key.#byCode = null;
    }
    return Key.#byCode;
  }

  static #byName = undefined;

  static byName() {
    if (Key.#byName === undefined) {
      Key.static$init();
      if (Key.#byName === undefined) Key.#byName = null;
    }
    return Key.#byName;
  }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #code = 0;

  code() { return this.#code; }

  __code(it) { if (it === undefined) return this.#code; else this.#code = it; }

  #symbol = null;

  symbol() { return this.#symbol; }

  __symbol(it) { if (it === undefined) return this.#symbol; else this.#symbol = it; }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    try {
      let key = Key.byName().get(s);
      if (key != null) {
        return key;
      }
      ;
    }
    catch ($_u10) {
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(sys.Str.plus("Invalid Key: ", s));
    }
    ;
    return null;
  }

  static fromCode(code) {
    return sys.ObjUtil.coerce(((this$) => { let $_u11 = Key.byCode().get(sys.ObjUtil.coerce(code, sys.Obj.type$.toNullable())); if ($_u11 != null) return $_u11; return Key.make(code, sys.Str.plus("0x", sys.Int.toHex(code))); })(this), Key.type$);
  }

  static make(code,name,symbol) {
    const $self = new Key();
    Key.make$($self,code,name,symbol);
    return $self;
  }

  static make$($self,code,name,symbol) {
    if (symbol === undefined) symbol = null;
    $self.#code = code;
    $self.#name = name;
    $self.#symbol = symbol;
    return;
  }

  hash() {
    return sys.Str.hash(this.#name);
  }

  equals(that) {
    let x = sys.ObjUtil.as(that, Key.type$);
    if (x == null) {
      return false;
    }
    ;
    return sys.ObjUtil.equals(this.#name, x.#name);
  }

  toStr() {
    return this.#name;
  }

  isModifier() {
    return (sys.ObjUtil.equals(this, Key.alt()) || sys.ObjUtil.equals(this, Key.shift()) || sys.ObjUtil.equals(this, Key.ctrl()) || sys.ObjUtil.equals(this, Key.meta()));
  }

  static static$init() {
    const this$ = this;
    Key.#a = Key.make(65, "A");
    Key.#b = Key.make(66, "B");
    Key.#c = Key.make(67, "C");
    Key.#d = Key.make(68, "D");
    Key.#e = Key.make(69, "E");
    Key.#f = Key.make(70, "F");
    Key.#g = Key.make(71, "G");
    Key.#h = Key.make(72, "H");
    Key.#i = Key.make(73, "I");
    Key.#j = Key.make(74, "J");
    Key.#k = Key.make(75, "K");
    Key.#l = Key.make(76, "L");
    Key.#m = Key.make(77, "M");
    Key.#n = Key.make(78, "N");
    Key.#o = Key.make(79, "O");
    Key.#p = Key.make(80, "P");
    Key.#q = Key.make(81, "Q");
    Key.#r = Key.make(82, "R");
    Key.#s = Key.make(83, "S");
    Key.#t = Key.make(84, "T");
    Key.#u = Key.make(85, "U");
    Key.#v = Key.make(86, "V");
    Key.#w = Key.make(87, "W");
    Key.#x = Key.make(88, "X");
    Key.#y = Key.make(89, "Y");
    Key.#z = Key.make(90, "Z");
    Key.#num0 = Key.make(48, "0");
    Key.#num1 = Key.make(49, "1");
    Key.#num2 = Key.make(50, "2");
    Key.#num3 = Key.make(51, "3");
    Key.#num4 = Key.make(52, "4");
    Key.#num5 = Key.make(53, "5");
    Key.#num6 = Key.make(54, "6");
    Key.#num7 = Key.make(55, "7");
    Key.#num8 = Key.make(56, "8");
    Key.#num9 = Key.make(57, "9");
    Key.#space = Key.make(32, "Space");
    Key.#backspace = Key.make(8, "Backspace");
    Key.#enter = Key.make(13, "Enter");
    Key.#delete = Key.make(46, "Del");
    Key.#esc = Key.make(27, "Esc");
    Key.#tab = Key.make(9, "Tab");
    Key.#capsLock = Key.make(20, "CapsLock");
    Key.#semicolon = Key.make(186, "Semicolon", ";");
    Key.#equal = Key.make(187, "Equal", "=");
    Key.#comma = Key.make(188, "Comma", ",");
    Key.#dash = Key.make(189, "Dash", "-");
    Key.#period = Key.make(190, "Period", ".");
    Key.#slash = Key.make(191, "Slash", "/");
    Key.#backtick = Key.make(192, "Backtick", "`");
    Key.#openBracket = Key.make(219, "OpenBracket", "[");
    Key.#backSlash = Key.make(220, "BackSlash", "\\");
    Key.#closeBracket = Key.make(221, "CloseBracket", "]");
    Key.#quote = Key.make(222, "Quote", "\"");
    Key.#left = Key.make(37, "Left", "\u2190");
    Key.#up = Key.make(38, "Up", "\u2191");
    Key.#right = Key.make(39, "Right", "\u2192");
    Key.#down = Key.make(40, "Down", "\u2193");
    Key.#pageUp = Key.make(33, "PageUp");
    Key.#pageDown = Key.make(34, "PageDown");
    Key.#home = Key.make(36, "Home");
    Key.#end = Key.make(35, "End");
    Key.#insert = Key.make(45, "Insert");
    Key.#f1 = Key.make(112, "F1");
    Key.#f2 = Key.make(113, "F2");
    Key.#f3 = Key.make(114, "F3");
    Key.#f4 = Key.make(115, "F4");
    Key.#f5 = Key.make(116, "F5");
    Key.#f6 = Key.make(117, "F6");
    Key.#f7 = Key.make(118, "F7");
    Key.#f8 = Key.make(119, "F8");
    Key.#f9 = Key.make(120, "F9");
    Key.#f10 = Key.make(121, "F10");
    Key.#alt = Key.make(18, "Alt");
    Key.#shift = Key.make(16, "Shift");
    Key.#ctrl = Key.make(17, "Ctrl");
    Key.#meta = Key.make(91, "Meta");
    if (true) {
      let c = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("dom::Key"));
      let n = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("dom::Key"));
      Key.type$.fields().each((f) => {
        if ((f.isStatic() && sys.ObjUtil.equals(f.type(), Key.type$))) {
          let key = sys.ObjUtil.coerce(f.get(null), Key.type$);
          c.add(sys.ObjUtil.coerce(key.#code, sys.Obj.type$.toNullable()), key);
          n.add(key.#name, key);
          if (key.#symbol != null) {
            n.add(sys.ObjUtil.coerce(key.#symbol, sys.Str.type$), key);
          }
          ;
        }
        ;
        return;
      });
      c.add(sys.ObjUtil.coerce(173, sys.Obj.type$.toNullable()), Key.#dash);
      c.add(sys.ObjUtil.coerce(61, sys.Obj.type$.toNullable()), Key.#equal);
      c.add(sys.ObjUtil.coerce(59, sys.Obj.type$.toNullable()), Key.#semicolon);
      c.add(sys.ObjUtil.coerce(224, sys.Obj.type$.toNullable()), Key.#meta);
      c.add(sys.ObjUtil.coerce(93, sys.Obj.type$.toNullable()), Key.#meta);
      Key.#byCode = sys.ObjUtil.coerce(((this$) => { let $_u12 = c; if ($_u12 == null) return null; return sys.ObjUtil.toImmutable(c); })(this), sys.Type.find("[sys::Int:dom::Key]"));
      Key.#byName = sys.ObjUtil.coerce(((this$) => { let $_u13 = n; if ($_u13 == null) return null; return sys.ObjUtil.toImmutable(n); })(this), sys.Type.find("[sys::Str:dom::Key]"));
    }
    ;
    return;
  }

}

class DomFile extends sys.Obj {
  constructor() {
    super();
    this.peer = new DomFilePeer(this);
    const this$ = this;
  }

  typeof() { return DomFile.type$; }

  name() {
    return this.peer.name(this);
  }

  ext() {
    let n = this.name();
    let i = sys.Str.indexr(n, ".");
    return ((this$) => { if (i == null) return null; return sys.Str.getRange(n, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(i, sys.Int.type$), 1), -1)); })(this);
  }

  size() {
    return this.peer.size(this);
  }

  type() {
    return this.peer.type(this);
  }

  readAsDataUri(f) {
    return this.peer.readAsDataUri(this,f);
  }

  readAsText(f) {
    return this.peer.readAsText(this,f);
  }

  static make() {
    const $self = new DomFile();
    DomFile.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DomFilePeer extends sys.Obj {

  constructor(self)
  {
    super();
    this.file = null;
  }


  static wrap(file)
  {
    if (!file) throw sys.ArgErr.make("file is null")

    if (file._fanFile)
      return file._fanFile;

    const x = DomFile.make();
    x.peer.file = file;
    file._fanFile = x;
    return x;
  }

  name(self)
  {
    return this.file.name;
  }

  size(self)
  {
    return this.file.size;
  }

  type(self)
  {
    return this.file.type;
  }

  readAsDataUri(self, func)
  {
    const reader = new FileReader();
    reader.onload = function(e) {
      const uri = sys.Uri.decode(e.target.result.toString());
      func(uri);
    }
    reader.readAsDataURL(this.file);
  }

  readAsText(self, func)
  {
    const reader = new FileReader();
    reader.onload = function(e) {
      func(e.target.result);
    }
    reader.readAsText(this.file);
  }
}

class Event extends sys.Obj {
  constructor() {
    super();
    this.peer = new EventPeer(this);
    const this$ = this;
    this.#stash = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    return;
  }

  typeof() { return Event.type$; }

  #stash = null;

  stash(it) {
    if (it === undefined) {
      return this.#stash;
    }
    else {
      this.#stash = it;
      return;
    }
  }

  static make() {
    const $self = new Event();
    Event.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  static makeMock() {
    return EventPeer.makeMock();
  }

  static fromNative(event) {
    return EventPeer.fromNative(event);
  }

  toNative() {
    return this.peer.toNative(this);
  }

  type() {
    return this.peer.type(this);
  }

  target() {
    return this.peer.target(this);
  }

  relatedTarget() {
    return this.peer.relatedTarget(this);
  }

  pagePos() {
    return this.peer.pagePos(this);
  }

  alt() {
    return this.peer.alt(this);
  }

  ctrl() {
    return this.peer.ctrl(this);
  }

  shift() {
    return this.peer.shift(this);
  }

  meta() {
    return this.peer.meta(this);
  }

  button() {
    return this.peer.button(this);
  }

  delta() {
    return this.peer.delta(this);
  }

  key() {
    return this.peer.key(this);
  }

  keyChar() {
    return this.peer.keyChar(this);
  }

  err() {
    return this.peer.err(this);
  }

  stop() {
    return this.peer.stop(this);
  }

  get(name,def) {
    if (def === undefined) def = null;
    return this.peer.get(this,name,def);
  }

  set(name,val) {
    return this.peer.set(this,name,val);
  }

  trap(name,args) {
    if (args === undefined) args = null;
    if ((args == null || args.isEmpty())) {
      return this.get(name);
    }
    ;
    this.set(name, args.first());
    return null;
  }

  data() {
    return this.peer.data(this);
  }

  dataTransfer() {
    return this.peer.dataTransfer(this);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Event { type=", this.type()), " target="), this.target()), " pagePos="), this.pagePos()), " button="), sys.ObjUtil.coerce(this.button(), sys.Obj.type$.toNullable())), " delta="), this.delta()), " key="), this.key()), " alt="), ((this$) => { if (this$.alt()) return "T"; return "F"; })(this)), " ctrl="), ((this$) => { if (this$.ctrl()) return "T"; return "F"; })(this)), " shift="), ((this$) => { if (this$.shift()) return "T"; return "F"; })(this)), " meta="), ((this$) => { if (this$.meta()) return "T"; return "F"; })(this)), " }");
  }

}

class EventPeer extends sys.Obj {

  constructor(self) { super(); }

  event;
  static lastDataTx;

  static makeMock()
  {
    return EventPeer.make(new js.Event("mock"));
  }

  static fromNative(obj)
  {
    // short-circut if peer already exists
    if (obj.peer && obj.peer.event) return obj;
    return EventPeer.make(obj);
  }

  type(self) { return this.event.type; }

  toNative(self) { return this.event; }

  #target;
  target(self)
  {
    if (this.#target == null)
    {
      // 8 May 2019 - Andy Frank:
      // Firefox 66.0.5 is firing events with TEXT_NODE as targets; I'm not
      // sure if this is new behavior (or correct behavoir) -- but since the
      // Fantom DOM pod only handles ELEMENT_NODE; walk up to the parent
      let t = this.event.target;
      if (t.nodeType == 3) t = t.parentNode;
      this.#target = ElemPeer.wrap(t);
    }
    return this.#target;
  }

  #relatedTarget;
  relatedTarget(self)
  {
    if (this.#relatedTarget === undefined)
    {
      const rt = this.event.relatedTarget;
      this.#relatedTarget = rt == null ? null : ElemPeer.wrap(rt);
    }
    return this.#relatedTarget;
  }

  #pagePos;
  pagePos(self)
  {
    if (this.#pagePos == null)
      this.#pagePos = graphics.Point.makeInt(this.event.pageX || 0, this.event.pageY || 0);
    return this.#pagePos;
  }

  alt(self)   { return this.event.altKey; }
  ctrl(self)  { return this.event.ctrlKey; }
  shift(self) { return this.event.shiftKey; }
  meta (self) { return this.event.metaKey; }
  button(self) { return this.event.button; }

  $key;
  key(self) { return this.$key }

  $keyChar;
  keyChar(self) { return this.$keyChar }

  #delta;
  delta(self)
  {
    if (this.#delta == null)
    {
      this.#delta = this.event.deltaX != null && this.event.deltaY != null
        ? graphics.Point.makeInt(this.event.deltaX, this.event.deltaY)
        : graphics.Point.defVal();
    }
    return this.#delta;
  }

  #err;
  err(self)
  {
    if (this.event.error == null) return null;
    if (this.#err == null) this.#err = sys.Err.make(this.event.error);
    return this.#err;
  }

  stop(self)
  {
    this.event.preventDefault();
    this.event.stopPropagation();
    this.event.cancelBubble = true;
    this.event.returnValue = false;
  }

  get(self, name, def)
  {
    const val = this.event[name];
    if (val != null) return val;
    if (def != null) return def;
    return null;
  }

  set(self, name, val)
  {
    this.event[name] = val;
  }

  data(self)
  {
    if (this.event.data == null) return null;
    if (this.#data == null)
    {
      var data = this.event.data;
      if (data instanceof ArrayBuffer)
      {
        data = sys.MemBuf.__makeBytes(data);
      }
      this.#data = data;
    }
    return this.#data;
  }
  #data;

  dataTransfer(self)
  {
    if (!this.dataTx) this.dataTx = DataTransferPeer.make(this.event.dataTransfer);
    return this.dataTx;
  }

  static make(event)
  {
    // map native to Fan
    const x = Event.make();
    x.peer.event = event;
    if (event.keyCode) x.peer.$key = Key.fromCode(event.keyCode);
    if (event.key) x.peer.$keyChar = event.key;
    return x;
  }
}





class HttpSocket extends sys.Obj {

  constructor() { super(); }
  typeof() { return HttpSocket.type$; }

  // open
  static open(uri, protocols)
  {
    if (protocols !== undefined) protocols = protocols.__values();
    console.log("~~ " + uri + " / " + protocols);
    var x = new HttpSocket();
    x.#uri = uri;
    x.#socket = new WebSocket(uri.encode(), protocols);
    x.#socket.binaryType = "arraybuffer";
    return x;
  }

  // WebSocket instance
  #socket;

  // uri
  uri() { return this.#uri; }
  #uri;

  // send
  send(data)
  {
    if (data instanceof sys.MemBuf)
      data = new Uint8Array(data.__getBytes(0, data.size())).buffer;
    this.#socket.send(data);
  }

  // close
  close()
  {
    this.#socket.close();
  }

  // onOpen
  onOpen(cb)
  {
    this.#socket.onopen = (e) => {
      cb(EventPeer.make(e));
    }
  }

  // onReceive
  onReceive(cb)
  {
    this.#socket.onmessage = (e) => {
      cb(EventPeer.make(e));
    }
  }

  // onClose
  onClose(cb)
  {
    this.#socket.onclose = (e) => {
      cb(EventPeer.make(e));
    }
  }

  // onError
  onError(cb)
  {
    this.#socket.onerror = (e) => {
      cb(EventPeer.make(e));
    }
  }
}


class DomImage extends sys.Obj {
  constructor() {
    super();
    this.peer = new DomImagePeer(this);
    const this$ = this;
  }

  typeof() { return DomImage.type$; }

  static mimeGif() { return graphics.Image.mimeGif(); }

  write() { return graphics.Image.prototype.write.apply(this, arguments); }

  static mimeSvg() { return graphics.Image.mimeSvg(); }

  static mimePng() { return graphics.Image.mimePng(); }

  static mimeJpeg() { return graphics.Image.mimeJpeg(); }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #mime = null;

  mime() { return this.#mime; }

  __mime(it) { if (it === undefined) return this.#mime; else this.#mime = it; }

  static make(uri,mime,elem) {
    const $self = new DomImage();
    DomImage.make$($self,uri,mime,elem);
    return $self;
  }

  static make$($self,uri,mime,elem) {
    $self.#uri = uri;
    $self.#mime = mime;
    $self.init(elem);
    return;
  }

  init(elem) {
    return this.peer.init(this,elem);
  }

  isLoaded() {
    return this.peer.isLoaded(this);
  }

  size() {
    return this.peer.size(this);
  }

  w() {
    return this.peer.w(this);
  }

  h() {
    return this.peer.h(this);
  }

  get(prop) {
    return null;
  }

}

class DomImagePeer extends sys.Obj {

  constructor(self) { super(); }

  init(self, elem)
  {
    // map dom::Elem("img") to its HTMLImageElement
    this.elem = elem.peer.elem
  }

  isLoaded(self)
  {
    return this.elem.complete;
  }

  size(self)
  {
    return graphics.Size.make(this.w(), this.h());
  }

  w(self)
  {
    return sys.Float.make(this.elem.naturalWidth);
  }

  h(self)
  {
    return sys.Float.make(this.elem.naturalHeight);
  }
}

class CssDim extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CssDim.type$; }

  static #defVal = undefined;

  static defVal() {
    if (CssDim.#defVal === undefined) {
      CssDim.static$init();
      if (CssDim.#defVal === undefined) CssDim.#defVal = null;
    }
    return CssDim.#defVal;
  }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  #unit = null;

  unit() { return this.#unit; }

  __unit(it) { if (it === undefined) return this.#unit; else this.#unit = it; }

  static #autoVal = undefined;

  static autoVal() {
    if (CssDim.#autoVal === undefined) {
      CssDim.static$init();
      if (CssDim.#autoVal === undefined) CssDim.#autoVal = null;
    }
    return CssDim.#autoVal;
  }

  static make(val,unit) {
    const $self = new CssDim();
    CssDim.make$($self,val,unit);
    return $self;
  }

  static make$($self,val,unit) {
    $self.#val = val;
    $self.#unit = unit;
    return;
  }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    try {
      if (sys.ObjUtil.equals(s, "auto")) {
        return CssDim.autoVal();
      }
      ;
      let n = sys.StrBuf.make();
      let f = false;
      for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(s)); ((this$) => { let $_u19 = i;i = sys.Int.increment(i); return $_u19; })(this)) {
        let ch = sys.Str.get(s, i);
        if ((sys.ObjUtil.equals(ch, 45) || sys.Int.isDigit(ch))) {
          n.addChar(ch);
        }
        else {
          if (sys.ObjUtil.equals(ch, 46)) {
            (f = true);
            n.addChar(ch);
          }
          else {
            break;
          }
          ;
        }
        ;
      }
      ;
      let v = ((this$) => { if (f) return sys.ObjUtil.coerce(sys.Str.toFloat(n.toStr()), sys.Num.type$.toNullable()); return sys.ObjUtil.coerce(sys.Str.toInt(n.toStr()), sys.Num.type$.toNullable()); })(this);
      let u = sys.Str.getRange(s, sys.Range.make(n.size(), -1));
      if (sys.ObjUtil.equals(sys.Str.size(u), 0)) {
        throw sys.Err.make("Missing unit");
      }
      ;
      if (sys.ObjUtil.equals(sys.Str.all(u, (ch) => {
        return (sys.ObjUtil.equals(ch, 37) || sys.Int.isAlpha(ch));
      }), false)) {
        throw sys.Err.make("Invalid unit");
      }
      ;
      return CssDim.make(sys.ObjUtil.coerce(v, sys.Num.type$), u);
    }
    catch ($_u21) {
      $_u21 = sys.Err.make($_u21);
      if ($_u21 instanceof sys.Err) {
        let err = $_u21;
        ;
        if (checked) {
          throw sys.ParseErr.make(sys.Str.plus("Invalid CssDim: ", s), err);
        }
        ;
        return null;
      }
      else {
        throw $_u21;
      }
    }
    ;
  }

  hash() {
    return sys.Str.hash(this.toStr());
  }

  equals(obj) {
    let that = sys.ObjUtil.as(obj, CssDim.type$);
    if (that == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#val, that.#val) && sys.ObjUtil.equals(this.#unit, that.#unit));
  }

  toStr() {
    return ((this$) => { if (this$ === CssDim.autoVal()) return "auto"; return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.#val), ""), this$.#unit); })(this);
  }

  static static$init() {
    CssDim.#defVal = CssDim.make(sys.ObjUtil.coerce(0, sys.Num.type$), "px");
    CssDim.#autoVal = CssDim.make(sys.ObjUtil.coerce(0, sys.Num.type$), "auto");
    return;
  }

}

class WeakMap extends sys.Obj {
  constructor() {
    super();
    this.peer = new WeakMapPeer(this);
    const this$ = this;
  }

  typeof() { return WeakMap.type$; }

  has(key) {
    return this.peer.has(this,key);
  }

  get(key) {
    return this.peer.get(this,key);
  }

  set(key,val) {
    return this.peer.set(this,key,val);
  }

  delete(key) {
    return this.peer.delete(this,key);
  }

  static make() {
    const $self = new WeakMap();
    WeakMap.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class WeakMapPeer extends sys.Obj {

  constructor(self)   { super(); this.map = new js.WeakMap(); }
  has(self, key)      { return this.map.has(key); }
  get(self, key)      { return this.map.get(key); }
  set(self, key, val) { this.map.set(key, val); return self; }
  delete(self, key)   { return this.map.delete(key); }

}

class Win extends sys.Obj {
  constructor() {
    super();
    this.peer = new WinPeer(this);
    const this$ = this;
  }

  typeof() { return Win.type$; }

  #isMac = false;

  isMac() { return this.#isMac; }

  __isMac(it) { if (it === undefined) return this.#isMac; else this.#isMac = it; }

  #isWindows = false;

  isWindows() { return this.#isWindows; }

  __isWindows(it) { if (it === undefined) return this.#isWindows; else this.#isWindows = it; }

  #isLinux = false;

  isLinux() { return this.#isLinux; }

  __isLinux(it) { if (it === undefined) return this.#isLinux; else this.#isLinux = it; }

  #isWebkit = false;

  isWebkit() { return this.#isWebkit; }

  __isWebkit(it) { if (it === undefined) return this.#isWebkit; else this.#isWebkit = it; }

  #isChrome = false;

  isChrome() { return this.#isChrome; }

  __isChrome(it) { if (it === undefined) return this.#isChrome; else this.#isChrome = it; }

  #isSafari = false;

  isSafari() { return this.#isSafari; }

  __isSafari(it) { if (it === undefined) return this.#isSafari; else this.#isSafari = it; }

  #isFirefox = false;

  isFirefox() { return this.#isFirefox; }

  __isFirefox(it) { if (it === undefined) return this.#isFirefox; else this.#isFirefox = it; }

  #isIE = false;

  isIE() { return this.#isIE; }

  __isIE(it) { if (it === undefined) return this.#isIE; else this.#isIE = it; }

  #isEdge = false;

  isEdge() { return this.#isEdge; }

  __isEdge(it) { if (it === undefined) return this.#isEdge; else this.#isEdge = it; }

  static make() {
    const $self = new Win();
    Win.make$($self);
    return $self;
  }

  static make$($self) {
    let ua = $self.userAgent();
    $self.#isMac = sys.Str.contains(ua, "Mac OS X");
    $self.#isWindows = sys.Str.contains(ua, "Windows");
    $self.#isLinux = sys.Str.contains(ua, "Linux");
    $self.#isWebkit = sys.Str.contains(ua, "AppleWebKit/");
    $self.#isChrome = sys.Str.contains(ua, "Chrome/");
    $self.#isSafari = (sys.Str.contains(ua, "Safari/") && sys.Str.contains(ua, "Version/"));
    $self.#isFirefox = sys.Str.contains(ua, "Firefox/");
    $self.#isIE = (sys.Str.contains(ua, "MSIE") || sys.Str.contains(ua, "Trident/"));
    $self.#isEdge = sys.Str.contains(ua, "Edge/");
    return;
  }

  static cur() {
    return WinPeer.cur();
  }

  open(uri,winName,opts) {
    if (uri === undefined) uri = sys.Uri.fromStr("about:blank");
    if (winName === undefined) winName = null;
    if (opts === undefined) opts = null;
    return this.peer.open(this,uri,winName,opts);
  }

  close() {
    return this.peer.close(this);
  }

  doc() {
    return this.peer.doc(this);
  }

  textSel() {
    return this.peer.textSel(this);
  }

  addStyleRules(rules) {
    return this.peer.addStyleRules(this,rules);
  }

  alert(obj) {
    return this.peer.alert(this,obj);
  }

  confirm(obj) {
    return this.peer.confirm(this,obj);
  }

  viewport() {
    return this.peer.viewport(this);
  }

  screenSize() {
    return this.peer.screenSize(this);
  }

  parent() {
    return this.peer.parent(this);
  }

  top() {
    return this.peer.top(this);
  }

  static eval(js) {
    return WinPeer.eval(js);
  }

  log(obj) {
    return this.peer.log(this,obj);
  }

  scrollPos() {
    return this.peer.scrollPos(this);
  }

  scrollTo(x,y) {
    return this.peer.scrollTo(this,x,y);
  }

  scrollBy(x,y) {
    return this.peer.scrollBy(this,x,y);
  }

  uri() {
    return this.peer.uri(this);
  }

  hyperlink(uri) {
    return this.peer.hyperlink(this,uri);
  }

  reload(force) {
    if (force === undefined) force = false;
    return this.peer.reload(this,force);
  }

  clipboardReadText(f) {
    return this.peer.clipboardReadText(this,f);
  }

  clipboardWriteText(text) {
    return this.peer.clipboardWriteText(this,text);
  }

  hisBack() {
    return this.peer.hisBack(this);
  }

  hisForward() {
    return this.peer.hisForward(this);
  }

  hisPushState(title,uri,map) {
    return this.peer.hisPushState(this,title,uri,map);
  }

  hisReplaceState(title,uri,map) {
    return this.peer.hisReplaceState(this,title,uri,map);
  }

  onEvent(type,useCapture,handler) {
    return this.peer.onEvent(this,type,useCapture,handler);
  }

  removeEvent(type,useCapture,handler) {
    return this.peer.removeEvent(this,type,useCapture,handler);
  }

  reqAnimationFrame(f) {
    return this.peer.reqAnimationFrame(this,f);
  }

  setTimeout(delay,f) {
    return this.peer.setTimeout(this,delay,f);
  }

  clearTimeout(timeoutId) {
    return this.peer.clearTimeout(this,timeoutId);
  }

  setInterval(delay,f) {
    return this.peer.setInterval(this,delay,f);
  }

  clearInterval(intervalId) {
    return this.peer.clearInterval(this,intervalId);
  }

  geoCurPosition(onSuccess,onErr,opts) {
    if (onErr === undefined) onErr = null;
    if (opts === undefined) opts = null;
    return this.peer.geoCurPosition(this,onSuccess,onErr,opts);
  }

  geoWatchPosition(onSuccess,onErr,opts) {
    if (onErr === undefined) onErr = null;
    if (opts === undefined) opts = null;
    return this.peer.geoWatchPosition(this,onSuccess,onErr,opts);
  }

  geoClearWatch(id) {
    return this.peer.geoClearWatch(this,id);
  }

  sessionStorage() {
    return this.peer.sessionStorage(this);
  }

  localStorage() {
    return this.peer.localStorage(this);
  }

  userAgent() {
    return this.peer.userAgent(this);
  }

  diagnostics() {
    return this.peer.diagnostics(this);
  }

}

class WinPeer extends sys.Obj {


  constructor(self)
  {
    super();
    this.win = null;
  }

  win;

  static #cur;
  static cur()
  {
    if (!WinPeer.#cur)
    {
      WinPeer.#cur = Win.make();
      WinPeer.#cur.peer.win = globalThis;
    }
    return WinPeer.#cur;
  }

  userAgent(self)
  {
    if (globalThis.navigator === undefined) return "NodeJs";
    return globalThis.navigator.userAgent;
  }


  open(self, uri, name, opts)
  {
    if (name === undefined) name = null;
    if (opts === undefined) opts = null;

    let optStr = "";
    if (opts != null)
    {
      const keys = opts.keys();
      for (let i=0; i<keys.size(); i++)
      {
        const key = keys.get(i);
        const val = opts.get(key);
        if (optStr != null) optStr += ",";
        optStr += key + "=" + val;
      }
    }

    const w = Win.make();
    if (opts != null) w.peer.win = this.win.open(uri.encode(), name, optStr);
    if (name != null) w.peer.win = this.win.open(uri.encode(), name);
    else              w.peer.win = this.win.open(uri.encode());
    return w;
  }

  close(self)
  {
    this.win.close();
  }


  #doc;
  doc(self)
  {
    if (!this.#doc)
    {
      this.#doc = Doc.make();
      this.#doc.peer.doc = this.win.document;
    }
    return this.#doc;
  }

  #textSel;
  textSel(self)
  {
    if (!this.#textSel)
    {
      this.#textSel = TextSel.make();
      this.#textSel.peer.sel = this.win.getSelection();
    }
    return this.#textSel;
  }

  addStyleRules(self, rules)
  {
    const doc = this.win.document;
    const style = doc.createElement("style");
    style.type = "text/css";
    if (style.styleSheet) style.styleSheet.cssText = rules;
    else style.appendChild(doc.createTextNode(rules));
    doc.getElementsByTagName("head")[0].appendChild(style);
  }

  alert(self, obj)
  {
    this.win.alert(obj);
  }

  confirm(self, obj)
  {
    return this.win.confirm(obj);
  }

  viewport(self)
  {
    return (typeof this.win.innerWidth != "undefined")
      ? graphics.Size.makeInt(this.win.innerWidth, this.win.innerHeight)
      : graphics.Size.makeInt(
          this.win.document.documentElement.clientWidth,
          this.win.document.documentElement.clientHeight);
  }

  #screenSize;
  screenSize(self)
  {
    if (!this.#screenSize)
      this.#screenSize = graphics.Size.makeInt(this.win.screen.width, this.win.screen.height);
    return this.#screenSize;
  }

  #parent;
  parent(self)
  {
    if (this.win == this.win.parent) return null;
    if (!this.#parent)
    {
      this.#parent = Win.make();
      this.#parent.peer.win = this.win.parent;
    }
    return this.#parent;
  }

  #top;
  top(self)
  {
    if (this.win == this.win.top) return self;
    if (!this.#top)
    {
      this.#top = Win.make();
      this.#top.peer.win = this.win.top;
    }
    return this.#top;
  }

  static eval(js)
  {
    return eval(js);
  }

  log(self, obj)
  {
    console.log(obj);
  }


  #scrollPos;
  scrollPos(self)
  {
    const x = this.win.scrollX;
    const y = this.win.scrollY;
    if (!this.#scrollPos || this.#scrollPos.x() != x || this.#scrollPos.y() != y)
      this.#scrollPos = graphics.Point.makeInt(x, y);
    return this.#scrollPos;
  }

  scrollTo(self, x, y)
  {
    this.win.scrollTo(x, y)
  }

  scrollBy(self, x, y)
  {
    this.win.scrollBy(x, y)
  }


  uri(self)
  {
    return sys.Uri.decode(this.win.location.toString());
  }

  hyperlink(self, uri)
  {
    let href = uri.encode();
    if (uri.scheme() == "mailto")
    {
      // TODO: mailto links are not decoding + as spaces properly, so
      // not showing up correctly in email clients when subj/body are
      // specified; for now just manually convert back
      href = href.replaceAll("+", " ");
    }
    this.win.location = href;
  }

  reload(self, force)
  {
    this.win.location.reload(force);
  }


  clipboardReadText(self, func)
  {
    this.win.navigator.clipboard.readText().then((text) => func(text));
  }

  clipboardWriteText(self, text)
  {
    this.win.navigator.clipboard.writeText(text);
  }


  hisBack(self)    { this.win.history.back(); }
  hisForward(self) { this.win.history.forward(); }

  hisPushState(self, title, uri, map)
  {
    const state = WinPeer.mapToState(map);
    this.win.history.pushState(state, title, uri.encode());
  }

  hisReplaceState(self, title, uri, map)
  {
    const state = WinPeer.mapToState(map);
    this.win.history.replaceState(state, title, uri.encode());
  }

  static mapToState(map)
  {
    // TODO FIXIT: serializtaion
    const array = [];
    map.each((val,key) => { array[key] = val });
    return array;
  }


  onEvent(self, type, useCapture, handler)
  {
    handler.$func = function(e)
    {
      const evt = EventPeer.make(e);
      if (type == "popstate")
      {
        // copy state object into Event.stash
        // TODO FIXIT: deserializtaion
        const array = e.state;
        for (const key in array) evt.stash().set(key, array[key]);
      }
      handler(evt);

      if (type == "beforeunload")
      {
        const msg = evt.stash().get("beforeunloadMsg");
        if (msg != null)
        {
          e.returnValue = msg;
          return msg;
        }
      }
    }

    this.win.addEventListener(type, handler.$func, useCapture);
    return handler;
  }

  removeEvent(self, type, useCapture, handler)
  {
    if (handler.$func)
      this.win.removeEventListener(type, handler.$func, useCapture);
  }

  fakeHashChange(self, handler)
  {
    const $this = this;
    const getHash = function()
    {
      const href  = $this.win.location.href;
      const index = href.indexOf('#');
      return index == -1 ? '' : href.substr(index+1);
    }
    let oldHash = getHash();
    const checkHash = function()
    {
      const newHash = getHash();
      if (oldHash != newHash)
      {
        oldHash = newHash;
        handler(EventPeer.make(null));
      }
    }
    setInterval(checkHash, 100);
  }

  callLater(self, delay, f)
  {
    this.win.setTimeout(f, delay.toMillis());
  }

  reqAnimationFrame(self, f)
  {
    const func = function() { f(self) };
    this.win.requestAnimationFrame(func);
  }


  setTimeout(self, delay, f)
  {
    const func = function() { f(self) }
    return this.win.setTimeout(func, delay.toMillis());
  }

  clearTimeout(self, id)
  {
    this.win.clearTimeout(id);
  }

  setInterval(self, delay, f)
  {
    const func = function() { f(self) }
    return this.win.setInterval(func, delay.toMillis());
  }

  clearInterval(self, id)
  {
    this.win.clearInterval(id);
  }


  geoCurPosition(self, onSuccess, onErr, opts)
  {
    this.win.navigator.geolocation.getCurrentPosition(
      function(p) { onSuccess(DomCoordPeer.wrap(p)); },
      function(err)  { if (onErr) onErr(sys.Err.make(err.code + ": " + err.message)); },
      this.$geoOpts(opts));
  }

  geoWatchPosition(self, onSuccess, onErr, opts)
  {
    return this.win.navigator.geolocation.watchPosition(
      function(p) { onSuccess(DomCoordPeer.wrap(p)); },
      function(err)  { if (onErr) onErr(sys.Err.make(err.code + ": " + err.message)); },
      this.$geoOpts(opts));
  }

  geoClearWatch(self, id)
  {
    this.win.navigator.geolocation.clearWatch(id);
  }

  $geoOpts(fanMap)
  {
    if (!fanMap) return null;

    var opts = {};
    var keys = fanMap.keys();
    for (var i=0; i<keys.size(); i++)
    {
      var key = keys.get(i);
      var val = fanMap.get(key);
      opts[key] = val;
    }

    return opts;
  }


  sessionStorage(self)
  {
    if (this.$sessionStorage == null)
    {
      this.$sessionStorage = Storage.make();
      this.$sessionStorage.peer.$instance = this.win.sessionStorage;
    }
    return this.$sessionStorage;
  }

  localStorage(self)
  {
    if (this.$localStorage == null)
    {
      this.$localStorage = Storage.make();
      this.$localStorage.peer.$instance = this.win.localStorage;
    }
    return this.$localStorage;
  }


  diagnostics(self)
  {
    var map = sys.Map.make(sys.Str.type$, sys.Obj.type$);
    map.ordered(true);

    var dur = function(s, e) {
      return s && e ? sys.Duration.makeMillis(e-s) : null;
    }

    // user-agent
    map.set("ua", this.win.navigator.userAgent);

    // performance.timing
    var t = this.win.performance.timing;
    map.set("perf.timing.unload",         dur(t.unloadEventStart,      t.unloadEventEnd));
    map.set("perf.timing.redirect",       dur(t.redirectStart,         t.redirectEnd));
    map.set("perf.timing.domainLookup",   dur(t.domainLookupStart,     t.domainLookupEnd));
    map.set("perf.timing.connect",        dur(t.connectStart,          t.connectEnd));
    map.set("perf.timing.secureConnect",  dur(t.secureConnectionStart, t.connectEnd));
    map.set("perf.timing.request",        dur(t.requestStart,          t.responseStart));
    map.set("perf.timing.response",       dur(t.responseStart,         t.responseEnd));
    map.set("perf.timing.domInteractive", dur(t.domLoading,            t.domInteractive));
    map.set("perf.timing.domLoaded",      dur(t.domLoading,            t.domComplete));
    map.set("perf.timing.load",           dur(t.loadEventStart,        t.loadEventEnd));

    return map;
  }
}

class KeyFrames extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return KeyFrames.type$; }

  #frames = null;

  frames() { return this.#frames; }

  __frames(it) { if (it === undefined) return this.#frames; else this.#frames = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  static #id = undefined;

  static id() {
    if (KeyFrames.#id === undefined) {
      KeyFrames.static$init();
      if (KeyFrames.#id === undefined) KeyFrames.#id = null;
    }
    return KeyFrames.#id;
  }

  static make(frames) {
    const $self = new KeyFrames();
    KeyFrames.make$($self,frames);
    return $self;
  }

  static make$($self,frames) {
    const this$ = $self;
    $self.#name = sys.Str.plus("kf-", sys.ObjUtil.coerce(KeyFrames.id().getAndIncrement(), sys.Obj.type$.toNullable()));
    $self.#frames = sys.ObjUtil.coerce(((this$) => { let $_u23 = frames; if ($_u23 == null) return null; return sys.ObjUtil.toImmutable(frames); })($self), sys.Type.find("dom::KeyFrame[]"));
    let buf = sys.StrBuf.make();
    let out = buf.out();
    sys.List.make(sys.Str.type$, ["-webkit-", "-moz-", ""]).each((prefix) => {
      out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("@", prefix), "keyframes "), this$.#name), " {"));
      frames.each((f) => {
        out.print(sys.Str.plus(sys.Str.plus("  ", f.step()), " {"));
        f.props().each((val,name) => {
          let names = Style.toVendor(name);
          names.each((n) => {
            out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(" ", n), ":"), val), ";"));
            return;
          });
          return;
        });
        out.printLine(" }");
        return;
      });
      out.printLine("}");
      return;
    });
    Win.cur().addStyleRules(buf.toStr());
    return;
  }

  toStr() {
    const this$ = this;
    let buf = sys.StrBuf.make();
    let out = buf.out();
    out.printLine(sys.Str.plus(sys.Str.plus("@keyframes ", this.#name), " {"));
    this.#frames.each((f) => {
      out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", f.step()), " "), f.props()));
      return;
    });
    out.printLine("}");
    return buf.toStr();
  }

  static static$init() {
    KeyFrames.#id = concurrent.AtomicInt.make(0);
    return;
  }

}

class KeyFrame extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return KeyFrame.type$; }

  #step = null;

  step() { return this.#step; }

  __step(it) { if (it === undefined) return this.#step; else this.#step = it; }

  #props = null;

  props() { return this.#props; }

  __props(it) { if (it === undefined) return this.#props; else this.#props = it; }

  static make(step,props) {
    const $self = new KeyFrame();
    KeyFrame.make$($self,step,props);
    return $self;
  }

  static make$($self,step,props) {
    $self.#step = step;
    $self.#props = sys.ObjUtil.coerce(((this$) => { let $_u24 = props; if ($_u24 == null) return null; return sys.ObjUtil.toImmutable(props); })($self), sys.Type.find("[sys::Str:sys::Obj]"));
    return;
  }

}

class DomTest extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DomTest.type$; }

  res() { return web.Weblet.prototype.res.apply(this, arguments); }

  onPost() { return web.Weblet.prototype.onPost.apply(this, arguments); }

  onHead() { return web.Weblet.prototype.onHead.apply(this, arguments); }

  onDelete() { return web.Weblet.prototype.onDelete.apply(this, arguments); }

  onOptions() { return web.Weblet.prototype.onOptions.apply(this, arguments); }

  onTrace() { return web.Weblet.prototype.onTrace.apply(this, arguments); }

  req() { return web.Weblet.prototype.req.apply(this, arguments); }

  onService() { return web.Weblet.prototype.onService.apply(this, arguments); }

  onPut() { return web.Weblet.prototype.onPut.apply(this, arguments); }

  onGet() {
    this.res().headers().set("Content-Type", "text/html; charset=utf-8");
    let out = this.res().out();
    out.docType();
    out.html();
    out.head().title().w("Dom Test").titleEnd().includeJs(sys.Uri.fromStr("/pod/sys/sys.js")).includeJs(sys.Uri.fromStr("/pod/concurrent/concurrent.js")).includeJs(sys.Uri.fromStr("/pod/graphics/graphics.js")).includeJs(sys.Uri.fromStr("/pod/web/web.js")).includeJs(sys.Uri.fromStr("/pod/dom/dom.js")).style().w(".hidden { display: none; }").styleEnd().script().w("function print(name)\n{\n  var p = document.getElementById('tests');\n  p.innerHTML = p.innerHTML + ' -- ' + name + '...<'+'br/>';\n }\n window.onload = function() {\n  var results = document.getElementById('results');\n  try\n  {\n    var test = fan.dom.DomTestClient.make();\n    print('testEmpty');     test.testEmpty();\n    print('testBasics');    test.testBasics();\n    print('testAttrs');     test.testAttrs();\n    print('testCreate');    test.testCreate();\n    print('testAddRemove'); test.testAddRemove();\n    print('testStyle');     test.testStyle();\n    print('testSvg');       test.testSvg();\n    results.style.color = 'green';\n    results.innerHTML = 'All tests passed! [' + test.m_verifies + ' verifies]';\n  }\n  catch (err)\n  {\n    results.style.color = 'red';\n    results.innerHTML = 'Test failed - ' + err;\n  }\n}").scriptEnd().headEnd();
    out.body().h1().w("Dom Test").h1End().hr();
    out.w("<div></div>").nl();
    out.div("id='testBasics' class='hidden'").p().w("alpha").pEnd().span().w("beta-1").spanEnd().span().w("beta-2").spanEnd().a(sys.Uri.fromStr("#")).w("gamma").aEnd().divEnd();
    out.div("id='testAttrs' class='hidden'").input("type='text' name='alpha' value='foo'").checkbox("name='beta' checked='checked'").checkbox().div("class='a'").divEnd().div("class='a b'").divEnd().div().divEnd().divEnd();
    out.div("id='testStyle' class='hidden'").div("class='a'").divEnd().div("class='a b'").divEnd().div().divEnd().divEnd();
    out.p().w("Running...").pEnd().p("id='tests'").pEnd().p("id='results'").pEnd();
    out.bodyEnd().htmlEnd();
    return;
  }

  static make() {
    const $self = new DomTest();
    DomTest.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DomTestClient extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#verifies = 0;
    return;
  }

  typeof() { return DomTestClient.type$; }

  #verifies = 0;

  // private field reflection only
  __verifies(it) { if (it === undefined) return this.#verifies; else this.#verifies = it; }

  testEmpty() {
    let elem = Win.cur().doc().body().querySelector("div");
    this.verifyEq(elem.ns(), sys.Uri.fromStr("http://www.w3.org/1999/xhtml"));
    this.verifyEq(elem.id(), null);
    this.verifyEq(elem.trap("id", sys.List.make(sys.Obj.type$.toNullable(), [])), "");
    this.verifyEq(sys.ObjUtil.coerce(elem.attrs().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(elem.hasChildren(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(elem.text(), "");
    this.verifyEq(sys.ObjUtil.coerce(elem.size().h(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Obj.type$.toNullable()));
    return;
  }

  testBasics() {
    let elem = Win.cur().doc().elemById("testBasics");
    this.verify(elem != null);
    this.verifyEq(elem.size(), graphics.Size.makeInt(0, 0));
    let kids = elem.children();
    this.verifyEq(sys.ObjUtil.coerce(kids.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.Str.trim(kids.get(0).html()), "alpha");
    this.verifyEq(kids.get(1).html(), "beta-1");
    this.verifyEq(kids.get(2).html(), "beta-2");
    this.verifyEq(kids.get(3).html(), "gamma");
    let a = Win.cur().doc().querySelector("#testBasics :last-child");
    this.verify(a != null);
    this.verifyEq(a.tagName(), "a");
    this.verifyEq(a.parent().id(), "testBasics");
    let spans = Win.cur().doc().querySelectorAll("#testBasics span");
    this.verifyEq(sys.ObjUtil.coerce(spans.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(spans.get(0).tagName(), "span");
    this.verifyEq(spans.get(1).tagName(), "span");
    return;
  }

  testAttrs() {
    let top = Win.cur().doc().elemById("testAttrs");
    this.verify(top != null);
    this.verifyEq(top.tagName(), "div");
    this.verifyAttrProp(sys.ObjUtil.coerce(top, Elem.type$), "id", "testAttrs");
    this.verifyAttrProp(sys.ObjUtil.coerce(top, Elem.type$), "name", null);
    this.verifyAttrProp(sys.ObjUtil.coerce(top, Elem.type$), "yabba", null);
    this.verifyEq(top.trap("offsetTop", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verify(sys.Str.contains(sys.ObjUtil.toStr(top.trap("innerHTML", sys.List.make(sys.Obj.type$.toNullable(), []))), "<input type="));
    let a = top.children().get(0);
    let b = top.children().get(1);
    let c = top.children().get(2);
    let d = top.children().get(3);
    let e = top.children().get(4);
    let f = top.children().get(5);
    try {
      this.verifyEq(a.tagName(), "input");
      this.verifyAttrProp(a, "id", null, "");
      this.verifyAttrProp(a, "type", "text");
      this.verifyAttrProp(a, "name", "alpha");
      this.verifyAttrProp(a, "tabIndex", null, sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
      a.trap("tabIndex", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())]));
      this.verifyAttrProp(a, "tabIndex", "1", sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
      this.verifyAttrProp(a, "value", "foo");
      a.trap("value", sys.List.make(sys.Obj.type$.toNullable(), ["bar"]));
      this.verifyAttrProp(a, "value", "foo", "bar");
      this.verifyEq(a.get("value"), "foo");
      this.verifyEq(a.trap("defaultValue", sys.List.make(sys.Obj.type$.toNullable(), [])), "foo");
    }
    finally {
      a.trap("value", sys.List.make(sys.Obj.type$.toNullable(), ["foo"]));
    }
    ;
    try {
      this.verifyEq(b.tagName(), "input");
      this.verifyAttrProp(b, "type", "checkbox");
      this.verifyAttrProp(b, "name", "beta");
      this.verifyAttrProp(b, "value", null, "on");
      this.verifyAttrProp(b, "checked", "checked", sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      b.trap("checked", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable())]));
      this.verifyAttrProp(b, "checked", "checked", sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      this.verifyEq(b.get("checked"), "checked");
      this.verifyEq(b.trap("defaultChecked", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      b.set("checked", "checked");
      this.verifyAttrProp(b, "checked", "checked", sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    }
    finally {
      b.trap("checked", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())]));
    }
    ;
    this.verifyEq(c.tagName(), "input");
    this.verifyAttrProp(c, "type", "checkbox");
    this.verifyAttrProp(c, "name", null, "");
    this.verifyAttrProp(c, "value", null, "on");
    this.verifyAttrProp(c, "checked", null, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(d.tagName(), "div");
    this.verifyAttrProp(d, "tabIndex", null, sys.ObjUtil.coerce(-1, sys.Obj.type$.toNullable()));
    d.trap("tabIndex", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]));
    this.verifyAttrProp(d, "tabIndex", "0", sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyEq(e.tagName(), "div");
    this.verifyAttr(e, "x", null);
    e.set("x", "123");
    this.verifyAttr(e, "x", "123");
    e.removeAttr("x");
    this.verifyAttr(e, "x", null);
    e.set("x", "abc");
    this.verifyAttr(e, "x", "abc");
    e.set("x", null);
    this.verifyAttr(e, "x", null);
    this.verifyEq(f.tagName(), "div");
    return;
  }

  testCreate() {
    const this$ = this;
    let elem = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      return;
    }), Elem.type$);
    this.verifyEq(elem.ns(), sys.Uri.fromStr("http://www.w3.org/1999/xhtml"));
    this.verifyEq(elem.tagName(), "div");
    (elem = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make("table"), (it) => {
      return;
    }), Elem.type$));
    this.verifyEq(elem.tagName(), "table");
    (elem = Win.cur().doc().createElem("div"));
    this.verifyEq(elem.ns(), sys.Uri.fromStr("http://www.w3.org/1999/xhtml"));
    this.verifyEq(elem.tagName(), "div");
    (elem = Win.cur().doc().createElem("div", sys.Map.__fromLiteral(["class"], ["foo"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(elem.tagName(), "div");
    this.verifyEq(elem.style().classes(), sys.List.make(sys.Str.type$, ["foo"]));
    (elem = Win.cur().doc().createElem("div", sys.Map.__fromLiteral(["id","name","class"], ["cool","yay","foo"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(elem.tagName(), "div");
    this.verifyEq(elem.get("id"), "cool");
    this.verifyEq(elem.get("name"), "yay");
    this.verifyEq(elem.get("class"), "foo");
    return;
  }

  testAddRemove() {
    const this$ = this;
    let elem = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      return;
    }), Elem.type$);
    this.verifyEq(sys.ObjUtil.coerce(elem.children().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(elem.hasChildren(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    let a = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      it.style().addClass("a");
      return;
    }), Elem.type$);
    let b = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      it.style().addClass("b");
      return;
    }), Elem.type$);
    let c = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      it.style().addClass("c");
      return;
    }), Elem.type$);
    elem.add(a);
    this.verifyEq(sys.ObjUtil.coerce(elem.children().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(elem.children().first().style().classes(), sys.List.make(sys.Str.type$, ["a"]));
    elem.add(b);
    elem.add(c);
    this.verifyEq(sys.ObjUtil.coerce(elem.children().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(elem.children().get(1).style().classes(), sys.List.make(sys.Str.type$, ["b"]));
    this.verifyEq(elem.children().get(2).style().classes(), sys.List.make(sys.Str.type$, ["c"]));
    elem.remove(b);
    this.verifyEq(sys.ObjUtil.coerce(elem.children().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(elem.children().get(0).style().classes(), sys.List.make(sys.Str.type$, ["a"]));
    this.verifyEq(elem.children().get(1).style().classes(), sys.List.make(sys.Str.type$, ["c"]));
    elem.remove(c);
    this.verifyEq(sys.ObjUtil.coerce(elem.children().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(elem.children().get(0).style().classes(), sys.List.make(sys.Str.type$, ["a"]));
    elem.remove(sys.ObjUtil.coerce(elem.children().first(), Elem.type$));
    this.verifyEq(sys.ObjUtil.coerce(elem.children().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    elem.addAll(sys.List.make(Elem.type$, [b, c]));
    this.verifyEq(sys.ObjUtil.coerce(elem.children().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(elem.hasChildren(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    elem.insertBefore(a, b);
    this.verifyEq(sys.ObjUtil.coerce(elem.children().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(elem.children().get(0).style().classes(), sys.List.make(sys.Str.type$, ["a"]));
    this.verifyEq(elem.children().get(1).style().classes(), sys.List.make(sys.Str.type$, ["b"]));
    this.verifyEq(elem.children().get(2).style().classes(), sys.List.make(sys.Str.type$, ["c"]));
    elem.removeAll();
    this.verifyEq(sys.ObjUtil.coerce(elem.children().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(elem.hasChildren(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    return;
  }

  testStyle() {
    const this$ = this;
    let top = Win.cur().doc().elemById("testStyle");
    let a = top.children().get(0);
    let b = top.children().get(1);
    let c = top.children().get(2);
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("a"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("b"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("c"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(b.style().hasClass("a"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(b.style().hasClass("b"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(b.style().hasClass("c"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(c.style().hasClass("a"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    a.style().addClass("c");
    b.style().addClass("c");
    c.style().addClass("c");
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("c"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(b.style().hasClass("c"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(c.style().hasClass("c"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    a.style().removeClass("a");
    b.style().removeClass("a");
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("a"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(b.style().hasClass("a"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    c.style().removeClass("c");
    this.verifyEq(sys.ObjUtil.coerce(c.style().hasClass("c"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(b.style().classes(), sys.List.make(sys.Str.type$, ["b", "c"]));
    b.style().addClass("b");
    this.verifyEq(b.style().classes(), sys.List.make(sys.Str.type$, ["b", "c"]));
    b.style().removeClass("x");
    this.verifyEq(b.style().classes(), sys.List.make(sys.Str.type$, ["b", "c"]));
    a.style().addClass("x y z");
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("x"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("y"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("z"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    a.style().removeClass("y z");
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("x"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("y"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("z"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    let x = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      return;
    }), Elem.type$);
    x.style().set("padding", "10px");
    this.verifyEq(x.style().get("padding"), "10px");
    x.style().trap("padding", sys.List.make(sys.Obj.type$.toNullable(), ["20px"]));
    this.verifyEq(x.style().trap("padding", sys.List.make(sys.Obj.type$.toNullable(), [])), "20px");
    x.style().set("background-color", "#f00");
    this.verifyEq(x.style().get("background-color"), "rgb(255, 0, 0)");
    x.style().trap("backgroundColor", sys.List.make(sys.Obj.type$.toNullable(), ["#0f0"]));
    this.verifyEq(x.style().trap("backgroundColor", sys.List.make(sys.Obj.type$.toNullable(), [])), "rgb(0, 255, 0)");
    x.style().set("border-bottom-color", "#00f");
    this.verifyEq(x.style().trap("borderBottomColor", sys.List.make(sys.Obj.type$.toNullable(), [])), "rgb(0, 0, 255)");
    x.style().setAll(sys.Map.__fromLiteral(["padding","margin","border"], ["3px","6px","2px dotted #ff0"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyEq(x.style().trap("padding", sys.List.make(sys.Obj.type$.toNullable(), [])), "3px");
    this.verifyEq(x.style().trap("margin", sys.List.make(sys.Obj.type$.toNullable(), [])), "6px");
    this.verifyEq(x.style().trap("border", sys.List.make(sys.Obj.type$.toNullable(), [])), "2px dotted rgb(255, 255, 0)");
    x.style().setCss("padding: 5px; margin: 10px; border: 1px solid #0f0");
    this.verifyEq(x.style().trap("padding", sys.List.make(sys.Obj.type$.toNullable(), [])), "5px");
    this.verifyEq(x.style().trap("margin", sys.List.make(sys.Obj.type$.toNullable(), [])), "10px");
    this.verifyEq(x.style().trap("border", sys.List.make(sys.Obj.type$.toNullable(), [])), "1px solid rgb(0, 255, 0)");
    return;
  }

  testSvg() {
    let a = Svg.line(sys.ObjUtil.coerce(0, sys.Num.type$), sys.ObjUtil.coerce(0, sys.Num.type$), sys.ObjUtil.coerce(10, sys.Num.type$), sys.ObjUtil.coerce(10, sys.Num.type$));
    this.verifyEq(a.ns(), sys.Uri.fromStr("http://www.w3.org/2000/svg"));
    this.verifyEq(a.tagName(), "line");
    this.verifyEq(a.trap("x1", sys.List.make(sys.Obj.type$.toNullable(), [])), "0");
    this.verifyEq(a.trap("y1", sys.List.make(sys.Obj.type$.toNullable(), [])), "0");
    this.verifyEq(a.trap("x2", sys.List.make(sys.Obj.type$.toNullable(), [])), "10");
    this.verifyEq(a.trap("y2", sys.List.make(sys.Obj.type$.toNullable(), [])), "10");
    a.trap("x1", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable())]));
    a.trap("y1", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable())]));
    this.verifyEq(a.trap("x1", sys.List.make(sys.Obj.type$.toNullable(), [])), "5");
    this.verifyEq(a.trap("y1", sys.List.make(sys.Obj.type$.toNullable(), [])), "5");
    this.verifyEq(a.style().classes(), sys.Str.type$.emptyList());
    a.style().addClass("a b c");
    this.verifyEq(a.style().classes(), sys.List.make(sys.Str.type$, ["a", "b", "c"]));
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("a"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("b"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("c"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    a.style().removeClass("b c");
    this.verifyEq(a.style().classes(), sys.List.make(sys.Str.type$, ["a"]));
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("a"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("b"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.style().hasClass("c"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    return;
  }

  verify(v) {
    if (v) {
      ((this$) => { let $_u25 = this$.#verifies;this$.#verifies = sys.Int.increment(this$.#verifies); return $_u25; })(this);
    }
    else {
      throw sys.Err.make("Test failed");
    }
    ;
    return;
  }

  verifyEq(a,b) {
    if (sys.ObjUtil.equals(a, b)) {
      ((this$) => { let $_u26 = this$.#verifies;this$.#verifies = sys.Int.increment(this$.#verifies); return $_u26; })(this);
    }
    else {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", a), " != "), b));
    }
    ;
    return;
  }

  verifyAttrProp(elem,name,attrVal,propVal) {
    if (propVal === undefined) propVal = null;
    this.verifyAttr(elem, name, attrVal);
    this.verifyProp(elem, name, ((this$) => { let $_u27 = propVal; if ($_u27 != null) return $_u27; return attrVal; })(this));
    return;
  }

  verifyAttr(elem,name,val) {
    this.verifyEq(elem.attr(name), val);
    this.verifyEq(elem.get(name), val);
    this.verifyEq(elem.get(name), val);
    return;
  }

  verifyProp(elem,name,val) {
    this.verifyEq(elem.prop(name), val);
    this.verifyEq(elem.trap(name), val);
    return;
  }

  static make() {
    const $self = new DomTestClient();
    DomTestClient.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class JavaTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JavaTest.type$; }

  testElemBasics() {
    const this$ = this;
    let elem = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      return;
    }), Elem.type$);
    this.verifyEq(elem.ns(), sys.Uri.fromStr("http://www.w3.org/1999/xhtml"));
    this.verifyEq(elem.tagName(), "div");
    this.verifyAttrProp(elem, "id", null, "");
    this.verifyAttrProp(elem, "name", null);
    this.verifyEq(elem.text(), "");
    elem.id("foo");
    elem.text("yabba dabba");
    this.verifyAttrProp(elem, "id", "foo");
    this.verifyEq(elem.text(), "yabba dabba");
    let a = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      return;
    }), Elem.type$);
    let b = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      return;
    }), Elem.type$);
    let c = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      return;
    }), Elem.type$);
    let d = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      return;
    }), Elem.type$);
    let e = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      return;
    }), Elem.type$);
    this.verifyEq(a.parent(), null);
    this.verifyEq(sys.ObjUtil.coerce(elem.hasChildren(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    elem.add(a);
    this.verifyEq(sys.ObjUtil.coerce(elem.hasChildren(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(elem.children().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(a.parent(), elem);
    elem.add(b);
    this.verifyEq(sys.ObjUtil.coerce(elem.children().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    elem.add(c);
    this.verifyEq(sys.ObjUtil.coerce(elem.children().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(elem.firstChild(), a);
    this.verifyEq(elem.lastChild(), c);
    this.verifyEq(sys.ObjUtil.coerce(elem.containsChild(b), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(a.prevSibling(), null);
    this.verifyEq(b.prevSibling(), a);
    this.verifyEq(b.nextSibling(), c);
    this.verifyEq(c.nextSibling(), null);
    elem.insertBefore(d, c);
    this.verifyEq(elem.children().get(2), d);
    elem.replace(d, e);
    this.verifyEq(elem.children().get(2), e);
    this.verifyEq(d.parent(), null);
    this.verifyEq(sys.ObjUtil.coerce(elem.children().contains(d), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    elem.remove(a);
    this.verifyEq(a.parent(), null);
    this.verifyEq(sys.ObjUtil.coerce(elem.children().contains(a), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    return;
  }

  testAttrs() {
    const this$ = this;
    let elem = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      return;
    }), Elem.type$);
    this.verifyEq(sys.ObjUtil.coerce(elem.attrs().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyAttrProp(elem, "foo", null);
    elem.set("foo", "bar");
    this.verifyAttrProp(elem, "foo", "bar");
    elem.trap("bar", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable())]));
    elem.trap("zoo", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(12, sys.Obj.type$.toNullable())]));
    this.verifyAttrProp(elem, "bar", "false", sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyAttrProp(elem, "zoo", "12", sys.ObjUtil.coerce(12, sys.Obj.type$.toNullable()));
    let attrs = elem.attrs();
    this.verifyEq(sys.ObjUtil.coerce(attrs.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyAttrProp(elem, "foo", "bar");
    this.verifyAttrProp(elem, "bar", "false", sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyAttrProp(elem, "zoo", "12", sys.ObjUtil.coerce(12, sys.Obj.type$.toNullable()));
    return;
  }

  testStyleBasics() {
    const this$ = this;
    let elem = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      return;
    }), Elem.type$);
    let s = elem.style();
    this.verifyEq(sys.ObjUtil.coerce(s.classes().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    s.addClass("foo");
    this.verifyEq(sys.ObjUtil.coerce(s.classes().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.hasClass("foo"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.hasClass("bar"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    s.addClass("bar cool");
    this.verifyEq(sys.ObjUtil.coerce(s.classes().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.hasClass("foo"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.hasClass("bar"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.hasClass("cool"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    s.removeClass("bar");
    this.verifyEq(sys.ObjUtil.coerce(s.classes().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.hasClass("foo"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.hasClass("bar"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(s.hasClass("cool"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    s.removeClass("nada");
    this.verifyEq(sys.ObjUtil.coerce(s.classes().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(s.trap("background", sys.List.make(sys.Obj.type$.toNullable(), [])), null);
    s.trap("background", sys.List.make(sys.Obj.type$.toNullable(), ["#eee"]));
    this.verifyEq(s.trap("background", sys.List.make(sys.Obj.type$.toNullable(), [])), "#eee");
    return;
  }

  testClassAttr() {
    const this$ = this;
    let elem = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      return;
    }), Elem.type$);
    this.verifyEq(sys.ObjUtil.coerce(elem.attrs().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyEq(elem.attr("class"), null);
    elem.style().addClass("foo");
    this.verifyEq(sys.ObjUtil.coerce(elem.style().hasClass("foo"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(elem.attr("class"), "foo");
    this.verifyEq(sys.ObjUtil.coerce(elem.attrs().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    elem.setAttr("class", "bar zar");
    this.verifyEq(sys.ObjUtil.coerce(elem.style().hasClass("foo"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(elem.style().hasClass("bar"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(elem.style().hasClass("zar"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(elem.attr("class"), "bar zar");
    elem.removeAttr("class");
    this.verifyEq(sys.ObjUtil.coerce(elem.style().classes().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyEq(elem.attr("class"), null);
    return;
  }

  testQuerySelector() {
    const this$ = this;
    let root = null;
    let a = null;
    let b = null;
    (root = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
      it.setAttr("foo", "notme");
      it.add(sys.ObjUtil.coerce((a = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
        it.setAttr("foo", "bar");
        return;
      }), Elem.type$)), Elem.type$)).add(sys.ObjUtil.coerce((b = sys.ObjUtil.coerce(sys.ObjUtil.with(Elem.make(), (it) => {
        it.setAttr("foo", "bar");
        return;
      }), Elem.type$)), Elem.type$));
      return;
    }), Elem.type$));
    let m = root.querySelectorAll("[foo]");
    this.verifyEq(sys.ObjUtil.coerce(m.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifySame(m.get(0), a);
    this.verifySame(m.get(1), b);
    this.verifySame(root.querySelector("[foo]"), a);
    return;
  }

  testSvg() {
    let a = Svg.line(sys.ObjUtil.coerce(0, sys.Num.type$), sys.ObjUtil.coerce(0, sys.Num.type$), sys.ObjUtil.coerce(10, sys.Num.type$), sys.ObjUtil.coerce(10, sys.Num.type$));
    this.verifyEq(a.ns(), sys.Uri.fromStr("http://www.w3.org/2000/svg"));
    this.verifyEq(a.tagName(), "line");
    this.verifyEq(a.trap("x1", sys.List.make(sys.Obj.type$.toNullable(), [])), "0");
    this.verifyEq(a.trap("y1", sys.List.make(sys.Obj.type$.toNullable(), [])), "0");
    this.verifyEq(a.trap("x2", sys.List.make(sys.Obj.type$.toNullable(), [])), "10");
    this.verifyEq(a.trap("y2", sys.List.make(sys.Obj.type$.toNullable(), [])), "10");
    a.trap("x1", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable())]));
    a.trap("y1", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable())]));
    this.verifyEq(a.trap("x1", sys.List.make(sys.Obj.type$.toNullable(), [])), "5");
    this.verifyEq(a.trap("y1", sys.List.make(sys.Obj.type$.toNullable(), [])), "5");
    return;
  }

  verifyAttrProp(elem,name,attrVal,propVal) {
    if (propVal === undefined) propVal = null;
    this.verifyAttr(elem, name, attrVal);
    this.verifyProp(elem, name, ((this$) => { let $_u28 = propVal; if ($_u28 != null) return $_u28; return attrVal; })(this));
    return;
  }

  verifyAttr(elem,name,val) {
    this.verifyEq(elem.attr(name), val);
    this.verifyEq(elem.get(name), val);
    this.verifyEq(elem.get(name), val);
    return;
  }

  verifyProp(elem,name,val) {
    this.verifyEq(elem.prop(name), val);
    this.verifyEq(elem.trap(name), val);
    return;
  }

  static make() {
    const $self = new JavaTest();
    JavaTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class GeomTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GeomTest.type$; }

  testCssDim() {
    const this$ = this;
    this.verifyEq(CssDim.type$.make(), CssDim.make(sys.ObjUtil.coerce(0, sys.Num.type$), "px"));
    this.verifyEq(CssDim.defVal(), CssDim.make(sys.ObjUtil.coerce(0, sys.Num.type$), "px"));
    this.verifyEq(CssDim.defVal(), CssDim.fromStr("0px"));
    this.verifyEq(CssDim.defVal().toStr(), "0px");
    this.verifyCssDim(sys.ObjUtil.coerce(CssDim.fromStr("-1em"), CssDim.type$), sys.ObjUtil.coerce(-1, sys.Num.type$), "em");
    this.verifyCssDim(CssDim.make(sys.ObjUtil.coerce(100, sys.Num.type$), "px"), sys.ObjUtil.coerce(100, sys.Num.type$), "px");
    this.verifyCssDim(CssDim.make(sys.ObjUtil.coerce(sys.Float.make(1.25), sys.Num.type$), "%"), sys.ObjUtil.coerce(sys.Float.make(1.25), sys.Num.type$), "%");
    this.verifyCssDim(sys.ObjUtil.coerce(CssDim.fromStr("-10.1vw"), CssDim.type$), sys.ObjUtil.coerce(sys.Float.make(-10.1), sys.Num.type$), "vw");
    this.verifyCssDim(sys.ObjUtil.coerce(CssDim.fromStr("auto"), CssDim.type$), sys.ObjUtil.coerce(0, sys.Num.type$), "auto");
    this.verifyEq(CssDim.fromStr("auto").toStr(), "auto");
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let d = CssDim.fromStr("100");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let d = CssDim.fromStr("abc");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let d = CssDim.fromStr("100 %");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let d = CssDim.fromStr("-100 px");
      return;
    });
    this.verifySer(CssDim.make(sys.ObjUtil.coerce(5, sys.Num.type$), "px"));
    this.verifySer(CssDim.make(sys.ObjUtil.coerce(-5, sys.Num.type$), "px"));
    this.verifySer(CssDim.make(sys.ObjUtil.coerce(sys.Float.make(1.25), sys.Num.type$), "%"));
    this.verifySer(CssDim.make(sys.ObjUtil.coerce(sys.Float.make(-5.001), sys.Num.type$), "em"));
    return;
  }

  verifyCssDim(d,v,u) {
    this.verifyEq(d.val(), v);
    this.verifyEq(d.unit(), u);
    return;
  }

  verifySer(obj) {
    let x = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().writeObj(obj), sys.Buf.type$.toNullable()).flip(), sys.Buf.type$.toNullable()).readObj();
    this.verifyEq(obj, x);
    return;
  }

  static make() {
    const $self = new GeomTest();
    GeomTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class ClipboardTest extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ClipboardTest.type$; }

  res() { return web.Weblet.prototype.res.apply(this, arguments); }

  onPost() { return web.Weblet.prototype.onPost.apply(this, arguments); }

  onHead() { return web.Weblet.prototype.onHead.apply(this, arguments); }

  onDelete() { return web.Weblet.prototype.onDelete.apply(this, arguments); }

  onOptions() { return web.Weblet.prototype.onOptions.apply(this, arguments); }

  onTrace() { return web.Weblet.prototype.onTrace.apply(this, arguments); }

  req() { return web.Weblet.prototype.req.apply(this, arguments); }

  onService() { return web.Weblet.prototype.onService.apply(this, arguments); }

  onPut() { return web.Weblet.prototype.onPut.apply(this, arguments); }

  onGet() {
    this.res().headers().set("Content-Type", "text/html; charset=utf-8");
    let out = this.res().out();
    out.docType();
    out.html();
    out.head().title().w("Clipboard Test").titleEnd().includeJs(sys.Uri.fromStr("/pod/sys/sys.js")).includeJs(sys.Uri.fromStr("/pod/concurrent/concurrent.js")).includeJs(sys.Uri.fromStr("/pod/graphics/graphics.js")).includeJs(sys.Uri.fromStr("/pod/web/web.js")).includeJs(sys.Uri.fromStr("/pod/dom/dom.js")).headEnd();
    out.body().h1().w("Clipboard Test").h1End().hr();
    out.p().h2().w("Write Text").h2End().textArea("id='write' cols='80' rows='10'").w("Something really cool to add to the clipboard!").textAreaEnd().button("value='Write text to clipboard' onclick='fan.dom.ClipboardTestUi.write()'").pEnd();
    out.p().h2().w("Read Text").h2End().textArea("id='read' cols='80' rows='10' readonly style='background:#eee'").textAreaEnd().button("value='Read clipboard contents' onclick='fan.dom.ClipboardTestUi.read()'").pEnd();
    out.bodyEnd().htmlEnd();
    return;
  }

  static make() {
    const $self = new ClipboardTest();
    ClipboardTest.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class ClipboardTestUi extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ClipboardTestUi.type$; }

  static write() {
    let text = Win.cur().doc().elemById("write").trap("value", sys.List.make(sys.Obj.type$.toNullable(), []));
    Win.cur().clipboardWriteText(sys.ObjUtil.coerce(text, sys.Str.type$));
    return;
  }

  static read() {
    const this$ = this;
    Win.cur().clipboardReadText((text) => {
      Win.cur().doc().elemById("read").trap("value", sys.List.make(sys.Obj.type$.toNullable(), [text]));
      return;
    });
    return;
  }

  static make() {
    const $self = new ClipboardTestUi();
    ClipboardTestUi.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

const p = sys.Pod.add$('dom');
const xp = sys.Param.noParams$();
let m;
Storage.type$ = p.at$('Storage','sys::Obj',[],{'sys::Js':""},8192,Storage);
MutationObserver.type$ = p.at$('MutationObserver','sys::Obj',[],{'sys::Js':""},8192,MutationObserver);
MutationRec.type$ = p.at$('MutationRec','sys::Obj',[],{'sys::Js':""},8192,MutationRec);
TextSel.type$ = p.at$('TextSel','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8192,TextSel);
CanvasGraphics.type$ = p.at$('CanvasGraphics','sys::Obj',['graphics::Graphics'],{'sys::Js':""},640,CanvasGraphics);
CanvasGraphicsPath.type$ = p.at$('CanvasGraphicsPath','sys::Obj',['graphics::GraphicsPath'],{'sys::Js':""},640,CanvasGraphicsPath);
CanvasFontMetrics.type$ = p.at$('CanvasFontMetrics','graphics::FontMetrics',[],{'sys::Js':""},642,CanvasFontMetrics);
Elem.type$ = p.at$('Elem','sys::Obj',[],{'sys::Js':""},8192,Elem);
Style.type$ = p.at$('Style','sys::Obj',[],{'sys::Js':""},8192,Style);
Svg.type$ = p.at$('Svg','sys::Obj',[],{'sys::Js':""},8226,Svg);
DomCoord.type$ = p.at$('DomCoord','sys::Obj',[],{'sys::Js':""},8194,DomCoord);
DomGraphicsEnv.type$ = p.at$('DomGraphicsEnv','sys::Obj',['graphics::GraphicsEnv'],{'sys::NoDoc':"",'sys::Js':""},8194,DomGraphicsEnv);
HttpReq.type$ = p.at$('HttpReq','sys::Obj',[],{'sys::Js':""},8192,HttpReq);
ResizeObserver.type$ = p.at$('ResizeObserver','sys::Obj',[],{'sys::Js':""},8192,ResizeObserver);
ResizeObserverEntry.type$ = p.at$('ResizeObserverEntry','sys::Obj',[],{'sys::Js':""},8192,ResizeObserverEntry);
DataTransfer.type$ = p.at$('DataTransfer','sys::Obj',[],{'sys::Js':""},8192,DataTransfer);
HttpRes.type$ = p.at$('HttpRes','sys::Obj',[],{'sys::Js':""},8192,HttpRes);
Doc.type$ = p.at$('Doc','sys::Obj',[],{'sys::Js':""},8192,Doc);
Key.type$ = p.at$('Key','sys::Obj',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8194,Key);
DomFile.type$ = p.at$('DomFile','sys::Obj',[],{'sys::Js':""},8192,DomFile);
Event.type$ = p.at$('Event','sys::Obj',[],{'sys::Js':""},8192,Event);
HttpSocket.type$ = p.at$('HttpSocket','sys::Obj',[],{'sys::Js':""},8704,HttpSocket);
DomImage.type$ = p.at$('DomImage','sys::Obj',['graphics::Image'],{'sys::Js':""},130,DomImage);
CssDim.type$ = p.at$('CssDim','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8194,CssDim);
WeakMap.type$ = p.at$('WeakMap','sys::Obj',[],{'sys::Js':""},8192,WeakMap);
Win.type$ = p.at$('Win','sys::Obj',[],{'sys::Js':""},8192,Win);
KeyFrames.type$ = p.at$('KeyFrames','sys::Obj',[],{'sys::Js':""},8194,KeyFrames);
KeyFrame.type$ = p.at$('KeyFrame','sys::Obj',[],{'sys::Js':""},8194,KeyFrame);
DomTest.type$ = p.at$('DomTest','sys::Obj',['web::Weblet'],{'sys::NoDoc':""},8192,DomTest);
DomTestClient.type$ = p.at$('DomTestClient','sys::Obj',[],{'sys::Js':"",'sys::NoDoc':""},128,DomTestClient);
JavaTest.type$ = p.at$('JavaTest','sys::Test',[],{},8192,JavaTest);
GeomTest.type$ = p.at$('GeomTest','sys::Test',[],{'sys::Js':""},8192,GeomTest);
ClipboardTest.type$ = p.at$('ClipboardTest','sys::Obj',['web::Weblet'],{'sys::NoDoc':""},8192,ClipboardTest);
ClipboardTestUi.type$ = p.at$('ClipboardTestUi','sys::Obj',[],{'sys::Js':"",'sys::NoDoc':""},128,ClipboardTestUi);
Storage.type$.am$('make',2052,'sys::Void',xp,{}).am$('size',8704,'sys::Int',xp,{}).am$('keys',8704,'sys::Str[]',xp,{}).am$('key',8704,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{}).am$('get',8704,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{'sys::Operator':""}).am$('set',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('val','sys::Obj',false)]),{'sys::Operator':""}).am$('remove',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{}).am$('clear',8704,'sys::Void',xp,{});
MutationObserver.type$.af$('callback',65664,'sys::Func?',{'sys::NoDoc':""}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('callback','|dom::MutationRec[]->sys::Void|',false)]),{}).am$('observe',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('target','dom::Elem',false),new sys.Param('opts','[sys::Str:sys::Obj]',false)]),{}).am$('takeRecs',8704,'dom::MutationRec[]',xp,{}).am$('disconnect',8704,'sys::This',xp,{});
MutationRec.type$.af$('type',73728,'sys::Str',{}).af$('target',73728,'dom::Elem',{}).af$('added',73728,'dom::Elem[]',{}).af$('removed',73728,'dom::Elem[]',{}).af$('prevSibling',73728,'dom::Elem?',{}).af$('nextSibling',73728,'dom::Elem?',{}).af$('attr',73728,'sys::Str?',{}).af$('attrNs',73728,'sys::Str?',{}).af$('oldVal',73728,'sys::Str?',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{});
TextSel.type$.am$('make',2052,'sys::Void',xp,{}).am$('clear',8704,'sys::Void',xp,{});
CanvasGraphics.type$.af$('paint',271872,'graphics::Paint',{}).af$('color',271872,'graphics::Color',{}).af$('stroke',271872,'graphics::Stroke',{}).af$('alpha',271872,'sys::Float',{}).af$('font',271872,'graphics::Font',{}).am$('render',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('canvas','dom::Elem',false),new sys.Param('cb','|graphics::Graphics->sys::Void|',false)]),{}).am$('metrics',271872,'graphics::FontMetrics',xp,{}).am$('path',271872,'graphics::GraphicsPath',xp,{}).am$('drawLine',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x1','sys::Float',false),new sys.Param('y1','sys::Float',false),new sys.Param('x2','sys::Float',false),new sys.Param('y2','sys::Float',false)]),{}).am$('drawRect',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('fillRect',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('clipRect',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('drawRoundRect',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false),new sys.Param('wArc','sys::Float',false),new sys.Param('hArc','sys::Float',false)]),{}).am$('fillRoundRect',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false),new sys.Param('wArc','sys::Float',false),new sys.Param('hArc','sys::Float',false)]),{}).am$('clipRoundRect',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false),new sys.Param('wArc','sys::Float',false),new sys.Param('hArc','sys::Float',false)]),{}).am$('drawEllipse',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('fillEllipse',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('drawText',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('drawImage',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('img','graphics::Image',false),new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',true),new sys.Param('h','sys::Float',true)]),{}).am$('drawImageRegion',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('img','graphics::Image',false),new sys.Param('src','graphics::Rect',false),new sys.Param('dst','graphics::Rect',false)]),{}).am$('translate',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('transform',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('transform','graphics::Transform',false)]),{}).am$('push',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('r','graphics::Rect?',true)]),{}).am$('pop',271872,'sys::This',xp,{}).am$('dispose',271872,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
CanvasGraphicsPath.type$.am$('draw',271872,'sys::This',xp,{}).am$('fill',271872,'sys::This',xp,{}).am$('clip',271872,'sys::This',xp,{}).am$('moveTo',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('lineTo',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('arc',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('radius','sys::Float',false),new sys.Param('start','sys::Float',false),new sys.Param('sweep','sys::Float',false)]),{}).am$('curveTo',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cp1x','sys::Float',false),new sys.Param('cp1y','sys::Float',false),new sys.Param('cp2x','sys::Float',false),new sys.Param('cp2y','sys::Float',false),new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('quadTo',271872,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cpx','sys::Float',false),new sys.Param('cpy','sys::Float',false),new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false)]),{}).am$('close',271872,'sys::This',xp,{}).am$('make',139268,'sys::Void',xp,{});
CanvasFontMetrics.type$.af$('height',271872,'sys::Float',{}).af$('ascent',271872,'sys::Float',{}).af$('descent',271872,'sys::Float',{}).af$('leading',271872,'sys::Float',{}).am$('width',271872,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Elem.type$.af$('id',8192,'sys::Str?',{}).af$('text',8704,'sys::Str',{}).af$('html',8704,'sys::Str',{}).af$('enabled',270848,'sys::Bool?',{}).af$('pos',8704,'graphics::Point',{}).af$('size',8704,'graphics::Size',{}).af$('scrollPos',8704,'graphics::Point',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tagName','sys::Str',true),new sys.Param('ns','sys::Uri?',true)]),{}).am$('_make',2560,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tagName','sys::Str',false),new sys.Param('ns','sys::Uri?',false)]),{}).am$('fromNative',41474,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('elem','sys::Obj',false),new sys.Param('type','sys::Type',true)]),{'sys::Js':""}).am$('fromHtml',40962,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('html','sys::Str',false)]),{}).am$('ns',8704,'sys::Uri',xp,{}).am$('tagName',8704,'sys::Str',xp,{}).am$('style',8704,'dom::Style',xp,{}).am$('attrs',8704,'[sys::Str:sys::Str]',xp,{}).am$('attr',8704,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('setAttr',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Str?',false),new sys.Param('ns','sys::Uri?',true)]),{}).am$('removeAttr',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('get',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{'sys::Operator':""}).am$('set',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Str?',false)]),{'sys::Operator':""}).am$('prop',8704,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('setProp',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('trap',271872,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('invoke',8704,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('pagePos',8704,'graphics::Point',xp,{}).am$('relPos',8192,'graphics::Point',sys.List.make(sys.Param.type$,[new sys.Param('p','graphics::Point',false)]),{}).am$('scrollSize',8704,'graphics::Size',xp,{}).am$('scrollIntoView',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('alignToTop','sys::Bool',true)]),{}).am$('renderCanvas',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|graphics::Graphics->sys::Void|',false)]),{}).am$('parent',8704,'dom::Elem?',xp,{}).am$('hasChildren',8704,'sys::Bool',xp,{}).am$('children',8704,'dom::Elem[]',xp,{}).am$('firstChild',8704,'dom::Elem?',xp,{}).am$('lastChild',8704,'dom::Elem?',xp,{}).am$('prevSibling',8704,'dom::Elem?',xp,{}).am$('nextSibling',8704,'dom::Elem?',xp,{}).am$('containsChild',8704,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false)]),{}).am$('querySelector',8704,'dom::Elem?',sys.List.make(sys.Param.type$,[new sys.Param('selectors','sys::Str',false)]),{}).am$('querySelectorAll',8704,'dom::Elem[]',sys.List.make(sys.Param.type$,[new sys.Param('selectors','sys::Str',false)]),{}).am$('closest',8704,'dom::Elem?',sys.List.make(sys.Param.type$,[new sys.Param('selectors','sys::Str',false)]),{}).am$('clone',8704,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('deep','sys::Bool',true)]),{}).am$('add',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('child','dom::Elem',false)]),{'sys::Operator':""}).am$('insertBefore',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('child','dom::Elem',false),new sys.Param('ref','dom::Elem',false)]),{}).am$('replace',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('oldChild','dom::Elem',false),new sys.Param('newChild','dom::Elem',false)]),{}).am$('remove',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('child','dom::Elem',false)]),{}).am$('addAll',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('elems','dom::Elem[]',false)]),{}).am$('removeAll',8192,'sys::This',xp,{}).am$('addChild',4608,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('child','dom::Elem',false)]),{'sys::NoDoc':""}).am$('insertChildBefore',4608,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('child','dom::Elem',false),new sys.Param('ref','dom::Elem',false)]),{'sys::NoDoc':""}).am$('replaceChild',4608,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('oldChild','dom::Elem',false),new sys.Param('newChild','dom::Elem',false)]),{'sys::NoDoc':""}).am$('removeChild',4608,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('child','dom::Elem',false)]),{'sys::NoDoc':""}).am$('onParent',266240,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','dom::Elem',false)]),{'sys::NoDoc':""}).am$('onUnparent',266240,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','dom::Elem',false)]),{'sys::NoDoc':""}).am$('onAdd',266240,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('child','dom::Elem',false)]),{'sys::NoDoc':""}).am$('onRemove',266240,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('child','dom::Elem',false)]),{'sys::NoDoc':""}).am$('hasFocus',270848,'sys::Bool',xp,{}).am$('focus',270848,'sys::Void',xp,{}).am$('blur',270848,'sys::Void',xp,{}).am$('onEvent',8704,'sys::Func',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false),new sys.Param('useCapture','sys::Bool',false),new sys.Param('handler','|dom::Event->sys::Void|',false)]),{}).am$('removeEvent',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false),new sys.Param('useCapture','sys::Bool',false),new sys.Param('handler','sys::Func',false)]),{}).am$('transition',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('props','[sys::Str:sys::Obj]',false),new sys.Param('opts','[sys::Str:sys::Obj]?',false),new sys.Param('dur','sys::Duration',false),new sys.Param('onComplete','|dom::Elem->sys::Void|?',true)]),{}).am$('animateStart',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('frames','dom::KeyFrames',false),new sys.Param('opts','[sys::Str:sys::Obj]?',false),new sys.Param('dur','sys::Duration',false)]),{}).am$('animateStop',8192,'sys::Void',xp,{});
Style.type$.af$('classes',8704,'sys::Str[]',{}).af$('vendor',100354,'[sys::Str:sys::Str[]]',{}).af$('vendorVals',100354,'sys::Str[]',{}).af$('counter',100354,'concurrent::AtomicInt',{}).af$('pseudoCacheRef',100354,'concurrent::AtomicRef',{}).am$('make',2052,'sys::Void',xp,{}).am$('hasClass',8704,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('addClass',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('removeClass',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('toggleClass',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cond','sys::Bool?',true)]),{}).am$('addPseudoClass',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('css','sys::Str',false)]),{}).am$('clear',8704,'sys::This',xp,{}).am$('computed',8704,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('effective',8704,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('get',8704,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{'sys::Operator':""}).am$('set',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{'sys::Operator':""}).am$('setAll',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:sys::Obj?]',false)]),{}).am$('setCss',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('css','sys::Str',false)]),{}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('setProp',2560,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Str?',false)]),{}).am$('fromCamel',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('toVendors',32898,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('names','sys::Str[]',false)]),{}).am$('toVendor',32898,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('pseudoCache',34818,'[sys::Str:sys::Str]',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
Svg.type$.af$('ns',106498,'sys::Uri',{}).af$('nsXLink',106498,'sys::Uri',{}).af$('genId',100354,'concurrent::AtomicInt',{}).af$('camelMap',100354,'[sys::Str:sys::Str]',{}).am$('make',2052,'sys::Void',xp,{}).am$('elem',40962,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('tagName','sys::Str',false)]),{}).am$('line',40962,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('x1','sys::Num',false),new sys.Param('y1','sys::Num',false),new sys.Param('x2','sys::Num',false),new sys.Param('y2','sys::Num',false)]),{}).am$('rect',40962,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Num',false),new sys.Param('y','sys::Num',false),new sys.Param('w','sys::Num',false),new sys.Param('h','sys::Num',false)]),{}).am$('text',40962,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('text','sys::Str',false),new sys.Param('x','sys::Num',false),new sys.Param('y','sys::Num',false)]),{}).am$('image',40962,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('href','sys::Uri',false),new sys.Param('x','sys::Float',false),new sys.Param('y','sys::Float',false),new sys.Param('w','sys::Float',false),new sys.Param('h','sys::Float',false)]),{}).am$('def',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('svgElem','dom::Elem',false),new sys.Param('defElem','dom::Elem',false)]),{}).am$('defUrl',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('svgElem','dom::Elem',false),new sys.Param('defElem','dom::Elem',false)]),{}).am$('doTrap',32898,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('svgElem','dom::Elem',false),new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('fromCamel',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DomCoord.type$.am$('make',2052,'sys::Void',xp,{}).am$('lat',8704,'sys::Float',xp,{}).am$('lng',8704,'sys::Float',xp,{}).am$('accuracy',8704,'sys::Float',xp,{}).am$('altitude',8704,'sys::Float?',xp,{}).am$('altitudeAccuracy',8704,'sys::Float?',xp,{}).am$('heading',8704,'sys::Float?',xp,{}).am$('speed',8704,'sys::Float?',xp,{}).am$('ts',8704,'sys::Duration?',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
DomGraphicsEnv.type$.af$('images',67586,'concurrent::ConcurrentMap',{}).am$('image',271360,'graphics::Image',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('data','sys::Buf?',true)]),{}).am$('loadImage',2048,'dom::DomImage',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HttpReq.type$.af$('uri',73728,'sys::Uri',{}).af$('headers',73728,'[sys::Str:sys::Str]',{}).af$('async',73728,'sys::Bool',{}).af$('resType',73728,'sys::Str',{}).af$('withCredentials',73728,'sys::Bool',{}).af$('cbProgress',67584,'sys::Func?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('onProgress',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Int,sys::Int->sys::Void|',false)]),{}).am$('send',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Str',false),new sys.Param('content','sys::Obj?',false),new sys.Param('c','|dom::HttpRes->sys::Void|',false)]),{}).am$('get',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','|dom::HttpRes->sys::Void|',false)]),{}).am$('post',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('content','sys::Obj',false),new sys.Param('c','|dom::HttpRes->sys::Void|',false)]),{}).am$('postForm',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('form','[sys::Str:sys::Str]',false),new sys.Param('c','|dom::HttpRes->sys::Void|',false)]),{}).am$('postFormMultipart',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('form','[sys::Str:sys::Obj]',false),new sys.Param('c','|dom::HttpRes->sys::Void|',false)]),{});
ResizeObserver.type$.af$('callback',65664,'sys::Func?',{'sys::NoDoc':""}).am$('make',8196,'sys::Void',xp,{}).am$('observe',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('target','dom::Elem',false)]),{}).am$('unobserve',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('target','dom::Elem',false)]),{}).am$('disconnect',8704,'sys::This',xp,{}).am$('onResize',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('callback','|dom::ResizeObserverEntry[]->sys::Void|',false)]),{});
ResizeObserverEntry.type$.af$('target',73728,'dom::Elem',{}).af$('size',73730,'graphics::Size',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{});
DataTransfer.type$.af$('dropEffect',8704,'sys::Str',{}).af$('effectAllowed',8704,'sys::Str',{}).am$('types',8704,'sys::Str[]',xp,{}).am$('getData',8704,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false)]),{}).am$('setData',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false),new sys.Param('val','sys::Str',false)]),{}).am$('setDragImage',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('image','dom::Elem',false),new sys.Param('x','sys::Int',false),new sys.Param('y','sys::Int',false)]),{}).am$('files',8704,'dom::DomFile[]',xp,{}).am$('make',139268,'sys::Void',xp,{});
HttpRes.type$.af$('status',73728,'sys::Int',{}).af$('headers',73728,'[sys::Str:sys::Str]',{}).af$('content',73728,'sys::Str',{}).af$('contentBuf',73728,'sys::Buf',{}).am$('make',2052,'sys::Void',xp,{});
Doc.type$.af$('title',8704,'sys::Str',{}).am$('make',2052,'sys::Void',xp,{}).am$('head',8704,'dom::Elem',xp,{}).am$('body',8704,'dom::Elem',xp,{}).am$('activeElem',8704,'dom::Elem?',xp,{}).am$('elemById',8704,'dom::Elem?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{}).am$('elemFromPos',8704,'dom::Elem?',sys.List.make(sys.Param.type$,[new sys.Param('p','graphics::Point',false)]),{}).am$('elemsFromPos',8704,'dom::Elem[]',sys.List.make(sys.Param.type$,[new sys.Param('p','graphics::Point',false)]),{}).am$('createElem',8704,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('tagName','sys::Str',false),new sys.Param('attrib','[sys::Str:sys::Str]?',true),new sys.Param('ns','sys::Uri?',true)]),{}).am$('createFrag',8704,'dom::Elem',xp,{'sys::NoDoc':""}).am$('querySelector',8704,'dom::Elem?',sys.List.make(sys.Param.type$,[new sys.Param('selectors','sys::Str',false)]),{}).am$('querySelectorAll',8704,'dom::Elem[]',sys.List.make(sys.Param.type$,[new sys.Param('selectors','sys::Str',false)]),{}).am$('querySelectorAllType',8704,'dom::Elem[]',sys.List.make(sys.Param.type$,[new sys.Param('selectors','sys::Str',false),new sys.Param('type','sys::Type',false)]),{'sys::NoDoc':""}).am$('exportPng',8704,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('img','dom::Elem',false)]),{'sys::NoDoc':""}).am$('exportJpg',8704,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('img','dom::Elem',false),new sys.Param('quality','sys::Float?',false)]),{'sys::NoDoc':""}).am$('onEvent',8704,'sys::Func',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false),new sys.Param('useCapture','sys::Bool',false),new sys.Param('handler','|dom::Event->sys::Void|',false)]),{}).am$('removeEvent',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false),new sys.Param('useCapture','sys::Bool',false),new sys.Param('handler','sys::Func',false)]),{}).am$('exec',8704,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('defUi','sys::Bool',true),new sys.Param('val','sys::Obj?',true)]),{}).am$('out',8704,'web::WebOutStream',xp,{}).am$('cookies',8192,'[sys::Str:sys::Str]',xp,{}).am$('addCookie',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','web::Cookie',false)]),{}).am$('getCookiesStr',2560,'sys::Str',xp,{});
Key.type$.af$('a',106498,'dom::Key',{}).af$('b',106498,'dom::Key',{}).af$('c',106498,'dom::Key',{}).af$('d',106498,'dom::Key',{}).af$('e',106498,'dom::Key',{}).af$('f',106498,'dom::Key',{}).af$('g',106498,'dom::Key',{}).af$('h',106498,'dom::Key',{}).af$('i',106498,'dom::Key',{}).af$('j',106498,'dom::Key',{}).af$('k',106498,'dom::Key',{}).af$('l',106498,'dom::Key',{}).af$('m',106498,'dom::Key',{}).af$('n',106498,'dom::Key',{}).af$('o',106498,'dom::Key',{}).af$('p',106498,'dom::Key',{}).af$('q',106498,'dom::Key',{}).af$('r',106498,'dom::Key',{}).af$('s',106498,'dom::Key',{}).af$('t',106498,'dom::Key',{}).af$('u',106498,'dom::Key',{}).af$('v',106498,'dom::Key',{}).af$('w',106498,'dom::Key',{}).af$('x',106498,'dom::Key',{}).af$('y',106498,'dom::Key',{}).af$('z',106498,'dom::Key',{}).af$('num0',106498,'dom::Key',{}).af$('num1',106498,'dom::Key',{}).af$('num2',106498,'dom::Key',{}).af$('num3',106498,'dom::Key',{}).af$('num4',106498,'dom::Key',{}).af$('num5',106498,'dom::Key',{}).af$('num6',106498,'dom::Key',{}).af$('num7',106498,'dom::Key',{}).af$('num8',106498,'dom::Key',{}).af$('num9',106498,'dom::Key',{}).af$('space',106498,'dom::Key',{}).af$('backspace',106498,'dom::Key',{}).af$('enter',106498,'dom::Key',{}).af$('delete',106498,'dom::Key',{}).af$('esc',106498,'dom::Key',{}).af$('tab',106498,'dom::Key',{}).af$('capsLock',106498,'dom::Key',{}).af$('semicolon',106498,'dom::Key',{}).af$('equal',106498,'dom::Key',{}).af$('comma',106498,'dom::Key',{}).af$('dash',106498,'dom::Key',{}).af$('period',106498,'dom::Key',{}).af$('slash',106498,'dom::Key',{}).af$('backtick',106498,'dom::Key',{}).af$('openBracket',106498,'dom::Key',{}).af$('backSlash',106498,'dom::Key',{}).af$('closeBracket',106498,'dom::Key',{}).af$('quote',106498,'dom::Key',{}).af$('left',106498,'dom::Key',{}).af$('up',106498,'dom::Key',{}).af$('right',106498,'dom::Key',{}).af$('down',106498,'dom::Key',{}).af$('pageUp',106498,'dom::Key',{}).af$('pageDown',106498,'dom::Key',{}).af$('home',106498,'dom::Key',{}).af$('end',106498,'dom::Key',{}).af$('insert',106498,'dom::Key',{}).af$('f1',106498,'dom::Key',{}).af$('f2',106498,'dom::Key',{}).af$('f3',106498,'dom::Key',{}).af$('f4',106498,'dom::Key',{}).af$('f5',106498,'dom::Key',{}).af$('f6',106498,'dom::Key',{}).af$('f7',106498,'dom::Key',{}).af$('f8',106498,'dom::Key',{}).af$('f9',106498,'dom::Key',{}).af$('f10',106498,'dom::Key',{}).af$('alt',106498,'dom::Key',{}).af$('shift',106498,'dom::Key',{}).af$('ctrl',106498,'dom::Key',{}).af$('meta',106498,'dom::Key',{}).af$('byCode',100354,'[sys::Int:dom::Key]',{}).af$('byName',100354,'[sys::Str:dom::Key]',{}).af$('name',73730,'sys::Str',{}).af$('code',73730,'sys::Int',{}).af$('symbol',73730,'sys::Str?',{}).am$('fromStr',40966,'dom::Key?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('fromCode',40962,'dom::Key',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Int',false)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Int',false),new sys.Param('name','sys::Str',false),new sys.Param('symbol','sys::Str?',true)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('isModifier',8192,'sys::Bool',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
DomFile.type$.am$('name',8704,'sys::Str',xp,{}).am$('ext',8192,'sys::Str?',xp,{}).am$('size',8704,'sys::Int',xp,{}).am$('type',8704,'sys::Str',xp,{}).am$('readAsDataUri',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Uri->sys::Void|',false)]),{}).am$('readAsText',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Event.type$.af$('stash',73728,'[sys::Str:sys::Obj?]',{}).am$('make',2052,'sys::Void',xp,{}).am$('makeMock',41474,'dom::Event',xp,{'sys::NoDoc':""}).am$('fromNative',41474,'dom::Event',sys.List.make(sys.Param.type$,[new sys.Param('event','sys::Obj',false)]),{'sys::Js':""}).am$('toNative',8704,'sys::Obj',xp,{'sys::Js':""}).am$('type',8704,'sys::Str',xp,{}).am$('target',8704,'dom::Elem',xp,{}).am$('relatedTarget',8704,'dom::Elem?',xp,{}).am$('pagePos',8704,'graphics::Point',xp,{}).am$('alt',8704,'sys::Bool',xp,{}).am$('ctrl',8704,'sys::Bool',xp,{}).am$('shift',8704,'sys::Bool',xp,{}).am$('meta',8704,'sys::Bool',xp,{}).am$('button',8704,'sys::Int?',xp,{}).am$('delta',8704,'graphics::Point?',xp,{}).am$('key',8704,'dom::Key?',xp,{}).am$('keyChar',8704,'sys::Str?',xp,{}).am$('err',8704,'sys::Err?',xp,{}).am$('stop',8704,'sys::Void',xp,{}).am$('get',8704,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('set',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{'sys::Operator':""}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('data',8704,'sys::Obj',xp,{}).am$('dataTransfer',8704,'dom::DataTransfer',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
HttpSocket.type$.am$('open',40962,'dom::HttpSocket',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('protocols','sys::Str[]?',false)]),{}).am$('make',2052,'sys::Void',xp,{}).am$('uri',8192,'sys::Uri',xp,{}).am$('send',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj',false)]),{}).am$('close',8192,'sys::This',xp,{}).am$('onOpen',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|dom::Event->sys::Void|',false)]),{}).am$('onReceive',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|dom::Event->sys::Void|',false)]),{}).am$('onClose',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|dom::Event->sys::Void|',false)]),{}).am$('onError',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|dom::Event->sys::Void|',false)]),{});
DomImage.type$.af$('uri',336898,'sys::Uri',{}).af$('mime',336898,'sys::MimeType',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('mime','sys::MimeType',false),new sys.Param('elem','dom::Elem',false)]),{}).am$('init',2560,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false)]),{}).am$('isLoaded',271872,'sys::Bool',xp,{}).am$('size',271872,'graphics::Size',xp,{}).am$('w',271872,'sys::Float',xp,{}).am$('h',271872,'sys::Float',xp,{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('prop','sys::Str',false)]),{'sys::Operator':""});
CssDim.type$.af$('defVal',106498,'dom::CssDim',{}).af$('val',73730,'sys::Num',{}).af$('unit',73730,'sys::Str',{}).af$('autoVal',100354,'dom::CssDim',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Num',false),new sys.Param('unit','sys::Str',false)]),{}).am$('fromStr',40966,'dom::CssDim?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
WeakMap.type$.am$('has',8704,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Obj',false)]),{}).am$('get',8704,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Obj',false)]),{'sys::Operator':""}).am$('set',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Obj',false),new sys.Param('val','sys::Obj',false)]),{'sys::Operator':""}).am$('delete',8704,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Obj',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Win.type$.af$('isMac',73730,'sys::Bool',{'sys::NoDoc':""}).af$('isWindows',73730,'sys::Bool',{'sys::NoDoc':""}).af$('isLinux',73730,'sys::Bool',{'sys::NoDoc':""}).af$('isWebkit',73730,'sys::Bool',{'sys::NoDoc':""}).af$('isChrome',73730,'sys::Bool',{'sys::NoDoc':""}).af$('isSafari',73730,'sys::Bool',{'sys::NoDoc':""}).af$('isFirefox',73730,'sys::Bool',{'sys::NoDoc':""}).af$('isIE',73730,'sys::Bool',{'sys::NoDoc':""}).af$('isEdge',73730,'sys::Bool',{'sys::NoDoc':""}).am$('make',2052,'sys::Void',xp,{}).am$('cur',41474,'dom::Win',xp,{}).am$('open',8704,'dom::Win',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',true),new sys.Param('winName','sys::Str?',true),new sys.Param('opts','[sys::Str:sys::Str]?',true)]),{}).am$('close',8704,'dom::Win',xp,{}).am$('doc',8704,'dom::Doc',xp,{}).am$('textSel',8704,'dom::TextSel',xp,{'sys::NoDoc':""}).am$('addStyleRules',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rules','sys::Str',false)]),{}).am$('alert',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('confirm',8704,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('viewport',8704,'graphics::Size',xp,{}).am$('screenSize',8704,'graphics::Size',xp,{}).am$('parent',8704,'dom::Win?',xp,{}).am$('top',8704,'dom::Win',xp,{}).am$('eval',41474,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('js','sys::Str',false)]),{}).am$('log',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('scrollPos',8704,'graphics::Point',xp,{}).am$('scrollTo',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Int',false),new sys.Param('y','sys::Int',false)]),{}).am$('scrollBy',8704,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Int',false),new sys.Param('y','sys::Int',false)]),{}).am$('uri',8704,'sys::Uri',xp,{}).am$('hyperlink',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('reload',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('force','sys::Bool',true)]),{}).am$('clipboardReadText',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str->sys::Void|',false)]),{}).am$('clipboardWriteText',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('text','sys::Str',false)]),{}).am$('hisBack',8704,'sys::Void',xp,{}).am$('hisForward',8704,'sys::Void',xp,{}).am$('hisPushState',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('title','sys::Str',false),new sys.Param('uri','sys::Uri',false),new sys.Param('map','[sys::Str:sys::Obj]',false)]),{}).am$('hisReplaceState',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('title','sys::Str',false),new sys.Param('uri','sys::Uri',false),new sys.Param('map','[sys::Str:sys::Obj]',false)]),{}).am$('onEvent',8704,'sys::Func',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false),new sys.Param('useCapture','sys::Bool',false),new sys.Param('handler','|dom::Event->sys::Void|',false)]),{}).am$('removeEvent',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false),new sys.Param('useCapture','sys::Bool',false),new sys.Param('handler','sys::Func',false)]),{}).am$('reqAnimationFrame',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('setTimeout',8704,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('delay','sys::Duration',false),new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('clearTimeout',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('timeoutId','sys::Int',false)]),{}).am$('setInterval',8704,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('delay','sys::Duration',false),new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('clearInterval',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('intervalId','sys::Int',false)]),{}).am$('geoCurPosition',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('onSuccess','|dom::DomCoord->sys::Void|',false),new sys.Param('onErr','|sys::Err->sys::Void|?',true),new sys.Param('opts','[sys::Str:sys::Obj]?',true)]),{}).am$('geoWatchPosition',8704,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('onSuccess','|dom::DomCoord->sys::Void|',false),new sys.Param('onErr','|sys::Err->sys::Void|?',true),new sys.Param('opts','[sys::Str:sys::Obj]?',true)]),{}).am$('geoClearWatch',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Int',false)]),{}).am$('sessionStorage',8704,'dom::Storage',xp,{}).am$('localStorage',8704,'dom::Storage',xp,{}).am$('userAgent',8704,'sys::Str',xp,{'sys::NoDoc':""}).am$('diagnostics',8704,'[sys::Str:sys::Obj]',xp,{'sys::NoDoc':""});
KeyFrames.type$.af$('frames',73730,'dom::KeyFrame[]',{}).af$('name',65666,'sys::Str',{}).af$('id',100354,'concurrent::AtomicInt',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('frames','dom::KeyFrame[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
KeyFrame.type$.af$('step',73730,'sys::Str',{}).af$('props',73730,'[sys::Str:sys::Obj]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('step','sys::Str',false),new sys.Param('props','[sys::Str:sys::Obj]',false)]),{});
DomTest.type$.am$('onGet',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
DomTestClient.type$.af$('verifies',67584,'sys::Int',{}).am$('testEmpty',8192,'sys::Void',xp,{}).am$('testBasics',8192,'sys::Void',xp,{}).am$('testAttrs',8192,'sys::Void',xp,{}).am$('testCreate',8192,'sys::Void',xp,{}).am$('testAddRemove',8192,'sys::Void',xp,{}).am$('testStyle',8192,'sys::Void',xp,{}).am$('testSvg',8192,'sys::Void',xp,{}).am$('verify',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Bool',false)]),{}).am$('verifyEq',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false)]),{}).am$('verifyAttrProp',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false),new sys.Param('name','sys::Str',false),new sys.Param('attrVal','sys::Str?',false),new sys.Param('propVal','sys::Obj?',true)]),{}).am$('verifyAttr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false),new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Str?',false)]),{}).am$('verifyProp',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false),new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
JavaTest.type$.am$('testElemBasics',8192,'sys::Void',xp,{}).am$('testAttrs',8192,'sys::Void',xp,{}).am$('testStyleBasics',8192,'sys::Void',xp,{}).am$('testClassAttr',8192,'sys::Void',xp,{}).am$('testQuerySelector',8192,'sys::Void',xp,{}).am$('testSvg',8192,'sys::Void',xp,{}).am$('verifyAttrProp',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false),new sys.Param('name','sys::Str',false),new sys.Param('attrVal','sys::Str?',false),new sys.Param('propVal','sys::Obj?',true)]),{}).am$('verifyAttr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false),new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Str?',false)]),{}).am$('verifyProp',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem',false),new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
GeomTest.type$.am$('testCssDim',8192,'sys::Void',xp,{}).am$('verifyCssDim',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('d','dom::CssDim',false),new sys.Param('v','sys::Num',false),new sys.Param('u','sys::Str',false)]),{}).am$('verifySer',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ClipboardTest.type$.am$('onGet',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
ClipboardTestUi.type$.am$('write',40962,'sys::Void',xp,{}).am$('read',40962,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "dom");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;concurrent 1.0;graphics 1.0;web 1.0");
m.set("pod.summary", "Web Browser DOM API");
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
m.set("pod.native.java", "true");
m.set("vcs.uri", "https://github.com/fantom-lang/fantom");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "true");
p.__meta(m);



// cjs exports begin
export {
  Storage,
  StoragePeer,
  MutationObserver,
  MutationObserverPeer,
  MutationRec,
  TextSel,
  TextSelPeer,
  Elem,
  ElemPeer,
  Style,
  StylePeer,
  Svg,
  DomCoord,
  DomCoordPeer,
  DomGraphicsEnv,
  HttpReq,
  HttpReqPeer,
  ResizeObserver,
  ResizeObserverPeer,
  ResizeObserverEntry,
  DataTransfer,
  DataTransferPeer,
  HttpRes,
  Doc,
  DocPeer,
  Key,
  DomFile,
  DomFilePeer,
  Event,
  EventPeer,
  HttpSocket,
  CssDim,
  WeakMap,
  WeakMapPeer,
  Win,
  WinPeer,
  KeyFrames,
  KeyFrame,
  DomTest,
  JavaTest,
  GeomTest,
  ClipboardTest,
};
