import * as sys from './sys.js';
import * as concurrent from './concurrent.js';
import * as graphics from './graphics.js';
import * as dom from './dom.js';

/**
 * FlowBox lays out its children in a one-directional flow.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Layout#flowBox)
 */
export class FlowBox extends Box {
  static type$: sys.Type
  /**
   * How to align children inside container.  Valid values are `left`,
   * `center`, `right`.
   */
  halign(): Align;
  halign(it: Align): void;
  /**
   * Gaps to insert between child elements.  If `gaps.length` is
   * less than the number of children, then `gaps` will be cycled
   * to apply to all children.
   */
  gaps(): sys.List<string>;
  gaps(it: sys.List<string>): void;
  static make(...args: unknown[]): FlowBox;
}

/**
 * Button is a widget that invokes an action when pressed.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#button),
 * {@link ToggleButton | ToggleButton}, {@link ListButton | ListButton}
 */
export class Button extends dom.Elem {
  static type$: sys.Type
  enabled(): boolean | null;
  enabled(it: boolean | null): void;
  /**
   * Callback to create Popup to display when button is pressed.
   */
  onPopup(f: ((arg0: Button) => Popup)): void;
  /**
   * Callback when button action is invoked.
   */
  onAction(f: ((arg0: this) => void)): void;
  /**
   * Programmatically open popup, or do nothing if no popup
   * defined.
   */
  openPopup(): void;
  static make(...args: unknown[]): Button;
}

/**
 * Popup window which can be closed clicking outside of
 * element.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Modals#popup)
 */
export class Popup extends dom.Elem {
  static type$: sys.Type
  /**
   * Where to align Popup relative to open(x,y):
   * - Align.left: align left edge popup to (x,y)
   * - Align.center: center popup with (x,y)
   * - Align.right: align right edge of popup to (x,y)
   */
  halign(): Align;
  halign(it: Align): void;
  /**
   * Return `true` if this popup currently open.
   */
  isOpen(): boolean;
  isOpen(it: boolean): void;
  /**
   * Callback when popup is closed.
   */
  onClose(f: ((arg0: this) => void)): void;
  /**
   * Fit popup with current window bounds. This may move the
   * origin of where popup is opened, or modify the width or
   * height, or both.
   * 
   * This method is called automatically by {@link open | open}. 
   * For content that is asynchronusly loaded after popup is
   * visible, and that may modify the initial size, it is good
   * practice to invoke this method to verify content does not
   * overflow the viewport.
   * 
   * If popup is not open, this method does nothing.
   */
  fitBounds(): void;
  /**
   * Callback when popup is opened.
   */
  onOpen(f: ((arg0: this) => void)): void;
  static make(...args: unknown[]): Popup;
  /**
   * Close this popup. If popup is already closed this method
   * does nothing.
   */
  close(): void;
  /**
   * Open this popup in the current Window. If popup is already
   * open this method does nothing. This method always invokes {@link fitBounds | fitBounds}
   * to verify popup does not overflow viewport.
   */
  open(x: number, y: number): void;
}

/**
 * DomListener monitors the DOM and invokes callbacks when
 * modifications occur.
 * 
 * DomListener works by registering a global {@link dom.MutationObserver | MutationObserver}
 * on the `body` tag and collects all `childList` events for his
 * subtree.  All mutation events are queued and processed on a {@link dom.Win.reqAnimationFrame | reqAnimationFrame}.
 * Registered nodes are held with weak references, and will be
 * garbage collected when out of scope.
 */
export class DomListener extends sys.Obj {
  static type$: sys.Type
  /**
   * Request callback when target node is mounted into document.
   */
  onMount(target: dom.Elem, f: ((arg0: dom.Elem) => void)): void;
  static cur(): DomListener;
  /**
   * Request callback when target node is unmounted from
   * document.
   */
  onUnmount(target: dom.Elem, f: ((arg0: dom.Elem) => void)): void;
  /**
   * Request callback when target node size has changed.
   */
  onResize(target: dom.Elem, f: ((arg0: dom.Elem) => void)): void;
}

/**
 * ListButton allows user selection of an item in a list by
 * showing a listbox popup on button press.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#listButton),
 * {@link Button | Button}, {@link ToggleButton | ToggleButton}
 */
export class ListButton extends Button {
  static type$: sys.Type
  /**
   * The current list items.
   */
  items(): sys.List<sys.JsObj>;
  items(it: sys.List<sys.JsObj>): void;
  /**
   * Selection for list.
   */
  sel(): Selection;
  sel(it: Selection): void;
  /**
   * Callback when selected item has changed.
   */
  onSelect(f: ((arg0: this) => void)): void;
  /**
   * Callback to create an `Elem` representation for a given list
   * item.  If function does not return an `Elem` instance, one
   * will be created using `toStr` of value.
   */
  onElem(f: ((arg0: sys.JsObj) => sys.JsObj)): void;
  static make(...args: unknown[]): ListButton;
}

