import * as sys from './sys.js';
const st = sys.Str.type$;
const i = sys.Map.make(st, sys.List.make(st).typeof());
const ii = sys.Map.make(st, sys.Map.make(st, st.toListOf()).typeof());
const x = (k, v) => i.set(k, sys.List.make(st, v).toImmutable());
const xx = (k, p, v) => {
  const m = () => sys.Map.make(st, st.toListOf());
  ii.getOrAdd(k, m).set(p, sys.List.make(st, v).toImmutable());
}
x("compiler.bridge.java", ["compilerJava::JavaBridge"]);
x("compiler.dsl.sys::Regex", ["compiler::RegexDslPlugin"]);
x("compiler.dsl.sys::Str", ["compiler::StrDslPlugin"]);
x("fanc.cmd", ["nodeJs::JsCmd"]);
x("sys.uriScheme.fan", ["sys::FanScheme"]);
x("sys.uriScheme.file", ["sys::FileScheme"]);
xx("compiler.bridge.java", "compilerJava", ["compilerJava::JavaBridge"]);
xx("compiler.dsl.sys::Str", "compiler", ["compiler::StrDslPlugin"]);
xx("sys.uriScheme.fan", "sys", ["sys::FanScheme"]);
xx("sys.uriScheme.file", "sys", ["sys::FileScheme"]);
xx("compiler.dsl.sys::Regex", "compiler", ["compiler::RegexDslPlugin"]);
xx("fanc.cmd", "nodeJs", ["nodeJs::JsCmd"]);
sys.Env.cur().__loadIndex(i,ii);
