// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as rdf from './rdf.js'
import * as util from './util.js'
import * as web from './web.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
import * as axon from './axon.js'
import * as def from './def.js'
import * as folio from './folio.js'
import * as obs from './obs.js'
import * as hx from './hx.js'
import * as xetoEnv from './xetoEnv.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class XetoFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoFuncs.type$; }

  static specLib(name,checked) {
    if (checked === undefined) checked = true;
    if (sys.ObjUtil.is(name, haystack.Ref.type$)) {
      let id = sys.ObjUtil.toStr(name);
      if (!sys.Str.startsWith(id, "lib:")) {
        throw sys.ArgErr.make(sys.Str.plus("Invalid ref format: ", id));
      }
      ;
      (name = sys.Str.getRange(id, sys.Range.make(4, -1)));
    }
    ;
    return XetoFuncs.curContext().xeto().lib(sys.ObjUtil.coerce(name, sys.Str.type$), checked);
  }

  static specLibs(scope) {
    if (scope === undefined) scope = axon.Literal.nullVal();
    const this$ = this;
    let cx = XetoFuncs.curContext();
    let filter = null;
    if (scope !== axon.Literal.nullVal()) {
      (filter = scope.evalToFilter(cx));
    }
    ;
    return sys.ObjUtil.coerce(cx.xeto().libs().mapNotNull((lib) => {
      if ((filter != null && !filter.matches(sys.ObjUtil.coerce(lib, haystack.Dict.type$), cx))) {
        return null;
      }
      ;
      return lib;
    }, xeto.Dict.type$.toNullable()), sys.Type.find("xeto::Dict[]"));
  }

  static spec(qname,checked) {
    if (checked === undefined) checked = true;
    return XetoFuncs.curContext().xeto().spec(sys.ObjUtil.toStr(qname), checked);
  }

  static specs(scope,filter) {
    if (scope === undefined) scope = axon.Literal.nullVal();
    if (filter === undefined) filter = axon.Literal.nullVal();
    const this$ = this;
    let cx = XetoFuncs.curContext();
    let filterFunc = null;
    if (filter !== axon.Literal.nullVal()) {
      let f = filter.evalToFilter(cx);
      (filterFunc = (x) => {
        return f.matches(xetoEnv.MDictMerge1.make(x, "slots", x.slots().toDict()), cx);
      });
    }
    ;
    let scopeVal = scope.eval(cx);
    if (scopeVal == null) {
      return XetoFuncs.typesInScope(cx, filterFunc);
    }
    ;
    let lib = sys.ObjUtil.as(scopeVal, xeto.Lib.type$);
    if (lib != null) {
      let specs = lib.types();
      if (filterFunc != null) {
        (specs = specs.findAll(sys.ObjUtil.coerce(filterFunc, sys.Type.find("|xeto::Spec,sys::Int->sys::Bool|"))));
      }
      ;
      return specs;
    }
    ;
    let list = sys.ObjUtil.as(scopeVal, sys.Type.find("sys::List"));
    if (list != null) {
      let acc = sys.List.make(xeto.Spec.type$);
      list.each((x) => {
        (lib = ((this$) => { let $_u0 = sys.ObjUtil.as(x, xeto.Lib.type$); if ($_u0 != null) return $_u0; throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expecting list of Lib: ", x), " ["), sys.ObjUtil.typeof(x)), "]")); })(this$));
        lib.types().each((spec) => {
          if ((filterFunc != null && !sys.Func.call(filterFunc, spec))) {
            return;
          }
          ;
          acc.add(spec);
          return;
        });
        return;
      });
      return acc;
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid value for scope: ", scopeVal), " ["), sys.ObjUtil.typeof(scopeVal)), "]"));
  }

  static typesInScope(cx,filter) {
    if (filter === undefined) filter = null;
    const this$ = this;
    let acc = sys.List.make(xeto.Spec.type$);
    cx.xeto().eachType((x) => {
      if ((filter != null && !sys.Func.call(filter, x))) {
        return;
      }
      ;
      acc.add(x);
      return;
    });
    let vars = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::Spec"));
    cx.varsInScope().each((var$) => {
      let x = sys.ObjUtil.as(var$, xeto.Spec.type$);
      if (x == null) {
        return;
      }
      ;
      if (vars.get(x.qname()) != null) {
        return;
      }
      ;
      if ((filter != null && !sys.Func.call(filter, sys.ObjUtil.coerce(x, xeto.Spec.type$)))) {
        return;
      }
      ;
      vars.set(x.qname(), sys.ObjUtil.coerce(x, xeto.Spec.type$));
      acc.add(sys.ObjUtil.coerce(x, xeto.Spec.type$));
      return;
    });
    return acc;
  }

  static instance(qname,checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(xetoEnv.XetoUtil.toHaystack(XetoFuncs.curContext().xeto().instance(sys.ObjUtil.toStr(qname), checked)), xeto.Dict.type$.toNullable());
  }

  static instances(scope,filter) {
    if (scope === undefined) scope = axon.Literal.nullVal();
    if (filter === undefined) filter = axon.Literal.nullVal();
    const this$ = this;
    return sys.ObjUtil.coerce(XetoFuncs.doInstances(scope, filter).map((x) => {
      return sys.ObjUtil.coerce(xetoEnv.XetoUtil.toHaystack(x), xeto.Dict.type$);
    }, xeto.Dict.type$), sys.Type.find("xeto::Dict[]"));
  }

  static doInstances(scope,filter) {
    if (scope === undefined) scope = axon.Literal.nullVal();
    if (filter === undefined) filter = axon.Literal.nullVal();
    const this$ = this;
    let cx = XetoFuncs.curContext();
    let f = null;
    if (filter !== axon.Literal.nullVal()) {
      (f = filter.evalToFilter(cx));
    }
    ;
    let scopeVal = scope.eval(cx);
    if (scopeVal == null) {
      return XetoFuncs.instancesInScope(cx, f);
    }
    ;
    let lib = sys.ObjUtil.as(scopeVal, xeto.Lib.type$);
    if (lib != null) {
      let instances = lib.instances();
      if (f != null) {
        (instances = instances.findAll((x) => {
          return f.matches(sys.ObjUtil.coerce(x, haystack.Dict.type$), cx);
        }));
      }
      ;
      return instances;
    }
    ;
    let list = sys.ObjUtil.as(scopeVal, sys.Type.find("sys::List"));
    if (list != null) {
      let acc = sys.List.make(xeto.Dict.type$);
      list.each((x) => {
        (lib = ((this$) => { let $_u1 = sys.ObjUtil.as(x, xeto.Lib.type$); if ($_u1 != null) return $_u1; throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expecting list of Lib: ", x), " ["), sys.ObjUtil.typeof(x)), "]")); })(this$));
        lib.instances().each((instance) => {
          if ((f != null && !f.matches(sys.ObjUtil.coerce(instance, haystack.Dict.type$), cx))) {
            return;
          }
          ;
          acc.add(instance);
          return;
        });
        return;
      });
      return acc;
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid value for scope: ", scopeVal), " ["), sys.ObjUtil.typeof(scopeVal)), "]"));
  }

  static instancesInScope(cx,filter) {
    const this$ = this;
    let acc = sys.List.make(xeto.Dict.type$);
    cx.xeto().libs().each((lib) => {
      lib.instances().each((x) => {
        if ((filter != null && !filter.matches(sys.ObjUtil.coerce(x, haystack.Dict.type$), cx))) {
          return;
        }
        ;
        acc.add(x);
        return;
      });
      return;
    });
    return acc;
  }

  static instantiate(spec,opts) {
    if (opts === undefined) opts = null;
    return XetoFuncs.curContext().xeto().instantiate(spec, haystack.Etc.dictSet(sys.ObjUtil.coerce(opts, haystack.Dict.type$.toNullable()), "haystack", haystack.Marker.val()));
  }

  static specParent(spec) {
    return spec.parent();
  }

  static specName(spec) {
    return spec.name();
  }

  static specQName(spec) {
    return spec.qname();
  }

  static specType(spec) {
    return spec.type();
  }

  static specBase(spec) {
    return spec.base();
  }

  static specMeta(spec) {
    return sys.ObjUtil.coerce(xetoEnv.XetoUtil.toHaystack(spec.meta()), xeto.Dict.type$);
  }

  static specMetaOwn(spec) {
    return sys.ObjUtil.coerce(xetoEnv.XetoUtil.toHaystack(spec.metaOwn()), xeto.Dict.type$);
  }

  static specSlotsOwn(spec) {
    return spec.slotsOwn().toDict();
  }

  static specSlots(spec) {
    return spec.slots().toDict();
  }

  static specOf(val,checked) {
    if (checked === undefined) checked = true;
    return XetoFuncs.curContext().xeto().specOf(val, checked);
  }

  static specIs(a,b) {
    return a.isa(b);
  }

  static specFits(a,b) {
    return XetoFuncs.curContext().xeto().specFits(a, b, null);
  }

  static _is(val,spec) {
    return XetoFuncs.curContext().xeto().specOf(val).isa(spec);
  }

  static choiceOf(instance,choice,checked) {
    if (checked === undefined) checked = true;
    return XetoFuncs.curContext().xeto().choice(choice).selection(haystack.Etc.toRec(instance), checked);
  }

  static fits(val,spec,opts) {
    if (opts === undefined) opts = null;
    let cx = XetoFuncs.curContext();
    return cx.xeto().fits(cx, val, spec, opts);
  }

  static specFitsExplain(a,b) {
    const this$ = this;
    let gb = haystack.GridBuilder.make().addCol("msg");
    let explain = (rec) => {
      gb.addRow1(rec.msg());
      return;
    };
    let opts = haystack.Etc.dict1("explain", sys.Unsafe.make(explain));
    XetoFuncs.curContext().xeto().specFits(a, b, opts);
    return gb.toGrid();
  }

  static fitsExplain(recs,spec,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    let cx = XetoFuncs.curContext();
    let ns = cx.xeto();
    let hits = sys.List.make(xeto.XetoLogRec.type$);
    let gb = haystack.GridBuilder.make().addCol("id").addCol("msg");
    let optsMap = haystack.Etc.dictToMap(sys.ObjUtil.coerce(opts, haystack.Dict.type$.toNullable()));
    optsMap.set("explain", sys.Unsafe.make((rec) => {
      hits.add(rec);
      return;
    }));
    optsMap.set("haystack", haystack.Marker.val());
    (opts = haystack.Etc.dictFromMap(optsMap));
    haystack.Etc.toRecs(recs).each((rec,i) => {
      hits.clear();
      let recId = sys.ObjUtil.as(rec.get("id"), haystack.Ref.type$);
      let recSpec = spec;
      if (recSpec == null) {
        let specTag = sys.ObjUtil.as(rec.get("spec"), haystack.Ref.type$);
        if (specTag == null) {
          hits.add(sys.ObjUtil.coerce(xeto.XetoLogRec.make(sys.LogLevel.err(), recId, "Missing 'spec' ref tag", util.FileLoc.unknown(), null), xeto.XetoLogRec.type$));
        }
        else {
          (recSpec = ns.spec(specTag.id(), false));
          if (recSpec == null) {
            hits.add(sys.ObjUtil.coerce(xeto.XetoLogRec.make(sys.LogLevel.err(), recId, sys.Str.plus("Unknown 'spec' ref: ", specTag), util.FileLoc.unknown(), null), xeto.XetoLogRec.type$));
          }
          ;
        }
        ;
      }
      ;
      if (recSpec != null) {
        ns.fits(cx, rec, sys.ObjUtil.coerce(recSpec, xeto.Spec.type$), opts);
      }
      ;
      if (!hits.isEmpty()) {
        let id = ((this$) => { let $_u2 = sys.ObjUtil.as(rec.get("id"), haystack.Ref.type$); if ($_u2 != null) return $_u2; return haystack.Ref.fromStr(sys.Str.plus("_", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()))); })(this$);
        gb.addRow2(id, ((this$) => { if (sys.ObjUtil.equals(hits.size(), 1)) return "1 error"; return sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(hits.size(), sys.Obj.type$.toNullable())), " errors"); })(this$));
        hits.each((hit) => {
          gb.addRow2(id, hit.msg());
          return;
        });
      }
      ;
      return;
    });
    return gb.toGrid();
  }

  static fitsMatchAll(recs,specs,opts) {
    if (specs === undefined) specs = null;
    if (opts === undefined) opts = null;
    const this$ = this;
    let specList = sys.ObjUtil.as(specs, sys.Type.find("xeto::Spec[]"));
    if ((specList == null && specs != null)) {
      (specList = sys.List.make(xeto.Spec.type$, [sys.ObjUtil.coerce(specs, xeto.Spec.type$)]));
    }
    ;
    let cx = XetoFuncs.curContext();
    let dictSpec = cx.xeto().spec("sys::Dict");
    if (specList == null) {
      (specList = XetoFuncs.typesInScope(cx, (t) => {
        return (!sys.Str.startsWith(t.qname(), "sys::") && t.isa(sys.ObjUtil.coerce(dictSpec, xeto.Spec.type$)) && t.missing("abstract"));
      }));
    }
    ;
    let gb = haystack.GridBuilder.make().addCol("id").addCol("num").addCol("specs");
    haystack.Etc.toRecs(recs).each((rec) => {
      let matches = XetoFuncs.doFitsMatchAll(cx, rec, sys.ObjUtil.coerce(specList, sys.Type.find("xeto::Spec[]")), opts);
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [rec.id(), haystack.Number.makeInt(matches.size()), matches]));
      return;
    });
    return gb.toGrid();
  }

  static doFitsMatchAll(cx,rec,specs,opts) {
    const this$ = this;
    let ns = cx.xeto();
    let matches = sys.ObjUtil.coerce(specs.findAll((spec) => {
      return ns.fits(cx, rec, spec, opts);
    }), sys.Type.find("xetoEnv::XetoSpec[]"));
    let best = sys.ObjUtil.coerce(xetoEnv.XetoUtil.excludeSupertypes(matches), sys.Type.find("xetoEnv::XetoSpec[]"));
    return best.sort();
  }

  static query(subject,spec,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let cx = XetoFuncs.curContext();
    let subjectRec = haystack.Etc.toRec(subject);
    let hit = cx.xeto().queryWhile(cx, subjectRec, spec, haystack.Etc.dict0(), (hit) => {
      return hit;
    });
    if (hit != null) {
      return sys.ObjUtil.coerce(hit, xeto.Dict.type$.toNullable());
    }
    ;
    if (checked) {
      throw haystack.UnknownRecErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("@", subjectRec.id()), " "), spec.qname()));
    }
    ;
    return null;
  }

  static queryAll(subject,spec,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    let limit = sys.Int.maxVal();
    let sort = false;
    if ((opts != null && !opts.isEmpty())) {
      (limit = sys.ObjUtil.coerce(((this$) => { let $_u4 = ((this$) => { let $_u5 = sys.ObjUtil.as(opts.get("limit"), haystack.Number.type$); if ($_u5 == null) return null; return sys.ObjUtil.as(opts.get("limit"), haystack.Number.type$).toInt(); })(this$); if ($_u4 != null) return $_u4; return sys.ObjUtil.coerce(limit, sys.Int.type$.toNullable()); })(this), sys.Int.type$));
      (sort = opts.has("sort"));
    }
    ;
    let cx = XetoFuncs.curContext();
    let acc = sys.List.make(xeto.Dict.type$);
    let subjectRec = haystack.Etc.toRec(subject);
    cx.xeto().queryWhile(cx, subjectRec, spec, haystack.Etc.dict0(), (hit) => {
      acc.add(hit);
      if (sys.ObjUtil.compareGE(acc.size(), limit)) {
        return "break";
      }
      ;
      return null;
    });
    if (sort) {
      haystack.Etc.sortDictsByDis(sys.ObjUtil.coerce(acc, sys.Type.find("haystack::Dict[]")));
    }
    ;
    return haystack.Etc.makeDictsGrid(null, sys.ObjUtil.coerce(acc, sys.Type.find("haystack::Dict?[]")));
  }

  static queryNamed(subject,spec,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    let cx = XetoFuncs.curContext();
    let ns = cx.xeto();
    let subjectRec = haystack.Etc.toRec(subject);
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::Dict"));
    ns.queryWhile(cx, subjectRec, spec, haystack.Etc.dict0(), (hit) => {
      spec.slots().eachWhile((slot) => {
        let name = slot.name();
        if (acc.get(name) != null) {
          return null;
        }
        ;
        if (ns.fits(cx, hit, slot)) {
          return acc.set(name, hit);
        }
        ;
        return null;
      });
      return null;
    });
    return haystack.Etc.dictFromMap(acc);
  }

  static curContext() {
    return sys.ObjUtil.coerce(axon.AxonContext.curAxon(), axon.AxonContext.type$);
  }

  static make() {
    const $self = new XetoFuncs();
    XetoFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class XetoLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoLib.type$; }

  static make() {
    const $self = new XetoLib();
    XetoLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    return;
  }

}

