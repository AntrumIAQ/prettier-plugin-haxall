# prettier-plugin-haxall

A plugin for the [Prettier](https://prettier.io/) opinionated code formatter to support [Haxall](https://haxall.io/) languages - [Axon](https://haxall.io/doc/docHaxall/Axon), [Fantom](https://fantom.org/), [Trio](https://haxall.io/doc/docHaystack/Trio), [Zinc](https://haxall.io/doc/docHaystack/Zinc), etc.

Axon is the initial focus, with just enough Trio and Zinc support to handle Axon in Trio.

Fantom is likely the next focus.

Help wanted!

### Before:
``` trio
name: findMoreDuplicates
func
src:
  () => do
  grid: [].toGrid
  allPts: readAll(point and equipRef).map(pt => {id: pt->id, 
	equipRef: pt->equipRef, stage: pt["stage"], 
	tags: pt.findAll(v => v != null).names.toStr})
  allPts.each pt => do
    res: allPts.findAll( r => pt->tags == r->tags and pt->equipRef == r->equipRef and pt[ "stage"]== r["stage"])
    if (res.size > 1) 
    grid = grid.addRows(res)
  end
  g: grid.unique("id" ) 
  g.addMeta( {count: g.size})
  end
```

### After:
```
name: findMoreDuplicates
func
src:
  () => do
    grid: [].toGrid
    allPts: readAll(point and equipRef).map pt => {
      id:       pt->id,
      equipRef: pt->equipRef,
      stage:    pt["stage"],
      tags:     pt.findAll(v => v != null).names.toStr
    }
    allPts.each pt => do
      res: allPts.findAll r => pt->tags == r->tags and pt->equipRef == r->equipRef and pt["stage"] == r["stage"]
      if (res.size > 1) do
        grid = grid.addRows(res)
      end
    end
    g: grid.unique("id")
    g.addMeta({count: g.size})
  end
```

## Notes

### Trailing commas will force breaks on the end of `list` and `dict`

  ` [1,2,3,]` becomes 
  ```
  [
    1,
    2,
    3,
  ]
  ```

### Manual breaks in parentheticals, binary expressions, and before `else` and `catch` are respected
So these are all left unmodified:


  ```
  readAll(supply and equipRef->space and spaceRef)
  ```

  ```
  readAll(
    supply and equipRef->space and spaceRef
  )
  ```
  ```
  readAll(
    supply and
    equipRef->space and
    spaceRef
  )
  ```

### `do` blocks are added when `if`/`else` clauses are on  new lines
Unmodified:
```
if (4.isOdd) "odd" else "even"
```
`do` blocks added:
```
if (4.isOdd)
  "odd"
else
  "even"
```
becomes:
```
if (4.isOdd) do
  "odd"
else do
  "even"
end
```
# Setup

These instructions are known working on Ubuntu.

### in this repo dir:

```
npm install
rm -rf src/haxall
cp -R node_modules/@haxall/haxall src/
git checkout src/haxall/esm/axon.js
git checkout src/haxall/esm/haystack.js
```
Prettier needs precise code locations of all nodes, so support is injected into the Haxall Axon parser from this repo. A future goal is to work with the Haxall maintainers to achieve native support.

### global prettier install:

`sudo npm install -g prettier`

### enable this plugin:

Write a [Prettier configuration file](https://prettier.io/docs/configuration) (e.g. `~/.prettierrc`) with

```
{
  "printWidth": 120,
  "plugins": [
    "<path to this repo>/src/index.js"
  ]
}
```

### [vscode](https://code.visualstudio.com/) settings:

https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
```
"prettier.documentSelectors": [
    "*.trio"
  ],
"prettier.prettierPath": "/usr/lib/node_modules/prettier"
```

### other editors

https://prettier.io/docs/editors

### commandline:

`prettier <path>`
