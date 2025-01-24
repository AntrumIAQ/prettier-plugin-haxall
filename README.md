# Setup

### in this repo dir:

```
npm install
rm -rf src/haxall
cp -R node_modules/@haxall/haxall/ src/
git checkout src/haxall/esm/axon.js
git checkout src/haxall/esm/haxall.js
```

### global prettier install:

`sudo npm install -g prettier`

### enable this plugin:

Write `~/.prettierrc` with

```
{
  "printWidth": 120,
  "plugins": [
    "<path to this repo>/src/index.js"
  ]
}
```

### vscode settings:

```
"prettier.documentSelectors": [
    "*.trio"
  ],
"prettier.prettierPath": "/usr/lib/node_modules/prettier"
```

### commandline:

`prettier <path>`
