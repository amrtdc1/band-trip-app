#!/usr/bin/env node
// Simple helper to switch the active `firebase-init.js` between local and prod variants.
// Usage: `node tools/switch-firebase-init.js local` or `node tools/switch-firebase-init.js prod`

const fs = require('fs');
const path = require('path');

const which = process.argv[2];
const root = path.resolve(__dirname, '..');
const localPath = path.join(root, 'firebase-initLocal.js');
const prodPath = path.join(root, 'firebase-init.prod.js');
const target = path.join(root, 'firebase-init.js');

if (!which || (which !== 'local' && which !== 'prod')) {
  console.error('Usage: node tools/switch-firebase-init.js [local|prod]');
  process.exit(2);
}

const src = which === 'local' ? localPath : prodPath;
if (!fs.existsSync(src)) {
  console.error('Source file not found:', src);
  process.exit(1);
}

fs.copyFileSync(src, target);
console.log(`Switched firebase-init to '${which}' (copied ${path.basename(src)} -> firebase-init.js)`);
