# prettier-plugin-haxall

1. npm install
2. rm -rf src/haxall
3. cp -R node_modules/@haxall/haxall/ src/
4. git checkout src/haxall/esm/axon.js
5. npx prettier --plugin ./src/index.js --print-width 120 <path>
