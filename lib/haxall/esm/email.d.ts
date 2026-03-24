import * as sys from './sys.js';
import * as inet from './inet.js';

/**
 * Email models a top level MIME message.
 * 
 * See [pod doc](pod-doc) and [examples](examples::email-sending).
 */
export class Email extends sys.Obj {
  static type$: sys.Type
  /**
   * List of "cc" email addresses. See {@link MimeUtil.toAddrSpec | MimeUtil.toAddrSpec}
   * for address formatting.
   */
  cc(): sys.List<string> | null;
  cc(it: sys.List<string> | null): void;
  /**
   * List of "bcc" email addresses. See {@link MimeUtil.toAddrSpec | MimeUtil.toAddrSpec}
   * for address formatting.
   */
  bcc(): sys.List<string> | null;
  bcc(it: sys.List<string> | null): void;
  /**
   * Subject of the email.  This string can be any Unicode and is
   * automatically translated into an encoded word.
   */
  subject(): string;
  subject(it: string): void;
  /**
   * Unique identifier for message (auto-generated).
   */
  msgId(): string;
  msgId(it: string): void;
  /**
   * Body of the email - typically an instance of {@link TextPart | TextPart}
   * or {@link MultiPart | MultiPart}.
   */
  body(): EmailPart | null;
  body(it: EmailPart | null): void;
  /**
   * Reply-To email address.
   */
  replyTo(): string | null;
  replyTo(it: string | null): void;
  /**
   * From email address. See {@link MimeUtil.toAddrSpec | MimeUtil.toAddrSpec}
   * for address formatting.
   */
  from(): string | null;
  from(it: string | null): void;
  /**
   * List of "to" email addresses. See {@link MimeUtil.toAddrSpec | MimeUtil.toAddrSpec}
   * for address formatting.
   */
  to(): sys.List<string> | null;
  to(it: sys.List<string> | null): void;
  /**
   * Encode as a MIME message according to RFC 822.
   */
  encode(out: sys.OutStream): void;
  /**
   * Return the aggregation of {@link to | to}, {@link cc | cc},
   * and {@link bcc | bcc}.
   */
  recipients(): sys.List<string>;
  static make(...args: unknown[]): Email;
  /**
   * Validate this email message - throw Err if not configured
   * correctly.
   */
  validate(): void;
}

/**
 * Utilities to deal with all the idiosyncrasies of MIME.
 */
export class MimeUtil extends sys.Obj {
  static type$: sys.Type
  /**
   * Return the addr-spec or "local@domain" part of an email
   * address string.  The result is always returned as "<addr>".
   * The addresses may be formatted with or without a display
   * name:
   * ```
   * bob@acme.com                =>  <bob@acme.com>
   * Bob Smith <bob@acme.com>    =>  <bob@acme.com>
   * "Bob Smith" <bob@acme.com>  =>  <bob@acme.com>
   * ```
   */
  static toAddrSpec(addr: string): string;
  /**
   * Encode the specified text into a "encoded word" according to
   * RFC 2047.  If text is pure ASCII, then it is returned as is.
   * Otherwise encode using UTF-8 Base64.
   */
  static toEncodedWord(text: string): string;
  static make(...args: unknown[]): MimeUtil;
}

/**
 * FilePart is used to transfer binary content from a File.
 */
export class FilePart extends EmailPart {
  static type$: sys.Type
  /**
   * File content
   */
  file(): sys.File | null;
  file(it: sys.File | null): void;
  /**
   * Encode as a MIME message according to RFC 822.
   */
  encode(out: sys.OutStream): void;
  /**
   * Construct with default type of "text/plain".
   */
  static make(...args: unknown[]): FilePart;
  /**
   * Validate this part - throw Err if not configured correctly:
   * - file must be non-null
   * - if Content-Type not set, defaults to file.mimeType
   * - if Content-Type name param not set, defaults to file.name
   * - Content-Transfer-Encoding must be base64
   */
  validate(): void;
}

/**
 * SmtpErr indicates an error during an SMTP transaction.
 */
export class SmtpErr extends sys.Err {
  static type$: sys.Type
  /**
   * The SMTP error code defined by RFC 2821
   */
  code(): number;
  /**
   * Construct with error code, message, and optional cause.
   */
  static make(code: number, msg: string | null, cause?: sys.Err | null, ...args: unknown[]): SmtpErr;
}

/**
 * SmtpClient implements the client side of SMTP (Simple Mail
 * Transport Protocol) as specified by RFC 2821.
 * 
 * See [pod doc](pod-doc) and [examples](examples::email-sending).
 */
