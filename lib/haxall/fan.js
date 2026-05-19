#!/usr/bin/env node
import {boot} from './esm/fantom.js';
const sys = await boot();
export {sys};
