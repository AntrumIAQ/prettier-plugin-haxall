/**
 * Strips pod-qualified prefixes from Fantom type strings.
 *
 * Examples:
 *   sys::Void          → Void
 *   sys::Obj?          → Obj?
 *   [sys::Str:sys::Int] → Str:Int   (map shorthand, brackets stripped)
 *   |sys::Int->sys::Str| → |Int->Str|
 *   |sys::Dict[]->sys::Void| → |Dict[]|  (implicit Void return omitted)
 *   unknown::MyClass   → MyClass
 */
export function shortType(qualified) {
  if (qualified == null) return "Obj";
  let result = String(qualified).replace(/\w+::/g, "");
  // Remove implicit ->Void from closure types: |params->Void| → |params|
  // but preserve |->| form for no-param closures: |->Void| → |->|
  result = result.replace(/->Void\|/g, "|");
  if (result.includes("||")) result = result.replace(/\|\|/g, "|->|");
  // Strip outer [ ] from simple map types: [K:V] → K:V
  // Only strip when there are no nested brackets (avoids list-of-map edge cases).
  if (/^\[[^\[\]]+:[^\[\]]+\]$/.test(result)) {
    result = result.slice(1, -1);
  }
  return result;
}
