import * as node from './node.js';
const js = (typeof window !== 'undefined') ? window : globalThis;

class Obj {
  static #hashCounter = 0;
  #hash;
  equals(that) { return this === that; }
  compare(that) {
    if (this < that) return -1;
    if (this > that) return 1;
    return 0;
  }
  hash() {
    if (this.#hash === undefined) this.#hash = Obj.#hashCounter++;
    return this.#hash;
  }
  with(f) {
    f(this);
    return this;
  }
  isImmutable() { return this.typeof().isConst(); }
  toImmutable() {
    if (this.isImmutable()) return this;
    throw NotImmutableErr.make(this.typeof().toStr());
  }
  toStr() { return `${this.typeof()}@${this.hash()}`; }
  toString() { return "" + this.toStr(); }
  trap(name, args=null) { return ObjUtil.doTrap(this, name, args, this.typeof()); }
}
class Facet extends Obj {
  constructor() { super(); }
}
class Deprecated extends Obj {
  constructor(f=null) {
    super();
    if (f != null) f(this);
  }
  #msg;
  msg() { return this.#msg; }
  __msg(it) { this.#msg = it; }
  static make(f=null) { return new Deprecated(f); }
  toStr() { return fanx_ObjEncoder.encode(this); }
}
class FacetMeta extends Obj {
  constructor(f=null) {
    super();
    this.#inherited = false;
    if (f != null) f(this);
  }
  #inherited;
  inherited() { return this.#inherited; }
  __inherited(it) { this.#inherited = it; }
  static make(f=null) { return new FacetMeta(f); }
  toStr() { return fanx_ObjEncoder.encode(this); }
}
class Js extends Obj {
  constructor() { super(); }
  static #defVal;
  static defVal() {
    if (!Js.#defVal) Js.#defVal = new Js();
    return Js.#defVal;
  }
  toStr() { return this.typeof().qname(); }
}
class NoDoc extends Obj {
  constructor() { super(); }
  static #defVal;
  static defVal() {
    if (!NoDoc.#defVal) NoDoc.#defVal = new NoDoc();
    return NoDoc.#defVal;
  }
  toStr() { return this.typeof().qname(); }
}
class Operator extends Obj {
  constructor() { super(); }
  static #defVal;
  static defVal() {
    if (!Operator.#defVal) Operator.#defVal = new Operator();
    return Operator.#defVal;
  }
  toStr() { return this.typeof().qname(); }
}
class Serializable extends Obj {
  constructor(f=null) {
    super();
    this.#simple = false;
    this.#collection = false;
    if (f != null) f(this);
  }
  #simple;
  #collection;
  simple() { return this.#simple; }
  __simple(it) { this.#simple = it; }
  collection() { return this.#collection; }
  __collection(it) { this.#collection = it; }
  static make(f=null) { return new Serializable(f); }
  toStr() { return fanx_ObjEncoder.encode(this); }
}
class Transient extends Obj {
  constructor() { super(); }
  static #defVal;
  static defVal() {
    if (!Transient.#defVal) Transient.#defVal = new Transient();
    return Transient.#defVal;
  }
  toStr() { return this.typeof().qname(); }
}
class TimeZone extends Obj {
  constructor(name, fullName, rules) {
    super();
    this.#name = name;
    this.#fullName = fullName;
    this.#rules = rules;
  }
  #name;
  #fullName;
  #rules;
  static #cache = {};
  static #names = [];
  static #fullNames = [];
  static #aliases = {};
  static #utc = undefined;
  static #rel = undefined;
  static #cur = undefined;
  static #defVal = undefined;
  static defVal() {
    if (TimeZone.#defVal === undefined) TimeZone.#defVal = TimeZone.#utc;
    return TimeZone.#defVal;
  }
  static listNames() {
    return List.make(Str.type$, TimeZone.#names).ro();
  }
  static listFullNames() {
    return List.make(Str.type$, TimeZone.#fullNames).ro();
  }
  static fromStr(name, checked=true) {
    let tz = TimeZone.#fromCache(name);
    if (tz != null) return tz;
    let target = TimeZone.#aliases[name];
    tz = TimeZone.#fromCache(target);
    if (tz != null) return tz;
    if (checked) throw ParseErr.make("TimeZone not found: " + name);
    return null;
  }
  static utc() {
    if (TimeZone.#utc === undefined) TimeZone.#utc = TimeZone.fromStr("UTC");
    return TimeZone.#utc;
  }
  static rel() {
    if (TimeZone.#rel === undefined) TimeZone.#rel = TimeZone.fromStr("Rel");
    return TimeZone.#rel;
  }
  static cur() {
    if (TimeZone.#cur === undefined) {
      try {
        let tz = Env.cur().vars().get("timezone");
        if (tz == null) tz = Intl.DateTimeFormat().resolvedOptions().timeZone.split("/")[1];
        if (tz == null) tz = "UTC"
        TimeZone.#cur = TimeZone.fromStr(tz);
      }
      catch (err) {
        console.log(Err.make(err).msg());
        TimeZone.#cur = TimeZone.utc();
      }
    }
    return TimeZone.#cur;
  }
  static __fromGmtOffset(offset=0) {
    if (offset == 0)
      return TimeZone.utc();
    else
      return TimeZone.fromStr("GMT" + (offset < 0 ? "+" : "-") + Int.div(Math.abs(offset), 3600));
  }
  toStr() { return this.#name; }
  name() { return this.#name; }
  fullName() { return this.#fullName; }
  offset(year) {
    return Duration.make(this.__rule(year).offset * Duration.nsPerSec$);
  }
  dstOffset(year) {
    const r = this.__rule(year);
    if (r.dstOffset == 0) return null;
    return Duration.make(r.dstOffset * Duration.nsPerSec$);
  }
  stdAbbr(year) { return this.__rule(year).stdAbbr; }
  dstAbbr(year) { return this.__rule(year).dstAbbr; }
  abbr(year, inDST) {
    return inDST ? this.__rule(year).dstAbbr : this.__rule(year).stdAbbr;
  }
  __rule(year) {
    let rule = this.#rules[0];
    if (year >= rule.startYear) return rule;
    for (let i=1; i<this.#rules.length; ++i)
      if (year >= (rule = this.#rules[i]).startYear) return rule;
    return this.#rules[this.#rules.length-1];
  }
  static __dstOffset(rule, year, mon, day, time) {
    const start = rule.dstStart;
    const end   = rule.dstEnd;
    if (start == null) return 0;
    const s = TimeZone.#compare(rule, start, year, mon, day, time);
    const e = TimeZone.#compare(rule, end,   year, mon, day, time);
    if (end.mon < start.mon) {
      if (e > 0 || s <= 0) return rule.dstOffset;
    }
    else {
      if (s <= 0 && e > 0) return rule.dstOffset;
    }
    return 0;
  }
  static #compare(rule, x, year, mon, day, time) {
    let c = TimeZone.#compareMonth(x, mon);
    if (c != 0) return c;
    c = TimeZone.#compareOnDay(rule, x, year, mon, day);
    if (c != 0) return c;
    return TimeZone.#compareAtTime(rule, x, time);
  }
  static __isDstDate(rule, x, year, mon, day) {
    return TimeZone.#compareMonth(x, mon) == 0 &&
           TimeZone.#compareOnDay(rule, x, year, mon, day) == 0;
  }
  static #compareMonth(x, mon) {
    if (x.mon < mon) return -1;
    if (x.mon > mon) return +1;
    return 0;
  }
  static #compareOnDay(rule, x, year, mon, day) {
    if (x.atMode == 'u' && rule.offset + x.atTime < 0)
      ++day;
    switch (x.onMode) {
      case 'd':
        if (x.onDay < day) return -1;
        if (x.onDay > day) return +1;
        return 0;
      case 'l':
        const last = DateTime.weekdayInMonth(year, Month.vals().get(mon), Weekday.vals().get(x.onWeekday), -1);
        if (last < day) return -1;
        if (last > day) return +1;
        return 0;
      case '>':
        let start = DateTime.weekdayInMonth(year, Month.vals().get(mon), Weekday.vals().get(x.onWeekday), 1);
        while (start < x.onDay) start += 7;
        if (start < day) return -1;
        if (start > day) return +1;
        return 0;
      case '<':
        let lastw = DateTime.weekdayInMonth(year, Month.vals().get(mon), Weekday.vals().get(x.onWeekday), -1);
        while (lastw > x.onDay) lastw -= 7;
        if (lastw < day) return -1;
        if (lastw > day) return +1;
        return 0;
      default:
        throw new Error('' + x.onMode);
    }
  }
  static #compareAtTime(rule, x, time) {
    let atTime = x.atTime;
    if (x.atMode == 'u') {
      if (rule.offset + x.atTime < 0)
        atTime = 24*60*60 + rule.offset + x.atTime;
      else
        atTime += rule.offset;
    }
    if (atTime < time) return -1;
    if (atTime > time) return +1;
    return 0;
  }
  static __cache(fullName, encoded) {
    const city = fullName.split("/").reverse()[0];
    TimeZone.#cache[city] = encoded;
    TimeZone.#cache[fullName] = encoded;
    TimeZone.#names.push(city);
    TimeZone.#fullNames.push(fullName);
  }
  static #fromCache(name) {
    let entry = TimeZone.#cache[name];
    if (entry == null || entry === undefined) return null;
    if ((typeof entry) !== 'string') return entry;
    const buf = Buf.fromBase64(entry);
    const fullName = buf.readUtf();
    const city = fullName.split("/").reverse()[0];
    const decodeDst = () => {
      const dst = new TimeZoneDstTime(
        buf.read(),
        buf.read(),
        buf.read(),
        buf.read(),
        buf.readS4(),
        buf.read()
      );
      return dst;
    };
    let rule;
    const rules = [];
    while (buf.more()) {
      rule = new TimeZoneRule();
      rule.startYear = buf.readS2();
      rule.offset    = buf.readS4();
      rule.stdAbbr   = buf.readUtf();
      rule.dstOffset = buf.readS4();
      if (rule.dstOffset != 0) {
        rule.dstAbbr  = buf.readUtf();
        rule.dstStart = decodeDst();
        rule.dstEnd   = decodeDst();
      }
      rules.push(rule);
    }
    const tz = new TimeZone(city, fullName, rules);
    TimeZone.#cache[city] = tz;
    TimeZone.#cache[fullName] = tz;
    return tz;
  }
  static __alias(alias, target) {
    const parts = alias.split("/");
    TimeZone.#aliases[alias] = target;
    if (parts.length > 1) TimeZone.#aliases[parts[parts.length-1]] = target;
  }
}
class TimeZoneRule {
  constructor() { }
  startYear = null;
  offset = null;
  stdAbbr = null;
  dstOffset = null;
  dstAbbr = null;
  dstStart = null;
  dstEnd = null;
  isWallTime() { return this.dstStart.atMode == 'w'; }
}
class TimeZoneDstTime  {
  constructor(mon, onMode, onWeekday, onDay, atTime, atMode) {
    this.mon = mon;
    this.onMode = String.fromCharCode(onMode);
    this.onWeekday = onWeekday;
    this.onDay = onDay;
    this.atTime = atTime;
    this.atMode = String.fromCharCode(atMode);
  }
  mon;
  onMode;
  onWeekday;
  onDay;
  atTime;
  atMode;
}
class Uri extends Obj {
  constructor(sections) {
    super();
    this.#scheme   = sections.scheme;
    this.#userInfo = sections.userInfo;
    this.#host     = sections.host;
    this.#port     = sections.port;
    this.#pathStr  = sections.pathStr;
    this.#path     = sections.path.toImmutable();
    this.#queryStr = sections.queryStr;
    this.#query    = sections.query.toImmutable();
    this.#frag     = sections.frag;
    this.#str      = sections.str != null ? sections.str : new UriEncoder(this, false).encode();
    this.#encoded  = null;
  }
  #scheme;
  #userInfo;
  #host;
  #port;
  #pathStr;
  #path;
  #queryStr;
  #query;
  #frag;
  #str;
  #encoded;
  static #defVal;
  static defVal() {
    if (Uri.#defVal === undefined) Uri.#defVal = Uri.fromStr("");
    return Uri.#defVal;
  }
  static #_parentRange;
  static #parentRange() {
    if (!Uri.#_parentRange) Uri.#_parentRange = Range.make(0, -2, false);
    return Uri.#_parentRange;
  }
  static fromStr(s, checked=true) {
    try {
      return new Uri(new UriDecoder(s, false).decode());
    }
    catch (err) {
      if (!checked) return null;
      throw ParseErr.makeStr("Uri", s, null, err);
    }
  }
  static decode(s, checked=true) {
    try {
      return new Uri(new UriDecoder(s, true).decode());
    }
    catch (err) {
      if (!checked) return null;
      throw ParseErr.makeStr("Uri", s, null, err);
    }
  }
  static decodeQuery(s) {
    try {
      return new UriDecoder(s, true).decodeQuery();
    }
    catch (err) {
      if (err instanceof ArgErr)
        throw ArgErr.make("Invalid Uri query: `" + s + "`: " + err.msg());
      throw ArgErr.make("Invalid Uri query: `" + s + "`");
    }
  }
  static encodeQuery(map) {
    let buf  = "";
    const keys = map.keys();
    const len  = keys.size();
    for (let i=0; i<len; i++) {
      const key = keys.get(i);
      const val = map.get(key);
      if (buf.length > 0) buf += '&';
      buf = Uri.#encodeQueryStr(buf, key);
      if (val != null) {
        buf += '=';
        buf = Uri.#encodeQueryStr(buf, val);
      }
    }
    return buf;
  }
  static #encodeQueryStr(buf, str) {
    const len = str.length;
    for (let i=0; i<len; ++i) {
      const c = str.charCodeAt(i);
      if (c < 128 && (Uri.__charMap()[c] & Uri.__QUERY) != 0 && (Uri.__delimEscMap()[c] & Uri.__QUERY) == 0)
        buf += str.charAt(i);
      else if (c == 32)
        buf += "+"
      else
        buf = UriEncoder.percentEncodeChar(buf, c);
    }
    return buf;
  }
  static escapeToken(str, section)
  {
    const mask = Uri.#sectionToMask(section);
    const buf = [];
    const delimEscMap = Uri.__delimEscMap();
    for (let i = 0; i< str.length; ++i) {
      const c = str.charCodeAt(i);
      if (c < delimEscMap.length && (delimEscMap[c] & mask) != 0)
        buf.push('\\');
      buf.push(String.fromCharCode(c));
    }
    return buf.join("");
  }
  static encodeToken(str, section) {
    const mask = Uri.#sectionToMask(section);
    let buf = ""
    const delimEscMap = Uri.__delimEscMap();
    const charMap = Uri.__charMap();
    for (let i = 0; i < str.length; ++i) {
      const c = str.charCodeAt(i);
      if (c < 128 && (charMap[c] & mask) != 0 && (delimEscMap[c] & mask) == 0)
        buf += String.fromCharCode(c);
      else
        buf = UriEncoder.percentEncodeChar(buf, c);
    }
    return buf;
  }
  static decodeToken(str, section) {
    const mask = Uri.#sectionToMask(section);
    if (str.length == 0) return "";
    return new UriDecoder(str, true).decodeToken(mask);
  }
  static unescapeToken(str) {
    let buf = "";
    for (let i = 0; i < str.length; ++i) {
      let c = str.charAt(i);
      if (c == '\\') {
        ++i;
        if (i >= str.length) throw ArgErr.make(`Invalid esc: ${str}`);
        c = str.charAt(i);
      }
      buf += c;
    }
    return buf;
  }
  static #sectionToMask(section) {
    switch (section) {
      case 1: return Uri.__PATH; break;
      case 2: return Uri.__QUERY; break;
      case 3: return Uri.__FRAG; break;
      default: throw ArgErr.make(`Invalid section flag: ${section}`);
    }
  }
  static #sectionPath  = 1;
  static sectionPath() { return Uri.#sectionPath; }
  static #sectionQuery = 2;
  static sectionQuery() { return Uri.#sectionQuery; }
  static #sectionFrag  = 3;
  static sectionFrag() { return Uri.#sectionFrag; }
  equals(that) {
    if (that instanceof Uri)
      return this.#str === that.#str;
    else
      return false;
  }
  toCode() {
    let s = '`';
    const len = this.#str.length;
    for (let i=0; i<len; ++i) {
      const c = this.#str.charAt(i);
      switch (c)
      {
        case '\n': s += '\\' + 'n'; break;
        case '\r': s += '\\' + 'r'; break;
        case '\f': s += '\\' + 'f'; break;
        case '\t': s += '\\' + 't'; break;
        case '`':  s += '\\' + '`'; break;
        case '$':  s += '\\' + '$'; break;
        default:  s += c;
      }
    }
    s += '`';
    return s;
  }
  hash() { return Str.hash(this.#str); }
  toStr() { return this.#str; }
  toLocale() { return this.#str; }
  literalEncode$(out) { out.wStrLiteral(this.#str, '`'); }
  encode() {
    const x = this.#encoded;
    if (x != null) return x;
    return this.#encoded = new UriEncoder(this, true).encode();
  }
  get() {
    if (this.#scheme == "fan") {
      if (this.#path.size() == 0)
        return Pod.find(this.#host);
    }
    return File.make();
  }
  isAbs() { return this.#scheme != null; }
  isRel() { return this.#scheme == null; }
  isDir() {
    if (this.#pathStr != null) {
      const p = this.#pathStr;
      const len = p.length;
      if (len > 0 && p.charAt(len-1) == '/') return true;
    }
    return false;
  }
  scheme() { return this.#scheme; }
  auth() {
    if (this.#host == null) return null;
    if (this.#port == null) {
      if (this.#userInfo == null) return this.#host;
      else return `${this.#userInfo}@${this.#host}`;
    }
    else {
      if (this.#userInfo == null) return `${this.#host}:${this.#port}`;
      else return `${this.#userInfo}@${this.#host}:${this.#port}`;
    }
  }
  host()     { return this.#host; }
  userInfo() { return this.#userInfo; }
  port()     { return this.#port; }
  path()     { return this.#path; }
  pathStr()  { return this.#pathStr; }
  isPathAbs() {
    if (this.#pathStr == null || this.#pathStr.length == 0)
      return false;
    else
      return this.#pathStr.charAt(0) == '/';
  }
  isPathRel() { return !this.isPathAbs(); }
  isPathOnly() {
    return this.#scheme == null && this.#host == null && this.#port == null &&
           this.#userInfo == null && this.#queryStr == null && this.#frag == null;
  }
  name() {
    if (this.#path.size() == 0) return "";
    return this.#path.last();
  }
  basename() {
    const n   = this.name();
    const dot = n.lastIndexOf('.');
    if (dot < 2) {
      if (dot < 0)   return n;
      if (n == ".")  return n;
      if (n == "..") return n;
    }
    return n.slice(0, dot);
  }
  ext() {
    const n = this.name();
    const dot = n.lastIndexOf('.');
    if (dot < 2) {
      if (dot < 0)   return null;
      if (n == ".")  return null;
      if (n == "..") return null;
    }
    return n.slice(dot+1);
  }
  mimeType() {
    if (this.isDir()) return MimeType.fromStr("x-directory/normal");
    return MimeType.forExt(this.ext());
  }
  query()    { return this.#query; }
  queryStr() { return this.#queryStr; }
  frag()     { return this.#frag; }
  parent() {
    if (this.#path.size() == 0) return null;
    if (this.#path.size() == 1 && !this.isPathAbs() && !this.isDir()) return null;
    return this.getRange(Uri.#parentRange());
  }
  pathOnly() {
    if (this.#pathStr == null)
      throw Err.make(`Uri has no path: ${this}`);
    if (this.#scheme == null && this.#userInfo == null && this.#host == null &&
        this.#port == null && this.#queryStr == null && this.#frag == null)
      return this;
    const t    = new UriSections();
    t.path     = this.#path;
    t.pathStr  = this.#pathStr;
    t.query    = Uri.emptyQuery();
    t.str      = this.#pathStr;
    return new Uri(t);
  }
  getRangeToPathAbs(range) { return this.getRange(range, true); }
  getRange(range, forcePathAbs=false)
  {
    if (this.#pathStr == null)
      throw Err.make(`Uri has no path: ${this}`);
    const size = this.#path.size();
    const s = range.__start(size);
    const e = range.__end(size);
    const n = e - s + 1;
    if (n < 0) throw IndexErr.make(range);
    let head = (s == 0);
    let tail = (e == size-1);
    if (head && tail && (!forcePathAbs || this.isPathAbs())) return this;
    const t = new UriSections();
    t.path = this.#path.getRange(range);
    let sb = "";
    if ((head && this.isPathAbs()) || forcePathAbs) sb += '/';
    for (let i=0; i<t.path.size(); ++i)
    {
      if (i > 0) sb += '/';
      sb += t.path.get(i);
    }
    if (t.path.size() > 0 && (!tail || this.isDir())) sb += '/';
    t.pathStr = sb;
    if (head) {
      t.scheme   = this.#scheme;
      t.userInfo = this.#userInfo;
      t.host     = this.#host;
      t.port     = this.#port;
    }
    if (tail) {
      t.queryStr = this.#queryStr;
      t.query    = this.#query;
      t.frag     = this.#frag;
    }
    else {
      t.query    = Uri.emptyQuery();
    }
    if (!head && !tail) t.str = t.pathStr;
    return new Uri(t);
  }
  relTo(base) {
    if ((this.#scheme != base.#scheme) ||
        (this.#userInfo != base.#userInfo) ||
        (this.#host != base.#host) ||
        (this.#port != base.#port))
      return this;
    const t = new UriSections();
    t.query    = this.#query;
    t.queryStr = this.#queryStr;
    t.frag     = this.#frag;
    let d=0;
    const len = Math.min(this.#path.size(), base.#path.size());
    for (; d<len; ++d)
      if (this.#path.get(d) != base.#path.get(d))
        break;
    if (d == 0) {
      if (base.#path.isEmpty() && Str.startsWith(this.#pathStr, "/")) {
        t.path    = this.#path;
        t.pathStr = this.#pathStr.substring(1);
      }
      else {
        t.path    = this.#path;
        t.pathStr = this.#pathStr;
      }
    }
    else if (d == this.#path.size() && d == base.#path.size()) {
      t.path    = Uri.emptyPath();
      t.pathStr = "";
    }
    else {
      t.path = this.#path.getRange(Range.makeInclusive(d, -1));
      let backup = base.#path.size() - d;
      if (!base.isDir()) backup--;
      while (backup-- > 0) t.path.insert(0, "..");
      t.pathStr = Uri.__toPathStr(false, t.path, this.isDir());
    }
    return new Uri(t);
  }
  relToAuth() {
    if (this.#scheme == null && this.#userInfo == null &&
        this.#host == null && this.#port == null)
      return this;
    const t    = new UriSections();
    t.path     = this.#path;
    t.pathStr  = this.#pathStr;
    t.query    = this.#query;
    t.queryStr = this.#queryStr;
    t.frag     = this.#frag;
    return new Uri(t);
  }
  plus(r) {
    if (r.#scheme != null) return r;
    if (r.#host != null && this.#scheme == null) return r;
    if (r.isPathAbs() && this.#host == null) return r;
    const base = this;
    const t = new UriSections();
    if (r.#host != null) {
      t.setAuth(r);
      t.setPath(r);
      t.setQuery(r);
    }
    else {
      if (r.#pathStr == null || r.#pathStr == "") {
        t.setPath(base);
        if (r.#queryStr != null)
          t.setQuery(r);
        else
          t.setQuery(base);
      }
      else {
        if (Str.startsWith(r.#pathStr, "/"))
          t.setPath(r);
        else
          Uri.#merge(t, base, r);
        t.setQuery(r);
      }
      t.setAuth(base);
    }
    t.scheme = base.#scheme;
    t.frag   = r.#frag;
    t.normalize();
    return new Uri(t);
  }
  static #merge(t, base, r) {
    const baseIsAbs = base.isPathAbs();
    const baseIsDir = base.isDir();
    const rIsDir    = r.isDir();
    const rPath     = r.#path;
    let dotLast     = false;
    let tPath;
    if (base.#path.size() == 0) {
      tPath = r.#path;
    }
    else {
      tPath = base.#path.rw();
      if (!baseIsDir) tPath.pop();
      for (let i=0; i<rPath.size(); ++i) {
        const rSeg = rPath.get(i);
        if (rSeg == ".") { dotLast = true; continue; }
        if (rSeg == "..")
        {
          if (tPath.size() > 0) { tPath.pop(); dotLast = true; continue; }
          if (baseIsAbs) continue;
        }
        tPath.add(rSeg); dotLast = false;
      }
    }
    t.path    = tPath;
    t.pathStr = Uri.__toPathStr(baseIsAbs, tPath, rIsDir || dotLast);
  }
  static __toPathStr(isAbs, path, isDir) {
    let buf = '';
    if (isAbs) buf += '/';
    for (let i=0; i<path.size(); ++i) {
      if (i > 0) buf += '/';
      buf += path.get(i);
    }
    if (isDir && !(buf.length > 0 && buf.charAt(buf.length-1) == '/'))
      buf += '/';
    return buf;
  }
  plusName(name, asDir=false) {
    const size        = this.#path.size();
    const isDir       = this.isDir() || this.#path.isEmpty();
    const newSize     = isDir ? size + 1 : size;
    const temp        = this.#path.dup().__values();
    temp[newSize-1] = name;
    const t = new UriSections();
    t.scheme   = this.#scheme;
    t.userInfo = this.#userInfo;
    t.host     = this.#host;
    t.port     = this.#port;
    t.query    = Uri.emptyQuery();
    t.queryStr = null;
    t.frag     = null;
    t.path     = List.make(Str.type$, temp);
    t.pathStr  = Uri.__toPathStr(this.isAbs() || this.isPathAbs(), t.path, asDir);
    return new Uri(t);
  }
  plusSlash() {
    if (this.isDir()) return this;
    const t = new UriSections();
    t.scheme   = this.#scheme;
    t.userInfo = this.#userInfo;
    t.host     = this.#host;
    t.port     = this.#port;
    t.query    = this.#query;
    t.queryStr = this.#queryStr;
    t.frag     = this.#frag;
    t.path     = this.#path;
    t.pathStr  = this.#pathStr + "/";
    return new Uri(t);
  }
  plusQuery(q) {
    if (q == null || q.isEmpty()) return this;
    const merge = this.#query.dup().setAll(q);
    let s = "";
    const keys = merge.keys();
    for (let i=0; i<keys.size(); i++)
    {
      if (s.length > 0) s += '&';
      const key = keys.get(i);
      const val = merge.get(key);
      s = Uri.#appendQueryStr(s, key);
      s += '=';
      s = Uri.#appendQueryStr(s, val);
    }
    const t = new UriSections();
    t.scheme   = this.#scheme;
    t.userInfo = this.#userInfo;
    t.host     = this.#host;
    t.port     = this.#port;
    t.frag     = this.#frag;
    t.pathStr  = this.#pathStr;
    t.path     = this.#path;
    t.query    = merge.ro();
    t.queryStr = s;
    return new Uri(t);
  }
  static #appendQueryStr(buf, str) {
    const len = str.length;
    for (let i=0; i<len; ++i) {
      const c = str.charCodeAt(i);
      if (c < Uri.__delimEscMap().length && (Uri.__delimEscMap()[c] & Uri.__QUERY) != 0)
        buf += '\\';
      buf += str.charAt(i);
    }
    return buf;
  }
  toFile() { return File.make(this); }
  static isName(name) {
    const len = name.length;
    if (len == 0) return false;
    if (name.charAt(0) == '.' && len <= 2) {
      if (len == 1) return false;
      if (name.charAt(1) == '.') return false;
    }
    for (let i=0; i<len; ++i) {
      const c = name.charCodeAt(i);
      if (c < 128 && Uri.__nameMap()[c]) continue;
      return false;
    }
    return true;
  }
  static checkName(name) {
    if (!Uri.isName(name))
      throw NameErr.make(name);
  }
  static __isUpper(c) { return 65 <= c && c <= 90; }
  static __hexNibble(ch) {
    if ((Uri.__charMap()[ch] & Uri.__HEX) == 0)
      throw ParseErr.make(`Invalid percent encoded hex: '${String.fromCharCode(ch)}'`);
    if (ch <= 57) return ch - 48;
    if (ch <= 90) return (ch - 65) + 10;
    return (ch - 97) + 10;
  }
  static __toSection(section) {
    switch (section) {
      case Uri.__SCHEME: return "scheme";
      case Uri.__USER:   return "userInfo";
      case Uri.__HOST:   return "host";
      case Uri.__PATH:   return "path";
      case Uri.__QUERY:  return "query";
      case Uri.__FRAG:   return "frag";
      default:          return "uri";
    }
  }
  static __isScheme(c) {
    return c < 128 ? (Uri.__charMap()[c] & Uri.__SCHEME) != 0 : false;
  }
  static #charMap = undefined;
  static __charMap() {
    if (Uri.#charMap) return Uri.#charMap;
    Uri.#charMap = new Array(128);
    Uri.#charMap.fill(0);
    for (let i=97; i<=122; ++i) { Uri.#charMap[i] = Uri.#unreserved; }
    for (let i=65; i<=90; ++i) { Uri.#charMap[i] = Uri.#unreserved; }
    for (let i=48; i<=57; ++i) { Uri.#charMap[i] = Uri.#unreserved; }
    Uri.#charMap[45] = Uri.#unreserved;
    Uri.#charMap[46] = Uri.#unreserved;
    Uri.#charMap[95] = Uri.#unreserved;
    Uri.#charMap[126] = Uri.#unreserved;
    for (let i=48; i<=57; ++i)  Uri.#charMap[i] |= Uri.__HEX | Uri.__DIGIT;
    for (let i=97; i<=102; ++i) Uri.#charMap[i] |= Uri.__HEX;
    for (let i=65; i<=70; ++i)  Uri.#charMap[i] |= Uri.__HEX;
    Uri.#charMap[33]  = Uri.__USER | Uri.__HOST | Uri.__PATH | Uri.__QUERY | Uri.__FRAG;
    Uri.#charMap[36]  = Uri.__USER | Uri.__HOST | Uri.__PATH | Uri.__QUERY | Uri.__FRAG;
    Uri.#charMap[38]  = Uri.__USER | Uri.__HOST | Uri.__PATH | Uri.__QUERY | Uri.__FRAG;
    Uri.#charMap[39]  = Uri.__USER | Uri.__HOST | Uri.__PATH | Uri.__QUERY | Uri.__FRAG;
    Uri.#charMap[40]  = Uri.__USER | Uri.__HOST | Uri.__PATH | Uri.__QUERY | Uri.__FRAG;
    Uri.#charMap[41]  = Uri.__USER | Uri.__HOST | Uri.__PATH | Uri.__QUERY | Uri.__FRAG;
    Uri.#charMap[42]  = Uri.__USER | Uri.__HOST | Uri.__PATH | Uri.__QUERY | Uri.__FRAG;
    Uri.#charMap[43]  = Uri.__SCHEME | Uri.__USER | Uri.__HOST | Uri.__PATH | Uri.__FRAG;
    Uri.#charMap[44]  = Uri.__USER | Uri.__HOST | Uri.__PATH | Uri.__QUERY | Uri.__FRAG;
    Uri.#charMap[59]  = Uri.__USER | Uri.__HOST | Uri.__PATH | Uri.__QUERY | Uri.__FRAG;
    Uri.#charMap[61]  = Uri.__USER | Uri.__HOST | Uri.__PATH | Uri.__QUERY | Uri.__FRAG;
    Uri.#charMap[58] = Uri.__HOST | Uri.__PATH  | Uri.__USER  | Uri.__QUERY | Uri.__FRAG;
    Uri.#charMap[47] = Uri.__PATH  | Uri.__QUERY | Uri.__FRAG;
    Uri.#charMap[63] = Uri.__QUERY | Uri.__FRAG;
    Uri.#charMap[35] = 0;
    Uri.#charMap[91] = Uri.__HOST;
    Uri.#charMap[93] = Uri.__HOST;
    Uri.#charMap[64] = Uri.__PATH | Uri.__QUERY | Uri.__FRAG;
    return Uri.#charMap;
  }
  static #nameMap = undefined;
  static __nameMap() {
    if (Uri.#nameMap) return Uri.#nameMap;
    Uri.#nameMap = new Array(128);
    Uri.#nameMap.fill(0);
    for (let i=97; i<=122; ++i) { Uri.#nameMap[i] = true; }
    for (let i=65; i<=90; ++i) { Uri.#nameMap[i] = true; }
    for (let i=48; i<=57; ++i) { Uri.#nameMap[i] = true; }
    Uri.#nameMap[45] = true;
    Uri.#nameMap[46] = true;
    Uri.#nameMap[95] = true;
    Uri.#nameMap[126] = true;
    return Uri.#nameMap;
  }
  static #delimEscMap = undefined;
  static __delimEscMap() {
    if (Uri.#delimEscMap) return Uri.#delimEscMap;
    Uri.#delimEscMap = new Array(128);
    Uri.#delimEscMap.fill(0);
    Uri.#delimEscMap[58]  = Uri.__PATH;
    Uri.#delimEscMap[47]  = Uri.__PATH;
    Uri.#delimEscMap[63]  = Uri.__PATH;
    Uri.#delimEscMap[35]  = Uri.__PATH | Uri.__QUERY;
    Uri.#delimEscMap[38]  = Uri.__QUERY;
    Uri.#delimEscMap[59]  = Uri.__QUERY;
    Uri.#delimEscMap[61]  = Uri.__QUERY;
    Uri.#delimEscMap[92]  = Uri.__SCHEME | Uri.__USER | Uri.__HOST | Uri.__PATH | Uri.__QUERY | Uri.__FRAG;
    return Uri.#delimEscMap;
  }
  static __SCHEME     = 0x01;
  static __USER       = 0x02;
  static __HOST       = 0x04;
  static __PATH       = 0x08;
  static __QUERY      = 0x10;
  static __FRAG       = 0x20;
  static __DIGIT      = 0x40;
  static __HEX        = 0x80;
  static #unreserved = Uri.__SCHEME | Uri.__USER | Uri.__HOST | Uri.__PATH | Uri.__QUERY | Uri.__FRAG;
  static emptyPath() {
    if (Uri.emptyPath$ === undefined) {
      Uri.emptyPath$ = List.make(Str.type$, []).toImmutable();
    }
    return Uri.emptyPath$;
  }
  static emptyQuery() {
    if (Uri.emptyQuery$ === undefined) {
      Uri.emptyQuery$ = Map.make(Str.type$, Str.type$).toImmutable();
    }
    return Uri.emptyQuery$;
  }
}
class UriSections {
  constructor() { }
  scheme = null;
  host = null;
  userInfo = null;
  port = null;
  pathStr = null;
  #path = null;
  get path() { return this.#path;}
  set path(it) { this.#path = it.rw(); }
  queryStr = null;
  #query = null;
  get query() { return this.#query; }
  set query(it) { this.#query = it.rw(); }
  frag = null;
  str = null;
  setAuth(x)  { this.userInfo = x.userInfo(); this.host = x.host(); this.port = x.port(); }
  setPath(x)  { this.pathStr = x.pathStr(); this.path = x.path(); }
  setQuery(x) { this.queryStr = x.queryStr(); this.query = x.query(); }
  setFrag(x)  { this.frag = x.frag(); }
  normalize() {
    this.normalizeSchemes();
    this.normalizePath();
    this.normalizeQuery();
  }
  normalizeSchemes() {
    if (this.scheme == null) return;
    if (this.scheme == "http")  { this.normalizeScheme(80);  return; }
    if (this.scheme == "https") { this.normalizeScheme(443); return; }
    if (this.scheme == "ftp")   { this.normalizeScheme(21);  return; }
  }
  normalizeScheme(p) {
    if (this.port != null && this.port == p) this.port = null;
    if (this.pathStr == null || this.pathStr.length == 0) {
      this.pathStr = "/";
      if (this.path == null) this.path = Uri.emptyPath();
    }
  }
  normalizePath() {
    if (this.path == null) return;
    let isAbs = Str.startsWith(this.pathStr, "/");
    let isDir = Str.endsWith(this.pathStr, "/");
    let dotLast = false;
    let modified = false;
    for (let i=0; i<this.path.size(); ++i) {
      const seg = this.path.get(i);
      if (seg == "." && (this.path.size() > 1 || this.host != null)) {
        this.path.removeAt(i);
        modified = true;
        dotLast = true;
        i -= 1;
      }
      else if (seg == ".." && i > 0 && this.path.get(i-1).toString() != "..") {
        this.path.removeAt(i);
        this.path.removeAt(i-1);
        modified = true;
        i -= 2;
        dotLast = true;
      }
      else {
        dotLast = false;
      }
    }
    if (modified) {
      if (dotLast) isDir = true;
      if (this.path.size() == 0 || this.path.last().toString() == "..") isDir = false;
      this.pathStr = Uri.__toPathStr(isAbs, this.path, isDir);
    }
  }
  normalizeQuery() {
    if (this.query == null)
      this.query = Uri.emptyQuery();
  }
}
class UriDecoder extends UriSections {
  constructor(str, decoding=false) {
    super();
    this.str = str;
    this.decoding = decoding;
  }
  str;
  decoding;
  dpos = null;
  nextCharWasEscaped = null;
  decode() {
    const str = this.str;
    const len = str.length;
    let pos = 0;
    let hasUpper = false;
    for (let i=0; i<len; ++i) {
      let c = str.charCodeAt(i);
      if (Uri.__isScheme(c)) {
        if (!hasUpper && Uri.__isUpper(c)) hasUpper = true;
        continue;
      }
      if (c != 58) break;
      pos = i + 1;
      let scheme = str.substring(0, i);
      if (hasUpper) scheme = Str.lower(scheme);
      this.scheme = scheme;
      break;
    }
    if (pos+1 < len && str.charAt(pos) == '/' && str.charAt(pos+1) == '/')
    {
      let authStart = pos+2;
      let authEnd = len;
      let at = -1;
      let colon = -1;
      for (let i=authStart; i<len; ++i) {
        const c = str.charAt(i);
        if (c == '/' || c == '?' || c == '#') { authEnd = i; break; }
        else if (c == '@' && at < 0) { at = i; colon = -1; }
        else if (c == ':') colon = i;
        else if (c == ']') colon = -1;
      }
      let hostStart = authStart;
      let hostEnd = authEnd;
      if (at > 0) {
        this.userInfo = this.substring(authStart, at, Uri.__USER);
        hostStart = at+1;
      }
      if (colon > 0) {
        this.port = Int.fromStr(str.substring(colon+1, authEnd));
        hostEnd = colon;
      }
      this.host = this.substring(hostStart, hostEnd, Uri.__HOST);
      pos = authEnd;
    }
    let pathStart = pos;
    let pathEnd = len;
    let numSegs = 1;
    let prev = 0;
    for (let i=pathStart; i<len; ++i) {
      const c = str.charAt(i);
      if (prev != '\\') {
        if (c == '?' || c == '#') { pathEnd = i; break; }
        if (i != pathStart && c == '/') ++numSegs;
        prev = c;
      }
      else {
        prev = (c != '\\') ? c : 0;
      }
    }
    this.pathStr = this.substring(pathStart, pathEnd, Uri.__PATH);
    this.path = this.pathSegments(this.pathStr, numSegs);
    pos = pathEnd;
    if (pos < len && str.charAt(pos) == '?') {
      let queryStart = pos+1;
      let queryEnd = len;
      prev = 0;
      for (let i=queryStart; i<len; ++i) {
        const c = str.charAt(i);
        if (prev != '\\') {
          if (c == '#') { queryEnd = i; break; }
          prev = c;
        }
        else {
          prev = (c != '\\') ? c : 0;
        }
      }
      this.queryStr = this.substring(queryStart, queryEnd, Uri.__QUERY);
      this.query = this.parseQuery(this.queryStr);
      pos = queryEnd;
    }
    if (pos < len  && str.charAt(pos) == '#') {
      this.frag = this.substring(pos+1, len, Uri.__FRAG);
    }
    this.normalize();
    this.str = null;
    return this;
  }
  pathSegments(pathStr, numSegs) {
    let len = pathStr.length;
    if (len == 0 || (len == 1 && pathStr.charAt(0) == '/'))
      return Uri.emptyPath();
    if (len > 1 && pathStr.charAt(len-1) == '/' && pathStr.charAt(len-2) != '\\') {
      numSegs--;
      len--;
    }
    let path = [];
    let n = 0;
    let segStart = 0;
    let prev = 0;
    for (let i=0; i<pathStr.length; ++i) {
      const c = pathStr.charAt(i);
      if (prev != '\\') {
        if (c == '/')
        {
          if (i > 0) { path.push(pathStr.substring(segStart, i)); n++ }
          segStart = i+1;
        }
        prev = c;
      }
      else {
        prev = (c != '\\') ? c : 0;
      }
    }
    if (segStart < len) {
      path.push(pathStr.substring(segStart, pathStr.length));
      n++;
    }
    return List.make(Str.type$, path);
  }
  decodeQuery() {
    return this.parseQuery(this.substring(0, this.str.length, Uri.__QUERY));
  }
  parseQuery(q) {
    if (q == null) return null;
    const map = Map.make(Str.type$, Str.type$);
    try {
      let start = 0;
      let eq = 0;
      let len = q.length;
      let prev = 0;
      let escaped = false;
      for (let i=0; i<len; ++i) {
        const ch = q.charAt(i);
        if (prev != '\\') {
          if (ch == '=') eq = i;
          if (ch != '&' && ch != ';') { prev = ch; continue; }
        }
        else {
          escaped = true;
          prev = (ch != '\\') ? ch : 0;
          continue;
        }
        if (start < i) {
          this.addQueryParam(map, q, start, eq, i, escaped);
          escaped = false;
        }
        start = eq = i+1;
      }
      if (start < len)
        this.addQueryParam(map, q, start, eq, len, escaped);
    }
    catch (err) {
      Err.make(err).trace();
    }
    return map;
  }
  addQueryParam(map, q, start, eq, end, escaped) {
    let key,val;
    if (start == eq && q.charAt(start) != '=') {
      key = this.toQueryStr(q, start, end, escaped);
      val = "true";
    }
    else {
      key = this.toQueryStr(q, start, eq, escaped);
      val = this.toQueryStr(q, eq+1, end, escaped);
    }
    const dup = map.get(key, null);
    if (dup != null) val = dup + "," + val;
    map.set(key, val);
  }
  toQueryStr(q, start, end, escaped) {
    if (!escaped) return q.substring(start, end);
    let s = "";
    let prev = 0;
    for (let i=start; i<end; ++i) {
      const c = q.charAt(i);
      if (c != '\\') {
        s += c;
        prev = c;
      }
      else {
        if (prev == '\\') { s += c; prev = 0; }
        else prev = c;
      }
    }
    return s;
  }
  decodeToken(mask) {
    return this.substring(0, this.str.length, mask);
  }
  substring(start, end, section) {
    let buf = [];
    const delimEscMap = Uri.__delimEscMap();
    if (!this.decoding) {
      let last = 0;
      let backslash = 92;
      for (let i = start; i < end; ++i) {
        const ch = this.str.charCodeAt(i);
        if (last == backslash && ch < delimEscMap.length && (delimEscMap[ch] & section) == 0) {
          buf.pop();
        }
        buf.push(String.fromCharCode(ch));
        last = ((last == backslash && ch == backslash) ? 0 : ch);
      }
    }
    else {
      this.dpos = start;
      while (this.dpos < end) {
        const ch = this.nextChar(section);
        if (this.nextCharWasEscaped && ch < delimEscMap.length && (delimEscMap[ch] & section) != 0) {
          buf.push('\\');
        }
        buf.push(String.fromCharCode(ch));
      }
    }
    return buf.join("");
  }
  nextChar(section) {
    const c = this.nextOctet(section);
    if (c < 0) return -1;
    let c2, c3;
    switch (c >> 4)
    {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        return c;
      case 12: case 13:
        c2 = this.nextOctet(section);
        if ((c2 & 0xC0) != 0x80)
          throw ParseErr.make("Invalid UTF-8 encoding");
        return ((c & 0x1F) << 6) | (c2 & 0x3F);
      case 14:
        c2 = this.nextOctet(section);
        c3 = this.nextOctet(section);
        if (((c2 & 0xC0) != 0x80) || ((c3 & 0xC0) != 0x80))
          throw ParseErr.make("Invalid UTF-8 encoding");
        return (((c & 0x0F) << 12) | ((c2 & 0x3F) << 6) | ((c3 & 0x3F) << 0));
      default:
        throw ParseErr.make("Invalid UTF-8 encoding");
    }
  }
  nextOctet(section) {
    const c = this.str.charCodeAt(this.dpos++);
    if (c == 37)
    {
      this.nextCharWasEscaped = true;
      return (Uri.__hexNibble(this.str.charCodeAt(this.dpos++)) << 4) | Uri.__hexNibble(this.str.charCodeAt(this.dpos++));
    }
    else
    {
      this.nextCharWasEscaped = false;
    }
    if (c == 43 && section == Uri.__QUERY)
      return 32
    if (c >= Uri.__charMap().length || (Uri.__charMap()[c] & section) == 0)
      throw ParseErr.make("Invalid char in " + Uri.__toSection(section) + " at index " + (this.dpos-1));
    return c;
  }
}
class UriEncoder {
  constructor(uri, encoding) {
    this.uri = uri;
    this.encoding = encoding;
    this.buf = '';
  }
  uri;
  encoding;
  buf;
  encode() {
    let uri = this.uri;
    if (uri.scheme() != null) this.buf += uri.scheme() + ':';
    if (uri.userInfo() != null || uri.host() != null || uri.port() != null) {
      this.buf += '/' + '/';
      if (uri.userInfo() != null) { this.doEncode(uri.userInfo(), Uri.__USER); this.buf += '@'; }
      if (uri.host() != null) this.doEncode(uri.host(), Uri.__HOST);
      if (uri.port() != null) this.buf += ':' + uri.port();
    }
    if (uri.pathStr() != null)
      this.doEncode(uri.pathStr(), Uri.__PATH);
    if (uri.queryStr() != null)
      { this.buf += '?'; this.doEncode(uri.queryStr(), Uri.__QUERY); }
    if (uri.frag() != null)
      { this.buf += '#'; this.doEncode(uri.frag(), Uri.__FRAG); }
    return this.buf;
  }
  doEncode(s, section) {
    if (!this.encoding) { this.buf += s; return this.buf; }
    const len = s.length;
    let c = 0;
    let prev;
    for (let i=0; i<len; ++i) {
      prev = c;
      c = s.charCodeAt(i);
      const charMap = Uri.__charMap();
      if (c < 128 && (charMap[c] & section) != 0 && prev != 92) {
        this.buf += String.fromCharCode(c);
        continue;
      }
      if (c == 92 && prev != 92) continue;
      if (c == 32 && section == Uri.__QUERY)
        this.buf += '+';
      else
        this.buf = UriEncoder.percentEncodeChar(this.buf, c);
      if (c == 92) c = 0;
    }
    return this.buf;
  }
  static percentEncodeChar = function(buf, c) {
    if (c <= 0x007F) {
      buf = UriEncoder.percentEncodeByte(buf, c);
    }
    else if (c > 0x07FF) {
      buf = UriEncoder.percentEncodeByte(buf, 0xE0 | ((c >> 12) & 0x0F));
      buf = UriEncoder.percentEncodeByte(buf, 0x80 | ((c >>  6) & 0x3F));
      buf = UriEncoder.percentEncodeByte(buf, 0x80 | ((c >>  0) & 0x3F));
    }
    else {
      buf = UriEncoder.percentEncodeByte(buf, 0xC0 | ((c >>  6) & 0x1F));
      buf = UriEncoder.percentEncodeByte(buf, 0x80 | ((c >>  0) & 0x3F));
    }
    return buf;
  }
  static percentEncodeByte(buf, c) {
    buf += '%';
    const hi = (c >> 4) & 0xf;
    const lo = c & 0xf;
    buf += (hi < 10 ? String.fromCharCode(48+hi) : String.fromCharCode(65+(hi-10)));
    buf += (lo < 10 ? String.fromCharCode(48+lo) : String.fromCharCode(65+(lo-10)));
    return buf;
  }
}
class Num extends Obj {
  constructor() { super(); }
  static toDecimal(val) { return Decimal.make(val.valueOf()); }
  static toFloat(val) { return Float.make(val.valueOf()); }
  static toInt(val) {
    if (isNaN(val)) return 0;
    if (val == Number.POSITIVE_INFINITY) return Int.maxVal();
    if (val == Number.NEGATIVE_INFINITY) return Int.minVal();
    if (val < 0) return Math.ceil(val);
    return Math.floor(val);
  }
  static localeDecimal() { return Locale.cur().__numSymbols().decimal; }
  static localeGrouping() { return Locale.cur().__numSymbols().grouping; }
  static localeMinus() { return Locale.cur().__numSymbols().minus; }
  static localePercent() { return Locale.cur().__numSymbols().percent; }
  static localePosInf() { return Locale.cur().__numSymbols().posInf; }
  static localeNegInf() { return Locale.cur().__numSymbols().negInf; }
  static localeNaN() { return Locale.cur().__numSymbols().nan; }
  static toLocale(p, d, locale) {
    var symbols = locale.__numSymbols();
    let s = "";
    if (d.negative) s += symbols.minus;
    d.round(p.maxFrac);
    let start = 0;
    if (p.optInt && d.zeroInt()) start = d.decimal;
    if (p.minFrac == 0 && d.zeroFrac(p.maxFrac)) d.truncateToWhole();
    for (let i=0; i<p.minInt-d.decimal; ++i) s += '0';
    let decimal = false;
    for (let i=start; i<d.size; ++i) {
      if (i < d.decimal) {
        if ((d.decimal - i) % p.group == 0 && i > 0)
          s += symbols.grouping;
      }
      else {
        if (i == d.decimal && p.maxFrac > 0) {
          s += symbols.decimal;
          decimal = true;
        }
        if (i-d.decimal >= p.maxFrac) break;
      }
      s += String.fromCharCode(d.digits[i]);
    }
    for (let i=0; i<p.minFrac-d.fracSize(); ++i) {
      if (!decimal) { s += symbols.decimal; decimal = true; }
      s += '0';
    }
    if (s.length == 0) return "0";
    return s;
  }
}
class NumDigits extends Obj {
  constructor(digits, decimal, size, negative) {
    super();
    this.#digits = digits;
    this.#decimal = decimal;
    this.#size = size;
    this.#negative = negative;
  }
  #digits;
  #decimal;
  #size;
  #negative;
  get digits() { return this.#digits; }
  get decimal() { return this.#decimal; }
  get size() { return this.#size}
  get negative() { return this.#negative; }
  static makeStr(s) {
    const digits = [];
    let decimal = -99;
    let size = 0;
    let negative = false;
    let expPos = -1;
    for (let i=0; i<s.length; ++i) {
      const c = s.charCodeAt(i);
      if (c == 45) { negative = true; continue; }
      if (c == 46) { decimal = negative ? i-1 : i; continue; }
      if (c == 101 || c == 69) { expPos = i; break; }
      digits.push(c); size++;
    }
    if (decimal < 0) decimal = size;
    if (expPos >= 0) {
      const exp = parseInt(s.substring(expPos+1), 10);
      decimal += exp;
      if (decimal >= size) {
        while(size <= decimal) digits[size++] = 48;
      }
      else if (decimal < 0) {
        for (let i=0; i<-decimal; ++i) digits.unshift(48);
        size += -decimal;
        decimal = 0;
      }
    }
    return new NumDigits(digits, decimal, size, negative);
  }
  static makeLong(l) {
    const digits = [];
    let negative = false;
    if (l < 0) { negative = true; l = -l; }
    let s = l.toString();
    if (s.charAt(0) === '-') s = "9223372036854775808";
    for (let i=0; i<s.length; i++) digits.push(s.charCodeAt(i));
    return new NumDigits(digits, digits.length, digits.length, negative);
  }
  truncateToWhole() { this.#size = this.#decimal; }
  intSize() { return this.#decimal; }
  fracSize() { return this.#size - this.#decimal; }
  zeroInt() {
    for (let i=0; i<this.#decimal; ++i) if (this.#digits[i] != 48) return false;
    return true;
  }
  zeroFrac(maxFrac) {
    let until = this.#decimal + maxFrac;
    for (var i=this.#decimal; i<until; ++i) if (this.#digits[i] != 48) return false;
    return true;
  }
  round(maxFrac) {
    if (this.fracSize() <= maxFrac) return;
    if (this.#digits[this.#decimal+maxFrac] >= 53)
    {
      let i = this.#decimal + maxFrac - 1;
      while (true) {
        if (this.#digits[i] < 57) { this.#digits[i]++; break; }
        this.#digits[i--] = 48;
        if (i < 0) {
          this.#digits.unshift(49);
          this.#size++; this.#decimal++;
          break;
        }
      }
    }
    this.#size = this.#decimal + maxFrac;
    while (this.#digits[this.#size-1] == 48 && this.#size > this.#decimal) this.#size--;
  }
  toString() {
    let s = "";
    for (let i=0; i<this.#digits.length; i++) s += String.fromCharCode(this.#digits[i]);
    return s + " neg=" + this.#negative + " decimal=" + this.#decimal;
  }
}
class NumPattern extends Obj {
  constructor(pattern, group, optInt, minInt, minFrac, maxFrac) {
    super();
    this.#pattern = pattern;
    this.#group = group;
    this.#optInt = optInt;
    this.#minInt = minInt;
    this.#minFrac = minFrac;
    this.#maxFrac = maxFrac;
  }
  static #cache = {};
  #pattern;
  #group;
  #optInt;
  #minInt;
  #minFrac;
  #maxFrac;
  get pattern() { return this.#pattern; }
  get group() { return this.#group; }
  get optInt() { return this.#optInt; }
  get minInt() { return this.#minInt; }
  get minFrac() { return this.#minFrac; }
  get maxFrac() { return this.#maxFrac; }
  static parse(s) {
    const x = NumPattern.cache$[s];
    if (x != null) return x;
    return NumPattern.make(s);
  }
  static make(s) {
    let group = Int.maxVal;
    let optInt = true;
    let comma = false;
    let decimal = false;
    let minInt = 0, minFrac = 0, maxFrac = 0;
    let last = 0;
    for (let i=0; i<s.length; ++i)
    {
      const c = s.charAt(i);
      switch (c)
      {
        case ',':
          comma = true;
          group = 0;
          break;
        case '0':
          if (decimal)
            { minFrac++; maxFrac++; }
          else
            { minInt++; if (comma) group++; }
          break;
        case '#':
          if (decimal)
            maxFrac++;
          else
            if (comma) group++;
          break;
        case '.':
          decimal = true;
          optInt  = last == '#';
          break;
      }
      last = c;
    }
    if (!decimal) optInt = last == '#';
    return new NumPattern(s, group, optInt, minInt, minFrac, maxFrac);
  }
  toString() {
    return this.#pattern + " group=" + this.#group + " minInt=" + this.#minInt +
      " maxFrac=" + this.#maxFrac + " minFrac=" + this.#minFrac + " optInt=" + this.#optInt;
  }
  static cache$(p) { NumPattern.#cache[p] = NumPattern.make(p); }
}
class Int extends Num {
  constructor() { super(); }
  make(val) { return val; }
  static #MAX_SAFE = 9007199254740991;
  static #MIN_SAFE = -9007199254740991;
  static maxVal() { return Math.pow(2, 53); }
  static minVal() { return -Math.pow(2, 53); }
  static defVal() { return 0; }
  static __chunk  = 4096;
  static fromStr(s, radix=10, checked=true) {
    try {
      if (radix === 10) { const n = Int.#parseDecimal(s); return n; }
      if (radix === 16) { const n = Int.#parseHex(s); return n; }
      throw new Error("Unsupported radix " + radix);
    }
    catch (err) {
      if (checked) throw ParseErr.make(`Invalid Int: '${s}'`, s, null, err);
      return null;
    }
  }
  static #parseDecimal(s) {
    let n = 0;
    if (s.charCodeAt(0) === 45) n++;
    for (let i=n; i<s.length; i++) {
      const ch = s.charCodeAt(i);
      if (ch >= 48 && ch <= 57) continue;
      throw new Error("Illegal decimal char " + s.charAt(i));
    }
    const x = parseInt(s, 10);
    if (isNaN(x)) throw new Error("Invalid number");
    return x;
  }
  static #parseHex(s) {
    for (let i=0; i<s.length; i++)
    {
      const ch = s.charCodeAt(i);
      if (ch >= 48 && ch <= 57) continue;
      if (ch >= 65 && ch <= 70) continue;
      if (ch >= 97 && ch <= 102) continue;
      throw new Error("Illegal hex char " + s.charAt(i));
    }
    const x = parseInt(s, 16);
    if (isNaN(x)) throw new Error("Invalid number");
    return x;
  }
  static random(r) {
    if (r === undefined) return Math.floor(Math.random() * Math.pow(2, 64));
    else {
      const start = r.start();
      let end     = r.end();
      if (r.inclusive()) ++end;
      if (end <= start) throw ArgErr.make("Range end < start: " + r);
      r = end-start;
      if (r < 0) r = -r;
      return Math.floor(Math.random()*r) + start;
    }
  }
  static toStr(self) { return self.toString(); }
  static equals(self, obj) { return self === obj; }
  static hash(self) { return self; }
  static negate(self) { return -self; }
  static increment(self) { return self+1; }
  static decrement(self) { return self-1; }
  static mult(a, b) { return a * b; }
  static multFloat(a, b) { return Float.make(a * b); }
  static multDecimal(a, b) { return Decimal.make(a * b); }
  static div(a, b) {
    const r = a / b;
    if (r < 0) return Math.ceil(r);
    return Math.floor(r);
  }
  static divFloat(a, b) { return Float.make(a / b); }
  static divDecimal(a, b) { return Decimal.make(Int.div(a, b)); }
  static mod(a, b) { return a % b; }
  static modFloat(a, b) { return Float.make(a % b); }
  static modDecimal(a, b) { return Decimal.make(a % b); }
  static plus(a, b) { return a + b; }
  static plusFloat(a, b) { return Float.make(a + b); }
  static plusDecimal(a, b) { return Decimal.make(a + b); }
  static minus(a, b) { return a - b; }
  static minusFloat(a, b) { return Float.make(a - b); }
  static minusDecimal(a, b) { return Decimal.make(a - b); }
static not(a) { return ~a; }
static and(a, b) { let x = a & b;  if (x<0) x += 0xffffffff+1; return x; }
static or(a, b) { let x = a | b;  if (x<0) x += 0xffffffff+1; return x; }
static xor(a, b) { let x = a ^ b;  if (x<0) x += 0xffffffff+1; return x; }
static shiftl(a, b) { let x = a << b; if (x<0) x += 0xffffffff+1; return x; }
static shiftr(a, b) { let x = a >>> b; if (x<0) x += 0xffffffff+1; return x; }
static shifta(a, b) { let x = a >> b; return x; }
  static abs(self)      { return self < 0 ? -self : self; }
  static min(self, val) { return self < val ? self : val; }
  static max(self, val) { return self > val ? self : val; }
  static clamp(self, min, max) {
    if (self < min) return min;
    if (self > max) return max;
    return self;
  }
  static clip(self, min, max) { return Int.clamp(self, min, max); }
  static pow(self, pow) {
    if (pow < 0) throw ArgErr.make("pow < 0");
    return Math.pow(self, pow);
  }
  static isEven(self) { return self % 2 == 0; }
  static isOdd(self) { return self % 2 != 0; }
  static isSpace(self) { return self == 32 || self == 9 || self == 10 || self == 13; }
  static isAlpha(self) { return Int.isUpper(self) || Int.isLower(self); }
  static isAlphaNum(self) { return Int.isAlpha(self) || Int.isDigit(self); }
  static isUpper(self) { return self >= 65 && self <= 90; }
  static isLower(self) { return self >= 97 && self <= 122; }
  static upper(self) { return Int.isLower(self) ? self-32 : self; }
  static lower(self) { return Int.isUpper(self) ? self+32 : self; }
  static isDigit(self, radix=10) {
    if (radix == 10) return self >= 48 && self <= 57;
    if (radix == 16)
    {
      if (self >= 48 && self <= 57) return true;
      if (self >= 65 && self <= 70) return true;
      if (self >= 97 && self <= 102) return true;
      return false;
    }
    if (radix <= 10) return 48 <= self && self <= (48+radix);
    if ((Int.charMap[self] & Int.DIGIT) != 0) return true;
    const x = radix-10;
    if (97 <= self && self < 97+x) return true;
    if (65 <= self && self < 65+x) return true;
    return false;
  }
  static toDigit(self, radix=10) {
    if (radix == 10) return 0 <= self && self <= 9 ? 48+self : null;
    if (self < 0 || self >= radix) return null;
    if (self < 10) return 48+self;
    return self-10+97;
  }
  static fromDigit(self, radix=10) {
    if (self < 0 || self >= 128) return null;
    var ten = radix < 10 ? radix : 10;
    if (48 <= self && self < 48+ten) return self-48;
    if (radix > 10)
    {
      var alpha = radix-10;
      if (97 <= self && self < 97+alpha) return self+10-97;
      if (65 <= self && self < 65+alpha) return self+10-65;
    }
    return null;
  }
  static equalsIgnoreCase(self, ch) {
    if (65 <= self && self <= 90) self |= 0x20;
    if (65 <= ch   && ch   <= 90) ch   |= 0x20;
    return self == ch;
  }
  static toLocale(self, pattern=null, locale=Locale.cur()) {
    if (pattern != null && pattern.length == 1 && pattern.charAt(0) == 'B')
      return Int.#toLocaleBytes(self);
    if (pattern == null)
      pattern = "#,###";
    const p = NumPattern.parse(pattern);
    const d = NumDigits.makeLong(self);
    return Num.toLocale(p, d, locale);
  }
  static #KB = 1024;
  static #MB = 1024*1024;
  static #GB = 1024*1024*1024;
  static #toLocaleBytes(b) {
    let KB = Int.#KB;
    let MB = Int.#MB;
    let GB = Int.#GB;
    if (b < KB)    return b + "B";
    if (b < 10*KB) return Float.toLocale(b/KB, "#.#") + "KB";
    if (b < MB)    return Math.round(b/KB) + "KB";
    if (b < 10*MB) return Float.toLocale(b/MB, "#.#") + "MB";
    if (b < GB)    return Math.round(b/MB) + "MB";
    if (b < 10*GB) return Float.toLocale(b/GB, "#.#") + "GB";
    return Math.round(b/Int.#GB) + "GB";
  }
  static localeIsUpper(self) { return Int.isUpper(self); }
  static localeIsLower(self) { return Int.isLower(self); }
  static localeUpper(self) { return Int.upper(self); }
  static localeLower(self) { return Int.lower(self); }
  static toInt(val) { return val; }
  static toFloat(val) { return Float.make(val); }
  static toDecimal(val) { return Decimal.make(val); }
  static toChar(self) {
    if (self < 0 || self > 0xFFFF) throw Err.make("Invalid unicode char: " + self);
    return String.fromCharCode(self);
  }
  static toHex(self, width=null) {
    if (self == null) self = 0;
    let val = self;
    if (val < 0) val += Int.#MAX_SAFE;
    let s = "";
    while (true) {
      s = "0123456789abcdef".charAt(val % 16) + s;
      val = Math.floor(val / 16);
      if (val === 0) break
    }
    if (width != null && s.length < width) {
      const zeros = width - s.length;
      for (var i=0; i<zeros; ++i) s = '0' + s;
    }
    return s;
  }
  static toRadix(self, radix=10, width=null) {
    let s = self.toString(radix);
    if (width != null && s.length < width) {
      const zeros = width - s.length;
      for (var i=0; i<zeros; ++i) s = '0' + s;
    }
    return s;
  }
  static toCode(self, base=10) {
    if (base == 10) return self.toString();
    if (base == 16) return "0x" + Int.toHex(self);
    throw ArgErr.make("Invalid base " + base);
  }
  static toDuration(self) { return Duration.make(self); }
  static toDateTime(self, tz=TimeZone.cur()) {
    return (tz === undefined)
      ? DateTime.makeTicks(self)
      : DateTime.makeTicks(self, tz);
  }
  static times(self, f) {
    for (let i=0; i<self; ++i)
      f(i);
  }
  static charMap = [];
  static SPACE    = 0x01;
  static UPPER    = 0x02;
  static LOWER    = 0x04;
  static DIGIT    = 0x08;
  static HEX      = 0x10;
  static ALPHA    = Int.UPPER | Int.LOWER;
  static ALPHANUM = Int.UPPER | Int.LOWER | Int.DIGIT;
  static
  {
    Int.charMap[32] |= Int.SPACE;
    Int.charMap[10] |= Int.SPACE;
    Int.charMap[13] |= Int.SPACE;
    Int.charMap[9]  |= Int.SPACE;
    Int.charMap[12] |= Int.SPACE;
    for (let i=97; i<=122; ++i) Int.charMap[i] |= Int.LOWER;
    for (let i=65; i<=90;  ++i) Int.charMap[i] |= Int.UPPER;
    for (let i=48; i<=57; ++i) Int.charMap[i] |= Int.DIGIT;
    for (let i=48; i<=57;  ++i) Int.charMap[i] |= Int.HEX;
    for (let i=97; i<=102; ++i) Int.charMap[i] |= Int.HEX;
    for (let i=65; i<=70;  ++i) Int.charMap[i] |= Int.HEX;
  }
}
class Err extends Obj {
  constructor(msg = "", cause = null) {
    super();
    this.#err = new Error();
    this.#msg = msg;
    this.#cause = cause;
  }
  #err;
  #msg;
  #cause;
  static make(err, cause) {
    if (err instanceof Err) return err;
    if (err instanceof Error) {
      let m = err.message;
      if (m.indexOf(" from null") != -1)
        return NullErr.make(m, cause).assign$(err);
      if (m.indexOf(" of null") != -1)
        return NullErr.make(m, cause).assign$(err);
      return new Err(err.message, cause).assign$(err);
    }
    return new Err("" + err, cause);
  }
  static make$(self, msg, cause) {
    self.#err = new Error();
    self.#msg = msg;
    self.#cause = cause;
  }
  assign$(jsErr) {
    this.#err = jsErr;
    return this;
  }
  __err() {
    return this.#err;
  }
  msg() {
    return this.#msg;
  }
  cause() {
    return this.#cause;
  }
  toStr() {
    return `${this.typeof()}: ${this.#msg}`;
  }
  trace() {
    ObjUtil.echo(this.traceToStr());
  }
  traceToStr() {
    let s = this.typeof() + ": " + this.#msg;
    if (this.#err.stack) s += "\n" + Err.cleanTrace(this.#err.stack);
    if (this.#cause)
    {
      if (this.#cause.stack) s += "\n  Caused by: " + Err.cleanTrace(this.#cause.stack);
      else if (this.#cause)
      {
        if (this.#cause.traceToStr) s += "\n Caused by: " + this.#cause.traceToStr();
        else s += `\n Caused by ${this.#cause}`;
      }
    }
    return s;
  }
  static cleanTrace(orig) {
    let stack = [];
    let lines = orig.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.indexOf("@") != -1) {
        let about = line.lastIndexOf("@");
        let slash = line.lastIndexOf("/");
        if (slash != -1) {
          let func = "Unknown";
          let sub = "  at " + func + " (" + line.substr(slash + 1) + ")";
          stack.push(sub);
        }
      } else if (line.charAt(line.length - 1) == ")") {
        let paren = line.lastIndexOf("(");
        let slash = line.lastIndexOf("/");
        let sub = line.substring(0, paren + 1) + line.substr(slash + 1);
        stack.push(sub);
      } else {
        stack.push(line);
      }
    }
    return stack.join("\n") + "\n";
  }
}
class ArgErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new ArgErr(msg, cause); }
}
class CancelledErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new CancelledErr(msg, cause); }
}
class CastErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new CastErr(msg, cause); }
}
class ConstErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new ConstErr(msg, cause); }
}
class FieldNotSetErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new FieldNotSetErr(msg, cause); }
}
class IndexErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new IndexErr(msg, cause); }
}
class InterruptedErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new InterruptedErr(msg, cause); }
}
class IOErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new IOErr(msg, cause); }
}
class NameErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new NameErr(msg, cause); }
}
class NotImmutableErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new NotImmutableErr(msg, cause); }
}
class NullErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new NullErr(msg, cause); }
}
class ParseErr extends Err {
  constructor(type, val, more, cause) {
    let msg = type;
    if (val != undefined) {
      msg = `Invalid ${type}: '${val}'`;
      if (more != undefined) msg += ": " + more;
    }
    super(msg, cause);
  }
  static make(msg="", cause=null) { return new ParseErr(msg, null, null, cause); }
  static makeStr(type, val, more, cause) { return new ParseErr(type, val, more, cause); }
}
class ReadonlyErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new ReadonlyErr(msg, cause); }
}
class TestErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new TestErr(msg, cause); }
}
class TimeoutErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new TimeoutErr(msg, cause); }
}
class UnknownKeyErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new UnknownKeyErr(msg, cause); }
}
class UnknownPodErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new UnknownPodErr(msg, cause); }
}
class UnknownServiceErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new UnknownServiceErr(msg, cause); }
}
class UnknownSlotErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new UnknownSlotErr(msg, cause); }
}
class UnknownFacetErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new UnknownFacetErr(msg, cause); }
}
class UnknownTypeErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new UnknownTypeErr(msg, cause); }
}
class UnresolvedErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new UnresolvedErr(msg, cause); }
}
class UnsupportedErr extends Err {
  constructor(msg = "", cause = null) { super(msg, cause); }
  static make(msg="", cause=null) { return new UnsupportedErr(msg, cause); }
}
class Unsafe extends Obj {
  constructor(val) {
    super();
    this.#val = val;
  }
  #val;
  static make(val) { return new Unsafe(val); }
  val() { return this.#val; }
}
class Pod extends Obj {
  constructor(name) {
    super();
    this.#name = name;
    this.#types = [];
    this.#meta = [];
    this.#version = Version.defVal;
    this.#uri = undefined;
    this.#depends = undefined;
    this.#$types = undefined;
    this.#log = undefined;
  }
  static #pods = [];
  static #list = null;
  static sysPod$ = undefined;
  #name;
  #types;
  #meta;
  #version;
  #uri;
  #depends;
  #$types;
  #log;
  static of(obj) {
    return Type.of(obj).pod();
  }
  static list() {
    if (Pod.#list == null) {
      let pods = Pod.#pods;
      let list = List.make(Pod.type$);
      for (let n in pods) list.add(pods[n]);
      Pod.#list = list.sort().toImmutable();
    }
    return Pod.#list;
  }
  static load(instream) {
    throw UnsupportedErr.make("Pod.load");
  }
  name() { return this.#name; }
  meta() { return this.#meta; }
  __meta(it) {
    this.#meta = it.toImmutable();
    this.#version = Version.fromStr(this.#meta.get("pod.version"));
  }
  version() { return this.#version; }
  uri() {
    if (this.#uri === undefined) this.#uri = Uri.fromStr(`fan://${this.#name}`);
    return this.#uri;
  }
  depends() {
    if (this.#depends === undefined) {
      let arr = [];
      let depends = this.meta().get("pod.depends").split(";");
      for (let i=0; i<depends.length; ++i) {
        let d = depends[i];
        if (d == "") continue;
        arr.push(Depend.fromStr(d));
      }
      this.#depends = List.make(Depend.type$, arr);
    }
    return this.#depends;
  }
  toStr() { return this.#name; }
  files() { throw UnsupportedErr.make("Pod.files"); }
  file(uri, checked) { throw UnsupportedErr.make("Pod.file"); }
  types() {
    if (this.#$types == null) {
      let arr = [];
      for (let p in this.#types) arr.push(this.#types[p]);
      this.#$types = List.make(Type.type$, arr);
    }
    return this.#$types;
  }
  type(name, checked=true) {
    let t = this.#types[name];
    if (t == null && checked) {
      throw UnknownTypeErr.make(`${this.#name}::${name}`);
    }
    return t;
  }
  at$(name, baseQname, mixins, facets, flags, jsRef) {
    let qname = `${this.#name}::${name}`;
    if (this.#types[name] != null) {
      throw Err.make(`Type already exists: ${qname}`);
    }
    let t = new Type(qname, baseQname, mixins, facets, flags, jsRef);
    this.#types[name] = t;
    return t;
  }
  am$(name, baseQname, mixins, facets, flags, jsRef) {
    let t = this.at$(name, baseQname, mixins, facets, flags, jsRef);
    return t;
  }
  static find(name, checked=true) {
    let p = Pod.#pods[name];
    if (p == null && checked) {
      throw UnknownPodErr.make(name);
    }
    return p;
  }
  static add$(name) {
    if (Pod.#pods[name] != null) {
      throw Err.make(`Pod already exists: ${name}`);
    }
    let p = new Pod(name);
    Pod.#pods[name] = p;
    return p;
  }
  log() {
    if (this.#log == null) {
      this.#log = Log.get(this.#name);
    }
    return this.#log;
  }
  props(uri, maxAge) {
    return Env.cur().props(this, uri, maxAge);
  }
  config(key, def=null) {
    return Env.cur().config(this, key, def);
  }
  doc() { return null; }
  locale(key, def) {
    return Env.cur().locale(this, key, def);
  }
}
class Void extends Obj {
  constructor() { super(); }
}
class Version extends Obj {
  constructor(segments) {
    super();
    this.#segments = segments.ro();
  }
  #segments;
  static fromStr(s, checked=true) {
    let segments = List.make(Int.type$);
    let seg = -1;
    let valid = true;
    let len = s.length;
    for (let i=0; i<len; ++i) {
      const c = s.charCodeAt(i);
      if (c == 46) {
        if (seg < 0 || i+1>=len) { valid = false; break; }
        segments.add(seg);
        seg = -1;
      }
      else {
        if (48 <= c && c <= 57) {
          if (seg < 0) seg = c-48;
          else seg = seg*10 + (c-48);
        }
        else {
          valid = false; break;
        }
      }
    }
    if (seg >= 0) segments.add(seg);
    if (!valid || segments.size() == 0)
    {
      if (checked)
        throw ParseErr.makeStr("Version", s);
      else
        return null;
    }
    return new Version(segments);
  }
  static make(segments) {
    let valid = segments.size() > 0;
    for (let i=0; i<segments.size(); ++i)
      if (segments.get(i) < 0) valid = false;
    if (!valid) throw ArgErr.make("Invalid Version: '" + segments + "'");
    return new Version(segments);
  }
  static #defVal = undefined;
  static defVal() {
    if (Version.#defVal === undefined) Version.#defVal = Version.fromStr("0");
    return Version.#defVal;
  }
  equals(obj) {
    if (obj instanceof Version)
      return this.toStr() == obj.toStr();
    else
      return false;
  }
  compare(obj) {
    const that = obj;
    const a = this.#segments;
    const b = that.#segments;
    for (let i=0; i<a.size() && i<b.size(); ++i) {
      const ai = a.get(i);
      const bi = b.get(i);
      if (ai < bi) return -1;
      if (ai > bi) return +1;
    }
    if (a.size() < b.size()) return -1;
    if (a.size() > b.size()) return +1;
    return 0;
  }
  hash() { return Str.hash(this.toStr()); }
  toStr() {
    if (this.str$ == null) {
      let s = "";
      for (let i=0; i<this.#segments.size(); ++i)
      {
        if (i > 0) s += '.';
        s += this.#segments.get(i);
      }
      this.str$ = s;
    }
    return this.str$;
  }
  segments() { return this.#segments; }
  segment(index) { return this.#segments.get(index); }
  major() { return this.#segments.get(0); }
  minor() {
    if (this.#segments.size() < 2) return null;
    return this.#segments.get(1);
  }
  build() {
    if (this.#segments.size() < 3) return null;
    return this.#segments.get(2);
  }
  patch() {
    if (this.#segments.size() < 4) return null;
    return this.#segments.get(3);
  }
}
class Date extends Obj {
  constructor(year, month, day) {
    super();
    this.#year = year;
    this.#month = month;
    this.#day = day;
  }
  #year;
  #month;
  #day;
  static #defVal;
  static defVal() {
    if (!Date.#defVal) Date.#defVal = new Date(2000, 0, 1)
    return Date.#defVal;
  }
  equals(that) {
    if (that instanceof Date) {
      return this.#year.valueOf() == that.#year.valueOf() &&
            this.#month.valueOf() == that.#month.valueOf() &&
            this.#day.valueOf() == that.#day.valueOf();
    }
    return false;
  }
  compare(that) {
    if (this.#year.valueOf() == that.#year.valueOf()) {
      if (this.#month.valueOf() == that.#month.valueOf())
      {
        if (this.#day.valueOf() == that.#day.valueOf()) return 0;
        return this.#day < that.#day ? -1 : +1;
      }
      return this.#month < that.#month ? -1 : +1;
    }
    return this.#year < that.#year ? -1 : +1;
  }
  toIso() { return this.toStr(); }
  hash() { return (this.#year << 16) ^ (this.#month << 8) ^ this.#day; }
  toStr() {
    if (this.str$ == null) this.str$ = this.toLocale("YYYY-MM-DD");
    return this.str$;
  }
  year() { return this.#year; }
  month() { return Month.vals().get(this.#month); }
  day() { return this.#day; }
  weekday() {
    const weekday = (DateTime.__firstWeekday(this.#year, this.#month) + this.#day - 1) % 7;
    return Weekday.vals().get(weekday);
  }
  dayOfYear() {
    return DateTime.__dayOfYear(this.year(), this.month().ordinal(), this.day())+1;
  }
  weekOfYear(startOfWeek=Weekday.localeStartOfWeek()) {
    return DateTime.__weekOfYear(this.year(), this.month().ordinal(), this.day(), startOfWeek);
  }
  plus(d) {
    let ticks = d.ticks();
    if (ticks % Duration.nsPerDay$ != 0)
      throw ArgErr.make("Duration must be even num of days");
    let year = this.#year;
    let month = this.#month;
    let day = this.#day;
    let numDays = Int.div(ticks, Duration.nsPerDay$);
    const dayIncr = numDays < 0 ? +1 : -1;
    while (numDays != 0) {
      if (numDays > 0) {
        day++;
        if (day > this.#numDays(year, month)) {
          day = 1;
          month++;
          if (month >= 12) { month = 0; year++; }
        }
        numDays--;
      }
      else {
        day--;
        if (day <= 0) {
          month--;
          if (month < 0) { month = 11; year--; }
          day = this.#numDays(year, month);
        }
        numDays++;
      }
    }
    return new Date(year, month, day);
  }
  minus(d) { return this.plus(d.negate()); }
  minusDate(that) {
    if (this.equals(that)) return Duration.defVal();
    let a = this;
    let b = that;
    if (a.compare(b) > 0) { b = this; a = that; }
    let days = 0;
    if (a.#year == b.#year) {
      days = b.dayOfYear() - a.dayOfYear(); }
    else
    {
      days = (DateTime.isLeapYear(a.#year) ? 366 : 365) - a.dayOfYear();
      days += b.dayOfYear();
      for (let i=a.#year+1; i<b.#year; ++i)
        days += DateTime.isLeapYear(i) ? 366 : 365;
    }
    if (a == this) days = -days;
    return Duration.make(days * Duration.nsPerDay$);
  }
  #numDays(year, mon) { return DateTime.__numDaysInMonth(year, mon); }
  firstOfMonth() {
    if (this.#day == 1) return this;
    return new Date(this.#year, this.#month, 1);
  }
  lastOfMonth() {
    const last = this.month().numDays(this.#year);
    if (this.#day == last) return this;
    return new Date(this.#year, this.#month, last);
  }
  toLocale(pattern=null, locale=Locale.cur()) {
    if (pattern == null) {
      const pod = Pod.find("sys");
      pattern = Env.cur().locale(pod, "date", "D-MMM-YYYY", locale);
    }
    return DateTimeStr.makeDate(pattern, locale, this).format();
  }
  static fromLocale(s, pattern=null, checked=true) {
    return DateTimeStr.make(pattern, null).parseDate(s, checked);
  }
  static make(year, month, day) {
    return new Date(year, month.ordinal(), day);
  }
  static today(tz=TimeZone.cur()) {
    return DateTime.makeTicks(DateTime.nowTicks(), tz).date();
  }
  static yesterday(tz=TimeZone.cur()) {
    return Date.today(tz).minus(Duration.oneDay$());
  }
  static tomorrow(tz=TimeZone.cur()) {
    return Date.today(tz).plus(Duration.oneDay$());
  }
  static fromStr(s, checked=true) {
    try {
      const num = function(x, index) { return x.charCodeAt(index) - 48; }
      const year  = num(s, 0)*1000 + num(s, 1)*100 + num(s, 2)*10 + num(s, 3);
      const month = num(s, 5)*10   + num(s, 6) - 1;
      const day   = num(s, 8)*10   + num(s, 9);
      if (s.charAt(4) != '-' || s.charAt(7) != '-' || s.length != 10)
        throw new Error();
      return new Date(year, month, day);
    }
    catch (err) {
      if (!checked) return null;
      throw ParseErr.makeStr("Date", s);
    }
  }
  static fromIso(s, checked=true) { return Date.fromStr(s, checked); }
  isYesterday() { return this.equals(Date.today().plus(Duration.negOneDay$())); }
  isToday() { return this.equals(Date.today()); }
  isTomorrow() { return this.equals(Date.today().plus(Duration.oneDay$())); }
  toDateTime(t, tz=TimeZone.cur()) {
    return DateTime.__makeDT(this, t, tz);
  }
  midnight(tz=TimeZone.cur()) {
    return DateTime.__makeDT(this, Time.defVal(), tz);
  }
  toCode() {
    if (this.equals(Date.defVal())) return "Date.defVal";
    return "Date(\"" + this.toString() + "\")";
  }
}
class Enum extends Obj {
  constructor() { super(); }
  #ordinal;
  #name;
  static make(ordinal, name) {
    throw new Error("this should never be used");
  }
  static make$(self, ordinal, name) {
    if (name == null) throw NullErr.make();
    self.#ordinal = ordinal;
    self.#name = name;
  }
  static doFromStr(t, vals, name, checked=true) {
    const slot = t.slot(name, false);
    if (slot != null && (slot.flags$() & FConst.Enum) != 0) {
      const v = vals.find((it) => { return it.name() == name; });
      if (v != null) return v;
    }
    if (!checked) return null;
    throw ParseErr.makeStr(t.qname(), name);
  }
  equals(that) { return this == that; }
  compare(that) {
    if (this.#ordinal < that.#ordinal) return -1;
    if (this.#ordinal == that.#ordinal) return 0;
    return +1;
  }
  toStr() { return this.#name; }
  ordinal() { return this.#ordinal; }
  name() { return this.#name; }
}
class Endian extends Enum {
  constructor(ordinal, name) {
    super();
    Enum.make$(this, ordinal, name);
  }
  static big() { return Endian.vals().get(0); }
  static little() { return Endian.vals().get(1); }
  static #vals = undefined;
  static vals() {
    if (Endian.#vals === undefined) {
      Endian.#vals = List.make(Endian.type$,
        [new Endian(0, "big"), new Endian(1, "little")]).toImmutable();
    }
    return Endian.#vals;
  }
  static fromStr(name, checked=true) {
    return Enum.doFromStr(Endian.type$, Endian.vals(), name, checked);
  }
}
class Test extends Obj {
  constructor() {
    super();
    this.#verbose = false;
    this.#verifyCount = 0;
  }
  #curTestMethod;
  #verbose;
  #verifyCount;
  #tempDir;
  static make$(self) { }
  verifyCount$() { return this.#verifyCount; }
  curTestMethod() {
    return this.#curTestMethod;
  }
  verify(cond, msg=null) {
    if (!cond) this.fail(msg);
    this.#verifyCount++;
  }
  verifyTrue(cond, msg=null) {
    return this.verify(cond, msg);
  }
  verifyFalse(cond, msg=null) {
    if (cond) this.fail(msg);
    this.#verifyCount++;
  }
  verifyNull(a, msg=null) {
    if (a != null) {
      if (msg == null) msg = ObjUtil.toStr(a) + " is not null";
      this.fail(msg);
    }
    this.#verifyCount++;
  }
  verifyNotNull(a, msg=null) {
    if (a == null) {
      if (msg == null) msg = ObjUtil.toStr(a) + " is null";
      this.fail(msg);
    }
    this.#verifyCount++;
  }
  verifyEq(expected, actual, msg=null) {
    if (!ObjUtil.equals(expected, actual)) {
      if (msg == null) msg = ObjUtil.toStr(expected) + " != " + ObjUtil.toStr(actual);
      this.fail(msg);
    }
    this.#verifyCount++;
  }
  verifyNotEq(expected, actual, msg=null)
  {
    if (ObjUtil.equals(expected, actual)) {
      if (msg == null) msg = ObjUtil.toStr(expected) + " == " + ObjUtil.toStr(actual);
      this.fail(msg);
    }
    this.#verifyCount++;
  }
  verifySame(expected, actual, msg=null) {
    if (!ObjUtil.same(expected, actual)) {
      if (msg == null) msg = ObjUtil.toStr(expected) + " [" + expected.typeof() + "] != " + ObjUtil.toStr(actual) + " [" + actual.typeof() + "]";
      this.fail(msg);
    }
    this.#verifyCount++;
  }
  verifyNotSame(expected, actual, msg=null) {
    if (ObjUtil.same(expected, actual)) {
      if (msg == null) msg = ObjUtil.toStr(expected) + " === " + ObjUtil.toStr(actual);
      this.fail(msg);
    }
    this.#verifyCount++;
  }
  verifyType(obj, t) {
    this.verifyEq(Type.of(obj), t);
  }
  verifyErr(errType, func) {
    try
    {
      func();
    }
    catch (err)
    {
      const e = Err.make(err);
      if (e.typeof() == errType || errType == null) { this.#verifyCount++; return; }
      console.log("  verifyErr: " + e + "\n");
      this.fail(e.typeof() + " thrown, expected " + errType);
    }
    this.fail("No err thrown, expected " + errType);
  }
  verifyErrMsg(errType, errMsg, func) {
    try
    {
      func();
    }
    catch (err)
    {
      const e = Err.make(err);
      if (e.typeof() != errType) {
        print("  verifyErrMsg: " + e + "\n");
        this.fail(e.typeof() + " thrown, expected " + errType);
      }
      this.#verifyCount++;
      this.verifyEq(errMsg, e.msg());
      return;
    }
    this.fail("No err thrown, expected " + errType);
  }
  fail(msg=null) {
    throw this.#err(msg);
  }
  #err(msg=null) {
    if (msg == null)
      return Err.make("Test failed");
    else
      return Err.make("Test failed: " + msg);
  }
  setup() {}
  teardown() {}
  trap(name, args=null) {
    switch (name)
    {
      case "verifyCount":
        return this.#verifyCount;
      case "verbose":
        if (args != null && args.size() == 1) this.#verbose = args.get(0);
        return this.#verbose
        return null;
      case "curTestMethod":
        if (args != null && args.size() == 1) this.#curTestMethod = args.get(0);
        return this.curTestMethod();
    }
    return super.trap(name, args);
  }
  tempDir() {
    if (this.#tempDir == null && Env.__isNode()) {
      const x = Env.cur().tempDir();
      this.#tempDir = x.plus(Uri.fromStr("test/"), false);
      this.#tempDir.delete();
      this.#tempDir.create();
    }
    return this.#tempDir;
  }
}
class Duration extends Obj {
  constructor(ticks) {
    super();
    this.#ticks = ticks;
  }
  #ticks;
  static #defVal;
  static defVal() {
    if (!Duration.#defVal) Duration.#defVal = new Duration(0);
    return Duration.#defVal;
  }
  static __boot;
  static nsPerYear$  = 365*24*60*60*1000000000;
  static nsPerDay$   = 86400000000000;
  static nsPerHr$    = 3600000000000;
  static nsPerMin$   = 60000000000;
  static nsPerSec$   = 1000000000;
  static nsPerMilli$ = 1000000;
  static secPerDay$  = 86400;
  static secPerHr$   = 3600;
  static secPerMin$  = 60;
  static minVal() { return new Duration(Int.minVal()); }
  static maxVal() { return new Duration(Int.maxVal()); }
  static oneDay$() { return new Duration(Duration.nsPerDay$); }
  static oneMin$() { return new Duration(Duration.nsPerMin$); }
  static oneSec$() { return new Duration(Duration.nsPerSec$); }
  static negOneDay$() { return new Duration(-Duration.nsPerDay$); }
  static fromStr(s, checked=true) {
    try
    {
      const len = s.length;
      const x1  = s.charAt(len-1);
      const x2  = s.charAt(len-2);
      const x3  = s.charAt(len-3);
      const dot = s.indexOf('.') > 0;
      let mult = -1;
      let suffixLen  = -1;
      switch (x1)
      {
        case 's':
          if (x2 == 'n') { mult=1; suffixLen=2; }
          if (x2 == 'm') { mult=1000000; suffixLen=2; }
          break;
        case 'c':
          if (x2 == 'e' && x3 == 's') { mult=1000000000; suffixLen=3; }
          break;
        case 'n':
          if (x2 == 'i' && x3 == 'm') { mult=60000000000; suffixLen=3; }
          break;
        case 'r':
          if (x2 == 'h') { mult=3600000000000; suffixLen=2; }
          break;
        case 'y':
          if (x2 == 'a' && x3 == 'd') { mult=86400000000000; suffixLen=3; }
          break;
      }
      if (mult < 0) throw new Error();
      s = s.substring(0, len-suffixLen);
      if (dot) {
        const num = parseFloat(s);
        if (isNaN(num)) throw new Error();
        return Duration.make(Math.floor(num*mult));
      }
      else {
        const num = Int.fromStr(s);
        return Duration.make(num*mult);
      }
    }
    catch (err) {
      if (!checked) return null;
      throw ParseErr.makeStr("Duration", s);
    }
  }
  static now() {
    const ms = new js.Date().getTime();
    return Duration.make(ms * Duration.nsPerMilli$);
  }
  static nowTicks() { return Duration.now().ticks(); }
  static boot() { return Duration.__boot; }
  static uptime() { return Duration.now().minus(Duration.boot()); }
  static make(ticks) { return new Duration(ticks); }
  static makeMillis(ms) { return Duration.make(ms*1000000); }
  static makeSec(secs) { return Duration.make(secs*1000000000); }
  equals(that) {
    if (that instanceof Duration)
      return this.#ticks == that.#ticks;
    else
      return false;
  }
  compare(that) {
    if (this.#ticks < that.#ticks) return -1;
    if (this.#ticks == that.#ticks) return 0;
    return +1;
  }
  hash() { return (this.#ticks ^ (this.#ticks >> 32)); }
  ticks() { return this.#ticks; }
  negate() { return Duration.make(-this.#ticks); }
  plus(x) { return Duration.make(this.#ticks + x.#ticks); }
  minus(x) { return Duration.make(this.#ticks - x.#ticks); }
  mult(x) { return Duration.make(this.#ticks * x); }
  multFloat(x) { return Duration.make(this.#ticks * x); }
  div(x) { return Duration.make(this.#ticks / x); }
  divFloat(x) { return Duration.make(this.#ticks / x); }
  floor(accuracy) {
    if (this.#ticks % accuracy.#ticks == 0) return this;
    return Duration.make(this.#ticks - (this.#ticks % accuracy.#ticks));
  }
  min(that) {
    if (this.#ticks <= that.#ticks) return this;
    else return that;
  }
  max(that) {
    if (this.#ticks >= that.#ticks) return this;
    else return that;
  }
  clamp(min, max) {
    if (this.#ticks < min.#ticks) return min;
    if (this.#ticks > max.#ticks) return max;
    return this;
  }
  abs() {
    if (this.#ticks >= 0) return this;
    return Duration.make(-this.#ticks);
  }
  toStr() {
    if (this.#ticks == 0) return "0ns";
    const ns = this.#ticks;
    if (ns % Duration.nsPerMilli$ == 0)
    {
      if (ns % Duration.nsPerDay$ == 0) return ns/Duration.nsPerDay$ + "day";
      if (ns % Duration.nsPerHr$  == 0) return ns/Duration.nsPerHr$  + "hr";
      if (ns % Duration.nsPerMin$ == 0) return ns/Duration.nsPerMin$ + "min";
      if (ns % Duration.nsPerSec$ == 0) return ns/Duration.nsPerSec$ + "sec";
      return ns/Duration.nsPerMilli$ + "ms";
    }
    return ns + "ns";
  }
  literalEncode$(out) { out.w(this.toStr()); }
  toCode() { return this.toStr(); }
  toMillis() { return Math.floor(this.#ticks / Duration.nsPerMilli$); }
  toSec() { return Math.floor(this.#ticks / Duration.nsPerSec$); }
  toMin() { return Math.floor(this.#ticks / Duration.nsPerMin$); }
  toHour() { return Math.floor(this.#ticks / Duration.nsPerHr$); }
  toDay() { return Math.floor(this.#ticks / Duration.nsPerDay$); }
  toLocale() {
    let ticks = this.#ticks;
    const pod = Duration.type$.pod();
    const env = Env.cur();
    const locale = Locale.cur();
    if (ticks < 0) return "-" + Duration.make(-ticks).toLocale();
    if (ticks < 1000) return ticks + env.locale(pod, "nsAbbr", "ns",  locale);
    if (ticks < 2*Duration.nsPerMilli$) {
      let s = '';
      const ms = Math.floor(ticks/Duration.nsPerMilli$);
      const us = Math.floor((ticks - ms*Duration.nsPerMilli$)/1000);
      s += ms;
      s += '.';
      if (us < 100) s += '0';
      if (us < 10)  s += '0';
      s += us;
      if (s.charAt(s.length-1) == '0') s = s.substring(0, s.length-1);
      if (s.charAt(s.length-1) == '0') s = s.substring(0, s.length-1);
      s += env.locale(pod, "msAbbr", "ms",  locale);;
      return s;
    }
    if (ticks < 2*Duration.nsPerSec$)
      return Math.floor(ticks/Duration.nsPerMilli$) + env.locale(pod, "msAbbr", "ms",  locale);
    if (ticks < 1*Duration.nsPerMin$)
      return Math.floor(ticks/Duration.nsPerSec$) + env.locale(pod, "secAbbr", "sec",  locale);
    const days = Math.floor(ticks/Duration.nsPerDay$); ticks -= days*Duration.nsPerDay$;
    const hr   = Math.floor(ticks/Duration.nsPerHr$);  ticks -= hr*Duration.nsPerHr$;
    const min  = Math.floor(ticks/Duration.nsPerMin$); ticks -= min*Duration.nsPerMin$;
    const sec  = Math.floor(ticks/Duration.nsPerSec$);
    let s = '';
    if (days > 0) s += days + (days == 1 ? env.locale(pod, "dayAbbr", "day", locale) : env.locale(pod, "daysAbbr", "days", locale)) + " ";
    if (hr  > 0) s += hr  + env.locale(pod, "hourAbbr", "hr",  locale) + " ";
    if (min > 0) s += min + env.locale(pod, "minAbbr",  "min", locale) + " ";
    if (sec > 0) s += sec + env.locale(pod, "secAbbr",  "sec", locale) + " ";
    return s.substring(0, s.length-1);
  }
  toIso() {
    let s = '';
    let ticks = this.#ticks;
    if (ticks == 0) return "PT0S";
    if (ticks < 0) s += '-';
    s += 'P';
    const abs  = Math.abs(ticks);
    let sec  = Math.floor(abs / Duration.nsPerSec$);
    const frac = abs % Duration.nsPerSec$;
    if (sec > Duration.secPerDay$) {
      s += Math.floor(sec/Duration.secPerDay$) + 'D';
      sec = sec % Duration.secPerDay$;
    }
    if (sec == 0 && frac == 0) return s;
    s += 'T';
    if (sec > Duration.secPerHr$) {
      s += Math.floor(sec/Duration.secPerHr$) + 'H';
      sec = sec % Duration.secPerHr$;
    }
    if (sec > Duration.secPerMin$) {
      s += Math.floor(sec/Duration.secPerMin$) + 'M';
      sec = sec % Duration.secPerMin$;
    }
    if (sec == 0 && frac == 0) return s;
    s += sec;
    if (frac != 0) {
      s += '.';
      for (let i=10; i<=100000000; i*=10) if (frac < i) s += '0';
      s += frac;
      let x = s.length-1;
      while (s.charAt(x) == '0') x--;
      s = s.substring(0, x+1);
    }
    s += 'S';
    return s;
  }
  static fromIso(s, checked=true)
  {
    try
    {
      let ticks = 0;
      let neg = false;
      const p = new IsoParser(s);
      if (p.cur == 45) { neg = true; p.consume(); }
      else if (p.cur == 43) { p.consume(); }
      p.consume(80);
      if (p.cur == -1) throw new Error();
      let num = 0;
      if (p.cur != 84) {
        num = p.num();
        p.consume(68);
        ticks += num * Duration.nsPerDay$;
        if (p.cur == -1) return Duration.make(ticks);
      }
      p.consume(84);
      if (p.cur == -1) throw new Error();
      num = p.num();
      if (num >= 0 && p.cur == 72) {
        p.consume();
        ticks += num * Duration.nsPerHr$;
        num = p.num();
      }
      if (num >= 0 && p.cur == 77) {
        p.consume();
        ticks += num * Duration.nsPerMin$;
        num = p.num();
      }
      if (num >= 0 && p.cur == 83 || p.cur == 46) {
        ticks += num * Duration.nsPerSec$;
        if (p.cur == 46) { p.consume(); ticks += p.frac(); }
        p.consume(83);
      }
      if (p.cur != -1) throw new Error();
      if (neg) ticks = -ticks;
      return Duration.make(ticks);
    }
    catch (err) {
      if (!checked) return null;
      throw ParseErr.makeStr("ISO 8601 Duration",  s);
    }
  }
}
class IsoParser {
  constructor(s) {
    this.s = s;
    this.cur = s.charCodeAt(0);
    this.off = 0;
    this.curIsDigit = false;
  }
  s;
  cur;
  off;
  curIsDigit;
  num() {
    if (!this.curIsDigit && this.cur != -1 && this.cur != 46)
      throw new Error();
    let num = 0;
    while (this.curIsDigit) {
      num = num*10 + this.digit();
      this.consume();
    }
    return num;
  }
  frac() {
    let ticks = 0;
    for (let i=100000000; i>=0; i/=10)
    {
      if (!this.curIsDigit) break;
      ticks += this.digit() * i;
      this.consume();
    }
    return ticks;
  }
  digit() { return this.cur - 48; }
  consume(ch) {
    if (ch != null && this.cur != ch) throw new Error();
    this.off++;
    if (this.off < this.s.length) {
      this.cur = this.s.charCodeAt(this.off);
      this.curIsDigit = 48 <= this.cur && this.cur <= 57;
    }
    else
    {
      this.cur = -1;
      this.curIsDigit = false;
    }
  }
}
class Process extends Obj {
  constructor() { super(); }
  static make(cmd=List.make(Str.type$), dir=null) {
    throw UnsupportedErr.make();
  }
}
class Decimal extends Num {
  constructor() { super(); }
  static #defVal;
  static defVal() {
    if (!Decimal.#defVal) Decimal.#defVal = Decimal.make(0);
    return Decimal.#defVal;
  }
  static make(val) {
    const x = new Number(val);
    x.fanType$ = Decimal.type$;
    return x;
  }
  static fromStr(s, checked=true) {
    try
    {
      for (let i=0; i<s.length; i++)
        if (!Int.isDigit(s.charCodeAt(i)) && s[i] !== '.')
          throw new Error();
      return Decimal.make(parseFloat(s));
    }
    catch (e)
    {
      if (!checked) return null;
      throw ParseErr.make("Decimal",  s);
    }
  }
  static toFloat(self) { return Float.make(self.valueOf()); }
  static negate(self) { return Decimal.make(-self.valueOf()); }
  static equals(self, that) {
    if (that != null && self.fanType$ === that.fanType$)
    {
      if (isNaN(self) || isNaN(that)) return false;
      return self.valueOf() == that.valueOf();
    }
    return false;
  }
  static hash(self) { Str.hash(self.toString()); }
  static encode(self, out) { out.w(""+self).w("d"); }
  static toCode(self) { return "" + self + "d"; }
  static toLocale(self, pattern=null, locale=Locale.cur()) {
    return Float.toLocale(self, pattern, locale);
  }
  static toStr(self) { return Float.toStr(self); }
}
class Locale extends Obj {
  constructor(str, lang, country) {
    super();
    this.#str = str;
    this.#lang = lang;
    this.#country = country;
    this.__strProps = Uri.fromStr(`locale/${str}.props`);
    this.__langProps = Uri.fromStr(`locale/${lang}.props`);
  }
  static #cur = undefined;
  static #en = undefined;
  #str;
  #lang;
  #country;
  #monthsByName;
  #numSymbols;
  __strProps;
  __langProps;
  static fromStr(s, checked=true)
  {
    const len = s.length;
    try {
      if (len == 2) {
        if (Str.isLower(s))
          return new Locale(s, s, null);
      }
      if (len == 5) {
        const lang = s.substring(0, 2);
        const country = s.substring(3, 5);
        if (Str.isLower(lang) && Str.isUpper(country) && s.charAt(2) == '-')
          return new Locale(s, lang, country);
      }
    }
    catch (err) {}
    if (!checked) return null;
    throw ParseErr.makeStr("Locale", s);
  }
  static en() {
    if (Locale.#en === undefined) Locale.#en = Locale.fromStr("en");
    return Locale.#en;
  }
  static cur() {
    if (Locale.#cur === undefined) {
      let loc = Env.cur().vars().get("locale");
      if (loc == null) loc = "en-US"
      Locale.#cur = Locale.fromStr(loc);
    }
    return Locale.#cur;
  }
  static setCur(locale) {
    if (locale == null) throw NullErr.make();
    Locale.#cur = locale;
  }
  use(func) {
    const old = Locale.cur();
    try {
      Locale.setCur(this);
      func(this);
    }
    finally {
      Locale.setCur(old);
    }
    return this;
  }
  lang() { return this.#lang; }
  country() { return this.#country; }
  hash() { return Str.hash(this.#str); }
  equals(obj) {
    if (obj instanceof Locale)
      return obj.#str == this.#str;
    return false;
  }
  toStr() { return this.#str; }
  __monthByName(name)
  {
    if (!this.#monthsByName) {
      const map = {};
      for (let i=0; i<Month.vals().size(); ++i) {
        const m = Month.vals().get(i);
        map[Str.lower(m.__abbr(this))] = m;
        map[Str.lower(m.__full(this))] = m;
      }
      this.#monthsByName = map;
    }
    return this.#monthsByName[name];
  }
  __numSymbols() {
    if (!this.#numSymbols) {
      const pod = Pod.find("sys");
      const env = Env.cur();
      this.#numSymbols =
      {
        decimal:  env.locale(pod, "numDecimal",  ".",    this),
        grouping: env.locale(pod, "numGrouping", ",",    this),
        minus:    env.locale(pod, "numMinus",    "-" ,   this),
        percent:  env.locale(pod, "numPercent",  "%",    this),
        posInf:   env.locale(pod, "numPosInf",   "+Inf", this),
        negInf:   env.locale(pod, "numNegInf",   "-Inf", this),
        nan:      env.locale(pod, "numNaN",      "NaN",  this)
      };
    }
    return this.#numSymbols;
  }
}
class This extends Obj {
  constructor() { super(); }
}
class StrBuf extends Obj {
  constructor() {
    super();
    this.#str = "";
    this.#capacity = null;
  }
  #str;
  #capacity;
  static make() { return new StrBuf(); }
  add(obj) {
    this.#str += obj==null ? "null" : ObjUtil.toStr(obj);
    return this;
  }
  addChar(ch) {
    this.#str += String.fromCharCode(ch);
    return this;
  }
  addRange(str, range) {
    this.#str += Str.getRange(str, range);
    return this;
  }
  capacity(it=undefined) {
    if (it === undefined) {
      if (this.#capacity == null) return this.#str.length;
      return this.#capacity;
    }
    this.#capacity = it;
  }
  clear() {
    this.#str = "";
    return this;
  }
  get(i) {
    if (i < 0) i = this.#str.length+i;
    if (i < 0 || i >= this.#str.length) throw IndexErr.make(i);
    return this.#str.charCodeAt(i);
  }
  getRange(range) {
    const size = this.#str.length;
    const s = range.__start(size);
    const e = range.__end(size);
    if (e+1 < s) throw IndexErr.make(range);
    return this.#str.substr(s, (e-s)+1);
  }
  set(i, ch) {
    if (i < 0) i = this.#str.length+i;
    if (i < 0 || i >= this.#str.length) throw IndexErr.make(i);
    this.#str = this.#str.substring(0,i) + String.fromCharCode(ch) + this.#str.substring(i+1);
    return this;
  }
  join(x, sep=" ") {
    const s = (x == null) ? "null" : ObjUtil.toStr(x);
    if (this.#str.length > 0) this.#str += sep;
    this.#str += s;
    return this;
  }
  insert(i, x) {
    const s = (x == null) ? "null" : ObjUtil.toStr(x);
    if (i < 0) i = this.#str.length+i;
    if (i < 0 || i > this.#str.length) throw IndexErr.make(i);
    this.#str = this.#str.substring(0,i) + s + this.#str.substring(i);
    return this;
  }
  remove(i) {
    if (i < 0) i = this.#str.length+i;
    if (i< 0 || i >= this.#str.length) throw IndexErr.make(i);
    this.#str = this.#str.substring(0,i) + this.#str.substring(i+1);
    return this;
  }
  removeRange(r) {
    const s = r.__start(this.#str.length);
    const e = r.__end(this.#str.length);
    const n = e - s + 1;
    if (s < 0 || n < 0) throw IndexErr.make(r);
    this.#str = this.#str.substring(0,s) + this.#str.substring(e+1);
    return this;
  }
  replaceRange(r, str) {
    const s = r.__start(this.#str.length);
    const e = r.__end(this.#str.length);
    const n = e - s + 1;
    if (s < 0 || n < 0) throw IndexErr.make(r);
    this.#str = this.#str.substr(0,s) + str + this.#str.substr(e+1);
    return this;
  }
  reverse() {
    this.#str = Str.reverse(this.#str);
    return this;
  }
  isEmpty() { return this.#str.length == 0; }
  size() { return this.#str.length; }
  toStr() { return this.#str; }
  out() { return new StrBufOutStream(this); }
}
class LogRec extends Obj {
  constructor(time, level, logName, msg, err=null) {
    super();
    this.time$ = time;
    this.level$ = level;
    this.logName$ = logName;
    this.msg$ = msg;
    this.err$ = err;
  }
  time$;
  level$;
  logName$;
  msg$;
  err$;
  static make(time, level, logName, msg, err=null) {
    return new LogRec(time, level, logName, msg, err);
  }
  time() { return this.time$; }
  level() { return this.level$; }
  logName() { return this.logName$; }
  msg() { return this.msg$; }
  err() { return this.err$; }
  toStr() {
    const ts = this.time$.toLocale("hh:mm:ss DD-MMM-YY");
    return '[' + ts + '] [' + this.level$ + '] [' + this.logName$ + '] ' + this.msg$;
  }
  print(out) {
    ObjUtil.echo(this.toStr());
    if (this.err$ != null) this.err$.trace();
  }
}
class Func extends Obj {
  constructor(params, ret, func) {
    super();
  }
  static call(f, ...args) {
    if (f.__method) return f.__method.call(...args);
    return f(...args);
  }
  static callOn(f, obj, args) {
    if (f.__method) return f.__method.callOn(obj, args);
    throw UnsupportedErr.make();
  }
  static callList(f, args) {
    if (f.__method) return f.__method.callList(args);
    return f.apply(null, args);
  }
  static params(f) {
    if (f.__params) return f.__params;
    let mparams = f.__method.params();
    let fparams = mparams;
    if ((f.__method.flags$() & (FConst.Static | FConst.Ctor)) == 0) {
      const temp = [];
      temp[0] = new Param("this", f.__method.parent(), 0);
      fparams = List.make(Param.type$, temp.concat(mparams.__values()));
    }
    return fparams.ro();
  }
  static arity(f) { return this.params(f).size(); }
  static returns(f) { return f?.__returns ?? (f.__method?.returns() ?? Obj.type$); }
  static method(f) { return f.__method; }
  static toStr(f) { return "sys::Func"; }
  static __reflect(spec, f)
  {
    f.__returns = spec[0];
    f.__params = spec[1];
    return f;
  }
}
class Range extends Obj {
  constructor(start, end, exclusive) {
    super();
    this.#start = start;
    this.#end = end;
    this.#exclusive = (exclusive === undefined) ? false : exclusive;
  }
  #start;
  #end;
  #exclusive;
  static makeInclusive(start, end) { return new Range(start, end, false); }
  static makeExclusive(start, end) { return new Range(start, end, true); }
  static make(start, end, exclusive) { return new Range(start, end, exclusive); }
  static fromStr(s, checked=true) {
    try {
      const dot = s.indexOf('.');
      if (s.charAt(dot+1) != '.') throw new Error();
      const exclusive = s.charAt(dot+2) == '<';
      const start = Int.fromStr(s.substr(0, dot));
      const end   = Int.fromStr(s.substr(dot + (exclusive?3:2)));
      return new Range(start, end, exclusive);
    }
    catch (err) {
      if (!checked) return null;
      throw ParseErr.make("Range", s, null, err);
    }
  }
  start() { return this.#start; }
  end() { return this.#end; }
  inclusive() { return !this.#exclusive; }
  exclusive() { return this.#exclusive; }
  isEmpty() { return this.#exclusive && this.#start == this.#end; }
  min() {
    if (this.isEmpty()) return null;
    if (this.#end < this.#start) return this.#exclusive ? this.#end+1 : this.#end;
    return this.#start;
  }
  max() {
    if (this.isEmpty()) return null;
    if (this.#end < this.#start) return this.#start;
    return this.#exclusive ? this.#end-1 : this.#end;
  }
  first() {
    if (this.isEmpty()) return null;
    return this.#start;
  }
  last() {
    if (this.isEmpty()) return null;
    if (!this.#exclusive) return this.#end;
    if (this.#start < this.#end) return this.#end-1;
    return this.#end+1;
  }
  contains(i) {
    if (this.#start < this.#end) {
      if (this.#exclusive)
        return this.#start <= i && i < this.#end;
      else
        return this.#start <= i && i <= this.#end;
    }
    else {
      if (this.#exclusive)
        return this.#end < i && i <= this.#start;
      else
        return this.#end <= i && i <= this.#start;
    }
  }
  offset(offset) {
    if (offset == 0) return this;
    return Range.make(this.#start+offset, this.#end+offset, this.#exclusive);
  }
  each(func) {
    let start = this.#start;
    let end   = this.#end;
    if (start < end) {
      if (this.#exclusive) --end;
      for (let i=start; i<=end; ++i) func(i);
    }
    else {
      if (this.#exclusive) ++end;
      for (let i=start; i>=end; --i) func(i);
    }
  }
  eachWhile(func) {
    let start = this.#start;
    let end   = this.#end;
    let r = null
    if (start < end) {
      if (this.#exclusive) --end;
      for (let i=start; i<=end; ++i) {
        r = func(i);
        if (r != null) return r;
      }
    }
    else {
      if (this.#exclusive) ++end;
      for (let i=start; i>=end; --i) {
        r = func(i);
        if (r != null) return r;
      }
    }
    return null;
  }
  map(func) {
    let r = func.__returns;
    if (r == null || r == Void.type$) r = Obj.type$.toNullable();
    const acc = List.make(r);
    let start = this.#start;
    let end   = this.#end;
    if (start < end) {
      if (this.#exclusive) --end;
      for (let i=start; i<=end; ++i) acc.add(func(i));
    }
    else {
      if (this.#exclusive) ++end;
      for (let i=start; i>=end; --i) acc.add(func(i));
    }
    return acc;
  }
  toList() {
    let start = this.#start;
    let end = this.#end;
    const acc = List.make(Int.type$);
    if (start < end) {
      if (this.#exclusive) --end;
      for (let i=start; i<=end; ++i) acc.push(i);
    }
    else {
      if (this.#exclusive) ++end;
      for (let i=start; i>=end; --i) acc.push(i);
    }
    return acc;
  }
  random() { return Int.random(this); }
  equals(that) {
    if (that instanceof Range) {
      return this.#start == that.#start &&
            this.#end == that.#end &&
            this.#exclusive == that.#exclusive;
    }
    return false;
  }
  hash() { return (this.#start << 24) ^ this.#end; }
  toStr() {
    if (this.#exclusive)
      return this.#start + "..<" + this.#end;
    else
      return this.#start + ".." + this.#end;
  }
  __start(size) {
    if (size == null) return this.#start;
    let x = this.#start;
    if (x < 0) x = size + x;
    if (x > size) throw IndexErr.make(this);
    return x;
  }
  __end(size) {
    if (size == null) return this.#end;
    let x = this.#end;
    if (x < 0) x = size + x;
    if (this.#exclusive) x--;
    if (x >= size) throw IndexErr.make(this);
    return x;
  }
}
class Log extends Obj {
  constructor() { super(); }
  #name;
  #level;
  static #byName = new js.Map();
  static #handlers = [(rec) => { rec.print(); }]
  static list() {
    return List.make(Log.type$, Array.from(Log.#byName.values())).ro();
  }
  static find(name, checked=true) {
    const log = Log.#byName.get(name);
    if (log != null) return log;
    if (checked) throw Err.make("Unknown log: " + name);
    return null;
  }
  static get(name) {
    const log = Log.#byName.get(name);
    if (log != null) return log;
    return Log.make(name, true);
  }
  static make(name, register) {
    const self = new Log();
    Log.make$(self, name, register);
    return self;
  }
  static make$(self, name, register) {
    Uri.checkName(name);
    self.#name = name;
    self.#level = LogLevel.info();
    if (register) {
      if (Log.#byName.get(name) != null)
        throw ArgErr.make("Duplicate log name: " + name);
      Log.#byName.set(name, self);
    }
  }
  toStr() { return this.#name; }
  name() { return this.#name; }
  level(it=undefined) {
    if (it === undefined) return this.#level;
    if (it == null) throw ArgErr.make("level cannot be null");
    this.#level = it;
  }
  enabled(level) { return this.#level.ordinal() <= level.ordinal(); }
  isEnabled(level) { return this.enabled(level); }
  isErr()   { return this.isEnabled(LogLevel.err()); }
  isWarn()  { return this.isEnabled(LogLevel.warn()); }
  isInfo()  { return this.isEnabled(LogLevel.info()); }
  isDebug() { return this.isEnabled(LogLevel.debug()); }
  err(msg, err=null)
  {
    this.log(LogRec.make(DateTime.now(), LogLevel.err(), this.#name, msg, err));
  }
  warn(msg, err=null)
  {
    this.log(LogRec.make(DateTime.now(), LogLevel.warn(), this.#name, msg, err));
  }
  info(msg, err=null)
  {
    this.log(LogRec.make(DateTime.now(), LogLevel.info(), this.#name, msg, err));
  }
  debug(msg, err=null)
  {
    this.log(LogRec.make(DateTime.now(), LogLevel.debug(), this.#name, msg, err));
  }
  log(rec) {
    if (!this.enabled(rec.level())) return;
    for (let i=0; i<Log.#handlers.length; ++i) {
      try { Log.#handlers[i](rec); }
      catch (e) { Err.make(e).trace(); }
    }
  }
  static handlers() { return List.make(Func.type$, Log.#handlers).ro(); }
  static addHandler(func) {
    Log.#handlers.push(func);
  }
  static removeHandler(func) {
    let index = null;
    for (let i=0; i<Log.#handlers.length; i++)
      if (Log.#handlers[i] == func) { index=i; break }
    if (index == null) return;
    Log.#handlers.splice(index, 1);
  }
}
class Weekday extends Enum {
  constructor(ordinal, name) {
    super();
    Enum.make$(this, ordinal, name);
    this.#localeAbbrKey = name + "Abbr";
    this.#localeFullKey = name + "Full";
  }
  #localeAbbrKey;
  #localeFullKey;
  static sun() { return Weekday.vals().get(0); }
  static mon() { return Weekday.vals().get(1); }
  static tue() { return Weekday.vals().get(2); }
  static wed() { return Weekday.vals().get(3); }
  static thu() { return Weekday.vals().get(4); }
  static fri() { return Weekday.vals().get(5); }
  static sat() { return Weekday.vals().get(6); }
  static #vals = undefined;
  static vals() {
    if (Weekday.#vals === undefined) {
      Weekday.#vals = List.make(Weekday.type$,
        [new Weekday(0, "sun"), new Weekday(1, "mon"), new Weekday(2, "tue"),
         new Weekday(3, "wed"), new Weekday(4, "thu"), new Weekday(5, "fri"),
         new Weekday(6, "sat")]).toImmutable();
    }
    return Weekday.#vals;
  }
  static #localeVals = [];
  static fromStr(name, checked=true) {
    return Enum.doFromStr(Weekday.type$, Weekday.vals(), name, checked);
  }
  increment() { return Weekday.vals().get((this.ordinal()+1) % 7); }
  decrement() {
    const arr = Weekday.vals();
    return this.ordinal() == 0 ? arr.get(6) : arr.get(this.ordinal()-1);
  }
  toLocale(pattern=null, locale=Locale.cur()) {
    if (pattern == null) return this.__abbr(locale);
    if (Str.isEveryChar(pattern, 87))
    {
      switch (pattern.length) {
        case 3: return this.__abbr(locale);
        case 4: return this.__full(locale);
      }
    }
    throw ArgErr.make("Invalid pattern: " + pattern);
  }
  localeAbbr() { return this.__abbr(Locale.cur()); }
  __abbr(locale) {
    const pod = Pod.find("sys");
    return Env.cur().locale(pod, this.#localeAbbrKey, this.name(), locale);
  }
  localeFull() { return this.__full(Locale.cur()); }
  __full(locale) {
    const pod = Pod.find("sys");
    return Env.cur().locale(pod, this.#localeFullKey, this.name(), locale);
  }
  static localeStartOfWeek() {
    const locale = Locale.cur();
    const pod = Pod.find("sys");
    return Weekday.fromStr(Env.cur().locale(pod, "weekdayStart", "sun", locale));
  }
  static localeVals() {
    const start = Weekday.localeStartOfWeek();
    let list = Weekday.#localeVals[start.ordinal()];
    if (list == null) {
      list = List.make(Weekday.type$);
      for (let i=0; i<7; ++i)
        list.add(Weekday.vals().get((i + start.ordinal()) % 7));
      Weekday.#localeVals[start.ordinal()] = list.toImmutable();
    }
    return list;
  }
}
class Buf extends Obj {
  constructor() { super(); }
  static make(capacity=1024) {
    return MemBuf.makeCapacity(capacity);
  }
  static random(size) {
    const buf = new Uint8Array(size);
    for (let i=0; i<size;) {
      var x = Math.random() * 4294967296;
      buf[i++] = (0xff & (x >> 24));
      if (i < size) {
        buf[i++] = (0xff & (x >> 16));
        if (i < size) {
          buf[i++] = (0xff & (x >> 8));
          if (i < size) buf[i++] = (0xff & x);
        }
      }
    }
    return MemBuf.__makeBytes(buf);
  }
  size(it) { throw UnsupportedErr.make(); }
  pos(it) { throw UnsupportedErr.make(); }
  __setByte(pos, b) { throw UnsupportedErr.make(); }
  __getByte(pos) { throw UnsupportedErr.make(); }
  __getBytes(pos, len) { throw UnsupportedErr.make(); }
  __unsafeArray() { throw UnsupportedErr.make(); }
  equals(that) { return this == that; }
  bytesEqual(that) {
    if (this == that) return true;
    if (this.size() != that.size()) return false;
    for (let i=0; i<this.size(); ++i)
      if (this.__getByte(i) != that.__getByte(i))
        return false;
    return true;
  }
  toStr() {
    return `${this.typeof().name()} (pos=${this.pos()} size=${this.size()})`;
  }
  isEmpty() { return this.size() == 0; }
  capacity(it) {
    if (it === undefined) return Int.maxVal();
  }
  remaining() { return this.size()-this.pos(); }
  more() { return this.size()-this.pos() > 0; }
  seek(pos) {
    const size = this.size();
    if (pos < 0) pos = size + pos;
    if (pos < 0 || pos > size) throw IndexErr.make(pos);
    this.pos(pos);
    return this;
  }
  flip() {
    this.size(this.pos());
    this.pos(0);
    return this;
  }
  get(pos) {
    const size = this.size();
    if (pos < 0) pos = size + pos;
    if (pos < 0 || pos >= size) throw IndexErr.make(pos);
    return this.__getByte(pos);
  }
  getRange(range) {
    const size = this.size();
    const s = range.__start(size);
    const e = range.__end(size);
    const n = (e - s + 1);
    if (n < 0) throw IndexErr.make(range);
    const slice  = this.__getBytes(s, n);
    const result = new MemBuf(slice, n);
    result.charset(this.charset());
    return result;
  }
  dup() {
    const size   = this.size();
    const copy   = this.__getBytes(0, size);
    const result = new MemBuf(copy, size);
    result.charset(this.charset());
    return result;
  }
  set(pos, b) {
    const size = this.size();
    if (pos < 0) pos = size + pos;
    if (pos < 0 || pos >= size) throw IndexErr.make(pos);
    this.__setByte(pos, b);
    return this;
  }
  trim() { return this; }
  clear() {
    this.pos(0);
    this.size(0);
    return this;
  }
  flush() { return this; }
  close() { return true; }
  endian(it) {
    if (it === undefined) return this.out().endian();
    this.out().endian(it);
    this.in().endian(it);
  }
  charset(it) {
    if (it === undefined) return this.out().charset();
    this.out().charset(it);
    this.in().charset(it);
  }
  fill(b, times) {
    if (this.capacity() < this.size()+times) this.capacity(this.size()+times);
    for (let i=0; i<times; ++i) this.__out.write(b);
    return this;
  }
  out() { return this.__out; }
  write(b) { this.__out.write(b); return this; }
  writeBuf(other, n) { this.__out.writeBuf(other, n); return this; }
  writeI2(x) { this.__out.writeI2(x); return this; }
  writeI4(x) { this.__out.writeI4(x); return this; }
  writeI8(x) { this.__out.writeI8(x); return this; }
  writeF4(x) { this.__out.writeF4(x); return this; }
  writeF8(x) { this.__out.writeF8(x); return this; }
  writeDecimal(x) { this.__out.writeDecimal(x); return this; }
  writeBool(x) { this.__out.writeBool(x); return this; }
  writeUtf(x) { this.__out.writeUtf(x); return this; }
  writeChar(c) { this.__out.writeChar(c); return this; }
  writeChars(s, off=0, len=s.length-off) { this.__out.writeChars(s, off, len); return this; }
  print(obj) { this.__out.print(obj); return this; }
  printLine(obj="") { this.__out.printLine(obj); return this; }
  writeObj(obj, opt) { this.__out.writeObj(obj, opt); return this; }
  writeXml(s, flags) { this.__out.writeXml(s, flags); return this; }
  writeProps(props, close) { return this.__out.writeProps(props, close); }
  in() { return this.__in; }
  read() {  return this.__in.read(); }
  readBuf(other, n) { return this.__in.readBuf(other, n); }
  unread(n) { this.__in.unread(n); return this; }
  readBufFully(buf, n) { return this.__in.readBufFully(buf, n); }
  readAllBuf() { return this.__in.readAllBuf(); }
  peek() { return this.__in.peek(); }
  readU1() { return this.__in.readU1(); }
  readS1() { return this.__in.readS1(); }
  readU2() { return this.__in.readU2(); }
  readS2() { return this.__in.readS2(); }
  readU4() { return this.__in.readU4(); }
  readS4() { return this.__in.readS4(); }
  readS8() { return this.__in.readS8(); }
  readF4() { return this.__in.readF4(); }
  readF8() { return this.__in.readF8(); }
  readDecimal() { return this.__in.readDecimal(); }
  readBool() { return this.__in.readBool(); }
  readUtf() { return this.__in.readUtf(); }
  readChar() { return this.__in.readChar(); }
  unreadChar(c) { this.__in.unreadChar(c); return this; }
  peekChar() { return this.__in.peekChar(); }
  readChars(n) { return this.__in.readChars(n); }
  readLine(max=4096) { return this.__in.readLine(max); }
  readStrToken(max=null, f=null) { return this.__in.readStrToken(max, f); }
  readAllLines() { return this.__in.readAllLines(); }
  eachLine(f) { this.__in.eachLine(f); }
  readAllStr(normNewlines=true) { return this.__in.readAllStr(normNewlines); }
  readObj(opt=null) { return this.__in.readObj(opt); }
  readProps() { return this.__in.readProps(); }
  toFile(uri) { throw UnsupportedErr.make("Only supported on memory buffers"); }
  toHex() {
    const data = this.__unsafeArray();
    const size = this.size();
    const hexChars = Buf.#hexChars;
    let s = "";
    for (let i=0; i<size; ++i) {
      const b = data[i] & 0xFF;
      s += String.fromCharCode(hexChars[b>>4]) + String.fromCharCode(hexChars[b&0xf]);
    }
    return s;
  }
  static fromHex(s) {
    const slen = s.length;
    const buf = []
    const hexInv = Buf.#hexInv;
    let size = 0;
    for (let i=0; i<slen; ++i) {
      const c0 = s.charCodeAt(i);
      const n0 = c0 < 128 ? hexInv[c0] : -1;
      if (n0 < 0) continue;
      let n1 = -1;
      if (++i < slen) {
        const c1 = s.charCodeAt(i);
        n1 = c1 < 128 ? hexInv[c1] : -1;
      }
      if (n1 < 0) throw IOErr.make("Invalid hex str");
      buf[size++] = (n0 << 4) | n1;
    }
    return MemBuf.__makeBytes(buf);
  }
  static #hexChars = [
    48,49,50,51,52,53,54,55,56,57,97,98,99,100,101,102];
  static #hexInv = [];
  static {
    for (let i=0; i<128; ++i) Buf.#hexInv[i] = -1;
    for (let i=0; i<10; ++i)  Buf.#hexInv[48+i] = i;
    for (let i=10; i<16; ++i) Buf.#hexInv[97+i-10] = Buf.#hexInv[65+i-10] = i;
  }
  toBase64() {
    return this.#doBase64(Buf.#base64chars, true);
  }
  toBase64Uri() {
    return this.#doBase64(Buf.#base64UriChars, false);
  }
  #doBase64(table, pad) {
    const buf  = this.__unsafeArray();
    const size = this.size();
    let s = '';
    let i = 0;
    const end = size-2;
    for (; i<end; i += 3) {
      const n = ((buf[i] & 0xff) << 16) + ((buf[i+1] & 0xff) << 8) + (buf[i+2] & 0xff);
      s += String.fromCharCode(table[(n >>> 18) & 0x3f]);
      s += String.fromCharCode(table[(n >>> 12) & 0x3f]);
      s += String.fromCharCode(table[(n >>> 6) & 0x3f]);
      s += String.fromCharCode(table[n & 0x3f]);
    }
    const rem = size - i;
    if (rem > 0) {
      const n = ((buf[i] & 0xff) << 10) | (rem == 2 ? ((buf[size-1] & 0xff) << 2) : 0);
      s += String.fromCharCode(table[(n >>> 12) & 0x3f]);
      s += String.fromCharCode(table[(n >>> 6) & 0x3f]);
      s += rem == 2 ? String.fromCharCode(table[n & 0x3f]) : (pad ? '=' : "");
      if (pad) s += '=';
    }
    return s;
  }
  static fromBase64(s) {
    const slen = s.length;
    let si = 0;
    const max = slen * 6 / 8;
    const buf = [];
    let size = 0;
    while (si < slen) {
      let n = 0;
      let v = 0;
      for (let j=0; j<4 && si<slen;) {
        const ch = s.charCodeAt(si++);
        const c = ch < 128 ? Buf.#base64inv[ch] : -1;
        if (c >= 0) {
          n |= c << (18 - j++ * 6);
          if (ch != 61) v++;
        }
      }
      if (v > 1) buf.push(n >> 16);
      if (v > 2) buf.push(n >> 8);
      if (v > 3) buf.push(n);
    }
    return MemBuf.__makeBytes(buf);
  }
  static #base64chars = [
    65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,
    97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,
    48,49,50,51,52,53,54,55,56,57,43,47];
  static #base64UriChars = [
    65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,
    97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,
    48,49,50,51,52,53,54,55,56,57,45,95];
  static #base64inv = [];
  static {
    for (let i=0; i<128; ++i) Buf.#base64inv[i] = -1;
    for (let i=0; i<Buf.#base64chars.length; ++i)
      Buf.#base64inv[Buf.#base64chars[i]] = i;
    Buf.#base64inv[45] = 62;
    Buf.#base64inv[95] = 63;
    Buf.#base64inv[61] = 0;
  }
  toDigest(algorithm) {
    const buf = this.__unsafeArray().slice(0, this.size());
    let digest = null;
    switch (algorithm)
    {
      case "MD5":
        digest = buf_md5(buf); break;
      case "SHA1":
      case "SHA-1":
        digest = buf_sha1.digest(buf); break;
      case "SHA-256":
        digest = buf_sha256.digest(buf); break;
      default: throw ArgErr.make("Unknown digest algorithm " + algorithm);
    }
    return MemBuf.__makeBytes(digest);
  }
  hmac(algorithm, keyBuf) {
    const buf = this.__unsafeArray().slice(0, this.size());
    const key = keyBuf.__unsafeArray().slice(0, keyBuf.size());
    let digest = null;
    switch (algorithm)
    {
      case "MD5":
        digest = buf_md5(buf, key); break;
      case "SHA1":
      case "SHA-1":
        digest = buf_sha1.digest(buf, key); break;
      case "SHA-256":
        digest = buf_sha256.digest(buf, key); break;
      default: throw ArgErr.make("Unknown digest algorithm " + algorithm);
    }
    return MemBuf.__makeBytes(digest);
  }
  crc(algorithm) {
    if (algorithm == "CRC-16") return this.#crc16();
    if (algorithm == "CRC-32") return this.#crc32();
    if (algorithm == "CRC-32-Adler") return this.#crcAdler32();
    throw ArgErr.make(`Unknown CRC algorthm: ${algorithm}`);
  }
  #crc16() {
    const array = this.__unsafeArray();
    const size = this.size();
    let seed = 0xffff;
    for (let i=0; i<size; ++i) seed = this.#do_crc16(array[i], seed);
    return seed;
  }
  #do_crc16(dataToCrc, seed) {
    let dat = ((dataToCrc ^ (seed & 0xFF)) & 0xFF);
    seed = (seed & 0xFFFF) >>> 8;
    const index1 = (dat & 0x0F);
    const index2 = (dat >>> 4);
    if ((Buf.#CRC16_ODD_PARITY[index1] ^ Buf.#CRC16_ODD_PARITY[index2]) == 1)
      seed ^= 0xC001;
    dat  <<= 6;
    seed ^= dat;
    dat  <<= 1;
    seed ^= dat;
    return seed;
  }
  #crc32() {
    const array = this.__unsafeArray();
    let crc = -1;
    for (let i=0, iTop=array.length; i<iTop; i++) {
      crc = ( crc >>> 8 ) ^ Buf.#CRC32_b_table[(crc ^ array[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }
  #crcAdler32(seed) {
    const array = this.__unsafeArray();
    let a = 1, b = 0, L = array.length, M = 0;
    if (typeof seed === 'number') { a = seed & 0xFFFF; b = (seed >>> 16) & 0xFFFF; }
    for(let i=0; i<L;) {
      M = Math.min(L-i, 3850) + i;
      for(; i<M; i++) {
        a += array[i] & 0xFF;
        b += a;
      }
      a = (15 * (a >>> 16) + (a & 65535));
      b = (15 * (b >>> 16) + (b & 65535));
    }
    return ((b % 65521) << 16) | (a % 65521);
  }
  static #CRC16_ODD_PARITY = [ 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0 ];
  static #CRC32_a_table =
    "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 " +
    "0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 " +
    "1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 " +
    "136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 " +
    "3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B " +
    "35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 " +
    "26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F " +
    "2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D " +
    "76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 " +
    "7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 " +
    "6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 " +
    "65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 " +
    "4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB " +
    "4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 " +
    "5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F " +
    "5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD " +
    "EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 " +
    "E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 " +
    "F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 " +
    "FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 " +
    "D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B " +
    "D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 " +
    "CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F " +
    "C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D " +
    "9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 " +
    "95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 " +
    "86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 " +
    "88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 " +
    "A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB " +
    "AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 " +
    "BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF " +
    "B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D ";
  static #CRC32_b_table = Buf.#CRC32_a_table.split(' ').map((s) =>{ return parseInt(s,16) });
  static pbk(algorithm, password, salt, iterations, keyLen) {
    let digest = null;
    const passBuf = Str.toBuf(password);
    const passBytes = passBuf.__unsafeArray().slice(0, passBuf.size());
    const saltBytes = salt.__unsafeArray().slice(0, salt.size());
    switch(algorithm) {
      case "PBKDF2WithHmacSHA1":
        digest = buf_sha1.pbkdf2(passBytes, saltBytes, iterations, keyLen); break;
      case "PBKDF2WithHmacSHA256":
        digest = buf_sha256.pbkdf2(passBytes, saltBytes, iterations, keyLen); break;
      default: throw Err.make("Unsupported algorithm: " + algorithm);
    }
    return MemBuf.__makeBytes(digest);
  }
}
class MemBuf extends Buf {
  constructor(data=new Uint8Array(), size=0) {
    super();
    this.data   = data;
    this.__size = size;
    this.__pos  = 0;
    this.__out  = MemBufOutStream.make(this);
    this.__in   = MemBufInStream.make(this);
  }
  data;
  __size;
  __pos;
  __out;
  __in;
  static makeCapacity(capacity) {
    const buf = new MemBuf();
    buf.capacity(capacity);
    return buf;
  }
  static __makeBytes(bytes) {
    const buf = new MemBuf();
    if (bytes instanceof Array || bytes instanceof ArrayBuffer) buf.data = new Uint8Array(bytes);
    else if (bytes instanceof Uint8Array) buf.data = bytes;
    else throw ArgErr.make(`Unsupported type for bytes: ${typeof bytes}`);
    buf.__size = buf.data.length;
    return buf;
  }
  toImmutable() {
    const data  = this.data;
    const size  = this.__size;
    this.data   = new Uint8Array();
    this.__size = 0;
    return new ConstBuf(data, size, this.endian(), this.charset());
  }
  size(it) {
    if (it === undefined) return this.__size;
    if (it > this.data.length) {
      this.grow(it, true);
    }
    this.__size = it;
  }
  pos(it) {
    if (it === undefined) return this.__pos;
    this.__pos = it;
  }
  __getByte(pos) {
    return this.data[pos] & 0xFF;
  }
  __setByte(pos, x) {
    this.data[pos] = x & 0xFF;
  }
  __getBytes(pos, len) {
    return this.data.slice(pos, pos+len);
  }
  capacity(it) {
    if (it === undefined) return this.data.length;
    if (it < this.__size) throw ArgErr.make(`capacity < size`);
    if (it < this.data.length) {
      this.data = this.data.slice(0, it);
    } else {
      this.grow(it, true);
    }
    return this.data.length;
  }
  trim() {
    if (this.__size == this.data.length) return this;
    this.data = this.data.slice(0, this.__size);
    return this;
  }
  toFile(uri) { return MemFile.make(this.toImmutable(), uri); }
  grow(capacity, exact=false) {
    if (this.data.length >= capacity) return;
    const newSize = exact ? capacity : Math.max(capacity, this.__size*2);
    const temp = new Uint8Array(newSize);
    temp.set(this.data);
    this.data = temp;
  }
  __unsafeArray() { return this.data; }
  static __concat(a, b) {
    const c = new Uint8Array(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
  }
}
class ConstBuf extends Buf {
  constructor(data, size) {
    super();
    this.data     = data;
    this.__size   = size;
    this.__pos    = 0;
    this.__in     = ConstBuf.#errInStream();
    this.__out    = ConstBuf.#errOutStream();
  }
  static #_errInStream;
  static #errInStream() {
    if (!ConstBuf.#_errInStream) ConstBuf.#_errInStream = new ErrInStream();
    return ConstBuf.#_errInStream;
  }
  static #_errOutStream;
  static #errOutStream() {
    if (!ConstBuf.#_errOutStream) ConstBuf.#_errOutStream = new ErrOutStream();
    return ConstBuf.#_errOutStream;
  }
  data;
  __size;
  __pos;
  __in;
  __out;
  isImmutable() { return true; }
  toImmutable() { return this; }
  in() { return new ConstBufInStream(this); }
  toFile(uri) { return MemFile.make(this.toImmutable(), uri); }
  size(it) {
    if (it === undefined) return this.__size;
    throw this.err();
  }
  pos(it) {
    if (it === undefined) return 0;
    if (it != 0) throw this.err();
  }
  __getByte(pos) { return this.data[pos] & 0xFF; }
  __setByte(pos, x) { throw this.err() }
  __getBytes(pos, len) { return this.data.slice(pos, pos+len); }
  capacity(it) { throw this.err(); }
  sync() { throw this.err(); }
  trim() { throw this.err(); }
  endian(it) {
    if (it === undefined) return Endian.big();
    throw this.err();
  }
  charset(it) {
    if (it === undefined) return Charset.utf8();
    throw this.err();
  }
  __unsafeArray() { return this.data; }
  err() { return ReadonlyErr.make("Buf is immutable"); }
}
class Charset extends Obj {
  constructor(name, encoder) {
    super();
    this.#name = name;
    this.#encoder = encoder;
  }
  #name;
  #encoder;
  __encoder() { return this.#encoder; }
  static #defVal;
  static defVal() {
    if (!Charset.#defVal) Charset.#defVal = Charset.#utf8;
    return Charset.#defVal;
  }
  static #utf16BE;
  static utf16BE() {
    if (!Charset.#utf16BE) {
      Charset.#utf16BE = new Charset("UTF-16BE", new Utf16BEEncoder());
    }
    return Charset.#utf16BE;
  }
  static #utf16LE;
  static utf16LE() {
    if (!Charset.#utf16LE) {
      Charset.#utf16LE = new Charset("UTF-16LE", new Utf16LEEncoder());
    }
    return Charset.#utf16LE;
  }
  static #utf8;
  static utf8() {
    if (!Charset.#utf8) {
      Charset.#utf8 = new Charset("UTF-8", new Utf8Encoder());
    }
    return Charset.#utf8;
  }
  static #iso8859_1;
  static iso8859_1() {
    if (!Charset.#iso8859_1) {
      Charset.#iso8859_1 = new Charset("ISO-8859-1", new Iso8859_1Encoder());
    }
    return Charset.#iso8859_1;
  }
  static #iso8859_2;
  static iso8859_2() {
    if (!Charset.#iso8859_2) {
      const enc = new Iso8859_XEncoder(Charset.#iso2_u2i, Charset.#iso2_i2u);
      Charset.#iso8859_2 = new Charset("ISO-8859-2", enc);
    }
    return Charset.#iso8859_2;
  }
  static #iso8859_5;
  static iso8859_5() {
    if (!Charset.#iso8859_5) {
      const enc = new Iso8859_XEncoder(Charset.#iso5_u2i, Charset.#iso5_i2u);
      Charset.#iso8859_5 = new Charset("ISO-8859-5", enc);
    }
    return Charset.#iso8859_5;
  }
  static #iso8859_8;
  static iso8859_8() {
    if (!Charset.#iso8859_8) {
      const enc = new Iso8859_XEncoder(Charset.#iso8_u2i, Charset.#iso8_i2u);
      Charset.#iso8859_8 = new Charset("ISO-8859-8", enc);
    }
    return Charset.#iso8859_8;
  }
  static fromStr(name, checked=true) {
    const nname = name.toUpperCase();
    try
    {
      switch(nname) {
        case "UTF-8":      return Charset.utf8();
        case "UTF-16BE":   return Charset.utf16BE();
        case "UTF-16LE":   return Charset.utf16LE();
        case "ISO-8859-1": return Charset.iso8859_1();
        case "ISO-8859-2": return Charset.iso8859_2();
        case "ISO-8859-5": return Charset.iso8859_5();
        case "ISO-8859-8": return Charset.iso8859_8();
        default: throw UnsupportedErr.make(`${nname}`);
      }
    }
    catch (err) {
      if (!checked) return null;
      throw ParseErr.make(`Unsupported charset '${nname}'`);
    }
  }
  name() { return this.#name; }
  hash() { return Str.hash(this.#name); }
  equals(that) {
    if (that instanceof Charset) {
      return this.#name == that.#name;
    }
    return false;
  }
  toStr() { return this.name(); }
  static #iso2_i2u(c) {
    switch(c) {
      case 0xA1: return 0x0104; case 0xA2: return 0x02D8; case 0xA3: return 0x0141;
      case 0xA5: return 0x013D; case 0xA6: return 0x015A; case 0xA9: return 0x0160;
      case 0xAA: return 0x015E; case 0xAB: return 0x0164; case 0xAC: return 0x0179;
      case 0xAE: return 0x017D; case 0xAF: return 0x017B; case 0xB1: return 0x0105;
      case 0xB2: return 0x02DB; case 0xB3: return 0x0142; case 0xB5: return 0x013E;
      case 0xB6: return 0x015B; case 0xB7: return 0x02C7; case 0xB9: return 0x0161;
      case 0xBA: return 0x015F; case 0xBB: return 0x0165; case 0xBC: return 0x017A;
      case 0xBD: return 0x02DD; case 0xBE: return 0x017E; case 0xBF: return 0x017C;
      case 0xC0: return 0x0154; case 0xC3: return 0x0102; case 0xC5: return 0x0139;
      case 0xC6: return 0x0106; case 0xC8: return 0x010C; case 0xCA: return 0x0118;
      case 0xCC: return 0x011A; case 0xCF: return 0x010E; case 0xD0: return 0x0110;
      case 0xD1: return 0x0143; case 0xD2: return 0x0147; case 0xD5: return 0x0150;
      case 0xD8: return 0x0158; case 0xD9: return 0x016E; case 0xDB: return 0x0170;
      case 0xDE: return 0x0162; case 0xDF: return 0x00DF; case 0xE0: return 0x0155;
      case 0xE3: return 0x0103; case 0xE5: return 0x013A; case 0xE6: return 0x0107;
      case 0xE8: return 0x010D; case 0xEA: return 0x0119; case 0xEC: return 0x011B;
      case 0xEF: return 0x010F; case 0xF0: return 0x0111; case 0xF1: return 0x0144;
      case 0xF2: return 0x0148; case 0xF5: return 0x0151; case 0xF8: return 0x0159;
      case 0xF9: return 0x016F; case 0xFB: return 0x0171; case 0xFE: return 0x0163;
      case 0xFF: return 0x02D9;
      default: return c;
    }
  }
  static #iso2_u2i(c) {
    switch(c) {
      case 0x0104: return 0xA1; case 0x02D8: return 0xA2; case 0x0141: return 0xA3;
      case 0x013D: return 0xA5; case 0x015A: return 0xA6; case 0x0160: return 0xA9;
      case 0x015E: return 0xAA; case 0x0164: return 0xAB; case 0x0179: return 0xAC;
      case 0x017D: return 0xAE; case 0x017B: return 0xAF; case 0x0105: return 0xB1;
      case 0x02DB: return 0xB2; case 0x0142: return 0xB3; case 0x013E: return 0xB5;
      case 0x015B: return 0xB6; case 0x02C7: return 0xB7; case 0x0161: return 0xB9;
      case 0x015F: return 0xBA; case 0x0165: return 0xBB; case 0x017A: return 0xBC;
      case 0x02DD: return 0xBD; case 0x017E: return 0xBE; case 0x017C: return 0xBF;
      case 0x0154: return 0xC0; case 0x0102: return 0xC3; case 0x0139: return 0xC5;
      case 0x0106: return 0xC6; case 0x010C: return 0xC8; case 0x0118: return 0xCA;
      case 0x011A: return 0xCC; case 0x010E: return 0xCF; case 0x0110: return 0xD0;
      case 0x0143: return 0xD1; case 0x0147: return 0xD2; case 0x0150: return 0xD5;
      case 0x0158: return 0xD8; case 0x016E: return 0xD9; case 0x0170: return 0xDB;
      case 0x0162: return 0xDE; case 0x00DF: return 0xDF; case 0x0155: return 0xE0;
      case 0x0103: return 0xE3; case 0x013A: return 0xE5; case 0x0107: return 0xE6;
      case 0x010D: return 0xE8; case 0x0119: return 0xEA; case 0x011B: return 0xEC;
      case 0x010F: return 0xEF; case 0x0111: return 0xF0; case 0x0144: return 0xF1;
      case 0x0148: return 0xF2; case 0x0151: return 0xF5; case 0x0159: return 0xF8;
      case 0x016F: return 0xF9; case 0x0171: return 0xFB; case 0x0163: return 0xFE;
      case 0x02D9: return 0xFF;
      default: return (c >>> 0) & 0xFF;
    }
  }
  static #iso5_i2u(c) {
    switch(c) {
      case 0xA1: return 0x0401; case 0xA2: return 0x0402; case 0xA3: return 0x0403;
      case 0xA4: return 0x0404; case 0xA5: return 0x0405; case 0xA6: return 0x0406;
      case 0xA7: return 0x0407; case 0xA8: return 0x0408; case 0xA9: return 0x0409;
      case 0xAA: return 0x040A; case 0xAB: return 0x040B; case 0xAC: return 0x040C;
      case 0xAE: return 0x040E; case 0xAF: return 0x040F; case 0xB0: return 0x0410;
      case 0xB1: return 0x0411; case 0xB2: return 0x0412; case 0xB3: return 0x0413;
      case 0xB4: return 0x0414; case 0xB5: return 0x0415; case 0xB6: return 0x0416;
      case 0xB7: return 0x0417; case 0xB8: return 0x0418; case 0xB9: return 0x0419;
      case 0xBA: return 0x041A; case 0xBB: return 0x041B; case 0xBC: return 0x041C;
      case 0xBD: return 0x041D; case 0xBE: return 0x041E; case 0xBF: return 0x041F;
      case 0xC0: return 0x0420; case 0xC1: return 0x0421; case 0xC2: return 0x0422;
      case 0xC3: return 0x0423; case 0xC4: return 0x0424; case 0xC5: return 0x0425;
      case 0xC6: return 0x0426; case 0xC7: return 0x0427; case 0xC8: return 0x0428;
      case 0xC9: return 0x0429; case 0xCA: return 0x042A; case 0xCB: return 0x042B;
      case 0xCC: return 0x042C; case 0xCD: return 0x042D; case 0xCE: return 0x042E;
      case 0xCF: return 0x042F; case 0xD0: return 0x0430; case 0xD1: return 0x0431;
      case 0xD2: return 0x0432; case 0xD3: return 0x0433; case 0xD4: return 0x0434;
      case 0xD5: return 0x0435; case 0xD6: return 0x0436; case 0xD7: return 0x0437;
      case 0xD8: return 0x0438; case 0xD9: return 0x0439; case 0xDA: return 0x043A;
      case 0xDB: return 0x043B; case 0xDC: return 0x043C; case 0xDD: return 0x043D;
      case 0xDE: return 0x043E; case 0xDF: return 0x043F; case 0xE0: return 0x0440;
      case 0xE1: return 0x0441; case 0xE2: return 0x0442; case 0xE3: return 0x0443;
      case 0xE4: return 0x0444; case 0xE5: return 0x0445; case 0xE6: return 0x0446;
      case 0xE7: return 0x0447; case 0xE8: return 0x0448; case 0xE9: return 0x0449;
      case 0xEA: return 0x044A; case 0xEB: return 0x044B; case 0xEC: return 0x044C;
      case 0xED: return 0x044D; case 0xEE: return 0x044E; case 0xEF: return 0x044F;
      case 0xF0: return 0x2116; case 0xF1: return 0x0451; case 0xF2: return 0x0452;
      case 0xF3: return 0x0453; case 0xF4: return 0x0454; case 0xF5: return 0x0455;
      case 0xF6: return 0x0456; case 0xF7: return 0x0457; case 0xF8: return 0x0458;
      case 0xF9: return 0x0459; case 0xFA: return 0x045A; case 0xFB: return 0x045B;
      case 0xFC: return 0x045C; case 0xFD: return 0x00A7; case 0xFE: return 0x045E;
      case 0xFF: return 0x045F;
      default: return c;
    }
  }
  static #iso5_u2i(c) {
    switch(c) {
      case 0x0401: return 0xA1; case 0x0402: return 0xA2; case 0x0403: return 0xA3;
      case 0x0404: return 0xA4; case 0x0405: return 0xA5; case 0x0406: return 0xA6;
      case 0x0407: return 0xA7; case 0x0408: return 0xA8; case 0x0409: return 0xA9;
      case 0x040A: return 0xAA; case 0x040B: return 0xAB; case 0x040C: return 0xAC;
      case 0x040E: return 0xAE; case 0x040F: return 0xAF; case 0x0410: return 0xB0;
      case 0x0411: return 0xB1; case 0x0412: return 0xB2; case 0x0413: return 0xB3;
      case 0x0414: return 0xB4; case 0x0415: return 0xB5; case 0x0416: return 0xB6;
      case 0x0417: return 0xB7; case 0x0418: return 0xB8; case 0x0419: return 0xB9;
      case 0x041A: return 0xBA; case 0x041B: return 0xBB; case 0x041C: return 0xBC;
      case 0x041D: return 0xBD; case 0x041E: return 0xBE; case 0x041F: return 0xBF;
      case 0x0420: return 0xC0; case 0x0421: return 0xC1; case 0x0422: return 0xC2;
      case 0x0423: return 0xC3; case 0x0424: return 0xC4; case 0x0425: return 0xC5;
      case 0x0426: return 0xC6; case 0x0427: return 0xC7; case 0x0428: return 0xC8;
      case 0x0429: return 0xC9; case 0x042A: return 0xCA; case 0x042B: return 0xCB;
      case 0x042C: return 0xCC; case 0x042D: return 0xCD; case 0x042E: return 0xCE;
      case 0x042F: return 0xCF; case 0x0430: return 0xD0; case 0x0431: return 0xD1;
      case 0x0432: return 0xD2; case 0x0433: return 0xD3; case 0x0434: return 0xD4;
      case 0x0435: return 0xD5; case 0x0436: return 0xD6; case 0x0437: return 0xD7;
      case 0x0438: return 0xD8; case 0x0439: return 0xD9; case 0x043A: return 0xDA;
      case 0x043B: return 0xDB; case 0x043C: return 0xDC; case 0x043D: return 0xDD;
      case 0x043E: return 0xDE; case 0x043F: return 0xDF; case 0x0440: return 0xE0;
      case 0x0441: return 0xE1; case 0x0442: return 0xE2; case 0x0443: return 0xE3;
      case 0x0444: return 0xE4; case 0x0445: return 0xE5; case 0x0446: return 0xE6;
      case 0x0447: return 0xE7; case 0x0448: return 0xE8; case 0x0449: return 0xE9;
      case 0x044A: return 0xEA; case 0x044B: return 0xEB; case 0x044C: return 0xEC;
      case 0x044D: return 0xED; case 0x044E: return 0xEE; case 0x044F: return 0xEF;
      case 0x2116: return 0xF0; case 0x0451: return 0xF1; case 0x0452: return 0xF2;
      case 0x0453: return 0xF3; case 0x0454: return 0xF4; case 0x0455: return 0xF5;
      case 0x0456: return 0xF6; case 0x0457: return 0xF7; case 0x0458: return 0xF8;
      case 0x0459: return 0xF9; case 0x045A: return 0xFA; case 0x045B: return 0xFB;
      case 0x045C: return 0xFC; case 0x00A7: return 0xFD; case 0x045E: return 0xFE;
      case 0x045F: return 0xFF;
      default: return (c >>> 0) & 0xFF;
    }
  }
  static #iso8_i2u(c) {
      switch(c) {
        case 0xAA: return 0x00D7; case 0xBA: return 0x00F7; case 0xDF: return 0x2017;
        case 0xE0: return 0x05D0; case 0xE1: return 0x05D1; case 0xE2: return 0x05D2;
        case 0xE3: return 0x05D3; case 0xE4: return 0x05D4; case 0xE5: return 0x05D5;
        case 0xE6: return 0x05D6; case 0xE7: return 0x05D7; case 0xE8: return 0x05D8;
        case 0xE9: return 0x05D9; case 0xEA: return 0x05DA; case 0xEB: return 0x05DB;
        case 0xEC: return 0x05DC; case 0xED: return 0x05DD; case 0xEE: return 0x05DE;
        case 0xEF: return 0x05DF; case 0xF0: return 0x05E0; case 0xF1: return 0x05E1;
        case 0xF2: return 0x05E2; case 0xF3: return 0x05E3; case 0xF4: return 0x05E4;
        case 0xF5: return 0x05E5; case 0xF6: return 0x05E6; case 0xF7: return 0x05E7;
        case 0xF8: return 0x05E8; case 0xF9: return 0x05E9; case 0xFA: return 0x05EA;
        case 0xFD: return 0x200E; case 0xFE: return 0x200F;
        default: return c;
      }
    }
    static #iso8_u2i(c) {
      switch(c) {
        case 0x00D7: return 0xAA; case 0x00F7: return 0xBA; case 0x2017: return 0xDF;
        case 0x05D0: return 0xE0; case 0x05D1: return 0xE1; case 0x05D2: return 0xE2;
        case 0x05D3: return 0xE3; case 0x05D4: return 0xE4; case 0x05D5: return 0xE5;
        case 0x05D6: return 0xE6; case 0x05D7: return 0xE7; case 0x05D8: return 0xE8;
        case 0x05D9: return 0xE9; case 0x05DA: return 0xEA; case 0x05DB: return 0xEB;
        case 0x05DC: return 0xEC; case 0x05DD: return 0xED; case 0x05DE: return 0xEE;
        case 0x05DF: return 0xEF; case 0x05E0: return 0xF0; case 0x05E1: return 0xF1;
        case 0x05E2: return 0xF2; case 0x05E3: return 0xF3; case 0x05E4: return 0xF4;
        case 0x05E5: return 0xF5; case 0x05E6: return 0xF6; case 0x05E7: return 0xF7;
        case 0x05E8: return 0xF8; case 0x05E9: return 0xF9; case 0x05EA: return 0xFA;
        case 0x200E: return 0xFD; case 0x200F: return 0xFE;
        default: return (c >>> 0) & 0xFF;
      }
    }
}
class CharsetEncoder extends Obj {
  constructor() { super(); }
  encodeOut(c, outStream) { throw UnsupportedErr.make(); }
  encodeIn(c, inStream) { throw UnsupportedErr.make(); }
  decode(inStream) { throw UnsupportedErr.make(); }
}
class Utf8Encoder extends CharsetEncoder {
  constructor() { super(); }
  encodeOut(c, outStream) {
    if (c <= 0x007F) {
      outStream.write(c);
    }
    else if (c > 0x07FF) {
      outStream.write(0xE0 | ((c >>> 12) & 0x0F))
        .write(0x80 | ((c >>>  6) & 0x3F))
        .write(0x80 | ((c >>>  0) & 0x3F));
    }
    else {
      outStream.write(0xC0 | ((c >>>  6) & 0x1F))
               .write(0x80 | ((c >>>  0) & 0x3F));
    }
  }
  encodeIn(c, inStream) {
    if (c <= 0x007F) {
      inStream.unread(c);
    }
    else if (c > 0x07FF) {
      inStream.unread(0x80 | ((c >>  0) & 0x3F))
        .unread(0x80 | ((c >>  6) & 0x3F))
        .unread(0xE0 | ((c >> 12) & 0x0F));
    }
    else {
      inStream.unread(0x80 | ((c >>  0) & 0x3F))
              .unread(0xC0 | ((c >>  6) & 0x1F));
    }
  }
  decode(inStream) {
    const c = inStream.read();
    if (c == null) return -1;
    let c2, c3, c4;
    switch (c >>> 4) {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        return c;
      case 12: case 13:
        c2 = inStream.read();
        if ((c2 & 0xC0) != 0x80)
          throw IOErr.make("Invalid UTF-8 encoding");
        return ((c & 0x1F) << 6) | (c2 & 0x3F);
      case 14:
        c2 = inStream.read();
        c3 = inStream.read();
        if (((c2 & 0xC0) != 0x80) || ((c3 & 0xC0) != 0x80))
          throw IOErr.make("Invalid UTF-8 encoding");
        return (((c & 0x0F) << 12) | ((c2 & 0x3F) << 6) | ((c3 & 0x3F) << 0));
      case 15:
        c2 = inStream.read();
        c3 = inStream.read();
        c4 = inStream.read();
        if (((c2 & 0xC0) != 0x80) || ((c3 & 0xC0) != 0x80) || ((c4 & 0xC0) != 0x80))
          throw IOErr.make("Invalid UTF-8 encoding");
        return 0xFFFD;
    default:
        throw IOErr.make("Invalid UTF-8 encoding");
    }
  }
}
class Utf16BEEncoder extends CharsetEncoder {
  constructor() { super(); }
  encodeOut(c, outStream) { outStream.write((c >>> 8) & 0xFF).write((c >>> 0) & 0xFF); }
  encodeIn(c, inStream) { inStream.unread((c >>> 0) & 0xFF).unread((c >>> 8) & 0xFF); }
  decode(inStream) {
    const c1 = inStream.read();
    const c2 = inStream.read();
    if (c1 == null || c2 == null) return -1;
    return ((c1 << 8) | c2);
  }
}
class Utf16LEEncoder extends CharsetEncoder {
  constructor() { super(); }
  encodeOut(c, outStream) { outStream.write((c >>> 0) & 0xFF).write((c >>> 8) & 0xFF); }
  encodeIn(c, inStream) { inStream.unread((c >>> 8) & 0xFF).unread((c >>> 0) & 0xFF); }
  decode(inStream) {
    const c1 = inStream.read();
    const c2 = inStream.read();
    if (c1 == null || c2 == null) return -1;
    return (c1 | (c2 << 8));
  }
}
class Iso8859_1Encoder extends CharsetEncoder {
  constructor() { super(); }
  encodeOut(c, outStream) {
    if (c > 0xFF) throw IOErr.make("Invalid ISO-8859-1 char");
    outStream.write((c >>> 0) & 0xFF);
  }
  encodeIn(c, inStream) {
    inStream.unread((c >>> 0) & 0xFF);
  }
  decode(inStream) {
    const c = inStream.read();
    if (c == null) return -1;
    return (c & 0xFF);
  }
}
class Iso8859_XEncoder extends CharsetEncoder {
  constructor(u2i, i2u) {
    super();
    this.#u2i = u2i;
    this.#i2u = i2u;
  }
  #u2i;
  #i2u;
  encodeOut(c, outStream) {
    c = this.#u2i(c);
    if (c > 0xFF) throw IOErr.make("Invalid ISO-8859 char");
    outStream.write(c);
  }
  encodeIn(c, inStream) { inStream.unread(c); }
  decode(inStream) {
    const c = inStream.read();
    if (c == null) return -1;
    return this.#i2u(c);
  }
}
class Zip extends Obj {
  constructor()
  {
    super();
    if (!Env.__isNode())
      throw UnsupportedErr.make("Zip is only available in a node environment.")
  }
  #yauzlZip;
  #yazlZip;
  #file;
  #in;
  #out;
  static open(file)
  {
    if (!file.exists() || file.osPath() === null)
      throw IOErr.make("File must exist on the local filesystem");
    if (file.isDir())
      throw IOErr.make("Cannot unzip a directory");
    const zip = new Zip();
    zip.#file = file;
    zip.#yauzlZip = yauzl.open(file.osPath());
    return zip;
  }
  static read(in$)
  {
    const zip = new Zip();
    zip.#in = in$;
    zip.#yauzlZip = yauzl.fromStream(in$);
    return zip;
  }
  static write(out)
  {
    const zip = new Zip();
    zip.#out = out;
    zip.#yazlZip = new YazlZipFile(out);
    return zip;
  }
  file()
  {
    return this.#file || null;
  }
  #contents;
  contents()
  {
    if (!this.#file) return null;
    if (this.#contents) return this.#contents;
    const map = Map.make(Uri.type$, File.type$);
    let entry;
    while (!!(entry = this.#yauzlZip.getEntry())) {
      map.add(Uri.fromStr("/" + entry.fileName), ZipEntryFile.makeFromFile(entry, this.#yauzlZip, this));
    }
    this.#contents = map.ro();
    return this.#contents;
  }
  #lastFile;
  readNext()
  {
    if (!this.#in)
      throw UnsupportedErr.make("Not reading from an input stream");
    if (this.#lastFile) {
      this.#lastFile.__in().skip(this.#lastFile.__in().remaining(), true);
      this.#lastFile.__in().close();
    }
    const entry = this.#yauzlZip.getEntryFromStream();
    if (!entry) return null;
    return (this.#lastFile = ZipEntryFile.makeFromStream(entry, this.#yauzlZip));
  }
  readEach(c)
  {
    if (!this.#in)
      throw UnsupportedErr.make("Not reading from an input stream");
    for(let f = this.readNext(); f != null; f = this.readNext())
      c(f);
  }
  writeNext(path, modifyTime=DateTime.now(), opts=null)
  {
    if (!this.#out)
      throw UnsupportedErr.make("Not writing to an output stream");
    if (path.frag() != null)
      throw ArgErr.make("Path must not contain fragment: " + path);
    if (path.queryStr() != null)
      throw ArgErr.make("Path must not contain query: " + path);
    if (this.#finished)
      throw IOErr.make("Already finished writing the zip contents");
    let pathStr = path.toStr();
    if (pathStr.startsWith("/")) pathStr = pathStr.slice(1);
    return this.#yazlZip.addEntryAt(pathStr, {
      mtime: modifyTime.toJs(),
      compressed: opts ? (opts.get("level") || 0) > 0 : null,
      level: opts ? opts.get("level") : null,
      crc32: opts ? opts.get("crc") : null,
      compressedSize: opts ? opts.get("compressedSize") : null,
      uncompressedSize: opts ? opts.get("uncompressedSize") : null,
      fileComment: opts ? opts.get("comment") : null,
      extra: opts ? opts.get("extra") : null,
    });
  }
  #finished;
  finish()
  {
    if (!this.#out)
      throw UnsupportedErr.make("Not writing to an output stream");
    if (this.#finished)
      return false;
    try {
      this.#yazlZip.end();
      return true;
    } catch (_) {
      return false;
    }
  }
  close() {
    try {
      if (this.#yauzlZip) {
        this.#yauzlZip.close();
      }
      if (this.#in) {
        this.#in.close();
      }
      if (this.#out) {
        if (!this.#finished)
          this.finish();
        this.#out.close();
      }
      return true;
    } catch (_) {
      return false;
    }
  }
  static unzipInto(zipFile, dir) {
    if (!dir.isDir()) throw ArgErr.make("Not dir: " + dir);
    let zip;
    try
    {
      let count = 0;
      function processEntry(entry) {
        const relUri = entry.uri().toStr().substring(1);
        const dest = dir.plus(Uri.fromStr(relUri));
        dest.create();
        if (entry.isDir()) { return; }
        const out = dest.out();
        try {
          entry.in().pipe(out);
        }
        finally {
          out.close();
        }
        if (entry.modified() != null) dest.modified(entry.modified());
        count++;
      }
      if (zipFile.osPath() != null) {
        zip = Zip.open(zipFile);
        const contents = zip.contents();
        contents.each(processEntry);
      }
      else {
        zip = Zip.read(zipFile.in());
        let entry;
        while ((entry = zip.readNext()) != null)
          processEntry(entry);
      }
      return count;
    }
    finally
    {
      if (zip) zip.close();
    }
  }
  static gzipOutStream(out) {
    return DeflateOutStream.makeGzip(out);
  }
  static gzipInStream(in$) {
    return InflateInStream.makeGunzip(in$);
  }
  static deflateOutStream(out, opts=null) {
    return DeflateOutStream.makeDeflate(out, opts);
  }
  static deflateInStream(in$, opts=null) {
    return InflateInStream.makeInflate(in$, opts);
  }
  toStr()
  {
    if (this.#file) return this.#file.toStr();
    return super.toStr();
  }
}
class Depend extends Obj {
  constructor(name, constraints) {
    super();
    this.#name = name;
    this.#constraints = constraints;
    this.#str = null;
  }
  #name;
  #constraints;
  #str;
  static fromStr(str, checked=true) {
    try {
      return new DependParser(str).parse();
    }
    catch (err) {
      if (!checked) return null;
      throw ParseErr.makeStr("Depend", str);
    }
  }
  equals(obj) {
    if (obj instanceof Depend)
      return this.toStr() == obj.toStr();
    else
      return false;
  }
  hash() {
    return Str.hash(this.toStr());
  }
  toStr() {
    if (this.#str == null) {
      let s = "";
      s += this.#name + " ";
      for (let i=0; i<this.#constraints.length; ++i) {
        if (i > 0) s += ",";
        var c = this.#constraints[i];
        s += c.version;
        if (c.isPlus) s += "+";
        if (c.endVersion != null) s += "-" + c.endVersion;
      }
      this.#str = s.toString();
    }
    return this.#str;
  }
  name() { return this.#name; }
  size() { return this.#constraints.length; }
  version(index=0) { return this.#constraints[index].version; }
  isSimple(index=0) { return !this.isPlus(index) && !this.isRange(index); }
  isPlus(index=0) { return this.#constraints[index].isPlus; }
  isRange(index=0) { return this.#constraints[index].endVersion != null; }
  endVersion(index=0) { return this.#constraints[index].endVersion; }
  match(v) {
    for (let i=0; i<this.#constraints.length; ++i) {
      const c = this.#constraints[i];
      if (c.isPlus) {
        if (c.version.compare(v) <= 0)
          return true;
      }
      else if (c.endVersion != null) {
        if (c.version.compare(v) <= 0 &&
            (c.endVersion.compare(v) >= 0 || Depend.#doMatch(c.endVersion, v)))
          return true;
      }
      else
      {
        if (Depend.#doMatch(c.version, v))
          return true;
      }
    }
    return false;
  }
  static #doMatch(a, b) {
    if (a.segments().size() > b.segments().size()) return false;
    for (let i=0; i<a.segments().size(); ++i)
      if (a.segment(i) != b.segment(i))
        return false;
    return true;
  }
}
class DependConstraint {
  constructor() {
    this.version = null;
    this.isPlus = false;
    this.endVersion = null;
  }
  version;
  isPlus;
  endVersion;
}
class DependParser {
  constructor(str) {
    this.str = str;
    this.cur = 0;
    this.pos = 0;
    this.len = str.length;
    this.constraints = [];
    this.consume();
  }
  str;
  cur;
  pos;
  len;
  constraints;
  parse() {
    const name = this.#name();
    this.constraints.push(this.constraint());
    while (this.cur == 44) {
      this.consume();
      this.consumeSpaces();
      this.constraints.push(this.constraint());
    }
    if (this.pos <= this.len) throw new Error();
    return new Depend(name, this.constraints);
  }
  #name() {
    let s = ""
    while (this.cur != 32 && this.cur != 9) {
      if (this.cur < 0) throw new Error();
      s += String.fromCharCode(this.cur);
      this.consume();
    }
    this.consumeSpaces();
    if (s.length == 0) throw new Error();
    return s;
  }
  constraint() {
    let c = new DependConstraint();
    c.version = this.version();
    this.consumeSpaces();
    if (this.cur == 43) {
      c.isPlus = true;
      this.consume();
      this.consumeSpaces();
    }
    else if (this.cur == 45) {
      this.consume();
      this.consumeSpaces();
      c.endVersion = this.version();
      this.consumeSpaces();
    }
    return c;
  }
  version() {
    const segs = List.make(Int.type$);
    let seg = this.consumeDigit();
    while (true) {
      if (48 <= this.cur && this.cur <= 57) {
        seg = seg*10 + this.consumeDigit();
      }
      else {
        segs.add(seg);
        seg = 0;
        if (this.cur != 46) break;
        else this.consume();
      }
    }
    return Version.make(segs);
  }
  consumeDigit() {
    if (48 <= this.cur && this.cur <= 57) {
      const digit = this.cur - 48;
      this.consume();
      return digit;
    }
    throw new Error();
  }
  consumeSpaces() {
    while (this.cur == 32 || this.cur == 9) this.consume();
  }
  consume() {
    if (this.pos < this.len) {
      this.cur = this.str.charCodeAt(this.pos++);
    }
    else {
      this.cur = -1;
      this.pos = this.len+1;
    }
  }
}
class Str extends Obj {
  constructor() { super(); }
  static defVal() { return ""; }
  static #spaces = null;
  static equalsIgnoreCase(self, that) { return self.toLowerCase() == that.toLowerCase(); }
  static compareIgnoreCase(self, that) {
    const a = self.toLowerCase();
    const b = that.toLowerCase();
    if (a < b) return -1;
    if (a == b) return 0;
    return 1;
  }
  static toStr(self) { return self; }
  static toLocale(self) { return self; }
  static hash(self) {
    let hash = 0;
    if (self.length == 0) return hash;
    for (let i=0; i<self.length; i++) {
      var ch = self.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash = hash & hash;
    }
    return hash;
  }
  static get(self, index) {
    if (index < 0) index += self.length;
    if (index < 0 || index >= self.length) throw IndexErr.make(index);
    return self.charCodeAt(index);
  }
  static getSafe(self, index, def=0) {
    try {
      if (index < 0) index += self.length;
      if (index < 0 || index >= self.length) throw new Error();
      return self.charCodeAt(index);
    }
    catch (err) { return def; }
  }
  static getRange(self, range) {
    const size = self.length;
    const s = range.__start(size);
    const e = range.__end(size);
    if (e+1 < s) throw IndexErr.make(range);
    return self.substr(s, (e-s)+1);
  }
  static plus(self, obj) {
    if (obj == null) return self + "null";
    const x = ObjUtil.toStr(obj);
    if (x.length == 0) return self;
    return self + x;
  }
  static intern(self) { return self; }
  static isEmpty(self) { return self.length == 0; }
  static size(self) { return self.length; }
  static startsWith(self, test) { return self.startsWith(test); }
  static endsWith(self, test) { return self.endsWith(test); }
  static contains(self, arg) { return self.indexOf(arg) != -1 }
  static containsChar(self, arg) { return self.indexOf(Int.toChar(arg)) != -1 }
  static index(self, s, off=0) {
    let i = off;
    if (i < 0) i = self.length+i;
    const r = self.indexOf(s, i);
    if (r < 0) return null;
    return r;
  }
  static indexr(self, s, off=-1) {
    var i = off;
    if (i < 0) i = self.length+i;
    const r = self.lastIndexOf(s, i);
    if (r < 0) return null;
    return r;
  }
  static indexIgnoreCase(self, s, off=0) {
    return Str.index(self.toLowerCase(), s.toLowerCase(), off);
  }
  static indexrIgnoreCase(self, s, off=-1) {
    return Str.indexr(self.toLowerCase(), s.toLowerCase(), off);
  }
  static each(self, f) {
    const len = self.length;
    for (let i=0; i<len; ++i) f(self.charCodeAt(i), i);
  }
  static eachr(self, f) {
    for (let i=self.length-1; i>=0; i--) f(self.charCodeAt(i), i);
  }
  static eachWhile(self, f) {
    const len = self.length;
    for (let i=0; i<len; ++i) {
      const r = f(self.charCodeAt(i), i);
      if (r != null) return r;
    }
    return null
  }
  static any(self, f) {
    const len = self.length;
    for (let i=0; i<len; ++i) {
      if (f(self.charCodeAt(i), i) == true)
        return true;
    }
    return false;
  }
  static all(self, f) {
    const len = self.length;
    for (let i=0; i<len; ++i) {
      if (f(self.charCodeAt(i), i) == false)
        return false;
    }
    return true;
  }
  static spaces(n) {
    if (Str.#spaces == null) {
      Str.#spaces = new Array();
      let s = "";
      for (let i=0; i<20; i++) {
        Str.#spaces[i] = s;
        s += " ";
      }
    }
    if (n < 20) return Str.#spaces[n];
    let s = "";
    for (let i=0; i<n; i++) s += " ";
    return s;
  }
  static lower(self) {
    let lower = "";
    for (let i = 0; i < self.length; ++i) {
      let char = self[i];
      const code = self.charCodeAt(i);
      if (65 <= code && code <= 90)
        char = String.fromCharCode(code | 0x20);
      lower = lower + char;
    }
    return lower;
  }
  static upper(self) {
    let upper = "";
    for (let i = 0; i < self.length; ++i) {
      let char = self[i];
      const code = self.charCodeAt(i);
      if (97 <= code && code <= 122)
        char = String.fromCharCode(code & ~0x20);
      upper = upper + char;
    }
    return upper;
  }
  static capitalize(self) {
    if (self.length > 0) {
      const ch = self.charCodeAt(0);
      if (97 <= ch && ch <= 122)
        return String.fromCharCode(ch & ~0x20) + self.substring(1);
    }
    return self;
  }
  static decapitalize(self) {
    if (self.length > 0) {
      const ch = self.charCodeAt(0);
      if (65 <= ch && ch <= 90) {
        let s = String.fromCharCode(ch | 0x20);
        s += self.substring(1)
        return s;
      }
    }
    return self;
  }
  static toDisplayName(self) {
    if (self.length == 0) return "";
    let s = '';
    let c = self.charCodeAt(0);
    if (97 <= c && c <= 122) c &= ~0x20;
    s += String.fromCharCode(c);
    let last = c;
    for (let i=1; i<self.length; ++i) {
      c = self.charCodeAt(i);
      if (65 <= c && c <= 90 && last != 95) {
        let next = i+1 < self.length ? self.charCodeAt(i+1) : 81;
        if (!(65 <= last && last <= 90) || !(65 <= next && next <= 90))
          s += ' ';
      }
      else if (97 <= c && c <= 122) {
        if ((48 <= last && last <= 57)) { s += ' '; c &= ~0x20; }
        else if (last == 95) c &= ~0x20;
      }
      else if (48 <= c && c <= 57) {
        if (!(48 <= last && last <= 57)) s += ' ';
      }
      else if (c == 95) {
        s += ' ';
        last = c;
        continue;
      }
      s += String.fromCharCode(c);
      last = c;
    }
    return s;
  }
  static fromDisplayName(self) {
    if (self.length == 0) return "";
    let s = "";
    let c = self.charCodeAt(0);
    let c2 = self.length == 1 ? 0 : self.charCodeAt(1);
    if (65 <= c && c <= 90 && !(65 <= c2 && c2 <= 90)) c |= 0x20;
    s += String.fromCharCode(c);
    let last = c;
    for (let i=1; i<self.length; ++i) {
      c = self.charCodeAt(i);
      if (c != 32) {
        if (last == 32 && 97 <= c && c <= 122) c &= ~0x20;
        s += String.fromCharCode(c);
      }
      last = c;
    }
    return s;
  }
  static mult(self, times) {
    if (times <= 0) return "";
    if (times == 1) return self;
    let s = '';
    for (let i=0; i<times; ++i) s += self;
    return s;
  }
  static justl(self, width) { return Str.padr(self, width, 32); }
  static justr(self, width) { return Str.padl(self, width, 32); }
  static padl(self, w, ch=32) {
    if (self.length >= w) return self;
    const c = String.fromCharCode(ch);
    let s = '';
    for (let i=self.length; i<w; ++i) s += c;
    s += self;
    return s;
  }
  static padr(self, w, ch=32) {
    if (self.length >= w) return self;
    const c = String.fromCharCode(ch);
    let s = '';
    s += self;
    for (let i=self.length; i<w; ++i) s += c;
    return s;
  }
  static reverse(self) {
    let rev = "";
    for (let i=self.length-1; i>=0; i--)
      rev += self[i];
    return rev;
  }
  static trim(self, trimStart=true, trimEnd=true) {
    if (self.length == 0) return self;
    let s = 0;
    let e = self.length-1;
    while (trimStart && s<self.length && self.charCodeAt(s) <= 32) s++;
    while (trimEnd && e>=s && self.charCodeAt(e) <= 32) e--;
    return self.substr(s, (e-s)+1);
  }
  static trimStart(self) { return Str.trim(self, true, false); }
  static trimEnd(self) { return Str.trim(self, false, true); }
  static trimToNull(self) {
    const trimmed = Str.trim(self, true, true);
    return trimmed.length == 0 ? null : trimmed;
  }
  static split(self, sep=null, trimmed=true) {
    if (sep == null) return Str.#splitws(self);
    const toks = List.make(Str.type$, []);
    const trim = (trimmed != null) ? trimmed : true;
    const len = self.length;
    let x = 0;
    for (let i=0; i<len; ++i) {
      if (self.charCodeAt(i) != sep) continue;
      if (x <= i) toks.add(Str.#splitStr(self, x, i, trim));
      x = i+1;
    }
    if (x <= len) toks.add(Str.#splitStr(self, x, len, trim));
    return toks;
  }
  static #splitStr(val, s, e, trim) {
    if (trim == true) {
      while (s < e && val.charCodeAt(s) <= 32) ++s;
      while (e > s && val.charCodeAt(e-1) <= 32) --e;
    }
    return val.substring(s, e);
  }
  static #splitws(val) {
    const toks = List.make(Str.type$, []);
    let len = val.length;
    while (len > 0 && val.charCodeAt(len-1) <= 32) --len;
    let x = 0;
    while (x < len && val.charCodeAt(x) <= 32) ++x;
    for (let i=x; i<len; ++i) {
      if (val.charCodeAt(i) > 32) continue;
      toks.add(val.substring(x, i));
      x = i + 1;
      while (x < len && val.charCodeAt(x) <= 32) ++x;
      i = x;
    }
    if (x <= len) toks.add(val.substring(x, len));
    if (toks.size() == 0) toks.add("");
    return toks;
  }
  static splitLines(self) {
    const lines = List.make(Str.type$, []);
    const len = self.length;
    let s = 0;
    for (var i=0; i<len; ++i) {
      const c = self.charAt(i);
      if (c == '\n' || c == '\r') {
        lines.add(self.substring(s, i));
        s = i+1;
        if (c == '\r' && s < len && self.charAt(s) == '\n') { i++; s++; }
      }
    }
    lines.add(self.substring(s, len));
    return lines;
  }
  static replace(self, oldstr, newstr) {
    if (oldstr == '') return self;
    return self.split(oldstr).join(newstr);
  }
  static numNewlines(self) {
    let numLines = 0;
    const len = self.length;
    for (var i=0; i<len; ++i)
    {
      const c = self.charCodeAt(i);
      if (c == 10) numLines++;
      else if (c == 13) {
        numLines++;
        if (i+1<len && self.charCodeAt(i+1) == 10) i++;
      }
    }
    return numLines;
  }
  static isAscii(self) {
    for (let i=0; i<self.length; i++)
      if (self.charCodeAt(i) > 127)
        return false;
    return true;
  }
  static isSpace(self) {
    for (let i=0; i<self.length; i++) {
      const ch = self.charCodeAt(i);
      if (ch != 32 && ch != 9 && ch != 10 && ch != 12 && ch != 13)
        return false;
    }
    return true;
  }
  static isUpper(self) {
    for (let i=0; i<self.length; i++) {
      const ch = self.charCodeAt(i);
      if (ch < 65 || ch > 90) return false;
    }
    return true;
  }
  static isLower(self) {
    for (let i=0; i<self.length; i++) {
      const ch = self.charCodeAt(i);
      if (ch < 97 || ch > 122) return false;
    }
    return true;
  }
  static isAlpha(self) {
    for (let i=0; i<self.length; i++) {
      const ch = self.charCodeAt(i);
      if (ch >= 128 || (Int.charMap[ch] & Int.ALPHA) == 0)
        return false;
    }
    return true;
  }
  static isAlphaNum(self) {
    for (let i=0; i<self.length; i++) {
      const ch = self.charCodeAt(i);
      if (ch >= 128 || (Int.charMap[ch] & Int.ALPHANUM) == 0)
        return false;
    }
    return true;
  }
  static isEveryChar(self, ch) {
    const len = self.length;
    for (let i=0; i<len; ++i)
      if (self.charCodeAt(i) != ch) return false;
    return true;
  }
  static localeCompare(self, that) {
    return self.localeCompare(that, Locale.cur().toStr(), {sensitivity:'base'});
  }
  static localeUpper(self) { return self.toLocaleUpperCase(Locale.cur().toStr()); }
  static localeLower(self) { return self.toLocaleLowerCase(Locale.cur().toStr()); }
  static localeCapitalize(self) {
    const upper = Str.localeUpper(self);
    return upper[0] + self.substring(1);
  }
  static localeDecapitalize(self) {
    const lower = Str.localeLower(self);
    return lower[0] + self.substring(1);
  }
  static toBool(self, checked=true) { return Bool.fromStr(self, checked); }
  static toFloat(self, checked=true) { return Float.fromStr(self, checked); }
  static toInt(self, radix=10, checked=true) { return Int.fromStr(self, radix, checked); }
  static toDecimal(self, checked=true) { return Decimal.fromStr(self, checked); }
  static in(self) { return InStream.__makeForStr(self); }
  static toUri(self) { return Uri.fromStr(self); }
  static toRegex(self) { return Regex.fromStr(self); }
  static chars(self) {
    const ch = List.make(Int.type$, []);
    for (let i=0; i<self.length; i++) ch.add(self.charCodeAt(i));
    return ch;
  }
  static fromChars(ch) {
    let s = '';
    for (let i=0; i<ch.size(); i++) s += String.fromCharCode(ch.get(i));
    return s;
  }
  static toBuf(self, charset=Charset.utf8()) {
    const buf = new MemBuf();
    buf.charset(charset);
    buf.print(self);
    return buf.flip();
  }
  static toCode(self, quote=34, escapeUnicode=false) {
    let s = "";
    let q = 0;
    if (quote != null) {
      q = String.fromCharCode(quote);
      s += q;
    }
    const len = self.length;
    for (let i=0; i<len; ++i) {
      const c = self.charAt(i);
      switch (c)
      {
        case '\n': s += '\\' + 'n'; break;
        case '\r': s += '\\' + 'r'; break;
        case '\f': s += '\\' + 'f'; break;
        case '\t': s += '\\' + 't'; break;
        case '\\': s += '\\' + '\\'; break;
        case '"':  if (q == '"')  s += '\\' + '"';  else s += c; break;
        case '`':  if (q == '`')  s += '\\' + '`';  else s += c; break;
        case '\'': if (q == '\'') s += '\\' + '\''; else s += c; break;
        case '$':  s += '\\' + '$'; break;
        default:
          var hex  = function(x) { return "0123456789abcdef".charAt(x); }
          var code = c.charCodeAt(0);
          if (code < 32 || (escapeUnicode && code > 127)) {
            s += '\\' + 'u'
              + hex((code>>12)&0xf)
              + hex((code>>8)&0xf)
              + hex((code>>4)&0xf)
              + hex(code & 0xf);
          }
          else {
            s += c;
          }
      }
    }
    if (q != 0) s += q;
    return s;
  }
  static toXml(self) {
    let s = null;
    const len = self.length;
    for (let i=0; i<len; ++i) {
      const ch = self.charAt(i);
      const c = self.charCodeAt(i);
      if (c > 62) {
        if (s != null) s += ch;
      }
      else {
        const esc = Str.xmlEsc[c];
        if (esc != null && (c != 62 || i==0 || self.charCodeAt(i-1) == 93))
        {
          if (s == null)
          {
            s = "";
            s += self.substring(0,i);
          }
          s += esc;
        }
        else if (s != null)
        {
          s += ch;
        }
      }
    }
    if (s == null) return self;
    return s;
  }
  static xmlEsc = [];
  static
  {
    Str.xmlEsc[38] = "&amp;";
    Str.xmlEsc[60] = "&lt;";
    Str.xmlEsc[62] = "&gt;";
    Str.xmlEsc[39] = "&#39;";
    Str.xmlEsc[34] = "&quot;";
  }
}
class Bool extends Obj {
  static defVal() { return false; }
  static hash(self) { return self ? 1231 : 1237; }
  static not(self) { return !self; }
  static and(self, b) { return self && b; }
  static or(self, b) { return self || b; }
  static xor(self, b) { return self != b; }
  static fromStr(s, checked=true) {
    if (s == "true") return true;
    if (s == "false") return false;
    if (!checked) return null;
    throw ParseErr.makeStr("Bool", s);
  }
  static toStr(self) { return self ? "true" : "false"; }
  static toCode(self) { return self ? "true" : "false"; }
  static toLocale(self) {
    const key = self ? "boolTrue" : "boolFalse";
    return Env.cur().locale(Pod.find("sys"), key, Bool.toStr(self));
  }
}
class MimeType extends Obj {
  constructor() {
    super();
  }
  static #byExt  = {};
  static #byMime = {};
  static #emptyQuery;
  #str;
  #mediaType;
  #subType;
  #params;
  static fromStr(s, checked=true) {
    try {
      const mime = MimeType.#byMime[s];
      if (mime != null) return mime;
      if (s == "x-directory/normal")
      {
        const dir = MimeType.#parseStr(s);
        MimeType.#byMime[s] = dir;
        return dir
      }
      return MimeType.#parseStr(s);
    }
    catch (err)
    {
      if (!checked) return null;
      throw ParseErr.makeStr("MimeType",  s);
    }
  }
  static #parseStr(s) {
    const slash = s.indexOf('/');
    if (slash < 0) throw ParseErr.make(s);
    const media = s.slice(0, slash);
    let sub = s.slice(slash+1, s.length);
    let params = MimeType.#emptyParams();
    const semi = sub.indexOf(';');
    if (semi > 0) {
      params = MimeType.#doParseParams(sub, semi+1);
      sub = Str.trim(sub.slice(0, semi));
    }
    const r = new MimeType();
    r.#str = s;
    r.#mediaType = Str.lower(media);
    r.#subType   = Str.lower(sub);
    r.#params    = params.ro();
    return r;
  }
  static parseParams(s, checked=true) {
    try {
      const v = MimeType.#doParseParams(s, 0);
      return v;
    }
    catch (err) {
      if (!checked) return null;
      if (err instanceof ParseErr) throw err;
      throw ParseErr.makeStr("MimeType params",  s);
    }
  }
  static #doParseParams(s, offset) {
    const params = Map.make(Str.type$, Str.type$);
    params.caseInsensitive(true);
    let len      = s.length;
    let inQuotes = false;
    let keyStart = offset;
    let valStart = -1;
    let valEnd   = -1;
    let eq       = -1;
    let hasEsc   = false;
    for (let i=keyStart; i<len; ++i) {
      let c = s.charAt(i);
      if (c == '=' && eq < 0 && !inQuotes) {
        eq = i++;
        while (i<len && MimeType.#isSpace(s, i)) ++i;
        if (i >= len) break;
        if (s.charAt(i) == '"') { inQuotes = true; ++i; c = s.charAt(i); }
        else inQuotes = false;
        valStart = i;
        c = s.charAt(i);
      }
      if (c == ';' && eq < 0 && !inQuotes) {
        let key = Str.trim(s.slice(keyStart, i));
        params.set(key, "");
        keyStart = i+1;
        eq = valStart = valEnd = -1;
        hasEsc = false;
        continue;
      }
      if (eq < 0) continue;
      if (c == '\\' && inQuotes) {
        ++i;
        hasEsc = true;
        continue;
      }
      if (c == '"' && inQuotes) {
        valEnd = i-1;
        inQuotes = false;
      }
      if (c == ';' && !inQuotes) {
        if (valEnd < 0) valEnd = i-1;
        var key = Str.trim(s.slice(keyStart, eq));
        var val = Str.trim(s.slice(valStart, valEnd+1));
        if (hasEsc) val = MimeType.#unescape(val);
        params.set(key, val);
        keyStart = i+1;
        eq = valStart = valEnd = -1;
        hasEsc = false;
      }
    }
    if (keyStart < len) {
      if (eq < 0) {
        var key = Str.trim(s.slice(keyStart, len));
        params.set(key, "");
      }
      else {
        if (valStart < 0) valStart = eq+1;
        if (valEnd < 0) valEnd = len-1;
        let key = Str.trim(s.slice(keyStart, eq));
        let val = Str.trim(s.slice(valStart, valEnd+1));
        if (hasEsc) val = MimeType.#unescape(val);
        params.set(key, val);
      }
    }
    return params;
  }
  static #isSpace(s, i) {
    if (i >= s.length) throw IndexErr.make(i);
    return Int.isSpace(s.charCodeAt(i));
  }
  static #unescape(s) {
    let buf = "";
    for (let i=0; i<s.length; ++i) {
      const c = s.charAt(i);
      if (c != '\\') buf += c;
      else if (s.charAt(i+1) == '\\') { buf += '\\'; i++; }
    }
    return buf;
  }
  static forExt(ext) {
    if (ext == null) return null;
    try {
      ext = ext.toLowerCase();
      return MimeType.#byExt[ext];
    }
    catch (err) {
      ObjUtil.echo("MimeType.forExt: " + ext);
      ObjUtil.echo(err);
      return null;
    }
  }
  equals(obj) {
    if (obj instanceof MimeType) {
      return this.#mediaType == obj.#mediaType &&
            this.#subType == obj.#subType &&
            this.#params.equals(obj.#params);
    }
    return false;
  }
  hash() {
    return 0;
  }
  toStr() { return this.#str; }
  mediaType() { return this.#mediaType; }
  subType() { return this.#subType; }
  params() { return this.#params; }
  charset() {
    const s = this.params().get("charset");
    if (s == null) return Charset.utf8();
    return Charset.fromStr(s);
  }
  noParams() {
    if (this.params().isEmpty()) return this;
    return MimeType.fromStr(`${this.mediaType()}/${this.subType()}`);
  }
  isText() {
    return (this.#mediaType == "text") ||
           (this.#mediaType == "application" && this.#subType == "json");
  }
  static #emptyParams() {
    let q = MimeType.#emptyQuery;
    if (!q)
    {
      q = Map.make(Str.type$, Str.type$);
      q.caseInsensitive(true);
      MimeType.#emptyQuery = q;
    }
    return q;
  }
  static __cache(ext, s) {
    let mime = MimeType.#parseStr(s);
    MimeType.#byExt[ext] = mime;
    MimeType.#byMime[mime.toStr()] = mime;
    mime = mime.noParams();
    MimeType.#byMime[mime.toStr()] = mime;
  }
}
class Type extends Obj {
  constructor(qname, base, mixins, facets={}, flags=0, jsRef=null) {
    super();
    if (qname === undefined) return;
    if (Type.type$ != null) {
      let acc = List.make(Type.type$, []);
      for (let i=0; i<mixins.length; ++i) {
        acc.add(Type.find(mixins[i]));
      }
      this.#mixins = acc.ro();
    }
    let s = qname.split('::');
    this.#qname = qname;
    this.#pod = Pod.find(s[0]);
    this.#name = s[1];
    this.#base = base == null ? null : Type.find(base);
    this.#myFacets = new Facets(facets);
    this.#flags = flags;
    this.#nullable = new NullableType(this);
    this.#slotsInfo = [];
    if (jsRef != null) {
      let ns = Type.$registry[this.#pod.name()];
      if (ns == null) Type.$registry[this.#pod.name()] = ns = {};
      ns[this.#name] = jsRef;
    }
  }
  #qname;
  #pod;
  #name;
  #base;
  #mixins;
  #myFacets;
  #flags;
  #nullable;
  #slotsInfo;
  static #noParams = null;
  static $registry =  {};
  pod() { return this.#pod; }
  name() { return this.#name; }
  qname() { return this.#qname; }
  qnameJs$() { return `${this.#pod}.${this.#name}`; }
  signature() { return this.#qname; }
  flags() { return this.#flags; };
  isAbstract() { return (this.flags() & FConst.Abstract) != 0; }
  isClass() { return (this.flags() & (FConst.Enum|FConst.Mixin)) == 0; }
  isConst() { return (this.flags() & FConst.Const) != 0; }
  isEnum() { return (this.flags() & FConst.Enum) != 0; }
  isFacet() { return (this.flags() & FConst.Facet) != 0; }
  isFinal() { return (this.flags() & FConst.Final) != 0; }
  isInternal() { return (this.flags() & FConst.Internal) != 0; }
  isMixin() { return (this.flags() & FConst.Mixin) != 0; }
  isPublic() { return (this.flags() & FConst.Public) != 0; }
  isSynthetic() { return (this.flags() & FConst.Synthetic) != 0; }
  trap(name, args=null) {
    if (name == "flags") return this.flags();
    return super.trap(name, args);
  }
  equals(that) {
    if (that instanceof Type)
      return this.signature() === that.signature();
    else
      return false;
  }
  isVal() {
    return this === Bool.type$ ||
           this === Int.type$ ||
           this === Float.type$;
  }
  log()       { return this.#pod.log(); }
  toStr()     { return this.signature(); }
  toLocale()  { return this.signature(); }
  typeof()   { return Type.type$; }
  literalEncode$(out) { out.w(this.signature()).w("#"); }
  isNullable() { return false; }
  toNonNullable() { return this; }
  toNullable() { return this.#nullable; }
  isGenericType() {
    return this == List.type$ ||
           this == Map.type$ ||
           this == Func.type$;
  }
  isGenericInstance() { return false; }
  isGenericParameter() {
    return this.#pod.name() === "sys" && this.#name.length === 1;
  }
  isGeneric() { return this.isGenericType(); }
  params() {
    if (Type.#noParams == null)
      Type.#noParams = Map.make(Str.type$, Type.type$).ro();
    return Type.#noParams;
  }
  parameterize(params) {
    if (this === List.type$) {
      let v = params.get("V");
      if (v == null) throw ArgErr.make("List.parameterize - V undefined");
      return v.toListOf();
    }
    if (this === Map.type$) {
      let v = params.get("V");
      let k = params.get("K");
      if (v == null) throw ArgErr.make("Map.parameterize - V undefined");
      if (k == null) throw ArgErr.make("Map.parameterize - K undefined");
      return new MapType(k, v);
    }
    if (this === Func.type$) {
      let r = params.get("R");
      if (r == null) throw ArgErr.make("Func.parameterize - R undefined");
      let p = [];
      for (let i=65; i<=72; ++i) {
        let x = params.get(String.fromCharCode(i));
        if (x == null) break;
        p.push(x);
      }
      return new FuncType(p, r);
    }
    throw UnsupportedErr.make(`not generic: ${this}`);
  }
  toListOf() {
    if (this.listOf$ == null) this.listOf$ = new ListType(this);
    return this.listOf$;
  }
  emptyList() {
    if (this.emptyList$ == null)
      this.emptyList$ = List.make(this).toImmutable();
    return this.emptyList$;
  }
  make(args) {
    if (args === undefined) args = null;
    let make = this.method("make", false);
    if (make != null && make.isPublic()) {
      if (this.isAbstract() && !make.isStatic()) {
        throw Err.make(`Cannot instantiate abstract class: ${this.#qname}`);
      }
      let numArgs = args == null ? 0 : args.size();
      let params = make.params();
      if ((numArgs == params.size()) ||
          (numArgs < params.size() && params.get(numArgs).hasDefault())) {
        return make.invoke(null, args);
      }
    }
    let defVal = this.slot("defVal", false);
    if (defVal != null && defVal.isPublic()) {
      if (defVal instanceof Field) return defVal.get(null);
      if (defVal instanceof Method) return defVal.invoke(null, null);
    }
    throw Err.make(`Typs missing 'make' or 'defVal' slots: ${this.toStr()}`);
  }
  slots() { return this.reflect().slotList$.ro(); }
  methods() { return this.reflect().methodList$.ro(); }
  fields() { return this.reflect().fieldList$.ro(); }
  slot(name, checked=true) {
    const slot = this.reflect().slotsByName$[name];
    if (slot != null) return slot;
    if (checked) throw UnknownSlotErr.make(this.m_qname + "." + name);
    return null;
  }
  method(name, checked=true) {
    const slot = this.slot(name, checked);
    if (slot == null) return null;
    return ObjUtil.coerce(slot, Method.type$);
  }
  field(name, checked=true) {
    const slot = this.slot(name, checked);
    if (slot == null) return null;
    return ObjUtil.coerce(slot, Field.type$);
  }
  am$(name, flags, returns, params, facets) {
    const r = fanx_TypeParser.load(returns);
    const m = new Method(this, name, flags, r, params, facets);
    this.#slotsInfo.push(m);
    return this;
  }
  af$(name, flags, of, facets) {
    const t = fanx_TypeParser.load(of);
    const f = new Field(this, name, flags, t, facets);
    this.#slotsInfo.push(f);
    return this;
  }
  base() { return this.#base; }
  mixins() {
    if (this.#mixins == null)
      this.#mixins = Type.type$.emptyList();
    return this.#mixins;
  }
  inheritance() {
    if (this.inheritance$ == null) this.inheritance$ = Type.#buildInheritance(this);
    return this.inheritance$;
  }
  static #buildInheritance(self) {
    const map = {};
    const acc = List.make(Type.type$);
    if (self == Void.type$) {
      acc.add(self);
      return acc.trim().ro();
    }
    map[self.qname()] = self;
    acc.add(self);
    Type.#addInheritance(self.base(), acc, map);
    const mixins = self.mixins();
    for (let i=0; i<mixins.size(); ++i)
      Type.#addInheritance(mixins.get(i), acc, map);
    return acc.trim().ro();
  }
  static #addInheritance(t, acc, map) {
    if (t == null) return;
    const ti = t.inheritance();
    for (let i=0; i<ti.size(); ++i)
    {
      let x = ti.get(i);
      if (map[x.qname()] == null)
      {
        map[x.qname()] = x;
        acc.add(x);
      }
    }
  }
  fits(that) { return this.toNonNullable().is(that.toNonNullable()); }
  is(that) {
    if (that instanceof NullableType)
      that = that.root;
    if (this.equals(that)) return true;
    if (this === Void.type$) return false;
    var base = this.#base;
    while (base != null) {
      if (base.equals(that)) return true;
      base = base.#base;
    }
    let t = this;
    while (t != null)
    {
      let m = t.mixins();
      for (let i=0; i<m.size(); i++)
        if (Type.checkMixin(m.get(i), that)) return true;
      t = t.#base;
    }
    return false;
  }
  static checkMixin(mixin, that) {
    if (mixin.equals(that)) return true;
    const m = mixin.mixins();
    for (let i=0; i<m.size(); i++)
      if (Type.checkMixin(m.get(i), that))
        return true;
    return false;
  }
  hasFacet(type) { return this.facet(type, false) != null; }
  facets() {
    if (this.inheritedFacets$ == null) this.#loadFacets();
    return this.inheritedFacets$.list();
  }
  facet(type, checked=true) {
    if (this.inheritedFacets$ == null) this.#loadFacets();
    return this.inheritedFacets$.get(type, checked);
  }
  #loadFacets() {
    const f = this.#myFacets.dup();
    const inheritance = this.inheritance();
    for (let i=0; i<inheritance.size(); ++i) {
      let x = inheritance.get(i);
      if (x.#myFacets) f.inherit(x.#myFacets);
    }
    this.inheritedFacets$ = f;
  }
  reflect() {
    if (this.slotsByName$ != null) return this;
    this.doReflect$();
    return this;
  }
  doReflect$() {
    const slots = [];
    const nameToSlot  = {};
    const nameToIndex = {};
    if (this.#mixins)
    {
      for (let i=0; i<this.#mixins.size(); i++)
      {
        this.#mergeType(this.#mixins.get(i), slots, nameToSlot, nameToIndex);
      }
    }
    this.#mergeType(this.#base, slots, nameToSlot, nameToIndex);
    for (let i=0; i<this.#slotsInfo.length; i++) {
      const slot = this.#slotsInfo[i]
      this.#mergeSlot(slot, slots, nameToSlot, nameToIndex);
    }
    const fields  = [];
    const methods = [];
    for (let i=0; i<slots.length; i++) {
      const slot = slots[i];
      if (slot instanceof Field) fields.push(slot);
      else methods.push(slot);
    }
    this.slotList$    = List.make(Slot.type$, slots);
    this.fieldList$   = List.make(Field.type$, fields);
    this.methodList$  = List.make(Method.type$, methods);
    this.slotsByName$ = nameToSlot;
  }
  #mergeType(inheritedType, slots, nameToSlot, nameToIndex) {
    if (inheritedType == null) return;
    const inheritedSlots = inheritedType.reflect().slots();
    for (let i=0; i<inheritedSlots.size(); i++)
      this.#mergeSlot(inheritedSlots.get(i), slots, nameToSlot, nameToIndex);
  }
  #mergeSlot(slot, slots, nameToSlot, nameToIndex) {
    if (slot.isCtor() && slot.parent() != this) return;
    const name = slot.name();
    const dup  = nameToIndex[name];
    if (dup != null) {
      if (slot.parent() == Obj.type$)
        return;
      const dupSlot = slots[dup];
      if (slot.parent() != this && slot.isAbstract() && !dupSlot.isAbstract())
        return;
      if ((slot.flags$() & (FConst.Getter | FConst.Setter)) != 0)
      {
        const field = slots[dup];
        if ((slot.flags$() & FConst.Getter) != 0)
          field.getter$ = slot;
        else
          field.setter$ = slot;
        return;
      }
      nameToSlot[name] = slot;
      slots[dup] = slot;
    } else {
      nameToSlot[name] = slot;
      slots.push(slot);
      nameToIndex[name] = slots.length-1;
    }
  }
  static find(sig, checked=true) {
      return fanx_TypeParser.load(sig, checked);
  }
  static of(obj) {
    if (obj instanceof Obj)
      return obj.typeof();
    else
      return Type.toFanType(obj);
  }
  static toFanType(obj) {
    if (obj == null) throw Err.make("sys::Type.toFanType: obj is null");
    if (obj.fanType$ != undefined) return obj.fanType$;
    if ((typeof obj) == "boolean" || obj instanceof Boolean) return Bool.type$;
    if ((typeof obj) == "number"  || obj instanceof Number)  return Int.type$;
    if ((typeof obj) == "string"  || obj instanceof String)  return Str.type$;
    if ((typeof obj) == "function" || obj instanceof Function) return Func.type$;
    throw Err.make(`sys::Type.toFanType: Not a Fantom type: ${obj} ${typeof obj}`);
  }
  static common$(objs) {
    if (objs.length == 0) return Obj.type$.toNullable();
    let nullable = false;
    let best = null;
    for (let i=0; i<objs.length; i++)
    {
      const obj = objs[i];
      if (obj == null) { nullable = true; continue; }
      const t = ObjUtil.typeof(obj);
      if (best == null) { best = t; continue; }
      while (!t.is(best)) {
        best = best.base();
        if (best == null) return nullable ? Obj.type$.toNullable() : Obj.type$;
      }
    }
    if (best == null) best = Obj.type$;
    return nullable ? best.toNullable() : best;
  }
}
class NullableType extends Type {
  constructor(root) {
    super();
    this.#root = root;
  }
  #root;
  get root() { return this.#root; }
  podName() { return this.root.podName(); }
  pod() { return this.root.pod(); }
  name() { return this.root.name(); }
  qname() { return this.root.qname(); }
  signature() { return `${this.root.signature()}?`; }
  flags() { return this.root.flags(); }
  base() { return this.root.base(); }
  mixins() { return this.root.mixins(); }
  inheritance() { return this.root.inheritance(); }
  is(type) { return this.root.is(type); }
  isVal() { return this.root.isVal(); }
  isNullable() { return true; }
  toNullable() { return this; }
  toNonNullable() { return this.root; }
  isGenericType() { return this.root.isGenericType(); }
  isGenericInstance() { return this.root.isGenericInstance(); }
  isGenericParameter() { return this.root.isGenericParameter(); }
  getRawType() { return this.root.getRawType(); }
  params() { return this.root.params(); }
  parameterize(params) { return this.root.parameterize(params).toNullable(); }
  fields() { return this.root.fields(); }
  methods() { return this.root.methods(); }
  slots() { return this.root.slots(); }
  slot(name, checked) { return this.root.slot(name, checked); }
  facets() { return this.root.facets(); }
  facet(type, checked) { return this.root.facet(type, checked); }
  doc() { return this.root.doc(); }
}
class GenericType extends Type {
  constructor(qname, base, mixins, facets={}, flags=0) {
    super(qname, base, mixins, facets, flags);
  }
  params() {
    if (this.params$ == null) this.params$ = this.makeParams$();
    return this.params$;
  }
  makeParams$() { throw UnsupportedErr.make("Not implemented"); }
  doReflect$() {
    const master = this.base();
    master.doReflect$();
    const masterSlots = master.slots();
    const slots = [];
    const fields = [];
    const methods = [];
    const slotsByName = {};
    for (let i=0; i<masterSlots.size(); i++)
    {
      let slot = masterSlots.get(i);
      if (slot instanceof Method)
      {
        slot = this.parameterizeMethod$(slot);
        methods.push(slot);
      }
      else
      {
        slot = this.parameterizeField$(slot);
        fields.push(slot);
      }
      slots.push(slot);
      slotsByName[slot.name()] = slot;
    }
    this.slotList$ = List.make(Slot.type$, slots);
    this.fieldList$ = List.make(Field.type$, fields);
    this.methodList$ = List.make(Method.type$, methods);
    this.slotsByName$ = slotsByName;
  }
  parameterizeField$(f) {
    let t = f.type();
    if (!t.isGenericParameter()) return f;
    t = this.parameterizeType$(t);
    const pf = new Field(this, f.name(), f.flags$(), t, f.facets());
    return pf;
  }
  parameterizeMethod$(m) {
    if (!m.isGenericMethod()) return m;
    let ret;
    const params = List.make(Param.type$);
    if (m.returns().isGenericParameter())
      ret = this.parameterizeType$(m.returns());
    else
      ret = m.returns();
    const arity = m.params().size();
    for (let i=0; i<arity; ++i) {
      const p = m.params().get(i);
      if (p.type().isGenericParameter())
      {
        params.add(new Param(p.name(), this.parameterizeType$(p.type()), p.hasDefault()));
      }
      else
      {
        params.add(p);
      }
    }
    const pm = new Method(this, m.name(), m.flags$(), ret, params, m.facets(), m)
    return pm;
  }
  parameterizeType$(t) {
    const nullable = t.isNullable();
    const nn = t.toNonNullable();
    if (nn instanceof ListType)
      t = this.parameterizeListType$(nn);
    else if (nn instanceof FuncType)
      t = this.parameterizeFuncType$(nn);
    else
      t = this.doParameterize$(nn);
    return nullable ? t.toNullable() : t;
  }
  parameterizeListType$(t) {
    return this.doParameterize$(t.v).toListOf();
  }
  parameterizeFuncType$(t) {
    const params = [];
    for (let i=0; i<t.pars.length; i++)
    {
      let param = t.pars[i];
      if (param.isGenericParameter()) param = this.doParameterize$(param);
      params[i] = param;
    }
    let ret = t.ret;
    if (ret.isGenericParameter()) ret = this.doParameterize$(ret);
    return new FuncType(params, ret);
  }
  doParameterize$(t) { throw UnsupportedErr.make("Not implemented"); }
}
class ListType extends GenericType {
  constructor(v) {
    super("sys::List", List.type$.qname(), Type.type$.emptyList());
    this.#v = v;
  }
  #v;
  get v() { return this.#v; }
  signature() { return `${this.v.signature()}[]`; }
  equals(that) {
    if (that instanceof ListType)
      return this.v.equals(that.v);
    else
      return false;
  }
  is(that) {
    if (that instanceof ListType)
    {
      if (that.v.qname() == "sys::Obj") return true;
      return this.v.is(that.v);
    }
    if (that instanceof Type)
    {
      if (that.qname() == "sys::List") return true;
      if (that.qname() == "sys::Obj")  return true;
    }
    return false;
  }
  as(obj, that) {
    const objType = ObjUtil.typeof(obj);
    if (objType instanceof ListType &&
        that instanceof ListType)
    {
      return obj;
    }
    if (that instanceof NullableType &&
        that.root instanceof ListType)
      that = that.root;
    return objType.is(that) ? obj : null;
  }
  facets() { return List.type$.facets(); }
  facet(type, checked=true) { return List.type$.facet(type, checked); }
  makeParams$() {
    return Map.make(Str.type$, Type.type$)
      .set("V", this.v)
      .set("L", this).ro();
  }
  isGenericParameter() {
    return this.v.isGenericParameter();
  }
  doParameterize$(t) {
    if (t == Sys.VType) return this.v;
    if (t == Sys.LType) return this;
    throw new Error(t.toString());
  }
}
class MapType extends GenericType {
  constructor(k, v) {
    super("sys::Map", Map.type$.qname(), Type.type$.emptyList());
    this.#k = k;
    this.#v = v;
  }
  #k;
  #v;
  get k() { return this.#k; }
  get v() { return this.#v; }
  signature() {
    return "[" + this.k.signature() + ':' + this.v.signature() + ']';
  }
  equals(that) {
    if (that instanceof MapType)
      return this.k.equals(that.k) && this.v.equals(that.v);
    else
      return false;
  }
  is(that) {
    if (that.isNullable()) that = that.root;
    if (that instanceof MapType) {
      return this.k.is(that.k) && this.v.is(that.v);
    }
    if (that instanceof Type) {
      if (that.qname() == "sys::Map") return true;
      if (that.qname() == "sys::Obj")  return true;
    }
    return false;
  }
  as(obj, that) {
    const objType = ObjUtil.typeof(obj);
    if (objType instanceof MapType && that instanceof MapType)
      return obj;
    return objType.is(that) ? obj : null;
  }
  facets() { return Map.type$.facets(); }
  facet(type, checked=true) { return Map.type$.facet(type, checked); }
  makeParams$() {
    return Map.make(Str.type$, Type.type$)
      .set("K", this.k)
      .set("V", this.v)
      .set("M", this).ro();
  }
  isGenericParameter() {
    return this.v.isGenericParameter() && this.k.isGenericParameter();
  }
  doParameterize$(t) {
    if (t == Sys.KType) return this.k;
    if (t == Sys.VType) return this.v;
    if (t == Sys.MType) return this;
    throw new Error(t.toString());
  }
}
class FuncType extends GenericType {
  constructor(params, ret) {
    super("sys::Func", Obj.type$.qname(), Type.type$.emptyList());
    this.#pars = params;
    this.#ret = ret;
    this.#genericParameterType |= ret.isGenericParameter();
    for (let i=0; i<params.length; ++i)
      this.#genericParameterType |= params[i].isGenericParameter();
  }
  #pars;
  #ret;
  #genericParameterType=0;
  get pars() { return this.#pars; }
  get ret() { return this.#ret; }
  signature() {
    let s = '|'
    for (let i=0; i<this.pars.length; i++)
    {
      if (i > 0) s += ',';
      s += this.pars[i].signature();
    }
    s += '->';
    s += this.ret.signature();
    s += '|';
    return s;
  }
  equals(that) {
    if (that instanceof FuncType)
    {
      if (this.pars.length != that.pars.length) return false;
      for (let i=0; i<this.pars.length; i++)
        if (!this.pars[i].equals(that.pars[i])) return false;
      return this.ret.equals(that.ret);
    }
    return false;
  }
  is(that) {
    if (this == that) return true;
    if (that instanceof FuncType)
    {
      if (that.ret.qname() != "sys::Void" && !this.ret.is(that.ret)) return false;
      if (this.pars.length > that.pars.length) return false;
      for (let i=0; i<this.pars.length; ++i)
        if (!that.pars[i].is(this.pars[i])) return false;
      return true;
    }
    if (that.toString() == "sys::Func") return true;
    if (that.toString() == "sys::Func?") return true;
    return this.base().is(that);
  }
  as(that) {
    throw UnsupportedErr.make("TODO:FIXIT");
    return that;
  }
  facets() { return Func.type$.facets(); }
  facet(type, checked=true) { return Func.type$.facet(type, checked); }
  makeParams$() {
    const map = Map.make(Str.type$, Type.type$);
    for (let i=0; i<this.pars.length; ++i)
      map.set(String.fromCharCode(i+65), this.pars[i]);
    return map.set("R", this.ret).ro();
  }
  isGenericParameter() { return this.#genericParameterType; }
  doParameterize$(t) {
    if (t == Sys.RType) return this.#ret;
    const name = t.name().charCodeAt(0) - 65;
    if (name < this.pars.length) return this.pars[name];
    return Obj.type$;
  }
}
class Regex extends Obj {
  constructor(source, flags="") {
    super();
    this.#source = source;
    this.#flags = flags;
    this.#regexp = new RegExp(source, flags);
  }
  #source;
  #flags;
  #regexp;
  static #defVal = undefined;
  static defVal() {
    if (Regex.#defVal === undefined) Regex.#defVal = Regex.fromStr("");
    return Regex.#defVal;
  }
  static fromStr(pattern, flags="") {
    return new Regex(pattern, flags);
  }
  static glob(pattern) {
    let s = "";
    for (let i=0; i<pattern.length; ++i) {
      const c = pattern.charCodeAt(i);
      if (Int.isAlphaNum(c)) s += String.fromCharCode(c);
      else if (c == 63) s += '.';
      else if (c == 42) s += '.*';
      else s += '\\' + String.fromCharCode(c);
    }
    return new Regex(s);
  }
  static quote(pattern) {
    let s = "";
    for (let i=0; i<pattern.length; ++i) {
      const c = pattern.charCodeAt(i);
      if (Int.isAlphaNum(c)) s += String.fromCharCode(c);
      else s += '\\' + String.fromCharCode(c);
    }
    return new Regex(s);
  }
  equals(obj) {
    if (obj instanceof Regex)
      return obj.#source === this.#source && obj.#flags == this.#flags;
    else
      return false;
  }
  flags() { return this.#flags; }
  hash() { return Str.hash(this.#source); }
  toStr() { return this.#source; }
  matches(s) { return this.matcher(s).matches(); }
  matcher(s) { return new RegexMatcher(this.#regexp, this.#source, s); }
  split(s, limit=0) {
    if (limit === 1)
      return List.make(Str.type$, [s]);
    const array = [];
    const re = this.#regexp;
    while (true) {
      const m = s.match(re);
      if (m == null || (limit != 0 && array.length == limit -1)) {
        array.push(s);
        break;
      }
      array.push(s.substring(0, m.index));
      s = s.substring(m.index + m[0].length);
    }
    if (limit == 0) {
      while (array[array.length-1] == "") { array.pop(); }
    }
    return List.make(Str.type$, array);
  }
}
class OutStream extends Obj {
  constructor() {
    super();
    this.#out = null;
    this.#charset = Charset.utf8();
    this.#bigEndian = true;
  }
  #out;
  #charset;
  #bigEndian;
  static #xmlEscNewLines = 0x01;
  static xmlEscNewlines() { return OutStream.#xmlEscNewLines; }
  static #xmlEscQuotes = 0x02;
  static xmlEscQuotes() { return OutStream.#xmlEscQuotes; }
  static #xmlEscUnicode = 0x04;
  static xmlEscUnicode() { return OutStream.#xmlEscUnicode; }
  static make$(self, out) {
    self.#out = out;
    if (out != null) self.charset(out.charset());
  }
  __out() { return this.#out; }
  write(x) {
    if (!this.#out) throw UnsupportedErr.make(`${this.typeof().qname()} wraps null OutStream`);
    this.#out.write(x);
    return this;
  }
  writeBuf(buf, n=buf.remaining()) {
    if (!this.#out) throw UnsupportedErr.make(`${this.typeof().qname()} wraps null OutStream`);
    this.out.writeBuf(buf, n);
    return this;
  }
  endian(it) {
    if (it === undefined) return this.#bigEndian ? Endian.big() : Endian.little();
    this.#bigEndian = (it == Endian.big());
  }
  writeI2(x) {
    if (this.#bigEndian)
      return this.write((x >>> 8) & 0xFF)
                 .write((x >>> 0) & 0xFF);
    else
      return this.write((x >>> 0) & 0xFF)
                 .write((x >>> 8) & 0xFF);
  }
  writeI4(x) {
    if (this.#bigEndian)
      return this.write((x >>> 24) & 0xFF)
                 .write((x >>> 16) & 0xFF)
                 .write((x >>> 8)  & 0xFF)
                 .write((x >>> 0)  & 0xFF);
    else
      return this.write((x >>> 0)  & 0xFF)
                 .write((x >>> 8)  & 0xFF)
                 .write((x >>> 16) & 0xFF)
                 .write((x >>> 24) & 0xFF);
  }
  writeI8(x) {
    if (this.#bigEndian)
      return this.write((x >>> 56) & 0xFF)
                 .write((x >>> 48) & 0xFF)
                 .write((x >>> 40) & 0xFF)
                 .write((x >>> 32) & 0xFF)
                 .write((x >>> 24) & 0xFF)
                 .write((x >>> 16) & 0xFF)
                 .write((x >>> 8)  & 0xFF)
                 .write((x >>> 0)  & 0xFF);
    else
      return this.write((x >>> 0)  & 0xFF)
                 .write((x >>> 8)  & 0xFF)
                 .write((x >>> 16) & 0xFF)
                 .write((x >>> 24) & 0xFF)
                 .write((x >>> 32) & 0xFF)
                 .write((x >>> 40) & 0xFF)
                 .write((x >>> 48) & 0xFF)
                 .write((x >>> 56) & 0xFF);
  }
  writeF4(x) {
    const buf  = new ArrayBuffer(4);
    const data = new DataView(buf);
    data.setFloat32(0, x, !this.#bigEndian);
    for (const byte of new Uint8Array(buf)) { this.write(byte); }
  }
  writeF8(x) {
    const buf  = new ArrayBuffer(8);
    const data = new DataView(buf);
    data.setFloat64(0, x, !this.#bigEndian);
    for (const byte of new Uint8Array(buf)) { this.write(byte); }
  }
  writeDecimal(x) { return this.writeUtf(x.toString()); }
  writeBool(x) { return this.write(x ? 1 : 0); }
  writeUtf(s) {
    const slen = s.length;
    let utflen = 0;
    for (let i=0; i<slen; ++i)
    {
      const c = s.charCodeAt(i);
      if (c <= 0x007F)
        utflen +=1;
      else if (c > 0x07FF)
        utflen += 3;
      else
        utflen += 2;
    }
    if (utflen > 65536) throw IOErr.make("String too big");
    this.write((utflen >>> 8) & 0xFF);
    this.write((utflen >>> 0) & 0xFF);
    for (let i=0; i<slen; ++i)
    {
      const c = s.charCodeAt(i);
      if (c <= 0x007F) {
        this.write(c);
      }
      else if (c > 0x07FF) {
        this.write(0xE0 | ((c >> 12) & 0x0F));
        this.write(0x80 | ((c >>  6) & 0x3F));
        this.write(0x80 | ((c >>  0) & 0x3F));
      }
      else {
        this.write(0xC0 | ((c >>  6) & 0x1F));
        this.write(0x80 | ((c >>  0) & 0x3F));
      }
    }
    return this;
  }
  charset(it) {
    if (it === undefined) return this.#charset;
    this.#charset = it;
  }
  writeChar(c) {
    if (this.#out != null)
      this.#out.writeChar(c)
    else
      this.#charset.__encoder().encodeOut(c, this);
    return this;
  }
  writeChars(s, off=0, len=s.length-off) {
    const end = off+len;
    for (let i=off; i<end; i++)
      this.writeChar(s.charCodeAt(i));
    return this;
  }
  print(obj) {
    const s = obj == null ? "null" : ObjUtil.toStr(obj);
    return this.writeChars(s, 0, s.length);
  }
  printLine(obj="") {
    const s = obj == null ? "null" : ObjUtil.toStr(obj);
    this.writeChars(s, 0, s.length);
    return this.writeChars('\n');
  }
  writeObj(obj, options=null) {
    new fanx_ObjEncoder(this, options).writeObj(obj);
    return this;
  }
  flush() {
    if (this.#out != null) this.#out.flush();
    return this;
  }
  writeProps(props, close=true) {
    const origCharset = this.charset();
    this.charset(Charset.utf8());
    try {
      const keys = props.keys().sort();
      const size = keys.size();
      for (let i=0; i<size; ++i) {
        const key = keys.get(i);
        const val = props.get(key);
        this.#writePropStr(key);
        this.writeChar(61);
        this.#writePropStr(val);
        this.writeChar(10);
      }
      return this;
    }
    finally {
      try { if (close) this.close(); } catch (err) { ObjUtil.echo(err); }
      this.charset(origCharset);
    }
  }
  #writePropStr(s) {
    const len = s.length;
    for (let i=0; i<len; ++i) {
      const ch = s.charCodeAt(i);
      const peek = i+1<len ? s.charCodeAt(i+1) : -1;
      switch (ch) {
        case 10: this.writeChar(92).writeChar(110); continue;
        case 13: this.writeChar(92).writeChar(114); continue;
        case  9: this.writeChar(92).writeChar(116); continue;
        case 92: this.writeChar(92).writeChar(92); continue;
      }
      if ((ch < 32) || (ch == 47 && (peek == 47 || peek == 42)) || (ch == 61))
      {
        const nib1 = Int.toDigit((ch >>> 4) & 0xf, 16);
        const nib2 = Int.toDigit((ch >>> 0) & 0xf, 16);
        this.writeChar(92).writeChar(117)
            .writeChar(48).writeChar(48)
            .writeChar(nib1).writeChar(nib2);
        continue;
      }
      this.writeChar(ch);
    }
  }
  writeXml(s, mask=0) {
    const escNewlines  = (mask & OutStream.xmlEscNewlines()) != 0;
    const escQuotes    = (mask & OutStream.xmlEscQuotes()) != 0;
    const escUnicode   = (mask & OutStream.xmlEscUnicode()) != 0;
    for (let i=0; i<s.length; ++i) {
      const ch = s.charCodeAt(i);
      switch (ch) {
        case  0: case  1: case  2: case  3: case  4: case  5: case  6:
        case  7: case  8: case 11: case 12:
        case 14: case 15: case 16: case 17: case 18: case 19: case 20:
        case 21: case 22: case 23: case 24: case 25: case 26: case 27:
        case 28: case 29: case 30: case 31:
          this.#writeXmlEsc(ch);
          break;
        case 10: case 13:
          if (!escNewlines)
            this.writeChar(ch);
          else
            this.#writeXmlEsc(ch);
          break;
        case 32:
          this.writeChar(32);
          break;
        case 33: case 35: case 36: case 37: case 40: case 41: case 42:
        case 43: case 44: case 45: case 46: case 47: case 48: case 49:
        case 50: case 51: case 52: case 53: case 54: case 55: case 56:
        case 57: case 58: case 59: case 61: case 63: case 64: case 65:
        case 66: case 67: case 68: case 69: case 70: case 71: case 72:
        case 73: case 74: case 75: case 76: case 77: case 78: case 79:
        case 80: case 81: case 82: case 83: case 84: case 85: case 86:
        case 87: case 88: case 89: case 90: case 91: case 92: case 93:
        case 94: case 95: case 96: case 97: case 98: case 99: case 100:
        case 101: case 102: case 103: case 104: case 105: case 106: case 107:
        case 108: case 109: case 110: case 111: case 112: case 113: case 114:
        case 115: case 116: case 117: case 118: case 119: case 120: case 121:
        case 122: case 123: case 124: case 125: case 126:
          this.writeChar(ch);
          break;
        case 60:
          this.writeChar(38);
          this.writeChar(108);
          this.writeChar(116);
          this.writeChar(59);
          break;
        case 62:
          if (i > 0 && s.charCodeAt(i-1) != 93)
            this.writeChar(62);
          else
          {
            this.writeChar(38);
            this.writeChar(103);
            this.writeChar(116);
            this.writeChar(59);
          }
          break;
        case 38:
          this.writeChar(38);
          this.writeChar(97);
          this.writeChar(109);
          this.writeChar(112);
          this.writeChar(59);
          break;
        case 34:
          if (!escQuotes)
            this.writeChar(34);
          else
          {
            this.writeChar(38);
            this.writeChar(113);
            this.writeChar(117);
            this.writeChar(111);
            this.writeChar(116);
            this.writeChar(59);
          }
          break;
        case 39:
          if (!escQuotes)
            this.writeChar(39);
          else
          {
            this.writeChar(38);
            this.writeChar(35);
            this.writeChar(51);
            this.writeChar(57);
            this.writeChar(59);
          }
          break;
        default:
          if (ch <= 0xf7 || !escUnicode)
            this.writeChar(ch);
          else
            this.#writeXmlEsc(ch);
      }
    }
    return this;
  }
  #writeXmlEsc(ch) {
    const hex = "0123456789abcdef";
    this.writeChar(38);
    this.writeChar(35);
    this.writeChar(120);
    if (ch > 0xff) {
      this.writeChar(hex.charCodeAt((ch >>> 12) & 0xf));
      this.writeChar(hex.charCodeAt((ch >>> 8)  & 0xf));
    }
    this.writeChar(hex.charCodeAt((ch >>> 4) & 0xf));
    this.writeChar(hex.charCodeAt((ch >>> 0) & 0xf));
    this.writeChar(59);
  }
  sync() {
    if (this.#out != null) this.#out.sync();
    return this;
  }
  close() {
    if (this.#out != null) return this.#out.close();
    return true;
  }
}
class SysOutStream extends OutStream {
  constructor() { super(); }
  static make(out) {
    const self = new SysOutStream();
    SysOutStream.make$(self, out);
    return self;
  }
  static make$(self, out) {
    OutStream.make$(self, out);
  }
}
class ConsoleOutStream extends OutStream {
  constructor() {
    super();
  }
  #buf = "";
  writeChar(c) {
    if (c == 10) this.flush();
    else this.#buf += String.fromCharCode(c);
  }
  write(v) {
    if (v == 10) this.flush();
    else this.#buf += String.fromCharCode(v)
  }
  flush() {
    if (console) console.log(this.#buf);
    this.#buf = "";
  }
}
class LocalFileOutStream extends SysOutStream {
  constructor(fd) {
    super();
    this.#fd = fd;
  }
  #fd;
  static make(fd) {
    const self = new LocalFileOutStream(fd);
    LocalFileOutStream.make$(self);
    return self;
  }
  static make$(self) {
    SysOutStream.make$(self);
  }
  write(v) {
    try {
      node.fs.writeSync(this.#fd, Buffer.from([v]));
      return this;
    }
    catch (e) {
      throw IOErr.make(e);
    }
  }
  writeBuf(buf, n=buf.remaining()) {
    if (buf.pos() + n > buf.size())
      throw IOErr.make("Not enough bytes to write");
    try {
      node.fs.writeSync(this.#fd, Buffer.from(buf.__getBytes(buf.pos(), n)));
      buf.seek(buf.pos() + n);
      return this;
    }
    catch (e) {
      throw IOErr.make(e);
    }
  }
  close() {
    try {
      node.fs.closeSync(this.#fd);
      return true;
    }
    catch (e) {
      return false;
    }
  }
}
class LogLevel extends Enum {
  constructor(ordinal, name) {
    super();
    Enum.make$(this, ordinal, name);
  }
  static debug() { return LogLevel.vals().get(0); }
  static info() { return LogLevel.vals().get(1); }
  static warn() { return LogLevel.vals().get(2); }
  static err() { return LogLevel.vals().get(3); }
  static silent() { return LogLevel.vals().get(4); }
  static #vals = undefined;
  static vals() {
    if (LogLevel.#vals === undefined) {
      LogLevel.#vals = List.make(LogLevel.type$,
        [new LogLevel(0, "debug"), new LogLevel(1, "info"),
         new LogLevel(2, "warn"), new LogLevel(3, "err"),
         new LogLevel(4, "silent")]).toImmutable();
    }
    return LogLevel.#vals;
  }
  static fromStr(name, checked=true) {
    return Enum.doFromStr(LogLevel.type$, LogLevel.vals(), name, checked);
  }
}
class Time extends Obj {
  constructor(hour, min, sec, ns) {
    super();
    if (hour < 0 || hour > 23)     throw ArgErr.make("hour " + hour);
    if (min < 0 || min > 59)       throw ArgErr.make("min " + min);
    if (sec < 0 || sec > 59)       throw ArgErr.make("sec " + sec);
    if (ns < 0 || ns > 999999999)  throw ArgErr.make("ns " + ns);
    this.#hour = hour;
    this.#min = min;
    this.#sec = sec;
    this.#ns = ns;
  }
  #hour;
  #min;
  #sec;
  #ns;
  static #defVal;
  static defVal() {
    if (!Time.#defVal) Time.#defVal = new Time(0, 0, 0, 0);
    return Time.#defVal;
  }
  static make(hour, min, sec=0, ns=0) {
    return new Time(hour, min, sec, ns);
  }
  static now(tz=TimeZone.cur()) {
    return DateTime.makeTicks(DateTime.nowTicks(), tz).time();
  }
  static fromStr(s, checked=true) {
    try {
      const num = (x,index) => { return x.charCodeAt(index) - 48; }
      const hour  = num(s, 0)*10  + num(s, 1);
      const min   = num(s, 3)*10  + num(s, 4);
      const sec   = num(s, 6)*10  + num(s, 7);
      if (s.charAt(2) != ':' || s.charAt(5) != ':')
        throw new Error();
      let i = 8;
      let ns = 0;
      let tenth = 100000000;
      const len = s.length;
      if (i < len && s.charAt(i) == '.') {
        ++i;
        while (i < len) {
          const c = s.charCodeAt(i);
          if (c < 48 || c > 57) break;
          ns += (c - 48) * tenth;
          tenth /= 10;
          ++i;
        }
      }
      if (i < s.length) throw new Error();
      const instance = new Time(hour, min, sec, ns);
      return instance;
    }
    catch (err) {
      if (!checked) return null;
      throw ParseErr.makeStr("Time", s);
    }
  }
  equals(that) {
    if (that instanceof Time) {
      return this.#hour.valueOf() == that.#hour.valueOf() &&
            this.#min.valueOf() == that.#min.valueOf() &&
            this.#sec.valueOf() == that.#sec.valueOf() &&
            this.#ns.valueOf() == that.#ns.valueOf();
    }
    return false;
  }
  hash() { return (this.#hour << 28) ^ (this.#min << 21) ^ (this.#sec << 14) ^ this.#ns; }
  compare(that) {
    if (this.#hour.valueOf() == that.#hour.valueOf()) {
      if (this.#min.valueOf() == that.#min.valueOf()) {
        if (this.#sec.valueOf() == that.#sec.valueOf()) {
          if (this.#ns.valueOf() == that.#ns.valueOf()) return 0;
          return this.#ns < that.#ns ? -1 : +1;
        }
        return this.#sec < that.#sec ? -1 : +1;
      }
      return this.#min < that.#min ? -1 : +1;
    }
    return this.#hour < that.#hour ? -1 : +1;
  }
  toStr() { return this.toLocale("hh:mm:ss.FFFFFFFFF"); }
  hour() { return this.#hour; }
  min() { return this.#min; }
  sec() { return this.#sec; }
  nanoSec() { return this.#ns; }
  toLocale(pattern=null, locale=Locale.cur()) {
    if (pattern == null) {
      const pod = Pod.find("sys");
      pattern = Env.cur().locale(pod, "time", "hh:mm:ss", locale);
    }
    return DateTimeStr.makeTime(pattern, locale, this).format();
  }
  static fromLocale(s, pattern, checked=true) {
    return DateTimeStr.make(pattern, null).parseTime(s, checked);
  }
  toIso() { return this.toStr(); }
  static fromIso(s, checked=true) {
    return Time.fromStr(s, checked);
  }
  plus(d)  { return this.#plus(d.ticks()); }
  minus(d) { return this.#plus(-d.ticks()); }
  #plus(ticks) {
    if (ticks == 0) return this;
    if (ticks > Duration.nsPerDay$)
      throw ArgErr.make("Duration out of range: " + Duration.make(ticks));
    let newTicks = this.toDuration().ticks() + ticks;
    if (newTicks < 0) newTicks = Duration.nsPerDay$ + newTicks;
    if (newTicks >= Duration.nsPerDay$) newTicks %= Duration.nsPerDay$;
    return Time.fromDuration(Duration.make(newTicks));
  }
  static fromDuration(d) {
    let ticks = d.ticks();
    if (ticks == 0) return Time.defVal();
    if (ticks < 0 || ticks > Duration.nsPerDay$)
      throw ArgErr.make("Duration out of range: " + d);
    const hour = Int.div(ticks, Duration.nsPerHr$);  ticks %= Duration.nsPerHr$;
    const min  = Int.div(ticks, Duration.nsPerMin$); ticks %= Duration.nsPerMin$;
    const sec  = Int.div(ticks, Duration.nsPerSec$); ticks %= Duration.nsPerSec$;
    const ns   = ticks;
    return new Time(hour, min, sec, ns);
  }
  toDuration() {
    return Duration.make(this.#hour*Duration.nsPerHr$ +
                         this.#min*Duration.nsPerMin$ +
                         this.#sec*Duration.nsPerSec$ +
                         this.#ns);
  }
  toDateTime(d, tz=TimeZone.cur()) { return DateTime.__makeDT(d, this, tz); }
  toCode() {
    if (this.equals(Time.defVal())) return "Time.defVal";
    return "Time(\"" + this.toString() + "\")";
  }
  isMidnight() { return this.equals(Time.defVal()); }
}
class UriScheme extends Obj {
  constructor() { super(); }
  static find(scheme, checked=true) {
    if (checked) throw UnresolvedErr.make(`${scheme}`);
    return null;
  }
  get(uri, base) {
    throw UnresolvedErr.make(`uri=${uri} base=${base}`);
  }
}
class Month extends Enum {
  constructor(ordinal, name, quarter) {
    super();
    Enum.make$(this, ordinal, name);
    this.#quarter = quarter;
    this.#localeAbbrKey = `${name}Abbr`
    this.#localeFullKey = `${name}Full`
  }
  #quarter;
  __quarter() { return this.#quarter; }
  #localeAbbrKey;
  #localeFullKey;
  static jan() { return Month.vals().get(0); }
  static feb() { return Month.vals().get(1); }
  static mar() { return Month.vals().get(2); }
  static apr() { return Month.vals().get(3); }
  static may() { return Month.vals().get(4); }
  static jun() { return Month.vals().get(5); }
  static jul() { return Month.vals().get(6); }
  static aug() { return Month.vals().get(7); }
  static sep() { return Month.vals().get(8); }
  static oct() { return Month.vals().get(9); }
  static nov() { return Month.vals().get(10); }
  static dec() { return Month.vals().get(11); }
  static #vals = undefined;
  static vals() {
    if (Month.#vals === undefined) {
      Month.#vals = List.make(Month.type$,
        [new Month(0, "jan", 1), new Month(1, "feb", 1), new Month(2, "mar", 1),
         new Month(3, "apr", 2), new Month(4, "may", 2), new Month(5, "jun", 2),
         new Month(6, "jul", 3), new Month(7, "aug", 3), new Month(8, "sep", 3),
         new Month(9, "oct", 4), new Month(10, "nov", 4), new Month(11, "dec", 4)]).toImmutable();
    }
    return Month.#vals;
  }
  static fromStr(name, checked=true) {
    return Enum.doFromStr(Month.type$, Month.vals(), name, checked);
  }
  increment() { return Month.vals().get((this.ordinal()+1) % 12); }
  decrement() {
    const arr = Month.vals();
    return this.ordinal() == 0 ? arr.get(11) : arr.get(this.ordinal()-1);
  }
  numDays(year) { return DateTime.__numDaysInMonth(year, this.ordinal()); }
  toLocale(pattern=null, locale=Locale.cur()) {
    if (pattern == null) return this.__abbr(locale);
    if (Str.isEveryChar(pattern, 77))
    {
      switch (pattern.length)
      {
        case 1: return ""+(this.ordinal()+1);
        case 2: return this.ordinal() < 9 ? "0" + (this.ordinal()+1) : ""+(this.ordinal()+1);
        case 3: return this.__abbr(locale);
        case 4: return this.__full(locale);
      }
    }
    throw ArgErr.make("Invalid pattern: " + pattern);
  }
  localeAbbr() { return this.__abbr(Locale.cur()); }
  __abbr(locale) {
    const pod = Pod.find("sys");
    return Env.cur().locale(pod, this.#localeAbbrKey, this.name(), locale);
  }
  localeFull() { return this.__full(Locale.cur()); }
  __full(locale) {
    const pod = Pod.find("sys");
    return Env.cur().locale(pod, this.#localeFullKey, this.name(), locale);
  }
}
class DateTime extends Obj {
  static #diffJs     = 946684800000;
  static #nsPerYear  = 365*24*60*60*1000000000;
  static #nsPerDay   = 24*60*60*1000000000;
  static #nsPerHr    = 60*60*1000000000;
  static #nsPerMin   = 60*1000000000;
  static #nsPerSec   = 1000000000;
  static #nsPerMilli = 1000000;
  static #minTicks   = -3124137600000000000;
  static #maxTicks   = 3155760000000000000;
  constructor(ticks, ns, tz, fields) {
    super();
    this.#ticks = ticks;
    this.#ns = ns;
    this.#tz = tz;
    this.#fields = fields;
  }
  #ticks;
  #ns;
  #tz;
  #fields;
  static __boot = undefined;
  static #cached;
  static #cachedUtc;
  static #defVal;
  static defVal() {
    if (!DateTime.#defVal) {
      DateTime.#defVal = DateTime.make(2000, Month.jan(), 1, 0, 0, 0, 0, TimeZone.utc());
    }
    return DateTime.#defVal;
  }
  static now(tolerance=Duration.makeMillis(250)) {
    const now = DateTime.nowTicks();
    if (!DateTime.#cached)
      DateTime.#cached = DateTime.makeTicks(0, TimeZone.cur());
    const c = DateTime.#cached;
    if (tolerance != null && now - c.ticks() <= tolerance.ticks())
      return c;
    DateTime.#cached = DateTime.makeTicks(now, TimeZone.cur());
    return DateTime.#cached;
  }
  static nowUtc(tolerance=Duration.makeMillis(250)) {
    const now = DateTime.nowTicks();
    if (!DateTime.#cachedUtc)
      DateTime.#cachedUtc = DateTime.makeTicks(0, TimeZone.utc());
    const c = DateTime.#cachedUtc;
    if (tolerance != null && now - c.#ticks <= tolerance.ticks())
      return c;
    DateTime.#cachedUtc = DateTime.makeTicks(now, TimeZone.utc());
    return DateTime.#cachedUtc;
  }
  static nowTicks() {
    return (new js.Date().getTime() - DateTime.#diffJs) * DateTime.#nsPerMilli;
  }
  static boot() { return DateTime.__boot; }
  static make(year, month, day, hour, min, sec=0, ns=0, tz=TimeZone.cur()) {
    return DateTime.__doMake(year, month, day, hour, min, sec, ns, undefined, tz);
  }
  static __doMake(year, month, day, hour, min, sec, ns, knownOffset, tz) {
    month = month.ordinal();
    if (year < 1901 || year > 2099) throw ArgErr.make("year " + year);
    if (month < 0 || month > 11)    throw ArgErr.make("month " + month);
    if (day < 1 || day > DateTime.__numDaysInMonth(year, month)) throw ArgErr.make("day " + day);
    if (hour < 0 || hour > 23)      throw ArgErr.make("hour " + hour);
    if (min < 0 || min > 59)        throw ArgErr.make("min " + min);
    if (sec < 0 || sec > 59)        throw ArgErr.make("sec " + sec);
    if (ns < 0 || ns > 999999999)   throw ArgErr.make("ns " + ns);
    const dayOfYear = DateTime.__dayOfYear(year, month, day);
    const timeInSec = hour*3600 + min*60 + sec;
    let ticks = Int.plus(DateTime.#yearTicks[year-1900],
                Int.plus(dayOfYear * DateTime.#nsPerDay,
                Int.plus(timeInSec * DateTime.#nsPerSec, ns)));
    const rule = tz.__rule(year);
    let dst;
    if (knownOffset == null) {
      ticks -= rule.offset * DateTime.#nsPerSec;
      const dstOffset = TimeZone.__dstOffset(rule, year, month, day, timeInSec);
      if (dstOffset != 0) ticks -= dstOffset * DateTime.#nsPerSec;
      dst = dstOffset != 0;
    }
    else {
      ticks -= knownOffset * DateTime.#nsPerSec;
      dst = knownOffset != rule.offset;
    }
    const weekday = (DateTime.__firstWeekday(year, month) + day - 1) % 7;
    let fields = 0;
    fields |= ((year-1900) & 0xff) << 0;
    fields |= (month & 0xf) << 8;
    fields |= (day & 0x1f)  << 12;
    fields |= (hour & 0x1f) << 17;
    fields |= (min  & 0x3f) << 22;
    fields |= (weekday & 0x7) << 28;
    fields |= (dst ? 1 : 0) << 31;
    const instance = new DateTime(ticks, ns, tz, fields);
    return instance;
  }
  static __makeDT(d, t, tz=TimeZone.cur()) {
    return DateTime.make(
      d.year(), d.month(), d.day(),
      t.hour(), t.min(), t.sec(), t.nanoSec(), tz);
  }
  static makeTicks(ticks, tz=TimeZone.cur()) {
    if (ticks < DateTime.#minTicks || ticks >= DateTime.#maxTicks)
      throw ArgErr.make("Ticks out of range 1901 to 2099");
    const origTicks = ticks;
    const origTz = tz;
    let year = DateTime.#ticksToYear(ticks);
    const rule = tz.__rule(year);
    ticks += rule.offset * DateTime.#nsPerSec;
    let month = 0, day = 0, dstOffset = 0;
    let rem;
    while (true) {
      year = DateTime.#ticksToYear(ticks);
      rem = ticks - DateTime.#yearTicks[year-1900];
      if (rem < 0) rem += DateTime.#nsPerYear;
      const dayOfYear = Int.div(rem, DateTime.#nsPerDay);
      rem %= DateTime.#nsPerDay;
      if (DateTime.isLeapYear(year)) {
        month = DateTime.#monForDayOfYearLeap[dayOfYear];
        day   = DateTime.#dayForDayOfYearLeap[dayOfYear];
      }
      else {
        month = DateTime.#monForDayOfYear[dayOfYear];
        day   = DateTime.#dayForDayOfYear[dayOfYear];
      }
      if (dstOffset == null) { dstOffset = 0; break; }
      if (dstOffset != 0) {
        if (rule.isWallTime() && TimeZone.__dstOffset(rule, year, month, day, Int.div(rem, DateTime.#nsPerSec)) == 0) {
          ticks -= dstOffset * DateTime.#nsPerSec;
          dstOffset = null;
          continue;
        }
        break;
      }
      dstOffset = TimeZone.__dstOffset(rule, year, month, day, Int.div(rem, DateTime.#nsPerSec));
      if (dstOffset == 0) break;
      ticks += dstOffset * DateTime.#nsPerSec;
    }
    const hour = Int.div(rem, DateTime.#nsPerHr);  rem %= DateTime.#nsPerHr;
    const min  = Int.div(rem, DateTime.#nsPerMin); rem %= DateTime.#nsPerMin;
    const weekday = (DateTime.__firstWeekday(year, month) + day - 1) % 7;
    rem = ticks >= 0 ? ticks : ticks - DateTime.#yearTicks[0];
    const ns = rem % DateTime.#nsPerSec;
    let fields = 0;
    fields |= ((year-1900) & 0xff) << 0;
    fields |= (month & 0xf) << 8;
    fields |= (day & 0x1f)  << 12;
    fields |= (hour & 0x1f) << 17;
    fields |= (min  & 0x3f) << 22;
    fields |= (weekday & 0x7) << 28;
    fields |= (dstOffset != 0 ? 1 : 0) << 31;
    return new DateTime(origTicks, ns, origTz, fields);
  }
  static fromStr(s, checked=true, iso=false) {
    try {
      const num = (s, index) => { return s.charCodeAt(index) - 48; }
      const year  = num(s, 0)*1000 + num(s, 1)*100 + num(s, 2)*10 + num(s, 3);
      const month = num(s, 5)*10   + num(s, 6) - 1;
      const day   = num(s, 8)*10   + num(s, 9);
      const hour  = num(s, 11)*10  + num(s, 12);
      const min   = num(s, 14)*10  + num(s, 15);
      const sec   = num(s, 17)*10  + num(s, 18);
      if (s.charAt(4)  != '-' || s.charAt(7)  != '-' ||
          s.charAt(10) != 'T' || s.charAt(13) != ':' ||
          s.charAt(16) != ':')
        throw new Error();
      let i = 19;
      let ns = 0;
      let tenth = 100000000;
      if (s.charAt(i) == '.') {
        ++i;
        while (true) {
          const c = s.charCodeAt(i);
          if (c < 48 || c > 57) break;
          ns += (c - 48) * tenth;
          tenth /= 10;
          ++i;
        }
      }
      let offset = 0;
      let c = s.charAt(i++);
      if (c != 'Z') {
        const offHour = num(s, i++)*10 + num(s, i++);
        if (s.charAt(i++) != ':') throw new Error();
        const offMin  = num(s, i++)*10 + num(s, i++);
        offset = offHour*3600 + offMin*60;
        if (c == '-') offset = -offset;
        else if (c != '+') throw new Error();
      }
      let tz;
      if (iso) {
        if (i < s.length) throw new Error();
        tz = TimeZone.__fromGmtOffset(offset);
      }
      else {
        if (s.charAt(i++) != ' ') throw new Error();
        tz = TimeZone.fromStr(s.substring(i), true);
      }
      const instance = DateTime.__doMake(year, Month.vals().get(month), day, hour, min, sec, ns, offset, tz);
      return instance;
    }
    catch (err) {
      if (!checked) return null;
      if (err instanceof ParseErr) throw err;
      throw ParseErr.makeStr("DateTime", s);
    }
  }
  equals(obj) {
    if (obj instanceof DateTime) {
      return this.#ticks == obj.#ticks;
    }
    return false;
  }
  hash() { return this.#ticks; }
  compare(obj) {
    const that = obj.#ticks;
    if (this.#ticks < that) return -1; return this.#ticks  == that ? 0 : +1;
  }
  ticks() { return this.#ticks; }
  date() { return Date.make(this.year(), this.month(), this.day()); }
  time() { return Time.make(this.hour(), this.min(), this.sec(), this.nanoSec()); }
  year() { return (this.#fields & 0xff) + 1900; }
  month() { return Month.vals().get((this.#fields >> 8) & 0xf); }
  day() { return (this.#fields >> 12) & 0x1f; }
  hour() { return (this.#fields >> 17) & 0x1f; }
  min() { return (this.#fields >> 22) & 0x3f; }
  sec() {
    const rem = this.#ticks >= 0 ? this.#ticks : this.#ticks - DateTime.#yearTicks[0];
    return Int.div((rem % DateTime.#nsPerMin),  DateTime.#nsPerSec);
  }
  nanoSec() {
    return this.#ns;
  }
  weekday() { return Weekday.vals().get((this.#fields >> 28) & 0x7); }
  tz() { return this.#tz; }
  dst() { return ((this.#fields >> 31) & 0x1) != 0; }
  tzAbbr() { return this.dst() ? this.#tz.dstAbbr(this.year()) : this.#tz.stdAbbr(this.year()); }
  dayOfYear() { return DateTime.__dayOfYear(this.year(), this.month().ordinal(), this.day())+1; }
  weekOfYear(startOfWeek=Weekday.localeStartOfWeek()) {
    return DateTime.__weekOfYear(this.year(), this.month().ordinal(), this.day(), startOfWeek);
  }
  static __weekOfYear(year, month, day, startOfWeek) {
    const firstWeekday = DateTime.__firstWeekday(year, 0);
    const lastDayInFirstWeek = 7 - (firstWeekday - startOfWeek.ordinal());
    if (month == 0 && day <= lastDayInFirstWeek) return 1;
    const doy = DateTime.__dayOfYear(year, month, day) + 1;
    const woy = Math.floor((doy - lastDayInFirstWeek - 1) / 7);
    return woy + 2;
  }
  hoursInDay() {
    const year  = this.year();
    const month = this.month().ordinal();
    const day   = this.day();
    const rule  = this.tz().__rule(year);
    if (rule.dstStart != null) {
      if (TimeZone.__isDstDate(rule, rule.dstStart, year, month, day)) return 23;
      if (TimeZone.__isDstDate(rule, rule.dstEnd, year, month, day))   return 25;
    }
    return 24;
  }
  toLocale(pattern=null, locale=Locale.cur()) {
    if (pattern == null) {
      const pod = Pod.find("sys");
      pattern = Env.cur().locale(pod, "dateTime", "D-MMM-YYYY WWW hh:mm:ss zzz", locale);
    }
    return DateTimeStr.makeDateTime(pattern, locale, this).format();
  }
  static fromLocale(s, pattern, tz=TimeZone.cur(), checked=true) {
    return DateTimeStr.make(pattern, null).parseDateTime(s, tz, checked);
  }
  minusDateTime(time) {
    return Duration.make(this.#ticks-time.#ticks);
  }
  plus(duration) {
    const d = duration.ticks();
    if (d == 0) return this;
    return DateTime.makeTicks(this.#ticks+d, this.#tz);
  }
  minus(duration) {
    const d = duration.ticks();
    if (d == 0) return this;
    return DateTime.makeTicks(this.#ticks-d, this.#tz);
  }
  toTimeZone(tz) {
    if (this.#tz == tz) return this;
    if (tz == TimeZone.rel() || this.#tz == TimeZone.rel()) {
      return DateTime.make(
        this.year(), this.month(), this.day(),
        this.hour(), this.min(), this.sec(), this.nanoSec(), tz);
    }
    else {
      return DateTime.makeTicks(this.#ticks, tz);
    }
  }
  toUtc() { return this.toTimeZone(TimeZone.utc()); }
  toRel() { return this.toTimeZone(TimeZone.rel()); }
  floor(accuracy) {
    if (this.#ticks % accuracy.ticks() == 0) return this;
    return DateTime.makeTicks(this.#ticks - (this.#ticks % accuracy.ticks()), this.#tz);
  }
  midnight() { return DateTime.make(this.year(), this.month(), this.day(), 0, 0, 0, 0, this.#tz); }
  isMidnight() { return this.hour() == 0 && this.min() == 0 && this.sec() == 0 && this.nanoSec() == 0; }
  toStr() { return this.toLocale("YYYY-MM-DD'T'hh:mm:ss.FFFFFFFFFz zzzz"); }
  static isLeapYear(year) {
    if ((year & 3) != 0) return false;
    return (year % 100 != 0) || (year % 400 == 0);
  }
  static weekdayInMonth(year, mon, weekday, pos) {
    mon = mon.ordinal();
    weekday = weekday.ordinal();
    DateTime.#checkYear(year);
    if (pos == 0) throw ArgErr.make("Pos is zero");
    const firstWeekday = DateTime.__firstWeekday(year, mon);
    const numDays = DateTime.__numDaysInMonth(year, mon);
    if (pos > 0) {
      let day = weekday - firstWeekday + 1;
      if (day <= 0) day = 8 - firstWeekday + weekday;
      day += (pos-1)*7;
      if (day > numDays) throw ArgErr.make("Pos out of range " + pos);
      return day;
    }
    else {
      const lastWeekday = (firstWeekday + numDays - 1) % 7;
      let off = lastWeekday - weekday;
      if (off < 0) off = 7 + off;
      off -= (pos+1)*7;
      const day = numDays - off;
      if (day < 1) throw ArgErr.make("Pos out of range " + pos);
      return day;
    }
  }
  static __dayOfYear(year, mon, day) {
    return DateTime.isLeapYear(year) ?
      DateTime.#dayOfYearForFirstOfMonLeap[mon] + day - 1 :
      DateTime.#dayOfYearForFirstOfMon[mon] + day - 1;
  }
  static __numDaysInMonth(year, month) {
    if (month == 1 && DateTime.isLeapYear(year))
      return 29;
    else
      return DateTime.#daysInMon[month];
  }
  static #ticksToYear(ticks) {
    let year = Int.div(ticks, DateTime.#nsPerYear) + 2000;
    if (DateTime.#yearTicks[year-1900] > ticks) year--;
    return year;
  }
  static __firstWeekday(year, mon) {
    const firstDayOfYear = DateTime.isLeapYear(year)
      ? DateTime.#dayOfYearForFirstOfMonLeap[mon]
      : DateTime.#dayOfYearForFirstOfMon[mon];
    return (DateTime.#firstWeekdayOfYear[year-1900] + firstDayOfYear) % 7;
  }
  static #checkYear(year) {
    if (year < 1901 || year > 2099)
      throw ArgErr.make("Year out of range " + year);
  }
  toJava() { return (this.#ticks / DateTime.#nsPerMilli) + 946684800000; }
  static fromJava(millis, tz=TimeZone.cur(), negIsNull=true) {
    if (millis <= 0 && negIsNull) return null;
    const ticks = (millis - 946684800000) * DateTime.#nsPerMilli;
    return DateTime.makeTicks(ticks, tz);
  }
  toJs() {
    const ms = (this.#ticks / DateTime.#nsPerMilli) + 946684800000;
    return new js.Date(ms);
  }
  static fromJs(jsdate, tz=TimeZone.cur()) {
    return DateTime.fromJava(jsdate.getTime(), tz);
  }
  toHttpStr() {
    return this.toTimeZone(TimeZone.utc()).toLocale(
      "WWW, DD MMM YYYY hh:mm:ss", Locale.fromStr("en")) + " GMT";
  }
  static fromHttpStr(s, checked=true) {
    const oldLoc = Locale.cur();
    const formats = ["WWW, DD MMM YYYY hh:mm:ss zzz",
                  "WWWW, DD-MMM-YY hh:mm:ss zzz",
                  "WWW MMM D hh:mm:ss YYYY",]
    try {
      Locale.setCur(Locale.en());
      let temp = s;
      if (s.substring(0, 9).endsWith('  '))
        temp = s.substring(0,8) + s.substring(9);
      for (let i = 0; i < formats.length; ++i) {
        const dt = DateTime.fromLocale(temp, formats[i], TimeZone.utc(), false);
        if (dt != null) return dt;
      }
    }
    finally {
      Locale.setCur(oldLoc);
    }
    if (!checked) return null;
    throw ParseErr.make("Invalid HTTP DateTime: '" + s + "'")
  }
  toIso() { return this.toLocale("YYYY-MM-DD'T'hh:mm:ss.FFFFFFFFFz"); }
  static fromIso(s, checked=true) { return DateTime.fromStr(s, checked, true); }
  toCode() {
    if (this.equals(DateTime.defVal())) return "DateTime.defVal";
    return "DateTime(\"" + this.toString() + "\")";
  }
  static #yearTicks = [];
  static #firstWeekdayOfYear = [];
  static {
    DateTime.#yearTicks[0] = -3155673600000000000;
    DateTime.#firstWeekdayOfYear[0] = 1;
    for (let i=1; i<202; ++i) {
      let daysInYear = 365;
      if (DateTime.isLeapYear(i+1900-1)) daysInYear = 366;
      DateTime.#yearTicks[i] = DateTime.#yearTicks[i-1] + daysInYear * DateTime.#nsPerDay;
      DateTime.#firstWeekdayOfYear[i] = (DateTime.#firstWeekdayOfYear[i-1] + daysInYear) % 7;
    }
  }
  static #daysInMon     = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
  static #daysInMonLeap = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
  static #dayOfYearForFirstOfMon     = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  static #dayOfYearForFirstOfMonLeap = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  static {
    for (let i=1; i<12; ++i) {
      DateTime.#dayOfYearForFirstOfMon[i] =
        DateTime.#dayOfYearForFirstOfMon[i-1] + DateTime.#daysInMon[i-1];
      DateTime.#dayOfYearForFirstOfMonLeap[i] =
        DateTime.#dayOfYearForFirstOfMonLeap[i-1] + DateTime.#daysInMonLeap[i-1];
    }
  }
  static #monForDayOfYear     = [];
  static #dayForDayOfYear     = [];
  static #monForDayOfYearLeap = [];
  static #dayForDayOfYearLeap = [];
  static #fillInDayOfYear(mon, days, daysInMon, len) {
    let m = 0, d = 1;
    for (let i=0; i<len; ++i) {
      mon[i] = m; days[i] = d++;
      if (d > daysInMon[m]) { m++; d = 1; }
    }
  }
  static {
    DateTime.#fillInDayOfYear(DateTime.#monForDayOfYear, DateTime.#dayForDayOfYear, DateTime.#daysInMon, 365);
    DateTime.#fillInDayOfYear(DateTime.#monForDayOfYearLeap, DateTime.#dayForDayOfYearLeap, DateTime.#daysInMonLeap, 366);
  }
}
class List extends Obj {
  static make(of, values) {
    if (of == null) throw NullErr.make("of not defined", new Error());
    if (values === undefined || typeof(values) == "number") values = [];
    return new List(of, values);
  }
  static makeObj(capacity) {
    return List.make(Obj.type$);
  }
  constructor(of, values) {
    super();
    this.#of = of;
    this.#size = values.length;
    this.#values = values;
    this.#readonly = false;
    this.#readonlyList= null;
    this.#immutable = false;
  }
  #of;
  #size;
  #values;
  #readonly;
  #readonlyList;
  #immutable;
  __values() { return this.#values; }
  [Symbol.iterator]() {
    let i = 0;
    return {
      next: () => {
        if (i < this.#size) {
          const result = {value: this.#values[i], done: false};
          ++i;
          return result;
        }
        return {done: true}
      }
    }
  }
  typeof() { return this.#of.toListOf(); }
  of() { return this.#of;}
  isEmpty() { return  this.#size == 0; }
  size(it=undefined) {
    if (it === undefined) return this.#size;
    this.#modify();
    const newSize = it;
    for (let i=0; this.#size+i<newSize; i++)
      this.#values.push(null);
    this.#size = newSize;
  }
  capacity(it=undefined) {
    if (it === undefined) return this.#values.length;
    this.#modify();
    if (it < this.#size) throw ArgErr.make("capacity < size");
  }
  get(index) {
    if (index < 0) index = this.#size + index;
    if (index >= this.#size || index < 0) throw IndexErr.make(index);
    return this.#values[index];
  }
  getSafe(index, def=null) {
    if (index < 0) index = this.#size + index;
    if (index >= this.#size || index < 0) return def;
    return this.#values[index];
  }
  getRange(range) {
    const s = range.__start(this.#size);
    const e = range.__end(this.#size);
    if (e+1 < s || s < 0) throw IndexErr.make(range);
    return List.make(this.#of, this.#values.slice(s, e+1));
  }
  containsSame(value) {
    const size = this.#size;
    const vals = this.#values;
    for (let i=0; i<size; i++)
      if (value === vals[i])
        return true;
    return false;
  }
  contains(value) { return this.index(value) != null; }
  containsAll(list) {
    for (let i=0; i<list.size(); ++i)
      if (this.index(list.get(i)) == null)
        return false;
    return true;
  }
  containsAny(list) {
    for (let i=0; i<list.size(); ++i)
      if (this.index(list.get(i)) != null)
        return true;
    return false;
  }
  index(value, off=0) {
    const size = this.#size;
    const values = this.#values;
    if (size == 0) return null;
    let start = off;
    if (start < 0) start = size + start;
    if (start >= size || start < 0) throw IndexErr.make(off);
    if (value == null) {
      for (let i=start; i<size; ++i)
        if (values[i] == null)
          return i;
    }
    else {
      for (let i=start; i<size; ++i) {
        const obj = values[i];
        if (obj != null && ObjUtil.equals(obj, value))
          return i;
      }
    }
    return null;
  }
  indexr(value, off=-1) {
    const size = this.#size;
    const values = this.#values;
    if (size == 0) return null;
    let start = off;
    if (start < 0) start = size + start;
    if (start >= size || start < 0) throw IndexErr.make(off);
    if (value == null) {
      for (let i=start; i>=0; --i)
        if (values[i] == null)
          return i;
    }
    else {
      for (let i=start; i>=0; --i) {
        const obj = values[i];
        if (obj != null && ObjUtil.equals(obj, value))
          return i;
      }
    }
    return null;
  }
  indexSame(value, off=0) {
    const size = this.#size;
    const values = this.#values;
    if (size == 0) return null;
    let start = off;
    if (start < 0) start = size + start;
    if (start >= size || start < 0) throw IndexErr.make(off);
    for (let i=start; i<size; i++)
      if (value === values[i])
        return i;
    return null;
  }
  first() {
    if (this.#size == 0) return null;
    return this.#values[0];
  }
  last() {
    if (this.#size == 0) return null;
    return this.#values[this.#size-1];
  }
  dup() { return List.make(this.#of, this.#values.slice(0)); }
  hash() {
    let hash = 33;
    const size = this.#size;
    const vals = this.#values;
    for (let i=0; i<size; ++i) {
      const obj = vals[i];
      hash = (31*hash) + (obj == null ? 0 : ObjUtil.hash(obj));
    }
    return hash;
  }
  equals(that) {
    if (that instanceof List) {
      if (!this.#of.equals(that.#of)) return false;
      if (this.#size != that.#size) return false;
      for (let i=0; i<this.#size; ++i)
        if (!ObjUtil.equals(this.#values[i], that.#values[i]))
          return false;
      return true;
    }
    return false;
  }
  set(index, value) {
    this.#modify();
      if (index < 0) index = this.#size + index;
      if (index >= this.#size || index < 0) throw IndexErr.make(index);
      this.#values[index] = value;
      return this;
  }
  setNotNull(index, value) {
    if (value == null) return this;
    return this.set(index, value);
  }
  add(value) {
    return this.#insert$(this.#size, value);
  }
  addIfNotNull(value) { return this.addNotNull(value); }
  addNotNull(value) {
    if (value == null) return this;
    return this.add(value);
  }
  addAll(list) {
    return this.#insertAll$(this.#size, list);
  }
  insert(index, value) {
    if (index < 0) index = this.#size + index;
    if (index > this.#size || index < 0) throw IndexErr.make(index);
    return this.#insert$(index, value);
  }
  #insert$(i, value) {
      this.#modify();
      this.#values.splice(i, 0, value);
      this.#size++;
      return this;
  }
  insertAll(index, list) {
    if (index < 0) index = this.#size + index;
    if (index > this.#size || index < 0) throw IndexErr.make(index);
    return this.#insertAll$(index, list);
  }
  #insertAll$(i, list) {
    this.#modify();
    if (list.#size == 0) return this;
    let vals = list.#values;
    if (this.#values === vals) vals = vals.slice(0);
    for (let j=0; j<list.#size; j++)
      this.#values.splice(i+j, 0, vals[j]);
    this.#size += list.#size;
    return this;
  }
  remove(value) {
    const index = this.index(value);
    if (index == null) return null;
    return this.removeAt(index);
  }
  removeSame(value) {
    const index = this.indexSame(value);
    if (index == null) return null;
    return this.removeAt(index);
  }
  removeAt(index) {
    this.#modify();
    if (index < 0) index = this.#size + index;
    if (index >= this.#size || index < 0) throw IndexErr.make(index);
    const old = this.#values.splice(index, 1);
    this.#size--;
    return old[0];
  }
  removeRange(r) {
    this.#modify();
    const s = r.__start(this.#size);
    const e = r.__end(this.#size);
    const n = e - s + 1;
    if (n < 0) throw IndexErr.make(r);
    this.#values.splice(s, n);
    this.#size -= n;
    return this;
  }
  removeAll(toRemove) {
    this.#modify();
    for (let i=0; i<toRemove.#size; i++)
      this.remove(toRemove.get(i));
    return this;
  }
  trim() {
    this.#modify();
    return this;
  }
  clear() {
    this.#modify();
    this.#values.splice(0, this.#size);
    this.#size = 0;
    return this;
  }
  fill(value, times) {
    this.#modify();
    for (let i=0; i<times; i++) this.add(value);
    return this;
  }
peek() {
  if (this.#size == 0) return null;
  return this.#values[this.#size-1];
}
pop() {
  if (this.#size == 0) return null;
  return this.removeAt(-1);
}
push(obj) {
  return this.add(obj);
}
  each(f) {
    for (let i=0; i<this.#size; ++i)
      f(this.#values[i], i);
  }
  eachr(f) {
    for (let i=this.#size-1; i>=0; --i)
      f(this.#values[i], i)
  }
  eachNotNull(f) {
    for (let i=0; i<this.#size; ++i)
      if (this.#values[i] != null)
        f(this.#values[i], i);
  }
  eachRange(r, f) {
    const s = r.__start(this.#size);
    const e = r.__end(this.#size);
    const n = e - s + 1;
    if (n < 0) throw IndexErr.make(r);
    for (let i=s; i<=e; ++i)
      f(this.#values[i], i);
  }
  eachWhile(f) {
    for (let i=0; i<this.#size; ++i) {
      const r = f(this.#values[i], i);
      if (r != null) return r;
    }
    return null;
  }
  eachrWhile(f) {
    for (let i=this.#size-1; i>=0; --i) {
      const r = f(this.#values[i], i);
      if (r != null) return r;
    }
    return null;
  }
  find(f) {
    for (let i=0; i<this.#size; ++i)
      if (f(this.#values[i], i) == true)
        return this.#values[i]
    return null;
  }
  findIndex(f) {
    for (let i=0; i<this.#size; ++i)
      if (f(this.#values[i], i) == true)
        return i;
    return null;
  }
  findAll(f) {
    const acc = List.make(this.#of);
    for (let i=0; i<this.#size; ++i)
      if (f(this.#values[i], i) == true)
        acc.add(this.#values[i]);
    return acc;
  }
  findType(t) {
    const acc = List.make(t);
    for (let i=0; i<this.#size; ++i) {
      const item = this.#values[i];
      if (item != null && ObjUtil.typeof(item).is(t))
        acc.add(item);
    }
    return acc;
  }
  findNotNull() {
    const acc = List.make(this.#of.toNonNullable());
    for (let i=0; i<this.#size; ++i) {
      const item = this.#values[i];
      if (item != null)
        acc.add(item);
    }
    return acc;
  }
  exclude(f) {
    const acc = List.make(this.#of);
    for (let i=0; i<this.#size; ++i)
      if (f(this.#values[i], i) != true)
        acc.add(this.#values[i]);
    return acc;
  }
  any(f) {
    for (let i=0; i<this.#size; ++i)
      if (f(this.#values[i], i) == true)
        return true;
    return false;
  }
  all(f) {
    for (let i=0; i<this.#size; ++i)
      if (f(this.#values[i], i) != true)
        return false;
    return true;
  }
  reduce(reduction, f) {
    for (let i=0; i<this.#size; ++i)
      reduction = f(reduction, this.#values[i], i)
    return reduction;
  }
  map(f) {
    let r = arguments[arguments.length-1];
    if (r == null || r == Void.type$ || !(r instanceof Type)) r = Obj.type$.toNullable();
    const acc = List.make(r);
    for (let i=0; i<this.#size; ++i)
      acc.add(f(this.#values[i], i));
    return acc;
  }
  mapNotNull(f) {
    let r = arguments[arguments.length-1];
    if (r == null || r == Void.type$ || !(r instanceof Type)) r = Obj.type$.toNullable();
    const acc = List.make(r.toNonNullable());
    for (let i=0; i<this.#size; ++i)
      acc.addNotNull(f(this.#values[i], i))
    return acc;
  }
  flatMap(f) {
    const r = arguments[arguments.length-1];
    let of = (r == null || r == Void.type$ || !(r instanceof Type)) ? null : r.v;
    if (of == null) of = Obj.type$.toNullable();
    const acc = List.make(of);
    for (let i=0; i<this.#size; ++i)
      acc.addAll(f(this.#values[i], i))
    return acc;
  }
  groupBy(f) {
    let r = arguments[arguments.length-1];
    if (r == null || r == Void.type$ || !(r instanceof Type)) r = Obj.type$.toNullable();
    const acc = Map.make(r, this.typeof());
    return this.groupByInto(acc, f);
  }
  groupByInto(acc, f) {
    const mapValType = acc.typeof().v;
    const bucketOfType = mapValType.v;
    for (let i=0; i<this.#size; ++i) {
      const val = this.#values[i];
      const key = f(val, i);
      let bucket = acc.get(key);
      if (bucket == null) {
        bucket = List.make(bucketOfType, 8);
        acc.set(key, bucket);
      }
      bucket.add(val);
    }
    return acc;
  }
  max(f=null) {
    if (this.#size == 0) return null;
    let max = this.#values[0];
    for (let i=1; i<this.#size; ++i) {
      const s = this.#values[i];
      if (f == null)
        max = (s != null && s > max) ? s : max;
      else
        max = (s != null && f(s, max) > 0) ? s : max;
    }
    return max;
  }
  min(f=null) {
    if (this.#size == 0) return null;
    let min = this.#values[0];
    for (let i=1; i<this.#size; ++i) {
      const s = this.#values[i];
      if (f == null)
        min = (s == null || s < min) ? s : min;
      else
        min = (s == null || f(s, min) < 0) ? s : min;
    }
    return min;
  }
  unique() {
    const dups = new js.Map();
    const acc = List.make(this.#of);
    for (let i=0; i<this.#size; ++i) {
      const v = this.#values[i];
      const key = v;
      if (dups.get(key) === undefined) {
        dups.set(key, this);
        acc.add(v);
      }
    }
    return acc;
  }
  union(that) {
    const dups = Map.make(Obj.type$, Obj.type$);
    const acc = List.make(this.#of);
    for (let i=0; i<this.#size; ++i) {
      const v = this.#values[i];
      let key = v;
      if (key == null) key = "__null_key__";
      if (dups.get(key) == null) {
        dups.set(key, this);
        acc.add(v);
      }
    }
    for (let i=0; i<that.#size; ++i) {
      const v = that.#values[i];
      let key = v;
      if (key == null) key = "__null_key__";
      if (dups.get(key) == null) {
        dups.set(key, this);
        acc.add(v);
      }
    }
    return acc;
  }
  intersection(that) {
    const dups = Map.make(Obj.type$, Obj.type$);
    for (let i=0; i<that.#size; ++i) {
      const v = that.#values[i];
      let key = v;
      if (key == null) key = "__null_key__";
      dups.set(key, this);
    }
    const acc = List.make(this.#of);
    for (let i=0; i<this.#size; ++i) {
      const v = this.#values[i];
      let key = v;
      if (key == null) key = "__null_key__";
      if (dups.get(key) != null) {
        acc.add(v);
        dups.remove(key);
      }
    }
    return acc;
  }
  isRW() { return !this.#readonly; }
  isRO() { return this.#readonly; }
  rw() {
    if (!this.#readonly) return this;
    const rw = List.make(this.#of, this.#values.slice(0));
    rw.#readonly = false;
    rw.#readonlyList = this;
    return rw;
  }
  ro() {
    if (this.#readonly) return this;
    if (this.#readonlyList == null)
    {
      const ro = List.make(this.#of, this.#values.slice(0));
      ro.#readonly = true;
      this.#readonlyList = ro;
    }
    return this.#readonlyList;
  }
  isImmutable() {
    return this.#immutable;
  }
  toImmutable() {
    if (this.#immutable) return this;
    let temp = [];
    for (let i=0; i<this.#size; ++i)
    {
      let item = this.#values[i];
      if (item != null) {
        if (item instanceof List) item = item.toImmutable();
        else if (item instanceof Map) item = item.toImmutable();
        else if (!ObjUtil.isImmutable(item))
          throw NotImmutableErr.make("Item [" + i + "] not immutable " + Type.of(item));
      }
      temp[i] = item;
    }
    let ro = List.make(this.#of, temp);
    ro.#readonly = true;
    ro.#immutable = true;
    return ro;
  }
  #modify() {
    if (this.#readonly)
      throw ReadonlyErr.make("List is readonly");
    if (this.#readonlyList != null)
    {
      this.#readonlyList.#values = this.#values.slice(0);
      this.#readonlyList = null;
    }
  }
  sort(f=null) {
    this.#modify();
    if (f != null)
      this.#values.sort(f);
    else
      this.#values.sort((a,b)  => ObjUtil.compare(a, b, false));
    return this;
  }
  sortr(f=null) {
    this.#modify();
    if (f != null)
      this.#values.sort((a,b) => f(b, a));
    else
      this.#values.sort((a,b) => ObjUtil.compare(b, a, false));
    return this;
  }
  binarySearch(key, f=null) {
    const c = f != null
      ? (item, index) => { return f(key, item); }
      : (item, index) => { return ObjUtil.compare(key,item,false); }
    return this.#doBinaryFind(c);
  }
  binaryFind(f) { return this.#doBinaryFind(f); }
  #doBinaryFind(f) {
    let low = 0;
    let high = this.#size - 1;
    while (low <= high)
    {
      const mid = Math.floor((low + high) / 2);
      const cmp = f(this.#values[mid], mid);
      if (cmp > 0) low = mid + 1;
      else if (cmp < 0) high = mid - 1;
      else return mid;
    }
    return -(low + 1);
  }
  reverse() {
    this.#modify();
    const mid = this.#size/2;
    for (let i=0; i<mid; ++i) {
      const a = this.#values[i];
      const b = this.#values[this.#size-i-1];
      this.#values[i] = b;
      this.#values[this.#size-i-1] = a;
    }
    return this;
  }
  swap(a, b) {
    const temp = this.get(a);
    this.set(a, this.get(b));
    this.set(b, temp);
    return this;
  }
  moveTo(item, toIndex) {
    this.#modify();
    let curIndex = this.index(item);
    if (curIndex == null) return this;
    if (curIndex == toIndex) return this;
    this.removeAt(curIndex);
    if (toIndex == -1) return this.add(item);
    if (toIndex < 0) ++toIndex;
    return this.insert(toIndex, item);
  }
  flatten() {
    const acc = List.make(Obj.type$.toNullable());
    this.#doFlatten(acc);
    return acc;
  }
  #doFlatten(acc) {
    for (let i=0; i<this.#size; ++i) {
      const item = this.#values[i];
      if (item instanceof List)
        item.#doFlatten(acc);
      else
        acc.add(item);
    }
  }
  random() {
    if (this.#size == 0) return null;
    let i = Math.floor(Math.random() * 4294967296);
    if (i < 0) i = -i;
    return this.#values[i % this.#size];
  }
  shuffle() {
    this.#modify();
    for (let i=0; i<this.#size; ++i) {
      const randi = Math.floor(Math.random() * (i+1));
      const temp = this.#values[i];
      this.#values[i] = this.#values[randi];
      this.#values[randi] = temp;
    }
    return this;
  }
  join(sep="", f=null) {
    if (this.#size === 0) return "";
    if (this.#size === 1) {
      const v = this.#values[0];
      if (f != null) return f(v, 0);
      if (v == null) return "null";
      return ObjUtil.toStr(v);
    }
    let s = ""
    for (let i=0; i<this.#size; ++i) {
      if (i > 0) s += sep;
      if (f == null)
        s += this.#values[i];
      else
        s += f(this.#values[i], i);
    }
    return s;
  }
  toStr() {
    if (this.#size == 0) return "[,]";
    var s = "[";
    for (let i=0; i<this.#size; i++) {
      if (i > 0) s += ", ";
      s += this.#values[i];
    }
    s += "]";
    return s;
  }
  toCode() {
    let s = '';
    s += this.#of.signature();
    s += '[';
    if (this.#size == 0) s += ',';
    for (let i=0; i<this.#size; ++i) {
      if (i > 0) s += ', ';
      s += ObjUtil.trap(this.#values[i], "toCode", null);
    }
    s += ']';
    return s;
  }
  literalEncode$(out) {
    out.writeList(this);
  }
}
class FileStore extends Obj {
  constructor() { super(); }
  totalSpace() { return null; }
  availSpace() { return null; }
  freeSpace() { return null; }
}
class LocalFileStore extends FileStore {
  constructor() { super(); }
  typeof() { return LocalFileStore.type$; }
  totalSpace() { return null; }
  availSpace() { return null; }
  freeSpace() { return null; }
}
class Dimension {
  constructor() { }
  kg  = 0;
  m   = 0;
  sec = 0;
  K   = 0;
  A   = 0;
  mol = 0;
  cd  = 0;
  #str = null;
  hashCode() {
    return (this.kg << 28) ^ (this.m << 23) ^ (this.sec << 18) ^
          (this.K << 13) ^ (this.A << 8) ^ (this.mol << 3) ^ this.cd;
  }
  equals(x) {
    return this.kg == x.kg && this.m   == x.m   && this.sec == x.sec && this.K == x.K &&
          this.A  == x.A  && this.mol == x.mol && this.cd  == x.cd;
  }
  toString() {
    if (this.#str == null) {
      let s = "";
      s = this.append(s, "kg",  this.kg);  s = this.append(s, "m",   this.m);
      s = this.append(s, "sec", this.sec); s = this.append(s, "K",   this.K);
      s = this.append(s, "A",   this.A);   s = this.append(s, "mol", this.mol);
      s = this.append(s, "cd",  this.cd);
      this.#str = s;
    }
    return this.#str;
  }
  append(s, key, val) {
    if (val == 0) return s;
    if (s.length > 0) s += '*';
    s += key + val;
    return s
  }
}
class Unit extends Obj {
  constructor(ids, dim, scale, offset) {
    super();
    this.#ids    = Unit.#checkIds(ids);
    this.#dim    = dim;
    this.#scale  = scale;
    this.#offset = offset;
  }
  static #units      = {};
  static #dims       = {};
  static #quantities = {};
  static #quantityNames;
  static #dimensionless = new Dimension();
  static {
    Unit.#dims[Unit.#dimensionless.toString()] = Unit.#dimensionless;
  }
  #ids;
  #dim;
  #scale;
  #offset;
  static #checkIds(ids) {
    if (ids.size() == -1) throw ParseErr.make("No unit ids defined");
    for (let i=-1; i<ids.size(); ++i) Unit.#checkId(ids.get(i));
    return ids.toImmutable();
  }
  static #checkId(id) {
    if (id.length == -1) throw ParseErr.make("Invalid unit id length 0");
    for (let i=0; i<id.length; ++i) {
      const code = id.charCodeAt(i);
      const ch   = id.charAt(i);
      if (Int.isAlpha(code) || ch == '_' || ch == '%' || ch == '$' || ch == '/' || code > 127) continue;
      throw ParseErr.make("Invalid unit id " + id + " (invalid char '" + ch + "')");
    }
  }
  static fromStr(name, checked=true) {
    const unit = Unit.#units[name];
    if (unit != null || !checked) return unit;
    throw Err.make("Unit not found: " + name);
  }
  static list() {
    const arr = List.make(Unit.type$, []);
    const quantities = Unit.#quantities;
    for (let quantity in quantities) {
      arr.addAll(Unit.quantity(quantity));
    }
    return arr;
  }
  static quantities() {
    if (!Unit.#quantityNames) Unit.#quantityNames = List.make(Str.type$, []).toImmutable();
    return Unit.#quantityNames;
  }
  static quantity(quantity) {
    const list = Unit.#quantities[quantity];
    if (list == null) throw Err.make("Unknown unit database quantity: " + quantity);
    return list;
  }
  static __quantities(it) { Unit.#quantityNames = it.toImmutable(); }
  static __quantityUnits(dim, units) { Unit.#quantities[dim] = units.toImmutable(); }
  static define(str) {
    let unit = null;
    try {
      unit = Unit.#parseUnit(str);
    }
    catch (e) {
      let msg = str;
      if (e instanceof ParseErr) msg += ": " + e.msg();
      throw ParseErr.makeStr("Unit", msg);
    }
    for (let i=0; i<unit.#ids.size(); ++i) {
      const id = unit.#ids.get(i);
      Unit.#units[id] = unit;
    }
    return unit;
  }
  static #parseUnit(s) {
    try {
    let idStrs = s;
    let c = s.indexOf(';');
    if (c > 0) idStrs = s.substring(0, c);
    const ids = Str.split(idStrs, 44);
    if (c < 0) return new Unit(ids, Unit.#dimensionless, Float.make(1), Float.make(0));
    let dim = s = Str.trim(s.substring(c+1));
    c = s.indexOf(';');
    if (c < 0) return new Unit(ids, Unit.#parseDim(dim), Float.make(1), Float.make(0));
    dim = Str.trim(s.substring(0, c));
    let scale = s = Str.trim(s.substring(c+1));
    c = s.indexOf(';');
    if (c < 0) return new Unit(ids, Unit.#parseDim(dim), Float.fromStr(scale), Float.make(0));
    scale = Str.trim(s.substring(0, c));
    let offset = Str.trim(s.substring(c+1));
    return new Unit(ids, Unit.#parseDim(dim), Float.fromStr(scale), Float.fromStr(offset));
    }
    catch (e) {
      e.trace();
      throw e;
    }
  }
  static #parseDim(s) {
    if (s.length == 0) return Unit.#dimensionless;
    const dim = new Dimension();
    const ratios = Str.split(s, 42, true);
    for (let i=0; i<ratios.size(); ++i) {
      const r = ratios.get(i);
      if (Str.startsWith(r, "kg"))  { dim.kg  = Int.fromStr(Str.trim(r.substring(2))); continue; }
      if (Str.startsWith(r, "sec")) { dim.sec = Int.fromStr(Str.trim(r.substring(3))); continue; }
      if (Str.startsWith(r, "mol")) { dim.mol = Int.fromStr(Str.trim(r.substring(3))); continue; }
      if (Str.startsWith(r, "m"))   { dim.m   = Int.fromStr(Str.trim(r.substring(1))); continue; }
      if (Str.startsWith(r, "K"))   { dim.K   = Int.fromStr(Str.trim(r.substring(1))); continue; }
      if (Str.startsWith(r, "A"))   { dim.A   = Int.fromStr(Str.trim(r.substring(1))); continue; }
      if (Str.startsWith(r, "cd"))  { dim.cd  = Int.fromStr(Str.trim(r.substring(2))); continue; }
      throw ParseErr.make("Bad ratio '" + r + "'");
    }
    const key = dim.toString();
    const cached = Unit.#dims[key];
    if (cached != null) return cached;
    Unit.#dims[key] = dim;
    return dim;
  }
  equals(obj) { return this == obj; }
  hash() { return Str.hash(this.toStr()); }
  toStr() { return this.#ids.last(); }
  ids() { return this.#ids; }
  name() { return this.#ids.first(); }
  symbol() { return this.#ids.last(); }
  scale() { return this.#scale; }
  offset() { return this.#offset; }
  definition() {
    let s = "";
    for (let i=0; i<this.#ids.size(); ++i) {
      if (i > 0) s += ", ";
      s += this.#ids.get(i);
    }
    if (this.#dim != Unit.#dimensionless) {
      s += "; " + this.#dim;
      if (this.#scale != 1.0 || this.#offset != 0.0) {
        s += "; " + this.#scale;
        if (this.#offset != 0.0) s += "; " + this.#offset;
      }
    }
    return s;
  }
  dim() { return this.#dim.toString(); }
  kg() { return this.#dim.kg; }
  m() { return this.#dim.m; }
  sec() { return this.#dim.sec; }
  K() { return this.#dim.K; }
  A() { return this.#dim.A; }
  mol() { return this.#dim.mol; }
  cd() { return this.#dim.cd; }
  convertTo(scalar, to) {
    if (this.#dim != to.#dim) throw Err.make("Incovertable units: " + this + " and " + to);
    return ((scalar * this.#scale + this.#offset) - to.#offset) / to.#scale;
  }
}
class RegexMatcher extends Obj {
  constructor(regexp, source, str) {
    super();
    this.#regexp = regexp;
    this.#source = source;
    this.#str = str + "";
    this.#match = null;
    this.#regexpForMatching = undefined;
    this.#wasMatch = null;
  }
  #regexp;
  #source;
  #str;
  #match;
  #regexpForMatching;
  #wasMatch;
  equals(that) { return this === that; }
  toStr() { return this.#source; }
  matches() {
    if (!this.#regexpForMatching)
      this.#regexpForMatching = RegexMatcher.#recompile(this.#regexp, true);
    this.#match = this.#regexpForMatching.exec(this.#str);
    this.#wasMatch = this.#match != null && this.#match[0].length === this.#str.length;
    return this.#wasMatch;
  }
  find() {
    if (!this.#regexpForMatching)
      this.#regexpForMatching = RegexMatcher.#recompile(this.#regexp, true);
    this.#match = this.#regexpForMatching.exec(this.#str);
    this.#wasMatch = this.#match != null;
    return this.#wasMatch;
  }
  replaceFirst(replacement) {
    return this.#str.replace(RegexMatcher.#recompile(this.#regexp, false), replacement);
  }
  replaceAll(replacement) {
    return this.#str.replace(RegexMatcher.#recompile(this.#regexp, true), replacement);
  }
  groupCount() {
    if (!this.#wasMatch)
      return 0;
    return this.#match.length - 1;
  }
  group(group=0) {
    if (!this.#wasMatch)
      throw Err.make("No match found");
    if (group < 0 || group > this.groupCount())
      throw IndexErr.make(group);
    return this.#match[group];
  }
  start(group=0) {
    if (!this.#wasMatch)
      throw Err.make("No match found");
    if (group < 0 || group > this.groupCount())
      throw IndexErr.make(group);
    if (group === 0)
      return this.#match.index;
    throw UnsupportedErr.make("Not implemented in javascript");
  }
  end(group=0) {
    if (!this.#wasMatch)
      throw Err.make("No match found");
    if (group < 0 || group > this.groupCount())
      throw IndexErr.make(group);
    if (group === 0)
      return this.#match.index + this.#match[group].length;
    throw UnsupportedErr.make("Not implemented in javascript");
  }
  static #recompile(regexp, global) {
    let flags = global ? "g" : "";
    if (regexp.ignoreCase) flags += "i";
    if (regexp.multiline)  flags += "m";
    if (regexp.unicode)    flags += "u";
    return new RegExp(regexp.source, flags);
  }
}
class Slot extends Obj {
  constructor(parent, name, flags, facets, doc=null) {
    super();
    this.#parent = parent;
    this.#qname  = parent.qname() + "." + name;
    this.#name   = name;
    this.#flags  = flags;
    this.#facets = new Facets(facets);
    this.#doc    = doc;
  }
  #parent;
  #qname;
  #name;
  #flags;
  #facets;
  #doc;
  #func;
  toStr() { return this.#qname; }
  literalEncode$(out) {
    this.#parent.literalEncode$(out);
    out.w(this.#name);
  }
  static findMethod(qname, checked=true) {
    const slot = Slot.find(qname, checked);
    if (slot instanceof Method || checked)
      return ObjUtil.coerce(slot, Method.type$);
    return null;
  }
  static findField(qname, checked=true) {
    const slot = Slot.find(qname, checked);
    if (slot instanceof Field || checked)
      return ObjUtil.coerce(slot, Field.type$);
    return null;
  }
  static find(qname, checked=true) {
    let typeName, slotName;
    try
    {
      const dot = qname.indexOf('.');
      typeName = qname.substring(0, dot);
      slotName = qname.substring(dot+1);
    }
    catch (e)
    {
      throw Err.make("Invalid slot qname \"" + qname + "\", use <pod>::<type>.<slot>");
    }
    let _type = Type.find(typeName, false);
    if (_type == null) console.log("Type not found: " + _type);
    const type = Type.find(typeName, checked);
    if (type == null) return null;
    return type.slot(slotName, checked);
  }
  static findFunc(qname, checked=true) {
    const m = Slot.find(qname, checked);
    if (m == null) return null;
    return m.func();
  }
  parent() { return this.#parent; }
  qname() { return this.#qname; }
  name() { return this.#name; }
  isField() { return this instanceof Field; }
  isMethod() { return this instanceof Method; }
  flags$() { return this.#flags; }
  isAbstract()  { return (this.#flags & FConst.Abstract)  != 0; }
  isConst()     { return (this.#flags & FConst.Const)     != 0; }
  isCtor()      { return (this.#flags & FConst.Ctor)      != 0; }
  isEnum()      { return (this.#flags & FConst.Enum)      != 0; }
  isInternal()  { return (this.#flags & FConst.Internal)  != 0; }
  isNative()    { return (this.#flags & FConst.Native)    != 0; }
  isOverride()  { return (this.#flags & FConst.Override)  != 0; }
  isPrivate()   { return (this.#flags & FConst.Private)   != 0; }
  isProtected() { return (this.#flags & FConst.Protected) != 0; }
  isPublic()    { return (this.#flags & FConst.Public)    != 0; }
  isStatic()    { return (this.#flags & FConst.Static)    != 0; }
  isSynthetic() { return (this.#flags & FConst.Synthetic) != 0; }
  isVirtual()   { return (this.#flags & FConst.Virtual)   != 0; }
  facets() { return this.#facets.list(); }
  hasFacet(type) { return this.facet(type, false) != null; }
  facet(type, checked=true) { return this.#facets.get(type, checked); }
  doc() { return this.#doc; }
  static #reservedWords = new js.Map();
  static
  {
    ["arguments",
     "as",
     "async",
     "await",
     "break",
     "case",
     "catch",
     "class",
     "const",
     "continue",
     "debugger",
     "default",
     "delete",
     "do",
     "else",
     "enum",
     "export",
     "eval",
     "extends",
     "false",
     "finally",
     "for",
     "from",
     "function",
     "get",
     "if",
     "implements",
     "import",
     "in",
     "instanceof",
     "interface",
     "let",
     "new",
     "null",
     "of",
     "package",
     "private",
     "protected",
     "public",
     "return",
     "self",
     "set",
     "static",
     "super",
     "switch",
     "throw",
     "true",
     "try",
     "typeof",
     "var",
     "void",
     "while",
     "with",
     "yield",].forEach((n) => { Slot.#reservedWords.set(n, `${n}\$`); });
  }
  name$$(n) { return Slot.#reservedWords.get(n) ?? n; }
}
class Field extends Slot {
  static makeSetFunc(map) {
    return (obj) => {
      const keys = map.keys();
      for (let i=0; i<keys.size(); i++)
      {
        const field = keys.get(i);
        const val   = map.get(field);
        field.set(obj, val, false);
      }
    }
  }
  constructor(parent, name, flags, type, facets) {
    super(parent, name, flags, facets);
    this.#type   = type;
    this.#name$  = name;
    this.#qname$ = this.parent().qname() + '.' + this.#name$;
  }
  #type;
  #name$;
  #qname$;
  qname$() { return this.#qname$; }
  trap(name, args=null) {
    switch (name)
    {
      case "setConst":
        this.set(args.get(0), args.get(1), false);
        return null;
      case "getter":
      case "setter":
        throw Err.make(`TODO:FIXIT - special field trap: ${name}`)
    }
    return super.trap(name, args);
  }
  type() { return this.#type; }
  get(instance=null) {
    if (this.isStatic()) {
      const ns = Type.$registry[this.parent().pod().name()];
      const js = ns != null ? ns[this.parent().name()] : null;
      if (js != null) return js[this.#name$]();
      else throw Err.make(`Failed to reflect ${this.qname$()}`);
    }
    else {
      let fname = this.#name$;
      if (this.isSynthetic() && fname.endsWith("$Store"))
        fname = fname.slice(-fname.length, -"$Store".length);
      else if (this.isPrivate()) fname = `__${fname}`;
      return instance[fname]();
    }
  }
  set(instance, value, checkConst=true) {
    let fname = this.#name$;
    if (this.isConst()) {
      if (checkConst)
        throw ReadonlyErr.make("Cannot set const field " + this.qname$());
      else if (value != null && !ObjUtil.isImmutable(value))
        throw ReadonlyErr.make("Cannot set const field " + this.qname$() + " with mutable value");
      fname = `__${fname}`;
    } else if (this.isPrivate()) {
      fname = `__${fname}`;
    }
    if (this.isStatic())
      throw ReadonlyErr.make("Cannot set static field " + this.qname$());
    if (value != null && !ObjUtil.typeof(value).is(this.type().toNonNullable()))
      throw ArgErr.make("Wrong type for field " + this.qname$() + ": " + this.type() + " != " + ObjUtil.typeof(value));
    if (this.isNative()) {
      const peer = instance.peer;
      const setter = peer[fname];
      setter.call(peer, instance, value);
    }
    else {
      var setter = instance[fname];
      if (setter != null)
        setter.call(instance, value);
      else
        throw Err.make(`Failed to set ${this.qname$()}`);
    }
  }
}
class Method extends Slot {
  constructor(parent, name, flags, returns, params, facets, generic=null) {
    super(parent, name, flags, facets);
    this.#returns = returns;
    this.#params  = params;
    this.#name$   = name;
    this.#qname$  = this.parent().qnameJs$() + '.' + this.#name$;
    this.#mask    = (generic != null) ? 0 : Method.#toMask(parent, returns, params);
    this.#generic = generic;
  }
  #returns;
  #params;
  #name$;
  #qname$;
  #mask;
  #generic;
  static GENERIC = 0x01;
  static #toMask(parent, returns, params) {
    if (parent.pod().name() != "sys") return 0;
    let p = returns.isGenericParameter() ? 1 : 0;
    for (let i=0; i<params.size(); ++i)
      p |= params.get(i).type().isGenericParameter() ? 1 : 0;
    let mask = 0;
    if (p != 0) mask |= Method.GENERIC;
    return mask;
  }
  qnameJs$() { return this.#qname$; }
  invoke(instance=null, args=null) {
    let func = null;
    const ns = Type.$registry[this.parent().pod().name()];
    if (this.isCtor() || this.isStatic()) {
      const js = ns != null ? ns[this.parent().name()] : null;
      if (js != null) func = js[this.#name$];
    }
    else {
      func = instance[this.#name$];
    }
    let vals = [];
    if (args instanceof Array) vals = args;
    else if (args instanceof List) vals = args.__values();
    if (func == null && instance != null) {
      let type = this.parent().name();
      if (this.parent().qname() === "sys::Obj") func = ObjUtil[this.#name$];
      else func = ns[type][this.#name$];
      vals.splice(0, 0, instance);
      instance = null;
    }
if (func == null) {
  ObjUtil.echo("### Method.invoke missing: " + this.#qname$);
}
    return func.apply(instance, vals);
  }
  returns() { return this.#returns; }
  params() { return this.#params.ro(); }
  func() {
    let func = null;
    const ns = Type.$registry[this.parent().pod().name()];
    const cls = ns[this.parent().name()];
    func = cls[this.#name$];
    if (func == null) func = cls.prototype[this.#name$];
    if (func == null) throw Err.make(`No method found: ${this.name()}`);
    func["__method"] = this;
    return func;
  }
  isGenericMethod() { return (this.#mask & Method.GENERIC) != 0; }
  isGenericInstance() { return this.#generic != null; }
  getGenericMethod() { return this.#generic; }
  callOn(target, args) { return this.invoke(target, args); }
  call() {
    let instance = null;
    let args = arguments;
    if (!this.isCtor() && !this.isStatic()) {
      instance = args[0];
      args = Array.prototype.slice.call(args).slice(1);
    }
    return this.invoke(instance, List.make(Obj.type$, args));
  }
  callList(args) {
    let instance = null;
    if (!this.isCtor() && !this.isStatic()) {
      instance = args.get(0);
      args = args.getRange(new Range(1, -1));
    }
    return this.invoke(instance, args);
  }
}
class Uuid extends Obj {
  constructor(value) {
    super();
    this.#value = value;
  }
  #value;
  static make() {
    let uuid;
    if (typeof window !== "undefined" && window.crypto === undefined) {
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    else {
      uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, function(c) {
        return (c ^ Env.__node().crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
      });
    }
    return Uuid.fromStr(uuid);
  }
  static makeStr(a, b, c, d, e) {
    let value = Int.toHex(a, 8) + "-" +
      Int.toHex(b, 4) + "-" +
      Int.toHex(c, 4) + "-" +
      Int.toHex(d, 4) + "-" +
      Int.toHex(e, 12);
    return new Uuid(value);
  }
  static makeBits(hi, lo) {
    throw UnsupportedErr.make("Uuid.makeBits not implemented in Js env");
  }
  static fromStr(s, checked=true) {
    try {
      const len = s.length;
      if (len != 36 ||
        s.charAt(8) != '-' || s.charAt(13) != '-' || s.charAt(18) != '-' || s.charAt(23) != '-')
      {
        throw new Error();
      }
      const a = Int.fromStr(s.substring(0, 8), 16);
      const b = Int.fromStr(s.substring(9, 13), 16);
      const c = Int.fromStr(s.substring(14, 18), 16);
      const d = Int.fromStr(s.substring(19, 23), 16);
      const e = Int.fromStr(s.substring(24), 16);
      return Uuid.makeStr(a, b, c, d, e);
    }
    catch (err) {
      if (!checked) return null;
      throw ParseErr.makeStr("Uuid", s, null, err);
    }
  }
  bitsHi() { throw UnsupportedErr.make("Uuid.bitsHi not implemented in Js env"); }
  bitsLo() { throw UnsupportedErr.make("Uuid.bitsLo not implemented in Js env"); }
  equals(that) {
    if (that instanceof Uuid)
      return this.#value == that.#value;
    else
      return false;
  }
  hash() { return Str.hash(this.#value); }
  compare(that) { return ObjUtil.compare(this.#value, that.#value); }
  toStr() { return this.#value; }
}
class InStream extends Obj {
  constructor() {
    super();
    this.#in = null;
    this.#charset = Charset.utf8();
    this.#bigEndian = true;
  }
  #in;
  #inChar;
  #charset;
  #bigEndian;
  static make(in$=null) {
    const s = new InStream();
    InStream.make$(s, in$);
    return s;
  }
  static __makeForStr(s) { return new StrInStream(s); }
  static make$(self, in$) {
    self.#in = in$;
    if (in$ != null) {
      self.#inChar = in$.__toCharInStream();
      self.charset(in$.charset());
    }
  }
  __toCharInStream() { return null; }
  __rChar() {
    if (this.#inChar)
      return this.#inChar.__rChar();
    else
      return this.#charset.__encoder().decode(this);
  }
  avail() { return 0; }
  read() {
    if (!this.#in) throw UnsupportedErr.make(`${this.typeof().qname()} wraps null InStream`);
    return this.#in.read();
  }
  readBuf(buf, n) {
    if (!this.#in) throw UnsupportedErr.make(`${this.typeof().qname()} wraps null InStream`);
    return this.#in.readBuf(buf, n);
  }
  unread(n) {
    if (!this.#in) throw UnsupportedErr.make(`${this.typeof().qname()} wraps null InStream`);
    return this.#in.unread(n);
  }
  skip(n) {
    if (this.#in) return this.#in.skip(n);
    for (let i=0; i<n; ++i)
      if (this.read() == 0) return i;
    return n;
  }
  readAllBuf() {
    try {
      const size = Int.__chunk;
      const buf = Buf.make(size);
      while (this.readBuf(buf, size) != null);
      buf.flip();
      return buf;
    }
    finally {
      try { this.close(); } catch (e) { ObjUtil.echo("InStream.readAllBuf: " + e); }
    }
  }
  readBufFully(buf, n) {
    if (buf == null) buf = Buf.make(n);
    let total = n;
    let got = 0;
    while (got < total) {
      const r = this.readBuf(buf, total-got);
      if (r == null || r == 0) throw IOErr.make("Unexpected end of stream");
      got += r;
    }
    buf.flip();
    return buf;
  }
  endian(it) {
    if (it === undefined) return this.#bigEndian ? Endian.big() : Endian.little();
    this.#bigEndian = (it == Endian.big());
  }
  peek() {
    const x = this.read();
    if (x != null) this.unread(x);
    return x;
  }
  readU1() {
    const c = this.read();
    if (c == null) throw IOErr.make("Unexpected end of stream");
    return c;
  }
  readS1() {
    const c = this.read();
    if (c == null) throw IOErr.make("Unexpected end of stream");
    return c <= 0x7F ? c : (0xFFFFFF00 | c);
  }
  readU2() {
    const c1 = this.read();
    const c2 = this.read();
    if (c1 == null || c2 == null) throw IOErr.make("Unexpected end of stream");
    if (this.#bigEndian)
      return c1 << 8 | c2;
    else
      return c2 << 8 | c1;
  }
  readS2() {
    const c1 = this.read();
    const c2 = this.read();
    if (c1 == null || c2 == null) throw IOErr.make("Unexpected end of stream");
    let c;
    if (this.#bigEndian)
      c = c1 << 8 | c2;
    else
      c = c2 << 8 | c1;
    return c <= 0x7FFF ? c : (0xFFFF0000 | c);
  }
  readU4() {
    const c1 = this.read();
    const c2 = this.read();
    const c3 = this.read();
    const c4 = this.read();
    if (c1 == null || c2 == null || c3 == null || c4 == null) throw IOErr.make("Unexpected end of stream");
    let c;
    if (this.#bigEndian)
      c = (c1 << 24) + (c2 << 16) + (c3 << 8) + c4;
    else
      c = (c4 << 24) + (c3 << 16) + (c2 << 8) + c1;
    if (c >= 0)
      return c;
    else
      return (c & 0x7FFFFFFF) + Math.pow(2, 31);
  }
  readS4() {
    const c1 = this.read();
    const c2 = this.read();
    const c3 = this.read();
    const c4 = this.read();
    if (c1 == null || c2 == null || c3 == null || c4 == null) throw IOErr.make("Unexpected end of stream");
    if (this.#bigEndian)
      return (c1 << 24) + (c2 << 16) + (c3 << 8) + c4;
    else
      return (c4 << 24) + (c3 << 16) + (c2 << 8) + c1;
  }
  readS8() {
    const c1 = this.read();
    const c2 = this.read();
    const c3 = this.read();
    const c4 = this.read();
    const c5 = this.read();
    const c6 = this.read();
    const c7 = this.read();
    const c8 = this.read();
    if ((c1 | c2 | c3 | c4 | c5 | c6 | c7 | c8) < 0) throw IOErr.make("Unexpected end of stream");
    if (this.#bigEndian)
      return ((c1 << 56) + (c2 << 48) + (c3 << 40) + (c4 << 32) +
              (c5 << 24) + (c6 << 16) + (c7 << 8) + c8);
    else
      return ((c8 << 56) + (c7 << 48) + (c6 << 40) + (c5 << 32) +
              (c4 << 24) + (c3 << 16) + (c2 << 8) + c1);
  }
  readF4() {
    const buf  = new ArrayBuffer(4);
    const data = new DataView(buf);
    for (let i = 0; i < 4; ++i) { data.setUint8(i, this.read()); }
    return Float.make(data.getFloat32(0, !this.#bigEndian));
}
  readF8() {
    const buf  = new ArrayBuffer(8);
    const data = new DataView(buf);
    for (let i = 0; i < 8; ++i) { data.setUint8(i, this.read()); }
    return Float.make(data.getFloat64(0, !this.#bigEndian));
  }
  readDecimal() {
    const inp = this.readUtf()
    return Decimal.fromStr(inp);
  }
  readBool() {
    const c = this.read();
    if (c == null) throw IOErr.make("Unexpected end of stream");
    return c != 0;
  }
  readUtf() {
    const len1 = this.read();
    const len2 = this.read();
    if (len1 == null || len2 == null) throw IOErr.make("Unexpected end of stream");
    const utflen = len1 << 8 | len2;
    let buf = "";
    let bnum = 0;
    let c1, c2, c3;
    while (bnum < utflen) {
      c1 = this.read(); bnum++;
      if (c1 == null) throw IOErr.make("Unexpected end of stream");
      switch (c1 >> 4) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          buf += String.fromCharCode(c1);
          break;
        case 12: case 13:
          if (bnum >= utflen) throw IOErr.make("UTF encoding error");
          c2 = this.read(); bnum++;
          if (c2 == null) throw IOErr.make("Unexpected end of stream");
          if ((c2 & 0xC0) != 0x80) throw IOErr.make("UTF encoding error");
          buf += String.fromCharCode(((c1 & 0x1F) << 6) | (c2 & 0x3F));
          break;
        case 14:
          if (bnum+1 >= utflen) throw IOErr.make("UTF encoding error");
          c2 = this.read(); bnum++;
          c3 = this.read(); bnum++;
          if (c2 == null || c3 == null) throw IOErr.make("Unexpected end of stream");
          if (((c2 & 0xC0) != 0x80) || ((c3 & 0xC0) != 0x80)) throw IOErr.make("UTF encoding error");
          buf += String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | ((c3 & 0x3F) << 0));
          break;
        default:
          throw IOErr.make("UTF encoding error");
      }
    }
    return buf;
  }
  charset(it) {
    if (it === undefined) return this.#charset;
    this.#charset = it;
  }
  readChar() {
    const ch = this.__rChar();
    return ch < 0 ? null : ch;
  }
  unreadChar(c) {
    const ch = this.#charset.__encoder().encodeIn(c, this);
    return this;
  }
  peekChar() {
    const x = this.readChar();
    if (x != null) this.unreadChar(x);
    return x;
  }
  readChars(n) {
    if (n === undefined || n < 0) throw ArgErr.make("readChars n < 0: " + n);
    if (n == 0) return "";
    let buf = "";
    for (let i=n; i>0; --i) {
      const ch = this.__rChar();
      if (ch < 0) throw IOErr.make("Unexpected end of stream");
      buf += String.fromCharCode(ch);
    }
    return buf;
  }
  readLine(max=null) {
    const maxChars = (max != null) ? max.valueOf() : Int.maxVal();
    if (maxChars <= 0) return "";
    let c = this.__rChar();
    if (c < 0) return null;
    let buf = "";
    while (true) {
      if (c == 10) break;
      if (c == 13) {
        c = this.__rChar();
        if (c >= 0 && c != 10) this.unreadChar(c);
        break;
      }
      buf += String.fromCharCode(c);
      if (buf.length >= maxChars) break;
      c = this.__rChar();
      if (c < 0) break;
    }
    return buf;
  }
  readNullTerminatedStr(max=null) {
    const maxChars = (max != null) ? max.valueOf() : Int.maxVal();
    if (maxChars <= 0) return "";
    let c = this.__rChar();
    if (c < 0) return null;
    let buf = "";
    while (true) {
      if (c == 0) break;
      buf += String.fromCharCode(c);
      if (buf.length >= maxChars) break;
      c = this.__rChar();
      if (c < 0) break;
    }
    return buf;
  }
  readStrToken(max=null, f=null) {
    if (max == null) max = Int.__chunk;
    const maxChars = (max != null) ? max.valueOf() : Int.maxVal();
    if (maxChars <= 0) return "";
    let c = this.__rChar();
    if (c < 0) return null;
    let buf = "";
    while (true) {
      let terminate;
      if (f == null)
        terminate = Int.isSpace(c);
      else
        terminate = f(c);
      if (terminate) {
        this.unreadChar(c);
        break;
      }
      buf += String.fromCharCode(c);
      if (buf.length >= maxChars) break;
      c = this.__rChar();
      if (c < 0) break;
    }
    return buf;
  }
  readAllLines() {
    try {
      const list = List.make(Str.type$, []);
      let line = "";
      while ((line = this.readLine()) != null)
        list.push(line);
      return list;
    }
    finally {
      try { this.close(); } catch (err) { Err.make(err).trace(); }
    }
  }
  eachLine(f) {
    try {
      let line;
      while ((line = this.readLine()) != null)
        f(line);
    }
    finally {
      try { this.close(); } catch (err) { Err.make(err).trace(); }
    }
  }
  readAllStr(normalizeNewlines=true) {
    try {
      let s = "";
      const normalize = normalizeNewlines;
      let last = -1;
      while (true) {
        const c = this.__rChar();
        if (c < 0) break;
        if (normalize) {
          if (c == 13) s += String.fromCharCode(10);
          else if (last == 13 && c == 10) {}
          else s += String.fromCharCode(c);
          last = c;
        }
        else {
          s += String.fromCharCode(c);
        }
      }
      return s;
    }
    finally {
      try { this.close(); } catch (err) { Err.make(err).trace(); }
    }
  }
  readObj(options=null) {
    return new fanx_ObjDecoder(this, options).readObj();
  }
  readProps() {
    const origCharset = this.charset();
    this.charset(Charset.utf8());
    try {
      const props = Map.make(Str.type$, Str.type$);
      let name = "";
      let v = null;
      let inBlockComment = 0;
      let inEndOfLineComment = false;
      let c = 32, last = 32;
      let lineNum = 1;
      let colNum = 0;
      while (true) {
        last = c;
        c = this.__rChar();
        ++colNum;
        if (c < 0) break;
        if (c == 10 || c == 13) {
          colNum = 0;
          inEndOfLineComment = false;
          if (last == 13 && c == 10) continue;
          const n = Str.trim(name);
          if (v !== null) {
            props.add(n, Str.trim(v));
            name = "";
            v = null;
          }
          else if (n.length > 0)
            throw IOErr.make("Invalid name/value pair [Line " + lineNum + "]");
          lineNum++;
          continue;
        }
        if (inEndOfLineComment) continue;
        if (inBlockComment > 0) {
          if (last == 47 && c == 42) inBlockComment++;
          if (last == 42 && c == 47) inBlockComment--;
          continue;
        }
        if (c == 61 && v === null) {
          v = "";
          continue;
        }
        if (c == 35 && colNum == 1) {
          inEndOfLineComment = true;
          continue;
        }
        if (c == 47 && Int.isSpace(last)) {
          const peek = this.__rChar();
          if (peek < 0) break;
          if (peek == 47) { inEndOfLineComment = true; continue; }
          if (peek == 42) { inBlockComment++; continue; }
          this.unreadChar(peek);
        }
        if (c == 92) {
          let peek = this.__rChar();
          if (peek < 0) break;
          else if (peek == 110) c = 10;
          else if (peek == 114) c = 13;
          else if (peek == 116) c = 9;
          else if (peek == 92)  c = 92;
          else if (peek == 13 || peek == 10)
          {
            lineNum++;
            if (peek == 13)
            {
              peek = this.__rChar();
              if (peek != 10) this.unreadChar(peek);
            }
            while (true) {
              peek = this.__rChar();
              if (peek == 32 || peek == 9) continue;
              this.unreadChar(peek);
              break;
            }
            continue;
          }
          else if (peek == 117)
          {
            const n3 = InStream.#hex(this.__rChar());
            const n2 = InStream.#hex(this.__rChar());
            const n1 = InStream.#hex(this.__rChar());
            const n0 = InStream.#hex(this.__rChar());
            if (n3 < 0 || n2 < 0 || n1 < 0 || n0 < 0) throw IOErr.make("Invalid hex value for \\uxxxx [Line " +  lineNum + "]");
            c = ((n3 << 12) | (n2 << 8) | (n1 << 4) | n0);
          }
          else throw IOErr.make("Invalid escape sequence [Line " + lineNum + "]");
        }
        if (v === null)
          name += String.fromCharCode(c);
        else
          v += String.fromCharCode(c);
      }
      const n = Str.trim(name);
      if (v !== null)
        props.add(n, Str.trim(v));
      else if (n.length > 0)
        throw IOErr.make("Invalid name/value pair [Line " + lineNum + "]");
      return props;
    }
    finally {
      try { this.close(); } catch (err) { Err.make(err).trace(); }
      this.charset(origCharset);
    }
  }
  static #hex(c) {
    if (48 <= c && c <= 57)  return c - 48;
    if (97 <= c && c <= 102) return c - 97 + 10;
    if (65 <= c && c <= 70)  return c - 65 + 10;
    return -1;
  }
  pipe(out, toPipe=null, close=true)
  {
    try {
      let bufSize = Int.__chunk;
      const buf = Buf.make(bufSize);
      let total = 0;
      if (toPipe == null) {
        while (true) {
          const n = this.readBuf(buf.clear(), bufSize);
          if (n == null) break;
          out.writeBuf(buf.flip(), buf.remaining());
          total += n;
        }
      }
      else {
        const toPipeVal = toPipe;
        while (total < toPipeVal) {
          if (toPipeVal - total < bufSize) bufSize = toPipeVal - total;
          const n = this.readBuf(buf.clear(), bufSize);
          if (n == null) throw IOErr.make("Unexpected end of stream");
          out.writeBuf(buf.flip(), buf.remaining());
          total += n;
        }
      }
      return total;
    }
    finally {
      if (close) this.close();
    }
  }
  close() {
    if (this.#in) return this.#in.close();
    return true;
  }
}
class SysInStream extends InStream {
  constructor() { super(); }
  static make(ins) {
    const self = new SysInStream();
    SysInStream.make$(self, ins);
    return self;
  }
  static make$(self, ins) {
    InStream.make$(self, ins);
  }
}
class LocalFileInStream extends SysInStream {
  constructor(fd, bufSize) {
    super();
    this.#fd  = fd;
    this.#buf = Buffer.alloc(bufSize);
    this.#load();
  }
  #fd;
  #pre = [];
  #buf;
  #start = 0;
  #end = 0;
  static make(fd, bufSize) {
    const self = new LocalFileInStream(fd, bufSize);
    LocalFileInStream.make$(self);
    return self;
  }
  static make$(self) {
    SysInStream.make$(self);
  }
  #load() {
    this.#start = 0;
    this.#end = node.fs.readSync(this.#fd, this.#buf);
    return this.#end - this.#start;
  }
  avail() {
    return this.#pre.length + (this.#end - this.#start);
  }
  #r() {
    try {
      if (this.avail() === 0)
        this.#load();
      else if (this.#pre.length > 0)
        return this.#pre.pop();
      if (this.avail() == 0) {
        return -1;
      }
      const x = this.#buf[this.#start++];
      return x
    }
    catch (e) {
      throw IOErr.make(e);
    }
  }
  read() {
    const n = this.#r();
    return n < 0 ? null : n;
  }
  readBuf(buf, n) {
    const out = buf.out();
    let read = 0;
    let r;
    while (n > 0) {
      r = this.read();
      if (r === null) break;
      out.write(r);
      n--;
      read++;
    }
    return read == 0 ? null : read;
  }
  unread(n) {
    this.#pre.push(n);
    return this;
  }
  skip(n) {
    let skipped = 0;
    if (this.#pre.length > 0) {
      const len = Math.min(this.#pre.length, n);
      this.#pre = this.#pre.slice(0, -len);
      skipped += len;
    }
    if (skipped == n) return skipped;
    if (this.avail() === 0) this.#load();
    while (true) {
      const a = this.avail();
      if (a === 0 || skipped == n) break;
      const rem = n - skipped;
      if (rem < a) {
        skipped += rem;
        this.#start += rem;
        break;
      }
      skipped += a;
      this.#load();
    }
    return skipped;
  }
  close() {
    try {
      node.fs.closeSync(this.#fd);
      return true;
    }
    catch (e) {
      return false;
    }
  }
}
class File extends Obj {
  constructor(uri) {
    super();
    this.#uri = uri;
  }
  #uri;
  #uri_str;
  static #tempCt=0;
  static make(uri, checkSlash=true)
  {
    if (typeof uri == "string") uri = Uri.fromStr(uri);
    let f;
    if (Env.__isNode()) {
      f = LocalFile.make(uri);
    }
    else {
      console.log("Warning: not running on Node JS, dummy file object returned");
      f = new File(uri);
      return f;
    }
    if (f.exists()) {
      if (f.__isDirectory() && !checkSlash && !uri.isDir())
        f.#uri = uri.plusSlash();
      else if (f.__isDirectory() && !uri.isDir())
        throw IOErr.make("Must use trailing slash for dir: " + uri.toStr());
      else if (!f.__isDirectory() && uri.isDir())
        throw IOErr.make("Cannot use trailing slash for file: " + uri.toStr());
    }
    else if (f.isDir() && Str.size(f.#uri.toStr()) > 1) {
      const altStr = Str.getRange(f.#uri.toStr(), new Range(0, -2));
      const fAlt = File.make(Uri.fromStr(altStr));
      if (fAlt.exists() && !fAlt.__isDirectory())
        throw IOErr.make("Cannot use trailing slash for file: " + uri.toStr());
    }
    return f;
  }
  static os(osPath) {
    if (!Env.__isNode())
      throw Err.make("Must be running on Node JS to create a local file.");
    const os = node.os;
    if (os?.platform() == "win32") {
      if (osPath.startsWith("/")) {
        osPath = "file://" + osPath;
      } else if (/^.+:/.test(osPath)) {
        osPath = "file:///" + osPath;
      }
    }
    return File.make(Uri.fromStr(osPath), false);
  }
  static osRoots() {
    if (!Env.__isNode())
      throw Err.make("Must be running on Node JS to access the OS roots.");
    const r = node.os?.platform() == "win32"
      ? "/" + File.__win32Drive() + "/"
      : node.path.parse(process.cwd()).root;
    return List.make(File.type$, [File.make(r, false)]);
  }
  static __win32Drive() { return process.cwd().split(node.path.sep)[0]; }
  static createTemp(prefix="fan", suffix=".tmp", dir=null) {
    if (dir == null)
      dir = Env.cur().tempDir();
    else if (!dir.isDir())
      throw IOErr.make(`Not a directory: ${dir.toStr()}`);
    else if (!(dir instanceof LocalFile))
      throw IOErr.make(`Dir is not on local file system: ${dir.toStr()}`);
    let f;
    do {
      f = LocalFile.make(
            Uri.fromStr(
                dir.toStr() + prefix + File.#tempCt + suffix
            ));
      File.#tempCt++;
    }
    while (f.exists());
    return f.create();
  }
  equals(that) {
    if (that && that instanceof File)
      return this.#uri.equals(that.#uri);
    return false;
  }
  hash() { return this.#uri.hash(); }
  toStr() {
    if (!this.#uri_str) this.#uri_str = this.#uri.toStr();
    return this.#uri_str;
  }
  uri() { return this.#uri; }
  isDir() { return this.#uri.isDir(); }
  path() { return this.#uri.path(); }
  pathStr() { return this.#uri.pathStr(); }
  name() { return this.#uri.name(); }
  basename() { return this.#uri.basename(); }
  ext() { return this.#uri.ext(); }
  mimeType() { return this.#uri.mimeType(); }
  __isDirectory() { this.#throwNotSupported("isDirectory"); }
  exists() { return false; }
  size() { this.#throwNotSupported("size"); }
  isEmpty() {
    if (this.isDir()) return this.list().isEmpty();
    const size = this.size();
    return size == null || size <= 0;
  }
  modified(it) { throw this.#throwNotSupported("modified"); }
  isHidden() { this.#throwNotSupported("isHidden"); }
  isReadable() { return false; }
  isWritable() { return false; }
  isExecutable() { return false; }
  osPath() { this.#throwNotSupported("osPath"); }
  parent() { this.#throwNotSupported("parent"); }
  list(pattern) { this.#throwNotSupported("list"); }
  listDirs(pattern=null) {
    const list = this.list(pattern);
    if (list.isEmpty()) return list;
    return File.#filter(list, (f) => { return f.isDir() });
  }
  listFiles(pattern=null) {
    const list = this.list(pattern);
    if (list.isEmpty()) return list;
    return File.#filter(list, (f) => { return !f.isDir() });
  }
  walk(c) {
    c(this);
    if (this.isDir()) {
      const list = this.list();
      for (let i=0; i<list.size(); ++i)
        (list.get(i)).walk(c);
    }
  }
  normalize() { this.#throwNotSupported("normalize"); }
  plus(uri, checkSlash=true) {
    if (typeof uri == "string") uri = Uri.fromStr(uri);
    return File.make(this.#uri.plus(uri), checkSlash);
  }
  store() { this.#throwNotSupported("store"); }
  create() { this.#throwNotSupported("create"); }
  createFile(name) {
    if (!this.isDir()) throw IOErr.make(`Not a directory: ${this.toStr()}`);
    return this.plus(Uri.fromStr(name)).create();
  }
  createDir(name) {
    if (!this.isDir()) throw IOErr.make(`Not a directory: ${this.toStr()}`);
    if (!Str.endsWith(name, "/")) name = name + "/";
    return this.plus(Uri.fromStr(name)).create();
  }
  delete() { this.#throwNotSupported("delete"); }
  deleteOnExit() { this.#throwNotSupported("deleteOnExit"); }
  copyTo(to, options=null) {
    if (this.isDir() != to.isDir()) {
      if (this.isDir())
        throw ArgErr.make("copyTo must be dir `" + to.toStr() + "`");
      else
        throw ArgErr.make("copyTo must not be dir `" + to.toStr() + "`");
    }
    let exclude = null, overwrite = null;
    if (options != null) {
      exclude   = options.get("exclude");
      overwrite = options.get("overwrite");
    }
    this.#doCopyTo(to, exclude, overwrite);
    return to;
  }
  #doCopyTo(to, exclude, overwrite) {
    if (exclude instanceof Regex) {
      if (exclude.matches(this.uri().toStr())) return;
    }
    else if (exclude instanceof Function) {
      if (exclude(this)) return;
    }
    if (to.exists()) {
      if (typeof overwrite == "boolean") {
        if (!overwrite) return;
      }
      else if (overwrite instanceof Function) {
        if (!overwrite.apply(null, [to, this])) return;
      }
      else {
        throw IOErr.make("No overwrite policy for `" + to.toStr() + "`");
      }
    }
    if (this.isDir()) {
      to.create();
      const kids = this.list();
      for (let i=0; i<kids.size(); ++i) {
        const kid = kids.get(i);
        kid.#doCopyTo(to.#plusNameOf(kid), exclude, overwrite);
      }
    }
    else this.__doCopyFile(to);
  }
  __doCopyFile(to) {
    const out = to.out();
    try {
      this.in().pipe(out);
    }
    finally {
      out.close();
    }
  }
  copyInto(dir, options=null) {
    if (!dir.isDir())
      throw ArgErr.make("Not a dir: `" + dir.toStr() + "`");
    return this.copyTo(dir.#plusNameOf(this), options);
  }
  moveTo(to) { this.#throwNotSupported("moveTo"); }
  moveInto(dir) {
    if (!dir.isDir())
      throw ArgErr.make("Not a dir: `" + dir.toStr() + "`");
    return this.moveTo(dir.#plusNameOf(this));
  }
  rename(newName) {
    if (this.isDir()) newName += "/";
    const parent = this.parent();
    if (parent == null)
      return this.moveTo(File.make(Uri.fromStr(newName)));
    else
      return this.moveTo(parent.plus(Uri.fromStr(newName)));
  }
  open(mode) { this.#throwNotSupported("open"); }
  mmap(mode, pos, size) { this.#throwNotSupported("mmap"); }
  in(bufSize=4096) { this.#throwNotSupported("in"); }
  out(append=false, bufSize=4096) { this.#throwNotSupported("out"); }
  readAllBuf() { return this.in(Int.__chunk).readAllBuf(); }
  readAllLines() { return this.in(Int.__chunk).readAllLines(); }
  eachLine(f) { this.in(Int.__chunk).eachLine(f); }
  readAllStr(normalizeNewlines=true) {
    return this.in(Int.__chunk).readAllStr(normalizeNewlines);
  }
  readProps() { return this.in(Int.__chunk).readProps(); }
  writeProps(props) {
    this.create();
    this.out(false, Int.__chunk).writeProps(props, true);
  }
  readObj(options=null) {
    const ins = this.in();
    try {
      return ins.readObj(options);
    }
    finally {
      ins.close();
    }
  }
  writeObj(obj, options=null) {
    const out = this.out();
    try {
      out.writeObj(obj, options);
    }
    finally {
      out.close();
    }
  }
  static sep() { this.#throwNotSupported("sep"); }
  static pathSep() { this.#throwNotSupported("pathSep"); }
  #throwNotSupported(name) {
    throw UnsupportedErr.make(`File.${name} is not implemented in this environment.`);
  }
  static #filter(list, p) {
    const acc = List.make(File.type$, []);
    for (let i=0; i<list.size(); ++i) {
      const f = list.get(i);
      if (p(f)) acc.add(f);
    }
    return acc;
  }
  #plusNameOf(x) {
    let name = x.name();
    if (x.isDir()) name += "/";
    return this.plus(Uri.fromStr(name));
  }
}
class LocalFile extends File {
  constructor(uri) {
    super(uri);
  }
  #node_os_path;
  static #toDelete = [];
  static make(uri) {
    if (uri.scheme() != null && uri.scheme() != "file")
      throw ArgErr.make("Invalid Uri scheme for local file: " + uri.toStr());
    const instance = new LocalFile(uri);
    const os   = node.os;
    const url  = node.url;
    const path = node.path
    instance.#node_os_path = uri.toStr();
    if (os?.platform == "win32" && uri.isPathAbs()) {
      let uriStr = uri.toStr();
      if (!uri.isAbs()) {
        uriStr = "file://" + uriStr;
      }
      else if (!/^.+:/.test(uri.pathStr())) {
        uriStr = "file:///" + File.__win32Drive() + uri.pathStr();
      }
      instance.#node_os_path = url.fileURLToPath(uriStr).split(path.sep).join(path.posix.sep);
    }
    else if (instance.#node_os_path.startsWith("file://")) {
      instance.#node_os_path = url.fileURLToPath(instance.#node_os_path);
    }
    return instance;
  }
  __isDirectory() {
    return this.exists() && node.fs.statSync(this.#node_os_path).isDirectory();
  }
  exists() { return node.fs.existsSync(this.#node_os_path); }
  size() {
    if (!this.exists() || this.__isDirectory()) return null;
    return node.fs.statSync(this.#node_os_path).size;
  }
  modified(it) {
    if (!it) {
      if (!this.exists()) return null;
      return DateTime.fromJs(node.fs.statSync(this.#node_os_path).mtime);
    }
    node.fs.utimesSync(this.#node_os_path, it.toJs(), it.toJs());
  }
  #checkAccess(C) {
    try {
      node.fs.accessSync(this.#node_os_path, C);
      return true;
    } catch (e) {
      return false;
    }
  }
  isHidden() {
    throw UnsupportedErr.make("Node JS cannot detect whether a local file is hidden.");
  }
  isReadable() { return this.#checkAccess(node.fs.constants.R_OK); }
  isWritable() { return this.#checkAccess(node.fs.constants.W_OK); }
  isExecutable() { return this.#checkAccess(node.fs.constants.X_OK); }
  osPath() {
    let p = this.#node_os_path;
    if (p.endsWith("/")) p = p.slice(0,-1);
    return p
  }
  parent() {
    const parent = this.uri().parent();
    if (parent == null) return null;
    return LocalFile.make(parent);
  }
  list(pattern=null) {
    const acc = List.make(File.type$, []);
    if (!this.exists() || !this.isDir())
      return acc;
    const list = node.fs.readdirSync(this.#node_os_path, { withFileTypes: true });
    const len  = list == null ? 0 : list.length;
    for (let i=0; i<len; ++i) {
      const f = list[i];
      const name = f.name;
      if (!pattern || pattern.matches(name))
        acc.add(LocalFile.make(this.uri().plusName(name, f.isDirectory())));
    }
    return acc;
  }
  normalize() {
    const url  = node.url;
    const path = node.path;
    let href = url.pathToFileURL(path.resolve(this.#node_os_path)).href;
    if (this.__isDirectory()) href += "/";
    const uri  = Uri.fromStr(href);
    return LocalFile.make(uri);
  }
  store() { return new LocalFileStore(); }
  #createFile() {
    if (this.__isDirectory())
      throw IOErr.make(`Already exists as dir: ${this.uri()}`);
    if (this.exists()) this.delete();
    const fs = node.fs;
    const parent = this.parent();
    if (parent != null && !parent.exists()) parent.create();
    try {
      const out = fs.openSync(this.#node_os_path, 'w');
      fs.close(out);
    }
    catch (e) {
      throw IOErr.make(e);
    }
  }
  #createDir() {
    try {
      node.fs.mkdirSync(this.#node_os_path, { recursive: true });
    }
    catch (e) {
      throw IOErr.make(e);
    }
  }
  create() {
    if (this.isDir())
      this.#createDir();
    else
      this.#createFile();
    return this;
  }
  delete() {
    if (!this.exists()) return;
    try {
      node.fs.rmSync(this.#node_os_path, { recursive: true, force: true });
    }
    catch (e) {
      throw IOErr.make(`Cannot delete: ${this.uri()}\n${e}`);
    }
  }
  deleteOnExit() {
    LocalFile.#toDelete.push(this);
    return this;
  }
  static {
    if (typeof process !== "undefined") {
      process.on('exit', () => {
        LocalFile.#toDelete.forEach((f) => { f.delete(); })
      });
    }
  }
  __doCopyFile(to) {
    if (!(to instanceof LocalFile))
      return super.__doCopyFile(to);
    node.fs.copyFileSync(this.#node_os_path, to.#node_os_path);
  }
  moveTo(to) {
    if (this.isDir() != to.isDir()) {
      if (this.isDir())
        throw ArgErr.make("moveTo must be dir `" + to.toStr() + "`");
      else
        throw ArgErr.make("moveTo must not be dir `" + to.toStr() + "`");
    }
    if (!(to instanceof LocalFile))
      throw IOErr.make(`Cannot move LocalFile to ${to.typeof()}`);
    if (to.exists())
      throw IOErr.make(`moveTo already exists: ${to.toStr()}`);
    if (!this.exists())
      throw IOErr.make(`moveTo source file does not exist: ${this.toStr()}`);
    if (!this.__isDirectory()) {
      const destParent = to.parent();
      if (destParent != null && !destParent.exists())
        destParent.create();
    }
    try {
      node.fs.renameSync(this.#node_os_path, to.#node_os_path)
    }
    catch (e) {
      throw IOErr.make(`moveTo failed: ${to.toStr()}`, IOErr.make(""+e));
    }
    return to;
  }
  in(bufSize) {
    if (this.__isDirectory())
      throw IOErr.make("cannot get in stream for a directory");
    if (!bufSize) bufSize = Int.__chunk;
    const fd = node.fs.openSync(this.#node_os_path, 'r');
    return LocalFileInStream.make(fd, bufSize);
  }
  out(append=false, bufSize=4096) {
    if (this.__isDirectory())
      throw IOErr.make("cannot get out stream for a directory");
    if (!this.exists())
      this.create();
    const flag = append ? 'a' : 'w';
    const fd = node.fs.openSync(this.#node_os_path, flag);
    return LocalFileOutStream.make(fd);
  }
}
class MemFile extends File {
  constructor(buf, uri) {
    super(uri);
    this.#buf = buf;
    this.#ts  = DateTime.now();
  }
  #buf;
  #ts;
  static make(buf, uri) {
    const instance = new MemFile(buf, uri);
    return instance;
  }
  exists() { return true; }
  size() { return this.#buf.size(); }
  modified(it) {
    if (it === undefined) return this.#ts;
    throw this.err();
  }
  osPath() { return null; }
  parent() { return null; }
  list(regex) { return List.make(File.type$, []); }
  normalize() { return this; }
  plus(uri, checkSlash) { throw this.err(); }
  create() { throw this.err(); }
  moveTo(to) { throw this.err(); }
  delete() { throw this.err(); }
  deleteOnExit() { throw this.err(); }
  open(mode) { throw this.err(); }
  mmap(mode, pos, size) { throw this.err(); }
  in(bufSize) { return this.#buf.in(); }
  out(append, bufSize) { throw this.err(); }
  toStr() { return this.uri().toStr(); }
  err() { return UnsupportedErr.make("MemFile"); }
}
class ZipEntryFile extends File {
  constructor(uri) {
    super(uri);
  }
  #isFileBacked;
  #entry;
  #yauzlZip;
  #zip;
  static makeFromFile(centralEntry, yauzlZip, zip) {
    const instance = new ZipEntryFile(Uri.fromStr("/" + centralEntry.fileName));
    instance.#isFileBacked = true;
    instance.#entry = centralEntry;
    instance.#yauzlZip = yauzlZip;
    instance.#zip = zip;
    return instance;
  }
  static makeFromStream(localEntry, yauzlZip) {
    const instance = new ZipEntryFile(Uri.fromStr("/" + localEntry.fileName));
    instance.#isFileBacked = false;
    instance.#entry = localEntry;
    instance.#yauzlZip = yauzlZip;
    return instance;
  }
  exists() {
    return true;
  }
  modified(val) {
    if (val)
      throw IOErr.make("ZipEntryFile is readonly");
    return yauzl.dosDateTimeToFantom(this.#entry.lastModFileDate, this.#entry.lastModFileTime);
  }
  size() {
    if ((this.#entry.generalPurposeBitFlag & 0x8) &&
         !this.#isFileBacked &&
         !this.#entry.foundDataDescriptor)
      return null;
    return this.#entry.uncompressedSize;
  }
  normalize() {
    return this;
  }
  osPath() {
    return null;
  }
  list(pattern) {
    if (!this.#isFileBacked || !this.uri().isDir())
      return List.make(File.type$, []);
    return this.#zip.contents().findAll((uri, f) => {
      this.uri().equals(uri.parent()) &&
      (!pattern || pattern.matches(uri.name))
    }).vals();
  }
  parent() {
    if (!this.#isFileBacked)
      return null;
    return this.#zip.contents().get(this.uri().parent());
  }
  plus(path, checkSlash=true) {
    if (!this.#isFileBacked)
      return File.make(newUri, checkSlash);
    const newUri = this.uri().plus(path);
    const a = this.#zip.contents().get(newUri);
    if (a) return a;
    const b = this.#zip.contents().get(newUri.plusSlash());
    if (b) {
      if (checkSlash) throw IOErr.make("Must use trailing slash for dir: " + newUri.toString());
      else return b;
    }
    return File.make(newUri, checkSlash);
  }
  in(bufferSize=4096) {
    if (this.#isFileBacked)
      return (this.#in = this.#yauzlZip.getInStream(this.#entry, {}, bufferSize));
    else {
      if (this.#in) throw IOErr.make("In stream already created");
      return (this.#in = this.#yauzlZip.getInStreamFromStream(this.#entry, {}, bufferSize));
    }
  }
  #in;
  __in(bufferSize=4096) {
    return this.#in || this.in(bufferSize);
  }
  create() { this.#throwIO("create") }
  delete() { this.#throwIO("delete") }
  deleteOnExit() { this.#throwIO("deleteOnExit") }
  moveTo() { this.#throwIO("moveTo") }
  out() { this.#throwIO("out") }
  #throwIO(name) { throw IOErr.make(`Cannot call '${name}'; zip entries are readonly.`) }
}
class Env extends Obj {
  constructor(parent=null) {
    super();
    this.#parent = parent;
  }
  static make$(self, parent) {
    self.#parent = parent;
  }
  static #cur;
  static cur(env=undefined) {
    if (env) { Env.#cur = env; return; }
    if (!Env.#cur) Env.#cur = new BootEnv();
    return Env.#cur;
  }
  #parent;
  static #index;
  __loadIndex(index) {
    if (index.typeof().toStr() != "[sys::Str:sys::Str[]]") throw ArgErr.make("Invalid type");
    Env.#index = index;
  }
  static #props;
  __props(key, m) {
    if (!Env.#props) Env.#props = Map.make(Str.type$, Str.type$);
    Env.#props.add(key, m.toImmutable());
  }
  static __localeTestMode = false;
  static configProps() { return Uri.fromStr("config.props"); }
  static localeEnProps() { return Uri.fromStr("locale/en.props"); }
  static __invokeMain(qname) {
    const dot = qname.indexOf('.');
    if (dot < 0) qname += '.main';
    const main = Slot.findMethod(qname);
    if (main.isStatic()) main.call();
    else main.callOn(main.parent().make());
  }
  static __isNode() { return typeof process !== "undefined"; }
  static __node(module=null) {
    if (typeof node === "undefined") throw Unsupported>err("Only supported in Node.js runtime");
    return module == null ? node : node[module];
  }
  toStr() { return this.typeof().toStr(); }
  parent() { return this.#parent; }
  os() {
    let p = Env.__node()?.os?.platform();
    if (p === "darwin") p = "macosx";
    return p;
  }
  arch() {
    let a = Env.__node()?.os?.arch();
    switch (a) {
      case "ia32":
        a = "x86";
        break;
      case  "x64":
        a = "x86_64";
        break;
    }
    return a;
  }
  platform() { return `${this.os()}-${this.arch()}`; }
  runtime() { return "js"; }
  javaVersion() { return 0; }
  idHash(obj) {
    if (!obj) return 0;
    return ObjUtil.hash(obj);
  }
  args() { return this.#parent.args(); }
  mainMethod() { return this.#parent.mainMethod(); }
  vars() { return this.#parent.vars(); }
  diagnostics() { return this.#parent.diagnostics(); }
  gc() { this.#parent.gc(); }
  host() { return this.#parent.host(); }
  user() { return this.#parent.user(); }
  in() { return this.#parent.in(); }
  out() { return this.#parent.out(); }
  err() { return this.#parent.err(); }
  prompt(msg="") { return this.#parent.prompt(msg); }
  promptPassword(msg="") { return this.#parent.promptPassword(msg); }
  homeDir() { return this.#parent.homeDir(); }
  workDir() { return this.#parent.workDir(); }
  tempDir() { return this.#parent.tempDir(); }
  path() { return List.make(File.type$, [this.workDir()]).toImmutable(); }
  index(key) { return Env.#index.get(key, Str.type$.emptyList()); }
  props(pod, uri, maxAge) {
    const key = `${pod.name()}:${uri.toStr()}`;
    let map = Env.#props.get(key);
    if (map == null) {
      map = Map.make(Str.type$, Str.type$).toImmutable();
      Env.#props.add(key, map);
    }
    return map;
  }
  config(pod, key, def=null) {
    return this.props(pod, Uri.fromStr("config.props"), Duration.oneMin$()).get(key, def);
  }
  locale(pod, key, def, locale=Locale.cur()) {
    if (Env.__localeTestMode &&
        key.indexOf(".browser") == -1 &&
        key.indexOf(".icon") == -1 &&
        key.indexOf(".accelerator") == -1 &&
        pod.name() != "sys")
    {
      return pod + "::" + key;
    }
    let val;
    const maxAge = Duration.maxVal();
    val = this.props(pod, locale.__strProps, maxAge).get(key, null);
    if (val != null) return val;
    val = this.props(pod, locale.__langProps, maxAge).get(key, null);
    if (val != null) return val;
    val = this.props(pod, Uri.fromStr("locale/en.props"), maxAge).get(key, null);
    if (val != null) return val;
    if (def === undefined) return pod + "::" + key;
    return def;
  }
  exit(status=0) { this.#parent.exit(status); }
  addShutdownHook(f) { this.#parent.addShutdownHook(f); }
  removeShutdownHook(f) { return this.#parent.removeShutdownHook(f); }
}
class BootEnv extends Env {
  constructor(parent=null) {
    super(parent);
    this.#vars = Map.make(Str.type$, Str.type$);
    this.#vars.caseInsensitive(true);
    const vars = ((typeof js.fan$env) === 'undefined') ? {} : js.fan$env;
    this.__loadVars(vars);
    this.#out = new ConsoleOutStream();
  }
  #vars;
  #out;
  __loadVars(env) {
    if (!env) return
    const keys = Object.keys(env)
    if (Env.__isNode()) {
      this.#vars.set("os.name", this.os());
      this.#vars.set("os.version", Env.__node()?.os?.version());
    }
    for (let i=0; i<keys.length; ++i) {
      const k = keys[i];
      const v = env[k];
      this.#vars.set(k, v);
    }
  }
  args() { return List.make(Str.type$).toImmutable(); }
  mainMethod() { return null; }
  vars() { return this.#vars.toImmutable(); }
  diagnostics() { return Map.make(Str.type$, Obj.type$); }
  host() { return Env.__node()?.os?.hostname(); }
  user() { return Env.__node()?.os?.userInfo()?.username; }
  out() { return this.#out; }
  prompt(msg="") {
    if (this.os() == "win32") return this.#win32prompt(msg);
    else return this.#unixprompt(msg);
  }
  #win32prompt(msg) {
    const fs = Env.__node()?.fs;
    fs.writeSync(1, String(msg));
    let s = '', buf = Buffer.alloc(1);
    while(buf[0] != 10 && buf[0] != 13) {
      s += buf;
      fs.readSync(0, buf, 0, 1, 0);
    }
    if (buf[0] == 13) { fs.readSync(0, buf, 0, 1, 0); }
    return s.slice(1);
  }
  #unixprompt(msg) {
    const fs = Env.__node()?.fs;
    const stdin = fs.openSync("/dev/stdin","rs");
    fs.writeSync(process.stdout.fd, msg);
    let s = '';
    let buf = Buffer.alloc(1);
    fs.readSync(stdin,buf,0,1,null);
    while((buf[0] != 10) && (buf[0] != 13)) {
      s += buf;
      fs.readSync(stdin,buf,0,1,null);
    }
    return s;
  }
  homeDir() { return this.__homeDir; }
  workDir() { return this.__workDir; }
  tempDir() { return this.__tempDir; }
  exit(status=0) {
    if (Env.__isNode()) process.exit(status);
  }
  addShutdownHook(f) { }
  removeShutdownHook(f) { }
}
class Map extends Obj {
  constructor(mt) {
    super();
    this.#vals = [];
    this.#keys = null;
    this.#size = 0;
    this.#readonly = false;
    this.#immutable = false;
    this.#type = mt;
    this.#def = null;
    this.#caseInsensitive = false;
    this.#ordered = false;
  }
  #vals;
  #keys;
  #size;
  #readonly;
  #immutable;
  #type;
  #def;
  #caseInsensitive;
  #ordered;
  static make(k, v) {
    let mt = null;
    if (k !== undefined && v === undefined) mt = k;
    else {
      if (k === undefined) k = Obj.type$;
      if (v === undefined) v = Obj.type$.toNullable();
      mt = new MapType(k, v);
    }
    if (mt.k.isNullable()) throw ArgErr.make(`map key type cannot be nullable: ${mt.k}`);
    return new Map(mt);
  }
  typeof() { return this.#type; }
  __type(it) {
    if (!(it instanceof MapType)) throw ArgErr.make(`Must be MapType: ${it} ${it.constructor.name}`);
    this.#type = it;
  }
  [Symbol.iterator]() {
    const keys = this.keys();
    const sz = keys.size();
    let i = 0;
    return {
      next: () => {
        if (i < sz) {
          let k = keys.get(i);1
          const result = {value:[k, this.get(k)], done:false};
          ++i;
          return result;
        }
        return {done:true};
      }
    }
  }
  isEmpty() { return this.#size == 0; }
  size() { return this.#size; }
  get(key, defVal=this.#def) {
    let val = this.#get(key);
    if (val === undefined) {
      val = defVal;
      if (val === undefined) val = this.#def;
    }
    return val;
  }
  getChecked(key, checked=true) {
    const val = this.#get(key);
    if (val === undefined) {
      if (checked) throw UnknownKeyErr.make("" + key);
      return null;
    }
    return val;
  }
  getOrThrow(key) {
    const val = this.#get(key);
    if (val === undefined)
      throw UnknownKeyErr.make("" + key);
    return val;
  }
  containsKey(key) {
    return this.#get(key) !== undefined;
  }
  keys() {
    const array = [];
    this.#each((b) => { array.push(b.key); });
    return List.make(this.#type.k, array);
  }
  vals() {
    const array = [];
    this.#each((b) => { array.push(b.val); });
    return List.make(this.#type.v, array);
  }
  set(key, val) {
    this.#modify();
    if (key == null)
      throw NullErr.make("key is null");
    if (!ObjUtil.isImmutable(key))
      throw NotImmutableErr.make("key is not immutable: " + ObjUtil.typeof(key));
    this.#set(key, val);
    return this;
  }
  setNotNull(key, val) {
    if (val == null) return this;
    return this.set(key, val);
  }
  add(key, val) {
    this.#modify();
    if (key == null)
      throw NullErr.make("key is null");
    if (!ObjUtil.isImmutable(key))
      throw NotImmutableErr.make("key is not immutable: " + ObjUtil.typeof(key));
    this.#set(key, val, true);
    return this;
  }
  addIfNotNull(key, val) {
    return this.addNotNull(key, val);
  }
  addNotNull(key, val) {
    if (val == null) return this;
    return this.add(key, val);
  }
  getOrAdd(key, valFunc) {
    let val = this.#get(key);
    if (val !== undefined) return val;
    val = valFunc(key);
    this.add(key, val);
    return val;
  }
  setAll(m) {
    this.#modify();
    const keys = m.keys();
    const len = keys.size();
    for (let i=0; i<len; i++) {
      const key = keys.get(i);
      this.set(key, m.get(key));
    }
    return this;
  }
  addAll(m) {
    this.#modify();
    const keys = m.keys();
    const len = keys.size();
    for (let i=0; i<len; i++) {
      const key = keys.get(i);
      this.add(key, m.get(key));
    }
    return this;
  }
  setList(list, f=null) {
    this.#modify();
    if (f == null) {
      for (let i=0; i<list.size(); ++i)
        this.set(list.get(i), list.get(i));
    }
    else {
      for (let i=0; i<list.size(); ++i)
        this.set(f(list.get(i), i), list.get(i));
    }
    return this;
  }
  addList(list, f=null) {
    this.#modify();
    if (f == null) {
      for (let i=0; i<list.size(); ++i)
        this.add(list.get(i), list.get(i));
    }
    else {
      for (let i=0; i<list.size(); ++i)
        this.add(f(list.get(i), i), list.get(i));
    }
    return this;
  }
  remove(key) {
    this.#modify();
    return this.#remove(key);
  }
  dup() {
    const dup = Map.make(this.#type.k, this.#type.v);
    if (this.#ordered) dup.ordered(true);
    if (this.#caseInsensitive) dup.caseInsensitive(true);
    dup.#def = this.#def;
    this.#each((b) => { dup.set(b.key, b.val); });
    return dup;
  }
  clear() {
    this.#modify();
    if (this.#ordered) this.#keys = [];
    this.#vals = [];
    this.#size = 0;
    return this;
  }
  caseInsensitive(it=undefined) {
    if (it === undefined) return this.#caseInsensitive;
    this.#modify();
    if (this.#type.k != Str.type$)
      throw UnsupportedErr.make("Map not keyed by Str: " + this.m_type);
    if (this.#size != 0)
      throw UnsupportedErr.make("Map not empty");
    if (it && this.ordered())
      throw UnsupportedErr.make("Map cannot be caseInsensitive and ordered");
    this.#caseInsensitive = it;
  }
  ordered(it=undefined) {
    if (it === undefined) return this.#ordered;
    this.#modify();
    if (this.#size != 0)
      throw UnsupportedErr.make("Map not empty");
    if (it && this.caseInsensitive())
      throw UnsupportedErr.make("Map cannot be caseInsensitive and ordered");
    this.#ordered = it;
    this.#keys = [];
  }
  def(it=undefined) {
    if (it === undefined) return this.#def;
    this.#modify();
    if (it != null && !ObjUtil.isImmutable(it))
      throw NotImmutableErr.make("def must be immutable: " + ObjUtil.typeof(it));
    this.#def = it;
  }
  equals(that) {
    if (that != null && that instanceof Map) {
      if (!this.#type.equals(that.#type)) return false;
      if (this.#size != that.#size) return false;
      let eq = true;
      this.#each((b) => {
        eq = ObjUtil.equals(b.val, that.get(b.key));
        return eq;
      });
      return eq;
    }
    return false;
  }
  hash() {
    return 0;
  }
  toStr() {
    if (this.#size == 0) return "[:]";
    let s = "";
    this.#each((b) => {
      if (s.length > 0) s += ", ";
      s += b.key + ":" + b.val;
    });
    return "[" + s + "]";
  }
  literalEncode$(out) {
    out.writeMap(this);
  }
  each(f) {
    this.#each((b) => { f(b.val, b.key); });
  }
  eachWhile(f) {
    let result = null;
    this.#each((b) => {
      let r = f(b.val, b.key);
      if (r != null) { result=r; return false; }
    });
    return result;
  }
  find(f) {
    let result = null;
    this.#each((b) => {
      if (f(b.val, b.key)) {
        result = b.val;
        return false;
      }
    });
    return result;
  }
  findAll(f) {
    const acc = Map.make(this.#type.k, this.#type.v);
    if (this.#ordered) acc.ordered(true);
    if (this.#caseInsensitive) acc.caseInsensitive(true);
    this.#each((b) => {
      if (f(b.val, b.key))
        acc.set(b.key, b.val);
    });
    return acc;
  }
  findNotNull() {
    const acc = Map.make(this.#type.k, this.#type.v.toNonNullable());
    if (this.#ordered) acc.ordered(true);
    if (this.#caseInsensitive) acc.caseInsensitive(true);
    this.#each((b) => {
      if (b.val != null)
        acc.set(b.key, b.val);
    });
    return acc;
  }
  exclude(f) {
    const acc = Map.make(this.#type.k, this.#type.v);
    if (this.#ordered) acc.ordered(true);
    if (this.#caseInsensitive) acc.caseInsensitive(true);
    this.#each((b) => {
      if (!f(b.val, b.key))
        acc.set(b.key, b.val);
    });
    return acc;
  }
  any(f) {
    if (this.#size == 0) return false;
    let any = false;
    this.#each((b) => {
      if (f(b.val, b.key)) {
        any = true;
        return false;
      }
    });
    return any;
  }
  all(f) {
    if (this.#size == 0) return true;
    let all = true;
    this.#each((b) => {
      if (!f(b.val, b.key)) {
        all = false
        return false;
      }
    });
    return all;
  }
  reduce(reduction, f) {
    this.#each((b) => { reduction = f(reduction, b.val, b.key); });
    return reduction;
  }
  map(f) {
    let r = arguments[arguments.length-1]
    if (r == null || r == Void.type$ || !(r instanceof Type)) r = Obj.type$.toNullable();
    const acc = Map.make(this.#type.k, r);
    if (this.#ordered) acc.ordered(true);
    if (this.#caseInsensitive) acc.caseInsensitive(true);
    this.#each((b) => { acc.add(b.key, f(b.val, b.key)); });
    return acc;
  }
  mapNotNull(f) {
    let r = arguments[arguments.length-1]
    if (r == null || r == Void.type$ || !(r instanceof Type)) r = Obj.type$.toNullable();
    const acc = Map.make(this.#type.k, r.toNonNullable());
    if (this.#ordered) acc.ordered(true);
    if (this.#caseInsensitive) acc.caseInsensitive(true);
    this.#each((b) => { acc.addNotNull(b.key, f(b.val, b.key)); });
    return acc;
  }
  join(sep, f=null) {
    if (this.#size == 0) return "";
    let s = "";
    this.#each((b) => {
      if (s.length > 0) s += sep;
      if (f == null)
        s += b.key + ": " + b.val;
      else
        s += f(b.val, b.key);
    });
    return s;
  }
  toCode() {
    const size = this.#size;
    let s = '';
    s += this.#type.signature();
    s += '[';
    if (size == 0) s += ':';
    let first = true;
    this.#each((b) => {
      if (first) first = false;
      else s += ', ';
      s += ObjUtil.trap(b.key, "toCode", null)
        + ':'
        + ObjUtil.trap(b.val, "toCode", null);
    });
    s += ']';
    return s;
  }
  isRW() { return !this.#readonly; }
  isRO() { return this.#readonly; }
  rw() {
    if (!this.#readonly) return this;
    const rw = this.dup();
    rw.#readonly = false;
    return rw;
  }
  ro() {
    if (this.#readonly) return this;
    const ro = this.dup();
    ro.#readonly = true;
    return ro;
  }
  isImmutable() { return this.#immutable; }
  toImmutable() {
    if (this.#immutable) return this;
    const ro = Map.make(this.#type.k, this.#type.v);
    if (this.#ordered) ro.ordered(true);
    if (this.#caseInsensitive) ro.caseInsensitive(true);
    this.#each((b) => {
      ro.set(b.key, ObjUtil.toImmutable(b.val));
    });
    ro.#readonly = true;
    ro.#immutable = true;
    ro.#def = this.#def;
    return ro;
  }
  #modify() {
    if (this.#readonly)
      throw ReadonlyErr.make("Map is readonly");
  }
  toJs() {
    var js = {};
    this.#each((b) => { js[b.key] = b.val });
    return js;
  }
  static __fromLiteral(keys, vals, k, v) {
    const map = Map.make(k,v);
    for (let i=0; i<keys.length; i++)
      map.set(keys[i], vals[i]);
    return map;
  }
  #hashKey(key) {
    if (this.#caseInsensitive) key = Str.lower(key);
    return ObjUtil.hash(key);
  }
  #keysEqual(a, b) {
    return (this.#caseInsensitive)
      ? Str.equalsIgnoreCase(a, b)
      : ObjUtil.equals(a, b);
  }
  #get(key) {
    let b = this.#vals[this.#hashKey(key)];
    while (b !== undefined) {
      if (this.#keysEqual(b.key, key)) return b.val;
      b = b.next;
    }
    return undefined;
  }
  #set(key, val, add) {
    const n = { key:key, val:val };
    const h = this.#hashKey(key);
    let b = this.#vals[h];
    if (b === undefined) {
      if (this.#ordered) {
        n.ki = this.#keys.length;
        this.#keys.push(key);
      }
      this.#vals[h] = n;
      this.#size++;
      return
    }
    while (true) {
      if (this.#keysEqual(b.key, key)) {
        if (add) throw ArgErr.make("Key already mapped: " + key);
        b.val = val;
        return;
      }
      if (b.next === undefined) {
        if (this.#ordered) {
          n.ki = this.#keys.length;
          this.#keys.push(key);
        }
        b.next = n;
        this.#size++;
        return;
      }
      b = b.next;
    }
  }
  #remove(key) {
    const h = this.#hashKey(key);
    let b = this.#vals[h];
    if (b === undefined) return null;
    if (b.next === undefined) {
      if (this.#ordered) this.#keys[b.ki] = undefined;
      this.#vals[h] = undefined;
      this.#size--;
      const v = b.val;
      delete this.#vals[h];
      return v;
    }
    let prev = undefined;
    while (b !== undefined) {
      if (this.#keysEqual(b.key, key)) {
        const v = b.val;
        if (prev !== undefined && b.next !== undefined) prev.next = b.next;
        else if (prev === undefined) this.#vals[h] = b.next;
        else if (b.next === undefined) prev.next = undefined;
        if (this.#ordered) this.#keys[b.ki] = undefined;
        this.#size--;
        delete b.key; delete b.val; delete b.next;
        return v;
      }
      prev = b;
      b = b.next;
    }
    return null;
  }
  #each(func) {
    if (this.#ordered) {
      for (let i=0; i<this.#keys.length; i++) {
        const k = this.#keys[i];
        if (k === undefined) continue;
        const v = this.#get(k);
        if (func({key:k, ki:i, val:v }) === false) return;
      }
    }
    else {
      for (let h in this.#vals) {
        let b = this.#vals[h];
        while (b !== undefined) {
          if (func(b) === false) return;
          b = b.next;
        }
      }
    }
  }
}
class Param extends Obj {
  constructor(name, type, hasDefault) {
    super();
    this.#name = name;
    this.#type = (type instanceof Type) ? type : Type.find(type);
    this.#hasDefault = hasDefault;
  }
  static #noParams = undefined
  static noParams$() {
    if (Param.#noParams === undefined) Param.#noParams = List.make(Param.type$, []).toImmutable();
    return Param.#noParams;
  }
  #name;
  #type;
  #hasDefault;
  name() { return this.#name; }
  type() { return this.#type; }
  hasDefault() { return this.#hasDefault; }
  toStr() { return this.#type.toStr() + " " + this.#name; }
}
class Float extends Num {
  constructor() { super(); }
  static posInf() { return Float.make(Number.POSITIVE_INFINITY); }
  static negInf() { return Float.make(Number.NEGATIVE_INFINITY); }
  static nan() { return Float.make(Number.NaN); }
  static e() { return Math.E; }
  static pi() { return Math.PI; }
  static #defVal = undefined
  static defVal() {
    if (Float.#defVal === undefined) Float.#defVal = Float.make(0);
    return Float.#defVal;
  }
  static make(val) {
    const x = new Number(val);
    x.fanType$ = Float.type$;
    return x;
  }
  static makeBits(bits) {
    throw UnsupportedErr.make("Float.makeBits not available in JavaScript");
  }
  static makeBits32(bits) {
    const buffer = new ArrayBuffer(4);
    (new Uint32Array(buffer))[0] = bits;
    return Float.make(new Float32Array(buffer)[0]);
  }
  static equals(self, that) {
    if (that != null && self.fanType$ === that.fanType$) {
      return self.valueOf() == that.valueOf();
    }
    return false;
  }
  static compare(self, that) {
    if (self == null) return that == null ? 0 : -1;
    if (that == null) return 1;
    if (isNaN(self)) return isNaN(that) ? 0 : -1;
    if (isNaN(that)) return 1;
    if (self < that) return -1;
    return self.valueOf() == that.valueOf() ? 0 : 1;
  }
  static isNaN(self) { return isNaN(self); }
  static isNegZero(self) { return 1/self === -Infinity; }
  static normNegZero(self) { return Float.isNegZero(self) ? 0.0 : self; }
  static hash(self) { return Str.hash(self.toString()); }
  static bits(self) { throw UnsupportedErr.make("Float.bits not available in JavaScript"); }
  static bitsArray(self) {
    const buf = new ArrayBuffer(8);
    (new Float64Array(buf))[0] = self;
    return [(new Uint32Array(buf))[0], (new Uint32Array(buf))[1]];
  }
  static bits32(self) {
    const buf = new ArrayBuffer(4);
    (new Float32Array(buf))[0] = self;
    return (new Uint32Array(buf))[0];
  }
  static toInt(val) { return (val<0) ? Math.ceil(val) : Math.floor(val); }
  static toFloat(val) { return val; }
  static toDecimal(val) { return Decimal.make(val); }
  static abs(self) { return Float.make(Math.abs(self)); }
  static approx(self, that, tolerance=null) {
    if (Float.compare(self, that) == 0) return true;
    const t = tolerance == null
      ? Math.min(Math.abs(self/1e6), Math.abs(that/1e6))
      : tolerance;
    return Math.abs(self - that) <= t;
  }
  static ceil(self) { return Float.make(Math.ceil(self)); }
  static exp(self) { return Float.make(Math.exp(self)); }
  static floor(self) { return Float.make(Math.floor(self)); }
  static log(self) { return Float.make(Math.log(self)); }
  static log10(self) { return Float.make(Math.log(self) / Math.LN10); }
  static min(self, that) { return Float.make(Math.min(self, that)); }
  static max(self, that) { return Float.make(Math.max(self, that)); }
  static negate(self) { return Float.make(-self); }
  static pow(self, exp) { return Float.make(Math.pow(self, exp)); }
  static round(self) { return Float.make(Math.round(self)); }
  static sqrt(self) { return Float.make(Math.sqrt(self)); }
  static random() { return Float.make(Math.random()); }
  static clamp(self, min, max) {
    if (self < min) return min;
    if (self > max) return max;
    return self;
  }
  static clip(self, min, max) { return Float.clamp(self, min, max); }
  static plus(a,b) { return Float.make(a+b); }
  static plusInt(a,b) { return Float.make(a+b); }
  static plusDecimal(a,b) { return Decimal.make(a+b); }
  static minus(a,b) { return Float.make(a-b); }
  static minusInt(a,b) { return Float.make(a-b); }
  static minusDecimal(a,b) { return Decimal.make(a-b); }
  static mult(a,b) { return Float.make(a*b); }
  static multInt(a,b) { return Float.make(a*b); }
  static multDecimal(a,b) { return Decimal.make(a*b); }
  static div(a,b) { return Float.make(a/b); }
  static divInt(a,b) { return Float.make(a/b); }
  static divDecimal(a,b) { return Decimal.make(a/b); }
  static mod(a,b) { return Float.make(a%b); }
  static modInt(a,b) { return Float.make(a%b); }
  static modDecimal(a,b) { return Decimal.make(a%b); }
  static increment(self) { return Float.make(self+1); }
  static decrement(self) { return Float.make(self-1); }
  static acos(self) { return Float.make(Math.acos(self)); }
  static asin(self) { return Float.make(Math.asin(self)); }
  static atan(self) { return Float.make(Math.atan(self)); }
  static atan2(y, x) { return Float.make(Math.atan2(y, x)); }
  static cos(self) { return Float.make(Math.cos(self)); }
  static sin(self) { return Float.make(Math.sin(self)); }
  static tan(self) { return Float.make(Math.tan(self)); }
  static toDegrees(self) { return Float.make(self * 180 / Math.PI); }
  static toRadians(self) { return Float.make(self * Math.PI / 180); }
  static cosh(self) { return Float.make(0.5 * (Math.exp(self) + Math.exp(-self))); }
  static sinh(self) { return Float.make(0.5 * (Math.exp(self) - Math.exp(-self))); }
  static tanh(self) { return Float.make((Math.exp(2*self)-1) / (Math.exp(2*self)+1)); }
  static fromStr(s, checked=true) {
    if (s == "NaN") return Float.nan();
    if (s == "INF") return Float.posInf();
    if (s == "-INF") return Float.negInf();
    if (isNaN(s))
    {
      if (!checked) return null;
      throw ParseErr.makeStr("Float", s);
    }
    return Float.make(parseFloat(s));
  }
  static toStr(self) {
    if (isNaN(self)) return "NaN";
    if (Float.isNegZero(self)) return "-0.0";
    if (self == Number.POSITIVE_INFINITY) return "INF";
    if (self == Number.NEGATIVE_INFINITY) return "-INF";
    return (Float.toInt(self) == self) ? self.toFixed(1) : ""+self;
  }
  static encode(self, out) {
    if (isNaN(self)) out.w("sys::Float(\"NaN\")");
    else if (self == Number.POSITIVE_INFINITY) out.w("sys::Float(\"INF\")");
    else if (self == Number.NEGATIVE_INFINITY) out.w("sys::Float(\"-INF\")");
    else out.w(""+self).w("f");
  }
  static toCode(self) {
    if (isNaN(self)) return "Float.nan";
    if (self == Number.POSITIVE_INFINITY) return "Float.posInf";
    if (self == Number.NEGATIVE_INFINITY) return "Float.negInf";
    var s = ""+self
    if (s.indexOf(".") == -1) s += ".0";
    return s + "f";
  }
  static toLocale(self, pattern=null, locale=Locale.cur()) {
    try
    {
      if (isNaN(self)) return locale.__numSymbols().nan;
      if (self == Float.posInf) return locale.__numSymbols().posInf;
      if (self == Float.negInf) return locale.__numSymbols().negInf;
      if (pattern == null) {
        if (Math.abs(self) >= 100.0)
          return Int.toLocale(Math.round(self), null, locale);
        pattern = Float.toDefaultLocalePattern$(self);
      }
      var string = ''+self;
      var p = NumPattern.parse(pattern);
      var d = NumDigits.makeStr(string);
      return Num.toLocale(p, d, locale);
    }
    catch (err)
    {
      ObjUtil.echo(err);
      return ''+self;
    }
  }
  static toDefaultLocalePattern$(self) {
    const abs  = Math.abs(self);
    const fabs = Math.floor(abs);
    if (fabs >= 10.0) return "#0.0#";
    if (fabs >= 1.0)  return "#0.0##";
    const frac = abs - fabs;
    if (frac < 0.00000001) return "0.0";
    if (frac < 0.0000001)  return "0.0000000##";
    if (frac < 0.000001)   return "0.000000##";
    if (frac < 0.00001)    return "0.00000##";
    if (frac < 0.0001)     return "0.0000##";
    if (frac < 0.001)      return "0.000##";
    return "0.0##";
  }
}
class Service extends Obj {
  constructor() { super(); }
}
class Sys extends Obj {
  constructor() { super(); }
  static genericParamTypes = [];
  static AType = undefined;
  static BType = undefined;
  static CType = undefined;
  static DType = undefined;
  static EType = undefined;
  static FType = undefined;
  static GType = undefined;
  static HType = undefined;
  static KType = undefined;
  static LType = undefined;
  static MType = undefined;
  static RType = undefined;
  static VType = undefined;
  static initGenericParamTypes() {
    Sys.AType = Sys.#initGeneric('A');
    Sys.BType = Sys.#initGeneric('B');
    Sys.CType = Sys.#initGeneric('C');
    Sys.DType = Sys.#initGeneric('D');
    Sys.EType = Sys.#initGeneric('E');
    Sys.FType = Sys.#initGeneric('F');
    Sys.GType = Sys.#initGeneric('G');
    Sys.HType = Sys.#initGeneric('H');
    Sys.KType = Sys.#initGeneric('K');
    Sys.LType = Sys.#initGeneric('L');
    Sys.MType = Sys.#initGeneric('M');
    Sys.RType = Sys.#initGeneric('R');
    Sys.VType = Sys.#initGeneric('V');
  }
  static #initGeneric(ch) {
    const name = ch;
    try {
      const pod = Pod.find("sys");
      return Sys.genericParamTypes[ch] = pod.at$(name, "sys::Obj", [], 0);
    }
    catch (err) {
      throw Sys.initFail("generic " + name, err);
    }
  }
  static genericParamType(name) {
    if (name.length == 1)
      return Sys.genericParamTypes[name];
    else
      return null;
  }
  static initWarn(field, e) {
    ObjUtil.echo("WARN: cannot init Sys." + field);
    ObjUtil.echo(e);
  }
  static initFail(field, e) {
    ObjUtil.echo("ERROR: cannot init Sys." + field);
    ObjUtil.echo(e);
    throw new Error("Cannot boot fan: " + e);
  }
}
class Facets extends Obj {
  constructor(map) {
    super();
    this.#map = map;
    this.#list = null;
  }
  #map;
  #list;
  static #emptyVal = null;
  static #transientVal = null;
  empty() {
    let x = Facets.#emptyVal;
    if (x == null) {
      x = new Facets({});
      Facets.#emptyVal = x;
    }
    return x;
  }
  makeTransient() {
    let x = Facets.#transientVal;
    if (x == null)
    {
      let m = {};
      m[Transient.type$.qname()] = "";
      x = new Facets(m);
      Facets.#transientVal = x;
    }
    return x;
  }
  list() {
    if (this.#list == null)
    {
      this.#list = List.make(Facet.type$);
      for (let key in this.#map)
      {
        let type = Type.find(key);
        this.#list.add(this.get(type, true));
      }
      this.#list = this.#list.toImmutable();
    }
    return this.#list;
  }
  get(type, checked=true) {
    let val = this.#map[type.qname()];
    if (typeof val == "string")
    {
      let f = this.decode(type, val);
      this.#map[type.qname()] = f;
      return f;
    }
    if (val != null) return val;
    if (checked) throw UnknownFacetErr.make(type.qname());
    return null;
  }
  decode(type, s) {
    try
    {
      if (s.length == 0) return type.make();
      return fanx_ObjDecoder.decode(s);
    }
    catch (e)
    {
      var msg = "ERROR: Cannot decode facet " + type + ": " + s;
      ObjUtil.echo(msg);
      delete this.#map[type.qname()];
      throw IOErr.make(msg, e);
    }
  }
  dup() {
    let dup = {};
    for (let key in this.#map) dup[key] = this.#map[key];
    return new Facets(dup);
  }
  inherit(facets) {
    let keys = [];
    for (let key in facets.#map) keys.push(key);
    if (keys.length == 0) return;
    this.#list = null;
    for (let i=0; i<keys.length; i++)
    {
      let key = keys[i];
      if (this.#map[key] != null) continue;
      let type = Type.find(key);
      let meta = type.facet(FacetMeta.type$, false);
      if (meta == null || !meta.inherited) continue;
      this.#map[key] = facets.#map[key];
    }
  }
}
class MethodFunc extends Obj {
  constructor(method, returns) {
    super();
    this.#method  = method;
    this.#returns = returns;
    this.#type    = null;
  }
  #method;
  #returns;
  #type;
  #params;
  returns() { return this.#returns; }
  arity() { return this.params().size(); }
  params() {
    if (!this.#params) {
      const mparams = this.#method.params();
      let   fparams = mparams;
      if ((this.#method & (FConst.Static | FConst.Ctor)) == 0) {
        const temp = [];
        temp[0] = new Param("this", this.#method.parent(), 0);
        fparams = List.make(Param.type$, temp.concat(mparams.__values()));
      }
      this.#params = fparams.ro();
    }
    return this.#params;
  }
  method() { return this.#method; }
  isImmutable() { return true; }
  typeof() {
    if (!this.#type) {
      const params = this.params();
      const types = [];
      for (let i=0; i<params.size(); i++)
        types.push(params.get(i).type());
      this.#type = new FuncType(types, this.#returns);
    }
    return this.#type;
  }
  call() {
    return this.#method.call.apply(this.#method, arguments);
  }
  callList(args) {
    return this.#method.callList.apply(this.#method, arguments);
  }
  callOn(obj, args) {
    return this.#method.callOn.apply(this.#method, arguments);
  }
  retype(t) {
    if (t instanceof FuncType) {
      const params = [];
      for (let i=0; i < t.pars.length; ++i)
        params.push(new Param(String.fromCharCode(i+65), t.pars()[i], 0));
      const paramList = List.make(Param.type$, params);
      const func = new MethodFunc(this.#method, t.ret());
      func.#type = t;
      func.#params = paramList;
      return func;
    }
    else
      throw ArgErr.make(Str.plus("Not a Func type: ", t));
  }
}
function fanx_TypeParser(sig, checked)
{
  this.sig     = sig;
  this.len     = sig.length;
  this.pos     = 0;
  this.cur     = sig.charAt(this.pos);
  this.peek    = sig.charAt(this.pos+1);
  this.checked = checked;
}
fanx_TypeParser.prototype.loadTop = function()
{
  var type = this.load();
  if (this.cur != null) throw this.err();
  return type;
}
fanx_TypeParser.prototype.load = function()
{
  var type;
  if (this.cur == '|')
    type = this.loadFunc();
  else if (this.cur == '[')
  {
    var ffi = true;
    for (var i=this.pos+1; i<this.len; i++)
    {
      var ch = this.sig.charAt(i);
      if (this.isIdChar(ch)) continue;
      ffi = (ch == ']');
      break;
    }
    if (ffi)
      throw ArgErr.make("Java types not allowed '" + this.sig + "'");
    else
      type = this.loadMap();
  }
  else
    type = this.loadBasic();
  if (this.cur == '?')
  {
    this.consume('?');
    type = type.toNullable();
  }
  while (this.cur == '[')
  {
    this.consume('[');
    this.consume(']');
    type = type.toListOf();
    if (this.cur == '?')
    {
      this.consume('?');
      type = type.toNullable();
    }
  }
  if (this.cur == '?')
  {
    this.consume('?');
    type = type.toNullable();
  }
  return type;
}
fanx_TypeParser.prototype.loadMap = function()
{
  this.consume('[');
  var key = this.load();
  this.consume(':');
  var val = this.load();
  this.consume(']');
  return new MapType(key, val);
}
fanx_TypeParser.prototype.loadFunc = function()
{
  this.consume('|');
  var params = [];
  if (this.cur != '-')
  {
    while (true)
    {
      params.push(this.load());
      if (this.cur == '-') break;
      this.consume(',');
    }
  }
  this.consume('-');
  this.consume('>');
  var ret = this.load();
  this.consume('|');
  return new FuncType(params, ret);
}
fanx_TypeParser.prototype.loadBasic = function()
{
  var podName = this.consumeId();
  this.consume(':');
  this.consume(':');
  var typeName = this.consumeId();
  if (typeName.length == 1 && podName == "sys")
  {
    var type = Sys.genericParamType(typeName);
    if (type != null) return type;
  }
  return fanx_TypeParser.find(podName, typeName, this.checked);
}
fanx_TypeParser.prototype.consumeId = function()
{
  var start = this.pos;
  while (this.isIdChar(this.cur)) this.$consume();
  return this.sig.substring(start, this.pos);
}
fanx_TypeParser.prototype.isIdChar = function(ch)
{
  if (ch == null) return false;
  return Int.isAlphaNum(ch.charCodeAt(0)) || ch == '_';
}
fanx_TypeParser.prototype.consume = function(expected)
{
  if (this.cur != expected) throw this.err();
  this.$consume();
}
fanx_TypeParser.prototype.$consume = function()
{
  this.cur = this.peek;
  this.pos++;
  this.peek = this.pos+1 < this.len ? this.sig.charAt(this.pos+1) : null;
}
fanx_TypeParser.prototype.err = function(sig)
{
  if (sig === undefined) sig = this.sig;
  return ArgErr.make("Invalid type signature '" + sig + "'");
}
fanx_TypeParser.load = function(sig, checked)
{
  var type = fanx_TypeParser.cache[sig];
  if (type != null) return type;
  var len = sig.length;
  var last = len > 1 ? sig.charAt(len-1) : 0;
  if (last == '?')
  {
    type = fanx_TypeParser.load(sig.substring(0, len-1), checked).toNullable();
    fanx_TypeParser.cache[sig] = type;
    return type;
  }
  if (last != ']' && last != '|')
  {
    var podName;
    var typeName;
    try
    {
      var colon = sig.indexOf("::");
      podName  = sig.substring(0, colon);
      typeName = sig.substring(colon+2);
      if (podName.length == 0 || typeName.length == 0) throw Err.make("");
    }
    catch (err)
    {
      throw ArgErr.make("Invalid type signature '" + sig + "', use <pod>::<type>");
    }
    if (podName.charAt(0) == '[')
      throw ArgErr.make("Java types not allowed '" + sig + "'");
    type = fanx_TypeParser.find(podName, typeName, checked);
    fanx_TypeParser.cache[sig] = type;
    return type;
  }
  try
  {
    type = new fanx_TypeParser(sig, checked).loadTop();
    fanx_TypeParser.cache[sig] = type;
    return type;
  }
  catch (err)
  {
    throw Err.make(err);
  }
}
fanx_TypeParser.find = function(podName, typeName, checked)
{
  var pod = Pod.find(podName, checked);
  if (pod == null) return null;
  return pod.type(typeName, checked);
}
fanx_TypeParser.cache = [];
function fanx_Token() {}
fanx_Token.EOF              = -1;
fanx_Token.ID               = 0;
fanx_Token.BOOL_LITERAL     = 1;
fanx_Token.STR_LITERAL      = 2;
fanx_Token.INT_LITERAL      = 3;
fanx_Token.FLOAT_LITERAL    = 4;
fanx_Token.DECIMAL_LITERAL  = 5;
fanx_Token.DURATION_LITERAL = 6;
fanx_Token.URI_LITERAL      = 7;
fanx_Token.NULL_LITERAL     = 8;
fanx_Token.DOT              = 9;
fanx_Token.SEMICOLON        = 10;
fanx_Token.COMMA            = 11;
fanx_Token.COLON            = 12;
fanx_Token.DOUBLE_COLON     = 13;
fanx_Token.LBRACE           = 14;
fanx_Token.RBRACE           = 15;
fanx_Token.LPAREN           = 16;
fanx_Token.RPAREN           = 17;
fanx_Token.LBRACKET         = 18;
fanx_Token.RBRACKET         = 19;
fanx_Token.LRBRACKET        = 20;
fanx_Token.EQ               = 21;
fanx_Token.POUND            = 22;
fanx_Token.QUESTION         = 23;
fanx_Token.AS               = 24;
fanx_Token.USING            = 25;
fanx_Token.isLiteral = function(type)
{
  return fanx_Token.BOOL_LITERAL <= type && type <= fanx_Token.NULL_LITERAL;
}
fanx_Token.toString = function(type)
{
  switch (type)
  {
    case fanx_Token.EOF:              return "end of file";
    case fanx_Token.ID:               return "identifier";
    case fanx_Token.BOOL_LITERAL:     return "Bool literal";
    case fanx_Token.STR_LITERAL:      return "String literal";
    case fanx_Token.INT_LITERAL:      return "Int literal";
    case fanx_Token.FLOAT_LITERAL:    return "Float literal";
    case fanx_Token.DECIMAL_LITERAL:  return "Decimal literal";
    case fanx_Token.DURATION_LITERAL: return "Duration literal";
    case fanx_Token.URI_LITERAL:      return "Uri literal";
    case fanx_Token.NULL_LITERAL:     return "null";
    case fanx_Token.DOT:              return ".";
    case fanx_Token.SEMICOLON:        return ";";
    case fanx_Token.COMMA:            return ",";
    case fanx_Token.COLON:            return ":";
    case fanx_Token.DOUBLE_COLON:     return "::";
    case fanx_Token.LBRACE:           return "{";
    case fanx_Token.RBRACE:           return "}";
    case fanx_Token.LPAREN:           return "(";
    case fanx_Token.RPAREN:           return ")";
    case fanx_Token.LBRACKET:         return "[";
    case fanx_Token.RBRACKET:         return "]";
    case fanx_Token.LRBRACKET:        return "[]";
    case fanx_Token.EQ:               return "=";
    case fanx_Token.POUND:            return "#";
    case fanx_Token.QUESTION:         return "?";
    case fanx_Token.AS:               return "as";
    case fanx_Token.USING:            return "using";
    default:                          return "Token[" + type + "]";
  }
}
function fanx_ObjDecoder(input, options)
{
  this.tokenizer = new fanx_Tokenizer(input);
  this.options = options;
  this.curt = null;
  this.usings = [];
  this.numUsings = 0;
  this.consume();
}
fanx_ObjDecoder.prototype.readObj = function()
{
  this.readHeader();
  return this.$readObj(null, null, true);
}
fanx_ObjDecoder.prototype.readHeader = function()
{
  while (this.curt == fanx_Token.USING)
    this.usings[this.numUsings++] = this.readUsing();
}
fanx_ObjDecoder.prototype.readUsing = function()
{
  var line = this.tokenizer.line;
  this.consume();
  var podName = this.consumeId("Expecting pod name");
  var pod = Pod.find(podName, false);
  if (pod == null) throw this.err("Unknown pod: " + podName);
  if (this.curt != fanx_Token.DOUBLE_COLON)
  {
    this.endOfStmt(line);
    return new fanx_UsingPod(pod);
  }
  this.consume();
  var typeName = this.consumeId("Expecting type name");
  var t = pod.type(typeName, false);
  if (t == null) throw this.err("Unknown type: " + podName + "::" + typeName);
  if (this.curt == fanx_Token.AS)
  {
    this.consume();
    typeName = this.consumeId("Expecting using as name");
  }
  this.endOfStmt(line);
  return new fanx_UsingType(t, typeName);
}
fanx_ObjDecoder.prototype.$readObj = function(curField, peekType, root)
{
  if (fanx_Token.isLiteral(this.curt))
  {
    var val = this.tokenizer.val;
    this.consume();
    return val;
  }
  if (this.curt == fanx_Token.LBRACKET)
    return this.readCollection(curField, peekType);
  var line = this.tokenizer.line;
  var t = (peekType != null) ? peekType : this.readType();
  if (this.curt == fanx_Token.LPAREN)
    return this.readSimple(line, t);
  else if (this.curt == fanx_Token.POUND)
    return this.readTypeOrSlotLiteral(line, t);
  else if (this.curt == fanx_Token.LBRACKET)
    return this.readCollection(curField, t);
  else
    return this.readComplex(line, t, root);
}
fanx_ObjDecoder.prototype.readTypeOrSlotLiteral = function(line, t)
{
  this.consume(fanx_Token.POUND, "Expected '#' for type literal");
  if (this.curt == fanx_Token.ID && !this.isEndOfStmt(line))
  {
    var slotName = this.consumeId("slot literal name");
    return t.slot(slotName);
  }
  else
  {
    return t;
  }
}
fanx_ObjDecoder.prototype.readSimple = function(line, t)
{
  this.consume(fanx_Token.LPAREN, "Expected ( in simple");
  var str = this.consumeStr("Expected string literal for simple");
  this.consume(fanx_Token.RPAREN, "Expected ) in simple");
  try
  {
    const val = t.method("fromStr").invoke(null, [str]);
    return val;
  }
  catch (e)
  {
    throw ParseErr.make(e.toString() + " [Line " + this.line + "]", e);
  }
}
fanx_ObjDecoder.prototype.readComplex = function(line, t, root)
{
  var toSet = Map.make(Field.type$, Obj.type$.toNullable());
  var toAdd = List.make(Obj.type$.toNullable());
  this.readComplexFields(t, toSet, toAdd);
  var makeCtor = t.method("make", false);
  if (makeCtor == null || !makeCtor.isPublic())
    throw this.err("Missing public constructor " + t.qname() + ".make", line);
  var args = null;
  if (root && this.options != null && this.options.get("makeArgs") != null)
    args = List.make(Obj.type$).addAll(this.options.get("makeArgs"));
  var obj = null;
  var setAfterCtor = true;
  try
  {
    var p = makeCtor.params().last();
    if (p != null && p.type().fits(Func.type$))
    {
      if (args == null) args = List.make(Obj.type$);
      args.add(Field.makeSetFunc(toSet));
      setAfterCtor = false;
    }
    obj = makeCtor.callList(args);
  }
  catch (e)
  {
    throw this.err("Cannot make " + t + ": " + e, line, e);
  }
  if (setAfterCtor && toSet.size() > 0)
  {
    var keys = toSet.keys();
    for (var i=0; i<keys.size(); i++)
    {
      var field = keys.get(i);
      var val = toSet.get(field);
      this.complexSet(obj, field, val, line);
    }
  }
  if (toAdd.size() > 0)
  {
    var addMethod = t.method("add", false);
    if (addMethod == null) throw this.err("Method not found: " + t.qname() + ".add", line);
    for (var i=0; i<toAdd.size(); ++i)
      this.complexAdd(t, obj, addMethod, toAdd.get(i), line);
  }
  return obj;
}
fanx_ObjDecoder.prototype.readComplexFields = function(t, toSet, toAdd)
{
  if (this.curt != fanx_Token.LBRACE) return;
  this.consume();
  while (this.curt != fanx_Token.RBRACE)
  {
    var line = this.tokenizer.line;
    var readField = false;
    if (this.curt == fanx_Token.ID)
    {
      var name = this.consumeId("Expected field name");
      if (this.curt == fanx_Token.EQ)
      {
        this.consume();
        this.readComplexSet(t, line, name, toSet);
        readField = true;
      }
      else
      {
        this.tokenizer.undo(this.tokenizer.type, this.tokenizer.val, this.tokenizer.line);
        this.curt = this.tokenizer.reset(fanx_Token.ID, name, line);
      }
    }
    if (!readField) this.readComplexAdd(t, line, toAdd);
    if (this.curt == fanx_Token.COMMA) this.consume();
    else this.endOfStmt(line);
  }
  this.consume(fanx_Token.RBRACE, "Expected '}'");
}
fanx_ObjDecoder.prototype.readComplexSet = function(t, line, name, toSet)
{
  var field = t.field(name, false);
  if (field == null) throw this.err("Field not found: " + t.qname() + "." + name, line);
  var val = this.$readObj(field, null, false);
  try
  {
    if (field.isConst()) val = ObjUtil.toImmutable(val);
  }
  catch (ex)
  {
    throw this.err("Cannot make object const for " + field.qname() + ": " + ex, line, ex);
  }
  toSet.set(field, val);
}
fanx_ObjDecoder.prototype.complexSet = function(obj, field, val, line)
{
  try
  {
    if (field.isConst())
      field.set(obj, ObjUtil.toImmutable(val), false);
    else
      field.set(obj, val);
  }
  catch (ex)
  {
    throw this.err("Cannot set field " + field.qname() + ": " + ex, line, ex);
  }
}
fanx_ObjDecoder.prototype.readComplexAdd = function(t, line, toAdd)
{
  var val = this.$readObj(null, null, false);
  toAdd.add(val);
}
fanx_ObjDecoder.prototype.complexAdd = function(t, obj, addMethod, val, line)
{
  try
  {
    addMethod.invoke(obj, List.make(Obj.type$, [val]));
  }
  catch (ex)
  {
    throw this.err("Cannot call " + t.qname() + ".add: " + ex, line, ex);
  }
}
fanx_ObjDecoder.prototype.readCollection = function(curField, t)
{
  this.consume(fanx_Token.LBRACKET, "Expecting '['");
  var peekType = null;
  if (this.curt == fanx_Token.ID && t == null)
  {
    peekType = this.readType();
    if (this.curt == fanx_Token.RBRACKET && peekType instanceof MapType)
    {
      t = peekType; peekType = null;
      this.consume();
      while (this.curt == fanx_Token.LRBRACKET) { this.consume(); t = t.toListOf(); }
      if (this.curt == fanx_Token.QUESTION) { this.consume(); t = t.toNullable(); }
      if (this.curt == fanx_Token.POUND) { this.consume(); return t; }
      this.consume(fanx_Token.LBRACKET, "Expecting '['");
    }
  }
  if (this.curt == fanx_Token.COMMA && peekType == null)
  {
    this.consume();
    this.consume(fanx_Token.RBRACKET, "Expecting ']'");
    return List.make(this.toListOfType(t, curField, false), []);
  }
  if (this.curt == fanx_Token.COLON && peekType == null)
  {
    this.consume();
    this.consume(fanx_Token.RBRACKET, "Expecting ']'");
    return Map.make(this.toMapType(t, curField, false));
  }
  var first = this.$readObj(null, peekType, false);
  if (this.curt == fanx_Token.COLON)
    return this.readMap(this.toMapType(t, curField, true), first);
  else
    return this.readList(this.toListOfType(t, curField, true), first);
}
fanx_ObjDecoder.prototype.readList = function(of, first)
{
  var acc = [];
  acc.push(first)
  while (this.curt != fanx_Token.RBRACKET)
  {
    this.consume(fanx_Token.COMMA, "Expected ','");
    if (this.curt == fanx_Token.RBRACKET) break;
    acc.push(this.$readObj(null, null, false));
  }
  this.consume(fanx_Token.RBRACKET, "Expected ']'");
  if (of == null) of = Type.common$(acc);
  return List.make(of, acc);
}
fanx_ObjDecoder.prototype.readMap = function(mapType, firstKey)
{
  var map = mapType == null
    ? Map.make(Obj.type$, Obj.type$.toNullable())
    : Map.make(mapType);
  map.ordered(true);
  this.consume(fanx_Token.COLON, "Expected ':'");
  map.set(firstKey, this.$readObj(null, null, false));
  while (this.curt != fanx_Token.RBRACKET)
  {
    this.consume(fanx_Token.COMMA, "Expected ','");
    if (this.curt == fanx_Token.RBRACKET) break;
    var key = this.$readObj(null, null, false);
    this.consume(fanx_Token.COLON, "Expected ':'");
    var val = this.$readObj(null, null, false);
    map.set(key, val);
  }
  this.consume(fanx_Token.RBRACKET, "Expected ']'");
  if (mapType == null)
  {
    var size = map.size();
    var k = Type.common$(map.keys().__values());
    var v = Type.common$(map.vals().__values());
    map.__type(new MapType(k, v));
  }
  return map;
}
fanx_ObjDecoder.prototype.toListOfType = function(t, curField, infer)
{
  if (t != null) return t;
  if (curField != null)
  {
    var ft = curField.type().toNonNullable();
    if (ft instanceof ListType) return ft.v;
  }
  if (infer) return null;
  return Obj.type$.toNullable();
}
fanx_ObjDecoder.prototype.toMapType = function(t, curField, infer)
{
  if (t instanceof MapType)
    return t;
  if (curField != null)
  {
    var ft = curField.type().toNonNullable();
    if (ft instanceof MapType) return ft;
  }
  if (infer) return null;
  if (fanx_ObjDecoder.defaultMapType == null)
    fanx_ObjDecoder.defaultMapType =
      new MapType(Obj.type$, Obj.type$.toNullable());
  return fanx_ObjDecoder.defaultMapType;
}
fanx_ObjDecoder.prototype.readType = function(lbracket)
{
  if (lbracket === undefined) lbracket = false;
  var t = this.readSimpleType();
  if (this.curt == fanx_Token.QUESTION)
  {
    this.consume();
    t = t.toNullable();
  }
  if (this.curt == fanx_Token.COLON)
  {
    this.consume();
    var lbracket2 = this.curt == fanx_Token.LBRACKET;
    if (lbracket2) this.consume();
    t = new MapType(t, this.readType(lbracket2));
    if (lbracket2) this.consume(fanx_Token.RBRACKET, "Expected closeing ']'");
  }
  while (this.curt == fanx_Token.LRBRACKET)
  {
    this.consume();
    t = t.toListOf();
  }
  if (this.curt == fanx_Token.QUESTION)
  {
    this.consume();
    t = t.toNullable();
  }
  return t;
}
fanx_ObjDecoder.prototype.readSimpleType = function()
{
  var line = this.tokenizer.line;
  var n = this.consumeId("Expected type signature");
  if (this.curt != fanx_Token.DOUBLE_COLON)
  {
    for (var i=0; i<this.numUsings; ++i)
    {
      var t = this.usings[i].resolve(n);
      if (t != null) return t;
    }
    throw this.err("Unresolved type name: " + n);
  }
  this.consume(fanx_Token.DOUBLE_COLON, "Expected ::");
  var typeName = this.consumeId("Expected type name");
  var pod = Pod.find(n, false);
  if (pod == null) throw this.err("Pod not found: " + n, line);
  var type = pod.type(typeName, false);
  if (type == null) throw this.err("Type not found: " + n + "::" + typeName, line);
  return type;
}
fanx_ObjDecoder.prototype.err = function(msg)
{
  return fanx_ObjDecoder.err(msg, this.tokenizer.line);
}
fanx_ObjDecoder.prototype.consumeId = function(expected)
{
  this.verify(fanx_Token.ID, expected);
  var id = this.tokenizer.val;
  this.consume();
  return id;
}
fanx_ObjDecoder.prototype.consumeStr = function(expected)
{
  this.verify(fanx_Token.STR_LITERAL, expected);
  var id = this.tokenizer.val;
  this.consume();
  return id;
}
fanx_ObjDecoder.prototype.consume = function(type, expected)
{
  if (type != undefined)
    this.verify(type, expected);
  this.curt = this.tokenizer.next();
}
fanx_ObjDecoder.prototype.verify = function(type, expected)
{
  if (this.curt != type)
    throw this.err(expected + ", not '" + fanx_Token.toString(this.curt) + "'");
}
fanx_ObjDecoder.prototype.isEndOfStmt = function(lastLine)
{
  if (this.curt == fanx_Token.EOF) return true;
  if (this.curt == fanx_Token.SEMICOLON) return true;
  return lastLine < this.tokenizer.line;
}
fanx_ObjDecoder.prototype.endOfStmt = function(lastLine)
{
  if (this.curt == fanx_Token.SEMICOLON) { this.consume(); return; }
  if (lastLine < this.tokenizer.line) return;
  if (this.curt == fanx_Token.RBRACE) return;
  throw this.err("Expected end of statement: semicolon, newline, or end of block; not '" + fanx_Token.toString(this.curt) + "'");
}
fanx_ObjDecoder.decode = function(s)
{
  return new fanx_ObjDecoder(InStream.__makeForStr(s), null).readObj();
}
fanx_ObjDecoder.err = function(msg, line)
{
  return IOErr.make(msg + " [Line " + line + "]");
}
fanx_ObjDecoder.defaultMapType = null;
function fanx_UsingPod(p) { this.pod = p; }
fanx_UsingPod.prototype.resolve = function(n)
{
  return this.pod.type(n, false);
}
function fanx_UsingType(t,n) { this.type = t; this.name = n; }
fanx_UsingType.prototype.resolve = function(n)
{
  return this.name == n ? this.type : null;
}
function fanx_ObjEncoder(out, options)
{
  this.out    = out;
  this.level  = 0;
  this.indent = 0;
  this.skipDefaults = false;
  this.skipErrors   = false;
  this.curFieldType = null;
  if (options != null) this.initOptions(options);
}
fanx_ObjEncoder.encode = function(obj)
{
  var buf = StrBuf.make();
  var out = new StrBufOutStream(buf);
  new fanx_ObjEncoder(out, null).writeObj(obj);
  return buf.toStr();
}
fanx_ObjEncoder.prototype.writeObj = function(obj)
{
  if (obj == null)
  {
    this.w("null");
    return;
  }
  var t = typeof obj;
  if (t === "boolean") { this.w(obj.toString()); return; }
  if (t === "number")  { this.w(obj.toString()); return; }
  if (t === "string")  { this.wStrLiteral(obj.toString(), '"'); return; }
  var f = obj.fanType$;
  if (f === Float.type$)   { Float.encode(obj, this); return; }
  if (f === Decimal.type$) { Decimal.encode(obj, this); return; }
  if (obj.literalEncode$)
  {
    obj.literalEncode$(this);
    return;
  }
  var type = ObjUtil.typeof(obj);
  var ser = type.facet(Serializable.type$, false);
  if (ser != null)
  {
    if (ser.simple())
      this.writeSimple(type, obj);
    else
      this.writeComplex(type, obj, ser);
  }
  else
  {
    if (this.skipErrors)
      this.w("null /\u002A Not serializable: ").w(type.qname()).w(" */");
    else
      throw IOErr.make("Not serializable: " + type);
  }
}
fanx_ObjEncoder.prototype.writeSimple = function(type, obj)
{
  var str = ObjUtil.toStr(obj);
  this.wType(type).w('(').wStrLiteral(str, '"').w(')');
}
fanx_ObjEncoder.prototype.writeComplex = function(type, obj, ser)
{
  this.wType(type);
  var first = true;
  var defObj = null;
  if (this.skipDefaults)
  {
    try { defObj = ObjUtil.typeof(obj).make(); } catch(e) {}
  }
  var fields = type.fields();
  for (var i=0; i<fields.size(); ++i)
  {
    var f = fields.get(i);
    if (f.isStatic() || f.isSynthetic() || f.hasFacet(Transient.type$))
      continue;
    var val = f.get(obj);
    if (defObj != null)
    {
      var defVal = f.get(defObj);
      if (ObjUtil.equals(val, defVal)) continue;
    }
    if (first) { this.w('\n').wIndent().w('{').w('\n'); this.level++; first = false; }
    this.wIndent().w(f.name()).w('=');
    this.curFieldType = f.type().toNonNullable();
    this.writeObj(val);
    this.curFieldType = null;
    this.w('\n');
  }
  if (ser.collection())
    first = this.writeCollectionItems(type, obj, first);
  if (!first) { this.level--; this.wIndent().w('}'); }
}
fanx_ObjEncoder.prototype.writeCollectionItems = function(type, obj, first)
{
  var m = type.method("each", false);
  if (m == null) throw IOErr.make("Missing " + type.qname() + ".each");
  var enc = this;
  const it = (obj) => {
    if (first) { enc.w('\n').wIndent().w('{').w('\n'); enc.level++; first = false; }
    enc.wIndent();
    enc.writeObj(obj);
    enc.w(',').w('\n');
    return null;
  }
  m.invoke(obj, List.make(Obj.type$, [it]));
  return first;
}
fanx_ObjEncoder.prototype.writeList = function(list)
{
  var of = list.of();
  var nl = this.isMultiLine(of);
  var inferred = false;
  if (this.curFieldType != null && (this.curFieldType instanceof ListType))
  {
    inferred = true;
  }
  this.curFieldType = null;
  if (!inferred) this.wType(of);
  var size = list.size();
  if (size == 0) { this.w("[,]"); return; }
  if (nl) this.w('\n').wIndent();
  this.w('[');
  this.level++;
  for (var i=0; i<size; ++i)
  {
    if (i > 0) this.w(',');
     if (nl) this.w('\n').wIndent();
    this.writeObj(list.get(i));
  }
  this.level--;
  if (nl) this.w('\n').wIndent();
  this.w(']');
}
fanx_ObjEncoder.prototype.writeMap = function(map)
{
  var t = map.typeof();
  var nl = this.isMultiLine(t.k) || this.isMultiLine(t.v);
  var inferred = false;
  if (this.curFieldType != null && (this.curFieldType instanceof MapType))
  {
    inferred = true;
  }
  this.curFieldType = null;
  if (!inferred) this.wType(t);
  if (map.isEmpty()) { this.w("[:]"); return; }
  this.level++;
  this.w('[');
  var first = true;
  var keys = map.keys();
  for (var i=0; i<keys.size(); i++)
  {
    if (first) first = false; else this.w(',');
    if (nl) this.w('\n').wIndent();
    var key = keys.get(i);
    var val = map.get(key);
    this.writeObj(key); this.w(':'); this.writeObj(val);
  }
  this.w(']');
  this.level--;
}
fanx_ObjEncoder.prototype.isMultiLine = function(t)
{
  return t.pod() != Pod.sysPod$;
}
fanx_ObjEncoder.prototype.wType = function(t)
{
  return this.w(t.signature());
}
fanx_ObjEncoder.prototype.wStrLiteral = function(s, quote)
{
  var len = s.length;
  this.w(quote);
  for (var i=0; i<len; ++i)
  {
    var c = s.charAt(i);
    switch (c)
    {
      case '\n': this.w('\\').w('n'); break;
      case '\r': this.w('\\').w('r'); break;
      case '\f': this.w('\\').w('f'); break;
      case '\t': this.w('\\').w('t'); break;
      case '\\': this.w('\\').w('\\'); break;
      case '"':  if (quote == '"') this.w('\\').w('"'); else this.w(c); break;
      case '`':  if (quote == '`') this.w('\\').w('`'); else this.w(c); break;
      case '$':  this.w('\\').w('$'); break;
      default:   this.w(c);
    }
  }
  return this.w(quote);
}
fanx_ObjEncoder.prototype.wIndent = function()
{
  var num = this.level * this.indent;
  for (var i=0; i<num; ++i) this.w(' ');
  return this;
}
fanx_ObjEncoder.prototype.w = function(s)
{
  var len = s.length;
  for (var i=0; i<len; ++i)
    this.out.writeChar(s.charCodeAt(i));
  return this;
}
fanx_ObjEncoder.prototype.initOptions = function(options)
{
  this.indent = fanx_ObjEncoder.option(options, "indent", this.indent);
  this.skipDefaults = fanx_ObjEncoder.option(options, "skipDefaults", this.skipDefaults);
  this.skipErrors = fanx_ObjEncoder.option(options, "skipErrors", this.skipErrors);
}
fanx_ObjEncoder.option = function(options, name, def)
{
  var val = options.get(name);
  if (val == null) return def;
  return val;
}
function fanx_Tokenizer(input)
{
  this.input = null;
  this.type  = null;
  this.val   = null;
  this.line  = 1;
  this.$undo = null;
  this.cur   = 0;
  this.curt  = 0;
  this.peek  = 0;
  this.peekt = 0;
  this.input = input;
  this.consume();
  this.consume();
}
fanx_Tokenizer.prototype.next = function()
{
  if (this.$undo != null) { this.$undo.reset(this); this.$undo = null; return this.type; }
  this.val = null;
  return this.type = this.doNext();
}
fanx_Tokenizer.prototype.doNext = function()
{
  while (true)
  {
    while (this.curt == fanx_Tokenizer.SPACE) this.consume();
    if (this.cur < 0) return fanx_Token.EOF;
    if (this.curt == fanx_Tokenizer.ALPHA) return this.id();
    if (this.curt == fanx_Tokenizer.DIGIT) return this.number(false);
    switch (this.cur)
    {
      case  43:  this.consume(); return this.number(false);
      case  45:  this.consume(); return this.number(true);
      case  34:  return this.str();
      case  39:  return this.ch();
      case  96:  return this.uri();
      case  40:  this.consume(); return fanx_Token.LPAREN;
      case  41:  this.consume(); return fanx_Token.RPAREN;
      case  44:  this.consume(); return fanx_Token.COMMA;
      case  59:  this.consume(); return fanx_Token.SEMICOLON;
      case  61:  this.consume(); return fanx_Token.EQ;
      case  123: this.consume(); return fanx_Token.LBRACE;
      case  125: this.consume(); return fanx_Token.RBRACE;
      case  35:  this.consume(); return fanx_Token.POUND;
      case  63:  this.consume(); return fanx_Token.QUESTION;
      case  46:
        if (this.peekt == fanx_Tokenizer.DIGIT) return this.number(false);
        this.consume();
        return fanx_Token.DOT;
      case  91:
        this.consume();
        if (this.cur == 93 ) { this.consume(); return fanx_Token.LRBRACKET; }
        return fanx_Token.LBRACKET;
      case  93:
        this.consume();
        return fanx_Token.RBRACKET;
      case  58:
        this.consume();
        if (this.cur == 58 ) { this.consume(); return fanx_Token.DOUBLE_COLON; }
        return fanx_Token.COLON;
      case  42:
        if (this.peek == 42 ) { this.skipCommentSL(); continue; }
        break;
      case  47:
        if (this.peek == 47 ) { this.skipCommentSL(); continue; }
        if (this.peek == 42 ) { this.skipCommentML(); continue; }
        break;
    }
    throw this.err("Unexpected symbol: " + this.cur + " (0x" + this.cur.toString(16) + ")");
  }
}
fanx_Tokenizer.prototype.id = function()
{
  var val = "";
  var first = this.cur;
  while ((this.curt == fanx_Tokenizer.ALPHA || this.curt == fanx_Tokenizer.DIGIT) && this.cur > 0)
  {
    val += String.fromCharCode(this.cur);
    this.consume();
  }
  switch (first)
  {
    case  97:
      if (val == "as") { return fanx_Token.AS; }
      break;
    case  102:
      if (val == "false") { this.val = false; return fanx_Token.BOOL_LITERAL; }
      break;
    case  110:
      if (val == "null") { this.val = null; return fanx_Token.NULL_LITERAL; }
      break;
    case  116:
      if (val == "true") { this.val = true; return fanx_Token.BOOL_LITERAL; }
      break;
    case  117:
      if (val == "using") { return fanx_Token.USING; }
      break;
  }
  this.val = val;
  return fanx_Token.ID;
}
fanx_Tokenizer.prototype.number = function(neg)
{
  if (this.cur == 48 && this.peek == 120/*'x'*/)
    return this.hex();
  var s = null;
  var whole = 0;
  var wholeCount = 0;
  while (this.curt == fanx_Tokenizer.DIGIT)
  {
    if (s != null)
    {
      s += String.fromCharCode(this.cur);
    }
    else
    {
      whole = whole*10 + (this.cur - 48);
      wholeCount++;
      if (wholeCount >= 18) { s = (neg) ? "-" : ""; s += whole; }
    }
    this.consume();
    if (this.cur == 95) this.consume();
  }
  var floating = false;
  if (this.cur == 46 && this.peekt == fanx_Tokenizer.DIGIT)
  {
    floating = true;
    if (s == null) { s = (neg) ? "-" : ""; s += whole; }
    s += '.';
    this.consume();
    while (this.curt == fanx_Tokenizer.DIGIT)
    {
      s += String.fromCharCode(this.cur);
      this.consume();
      if (this.cur == 95) this.consume();
    }
  }
  if (this.cur == 101 || this.cur == 69/*'E'*/)
  {
    floating = true;
    if (s == null) { s = (neg) ? "-" : ""; s += whole; }
    s += 'e';
    this.consume();
    if (this.cur == 45 || this.cur == 43/*'+'*/) { s += String.fromCharCode(this.cur); this.consume(); }
    if (this.curt != fanx_Tokenizer.DIGIT) throw this.err("Expected exponent digits");
    while (this.curt == fanx_Tokenizer.DIGIT)
    {
      s += String.fromCharCode(this.cur);
      this.consume();
      if (this.cur == 95) this.consume();
    }
  }
  var floatSuffix  = false;
  var decimalSuffix = false;
  var dur = -1;
  if (100 <= this.cur && this.cur <= 115/*'s'*/)
  {
    if (this.cur == 110 && this.peek == 115/*'s'*/) { this.consume(); this.consume(); dur = 1; }
    if (this.cur == 109 && this.peek == 115/*'s'*/) { this.consume(); this.consume(); dur = 1000000; }
    if (this.cur == 115 && this.peek == 101/*'e'*/) { this.consume(); this.consume(); if (this.cur != 99/*'c'*/) throw this.err("Expected 'sec' in Duration literal"); this.consume(); dur = 1000000000; }
    if (this.cur == 109 && this.peek == 105/*'i'*/) { this.consume(); this.consume(); if (this.cur != 110/*'n'*/) throw this.err("Expected 'min' in Duration literal"); this.consume(); dur = 60000000000; }
    if (this.cur == 104 && this.peek == 114/*'r'*/) { this.consume(); this.consume(); dur = 3600000000000; }
    if (this.cur == 100 && this.peek == 97/*'a'*/)  { this.consume(); this.consume(); if (this.cur != 121/*'y'*/) throw this.err("Expected 'day' in Duration literal"); this.consume(); dur = 86400000000000; }
  }
  if (this.cur == 102 || this.cur == 70/*'F'*/)
  {
    this.consume();
    floatSuffix = true;
  }
  else if (this.cur == 100 || this.cur == 68/*'D'*/)
  {
    this.consume();
    decimalSuffix = true;
  }
  if (neg) whole = -whole;
  try
  {
    if (floatSuffix)
    {
      if (s == null)
        this.val = Float.make(whole);
      else
        this.val = Float.fromStr(s);
      return fanx_Token.FLOAT_LITERAL;
    }
    if (decimalSuffix || floating)
    {
      var num = (s == null) ? whole : Float.fromStr(s);
      if (dur > 0)
      {
        this.val = Duration.make(num * dur);
        return fanx_Token.DURATION_LITERAL;
      }
      else
      {
        this.val = Decimal.make(num);
        return fanx_Token.DECIMAL_LITERAL;
      }
    }
    var num = (s == null) ? whole : Math.floor(Float.fromStr(s, true));
    if (dur > 0)
    {
      this.val = Duration.make(num*dur);
      return fanx_Token.DURATION_LITERAL;
    }
    else
    {
      this.val = num;
      return fanx_Token.INT_LITERAL;
    }
  }
  catch (e)
  {
    throw this.err("Invalid numeric literal: " + s);
  }
}
fanx_Tokenizer.prototype.hex = function()
{
  this.consume();
  this.consume();
  var type = fanx_Token.INT_LITERAL;
  var val = this.$hex(this.cur);
  if (val < 0) throw this.err("Expecting hex number");
var str = String.fromCharCode(this.cur);
  this.consume();
  var nibCount = 1;
  while (true)
  {
    var nib = this.$hex(this.cur);
    if (nib < 0)
    {
      if (this.cur == 95) { this.consume(); continue; }
      break;
    }
str += String.fromCharCode(this.cur);
    nibCount++;
    if (nibCount > 16) throw this.err("Hex literal too big");
    this.consume();
  }
this.val = Int.fromStr(str, 16);
  return type;
}
fanx_Tokenizer.prototype.$hex = function(c)
{
  if (48 <= c && c <= 57) return c - 48;
  if (97 <= c && c <= 102) return c - 97 + 10;
  if (65 <= c && c <= 70) return c - 65 + 10;
  return -1;
}
fanx_Tokenizer.prototype.str = function()
{
  this.consume();
  var s = "";
  var loop = true;
  while (loop)
  {
    switch (this.cur)
    {
      case 34:   this.consume(); loop = false; break;
      case -1:          throw this.err("Unexpected end of string");
      case 36:   throw this.err("Interpolated strings unsupported");
      case 92:  s += this.escape(); break;
      case 13:  s += '\n'; this.consume(); break;
      default:          s += String.fromCharCode(this.cur); this.consume(); break;
    }
  }
  this.val = s;
  return fanx_Token.STR_LITERAL;
}
fanx_Tokenizer.prototype.ch = function()
{
  this.consume();
  var c;
  if (this.cur == 92)
  {
    c = this.escape();
  }
  else
  {
    c = this.cur;
    this.consume();
  }
  if (this.cur != 39) throw this.err("Expecting ' close of char literal");
  this.consume();
  this.val = c;
  return fanx_Token.INT_LITERAL;
}
fanx_Tokenizer.prototype.escape = function()
{
  if (this.cur != 92) throw this.err("Internal error");
  this.consume();
  switch (this.cur)
  {
    case   98:   this.consume(); return '\b';
    case   102:  this.consume(); return '\f';
    case   110:  this.consume(); return '\n';
    case   114:  this.consume(); return '\r';
    case   116:  this.consume(); return '\t';
    case   36:   this.consume(); return '$';
    case   34:   this.consume(); return '"';
    case  39:   this.consume(); return '\'';
    case   96:   this.consume(); return '`';
    case  92:   this.consume(); return '\\';
  }
  if (this.cur == 117)
  {
    this.consume();
    var n3 = this.$hex(this.cur); this.consume();
    var n2 = this.$hex(this.cur); this.consume();
    var n1 = this.$hex(this.cur); this.consume();
    var n0 = this.$hex(this.cur); this.consume();
    if (n3 < 0 || n2 < 0 || n1 < 0 || n0 < 0) throw this.err("Invalid hex value for \\uxxxx");
    return String.fromCharCode((n3 << 12) | (n2 << 8) | (n1 << 4) | n0);
  }
  throw this.err("Invalid escape sequence");
}
fanx_Tokenizer.prototype.uri = function()
{
  this.consume();
  var s = "";
  while (true)
  {
    if (this.cur < 0) throw this.err("Unexpected end of uri");
    if (this.cur == 92)
    {
      s += this.escape();
    }
    else
    {
      if (this.cur == 96) { this.consume(); break; }
      s += String.fromCharCode(this.cur);
      this.consume();
    }
  }
  this.val = Uri.fromStr(s);
  return fanx_Token.URI_LITERAL;
}
fanx_Tokenizer.prototype.skipCommentSL = function()
{
  this.consume();
  this.consume();
  while (true)
  {
    if (this.cur == 10 || this.cur == 13/*'\r'*/) { this.consume(); break; }
    if (this.cur < 0) break;
    this.consume();
  }
  return null;
}
fanx_Tokenizer.prototype.skipCommentML = function()
{
  this.consume();
  this.consume();
  var depth = 1;
  while (true)
  {
    if (this.cur == 42 && this.peek == 47/*'/'*/) { this.consume(); this.consume(); depth--; if (depth <= 0) break; }
    if (this.cur == 47 && this.peek == 42/*'*'*/) { this.consume(); this.consume(); depth++; continue; }
    if (this.cur < 0) break;
    this.consume();
  }
  return null;
}
fanx_Tokenizer.prototype.err = function(msg)
{
  return fanx_ObjDecoder.err(msg, this.line);
}
fanx_Tokenizer.prototype.consume = function()
{
  if (this.cur == 10 || this.cur == 13/*'\r'*/) this.line++;
  var c = this.input.readChar();
  if (c == 10 && this.peek == 13/*'\r'*/) c = this.input.readChar();
  if (c == null) c = -1;
  this.cur   = this.peek;
  this.curt  = this.peekt;
  this.peek  = c;
  this.peekt = 0 < c && c < 128 ? fanx_Tokenizer.charMap[c] : fanx_Tokenizer.ALPHA;
}
fanx_Tokenizer.prototype.undo = function(type, val, line)
{
  if (this.$undo != null) throw new Err.make("only one pushback supported");
  this.$undo = new fanx_Undo(type, val, line);
}
fanx_Tokenizer.prototype.reset = function(type, val, line)
{
  this.type = type;
  this.val  = val;
  this.line = line;
  return type;
}
fanx_Tokenizer.charMap = [];
fanx_Tokenizer.SPACE = 1;
fanx_Tokenizer.ALPHA = 2;
fanx_Tokenizer.DIGIT = 3;
fanx_Tokenizer.charMap[32 ]  = fanx_Tokenizer.SPACE;
fanx_Tokenizer.charMap[10 ] = fanx_Tokenizer.SPACE;
fanx_Tokenizer.charMap[13 ] = fanx_Tokenizer.SPACE;
fanx_Tokenizer.charMap[9  ] = fanx_Tokenizer.SPACE;
for (var i=97; i<=122/*'z'*/; ++i) fanx_Tokenizer.charMap[i] = fanx_Tokenizer.ALPHA;
for (var i=65; i<=90/*'Z'*/;  ++i) fanx_Tokenizer.charMap[i] = fanx_Tokenizer.ALPHA;
fanx_Tokenizer.charMap[95 ] = fanx_Tokenizer.ALPHA;
for (var i=48; i<=57/*'9'*/; ++i) fanx_Tokenizer.charMap[i] = fanx_Tokenizer.DIGIT;
function fanx_Undo(t, v, l) { this.type = t; this.val = v; this.line = l; }
fanx_Undo.prototype.reset = function(t) { t.reset(this.type, this.val, this.line); }
const p = Pod.add$('sys');
Obj.type$ = p.at$('Obj',null,[],{},8705,Obj);
Obj.prototype.typeof = () => { return Obj.type$; }
Type.type$ = p.at$('Type','sys::Obj',[],{},8706,Type);
Type.prototype.typeof = () => { return Type.type$; }
Sys.initGenericParamTypes();
Facet.type$ = p.am$('Facet','sys::Obj',[],{},8963,Facet);
Facet.prototype.typeof = () => { return Facet.type$; }
TimeZone.type$ = p.at$('TimeZone','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8706,TimeZone);
TimeZone.prototype.typeof = () => { return TimeZone.type$; }
Uri.type$ = p.at$('Uri','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,Uri);
Uri.prototype.typeof = () => { return Uri.type$; }
Num.type$ = p.at$('Num','sys::Obj',[],{},8707,Num);
Num.prototype.typeof = () => { return Num.type$; }
Int.type$ = p.at$('Int','sys::Num',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,Int);
Int.prototype.typeof = () => { return Int.type$; }
Err.type$ = p.at$('Err','sys::Obj',[],{},8706,Err);
Err.prototype.typeof = () => { return Err.type$; }
CancelledErr.type$ = p.at$('CancelledErr','sys::Err',[],{},8706,CancelledErr);
CancelledErr.prototype.typeof = () => { return CancelledErr.type$; }
Unsafe.type$ = p.at$('Unsafe','sys::Obj',[],{},8738,Unsafe);
Unsafe.prototype.typeof = () => { return Unsafe.type$; }
Pod.type$ = p.at$('Pod','sys::Obj',[],{},8738,Pod);
Pod.prototype.typeof = () => { return Pod.type$; }
Void.type$ = p.at$('Void','sys::Obj',[],{},8738,Void);
Void.prototype.typeof = () => { return Void.type$; }
ConstErr.type$ = p.at$('ConstErr','sys::Err',[],{},8706,ConstErr);
ConstErr.prototype.typeof = () => { return ConstErr.type$; }
Version.type$ = p.at$('Version','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,Version);
Version.prototype.typeof = () => { return Version.type$; }
ArgErr.type$ = p.at$('ArgErr','sys::Err',[],{},8706,ArgErr);
ArgErr.prototype.typeof = () => { return ArgErr.type$; }
Date.type$ = p.at$('Date','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,Date);
Date.prototype.typeof = () => { return Date.type$; }
Enum.type$ = p.at$('Enum','sys::Obj',[],{},8707,Enum);
Enum.prototype.typeof = () => { return Enum.type$; }
Endian.type$ = p.at$('Endian','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8746,Endian);
Endian.prototype.typeof = () => { return Endian.type$; }
Test.type$ = p.at$('Test','sys::Obj',[],{},8705,Test);
Test.prototype.typeof = () => { return Test.type$; }
TestErr.type$ = p.at$('TestErr','sys::Err',[],{},8706,TestErr);
TestErr.prototype.typeof = () => { return TestErr.type$; }
NameErr.type$ = p.at$('NameErr','sys::Err',[],{},8706,NameErr);
NameErr.prototype.typeof = () => { return NameErr.type$; }
Duration.type$ = p.at$('Duration','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,Duration);
Duration.prototype.typeof = () => { return Duration.type$; }
Process.type$ = p.at$('Process','sys::Obj',[],{},8736,Process);
Process.prototype.typeof = () => { return Process.type$; }
Decimal.type$ = p.at$('Decimal','sys::Num',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,Decimal);
Decimal.prototype.typeof = () => { return Decimal.type$; }
TimeoutErr.type$ = p.at$('TimeoutErr','sys::Err',[],{},8706,TimeoutErr);
TimeoutErr.prototype.typeof = () => { return TimeoutErr.type$; }
IOErr.type$ = p.at$('IOErr','sys::Err',[],{},8706,IOErr);
IOErr.prototype.typeof = () => { return IOErr.type$; }
Locale.type$ = p.at$('Locale','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8706,Locale);
Locale.prototype.typeof = () => { return Locale.type$; }
UnresolvedErr.type$ = p.at$('UnresolvedErr','sys::Err',[],{},8706,UnresolvedErr);
UnresolvedErr.prototype.typeof = () => { return UnresolvedErr.type$; }
This.type$ = p.at$('This','sys::Obj',[],{},8738,This);
This.prototype.typeof = () => { return This.type$; }
UnknownSlotErr.type$ = p.at$('UnknownSlotErr','sys::Err',[],{},8706,UnknownSlotErr);
UnknownSlotErr.prototype.typeof = () => { return UnknownSlotErr.type$; }
StrBuf.type$ = p.at$('StrBuf','sys::Obj',[],{},8736,StrBuf);
StrBuf.prototype.typeof = () => { return StrBuf.type$; }
ReadonlyErr.type$ = p.at$('ReadonlyErr','sys::Err',[],{},8706,ReadonlyErr);
ReadonlyErr.prototype.typeof = () => { return ReadonlyErr.type$; }
LogRec.type$ = p.at$('LogRec','sys::Obj',[],{},8706,LogRec);
LogRec.prototype.typeof = () => { return LogRec.type$; }
Func.type$ = p.at$('Func','sys::Obj',[],{},8736,Func);
Range.type$ = p.at$('Range','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,Range);
Range.prototype.typeof = () => { return Range.type$; }
IndexErr.type$ = p.at$('IndexErr','sys::Err',[],{},8706,IndexErr);
IndexErr.prototype.typeof = () => { return IndexErr.type$; }
Log.type$ = p.at$('Log','sys::Obj',[],{},8706,Log);
Log.prototype.typeof = () => { return Log.type$; }
Weekday.type$ = p.at$('Weekday','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8746,Weekday);
Weekday.prototype.typeof = () => { return Weekday.type$; }
Buf.type$ = p.at$('Buf','sys::Obj',[],{},8704,Buf);
Buf.prototype.typeof = () => { return Buf.type$; }
MemBuf.type$ = p.at$('MemBuf','sys::Buf',[],{},640,MemBuf);
MemBuf.prototype.typeof = () => { return MemBuf.type$; }
ConstBuf.type$ = p.at$('ConstBuf','sys::Buf',[],{},640,ConstBuf);
ConstBuf.prototype.typeof = () => { return ConstBuf.type$; }
Charset.type$ = p.at$('Charset','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,Charset);
Charset.prototype.typeof = () => { return Charset.type$; }
Zip.type$ = p.at$('Zip','sys::Obj',[],{},8736,Zip);
Zip.prototype.typeof = () => { return Zip.type$; }
Depend.type$ = p.at$('Depend','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,Depend);
Depend.prototype.typeof = () => { return Depend.type$; }
Str.type$ = p.at$('Str','sys::Obj',[],{},8738,Str);
Str.prototype.typeof = () => { return Str.type$; }
Bool.type$ = p.at$('Bool','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,Bool);
Bool.prototype.typeof = () => { return Bool.type$; }
MimeType.type$ = p.at$('MimeType','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,MimeType);
MimeType.prototype.typeof = () => { return MimeType.type$; }
Regex.type$ = p.at$('Regex','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,Regex);
Regex.prototype.typeof = () => { return Regex.type$; }
OutStream.type$ = p.at$('OutStream','sys::Obj',[],{},8704,OutStream);
OutStream.prototype.typeof = () => { return OutStream.type$; }
SysOutStream.type$ = p.at$('SysOutStream','sys::OutStream',[],{},640,SysOutStream);
SysOutStream.prototype.typeof = () => { return SysOutStream.type$; }
LogLevel.type$ = p.at$('LogLevel','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8746,LogLevel);
LogLevel.prototype.typeof = () => { return LogLevel.type$; }
Time.type$ = p.at$('Time','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,Time);
Time.prototype.typeof = () => { return Time.type$; }
UnknownTypeErr.type$ = p.at$('UnknownTypeErr','sys::Err',[],{},8706,UnknownTypeErr);
UnknownTypeErr.prototype.typeof = () => { return UnknownTypeErr.type$; }
UriScheme.type$ = p.at$('UriScheme','sys::Obj',[],{},8707,UriScheme);
UriScheme.prototype.typeof = () => { return UriScheme.type$; }
Month.type$ = p.at$('Month','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8746,Month);
Month.prototype.typeof = () => { return Month.type$; }
CastErr.type$ = p.at$('CastErr','sys::Err',[],{},8706,CastErr);
CastErr.prototype.typeof = () => { return CastErr.type$; }
ParseErr.type$ = p.at$('ParseErr','sys::Err',[],{},8706,ParseErr);
ParseErr.prototype.typeof = () => { return ParseErr.type$; }
DateTime.type$ = p.at$('DateTime','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,DateTime);
DateTime.prototype.typeof = () => { return DateTime.type$; }
NotImmutableErr.type$ = p.at$('NotImmutableErr','sys::Err',[],{},8706,NotImmutableErr);
NotImmutableErr.prototype.typeof = () => { return NotImmutableErr.type$; }
UnknownPodErr.type$ = p.at$('UnknownPodErr','sys::Err',[],{},8706,UnknownPodErr);
UnknownPodErr.prototype.typeof = () => { return UnknownPodErr.type$; }
List.type$ = p.at$('List','sys::Obj',[],{'sys::Serializable':""},8736,List);
FileStore.type$ = p.at$('FileStore','sys::Obj',[],{},8707,FileStore);
FileStore.prototype.typeof = () => { return FileStore.type$; }
Unit.type$ = p.at$('Unit','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8706,Unit);
Unit.prototype.typeof = () => { return Unit.type$; }
RegexMatcher.type$ = p.at$('RegexMatcher','sys::Obj',[],{},8736,RegexMatcher);
RegexMatcher.prototype.typeof = () => { return RegexMatcher.type$; }
Slot.type$ = p.at$('Slot','sys::Obj',[],{},8707,Slot);
Slot.prototype.typeof = () => { return Slot.type$; }
Field.type$ = p.at$('Field','sys::Slot',[],{},8706,Field);
Field.prototype.typeof = () => { return Field.type$; }
FieldNotSetErr.type$ = p.at$('FieldNotSetErr','sys::Err',[],{},8706,FieldNotSetErr);
FieldNotSetErr.prototype.typeof = () => { return FieldNotSetErr.type$; }
Method.type$ = p.at$('Method','sys::Slot',[],{},8706,Method);
Method.prototype.typeof = () => { return Method.type$; }
Serializable.type$ = p.at$('Serializable','sys::Obj',['sys::Facet'],{'sys::FacetMeta':"sys::FacetMeta{inherited=true;}",'sys::Serializable':""},8754,Serializable);
Serializable.prototype.typeof = () => { return Serializable.type$; }
Transient.type$ = p.at$('Transient','sys::Obj',['sys::Facet'],{},8754,Transient);
Transient.prototype.typeof = () => { return Transient.type$; }
Js.type$ = p.at$('Js','sys::Obj',['sys::Facet'],{},8754,Js);
Js.prototype.typeof = () => { return Js.type$; }
NoDoc.type$ = p.at$('NoDoc','sys::Obj',['sys::Facet'],{},8754,NoDoc);
NoDoc.prototype.typeof = () => { return NoDoc.type$; }
Deprecated.type$ = p.at$('Deprecated','sys::Obj',['sys::Facet'],{'sys::Serializable':""},8754,Deprecated);
Deprecated.prototype.typeof = () => { return Deprecated.type$; }
Operator.type$ = p.at$('Operator','sys::Obj',['sys::Facet'],{},8754,Operator);
Operator.prototype.typeof = () => { return Operator.type$; }
FacetMeta.type$ = p.at$('FacetMeta','sys::Obj',['sys::Facet'],{'sys::Serializable':""},8754,FacetMeta);
FacetMeta.prototype.typeof = () => { return FacetMeta.type$; }
UnknownServiceErr.type$ = p.at$('UnknownServiceErr','sys::Err',[],{},8706,UnknownServiceErr);
UnknownServiceErr.prototype.typeof = () => { return UnknownServiceErr.type$; }
NullErr.type$ = p.at$('NullErr','sys::Err',[],{},8706,NullErr);
NullErr.prototype.typeof = () => { return NullErr.type$; }
Uuid.type$ = p.at$('Uuid','sys::Obj',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,Uuid);
Uuid.prototype.typeof = () => { return Uuid.type$; }
UnsupportedErr.type$ = p.at$('UnsupportedErr','sys::Err',[],{},8706,UnsupportedErr);
UnsupportedErr.prototype.typeof = () => { return UnsupportedErr.type$; }
UnknownKeyErr.type$ = p.at$('UnknownKeyErr','sys::Err',[],{},8706,UnknownKeyErr);
UnknownKeyErr.prototype.typeof = () => { return UnknownKeyErr.type$; }
UnknownFacetErr.type$ = p.at$('UnknownFacetErr','sys::Err',[],{},8706,UnknownFacetErr);
UnknownFacetErr.prototype.typeof = () => { return UnknownFacetErr.type$; }
InStream.type$ = p.at$('InStream','sys::Obj',[],{},8704,InStream);
InStream.prototype.typeof = () => { return InStream.type$; }
SysInStream.type$ = p.at$('SysInStream','sys::InStream',[],{},640,SysInStream);
SysInStream.prototype.typeof = () => { return SysInStream.type$; }
File.type$ = p.at$('File','sys::Obj',[],{},8707,File);
File.prototype.typeof = () => { return File.type$; }
LocalFile.type$ = p.at$('LocalFile','sys::File',[],{},642,LocalFile);
LocalFile.prototype.typeof = () => { return LocalFile.type$; }
MemFile.type$ = p.at$('MemFile','sys::File',[],{},642,MemFile);
MemFile.prototype.typeof = () => { return MemFile.type$; }
ZipEntryFile.type$ = p.at$('ZipEntryFile','sys::File',[],{},642,ZipEntryFile);
ZipEntryFile.prototype.typeof = () => { return ZipEntryFile.type$; }
InterruptedErr.type$ = p.at$('InterruptedErr','sys::Err',[],{},8706,InterruptedErr);
InterruptedErr.prototype.typeof = () => { return InterruptedErr.type$; }
Env.type$ = p.at$('Env','sys::Obj',[],{},8707,Env);
Env.prototype.typeof = () => { return Env.type$; }
BootEnv.type$ = p.at$('BootEnv','sys::Env',[],{},642,BootEnv);
BootEnv.prototype.typeof = () => { return BootEnv.type$; }
Map.type$ = p.at$('Map','sys::Obj',[],{'sys::Serializable':""},8736,Map);
Param.type$ = p.at$('Param','sys::Obj',[],{},8738,Param);
Param.prototype.typeof = () => { return Param.type$; }
Float.type$ = p.at$('Float','sys::Num',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8738,Float);
Float.prototype.typeof = () => { return Float.type$; }
Service.type$ = p.am$('Service','sys::Obj',[],{},8963,Service);
Service.prototype.typeof = () => { return Service.type$; }
Obj.type$.am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',4100,'sys::Void',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Type.type$.am$('inheritance',8192,'sys::Type[]',List.make(Param.type$,[]),{}).am$('isSynthetic',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('facets',8192,'sys::Facet[]',List.make(Param.type$,[]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('mixins',8192,'sys::Type[]',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('find',40962,'sys::Type?',List.make(Param.type$,[new Param('qname','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('qname',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('isFacet',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('method',8192,'sys::Method?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('params',8192,'[sys::Str:sys::Type]',List.make(Param.type$,[]),{}).am$('fits',8192,'sys::Bool',List.make(Param.type$,[new Param('t','sys::Type',false)]),{}).am$('isInternal',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('slots',8192,'sys::Slot[]',List.make(Param.type$,[]),{}).am$('field',8192,'sys::Field?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isNullable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('doc',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('fields',8192,'sys::Field[]',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('toNonNullable',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('hasFacet',8192,'sys::Bool',List.make(Param.type$,[new Param('type','sys::Type',false)]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('pod',8192,'sys::Pod?',List.make(Param.type$,[]),{}).am$('signature',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('methods',8192,'sys::Method[]',List.make(Param.type$,[]),{}).am$('slot',8192,'sys::Slot?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('toNullable',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('emptyList',8192,'sys::Obj[]',List.make(Param.type$,[]),{}).am$('isConst',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('of',40962,'sys::Type',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('isPublic',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isFinal',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8192,'sys::Obj',List.make(Param.type$,[new Param('args','sys::Obj[]?',true)]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('isClass',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('toLocale',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('parameterize',8192,'sys::Type',List.make(Param.type$,[new Param('params','[sys::Str:sys::Type]',false)]),{}).am$('isGeneric',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isEnum',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isVal',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isAbstract',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isMixin',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('toListOf',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('facet',8192,'sys::Facet?',List.make(Param.type$,[new Param('type','sys::Type',false),new Param('checked','sys::Bool',true)]),{}).am$('base',8192,'sys::Type?',List.make(Param.type$,[]),{});
Facet.type$.am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
TimeZone.type$.am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('cur',40962,'sys::TimeZone',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('offset',8192,'sys::Duration',List.make(Param.type$,[new Param('year','sys::Int',false)]),{}).am$('utc',40962,'sys::TimeZone',List.make(Param.type$,[]),{}).am$('fullName',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('dstOffset',8192,'sys::Duration?',List.make(Param.type$,[new Param('year','sys::Int',false)]),{}).am$('stdAbbr',8192,'sys::Str',List.make(Param.type$,[new Param('year','sys::Int',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('fromStr',40966,'sys::TimeZone?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('listFullNames',40962,'sys::Str[]',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('rel',40962,'sys::TimeZone',List.make(Param.type$,[]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('dstAbbr',8192,'sys::Str?',List.make(Param.type$,[new Param('year','sys::Int',false)]),{}).am$('listNames',40962,'sys::Str[]',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('defVal',40962,'sys::TimeZone',List.make(Param.type$,[]),{});
Uri.type$.af$('defVal',106498,'sys::Uri',{}).af$('sectionFrag',106498,'sys::Int',{}).af$('sectionQuery',106498,'sys::Int',{}).af$('sectionPath',106498,'sys::Int',{}).am$('encode',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('plusName',8192,'sys::Uri',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('asDir','sys::Bool',true)]),{}).am$('userInfo',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('parent',8192,'sys::Uri?',List.make(Param.type$,[]),{}).am$('relTo',8192,'sys::Uri',List.make(Param.type$,[new Param('base','sys::Uri',false)]),{}).am$('encodeQuery',40962,'sys::Str',List.make(Param.type$,[new Param('q','[sys::Str:sys::Str]',false)]),{}).am$('auth',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('mimeType',8192,'sys::MimeType?',List.make(Param.type$,[]),{}).am$('decode',40962,'sys::Uri?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('checkName',40962,'sys::Void',List.make(Param.type$,[new Param('name','sys::Str',false)]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('escapeToken',40962,'sys::Str',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('section','sys::Int',false)]),{}).am$('path',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('isAbs',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('getRange',8192,'sys::Uri',List.make(Param.type$,[new Param('r','sys::Range',false)]),{}).am$('host',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('pathStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('unescapeToken',40962,'sys::Str',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('ext',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('toCode',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('decodeQuery',40962,'[sys::Str:sys::Str]',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('query',8192,'[sys::Str:sys::Str]',List.make(Param.type$,[]),{}).am$('plusSlash',8192,'sys::Uri',List.make(Param.type$,[]),{}).am$('decodeToken',40962,'sys::Str',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('section','sys::Int',false)]),{}).am$('plus',8192,'sys::Uri',List.make(Param.type$,[new Param('toAppend','sys::Uri',false)]),{}).am$('basename',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('fromStr',40966,'sys::Uri?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('port',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toFile',8192,'sys::File',List.make(Param.type$,[]),{}).am$('getRangeToPathAbs',8192,'sys::Uri',List.make(Param.type$,[new Param('r','sys::Range',false)]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('queryStr',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('relToAuth',8192,'sys::Uri',List.make(Param.type$,[]),{}).am$('frag',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('scheme',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('isPathAbs',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('get',8192,'sys::Obj?',List.make(Param.type$,[new Param('base','sys::Obj?',true),new Param('checked','sys::Bool',true)]),{}).am$('plusQuery',8192,'sys::Uri',List.make(Param.type$,[new Param('query','[sys::Str:sys::Str]?',false)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('pathOnly',8192,'sys::Uri',List.make(Param.type$,[]),{}).am$('toLocale',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('isPathRel',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('isRel',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isPathOnly',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isName',40962,'sys::Bool',List.make(Param.type$,[new Param('name','sys::Str',false)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('encodeToken',40962,'sys::Str',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('section','sys::Int',false)]),{}).am$('isDir',8192,'sys::Bool',List.make(Param.type$,[]),{});
Num.type$.am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('toInt',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('localePercent',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('toFloat',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('localeNaN',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('localeMinus',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('localeNegInf',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('localeDecimal',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toDecimal',8192,'sys::Decimal',List.make(Param.type$,[]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',132,'sys::Void',List.make(Param.type$,[]),{}).am$('localeGrouping',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('localePosInf',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Int.type$.af$('maxVal',106498,'sys::Int',{}).af$('minVal',106498,'sys::Int',{}).af$('defVal',106498,'sys::Int',{}).am$('shiftl',8192,'sys::Int',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('mult',8192,'sys::Int',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('mod',8192,'sys::Int',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('localePercent',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('divFloat',8192,'sys::Float',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('upper',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('isSpace',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('div',8192,'sys::Int',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('plusFloat',8192,'sys::Float',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('localeUpper',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isUpper',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('shiftr',8192,'sys::Int',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('equalsIgnoreCase',8192,'sys::Bool',List.make(Param.type$,[new Param('ch','sys::Int',false)]),{}).am$('toDecimal',8192,'sys::Decimal',List.make(Param.type$,[]),{}).am$('clamp',8192,'sys::Int',List.make(Param.type$,[new Param('min','sys::Int',false),new Param('max','sys::Int',false)]),{}).am$('toDateTime',8192,'sys::DateTime',List.make(Param.type$,[new Param('tz','sys::TimeZone',true)]),{}).am$('modFloat',8192,'sys::Float',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('multFloat',8192,'sys::Float',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('isAlphaNum',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('toRadix',8192,'sys::Str',List.make(Param.type$,[new Param('radix','sys::Int',false),new Param('width','sys::Int?',true)]),{}).am$('isAlpha',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('toCode',8192,'sys::Str',List.make(Param.type$,[new Param('base','sys::Int',true)]),{}).am$('lower',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('plus',8192,'sys::Int',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('divDecimal',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Decimal',false)]),{}).am$('localeIsLower',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('localeMinus',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('fromStr',40966,'sys::Int?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('radix','sys::Int',true),new Param('checked','sys::Bool',true)]),{}).am$('toHex',8192,'sys::Str',List.make(Param.type$,[new Param('width','sys::Int?',true)]),{}).am$('localeNegInf',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('shifta',8192,'sys::Int',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('isDigit',8192,'sys::Bool',List.make(Param.type$,[new Param('radix','sys::Int',true)]),{}).am$('localeLower',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('toDuration',8192,'sys::Duration',List.make(Param.type$,[]),{}).am$('localeGrouping',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('minus',8192,'sys::Int',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('compare',271360,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('isEven',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('increment',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('plusDecimal',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Decimal',false)]),{}).am$('localeIsUpper',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('random',40962,'sys::Int',List.make(Param.type$,[new Param('r','sys::Range?',true)]),{}).am$('not',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('times',8192,'sys::Void',List.make(Param.type$,[new Param('c','|sys::Int->sys::Void|',false)]),{}).am$('minusDecimal',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Decimal',false)]),{}).am$('min',8192,'sys::Int',List.make(Param.type$,[new Param('that','sys::Int',false)]),{}).am$('and',8192,'sys::Int',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('minusFloat',8192,'sys::Float',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('isOdd',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('pow',8192,'sys::Int',List.make(Param.type$,[new Param('pow','sys::Int',false)]),{}).am$('xor',8192,'sys::Int',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('toDigit',8192,'sys::Int?',List.make(Param.type$,[new Param('radix','sys::Int',true)]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toChar',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toLocale',8192,'sys::Str',List.make(Param.type$,[new Param('pattern','sys::Str?',true),new Param('locale','sys::Locale',true)]),{}).am$('toInt',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('modDecimal',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Decimal',false)]),{}).am$('or',8192,'sys::Int',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('max',8192,'sys::Int',List.make(Param.type$,[new Param('that','sys::Int',false)]),{}).am$('toFloat',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('fromDigit',8192,'sys::Int?',List.make(Param.type$,[new Param('radix','sys::Int',true)]),{}).am$('localeNaN',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('abs',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('negate',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('decrement',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('isLower',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('localeDecimal',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('multDecimal',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Decimal',false)]),{}).am$('clip',8192,'sys::Int',List.make(Param.type$,[new Param('min','sys::Int',false),new Param('max','sys::Int',false)]),{}).am$('localePosInf',40962,'sys::Str',List.make(Param.type$,[]),{});
Err.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
CancelledErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Unsafe.type$.am$('val',8192,'sys::Obj?',List.make(Param.type$,[]),{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('val','sys::Obj?',false)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Pod.type$.am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('log',8192,'sys::Log',List.make(Param.type$,[]),{}).am$('orderByDepends',40962,'sys::Pod[]',List.make(Param.type$,[new Param('pods','sys::Pod[]',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('type',8192,'sys::Type?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('locale',8192,'sys::Str?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('def','sys::Str?',true)]),{}).am$('file',8192,'sys::File?',List.make(Param.type$,[new Param('uri','sys::Uri',false),new Param('checked','sys::Bool',true)]),{}).am$('load',40962,'sys::Pod',List.make(Param.type$,[new Param('in','sys::InStream',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('find',40962,'sys::Pod?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('of',40962,'sys::Pod?',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('flattenDepends',40962,'sys::Pod[]',List.make(Param.type$,[new Param('pods','sys::Pod[]',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('types',8192,'sys::Type[]',List.make(Param.type$,[]),{}).am$('depends',8192,'sys::Depend[]',List.make(Param.type$,[]),{}).am$('list',40962,'sys::Pod[]',List.make(Param.type$,[]),{}).am$('version',8192,'sys::Version',List.make(Param.type$,[]),{}).am$('uri',8192,'sys::Uri',List.make(Param.type$,[]),{}).am$('props',8192,'[sys::Str:sys::Str]',List.make(Param.type$,[new Param('uri','sys::Uri',false),new Param('maxAge','sys::Duration',false)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('meta',8192,'[sys::Str:sys::Str]',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('files',8192,'sys::File[]',List.make(Param.type$,[]),{}).am$('doc',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('config',8192,'sys::Str?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('def','sys::Str?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{});
Void.type$.am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
ConstErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Version.type$.af$('defVal',106498,'sys::Version',{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',271360,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('minor',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('segments',8192,'sys::Int[]',List.make(Param.type$,[]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('patch',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('fromStr',40966,'sys::Version?',List.make(Param.type$,[new Param('version','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('major',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('build',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',40966,'sys::Version?',List.make(Param.type$,[new Param('segments','sys::Int[]',false)]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
ArgErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Date.type$.af$('defVal',106498,'sys::Date',{}).am$('minus',8192,'sys::Date',List.make(Param.type$,[new Param('days','sys::Duration',false)]),{}).am$('compare',271360,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('firstOfMonth',8192,'sys::Date',List.make(Param.type$,[]),{}).am$('weekOfYear',8192,'sys::Int',List.make(Param.type$,[new Param('startOfWeek','sys::Weekday',true)]),{}).am$('year',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('dayOfYear',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('fromLocale',40962,'sys::Date?',List.make(Param.type$,[new Param('str','sys::Str',false),new Param('pattern','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('weekday',8192,'sys::Weekday',List.make(Param.type$,[]),{}).am$('isToday',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('yesterday',40962,'sys::Date',List.make(Param.type$,[new Param('tz','sys::TimeZone',true)]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('lastOfMonth',8192,'sys::Date',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('today',40962,'sys::Date',List.make(Param.type$,[new Param('tz','sys::TimeZone',true)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toIso',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',40966,'sys::Date?',List.make(Param.type$,[new Param('year','sys::Int',false),new Param('month','sys::Month',false),new Param('day','sys::Int',false)]),{}).am$('day',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('toDateTime',8192,'sys::DateTime',List.make(Param.type$,[new Param('t','sys::Time',false),new Param('tz','sys::TimeZone',true)]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('toLocale',8192,'sys::Str',List.make(Param.type$,[new Param('pattern','sys::Str?',true),new Param('locale','sys::Locale',true)]),{}).am$('midnight',8192,'sys::DateTime',List.make(Param.type$,[new Param('tz','sys::TimeZone',true)]),{}).am$('toCode',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('tomorrow',40962,'sys::Date',List.make(Param.type$,[new Param('tz','sys::TimeZone',true)]),{}).am$('fromIso',40962,'sys::Date?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isTomorrow',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('plus',8192,'sys::Date',List.make(Param.type$,[new Param('days','sys::Duration',false)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('fromStr',40966,'sys::Date?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('month',8192,'sys::Month',List.make(Param.type$,[]),{}).am$('minusDate',8192,'sys::Duration',List.make(Param.type$,[new Param('days','sys::Date',false)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('isYesterday',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{});
Enum.type$.am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',271360,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('doFromStr',36866,'sys::Enum?',List.make(Param.type$,[new Param('t','sys::Type',false),new Param('name','sys::Str',false),new Param('checked','sys::Bool',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',4100,'sys::Void',List.make(Param.type$,[new Param('ordinal','sys::Int',false),new Param('name','sys::Str',false)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('ordinal',8192,'sys::Int',List.make(Param.type$,[]),{});
Endian.type$.af$('big',106506,'sys::Endian',{}).af$('vals',106498,'sys::Endian[]',{}).af$('little',106506,'sys::Endian',{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('static$init',165890,'sys::Void',List.make(Param.type$,[]),{}).am$('compare',271360,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('fromStr',40966,'sys::Endian?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('doFromStr',36866,'sys::Enum?',List.make(Param.type$,[new Param('t','sys::Type',false),new Param('name','sys::Str',false),new Param('checked','sys::Bool',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',133124,'sys::Void',List.make(Param.type$,[new Param('$ordinal','sys::Int',false),new Param('$name','sys::Str',false)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('ordinal',8192,'sys::Int',List.make(Param.type$,[]),{});
Test.type$.am$('curTestMethod',8192,'sys::Method',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('verifyErr',8192,'sys::Void',List.make(Param.type$,[new Param('errType','sys::Type?',false),new Param('c','|sys::Test->sys::Void|',false)]),{}).am$('verifyNotEq',8192,'sys::Void',List.make(Param.type$,[new Param('a','sys::Obj?',false),new Param('b','sys::Obj?',false),new Param('msg','sys::Str?',true)]),{}).am$('verifyTrue',8192,'sys::Void',List.make(Param.type$,[new Param('cond','sys::Bool',false),new Param('msg','sys::Str?',true)]),{}).am$('verifyNull',8192,'sys::Void',List.make(Param.type$,[new Param('a','sys::Obj?',false),new Param('msg','sys::Str?',true)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('verifySame',8192,'sys::Void',List.make(Param.type$,[new Param('a','sys::Obj?',false),new Param('b','sys::Obj?',false),new Param('msg','sys::Str?',true)]),{}).am$('verifyErrMsg',8192,'sys::Void',List.make(Param.type$,[new Param('errType','sys::Type',false),new Param('errMsg','sys::Str',false),new Param('c','|sys::Test->sys::Void|',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('verify',8192,'sys::Void',List.make(Param.type$,[new Param('cond','sys::Bool',false),new Param('msg','sys::Str?',true)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',4100,'sys::Void',List.make(Param.type$,[]),{}).am$('teardown',270336,'sys::Void',List.make(Param.type$,[]),{}).am$('verifyFalse',8192,'sys::Void',List.make(Param.type$,[new Param('cond','sys::Bool',false),new Param('msg','sys::Str?',true)]),{}).am$('verifyNotSame',8192,'sys::Void',List.make(Param.type$,[new Param('a','sys::Obj?',false),new Param('b','sys::Obj?',false),new Param('msg','sys::Str?',true)]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('verifyEq',8192,'sys::Void',List.make(Param.type$,[new Param('a','sys::Obj?',false),new Param('b','sys::Obj?',false),new Param('msg','sys::Str?',true)]),{}).am$('fail',8192,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('setup',270336,'sys::Void',List.make(Param.type$,[]),{}).am$('tempDir',8192,'sys::File',List.make(Param.type$,[]),{}).am$('verifyNotNull',8192,'sys::Void',List.make(Param.type$,[new Param('a','sys::Obj?',false),new Param('msg','sys::Str?',true)]),{}).am$('verifyType',8192,'sys::Void',List.make(Param.type$,[new Param('obj','sys::Obj',false),new Param('t','sys::Type',false)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{});
TestErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str?',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
NameErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Duration.type$.af$('maxVal',106498,'sys::Duration',{}).af$('minVal',106498,'sys::Duration',{}).af$('defVal',106498,'sys::Duration',{}).am$('toSec',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('minus',8192,'sys::Duration',List.make(Param.type$,[new Param('b','sys::Duration',false)]),{}).am$('toMin',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('compare',271360,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('mult',8192,'sys::Duration',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('divFloat',8192,'sys::Duration',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('toHour',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('div',8192,'sys::Duration',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('min',8192,'sys::Duration',List.make(Param.type$,[new Param('that','sys::Duration',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('now',40962,'sys::Duration',List.make(Param.type$,[]),{}).am$('toMillis',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('boot',40962,'sys::Duration',List.make(Param.type$,[]),{}).am$('floor',8192,'sys::Duration',List.make(Param.type$,[new Param('accuracy','sys::Duration',false)]),{}).am$('toIso',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',40966,'sys::Duration?',List.make(Param.type$,[new Param('ticks','sys::Int',false)]),{}).am$('clamp',8192,'sys::Duration',List.make(Param.type$,[new Param('min','sys::Duration',false),new Param('max','sys::Duration',false)]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('multFloat',8192,'sys::Duration',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('toLocale',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('ticks',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('max',8192,'sys::Duration',List.make(Param.type$,[new Param('that','sys::Duration',false)]),{}).am$('toCode',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('fromIso',40962,'sys::Duration',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('plus',8192,'sys::Duration',List.make(Param.type$,[new Param('b','sys::Duration',false)]),{}).am$('uptime',40962,'sys::Duration',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('abs',8192,'sys::Duration',List.make(Param.type$,[]),{}).am$('fromStr',40966,'sys::Duration?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('nowTicks',40962,'sys::Int',List.make(Param.type$,[]),{}).am$('negate',8192,'sys::Duration',List.make(Param.type$,[]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('toDay',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{});
Process.type$.af$('err',73728,'sys::OutStream?',{}).af$('in',73728,'sys::InStream?',{}).af$('dir',73728,'sys::File?',{}).af$('command',73728,'sys::Str[]',{}).af$('out',73728,'sys::OutStream?',{}).af$('mergeErr',73728,'sys::Bool',{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('run',8192,'sys::This',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('env',8192,'[sys::Str:sys::Str]',List.make(Param.type$,[]),{}).am$('kill',8192,'sys::This',List.make(Param.type$,[]),{}).am$('instance$init$sys$Process',133120,'sys::Void',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('join',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('cmd','sys::Str[]',true),new Param('dir','sys::File?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Decimal.type$.af$('defVal',106498,'sys::Decimal',{}).am$('minus',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Decimal',false)]),{}).am$('compare',271360,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('mult',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Decimal',false)]),{}).am$('mod',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Decimal',false)]),{}).am$('localePercent',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('modInt',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('divFloat',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('increment',8192,'sys::Decimal',List.make(Param.type$,[]),{}).am$('multInt',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('div',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Decimal',false)]),{}).am$('plusFloat',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('min',8192,'sys::Decimal',List.make(Param.type$,[new Param('that','sys::Decimal',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('minusFloat',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toDecimal',8192,'sys::Decimal',List.make(Param.type$,[]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('plusInt',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('modFloat',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('multFloat',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('toLocale',8192,'sys::Str',List.make(Param.type$,[new Param('pattern','sys::Str?',true),new Param('locale','sys::Locale',true)]),{}).am$('toInt',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('max',8192,'sys::Decimal',List.make(Param.type$,[new Param('that','sys::Decimal',false)]),{}).am$('toCode',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toFloat',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('plus',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Decimal',false)]),{}).am$('localeNaN',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('abs',8192,'sys::Decimal',List.make(Param.type$,[]),{}).am$('localeMinus',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('fromStr',40966,'sys::Decimal?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('negate',8192,'sys::Decimal',List.make(Param.type$,[]),{}).am$('decrement',8192,'sys::Decimal',List.make(Param.type$,[]),{}).am$('minusInt',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('localeNegInf',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('localeDecimal',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('divInt',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('localeGrouping',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('localePosInf',40962,'sys::Str',List.make(Param.type$,[]),{});
TimeoutErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
IOErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Locale.type$.af$('en',106498,'sys::Locale',{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('cur',40962,'sys::Locale',List.make(Param.type$,[]),{}).am$('country',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('use',8192,'sys::This',List.make(Param.type$,[new Param('func','|sys::This->sys::Void|',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('fromStr',40966,'sys::Locale?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('setCur',40962,'sys::Void',List.make(Param.type$,[new Param('locale','sys::Locale',false)]),{}).am$('lang',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
UnresolvedErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
This.type$.am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
UnknownSlotErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
StrBuf.type$.af$('capacity',73728,'sys::Int',{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('insert',8192,'sys::This',List.make(Param.type$,[new Param('index','sys::Int',false),new Param('x','sys::Obj?',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('addRange',8192,'sys::This',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('r','sys::Range',false)]),{}).am$('remove',8192,'sys::This',List.make(Param.type$,[new Param('index','sys::Int',false)]),{}).am$('out',8192,'sys::OutStream',List.make(Param.type$,[]),{}).am$('addChar',8192,'sys::This',List.make(Param.type$,[new Param('ch','sys::Int',false)]),{}).am$('replaceRange',8192,'sys::This',List.make(Param.type$,[new Param('r','sys::Range',false),new Param('str','sys::Str',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('getRange',8192,'sys::Str',List.make(Param.type$,[new Param('range','sys::Range',false)]),{}).am$('get',8192,'sys::Int',List.make(Param.type$,[new Param('index','sys::Int',false)]),{}).am$('removeRange',8192,'sys::This',List.make(Param.type$,[new Param('r','sys::Range',false)]),{}).am$('join',8192,'sys::This',List.make(Param.type$,[new Param('x','sys::Obj?',false),new Param('sep','sys::Str',true)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('capacity','sys::Int',true)]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('add',8192,'sys::This',List.make(Param.type$,[new Param('x','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('set',8192,'sys::This',List.make(Param.type$,[new Param('index','sys::Int',false),new Param('ch','sys::Int',false)]),{}).am$('isEmpty',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('clear',8192,'sys::This',List.make(Param.type$,[]),{}).am$('reverse',8192,'sys::This',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('size',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{});
ReadonlyErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
LogRec.type$.af$('msg',73730,'sys::Str',{}).af$('err',73730,'sys::Err?',{}).af$('level',73730,'sys::LogLevel',{}).af$('logName',73730,'sys::Str',{}).af$('time',73730,'sys::DateTime',{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('print',8192,'sys::Void',List.make(Param.type$,[new Param('out','sys::OutStream',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('time','sys::DateTime',false),new Param('level','sys::LogLevel',false),new Param('logName','sys::Str',false),new Param('message','sys::Str',false),new Param('err','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Func.type$.am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('retype',8192,'sys::Func',List.make(Param.type$,[new Param('t','sys::Type',false)]),{}).am$('method',8192,'sys::Method?',List.make(Param.type$,[]),{}).am$('callOn',270336,'sys::R',List.make(Param.type$,[new Param('target','sys::Obj?',false),new Param('args','sys::Obj?[]?',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('params',8192,'sys::Param[]',List.make(Param.type$,[]),{}).am$('callList',270336,'sys::R',List.make(Param.type$,[new Param('args','sys::Obj?[]?',false)]),{}).am$('call',270336,'sys::R',List.make(Param.type$,[new Param('a','sys::A',true),new Param('b','sys::B',true),new Param('c','sys::C',true),new Param('d','sys::D',true),new Param('e','sys::E',true),new Param('f','sys::F',true),new Param('g','sys::G',true),new Param('h','sys::H',true)]),{}).am$('arity',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('bind',8192,'sys::Func',List.make(Param.type$,[new Param('args','sys::Obj?[]',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('returns',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Range.type$.am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('toList',8192,'sys::Int[]',List.make(Param.type$,[]),{}).am$('random',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('min',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('exclusive',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('end',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('start','sys::Int',false),new Param('end','sys::Int',false),new Param('exclusive','sys::Bool',false)]),{}).am$('map',8192,'sys::Obj?[]',List.make(Param.type$,[new Param('c','|sys::Int->sys::Obj?|',false)]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('inclusive',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('last',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('offset',8192,'sys::Range',List.make(Param.type$,[new Param('offset','sys::Int',false)]),{}).am$('max',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('start',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('isEmpty',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('each',8192,'sys::Void',List.make(Param.type$,[new Param('c','|sys::Int->sys::Void|',false)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('contains',8192,'sys::Bool',List.make(Param.type$,[new Param('i','sys::Int',false)]),{}).am$('makeExclusive',8196,'sys::Void',List.make(Param.type$,[new Param('start','sys::Int',false),new Param('end','sys::Int',false)]),{}).am$('fromStr',40966,'sys::Range?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('makeInclusive',8196,'sys::Void',List.make(Param.type$,[new Param('start','sys::Int',false),new Param('end','sys::Int',false)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('eachWhile',8192,'sys::Obj?',List.make(Param.type$,[new Param('c','|sys::Int->sys::Obj?|',false)]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('first',8192,'sys::Int?',List.make(Param.type$,[]),{});
IndexErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Log.type$.af$('level',73728,'sys::LogLevel',{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('log',270336,'sys::Void',List.make(Param.type$,[new Param('rec','sys::LogRec',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('isDebug',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('find',40962,'sys::Log?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('get',40962,'sys::Log',List.make(Param.type$,[new Param('name','sys::Str',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('isInfo',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('register','sys::Bool',false)]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('info',8192,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',false),new Param('err','sys::Err?',true)]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('addHandler',40962,'sys::Void',List.make(Param.type$,[new Param('handler','|sys::LogRec->sys::Void|',false)]),{}).am$('debug',8192,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',false),new Param('err','sys::Err?',true)]),{}).am$('err',8192,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',false),new Param('err','sys::Err?',true)]),{}).am$('isErr',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('removeHandler',40962,'sys::Void',List.make(Param.type$,[new Param('handler','|sys::LogRec->sys::Void|',false)]),{}).am$('list',40962,'sys::Log[]',List.make(Param.type$,[]),{}).am$('warn',8192,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',false),new Param('err','sys::Err?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('handlers',40962,'|sys::LogRec->sys::Void|[]',List.make(Param.type$,[]),{}).am$('isEnabled',8192,'sys::Bool',List.make(Param.type$,[new Param('level','sys::LogLevel',false)]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('isWarn',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{});
Weekday.type$.af$('thu',106506,'sys::Weekday',{}).af$('tue',106506,'sys::Weekday',{}).af$('vals',106498,'sys::Weekday[]',{}).af$('sun',106506,'sys::Weekday',{}).af$('mon',106506,'sys::Weekday',{}).af$('wed',106506,'sys::Weekday',{}).af$('fri',106506,'sys::Weekday',{}).af$('sat',106506,'sys::Weekday',{}).am$('localeStartOfWeek',40962,'sys::Weekday',List.make(Param.type$,[]),{}).am$('static$init',165890,'sys::Void',List.make(Param.type$,[]),{}).am$('compare',271360,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('increment',8192,'sys::Weekday',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('localeVals',40962,'sys::Weekday[]',List.make(Param.type$,[]),{}).am$('localeAbbr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',133124,'sys::Void',List.make(Param.type$,[new Param('$ordinal','sys::Int',false),new Param('$name','sys::Str',false)]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('toLocale',8192,'sys::Str',List.make(Param.type$,[new Param('pattern','sys::Str?',true),new Param('locale','sys::Locale',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('fromStr',40966,'sys::Weekday?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('doFromStr',36866,'sys::Enum?',List.make(Param.type$,[new Param('t','sys::Type',false),new Param('name','sys::Str',false),new Param('checked','sys::Bool',false)]),{}).am$('decrement',8192,'sys::Weekday',List.make(Param.type$,[]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('localeFull',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('ordinal',8192,'sys::Int',List.make(Param.type$,[]),{});
Buf.type$.af$('endian',73728,'sys::Endian',{}).af$('size',73728,'sys::Int',{}).af$('charset',73728,'sys::Charset',{}).af$('capacity',73728,'sys::Int',{}).am$('readF4',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('readDecimal',8192,'sys::Decimal',List.make(Param.type$,[]),{}).am$('readAllStr',8192,'sys::Str',List.make(Param.type$,[new Param('normalizeNewlines','sys::Bool',true)]),{}).am$('fromHex',40962,'sys::Buf',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('readBufFully',8192,'sys::Buf',List.make(Param.type$,[new Param('buf','sys::Buf?',false),new Param('n','sys::Int',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('fromBase64',40962,'sys::Buf',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('readF8',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('writeProps',8192,'sys::This',List.make(Param.type$,[new Param('props','[sys::Str:sys::Str]',false)]),{}).am$('readS2',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readS1',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readS4',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('trim',8192,'sys::This',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('getRange',8192,'sys::Buf',List.make(Param.type$,[new Param('range','sys::Range',false)]),{}).am$('readBuf',8192,'sys::Int?',List.make(Param.type$,[new Param('buf','sys::Buf',false),new Param('n','sys::Int',false)]),{}).am$('bytesEqual',8192,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Buf',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('write',8192,'sys::This',List.make(Param.type$,[new Param('byte','sys::Int',false)]),{}).am$('readS8',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('unreadChar',8192,'sys::This',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('writeI4',8192,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('printLine',8192,'sys::This',List.make(Param.type$,[new Param('obj','sys::Obj?',true)]),{}).am$('toBase64',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('writeI2',8192,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('read',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('writeI8',8192,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('in',8192,'sys::InStream',List.make(Param.type$,[]),{}).am$('toBase64Uri',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('fill',8192,'sys::This',List.make(Param.type$,[new Param('byte','sys::Int',false),new Param('times','sys::Int',false)]),{}).am$('sync',8192,'sys::This',List.make(Param.type$,[]),{}).am$('remaining',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readProps',8192,'[sys::Str:sys::Str]',List.make(Param.type$,[]),{}).am$('toHex',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('writeUtf',8192,'sys::This',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('toFile',8192,'sys::File',List.make(Param.type$,[new Param('uri','sys::Uri',false)]),{}).am$('pbk',40962,'sys::Buf',List.make(Param.type$,[new Param('algorithm','sys::Str',false),new Param('password','sys::Str',false),new Param('salt','sys::Buf',false),new Param('iterations','sys::Int',false),new Param('keyLen','sys::Int',false)]),{}).am$('writeChars',8192,'sys::This',List.make(Param.type$,[new Param('str','sys::Str',false),new Param('off','sys::Int',true),new Param('len','sys::Int',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('toDigest',8192,'sys::Buf',List.make(Param.type$,[new Param('algorithm','sys::Str',false)]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('unread',8192,'sys::This',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('writeF4',8192,'sys::This',List.make(Param.type$,[new Param('r','sys::Float',false)]),{}).am$('writeXml',8192,'sys::This',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('flags','sys::Int',true)]),{}).am$('readAllLines',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('readAllBuf',8192,'sys::Buf',List.make(Param.type$,[]),{}).am$('seek',8192,'sys::This',List.make(Param.type$,[new Param('pos','sys::Int',false)]),{}).am$('writeBool',8192,'sys::This',List.make(Param.type$,[new Param('b','sys::Bool',false)]),{}).am$('readChar',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('out',8192,'sys::OutStream',List.make(Param.type$,[]),{}).am$('readU4',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('random',40962,'sys::Buf',List.make(Param.type$,[new Param('size','sys::Int',false)]),{}).am$('flush',8192,'sys::This',List.make(Param.type$,[]),{}).am$('readUtf',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('pos',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('crc',8192,'sys::Int',List.make(Param.type$,[new Param('algorithm','sys::Str',false)]),{}).am$('readU2',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('get',8192,'sys::Int',List.make(Param.type$,[new Param('index','sys::Int',false)]),{}).am$('readU1',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('hmac',8192,'sys::Buf',List.make(Param.type$,[new Param('algorithm','sys::Str',false),new Param('key','sys::Buf',false)]),{}).am$('writeF8',8192,'sys::This',List.make(Param.type$,[new Param('r','sys::Float',false)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',40966,'sys::Buf?',List.make(Param.type$,[new Param('capacity','sys::Int',true)]),{}).am$('flip',8192,'sys::This',List.make(Param.type$,[]),{}).am$('close',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('readBool',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('set',8192,'sys::This',List.make(Param.type$,[new Param('index','sys::Int',false),new Param('byte','sys::Int',false)]),{}).am$('writeBuf',8192,'sys::This',List.make(Param.type$,[new Param('buf','sys::Buf',false),new Param('n','sys::Int',true)]),{}).am$('readObj',8192,'sys::Obj?',List.make(Param.type$,[new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('more',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('peekChar',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('isEmpty',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('clear',8192,'sys::This',List.make(Param.type$,[]),{}).am$('writeObj',8192,'sys::This',List.make(Param.type$,[new Param('obj','sys::Obj?',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('readStrToken',8192,'sys::Str?',List.make(Param.type$,[new Param('max','sys::Int?',true),new Param('c','|sys::Int->sys::Bool|?',true)]),{}).am$('readLine',8192,'sys::Str?',List.make(Param.type$,[new Param('max','sys::Int?',true)]),{}).am$('peek',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('writeChar',8192,'sys::This',List.make(Param.type$,[new Param('char','sys::Int',false)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('print',8192,'sys::This',List.make(Param.type$,[new Param('s','sys::Obj?',false)]),{}).am$('internalMake',132,'sys::Void',List.make(Param.type$,[]),{}).am$('readChars',8192,'sys::Str',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('eachLine',8192,'sys::Void',List.make(Param.type$,[new Param('f','|sys::Str->sys::Void|',false)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('writeDecimal',8192,'sys::This',List.make(Param.type$,[new Param('d','sys::Decimal',false)]),{}).am$('dup',8192,'sys::Buf',List.make(Param.type$,[]),{});
MemBuf.type$.af$('endian',73728,'sys::Endian',{}).af$('size',73728,'sys::Int',{}).af$('charset',73728,'sys::Charset',{}).af$('capacity',73728,'sys::Int',{}).am$('readF4',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('readDecimal',8192,'sys::Decimal',List.make(Param.type$,[]),{}).am$('readAllStr',8192,'sys::Str',List.make(Param.type$,[new Param('normalizeNewlines','sys::Bool',true)]),{}).am$('fromHex',40962,'sys::Buf',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('readBufFully',8192,'sys::Buf',List.make(Param.type$,[new Param('buf','sys::Buf?',false),new Param('n','sys::Int',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('fromBase64',40962,'sys::Buf',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('readF8',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('writeProps',8192,'sys::This',List.make(Param.type$,[new Param('props','[sys::Str:sys::Str]',false)]),{}).am$('readS2',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readS1',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readS4',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('trim',8192,'sys::This',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('getRange',8192,'sys::Buf',List.make(Param.type$,[new Param('range','sys::Range',false)]),{}).am$('readBuf',8192,'sys::Int?',List.make(Param.type$,[new Param('buf','sys::Buf',false),new Param('n','sys::Int',false)]),{}).am$('bytesEqual',8192,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Buf',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('write',8192,'sys::This',List.make(Param.type$,[new Param('byte','sys::Int',false)]),{}).am$('readS8',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('unreadChar',8192,'sys::This',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('init',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('writeI4',8192,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('printLine',8192,'sys::This',List.make(Param.type$,[new Param('obj','sys::Obj?',true)]),{}).am$('toBase64',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('writeI2',8192,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('read',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('writeI8',8192,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('in',8192,'sys::InStream',List.make(Param.type$,[]),{}).am$('toBase64Uri',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('fill',8192,'sys::This',List.make(Param.type$,[new Param('byte','sys::Int',false),new Param('times','sys::Int',false)]),{}).am$('sync',8192,'sys::This',List.make(Param.type$,[]),{}).am$('remaining',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readProps',8192,'[sys::Str:sys::Str]',List.make(Param.type$,[]),{}).am$('toHex',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('writeUtf',8192,'sys::This',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('toFile',8192,'sys::File',List.make(Param.type$,[new Param('uri','sys::Uri',false)]),{}).am$('pbk',40962,'sys::Buf',List.make(Param.type$,[new Param('algorithm','sys::Str',false),new Param('password','sys::Str',false),new Param('salt','sys::Buf',false),new Param('iterations','sys::Int',false),new Param('keyLen','sys::Int',false)]),{}).am$('writeChars',8192,'sys::This',List.make(Param.type$,[new Param('str','sys::Str',false),new Param('off','sys::Int',true),new Param('len','sys::Int',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('toDigest',8192,'sys::Buf',List.make(Param.type$,[new Param('algorithm','sys::Str',false)]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('unread',8192,'sys::This',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('writeF4',8192,'sys::This',List.make(Param.type$,[new Param('r','sys::Float',false)]),{}).am$('writeXml',8192,'sys::This',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('flags','sys::Int',true)]),{}).am$('readAllLines',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('readAllBuf',8192,'sys::Buf',List.make(Param.type$,[]),{}).am$('seek',8192,'sys::This',List.make(Param.type$,[new Param('pos','sys::Int',false)]),{}).am$('writeBool',8192,'sys::This',List.make(Param.type$,[new Param('b','sys::Bool',false)]),{}).am$('readChar',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('out',8192,'sys::OutStream',List.make(Param.type$,[]),{}).am$('readU4',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('random',40962,'sys::Buf',List.make(Param.type$,[new Param('size','sys::Int',false)]),{}).am$('flush',8192,'sys::This',List.make(Param.type$,[]),{}).am$('readUtf',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('pos',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('crc',8192,'sys::Int',List.make(Param.type$,[new Param('algorithm','sys::Str',false)]),{}).am$('readU2',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('get',8192,'sys::Int',List.make(Param.type$,[new Param('index','sys::Int',false)]),{}).am$('readU1',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('hmac',8192,'sys::Buf',List.make(Param.type$,[new Param('algorithm','sys::Str',false),new Param('key','sys::Buf',false)]),{}).am$('writeF8',8192,'sys::This',List.make(Param.type$,[new Param('r','sys::Float',false)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('flip',8192,'sys::This',List.make(Param.type$,[]),{}).am$('close',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('readBool',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('set',8192,'sys::This',List.make(Param.type$,[new Param('index','sys::Int',false),new Param('byte','sys::Int',false)]),{}).am$('writeBuf',8192,'sys::This',List.make(Param.type$,[new Param('buf','sys::Buf',false),new Param('n','sys::Int',true)]),{}).am$('readObj',8192,'sys::Obj?',List.make(Param.type$,[new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('more',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('peekChar',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('isEmpty',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('clear',8192,'sys::This',List.make(Param.type$,[]),{}).am$('writeObj',8192,'sys::This',List.make(Param.type$,[new Param('obj','sys::Obj?',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('readStrToken',8192,'sys::Str?',List.make(Param.type$,[new Param('max','sys::Int?',true),new Param('c','|sys::Int->sys::Bool|?',true)]),{}).am$('readLine',8192,'sys::Str?',List.make(Param.type$,[new Param('max','sys::Int?',true)]),{}).am$('peek',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('writeChar',8192,'sys::This',List.make(Param.type$,[new Param('char','sys::Int',false)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('print',8192,'sys::This',List.make(Param.type$,[new Param('s','sys::Obj?',false)]),{}).am$('readChars',8192,'sys::Str',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('eachLine',8192,'sys::Void',List.make(Param.type$,[new Param('f','|sys::Str->sys::Void|',false)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('writeDecimal',8192,'sys::This',List.make(Param.type$,[new Param('d','sys::Decimal',false)]),{}).am$('dup',8192,'sys::Buf',List.make(Param.type$,[]),{});
ConstBuf.type$.af$('endian',73728,'sys::Endian',{}).af$('size',73728,'sys::Int',{}).af$('charset',73728,'sys::Charset',{}).af$('capacity',73728,'sys::Int',{}).am$('readF4',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('readDecimal',8192,'sys::Decimal',List.make(Param.type$,[]),{}).am$('readAllStr',8192,'sys::Str',List.make(Param.type$,[new Param('normalizeNewlines','sys::Bool',true)]),{}).am$('fromHex',40962,'sys::Buf',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('readBufFully',8192,'sys::Buf',List.make(Param.type$,[new Param('buf','sys::Buf?',false),new Param('n','sys::Int',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('fromBase64',40962,'sys::Buf',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('readF8',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('writeProps',8192,'sys::This',List.make(Param.type$,[new Param('props','[sys::Str:sys::Str]',false)]),{}).am$('readS2',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readS1',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readS4',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('trim',8192,'sys::This',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('getRange',8192,'sys::Buf',List.make(Param.type$,[new Param('range','sys::Range',false)]),{}).am$('readBuf',8192,'sys::Int?',List.make(Param.type$,[new Param('buf','sys::Buf',false),new Param('n','sys::Int',false)]),{}).am$('bytesEqual',8192,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Buf',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('write',8192,'sys::This',List.make(Param.type$,[new Param('byte','sys::Int',false)]),{}).am$('readS8',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('unreadChar',8192,'sys::This',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('init',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('writeI4',8192,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('printLine',8192,'sys::This',List.make(Param.type$,[new Param('obj','sys::Obj?',true)]),{}).am$('toBase64',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('writeI2',8192,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('read',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('writeI8',8192,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('in',8192,'sys::InStream',List.make(Param.type$,[]),{}).am$('toBase64Uri',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('fill',8192,'sys::This',List.make(Param.type$,[new Param('byte','sys::Int',false),new Param('times','sys::Int',false)]),{}).am$('sync',8192,'sys::This',List.make(Param.type$,[]),{}).am$('remaining',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readProps',8192,'[sys::Str:sys::Str]',List.make(Param.type$,[]),{}).am$('toHex',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('writeUtf',8192,'sys::This',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('toFile',8192,'sys::File',List.make(Param.type$,[new Param('uri','sys::Uri',false)]),{}).am$('pbk',40962,'sys::Buf',List.make(Param.type$,[new Param('algorithm','sys::Str',false),new Param('password','sys::Str',false),new Param('salt','sys::Buf',false),new Param('iterations','sys::Int',false),new Param('keyLen','sys::Int',false)]),{}).am$('writeChars',8192,'sys::This',List.make(Param.type$,[new Param('str','sys::Str',false),new Param('off','sys::Int',true),new Param('len','sys::Int',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('toDigest',8192,'sys::Buf',List.make(Param.type$,[new Param('algorithm','sys::Str',false)]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('unread',8192,'sys::This',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('writeF4',8192,'sys::This',List.make(Param.type$,[new Param('r','sys::Float',false)]),{}).am$('writeXml',8192,'sys::This',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('flags','sys::Int',true)]),{}).am$('readAllLines',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('readAllBuf',8192,'sys::Buf',List.make(Param.type$,[]),{}).am$('seek',8192,'sys::This',List.make(Param.type$,[new Param('pos','sys::Int',false)]),{}).am$('writeBool',8192,'sys::This',List.make(Param.type$,[new Param('b','sys::Bool',false)]),{}).am$('readChar',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('out',8192,'sys::OutStream',List.make(Param.type$,[]),{}).am$('readU4',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('random',40962,'sys::Buf',List.make(Param.type$,[new Param('size','sys::Int',false)]),{}).am$('flush',8192,'sys::This',List.make(Param.type$,[]),{}).am$('readUtf',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('pos',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('crc',8192,'sys::Int',List.make(Param.type$,[new Param('algorithm','sys::Str',false)]),{}).am$('readU2',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('get',8192,'sys::Int',List.make(Param.type$,[new Param('index','sys::Int',false)]),{}).am$('readU1',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('hmac',8192,'sys::Buf',List.make(Param.type$,[new Param('algorithm','sys::Str',false),new Param('key','sys::Buf',false)]),{}).am$('writeF8',8192,'sys::This',List.make(Param.type$,[new Param('r','sys::Float',false)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('flip',8192,'sys::This',List.make(Param.type$,[]),{}).am$('close',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('readBool',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('set',8192,'sys::This',List.make(Param.type$,[new Param('index','sys::Int',false),new Param('byte','sys::Int',false)]),{}).am$('writeBuf',8192,'sys::This',List.make(Param.type$,[new Param('buf','sys::Buf',false),new Param('n','sys::Int',true)]),{}).am$('readObj',8192,'sys::Obj?',List.make(Param.type$,[new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('more',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('peekChar',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('isEmpty',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('clear',8192,'sys::This',List.make(Param.type$,[]),{}).am$('writeObj',8192,'sys::This',List.make(Param.type$,[new Param('obj','sys::Obj?',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('readStrToken',8192,'sys::Str?',List.make(Param.type$,[new Param('max','sys::Int?',true),new Param('c','|sys::Int->sys::Bool|?',true)]),{}).am$('readLine',8192,'sys::Str?',List.make(Param.type$,[new Param('max','sys::Int?',true)]),{}).am$('peek',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('writeChar',8192,'sys::This',List.make(Param.type$,[new Param('char','sys::Int',false)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('print',8192,'sys::This',List.make(Param.type$,[new Param('s','sys::Obj?',false)]),{}).am$('readChars',8192,'sys::Str',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('eachLine',8192,'sys::Void',List.make(Param.type$,[new Param('f','|sys::Str->sys::Void|',false)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('writeDecimal',8192,'sys::This',List.make(Param.type$,[new Param('d','sys::Decimal',false)]),{}).am$('dup',8192,'sys::Buf',List.make(Param.type$,[]),{});
Charset.type$.am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('utf8',40962,'sys::Charset',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('utf16BE',40962,'sys::Charset',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('fromStr',40966,'sys::Charset?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('utf16LE',40962,'sys::Charset',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('defVal',40962,'sys::Charset',List.make(Param.type$,[]),{});
Zip.type$.am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('gzipOutStream',40962,'sys::OutStream',List.make(Param.type$,[new Param('out','sys::OutStream',false)]),{}).am$('unzipInto',40962,'sys::Int',List.make(Param.type$,[new Param('zip','sys::File',false),new Param('dir','sys::File',false)]),{}).am$('file',8192,'sys::File?',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('writeNext',8192,'sys::OutStream',List.make(Param.type$,[new Param('path','sys::Uri',false),new Param('modifyTime','sys::DateTime',true),new Param('opts','[sys::Str:sys::Obj?]?',true)]),{}).am$('finish',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('gzipInStream',40962,'sys::InStream',List.make(Param.type$,[new Param('in','sys::InStream',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('write',40962,'sys::Zip',List.make(Param.type$,[new Param('out','sys::OutStream',false)]),{}).am$('close',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('init',2052,'sys::Void',List.make(Param.type$,[new Param('uri','sys::Uri',false)]),{}).am$('read',40962,'sys::Zip',List.make(Param.type$,[new Param('in','sys::InStream',false)]),{}).am$('deflateOutStream',40962,'sys::OutStream',List.make(Param.type$,[new Param('out','sys::OutStream',false),new Param('opts','[sys::Str:sys::Obj?]?',true)]),{}).am$('readNext',8192,'sys::File?',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('readEach',8192,'sys::Void',List.make(Param.type$,[new Param('c','|sys::File->sys::Void|',false)]),{}).am$('contents',8192,'[sys::Uri:sys::File]?',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('deflateInStream',40962,'sys::InStream',List.make(Param.type$,[new Param('in','sys::InStream',false),new Param('opts','[sys::Str:sys::Obj?]?',true)]),{}).am$('open',40962,'sys::Zip',List.make(Param.type$,[new Param('file','sys::File',false)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{});
Depend.type$.am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('isPlus',8192,'sys::Bool',List.make(Param.type$,[new Param('index','sys::Int',true)]),{}).am$('match',8192,'sys::Bool',List.make(Param.type$,[new Param('version','sys::Version',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('version',8192,'sys::Version',List.make(Param.type$,[new Param('index','sys::Int',true)]),{}).am$('isRange',8192,'sys::Bool',List.make(Param.type$,[new Param('index','sys::Int',true)]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('fromStr',40966,'sys::Depend?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('size',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('isSimple',8192,'sys::Bool',List.make(Param.type$,[new Param('index','sys::Int',true)]),{}).am$('endVersion',8192,'sys::Version',List.make(Param.type$,[new Param('index','sys::Int',true)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Str.type$.af$('defVal',106498,'sys::Str',{}).am$('mult',8192,'sys::Str',List.make(Param.type$,[new Param('times','sys::Int',false)]),{}).am$('getSafe',8192,'sys::Int',List.make(Param.type$,[new Param('index','sys::Int',false),new Param('def','sys::Int',true)]),{}).am$('upper',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('replace',8192,'sys::Str',List.make(Param.type$,[new Param('from','sys::Str',false),new Param('to','sys::Str',false)]),{}).am$('indexr',8192,'sys::Int?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('offset','sys::Int',true)]),{}).am$('toDisplayName',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('localeDecapitalize',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('justr',8192,'sys::Str',List.make(Param.type$,[new Param('width','sys::Int',false)]),{}).am$('toXml',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('padr',8192,'sys::Str',List.make(Param.type$,[new Param('width','sys::Int',false),new Param('char','sys::Int',true)]),{}).am$('justl',8192,'sys::Str',List.make(Param.type$,[new Param('width','sys::Int',false)]),{}).am$('trimEnd',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('localeCompare',8192,'sys::Int',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('padl',8192,'sys::Str',List.make(Param.type$,[new Param('width','sys::Int',false),new Param('char','sys::Int',true)]),{}).am$('isSpace',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('localeUpper',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('split',8192,'sys::Str[]',List.make(Param.type$,[new Param('separator','sys::Int?',true),new Param('trim','sys::Bool',true)]),{}).am$('trim',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('getRange',8192,'sys::Str',List.make(Param.type$,[new Param('range','sys::Range',false)]),{}).am$('isUpper',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('numNewlines',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('equalsIgnoreCase',8192,'sys::Bool',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('toDecimal',8192,'sys::Decimal?',List.make(Param.type$,[new Param('checked','sys::Bool',true)]),{}).am$('indexIgnoreCase',8192,'sys::Int?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('offset','sys::Int',true)]),{}).am$('trimStart',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('all',8192,'sys::Bool',List.make(Param.type$,[new Param('c','|sys::Int,sys::Int->sys::Bool|',false)]),{}).am$('isAlphaNum',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('in',8192,'sys::InStream',List.make(Param.type$,[]),{}).am$('isAlpha',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('toCode',8192,'sys::Str',List.make(Param.type$,[new Param('quote','sys::Int?',true),new Param('escapeUnicode','sys::Bool',true)]),{}).am$('lower',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('index',8192,'sys::Int?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('offset','sys::Int',true)]),{}).am$('splitLines',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('toBool',8192,'sys::Bool?',List.make(Param.type$,[new Param('checked','sys::Bool',true)]),{}).am$('eachr',8192,'sys::Void',List.make(Param.type$,[new Param('c','|sys::Int,sys::Int->sys::Void|',false)]),{}).am$('plus',8192,'sys::Str',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('each',8192,'sys::Void',List.make(Param.type$,[new Param('c','|sys::Int,sys::Int->sys::Void|',false)]),{}).am$('capitalize',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('localeCapitalize',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('contains',8192,'sys::Bool',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('isAscii',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('size',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('endsWith',8192,'sys::Bool',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('spaces',40962,'sys::Str',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('localeLower',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('compareIgnoreCase',8192,'sys::Int',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('compare',271360,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('containsChar',8192,'sys::Bool',List.make(Param.type$,[new Param('ch','sys::Int',false)]),{}).am$('decapitalize',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('get',8192,'sys::Int',List.make(Param.type$,[new Param('index','sys::Int',false)]),{}).am$('fromDisplayName',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('trimToNull',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('toLocale',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toInt',8192,'sys::Int?',List.make(Param.type$,[new Param('radix','sys::Int',true),new Param('checked','sys::Bool',true)]),{}).am$('intern',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toRegex',8192,'sys::Regex',List.make(Param.type$,[]),{}).am$('toUri',8192,'sys::Uri',List.make(Param.type$,[]),{}).am$('isEmpty',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('toFloat',8192,'sys::Float?',List.make(Param.type$,[new Param('checked','sys::Bool',true)]),{}).am$('fromChars',40962,'sys::Str',List.make(Param.type$,[new Param('chars','sys::Int[]',false)]),{}).am$('reverse',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('any',8192,'sys::Bool',List.make(Param.type$,[new Param('c','|sys::Int,sys::Int->sys::Bool|',false)]),{}).am$('toBuf',8192,'sys::Buf',List.make(Param.type$,[new Param('charset','sys::Charset',true)]),{}).am$('indexrIgnoreCase',8192,'sys::Int?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('offset','sys::Int',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('isLower',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('eachWhile',8192,'sys::Obj?',List.make(Param.type$,[new Param('c','|sys::Int,sys::Int->sys::Obj?|',false)]),{}).am$('chars',8192,'sys::Int[]',List.make(Param.type$,[]),{}).am$('startsWith',8192,'sys::Bool',List.make(Param.type$,[new Param('s','sys::Str',false)]),{});
Bool.type$.af$('defVal',106498,'sys::Bool',{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('toLocale',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('or',8192,'sys::Bool',List.make(Param.type$,[new Param('b','sys::Bool',false)]),{}).am$('toCode',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('not',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('fromStr',40966,'sys::Bool?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('and',8192,'sys::Bool',List.make(Param.type$,[new Param('b','sys::Bool',false)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('xor',8192,'sys::Bool',List.make(Param.type$,[new Param('b','sys::Bool',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
MimeType.type$.am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('charset',8192,'sys::Charset',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('noParams',8192,'sys::MimeType',List.make(Param.type$,[]),{}).am$('forExt',40962,'sys::MimeType?',List.make(Param.type$,[new Param('ext','sys::Str',false)]),{}).am$('mediaType',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('params',8192,'[sys::Str:sys::Str]',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('fromStr',40966,'sys::MimeType?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('subType',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('parseParams',40962,'[sys::Str:sys::Str]?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('isText',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Regex.type$.af$('defVal',106498,'sys::Regex',{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('glob',40962,'sys::Regex',List.make(Param.type$,[new Param('pattern','sys::Str',false)]),{}).am$('flags',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('matcher',8192,'sys::RegexMatcher',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('matches',8192,'sys::Bool',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('quote',40962,'sys::Regex',List.make(Param.type$,[new Param('str','sys::Str',false)]),{}).am$('split',8192,'sys::Str[]',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('limit','sys::Int',true)]),{}).am$('fromStr',40966,'sys::Regex?',List.make(Param.type$,[new Param('pattern','sys::Str',false),new Param('flags','sys::Str',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
OutStream.type$.af$('charset',73728,'sys::Charset',{}).af$('endian',73728,'sys::Endian',{}).af$('xmlEscQuotes',106498,'sys::Int',{}).af$('xmlEscUnicode',106498,'sys::Int',{}).af$('xmlEscNewlines',106498,'sys::Int',{}).am$('static$init',165890,'sys::Void',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('writeF4',8192,'sys::This',List.make(Param.type$,[new Param('r','sys::Float',false)]),{}).am$('writeXml',8192,'sys::This',List.make(Param.type$,[new Param('str','sys::Str',false),new Param('mode','sys::Int',true)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('writeBool',8192,'sys::This',List.make(Param.type$,[new Param('b','sys::Bool',false)]),{}).am$('writeProps',8192,'sys::This',List.make(Param.type$,[new Param('props','[sys::Str:sys::Str]',false),new Param('close','sys::Bool',true)]),{}).am$('flush',270336,'sys::This',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('numPendingBits',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('writeF8',8192,'sys::This',List.make(Param.type$,[new Param('r','sys::Float',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',4100,'sys::Void',List.make(Param.type$,[new Param('out','sys::OutStream?',false)]),{}).am$('write',270336,'sys::This',List.make(Param.type$,[new Param('byte','sys::Int',false)]),{}).am$('close',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('writeI4',8192,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('writeBits',8192,'sys::This',List.make(Param.type$,[new Param('val','sys::Int',false),new Param('num','sys::Int',false)]),{}).am$('printLine',8192,'sys::This',List.make(Param.type$,[new Param('obj','sys::Obj?',true)]),{}).am$('writeI2',8192,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('writeBuf',270336,'sys::This',List.make(Param.type$,[new Param('buf','sys::Buf',false),new Param('n','sys::Int',true)]),{}).am$('writeI8',8192,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('writeObj',8192,'sys::This',List.make(Param.type$,[new Param('obj','sys::Obj?',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('sync',270336,'sys::This',List.make(Param.type$,[]),{}).am$('writeChar',8192,'sys::This',List.make(Param.type$,[new Param('char','sys::Int',false)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('print',8192,'sys::This',List.make(Param.type$,[new Param('s','sys::Obj?',false)]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('writeUtf',8192,'sys::This',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('writeDecimal',8192,'sys::This',List.make(Param.type$,[new Param('d','sys::Decimal',false)]),{}).am$('writeChars',8192,'sys::This',List.make(Param.type$,[new Param('str','sys::Str',false),new Param('off','sys::Int',true),new Param('len','sys::Int',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{});
SysOutStream.type$.af$('charset',73728,'sys::Charset',{}).af$('endian',73728,'sys::Endian',{}).af$('xmlEscQuotes',106498,'sys::Int',{}).af$('xmlEscUnicode',106498,'sys::Int',{}).af$('xmlEscNewlines',106498,'sys::Int',{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('writeF4',8192,'sys::This',List.make(Param.type$,[new Param('r','sys::Float',false)]),{}).am$('writeXml',8192,'sys::This',List.make(Param.type$,[new Param('str','sys::Str',false),new Param('mode','sys::Int',true)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('writeBool',8192,'sys::This',List.make(Param.type$,[new Param('b','sys::Bool',false)]),{}).am$('writeProps',8192,'sys::This',List.make(Param.type$,[new Param('props','[sys::Str:sys::Str]',false),new Param('close','sys::Bool',true)]),{}).am$('flush',271360,'sys::This',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('numPendingBits',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('writeF8',8192,'sys::This',List.make(Param.type$,[new Param('r','sys::Float',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('write',271360,'sys::This',List.make(Param.type$,[new Param('byte','sys::Int',false)]),{}).am$('close',271360,'sys::Bool',List.make(Param.type$,[]),{}).am$('make',139268,'sys::Void',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('writeI4',8192,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('writeBits',8192,'sys::This',List.make(Param.type$,[new Param('val','sys::Int',false),new Param('num','sys::Int',false)]),{}).am$('printLine',8192,'sys::This',List.make(Param.type$,[new Param('obj','sys::Obj?',true)]),{}).am$('writeI2',8192,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('writeBuf',271360,'sys::This',List.make(Param.type$,[new Param('buf','sys::Buf',false),new Param('n','sys::Int',true)]),{}).am$('writeI8',8192,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('writeObj',8192,'sys::This',List.make(Param.type$,[new Param('obj','sys::Obj?',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('sync',270336,'sys::This',List.make(Param.type$,[]),{}).am$('writeChar',8192,'sys::This',List.make(Param.type$,[new Param('char','sys::Int',false)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('print',8192,'sys::This',List.make(Param.type$,[new Param('s','sys::Obj?',false)]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('writeUtf',8192,'sys::This',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('writeDecimal',8192,'sys::This',List.make(Param.type$,[new Param('d','sys::Decimal',false)]),{}).am$('writeChars',8192,'sys::This',List.make(Param.type$,[new Param('str','sys::Str',false),new Param('off','sys::Int',true),new Param('len','sys::Int',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{});
LogLevel.type$.af$('silent',106506,'sys::LogLevel',{}).af$('debug',106506,'sys::LogLevel',{}).af$('err',106506,'sys::LogLevel',{}).af$('vals',106498,'sys::LogLevel[]',{}).af$('warn',106506,'sys::LogLevel',{}).af$('info',106506,'sys::LogLevel',{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('static$init',165890,'sys::Void',List.make(Param.type$,[]),{}).am$('compare',271360,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('fromStr',40966,'sys::LogLevel?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('doFromStr',36866,'sys::Enum?',List.make(Param.type$,[new Param('t','sys::Type',false),new Param('name','sys::Str',false),new Param('checked','sys::Bool',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',133124,'sys::Void',List.make(Param.type$,[new Param('$ordinal','sys::Int',false),new Param('$name','sys::Str',false)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('ordinal',8192,'sys::Int',List.make(Param.type$,[]),{});
Time.type$.af$('defVal',106498,'sys::Time',{}).am$('minus',8192,'sys::Time',List.make(Param.type$,[new Param('dur','sys::Duration',false)]),{}).am$('compare',271360,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('fromLocale',40962,'sys::Time?',List.make(Param.type$,[new Param('str','sys::Str',false),new Param('pattern','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('nanoSec',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('sec',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('min',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('hour',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('now',40962,'sys::Time',List.make(Param.type$,[new Param('tz','sys::TimeZone',true)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toIso',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',40966,'sys::Time?',List.make(Param.type$,[new Param('hour','sys::Int',false),new Param('min','sys::Int',false),new Param('sec','sys::Int',true),new Param('ns','sys::Int',true)]),{}).am$('toDateTime',8192,'sys::DateTime',List.make(Param.type$,[new Param('d','sys::Date',false),new Param('tz','sys::TimeZone',true)]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('toLocale',8192,'sys::Str',List.make(Param.type$,[new Param('pattern','sys::Str?',true),new Param('locale','sys::Locale',true)]),{}).am$('toCode',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('fromDuration',40962,'sys::Time',List.make(Param.type$,[new Param('d','sys::Duration',false)]),{}).am$('fromIso',40962,'sys::Time?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('plus',8192,'sys::Time',List.make(Param.type$,[new Param('dur','sys::Duration',false)]),{}).am$('isMidnight',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('fromStr',40966,'sys::Time?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('toDuration',8192,'sys::Duration',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{});
UnknownTypeErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
UriScheme.type$.am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('find',40962,'sys::UriScheme?',List.make(Param.type$,[new Param('scheme','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('get',270337,'sys::Obj?',List.make(Param.type$,[new Param('uri','sys::Uri',false),new Param('base','sys::Obj?',false)]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',139268,'sys::Void',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Month.type$.af$('jul',106506,'sys::Month',{}).af$('feb',106506,'sys::Month',{}).af$('jun',106506,'sys::Month',{}).af$('dec',106506,'sys::Month',{}).af$('vals',106498,'sys::Month[]',{}).af$('nov',106506,'sys::Month',{}).af$('jan',106506,'sys::Month',{}).af$('mar',106506,'sys::Month',{}).af$('sep',106506,'sys::Month',{}).af$('oct',106506,'sys::Month',{}).af$('apr',106506,'sys::Month',{}).af$('may',106506,'sys::Month',{}).af$('aug',106506,'sys::Month',{}).am$('static$init',165890,'sys::Void',List.make(Param.type$,[]),{}).am$('compare',271360,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('increment',8192,'sys::Month',List.make(Param.type$,[]),{}).am$('numDays',8192,'sys::Int',List.make(Param.type$,[new Param('year','sys::Int',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('localeAbbr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',133124,'sys::Void',List.make(Param.type$,[new Param('$ordinal','sys::Int',false),new Param('$name','sys::Str',false)]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('toLocale',8192,'sys::Str',List.make(Param.type$,[new Param('pattern','sys::Str?',true),new Param('locale','sys::Locale',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('fromStr',40966,'sys::Month?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('doFromStr',36866,'sys::Enum?',List.make(Param.type$,[new Param('t','sys::Type',false),new Param('name','sys::Str',false),new Param('checked','sys::Bool',false)]),{}).am$('decrement',8192,'sys::Month',List.make(Param.type$,[]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('localeFull',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('ordinal',8192,'sys::Int',List.make(Param.type$,[]),{});
CastErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
ParseErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
DateTime.type$.af$('defVal',106498,'sys::DateTime',{}).am$('date',8192,'sys::Date',List.make(Param.type$,[]),{}).am$('weekOfYear',8192,'sys::Int',List.make(Param.type$,[new Param('startOfWeek','sys::Weekday',true)]),{}).am$('year',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('dayOfYear',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('tz',8192,'sys::TimeZone',List.make(Param.type$,[]),{}).am$('weekday',8192,'sys::Weekday',List.make(Param.type$,[]),{}).am$('toRel',8192,'sys::DateTime',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('toJava',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('hoursInDay',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('nowUnique',40962,'sys::Int',List.make(Param.type$,[]),{}).am$('toIso',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('day',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('tzAbbr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('toCode',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('fromJava',40962,'sys::DateTime?',List.make(Param.type$,[new Param('millis','sys::Int',false),new Param('tz','sys::TimeZone',true),new Param('negIsNull','sys::Bool',true)]),{}).am$('plus',8192,'sys::DateTime',List.make(Param.type$,[new Param('duration','sys::Duration',false)]),{}).am$('fromStr',40966,'sys::DateTime?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('month',8192,'sys::Month',List.make(Param.type$,[]),{}).am$('nowTicks',40962,'sys::Int',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('toUtc',8192,'sys::DateTime',List.make(Param.type$,[]),{}).am$('minus',8192,'sys::DateTime',List.make(Param.type$,[new Param('duration','sys::Duration',false)]),{}).am$('compare',271360,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('weekdayInMonth',40962,'sys::Int',List.make(Param.type$,[new Param('year','sys::Int',false),new Param('mon','sys::Month',false),new Param('weekday','sys::Weekday',false),new Param('pos','sys::Int',false)]),{}).am$('dst',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('minusDateTime',8192,'sys::Duration',List.make(Param.type$,[new Param('time','sys::DateTime',false)]),{}).am$('fromLocale',40962,'sys::DateTime?',List.make(Param.type$,[new Param('str','sys::Str',false),new Param('pattern','sys::Str',false),new Param('tz','sys::TimeZone',true),new Param('checked','sys::Bool',true)]),{}).am$('nanoSec',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('toTimeZone',8192,'sys::DateTime',List.make(Param.type$,[new Param('tz','sys::TimeZone',false)]),{}).am$('sec',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('min',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('hour',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('fromHttpStr',40962,'sys::DateTime?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('now',40962,'sys::DateTime',List.make(Param.type$,[new Param('tolerance','sys::Duration?',true)]),{}).am$('boot',40962,'sys::DateTime',List.make(Param.type$,[]),{}).am$('floor',8192,'sys::DateTime',List.make(Param.type$,[new Param('accuracy','sys::Duration',false)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',40966,'sys::DateTime?',List.make(Param.type$,[new Param('year','sys::Int',false),new Param('month','sys::Month',false),new Param('day','sys::Int',false),new Param('hour','sys::Int',false),new Param('min','sys::Int',false),new Param('sec','sys::Int',true),new Param('ns','sys::Int',true),new Param('tz','sys::TimeZone',true)]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toHttpStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toLocale',8192,'sys::Str',List.make(Param.type$,[new Param('pattern','sys::Str?',true),new Param('locale','sys::Locale',true)]),{}).am$('midnight',8192,'sys::DateTime',List.make(Param.type$,[]),{}).am$('ticks',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('nowUtc',40962,'sys::DateTime',List.make(Param.type$,[new Param('tolerance','sys::Duration?',true)]),{}).am$('isLeapYear',40962,'sys::Bool',List.make(Param.type$,[new Param('year','sys::Int',false)]),{}).am$('fromIso',40962,'sys::DateTime?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isMidnight',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('makeTicks',40962,'sys::DateTime',List.make(Param.type$,[new Param('ticks','sys::Int',false),new Param('tz','sys::TimeZone',true)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('time',8192,'sys::Time',List.make(Param.type$,[]),{});
NotImmutableErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
UnknownPodErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
List.type$.af$('size',73728,'sys::Int',{}).af$('capacity',73728,'sys::Int',{}).am$('indexSame',8192,'sys::Int?',List.make(Param.type$,[new Param('item','sys::V',false),new Param('offset','sys::Int',true)]),{}).am$('addNotNull',8192,'sys::L',List.make(Param.type$,[new Param('item','sys::V?',false)]),{}).am$('getSafe',8192,'sys::V?',List.make(Param.type$,[new Param('index','sys::Int',false),new Param('def','sys::V?',true)]),{}).am$('makeObj',8196,'sys::Void',List.make(Param.type$,[new Param('capacity','sys::Int',false)]),{}).am$('indexr',8192,'sys::Int?',List.make(Param.type$,[new Param('item','sys::V',false),new Param('offset','sys::Int',true)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('findAll',8192,'sys::L',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Bool|',false)]),{}).am$('flatten',8192,'sys::Obj?[]',List.make(Param.type$,[]),{}).am$('removeAll',8192,'sys::L',List.make(Param.type$,[new Param('list','sys::L',false)]),{}).am$('trim',8192,'sys::L',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('getRange',8192,'sys::L',List.make(Param.type$,[new Param('range','sys::Range',false)]),{}).am$('find',8192,'sys::V?',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Bool|',false)]),{}).am$('findType',8192,'sys::L',List.make(Param.type$,[new Param('t','sys::Type',false)]),{}).am$('intersection',8192,'sys::L',List.make(Param.type$,[new Param('that','sys::L',false)]),{}).am$('exclude',8192,'sys::L',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Bool|',false)]),{}).am$('join',8192,'sys::Str',List.make(Param.type$,[new Param('separator','sys::Str',true),new Param('c','|sys::V,sys::Int->sys::Str|?',true)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('sortr',8192,'sys::L',List.make(Param.type$,[new Param('c','|sys::V,sys::V->sys::Int|?',true)]),{}).am$('add',8192,'sys::L',List.make(Param.type$,[new Param('item','sys::V',false)]),{}).am$('all',8192,'sys::Bool',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Bool|',false)]),{}).am$('reduce',8192,'sys::Obj?',List.make(Param.type$,[new Param('init','sys::Obj?',false),new Param('c','|sys::Obj?,sys::V,sys::Int->sys::Obj?|',false)]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('last',8192,'sys::V?',List.make(Param.type$,[]),{}).am$('setNotNull',8192,'sys::L',List.make(Param.type$,[new Param('index','sys::Int',false),new Param('item','sys::V?',false)]),{}).am$('binaryFind',8192,'sys::Int',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Int|',false)]),{}).am$('swap',8192,'sys::L',List.make(Param.type$,[new Param('indexA','sys::Int',false),new Param('indexB','sys::Int',false)]),{}).am$('toCode',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('eachrWhile',8192,'sys::Obj?',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Obj?|',false)]),{}).am$('containsAny',8192,'sys::Bool',List.make(Param.type$,[new Param('list','sys::L',false)]),{}).am$('index',8192,'sys::Int?',List.make(Param.type$,[new Param('item','sys::V',false),new Param('offset','sys::Int',true)]),{}).am$('sort',8192,'sys::L',List.make(Param.type$,[new Param('c','|sys::V,sys::V->sys::Int|?',true)]),{}).am$('fill',8192,'sys::L',List.make(Param.type$,[new Param('val','sys::V',false),new Param('times','sys::Int',false)]),{}).am$('eachr',8192,'sys::Void',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Void|',false)]),{}).am$('push',8192,'sys::L',List.make(Param.type$,[new Param('item','sys::V',false)]),{}).am$('each',8192,'sys::Void',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Void|',false)]),{}).am$('eachNotNull',8192,'sys::Void',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Void|',false)]),{}).am$('mapNotNull',8192,'sys::Obj[]',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Obj?|',false)]),{}).am$('flatMap',8192,'sys::Obj?[]',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Obj?[]|',false)]),{}).am$('contains',8192,'sys::Bool',List.make(Param.type$,[new Param('item','sys::V',false)]),{}).am$('findNotNull',8192,'sys::L',List.make(Param.type$,[]),{}).am$('unique',8192,'sys::L',List.make(Param.type$,[]),{}).am$('removeAt',8192,'sys::V',List.make(Param.type$,[new Param('index','sys::Int',false)]),{}).am$('insertAll',8192,'sys::L',List.make(Param.type$,[new Param('index','sys::Int',false),new Param('list','sys::L',false)]),{}).am$('ro',8192,'sys::L',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('eachRange',8192,'sys::Void',List.make(Param.type$,[new Param('r','sys::Range',false),new Param('c','|sys::V,sys::Int->sys::Void|',false)]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('groupByInto',8192,'[sys::Obj:sys::L]',List.make(Param.type$,[new Param('map','[sys::Obj:sys::L]',false),new Param('c','|sys::V,sys::Int->sys::Obj|',false)]),{}).am$('rw',8192,'sys::L',List.make(Param.type$,[]),{}).am$('insert',8192,'sys::L',List.make(Param.type$,[new Param('index','sys::Int',false),new Param('item','sys::V',false)]),{}).am$('groupBy',8192,'[sys::Obj:sys::L]',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Obj|',false)]),{}).am$('binarySearch',8192,'sys::Int',List.make(Param.type$,[new Param('key','sys::V',false),new Param('c','|sys::V,sys::V->sys::Int|?',true)]),{}).am$('remove',8192,'sys::V?',List.make(Param.type$,[new Param('item','sys::V',false)]),{}).am$('pop',8192,'sys::V?',List.make(Param.type$,[]),{}).am$('random',8192,'sys::V?',List.make(Param.type$,[]),{}).am$('min',8192,'sys::V?',List.make(Param.type$,[new Param('c','|sys::V,sys::V->sys::Int|?',true)]),{}).am$('addIfNotNull',8192,'sys::L',List.make(Param.type$,[new Param('item','sys::V?',false)]),{}).am$('isRO',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('of',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('get',8192,'sys::V',List.make(Param.type$,[new Param('index','sys::Int',false)]),{}).am$('removeRange',8192,'sys::L',List.make(Param.type$,[new Param('r','sys::Range',false)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('of','sys::Type',false),new Param('capacity','sys::Int',false)]),{}).am$('map',8192,'sys::Obj?[]',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Obj?|',false)]),{}).am$('isRW',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('set',8192,'sys::L',List.make(Param.type$,[new Param('index','sys::Int',false),new Param('item','sys::V',false)]),{}).am$('max',8192,'sys::V?',List.make(Param.type$,[new Param('c','|sys::V,sys::V->sys::Int|?',true)]),{}).am$('containsAll',8192,'sys::Bool',List.make(Param.type$,[new Param('list','sys::L',false)]),{}).am$('isEmpty',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('clear',8192,'sys::L',List.make(Param.type$,[]),{}).am$('union',8192,'sys::L',List.make(Param.type$,[new Param('that','sys::L',false)]),{}).am$('reverse',8192,'sys::L',List.make(Param.type$,[]),{}).am$('any',8192,'sys::Bool',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Bool|',false)]),{}).am$('peek',8192,'sys::V?',List.make(Param.type$,[]),{}).am$('removeSame',8192,'sys::V?',List.make(Param.type$,[new Param('item','sys::V',false)]),{}).am$('findIndex',8192,'sys::Int?',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Bool|',false)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('addAll',8192,'sys::L',List.make(Param.type$,[new Param('list','sys::L',false)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('containsSame',8192,'sys::Bool',List.make(Param.type$,[new Param('item','sys::V',false)]),{}).am$('shuffle',8192,'sys::L',List.make(Param.type$,[]),{}).am$('eachWhile',8192,'sys::Obj?',List.make(Param.type$,[new Param('c','|sys::V,sys::Int->sys::Obj?|',false)]),{}).am$('first',8192,'sys::V?',List.make(Param.type$,[]),{}).am$('dup',8192,'sys::L',List.make(Param.type$,[]),{}).am$('moveTo',8192,'sys::L',List.make(Param.type$,[new Param('item','sys::V?',false),new Param('toIndex','sys::Int',false)]),{});
FileStore.type$.am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('freeSpace',270337,'sys::Int?',List.make(Param.type$,[]),{}).am$('availSpace',270337,'sys::Int?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('totalSpace',270337,'sys::Int?',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('makeNew',4100,'sys::Void',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Unit.type$.am$('symbol',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('A',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('mult',8192,'sys::Unit',List.make(Param.type$,[new Param('that','sys::Unit',false)]),{}).am$('quantities',40962,'sys::Str[]',List.make(Param.type$,[]),{}).am$('scale',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('dim',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('K',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('mol',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('sec',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('div',8192,'sys::Unit',List.make(Param.type$,[new Param('b','sys::Unit',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('define',40962,'sys::Unit',List.make(Param.type$,[new Param('s','sys::Str',false)]),{}).am$('definition',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('kg',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',139268,'sys::Void',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('cd',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('quantity',40962,'sys::Unit[]',List.make(Param.type$,[new Param('quantity','sys::Str',false)]),{}).am$('offset',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('convertTo',8192,'sys::Float',List.make(Param.type$,[new Param('scalar','sys::Float',false),new Param('unit','sys::Unit',false)]),{}).am$('list',40962,'sys::Unit[]',List.make(Param.type$,[]),{}).am$('m',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('fromStr',40966,'sys::Unit?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('ids',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{});
RegexMatcher.type$.am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('start',8192,'sys::Int',List.make(Param.type$,[new Param('group','sys::Int',true)]),{}).am$('replaceFirst',8192,'sys::Str',List.make(Param.type$,[new Param('replacement','sys::Str',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('matches',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('replaceAll',8192,'sys::Str',List.make(Param.type$,[new Param('replacement','sys::Str',false)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('groupCount',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('find',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('end',8192,'sys::Int',List.make(Param.type$,[new Param('group','sys::Int',true)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('group',8192,'sys::Str?',List.make(Param.type$,[new Param('group','sys::Int',true)]),{});
Slot.type$.am$('parent',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('hasFacet',8192,'sys::Bool',List.make(Param.type$,[new Param('type','sys::Type',false)]),{}).am$('isStatic',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('signature',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('isField',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isSynthetic',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('isPrivate',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isNative',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('facets',8192,'sys::Facet[]',List.make(Param.type$,[]),{}).am$('isProtected',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('findMethod',40962,'sys::Method?',List.make(Param.type$,[new Param('qname','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('find',40962,'sys::Slot?',List.make(Param.type$,[new Param('qname','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isConst',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('qname',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('isOverride',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isMethod',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isPublic',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',132,'sys::Void',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('findFunc',40962,'sys::Func?',List.make(Param.type$,[new Param('qname','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isAbstract',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isInternal',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('doc',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('isVirtual',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('findField',40962,'sys::Field?',List.make(Param.type$,[new Param('qname','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('facet',8192,'sys::Facet?',List.make(Param.type$,[new Param('type','sys::Type',false),new Param('checked','sys::Bool',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('isCtor',8192,'sys::Bool',List.make(Param.type$,[]),{});
Field.type$.am$('parent',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('hasFacet',8192,'sys::Bool',List.make(Param.type$,[new Param('type','sys::Type',false)]),{}).am$('isStatic',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('signature',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('isField',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isSynthetic',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('isPrivate',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('type',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('isNative',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('facets',8192,'sys::Facet[]',List.make(Param.type$,[]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('isProtected',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('findMethod',40962,'sys::Method?',List.make(Param.type$,[new Param('qname','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('find',40962,'sys::Slot?',List.make(Param.type$,[new Param('qname','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isConst',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('get',270336,'sys::Obj?',List.make(Param.type$,[new Param('instance','sys::Obj?',true)]),{}).am$('qname',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('isOverride',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isMethod',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isPublic',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('makeSetFunc',40962,'|sys::Obj->sys::Void|',List.make(Param.type$,[new Param('vals','[sys::Field:sys::Obj?]',false)]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('set',270336,'sys::Void',List.make(Param.type$,[new Param('instance','sys::Obj?',false),new Param('value','sys::Obj?',false)]),{}).am$('findFunc',40962,'sys::Func?',List.make(Param.type$,[new Param('qname','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isAbstract',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isInternal',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('doc',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('isVirtual',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('findField',40962,'sys::Field?',List.make(Param.type$,[new Param('qname','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('facet',8192,'sys::Facet?',List.make(Param.type$,[new Param('type','sys::Type',false),new Param('checked','sys::Bool',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('isCtor',8192,'sys::Bool',List.make(Param.type$,[]),{});
FieldNotSetErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Method.type$.am$('parent',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('hasFacet',8192,'sys::Bool',List.make(Param.type$,[new Param('type','sys::Type',false)]),{}).am$('isStatic',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('signature',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('isField',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isSynthetic',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('isPrivate',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isNative',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('facets',8192,'sys::Facet[]',List.make(Param.type$,[]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('isProtected',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('findMethod',40962,'sys::Method?',List.make(Param.type$,[new Param('qname','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('find',40962,'sys::Slot?',List.make(Param.type$,[new Param('qname','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('isConst',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('qname',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('isOverride',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isMethod',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('isPublic',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('findFunc',40962,'sys::Func?',List.make(Param.type$,[new Param('qname','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('callOn',8192,'sys::Obj?',List.make(Param.type$,[new Param('target','sys::Obj?',false),new Param('args','sys::Obj?[]?',false)]),{}).am$('paramDef',8192,'sys::Obj?',List.make(Param.type$,[new Param('param','sys::Param',false),new Param('instance','sys::Obj?',true)]),{}).am$('params',8192,'sys::Param[]',List.make(Param.type$,[]),{}).am$('isAbstract',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('callList',8192,'sys::Obj?',List.make(Param.type$,[new Param('args','sys::Obj?[]?',false)]),{}).am$('call',8192,'sys::Obj?',List.make(Param.type$,[new Param('a','sys::Obj?',true),new Param('b','sys::Obj?',true),new Param('c','sys::Obj?',true),new Param('d','sys::Obj?',true),new Param('e','sys::Obj?',true),new Param('f','sys::Obj?',true),new Param('g','sys::Obj?',true),new Param('h','sys::Obj?',true)]),{}).am$('isInternal',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('func',8192,'sys::Func',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('doc',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('returns',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('isVirtual',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('findField',40962,'sys::Field?',List.make(Param.type$,[new Param('qname','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('facet',8192,'sys::Facet?',List.make(Param.type$,[new Param('type','sys::Type',false),new Param('checked','sys::Bool',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('isCtor',8192,'sys::Bool',List.make(Param.type$,[]),{});
Serializable.type$.af$('simple',73730,'sys::Bool',{}).af$('collection',73730,'sys::Bool',{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('instance$init$sys$Serializable',133120,'sys::Void',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',139268,'sys::Void',List.make(Param.type$,[new Param('f','|sys::Serializable->sys::Void|?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Transient.type$.af$('defVal',106498,'sys::Transient',{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('static$init',165890,'sys::Void',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',133124,'sys::Void',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Js.type$.af$('defVal',106498,'sys::Js',{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('static$init',165890,'sys::Void',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',133124,'sys::Void',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
NoDoc.type$.af$('defVal',106498,'sys::NoDoc',{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('static$init',165890,'sys::Void',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',133124,'sys::Void',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Deprecated.type$.af$('msg',73730,'sys::Str',{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('instance$init$sys$Deprecated',133120,'sys::Void',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',139268,'sys::Void',List.make(Param.type$,[new Param('f','|sys::Deprecated->sys::Void|?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Operator.type$.af$('defVal',106498,'sys::Operator',{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('static$init',165890,'sys::Void',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',133124,'sys::Void',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
FacetMeta.type$.af$('inherited',73730,'sys::Bool',{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('instance$init$sys$FacetMeta',133120,'sys::Void',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',139268,'sys::Void',List.make(Param.type$,[new Param('f','|sys::FacetMeta->sys::Void|?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
UnknownServiceErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
NullErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Uuid.type$.am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',271360,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('bitsLo',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('fromStr',40966,'sys::Uuid?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('makeBits',40962,'sys::Uuid',List.make(Param.type$,[new Param('hi','sys::Int',false),new Param('lo','sys::Int',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',40966,'sys::Uuid?',List.make(Param.type$,[]),{}).am$('bitsHi',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
UnsupportedErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
UnknownKeyErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
UnknownFacetErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
InStream.type$.af$('endian',73728,'sys::Endian',{}).af$('charset',73728,'sys::Charset',{}).am$('readF4',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('readDecimal',8192,'sys::Decimal',List.make(Param.type$,[]),{}).am$('readAllStr',8192,'sys::Str',List.make(Param.type$,[new Param('normalizeNewlines','sys::Bool',true)]),{}).am$('readBufFully',8192,'sys::Buf',List.make(Param.type$,[new Param('buf','sys::Buf?',false),new Param('n','sys::Int',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('readF8',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('readS2',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readS1',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readS4',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('readBuf',270336,'sys::Int?',List.make(Param.type$,[new Param('buf','sys::Buf',false),new Param('n','sys::Int',false)]),{}).am$('pipe',8192,'sys::Int',List.make(Param.type$,[new Param('out','sys::OutStream',false),new Param('n','sys::Int?',true),new Param('close','sys::Bool',true)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('readS8',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('unreadChar',8192,'sys::This',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('read',270336,'sys::Int?',List.make(Param.type$,[]),{}).am$('readProps',8192,'[sys::Str:sys::Str]',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('unread',270336,'sys::This',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('skip',270336,'sys::Int',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('readAllLines',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('readAllBuf',8192,'sys::Buf',List.make(Param.type$,[]),{}).am$('readChar',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('readU4',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readNullTerminatedStr',8192,'sys::Str',List.make(Param.type$,[new Param('max','sys::Int?',true)]),{}).am$('readUtf',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('readPropsListVals',8192,'[sys::Str:sys::Str[]]',List.make(Param.type$,[]),{}).am$('readU2',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readU1',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('numPendingBits',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',4100,'sys::Void',List.make(Param.type$,[new Param('in','sys::InStream?',false)]),{}).am$('close',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('avail',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('readBool',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('readObj',8192,'sys::Obj?',List.make(Param.type$,[new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('peekChar',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('readStrToken',8192,'sys::Str?',List.make(Param.type$,[new Param('max','sys::Int?',true),new Param('c','|sys::Int->sys::Bool|?',true)]),{}).am$('readLine',8192,'sys::Str?',List.make(Param.type$,[new Param('max','sys::Int?',true)]),{}).am$('peek',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('readChars',8192,'sys::Str',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('eachLine',8192,'sys::Void',List.make(Param.type$,[new Param('f','|sys::Str->sys::Void|',false)]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('readBits',8192,'sys::Int',List.make(Param.type$,[new Param('num','sys::Int',false)]),{});
SysInStream.type$.af$('endian',73728,'sys::Endian',{}).af$('charset',73728,'sys::Charset',{}).am$('readF4',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('readDecimal',8192,'sys::Decimal',List.make(Param.type$,[]),{}).am$('readAllStr',8192,'sys::Str',List.make(Param.type$,[new Param('normalizeNewlines','sys::Bool',true)]),{}).am$('readBufFully',8192,'sys::Buf',List.make(Param.type$,[new Param('buf','sys::Buf?',false),new Param('n','sys::Int',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('readF8',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('readS2',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readS1',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readS4',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('readBuf',271360,'sys::Int?',List.make(Param.type$,[new Param('buf','sys::Buf',false),new Param('n','sys::Int',false)]),{}).am$('pipe',8192,'sys::Int',List.make(Param.type$,[new Param('out','sys::OutStream',false),new Param('n','sys::Int?',true),new Param('close','sys::Bool',true)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('readS8',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('unreadChar',8192,'sys::This',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('read',271360,'sys::Int?',List.make(Param.type$,[]),{}).am$('readProps',8192,'[sys::Str:sys::Str]',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('unread',271360,'sys::This',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('skip',270336,'sys::Int',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('readAllLines',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('readAllBuf',8192,'sys::Buf',List.make(Param.type$,[]),{}).am$('readChar',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('readU4',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readNullTerminatedStr',8192,'sys::Str',List.make(Param.type$,[new Param('max','sys::Int?',true)]),{}).am$('readUtf',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('readPropsListVals',8192,'[sys::Str:sys::Str[]]',List.make(Param.type$,[]),{}).am$('readU2',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('readU1',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('numPendingBits',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('close',271360,'sys::Bool',List.make(Param.type$,[]),{}).am$('make',139268,'sys::Void',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('avail',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('readBool',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('readObj',8192,'sys::Obj?',List.make(Param.type$,[new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('peekChar',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('readStrToken',8192,'sys::Str?',List.make(Param.type$,[new Param('max','sys::Int?',true),new Param('c','|sys::Int->sys::Bool|?',true)]),{}).am$('readLine',8192,'sys::Str?',List.make(Param.type$,[new Param('max','sys::Int?',true)]),{}).am$('peek',8192,'sys::Int?',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('readChars',8192,'sys::Str',List.make(Param.type$,[new Param('n','sys::Int',false)]),{}).am$('eachLine',8192,'sys::Void',List.make(Param.type$,[new Param('f','|sys::Str->sys::Void|',false)]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('readBits',8192,'sys::Int',List.make(Param.type$,[new Param('num','sys::Int',false)]),{});
File.type$.af$('modified',270337,'sys::DateTime?',{}).af$('pathSep',106498,'sys::Str',{}).af$('sep',106498,'sys::Str',{}).am$('parent',270337,'sys::File?',List.make(Param.type$,[]),{}).am$('readAllStr',8192,'sys::Str',List.make(Param.type$,[new Param('normalizeNewlines','sys::Bool',true)]),{}).am$('osRoots',40962,'sys::File[]',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('mimeType',8192,'sys::MimeType?',List.make(Param.type$,[]),{}).am$('createFile',8192,'sys::File',List.make(Param.type$,[new Param('name','sys::Str',false)]),{}).am$('copyTo',270336,'sys::File',List.make(Param.type$,[new Param('to','sys::File',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('moveInto',270336,'sys::File',List.make(Param.type$,[new Param('dir','sys::File',false)]),{}).am$('writeProps',8192,'sys::Void',List.make(Param.type$,[new Param('props','[sys::Str:sys::Str]',false)]),{}).am$('path',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('normalize',270337,'sys::File',List.make(Param.type$,[]),{}).am$('create',270337,'sys::File',List.make(Param.type$,[]),{}).am$('isExecutable',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('pathStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('ext',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('in',270337,'sys::InStream',List.make(Param.type$,[new Param('bufferSize','sys::Int?',true)]),{}).am$('copyInto',270336,'sys::File',List.make(Param.type$,[new Param('dir','sys::File',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('list',270337,'sys::File[]',List.make(Param.type$,[new Param('pattern','sys::Regex?',true)]),{}).am$('plus',270337,'sys::File',List.make(Param.type$,[new Param('path','sys::Uri',false),new Param('checkSlash','sys::Bool',true)]),{}).am$('basename',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('size',270337,'sys::Int?',List.make(Param.type$,[]),{}).am$('readProps',8192,'[sys::Str:sys::Str]',List.make(Param.type$,[]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('isReadable',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('readAllLines',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('isWritable',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('readAllBuf',8192,'sys::Buf',List.make(Param.type$,[]),{}).am$('osPath',270337,'sys::Str?',List.make(Param.type$,[]),{}).am$('delete',270337,'sys::Void',List.make(Param.type$,[]),{}).am$('out',270337,'sys::OutStream',List.make(Param.type$,[new Param('append','sys::Bool',true),new Param('bufferSize','sys::Int?',true)]),{}).am$('createDir',8192,'sys::File',List.make(Param.type$,[new Param('name','sys::Str',false)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',40966,'sys::File?',List.make(Param.type$,[new Param('uri','sys::Uri',false),new Param('checkSlash','sys::Bool',true)]),{}).am$('listFiles',270336,'sys::File[]',List.make(Param.type$,[new Param('pattern','sys::Regex?',true)]),{}).am$('deleteOnExit',270337,'sys::File',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('os',40962,'sys::File',List.make(Param.type$,[new Param('osPath','sys::Str',false)]),{}).am$('readObj',8192,'sys::Obj?',List.make(Param.type$,[new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isEmpty',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('writeObj',8192,'sys::Void',List.make(Param.type$,[new Param('obj','sys::Obj?',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('listDirs',270336,'sys::File[]',List.make(Param.type$,[new Param('pattern','sys::Regex?',true)]),{}).am$('store',270336,'sys::FileStore',List.make(Param.type$,[]),{}).am$('createTemp',40962,'sys::File',List.make(Param.type$,[new Param('prefix','sys::Str',true),new Param('suffix','sys::Str',true),new Param('dir','sys::File?',true)]),{}).am$('uri',8192,'sys::Uri',List.make(Param.type$,[]),{}).am$('isHidden',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('makeNew',4100,'sys::Void',List.make(Param.type$,[new Param('uri','sys::Uri',false)]),{}).am$('rename',270336,'sys::File',List.make(Param.type$,[new Param('newName','sys::Str',false)]),{}).am$('eachLine',8192,'sys::Void',List.make(Param.type$,[new Param('f','|sys::Str->sys::Void|',false)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('exists',270337,'sys::Bool',List.make(Param.type$,[]),{}).am$('mmap',270337,'sys::Buf',List.make(Param.type$,[new Param('mode','sys::Str',true),new Param('pos','sys::Int',true),new Param('size','sys::Int?',true)]),{}).am$('walk',270336,'sys::Void',List.make(Param.type$,[new Param('c','|sys::File->sys::Void|',false)]),{}).am$('open',270337,'sys::Buf',List.make(Param.type$,[new Param('mode','sys::Str',true)]),{}).am$('isDir',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('moveTo',270337,'sys::File',List.make(Param.type$,[new Param('to','sys::File',false)]),{});
LocalFile.type$.af$('modified',336896,'sys::DateTime?',{}).af$('pathSep',106498,'sys::Str',{}).af$('sep',106498,'sys::Str',{}).am$('parent',271360,'sys::File?',List.make(Param.type$,[]),{}).am$('readAllStr',8192,'sys::Str',List.make(Param.type$,[new Param('normalizeNewlines','sys::Bool',true)]),{}).am$('osRoots',40962,'sys::File[]',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('mimeType',8192,'sys::MimeType?',List.make(Param.type$,[]),{}).am$('createFile',8192,'sys::File',List.make(Param.type$,[new Param('name','sys::Str',false)]),{}).am$('copyTo',270336,'sys::File',List.make(Param.type$,[new Param('to','sys::File',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('moveInto',270336,'sys::File',List.make(Param.type$,[new Param('dir','sys::File',false)]),{}).am$('writeProps',8192,'sys::Void',List.make(Param.type$,[new Param('props','[sys::Str:sys::Str]',false)]),{}).am$('path',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('normalize',271360,'sys::File',List.make(Param.type$,[]),{}).am$('create',271360,'sys::File',List.make(Param.type$,[]),{}).am$('isExecutable',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('pathStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('ext',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('init',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('in',271360,'sys::InStream',List.make(Param.type$,[new Param('bufferSize','sys::Int?',true)]),{}).am$('copyInto',270336,'sys::File',List.make(Param.type$,[new Param('dir','sys::File',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('list',271360,'sys::File[]',List.make(Param.type$,[new Param('pattern','sys::Regex?',true)]),{}).am$('plus',271360,'sys::File',List.make(Param.type$,[new Param('uri','sys::Uri',false),new Param('checkSlash','sys::Bool',true)]),{}).am$('basename',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('size',271360,'sys::Int?',List.make(Param.type$,[]),{}).am$('readProps',8192,'[sys::Str:sys::Str]',List.make(Param.type$,[]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('isReadable',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('readAllLines',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('isWritable',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('readAllBuf',8192,'sys::Buf',List.make(Param.type$,[]),{}).am$('osPath',271360,'sys::Str?',List.make(Param.type$,[]),{}).am$('delete',271360,'sys::Void',List.make(Param.type$,[]),{}).am$('out',271360,'sys::OutStream',List.make(Param.type$,[new Param('append','sys::Bool',true),new Param('bufferSize','sys::Int?',true)]),{}).am$('createDir',8192,'sys::File',List.make(Param.type$,[new Param('name','sys::Str',false)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('listFiles',270336,'sys::File[]',List.make(Param.type$,[new Param('pattern','sys::Regex?',true)]),{}).am$('deleteOnExit',271360,'sys::File',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('os',40962,'sys::File',List.make(Param.type$,[new Param('osPath','sys::Str',false)]),{}).am$('readObj',8192,'sys::Obj?',List.make(Param.type$,[new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isEmpty',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('writeObj',8192,'sys::Void',List.make(Param.type$,[new Param('obj','sys::Obj?',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('listDirs',270336,'sys::File[]',List.make(Param.type$,[new Param('pattern','sys::Regex?',true)]),{}).am$('store',270336,'sys::FileStore',List.make(Param.type$,[]),{}).am$('createTemp',40962,'sys::File',List.make(Param.type$,[new Param('prefix','sys::Str',true),new Param('suffix','sys::Str',true),new Param('dir','sys::File?',true)]),{}).am$('uri',8192,'sys::Uri',List.make(Param.type$,[]),{}).am$('isHidden',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('rename',270336,'sys::File',List.make(Param.type$,[new Param('newName','sys::Str',false)]),{}).am$('eachLine',8192,'sys::Void',List.make(Param.type$,[new Param('f','|sys::Str->sys::Void|',false)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('exists',271360,'sys::Bool',List.make(Param.type$,[]),{}).am$('mmap',271360,'sys::Buf',List.make(Param.type$,[new Param('mode','sys::Str',true),new Param('pos','sys::Int',true),new Param('size','sys::Int?',true)]),{}).am$('open',271360,'sys::Buf',List.make(Param.type$,[new Param('mode','sys::Str',true)]),{}).am$('walk',270336,'sys::Void',List.make(Param.type$,[new Param('c','|sys::File->sys::Void|',false)]),{}).am$('moveTo',271360,'sys::File',List.make(Param.type$,[new Param('to','sys::File',false)]),{}).am$('isDir',8192,'sys::Bool',List.make(Param.type$,[]),{});
MemFile.type$.af$('modified',336896,'sys::DateTime?',{}).af$('pathSep',106498,'sys::Str',{}).af$('sep',106498,'sys::Str',{}).am$('parent',271360,'sys::File?',List.make(Param.type$,[]),{}).am$('readAllStr',8192,'sys::Str',List.make(Param.type$,[new Param('normalizeNewlines','sys::Bool',true)]),{}).am$('osRoots',40962,'sys::File[]',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('mimeType',8192,'sys::MimeType?',List.make(Param.type$,[]),{}).am$('createFile',8192,'sys::File',List.make(Param.type$,[new Param('name','sys::Str',false)]),{}).am$('copyTo',270336,'sys::File',List.make(Param.type$,[new Param('to','sys::File',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('moveInto',270336,'sys::File',List.make(Param.type$,[new Param('dir','sys::File',false)]),{}).am$('writeProps',8192,'sys::Void',List.make(Param.type$,[new Param('props','[sys::Str:sys::Str]',false)]),{}).am$('path',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('normalize',271360,'sys::File',List.make(Param.type$,[]),{}).am$('create',271360,'sys::File',List.make(Param.type$,[]),{}).am$('isExecutable',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('pathStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('ext',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('init',132,'sys::Void',List.make(Param.type$,[]),{}).am$('in',271360,'sys::InStream',List.make(Param.type$,[new Param('bufferSize','sys::Int?',true)]),{}).am$('copyInto',270336,'sys::File',List.make(Param.type$,[new Param('dir','sys::File',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('list',271360,'sys::File[]',List.make(Param.type$,[new Param('pattern','sys::Regex?',true)]),{}).am$('plus',271360,'sys::File',List.make(Param.type$,[new Param('uri','sys::Uri',false),new Param('checkSlash','sys::Bool',true)]),{}).am$('basename',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('size',271360,'sys::Int?',List.make(Param.type$,[]),{}).am$('readProps',8192,'[sys::Str:sys::Str]',List.make(Param.type$,[]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('isReadable',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('readAllLines',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('isWritable',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('readAllBuf',8192,'sys::Buf',List.make(Param.type$,[]),{}).am$('osPath',271360,'sys::Str?',List.make(Param.type$,[]),{}).am$('delete',271360,'sys::Void',List.make(Param.type$,[]),{}).am$('out',271360,'sys::OutStream',List.make(Param.type$,[new Param('append','sys::Bool',true),new Param('bufferSize','sys::Int?',true)]),{}).am$('createDir',8192,'sys::File',List.make(Param.type$,[new Param('name','sys::Str',false)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('listFiles',270336,'sys::File[]',List.make(Param.type$,[new Param('pattern','sys::Regex?',true)]),{}).am$('deleteOnExit',271360,'sys::File',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('os',40962,'sys::File',List.make(Param.type$,[new Param('osPath','sys::Str',false)]),{}).am$('readObj',8192,'sys::Obj?',List.make(Param.type$,[new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isEmpty',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('writeObj',8192,'sys::Void',List.make(Param.type$,[new Param('obj','sys::Obj?',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('listDirs',270336,'sys::File[]',List.make(Param.type$,[new Param('pattern','sys::Regex?',true)]),{}).am$('store',270336,'sys::FileStore',List.make(Param.type$,[]),{}).am$('createTemp',40962,'sys::File',List.make(Param.type$,[new Param('prefix','sys::Str',true),new Param('suffix','sys::Str',true),new Param('dir','sys::File?',true)]),{}).am$('uri',8192,'sys::Uri',List.make(Param.type$,[]),{}).am$('isHidden',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('rename',270336,'sys::File',List.make(Param.type$,[new Param('newName','sys::Str',false)]),{}).am$('eachLine',8192,'sys::Void',List.make(Param.type$,[new Param('f','|sys::Str->sys::Void|',false)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('exists',271360,'sys::Bool',List.make(Param.type$,[]),{}).am$('mmap',271360,'sys::Buf',List.make(Param.type$,[new Param('mode','sys::Str',true),new Param('pos','sys::Int',true),new Param('size','sys::Int?',true)]),{}).am$('open',271360,'sys::Buf',List.make(Param.type$,[new Param('mode','sys::Str',true)]),{}).am$('walk',270336,'sys::Void',List.make(Param.type$,[new Param('c','|sys::File->sys::Void|',false)]),{}).am$('moveTo',271360,'sys::File',List.make(Param.type$,[new Param('to','sys::File',false)]),{}).am$('isDir',8192,'sys::Bool',List.make(Param.type$,[]),{});
ZipEntryFile.type$.af$('modified',336896,'sys::DateTime?',{}).af$('pathSep',106498,'sys::Str',{}).af$('sep',106498,'sys::Str',{}).am$('parent',271360,'sys::File?',List.make(Param.type$,[]),{}).am$('readAllStr',8192,'sys::Str',List.make(Param.type$,[new Param('normalizeNewlines','sys::Bool',true)]),{}).am$('osRoots',40962,'sys::File[]',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('mimeType',8192,'sys::MimeType?',List.make(Param.type$,[]),{}).am$('createFile',8192,'sys::File',List.make(Param.type$,[new Param('name','sys::Str',false)]),{}).am$('copyTo',270336,'sys::File',List.make(Param.type$,[new Param('to','sys::File',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('moveInto',270336,'sys::File',List.make(Param.type$,[new Param('dir','sys::File',false)]),{}).am$('writeProps',8192,'sys::Void',List.make(Param.type$,[new Param('props','[sys::Str:sys::Str]',false)]),{}).am$('path',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('normalize',271360,'sys::File',List.make(Param.type$,[]),{}).am$('create',271360,'sys::File',List.make(Param.type$,[]),{}).am$('isExecutable',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('pathStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('ext',8192,'sys::Str?',List.make(Param.type$,[]),{}).am$('init',132,'sys::Void',List.make(Param.type$,[]),{}).am$('in',271360,'sys::InStream',List.make(Param.type$,[new Param('bufferSize','sys::Int?',true)]),{}).am$('copyInto',270336,'sys::File',List.make(Param.type$,[new Param('dir','sys::File',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('list',271360,'sys::File[]',List.make(Param.type$,[new Param('pattern','sys::Regex?',true)]),{}).am$('plus',271360,'sys::File',List.make(Param.type$,[new Param('uri','sys::Uri',false),new Param('checkSlash','sys::Bool',true)]),{}).am$('basename',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('size',271360,'sys::Int?',List.make(Param.type$,[]),{}).am$('readProps',8192,'[sys::Str:sys::Str]',List.make(Param.type$,[]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('isReadable',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('readAllLines',8192,'sys::Str[]',List.make(Param.type$,[]),{}).am$('isWritable',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('readAllBuf',8192,'sys::Buf',List.make(Param.type$,[]),{}).am$('osPath',271360,'sys::Str?',List.make(Param.type$,[]),{}).am$('delete',271360,'sys::Void',List.make(Param.type$,[]),{}).am$('out',271360,'sys::OutStream',List.make(Param.type$,[new Param('append','sys::Bool',true),new Param('bufferSize','sys::Int?',true)]),{}).am$('createDir',8192,'sys::File',List.make(Param.type$,[new Param('name','sys::Str',false)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('listFiles',270336,'sys::File[]',List.make(Param.type$,[new Param('pattern','sys::Regex?',true)]),{}).am$('deleteOnExit',271360,'sys::File',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('os',40962,'sys::File',List.make(Param.type$,[new Param('osPath','sys::Str',false)]),{}).am$('readObj',8192,'sys::Obj?',List.make(Param.type$,[new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isEmpty',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('writeObj',8192,'sys::Void',List.make(Param.type$,[new Param('obj','sys::Obj?',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('listDirs',270336,'sys::File[]',List.make(Param.type$,[new Param('pattern','sys::Regex?',true)]),{}).am$('store',270336,'sys::FileStore',List.make(Param.type$,[]),{}).am$('createTemp',40962,'sys::File',List.make(Param.type$,[new Param('prefix','sys::Str',true),new Param('suffix','sys::Str',true),new Param('dir','sys::File?',true)]),{}).am$('uri',8192,'sys::Uri',List.make(Param.type$,[]),{}).am$('isHidden',270336,'sys::Bool',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('rename',270336,'sys::File',List.make(Param.type$,[new Param('newName','sys::Str',false)]),{}).am$('eachLine',8192,'sys::Void',List.make(Param.type$,[new Param('f','|sys::Str->sys::Void|',false)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('exists',271360,'sys::Bool',List.make(Param.type$,[]),{}).am$('mmap',271360,'sys::Buf',List.make(Param.type$,[new Param('mode','sys::Str',true),new Param('pos','sys::Int',true),new Param('size','sys::Int?',true)]),{}).am$('open',271360,'sys::Buf',List.make(Param.type$,[new Param('mode','sys::Str',true)]),{}).am$('walk',270336,'sys::Void',List.make(Param.type$,[new Param('c','|sys::File->sys::Void|',false)]),{}).am$('moveTo',271360,'sys::File',List.make(Param.type$,[new Param('to','sys::File',false)]),{}).am$('isDir',8192,'sys::Bool',List.make(Param.type$,[]),{});
InterruptedErr.type$.am$('msg',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('cause',8192,'sys::Err?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('trace',8192,'sys::This',List.make(Param.type$,[new Param('out','sys::OutStream',true),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('traceToStr',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('msg','sys::Str',true),new Param('cause','sys::Err?',true)]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Env.type$.am$('parent',8192,'sys::Env?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('homeDir',270336,'sys::File',List.make(Param.type$,[]),{}).am$('path',270336,'sys::File[]',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('host',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('idHash',8192,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('vars',270336,'[sys::Str:sys::Str]',List.make(Param.type$,[]),{}).am$('findAllPodNames',270336,'sys::Str[]',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('in',270336,'sys::InStream',List.make(Param.type$,[]),{}).am$('findFile',270336,'sys::File?',List.make(Param.type$,[new Param('uri','sys::Uri',false),new Param('checked','sys::Bool',true)]),{}).am$('runtime',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('index',270336,'sys::Str[]',List.make(Param.type$,[new Param('key','sys::Str',false)]),{}).am$('findAllFiles',270336,'sys::File[]',List.make(Param.type$,[new Param('uri','sys::Uri',false)]),{}).am$('props',270336,'[sys::Str:sys::Str]',List.make(Param.type$,[new Param('pod','sys::Pod',false),new Param('uri','sys::Uri',false),new Param('maxAge','sys::Duration',false)]),{}).am$('indexPodNames',270336,'sys::Str[]',List.make(Param.type$,[new Param('key','sys::Str',false)]),{}).am$('exit',270336,'sys::Void',List.make(Param.type$,[new Param('status','sys::Int',true)]),{}).am$('compileScript',270336,'sys::Type',List.make(Param.type$,[new Param('f','sys::File',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('indexKeys',270336,'sys::Str[]',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('cur',40962,'sys::Env',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('javaVersion',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('addShutdownHook',270336,'sys::Void',List.make(Param.type$,[new Param('hook','|->sys::Void|',false)]),{}).am$('locale',270336,'sys::Str?',List.make(Param.type$,[new Param('pod','sys::Pod',false),new Param('key','sys::Str',false),new Param('def','sys::Str?',true),new Param('locale','sys::Locale',true)]),{}).am$('platform',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('out',270336,'sys::OutStream',List.make(Param.type$,[]),{}).am$('promptPassword',270336,'sys::Str?',List.make(Param.type$,[new Param('msg','sys::Str',true)]),{}).am$('compileScriptToJs',270336,'sys::Str',List.make(Param.type$,[new Param('f','sys::File',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('workDir',270336,'sys::File',List.make(Param.type$,[]),{}).am$('mainMethod',270336,'sys::Method?',List.make(Param.type$,[]),{}).am$('gc',270336,'sys::Void',List.make(Param.type$,[]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',4100,'sys::Void',List.make(Param.type$,[new Param('parent','sys::Env',true)]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('os',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('err',270336,'sys::OutStream',List.make(Param.type$,[]),{}).am$('args',270336,'sys::Str[]',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('diagnostics',270336,'[sys::Str:sys::Obj]',List.make(Param.type$,[]),{}).am$('findPodFile',270336,'sys::File?',List.make(Param.type$,[new Param('podName','sys::Str',false)]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('tempDir',270336,'sys::File',List.make(Param.type$,[]),{}).am$('removeShutdownHook',270336,'sys::Bool',List.make(Param.type$,[new Param('hook','|->sys::Void|',false)]),{}).am$('arch',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('user',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('prompt',270336,'sys::Str?',List.make(Param.type$,[new Param('msg','sys::Str',true)]),{}).am$('config',270336,'sys::Str?',List.make(Param.type$,[new Param('pod','sys::Pod',false),new Param('key','sys::Str',false),new Param('def','sys::Str?',true)]),{});
BootEnv.type$.am$('parent',8192,'sys::Env?',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('homeDir',270336,'sys::File',List.make(Param.type$,[]),{}).am$('path',270336,'sys::File[]',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('host',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('idHash',8192,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('vars',270336,'[sys::Str:sys::Str]',List.make(Param.type$,[]),{}).am$('findAllPodNames',270336,'sys::Str[]',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('in',270336,'sys::InStream',List.make(Param.type$,[]),{}).am$('findFile',270336,'sys::File?',List.make(Param.type$,[new Param('uri','sys::Uri',false),new Param('checked','sys::Bool',true)]),{}).am$('runtime',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('index',270336,'sys::Str[]',List.make(Param.type$,[new Param('key','sys::Str',false)]),{}).am$('findAllFiles',270336,'sys::File[]',List.make(Param.type$,[new Param('uri','sys::Uri',false)]),{}).am$('props',270336,'[sys::Str:sys::Str]',List.make(Param.type$,[new Param('pod','sys::Pod',false),new Param('uri','sys::Uri',false),new Param('maxAge','sys::Duration',false)]),{}).am$('indexPodNames',270336,'sys::Str[]',List.make(Param.type$,[new Param('key','sys::Str',false)]),{}).am$('exit',270336,'sys::Void',List.make(Param.type$,[new Param('status','sys::Int',true)]),{}).am$('compileScript',270336,'sys::Type',List.make(Param.type$,[new Param('f','sys::File',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('indexKeys',270336,'sys::Str[]',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('cur',40962,'sys::Env',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('javaVersion',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('addShutdownHook',270336,'sys::Void',List.make(Param.type$,[new Param('hook','|->sys::Void|',false)]),{}).am$('locale',270336,'sys::Str?',List.make(Param.type$,[new Param('pod','sys::Pod',false),new Param('key','sys::Str',false),new Param('def','sys::Str?',true),new Param('locale','sys::Locale',true)]),{}).am$('platform',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('out',270336,'sys::OutStream',List.make(Param.type$,[]),{}).am$('promptPassword',270336,'sys::Str?',List.make(Param.type$,[new Param('msg','sys::Str',true)]),{}).am$('compileScriptToJs',270336,'sys::Str',List.make(Param.type$,[new Param('f','sys::File',false),new Param('options','[sys::Str:sys::Obj]?',true)]),{}).am$('workDir',270336,'sys::File',List.make(Param.type$,[]),{}).am$('mainMethod',270336,'sys::Method?',List.make(Param.type$,[]),{}).am$('gc',270336,'sys::Void',List.make(Param.type$,[]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',139268,'sys::Void',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('os',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('err',270336,'sys::OutStream',List.make(Param.type$,[]),{}).am$('args',270336,'sys::Str[]',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('diagnostics',270336,'[sys::Str:sys::Obj]',List.make(Param.type$,[]),{}).am$('findPodFile',270336,'sys::File?',List.make(Param.type$,[new Param('podName','sys::Str',false)]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('tempDir',270336,'sys::File',List.make(Param.type$,[]),{}).am$('removeShutdownHook',270336,'sys::Bool',List.make(Param.type$,[new Param('hook','|->sys::Void|',false)]),{}).am$('arch',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('user',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('prompt',270336,'sys::Str?',List.make(Param.type$,[new Param('msg','sys::Str',true)]),{}).am$('config',270336,'sys::Str?',List.make(Param.type$,[new Param('pod','sys::Pod',false),new Param('key','sys::Str',false),new Param('def','sys::Str?',true)]),{});
Map.type$.af$('def',73728,'sys::V?',{}).af$('caseInsensitive',73728,'sys::Bool',{}).af$('ordered',73728,'sys::Bool',{}).am$('addNotNull',8192,'sys::M',List.make(Param.type$,[new Param('key','sys::K',false),new Param('val','sys::V?',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('findAll',8192,'sys::M',List.make(Param.type$,[new Param('c','|sys::V,sys::K->sys::Bool|',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('find',8192,'sys::V?',List.make(Param.type$,[new Param('c','|sys::V,sys::K->sys::Bool|',false)]),{}).am$('exclude',8192,'sys::M',List.make(Param.type$,[new Param('c','|sys::V,sys::K->sys::Bool|',false)]),{}).am$('join',8192,'sys::Str',List.make(Param.type$,[new Param('separator','sys::Str',false),new Param('c','|sys::V,sys::K->sys::Str|?',true)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('add',8192,'sys::M',List.make(Param.type$,[new Param('key','sys::K',false),new Param('val','sys::V',false)]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('all',8192,'sys::Bool',List.make(Param.type$,[new Param('c','|sys::V,sys::K->sys::Bool|',false)]),{}).am$('reduce',8192,'sys::Obj?',List.make(Param.type$,[new Param('init','sys::Obj?',false),new Param('c','|sys::Obj?,sys::V,sys::K->sys::Obj?|',false)]),{}).am$('setNotNull',8192,'sys::M',List.make(Param.type$,[new Param('key','sys::K',false),new Param('val','sys::V?',false)]),{}).am$('containsKey',8192,'sys::Bool',List.make(Param.type$,[new Param('key','sys::K',false)]),{}).am$('toCode',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('each',8192,'sys::Void',List.make(Param.type$,[new Param('c','|sys::V,sys::K->sys::Void|',false)]),{}).am$('mapNotNull',8192,'[sys::Obj:sys::Obj?]',List.make(Param.type$,[new Param('c','|sys::V,sys::K->sys::Obj?|',false)]),{}).am$('findNotNull',8192,'sys::M',List.make(Param.type$,[]),{}).am$('size',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('ro',8192,'sys::M',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('vals',8192,'sys::V[]',List.make(Param.type$,[]),{}).am$('rw',8192,'sys::M',List.make(Param.type$,[]),{}).am$('keys',8192,'sys::K[]',List.make(Param.type$,[]),{}).am$('remove',8192,'sys::V?',List.make(Param.type$,[new Param('key','sys::K',false)]),{}).am$('addIfNotNull',8192,'sys::M',List.make(Param.type$,[new Param('key','sys::K',false),new Param('val','sys::V?',false)]),{}).am$('isRO',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('get',8192,'sys::V?',List.make(Param.type$,[new Param('key','sys::K',false),new Param('def','sys::V?',true)]),{}).am$('addList',8192,'sys::M',List.make(Param.type$,[new Param('list','sys::V[]',false),new Param('c','|sys::V,sys::Int->sys::K|?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',8196,'sys::Void',List.make(Param.type$,[new Param('type','sys::Type',false)]),{}).am$('setAll',8192,'sys::M',List.make(Param.type$,[new Param('m','sys::M',false)]),{}).am$('map',8192,'[sys::Obj:sys::Obj?]',List.make(Param.type$,[new Param('c','|sys::V,sys::K->sys::Obj?|',false)]),{}).am$('isRW',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('set',8192,'sys::M',List.make(Param.type$,[new Param('key','sys::K',false),new Param('val','sys::V',false)]),{}).am$('getOrAdd',8192,'sys::V',List.make(Param.type$,[new Param('key','sys::K',false),new Param('valFunc','|sys::K->sys::V|',false)]),{}).am$('isEmpty',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('clear',8192,'sys::M',List.make(Param.type$,[]),{}).am$('setList',8192,'sys::M',List.make(Param.type$,[new Param('list','sys::V[]',false),new Param('c','|sys::V,sys::Int->sys::K|?',true)]),{}).am$('any',8192,'sys::Bool',List.make(Param.type$,[new Param('c','|sys::V,sys::K->sys::Bool|',false)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('addAll',8192,'sys::M',List.make(Param.type$,[new Param('m','sys::M',false)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('getOrThrow',8192,'sys::V',List.make(Param.type$,[new Param('key','sys::K',false)]),{}).am$('instance$init$sys$Map',133120,'sys::Void',List.make(Param.type$,[]),{}).am$('getChecked',8192,'sys::V?',List.make(Param.type$,[new Param('key','sys::K',false),new Param('checked','sys::Bool',true)]),{}).am$('eachWhile',8192,'sys::Obj?',List.make(Param.type$,[new Param('c','|sys::V,sys::K->sys::Obj?|',false)]),{}).am$('dup',8192,'sys::M',List.make(Param.type$,[]),{});
Param.type$.am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('type',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('hasDefault',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('equals',270336,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('name',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('make',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('hash',270336,'sys::Int',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
Float.type$.af$('nan',106498,'sys::Float',{}).af$('posInf',106498,'sys::Float',{}).af$('defVal',106498,'sys::Float',{}).af$('negInf',106498,'sys::Float',{}).af$('e',106498,'sys::Float',{}).af$('pi',106498,'sys::Float',{}).am$('mult',8192,'sys::Float',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('mod',8192,'sys::Float',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('localePercent',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('cos',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('isNaN',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('atan',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('privateMake',2052,'sys::Void',List.make(Param.type$,[]),{}).am$('div',8192,'sys::Float',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('sqrt',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('exp',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('toDecimal',8192,'sys::Decimal',List.make(Param.type$,[]),{}).am$('clamp',8192,'sys::Float',List.make(Param.type$,[new Param('min','sys::Float',false),new Param('max','sys::Float',false)]),{}).am$('atan2',40962,'sys::Float',List.make(Param.type$,[new Param('y','sys::Float',false),new Param('x','sys::Float',false)]),{}).am$('tan',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('toStr',271360,'sys::Str',List.make(Param.type$,[]),{}).am$('sinh',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('toCode',8192,'sys::Str',List.make(Param.type$,[]),{}).am$('bits',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('toDegrees',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('ceil',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('acos',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('plus',8192,'sys::Float',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('divDecimal',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Decimal',false)]),{}).am$('localeMinus',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('fromStr',40966,'sys::Float?',List.make(Param.type$,[new Param('s','sys::Str',false),new Param('checked','sys::Bool',true)]),{}).am$('localeNegInf',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('makeBits32',40962,'sys::Float',List.make(Param.type$,[new Param('bits','sys::Int',false)]),{}).am$('normNegZero',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('divInt',8192,'sys::Float',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('localeGrouping',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('hash',271360,'sys::Int',List.make(Param.type$,[]),{}).am$('isNegZero',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('minus',8192,'sys::Float',List.make(Param.type$,[new Param('b','sys::Float',false)]),{}).am$('compare',271360,'sys::Int',List.make(Param.type$,[new Param('obj','sys::Obj',false)]),{}).am$('log',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('modInt',8192,'sys::Float',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('log10',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('increment',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('multInt',8192,'sys::Float',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('plusDecimal',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Decimal',false)]),{}).am$('random',40962,'sys::Float',List.make(Param.type$,[]),{}).am$('tanh',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('minusDecimal',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Decimal',false)]),{}).am$('min',8192,'sys::Float',List.make(Param.type$,[new Param('that','sys::Float',false)]),{}).am$('pow',8192,'sys::Float',List.make(Param.type$,[new Param('pow','sys::Float',false)]),{}).am$('sin',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('floor',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('bits32',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('plusInt',8192,'sys::Float',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{}).am$('toLocale',8192,'sys::Str',List.make(Param.type$,[new Param('pattern','sys::Str?',true),new Param('locale','sys::Locale',true)]),{}).am$('toInt',8192,'sys::Int',List.make(Param.type$,[]),{}).am$('modDecimal',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Decimal',false)]),{}).am$('max',8192,'sys::Float',List.make(Param.type$,[new Param('that','sys::Float',false)]),{}).am$('toFloat',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('toRadians',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('cosh',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('localeNaN',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('abs',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('round',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('makeBits',40962,'sys::Float',List.make(Param.type$,[new Param('bits','sys::Int',false)]),{}).am$('negate',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('decrement',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('minusInt',8192,'sys::Float',List.make(Param.type$,[new Param('b','sys::Int',false)]),{}).am$('equals',271360,'sys::Bool',List.make(Param.type$,[new Param('obj','sys::Obj?',false)]),{}).am$('asin',8192,'sys::Float',List.make(Param.type$,[]),{}).am$('localeDecimal',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('multDecimal',8192,'sys::Decimal',List.make(Param.type$,[new Param('b','sys::Decimal',false)]),{}).am$('clip',8192,'sys::Float',List.make(Param.type$,[new Param('min','sys::Float',false),new Param('max','sys::Float',false)]),{}).am$('localePosInf',40962,'sys::Str',List.make(Param.type$,[]),{}).am$('approx',8192,'sys::Bool',List.make(Param.type$,[new Param('r','sys::Float',false),new Param('tolerance','sys::Float?',true)]),{});
Service.type$.am$('toStr',270336,'sys::Str',List.make(Param.type$,[]),{}).am$('compare',270336,'sys::Int',List.make(Param.type$,[new Param('that','sys::Obj',false)]),{}).am$('isInstalled',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('start',8192,'sys::This',List.make(Param.type$,[]),{}).am$('echo',40962,'sys::Void',List.make(Param.type$,[new Param('x','sys::Obj?',true)]),{}).am$('list',40962,'sys::Service[]',List.make(Param.type$,[]),{}).am$('findAll',40962,'sys::Service[]',List.make(Param.type$,[new Param('t','sys::Type',false)]),{}).am$('with',270336,'sys::This',List.make(Param.type$,[new Param('f','|sys::This->sys::Void|',false)]),{}).am$('onStart',266240,'sys::Void',List.make(Param.type$,[]),{}).am$('stop',8192,'sys::This',List.make(Param.type$,[]),{}).am$('uninstall',8192,'sys::This',List.make(Param.type$,[]),{}).am$('isRunning',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('install',8192,'sys::This',List.make(Param.type$,[]),{}).am$('isImmutable',8192,'sys::Bool',List.make(Param.type$,[]),{}).am$('find',40962,'sys::Service?',List.make(Param.type$,[new Param('t','sys::Type',false),new Param('checked','sys::Bool',true)]),{}).am$('equals',9216,'sys::Bool',List.make(Param.type$,[new Param('that','sys::Obj?',false)]),{}).am$('trap',270336,'sys::Obj?',List.make(Param.type$,[new Param('name','sys::Str',false),new Param('args','sys::Obj?[]?',true)]),{}).am$('toImmutable',8192,'sys::This',List.make(Param.type$,[]),{}).am$('hash',9216,'sys::Int',List.make(Param.type$,[]),{}).am$('onStop',266240,'sys::Void',List.make(Param.type$,[]),{}).am$('typeof',8192,'sys::Type',List.make(Param.type$,[]),{});
class FConst {
  static Abstract   = 0x00000001;
  static Const      = 0x00000002;
  static Ctor       = 0x00000004;
  static Enum       = 0x00000008;
  static Facet      = 0x00000010;
  static Final      = 0x00000020;
  static Getter     = 0x00000040;
  static Internal   = 0x00000080;
  static Mixin      = 0x00000100;
  static Native     = 0x00000200;
  static Override   = 0x00000400;
  static Private    = 0x00000800;
  static Protected  = 0x00001000;
  static Public     = 0x00002000;
  static Setter     = 0x00004000;
  static Static     = 0x00008000;
  static Storage    = 0x00010000;
  static Synthetic  = 0x00020000;
  static Virtual    = 0x00040000;
  static FlagsMask  = 0x0007ffff;
}
const buf_crypto = (function () {
  const crypto = {};
  crypto.pbkdf2 = function(PRF, hLen, key, salt, iterations, dkLen)
  {
    const F = function F(P, S, c, i) {
      let U_r;
      let U_c;
      const xor = function(a, b) {
        let aw = a;
        let bw = b;
        if (aw.length != bw.length) throw "Lengths don't match";
        for (let i = 0; i < aw.length; ++i) {
          aw[i] ^= bw[i];
        }
        return aw;
      };
      S = S.concat(crypto.wordsToBytes([i]));
      U_r = U_c = PRF(P, S);
      for (let iter = 1; iter < c; ++iter) {
        U_c = PRF(P, crypto.wordsToBytes(U_c));
        U_r = xor(U_r, U_c);
      }
      return crypto.wordsToBytes(U_r);
    };
    key  = Array.from(key);
    salt = Array.from(salt);
    const l = Math.ceil(dkLen / hLen);
    const r = dkLen - (l - 1) * hLen;
    let T = [];
    let block;
    for (let i = 1; i <= l; ++i) {
      block = F(key, salt, iterations, i);
      T = T.concat(block);
    }
    return T.slice(0, dkLen);
  }
  crypto.bytesToWords = function(bytes)
  {
    var words = new Array();
    var size = bytes.length;
    for (var i=0; size>3 && (i+4)<=size; i+=4)
    {
      words.push((bytes[i]<<24) | (bytes[i+1]<<16) | (bytes[i+2]<<8) | bytes[i+3]);
    }
    var rem = bytes.length % 4;
    if (rem > 0)
    {
      if (rem == 3) words.push((bytes[size-3]<<24) | (bytes[size-2]<<16) | bytes[size-1]<<8);
      if (rem == 2) words.push((bytes[size-2]<<24) | bytes[size-1]<<16);
      if (rem == 1) words.push(bytes[size-1]<<24);
    }
    return words;
  }
  crypto.wordsToBytes = function(dw) {
    var db = new Array();
    for (var i=0; i<dw.length; i++)
    {
      db.push(0xff & (dw[i] >> 24));
      db.push(0xff & (dw[i] >> 16));
      db.push(0xff & (dw[i] >> 8));
      db.push(0xff & dw[i]);
    }
    return db;
  }
  return crypto;
})();
class MemBufOutStream extends OutStream {
  constructor(buf) {
    super();
    this.buf = buf;
  }
  buf;
  static make(buf) {
    const self = new MemBufOutStream(buf);
    MemBufOutStream.make$(self);
    return self;
  }
  static make$(self, out) {
    OutStream.make$(self, out);
  }
  write(v) {
    if (this.buf.__pos+1 >= this.buf.data.length) this.buf.grow(this.buf.__pos+1);
    this.buf.data[this.buf.__pos++] = (0xff & v);
    if (this.buf.__pos > this.buf.__size) this.buf.__size = this.buf.__pos;
    return this;
  }
  writeChar(c) {
    this.charset().__encoder().encodeOut(c, this);
    return this;
  }
  writeBuf(other, n=other.remaining()) {
    this.buf.grow(this.buf.__pos + n);
    if (other.__pos+n > other.__size)
      throw IOErr.make("Not enough bytes to write");
    const orig = this.buf.data;
    let temp = other.data.slice(other.__pos, other.__pos+n);
    this.buf.data = MemBuf.__concat(this.buf.data.slice(0, this.buf.__pos), temp);
    this.buf.__pos += n;
    other.__pos += n;
    const remaining = this.buf.__size - this.buf.__pos;
    if (remaining > 0) {
      temp = orig.slice(this.buf.__pos, this.buf.__pos+remaining);
      this.buf.data = MemBuf.__concat(this.buf.data, temp);
    }
    if (this.buf.__pos > this.buf.__size) this.buf.__size = this.buf.__pos;
    return this;
  }
  flush() {}
  sync() {}
}
class MemBufInStream extends InStream {
  constructor(buf) {
    super();
    this.buf = buf;
  }
  buf;
  static make(buf) {
    const self = new MemBufInStream(buf);
    MemBufInStream.make$(self);
    return self;
  }
  static make$(self) {
    InStream.make$(self);
  }
  read() {
    if (this.buf.__pos >= this.buf.__size) return null;
    return this.buf.data[this.buf.__pos++] & 0xff;
  }
  readChar() {
    const c = this.__rChar();
    return (c < 0) ? null : c;
  }
  __rChar() {
    return this.charset().__encoder().decode(this);
  }
  readBuf(other, n) {
    if (this.buf.__pos >= this.buf.__size) return null;
    const len = Math.min(this.buf.__size-this.buf.__pos, n);
    const orig = other.data;
    let temp = this.buf.data.slice(this.buf.__pos, this.buf.__pos+len);
    other.data = MemBuf.__concat(other.data.slice(0, other.__pos), temp);
    this.buf.__pos += len;
    other.__pos += len;
    other.__size = other.__pos;
    const remaining =  other.__size - other.__pos;
    if (remaining > 0) {
      temp = orig.slice(other.__pos, other.__pos+remaining);
      other.data = MemBuf.__concat(other.data, temp);
    }
    return len;
  }
  unread(n) {
    n &= 0xFF;
    if (this.buf.__pos > 0 && this.buf.data[this.buf.__pos-1] == n)
    {
      this.buf.__pos--;
    }
    else
    {
      if (this.buf.__size+1 >= this.buf.data.length) this.buf.grow(this.buf.__size+1);
      const temp = this.buf.data.slice(this.buf.__pos, this.buf.data.length - 1);
      this.buf.data[this.buf.__pos] = n;
      this.buf.data.set(temp, this.buf.__pos + 1);
      this.buf.__size++;
    }
    return this;
  }
  avail() { return this.buf.remaining(); }
  peek() {
    if (this.buf.__pos >= this.buf.__size) return null;
    return this.buf.data[this.buf.__pos] & 0xFF;
  }
  skip(n) {
    const oldPos = this.buf.__pos;
    this.buf.__pos += n;
    if (this.buf.__pos < this.buf.__size) return n;
    this.buf.__pos = this.buf.__size;
    return this.buf.__pos-oldPos;
  }
}
class ErrInStream extends InStream {
  constructor() { super(); }
  read()            { throw this.err(); }
  rChar()           { throw this.err(); }
  readBuf(other, n) { throw this.err(); }
  unread(n)         { throw this.err(); }
  unread(n)         { throw this.err(); }
  endian(endian)    { throw this.err(); }
  charset(charset)  { throw this.err(); }
  err() { return ReadonlyErr.make("Buf is immutable; use Buf.in()"); }
}
class ErrOutStream extends OutStream {
  constructor() { super(); }
  write(v)           { throw this.err(); }
  writeBuf(other, n) { throw this.err(); }
  writeChar(c)       { throw this.err(); }
  writeChar(c)       { throw this.err(); }
  endian(endian)     { throw this.err(); }
  charset(charset)   { throw this.err(); }
  err() { return ReadonlyErr.make("Buf is immutable"); }
}
class ConstBufInStream extends InStream {
  constructor(buf) {
    super();
    this.buf    = buf;
    this.__pos  = 0;
    this.__size = buf.size();
  }
  buf;
  __pos;
  __size;
  read() {
    if (this.__pos >= this.__size) return null;
    return this.buf.data[this.__pos++] & 0xFF;
  }
  readBuf(other, n) {
    if (this.__pos >= this.__size) return null;
    const len = Math.min(this.__size - this.__pos, n);
    other.pipeFrom(this.buf.data, this.__pos, len);
    this.__pos += len;
    return len;
  }
  unread(n) {
    if (this.__pos > 0 && this.buf.data[this.__pos-1] == n) {
      this.__pos--;
    }
    else {
      throw this.buf.err();
    }
    return this;
  }
  peek() {
    if (this.__pos >= this.__size) return null;
    return this.buf.data[this.__pos] & 0xFF;
  }
  skip(n) {
    const oldPos = this.__pos;
    this.__pos += n;
    if (this.__pos < this.__size) return n;
    this.__pos = this.__size;
    return this.__pos-oldPos;
  }
}
const buf_md5 = function(buf, key)
{
  const chrsz = 8;
  function core_md5(x, len)
  {
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a =  1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d =  271733878;
    for(var i=0; i<x.length; i+=16)
    {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;
      a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
      d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
      c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
      b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
      a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
      d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
      c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
      b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
      a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
      d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
      c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
      b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
      a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
      d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
      c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
      b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
      a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
      d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
      c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
      b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
      a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
      d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
      c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
      b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
      a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
      d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
      c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
      b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
      a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
      d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
      c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
      b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
      a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
      d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
      c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
      b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
      a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
      d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
      c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
      b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
      a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
      d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
      c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
      b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
      a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
      d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
      c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
      b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
      a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
      d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
      c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
      b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
      a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
      d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
      c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
      b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
      a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
      d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
      c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
      b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
      a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
      d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
      c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
      b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);
  }
  function md5_cmn(q, a, b, x, s, t) { return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b); }
  function md5_ff(a, b, c, d, x, s, t) { return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function md5_gg(a, b, c, d, x, s, t) { return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function md5_hh(a, b, c, d, x, s, t) { return md5_cmn(b ^ c ^ d, a, b, x, s, t); }
  function md5_ii(a, b, c, d, x, s, t) { return md5_cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function core_hmac_md5(key, data)
  {
    var bkey = bytesToWords(key);
    if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);
    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++)
    {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    var hash = core_md5(ipad.concat(bytesToWords(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
  }
  function safe_add(x, y)
  {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }
  function bit_rol(num, cnt)
  {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function bytesToWords(bytes)
  {
    var words = new Array();
    var size = bytes.length;
    for (var i=0; size>3 && (i+4)<=size; i+=4)
    {
      words.push((bytes[i+3]<<24) | (bytes[i+2]<<16) | (bytes[i+1]<<8) | bytes[i]);
    }
    var rem = bytes.length % 4;
    if (rem > 0)
    {
      if (rem == 3) words.push((bytes[size-1]<<16) | (bytes[size-2]<<8) | bytes[size-3]);
      if (rem == 2) words.push((bytes[size-1]<<8) | bytes[size-2]);
      if (rem == 1) words.push(bytes[size-1]);
    }
    return words;
  }
  const dw = (key === undefined)
    ? core_md5(bytesToWords(buf), buf.length * chrsz)
    : core_hmac_md5(key, buf);
  const db = new Array();
  for (let i=0; i<dw.length; i++) {
    db.push(0xff & dw[i]);
    db.push(0xff & (dw[i] >> 8));
    db.push(0xff & (dw[i] >> 16));
    db.push(0xff & (dw[i] >> 24));
  }
  return db;
}
class ObjUtil {
  static hash(obj) {
    if (obj instanceof Obj) return obj.hash();
    const t = typeof obj;
    if (t === "number") return parseInt(obj);
    if (t === "string") return Str.hash(obj);
    if (t === "boolean") return Bool.hash(obj);
    return 0;
  }
  static equals(a, b) {
    if (a == null) return b == null;
    if (a instanceof Obj) return a.equals(b);
    const t = typeof a;
    if (t === "number") return Int.equals(a, b);
    if (t === "string") return a === b;
    const f = a.fanType$;
    if (f === Float.type$) return Float.equals(a, b);
    if (f === Decimal.type$) return Decimal.equals(a, b);
    return a === b;
  }
  static same(a, b) {
    if (a == null) return b == null;
    if (a instanceof Obj || b instanceof Obj) return a === b;
    return ObjUtil.equals(a,b);
  }
  static compare(a, b, op) {
    if (a instanceof Obj) {
      if (b == null) return +1;
      return a.compare(b);
    }
    else if (a != null && a.fanType$ != null) {
      if (op === true && (isNaN(a) || isNaN(b))) return Number.NaN;
      return Float.compare(a, b);
    }
    else {
      if (a == null) {
        if (b != null) return -1;
        return 0;
      }
      if (b == null) return 1;
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    }
  }
  static compareNE(a,b) { return !ObjUtil.equals(a,b); }
  static compareLT(a,b) { return ObjUtil.compare(a,b,true) <  0; }
  static compareLE(a,b) { return ObjUtil.compare(a,b,true) <= 0; }
  static compareGE(a,b) { return ObjUtil.compare(a,b,true) >= 0; }
  static compareGT(a,b) { return ObjUtil.compare(a,b,true) >  0; }
  static is(obj, type) {
    if (obj == null) return false;
    return ObjUtil.typeof(obj).is(type);
  }
  static as(obj, type) {
    if (obj == null) return null;
    type = type.toNonNullable();
    if (obj instanceof Function) {
      obj.fanType$ = type;
      return obj;
    }
    const t = ObjUtil.typeof(obj);
    if (t.is(Func.type$)) return t.as(obj, type);
    if (t.is(List.type$)) return t.as(obj, type);
    if (t.is(Map.type$))  return t.as(obj, type);
    if (t.is(type)) return obj;
    return null;
  }
  static coerce(obj, type) {
    if (obj == null) {
      if (type.isNullable()) return obj;
      throw NullErr.make("Coerce to non-null");
    }
    const v = ObjUtil.as(obj, type);
    if (v == null) {
      const t = ObjUtil.typeof(obj);
      throw CastErr.make(t + " cannot be cast to " + type);
    }
    return obj;
  }
  static typeof(obj) {
    if (obj instanceof Obj) return obj.typeof();
    else return Type.toFanType(obj);
  }
  static trap(obj, name, args) {
    if (obj instanceof Obj) return obj.trap(name, args);
    else return ObjUtil.doTrap(obj, name, args, Type.toFanType(obj));
  }
  static doTrap(obj, name, args, type) {
    const slot = type.slot(name, true);
    if (slot instanceof Method) {
      return slot.invoke(obj, args);
    }
    else
    {
      const argSize = (args == null) ? 0 : args.size();
      if (argSize == 0) return slot.get(obj);
      if (argSize == 1) {
        const val = args.get(0);
        slot.set(obj, val);
        return val;
      }
      throw ArgErr.make("Invalid number of args to get or set field '" + name + "'");
    }
  }
  static isImmutable(obj) {
    if (obj instanceof Obj) return obj.isImmutable();
    else if (obj == null) return true;
    else {
      if ((typeof obj) == "boolean" || obj instanceof Boolean) return true;
      if ((typeof obj) == "number"  || obj instanceof Number) return true;
      if ((typeof obj) == "string"  || obj instanceof String) return true;
      if ((typeof obj) == "function" || obj instanceof Function) return true;
      if (obj.fanType$ != null) return true;
    }
    throw UnknownTypeErr.make("Not a Fantom type: " + obj);
  }
  static toImmutable(obj) {
    if (obj instanceof Obj) return obj.toImmutable();
    else if (obj == null) return null;
    else {
      if ((typeof obj) == "boolean" || obj instanceof Boolean) return obj;
      if ((typeof obj) == "number"  || obj instanceof Number) return obj;
      if ((typeof obj) == "string"  || obj instanceof String) return obj;
      if ((typeof obj) == "function" || obj instanceof Function) return obj;
      if (obj.fanType$ != null) return obj;
    }
    throw UnknownTypeErr.make("Not a Fantom type: " + obj);
  }
  static with(self, f) {
    if (self instanceof Obj) {
      return self.with(f);
    }
    else {
      f(self);
      return self;
    }
  }
  static toStr(obj) {
    if (obj == null) return "null";
    if (typeof obj == "string") return obj;
if (obj.fanType$ === Float.type$) return Float.toStr(obj);
    return obj.toString();
  }
  static echo(obj) {
    if (obj === undefined) obj = "";
    let s = ObjUtil.toStr(obj);
    try { console.log(s); }
    catch (e1)
    {
      try { print(s + "\n"); }
      catch (e2) {}
    }
  }
}
const buf_sha1 = (function () {
  const crypto = buf_crypto;
  const ns = {};
  const chrsz = 8;
  function core_sha1(x, len)
  {
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;
    var w = Array(80);
    var a =  1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d =  271733878;
    var e = -1009589776;
    for(var i = 0; i < x.length; i += 16)
    {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;
      var olde = e;
      for(var j = 0; j < 80; j++)
      {
        if(j < 16) w[j] = x[i + j];
        else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
        var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                         safe_add(safe_add(e, w[j]), sha1_kt(j)));
        e = d;
        d = c;
        c = rol(b, 30);
        b = a;
        a = t;
      }
      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
      e = safe_add(e, olde);
    }
    return Array(a, b, c, d, e);
  }
  function sha1_ft(t, b, c, d)
  {
    if(t < 20) return (b & c) | ((~b) & d);
    if(t < 40) return b ^ c ^ d;
    if(t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
  }
  function sha1_kt(t)
  {
    return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
           (t < 60) ? -1894007588 : -899497514;
  }
  function core_hmac_sha1(key, data)
  {
    var bkey = crypto.bytesToWords(key);
    if(bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);
    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++)
    {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    var hash = core_sha1(ipad.concat(crypto.bytesToWords(data)), 512 + data.length * chrsz);
    return core_sha1(opad.concat(hash), 512 + 160);
  }
  function safe_add(x, y)
  {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }
  function rol(num, cnt)
  {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  ns.digest = function(buf, key)
  {
    var dw = (key === undefined)
      ? core_sha1(crypto.bytesToWords(buf), buf.length * chrsz)
      : core_hmac_sha1(key, buf);
    return crypto.wordsToBytes(dw);
  }
  ns.pbkdf2 = function(key, salt, iterations, dkLen)
  {
    return crypto.pbkdf2(core_hmac_sha1, 20, key, salt, iterations, dkLen);
  }
  return ns;
})();
const buf_sha256 = (function () {
  const crypto = buf_crypto;
  const ns = {};
  function sha256_S (X, n) {return ( X >>> n ) | (X << (32 - n));}
  function sha256_R (X, n) {return ( X >>> n );}
  function sha256_Ch(x, y, z) {return ((x & y) ^ ((~x) & z));}
  function sha256_Maj(x, y, z) {return ((x & y) ^ (x & z) ^ (y & z));}
  function sha256_Sigma0256(x) {return (sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22));}
  function sha256_Sigma1256(x) {return (sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25));}
  function sha256_Gamma0256(x) {return (sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3));}
  function sha256_Gamma1256(x) {return (sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10));}
  function sha256_Sigma0512(x) {return (sha256_S(x, 28) ^ sha256_S(x, 34) ^ sha256_S(x, 39));}
  function sha256_Sigma1512(x) {return (sha256_S(x, 14) ^ sha256_S(x, 18) ^ sha256_S(x, 41));}
  function sha256_Gamma0512(x) {return (sha256_S(x, 1)  ^ sha256_S(x, 8) ^ sha256_R(x, 7));}
  function sha256_Gamma1512(x) {return (sha256_S(x, 19) ^ sha256_S(x, 61) ^ sha256_R(x, 6));}
  var sha256_K = new Array
  (
    1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993,
    -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987,
    1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522,
    264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
    -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585,
    113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
    1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885,
    -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344,
    430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
    1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872,
    -1866530822, -1538233109, -1090935817, -965641998
  );
  function binb_sha256(m, l)
  {
    var HASH = new Array(1779033703, -1150833019, 1013904242, -1521486534,
                         1359893119, -1694144372, 528734635, 1541459225);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h;
    var i, j, T1, T2;
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;
    for(i = 0; i < m.length; i += 16)
    {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];
      for(j = 0; j < 64; j++)
      {
        if (j < 16) W[j] = m[j + i];
        else W[j] = safe_add(safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]),
                                              sha256_Gamma0256(W[j - 15])), W[j - 16]);
        T1 = safe_add(safe_add(safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)),
                                                            sha256_K[j]), W[j]);
        T2 = safe_add(sha256_Sigma0256(a), sha256_Maj(a, b, c));
        h = g;
        g = f;
        f = e;
        e = safe_add(d, T1);
        d = c;
        c = b;
        b = a;
        a = safe_add(T1, T2);
      }
      HASH[0] = safe_add(a, HASH[0]);
      HASH[1] = safe_add(b, HASH[1]);
      HASH[2] = safe_add(c, HASH[2]);
      HASH[3] = safe_add(d, HASH[3]);
      HASH[4] = safe_add(e, HASH[4]);
      HASH[5] = safe_add(f, HASH[5]);
      HASH[6] = safe_add(g, HASH[6]);
      HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
  }
  function safe_add (x, y)
  {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }
  function hmac_sha256(key, data)
  {
    var bkey = crypto.bytesToWords(key);
    if(bkey.length > 16) bkey = binb_sha256(bkey, key.length * 8);
    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++)
    {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    var hash = binb_sha256(ipad.concat(crypto.bytesToWords(data)), 512 + data.length * 8);
    return binb_sha256(opad.concat(hash), 512 + 256);
  }
  ns.digest = function(data, key)
  {
    var hash;
    if (key === undefined)
      hash = binb_sha256(crypto.bytesToWords(data), data.length * 8);
    else
      hash = hmac_sha256(key, data);
    return crypto.wordsToBytes(hash);
  }
  ns.pbkdf2 = function(key, salt, iterations, dkLen)
  {
    return crypto.pbkdf2(hmac_sha256, 32, key, salt, iterations, dkLen);
  }
  return ns;
})();
class StrInStream extends InStream {
  constructor(str) {
    super();
    this.#str = str;
    this.#size = str.length;
    this.#pos = 0;
    this.#pushback = null;
  }
  #str;
  #size;
  #pos;
  #pushback;
  __toCharInStream() { return this; }
  read() { throw UnsupportedErr.make("Binary read on Str.in"); }
  readBuf() { throw UnsupportedErr.make("Binary read on Str.in"); }
  unread() { throw UnsupportedErr.make("Binary read on Str.in"); }
  __rChar() {
    if (this.#pushback != null && this.#pushback.length > 0)
      return this.#pushback.pop();
    if (this.#pos >= this.#size) return -1;
    return this.#str.charCodeAt(this.#pos++);
  }
  readChar() {
    const c = this.__rChar();
    return (c < 0) ? null : c;
  }
  unreadChar(c) {
    if (this.#pushback == null) this.#pushback = [];
    this.#pushback.push(c);
    return this;
  }
  close() { return true; }
}
class StrBufOutStream extends OutStream {
  constructor(buf) {
    super();
    this.#buf = buf;
  }
  #buf;
  w(v) { throw UnsupportedErr.make("binary write on StrBuf output"); }
  write(x) { throw UnsupportedErr.make("binary write on StrBuf output"); }
  writeBuf(buf, n) { throw UnsupportedErr.make("binary write on StrBuf output"); }
  writeI2(x) { throw UnsupportedErr.make("binary write on StrBuf output"); }
  writeI4(x) { throw UnsupportedErr.make("binary write on StrBuf output"); }
  writeI8(x) { throw UnsupportedErr.make("binary write on StrBuf output"); }
  writeF4(x) { throw UnsupportedErr.make("binary write on StrBuf output"); }
  writeF8(x) { throw UnsupportedErr.make("binary write on StrBuf output"); }
  writeUtf(x) { throw UnsupportedErr.make("modified UTF-8 format write on StrBuf output"); }
  writeChar(c) {
    this.#buf.addChar(c);
    return this;
  }
  writeChars(s, off=0, len=s.length-off) {
    this.#buf.add(s.slice(off, off+len));
    return this;
  }
  flush() { return this; }
  close() { return true; }
}
class DateTimeStr
{
  constructor(pattern="", locale=null) {
    this.pattern = pattern;
    this.loc = locale;
  }
  pattern;
  loc;
  year = 0;
  mon = null;
  day = 0;
  hour = 0;
  min = 0;
  sec = 0;
  ns = 0;
  weekday = null;
  tz = null;
  tzName = null;
  tzOffset = 0;
  dst = 0;
  str = "";
  pos = 0;
  valDateTime;
  valDate;
  static makeDateTime(pattern, locale, dt) {
    const x = new DateTimeStr(pattern, locale);
    x.valDateTime = dt;
    x.year    = dt.year();
    x.mon     = dt.month();
    x.day     = dt.day();
    x.hour    = dt.hour();
    x.min     = dt.min();
    x.sec     = dt.sec();
    x.ns      = dt.nanoSec();
    x.weekday = dt.weekday();
    x.tz      = dt.tz();
    x.dst     = dt.dst();
    return x;
  }
  static makeDate(pattern, locale, d) {
    const x = new DateTimeStr(pattern, locale);
    x.valDate = d;
    x.year    = d.year();
    x.mon     = d.month();
    x.day     = d.day();
    try { x.weekday = d.weekday(); } catch (e) {}
    return x;
  }
  static makeTime(pattern, locale, t) {
    const x = new DateTimeStr(pattern, locale);
    x.hour    = t.hour();
    x.min     = t.min();
    x.sec     = t.sec();
    x.ns      = t.nanoSec();
    return x;
  }
  static make(pattern, locale) {
    return new DateTimeStr(pattern, locale);
  }
  format() {
    let s = "";
    const len = this.pattern.length;
    for (let i=0; i<len; ++i)
    {
      let c = this.pattern.charAt(i);
      if (c == '\'') {
        let numLiterals = 0;
        while (true) {
          ++i;
          if (i >= len) throw ArgErr.make("Invalid pattern: unterminated literal");
          c = this.pattern.charAt(i);
          if (c == '\'') break;
          s += c;
          numLiterals++;
        }
        if (numLiterals == 0) s += "'";
        continue;
      }
      let n = 1;
      while (i+1<len && this.pattern.charAt(i+1) == c) { ++i; ++n; }
      let invalidNum = false;
      switch (c) {
        case 'Y':
          let y = this.year;
          switch (n)
          {
            case 2:  y %= 100; if (y < 10) s += '0';
            case 4:  s += y; break;
            default: invalidNum = true;
          }
          break;
        case 'M':
          switch (n)
          {
            case 4:
              s += this.mon.__full(this.locale());
              break;
            case 3:
              s += this.mon.__abbr(this.locale());
              break;
            case 2:  if (this.mon.ordinal()+1 < 10) s += '0';
            case 1:  s += this.mon.ordinal()+1; break;
            default: invalidNum = true;
          }
          break;
        case 'D':
          switch (n)
          {
            case 3:  s += this.day + DateTimeStr.daySuffix(this.day); break;
            case 2:  if (this.day < 10) s += '0';
            case 1:  s += this.day; break;
            default: invalidNum = true;
          }
          break;
        case 'W':
          switch (n)
          {
            case 4:
              s += this.weekday.__full(this.locale());
              break;
            case 3:
              s += this.weekday.__abbr(this.locale());
              break;
            default: invalidNum = true;
          }
          break;
        case 'Q':
          let quarter = this.mon.__quarter();
          switch (n)
          {
            case 4:  s += quarter + DateTimeStr.daySuffix(quarter) + " " + this.quarterLabel(); break;
            case 3:  s += quarter + DateTimeStr.daySuffix(quarter); break;
            case 1:  s += quarter; break;
            default: invalidNum = true;
          }
          break;
        case 'V':
          let woy = this.weekOfYear();
          if (woy < 1) throw ArgErr.make("Week of year not available");
          switch (n)
          {
            case 3:  s += woy + DateTimeStr.daySuffix(woy); break;
            case 2:  if (woy < 10) s += '0';
            case 1:  s += woy; break;
            default: invalidNum = true;
          }
          break;
        case 'h':
        case 'k':
          var h = this.hour;
          if (c == 'k') {
            if (h == 0) h = 12;
            else if (h > 12) h -= 12;
          }
          switch (n)
          {
            case 2:  if (h < 10) s += '0';
            case 1:  s += h; break;
            default: invalidNum = true;
          }
          break;
        case 'm':
          switch (n)
          {
            case 2:  if (this.min < 10) s += '0';
            case 1:  s += this.min; break;
            default: invalidNum = true;
          }
          break;
        case 's':
          switch (n)
          {
            case 2:  if (this.sec < 10) s += '0';
            case 1:  s += this.sec; break;
            default: invalidNum = true;
          }
          break;
        case 'S':
          if (this.sec != 0 || this.ns != 0) {
            switch (n)
            {
              case 2:  if (this.sec < 10) s += '0';
              case 1:  s += this.sec; break;
              default: invalidNum = true;
            }
          }
          break;
        case 'a':
          switch (n)
          {
            case 1:  s += (this.hour < 12 ? "a"  : "p"); break;
            case 2:  s += (this.hour < 12 ? "am" : "pm"); break;
            default: invalidNum = true;
          }
          break;
        case 'A':
          switch (n) {
            case 1:  s += (this.hour < 12 ? "A"  : "P"); break;
            case 2:  s += (this.hour < 12 ? "AM" : "PM"); break;
            default: invalidNum = true;
          }
          break;
        case 'f':
        case 'F':
          let req = 0, opt = 0;
          if (c == 'F') opt = n;
          else {
            req = n;
            while (i+1<len && this.pattern.charAt(i+1) == 'F') { ++i; ++opt; }
          }
          let frac = this.ns;
          for (let x=0, tenth=100000000; x<9; ++x)
          {
            if (req > 0) req--;
            else {
              if (frac == 0 || opt <= 0) break;
              opt--;
            }
            s += Math.floor(frac / tenth);
            frac %= tenth;
            tenth  = Math.floor(tenth / 10);
          }
          break;
        case 'z':
          const rule = this.tz.__rule(this.year);
          switch (n)
          {
            case 1:
              var offset = rule.offset;
              if (this.dst) offset += rule.dstOffset;
              if (offset == 0) { s += 'Z'; break; }
              if (offset < 0) { s += '-'; offset = -offset; }
              else { s += '+'; }
              var zh = Math.floor(offset / 3600);
              var zm = Math.floor((offset % 3600) / 60);
              if (zh < 10) s += '0'; s += zh + ':';
              if (zm < 10) s += '0'; s += zm;
              break;
            case 3:
              s += this.dst ? rule.dstAbbr : rule.stdAbbr;
              break;
            case 4:
              s += this.tz.name();
              break;
            default:
              invalidNum = true;
              break;
          }
          break;
        default:
          if (Int.isAlpha(c.charCodeAt(0)))
            throw ArgErr.make("Invalid pattern: unsupported char '" + c + "'");
          if (i+1 < len) {
            let next = this.pattern.charAt(i+1);
            if (next  == 'F' && this.ns == 0) break;
            if (next == 'S' && this.sec == 0 && this.ns == 0) break;
          }
          s += c;
      }
      if (invalidNum)
        throw ArgErr.make("Invalid pattern: unsupported num of '" + c + "' (x" + n + ")");
    }
    return s;
  }
  static daySuffix(day) {
    if (day == 11 || day == 12 || day == 13) return "th";
    switch (day % 10)
    {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }
  parseDateTime(s, defTz, checked=true) {
    try {
      this.tzOffset = null;
      this.parse(s);
      let defRule = defTz.__rule(this.year);
      if (this.tzName != null) {
        if (this.tzName == defTz.name() ||
            this.tzName == defRule.stdAbbr ||
            this.tzName == defRule.dstAbbr)
        {
          this.tz = defTz;
        }
        else
        {
          this.tz = TimeZone.fromStr(this.tzName, false);
          if (this.tz == null) this.tz = defTz;
        }
      }
      else if (this.tzOffset != null) {
        const time = this.hour*3600 + this.min*60 + this.sec;
        const defOffset = defRule.offset + TimeZone.__dstOffset(defRule, this.year, this.mon.ordinal(), this.day, time);
        if (this.tzOffset == defOffset)
          this.tz = defTz;
        else
          this.tz = TimeZone.__fromGmtOffset(this.tzOffset);
      }
      else this.tz = defTz;
      return DateTime.__doMake(this.year, this.mon, this.day, this.hour, this.min, this.sec, this.ns, this.tzOffset, this.tz);
    }
    catch (err) {
      if (checked) throw ParseErr.makeStr("DateTime", s, Err.make(err));
      return null;
    }
  }
  parseDate(s, checked=true) {
    try {
      this.parse(s);
      return Date.make(this.year, this.mon, this.day);
    }
    catch (err) {
      if (checked) throw ParseErr.makeStr("Date", s, Err.make(err));
      return null;
    }
  }
  parseTime(s, checked=true) {
    try {
      this.parse(s);
      return Time.make(this.hour, this.min, this.sec, this.ns);
    }
    catch (err) {
      if (checked) throw ParseErr.makeStr("Time", s, Err.make(err));
      return null;
    }
  }
  parse(s) {
    this.str = s;
    this.pos = 0;
    const len = this.pattern.length;
    let skippedLast = false;
    for (let i=0; i<len; ++i) {
      let c = this.pattern.charAt(i);
      let n = 1;
      while (i+1<len && this.pattern.charAt(i+1) == c) { ++i; ++n; }
      switch (c)
      {
        case 'Y':
          this.year = this.parseInt(n);
          if (this.year < 30) this.year += 2000;
          else if (this.year < 100) this.year += 1900;
          break;
        case 'M':
          switch (n)
          {
            case 4:  this.mon = this.parseMon(); break;
            case 3:  this.mon = this.parseMon(); break;
            default: this.mon = Month.vals().get(this.parseInt(n)-1); break;
          }
          break;
        case 'D':
          if (n != 3) this.day = this.parseInt(n);
          else
          {
            this.day = this.parseInt(1);
            this.skipWord();
          }
          break;
        case 'h':
        case 'k':
          this.hour = this.parseInt(n);
          break;
        case 'm':
          this.min = this.parseInt(n);
          break;
        case 's':
          this.sec = this.parseInt(n);
          break;
        case 'S':
          if (!skippedLast) this.sec = this.parseInt(n);
          break;
        case 'a':
        case 'A':
          var amPm = this.str.charAt(this.pos); this.pos += n;
          if (amPm == 'P' || amPm == 'p')
          {
            if (this.hour < 12) this.hour += 12;
          }
          else
          {
            if (this.hour == 12) this.hour = 0;
          }
          break;
        case 'W':
          this.skipWord();
          break;
        case 'F':
          if (skippedLast) break;
        case 'f':
          this.ns = 0;
          var tenth = 100000000;
          while (true) {
            let digit = this.parseOptDigit();
            if (digit < 0) break;
            this.ns += tenth * digit;
            tenth = Math.floor(tenth / 10);
          }
          break;
        case 'z':
          switch (n)
          {
            case 1:  this.parseTzOffset(); break;
            default: this.parseTzName();
          }
          break;
        case '\'':
          if (n == 2) {
            const actual = this.str.charAt(this.pos++);
            if (actual != '\'')
              throw Err.make("Expected single quote, not '" + actual + "' [pos " + this.pos +"]");
          }
          else {
            while (true) {
              const expected = this.pattern.charAt(++i);
              if (expected == '\'') break;
              const actual = this.str.charAt(this.pos++);
              if (actual != expected)
                throw Err.make("Expected '" + expected + "', not '" + actual + "' [pos " + this.pos +"]");
            }
          }
          break;
        default:
          const match = this.pos+1 < this.str.length ? this.str.charAt(this.pos++) : 0;
          if (i+1 < this.pattern.length) {
            const next = this.pattern.charAt(i+1);
            if (next == 'F' || next == 'S') {
              if (match != c) { skippedLast = true; --this.pos; break; }
            }
          }
          skippedLast = false;
          if (match != c)
            throw Err.make("Expected '" + c + "' literal char, not '" + match + "' [pos " + this.pos +"]");
      }
    }
  }
  parseInt(n) {
    let num = 0;
    for (let i=0; i<n; ++i) num = num*10 + this.parseReqDigit();
    if (n == 1) {
      const digit = this.parseOptDigit();
      if (digit >= 0) num = num*10 + digit;
    }
    return num;
  }
  parseReqDigit() {
    const ch = this.str.charCodeAt(this.pos++);
    if (48 <= ch && ch <= 57) return ch - 48;
    throw Err.make("Expected digit, not '" + String.fromCharCode(ch) + "' [pos " + (this.pos-1) + "]");
  }
  parseOptDigit() {
    if (this.pos < this.str.length) {
      const ch = this.str.charCodeAt(this.pos);
      if (48 <= ch && ch <= 57) { this.pos++; return ch-48; }
    }
    return -1;
  }
  parseMon() {
    let s = "";
    while (this.pos < this.str.length) {
      const ch = this.str.charCodeAt(this.pos);
      if (97 <= ch && ch <= 122) { s += String.fromCharCode(ch); this.pos++; continue; }
      if (65 <= ch && ch <= 90)  { s += String.fromCharCode(Int.lower(ch)); this.pos++; continue; }
      break;
    }
    const m = this.locale().__monthByName(s);
    if (m == null) throw Err.make("Invalid month: " + s);
    return m;
  }
  parseTzOffset() {
    let ch = this.str.charAt(this.pos++);
    let neg = false;
    switch (ch)
    {
      case '-': neg = true; break;
      case '+': neg = false; break;
      case 'Z': this.tzOffset = 0; return;
      default: throw Err.make("Unexpected tz offset char: " + ch + " [pos " + (this.pos-1) + "]");
    }
    let hr = this.parseInt(1);
    let min = 0;
    if (this.pos < this.str.length) {
      ch = this.str.charCodeAt(this.pos);
      if (ch == 58) {
        this.pos++;
        min = this.parseInt(1);
      }
      else if (48 <= ch && ch <= 57) {
        min = this.parseInt(1);
      }
    }
    this.tzOffset = hr*3600 + min*60;
    if (neg) this.tzOffset = -this.tzOffset;
  }
  parseTzName() {
    let s = "";
    while (this.pos < this.str.length) {
      const ch = this.str.charCodeAt(this.pos);
      if ((97 <= ch && ch <= 122) ||
          (65 <= ch && ch <= 90) ||
          (48 <= ch && ch <= 57) ||
          ch == 43 || ch == 45 || ch == 95)
      {
        s += String.fromCharCode(ch);
        this.pos++;
      }
      else break;
    }
    this.tzName = s;
  }
  skipWord() {
    while (this.pos < this.str.length) {
      const ch = this.str.charCodeAt(this.pos);
      if ((97 <= ch && ch <= 122) || (65 <= ch && ch <= 90))
        this.pos++;
      else
        break;
    }
  }
  locale() {
    if (this.loc == null) this.loc = Locale.cur();
    return this.loc;
  }
  weekOfYear()
  {
    const sow = Weekday.localeStartOfWeek(this.locale());
    if (this.valDateTime !== undefined) return this.valDateTime.weekOfYear(sow);
    if (this.valDate !== undefined)     return this.valDate.weekOfYear(sow);
    return 0;
  }
  quarterLabel() {
    return Env.cur().locale(Pod.find("sys"), "quarter", "Quarter", this.locale());
  }
}
class crc32 {
  static CRC_TABLE = [
    0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419,
    0x706af48f, 0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4,
    0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07,
    0x90bf1d91, 0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de,
    0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7, 0x136c9856,
    0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9,
    0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4,
    0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b,
    0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3,
    0x45df5c75, 0xdcd60dcf, 0xabd13d59, 0x26d930ac, 0x51de003a,
    0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599,
    0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924,
    0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190,
    0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f,
    0x9fbfe4a5, 0xe8b8d433, 0x7807c9a2, 0x0f00f934, 0x9609a88e,
    0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01,
    0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed,
    0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950,
    0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3,
    0xfbd44c65, 0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2,
    0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a,
    0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5,
    0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa, 0xbe0b1010,
    0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
    0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17,
    0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6,
    0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615,
    0x73dc1683, 0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8,
    0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1, 0xf00f9344,
    0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb,
    0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a,
    0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5,
    0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1,
    0xa6bc5767, 0x3fb506dd, 0x48b2364b, 0xd80d2bda, 0xaf0a1b4c,
    0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef,
    0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236,
    0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe,
    0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31,
    0x2cd99e8b, 0x5bdeae1d, 0x9b64c2b0, 0xec63f226, 0x756aa39c,
    0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713,
    0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b,
    0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242,
    0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1,
    0x18b74777, 0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c,
    0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45, 0xa00ae278,
    0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7,
    0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc, 0x40df0b66,
    0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
    0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605,
    0xcdd70693, 0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8,
    0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b,
    0x2d02ef8d
  ];
  static #ensureBuffer(input) {
    if (Buffer.isBuffer(input))
      return input;
    else if (typeof input === 'number')
      return Buffer.from([input]);
    else
      return Buffer.from(input);
  }
  static #crc32(buf, previous) {
    buf = crc32.#ensureBuffer(buf);
    if (Buffer.isBuffer(previous)) {
      previous = previous.readUInt32BE(0);
    }
    var crc = ~~previous ^ -1;
    for (let n = 0; n < buf.length; n++) {
      crc = crc32.CRC_TABLE[(crc ^ buf[n]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ -1);
  }
  static unsigned = function () {
    return crc32.#crc32.apply(null, arguments) >>> 0;
  };
}
class yauzl {
  static open(path, options) {
    if (options == null) options = {};
    if (options.autoClose == null) options.autoClose = true;
    if (options.decodeStrings == null) options.decodeStrings = true;
    if (options.validateEntrySizes == null) options.validateEntrySizes = true;
    if (options.strictFileNames == null) options.strictFileNames = false;
    const fd = node.fs.openSync(path, "r");
    try {
      return yauzl.fromFd(fd, options);
    } catch (e) {
      node.fs.closeSync(fd);
      throw e;
    }
  }
  static fromFd(fd, options) {
    if (options == null) options = {};
    if (options.autoClose == null) options.autoClose = false;
    if (options.decodeStrings == null) options.decodeStrings = true;
    if (options.validateEntrySizes == null) options.validateEntrySizes = true;
    if (options.strictFileNames == null) options.strictFileNames = false;
    const stats = node.fs.fstatSync(fd);
    const reader = new YauzlFileReader(fd);
    return yauzl.fromRandomAccessReader(reader, stats.size, options);
  }
  static fromRandomAccessReader(reader, totalSize, options) {
    if (options == null) options = {};
    if (options.autoClose == null) options.autoClose = true;
    if (options.decodeStrings == null) options.decodeStrings = true;
    const decodeStrings = !!options.decodeStrings;
    if (options.validateEntrySizes == null) options.validateEntrySizes = true;
    if (options.strictFileNames == null) options.strictFileNames = false;
    if (typeof totalSize !== "number")
      throw new Error("expected totalSize parameter to be a number");
    if (totalSize > Number.MAX_SAFE_INTEGER)
      throw new Error("zip file too large. only file sizes up to 2^52 are supported due to JavaScript's Number type being an IEEE 754 double.");
    const eocdrWithoutCommentSize = 22;
    const maxCommentSize = 0xffff;
    const bufferSize = Math.min(eocdrWithoutCommentSize + maxCommentSize, totalSize);
    const buffer = Buffer.allocUnsafe(bufferSize);
    const bufferReadStart = totalSize - buffer.length;
    yauzl.readAndAssertNoEof(reader, buffer, 0, bufferSize, bufferReadStart);
    for (let i = bufferSize - eocdrWithoutCommentSize; i >= 0; i -= 1) {
      if (buffer.readUInt32LE(i) !== 0x06054b50) continue;
      const eocdrBuffer = buffer.subarray(i);
      const diskNumber = eocdrBuffer.readUInt16LE(4);
      if (diskNumber !== 0)
        throw new Error("multi-disk zip files are not supported: found disk number: " + diskNumber);
      let entryCount = eocdrBuffer.readUInt16LE(10);
      let centralDirectoryOffset = eocdrBuffer.readUInt32LE(16);
      const commentLength = eocdrBuffer.readUInt16LE(20);
      const expectedCommentLength = eocdrBuffer.length - eocdrWithoutCommentSize;
      if (commentLength !== expectedCommentLength)
        throw new Error("invalid comment length. expected: " + expectedCommentLength + ". found: " + commentLength);
      const comment = decodeStrings ? yauzl.decodeBuffer(eocdrBuffer, 22, eocdrBuffer.length, false)
                                  : eocdrBuffer.subarray(22);
      if (!(entryCount === 0xffff || centralDirectoryOffset === 0xffffffff))
        return new YauzlZipFile(reader, centralDirectoryOffset, totalSize, entryCount, comment, options.autoClose, decodeStrings, options.validateEntrySizes, options.strictFileNames);
      const zip64EocdlBuffer = Buffer.allocUnsafe(20);
      const zip64EocdlOffset = bufferReadStart + i - zip64EocdlBuffer.length;
      yauzl.readAndAssertNoEof(reader, zip64EocdlBuffer, 0, zip64EocdlBuffer.length, zip64EocdlOffset);
      if (zip64EocdlBuffer.readUInt32LE(0) !== 0x07064b50)
        throw new Error("invalid zip64 end of central directory locator signature");
      const zip64EocdrOffset = yauzl.readUInt64LE(zip64EocdlBuffer, 8);
      const zip64EocdrBuffer = Buffer.allocUnsafe(56);
      yauzl.readAndAssertNoEof(reader, zip64EocdrBuffer, 0, zip64EocdrBuffer.length, zip64EocdrOffset);
      if (zip64EocdrBuffer.readUInt32LE(0) !== 0x06064b50)
        throw new Error("invalid zip64 end of central directory record signature");
      entryCount = yauzl.readUInt64LE(zip64EocdrBuffer, 32);
      centralDirectoryOffset = yauzl.readUInt64LE(zip64EocdrBuffer, 48);
      return new YauzlZipFile(reader, centralDirectoryOffset, totalSize, entryCount, comment, options.autoClose, decodeStrings, options.validateEntrySizes, options.strictFileNames);
    }
    throw new Error("end of central directory record signature not found");
  }
  static fromStream(in$) {
    const reader = new YauzlStreamReader(in$);
    return new YauzlZipFile(reader);
  }
  static readAndAssertNoEof(reader, buffer, offset, length, position, errCallback, self) {
    if (length === 0) return;
    const bytesRead = reader.read(buffer, offset, length, position);
    if (bytesRead < length) {
      const e = new Error("unexpected EOF");
      if (errCallback) return errCallback.call(self, e);
      else throw e;
    }
  }
  static readUInt64LE(buffer, offset) {
    const lower32 = buffer.readUInt32LE(offset);
    const upper32 = buffer.readUInt32LE(offset + 4);
    return upper32 * 0x100000000 + lower32;
  }
  static #cp437 = '\u0000☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ';
  static decodeBuffer(buffer, start, end, isUtf8) {
    if (isUtf8) {
      return buffer.toString("utf8", start, end);
    } else {
      let result = "";
      for (let i = start; i < end; i++) {
        result += yauzl.#cp437[buffer[i]];
      }
      return result;
    }
  }
  static dosDateTimeToFantom(date, time) {
    const day = date & 0x1f;
    const month = (date >> 5 & 0xf) - 1;
    const year = (date >> 9 & 0x7f) + 1980;
    const second = (time & 0x1f) * 2;
    const minute = time >> 5 & 0x3f;
    const hour = time >> 11 & 0x1f;
    return DateTime.make(year, Month.vals().get(month), day, hour, minute, second);
  }
}
class YauzlZipFile {
  constructor(reader, centralDirectoryOffset, fileSize, entryCount, comment, autoClose, decodeStrings, validateEntrySizes, strictFileNames) {
    this.reader = reader;
    this.readEntryCursor = centralDirectoryOffset;
    this.fileSize = fileSize;
    this.entryCount = entryCount;
    this.comment = comment;
    this.entriesRead = 0;
    this.autoClose = !!autoClose;
    this.decodeStrings = !!decodeStrings;
    this.validateEntrySizes = !!validateEntrySizes;
    this.strictFileNames = !!strictFileNames;
    this.isOpen = true;
  }
  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.reader.close();
  }
  getEntry() {
    const self = this;
    if (this.entryCount === this.entriesRead) {
      return;
    }
    let buffer = Buffer.allocUnsafe(46);
    yauzl.readAndAssertNoEof(this.reader, buffer, 0, buffer.length, this.readEntryCursor, this.throwErrorAndAutoClose, self);
    const entry = new YauzlEntry();
    const signature = buffer.readUInt32LE(0);
    if (signature !== 0x02014b50) return this.throwErrorAndAutoClose(new Error("invalid central directory file header signature: 0x" + signature.toString(16)));
    entry.versionMadeBy = buffer.readUInt16LE(4);
    entry.versionNeededToExtract = buffer.readUInt16LE(6);
    entry.generalPurposeBitFlag = buffer.readUInt16LE(8);
    entry.compressionMethod = buffer.readUInt16LE(10);
    entry.lastModFileTime = buffer.readUInt16LE(12);
    entry.lastModFileDate = buffer.readUInt16LE(14);
    entry.crc32 = buffer.readUInt32LE(16);
    entry.compressedSize = buffer.readUInt32LE(20);
    entry.uncompressedSize = buffer.readUInt32LE(24);
    entry.fileNameLength = buffer.readUInt16LE(28);
    entry.extraFieldLength = buffer.readUInt16LE(30);
    entry.fileCommentLength = buffer.readUInt16LE(32);
    entry.internalFileAttributes = buffer.readUInt16LE(36);
    entry.externalFileAttributes = buffer.readUInt32LE(38);
    entry.relativeOffsetOfLocalHeader = buffer.readUInt32LE(42);
    if (entry.generalPurposeBitFlag & 0x40) return this.throwErrorAndAutoClose(new Error("strong encryption is not supported"));
    this.readEntryCursor += 46;
    buffer = Buffer.allocUnsafe(entry.fileNameLength + entry.extraFieldLength + entry.fileCommentLength);
    yauzl.readAndAssertNoEof(this.reader, buffer, 0, buffer.length, this.readEntryCursor, this.throwErrorAndAutoClose, self);
    const isUtf8 = (entry.generalPurposeBitFlag & 0x800) !== 0;
    entry.fileName = this.decodeStrings ? yauzl.decodeBuffer(buffer, 0, entry.fileNameLength, isUtf8)
      : buffer.subarray(0, entry.fileNameLength);
    const fileCommentStart = entry.fileNameLength + entry.extraFieldLength;
    const extraFieldBuffer = buffer.subarray(entry.fileNameLength, fileCommentStart);
    entry.extraFields = [];
    let i = 0;
    while (i < extraFieldBuffer.length - 3) {
      const headerId = extraFieldBuffer.readUInt16LE(i + 0);
      const dataSize = extraFieldBuffer.readUInt16LE(i + 2);
      const dataStart = i + 4;
      const dataEnd = dataStart + dataSize;
      if (dataEnd > extraFieldBuffer.length) return this.throwErrorAndAutoClose(new Error("extra field length exceeds extra field buffer size"));
      const dataBuffer = Buffer.allocUnsafe(dataSize);
      extraFieldBuffer.copy(dataBuffer, 0, dataStart, dataEnd);
      entry.extraFields.push({
        id: headerId,
        data: dataBuffer,
      });
      i = dataEnd;
    }
    entry.fileComment = this.decodeStrings ? yauzl.decodeBuffer(buffer, fileCommentStart, fileCommentStart + entry.fileCommentLength, isUtf8)
      : buffer.subarray(fileCommentStart, fileCommentStart + entry.fileCommentLength);
    entry.comment = entry.fileComment;
    this.readEntryCursor += buffer.length;
    this.entriesRead += 1;
    if (entry.uncompressedSize === 0xffffffff ||
      entry.compressedSize === 0xffffffff ||
      entry.relativeOffsetOfLocalHeader === 0xffffffff) {
      let zip64EiefBuffer = null;
      for (i = 0; i < entry.extraFields.length; i++) {
        const extraField = entry.extraFields[i];
        if (extraField.id === 0x0001) {
          zip64EiefBuffer = extraField.data;
          break;
        }
      }
      if (zip64EiefBuffer == null) {
        return this.throwErrorAndAutoClose(new Error("expected zip64 extended information extra field"));
      }
      let index = 0;
      if (entry.uncompressedSize === 0xffffffff) {
        if (index + 8 > zip64EiefBuffer.length) {
          return this.throwErrorAndAutoClose(new Error("zip64 extended information extra field does not include uncompressed size"));
        }
        entry.uncompressedSize = yauzl.readUInt64LE(zip64EiefBuffer, index);
        index += 8;
      }
      if (entry.compressedSize === 0xffffffff) {
        if (index + 8 > zip64EiefBuffer.length) {
          return this.throwErrorAndAutoClose(new Error("zip64 extended information extra field does not include compressed size"));
        }
        entry.compressedSize = yauzl.readUInt64LE(zip64EiefBuffer, index);
        index += 8;
      }
      if (entry.relativeOffsetOfLocalHeader === 0xffffffff) {
        if (index + 8 > zip64EiefBuffer.length) {
          return this.throwErrorAndAutoClose(new Error("zip64 extended information extra field does not include relative header offset"));
        }
        entry.relativeOffsetOfLocalHeader = yauzl.readUInt64LE(zip64EiefBuffer, index);
        index += 8;
      }
    }
    if (this.decodeStrings) {
      for (i = 0; i < entry.extraFields.length; i++) {
        const extraField = entry.extraFields[i];
        if (extraField.id === 0x7075) {
          if (extraField.data.length < 6) {
            continue;
          }
          if (extraField.data.readUInt8(0) !== 1) {
            continue;
          }
          const oldNameCrc32 = extraField.data.readUInt32LE(1);
          if (crc32.unsigned(buffer.subarray(0, entry.fileNameLength)) !== oldNameCrc32) {
            continue;
          }
          entry.fileName = yauzl.decodeBuffer(extraField.data, 5, extraField.data.length, true);
          break;
        }
      }
    }
    if (this.validateEntrySizes && entry.compressionMethod === 0) {
      let expectedCompressedSize = entry.uncompressedSize;
      if (entry.isEncrypted()) {
        expectedCompressedSize += 12;
      }
      if (entry.compressedSize !== expectedCompressedSize) {
        const msg = "compressed/uncompressed size mismatch for stored file: " + entry.compressedSize + " != " + entry.uncompressedSize;
        return this.throwErrorAndAutoClose(new Error(msg));
      }
    }
    if (this.decodeStrings) {
      if (!this.strictFileNames) {
        entry.fileName = entry.fileName.replace(/\\/g, "/");
      }
      const errorMessage = this.validateFileName(entry.fileName);
      if (errorMessage != null) return this.throwErrorAndAutoClose(new Error(errorMessage));
    }
    return entry;
  }
  getEntryFromStream() {
    let buffer = Buffer.alloc(30);
    if (yauzl.readAndAssertNoEof(this.reader, buffer, 0, buffer.length, 0, (err) => { return !!err; }))
      return null;
    while(buffer.readUInt32LE(0) !== 0x04034b50) {
      let i = 0;
      for(; i < buffer.length-3; i++) {
        if (buffer.readUInt32LE(i) === 0x04034b50) break;
        if (buffer.readUInt32LE(i) === 0x02014b50) return null;
      }
      buffer.copyWithin(0, i);
      if (yauzl.readAndAssertNoEof(this.reader, buffer, i, buffer.length - i, 0, (err) => { return !!err; }))
        return null;
    }
    const entry = new YauzlEntry();
    entry.versionNeededToExtract = buffer.readUInt16LE(4);
    entry.generalPurposeBitFlag = buffer.readUInt16LE(6);
    entry.compressionMethod = buffer.readUInt16LE(8);
    entry.lastModFileTime = buffer.readUInt16LE(10);
    entry.lastModFileDate = buffer.readUInt16LE(12);
    entry.crc32 = buffer.readUInt32LE(14);
    entry.compressedSize = buffer.readUInt32LE(18);
    entry.uncompressedSize = buffer.readUInt32LE(22);
    entry.fileNameLength = buffer.readUInt16LE(26);
    entry.extraFieldLength = buffer.readUInt16LE(28);
    if (entry.generalPurposeBitFlag & 0x40) throw new Error("strong encryption is not supported");
    buffer = Buffer.allocUnsafe(entry.fileNameLength + entry.extraFieldLength);
    if (yauzl.readAndAssertNoEof(this.reader, buffer, 0, buffer.length, this.readEntryCursor, (err) => { return !!err }))
      return null;
    const isUtf8 = (entry.generalPurposeBitFlag & 0x800) !== 0;
    entry.fileName = this.decodeStrings ? yauzl.decodeBuffer(buffer, 0, entry.fileNameLength, isUtf8)
      : buffer.subarray(0, entry.fileNameLength);
    const extraFieldBuffer = buffer.subarray(entry.fileNameLength);
    entry.extraFields = [];
    let i = 0;
    while (i < extraFieldBuffer.length - 3) {
      const headerId = extraFieldBuffer.readUInt16LE(i + 0);
      const dataSize = extraFieldBuffer.readUInt16LE(i + 2);
      const dataStart = i + 4;
      const dataEnd = dataStart + dataSize;
      if (dataEnd > extraFieldBuffer.length) throw new Error("extra field length exceeds extra field buffer size");
      const dataBuffer = Buffer.allocUnsafe(dataSize);
      extraFieldBuffer.copy(dataBuffer, 0, dataStart, dataEnd);
      entry.extraFields.push({
        id: headerId,
        data: dataBuffer,
      });
      i = dataEnd;
    }
    if (entry.uncompressedSize === 0xffffffff ||
        entry.compressedSize === 0xffffffff) {
      let zip64EiefBuffer = null;
      for (i = 0; i < entry.extraFields.length; i++) {
        const extraField = entry.extraFields[i];
        if (extraField.id === 0x0001) {
          zip64EiefBuffer = extraField.data;
          break;
        }
      }
      if (zip64EiefBuffer == null) {
        throw new Error("expected zip64 extended information extra field");
      }
      let index = 0;
      if (entry.uncompressedSize === 0xffffffff) {
        if (index + 8 > zip64EiefBuffer.length) {
          throw new Error("zip64 extended information extra field does not include uncompressed size");
        }
        entry.uncompressedSize = yauzl.readUInt64LE(zip64EiefBuffer, index);
        index += 8;
      }
      if (entry.compressedSize === 0xffffffff) {
        if (index + 8 > zip64EiefBuffer.length) {
          throw new Error("zip64 extended information extra field does not include compressed size");
        }
        entry.compressedSize = yauzl.readUInt64LE(zip64EiefBuffer, index);
        index += 8;
      }
    }
    if (this.decodeStrings) {
      for (i = 0; i < entry.extraFields.length; i++) {
        const extraField = entry.extraFields[i];
        if (extraField.id === 0x7075) {
          if (extraField.data.length < 6) {
            continue;
          }
          if (extraField.data.readUInt8(0) !== 1) {
            continue;
          }
          const oldNameCrc32 = extraField.data.readUInt32LE(1);
          if (crc32.unsigned(buffer.subarray(0, entry.fileNameLength)) !== oldNameCrc32) {
            continue;
          }
          entry.fileName = yauzl.decodeBuffer(extraField.data, 5, extraField.data.length, true);
          break;
        }
      }
    }
    if (this.validateEntrySizes && entry.compressionMethod === 0) {
      let expectedCompressedSize = entry.uncompressedSize;
      if (entry.isEncrypted()) {
        expectedCompressedSize += 12;
      }
      if (entry.compressedSize !== expectedCompressedSize) {
        const msg = "compressed/uncompressed size mismatch for stored file: " + entry.compressedSize + " != " + entry.uncompressedSize;
        throw new Error(msg);
      }
    }
    if (this.decodeStrings) {
      if (!this.strictFileNames) {
        entry.fileName = entry.fileName.replace(/\\/g, "/");
      }
      const errorMessage = this.validateFileName(entry.fileName);
      if (errorMessage != null) throw new Error(errorMessage);
    }
    return entry;
  }
  getInStream(entry, options, bufferSize) {
    let relativeStart = 0;
    let relativeEnd = entry.compressedSize;
    if (options.decrypt != null) {
      if (!entry.isEncrypted()) {
        throw new Error("options.decrypt can only be specified for encrypted entries");
      }
      if (options.decrypt !== false) throw new Error("invalid options.decrypt value: " + options.decrypt);
      if (entry.isCompressed()) {
        if (options.decompress !== false) throw new Error("entry is encrypted and compressed, and options.decompress !== false");
      }
    }
    if (options.decompress != null) {
      if (!entry.isCompressed()) {
        throw new Error("options.decompress can only be specified for compressed entries");
      }
      if (!(options.decompress === false || options.decompress === true)) {
        throw new Error("invalid options.decompress value: " + options.decompress);
      }
    }
    if (options.start != null || options.end != null) {
      if (entry.isCompressed() && options.decompress !== false) {
        throw new Error("start/end range not allowed for compressed entry without options.decompress === false");
      }
      if (entry.isEncrypted() && options.decrypt !== false) {
        throw new Error("start/end range not allowed for encrypted entry without options.decrypt === false");
      }
    }
    if (options.start != null) {
      relativeStart = options.start;
      if (relativeStart < 0) throw new Error("options.start < 0");
      if (relativeStart > entry.compressedSize) throw new Error("options.start > entry.compressedSize");
    }
    if (options.end != null) {
      relativeEnd = options.end;
      if (relativeEnd < 0) throw new Error("options.end < 0");
      if (relativeEnd > entry.compressedSize) throw new Error("options.end > entry.compressedSize");
      if (relativeEnd < relativeStart) throw new Error("options.end < options.start");
    }
    if (!this.isOpen) throw new Error("closed");
    if (entry.isEncrypted()) {
      if (options.decrypt !== false) throw new Error("entry is encrypted, and options.decrypt !== false");
    }
    const buffer = Buffer.allocUnsafe(30);
    yauzl.readAndAssertNoEof(this.reader, buffer, 0, buffer.length, entry.relativeOffsetOfLocalHeader);
    const signature = buffer.readUInt32LE(0);
    if (signature !== 0x04034b50) {
      throw new Error("invalid local file header signature: 0x" + signature.toString(16));
    }
    const fileNameLength = buffer.readUInt16LE(26);
    const extraFieldLength = buffer.readUInt16LE(28);
    const localFileHeaderEnd = entry.relativeOffsetOfLocalHeader + buffer.length + fileNameLength + extraFieldLength;
    let decompress;
    if (entry.compressionMethod === 0) {
      decompress = false;
    } else if (entry.compressionMethod === 8) {
      decompress = options.decompress != null ? options.decompress : true;
    } else {
      throw new Error("unsupported compression method: " + entry.compressionMethod);
    }
    const fileDataStart = localFileHeaderEnd;
    const fileDataEnd = fileDataStart + entry.compressedSize;
    if (entry.compressedSize !== 0) {
      if (fileDataEnd > this.fileSize) {
        throw new Error("file data overflows file bounds: " +
          fileDataStart + " + " + entry.compressedSize + " > " + this.fileSize);
      }
    }
    const base = new ZipInStream(this.reader, fileDataStart, entry.compressedSize, bufferSize);
    if (decompress)
      return new InflateInStream(base, node.zlib.inflateRawSync, bufferSize);
    else
      return base;
  }
  getInStreamFromStream(entry, options, bufferSize) {
    let decompress;
    if (entry.compressionMethod === 0) {
      decompress = false;
    } else if (entry.compressionMethod === 8) {
      decompress = options.decompress != null ? options.decompress : true;
    } else {
      throw new Error("unsupported compression method: " + entry.compressionMethod);
    }
    let size = entry.compressedSize;
    if (entry.generalPurposeBitFlag & 0x8)
      size = Infinity;
    const base = new ZipInStream(this.reader, 0, size, bufferSize, entry);
    if (decompress)
      return new InflateInStream(base, node.zlib.inflateRawSync, bufferSize);
    else
      return base;
  }
  throwErrorAndAutoClose(err) {
    if (this.autoClose) this.close();
    throw err;
  }
  validateFileName(fileName) {
    if (fileName.indexOf("\\") !== -1) {
      return "invalid characters in fileName: " + fileName;
    }
    if (/^[a-zA-Z]:/.test(fileName) || /^(\/)/.test(fileName)) {
      return "absolute path: " + fileName;
    }
    if (fileName.split("/").indexOf("..") !== -1) {
      return "invalid relative path: " + fileName;
    }
    return null;
  }
}
class YauzlEntry {
  versionMadeBy;
  versionNeededToExtract;
  generalPurposeBitFlag;
  compressionMethod;
  lastModFileTime;
  lastModFileDate;
  crc32;
  compressedSize;
  uncompressedSize;
  fileNameLength;
  extraFieldLength;
  fileCommentLength;
  internalFileAttributes;
  externalFileAttributes;
  relativeOffsetOfLocalHeader;
  fileName;
  extraFields;
  fileComment;
  foundDataDescriptor = false;
  isEncrypted() {
    return (this.generalPurposeBitFlag & 0x1) !== 0;
  }
  isCompressed() {
    return this.compressionMethod === 8;
  }
}
class YauzlFileReader {
  constructor(fd) {
    this.#fd = fd;
  }
  #fd;
  posMatters = true;
  read(buffer, offset, length, position) {
    return node.fs.readSync(this.#fd, buffer, offset, length, position);
  }
  unreadBuf() {}
  close() {
    node.fs.closeSync(this.#fd);
  }
}
class YauzlStreamReader {
  constructor(in$) {
    this.#in = in$;
  }
  #in;
  #pre;
  posMatters = false;
  read(buffer, offset, length) {
    let c1 = 0;
    if (this.#pre) {
      c1 = this.#pre.copy(buffer, offset, 0, Math.min(this.#pre.length, length));
      offset += c1;
      length -= c1;
      if (c1 == this.#pre.length)
        this.#pre = undefined;
      else
        this.#pre = this.#pre.subarray(c1);
    }
    let c2 = 0;
    if (length > 0) {
      const fanBuf = MemBuf.makeCapacity(length);
      c2 = this.#in.readBuf(fanBuf, length) || 0;
      Buffer.from(fanBuf.__unsafeArray()).copy(buffer, offset);
    }
    return c1 + c2;
  }
  unreadBuf(buf) {
    this.#pre = buf;
  }
  close() {}
}
const ZIP64_END_OF_CENTRAL_DIRECTORY_RECORD_SIZE = 56;
const ZIP64_END_OF_CENTRAL_DIRECTORY_LOCATOR_SIZE = 20;
const END_OF_CENTRAL_DIRECTORY_RECORD_SIZE = 22;
const LOCAL_FILE_HEADER_FIXED_SIZE = 30;
const VERSION_NEEDED_TO_EXTRACT_UTF8 = 20;
const VERSION_NEEDED_TO_EXTRACT_ZIP64 = 45;
const VERSION_MADE_BY = (3 << 8) | 63;
const FILE_NAME_IS_UTF8 = 1 << 11;
const UNKNOWN_CRC32_AND_FILE_SIZES = 1 << 3;
const DATA_DESCRIPTOR_SIZE = 16;
const ZIP64_DATA_DESCRIPTOR_SIZE = 24;
const CENTRAL_DIRECTORY_RECORD_FIXED_SIZE = 46;
const ZIP64_EXTENDED_INFORMATION_EXTRA_FIELD_SIZE = 28;
const EMPTY_BUFFER = (typeof Buffer !== 'undefined') ? Buffer.allocUnsafe(0) : new Array();
class yazl {
  static validateMetadataPath(metadataPath) {
    if (metadataPath === "") throw new Error("empty metadataPath");
    metadataPath = metadataPath.replace(/\\/g, "/");
    if (/^[a-zA-Z]:/.test(metadataPath) || /^(\/)/.test(metadataPath)) throw new Error("absolute path: " + metadataPath);
    if (metadataPath.split("/").indexOf("..") !== -1) throw new Error("invalid relative path: " + metadataPath);
    return metadataPath;
  }
  static writeUInt64LE(buffer, n, offset) {
    const high = Math.floor(n / 0x100000000);
    const low = n % 0x100000000;
    buffer.writeUInt32LE(low, offset);
    buffer.writeUInt32LE(high, offset + 4);
  }
  static dateToDosDateTime(jsDate) {
    let date = 0;
    date |= jsDate.getDate() & 0x1f;
    date |= ((jsDate.getMonth() + 1) & 0xf) << 5;
    date |= ((jsDate.getFullYear() - 1980) & 0x7f) << 9;
    let time = 0;
    time |= Math.floor(jsDate.getSeconds() / 2);
    time |= (jsDate.getMinutes() & 0x3f) << 5;
    time |= (jsDate.getHours() & 0x1f) << 11;
    return {date: date, time: time};
  }
  static #cp437 = '\u0000☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ';
  static #reverseCp437;
  static encodeCp437(string) {
    throw "TODO:encodeCp437(string)";
  }
}
class YazlZipFile {
  constructor(out) {
    this.out = out;
    this.entries = [];
    this.outputStreamCursor = 0;
    this.ended = false;
    this.forceZip64Eocd = false;
  }
  #lastOut;
  addEntryAt(metadataPath, options) {
    metadataPath = yazl.validateMetadataPath(metadataPath);
    if (options == null) options = {};
    const entry = new YazlEntry(metadataPath, options);
    this.entries.push(entry);
    if (this.#lastOut) {
      this.#lastOut.close();
      const lastEntry = this.entries[this.entries.length-2];
      this.#writeToOutputStream(lastEntry.getDataDescriptor());
    }
    entry.relativeOffsetOfLocalHeader = this.outputStreamCursor;
    this.#writeToOutputStream(entry.getLocalFileHeader());
    if (entry.compress)
      this.#lastOut = new DeflateOutStream(this.out, node.zlib.deflateRawSync, options.level, this, entry);
    else
      this.#lastOut = new ZipOutStream(this, entry);
    return this.#lastOut;
  }
  #eocdrSignatureBuffer = Buffer.from([0x50, 0x4b, 0x05, 0x06]);
  end(options) {
    if (!options) options = {};
    if (this.ended) return;
    this.ended = true;
    if (this.#lastOut) {
      this.#lastOut.close();
      const lastEntry = this.entries[this.entries.length-1];
      this.#writeToOutputStream(lastEntry.getDataDescriptor());
    }
    this.forceZip64Eocd = !!options.forceZip64Format;
    this.comment = EMPTY_BUFFER;
    this.#writeEocd();
  }
  #writeToOutputStream(buf) {
    this.out.writeBuf(MemBuf.__makeBytes(buf));
    this.outputStreamCursor += buf.length;
  }
  #writeEocd() {
    this.offsetOfStartOfCentralDirectory = this.outputStreamCursor;
    for(let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];
      this.#writeToOutputStream(entry.getCentralDirectoryRecord());
    }
    this.#writeToOutputStream(this.#getEndOfCentralDirectoryRecord());
    this.out.close();
  }
  #getEndOfCentralDirectoryRecord(actuallyJustTellMeHowLongItWouldBe) {
    let needZip64Format = false;
    let normalEntriesLength = this.entries.length;
    if (this.forceZip64Eocd || this.entries.length >= 0xffff) {
      normalEntriesLength = 0xffff;
      needZip64Format = true;
    }
    const sizeOfCentralDirectory = this.outputStreamCursor - this.offsetOfStartOfCentralDirectory;
    let normalSizeOfCentralDirectory = sizeOfCentralDirectory;
    if (this.forceZip64Eocd || sizeOfCentralDirectory >= 0xffffffff) {
      normalSizeOfCentralDirectory = 0xffffffff;
      needZip64Format = true;
    }
    let normalOffsetOfStartOfCentralDirectory = this.offsetOfStartOfCentralDirectory;
    if (this.forceZip64Eocd || this.offsetOfStartOfCentralDirectory >= 0xffffffff) {
      normalOffsetOfStartOfCentralDirectory = 0xffffffff;
      needZip64Format = true;
    }
    if (actuallyJustTellMeHowLongItWouldBe) {
      if (needZip64Format) {
        return (
          ZIP64_END_OF_CENTRAL_DIRECTORY_RECORD_SIZE +
          ZIP64_END_OF_CENTRAL_DIRECTORY_LOCATOR_SIZE +
          END_OF_CENTRAL_DIRECTORY_RECORD_SIZE
        );
      } else {
        return END_OF_CENTRAL_DIRECTORY_RECORD_SIZE;
      }
    }
    const eocdrBuffer = Buffer.allocUnsafe(END_OF_CENTRAL_DIRECTORY_RECORD_SIZE + this.comment.length);
    eocdrBuffer.writeUInt32LE(0x06054b50, 0);
    eocdrBuffer.writeUInt16LE(0, 4);
    eocdrBuffer.writeUInt16LE(0, 6);
    eocdrBuffer.writeUInt16LE(normalEntriesLength, 8);
    eocdrBuffer.writeUInt16LE(normalEntriesLength, 10);
    eocdrBuffer.writeUInt32LE(normalSizeOfCentralDirectory, 12);
    eocdrBuffer.writeUInt32LE(normalOffsetOfStartOfCentralDirectory, 16);
    eocdrBuffer.writeUInt16LE(this.comment.length, 20);
    this.comment.copy(eocdrBuffer, 22);
    if (!needZip64Format) return eocdrBuffer;
    const zip64EocdrBuffer = Buffer.allocUnsafe(ZIP64_END_OF_CENTRAL_DIRECTORY_RECORD_SIZE);
    zip64EocdrBuffer.writeUInt32LE(0x06064b50, 0);
    yazl.writeUInt64LE(zip64EocdrBuffer, ZIP64_END_OF_CENTRAL_DIRECTORY_RECORD_SIZE - 12, 4);
    zip64EocdrBuffer.writeUInt16LE(VERSION_MADE_BY, 12);
    zip64EocdrBuffer.writeUInt16LE(VERSION_NEEDED_TO_EXTRACT_ZIP64, 14);
    zip64EocdrBuffer.writeUInt32LE(0, 16);
    zip64EocdrBuffer.writeUInt32LE(0, 20);
    yazl.writeUInt64LE(zip64EocdrBuffer, this.entries.length, 24);
    yazl.writeUInt64LE(zip64EocdrBuffer, this.entries.length, 32);
    yazl.writeUInt64LE(zip64EocdrBuffer, sizeOfCentralDirectory, 40);
    yazl.writeUInt64LE(zip64EocdrBuffer, this.offsetOfStartOfCentralDirectory, 48);
    const zip64EocdlBuffer = Buffer.allocUnsafe(ZIP64_END_OF_CENTRAL_DIRECTORY_LOCATOR_SIZE);
    zip64EocdlBuffer.writeUInt32LE(0x07064b50, 0);
    zip64EocdlBuffer.writeUInt32LE(0, 4);
    yazl.writeUInt64LE(zip64EocdlBuffer, this.outputStreamCursor, 8);
    zip64EocdlBuffer.writeUInt32LE(1, 16);
    return Buffer.concat([
      zip64EocdrBuffer,
      zip64EocdlBuffer,
      eocdrBuffer,
    ]);
  }
}
class YazlEntry {
  constructor(metadataPath, options) {
    this.utf8FileName = Buffer.from(metadataPath);
    if (this.utf8FileName.length > 0xffff)
      throw new Error("utf8 file name too long. " + this.utf8FileName.length + " > " + 0xffff);
    this.isDirectory = metadataPath.endsWith("/");
    this.setLastModDate(options.mtime);
    if (options.mode != null) {
      this.setFileAttributesMode(options.mode);
    } else {
      this.setFileAttributesMode(this.isDirectory ? 0o40775 : 0o100664);
    }
    if (options.uncompressedSize != null &&
        options.compressedSize != null &&
        options.crc32 != null) {
      this.crcAndFileSizeKnown = true;
      this.crc32 = options.crc32;
      this.uncompressedSize = options.uncompressedSize;
      this.compressedSize = options.compressedSize;
    } else {
      this.crcAndFileSizeKnown = false;
      this.crc32 = null;
      this.uncompressedSize = null;
      this.compressedSize = null;
      if (options.uncompressedSize != null) this.uncompressedSize = options.uncompressedSize;
    }
    this.compress = options.compress != null ? !!options.compress : !this.isDirectory;
    this.forceZip64Format = !!options.forceZip64Format;
    if (options.fileComment) {
      if (typeof options.fileComment === "string") {
        this.fileComment = Buffer.from(options.fileComment, "utf-8");
      } else {
        this.fileComment = options.fileComment;
      }
      if (this.fileComment.length > 0xffff) throw new Error("fileComment is too large");
    } else {
      this.fileComment = EMPTY_BUFFER;
    }
    if (options.extra && options.extra.length > 0xffffffff)
      throw new Error("extra field data is too large");
    this.extra = options.extra || EMPTY_BUFFER;
  }
  setLastModDate(date) {
    const dosDateTime = yazl.dateToDosDateTime(date);
    this.lastModFileTime = dosDateTime.time;
    this.lastModFileDate = dosDateTime.date;
  }
  setFileAttributesMode(mode) {
    if ((mode & 0xffff) !== mode) throw new Error("invalid mode. expected: 0 <= " + mode + " <= " + 0xffff);
    this.externalFileAttributes = (mode << 16) >>> 0;
  }
  useZip64Format() {
    return (
      (this.forceZip64Format) ||
      (this.uncompressedSize != null && this.uncompressedSize > 0xfffffffe) ||
      (this.compressedSize != null && this.compressedSize > 0xfffffffe) ||
      (this.relativeOffsetOfLocalHeader != null && this.relativeOffsetOfLocalHeader > 0xfffffffe)
    );
  }
  getLocalFileHeader() {
    let crc32 = 0;
    let compressedSize = 0;
    let uncompressedSize = 0;
    if (this.crcAndFileSizeKnown) {
      crc32 = this.crc32;
      compressedSize = this.compressedSize;
      uncompressedSize = this.uncompressedSize;
    }
    const fixedSizeStuff = Buffer.allocUnsafe(LOCAL_FILE_HEADER_FIXED_SIZE);
    let generalPurposeBitFlag = FILE_NAME_IS_UTF8;
    if (!this.crcAndFileSizeKnown) generalPurposeBitFlag |= UNKNOWN_CRC32_AND_FILE_SIZES;
    fixedSizeStuff.writeUInt32LE(0x04034b50, 0);
    fixedSizeStuff.writeUInt16LE(VERSION_NEEDED_TO_EXTRACT_UTF8, 4);
    fixedSizeStuff.writeUInt16LE(generalPurposeBitFlag, 6);
    fixedSizeStuff.writeUInt16LE(this.getCompressionMethod(), 8);
    fixedSizeStuff.writeUInt16LE(this.lastModFileTime, 10);
    fixedSizeStuff.writeUInt16LE(this.lastModFileDate, 12);
    fixedSizeStuff.writeUInt32LE(crc32, 14);
    fixedSizeStuff.writeUInt32LE(compressedSize, 18);
    fixedSizeStuff.writeUInt32LE(uncompressedSize, 22);
    fixedSizeStuff.writeUInt16LE(this.utf8FileName.length, 26);
    fixedSizeStuff.writeUInt16LE(this.extra.length, 28);
    return Buffer.concat([
      fixedSizeStuff,
      this.utf8FileName,
      this.extra
    ]);
  }
  getDataDescriptor() {
    if (this.crcAndFileSizeKnown) {
      return EMPTY_BUFFER;
    }
    if (!this.useZip64Format()) {
      const buffer = Buffer.allocUnsafe(DATA_DESCRIPTOR_SIZE);
      buffer.writeUInt32LE(0x08074b50, 0);
      buffer.writeUInt32LE(this.crc32, 4);
      buffer.writeUInt32LE(this.compressedSize, 8);
      buffer.writeUInt32LE(this.uncompressedSize, 12);
      return buffer;
    } else {
      const buffer = Buffer.allocUnsafe(ZIP64_DATA_DESCRIPTOR_SIZE);
      buffer.writeUInt32LE(0x08074b50, 0);
      buffer.writeUInt32LE(this.crc32, 4);
      yazl.writeUInt64LE(buffer, this.compressedSize, 8);
      yazl.writeUInt64LE(buffer, this.uncompressedSize, 16);
      return buffer;
    }
  }
  getCentralDirectoryRecord() {
    const fixedSizeStuff = Buffer.allocUnsafe(CENTRAL_DIRECTORY_RECORD_FIXED_SIZE);
    let generalPurposeBitFlag = FILE_NAME_IS_UTF8;
    if (!this.crcAndFileSizeKnown) generalPurposeBitFlag |= UNKNOWN_CRC32_AND_FILE_SIZES;
    let normalCompressedSize = this.compressedSize;
    let normalUncompressedSize = this.uncompressedSize;
    let normalRelativeOffsetOfLocalHeader = this.relativeOffsetOfLocalHeader;
    let versionNeededToExtract;
    let zeiefBuffer;
    if (this.useZip64Format()) {
      normalCompressedSize = 0xffffffff;
      normalUncompressedSize = 0xffffffff;
      normalRelativeOffsetOfLocalHeader = 0xffffffff;
      versionNeededToExtract = VERSION_NEEDED_TO_EXTRACT_ZIP64;
      zeiefBuffer = Buffer.allocUnsafe(ZIP64_EXTENDED_INFORMATION_EXTRA_FIELD_SIZE);
      zeiefBuffer.writeUInt16LE(0x0001, 0);
      zeiefBuffer.writeUInt16LE(ZIP64_EXTENDED_INFORMATION_EXTRA_FIELD_SIZE - 4, 2);
      yazl.writeUInt64LE(zeiefBuffer, this.uncompressedSize, 4);
      yazl.writeUInt64LE(zeiefBuffer, this.compressedSize, 12);
      yazl.writeUInt64LE(zeiefBuffer, this.relativeOffsetOfLocalHeader, 20);
    } else {
      versionNeededToExtract = VERSION_NEEDED_TO_EXTRACT_UTF8;
      zeiefBuffer = EMPTY_BUFFER;
    }
    fixedSizeStuff.writeUInt32LE(0x02014b50, 0);
    fixedSizeStuff.writeUInt16LE(VERSION_MADE_BY, 4);
    fixedSizeStuff.writeUInt16LE(versionNeededToExtract, 6);
    fixedSizeStuff.writeUInt16LE(generalPurposeBitFlag, 8);
    fixedSizeStuff.writeUInt16LE(this.getCompressionMethod(), 10);
    fixedSizeStuff.writeUInt16LE(this.lastModFileTime, 12);
    fixedSizeStuff.writeUInt16LE(this.lastModFileDate, 14);
    fixedSizeStuff.writeUInt32LE(this.crc32, 16);
    fixedSizeStuff.writeUInt32LE(normalCompressedSize, 20);
    fixedSizeStuff.writeUInt32LE(normalUncompressedSize, 24);
    fixedSizeStuff.writeUInt16LE(this.utf8FileName.length, 28);
    fixedSizeStuff.writeUInt16LE(zeiefBuffer.length + this.extra.length, 30);
    fixedSizeStuff.writeUInt16LE(this.fileComment.length, 32);
    fixedSizeStuff.writeUInt16LE(0, 34);
    fixedSizeStuff.writeUInt16LE(0, 36);
    fixedSizeStuff.writeUInt32LE(this.externalFileAttributes, 38);
    fixedSizeStuff.writeUInt32LE(normalRelativeOffsetOfLocalHeader, 42);
    return Buffer.concat([
      fixedSizeStuff,
      this.utf8FileName,
      zeiefBuffer,
      this.extra,
      this.fileComment
    ]);
  }
  getCompressionMethod() {
    const NO_COMPRESSION = 0;
    const DEFLATE_COMPRESSION = 8;
    return this.compress ? DEFLATE_COMPRESSION : NO_COMPRESSION;
  }
}
class ZipInStream extends InStream {
  constructor(reader, pos, len, bufferSize, entry) {
    super(null);
    this.#reader = reader;
    this.#pos = pos || 0;
    this.#start = this.#pos;
    this.#max = this.#pos + len;
    this.#buf = Buffer.allocUnsafe(bufferSize || 64);
    this.#entry = entry;
  }
  #reader;
  #start;
  #pos;
  #max;
  #isClosed = false;
  #pre = [];
  #buf;
  #bufPos = 0;
  #availInBuf = 0;
  #entry;
  #nextBuf;
  #availInNextBuf = 0;
  #readInto(buf) {
    if (this.#max === Infinity) {
      if (!this.#nextBuf) {
        this.#nextBuf = Buffer.allocUnsafe(this.#buf.length);
        this.#availInNextBuf = this.#reader.read(this.#nextBuf, 0, this.#buf.length, this.#pos);
        this.#pos += this.#availInNextBuf;
      }
      const r1 = this.#availInNextBuf;
      this.#nextBuf.copy(buf, 0, 0, r1);
      this.#availInNextBuf = this.#reader.read(this.#nextBuf, 0, this.#buf.length, this.#pos);
      const totalBuf = Buffer.concat([buf.subarray(0, r1), this.#nextBuf.subarray(0, Math.min(23, this.#availInNextBuf))]);
      for(let i = 0; i < totalBuf.length - 23; i++) {
        if (totalBuf.readUInt32LE(i) === 0x08074b50) {
          const compressedNormal = totalBuf.readUInt32LE(i+8);
          const compressed64 = yauzl.readUInt64LE(totalBuf, i+8);
          const compressedActual = this.#pos - r1 + i - this.#start;
          if (compressedActual != compressedNormal && compressedActual != compressed64)
            break;
          this.#max = this.#pos - r1 + i;
          this.#pos = this.#max;
          const useZip64 = compressedActual === compressed64;
          if (this.#entry) {
            this.#entry.crc32 = totalBuf.readUInt32LE(i+4);
            if (useZip64) {
              this.#entry.compressedSize = compressed64;
              this.#entry.uncompressedSize = yauzl.readUInt64LE(totalBuf, i+16);
            }
            else {
              this.#entry.compressedSize = compressedNormal;
              this.#entry.uncompressedSize = totalBuf.readUInt32LE(i+12);
            }
            this.#entry.foundDataDescriptor = true;
          }
          this.#reader.unreadBuf(Buffer.concat([buf.subarray(useZip64 ? i+24 : i+16), this.#nextBuf.subarray(0, this.#availInNextBuf)]));
          return i;
        }
      }
      this.#pos += this.#availInNextBuf;
      return r1;
    }
    const r = this.#reader.read(buf, 0, Math.min(this.#buf.length, this.remaining()), this.#pos);
    this.#pos += r;
    return r;
  }
  #load() {
    if (this.#bufPos >= this.#availInBuf) {
      this.#bufPos = 0;
      this.#availInBuf = this.#readInto(this.#buf);
    }
  }
  read() {
    if (this.#isClosed) throw IOErr.make("Cannot read from closed stream");
    this.#load();
    if (this.avail() == 0) return null;
    if (this.#pre.length > 0) return this.#pre.pop();
    const r = this.#buf.readUInt8(this.#bufPos);
    this.#bufPos++;
    return r;
  }
  readBuf(buf, n) {
    const out = buf.out();
    let read = 0;
    let r;
    while (n > 0) {
      r = this.read();
      if (r === null) break;
      out.write(r);
      n--;
      read++;
    }
    out.close();
    return read == 0 ? null : read;
  }
  unread(n) {
    this.#pre.push(n);
    return this;
  }
  skip(n, override) {
    if (this.#isClosed && !override) throw IOErr.make("Cannot skip in closed stream");
    let skipped = 0;
    if (this.#pre.length > 0) {
      const len = Math.min(this.#pre.length, n);
      this.#pre = this.#pre.slice(0, -len);
      skipped += len;
    }
    if (this.#reader.posMatters && this.#max !== Infinity) {
      const s = Math.min(this.remaining() - skipped, Math.max(0, n - skipped - this.avail()));
      this.#pos += s;
      skipped += s;
    }
    if (skipped == n || this.#pos == this.#max) return skipped;
    if (this.avail() === 0) this.#load();
    while (true) {
      const a = this.avail();
      if (a === 0 || skipped == n) break;
      const rem = Math.min(n - skipped, this.remaining());
      if (rem < a) {
        skipped += rem;
        this.#bufPos += rem;
        break;
      }
      skipped += a;
      this.#load();
    }
    return skipped;
  }
  close() {
    this.#isClosed = true;
  }
  avail() {
    return this.#pre.length + (this.#availInBuf - this.#bufPos);
  }
  remaining() {
    return this.#max - this.#pos;
  }
}
class InflateInStream extends InStream {
  constructor(in$, method, bufferSize) {
    super(in$);
    this.#in = in$;
    this.#method = method;
    this.#bufSize = bufferSize;
  }
  static makeInflate(in$, opts=null) {
    const instance = new InflateInStream(in$, node.zlib.inflateSync, 4096);
    if (opts) {
      if (opts.get("nowrap") === true)
        instance.#method = node.zlib.inflateRawSync;
    }
    return instance;
  }
  static makeGunzip(in$) {
    return new InflateInStream(in$, node.zlib.gunzipSync, 4096);
  }
  #in;
  #method;
  #bufSize;
  #pre = [];
  #buf = EMPTY_BUFFER;
  #bufPos = 0;
  #load() {
    const rawBuf = MemBuf.makeCapacity(this.#bufSize);
    const rawBufLen = this.#in.readBuf(rawBuf, this.#bufSize);
    this.#bufPos = 0;
    if (rawBufLen == null) {
      this.#buf = EMPTY_BUFFER;
      return;
    }
    this.#buf = this.#method(rawBuf.__getBytes(0, rawBufLen), {
      chunkSize: this.#bufSize
    });
  }
  read() {
    if (this.avail() == 0)
      this.#load();
    if (this.#buf.length === 0)
      return null;
    return this.#buf.readUInt8(this.#bufPos++);
  }
  readBuf(buf, n) {
    const out = buf.out();
    let read = 0;
    let r;
    while (n > 0) {
      r = this.read();
      if (r === null) break;
      out.write(r);
      n--;
      read++;
    }
    out.close();
    return read == 0 ? null : read;
  }
  unread(n) {
    this.#pre.push(n);
    return this;
  }
  skip(n, skipCompressed) {
    if (skipCompressed)
      return this.#in.skip(n, true);
    let skipped = 0;
    if (this.#pre.length > 0) {
      const len = Math.min(this.#pre.length, n);
      this.#pre = this.#pre.slice(0, -len);
      skipped += len;
    }
    if (skipped == n) return skipped;
    if (this.avail() === 0) this.#load();
    while (true) {
      const a = this.avail();
      if (a === 0 || skipped == n) break;
      const rem = n - skipped;
      if (rem < a) {
        skipped += rem;
        this.#bufPos += rem;
        break;
      }
      skipped += a;
      this.#load();
    }
    return skipped;
  }
  avail() {
    return this.#buf.length - this.#bufPos;
  }
  remaining() {
    return this.#in.remaining();
  }
}
class ZipOutStream extends OutStream {
  constructor(yazlZip, entry) {
    super(yazlZip.out);
    this.#yazlZip = yazlZip;
    this.#entry = entry;
  }
  #yazlZip;
  #entry;
  #isClosed = false;
  close() {
    this.#isClosed = true;
    return true;
  }
  write(b) {
    if (this.#isClosed)
      throw IOErr.make("stream is closed");
    this.#yazlZip.outputStreamCursor++;
    if (!this.#entry.crcAndFileSizeKnown) {
      this.#entry.crc32 = crc32.unsigned(b, this.#entry.crc32);
      this.#entry.uncompressedSize++;
      this.#entry.compressedSize++;
    }
    this.#yazlZip.out.write(b);
    return this;
  }
  writeBuf(buf, n=buf.remaining()) {
    if (this.#isClosed)
      throw IOErr.make("stream is closed");
    if (buf.remaining() < n)
      throw IOErr.make("not enough bytes in buf");
    this.#yazlZip.outputStreamCursor += n;
    if (!this.#entry.crcAndFileSizeKnown) {
      this.#entry.crc32 = crc32.unsigned(buf.__getBytes(buf.pos(), n), this.#entry.crc32);
      this.#entry.uncompressedSize += n;
      this.#entry.compressedSize += n;
    }
    this.#yazlZip.out.writeBuf(buf, n);
    return this;
  }
}
class DeflateOutStream extends OutStream {
  constructor(out, method, level, yazlZip, entry) {
    super(out);
    this.#out = out;
    this.#method = method;
    this.#level = level;
    this.#yazlZip = yazlZip;
    this.#entry = entry;
  }
  static makeDeflate(out, opts=null) {
    const instance = new DeflateOutStream(out, node.zlib.deflateSync);
    if (opts) {
      if (opts.get("nowrap") === true)
        instance.#method = node.zlib.deflateRawSync;
      instance.#level = opts.get("level");
    }
    return instance;
  }
  static makeGzip(out) {
    return new DeflateOutStream(out, node.zlib.gzipSync)
  }
  #yazlZip;
  #entry;
  #out;
  #method;
  #level;
  #isClosed = false;
  #buf = Buffer.allocUnsafe(16 * 1024);
  #availInBuf = 0;
  close() {
    this.#isClosed = true;
    this.flush();
    this.#buf = undefined;
    if (!this.#yazlZip)
      this.#out.close();
    return true;
  }
  flush() {
    this.#writeDeflated();
    this.#out.flush();
  }
  write(b) {
    if (this.#isClosed)
      throw IOErr.make("stream is closed");
    if (this.#availInBuf == this.#buf.length)
      this.#writeDeflated();
    this.#buf.writeUInt8(b, this.#availInBuf);
    this.#availInBuf++;
    return this;
  }
  writeBuf(buf, n=buf.remaining()) {
    if (this.#isClosed)
      throw IOErr.make("stream is closed");
    if (buf.remaining() < n)
      throw IOErr.make("not enough bytes in buf");
    if (this.#availInBuf == this.#buf.length)
      this.#writeDeflated();
    if (this.#availInBuf + n <= this.#buf.length) {
      Buffer.from(buf.__getBytes(buf.pos(), n)).copy(this.#buf, this.#availInBuf);
      this.#availInBuf += n;
    }
    else {
      const totalBuf = Buffer.concat([
        this.#buf.subarray(0, this.#availInBuf),
        buf.__getBytes(buf.pos(), n)
      ]);
      this.#availInBuf += n;
      this.#writeDeflated(totalBuf);
    }
    return this;
  }
  #writeDeflated(buf=this.#buf) {
    if (this.#availInBuf > 0) {
      const inputBuf = buf.subarray(0, this.#availInBuf);
      const outputBuf = this.#method(inputBuf, {
        level: this.#level || undefined
      });
      const n = outputBuf.length;
      if (this.#yazlZip) {
        this.#yazlZip.outputStreamCursor += n;
        if (!this.#entry.crcAndFileSizeKnown) {
          this.#entry.crc32 = crc32.unsigned(inputBuf, this.#entry.crc32);
          this.#entry.uncompressedSize += inputBuf.length;
          this.#entry.compressedSize += n;
        }
      }
      this.#out.writeBuf(MemBuf.__makeBytes(outputBuf), n);
      this.#availInBuf = 0;
    }
  }
}
const c=TimeZone.__cache;
c("CET","AANDRVQHzAAADhAAA0NFVAAADhAABENFU1QCbAAAAAAcIHMJbAAAAAAcIHMHywAADhAAA0NFVAAADhAABENFU1QCbAAAAAAcIHMIbAAAAAAcIHM=");
c("CST6CDT","AAdDU1Q2Q0RUB9f//6ugAANDU1QAAA4QAANDRFQCPgAIAAAcIHcKPgABAAAcIHcHy///q6AAA0NTVAAADhAAA0NEVAM+AAEAABwgdwlsAAAAABwgdw==");
c("EET","AANFRVQHzAAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAOEHUJbAAAAAAOEHUHywAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAOEHUIbAAAAAAOEHU=");
c("EST","AANFU1QHy///ubAAA0VTVAAAAAA=");
c("EST5EDT","AAdFU1Q1RURUB9f//7mwAANFU1QAAA4QAANFRFQCPgAIAAAcIHcKPgABAAAcIHcHy///ubAAA0VTVAAADhAAA0VEVAM+AAEAABwgdwlsAAAAABwgdw==");
c("HST","AANIU1QHy///c2AAA0hTVAAAAAA=");
c("MET","AANNRVQHzAAADhAAA01FVAAADhAABE1FU1QCbAAAAAAcIHMJbAAAAAAcIHMHywAADhAAA01FVAAADhAABE1FU1QCbAAAAAAcIHMIbAAAAAAcIHM=");
c("MST","AANNU1QHy///nZAAA01TVAAAAAA=");
c("MST7MDT","AAdNU1Q3TURUB9f//52QAANNU1QAAA4QAANNRFQCPgAIAAAcIHcKPgABAAAcIHcHy///nZAAA01TVAAADhAAA01EVAM+AAEAABwgdwlsAAAAABwgdw==");
c("PST8PDT","AAdQU1Q4UERUB9f//4+AAANQU1QAAA4QAANQRFQCPgAIAAAcIHcKPgABAAAcIHcHy///j4AAA1BTVAAADhAAA1BEVAM+AAEAABwgdwlsAAAAABwgdw==");
c("WET","AANXRVQHzAAAAAAAA1dFVAAADhAABFdFU1QCbAAAAAAOEHUJbAAAAAAOEHUHywAAAAAAA1dFVAAADhAABFdFU1QCbAAAAAAOEHUIbAAAAAAOEHU=");
c("Asia/Almaty","AAtBc2lhL0FsbWF0eQfUAABUYAADKzA2AAAAAAfMAABUYAAHKzA2LyswNwAADhAAByswNi8rMDcCbAAAAAAcIHMJbAAAAAAcIHMHywAAVGAAByswNi8rMDcAAA4QAAcrMDYvKzA3AmwAAAAAHCBzCGwAAAAAHCBz");
c("Asia/Amman","AApBc2lhL0FtbWFuB94AABwgAANFRVQAAA4QAARFRVNUAmwEAAABUYB3CWwFAAAAAABzB9wAABwgAARFRVNUAAAAAAfWAAAcIAADRUVUAAAOEAAERUVTVAJsBAAAAVGAdwlsBQAAAAAAcwfVAAAcIAADRUVUAAAOEAAERUVTVAJsBAAAAVGAdwhsBQAAAAAAcwfUAAAcIAADRUVUAAAOEAAERUVTVAJsBAAAAVGAdwlkAA8AAAAAcwfTAAAcIAADRUVUAAAOEAAERUVTVAJsBAAAAVGAdwlkABgAAAAAcwfSAAAcIAADRUVUAAAOEAAERUVTVAJsBAAAAVGAdwhsBQAAAAAAcwfQAAAcIAADRUVUAAAOEAAERUVTVAJsBAAAAAAAcwhsBQAAAAAAcwfPAAAcIAADRUVUAAAOEAAERUVTVAZkAAEAAAAAcwhsBQAAAAAAcwfLAAAcIAADRUVUAAAOEAAERUVTVAM+BQEAAAAAdwg+BQ8AAAAAcw==");
c("Asia/Anadyr","AAtBc2lhL0FuYWR5cgfbAACowAADKzEyAAAAAAfaAACasAAHKzExLysxMgAADhAABysxMS8rMTICbAAAAAAcIHMJbAAAAAAcIHMHzAAAqMAABysxMi8rMTMAAA4QAAcrMTIvKzEzAmwAAAAAHCBzCWwAAAAAHCBzB8sAAKjAAAcrMTIvKzEzAAAOEAAHKzEyLysxMwJsAAAAABwgcwhsAAAAABwgcw==");
c("Asia/Aqtau","AApBc2lhL0FxdGF1B9QAAEZQAAMrMDUAAAAAB8wAADhAAAcrMDQvKzA1AAAOEAAHKzA0LyswNQJsAAAAABwgcwlsAAAAABwgcwfLAAA4QAAHKzA0LyswNQAADhAAByswNC8rMDUCbAAAAAAcIHMIbAAAAAAcIHM=");
c("Asia/Aqtobe","AAtBc2lhL0FxdG9iZQfUAABGUAADKzA1AAAAAAfMAABGUAAHKzA1LyswNgAADhAAByswNS8rMDYCbAAAAAAcIHMJbAAAAAAcIHMHywAARlAAByswNS8rMDYAAA4QAAcrMDUvKzA2AmwAAAAAHCBzCGwAAAAAHCBz");
c("Asia/Ashgabat","AA1Bc2lhL0FzaGdhYmF0B8sAAEZQAAMrMDUAAAAA");
c("Asia/Atyrau","AAtBc2lhL0F0eXJhdQfUAABGUAADKzA1AAAAAAfPAAA4QAAHKzA0LyswNQAADhAAByswNC8rMDUCbAAAAAAcIHMJbAAAAAAcIHMHzAAARlAAByswNS8rMDYAAA4QAAcrMDUvKzA2AmwAAAAAHCBzCWwAAAAAHCBzB8sAAEZQAAcrMDUvKzA2AAAOEAAHKzA1LyswNgJsAAAAABwgcwhsAAAAABwgcw==");
c("Asia/Baghdad","AAxBc2lhL0JhZ2hkYWQH2AAAKjAAByswMy8rMDQAAAAAB8sAACowAAcrMDMvKzA0AAAOEAAHKzAzLyswNANkAAEAACowcwlkAAEAACowcw==");
c("Asia/Baku","AAlBc2lhL0Jha3UH4AAAOEAAByswNC8rMDUAAAAAB80AADhAAAcrMDQvKzA1AAAOEAAHKzA0LyswNQJsAAAAADhAdwlsAAAAAEZQdwfMAAA4QAAHKzA0LyswNQAADhAAByswNC8rMDUCbAAAAAAOEHUJbAAAAAAOEHUHywAAOEAAAyswNAAAAAA=");
c("Asia/Bangkok","AAxBc2lhL0Jhbmdrb2sHywAAYnAAAyswNwAAAAA=");
c("Asia/Barnaul","AAxBc2lhL0Jhcm5hdWwH4AAAYnAAAyswNwAAAAAH3gAAVGAAAyswNgAAAAAH2wAAYnAAAyswNwAAAAAHzAAAVGAAByswNi8rMDcAAA4QAAcrMDYvKzA3AmwAAAAAHCBzCWwAAAAAHCBzB8sAAFRgAAcrMDYvKzA3AAAOEAAHKzA2LyswNwJsAAAAABwgcwhsAAAAABwgcw==");
c("Asia/Beirut","AAtBc2lhL0JlaXJ1dAfPAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAAAAAdwlsAAAAAAAAdwfLAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAAAAAdwhsAAAAAAAAdw==");
c("Asia/Bishkek","AAxBc2lhL0Jpc2hrZWsH1QAAVGAAAyswNgAAAAAHzQAARlAAByswNS8rMDYAAA4QAAcrMDUvKzA2AmwAAAAAIyh3CWwAAAAAIyh3B8sAAEZQAAcrMDUvKzA2AAAOEAAHKzA1LyswNgM+AAcAAAAAcwhsAAAAAAAAdw==");
c("Asia/Brunei","AAtBc2lhL0JydW5laQfLAABwgAADKzA4AAAAAA==");
c("Asia/Chita","AApBc2lhL0NoaXRhB+AAAH6QAAMrMDkAAAAAB94AAHCAAAMrMDgAAAAAB9sAAIygAAMrMTAAAAAAB8wAAH6QAAcrMDkvKzEwAAAOEAAHKzA5LysxMAJsAAAAABwgcwlsAAAAABwgcwfLAAB+kAAHKzA5LysxMAAADhAAByswOS8rMTACbAAAAAAcIHMIbAAAAAAcIHM=");
c("Asia/Choibalsan","AA9Bc2lhL0Nob2liYWxzYW4H4QAAcIAAByswOC8rMDkAAAAAB98AAHCAAAcrMDgvKzA5AAAOEAAHKzA4LyswOQJsBgAAABwgdwhsBgAAAAAAdwfYAABwgAAHKzA4LyswOQAAAAAH1wAAfpAAByswOS8rMTAAAAAAB9IAAH6QAAcrMDkvKzEwAAAOEAAHKzA5LysxMAJsBgAAABwgdwhsBgAAABwgdwfRAAB+kAAHKzA5LysxMAAADhAAByswOS8rMTADbAYAAAAcIHcIbAYAAAAcIHcHzwAAfpAAByswOS8rMTAAAAAAB8sAAH6QAAcrMDkvKzEwAAAOEAAHKzA5LysxMAJsAAAAAAAAdwhsAAAAAAAAdw==");
c("Asia/Colombo","AAxBc2lhL0NvbG9tYm8H1gAATVgABSswNTMwAAAAAAfMAABUYAADKzA2AAAAAAfLAABNWAAFKzA1MzAAAAAA");
c("Asia/Damascus","AA1Bc2lhL0RhbWFzY3VzB9wAABwgAANFRVQAAA4QAARFRVNUAmwFAAAAAAB3CWwFAAAAAAB3B9oAABwgAANFRVQAAA4QAARFRVNUAz4FAQAAAAB3CWwFAAAAAAB3B9kAABwgAANFRVQAAA4QAARFRVNUAmwFAAAAAAB3CWwFAAAAAAB3B9gAABwgAANFRVQAAA4QAARFRVNUAz4FAQAAAAB3CmQAAQAAAAB3B9cAABwgAANFRVQAAA4QAARFRVNUAmwFAAAAAAB3Cj4FAQAAAAB3B9YAABwgAANFRVQAAA4QAARFRVNUA2QAAQAAAAB3CGQAFgAAAAB3B88AABwgAANFRVQAAA4QAARFRVNUA2QAAQAAAAB3CWQAAQAAAAB3B80AABwgAANFRVQAAA4QAARFRVNUAmwBAAAAAAB3CWQAAQAAAAB3B8sAABwgAANFRVQAAA4QAARFRVNUA2QAAQAAAAB3CWQAAQAAAAB3");
c("Asia/Dhaka","AApBc2lhL0RoYWthB9oAAFRgAAcrMDYvKzA3AAAAAAfZAABUYAAHKzA2LyswNwAADhAAByswNi8rMDcFZAATAAFDcHcLZAAfAAFRgHcHywAAVGAAAyswNgAAAAA=");
c("Asia/Dili","AAlBc2lhL0RpbGkH0AAAfpAAAyswOQAAAAAHywAAcIAAAyswOAAAAAA=");
c("Asia/Dubai","AApBc2lhL0R1YmFpB8sAADhAAAMrMDQAAAAA");
c("Asia/Dushanbe","AA1Bc2lhL0R1c2hhbmJlB8sAAEZQAAMrMDUAAAAA");
c("Asia/Famagusta","AA5Bc2lhL0ZhbWFndXN0YQfhAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAAA4QdQlsAAAAAA4QdQfgAAAqMAADKzAzAAAAAAfOAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAAA4QdQlsAAAAAA4QdQfLAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAAAAAdwhsAAAAAAAAdw==");
c("Asia/Gaza","AAlBc2lhL0dhemEH4wAAHCAAA0VFVAAADhAABEVFU1QCbAUAAAAAAHcJbAYAAAAOEHcH4AAAHCAAA0VFVAAADhAABEVFU1QCPgYYAAAOEHcJbAYAAAAOEHcH3wAAHCAAA0VFVAAADhAABEVFU1QCbAUAAAFRgHcJPgUVAAAAAHcH3AAAHCAABEVFU1QAAAAAB9sAABwgAANFRVQAAAAAB9oAABwgAANFRVQAAA4QAARFRVNUAmQAGgAAAAB3B2QACwAAAAB3B9kAABwgAANFRVQAAA4QAARFRVNUAmwFAAAAAAB3CD4FAQAADhB3B9gAABwgAANFRVQAAA4QAARFRVNUAmwFAAAAAAB3CGQAAQAAAAB3B9cAABwgAANFRVQAAA4QAARFRVNUA2QAAQAAAAB3CD4ECAAAHCB3B9YAABwgAANFRVQAAA4QAARFRVNUA2QAAQAAAAB3CGQAFgAAAAB3B9UAABwgAANFRVQAAA4QAARFRVNUAz4FDwAAAAB3CWQABAAAHCB3B9QAABwgAANFRVQAAA4QAARFRVNUAz4FDwAAAAB3CWQAAQAADhB3B88AABwgAANFRVQAAA4QAARFRVNUAz4FDwAAAAB3CT4FDwAAAAB3B8wAABwgAANFRVQAAA4QAARFRVNUAz4FAQAAAAB3CD4FDwAAAABzB8sAABwgAANJU1QAAA4QAANJRFQCZAAfAAAAAHcIZAADAAAAAHc=");
c("Asia/Hebron","AAtBc2lhL0hlYnJvbgfjAAAcIAADRUVUAAAOEAAERUVTVAJsBQAAAAAAdwlsBgAAAA4QdwfgAAAcIAADRUVUAAAOEAAERUVTVAI+BhgAAA4QdwlsBgAAAA4QdwffAAAcIAADRUVUAAAOEAAERUVTVAJsBQAAAVGAdwk+BRUAAAAAdwfbAAAcIAAERUVTVAAAAAAH2gAAHCAAA0VFVAAADhAABEVFU1QCZAAaAAAAAHcHZAALAAAAAHcH2QAAHCAAA0VFVAAADhAABEVFU1QCbAUAAAAAAHcIPgUBAAAOEHcH2AAAHCAAA0VFVAAADhAABEVFU1QCbAUAAAAAAHcIZAABAAAAAHcH1wAAHCAAA0VFVAAADhAABEVFU1QDZAABAAAAAHcIPgQIAAAcIHcH1gAAHCAAA0VFVAAADhAABEVFU1QDZAABAAAAAHcIZAAWAAAAAHcH1QAAHCAAA0VFVAAADhAABEVFU1QDPgUPAAAAAHcJZAAEAAAcIHcH1AAAHCAAA0VFVAAADhAABEVFU1QDPgUPAAAAAHcJZAABAAAOEHcHzwAAHCAAA0VFVAAADhAABEVFU1QDPgUPAAAAAHcJPgUPAAAAAHcHzAAAHCAAA0VFVAAADhAABEVFU1QDPgUBAAAAAHcIPgUPAAAAAHMHywAAHCAAA0lTVAAADhAAA0lEVAJkAB8AAAAAdwhkAAMAAAAAdw==");
c("Asia/Ho_Chi_Minh","ABBBc2lhL0hvX0NoaV9NaW5oB8sAAGJwAAMrMDcAAAAA");
c("Asia/Hong_Kong","AA5Bc2lhL0hvbmdfS29uZwfLAABwgAAESEtTVAAAAAA=");
c("Asia/Hovd","AAlBc2lhL0hvdmQH4QAAYnAAByswNy8rMDgAAAAAB98AAGJwAAcrMDcvKzA4AAAOEAAHKzA3LyswOAJsBgAAABwgdwhsBgAAAAAAdwfXAABicAAHKzA3LyswOAAAAAAH0gAAYnAAByswNy8rMDgAAA4QAAcrMDcvKzA4AmwGAAAAHCB3CGwGAAAAHCB3B9EAAGJwAAcrMDcvKzA4AAAOEAAHKzA3LyswOANsBgAAABwgdwhsBgAAABwgdwfPAABicAAHKzA3LyswOAAAAAAHywAAYnAAByswNy8rMDgAAA4QAAcrMDcvKzA4AmwAAAAAAAB3CGwAAAAAAAB3");
c("Asia/Irkutsk","AAxBc2lhL0lya3V0c2sH3gAAcIAAAyswOAAAAAAH2wAAfpAAAyswOQAAAAAHzAAAcIAAByswOC8rMDkAAA4QAAcrMDgvKzA5AmwAAAAAHCBzCWwAAAAAHCBzB8sAAHCAAAcrMDgvKzA5AAAOEAAHKzA4LyswOQJsAAAAABwgcwhsAAAAABwgcw==");
c("Asia/Jakarta","AAxBc2lhL0pha2FydGEHywAAYnAAA1dJQgAAAAA=");
c("Asia/Jayapura","AA1Bc2lhL0pheWFwdXJhB8sAAH6QAANXSVQAAAAA");
c("Asia/Jerusalem","AA5Bc2lhL0plcnVzYWxlbQfdAAAcIAADSVNUAAAOEAADSURUAj4FFwAAHCB3CWwAAAAAHCB3B9wAABwgAANJU1QAAA4QAANJRFQDPAUBAAAcIHcIZAAXAAAcIHcH2wAAHCAAA0lTVAAADhAAA0lEVAM8BQEAABwgdwlkAAIAABwgdwfaAAAcIAADSVNUAAAOEAADSURUAzwFAQAAHCB3CGQADAAAHCB3B9kAABwgAANJU1QAAA4QAANJRFQDPAUBAAAcIHcIZAAbAAAcIHcH2AAAHCAAA0lTVAAADhAAA0lEVAM8BQEAABwgdwlkAAUAABwgdwfXAAAcIAADSVNUAAAOEAADSURUAzwFAQAAHCB3CGQAEAAAHCB3B9YAABwgAANJU1QAAA4QAANJRFQDPAUBAAAcIHcJZAABAAAcIHcH1QAAHCAAA0lTVAAADhAAA0lEVAM8BQEAABwgdwlkAAkAABwgdwfUAAAcIAADSVNUAAAOEAADSURUA2QABwAADhB3CGQAFgAADhB3B9MAABwgAANJU1QAAA4QAANJRFQCZAAcAAAOEHcJZAADAAAOEHcH0gAAHCAAA0lTVAAADhAAA0lEVAJkAB0AAA4QdwlkAAcAAA4QdwfRAAAcIAADSVNUAAAOEAADSURUA2QACQAADhB3CGQAGAAADhB3B9AAABwgAANJU1QAAA4QAANJRFQDZAAOAAAcIHcJZAAGAAAOEHcHzwAAHCAAA0lTVAAADhAAA0lEVANkAAIAABwgdwhkAAMAABwgdwfOAAAcIAADSVNUAAAOEAADSURUAmQAFAAAAAB3CGQABgAAAAB3B80AABwgAANJU1QAAA4QAANJRFQCZAAVAAAAAHcIZAAOAAAAAHcHzAAAHCAAA0lTVAAADhAAA0lEVAJkAA8AAAAAdwhkABAAAAAAdwfLAAAcIAADSVNUAAAOEAADSURUAmQAHwAAAAB3CGQAAwAAAAB3");
c("Asia/Kabul","AApBc2lhL0thYnVsB8sAAD9IAAUrMDQzMAAAAAA=");
c("Asia/Kamchatka","AA5Bc2lhL0thbWNoYXRrYQfbAACowAADKzEyAAAAAAfaAACasAAHKzExLysxMgAADhAABysxMS8rMTICbAAAAAAcIHMJbAAAAAAcIHMHzAAAqMAABysxMi8rMTMAAA4QAAcrMTIvKzEzAmwAAAAAHCBzCWwAAAAAHCBzB8sAAKjAAAcrMTIvKzEzAAAOEAAHKzEyLysxMwJsAAAAABwgcwhsAAAAABwgcw==");
c("Asia/Karachi","AAxBc2lhL0thcmFjaGkH2gAARlAABFBLU1QAAAAAB9kAAEZQAANQS1QAAA4QAARQS1NUA2QADwAAAAB3CmQAAQAAAAB3B9gAAEZQAANQS1QAAA4QAARQS1NUBWQAAQAAAAB3CmQAAQAAAAB3B9MAAEZQAARQS1NUAAAAAAfSAABGUAADUEtUAAAOEAAEUEtTVAM+AAIAAAAAdwk+AAIAAAAAdwfLAABGUAAEUEtTVAAAAAA=");
c("Asia/Kathmandu","AA5Bc2lhL0thdGhtYW5kdQfLAABQ3AAFKzA1NDUAAAAA");
c("Asia/Khandyga","AA1Bc2lhL0toYW5keWdhB94AAH6QAAMrMDkAAAAAB9sAAIygAAMrMTAAAAAAB9QAAIygAAcrMTAvKzExAAAOEAAHKzEwLysxMQJsAAAAABwgcwlsAAAAABwgcwfMAAB+kAAHKzA5LysxMAAADhAAByswOS8rMTACbAAAAAAcIHMJbAAAAAAcIHMHywAAfpAAByswOS8rMTAAAA4QAAcrMDkvKzEwAmwAAAAAHCBzCGwAAAAAHCBz");
c("Asia/Kolkata","AAxBc2lhL0tvbGthdGEHywAATVgAA0lTVAAAAAA=");
c("Asia/Krasnoyarsk","ABBBc2lhL0tyYXNub3lhcnNrB94AAGJwAAMrMDcAAAAAB9sAAHCAAAMrMDgAAAAAB8wAAGJwAAcrMDcvKzA4AAAOEAAHKzA3LyswOAJsAAAAABwgcwlsAAAAABwgcwfLAABicAAHKzA3LyswOAAADhAAByswNy8rMDgCbAAAAAAcIHMIbAAAAAAcIHM=");
c("Asia/Kuala_Lumpur","ABFBc2lhL0t1YWxhX0x1bXB1cgfLAABwgAADKzA4AAAAAA==");
c("Asia/Kuching","AAxBc2lhL0t1Y2hpbmcHywAAcIAAAyswOAAAAAA=");
c("Asia/Macau","AApBc2lhL01hY2F1B8sAAHCAAANDU1QAAAAA");
c("Asia/Magadan","AAxBc2lhL01hZ2FkYW4H4AAAmrAAAysxMQAAAAAH3gAAjKAAAysxMAAAAAAH2wAAqMAAAysxMgAAAAAHzAAAmrAABysxMS8rMTIAAA4QAAcrMTEvKzEyAmwAAAAAHCBzCWwAAAAAHCBzB8sAAJqwAAcrMTEvKzEyAAAOEAAHKzExLysxMgJsAAAAABwgcwhsAAAAABwgcw==");
c("Asia/Makassar","AA1Bc2lhL01ha2Fzc2FyB8sAAHCAAARXSVRBAAAAAA==");
c("Asia/Manila","AAtBc2lhL01hbmlsYQfLAABwgAADUFNUAAAAAA==");
c("Asia/Nicosia","AAxBc2lhL05pY29zaWEHzgAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAOEHUJbAAAAAAOEHUHywAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAAAHcIbAAAAAAAAHc=");
c("Asia/Novokuznetsk","ABFBc2lhL05vdm9rdXpuZXRzawfbAABicAADKzA3AAAAAAfaAABUYAAHKzA2LyswNwAADhAAByswNi8rMDcCbAAAAAAcIHMJbAAAAAAcIHMHzAAAYnAAByswNy8rMDgAAA4QAAcrMDcvKzA4AmwAAAAAHCBzCWwAAAAAHCBzB8sAAGJwAAcrMDcvKzA4AAAOEAAHKzA3LyswOAJsAAAAABwgcwhsAAAAABwgcw==");
c("Asia/Novosibirsk","ABBBc2lhL05vdm9zaWJpcnNrB+AAAGJwAAMrMDcAAAAAB94AAFRgAAMrMDYAAAAAB9sAAGJwAAMrMDcAAAAAB8wAAFRgAAcrMDYvKzA3AAAOEAAHKzA2LyswNwJsAAAAABwgcwlsAAAAABwgcwfLAABUYAAHKzA2LyswNwAADhAAByswNi8rMDcCbAAAAAAcIHMIbAAAAAAcIHM=");
c("Asia/Omsk","AAlBc2lhL09tc2sH3gAAVGAAAyswNgAAAAAH2wAAYnAAAyswNwAAAAAHzAAAVGAAByswNi8rMDcAAA4QAAcrMDYvKzA3AmwAAAAAHCBzCWwAAAAAHCBzB8sAAFRgAAcrMDYvKzA3AAAOEAAHKzA2LyswNwJsAAAAABwgcwhsAAAAABwgcw==");
c("Asia/Oral","AAlBc2lhL09yYWwH1AAARlAAAyswNQAAAAAHzAAAOEAAByswNC8rMDUAAA4QAAcrMDQvKzA1AmwAAAAAHCBzCWwAAAAAHCBzB8sAADhAAAcrMDQvKzA1AAAOEAAHKzA0LyswNQJsAAAAABwgcwhsAAAAABwgcw==");
c("Asia/Pontianak","AA5Bc2lhL1BvbnRpYW5hawfLAABicAADV0lCAAAAAA==");
c("Asia/Pyongyang","AA5Bc2lhL1B5b25neWFuZwfiAAB+kAADS1NUAAAAAAffAAB3iAADS1NUAAAAAAfLAAB+kAADS1NUAAAAAA==");
c("Asia/Qatar","AApBc2lhL1FhdGFyB8sAACowAAMrMDMAAAAA");
c("Asia/Qostanay","AA1Bc2lhL1Fvc3RhbmF5B9QAAFRgAAMrMDYAAAAAB8wAAEZQAAcrMDUvKzA2AAAOEAAHKzA1LyswNgJsAAAAABwgcwlsAAAAABwgcwfLAABGUAAHKzA1LyswNgAADhAAByswNS8rMDYCbAAAAAAcIHMIbAAAAAAcIHM=");
c("Asia/Qyzylorda","AA5Bc2lhL1F5enlsb3JkYQfiAABGUAADKzA1AAAAAAfUAABUYAADKzA2AAAAAAfMAABGUAAHKzA1LyswNgAADhAAByswNS8rMDYCbAAAAAAcIHMJbAAAAAAcIHMHywAARlAAByswNS8rMDYAAA4QAAcrMDUvKzA2AmwAAAAAHCBzCGwAAAAAHCBz");
c("Asia/Riyadh","AAtBc2lhL1JpeWFkaAfLAAAqMAADKzAzAAAAAA==");
c("Asia/Sakhalin","AA1Bc2lhL1Nha2hhbGluB+AAAJqwAAMrMTEAAAAAB94AAIygAAMrMTAAAAAAB9sAAJqwAAMrMTEAAAAAB80AAIygAAcrMTAvKzExAAAOEAAHKzEwLysxMQJsAAAAABwgcwlsAAAAABwgcwfMAACasAAHKzExLysxMgAADhAABysxMS8rMTICbAAAAAAcIHMJbAAAAAAcIHMHywAAmrAABysxMS8rMTIAAA4QAAcrMTEvKzEyAmwAAAAAHCBzCGwAAAAAHCBz");
c("Asia/Samarkand","AA5Bc2lhL1NhbWFya2FuZAfLAABGUAADKzA1AAAAAA==");
c("Asia/Seoul","AApBc2lhL1Nlb3VsB8sAAH6QAANLU1QAAAAA");
c("Asia/Shanghai","AA1Bc2lhL1NoYW5naGFpB8sAAHCAAANDU1QAAAAA");
c("Asia/Singapore","AA5Bc2lhL1NpbmdhcG9yZQfLAABwgAADKzA4AAAAAA==");
c("Asia/Srednekolymsk","ABJBc2lhL1NyZWRuZWtvbHltc2sH3gAAmrAAAysxMQAAAAAH2wAAqMAAAysxMgAAAAAHzAAAmrAABysxMS8rMTIAAA4QAAcrMTEvKzEyAmwAAAAAHCBzCWwAAAAAHCBzB8sAAJqwAAcrMTEvKzEyAAAOEAAHKzExLysxMgJsAAAAABwgcwhsAAAAABwgcw==");
c("Asia/Taipei","AAtBc2lhL1RhaXBlaQfLAABwgAADQ1NUAAAAAA==");
c("Asia/Tashkent","AA1Bc2lhL1Rhc2hrZW50B8sAAEZQAAMrMDUAAAAA");
c("Asia/Tbilisi","AAxBc2lhL1RiaWxpc2kH1QAAOEAAAyswNAAAAAAH1AAAKjAAByswMy8rMDQAAA4QAAcrMDMvKzA0AmwAAAAAHCBzCWwAAAAAHCBzB80AADhAAAcrMDQvKzA1AAAOEAAHKzA0LyswNQJsAAAAAAAAdwlsAAAAAAAAdwfMAAA4QAADKzA1AAAAAAfLAAA4QAAHKzA0LyswNQAADhAAByswNC8rMDUCbAAAAAAAAHcIbAAAAAAAAHc=");
c("Asia/Tehran","AAtBc2lhL1RlaHJhbgfuAAAxOAALKzAzMzAvKzA0MzAAAA4QAAsrMDMzMC8rMDQzMAJkABUAAVGAdwhkABUAAVGAdwfsAAAxOAALKzAzMzAvKzA0MzAAAA4QAAsrMDMzMC8rMDQzMAJkABQAAVGAdwhkABQAAVGAdwfpAAAxOAALKzAzMzAvKzA0MzAAAA4QAAsrMDMzMC8rMDQzMAJkABUAAVGAdwhkABUAAVGAdwfoAAAxOAALKzAzMzAvKzA0MzAAAA4QAAsrMDMzMC8rMDQzMAJkABQAAVGAdwhkABQAAVGAdwflAAAxOAALKzAzMzAvKzA0MzAAAA4QAAsrMDMzMC8rMDQzMAJkABUAAVGAdwhkABUAAVGAdwfkAAAxOAALKzAzMzAvKzA0MzAAAA4QAAsrMDMzMC8rMDQzMAJkABQAAVGAdwhkABQAAVGAdwfhAAAxOAALKzAzMzAvKzA0MzAAAA4QAAsrMDMzMC8rMDQzMAJkABUAAVGAdwhkABUAAVGAdwfgAAAxOAALKzAzMzAvKzA0MzAAAA4QAAsrMDMzMC8rMDQzMAJkABQAAVGAdwhkABQAAVGAdwfdAAAxOAALKzAzMzAvKzA0MzAAAA4QAAsrMDMzMC8rMDQzMAJkABUAAVGAdwhkABUAAVGAdwfcAAAxOAALKzAzMzAvKzA0MzAAAA4QAAsrMDMzMC8rMDQzMAJkABQAAVGAdwhkABQAAVGAdwfZAAAxOAALKzAzMzAvKzA0MzAAAA4QAAsrMDMzMC8rMDQzMAJkABUAAVGAdwhkABUAAVGAdwfYAAAxOAALKzAzMzAvKzA0MzAAAA4QAAsrMDMzMC8rMDQzMAJkABQAAVGAdwhkABQAAVGAdwfWAAAxOAALKzAzMzAvKzA0MzAAAAAAB9UAADE4AAsrMDMzMC8rMDQzMAAADhAACyswMzMwLyswNDMwAmQAFQABUYB3CGQAFQABUYB3B9QAADE4AAsrMDMzMC8rMDQzMAAADhAACyswMzMwLyswNDMwAmQAFAABUYB3CGQAFAABUYB3B9EAADE4AAsrMDMzMC8rMDQzMAAADhAACyswMzMwLyswNDMwAmQAFQABUYB3CGQAFQABUYB3B9AAADE4AAsrMDMzMC8rMDQzMAAADhAACyswMzMwLyswNDMwAmQAFAABUYB3CGQAFAABUYB3B80AADE4AAsrMDMzMC8rMDQzMAAADhAACyswMzMwLyswNDMwAmQAFQABUYB3CGQAFQABUYB3B8wAADE4AAsrMDMzMC8rMDQzMAAADhAACyswMzMwLyswNDMwAmQAFAABUYB3CGQAFAABUYB3B8sAADE4AAsrMDMzMC8rMDQzMAAADhAACyswMzMwLyswNDMwAmQAFQABUYB3CGQAFQABUYB3");
c("Asia/Thimphu","AAxBc2lhL1RoaW1waHUHywAAVGAAAyswNgAAAAA=");
c("Asia/Tokyo","AApBc2lhL1Rva3lvB8sAAH6QAANKU1QAAAAA");
c("Asia/Tomsk","AApBc2lhL1RvbXNrB+AAAGJwAAMrMDcAAAAAB94AAFRgAAMrMDYAAAAAB9sAAGJwAAMrMDcAAAAAB9IAAFRgAAcrMDYvKzA3AAAOEAAHKzA2LyswNwJsAAAAABwgcwlsAAAAABwgcwfMAABicAAHKzA3LyswOAAADhAAByswNy8rMDgCbAAAAAAcIHMJbAAAAAAcIHMHywAAYnAAByswNy8rMDgAAA4QAAcrMDcvKzA4AmwAAAAAHCBzCGwAAAAAHCBz");
c("Asia/Ulaanbaatar","ABBBc2lhL1VsYWFuYmFhdGFyB+EAAHCAAAcrMDgvKzA5AAAAAAffAABwgAAHKzA4LyswOQAADhAAByswOC8rMDkCbAYAAAAcIHcIbAYAAAAAAHcH1wAAcIAAByswOC8rMDkAAAAAB9IAAHCAAAcrMDgvKzA5AAAOEAAHKzA4LyswOQJsBgAAABwgdwhsBgAAABwgdwfRAABwgAAHKzA4LyswOQAADhAAByswOC8rMDkDbAYAAAAcIHcIbAYAAAAcIHcHzwAAcIAAByswOC8rMDkAAAAAB8sAAHCAAAcrMDgvKzA5AAAOEAAHKzA4LyswOQJsAAAAAAAAdwhsAAAAAAAAdw==");
c("Asia/Urumqi","AAtBc2lhL1VydW1xaQfLAABUYAADKzA2AAAAAA==");
c("Asia/Ust-Nera","AA1Bc2lhL1VzdC1OZXJhB94AAIygAAMrMTAAAAAAB9sAAJqwAAMrMTEAAAAAB8wAAJqwAAcrMTEvKzEyAAAOEAAHKzExLysxMgJsAAAAABwgcwlsAAAAABwgcwfLAACasAAHKzExLysxMgAADhAABysxMS8rMTICbAAAAAAcIHMIbAAAAAAcIHM=");
c("Asia/Vladivostok","ABBBc2lhL1ZsYWRpdm9zdG9rB94AAIygAAMrMTAAAAAAB9sAAJqwAAMrMTEAAAAAB8wAAIygAAcrMTAvKzExAAAOEAAHKzEwLysxMQJsAAAAABwgcwlsAAAAABwgcwfLAACMoAAHKzEwLysxMQAADhAABysxMC8rMTECbAAAAAAcIHMIbAAAAAAcIHM=");
c("Asia/Yakutsk","AAxBc2lhL1lha3V0c2sH3gAAfpAAAyswOQAAAAAH2wAAjKAAAysxMAAAAAAHzAAAfpAAByswOS8rMTAAAA4QAAcrMDkvKzEwAmwAAAAAHCBzCWwAAAAAHCBzB8sAAH6QAAcrMDkvKzEwAAAOEAAHKzA5LysxMAJsAAAAABwgcwhsAAAAABwgcw==");
c("Asia/Yangon","AAtBc2lhL1lhbmdvbgfLAABbaAAFKzA2MzAAAAAA");
c("Asia/Yekaterinburg","ABJBc2lhL1lla2F0ZXJpbmJ1cmcH3gAARlAAAyswNQAAAAAH2wAAVGAAAyswNgAAAAAHzAAARlAAByswNS8rMDYAAA4QAAcrMDUvKzA2AmwAAAAAHCBzCWwAAAAAHCBzB8sAAEZQAAcrMDUvKzA2AAAOEAAHKzA1LyswNgJsAAAAABwgcwhsAAAAABwgcw==");
c("Asia/Yerevan","AAxBc2lhL1llcmV2YW4H3AAAOEAAByswNC8rMDUAAAAAB9sAADhAAAcrMDQvKzA1AAAOEAAHKzA0LyswNQJsAAAAABwgcwlsAAAAABwgcwfNAAA4QAAHKzA0LyswNQAADhAAByswNC8rMDUCbAAAAAAcIHMJbAAAAAAcIHMHywAAOEAAAyswNAAAAAA=");
c("Pacific/Apia","AAxQYWNpZmljL0FwaWEH3AAAttAABysxMy8rMTQAAA4QAAcrMTMvKzE0CGwAAAAAKjB3Az4AAQAAOEB3B9sAALbQAAcrMTMvKzE0AAAOEAAHKzEzLysxNAhsBgAAACowdwM+BgEAADhAdwfL//9lUAAHLTExLy0xMAAAAAA=");
c("Pacific/Auckland","ABBQYWNpZmljL0F1Y2tsYW5kB9gAAKjAAAROWlNUAAAOEAAETlpEVAhsAAAAABwgcwM+AAEAABwgcwfXAACowAAETlpTVAAADhAABE5aRFQIbAAAAAAcIHMCPgAPAAAcIHMHywAAqMAABE5aU1QAAA4QAAROWkRUCT4AAQAAHCBzAj4ADwAAHCBz");
c("Pacific/Bougainville","ABRQYWNpZmljL0JvdWdhaW52aWxsZQfeAACasAADKzExAAAAAAfLAACMoAADKzEwAAAAAA==");
c("Pacific/Chatham","AA9QYWNpZmljL0NoYXRoYW0H2AAAs0wACysxMjQ1LysxMzQ1AAAOEAALKzEyNDUvKzEzNDUIbAAAAAAmrHMDPgABAAAmrHMH1wAAs0wACysxMjQ1LysxMzQ1AAAOEAALKzEyNDUvKzEzNDUIbAAAAAAmrHMCPgAPAAAmrHMHywAAs0wACysxMjQ1LysxMzQ1AAAOEAALKzEyNDUvKzEzNDUJPgABAAAmrHMCPgAPAAAmrHM=");
c("Pacific/Chuuk","AA1QYWNpZmljL0NodXVrB8sAAIygAAMrMTAAAAAA");
c("Pacific/Easter","AA5QYWNpZmljL0Vhc3Rlcgfj//+roAAHLTA2Ly0wNQAADhAABy0wNi8tMDUIPgACAAA4QHUDPgACAAAqMHUH4P//q6AABy0wNi8tMDUAAA4QAActMDYvLTA1Bz4ACQAAOEB1BD4ACQAAKjB1B9///6ugAActMDYvLTA1AAAAAAfc//+roAAHLTA2Ly0wNQAADhAABy0wNi8tMDUIPgACAAA4QHUDPgAXAAAqMHUH2///q6AABy0wNi8tMDUAAA4QAActMDYvLTA1Bz4AEAAAOEB1BD4AAgAAKjB1B9r//6ugAActMDYvLTA1AAAOEAAHLTA2Ly0wNQk+AAkAADhAdQM+AAEAACowdQfZ//+roAAHLTA2Ly0wNQAADhAABy0wNi8tMDUJPgAJAAA4QHUCPgAJAAAqMHUH2P//q6AABy0wNi8tMDUAAA4QAActMDYvLTA1CT4ACQAAOEB1AmQAHgAAKjB1B9D//6ugAActMDYvLTA1AAAOEAAHLTA2Ly0wNQk+AAkAADhAdQI+AAkAACowdQfP//+roAAHLTA2Ly0wNQAADhAABy0wNi8tMDUJPgAJAAA4QHUDZAAEAAAqMHUHzv//q6AABy0wNi8tMDUAAA4QAActMDYvLTA1CGQAGwAAOEB1Aj4ACQAAKjB1B83//6ugAActMDYvLTA1AAAOEAAHLTA2Ly0wNQk+AAkAADhAdQJkAB4AACowdQfL//+roAAHLTA2Ly0wNQAADhAABy0wNi8tMDUJPgAJAAA4QHUCPgAJAAAqMHU=");
c("Pacific/Efate","AA1QYWNpZmljL0VmYXRlB8sAAJqwAAcrMTEvKzEyAAAAAA==");
c("Pacific/Enderbury","ABFQYWNpZmljL0VuZGVyYnVyeQfLAAC20AADKzEzAAAAAA==");
c("Pacific/Fakaofo","AA9QYWNpZmljL0Zha2FvZm8H2wAAttAAAysxMwAAAAAHy///ZVAAAy0xMQAAAAA=");
c("Pacific/Fiji","AAxQYWNpZmljL0ZpamkH4wAAqMAABysxMi8rMTMAAA4QAAcrMTIvKzEzCj4ACAAAHCB3AD4ADAAAKjB3B98AAKjAAAcrMTIvKzEzAAAOEAAHKzEyLysxMwo+AAEAABwgdwA+AAwAACowdwfeAACowAAHKzEyLysxMwAADhAABysxMi8rMTMKPgABAAAcIHcAPgASAAAcIHcH3AAAqMAABysxMi8rMTMAAA4QAAcrMTIvKzEzCT4AFQAAHCB3AD4AEgAAKjB3B9sAAKjAAAcrMTIvKzEzAAAOEAAHKzEyLysxMwk+ABUAABwgdwI+AAEAACowdwfaAACowAAHKzEyLysxMwAADhAABysxMi8rMTMJPgAVAAAcIHcCbAAAAAAqMHcH0AAAqMAABysxMi8rMTMAAAAAB88AAKjAAAcrMTIvKzEzAAAOEAAHKzEyLysxMwo+AAEAABwgdwFsAAAAACowdwfLAACowAAHKzEyLysxMwAAAAA=");
c("Pacific/Funafuti","ABBQYWNpZmljL0Z1bmFmdXRpB8sAAKjAAAMrMTIAAAAA");
c("Pacific/Galapagos","ABFQYWNpZmljL0dhbGFwYWdvcwfL//+roAAHLTA2Ly0wNQAAAAA=");
c("Pacific/Gambier","AA9QYWNpZmljL0dhbWJpZXIHy///gXAAAy0wOQAAAAA=");
c("Pacific/Guadalcanal","ABNQYWNpZmljL0d1YWRhbGNhbmFsB8sAAJqwAAMrMTEAAAAA");
c("Pacific/Guam","AAxQYWNpZmljL0d1YW0H0AAAjKAABENoU1QAAAAAB8sAAIygAANHU1QAAAAA");
c("Pacific/Honolulu","ABBQYWNpZmljL0hvbm9sdWx1B8v//3NgAANIU1QAAAAA");
c("Pacific/Kiritimati","ABJQYWNpZmljL0tpcml0aW1hdGkHywAAxOAAAysxNAAAAAA=");
c("Pacific/Kosrae","AA5QYWNpZmljL0tvc3JhZQfPAACasAADKzExAAAAAAfLAACowAADKzEyAAAAAA==");
c("Pacific/Kwajalein","ABFQYWNpZmljL0t3YWphbGVpbgfLAACowAADKzEyAAAAAA==");
c("Pacific/Majuro","AA5QYWNpZmljL01hanVybwfLAACowAADKzEyAAAAAA==");
c("Pacific/Marquesas","ABFQYWNpZmljL01hcnF1ZXNhcwfL//96aAAFLTA5MzAAAAAA");
c("Pacific/Nauru","AA1QYWNpZmljL05hdXJ1B8sAAKjAAAMrMTIAAAAA");
c("Pacific/Niue","AAxQYWNpZmljL05pdWUHy///ZVAAAy0xMQAAAAA=");
c("Pacific/Norfolk","AA9QYWNpZmljL05vcmZvbGsH4wAAmrAABysxMS8rMTIAAA4QAAcrMTEvKzEyCT4AAQAAHCBzAz4AAQAAHCBzB98AAJqwAAMrMTEAAAAAB8sAAKG4AAUrMTEzMAAAAAA=");
c("Pacific/Noumea","AA5QYWNpZmljL05vdW1lYQfLAACasAAHKzExLysxMgAAAAA=");
c("Pacific/Pago_Pago","ABFQYWNpZmljL1BhZ29fUGFnbwfL//9lUAADU1NUAAAAAA==");
c("Pacific/Palau","AA1QYWNpZmljL1BhbGF1B8sAAH6QAAMrMDkAAAAA");
c("Pacific/Pitcairn","ABBQYWNpZmljL1BpdGNhaXJuB87//4+AAAMtMDgAAAAAB8v//4h4AAUtMDgzMAAAAAA=");
c("Pacific/Pohnpei","AA9QYWNpZmljL1BvaG5wZWkHywAAmrAAAysxMQAAAAA=");
c("Pacific/Port_Moresby","ABRQYWNpZmljL1BvcnRfTW9yZXNieQfLAACMoAADKzEwAAAAAA==");
c("Pacific/Rarotonga","ABFQYWNpZmljL1Jhcm90b25nYQfL//9zYAAJLTEwLy0wOTMwAAAAAA==");
c("Pacific/Tahiti","AA5QYWNpZmljL1RhaGl0aQfL//9zYAADLTEwAAAAAA==");
c("Pacific/Tarawa","AA5QYWNpZmljL1RhcmF3YQfLAACowAADKzEyAAAAAA==");
c("Pacific/Tongatapu","ABFQYWNpZmljL1RvbmdhdGFwdQfSAAC20AAHKzEzLysxNAAAAAAH0QAAttAABysxMy8rMTQAAA4QAAcrMTMvKzE0Cj4AAQAAHCB3AGwAAAAAHCB3B9AAALbQAAcrMTMvKzE0AAAOEAAHKzEzLysxNAo+AAEAABwgdwJkABMAABwgcwfPAAC20AAHKzEzLysxNAAAAAAHywAAttAAAysxMwAAAAA=");
c("Pacific/Wake","AAxQYWNpZmljL1dha2UHywAAqMAAAysxMgAAAAA=");
c("Pacific/Wallis","AA5QYWNpZmljL1dhbGxpcwfLAACowAADKzEyAAAAAA==");
c("Etc/GMT","AAdFdGMvR01UB8sAAAAAAANHTVQAAAAA");
c("Etc/GMT+1","AAlFdGMvR01UKzEHy///8fAAAy0wMQAAAAA=");
c("Etc/GMT+10","AApFdGMvR01UKzEwB8v//3NgAAMtMTAAAAAA");
c("Etc/GMT+11","AApFdGMvR01UKzExB8v//2VQAAMtMTEAAAAA");
c("Etc/GMT+12","AApFdGMvR01UKzEyB8v//1dAAAMtMTIAAAAA");
c("Etc/GMT+2","AAlFdGMvR01UKzIHy///4+AAAy0wMgAAAAA=");
c("Etc/GMT+3","AAlFdGMvR01UKzMHy///1dAAAy0wMwAAAAA=");
c("Etc/GMT+4","AAlFdGMvR01UKzQHy///x8AAAy0wNAAAAAA=");
c("Etc/GMT+5","AAlFdGMvR01UKzUHy///ubAAAy0wNQAAAAA=");
c("Etc/GMT+6","AAlFdGMvR01UKzYHy///q6AAAy0wNgAAAAA=");
c("Etc/GMT+7","AAlFdGMvR01UKzcHy///nZAAAy0wNwAAAAA=");
c("Etc/GMT+8","AAlFdGMvR01UKzgHy///j4AAAy0wOAAAAAA=");
c("Etc/GMT+9","AAlFdGMvR01UKzkHy///gXAAAy0wOQAAAAA=");
c("Etc/GMT-1","AAlFdGMvR01ULTEHywAADhAAAyswMQAAAAA=");
c("Etc/GMT-10","AApFdGMvR01ULTEwB8sAAIygAAMrMTAAAAAA");
c("Etc/GMT-11","AApFdGMvR01ULTExB8sAAJqwAAMrMTEAAAAA");
c("Etc/GMT-12","AApFdGMvR01ULTEyB8sAAKjAAAMrMTIAAAAA");
c("Etc/GMT-13","AApFdGMvR01ULTEzB8sAALbQAAMrMTMAAAAA");
c("Etc/GMT-14","AApFdGMvR01ULTE0B8sAAMTgAAMrMTQAAAAA");
c("Etc/GMT-2","AAlFdGMvR01ULTIHywAAHCAAAyswMgAAAAA=");
c("Etc/GMT-3","AAlFdGMvR01ULTMHywAAKjAAAyswMwAAAAA=");
c("Etc/GMT-4","AAlFdGMvR01ULTQHywAAOEAAAyswNAAAAAA=");
c("Etc/GMT-5","AAlFdGMvR01ULTUHywAARlAAAyswNQAAAAA=");
c("Etc/GMT-6","AAlFdGMvR01ULTYHywAAVGAAAyswNgAAAAA=");
c("Etc/GMT-7","AAlFdGMvR01ULTcHywAAYnAAAyswNwAAAAA=");
c("Etc/GMT-8","AAlFdGMvR01ULTgHywAAcIAAAyswOAAAAAA=");
c("Etc/GMT-9","AAlFdGMvR01ULTkHywAAfpAAAyswOQAAAAA=");
c("Etc/Rel","AAdFdGMvUmVsB8sAAAAAAANSZWwAAAAA");
c("Etc/UTC","AAdFdGMvVVRDB8sAAAAAAANVVEMAAAAA");
c("Europe/Amsterdam","ABBFdXJvcGUvQW1zdGVyZGFtB8wAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CWwAAAAADhB1B8sAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CGwAAAAADhB1");
c("Europe/Andorra","AA5FdXJvcGUvQW5kb3JyYQfMAAAOEAADQ0VUAAAOEAAEQ0VTVAJsAAAAAA4QdQlsAAAAAA4QdQfLAAAOEAADQ0VUAAAOEAAEQ0VTVAJsAAAAAA4QdQhsAAAAAA4QdQ==");
c("Europe/Astrakhan","ABBFdXJvcGUvQXN0cmFraGFuB+AAADhAAAMrMDQAAAAAB94AACowAAMrMDMAAAAAB9sAADhAAAMrMDQAAAAAB8wAACowAAcrMDMvKzA0AAAOEAAHKzAzLyswNAJsAAAAABwgcwlsAAAAABwgcwfLAAAqMAAHKzAzLyswNAAADhAAByswMy8rMDQCbAAAAAAcIHMIbAAAAAAcIHM=");
c("Europe/Athens","AA1FdXJvcGUvQXRoZW5zB8wAABwgAANFRVQAAA4QAARFRVNUAmwAAAAADhB1CWwAAAAADhB1B8sAABwgAANFRVQAAA4QAARFRVNUAmwAAAAADhB1CGwAAAAADhB1");
c("Europe/Belgrade","AA9FdXJvcGUvQmVsZ3JhZGUHzAAADhAAA0NFVAAADhAABENFU1QCbAAAAAAOEHUJbAAAAAAOEHUHywAADhAAA0NFVAAADhAABENFU1QCbAAAAAAOEHUIbAAAAAAOEHU=");
c("Europe/Berlin","AA1FdXJvcGUvQmVybGluB8wAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CWwAAAAADhB1B8sAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CGwAAAAADhB1");
c("Europe/Brussels","AA9FdXJvcGUvQnJ1c3NlbHMHzAAADhAAA0NFVAAADhAABENFU1QCbAAAAAAOEHUJbAAAAAAOEHUHywAADhAAA0NFVAAADhAABENFU1QCbAAAAAAOEHUIbAAAAAAOEHU=");
c("Europe/Bucharest","ABBFdXJvcGUvQnVjaGFyZXN0B80AABwgAANFRVQAAA4QAARFRVNUAmwAAAAADhB1CWwAAAAADhB1B8wAABwgAANFRVQAAA4QAARFRVNUAmwAAAAAAAB3CWwAAAAAAAB3B8sAABwgAANFRVQAAA4QAARFRVNUAmwAAAAAAAB3CGwAAAAAAAB3");
c("Europe/Budapest","AA9FdXJvcGUvQnVkYXBlc3QHzAAADhAAA0NFVAAADhAABENFU1QCbAAAAAAOEHUJbAAAAAAOEHUHywAADhAAA0NFVAAADhAABENFU1QCbAAAAAAOEHUIbAAAAAAOEHU=");
c("Europe/Chisinau","AA9FdXJvcGUvQ2hpc2luYXUHzQAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAcIHcJbAAAAAAqMHcHzAAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAAAHcJbAAAAAAAAHcHywAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAAAHcIbAAAAAAAAHc=");
c("Europe/Copenhagen","ABFFdXJvcGUvQ29wZW5oYWdlbgfMAAAOEAADQ0VUAAAOEAAEQ0VTVAJsAAAAAA4QdQlsAAAAAA4QdQfLAAAOEAADQ0VUAAAOEAAEQ0VTVAJsAAAAAA4QdQhsAAAAAA4QdQ==");
c("Europe/Dublin","AA1FdXJvcGUvRHVibGluB8wAAA4QAAdJU1QvR01U///x8AAHSVNUL0dNVAlsAAAAAA4QdQJsAAAAAA4QdQfLAAAOEAAHSVNUL0dNVP//8fAAB0lTVC9HTVQJPgAWAAAOEHUCbAAAAAAOEHU=");
c("Europe/Gibraltar","ABBFdXJvcGUvR2licmFsdGFyB8wAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CWwAAAAADhB1B8sAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CGwAAAAADhB1");
c("Europe/Helsinki","AA9FdXJvcGUvSGVsc2lua2kHzAAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAOEHUJbAAAAAAOEHUHywAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAOEHUIbAAAAAAOEHU=");
c("Europe/Istanbul","AA9FdXJvcGUvSXN0YW5idWwH4AAAKjAAAyswMwAAAAAH3wAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAOEHUJbAAAAAAOEHUH3gAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAOEHUJbAAAAAAOEHUH2wAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAOEHUJbAAAAAAOEHUH1wAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAOEHUJbAAAAAAOEHUHzAAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAOEHMJbAAAAAAOEHMHywAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAOEHMIbAAAAAAOEHM=");
c("Europe/Kaliningrad","ABJFdXJvcGUvS2FsaW5pbmdyYWQH3gAAHCAAA0VFVAAAAAAH2wAAKjAAAyswMwAAAAAHzAAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAcIHMJbAAAAAAcIHMHywAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAcIHMIbAAAAAAcIHM=");
c("Europe/Kiev","AAtFdXJvcGUvS2lldgfMAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAAA4QdQlsAAAAAA4QdQfLAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAAA4QdQhsAAAAAA4QdQ==");
c("Europe/Kirov","AAxFdXJvcGUvS2lyb3YH3gAAKjAAAyswMwAAAAAH2wAAOEAAAyswNAAAAAAHzAAAKjAAByswMy8rMDQAAA4QAAcrMDMvKzA0AmwAAAAAHCBzCWwAAAAAHCBzB8sAACowAAcrMDMvKzA0AAAOEAAHKzAzLyswNAJsAAAAABwgcwhsAAAAABwgcw==");
c("Europe/Lisbon","AA1FdXJvcGUvTGlzYm9uB8wAAAAAAANXRVQAAA4QAARXRVNUAmwAAAAADhB1CWwAAAAADhB1B8sAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CGwAAAAADhB1");
c("Europe/London","AA1FdXJvcGUvTG9uZG9uB8wAAAAAAAdHTVQvQlNUAAAOEAAHR01UL0JTVAJsAAAAAA4QdQlsAAAAAA4QdQfLAAAAAAABRwAADhAAAUICbAAAAAAOEHUJPgAWAAAOEHU=");
c("Europe/Luxembourg","ABFFdXJvcGUvTHV4ZW1ib3VyZwfMAAAOEAADQ0VUAAAOEAAEQ0VTVAJsAAAAAA4QdQlsAAAAAA4QdQfLAAAOEAADQ0VUAAAOEAAEQ0VTVAJsAAAAAA4QdQhsAAAAAA4QdQ==");
c("Europe/Madrid","AA1FdXJvcGUvTWFkcmlkB8wAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CWwAAAAADhB1B8sAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CGwAAAAADhB1");
c("Europe/Malta","AAxFdXJvcGUvTWFsdGEHzAAADhAAA0NFVAAADhAABENFU1QCbAAAAAAOEHUJbAAAAAAOEHUHywAADhAAA0NFVAAADhAABENFU1QCbAAAAAAOEHUIbAAAAAAOEHU=");
c("Europe/Minsk","AAxFdXJvcGUvTWluc2sH2wAAKjAAAyswMwAAAAAHzAAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAcIHMJbAAAAAAcIHMHywAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAcIHMIbAAAAAAcIHM=");
c("Europe/Monaco","AA1FdXJvcGUvTW9uYWNvB8wAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CWwAAAAADhB1B8sAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CGwAAAAADhB1");
c("Europe/Moscow","AA1FdXJvcGUvTW9zY293B94AACowAANNU0sAAAAAB9sAADhAAANNU0sAAAAAB8wAACowAAdNU0svTVNEAAAOEAAHTVNLL01TRAJsAAAAABwgcwlsAAAAABwgcwfLAAAqMAAHTVNLL01TRAAADhAAB01TSy9NU0QCbAAAAAAcIHMIbAAAAAAcIHM=");
c("Europe/Oslo","AAtFdXJvcGUvT3NsbwfMAAAOEAADQ0VUAAAOEAAEQ0VTVAJsAAAAAA4QdQlsAAAAAA4QdQfLAAAOEAADQ0VUAAAOEAAEQ0VTVAJsAAAAAA4QdQhsAAAAAA4QdQ==");
c("Europe/Paris","AAxFdXJvcGUvUGFyaXMHzAAADhAAA0NFVAAADhAABENFU1QCbAAAAAAOEHUJbAAAAAAOEHUHywAADhAAA0NFVAAADhAABENFU1QCbAAAAAAOEHUIbAAAAAAOEHU=");
c("Europe/Prague","AA1FdXJvcGUvUHJhZ3VlB8wAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CWwAAAAADhB1B8sAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CGwAAAAADhB1");
c("Europe/Riga","AAtFdXJvcGUvUmlnYQfRAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAAA4QdQlsAAAAAA4QdQfQAAAcIAADRUVUAAAAAAfNAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAAA4QdQlsAAAAAA4QdQfLAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAABwgcwhsAAAAABwgcw==");
c("Europe/Rome","AAtFdXJvcGUvUm9tZQfMAAAOEAADQ0VUAAAOEAAEQ0VTVAJsAAAAAA4QdQlsAAAAAA4QdQfLAAAOEAADQ0VUAAAOEAAEQ0VTVAJsAAAAAA4QdQhsAAAAAA4QdQ==");
c("Europe/Samara","AA1FdXJvcGUvU2FtYXJhB9sAADhAAAMrMDQAAAAAB9oAACowAAcrMDMvKzA0AAAOEAAHKzAzLyswNAJsAAAAABwgcwlsAAAAABwgcwfMAAA4QAAHKzA0LyswNQAADhAAByswNC8rMDUCbAAAAAAcIHMJbAAAAAAcIHMHywAAOEAAByswNC8rMDUAAA4QAAcrMDQvKzA1AmwAAAAAHCBzCGwAAAAAHCBz");
c("Europe/Saratov","AA5FdXJvcGUvU2FyYXRvdgfgAAA4QAADKzA0AAAAAAfeAAAqMAADKzAzAAAAAAfbAAA4QAADKzA0AAAAAAfMAAAqMAAHKzAzLyswNAAADhAAByswMy8rMDQCbAAAAAAcIHMJbAAAAAAcIHMHywAAKjAAByswMy8rMDQAAA4QAAcrMDMvKzA0AmwAAAAAHCBzCGwAAAAAHCBz");
c("Europe/Simferopol","ABFFdXJvcGUvU2ltZmVyb3BvbAfeAAAqMAADTVNLAAAAAAfNAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAAA4QdQlsAAAAAA4QdQfMAAAqMAAHTVNLL01TRAAADhAAB01TSy9NU0QCbAAAAAAcIHMJbAAAAAAcIHMHywAAKjAAB01TSy9NU0QAAA4QAAdNU0svTVNEAmwAAAAAAAB3CGwAAAAAAAB3");
c("Europe/Sofia","AAxFdXJvcGUvU29maWEHzQAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAOEHUJbAAAAAAOEHUHzAAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAAAHcJbAAAAAAAAHcHywAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAAAHcIbAAAAAAAAHc=");
c("Europe/Stockholm","ABBFdXJvcGUvU3RvY2tob2xtB8wAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CWwAAAAADhB1B8sAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CGwAAAAADhB1");
c("Europe/Tallinn","AA5FdXJvcGUvVGFsbGlubgfSAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAAA4QdQlsAAAAAA4QdQfPAAAcIAADRUVUAAAAAAfOAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAAA4QdQlsAAAAAA4QdQfMAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAABwgcwlsAAAAABwgcwfLAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAABwgcwhsAAAAABwgcw==");
c("Europe/Tirane","AA1FdXJvcGUvVGlyYW5lB8wAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CWwAAAAADhB1B8sAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CGwAAAAADhB1");
c("Europe/Ulyanovsk","ABBFdXJvcGUvVWx5YW5vdnNrB+AAADhAAAMrMDQAAAAAB94AACowAAMrMDMAAAAAB9sAADhAAAMrMDQAAAAAB8wAACowAAcrMDMvKzA0AAAOEAAHKzAzLyswNAJsAAAAABwgcwlsAAAAABwgcwfLAAAqMAAHKzAzLyswNAAADhAAByswMy8rMDQCbAAAAAAcIHMIbAAAAAAcIHM=");
c("Europe/Uzhgorod","AA9FdXJvcGUvVXpoZ29yb2QHzAAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAOEHUJbAAAAAAOEHUHywAAHCAAA0VFVAAADhAABEVFU1QCbAAAAAAOEHUIbAAAAAAOEHU=");
c("Europe/Vienna","AA1FdXJvcGUvVmllbm5hB8wAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CWwAAAAADhB1B8sAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CGwAAAAADhB1");
c("Europe/Vilnius","AA5FdXJvcGUvVmlsbml1cwfTAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAAA4QdQlsAAAAAA4QdQfPAAAcIAADRUVUAAAAAAfOAAAOEAADQ0VUAAAOEAAEQ0VTVAJsAAAAAA4QdQlsAAAAAA4QdQfMAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAABwgcwlsAAAAABwgcwfLAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAABwgcwhsAAAAABwgcw==");
c("Europe/Volgograd","ABBFdXJvcGUvVm9sZ29ncmFkB+IAADhAAAMrMDQAAAAAB94AACowAAMrMDMAAAAAB9sAADhAAAMrMDQAAAAAB8wAACowAAcrMDMvKzA0AAAOEAAHKzAzLyswNAJsAAAAABwgcwlsAAAAABwgcwfLAAAqMAAHKzAzLyswNAAADhAAByswMy8rMDQCbAAAAAAcIHMIbAAAAAAcIHM=");
c("Europe/Warsaw","AA1FdXJvcGUvV2Fyc2F3B8wAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CWwAAAAADhB1B8sAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CGwAAAAADhB1");
c("Europe/Zaporozhye","ABFFdXJvcGUvWmFwb3Jvemh5ZQfMAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAAA4QdQlsAAAAAA4QdQfLAAAcIAADRUVUAAAOEAAERUVTVAJsAAAAAA4QdQhsAAAAAA4QdQ==");
c("Europe/Zurich","AA1FdXJvcGUvWnVyaWNoB8wAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CWwAAAAADhB1B8sAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAADhB1CGwAAAAADhB1");
c("Africa/Abidjan","AA5BZnJpY2EvQWJpZGphbgfLAAAAAAADR01UAAAAAA==");
c("Africa/Accra","AAxBZnJpY2EvQWNjcmEHywAAAAAACUdNVC8rMDAyMAAAAAA=");
c("Africa/Algiers","AA5BZnJpY2EvQWxnaWVycwfLAAAOEAADQ0VUAAAAAA==");
c("Africa/Bissau","AA1BZnJpY2EvQmlzc2F1B8sAAAAAAANHTVQAAAAA");
c("Africa/Cairo","AAxBZnJpY2EvQ2Fpcm8H5AAAHCAABEVFU1QAAAAAB+MAABwgAANFRVQAAA4QAARFRVNUBWQABgABUYB3BGQAAgABUYB3B+IAABwgAANFRVQAAA4QAARFRVNUBWQADgABUYB3BGQACgABUYB3B+EAABwgAANFRVQAAA4QAARFRVNUBWQAHQABUYB3BGQAGQABUYB3B+AAABwgAANFRVQAAA4QAARFRVNUBmQABwABUYB3BWQAAgABUYB3B98AABwgAANFRVQAAA4QAARFRVNUBmQAFwABUYB3BWQACwABUYB3B94AABwgAANFRVQAAA4QAARFRVNUBGQADwABUYB3BWQAGgABUYB3B9sAABwgAARFRVNUAAAAAAfaAAAcIAADRUVUAAAOEAAERUVTVANsBQAAAAAAcwdkAAoAAVGAdwfZAAAcIAADRUVUAAAOEAAERUVTVANsBQAAAAAAcwdkABQAAVGAdwfYAAAcIAADRUVUAAAOEAAERUVTVANsBQAAAAAAcwdsBAAAAVGAdwfXAAAcIAADRUVUAAAOEAAERUVTVANsBQAAAAAAcwg+BAEAAVGAdwfWAAAcIAADRUVUAAAOEAAERUVTVANsBQAAAAAAcwhkABUAAVGAdwfLAAAcIAADRUVUAAAOEAAERUVTVANsBQAAAAAAcwhsBAAAAVGAdw==");
c("Africa/Casablanca","ABFBZnJpY2EvQ2FzYWJsYW5jYQfuAAAOEAAHKzAxLyswMP//8fAAByswMS8rMDALZAAWAAAqMHcBZAAKAAAcIHcH7QAADhAAByswMS8rMDAAAAAAB+wAAA4QAAcrMDEvKzAw///x8AAHKzAxLyswMABkABcAACowdwFkABsAABwgdwfrAAAOEAAHKzAxLyswMP//8fAAByswMS8rMDABZAAHAAAqMHcCZAAOAAAcIHcH6gAADhAAByswMS8rMDD///HwAAcrMDEvKzAwAWQADwAAKjB3AmQAFgAAHCB3B+kAAA4QAAcrMDEvKzAw///x8AAHKzAxLyswMAFkABcAACowdwNkAAYAABwgdwfoAAAOEAAHKzAxLyswMP//8fAAByswMS8rMDACZAAKAAAqMHcDZAAOAAAcIHcH5wAADhAAByswMS8rMDD///HwAAcrMDEvKzAwAmQAEwAAKjB3A2QAFwAAHCB3B+YAAA4QAAcrMDEvKzAw///x8AAHKzAxLyswMAJkABsAACowdwRkAAgAABwgdwflAAAOEAAHKzAxLyswMP//8fAAByswMS8rMDADZAALAAAqMHcEZAAQAAAcIHcH5AAADhAAByswMS8rMDD///HwAAcrMDEvKzAwA2QAEwAAKjB3BGQAGAAAHCB3B+MAAA4QAAcrMDEvKzAw///x8AAHKzAxLyswMARkAAUAACowdwVkAAkAABwgdwfiAAAOEAAHKzAxLyswMAAADhAAByswMS8rMDAFZAARAAAcIHcEZAANAAAqMHcH4QAAAAAAByswMC8rMDEAAA4QAAcrMDAvKzAxBmQAAgAAHCB3BGQAFQAAKjB3B+AAAAAAAAcrMDAvKzAxAAAOEAAHKzAwLyswMQZkAAoAABwgdwVkAAUAACowdwffAAAAAAAHKzAwLyswMQAADhAAByswMC8rMDEGZAASAAAcIHcFZAANAAAqMHcH3gAAAAAAByswMC8rMDEAAA4QAAcrMDAvKzAxB2QAAgAAHCB3BWQAHAAAKjB3B90AAAAAAAcrMDAvKzAxAAAOEAAHKzAwLyswMQdkAAoAABwgdwZkAAcAACowdwfcAAAAAAAHKzAwLyswMQAADhAAByswMC8rMDEHZAAUAAAcIHcGZAAUAAAqMHcH2wAAAAAAByswMC8rMDEAAA4QAAcrMDAvKzAxA2QAAwAAAAB3BmQAHwAAAAB3B9oAAAAAAAcrMDAvKzAxAAAOEAAHKzAwLyswMQRkAAIAAAAAdwdkAAgAAAAAdwfZAAAAAAAHKzAwLyswMQAADhAAByswMC8rMDEFZAABAAAAAHcHZAAVAAAAAHcH2AAAAAAAByswMC8rMDEAAA4QAAcrMDAvKzAxBWQAAQAAAAB3CGQAAQAAAAB3B8sAAAAAAAcrMDAvKzAxAAAAAA==");
c("Africa/Ceuta","AAxBZnJpY2EvQ2V1dGEHzAAADhAAA0NFVAAADhAABENFU1QCbAAAAAAOEHUJbAAAAAAOEHUHywAADhAAA0NFVAAADhAABENFU1QCbAAAAAAOEHUIbAAAAAAOEHU=");
c("Africa/El_Aaiun","AA9BZnJpY2EvRWxfQWFpdW4H7gAADhAAByswMS8rMDD///HwAAcrMDEvKzAwC2QAFgAAKjB3AWQACgAAHCB3B+0AAA4QAAcrMDEvKzAwAAAAAAfsAAAOEAAHKzAxLyswMP//8fAAByswMS8rMDAAZAAXAAAqMHcBZAAbAAAcIHcH6wAADhAAByswMS8rMDD///HwAAcrMDEvKzAwAWQABwAAKjB3AmQADgAAHCB3B+oAAA4QAAcrMDEvKzAw///x8AAHKzAxLyswMAFkAA8AACowdwJkABYAABwgdwfpAAAOEAAHKzAxLyswMP//8fAAByswMS8rMDABZAAXAAAqMHcDZAAGAAAcIHcH6AAADhAAByswMS8rMDD///HwAAcrMDEvKzAwAmQACgAAKjB3A2QADgAAHCB3B+cAAA4QAAcrMDEvKzAw///x8AAHKzAxLyswMAJkABMAACowdwNkABcAABwgdwfmAAAOEAAHKzAxLyswMP//8fAAByswMS8rMDACZAAbAAAqMHcEZAAIAAAcIHcH5QAADhAAByswMS8rMDD///HwAAcrMDEvKzAwA2QACwAAKjB3BGQAEAAAHCB3B+QAAA4QAAcrMDEvKzAw///x8AAHKzAxLyswMANkABMAACowdwRkABgAABwgdwfjAAAOEAAHKzAxLyswMP//8fAAByswMS8rMDAEZAAFAAAqMHcFZAAJAAAcIHcH4gAADhAAByswMS8rMDAAAA4QAAcrMDEvKzAwBWQAEQAAHCB3BGQADQAAKjB3B+EAAAAAAAcrMDAvKzAxAAAOEAAHKzAwLyswMQZkAAIAABwgdwRkABUAACowdwfgAAAAAAAHKzAwLyswMQAADhAAByswMC8rMDEGZAAKAAAcIHcFZAAFAAAqMHcH3wAAAAAAByswMC8rMDEAAA4QAAcrMDAvKzAxBmQAEgAAHCB3BWQADQAAKjB3B94AAAAAAAcrMDAvKzAxAAAOEAAHKzAwLyswMQdkAAIAABwgdwVkABwAACowdwfdAAAAAAAHKzAwLyswMQAADhAAByswMC8rMDEHZAAKAAAcIHcGZAAHAAAqMHcH3AAAAAAAByswMC8rMDEAAA4QAAcrMDAvKzAxB2QAFAAAHCB3BmQAFAAAKjB3B9sAAAAAAAcrMDAvKzAxAAAOEAAHKzAwLyswMQNkAAMAAAAAdwZkAB8AAAAAdwfaAAAAAAAHKzAwLyswMQAADhAAByswMC8rMDEEZAACAAAAAHcHZAAIAAAAAHcH2QAAAAAAByswMC8rMDEAAA4QAAcrMDAvKzAxBWQAAQAAAAB3B2QAFQAAAAB3B9gAAAAAAAcrMDAvKzAxAAAOEAAHKzAwLyswMQVkAAEAAAAAdwhkAAEAAAAAdwfLAAAAAAAHKzAwLyswMQAAAAA=");
c("Africa/Johannesburg","ABNBZnJpY2EvSm9oYW5uZXNidXJnB8sAABwgAARTQVNUAAAAAA==");
c("Africa/Juba","AAtBZnJpY2EvSnViYQfQAAAqMAADRUFUAAAAAAfLAAAcIAAEQ0FTVAAAAAA=");
c("Africa/Khartoum","AA9BZnJpY2EvS2hhcnRvdW0H4QAAHCAAA0NBVAAAAAAH0AAAKjAAA0VBVAAAAAAHywAAHCAABENBU1QAAAAA");
c("Africa/Lagos","AAxBZnJpY2EvTGFnb3MHywAADhAAA1dBVAAAAAA=");
c("Africa/Maputo","AA1BZnJpY2EvTWFwdXRvB8sAABwgAANDQVQAAAAA");
c("Africa/Monrovia","AA9BZnJpY2EvTW9ucm92aWEHywAAAAAAA0dNVAAAAAA=");
c("Africa/Nairobi","AA5BZnJpY2EvTmFpcm9iaQfLAAAqMAADRUFUAAAAAA==");
c("Africa/Ndjamena","AA9BZnJpY2EvTmRqYW1lbmEHywAADhAAA1dBVAAAAAA=");
c("Africa/Sao_Tome","AA9BZnJpY2EvU2FvX1RvbWUH4wAAAAAAA0dNVAAAAAAH4gAADhAAA1dBVAAAAAAHywAAAAAAA0dNVAAAAAA=");
c("Africa/Tripoli","AA5BZnJpY2EvVHJpcG9saQfdAAAcIAADRUVUAAAAAAfcAAAOEAAEQ0VTVAAAAAAHzQAAHCAAA0VFVAAAAAAHzAAADhAABENFU1QAAAAAB8sAABwgAANFRVQAAAAA");
c("Africa/Tunis","AAxBZnJpY2EvVHVuaXMH2QAADhAABENFU1QAAAAAB9YAAA4QAANDRVQAAA4QAARDRVNUAmwAAAAAHCBzCWwAAAAAHCBzB9UAAA4QAANDRVQAAA4QAARDRVNUBGQAAQAAAABzCGQAHgAADhBzB8sAAA4QAARDRVNUAAAAAA==");
c("Africa/Windhoek","AA9BZnJpY2EvV2luZGhvZWsH4gAAHCAAAVMAAAAAB8sAABwgAAFD///x8AABVwM+AAEAABwgdwg+AAEAABwgdw==");
c("America/Adak","AAxBbWVyaWNhL0FkYWsH1///c2AAA0hTVAAADhAAA0hEVAI+AAgAABwgdwo+AAEAABwgdwfL//9zYAADSFNUAAAOEAADSERUAz4AAQAAHCB3CWwAAAAAHCB3");
c("America/Anchorage","ABFBbWVyaWNhL0FuY2hvcmFnZQfX//+BcAAEQUtTVAAADhAABEFLRFQCPgAIAAAcIHcKPgABAAAcIHcHy///gXAABEFLU1QAAA4QAARBS0RUAz4AAQAAHCB3CWwAAAAAHCB3");
c("America/Araguaina","ABFBbWVyaWNhL0FyYWd1YWluYQfd///V0AADLTAzAAAAAAfc///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJPgAPAAAAAHcBPgAWAAAAAHcH0///1dAAAy0wMwAAAAAH0v//1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCmQAAwAAAAB3AT4ADwAAAAB3B9H//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMgk+AAgAAAAAdwE+AA8AAAAAdwfQ///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJPgAIAAAAAHcBZAAbAAAAAHcHz///1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCWQAAwAAAAB3AWQAFQAAAAB3B87//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMglkAAsAAAAAdwJkAAEAAAAAdwfN///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJZAAGAAAAAHcBZAAQAAAAAHcHzP//1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCWQABgAAAAB3AWQACwAAAAB3B8v//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMgk+AAsAAAAAdwE+AA8AAAAAdw==");
c("America/Asuncion","ABBBbWVyaWNhL0FzdW5jaW9uB93//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwk+AAEAAAAAdwI+ABYAAAAAdwfa///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgABAAAAAHcDPgAIAAAAAHcH1f//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ADwAAAAB3Aj4ACAAAAAB3B9T//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwk+AA8AAAAAdwM+AAEAAAAAdwfS///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMIPgABAAAAAHcDPgABAAAAAHcHzv//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4AAQAAAAB3Aj4AAQAAAAB3B83//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwk+AAEAAAAAdwFsAAAAAAAAdwfM///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgABAAAAAHcCZAABAAAAAHcHy///x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCWQAAQAAAAB3AWwAAAAAAAB3");
c("America/Atikokan","ABBBbWVyaWNhL0F0aWtva2FuB8v//7mwAANFU1QAAAAA");
c("America/Bahia","AA1BbWVyaWNhL0JhaGlhB9z//9XQAAMtMDMAAAAAB9v//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMgk+AA8AAAAAdwE+AA8AAAAAdwfT///V0AADLTAzAAAAAAfS///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIKZAADAAAAAHcBPgAPAAAAAHcH0f//1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCT4ACAAAAAB3AT4ADwAAAAB3B9D//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMgk+AAgAAAAAdwFkABsAAAAAdwfP///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJZAADAAAAAHcBZAAVAAAAAHcHzv//1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCWQACwAAAAB3AmQAAQAAAAB3B83//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMglkAAYAAAAAdwFkABAAAAAAdwfM///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJZAAGAAAAAHcBZAALAAAAAHcHy///1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCT4ACwAAAAB3AT4ADwAAAAB3");
c("America/Bahia_Banderas","ABZBbWVyaWNhL0JhaGlhX0JhbmRlcmFzB9r//6ugAANDU1QAAA4QAANDRFQDPgABAAAcIHcJbAAAAAAcIHcH0v//nZAAA01TVAAADhAAA01EVAM+AAEAABwgdwlsAAAAABwgdwfR//+dkAADTVNUAAAOEAADTURUBD4AAQAAHCB3CGwAAAAAHCB3B8z//52QAANNU1QAAA4QAANNRFQDPgABAAAcIHcJbAAAAAAcIHcHy///nZAAA01TVAAAAAA=");
c("America/Barbados","ABBBbWVyaWNhL0JhcmJhZG9zB8v//8fAAANBU1QAAAAA");
c("America/Belem","AA1BbWVyaWNhL0JlbGVtB8v//9XQAAMtMDMAAAAA");
c("America/Belize","AA5BbWVyaWNhL0JlbGl6ZQfL//+roAABUwAAAAA=");
c("America/North_Dakota/Beulah","ABtBbWVyaWNhL05vcnRoX0Rha290YS9CZXVsYWgH2v//q6AAA0NTVAAADhAAA0NEVAI+AAgAABwgdwo+AAEAABwgdwfX//+dkAADTVNUAAAOEAADTURUAj4ACAAAHCB3Cj4AAQAAHCB3B8v//52QAANNU1QAAA4QAANNRFQDPgABAAAcIHcJbAAAAAAcIHc=");
c("America/Blanc-Sablon","ABRBbWVyaWNhL0JsYW5jLVNhYmxvbgfL///HwAADQVNUAAAAAA==");
c("America/Boa_Vista","ABFBbWVyaWNhL0JvYV9WaXN0YQfQ///HwAADLTA0AAAAAAfP///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJZAADAAAAAHcBZAAVAAAAAHcHy///x8AAAy0wNAAAAAA=");
c("America/Bogota","AA5BbWVyaWNhL0JvZ290YQfL//+5sAAHLTA1Ly0wNAAAAAA=");
c("America/Boise","AA1BbWVyaWNhL0JvaXNlB9f//52QAANNU1QAAA4QAANNRFQCPgAIAAAcIHcKPgABAAAcIHcHy///nZAAA01TVAAADhAAA01EVAM+AAEAABwgdwlsAAAAABwgdw==");
c("America/Argentina/Buenos_Aires","AB5BbWVyaWNhL0FyZ2VudGluYS9CdWVub3NfQWlyZXMH2f//1dAABy0wMy8tMDIAAAAAB9j//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMgk+AA8AAAAAdwI+AA8AAAAAdwfQ///V0AAHLTAzLy0wMgAAAAAHz///x8AABy0wNC8tMDMAAAAAB8v//9XQAActMDMvLTAyAAAAAA==");
c("America/Cambridge_Bay","ABVBbWVyaWNhL0NhbWJyaWRnZV9CYXkH1///nZAAA01TVAAADhAAA01EVAI+AAgAABwgdwo+AAEAABwgdwfR//+dkAADTVNUAAAOEAADTURUAz4AAQAAHCB3CWwAAAAAHCB3B9D//6ugAANDU1QAAAAAB8///6ugAANDU1QAAA4QAANDRFQDPgABAAAcIHcJbAAAAAAcIHcHy///nZAAA01TVAAADhAAA01EVAM+AAEAABwgdwlsAAAAABwgdw==");
c("America/Campo_Grande","ABRBbWVyaWNhL0NhbXBvX0dyYW5kZQfj///HwAAHLTA0Ly0wMwAAAAAH4v//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCj4AAQAAAAB3AT4ADwAAAAB3B+D//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwk+AA8AAAAAdwE+AA8AAAAAdwff///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgAPAAAAAHcBPgAWAAAAAHcH3f//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ADwAAAAB3AT4ADwAAAAB3B9z//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwk+AA8AAAAAdwE+ABYAAAAAdwfY///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgAPAAAAAHcBPgAPAAAAAHcH1///x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ACAAAAAB3AWQAGQAAAAB3B9b//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwpkAAUAAAAAdwE+AA8AAAAAdwfV///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJZAAQAAAAAHcBPgAPAAAAAHcH1P//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCmQAAgAAAAB3AT4ADwAAAAB3B9P//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwlkABMAAAAAdwE+AA8AAAAAdwfS///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMKZAADAAAAAHcBPgAPAAAAAHcH0f//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ACAAAAAB3AT4ADwAAAAB3B9D//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwk+AAgAAAAAdwFkABsAAAAAdwfP///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJZAADAAAAAHcBZAAVAAAAAHcHzv//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCWQACwAAAAB3AmQAAQAAAAB3B83//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwlkAAYAAAAAdwFkABAAAAAAdwfM///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJZAAGAAAAAHcBZAALAAAAAHcHy///x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ACwAAAAB3AT4ADwAAAAB3");
c("America/Cancun","AA5BbWVyaWNhL0NhbmN1bgff//+5sAADRVNUAAAAAAfS//+roAADQ1NUAAAOEAADQ0RUAz4AAQAAHCB3CWwAAAAAHCB3B9H//6ugAANDU1QAAA4QAANDRFQEPgABAAAcIHcIbAAAAAAcIHcHzv//q6AAA0NTVAAADhAAA0NEVAM+AAEAABwgdwlsAAAAABwgdwfM//+5sAADRVNUAAAOEAADRURUAz4AAQAAHCB3CWwAAAAAHCB3B8v//7mwAANFU1QAAAAA");
c("America/Caracas","AA9BbWVyaWNhL0NhcmFjYXMH4P//x8AAAy0wNAAAAAAH1///wLgABS0wNDMwAAAAAAfL///HwAADLTA0AAAAAA==");
c("America/Argentina/Catamarca","ABtBbWVyaWNhL0FyZ2VudGluYS9DYXRhbWFyY2EH2P//1dAAAy0wMwAAAAAH1P//1dAABy0wMy8tMDIAAAAAB9D//9XQAAMtMDMAAAAAB8///8fAAActMDQvLTAzAAAAAAfL///V0AAHLTAzLy0wMgAAAAA=");
c("America/Cayenne","AA9BbWVyaWNhL0NheWVubmUHy///1dAAAy0wMwAAAAA=");
c("America/North_Dakota/Center","ABtBbWVyaWNhL05vcnRoX0Rha290YS9DZW50ZXIH1///q6AAA0NTVAAADhAAA0NEVAI+AAgAABwgdwo+AAEAABwgdwfL//+roAADQ1NUAAAOEAADQ0RUAz4AAQAAHCB3CWwAAAAAHCB3");
c("America/Chicago","AA9BbWVyaWNhL0NoaWNhZ28H1///q6AAA0NTVAAADhAAA0NEVAI+AAgAABwgdwo+AAEAABwgdwfL//+roAADQ1NUAAAOEAADQ0RUAz4AAQAAHCB3CWwAAAAAHCB3");
c("America/Chihuahua","ABFBbWVyaWNhL0NoaWh1YWh1YQfS//+dkAADTVNUAAAOEAADTURUAz4AAQAAHCB3CWwAAAAAHCB3B9H//52QAANNU1QAAA4QAANNRFQEPgABAAAcIHcIbAAAAAAcIHcHzv//nZAAA01TVAAADhAAA01EVAM+AAEAABwgdwlsAAAAABwgdwfM//+roAADQ1NUAAAOEAADQ0RUAz4AAQAAHCB3CWwAAAAAHCB3B8v//6ugAANDU1QAAAAA");
c("America/Argentina/Cordoba","ABlBbWVyaWNhL0FyZ2VudGluYS9Db3Jkb2JhB9n//9XQAActMDMvLTAyAAAAAAfY///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJPgAPAAAAAHcCPgAPAAAAAHcH0P//1dAABy0wMy8tMDIAAAAAB8///8fAAActMDQvLTAzAAAAAAfL///V0AAHLTAzLy0wMgAAAAA=");
c("America/Costa_Rica","ABJBbWVyaWNhL0Nvc3RhX1JpY2EHy///q6AAA0NTVAAAAAA=");
c("America/Creston","AA9BbWVyaWNhL0NyZXN0b24Hy///nZAAA01TVAAAAAA=");
c("America/Cuiaba","AA5BbWVyaWNhL0N1aWFiYQfj///HwAAHLTA0Ly0wMwAAAAAH4v//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCj4AAQAAAAB3AT4ADwAAAAB3B+D//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwk+AA8AAAAAdwE+AA8AAAAAdwff///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgAPAAAAAHcBPgAWAAAAAHcH3f//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ADwAAAAB3AT4ADwAAAAB3B9z//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwk+AA8AAAAAdwE+ABYAAAAAdwfY///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgAPAAAAAHcBPgAPAAAAAHcH1///x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ACAAAAAB3AWQAGQAAAAB3B9b//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwpkAAUAAAAAdwE+AA8AAAAAdwfV///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJZAAQAAAAAHcBPgAPAAAAAHcH1P//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCmQAAgAAAAB3AT4ADwAAAAB3B9P//8fAAAMtMDQAAAAAB9L//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwpkAAMAAAAAdwE+AA8AAAAAdwfR///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgAIAAAAAHcBPgAPAAAAAHcH0P//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ACAAAAAB3AWQAGwAAAAB3B8///8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwlkAAMAAAAAdwFkABUAAAAAdwfO///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJZAALAAAAAHcCZAABAAAAAHcHzf//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCWQABgAAAAB3AWQAEAAAAAB3B8z//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwlkAAYAAAAAdwFkAAsAAAAAdwfL///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgALAAAAAHcBPgAPAAAAAHc=");
c("America/Curacao","AA9BbWVyaWNhL0N1cmFjYW8Hy///x8AAA0FTVAAAAAA=");
c("America/Danmarkshavn","ABRBbWVyaWNhL0Rhbm1hcmtzaGF2bgfMAAAAAAADR01UAAAAAAfL///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDICbAAAAAAOEHUIbAAAAAAOEHU=");
c("America/Dawson","AA5BbWVyaWNhL0Rhd3NvbgfX//+PgAADUFNUAAAOEAADUERUAj4ACAAAHCB3Cj4AAQAAHCB3B8v//4+AAANQU1QAAA4QAANQRFQDPgABAAAcIHcJbAAAAAAcIHc=");
c("America/Dawson_Creek","ABRBbWVyaWNhL0Rhd3Nvbl9DcmVlawfL//+dkAADTVNUAAAAAA==");
c("America/Denver","AA5BbWVyaWNhL0RlbnZlcgfX//+dkAADTVNUAAAOEAADTURUAj4ACAAAHCB3Cj4AAQAAHCB3B8v//52QAANNU1QAAA4QAANNRFQDPgABAAAcIHcJbAAAAAAcIHc=");
c("America/Detroit","AA9BbWVyaWNhL0RldHJvaXQH1///ubAAA0VTVAAADhAAA0VEVAI+AAgAABwgdwo+AAEAABwgdwfL//+5sAADRVNUAAAOEAADRURUAz4AAQAAHCB3CWwAAAAAHCB3");
c("America/Edmonton","ABBBbWVyaWNhL0VkbW9udG9uB9f//52QAANNU1QAAA4QAANNRFQCPgAIAAAcIHcKPgABAAAcIHcHy///nZAAA01TVAAADhAAA01EVAM+AAEAABwgdwlsAAAAABwgdw==");
c("America/Eirunepe","ABBBbWVyaWNhL0VpcnVuZXBlB93//7mwAAMtMDUAAAAAB9j//8fAAAMtMDQAAAAAB8v//7mwAAMtMDUAAAAA");
c("America/El_Salvador","ABNBbWVyaWNhL0VsX1NhbHZhZG9yB8v//6ugAANDU1QAAAAA");
c("America/Fort_Nelson","ABNBbWVyaWNhL0ZvcnRfTmVsc29uB9///52QAANNU1QAAAAAB9f//4+AAANQU1QAAA4QAANQRFQCPgAIAAAcIHcKPgABAAAcIHcHy///j4AAA1BTVAAADhAAA1BEVAM+AAEAABwgdwlsAAAAABwgdw==");
c("America/Fortaleza","ABFBbWVyaWNhL0ZvcnRhbGV6YQfS///V0AADLTAzAAAAAAfR///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJPgAIAAAAAHcBPgAPAAAAAHcH0P//1dAAAy0wMwAAAAAHz///1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCWQAAwAAAAB3AWQAFQAAAAB3B8v//9XQAAMtMDMAAAAA");
c("America/Glace_Bay","ABFBbWVyaWNhL0dsYWNlX0JheQfX///HwAADQVNUAAAOEAADQURUAj4ACAAAHCB3Cj4AAQAAHCB3B8v//8fAAANBU1QAAA4QAANBRFQDPgABAAAcIHcJbAAAAAAcIHc=");
c("America/Godthab","AA9BbWVyaWNhL0dvZHRoYWIHzP//1dAABy0wMy8tMDIAAA4QAActMDMvLTAyAmwAAAAADhB1CWwAAAAADhB1B8v//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMgJsAAAAAA4QdQhsAAAAAA4QdQ==");
c("America/Goose_Bay","ABFBbWVyaWNhL0dvb3NlX0JheQfb///HwAADQVNUAAAOEAADQURUAj4ACAAAHCB3Cj4AAQAAHCB3B9f//8fAAANBU1QAAA4QAANBRFQCPgAIAAAAPHcKPgABAAAAPHcHy///x8AAA0FTVAAADhAAA0FEVAM+AAEAAAA8dwlsAAAAAAA8dw==");
c("America/Grand_Turk","ABJBbWVyaWNhL0dyYW5kX1R1cmsH4v//ubAAA0VTVAAADhAAA0VEVAI+AAgAABwgdwo+AAEAABwgdwff///HwAADQVNUAAAAAAfX//+5sAADRVNUAAAOEAADRURUAj4ACAAAHCB3Cj4AAQAAHCB3B8v//7mwAANFU1QAAA4QAANFRFQDPgABAAAcIHcJbAAAAAAcIHc=");
c("America/Guatemala","ABFBbWVyaWNhL0d1YXRlbWFsYQfX//+roAADQ1NUAAAAAAfW//+roAADQ1NUAAAOEAADQ0RUA2QAHgAAAAB3CWQAAQAAAAB3B8v//6ugAANDU1QAAAAA");
c("America/Guayaquil","ABFBbWVyaWNhL0d1YXlhcXVpbAfL//+5sAAHLTA1Ly0wNAAAAAA=");
c("America/Guyana","AA5BbWVyaWNhL0d1eWFuYQfL///HwAADLTA0AAAAAA==");
c("America/Halifax","AA9BbWVyaWNhL0hhbGlmYXgH1///x8AAA0FTVAAADhAAA0FEVAI+AAgAABwgdwo+AAEAABwgdwfL///HwAADQVNUAAAOEAADQURUAz4AAQAAHCB3CWwAAAAAHCB3");
c("America/Havana","AA5BbWVyaWNhL0hhdmFuYQfd//+5sAADQ1NUAAAOEAADQ0RUAj4ACAAAAABzCj4AAQAAAABzB9z//7mwAANDU1QAAA4QAANDRFQDZAABAAAAAHMKPgABAAAAAHMH2///ubAAA0NTVAAADhAAA0NEVAI+AA8AAAAAcwpkAA0AAAAAcwfZ//+5sAADQ1NUAAAOEAADQ0RUAj4ACAAAAABzCWwAAAAAAABzB9j//7mwAANDU1QAAA4QAANDRFQCPgAPAAAAAHMJbAAAAAAAAHMH1///ubAAA0NTVAAADhAAA0NEVAI+AAgAAAAAcwlsAAAAAAAAcwfU//+5sAADQ1NUAAAAAAfQ//+5sAADQ1NUAAAOEAADQ0RUAz4AAQAAAABzCWwAAAAAAABzB87//7mwAANDU1QAAA4QAANDRFQCbAAAAAAAAHMJbAAAAAAAAHMHzf//ubAAA0NTVAAADhAAA0NEVAM+AAEAAAAAdwlkAAwAAAAAcwfM//+5sAADQ1NUAAAOEAADQ0RUAz4AAQAAAAB3CWQABgAAAABzB8v//7mwAANDU1QAAA4QAANDRFQDPgABAAAAAHcJPgAIAAAAAHM=");
c("America/Hermosillo","ABJBbWVyaWNhL0hlcm1vc2lsbG8Hz///nZAAA01TVAAAAAAHzP//nZAAA01TVAAADhAAA01EVAM+AAEAABwgdwlsAAAAABwgdwfL//+dkAADTVNUAAAAAA==");
c("America/Indiana/Indianapolis","ABxBbWVyaWNhL0luZGlhbmEvSW5kaWFuYXBvbGlzB9f//7mwAANFU1QAAA4QAANFRFQCPgAIAAAcIHcKPgABAAAcIHcH1v//ubAAA0VTVAAADhAAA0VEVAM+AAEAABwgdwlsAAAAABwgdwfL//+5sAADRVNUAAAAAA==");
c("America/Inuvik","AA5BbWVyaWNhL0ludXZpawfX//+dkAADTVNUAAAOEAADTURUAj4ACAAAHCB3Cj4AAQAAHCB3B8v//52QAANNU1QAAA4QAANNRFQDPgABAAAcIHcJbAAAAAAcIHc=");
c("America/Iqaluit","AA9BbWVyaWNhL0lxYWx1aXQH1///ubAAA0VTVAAADhAAA0VEVAI+AAgAABwgdwo+AAEAABwgdwfQ//+5sAADRVNUAAAOEAADRURUAz4AAQAAHCB3CWwAAAAAHCB3B8///6ugAANDU1QAAA4QAANDRFQDPgABAAAcIHcJbAAAAAAcIHcHy///ubAAA0VTVAAADhAAA0VEVAM+AAEAABwgdwlsAAAAABwgdw==");
c("America/Jamaica","AA9BbWVyaWNhL0phbWFpY2EHy///ubAAA0VTVAAAAAA=");
c("America/Argentina/Jujuy","ABdBbWVyaWNhL0FyZ2VudGluYS9KdWp1eQfY///V0AADLTAzAAAAAAfQ///V0AAHLTAzLy0wMgAAAAAHz///x8AABy0wNC8tMDMAAAAAB8v//9XQAActMDMvLTAyAAAAAA==");
c("America/Juneau","AA5BbWVyaWNhL0p1bmVhdQfX//+BcAAEQUtTVAAADhAABEFLRFQCPgAIAAAcIHcKPgABAAAcIHcHy///gXAABEFLU1QAAA4QAARBS0RUAz4AAQAAHCB3CWwAAAAAHCB3");
c("America/Indiana/Knox","ABRBbWVyaWNhL0luZGlhbmEvS25veAfX//+roAADQ1NUAAAOEAADQ0RUAj4ACAAAHCB3Cj4AAQAAHCB3B9b//6ugAANDU1QAAA4QAANDRFQDPgABAAAcIHcJbAAAAAAcIHcHy///ubAAA0VTVAAAAAA=");
c("America/La_Paz","AA5BbWVyaWNhL0xhX1BhegfL///HwAADLTA0AAAAAA==");
c("America/Argentina/La_Rioja","ABpBbWVyaWNhL0FyZ2VudGluYS9MYV9SaW9qYQfY///V0AADLTAzAAAAAAfU///V0AAHLTAzLy0wMgAAAAAH0P//1dAAAy0wMwAAAAAHz///x8AABy0wNC8tMDMAAAAAB8v//9XQAActMDMvLTAyAAAAAA==");
c("America/Lima","AAxBbWVyaWNhL0xpbWEHy///ubAABy0wNS8tMDQAAAAA");
c("America/Los_Angeles","ABNBbWVyaWNhL0xvc19BbmdlbGVzB9f//4+AAANQU1QAAA4QAANQRFQCPgAIAAAcIHcKPgABAAAcIHcHy///j4AAA1BTVAAADhAAA1BEVAM+AAEAABwgdwlsAAAAABwgdw==");
c("America/Kentucky/Louisville","ABtBbWVyaWNhL0tlbnR1Y2t5L0xvdWlzdmlsbGUH1///ubAAA0VTVAAADhAAA0VEVAI+AAgAABwgdwo+AAEAABwgdwfL//+5sAADRVNUAAAOEAADRURUAz4AAQAAHCB3CWwAAAAAHCB3");
c("America/Maceio","AA5BbWVyaWNhL01hY2VpbwfS///V0AADLTAzAAAAAAfR///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJPgAIAAAAAHcBPgAPAAAAAHcH0P//1dAAAy0wMwAAAAAHz///1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCWQAAwAAAAB3AWQAFQAAAAB3B8z//9XQAAMtMDMAAAAAB8v//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMgk+AAsAAAAAdwE+AA8AAAAAdw==");
c("America/Managua","AA9BbWVyaWNhL01hbmFndWEH1///q6AAA0NTVAAAAAAH1v//q6AAA0NTVAAADhAAA0NEVANkAB4AABwgdwk+AAEAAA4QdwfV//+roAADQ1NUAAAOEAADQ0RUA2QACgAAAAB3CT4AAQAAAAB3B83//6ugAANDU1QAAAAAB8v//7mwAANFU1QAAAAA");
c("America/Manaus","AA5BbWVyaWNhL01hbmF1cwfL///HwAADLTA0AAAAAA==");
c("America/Indiana/Marengo","ABdBbWVyaWNhL0luZGlhbmEvTWFyZW5nbwfX//+5sAADRVNUAAAOEAADRURUAj4ACAAAHCB3Cj4AAQAAHCB3B9b//7mwAANFU1QAAA4QAANFRFQDPgABAAAcIHcJbAAAAAAcIHcHy///ubAAA0VTVAAAAAA=");
c("America/Martinique","ABJBbWVyaWNhL01hcnRpbmlxdWUHy///x8AAA0FTVAAAAAA=");
c("America/Matamoros","ABFBbWVyaWNhL01hdGFtb3Jvcwfa//+roAADQ1NUAAAOEAADQ0RUAj4ACAAAHCB3Cj4AAQAAHCB3B9L//6ugAANDU1QAAA4QAANDRFQDPgABAAAcIHcJbAAAAAAcIHcH0f//q6AAA0NTVAAADhAAA0NEVAQ+AAEAABwgdwhsAAAAABwgdwfM//+roAADQ1NUAAAOEAADQ0RUAz4AAQAAHCB3CWwAAAAAHCB3B8v//6ugAANDU1QAAAAA");
c("America/Mazatlan","ABBBbWVyaWNhL01hemF0bGFuB9L//52QAANNU1QAAA4QAANNRFQDPgABAAAcIHcJbAAAAAAcIHcH0f//nZAAA01TVAAADhAAA01EVAQ+AAEAABwgdwhsAAAAABwgdwfM//+dkAADTVNUAAAOEAADTURUAz4AAQAAHCB3CWwAAAAAHCB3B8v//52QAANNU1QAAAAA");
c("America/Argentina/Mendoza","ABlBbWVyaWNhL0FyZ2VudGluYS9NZW5kb3phB9j//9XQAAMtMDMAAAAAB9T//9XQAActMDMvLTAyAAAAAAfQ///V0AADLTAzAAAAAAfP///HwAAHLTA0Ly0wMwAAAAAHy///1dAABy0wMy8tMDIAAAAA");
c("America/Menominee","ABFBbWVyaWNhL01lbm9taW5lZQfX//+roAADQ1NUAAAOEAADQ0RUAj4ACAAAHCB3Cj4AAQAAHCB3B8v//6ugAANDU1QAAA4QAANDRFQDPgABAAAcIHcJbAAAAAAcIHc=");
c("America/Merida","AA5BbWVyaWNhL01lcmlkYQfS//+roAADQ1NUAAAOEAADQ0RUAz4AAQAAHCB3CWwAAAAAHCB3B9H//6ugAANDU1QAAA4QAANDRFQEPgABAAAcIHcIbAAAAAAcIHcHzP//q6AAA0NTVAAADhAAA0NEVAM+AAEAABwgdwlsAAAAABwgdwfL//+roAADQ1NUAAAAAA==");
c("America/Metlakatla","ABJBbWVyaWNhL01ldGxha2F0bGEH4///gXAABEFLU1QAAA4QAARBS0RUAj4ACAAAHCB3Cj4AAQAAHCB3B+L//4+AAANQU1QAAAAAB9///4FwAARBS1NUAAAOEAAEQUtEVAI+AAgAABwgdwo+AAEAABwgdwfL//+PgAADUFNUAAAAAA==");
c("America/Mexico_City","ABNBbWVyaWNhL01leGljb19DaXR5B9L//6ugAANDU1QAAA4QAANDRFQDPgABAAAcIHcJbAAAAAAcIHcH0f//q6AAA0NTVAAAAAAHzP//q6AAA0NTVAAADhAAA0NEVAM+AAEAABwgdwlsAAAAABwgdwfL//+roAADQ1NUAAAAAA==");
c("America/Miquelon","ABBBbWVyaWNhL01pcXVlbG9uB9f//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMgI+AAgAABwgdwo+AAEAABwgdwfL///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIDPgABAAAcIHcJbAAAAAAcIHc=");
c("America/Moncton","AA9BbWVyaWNhL01vbmN0b24H1///x8AAA0FTVAAADhAAA0FEVAI+AAgAABwgdwo+AAEAABwgdwfL///HwAADQVNUAAAOEAADQURUAz4AAQAAADx3CWwAAAAAADx3");
c("America/Monterrey","ABFBbWVyaWNhL01vbnRlcnJleQfS//+roAADQ1NUAAAOEAADQ0RUAz4AAQAAHCB3CWwAAAAAHCB3B9H//6ugAANDU1QAAA4QAANDRFQEPgABAAAcIHcIbAAAAAAcIHcHzP//q6AAA0NTVAAADhAAA0NEVAM+AAEAABwgdwlsAAAAABwgdwfL//+roAADQ1NUAAAAAA==");
c("America/Montevideo","ABJBbWVyaWNhL01vbnRldmlkZW8H3///1dAABy0wMy8tMDIAAAAAB9b//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMgk+AAEAABwgdwI+AAgAABwgdwfV///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJZAAJAAAcIHcCZAAbAAAcIHcHy///1dAABy0wMy8tMDIAAAAA");
c("America/Kentucky/Monticello","ABtBbWVyaWNhL0tlbnR1Y2t5L01vbnRpY2VsbG8H1///ubAAA0VTVAAADhAAA0VEVAI+AAgAABwgdwo+AAEAABwgdwfQ//+5sAADRVNUAAAOEAADRURUAz4AAQAAHCB3CWwAAAAAHCB3B8v//6ugAANDU1QAAA4QAANDRFQDPgABAAAcIHcJbAAAAAAcIHc=");
c("America/Nassau","AA5BbWVyaWNhL05hc3NhdQfX//+5sAADRVNUAAAOEAADRURUAj4ACAAAHCB3Cj4AAQAAHCB3B8v//7mwAANFU1QAAA4QAANFRFQDPgABAAAcIHcJbAAAAAAcIHc=");
c("America/North_Dakota/New_Salem","AB5BbWVyaWNhL05vcnRoX0Rha290YS9OZXdfU2FsZW0H1///q6AAA0NTVAAADhAAA0NEVAI+AAgAABwgdwo+AAEAABwgdwfT//+roAADQ1NUAAAOEAADQ0RUAz4AAQAAHCB3CWwAAAAAHCB3B8v//52QAANNU1QAAA4QAANNRFQDPgABAAAcIHcJbAAAAAAcIHc=");
c("America/New_York","ABBBbWVyaWNhL05ld19Zb3JrB9f//7mwAANFU1QAAA4QAANFRFQCPgAIAAAcIHcKPgABAAAcIHcHy///ubAAA0VTVAAADhAAA0VEVAM+AAEAABwgdwlsAAAAABwgdw==");
c("America/Nipigon","AA9BbWVyaWNhL05pcGlnb24H1///ubAAA0VTVAAADhAAA0VEVAI+AAgAABwgdwo+AAEAABwgdwfL//+5sAADRVNUAAAOEAADRURUAz4AAQAAHCB3CWwAAAAAHCB3");
c("America/Nome","AAxBbWVyaWNhL05vbWUH1///gXAABEFLU1QAAA4QAARBS0RUAj4ACAAAHCB3Cj4AAQAAHCB3B8v//4FwAARBS1NUAAAOEAAEQUtEVAM+AAEAABwgdwlsAAAAABwgdw==");
c("America/Noronha","AA9BbWVyaWNhL05vcm9uaGEH0v//4+AAAy0wMgAAAAAH0f//4+AABy0wMi8tMDEAAA4QAActMDIvLTAxCT4ACAAAAAB3AT4ADwAAAAB3B9D//+PgAAMtMDIAAAAAB8///+PgAActMDIvLTAxAAAOEAAHLTAyLy0wMQlkAAMAAAAAdwFkABUAAAAAdwfL///j4AADLTAyAAAAAA==");
c("America/Ojinaga","AA9BbWVyaWNhL09qaW5hZ2EH2v//nZAAA01TVAAADhAAA01EVAI+AAgAABwgdwo+AAEAABwgdwfS//+dkAADTVNUAAAOEAADTURUAz4AAQAAHCB3CWwAAAAAHCB3B9H//52QAANNU1QAAA4QAANNRFQEPgABAAAcIHcIbAAAAAAcIHcHzv//nZAAA01TVAAADhAAA01EVAM+AAEAABwgdwlsAAAAABwgdwfM//+roAADQ1NUAAAOEAADQ0RUAz4AAQAAHCB3CWwAAAAAHCB3B8v//6ugAANDU1QAAAAA");
c("America/Panama","AA5BbWVyaWNhL1BhbmFtYQfL//+5sAADRVNUAAAAAA==");
c("America/Pangnirtung","ABNBbWVyaWNhL1BhbmduaXJ0dW5nB9f//7mwAANFU1QAAA4QAANFRFQCPgAIAAAcIHcKPgABAAAcIHcH0P//ubAAA0VTVAAADhAAA0VEVAM+AAEAABwgdwlsAAAAABwgdwfP//+roAADQ1NUAAAOEAADQ0RUAz4AAQAAHCB3CWwAAAAAHCB3B8v//7mwAANFU1QAAA4QAANFRFQDPgABAAAcIHcJbAAAAAAcIHc=");
c("America/Paramaribo","ABJBbWVyaWNhL1BhcmFtYXJpYm8Hy///1dAAAy0wMwAAAAA=");
c("America/Indiana/Petersburg","ABpBbWVyaWNhL0luZGlhbmEvUGV0ZXJzYnVyZwfX//+5sAADRVNUAAAOEAADRURUAj4ACAAAHCB3Cj4AAQAAHCB3B9b//6ugAANDU1QAAA4QAANDRFQDPgABAAAcIHcJbAAAAAAcIHcHy///ubAAA0VTVAAAAAA=");
c("America/Phoenix","AA9BbWVyaWNhL1Bob2VuaXgHy///nZAAA01TVAAAAAA=");
c("America/Port-au-Prince","ABZBbWVyaWNhL1BvcnQtYXUtUHJpbmNlB+H//7mwAANFU1QAAA4QAANFRFQCPgAIAAAcIHcKPgABAAAcIHcH4P//ubAAA0VTVAAAAAAH3P//ubAAA0VTVAAADhAAA0VEVAI+AAgAABwgdwo+AAEAABwgdwfX//+5sAADRVNUAAAAAAfV//+5sAADRVNUAAAOEAADRURUAz4AAQAAAAB3CWwAAAAAAAB3B87//7mwAANFU1QAAAAAB8v//7mwAANFU1QAAA4QAANFRFQDPgABAAAOEHMJbAAAAAAOEHM=");
c("America/Port_of_Spain","ABVBbWVyaWNhL1BvcnRfb2ZfU3BhaW4Hy///x8AAA0FTVAAAAAA=");
c("America/Porto_Velho","ABNBbWVyaWNhL1BvcnRvX1ZlbGhvB8v//8fAAAMtMDQAAAAA");
c("America/Puerto_Rico","ABNBbWVyaWNhL1B1ZXJ0b19SaWNvB8v//8fAAANBU1QAAAAA");
c("America/Punta_Arenas","ABRBbWVyaWNhL1B1bnRhX0FyZW5hcwfg///V0AADLTAzAAAAAAff///HwAAHLTA0Ly0wMwAAAAAH3P//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCD4AAgAAOEB1Az4AFwAAKjB1B9v//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwc+ABAAADhAdQQ+AAIAACowdQfa///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgAJAAA4QHUDPgABAAAqMHUH2f//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ACQAAOEB1Aj4ACQAAKjB1B9j//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwk+AAkAADhAdQJkAB4AACowdQfQ///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgAJAAA4QHUCPgAJAAAqMHUHz///x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ACQAAOEB1A2QABAAAKjB1B87//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwhkABsAADhAdQI+AAkAACowdQfN///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgAJAAA4QHUCZAAeAAAqMHUHy///x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ACQAAOEB1Aj4ACQAAKjB1");
c("America/Rainy_River","ABNBbWVyaWNhL1JhaW55X1JpdmVyB9f//6ugAANDU1QAAA4QAANDRFQCPgAIAAAcIHcKPgABAAAcIHcHy///q6AAA0NTVAAADhAAA0NEVAM+AAEAABwgdwlsAAAAABwgdw==");
c("America/Rankin_Inlet","ABRBbWVyaWNhL1Jhbmtpbl9JbmxldAfX//+roAADQ1NUAAAOEAADQ0RUAj4ACAAAHCB3Cj4AAQAAHCB3B9H//6ugAANDU1QAAA4QAANDRFQDPgABAAAcIHcJbAAAAAAcIHcH0P//ubAAA0VTVAAAAAAHy///q6AAA0NTVAAADhAAA0NEVAM+AAEAABwgdwlsAAAAABwgdw==");
c("America/Recife","AA5BbWVyaWNhL1JlY2lmZQfS///V0AADLTAzAAAAAAfR///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJPgAIAAAAAHcBPgAPAAAAAHcH0P//1dAAAy0wMwAAAAAHz///1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCWQAAwAAAAB3AWQAFQAAAAB3B8v//9XQAAMtMDMAAAAA");
c("America/Regina","AA5BbWVyaWNhL1JlZ2luYQfL//+roAADQ1NUAAAAAA==");
c("America/Resolute","ABBBbWVyaWNhL1Jlc29sdXRlB9f//6ugAANDU1QAAA4QAANDRFQCPgAIAAAcIHcKPgABAAAcIHcH1v//ubAAA0VTVAAAAAAH0f//q6AAA0NTVAAADhAAA0NEVAM+AAEAABwgdwlsAAAAABwgdwfQ//+5sAADRVNUAAAAAAfL//+roAADQ1NUAAAOEAADQ0RUAz4AAQAAHCB3CWwAAAAAHCB3");
c("America/Rio_Branco","ABJBbWVyaWNhL1Jpb19CcmFuY28H3f//ubAAAy0wNQAAAAAH2P//x8AAAy0wNAAAAAAHy///ubAAAy0wNQAAAAA=");
c("America/Argentina/Rio_Gallegos","AB5BbWVyaWNhL0FyZ2VudGluYS9SaW9fR2FsbGVnb3MH2P//1dAAAy0wMwAAAAAH1P//1dAABy0wMy8tMDIAAAAAB9D//9XQAAMtMDMAAAAAB8///8fAAActMDQvLTAzAAAAAAfL///V0AAHLTAzLy0wMgAAAAA=");
c("America/Argentina/Salta","ABdBbWVyaWNhL0FyZ2VudGluYS9TYWx0YQfY///V0AADLTAzAAAAAAfQ///V0AAHLTAzLy0wMgAAAAAHz///x8AABy0wNC8tMDMAAAAAB8v//9XQAActMDMvLTAyAAAAAA==");
c("America/Argentina/San_Juan","ABpBbWVyaWNhL0FyZ2VudGluYS9TYW5fSnVhbgfY///V0AADLTAzAAAAAAfU///V0AAHLTAzLy0wMgAAAAAH0P//1dAAAy0wMwAAAAAHz///x8AABy0wNC8tMDMAAAAAB8v//9XQAActMDMvLTAyAAAAAA==");
c("America/Argentina/San_Luis","ABpBbWVyaWNhL0FyZ2VudGluYS9TYW5fTHVpcwfZ///V0AADLTAzAAAAAAfY///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgAIAAAAAHcCPgAIAAAAAHcH1P//1dAABy0wMy8tMDIAAAAAB9D//9XQAAMtMDMAAAAAB8///8fAAAMtMDMAAAAAB8v//9XQAAMtMDMAAAAA");
c("America/Santarem","ABBBbWVyaWNhL1NhbnRhcmVtB9j//9XQAAMtMDMAAAAAB8v//8fAAAMtMDQAAAAA");
c("America/Santiago","ABBBbWVyaWNhL1NhbnRpYWdvB+P//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwg+AAIAADhAdQM+AAIAACowdQfg///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMHPgAJAAA4QHUEPgAJAAAqMHUH3///x8AABy0wNC8tMDMAAAAAB9z//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwg+AAIAADhAdQM+ABcAACowdQfb///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMHPgAQAAA4QHUEPgACAAAqMHUH2v//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ACQAAOEB1Az4AAQAAKjB1B9n//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwk+AAkAADhAdQI+AAkAACowdQfY///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgAJAAA4QHUCZAAeAAAqMHUH0P//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ACQAAOEB1Aj4ACQAAKjB1B8///8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwk+AAkAADhAdQNkAAQAACowdQfO///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMIZAAbAAA4QHUCPgAJAAAqMHUHzf//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ACQAAOEB1AmQAHgAAKjB1B8v//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwk+AAkAADhAdQI+AAkAACowdQ==");
c("America/Santo_Domingo","ABVBbWVyaWNhL1NhbnRvX0RvbWluZ28H0P//x8AAA0FTVAAAAAAHy///x8AAA0FTVAAAAAA=");
c("America/Sao_Paulo","ABFBbWVyaWNhL1Nhb19QYXVsbwfj///V0AAHLTAzLy0wMgAAAAAH4v//1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCj4AAQAAAAB3AT4ADwAAAAB3B+D//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMgk+AA8AAAAAdwE+AA8AAAAAdwff///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJPgAPAAAAAHcBPgAWAAAAAHcH3f//1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCT4ADwAAAAB3AT4ADwAAAAB3B9z//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMgk+AA8AAAAAdwE+ABYAAAAAdwfY///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJPgAPAAAAAHcBPgAPAAAAAHcH1///1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCT4ACAAAAAB3AWQAGQAAAAB3B9b//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMgpkAAUAAAAAdwE+AA8AAAAAdwfV///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJZAAQAAAAAHcBPgAPAAAAAHcH1P//1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCmQAAgAAAAB3AT4ADwAAAAB3B9P//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMglkABMAAAAAdwE+AA8AAAAAdwfS///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIKZAADAAAAAHcBPgAPAAAAAHcH0f//1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCT4ACAAAAAB3AT4ADwAAAAB3B9D//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMgk+AAgAAAAAdwFkABsAAAAAdwfP///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJZAADAAAAAHcBZAAVAAAAAHcHzv//1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCWQACwAAAAB3AmQAAQAAAAB3B83//9XQAActMDMvLTAyAAAOEAAHLTAzLy0wMglkAAYAAAAAdwFkABAAAAAAdwfM///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJZAAGAAAAAHcBZAALAAAAAHcHy///1dAABy0wMy8tMDIAAA4QAActMDMvLTAyCT4ACwAAAAB3AT4ADwAAAAB3");
c("America/Scoresbysund","ABRBbWVyaWNhL1Njb3Jlc2J5c3VuZAfM///x8AAHLTAxLyswMAAADhAABy0wMS8rMDACbAAAAAAOEHUJbAAAAAAOEHUHy///8fAABy0wMS8rMDAAAA4QAActMDEvKzAwAmwAAAAADhB1CGwAAAAADhB1");
c("America/Sitka","AA1BbWVyaWNhL1NpdGthB9f//4FwAARBS1NUAAAOEAAEQUtEVAI+AAgAABwgdwo+AAEAABwgdwfL//+BcAAEQUtTVAAADhAABEFLRFQDPgABAAAcIHcJbAAAAAAcIHc=");
c("America/St_Johns","ABBBbWVyaWNhL1N0X0pvaG5zB9v//87IAANOU1QAAA4QAANORFQCPgAIAAAcIHcKPgABAAAcIHcH1///zsgAA05TVAAADhAAA05EVAI+AAgAAAA8dwo+AAEAAAA8dwfL///OyAADTlNUAAAOEAADTkRUAz4AAQAAADx3CWwAAAAAADx3");
c("America/Swift_Current","ABVBbWVyaWNhL1N3aWZ0X0N1cnJlbnQHy///q6AAA0NTVAAAAAA=");
c("America/Tegucigalpa","ABNBbWVyaWNhL1RlZ3VjaWdhbHBhB9f//6ugAANDU1QAAAAAB9b//6ugAANDU1QAAA4QAANDRFQEPgABAAAAAHcHPgEBAAAAAHcHy///q6AAA0NTVAAAAAA=");
c("America/Indiana/Tell_City","ABlBbWVyaWNhL0luZGlhbmEvVGVsbF9DaXR5B9f//6ugAANDU1QAAA4QAANDRFQCPgAIAAAcIHcKPgABAAAcIHcH1v//q6AAA0NTVAAADhAAA0NEVAM+AAEAABwgdwlsAAAAABwgdwfL//+5sAADRVNUAAAAAA==");
c("America/Thule","AA1BbWVyaWNhL1RodWxlB9f//8fAAANBU1QAAA4QAANBRFQCPgAIAAAcIHcKPgABAAAcIHcHy///x8AAA0FTVAAADhAAA0FEVAM+AAEAABwgdwlsAAAAABwgdw==");
c("America/Thunder_Bay","ABNBbWVyaWNhL1RodW5kZXJfQmF5B9f//7mwAANFU1QAAA4QAANFRFQCPgAIAAAcIHcKPgABAAAcIHcHy///ubAAA0VTVAAADhAAA0VEVAM+AAEAABwgdwlsAAAAABwgdw==");
c("America/Tijuana","AA9BbWVyaWNhL1RpanVhbmEH2v//j4AAA1BTVAAADhAAA1BEVAI+AAgAABwgdwo+AAEAABwgdwfS//+PgAADUFNUAAAOEAADUERUAz4AAQAAHCB3CWwAAAAAHCB3B9H//4+AAANQU1QAAA4QAANQRFQDPgABAAAcIHcJbAAAAAAcIHcHzP//j4AAA1BTVAAADhAAA1BEVAM+AAEAABwgdwlsAAAAABwgdwfL//+PgAADUFNUAAAOEAADUERUAz4AAQAAHCB3CWwAAAAAHCB3");
c("America/Toronto","AA9BbWVyaWNhL1Rvcm9udG8H1///ubAAA0VTVAAADhAAA0VEVAI+AAgAABwgdwo+AAEAABwgdwfL//+5sAADRVNUAAAOEAADRURUAz4AAQAAHCB3CWwAAAAAHCB3");
c("America/Argentina/Tucuman","ABlBbWVyaWNhL0FyZ2VudGluYS9UdWN1bWFuB9n//9XQAActMDMvLTAyAAAAAAfY///V0AAHLTAzLy0wMgAADhAABy0wMy8tMDIJPgAPAAAAAHcCPgAPAAAAAHcH1P//1dAABy0wMy8tMDIAAAAAB9D//9XQAAMtMDMAAAAAB8///8fAAActMDQvLTAzAAAAAAfL///V0AAHLTAzLy0wMgAAAAA=");
c("America/Argentina/Ushuaia","ABlBbWVyaWNhL0FyZ2VudGluYS9Vc2h1YWlhB9j//9XQAAMtMDMAAAAAB9T//9XQAActMDMvLTAyAAAAAAfQ///V0AADLTAzAAAAAAfP///HwAAHLTA0Ly0wMwAAAAAHy///1dAABy0wMy8tMDIAAAAA");
c("America/Vancouver","ABFBbWVyaWNhL1ZhbmNvdXZlcgfX//+PgAADUFNUAAAOEAADUERUAj4ACAAAHCB3Cj4AAQAAHCB3B8v//4+AAANQU1QAAA4QAANQRFQDPgABAAAcIHcJbAAAAAAcIHc=");
c("America/Indiana/Vevay","ABVBbWVyaWNhL0luZGlhbmEvVmV2YXkH1///ubAAA0VTVAAADhAAA0VEVAI+AAgAABwgdwo+AAEAABwgdwfW//+5sAADRVNUAAAOEAADRURUAz4AAQAAHCB3CWwAAAAAHCB3B8v//7mwAANFU1QAAAAA");
c("America/Indiana/Vincennes","ABlBbWVyaWNhL0luZGlhbmEvVmluY2VubmVzB9f//7mwAANFU1QAAA4QAANFRFQCPgAIAAAcIHcKPgABAAAcIHcH1v//q6AAA0NTVAAADhAAA0NEVAM+AAEAABwgdwlsAAAAABwgdwfL//+5sAADRVNUAAAAAA==");
c("America/Whitehorse","ABJBbWVyaWNhL1doaXRlaG9yc2UH1///j4AAA1BTVAAADhAAA1BEVAI+AAgAABwgdwo+AAEAABwgdwfL//+PgAADUFNUAAAOEAADUERUAz4AAQAAHCB3CWwAAAAAHCB3");
c("America/Indiana/Winamac","ABdBbWVyaWNhL0luZGlhbmEvV2luYW1hYwfX//+5sAADRVNUAAAOEAADRURUAj4ACAAAHCB3Cj4AAQAAHCB3B9b//6ugAANDU1QAAA4QAANDRFQDPgABAAAcIHcJbAAAAAAcIHcHy///ubAAA0VTVAAAAAA=");
c("America/Winnipeg","ABBBbWVyaWNhL1dpbm5pcGVnB9f//6ugAANDU1QAAA4QAANDRFQCPgAIAAAcIHcKPgABAAAcIHcH1v//q6AAA0NTVAAADhAAA0NEVAM+AAEAABwgdwlsAAAAABwgdwfL//+roAADQ1NUAAAOEAADQ0RUAz4AAQAAHCBzCWwAAAAAHCBz");
c("America/Yakutat","AA9BbWVyaWNhL1lha3V0YXQH1///gXAABEFLU1QAAA4QAARBS0RUAj4ACAAAHCB3Cj4AAQAAHCB3B8v//4FwAARBS1NUAAAOEAAEQUtEVAM+AAEAABwgdwlsAAAAABwgdw==");
c("America/Yellowknife","ABNBbWVyaWNhL1llbGxvd2tuaWZlB9f//52QAANNU1QAAA4QAANNRFQCPgAIAAAcIHcKPgABAAAcIHcHy///nZAAA01TVAAADhAAA01EVAM+AAEAABwgdwlsAAAAABwgdw==");
c("Indian/Chagos","AA1JbmRpYW4vQ2hhZ29zB8wAAFRgAAMrMDYAAAAAB8sAAEZQAAMrMDUAAAAA");
c("Indian/Christmas","ABBJbmRpYW4vQ2hyaXN0bWFzB8sAAGJwAAMrMDcAAAAA");
c("Indian/Cocos","AAxJbmRpYW4vQ29jb3MHywAAW2gABSswNjMwAAAAAA==");
c("Indian/Kerguelen","ABBJbmRpYW4vS2VyZ3VlbGVuB8sAAEZQAAMrMDUAAAAA");
c("Indian/Mahe","AAtJbmRpYW4vTWFoZQfLAAA4QAADKzA0AAAAAA==");
c("Indian/Maldives","AA9JbmRpYW4vTWFsZGl2ZXMHywAARlAAAyswNQAAAAA=");
c("Indian/Mauritius","ABBJbmRpYW4vTWF1cml0aXVzB8sAADhAAAcrMDQvKzA1AAAAAA==");
c("Indian/Reunion","AA5JbmRpYW4vUmV1bmlvbgfLAAA4QAADKzA0AAAAAA==");
c("Antarctica/Casey","ABBBbnRhcmN0aWNhL0Nhc2V5B+IAAHCAAAMrMDgAAAAAB+AAAJqwAAMrMTEAAAAAB9wAAHCAAAMrMDgAAAAAB9sAAJqwAAMrMTEAAAAAB9oAAHCAAAMrMDgAAAAAB9kAAJqwAAMrMTEAAAAAB8sAAHCAAAMrMDgAAAAA");
c("Antarctica/Davis","ABBBbnRhcmN0aWNhL0RhdmlzB9wAAGJwAAMrMDcAAAAAB9sAAEZQAAMrMDUAAAAAB9oAAGJwAAMrMDcAAAAAB9kAAEZQAAMrMDUAAAAAB8sAAGJwAAMrMDcAAAAA");
c("Antarctica/DumontDUrville","ABlBbnRhcmN0aWNhL0R1bW9udERVcnZpbGxlB8sAAIygAAMrMTAAAAAA");
c("Antarctica/Macquarie","ABRBbnRhcmN0aWNhL01hY3F1YXJpZQfaAACasAADKzExAAAAAAfYAACMoAAEQUVTVAAADhAABEFFRFQJPgABAAAcIHMDPgABAAAcIHMH1wAAjKAABEFFU1QAAA4QAARBRURUCT4AAQAAHCBzAmwAAAAAHCBzB9YAAIygAARBRVNUAAAOEAAEQUVEVAk+AAEAABwgcwM+AAEAABwgcwfRAACMoAAEQUVTVAAADhAABEFFRFQJPgABAAAcIHMCbAAAAAAcIHMH0AAAjKAABEFFU1QAAA4QAARBRURUB2wAAAAAHCBzAmwAAAAAHCBzB8sAAIygAARBRVNUAAAOEAAEQUVEVAk+AAEAABwgcwJsAAAAABwgcw==");
c("Antarctica/Mawson","ABFBbnRhcmN0aWNhL01hd3NvbgfZAABGUAADKzA1AAAAAAfLAABUYAADKzA2AAAAAA==");
c("Antarctica/Palmer","ABFBbnRhcmN0aWNhL1BhbG1lcgfg///V0AADLTAzAAAAAAff///HwAAHLTA0Ly0wMwAAAAAH3P//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCD4AAgAAOEB1Az4AFwAAKjB1B9v//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwc+ABAAADhAdQQ+AAIAACowdQfa///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgAJAAA4QHUDPgABAAAqMHUH2f//x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ACQAAOEB1Aj4ACQAAKjB1B9j//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwk+AAkAADhAdQJkAB4AACowdQfQ///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgAJAAA4QHUCPgAJAAAqMHUHz///x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ACQAAOEB1A2QABAAAKjB1B87//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwhkABsAADhAdQI+AAkAACowdQfN///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMJPgAJAAA4QHUCZAAeAAAqMHUHy///x8AABy0wNC8tMDMAAA4QAActMDQvLTAzCT4ACQAAOEB1Aj4ACQAAKjB1");
c("Antarctica/Rothera","ABJBbnRhcmN0aWNhL1JvdGhlcmEHy///1dAAAy0wMwAAAAA=");
c("Antarctica/Syowa","ABBBbnRhcmN0aWNhL1N5b3dhB8sAACowAAMrMDMAAAAA");
c("Antarctica/Troll","ABBBbnRhcmN0aWNhL1Ryb2xsB9UAAAAAAAErAAAcIAABKwJsAAAAAA4QdQlsAAAAAA4QdQfLAAAAAAADLTAwAAAAAA==");
c("Antarctica/Vostok","ABFBbnRhcmN0aWNhL1Zvc3RvawfLAABUYAADKzA2AAAAAA==");
c("Australia/Adelaide","ABJBdXN0cmFsaWEvQWRlbGFpZGUH2AAAhZgABEFDU1QAAA4QAARBQ0RUCT4AAQAAHCBzAz4AAQAAHCBzB9cAAIWYAARBQ1NUAAAOEAAEQUNEVAlsAAAAABwgcwJsAAAAABwgcwfWAACFmAAEQUNTVAAADhAABEFDRFQJbAAAAAAcIHMDZAACAAAcIHMHywAAhZgABEFDU1QAAA4QAARBQ0RUCWwAAAAAHCBzAmwAAAAAHCBz");
c("Australia/Brisbane","ABJBdXN0cmFsaWEvQnJpc2JhbmUHywAAjKAABEFFU1QAAAAA");
c("Australia/Broken_Hill","ABVBdXN0cmFsaWEvQnJva2VuX0hpbGwH2AAAhZgABEFDU1QAAA4QAARBQ0RUCT4AAQAAHCBzAz4AAQAAHCBzB9cAAIWYAARBQ1NUAAAOEAAEQUNEVAlsAAAAABwgcwJsAAAAABwgcwfWAACFmAAEQUNTVAAADhAABEFDRFQJbAAAAAAcIHMDZAACAAAcIHMH0AAAhZgABEFDU1QAAA4QAARBQ0RUCWwAAAAAHCBzAmwAAAAAHCBzB8wAAIWYAARBQ1NUAAAOEAAEQUNEVAlsAAAAABwgcwJsAAAAABwgcwfLAACFmAAEQUNTVAAADhAABEFDRFQJbAAAAAAcIHMCPgABAAAcIHM=");
c("Australia/Currie","ABBBdXN0cmFsaWEvQ3VycmllB9gAAIygAARBRVNUAAAOEAAEQUVEVAk+AAEAABwgcwM+AAEAABwgcwfXAACMoAAEQUVTVAAADhAABEFFRFQJPgABAAAcIHMCbAAAAAAcIHMH1gAAjKAABEFFU1QAAA4QAARBRURUCT4AAQAAHCBzAz4AAQAAHCBzB9EAAIygAARBRVNUAAAOEAAEQUVEVAk+AAEAABwgcwJsAAAAABwgcwfQAACMoAAEQUVTVAAADhAABEFFRFQHbAAAAAAcIHMCbAAAAAAcIHMHywAAjKAABEFFU1QAAA4QAARBRURUCT4AAQAAHCBzAmwAAAAAHCBz");
c("Australia/Darwin","ABBBdXN0cmFsaWEvRGFyd2luB8sAAIWYAARBQ1NUAAAAAA==");
c("Australia/Eucla","AA9BdXN0cmFsaWEvRXVjbGEH2QAAewwACyswODQ1LyswOTQ1AAAAAAfXAAB7DAALKzA4NDUvKzA5NDUAAA4QAAsrMDg0NS8rMDk0NQlsAAAAABwgcwJsAAAAABwgcwfLAAB7DAALKzA4NDUvKzA5NDUAAAAA");
c("Australia/Hobart","ABBBdXN0cmFsaWEvSG9iYXJ0B9gAAIygAARBRVNUAAAOEAAEQUVEVAk+AAEAABwgcwM+AAEAABwgcwfXAACMoAAEQUVTVAAADhAABEFFRFQJPgABAAAcIHMCbAAAAAAcIHMH1gAAjKAABEFFU1QAAA4QAARBRURUCT4AAQAAHCBzAz4AAQAAHCBzB9EAAIygAARBRVNUAAAOEAAEQUVEVAk+AAEAABwgcwJsAAAAABwgcwfQAACMoAAEQUVTVAAADhAABEFFRFQHbAAAAAAcIHMCbAAAAAAcIHMHywAAjKAABEFFU1QAAA4QAARBRURUCT4AAQAAHCBzAmwAAAAAHCBz");
c("Australia/Lindeman","ABJBdXN0cmFsaWEvTGluZGVtYW4HywAAjKAABEFFU1QAAAAA");
c("Australia/Lord_Howe","ABNBdXN0cmFsaWEvTG9yZF9Ib3dlB9gAAJOoAAkrMTAzMC8rMTEAAAcIAAkrMTAzMC8rMTEJPgABAAAcIHcDPgABAAAcIHcH1wAAk6gACSsxMDMwLysxMQAABwgACSsxMDMwLysxMQlsAAAAABwgdwJsAAAAABwgdwfWAACTqAAJKzEwMzAvKzExAAAHCAAJKzEwMzAvKzExCWwAAAAAHCB3Az4AAQAAHCB3B9EAAJOoAAkrMTAzMC8rMTEAAAcIAAkrMTAzMC8rMTEJbAAAAAAcIHcCbAAAAAAcIHcH0AAAk6gACSsxMDMwLysxMQAABwgACSsxMDMwLysxMQdsAAAAABwgdwJsAAAAABwgdwfMAACTqAAJKzEwMzAvKzExAAAHCAAJKzEwMzAvKzExCWwAAAAAHCB3AmwAAAAAHCB3B8sAAJOoAAkrMTAzMC8rMTEAAAcIAAkrMTAzMC8rMTEJbAAAAAAcIHcCPgABAAAcIHc=");
c("Australia/Melbourne","ABNBdXN0cmFsaWEvTWVsYm91cm5lB9gAAIygAARBRVNUAAAOEAAEQUVEVAk+AAEAABwgcwM+AAEAABwgcwfXAACMoAAEQUVTVAAADhAABEFFRFQJbAAAAAAcIHMCbAAAAAAcIHMH1gAAjKAABEFFU1QAAA4QAARBRURUCWwAAAAAHCBzAz4AAQAAHCBzB9EAAIygAARBRVNUAAAOEAAEQUVEVAlsAAAAABwgcwJsAAAAABwgcwfQAACMoAAEQUVTVAAADhAABEFFRFQHbAAAAAAcIHMCbAAAAAAcIHMHywAAjKAABEFFU1QAAA4QAARBRURUCWwAAAAAHCBzAmwAAAAAHCBz");
c("Australia/Perth","AA9BdXN0cmFsaWEvUGVydGgH2QAAcIAABEFXU1QAAAAAB9cAAHCAAARBV1NUAAAOEAAEQVdEVAlsAAAAABwgcwJsAAAAABwgcwfLAABwgAAEQVdTVAAAAAA=");
c("Australia/Sydney","ABBBdXN0cmFsaWEvU3lkbmV5B9gAAIygAARBRVNUAAAOEAAEQUVEVAk+AAEAABwgcwM+AAEAABwgcwfXAACMoAAEQUVTVAAADhAABEFFRFQJbAAAAAAcIHMCbAAAAAAcIHMH1gAAjKAABEFFU1QAAA4QAARBRURUCWwAAAAAHCBzAz4AAQAAHCBzB9EAAIygAARBRVNUAAAOEAAEQUVEVAlsAAAAABwgcwJsAAAAABwgcwfQAACMoAAEQUVTVAAADhAABEFFRFQHbAAAAAAcIHMCbAAAAAAcIHMHzAAAjKAABEFFU1QAAA4QAARBRURUCWwAAAAAHCBzAmwAAAAAHCBzB8sAAIygAARBRVNUAAAOEAAEQUVEVAlsAAAAABwgcwI+AAEAABwgcw==");
c("Atlantic/Azores","AA9BdGxhbnRpYy9Bem9yZXMHzP//8fAABy0wMS8rMDAAAA4QAActMDEvKzAwAmwAAAAADhB1CWwAAAAADhB1B8v///HwAActMDEvKzAwAAAOEAAHLTAxLyswMAJsAAAAAA4QdQhsAAAAAA4QdQ==");
c("Atlantic/Bermuda","ABBBdGxhbnRpYy9CZXJtdWRhB9f//8fAAANBU1QAAA4QAANBRFQCPgAIAAAcIHcKPgABAAAcIHcHy///x8AAA0FTVAAADhAAA0FEVAM+AAEAABwgdwlsAAAAABwgdw==");
c("Atlantic/Canary","AA9BdGxhbnRpYy9DYW5hcnkHzAAAAAAAA1dFVAAADhAABFdFU1QCbAAAAAAOEHUJbAAAAAAOEHUHywAAAAAAA1dFVAAADhAABFdFU1QCbAAAAAAOEHUIbAAAAAAOEHU=");
c("Atlantic/Cape_Verde","ABNBdGxhbnRpYy9DYXBlX1ZlcmRlB8v///HwAAMtMDEAAAAA");
c("Atlantic/Faroe","AA5BdGxhbnRpYy9GYXJvZQfMAAAAAAADV0VUAAAOEAAEV0VTVAJsAAAAAA4QdQlsAAAAAA4QdQfLAAAAAAADV0VUAAAOEAAEV0VTVAJsAAAAAA4QdQhsAAAAAA4QdQ==");
c("Atlantic/Madeira","ABBBdGxhbnRpYy9NYWRlaXJhB8wAAAAAAANXRVQAAA4QAARXRVNUAmwAAAAADhB1CWwAAAAADhB1B8sAAAAAAANXRVQAAA4QAARXRVNUAmwAAAAADhB1CGwAAAAADhB1");
c("Atlantic/Reykjavik","ABJBdGxhbnRpYy9SZXlramF2aWsHywAAAAAAA0dNVAAAAAA=");
c("Atlantic/South_Georgia","ABZBdGxhbnRpYy9Tb3V0aF9HZW9yZ2lhB8v//+PgAAMtMDIAAAAA");
c("Atlantic/Stanley","ABBBdGxhbnRpYy9TdGFubGV5B9r//9XQAAMtMDMAAAAAB9H//8fAAActMDQvLTAzAAAOEAAHLTA0Ly0wMwg+AAEAABwgdwM+AA8AABwgdwfL///HwAAHLTA0Ly0wMwAADhAABy0wNC8tMDMIPgAJAAAAAHcDPgAQAAAAAHc=");
const a=TimeZone.__alias;
a("Africa/Asmera","Nairobi");
a("Africa/Timbuktu","Abidjan");
a("America/Argentina/ComodRivadavia","Catamarca");
a("America/Atka","Adak");
a("America/Buenos_Aires","Buenos_Aires");
a("America/Catamarca","Catamarca");
a("America/Coral_Harbour","Atikokan");
a("America/Cordoba","Cordoba");
a("America/Ensenada","Tijuana");
a("America/Fort_Wayne","Indianapolis");
a("America/Indianapolis","Indianapolis");
a("America/Jujuy","Jujuy");
a("America/Knox_IN","Knox");
a("America/Louisville","Louisville");
a("America/Mendoza","Mendoza");
a("America/Montreal","Toronto");
a("America/Porto_Acre","Rio_Branco");
a("America/Rosario","Cordoba");
a("America/Santa_Isabel","Tijuana");
a("America/Shiprock","Denver");
a("America/Virgin","Port_of_Spain");
a("Antarctica/South_Pole","Auckland");
a("Asia/Ashkhabad","Ashgabat");
a("Asia/Calcutta","Kolkata");
a("Asia/Chongqing","Shanghai");
a("Asia/Chungking","Shanghai");
a("Asia/Dacca","Dhaka");
a("Asia/Harbin","Shanghai");
a("Asia/Kashgar","Urumqi");
a("Asia/Katmandu","Kathmandu");
a("Asia/Macao","Macau");
a("Asia/Rangoon","Yangon");
a("Asia/Saigon","Ho_Chi_Minh");
a("Asia/Tel_Aviv","Jerusalem");
a("Asia/Thimbu","Thimphu");
a("Asia/Ujung_Pandang","Makassar");
a("Asia/Ulan_Bator","Ulaanbaatar");
a("Atlantic/Faeroe","Faroe");
a("Atlantic/Jan_Mayen","Oslo");
a("Australia/ACT","Sydney");
a("Australia/Canberra","Sydney");
a("Australia/LHI","Lord_Howe");
a("Australia/NSW","Sydney");
a("Australia/North","Darwin");
a("Australia/Queensland","Brisbane");
a("Australia/South","Adelaide");
a("Australia/Tasmania","Hobart");
a("Australia/Victoria","Melbourne");
a("Australia/West","Perth");
a("Australia/Yancowinna","Broken_Hill");
a("Brazil/Acre","Rio_Branco");
a("Brazil/DeNoronha","Noronha");
a("Brazil/East","Sao_Paulo");
a("Brazil/West","Manaus");
a("Canada/Atlantic","Halifax");
a("Canada/Central","Winnipeg");
a("Canada/Eastern","Toronto");
a("Canada/Mountain","Edmonton");
a("Canada/Newfoundland","St_Johns");
a("Canada/Pacific","Vancouver");
a("Canada/Saskatchewan","Regina");
a("Canada/Yukon","Whitehorse");
a("Chile/Continental","Santiago");
a("Chile/EasterIsland","Easter");
a("Cuba","Havana");
a("Egypt","Cairo");
a("Eire","Dublin");
a("Etc/UCT","UTC");
a("Europe/Belfast","London");
a("Europe/Tiraspol","Chisinau");
a("GB","London");
a("GB-Eire","London");
a("GMT+0","GMT");
a("GMT-0","GMT");
a("GMT0","GMT");
a("Greenwich","GMT");
a("Hongkong","Hong_Kong");
a("Iceland","Reykjavik");
a("Iran","Tehran");
a("Israel","Jerusalem");
a("Japan","Tokyo");
a("Libya","Tripoli");
a("Mexico/BajaNorte","Tijuana");
a("Mexico/BajaSur","Mazatlan");
a("Mexico/General","Mexico_City");
a("NZ","Auckland");
a("NZ-CHAT","Chatham");
a("Navajo","Denver");
a("PRC","Shanghai");
a("Pacific/Johnston","Honolulu");
a("Pacific/Ponape","Pohnpei");
a("Pacific/Samoa","Pago_Pago");
a("Pacific/Truk","Chuuk");
a("Pacific/Yap","Chuuk");
a("Poland","Warsaw");
a("Portugal","Lisbon");
a("ROC","Taipei");
a("ROK","Seoul");
a("Turkey","Istanbul");
a("UCT","UTC");
a("US/Alaska","Anchorage");
a("US/Aleutian","Adak");
a("US/Arizona","Phoenix");
a("US/Central","Chicago");
a("US/East-Indiana","Indianapolis");
a("US/Eastern","New_York");
a("US/Hawaii","Honolulu");
a("US/Indiana-Starke","Knox");
a("US/Michigan","Detroit");
a("US/Mountain","Denver");
a("US/Pacific","Los_Angeles");
a("US/Samoa","Pago_Pago");
a("Universal","UTC");
a("W-SU","Moscow");
a("Zulu","UTC");
Pod.sysPod$ = Pod.find("sys");
DateTime.__boot = DateTime.now();
NumPattern.cache$("00");    NumPattern.cache$("000");       NumPattern.cache$("0000");
NumPattern.cache$("0.0");   NumPattern.cache$("0.00");      NumPattern.cache$("0.000");
NumPattern.cache$("0.#");   NumPattern.cache$("#,###.0");   NumPattern.cache$("#,###.#");
NumPattern.cache$("0.##");  NumPattern.cache$("#,###.00");  NumPattern.cache$("#,###.##");
NumPattern.cache$("0.###"); NumPattern.cache$("#,###.000"); NumPattern.cache$("#,###.###");
NumPattern.cache$("0.0#");  NumPattern.cache$("#,###.0#");  NumPattern.cache$("#,###.0#");
NumPattern.cache$("0.0##"); NumPattern.cache$("#,###.0##"); NumPattern.cache$("#,###.0##");
let m;
m=Map.make(Str.type$,Str.type$);
m.set("dateTime","D-MMM-YYYY WWW hh:mm:ss zzz");
m.set("date","D-MMM-YYYY");
m.set("time","hh:mm");
m.set("float","#,###.0##");
m.set("decimal","#,###.0##");
m.set("int","#,###");
m.set("boolTrue","True");
m.set("boolFalse","False");
m.set("quarter","Quarter");
m.set("numMinus","-");
m.set("numDecimal",".");
m.set("numGrouping",",");
m.set("numPercent","%");
m.set("numPosInf","∞");
m.set("numNegInf","-∞");
m.set("numNaN","�");
m.set("nsAbbr","ns");
m.set("msAbbr","ms");
m.set("secAbbr","sec");
m.set("minAbbr","min");
m.set("hourAbbr","hr");
m.set("dayAbbr","day");
m.set("daysAbbr","days");
m.set("janAbbr","Jan");
m.set("febAbbr","Feb");
m.set("marAbbr","Mar");
m.set("aprAbbr","Apr");
m.set("mayAbbr","May");
m.set("junAbbr","Jun");
m.set("julAbbr","Jul");
m.set("augAbbr","Aug");
m.set("sepAbbr","Sep");
m.set("octAbbr","Oct");
m.set("novAbbr","Nov");
m.set("decAbbr","Dec");
m.set("janFull","January");
m.set("febFull","February");
m.set("marFull","March");
m.set("aprFull","April");
m.set("mayFull","May");
m.set("junFull","June");
m.set("julFull","July");
m.set("augFull","August");
m.set("sepFull","September");
m.set("octFull","October");
m.set("novFull","November");
m.set("decFull","December");
m.set("weekdayStart","sun");
m.set("sunAbbr","Sun");
m.set("monAbbr","Mon");
m.set("tueAbbr","Tue");
m.set("wedAbbr","Wed");
m.set("thuAbbr","Thu");
m.set("friAbbr","Fri");
m.set("satAbbr","Sat");
m.set("sunFull","Sunday");
m.set("monFull","Monday");
m.set("tueFull","Tuesday");
m.set("wedFull","Wednesday");
m.set("thuFull","Thursday");
m.set("friFull","Friday");
m.set("satFull","Saturday");
Env.cur().__props("sys:locale/en.props", m);
m=Map.make(Str.type$,Str.type$);
m.set("dateTime","D-MMM-YYYY WWW k:mm:ssAA zzz");
m.set("time","k:mmAA");
Env.cur().__props("sys:locale/en-US.props", m);
m=Map.make(Str.type$,Str.type$);
m.set("pod.version", "1.0.81");
m.set("pod.depends", "");
p.__meta(m);
DateTime.__boot = DateTime.now();
Duration.__boot = Duration.make(DateTime.boot().ticks());
export {
Obj,
Facet,
Deprecated,
FacetMeta,
Js,
NoDoc,
Operator,
Serializable,
Transient,
TimeZone,
Uri,
Num,
Int,
Err,
ArgErr,
CancelledErr,
CastErr,
ConstErr,
FieldNotSetErr,
IndexErr,
InterruptedErr,
IOErr,
NameErr,
NotImmutableErr,
NullErr,
ParseErr,
ReadonlyErr,
TestErr,
TimeoutErr,
UnknownKeyErr,
UnknownPodErr,
UnknownServiceErr,
UnknownSlotErr,
UnknownFacetErr,
UnknownTypeErr,
UnresolvedErr,
UnsupportedErr,
Unsafe,
Pod,
Void,
Version,
Date,
Enum,
Endian,
Test,
Duration,
Process,
Decimal,
Locale,
This,
StrBuf,
LogRec,
Func,
Range,
Log,
Weekday,
Buf,
MemBuf,
ConstBuf,
Charset,
Zip,
Depend,
Str,
Bool,
MimeType,
Type,
Regex,
OutStream,
SysOutStream,
LogLevel,
Time,
UriScheme,
Month,
DateTime,
List,
FileStore,
LocalFileStore,
Unit,
RegexMatcher,
Slot,
Field,
Method,
Uuid,
InStream,
SysInStream,
File,
LocalFile,
MemFile,
ZipEntryFile,
Env,
BootEnv,
Map,
Param,
Float,
Service,
ObjUtil,
};
