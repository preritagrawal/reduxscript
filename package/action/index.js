#!/usr/bin/env node

// Importing other files
import actionGenerator  from './actionGenerator.mjs';

// Executable code
const args = process.argv.slice(2);
actionGenerator(...args);