/**
 * TableEvents are generated by {@link Table | Table} cells.
 */
export class TableEvent extends sys.Obj {
  static type$: sys.Type
  /**
   * Column index for this event.
   */
  col(): number;
  __col(it: number): void;
  /**
   * Event type.
   */
  type(): string;
  __type(it: string): void;
  /**
   * Mouse position relative to cell.
   */
  cellPos(): graphics.Point;
  __cellPos(it: graphics.Point): void;
  /**
   * Size of cell for this event.
   */
  size(): graphics.Size;
  __size(it: graphics.Size): void;
  /**
   * Row index for this event.
   */
  row(): number;
  __row(it: number): void;
  table(): Table;
  table(it: Table): void;
  /**
   * Mouse position relative to page.
   */
  pagePos(): graphics.Point;
  __pagePos(it: graphics.Point): void;
  toStr(): string;
}

/**
 * TableModel backs the data model for a {@link Table | Table}
 */
export class TableModel extends sys.Obj {
  static type$: sys.Type
  /**
   * Return item for the given row to be used with selection.
   */
  item(row: number): sys.JsObj;
  /**
   * Number of rows in table.
   */
  numRows(): number;
  /**
   * Callback to update content for column header at given index.
   */
  onHeader(header: dom.Elem, col: number): void;
  /**
   * Return width of given column.
   */
  colWidth(col: number): number;
  /**
   * Number of columns in table.
   */
  numCols(): number;
  /**
   * Compare two cells when sorting the given col.  Return -1, 0,
   * or 1 according to the same semanatics as {@link sys.Obj.compare | sys::Obj.compare}.
   * See {@link Table.sort | domkit::Table.sort}.
   */
  sortCompare(col: number, row1: number, row2: number): number;
  /**
   * Callback to update the cell content at given location.
   */
  onCell(cell: dom.Elem, col: number, row: number, flags: TableFlags): void;
  /**
   * Return default visible/hidden state for column
   */
  isVisibleDef(col: number): boolean;
  /**
   * Return height of header.
   */
  headerHeight(): number;
  static make(...args: unknown[]): TableModel;
  /**
   * Return height of rows.
   */
  rowHeight(): number;
}

/**
 * Hyperlink anchor element
 */
export class Link extends dom.Elem {
  static type$: sys.Type
  /**
   * URI to hyperlink to.
   */
  uri(): sys.Uri;
  uri(it: sys.Uri): void;
  /**
   * The target attribute specifies where to open the linked
   * document.
   */
  target(): string;
  target(it: string): void;
  static make(...args: unknown[]): Link;
}

/**
 * Selection manages the selected items and/or indexes
 */
export class Selection extends sys.Obj {
  static type$: sys.Type
  /**
   * Get or set a single item
   */
  item(): sys.JsObj | null;
  item(it: sys.JsObj | null): void;
  /**
   * Get or set a single index
   */
  index(): number | null;
  index(it: number | null): void;
  /**
   * Enable or disable selection.
   */
  enabled(): boolean;
  enabled(it: boolean): void;
  /**
   * True to enable multiple selection, false for single
   * selection.
   */
  multi(): boolean;
  multi(it: boolean): void;
  /**
   * Selected zero based indexes
   */
  indexes(): sys.List<number>;
  indexes(it: sys.List<number>): void;
  /**
   * Selected items.
   */
  items(): sys.List<sys.JsObj>;
  items(it: sys.List<sys.JsObj>): void;
  /**
   * Is the selection currently empty
   */
  isEmpty(): boolean;
  /**
   * Clear the selection
   */
  clear(): void;
  /**
   * Number of selected items
   */
  size(): number;
  static make(...args: unknown[]): Selection;
}

/**
 * CardBox lays out child elements as a stack of cards, where
 * only one card may be visible at a time.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Layout#cardBox)
 */
export class CardBox extends Box {
  static type$: sys.Type
  /**
   * Selected card index, or null if no children.
   */
  selIndex(): number | null;
  selIndex(it: number | null): void;
  /**
   * Transition effect to apply when `selIndex` is changed. If
   * null, no effect is applied.
   * 
   * Valid values are:
   * - `slideLeft`: animate cards sliding in from right-to-left
   * - `slideRight`: animate cards sliding in from left-to-right
   */
  effect(): string | null;
  effect(it: string | null): void;
  /**
   * Duratin for {@link effect | effect} animation to last.
   */
  effectDur(): sys.Duration;
  effectDur(it: sys.Duration): void;
  /**
   * Selected card instance, or null if no children.
   */
  selItem(): dom.Elem | null;
  static make(...args: unknown[]): CardBox;
}

