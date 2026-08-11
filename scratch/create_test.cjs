const fs = require('fs');
let code = fs.readFileSync('scratch/test_bundled2.cjs', 'utf-8');
code = code.replace('como voy de cadiz al aeropuerto de jerez', 'como voy de cadiz a jerez de la frontera');
fs.writeFileSync('scratch/test_bundled3.cjs', code);
