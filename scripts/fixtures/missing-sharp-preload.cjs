// Simulate the production native-module failure without removing installed files.
const Module = require('node:module');
const originalLoad = Module._load;
Module._load = function(id, ...args) {
  if (id === 'sharp') throw Error('Simulated unavailable Linux native module');
  return originalLoad.call(this, id, ...args);
};
// Turbopack's dynamic ESM external may use a generated package alias.
const originalNative = Module._extensions['.node'];
Module._extensions['.node'] = function(module, filename) {
  if (filename.includes('sharp')) throw Error('Simulated missing native binary');
  return originalNative(module, filename);
};
