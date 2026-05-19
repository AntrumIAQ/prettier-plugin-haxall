// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as util from './util.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class YamlParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#docs = sys.List.make(YamlObj.type$);
    this.#tagShorthands = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    this.#anchors = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("yaml::YamlObj"));
    this.#anchorsInProgress = sys.List.make(sys.Str.type$);
    return;
  }

  typeof() { return YamlParser.type$; }

  #r = null;

  // private field reflection only
  __r(it) { if (it === undefined) return this.#r; else this.#r = it; }

  #docs = null;

  // private field reflection only
  __docs(it) { if (it === undefined) return this.#docs; else this.#docs = it; }

  #tagShorthands = null;

  // private field reflection only
  __tagShorthands(it) { if (it === undefined) return this.#tagShorthands; else this.#tagShorthands = it; }

  #anchors = null;

  // private field reflection only
  __anchors(it) { if (it === undefined) return this.#anchors; else this.#anchors = it; }

  #anchorsInProgress = null;

  // private field reflection only
  __anchorsInProgress(it) { if (it === undefined) return this.#anchorsInProgress; else this.#anchorsInProgress = it; }

  static make(in$,loc) {
    const $self = new YamlParser();
    YamlParser.make$($self,in$,loc);
    return $self;
  }

  static make$($self,in$,loc) {
    if (loc === undefined) loc = util.FileLoc.unknown();
    ;
    $self.#r = YamlTokenizer.make(in$, loc);
    return;
  }

  parse() {
    this.#docs = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("yaml::YamlObj[]"));
    this.parseDocument();
    return this.#docs;
  }

  parseDocument() {
    this.#tagShorthands = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str]"));
    this.#anchors = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:yaml::YamlObj]"));
    this.#anchorsInProgress = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("sys::Str[]"));
    this.assertLineStart();
    while (sys.ObjUtil.as(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(35, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable())]), sys.Type.find("sys::Int?[]")).contains(sys.ObjUtil.coerce(this.#r.peekNextNs(this.#r.docPrefix()), sys.Obj.type$.toNullable()))) {
      this.#r.eatLine(this.#r.docPrefix());
    }
    ;
    while (sys.ObjUtil.equals(this.#r.peek(this.#r.any()), 65534)) {
      this.#r.any();
    }
    ;
    if ((sys.ObjUtil.equals(this.#r.peek(), 37) || sys.ObjUtil.equals(this.#r.peekToken(), "---"))) {
      this.parseDirectives();
      if ((this.#r.peekIndentedNs(0, this.#r.docPrefix()) == null || this.#r.nextTokenEndsDoc())) {
        let startLoc = this.#r.loc();
        this.sLComments(this.#r.docPrefix());
        this.#docs.add(YamlScalar.make("", "?", startLoc));
        if (sys.ObjUtil.equals(this.#r.peekToken(this.#r.docPrefix()), "...")) {
          this.parseDocEnd();
        }
        else {
          if (sys.ObjUtil.equals(this.#r.peekToken(this.#r.docPrefix()), "---")) {
            this.parseDocument();
          }
          ;
        }
        ;
        return;
      }
      ;
    }
    else {
      if (sys.ObjUtil.equals(this.#r.peekToken(), "...")) {
        this.parseDocEnd();
        return;
      }
      else {
        if (this.#r.peekNextNs() == null) {
          return;
        }
        ;
      }
      ;
    }
    ;
    if (!this.#tagShorthands.containsKey("!")) {
      this.#tagShorthands.add("!", "!");
    }
    ;
    if (!this.#tagShorthands.containsKey("!!")) {
      this.#tagShorthands.add("!!", "tag:yaml.org,2002:");
    }
    ;
    this.#docs.add(this.parseBlockNode(-1, Context.blockIn()));
    while ((this.#r.peek(this.#r.docPrefix()) != null && sys.List.make(sys.Int.type$.toNullable(), [sys.ObjUtil.coerce(sys.ObjUtil.coerce(35, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), null]).contains(sys.ObjUtil.coerce(this.#r.peekNextNs(this.#r.docPrefix()), sys.Obj.type$.toNullable())))) {
      this.#r.eatLine(this.#r.docPrefix());
    }
    ;
    if (sys.ObjUtil.equals(this.#r.peekToken(this.#r.docPrefix()), "...")) {
      this.parseDocEnd();
    }
    else {
      if (sys.ObjUtil.equals(this.#r.peekToken(this.#r.docPrefix()), "---")) {
        this.parseDocument();
      }
      else {
        if (this.#r.peek(this.#r.docPrefix()) != null) {
          throw this.err("You cannot have multiple top-level nodes in a single document.");
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  parseDirectives() {
    const this$ = this;
    let doneYaml = false;
    while ((sys.ObjUtil.compareNE(this.#r.peek(), 45) && this.#r.peek() != null)) {
      if (sys.ObjUtil.compareNE(this.#r.peek(), 37)) {
        this.#r.eatCommentLine("An empty directive line");
        continue;
      }
      ;
      this.assertLineStart();
      this.#r.eatChar(37);
      let name = this.#r.eatToken();
      let $_u0 = name;
      if (sys.ObjUtil.equals($_u0, "YAML")) {
        if (doneYaml) {
          throw this.err("The YAML directive must only be given at most once per document.");
        }
        ;
        this.#r.eatWs();
        let ver = sys.Str.split(this.#r.eatToken(), sys.ObjUtil.coerce(46, sys.Int.type$.toNullable()));
        let maj = 0;
        let min = 0;
        try {
          if (sys.ObjUtil.compareNE(ver.size(), 2)) {
            throw sys.ParseErr.make();
          }
          ;
          (maj = sys.ObjUtil.coerce(sys.Int.fromStr(ver.get(0)), sys.Int.type$));
          (min = sys.ObjUtil.coerce(sys.Int.fromStr(ver.get(1)), sys.Int.type$));
        }
        catch ($_u1) {
          $_u1 = sys.Err.make($_u1);
          if ($_u1 instanceof sys.ParseErr) {
            let e = $_u1;
            ;
            throw this.err("The YAML version is not correctly formatted as [major version].[minor version].");
          }
          else {
            throw $_u1;
          }
        }
        ;
        if (sys.ObjUtil.compareLT(maj, 1)) {
          throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(maj, sys.Obj.type$.toNullable())), "."), sys.ObjUtil.coerce(min, sys.Obj.type$.toNullable())), " is not a valid YAML version."));
        }
        ;
        if (sys.ObjUtil.compareGT(maj, 1)) {
          throw sys.Err.make("This processor is written for YAML version 1.2 and cannot process higher major versions.");
        }
        ;
        if (sys.ObjUtil.compareLT(min, 1)) {
          throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(maj, sys.Obj.type$.toNullable())), "."), sys.ObjUtil.coerce(min, sys.Obj.type$.toNullable())), " is not a valid YAML version."));
        }
        else {
          if (sys.ObjUtil.compareGT(min, 2)) {
            sys.ObjUtil.echo(sys.Str.plus("This Fantom processor is written for YAML version 1.2, and thus can only parse this document as ", sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("a YAML 1.2 document rather than a YAML ", sys.ObjUtil.coerce(maj, sys.Obj.type$.toNullable())), "."), sys.ObjUtil.coerce(min, sys.Obj.type$.toNullable())), " document.")));
          }
          else {
            if (sys.ObjUtil.equals(min, 1)) {
              sys.ObjUtil.echo("This Fantom processor is written for YAML version 1.2, and thus can only parse this document as a YAML 1.2 document rather than a YAML 1.1 document. While this does not lead to incompatibilities for the most part, beware that any line break characters other than \\n and \\r (i.e. Unicode line breaks and separators) will be processed as non-break characters.");
            }
            ;
          }
          ;
        }
        ;
        (doneYaml = true);
        this.#r.eatCommentLine("A YAML directive");
      }
      else if (sys.ObjUtil.equals($_u0, "TAG")) {
        this.#r.eatWs();
        let hloc = this.#r.loc();
        this.#r.eatChar(33);
        let handle = sys.Str.plus("!", this.#r.eatUntilr(this.#r.tagHandle(), (c1) => {
          return (!this$.#r.isNs(sys.ObjUtil.coerce(c1, sys.Int.type$.toNullable())) || sys.ObjUtil.equals(c1, 33));
        }));
        if (sys.ObjUtil.equals(this.#r.peek(), 33)) {
          this.#r.eatToken("!");
          handle = sys.Str.plus(handle, "!");
        }
        else {
          if (sys.ObjUtil.compareNE(handle, "!")) {
            throw this.err("A named tag handle must end in the '!' character.", hloc);
          }
          ;
        }
        ;
        this.#r.eatWs();
        let ploc = this.#r.loc();
        let prefix = this.#r.eatToken(null, this.#r.uri());
        this.#r.eatCommentLine("A TAG directive");
        if (sys.ObjUtil.equals(sys.Str.size(prefix), 0)) {
          throw this.err("Two parameters for the TAG directive are not present.");
        }
        ;
        if (this.#r.isFlow(sys.ObjUtil.coerce(sys.Str.get(prefix, 0), sys.Int.type$.toNullable()))) {
          throw this.err("A tag prefix cannot start with a flow character.", ploc);
        }
        ;
        if (sys.ObjUtil.compareNE(sys.Str.get(prefix, 0), 33)) {
          let uri = sys.Uri.fromStr(prefix, false);
          if (uri == null) {
            throw this.err(sys.Str.plus(sys.Str.plus("", prefix), " is a not a valid URI."), ploc);
          }
          else {
            if (uri.scheme() == null) {
              throw this.err(sys.Str.plus(sys.Str.plus("The URI ", prefix), " does not include a scheme."), ploc);
            }
            ;
          }
          ;
        }
        ;
        if (this.#tagShorthands.containsKey(handle)) {
          throw this.err(sys.Str.plus(sys.Str.plus("The tag handle \"", handle), "\" is already registered for this document."), hloc);
        }
        ;
        this.#tagShorthands.add(handle, prefix);
      }
      else if (sys.ObjUtil.equals($_u0, "")) {
        throw this.err("A directive name cannot be empty.");
      }
      else {
        sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("The directive ", name), " is not defined in YAML 1.2.2."));
        this.#r.eatLine();
      }
      ;
    }
    ;
    this.#r.eatToken("---");
    return;
  }

  parseBlockNode(n,ctx) {
    const this$ = this;
    let c = this.#r.peekIndentedNs(sys.Int.plus(n, 1), this.#r.docPrefix());
    if ((sys.ObjUtil.equals(c, 42) && !this.nextNodeIsKey(sys.Int.plus(n, 1), ctx))) {
      this.separate(sys.Int.plus(n, 1), Context.flowOut());
      let a = this.parseAlias(Context.flowOut());
      this.sLComments();
      return a;
    }
    ;
    let anchor = "";
    let tag = "";
    let startLoc = null;
    if ((sys.ObjUtil.as(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(38, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(33, sys.Obj.type$.toNullable())]), sys.Type.find("sys::Int?[]")).contains(sys.ObjUtil.coerce((c = this.#r.peekIndentedNs(sys.Int.plus(n, 1), this.#r.docPrefix())), sys.Obj.type$.toNullable())) && !this.nextNodeIsKey(sys.Int.plus(n, 1), ctx))) {
      this.separate(sys.Int.plus(n, 1), ctx);
      (startLoc = this.#r.loc());
      let p = this.parseProperties(sys.Int.plus(n, 1), ctx);
      if (p.containsKey("anchor")) {
        (anchor = sys.ObjUtil.coerce(p.get("anchor"), sys.Str.type$));
      }
      ;
      if (p.containsKey("tag")) {
        (tag = sys.ObjUtil.coerce(p.get("tag"), sys.Str.type$));
      }
      ;
      (c = this.#r.peekIndentedNs(sys.Int.plus(n, 1), this.#r.docPrefix()));
    }
    ;
    if (sys.ObjUtil.compareNE(anchor, "")) {
      this.#anchorsInProgress.add(anchor);
    }
    ;
    let node = sys.Func.call(() => {
      let seqSpacing = ((this$) => { if (sys.ObjUtil.equals(ctx, Context.blockOut())) return sys.Int.minus(n, 1); return n; })(this$);
      if (sys.ObjUtil.equals(this$.#r.peekIndentedToken(sys.Int.plus(seqSpacing, 1), this$.#r.any()), "-")) {
        this$.sLComments();
        return this$.parseBlockSeq(seqSpacing, tag, startLoc);
      }
      else {
        if ((sys.ObjUtil.equals(this$.#r.peekIndentedToken(sys.Int.plus(n, 1), this$.#r.any()), "?") || this$.nextNodeIsKey(sys.Int.plus(n, 1), ctx))) {
          this$.sLComments();
          return this$.parseBlockMap(n, tag, startLoc);
        }
        ;
      }
      ;
      if (this$.#r.nextTokenEndsDoc()) {
        (c = null);
      }
      ;
      let $_u3 = c;
      if (sys.ObjUtil.equals($_u3, 124)) {
        this$.separate(sys.Int.plus(n, 1), ctx);
        return this$.parseLiteral(sys.Int.plus(n, 1), tag, startLoc);
      }
      else if (sys.ObjUtil.equals($_u3, 62)) {
        this$.separate(sys.Int.plus(n, 1), ctx);
        return this$.parseFolded(sys.Int.plus(n, 1), tag, startLoc);
      }
      else if (sys.ObjUtil.equals($_u3, 39)) {
        this$.separate(sys.Int.plus(n, 1), Context.flowOut());
        return this$.objSLComments(this$.#r.loc().line(), true, this$.parseSingleQuote(sys.Int.plus(n, 1), Context.flowOut(), tag, startLoc));
      }
      else if (sys.ObjUtil.equals($_u3, 34)) {
        this$.separate(sys.Int.plus(n, 1), Context.flowOut());
        return this$.objSLComments(this$.#r.loc().line(), true, this$.parseDoubleQuote(sys.Int.plus(n, 1), Context.flowOut(), tag, startLoc));
      }
      else if (sys.ObjUtil.equals($_u3, 123)) {
        this$.separate(sys.Int.plus(n, 1), Context.flowOut());
        return this$.objSLComments(this$.#r.loc().line(), true, this$.parseFlowMap(sys.Int.plus(n, 1), Context.flowOut(), tag, startLoc));
      }
      else if (sys.ObjUtil.equals($_u3, 91)) {
        this$.separate(sys.Int.plus(n, 1), Context.flowOut());
        return this$.objSLComments(this$.#r.loc().line(), true, this$.parseFlowSeq(sys.Int.plus(n, 1), Context.flowOut(), tag, startLoc));
      }
      else if (sys.ObjUtil.equals($_u3, null)) {
        this$.sLComments();
        if ((sys.ObjUtil.compareNE(anchor, "") || sys.ObjUtil.compareNE(tag, ""))) {
          return YamlScalar.make("", tag, sys.ObjUtil.coerce(startLoc, util.FileLoc.type$));
        }
        else {
          throw this$.err("A node cannot be completely empty here.");
        }
        ;
      }
      else {
        this$.separate(sys.Int.plus(n, 1), Context.flowOut());
        return this$.objSLComments(this$.#r.loc().line(), false, this$.parsePlain(sys.Int.plus(n, 1), Context.flowOut(), tag, startLoc));
      }
      ;
    });
    if (sys.ObjUtil.compareNE(anchor, "")) {
      this.#anchorsInProgress.remove(anchor);
      this.#anchors.set(anchor, node);
    }
    ;
    return node;
  }

  parseFlowNode(n,ctx) {
    const this$ = this;
    if (sys.ObjUtil.equals(this.#r.peek(), 42)) {
      return this.parseAlias(ctx);
    }
    ;
    let anchor = "";
    let tag = "";
    let startLoc = this.#r.loc();
    if ((sys.ObjUtil.equals(this.#r.peek(), 38) || sys.ObjUtil.equals(this.#r.peek(), 33))) {
      let p = this.parseProperties(n, ctx);
      if (p.containsKey("anchor")) {
        (anchor = sys.ObjUtil.coerce(p.get("anchor"), sys.Str.type$));
      }
      ;
      if (p.containsKey("tag")) {
        (tag = sys.ObjUtil.coerce(p.get("tag"), sys.Str.type$));
      }
      ;
      this.separate(n, ctx);
    }
    ;
    if (sys.ObjUtil.compareNE(anchor, "")) {
      this.#anchorsInProgress.add(anchor);
    }
    ;
    let node = sys.Func.call(() => {
      let c = this$.#r.peekIndentedNs(n);
      if (sys.ObjUtil.equals(c, 123)) {
        return this$.parseFlowMap(n, ctx, tag, startLoc);
      }
      else {
        if (sys.ObjUtil.equals(c, 91)) {
          return this$.parseFlowSeq(n, ctx, tag, startLoc);
        }
        else {
          if (sys.ObjUtil.equals(c, 39)) {
            return this$.parseSingleQuote(n, ctx, tag, startLoc);
          }
          else {
            if (sys.ObjUtil.equals(c, 34)) {
              return this$.parseDoubleQuote(n, ctx, tag, startLoc);
            }
            else {
              if ((c == null || sys.ObjUtil.equals(this$.#r.peekIndentedToken(n), ":") || ((sys.ObjUtil.equals(ctx, Context.flowIn()) || sys.ObjUtil.equals(ctx, Context.flowKey())) && (this$.#r.isFlowEnd(c) || sys.ObjUtil.equals(this$.#r.peekIndentedUntil(n, (c1) => {
                return this$.#r.isFlowEnd(sys.ObjUtil.coerce(c1, sys.Int.type$.toNullable()));
              }), ":"))))) {
                if ((sys.ObjUtil.equals(anchor, "") && sys.ObjUtil.equals(tag, ""))) {
                  throw this$.err("A node cannot be completely empty here.");
                }
                ;
                return YamlScalar.make("", tag, startLoc);
              }
              else {
                return this$.parsePlain(n, ctx, tag, startLoc);
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
    });
    if (sys.ObjUtil.compareNE(anchor, "")) {
      this.#anchorsInProgress.remove(anchor);
      this.#anchors.set(anchor, node);
    }
    ;
    return node;
  }

  parseAlias(ctx) {
    const this$ = this;
    let startLoc = this.#r.loc();
    this.#r.eatChar(42);
    let name = this.#r.eatUntil((c1) => {
      return (!this$.#r.isNs(sys.ObjUtil.coerce(c1, sys.Int.type$.toNullable())) || ((sys.ObjUtil.equals(ctx, Context.flowIn()) || sys.ObjUtil.equals(ctx, Context.flowKey())) && this$.#r.isFlowEnd(sys.ObjUtil.coerce(c1, sys.Int.type$.toNullable()))));
    });
    if (sys.ObjUtil.equals(name, "")) {
      throw this.err("An alias name must be at least one character long.");
    }
    else {
      if (this.#anchors.containsKey(name)) {
        return this.setLoc(sys.ObjUtil.coerce(this.#anchors.get(name), YamlObj.type$), startLoc);
      }
      else {
        if (this.#anchorsInProgress.contains(name)) {
          throw this.err("This parser does not support self-containing nodes.");
        }
        else {
          throw this.err(sys.Str.plus(sys.Str.plus("No previous node has been given the anchor &", name), "."));
        }
        ;
      }
      ;
    }
    ;
  }

  parseProperties(n,ctx) {
    const this$ = this;
    let c = null;
    let res = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str]"));
    let wsOrFlow = (c1) => {
      return (!this$.#r.isNs(c1) || ((sys.ObjUtil.equals(ctx, Context.flowIn()) || sys.ObjUtil.equals(ctx, Context.flowKey())) && this$.#r.isFlowEnd(c1)));
    };
    let line = this.#r.loc().line();
    while ((sys.ObjUtil.as(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(38, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(33, sys.Obj.type$.toNullable())]), sys.Type.find("sys::Int?[]")).contains(sys.ObjUtil.coerce((c = this.#r.peekIndentedNs(n)), sys.Obj.type$.toNullable())) && ((sys.ObjUtil.equals(this.#r.loc().line(), line) && sys.ObjUtil.equals(this.#r.peekNextNs(), c)) || !this.nextNodeIsKey(n, ctx)))) {
      if (sys.ObjUtil.equals(c, 38)) {
        if (res.containsKey("anchor")) {
          return res;
        }
        ;
        this.separate(n, ctx);
        this.#r.eatChar(38);
        let name = this.#r.eatUntil(wsOrFlow);
        if (sys.ObjUtil.equals(name, "")) {
          throw this.err("An anchor name must be at least one character long.");
        }
        ;
        res.set("anchor", name);
      }
      else {
        if (res.containsKey("tag")) {
          return res;
        }
        ;
        let tloc = this.#r.loc();
        this.separate(n, ctx);
        this.#r.eatChar(33);
        if (sys.ObjUtil.equals(this.#r.peek(), 60)) {
          this.#r.eatChar(60);
          let name = this.#r.eatUntilr(this.#r.uri(), (c1) => {
            return sys.ObjUtil.equals(c1, 62);
          });
          this.#r.eatToken(">");
          if (sys.ObjUtil.equals(name, "")) {
            throw this.err("A tag cannot be empty.", tloc);
          }
          else {
            if (!sys.Str.startsWith(name, "!")) {
              let uri = sys.Uri.fromStr(name, false);
              if (uri == null) {
                throw this.err(sys.Str.plus(sys.Str.plus("", name), " is a not a valid URI."), tloc);
              }
              else {
                if (uri.scheme() == null) {
                  throw this.err(sys.Str.plus(sys.Str.plus("The URI ", name), " does not include a scheme."), tloc);
                }
                ;
              }
              ;
            }
            else {
              if (sys.ObjUtil.equals(name, "!")) {
                throw this.err("Verbatim tags aren't resolved, so ! is invalid.", tloc);
              }
              ;
            }
            ;
          }
          ;
          res.set("tag", name);
        }
        else {
          if (sys.Func.call(wsOrFlow, sys.ObjUtil.coerce(this.#r.peek(), sys.Obj.type$.toNullable()))) {
            res.set("tag", "!");
          }
          else {
            if (sys.Str.containsChar(this.#r.peekUntil(wsOrFlow), 33)) {
              let handle = sys.Str.plus(sys.Str.plus("!", this.#r.eatUntilr(this.#r.tagHandle(), (c1) => {
                return sys.ObjUtil.equals(c1, 33);
              })), "!");
              this.#r.eatChar(33);
              let suffix = this.#r.eatUntilr(this.#r.tagSuffix(), wsOrFlow);
              if (!this.#tagShorthands.containsKey(handle)) {
                throw this.err(sys.Str.plus(sys.Str.plus("", handle), " is not a registered tag shorthand handle in this document."));
              }
              ;
              if (sys.ObjUtil.equals(suffix, "")) {
                throw this.err(sys.Str.plus(sys.Str.plus("The ", handle), " handle has no suffix."));
              }
              ;
              res.set("tag", sys.Str.plus(this.#tagShorthands.get(handle), suffix));
            }
            else {
              let suffix = this.#r.eatUntilr(this.#r.tagSuffix(), wsOrFlow);
              res.set("tag", sys.Str.plus(this.#tagShorthands.get("!"), suffix));
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
    return res;
  }

  parseLiteral(n,tag,loc) {
    const this$ = this;
    let startLoc = ((this$) => { let $_u4 = loc; if ($_u4 != null) return $_u4; return this$.#r.loc(); })(this);
    let s = sys.StrBuf.make();
    this.#r.eatChar(124);
    let line = this.#r.loc().line();
    let head = this.parseBlockHeader(n);
    if (sys.ObjUtil.equals(this.#r.loc().line(), line)) {
      return YamlScalar.make("", ((this$) => { if (sys.ObjUtil.equals(tag, "")) return "!"; return tag; })(this), sys.ObjUtil.coerce(startLoc, util.FileLoc.type$));
    }
    ;
    let indent = sys.ObjUtil.coerce(head.getChecked("indent", false), sys.Int.type$.toNullable());
    let chomp = head.get("chomp");
    while (!sys.List.make(sys.Str.type$, ["---", "..."]).contains(this.#r.peekToken(this.#r.docPrefix()))) {
      let next = this.#r.peekPast((c1) => {
        return sys.ObjUtil.equals(c1, 32);
      });
      let i = sys.Str.size(this.#r.peekUntil((c1) => {
        return sys.ObjUtil.compareNE(c1, 32);
      }));
      if (indent == null) {
        (indent = sys.ObjUtil.coerce(sys.Int.negate(sys.Int.max(sys.Int.plus(i, 1), sys.Int.plus(n, 1))), sys.Int.type$.toNullable()));
      }
      else {
        if (sys.ObjUtil.compareLT(indent, 0)) {
          (indent = sys.ObjUtil.coerce(sys.Int.negate(sys.Int.max(sys.Int.plus(i, 1), sys.Int.negate(sys.ObjUtil.coerce(indent, sys.Int.type$)))), sys.Int.type$.toNullable()));
        }
        ;
      }
      ;
      let indPos = ((this$) => { if (sys.ObjUtil.compareLT(indent, 0)) return sys.ObjUtil.coerce(sys.Int.minus(sys.Int.negate(sys.ObjUtil.coerce(indent, sys.Int.type$)), 1), sys.Int.type$.toNullable()); return indent; })(this);
      if ((sys.ObjUtil.compareLT(i, indPos) && next != null && sys.ObjUtil.compareNE(next, 10))) {
        if (((sys.ObjUtil.equals(next, 35) && sys.ObjUtil.compareGE(indent, 0)) || (sys.ObjUtil.compareLT(i, n) && sys.ObjUtil.compareNE(next, 9)))) {
          break;
        }
        else {
          throw this.err(sys.Str.plus(sys.Str.plus("Text cannot be indented less than ", sys.ObjUtil.coerce(indPos, sys.Obj.type$.toNullable())), " spaces in this literal block."));
        }
        ;
      }
      ;
      if (((sys.ObjUtil.compareLT(indent, 0) || sys.ObjUtil.compareLE(i, indent)) && (next == null || sys.ObjUtil.equals(next, 10)))) {
        this.#r.eatLine(this.#r.ws());
      }
      else {
        if (sys.ObjUtil.compareLT(indent, 0)) {
          (indent = indPos);
        }
        ;
        this.#r.eatInd(sys.ObjUtil.coerce(indent, sys.Int.type$));
        s.add(this.#r.eatLine());
      }
      ;
      s.addChar(10);
      if (this.#r.peek(this.#r.docPrefix()) == null) {
        break;
      }
      ;
    }
    ;
    this.sLComments();
    if (sys.ObjUtil.equals(chomp, "strip")) {
      while ((!s.isEmpty() && sys.ObjUtil.equals(s.get(-1), 10))) {
        s.remove(-1);
      }
      ;
    }
    else {
      if (sys.ObjUtil.equals(chomp, "clip")) {
        while ((sys.ObjUtil.compareGT(s.size(), 1) && sys.ObjUtil.equals(s.get(-1), 10) && sys.ObjUtil.equals(s.get(-2), 10))) {
          s.remove(-1);
        }
        ;
        if ((sys.ObjUtil.equals(s.size(), 1) && sys.ObjUtil.equals(s.get(0), 10))) {
          s.remove(0);
        }
        ;
      }
      ;
    }
    ;
    return YamlScalar.make(s.toStr(), ((this$) => { if (sys.ObjUtil.equals(tag, "")) return "!"; return tag; })(this), sys.ObjUtil.coerce(startLoc, util.FileLoc.type$));
  }

  parseFolded(n,tag,loc) {
    const this$ = this;
    let startLoc = ((this$) => { let $_u8 = loc; if ($_u8 != null) return $_u8; return this$.#r.loc(); })(this);
    let s = sys.StrBuf.make();
    this.#r.eatChar(62);
    let head = this.parseBlockHeader(n);
    let indent = sys.ObjUtil.coerce(head.getChecked("indent", false), sys.Int.type$.toNullable());
    let chomp = head.get("chomp");
    let inFolded = false;
    while (!sys.List.make(sys.Str.type$, ["---", "..."]).contains(this.#r.peekToken(this.#r.docPrefix()))) {
      let next = this.#r.peekPast((c1) => {
        return sys.ObjUtil.equals(c1, 32);
      });
      let i = sys.Str.size(this.#r.peekUntil((c1) => {
        return sys.ObjUtil.compareNE(c1, 32);
      }));
      if (indent == null) {
        (indent = sys.ObjUtil.coerce(sys.Int.negate(sys.Int.max(sys.Int.plus(i, 1), sys.Int.plus(n, 1))), sys.Int.type$.toNullable()));
      }
      else {
        if (sys.ObjUtil.compareLT(indent, 0)) {
          (indent = sys.ObjUtil.coerce(sys.Int.negate(sys.Int.max(sys.Int.plus(i, 1), sys.Int.negate(sys.ObjUtil.coerce(indent, sys.Int.type$)))), sys.Int.type$.toNullable()));
        }
        ;
      }
      ;
      let indPos = ((this$) => { if (sys.ObjUtil.compareLT(indent, 0)) return sys.ObjUtil.coerce(sys.Int.minus(sys.Int.negate(sys.ObjUtil.coerce(indent, sys.Int.type$)), 1), sys.Int.type$.toNullable()); return indent; })(this);
      if ((sys.ObjUtil.compareLT(i, indPos) && next != null && sys.ObjUtil.compareNE(next, 10))) {
        if (((sys.ObjUtil.equals(next, 35) && sys.ObjUtil.compareGE(indent, 0)) || sys.ObjUtil.compareLT(i, n))) {
          break;
        }
        else {
          throw this.err(sys.Str.plus(sys.Str.plus("Text cannot be indented less than ", sys.ObjUtil.coerce(indPos, sys.Obj.type$.toNullable())), " spaces in this literal block."));
        }
        ;
      }
      ;
      if (((sys.ObjUtil.compareLT(indent, 0) || sys.ObjUtil.compareLE(i, indent)) && (next == null || sys.ObjUtil.equals(next, 10)))) {
        this.#r.eatLine(this.#r.ws());
      }
      else {
        if (sys.ObjUtil.compareLT(indent, 0)) {
          (indent = indPos);
        }
        ;
        this.#r.eatInd(sys.ObjUtil.coerce(indent, sys.Int.type$));
        if (!this.#r.isWs(this.#r.peek())) {
          if ((inFolded && sys.ObjUtil.compareGT(s.size(), 0) && sys.ObjUtil.equals(s.get(-1), 10))) {
            s.remove(-1);
            if ((sys.ObjUtil.compareGT(s.size(), 0) && sys.ObjUtil.compareNE(s.get(-1), 10))) {
              s.addChar(32);
            }
            ;
          }
          ;
          (inFolded = true);
        }
        else {
          (inFolded = false);
        }
        ;
        s.add(this.#r.eatLine());
      }
      ;
      s.addChar(10);
      if (this.#r.peek(this.#r.docPrefix()) == null) {
        break;
      }
      ;
    }
    ;
    this.sLComments();
    if (sys.ObjUtil.equals(chomp, "strip")) {
      while ((!s.isEmpty() && sys.ObjUtil.equals(s.get(-1), 10))) {
        s.remove(-1);
      }
      ;
    }
    else {
      if (sys.ObjUtil.equals(chomp, "clip")) {
        while ((sys.ObjUtil.compareGT(s.size(), 1) && sys.ObjUtil.equals(s.get(-1), 10) && sys.ObjUtil.equals(s.get(-2), 10))) {
          s.remove(-1);
        }
        ;
        if ((sys.ObjUtil.equals(s.size(), 1) && sys.ObjUtil.equals(s.get(0), 10))) {
          s.remove(0);
        }
        ;
      }
      ;
    }
    ;
    return YamlScalar.make(s.toStr(), ((this$) => { if (sys.ObjUtil.equals(tag, "")) return "!"; return tag; })(this), sys.ObjUtil.coerce(startLoc, util.FileLoc.type$));
  }

  parseBlockHeader(n) {
    const this$ = this;
    let res = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?"));
    sys.Str.chars(this.#r.eatToken(null, this.#r.blockStyle())).each((c1) => {
      if ((sys.ObjUtil.equals(c1, 43) || sys.ObjUtil.equals(c1, 45))) {
        if (res.containsKey("chomp")) {
          throw this$.err("The chomping indicator cannot be specified twice.");
        }
        ;
        res.set("chomp", ((this$) => { if (sys.ObjUtil.equals(c1, 43)) return "keep"; return "strip"; })(this$));
      }
      else {
        if (res.containsKey("indent")) {
          throw this$.err("The indentation indicator cannot be specified twice or with multiple digits.");
        }
        ;
        res.set("indent", sys.ObjUtil.coerce(sys.Int.minus(sys.Int.plus(n, sys.ObjUtil.coerce(sys.Int.fromDigit(c1), sys.Int.type$)), 1), sys.Obj.type$.toNullable()));
      }
      ;
      return;
    });
    this.#r.eatCommentLine("A block style header");
    if (!res.containsKey("chomp")) {
      res.set("chomp", "clip");
    }
    ;
    return sys.ObjUtil.coerce(res, sys.Type.find("[sys::Str:sys::Obj]"));
  }

  parseSingleQuote(n,ctx,tag,loc) {
    const this$ = this;
    let c = null;
    let s = sys.StrBuf.make();
    let initLoc = this.#r.loc();
    let endFound = false;
    this.#r.eatChar(39);
    let readSingleLine = () => {
      while ((sys.ObjUtil.compareNE(this$.#r.peekNextNs(this$.#r.str()), 10) && (c = sys.Func.call(this$.#r.str())) != null)) {
        if (sys.ObjUtil.equals(c, 39)) {
          if (sys.ObjUtil.equals(this$.#r.peek(this$.#r.any()), 39)) {
            (c = sys.Func.call(this$.#r.str()));
          }
          else {
            (endFound = true);
            break;
          }
          ;
        }
        ;
        s.addChar(sys.ObjUtil.coerce(c, sys.Int.type$));
      }
      ;
      return;
    };
    sys.Func.call(readSingleLine);
    if ((sys.ObjUtil.equals(ctx, Context.flowOut()) || sys.ObjUtil.equals(ctx, Context.flowIn()))) {
      while ((!endFound && sys.ObjUtil.equals(this.#r.peekNextNs(this.#r.str()), 10) && !this.#r.nextTokenEndsDoc())) {
        this.#r.eatLine(this.#r.ws());
        if (sys.ObjUtil.equals(this.#r.peekNextNs(this.#r.str()), 10)) {
          while (sys.ObjUtil.equals(this.#r.peekNextNs(this.#r.str()), 10)) {
            s.addChar(10);
            this.#r.eatLine(this.#r.ws());
          }
          ;
        }
        else {
          s.addChar(32);
        }
        ;
        this.#r.eatInd(n);
        this.#r.eatWs();
        sys.Func.call(readSingleLine);
      }
      ;
    }
    ;
    if (sys.ObjUtil.compareNE(c, 39)) {
      throw this.err("Ending ' not found.", initLoc);
    }
    ;
    if (sys.ObjUtil.equals(this.#r.peek(), 35)) {
      throw this.err("Comments must be preceded by whitespace.");
    }
    ;
    return YamlScalar.make(s.toStr(), ((this$) => { if (sys.ObjUtil.equals(tag, "")) return "!"; return tag; })(this), sys.ObjUtil.coerce(((this$) => { let $_u13 = loc; if ($_u13 != null) return $_u13; return initLoc; })(this), util.FileLoc.type$));
  }

  parseDoubleQuote(n,ctx,tag,loc) {
    const this$ = this;
    let c = null;
    let s = sys.StrBuf.make();
    let initLoc = this.#r.loc();
    let endFound = false;
    this.#r.eatChar(34);
    let readDoubleLine = () => {
      while ((sys.ObjUtil.compareNE(this$.#r.peekNextNs(this$.#r.str()), 10) && (c = sys.Func.call(this$.#r.str())) != null)) {
        if (sys.ObjUtil.equals(c, 34)) {
          (endFound = true);
          break;
        }
        else {
          if (sys.ObjUtil.equals(c, 92)) {
            let $_u14 = (c = sys.Func.call(this$.#r.str()));
            if (sys.ObjUtil.equals($_u14, 48)) {
              s.addChar(0);
            }
            else if (sys.ObjUtil.equals($_u14, 97)) {
              s.addChar(7);
            }
            else if (sys.ObjUtil.equals($_u14, 98)) {
              s.addChar(8);
            }
            else if (sys.ObjUtil.equals($_u14, 116)) {
              s.addChar(9);
            }
            else if (sys.ObjUtil.equals($_u14, 9)) {
              s.addChar(9);
            }
            else if (sys.ObjUtil.equals($_u14, 110)) {
              s.addChar(10);
            }
            else if (sys.ObjUtil.equals($_u14, 118)) {
              s.addChar(11);
            }
            else if (sys.ObjUtil.equals($_u14, 102)) {
              s.addChar(12);
            }
            else if (sys.ObjUtil.equals($_u14, 114)) {
              s.addChar(13);
            }
            else if (sys.ObjUtil.equals($_u14, 101)) {
              s.addChar(27);
            }
            else if (sys.ObjUtil.equals($_u14, 32)) {
              s.addChar(32);
            }
            else if (sys.ObjUtil.equals($_u14, 34)) {
              s.addChar(34);
            }
            else if (sys.ObjUtil.equals($_u14, 47)) {
              s.addChar(47);
            }
            else if (sys.ObjUtil.equals($_u14, 92)) {
              s.addChar(92);
            }
            else if (sys.ObjUtil.equals($_u14, 78)) {
              s.addChar(133);
            }
            else if (sys.ObjUtil.equals($_u14, 95)) {
              s.addChar(160);
            }
            else if (sys.ObjUtil.equals($_u14, 76)) {
              s.addChar(8232);
            }
            else if (sys.ObjUtil.equals($_u14, 80)) {
              s.addChar(8233);
            }
            else if (sys.ObjUtil.equals($_u14, 120)) {
              let digs = sys.List.make(sys.Obj.type$.toNullable());
              sys.Int.times(2, (_) => {
                digs.add(sys.ObjUtil.coerce(sys.Func.call(this$.#r.hex()), sys.Obj.type$.toNullable()));
                return;
              });
              s.addChar(sys.ObjUtil.coerce(sys.Int.fromStr(sys.Str.fromChars(sys.ObjUtil.coerce(digs, sys.Type.find("sys::Int[]"))), 16), sys.Int.type$));
            }
            else if (sys.ObjUtil.equals($_u14, 117)) {
              let digs = sys.List.make(sys.Obj.type$.toNullable());
              sys.Int.times(4, (_) => {
                digs.add(sys.ObjUtil.coerce(sys.Func.call(this$.#r.hex()), sys.Obj.type$.toNullable()));
                return;
              });
              s.addChar(sys.ObjUtil.coerce(sys.Int.fromStr(sys.Str.fromChars(sys.ObjUtil.coerce(digs, sys.Type.find("sys::Int[]"))), 16), sys.Int.type$));
            }
            else if (sys.ObjUtil.equals($_u14, 85)) {
              let digs = sys.List.make(sys.Obj.type$.toNullable());
              sys.Int.times(8, (_) => {
                digs.add(sys.ObjUtil.coerce(sys.Func.call(this$.#r.hex()), sys.Obj.type$.toNullable()));
                return;
              });
              s.addChar(sys.ObjUtil.coerce(sys.Int.fromStr(sys.Str.fromChars(sys.ObjUtil.coerce(digs, sys.Type.find("sys::Int[]"))), 16), sys.Int.type$));
            }
            else if (sys.ObjUtil.equals($_u14, 10)) {
              if ((sys.ObjUtil.equals(ctx, Context.flowOut()) || sys.ObjUtil.equals(ctx, Context.flowIn()))) {
                if (sys.ObjUtil.compareNE(this$.#r.peekNextNs(this$.#r.str()), 10)) {
                  this$.#r.eatInd(n);
                }
                ;
                this$.#r.eatWs();
              }
              else {
                throw this$.err("Ending \" not found.", initLoc);
              }
              ;
            }
            else if (sys.ObjUtil.equals($_u14, null)) {
              throw this$.err("Ending \" not found.", initLoc);
            }
            else {
              throw this$.err(sys.Str.plus(sys.Str.plus("\"\\", sys.Int.toChar(sys.ObjUtil.coerce(c, sys.Int.type$))), "\" is not a valid escape sequence."));
            }
            ;
          }
          else {
            s.addChar(sys.ObjUtil.coerce(c, sys.Int.type$));
          }
          ;
        }
        ;
      }
      ;
      return;
    };
    sys.Func.call(readDoubleLine);
    if ((sys.ObjUtil.equals(ctx, Context.flowOut()) || sys.ObjUtil.equals(ctx, Context.flowIn()))) {
      while ((!endFound && sys.ObjUtil.equals(this.#r.peekNextNs(this.#r.str()), 10) && !this.#r.nextTokenEndsDoc())) {
        this.#r.eatLine(this.#r.ws());
        if (sys.ObjUtil.equals(this.#r.peekNextNs(this.#r.str()), 10)) {
          while (sys.ObjUtil.equals(this.#r.peekNextNs(this.#r.str()), 10)) {
            s.addChar(10);
            this.#r.eatLine(this.#r.ws());
          }
          ;
        }
        else {
          if (this.#r.peekNextNs(this.#r.str()) == null) {
            throw this.err("Ending \" not found.", initLoc);
          }
          else {
            s.addChar(32);
          }
          ;
        }
        ;
        this.#r.eatInd(n);
        this.#r.eatWs();
        sys.Func.call(readDoubleLine);
      }
      ;
    }
    ;
    if (sys.ObjUtil.compareNE(c, 34)) {
      throw this.err("Ending \" not found.", initLoc);
    }
    ;
    if (sys.ObjUtil.equals(this.#r.peek(), 35)) {
      throw this.err("Comments must be preceded by whitespace.");
    }
    ;
    return YamlScalar.make(s.toStr(), ((this$) => { if (sys.ObjUtil.equals(tag, "")) return "!"; return tag; })(this), sys.ObjUtil.coerce(((this$) => { let $_u16 = loc; if ($_u16 != null) return $_u16; return initLoc; })(this), util.FileLoc.type$));
  }

  parseFlowSeq(n,ctx,tag,loc) {
    let res = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("yaml::YamlObj[]"));
    if (sys.ObjUtil.equals(ctx, Context.flowOut())) {
      (ctx = Context.flowIn());
    }
    ;
    if (sys.ObjUtil.equals(ctx, Context.blockKey())) {
      (ctx = Context.flowKey());
    }
    ;
    let startLoc = ((this$) => { let $_u17 = loc; if ($_u17 != null) return $_u17; return this$.#r.loc(); })(this);
    this.#r.eatChar(91);
    this.separate(n, ctx);
    while ((this.#r.peek() != null && sys.ObjUtil.compareNE(this.#r.peek(), 93) && !this.#r.nextTokenEndsDoc())) {
      res.add(this.parseFlowSeqEntry(n, ctx));
      this.separate(n, ctx);
      if (sys.ObjUtil.equals(this.#r.peek(), 44)) {
        this.#r.eatChar(44);
        if (sys.ObjUtil.equals(this.#r.peek(), 35)) {
          throw this.err("Comments must be preceded by whitespace.");
        }
        ;
        this.separate(n, ctx);
      }
      else {
        break;
      }
      ;
    }
    ;
    this.#r.eatChar(93);
    if (sys.ObjUtil.equals(this.#r.peek(), 35)) {
      throw this.err("Comments must be preceded by whitespace.");
    }
    ;
    return YamlList.make(res, tag, sys.ObjUtil.coerce(startLoc, util.FileLoc.type$));
  }

  parseFlowSeqEntry(n,ctx) {
    if (sys.ObjUtil.equals(this.#r.peekToken(), "?")) {
      let startLoc = this.#r.loc();
      let entry = this.parseFlowMapEntry(n, ctx);
      return YamlMap.makeLoc(sys.Map.__fromLiteral([sys.ObjUtil.coerce(entry.get("key"), YamlObj.type$)], [sys.ObjUtil.coerce(entry.get("val"), YamlObj.type$)], sys.Type.find("yaml::YamlObj"), sys.Type.find("yaml::YamlObj")), startLoc);
    }
    else {
      if (this.nextNodeIsKey(n, ctx)) {
        let key = YamlScalar.makeLoc("", this.#r.loc());
        if (sys.ObjUtil.compareNE(this.#r.peek(), 58)) {
          (key = this.parseFlowNode(n, Context.flowKey()));
        }
        ;
        this.#r.eatWs();
        this.#r.eatChar(58);
        this.separate(n, ctx);
        let val = YamlScalar.makeLoc("", this.#r.loc());
        if (!sys.List.make(sys.Int.type$.toNullable(), [sys.ObjUtil.coerce(sys.ObjUtil.coerce(93, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), null]).contains(sys.ObjUtil.coerce(this.#r.peek(), sys.Obj.type$.toNullable()))) {
          (val = this.parseFlowNode(n, ctx));
        }
        ;
        return YamlMap.makeLoc(sys.Map.__fromLiteral([key], [val], sys.Type.find("yaml::YamlObj"), sys.Type.find("yaml::YamlObj")), key.loc());
      }
      ;
    }
    ;
    return this.parseFlowNode(n, ctx);
  }

  parseFlowMap(n,ctx,tag,loc) {
    let res = sys.Map.__fromLiteral([], [], sys.Type.find("yaml::YamlObj"), sys.Type.find("yaml::YamlObj"));
    if (sys.ObjUtil.equals(ctx, Context.flowOut())) {
      (ctx = Context.flowIn());
    }
    ;
    if (sys.ObjUtil.equals(ctx, Context.blockKey())) {
      (ctx = Context.flowKey());
    }
    ;
    let startLoc = ((this$) => { let $_u18 = loc; if ($_u18 != null) return $_u18; return this$.#r.loc(); })(this);
    this.#r.eatChar(123);
    this.separate(n, ctx);
    while ((this.#r.peek() != null && sys.ObjUtil.compareNE(this.#r.peek(), 125) && !this.#r.nextTokenEndsDoc())) {
      let entry = this.parseFlowMapEntry(n, ctx);
      res.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(entry.get("key")), YamlObj.type$.toNullable()), YamlObj.type$), sys.ObjUtil.coerce(entry.get("val"), YamlObj.type$));
      this.separate(n, ctx);
      if (sys.ObjUtil.equals(this.#r.peek(), 44)) {
        this.#r.eatChar(44);
        if (sys.ObjUtil.equals(this.#r.peek(), 35)) {
          throw this.err("Comments must be preceded by whitespace.");
        }
        ;
        this.separate(n, ctx);
      }
      else {
        break;
      }
      ;
    }
    ;
    this.#r.eatChar(125);
    if (sys.ObjUtil.equals(this.#r.peek(), 35)) {
      throw this.err("Comments must be preceded by whitespace.");
    }
    ;
    return YamlMap.make(res, tag, sys.ObjUtil.coerce(startLoc, util.FileLoc.type$));
  }

  parseFlowMapEntry(n,ctx) {
    const this$ = this;
    let key = YamlScalar.makeLoc("", this.#r.loc());
    let val = YamlScalar.makeLoc("", this.#r.loc());
    let keyIsJson = this.#r.nextKeyIsJson();
    if (sys.ObjUtil.equals(this.#r.peekToken(), "?")) {
      this.#r.eatToken("?");
      this.separate(n, ctx);
      if (this.#r.isFlowEnd(this.#r.peek())) {
        return sys.Map.__fromLiteral(["key","val"], [key,val], sys.Type.find("sys::Str"), sys.Type.find("yaml::YamlObj"));
      }
      ;
    }
    ;
    (key = YamlScalar.makeLoc("", this.#r.loc()));
    let emptyKey = sys.ObjUtil.equals(this.#r.peekUntil((c1) => {
      return (!this$.#r.isNs(sys.ObjUtil.coerce(c1, sys.Int.type$.toNullable())) || this$.#r.isFlow(sys.ObjUtil.coerce(c1, sys.Int.type$.toNullable())));
    }), ":");
    if (!emptyKey) {
      (key = this.parseFlowNode(n, ctx));
    }
    ;
    this.separate(n, ctx);
    (val = YamlScalar.makeLoc("", this.#r.loc()));
    if (sys.ObjUtil.equals(this.#r.peek(), 58)) {
      this.#r.eatChar(58);
      if ((!this.#r.isFlowEnd(this.#r.peek()) && this.#r.isNs(this.#r.peek()) && !keyIsJson)) {
        throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("The character '", ((this$) => { let $_u19 = this$.#r.peek(); if ($_u19 == null) return null; return sys.Int.toChar(this$.#r.peek()); })(this)), "' cannot immediately follow a : indicating a mapping. "), sys.Str.plus(sys.Str.plus("Try putting a space between the : and ", ((this$) => { let $_u20 = this$.#r.peek(); if ($_u20 == null) return null; return sys.Int.toChar(this$.#r.peek()); })(this)), ".")));
      }
      ;
      this.separate(n, ctx);
      if (!this.#r.isFlowEnd(this.#r.peek())) {
        (val = this.parseFlowNode(n, ctx));
      }
      ;
    }
    else {
      if (emptyKey) {
        throw this.err("A map entry cannot be completely empty here.");
      }
      ;
    }
    ;
    return sys.Map.__fromLiteral(["key","val"], [key,val], sys.Type.find("sys::Str"), sys.Type.find("yaml::YamlObj"));
  }

  parseBlockSeq(n,tag,loc) {
    const this$ = this;
    let startLoc = loc;
    let m = sys.Str.size(this.#r.peekUntil((c1) => {
      return sys.ObjUtil.compareNE(c1, 32);
    }));
    if (sys.ObjUtil.compareLE(m, n)) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Your list must be indented by at least ", sys.ObjUtil.coerce(sys.Int.plus(n, 1), sys.Obj.type$.toNullable())), " spaces, not just "), sys.ObjUtil.coerce(m, sys.Obj.type$.toNullable())), "."));
    }
    ;
    let res = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("yaml::YamlObj[]"));
    while ((sys.ObjUtil.equals(sys.Str.size(this.#r.peekUntil((c1) => {
      return sys.ObjUtil.compareNE(c1, 32);
    })), m) && sys.ObjUtil.equals(this.#r.peekPast((c1) => {
      return this$.#r.isWs(sys.ObjUtil.coerce(c1, sys.Int.type$.toNullable()));
    }), 45) && !this.#r.nextTokenEndsDoc())) {
      this.#r.eatInd(m);
      if (startLoc == null) {
        (startLoc = this.#r.loc());
      }
      ;
      res.add(this.parseBlockSeqEntry(m));
    }
    ;
    return YamlList.make(res, tag, sys.ObjUtil.coerce(startLoc, util.FileLoc.type$));
  }

  parseBlockSeqEntry(n) {
    this.#r.eatChar(45);
    if (this.#r.isNs(this.#r.peek())) {
      throw this.err(sys.Str.plus(sys.Str.plus("The - in your list cannot be followed by the non-whitespace character '", ((this$) => { let $_u21 = this$.#r.peek(); if ($_u21 == null) return null; return sys.Int.toChar(this$.#r.peek()); })(this)), "'."));
    }
    ;
    return this.parseBlockIndented(n, Context.blockIn());
  }

  parseBlockMap(n,tag,loc) {
    const this$ = this;
    let startLoc = loc;
    let m = sys.Str.size(this.#r.peekUntil((c1) => {
      return sys.ObjUtil.compareNE(c1, 32);
    }));
    if (sys.ObjUtil.compareLE(m, n)) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Your list must be indented by at least ", sys.ObjUtil.coerce(sys.Int.plus(n, 1), sys.Obj.type$.toNullable())), " spaces, not just "), sys.ObjUtil.coerce(m, sys.Obj.type$.toNullable())), "."));
    }
    ;
    let res = sys.Map.__fromLiteral([], [], sys.Type.find("yaml::YamlObj"), sys.Type.find("yaml::YamlObj"));
    res.ordered(true);
    while ((sys.ObjUtil.equals(sys.Str.size(this.#r.peekUntil((c1) => {
      return sys.ObjUtil.compareNE(c1, 32);
    })), m) && this.#r.isNs(this.#r.peekPast((c1) => {
      return sys.ObjUtil.equals(c1, 32);
    })) && (sys.ObjUtil.equals(this.#r.peekNextNs(), 63) || this.nextNodeIsKey(m, Context.blockIn())) && !this.#r.nextTokenEndsDoc())) {
      this.#r.eatInd(m);
      if (startLoc == null) {
        (startLoc = this.#r.loc());
      }
      ;
      let entry = this.parseBlockMapEntry(m);
      res.add(sys.ObjUtil.coerce(entry.get("key"), YamlObj.type$), sys.ObjUtil.coerce(entry.get("val"), YamlObj.type$));
    }
    ;
    return YamlMap.make(res, tag, sys.ObjUtil.coerce(startLoc, util.FileLoc.type$));
  }

  parseBlockMapEntry(n) {
    const this$ = this;
    let res = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?"));
    if (sys.ObjUtil.equals(this.#r.peekToken(), "?")) {
      this.#r.eatToken("?");
      res.set("key", this.parseBlockIndented(n, Context.blockOut()));
      if ((sys.ObjUtil.equals(sys.Str.size(this.#r.peekUntil((c1) => {
        return sys.ObjUtil.compareNE(c1, 32);
      })), n) && sys.ObjUtil.equals(this.#r.peekPast((c1) => {
        return sys.ObjUtil.equals(c1, 32);
      }), 58))) {
        this.#r.eatInd(n);
        this.#r.eatChar(58);
        if (this.#r.isNs(this.#r.peek())) {
          throw this.err(sys.Str.plus(sys.Str.plus("The : in your mapping cannot be followed by the non-whitespace character '", sys.ObjUtil.coerce(this.#r.peek(), sys.Obj.type$.toNullable())), "'."));
        }
        ;
        res.set("val", this.parseBlockIndented(n, Context.blockOut()));
      }
      else {
        res.set("val", YamlScalar.makeLoc("", this.#r.loc()));
      }
      ;
    }
    else {
      if (!this.nextNodeIsKey(n, Context.blockKey())) {
        throw this.err("This node is not a implicit key. Make sure it is not too long (>1024 characters) and only spans a single line, or consider making it an explicit key instead.");
      }
      ;
      this.#r.eatWs();
      if (sys.ObjUtil.equals(this.#r.peekToken(), ":")) {
        res.set("key", YamlScalar.makeLoc("", this.#r.loc()));
      }
      else {
        res.set("key", this.parseFlowNode(0, Context.blockKey()));
      }
      ;
      this.#r.eatWs();
      this.#r.eatChar(58);
      if ((this.#r.nextTokenEndsDoc() || (this.#r.peekIndentedNs(sys.Int.plus(n, 1), this.#r.docPrefix()) == null && sys.ObjUtil.compareNE(this.#r.peekIndentedToken(n, this.#r.docPrefix()), "-")))) {
        res.set("val", YamlScalar.makeLoc("", this.#r.loc()));
        this.sLComments();
      }
      else {
        if (((sys.ObjUtil.compareNE(this.#r.peekNextNs(), 35) && sys.ObjUtil.compareNE(this.#r.peekNextNs(), 10) && this.nextNodeIsKey(sys.Int.plus(n, 1), Context.blockKey())) || sys.ObjUtil.equals(this.#r.peekToken(), "?"))) {
          throw this.err("A map embedded in a mapping cannot start on the same line as its corresponding key.");
        }
        else {
          res.set("val", this.parseBlockNode(n, Context.blockOut()));
        }
        ;
      }
      ;
    }
    ;
    return sys.ObjUtil.coerce(res, sys.Type.find("[sys::Str:yaml::YamlObj]"));
  }

  parseBlockIndented(n,ctx) {
    const this$ = this;
    if ((sys.ObjUtil.equals(this.#r.peekPast((c1) => {
      return sys.ObjUtil.equals(c1, 32);
    }), 45) && sys.ObjUtil.equals(this.#r.peekIndentedToken(0), "-"))) {
      let m = sys.Str.size(this.#r.eatUntil((c1) => {
        return sys.ObjUtil.compareNE(c1, 32);
      }));
      let res = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("yaml::YamlObj[]"));
      let startLoc = this.#r.loc();
      res.add(this.parseBlockSeqEntry(sys.Int.plus(sys.Int.plus(n, 1), m)));
      while ((sys.ObjUtil.equals(sys.Str.size(this.#r.peekUntil((c1) => {
        return sys.ObjUtil.compareNE(c1, 32);
      })), sys.Int.plus(sys.Int.plus(n, 1), m)) && sys.ObjUtil.equals(this.#r.peekPast((c1) => {
        return sys.ObjUtil.equals(c1, 32);
      }), 45))) {
        this.#r.eatInd(sys.Int.plus(sys.Int.plus(n, 1), m));
        res.add(this.parseBlockSeqEntry(sys.Int.plus(sys.Int.plus(n, 1), m)));
      }
      ;
      return YamlList.makeLoc(res, startLoc);
    }
    else {
      if ((this.#r.isNs(this.#r.peekPast((c1) => {
        return sys.ObjUtil.equals(c1, 32);
      })) && (sys.ObjUtil.equals(this.#r.peekIndentedToken(0), "?") || this.nextNodeIsKey(n, ctx)))) {
        let m = sys.Str.size(this.#r.eatUntil((c1) => {
          return sys.ObjUtil.compareNE(c1, 32);
        }));
        let res = sys.Map.__fromLiteral([], [], sys.Type.find("yaml::YamlObj"), sys.Type.find("yaml::YamlObj"));
        let startLoc = this.#r.loc();
        let entry = this.parseBlockMapEntry(sys.Int.plus(sys.Int.plus(n, 1), m));
        res.add(sys.ObjUtil.coerce(entry.get("key"), YamlObj.type$), sys.ObjUtil.coerce(entry.get("val"), YamlObj.type$));
        while ((sys.ObjUtil.equals(sys.Str.size(this.#r.peekUntil((c1) => {
          return sys.ObjUtil.compareNE(c1, 32);
        })), sys.Int.plus(sys.Int.plus(n, 1), m)) && this.#r.isNs(this.#r.peekPast((c1) => {
          return sys.ObjUtil.equals(c1, 32);
        })))) {
          this.#r.eatInd(sys.Int.plus(sys.Int.plus(n, 1), m));
          (entry = this.parseBlockMapEntry(sys.Int.plus(sys.Int.plus(n, 1), m)));
          res.add(sys.ObjUtil.coerce(entry.get("key"), YamlObj.type$), sys.ObjUtil.coerce(entry.get("val"), YamlObj.type$));
        }
        ;
        return YamlMap.makeLoc(res, startLoc);
      }
      else {
        if ((this.#r.peekIndentedNs(sys.Int.plus(n, 1), this.#r.docPrefix()) == null && !(sys.ObjUtil.equals(ctx, Context.blockOut()) && sys.ObjUtil.equals(this.#r.peekIndentedToken(n, this.#r.docPrefix()), "-")))) {
          let startLoc = this.#r.loc();
          this.sLComments();
          return YamlScalar.makeLoc("", startLoc);
        }
        else {
          return this.parseBlockNode(n, ctx);
        }
        ;
      }
      ;
    }
    ;
  }

  parsePlain(n,ctx,tag,loc) {
    const this$ = this;
    let s = sys.StrBuf.make();
    let startLoc = ((this$) => { let $_u22 = loc; if ($_u22 != null) return $_u22; return this$.#r.loc(); })(this);
    let c = sys.Func.call(this.#r.firstChar(ctx));
    s.addChar(sys.ObjUtil.coerce(c, sys.Int.type$));
    s.add(this.plainInLine(ctx));
    if ((sys.ObjUtil.equals(ctx, Context.flowOut()) || sys.ObjUtil.equals(ctx, Context.flowIn()))) {
      while ((sys.ObjUtil.compareNE(this.#r.peekNextNs(), 35) && this.#r.peekIndentedNs(n, this.#r.docPrefix()) != null && !this.#r.nextTokenEndsDoc() && sys.ObjUtil.compareNE(this.#r.peekUntil((c1) => {
        return (!this$.#r.isNs(sys.ObjUtil.coerce(c1, sys.Int.type$.toNullable())) || (sys.ObjUtil.equals(ctx, Context.flowIn()) && this$.#r.isFlow(sys.ObjUtil.coerce(c1, sys.Int.type$.toNullable()))));
      }), ":") && ((this$) => { if (sys.ObjUtil.equals(ctx, Context.flowIn())) return !this$.#r.isFlow(this$.#r.peek()); return true; })(this))) {
        this.#r.eatLine(this.#r.ws());
        if (sys.ObjUtil.compareNE(this.#r.peekNextNs(), 10)) {
          s.addChar(32);
        }
        else {
          while (sys.ObjUtil.equals(this.#r.peekNextNs(), 10)) {
            s.addChar(10);
            this.#r.eatLine(this.#r.ws());
          }
          ;
        }
        ;
        this.#r.eatWs();
        s.add(this.plainInLine(ctx));
      }
      ;
    }
    ;
    return YamlScalar.make(sys.Str.trim(s.toStr()), tag, sys.ObjUtil.coerce(startLoc, util.FileLoc.type$));
  }

  plainInLine(ctx) {
    const this$ = this;
    if (sys.ObjUtil.equals(this.#r.peek(), 35)) {
      return "";
    }
    ;
    let s = sys.Str.trimEnd(this.#r.eatUntil((c1) => {
      return (this$.#r.isNl(sys.ObjUtil.coerce(c1, sys.Int.type$.toNullable())) || (this$.#r.isWs(sys.ObjUtil.coerce(c1, sys.Int.type$.toNullable())) && sys.ObjUtil.equals(this$.#r.peekNextNs(), 35)) || (sys.ObjUtil.equals(c1, 58) && !this$.#r.isNs(this$.#r.peek())) || ((this$) => { if ((sys.ObjUtil.equals(ctx, Context.flowIn()) || sys.ObjUtil.equals(ctx, Context.flowKey()))) return (this$.#r.isFlow(sys.ObjUtil.coerce(c1, sys.Int.type$.toNullable())) || (sys.ObjUtil.equals(c1, 58) && this$.#r.isFlow(this$.#r.peek()))); return false; })(this$));
    }));
    this.#r.eatWs();
    return s;
  }

  separate(n,ctx) {
    if ((sys.ObjUtil.equals(ctx, Context.blockKey()) || sys.ObjUtil.equals(ctx, Context.flowKey()) || !sys.ObjUtil.as(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(35, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable())]), sys.Type.find("sys::Int?[]")).contains(sys.ObjUtil.coerce(this.#r.peekNextNs(), sys.Obj.type$.toNullable())))) {
      this.#r.eatWs();
    }
    else {
      this.sLComments();
      this.#r.eatInd(n);
      this.#r.eatWs();
    }
    ;
    return;
  }

  sLComments(readRule) {
    if (readRule === undefined) readRule = this.#r.printable();
    if (sys.ObjUtil.compareNE(this.#r.loc().col(), 1)) {
      this.#r.eatCommentLine();
    }
    ;
    while (sys.ObjUtil.as(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(35, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable())]), sys.Type.find("sys::Int?[]")).contains(sys.ObjUtil.coerce(this.#r.peekNextNs(readRule), sys.Obj.type$.toNullable()))) {
      this.#r.eatLine(readRule);
    }
    ;
    return;
  }

  parseDocEnd() {
    this.assertLineStart();
    this.#r.eatStr("...");
    this.#r.eatCommentLine("Document suffixes");
    this.parseDocument();
    return;
  }

  err(msg,loc) {
    if (loc === undefined) loc = null;
    if (loc == null) {
      (loc = this.#r.loc());
    }
    ;
    return util.FileLocErr.make(msg, sys.ObjUtil.coerce(loc, util.FileLoc.type$));
  }

  assertLineStart() {
    if ((sys.ObjUtil.compareNE(this.#r.loc().col(), 1) && this.#r.peek(this.#r.any()) != null)) {
      throw this.err("Internal parser error: The parser should have been at the beginning of the line here.");
    }
    ;
    return;
  }

  objSLComments(startLine,keyIsJson,ret) {
    this.#r.eatWs();
    if (sys.ObjUtil.equals(this.#r.peekToken(), ":")) {
      let msg = sys.Str.trim(ret.toStr());
      if (sys.ObjUtil.compareNE(this.#r.loc().line(), startLine)) {
        if (sys.Str.containsChar(msg, 10)) {
          throw this.err(sys.Str.plus(sys.Str.plus("The key \n", msg), "\n spans multiple lines."));
        }
        else {
          throw this.err(sys.Str.plus(sys.Str.plus("The key '", msg), "' spans multiple lines."));
        }
        ;
      }
      else {
        throw this.err("Plain scalars cannot contain \": \".");
      }
      ;
    }
    ;
    this.sLComments();
    return ret;
  }

  nextNodeIsKey(n,ctx) {
    let str = sys.Str.split(this.#r.nextKeyStr(n), sys.ObjUtil.coerce(10, sys.Int.type$.toNullable())).get(0);
    if (sys.ObjUtil.equals(sys.Str.getSafe(str, 1025), 58)) {
      (str = sys.Str.plus(sys.Str.getRange(str, sys.Range.make(0, 1024)), sys.ObjUtil.coerce(97, sys.Obj.type$.toNullable())));
    }
    ;
    return YamlParser.make(sys.Str.in(str), this.#r.loc()).startsWithKey(this.#tagShorthands, this.#anchors, ctx);
  }

  startsWithKey(tagShorthands,anchors,ctx) {
    const this$ = this;
    this.#tagShorthands = tagShorthands;
    this.#anchors = anchors;
    try {
      if (sys.ObjUtil.equals(this.#r.peekUntil((c1) => {
        return (!this$.#r.isNs(sys.ObjUtil.coerce(c1, sys.Int.type$.toNullable())) || (sys.ObjUtil.equals(ctx, Context.flowIn()) && this$.#r.isFlowEnd(sys.ObjUtil.coerce(c1, sys.Int.type$.toNullable()))));
      }), ":")) {
        return true;
      }
      ;
      let f = this.parseFlowNode(0, ((this$) => { if (ctx.isFlow()) return Context.flowKey(); return Context.blockKey(); })(this));
      this.#r.eatWs();
      this.#r.eatChar(58);
      return (!this.#r.isNs(this.#r.peek()) || (ctx.isFlow() && sys.ObjUtil.compareNE(f.tag(), "?")));
    }
    catch ($_u26) {
      $_u26 = sys.Err.make($_u26);
      if ($_u26 instanceof util.FileLocErr) {
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

  setLoc(obj,loc) {
    return sys.ObjUtil.coerce(sys.Type.of(obj).make(sys.List.make(sys.Obj.type$, [obj.val(), obj.tag(), loc])), YamlObj.type$);
  }

}

class Context extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Context.type$; }

  static blockIn() { return Context.vals().get(0); }

  static blockOut() { return Context.vals().get(1); }

  static flowIn() { return Context.vals().get(2); }

  static flowOut() { return Context.vals().get(3); }

  static blockKey() { return Context.vals().get(4); }

  static flowKey() { return Context.vals().get(5); }

  static #vals = undefined;

  isFlow() {
    return (sys.ObjUtil.equals(this, Context.flowIn()) || sys.ObjUtil.equals(this, Context.flowOut()) || sys.ObjUtil.equals(this, Context.flowKey()));
  }

  static make($ordinal,$name) {
    const $self = new Context();
    Context.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(Context.type$, Context.vals(), name$, checked);
  }

  static vals() {
    if (Context.#vals == null) {
      Context.#vals = sys.List.make(Context.type$, [
        Context.make(0, "blockIn", ),
        Context.make(1, "blockOut", ),
        Context.make(2, "flowIn", ),
        Context.make(3, "flowOut", ),
        Context.make(4, "blockKey", ),
        Context.make(5, "flowKey", ),
      ]).toImmutable();
    }
    return Context.#vals;
  }

  static static$init() {
    const $_u27 = Context.vals();
    if (true) {
    }
    ;
    return;
  }

}

class YamlReader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return YamlReader.type$; }

  #p = null;

  // private field reflection only
  __p(it) { if (it === undefined) return this.#p; else this.#p = it; }

  static make(in$,loc) {
    const $self = new YamlReader();
    YamlReader.make$($self,in$,loc);
    return $self;
  }

  static make$($self,in$,loc) {
    if (loc === undefined) loc = util.FileLoc.unknown();
    $self.#p = YamlParser.make(in$, loc);
    return;
  }

  static makeFile(file) {
    const $self = new YamlReader();
    YamlReader.makeFile$($self,file);
    return $self;
  }

  static makeFile$($self,file) {
    YamlReader.make$($self, file.in(), sys.ObjUtil.coerce(util.FileLoc.makeFile(file), util.FileLoc.type$));
    return;
  }

  parse() {
    return YamlList.make(this.#p.parse(), "tag:yaml.org,2002:stream");
  }

}

class YamlObj extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return YamlObj.type$; }

  #tagRef = null;

  tagRef() { return this.#tagRef; }

  __tagRef(it) { if (it === undefined) return this.#tagRef; else this.#tagRef = it; }

  #valRef = null;

  valRef() { return this.#valRef; }

  __valRef(it) { if (it === undefined) return this.#valRef; else this.#valRef = it; }

  #locRef = null;

  locRef() { return this.#locRef; }

  __locRef(it) { if (it === undefined) return this.#locRef; else this.#locRef = it; }

  tag() {
    return this.#tagRef;
  }

  val() {
    return this.#valRef;
  }

  content() {
    return this.#valRef;
  }

  loc() {
    return this.#locRef;
  }

  static make(val,tag,loc) {
    const $self = new YamlObj();
    YamlObj.make$($self,val,tag,loc);
    return $self;
  }

  static make$($self,val,tag,loc) {
    $self.#valRef = ((this$) => { let $_u28 = val; if ($_u28 == null) return null; return sys.ObjUtil.toImmutable(val); })($self);
    $self.#tagRef = tag;
    $self.#locRef = loc;
    return;
  }

  decode(schema) {
    if (schema === undefined) schema = YamlSchema.core();
    return schema.decode(this);
  }

  write(out) {
    if (out === undefined) out = sys.Env.cur().out();
    this.writeInd(out, 0);
    return;
  }

  equals(that) {
    return (sys.ObjUtil.equals(sys.ObjUtil.typeof(this), ((this$) => { let $_u29 = that; if ($_u29 == null) return null; return sys.ObjUtil.typeof(that); })(this)) && sys.ObjUtil.equals(this.tag(), sys.ObjUtil.as(that, YamlObj.type$).tag()) && sys.ObjUtil.equals(this.val(), sys.ObjUtil.as(that, YamlObj.type$).val()));
  }

  hash() {
    return sys.Int.plus(sys.Int.mult(31, sys.Str.hash(this.tag())), sys.ObjUtil.hash(this.val()));
  }

  toStr() {
    let buf = sys.StrBuf.make();
    this.write(buf.out());
    return buf.toStr();
  }

}

class YamlScalar extends YamlObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return YamlScalar.type$; }

  static make(val,tag,loc) {
    const $self = new YamlScalar();
    YamlScalar.make$($self,val,tag,loc);
    return $self;
  }

  static make$($self,val,tag,loc) {
    if (tag === undefined) tag = "?";
    if (loc === undefined) loc = util.FileLoc.unknown();
    YamlObj.make$($self, val, YamlScalar.normTag(tag), loc);
    return;
  }

  static normTag(tag) {
    if (sys.ObjUtil.equals(tag, "!")) {
      return "tag:yaml.org,2002:str";
    }
    ;
    if (sys.ObjUtil.compareNE(tag, "")) {
      return tag;
    }
    ;
    return "?";
  }

  static makeLoc(s,loc) {
    const $self = new YamlScalar();
    YamlScalar.makeLoc$($self,s,loc);
    return $self;
  }

  static makeLoc$($self,s,loc) {
    YamlScalar.make$($self, s, "?", loc);
    return;
  }

  val() {
    return sys.ObjUtil.coerce(this.valRef(), sys.Str.type$);
  }

  writeInd(out,first,next) {
    if (next === undefined) next = first;
    const this$ = this;
    out.writeChars(sys.Str.mult(" ", first));
    if (sys.ObjUtil.equals(this.tag(), "?")) {
      out.writeChars(sys.Str.plus(sys.Regex.fromStr("\\n(?=.)").matcher(this.val()).replaceAll(sys.Str.plus("\n\n", sys.Str.mult(" ", next))), "\n"));
    }
    else {
      if (sys.ObjUtil.compareNE(this.tag(), "tag:yaml.org,2002:str")) {
        out.writeChars(sys.Str.plus(sys.Str.plus("!<", this.tag()), "> "));
      }
      ;
      out.writeChar(34);
      sys.Str.each(sys.ObjUtil.as(this.val(), sys.Str.type$), (c) => {
        let $_u30 = c;
        if (sys.ObjUtil.equals($_u30, 0)) {
          out.writeChars("\\0");
        }
        else if (sys.ObjUtil.equals($_u30, 7)) {
          out.writeChars("\\a");
        }
        else if (sys.ObjUtil.equals($_u30, 8)) {
          out.writeChars("\\b");
        }
        else if (sys.ObjUtil.equals($_u30, 9)) {
          out.writeChars("\\t");
        }
        else if (sys.ObjUtil.equals($_u30, 10)) {
          out.writeChars("\\n");
        }
        else if (sys.ObjUtil.equals($_u30, 11)) {
          out.writeChars("\\v");
        }
        else if (sys.ObjUtil.equals($_u30, 12)) {
          out.writeChars("\\f");
        }
        else if (sys.ObjUtil.equals($_u30, 13)) {
          out.writeChars("\\r");
        }
        else if (sys.ObjUtil.equals($_u30, 27)) {
          out.writeChars("\\e");
        }
        else if (sys.ObjUtil.equals($_u30, 34)) {
          out.writeChars("\\\"");
        }
        else if (sys.ObjUtil.equals($_u30, 92)) {
          out.writeChars("\\\\");
        }
        else if (sys.ObjUtil.equals($_u30, 133)) {
          out.writeChars("\\N");
        }
        else if (sys.ObjUtil.equals($_u30, 160)) {
          out.writeChars("\\_");
        }
        else if (sys.ObjUtil.equals($_u30, 8232)) {
          out.writeChars("\\L");
        }
        else if (sys.ObjUtil.equals($_u30, 8233)) {
          out.writeChars("\\P");
        }
        else {
          if (YamlTokenizer.isPrintable(sys.ObjUtil.coerce(c, sys.Int.type$.toNullable()))) {
            out.writeChar(c);
          }
          else {
            if (sys.ObjUtil.compareLT(c, 256)) {
              out.writeChars(sys.Str.plus("\\x", sys.Int.toHex(c, sys.ObjUtil.coerce(2, sys.Int.type$.toNullable()))));
            }
            else {
              if (sys.ObjUtil.compareLT(c, 65536)) {
                out.writeChars(sys.Str.plus("\\u", sys.Int.toHex(c, sys.ObjUtil.coerce(4, sys.Int.type$.toNullable()))));
              }
              else {
                out.writeChars(sys.Str.plus("\\U", sys.Int.toHex(c, sys.ObjUtil.coerce(8, sys.Int.type$.toNullable()))));
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
      out.writeChars("\"\n");
    }
    ;
    return;
  }

}

class YamlList extends YamlObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return YamlList.type$; }

  static make(val,tag,loc) {
    const $self = new YamlList();
    YamlList.make$($self,val,tag,loc);
    return $self;
  }

  static make$($self,val,tag,loc) {
    if (tag === undefined) tag = "!";
    if (loc === undefined) loc = util.FileLoc.unknown();
    YamlObj.make$($self, val, YamlList.normTag(tag), loc);
    return;
  }

  static normTag(tag) {
    if ((sys.ObjUtil.equals(tag, "!") || sys.ObjUtil.equals(tag, ""))) {
      return "tag:yaml.org,2002:seq";
    }
    ;
    return tag;
  }

  static makeLoc(s,loc) {
    const $self = new YamlList();
    YamlList.makeLoc$($self,s,loc);
    return $self;
  }

  static makeLoc$($self,s,loc) {
    YamlList.make$($self, s, "!", loc);
    return;
  }

  val() {
    return sys.ObjUtil.coerce(this.valRef(), sys.Type.find("yaml::YamlObj[]"));
  }

  each(f) {
    sys.ObjUtil.coerce(this.val(), sys.Type.find("yaml::YamlObj[]")).each(f);
    return;
  }

  writeInd(out,first,next) {
    if (next === undefined) next = first;
    const this$ = this;
    if (sys.ObjUtil.equals(this.tag(), "tag:yaml.org,2002:stream")) {
      this.writeStream(out);
    }
    else {
      let contList = sys.ObjUtil.as(this.val(), sys.Type.find("yaml::YamlObj[]"));
      let isEmpty = sys.ObjUtil.equals(contList.size(), 0);
      let isTagged = (sys.ObjUtil.compareNE(this.tag(), "?") && sys.ObjUtil.compareNE(this.tag(), "tag:yaml.org,2002:seq"));
      if (isTagged) {
        out.writeChars(sys.Str.plus(sys.Str.plus(sys.Str.mult(" ", first), sys.Str.plus(sys.Str.plus("!<", this.tag()), ">")), ((this$) => { if (isEmpty) return " "; return "\n"; })(this)));
      }
      else {
        if (isEmpty) {
          out.writeChars(sys.Str.mult(" ", first));
        }
        ;
      }
      ;
      if (isEmpty) {
        out.writeChars("[]\n");
      }
      else {
        contList.each((v,i) => {
          out.writeChars(sys.Str.mult(" ", ((this$) => { if ((sys.ObjUtil.equals(i, 0) && !isTagged)) return first; return next; })(this$)));
          out.writeChars("- ");
          v.writeInd(out, 0, sys.Int.plus(next, 2));
          return;
        });
      }
      ;
    }
    ;
    return;
  }

  writeStream(out) {
    const this$ = this;
    let contList = sys.ObjUtil.as(this.val(), sys.Type.find("yaml::YamlObj[]"));
    if (sys.ObjUtil.compareNE(contList.size(), 0)) {
      out.writeChars("%YAML 1.2\n");
    }
    ;
    contList.each((v) => {
      out.writeChars("---\n");
      v.write(out);
      return;
    });
    return;
  }

}

class YamlMap extends YamlObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return YamlMap.type$; }

  static make(val,tag,loc) {
    const $self = new YamlMap();
    YamlMap.make$($self,val,tag,loc);
    return $self;
  }

  static make$($self,val,tag,loc) {
    if (tag === undefined) tag = "!";
    if (loc === undefined) loc = util.FileLoc.unknown();
    YamlObj.make$($self, val, YamlMap.normTag(tag), loc);
    return;
  }

  static normTag(tag) {
    if ((sys.ObjUtil.equals(tag, "!") || sys.ObjUtil.equals(tag, ""))) {
      return "tag:yaml.org,2002:map";
    }
    ;
    return tag;
  }

  static makeLoc(s,loc) {
    const $self = new YamlMap();
    YamlMap.makeLoc$($self,s,loc);
    return $self;
  }

  static makeLoc$($self,s,loc) {
    YamlMap.make$($self, s, "!", loc);
    return;
  }

  val() {
    return sys.ObjUtil.coerce(this.valRef(), sys.Type.find("[yaml::YamlObj:yaml::YamlObj]"));
  }

  writeInd(out,first,next) {
    if (next === undefined) next = first;
    const this$ = this;
    let contMap = sys.ObjUtil.as(this.val(), sys.Type.find("[yaml::YamlObj:yaml::YamlObj]"));
    let isEmpty = sys.ObjUtil.equals(contMap.keys().size(), 0);
    let isTagged = (sys.ObjUtil.compareNE(this.tag(), "?") && sys.ObjUtil.compareNE(this.tag(), "tag:yaml.org,2002:map"));
    if (isTagged) {
      out.writeChars(sys.Str.plus(sys.Str.plus(sys.Str.mult(" ", first), sys.Str.plus(sys.Str.plus("!<", this.tag()), ">")), ((this$) => { if (isEmpty) return " "; return "\n"; })(this)));
    }
    else {
      if (isEmpty) {
        out.writeChars(sys.Str.mult(" ", first));
      }
      ;
    }
    ;
    if (isEmpty) {
      out.writeChars("{}\n");
    }
    else {
      contMap.keys().each((k,i) => {
        let v = contMap.get(k);
        out.writeChars(sys.Str.mult(" ", ((this$) => { if ((sys.ObjUtil.equals(i, 0) && !isTagged)) return first; return next; })(this$)));
        let buf = sys.StrBuf.make();
        k.writeInd(buf.out(), 0, next);
        let kStr = sys.Str.getRange(buf.toStr(), sys.Range.make(0, -2));
        if (((sys.ObjUtil.equals(sys.ObjUtil.typeof(k), YamlScalar.type$) || sys.ObjUtil.equals(k.val(), sys.List.make(YamlObj.type$)) || sys.ObjUtil.equals(k.val(), sys.Map.__fromLiteral([], [], sys.Type.find("yaml::YamlObj"), sys.Type.find("yaml::YamlObj")))) && !sys.Str.containsChar(kStr, 10) && sys.ObjUtil.compareLE(sys.Str.size(kStr), 1024))) {
          out.writeChars(sys.Str.plus(kStr, ":"));
          if ((sys.ObjUtil.equals(sys.ObjUtil.typeof(v), YamlScalar.type$) || sys.ObjUtil.equals(v.val(), sys.List.make(YamlObj.type$)) || sys.ObjUtil.equals(v.val(), sys.Map.__fromLiteral([], [], sys.Type.find("yaml::YamlObj"), sys.Type.find("yaml::YamlObj"))))) {
            v.writeInd(out, 1, sys.Int.plus(next, 1));
          }
          else {
            out.writeChar(10);
            v.writeInd(out, sys.Int.plus(next, 1));
          }
          ;
        }
        else {
          out.writeChar(63);
          k.writeInd(out, 1, sys.Int.plus(next, 2));
          out.writeChars(sys.Str.plus(sys.Str.mult(" ", next), ":"));
          v.writeInd(out, 1, sys.Int.plus(next, 2));
        }
        ;
        return;
      });
    }
    ;
    return;
  }

}

class YamlSchema extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return YamlSchema.type$; }

  static #failsafe = undefined;

  static failsafe() {
    if (YamlSchema.#failsafe === undefined) {
      YamlSchema.static$init();
      if (YamlSchema.#failsafe === undefined) YamlSchema.#failsafe = null;
    }
    return YamlSchema.#failsafe;
  }

  static #json = undefined;

  static json() {
    if (YamlSchema.#json === undefined) {
      YamlSchema.static$init();
      if (YamlSchema.#json === undefined) YamlSchema.#json = null;
    }
    return YamlSchema.#json;
  }

  static #core = undefined;

  static core() {
    if (YamlSchema.#core === undefined) {
      YamlSchema.static$init();
      if (YamlSchema.#core === undefined) YamlSchema.#core = null;
    }
    return YamlSchema.#core;
  }

  decode(node) {
    return null;
  }

  validate(node) {
    return;
  }

  isRecognized(tag) {
    return false;
  }

  recEncode(obj,f) {
    const this$ = this;
    let type = ((this$) => { let $_u35 = obj; if ($_u35 == null) return null; return sys.ObjUtil.typeof(obj); })(this);
    let ser = sys.ObjUtil.coerce(((this$) => { let $_u36 = type; if ($_u36 == null) return null; return type.facet(sys.Serializable.type$, false); })(this), sys.Serializable.type$.toNullable());
    if ((ser == null && obj != null && !sys.ObjUtil.is(obj, sys.Str.type$))) {
      throw sys.IOErr.make(sys.Str.plus("Object type not serializable: ", type));
    }
    ;
    if (sys.ObjUtil.is(obj, YamlObj.type$)) {
      return sys.ObjUtil.coerce(obj, YamlObj.type$);
    }
    else {
      if ((obj == null || sys.ObjUtil.is(obj, sys.Str.type$))) {
        return sys.Func.call(f, obj);
      }
      else {
        if (ser.simple()) {
          return YamlScalar.make(sys.ObjUtil.coerce(sys.Func.call(f, obj).val(), sys.Str.type$), sys.Str.plus("!fan/", type));
        }
        else {
          if (sys.ObjUtil.is(obj, sys.Type.find("sys::List"))) {
            return YamlList.make(sys.List.make(YamlObj.type$).addAll(sys.ObjUtil.coerce(sys.ObjUtil.as(obj, sys.Type.find("sys::List")).map((v) => {
              return this$.recEncode(v, f);
            }, sys.Obj.type$.toNullable()), sys.Type.find("yaml::YamlObj[]"))));
          }
          else {
            if (sys.ObjUtil.is(obj, sys.Type.find("sys::Map"))) {
              let map = sys.ObjUtil.as(obj, sys.Type.find("sys::Map"));
              let res = sys.Map.__fromLiteral([], [], sys.Type.find("yaml::YamlObj"), sys.Type.find("yaml::YamlObj"));
              map.each((v,k) => {
                res.add(this$.recEncode(k, f), this$.recEncode(v, f));
                return;
              });
              return YamlMap.make(res);
            }
            else {
              let res = sys.Map.__fromLiteral([], [], sys.Type.find("yaml::YamlObj"), sys.Type.find("yaml::YamlObj"));
              type.fields().each((field) => {
                if ((field.isStatic() || field.hasFacet(sys.Transient.type$))) {
                  return;
                }
                ;
                res.add(this$.recEncode(field.name(), f), this$.recEncode(field.get(obj), f));
                return;
              });
              if (ser.collection()) {
                let eachList = sys.List.make(sys.Obj.type$.toNullable());
                sys.ObjUtil.trap(obj,"each", sys.List.make(sys.Obj.type$.toNullable(), [(child) => {
                  eachList.add(child);
                  return;
                }]));
                res.add(this.recEncode("each", f), this.recEncode(eachList, f));
              }
              ;
              return YamlMap.make(res, sys.Str.plus("!fan/", type));
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

  worksAsPlain(s) {
    try {
      let res = YamlReader.make(sys.Str.in(s)).parse().decode(this);
      return sys.ObjUtil.equals(sys.ObjUtil.trap(res,"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())])), s);
    }
    catch ($_u37) {
      $_u37 = sys.Err.make($_u37);
      if ($_u37 instanceof sys.Err) {
        let e = $_u37;
        ;
        return false;
      }
      else {
        throw $_u37;
      }
    }
    ;
  }

  static make() {
    const $self = new YamlSchema();
    YamlSchema.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    if (true) {
      YamlSchema.#failsafe = FailsafeSchema.make();
      YamlSchema.#json = JsonSchema.make();
      YamlSchema.#core = CoreSchema.make();
    }
    ;
    return;
  }

}

class YamlTagErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return YamlTagErr.type$; }

  static makeType(tag,type) {
    const $self = new YamlTagErr();
    YamlTagErr.makeType$($self,tag,type);
    return $self;
  }

  static makeType$($self,tag,type) {
    sys.Err.make$($self, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("The tag \"", tag), "\" cannot be assigned to the node type "), type.name()), "."));
    return;
  }

  static makeContent(obj) {
    const $self = new YamlTagErr();
    YamlTagErr.makeContent$($self,obj);
    return $self;
  }

  static makeContent$($self,obj) {
    sys.Err.make$($self, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("The tag \"", obj.tag()), "\" does not fit the content \""), obj.val()), "\"."));
    return;
  }

  static makeStr(msg) {
    const $self = new YamlTagErr();
    YamlTagErr.makeStr$($self,msg);
    return $self;
  }

  static makeStr$($self,msg) {
    sys.Err.make$($self, msg);
    return;
  }

}

class FailsafeSchema extends YamlSchema {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FailsafeSchema.type$; }

  decode(node) {
    const this$ = this;
    let tag = node.tag();
    if (!this.isRecognized(tag)) {
      (tag = this.assignTag(node));
    }
    else {
      this.validate(node);
    }
    ;
    if (YamlSchema.prototype.isRecognized.call(this, tag)) {
      return YamlSchema.prototype.decode.call(this, node);
    }
    ;
    let $_u38 = tag;
    if (sys.ObjUtil.equals($_u38, "tag:yaml.org,2002:str")) {
      return node.val();
    }
    else if (sys.ObjUtil.equals($_u38, "tag:yaml.org,2002:seq")) {
      return sys.ObjUtil.as(node.val(), sys.Type.find("yaml::YamlObj[]")).map((n) => {
        return this$.decode(n);
      }, sys.Obj.type$.toNullable());
    }
    else if (sys.ObjUtil.equals($_u38, "tag:yaml.org,2002:map")) {
      let res = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?"));
      res.ordered(true);
      let map = sys.ObjUtil.as(node.val(), sys.Type.find("[yaml::YamlObj:yaml::YamlObj]"));
      map.keys().each((k) => {
        let k2 = this$.decode(k);
        if (k2 == null) {
          throw sys.NullErr.make("Maps in Fantom cannot contain null keys.");
        }
        ;
        if (res.containsKey(sys.ObjUtil.coerce(k2, sys.Obj.type$))) {
          throw YamlTagErr.makeStr(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("The key \"", k2), "\", generated by the current schema from \""), k.val()), "\", is already present in this map."));
        }
        ;
        res.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this$.decode(k)), sys.Obj.type$.toNullable()), sys.Obj.type$), this$.decode(sys.ObjUtil.coerce(map.get(k), YamlObj.type$)));
        return;
      });
      return res;
    }
    else {
      throw sys.Err.make("Internal error - all tags should have been covered.");
    }
    ;
  }

  encode(obj) {
    const this$ = this;
    return this.recEncode(obj, (v) => {
      let str = ((this$) => { if (v == null) return "null"; return sys.ObjUtil.toStr(v); })(this$);
      return YamlScalar.make(str, ((this$) => { if (this$.worksAsPlain(str)) return "?"; return "!"; })(this$));
    });
  }

  assignTag(node) {
    let $_u41 = sys.ObjUtil.typeof(node);
    if (sys.ObjUtil.equals($_u41, YamlScalar.type$)) {
      return "tag:yaml.org,2002:str";
    }
    else if (sys.ObjUtil.equals($_u41, YamlList.type$)) {
      return "tag:yaml.org,2002:seq";
    }
    else if (sys.ObjUtil.equals($_u41, YamlMap.type$)) {
      return "tag:yaml.org,2002:map";
    }
    else {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("The YAML node type ", sys.ObjUtil.typeof(node)), " is not supported by the current schema."));
    }
    ;
  }

  validate(node) {
    if (YamlSchema.prototype.isRecognized.call(this, node.tag())) {
      YamlSchema.prototype.validate.call(this, node);
    }
    else {
      let $_u42 = node.tag();
      if (sys.ObjUtil.equals($_u42, "tag:yaml.org,2002:str")) {
        if (sys.ObjUtil.compareNE(sys.ObjUtil.typeof(node), YamlScalar.type$)) {
          throw YamlTagErr.makeType(node.tag(), YamlScalar.type$);
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u42, "tag:yaml.org,2002:seq")) {
        if (sys.ObjUtil.compareNE(sys.ObjUtil.typeof(node), YamlList.type$)) {
          throw YamlTagErr.makeType(node.tag(), YamlList.type$);
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u42, "tag:yaml.org,2002:map")) {
        if (sys.ObjUtil.compareNE(sys.ObjUtil.typeof(node), YamlMap.type$)) {
          throw YamlTagErr.makeType(node.tag(), YamlMap.type$);
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  isRecognized(tag) {
    const this$ = this;
    return (YamlSchema.prototype.isRecognized.call(this, tag) || sys.List.make(sys.Str.type$, ["str", "seq", "map"]).map((s) => {
      return sys.Str.plus("tag:yaml.org,2002:", s);
    }, sys.Obj.type$.toNullable()).contains(tag));
  }

  static make() {
    const $self = new FailsafeSchema();
    FailsafeSchema.make$($self);
    return $self;
  }

  static make$($self) {
    YamlSchema.make$($self);
    return;
  }

}

class JsonSchema extends FailsafeSchema {
  constructor() {
    super();
    const this$ = this;
    this.#matchNull = sys.ObjUtil.coerce(sys.Regex.fromStr("null"), sys.Regex.type$);
    this.#matchBool = sys.ObjUtil.coerce(sys.Regex.fromStr("true|false"), sys.Regex.type$);
    this.#matchInt = sys.ObjUtil.coerce(sys.Regex.fromStr("-?(0|[1-9][0-9]*)"), sys.Regex.type$);
    this.#matchFloat = sys.ObjUtil.coerce(sys.Regex.fromStr("-?(0|[1-9][0-9]*)(\\.[0-9]*)?([eE][-+]?[0-9]+)?"), sys.Regex.type$);
    return;
  }

  typeof() { return JsonSchema.type$; }

  #matchNull = null;

  // private field reflection only
  __matchNull(it) { if (it === undefined) return this.#matchNull; else this.#matchNull = it; }

  #matchBool = null;

  // private field reflection only
  __matchBool(it) { if (it === undefined) return this.#matchBool; else this.#matchBool = it; }

  #matchInt = null;

  // private field reflection only
  __matchInt(it) { if (it === undefined) return this.#matchInt; else this.#matchInt = it; }

  #matchFloat = null;

  // private field reflection only
  __matchFloat(it) { if (it === undefined) return this.#matchFloat; else this.#matchFloat = it; }

  decode(node) {
    let tag = node.tag();
    if (!this.isRecognized(tag)) {
      (tag = this.assignTag(node));
    }
    else {
      this.validate(node);
    }
    ;
    if (FailsafeSchema.prototype.isRecognized.call(this, tag)) {
      return FailsafeSchema.prototype.decode.call(this, node);
    }
    ;
    let $_u43 = tag;
    if (sys.ObjUtil.equals($_u43, "tag:yaml.org,2002:null")) {
      return null;
    }
    else if (sys.ObjUtil.equals($_u43, "tag:yaml.org,2002:bool")) {
      return sys.ObjUtil.coerce(sys.ObjUtil.equals(node.val(), "true"), sys.Obj.type$.toNullable());
    }
    else if (sys.ObjUtil.equals($_u43, "tag:yaml.org,2002:int")) {
      return sys.ObjUtil.coerce(sys.Int.fromStr(sys.ObjUtil.coerce(node.val(), sys.Str.type$)), sys.Obj.type$.toNullable());
    }
    else if (sys.ObjUtil.equals($_u43, "tag:yaml.org,2002:float")) {
      return sys.ObjUtil.coerce(sys.Float.fromStr(sys.ObjUtil.coerce(node.val(), sys.Str.type$)), sys.Obj.type$.toNullable());
    }
    else {
      throw sys.Err.make("Internal error - all tags should have been covered.");
    }
    ;
  }

  encode(obj) {
    const this$ = this;
    return this.recEncode(obj, (v) => {
      if ((v == null || sys.ObjUtil.is(v, sys.Bool.type$) || sys.ObjUtil.is(v, sys.Int.type$) || (sys.ObjUtil.is(v, sys.Float.type$) && !sys.ObjUtil.coerce(sys.ObjUtil.trap(v,"isNaN", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Bool.type$) && sys.ObjUtil.compareNE(v, sys.Float.posInf()) && sys.ObjUtil.compareNE(v, sys.Float.negInf())))) {
        return YamlScalar.make(((this$) => { if (v == null) return "null"; return sys.ObjUtil.toStr(v); })(this$));
      }
      else {
        return YamlScalar.make(sys.ObjUtil.toStr(v), "!");
      }
      ;
    });
  }

  assignTag(node) {
    if (sys.ObjUtil.compareNE(sys.ObjUtil.typeof(node), YamlScalar.type$)) {
      return FailsafeSchema.prototype.assignTag.call(this, node);
    }
    ;
    if (this.#matchNull.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
      return "tag:yaml.org,2002:null";
    }
    ;
    if (this.#matchBool.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
      return "tag:yaml.org,2002:bool";
    }
    ;
    if (this.#matchInt.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
      return "tag:yaml.org,2002:int";
    }
    ;
    if (this.#matchFloat.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
      return "tag:yaml.org,2002:float";
    }
    ;
    throw YamlTagErr.makeStr(sys.Str.plus(sys.Str.plus("The plain content \"", node.val()), "\" does not match any valid JSON type."));
  }

  validate(node) {
    if (FailsafeSchema.prototype.isRecognized.call(this, node.tag())) {
      FailsafeSchema.prototype.validate.call(this, node);
    }
    else {
      if (sys.ObjUtil.compareNE(sys.ObjUtil.typeof(node), YamlScalar.type$)) {
        throw YamlTagErr.makeType(node.tag(), YamlScalar.type$);
      }
      ;
      let $_u45 = node.tag();
      if (sys.ObjUtil.equals($_u45, "tag:yaml.org,2002:null")) {
        if (!this.#matchNull.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
          throw YamlTagErr.makeContent(node);
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u45, "tag:yaml.org,2002:bool")) {
        if (!this.#matchBool.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
          throw YamlTagErr.makeContent(node);
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u45, "tag:yaml.org,2002:int")) {
        if (!this.#matchInt.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
          throw YamlTagErr.makeContent(node);
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u45, "tag:yaml.org,2002:float")) {
        if (!this.#matchFloat.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
          throw YamlTagErr.makeContent(node);
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  isRecognized(tag) {
    const this$ = this;
    return (FailsafeSchema.prototype.isRecognized.call(this, tag) || sys.List.make(sys.Str.type$, ["null", "bool", "int", "float"]).map((s) => {
      return sys.Str.plus("tag:yaml.org,2002:", s);
    }, sys.Obj.type$.toNullable()).contains(tag));
  }

  static make() {
    const $self = new JsonSchema();
    JsonSchema.make$($self);
    return $self;
  }

  static make$($self) {
    FailsafeSchema.make$($self);
    ;
    return;
  }

}

class CoreSchema extends FailsafeSchema {
  constructor() {
    super();
    const this$ = this;
    this.#matchNull = sys.ObjUtil.coerce(sys.Regex.fromStr("null|Null|NULL|~|(^\$)"), sys.Regex.type$);
    this.#matchBool = sys.ObjUtil.coerce(sys.Regex.fromStr("true|True|TRUE|false|False|FALSE"), sys.Regex.type$);
    this.#matchInt = sys.ObjUtil.coerce(sys.Regex.fromStr("([-+]?[0-9]+)|(0o[0-7]+)|(0x[0-9a-fA-F]+)"), sys.Regex.type$);
    this.#matchFloat = sys.ObjUtil.coerce(sys.Regex.fromStr("([-+]?(\\.[0-9]+|[0-9]+(\\.[0-9]*)?)([eE][-+]?[0-9]+)?)|([-+]?(\\.inf|\\.Inf|\\.INF))|(\\.nan|\\.NaN|\\.NAN)"), sys.Regex.type$);
    return;
  }

  typeof() { return CoreSchema.type$; }

  #matchNull = null;

  // private field reflection only
  __matchNull(it) { if (it === undefined) return this.#matchNull; else this.#matchNull = it; }

  #matchBool = null;

  // private field reflection only
  __matchBool(it) { if (it === undefined) return this.#matchBool; else this.#matchBool = it; }

  #matchInt = null;

  // private field reflection only
  __matchInt(it) { if (it === undefined) return this.#matchInt; else this.#matchInt = it; }

  #matchFloat = null;

  // private field reflection only
  __matchFloat(it) { if (it === undefined) return this.#matchFloat; else this.#matchFloat = it; }

  decode(node) {
    let tag = node.tag();
    if (!this.isRecognized(tag)) {
      (tag = this.assignTag(node));
    }
    else {
      this.validate(node);
    }
    ;
    if (FailsafeSchema.prototype.isRecognized.call(this, tag)) {
      return FailsafeSchema.prototype.decode.call(this, node);
    }
    ;
    let cont = sys.ObjUtil.as(node.val(), sys.Str.type$);
    let $_u46 = tag;
    if (sys.ObjUtil.equals($_u46, "tag:yaml.org,2002:null")) {
      return null;
    }
    else if (sys.ObjUtil.equals($_u46, "tag:yaml.org,2002:bool")) {
      return sys.ObjUtil.coerce(sys.ObjUtil.equals(sys.Str.lower(cont), "true"), sys.Obj.type$.toNullable());
    }
    else if (sys.ObjUtil.equals($_u46, "tag:yaml.org,2002:int")) {
      if ((sys.ObjUtil.compareGT(sys.Str.size(cont), 2) && sys.ObjUtil.equals(sys.Str.getRange(cont, sys.Range.make(0, 1)), "0o"))) {
        return sys.ObjUtil.coerce(sys.Int.fromStr(sys.Str.getRange(cont, sys.Range.make(2, -1)), 8), sys.Obj.type$.toNullable());
      }
      ;
      if ((sys.ObjUtil.compareGT(sys.Str.size(cont), 2) && sys.ObjUtil.equals(sys.Str.getRange(cont, sys.Range.make(0, 1)), "0x"))) {
        return sys.ObjUtil.coerce(sys.Int.fromStr(sys.Str.getRange(cont, sys.Range.make(2, -1)), 16), sys.Obj.type$.toNullable());
      }
      ;
      return sys.ObjUtil.coerce(sys.Int.fromStr(sys.ObjUtil.coerce(cont, sys.Str.type$)), sys.Obj.type$.toNullable());
    }
    else if (sys.ObjUtil.equals($_u46, "tag:yaml.org,2002:float")) {
      if ((sys.ObjUtil.compareGT(sys.Str.size(cont), 3) && sys.ObjUtil.equals(sys.Str.lower(sys.Str.getRange(cont, sys.Range.make(-3, -1))), "inf"))) {
        return sys.ObjUtil.coerce(((this$) => { if (sys.ObjUtil.equals(sys.Str.get(cont, 0), 45)) return sys.Float.negInf(); return sys.Float.posInf(); })(this), sys.Obj.type$.toNullable());
      }
      ;
      if ((sys.ObjUtil.compareGT(sys.Str.size(cont), 3) && sys.ObjUtil.equals(sys.Str.lower(sys.Str.getRange(cont, sys.Range.make(-3, -1))), "nan"))) {
        return sys.ObjUtil.coerce(sys.Float.nan(), sys.Obj.type$.toNullable());
      }
      ;
      return sys.ObjUtil.coerce(sys.Float.fromStr(sys.ObjUtil.coerce(cont, sys.Str.type$)), sys.Obj.type$.toNullable());
    }
    else {
      throw sys.Err.make("Internal error - all tags should have been covered.");
    }
    ;
  }

  encode(obj) {
    const this$ = this;
    return this.recEncode(obj, (v) => {
      if (sys.ObjUtil.equals(v, sys.Float.posInf())) {
        return YamlScalar.make(".Inf");
      }
      else {
        if (sys.ObjUtil.equals(v, sys.Float.negInf())) {
          return YamlScalar.make("-.Inf");
        }
        else {
          if ((sys.ObjUtil.is(v, sys.Float.type$) && sys.ObjUtil.coerce(sys.ObjUtil.trap(v,"isNaN", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Bool.type$))) {
            return YamlScalar.make(".NaN");
          }
          else {
            if ((v == null || sys.ObjUtil.is(v, sys.Bool.type$) || sys.ObjUtil.is(v, sys.Int.type$) || sys.ObjUtil.is(v, sys.Float.type$))) {
              return YamlScalar.make(((this$) => { if (v == null) return "null"; return sys.ObjUtil.toStr(v); })(this$));
            }
            else {
              return YamlScalar.make(sys.ObjUtil.toStr(v), ((this$) => { if (this$.worksAsPlain(sys.ObjUtil.toStr(v))) return "?"; return "!"; })(this$));
            }
            ;
          }
          ;
        }
        ;
      }
      ;
    });
  }

  assignTag(node) {
    if (sys.ObjUtil.compareNE(sys.ObjUtil.typeof(node), YamlScalar.type$)) {
      return FailsafeSchema.prototype.assignTag.call(this, node);
    }
    ;
    if (this.#matchNull.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
      return "tag:yaml.org,2002:null";
    }
    ;
    if (this.#matchBool.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
      return "tag:yaml.org,2002:bool";
    }
    ;
    if (this.#matchInt.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
      return "tag:yaml.org,2002:int";
    }
    ;
    if (this.#matchFloat.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
      return "tag:yaml.org,2002:float";
    }
    ;
    return "tag:yaml.org,2002:str";
  }

  validate(node) {
    if (FailsafeSchema.prototype.isRecognized.call(this, node.tag())) {
      FailsafeSchema.prototype.validate.call(this, node);
    }
    else {
      if (sys.ObjUtil.compareNE(sys.ObjUtil.typeof(node), YamlScalar.type$)) {
        throw YamlTagErr.makeType(node.tag(), YamlScalar.type$);
      }
      ;
      let $_u50 = node.tag();
      if (sys.ObjUtil.equals($_u50, "tag:yaml.org,2002:null")) {
        if (!this.#matchNull.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
          throw YamlTagErr.makeContent(node);
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u50, "tag:yaml.org,2002:bool")) {
        if (!this.#matchBool.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
          throw YamlTagErr.makeContent(node);
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u50, "tag:yaml.org,2002:int")) {
        if (!this.#matchInt.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
          throw YamlTagErr.makeContent(node);
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u50, "tag:yaml.org,2002:float")) {
        if (!this.#matchFloat.matches(sys.ObjUtil.coerce(node.val(), sys.Str.type$))) {
          throw YamlTagErr.makeContent(node);
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  isRecognized(tag) {
    const this$ = this;
    return (FailsafeSchema.prototype.isRecognized.call(this, tag) || sys.List.make(sys.Str.type$, ["null", "bool", "int", "float"]).map((s) => {
      return sys.Str.plus("tag:yaml.org,2002:", s);
    }, sys.Obj.type$.toNullable()).contains(tag));
  }

  static make() {
    const $self = new CoreSchema();
    CoreSchema.make$($self);
    return $self;
  }

  static make$($self) {
    FailsafeSchema.make$($self);
    ;
    return;
  }

}

class YamlTokenizer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#peekArr = sys.List.make(sys.Int.type$);
    return;
  }

  typeof() { return YamlTokenizer.type$; }

  #in = null;

  // private field reflection only
  __in(it) { if (it === undefined) return this.#in; else this.#in = it; }

  #peekArr = null;

  // private field reflection only
  __peekArr(it) { if (it === undefined) return this.#peekArr; else this.#peekArr = it; }

  #loc = null;

  loc(it) {
    if (it === undefined) {
      return this.#loc;
    }
    else {
      this.#loc = it;
      return;
    }
  }

  #docPrefix$Store = undefined;

  // private field reflection only
  __docPrefix$Store(it) { if (it === undefined) return this.#docPrefix$Store; else this.#docPrefix$Store = it; }

  #tagHandle$Store = undefined;

  // private field reflection only
  __tagHandle$Store(it) { if (it === undefined) return this.#tagHandle$Store; else this.#tagHandle$Store = it; }

  #tagSuffix$Store = undefined;

  // private field reflection only
  __tagSuffix$Store(it) { if (it === undefined) return this.#tagSuffix$Store; else this.#tagSuffix$Store = it; }

  #uri$Store = undefined;

  // private field reflection only
  __uri$Store(it) { if (it === undefined) return this.#uri$Store; else this.#uri$Store = it; }

  #blockStyle$Store = undefined;

  // private field reflection only
  __blockStyle$Store(it) { if (it === undefined) return this.#blockStyle$Store; else this.#blockStyle$Store = it; }

  #str$Store = undefined;

  // private field reflection only
  __str$Store(it) { if (it === undefined) return this.#str$Store; else this.#str$Store = it; }

  #hex$Store = undefined;

  // private field reflection only
  __hex$Store(it) { if (it === undefined) return this.#hex$Store; else this.#hex$Store = it; }

  #ws$Store = undefined;

  // private field reflection only
  __ws$Store(it) { if (it === undefined) return this.#ws$Store; else this.#ws$Store = it; }

  #printable$Store = undefined;

  // private field reflection only
  __printable$Store(it) { if (it === undefined) return this.#printable$Store; else this.#printable$Store = it; }

  #any$Store = undefined;

  // private field reflection only
  __any$Store(it) { if (it === undefined) return this.#any$Store; else this.#any$Store = it; }

  static make(in$,loc) {
    const $self = new YamlTokenizer();
    YamlTokenizer.make$($self,in$,loc);
    return $self;
  }

  static make$($self,in$,loc) {
    if (loc === undefined) loc = util.FileLoc.unknown();
    ;
    $self.#in = in$;
    $self.#loc = util.FileLoc.make(loc.file(), 1, 1);
    $self.deduceEncoding();
    return;
  }

  peek(readRule) {
    if (readRule === undefined) readRule = this.printable();
    let initLoc = this.#loc;
    let c = sys.Func.call(readRule);
    if (c != null) {
      this.unread(sys.ObjUtil.coerce(c, sys.Int.type$));
      this.#loc = initLoc;
    }
    ;
    return c;
  }

  eatChar(expected) {
    let c = this.read();
    if (sys.ObjUtil.compareNE(c, expected)) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("'", sys.Int.toChar(expected)), "' expected, but '"), ((this$) => { let $_u51 = c; if ($_u51 == null) return null; return sys.Int.toChar(c); })(this)), "' found instead."));
    }
    ;
    return;
  }

  eatStr(expected) {
    let s = sys.StrBuf.make(sys.Str.size(expected));
    let c = null;
    for (let i = 0; (sys.ObjUtil.compareLT(i, sys.Str.size(expected)) && (c = this.read()) != null); ((this$) => { let $_u52 = i;i = sys.Int.increment(i); return $_u52; })(this)) {
      s.addChar(sys.ObjUtil.coerce(c, sys.Int.type$));
    }
    ;
    if (sys.ObjUtil.compareNE(s.toStr(), expected)) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("\"", expected), "\" expected, but \""), s.toStr()), "\" found instead."));
    }
    ;
    return;
  }

  eatToken(expected,readRule) {
    if (expected === undefined) expected = null;
    if (readRule === undefined) readRule = this.printable();
    const this$ = this;
    let s = this.eatUntilr(readRule, (c) => {
      return !this$.isNs(sys.ObjUtil.coerce(c, sys.Int.type$.toNullable()));
    });
    if ((expected != null && sys.ObjUtil.compareNE(s, expected))) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("\"", expected), "\" expected, but \""), s), "\" found instead."));
    }
    ;
    return s;
  }

  peekToken(readRule) {
    if (readRule === undefined) readRule = this.printable();
    const this$ = this;
    return this.peekUntilr(readRule, (c) => {
      return !this$.isNs(sys.ObjUtil.coerce(c, sys.Int.type$.toNullable()));
    });
  }

  eatUntilr(readRule,endRule) {
    let s = sys.StrBuf.make();
    let c = null;
    let lastLoc = this.#loc;
    while (true) {
      if ((this.peek(this.any()) == null || sys.Func.call(endRule, sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.peek(this.any()), sys.Int.type$), sys.Obj.type$.toNullable())))) {
        break;
      }
      else {
        if ((c = sys.Func.call(readRule)) == null) {
          break;
        }
        else {
          if (sys.Func.call(endRule, sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()))) {
            this.unread(sys.ObjUtil.coerce(c, sys.Int.type$));
            this.#loc = lastLoc;
            break;
          }
          ;
        }
        ;
      }
      ;
      s.addChar(sys.ObjUtil.coerce(c, sys.Int.type$));
      (lastLoc = this.#loc);
    }
    ;
    return s.toStr();
  }

  eatUntil(endRule) {
    return this.eatUntilr(this.printable(), endRule);
  }

  peekUntilr(readRule,endRule) {
    let s = sys.StrBuf.make();
    let buf = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("sys::Int[]"));
    let c = null;
    let initLoc = this.#loc;
    while (true) {
      if ((this.peek(this.any()) == null || sys.Func.call(endRule, sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.peek(this.any()), sys.Int.type$), sys.Obj.type$.toNullable())))) {
        break;
      }
      else {
        if ((c = sys.Func.call(readRule)) == null) {
          break;
        }
        ;
      }
      ;
      buf.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()));
      if (sys.Func.call(endRule, sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()))) {
        break;
      }
      ;
      s.addChar(sys.ObjUtil.coerce(c, sys.Int.type$));
    }
    ;
    this.unreadAll(buf);
    this.#loc = initLoc;
    return s.toStr();
  }

  peekUntil(endRule) {
    return this.peekUntilr(this.printable(), endRule);
  }

  eatLine(readRule) {
    if (readRule === undefined) readRule = this.printable();
    const this$ = this;
    let s = this.eatUntilr(readRule, (c) => {
      return this$.isNl(sys.ObjUtil.coerce(c, sys.Int.type$.toNullable()));
    });
    if (sys.ObjUtil.equals(this.peek(), 10)) {
      this.read();
    }
    ;
    return s;
  }

  eatWs() {
    while (this.isWs(this.peek(this.any()))) {
      this.read();
    }
    ;
    return;
  }

  peekNextNs(readRule) {
    if (readRule === undefined) readRule = this.printable();
    const this$ = this;
    return this.peekPastr(readRule, (c) => {
      return this$.isWs(sys.ObjUtil.coerce(c, sys.Int.type$.toNullable()));
    });
  }

  peekPastr(readRule,contRule) {
    let buf = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("sys::Int[]"));
    let c = null;
    let initLoc = this.#loc;
    while (((c = sys.Func.call(readRule)) != null && sys.Func.call(contRule, sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable())))) {
      buf.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()));
    }
    ;
    if (c != null) {
      buf.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()));
    }
    ;
    this.unreadAll(buf);
    this.#loc = initLoc;
    return c;
  }

  peekPast(contRule) {
    return this.peekPastr(this.printable(), contRule);
  }

  eatCommentLine(loc) {
    if (loc === undefined) loc = "This";
    this.eatWs();
    if (!sys.List.make(sys.Int.type$.toNullable(), [sys.ObjUtil.coerce(sys.ObjUtil.coerce(35, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), null]).contains(sys.ObjUtil.coerce(this.peek(), sys.Obj.type$.toNullable()))) {
      throw this.err(sys.Str.plus(sys.Str.plus("", loc), " cannot be followed on the same line by content."));
    }
    ;
    this.eatLine();
    return;
  }

  eatInd(n) {
    for (let i = 0; sys.ObjUtil.compareLT(i, n); ((this$) => { let $_u53 = i;i = sys.Int.increment(i); return $_u53; })(this)) {
      if (sys.ObjUtil.compareNE(this.read(), 32)) {
        throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("This line is indented by ", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), " spaces when "), sys.ObjUtil.coerce(n, sys.Obj.type$.toNullable())), " spaces were expected."));
      }
      ;
    }
    ;
    return;
  }

  nextKeyStr(n) {
    let buf = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("sys::Int[]"));
    let c = null;
    let initLoc = this.#loc;
    let inComment = false;
    let spacesToGo = ((this$) => { if (sys.ObjUtil.equals(this$.#loc.col(), 1)) return n; return 0; })(this);
    while (((c = this.peek(this.docPrefix())) != null && (sys.ObjUtil.equals(c, 35) || inComment || this.isWs(c) || this.isNl(c)))) {
      (c = this.read());
      buf.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()));
      if ((!inComment && sys.ObjUtil.equals(c, 35))) {
        (inComment = true);
        (spacesToGo = 0);
      }
      else {
        if (this.isNl(c)) {
          (inComment = false);
          (spacesToGo = n);
        }
        else {
          if (sys.ObjUtil.compareGT(spacesToGo, 0)) {
            if (sys.ObjUtil.equals(c, 32)) {
              ((this$) => { let $_u55 = spacesToGo;spacesToGo = sys.Int.decrement(spacesToGo); return $_u55; })(this);
            }
            else {
              if (sys.List.make(sys.Int.type$.toNullable(), [sys.ObjUtil.coerce(sys.ObjUtil.coerce(35, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), null]).contains(sys.ObjUtil.coerce(this.peekNextNs(), sys.Obj.type$.toNullable()))) {
                (spacesToGo = 0);
              }
              else {
                (c = null);
                break;
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
    let res = sys.List.make(sys.Obj.type$.toNullable());
    if ((c != null && sys.ObjUtil.compareLE(spacesToGo, 0))) {
      this.setPeek(1026);
      (res = this.#peekArr.getRange(sys.Range.make(0, sys.Int.min(1026, this.#peekArr.size()), true)));
    }
    ;
    this.unreadAll(buf);
    this.#loc = initLoc;
    return sys.Str.fromChars(sys.ObjUtil.coerce(res, sys.Type.find("sys::Int[]")));
  }

  nextKeyIsJson() {
    let buf = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("sys::Int[]"));
    let c = null;
    let initLoc = this.#loc;
    let res = false;
    while (sys.ObjUtil.equals(res, false)) {
      (c = this.read());
      if (c == null) {
        break;
      }
      ;
      buf.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()));
      if (this.isWs(c)) {
        continue;
      }
      else {
        if ((this.isFlowEnd(c) || (sys.ObjUtil.equals(c, 58) && (!this.isNs(this.peek()) || this.isFlowEnd(this.peek()))))) {
          break;
        }
        else {
          if (sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(123, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(91, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(39, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(34, sys.Obj.type$.toNullable())]).contains(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()))) {
            (res = true);
          }
          else {
            if (sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(38, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(33, sys.Obj.type$.toNullable())]).contains(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()))) {
              while ((this.isNs((c = this.peek())) && !sys.List.make(sys.Int.type$.toNullable(), [sys.ObjUtil.coerce(sys.ObjUtil.coerce(93, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(125, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), null]).contains(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable())))) {
                (c = this.read());
                if (c == null) {
                  break;
                }
                ;
                buf.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()));
              }
              ;
            }
            else {
              break;
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
    this.unreadAll(buf);
    this.#loc = initLoc;
    return res;
  }

  peekIndentedNs(n,readRule) {
    if (readRule === undefined) readRule = this.printable();
    let buf = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("sys::Int[]"));
    let c = null;
    let initLoc = this.#loc;
    let inComment = false;
    let spacesToGo = ((this$) => { if (sys.ObjUtil.equals(this$.#loc.col(), 1)) return n; return 0; })(this);
    while (((c = sys.Func.call(readRule)) != null && (sys.ObjUtil.equals(c, 35) || inComment || this.isWs(c) || this.isNl(c)))) {
      buf.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()));
      if ((!inComment && sys.ObjUtil.equals(c, 35))) {
        (inComment = true);
        (spacesToGo = 0);
      }
      else {
        if (this.isNl(c)) {
          (inComment = false);
          (spacesToGo = n);
        }
        else {
          if (sys.ObjUtil.compareGT(spacesToGo, 0)) {
            if (sys.ObjUtil.equals(c, 32)) {
              ((this$) => { let $_u57 = spacesToGo;spacesToGo = sys.Int.decrement(spacesToGo); return $_u57; })(this);
            }
            else {
              if (sys.List.make(sys.Int.type$.toNullable(), [sys.ObjUtil.coerce(sys.ObjUtil.coerce(35, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), null]).contains(sys.ObjUtil.coerce(this.peekNextNs(), sys.Obj.type$.toNullable()))) {
                (spacesToGo = 0);
              }
              else {
                (c = null);
                break;
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
    if (c != null) {
      buf.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()));
    }
    ;
    this.unreadAll(buf);
    this.#loc = initLoc;
    return ((this$) => { if (sys.ObjUtil.compareLE(spacesToGo, 0)) return c; return null; })(this);
  }

  peekIndentedToken(n,readRule) {
    if (readRule === undefined) readRule = this.printable();
    const this$ = this;
    return this.peekIndentedUntilr(n, readRule, (c1) => {
      return !this$.isNs(sys.ObjUtil.coerce(c1, sys.Int.type$.toNullable()));
    });
  }

  peekIndentedUntilr(n,readRule,endRule) {
    let buf = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("sys::Int[]"));
    let c = null;
    let s = sys.StrBuf.make();
    let initLoc = this.#loc;
    let inComment = false;
    let spacesToGo = ((this$) => { if (sys.ObjUtil.equals(this$.#loc.col(), 1)) return n; return 0; })(this);
    while (((c = sys.Func.call(readRule)) != null && (sys.ObjUtil.equals(c, 35) || inComment || this.isWs(c) || this.isNl(c)))) {
      buf.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()));
      if ((!inComment && sys.ObjUtil.equals(c, 35))) {
        (inComment = true);
        (spacesToGo = 0);
      }
      else {
        if (this.isNl(c)) {
          (inComment = false);
          (spacesToGo = n);
        }
        else {
          if (sys.ObjUtil.compareGT(spacesToGo, 0)) {
            if (sys.ObjUtil.equals(c, 32)) {
              ((this$) => { let $_u60 = spacesToGo;spacesToGo = sys.Int.decrement(spacesToGo); return $_u60; })(this);
            }
            else {
              if (sys.List.make(sys.Int.type$.toNullable(), [sys.ObjUtil.coerce(sys.ObjUtil.coerce(35, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), null]).contains(sys.ObjUtil.coerce(this.peekNextNs(), sys.Obj.type$.toNullable()))) {
                (spacesToGo = 0);
              }
              else {
                (c = null);
                break;
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
    if ((c != null && sys.ObjUtil.compareGT(spacesToGo, 0))) {
      buf.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()));
    }
    ;
    while ((c != null && sys.ObjUtil.compareLE(spacesToGo, 0))) {
      buf.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()));
      s.addChar(sys.ObjUtil.coerce(c, sys.Int.type$));
      (c = sys.Func.call(readRule));
      if ((c != null && sys.Func.call(endRule, sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable())))) {
        buf.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()));
        break;
      }
      ;
    }
    ;
    this.unreadAll(buf);
    this.#loc = initLoc;
    return ((this$) => { if (sys.ObjUtil.compareGT(s.size(), 0)) return s.toStr(); return null; })(this);
  }

  peekIndentedUntil(n,endRule) {
    return this.peekIndentedUntilr(n, this.printable(), endRule);
  }

  nextTokenEndsDoc() {
    let buf = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("sys::Int[]"));
    let c = null;
    let initLoc = this.#loc;
    let inComment = false;
    while (((c = sys.Func.call(this.docPrefix())) != null && (sys.ObjUtil.equals(c, 35) || inComment || this.isWs(c) || this.isNl(c)))) {
      buf.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()));
      if ((!inComment && sys.ObjUtil.equals(c, 35))) {
        (inComment = true);
      }
      else {
        if (this.isNl(c)) {
          (inComment = false);
        }
        ;
      }
      ;
    }
    ;
    let res = false;
    if (c != null) {
      buf.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()));
      this.setPeek(3);
      if ((sys.ObjUtil.compareGE(this.#peekArr.size(), 2) && sys.ObjUtil.equals(sys.Int.minus(this.#loc.col(), 1), 1))) {
        let tok3 = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.Int.toChar(sys.ObjUtil.coerce(c, sys.Int.type$))), ""), sys.Int.toChar(this.#peekArr.get(0))), ""), sys.Int.toChar(this.#peekArr.get(1)));
        (res = (sys.List.make(sys.Str.type$, ["---", "..."]).contains(tok3) && !this.isNs(this.#peekArr.getSafe(2))));
      }
      ;
    }
    ;
    this.unreadAll(buf);
    this.#loc = initLoc;
    return res;
  }

  docPrefix() {
    if (this.#docPrefix$Store === undefined) {
      this.#docPrefix$Store = this.docPrefix$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#docPrefix$Store, sys.Type.find("|->sys::Int?|"));
  }

  tagHandle() {
    if (this.#tagHandle$Store === undefined) {
      this.#tagHandle$Store = this.tagHandle$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#tagHandle$Store, sys.Type.find("|->sys::Int?|"));
  }

  tagSuffix() {
    if (this.#tagSuffix$Store === undefined) {
      this.#tagSuffix$Store = this.tagSuffix$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#tagSuffix$Store, sys.Type.find("|->sys::Int?|"));
  }

  uri() {
    if (this.#uri$Store === undefined) {
      this.#uri$Store = this.uri$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#uri$Store, sys.Type.find("|->sys::Int?|"));
  }

  firstChar(ctx) {
    const this$ = this;
    return () => {
      let c = this$.read();
      if ((c == null || !YamlTokenizer.isPrintable(c))) {
        throw this$.charsetErr(c);
      }
      ;
      if (sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(63, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(58, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(45, sys.Obj.type$.toNullable())]).contains(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()))) {
        this$.setPeek(1);
        if (!this$.isNs(this$.#peekArr.getSafe(0))) {
          throw this$.err(sys.Str.plus(sys.Str.plus("A plain scalar cannot begin with \"", sys.Int.toChar(sys.ObjUtil.coerce(c, sys.Int.type$))), " \"."));
        }
        else {
          if (((sys.ObjUtil.equals(ctx, Context.flowIn()) || sys.ObjUtil.equals(ctx, Context.flowKey())) && this$.isFlow(this$.#peekArr.getSafe(0)))) {
            throw this$.err("A plain scalar cannot consist of '-' alone.");
          }
          ;
        }
        ;
      }
      else {
        if (YamlTokenizer.isIndicator(c)) {
          throw this$.charsetErr(c, "to be the first character of a plain scalar");
        }
        ;
      }
      ;
      return c;
    };
  }

  blockStyle() {
    if (this.#blockStyle$Store === undefined) {
      this.#blockStyle$Store = this.blockStyle$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#blockStyle$Store, sys.Type.find("|->sys::Int?|"));
  }

  str() {
    if (this.#str$Store === undefined) {
      this.#str$Store = this.str$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#str$Store, sys.Type.find("|->sys::Int?|"));
  }

  hex() {
    if (this.#hex$Store === undefined) {
      this.#hex$Store = this.hex$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#hex$Store, sys.Type.find("|->sys::Int?|"));
  }

  ws() {
    if (this.#ws$Store === undefined) {
      this.#ws$Store = this.ws$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#ws$Store, sys.Type.find("|->sys::Int?|"));
  }

  printable() {
    if (this.#printable$Store === undefined) {
      this.#printable$Store = this.printable$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#printable$Store, sys.Type.find("|->sys::Int?|"));
  }

  any() {
    if (this.#any$Store === undefined) {
      this.#any$Store = this.any$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#any$Store, sys.Type.find("|->sys::Int?|"));
  }

  incCol() {
    this.#loc = util.FileLoc.make(this.#loc.file(), this.#loc.line(), sys.Int.plus(this.#loc.col(), 1));
    return;
  }

  decCol() {
    this.#loc = util.FileLoc.make(this.#loc.file(), this.#loc.line(), sys.Int.minus(this.#loc.col(), 1));
    return;
  }

  incLine() {
    this.#loc = util.FileLoc.make(this.#loc.file(), sys.Int.plus(this.#loc.line(), 1), 1);
    return;
  }

  deduceEncoding() {
    const this$ = this;
    let beg = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("sys::Int?[]"));
    try {
      (beg = sys.List.make(sys.Int.type$.toNullable(), [sys.ObjUtil.coerce(this.#in.read(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.#in.read(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.#in.read(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.#in.read(), sys.Obj.type$.toNullable())]));
    }
    catch ($_u62) {
      $_u62 = sys.Err.make($_u62);
      if ($_u62 instanceof sys.UnsupportedErr) {
        let e = $_u62;
        ;
        return;
      }
      else {
        throw $_u62;
      }
    }
    ;
    beg.reverse().each((b) => {
      if (b != null) {
        this$.#in.unread(sys.ObjUtil.coerce(b, sys.Int.type$));
      }
      ;
      return;
    });
    if (((sys.ObjUtil.equals(beg.get(0), 0) && sys.ObjUtil.equals(beg.get(1), 0) && sys.ObjUtil.equals(beg.get(2), 254) && sys.ObjUtil.equals(beg.get(3), 255)) || (sys.ObjUtil.equals(beg.get(0), 0) && sys.ObjUtil.equals(beg.get(1), 0) && sys.ObjUtil.equals(beg.get(2), 0)) || (sys.ObjUtil.equals(beg.get(0), 255) && sys.ObjUtil.equals(beg.get(1), 254) && sys.ObjUtil.equals(beg.get(2), 0) && sys.ObjUtil.equals(beg.get(3), 0)) || (sys.ObjUtil.equals(beg.get(1), 0) && sys.ObjUtil.equals(beg.get(2), 0) && sys.ObjUtil.equals(beg.get(3), 0)))) {
      throw this.err("This YAML parser does not support the UTF-32 encoding.");
    }
    else {
      if (((sys.ObjUtil.equals(beg.get(0), 254) && sys.ObjUtil.equals(beg.get(1), 255)) || sys.ObjUtil.equals(beg.get(0), 0))) {
        this.#in.charset(sys.Charset.utf16BE());
        this.#in.endian(sys.Endian.big());
      }
      else {
        if (((sys.ObjUtil.equals(beg.get(0), 255) && sys.ObjUtil.equals(beg.get(1), 254)) || sys.ObjUtil.equals(beg.get(1), 0))) {
          this.#in.charset(sys.Charset.utf16LE());
          this.#in.endian(sys.Endian.little());
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  read() {
    let c = null;
    if (sys.ObjUtil.compareNE(this.#peekArr.size(), 0)) {
      (c = sys.ObjUtil.coerce(this.#peekArr.removeAt(0), sys.Int.type$.toNullable()));
    }
    else {
      (c = this.#in.readChar());
    }
    ;
    if (c != null) {
      this.incCol();
    }
    ;
    if (sys.ObjUtil.equals(c, 13)) {
      this.setPeek(1);
      if (sys.ObjUtil.equals(this.#peekArr.get(0), 10)) {
        return this.read();
      }
      else {
        (c = sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()));
      }
      ;
    }
    ;
    if (sys.ObjUtil.equals(c, 10)) {
      this.incLine();
    }
    ;
    return c;
  }

  setPeek(n) {
    let c = null;
    while ((sys.ObjUtil.compareLT(this.#peekArr.size(), n) && (c = this.#in.readChar()) != null)) {
      this.#peekArr.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()));
    }
    ;
    return;
  }

  unread(c) {
    this.#peekArr.insert(0, sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()));
    return;
  }

  unreadAll(cs) {
    this.#peekArr.insertAll(0, cs);
    return;
  }

  isWs(c) {
    return (sys.ObjUtil.equals(c, 32) || sys.ObjUtil.equals(c, 9));
  }

  isNl(c) {
    return (sys.ObjUtil.equals(c, 10) || sys.ObjUtil.equals(c, 13));
  }

  isNs(c) {
    return (c != null && !this.isWs(c) && !this.isNl(c));
  }

  isFlow(c) {
    return sys.ObjUtil.as(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(91, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(93, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(123, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(125, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(44, sys.Obj.type$.toNullable())]), sys.Type.find("sys::Int?[]")).contains(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()));
  }

  isFlowEnd(c) {
    return sys.ObjUtil.as(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(93, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(125, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(44, sys.Obj.type$.toNullable())]), sys.Type.find("sys::Int?[]")).contains(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()));
  }

  static isWordChar(c) {
    if (c == null) {
      return false;
    }
    ;
    return ((sys.ObjUtil.compareLE(48, c) && sys.ObjUtil.compareLE(c, 57)) || (sys.ObjUtil.compareLE(65, c) && sys.ObjUtil.compareLE(c, 90)) || (sys.ObjUtil.compareLE(97, c) && sys.ObjUtil.compareLE(c, 122)) || sys.ObjUtil.equals(c, 45));
  }

  static isHexChar(c) {
    if (c == null) {
      return false;
    }
    ;
    return ((sys.ObjUtil.compareLE(48, c) && sys.ObjUtil.compareLE(c, 57)) || (sys.ObjUtil.compareLE(65, c) && sys.ObjUtil.compareLE(c, 70)) || (sys.ObjUtil.compareLE(97, c) && sys.ObjUtil.compareLE(c, 102)));
  }

  static isUriChar(c) {
    return (YamlTokenizer.isWordChar(c) || sys.ObjUtil.as(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(37, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(35, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(59, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(47, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(63, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(58, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(64, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(38, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(61, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(43, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(36, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(44, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(95, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(46, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(33, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(126, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(42, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(39, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(40, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(41, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(91, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(93, sys.Obj.type$.toNullable())]), sys.Type.find("sys::Int?[]")).contains(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable())));
  }

  static isPrintable(c) {
    if (sys.List.make(sys.Int.type$.toNullable(), [sys.ObjUtil.coerce(sys.ObjUtil.coerce(9, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(13, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(133, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()), null]).contains(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()))) {
      return true;
    }
    ;
    if (sys.ObjUtil.compareLE(c, 31)) {
      return false;
    }
    ;
    if (sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(127, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65534, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable())]).contains(sys.ObjUtil.coerce(sys.ObjUtil.coerce(c, sys.Int.type$), sys.Obj.type$.toNullable()))) {
      return false;
    }
    ;
    if (((sys.ObjUtil.compareLE(128, c) && sys.ObjUtil.compareLE(c, 159)) || (sys.ObjUtil.compareLE(55296, c) && sys.ObjUtil.compareLE(c, 57343)))) {
      return false;
    }
    ;
    return true;
  }

  static isIndicator(c) {
    return sys.ObjUtil.as(sys.List.make(sys.Obj.type$, [sys.ObjUtil.coerce(45, sys.Obj.type$), sys.ObjUtil.coerce(63, sys.Obj.type$), sys.ObjUtil.coerce(58, sys.Obj.type$), sys.ObjUtil.coerce(44, sys.Obj.type$), sys.ObjUtil.coerce(91, sys.Obj.type$), sys.ObjUtil.coerce(93, sys.Obj.type$), sys.ObjUtil.coerce(123, sys.Obj.type$), sys.ObjUtil.coerce(125, sys.Obj.type$), sys.ObjUtil.coerce(35, sys.Obj.type$), sys.ObjUtil.coerce(38, sys.Obj.type$), sys.ObjUtil.coerce(42, sys.Obj.type$), sys.ObjUtil.coerce(33, sys.Obj.type$), sys.ObjUtil.coerce(124, sys.Obj.type$), sys.ObjUtil.coerce(62, sys.Obj.type$), "'", sys.ObjUtil.coerce(34, sys.Obj.type$), sys.ObjUtil.coerce(37, sys.Obj.type$), sys.ObjUtil.coerce(64, sys.Obj.type$), sys.ObjUtil.coerce(96, sys.Obj.type$)]), sys.Type.find("sys::Int?[]")).contains(sys.ObjUtil.coerce(c, sys.Obj.type$.toNullable()));
  }

  err(msg,loc) {
    if (loc === undefined) loc = null;
    if (loc == null) {
      (loc = this.#loc);
    }
    ;
    return util.FileLocErr.make(msg, sys.ObjUtil.coerce(loc, util.FileLoc.type$));
  }

  charsetErr(c,errLoc) {
    if (errLoc === undefined) errLoc = "here";
    if (c == null) {
      return this.err("End of file reached too soon.");
    }
    else {
      if (YamlTokenizer.isPrintable(c)) {
        return this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Character '", sys.Int.toChar(sys.ObjUtil.coerce(c, sys.Int.type$))), "' is not allowed "), errLoc), "."));
      }
      else {
        return this.err(sys.Str.plus(sys.Str.plus("Character 0x", sys.Int.toHex(sys.ObjUtil.coerce(c, sys.Int.type$))), " is not a printable character."));
      }
      ;
    }
    ;
  }

  debug() {
    const this$ = this;
    this.setPeek(10);
    sys.ObjUtil.echo(this.#peekArr.map((c) => {
      return sys.Int.toChar(c);
    }, sys.Obj.type$.toNullable()).toStr());
    return;
  }

  docPrefix$Once() {
    const this$ = this;
    return () => {
      let c = this$.read();
      if ((sys.ObjUtil.equals(c, 65534) && sys.ObjUtil.equals(sys.Int.minus(this$.#loc.col(), 1), 1))) {
        this$.decCol();
        return sys.Func.call(this$.docPrefix());
      }
      else {
        if (!YamlTokenizer.isPrintable(c)) {
          throw this$.charsetErr(c);
        }
        ;
      }
      ;
      return c;
    };
  }

  tagHandle$Once() {
    const this$ = this;
    return () => {
      let c = this$.read();
      if (!YamlTokenizer.isWordChar(c)) {
        throw this$.charsetErr(c, "in a tag handle");
      }
      ;
      return c;
    };
  }

  tagSuffix$Once() {
    const this$ = this;
    return () => {
      let c = this$.read();
      if ((!YamlTokenizer.isUriChar(c) || this$.isFlow(c) || sys.ObjUtil.equals(c, 33))) {
        throw this$.charsetErr(c, "in a tag suffix");
      }
      ;
      if (sys.ObjUtil.equals(c, 37)) {
        this$.setPeek(2);
        if ((sys.ObjUtil.compareLT(this$.#peekArr.size(), 2) || !YamlTokenizer.isHexChar(sys.ObjUtil.coerce(this$.#peekArr.get(0), sys.Int.type$.toNullable())) || !YamlTokenizer.isHexChar(sys.ObjUtil.coerce(this$.#peekArr.get(1), sys.Int.type$.toNullable())))) {
          throw this$.err("The % sign is not followed by two hex digits.");
        }
        ;
      }
      ;
      return c;
    };
  }

  uri$Once() {
    const this$ = this;
    return () => {
      let c = this$.read();
      if (!YamlTokenizer.isUriChar(c)) {
        throw this$.charsetErr(c, "in URI strings");
      }
      ;
      if (sys.ObjUtil.equals(c, 37)) {
        this$.setPeek(2);
        if ((sys.ObjUtil.compareLT(this$.#peekArr.size(), 2) || !YamlTokenizer.isHexChar(sys.ObjUtil.coerce(this$.#peekArr.get(0), sys.Int.type$.toNullable())) || !YamlTokenizer.isHexChar(sys.ObjUtil.coerce(this$.#peekArr.get(1), sys.Int.type$.toNullable())))) {
          throw this$.err("The % sign is not followed by two hex digits.");
        }
        ;
      }
      ;
      return c;
    };
  }

  blockStyle$Once() {
    const this$ = this;
    return () => {
      let c = this$.read();
      if (c == null) {
        throw this$.charsetErr(c);
      }
      ;
      if ((sys.ObjUtil.compareNE(c, 45) && sys.ObjUtil.compareNE(c, 43) && !(sys.ObjUtil.compareLE(49, c) && sys.ObjUtil.compareLE(c, 57)))) {
        throw this$.charsetErr(c, "in a block style header");
      }
      ;
      return c;
    };
  }

  str$Once() {
    const this$ = this;
    return () => {
      let c = this$.read();
      if ((c != null && sys.ObjUtil.compareLT(c, 32) && !YamlTokenizer.isPrintable(c))) {
        throw this$.charsetErr(c);
      }
      ;
      return c;
    };
  }

  hex$Once() {
    const this$ = this;
    return () => {
      let c = this$.read();
      if (!YamlTokenizer.isHexChar(c)) {
        throw this$.err(sys.Str.plus(sys.Str.plus("The character '", sys.Int.toChar(sys.ObjUtil.coerce(c, sys.Int.type$))), "' is not a hexadecimal digit."));
      }
      ;
      return c;
    };
  }

  ws$Once() {
    const this$ = this;
    return () => {
      let c = this$.read();
      if (!this$.isWs(c)) {
        throw this$.charsetErr(c, "in this whitespace-only area");
      }
      ;
      return c;
    };
  }

  printable$Once() {
    const this$ = this;
    return () => {
      let c = this$.read();
      if (!YamlTokenizer.isPrintable(c)) {
        throw this$.charsetErr(c);
      }
      ;
      return c;
    };
  }

  any$Once() {
    const this$ = this;
    return () => {
      let c = this$.read();
      if (sys.ObjUtil.equals(c, 65534)) {
        this$.decCol();
      }
      ;
      return c;
    };
  }

}

class YamlTestSuite extends sys.Test {
  constructor() {
    super();
    const this$ = this;
    this.#testDir = sys.Env.cur().homeDir().plus(sys.Uri.fromStr("etc/yaml/tests/"));
    this.#shouldArgErr = sys.List.make(sys.Str.type$, ["2JQS", "X38W"]);
    this.#useFailsafe = sys.List.make(sys.Str.type$, ["SM9W/01", "S3PD", "6M2F", "DFF7", "FRK4", "UKK6/00", "CFD4", "NHX8", "NKF9", "M2N8/00", "FH7J", "PW8X"]);
    this.#shouldFail = sys.List.make(sys.Str.type$, ["UGM3"]);
    return;
  }

  typeof() { return YamlTestSuite.type$; }

  #testDir = null;

  // private field reflection only
  __testDir(it) { if (it === undefined) return this.#testDir; else this.#testDir = it; }

  #shouldArgErr = null;

  // private field reflection only
  __shouldArgErr(it) { if (it === undefined) return this.#shouldArgErr; else this.#shouldArgErr = it; }

  #useFailsafe = null;

  // private field reflection only
  __useFailsafe(it) { if (it === undefined) return this.#useFailsafe; else this.#useFailsafe = it; }

  #shouldFail = null;

  // private field reflection only
  __shouldFail(it) { if (it === undefined) return this.#shouldFail; else this.#shouldFail = it; }

  testRunSuite() {
    const this$ = this;
    if (!this.#testDir.exists()) {
      sys.ObjUtil.echo("\n************************* WARNING *************************\n\n          Test suite files not locally downloaded,\n                       test exiting\n              Run 'build preptest' to download\n\n***********************************************************\n");
      return;
    }
    ;
    let results = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("yaml::YamlRes[]"));
    this.#testDir.walk((f) => {
      if ((f.isDir() && f.plus(sys.Uri.fromStr("===")).exists())) {
        results.add(this$.run(f));
      }
      ;
      return;
    });
    let n = 0;
    let f = 0;
    let s = sys.StrBuf.make();
    results.each((res) => {
      ((this$) => { let $_u63 = n;n = sys.Int.increment(n); return $_u63; })(this$);
      if (res.err() != null) {
        ((this$) => { let $_u64 = f;f = sys.Int.increment(f); return $_u64; })(this$);
        s.add(res.fname());
        sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Error testing \"", sys.Str.trim(res.name())), "\" in folder "), res.fname()), ".\nError - "), res.err().toStr()), "\n"));
      }
      ;
      return;
    });
    sys.ObjUtil.echo(s.toStr());
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Int.minus(n, f), sys.Obj.type$.toNullable())), "/"), sys.ObjUtil.coerce(n, sys.Obj.type$.toNullable())), " tests passed."));
    if (sys.ObjUtil.compareNE(f, 0)) {
      this.fail(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(f, sys.Obj.type$.toNullable())), " YAML suite tests did not pass."));
    }
    ;
    return;
  }

  runOne() {
    let test = this.#testDir.plus(sys.Uri.fromStr("AZW3/"));
    if (!test.exists()) {
      return sys.ObjUtil.echo("This test does not exist. Exiting.");
    }
    ;
    let res = this.run(test);
    if (res.err() != null) {
      throw sys.ObjUtil.coerce(res.err(), sys.Err.type$);
    }
    else {
      sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("Test ", res.fname()), " passed!"));
    }
    ;
    return;
  }

  run(dir) {
    const this$ = this;
    if (!dir.isDir()) {
      throw sys.Err.make("The input must be a directory, not a file.");
    }
    ;
    let name = dir.plus(sys.Uri.fromStr("===")).readAllStr();
    let fname = sys.Str.getRange(dir.uri().relTo(this.#testDir.uri()).toStr(), sys.Range.make(0, -2));
    let parseErr = dir.plus(sys.Uri.fromStr("error")).exists();
    let argErr = this.#shouldArgErr.contains(fname);
    let testErr = this.#shouldFail.contains(fname);
    let schema = ((this$) => { if (this$.#useFailsafe.contains(fname)) return YamlSchema.failsafe(); return YamlSchema.core(); })(this);
    try {
      let comp = dir.listFiles().findAll((f) => {
        return (sys.Str.endsWith(f.uri().toStr(), ".yaml") || sys.Str.endsWith(f.uri().toStr(), ".json"));
      });
      let in1 = YamlReader.make(dir.plus(sys.Uri.fromStr("in.yaml")).in()).parse();
      let inObj = in1.decode(schema);
      comp.each((f) => {
        let compObj = sys.List.make(sys.Obj.type$.toNullable());
        if ((sys.Str.endsWith(f.uri().toStr(), ".json") && sys.ObjUtil.compareGT(sys.ObjUtil.as(inObj, sys.Type.find("sys::Obj?[]")).size(), 1))) {
          let fin = f.in();
          while (sys.ObjUtil.compareNE(fin.avail(), 0)) {
            sys.ObjUtil.trap(compObj,"add", sys.List.make(sys.Obj.type$.toNullable(), [this$.convert(util.JsonInStream.make(fin).readJson())]));
          }
          ;
        }
        else {
          (compObj = YamlReader.make(f.in()).parse().decode(schema));
        }
        ;
        this$.verifyEq(inObj, compObj);
        return;
      });
      try {
        this.verifyEq(in1, YamlReader.make(sys.Str.in(in1.toStr())).parse());
        this.verifyEq(inObj, schema.decode(schema.encode(inObj)));
        if (sys.ObjUtil.compareNE(schema, YamlSchema.failsafe())) {
          this.verifyEq(YamlSchema.failsafe().decode(in1), YamlSchema.failsafe().decode(YamlSchema.failsafe().encode(YamlSchema.failsafe().decode(in1))));
        }
        ;
      }
      catch ($_u66) {
        $_u66 = sys.Err.make($_u66);
        if ($_u66 instanceof sys.Err) {
          let e = $_u66;
          ;
          return YamlRes.make(name, fname, e);
        }
        else {
          throw $_u66;
        }
      }
      ;
    }
    catch ($_u67) {
      $_u67 = sys.Err.make($_u67);
      if ($_u67 instanceof util.FileLocErr) {
        let e = $_u67;
        ;
        if (!parseErr) {
          return YamlRes.make(name, fname, e);
        }
        else {
          return YamlRes.make(name, fname);
        }
        ;
      }
      else if ($_u67 instanceof sys.ArgErr) {
        let e = $_u67;
        ;
        if (!argErr) {
          return YamlRes.make(name, fname, e);
        }
        else {
          return YamlRes.make(name, fname);
        }
        ;
      }
      else if ($_u67 instanceof sys.TestErr) {
        let e = $_u67;
        ;
        if (!testErr) {
          return YamlRes.make(name, fname, e);
        }
        else {
          return YamlRes.make(name, fname);
        }
        ;
      }
      else if ($_u67 instanceof sys.Err) {
        let e = $_u67;
        ;
        return YamlRes.make(name, fname, e);
      }
      else {
        throw $_u67;
      }
    }
    ;
    if ((parseErr || argErr || testErr)) {
      return YamlRes.make(name, fname, sys.Err.make("An error was expected, but none occurred."));
    }
    else {
      return YamlRes.make(name, fname);
    }
    ;
  }

  convert(json) {
    const this$ = this;
    if (json == null) {
      return null;
    }
    else {
      if (sys.ObjUtil.typeof(json).fits(sys.Type.find("sys::List"))) {
        return sys.ObjUtil.as(json, sys.Type.find("sys::List")).map((v) => {
          return this$.convert(v);
        }, sys.Obj.type$.toNullable());
      }
      else {
        if (sys.ObjUtil.typeof(json).fits(sys.Type.find("sys::Map"))) {
          let copy = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?"));
          sys.ObjUtil.as(json, sys.Type.find("sys::Map")).each((v,k) => {
            copy.add(sys.ObjUtil.coerce(this$.convert(k), sys.Obj.type$), this$.convert(v));
            return;
          });
          return copy;
        }
        else {
          return json;
        }
        ;
      }
      ;
    }
    ;
  }

  static make() {
    const $self = new YamlTestSuite();
    YamlTestSuite.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    ;
    return;
  }

}

class YamlRes extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return YamlRes.type$; }

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

  #fname = null;

  fname(it) {
    if (it === undefined) {
      return this.#fname;
    }
    else {
      this.#fname = it;
      return;
    }
  }

  #err = null;

  err(it) {
    if (it === undefined) {
      return this.#err;
    }
    else {
      this.#err = it;
      return;
    }
  }

  static make(name,fname,err) {
    const $self = new YamlRes();
    YamlRes.make$($self,name,fname,err);
    return $self;
  }

  static make$($self,name,fname,err) {
    if (err === undefined) err = null;
    $self.#name = name;
    $self.#fname = fname;
    $self.#err = err;
    return;
  }

}

class PrepTest extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PrepTest.type$; }

  static main() {
    const this$ = this;
    let target = sys.Env.cur().homeDir().plus(sys.Uri.fromStr("etc/yaml/tests/"));
    if (target.exists()) {
      target.delete();
    }
    ;
    target.create();
    let tagsUri = sys.Uri.fromStr("https://api.github.com/repos/yaml/yaml-test-suite/tags");
    let json = sys.ObjUtil.coerce(util.JsonInStream.make(PrepTest.httpGet(tagsUri)).readJson(), sys.Type.find("[sys::Str:sys::Str][]"));
    let tag = json.find((tag) => {
      return sys.Str.startsWith(tag.get("name"), "data");
    });
    let zipUri = sys.Str.toUri(tag.get("zipball_url"));
    let zip = sys.Zip.read(PrepTest.httpGet(zipUri));
    let f = null;
    sys.ObjUtil.echo("Extracting...");
    while ((f = zip.readNext()) != null) {
      if (sys.ObjUtil.equals(f.uri(), sys.Uri.fromStr("/"))) {
        continue;
      }
      ;
      if ((!sys.Str.contains(f.uri().toStr(), "/tags/") && !sys.Str.contains(f.uri().toStr(), "/name/"))) {
        let dst = f.uri().relTo(sys.Str.toUri(sys.Str.plus(sys.Str.plus("/", f.uri().path().get(0)), "/")));
        if (!dst.isDir()) {
          sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("  Extract [", dst), "]"));
        }
        ;
        f.copyTo(target.plus(dst), sys.Map.__fromLiteral(["overwrite"], [sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")));
      }
      ;
    }
    ;
    sys.ObjUtil.echo();
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("SUCCESS: downloaded tests [", target.osPath()), "]"));
    sys.ObjUtil.echo();
    return;
  }

  static httpGet(uri) {
    const this$ = this;
    sys.ObjUtil.echo();
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("Fetching ", uri), " ..."));
    sys.ObjUtil.echo();
    let client = sys.Type.find("web::WebClient").make(sys.List.make(sys.Uri.type$, [uri]));
    sys.ObjUtil.trap(client,"reqHeaders", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.caseInsensitive(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]")).add("User-Agent", "Fantom/1.0")]));
    return sys.ObjUtil.coerce(sys.ObjUtil.trap(client,"getIn", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.InStream.type$);
  }

  static make() {
    const $self = new PrepTest();
    PrepTest.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class BasicYamlTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BasicYamlTest.type$; }

  testPlain() {
    const this$ = this;
    let obj = YamlReader.make(sys.Str.in("Stick mice in my head")).parse();
    this.verifyEq(obj.decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Stick mice in my head"));
    (obj = YamlReader.make(sys.Str.in("---\n And let them\n   back\n\n  out\n\n ")).parse());
    this.verifyEq(obj.decode(), sys.List.make(sys.Obj.type$.toNullable()).add("And let them back\nout"));
    this.verifyLoc(obj.val().get(0), 2, 2);
    (obj = YamlReader.make(sys.Str.in("---\n And let them\n   back\n\n  out # Comment\n#Comment 2\n ")).parse());
    this.verifyEq(obj.decode(), sys.List.make(sys.Obj.type$.toNullable()).add("And let them back\nout"));
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("---\nLine one # With a comment\nLine two")).parse();
      return;
    });
    return;
  }

  testDirectives() {
    const this$ = this;
    let obj = YamlReader.make(sys.Str.in("%YAML 1.2\n%TAG ! tag:fantom.org,2022:test/       # Try all three types of\n%TAG !! tag:fantom.org,2022:test/      # tag handles\n%TAG !test! tag:fantom.org,2022:test/\n--- !!1\n\n# Completely empty node\n")).parse();
    this.verifyEq(obj.val().get(0).tag(), "tag:fantom.org,2022:test/1");
    this.verifyLoc(obj.val().get(0), 5, 5);
    this.verifyEq(obj.decode(), sys.List.make(sys.Obj.type$.toNullable(), [null]));
    (obj = YamlReader.make(sys.Str.in("\ufffe# No directives\n--- !!1\n\n# More complete emptiness\n...\n# ..and even more!\n...")).parse());
    this.verifyEq(obj.val().get(0).tag(), "tag:yaml.org,2002:1");
    this.verifyLoc(obj.val().get(0), 2, 5);
    this.verifyEq(obj.decode(), sys.List.make(sys.Obj.type$.toNullable(), [null]));
    (obj = YamlReader.make(sys.Str.in("%TAG !! tag:fantom.org,2022:test1/    # Multi-document\n--- !!1\n...\n%TAG !! tag:fantom.org,2022:test2/\n--- !!1\n")).parse());
    this.verifyEq(obj.val().get(0).tag(), "tag:fantom.org,2022:test1/1");
    this.verifyEq(obj.val().get(1).tag(), "tag:fantom.org,2022:test2/1");
    this.verifyLoc(obj.val().get(0), 2, 5);
    this.verifyLoc(obj.val().get(1), 5, 5);
    this.verifyEq(obj.decode(), sys.List.make(sys.Obj.type$.toNullable(), [null, null]));
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("%YAML 1.2.2    # invalid version format\n---\n")).parse();
      return;
    });
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("%TAG ! tag:fantom.org,2022:test\n%TAG ! tag:fantom.org,2022:test   # tags cannot be redefined\n---")).parse();
      return;
    });
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("%TAG ! tag:fantom.org,2022:test\nThis text isn't a comment or directive!\n---")).parse();
      return;
    });
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("%YAML 1.2")).parse();
      return;
    });
    return;
  }

  testDocSeparators() {
    let obj = YamlReader.make(sys.Str.in("Test1\n---\nTest2")).parse();
    this.verifyLoc(obj.val().get(0), 1, 1);
    this.verifyLoc(obj.val().get(1), 3, 1);
    this.verifyEq(obj.decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Test1").add("Test2"));
    (obj = YamlReader.make(sys.Str.in("Test1\n...\nTest2")).parse());
    this.verifyLoc(obj.val().get(0), 1, 1);
    this.verifyLoc(obj.val().get(1), 3, 1);
    this.verifyEq(obj.decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Test1").add("Test2"));
    this.verifyEq(YamlReader.make(sys.Str.in("|\nTest1\n...\n>-\nTest2\n\n...")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Test1\n").add("Test2"));
    return;
  }

  testSingleQuoted() {
    const this$ = this;
    this.verifyEq(YamlReader.make(sys.Str.in("'This is a test'")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("This is a test"));
    this.verifyEq(YamlReader.make(sys.Str.in("'Test 2'\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Test 2"));
    this.verifyEq(YamlReader.make(sys.Str.in("'It''s in the other room'")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("It's in the other room"));
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("'This contains' 'two separate strings'")).parse();
      return;
    });
    this.verifyEq(YamlReader.make(sys.Str.in("'This is a   \n   multiline\n test #slay #not a comment\n\n\n hehe' #real comment\n  ")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("This is a multiline test #slay #not a comment\n\nhehe"));
    this.verifyEq(YamlReader.make(sys.Str.in("   'Leading\n spaces'")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Leading spaces"));
    return;
  }

  testDoubleQuoted() {
    this.verifyEq(YamlReader.make(sys.Str.in("\"This is a test\"")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("This is a test"));
    this.verifyEq(YamlReader.make(sys.Str.in("\"Test 2\"\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Test 2"));
    this.verifyEq(YamlReader.make(sys.Str.in("\"Fun with \\\\\"\n...\n\"\\\" \\a \\b \\e \\f\"\n...\n\"\\n \\r \\t \\v \\0\"\n...\n\"\\  \\_ \\N \\L \\P \\\n\\x41 \\u0041 \\U00000041\"\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Fun with \\").add("\" \u0007 \u0008 \u001b \f").add("\n \r \t \u000b \u0000").add("  \u00a0 \u0085 \u2028 \u2029 A A A"));
    this.verifyEq(YamlReader.make(sys.Str.in("\"This is a   \n   multiline\n test #slay #not a comment\n\n\n hehe\" #real comment\n  ")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("This is a multiline test #slay #not a comment\n\nhehe"));
    this.verifyEq(YamlReader.make(sys.Str.in("   \"Leading\n spaces\"")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Leading spaces"));
    return;
  }

  testLiteral() {
    const this$ = this;
    this.verifyEq(YamlReader.make(sys.Str.in("|1\nThis is a test")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("This is a test\n"));
    this.verifyEq(YamlReader.make(sys.Str.in("|\nThis is a test")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("This is a test\n"));
    this.verifyEq(YamlReader.make(sys.Str.in("|\nThis is a test\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("This is a test\n"));
    this.verifyEq(YamlReader.make(sys.Str.in("|2\n  This is a test\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(" This is a test\n"));
    this.verifyEq(YamlReader.make(sys.Str.in("|\n  This is a test\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("This is a test\n"));
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("|3\n This is a test\n")).parse();
      return;
    });
    this.verifyEq(YamlReader.make(sys.Str.in("|\n  \n   \n \n\n   Test\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("\n\n\n\nTest\n"));
    this.verifyEq(YamlReader.make(sys.Str.in("|\n  \n   \n \n\n     Test\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("\n\n\n\nTest\n"));
    this.verifyEq(YamlReader.make(sys.Str.in("|\n\n   \n \n\n   Test\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("\n\n\n\nTest\n"));
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("|\n  \n   \n \n\n  Test\n")).parse();
      return;
    });
    this.verifyEq(YamlReader.make(sys.Str.in("|\nTest \n    Test2")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Test \n    Test2\n"));
    this.verifyEq(YamlReader.make(sys.Str.in("|\n Test \n     Test2")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Test \n    Test2\n"));
    this.verifyEq(YamlReader.make(sys.Str.in("|+\na\n\n\n\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("a\n\n\n\n"));
    this.verifyEq(YamlReader.make(sys.Str.in("|-\na\n\n\n\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("a"));
    this.verifyEq(YamlReader.make(sys.Str.in("|\na\n\n\n\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("a\n"));
    this.verifyEq(YamlReader.make(sys.Str.in(">\nTest1\n \nTest2")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Test1\n \nTest2\n"));
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("|\n  Test \n Test2")).parse();
      return;
    });
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("|\n  Test \n \t  Test2")).parse();
      return;
    });
    this.verifyEq(YamlReader.make(sys.Str.in("# Strip\n  # Comments:\n--- |-   # here too\n  # text\n\n # Clip\n  # comments:\n\n--- |\n  # text\n\n # Keep\n  # comments:\n\n--- |+\n  # text\n\n # Trail\n  # comments.")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("# text").add("# text\n").add("# text\n\n"));
    this.verifyEq(YamlReader.make(sys.Str.in("--- |-\n\n--- |\n\n--- |+\n\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("").add("").add("\n"));
    return;
  }

  testFolded() {
    const this$ = this;
    this.verifyEq(YamlReader.make(sys.Str.in(">1\nThis is a test")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("This is a test\n"));
    this.verifyEq(YamlReader.make(sys.Str.in(">\nThis is a test")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("This is a test\n"));
    this.verifyEq(YamlReader.make(sys.Str.in(">\nThis is a test\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("This is a test\n"));
    this.verifyEq(YamlReader.make(sys.Str.in(">2\n  This is a test\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(" This is a test\n"));
    this.verifyEq(YamlReader.make(sys.Str.in(">\n  This is a test\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("This is a test\n"));
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in(">3\n This is a test\n")).parse();
      return;
    });
    this.verifyEq(YamlReader.make(sys.Str.in(">\n  \n   \n \n\n   Test\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("\n\n\n\nTest\n"));
    this.verifyEq(YamlReader.make(sys.Str.in(">\n  \n   \n \n\n     Test\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("\n\n\n\nTest\n"));
    this.verifyEq(YamlReader.make(sys.Str.in(">\n\n   \n \n\n   Test\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("\n\n\n\nTest\n"));
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in(">\n  \n   \n \n\n  Test\n")).parse();
      return;
    });
    this.verifyEq(YamlReader.make(sys.Str.in(">\nTest \n    Test2")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Test \n    Test2\n"));
    this.verifyEq(YamlReader.make(sys.Str.in(">\n Test \n     Test2")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Test \n    Test2\n"));
    this.verifyEq(YamlReader.make(sys.Str.in(">\n Test \n Test2")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Test  Test2\n"));
    this.verifyEq(YamlReader.make(sys.Str.in(">\n Test \n \tTest2")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Test \n\tTest2\n"));
    this.verifyEq(YamlReader.make(sys.Str.in(">+\na\n\n\n\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("a\n\n\n\n"));
    this.verifyEq(YamlReader.make(sys.Str.in(">-\na\n\n\n\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("a"));
    this.verifyEq(YamlReader.make(sys.Str.in(">\na\n\n\n\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("a\n"));
    this.verifyEq(YamlReader.make(sys.Str.in(">\nTest1\n \nTest2")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("Test1\n \nTest2\n"));
    this.verifyEq(YamlReader.make(sys.Str.in(">-\n  trimmed\n  \n \n\n  as\n  space")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("trimmed\n\n\nas space"));
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in(">\n  Test \n Test2")).parse();
      return;
    });
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in(">\n  Test \n \t  Test2")).parse();
      return;
    });
    this.verifyEq(YamlReader.make(sys.Str.in(">\n\n folded\n line\n\n next\n line\n   * bullet\n\n   * list\n   * lines\n\n last\n line\n\n# Comment")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("\nfolded line\nnext line\n  * bullet\n\n  * list\n  * lines\n\nlast line\n"));
    this.verifyEq(YamlReader.make(sys.Str.in("--- >-\n\n--- >\n\n--- >+\n\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add("").add("").add("\n"));
    return;
  }

  testFlowSeq() {
    const this$ = this;
    this.verifyEq(YamlReader.make(sys.Str.in("[a,b,c]")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.List.make(sys.Obj.type$.toNullable()).addAll(sys.List.make(sys.Str.type$, ["a", "b", "c"]))));
    this.verifyEq(YamlReader.make(sys.Str.in("[a,b,[c,d]]")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.List.make(sys.Obj.type$.toNullable()).addAll(sys.List.make(sys.Obj.type$, ["a", "b", sys.List.make(sys.Obj.type$.toNullable()).addAll(sys.List.make(sys.Str.type$, ["c", "d"]))]))));
    this.verifyEq(YamlReader.make(sys.Str.in("[a,b,c: d]")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.List.make(sys.Obj.type$.toNullable()).addAll(sys.List.make(sys.Obj.type$, ["a", "b", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).addAll(sys.Map.__fromLiteral(["c"], ["d"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")))]))));
    this.verifyEq(YamlReader.make(sys.Str.in("[   'a'  ,  \"b\"    ,c, ]")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.List.make(sys.Obj.type$.toNullable()).addAll(sys.List.make(sys.Str.type$, ["a", "b", "c"]))));
    this.verifyEq(YamlReader.make(sys.Str.in("[this is fine,!!str,]")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.List.make(sys.Obj.type$.toNullable()).addAll(sys.List.make(sys.Str.type$, ["this is fine", ""]))));
    this.verifyEq(YamlReader.make(sys.Str.in("[]")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.List.make(sys.Obj.type$.toNullable())));
    let obj = YamlReader.make(sys.Str.in("[\n\t\t! Two plastic\n      bags\n    drifting, o'er\t\nthe beach\n]")).parse();
    this.verifyEq(obj.decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.List.make(sys.Obj.type$.toNullable()).addAll(sys.List.make(sys.Str.type$, ["Two plastic bags drifting", "o'er the beach"]))));
    this.verifyLoc(obj.val().get(0), 1, 1);
    this.verifyLoc(sys.ObjUtil.coerce(sys.ObjUtil.trap(obj.val().get(0).val(),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())])), YamlObj.type$), 2, 3);
    this.verifyLoc(sys.ObjUtil.coerce(sys.ObjUtil.trap(obj.val().get(0).val(),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])), YamlObj.type$), 4, 15);
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("[\n  |\n  This isn't a block node\n]")).parse();
      return;
    });
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("[too many,,]")).parse();
      return;
    });
    return;
  }

  testFlowMap() {
    const this$ = this;
    this.verifyEq(YamlReader.make(sys.Str.in("{a: 1, b: 2, c: 3}")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).addAll(sys.Map.__fromLiteral(["a","b","c"], [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")))));
    this.verifyEq(YamlReader.make(sys.Str.in("{a: 1,b: 2,{c: 1,d}:3}")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).addAll(sys.Map.__fromLiteral(["a","b",sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).addAll(sys.Map.__fromLiteral(["c","d"], [sys.ObjUtil.coerce(sys.ObjUtil.coerce(1, sys.Int.type$.toNullable()), sys.Obj.type$.toNullable()),null], sys.Type.find("sys::Str"), sys.Type.find("sys::Int?")))), sys.Type.find("[sys::Obj:sys::Obj?]"))], [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())], sys.Type.find("sys::Obj"), sys.Type.find("sys::Int")))));
    this.verifyEq(YamlReader.make(sys.Str.in("{   'a' :1 , !  \"b\"    :2,c:   3, }")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).addAll(sys.Map.__fromLiteral(["a","b","c"], [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")))));
    this.verifyEq(YamlReader.make(sys.Str.in("{this is fine,!!str,}")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).add("this is fine", null).add("", null)));
    this.verifyEq(YamlReader.make(sys.Str.in("{}")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?"))));
    this.verifyEq(YamlReader.make(sys.Str.in("{?\n}")).parse().decode(YamlSchema.failsafe()), sys.List.make(sys.Obj.type$.toNullable()).add(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).add("", "")));
    this.verifyEq(YamlReader.make(sys.Str.in("{\n\t\t! Two plastic\n      bags\n    drifting, o'er\t\nthe beach\n}")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).addAll(sys.Map.__fromLiteral(["Two plastic bags drifting","o'er the beach"], [null,null], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")))));
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("{\n  ? |\n    This isn't a block node\n  : grr\n}")).parse();
      return;
    });
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("{too many,,}")).parse();
      return;
    });
    return;
  }

  testAnchors() {
    const this$ = this;
    let obj = YamlReader.make(sys.Str.in("[\n  &A this is a test,\n  *A,\n  &A this is another test,\n  *A\n]")).parse();
    this.verifyEq(obj.decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.List.make(sys.Obj.type$.toNullable()).add("this is a test").add("this is a test").add("this is another test").add("this is another test")));
    this.verifyLoc(sys.ObjUtil.coerce(sys.ObjUtil.trap(obj.val().get(0).val(),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())])), YamlObj.type$), 2, 3);
    this.verifyLoc(sys.ObjUtil.coerce(sys.ObjUtil.trap(obj.val().get(0).val(),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])), YamlObj.type$), 3, 3);
    this.verifyLoc(sys.ObjUtil.coerce(sys.ObjUtil.trap(obj.val().get(0).val(),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())])), YamlObj.type$), 4, 3);
    this.verifyLoc(sys.ObjUtil.coerce(sys.ObjUtil.trap(obj.val().get(0).val(),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())])), YamlObj.type$), 5, 3);
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("---\n&A test\n---\n*A\n")).parse();
      return;
    });
    return;
  }

  testBlockSeq() {
    const this$ = this;
    this.verifyEq(YamlReader.make(sys.Str.in("-\n  First item\n- !tagged [flow, node]\n\n\n- # Empty")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.List.make(sys.Obj.type$.toNullable()).add("First item").add(sys.List.make(sys.Obj.type$.toNullable()).addAll(sys.List.make(sys.Str.type$, ["flow", "node"]))).add(null)));
    let obj = YamlReader.make(sys.Str.in("  -   - Compact\n\n      - node\n  - yea\n\n")).parse();
    this.verifyEq(obj.decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.List.make(sys.Obj.type$.toNullable()).add(sys.List.make(sys.Obj.type$.toNullable()).addAll(sys.List.make(sys.Str.type$, ["Compact", "node"]))).add("yea")));
    this.verifyLoc(obj.val().get(0), 1, 3);
    this.verifyLoc(sys.ObjUtil.coerce(sys.ObjUtil.trap(obj.val().get(0).val(),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())])), YamlObj.type$), 1, 7);
    this.verifyLoc(sys.ObjUtil.coerce(sys.ObjUtil.trap(sys.ObjUtil.trap(sys.ObjUtil.trap(obj.val().get(0).val(),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())])),"content", sys.List.make(sys.Obj.type$.toNullable(), [])),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())])), YamlObj.type$), 1, 9);
    this.verifyLoc(sys.ObjUtil.coerce(sys.ObjUtil.trap(sys.ObjUtil.trap(sys.ObjUtil.trap(obj.val().get(0).val(),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())])),"content", sys.List.make(sys.Obj.type$.toNullable(), [])),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])), YamlObj.type$), 3, 9);
    this.verifyLoc(sys.ObjUtil.coerce(sys.ObjUtil.trap(obj.val().get(0).val(),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])), YamlObj.type$), 4, 5);
    this.verifyEq(YamlReader.make(sys.Str.in("- First item\n - same item")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.List.make(sys.Obj.type$.toNullable()).add("First item - same item")));
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("  - Non-compact\n - uneven node\n")).parse();
      return;
    });
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("- good\n-bad\n")).parse();
      return;
    });
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("- good\n- still good\n\nbad now\n")).parse();
      return;
    });
    return;
  }

  testBlockMap() {
    const this$ = this;
    this.verifyEq(YamlReader.make(sys.Str.in("   hr : 65    # Home runs\n   avg: 0.278 # Batting average\n   rbi: 147   # Runs Batted In")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).add("hr", sys.ObjUtil.coerce(65, sys.Obj.type$.toNullable())).add("avg", sys.ObjUtil.coerce(sys.Float.make(0.278), sys.Obj.type$.toNullable())).add("rbi", sys.ObjUtil.coerce(147, sys.Obj.type$.toNullable()))));
    this.verifyEq(YamlReader.make(sys.Str.in("indentation:\n- works")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).add("indentation", sys.List.make(sys.Obj.type$.toNullable()).add("works"))));
    this.verifyEq(YamlReader.make(sys.Str.in("-\n map: node\n with:    multiple\n   lines of content\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.List.make(sys.Obj.type$.toNullable()).add(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).addAll(sys.Map.__fromLiteral(["map","with"], ["node","multiple lines of content"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))))));
    this.verifyEq(YamlReader.make(sys.Str.in("nested:\n  map: node\n  with:    multiple\n   lines of content\n")).parse().decode(), sys.List.make(sys.Obj.type$.toNullable()).add(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).add("nested", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")).addAll(sys.Map.__fromLiteral(["map","with"], ["node","multiple lines of content"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))))));
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("Multiple-line\n  key: shouldn't work\n")).parse();
      return;
    });
    YamlReader.make(sys.Str.in("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: works!")).parse();
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlReader.make(sys.Str.in("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: doesn't work")).parse();
      return;
    });
    return;
  }

  testFull() {
    let input = "--- !<tag:clarkevans.com,2002:invoice>\ninvoice: 34843\ndate   : 2001-01-23\nbill-to: &id001\n  given  : Chris\n  family : Dumars\n  address:\n    lines: |\n      458 Walkman Dr.\n      Suite #292\n    city    : Royal Oak\n    state   : MI\n    postal  : 48046\nship-to: *id001\nproduct:\n- sku         : BL394D\n  quantity    : 4\n  description : Basketball\n  price       : 450.00\n- sku         : BL4438H\n  quantity    : 1\n  description : Super Hoop\n  price       : 2392.00\ntax  : 251.42\ntotal: 4443.52\ncomments:\n  Late afternoon is best.\n  Backup contact is Nancy\n  Billsmer @ 338-4338.";
    let expected = "{\n  \"invoice\": 34843,\n  \"date\"   : \"2001-01-23\",\n  \"bill-to\":\n  {\n    \"given\"  : \"Chris\",\n    \"family\" : \"Dumars\",\n    \"address\":\n    {\n      \"lines\"   : \"458 Walkman Dr.\\nSuite #292\\n\",\n      \"city\"    : \"Royal Oak\",\n      \"state\"   : \"MI\",\n      \"postal\"  : 48046,\n    }\n  },\n  \"ship-to\":\n  {\n    \"given\"  : \"Chris\",\n    \"family\" : \"Dumars\",\n    \"address\":\n    {\n      \"lines\"   : \"458 Walkman Dr.\\nSuite #292\\n\",\n      \"city\"    : \"Royal Oak\",\n      \"state\"   : \"MI\",\n      \"postal\"  : 48046,\n    }\n  },\n  \"product\":\n  [\n    {\n      \"sku\"         : \"BL394D\",\n      \"quantity\"    : 4,\n      \"description\" : \"Basketball\",\n      \"price\"       : 450.00\n    },\n    {\n      \"sku\"         : \"BL4438H\",\n      \"quantity\"    : 1,\n      \"description\" : \"Super Hoop\",\n      \"price\"       : 2392.00\n    }\n  ],\n  \"tax\"  : 251.42,\n  \"total\": 4443.52,\n  \"comments\": \"Late afternoon is best. Backup contact is Nancy Billsmer @ 338-4338.\"\n}\n";
    this.verifyEq(YamlReader.make(sys.Str.in(input)).parse().decode(YamlSchema.core()), YamlReader.make(sys.Str.in(expected)).parse().decode(YamlSchema.json()));
    return;
  }

  testEncode() {
    const this$ = this;
    this.verifyEq("test", this.decEnc("test"));
    this.verifyEq(null, this.decEnc(null));
    this.verifyEq(sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()), this.decEnc(sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable())));
    this.verifyEq(sys.ObjUtil.coerce(sys.Float.make(-5.0), sys.Obj.type$.toNullable()), this.decEnc(sys.ObjUtil.coerce(sys.Float.make(-5.0), sys.Obj.type$.toNullable())));
    this.verifyEq(sys.ObjUtil.coerce(sys.Float.negInf(), sys.Obj.type$.toNullable()), this.decEnc(sys.ObjUtil.coerce(sys.Float.negInf(), sys.Obj.type$.toNullable())));
    this.verify(sys.ObjUtil.coerce(sys.ObjUtil.trap(this.decEnc(sys.ObjUtil.coerce(sys.Float.nan(), sys.Obj.type$.toNullable())),"isNaN", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Bool.type$));
    this.verifyEq(sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), this.decEnc(sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())));
    this.verifyEq("~", this.decEnc("~"));
    this.verifyEq("2022-08-22", this.decEnc(sys.Date.fromStr("2022-08-22")));
    this.verifyEq(sys.Map.__fromLiteral(["x","y","w","h"], [sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(-2, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(13, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), this.decEnc(sys.ObjUtil.coerce(sys.ObjUtil.with(Rectangle.make(), (it) => {
      it.x(4);
      it.y(-2);
      it.w(13);
      it.h(0);
      return;
    }), Rectangle.type$)));
    this.verifyEq(sys.Map.__fromLiteral(["name","each"], ["Homer Simson",sys.List.make(sys.Obj.type$.toNullable(), [sys.Map.__fromLiteral(["name","each"], ["Bart",sys.List.make(sys.Obj.type$.toNullable())], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Map.__fromLiteral(["name","each"], ["Lisa",sys.List.make(sys.Obj.type$.toNullable())], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Map.__fromLiteral(["name","each"], ["Maggie",sys.List.make(sys.Obj.type$.toNullable())], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?"))])], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), this.decEnc(sys.ObjUtil.coerce(sys.ObjUtil.with(Person.make(), (it) => {
      it.name("Homer Simson");
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(Person.make(), (it) => {
        it.name("Bart");
        return;
      }), Person.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(Person.make(), (it) => {
        it.name("Lisa");
        return;
      }), Person.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(Person.make(), (it) => {
        it.name("Maggie");
        return;
      }), Person.type$));
      return;
    }), Person.type$)));
    this.verifyEq(YamlMap.make(sys.Map.__fromLiteral([YamlScalar.make("name"),YamlScalar.make("each")], [YamlScalar.make("Homer Simson"),YamlList.make(sys.List.make(YamlObj.type$, [YamlMap.make(sys.Map.__fromLiteral([YamlScalar.make("name"),YamlScalar.make("each")], [YamlScalar.make("Bart"),YamlList.make(sys.List.make(YamlObj.type$))], sys.Type.find("yaml::YamlObj"), sys.Type.find("yaml::YamlObj")), "!fan/yaml::Person"), YamlMap.make(sys.Map.__fromLiteral([YamlScalar.make("name"),YamlScalar.make("each")], [YamlScalar.make("Lisa"),YamlList.make(sys.List.make(YamlObj.type$))], sys.Type.find("yaml::YamlObj"), sys.Type.find("yaml::YamlObj")), "!fan/yaml::Person"), YamlMap.make(sys.Map.__fromLiteral([YamlScalar.make("name"),YamlScalar.make("each")], [YamlScalar.make("Maggie"),YamlList.make(sys.List.make(YamlObj.type$))], sys.Type.find("yaml::YamlObj"), sys.Type.find("yaml::YamlObj")), "!fan/yaml::Person")]))], sys.Type.find("yaml::YamlObj"), sys.Type.find("yaml::YamlObj")), "!fan/yaml::Person"), YamlSchema.core().encode(sys.ObjUtil.coerce(sys.ObjUtil.with(Person.make(), (it) => {
      it.name("Homer Simson");
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(Person.make(), (it) => {
        it.name("Bart");
        return;
      }), Person.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(Person.make(), (it) => {
        it.name("Lisa");
        return;
      }), Person.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(Person.make(), (it) => {
        it.name("Maggie");
        return;
      }), Person.type$));
      return;
    }), Person.type$)));
    return;
  }

  verifyLoc(obj,line,col) {
    this.verifyEq(sys.ObjUtil.coerce(obj.loc().line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(line, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(obj.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(col, sys.Obj.type$.toNullable()));
    return;
  }

  decEnc(obj) {
    return YamlSchema.core().decode(YamlSchema.core().encode(obj));
  }

  static make() {
    const $self = new BasicYamlTest();
    BasicYamlTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class Rectangle extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Rectangle.type$; }

  #x = 0;

  x(it) {
    if (it === undefined) {
      return this.#x;
    }
    else {
      this.#x = it;
      return;
    }
  }

  #y = 0;

  y(it) {
    if (it === undefined) {
      return this.#y;
    }
    else {
      this.#y = it;
      return;
    }
  }

  #w = 0;

  w(it) {
    if (it === undefined) {
      return this.#w;
    }
    else {
      this.#w = it;
      return;
    }
  }

  #h = 0;

  h(it) {
    if (it === undefined) {
      return this.#h;
    }
    else {
      this.#h = it;
      return;
    }
  }

  #area = 0;

  area(it) {
    if (it === undefined) {
      return this.#area;
    }
    else {
      this.#area = it;
      return;
    }
  }

  static make() {
    const $self = new Rectangle();
    Rectangle.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class Person extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#name = "";
    this.#kids = sys.List.make(Person.type$);
    return;
  }

  typeof() { return Person.type$; }

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

  #kids = null;

  // private field reflection only
  __kids(it) { if (it === undefined) return this.#kids; else this.#kids = it; }

  add(kid) {
    this.#kids.add(kid);
    return this;
  }

  each(f) {
    this.#kids.each(f);
    return;
  }

  static make() {
    const $self = new Person();
    Person.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class YamlTokenTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
    this.#fc = 2;
    return;
  }

  typeof() { return YamlTokenTest.type$; }

  #fc = 0;

  fc(it) {
    if (it === undefined) {
      return this.#fc;
    }
    else {
      this.#fc = it;
      return;
    }
  }

  testEat() {
    const this$ = this;
    let r = YamlTokenizer.make(sys.Str.in("abcd !@#\n \$%^&*test"));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    r.eatToken("abcd");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 3), sys.Obj.type$.toNullable()));
    r.eatChar(32);
    r.eatToken("!@#");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 7), sys.Obj.type$.toNullable()));
    r.eatToken("");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 7), sys.Obj.type$.toNullable()));
    r.eatChar(10);
    this.verifyEq(sys.ObjUtil.coerce(r.loc().line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    r.eatChar(32);
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.#fc, sys.Obj.type$.toNullable()));
    r.eatChar(36);
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 1), sys.Obj.type$.toNullable()));
    r.eatStr("%^&*");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 5), sys.Obj.type$.toNullable()));
    r.eatStr("");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 5), sys.Obj.type$.toNullable()));
    r.eatStr("test");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 9), sys.Obj.type$.toNullable()));
    r.eatStr("");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 9), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(sys.Func.call(r.printable()), sys.Obj.type$.toNullable()), null);
    this.verifyEq(sys.ObjUtil.coerce(r.loc().line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 9), sys.Obj.type$.toNullable()));
    YamlTokenizer.make(sys.Str.in("test1")).eatStr("test");
    YamlTokenizer.make(sys.Str.in("test1")).eatStr("test1");
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlTokenizer.make(sys.Str.in("test1")).eatStr("test2");
      return;
    });
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlTokenizer.make(sys.Str.in("test1")).eatStr("test100");
      return;
    });
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlTokenizer.make(sys.Str.in("test1")).eatStr("t3st1");
      return;
    });
    YamlTokenizer.make(sys.Str.in("test2")).eatChar(116);
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlTokenizer.make(sys.Str.in("test2")).eatChar(97);
      return;
    });
    (r = YamlTokenizer.make(sys.Str.in("test3")));
    r.eatToken("test3");
    this.verifyErr(util.FileLocErr.type$, (it) => {
      (r = YamlTokenizer.make(sys.Str.in("test3")));
      r.eatToken("test0");
      return;
    });
    this.verifyErr(util.FileLocErr.type$, (it) => {
      (r = YamlTokenizer.make(sys.Str.in("test3")));
      r.eatToken("");
      return;
    });
    (r = YamlTokenizer.make(sys.Str.in("{test1}}    \t    test2aa :)    test3    \n\n   \n   \n")));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    this.verifyEq(r.eatUntil((c) => {
      return sys.ObjUtil.equals(c, 125);
    }), "{test1");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 5), sys.Obj.type$.toNullable()));
    this.verifyEq(r.eatUntil((c) => {
      return sys.ObjUtil.equals(c, 125);
    }), "");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 5), sys.Obj.type$.toNullable()));
    r.eatChar(125);
    r.eatChar(125);
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 7), sys.Obj.type$.toNullable()));
    r.eatWs();
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 16), sys.Obj.type$.toNullable()));
    r.eatStr("test2");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 21), sys.Obj.type$.toNullable()));
    this.verifyEq(r.eatLine(), "aa :)    test3    ");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    this.verifyEq(r.eatLine(), "");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    r.eatWs();
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 2), sys.Obj.type$.toNullable()));
    r.eatChar(10);
    this.verifyEq(r.eatLine(), "   ");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    this.verifyEq(r.eatLine(), "");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    return;
  }

  testPeek() {
    const this$ = this;
    let r = YamlTokenizer.make(sys.Str.in("abcd   \n         a\na\n"));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.peek(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(97, sys.Obj.type$.toNullable()));
    this.verifyEq(r.peekToken(), "abcd");
    this.verifyEq(r.peekUntil((c) => {
      return sys.ObjUtil.equals(c, 99);
    }), "ab");
    this.verifyEq(r.peekUntil((c) => {
      return sys.ObjUtil.equals(c, 97);
    }), "");
    this.verifyEq(sys.ObjUtil.coerce(r.peekPast((_) => {
      return true;
    }), sys.Obj.type$.toNullable()), null);
    this.verifyEq(sys.ObjUtil.coerce(r.peekPast((_) => {
      return false;
    }), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(97, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    r.eatToken();
    this.verifyEq(sys.ObjUtil.coerce(r.peekNextNs(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()));
    this.verifyEq(r.peekToken(), "");
    this.verifyEq(r.peekUntil((c) => {
      return sys.ObjUtil.equals(c, 97);
    }), "   \n         ");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 3), sys.Obj.type$.toNullable()));
    r.eatLine();
    this.verifyEq(sys.ObjUtil.coerce(r.peekNextNs(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(97, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.peekPast((c) => {
      return (sys.ObjUtil.equals(c, 32) || sys.ObjUtil.equals(c, 97));
    }), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    r.eatLine();
    this.verifyEq(sys.ObjUtil.coerce(r.peekNextNs(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(97, sys.Obj.type$.toNullable()));
    this.verifyEq(r.peekToken(), "a");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    r.eatLine();
    this.verifyEq(sys.ObjUtil.coerce(r.peek(), sys.Obj.type$.toNullable()), null);
    this.verifyEq(r.peekToken(), "");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    return;
  }

  testSpecial() {
    const this$ = this;
    let r = YamlTokenizer.make(sys.Str.in("     # This is a comment!\na     \n"));
    r.eatCommentLine();
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    r.eatChar(97);
    r.eatCommentLine();
    r.eatCommentLine();
    r.eatCommentLine();
    this.verifyEq(sys.ObjUtil.coerce(r.loc().line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    this.verifyErr(util.FileLocErr.type$, (it) => {
      YamlTokenizer.make(sys.Str.in("   Content here oops\n")).eatCommentLine();
      return;
    });
    (r = YamlTokenizer.make(sys.Str.in("     # This is a comment!\n\t    \n  ajd a ds  ds  sd sdsdskhf\naaa")));
    this.verifyEq(r.nextKeyStr(-1), "ajd a ds  ds  sd sdsdskhf\naaa");
    this.verifyEq(r.nextKeyStr(2), "ajd a ds  ds  sd sdsdskhf\naaa");
    this.verifyEq(r.nextKeyStr(0), "ajd a ds  ds  sd sdsdskhf\naaa");
    this.verifyEq(r.nextKeyStr(3), "");
    this.verifyEq(sys.ObjUtil.coerce(r.loc().line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    this.verifyEq(YamlTokenizer.make(sys.Str.in("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).nextKeyStr(0), "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    (r = YamlTokenizer.make(sys.Str.in("!!str} &test-thing ! 'str':valid")));
    this.verify(!r.nextKeyIsJson());
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    r.eatToken();
    this.verify(r.nextKeyIsJson());
    this.verifyEq(sys.ObjUtil.coerce(r.loc().line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(this.#fc, 5), sys.Obj.type$.toNullable()));
    (r = YamlTokenizer.make(sys.Str.in("     # This is a comment!\n\t    \n  ajd a ds  ds  sd sdsdskhf\naaa")));
    this.verifyEq(sys.ObjUtil.coerce(r.peekIndentedNs(2), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(97, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.peekIndentedNs(0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(97, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.peekIndentedNs(3), sys.Obj.type$.toNullable()), null);
    this.verifyEq(r.peekIndentedToken(2), "ajd");
    this.verifyEq(r.peekIndentedToken(0), "ajd");
    this.verifyEq(r.peekIndentedToken(3), null);
    this.verifyEq(sys.ObjUtil.coerce(r.loc().line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    (r = YamlTokenizer.make(sys.Str.in("     # This is a comment!\n\t    \n \tajd")));
    this.verifyEq(sys.ObjUtil.coerce(r.peekIndentedNs(2), sys.Obj.type$.toNullable()), null);
    this.verifyEq(r.peekIndentedToken(2), null);
    this.verifyEq(r.peekIndentedToken(1), "ajd");
    (r = YamlTokenizer.make(sys.Str.in("# Comment\n    # c2\n   \n\n ... ")));
    this.verify(!r.nextTokenEndsDoc());
    this.verifyEq(sys.ObjUtil.coerce(r.loc().line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    (r = YamlTokenizer.make(sys.Str.in("# Comment\n    # c2\n   \n\n... ")));
    this.verify(r.nextTokenEndsDoc());
    this.verifyEq(sys.ObjUtil.coerce(r.loc().line(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(r.loc().col(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(this.#fc, 1), sys.Obj.type$.toNullable()));
    this.verify(YamlTokenizer.make(sys.Str.in("...")).nextTokenEndsDoc());
    this.verify(YamlTokenizer.make(sys.Str.in("---")).nextTokenEndsDoc());
    this.verify(YamlTokenizer.make(sys.Str.in("\ufffe---\n")).nextTokenEndsDoc());
    return;
  }

  static make() {
    const $self = new YamlTokenTest();
    YamlTokenTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    ;
    return;
  }

}

const p = sys.Pod.add$('yaml');
const xp = sys.Param.noParams$();
let m;
YamlParser.type$ = p.at$('YamlParser','sys::Obj',[],{},128,YamlParser);
Context.type$ = p.at$('Context','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},170,Context);
YamlReader.type$ = p.at$('YamlReader','sys::Obj',[],{},8192,YamlReader);
YamlObj.type$ = p.at$('YamlObj','sys::Obj',[],{'sys::Serializable':""},8195,YamlObj);
YamlScalar.type$ = p.at$('YamlScalar','yaml::YamlObj',[],{},8194,YamlScalar);
YamlList.type$ = p.at$('YamlList','yaml::YamlObj',[],{},8194,YamlList);
YamlMap.type$ = p.at$('YamlMap','yaml::YamlObj',[],{},8194,YamlMap);
YamlSchema.type$ = p.at$('YamlSchema','sys::Obj',[],{},8195,YamlSchema);
YamlTagErr.type$ = p.at$('YamlTagErr','sys::Err',[],{'sys::NoDoc':""},8194,YamlTagErr);
FailsafeSchema.type$ = p.at$('FailsafeSchema','yaml::YamlSchema',[],{'sys::NoDoc':""},8194,FailsafeSchema);
JsonSchema.type$ = p.at$('JsonSchema','yaml::FailsafeSchema',[],{'sys::NoDoc':""},8194,JsonSchema);
CoreSchema.type$ = p.at$('CoreSchema','yaml::FailsafeSchema',[],{'sys::NoDoc':""},8194,CoreSchema);
YamlTokenizer.type$ = p.at$('YamlTokenizer','sys::Obj',[],{},128,YamlTokenizer);
YamlTestSuite.type$ = p.at$('YamlTestSuite','sys::Test',[],{},8192,YamlTestSuite);
YamlRes.type$ = p.at$('YamlRes','sys::Obj',[],{},128,YamlRes);
PrepTest.type$ = p.at$('PrepTest','sys::Obj',[],{'sys::NoDoc':""},8192,PrepTest);
BasicYamlTest.type$ = p.at$('BasicYamlTest','sys::Test',[],{},8192,BasicYamlTest);
Rectangle.type$ = p.at$('Rectangle','sys::Obj',[],{'sys::Serializable':""},128,Rectangle);
Person.type$ = p.at$('Person','sys::Obj',[],{'sys::Serializable':"sys::Serializable{collection=true;}"},128,Person);
YamlTokenTest.type$ = p.at$('YamlTokenTest','sys::Test',[],{},8192,YamlTokenTest);
YamlParser.type$.af$('r',67584,'yaml::YamlTokenizer',{}).af$('docs',67584,'yaml::YamlObj[]',{}).af$('tagShorthands',67584,'[sys::Str:sys::Str]',{}).af$('anchors',67584,'[sys::Str:yaml::YamlObj]',{}).af$('anchorsInProgress',67584,'sys::Str[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('loc','util::FileLoc',true)]),{}).am$('parse',8192,'yaml::YamlObj[]',xp,{}).am$('parseDocument',2048,'sys::Void',xp,{}).am$('parseDirectives',2048,'sys::Void',xp,{}).am$('parseBlockNode',2048,'yaml::YamlObj',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('ctx','yaml::Context',false)]),{}).am$('parseFlowNode',2048,'yaml::YamlObj',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('ctx','yaml::Context',false)]),{}).am$('parseAlias',2048,'yaml::YamlObj',sys.List.make(sys.Param.type$,[new sys.Param('ctx','yaml::Context',false)]),{}).am$('parseProperties',2048,'[sys::Str:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('ctx','yaml::Context',false)]),{}).am$('parseLiteral',2048,'yaml::YamlScalar',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('tag','sys::Str',false),new sys.Param('loc','util::FileLoc?',false)]),{}).am$('parseFolded',2048,'yaml::YamlScalar',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('tag','sys::Str',false),new sys.Param('loc','util::FileLoc?',false)]),{}).am$('parseBlockHeader',2048,'[sys::Str:sys::Obj]',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false)]),{}).am$('parseSingleQuote',2048,'yaml::YamlScalar',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('ctx','yaml::Context',false),new sys.Param('tag','sys::Str',false),new sys.Param('loc','util::FileLoc?',false)]),{}).am$('parseDoubleQuote',2048,'yaml::YamlScalar',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('ctx','yaml::Context',false),new sys.Param('tag','sys::Str',false),new sys.Param('loc','util::FileLoc?',false)]),{}).am$('parseFlowSeq',2048,'yaml::YamlList',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('ctx','yaml::Context',false),new sys.Param('tag','sys::Str',false),new sys.Param('loc','util::FileLoc?',false)]),{}).am$('parseFlowSeqEntry',2048,'yaml::YamlObj',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('ctx','yaml::Context',false)]),{}).am$('parseFlowMap',2048,'yaml::YamlMap',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('ctx','yaml::Context',false),new sys.Param('tag','sys::Str',false),new sys.Param('loc','util::FileLoc?',false)]),{}).am$('parseFlowMapEntry',2048,'[sys::Str:yaml::YamlObj]',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('ctx','yaml::Context',false)]),{}).am$('parseBlockSeq',2048,'yaml::YamlList',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('tag','sys::Str',false),new sys.Param('loc','util::FileLoc?',false)]),{}).am$('parseBlockSeqEntry',2048,'yaml::YamlObj',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false)]),{}).am$('parseBlockMap',2048,'yaml::YamlMap',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('tag','sys::Str',false),new sys.Param('loc','util::FileLoc?',false)]),{}).am$('parseBlockMapEntry',2048,'[sys::Str:yaml::YamlObj]',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false)]),{}).am$('parseBlockIndented',2048,'yaml::YamlObj',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('ctx','yaml::Context',false)]),{}).am$('parsePlain',2048,'yaml::YamlScalar',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('ctx','yaml::Context',false),new sys.Param('tag','sys::Str',false),new sys.Param('loc','util::FileLoc?',false)]),{}).am$('plainInLine',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('ctx','yaml::Context',false)]),{}).am$('separate',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('ctx','yaml::Context',false)]),{}).am$('sLComments',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('readRule','|->sys::Int?|',true)]),{}).am$('parseDocEnd',2048,'sys::Void',xp,{}).am$('err',2048,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc?',true)]),{}).am$('assertLineStart',2048,'sys::Void',xp,{}).am$('objSLComments',2048,'yaml::YamlObj',sys.List.make(sys.Param.type$,[new sys.Param('startLine','sys::Int',false),new sys.Param('keyIsJson','sys::Bool',false),new sys.Param('ret','yaml::YamlObj',false)]),{}).am$('nextNodeIsKey',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('ctx','yaml::Context',false)]),{}).am$('startsWithKey',128,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('tagShorthands','[sys::Str:sys::Str]',false),new sys.Param('anchors','[sys::Str:yaml::YamlObj]',false),new sys.Param('ctx','yaml::Context',false)]),{}).am$('setLoc',2048,'yaml::YamlObj',sys.List.make(sys.Param.type$,[new sys.Param('obj','yaml::YamlObj',false),new sys.Param('loc','util::FileLoc',false)]),{});
Context.type$.af$('blockIn',106506,'yaml::Context',{}).af$('blockOut',106506,'yaml::Context',{}).af$('flowIn',106506,'yaml::Context',{}).af$('flowOut',106506,'yaml::Context',{}).af$('blockKey',106506,'yaml::Context',{}).af$('flowKey',106506,'yaml::Context',{}).af$('vals',106498,'yaml::Context[]',{}).am$('isFlow',8192,'sys::Bool',xp,{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'yaml::Context?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
YamlReader.type$.af$('p',67584,'yaml::YamlParser',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('loc','util::FileLoc',true)]),{}).am$('makeFile',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('parse',8192,'yaml::YamlList',xp,{});
YamlObj.type$.af$('tagRef',65666,'sys::Str',{}).af$('valRef',65666,'sys::Obj',{}).af$('locRef',65666,'util::FileLoc',{}).am$('tag',8192,'sys::Str',xp,{}).am$('val',270336,'sys::Obj',xp,{}).am$('content',8192,'sys::Obj',xp,{'sys::Deprecated':"sys::Deprecated{msg=\"Use val\";}",'sys::NoDoc':""}).am$('loc',8192,'util::FileLoc',xp,{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('tag','sys::Str',false),new sys.Param('loc','util::FileLoc',false)]),{}).am$('decode',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('schema','yaml::YamlSchema',true)]),{}).am$('write',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('writeInd',262273,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('first','sys::Int',false),new sys.Param('next','sys::Int',true)]),{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
YamlScalar.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('tag','sys::Str',true),new sys.Param('loc','util::FileLoc',true)]),{}).am$('normTag',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false)]),{}).am$('makeLoc',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('loc','util::FileLoc',false)]),{'sys::NoDoc':""}).am$('val',271360,'sys::Str',xp,{}).am$('writeInd',263296,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('first','sys::Int',false),new sys.Param('next','sys::Int',true)]),{});
YamlList.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','yaml::YamlObj[]',false),new sys.Param('tag','sys::Str',true),new sys.Param('loc','util::FileLoc',true)]),{}).am$('normTag',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false)]),{}).am$('makeLoc',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','yaml::YamlObj[]',false),new sys.Param('loc','util::FileLoc',false)]),{'sys::NoDoc':""}).am$('val',271360,'yaml::YamlObj[]',xp,{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|yaml::YamlObj->sys::Void|',false)]),{}).am$('writeInd',263296,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('first','sys::Int',false),new sys.Param('next','sys::Int',true)]),{}).am$('writeStream',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{});
YamlMap.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','[yaml::YamlObj:yaml::YamlObj]',false),new sys.Param('tag','sys::Str',true),new sys.Param('loc','util::FileLoc',true)]),{}).am$('normTag',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false)]),{}).am$('makeLoc',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','[yaml::YamlObj:yaml::YamlObj]',false),new sys.Param('loc','util::FileLoc',false)]),{'sys::NoDoc':""}).am$('val',271360,'[yaml::YamlObj:yaml::YamlObj]',xp,{}).am$('writeInd',263296,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('first','sys::Int',false),new sys.Param('next','sys::Int',true)]),{});
YamlSchema.type$.af$('failsafe',106498,'yaml::YamlSchema',{}).af$('json',106498,'yaml::YamlSchema',{}).af$('core',106498,'yaml::YamlSchema',{}).am$('decode',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('node','yaml::YamlObj',false)]),{}).am$('encode',270337,'yaml::YamlObj',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('assignTag',266241,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('node','yaml::YamlObj',false)]),{'sys::NoDoc':""}).am$('validate',266240,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','yaml::YamlObj',false)]),{'sys::NoDoc':""}).am$('isRecognized',266240,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false)]),{'sys::NoDoc':""}).am$('recEncode',4096,'yaml::YamlObj',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false),new sys.Param('f','|sys::Obj?->yaml::YamlObj|',false)]),{'sys::NoDoc':""}).am$('worksAsPlain',4096,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{'sys::NoDoc':""}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
YamlTagErr.type$.am$('makeType',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false),new sys.Param('type','sys::Type',false)]),{}).am$('makeContent',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','yaml::YamlObj',false)]),{}).am$('makeStr',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{});
FailsafeSchema.type$.am$('decode',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('node','yaml::YamlObj',false)]),{}).am$('encode',271360,'yaml::YamlObj',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('assignTag',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('node','yaml::YamlObj',false)]),{}).am$('validate',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','yaml::YamlObj',false)]),{}).am$('isRecognized',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
JsonSchema.type$.af$('matchNull',67586,'sys::Regex',{}).af$('matchBool',67586,'sys::Regex',{}).af$('matchInt',67586,'sys::Regex',{}).af$('matchFloat',67586,'sys::Regex',{}).am$('decode',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('node','yaml::YamlObj',false)]),{}).am$('encode',271360,'yaml::YamlObj',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('assignTag',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('node','yaml::YamlObj',false)]),{}).am$('validate',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','yaml::YamlObj',false)]),{}).am$('isRecognized',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
CoreSchema.type$.af$('matchNull',67586,'sys::Regex',{}).af$('matchBool',67586,'sys::Regex',{}).af$('matchInt',67586,'sys::Regex',{}).af$('matchFloat',67586,'sys::Regex',{}).am$('decode',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('node','yaml::YamlObj',false)]),{}).am$('encode',271360,'yaml::YamlObj',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('assignTag',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('node','yaml::YamlObj',false)]),{}).am$('validate',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','yaml::YamlObj',false)]),{}).am$('isRecognized',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
YamlTokenizer.type$.af$('in',67584,'sys::InStream',{}).af$('peekArr',67584,'sys::Int[]',{}).af$('loc',73728,'util::FileLoc',{}).af$('docPrefix$Store',722944,'sys::Obj?',{}).af$('tagHandle$Store',722944,'sys::Obj?',{}).af$('tagSuffix$Store',722944,'sys::Obj?',{}).af$('uri$Store',722944,'sys::Obj?',{}).af$('blockStyle$Store',722944,'sys::Obj?',{}).af$('str$Store',722944,'sys::Obj?',{}).af$('hex$Store',722944,'sys::Obj?',{}).af$('ws$Store',722944,'sys::Obj?',{}).af$('printable$Store',722944,'sys::Obj?',{}).af$('any$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('loc','util::FileLoc',true)]),{}).am$('peek',8192,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('readRule','|->sys::Int?|',true)]),{}).am$('eatChar',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expected','sys::Int',false)]),{}).am$('eatStr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expected','sys::Str',false)]),{}).am$('eatToken',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('expected','sys::Str?',true),new sys.Param('readRule','|->sys::Int?|',true)]),{}).am$('peekToken',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('readRule','|->sys::Int?|',true)]),{}).am$('eatUntilr',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('readRule','|->sys::Int?|',false),new sys.Param('endRule','|sys::Int->sys::Bool|',false)]),{}).am$('eatUntil',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('endRule','|sys::Int->sys::Bool|',false)]),{}).am$('peekUntilr',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('readRule','|->sys::Int?|',false),new sys.Param('endRule','|sys::Int->sys::Bool|',false)]),{}).am$('peekUntil',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('endRule','|sys::Int->sys::Bool|',false)]),{}).am$('eatLine',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('readRule','|->sys::Int?|',true)]),{}).am$('eatWs',8192,'sys::Void',xp,{}).am$('peekNextNs',8192,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('readRule','|->sys::Int?|',true)]),{}).am$('peekPastr',8192,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('readRule','|->sys::Int?|',false),new sys.Param('contRule','|sys::Int->sys::Bool|',false)]),{}).am$('peekPast',8192,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('contRule','|sys::Int->sys::Bool|',false)]),{}).am$('eatCommentLine',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','sys::Str',true)]),{}).am$('eatInd',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false)]),{}).am$('nextKeyStr',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false)]),{}).am$('nextKeyIsJson',8192,'sys::Bool',xp,{}).am$('peekIndentedNs',8192,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('readRule','|->sys::Int?|',true)]),{}).am$('peekIndentedToken',8192,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('readRule','|->sys::Int?|',true)]),{}).am$('peekIndentedUntilr',8192,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('readRule','|->sys::Int?|',false),new sys.Param('endRule','|sys::Int->sys::Bool|',false)]),{}).am$('peekIndentedUntil',8192,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false),new sys.Param('endRule','|sys::Int->sys::Bool|',false)]),{}).am$('nextTokenEndsDoc',8192,'sys::Bool',xp,{}).am$('docPrefix',532480,'|->sys::Int?|',xp,{}).am$('tagHandle',532480,'|->sys::Int?|',xp,{}).am$('tagSuffix',532480,'|->sys::Int?|',xp,{}).am$('uri',532480,'|->sys::Int?|',xp,{}).am$('firstChar',8192,'|->sys::Int?|',sys.List.make(sys.Param.type$,[new sys.Param('ctx','yaml::Context',false)]),{}).am$('blockStyle',532480,'|->sys::Int?|',xp,{}).am$('str',532480,'|->sys::Int?|',xp,{}).am$('hex',532480,'|->sys::Int?|',xp,{}).am$('ws',532480,'|->sys::Int?|',xp,{}).am$('printable',532480,'|->sys::Int?|',xp,{}).am$('any',532480,'|->sys::Int?|',xp,{}).am$('incCol',8192,'sys::Void',xp,{}).am$('decCol',8192,'sys::Void',xp,{}).am$('incLine',8192,'sys::Void',xp,{}).am$('deduceEncoding',2048,'sys::Void',xp,{}).am$('read',2048,'sys::Int?',xp,{}).am$('setPeek',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Int',false)]),{}).am$('unread',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('unreadAll',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cs','sys::Int[]',false)]),{}).am$('isWs',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int?',false)]),{}).am$('isNl',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int?',false)]),{}).am$('isNs',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int?',false)]),{}).am$('isFlow',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int?',false)]),{}).am$('isFlowEnd',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int?',false)]),{}).am$('isWordChar',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int?',false)]),{}).am$('isHexChar',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int?',false)]),{}).am$('isUriChar',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int?',false)]),{}).am$('isPrintable',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int?',false)]),{}).am$('isIndicator',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int?',false)]),{}).am$('err',2048,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc?',true)]),{}).am$('charsetErr',2048,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int?',false),new sys.Param('errLoc','sys::Str',true)]),{}).am$('debug',128,'sys::Void',xp,{}).am$('docPrefix$Once',133120,'|->sys::Int?|',xp,{}).am$('tagHandle$Once',133120,'|->sys::Int?|',xp,{}).am$('tagSuffix$Once',133120,'|->sys::Int?|',xp,{}).am$('uri$Once',133120,'|->sys::Int?|',xp,{}).am$('blockStyle$Once',133120,'|->sys::Int?|',xp,{}).am$('str$Once',133120,'|->sys::Int?|',xp,{}).am$('hex$Once',133120,'|->sys::Int?|',xp,{}).am$('ws$Once',133120,'|->sys::Int?|',xp,{}).am$('printable$Once',133120,'|->sys::Int?|',xp,{}).am$('any$Once',133120,'|->sys::Int?|',xp,{});
YamlTestSuite.type$.af$('testDir',67584,'sys::File',{}).af$('shouldArgErr',67584,'sys::Str[]',{}).af$('useFailsafe',67584,'sys::Str[]',{}).af$('shouldFail',67584,'sys::Str[]',{}).am$('testRunSuite',8192,'sys::Void',xp,{}).am$('runOne',8192,'sys::Void',xp,{}).am$('run',2048,'yaml::YamlRes',sys.List.make(sys.Param.type$,[new sys.Param('dir','sys::File',false)]),{}).am$('convert',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('json','sys::Obj?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
YamlRes.type$.af$('name',73728,'sys::Str',{}).af$('fname',73728,'sys::Str',{}).af$('err',73728,'sys::Err?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('fname','sys::Str',false),new sys.Param('err','sys::Err?',true)]),{});
PrepTest.type$.am$('main',40962,'sys::Void',xp,{}).am$('httpGet',40962,'sys::InStream',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('make',139268,'sys::Void',xp,{});
BasicYamlTest.type$.am$('testPlain',8192,'sys::Void',xp,{}).am$('testDirectives',8192,'sys::Void',xp,{}).am$('testDocSeparators',8192,'sys::Void',xp,{}).am$('testSingleQuoted',8192,'sys::Void',xp,{}).am$('testDoubleQuoted',8192,'sys::Void',xp,{}).am$('testLiteral',8192,'sys::Void',xp,{}).am$('testFolded',8192,'sys::Void',xp,{}).am$('testFlowSeq',8192,'sys::Void',xp,{}).am$('testFlowMap',8192,'sys::Void',xp,{}).am$('testAnchors',8192,'sys::Void',xp,{}).am$('testBlockSeq',8192,'sys::Void',xp,{}).am$('testBlockMap',8192,'sys::Void',xp,{}).am$('testFull',8192,'sys::Void',xp,{}).am$('testEncode',8192,'sys::Void',xp,{}).am$('verifyLoc',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','yaml::YamlObj',false),new sys.Param('line','sys::Int',false),new sys.Param('col','sys::Int',false)]),{}).am$('decEnc',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Rectangle.type$.af$('x',73728,'sys::Int',{}).af$('y',73728,'sys::Int',{}).af$('w',73728,'sys::Int',{}).af$('h',73728,'sys::Int',{}).af$('area',73728,'sys::Int',{'sys::Transient':""}).am$('make',139268,'sys::Void',xp,{});
Person.type$.af$('name',73728,'sys::Str',{}).af$('kids',67584,'yaml::Person[]',{'sys::Transient':""}).am$('add',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('kid','yaml::Person',false)]),{'sys::Operator':""}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|yaml::Person->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{});
YamlTokenTest.type$.af$('fc',73728,'sys::Int',{}).am$('testEat',8192,'sys::Void',xp,{}).am$('testPeek',8192,'sys::Void',xp,{}).am$('testSpecial',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "yaml");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;util 1.0");
m.set("pod.summary", "YAML parser for Fantom");
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
  YamlReader,
  YamlObj,
  YamlScalar,
  YamlList,
  YamlMap,
  YamlSchema,
  YamlTagErr,
  FailsafeSchema,
  JsonSchema,
  CoreSchema,
  YamlTestSuite,
  PrepTest,
  BasicYamlTest,
  YamlTokenTest,
};
