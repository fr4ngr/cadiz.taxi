const fs = require('fs');
const p = 'src/components/tabs/WidgetsTab.astro';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/\\`/g, '`');
c = c.replace(/\\\$/g, '$');
fs.writeFileSync(p, c);
