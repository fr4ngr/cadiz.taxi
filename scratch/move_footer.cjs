const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const regex = /(<div style="display:flex; flex-direction:column; gap:6px; font-size:11px; color:var\(--text-secondary\); margin-top:16px; padding-top:12px; border-top:1px solid var\(--border-color\);">[\s\S]*?<\/div>\s*<\/div>)\s*<div id="ree-popup-data"><\/div>/;

// Swap them
code = code.replace(regex, `<div id="ree-popup-data"></div>\n                            $1`);

fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('Moved footer to the very bottom.');
