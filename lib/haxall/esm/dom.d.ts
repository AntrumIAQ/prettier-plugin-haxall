import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as graphics from './graphics.js';
import * as web from './web.js';

/**
 * WeakMap is a collection of key/value pairs in which the keys
 * are weakly referenced.  The keys must be objects and the
 * values can be arbitrary values.
 */
export class WeakMap extends sys.Obj {
  static type$: sys.Type
  /**
   * Sets value for given key in this map.  Returns this.
   */
  set(key: sys.JsObj, val: sys.JsObj): this;
  /**
   * Removes any value associated to the key. Returns `true` if an
   * element has been removed successfully.
   */
  delete(key: sys.JsObj): boolean;
  /**
   * Returns the value associated to the key, or `null` if there is
   * none.
   */
  get(key: sys.JsObj): sys.JsObj | null;
  /**
   * Return `true` if key exists in this map.
   */
  has(key: sys.JsObj): boolean;
  static make(...args: unknown[]): WeakMap;
}

/**
 * DomFile models a DOM File object.
 */
export class DomFile extends sys.Obj {
  static type$: sys.Type
  /**
   * Return file name extension (everything after the last dot)
   * or `null` name has no dot.
   */
  ext(): string | null;
  /**
   * Asynchronously load file contents as text and invoke the
   * callback function with results.
   */
  readAsText(f: ((arg0: string) => void)): void;
  /**
   * MIME type of the file as a read-only string or "" if the
   * type could not be determined.
   */
  type(): string;
  /**
   * Size of file in bytes.
   */
  size(): number;
  /**
   * Asynchronously load file contents as a `data:` URI
   * representing the file's contents.
   */
  readAsDataUri(f: ((arg0: sys.Uri) => void)): void;
  /**
   * Name of file. This is just the file name, and does not
   * include any path information.
   */
  name(): string;
  static make(...args: unknown[]): DomFile;
}

/**
 * Elem models a DOM element object.
 * 
 * See [pod doc](pod-doc#elem) for details.
 */
