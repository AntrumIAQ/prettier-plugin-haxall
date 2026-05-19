import * as sys from './sys.js';
import * as util from './util.js';
import * as xeto from './xeto.js';
import * as xetoEnv from './xetoEnv.js';
import * as haystack from './haystack.js';
import * as axon from './axon.js';
import * as hx from './hx.js';

/**
 * Xeto function library
 */
export class XetoLib extends hx.HxLib {
  static type$: sys.Type
  static make(...args: unknown[]): XetoLib;
}

/**
 * Axon functions for working with xeto specs
 */
export class XetoFuncs extends sys.Obj {
  static type$: sys.Type
  /**
   * Return fully qualified name of the spec:
   * - Top-level type will return "foo.bar::Baz"
   * - Slot spec will return "foo.bar::Baz.qux"
   * - Derived specs will return "derived123::{name}"
   * 
   * Examples:
   * ```
   * specQName(Dict)  >>  "sys::Dict"
   * specQName(Site)  >>  "ph::Site"
   * ```
   */
  static specQName(spec: xeto.Spec): string;
  /**
   * Data type of the spec.  Returns the spec itself if given a
   * top-level type.
   * 
   * Examples:
   * ```
   * specType(Str)                      >>  sys:Str
   * spec("ph::Equip.equip").specType   >>  sys::Marker
   * ```
   */
  static specType(spec: xeto.Spec): xeto.Spec;
  /**
   * Load or lookup a Xeto library by its string or ref name. 
   * Return the {@link xeto.Lib | dict} representation.  If not
   * found raise exception or return null based on checked flag.
   * 
   * Examples:
   * ```
   * specLib("ph.points")            // load by dotted name
   * specLib(@lib:ph.points)         // load by lib ref id
   * specLib("bad.lib.name")         // raises exception if not found
   * specLib("bad.lib.name", false)  // unchecked returns null
   * ```
   */
  static specLib(name: sys.JsObj, checked?: boolean): xeto.Lib | null;
  /**
   * Load or lookup a instance from a Xeto library by its string
   * or ref qname as a Dict. If not found raise exception or
   * return null based on checked flag.
   * 
   * NOTE: this function returns the instance using Haystack level
   * fidelity
   * 
   * Examples:
   * ```
   * instance("icons::apple")             // qname string
   * instance(@icons::apple)              // qname Ref id
   * instance("icons::bad-name")          // raises exception if not found
   * instance("icons::bad-name", false)   // unchecked returns null
   * ```
   */
  static instance(qname: sys.JsObj, checked?: boolean): xeto.Dict | null;
  /**
   * Lookup instances from Xeto libs as a list of dicts.
   * 
   * Scope may one of the following:
   * - null: all instances from all libs currently in the using
   *   scope
   * - lib: all instances declared in given library
   * - list of lib: all instances in given libraries
   * 
   * If the filter is null, then it filters the instances from
   * the scope.
   * 
   * NOTE: this function returns the instances using Haystack level
   * fidelity
   * 
   * Examples:
   * ```
   * instances()                  // all instances in scope
   * specLib("icons").instances   // instances in a given library
   * instances(null, a and b)     // filter instances with filter expression
   * ```
   */
  static instances(scope?: axon.Expr, filter?: axon.Expr): sys.List<xeto.Dict>;
  /**
   * Return if the given instance inherits from the spec via
   * nominal typing.  Use [specIs()](specIs()) to check nominal
   * typing between two types. Also see [fits()](fits()) and [specFits()](specFits())
   * to check via structural typing.
   * 
   * Note that dict values will only match the generic `sys.Dict`
   * type.  Use [fits()](fits()) for structural type matching.
   * 
   * Examples:
   * ```
   * is("hi", Str)       >>  true
   * is("hi", Dict)      >>  false
   * is({}, Dict)        >>  true
   * is({equip}, Equip)  >>  false
   * is(Str, Spec)       >>  true
   * ```
   */
  static _is(val: sys.JsObj | null, spec: xeto.Spec): boolean;
  /**
   * Evaluate a relationship query and return grid of results.
   * Subject must be a record id or dict in the database.  Spec
   * must be a Spec typed as a `sys::Query`.  Also see {@link query | query}.
   * 
   * Options:
   * - `limit`: max number of recs to return
   * - `sort`: sort by display name Example:
   *   read(ahu).queryAll(spec("ph::Equip.points"))
   */
  static queryAll(subject: sys.JsObj, spec: xeto.Spec, opts?: xeto.Dict | null): haystack.Grid;
  /**
   * Create the default instance for a given spec. Raise
   * exception if spec is abstract.
   * 
   * The default behavior for dict types is to return a single
   * Dict. However, if the type has a constrainted query, then an
   * entire graph can be instantiated via the `{graph}` option in
   * which case a Dict[] is returned.  In graph mode an `id` is
   * generated for recs for cross-linking.
   * 
   * Also see {@link xeto.LibNamespace.instantiate | xeto::LibNamespace.instantiate}.
   * 
   * NOTE: this function forces the `haystack` option to force all
   * non-Haystack scalars to be simple strings.
   * 
   * Options:
   * - `graph`: marker tag to instantiate a graph of recs
   * - `abstract`: marker to supress error if spec is abstract
   * 
   * Examples:
   * ```
   * // evaluates to 2000-01-01
   * instantiate(Date)
   * 
   * // evaluates to dict {equip, vav, hotWaterHeating, ...}
   * instantiate(G36ReheatVav)
   * 
   * // evaluates to dict[] of vav + points from constrained query
   * instantiate(G36ReheatVav, {graph})
   * ```
   */
  static instantiate(spec: xeto.Spec, opts?: xeto.Dict | null): sys.JsObj | null;
  /**
   * Return grid which explains how data fits the given spec. 
   * This function takes one or more recs and returns a grid. 
   * For each rec zero or more rows are returned with an error
   * why the rec does not fit the given type.  If a rec does fit
   * the type, then zero rows are returned for that record.
   * 
   * If you pass null for the spec, then each record is fit
   * against its declared `spec` tag.  If a given rec is missing a `spec`
   * tag then it is reported an error.
   * 
   * See [fits()](fits()) for list of options.
   * 
   * Example:
   * ```
   * // validate tags on records only
   * readAll(vav and hotWaterHeating).fitsExplain(G36ReheatVav)
   * 
   * // validate tags and required points and other graph queries
   * readAll(vav and hotWaterHeating).fitsExplain(G36ReheatVav, {graph})
   * ```
   */
  static fitsExplain(recs: sys.JsObj | null, spec: xeto.Spec | null, opts?: xeto.Dict | null): haystack.Grid;
  /**
   * Load or lookup a Xeto spec by its string or ref qname. 
   * Return the {@link xeto.Spec | dict} representation.  If not
   * found raise exception or return null based on checked flag.
   * 
   * NOTE: returns the same Spec instance as returned by {@link xeto.LibNamespace | xeto::LibNamespace}.
   * The spec meta is modeled using full fidelity and *not*
   * haystack fidelity. Use {@link specMeta | specMeta} to
   * normalize to haystack fidelity for use inside Axon.
   * 
   * Examples:
   * ```
   * spec("ph::Meter")         // type string
   * spec(@ph::Meter)          // type id
   * spec("sys::Spec.of")      // slot
   * spec("foo::Bad")          // raises exception if not found
   * spec("foo::Bad", false)   // unchecked returns null
   * ```
   */
  static spec(qname: sys.JsObj, checked?: boolean): xeto.Spec | null;
  /**
   * List Xeto specs as a list of their {@link xeto.Spec | dict}
   * representation. Scope may one of the following:
   * - null: return all the top-level specs currently in the using
   *   scope
   * - lib: return all the top-level specs declared in given
   *   library
   * - list of lib: all specs in given libraries
   * 
   * A filter may be specified to filter the specs found in the
   * scope.  The dict representation for filtering supports a
   * "slots" tag on each spec with a Dict of the effective slots
   * name.  This allows filtering slots using the syntax `slots->someName`.
   * 
   * NOTE: returns the same Spec instances as returned by {@link xeto.LibNamespace | xeto::LibNamespace}.
   * The spec meta is modeled using full fidelity and *not*
   * haystack fidelity. Use {@link specMeta | specMeta} to
   * normalize to haystack fidelity for use inside Axon.
   * 
   * Examples:
   * ```
   * specs()                  // specs in using scope
   * specLib("ph").specs      // specs in a given library
   * specs(null, abstract)    // filter specs with filter expression
   * specs(null, slots->ahu)  // filter specs have ahu tag
   * ```
   */
  static specs(scope?: axon.Expr, filter?: axon.Expr): sys.List<xeto.Spec>;
  /**
   * Return if spec `a` fits spec `b` based on structural typing. Use
   * [fits()](fits()) to check if an instance fits a given type. 
   * Also see [is()](is()) and [specIs()](specIs()) to check using
   * nominal typing.
   * 
   * Examples:
   * ```
   * specFits(Meter, Equip)    >>  true
   * specFits(Meter, Point)    >>  false
   * ```
   */
  static specFits(a: xeto.Spec, b: xeto.Spec): boolean;
  /**
   * Return if spec `a` inherits from spec `b` based on nominal
   * typing. This method checks the explicit inheritance
   * hierarchy via [specBase()](specBase()). Use [is()](is()) to
   * check if an instance is of a given type.  Also see [fits()](fits())
   * and [specFits()](specFits()) to check using structural
   * typing.
   * 
   * Examples:
   * ```
   * specIs(Str, Scalar)     >>  true
   * specIs(Scalar, Scalar)  >>  false
   * specIs(Equip, Dict)     >>  true
   * specIs(Meter, Equip)    >>  true
   * specIs(Meter, Point)    >>  false
   * ```
   */
  static specIs(a: xeto.Spec, b: xeto.Spec): boolean;
  /**
   * Evaluate a relationship query and return the named
   * constraints as a dict.  The query slot names are the dict
   * names and the matching record dicts are the dict values.
   * Missing matches are silently ignored and ambiguous matches
   * return an indeterminate record.
   * 
   * Example:
   * ```
   * // spec
   * MyAhu: Equip {
   *   points: {
   *     dat: DischargeAirTempSensor
   *     rat: DischargeAirTempSensor
   *   }
   * }
   * 
   * // axon
   * myAhuPoints: read(ahu).queryNamed(spec("mylib::MyAhu.points"))
   * 
   * // result
   * {
   *   dat: {dis:"DAT", discharge, air, temp, sensor, ...},
   *   rat: {dis:"RAT", return, air, temp, sensor, ...}
   * }
   * ```
   */
  static queryNamed(subject: sys.JsObj, spec: xeto.Spec, opts?: xeto.Dict | null): xeto.Dict;
  /**
   * Parent spec which contains given spec and scopes its name.
   * Returns null for top-level specs within their library.
   * 
   * Examples:
   * ```
   * specParent(Str)  >>  sys
   * ```
   */
  static specParent(spec: xeto.Spec): xeto.Spec | null;
  /**
   * Match dict recs against specs to find all the specs that
   * fit.  The recs argument can be anything accepted by [toRecList()](toRecList()).
   * Specs must be a Spec or list of Specs.  If specs argument is
   * omitted, then we match against all the non-abstract [types](specs())
   * currently in scope.  Only the most specific subtype is
   * returned.
   * 
   * Result is a grid for each input rec with the following
   * columns:
   * - id: of the input record
   * - num: number of matches
   * - specs: list of Spec for all matching specs
   * 
   * See [fits()](fits()) for a list of supported fit options.
   * 
   * Example:
   * ```
   * readAll(equip).fitsMatchAll
   * ```
   */
  static fitsMatchAll(recs: sys.JsObj | null, specs?: sys.JsObj | null, opts?: xeto.Dict | null): haystack.Grid;
  /**
   * Get the spec's declared children slots as dict of Specs.
   * 
   * Examples:
   * ```
   * specSlots(Ahu)  >>  {ahu: Spec}
   * ```
   */
  static specSlotsOwn(spec: xeto.Spec): xeto.Dict;
  /**
   * Get the spec's own declared meta-data as dict.
   * 
   * NOTE: this function returns the meta using haystack level fidelity
   * 
   * Examples:
   * ```
   * specMetaOwn(Date)  >>  {sealed, val:2000-01-01, doc:"...", pattern:"..."}
   * ```
   */
  static specMetaOwn(spec: xeto.Spec): xeto.Dict;
  static make(...args: unknown[]): XetoFuncs;
  /**
   * Base spec from which the given spec directly inherits.
   * Returns null if spec is `sys::Obj` itself.
   * 
   * Examples:
   * ```
   * specBase(Str)    >>  sys::Scalar
   * specBase(Meter)  >>  ph::Equip
   * specType(Equip)  >>  ph::Entity
   * ```
   */
  static specBase(spec: xeto.Spec): xeto.Spec | null;
  /**
   * Return the Xeto spec of the given value.  Raise exception if
   * value type is not mapped into the data type system.  Also
   * see [is()](is()) and [fits()](fits()).
   * 
   * Examples:
   * ```
   * specOf("hi")                 >>  sys::Str
   * specOf(@id)                  >>  sys::Ref
   * specOf({})                   >>  sys::Dict
   * specOf({spec:@ph::Equip})    >>  ph::Dict
   * ```
   */
  static specOf(val: sys.JsObj | null, checked?: boolean): xeto.Spec | null;
  /**
   * Given a choice spec, return the most specific choice subtype
   * implemented by the instance.  If the instance implements
   * zero or more than one subtype of the choice, then return
   * null or raise an exception based on the checked flag.  The
   * instance may be anything accepted by the [toRec()](toRec())
   * function.
   * 
   * Example:
   * ```
   * choiceOf({discharge, duct}, DuctSection)  >>  DischargeDuct
   * choiceOf({hot, water}, Fluid)             >>  HotWater
   * ```
   */
  static choiceOf(instance: sys.JsObj, choice: xeto.Spec, checked?: boolean): xeto.Spec | null;
  /**
   * Return a grid explaining why spec `a` does not fit `b`. If `a`
   * does fit `b` then return an empty grid.
   */
  static specFitsExplain(a: xeto.Spec, b: xeto.Spec): haystack.Grid;
  /**
   * Evaluate a relationship query and return record dict.  If no
   * matches found throw UnknownRecErr or return null based on
   * checked flag. If there are multiple matches it is
   * indeterminate which one is returned.  Subject must be a
   * record id or dict in the database.  Spec must be a Spec
   * typed as a `sys::Query`.  Also see {@link queryAll | queryAll}.
   * 
   * Example:
   * ```
   * read(point).query(spec("ph::Point.equips"))
   * ```
   */
  static query(subject: sys.JsObj, spec: xeto.Spec, checked?: boolean): xeto.Dict | null;
  /**
   * Return if the given instance fits the spec via structural
   * typing. Use [specFits()](specFits()) to check structural
   * typing between two types. Also see [is()](is()) and [specIs()](specIs())
   * to check via nominal typing.  Use [fitsExplain()](fitsExplain())
   * to explain why fits returns true or false.
   * 
   * If the val is a Dict, then the default behavior is to only
   * check the dict's tags against the given spec.  In this mode
   * all spec query slots are ignored.  Pass the `{graph}` option
   * to also check queries to validate the graph of entities. 
   * For example, the graph option can be used with equip specs
   * to validate required points.
   * 
   * Options:
   * - `graph`: marker to also check graph of references such as
   *   required points
   * - `ignoreRefs`: marker to not validate if refs exist or match
   *   target spec
   * 
   * Examples:
   * ```
   * fits("foo", Str)               >>  true
   * fits(123, Str)                 >>  false
   * fits({equip}, Equip)           >>  true
   * fits({equip}, Site)            >>  false
   * fits(vav, MyVavSpec)           >> validate tags only
   * fits(vav, MyVavSpec, {graph})  >> validate tags and required points
   * ```
   */
  static fits(val: sys.JsObj | null, spec: xeto.Spec, opts?: xeto.Dict | null): boolean;
  /**
   * Get the effective children slots as a dict of Specs.
   * 
   * Examples:
   * ```
   * specSlots(Ahu)  >>  {equip: Spec, points: Spec, ahu: Spec}
   * ```
   */
  static specSlots(spec: xeto.Spec): xeto.Dict;
  /**
   * Get the spec's effective declared meta-data as dict.
   * 
   * NOTE: this function returns the meta using haystack level fidelity
   * 
   * Examples:
   * ```
   * specMeta(Date)  >>  {sealed, val:2000-01-01, doc:"...", pattern:"..."}
   * ```
   */
  static specMeta(spec: xeto.Spec): xeto.Dict;
  /**
   * Return simple name of spec.
   * 
   * Examples:
   * ```
   * specName(Dict)  >>  "Dict"
   * specName(Site)  >>  "Site"
   * ```
   */
  static specName(spec: xeto.Spec): string;
  /**
   * List Xeto libraries as a list of their {@link xeto.Lib | dict}
   * representation. Is scope is null then return all installed
   * libs (libs not yet loaded will not have their metadata). 
   * Otherwise scope must be a filter expression used to filter
   * the dict representation.
   * 
   * Examples:
   * ```
   * specLibs()             // all installed libs
   * specLibs(loaded)       // only libs loaded into memory
   * ```
   */
  static specLibs(scope?: axon.Expr): sys.List<xeto.Dict>;
}

