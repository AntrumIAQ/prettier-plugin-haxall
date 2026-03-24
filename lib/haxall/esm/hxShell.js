// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as graphics from './graphics.js'
import * as inet from './inet.js'
import * as rdf from './rdf.js'
import * as util from './util.js'
import * as web from './web.js'
import * as dom from './dom.js'
import * as domkit from './domkit.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
import * as axon from './axon.js'
import * as def from './def.js'
import * as folio from './folio.js'
import * as obs from './obs.js'
import * as hx from './hx.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class HxShellWeb extends hx.HxLibWeb {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxShellWeb.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #title = null;

  title() { return this.#title; }

  __title(it) { if (it === undefined) return this.#title; else this.#title = it; }

  #favicon = null;

  favicon() { return this.#favicon; }

  __favicon(it) { if (it === undefined) return this.#favicon; else this.#favicon = it; }

  static make(lib) {
    const $self = new HxShellWeb();
    HxShellWeb.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    hx.HxLibWeb.make$($self, lib);
    $self.#lib = lib;
    $self.#title = sys.Str.plus(sys.Str.plus("", $self.rt().platform().productName()), " Shell");
    $self.#favicon = $self.rt().platform().faviconUri();
    return;
  }

  onService() {
    let cx = this.rt().user().authenticate(this.req(), this.res());
    if (cx == null) {
      return;
    }
    ;
    if (!cx.user().isSu()) {
      return this.res().sendErr(403);
    }
    ;
    let route = this.req().modRel().path().getSafe(0);
    let $_u0 = route;
    if (sys.ObjUtil.equals($_u0, null)) {
      return this.onHtml(sys.ObjUtil.coerce(cx, hx.HxContext.type$));
    }
    else if (sys.ObjUtil.equals($_u0, "shell.css")) {
      return this.onCss();
    }
    else if (sys.ObjUtil.equals($_u0, "shell.js")) {
      return this.onJs();
    }
    else {
      return this.res().sendErr(404);
    }
    ;
  }

  onHtml(cx) {
    if (sys.ObjUtil.compareNE(this.req().method(), "GET")) {
      this.res().sendErr(501);
      return;
    }
    ;
    let env = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    env.set("main", "hxShell::Shell.main");
    env.set("hxShell.api", cx.rt().http().apiUri().toStr());
    env.set("hxShell.attestKey", cx.session().attestKey());
    env.set("hxShell.user", haystack.ZincWriter.valToStr(cx.user().meta()));
    this.res().headers().set("Content-Type", "text/html; charset=utf-8");
    let out = this.res().out();
    out.docType5().html().head().title().w(this.#title).titleEnd().tag("meta", "charset='UTF-8'", true).nl().tag("meta", "name='google' content='notranslate'", true).nl().tag("link", sys.Str.plus(sys.Str.plus("rel='icon' type='image/png' href='", this.#favicon), "'"), true).nl().includeCss(this.uri().plus(sys.Uri.fromStr("shell.css"))).initJs(env).includeJs(this.uri().plus(sys.Uri.fromStr("shell.js")));
    out.headEnd();
    out.body().bodyEnd();
    out.htmlEnd();
    return;
  }

  onCss() {
    let pack = web.FilePack.makeFiles(web.FilePack.toAppCssFiles(this.pods()));
    pack.onService();
    return;
  }

  onJs() {
    let pack = web.FilePack.makeFiles(web.FilePack.toAppJsFiles(this.pods()));
    pack.onService();
    return;
  }

  pods() {
    return sys.List.make(sys.Pod.type$.toNullable(), [sys.ObjUtil.typeof(this).pod()]);
  }

}

class HxShellLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
    this.#web = HxShellWeb.make(this);
    return;
  }

  typeof() { return HxShellLib.type$; }

  #web = null;

  web() { return this.#web; }

  __web(it) { if (it === undefined) return this.#web; else this.#web = it; }

  static make() {
    const $self = new HxShellLib();
    HxShellLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    ;
    return;
  }

}

class ShellState extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ShellState.type$; }

  #expr = null;

  expr() { return this.#expr; }

  __expr(it) { if (it === undefined) return this.#expr; else this.#expr = it; }

  #grid = null;

  grid() { return this.#grid; }

  __grid(it) { if (it === undefined) return this.#grid; else this.#grid = it; }

  #viewType = null;

  viewType() { return this.#viewType; }

  __viewType(it) { if (it === undefined) return this.#viewType; else this.#viewType = it; }

  #selection = null;

  selection() { return this.#selection; }

  __selection(it) { if (it === undefined) return this.#selection; else this.#selection = it; }

  static makeInit() {
    return ShellState.make("", haystack.Etc.emptyGrid(), ShellViewType.table(), sys.ObjUtil.coerce(haystack.Dict.type$.emptyList(), sys.Type.find("haystack::Dict[]")));
  }

  static makeEvalOk(expr,grid) {
    return ShellState.make(expr, grid, ShellViewType.toBest(grid), sys.ObjUtil.coerce(haystack.Dict.type$.emptyList(), sys.Type.find("haystack::Dict[]")));
  }

  static makeEvalErr(expr,errGrid) {
    return ShellState.make(expr, errGrid, ShellViewType.table(), sys.ObjUtil.coerce(haystack.Dict.type$.emptyList(), sys.Type.find("haystack::Dict[]")));
  }

  static make(expr,grid,viewType,selection) {
    const $self = new ShellState();
    ShellState.make$($self,expr,grid,viewType,selection);
    return $self;
  }

  static make$($self,expr,grid,viewType,selection) {
    $self.#expr = expr;
    $self.#grid = grid;
    $self.#viewType = viewType;
    $self.#selection = sys.ObjUtil.coerce(((this$) => { let $_u1 = selection; if ($_u1 == null) return null; return sys.ObjUtil.toImmutable(selection); })($self), sys.Type.find("haystack::Dict[]"));
    return;
  }

  setViewType(t) {
    return ShellState.make(this.#expr, this.#grid, t, sys.ObjUtil.coerce(haystack.Dict.type$.emptyList(), sys.Type.find("haystack::Dict[]")));
  }

  setSelection(sel) {
    return ShellState.make(this.#expr, this.#grid, this.#viewType, sel);
  }

}

class ShellInput extends domkit.Box {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#his = ShellHistory.make();
    return;
  }

  typeof() { return ShellInput.type$; }

  #sh = null;

  // private field reflection only
  __sh(it) { if (it === undefined) return this.#sh; else this.#sh = it; }

  #prompt = null;

  // private field reflection only
  __prompt(it) { if (it === undefined) return this.#prompt; else this.#prompt = it; }

  #his = null;

  // private field reflection only
  __his(it) { if (it === undefined) return this.#his; else this.#his = it; }

  static make(sh) {
    const $self = new ShellInput();
    ShellInput.make$($self,sh);
    return $self;
  }

  static make$($self,sh) {
    const this$ = $self;
    domkit.Box.make$($self);
    ;
    $self.#sh = sh;
    $self.#prompt = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.TextField.make(), (it) => {
      it.style().addClass("mono");
      it.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), ["100%"]));
      it.onEvent("keydown", false, (e) => {
        this$.onKeyDown(e);
        return;
      });
      return;
    }), domkit.TextField.type$);
    $self.add($self.#prompt);
    return;
  }

  onKeyDown(e) {
    let $_u2 = e.key();
    if (sys.ObjUtil.equals($_u2, dom.Key.enter())) {
      e.stop();
      this.onEval();
    }
    else if (sys.ObjUtil.equals($_u2, dom.Key.up())) {
      e.stop();
      this.onArrowUp();
    }
    else if (sys.ObjUtil.equals($_u2, dom.Key.down())) {
      e.stop();
      this.onArrowDown();
    }
    ;
    return;
  }

  focus() {
    this.#prompt.focus();
    return;
  }

  addToHis(expr) {
    this.#his.push(expr);
    return;
  }

  update(expr) {
    this.#prompt.val(expr);
    this.#prompt.select(sys.Str.size(expr), sys.Str.size(expr));
    return;
  }

  onEval() {
    let expr = sys.Str.trim(this.#prompt.val());
    if (sys.ObjUtil.equals(sys.Str.size(expr), 0)) {
      return;
    }
    ;
    this.#his.push(expr);
    this.update("");
    this.#sh.eval(expr, false);
    return;
  }

  onArrowUp() {
    let expr = this.#his.up();
    if (expr != null) {
      this.update(sys.ObjUtil.coerce(expr, sys.Str.type$));
    }
    ;
    return;
  }

  onArrowDown() {
    let expr = this.#his.down();
    if (expr != null) {
      this.update(sys.ObjUtil.coerce(expr, sys.Str.type$));
    }
    else {
      this.onRecent();
    }
    ;
    return;
  }

  onRecent() {
    const this$ = this;
    let menu = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Menu.make(), (it) => {
      it.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(this$.#prompt.size().w(), sys.Num.type$)), sys.Obj.type$.toNullable())), "px")]));
      it.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), ["60%"]));
      it.onClose((it) => {
        this$.#prompt.focus();
        return;
      });
      return;
    }), domkit.Menu.type$);
    this.#his.list().each((x) => {
      menu.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.MenuItem.make(), (it) => {
        it.text(x);
        it.onAction((it) => {
          this$.update(x);
          return;
        });
        return;
      }), domkit.MenuItem.type$));
      return;
    });
    let p = this.#prompt.pagePos();
    menu.select(sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()));
    menu.open(p.x(), sys.Float.plus(p.y(), this.#prompt.size().h()));
    return;
  }

}

class ShellHistory extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#list = sys.List.make(sys.Str.type$);
    this.#index = -1;
    this.#key = "hxShell.his";
    this.#nc = 0;
    this.#max = 25;
    return;
  }

  typeof() { return ShellHistory.type$; }

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

  #key = null;

  // private field reflection only
  __key(it) { if (it === undefined) return this.#key; else this.#key = it; }

  #nc = 0;

  // private field reflection only
  __nc(it) { if (it === undefined) return this.#nc; else this.#nc = it; }

  #max = 0;

  // private field reflection only
  __max(it) { if (it === undefined) return this.#max; else this.#max = it; }

  static make() {
    const $self = new ShellHistory();
    ShellHistory.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    try {
      let str = ((this$) => { let $_u3 = sys.ObjUtil.as(dom.Win.cur().localStorage().get(this$.#key), sys.Str.type$); if ($_u3 != null) return $_u3; return ""; })($self);
      $self.#list = ((this$) => { if (sys.Str.isEmpty(str)) return sys.List.make(sys.Str.type$); return sys.Str.split(str, sys.ObjUtil.coerce(this$.#nc, sys.Int.type$.toNullable())); })($self);
    }
    catch ($_u5) {
      $_u5 = sys.Err.make($_u5);
      if ($_u5 instanceof sys.Err) {
        let e = $_u5;
        ;
        e.trace();
      }
      else {
        throw $_u5;
      }
    }
    ;
    return;
  }

  up() {
    if (sys.ObjUtil.compareGE(sys.Int.plus(this.#index, 1), this.#list.size())) {
      return null;
    }
    ;
    let val = this.#list.get(this.#index = sys.Int.increment(this.#index));
    return val;
  }

  down() {
    if (sys.ObjUtil.compareLT(sys.Int.minus(this.#index, 1), 0)) {
      return null;
    }
    ;
    let val = this.#list.get(this.#index = sys.Int.decrement(this.#index));
    return val;
  }

  push(item) {
    this.#list = this.#list.insert(0, item).unique();
    if (sys.ObjUtil.compareGT(this.#list.size(), this.#max)) {
      this.#list = this.#list.getRange(sys.Range.make(0, this.#max, true));
    }
    ;
    dom.Win.cur().localStorage().set(this.#key, this.#list.join(sys.Int.toChar(this.#nc)));
    this.#index = -1;
    return;
  }

}

class ShellCommands extends domkit.FlexBox {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
  }

  typeof() { return ShellCommands.type$; }

  #sh = null;

  // private field reflection only
  __sh(it) { if (it === undefined) return this.#sh; else this.#sh = it; }

  #newRec = null;

  // private field reflection only
  __newRec(it) { if (it === undefined) return this.#newRec; else this.#newRec = it; }

  #edit = null;

  // private field reflection only
  __edit(it) { if (it === undefined) return this.#edit; else this.#edit = it; }

  #trash = null;

  // private field reflection only
  __trash(it) { if (it === undefined) return this.#trash; else this.#trash = it; }

  #meta = null;

  // private field reflection only
  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #views = null;

  // private field reflection only
  __views(it) { if (it === undefined) return this.#views; else this.#views = it; }

  static make(sh) {
    const $self = new ShellCommands();
    ShellCommands.make$($self,sh);
    return $self;
  }

  static make$($self,sh) {
    const this$ = $self;
    domkit.FlexBox.make$($self);
    $self.#sh = sh;
    $self.#newRec = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Button.make(), (it) => {
      it.text("New");
      it.onAction((it) => {
        this$.onNew();
        return;
      });
      return;
    }), domkit.Button.type$);
    $self.#edit = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Button.make(), (it) => {
      it.text("Edit");
      it.onAction((it) => {
        this$.onEdit();
        return;
      });
      it.enabled(sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()));
      return;
    }), domkit.Button.type$);
    $self.#trash = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Button.make(), (it) => {
      it.text("Trash");
      it.onAction((it) => {
        this$.onTrash();
        return;
      });
      it.enabled(sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()));
      return;
    }), domkit.Button.type$);
    $self.#meta = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Button.make(), (it) => {
      it.text("Meta");
      it.onAction((it) => {
        this$.onMeta();
        return;
      });
      return;
    }), domkit.Button.type$);
    $self.#views = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Button.make(), (it) => {
      it.style().addClass("disclosure");
      it.onPopup((it) => {
        return this$.onViews();
      });
      it.style().trap("marginLeft", sys.List.make(sys.Obj.type$.toNullable(), ["auto"]));
      return;
    }), domkit.Button.type$);
    $self.flex(sys.List.make(sys.Str.type$, ["0 0 auto", "0 0 auto"]));
    $self.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.FlowBox.make(), (it) => {
      it.gaps(sys.List.make(sys.Str.type$, ["4px", "4px", "16px"]));
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(it.add(this$.#newRec), domkit.FlowBox.type$).add(this$.#edit), domkit.FlowBox.type$).add(this$.#trash), domkit.FlowBox.type$).add(this$.#meta);
      return;
    }), domkit.FlowBox.type$));
    $self.add($self.#views);
    return;
  }

  update(old,cur) {
    this.#views.text(this.#sh.state().viewType().dis());
    this.#edit.enabled(sys.ObjUtil.coerce(!cur.selection().isEmpty(), sys.Bool.type$.toNullable()));
    this.#trash.enabled(sys.ObjUtil.coerce(!cur.selection().isEmpty(), sys.Bool.type$.toNullable()));
    return;
  }

  onNew() {
    const this$ = this;
    ShellDialog.promptTrio("New", "dis:\"New Rec\"", (recs) => {
      let req = haystack.Etc.makeDictsGrid(sys.Map.__fromLiteral(["commit"], ["add"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), recs);
      this$.#sh.session().call("commit", req).onOk((res) => {
        this$.gotoIds(res);
        return;
      });
      return;
    });
    return;
  }

  onEdit() {
    const this$ = this;
    let trio = ShellUtil.recsToEditTrio(this.#sh.state().selection());
    ShellDialog.promptTrio("Edit", sys.Str.toStr(trio), (recs) => {
      let req = haystack.Etc.makeDictsGrid(sys.Map.__fromLiteral(["commit"], ["update"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), recs);
      this$.#sh.session().call("commit", req).onOk((res) => {
        this$.#sh.refresh();
        return;
      });
      return;
    });
    return;
  }

  gotoIds(res) {
    const this$ = this;
    let ids = res.mapToList((r) => {
      return r.id();
    }, haystack.Ref.type$);
    if (sys.ObjUtil.equals(ids.size(), 1)) {
      this.#sh.eval(sys.Str.plus(sys.Str.plus("readById(", haystack.Etc.toAxon(ids.first())), ")"), true);
    }
    else {
      this.#sh.eval(sys.Str.plus(sys.Str.plus("readByIds(", haystack.Etc.toAxon(ids)), ")"), true);
    }
    ;
    return;
  }

  onTrash() {
    const this$ = this;
    let sel = this.#sh.state().selection();
    let aux = ((this$) => { if (sys.ObjUtil.equals(sel.size(), 1)) return sys.Str.plus("Selection: ", sel.get(0).dis()); return sys.Str.plus(sys.Str.plus("Selection: ", sys.ObjUtil.coerce(sel.size(), sys.Obj.type$.toNullable())), " records"); })(this);
    ShellDialog.confirm("Move recs to trash?", aux, () => {
      let rows = sel.map((r) => {
        return haystack.Etc.makeDict3("id", r.id(), "mod", r.trap("mod", sys.List.make(sys.Obj.type$.toNullable(), [])), "trash", haystack.Marker.val());
      }, haystack.Dict.type$);
      let req = haystack.Etc.makeDictsGrid(sys.Map.__fromLiteral(["commit"], ["update"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), sys.ObjUtil.coerce(rows, sys.Type.find("haystack::Dict?[]")));
      this$.#sh.session().call("commit", req).onOk((res) => {
        this$.#sh.refresh();
        return;
      });
      return;
    });
    return;
  }

  onMeta() {
    const this$ = this;
    let grid = this.#sh.grid();
    let s = sys.StrBuf.make();
    s.add("=== grid ===\n");
    s.add(haystack.TrioWriter.dictToStr(grid.meta()));
    grid.cols().each((col) => {
      s.add(sys.Str.plus(sys.Str.plus("\n=== col ", col.name()), " ===\n"));
      s.add(haystack.TrioWriter.dictToStr(col.meta()));
      return;
    });
    ShellDialog.openText("Grid Meta", s.toStr());
    return;
  }

  onViews() {
    const this$ = this;
    let menu = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Menu.make(), (it) => {
      return;
    }), domkit.Menu.type$);
    ShellViewType.vals().each((v) => {
      menu.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.MenuItem.make(), (it) => {
        it.text(v.dis());
        it.onAction((it) => {
          this$.#sh.update(this$.#sh.state().setViewType(v));
          return;
        });
        return;
      }), domkit.MenuItem.type$));
      return;
    });
    return menu;
  }

}

