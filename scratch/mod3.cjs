const fs = require('fs');
let c = fs.readFileSync('scratch/chat.cjs', 'utf8');
c = c.replace('if (originId && destId) {', 'console.log("ORIGIN ID:", originId, "DEST ID:", destId, "ORIGIN STR:", originStr, "DEST STR:", destStr); if (originId && destId) {');
fs.writeFileSync('scratch/chat.cjs', c);
