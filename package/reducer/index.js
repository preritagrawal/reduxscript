#!/usr/bin/env node

// Importing other files
import reducerGenerator  from './reducerGenerator.mjs';

// Executable code
const args = process.argv.slice(2);
reducerGenerator(...args);