class ShellTable extends domkit.Table {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
  }

  typeof() { return ShellTable.type$; }

  static #headerFont = undefined;

  static headerFont() {
    if (ShellTable.#headerFont === undefined) {
      ShellTable.static$init();
      if (ShellTable.#headerFont === undefined) ShellTable.#headerFont = null;
    }
    return ShellTable.#headerFont;
  }

  static #cellFont = undefined;

  static cellFont() {
    if (ShellTable.#cellFont === undefined) {
      ShellTable.static$init();
      if (ShellTable.#cellFont === undefined) ShellTable.#cellFont = null;
    }
    return ShellTable.#cellFont;
  }

  static #infoIcon = undefined;

  static infoIcon() {
    if (ShellTable.#infoIcon === undefined) {
      ShellTable.static$init();
      if (ShellTable.#infoIcon === undefined) ShellTable.#infoIcon = null;
    }
    return ShellTable.#infoIcon;
  }

  static make(grid) {
    const $self = new ShellTable();
    ShellTable.make$($self,grid);
    return $self;
  }

  static make$($self,grid) {
    const this$ = $self;
    domkit.Table.make$($self);
    $self.sel().multi(true);
    $self.model(ShellTableModel.make(grid));
    $self.onTableEvent("mousedown", (e) => {
      this$.onMouseDown(e);
      return;
    });
    $self.rebuild();
    return;
  }

  onMouseDown(e) {
    if ((sys.ObjUtil.equals(e.col(), 0) && sys.ObjUtil.compareLE(e.cellPos().x(), sys.Float.make(20.0)))) {
      this.onInfo(e);
    }
    ;
    return;
  }

  onInfo(e) {
    const this$ = this;
    let model = sys.ObjUtil.coerce(this.model(), ShellTableModel.type$);
    let row = model.grid().get(e.row());
    let info = sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make("pre"), (it) => {
      it.style().addClass("mono");
      it.style().trap("padding", sys.List.make(sys.Obj.type$.toNullable(), ["0 16px"]));
      it.text(haystack.TrioWriter.dictToStr(row));
      return;
    }), dom.Elem.type$);
    sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Popup.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Box.make(), (it) => {
        it.style().trap("overflow", sys.List.make(sys.Obj.type$.toNullable(), ["auto"]));
        it.add(info);
        return;
      }), domkit.Box.type$));
      return;
    }), domkit.Popup.type$).open(e.pagePos().x(), e.pagePos().y());
    return;
  }

  static static$init() {
    ShellTable.#headerFont = sys.ObjUtil.coerce(graphics.Font.fromStr("bold 9pt Helvetica"), graphics.Font.type$);
    ShellTable.#cellFont = sys.ObjUtil.coerce(graphics.Font.fromStr("9.75pt Helvetica"), graphics.Font.type$);
    ShellTable.#infoIcon = "\u24d8\u00a0\u00a0";
    return;
  }

}