export class Elem extends sys.Obj {
  static type$: sys.Type
  /**
   * The HTML markup contained in this element.
   */
  html(): string;
  html(it: string): void;
  /**
   * The id for this element. Returns `null` if id is not defined.
   */
  id(): string | null;
  id(it: string | null): void;
  /**
   * Text content contained in this element.
   */
  text(): string;
  text(it: string): void;
  /**
   * Top left scroll position of element.
   */
  scrollPos(): graphics.Point;
  scrollPos(it: graphics.Point): void;
  /**
   * Size of element in pixels.
   */
  size(): graphics.Size;
  size(it: graphics.Size): void;
  /**
   * The enabled attribute for this element, or null if one not
   * applicable.  This is typically only valid for form elements.
   */
  enabled(): boolean | null;
  enabled(it: boolean | null): void;
  /**
   * Position of element relative to its parent in pixels.
   */
  pos(): graphics.Point;
  pos(it: graphics.Point): void;
  /**
   * Get the parent Elem of this element, or null if this element
   * has no parent.
   */
  parent(): Elem | null;
  /**
   * Return `true` if {@link children | children} is non-zero, `false`
   * otherwise.
   */
  hasChildren(): boolean;
  /**
   * Replace existing child node with a new child.  Returns this.
   */
  replace(oldChild: Elem, newChild: Elem): this;
  /**
   * Request keyboard focus on this elem.
   */
  focus(): void;
  /**
   * Invoke the given native DOM function with optional
   * arguments.
   */
  invoke(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Get the next sibling to this element, or null if this is the
   * last element under its parent.
   */
  nextSibling(): Elem | null;
  /**
   * Stop the current animation on this element, or do nothing if
   * no animation in progress.
   */
  animateStop(): void;
  /**
   * Insert a new element as a child to this element before the
   * specified reference element.  The reference element must be
   * a child of this element. Returns this.
   */
  insertBefore(child: Elem, ref: Elem): this;
  /**
   * Remove all children from this element. Returns this.
   */
  removeAll(): this;
  /**
   * Get the child nodes of this element.
   */
  children(): sys.List<Elem>;
  /**
   * Get the first child node of this element, or null if this
   * element has no children.
   */
  firstChild(): Elem | null;
  /**
   * The `trap` operator will behave slightly differently based on
   * the namespace of the element.
   * 
   * For HTML elements, `trap` works as a convenience for {@link prop | prop}
   * and {@link setProp | setProp}:
   * ```
   * div := Elem("div")
   * div->tabIndex = 0   // equivalent to div.setProp("tabIndex", 0)
   * ```
   * 
   * For SVG elements (where {@link ns | ns} is ``http://www.w3.org/2000/svg``),
   * `trap` routes to {@link attr | attr} and {@link setAttr | setAttr}:
   * ```
   * svg := Svg.line(0, 0, 10, 10)
   * svg->x1 = 5      // equivalent to svg.setAttr("x1", "5")
   * svg->y1 = 5      // equivalent to svg.setAttr("y1", "5")
   * svg->x2 == "10"  // equivalent to svg.attr("x2")
   * ```
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Start an animation on this element using the given key
   * frames.
   * ```
   * frames := KeyFrames([
   *   KeyFrame("0%",   ["transform": "scale(1)"]),
   *   KeyFrame("50%",  ["transform": "scale(1.1)"]),
   *   KeyFrame("100%", ["transform": "scale(1)"]),
   * ])
   * 
   * animate(frames, null, 5sec)
   * animate(frames, ["animation-iteration-count":"infinite"], 1sec)
   * ```
   */
  animateStart(frames: KeyFrames, opts: sys.Map<string, sys.JsObj> | null, dur: sys.Duration): void;
  /**
   * Scrollable size of element.
   */
  scrollSize(): graphics.Size;
  /**
   * Add a new element as a child to this element. Return this.
   */
  add(child: Elem): this;
  /**
   * Set the given DOM properity value for this element.
   */
  setProp(name: string, val: sys.JsObj | null): this;
  /**
   * Return `true` if given element is a descendant of this node,
   * or `false` if not.
   */
  containsChild(elem: Elem): boolean;
  /**
   * Get `name:value` map of all attributes.
   */
  attrs(): sys.Map<string, string>;
  /**
   * Given a page position, return `p` relative to this element.
   */
  relPos(p: graphics.Point): graphics.Point;
  /**
   * Get the Style instance for this element.
   */
  style(): Style;
  /**
   * Set the given HTML attribute value for this element. If `val`
   * is `null` the attribute is removed (see {@link removeAttr | removeAttr}).
   * Optionally a namespace can be specified with `ns`.
   */
  setAttr(name: string, val: string | null, ns?: sys.Uri | null): this;
  /**
   * Create an {@link Elem | Elem} instance from a HTML string.
   * This is equivlaent
   * ```
   * elem := Elem { it.html=html }.firstChild
   * ```
   */
  static fromHtml(html: string): Elem;
  /**
   * The namespace URI of this element.
   */
  ns(): sys.Uri;
  /**
   * Returns a list of all elements descended from this element
   * on which it is invoked that match the specified group of CSS
   * selectors.
   */
  querySelectorAll(selectors: string): sys.List<Elem>;
  /**
   * Remove focus from this elem.
   */
  blur(): void;
  /**
   * Remove a child element from this element. Return this.
   */
  remove(child: Elem): this;
  /**
   * Paint a `<canvas>` element.  The given callback is invoked
   * with a graphics context to perform the rendering operation.
   */
  renderCanvas(f: ((arg0: graphics.Graphics) => void)): void;
  /**
   * Scroll parent container so this Elem is visible to user. If `alignToTop`
   * is `true` (the default value), the top of Elem is aligned to
   * top of the visible area.  If `false`, the bottom of Elem is
   * aligned to bottom of the visible area.
   */
  scrollIntoView(alignToTop?: boolean): this;
  /**
   * Get the last child node of this element, or null if this
   * element has no children.
   */
  lastChild(): Elem | null;
  /**
   * Convenience for {@link attr | attr}.
   */
  get(name: string): sys.JsObj | null;
  /**
   * Get the given DOM property value for this element. Returns `null`
   * if property does not exist.
   */
  prop(name: string): sys.JsObj | null;
  /**
   * Get the given HTML attribute value for this element. Returns
   * `null` if attribute not defined.
   */
  attr(name: string): string | null;
  /**
   * Return true if this elem has focus.
   */
  hasFocus(): boolean;
  /**
   * Create a new Elem in the current Doc. Optionally a namespace
   * can be specified with `ns`.
   */
  static make(tagName?: string, ns?: sys.Uri | null, ...args: unknown[]): Elem;
  /**
   * Position of element relative to the whole document.
   */
  pagePos(): graphics.Point;
  /**
   * Conveneince for {@link setAttr | setAttr}.
   */
  set(name: string, val: string | null): void;
  /**
   * Remove the given event handler from this element.  If this
   * handler was not registered, this method does nothing.
   */
  removeEvent(type: string, useCapture: boolean, handler: Function): void;
  /**
   * Remove the given HTML attribute from this element.
   */
  removeAttr(name: string): this;
  /**
   * Returns the first element that is a descendant of this
   * element on which it is invoked that matches the specified
   * group of selectors.
   */
  querySelector(selectors: string): Elem | null;
  /**
   * Create an {@link Elem | Elem} instance from a native
   * JavaScript DOM object. The `type` may be specified to create a
   * subclass instance of Elem.  Note if the native instance has
   * already been mapped to Fantom, the existing instance is
   * returned and `type` will have no effect.
   */
  static fromNative(elem: any, type?: sys.Type): Elem;
  /**
   * Get the tag name for this element.
   */
  tagName(): string;
  /**
   * Transition a set of CSS properties.
   * ```
   * transition(["opacity": "0.5"], null, 1sec) { echo("done!") }
   * transition(["opacity": "0.5"], ["transition-delay": 500ms], 1sec) { echo("done!") }
   * ```
   */
  transition(props: sys.Map<string, sys.JsObj>, opts: sys.Map<string, sys.JsObj> | null, dur: sys.Duration, onComplete?: ((arg0: Elem) => void) | null): void;
  /**
   * Add all elements to this element.  Returns this.
   */
  addAll(elems: sys.List<Elem>): this;
  /**
   * Attach an event handler for the given event on this element.
   * Returns callback function instance.
   */
  onEvent(type: string, useCapture: boolean, handler: ((arg0: Event) => void)): Function;
  /**
   * Return a duplicate of this node.
   */
  clone(deep?: boolean): Elem;
  /**
   * Get the previous sibling to this element, or null if this is
   * the first element under its parent.
   */
  prevSibling(): Elem | null;
  /**
   * Traverses this element and its parents (heading toward the
   * document root) until it finds a node that matches the
   * specified CSS selector.  Returns `null` if none found.
   */
  closest(selectors: string): Elem | null;
}

/**
 * HttpRes models the response side of an XMLHttpRequest
 * instance.
 * 
 * See [pod doc](pod-doc#xhr) for details.
 */
export class HttpRes extends sys.Obj {
  static type$: sys.Type
  /**
   * The response headers.
   */
  headers(): sys.Map<string, string>;
  headers(it: sys.Map<string, string>): void;
  /**
   * The text content of the response when the XMLHttpRequest {@link HttpReq.resType | HttpReq.resType}
   * is "text"
   */
  content(): string;
  content(it: string): void;
  /**
   * The binary content of the response when the XMLHttpRequest {@link HttpReq.resType | HttpReq.resType}
   * is "arraybuffer"
   */
  contentBuf(): sys.Buf;
  contentBuf(it: sys.Buf): void;
  /**
   * The HTTP status code of the response.
   */
  status(): number;
  status(it: number): void;
}

/**
 * The DataTransfer object is used to hold the data that is
 * being dragged during a drag and drop operation.
 */
export class DataTransfer extends sys.Obj {
  static type$: sys.Type
  /**
   * The effects that are allowed for this drag.
   */
  effectAllowed(): string;
  effectAllowed(it: string): void;
  /**
   * The effect used for drop targets.
   */
  dropEffect(): string;
  dropEffect(it: string): void;
  /**
   * List of the format types of data, in the same order the data
   * was added.
   */
  types(): sys.List<string>;
  /**
   * Set data for given MIME type.
   */
  setData(type: string, val: string): this;
  /**
   * List of local files available on the data transfer, or empty
   * list if this drag operation doesn't involve dragging files.
   */
  files(): sys.List<DomFile>;
  /**
   * Set a custom image to be used for dragging, where `x` and `y`
   * are offsets from the mouse cursor position.
   */
  setDragImage(image: Elem, x: number, y: number): this;
  static make(...args: unknown[]): DataTransfer;
  /**
   * Get data for given MIME type, or an empty string if data for
   * that type does not exist or the data transfer contains no
   * data.
   */
  getData(type: string): string;
}

/**
 * Doc models the DOM document object.
 * 
 * See [pod doc](pod-doc#doc) for details.
 */
export class Doc extends sys.Obj {
  static type$: sys.Type
  /**
   * The title of this document.
   */
  title(): string;
  title(it: string): void;
  /**
   * Returns a list of the elements within the document (using
   * depth-first pre-order traversal of the document's nodes)
   * that match the specified group of selectors.
   */
  querySelectorAll(selectors: string): sys.List<Elem>;
  /**
   * Get a list of all elements at the specified coordinates
   * (relative to the viewport). The elements are ordered from
   * the topmost to the bottommost box of the viewport.
   */
  elemsFromPos(p: graphics.Point): sys.List<Elem>;
  /**
   * Get the body element.
   */
  body(): Elem;
  /**
   * Map of cookie values keyed by cookie name.  The cookies map
   * is readonly and case insensitive.
   */
  cookies(): sys.Map<string, string>;
  /**
   * Return a WebOutStream for writing content into this
   * document. You should call `close` on the stream when done
   * writing to notify browser load is complete.
   */
  out(): web.WebOutStream;
  /**
   * Get the head element.
   */
  head(): Elem;
  /**
   * Add a cookie to this session.
   */
  addCookie(c: web.Cookie): void;
  /**
   * Get the topmost element at the specified coordinates
   * (relative to the viewport), or `null` if none found.
   */
  elemFromPos(p: graphics.Point): Elem | null;
  /**
   * Remove the given event handler from this document.  If this
   * handler was not registered, this method does nothing.
   */
  removeEvent(type: string, useCapture: boolean, handler: Function): void;
  /**
   * Returns the first element within the document (using
   * depth-first pre-order traversal of the document's nodes)
   * that matches the specified group of selectors, or null if
   * none found.
   */
  querySelector(selectors: string): Elem | null;
  /**
   * Get the element with this `id`, or `null` if no element is found
   * with this `id`.
   */
  elemById(id: string): Elem | null;
  /**
   * Attach an event handler for the given event on this
   * document. Returns callback function instance.
   */
  onEvent(type: string, useCapture: boolean, handler: ((arg0: Event) => void)): Function;
  /**
   * Get the currently focused element, or `null` for none.
   */
  activeElem(): Elem | null;
  /**
   * Create a new element with the given tag name.  If the attrib
   * map is specified, set the new elements attributes to the
   * given values. Optionally a namespace for the element can be
   * specified with `ns`.
   */
  createElem(tagName: string, attrib?: sys.Map<string, string> | null, ns?: sys.Uri | null): Elem;
  /**
   * When a HTML document has been switched to `designMode`, the
   * document object exposes the `exec` method which allows one to
   * run commands to manipulate the contents of the editable
   * region.
   * - `name`: the command name to execute
   * - `defUi`: flag to indicate if default user interface is shown
   * - `val`: optional value for commands that take an argument
   */
  exec(name: string, defUi?: boolean, val?: sys.JsObj | null): boolean;
}

/**
 * HttpReq models the request side of an XMLHttpRequest
 * instance.
 * 
 * See [pod doc](pod-doc#xhr) for details.
 */
export class HttpReq extends sys.Obj {
  static type$: sys.Type
  /**
   * The request headers to send.
   */
  headers(): sys.Map<string, string>;
  headers(it: sys.Map<string, string>): void;
  /**
   * The type of data contained in the response. It also lets the
   * author change the response type. If an empty string is set
   * as the value, the default value of `"text"` is used.  Set this
   * field to "arraybuffer" to access response as Buf.
   */
  resType(): string;
  resType(it: string): void;
  /**
   * The Uri to send the request.
   */
  uri(): sys.Uri;
  uri(it: sys.Uri): void;
  /**
   * If true then perform this request asynchronously. Defaults
   * to `true`
   */
  async(): boolean;
  async(it: boolean): void;
  /**
   * Indicates whether or not cross-site `Access-Control` requests
   * should be made using credentials such as cookies,
   * authorization headers or TLS client certificates. Setting `withCredentials`
   * has no effect on same-site requests. The default is `false`.
   * 
   * Requests from a different domain cannot set cookie values 
   * for their own domain unless `withCredentials` is set to `true`
   * before making the request. The third-party cookies obtained
   * by setting `withCredentials` to `true` will still honor
   * same-origin policy and hence can not be accessed by the
   * requesting script through {@link Doc.cookies | Doc.cookies}
   * or from response headers.
   */
  withCredentials(): boolean;
  withCredentials(it: boolean): void;
  /**
   * Optional callback to track progress of request transfers,
   * where `loaded` is the number of bytes that have been
   * transferred, and `total` is the total number of bytes to be
   * transferred.
   * 
   * For `GET` requests, the progress will track the response being
   * downloaded to the browser.  For `PUT` and `POST` requests, the
   * progress will track the content being uploaded to the
   * server.
   * 
   * Note this callback is only invoked when `lengthComputable` is `true`
   * on the underlying progress events.
   */
  onProgress(f: ((arg0: number, arg1: number) => void)): void;
  /**
   * Post the `form` as a `multipart/form-data` submission. Formats
   * map into multipart key value pairs, where `DomFile` values
   * will be encoded with file contents.
   */
  postFormMultipart(form: sys.Map<string, sys.JsObj>, c: ((arg0: HttpRes) => void)): void;
  /**
   * Convenience for `send("POST", content, c)`.
   */
  post(content: sys.JsObj, c: ((arg0: HttpRes) => void)): void;
  /**
   * Convenience for `send("GET", "", c)`.
   */
  get(c: ((arg0: HttpRes) => void)): void;
  /**
   * Post the `form` map as a HTML form submission.  Formats the
   * map into a valid url-encoded content string, and sets `Content-Type`
   * header to `application/x-www-form-urlencoded`.
   */
  postForm(form: sys.Map<string, string>, c: ((arg0: HttpRes) => void)): void;
  /**
   * Create a new HttpReq instance.
   */
  static make(f?: ((arg0: HttpReq) => void) | null, ...args: unknown[]): HttpReq;
  /**
   * Send a request with the given content using the given HTTP
   * method (case does not matter).  After receiving the
   * response, call the given closure with the resulting HttpRes
   * object.
   */
  send(method: string, content: sys.JsObj | null, c: ((arg0: HttpRes) => void)): void;
}

/**
 * ResizeObserver invokes a callback when Elem size is changed.
 */
export class ResizeObserver extends sys.Obj {
  static type$: sys.Type
  /**
   * Disconnect this observer from all resize events for all
   * nodes.
   */
  disconnect(): this;
  /**
   * Register to receive resize events for given node.
   */
  observe(target: Elem): this;
  /**
   * Callback when an observed target size has been modified.
   */
  onResize(callback: ((arg0: sys.List<ResizeObserverEntry>) => void)): void;
  /**
   * Stop receiving resize events for given node.
   */
  unobserve(target: Elem): this;
  /**
   * Create a new ResizeObserver instance.
   */
  static make(...args: unknown[]): ResizeObserver;
}

/**
 * Storage models a DOM Storage.
 * 
 * See [pod doc](pod-doc#win) for details.
 */
export class Storage extends sys.Obj {
  static type$: sys.Type
  /**
   * Store value under this key.
   */
  set(key: string, val: sys.JsObj): void;
  /**
   * Return a list of all keys for this index.
   */
  keys(): sys.List<string>;
  /**
   * Remove all items from storage.  If store was empty, this
   * method does nothing.
   */
  clear(): void;
  /**
   * Remove value for this key. If no value for this key exists,
   * this method does nothing.
   */
  remove(key: string): void;
  /**
   * Return the number of items in storage.
   */
  size(): number;
  /**
   * Return Obj stored under this key, or null if key does not
   * exist.
   */
  get(key: string): sys.JsObj | null;
  /**
   * Return the key value for this index. If the index is greater
   * than or equal to `size` returns null.
   */
  key(index: number): string | null;
}

/**
 * KeyFrame defines a frame of a CSS animation.
 */
export class KeyFrame extends sys.Obj {
  static type$: sys.Type
  /**
   * Properies for this keyframe.
   */
  props(): sys.Map<string, sys.JsObj>;
  /**
   * Position of this keyframe.
   */
  step(): string;
  /**
   * Construct new KeyFrame for given step and props.
   */
  static make(step: string, props: sys.Map<string, sys.JsObj>, ...args: unknown[]): KeyFrame;
}

/**
 * Win models the DOM window object.
 * 
 * See [pod doc](pod-doc#win) for details.
 */
export class Win extends sys.Obj {
  static type$: sys.Type
  /**
   * Returns a reference to the parent of the current window or
   * subframe, or null if this is the top-most window.
   */
  parent(): Win | null;
  /**
   * Scrolls the document in the window by the given amount.
   */
  scrollBy(x: number, y: number): this;
  /**
   * Unregister location/error monitoring handlers previously
   * installed using {@link geoWatchPosition | geoWatchPosition}.
   * This feature is only available in secure contexts (HTTPS).
   */
  geoClearWatch(id: number): void;
  /**
   * Add new CSS style rules to this page.
   */
  addStyleRules(rules: string): void;
  /**
   * Return the size of the screen in pixels.
   */
  screenSize(): graphics.Size;
  /**
   * Clears the delay set by {@link setTimeout | setTimeout}.
   */
  clearTimeout(timeoutId: number): void;
  /**
   * Return current scroll position of document in this window.
   */
  scrollPos(): graphics.Point;
  /**
   * Hyperlink to the given Uri in this window.
   */
  hyperlink(uri: sys.Uri): void;
  /**
   * Write given text to the system clipboard.
   * 
   * The user has to interact with the page or a UI element in
   * order for this feature to work.
   */
  clipboardWriteText(text: string): void;
  /**
   * Request the browser to perform an animation before the next
   * repaint.
   */
  reqAnimationFrame(f: ((arg0: this) => void)): void;
  /**
   * Scrolls to a particular set of coordinates in the document.
   */
  scrollTo(x: number, y: number): this;
  /**
   * Go to previous page in session history.
   */
  hisBack(): void;
  /**
   * Evaluate given JavaScript code.
   */
  static eval(js: string): sys.JsObj;
  /**
   * Read textual contents of the system clipboard. Returns an
   * empty string if the clipboard is empty, does not contain
   * text, or does not include a textual representation of
   * clipboard's contents.
   * 
   * The user has to interact with the page or a UI element in
   * order for this feature to work.
   */
  clipboardReadText(f: ((arg0: string) => void)): void;
  /**
   * Return the Doc instance for this window.
   */
  doc(): Doc;
  /**
   * Go to next page in the session history.
   */
  hisForward(): void;
  /**
   * Get the the current position of this device. This feature is
   * only available in secure contexts (HTTPS).
   */
  geoCurPosition(onSuccess: ((arg0: DomCoord) => void), onErr?: ((arg0: sys.Err) => void) | null, opts?: sys.Map<string, sys.JsObj> | null): void;
  /**
   * Return the current window instance.
   */
  static cur(): Win;
  /**
   * Register a handler function that will be called
   * automatically each time the position of the device changes.
   * This method returns a watch ID value that then can be used
   * to unregister the handler with the {@link geoClearWatch | geoClearWatch}
   * method. This feature is only available in secure contexts
   * (HTTPS).
   */
  geoWatchPosition(onSuccess: ((arg0: DomCoord) => void), onErr?: ((arg0: sys.Err) => void) | null, opts?: sys.Map<string, sys.JsObj> | null): number;
  /**
   * Log object to console.
   */
  log(obj: sys.JsObj | null): void;
  /**
   * Return local storage instance for window.
   */
  localStorage(): Storage;
  /**
   * Push a new history item onto the history stack. Use `onpopstate`
   * to listen for changes:
   * ```
   * // Event.stash contains state map passed into pushState
   * Win.cur.onEvent("popstate", false) |e| { echo("# state: $e.stash") }
   * ```
   */
  hisPushState(title: string, uri: sys.Uri, map: sys.Map<string, sys.JsObj>): void;
  /**
   * Cancels a repeated action which was set up using {@link setInterval | setInterval}.
   */
  clearInterval(intervalId: number): void;
  /**
   * Reload the current page. Use `force` to bypass browse cache.
   */
  reload(force?: boolean): void;
  /**
   * Returns a reference to the topmost window in the window
   * hierarchy.  If this window is the topmost window, returns
   * self.
   */
  top(): Win;
  /**
   * Display a modal message box with the given text.
   */
  alert(obj: sys.JsObj): void;
  /**
   * Calls a function repeatedly, with a fixed time delay between
   * each call to that function. Returns an intervalId that can
   * be used in {@link clearInterval | clearInterval}.
   */
  setInterval(delay: sys.Duration, f: ((arg0: this) => void)): number;
  /**
   * Return session storage instance for window.
   */
  sessionStorage(): Storage;
  /**
   * Close this window.  Only applicable to windows created with {@link open | open}.
   * Otherwise method has no effect.  Returns this.
   */
  close(): Win;
  /**
   * Remove the given event handler from this window.  If this
   * handler was not registered, this method does nothing.
   */
  removeEvent(type: string, useCapture: boolean, handler: Function): void;
  /**
   * Get the Uri for this window.
   */
  uri(): sys.Uri;
  /**
   * Display a confirmation dialog box with the given text.
   * Returns `true` if `ok` was selected, `false` othterwise.
   */
  confirm(obj: sys.JsObj): boolean;
  /**
   * Call the specified function after a specified delay. Returns
   * a timeoutId that can be used in {@link clearTimeout | clearTimeout}.
   */
  setTimeout(delay: sys.Duration, f: ((arg0: this) => void)): number;
  /**
   * Return the size of the window viewport in pixels.
   */
  viewport(): graphics.Size;
  /**
   * Attach an event handler for the given event on this window.
   * Returns callback function instance.
   */
  onEvent(type: string, useCapture: boolean, handler: ((arg0: Event) => void)): Function;
  /**
   * Modify the current history item.
   */
  hisReplaceState(title: string, uri: sys.Uri, map: sys.Map<string, sys.JsObj>): void;
  /**
   * Open a new window. Returns the new window instance.
   */
  open(uri?: sys.Uri, winName?: string | null, opts?: sys.Map<string, string> | null): Win;
}

/**
 * Key models a key code
 */
export class Key extends sys.Obj {
  static type$: sys.Type
  static f10(): Key;
  static shift(): Key;
  static quote(): Key;
  static enter(): Key;
  static period(): Key;
  static pageUp(): Key;
  static left(): Key;
  static meta(): Key;
  static backSlash(): Key;
  static num9(): Key;
  static num8(): Key;
  static num7(): Key;
  static num6(): Key;
  static capsLock(): Key;
  static ctrl(): Key;
  static num1(): Key;
  static num0(): Key;
  static num5(): Key;
  static num4(): Key;
  static num3(): Key;
  static num2(): Key;
  static a(): Key;
  static b(): Key;
  static c(): Key;
  static d(): Key;
  static e(): Key;
  static f(): Key;
  static g(): Key;
  static h(): Key;
  static i(): Key;
  static j(): Key;
  static k(): Key;
  static right(): Key;
  static l(): Key;
  static m(): Key;
  static n(): Key;
  static o(): Key;
  static p(): Key;
  static q(): Key;
  static r(): Key;
  static comma(): Key;
  static s(): Key;
  static t(): Key;
  static esc(): Key;
  static u(): Key;
  static v(): Key;
  static w(): Key;
  static x(): Key;
  static y(): Key;
  static z(): Key;
  static backtick(): Key;
  /**
   * If this a char symbol such as OpenBracket this is its symbol
   * "[". The arrow keys will return their respective Unicode
   * arrow char.
   */
  symbol(): string | null;
  static openBracket(): Key;
  static f1(): Key;
  static f2(): Key;
  static down(): Key;
  static f3(): Key;
  static space(): Key;
  static f4(): Key;
  static f5(): Key;
  static f6(): Key;
  static f7(): Key;
  static f8(): Key;
  static f9(): Key;
  static tab(): Key;
  static closeBracket(): Key;
  static up(): Key;
  static alt(): Key;
  /**
   * Key name
   */
  name(): string;
  static dash(): Key;
  /**
   * Key code
   */
  code(): number;
  static insert(): Key;
  static delete(): Key;
  static backspace(): Key;
  static end(): Key;
  static semicolon(): Key;
  static pageDown(): Key;
  static home(): Key;
  static equal(): Key;
  static slash(): Key;
  /**
   * Return {@link name | name}.
   */
  toStr(): string;
  /**
   * Is this one of the modifier keys alt, shift, ctrl, meta
   */
  isModifier(): boolean;
  /**
   * Hash code is based on name.
   */
  hash(): number;
  /**
   * Equality is based on name.
   */
  equals(that: sys.JsObj | null): boolean;
  /**
   * Lookup by key code.
   */
  static fromCode(code: number): Key;
  /**
   * Lookup by string name or symbol
   */
  static fromStr(s: string, checked?: boolean, ...args: unknown[]): Key;
}

/**
 * SVG (Scalar Vector Graphics) utilities
 */
export class Svg extends sys.Obj {
  static type$: sys.Type
  /**
   * SVG XML namesapce
   */
  static ns(): sys.Uri;
  /**
   * XLink XML namespace
   */
  static nsXLink(): sys.Uri;
  /**
   * Auto-generate an id for the def element and mount it into
   * the svg document's defs section.  This method will
   * automatically generate a `<defs>` child in the svg document as
   * needed. If defs already has an id or is already mounted,
   * then no action is taken.
   */
  static def(svgElem: Elem, defElem: Elem): string;
  /**
   * Convenience to create `line` element
   */
  static line(x1: number, y1: number, x2: number, y2: number): Elem;
  /**
   * Mount a definition element using {@link def | def} and return
   * a CSS URL to the fragment identifier such as "url(#def-d)". 
   * This is used to reference gradient and clip definitions.
   */
  static defUrl(svgElem: Elem, defElem: Elem): string;
  /**
   * Convenience to create `rect` element
   */
  static rect(x: number, y: number, w: number, h: number): Elem;
  /**
   * Convenience to create `text` element
   */
  static text(text: string, x: number, y: number): Elem;
  /**
   * Create element with proper namespace
   */
  static elem(tagName: string): Elem;
  /**
   * Convenience to create a `image` element
   */
  static image(href: sys.Uri, x: number, y: number, w: number, h: number): Elem;
}

/**
 * MutationObserver invokes a callback when DOM modifications
 * occur.
 */
export class MutationObserver extends sys.Obj {
  static type$: sys.Type
  /**
   * Disconnect this observer from receiving DOM mutation events.
   */
  disconnect(): this;
  /**
   * Register to receive DOM mutation events for given node. At
   * least one option is required:
   * - "childList": `true` to observe node additions and removals on
   *   target (including text nodes)
   * - "attrs":  `true` to observe target attribute mutations
   * - "charData": `true` to observe target data mutation
   * - "subtree": `true` to observe target and target's descendant
   *   mutations
   * - "attrOldVal": `true` to capture attribute value before
   *   mutation (requires "attrs":'true')
   * - "charDataOldVal": `true` to capture target's data before
   *   mutation (requires "charData":'true')
   * - "attrFilter": Str[] whitelist of attribute names to observe
   *   (requires "attrs":'true')
   */
  observe(target: Elem, opts: sys.Map<string, sys.JsObj>): this;
  /**
   * Empties this observers's record queue and returns what was
   * in there.
   */
  takeRecs(): sys.List<MutationRec>;
  /**
   * Constructor.
   */
  static make(callback: ((arg0: sys.List<MutationRec>) => void), ...args: unknown[]): MutationObserver;
}

/**
 * GeomTest
 */
export class GeomTest extends sys.Test {
  static type$: sys.Type
  verifySer(obj: sys.JsObj): void;
  verifyCssDim(d: CssDim, v: number, u: string): void;
  static make(...args: unknown[]): GeomTest;
  testCssDim(): void;
}

/**
 * ResizeObserverEntry models a resize event for {@link ResizeObserver | ResizeObserver}.
 */
export class ResizeObserverEntry extends sys.Obj {
  static type$: sys.Type
  /**
   * Elem that has been resized.
   */
  target(): Elem;
  target(it: Elem): void;
  /**
   * New size of {@link target | target} element.
   */
  size(): graphics.Size;
  __size(it: graphics.Size): void;
  toStr(): string;
}

/**
 * Style models CSS style properties for an Elem.
 */
export class Style extends sys.Obj {
  static type$: sys.Type
  /**
   * The CSS classes for this element.
   */
  classes(): sys.List<string>;
  classes(it: sys.List<string>): void;
  /**
   * Set properties via CSS text.
   * ```
   * style.setCss("color: #f00; font-weight: bold;")
   * ```
   */
  setCss(css: string): this;
  /**
   * Get the computed property value.
   */
  computed(name: string): sys.JsObj | null;
  /**
   * Add a psuedo-class CSS definietion to this element. A new
   * class name is auto-generated and used to prefix `name`, `name`
   * must start with the `:` character.  Returns the generated
   * class name.
   * ```
   * style.addPseudoClass(":hover", "background: #eee")
   * ```
   */
  addPseudoClass(name: string, css: string): string;
  /**
   * Get the effetive style property value, which is the most
   * specific style or CSS rule in effect on this node. Returns `null`
   * if no rule in effect for given property.
   * 
   * This method is restricted to stylesheets that have
   * originated from the same domain as the document. Any rules
   * that may be applied from an external sheet will not be
   * included.
   */
  effective(name: string): sys.JsObj | null;
  /**
   * Get the given property value.
   * ```
   * color := style["color"]
   * ```
   */
  get(name: string): sys.JsObj | null;
  /**
   * Get or set an attribute.  Attribute names should be specifed
   * in camel case:
   * ```
   * style->backgroundColor == style["background-color"]
   * ```
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Set all the given property values.
   * ```
   * style.setAll(["color":"#f00", "font-weight":"bold"])
   * ```
   */
  setAll(map: sys.Map<string, sys.JsObj | null>): this;
  /**
   * Add the given CSS class name to this element.  If this
   * element already contains the given class name, then this
   * method does nothing. Returns this.
   */
  addClass(name: string): this;
  /**
   * Set the given propery value.  If `val` is null this property
   * is removed.
   * ```
   * style["color"] = "#f00"
   * ```
   */
  set(name: string, val: sys.JsObj | null): this;
  /**
   * Remove the given CSS class name to this element. If this
   * element does not have the given class name, this method does
   * nothing. Returns this.
   */
  removeClass(name: string): this;
  /**
   * Return true if this element has the given CSS class name, or
   * false if it does not.
   */
  hasClass(name: string): boolean;
  /**
   * Clear all style declarations.
   */
  clear(): this;
  /**
   * Toggle the presence of the given CSS class name based on the
   * `cond` argument:
   * - `null`: remove class if present, or add if missing
   * - `true`: always add class (see {@link addClass | addClass})
   * - `false`: always remove class(see {@link removeClass | removeClass})
   */
  toggleClass(name: string, cond?: boolean | null): this;
}

/**
 * KeyFrames defines a CSS animation from a list of KeyFrames.
 */
export class KeyFrames extends sys.Obj {
  static type$: sys.Type
  /**
   * Frames for this animation.
   */
  frames(): sys.List<KeyFrame>;
  toStr(): string;
  /**
   * Construct new animation with given frames.
   */
  static make(frames: sys.List<KeyFrame>, ...args: unknown[]): KeyFrames;
}

export class JavaTest extends sys.Test {
  static type$: sys.Type
  testSvg(): void;
  testClassAttr(): void;
  static make(...args: unknown[]): JavaTest;
  testStyleBasics(): void;
  testElemBasics(): void;
  testAttrs(): void;
  testQuerySelector(): void;
}

/**
 * HttpSocket implements an async WebSocket client
 */
export class HttpSocket extends sys.Obj {
  static type$: sys.Type
  /**
   * Event fired when the web socket is closed due to an error
   */
  onError(f: ((arg0: Event) => void)): void;
  /**
   * Event fired when the web socket receives a message. The
   * message payload is available as a Str or Buf via {@link Event.data | Event.data}
   */
  onReceive(f: ((arg0: Event) => void)): void;
  /**
   * Uri passed to the open method
   */
  uri(): sys.Uri;
  /**
   * Event fired when the web socket is closed
   */
  onClose(f: ((arg0: Event) => void)): void;
  /**
   * Event fired when the web socket is opened
   */
  onOpen(f: ((arg0: Event) => void)): void;
  /**
   * Send the data as a message - data must be a Str or in-memory
   * Buf
   */
  send(data: sys.JsObj): this;
  /**
   * Close the web socket.
   */
  close(): this;
  /**
   * Open a web socket to given URI with sub-protocol list
   */
  static open(uri: sys.Uri, protocols: sys.List<string> | null): HttpSocket;
}

/**
 * Event models the DOM event object.
 * 
 * Common event types:
 * ```
 * "mousedown"   Fired when a mouse button is pressed on an element.
 * 
 * "mouseup"     Fired when a mouse button is released over an element.
 * 
 * "click"       Fired when a mouse button is pressed and released on a
 *               single element.
 * 
 * "dblclick"    Fired when a mouse button is clicked twice on a single element.
 * 
 * "mousemove"   Fired when a mouse is moved while over an element.
 * 
 * "mouseover"   Fired when mouse is moved onto the element that has the
 *               listener attached or onto one of its children.
 * 
 * "mouseout"    Fired when mouse is moved off the element that has the
 *               listener attached or off one of its children.
 * 
 * "mouseenter"  Fired when mouse is moved over the element that has the
 *               listener attached. Similar to '"mouseover"', it differs in
 *               that it doesn't bubble and that it isn't sent when the mouse
 *               is moved from one of its descendants' physical space to its
 *               own physical space.
 * 
 *               With deep hierarchies, the amount of mouseenter events sent
 *               can be quite huge and cause significant performance problems.
 *               In such cases, it is better to listen for "mouseover" events.
 * 
 * "mouseleave"  Fired when mouse is moved off the element that has the
 *               listener attached. Similar to "mouseout", it differs in that
 *               it doesn't bubble and that it isn't sent until the pointer
 *               has moved from its physical space and the one of all its
 *               descendants.
 * 
 *               With deep hierarchies, the amount of mouseleave events sent
 *               can be quite huge and cause significant performance problems.
 *               In such cases, it is better to listen for "mouseout" events.
 * 
 * "contextmenu" Fired when the right button of the mouse is clicked (before
 *               the context menu is displayed), or when the context menu key
 *               is pressed (in which case the context menu is displayed at the
 *               bottom left of the focused element, unless the element is a
 *               tree, in which case the context menu is displayed at the
 *               bottom left of the current row).
 * 
 * 
 * "focus"       The focus event is fired when an element has received focus
 * 
 * "blur"        The blur event is fired when an element has lost focus.
 * 
 * "keydown"     Fired when a key is pressed down.
 * 
 * "keyup"       Fired when a key is released.
 * 
 * "keypress"    Fired when a key is pressed down and that key normally
 *               produces a character value (use "input" instead).
 * 
 * "input"       Fired synchronously when the value of an <input> or
 *               <textarea> element is changed.
 * 
 * "dragstart"   Fired on an element when a drag is started. The user is
 *               requesting to drag the element where the dragstart event is
 *               fired. During this event, a listener would set information
 *               such as the drag data and image to be associated with the drag.
 *               This event is not fired when dragging a file into the browser
 *               from the OS.
 * 
 * "dragenter"   Fired when the mouse enters an element while a drag is
 *               occurring. A listener for this event should indicate whether
 *               a drop is allowed over this location. If there are no listeners,
 *               or the listeners perform no operations, then a drop is not
 *               allowed by default. This is also the event to listen for in
 *               order to provide feedback that a drop is allowed, such as
 *               displaying a highlight or insertion marker.
 * 
 * "dragover"    This event is fired as the mouse is moving over an element
 *               when a drag is occurring. Much of the time, the operation that
 *               occurs during a listener will be the same as the "dragenter"
 *               event.
 * 
 * "dragleave"   This event is fired when the mouse leaves an element while a
 *               drag is occurring. Listeners should remove any highlighting
 *               or insertion markers used for drop feedback.
 * 
 * "drag"        This event is fired at the source of the drag and is the element
 *               where "dragstart" was fired during the drag operation.
 * 
 * "drop"        The drop event is fired on the element where the drop
 *               occurred at the end of the drag operation. A listener would
 *               be responsible for retrieving the data being dragged and
 *               inserting it at the drop location. This event will only fire
 *               if a drop is desired. It will not fire if the user cancelled
 *               the drag operation, for example by pressing the Escape key,
 *               or if the mouse button was released while the mouse was not
 *               over a valid drop target.
 * 
 * "dragend"     The source of the drag will receive a "dragend" event when the
 *               drag operation is complete, whether it was successful or not.
 *               This event is not fired when dragging a file into the browser
 *               from the OS.
 * ```
 */
export class Event extends sys.Obj {
  static type$: sys.Type
  /**
   * Meta-data for this event instance.
   */
  stash(): sys.Map<string, sys.JsObj | null>;
  stash(it: sys.Map<string, sys.JsObj | null>): void;
  /**
   * The DataTransfer object for this event.
   */
  dataTransfer(): DataTransfer;
  /**
   * Data message used with {@link HttpSocket.onReceive | HttpSocket.onReceive}
   */
  data(): sys.JsObj;
  /**
   * Return true if the CTRL key was pressed during the event.
   */
  ctrl(): boolean;
  /**
   * Return true if the SHIFT key was pressed during the event.
   */
  shift(): boolean;
  /**
   * Scroll amount for wheel events.
   */
  delta(): graphics.Point | null;
  /**
   * Character string for key event that represents text typed.
   * For example Shift + Key.b would return "B".
   */
  keyChar(): string | null;
  /**
   * The type of this event.
   */
  type(): string;
  /**
   * Mouse button number pressed.
   */
  button(): number | null;
  /**
   * Get an attribute by name.  If not found return the specified
   * default value.
   */
  get(name: string, def?: sys.JsObj | null): sys.JsObj | null;
  /**
   * Get or set an attribute.
   */
  trap(name: string, args?: sys.List<sys.JsObj | null> | null): sys.JsObj | null;
  /**
   * Key instance for key pressed.
   */
  key(): Key | null;
  /**
   * The mouse position of this event relative to page.
   */
  pagePos(): graphics.Point;
  toStr(): string;
  /**
   * Set an attribute to the given value.
   */
  set(name: string, val: sys.JsObj | null): void;
  /**
   * Err instance if available for `window.onerror`.
   */
  err(): sys.Err | null;
  /**
   * Return true if the ALT key was pressed during the event.
   */
  alt(): boolean;
  /**
   * Create an {@link Event | Event} instance from a native
   * JavaScript Event object.
   */
  static fromNative(event: any): Event;
  /**
   * The target to which the event was dispatched.
   */
  target(): Elem;
  /**
   * Get the native JavaScript Event object
   */
  toNative(): any;
  /**
   * Stop further propagation of this event.
   */
  stop(): void;
  /**
   * Optional secondary target depending on event type:
   * ```
   * event     target                relatedTarget
   * --------  --------------------  -----------------------------
   * blur      elem losing focus     elem receiving focus (if any)
   * focus     elem receiving focus  elem losing focus (if any)
   * focusin   elem receiving focus  elem losing focus (if any)
   * focusout  elem losing focus     elem receiving focus (if any)
   * ```
   */
  relatedTarget(): Elem | null;
  /**
   * Return true if the Meta key was pressed during the event. 
   * On Macs this maps to "command" key.  On Windows this maps to
   * "Windows" key.
   */
  meta(): boolean;
}

/**
 * MutationRec represents an individual DOM mutation.
 */
export class MutationRec extends sys.Obj {
  static type$: sys.Type
  /**
   * List of nodes added, or empyt list if no nodes added.
   */
  added(): sys.List<Elem>;
  added(it: sys.List<Elem>): void;
  /**
   * Namespace of the changed attribute, or null if no attribute
   * was changed.
   */
  attrNs(): string | null;
  attrNs(it: string | null): void;
  /**
   * Next sibling of the added or removed nodes, or null if no
   * nodes added or removed.
   */
  nextSibling(): Elem | null;
  nextSibling(it: Elem | null): void;
  /**
   * Mutation type:
   * - "attrs" if the mutation was an attribute mutation
   * - "charData" if it was a mutation to a CharacterData node
   * - "childList" if it was a mutation to the tree of nodes
   */
  type(): string;
  type(it: string): void;
  /**
   * Target node that mutation affected, depending on the `type`:
   * - For "attrs", it is the element whose attribute changed
   * - For "charData", it is the CharacterData node
   * - For "childList", it is the node whose children changed
   */
  target(): Elem;
  target(it: Elem): void;
  /**
   * Old value, depending on `type`:
   * - For "attrs", it is the value of the changed attribute before
   *   the change
   * - For "charData", it is the data of the changed node before
   *   the change
   * - For "childList", it is null
   */
  oldVal(): string | null;
  oldVal(it: string | null): void;
  /**
   * List of nodes removed, or empty list if no nodes removed.
   */
  removed(): sys.List<Elem>;
  removed(it: sys.List<Elem>): void;
  /**
   * Previous sibling of the added or removed nodes, or null if
   * not nodes added or removed.
   */
  prevSibling(): Elem | null;
  prevSibling(it: Elem | null): void;
  /**
   * Name of the changed attribute, or null if no attribute was
   * changed.
   */
  attr(): string | null;
  attr(it: string | null): void;
}

/**
 * DomCoord models a DOM Coordinate object.
 */
export class DomCoord extends sys.Obj {
  static type$: sys.Type
  toStr(): string;
  /**
   * Returns a float representing the position's altitude in
   * meters, relative to sea level. This value can be `null` if the
   * implementation cannot provide the data.
   */
  altitude(): number | null;
  /**
   * Returns a float representing the position's longitude in
   * decimal degrees.
   */
  lng(): number;
  /**
   * Returns a float representing the direction in which the
   * device is traveling. This value, specified in degrees,
   * indicates how far off from heading true north the device is.
   * 0 degrees represents true north, and the direction is
   * determined clockwise (which means that east is 90 degrees
   * and west is 270 degrees). If speed is 0, heading is NaN. If
   * the device is unable to provide heading information, this
   * value is `null`.
   */
  heading(): number | null;
  /**
   * Returns a float representing the accuracy of the latitude
   * and longitude properties, expressed in meters.
   */
  accuracy(): number;
  /**
   * Returns a float representing the accuracy of the altitude
   * expressed in meters. This value can be `null`.
   */
  altitudeAccuracy(): number | null;
  /**
   * Returns a double representing the velocity of the device in
   * meters per second. This value can be `null`.
   */
  speed(): number | null;
  /**
   * Returns a float representing the position's latitude in
   * decimal degrees.
   */
  lat(): number;
  /**
   * Optional timestamp of when this location was retrieved.
   */
  ts(): sys.Duration | null;
}

