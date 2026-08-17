const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

// Remove window.lastAvionesFilter and window.filterAviones block
code = code.replace(/window\.lastAvionesFilter = null;\s*window\.filterAviones = function\([\s\S]*?filterObj\._markers = \[\];\s*\}/, '');

fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('Removed window.filterAviones');
