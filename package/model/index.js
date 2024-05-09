#!/usr/bin/env node

// Importing other files
import modelGenerator from './modelGenerator.mjs';

// Executable code
const args = process.argv.slice(2);
modelGenerator(...args);
