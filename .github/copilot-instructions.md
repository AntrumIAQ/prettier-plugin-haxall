# Copilot Instructions

## Commands

```bash
# Format example files (manual smoke test)
npm run trio      # formats examples/trio/example.trio
npm run fantom    # formats examples/fantom/example.fan

# Format a single file via CLI
prettier --plugin ./src/index.js --print-width 120 <file>

# Batch-format all .trio files in a directory
./format-dir.sh <path>
```

There is no build step — the plugin runs directly from `src/`. There is no automated test suite.

## Architecture

This is a [Prettier plugin](https://prettier.io/docs/plugins) supporting three Haxall-ecosystem languages: **Axon** (`.axon`), **Trio** (`.trio`), and **Fantom** (`.fan`).

**Entry point:** `src/index.js` — registers languages, parsers, and printers with Prettier. Also defines `locStart`/`locEnd` (used by Prettier's comment attachment), `printComment`, and the `fantomDebugAstPass` option.

**Axon/Trio pipeline** (`src/axon-parser.js` → `src/axon-formatter.js`):
- The parser wraps the vendored Haxall JS library (`lib/haxall/esm/`) to produce a plain JS AST.
- `AxonTree` wraps `axon.Expr` nodes; `AxonLeaf` wraps literal values.
- Trio files are parsed record-by-record; `src:` fields containing Axon are wrapped in a `TrioSrc` instance so Prettier re-enters the Axon parser for embedded formatting.
- The formatter is a Prettier `print` function that switches on `node._type`.

**Fantom pipeline** (`src/fantom-parser.js` → `src/fantom-formatter.js`):
- The parser wraps the vendored Fantom compiler (`lib/fantom/esm/`) to produce a token stream + AST.
- On parse failure the formatter falls back to returning the original text verbatim.
- `fantomDebugAstPass: true` logs parse outcomes to stderr.

**Vendored dependencies:**
- `lib/haxall/` — copy of `@haxall/haxall` npm package, but **`axon.js` and `haystack.js` are patched** to expose source location data. After `npm install`, restore patches with:
  ```bash
  git checkout lib/haxall/esm/axon.js
  git checkout lib/haxall/esm/haystack.js
  ```
- `lib/fantom/` — output of `fanc js compiler util`, vendored unmodified. Do not edit by hand.

## Key Conventions

**AST node shape:** All AST nodes carry underscore-prefixed metadata fields — `_type`, `_start`, `_end`, `_inParens`, `_args_need_parens`, `_break_if_group`, `_group_id`, `_arg_of_dotcall`. These are listed in `ignoredKeys` in `src/index.js` and excluded from Prettier's tree traversal. When adding new node properties, add any non-traversable ones to `ignoredKeys`.

**`pb` alias:** `prettier/doc`'s `builders` is always imported as `pb` throughout the formatters.

**Respecting manual line breaks:** The Axon formatter inspects `options.originalText` at source positions (`newlinePrior`, `newlineAfter`, `nextCharAcrossLines`) to preserve user-authored breaks inside parentheticals, binary expressions, and before `else`/`catch`.

**`do`/`end` injection:** The Axon formatter adds `do`/`end` blocks when `if`/`else` branches are on new lines — this is intentional formatting behavior, not a bug.

**Trailing comma semantics:** A trailing comma inside a list or dict forces a multi-line break in the output.
