import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as inet from './inet.js';
import * as web from './web.js';
import * as wisp from './wisp.js';
import * as util from './util.js';

/**
 * AuthReqErr
 */
export class AuthReqErr extends sys.Err {
  static type$: sys.Type
  /**
   * Raw error information
   */
  params(): sys.Map<string, string>;
  toStr(): string;
  error(): string;
  static make(params: sys.Map<string, string>, cause?: sys.Err | null, ...args: unknown[]): AuthReqErr;
  desc(): string;
}

export class OAuthErr extends sys.Err {
  static type$: sys.Type
  code(): number;
  body(): string;
  toStr(): string;
  static make(c: web.WebClient, ...args: unknown[]): OAuthErr;
}

/**
 * OAuthClient
 */
export class OAuthClient extends sys.Obj {
  static type$: sys.Type
  /**
   * Utility to obtain a raw WebClient with uri, method, and
   * headers set (including Bearer token)
   */
  prepare(method: string, uri: sys.Uri, headers?: sys.Map<string, string>): web.WebClient;
  /**
   * Create a basic OAuthClient with the given access token.
   * Token refresh is not supported.
   */
  static make(token: AccessToken, ...args: unknown[]): OAuthClient;
  /**
   * Create an OAuthClient that supports token refresh. The
   * tokenUri is the endpoint to use to refresh the token. The
   * params must at least include the `client_id` parameter.
   */
  static makeRefreshable(token: AccessToken, tokenUri: sys.Uri, params: sys.Map<string, string>, ...args: unknown[]): OAuthClient;
  /**
   * Do an HTTP request with the given method (GET, PUT, etc.) to
   * the given URI. You can also pass additional headers to
   * include with the request. This method will handle OAuth
   * token refresh.
   * 
   * If the `req` parameter is non-null, it will be first be
   * converted to a File as described below and then written as
   * the request body (see WebClient.writeFile).
   * - File: no conversion done, file is written as-is
   * - Buf: converted to a File using Buf.toFile. The Content-Type
   *   will be `application/octet-stream`.
   * - Map: encoded to JSON and written as a File with `.json` ext.
   * 
   * Returns a WebClient in a state where {@link web.WebClient.readRes | web::WebClient.readRes}
   * has been called and the {@link web.WebClient.resIn | web::WebClient.resIn}
   * is available for reading.
   */
  call(method: string, uri: sys.Uri, req?: sys.JsObj | null, headers?: sys.Map<string, string>): web.WebClient;
}

/**
 * Token Request for the Authorization Code grant type.
 */
export class AuthCodeTokenReq extends TokenReq {
  static type$: sys.Type
  grantType(): string;
  grant(req: AuthReq, flowParams: sys.Map<string, string>): AccessToken;
  static make(tokenUri: sys.Uri, customParams?: sys.Map<string, string>, ...args: unknown[]): AuthCodeTokenReq;
}

/**
 * Base class for all Token Requests
 */
export class TokenReq extends sys.Obj {
  static type$: sys.Type
  customParams(): sys.Map<string, string>;
  tokenUri(): sys.Uri;
  build(): sys.Map<string, string>;
  grantType(): string;
  grant(authReq: AuthReq, flowParams: sys.Map<string, string>): AccessToken;
  /**
   * Construct a TokenReq. The tokenUri is the endpoint for doing
   * the token request. You may specify additional custom
   * parameters that should be included in the token request
   * also.
   */
  static make(tokenUri: sys.Uri, customParams?: sys.Map<string, string>, ...args: unknown[]): TokenReq;
}

/**
 * Raw Access Token - Allows you to construct an access token
 * explicitly and set all fields.
 */
export class RawAccessToken extends sys.Obj implements AccessToken {
  static type$: sys.Type
  accessToken(): string;
  __accessToken(it: string): void;
  expiresIn(): sys.Duration | null;
  __expiresIn(it: sys.Duration | null): void;
  scope(): sys.List<string>;
  __scope(it: sys.List<string>): void;
  tokenType(): string;
  __tokenType(it: string): void;
  refreshToken(): string | null;
  __refreshToken(it: string | null): void;
  toStr(): string;
  static make(accessToken: string, f?: ((arg0: RawAccessToken) => void) | null, ...args: unknown[]): RawAccessToken;
  /**
   * Return true if the token includes a refresh token
   */
  hasRefreshToken(): boolean;
}

