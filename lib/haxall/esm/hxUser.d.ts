import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as web from './web.js';
import * as haystack from './haystack.js';
import * as auth from './auth.js';
import * as def from './def.js';
import * as defc from './defc.js';
import * as axon from './axon.js';
import * as folio from './folio.js';
import * as hx from './hx.js';

export class HxUserSession extends sys.Obj implements hx.HxSession {
  static type$: sys.Type
  isCluster(): boolean;
  __isCluster(it: boolean): void;
  key(): string;
  __key(it: string): void;
  remoteAddr(): string;
  __remoteAddr(it: string): void;
  created(): sys.DateTime;
  __created(it: sys.DateTime): void;
  userAgent(): string;
  __userAgent(it: string): void;
  attestKey(): string;
  __attestKey(it: string): void;
  touched(): number;
  toStr(): string;
  touch(user: hx.HxUser): void;
  static genKey(prefix: string): string;
  isExpired(lease: sys.Duration, now: sys.Duration): boolean;
  user(): hx.HxUser;
}

export class HxUserWeb extends hx.HxLibWeb {
  static type$: sys.Type
  lib(): HxUserLib;
  static make(lib: HxUserLib, ...args: unknown[]): HxUserWeb;
  onService(): void;
}

export class HxUserSessions extends sys.Obj {
  static type$: sys.Type
  lib(): HxUserLib;
  log(): sys.Log;
  list(): sys.List<HxUserSession>;
  openCluster(req: web.WebReq, key: string, attestKey: string, user: hx.HxUser): HxUserSession;
  onHouseKeeping(): void;
  get(key: string, checked?: boolean): HxUserSession | null;
  static make(lib: HxUserLib, ...args: unknown[]): HxUserSessions;
  close(session: HxUserSession): void;
  open(req: web.WebReq, user: hx.HxUser): HxUserSession;
}

export class HxUserUtil extends sys.Obj {
  static type$: sys.Type
  static dictToAuthMsg(userAuth: haystack.Dict, checked?: boolean): auth.AuthMsg | null;
  static updatePassword(db: folio.Folio, rec: haystack.Dict, pass: string): void;
  static addUser(db: folio.Folio, user: string, pass: string, tags: sys.Map<string, sys.JsObj>): hx.HxUser;
  static authMsgToDict(msg: auth.AuthMsg): haystack.Dict;
  static make(...args: unknown[]): HxUserUtil;
}

export class HxUserSettings extends haystack.TypedDict {
  static type$: sys.Type
  maxSessions(): number;
  __maxSessions(it: number): void;
  static make(d: haystack.Dict, f: ((arg0: HxUserSettings) => void), ...args: unknown[]): HxUserSettings;
}

export class HxUserImpl extends sys.Obj implements hx.HxUser {
  static type$: sys.Type
  mod(): sys.DateTime;
  access(): hx.HxUserAccess;
  isAdmin(): boolean;
  dis(): string;
  meta(): haystack.Dict;
  id(): haystack.Ref;
  isSu(): boolean;
  email(): string | null;
  username(): string;
  toStr(): string;
  static make(meta: haystack.Dict, ...args: unknown[]): HxUserImpl;
}

export class HxUserLib extends hx.HxLib implements hx.HxUserService {
  static type$: sys.Type
  loginUri(): sys.Uri;
  web(): HxUserWeb;
  sessions(): HxUserSessions;
  logoutUri(): sys.Uri;
  noAuth(): boolean;
  authenticate(req: web.WebReq, res: web.WebRes): hx.HxContext | null;
  rec(): HxUserSettings;
  onStart(): void;
  closeSession(session: hx.HxSession): void;
  static make(...args: unknown[]): HxUserLib;
  cookieName(): string;
  read(username: sys.JsObj, checked?: boolean): hx.HxUser | null;
  makeSyntheticUser(username: string, extra?: sys.JsObj | null): hx.HxUser;
  services(): sys.List<hx.HxService>;
  onHouseKeeping(): void;
  houseKeepingFreq(): sys.Duration | null;
}

export class HxUserFuncs extends sys.Obj {
  static type$: sys.Type
  static make(...args: unknown[]): HxUserFuncs;
}