const p = sys.Pod.add$('hxXeto');
const xp = sys.Param.noParams$();
let m;
XetoFuncs.type$ = p.at$('XetoFuncs','sys::Obj',[],{'sys::Js':""},8194,XetoFuncs);
XetoLib.type$ = p.at$('XetoLib','hx::HxLib',[],{},8194,XetoLib);
XetoFuncs.type$.am$('specLib',40962,'xeto::Lib?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Obj',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('specLibs',40962,'xeto::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('scope','axon::Expr',true)]),{'axon::Axon':""}).am$('spec',40962,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Obj',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('specs',40962,'xeto::Spec[]',sys.List.make(sys.Param.type$,[new sys.Param('scope','axon::Expr',true),new sys.Param('filter','axon::Expr',true)]),{'axon::Axon':""}).am$('typesInScope',34818,'xeto::Spec[]',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('filter','|xeto::Spec->sys::Bool|?',true)]),{}).am$('instance',40962,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Obj',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('instances',40962,'xeto::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('scope','axon::Expr',true),new sys.Param('filter','axon::Expr',true)]),{'axon::Axon':""}).am$('doInstances',34818,'xeto::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('scope','axon::Expr',true),new sys.Param('filter','axon::Expr',true)]),{}).am$('instancesInScope',34818,'xeto::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('filter','haystack::Filter?',false)]),{}).am$('instantiate',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('opts','xeto::Dict?',true)]),{'axon::Axon':""}).am$('specParent',40962,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{'axon::Axon':""}).am$('specName',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{'axon::Axon':""}).am$('specQName',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{'axon::Axon':""}).am$('specType',40962,'xeto::Spec',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{'axon::Axon':""}).am$('specBase',40962,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{'axon::Axon':""}).am$('specMeta',40962,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{'axon::Axon':""}).am$('specMetaOwn',40962,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{'axon::Axon':""}).am$('specSlotsOwn',40962,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{'axon::Axon':""}).am$('specSlots',40962,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{'axon::Axon':""}).am$('specOf',40962,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('specIs',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('a','xeto::Spec',false),new sys.Param('b','xeto::Spec',false)]),{'axon::Axon':""}).am$('specFits',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('a','xeto::Spec',false),new sys.Param('b','xeto::Spec',false)]),{'axon::Axon':""}).am$('_is',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('spec','xeto::Spec',false)]),{'axon::Axon':""}).am$('choiceOf',40962,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('instance','sys::Obj',false),new sys.Param('choice','xeto::Spec',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('fits',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('spec','xeto::Spec',false),new sys.Param('opts','xeto::Dict?',true)]),{'axon::Axon':""}).am$('specFitsExplain',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('a','xeto::Spec',false),new sys.Param('b','xeto::Spec',false)]),{'axon::Axon':""}).am$('fitsExplain',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('recs','sys::Obj?',false),new sys.Param('spec','xeto::Spec?',false),new sys.Param('opts','xeto::Dict?',true)]),{'axon::Axon':""}).am$('fitsMatchAll',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('recs','sys::Obj?',false),new sys.Param('specs','sys::Obj?',true),new sys.Param('opts','xeto::Dict?',true)]),{'axon::Axon':""}).am$('doFitsMatchAll',34818,'xeto::Spec[]',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('rec','xeto::Dict',false),new sys.Param('specs','xeto::Spec[]',false),new sys.Param('opts','xeto::Dict?',false)]),{}).am$('query',40962,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('subject','sys::Obj',false),new sys.Param('spec','xeto::Spec',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('queryAll',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('subject','sys::Obj',false),new sys.Param('spec','xeto::Spec',false),new sys.Param('opts','xeto::Dict?',true)]),{'axon::Axon':""}).am$('queryNamed',40962,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('subject','sys::Obj',false),new sys.Param('spec','xeto::Spec',false),new sys.Param('opts','xeto::Dict?',true)]),{'axon::Axon':""}).am$('curContext',32898,'axon::AxonContext',xp,{}).am$('make',139268,'sys::Void',xp,{});
XetoLib.type$.am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxXeto");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;util 1.0;xeto 3.1.11;xetoEnv 3.1.11;haystack 3.1.11;axon 3.1.11;hx 3.1.11");
m.set("pod.summary", "Xeto data and spec function library");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:26-05:00 New_York");
m.set("build.tsKey", "241210143126");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "false");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "SkyFoundry");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Haxall");
m.set("proj.uri", "https://haxall.io/");
m.set("pod.docApi", "true");
m.set("org.uri", "https://skyfoundry.com/");
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/haxall/haxall");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  XetoFuncs,
  XetoLib,
};
