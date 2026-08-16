const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/MapWidget.astro', 'utf8');

const oldHtml = "${renderMix('MIX ENERGÉTICO ANDALUCÍA', data.and, true)}\n                                        <div style=\"height:1px; background:var(--header-border); margin:16px 0;\"></div>";

code = code.replace(oldHtml, "");

fs.writeFileSync('src/components/widgets/MapWidget.astro', code);
console.log('Removed Andalucian mix from JS.');