/**
 * If the authorization server is configured to redirect to the
 * localhost, then this class can be used to do an
 * authorization request. It will open a browser window for the
 * user to authorize access with the remote authorization
 * server. It will spawn a web server on the localhost to
 * handle the redirect that the authorization server will do
 * after the authorization access is granted or denied. It
 * granted, we grabe the authorization code from the spawned
 * web server so that the authorization code grant flow can
 * continue.
 */
export class LoopbackAuthReq extends AuthReq {
  static type$: sys.Type
  responseType(): string;
  __responseType(it: string): void;
  static make(authUri: sys.Uri, clientId: string, f?: ((arg0: LoopbackAuthReq) => void) | null, ...args: unknown[]): LoopbackAuthReq;
  authorize(flowParams: sys.Map<string, string>): sys.Map<string, string>;
}

/**
 * An OAuth2 access token
 */
export abstract class AccessToken extends sys.Obj {
  static type$: sys.Type
  /**
   * The acces token
   */
  accessToken(): string;
  /**
   * Return true if the token includes a refresh token
   */
  hasRefreshToken(): boolean;
  /**
   * How long until the token expires (if specified by the
   * server)
   */
  expiresIn(): sys.Duration | null;
  /**
   * The scopes for the token
   */
  scope(): sys.List<string>;
  /**
   * The access token type (e.g. "Bearer")
   */
  tokenType(): string;
  /**
   * Get the refresh token if one is present
   */
  refreshToken(): string | null;
}

/**
 * Implement the Authorization Code grant type
 */
export class AuthCodeGrant extends sys.Obj {
  static type$: sys.Type
  authReq(): AuthReq;
  tokenReq(): TokenReq;
  /**
   * Runs the OAuth flow to get an OAuthClient.
   */
  client(): OAuthClient;
  /**
   * Configure the authorization code grant with an {@link AuthReq | Authorization
   * Request} and a {@link AuthCodeTokenReq | Token Request}.
   */
  static make(authReq: AuthReq, tokenReq: AuthCodeTokenReq, ...args: unknown[]): AuthCodeGrant;
}

/**
 * Base class for Authorization Code requests
 */
export class AuthReq extends sys.Obj {
  static type$: sys.Type
  redirectUri(): sys.Uri | null;
  __redirectUri(it: sys.Uri | null): void;
  clientId(): string;
  __clientId(it: string): void;
  customParams(): sys.Map<string, string>;
  __customParams(it: sys.Map<string, string>): void;
  authUri(): sys.Uri;
  __authUri(it: sys.Uri): void;
  scopes(): sys.List<string> | null;
  __scopes(it: sys.List<string> | null): void;
  responseType(): string;
  build(): sys.Map<string, string>;
  static make(authUri: sys.Uri, clientId: string, f?: ((arg0: AuthReq) => void) | null, ...args: unknown[]): AuthReq;
  authorize(flowParams: sys.Map<string, string>): sys.Map<string, string>;
}

/**
 * JSON Access Token (RFC 6749 §5.1)
 */
export class JsonAccessToken extends sys.Obj implements AccessToken {
  static type$: sys.Type
  json(): sys.Map<string, sys.JsObj | null>;
  toStr(): string;
  accessToken(): string;
  expiresIn(): sys.Duration | null;
  static fromStr(json: string, ...args: unknown[]): JsonAccessToken;
  scope(): sys.List<string>;
  tokenType(): string;
  static make(json: sys.Map<string, sys.JsObj | null>, ...args: unknown[]): JsonAccessToken;
  refreshToken(): string | null;
  /**
   * Return true if the token includes a refresh token
   */
  hasRefreshToken(): boolean;
}