export class SmtpClient extends sys.Obj {
  static type$: sys.Type
  /**
   * Open connection using SSL/TLS (ensure port is configured
   * properly). If false then the connection is opened plaintext,
   * but may still be upgraded to TLS if server specifies
   * STARTTLS.
   */
  ssl(): boolean;
  ssl(it: boolean): void;
  /**
   * The {@link inet.SocketConfig | inet::SocketConfig} to use for
   * creating sockets.
   */
  socketConfig(): inet.SocketConfig;
  socketConfig(it: inet.SocketConfig): void;
  /**
   * Password to use for authentication, or null to skip
   * authentication.
   */
  password(): string | null;
  password(it: string | null): void;
  /**
   * DNS hostname of server.
   */
  host(): string | null;
  host(it: string | null): void;
  /**
   * TCP port number of server, defaults to 25.
   */
  port(): number;
  port(it: number): void;
  /**
   * Username to use for authentication, or null to skip
   * authentication.
   */
  username(): string | null;
  username(it: string | null): void;
  /**
   * Authenticate using the strongest mechanism which both the
   * server and myself support.
   */
  authenticate(): void;
  /**
   * Authenticate using CRAM-MD5 mechanism.
   */
  authCramMd5(): void;
  /**
   * Close the session to the SMTP server.  Do nothing if session
   * already closed.
   */
  close(): void;
  static make(...args: unknown[]): SmtpClient;
  /**
   * Authenticate using LOGIN mechanism.
   */
  authLogin(): void;
  /**
   * Return true if there is no open session.
   */
  isClosed(): boolean;
  /**
   * Send the email to the SMTP server.  Throw SmtpErr if there
   * is a protocol error.  Throw IOErr if there is a networking
   * problem.  If the session is closed, then this call
   * automatically opens the session and guarantees a close after
   * it is complete.
   */
  send(email: Email): void;
  /**
   * Open a session to the SMTP server.  If username and password
   * are configured, then SMTP authentication is attempted. 
   * Throw SmtpErr if there is a protocol error. Throw IOErr is
   * there is a network problem.
   */
  open(): void;
  /**
   * Authenticate using PLAIN mechanism.
   */
  authPlain(): void;
}

/**
 * MultiPart is used to model a multipart MIME type.  The
 * default is "multipart/mixed".
 */
export class MultiPart extends EmailPart {
  static type$: sys.Type
  /**
   * The sub-parts of this multipart.
   */
  parts(): sys.List<EmailPart>;
  parts(it: sys.List<EmailPart>): void;
  /**
   * Encode as a MIME message according to RFC 822.
   */
  encode(out: sys.OutStream): void;
  /**
   * Construct with default type of "multipart/mixed".
   */
  static make(...args: unknown[]): MultiPart;
  /**
   * Validate this part - throw Err if not configured correctly:
   * - must have at least one part
   * - Content-Type must be defined
   * - if Content-Type doesn't define boundary, one is
   *   auto-generated
   */
  validate(): void;
}

/**
 * EmailPart is the base class for parts within a multipart
 * MIME document.
 * 
 * See [pod doc](pod-doc) and [examples](examples::email-sending).
 */
export class EmailPart extends sys.Obj {
  static type$: sys.Type
  /**
   * Map of headers.  The header map is case insensitive.
   */
  headers(): sys.Map<string, string>;
  headers(it: sys.Map<string, string>): void;
  /**
   * Encode as a MIME message according to RFC 822.  The base
   * class encodes the headers - subclasses should override to
   * call super and then encode the part's content.
   */
  encode(out: sys.OutStream): void;
  static make(...args: unknown[]): EmailPart;
  /**
   * Validate this part - throw Err if not configured correctly.
   */
  validate(): void;
}

/**
 * TextPart is used to model email parts with a text MIME type.
 * The default is "text/plain".
 */
export class TextPart extends EmailPart {
  static type$: sys.Type
  /**
   * Text body of the email part.
   */
  text(): string;
  text(it: string): void;
  /**
   * Encode as a MIME message according to RFC 822.
   */
  encode(out: sys.OutStream): void;
  /**
   * Construct with default type of "text/plain".
   */
  static make(...args: unknown[]): TextPart;
  /**
   * Validate this part - throw Err if not configured correctly:
   * - text must be non-null
   * - Content-Type must be defined
   * - if Content-Type charset not defined, defaults to utf-8
   * - Content-Transfer-Encoding must be 8bit unless using us-ascii
   */
  validate(): void;
}

/**
 * MimeUtilTest
 */
export class MimeUtilTest extends sys.Test {
  static type$: sys.Type
  testEncodedWord(): void;
  testToAddrSpec(): void;
  static make(...args: unknown[]): MimeUtilTest;
}

/**
 * EmailTest
 */
export class EmailTest extends sys.Test {
  static type$: sys.Type
  testValidate(): void;
  static make(...args: unknown[]): EmailTest;
  makeVal(): Email;
}

