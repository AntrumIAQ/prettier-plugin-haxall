import { boot } from "../lib/fantom/esm/fantom.js";
import * as compiler from "../lib/fantom/esm/compiler.js";

let bootedSysPromise;

function getSys() {
  if (!bootedSysPromise) {
    bootedSysPromise = boot({ FAN_HOME: "./lib/js" });
  }
  return bootedSysPromise;
}

function makeStrMap(sys) {
  return sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
}

function makeObjMap(sys) {
  return sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
}

function makeTypeDefMap(sys) {
  return sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("compiler::TypeDef"));
}

function makeImportedTypesMap(sys) {
  return sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("compiler::CType[]"));
}

function createPlaceholderRegistry(sys, ns) {
  const pods = new Map();

  function createPod(name) {
    const loc = compiler.Loc.make(`${name}.fan`);
    const pod = compiler.PodDef.make(ns, loc, name);
    pod.meta(makeStrMap(sys));
    pod.index(makeObjMap(sys));
    pod.typeDefs(makeTypeDefMap(sys));
    const unit = compiler.CompilationUnit.make(loc, pod);
    pod.units().add(unit);
    const registry = { pod, unit, types: new Map() };
    pods.set(name, registry);
    return registry;
  }

  function getOrCreatePod(name) {
    return pods.get(name) ?? createPod(name);
  }

  function getOrCreateType(podName, typeName) {
    const registry = getOrCreatePod(podName);
    if (registry.types.has(typeName)) {
      return registry.types.get(typeName);
    }

    const loc = compiler.Loc.make(`${podName}::${typeName}`);
    const type = compiler.TypeDef.make(ns, loc, registry.unit, typeName);
    type.base(ns.objType());
    type.baseSpecified(false);
    registry.pod.typeDefs().set(typeName, type);
    registry.unit.types().add(type);
    registry.types.set(typeName, type);
    return type;
  }

  return { pods, getOrCreatePod, getOrCreateType };
}

function makeCompilerInput(sys, text, filePath) {
  const input = compiler.CompilerInput.make();
  input.podName("prettierFmt");
  input.summary("prettier format");
  input.version(sys.Version.fromStr("0"));
  input.isScript(true);
  input.mode(compiler.CompilerInputMode.str());
  input.output(compiler.CompilerOutputMode.transientPod());
  input.srcStr(text);
  input.srcStrLoc(compiler.Loc.make(filePath ?? "stdin.fan"));
  return input;
}

function addImportedType(sys, importedTypes, type) {
  let list = importedTypes.get(type.name());
  if (list == null) {
    list = sys.List.make(compiler.CType.type$);
    importedTypes.set(type.name(), list);
  }
  list.add(type);
}

function collectPascalCaseIdentifiers(unit) {
  const names = new Set();
  unit.tokens().each((token) => {
    if (token.kind() === compiler.Token.identifier()) {
      const value = String(token.val());
      if (/^[A-Z][A-Za-z0-9_]*$/.test(value)) {
        names.add(value);
      }
    }
    return;
  });
  return names;
}

function installPermissivePodResolver(ns, registry) {
  const originalResolvePod = ns.resolvePod.bind(ns);

  ns.resolvePod = (podName, loc) => {
    try {
      return originalResolvePod(podName, loc);
    } catch {
      return registry.getOrCreatePod(String(podName)).pod;
    }
  };
}

function populateImportedTypes(sys, c, registry) {
  const unit = c.pod().units().first();
  const importedTypes = makeImportedTypesMap(sys);

  c.pod().types().each((type) => {
    addImportedType(sys, importedTypes, type);
    return;
  });

  c.ns().sysPod().types().each((type) => {
    addImportedType(sys, importedTypes, type);
    return;
  });

  unit.usings().each((usingNode) => {
    const podName = String(usingNode.podName());
    const resolvedPod = c.ns().resolvePod(podName, usingNode.loc());
    usingNode.resolvedPod(resolvedPod);

    if (usingNode.typeName() != null) {
      const typeName = String(usingNode.typeName());
      const resolvedType = resolvedPod.resolveType(typeName, false) ?? registry.getOrCreateType(podName, typeName);
      usingNode.resolvedType(resolvedType);
      addImportedType(sys, importedTypes, resolvedType);

      if (usingNode.asName() != null) {
        const aliasList = sys.List.make(compiler.CType.type$);
        aliasList.add(resolvedType);
        importedTypes.set(String(usingNode.asName()), aliasList);
      }
    }

    return;
  });

  for (const name of collectPascalCaseIdentifiers(unit)) {
    if (importedTypes.get(name) == null) {
      addImportedType(sys, importedTypes, registry.getOrCreateType("unknown", name));
    }
  }

  unit.importedTypes(importedTypes);
  return unit;
}

export async function parseFantom(text, { filepath } = {}) {
  const sys = await getSys();
  let unit = null;
  let parseError = null;
  let shebang = null;

  // Strip shebang before parsing so AST positions are correct
  if (text.startsWith("#!")) {
    const nl = text.indexOf("\n");
    shebang = nl !== -1 ? text.slice(0, nl + 1) : text;
    text = nl !== -1 ? text.slice(nl + 1) : "";
  }

  try {
    const input = makeCompilerInput(sys, text, filepath);
    const c = compiler.Compiler.make(input);
    const registry = createPlaceholderRegistry(sys, input.ns());
    installPermissivePodResolver(input.ns(), registry);

    compiler.InitInput.make(c).run();
    compiler.Tokenize.make(c).run();
    compiler.ScanForUsingsAndTypes.make(c).run();

    unit = populateImportedTypes(sys, c, registry);
    const closures = sys.List.make(compiler.ClosureExpr.type$);
    compiler.Parser.make(c, unit, closures).parse();
  } catch (error) {
    parseError = error;
  }

  return {
    type: "FantomProgram",
    unit,
    parseError,
    shebang,
    originalText: text,
    filepath: filepath ?? null,
  };
}
