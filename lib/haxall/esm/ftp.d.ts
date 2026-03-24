import * as sys from './sys.js';
import * as inet from './inet.js';

export class FtpErr extends sys.Err {
  static type$: sys.Type
  code(): number;
  static make(code: number, msg: string | null, cause?: sys.Err | null, ...args: unknown[]): FtpErr;
}

export class FtpClient extends sys.Obj {
  static type$: sys.Type
  log(): sys.Log;
  log(it: sys.Log): void;
  rmdir(uri: sys.Uri): sys.Uri;
  delete(uri: sys.Uri): sys.Uri;
  static make(username?: string, password?: string, ...args: unknown[]): FtpClient;
  write(uri: sys.Uri): sys.OutStream;
  mkdir(uri: sys.Uri, checked?: boolean): sys.Uri;
  read(uri: sys.Uri): sys.InStream;
  list(uri: sys.Uri): sys.List<sys.Uri>;
}

export class Main extends sys.Obj {
  static type$: sys.Type
  static main(args: sys.List<string>): void;
  static make(...args: unknown[]): Main;
}