class ShellTableModel extends domkit.TableModel {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ShellTableModel.type$; }

  #grid = null;

  grid() { return this.#grid; }

  __grid(it) { if (it === undefined) return this.#grid; else this.#grid = it; }

  #cols = null;

  // private field reflection only
  __cols(it) { if (it === undefined) return this.#cols; else this.#cols = it; }

  #colWidths = null;

  // private field reflection only
  __colWidths(it) { if (it === undefined) return this.#colWidths; else this.#colWidths = it; }

  static make(grid) {
    const $self = new ShellTableModel();
    ShellTableModel.make$($self,grid);
    return $self;
  }

  static make$($self,grid) {
    domkit.TableModel.make$($self);
    $self.#grid = grid;
    $self.#cols = grid.cols();
    $self.#colWidths = ShellTableModel.initColWidths(grid);
    return;
  }

  static initColWidths(grid) {
    const this$ = this;
    let hm = ShellTable.headerFont().metrics();
    let cm = ShellTable.cellFont().metrics();
    return sys.ObjUtil.coerce(grid.cols().map((col,i) => {
      return ShellTableModel.initColWidth(grid, col, i, hm, cm);
    }, sys.Int.type$), sys.Type.find("sys::Int[]"));
  }

  static initColWidth(grid,col,index,hm,cm) {
    let maxRow = sys.Int.min(grid.size(), 100);
    let prefw = hm.width(col.dis());
    for (let rowi = 0; sys.ObjUtil.compareLT(rowi, maxRow); rowi = sys.Int.increment(rowi)) {
      let row = grid.get(rowi);
      let text = row.dis(col.name());
      let textw = cm.width(sys.ObjUtil.coerce(text, sys.Str.type$));
      (prefw = sys.Float.max(prefw, textw));
    }
    ;
    (prefw = sys.Float.min(prefw, sys.Float.make(200.0)));
    if (sys.ObjUtil.equals(index, 0)) {
      prefw = sys.Float.plus(prefw, cm.width(ShellTable.infoIcon()));
    }
    ;
    return sys.Int.plus(sys.Num.toInt(sys.ObjUtil.coerce(prefw, sys.Num.type$)), 12);
  }

  numCols() {
    return this.#cols.size();
  }

  numRows() {
    return this.#grid.size();
  }

  onHeader(header,c) {
    header.text(this.#cols.get(c).dis());
    return;
  }

  colWidth(c) {
    return this.#colWidths.get(c);
  }

  item(r) {
    return this.#grid.get(r);
  }

  onCell(cell,c,r,flags) {
    let col = this.#cols.get(c);
    let row = this.#grid.get(r);
    let val = row.val(col);
    let text = row.dis(col.name());
    if (sys.ObjUtil.equals(c, 0)) {
      (text = sys.Str.plus(ShellTable.infoIcon(), text));
    }
    ;
    cell.text(sys.ObjUtil.coerce(text, sys.Str.type$));
    return;
  }

  sortCompare(c,r1,r2) {
    let col = this.#cols.get(c);
    let a = this.#grid.get(r1).val(col);
    let b = this.#grid.get(r2).val(col);
    return haystack.Etc.sortCompare(a, b);
  }

}

class ShellDialog extends domkit.Dialog {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#cbOk = () => {
      return true;
    };
    return;
  }

  typeof() { return ShellDialog.type$; }

  static #ok = undefined;

  static ok() {
    if (ShellDialog.#ok === undefined) {
      ShellDialog.static$init();
      if (ShellDialog.#ok === undefined) ShellDialog.#ok = null;
    }
    return ShellDialog.#ok;
  }

  static #cancel = undefined;

  static cancel() {
    if (ShellDialog.#cancel === undefined) {
      ShellDialog.static$init();
      if (ShellDialog.#cancel === undefined) ShellDialog.#cancel = null;
    }
    return ShellDialog.#cancel;
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

  #buttons = null;

  buttons(it) {
    if (it === undefined) {
      return this.#buttons;
    }
    else {
      this.#buttons = it;
      return;
    }
  }

  #cbOk = null;

  // private field reflection only
  __cbOk(it) { if (it === undefined) return this.#cbOk; else this.#cbOk = it; }

  static confirm(msg,extra,onOk) {
    const this$ = this;
    let content = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.FlexBox.make(), (it) => {
      it.style().trap("minWidth", sys.List.make(sys.Obj.type$.toNullable(), ["350px"]));
      sys.ObjUtil.coerce(it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Label.make(), (it) => {
        it.text("\u26a0");
        it.style().trap("fontSize", sys.List.make(sys.Obj.type$.toNullable(), ["48px"]));
        it.style().trap("padding", sys.List.make(sys.Obj.type$.toNullable(), ["0 16px 0 8px"]));
        it.style().trap("color", sys.List.make(sys.Obj.type$.toNullable(), ["#f39c12"]));
        return;
      }), domkit.Label.type$)), domkit.FlexBox.type$).add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Box.make(), (it) => {
        sys.ObjUtil.coerce(it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Box.make(), (it) => {
          it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Label.make(), (it) => {
            it.text(msg);
            it.style().trap("fontWeight", sys.List.make(sys.Obj.type$.toNullable(), ["bold"]));
            return;
          }), domkit.Label.type$));
          return;
        }), domkit.Box.type$)), domkit.Box.type$).add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Box.make(), (it) => {
          it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Label.make(), (it) => {
            it.text(extra);
            return;
          }), domkit.Label.type$));
          return;
        }), domkit.Box.type$));
        return;
      }), domkit.Box.type$));
      return;
    }), domkit.FlexBox.type$);
    ShellDialog.make((it) => {
      it.title("Confirm");
      it.#buttons = sys.List.make(sys.Str.type$, [ShellDialog.ok(), ShellDialog.cancel()]);
      it.#content = content;
      it.onOk(() => {
        sys.Func.call(onOk);
        return true;
      });
      return;
    }).open();
    return;
  }

  static openText(title,text) {
    const this$ = this;
    ShellDialog.make((it) => {
      it.title(title);
      it.#buttons = sys.List.make(sys.Str.type$, [ShellDialog.ok()]);
      it.#content = ShellDialog.makeTextArea(text);
      return;
    }).open();
    return;
  }

  static openErrGrid(g) {
    ShellDialog.openErr(sys.ObjUtil.coerce(g.meta().dis(), sys.Str.type$), sys.ObjUtil.coerce(((this$) => { let $_u7 = sys.ObjUtil.as(g.meta().get("errTrace"), sys.Str.type$); if ($_u7 != null) return $_u7; return ""; })(this), sys.Str.type$));
    return;
  }

  static openErr(dis,trace) {
    if (trace === undefined) trace = "";
    const this$ = this;
    ShellDialog.make((it) => {
      it.title("Error");
      it.#buttons = sys.List.make(sys.Str.type$, [ShellDialog.ok()]);
      it.#content = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Box.make(), (it) => {
        it.style().trap("minWidth", sys.List.make(sys.Obj.type$.toNullable(), ["350px"]));
        it.add(ShellUtil.errElemSmall(dis));
        if (!sys.Str.isEmpty(trace)) {
          it.add(ShellDialog.makeTextArea(trace));
        }
        ;
        return;
      }), domkit.Box.type$);
      return;
    }).open();
    return;
  }

  static promptTrio(title,trio,onOk) {
    const this$ = this;
    let textArea = ShellDialog.makeTextArea(trio);
    let errBox = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Box.make(), (it) => {
      it.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), ["32px"]));
      return;
    }), domkit.Box.type$);
    let timeoutId = null;
    ShellDialog.make((it) => {
      it.title(title);
      it.#buttons = sys.List.make(sys.Str.type$, [ShellDialog.ok(), ShellDialog.cancel()]);
      it.#content = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Box.make(), (it) => {
        sys.ObjUtil.coerce(it.add(textArea), domkit.Box.type$).add(errBox);
        return;
      }), domkit.Box.type$);
      it.onOk(() => {
        if (timeoutId != null) {
          dom.Win.cur().clearTimeout(sys.ObjUtil.coerce(timeoutId, sys.Int.type$));
          (timeoutId = null);
        }
        ;
        try {
          sys.Func.call(onOk, haystack.TrioReader.make(sys.Str.in(textArea.val())).readAllDicts());
          return true;
        }
        catch ($_u8) {
          $_u8 = sys.Err.make($_u8);
          if ($_u8 instanceof sys.Err) {
            let e = $_u8;
            ;
            sys.ObjUtil.coerce(errBox.removeAll(), domkit.Box.type$).add(ShellUtil.errElemSmall(e.toStr()));
            (timeoutId = sys.ObjUtil.coerce(dom.Win.cur().setTimeout(sys.Duration.fromStr("5sec"), (it) => {
              (timeoutId = null);
              errBox.removeAll();
              return;
            }), sys.Int.type$.toNullable()));
            return false;
          }
          else {
            throw $_u8;
          }
        }
        ;
      });
      return;
    }).open();
    return;
  }

  static makeTextArea(text) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.TextArea.make(), (it) => {
      it.val(text);
      it.style().trap("minWidth", sys.List.make(sys.Obj.type$.toNullable(), ["600px"]));
      it.style().trap("minHeight", sys.List.make(sys.Obj.type$.toNullable(), ["450px"]));
      return;
    }), domkit.TextArea.type$);
  }

  static make(f) {
    const $self = new ShellDialog();
    ShellDialog.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    const this$ = $self;
    domkit.Dialog.make$($self);
    ;
    sys.Func.call(f, $self);
    if ($self.title() == null) {
      throw sys.Err.make("title not set");
    }
    ;
    if ($self.#content == null) {
      throw sys.Err.make("content not set");
    }
    ;
    if (($self.#buttons == null || $self.#buttons.isEmpty())) {
      throw sys.Err.make("buttons not set");
    }
    ;
    $self.onKeyDown((e) => {
      if (ShellDialog.isDefaultAction(e)) {
        this$.fire(ShellDialog.ok());
      }
      ;
      if (sys.ObjUtil.equals(e.key(), dom.Key.esc())) {
        this$.fire(ShellDialog.cancel());
      }
      ;
      return;
    });
    $self.#content.style().trap("maxHeight", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Float.minusInt(dom.Win.cur().viewport().h(), 100), sys.Obj.type$.toNullable())), "px")]));
    $self.#content.style().trap("maxWidth", sys.List.make(sys.Obj.type$.toNullable(), [sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Float.minusInt(dom.Win.cur().viewport().w(), 100), sys.Obj.type$.toNullable())), "px")]));
    $self.#content.style().trap("overflow", sys.List.make(sys.Obj.type$.toNullable(), ["auto"]));
    let buttonsBox = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.FlowBox.make(), (it) => {
      it.gaps(sys.List.make(sys.Str.type$, ["4px"]));
      it.halign(domkit.Align.right());
      it.style().trap("padding", sys.List.make(sys.Obj.type$.toNullable(), ["8px"]));
      return;
    }), domkit.FlowBox.type$);
    $self.#buttons.each((b) => {
      buttonsBox.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Button.make(), (it) => {
        it.text(b);
        it.style().trap("minWidth", sys.List.make(sys.Obj.type$.toNullable(), ["60px"]));
        it.onAction((it) => {
          this$.fire(b);
          return;
        });
        return;
      }), domkit.Button.type$));
      return;
    });
    $self.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.SashBox.make(), (it) => {
      it.dir(domkit.Dir.down());
      it.sizes(sys.List.make(sys.Str.type$, ["auto", "auto"]));
      sys.ObjUtil.coerce(it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Box.make(), (it) => {
        it.style().trap("padding", sys.List.make(sys.Obj.type$.toNullable(), ["0 8px"]));
        it.add(this$.#content);
        return;
      }), domkit.Box.type$)), domkit.SashBox.type$).add(buttonsBox);
      return;
    }), domkit.SashBox.type$));
    return;
  }

  onOk(f) {
    this.#cbOk = f;
    return;
  }

  fire(name) {
    let $_u9 = name;
    if (sys.ObjUtil.equals($_u9, ShellDialog.ok())) {
      if (sys.ObjUtil.coerce(sys.Func.call(this.#cbOk, this), sys.Bool.type$)) {
        this.close();
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u9, ShellDialog.cancel())) {
      this.close();
    }
    ;
    return;
  }

  static isDefaultAction(e) {
    if (sys.ObjUtil.compareNE(e.key(), dom.Key.enter())) {
      return false;
    }
    ;
    if (!ShellDialog.isTextArea(e.target())) {
      return true;
    }
    ;
    return (e.ctrl() || e.meta());
  }

  static isTextArea(elem) {
    return sys.ObjUtil.equals(((this$) => { let $_u10 = elem; if ($_u10 == null) return null; return elem.tagName(); })(this), "textarea");
  }

  static static$init() {
    ShellDialog.#ok = "OK";
    ShellDialog.#cancel = "Cancel";
    return;
  }

}

class Shell extends domkit.Box {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
    this.#session = Session.make();
    this.#stateRef = ShellState.makeInit();
    this.#input = ShellInput.make(this);
    this.#commands = ShellCommands.make(this);
    this.#view = ShellView.make(this);
    return;
  }

  typeof() { return Shell.type$; }

  #session = null;

  session() { return this.#session; }

  __session(it) { if (it === undefined) return this.#session; else this.#session = it; }

  #stateRef = null;

  // private field reflection only
  __stateRef(it) { if (it === undefined) return this.#stateRef; else this.#stateRef = it; }

  #input = null;

  input(it) {
    if (it === undefined) {
      return this.#input;
    }
    else {
      this.#input = it;
      return;
    }
  }

  #commands = null;

  commands(it) {
    if (it === undefined) {
      return this.#commands;
    }
    else {
      this.#commands = it;
      return;
    }
  }

  #view = null;

  view(it) {
    if (it === undefined) {
      return this.#view;
    }
    else {
      this.#view = it;
      return;
    }
  }

  static main() {
    let sh = Shell.make();
    dom.Win.cur().doc().body().add(sh);
    sh.#input.focus();
    return;
  }

  static make() {
    const $self = new Shell();
    Shell.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    domkit.Box.make$($self);
    ;
    let titleBar = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.FlexBox.make(), (it) => {
      it.flex(sys.List.make(sys.Str.type$, ["0 0 auto", "0 0 auto"]));
      it.style().trap("padding", sys.List.make(sys.Obj.type$.toNullable(), ["0 8px"]));
      it.style().trap("background", sys.List.make(sys.Obj.type$.toNullable(), ["#798ba4"]));
      sys.ObjUtil.coerce(it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Label.make(), (it) => {
        it.text(dom.Win.cur().doc().title());
        it.style().trap("fontSize", sys.List.make(sys.Obj.type$.toNullable(), ["20px"]));
        it.style().trap("fontWeight", sys.List.make(sys.Obj.type$.toNullable(), ["bold"]));
        it.style().trap("color", sys.List.make(sys.Obj.type$.toNullable(), ["white"]));
        return;
      }), domkit.Label.type$)), domkit.FlexBox.type$).add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Label.make(), (it) => {
        it.text(sys.ObjUtil.coerce(this$.#session.user().dis(), sys.Str.type$));
        it.style().trap("fontSize", sys.List.make(sys.Obj.type$.toNullable(), ["14px"]));
        it.style().trap("color", sys.List.make(sys.Obj.type$.toNullable(), ["white"]));
        it.style().trap("marginLeft", sys.List.make(sys.Obj.type$.toNullable(), ["auto"]));
        return;
      }), domkit.Label.type$));
      return;
    }), domkit.FlexBox.type$);
    let inputBar = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Box.make(), (it) => {
      it.style().trap("padding", sys.List.make(sys.Obj.type$.toNullable(), ["8px"]));
      it.add(this$.#input);
      return;
    }), domkit.Box.type$);
    let commandBar = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Box.make(), (it) => {
      it.style().trap("padding", sys.List.make(sys.Obj.type$.toNullable(), ["0 8px"]));
      it.add(this$.#commands);
      return;
    }), domkit.Box.type$);
    let viewBox = sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Box.make(), (it) => {
      it.style().trap("padding", sys.List.make(sys.Obj.type$.toNullable(), ["8px"]));
      this$.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), ["100%"]));
      it.add(this$.#view);
      return;
    }), domkit.Box.type$);
    $self.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.FlexBox.make(), (it) => {
      it.flex(sys.List.make(sys.Str.type$, ["none", "none", "none", "1 1 0"]));
      it.dir("column");
      it.style().trap("width", sys.List.make(sys.Obj.type$.toNullable(), ["100%"]));
      it.style().trap("padding", sys.List.make(sys.Obj.type$.toNullable(), ["0"]));
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(it.add(titleBar), domkit.FlexBox.type$).add(inputBar), domkit.FlexBox.type$).add(commandBar), domkit.FlexBox.type$).add(viewBox);
      return;
    }), domkit.FlexBox.type$));
    return;
  }

  eval(expr,addToHis) {
    const this$ = this;
    if (addToHis) {
      this.#input.addToHis(expr);
    }
    ;
    this.#session.eval(expr).onOk((grid) => {
      this$.update(ShellState.makeEvalOk(expr, grid));
      return;
    }).onErr((grid) => {
      this$.update(ShellState.makeEvalErr(expr, grid));
      return;
    });
    return;
  }

  update(state) {
    let old = this.#stateRef;
    let cur = state;
    this.#stateRef = cur;
    this.#view.update(old, cur);
    this.#commands.update(old, cur);
    this.#input.focus();
    return;
  }

  refresh() {
    this.eval(this.state().expr(), false);
    return;
  }

  state() {
    return this.#stateRef;
  }

  grid() {
    return this.state().grid();
  }

}

