import * as sys from './sys.js';
import * as compiler from './compiler.js';
import * as compilerEs from './compilerEs.js';
import * as fandoc from './fandoc.js';
import * as util from './util.js';

export class GenTsDecl extends sys.Obj {
  static type$: sys.Type
  run(): void;
  static make(out: sys.OutStream, pod: compiler.CPod, opts: sys.Map<string, sys.JsObj | null>, ...args: unknown[]): GenTsDecl;
  static genForPod(pod: sys.Pod, out: sys.OutStream, opts?: sys.Map<string, sys.JsObj | null>): void;
}

export class TsDocWriter extends sys.Obj implements fandoc.DocWriter {
  static type$: sys.Type
  pod(): string;
  pod(it: string): void;
  indent(): number;
  indent(it: number): void;
  type(): string;
  type(it: string): void;
  docStart(doc: fandoc.Doc): void;
  elemStart(elem: fandoc.DocElem): void;
  text(text: fandoc.DocText): void;
  static make(out: sys.OutStream, ...args: unknown[]): TsDocWriter;
  docEnd(doc: fandoc.Doc): void;
  elemEnd(elem: fandoc.DocElem): void;
}

export class NodeJsCmd extends util.AbstractMain {
  static type$: sys.Type
  dir(): sys.File;
  dir(it: sys.File): void;
  cjs(): boolean;
  cjs(it: boolean): void;
  verbose(): boolean;
  verbose(it: boolean): void;
  aliases(): sys.List<string>;
  log(): sys.Log;
  run(): number;
  static find(name: string): NodeJsCmd | null;
  static make(...args: unknown[]): NodeJsCmd;
  summary(): string;
  printLine(line?: string): void;
  err(msg: string): number;
  appName(): string;
  ms(): compilerEs.ModuleSystem;
  static list(): sys.List<NodeJsCmd>;
  name(): string;
}

export class Main extends sys.Obj {
  static type$: sys.Type
  static main(args: sys.List<string>): number;
  static make(...args: unknown[]): Main;
}

