#!/usr/bin/env node

// Importing other files
import epicGenerator from './epicGenerator.mjs';

// Executable code
const args = process.argv.slice(2);
epicGenerator(...args);