class ShellView extends domkit.Box {
  constructor() {
    super();
    this.peer = new dom.ElemPeer(this);
    const this$ = this;
  }

  typeof() { return ShellView.type$; }

  #sh = null;

  // private field reflection only
  __sh(it) { if (it === undefined) return this.#sh; else this.#sh = it; }

  static make(sh) {
    const $self = new ShellView();
    ShellView.make$($self,sh);
    return $self;
  }

  static make$($self,sh) {
    domkit.Box.make$($self);
    $self.#sh = sh;
    $self.updateTextArea("Try out some Axon!");
    return;
  }

  update(old,cur) {
    const this$ = this;
    if ((old.grid() === cur.grid() && old.viewType() === cur.viewType())) {
      return;
    }
    ;
    this.removeAll();
    let $_u11 = cur.viewType();
    if (sys.ObjUtil.equals($_u11, ShellViewType.table())) {
      this.updateTable();
    }
    else if (sys.ObjUtil.equals($_u11, ShellViewType.text())) {
      this.updateText();
    }
    else if (sys.ObjUtil.equals($_u11, ShellViewType.csv())) {
      this.updateGridWriter(haystack.CsvWriter.type$);
    }
    else if (sys.ObjUtil.equals($_u11, ShellViewType.json())) {
      this.updateGridWriter(haystack.JsonWriter.type$);
    }
    else if (sys.ObjUtil.equals($_u11, ShellViewType.trio())) {
      this.updateGridWriter(haystack.TrioWriter.type$);
    }
    else if (sys.ObjUtil.equals($_u11, ShellViewType.zinc())) {
      this.updateGridWriter(haystack.ZincWriter.type$);
    }
    else {
      this.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Label.make(), (it) => {
        it.text(sys.Str.plus("Unsupported: ", cur.viewType()));
        return;
      }), domkit.Label.type$));
    }
    ;
    return;
  }

  updateErr() {
    const this$ = this;
    let meta = this.#sh.grid().meta();
    this.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.Box.make(), (it) => {
      it.style().addClass("domkit-border");
      it.style().trap("background", sys.List.make(sys.Obj.type$.toNullable(), ["#fff"]));
      it.style().trap("padding", sys.List.make(sys.Obj.type$.toNullable(), ["12px"]));
      it.style().trap("height", sys.List.make(sys.Obj.type$.toNullable(), ["calc(100% - 18px)"]));
      it.style().trap("overflow", sys.List.make(sys.Obj.type$.toNullable(), ["auto"]));
      sys.ObjUtil.coerce(it.add(ShellUtil.errElemBig(sys.ObjUtil.coerce(meta.dis(), sys.Str.type$))), domkit.Box.type$).add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make("pre"), (it) => {
        it.text(sys.ObjUtil.coerce(((this$) => { let $_u12 = meta.get("errTrace"); if ($_u12 != null) return $_u12; return "No trace"; })(this$), sys.Str.type$));
        return;
      }), dom.Elem.type$));
      return;
    }), domkit.Box.type$));
    return;
  }

  updateTable() {
    const this$ = this;
    if (this.#sh.grid().isErr()) {
      return this.updateErr();
    }
    ;
    let table = sys.ObjUtil.coerce(sys.ObjUtil.with(ShellTable.make(this.#sh.grid()), (it) => {
      it.onSelect((it) => {
        this$.#sh.update(this$.#sh.state().setSelection(sys.ObjUtil.coerce(it.sel().items(), sys.Type.find("haystack::Dict[]"))));
        return;
      });
      return;
    }), ShellTable.type$);
    this.add(table);
    return;
  }

  updateText() {
    if (this.#sh.grid().isErr()) {
      return this.updateErr();
    }
    ;
    let str = haystack.Etc.gridToStrVal(this.#sh.grid(), null);
    if (str == null) {
      let buf = sys.StrBuf.make();
      this.#sh.grid().dump(buf.out(), sys.Map.__fromLiteral(["noClip"], [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")));
      (str = buf.toStr());
    }
    ;
    this.updateTextArea(sys.ObjUtil.coerce(str, sys.Str.type$));
    return;
  }

  updateGridWriter(type) {
    let buf = sys.StrBuf.make();
    let writer = sys.ObjUtil.coerce(type.make(sys.List.make(sys.OutStream.type$, [buf.out()])), haystack.GridWriter.type$);
    writer.writeGrid(this.#sh.grid());
    this.updateTextArea(buf.toStr());
    return;
  }

  updateTextArea(val) {
    const this$ = this;
    this.add(sys.ObjUtil.coerce(sys.ObjUtil.with(domkit.TextArea.make(), (it) => {
      it.val(val);
      return;
    }), domkit.TextArea.type$));
    return;
  }

}

class ShellViewType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ShellViewType.type$; }

  static table() { return ShellViewType.vals().get(0); }

  static text() { return ShellViewType.vals().get(1); }

  static csv() { return ShellViewType.vals().get(2); }

  static json() { return ShellViewType.vals().get(3); }

  static trio() { return ShellViewType.vals().get(4); }

  static zinc() { return ShellViewType.vals().get(5); }

  static #vals = undefined;

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  static make($ordinal,$name,dis) {
    const $self = new ShellViewType();
    ShellViewType.make$($self,$ordinal,$name,dis);
    return $self;
  }

  static make$($self,$ordinal,$name,dis) {
    sys.Enum.make$($self, $ordinal, $name);
    $self.#dis = dis;
    return;
  }

  static toBest(grid) {
    let view = sys.ObjUtil.as(grid.meta().get("view"), sys.Str.type$);
    if (sys.ObjUtil.equals(view, "text")) {
      return ShellViewType.text();
    }
    ;
    return ShellViewType.table();
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(ShellViewType.type$, ShellViewType.vals(), name$, checked);
  }

  static vals() {
    if (ShellViewType.#vals == null) {
      ShellViewType.#vals = sys.List.make(ShellViewType.type$, [
        ShellViewType.make(0, "table", "Table"),
        ShellViewType.make(1, "text", "Text"),
        ShellViewType.make(2, "csv", "CSV"),
        ShellViewType.make(3, "json", "JSON"),
        ShellViewType.make(4, "trio", "Trio"),
        ShellViewType.make(5, "zinc", "Zinc"),
      ]).toImmutable();
    }
    return ShellViewType.#vals;
  }

  static static$init() {
    const $_u13 = ShellViewType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class ShellUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ShellUtil.type$; }

  static #nonEditableTags = undefined;

  static nonEditableTags() {
    if (ShellUtil.#nonEditableTags === undefined) {
      ShellUtil.static$init();
      if (ShellUtil.#nonEditableTags === undefined) ShellUtil.#nonEditableTags = null;
    }
    return ShellUtil.#nonEditableTags;
  }

  static errElemBig(dis) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make("h1"), (it) => {
      it.style().trap("margin", sys.List.make(sys.Obj.type$.toNullable(), ["0"]));
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make("span"), (it) => {
        it.text("\u2639");
        it.style().addClass("err-icon-big");
        return;
      }), dom.Elem.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make("span"), (it) => {
        it.text(dis);
        it.style().addClass("err-dis-big");
        return;
      }), dom.Elem.type$));
      return;
    }), dom.Elem.type$);
  }

  static errElemSmall(dis) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make("h1"), (it) => {
      it.style().trap("margin", sys.List.make(sys.Obj.type$.toNullable(), ["0"]));
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make("span"), (it) => {
        it.text("\u2639");
        it.style().addClass("err-icon-small");
        return;
      }), dom.Elem.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(dom.Elem.make("span"), (it) => {
        it.text(dis);
        it.style().addClass("err-dis-small");
        return;
      }), dom.Elem.type$));
      return;
    }), dom.Elem.type$);
  }

  static recsToEditTrio(recs) {
    const this$ = this;
    let buf = sys.StrBuf.make();
    recs.each((rec,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        buf.add("---\n");
      }
      ;
      buf.add(ShellUtil.recToEditTrio(rec));
      return;
    });
    return buf.toStr();
  }

  static recToEditTrio(rec) {
    const this$ = this;
    let good = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj?]"));
    let bad = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj]"));
    rec.each((v,n) => {
      if (ShellUtil.nonEditableTags().contains(n)) {
        bad.set(n, v);
      }
      else {
        good.set(n, v);
      }
      ;
      return;
    });
    let buf = sys.StrBuf.make();
    haystack.TrioWriter.make(buf.out()).writeDict(haystack.Etc.makeDict(good));
    if (!bad.isEmpty()) {
      let badBuf = sys.StrBuf.make();
      badBuf.add("restricted/transient tags\n");
      haystack.TrioWriter.make(badBuf.out()).writeDict(haystack.Etc.makeDict(bad));
      sys.Str.splitLines(badBuf.toStr()).each((line) => {
        if (!sys.Str.isEmpty(line)) {
          buf.add("// ").add(line).add("\n");
        }
        ;
        return;
      });
    }
    ;
    return buf.toStr();
  }

  static make() {
    const $self = new ShellUtil();
    ShellUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    ShellUtil.#nonEditableTags = sys.ObjUtil.coerce(((this$) => { let $_u14 = sys.Str.split("projMeta,ext,connState,connStatus,connErr,curVal,curStatus,curErr,writeVal,writeLevel,writeStatus,writeErr,hisStatus,hisErr,hisSize,hisStart,hisStartVal,hisEnd,hisEndVal", sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())); if ($_u14 == null) return null; return sys.ObjUtil.toImmutable(sys.Str.split("projMeta,ext,connState,connStatus,connErr,curVal,curStatus,curErr,writeVal,writeLevel,writeStatus,writeErr,hisStatus,hisErr,hisSize,hisStart,hisStartVal,hisEnd,hisEndVal", sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()))); })(this), sys.Type.find("sys::Str[]"));
    return;
  }

}

