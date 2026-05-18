/**
 * Strips pod-qualified prefixes from Fantom type strings.
 *
 * Examples:
 *   sys::Void          → Void
 *   sys::Obj?          → Obj?
 *   [sys::Str:sys::Int] → [Str:Int]
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
  return result;
}
