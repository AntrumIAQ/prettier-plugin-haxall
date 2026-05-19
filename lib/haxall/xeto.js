#!/usr/bin/env node
import {sys} from './fan.js';
import * as xetoTools from './esm/xetoTools.js';
const args = sys.List.make(sys.Str.type$, process.argv.slice(2));
xetoTools.Main.main(args);