/**
 * ProgressBar visualizes progress of a long running operation
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#progressBar)
 */
export class ProgressBar extends dom.Elem {
  static type$: sys.Type
  /**
   * Current progress value.
   */
  val(): number;
  val(it: number): void;
  /**
   * Min progress value.
   */
  min(): number;
  min(it: number): void;
  /**
   * Max progress value.
   */
  max(): number;
  max(it: number): void;
  /**
   * Callback to get progress bar text when {@link val | val} is
   * modified.
   */
  onText(f: ((arg0: ProgressBar) => string)): void;
  static make(f?: ((arg0: ProgressBar) => void) | null, ...args: unknown[]): ProgressBar;
  /**
   * Callback to get progress bar color (as CSS color value) when
   * {@link val | val} is modified.
   */
  onBarColor(f: ((arg0: ProgressBar) => string)): void;
}

/**
 * ToggleButton models a boolean state toggled by pressing a
 * button.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#toggleButton),
 * {@link Button | Button}
 */
export class ToggleButton extends Button {
  static type$: sys.Type
  /**
   * Optional content to display when not selected. If the
   * argument is not an {@link dom.Elem | Elem} instance, one will
   * be created with text content using `toStr`.
   */
  elemOff(): sys.JsObj | null;
  elemOff(it: sys.JsObj | null): void;
  /**
   * Toggle selection state.
   */
  selected(): boolean;
  selected(it: boolean): void;
  /**
   * Optional content to display when selected. If the argument
   * is not an {@link dom.Elem | Elem} instance, one will be
   * created with text content using `toStr`.
   */
  elemOn(): sys.JsObj | null;
  elemOn(it: sys.JsObj | null): void;
  static make(...args: unknown[]): ToggleButton;
}

/**
 * Direction enums: up, down, left, right
 */