class Session extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Session.type$; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #attestKey = null;

  attestKey() { return this.#attestKey; }

  __attestKey(it) { if (it === undefined) return this.#attestKey; else this.#attestKey = it; }

  #user = null;

  user() { return this.#user; }

  __user(it) { if (it === undefined) return this.#user; else this.#user = it; }

  static make() {
    const $self = new Session();
    Session.make$($self);
    return $self;
  }

  static make$($self) {
    $self.#uri = sys.Str.toUri(sys.Env.cur().vars().getChecked("hxShell.api"));
    $self.#attestKey = sys.ObjUtil.coerce(sys.Env.cur().vars().getChecked("hxShell.attestKey"), sys.Str.type$);
    $self.#user = sys.ObjUtil.coerce(haystack.ZincReader.make(sys.Str.in(sys.Env.cur().vars().getChecked("hxShell.user"))).readVal(), haystack.Dict.type$);
    return;
  }

  eval(expr) {
    return this.call("eval", haystack.Etc.makeDictGrid(null, haystack.Etc.makeDict1("expr", expr)));
  }

  call(op,req) {
    const this$ = this;
    let future = ApiCallFuture.make();
    let http = this.prepare(op);
    http.post(haystack.ZincWriter.gridToStr(req), (res) => {
      let resGrid = null;
      try {
        if (sys.ObjUtil.equals(res.status(), 0)) {
          throw sys.IOErr.make("Could not connect to server");
        }
        ;
        if (sys.ObjUtil.compareNE(res.status(), 200)) {
          throw sys.IOErr.make(sys.Str.plus("Invalid HTTP response: ", sys.ObjUtil.coerce(res.status(), sys.Obj.type$.toNullable())));
        }
        ;
        (resGrid = haystack.ZincReader.make(sys.Str.in(res.content())).readGrid());
      }
      catch ($_u15) {
        $_u15 = sys.Err.make($_u15);
        if ($_u15 instanceof sys.Err) {
          let e = $_u15;
          ;
          (resGrid = haystack.Etc.makeErrGrid(e));
        }
        else {
          throw $_u15;
        }
      }
      ;
      future.complete(sys.ObjUtil.coerce(resGrid, haystack.Grid.type$));
      return;
    });
    return future;
  }

  prepare(op) {
    const this$ = this;
    return dom.HttpReq.make((it) => {
      it.uri(this$.#uri.plus(sys.Str.toUri(sys.Str.plus("", op))));
      it.headers().set("Content-Type", "text/zinc; charset=utf-8");
      it.headers().set("Attest-Key", this$.#attestKey);
      return;
    });
  }

}

class ApiCallFuture extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#cbErr = (g) => {
      ShellDialog.openErrGrid(g);
      return;
    };
    return;
  }

  typeof() { return ApiCallFuture.type$; }

  #cbOk = null;

  // private field reflection only
  __cbOk(it) { if (it === undefined) return this.#cbOk; else this.#cbOk = it; }

  #cbErr = null;

  // private field reflection only
  __cbErr(it) { if (it === undefined) return this.#cbErr; else this.#cbErr = it; }

  complete(res) {
    if (res.meta().has("err")) {
      ((this$) => { let $_u16 = this$.#cbErr; if ($_u16 == null) return null; return sys.Func.call(this$.#cbErr, res); })(this);
    }
    else {
      ((this$) => { let $_u17 = this$.#cbOk; if ($_u17 == null) return null; return sys.Func.call(this$.#cbOk, res); })(this);
    }
    ;
    return;
  }

  onOk(f) {
    this.#cbOk = f;
    return this;
  }

  onErr(f) {
    this.#cbErr = f;
    return this;
  }

  static make() {
    const $self = new ApiCallFuture();
    ApiCallFuture.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

const p = sys.Pod.add$('hxShell');
const xp = sys.Param.noParams$();
let m;
HxShellWeb.type$ = p.at$('HxShellWeb','hx::HxLibWeb',[],{},8194,HxShellWeb);
HxShellLib.type$ = p.at$('HxShellLib','hx::HxLib',[],{},8194,HxShellLib);
ShellState.type$ = p.at$('ShellState','sys::Obj',[],{'sys::Js':""},130,ShellState);
ShellInput.type$ = p.at$('ShellInput','domkit::Box',[],{'sys::Js':""},128,ShellInput);
ShellHistory.type$ = p.at$('ShellHistory','sys::Obj',[],{'sys::Js':""},128,ShellHistory);
ShellCommands.type$ = p.at$('ShellCommands','domkit::FlexBox',[],{'sys::Js':""},128,ShellCommands);
ShellTable.type$ = p.at$('ShellTable','domkit::Table',[],{'sys::Js':""},128,ShellTable);
ShellTableModel.type$ = p.at$('ShellTableModel','domkit::TableModel',[],{'sys::Js':""},128,ShellTableModel);
ShellDialog.type$ = p.at$('ShellDialog','domkit::Dialog',[],{'sys::Js':""},128,ShellDialog);
Shell.type$ = p.at$('Shell','domkit::Box',[],{'sys::Js':""},128,Shell);
ShellView.type$ = p.at$('ShellView','domkit::Box',[],{'sys::Js':""},128,ShellView);
ShellViewType.type$ = p.at$('ShellViewType','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},170,ShellViewType);
ShellUtil.type$ = p.at$('ShellUtil','sys::Obj',[],{'sys::Js':""},130,ShellUtil);
Session.type$ = p.at$('Session','sys::Obj',[],{'sys::Js':""},8194,Session);
ApiCallFuture.type$ = p.at$('ApiCallFuture','sys::Obj',[],{'sys::Js':""},8192,ApiCallFuture);
HxShellWeb.type$.af$('lib',336898,'hx::HxLib',{}).af$('title',73730,'sys::Str',{}).af$('favicon',73730,'sys::Uri',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hx::HxLib',false)]),{}).am$('onService',271360,'sys::Void',xp,{}).am$('onHtml',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false)]),{}).am$('onCss',2048,'sys::Void',xp,{}).am$('onJs',2048,'sys::Void',xp,{}).am$('pods',2048,'sys::Pod[]',xp,{});
HxShellLib.type$.af$('web',336898,'hxShell::HxShellWeb',{}).am$('make',139268,'sys::Void',xp,{});
ShellState.type$.af$('expr',73730,'sys::Str',{}).af$('grid',73730,'haystack::Grid',{}).af$('viewType',73730,'hxShell::ShellViewType',{}).af$('selection',73730,'haystack::Dict[]',{}).am$('makeInit',40962,'hxShell::ShellState',xp,{}).am$('makeEvalOk',40962,'hxShell::ShellState',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false),new sys.Param('grid','haystack::Grid',false)]),{}).am$('makeEvalErr',40962,'hxShell::ShellState',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false),new sys.Param('errGrid','haystack::Grid',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false),new sys.Param('grid','haystack::Grid',false),new sys.Param('viewType','hxShell::ShellViewType',false),new sys.Param('selection','haystack::Dict[]',false)]),{}).am$('setViewType',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('t','hxShell::ShellViewType',false)]),{}).am$('setSelection',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('sel','haystack::Dict[]',false)]),{});
ShellInput.type$.af$('sh',67584,'hxShell::Shell',{}).af$('prompt',67584,'domkit::TextField',{}).af$('his',67584,'hxShell::ShellHistory',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sh','hxShell::Shell',false)]),{}).am$('onKeyDown',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{}).am$('focus',271360,'sys::Void',xp,{}).am$('addToHis',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false)]),{}).am$('update',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false)]),{}).am$('onEval',2048,'sys::Void',xp,{}).am$('onArrowUp',2048,'sys::Void',xp,{}).am$('onArrowDown',2048,'sys::Void',xp,{}).am$('onRecent',2048,'sys::Void',xp,{});
ShellHistory.type$.af$('list',73728,'sys::Str[]',{}).af$('index',73728,'sys::Int',{}).af$('key',67586,'sys::Str',{}).af$('nc',67586,'sys::Int',{}).af$('max',67586,'sys::Int',{}).am$('make',8196,'sys::Void',xp,{}).am$('up',8192,'sys::Str?',xp,{}).am$('down',8192,'sys::Str?',xp,{}).am$('push',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('item','sys::Str',false)]),{});
ShellCommands.type$.af$('sh',67584,'hxShell::Shell',{}).af$('newRec',67584,'domkit::Button',{}).af$('edit',67584,'domkit::Button',{}).af$('trash',67584,'domkit::Button',{}).af$('meta',67584,'domkit::Button',{}).af$('views',67584,'domkit::Button',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sh','hxShell::Shell',false)]),{}).am$('update',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('old','hxShell::ShellState',false),new sys.Param('cur','hxShell::ShellState',false)]),{}).am$('onNew',2048,'sys::Void',xp,{}).am$('onEdit',2048,'sys::Void',xp,{}).am$('gotoIds',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('res','haystack::Grid',false)]),{}).am$('onTrash',2048,'sys::Void',xp,{}).am$('onMeta',2048,'sys::Void',xp,{}).am$('onViews',2048,'domkit::Popup',xp,{});
ShellTable.type$.af$('headerFont',106498,'graphics::Font',{}).af$('cellFont',106498,'graphics::Font',{}).af$('infoIcon',106498,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('onMouseDown',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','domkit::TableEvent',false)]),{}).am$('onInfo',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','domkit::TableEvent',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ShellTableModel.type$.af$('grid',73730,'haystack::Grid',{}).af$('cols',67584,'haystack::Col[]',{}).af$('colWidths',67584,'sys::Int[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('initColWidths',34818,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('initColWidth',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('col','haystack::Col',false),new sys.Param('index','sys::Int',false),new sys.Param('hm','graphics::FontMetrics',false),new sys.Param('cm','graphics::FontMetrics',false)]),{}).am$('numCols',271360,'sys::Int',xp,{}).am$('numRows',271360,'sys::Int',xp,{}).am$('onHeader',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('header','dom::Elem',false),new sys.Param('c','sys::Int',false)]),{}).am$('colWidth',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('item',271360,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('r','sys::Int',false)]),{}).am$('onCell',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cell','dom::Elem',false),new sys.Param('c','sys::Int',false),new sys.Param('r','sys::Int',false),new sys.Param('flags','domkit::TableFlags',false)]),{}).am$('sortCompare',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false),new sys.Param('r1','sys::Int',false),new sys.Param('r2','sys::Int',false)]),{});
ShellDialog.type$.af$('ok',106498,'sys::Str',{}).af$('cancel',106498,'sys::Str',{}).af$('content',73728,'dom::Elem',{}).af$('buttons',73728,'sys::Str[]?',{}).af$('cbOk',67584,'sys::Func?',{}).am$('confirm',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('extra','sys::Str',false),new sys.Param('onOk','|->sys::Void|',false)]),{}).am$('openText',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('title','sys::Str',false),new sys.Param('text','sys::Str',false)]),{}).am$('openErrGrid',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('g','haystack::Grid',false)]),{}).am$('openErr',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dis','sys::Str',false),new sys.Param('trace','sys::Str',true)]),{}).am$('promptTrio',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('title','sys::Str',false),new sys.Param('trio','sys::Str',false),new sys.Param('onOk','|haystack::Dict[]->sys::Void|',false)]),{}).am$('makeTextArea',34818,'domkit::TextArea',sys.List.make(sys.Param.type$,[new sys.Param('text','sys::Str',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('onOk',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Bool|',false)]),{}).am$('fire',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('isDefaultAction',32898,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('e','dom::Event',false)]),{}).am$('isTextArea',32898,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('elem','dom::Elem?',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Shell.type$.af$('session',73730,'hxShell::Session',{}).af$('stateRef',67584,'hxShell::ShellState',{}).af$('input',65664,'hxShell::ShellInput',{}).af$('commands',65664,'hxShell::ShellCommands',{}).af$('view',65664,'hxShell::ShellView',{}).am$('main',40962,'sys::Void',xp,{}).am$('make',8196,'sys::Void',xp,{}).am$('eval',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false),new sys.Param('addToHis','sys::Bool',false)]),{}).am$('update',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('state','hxShell::ShellState',false)]),{}).am$('refresh',8192,'sys::Void',xp,{}).am$('state',8192,'hxShell::ShellState',xp,{}).am$('grid',8192,'haystack::Grid',xp,{});
ShellView.type$.af$('sh',67584,'hxShell::Shell',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sh','hxShell::Shell',false)]),{}).am$('update',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('old','hxShell::ShellState',false),new sys.Param('cur','hxShell::ShellState',false)]),{}).am$('updateErr',2048,'sys::Void',xp,{}).am$('updateTable',2048,'sys::Void',xp,{}).am$('updateText',2048,'sys::Void',xp,{}).am$('updateGridWriter',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('updateTextArea',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{});
ShellViewType.type$.af$('table',106506,'hxShell::ShellViewType',{}).af$('text',106506,'hxShell::ShellViewType',{}).af$('csv',106506,'hxShell::ShellViewType',{}).af$('json',106506,'hxShell::ShellViewType',{}).af$('trio',106506,'hxShell::ShellViewType',{}).af$('zinc',106506,'hxShell::ShellViewType',{}).af$('vals',106498,'hxShell::ShellViewType[]',{}).af$('dis',73730,'sys::Str',{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('dis','sys::Str',false)]),{}).am$('toBest',40962,'hxShell::ShellViewType',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('fromStr',40966,'hxShell::ShellViewType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ShellUtil.type$.af$('nonEditableTags',106498,'sys::Str[]',{}).am$('errElemBig',40962,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('dis','sys::Str',false)]),{}).am$('errElemSmall',40962,'dom::Elem',sys.List.make(sys.Param.type$,[new sys.Param('dis','sys::Str',false)]),{}).am$('recsToEditTrio',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('recs','haystack::Dict[]',false)]),{}).am$('recToEditTrio',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
Session.type$.af$('uri',73730,'sys::Uri',{}).af$('attestKey',73730,'sys::Str',{}).af$('user',73730,'haystack::Dict',{}).am$('make',8196,'sys::Void',xp,{}).am$('eval',8192,'hxShell::ApiCallFuture',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false)]),{}).am$('call',8192,'hxShell::ApiCallFuture',sys.List.make(sys.Param.type$,[new sys.Param('op','sys::Str',false),new sys.Param('req','haystack::Grid',false)]),{}).am$('prepare',8192,'dom::HttpReq',sys.List.make(sys.Param.type$,[new sys.Param('op','sys::Str',false)]),{});
ApiCallFuture.type$.af$('cbOk',67584,'sys::Func?',{}).af$('cbErr',67584,'sys::Func?',{}).am$('complete',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('res','haystack::Grid',false)]),{}).am$('onOk',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Grid->sys::Void|',false)]),{}).am$('onErr',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Grid->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxShell");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;graphics 1.0;dom 1.0;domkit 1.0;web 1.0;haystack 3.1.11;axon 3.1.11;hx 3.1.11");
m.set("pod.summary", "Axon shell user interface");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:27-05:00 New_York");
m.set("build.tsKey", "241210143127");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "false");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "SkyFoundry");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Haxall");
m.set("proj.uri", "https://haxall.io/");
m.set("pod.docApi", "false");
m.set("org.uri", "https://skyfoundry.com/");
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/haxall/haxall");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  HxShellWeb,
  HxShellLib,
  Session,
  ApiCallFuture,
};
