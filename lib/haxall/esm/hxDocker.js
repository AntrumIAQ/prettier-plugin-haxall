// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as rdf from './rdf.js'
import * as util from './util.js'
import * as web from './web.js'
import * as docker from './docker.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
import * as axon from './axon.js'
import * as def from './def.js'
import * as folio from './folio.js'
import * as obs from './obs.js'
import * as hx from './hx.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class DockerMgrActor extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#running = concurrent.AtomicBool.make(true);
    this.#containers = concurrent.ConcurrentMap.make();
    return;
  }

  typeof() { return DockerMgrActor.type$; }

  run() { return hx.HxDockerService.prototype.run.apply(this, arguments); }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #running = null;

  // private field reflection only
  __running(it) { if (it === undefined) return this.#running; else this.#running = it; }

  #containers = null;

  // private field reflection only
  __containers(it) { if (it === undefined) return this.#containers; else this.#containers = it; }

  static make(lib) {
    const $self = new DockerMgrActor();
    DockerMgrActor.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    concurrent.Actor.make$($self, lib.rt().libs().actorPool());
    ;
    $self.#lib = lib;
    return;
  }

  log() {
    return this.#lib.log();
  }

  ids() {
    return sys.ObjUtil.coerce(this.#containers.keys(sys.Str.type$), sys.Type.find("sys::Str[]"));
  }

  runAsync(image,config) {
    return this.send(hx.HxMsg.make2("run", image, config));
  }

  deleteContainer(id) {
    let res = this.send(hx.HxMsg.make1("deleteContainer", id)).get();
    return DockerMgrActor.resToDict(sys.ObjUtil.coerce(haystack.Ref.fromStr(id), haystack.Ref.type$), sys.ObjUtil.coerce(res, docker.StatusRes.type$));
  }

  listImages() {
    return this.onListImages();
  }

  listContainers() {
    return this.onListContainers();
  }

  stopContainer(id) {
    return sys.ObjUtil.coerce(this.send(hx.HxMsg.make1("stopContainer", id)).get(), docker.StatusRes.type$);
  }

  shutdown() {
    this.send(hx.HxMsg.make0("shutdown")).get();
    return;
  }

  receive(obj) {
    let msg = sys.ObjUtil.coerce(obj, hx.HxMsg.type$);
    let $_u0 = msg.id();
    if (sys.ObjUtil.equals($_u0, "run")) {
      return this.onRun(sys.ObjUtil.coerce(msg.a(), sys.Str.type$), sys.ObjUtil.coerce(msg.b(), sys.Obj.type$));
    }
    else if (sys.ObjUtil.equals($_u0, "endpointSettings")) {
      return this.onEndpointSettings(sys.ObjUtil.coerce(msg.a(), sys.Str.type$), sys.ObjUtil.coerce(msg.b(), sys.Str.type$));
    }
    else if (sys.ObjUtil.equals($_u0, "stopContainer")) {
      return this.onStopContainer(sys.ObjUtil.coerce(msg.a(), sys.Str.type$));
    }
    else if (sys.ObjUtil.equals($_u0, "deleteContainer")) {
      return this.onDeleteContainer(sys.ObjUtil.coerce(msg.a(), sys.Str.type$));
    }
    else if (sys.ObjUtil.equals($_u0, "shutdown")) {
      return this.onShutdown();
    }
    else {
      throw sys.Err.make(sys.Str.plus("Unrecognized msg: ", msg));
    }
    ;
  }

  onRun(image,config) {
    let cmd = this.createContainer(config).withImage(image);
    let id = cmd.exec().id();
    this.#containers.add(id, sys.Unsafe.make(cmd));
    try {
      this.client().startContainer(id).exec().throwIfErr();
    }
    catch ($_u1) {
      $_u1 = sys.Err.make($_u1);
      if ($_u1 instanceof sys.Err) {
        let err = $_u1;
        ;
        throw sys.Err.make(sys.Str.plus("Failed to start container for image ", image), err);
      }
      else {
        throw $_u1;
      }
    }
    ;
    let container = this.client().listContainers().withFilters(docker.Filters.make().withFilter("id", sys.List.make(sys.Str.type$, [id])).build()).exec().first();
    return MHxDockerContainer.make(sys.ObjUtil.coerce(container, docker.DockerContainer.type$));
  }

  createContainer(config) {
    const this$ = this;
    let cmd = sys.ObjUtil.coerce(this.decodeCmd(config, docker.CreateContainerCmd.type$), docker.CreateContainerCmd.type$);
    let ioDir = this.#lib.rt().dir().plus(sys.Uri.fromStr("io/"));
    if (((this$) => { let $_u2 = this$.#lib.rec().ioDirMount(); if ($_u2 == null) return null; return sys.Str.trimToNull(this$.#lib.rec().ioDirMount()); })(this) != null) {
      (ioDir = sys.Str.toUri(this.#lib.rec().ioDirMount()).plusSlash().toFile());
    }
    ;
    cmd.hostConfig().withBinds(sys.List.make(docker.Bind.type$, [docker.Bind.make((it) => {
      it.__src(sys.ObjUtil.coerce(ioDir.normalize().osPath(), sys.Str.type$));
      it.__dest("/io");
      return;
    })]));
    return cmd;
  }

  onEndpointSettings(id,network) {
    let containers = this.client().listContainers().withFilters(docker.Filters.make().withFilter("id", sys.List.make(sys.Str.type$, [this.checkManaged(id)])).build()).exec();
    if (containers.isEmpty()) {
      throw sys.Err.make(sys.Str.plus("No container with id ", id));
    }
    ;
    if (sys.ObjUtil.compareGT(containers.size(), 1)) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Multiple containers with id ", id), ": "), sys.ObjUtil.coerce(containers.size(), sys.Obj.type$.toNullable())));
    }
    ;
    let endpoint = containers.first().network(network);
    if (endpoint == null) {
      return null;
    }
    ;
    return MHxDockerEndpoint.make(sys.ObjUtil.coerce(endpoint, docker.EndpointSettings.type$));
  }

  onListImages() {
    const this$ = this;
    let arr = this.client().listImages().exec();
    let gb = haystack.GridBuilder.make().addCol("id").addCol("repoTags").addCol("created").addCol("size").addCol("dockerImage").addCol("labels", sys.Map.__fromLiteral(["hidden"], [haystack.Marker.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker"))).addCol("json", sys.Map.__fromLiteral(["hidden"], [haystack.Marker.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker")));
    arr.each((image) => {
      gb.addDictRow(haystack.Etc.makeDict(sys.Map.__fromLiteral(["id","dockerImage","repoTags","created","size","labels","json"], [haystack.Ref.make(image.id(), DockerMgrActor.idDis(image.id())),haystack.Marker.val(),image.repoTags(),image.createdAt(),haystack.Number.makeInt(image.size(), sys.Unit.fromStr("byte")),DockerMgrActor.labelsToDict(image.labels()),util.JsonOutStream.writeJsonToStr(image.rawJson())], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))));
      return;
    });
    return gb.toGrid();
  }

  static labelsToDict(labels) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    labels.each((v,k) => {
      acc.set(haystack.Etc.toTagName(k), v);
      return;
    });
    return haystack.Etc.makeDict(acc);
  }

  onListContainers() {
    const this$ = this;
    let arr = this.client().listContainers().withShowAll(true).withFilters(docker.Filters.make().withFilter("id", this.ids()).build()).exec();
    let gb = haystack.GridBuilder.make().addCol("id").addCol("dockerState").addCol("dockerStatus").addCol("names").addCol("image").addCol("command").addCol("created").addCol("dockerContainer").addCol("json", sys.Map.__fromLiteral(["hidden"], [haystack.Marker.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker")));
    arr.findAll((c) => {
      return this$.#containers.containsKey(c.id());
    }).each((c) => {
      gb.addDictRow(haystack.Etc.makeDict(sys.Map.__fromLiteral(["id","dockerContainer","dockerState","dockerStatus","names","image","command","created","json"], [haystack.Ref.make(c.id(), DockerMgrActor.idDis(c.id())),haystack.Marker.val(),c.state(),c.status(),c.names(),c.image(),c.command(),c.createdAt(),util.JsonOutStream.writeJsonToStr(c.rawJson())], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))));
      return;
    });
    return gb.toGrid();
  }

  onStopContainer(id) {
    return this.client().stopContainer(this.checkManaged(id)).withWait(sys.Duration.fromStr("1sec")).exec();
  }

  onDeleteContainer(id) {
    let res = this.client().removeContainer(this.checkManaged(id)).withForce(true).exec();
    if ((res.isOk() || sys.ObjUtil.equals(res.statusCode(), 404))) {
      this.#containers.remove(id);
    }
    ;
    return res;
  }

  onShutdown() {
    const this$ = this;
    try {
      let acc = sys.List.make(sys.Str.type$);
      this.#containers.each((json,id) => {
        try {
          this$.onDeleteContainer(sys.ObjUtil.coerce(id, sys.Str.type$)).throwIfErr();
          acc.add(sys.ObjUtil.coerce(id, sys.Str.type$));
        }
        catch ($_u3) {
          $_u3 = sys.Err.make($_u3);
          if ($_u3 instanceof sys.Err) {
            let err = $_u3;
            ;
            this$.log().err(sys.Str.plus("Failed to kill container ", id), err);
          }
          else {
            throw $_u3;
          }
        }
        ;
        return;
      });
      return acc;
    }
    finally {
      this.#running.val(false);
    }
    ;
  }

  client() {
    return docker.DockerClient.make(this.dockerConfig());
  }

  dockerConfig() {
    const this$ = this;
    if (!this.#running.val()) {
      throw sys.Err.make("The Docker service is stopped");
    }
    ;
    let host = ((this$) => { let $_u4 = this$.#lib.rec().dockerDaemon(); if ($_u4 == null) return null; return sys.Str.trimToNull(this$.#lib.rec().dockerDaemon()); })(this);
    return docker.DockerConfig.make((it) => {
      if (host != null) {
        it.__daemonHost(sys.ObjUtil.coerce(host, sys.Str.type$));
      }
      ;
      return;
    });
  }

  checkManaged(id) {
    let obj = this.#containers.get(id);
    if (obj == null) {
      throw sys.ArgErr.make(sys.Str.plus("No managed container with id: ", id));
    }
    ;
    return id;
  }

  static resToDict(id,res) {
    let m = sys.Map.__fromLiteral(["id","statusCode","msg"], [id,sys.ObjUtil.coerce(res.statusCode(), sys.Obj.type$.toNullable()),res.msg()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    if (res.isErr()) {
      m.set("err", haystack.Marker.val());
    }
    ;
    return haystack.Etc.makeDict(m);
  }

  static idDis(id) {
    let parts = sys.Str.split(id, sys.ObjUtil.coerce(58, sys.Int.type$.toNullable()));
    let hash = parts.getSafe(1, parts.get(0));
    return sys.Str.getRange(hash, sys.Range.make(0, 12, true));
  }

  decodeCmd(obj,type) {
    let cmd = null;
    if (sys.ObjUtil.typeof(obj).fits(type)) {
      (cmd = sys.ObjUtil.coerce(obj, docker.DockerHttpCmd.type$.toNullable()));
    }
    else {
      let json = null;
      if (sys.ObjUtil.is(obj, sys.Type.find("sys::Map"))) {
        (json = sys.ObjUtil.coerce(obj, sys.Type.find("sys::Map")));
      }
      else {
        if (sys.ObjUtil.is(obj, sys.Str.type$)) {
          (json = sys.ObjUtil.coerce(util.JsonInStream.make(sys.Str.in(sys.ObjUtil.coerce(obj, sys.Str.type$))).readJson(), sys.Type.find("sys::Map")));
        }
        else {
          if (sys.ObjUtil.is(obj, haystack.Dict.type$)) {
            (json = DockerMgrActor.dictToMap(sys.ObjUtil.coerce(obj, haystack.Dict.type$)));
          }
          else {
            throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot decode ", sys.ObjUtil.typeof(obj)), " as "), type), ": "), obj));
          }
          ;
        }
        ;
      }
      ;
      (cmd = sys.ObjUtil.as(docker.DockerJsonDecoder.make().decodeVal(json, type), docker.DockerHttpCmd.type$));
    }
    ;
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(cmd.withClient(this.client()), docker.DockerHttpCmd.type$.toNullable()), docker.DockerHttpCmd.type$);
  }

  static dictToMap(d) {
    return sys.ObjUtil.coerce(DockerMgrActor.convertDictVal(d), sys.Type.find("[sys::Str:sys::Obj?]"));
  }

  static convertDictVal(val) {
    const this$ = this;
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
      sys.ObjUtil.coerce(val, haystack.Dict.type$).each((v,k) => {
        if (!sys.ObjUtil.is(k, sys.Str.type$)) {
          throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Key is not Str ", k), " ("), sys.ObjUtil.typeof(k)), ") in "), val));
        }
        ;
        acc.set(k, DockerMgrActor.convertDictVal(v));
        return;
      });
      return acc;
    }
    else {
      if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
        return sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).map((item) => {
          return DockerMgrActor.convertDictVal(item);
        }, sys.Obj.type$.toNullable());
      }
      else {
        return val;
      }
      ;
    }
    ;
  }

}

class DockerFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DockerFuncs.type$; }

  static curHx() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static lib(cx) {
    if (cx === undefined) cx = DockerFuncs.curHx();
    return sys.ObjUtil.coerce(cx.rt().lib("docker"), DockerLib.type$);
  }

  static dockerListImages() {
    return DockerFuncs.lib().dockerMgr().listImages();
  }

  static dockerListContainers() {
    let meta = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    let cx = hx.HxContext.curHx();
    if (DockerFuncs.curHx().feedIsEnabled()) {
      DockerFuncs.curHx().feedAdd(DockerContainerFeed.make(sys.ObjUtil.coerce(cx, hx.HxContext.type$)), meta);
    }
    ;
    return DockerFuncs.lib().dockerMgr().listContainers().setMeta(meta);
  }

  static dockerDeleteContainer(id) {
    return DockerFuncs.lib().dockerMgr().deleteContainer(DockerFuncs.toRef(id).id());
  }

  static dockerRun(image,config) {
    if (config === undefined) config = haystack.Etc.emptyDict();
    return DockerFuncs.lib().dockerMgr().run(image, config).id();
  }

  static toRef(arg) {
    if (sys.ObjUtil.is(arg, haystack.Ref.type$)) {
      return sys.ObjUtil.coerce(arg, haystack.Ref.type$);
    }
    ;
    if (sys.ObjUtil.is(arg, sys.Str.type$)) {
      return sys.ObjUtil.coerce(haystack.Ref.fromStr(sys.ObjUtil.coerce(arg, sys.Str.type$)), haystack.Ref.type$);
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot convert to Ref: ", arg), " ("), sys.ObjUtil.typeof(arg)), ")"));
  }

  static make() {
    const $self = new DockerFuncs();
    DockerFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DockerContainerFeed extends hx.HxFeed {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DockerContainerFeed.type$; }

  static make(cx) {
    const $self = new DockerContainerFeed();
    DockerContainerFeed.make$($self,cx);
    return $self;
  }

  static make$($self,cx) {
    hx.HxFeed.make$($self, cx);
    return;
  }

  poll(cx) {
    return DockerFuncs.dockerListContainers();
  }

}

class DockerLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DockerLib.type$; }

  #dockerMgr = null;

  dockerMgr() { return this.#dockerMgr; }

  __dockerMgr(it) { if (it === undefined) return this.#dockerMgr; else this.#dockerMgr = it; }

  static make() {
    const $self = new DockerLib();
    DockerLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    $self.#dockerMgr = DockerMgrActor.make($self);
    return;
  }

  rec() {
    return sys.ObjUtil.coerce(hx.HxLib.prototype.rec.call(this), DockerSettings.type$);
  }

  services() {
    return sys.List.make(DockerMgrActor.type$, [this.#dockerMgr]);
  }

  onStop() {
    this.#dockerMgr.shutdown();
    return;
  }

}

class DockerSettings extends haystack.TypedDict {
  constructor() {
    super();
    const this$ = this;
    this.#dockerDaemon = null;
    this.#ioDirMount = null;
    return;
  }

  typeof() { return DockerSettings.type$; }

  #dockerDaemon = null;

  dockerDaemon() { return this.#dockerDaemon; }

  __dockerDaemon(it) { if (it === undefined) return this.#dockerDaemon; else this.#dockerDaemon = it; }

  #ioDirMount = null;

  ioDirMount() { return this.#ioDirMount; }

  __ioDirMount(it) { if (it === undefined) return this.#ioDirMount; else this.#ioDirMount = it; }

  static make(d,f) {
    const $self = new DockerSettings();
    DockerSettings.make$($self,d,f);
    return $self;
  }

  static make$($self,d,f) {
    haystack.TypedDict.make$($self, d);
    ;
    sys.Func.call(f, $self);
    return;
  }

}

class MHxDockerContainer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MHxDockerContainer.type$; }

  #container = null;

  container() { return this.#container; }

  __container(it) { if (it === undefined) return this.#container; else this.#container = it; }

  static make(container) {
    const $self = new MHxDockerContainer();
    MHxDockerContainer.make$($self,container);
    return $self;
  }

  static make$($self,container) {
    $self.#container = container;
    return;
  }

  id() {
    return this.#container.id();
  }

  names() {
    return this.#container.names();
  }

  image() {
    return this.#container.image();
  }

  created() {
    return this.#container.createdAt();
  }

  state() {
    return this.#container.state();
  }

  network(name) {
    let e = this.#container.network(name);
    if (e == null) {
      return null;
    }
    ;
    return MHxDockerEndpoint.make(sys.ObjUtil.coerce(e, docker.EndpointSettings.type$));
  }

}

class MHxDockerEndpoint extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MHxDockerEndpoint.type$; }

  #settings = null;

  settings() { return this.#settings; }

  __settings(it) { if (it === undefined) return this.#settings; else this.#settings = it; }

  static make(settings) {
    const $self = new MHxDockerEndpoint();
    MHxDockerEndpoint.make$($self,settings);
    return $self;
  }

  static make$($self,settings) {
    $self.#settings = settings;
    return;
  }

  gateway() {
    return this.#settings.gatewayAddr();
  }

  ip() {
    return this.#settings.ipv4();
  }

  gateway6() {
    return this.#settings.gateway6();
  }

  ip6() {
    return this.#settings.ipv6();
  }

}

const p = sys.Pod.add$('hxDocker');
const xp = sys.Param.noParams$();
let m;
DockerMgrActor.type$ = p.at$('DockerMgrActor','concurrent::Actor',['hx::HxDockerService'],{},130,DockerMgrActor);
DockerFuncs.type$ = p.at$('DockerFuncs','sys::Obj',[],{},8194,DockerFuncs);
DockerContainerFeed.type$ = p.at$('DockerContainerFeed','hx::HxFeed',[],{},130,DockerContainerFeed);
DockerLib.type$ = p.at$('DockerLib','hx::HxLib',[],{},8194,DockerLib);
DockerSettings.type$ = p.at$('DockerSettings','haystack::TypedDict',[],{},8194,DockerSettings);
MHxDockerContainer.type$ = p.at$('MHxDockerContainer','sys::Obj',['hx::HxDockerContainer'],{'sys::NoDoc':""},130,MHxDockerContainer);
MHxDockerEndpoint.type$ = p.at$('MHxDockerEndpoint','sys::Obj',['hx::HxDockerEndpoint'],{'sys::NoDoc':""},130,MHxDockerEndpoint);
DockerMgrActor.type$.af$('lib',73730,'hxDocker::DockerLib',{}).af$('running',67586,'concurrent::AtomicBool',{}).af$('containers',67586,'concurrent::ConcurrentMap',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxDocker::DockerLib',false)]),{}).am$('log',2048,'sys::Log',xp,{}).am$('ids',2048,'sys::Str[]',xp,{}).am$('runAsync',271360,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('image','sys::Str',false),new sys.Param('config','sys::Obj',false)]),{}).am$('deleteContainer',271360,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{}).am$('listImages',8192,'haystack::Grid',xp,{}).am$('listContainers',8192,'haystack::Grid',xp,{}).am$('stopContainer',8192,'docker::StatusRes',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{}).am$('shutdown',8192,'sys::Void',xp,{}).am$('receive',267264,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('onRun',2048,'hx::HxDockerContainer',sys.List.make(sys.Param.type$,[new sys.Param('image','sys::Str',false),new sys.Param('config','sys::Obj',false)]),{}).am$('createContainer',2048,'docker::CreateContainerCmd',sys.List.make(sys.Param.type$,[new sys.Param('config','sys::Obj',false)]),{}).am$('onEndpointSettings',2048,'hx::HxDockerEndpoint?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('network','sys::Str',false)]),{}).am$('onListImages',2048,'haystack::Grid',xp,{}).am$('labelsToDict',34818,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('labels','[sys::Str:sys::Str]',false)]),{}).am$('onListContainers',2048,'haystack::Grid',xp,{}).am$('onStopContainer',8192,'docker::StatusRes',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{}).am$('onDeleteContainer',2048,'docker::StatusRes',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{}).am$('onShutdown',2048,'sys::Str[]',xp,{}).am$('client',128,'docker::DockerClient',xp,{}).am$('dockerConfig',128,'docker::DockerConfig',xp,{}).am$('checkManaged',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{}).am$('resToDict',34818,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('res','docker::StatusRes',false)]),{}).am$('idDis',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{}).am$('decodeCmd',2048,'docker::DockerHttpCmd',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false),new sys.Param('type','sys::Type',false)]),{}).am$('dictToMap',34818,'[sys::Str:sys::Obj?]',sys.List.make(sys.Param.type$,[new sys.Param('d','haystack::Dict',false)]),{}).am$('convertDictVal',34818,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{});
DockerFuncs.type$.am$('curHx',34818,'hx::HxContext',xp,{}).am$('lib',34818,'hxDocker::DockerLib',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',true)]),{}).am$('dockerListImages',40962,'haystack::Grid',xp,{'axon::Axon':"axon::Axon{admin=true;}"}).am$('dockerListContainers',40962,'haystack::Grid',xp,{'axon::Axon':"axon::Axon{admin=true;}"}).am$('dockerDeleteContainer',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('dockerRun',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('image','sys::Str',false),new sys.Param('config','sys::Obj',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('toRef',34818,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DockerContainerFeed.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false)]),{}).am$('poll',271360,'haystack::Grid?',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false)]),{});
DockerLib.type$.af$('dockerMgr',65666,'hxDocker::DockerMgrActor',{}).am$('make',8196,'sys::Void',xp,{}).am$('rec',271360,'hxDocker::DockerSettings',xp,{}).am$('services',271360,'hx::HxService[]',xp,{}).am$('onStop',271360,'sys::Void',xp,{});
DockerSettings.type$.af$('dockerDaemon',73730,'sys::Str?',{'haystack::TypedTag':"haystack::TypedTag{meta=\"placeholder: \\\"<host default>\\\"\\n\";}"}).af$('ioDirMount',73730,'sys::Str?',{'sys::NoDoc':"",'haystack::TypedTag':"haystack::TypedTag{meta=\"placeholder: \\\"<project default>\\\"\\n\";}"}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('d','haystack::Dict',false),new sys.Param('f','|sys::This->sys::Void|',false)]),{});
MHxDockerContainer.type$.af$('container',73730,'docker::DockerContainer',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('container','docker::DockerContainer',false)]),{}).am$('id',271360,'sys::Str',xp,{}).am$('names',271360,'sys::Str[]',xp,{}).am$('image',271360,'sys::Str',xp,{}).am$('created',271360,'sys::DateTime',xp,{}).am$('state',271360,'sys::Str',xp,{}).am$('network',271360,'hxDocker::MHxDockerEndpoint?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{});
MHxDockerEndpoint.type$.af$('settings',73730,'docker::EndpointSettings',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('settings','docker::EndpointSettings',false)]),{}).am$('gateway',271360,'inet::IpAddr?',xp,{}).am$('ip',271360,'inet::IpAddr?',xp,{}).am$('gateway6',271360,'inet::IpAddr?',xp,{}).am$('ip6',271360,'inet::IpAddr?',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxDocker");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;inet 1.0;util 1.0;haystack 3.1.11;hx 3.1.11;axon 3.1.11;docker 3.1.11");
m.set("pod.summary", "Docker management");
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
  DockerFuncs,
  DockerLib,
  DockerSettings,
};
