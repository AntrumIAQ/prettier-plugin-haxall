import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as inet from './inet.js';
import * as util from './util.js';
import * as haystack from './haystack.js';
import * as hx from './hx.js';
import * as axon from './axon.js';
import * as docker from './docker.js';

/**
 * DockerSettings
 */
export class DockerSettings extends haystack.TypedDict {
  static type$: sys.Type
  /**
   * Docker daemon URI to connect to. If unspecified, then the
   * host default will be used.
   * - `npipe:////./pipe/docker_engine` (Windows named pipe)
   * - `unix:///var/run/docker.sock` (Unix domain socket)
   * - `tcp://localhost:2375` (TCP/HTTP access)
   */
  dockerDaemon(): string | null;
  __dockerDaemon(it: string | null): void;
  /**
   * Constructor
   */
  static make(d: haystack.Dict, f: ((arg0: DockerSettings) => void), ...args: unknown[]): DockerSettings;
}

/**
 * Docker lib Axon functions
 */
export class DockerFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Kill and remove a container.
   */
  static dockerDeleteContainer(id: sys.JsObj): haystack.Dict;
  static dockerRun(image: string, config?: sys.JsObj): string;
  static dockerListContainers(): haystack.Grid;
  static dockerListImages(): haystack.Grid;
  static make(...args: unknown[]): DockerFuncs;
}

/**
 * Docker image management
 */
export class DockerLib extends hx.HxLib {
  static type$: sys.Type
  /**
   * Settings record
   */
  rec(): DockerSettings;
  static make(...args: unknown[]): DockerLib;
  /**
   * Stop callback
   */
  onStop(): void;
  /**
   * Publish the HxDockerService
   */
  services(): sys.List<hx.HxService>;
}