export class Dir extends sys.Enum {
  static type$: sys.Type
  /**
   * List of Dir values indexed by ordinal
   */
  static vals(): sys.List<Dir>;
  static right(): Dir;
  static down(): Dir;
  static left(): Dir;
  static up(): Dir;
  /**
   * Return the Dir instance for the specified name.  If not a
   * valid name and checked is false return null, otherwise throw
   * ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): Dir;
}

/**
 * Multi-line text input element
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#textArea)
 */
export class TextArea extends dom.Elem {
  static type$: sys.Type
  /**
   * Value of text area.
   */
  val(): string;
  val(it: string): void;
  /**
   * Set to `true` to set text area to readonly mode.
   */
  ro(): boolean;
  ro(it: boolean): void;
  /**
   * Hint that is displayed in the text area before a user enters
   * value that describes the expected input, or `null` for no
   * placeholder text.
   */
  placeholder(): string | null;
  placeholder(it: string | null): void;
  /**
   * Preferred width of text area in columns, or `null` for
   * default.
   */
  cols(): number | null;
  cols(it: number | null): void;
  /**
   * Preferred height of text area in rows, or `null` for default.
   */
  rows(): number | null;
  rows(it: number | null): void;
  /**
   * Callback when value is modified by user.
   */
  onModify(f: ((arg0: this) => void)): void;
  static make(...args: unknown[]): TextArea;
}

/**
 * Simple text based element.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#label)
 */
export class Label extends dom.Elem {
  static type$: sys.Type
  static make(...args: unknown[]): Label;
}

/**
 * Combo combines a TextField and ListButton into a single
 * widget that allows a user to select from a list or manually
 * enter a value.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#combo)
 */
export class Combo extends dom.Elem {
  static type$: sys.Type
  /**
   * TextField component of Combo.
   */
  field(): TextField;
  field(it: TextField): void;
  /**
   * The current list items for Combo.
   */
  items(): sys.List<string>;
  items(it: sys.List<string>): void;
  enabled(): boolean | null;
  enabled(it: boolean | null): void;
  /**
   * Callback to create an `Elem` representation for a given list
   * item.  If function does not return an `Elem` instance, one
   * will be created using `toStr` of value.
   */
  onElem(f: ((arg0: sys.JsObj) => sys.JsObj)): void;
  static make(...args: unknown[]): Combo;
}

/**
 * TreeEvent are generated by {@link TreeNode | TreeNode} nodes.
 */
export class TreeEvent extends sys.Obj {
  static type$: sys.Type
  /**
   * Parent {@link Tree | Tree} instance.
   */
  tree(): Tree;
  tree(it: Tree): void;
  /**
   * Event type.
   */
  type(): string;
  __type(it: string): void;
  /**
   * {@link TreeNode | TreeNode} this event was trigged on.
   */
  node(): TreeNode;
  node(it: TreeNode): void;
  /**
   * Size of node for this event.
   */
  size(): graphics.Size;
  __size(it: graphics.Size): void;
  /**
   * Mouse position relative to node.
   */
  nodePos(): graphics.Point;
  __nodePos(it: graphics.Point): void;
  /**
   * Mouse position relative to page.
   */
  pagePos(): graphics.Point;
  __pagePos(it: graphics.Point): void;
  toStr(): string;
}

/**
 * TreeNode models a node in a Tree.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#tree)
 */
export class TreeNode extends sys.Obj {
  static type$: sys.Type
  /**
   * Parent node of this node, or `null` if this node is a root.
   */
  parent(): TreeNode | null;
  parent(it: TreeNode | null): void;
  /**
   * Is this node expanded?
   */
  isExpanded(): boolean;
  /**
   * Return true if this has or might have children. This is an
   * optimization to display an expansion control without
   * actually loading all the children.  The default returns `!children.isEmpty`.
   */
  hasChildren(): boolean;
  /**
   * Get the children of this node.  If no children return an
   * empty list. Default behavior is no children. This method
   * must return the same instances when called.
   */
  children(): sys.List<TreeNode>;
  /**
   * Callback to customize Elem for this node.
   */
  onElem(elem: dom.Elem, flags: TreeFlags): void;
  static make(...args: unknown[]): TreeNode;
}

/**
 * Dialog manages a modal window above page content.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Modals#dialog)
 */
export class Dialog extends Box {
  static type$: sys.Type
  /**
   * `Str` or `Elem` content displayed in title bar, or `null` to hide
   * title bar.
   */
  title(): sys.JsObj | null;
  title(it: sys.JsObj | null): void;
  /**
   * Callback when popup is closed.
   */
  onClose(f: ((arg0: this) => void)): void;
  /**
   * Callback when dialog is opened.
   */
  onOpen(f: ((arg0: this) => void)): void;
  static make(...args: unknown[]): Dialog;
  /**
   * Close this dialog. If dialog is already closed this method
   * does nothing.
   */
  close(): void;
  /**
   * Open this dialog in the current Window. If dialog is already
   * open this method does nothing.
   */
  open(): void;
}

/**
 * Checkbox displays a checkbox that can be toggled on and off.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#checkbox)
 */
export class Checkbox extends dom.Elem {
  static type$: sys.Type
  /**
   * Get or set indeterminate flag.
   */
  indeterminate(): boolean;
  indeterminate(it: boolean): void;
  /**
   * Value of checked.
   */
  checked(): boolean;
  checked(it: boolean): void;
  /**
   * Callback when state is toggled.
   */
  onAction(f: ((arg0: this) => void)): void;
  static make(...args: unknown[]): Checkbox;
  /**
   * Wrap this checkbox with content that can also be clicked to
   * toggle checkbox.
   */
  wrap(content: sys.JsObj): dom.Elem;
}

/**
 * Tree specific flags for eventing
 */
export class TreeFlags extends sys.Obj {
  static type$: sys.Type
  /**
   * Tree has focus.
   */
  focused(): boolean;
  __focused(it: boolean): void;
  /**
   * Node is selected.
   */
  selected(): boolean;
  __selected(it: boolean): void;
  toStr(): string;
  static make(f: ((arg0: TreeFlags) => void), ...args: unknown[]): TreeFlags;
}

/**
 * Tooltip displays a small popup when the mouse hovers over
 * the bound node element, and is dismissed when the mouse
 * moves out.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#tooltip)
 */
export class Tooltip extends dom.Elem {
  static type$: sys.Type
  /**
   * Time mouse must be over bound node before opening the
   * Tooltip. If `null` the Tooltip is displayed immediatly.
   */
  delay(): sys.Duration | null;
  delay(it: sys.Duration | null): void;
  /**
   * Bind this tooltip the given node.
   */
  bind(node: dom.Elem): void;
  static make(...args: unknown[]): Tooltip;
}

/**
 * RadioButton displays a radio button.  RadioButtons should be
 * belong to a {@link ButtonGroup | ButtonGroup}, where only one
 * button in the group can be selected at a time.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#radioButton)
 */
export class RadioButton extends dom.Elem {
  static type$: sys.Type
  /**
   * Value of checked.
   */
  checked(): boolean;
  checked(it: boolean): void;
  /**
   * Callback when state is toggled.
   */
  onAction(f: ((arg0: this) => void)): void;
  static make(...args: unknown[]): RadioButton;
  /**
   * Wrap this checkbox with content that can also be clicked to
   * toggle checkbox.
   */
  wrap(content: sys.JsObj): dom.Elem;
}

/**
 * Table specific flags for eventing
 */
export class TableFlags extends sys.Obj {
  static type$: sys.Type
  /**
   * Table has focus.
   */
  focused(): boolean;
  __focused(it: boolean): void;
  /**
   * Row is selected.
   */
  selected(): boolean;
  __selected(it: boolean): void;
  /**
   * Default value with all flags cleared
   */
  static defVal(): TableFlags;
  static __defVal(it: TableFlags): void;
  toStr(): string;
  static make(f: ((arg0: TableFlags) => void), ...args: unknown[]): TableFlags;
}

/**
 * FlipBox displays content on a 3D card, and allows
 * transitiong between the front and back using a flipping
 * animation.
 */
export class FlipBox extends Box {
  static type$: sys.Type
  /**
   * Back card content.
   */
  back(): dom.Elem | null;
  back(it: dom.Elem | null): void;
  /**
   * Front card content.
   */
  front(): dom.Elem | null;
  front(it: dom.Elem | null): void;
  /**
   * Is card showing back content.
   */
  isBack(): boolean;
  /**
   * Show front card content if not already visible.
   */
  toFront(): this;
  /**
   * Is card showing front content.
   */
  isFront(): boolean;
  /**
   * Show back card content if not already visible.
   */
  toBack(): this;
  static make(...args: unknown[]): FlipBox;
  /**
   * Flip content, and invoke the specified callback when the
   * flip animation has completed.
   */
  flip(onComplete?: ((arg0: this) => void) | null): void;
}

/**
 * GridBox lays its children out in a two dimensional grid.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Layout#gridBox)
 */
export class GridBox extends Box {
  static type$: sys.Type
  /**
   * How grid content is aligned horizontally against left-over
   * space. Valid values are `left`, `right`, `center`, or `fill`.
   */
  halign(): Align;
  halign(it: Align): void;
  /**
   * Insert row before given index.
   */
  insertRowBefore(index: number, cells: sys.List<dom.Elem | null>, colspan?: sys.List<number>): this;
  /**
   * Remove all rows of cells for this GridBox.
   */
  removeAllRows(): this;
  /**
   * Return the row index that this child exists under, or `null`
   * if child was not found in this GridBox.
   */
  rowIndexOf(child: dom.Elem): number | null;
  /**
   * The number of rows in this GridBox.
   */
  numRows(): number;
  /**
   * Add a new row to grid.
   */
  addRow(cells: sys.List<dom.Elem | null>, colspan?: sys.List<number>): this;
  /**
   * Remove the row of cells at given index.
   */
  removeRow(index: number): this;
  static make(...args: unknown[]): GridBox;
  /**
   * Set style for cells. Valid values for `col` and `row`:
   * - Specific index (0, 1, 2, etc)
   * - Range of indexes (0..4, 7..<8, etc)
   * - "*":    apply to all row or columns
   * - "even": apply only to even row or columns indexes
   * - "odd":  apply only to odd row or column indexes
   */
  cellStyle(col: sys.JsObj, row: sys.JsObj, style: string): this;
}

/**
 * MenuItem for a {@link Menu | Menu}
 */
export class MenuItem extends dom.Elem {
  static type$: sys.Type
  enabled(): boolean | null;
  enabled(it: boolean | null): void;
  /**
   * Callback when item is selected.
   */
  onAction(f: ((arg0: this) => void)): void;
  static make(...args: unknown[]): MenuItem;
}

/**
 * Alignment enums: top, left, bottom, right, center, fill
 */
export class Align extends sys.Enum {
  static type$: sys.Type
  /**
   * List of Align values indexed by ordinal
   */
  static vals(): sys.List<Align>;
  static bottom(): Align;
  static center(): Align;
  static right(): Align;
  static fill(): Align;
  static top(): Align;
  static left(): Align;
  /**
   * Return the Align instance for the specified name.  If not a
   * valid name and checked is false return null, otherwise throw
   * ParseErr.
   */
  static fromStr(name: string, checked?: boolean, ...args: unknown[]): Align;
}

/**
 * SashBox lays out children in a single direction allowing
 * both fixed and pertange sizes that can fill the parent
 * container.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Layout#sashBox)
 */
export class SashBox extends Box {
  static type$: sys.Type
  /**
   * Direction to layout child elements:
   * - `Dir.right`: layout children left to right
   * - `Dir.down`: layout childrent top to bottom
   */
  dir(): Dir;
  dir(it: Dir): void;
  /**
   * Size to apply to each child, width or height based on {@link dir | dir}.
   * Fixed `px` and percentage sizes are allowed.  Percentage sizes
   * will be subtracted from total fixed size using CSS `calc()`
   * method.
   */
  sizes(): sys.List<string>;
  sizes(it: sys.List<string>): void;
  /**
   * Minimum size a child can be resized to if `resizable` is `true`.
   * Only percentage sizes allowed.
   */
  minSize(): string;
  minSize(it: string): void;
  /**
   * Allow user to resize sash positions. See {@link div | div}.
   */
  resizable(): boolean;
  resizable(it: boolean): void;
  /**
   * Create a new divider element for resizing children. Dividers
   * are required between children when {@link resizable | resizable}
   * is `true`.
   */
  static div(): dom.Elem;
  /**
   * Callback when user resizes a sash pane if {@link resizable | resizable}
   * is `true`.
   */
  onSashResize(f: ((arg0: this) => void)): void;
  static make(...args: unknown[]): SashBox;
}

/**
 * FilePicker allows selection of files.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#filePicker)
 */
export class FilePicker extends dom.Elem {
  static type$: sys.Type
  /**
   * Does this picker allow selecting multiple files?
   */
  multi(): boolean;
  multi(it: boolean): void;
  /**
   * Indicate the types of files that the server accepts. The
   * value must be a comma-separated list of unique content type
   * specifiers:
   * - A file extension starting with a `.`: (e.g. .jpg, .png, .doc)
   * - A valid MIME type with no extensions
   * - `audio/*` representing sound files
   * - `video/*` representing video files
   * - `image/*` representing image files
   */
  accept(): string | null;
  accept(it: string | null): void;
  /**
   * Get the list of currently selected files.
   */
  files(): sys.List<dom.DomFile>;
  /**
   * Reset picker to no selection.
   */
  reset(): void;
  /**
   * Callback when a file has been selected by this picker.
   */
  onSelect(f: ((arg0: FilePicker) => void)): void;
  static make(...args: unknown[]): FilePicker;
  /**
   * Programmtically open the client file chooser interface.
   */
  open(): void;
}

/**
 * WellBox displays content in a recessed well.
 */
export class WellBox extends Box {
  static type$: sys.Type
  static make(...args: unknown[]): WellBox;
}

/**
 * Popup menu
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#menu),
 * {@link MenuItem | MenuItem}
 */
export class Menu extends Popup {
  static type$: sys.Type
  static make(...args: unknown[]): Menu;
}

/**
 * Table displays a grid of rows and columns.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#table)
 */
export class Table extends dom.Elem {
  static type$: sys.Type
  /**
   * Model for this table.
   */
  model(): TableModel;
  model(it: TableModel): void;
  /**
   * List of CSS classes applied to rows in sequence, looping as
   * required.
   */
  stripeClasses(): sys.List<string>;
  stripeClasses(it: sys.List<string>): void;
  /**
   * Selection for table
   */
  sel(): Selection;
  sel(it: Selection): void;
  /**
   * Is the table header visible.
   */
  showHeader(): boolean;
  showHeader(it: boolean): void;
  /**
   * Scroll to the given row and column in table.  Pass `null` to
   * maintain the current scroll position for that axis.
   */
  scrollTo(col: number | null, row: number | null): void;
  /**
   * Callback when selection has changed.
   */
  onSelect(f: ((arg0: this) => void)): void;
  /**
   * The column index by which the table is currently sorted, or
   * null if the table is not currently sorted by a column.  See {@link sort | sort}.
   */
  sortCol(): number | null;
  /**
   * Return if the table is currently sorting up or down.  See {@link sort | sort}.
   */
  sortDir(): Dir;
  /**
   * Rebuild table layout.
   */
  rebuild(): void;
  /**
   * Refresh table cell content.
   */
  refresh(): void;
  /**
   * Callback when table is sorted by a column
   */
  onSort(f: ((arg0: this) => void)): void;
  /**
   * Callback to display header popup.  When non-null, a button
   * will be placed on the right-hand side of the table header to
   * indicate the popup is available.
   */
  onHeaderPopup(f: ((arg0: Table) => Popup)): void;
  /**
   * Callback when a event occurs inside a table cell.
   */
  onTableEvent(type: string, f: ((arg0: TableEvent) => void)): void;
  /**
   * Sort a table by the given column index. If col is null, then
   * the table is ordered by its natural order of the table
   * model. Sort order is determined by {@link TableModel.sortCompare | TableModel.sortCompare}.
   * Sorting does not modify the indexing of TableModel, it only
   * changes how the model is viewed.  Also see {@link sortCol | sortCol}
   * and {@link sortDir | sortDir}.  Table automatically
   * refreshed.
   */
  sort(col: number | null, dir?: Dir): void;
  /**
   * Callback when row is double-clicked.
   */
  onAction(f: ((arg0: this) => void)): void;
  /**
   * Constructor.
   */
  static make(...args: unknown[]): Table;
}

/**
 * ButtonGroup groups a set of toggle or radio buttons and
 * handles making sure only one button in group is selected at
 * a time.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#buttonGroup),
 * {@link ToggleButton | ToggleButton}, {@link RadioButton | RadioButton}
 */
export class ButtonGroup extends sys.Obj {
  static type$: sys.Type
  /**
   * Buttons in this group.
   */
  buttons(): sys.List<dom.Elem>;
  buttons(it: sys.List<dom.Elem>): void;
  /**
   * If `true`, child buttons will inherit the {@link enabled | enabled}
   * state of this `ButtonGroup`.  If `false` buttons can be enabled
   * or disabled independent of group.
   */
  inheritEnabled(): boolean;
  inheritEnabled(it: boolean): void;
  /**
   * Set enabled state for this button group.
   */
  enabled(): boolean;
  enabled(it: boolean): void;
  /**
   * Index of selected button, or `null` if none selected.
   */
  selIndex(): number | null;
  selIndex(it: number | null): void;
  /**
   * Convenience to add a button to {@link buttons | buttons}.
   */
  add(button: dom.Elem): this;
  /**
   * Callback when selection in group has changed.
   */
  onSelect(f: ((arg0: this) => void)): void;
  /**
   * Callback before a selection changes.  Return `true` to select
   * the new button (default), or `false` to keep the currently
   * selected button.
   */
  onBeforeSelect(f: ((arg0: ButtonGroup, arg1: number) => boolean)): void;
  static make(...args: unknown[]): ButtonGroup;
}

/**
 * Text field input element.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#textField)
 */
export class TextField extends dom.Elem {
  static type$: sys.Type
  /**
   * Set to `true` to mask characters inputed into field.
   */
  password(): boolean;
  password(it: boolean): void;
  /**
   * Value of text field.
   */
  val(): string;
  val(it: string): void;
  /**
   * Set to `true` to set field to readonly mode.
   */
  ro(): boolean;
  ro(it: boolean): void;
  /**
   * Hint that is displayed in the field before a user enters a
   * value that describes the expected input, or `null` for no
   * placeholder text.
   */
  placeholder(): string | null;
  placeholder(it: string | null): void;
  /**
   * Preferred width of field in columns, or `null` for default.
   */
  cols(): number | null;
  cols(it: number | null): void;
  /**
   * Select given range of text
   */
  select(start: number, end: number): void;
  /**
   * Callback when value is modified by user.
   */
  onModify(f: ((arg0: this) => void)): void;
  /**
   * Callback when `enter` key is pressed.
   */
  onAction(f: ((arg0: this) => void)): void;
  static make(...args: unknown[]): TextField;
}

/**
 * Tree visualizes {@link TreeNode | TreeNodes} as a series of
 * expandable nodes.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Controls#tree)
 */
export class Tree extends Box {
  static type$: sys.Type
  /**
   * Root nodes for this tree.
   */
  roots(): sys.List<TreeNode>;
  roots(it: sys.List<TreeNode>): void;
  /**
   * Selection for tree. Index based selection is not supported
   * for Tree.
   */
  sel(): Selection;
  sel(it: Selection): void;
  /**
   * Refresh given node.
   */
  refreshNode(node: TreeNode): void;
  /**
   * Set expanded state for given node.
   */
  expand(node: TreeNode, expanded: boolean): void;
  /**
   * Callback when selection changes.
   */
  onSelect(f: ((arg0: this) => void)): void;
  /**
   * Callback when a node has been double clicked.
   */
  onAction(f: ((arg0: Tree, arg1: dom.Event) => void)): void;
  /**
   * Callback when a event occurs inside a tree node.
   */
  onTreeEvent(type: string, f: ((arg0: TreeEvent) => void)): void;
  /**
   * Constructor.
   */
  static make(...args: unknown[]): Tree;
  /**
   * Rebuild tree layout.
   */
  rebuild(): void;
  /**
   * Refresh tree content.
   */
  refresh(): void;
}

/**
 * Box defaults style to:
 * ```
 * display: block;
 * box-sizing: border-box;
 * width: 100%;
 * height: 100%;
 * position: relative;
 * ```
 */
export class Box extends dom.Elem {
  static type$: sys.Type
  static make(...args: unknown[]): Box;
}

/**
 * DropTarget converts an Elem into a drop target for drag and
 * drop events. The `canDrop` callback is used to indicate if `data`
 * can be dropped on this target.  The `onDrop` callback is
 * invoked when a drop event completes.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Dnd)
 */
export class DropTarget extends sys.Obj {
  static type$: sys.Type
  /**
   * Callback to indicate if `data` can be dropped on this target.
   */
  canDrop(f: ((arg0: sys.JsObj) => boolean)): void;
  /**
   * Callback when drag target is over this drop target, where `pagePos`
   * is the current drag node.
   */
  onOver(f: ((arg0: graphics.Point) => void)): void;
  /**
   * Convert given Elem into a drop target.
   */
  static bind(elem: dom.Elem): DropTarget;
  /**
   * Callback when `data` is dropped on this target.
   */
  onDrop(f: ((arg0: sys.JsObj) => void)): void;
  /**
   * Callback when drag target has left this drop target.
   */
  onLeave(f: (() => void)): void;
}

/**
 * ScrollBox displays content in a scrollable viewport.
 */
export class ScrollBox extends Box {
  static type$: sys.Type
  /**
   * Callback when box is scrolled.
   */
  onScroll(f: ((arg0: this) => void)): void;
  static make(...args: unknown[]): ScrollBox;
}

/**
 * AccordionBox displays collapsible content panels for
 * presenting information in a limited amount of vertical
 * space, where the header element is used to collapse or
 * expand the child content.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Layout)
 */
export class AccordionBox extends Box {
  static type$: sys.Type
  /**
   * Return `true` if given group is expanded, or `false` if not.
   */
  isExpanded(groupIndex: number): boolean;
  /**
   * Set expanded state for given group.
   */
  expand(groupIndex: number, expanded: boolean): void;
  static make(...args: unknown[]): AccordionBox;
  /**
   * Add a new group with given header and child nodes.
   * Optionally configure default expansion state with `expanded`
   * paramter (defaults to collapsed).
   */
  addGroup(header: dom.Elem, kids: sys.List<dom.Elem>, expanded?: boolean): this;
}

/**
 * DragTarget converts an Elem into a drag target for a
 * drag-and-drop events.
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Dnd)
 */
export class DragTarget extends sys.Obj {
  static type$: sys.Type
  /**
   * Callback to customize the drag image for drag event.
   */
  onDragImage(f: ((arg0: sys.JsObj) => dom.Elem)): void;
  /**
   * Callback to get data payload for drag event.
   */
  onDrag(f: ((arg0: dom.Elem) => sys.JsObj)): void;
  /**
   * Convert given Elem into a drag target.
   */
  static bind(elem: dom.Elem): DragTarget;
  /**
   * Callback when the drag event has ended.
   */
  onEnd(f: ((arg0: dom.Elem) => void)): void;
}

/**
 * FlexBox lays out child elements based on the CSS Flexbox
 * Layout module, which primarily lays out items along a single
 * axis (the main axis).  Alignment can also be specified for
 * the opposite axis (the cross axis).
 * 
 * See also: [docDomkit](https://fantom.org/doc/docDomkit/Layout#flexBox)
 */
export class FlexBox extends Box {
  static type$: sys.Type
  /**
   * Direction of the main axis to layout child items:
   * - "row": layout children left to right
   * - "column": layout childrent top to bottom
   */
  dir(): string;
  dir(it: string): void;
  /**
   * Define child alignment along main axis:
   * - "flex-start": items are packed toward start of line
   * - "flex-end": items are packed toward end of line
   * - "center": items are centered along the line
   * - "space-between": extra space is evenly distributed between
   *   items
   * - "space-around": extra space is evenly distributed around
   *   items
   */
  alignMain(): string;
  alignMain(it: string): void;
  /**
   * Define how multiple lines of content are aligned when extra
   * space exists in the cross axis:
   * - "flex-start": lines are packed to top of cross axis
   * - "flex-end": lines are packed to bottom of cross axis
   * - "center": lines are packed along center of cross axis
   * - "space-around": extra space is evenly divided between lines
   * - "space-between": extra space is evenly divided around lines
   * - "stretch": stretch lines to fill container
   * 
   * This value has no effect for single line layouts.
   */
  alignLines(): string;
  alignLines(it: string): void;
  /**
   * Convenience to configure the shorthand `flex` values outside
   * of child items, where the list position maps to the index of
   * the child node. Any value here will override the value
   * specified in the child.
   */
  flex(): sys.List<string>;
  flex(it: sys.List<string>): void;
  /**
   * Define child alignment along cross axis:
   * - "flex-start": items are aligned to top of cross axis
   * - "flex-end": items are aligned to bottom of cross axis
   * - "center": items are centered along cross axis
   * - "baseline": items are aligned so baselines match
   * - "stretch": stretch items to fill container
   */
  alignCross(): string;
  alignCross(it: string): void;
  /**
   * Define how items are wrapped when content cannot  fit in a
   * single line/column:
   * - "nowrap": do not wrap; items are clipped
   * - "wrap: wrap items onto the next line or column
   */
  wrap(): string;
  wrap(it: string): void;
  static make(...args: unknown[]): FlexBox;
}

