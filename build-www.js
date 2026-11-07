const fs = require('fs');
fs.rmSync('www', { recursive: true, force: true });
fs.mkdirSync('www');
['index.html','support.js','firebase-config.js','sw.js','manifest.webmanifest','icon-192.png','icon-512.png']
  .forEach(f => fs.copyFileSync(f, 'www/' + f));