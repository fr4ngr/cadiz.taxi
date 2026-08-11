const fs = require('fs');
let c = fs.readFileSync('scratch/chat.cjs', 'utf8');
c = c.replace('if (isRoutingQuery) {', 'console.log("ROUTES:", JSON.stringify(transportRoutes, null, 2)); if (isRoutingQuery) {');
fs.writeFileSync('scratch/chat.cjs', c);
